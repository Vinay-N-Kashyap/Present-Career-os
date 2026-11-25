// TTS Library & Audio Engine (WebSpeech Native API + Persona Vocal Signatures)
import {
  synthesizeVoice,
  CURRENT_RENDER_TIER,
  isNeuralVoiceTemporarilyUnavailable,
  isVoiceFallbackSignal,
} from "./smartVoiceRouter";
import { sanitizeForSpeech, SANITIZER_VERSION } from "./sanitizeLLM";
import {
  splitIntoSentences,
  getGlobalAudioQueue,
  getAvatarVoiceVolume,
  setAvatarVoiceVolume,
  getAvatarGainNode,
  setAvatarVisemeTimeline,
  clearAvatarVisemeTimeline,
  generateEstimatedVisemes
} from "./audio/streamingAudioQueue";
import { VisemeEvent } from "./avatar/visemeTypes";
export { getAvatarVoiceVolume, setAvatarVoiceVolume };
let currentSpeechId = 0;
let activeSource: AudioBufferSourceNode | null = null;
let isNeuralReady = true;
let activeOnEndCallback: (() => void) | null = null;

const preloadedAudioCacheMap = new Map<string, { buffer: Float32Array; sampleRate: number; teacherId: string }>();

function getAudioContext(): AudioContext {
  // Guard must come BEFORE any window access to be safe during SSR
  if (typeof window === 'undefined') {
    throw new Error('[PinIT TTS] getAudioContext() called in a non-browser environment.');
  }
  const win = window as any;
  if (!win._sharedAudioCtx) {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        win._sharedAudioCtx = new AudioCtxClass();
      }
    } catch (err) {
      console.warn('[PinIT TTS] AudioContext initialization failed:', err);
    }
    const unlockAudio = () => {
      try {
        if (win._sharedAudioCtx && win._sharedAudioCtx.state === 'suspended') {
          win._sharedAudioCtx.resume().catch(() => {});
        }
      } catch {}
    };
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
  }
  try {
    if (win._sharedAudioCtx && win._sharedAudioCtx.state === 'suspended') {
      win._sharedAudioCtx.resume().catch(() => {});
    }
  } catch {}
  return win._sharedAudioCtx;
}

// ── Story Tour audio lock ───────────────────────────────────────────────────
// While the tour narrates it owns the audio channel: non-forced stopSpeaking()
// and speakWithAvatar() calls (page mounts/unmounts, celebrations) are ignored
// instead of cutting the narration off.
type StoryTourWindow = Window & { __PINIT_STORY_TOUR_ACTIVE?: boolean };

export function isStoryTourAudioLocked(): boolean {
  return typeof window !== 'undefined' && (window as StoryTourWindow).__PINIT_STORY_TOUR_ACTIVE === true;
}

export function setStoryTourAudioLock(active: boolean) {
  if (typeof window !== 'undefined') {
    (window as StoryTourWindow).__PINIT_STORY_TOUR_ACTIVE = active;
  }
}

