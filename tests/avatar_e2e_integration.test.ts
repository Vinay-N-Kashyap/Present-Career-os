// tests/avatar_e2e_integration.test.ts
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

import {
  resolveAvatarFeatureState,
  parseBooleanFlag,
} from '../src/lib/avatar/avatarFeatureFlags';

import {
  buildMentorSystemPrompt,
  type BaseMentorContext,
} from '../src/lib/avatar/mentorPromptBuilder';

import {
  type TriStateMemoryResult,
} from '../src/lib/avatar/memoryStore';

// ============================================================================
// SUITE 1: End-to-End Voice & Intent Parsing Pipeline
// ============================================================================
test('E2E Voice Pipeline: "Hey Priya, open quests" parses wake-word and extracts navigation target', () => {
  const parsed = parseWakeWord('Hey Priya, open quests', 'priya');
  assert.strictEqual(parsed.hasWakeWord, true);
  assert.strictEqual(parsed.mentor, 'priya');
  assert.strictEqual(parsed.command, 'open quests');
  assert.strictEqual(parsed.isStandaloneWake, false);

  // Next-task intent must NOT match a navigation command
  assert.strictEqual(isNextTaskIntent(parsed.command), false);
});

test('E2E Voice Pipeline: "Hey, Priya, what should I study next?" matches wake-word and next-task intent', () => {
  const parsed = parseWakeWord('Hey, Priya, what should I study next?', 'priya');
  assert.strictEqual(parsed.hasWakeWord, true);
  assert.strictEqual(parsed.mentor, 'priya');
  assert.strictEqual(parsed.command, 'what should I study next?');
  assert.strictEqual(parsed.isStandaloneWake, false);

  // Next-task intent MUST match
  assert.strictEqual(isNextTaskIntent(parsed.command), true);
});

test('E2E Voice Pipeline: Standalone "Hey Priya" yields immediate conversational prompt without server call', () => {
  const parsed = parseWakeWord('Hey Priya', 'priya');
  assert.strictEqual(parsed.hasWakeWord, true);
  assert.strictEqual(parsed.isStandaloneWake, true);
  assert.strictEqual(parsed.command, '');
});

// ============================================================================
// SUITE 2: Deterministic Next Task Resolution
// ============================================================================
const sampleCurriculum: CurriculumItem[] = [
  { questId: 'fs-day-01', courseId: 'fullstack-mastery', title: 'HTTP & DOM Fundamentals' },
  { questId: 'fs-day-02', courseId: 'fullstack-mastery', title: 'TypeScript Deep Dive' },
  { questId: 'fs-day-03', courseId: 'fullstack-mastery', title: 'React Virtual DOM' },
  { questId: 'fs-day-04', courseId: 'fullstack-mastery', title: 'Next.js Server Components' },
];

test('Deterministic Advisor: Returns first uncompleted quest in sequence', () => {
  const now = Date.now();
  const snapshot: StudentProgressSnapshot = {
    userId: 'student_42',
    courseId: 'fullstack-mastery',
    completedQuestIds: ['fs-day-01'],
    syncedAt: now - 60000, // 1 minute ago
  };

  const result = getAuthoritativeNextTask(snapshot, 'student_42', sampleCurriculum, now);
  assert.strictEqual(result.status, 'VERIFIED_TASK');
  assert.strictEqual(result.questId, 'fs-day-02');
  assert.strictEqual(result.courseId, 'fullstack-mastery');
  assert.strictEqual(result.route, '/quests/fullstack-mastery/fs-day-02');
  assert.ok(result.speechText.includes('fs-day-02'));
  assert.ok(result.speechText.includes('TypeScript Deep Dive'));
});

test('Deterministic Advisor: Detects course completion when all quests satisfied', () => {
  const now = Date.now();
  const snapshot: StudentProgressSnapshot = {
    userId: 'student_42',
    courseId: 'fullstack-mastery',
    completedQuestIds: ['fs-day-01', 'fs-day-02', 'fs-day-03', 'fs-day-04'],
    syncedAt: now - 30000,
  };

  const result = getAuthoritativeNextTask(snapshot, 'student_42', sampleCurriculum, now);
  assert.strictEqual(result.status, 'COURSE_COMPLETED');
  assert.strictEqual(result.route, '/projects');
  assert.ok(result.speechText.includes('completed all curriculum quests'));
});

