// tests/avatar_mentor_suite.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseWakeWord,
} from '../src/lib/avatar/wakeWordParser';

import {
  isNextTaskIntent,
  isValidSnapshotTimestamp,
  calculateEngagementIndex,
  getAuthoritativeNextTask,
  type StudentProgressSnapshot,
  type CurriculumItem,
} from '../src/lib/avatar/deterministicAdvisor';

// ============================================================================
// SUITE 1: Wake-Word & Name Parsing (Priya / Anish)
// ============================================================================
test('WakeWord: Handles standard voice commands', () => {
  const result = parseWakeWord('Hey Priya, open quests');
  assert.strictEqual(result.hasWakeWord, true);
  assert.strictEqual(result.mentor, 'priya');
  assert.strictEqual(result.command, 'open quests');
  assert.strictEqual(result.isStandaloneWake, false);
});

test('WakeWord: Handles comma between greeting and mentor name', () => {
  const result = parseWakeWord('Hey, Priya, open quests');
  assert.strictEqual(result.hasWakeWord, true);
  assert.strictEqual(result.mentor, 'priya');
  assert.strictEqual(result.command, 'open quests');
  assert.strictEqual(result.isStandaloneWake, false);
});

test('WakeWord: Handles Anish with colon or hyphen punctuation', () => {
  const result1 = parseWakeWord('Hi Anish: show my progress');
  assert.strictEqual(result1.hasWakeWord, true);
  assert.strictEqual(result1.mentor, 'anish');
  assert.strictEqual(result1.command, 'show my progress');

  const result2 = parseWakeWord('hello anish - take me to arena');
  assert.strictEqual(result2.hasWakeWord, true);
  assert.strictEqual(result2.mentor, 'anish');
  assert.strictEqual(result2.command, 'take me to arena');
});

test('WakeWord: Detects standalone wake-words (user said only mentor name)', () => {
  const r1 = parseWakeWord('Hey Priya');
  assert.strictEqual(r1.hasWakeWord, true);
  assert.strictEqual(r1.mentor, 'priya');
  assert.strictEqual(r1.isStandaloneWake, true);
  assert.strictEqual(r1.command, '');

  const r2 = parseWakeWord('Priya!');
  assert.strictEqual(r2.hasWakeWord, true);
  assert.strictEqual(r2.mentor, 'priya');
  assert.strictEqual(r2.isStandaloneWake, true);

  const r3 = parseWakeWord('  Anish.  ');
  assert.strictEqual(r3.hasWakeWord, true);
  assert.strictEqual(r3.mentor, 'anish');
  assert.strictEqual(r3.isStandaloneWake, true);
});

test('WakeWord: Does NOT false-positive on prefix collisions (Priyadarshini / Anishka)', () => {
  const r1 = parseWakeWord('Priyadarshini open quests');
  assert.strictEqual(r1.hasWakeWord, false);
  assert.strictEqual(r1.mentor, null);
  assert.strictEqual(r1.command, 'Priyadarshini open quests');

  const r2 = parseWakeWord('Anishka where is my certificate');
  assert.strictEqual(r2.hasWakeWord, false);
  assert.strictEqual(r2.mentor, null);
});

test('WakeWord: Resilient to non-string or empty inputs', () => {
  assert.deepStrictEqual(parseWakeWord(null), { hasWakeWord: false, mentor: null, command: '', isStandaloneWake: false });
  assert.deepStrictEqual(parseWakeWord(undefined), { hasWakeWord: false, mentor: null, command: '', isStandaloneWake: false });
  assert.deepStrictEqual(parseWakeWord(12345), { hasWakeWord: false, mentor: null, command: '', isStandaloneWake: false });
  assert.deepStrictEqual(parseWakeWord('   '), { hasWakeWord: false, mentor: null, command: '', isStandaloneWake: false });
});

// ============================================================================
// SUITE 2: Anchored Next-Task Intent vs Open-Ended Technical Questions
// ============================================================================
test('Intent: Matches legitimate curriculum next-task questions', () => {
  assert.strictEqual(isNextTaskIntent("What's next?"), true);
  assert.strictEqual(isNextTaskIntent("what is next"), true);
  assert.strictEqual(isNextTaskIntent("What should I do next?"), true);
  assert.strictEqual(isNextTaskIntent("what should I study next"), true);
  assert.strictEqual(isNextTaskIntent("next quest!"), true);
  assert.strictEqual(isNextTaskIntent("next task"), true);
  assert.strictEqual(isNextTaskIntent("what should I do?"), true);
});

test('Intent: Rejects open-ended technical questions that happen to contain "next" or "do"', () => {
  // P0 Edge Case: Must NOT misclassify technical queries as curriculum requests
  assert.strictEqual(isNextTaskIntent("What should I do about this React bug?"), false);
  assert.strictEqual(isNextTaskIntent("What should I do with this Docker container error?"), false);
  assert.strictEqual(isNextTaskIntent("Explain Next.js server components"), false);
  assert.strictEqual(isNextTaskIntent("How do I install next-auth?"), false);
  assert.strictEqual(isNextTaskIntent("What is the next best algorithm for sorting?"), false);
});

// ============================================================================
// SUITE 3: Snapshot Timestamp Freshness & Validation
// ============================================================================
test('Timestamp: Accepts fresh timestamps within 24 hours', () => {
  const now = 1700000000000;
  const fiveMinAgo = now - 5 * 60 * 1000;
  assert.strictEqual(isValidSnapshotTimestamp(fiveMinAgo, 24 * 60 * 60 * 1000, now), true);
});

