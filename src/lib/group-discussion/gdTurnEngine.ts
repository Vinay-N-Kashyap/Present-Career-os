/**
 * Deterministic Group Discussion (GD) Turn Engine.
 *
 * Enforces:
 * - Strict turn loop: Host Intro & Rules -> User Speaks -> Avatar 1 (Argues / Challenges) -> Avatar 2 (Diplomatic Synthesis of BOTH) -> User Speaks.
 * - Selected AI Mentor exclusion: if user picked Priya (or any mentor) as their AI Mentor, that mentor CANNOT be selected as GD Host.
 * - Host time-check interruptions between talks at 5 minutes remaining and 1 minute remaining.
 * - Short, simple, punchy avatar turns: minimum 2 lines, maximum 3.5 lines (~28-54 words, 2-3 complete sentences, never cut mid-sentence).
 * - Direct Q&A + Zero Hallucination: avatars answer user questions directly and never invent claims the user did not make.
 */

export type GdRoleType = 'host' | 'avatar_a' | 'avatar_b';
export type GdDomain = 'technical' | 'sales' | 'business' | 'commerce';
export type GdDifficulty = 'easy' | 'medium' | 'hard';

export interface GdHistoryMessage {
  role: 'user' | 'assistant';
  sender?: string;
  content: string;
}

export interface GdTurnRequest {
  roleType: GdRoleType;
  mentorId: string;
  topic: string;
  objective?: string;
  domain: GdDomain;
  difficulty: GdDifficulty;
  candidateName?: string;
  history: GdHistoryMessage[];
  lastChallengerName?: string;
  lastChallengerText?: string;
}

export interface GdTurnResult {
  reply: string;
  roleType: GdRoleType;
  mentorId: string;
  displayName: string;
  wordCount: number;
  usedFallback: boolean;
}

export interface GdCommonRule {
  id: string;
  title: string;
  detail: string;
  icon: string;
}

export interface GdPersonaVoice {
  id: string;
  displayName: string;
  signatureStyle: string;
  challengerAngle: string;
  diplomatAngle: string;
  openerStyle: string;
}

/** Target GD speech budget: strictly <= 3 visual lines (~18-36 words, 1-2 razor-sharp sentences, zero filler). */
export const GD_TARGET_WORDS_MIN = 16;
export const GD_TARGET_WORDS_MAX = 36;

/** Common real-world Group Discussion rules displayed in the room & explained by the Host. */
export const GD_COMMON_RULES: GdCommonRule[] = [
  {
    id: 'one_speaker',
    icon: '🎙️',
    title: 'One Speaker at a Time',
    detail: 'Follow the live turn order: You open or respond, Avatar 1 challenges, Avatar 2 balances both views, then the floor returns to you.'
  },
  {
    id: 'crisp_turns',
    icon: '⏱️',
    title: 'Keep Points Short & Clear',
    detail: 'Make one clear argument with a reason or real example in 2–4 crisp lines instead of long speeches.'
  },
  {
    id: 'attack_ideas',
    icon: '🧠',
    title: 'Challenge Ideas, Never People',
    detail: 'Disagree politely with evidence, numbers, or trade-offs—stay respectful and constructive.'
  },
  {
    id: 'direct_answers',
    icon: '🎯',
    title: 'Listen & Answer Directly',
    detail: 'Build on or directly answer what was just said. Ask sharp questions when you want panelists to clarify.'
  },
  {
    id: 'time_checks',
    icon: '🔔',
    title: 'Respect Host Time Checks',
    detail: 'The Host will step in between talks at 5 minutes left and 1 minute left so the panel can converge cleanly.'
  }
];

export const MENTOR_NAMES: Record<string, string> = {
  priya: 'Ms. Priya',
  anish: 'Mr. Anish',
  rohan: 'Mr. Rohan',
  sneha: 'Ms. Sneha',
  akash: 'Mr. Akash',
  vikram: 'Mr. Vikram',
  divya: 'Ms. Divya',
  aisha: 'Ms. Aisha',
  kashyap: 'Mr. Kashyap',
};

/** Ordered list of mentors eligible to host a GD room (excluding whichever mentor is the user's AI Mentor). */
export const GD_HOST_POOL: string[] = [
  'akash',
  'sneha',
  'vikram',
  'anish',
  'aisha',
  'rohan',
  'divya',
  'kashyap',
  'priya',
];

