import { COURSES_REGISTRY, type Course } from '@/lib/data/coursesData';
import { parseQuestId } from '@/lib/data/curriculumEnricher';
import { getLongLessonServer } from '@/lib/data/longLessonServer';
import type { LongLesson, LongLessonPart } from '@/lib/data/longLessonTypes';
import { isLessonContinuationIntent } from '@/lib/avatar/lessonIntent';

export interface LessonSessionRef {
  questId: string;
  prefix: string;
  dayNum: number;
  partIndex: number;
}

export interface ResolvedLessonAction {
  questId: string;
  courseId: string;
  courseTitle: string;
  prefix: string;
  dayNum: number;
  lessonTitle: string;
  goal: string;
  totalParts: number;
  partIndex: number;
  partTitle: string;
  codeSnippet?: string;
  checkQuestion?: string;
  launchUrl: string;
  autoLaunch: boolean;
  intent: 'launch' | 'teach' | 'next_part' | 'prev_part' | 'quiz' | 'example';
}

export interface LessonResolutionResult {
  lessonAction: ResolvedLessonAction;
  promptDigest: string;
  deterministicFallbackReply: string;
  updatedSession: LessonSessionRef;
}

interface CourseIndexEntry {
  courseId: string;
  courseTitle: string;
  prefix: string;
  aliases: string[];
  allQuestDays: Array<{ questId: string; dayNum: number }>;
  lectures: Array<{
    dayNum: number;
    questId: string;
    title: string;
    desc: string;
    syllabus: string;
  }>;
}

const COURSE_ALIAS_OVERRIDES: Record<string, string[]> = {
  'course-ai-python': ['python ai', 'ai python', 'ai with python', 'generative ai python', 'ai py', 'ai-py'],
  'course-python-backend': ['python', 'python backend', 'python core', 'learn python'],
  'course-database-eng': ['sql', 'database', 'databases', 'postgres', 'postgresql', 'sql mastery'],
  'course-fullstack-js': ['fullstack', 'full stack', 'full-stack', 'fullstack js', 'javascript'],
  'course-react-web': ['react', 'react js', 'frontend react'],
  'course-node-web': ['node', 'nodejs', 'node.js', 'express', 'backend node'],
  'course-dsa-python': ['dsa python', 'dsa', 'data structures'],
  'course-dsa-optim': ['dsa optim', 'algorithms', 'competitive programming'],
  'course-ai-eng': ['ai engineering', 'ai eng'],
  'course-ai-prompt-python': ['prompt python', 'prompt engineering python'],
  'course-ai-prompt-literacy': ['prompt literacy', 'prompting'],
  'course-digital-accounting': ['accounting', 'bookkeeping', 'bcom accounting'],
  'course-finance-investment': ['finance', 'corporate finance', 'investment', 'bcom finance'],
  'course-marketing-branding': ['marketing', 'branding', 'bcom marketing'],
  'course-audit-assurance': ['audit', 'auditing', 'assurance'],
  'course-banking-treasury': ['banking', 'treasury', 'credit'],
  'course-digital-marketing-analytics': ['digital marketing', 'seo', 'performance marketing'],
  'course-ecommerce-architecture': ['ecommerce', 'e-commerce'],
  'course-iot-embedded': ['iot embedded', 'iot', 'embedded', 'arduino', 'esp32'],
  'course-iot-edge': ['iot edge', 'edge computing'],
  'course-iot-net': ['iot networking', 'iot net', 'mqtt'],
  'course-iot-sec': ['iot security', 'iot sec'],
};

let cachedCatalogIndex: CourseIndexEntry[] | null = null;

