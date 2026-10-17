// tests/avatar_perf_optimization.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { mentorResponseCache } from '../src/lib/avatar/responseCache';
import { LIGHT_QUERY_REGEX } from '../src/app/api/mentor/chat/route';
import { checkRateLimit, resetRateLimitStore } from '../src/lib/server/rateLimit';
import { invalidateAvatarMemoryCache } from '../src/lib/avatar/memoryStore';

test('Perf Optimization: LRU Cache stores and retrieves matching responses', () => {
  mentorResponseCache.clear();
  const key = mentorResponseCache.generateKey('How to build ATS resume?', 'priya', 'Software Engineer', 'Core Foundations');
  
  assert.equal(mentorResponseCache.get(key), null);
  
  mentorResponseCache.set(key, 'Focus on measurable impact and systems keywords.');
  assert.equal(mentorResponseCache.get(key), 'Focus on measurable impact and systems keywords.');
});

test('Perf Optimization: LRU Cache expires entries after TTL', () => {
  mentorResponseCache.clear();
  const key = mentorResponseCache.generateKey('hello', 'priya', 'Software Engineer', 'Core Foundations');
  const now = 1_000_000;
  
  mentorResponseCache.set(key, 'Hello there!', now);
  // Within 5 minutes (300,000ms)
  assert.equal(mentorResponseCache.get(key, now + 299_000), 'Hello there!');
  // Expired at 5m + 1ms
  assert.equal(mentorResponseCache.get(key, now + 300_001), null);
});

test('Perf Optimization: LRU Cache strictly bypasses slide and code snippet inquiries', () => {
  assert.equal(mentorResponseCache.shouldBypass({ hasSlideContext: true }), true);
  assert.equal(mentorResponseCache.shouldBypass({ hasCodeSnippet: true }), true);
  assert.equal(mentorResponseCache.shouldBypass({ historyLength: 5 }), true);
  // Clean short query does NOT bypass
  assert.equal(mentorResponseCache.shouldBypass({ hasSlideContext: false, hasCodeSnippet: false, historyLength: 1 }), false);
});

test('Perf Optimization: Light query regex identifies phatic greetings and acknowledgments', () => {
  const lightQueries = ['hi', 'Hi!', 'hello', 'hey', 'thanks', 'Thank you', 'ok', 'okay.', 'got it', 'sure!', 'nice'];
  for (const q of lightQueries) {
    assert.equal(LIGHT_QUERY_REGEX.test(q), true, `Expected "${q}" to match LIGHT_QUERY_REGEX`);
  }

  const complexQueries = [
    'How do I implement binary search in TypeScript?',
    'Explain the slide code snippet about closures',
    'What is the difference between TCP and UDP?',
    'Review my system design architecture for high scale'
  ];
  for (const q of complexQueries) {
    assert.equal(LIGHT_QUERY_REGEX.test(q), false, `Expected "${q}" NOT to match LIGHT_QUERY_REGEX`);
  }
});

test('Perf Optimization: Dual-key rate limiting protects per-user and per-IP independently', () => {
  resetRateLimitStore();

  const userA = 'user_student_123';
  const ip = '192.168.1.50';

  // Student 1 executes 25 requests (limit is 25)
  for (let i = 0; i < 25; i++) {
    const res = checkRateLimit(`llm_user_${userA}`, { limit: 25, windowMs: 60_000 });
    assert.equal(res.allowed, true);
  }

  // 26th request for Student 1 is rate limited
  const blockedUser = checkRateLimit(`llm_user_${userA}`, { limit: 25, windowMs: 60_000 });
  assert.equal(blockedUser.allowed, false);

  // Student 2 on the SAME IP address is still allowed because IP limit is 120
  const userB = 'user_student_456';
  const allowedUserB = checkRateLimit(`llm_user_${userB}`, { limit: 25, windowMs: 60_000 });
  assert.equal(allowedUserB.allowed, true);

  const ipCheck = checkRateLimit(`llm_ip_${ip}`, { limit: 120, windowMs: 60_000 });
  assert.equal(ipCheck.allowed, true);
});

test('Perf Optimization: Memory store cache invalidation functions cleanly', () => {
  assert.doesNotThrow(() => {
    invalidateAvatarMemoryCache('test_user_123');
    invalidateAvatarMemoryCache();
  });
});