/** Distinct, memorable communication voices so no two avatars sound identical. */
export const GD_PERSONA_PROFILES: Record<string, GdPersonaVoice> = {
  priya: {
    id: 'priya',
    displayName: 'Ms. Priya',
    signatureStyle: 'Warm, crisp, structured mentor tone using plain everyday analogies.',
    challengerAngle: 'tests whether the idea works for real people on day one, not just on slides',
    diplomatAngle: 'connects human impact with practical execution steps',
    openerStyle: 'Direct, empathetic, clear'
  },
  akash: {
    id: 'akash',
    displayName: 'Mr. Akash',
    signatureStyle: 'Calm boardroom chair with crisp executive transitions and sharp summaries.',
    challengerAngle: 'challenges hidden operational costs and long-term sustainability',
    diplomatAngle: 'frames a phased two-step compromise both sides can measure',
    openerStyle: 'Measured, crisp, authoritative'
  },
  sneha: {
    id: 'sneha',
    displayName: 'Ms. Sneha',
    signatureStyle: 'Energetic, story-first communicator who asks sharp "what happens to the customer?" questions.',
    challengerAngle: 'pokes holes in user adoption, trust, and real-world customer behavior',
    diplomatAngle: 'blends user empathy with realistic business guardrails',
    openerStyle: 'Conversational, lively, customer-focused'
  },
  vikram: {
    id: 'vikram',
    displayName: 'Mr. Vikram',
    signatureStyle: 'Pragmatic, numbers-first realist who speaks in simple unit economics and trade-offs.',
    challengerAngle: 'presses on ROI, cash burn, governance, and compliance risk',
    diplomatAngle: 'aligns bold ambition with measurable financial milestones',
    openerStyle: 'Grounded, analytical, plain-spoken'
  },
  rohan: {
    id: 'rohan',
    displayName: 'Mr. Rohan',
    signatureStyle: 'Fast-thinking, curious builder who loves concrete examples and practical stress tests.',
    challengerAngle: 'calls out scale bottlenecks, edge cases, and execution delays',
    diplomatAngle: 'merges quick experiments with safe fallback plans',
    openerStyle: 'Punchy, direct, builder mindset'
  },
  divya: {
    id: 'divya',
    displayName: 'Ms. Divya',
    signatureStyle: 'Thoughtful strategist who spots blind spots and bridges opposite viewpoints smoothly.',
    challengerAngle: 'questions unintended side effects and long-term market shifts',
    diplomatAngle: 'highlights the shared goal beneath both arguments and proposes a smart middle path',
    openerStyle: 'Poised, insightful, unifying'
  },
  aisha: {
    id: 'aisha',
    displayName: 'Ms. Aisha',
    signatureStyle: 'Sharp, confident debater with crisp rhetorical contrast and zero fluff.',
    challengerAngle: 'exposes weak assumptions and demands proof over hype',
    diplomatAngle: 'synthesizes speed and safety into one clear decision rule',
    openerStyle: 'Incisive, bold, articulate'
  },
  kashyap: {
    id: 'kashyap',
    displayName: 'Mr. Kashyap',
    signatureStyle: 'Skeptical devil\'s advocate who challenges conventional wisdom with witty realism.',
    challengerAngle: 'stress-tests worst-case failure modes and competitive pushback',
    diplomatAngle: 'turns a heated clash into a disciplined pilot with clear exit criteria',
    openerStyle: 'Candid, witty, sharp'
  },
  anish: {
    id: 'anish',
    displayName: 'Mr. Anish',
    signatureStyle: 'Clear, upbeat moderator who keeps debates lively, fair, and easy to follow.',
    challengerAngle: 'questions whether the team actually has the bandwidth to pull it off',
    diplomatAngle: 'pulls the best insight from each speaker into one simple takeaway',
    openerStyle: 'Friendly, brisk, structured'
  },
};

export function getGdPersonaVoice(mentorId: string): GdPersonaVoice {
  const normalized = normalizeMentorId(mentorId);
  return GD_PERSONA_PROFILES[normalized] || GD_PERSONA_PROFILES.akash;
}

export function normalizeMentorId(raw?: string | null): string {
  const s = (raw || 'priya').trim().toLowerCase();
  const base = s.split('_')[0];
  return MENTOR_NAMES[base] ? base : 'priya';
}

export function gdDisplayName(mentorId: string): string {
  const id = normalizeMentorId(mentorId);
  return MENTOR_NAMES[id] || 'Mr. Akash';
}

/**
 * Floating 3D Mentor is ALWAYS the user's selected AI mentor (defaults to Priya).
 */
export function resolveFloatingMentorId(
  input?: string | null | { guidanceMentorId?: string | null; selectedTeacherId?: string | null }
): string {
  if (typeof input === 'string') return normalizeMentorId(input);
  if (input && typeof input === 'object') {
    return normalizeMentorId(input.guidanceMentorId || input.selectedTeacherId || 'priya');
  }
  return 'priya';
}

/**
 * Returns true ONLY if `avatarId` is allowed to host the GD room.
 * Rule: If the user selected a mentor (e.g. Priya) as their AI Mentor, they CANNOT take that mentor as GD Host.
 */
export function isAvatarEligibleAsGdHost(avatarId: string, userGuidanceMentorId?: string | null): boolean {
  const candidate = normalizeMentorId(avatarId);
  const mentor = resolveFloatingMentorId(userGuidanceMentorId);
  return candidate !== mentor;
}

/**
 * Returns all eligible GD Host IDs (strictly excluding the user's selected AI Mentor).
 */
export function getEligibleGdHosts(userGuidanceMentorId?: string | null): string[] {
  const mentor = resolveFloatingMentorId(userGuidanceMentorId);
  return GD_HOST_POOL.filter(id => id !== mentor);
}