export function stopSpeaking(force = false) {
  if (isStoryTourAudioLocked() && !force) {
    console.log('[PinIT TTS] 🛡️ stopSpeaking() ignored: Story Tour narration is active, protecting playback');
    return;
  }
  currentSpeechId++;
  console.log(`[PinIT TTS] 🛑 stopSpeaking() called. Advancing speechId to ${currentSpeechId}`);

  activeOnEndCallback = null;

  try {
    getGlobalAudioQueue().stopAll();
  } catch (err) {
    console.warn('[PinIT TTS] Failed to stop global audio queue:', err);
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
  if (activeSource) {
    try {
      activeSource.stop();
      activeSource.disconnect();
    } catch {}
    activeSource = null;
  }
}

// KOKORO_VOICE_MAP — must match backend/app/services/audio_router.py exactly.
// Source of truth: audio_router.py. Any change here must be mirrored there.
const KOKORO_VOICE_MAP: Record<string, string> = {
  // Mentors
  priya:    'af_heart',
  anish:    'am_liam',
  akash:    'bm_lewis',
  // Teachers
  kashyap:  'am_fenrir',
  karthic:  'am_adam',
  maya:     'bf_emma',
  divya:    'af_nicole',
  // Legacy
  aisha:    'af_sky',
  rohan:    'am_fenrir',
  // Interviewers
  vikram:   'bm_lewis',
  shalini:  'bf_isabella',
  aditya:   'am_adam',
  neha:     'af_bella',
  rajesh:   'am_liam',
  sneha:    'af_sarah',
  abhijit:  'bm_george',
};

const PERSONA_VOCAL_MATRIX: Record<string, { pitch: number; rateMultiplier: number }> = {
  kashyap:  { pitch: 0.88, rateMultiplier: 1.10 },
  divya:    { pitch: 1.15, rateMultiplier: 1.20 },
  priya:    { pitch: 1.08, rateMultiplier: 1.15 },
  maya:     { pitch: 0.96, rateMultiplier: 1.05 },
  anish:    { pitch: 1.02, rateMultiplier: 1.14 },
  akash:    { pitch: 0.88, rateMultiplier: 1.12 },
  karthic:  { pitch: 0.92, rateMultiplier: 1.18 },
  vikram:   { pitch: 0.84, rateMultiplier: 1.08 },
  aditya:   { pitch: 1.06, rateMultiplier: 1.22 },
  neha:     { pitch: 1.12, rateMultiplier: 1.18 },
  shalini:  { pitch: 1.10, rateMultiplier: 1.12 },
  rajesh:   { pitch: 0.90, rateMultiplier: 1.08 },
  abhijit:  { pitch: 0.86, rateMultiplier: 1.05 },
  sneha:    { pitch: 1.14, rateMultiplier: 1.18 },
  rohan:    { pitch: 0.89, rateMultiplier: 1.15 },
  aisha:    { pitch: 1.05, rateMultiplier: 1.10 }
};

function enhanceTextIntonation(text: string): string {
  let enhanced = text;
  enhanced = enhanced.replace(/\b(important|critical|essential|key|must|danger|catch)\b/gi, '$1!');
  enhanced = enhanced.replace(/\?/g, '?');
  return enhanced;
}

export function detectVibe(text: string): 'happy' | 'motivational' | 'teaching' | 'neutral' {
  const lower = text.toLowerCase();
  if (lower.includes('great') || lower.includes('awesome') || lower.includes('excellent') || lower.includes('fantastic')) return 'happy';
  if (lower.includes('let\'s') || lower.includes('together') || lower.includes('challenge') || lower.includes('build')) return 'motivational';
  if (lower.includes('because') || lower.includes('concept') || lower.includes('means') || lower.includes('step')) return 'teaching';
  return 'neutral';
}

export function getCleanCacheKey(text: string): string {
  const clean = sanitizeForSpeech(text);
  return `${SANITIZER_VERSION}::${clean}`;
}

const MALE_PERSONA_IDS = new Set([
  'anish', 'akash', 'rohan', 'vikram', 'aditya', 'rajesh', 'abhijit', 'kashyap', 'karthic', 'mentor_male',
]);

export function isMalePersona(teacherId: string): boolean {
  const id = (teacherId || '').trim().toLowerCase();
  return MALE_PERSONA_IDS.has(id) || id.startsWith('am_') || id.startsWith('bm_');
}

/**
 * Selects the most natural, strictly gender-matched browser SpeechSynthesisVoice.
 * Ranks Microsoft Online (Natural) / Neural and Google voices ahead of legacy robotic SAPI voices.
 */
export function selectNaturalGenderedVoice<T extends { name: string; lang: string }>(
  voices: T[],
  teacherId: string
): T | undefined {
  if (!Array.isArray(voices) || voices.length === 0) return undefined;
  const trimmedId = (teacherId || '').trim();
  const localeMatch = trimmedId.match(/^([a-z]{2})-[a-z]{2}$/i);
  if (localeMatch && localeMatch[1].toLowerCase() !== 'en') {
    const targetPrefix = localeMatch[1].toLowerCase();
    const localeVoices = voices.filter(v => (v.lang || '').toLowerCase().startsWith(targetPrefix));
    if (localeVoices.length > 0) {
      const natural = localeVoices.find(v => /natural|neural|online|google/i.test(v.name || ''));
      return natural || localeVoices[0];
    }
  }
  const wantMale = isMalePersona(teacherId);
  const enVoices = voices.filter(v => (v.lang || '').toLowerCase().startsWith('en'));
  const pool = enVoices.length > 0 ? enVoices : voices;

  const maleTokens = [
    'guy', 'ryan', 'prabhat', 'andrew', 'brian', 'steffan', 'christopher', 'eric', 'roger', 'george',
    'daniel', 'alex', 'thomas', 'mark', 'david', 'ravi', 'james', 'liam', 'uk english male', 'male',
  ];
  const femaleTokens = [
    'aria', 'jenny', 'neerja', 'ava', 'emma', 'sonia', 'libby', 'michelle', 'ana', 'samantha', 'karen',
    'moira', 'tessa', 'victoria', 'zira', 'heera', 'hazel', 'susan', 'uk english female', 'us english', 'female',
  ];

  const matchesAny = (lowerName: string, tokens: string[]) =>
    tokens.some(tok => {
      const escaped = tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`\\b${escaped}\\b`, 'i');
      if (tok === 'male') return re.test(lowerName) && !/\bfemale\b/i.test(lowerName);
      return re.test(lowerName);
    });

  const scoreVoice = (v: T): number => {
    const n = (v.name || '').toLowerCase();
    const isNatural = n.includes('natural') || n.includes('neural') || n.includes('online');
    const isGoogle = n.includes('google');
    const isLegacyRobotic = n.includes('zira') || n.includes('david') || n.includes('espeak');

    const looksMale = matchesAny(n, maleTokens);
    const looksFemale = matchesAny(n, femaleTokens);

    let score = 0;
    if (wantMale) {
      if (looksMale) score += 100;
      else if (looksFemale) score -= 120;
    } else {
      if (looksFemale) score += 100;
      else if (looksMale) score -= 120;
    }

    if (isNatural) score += 50;
    else if (isGoogle) score += 30;
    if (isLegacyRobotic) score -= 25;
    if ((v.lang || '').toLowerCase() === 'en-in' || (v.lang || '').toLowerCase() === 'en-us' || (v.lang || '').toLowerCase() === 'en-gb') {
      score += 5;
    }
    return score;
  };

  let best = pool[0];
  let bestScore = scoreVoice(best);
  for (let i = 1; i < pool.length; i++) {
    const sc = scoreVoice(pool[i]);
    if (sc > bestScore) {
      best = pool[i];
      bestScore = sc;
    }
  }
  return best;
}

