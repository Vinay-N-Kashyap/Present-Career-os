import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import {
  executeGdTurn,
  type GdDomain,
  type GdDifficulty,
  type GdHistoryMessage,
  type GdRoleType,
} from '@/lib/group-discussion/gdTurnEngine';

export const dynamic = 'force-dynamic';
export const maxDuration = 25;

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
// Live-verified active Groq chat models (llama-3.3-70b-versatile & llama-3.1-8b-instant return 404 on current Groq accounts)
const GD_GROQ_MODELS = [
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
] as const;
const GD_GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-2.5-flash'] as const;
const GD_OPENROUTER_MODELS = [
  'meta-llama/llama-3.1-8b-instruct:free',
  'google/gemma-3-12b-it:free',
] as const;

const TOTAL_LLM_DEADLINE_MS = 8200;
const PER_ATTEMPT_TIMEOUT_MS = 2600;
const USER_RATE_WINDOW_MS = 60_000;
const USER_RATE_MAX_REQUESTS = 24;

// Bounded module-level circuit breaker & per-user burst limiter (zero unbounded memory growth)
const providerCooldownUntil = new Map<string, number>();
const userRequestBuckets = new Map<string, { count: number; resetAt: number }>();

function isCoolingDown(bucketKey: string, now: number): boolean {
  const until = providerCooldownUntil.get(bucketKey);
  if (!until) return false;
  if (now >= until) {
    providerCooldownUntil.delete(bucketKey);
    return false;
  }
  return true;
}

function markCooldown(bucketKey: string, durationMs: number, now: number): void {
  if (providerCooldownUntil.size > 200) {
    providerCooldownUntil.clear();
  }
  providerCooldownUntil.set(bucketKey, now + durationMs);
}

function checkUserBurstLimit(userId: string): boolean {
  const now = Date.now();
  if (userRequestBuckets.size > 5000) {
    for (const [uid, entry] of userRequestBuckets.entries()) {
      if (now >= entry.resetAt) userRequestBuckets.delete(uid);
    }
    if (userRequestBuckets.size > 5000) userRequestBuckets.clear();
  }
  const existing = userRequestBuckets.get(userId);
  if (!existing || now >= existing.resetAt) {
    userRequestBuckets.set(userId, { count: 1, resetAt: now + USER_RATE_WINDOW_MS });
    return true;
  }
  if (existing.count >= USER_RATE_MAX_REQUESTS) {
    return false;
  }
  existing.count += 1;
  return true;
}

export type GdKeySlot = 'a' | 'b';

function isUsableApiKey(raw?: string): boolean {
  const k = (raw || '').trim();
  if (!k || k.length < 10) return false;
  const lower = k.toLowerCase();
  if (lower.startsWith('your_') || lower.includes('changeme') || lower.includes('placeholder') || lower.startsWith('<')) {
    return false;
  }
  return true;
}

/**
 * Dedicated dual-key pool resolver:
 * - Avatar 1 (`slot: 'a'`) -> Groq Key 1 (GROQ_GD_KEY_1 / GROQ_API_KEYS_A / GROQ_API_KEY_A / GROQ_API_KEYS[0])
 * - Avatar 2 (`slot: 'b'`) -> Groq Key 2 (GROQ_GD_KEY_2 / GROQ_API_KEYS_B / GROQ_API_KEY_B / GROQ_API_KEYS[1])
 * Keeps Avatar 1 and Avatar 2 completely isolated on separate API keys so there is zero rate-limit contention or delay.
 */
