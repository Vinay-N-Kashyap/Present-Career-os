import type { SupabaseClient } from '@supabase/supabase-js';
import {
  DAILY_PIN_CAP,
  getLatest1AmIst,
  hasActivePurchasedPlan,
} from '@/lib/pins/pinWalletRules';

export function isPurchasedPlanId(planId: unknown): boolean {
  if (typeof planId !== 'string') return false;
  const norm = planId.trim().toLowerCase();
  if (!norm) return false;
  return (
    norm === 'pro' ||
    norm === 'basic' ||
    norm === 'basic_student' ||
    norm === 'student_99' ||
    norm.startsWith('plan-') ||
    norm.startsWith('course_plan')
  );
}

export interface LazyDailyPinResetResult {
  pins: number;
  bonusPins: number;
  resetApplied: boolean;
  eligibleForDailyReset: boolean;
  lastPinReset: string | null;
}

/**
 * Checks if the user passed the most recent 1:00 AM IST boundary without receiving a daily reset.
 * If eligible (active purchased subscription or course plan) and stale, atomically sets `pins = 120`
 * and updates `last_pin_reset`. Never touches `bonus_pins`. Non-plan users keep their current `pins`.
 */
export async function ensureUserDailyPinReset(
  admin: SupabaseClient | null,
  userId: string,
  now: Date = new Date()
): Promise<LazyDailyPinResetResult | null> {
  if (!admin || !userId) return null;

  try {
    const { data: userRow, error } = await admin
      .from('users')
      .select('pins, bonus_pins, last_pin_reset, subscription_tier, subscription_status, subscription_expires_at')
      .eq('id', userId)
      .maybeSingle();

    if (error || !userRow) {
      return null;
    }

    const currentPins = typeof userRow.pins === 'number' && Number.isFinite(userRow.pins) ? userRow.pins : 0;
    const bonusPins = typeof userRow.bonus_pins === 'number' && Number.isFinite(userRow.bonus_pins) ? userRow.bonus_pins : 0;
    const lastResetRaw = typeof userRow.last_pin_reset === 'string' ? userRow.last_pin_reset : null;
    const latestBoundary = getLatest1AmIst(now);

    // Auto-expire elapsed active subscriptions lazily as well
    let subStatus = userRow.subscription_status as string | null | undefined;
    if (
      String(subStatus || '').toLowerCase() === 'active' &&
      userRow.subscription_expires_at &&
      Date.parse(String(userRow.subscription_expires_at)) <= now.getTime()
    ) {
      subStatus = 'expired';
      try {
        await admin
          .from('users')
          .update({ subscription_status: 'expired' })
          .eq('id', userId)
          .eq('subscription_status', 'active');
      } catch {}
    }

    // Check purchased-plan eligibility across subscription + active course enrollments + paid plan history
    let eligible = hasActivePurchasedPlan(
      {
        subscription_status: subStatus,
        subscription_tier: userRow.subscription_tier,
        subscription_expires_at: userRow.subscription_expires_at,
      },
      now
    );

    if (!eligible) {
      try {
        const { data: enrollments } = await admin
          .from('user_crash_enrollments')
          .select('id, status')
          .eq('user_id', userId)
          .eq('status', 'active')
          .limit(1);
        if (Array.isArray(enrollments) && enrollments.length > 0) {
          eligible = true;
        }
      } catch {}
    }

    if (!eligible) {
      try {
        const { data: payments } = await admin
          .from('processed_payments')
          .select('plan_id')
          .eq('user_id', userId)
          .limit(20);
        if (Array.isArray(payments) && payments.some((p: { plan_id?: string }) => isPurchasedPlanId(p.plan_id))) {
          eligible = true;
        }
      } catch {}
    }

    const lastResetMs = lastResetRaw ? Date.parse(lastResetRaw) : Number.NaN;
    const needsReset = !Number.isFinite(lastResetMs) || lastResetMs < latestBoundary.getTime();

    if (!eligible || !needsReset) {
      return {
        pins: currentPins,
        bonusPins,
        resetApplied: false,
        eligibleForDailyReset: eligible,
        lastPinReset: lastResetRaw,
      };
    }

    const nowIso = now.toISOString();
    const boundaryIso = latestBoundary.toISOString();

    const { data: updatedRow, error: updError } = await admin
      .from('users')
      .update({ pins: DAILY_PIN_CAP, last_pin_reset: nowIso })
      .eq('id', userId)
      .or(`last_pin_reset.is.null,last_pin_reset.lt.${boundaryIso}`)
      .select('pins, bonus_pins, last_pin_reset')
      .maybeSingle();

    if (!updError && updatedRow) {
      return {
        pins: typeof updatedRow.pins === 'number' ? updatedRow.pins : DAILY_PIN_CAP,
        bonusPins: typeof updatedRow.bonus_pins === 'number' ? updatedRow.bonus_pins : bonusPins,
        resetApplied: true,
        eligibleForDailyReset: true,
        lastPinReset: typeof updatedRow.last_pin_reset === 'string' ? updatedRow.last_pin_reset : nowIso,
      };
    }

    return {
      pins: currentPins,
      bonusPins,
      resetApplied: false,
      eligibleForDailyReset: eligible,
      lastPinReset: lastResetRaw,
    };
  } catch {
    return null;
  }
}