/**
 * Calibrates WebSpeech playback rate to a crisp, natural ~1.25x conversational pace
 * (removing stacked persona multipliers that made Chrome Google / Microsoft Natural voices rush at ~1.5x).
 */
export function resolveWebSpeechRate(
  voiceName?: string,
  difficulty?: 'easy' | 'normal' | 'hard',
  speedMultiplier = 1.0
): number {
  const isGoogleVoice = /google/i.test(voiceName || '');
  const base = isGoogleVoice
    ? (difficulty === 'easy' ? 0.90 : difficulty === 'hard' ? 0.97 : 0.94)
    : (difficulty === 'easy' ? 0.92 : difficulty === 'hard' ? 1.01 : 0.97);
  const safeMult = Math.max(0.85, Math.min(1.15, Number.isFinite(speedMultiplier) ? speedMultiplier : 1.0));
  const raw = base * safeMult;
  const minRate = isGoogleVoice ? 0.84 : 0.86;
  const maxRate = isGoogleVoice ? 1.02 : 1.04;
  return Number(Math.max(minRate, Math.min(maxRate, raw)).toFixed(2));
}

function fallbackWebSpeech(
  cleanText: string,
  teacherId: string,
  onStart: () => void,
  onEnd: () => void,
  vibe: 'happy' | 'motivational' | 'teaching' | 'neutral' = 'neutral',
  speechId = currentSpeechId,
  difficulty?: 'easy' | 'normal' | 'hard',
  speedMultiplier = 1.0,
  maxDurationMs = 25000
) {
  if (speechId !== currentSpeechId) return;
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (speechId === currentSpeechId) onStart();
    const estimatedDuration = Math.min(maxDurationMs, Math.max(2500, cleanText.length * 80));
    setTimeout(() => {
      if (speechId === currentSpeechId) onEnd();
    }, estimatedDuration);
    return;
  }

  try {
    window.speechSynthesis.cancel();
  } catch {}

  const utterance = new SpeechSynthesisUtterance(cleanText);
  let maxDurationTimer: any = null;
  let startWatchdog: any = null;
  let started = false;
  let ended = false;

  const cleanupAndEnd = () => {
    if (ended) return;
    ended = true;
    if (startWatchdog) clearTimeout(startWatchdog);
    if (maxDurationTimer) clearTimeout(maxDurationTimer);
    // Superseded or stopped: cancel() here would kill the NEWER utterance (Chrome
    // fires this utterance's 'interrupted' error asynchronously), and onEnd would
    // be a fake completion.
    if (speechId !== currentSpeechId) return;
    try { window.speechSynthesis.cancel(); } catch {}
    onEnd();
  };

  utterance.onstart = () => {
    if (startWatchdog) {
      clearTimeout(startWatchdog);
      startWatchdog = null;
    }
    if (!started && speechId === currentSpeechId) {
      started = true;
      onStart();
      maxDurationTimer = setTimeout(() => {
        cleanupAndEnd();
      }, Math.max(maxDurationMs, cleanText.length * 120));
    }
  };
  utterance.onend = () => {
    cleanupAndEnd();
  };
  utterance.onerror = () => {
    cleanupAndEnd();
  };

  const speak = () => {
    if (speechId !== currentSpeechId) return;
    const voices = window.speechSynthesis.getVoices();
    const isMale = isMalePersona(teacherId);
    const voice = selectNaturalGenderedVoice(voices, teacherId);

    if (voice) {
      utterance.voice = voice;
    }
    if (/^[a-z]{2}-[a-z]{2}$/i.test((teacherId || '').trim())) {
      utterance.lang = teacherId.trim();
    }

    const vocalPersona = PERSONA_VOCAL_MATRIX[teacherId.toLowerCase()] || { pitch: isMale ? 0.94 : 1.04, rateMultiplier: 1.0 };

    // Keep rate & pitch inside natural ~1.25x conversational range (never rushed 1.5x or chipmunk)
    utterance.rate = resolveWebSpeechRate(voice?.name, difficulty, speedMultiplier);
    utterance.pitch = Math.max(0.88, Math.min(1.08, isMale ? Math.min(0.98, vocalPersona.pitch) : Math.max(1.0, vocalPersona.pitch)));

    if (speechId === currentSpeechId) {
      try {
        window.speechSynthesis.resume();
      } catch {}
      setTimeout(() => {
        if (speechId === currentSpeechId) {
          try { window.speechSynthesis.resume(); } catch {}
          window.speechSynthesis.speak(utterance);
          // Prevent deadlocks if Chrome SpeechSynthesis drops onstart silently
          startWatchdog = setTimeout(() => {
            if (!started && !ended && speechId === currentSpeechId) {
              started = true;
              onStart();
              const estMs = Math.min(maxDurationMs, Math.max(2000, cleanText.length * 65));
              maxDurationTimer = setTimeout(() => cleanupAndEnd(), estMs);
            }
          }, 2500);
        }
      }, 30);
    }
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    let spoken = false;
    let timer: any = null;
    const safeSpeak = () => {
      if (spoken) return;
      spoken = true;
      if (timer) clearTimeout(timer);
      try { window.speechSynthesis.removeEventListener('voiceschanged', safeSpeak); } catch {}
      speak();
    };
    window.speechSynthesis.addEventListener('voiceschanged', safeSpeak, { once: true });
    timer = setTimeout(safeSpeak, 150);
  } else {
    speak();
  }
}

