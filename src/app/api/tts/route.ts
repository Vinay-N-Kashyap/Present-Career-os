import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

/**
 * PinIT Voice Cache — Next.js Neural TTS Router
 *
 * Tier 1: Groq Orpheus Neural TTS (`canopylabs/orpheus-v1-english` — ~400ms, distinct human male/female voices, 0ms cold start)
 * Tier 2: Self-hosted Render Kokoro-82M v1.0 INT8 (`pinit-voice-service.onrender.com/api/v1/tts`)
 * Gender Guard: Rejects degraded genderless gTTS audio from legacy Render builds so male avatars never speak in robotic female gTTS.
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const GROQ_TTS_ENDPOINT = 'https://api.groq.com/openai/v1/audio/speech';
const GROQ_TTS_MODEL = 'canopylabs/orpheus-v1-english';

let groqOrpheusCooldownUntil = 0;
let renderDegradedCooldownUntil = 0;

const MALE_VOICE_NAMES = new Set([
  'anish', 'akash', 'rohan', 'vikram', 'aditya', 'rajesh', 'abhijit', 'kashyap', 'karthic', 'mentor_male',
]);

export function isMaleVoiceId(voice: string): boolean {
  const v = (voice || '').trim().toLowerCase();
  if (!v) return false;
  return v.startsWith('am_') || v.startsWith('bm_') || MALE_VOICE_NAMES.has(v);
}

/**
 * Maps every Kokoro voice ID or persona name to a distinct, gender-accurate Groq Orpheus human voice.
 * Female voices: autumn, diana, hannah | Male voices: daniel, austin, troy
 */
export function resolveOrpheusVoice(voice: string): 'autumn' | 'diana' | 'hannah' | 'daniel' | 'austin' | 'troy' {
  const v = (voice || 'af_heart').trim().toLowerCase();
  const map: Record<string, 'autumn' | 'diana' | 'hannah' | 'daniel' | 'austin' | 'troy'> = {
    // Female personas & Kokoro IDs
    priya: 'autumn',
    af_heart: 'autumn',
    sneha: 'hannah',
    af_sarah: 'hannah',
    neha: 'autumn',
    af_bella: 'autumn',
    divya: 'diana',
    af_nicole: 'diana',
    aisha: 'diana',
    af_sky: 'diana',
    maya: 'hannah',
    bf_emma: 'hannah',
    shalini: 'diana',
    bf_isabella: 'diana',
    mentor_female: 'autumn',
    // Male personas & Kokoro IDs
    rohan: 'daniel',
    am_fenrir: 'daniel',
    kashyap: 'troy',
    vikram: 'troy',
    akash: 'troy',
    bm_lewis: 'troy',
    abhijit: 'daniel',
    bm_george: 'daniel',
    anish: 'austin',
    rajesh: 'austin',
    am_liam: 'austin',
    aditya: 'daniel',
    karthic: 'austin',
    am_adam: 'daniel',
    mentor_male: 'daniel',
  };
  if (map[v]) return map[v];
  return isMaleVoiceId(v) ? 'daniel' : 'autumn';
}

/**
 * Detects degraded genderless gTTS output from an older/misconfigured Render container
 * (missing X-Voice-Engine header + audio/wav content-type wrapping MPEG-2 0xFF 0xF3 MP3 bytes).
 */
export function isDegradedGenderlessGtts(
  audioBuffer: ArrayBuffer,
  engineHeader: string | null,
  contentType: string
): boolean {
  if (engineHeader && /kokoro|orpheus|edge-tts/i.test(engineHeader)) {
    return false;
  }
  const bytes = new Uint8Array(audioBuffer);
  const isMpeg2Mp3 = bytes.length >= 2 && bytes[0] === 0xff && (bytes[1] === 0xf3 || bytes[1] === 0xf2);
  if (!engineHeader && isMpeg2Mp3 && contentType.toLowerCase().includes('wav')) {
    return true;
  }
  return false;
}

function resolveGroqTtsKeys(): string[] {
  const raw = [
    process.env.GROQ_API_KEY,
    process.env.NEXT_PUBLIC_GROQ_API_KEY,
    ...(process.env.GROQ_API_KEYS || '').split(','),
  ];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    const k = (item || '').trim();
    if (k.length >= 10 && !k.toLowerCase().startsWith('your_') && !seen.has(k)) {
      seen.add(k);
      out.push(k);
    }
  }
  return out;
}

