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
    /\b(didn'?t get|don'?t get|don'?t understand|can'?t understand|cannot understand|not understanding|confused|too complex|bit complex|very complex|complicated|too direct|speaking with.*ai|talking to.*ai|like an? ai|sound.*robotic|want to skip|skip this|let'?s skip|gotila|gottilla|gothilla|pardon|come again|say that again|simpler|plain english|in simple)\b/i;
  if (confusionPattern.test(trimmed)) return true;

  // Ultra-short non-substantive filler replies (1-2 words like "ok", "yes", "hmm", "sorry", "gotila")
  const words = trimmed.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  if (words.length <= 2) return true;

  return false;
}

/**
 * Detects when the candidate is explicitly asking for a concrete solution or action plan
 * (e.g. "what is the solution?", "how are we doing it?", "first let us analyze the problem").
 */
export function detectSolutionRequest(text: string): boolean {
  const trimmed = (text || '').trim().toLowerCase();
  if (!trimmed) return false;
  return /\b(what(?:'s| is) the solution|need a solution|proper solution|for solutions?|how (?:are we|do we|can we|should we) (?:do|doing|fix|solve|handle)|what(?:'s| is) the fix|analyze the problem|understand the problem|what the problem is)\b/i.test(
    trimmed
  );
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
    'ENERGY & REALISM RULE (CRITICAL): Sound like a real, charismatic, high-energy colleague in a sharp boardroom debate—professional, friendly, yet unapologetically direct and aggressive on weak logic. ' +
    'Jump straight into the meat with concrete real-world examples (debugging live outages, code reviews, hiring tests, real ROI). ' +
    'VOICE STT GRACE: Silently understand live mic slips (e.g. "wife coding" / "buy code" = "vibe coding", "unlies" = "analyze") without repeating garbled words.';

  const solutionRule = userWantsSolution
    ? ` SOLUTION RULE (ACTIVE): ${candidate} explicitly asked for a concrete solution or problem breakdown. STOP giving abstract philosophy—pitch ONE specific, realistic, actionable solution right now in plain English, then ask if they would actually run it!`
    : '';

  const confusionRule = userConfusedOrMeta
    ? ` CLARIFY RULE (ACTIVE): ${candidate} felt lost. Drop jargon completely, state one crisp everyday example of "${req.topic}" in 1 short sentence, and ask a simple direct question.`
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
    return [
      `You are ${displayName}, AVATAR 2 (THE DIPLOMAT) in a fast, lively Group Discussion on "${req.topic}" (${req.domain} domain).`,
      `VOICE: ${persona.signatureStyle} You naturally ${persona.diplomatAngle}.`,
      `MISSION: In 2 tight sentences, connect BOTH ${candidate}'s view AND ${challengerLabel}'s counter-argument into ONE concrete, practical middle-ground move, then pass the floor back to ${candidate}.${solutionRule}${confusionRule}`,
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

function generateUtterance(req: GdTurnRequest): string {
  const candidate = req.candidateName?.trim() || 'Candidate';
  const lastUser = [...req.history].reverse().find(m => m.role === 'user')?.content || '';
  const userWantsSolution = detectSolutionRequest(lastUser);
  const userConfusedOrMeta = !userWantsSolution && detectUserConfusionOrMeta(lastUser);
  const userTurnCount = req.history.filter(m => m.role === 'user').length;
  const variant = userTurnCount % 4;
  const challengerLabel = req.lastChallengerName || 'my colleague';

  // Concrete, domain-specific real-world solutions (zero generic buzzword loops!)
  const concreteSolution =
    req.domain === 'commerce'
      ? 'run a 30-day pilot with hard margin caps and weekly audit sign-offs'
      : req.domain === 'sales'
        ? 'split-test on 10% of inbound leads and measure 60-day retention before scaling'
        : req.domain === 'business'
          ? 'ship a 2-week paid pilot with strict unit-economics gates before full rollout'
          : 'ban unreviewed AI merges and make juniors debug broken code live in PR reviews';

  // 1. User explicitly asked for a solution or problem breakdown -> give concrete, crisp 2-line answers!
  if (userWantsSolution) {
    if (req.roleType === 'avatar_a') {
      const solChallenger = [
        `Fair—here's the real fix: ${concreteSolution}. The challenge is teams skip enforcement when deadlines hit, which creates massive risk. Would you enforce that rule?`,
        `Simple solution: ${concreteSolution}. My challenge is most leaders chase speed and accept that hidden flaw anyway—how do we keep them disciplined?`,
        `Let's get concrete: ${concreteSolution}. That directly tackles the core risk, though the challenge is convincing managers to slow down day one—agreed?`,
        `Here's a practical move: ${concreteSolution}. Without that guardrail, the biggest flaw hits in production—do you think that actually solves it?`,
      ];
      return clampSpeech(solChallenger[variant]);
    }

    if (req.roleType === 'avatar_b') {
      const solDiplomat = [
        `${challengerLabel}'s concrete fix works—${concreteSolution}—while keeping the speed you want. ${candidate}, you have the floor: would you add or change one step?`,
        `That nails the action plan: pair ${challengerLabel}'s guardrail with clear weekly metrics so everyone sees real progress. ${candidate}, you have the floor.`,
        `Good pivot to solutions! Blending your focus with ${challengerLabel}'s rule gives teams a clear playbook tomorrow morning—${candidate}, you have the floor.`,
        `Now we're talking real execution: ${challengerLabel}'s check stops silent failures while keeping teams fast. ${candidate}, you have the floor to refine it.`,
      ];
      return clampSpeech(solDiplomat[variant]);
    }
  }

  // 2. User signaled confusion or robotic feel -> ultra-short plain-English reset (<= 3 lines!)
  if (userConfusedOrMeta) {
    if (req.roleType === 'avatar_a') {
      const resetA = [
        `Let's keep it super real: the core challenge is quick shortcuts create a huge risk when something breaks live. Would you trust an untested shortcut?`,
        `Fair call—plain English! My challenge is simple: fast tools hide a real flaw when people stop learning the fundamentals. Do you see that happening?`,
        `Let's drop the jargon: speed is great, yet the real risk is nobody knows how to fix failures later. Which side are you backing?`,
        `Good reset! Here's my blunt challenge: chasing instant output without deep skill is a ticking risk. How should beginners train instead?`,
      ];
      return clampSpeech(resetA[variant]);
    }

    if (req.roleType === 'avatar_b') {
      const resetB = [
        `Super simple: ${challengerLabel} wants strong fundamentals, while fast tools still help when guided right. ${candidate}, you have the floor—what's your honest take?`,
        `Keeping it direct: ${challengerLabel} flagged the real trap, and we can fix it with hands-on mentorship. ${candidate}, you have the floor.`,
        `Let's stay practical: pair ${challengerLabel}'s caution with real guided practice so beginners actually level up. ${candidate}, you have the floor.`,
        `Totally clear now: use fast tools for drafts, then apply ${challengerLabel}'s check to master the core logic. ${candidate}, you have the floor.`,
      ];
      return clampSpeech(resetB[variant]);
    }
  }

  // 3. Standard high-energy, <= 3-line debate turn (zero ugly word-splicing!)
  if (req.roleType === 'avatar_a') {
    const domainRisk =
      req.domain === 'commerce'
        ? 'margin bleed and audit risk'
        : req.domain === 'sales'
          ? 'buyer trust and churn risk'
          : req.domain === 'business'
            ? 'cash burn and execution risk'
            : 'production outages and skill-gap risk';

    const punchyA = [
      `Hold on—I have to challenge that because moving fast without guardrails triggers ${domainRisk} under real pressure. How do you stop that flaw?`,
      `I have to challenge that sharply: that assumption underestimates ${domainRisk} when real users hit production. What is your safety net against that flaw?`,
      `Strong take, yet here's my challenge: ignoring ${domainRisk} is the exact flaw that breaks teams at scale. Why not ${concreteSolution} instead?`,
      `Let me challenge that head-on—speed alone creates huge ${domainRisk} once messy edge cases arrive. Wouldn't strict review gates stop that flaw?`,
    ];
    return clampSpeech(punchyA[variant]);
  }

  if (req.roleType === 'avatar_b') {
    const punchyB = [
      `Your speed keeps teams sharp, while ${challengerLabel} stops costly blowups. Solution: ${concreteSolution}—${candidate}, you have the floor.`,
      `Let's blend your momentum with ${challengerLabel}'s discipline and ${concreteSolution}. Would you ship that plan—${candidate}, you have the floor.`,
      `Keep your speed, adopt ${challengerLabel}'s guardrail, and measure real outcomes weekly. What metric would you track first—${candidate}, you have the floor.`,
      `Smart middle ground: pair your view with ${challengerLabel}'s warning inside a small tracked pilot. Where would you start—${candidate}, you have the floor.`,
    ];
    return clampSpeech(punchyB[variant]);
  }

  return clampSpeech(`Let's keep this sharp and solution-focused. ${candidate}, you have the floor.`);
}

export type LlmCaller = (
  system: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
) => Promise<string>;

export async function executeGdTurn(
  req: GdTurnRequest,
  callLlm: LlmCaller
): Promise<GdTurnResult> {
  const sys = systemPrompt(req);
  const recent = req.history.slice(-8).map(m => ({
    role: m.role,
    content: m.sender ? `${m.sender}: ${m.content}` : m.content,
  }));

  if (recent.length === 0) {
    recent.push({ role: 'user', content: `Let's begin the discussion on "${req.topic}".` });
  }

  let reply = '';
  let usedFallback = false;

  try {
    const raw = await callLlm(sys, recent);
    reply = clampSpeech(raw);
  } catch {
    reply = '';
  }

  if (!reply || reply.split(/\s+/).length < 6) {
    reply = generateUtterance(req);
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
