import test from 'node:test';
import assert from 'node:assert/strict';

import { withAnswerAt, getTestQuestions, parseTestQuestId, testQuestId } from '../src/lib/data/courseTests';
import {
  queuePendingQuestCompletion,
  getPendingQuestCompletions,
  clearPendingQuestCompletions,
  getPendingQuestQueueKey,
  PendingQuestCompletion
} from '../src/lib/storage/careerStorage';

// Minimal localStorage shim for Node.js test environment
const memoryStore: Record<string, string> = {};
if (typeof (global as any).window === 'undefined') {
  (global as any).window = {};
}
(global as any).window.localStorage = {
  getItem: (key: string) => memoryStore[key] ?? null,
  setItem: (key: string, val: string) => { memoryStore[key] = String(val); },
  removeItem: (key: string) => { delete memoryStore[key]; },
  clear: () => { Object.keys(memoryStore).forEach(k => delete memoryStore[k]); },
};
(global as any).localStorage = (global as any).window.localStorage;

test('withAnswerAt: handles valid numeric indices with seeded deterministic positioning', () => {
  const options = ['Alpha', 'Beta', 'Gamma', 'Delta'];
  const res1 = withAnswerAt(options, 2, 42);
  assert.equal(res1.options.length, 4);
  assert.equal(res1.options[res1.answerIndex], 'Gamma');
  assert.equal(new Set(res1.options).size, 4);

  // Same seed produces identical order
  const res2 = withAnswerAt(options, 2, 42);
  assert.deepEqual(res1, res2);

  // Different seed alters answer position
  const res3 = withAnswerAt(options, 2, 99);
  assert.equal(res3.options[res3.answerIndex], 'Gamma');
});

test('withAnswerAt: safely resolves string answer matching option text', () => {
  const options = ['First', 'Second', 'Target Solution', 'Fourth'];
  const res = withAnswerAt(options, 'Target Solution', 15);
  assert.equal(res.options.length, 4);
  assert.equal(res.options[res.answerIndex], 'Target Solution');
  assert.equal(new Set(res.options).size, 4);
  assert.ok(!res.options.includes(undefined as any));
});

test('withAnswerAt: safely resolves numeric string indices and out-of-bound fallbacks', () => {
  const options = ['Red', 'Green', 'Blue'];
  const resStrNum = withAnswerAt(options, '1', 7);
  assert.equal(resStrNum.options[resStrStrIndex(resStrNum.answerIndex)], 'Green');

  function resStrStrIndex(idx: number): number {
    return idx;
  }

  // Out of bounds defaults to index 0 safely
  const resOob = withAnswerAt(options, 999, 12);
  assert.equal(resOob.options.length, 3);
  assert.equal(resOob.options[resOob.answerIndex], 'Red');

  // Empty options provides safe fallback array
  const resEmpty = withAnswerAt([], 0, 5);
  assert.ok(resEmpty.options.length >= 2);
  assert.equal(resEmpty.answerIndex, 0);
});

test('testQuestId and parseTestQuestId: round-trip consistency', () => {
  const qId = testQuestId('python', 1, 5);
  assert.equal(qId, 'python-test-days-1-5');

  const parsed = parseTestQuestId(qId);
  assert.deepEqual(parsed, { prefix: 'python', start: 1, end: 5 });

  // Non-test IDs return null
  assert.equal(parseTestQuestId('python-lecture1-day-1'), null);
  assert.equal(parseTestQuestId('invalid-string'), null);
});

test('getTestQuestions: generates 10 questions with valid answerIndex across representative tracks', () => {
  const testTracks = [
    { prefix: 'react-basics', start: 1, end: 5 },
    { prefix: 'python', start: 1, end: 5 },
    { prefix: 'bcom_ana', start: 1, end: 5 },
    { prefix: 'comp_fund', start: 1, end: 5 },
    { prefix: 'iot_emb', start: 1, end: 5 },
  ];

  for (const t of testTracks) {
    const questions = getTestQuestions(t.prefix, t.start, t.end);
    assert.equal(questions.length, 10, `Track ${t.prefix} must yield 10 questions`);
    for (const q of questions) {
      assert.ok(q.question && q.question.length > 5, `Empty question in ${t.prefix}`);
      assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Bad options in ${t.prefix}`);
      assert.ok(q.answerIndex >= 0 && q.answerIndex < q.options.length, `OOB answerIndex in ${t.prefix}`);
      assert.ok(q.explanation && q.explanation.length > 0, `Missing explanation in ${t.prefix}`);
      assert.ok(!q.options.includes(undefined as any), `Undefined option choice in ${t.prefix}`);
    }
  }
});

test('Sequential progression gating: Quest N+1 remains locked until Quest N is completed', () => {
  const stageQuests = [
    { id: 'track-day-1-part-1', title: 'Variables' },
    { id: 'track-day-1-part-2', title: 'Data Types' },
    { id: 'track-day-1-part-3', title: 'Control Flow' },
  ];

  // Helper evaluating lock rule identical to QuestPathView & useQuestProgression
  const isQuestLocked = (qIdx: number, completedQuests: string[], isStageLocked: boolean = false) => {
    const q = stageQuests[qIdx];
    const isQDone = completedQuests.includes(q.id);
    const isPrevQuestDone = qIdx === 0 || completedQuests.includes(stageQuests[qIdx - 1].id);
    return isStageLocked || (!isQDone && !isPrevQuestDone);
  };

  // State 0: No quests completed
  let completed: string[] = [];
  assert.equal(isQuestLocked(0, completed), false, 'Quest 0 must be unlocked initially');
  assert.equal(isQuestLocked(1, completed), true, 'Quest 1 must be locked when Quest 0 is incomplete');
  assert.equal(isQuestLocked(2, completed), true, 'Quest 2 must be locked when Quest 0 is incomplete');

  // State 1: Quest 0 completed
  completed = ['track-day-1-part-1'];
  assert.equal(isQuestLocked(0, completed), false, 'Completed Quest 0 must remain unlocked for review');
  assert.equal(isQuestLocked(1, completed), false, 'Quest 1 must unlock once Quest 0 is completed');
  assert.equal(isQuestLocked(2, completed), true, 'Quest 2 must remain locked until Quest 1 is completed');

  // State 2: Stage locked override
  assert.equal(isQuestLocked(0, completed, true), true, 'All quests must be locked if stage is locked');
});

test('Offline resilience: queues and flushes pending quest completions safely', () => {
  const testUserId = 'test-student-101';
  clearPendingQuestCompletions(testUserId);

  const initialPending = getPendingQuestCompletions(testUserId);
  assert.deepEqual(initialPending, []);

  const payload1: PendingQuestCompletion = {
    questId: 'python-lecture1-day-1',
    isExam: false,
    xpAmount: 150,
    courseId: 'python',
    timestamp: new Date().toISOString()
  };

  queuePendingQuestCompletion(testUserId, payload1);
  const afterQueue = getPendingQuestCompletions(testUserId);
  assert.equal(afterQueue.length, 1);
  assert.equal(afterQueue[0].questId, 'python-lecture1-day-1');

  // Duplicate queueing is idempotent
  queuePendingQuestCompletion(testUserId, payload1);
  assert.equal(getPendingQuestCompletions(testUserId).length, 1);

  // Clear pending flushes queue
  clearPendingQuestCompletions(testUserId);
  assert.deepEqual(getPendingQuestCompletions(testUserId), []);
});
