// tests/avatar_chaos_resilience.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';

import { parseWakeWord } from '../src/lib/avatar/wakeWordParser';
import {
  isNextTaskIntent,
  isValidSnapshotTimestamp,
  calculateEngagementIndex,
  getAuthoritativeNextTask,
  StudentProgressSnapshot,
  CurriculumItem,
} from '../src/lib/avatar/deterministicAdvisor';
import { resolveAvatarFeatureState } from '../src/lib/avatar/avatarFeatureFlags';
import { buildMentorSystemPrompt, BaseMentorContext } from '../src/lib/avatar/mentorPromptBuilder';
import { TriStateMemoryResult } from '../src/lib/avatar/memoryStore';

// ============================================================================
// SUITE 1: Extreme Chaos & Malicious / Adversarial Inputs
// ============================================================================
test('Chaos: WakeWord handles 10,000-character buffer overflow attack cleanly', () => {
  const spam = 'Hey Priya ' + 'A'.repeat(10000);
  const result = parseWakeWord(spam);
  assert.strictEqual(result.hasWakeWord, true);
  assert.strictEqual(result.mentor, 'priya');
  assert.strictEqual(result.command.length, 10000);
});

test('Chaos: WakeWord handles SQL injection and HTML script tags safely', () => {
  const injection = "Hey Anish, <script>alert('xss')</script> SELECT * FROM users; --";
  const result = parseWakeWord(injection);
  assert.strictEqual(result.hasWakeWord, true);
  assert.strictEqual(result.mentor, 'anish');
  assert.strictEqual(result.command, "<script>alert('xss')</script> SELECT * FROM users; --");
});

test('Chaos: Intent detector rejects long adversarial prompts containing intent fragments', () => {
  assert.strictEqual(isNextTaskIntent("what is next generation neural network architecture?"), false);
  assert.strictEqual(isNextTaskIntent("tell me what should I study when I graduate from college in 2028?"), false);
  assert.strictEqual(isNextTaskIntent(""), false);
  assert.strictEqual(isNextTaskIntent("      "), false);
});

// ============================================================================
// SUITE 2: Total Network Outage & Stale Progress Simulation
// ============================================================================
test('Chaos: Complete network blackout with stale device progress does not invent lessons', () => {
  const referenceNow = 1750000000000;
  const staleSnapshot: StudentProgressSnapshot = {
    userId: 'student_blackout',
    courseId: 'g3d',
    completedQuestIds: ['quest_1'],
    syncedAt: referenceNow - 48 * 60 * 60 * 1000, // 48 hours offline!
  };

  const curriculum: CurriculumItem[] = [
    { questId: 'quest_1', courseId: 'g3d', title: 'Basics' },
    { questId: 'quest_2', courseId: 'g3d', title: 'Shaders' },
  ];

  // Must explicitly state it cannot verify progress while offline, NEVER guess quest_2!
  const advisor = getAuthoritativeNextTask(staleSnapshot, 'student_blackout', curriculum, referenceNow);
  assert.strictEqual(advisor.status, 'STALE_SNAPSHOT');
  assert.match(advisor.speechText, /cannot verify your latest progress while offline/i);
});

test('Chaos: Clock-drift anomaly (+3 days in future) is caught as invalid timestamp', () => {
  const now = 1750000000000;
  assert.strictEqual(isValidSnapshotTimestamp(now + 3 * 24 * 60 * 60 * 1000, 24 * 60 * 60 * 1000, now), false);
});

// ============================================================================
// SUITE 3: Database Error & Corrupted Memory State
// ============================================================================
test('Chaos: Corrupted JSON memory payload does not crash prompt builder', () => {
  const base: BaseMentorContext = {
    studentName: 'TestUser',
    targetRole: 'Fullstack Engineer',
    questTitle: 'Core Web',
    missingSkills: [],
    atsScore: 70,
  };

  const corruptedPayload: TriStateMemoryResult = {
    status: 'SUCCESS',
    memory: {
      userId: 'test_user',
      persona: null as any, // corrupted null persona
      memories: [null, undefined, 12345, { invalid: true }] as any, // corrupted memory items
      conversationHistory: null as any,
      relationshipState: null as any,
    },
  };

  // Must build cleanly without throwing a TypeError
  const prompt = buildMentorSystemPrompt(base, corruptedPayload, 'v2_advisor');
  assert.match(prompt, /PERSONALIZED AVATAR MEMORY \(V2\)/);
  assert.match(prompt, /Engagement Index:/);
});

test('Chaos: Database outage state (ERROR) leaves core mentor instructions 100% operational', () => {
  const base: BaseMentorContext = {
    studentName: 'TestUser',
    targetRole: 'DevOps Engineer',
    questTitle: 'Kubernetes Pods',
    missingSkills: ['Helm'],
    atsScore: 82,
  };

  const dbOutage: TriStateMemoryResult = {
    status: 'ERROR',
    error: 'CONNECTION_REFUSED_ECONNREFUSED',
    memory: {
      userId: 'test_user',
      persona: {},
      memories: [],
      conversationHistory: [],
      relationshipState: {},
    },
  };

  const prompt = buildMentorSystemPrompt(base, dbOutage, 'v2_advisor');
  assert.match(prompt, /Active Learning Quest: "Kubernetes Pods"/);
  assert.match(prompt, /Critical Skill Gaps to close: Helm/);
  assert.match(prompt, /Persistent memory store temporarily offline/);
  // Invariant: Core instructions must remain intact
  assert.match(prompt, /Maintain a warm, encouraging, yet rigorous Socratic mentor tone/);
});

// ============================================================================
// SUITE 4: Feature Gate Resilience
// ============================================================================
test('Chaos: Malformed runtime overrides safely resolve to v1_legacy', () => {
  const r1 = resolveAvatarFeatureState({ clientFlagOverride: undefined, serverFlagOverride: undefined });
  assert.strictEqual(r1.mode, 'v1_legacy');

  const r2 = resolveAvatarFeatureState({ clientFlagOverride: 'TRUE', serverFlagOverride: 'FALSE' });
  assert.strictEqual(r2.mode, 'v1_legacy');

  const r3 = resolveAvatarFeatureState({ clientFlagOverride: 'garbage_string', serverFlagOverride: 'garbage_string' });
  assert.strictEqual(r3.mode, 'v1_legacy');
});