function getCatalogIndex(): CourseIndexEntry[] {
  if (cachedCatalogIndex) return cachedCatalogIndex;

  const entries: CourseIndexEntry[] = [];
  for (const course of COURSES_REGISTRY as Course[]) {
    const lectures: CourseIndexEntry['lectures'] = [];
    const allQuestDays: Array<{ questId: string; dayNum: number }> = [];
    let prefix = '';

    for (const q of course.quests || []) {
      const parsed = parseQuestId(q.id);
      if (parsed) {
        allQuestDays.push({ questId: q.id, dayNum: parsed.dayNum });
      }
      if (parsed && /-lecture1-day-\d+$/i.test(q.id)) {
        if (!prefix) prefix = parsed.prefix;
        lectures.push({
          dayNum: parsed.dayNum,
          questId: q.id,
          title: q.title || `Day ${parsed.dayNum}`,
          desc: q.desc || '',
          syllabus: Array.isArray(q.syllabus) ? q.syllabus.join(' ') : String(q.syllabus || ''),
        });
      }
    }
    if (!prefix || lectures.length === 0) continue;

    lectures.sort((a, b) => a.dayNum - b.dayNum);
    const cleanTitle = (course.title || '').split('(')[0].trim().toLowerCase();
    const overrideAliases = COURSE_ALIAS_OVERRIDES[course.id] || [];
    const aliases = Array.from(
      new Set([
        cleanTitle,
        course.id.replace(/^course-/i, '').replace(/-/g, ' ').toLowerCase(),
        prefix.replace(/[_-]+/g, ' ').toLowerCase(),
        ...overrideAliases,
      ].filter(Boolean))
    );

    entries.push({
      courseId: course.id,
      courseTitle: course.title,
      prefix,
      aliases,
      allQuestDays,
      lectures,
    });
  }

  cachedCatalogIndex = entries;
  return entries;
}

function normalizeSay(say: string | string[] | undefined): string[] {
  if (Array.isArray(say)) return say.map((s) => String(s).trim()).filter(Boolean);
  if (typeof say === 'string' && say.trim()) return [say.trim()];
  return [];
}

function findMatchingCourse(lowerMessage: string, index: CourseIndexEntry[], activeCourseId?: string): CourseIndexEntry | null {
  let best: { entry: CourseIndexEntry; score: number } | null = null;

  for (const entry of index) {
    let score = 0;
    for (const alias of entry.aliases) {
      if (alias.length < 2) continue;
      // Exact word/phrase match with length bonus (so "python ai" beats "python")
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(lowerMessage)) {
        score = Math.max(score, 20 + alias.length * 2);
      }
    }
    if (score > 0 && activeCourseId && entry.courseId === activeCourseId) {
      score += 4;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { entry, score };
    }
  }
  return best?.entry || null;
}

const SPOKEN_ONES: Record<string, number> = {
  zero: 0, one: 1, first: 1, two: 2, second: 2, three: 3, third: 3,
  four: 4, fourth: 4, five: 5, fifth: 5, six: 6, sixth: 6,
  seven: 7, seventh: 7, eight: 8, eighth: 8, nine: 9, ninth: 9,
  ten: 10, tenth: 10, eleven: 11, eleventh: 11, twelve: 12, twelfth: 12,
  thirteen: 13, thirteenth: 13, fourteen: 14, fourteenth: 14, fifteen: 15, fifteenth: 15,
  sixteen: 16, sixteenth: 16, seventeen: 17, seventeenth: 17, eighteen: 18, eighteenth: 18,
  nineteen: 19, nineteenth: 19,
};

const SPOKEN_TENS: Record<string, number> = {
  twenty: 20, twentieth: 20,
  thirty: 30, thirtieth: 30,
  forty: 40, fortieth: 40,
  fifty: 50, fiftieth: 50,
  sixty: 60, sixtieth: 60,
};

function parseSpokenNumberToken(raw: string): number | null {
  const clean = raw.toLowerCase().trim().replace(/(?:st|nd|rd|th)$/i, '');
  if (/^\d+$/.test(clean)) {
    const n = Number(clean);
    return n >= 1 && n <= 60 ? n : null;
  }
  const parts = clean.split(/[\s-]+/).filter(Boolean);
  if (parts.length === 1) {
    if (parts[0] in SPOKEN_ONES) return SPOKEN_ONES[parts[0]] || null;
    if (parts[0] in SPOKEN_TENS) return SPOKEN_TENS[parts[0]] || null;
  } else if (parts.length === 2 && parts[0] in SPOKEN_TENS && parts[1] in SPOKEN_ONES) {
    const sum = SPOKEN_TENS[parts[0]] + SPOKEN_ONES[parts[1]];
    return sum >= 1 && sum <= 60 ? sum : null;
  }
  return null;
}

