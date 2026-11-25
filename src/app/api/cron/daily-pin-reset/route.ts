import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { DAILY_PIN_CAP, hasActivePurchasedPlan } from '@/lib/pins/pinWalletRules';
import { isPurchasedPlanId } from '@/lib/pins/dailyPinReset';

function getAdminClient() {
  return getSupabaseAdmin();
}

export async function GET(req: Request) {
  return handleReset(req);
}

export async function POST(req: Request) {
  return handleReset(req);
}

async function handleReset(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Fail-closed authorization: strictly require valid CRON_SECRET
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Cron secret required' }, { status: 401 });
    }

    const client = getAdminClient();
    const nowDate = new Date();
    const now = nowDate.toISOString();

    // 0. Auto-expire subscriptions that have passed their expiration date
    const { data: expiredSubs } = await client
      .from('users')
      .update({ subscription_status: 'expired' })
      .eq('subscription_status', 'active')
      .not('subscription_expires_at', 'is', null)
      .lt('subscription_expires_at', now)
      .select('id');

    // 1. Gather all user IDs that purchased an active plan (subscription or course plan).
    // Free/non-plan users retain their current `pins` unchanged; Bonus Vault is never touched.
    const eligibleIds = new Set<string>();

    try {
      const { data: activeSubUsers } = await client
        .from('users')
        .select('id, subscription_status, subscription_tier, subscription_expires_at')
        .eq('subscription_status', 'active');
      if (Array.isArray(activeSubUsers)) {
        for (const row of activeSubUsers) {
          if (row?.id && hasActivePurchasedPlan(row, nowDate)) {
            eligibleIds.add(String(row.id));
          }
        }
      }
    } catch {}

    try {
      const { data: enrollments } = await client
        .from('user_crash_enrollments')
        .select('user_id')
        .eq('status', 'active');
      if (Array.isArray(enrollments)) {
        for (const row of enrollments) {
          if (row?.user_id) eligibleIds.add(String(row.user_id));
        }
      }
    } catch {}

    try {
      const { data: paidPlans } = await client
        .from('processed_payments')
        .select('user_id, plan_id');
      if (Array.isArray(paidPlans)) {
        for (const row of paidPlans) {
          if (row?.user_id && isPurchasedPlanId(row.plan_id)) {
            eligibleIds.add(String(row.user_id));
          }
        }
      }
    } catch {}

    const targetIds = Array.from(eligibleIds);
    let resetCount = 0;

    for (let i = 0; i < targetIds.length; i += 200) {
      const batch = targetIds.slice(i, i + 200);
      const { data: resetUsers, error: resetError } = await client
        .from('users')
        .update({ pins: DAILY_PIN_CAP, last_pin_reset: now })
        .in('id', batch)
        .select('id');

      if (resetError) {
        console.error('[DailyPinReset] Failed to reset daily user pins:', resetError);
        return NextResponse.json({ ok: false, error: resetError.message }, { status: 500 });
      }
      resetCount += Array.isArray(resetUsers) ? resetUsers.length : 0;
    }

    return NextResponse.json({
      ok: true,
      source: 'table_update',
      dailyCap: DAILY_PIN_CAP,
      expiredSubsCount: Array.isArray(expiredSubs) ? expiredSubs.length : 0,
      eligibleUsersCount: targetIds.length,
      resetUsersCount: resetCount,
      subRenewedCount: resetCount,
      freeExpiredCount: 0,
      timestamp: now,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'Daily pin reset failed' }, { status: 500 });
  }
}
