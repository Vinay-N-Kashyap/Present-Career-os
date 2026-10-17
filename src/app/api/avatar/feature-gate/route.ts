export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { resolveAvatarFeatureState } from '@/lib/avatar/avatarFeatureFlags';

/**
 * GET /api/avatar/feature-gate
 * Returns the authoritative runtime status of Avatar V2.
 * Used by client avatar widgets to detect emergency server-side kill-switches
 * without requiring client bundle rebuilds or redeployments.
 */
export async function GET() {
  try {
    const config = resolveAvatarFeatureState();
    return NextResponse.json({
      ok: true,
      enabled: config.mode === 'v2_advisor',
      mode: config.mode,
      reason: config.reason,
      killSwitchActive: config.clientEnabled && !config.serverEnabled,
      version: '2.0.0-gated',
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      }
    });
  } catch (err) {
    // In any failure scenario, default safely to v1 legacy
    return NextResponse.json({
      ok: false,
      enabled: false,
      mode: 'v1_legacy',
      reason: 'Feature gate lookup failed; safely degraded to legacy v1.',
      killSwitchActive: true,
      version: '2.0.0-fallback',
    }, { status: 500 });
  }
}
