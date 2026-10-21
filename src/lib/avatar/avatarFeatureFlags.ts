// src/lib/avatar/avatarFeatureFlags.ts
/**
 * Dual-Tier Feature Flag & Runtime Kill-Switch for PinIT Career OS Avatar Mentor V2.
 * 
 * Invariants:
 * 1. Default-Off: Without explicit configuration, mode strictly resolves to 'v1_legacy'.
 * 2. Server Kill-Switch: If server flag is false, V2 is disabled immediately even if the
 *    client-side bundle was compiled with NEXT_PUBLIC_AVATAR_V2_ENABLED=true.
 * 3. Strict Boolean Parsing: Truthy values like "1", "yes", or truthy objects are rejected.
 *    Only exact case-insensitive "true" is valid.
 */

export type AvatarMode = 'v1_legacy' | 'v2_advisor';

export interface FeatureGateConfig {
  clientEnabled: boolean;
  serverEnabled: boolean;
  mode: AvatarMode;
  reason: string;
}

export function parseBooleanFlag(val: unknown): boolean {
  if (typeof val !== 'string') return false;
  return val.trim().toLowerCase() === 'true';
}

export function isAvatarV2ClientEnabled(): boolean {
  return parseBooleanFlag(process.env.NEXT_PUBLIC_AVATAR_V2_ENABLED);
}

export function isAvatarV2ServerEnabled(): boolean {
  return parseBooleanFlag(process.env.AVATAR_V2_SERVER_ENABLED);
}

export function resolveAvatarFeatureState(opts?: {
  clientFlagOverride?: unknown;
  serverFlagOverride?: unknown;
}): FeatureGateConfig {
  const clientEnabled = opts?.clientFlagOverride !== undefined
    ? parseBooleanFlag(opts.clientFlagOverride)
    : isAvatarV2ClientEnabled();

  const serverEnabled = opts?.serverFlagOverride !== undefined
    ? parseBooleanFlag(opts.serverFlagOverride)
    : isAvatarV2ServerEnabled();

  // If client flag is off -> legacy
  if (!clientEnabled) {
    return {
      clientEnabled: false,
      serverEnabled,
      mode: 'v1_legacy',
      reason: 'Client feature flag NEXT_PUBLIC_AVATAR_V2_ENABLED is disabled.',
    };
  }

  // If client flag is on, but server kill-switch is triggered -> legacy
  if (!serverEnabled) {
    return {
      clientEnabled: true,
      serverEnabled: false,
      mode: 'v1_legacy',
      reason: 'Server runtime kill-switch is active (AVATAR_V2_SERVER_ENABLED is false).',
    };
  }

  // Both tiers explicitly enabled
  return {
    clientEnabled: true,
    serverEnabled: true,
    mode: 'v2_advisor',
    reason: 'Avatar V2 feature is fully enabled across client and server.',
  };
}