export async function generateTTSAudio(text: string, teacherId: string, vibe = 'neutral', difficulty?: 'easy' | 'normal' | 'hard', speedMultiplier = 1.0): Promise<{ buffer: Float32Array; sampleRate: number }> {
  const baseSpeed = difficulty === 'easy' ? 0.95 : difficulty === 'hard' ? 1.08 : 1.02;
  const targetSpeed = Math.max(0.88, Math.min(1.12, baseSpeed * speedMultiplier));
  const voice = KOKORO_VOICE_MAP[teacherId.toLowerCase()] || 'af_bella';

  try {
    const result = await synthesizeVoice({
      text,
      voice,
      speed: targetSpeed,
    });
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }
    const audioBuf = await ctx.decodeAudioData(result.audioBuffer.slice(0));
    const buffer = audioBuf.getChannelData(0);
    return { buffer, sampleRate: audioBuf.sampleRate };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // In browser sessions synthesizeVoice already tried /api/tts; don't double-call on fallback or 503
    if (isVoiceFallbackSignal(err) || (typeof window !== 'undefined' && /VOICE_BACKEND_DEGRADED_GTTS|TTS HTTP 503/i.test(msg))) {
      throw err;
    }
    console.debug('[PinIT TTS] Primary synthesizeVoice failed in generateTTSAudio, attempting /api/tts proxy fallback:', msg);
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Pinit-Direct': '1',
      },
      body: JSON.stringify({
        text,
        voice,
        speed: targetSpeed,
        emotion: vibe,
      }),
    });
    if (!response.ok || response.headers.get('X-Voice-Fallback') === 'browser-natural' || (response.headers.get('Content-Type') || '').includes('application/json')) {
      throw new Error(`TTS fallback unavailable (${response.status})`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const ctx = getAudioContext();
    const audioBuf = await ctx.decodeAudioData(arrayBuffer);
    const buffer = audioBuf.getChannelData(0);
    return { buffer, sampleRate: audioBuf.sampleRate };
  }
}