export function resolveGroqKeysForGdSlot(
  slot: GdKeySlot,
  env: Record<string, string | undefined> = process.env
): { keys: string[]; keySlotLabel: 'key_1' | 'key_2' } {
  const splitKeys = (raw?: string) =>
    (raw || '')
      .split(',')
      .map(s => s.trim())
      .filter(isUsableApiKey);

  const sharedPool = splitKeys(env.GROQ_API_KEYS);
  const slotDedicated =
    slot === 'b'
      ? [
          ...splitKeys(env.GROQ_GD_KEY_2),
          ...splitKeys(env.GROQ_API_KEYS_B),
          ...splitKeys(env.GROQ_API_KEY_B),
          ...(sharedPool.length >= 2 ? [sharedPool[1]] : []),
        ]
      : [
          ...splitKeys(env.GROQ_GD_KEY_1),
          ...splitKeys(env.GROQ_API_KEYS_A),
          ...splitKeys(env.GROQ_API_KEY_A),
          ...(sharedPool.length >= 1 ? [sharedPool[0]] : []),
        ];

  const fallbackPool = [
    ...splitKeys(env.GROQ_API_KEY),
    ...splitKeys(env.NEXT_PUBLIC_GROQ_API_KEY),
    ...sharedPool,
  ];

  // Preserve order and deduplicate so dedicated slot key is ALWAYS tried first
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const k of [...slotDedicated, ...fallbackPool]) {
    if (k && !seen.has(k)) {
      seen.add(k);
      ordered.push(k);
    }
  }

  return {
    keys: ordered,
    keySlotLabel: slot === 'b' ? 'key_2' : 'key_1',
  };
}

export function resolveGdFailoverKeys(
  env: Record<string, string | undefined> = process.env
): { geminiKey: string | null; openRouterKey: string | null } {
  const geminiCandidate = env.GEMINI_API_KEY || env.GOOGLE_API_KEY || env.GOOGLE_AI_KEY || '';
  const openRouterCandidate = env.OPENROUTER_API_KEY || '';
  return {
    geminiKey: isUsableApiKey(geminiCandidate) ? geminiCandidate.trim() : null,
    openRouterKey: isUsableApiKey(openRouterCandidate) ? openRouterCandidate.trim() : null,
  };
}