async function tryGroqOrpheusTts(text: string, voice: string): Promise<{ buffer: ArrayBuffer; orpheusVoice: string } | null> {
  if (Date.now() < groqOrpheusCooldownUntil) return null;
  const keys = resolveGroqTtsKeys();
  if (keys.length === 0) return null;

  const orpheusVoice = resolveOrpheusVoice(voice);
  const input = text.trim();
  // Groq Orpheus enforces a strict 200-char per-request limit; let Render Kokoro handle >200-char single-shot payloads without truncation.
  if (!input || input.length > 200) return null;

  for (const key of keys.slice(0, 2)) {
    try {
      const res = await fetch(GROQ_TTS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: GROQ_TTS_MODEL,
          input,
          voice: orpheusVoice,
          response_format: 'wav',
        }),
        signal: AbortSignal.timeout(7000),
      });

      if (res.ok) {
        const buffer = await res.arrayBuffer();
        if (buffer.byteLength > 1000) {
          return { buffer, orpheusVoice };
        }
      } else {
        const errBody = await res.text().catch(() => '');
        if (res.status === 400 && /terms acceptance/i.test(errBody)) {
          // 60s cooldown so once the owner clicks Accept Terms on Groq Console, it auto-activates within <= 60s
          groqOrpheusCooldownUntil = Date.now() + 60_000;
          console.warn('[/api/tts] Groq Orpheus terms not accepted yet — falling through to Render Kokoro.');
          return null;
        }
        if (res.status === 429 || res.status === 503) {
          groqOrpheusCooldownUntil = Date.now() + 30_000;
          continue;
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}

function getBackendUrl(): string {
  const raw = process.env.NEXT_PUBLIC_TTS_API_URL || 'https://pinit-voice-service.onrender.com';
  const clean = raw.trim().replace(/\/+$/, '').replace(/\/api(\/v\d+)?\/tts\/?$/i, '').replace(/\/tts\/?$/i, '');
  return `${clean}/api/v1/tts`;
}

const CDN_URL = process.env.NEXT_PUBLIC_CDN_VOICE_URL || '';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    let userId = 'guest_user';
    if (authHeader) {
      const gated = await requireUserFromRequest(req);
      if (gated.user) {
        userId = gated.user.id;
      }
    }

    const body = await req.json();
    const {
      text,
      voice = 'af_heart',
      language = 'en',
      speed = 1.0,
      emotion = 'neutral',
      version = 'v2.0',
      sample_rate = 24000,
      context = 'avatar',
      cacheKey,
      bypass_cache = false,
    } = body;
    const bypassCache = Boolean(bypass_cache) || req.headers.get('X-Bypass-Cache') === 'true';

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
    }

    const cleanText = String(text).trim();
    const maleRequested = isMaleVoiceId(voice);

    if (CDN_URL && cacheKey) {
      const cdnUrl = `${CDN_URL}/${language}/${cacheKey}.mp3`;
      try {
        const cdnCheck = await fetch(cdnUrl, { method: 'HEAD' });
        if (cdnCheck.ok) {
          const audioRes = await fetch(cdnUrl);
          const audioBuffer = await audioRes.arrayBuffer();
          return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'audio/mpeg',
              'X-Cache-Status': 'CDN_HIT',
              'X-Cache-Key': cacheKey,
              'Cache-Control': 'private, max-age=3600',
            },
          });
        }
      } catch (cdnErr: any) {
        console.warn(`[/api/tts] CDN lookup failed: ${cdnErr?.message}`);
      }
    }

    // Tier 1: Groq Orpheus Neural TTS (instant ~400ms, 0ms cold start, distinct human male/female voices)
    const orpheus = await tryGroqOrpheusTts(cleanText, voice);
    if (orpheus) {
      const estDur = Math.max(0.6, cleanText.length / (14.5 * Math.max(0.6, Number(speed) || 1.0)));
      return new NextResponse(orpheus.buffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/wav',
          'X-Cache-Status': 'GENERATED',
          'X-Cache-Key': cacheKey ?? '',
          'X-Engine': `groq-orpheus-${orpheus.orpheusVoice}`,
          'X-Voice-Engine': `groq-orpheus-${orpheus.orpheusVoice}`,
          'X-Duration': estDur.toFixed(2),
          'X-Audio-Duration': estDur.toFixed(2),
          'Cache-Control': 'private, max-age=3600',
        },
      });
    }

    // Tier 2: Self-hosted Render Kokoro-82M v1.0 INT8 Neural TTS
    if (Date.now() < renderDegradedCooldownUntil && !bypassCache) {
      return NextResponse.json(
        {
          error: 'VOICE_BACKEND_DEGRADED_GTTS',
          message: 'Render voice service is on legacy gTTS cooldown; redeploy voice-service with Kokoro v1.0 INT8 or accept Groq Orpheus terms.',
        },
        { status: 503 }
      );
    }

    const ttsStart = Date.now();
    const backendUrl = getBackendUrl();

    const backendRes = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanText,
        voice,
        language,
        speed,
        emotion,
        version,
        sample_rate,
        context,
        bypass_cache: bypassCache,
      }),
      signal: AbortSignal.timeout(22000),
    });

    const roundtripMs = Date.now() - ttsStart;

    if (!backendRes.ok) {
      const errText = await backendRes.text();
      console.error(`[/api/tts] Backend returned error status ${backendRes.status} (${roundtripMs}ms):`, errText.slice(0, 300));
      return NextResponse.json(
        { error: `Voice backend error: ${backendRes.status}`, details: errText.slice(0, 180) },
        { status: backendRes.status },
      );
    }

    const audioBuffer = await backendRes.arrayBuffer();
    const cacheStatus = backendRes.headers.get('X-Cache-Status') ?? 'GENERATED';
    const returnedKey = backendRes.headers.get('X-Cache-Key') ?? cacheKey ?? '';
    const rawEngineHeader = backendRes.headers.get('X-Voice-Engine') || backendRes.headers.get('X-Engine');
    const duration = backendRes.headers.get('X-Duration') ?? '0';
    const contentType = backendRes.headers.get('Content-Type') ?? 'audio/wav';

    // Reject degraded genderless gTTS output from an older Render deploy so male avatars NEVER speak in robotic female gTTS!
    if (isDegradedGenderlessGtts(audioBuffer, rawEngineHeader, contentType)) {
      renderDegradedCooldownUntil = Date.now() + 60_000;
      console.warn(`[/api/tts] Detected degraded genderless gTTS response from Render (voice=${voice}, male=${maleRequested}). Rejecting for 60s to protect neural gender fidelity.`);
      return NextResponse.json(
        {
          error: 'VOICE_BACKEND_DEGRADED_GTTS',
          message: 'Render voice service is running legacy gTTS fallback; redeploy voice-service with Kokoro v1.0 INT8 or accept Groq Orpheus terms.',
        },
        { status: 503 }
      );
    }
    renderDegradedCooldownUntil = 0;

    const engine = rawEngineHeader ?? 'kokoro-v1.0-int8';
    const visemesHeader = backendRes.headers.get('X-Visemes');
    const durationHeader = backendRes.headers.get('X-Audio-Duration') || duration;
    const responseHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'X-Cache-Status': cacheStatus,
      'X-Cache-Key': returnedKey,
      'X-Engine': engine,
      'X-Voice-Engine': engine,
      'X-Duration': durationHeader,
      'X-Audio-Duration': durationHeader,
      'Cache-Control': 'private, max-age=3600',
    };
    if (visemesHeader) {
      responseHeaders['X-Visemes'] = visemesHeader;
    }

    console.log(`[/api/tts] Neural TTS OK (${roundtripMs}ms) user=${userId} engine=${engine} bytes=${audioBuffer.byteLength}`);
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (err: any) {
    const isTimeout = err?.name === 'TimeoutError' || err?.name === 'AbortError';
    console.error(`[/api/tts] Proxy Execution Failure (${isTimeout ? 'TIMEOUT' : 'ERROR'}):`, err?.message || err);
    return NextResponse.json(
      { error: isTimeout ? 'Voice server cold-start timeout' : (err.message || 'Internal error') },
      { status: isTimeout ? 408 : 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'PinIT Neural TTS Router active',
    engines: ['groq-orpheus', 'render-kokoro-v1.0-int8'],
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID, X-Internal-Secret, X-Bypass-Cache',
      'Access-Control-Max-Age': '86400',
    },
  });
}
