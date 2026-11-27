import type { SupabaseClient } from '@supabase/supabase-js';
import { grantXp } from '@/lib/server/xpGrant';
import {
  MAX_DAILY_PRIORITY_AWARDS,
  PRIORITY_XP_MAX,
  PRIORITY_XP_MIN,
  buildPriorityXpReason,
  getIstDateKey,
} from './dashboardMetrics';

export interface AwardPriorityXpResult {
  awarded: boolean;
  alreadyClaimed: boolean;
  capReached?: boolean;
  xpAdded: number;
  dayKey: string;
  newXp?: number;
  newWeeklyXp?: number;
}

/**
 * Idempotently grants 10-15 Weekly EXP when a daily dashboard priority is completed.
 * Deduped per (userId, IST dayKey, priorityId) in `xp_ledger` and capped at 3 priority awards/day.
 */
export async function awardDailyPriorityXp(
  admin: SupabaseClient | any,
  userId: string,
  priorityId: string,
  title: string,
  xpAmount: number,
  dayKey: string = getIstDateKey()
): Promise<AwardPriorityXpResult> {
  if (!admin || !userId || !priorityId) {
    return { awarded: false, alreadyClaimed: false, xpAdded: 0, dayKey };
  }

  const safeXp = Math.min(PRIORITY_XP_MAX, Math.max(PRIORITY_XP_MIN, Math.round(Number(xpAmount) || PRIORITY_XP_MIN)));
  const dayPrefix = `[priority:${dayKey}:`;
  const reasonKey = buildPriorityXpReason(dayKey, priorityId);

  try {
    const query = admin
      .from('xp_ledger')
      .select('reason')
      .eq('user_id', userId);
    const { data: rows, error } = typeof query.like === 'function'
      ? await query.like('reason', `${dayPrefix}%`)
      : await query;

    if (error) {
      return { awarded: false, alreadyClaimed: false, xpAdded: 0, dayKey };
    }

    const todayPriorityRows = Array.isArray(rows)
      ? rows.filter((r: any) => typeof r?.reason === 'string' && r.reason.startsWith(dayPrefix))
      : [];

    if (todayPriorityRows.some((r: any) => String(r.reason).startsWith(reasonKey))) {
      return { awarded: false, alreadyClaimed: true, xpAdded: 0, dayKey };
    }

    if (todayPriorityRows.length >= MAX_DAILY_PRIORITY_AWARDS) {
      return { awarded: false, alreadyClaimed: false, capReached: true, xpAdded: 0, dayKey };
    }
  } catch {
    return { awarded: false, alreadyClaimed: false, xpAdded: 0, dayKey };
  }

  const cleanTitle = String(title || priorityId).trim().slice(0, 80);
  const grant = await grantXp(admin, userId, safeXp, `${reasonKey} ${cleanTitle}`);
  if (!grant.ok) {
    return { awarded: false, alreadyClaimed: false, xpAdded: 0, dayKey };
  }

  return {
    awarded: true,
    alreadyClaimed: false,
    xpAdded: safeXp,
    dayKey,
    newXp: grant.newXp,
    newWeeklyXp: grant.newWeeklyXp,
  };
}