async function callGdLlmWithFailover(
  slot: GdKeySlot,
  system: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{ text: string; keySlot: 'key_1' | 'key_2'; model: string; provider: 'groq' | 'gemini' | 'openrouter' }> {
  const { keys, keySlotLabel } = resolveGroqKeysForGdSlot(slot);
  const { geminiKey, openRouterKey } = resolveGdFailoverKeys();
  const trimmedHistory = messages.slice(-8);
  const temperature = slot === 'a' ? 0.72 : 0.62;
  const deadline = Date.now() + TOTAL_LLM_DEADLINE_MS;

  const remainingTimeout = () => Math.min(PER_ATTEMPT_TIMEOUT_MS, deadline - Date.now());

  let lastError: Error = new Error('NO_LLM_PROVIDER_AVAILABLE');

  // 1. Primary: Dedicated Groq key pool across fast conversational models with circuit breaker & deadline cap
  for (const key of keys.slice(0, 2)) {
    const keyTag = `groq_key:${key.slice(-6)}`;
    if (isCoolingDown(keyTag, Date.now())) continue;

    for (const model of GD_GROQ_MODELS) {
      const budget = remainingTimeout();
      if (budget < 700) break;

      const modelTag = `${keyTag}:${model}`;
      if (isCoolingDown(modelTag, Date.now())) continue;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), budget);
      const isGptOss = model.startsWith('openai/gpt-oss');
      const isQwen3 = model.startsWith('qwen/qwen3');
      const groqPayload: Record<string, unknown> = {
        model,
        messages: [
          { role: 'system', content: system },
          ...trimmedHistory,
        ],
        temperature,
        // gpt-oss & qwen3 need adequate token headroom so replies NEVER truncate mid-sentence
        max_tokens: isGptOss ? 450 : 300,
      };
      if (isGptOss) {
        groqPayload.reasoning_effort = 'low';
      } else if (isQwen3) {
        groqPayload.reasoning_effort = 'none';
      }

      try {
        const res = await fetch(GROQ_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify(groqPayload),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.status === 401 || res.status === 403) {
          markCooldown(keyTag, 300_000, Date.now());
          lastError = new Error(`GROQ_AUTH_${res.status}`);
          break; // Invalid key: skip all remaining models on this key immediately
        }
        if (res.status === 404) {
          markCooldown(modelTag, 600_000, Date.now());
          lastError = new Error(`GROQ_MODEL_NOT_FOUND_${model}`);
          continue;
        }
        if (res.status === 429 || res.status === 503) {
          markCooldown(modelTag, 25_000, Date.now());
          lastError = new Error(`GROQ_RATE_LIMIT_${res.status}`);
          continue;
        }
        if (!res.ok) {
          lastError = new Error(`GROQ_HTTP_${res.status}`);
          continue;
        }

        const data = await res.json();
        const text = (data?.choices?.[0]?.message?.content || '').trim();
        if (text) {
          return { text, keySlot: keySlotLabel, model, provider: 'groq' };
        }
      } catch (err) {
        clearTimeout(timeout);
        lastError = err instanceof Error ? err : new Error('GROQ_FETCH_ERROR');
      }
    }
    if (deadline - Date.now() < 1500) break;
  }

  // 2. Failover A: Google Gemini Flash (runs with guaranteed time budget even if Groq is throttled)
  if (geminiKey && remainingTimeout() >= 700) {
    const transcriptBlock = trimmedHistory
      .map(m => `${m.role === 'user' ? 'Candidate' : 'Panelist'}: ${m.content}`)
      .join('\n');

    for (const gemModel of GD_GEMINI_MODELS) {
      const budget = remainingTimeout();
      if (budget < 700) break;

      const gemTag = `gemini:${gemModel}`;
      if (isCoolingDown(gemTag, Date.now())) continue;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), budget);
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${gemModel}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: system }] },
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `Live Group Discussion Transcript so far:\n${transcriptBlock}\n\nRespond naturally right now in 1 to 2 crisp spoken sentences (20-34 words max, fits within 3 lines, zero filler):`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature,
                maxOutputTokens: 160,
              },
            }),
            signal: controller.signal,
          }
        );
        clearTimeout(timeout);

        if (res.status === 429 || res.status === 503) {
          markCooldown(gemTag, 25_000, Date.now());
          lastError = new Error(`GEMINI_RATE_LIMIT_${res.status}`);
          continue;
        }
        if (!res.ok) {
          lastError = new Error(`GEMINI_HTTP_${res.status}`);
          continue;
        }

        const data = await res.json();
        const text = (data?.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
        if (text) {
          return { text, keySlot: keySlotLabel, model: gemModel, provider: 'gemini' };
        }
      } catch (err) {
        clearTimeout(timeout);
        lastError = err instanceof Error ? err : new Error('GEMINI_FETCH_ERROR');
      }
    }
  }

  // 3. Failover B: OpenRouter free conversational models
  if (openRouterKey && remainingTimeout() >= 700) {
    for (const orModel of GD_OPENROUTER_MODELS) {
      const budget = remainingTimeout();
      if (budget < 700) break;

      const orTag = `openrouter:${orModel}`;
      if (isCoolingDown(orTag, Date.now())) continue;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), budget);
      try {
        const res = await fetch(OPENROUTER_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://present-career-os.vercel.app',
            'X-Title': 'PinIT Career OS GD Room',
          },
          body: JSON.stringify({
            model: orModel,
            messages: [
              { role: 'system', content: system },
              ...trimmedHistory,
            ],
            temperature,
            max_tokens: 150,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.status === 429 || res.status === 503) {
          markCooldown(orTag, 25_000, Date.now());
          lastError = new Error(`OPENROUTER_RATE_LIMIT_${res.status}`);
          continue;
        }
        if (!res.ok) {
          lastError = new Error(`OPENROUTER_HTTP_${res.status}`);
          continue;
        }

        const data = await res.json();
        const text = (data?.choices?.[0]?.message?.content || '').trim();
        if (text) {
          return { text, keySlot: keySlotLabel, model: orModel, provider: 'openrouter' };
        }
      } catch (err) {
        clearTimeout(timeout);
        lastError = err instanceof Error ? err : new Error('OPENROUTER_FETCH_ERROR');
      }
    }
  }

  console.warn(`[GD Bot Reply API] All LLM providers failed for slot=${slot}:`, lastError.message);
  throw lastError;
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUserFromRequest(req);
    if (auth.error) {
      return auth.error;
    }

    if (auth.user?.id && !checkUserBurstLimit(auth.user.id)) {
      return NextResponse.json(
        { error: 'RATE_LIMITED', message: 'Slow down a moment before sending the next GD turn.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const roleType: GdRoleType =
      body.roleType === 'avatar_a' || body.roleType === 'avatar_b' || body.roleType === 'host'
        ? body.roleType
        : body.slot === 'b'
          ? 'avatar_b'
          : 'avatar_a';

    // Strict key mapping: Avatar 1 -> Key 1 ('a'), Avatar 2 -> Key 2 ('b')
    const slot: GdKeySlot =
      roleType === 'avatar_b' || body.slot === 'b' ? 'b' : 'a';

    const mentorId = typeof body.mentorId === 'string' && body.mentorId.trim()
      ? body.mentorId
      : typeof body.avatarId === 'string' && body.avatarId.trim()
        ? body.avatarId
        : 'rohan';

    const topic = typeof body.topic === 'string' && body.topic.trim()
      ? body.topic.trim().slice(0, 200)
      : 'Will AI Coding Agents Replace Junior Developers or Supercharge Them?';

    const objective = typeof body.objective === 'string' ? body.objective.trim().slice(0, 240) : '';
    const domain: GdDomain =
      body.domain === 'sales' || body.domain === 'business' || body.domain === 'commerce'
        ? body.domain
        : 'technical';
    const difficulty: GdDifficulty =
      body.difficulty === 'easy' || body.difficulty === 'hard'
        ? body.difficulty
        : 'medium';

    const candidateName = typeof body.candidateName === 'string' && body.candidateName.trim()
      ? body.candidateName.trim().slice(0, 60)
      : 'Candidate';

    const lastChallengerName = typeof body.lastChallengerName === 'string'
      ? body.lastChallengerName.trim().slice(0, 60)
      : undefined;

    const lastChallengerText = typeof body.lastChallengerText === 'string'
      ? body.lastChallengerText.trim().slice(0, 500)
      : undefined;

    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const history: GdHistoryMessage[] = rawHistory
      .slice(-10)
      .map((m: Record<string, unknown>) => {
        const sender = typeof m.sender === 'string' ? m.sender : '';
        const roleRaw = typeof m.role === 'string' ? m.role.toLowerCase() : '';
        const isUser =
          roleRaw === 'user' ||
          roleRaw === 'candidate' ||
          roleRaw === 'participant' ||
          roleRaw === 'sde candidate' ||
          sender === 'You';
        return {
          role: isUser ? 'user' : 'assistant',
          sender: sender || (isUser ? candidateName : 'Panelist'),
          content: typeof m.content === 'string' ? m.content.slice(0, 500) : '',
        } as GdHistoryMessage;
      })
      .filter((m: GdHistoryMessage) => m.content.trim().length > 0);

    let usedKeySlot: 'key_1' | 'key_2' = slot === 'b' ? 'key_2' : 'key_1';
    let usedModel = 'deterministic-fallback';
    let usedProvider: 'groq' | 'gemini' | 'openrouter' | 'fallback' = 'fallback';

    const result = await executeGdTurn(
      {
        roleType,
        mentorId,
        topic,
        objective,
        domain,
        difficulty,
        candidateName,
        history,
        lastChallengerName,
        lastChallengerText,
      },
      async (system, messages) => {
        const res = await callGdLlmWithFailover(slot, system, messages);
        usedKeySlot = res.keySlot;
        usedModel = res.model;
        usedProvider = res.provider;
        return res.text;
      }
    );

    return NextResponse.json({
      reply: result.reply,
      roleType: result.roleType,
      mentorId: result.mentorId,
      displayName: result.displayName,
      wordCount: result.wordCount,
      usedFallback: result.usedFallback,
      keySlot: usedKeySlot,
      model: usedModel,
      provider: result.usedFallback ? 'fallback' : usedProvider,
    });
  } catch (err) {
    console.error('[GD Bot Reply API] error:', err);
    return NextResponse.json({
      reply: 'Fair point, though the real test is what happens once teams hit tight deadlines and real customers. If we keep it simple, which single trade-off matters most to you here?',
      usedFallback: true,
      keySlot: 'key_1',
      provider: 'fallback',
    });
  }
}