const STATIC_AUDIO_MAPPING: Record<string, string> = {
  "welcome to your personal diagnostic assessment first are you a college student a fresh graduate or a working professional": "step0.wav",
  "got it next what is your dream job do you want to build websites work with clouds or build software": "step1.wav",
  "nice choice why did you join today are you looking for a job wanting to learn new skills or preparing for an interview": "step2.wav",
  "understood next question how much coding experience do you have are you a beginner intermediate or advanced coder": "step3.wav",
  "understood how do you prefer to learn do you like reading articles watching videos or writing code hands on": "step4.wav",
  "last question how many hours per week can you dedicate to learning five hours ten hours or more": "step5.wav",
  "fantastic next let s load your identity discovery slides to establish your cognitive styles": "step6.wav"
};

function normalizeKeyForStatic(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

export async function speakWithAvatar(
  text: string,
  teacherId: string,
  onStart: () => void = () => {},
  onEnd: () => void = () => {},
  isMuted = false,
  useNeural = true,
  difficulty?: 'easy' | 'normal' | 'hard',
  speedMultiplier = 1.0,
  maxDurationMs = 15000,
  options?: {
    bypassCache?: boolean;
    minDurationMs?: number;
    /** Take over the audio channel even while the Story Tour lock is held. */
    force?: boolean;
    /** Synthesize the whole text in one request (no sentence streaming). */
    singleShot?: boolean;
    /**
     * Single-request neural path only: if audio hasn't started within this many
     * ms, speak with WebSpeech instead and discard the late neural result.
     */
    startDeadlineMs?: number;
    allowWebSpeechFallback?: boolean;
  }
) {
  if (isStoryTourAudioLocked() && !options?.force) {
    console.log('[PinIT TTS] 🛡️ speakWithAvatar() suppressed: Story Tour narration owns the audio channel');
    try { onEnd(); } catch {}
    return;
  }
  stopSpeaking(true);
  const mySpeechId = currentSpeechId;
  if (!text) {
    try { onEnd(); } catch {}
    return;
  }

  const cleanSpeechText = sanitizeForSpeech(text);
  if (!cleanSpeechText) {
    try { onEnd(); } catch {}
    return;
  }

  if (isMuted) {
    try { onStart(); } catch {}
    const simulatedReadingMs = Math.min(3500, Math.max(1200, cleanSpeechText.length * 35));
    setTimeout(() => {
      if (mySpeechId === currentSpeechId) {
        try { onEnd(); } catch {}
      }
    }, simulatedReadingMs);
    return;
  }

  let ended = false;
  const safeOnEnd = () => {
    if (ended) return;
    ended = true;
    if (activeOnEndCallback === safeOnEnd) {
      activeOnEndCallback = null;
    }
    // Stopped or superseded speech never reports completion: audio sources and
    // utterances still fire 'ended'/'error' when interrupted, and passing that on
    // made callers (the Story Tour) advance twice.
    if (mySpeechId !== currentSpeechId) return;
    try {
      onEnd();
    } catch (err) {
      console.warn('[PinIT TTS] onEnd callback error:', err);
    }
  };
  activeOnEndCallback = safeOnEnd;

  const spokenText = enhanceTextIntonation(cleanSpeechText);
  const minDurationMs = Math.max(0, options?.minDurationMs || 0);
  const dynamicMaxDurationMs = Math.max(maxDurationMs, minDurationMs, Math.max(12000, cleanSpeechText.length * 150));

  // Attempt Static Tier 0 asset playback for canonical diagnostic/onboarding questions
  const staticKey = normalizeKeyForStatic(cleanSpeechText);
  const staticFilename = STATIC_AUDIO_MAPPING[staticKey];
  if (staticFilename) {
    const teacher = (teacherId || 'priya').toLowerCase();
    const audioUrl = `/audio/${teacher}/${staticFilename}`;
    const visemesUrl = `/audio/${teacher}/${staticFilename.replace('.wav', '.visemes.json')}`;

    try {
      const [audioRes, visemesRes] = await Promise.all([
        fetch(audioUrl),
        fetch(visemesUrl).catch(() => null),
      ]);

      if (audioRes.ok && mySpeechId === currentSpeechId) {
        const arrayBuf = await audioRes.arrayBuffer();
        let companionVisemes: VisemeEvent[] | null = null;
        if (visemesRes && visemesRes.ok) {
          try {
            const data = await visemesRes.json();
            companionVisemes = data.events || data;
          } catch {}
        }

        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
          await ctx.resume().catch(() => {});
        }
        const audioBuf = await ctx.decodeAudioData(arrayBuf);
        if (mySpeechId !== currentSpeechId) return;

        const source = ctx.createBufferSource();
        source.buffer = audioBuf;
        const gainNode = getAvatarGainNode(ctx);
        source.connect(gainNode);
        activeSource = source;

        const visemes = companionVisemes || generateEstimatedVisemes(cleanSpeechText, audioBuf.duration);
        setAvatarVisemeTimeline(visemes, ctx.currentTime, ctx);

        let ended = false;
        const finish = () => {
          if (ended) return;
          ended = true;
          clearAvatarVisemeTimeline();
          if (activeSource === source) activeSource = null;
          safeOnEnd();
        };

        source.onended = finish;
        onStart();
        source.start(0);
        return;
      }
    } catch (staticErr) {
      console.warn('[PinIT TTS] Static audio load failed, falling back to neural router:', staticErr);
    }
  }


  const finishAfterFloor = (startedAt: number) => {
    if (mySpeechId !== currentSpeechId) return;
    const elapsed = Date.now() - startedAt;
    const remaining = minDurationMs - elapsed;
    if (remaining > 50) {
      setTimeout(() => {
        safeOnEnd();
      }, remaining);
      return;
    }
    safeOnEnd();
  };

  const allowWebSpeech = options?.allowWebSpeechFallback !== false;
  const isNonEnglishLocale = /^[a-z]{2}-[a-z]{2}$/i.test((teacherId || '').trim()) && !/^en-/i.test((teacherId || '').trim());
  const skipCloudForCooldown = !options?.bypassCache && isNeuralVoiceTemporarilyUnavailable();

  // Attempt Smart Hybrid Voice Router with Sentence Streaming for multi-sentence paragraphs
  if (useNeural && !isNonEnglishLocale && !skipCloudForCooldown) {
    const voice = KOKORO_VOICE_MAP[teacherId.toLowerCase()] || 'af_bella';
    const neuralSpeed = Number(Math.max(0.88, Math.min(1.08, speedMultiplier)).toFixed(2));
    const sentences = options?.singleShot ? [spokenText] : splitIntoSentences(spokenText);

    if (sentences.length > 1) {
      const startedAt = Date.now();
      let streamSucceeded = false;
      let streamStarted = false;
      let lastStartedSentenceIdx = -1;
      const streamDeadlineMs = options?.startDeadlineMs ?? (CURRENT_RENDER_TIER === 'free' ? 6_500 : 5_000);
      let streamDeadlineTimer: any = null;

      try {
        await new Promise<void>((resolve, reject) => {
          if (streamDeadlineMs > 0) {
            streamDeadlineTimer = setTimeout(() => {
              streamDeadlineTimer = null;
              getGlobalAudioQueue().stopAll();
              reject(new Error(`Sentence streaming start deadline exceeded (${streamDeadlineMs}ms)`));
            }, streamDeadlineMs);
          }

          getGlobalAudioQueue().playSentenceStream(
            sentences,
            {
              voice,
              speed: neuralSpeed,
              bypassCache: options?.bypassCache,
              minDurationMs
            },
            {
              onStart: () => {
                if (streamDeadlineTimer) {
                  clearTimeout(streamDeadlineTimer);
                  streamDeadlineTimer = null;
                }
                streamStarted = true;
                onStart();
              },
              onSentenceStart: (idx) => {
                lastStartedSentenceIdx = Math.max(lastStartedSentenceIdx, idx);
              },
              onEnd: () => {
                if (streamDeadlineTimer) {
                  clearTimeout(streamDeadlineTimer);
                  streamDeadlineTimer = null;
                }
                streamSucceeded = true;
                finishAfterFloor(startedAt);
                resolve();
              },
              onError: (err) => {
                if (streamDeadlineTimer) {
                  clearTimeout(streamDeadlineTimer);
                  streamDeadlineTimer = null;
                }
                reject(err);
              }
            }
          ).catch(reject);
        });
        if (streamSucceeded) return;
      } catch (streamErr) {
        if (streamDeadlineTimer) {
          clearTimeout(streamDeadlineTimer);
          streamDeadlineTimer = null;
        }
        if (!isVoiceFallbackSignal(streamErr)) {
          console.debug('[PinIT Voice] Streaming audio queue fallback:', streamErr instanceof Error ? streamErr.message : streamErr);
        }
        if (allowWebSpeech && mySpeechId === currentSpeechId) {
          // If earlier sentences already played neurally, speak ONLY the remaining unplayed tail (zero duplicate speech!)
          const remainingText = streamStarted
            ? sentences.slice(lastStartedSentenceIdx + 1).join(' ').trim()
            : cleanSpeechText;
          if (!remainingText) {
            finishAfterFloor(startedAt);
            return;
          }
          fallbackWebSpeech(
            remainingText,
            teacherId,
            streamStarted ? () => {} : onStart,
            () => finishAfterFloor(Date.now()),
            detectVibe(remainingText),
            mySpeechId,
            difficulty,
            speedMultiplier,
            dynamicMaxDurationMs
          );
        } else {
          if (mySpeechId === currentSpeechId) {
            safeOnEnd();
          }
        }
        return;
      }
    }

    let handedToWebSpeech = false;
    let startDeadlineTimer: ReturnType<typeof setTimeout> | null = null;
    const startDeadlineMs = options?.startDeadlineMs ?? (CURRENT_RENDER_TIER === 'free' ? 6_500 : 5_000);
    if (startDeadlineMs > 0) {
      startDeadlineTimer = setTimeout(() => {
        startDeadlineTimer = null;
        if (mySpeechId !== currentSpeechId) return;
        if (allowWebSpeech) {
          handedToWebSpeech = true;
          console.debug(`[PinIT Voice] Neural audio not ready after ${startDeadlineMs}ms, speaking with gendered natural fallback.`);
          fallbackWebSpeech(
            cleanSpeechText,
            teacherId,
            onStart,
            () => finishAfterFloor(Date.now()),
            detectVibe(cleanSpeechText),
            mySpeechId,
            difficulty,
            speedMultiplier,
            dynamicMaxDurationMs
          );
        } else {
          console.debug(`[PinIT Voice] Neural audio not ready after ${startDeadlineMs}ms. Maintaining silent mode.`);
        }
      }, startDeadlineMs);
    }
    const clearStartDeadline = () => {
      if (startDeadlineTimer) {
        clearTimeout(startDeadlineTimer);
        startDeadlineTimer = null;
      }
    };

    try {
      const result = await synthesizeVoice({
        text: spokenText,
        voice,
        speed: neuralSpeed,
        bypassCache: options?.bypassCache
      });
      // WebSpeech already took over; the synthesized audio stays cached for next time.
      if (handedToWebSpeech) return;
      clearStartDeadline();

      if (mySpeechId === currentSpeechId) {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
          await ctx.resume().catch(() => {});
        }
        const audioBuf = await ctx.decodeAudioData(result.audioBuffer.slice(0));
        // Stopped while resuming/decoding: never start stale audio over newer speech.
        if (mySpeechId !== currentSpeechId) return;

        const source = ctx.createBufferSource();
        source.buffer = audioBuf;
        const gainNode = getAvatarGainNode(ctx);
        source.connect(gainNode);
        activeSource = source;

        const visemes = result.visemes || generateEstimatedVisemes(spokenText, audioBuf.duration);
        setAvatarVisemeTimeline(visemes, ctx.currentTime, ctx);

        let maxDurationTimer: ReturnType<typeof setTimeout> | null = null;
        let ended = false;
        const startedAt = Date.now();
        const finish = () => {
          if (ended) return;
          ended = true;
          if (maxDurationTimer) clearTimeout(maxDurationTimer);
          clearAvatarVisemeTimeline();
          if (activeSource === source) activeSource = null;
          finishAfterFloor(startedAt);
        };

        source.onended = finish;

        onStart();
        source.start(0);
        maxDurationTimer = setTimeout(() => {
          try { source.stop(); } catch {}
          finish();
        }, dynamicMaxDurationMs);
        return;
      }
    } catch (err) {
      if (handedToWebSpeech) return;
      clearStartDeadline();
      if (!isVoiceFallbackSignal(err)) {
        console.debug('[PinIT Voice] Neural TTS unavailable, using gendered natural voice:', err instanceof Error ? err.message : err);
      }
      if (mySpeechId === currentSpeechId) {
        if (allowWebSpeech) {
          fallbackWebSpeech(
            cleanSpeechText,
            teacherId,
            onStart,
            () => finishAfterFloor(Date.now()),
            detectVibe(cleanSpeechText),
            mySpeechId,
            difficulty,
            speedMultiplier,
            dynamicMaxDurationMs
          );
        } else {
          safeOnEnd();
        }
      }
      return;
    }
  }

  // Fallback to gendered WebSpeech if neural synthesis was bypassed or disabled
  if (mySpeechId === currentSpeechId) {
    if (allowWebSpeech) {
      fallbackWebSpeech(
      cleanSpeechText,
      teacherId,
      onStart,
      () => finishAfterFloor(Date.now()),
      detectVibe(cleanSpeechText),
      mySpeechId,
      difficulty,
      speedMultiplier,
      dynamicMaxDurationMs
      );
    } else {
      safeOnEnd();
    }
  }
}

