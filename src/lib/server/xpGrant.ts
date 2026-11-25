import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side XP grants. XP lives in users.xp_total and every grant is a row in xp_ledger, written
 * only by the increment_xp function (service role). Routes that verified an activity themselves
 * (interview evaluation, project audit, …) grant its XP here; the browser never decides the amount.
 */

/** increment_xp accepts at most this much per call. */
export const MAX_XP_PER_CALL = 500;

export type XpGrant =
  | { ok: true; newXp: number; newWeeklyXp?: number; newLevel: number; amount: number }
  | { ok: false; error: string; message: string };

interface IncrementResult {
  ok?: boolean;
  new_xp?: number;
  new_weekly_xp?: number;
  new_level?: number;
  reason?: string;
  message?: string;
}

export async function grantXp(admin: SupabaseClient, userId: string, amount: number, reason: string): Promise<XpGrant> {
  if (!Number.isInteger(amount) || amount <= 0) return { ok: false, error: 'INVALID_XP_AMOUNT', message: 'Nothing to grant.' };
  let left = amount;
  let last: { newXp: number; newWeeklyXp?: number; newLevel: number } | null = null;
  let rpcUpdatedWeekly = false;
  let rpcFailed = false;

  while (left > 0) {
    const chunk = Math.min(left, MAX_XP_PER_CALL);
    const { data, error } = await admin.rpc('increment_xp', { p_user_id: userId, p_amount: chunk, p_reason: reason });
    const res = (data || {}) as IncrementResult;
    if (error || !res.ok) {
      // If first chunk failed due to missing/older RPC, fall back to direct service-role update below
      if (!last) {
        rpcFailed = true;
        break;
      }
      return { ok: false, error: res.reason || 'XP_INCREMENT_FAILED', message: error?.message || res.message || 'XP could not be saved.' };
    }
    const weeklyFromRpc = typeof res.new_weekly_xp === 'number' && Number.isFinite(res.new_weekly_xp)
      ? Number(res.new_weekly_xp)
      : undefined;
    if (weeklyFromRpc !== undefined) {
      rpcUpdatedWeekly = true;
    }
    last = {
      newXp: Number(res.new_xp) || 0,
      newWeeklyXp: weeklyFromRpc,
      newLevel: Number(res.new_level) || 1,
    };
    left -= chunk;
  }

  // Fallback path if increment_xp RPC is unavailable on the target DB
  if (rpcFailed) {
    const { data: userRow, error: readErr } = await admin
      .from('users')
      .select('xp_total, weekly_xp')
      .eq('id', userId)
      .maybeSingle();
    if (readErr || !userRow) {
      return { ok: false, error: 'XP_INCREMENT_FAILED', message: readErr?.message || 'User record not found.' };
    }
    const nextXp = Math.max(0, Number(userRow.xp_total) || 0) + amount;
    const nextWeeklyXp = Math.max(0, Number(userRow.weekly_xp) || 0) + amount;
    const nextLevel = Math.max(1, Math.floor(Math.sqrt(nextXp / 100)) + 1);
    const { error: updErr } = await admin
      .from('users')
      .update({ xp_total: nextXp, xp_level: nextLevel, weekly_xp: nextWeeklyXp })
      .eq('id', userId);
    if (updErr) {
      return { ok: false, error: 'XP_UPDATE_FAILED', message: updErr.message };
    }
    try {
      await admin.from('xp_ledger').insert({ user_id: userId, amount, reason });
    } catch {}
    return { ok: true, amount, newXp: nextXp, newWeeklyXp: nextWeeklyXp, newLevel: nextLevel };
  }

  // Critical fix: older Supabase `increment_xp` RPCs (20260913) ONLY update `xp_total` and NOT `weekly_xp`!
  // If the RPC did not return `new_weekly_xp`, explicitly increment `users.weekly_xp` so Vault & Leaderboard stay in sync.
  let finalWeeklyXp = last?.newWeeklyXp;
  if (!rpcUpdatedWeekly) {
    try {
      const { data: uRow } = await admin
        .from('users')
        .select('weekly_xp')
        .eq('id', userId)
        .maybeSingle();
      const nextWeekly = Math.max(0, Number(uRow?.weekly_xp) || 0) + amount;
      const { error: wkErr } = await admin
        .from('users')
        .update({ weekly_xp: nextWeekly })
        .eq('id', userId);
      if (!wkErr) {
        finalWeeklyXp = nextWeekly;
      }
    } catch {}
  }

  return { ok: true, amount, newXp: last!.newXp, newWeeklyXp: finalWeeklyXp, newLevel: last!.newLevel };
}

function startOfUtcDay(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

/** Today's (UTC) XP for the user, optionally only grants whose reason starts with `reasonPrefix`. Null if the ledger can't be read. */
export async function todaysXp(admin: SupabaseClient, userId: string, reasonPrefix?: string): Promise<{ total: number; count: number } | null> {
  const { data, error } = await admin
    .from('xp_ledger')
    .select('amount, reason')
    .eq('user_id', userId)
    .gte('created_at', startOfUtcDay());
  if (error || !Array.isArray(data)) return null;
  const rows = (data as Array<{ amount: number | string; reason: string | null }>)
    .filter((r) => !reasonPrefix || (r.reason || '').startsWith(reasonPrefix));
  return { total: rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0), count: rows.length };
}

/** Whether a grant with exactly this reason was ever made (one-time rewards). Null if the ledger can't be read. */
export async function xpAlreadyGranted(admin: SupabaseClient, userId: string, reason: string): Promise<boolean | null> {
  const { data, error } = await admin
    .from('xp_ledger')
    .select('amount')
    .eq('user_id', userId)
    .eq('reason', reason)
    .limit(1);
  if (error || !Array.isArray(data)) return null;
  return data.length > 0;
}
