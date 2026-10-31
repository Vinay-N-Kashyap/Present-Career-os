/**
 * Shared pure logic for building 5-day block test questions and daily lesson checks.
 * Zero Node fs or 131 MB curriculum barrel imports — safe for both browser and server.
 */

import { resolvePilotDay } from './curriculumEnricher';
import type { LongLesson } from './longLessonTypes';

export {
  DAYS_PER_TEST,
  QUESTIONS_PER_DAY,
  MIN_QUESTIONS,
  type TestQuestion,
  parseTestQuestId,
  testQuestId,
  withAnswerAt,
  addBlockTests,
} from './blockTests';
import {
  QUESTIONS_PER_DAY,
  type TestQuestion,
  withAnswerAt,
} from './blockTests';

function spread<T>(items: T[], count: number): T[] {
  if (items.length <= count) return items;
  const step = items.length / count;
  return Array.from({ length: count }, (_, i) => items[Math.floor(step * i + step / 2)]);
}

/** A predict-the-output check before its answer choices are made. */
interface OutputQuestion {
  question: string;
  answer: string;
  explanation: string;
  seed: number;
}

/** 'number', 'code' (like VALIDATION_FAILED), 'colour' (#ffffff) or 'text', so a wrong choice looks like the right one. */
function answerShape(answer: string): string {
  if (/^[-+$]?[\d.,]+%?$/.test(answer.trim())) return 'number';
  if (/^[A-Z][A-Z0-9]*(_[A-Z0-9]+)+$/.test(answer.trim())) return 'code';
  if (/^#[0-9a-f]{3,8}$/i.test(answer.trim())) return 'colour';
  return 'text';
}

/** Same pick every time for the same question, so a retake shows the same test. */
function seededOrder<T>(items: T[], seed: number): T[] {
  return items
    .map((item, i) => ({ item, key: Math.sin(seed * 9301 + i * 49297) }))
    .sort((a, b) => a.key - b.key)
    .map((x) => x.item);
}

/**
 * The right output among 3 wrong ones. The wrong ones are other lessons' outputs of the same shape
 * (a number among numbers, a code among codes), so the answer cannot be spotted without knowing it.
 */
function withChoices(q: OutputQuestion, pool: string[]): TestQuestion {
  const others = [...new Set(pool)].filter((a) => a !== q.answer);
  const sameShape = seededOrder(others.filter((a) => answerShape(a) === answerShape(q.answer)), q.seed);
  const otherShape = seededOrder(others.filter((a) => answerShape(a) !== answerShape(q.answer)), q.seed);
  const fallback = ['undefined', 'null', 'An error'].filter((a) => a !== q.answer);
  const wrong = [...sameShape, ...otherShape, ...fallback].slice(0, 3);
  const answerIndex = q.seed % (wrong.length + 1);
  const options = [...wrong];
  options.splice(answerIndex, 0, q.answer);
  return { question: q.question, options, answerIndex, explanation: q.explanation };
}

function outputQuestionsForDay(prefix: string, day: number): OutputQuestion[] {
  const plan = resolvePilotDay(prefix, day);
  const blocks: any[] = Array.isArray(plan?.blocks) ? plan.blocks : [];
  const out: OutputQuestion[] = [];
  blocks.forEach((block, i) => {
    const d = block?.diagnosticCheck;
    const question = d?.questionPrompt || d?.question;
    const hasOptions = Array.isArray(d?.options) && d.options.length >= 2 && typeof d.correctIndex === 'number';
    if (question && !hasOptions && typeof d.expectedStringOutput === 'string' && d.expectedStringOutput) {
      out.push({ question, answer: d.expectedStringOutput, explanation: typeof d.explanation === 'string' ? d.explanation : '', seed: day * 7 + i });
    }
  });
  return out;
}

/**
 * A lesson block's check as a multiple-choice question, or null if it has none. Written checks put
 * the right answer first, so it is moved to a fixed spot picked by the seed. Predict-the-output
 * checks get their wrong choices from `pool` (see withChoices).
 */
function checkQuestion(block: any, seed: number, pool: string[]): TestQuestion | null {
  const d = block?.diagnosticCheck;
  const question = d?.questionPrompt || d?.question;
  if (!question) return null;
  const explanation = typeof d.explanation === 'string' && d.explanation.trim()
    ? d.explanation
    : (typeof d.why === 'string' && d.why.trim() ? d.why : '');
  if (Array.isArray(d.options) && d.options.length >= 2 && typeof d.correctIndex === 'number' && d.options[d.correctIndex] !== undefined) {
    return { question, ...withAnswerAt(d.options, d.correctIndex, seed), explanation };
  }
  if (typeof d.expectedStringOutput === 'string' && d.expectedStringOutput) {
    return withChoices({ question, answer: d.expectedStringOutput, explanation, seed }, pool);
  }
  return null;
}

/** Outputs of the lessons from 10 days before `start` to 10 days after `end`: the wrong choices. */
function outputPool(prefix: string, start: number, end: number): string[] {
  const pool: string[] = [];
  for (let day = Math.max(1, start - 10); day <= end + 10; day++) {
    pool.push(...outputQuestionsForDay(prefix, day).map((q) => q.answer));
  }
  return pool;
}

function questionsForDayWithLookup(
  prefix: string,
  day: number,
  pool: string[],
  lookupLongLesson: (prefix: string, day: number) => LongLesson | null
): TestQuestion[] {
  const long = lookupLongLesson(prefix, day);
  if (long) {
    return spread(long.parts.map((p, i) => ({ p, i })), QUESTIONS_PER_DAY).map(({ p, i }) => {
      const rawCheck: any = p.check || {};
      const rawAnswer = rawCheck.answer ?? rawCheck.answerIndex ?? rawCheck.correctIndex ?? 0;
      const rawWhy = rawCheck.why || rawCheck.explanation || `This option matches the core concept explained in "${p.title || `Day ${day} Part ${i + 1}`}".`;
      return {
        question: rawCheck.question || `Which statement best summarizes "${p.title || `Day ${day} Part ${i + 1}`}"?`,
        ...withAnswerAt(rawCheck.options || ['Follow the lesson step-by-step method', 'Skip verification steps'], rawAnswer, day * 7 + i),
        explanation: rawWhy,
      };
    });
  }

  const plan = resolvePilotDay(prefix, day);
  const blocks: any[] = Array.isArray(plan?.blocks) ? plan.blocks : [];
  const fromPlan = blocks
    .map((block, i) => checkQuestion(block, day * 7 + i, pool))
    .filter((q): q is TestQuestion => q !== null);
  return spread(fromPlan, QUESTIONS_PER_DAY);
}

/** The check question shown after block `blockIndex` of a lesson day, with its answer choices. */
export function getLessonCheck(prefix: string, day: number, blockIndex: number): TestQuestion | null {
  const plan = resolvePilotDay(prefix, day);
  const block = Array.isArray(plan?.blocks) ? plan.blocks[blockIndex] : null;
  if (!block) return null;
  return checkQuestion(block, day * 7 + blockIndex, outputPool(prefix, day, day));
}

/** Pure builder used by both server (`getTestQuestions`) and client (`getTestQuestionsAsync`). */
export function buildTestQuestions(
  prefix: string,
  start: number,
  end: number,
  lookupLongLesson: (prefix: string, day: number) => LongLesson | null
): TestQuestion[] {
  if (start < 1 || end < start) return [];
  const pool = outputPool(prefix, start, end);
  const out: TestQuestion[] = [];
  for (let day = start; day <= end; day++) {
    out.push(...questionsForDayWithLookup(prefix, day, pool, lookupLongLesson));
  }
  return out.map((q, idx) => {
    const safeOptions = Array.isArray(q.options) && q.options.length >= 2
      ? q.options
      : ['Apply the verified lesson procedure', 'Skip the verification check'];
    const safeAnswerIdx = (typeof q.answerIndex === 'number' && q.answerIndex >= 0 && q.answerIndex < safeOptions.length)
      ? q.answerIndex
      : 0;
    return {
      question: q.question || `Concept Check ${idx + 1}`,
      options: safeOptions,
      answerIndex: safeAnswerIdx,
      explanation: q.explanation || 'Review the lesson explanation above to see why this choice is accurate.',
    };
  });
}