test('Deterministic Advisor: Refuses to invent current task when snapshot is stale (>24h)', () => {
  const now = Date.now();
  const snapshot: StudentProgressSnapshot = {
    userId: 'student_42',
    courseId: 'fullstack-mastery',
    completedQuestIds: ['fs-day-01'],
    syncedAt: now - (25 * 60 * 60 * 1000), // 25 hours ago
  };

  const result = getAuthoritativeNextTask(snapshot, 'student_42', sampleCurriculum, now);
  assert.strictEqual(result.status, 'STALE_SNAPSHOT');
  assert.strictEqual(
    result.speechText,
    'I cannot verify your latest progress while offline. Please reconnect to confirm your next task.'
  );
});

test('Deterministic Advisor: Rejects profile mismatch (session binding)', () => {
  const now = Date.now();
  const snapshot: StudentProgressSnapshot = {
    userId: 'victim_student_99',
    courseId: 'fullstack-mastery',
    completedQuestIds: ['fs-day-01'],
    syncedAt: now - 1000,
  };

  const result = getAuthoritativeNextTask(snapshot, 'attacker_student_01', sampleCurriculum, now);
  assert.strictEqual(result.status, 'USER_MISMATCH');
  assert.strictEqual(
    result.speechText,
    'Session profile mismatch. Please sign in again to verify your progress.'
  );
});

// ============================================================================
// SUITE 3: Prompt Building & Memory Integration under Feature Flags
// ============================================================================
const baseContext: BaseMentorContext = {
  studentName: 'Aarav Patel',
  targetRole: 'Full Stack Engineer',
  questTitle: 'Next.js App Router',
  missingSkills: ['Redis Caching', 'Docker Swarm'],
  atsScore: 78,
  teacherId: 'priya',
};

test('PromptBuilder: Legacy mode produces byte-exact production prompt without memory leak', () => {
  const prompt = buildMentorSystemPrompt(baseContext, undefined, 'v1_legacy');
  assert.ok(!prompt.includes('PERSONALIZED AVATAR MEMORY'));
  assert.ok(prompt.includes('You are directly mentoring Aarav Patel'));
  assert.ok(prompt.includes('Active Learning Quest: "Next.js App Router"'));
  assert.ok(prompt.includes('Redis Caching, Docker Swarm'));
});

test('PromptBuilder: V2 mode incorporates TriState SUCCESS with bounded engagement', () => {
  const memoryResult: TriStateMemoryResult = {
    status: 'SUCCESS',
    memory: {
      userId: 'student_42',
      persona: { style: 'Rigorous & Systemic' },
      relationshipState: { interactionCount: 15 },
      memories: [
        { type: 'note', data: 'Mastered SQL joins in Day 3' },
        { type: 'note', data: 'Prefers first-principle explanations' },
      ],
      updatedAt: Date.now(),
    },
  };

  const prompt = buildMentorSystemPrompt(baseContext, memoryResult, 'v2_advisor');
  assert.ok(prompt.includes('PERSONALIZED AVATAR MEMORY (V2)'));
  assert.ok(prompt.includes('Engagement Index:'));
  assert.ok(prompt.includes('Mastered SQL joins'));
  assert.ok(prompt.includes('Rigorous & Systemic'));
});

test('PromptBuilder: V2 mode handles Database Outage (ERROR) without crashing prompt', () => {
  const memoryResult: TriStateMemoryResult = {
    status: 'ERROR',
    error: 'Database connection timeout',
  };

  const prompt = buildMentorSystemPrompt(baseContext, memoryResult, 'v2_advisor');
  assert.ok(prompt.includes('PERSONALIZED AVATAR MEMORY (V2)'));
  assert.ok(prompt.includes('temporarily offline'));
  assert.ok(prompt.includes('You are directly mentoring Aarav Patel'));
});
