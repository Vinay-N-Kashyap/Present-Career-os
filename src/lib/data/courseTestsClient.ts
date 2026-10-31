/**
 * Client-safe block test question loader.
 *
 * Fetches only the 5 lessons needed for a block test via getLongLessonAsync (/api/lesson)
 * and builds the exact same deterministic TestQuestion[] array that the server grades against.
 */

import { getLongLessonAsync } from './longLessonClient';
import type { LongLesson } from './longLessonTypes';
import { buildTestQuestions, type TestQuestion } from './courseTestsCore';

export {
  DAYS_PER_TEST,
  QUESTIONS_PER_DAY,
  MIN_QUESTIONS,
  type TestQuestion,
  parseTestQuestId,
  testQuestId,
  withAnswerAt,
  addBlockTests,
  getLessonCheck,
  buildTestQuestions,
} from './courseTestsCore';

export async function getTestQuestionsAsync(
  prefix: string,
  start: number,
  end: number
): Promise<TestQuestion[]> {
  if (start < 1 || end < start) return [];
  const days: number[] = [];
  for (let d = start; d <= end; d++) days.push(d);

  const loaded = await Promise.all(
    days.map(async (day) => [day, await getLongLessonAsync(prefix, day)] as const)
  );
  const byDay = new Map<number, LongLesson | null>(loaded);

  return buildTestQuestions(prefix, start, end, (_p, day) => byDay.get(day) ?? null);
}
