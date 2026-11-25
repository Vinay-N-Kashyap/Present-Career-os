/**
 * Self-healing weekly League Points reconciliation.
 *
 * Ensures `users.weekly_xp` and `users.weekly_arena_points` never drift behind
 * canonical evidence in `xp_ledger`, settled `arena_solo_matches`, completed PvP
 * `arena_rooms`, or pre-reset account totals (`last_league_eval IS NULL`).
 */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function getCurrentSprintStartMonday1AmIst(now: Date = new Date()): Date {
  const istWall = new Date(now.getTime() + IST_OFFSET_MS);
  const day = istWall.getUTCDay(); // 0=Sun, 1=Mon...
  let diffToMonday = (day + 6) % 7;
  if (diffToMonday === 0 && istWall.getUTCHours() < 1) {
    diffToMonday = 7;
  }
  const sprintMondayWall = new Date(istWall.getTime());
  sprintMondayWall.setUTCDate(istWall.getUTCDate() - diffToMonday);
  sprintMondayWall.setUTCHours(1, 0, 0, 0);
  return new Date(sprintMondayWall.getTime() - IST_OFFSET_MS);
}

export interface ReconcileWeeklyLeagueResult {
  weeklyXp: number;
  arenaPoints: number;
  leaguePoints: number;
  healed: boolean;
}

export async function reconcileUserWeeklyLeaguePoints(
  admin: any,
  opts: {
    userId: string;
    storedWeeklyXp: number;
    storedArenaPoints: number;
    storedTotalXp?: number;
    lastLeagueEval?: string | null;
    hasLastLeagueEvalField?: boolean;
    arenaWins?: number;
    now?: Date;
  }
): Promise<ReconcileWeeklyLeagueResult> {
  const safeStoredWeeklyXp = Math.max(0, Math.round(Number(opts.storedWeeklyXp) || 0));
  const safeStoredArenaPoints = Math.max(0, Math.round(Number(opts.storedArenaPoints) || 0));
  const neverEvaluatedReset = Boolean(
    opts.hasLastLeagueEvalField &&
    (opts.lastLeagueEval === null || opts.lastLeagueEval === undefined || opts.lastLeagueEval === '')
  );
  const safeStoredTotalXp = opts.storedTotalXp !== undefined && opts.storedTotalXp !== null
    ? Math.max(0, Math.round(Number(opts.storedTotalXp) || 0))
    : 0;
  const neverResetXpFloor = neverEvaluatedReset ? safeStoredTotalXp : 0;

  if (!admin || !opts.userId || typeof admin.from !== 'function') {
    const weeklyXp = Math.max(safeStoredWeeklyXp, neverResetXpFloor);
    return {
      weeklyXp,
      arenaPoints: safeStoredArenaPoints,
      leaguePoints: weeklyXp + safeStoredArenaPoints,
      healed: weeklyXp > safeStoredWeeklyXp,
    };
  }

  const sprintStartIso = getCurrentSprintStartMonday1AmIst(opts.now).toISOString();
  let ledgerWeeklyXpSum = 0;
  let soloArenaPointsSum = 0;
  let pvpArenaPointsSum = 0;

  try {
    const ledgerRes = await admin
      .from('xp_ledger')
      .select('amount')
      .eq('user_id', opts.userId)
      .gte('created_at', sprintStartIso);
    if (Array.isArray(ledgerRes?.data)) {
      for (const row of ledgerRes.data) {
        const amt = Number(row?.amount);
        if (Number.isFinite(amt) && amt > 0) {
          ledgerWeeklyXpSum += Math.round(amt);
        }
      }
    }
  } catch {
    // Graceful no-op when mock/offline DB does not expose xp_ledger
  }

  try {
    const soloRes = await admin
      .from('arena_solo_matches')
      .select('settlement')
      .eq('user_id', opts.userId)
      .eq('status', 'settled')
      .gte('settled_at', sprintStartIso);
    if (Array.isArray(soloRes?.data)) {
      for (const row of soloRes.data) {
        const pts = Number(row?.settlement?.arenaPointsAwarded ?? 0);
        if (Number.isFinite(pts) && pts > 0) {
          soloArenaPointsSum += Math.round(pts);
        }
      }
    }
  } catch {
    // Graceful no-op when mock/offline DB does not expose arena_solo_matches
  }

  try {
    const pvpRes = await admin
      .from('arena_rooms')
      .select('host_id, guest_id, host_arena_points_award, guest_arena_points_award')
      .eq('status', 'completed')
      .eq('elo_applied', true)
      .gte('updated_at', sprintStartIso)
      .or(`host_id.eq.${opts.userId},guest_id.eq.${opts.userId}`);
    if (Array.isArray(pvpRes?.data)) {
      for (const row of pvpRes.data) {
        const award = row?.host_id === opts.userId
          ? Number(row?.host_arena_points_award ?? 0)
          : row?.guest_id === opts.userId
            ? Number(row?.guest_arena_points_award ?? 0)
            : 0;
        if (Number.isFinite(award) && award > 0) {
          pvpArenaPointsSum += Math.round(award);
        }
      }
    }
  } catch {
    // Graceful no-op when mock/offline DB does not expose arena_rooms awards
  }

  const totalMeasuredArena = soloArenaPointsSum + pvpArenaPointsSum;
  // Conservative recovery floor if account has verified pre-reset arena wins with 0 stored/table arena points
  const safeWins = Math.max(0, Math.round(Number(opts.arenaWins) || 0));
  const neverResetArenaFloor = totalMeasuredArena === 0 && safeStoredArenaPoints === 0 && neverEvaluatedReset && safeWins > 0
    ? Math.min(250, safeWins * 40)
    : 0;

  const nextWeeklyXp = Math.max(safeStoredWeeklyXp, ledgerWeeklyXpSum, neverResetXpFloor);
  const nextArenaPoints = Math.max(safeStoredArenaPoints, totalMeasuredArena, neverResetArenaFloor);
  const xpDrifted = nextWeeklyXp > safeStoredWeeklyXp;
  const arenaDrifted = nextArenaPoints > safeStoredArenaPoints;
  const healed = xpDrifted || arenaDrifted;

  if (healed) {
    try {
      const updatePayload: Record<string, any> = {
        updated_at: (opts.now || new Date()).toISOString(),
      };
      if (xpDrifted) updatePayload.weekly_xp = nextWeeklyXp;
      if (arenaDrifted) updatePayload.weekly_arena_points = nextArenaPoints;
      const updRes = await admin.from('users').update(updatePayload).eq('id', opts.userId);
      // Fallback if weekly_arena_points column isn't migrated yet on remote DB
      if (updRes?.error && xpDrifted) {
        await admin
          .from('users')
          .update({ weekly_xp: nextWeeklyXp, updated_at: (opts.now || new Date()).toISOString() })
          .eq('id', opts.userId);
      }
    } catch {
      // Non-fatal: still return reconciled totals to caller
    }
  }

  return {
    weeklyXp: nextWeeklyXp,
    arenaPoints: nextArenaPoints,
    leaguePoints: nextWeeklyXp + nextArenaPoints,
    healed,
  };
}

export function computeSprintWindowFromNow(now: Date = new Date()): { start: Date; nextReset: Date } {
  const start = getCurrentSprintStartMonday1AmIst(now);
  return { start, nextReset: new Date(start.getTime() + ONE_WEEK_MS) };
}
