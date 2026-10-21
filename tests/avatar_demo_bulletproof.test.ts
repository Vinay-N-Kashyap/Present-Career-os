// tests/avatar_demo_bulletproof.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  isNextTaskIntent,
  getAuthoritativeNextTask,
  StudentProgressSnapshot,
  CurriculumItem,
} from '../src/lib/avatar/deterministicAdvisor';

const MOCK_CURRICULUM: CurriculumItem[] = [
  { questId: 'q1', courseId: 'fullstack-mastery', title: 'Core Foundations' },
  { questId: 'q2', courseId: 'fullstack-mastery', title: 'Async Systems' },
  { questId: 'q3', courseId: 'fullstack-mastery', title: 'Distributed Architecture' },
];

test('Bulletproof 1: Emoji & Unicode normalization shield matches quick prompt pills', () => {
  const emojiPills = [
    '🎯 What should I study next?',
    '📚 What should I study next?',
    '✨ What is my next task?',
    '🚀 Next quest!',
    '🔥 Tell me what to study next?',
  ];
  for (const pill of emojiPills) {
    assert.strictEqual(isNextTaskIntent(pill), true, `Expected emoji pill "${pill}" to match isNextTaskIntent`);
  }
});

test('Bulletproof 2: Natural spoken phrasing lexical expansion matches "what to study/do/learn next"', () => {
  const naturalSpoken = [
    'what to do next',
    'what to study next',
    'what to learn next',
    'tell me what to study next',
    'show me what to do next',
    'what should i study next?',
    'what is my next quest',
  ];
  for (const phrase of naturalSpoken) {
    assert.strictEqual(isNextTaskIntent(phrase), true, `Expected natural phrase "${phrase}" to match isNextTaskIntent`);
  }

  const nonTaskQueries = [
    'What is React?',
    'How do I reverse a linked list?',
    'What to cook for dinner',
    'Explain closures from first principles',
  ];
  for (const query of nonTaskQueries) {
    assert.strictEqual(isNextTaskIntent(query), false, `Expected technical query "${query}" NOT to match isNextTaskIntent`);
  }
});

test('Bulletproof 3: Fresh live snapshot timestamp never triggers false STALE_SNAPSHOT for older accounts', () => {
  const now = Date.now();
  const snapshot: StudentProgressSnapshot = {
    userId: 'user_live_demo_01',
    courseId: 'fullstack-mastery',
    completedQuestIds: ['q1'],
    syncedAt: now, // Freshly fetched from live DB
  };

  const result = getAuthoritativeNextTask(snapshot, 'user_live_demo_01', MOCK_CURRICULUM, now);
  assert.strictEqual(result.status, 'VERIFIED_TASK');
  assert.strictEqual(result.questId, 'q2');
  assert.match(result.speechText, /Async Systems/);
});

test('Bulletproof 4: Source code verification of 10-point invariants in AvatarMentorWidget & chat route', () => {
  const widgetPath = path.join(process.cwd(), 'src/components/avatar/AvatarMentorWidget.tsx');
  const routePath = path.join(process.cwd(), 'src/app/api/mentor/chat/route.ts');
  const envExamplePath = path.join(process.cwd(), '.env.example');

  const widgetCode = fs.readFileSync(widgetPath, 'utf-8');
  const routeCode = fs.readFileSync(routePath, 'utf-8');
  const envExample = fs.readFileSync(envExamplePath, 'utf-8');

  // 1. Acoustic echo cooldown present
  assert.ok(widgetCode.includes('speechCooldown'), 'Expected 400ms speechCooldown state in AvatarMentorWidget');

  // 2. Auto-close timer guarded by isConversing
  assert.ok(
    widgetCode.includes('if (loading || speaking || isConversing) return;'),
    'Expected auto-close timer to be suppressed during active voice conversation'
  );

  // 3. Browser speech support check & toast on mic button
  assert.ok(
    widgetCode.includes('Live speech recognition is optimized for Chrome & Edge'),
    'Expected non-Chrome browser friendly toast notice'
  );

  // 4. Priority heuristic guarded with !isNextTaskIntent
  assert.ok(
    widgetCode.includes('!isNextTaskIntent(effectiveMsg)'),
    'Expected legacy priority heuristic to be guarded by !isNextTaskIntent'
  );

  // 5. Primary quick prompt pill at index 0
  const quickPromptsIdx = widgetCode.indexOf('const quickPrompts = [');
  assert.ok(quickPromptsIdx !== -1, 'Expected quickPrompts declaration');
  const sliceAfterQuickPrompts = widgetCode.slice(quickPromptsIdx, quickPromptsIdx + 180);
  assert.ok(
    sliceAfterQuickPrompts.includes("'🎯 What should I study next?'"),
    'Expected primary next-task pill at top of quickPrompts'
  );

  // 6. Client sessionStorage micro-cache present
  assert.ok(widgetCode.includes('sessionStorage.getItem(sessionCacheKey)'), 'Expected client sessionStorage micro-cache');

  // 7. Offline fallback bridges to completed_quests
  assert.ok(
    widgetCode.includes('_completed_quests'),
    'Expected offline fallback bridge to localStorage completed_quests'
  );

  // 8. Chat route uses Date.now() for live DB snapshot
  assert.ok(routeCode.includes('syncedAt: Date.now()'), 'Expected syncedAt: Date.now() in live mentor chat route');

  // 9. .env.example documents Avatar V2 flags
  assert.ok(envExample.includes('NEXT_PUBLIC_AVATAR_V2_ENABLED=true'), 'Expected NEXT_PUBLIC_AVATAR_V2_ENABLED in .env.example');
  assert.ok(envExample.includes('AVATAR_V2_SERVER_ENABLED=true'), 'Expected AVATAR_V2_SERVER_ENABLED in .env.example');
});