/**
 * Resolves the GD Host ID, guaranteeing the Host is NEVER the user's selected AI Mentor.
 * If `preferredHostId` is provided and eligible, uses it; otherwise defaults cleanly
 * (preserving `'anish'` fallback when mentor is `'priya'` and no preferred host is set,
 * or selecting the first eligible non-mentor host).
 */
export function resolveGdHostId(userGuidanceMentorId?: string | null, preferredHostId?: string | null): string {
  const floating = resolveFloatingMentorId(userGuidanceMentorId);
  if (preferredHostId) {
    const preferred = normalizeMentorId(preferredHostId);
    if (preferred !== floating) return preferred;
  }
  return floating === 'priya' ? 'anish' : 'priya';
}

/**
 * Detects whether the user's message contains a direct question that panelists MUST answer.
 */
export function detectDirectQuestion(text: string): boolean {
  const trimmed = (text || '').trim();
  if (!trimmed) return false;
  if (trimmed.includes('?')) return true;
  return /^(what|why|how|when|where|who|which|can|could|should|would|do|does|is|are|will)\b/i.test(trimmed);
}

/**
 * Detects when the user expresses confusion, asks for simpler language, says the conversation feels robotic/AI-like,
 * wants to skip, or utters a very short regional/non-substantive response (e.g. "I didn't get it", "too complex", "gotila").
 */
export function detectUserConfusionOrMeta(text: string): boolean {
  const trimmed = (text || '').trim().toLowerCase();
  if (!trimmed) return true;

  const confusionPattern =
    /\b(didn'?t get|don'?t get|don'?t know|do not know|no idea|not sure|please explain|explain (?:the |this |what)|what(?:'s| is) the situation|wait what|don'?t understand|can'?t understand|cannot understand|not understanding|confused|too complex|bit complex|very complex|complicated|too direct|speaking with.*ai|talking to.*ai|like an? ai|sound.*robotic|want to skip|skip this|let'?s skip|gotila|gottilla|gothilla|pardon|come again|say that again|simpler|plain english|in simple)\b/i;
  if (confusionPattern.test(trimmed)) return true;

  // Ultra-short non-substantive filler replies (1-2 words like "ok", "yes", "hmm", "sorry", "gotila")
  const words = trimmed.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  if (words.length <= 2) return true;

  return false;
}

/**
 * Detects when the candidate is explicitly asking for a concrete solution, action plan, or solution clarification
 * (e.g. "what is the solution?", "is there any solutions you can offer", "what I didn't get the solution", "how are we doing it?").
 */
export function detectSolutionRequest(text: string): boolean {
  const trimmed = (text || '').trim().toLowerCase();
  if (!trimmed) return false;
  return /\b(what(?:'s| is) the solution|need a solution|proper solution|any solutions?|offer (?:a )?solutions?|give (?:me |us )?(?:a )?solutions?|explain the solution|didn'?t get the solution|don'?t get the solution|for solutions?|how (?:are we|do we|can we|should we) (?:do|doing|fix|solve|handle)|what(?:'s| is) the fix|analyze the problem|understand the problem|what the problem is)\b/i.test(
    trimmed
  );
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'your', 'have', 'just', 'like', 'into',
  'when', 'what', 'where', 'which', 'would', 'could', 'should', 'about', 'there', 'their', 'they',
  'them', 'then', 'than', 'only', 'also', 'been', 'will', 'does', 'dont', 'cant', 'wont', 'youre',
  'theyre', 'thats', 'heres', 'candidate', 'floor', 'really', 'actually', 'think',
]);

