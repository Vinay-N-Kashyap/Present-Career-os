import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { PRIORITY_CATALOG_XP, getIstDateKey } from '@/lib/dashboard/dashboardMetrics';
import { awardDailyPriorityXp } from '@/lib/dashboard/awardDailyPriorityXp';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`priority_${ip}`, { limit: 30, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { ok: false, error: 'RATE_LIMIT', message: 'Too many requests. Wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rl.resetSec) } }
      );
    }

    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user?.id) {
      return gated.error || NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const priorityId = typeof body?.priorityId === 'string' ? body.priorityId.trim() : '';
    const catalogEntry = PRIORITY_CATALOG_XP[priorityId];

    if (!catalogEntry) {
      return NextResponse.json(
        { ok: false, error: 'INVALID_PRIORITY_ID', message: 'Unrecognized daily priority action.' },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json(
        { ok: false, error: 'DATABASE_UNAVAILABLE', message: 'Database unavailable.' },
        { status: 503 }
      );
    }

    const dayKey = getIstDateKey();
    const res = await awardDailyPriorityXp(
      admin,
      gated.user.id,
      priorityId,
      catalogEntry.title,
      catalogEntry.xpAmount,
      dayKey
    );

    return NextResponse.json({
      ok: true,
      priorityId,
      dayKey: res.dayKey,
      xpAwarded: res.xpAdded,
      alreadyClaimed: res.alreadyClaimed,
      capReached: Boolean(res.capReached),
      newXp: res.newXp,
      newWeeklyXp: res.newWeeklyXp,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: 'INTERNAL_SERVER_ERROR', message: err?.message || 'Failed to complete priority.' },
      { status: 500 }
    );
  }
}
