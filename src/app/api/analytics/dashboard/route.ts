import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export const dynamic = 'force-dynamic';

function getNextMonday1AmIstIso(): string {
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const nowIst = new Date(now.getTime() + istOffsetMs);
  const day = nowIst.getUTCDay();
  const hour = nowIst.getUTCHours();
  let daysUntilMonday = (1 - day + 7) % 7;
  if (daysUntilMonday === 0 && hour >= 1) daysUntilMonday = 7;
  const nextMondayIst = new Date(nowIst);
  nextMondayIst.setUTCDate(nowIst.getUTCDate() + daysUntilMonday);
  nextMondayIst.setUTCHours(1, 0, 0, 0);
  return new Date(nextMondayIst.getTime() - istOffsetMs).toISOString();
}

export async function GET(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user?.id) {
      return gated.error || NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }
    const studentId = gated.user.id;
    const admin = getSupabaseAdmin();

    let atsScore = 0;
    let careerDnaScore = 0;
    let trustScore = 50;
    let recruiterVisibility = 100;
    let missionStreak = 0;
    let careerReadiness = 0;
    let missionsCompleted = 0;
    let missionsPending = 0;
    let missionsFailed = 0;
    let missionsTotal = 0;
    let examsTotal = 0;
    let examsAvg = 0;
    let passRate = 0;
    let goldCount = 0;
    let silverCount = 0;
    let interviewsTotal = 0;
    let arenaElo = 100;
    let arenaWins = 0;
    let arenaLosses = 0;
    let weeklyXp = 0;
    let careerXp = 0;
    let weeklyArenaPoints = 0;
    let leagueTier = 'browns';
    let leagueJoined = false;
    let leagueRank: number | null = null;
    let pins = 0;
    let bonusPins = 0;
    let completedQuestsCount = 0;

    if (admin) {
      try {
        const { data: userRow } = await admin
          .from('users')
          .select(
            'ats_score, career_dna_score, trust_score, recruiter_visibility, mission_streak, career_readiness, completed_missions, completed_quests, arena_elo, arena_wins, arena_losses, weekly_xp, xp_total, weekly_arena_points, league_tier, league_joined_at, pins, bonus_pins'
          )
          .eq('id', studentId)
          .maybeSingle();

        if (userRow) {
          atsScore = Math.min(100, Math.max(0, Number(userRow.ats_score) || 0));
          careerDnaScore = Math.min(100, Math.max(0, Number(userRow.career_dna_score) || 0));
          trustScore = typeof userRow.trust_score === 'number' && Number.isFinite(userRow.trust_score)
            ? Math.min(100, Math.max(0, Math.round(userRow.trust_score)))
            : 50;
          recruiterVisibility = userRow.recruiter_visibility !== undefined && userRow.recruiter_visibility !== null
            ? Number(userRow.recruiter_visibility)
            : 100;
          missionStreak = Math.max(0, Number(userRow.mission_streak) || 0);
          careerReadiness = Math.min(100, Math.max(0, Number(userRow.career_readiness) || 0));
          arenaWins = Math.max(0, Number(userRow.arena_wins) || 0);
          arenaLosses = Math.max(0, Number(userRow.arena_losses) || 0);
          const rawElo = Number(userRow.arena_elo);
          const isLegacy1200 = rawElo === 1200 && arenaWins === 0;
          arenaElo = Number.isFinite(rawElo) && rawElo >= 0 && !isLegacy1200 ? Math.round(rawElo) : 100;
          weeklyXp = Math.max(0, Math.round(Number(userRow.weekly_xp) || 0));
          careerXp = Math.max(0, Math.round(Number(userRow.xp_total) || 0));
          weeklyArenaPoints = Math.max(0, Math.round(Number(userRow.weekly_arena_points) || 0));
          leagueTier = typeof userRow.league_tier === 'string' && userRow.league_tier.trim()
            ? userRow.league_tier.trim().toLowerCase()
            : 'browns';
          leagueJoined = Boolean(userRow.league_joined_at);
          pins = Math.max(0, Math.round(Number(userRow.pins) || 0));
          bonusPins = Math.max(0, Math.round(Number(userRow.bonus_pins) || 0));
          completedQuestsCount = Array.isArray(userRow.completed_quests) ? userRow.completed_quests.length : 0;

          if (leagueJoined) {
            try {
              const titleTier = `${leagueTier.charAt(0).toUpperCase()}${leagueTier.slice(1)}`;
              const myPoints = weeklyXp + weeklyArenaPoints;
              const { data: tierPeers } = await admin
                .from('users')
                .select('id, weekly_xp, weekly_arena_points, xp_total')
                .not('league_joined_at', 'is', null)
                .in('league_tier', [leagueTier, titleTier, leagueTier.toUpperCase()])
                .limit(2000);
              if (Array.isArray(tierPeers) && tierPeers.length > 0) {
                const ahead = tierPeers.filter((peer: any) => {
                  if (peer.id === studentId) return false;
                  const pWeekly = Math.max(0, Number(peer.weekly_xp) || 0);
                  const pArena = Math.max(0, Number(peer.weekly_arena_points) || 0);
                  const pPts = pWeekly + pArena;
                  if (pPts !== myPoints) return pPts > myPoints;
                  if (pWeekly !== weeklyXp) return pWeekly > weeklyXp;
                  const pTotal = Math.max(0, Number(peer.xp_total) || 0);
                  if (pTotal !== careerXp) return pTotal > careerXp;
                  return String(peer.id).localeCompare(studentId) < 0;
                }).length;
                leagueRank = ahead + 1;
              }
            } catch {}
          }
        }

        const { data: missionRows } = await admin
          .from('missions')
          .select('id, status')
          .eq('student_id', studentId);

        if (missionRows && missionRows.length > 0) {
          missionsTotal = missionRows.length;
          missionsCompleted = missionRows.filter((m: any) => m.status === 'completed').length;
          missionsPending = missionRows.filter((m: any) => m.status === 'pending' || m.status === 'in_progress').length;
          missionsFailed = missionRows.filter((m: any) => m.status === 'failed').length;
        } else if (Array.isArray(userRow?.completed_missions)) {
          missionsCompleted = userRow.completed_missions.length;
          missionsTotal = userRow.completed_missions.length;
        }

        const { data: examRows } = await admin
          .from('campus_exam_results')
          .select('score, passed')
          .eq('student_id', studentId);

        if (examRows && examRows.length > 0) {
          examsTotal = examRows.length;
          const sum = examRows.reduce((acc: number, curr: any) => acc + (Number(curr.score) || 0), 0);
          examsAvg = Math.round(sum / examsTotal);
          goldCount = examRows.filter((e: any) => Number(e.score) >= 90).length;
          silverCount = examRows.filter((e: any) => Number(e.score) >= 75 && Number(e.score) < 90).length;
          passRate = examRows.filter((e: any) => e.passed).length / examsTotal;
        }

        const { count: ivCount } = await admin
          .from('interview_sessions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', studentId);
        if (typeof ivCount === 'number') {
          interviewsTotal = ivCount;
        }
      } catch (err) {
        console.warn('[Analytics Dashboard Route] DB lookup notice:', err);
      }
    }

    const effectiveCareerScore = Math.min(100, Math.max(careerReadiness, careerDnaScore, atsScore));

    // Only report real recorded snapshots (no synthetic 0.4x / 0.8x fabrication)
    const scoreHistory = (atsScore > 0 || careerDnaScore > 0 || trustScore > 0)
      ? [{ date: 'Current', ats: atsScore, dna: careerDnaScore, trust: trustScore }]
      : [{ date: 'Today', ats: 0, dna: 0, trust: trustScore }];

    const payload = {
      ok: true,
      telemetry: {
        trustScore,
        careerScore: effectiveCareerScore,
        careerDnaScore,
        atsScore,
        arenaElo,
        arenaWins,
        arenaLosses,
        matchesPlayed: arenaWins + arenaLosses,
        weeklyXp,
        careerXp,
        weeklyArenaPoints,
        league: leagueTier,
        rank: leagueRank,
        joined: leagueJoined,
        sprintEndsAt: getNextMonday1AmIstIso(),
        missionStreak,
        pins,
        bonusPins,
        interviewsTotal,
        completedQuestsCount,
        completedMissionsCount: missionsCompleted,
      },
      scores: {
        ats_score: atsScore,
        career_dna_score: careerDnaScore,
        trust_score: trustScore,
        recruiter_visibility: recruiterVisibility,
        mission_streak: missionStreak,
        career_readiness: careerReadiness,
      },
      missions: {
        completed: missionsCompleted,
        pending: missionsPending,
        failed: missionsFailed,
        total: missionsTotal,
      },
      recentActivity: [],
      exams: {
        total: examsTotal,
        avg_pct: examsAvg,
        pass_rate: passRate,
        gold: goldCount,
        silver: silverCount,
      },
      interviews: {
        total: interviewsTotal,
      },
      score_history: scoreHistory,
    };

    return NextResponse.json(payload, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || 'Failed to generate analytics dashboard',
      },
      { status: 500 }
    );
  }
}
