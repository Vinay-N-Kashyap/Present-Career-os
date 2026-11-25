/**
 * Self-healing weekly League Points reconciliation.
 *
 * Historically, older RPCs (`increment_xp`) wrote `xp_ledger` and `users.xp_total`
 * without incrementing `users.weekly_xp`, and some solo Arena settlements failed
 * to persist `users.weekly_arena_points`. This helper compares `users.weekly_xp`
 * and `users.weekly_arena_points` against the canonical current-sprint ledger rows
 * (`xp_ledger` and settled `arena_solo_matches` since Monday 01:00 AM IST) and heals
 * any drift on the server before rankings are returned.
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
    now?: Date;
  }
): Promise<ReconcileWeeklyLeagueResult> {
  const safeStoredWeeklyXp = Math.max(0, Math.round(Number(opts.storedWeeklyXp) || 0));
  const safeStoredArenaPoints = Math.max(0, Math.round(Number(opts.storedArenaPoints) || 0));

  if (!admin || !opts.userId || typeof admin.from !== 'function') {
    return {
      weeklyXp: safeStoredWeeklyXp,
      arenaPoints: safeStoredArenaPoints,
      leaguePoints: safeStoredWeeklyXp + safeStoredArenaPoints,
      healed: false,
    };
  }

  const sprintStartIso = getCurrentSprintStartMonday1AmIst(opts.now).toISOString();
  let ledgerWeeklyXpSum = 0;
  let soloArenaPointsSum = 0;

  try {
    const ledgerQuery = admin
      .from('xp_ledger')
      .select('amount')
      .eq('user_id', opts.userId)
      .gte('created_at', sprintStartIso);

    const ledgerRes = await ledgerQuery;
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
    const arenaQuery = admin
      .from('arena_solo_matches')
      .select('settlement')
      .eq('user_id', opts.userId)
      .eq('status', 'settled')
      .gte('settled_at', sprintStartIso);

    const arenaRes = await arenaQuery;
    if (Array.isArray(arenaRes?.data)) {
      for (const row of arenaRes.data) {
        const pts = Number(row?.settlement?.arenaPointsAwarded ?? 0);
        if (Number.isFinite(pts) && pts > 0) {
          soloArenaPointsSum += Math.round(pts);
        }
      }
    }
  } catch {
    // Graceful no-op when mock/offline DB does not expose arena_solo_matches
  }

  const nextWeeklyXp = Math.max(safeStoredWeeklyXp, ledgerWeeklyXpSum);
  const nextArenaPoints = Math.max(safeStoredArenaPoints, soloArenaPointsSum);
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
      await admin.from('users').update(updatePayload).eq('id', opts.userId);
    } catch {
      // Non-fatal: still return reconciled totals to the caller
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
