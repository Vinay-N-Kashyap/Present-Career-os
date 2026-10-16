// tests/avatar_feature_flag.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseBooleanFlag,
  resolveAvatarFeatureState,
} from '../src/lib/avatar/avatarFeatureFlags';

// ============================================================================
// SUITE 1: Strict Boolean Flag Parsing Invariants
// ============================================================================
test('FeatureFlag: Parses valid true strings case-insensitively with whitespace', () => {
  assert.strictEqual(parseBooleanFlag('true'), true);
  assert.strictEqual(parseBooleanFlag('True'), true);
  assert.strictEqual(parseBooleanFlag('TRUE'), true);
  assert.strictEqual(parseBooleanFlag('  true  '), true);
});

test('FeatureFlag: Rejects false and truthy non-boolean values strictly', () => {
  assert.strictEqual(parseBooleanFlag('false'), false);
  assert.strictEqual(parseBooleanFlag('False'), false);
  assert.strictEqual(parseBooleanFlag('1'), false);
  assert.strictEqual(parseBooleanFlag('yes'), false);
  assert.strictEqual(parseBooleanFlag('on'), false);
  assert.strictEqual(parseBooleanFlag(''), false);
  assert.strictEqual(parseBooleanFlag(null), false);
  assert.strictEqual(parseBooleanFlag(undefined), false);
  assert.strictEqual(parseBooleanFlag(123), false);
  assert.strictEqual(parseBooleanFlag({}), false);
});

// ============================================================================
// SUITE 2: Dual-Tier State Resolution & Server Kill-Switch
// ============================================================================
test('FeatureFlag: Defaults to v1_legacy when no flags are configured', () => {
  // Clear process env overrides to test pure default
  const originalClient = process.env.NEXT_PUBLIC_AVATAR_V2_ENABLED;
  const originalServer = process.env.AVATAR_V2_SERVER_ENABLED;
  delete process.env.NEXT_PUBLIC_AVATAR_V2_ENABLED;
  delete process.env.AVATAR_V2_SERVER_ENABLED;

  try {
    const config = resolveAvatarFeatureState();
    assert.strictEqual(config.mode, 'v1_legacy');
    assert.strictEqual(config.clientEnabled, false);
    assert.strictEqual(config.serverEnabled, false);
  } finally {
    if (originalClient !== undefined) process.env.NEXT_PUBLIC_AVATAR_V2_ENABLED = originalClient;
    if (originalServer !== undefined) process.env.AVATAR_V2_SERVER_ENABLED = originalServer;
  }
});

test('FeatureFlag: Remains in v1_legacy if client flag is disabled, even if server flag is true', () => {
  const config = resolveAvatarFeatureState({
    clientFlagOverride: 'false',
    serverFlagOverride: 'true',
  });
  assert.strictEqual(config.mode, 'v1_legacy');
  assert.strictEqual(config.clientEnabled, false);
  assert.match(config.reason, /client feature flag/i);
});

test('FeatureFlag: Server kill-switch forces v1_legacy even if client flag is true', () => {
  // P0 Invariant: Emergency shutdown in production without rebuilding frontend bundle
  const config = resolveAvatarFeatureState({
    clientFlagOverride: 'true',
    serverFlagOverride: 'false',
  });
  assert.strictEqual(config.mode, 'v1_legacy');
  assert.strictEqual(config.clientEnabled, true);
  assert.strictEqual(config.serverEnabled, false);
  assert.match(config.reason, /server runtime kill-switch is active/i);
});

test('FeatureFlag: Enables v2_advisor ONLY when both client and server agree', () => {
  const config = resolveAvatarFeatureState({
    clientFlagOverride: 'true',
    serverFlagOverride: 'true',
  });
  assert.strictEqual(config.mode, 'v2_advisor');
  assert.strictEqual(config.clientEnabled, true);
  assert.strictEqual(config.serverEnabled, true);
  assert.match(config.reason, /fully enabled across client and server/i);
});
