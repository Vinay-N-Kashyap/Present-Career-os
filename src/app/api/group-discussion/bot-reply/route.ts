import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { checkRateLimit } from '@/lib/server/rateLimit';
import { isJsonObject, readBoundedJson, RequestBodyError } from '@/lib/server/readBoundedJson';
import { executeGdTurn, GdRoleType, gdPersonaForMentor, gdSafePanelistName, normalizeMentorId } from '@/lib/group-discussion/gdTurnEngine';

let keyIndexA = 0;
let keyIndexB = 0;

function parseKeys(raw: string): string[] {
  return raw.split(',').map(k => k.trim()).filter(k => k.length > 8 && !k.includes('placeholder'));
}

function getActiveKeyForSlot(slot: 'a' | 'b'): string | null {
  const shared = parseKeys(process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '');
  const keysA = parseKeys(process.env.GROQ_API_KEYS_A || process.env.GROQ_API_KEY_A || '');
  const keysB = parseKeys(process.env.GROQ_API_KEYS_B || process.env.GROQ_API_KEY_B || '');
  const poolA = keysA.length ? keysA : shared.length ? [shared[0]] : [];
  const poolB = keysB.length ? keysB : shared.length > 1 ? [shared[1]] : poolA;

  if (slot === 'a') {
    if (!poolA.length) return null;
    const key = poolA[keyIndexA % poolA.length];
    keyIndexA = (keyIndexA + 1) % 1_000_000;
    return key;
  }
  if (!poolB.length) return null;
  const key = poolB[keyIndexB % poolB.length];
  keyIndexB = (keyIndexB + 1) % 1_000_000;
  return key;
}

async function groqComplete(
  slot: 'a' | 'b',
  messages: { role: string; content: string }[],
  systemPrompt: string,
  maxTokens: number
): Promise<string> {
  const key = getActiveKeyForSlot(slot);
  if (!key) throw new Error('No Groq key for GD slot ' + slot);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });
    if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
    const data = await res.json();
    const text = String(data?.choices?.[0]?.message?.content || '').trim();
    if (!text) throw new Error('Empty Groq reply');
    return text;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const rate = checkRateLimit(`gd_turn_user_${gated.user.id}`, { limit: 40, windowMs: 60_000 });
    if (!rate.allowed) {
      return NextResponse.json({ error: 'RATE_LIMIT', message: 'Please wait before requesting more panel replies.' }, { status: 429 });
    }

    const bodyValue = await readBoundedJson<unknown>(req, 96 * 1024);
    if (!isJsonObject(bodyValue)) {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'Expected a JSON object.' }, { status: 400 });
    }
    const body = bodyValue;
    if (body.roleType !== 'avatar_a' && body.roleType !== 'avatar_b') {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'Invalid panel role.' }, { status: 400 });
    }
    const roleType: GdRoleType = body.roleType;
    const requestedMentor = Array.isArray(body.activeMentors) ? body.activeMentors[0] : body.mentorId;
    const mentorId = normalizeMentorId(typeof requestedMentor === 'string' ? requestedMentor : undefined);

    const stringField = (key: string, fallback: string, maxLength: number): string => {
      const value = body[key];
      if (value === undefined || value === null) return fallback;
      if (typeof value !== 'string' || value.length > maxLength) throw new RequestBodyError(`Invalid ${key}.`, 400);
      return value.trim();
    };
    const topic = stringField('roomId', stringField('topic', 'this topic', 200), 200);
    const objective = stringField('objective', stringField('roomDesc', '', 1000), 1000);
    const nextSpeakerName = gdSafePanelistName(stringField('nextSpeakerName', '', 80));
    const allowedDomains = new Set(['technical', 'sales', 'business']);
    const domain = typeof body.domain === 'string' && allowedDomains.has(body.domain) ? body.domain : 'technical';
    const historyValue = body.history === undefined ? [] : body.history;
    if (!Array.isArray(historyValue) || historyValue.length > 12) {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'Discussion context is invalid.' }, { status: 400 });
    }
    let totalHistoryChars = 0;
    const history = historyValue.map((item) => {
      if (!isJsonObject(item) || typeof item.role !== 'string' || typeof item.content !== 'string' || item.content.length > 2500) {
        throw new RequestBodyError('Invalid discussion context.', 400);
      }
      const role = item.role;
      if (!['user', 'assistant', 'Candidate', 'SDE Candidate'].includes(role)) {
        throw new RequestBodyError('Invalid discussion context role.', 400);
      }
      totalHistoryChars += item.content.length;
      if (totalHistoryChars > 20_000) throw new RequestBodyError('Discussion context is too long.', 413);
      return { role, content: item.content };
    });

    const result = await executeGdTurn(
      {
        roleType,
        mentorId,
        topic,
        objective,
        domain,
        difficulty: body.difficulty === 'easy' || body.difficulty === 'hard' ? body.difficulty : 'medium',
        nextSpeakerName: nextSpeakerName || undefined,
        candidateName: 'Candidate',
        speakerPersona: gdPersonaForMentor(mentorId),
        history,
        candidateSilenced: body.candidateSilenced === true,
      },
      groqComplete
    );

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API GD Bot Reply Error]:', err);
    if (err instanceof RequestBodyError) {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: 'Failed to generate boardroom reply' }, { status: 500 });
  }
}