const SPOKEN_DAY_WORDS_ALTERNATION =
  '(?:twenty(?:[-\\s]+(?:one|two|three|four|five|six|seven|eight|nine|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth))?|thirty(?:[-\\s]+(?:one|two|three|four|five|six|seven|eight|nine|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth))?|forty(?:[-\\s]+(?:one|two|three|four|five|six|seven|eight|nine|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth))?|fifty(?:[-\\s]+(?:one|two|three|four|five|six|seven|eight|nine|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth))?|sixty|sixtieth|nineteen|nineteenth|eighteen|eighteenth|seventeen|seventeenth|sixteen|sixteenth|fifteen|fifteenth|fourteen|fourteenth|thirteen|thirteenth|twelve|twelfth|eleven|eleventh|ten|tenth|nine|ninth|eight|eighth|seven|seventh|six|sixth|five|fifth|four|fourth|three|third|two|second|one|first|(?:[1-9]|[1-5]\\d|60)(?:st|nd|rd|th)?)';

function extractDayNumber(lowerMessage: string): number | null {
  const afterUnit = lowerMessage.match(
    new RegExp(`\\b(?:day|lesson|module|session)\\s*(?:#\\s*)?(${SPOKEN_DAY_WORDS_ALTERNATION})\\b`, 'i')
  );
  if (afterUnit?.[1]) {
    const parsed = parseSpokenNumberToken(afterUnit[1]);
    if (parsed !== null) return parsed;
  }

  const ordinalBeforeUnit = lowerMessage.match(
    new RegExp(`\\b(${SPOKEN_DAY_WORDS_ALTERNATION})\\s+(?:day|lesson|module|session)\\b`, 'i')
  );
  if (ordinalBeforeUnit?.[1]) {
    const parsed = parseSpokenNumberToken(ordinalBeforeUnit[1]);
    if (parsed !== null) return parsed;
  }

  if (/\b(?:start\s+again|from\s+the\s+beginning|from\s+day\s+one)\b/i.test(lowerMessage)) {
    return 1;
  }
  return null;
}

