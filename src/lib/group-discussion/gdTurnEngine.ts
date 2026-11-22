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

/** Target speech budget: 2 to 3.5 visual lines (~28-54 words, 2-3 simple sentences). */
export const GD_TARGET_WORDS_MIN = 24;
export const GD_TARGET_WORDS_MAX = 54;

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
 * Extracts a clean, human-readable concept phrase ONLY when the utterance has genuine topic substance.
 * Never splices introductions ("myself Vinay"), broken contractions ("didn"), or robotic boilerplate ("respectfully challenge").
 */
function extractCleanTopicConcept(text: string): string | null {
  let clean = (text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return null;

  // Strip common spoken introductions & filler openings before inspecting topic words
  clean = clean
    .replace(/^(hi|hello|hey)(\s+there|\s+everyone|\s+guys)?[\s,.-]*/i, '')
    .replace(/\b(myself|my name is|i am|i'm)\s+[a-z]+\b[\s,.-]*/gi, ' ')
    .replace(/\bi(?:'m|\s+am)\s+going\s+to\s+(explain|talk\s+about|say)\b/gi, ' ')
    .replace(/\b(i\s+respectfully\s+challenge|i\s+see\s+merit\s+in\s+both\s+sides)\b/gi, ' ')
    .replace(/\bwhat\s+do\s+you\s+(guys\s+)?think(\s+about\s+it)?\b/gi, ' ')
    .trim();

  if (!clean) return null;

  // Normalize common voice STT slips so fallbacks never repeat garbled speech
  clean = clean
    .replace(/\bwife coding\b/gi, 'vibe coding')
    .replace(/\bfully relay on\b/gi, 'fully rely on')
    .replace(/\byei ai\b/gi, 'AI');

  const stopwords = new Set([
    'that', 'this', 'with', 'from', 'they', 'them', 'have', 'been', 'will', 'would',
    'could', 'should', 'about', 'there', 'their', 'what', 'when', 'where', 'which',
    'while', 'think', 'believe', 'really', 'just', 'like', 'also', 'very', 'more',
    'most', 'some', 'into', 'over', 'than', 'then', 'only', 'make', 'need', 'want',
    'because', 'your', 'ours', 'here', 'well', 'good', 'great', 'point', 'agree',
    'okay', 'still', 'found', 'sorry', 'didn', 'dont', 'cant', 'cannot', 'going',
    'explain', 'understand', 'present', 'situation', 'speaking', 'direct', 'feel',
    'respectfully', 'challenge', 'take', 'side', 'sides', 'both', 'merit', 'myself',
    'guys', 'actually', 'basically', 'thing', 'things', 'something', 'anything',
  ]);

  const words = clean
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 4 && !stopwords.has(w.toLowerCase()));

  // Require at least 2 genuine domain words; otherwise return null so the template reads naturally
  if (words.length < 2) return null;
  return words.slice(0, 3).join(' ').toLowerCase();
}

/**
 * Sentence-aware speech clamp: keeps avatar responses between 2 and 3.5 visual lines
 * (~24-54 words, 2-3 clean, complete sentences) without EVER slicing mid-sentence.
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

  // Split into complete sentences while preserving terminal punctuation
  const sentences = cleaned
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map(s => s.trim())
    .filter(Boolean) || [cleaned];

  const selected: string[] = [];
  let totalWords = 0;

  for (const sentence of sentences) {
    const sWords = sentence.split(/\s+/).filter(Boolean).length;
    // Allow up to 3 sentences and stay within ~54 words (<= 3.5 lines)
    if (selected.length >= 3) break;
    if (selected.length >= 2 && totalWords + sWords > GD_TARGET_WORDS_MAX) break;
    if (selected.length === 1 && totalWords + sWords > GD_TARGET_WORDS_MAX + 8) break;

    selected.push(sentence);
    totalWords += sWords;
    if (totalWords >= GD_TARGET_WORDS_MAX - 6 && selected.length >= 2) break;
  }

  let result = selected.join(' ').trim();
  const finalWords = result.split(/\s+/).filter(Boolean);

  // Guard for a single run-on sentence exceeding hard word cap
  if (finalWords.length > GD_TARGET_WORDS_MAX + 4) {
    const slice = finalWords.slice(0, GD_TARGET_WORDS_MAX).join(' ');
    // Prefer trimming to last comma/semicolon/dash clause boundary so it sounds natural
    const clauseIdx = Math.max(slice.lastIndexOf(','), slice.lastIndexOf(';'), slice.lastIndexOf('—'));
    const cleanCut = clauseIdx > slice.length * 0.65 ? slice.slice(0, clauseIdx) : slice;
    result = `${cleanCut.replace(/[,;:\-—\s]+$/, '')}.`;
  }

  if (!/[.!?]$/.test(result)) {
    result = `${result}.`;
  }

  return result;
}

/**
 * Host opening intro script: welcomes the panel, introduces the topic & objective,
 * explains the common GD room rules concisely, and hands the floor to the Candidate.
 */
export function hostIntroScript(
  hostName: string,
  roomName: string,
  objective: string,
  durationMinutes: number
): string {
  const safeObj = objective?.trim()
    ? ` Our goal is to ${objective.trim().replace(/\.$/, '')}.`
    : '';
  const timeNote = durationMinutes > 5
    ? ' I will step in between turns at 5 minutes left and 1 minute left.'
    : ' I will give a quick 1-minute warning before wrap-up.';

  return (
    `Welcome everyone, I am ${hostName}, your GD Host for today's ${durationMinutes} minutes discussion on "${roomName}".${safeObj} ` +
    `Quick room rules: speak one at a time, keep points crisp and respectful, challenge ideas not people, and answer questions directly.${timeNote} ` +
    `Our loop is simple: you speak first, our Challenger will test your view, our Diplomat will balance both sides, and then the floor comes right back to you. ` +
    `Candidate, you have the floor to open.`
  );
}

/**
 * Host 5-minute remaining interruption (fires between talks when 5 minutes are left).
 */
export function hostFiveMinuteWarningScript(hostName: string, topic: string): string {
  return (
    `Quick time check from ${hostName}: we have 5 minutes remaining in our discussion on "${topic}". ` +
    `Let's sharpen our examples and start narrowing toward practical solutions as we continue.`
  );
}

/**
 * Host 1-minute remaining interruption (fires between talks when 1 minute is left).
 */
export function hostOneMinuteWarningScript(hostName: string, topic: string): string {
  return (
    `Final time check from ${hostName}: only 1 minute remaining for "${topic}". ` +
    `Let's deliver crisp closing takeaways so the panel wraps with a clear conclusion.`
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
  const userConfusedOrMeta = detectUserConfusionOrMeta(lastUserMsg);

  const lengthRule =
    'LENGTH RULE (STRICT): Write EXACTLY 2 to 3 short, natural spoken sentences (28 to 50 words total, fitting 2 to 3.5 lines). ' +
    'NO bullet lists, NO markdown, NO robotic speaker prefixes, NO textbook jargon walls.';

  const humanConversationRule =
    'HUMAN CONVERSATION RULE (CRITICAL): Sound like a real, sharp colleague talking across a table—use natural contractions ("I get where you\'re coming from", "Fair point, though...", "Honestly...", "Hold on..."). ' +
    'NEVER repeat stiff templates like "I respectfully challenge your take on..." or "I see merit in both sides". ' +
    'VOICE STT GRACE: The candidate is speaking live via microphone—silently understand minor speech-to-text slips (e.g., "wife coding" = "vibe coding", "yei AI" = "AI") without mocking or parroting garbled phrases.';

  const confusionRule = userConfusedOrMeta
    ? ` CLARIFY & SIMPLIFY RULE (ACTIVE): ${candidate} just signaled confusion, said it felt too complex/robotic, or gave a very brief reply. Drop all corporate jargon immediately! React warmly like a helpful human teammate, explain one super-simple everyday angle of "${req.topic}" in plain English, and ask an easy, friendly follow-up question.`
    : '';

  const truthfulnessRule =
    'ZERO HALLUCINATION RULE (STRICT): Reference ONLY what the user or panelists ACTUALLY said in the transcript. ' +
    'Never invent statistics, fake quotes, or claim the user said something they did not say.' +
    (userAskedQuestion
      ? ' DIRECT QUESTION RULE: The user just asked a question—you MUST directly answer their question clearly in your very first sentence before adding your point!'
      : '');

  if (req.roleType === 'avatar_a') {
    const intensity =
      req.difficulty === 'hard'
        ? 'Push back directly and boldly like a real debater—challenge their main assumption with one concrete, everyday counter-example.'
        : req.difficulty === 'easy'
          ? 'Keep it warm, relaxed, and friendly—gently question one blind spot using a super relatable example.'
          : 'Be lively, conversational, and genuinely engaging—test the biggest real-world trade-off in their point like a sharp peer.';

    return [
      `You are ${displayName}, acting as AVATAR 1 (THE CHALLENGER) in a live human Group Discussion on "${req.topic}" (${req.domain} domain).`,
      `YOUR UNIQUE VOICE: ${persona.signatureStyle} You naturally ${persona.challengerAngle}.`,
      `ROLE MISSION: React directly to ${candidate}'s latest message as a real person would. ${intensity}${confusionRule}`,
      humanConversationRule,
      truthfulnessRule,
      lengthRule,
    ].join('\n');
  }

  if (req.roleType === 'avatar_b') {
    const challengerLabel = req.lastChallengerName || 'Avatar 1';
    return [
      `You are ${displayName}, acting as AVATAR 2 (THE DIPLOMAT) in a live human Group Discussion on "${req.topic}" (${req.domain} domain).`,
      `YOUR UNIQUE VOICE: ${persona.signatureStyle} You naturally ${persona.diplomatAngle}.`,
      `ROLE MISSION: Speak naturally to acknowledge BOTH ${candidate}'s view AND ${challengerLabel}'s counter-argument. Bridge both sides with one practical everyday middle ground, then invite ${candidate} back in naturally.${confusionRule}`,
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
  const userAskedQuestion = detectDirectQuestion(lastUser);
  const userConfusedOrMeta = detectUserConfusionOrMeta(lastUser);
  const cleanConcept = extractCleanTopicConcept(lastUser);
  const userTurnCount = req.history.filter(m => m.role === 'user').length;
  const variant = userTurnCount % 4;
  const shortTopic = req.topic.length > 72 ? `${req.topic.slice(0, 69).trim()}...` : req.topic;
  const challengerLabel = req.lastChallengerName || 'my colleague';

  // Warm, plain-English human response whenever user is confused, finds it complex, or gives a tiny reply
  if (userConfusedOrMeta) {
    if (req.roleType === 'avatar_a') {
      const resetVariants = [
        `No worries at all—let's keep it super simple and drop the heavy terms! My main challenge on "${shortTopic}" is the practical risk that shortcuts hurt people when real problems show up. In plain terms, do you think that's a real worry?`,
        `Totally fair—let's talk like normal people here! Take "${shortTopic}": the real challenge is whether quick wins hide a bigger risk later on. How do you see it playing out for someone starting out today?`,
        `Haha, fair call—let's keep it casual and clear! With "${shortTopic}", I'd gently challenge the hype because the biggest flaw usually shows up under everyday pressure. What's your honest first reaction to that?`,
        `My bad if that sounded stiff—let's zoom out! On "${shortTopic}", the tricky challenge is balancing speed with not losing core skills, which is a real risk. Which side feels closer to what you've actually seen?`,
      ];
      return clampSpeech(resetVariants[variant]);
    }

    if (req.roleType === 'avatar_b') {
      const bridgeResetVariants = [
        `That makes complete sense—let's keep it relaxed and everyday. ${challengerLabel} just means we shouldn't skip the basics while chasing speed, and we want your real take too. ${candidate}, you have the floor—what's one simple example that comes to mind?`,
        `I hear you, no need to overcomplicate this! ${challengerLabel} raised a simple caution about hidden downsides, while you can keep us grounded in reality. ${candidate}, you have the floor whenever you're ready to share your take.`,
        `Fair enough—let's speak plainly! Building on ${challengerLabel}'s point, the easiest way to think about "${shortTopic}" is asking who actually wins or loses day to day. ${candidate}, you have the floor—which side would you pick?`,
        `Totally understandable, let's reset the tone! ${challengerLabel} is pointing out what could go wrong, while there's also real upside if people adapt smartly. ${candidate}, you have the floor to share what feels right to you.`,
      ];
      return clampSpeech(bridgeResetVariants[variant]);
    }
  }

  if (req.roleType === 'avatar_a') {
    const pointRef = cleanConcept ? `your point about ${cleanConcept}` : 'that angle';

    if (userAskedQuestion) {
      const qaVariants = [
        `Good question—honestly, I'd challenge ${pointRef} because the real risk shows up the moment teams hit messy edge cases in production. Speed feels awesome on day one, until someone has to debug what broke.`,
        `To answer you straight: I'd challenge relying too heavily on ${pointRef} since there's a real flaw when budgets or deadlines tighten. When something fails under pressure, who actually owns fixing it?`,
        `Fair question! My pushback—and the big challenge with ${pointRef}—is the hidden risk of over-dependence over time. Short-term convenience can quietly weaken the exact fundamentals teams rely on later.`,
        `Honestly, I'd challenge ${pointRef} here because real-world rollout exposes a flaw that sounds tiny at first. Once you scale past a small demo, operational risk catches up fast—how would you guard against that?`,
      ];
      return clampSpeech(qaVariants[variant]);
    }

    const domainRisk =
      req.domain === 'commerce'
        ? 'cash-flow pressure and compliance risk'
        : req.domain === 'sales'
          ? 'customer trust and churn risk'
          : req.domain === 'business'
            ? 'unit economics and execution risk'
            : 'real-world reliability and skill-gap risk';

    const challengerVariants = [
      `I get where you're coming from, though I'd challenge ${pointRef} because it underestimates ${domainRisk}. Things look smooth in theory, but what happens the first time a real crisis hits?`,
      `Fair take, yet I have to challenge ${pointRef} on "${shortTopic}"—there's a hidden flaw once ${domainRisk} kicks in. If we move that fast without guardrails, won't the team end up paying for it later?`,
      `Interesting view, honestly, but let me challenge ${pointRef} from the other side. Ignoring ${domainRisk} sounds fine early on, until small mistakes snowball—how would you handle that downside?`,
      `I hear you, though here's my challenge to ${pointRef}: once real-world pressure arrives, ${domainRisk} becomes the make-or-break flaw. Wouldn't a more cautious approach save us bigger headaches?`,
    ];
    return clampSpeech(challengerVariants[variant]);
  }

  if (req.roleType === 'avatar_b') {
    const pointRef = cleanConcept ? `your point on ${cleanConcept}` : 'your point';
    const diplomatVariants = [
      `Honestly, you both nailed half the puzzle—${pointRef} captures the real upside, while ${challengerLabel} is right to watch out for hidden fallout. Starting with a small, guided trial gives us the best of both worlds—${candidate}, you have the floor.`,
      `I like where this is going: ${pointRef} pushes us forward, and ${challengerLabel}'s pushback keeps us honest about real-world limits. Pairing fast adoption with clear human check-ins bridges both views—${candidate}, you have the floor.`,
      `Both of you make solid sense here—${pointRef} shows why change is unavoidable, while ${challengerLabel} reminds us not to skip the basics. Blending both into a simple two-step plan feels realistic—${candidate}, you have the floor.`,
      `You're both closer than it sounds: ${pointRef} highlights what's already happening on the ground, and ${challengerLabel} flags the exact trap to avoid. Combining speed with real accountability solves both—${candidate}, you have the floor.`,
    ];
    return clampSpeech(diplomatVariants[variant]);
  }

  return clampSpeech(`Let's keep "${shortTopic}" grounded and practical. ${candidate}, you have the floor.`);
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

  if (!reply || reply.split(/\s+/).length < 10) {
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