test('Timestamp: Rejects future timestamps exceeding 5 minutes clock skew', () => {
  const now = 1700000000000;
  const future10Min = now + 10 * 60 * 1000;
  assert.strictEqual(isValidSnapshotTimestamp(future10Min, 24 * 60 * 60 * 1000, now), false);
});

test('Timestamp: Rejects stale timestamps exceeding max age', () => {
  const now = 1700000000000;
  const yesterday25h = now - 25 * 60 * 60 * 1000;
  assert.strictEqual(isValidSnapshotTimestamp(yesterday25h, 24 * 60 * 60 * 1000, now), false);
});

test('Timestamp: Rejects NaN, null, strings, and infinite values', () => {
  const now = 1700000000000;
  assert.strictEqual(isValidSnapshotTimestamp(NaN, 24 * 60 * 60 * 1000, now), false);
  assert.strictEqual(isValidSnapshotTimestamp(Infinity, 24 * 60 * 60 * 1000, now), false);
  assert.strictEqual(isValidSnapshotTimestamp("1700000000000", 24 * 60 * 60 * 1000, now), false);
  assert.strictEqual(isValidSnapshotTimestamp(null, 24 * 60 * 60 * 1000, now), false);
  assert.strictEqual(isValidSnapshotTimestamp(undefined, 24 * 60 * 60 * 1000, now), false);
});

// ============================================================================
// SUITE 4: Mathematically Clamped Engagement Index
// ============================================================================
test('Engagement: Calculates base index for new student with zero activity', () => {
  const score = calculateEngagementIndex({});
  assert.strictEqual(score, 0.30);
});

test('Engagement: Progressively increases with verified streak and quests', () => {
  // 3-day streak (+0.15), 10 quests (+0.10) => 0.30 + 0.15 + 0.10 = 0.55
  const score = calculateEngagementIndex({ streakDays: 3, completedQuests: 10, positiveSessions: 0 });
  assert.strictEqual(score, 0.55);
});

test('Engagement: Clamps strictly to 1.00 maximum even with extreme inputs', () => {
  const score = calculateEngagementIndex({ streakDays: 365, completedQuests: 1000, positiveSessions: 50 });
  assert.strictEqual(score, 1.00);
});

test('Engagement: Resilient to NaN, negative, and invalid values (never returns NaN)', () => {
  const s1 = calculateEngagementIndex({ streakDays: NaN, completedQuests: null });
  assert.strictEqual(s1, 0.30);

  const s2 = calculateEngagementIndex({ streakDays: -5, completedQuests: -10 });
  assert.strictEqual(s2, 0.30);
});

// ============================================================================
// SUITE 5: Authoritative Deterministic Task Selection
// ============================================================================
const MOCK_CURRICULUM: CurriculumItem[] = [
  { questId: 'quest_1', courseId: 'g3d', title: 'Coordinate Systems' },
  { questId: 'quest_2', courseId: 'g3d', title: 'Vertex Shaders' },
  { questId: 'quest_3', courseId: 'g3d', title: 'Hi-Z Occlusion' },
  { questId: 'quest_4', courseId: 'g3d', title: 'Skeletal Rigging' },
];

test('Advisor: Selects the FIRST uncompleted quest in curriculum sequence', () => {
  const now = 1700000000000;
  const snapshot: StudentProgressSnapshot = {
    userId: 'student_42',
    courseId: 'g3d',
    completedQuestIds: ['quest_1', 'quest_2'],
    syncedAt: now - 30 * 60 * 1000, // 30 min ago
  };

  const result = getAuthoritativeNextTask(snapshot, 'student_42', MOCK_CURRICULUM, now);
  assert.strictEqual(result.status, 'VERIFIED_TASK');
  assert.strictEqual(result.questId, 'quest_3');
  assert.strictEqual(result.courseId, 'g3d');
  assert.strictEqual(result.route, '/quests/g3d/quest_3');
  assert.match(result.speechText, /quest_3: Hi-Z Occlusion/);
});

test('Advisor: Detects course completion when all quests are satisfied', () => {
  const now = 1700000000000;
  const snapshot: StudentProgressSnapshot = {
    userId: 'student_42',
    courseId: 'g3d',
    completedQuestIds: ['quest_1', 'quest_2', 'quest_3', 'quest_4'],
    syncedAt: now - 10 * 60 * 1000,
  };

  const result = getAuthoritativeNextTask(snapshot, 'student_42', MOCK_CURRICULUM, now);
  assert.strictEqual(result.status, 'COURSE_COMPLETED');
  assert.strictEqual(result.route, '/projects');
  assert.match(result.speechText, /completed all curriculum quests/);
});

test('Advisor: Rejects stale progress snapshot with explicit offline warning', () => {
  const now = 1700000000000;
  const snapshot: StudentProgressSnapshot = {
    userId: 'student_42',
    courseId: 'g3d',
    completedQuestIds: ['quest_1'],
    syncedAt: now - 26 * 60 * 60 * 1000, // 26 hours ago!
  };

  const result = getAuthoritativeNextTask(snapshot, 'student_42', MOCK_CURRICULUM, now);
  assert.strictEqual(result.status, 'STALE_SNAPSHOT');
  assert.match(result.speechText, /cannot verify your latest progress while offline/i);
});

test('Advisor: Rejects profile mismatch when authenticated user does not match snapshot', () => {
  const now = 1700000000000;
  const snapshot: StudentProgressSnapshot = {
    userId: 'student_OTHER',
    courseId: 'g3d',
    completedQuestIds: [],
    syncedAt: now,
  };

  const result = getAuthoritativeNextTask(snapshot, 'student_42', MOCK_CURRICULUM, now);
  assert.strictEqual(result.status, 'USER_MISMATCH');
  assert.match(result.speechText, /profile mismatch/i);
});