function extractRelativeDayOffset(lowerMessage: string): number | null {
  if (/\b(?:previous\s+day|prev\s+day|yesterday'?s?\s+(?:lesson|topic|day)|last\s+day|last\s+lesson|earlier\s+day)\b/i.test(lowerMessage)) {
    return -1;
  }
  if (/\b(?:today'?s?\s+(?:lesson|topic|day)|current\s+day)\b/i.test(lowerMessage)) {
    return 0;
  }
  if (/\bnext\s+day\b/i.test(lowerMessage)) {
    return 1;
  }
  return null;
}

const TRACK_DEFAULT_COURSE: Record<string, string> = {
  sde_fullstack: 'course-python-backend',
  sde: 'course-python-backend',
  data_ai: 'course-ai-python',
  bcom_acc: 'course-digital-accounting',
  bcom_fin: 'course-finance-investment',
  iot_embedded: 'course-iot-embedded',
};

function computeCourseCurrentDay(entry: CourseIndexEntry, completed: string[], completedSet: Set<string>): { completedCount: number; currentDay: number } {
  const prefixDot = `${entry.prefix}-`;
  let completedCount = 0;
  let maxCompletedDay = 0;
  for (const qId of completed) {
    if (qId.startsWith(prefixDot)) {
      completedCount += 1;
      const parsed = parseQuestId(qId);
      if (parsed && parsed.dayNum > maxCompletedDay) maxCompletedDay = parsed.dayNum;
    }
  }
  const incompleteDayQuest = entry.allQuestDays.find((q) => !completedSet.has(q.questId));
  const currentDay = incompleteDayQuest
    ? incompleteDayQuest.dayNum
    : maxCompletedDay > 0
      ? Math.min(60, maxCompletedDay)
      : 1;
  return { completedCount, currentDay };
}

function inferActiveCourseAndCurrentDay(
  index: CourseIndexEntry[],
  opts: {
    activeCourseId?: string;
    completedQuests?: string[];
    enrolledTrack?: string;
  }
): {
  activeCourse: CourseIndexEntry | null;
  currentDay: number;
  progressedCourse: CourseIndexEntry | null;
  progressedCurrentDay: number;
} {
  const completed = Array.isArray(opts.completedQuests) ? opts.completedQuests : [];
  const completedSet = new Set(completed);

  const viewedCourse: CourseIndexEntry | null = opts.activeCourseId
    ? index.find((e) => e.courseId === opts.activeCourseId) || null
    : null;

  let progressedCourse: CourseIndexEntry | null = null;
  let progressedCurrentDay = 1;
  if (completed.length > 0) {
    let bestCount = 0;
    let bestMaxDay = 0;
    for (const entry of index) {
      let count = 0;
      let maxDay = 0;
      const prefixDot = `${entry.prefix}-`;
      for (const qId of completed) {
        if (qId.startsWith(prefixDot)) {
          count += 1;
          const parsed = parseQuestId(qId);
          if (parsed && parsed.dayNum > maxDay) maxDay = parsed.dayNum;
        }
      }
      if (count > bestCount || (count === bestCount && count > 0 && maxDay > bestMaxDay)) {
        bestCount = count;
        bestMaxDay = maxDay;
        progressedCourse = entry;
      }
    }
    if (progressedCourse) {
      progressedCurrentDay = computeCourseCurrentDay(progressedCourse, completed, completedSet).currentDay;
    }
  }

  let activeCourse = viewedCourse;
  if (viewedCourse && progressedCourse && viewedCourse.courseId !== progressedCourse.courseId) {
    const viewedStats = computeCourseCurrentDay(viewedCourse, completed, completedSet);
    // If currently open tab/roadmap has ZERO completed quests while student has real completed progress elsewhere,
    // prefer the actually-progressed course so "previous day" never resolves to an untouched course's Day 1.
    if (viewedStats.completedCount === 0) {
      activeCourse = progressedCourse;
    }
  }

  if (!activeCourse && progressedCourse) {
    activeCourse = progressedCourse;
  }

  if (!activeCourse && opts.enrolledTrack) {
    const mappedId = TRACK_DEFAULT_COURSE[opts.enrolledTrack.toLowerCase()];
    if (mappedId) {
      activeCourse = index.find((e) => e.courseId === mappedId) || null;
    }
  }

  if (!activeCourse) {
    return { activeCourse: null, currentDay: 1, progressedCourse, progressedCurrentDay };
  }

  const currentDay = computeCourseCurrentDay(activeCourse, completed, completedSet).currentDay;
  return { activeCourse, currentDay, progressedCourse, progressedCurrentDay };
}

const TOPIC_STOP_WORDS = new Set([
  'i', 'do', 'dont', 'did', 'not', 'understand', 'explain', 'teach', 'me', 'please', 'help',
  'with', 'what', 'is', 'are', 'how', 'does', 'the', 'a', 'an', 'in', 'of', 'for',
  'to', 'about', 'can', 'you', 'u', 'so', 'start', 'open', 'launch', 'lesson', 'day', 'topic',
  'previous', 'prev', 'last', 'yesterday', 'again', 'repeat', 'restart', 'confused', 'stuck',
  'this', 'that', 'hey', 'priya', 'ms', 'mr', 'sir', 'maam', 'get',
]);

function extractTopicTokens(lowerMessage: string, excludeCourseAliases?: string[]): string[] {
  const stopWords = new Set(TOPIC_STOP_WORDS);
  for (const alias of excludeCourseAliases || []) {
    for (const word of alias.toLowerCase().split(/\s+/)) {
      if (word.length >= 2) stopWords.add(word);
    }
  }
  return lowerMessage
    .replace(/[^a-z0-9+#\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !stopWords.has(t));
}

function tokenMatchesText(tok: string, textLower: string): boolean {
  if (!tok || !textLower) return false;
  const stem = tok.endsWith('s') && tok.length > 4 ? tok.slice(0, -1) : tok;
  const escaped = stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}`, 'i').test(textLower);
}

function findMatchingPartInLesson(lesson: LongLesson, topicTokens: string[]): number {
  if (!topicTokens.length || !Array.isArray(lesson.parts)) return -1;
  let bestPart = -1;
  let bestHits = 0;
  for (let i = 0; i < lesson.parts.length; i += 1) {
    const part = lesson.parts[i];
    const partText = `${part?.title || ''} ${normalizeSay(part?.say).join(' ')} ${part?.example || ''}`.toLowerCase();
    let hits = 0;
    for (const tok of topicTokens) {
      if (tokenMatchesText(tok, partText)) hits += 1;
    }
    if (hits > bestHits) {
      bestHits = hits;
      bestPart = i;
    }
  }
  return bestHits > 0 ? bestPart : -1;
}

function lessonMatchesTopics(lesson: LongLesson, topicTokens: string[]): boolean {
  if (!topicTokens.length) return true;
  if (findMatchingPartInLesson(lesson, topicTokens) >= 0) return true;
  const headerText = `${lesson.title || ''} ${lesson.goal || ''} ${Array.isArray(lesson.summary) ? lesson.summary.join(' ') : ''}`.toLowerCase();
  return topicTokens.some((tok) => tokenMatchesText(tok, headerText));
}

function findTopicMatch(
  lowerMessage: string,
  index: CourseIndexEntry[],
  opts: {
    preferredCourseId?: string;
    excludeCourseAliases?: string[];
    currentDay?: number;
  } = {}
): { entry: CourseIndexEntry; lecture: CourseIndexEntry['lectures'][number] } | null {
  const tokens = extractTopicTokens(lowerMessage, opts.excludeCourseAliases);

  if (tokens.length === 0) return null;

  const currentDay = Math.max(1, opts.currentDay || 2);
  let best: { entry: CourseIndexEntry; lecture: CourseIndexEntry['lectures'][number]; score: number } | null = null;
  const asksCapstone = /\b(?:capstone|charter|architecture|platform|day\s*60)\b/i.test(lowerMessage);

  for (const entry of index) {
    const aliasBoost = entry.aliases.some((a) => new RegExp(`\\b${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lowerMessage)) ? 12 : 0;
    const activeBoost = opts.preferredCourseId && entry.courseId === opts.preferredCourseId ? 20 : 0;

    for (const lec of entry.lectures) {
      const titleLower = lec.title.toLowerCase();
      const bodyLower = `${lec.desc} ${lec.syllabus}`.toLowerCase();
      let score = 0;

      for (const tok of tokens) {
        if (titleLower.includes(tok)) score += 10;
        else if (bodyLower.includes(tok)) score += 4;
      }
      if (score === 0) continue;

      const introProximityBoost = lec.dayNum <= Math.max(10, currentDay + 2) ? 6 : 0;
      const capstonePenalty = !asksCapstone && lec.dayNum >= 58 ? -4 : 0;
      const total = score + aliasBoost + activeBoost + introProximityBoost + capstonePenalty;
      if (!best || total > best.score || (total === best.score && lec.dayNum < best.lecture.dayNum)) {
        best = { entry, lecture: lec, score: total };
      }
    }
  }

  return best && best.score >= 10 ? { entry: best.entry, lecture: best.lecture } : null;
}

function buildPartDigest(
  lesson: LongLesson,
  partIndex: number,
  intent: ResolvedLessonAction['intent'],
  courseTitle: string,
  dayNum: number
): { promptDigest: string; fallbackReply: string; part: LongLessonPart | undefined } {
  const parts = Array.isArray(lesson.parts) ? lesson.parts : [];
  const safeIdx = Math.max(0, Math.min(parts.length - 1, partIndex));
  const part = parts[safeIdx];
  const sayLines = normalizeSay(part?.say);
  const summaryLines = Array.isArray(lesson.summary) ? lesson.summary : [];

  const promptLines = [
    `Course: ${courseTitle} — Day ${dayNum}: "${lesson.title}"`,
    lesson.goal ? `Lesson Goal: ${lesson.goal}` : '',
    part ? `Teaching Part ${safeIdx + 1}/${parts.length}: "${part.title}"` : '',
    sayLines.length > 0 ? `Core Explanation:\n- ${sayLines.slice(0, 4).join('\n- ')}` : '',
    part?.example ? `Worked Example: ${part.example}` : '',
    part?.code ? `Code:\n\`\`\`\n${String(part.code).slice(0, 400)}\n\`\`\`` : '',
    part?.output ? `Expected Output: ${String(part.output).slice(0, 150)}` : '',
    part?.check?.question
      ? `Understanding Check Question: ${part.check.question} (Answer: ${
          typeof part.check.answer === 'number' && Array.isArray(part.check.options)
            ? (part.check.options[part.check.answer] || '')
            : String(part.check.answer ?? '')
        }; Why: ${part.check.why || ''})`
      : '',
    summaryLines.length > 0 ? `Key Takeaways: ${summaryLines.slice(0, 3).join('; ')}` : '',
  ].filter(Boolean);

  let fallbackReply = '';
  if (intent === 'launch') {
    fallbackReply = `Opening ${courseTitle.split('(')[0].trim()} Day ${dayNum}: "${lesson.title}" in the interactive classroom right now!`;
  } else if (intent === 'quiz' && part?.check?.question) {
    fallbackReply = `Quick check from "${part.title}": ${part.check.question} Tell me your answer and why!`;
  } else if (intent === 'example' && part) {
    fallbackReply = part.example
      ? `Here's the real example for "${part.title}": ${part.example}`
      : `In "${part.title}", focus on this idea: ${sayLines.slice(0, 2).join(' ')}`;
  } else if (part) {
    const core = sayLines.slice(0, 2).join(' ');
    const exampleBit = part.example ? ` Example: ${part.example}` : '';
    fallbackReply = `Let's cover Day ${dayNum} ("${lesson.title}"), Part ${safeIdx + 1} of ${parts.length} — ${part.title}. ${core}${exampleBit}`.trim();
  } else {
    fallbackReply = `Day ${dayNum} ("${lesson.title}") goal: ${lesson.goal || summaryLines.slice(0, 2).join(' ')}`;
  }

  return {
    promptDigest: promptLines.join('\n'),
    fallbackReply,
    part,
  };
}

/**
 * Resolves any student request about a specific course day or curriculum topic into real
 * LongLesson content (`src/generated/longLessons/*.json.gz`) and launch/tutoring actions.
 */
export async function resolveLessonRequest(
  message: string,
  opts: {
    activeCourseId?: string;
    teacherId?: string;
    lessonSession?: LessonSessionRef | null;
    completedQuests?: string[];
    enrolledTrack?: string;
  } = {}
): Promise<LessonResolutionResult | null> {
  const lower = String(message || '').toLowerCase().trim();
  if (!lower) return null;

  const index = getCatalogIndex();
  const teacherId = opts.teacherId || 'priya';

  // 1. Continuation of an active lesson session inside Priya chat ("next part", "quiz me", etc.)
  const contCmd = opts.lessonSession ? isLessonContinuationIntent(lower) : null;
  if (contCmd && opts.lessonSession) {
    const entry = index.find((e) => e.prefix === opts.lessonSession!.prefix) || index[0];
    const dayNum = opts.lessonSession.dayNum;
    const lesson = await getLongLessonServer(opts.lessonSession.prefix, dayNum);
    if (lesson) {
      const totalParts = Math.max(1, lesson.parts?.length || 1);
      let partIndex = opts.lessonSession.partIndex || 0;
      if (contCmd === 'next_part') partIndex = Math.min(totalParts - 1, partIndex + 1);
      if (contCmd === 'prev_part') partIndex = Math.max(0, partIndex - 1);

      const intent: ResolvedLessonAction['intent'] =
        contCmd === 'launch_current' ? 'launch' : contCmd;
      const digest = buildPartDigest(lesson, partIndex, intent, entry.courseTitle, dayNum);
      const launchUrl = `/quests/lesson?questId=${encodeURIComponent(opts.lessonSession.questId)}&teacherId=${encodeURIComponent(teacherId)}`;

      return {
        lessonAction: {
          questId: opts.lessonSession.questId,
          courseId: entry.courseId,
          courseTitle: entry.courseTitle,
          prefix: opts.lessonSession.prefix,
          dayNum,
          lessonTitle: lesson.title,
          goal: lesson.goal || '',
          totalParts,
          partIndex,
          partTitle: digest.part?.title || `Part ${partIndex + 1}`,
          codeSnippet: digest.part?.code ? String(digest.part.code).slice(0, 600) : undefined,
          checkQuestion: digest.part?.check?.question,
          launchUrl,
          autoLaunch: intent === 'launch',
          intent,
        },
        promptDigest: digest.promptDigest,
        deterministicFallbackReply: digest.fallbackReply,
        updatedSession: {
          questId: opts.lessonSession.questId,
          prefix: opts.lessonSession.prefix,
          dayNum,
          partIndex,
        },
      };
    }
  }

  // 2. Infer student's active course and current day from progress/track, then resolve explicit or relative day
  const inferred = inferActiveCourseAndCurrentDay(index, {
    activeCourseId: opts.activeCourseId,
    completedQuests: opts.completedQuests,
    enrolledTrack: opts.enrolledTrack,
  });
  const effectiveActiveCourseId = inferred.activeCourse?.courseId || opts.activeCourseId;
  const matchedCourse = findMatchingCourse(lower, index, effectiveActiveCourseId);
  const explicitDay = extractDayNumber(lower);
  const relativeDayOffset = explicitDay === null ? extractRelativeDayOffset(lower) : null;

  let targetEntry: CourseIndexEntry | null = null;
  let targetLecture: CourseIndexEntry['lectures'][number] | null = null;

  const targetDayNum = explicitDay !== null
    ? explicitDay
    : relativeDayOffset !== null
      ? Math.max(1, Math.min(60, inferred.currentDay + relativeDayOffset))
      : null;

  if (matchedCourse && targetDayNum !== null) {
    targetEntry = matchedCourse;
    targetLecture = matchedCourse.lectures.find((l) => l.dayNum === targetDayNum) || null;
  } else if (!matchedCourse && targetDayNum !== null && (inferred.activeCourse || effectiveActiveCourseId)) {
    const activeEntry = inferred.activeCourse || index.find((e) => e.courseId === effectiveActiveCourseId) || null;
    if (activeEntry) {
      targetEntry = activeEntry;
      targetLecture = activeEntry.lectures.find((l) => l.dayNum === targetDayNum) || null;
    }
  } else if (!matchedCourse && relativeDayOffset !== null) {
    // No activeCourseId provided at all (e.g., fresh telemetry) -> default to Python Backend Day max(1, 2 + offset)
    const fallbackEntry = index.find((e) => e.courseId === 'course-python-backend') || index[0] || null;
    if (fallbackEntry) {
      targetEntry = fallbackEntry;
      const d = Math.max(1, Math.min(60, 2 + relativeDayOffset));
      targetLecture = fallbackEntry.lectures.find((l) => l.dayNum === d) || fallbackEntry.lectures[0] || null;
    }
  }

  // Fall back to semantic keyword match across lectures if day wasn't specified (e.g. "I don't understand softmax")
  if (!targetLecture) {
    const topicHit = findTopicMatch(lower, index, {
      preferredCourseId: matchedCourse?.courseId || effectiveActiveCourseId,
      excludeCourseAliases: matchedCourse?.aliases,
      currentDay: inferred.currentDay,
    });
    if (topicHit) {
      targetEntry = topicHit.entry;
      targetLecture = topicHit.lecture;
    } else if (matchedCourse && /\b(?:don'?t\s+understand|did\s+not\s+understand|didn'?t\s+understand|explain|teach|start|open|launch|help|restart)\b/i.test(lower)) {
      // Course named cleanly without day/topic -> start/explain Day 1
      targetEntry = matchedCourse;
      targetLecture = matchedCourse.lectures[0] || null;
    }
  }

  if (!targetEntry || !targetLecture) return null;

  let lesson = await getLongLessonServer(targetEntry.prefix, targetLecture.dayNum);
  if (!lesson) return null;

  // Topic-aware verification: if no course was explicitly named AND the student asked about a specific topic
  // (e.g. "previous day topic comment"), verify the candidate LongLesson actually covers it;
  // otherwise check their progressed course's introductory/recent days & real LongLessons!
  const topicTokens = extractTopicTokens(lower, matchedCourse?.aliases);
  if (!matchedCourse && topicTokens.length > 0 && !lessonMatchesTopics(lesson, topicTokens)) {
    const searchEntries = Array.from(
      new Set([inferred.progressedCourse, targetEntry, index.find((e) => e.courseId === 'course-python-backend')].filter((x): x is CourseIndexEntry => Boolean(x)))
    );
    let foundMatch: { entry: CourseIndexEntry; lecture: CourseIndexEntry['lectures'][number]; loaded: LongLesson } | null = null;
    for (const se of searchEntries) {
      const scanDays = se.lectures.slice(0, Math.min(8, inferred.currentDay + 2));
      for (const lec of scanDays) {
        const candidate = await getLongLessonServer(se.prefix, lec.dayNum);
        if (candidate && lessonMatchesTopics(candidate, topicTokens)) {
          foundMatch = { entry: se, lecture: lec, loaded: candidate };
          break;
        }
      }
      if (foundMatch) break;
    }
    if (foundMatch) {
      targetEntry = foundMatch.entry;
      targetLecture = foundMatch.lecture;
      lesson = foundMatch.loaded;
    }
  }

  const totalParts = Math.max(1, lesson.parts?.length || 1);
  const leadingLaunch = /^\s*(?:please\s+)?(?:start|open|launch|go\s+to|take\s+me\s+to|begin)\b/i.test(lower);
  const explicitStartPhrase =
    /\b(?:(?:can|could|will|would|please)\s+(?:you|u)\s+(?:please\s+)?(?:start|open|launch|reopen|restart|take\s+me\s+to|begin)|(?:so|now|just)\s+(?:can\s+(?:you|u)\s+)?(?:start|open|launch)|start\s+(?:this|that|the)\s+(?:lesson|class|day)|start\s+again)\b/i.test(lower);
  const pureExplanationOnly =
    /\b(?:don'?t\s+understand|explain|teach|confused|help\s+me\s+understand|what\s+is|what\s+are|how)\b/i.test(lower) &&
    !explicitStartPhrase;
  const wantsLaunch = (leadingLaunch || explicitStartPhrase) && !pureExplanationOnly;
  const intent: ResolvedLessonAction['intent'] = wantsLaunch ? 'launch' : 'teach';
  const matchedPartIdx = topicTokens.length > 0 ? findMatchingPartInLesson(lesson, topicTokens) : -1;
  const partIndex = matchedPartIdx >= 0 ? matchedPartIdx : 0;

  const digest = buildPartDigest(lesson, partIndex, intent, targetEntry.courseTitle, targetLecture.dayNum);
  const launchUrl = `/quests/lesson?questId=${encodeURIComponent(targetLecture.questId)}&teacherId=${encodeURIComponent(teacherId)}`;

  return {
    lessonAction: {
      questId: targetLecture.questId,
      courseId: targetEntry.courseId,
      courseTitle: targetEntry.courseTitle,
      prefix: targetEntry.prefix,
      dayNum: targetLecture.dayNum,
      lessonTitle: lesson.title || targetLecture.title,
      goal: lesson.goal || targetLecture.desc,
      totalParts,
      partIndex,
      partTitle: digest.part?.title || 'Core Concept',
      codeSnippet: digest.part?.code ? String(digest.part.code).slice(0, 600) : undefined,
      checkQuestion: digest.part?.check?.question,
      launchUrl,
      autoLaunch: wantsLaunch,
      intent,
    },
    promptDigest: digest.promptDigest,
    deterministicFallbackReply: digest.fallbackReply,
    updatedSession: {
      questId: targetLecture.questId,
      prefix: targetEntry.prefix,
      dayNum: targetLecture.dayNum,
      partIndex,
    },
  };
}
