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
    let prefix = '';

    for (const q of course.quests || []) {
      const parsed = parseQuestId(q.id);
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

function extractDayNumber(lowerMessage: string): number | null {
  const m = lowerMessage.match(/\b(?:day|lesson|module|session)\s*(?:#\s*)?([1-9]|[1-5]\d|60)\b/i);
  if (m?.[1]) return Number(m[1]);
  return null;
}

function findTopicMatch(
  lowerMessage: string,
  index: CourseIndexEntry[],
  preferredCourseId?: string
): { entry: CourseIndexEntry; lecture: CourseIndexEntry['lectures'][number] } | null {
  const stopWords = new Set([
    'i', 'do', 'dont', 'not', 'understand', 'explain', 'teach', 'me', 'please', 'help',
    'with', 'what', 'is', 'are', 'how', 'does', 'the', 'a', 'an', 'in', 'of', 'for',
    'to', 'about', 'can', 'you', 'start', 'open', 'launch', 'lesson', 'day', 'topic',
    'confused', 'stuck', 'this', 'that', 'hey', 'priya', 'ms', 'mr', 'sir', 'maam',
  ]);
  const tokens = lowerMessage
    .replace(/[^a-z0-9+#\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !stopWords.has(t));

  if (tokens.length === 0) return null;

  let best: { entry: CourseIndexEntry; lecture: CourseIndexEntry['lectures'][number]; score: number } | null = null;

  for (const entry of index) {
    const aliasBoost = entry.aliases.some((a) => new RegExp(`\\b${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lowerMessage)) ? 12 : 0;
    const activeBoost = preferredCourseId && entry.courseId === preferredCourseId ? 5 : 0;

    for (const lec of entry.lectures) {
      const titleLower = lec.title.toLowerCase();
      const bodyLower = `${lec.desc} ${lec.syllabus}`.toLowerCase();
      let score = 0;

      for (const tok of tokens) {
        if (titleLower.includes(tok)) score += 10;
        else if (bodyLower.includes(tok)) score += 4;
      }
      if (score === 0) continue;
      const total = score + aliasBoost + activeBoost;
      if (!best || total > best.score) {
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

  // 2. Explicit day + course (or active course), OR pure topic search across all 55 courses
  const matchedCourse = findMatchingCourse(lower, index, opts.activeCourseId);
  const explicitDay = extractDayNumber(lower);

  let targetEntry: CourseIndexEntry | null = null;
  let targetLecture: CourseIndexEntry['lectures'][number] | null = null;

  if (matchedCourse && explicitDay !== null) {
    targetEntry = matchedCourse;
    targetLecture = matchedCourse.lectures.find((l) => l.dayNum === explicitDay) || null;
  } else if (!matchedCourse && explicitDay !== null && opts.activeCourseId) {
    const activeEntry = index.find((e) => e.courseId === opts.activeCourseId) || null;
    if (activeEntry) {
      targetEntry = activeEntry;
      targetLecture = activeEntry.lectures.find((l) => l.dayNum === explicitDay) || null;
    }
  }

  // Fall back to semantic keyword match across lectures if day wasn't specified (e.g. "I don't understand softmax")
  if (!targetLecture) {
    const topicHit = findTopicMatch(lower, index, matchedCourse?.courseId || opts.activeCourseId);
    if (topicHit) {
      targetEntry = topicHit.entry;
      targetLecture = topicHit.lecture;
    } else if (matchedCourse && /\b(?:don'?t\s+understand|explain|teach|start|open|launch|help)\b/i.test(lower)) {
      // Course named cleanly without day/topic -> start/explain Day 1
      targetEntry = matchedCourse;
      targetLecture = matchedCourse.lectures[0] || null;
    }
  }

  if (!targetEntry || !targetLecture) return null;

  const lesson = await getLongLessonServer(targetEntry.prefix, targetLecture.dayNum);
  if (!lesson) return null;

  const totalParts = Math.max(1, lesson.parts?.length || 1);
  const wantsLaunch =
    /^\s*(?:please\s+)?(?:start|open|launch|go\s+to|take\s+me\s+to|begin)\b/i.test(lower) &&
    !/\b(?:don'?t\s+understand|explain|teach|confused|help\s+me\s+understand|what\s+is|how)\b/i.test(lower);
  const intent: ResolvedLessonAction['intent'] = wantsLaunch ? 'launch' : 'teach';
  const partIndex = 0;

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
