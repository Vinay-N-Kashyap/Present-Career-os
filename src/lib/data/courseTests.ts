/**
 * A short test after every 5 course days.
 *
 * Each course day is a lesson followed by two practice tasks. Instead of an exam straight after a
 * single lesson, a test comes after every 5 days (and after the last day) and covers those days.
 * Its questions are the check questions of the days' lessons: 2 per day, so about 10 per test.
 * Pass mark 70%, and it can be retaken.
 */
import { getLongLessonServer } from './longLessonServer';
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

/** The questions of the test covering days start..end of a course (empty if the days have none). */
export function getTestQuestions(prefix: string, start: number, end: number): TestQuestion[] {
  return buildTestQuestions(prefix, start, end, getLongLessonServer);
}