function normalizeWords(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Detects host-intro echoes, mid-sentence truncated fragments, or repetitive paraphrasing/copying
 * of recent panelist turns (e.g. repeating "super-fast calculator" or "trainee chef" across turns).
 */
export function isRepetitiveOrBrokenGdReply(
  reply: string,
  recentPanelistTexts: string[],
  roleType: GdRoleType = 'avatar_a'
): boolean {
  const trimmed = (reply || '').trim();
  if (!trimmed) return true;

  const words = normalizeWords(trimmed);
  if (words.length < 8) return true;

  // Reject Host intro echo by non-host panelists
  if (roleType !== 'host' && (/^welcome!\s+i am\b/i.test(trimmed) || /hosting today'?s \d+ minutes? gd/i.test(trimmed))) {
    return true;
  }

  // Reject obvious mid-clause truncated fragments (e.g. "or just make you.", "as a super-fast.")
  const trailingFragment = /\b(?:a|an|the|to|of|for|with|and|or|but|just|very|really|super|super-fast|make you|makes you|into|onto|from|about|because|while|when|if|that|which|who)\s*[.!?]$/i;
  if (trailingFragment.test(trimmed)) {
    return true;
  }

  // Build 4-grams and content-word sets for recent panelist turns
  const reply4Grams = new Set<string>();
  for (let i = 0; i <= words.length - 4; i++) {
    reply4Grams.add(words.slice(i, i + 4).join(' '));
  }
  const replyContent = new Set(words.filter(w => w.length >= 4 && !STOP_WORDS.has(w)));

  for (const prev of recentPanelistTexts.slice(-6)) {
    const prevWords = normalizeWords(prev);
    if (prevWords.length < 4) continue;

    // 1. Any verbatim 4-word phrase copied from a recent panelist turn (except "you have the floor")
    for (let i = 0; i <= prevWords.length - 4; i++) {
      const gram = prevWords.slice(i, i + 4).join(' ');
      if (gram === 'you have the floor' || gram === 'have the floor to') continue;
      if (reply4Grams.has(gram)) {
        return true;
      }
    }

    // 2. High content-word overlap (>= 50% of reply's unique meaningful words already in one prior turn)
    if (replyContent.size >= 4) {
      const prevContent = new Set(prevWords.filter(w => w.length >= 4 && !STOP_WORDS.has(w)));
      let overlap = 0;
      for (const w of replyContent) {
        if (prevContent.has(w)) overlap += 1;
      }
      if (overlap / replyContent.size >= 0.5) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Sentence-aware GD speech clamp: strictly keeps avatar turns within 3 visual lines
 * (~18-36 words, 1-2 crisp complete sentences) without EVER slicing mid-sentence.
 */
export function clampSpeech(raw: string): string {
  const cleaned = raw
    .replace(/<think>[\s\S]*?<\/think>/gi, ' ')
    .replace(/<think>[\s\S]*$/gi, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[*_#>`~]/g, '')
    .replace(/^\s*[-•\d.)]+\s+/gm, '')
    .replace(/^\s*(?:Ms\.|Mr\.|Dr\.)?\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?:\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return '';

  // Split into complete sentences while protecting honorifics (Mr., Ms., Dr., e.g., vs.) from false sentence breaks
  const protectedText = cleaned.replace(/\b(Mr|Ms|Mrs|Dr|Prof|Sr|Jr|vs|e\.g|i\.e)\./gi, '$1\u0001');
  const sentences = (
    protectedText
      .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
      ?.map(s => s.replace(/\u0001/g, '.').trim())
      .filter(Boolean) || [cleaned]
  );

  const selected: string[] = [];
  let totalWords = 0;

  for (const sentence of sentences) {
    const sWords = sentence.split(/\s+/).filter(Boolean).length;
    // Strictly cap at 2 crisp sentences so every GD bubble stays <= 3 lines
    if (selected.length >= 2) break;
    if (selected.length >= 1 && totalWords + sWords > GD_TARGET_WORDS_MAX + 4) break;

    selected.push(sentence);
    totalWords += sWords;
    if (totalWords >= GD_TARGET_WORDS_MAX - 2) break;
  }

  let result = selected.join(' ').trim();
  const finalWords = result.split(/\s+/).filter(Boolean);

  // Hard word-budget guard for a single run-on sentence
  if (finalWords.length > GD_TARGET_WORDS_MAX + 4) {
    const slice = finalWords.slice(0, GD_TARGET_WORDS_MAX).join(' ');
    const clauseIdx = Math.max(slice.lastIndexOf(','), slice.lastIndexOf(';'), slice.lastIndexOf('—'));
    const cleanCut = clauseIdx > slice.length * 0.6 ? slice.slice(0, clauseIdx) : slice;
    result = `${cleanCut.replace(/[,;:\-—\s]+$/, '')}.`;
  }

  if (!/[.!?]$/.test(result)) {
    result = `${result}.`;
  }

  // Strip unbalanced double quotes left behind by truncated quotations
  const quoteCount = (result.match(/"/g) || []).length;
  if (quoteCount % 2 === 1) {
    result = result.replace(/"/g, '').replace(/\s+/g, ' ').trim();
  }

  return result;
}

/**
 * Host opening intro script: crisp, energetic boardroom welcome, topic & objective,
 * concise room rules, 5m/1m checks, and immediate handoff to the Candidate.
 */
export function hostIntroScript(
  hostName: string,
  roomName: string,
  objective: string,
  durationMinutes: number
): string {
  const safeObj = objective?.trim()
    ? ` Goal: ${objective.trim().replace(/\.$/, '')}.`
    : '';
  const timeNote = durationMinutes > 5
    ? ' I will check in at 5 minutes left and 1 minute left.'
    : ' I will give a quick 1-minute warning.';

  return (
    `Welcome! I am ${hostName}, hosting today's ${durationMinutes} minutes GD on "${roomName}".${safeObj} ` +
    `Rules: keep points crisp, challenge ideas not people, and answer directly.${timeNote} ` +
    `You open, our Challenger pushes back, our Diplomat bridges both—Candidate, you have the floor.`
  );
}

/**
 * Host 5-minute remaining interruption (crisp 1-2 lines).
 */
export function hostFiveMinuteWarningScript(hostName: string, topic: string): string {
  return (
    `Time check from ${hostName}: 5 minutes remaining on "${topic}". Let's sharpen real examples and lock in solutions.`
  );
}

/**
 * Host 1-minute remaining interruption (crisp 1-2 lines).
 */
export function hostOneMinuteWarningScript(hostName: string, topic: string): string {
  return (
    `Final call from ${hostName}: 1 minute remaining on "${topic}". Give us your sharpest closing takeaway.`
  );
}

/**
 * Polite Host nudge when user hasn't spoken yet (NEVER fabricates fake user arguments!).
 */
export function hostGentleNudgeScript(hostName: string, candidateName: string, topic: string): string {
  return (
    `${candidateName}, the floor is still yours—feel free to share one short view or ask the panel a question about "${topic}", or tap a quick starter chip below.`
  );
}

/** Backward-compatible alias retained for legacy tests. */
export function hostMidpointScript(hostName: string, topic: string): string {
  return hostFiveMinuteWarningScript(hostName, topic);
}

/** Backward-compatible alias retained for legacy tests. */
export function hostThirtySecondScript(hostName: string, topic: string): string {
  return hostOneMinuteWarningScript(hostName, topic);
}

function systemPrompt(req: GdTurnRequest): string {
  const displayName = gdDisplayName(req.mentorId);
  const persona = getGdPersonaVoice(req.mentorId);
  const candidate = req.candidateName?.trim() || 'Candidate';
  const lastUserMsg = [...req.history].reverse().find(m => m.role === 'user')?.content || '';
  const userAskedQuestion = detectDirectQuestion(lastUserMsg);
  const userWantsSolution = detectSolutionRequest(lastUserMsg);
  const userConfusedOrMeta = !userWantsSolution && detectUserConfusionOrMeta(lastUserMsg);

  const lengthRule =
    'STRICT 3-LINE LIMIT: Write ONLY 1 to 2 razor-sharp spoken sentences (20 to 35 words MAX). ' +
    'CUT ALL FILLER! Never waste words on "I get where you\'re coming from", "Fair take, yet", "On the topic of", or "I see merit in both sides". ' +
    'NO markdown, NO bullets, NO speaker prefixes.';

  const humanConversationRule =
    'ENERGY & REALISM RULE (CRITICAL): Sound like a sharp, charismatic, real-world colleague in a live boardroom debate—professional, warm, and bold when challenging IDEAS, NEVER insulting or belittling the candidate (never call them a liability, red flag, or budget killer). ' +
    'ANTI-REPETITION RULE (CRITICAL): NEVER repeat, echo, or paraphrase any analogy, phrase, or intro already spoken in the transcript—bring a brand-new angle, real metric, or fresh example every single turn. ' +
    'VOICE STT GRACE: Silently understand live mic slips (e.g. "wife coding" / "buy code" = "vibe coding", "unlies" = "analyze") without repeating garbled words.';

  const solutionRule = userWantsSolution
    ? ` SOLUTION RULE (ACTIVE): ${candidate} asked for a clear, concrete solution or did not understand the previous solution. Explain ONE simple, step-by-step practical fix in plain everyday English (zero buzzwords) that has NOT been pitched yet, then ask if they agree with it.`
    : '';

  const confusionRule = userConfusedOrMeta
    ? ` CLARIFY RULE (ACTIVE): ${candidate} said they are unsure or confused. Stay encouraging and helpful—NEVER scold them. Explain one fresh everyday side of "${req.topic}" in 1 plain-English sentence (different from every prior example) and give them two simple choices to pick between.`
    : '';

  const truthfulnessRule =
    'ZERO HALLUCINATION RULE (STRICT): Reference ONLY what the user or panelists ACTUALLY said in the transcript. ' +
    'Never invent statistics, fake quotes, or claim the user said something they did not say.' +
    (userAskedQuestion
      ? ' DIRECT QUESTION RULE: The user just asked a question—answer it directly in your very first sentence!'
      : '');

  if (req.roleType === 'avatar_a') {
    const intensity =
      req.difficulty === 'hard'
        ? 'Hit their assumption head-on with friendly fire—be sharp, bold, and aggressive on ideas using one undeniable real-world counter-example.'
        : req.difficulty === 'easy'
          ? 'Stay upbeat and friendly while sharply poking one clear hole in their logic with a concrete example.'
          : 'Be professional, warm, and aggressively sharp on ideas—challenge their weak spot directly with a punchy real-world counter-example.';

    return [
      `You are ${displayName}, AVATAR 1 (THE CHALLENGER) in a fast, lively Group Discussion on "${req.topic}" (${req.domain} domain).`,
      `VOICE: ${persona.signatureStyle} You naturally ${persona.challengerAngle}.`,
      `MISSION: React straight to ${candidate}'s latest point. ${intensity}${solutionRule}${confusionRule}`,
      humanConversationRule,
      truthfulnessRule,
      lengthRule,
    ].join('\n');
  }

  if (req.roleType === 'avatar_b') {
    const challengerLabel = req.lastChallengerName || 'Avatar 1';
    const challengerQuote = req.lastChallengerText
      ? ` (${challengerLabel} just said: "${req.lastChallengerText.slice(0, 180)}")`
      : '';
    return [
      `You are ${displayName}, AVATAR 2 (THE DIPLOMAT) in a fast, lively Group Discussion on "${req.topic}" (${req.domain} domain).`,
      `VOICE: ${persona.signatureStyle} You naturally ${persona.diplomatAngle}.`,
      `MISSION: In 2 tight complete sentences, connect BOTH ${candidate}'s view AND ${challengerLabel}'s counter-argument${challengerQuote} into ONE fresh, practical middle-ground step (NEVER echo ${challengerLabel}'s words!), then pass the floor back to ${candidate}.${solutionRule}${confusionRule}`,
      humanConversationRule,
      truthfulnessRule,
      lengthRule,
    ].join('\n');
  }

  return [
    `You are ${displayName}, the Group Discussion Host moderating "${req.topic}".`,
    humanConversationRule,
    truthfulnessRule,
    lengthRule,
  ].join('\n');
}

function pickNonRepeatingVariant(candidates: string[], startIndex: number, recentPanelistTexts: string[], roleType: GdRoleType): string {
  for (let offset = 0; offset < candidates.length; offset++) {
    const clamped = clampSpeech(candidates[(startIndex + offset) % candidates.length]);
    if (!isRepetitiveOrBrokenGdReply(clamped, recentPanelistTexts, roleType)) {
      return clamped;
    }
  }
  return clampSpeech(candidates[startIndex % candidates.length]);
}

function generateUtterance(req: GdTurnRequest, recentPanelistTexts: string[] = []): string {
  const candidate = req.candidateName?.trim() || 'Candidate';
  const lastUser = [...req.history].reverse().find(m => m.role === 'user')?.content || '';
  const userWantsSolution = detectSolutionRequest(lastUser);
  const userConfusedOrMeta = !userWantsSolution && detectUserConfusionOrMeta(lastUser);
  const userTurnCount = req.history.filter(m => m.role === 'user').length;
  const variant = userTurnCount % 4;
  const challengerLabel = req.lastChallengerName || 'my colleague';

  // Concrete, domain-specific real-world solutions (varied per turn so fallback never repeats!)
  const solutionPool =
    req.domain === 'commerce'
      ? [
          'run a 30-day pilot with hard margin caps and weekly audit sign-offs',
          'require dual finance approval on any automated pricing change above 5%',
          'track real gross margin per order weekly instead of chasing top-line volume',
          'train analysts to audit AI financial forecasts against raw ledger entries every Friday',
        ]
      : req.domain === 'sales'
        ? [
            'split-test on 10% of inbound leads and measure 60-day retention before scaling',
            'let AI draft outreach while reps personalize discovery calls and pricing negotiation',
            'grade reps on qualified pipeline conversion instead of raw email volume',
            'pair every junior SDR with a senior closer for weekly live call reviews',
          ]
        : req.domain === 'business'
          ? [
              'ship a 2-week paid pilot with strict unit-economics gates before full rollout',
              'tie every team automation target to customer satisfaction and defect rate',
              'run a small shadow cohort first to measure true time saved versus rework cost',
              'require a clear rollback plan before replacing any manual approval workflow',
            ]
          : [
              'require every junior to explain every line of AI-assisted code live in PR review',
              'hire juniors via live debugging tests on broken apps instead of memorized syntax',
              'spend month one pairing juniors on real production bug triage before greenfield features',
              'gate AI merges behind automated integration tests and a senior architecture sign-off',
            ];
  const concreteSolution = solutionPool[userTurnCount % solutionPool.length];

  // 1. User explicitly asked for a solution or problem breakdown -> give crystal-clear, step-by-step plain English!
  if (userWantsSolution) {
    if (req.roleType === 'avatar_a') {
      const solChallenger = [
        `Simple fix: ${concreteSolution}. The real catch is busy managers skip that discipline before deadlines—would you enforce it strictly?`,
        `Here is one clear move: ${concreteSolution}. Still, teams chasing fast shipping often bypass reviews—how would you keep quality non-negotiable?`,
        `Plain-English solution: ${concreteSolution}. My pushback is onboarding takes extra senior hours upfront—do you think that investment pays off?`,
        `Practical playbook: ${concreteSolution}. Without measuring defect rates alongside speed, shortcuts creep back in—would you track bugs or speed first?`,
      ];
      return pickNonRepeatingVariant(solChallenger, variant, recentPanelistTexts, 'avatar_a');
    }

    if (req.roleType === 'avatar_b') {
      const solDiplomat = [
        `${challengerLabel}'s move—${concreteSolution}—keeps speed high without sacrificing fundamentals. ${candidate}, you have the floor: would you add one guardrail?`,
        `Easy to run: adopt ${challengerLabel}'s rule for 30 days and measure bug rates weekly. ${candidate}, you have the floor—does that feel realistic?`,
        `That makes it concrete: combine fast AI drafting with ${challengerLabel}'s hands-on check so newcomers actually learn. ${candidate}, you have the floor.`,
        `Clear next step: test ${challengerLabel}'s safeguard with one small starter squad before scaling company-wide. ${candidate}, you have the floor.`,
      ];
      return pickNonRepeatingVariant(solDiplomat, variant, recentPanelistTexts, 'avatar_b');
    }
  }

  // 2. User signaled confusion / "I don't know" -> warm, plain-English concrete coaching with 2 easy sides to pick!
  if (userConfusedOrMeta) {
    if (req.roleType === 'avatar_a') {
      const resetA = [
        `No stress—here is the plain version: AI writes starter work in seconds, yet teams still need humans who can spot hidden mistakes. Should colleges teach debugging first or coding speed first?`,
        `Totally fair—let's make it concrete: if a fresher uses AI to build an app in an hour, can they fix it when a real customer hits a crash? Which side feels truer to you?`,
        `Easy breakdown: one side says companies will hire fewer freshers because AI handles routine work; the other says AI turns freshers into faster builders. Which outcome do you expect?`,
        `Let's keep it everyday: think of learning math after calculators arrived—do beginners become weaker without basics, or stronger by tackling harder problems? What is your gut take?`,
      ];
      return pickNonRepeatingVariant(resetA, variant, recentPanelistTexts, 'avatar_a');
    }

    if (req.roleType === 'avatar_b') {
      const resetB = [
        `To bridge ${challengerLabel}'s question simply: AI handles repetitive drafts while juniors learn architecture and problem-solving earlier. ${candidate}, you have the floor—would you back speed or fundamentals?`,
        `Building on ${challengerLabel}'s plain example, companies can keep hiring freshers by training them to verify and improve AI output. ${candidate}, you have the floor—does that sound fair?`,
        `Both sides are clear now: ${challengerLabel} flags the risk of skipping basics, while guided AI practice can accelerate growth. ${candidate}, you have the floor for your honest view.`,
        `Here is the middle path from ${challengerLabel}'s point: let newcomers use AI openly, then test whether they can explain and fix the result. ${candidate}, you have the floor.`,
      ];
      return pickNonRepeatingVariant(resetB, variant, recentPanelistTexts, 'avatar_b');
    }
  }

  // 3. Standard high-energy, <= 3-line debate turn (sharp on ideas, respectful to candidate, zero repetition!)
  if (req.roleType === 'avatar_a') {
    const domainRisk =
      req.domain === 'commerce'
        ? 'margin bleed and audit failures'
        : req.domain === 'sales'
          ? 'buyer trust and high churn'
          : req.domain === 'business'
            ? 'cash burn and execution drift'
            : 'production outages and shallow debugging skills';

    const punchyA = [
      `I have to push back there—moving faster without ownership triggers ${domainRisk} under real customer load. How would you prevent that?`,
      `Sharp idea, yet speed alone hides ${domainRisk} until messy edge cases hit live users. What guardrail makes that approach safe?`,
      `Here is the trade-off I see: chasing instant output increases ${domainRisk} at scale. Why not ${concreteSolution} from day one?`,
      `Interesting angle, though teams often underestimate ${domainRisk} once real deadlines collide. Which single metric proves your approach works?`,
    ];
    return pickNonRepeatingVariant(punchyA, variant, recentPanelistTexts, 'avatar_a');
  }

  if (req.roleType === 'avatar_b') {
    const punchyB = [
      `Combining your speed with ${challengerLabel}'s caution works if we ${concreteSolution}. ${candidate}, you have the floor—what metric would you track?`,
      `Your momentum paired with ${challengerLabel}'s accountability points to a clean two-week pilot with clear error caps. ${candidate}, you have the floor.`,
      `Keep the productivity upside you highlighted while applying ${challengerLabel}'s quality check every sprint. Where would you start—${candidate}, you have the floor.`,
      `Smart middle ground: pair your optimism with ${challengerLabel}'s discipline inside one measurable starter team. ${candidate}, you have the floor.`,
    ];
    return pickNonRepeatingVariant(punchyB, variant, recentPanelistTexts, 'avatar_b');
  }

  return clampSpeech(`Let's keep this sharp and solution-focused. ${candidate}, you have the floor.`);
}

export type LlmCaller = (
  system: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
) => Promise<string>;

/**
 * Formats the live GD history into a single clean `role: 'user'` prompt turn.
 * Prevents trailing `role: 'assistant'` chat-template echo bugs on Qwen3 / GPT-OSS / OpenRouter
 * where Avatar 2 accidentally copied Host's intro or Avatar 1's exact sentence.
 */
export function buildGdUserTurnPrompt(req: GdTurnRequest, retryAntiCopy = false): string {
  const displayName = gdDisplayName(req.mentorId);
  const candidate = req.candidateName?.trim() || 'Candidate';
  const roleLabel =
    req.roleType === 'avatar_a'
      ? 'Avatar 1 (Challenger)'
      : req.roleType === 'avatar_b'
        ? 'Avatar 2 (Diplomat)'
        : 'Host';

  const recentLines = req.history.slice(-8).map(m => {
    const label = m.role === 'user' ? candidate : (m.sender || 'Panelist');
    return `[${label}]: ${m.content}`;
  });

  const lastUserMsg = [...req.history].reverse().find(m => m.role === 'user')?.content || '';
  const userWantsSolution = detectSolutionRequest(lastUserMsg);
  const userConfusedOrMeta = !userWantsSolution && detectUserConfusionOrMeta(lastUserMsg);
  const transcriptBlock =
    recentLines.length > 0
      ? recentLines.join('\n')
      : `[${candidate}]: Let's begin the discussion on "${req.topic}".`;

  const challengerNote =
    req.roleType === 'avatar_b' && req.lastChallengerText
      ? `\nJust now ${req.lastChallengerName || 'Avatar 1'} said: "${req.lastChallengerText}"`
      : '';

  const modeHint = userWantsSolution
    ? `\nMODE: ${candidate} asked for a clear solution—give ONE simple, concrete, plain-English step and ask ${candidate} directly.`
    : userConfusedOrMeta
      ? `\nMODE: ${candidate} asked for clarification—stay warm and encouraging (zero scolding or insults), explain simply with one fresh everyday angle, and invite ${candidate} directly.`
      : req.roleType === 'avatar_b'
        ? `\nMODE: Bridge BOTH ${candidate} and ${req.lastChallengerName || 'Avatar 1'} into one practical middle ground and hand the floor back to ${candidate}.`
        : '';

  const retryNote = retryAntiCopy
    ? '\nCRITICAL RETRY: Your previous draft repeated an earlier speaker or got cut off. Write a COMPLETELY ORIGINAL, complete 2-sentence response with a brand-new angle or concrete example.'
    : '';

  return [
    `LIVE BOARDROOM TRANSCRIPT (Topic: "${req.topic}"):`,
    transcriptBlock,
    '',
    `Latest from ${candidate}: "${lastUserMsg || req.topic}"${challengerNote}${modeHint}`,
    `Now speak ONLY as ${displayName} (${roleLabel}) in 2 crisp, complete spoken sentences (20-34 words total). Do NOT copy or paraphrase any prior panelist's phrasing or analogy.${retryNote}`,
  ].join('\n');
}

export async function executeGdTurn(
  req: GdTurnRequest,
  callLlm: LlmCaller
): Promise<GdTurnResult> {
  const sys = systemPrompt(req);
  const recentPanelistTexts = req.history
    .filter(m => m.role === 'assistant')
    .slice(-6)
    .map(m => m.content);
  if (req.lastChallengerText && !recentPanelistTexts.includes(req.lastChallengerText)) {
    recentPanelistTexts.push(req.lastChallengerText);
  }

  let reply = '';
  let usedFallback = false;
  let llmFailed = false;

  // Attempt 1 with single clean `role: 'user'` transcript turn (eliminates trailing-assistant echo bug)
  try {
    const raw = await callLlm(sys, [{ role: 'user', content: buildGdUserTurnPrompt(req, false) }]);
    reply = clampSpeech(raw);
  } catch {
    reply = '';
    llmFailed = true;
  }

  // Anti-repetition & broken-fragment guard: retry ONCE only if LLM succeeded but echoed or got cut off
  if (!llmFailed && (!reply || isRepetitiveOrBrokenGdReply(reply, recentPanelistTexts, req.roleType))) {
    try {
      const rawRetry = await callLlm(sys, [{ role: 'user', content: buildGdUserTurnPrompt(req, true) }]);
      const retryClean = clampSpeech(rawRetry);
      if (retryClean && !isRepetitiveOrBrokenGdReply(retryClean, recentPanelistTexts, req.roleType)) {
        reply = retryClean;
      } else {
        reply = '';
      }
    } catch {
      reply = '';
    }
  }

  if (!reply || reply.split(/\s+/).length < 6) {
    reply = generateUtterance(req, recentPanelistTexts);
    usedFallback = true;
  }

  const wordCount = reply.split(/\s+/).filter(Boolean).length;
  return {
    reply,
    roleType: req.roleType,
    mentorId: normalizeMentorId(req.mentorId),
    displayName: gdDisplayName(req.mentorId),
    wordCount,
    usedFallback,
  };
}

/**
 * Computes normalized `{ x, y }` peer-to-peer head & eye gaze target for a participant tile
 * in the GD boardroom grid so non-speaking avatars turn naturally toward whoever is speaking
 * (and the active speaker faces forward `{ x: 0, y: 0 }` to address the panel).
 */
export function computePeerGazeTarget(
  myTileIndex: number,
  speakerTileIndex: number,
  gridCols: number
): { x: number; y: number } {
  const cols = Math.max(1, Math.floor(gridCols));
  if (speakerTileIndex < 0 || myTileIndex === speakerTileIndex) {
    return { x: 0, y: 0 };
  }

  const myRow = Math.floor(myTileIndex / cols);
  const myCol = myTileIndex % cols;
  const spRow = Math.floor(speakerTileIndex / cols);
  const spCol = speakerTileIndex % cols;

  const dx = Math.max(-1, Math.min(1, (spCol - myCol) * 0.85));
  const dy = Math.max(-1, Math.min(1, (myRow - spRow) * 0.7));

  return {
    x: Number(dx.toFixed(2)),
    y: Number(dy.toFixed(2)),
  };
}
