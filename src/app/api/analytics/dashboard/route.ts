import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { ensureUserDailyPinReset } from '@/lib/pins/dailyPinReset';
import {
  computeDashboardPriorityActions,
  computeDashboardRadarMetrics,
  isTodayIst,
} from '@/lib/dashboard/dashboardMetrics';
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
    let completedQuestsList: string[] = [];
    let targetRole = '';
    let completedQuestsTimestamps: string[] = [];
    let completedMissionsTimestamps: string[] = [];
    let lastStreakDate = '';
    let radarMetricsPayload: ReturnType<typeof computeDashboardRadarMetrics> | null = null;
    let priorityActionsPayload: ReturnType<typeof computeDashboardPriorityActions> | null = null;
    let hasResumeInVaultFlag = false;

    if (admin) {
      try {
        let userRow: any = null;
        const primarySelect = await admin
          .from('users')
          .select(
            'ats_score, career_dna_score, trust_score, recruiter_visibility, mission_streak, career_readiness, completed_missions, completed_quests, arena_elo, arena_wins, arena_losses, weekly_xp, xp_total, weekly_arena_points, league_tier, league_joined_at, pins, bonus_pins, target_role, onboarding_answers'
          )
          .eq('id', studentId)
          .maybeSingle();

        if (primarySelect.error) {
          console.warn('[analytics/dashboard] Full users select failed, falling back to core columns:', primarySelect.error.message);
          const fallbackSelect = await admin
            .from('users')
            .select('ats_score, career_dna_score, trust_score, mission_streak, career_readiness, completed_quests, arena_elo, arena_wins, weekly_xp, xp_total, weekly_arena_points, league_tier, league_joined_at, pins, bonus_pins')
            .eq('id', studentId)
            .maybeSingle();
          userRow = fallbackSelect.data || null;
        } else {
          userRow = primarySelect.data || null;
        }

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
          try {
            const lazyReset = await ensureUserDailyPinReset(admin, studentId);
            if (lazyReset?.resetApplied) {
              pins = lazyReset.pins;
            }
          } catch {}
          completedQuestsList = Array.isArray(userRow.completed_quests) ? userRow.completed_quests : [];
          completedQuestsCount = completedQuestsList.length;
          targetRole = typeof userRow.target_role === 'string' ? userRow.target_role : '';
          const ob = (userRow.onboarding_answers || {}) as Record<string, any>;
          if (!targetRole && typeof ob.role === 'string') targetRole = ob.role;
          completedQuestsTimestamps = Array.isArray(ob.completedQuestsTimestamps) ? ob.completedQuestsTimestamps : [];
          completedMissionsTimestamps = Array.isArray(ob.completedMissionsTimestamps) ? ob.completedMissionsTimestamps : [];
          lastStreakDate = typeof ob.last_streak_date === 'string' ? ob.last_streak_date : '';

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

        const [
          ivRes,
          gdRes,
          vaultRes,
          resumeRes,
          masteryRes,
          soloRes,
        ] = await Promise.allSettled([
          admin
            .from('interview_sessions')
            .select('id, status, overall_score, completed_at, created_at')
            .eq('user_id', studentId)
            .limit(100),
          admin
            .from('gd_sessions')
            .select('id, overall_score, created_at')
            .eq('user_id', studentId)
            .limit(100),
          admin
            .from('vault_items')
            .select('id, item_type, verified, ai_confidence_score')
            .eq('user_id', studentId)
            .limit(100),
          admin
            .from('resumes')
            .select('id, ats_score')
            .eq('user_id', studentId)
            .limit(20),
          admin
            .from('student_competency_mastery')
            .select('competency_id, composite_score')
            .eq('student_id', studentId)
            .eq('state', 'verified')
            .limit(200),
          admin
            .from('arena_solo_matches')
            .select('id, passed, status')
            .eq('user_id', studentId)
            .limit(100),
        ]);

        const ivRows = ivRes.status === 'fulfilled' && Array.isArray(ivRes.value?.data) ? ivRes.value.data : [];
        const completedIvs = ivRows.filter((r: any) => r.status === 'completed' || (typeof r.overall_score === 'number' && r.overall_score > 0));
        interviewsTotal = completedIvs.length;
        const completedInterviewScores = completedIvs
          .map((r: any) => Number(r.overall_score))
          .filter((n: number) => Number.isFinite(n) && n > 0);
        const completedInterviewToday = completedIvs.some((r: any) => isTodayIst(r.completed_at || r.created_at));

        const gdRows = gdRes.status === 'fulfilled' && Array.isArray(gdRes.value?.data) ? gdRes.value.data : [];
        const completedGdScores = gdRows
          .map((r: any) => Number(r.overall_score))
          .filter((n: number) => Number.isFinite(n) && n > 0);

        const vaultRows = vaultRes.status === 'fulfilled' && Array.isArray(vaultRes.value?.data) ? vaultRes.value.data : [];
        const resumeRows = resumeRes.status === 'fulfilled' && Array.isArray(resumeRes.value?.data) ? resumeRes.value.data : [];
        const verifiedVaultCount = vaultRows.filter((v: any) => Boolean(v.verified)).length;
        const resumeInVault = vaultRows.filter((v: any) => String(v.item_type || '').toLowerCase() === 'resume');
        const hasResumeInVault = resumeInVault.length > 0 || resumeRows.length > 0;
        const hasVerifiedResume = resumeInVault.some((v: any) => Boolean(v.verified));
        const maxResumeTableAts = resumeRows.reduce((m: number, r: any) => Math.max(m, Number(r.ats_score) || 0), 0);
        if (maxResumeTableAts > atsScore) atsScore = Math.min(100, Math.round(maxResumeTableAts));

        const verifiedCompetencies = masteryRes.status === 'fulfilled' && Array.isArray(masteryRes.value?.data)
          ? masteryRes.value.data
          : [];
        const soloRows = soloRes.status === 'fulfilled' && Array.isArray(soloRes.value?.data) ? soloRes.value.data : [];
        const soloPassedCount = soloRows.filter((s: any) => Boolean(s.passed)).length;

        const computedRadar = computeDashboardRadarMetrics({
          targetRole,
          completedQuests: completedQuestsList,
          arenaWins,
          soloPassedCount,
          examsAvg,
          atsScore,
          hasResumeInVault,
          vaultTotalCount: vaultRows.length,
          vaultVerifiedCount: verifiedVaultCount,
          completedInterviewScores,
          completedGdScores,
          verifiedCompetencies,
          missionStreak,
        });

        const completedQuestToday = completedQuestsTimestamps.some((ts) => isTodayIst(ts));
        const completedMissionToday = completedMissionsTimestamps.some((ts) => isTodayIst(ts)) || isTodayIst(lastStreakDate);

        const computedActions = computeDashboardPriorityActions({
          targetRole,
          atsScore,
          hasResumeInVault,
          hasVerifiedResume,
          trustScore,
          missionStreak,
          completedMissionToday,
          completedQuestToday,
          completedInterviewToday,
          radar: computedRadar,
        });

        (globalThis as any).__tmpDashExtra = undefined;
        radarMetricsPayload = computedRadar;
        priorityActionsPayload = computedActions;
        hasResumeInVaultFlag = hasResumeInVault;
      } catch (err) {
        console.warn('[Analytics Dashboard Route] DB lookup notice:', err);
      }
    }

    const fallbackRadar = radarMetricsPayload ?? computeDashboardRadarMetrics({
      targetRole,
      completedQuests: completedQuestsList,
      arenaWins,
      soloPassedCount: 0,
      examsAvg,
      atsScore,
      hasResumeInVault: false,
      vaultTotalCount: 0,
      vaultVerifiedCount: 0,
      completedInterviewScores: [],
      completedGdScores: [],
      verifiedCompetencies: [],
      missionStreak,
    });
    const fallbackActions = priorityActionsPayload ?? computeDashboardPriorityActions({
      targetRole,
      atsScore,
      hasResumeInVault: false,
      hasVerifiedResume: false,
      trustScore,
      missionStreak,
      completedMissionToday: false,
      completedQuestToday: false,
      completedInterviewToday: false,
      radar: fallbackRadar,
    });

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
        hasResumeInVault: hasResumeInVaultFlag,
        arenaElo,
        arenaWins,
        arenaLosses,
        matchesPlayed: arenaWins + arenaLosses,
        weeklyXp,
        careerXp,
        weeklyArenaPoints,
        leaguePoints: weeklyXp + weeklyArenaPoints,
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
      radarMetrics: fallbackRadar,
      priorityActions: fallbackActions,
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