export async function preloadTTS(text?: string, teacherId: string = 'priya', speedMultiplier = 1.0) {
  if (typeof window === 'undefined' || !text) return;
  // Skip background preloading while cloud voice is on browser-natural cooldown (prevents AbortError & 503 console storms)
  if (isNeuralVoiceTemporarilyUnavailable()) return;
  const sanitized = sanitizeForSpeech(text);
  if (!sanitized) return;

  try {
    const voice = KOKORO_VOICE_MAP[teacherId.toLowerCase()] || 'af_bella';
    const neuralSpeed = Number(Math.max(0.88, Math.min(1.08, speedMultiplier)).toFixed(2));
    // Same text transform and speed as speakWithAvatar's single-request path,
    // so the cache key matches what is actually spoken.
    await synthesizeVoice({
      text: enhanceTextIntonation(sanitized),
      voice,
      speed: neuralSpeed
    });
    console.debug(`[PinIT Preloader] Preloaded neural audio into IndexedDB for "${sanitized.slice(0, 30)}..."`);
  } catch (err) {
    if (!isVoiceFallbackSignal(err) && (err as { name?: string })?.name !== 'AbortError') {
      console.debug('[PinIT Preloader] Audio preload deferred:', err instanceof Error ? err.message : err);
    }
  }
}

export function preloadNextSpeech(text: string, teacherId: string) {
  preloadTTS(text, teacherId);
}

export function preloadMultipleSpeeches(
  speeches: string[] | Array<{ text: string; teacherId: string }>,
  defaultTeacherId: string = 'priya'
) {
  if (!Array.isArray(speeches)) return;
  speeches.forEach(s => {
    if (typeof s === 'string') {
      preloadTTS(s, defaultTeacherId);
    } else if (s && typeof s === 'object' && s.text) {
      preloadTTS(s.text, s.teacherId || defaultTeacherId);
    }
  });
}
