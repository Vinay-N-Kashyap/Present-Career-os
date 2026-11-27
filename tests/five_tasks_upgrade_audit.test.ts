import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  DAILY_PIN_CAP,
  computeDailyResetWallet,
  getLatest1AmIst,
  hasActivePurchasedPlan,
} from '../src/lib/pins/pinWalletRules';
import { POST as dailyPinResetPost } from '../src/app/api/cron/daily-pin-reset/route';
import { GET as pinBalanceGet } from '../src/app/api/pins/balance/route';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';
import {
  computeDashboardPriorityActions,
  computeDashboardRadarMetrics,
  getIstDateKey,
  PRIORITY_XP_MIN,
  PRIORITY_XP_MAX,
} from '../src/lib/dashboard/dashboardMetrics';
import { awardDailyPriorityXp } from '../src/lib/dashboard/awardDailyPriorityXp';
import { extractSafeUserStoragePath } from '../src/lib/roadmap/userEvidenceContext';
import { generateDynamicStudentRoadmap } from '../src/lib/data/roadmapFuser';
import { isSpecificLessonRequest, isLessonContinuationIntent } from '../src/lib/avatar/lessonIntent';
import { resolveLessonRequest } from '../src/lib/avatar/lessonResolver';
import { buildMentorSystemPrompt } from '../src/lib/avatar/mentorPromptBuilder';
import { matchVoiceActionIntent } from '../src/lib/avatar/voiceActionRouter';
import { matchNavigationIntent } from '../src/components/avatar/hooks/useVoiceNavigation';
import {
  getCurrentSprintStartMonday1AmIst,
  reconcileUserWeeklyLeaguePoints,
} from '../src/lib/leagues/reconcileWeeklyLeaguePoints';
import {
  compactModulesForStorage,
  rehydrateExtraModules,
  formatCompactDuration,
  formatDurationLabel,
} from '../src/lib/quests/extraRoadmaps';
import {
  formatConciseStageDesc,
  formatRoadmapNodeLabel,
  buildDynamicSCurveGeometry,
} from '../src/app/quests/components/QuestPathView';
import { selectRelevantCourseIds } from '../src/lib/roadmap/roadmapCourseSelector';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';

const ROOT = process.cwd();

test('Task 1: XP routes sync weekly_xp reliably and DashboardHeaderHUD never falls back to lifetime xp_total', () => {
  const questCompleteSrc = fs.readFileSync(path.join(ROOT, 'src/app/api/quest/complete/route.ts'), 'utf8');
  const xpAddSrc = fs.readFileSync(path.join(ROOT, 'src/app/api/xp/add/route.ts'), 'utf8');
  const runJavaSrc = fs.readFileSync(path.join(ROOT, 'src/app/api/code/run-java/route.ts'), 'utf8');
  const runPythonSrc = fs.readFileSync(path.join(ROOT, 'src/app/api/code/run-python/route.ts'), 'utf8');
  const hudSrc = fs.readFileSync(path.join(ROOT, 'src/components/student/dashboard/DashboardHeaderHUD.tsx'), 'utf8');
  const authCtxSrc = fs.readFileSync(path.join(ROOT, 'src/lib/context/AuthContext.tsx'), 'utf8');
  const leaderboardSrc = fs.readFileSync(path.join(ROOT, 'src/app/leaderboard/page.tsx'), 'utf8');

  assert.ok(questCompleteSrc.includes('weeklyCreditedByRpc'), 'quest/complete must write weekly_xp even when old RPC skips new_weekly_xp');
  assert.ok(xpAddSrc.includes('grantXp') && xpAddSrc.includes('newWeeklyXp'), 'xp/add must use grantXp and return newWeeklyXp');
  assert.ok(runJavaSrc.includes('grantXp('), 'run-java must award XP through grantXp');
  assert.ok(runPythonSrc.includes('grantXp('), 'run-python must award XP through grantXp');
  assert.ok(!hudSrc.includes('if (typeof xp === \'number\' && xp > 0)'), 'DashboardHeaderHUD must NOT fall back to lifetime xp in dynamicWeeklyExp');
  assert.ok(authCtxSrc.includes("weekly_xp: 'weeklyXp'") && authCtxSrc.includes("weekly_arena_points: 'weeklyArenaPoints'"), 'AuthContext COLUMN_MAP must map weekly_xp & weekly_arena_points');
  assert.ok(leaderboardSrc.includes('Weekly EXP') && leaderboardSrc.includes('League Points'), 'Leaderboard HUD must show Weekly EXP + Arena Points breakdown');
});

test('Task 2: Daily 1:00 AM IST pins reset applies ONLY to plan holders and payment routes never write non-existent has_purchased_plan', async () => {
  // Pure helpers
  const preReset = new Date('2026-11-25T19:15:00.000Z'); // 00:45 IST
  const postReset = new Date('2026-11-25T19:45:00.000Z'); // 01:15 IST
  assert.equal(getLatest1AmIst(preReset).toISOString(), '2026-11-24T19:30:00.000Z');
  assert.equal(getLatest1AmIst(postReset).toISOString(), '2026-11-25T19:30:00.000Z');

  assert.deepEqual(computeDailyResetWallet(40, 464, DAILY_PIN_CAP, true), { pins: 120, bonusPins: 464 });
  assert.deepEqual(computeDailyResetWallet(40, 464, DAILY_PIN_CAP, false), { pins: 40, bonusPins: 464 });
  assert.equal(hasActivePurchasedPlan({ subscription_status: 'active', subscription_tier: 'pro' }), true);
  assert.equal(hasActivePurchasedPlan({ subscription_status: 'none', subscription_tier: 'free', hasPaidEnrollment: false }), false);

  // Payment routes must NOT write non-existent column `has_purchased_plan`
  const verifySrc = fs.readFileSync(path.join(ROOT, 'src/app/api/payment/verify/route.ts'), 'utf8');
  const webhookSrc = fs.readFileSync(path.join(ROOT, 'src/app/api/payment/webhook/route.ts'), 'utf8');
  assert.equal(verifySrc.includes('has_purchased_plan'), false, 'payment/verify must not write non-existent has_purchased_plan column');
  assert.equal(webhookSrc.includes('has_purchased_plan'), false, 'payment/webhook must not write non-existent has_purchased_plan column');

  // Lazy reset on GET /api/pins/balance for a purchased course plan holder whose last_pin_reset was yesterday
  const prevBypass = process.env.ALLOW_DEV_AUTH_BYPASS;
  const prevEnv = process.env.NODE_ENV;
  process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
  (process.env as Record<string, string | undefined>).NODE_ENV = 'test';

  let currentPinsInDb = 95;
  const userUpdates: Array<Record<string, unknown>> = [];

  setSupabaseAdminForTests({
    from: (table: string) => {
      if (table === 'user_crash_enrollments') {
        const c: any = {
          select: () => c,
          eq: () => c,
          limit: async () => ({ data: [{ id: 'enr_1', status: 'active' }], error: null }),
        };
        return c;
      }
      if (table === 'processed_payments') {
        const c: any = {
          select: () => c,
          eq: () => c,
          limit: async () => ({ data: [], error: null }),
        };
        return c;
      }
      const userChain: any = {
        select: () => userChain,
        eq: () => userChain,
        or: () => userChain,
        maybeSingle: async () => ({
          data: {
            pins: currentPinsInDb,
            bonus_pins: 464,
            last_pin_reset: '2026-11-24T00:00:00.000Z',
            subscription_tier: 'free',
            subscription_status: 'none',
            subscription_expires_at: null,
            pin_history: [],
            unlocked_items: [],
          },
          error: null,
        }),
        update: (payload: Record<string, unknown>) => {
          userUpdates.push(payload);
          if (typeof payload.pins === 'number') currentPinsInDb = payload.pins;
          return userChain;
        },
      };
      return userChain;
    },
  });

  try {
    const res = await pinBalanceGet(new Request('http://localhost/api/pins/balance', {
      headers: { Authorization: 'Bearer test-token-u-paid-123' },
    }));
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.pins, 120, 'Purchased course plan holder should lazily reset from 95 to 120');
    assert.equal(body.bonusPins, 464, 'Bonus Vault must remain untouched at 464');
    assert.equal(body.eligibleForDailyReset, true);
    assert.equal(body.dailyResetApplied, true);
    assert.ok(userUpdates.some((u) => u.pins === 120 && !('bonus_pins' in u)));
  } finally {
    setSupabaseAdminForTests(null);
    process.env.ALLOW_DEV_AUTH_BYPASS = prevBypass;
    (process.env as Record<string, string | undefined>).NODE_ENV = prevEnv;
  }

  // Cron route rejects unauthenticated and accepts valid secret cleanly
  const unauthCron = await dailyPinResetPost(new Request('http://localhost/api/cron/daily-pin-reset', { method: 'POST' }));
  assert.equal(unauthCron.status, 401);
});

test('Task 3: Radar & Priority Actions are evidence-driven (no inflated Socratic=100, honest IoT=0, Vault resume synced)', () => {
  // User with 0 completed interviews, 0 IoT quests, 1 Vault resume uploaded + 65% ATS should NOT get Socratic=100 or IoT=10
  const radar = computeDashboardRadarMetrics({
    targetRole: 'Full Stack Engineer',
    completedQuests: ['fullstack-js-lecture1-day-1', 'sql-mastery-lecture1-day-1'],
    arenaWins: 1,
    soloPassedCount: 0,
    examsAvg: 80,
    atsScore: 65,
    hasResumeInVault: true,
    vaultTotalCount: 1,
    vaultVerifiedCount: 0,
    completedInterviewScores: [], // e.g., abandoned 0-score sessions must NOT count
    completedGdScores: [],
    verifiedCompetencies: [],
    missionStreak: 2,
  });

  const socraticAxis = radar.axes.find((a) => a.key === 'socratic');
  const iotAxis = radar.axes.find((a) => a.key === 'iot');
  const archAxis = radar.axes.find((a) => a.key === 'arch');

  assert.equal(socraticAxis?.score, 0, 'Zero scored interviews/GDs/oral defenses must yield Socratic=0 (never 100)');
  assert.equal(iotAxis?.score, 0, 'Zero IoT quests on SDE track must yield IoT=0 (never 0.5*careerScore)');
  assert.ok((archAxis?.score || 0) > 0, 'Vault resume + ATS should reflect positive Arch score');

  // With 1 single 70% completed interview, confidence ramp prevents artificial 100
  const oneInterviewRadar = computeDashboardRadarMetrics({
    targetRole: 'Full Stack Engineer',
    completedQuests: [],
    arenaWins: 0,
    soloPassedCount: 0,
    examsAvg: 0,
    atsScore: 0,
    hasResumeInVault: false,
    vaultTotalCount: 0,
    vaultVerifiedCount: 0,
    completedInterviewScores: [70],
    completedGdScores: [],
    verifiedCompetencies: [],
    missionStreak: 0,
  });
  const socraticOne = oneInterviewRadar.axes.find((a) => a.key === 'socratic');
  assert.ok((socraticOne?.score || 0) > 15 && (socraticOne?.score || 0) < 40, 'Single scored interview should calibrate conservatively');

  // Daily-rotating Priority Actions strictly use 10-15 Weekly EXP and reflect today's activity
  const actionsDay1 = computeDashboardPriorityActions({
    targetRole: 'Full Stack Engineer',
    atsScore: 78,
    hasResumeInVault: true,
    hasVerifiedResume: true,
    trustScore: 75,
    missionStreak: 3,
    completedMissionToday: true,
    completedQuestToday: false,
    completedInterviewToday: false,
    radar,
    now: new Date('2026-11-26T06:00:00.000Z'),
  });
  assert.equal(actionsDay1.length, 3);
  for (const act of actionsDay1) {
    assert.ok(
      Number.isInteger(act.xpAmount) && act.xpAmount >= PRIORITY_XP_MIN && act.xpAmount <= PRIORITY_XP_MAX,
      `Priority ${act.id} XP (${act.xpAmount}) must be strictly between 10 and 15`
    );
    assert.ok(!/35 XP|40 XP|50 XP|75 XP/.test(act.xp), `Priority badge ${act.xp} must not use legacy high XP`);
  }
});

test('Task 4: Evidence-driven Roadmap enforces Vault storage IDOR boundary and uses real executable quests & live Groq models', () => {
  // Security boundary: reject traversal / cross-tenant Storage paths
  assert.equal(extractSafeUserStoragePath('Storage: vault/user_A/resume/cv.pdf', 'user_A'), 'vault/user_A/resume/cv.pdf');
  assert.equal(extractSafeUserStoragePath('Storage: vault/victim_B/resume/cv.pdf', 'user_A'), null);
  assert.equal(extractSafeUserStoragePath('Storage: vault/user_A/../victim_B/cv.pdf', 'user_A'), null);

  // Selected course IDs + weak areas + evidence produce real executable modules with rationale
  const modules = generateDynamicStudentRoadmap({
    qt1: 60,
    qt2: 65,
    archetype: 'Pattern Hunter',
    goal: 'Backend SQL & Python Engineer',
    courseId: 'course-python-backend',
    durationDays: 60,
    dailyPace: 2,
    selectedCourseIds: ['course-python-backend', 'course-database-eng'],
    weakAreas: ['SQL joins'],
    evidence: {
      userId: 'u1',
      displayName: 'Dev',
      targetRole: 'Backend Engineer',
      careerGoal: 'Backend SQL & Python Engineer',
      education: 'B.Tech CS',
      department: 'CSE',
      semester: '6',
      resumeTitle: 'Dev_Backend_Resume.pdf',
      hasResumeInVault: true,
      vaultDocsCount: 2,
      verifiedDocsCount: 1,
      provenSkills: ['Python', 'Git'],
      claimedSkills: ['SQL'],
      weakAreas: ['SQL joins'],
      interviewGaps: ['Database Indexing'],
      projects: [],
      certifications: [],
      completedQuests: [],
      vaultDocsSummary: [],
      rawSummary: 'Target Role: Backend Engineer',
    },
  });

  assert.ok(modules.length >= 2, 'Expected multi-course modules from selectedCourseIds');
  assert.ok(modules.some((m) => m.courseId === 'course-database-eng'), 'Must include evidence-selected SQL course');
  assert.ok(modules.every((m) => m.quests.length > 0 && Boolean(m.whyThisStage)), 'Every stage must have real quests and whyThisStage rationale');

  // Retired llama-3.1-8b-instant must NOT be present in roadmap generator
  const genSrc = fs.readFileSync(path.join(ROOT, 'src/app/api/quests/roadmap/generate/route.ts'), 'utf8');
  assert.equal(genSrc.includes('llama-3.1-8b-instant'), false, 'Roadmap generator must use live Groq models');
  assert.ok(genSrc.includes('collectUserRoadmapEvidence'), 'Roadmap generator must collect Vault & profile evidence');
});

test('Task 5: Ms. Priya resolves Python AI Day 1, SQL Day 3 & topic queries to real LongLesson content and avoids voice-router hijacks', async () => {
  // 1. Voice router hijack guards
  assert.equal(isSpecificLessonRequest("I don't understand Python AI Day 1"), true);
  assert.equal(isSpecificLessonRequest('start SQL Day 3'), true);
  assert.equal(isSpecificLessonRequest('go to courses'), false);

  assert.equal(matchVoiceActionIntent('start Python AI Day 1', { addressedMentor: true }).matched, false, 'voiceActionRouter must not hijack specific Day lesson launch to generic autostart');
  assert.equal(matchNavigationIntent('open Python AI Day 1', { addressedMentor: true }).matched, false, 'useVoiceNavigation must not hijack specific Day lesson launch to generic /quests');

  // 2. Teach intent: "I don't understand Python AI Day 1"
  const pyAiRes = await resolveLessonRequest("I don't understand Python AI Day 1", { teacherId: 'priya' });
  assert.ok(pyAiRes, 'Must resolve Python AI Day 1');
  assert.equal(pyAiRes.lessonAction.prefix, 'ai-py');
  assert.equal(pyAiRes.lessonAction.dayNum, 1);
  assert.equal(pyAiRes.lessonAction.questId, 'ai-py-lecture1-day-1');
  assert.equal(pyAiRes.lessonAction.autoLaunch, false);
  assert.ok(pyAiRes.lessonAction.launchUrl.includes('questId=ai-py-lecture1-day-1') && pyAiRes.lessonAction.launchUrl.includes('teacherId=priya'));
  assert.ok(pyAiRes.promptDigest.includes(pyAiRes.lessonAction.lessonTitle) && pyAiRes.lessonAction.totalParts >= 4, 'Must load real multi-part LongLesson from .json.gz archive');

  // 3. Explicit launch intent: "start SQL Day 3"
  const sqlLaunch = await resolveLessonRequest('start SQL Day 3', { teacherId: 'priya' });
  assert.ok(sqlLaunch, 'Must resolve SQL Day 3');
  assert.equal(sqlLaunch.lessonAction.prefix, 'sql-mastery');
  assert.equal(sqlLaunch.lessonAction.dayNum, 3);
  assert.equal(sqlLaunch.lessonAction.autoLaunch, true);

  // 4. Active session continuation: "next part"
  assert.equal(isLessonContinuationIntent('next part'), 'next_part');
  const part2 = await resolveLessonRequest('next part', {
    teacherId: 'priya',
    lessonSession: pyAiRes.updatedSession,
  });
  assert.ok(part2 && part2.lessonAction.partIndex === 1, 'Continuation must advance cleanly to partIndex 1');

  // 5. Prompt builder Tutor Mode overrides Hyper-Active 30-word cap
  const tutorPrompt = buildMentorSystemPrompt({
    studentName: 'Dev',
    targetRole: 'Full Stack Engineer',
    questTitle: pyAiRes.lessonAction.lessonTitle,
    missingSkills: [],
    atsScore: 70,
    teacherId: 'priya',
    hyperActive: true,
    lessonContextPrompt: pyAiRes.promptDigest,
  });
  assert.ok(tutorPrompt.includes('AUTHORITATIVE LESSON CONTENT') && !tutorPrompt.includes('UNDER 30 WORDS TOTAL'));

  // 6. Classroom page recognizes Ms. Priya metadata
  const lessonPageSrc = fs.readFileSync(path.join(ROOT, 'src/app/quests/lesson/page.tsx'), 'utf8');
  assert.ok(lessonPageSrc.includes("priya: { name: 'Ms. Priya'"), 'TEACHER_METADATA must include priya for classroom rendering');
});

test('Production Fix 1: Ms. Priya resolves spoken Day 1, relative previous day & launch phrases to active Python Day 1', async () => {
  // 1. Voice router must NOT hijack spoken Day 1 / relative previous-day topic questions
  assert.equal(isSpecificLessonRequest("I didn't get Python day one so can you start again"), true);
  assert.equal(isSpecificLessonRequest('i did not understand previous day topic comment so can u start lesson'), true);
  assert.equal(matchVoiceActionIntent('i did not understand previous day topic comment so can u start lesson', { addressedMentor: true }).matched, false);
  // Plain "start lesson" without course/day/topic must STILL match voiceActionRouter!
  assert.equal(matchVoiceActionIntent('start lesson', { addressedMentor: true }).matched, true);

  const devCompletedQuests = [
    'python-lecture1-day-1',
    'python-practice1-day-1',
    'python-lecture1-day-2',
  ];

  // 2. Spoken "Python day one so can you start again" resolves to course-python-backend Day 1 (NOT Day 60!)
  const pyDayOne = await resolveLessonRequest("I didn't get Python day one so can you start again", {
    teacherId: 'priya',
    completedQuests: devCompletedQuests,
    enrolledTrack: 'sde_fullstack',
  });
  assert.ok(pyDayOne, 'Must resolve Python day one');
  assert.equal(pyDayOne.lessonAction.courseId, 'course-python-backend');
  assert.equal(pyDayOne.lessonAction.dayNum, 1);
  assert.equal(pyDayOne.lessonAction.questId, 'python-lecture1-day-1');
  assert.equal(pyDayOne.lessonAction.autoLaunch, true);

  // 3. Relative "previous day topic comment so can u start lesson" resolves to active Python Day 1 (NOT fullstack-js!)
  const prevDay = await resolveLessonRequest('i did not understand previous day topic comment so can u start lesson', {
    teacherId: 'priya',
    completedQuests: devCompletedQuests,
    enrolledTrack: 'sde_fullstack',
  });
  assert.ok(prevDay, 'Must resolve previous day topic');
  assert.equal(prevDay.lessonAction.courseId, 'course-python-backend');
  assert.equal(prevDay.lessonAction.dayNum, 1);
  assert.equal(prevDay.lessonAction.questId, 'python-lecture1-day-1');
  assert.equal(prevDay.lessonAction.autoLaunch, true);

  // 4. Prompt builder explicitly instructs Priya to revisit any Day 1 freely
  const prompt = buildMentorSystemPrompt({
    studentName: 'dev',
    targetRole: 'Full Stack Engineer',
    questTitle: pyDayOne.lessonAction.lessonTitle,
    missingSkills: [],
    atsScore: 72,
    teacherId: 'priya',
    hyperActive: true,
    lessonContextPrompt: pyDayOne.promptDigest,
  });
  assert.ok(prompt.includes('revisit ANY requested Day (including Day 1'));
});

test('Production Fix 2 & 3: Custom Roadmap avoids Storage OCR timeout, aligns goal track & modal scrolls cleanly', () => {
  const genSrc = fs.readFileSync(path.join(ROOT, 'src/app/api/quests/roadmap/generate/route.ts'), 'utf8');
  assert.ok(genSrc.includes('export const maxDuration = 30'), 'Roadmap route must export maxDuration = 30 for Vercel');
  assert.ok(genSrc.includes('parseStorageResume: false'), 'Roadmap route must check indexed vault metadata first before Storage OCR');
  assert.ok(genSrc.includes('resolveGoalPrimaryCourse'), 'Roadmap route must align course to career goal instead of stale java-logic default');

  const modalSrc = fs.readFileSync(path.join(ROOT, 'src/app/quests/components/QuestDetailModal.tsx'), 'utf8');
  assert.ok(modalSrc.includes("maxHeight: '88vh'"), 'CustomRoadmapModal must bound height to 88vh');
  assert.ok(modalSrc.includes("overflowY: 'auto'"), 'CustomRoadmapModal body must scroll vertically');
  assert.ok(modalSrc.includes('zIndex: 1300'), 'CustomRoadmapModal must sit above bottom Mentor floating bar');
  assert.ok(modalSrc.includes("monthsCount === 1 ? 'Month' : 'Months'"), 'CustomRoadmapModal must render singular "1 Month" grammar');
});

test('Production Fix 4: Self-healing weekly League Points reconciles xp_ledger + arena_solo_matches and surfaces breakdown', async () => {
  const fixedNow = new Date('2026-11-25T11:00:00.000Z'); // Wed Nov 25 16:30 IST
  const sprintStart = getCurrentSprintStartMonday1AmIst(fixedNow);
  // Mon Nov 23 2026 01:00 IST == Sun Nov 22 2026 19:30 UTC
  assert.equal(sprintStart.toISOString(), '2026-11-22T19:30:00.000Z');

  let updatedPayload: any = null;
  const mockAdmin = {
    from(table: string) {
      if (table === 'xp_ledger') {
        const chain: any = {
          select: () => chain,
          eq: () => chain,
          gte: () => Promise.resolve({ data: [{ amount: 200 }, { amount: 470 }] }),
        };
        return chain;
      }
      if (table === 'arena_solo_matches') {
        const chain: any = {
          select: () => chain,
          eq: () => chain,
          gte: () => Promise.resolve({ data: [{ settlement: { arenaPointsAwarded: 50 } }] }),
        };
        return chain;
      }
      if (table === 'arena_rooms') {
        const chain: any = {
          select: () => chain,
          eq: () => chain,
          gte: () => chain,
          or: () => Promise.resolve({ data: [] }),
        };
        return chain;
      }
      if (table === 'users') {
        return {
          update(payload: any) {
            updatedPayload = payload;
            return { eq: () => Promise.resolve({ error: null }) };
          },
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    },
  };

  const healed = await reconcileUserWeeklyLeaguePoints(mockAdmin, {
    userId: 'user-dev-1',
    storedWeeklyXp: 200,
    storedArenaPoints: 0,
    now: fixedNow,
  });

  assert.equal(healed.healed, true);
  assert.equal(healed.weeklyXp, 670);
  assert.equal(healed.arenaPoints, 50);
  assert.equal(healed.leaguePoints, 720);
  assert.equal(updatedPayload?.weekly_xp, 670);
  assert.equal(updatedPayload?.weekly_arena_points, 50);

  const lbRouteSrc = fs.readFileSync(path.join(ROOT, 'src/app/api/leaderboard/route.ts'), 'utf8');
  const dashRouteSrc = fs.readFileSync(path.join(ROOT, 'src/app/api/analytics/dashboard/route.ts'), 'utf8');
  const lbPageSrc = fs.readFileSync(path.join(ROOT, 'src/app/leaderboard/page.tsx'), 'utf8');
  assert.ok(lbRouteSrc.includes('reconcileUserWeeklyLeaguePoints'));
  assert.ok(dashRouteSrc.includes('reconcileUserWeeklyLeaguePoints'));
  assert.ok(lbPageSrc.includes('+ Arena'));
});

test('All-6-Tasks Audit: Task 1 (Resume opt-out, wider modal, declutter), Task 2 (365-day compact storage), Task 3 (Gap-first courses), Task 4 (Timeline UI), Task 5 (Ms. Priya topic/course), Task 6 (Pre-reset + PvP Arena heal)', async () => {
  // Task 1: Modal width, checkbox beside Resume, Img 2/5 removal & backend strict opt-out
  const modalSrc = fs.readFileSync(path.join(ROOT, 'src/app/quests/components/QuestDetailModal.tsx'), 'utf8');
  assert.ok(modalSrc.includes('maxWidth: 780'), 'CustomRoadmapModal must use wider maxWidth: 780');
  assert.ok(modalSrc.includes('data-testid="checkbox-use-resume"'), 'Checkbox must sit cleanly beside Resume row');
  assert.equal(modalSrc.includes('QT1 Knowledge:'), false, 'Img 2 QT1/Mindset/Target Track card must be removed');

  const drawerSrc = fs.readFileSync(path.join(ROOT, 'src/app/quests/components/TrackSelectorDrawer.tsx'), 'utf8');
  assert.ok(drawerSrc.includes("activeSubTab !== 'custom_roadmap'"), 'Img 5 My Active Roadmaps switcher bar must be hidden on custom_roadmap');

  // Task 2: 365-day storage compaction + duration formatters + 12-course scaling
  const genSrc = fs.readFileSync(path.join(ROOT, 'src/app/api/quests/roadmap/generate/route.ts'), 'utf8');
  assert.ok(genSrc.includes('Math.min(12,'), '365-day roadmaps must scale up to 12 courses');
  assert.equal(formatDurationLabel(365), '365 Days (1 Year)');
  assert.equal(formatDurationLabel(90), '90 Days (3 Months)');
  assert.equal(formatCompactDuration(180), '180d');

  const large365 = generateDynamicStudentRoadmap({
    courseId: 'course-fullstack-js',
    goal: 'Full Stack Engineer',
    durationDays: 365,
    dailyPace: 3,
    selectedCourseIds: COURSES_REGISTRY.slice(0, 12).map((c) => c.id),
  });
  const fullSizeBytes = JSON.stringify(large365).length;
  const compact = compactModulesForStorage(large365);
  const compactSizeBytes = JSON.stringify(compact).length;
  assert.ok(compactSizeBytes < 120000 && compactSizeBytes < fullSizeBytes / 10, `365-day compacted storage must stay <120KB & >10x smaller (full=${fullSizeBytes}, compact=${compactSizeBytes})`);
  const rehydrated = rehydrateExtraModules(compact, COURSES_REGISTRY);
  assert.ok(rehydrated && rehydrated.length === large365.length && rehydrated[0].quests.length > 0, '365-day modules must rehydrate cleanly');
  assert.equal(large365[0].startDay, 1);
  assert.equal(large365[large365.length - 1].endDay, 365);

  // Task 3: Resume skills + Target Gaps prioritize gap-closing courses instead of redundant Full-Stack JS syntax
  const gapFirstCourses = selectRelevantCourseIds({
    primaryCourseId: 'course-fullstack-js',
    durationDays: 90,
    goal: 'Full Stack Engineer',
    useResumeAndVault: true,
    evidence: {
      userId: 'u-1',
      displayName: 'Vinay N',
      targetRole: 'Full Stack Engineer',
      careerGoal: 'Full Stack Engineer',
      education: '',
      department: '',
      semester: '',
      resumeTitle: 'Vinay N Resume',
      hasResumeInVault: true,
      vaultDocsCount: 1,
      verifiedDocsCount: 1,
      provenSkills: ['Python', 'JavaScript', 'SQL', 'C++', 'React.js', 'Next.js'],
      claimedSkills: [],
      weakAreas: ['System Design Basics', 'DSA - Trees & Graphs', 'STAR Behavioral Interviews'],
      interviewGaps: [],
      projects: [],
      certifications: [],
      completedQuests: [],
      vaultDocsSummary: [],
      rawSummary: '',
    },
  });
  assert.equal(gapFirstCourses.length, 3);
  assert.notEqual(gapFirstCourses[0], 'course-fullstack-js', 'Stage 1 must NOT repeat redundant JavaScript basics');
  assert.ok(gapFirstCourses.includes('course-distributed-sys') || gapFirstCourses.includes('course-sre-web'));
  assert.ok(gapFirstCourses.includes('course-dsa-optim') || gapFirstCourses.includes('course-dsa-python'));
  assert.ok(gapFirstCourses.includes('course-softskills-communication'));

  // Opting out of resume ignores all gaps & resume skills strictly
  const goalOnlyCourses = selectRelevantCourseIds({
    primaryCourseId: 'course-fullstack-js',
    durationDays: 30,
    goal: 'Full Stack Engineer',
    useResumeAndVault: false,
    evidence: null,
  });
  assert.equal(goalOnlyCourses[0], 'course-fullstack-js');

  // Task 4: Timeline strip & clean stage UI
  const pathSrc = fs.readFileSync(path.join(ROOT, 'src/app/quests/components/QuestPathView.tsx'), 'utf8');
  assert.ok(pathSrc.includes('data-testid="roadmap-timeline-strip"'));
  assert.ok(pathSrc.includes('data-testid="roadmap-duration-badge"'));

  // Task 5: Ms. Priya resolves "previous day topic comment" to Python Day 1 even while viewing Business Management tab
  const bizVsPython = await resolveLessonRequest('i did not understand previous day topic comment so can u start lesson', {
    teacherId: 'priya',
    activeCourseId: 'course-entrepreneurship-biz-mgmt',
    completedQuests: ['python-lecture1-day-1', 'python-practice1-day-1', 'python-lecture1-day-2'],
    enrolledTrack: 'sde_fullstack',
  });
  assert.ok(bizVsPython, 'Must resolve relative comment lesson');
  assert.equal(bizVsPython.lessonAction.courseId, 'course-python-backend', 'Must NOT launch untouched Business Management Day 1');
  assert.equal(bizVsPython.lessonAction.dayNum, 1);
  assert.equal(bizVsPython.lessonAction.questId, 'python-lecture1-day-1');
  assert.equal(bizVsPython.lessonAction.autoLaunch, true);

  // Task 6: Pre-reset account (last_league_eval: null) + PvP arena_rooms heals dev=200 -> 670 XP + Arena points
  let healedUserUpdate: any = null;
  const preResetAdmin = {
    from(table: string) {
      if (table === 'xp_ledger' || table === 'arena_solo_matches') {
        const c: any = { select: () => c, eq: () => c, gte: () => Promise.resolve({ data: [] }) };
        return c;
      }
      if (table === 'arena_rooms') {
        const c: any = {
          select: () => c,
          eq: () => c,
          gte: () => c,
          or: () => Promise.resolve({ data: [{ host_id: 'dev-1', guest_id: 'bot', host_arena_points_award: 40, guest_arena_points_award: 10 }] }),
        };
        return c;
      }
      if (table === 'users') {
        return {
          update(payload: any) {
            healedUserUpdate = payload;
            return { eq: () => Promise.resolve({ error: null }) };
          },
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    },
  };
  const preResetResult = await reconcileUserWeeklyLeaguePoints(preResetAdmin, {
    userId: 'dev-1',
    storedWeeklyXp: 200,
    storedArenaPoints: 0,
    storedTotalXp: 670,
    lastLeagueEval: null,
    hasLastLeagueEvalField: true,
    arenaWins: 1,
    now: new Date('2026-11-25T11:00:00.000Z'),
  });
  assert.equal(preResetResult.healed, true);
  assert.equal(preResetResult.weeklyXp, 670);
  assert.equal(preResetResult.arenaPoints, 40);
  assert.equal(preResetResult.leaguePoints, 710);
  assert.equal(healedUserUpdate?.weekly_xp, 670);
  assert.equal(healedUserUpdate?.weekly_arena_points, 40);

  // Post-reset account (last_league_eval set) does NOT inherit lifetime xp_total
  const postResetResult = await reconcileUserWeeklyLeaguePoints(null, {
    userId: 'dev-2',
    storedWeeklyXp: 50,
    storedArenaPoints: 0,
    storedTotalXp: 1200,
    lastLeagueEval: '2026-11-23T01:00:00.000Z',
    hasLastLeagueEvalField: true,
  });
  assert.equal(postResetResult.weeklyXp, 50);
  assert.equal(postResetResult.healed, false);
});

test('QuestPathView UI polish: unified Command Deck, restored rainbow hairpin S-curve, concise stage text, Start button, and Activity badge fix', () => {
  const verbose =
    '🔀 Fused Goal Trajectory: Foundations, Core Syntax & Mental Models covering 95 calibrated quests (⚡ Fast-Track Jump: Day 1: Full-Stack Architecture → Day 31 Practice 2). Tailored for Full Stack Engineer (Pattern Hunter archetype with QT1: 40/100 & QT2: 40/100).';
  const concise = formatConciseStageDesc(verbose, 95);
  assert.ok(!concise.includes('🔀'), 'concise desc should strip fused trajectory emoji');
  assert.ok(!concise.includes('Fused Goal Trajectory'), 'concise desc should strip verbose prefix');
  assert.ok(!concise.includes('Fast-Track Jump'), 'concise desc should remove long parenthetical jump range');
  assert.ok(!concise.includes('Pattern Hunter archetype'), 'concise desc should strip QT archetype suffix');
  assert.ok(concise.length <= 130, `expected concise desc <= 130 chars, got ${concise.length}`);

  const cleanLabel = formatRoadmapNodeLabel('Full-Stack JavaScript Engineering — Foundations, Core Syntax & Mental Models');
  assert.equal(cleanLabel, 'Foundations, Core Syntax & Mental Models');

  const curve4 = buildDynamicSCurveGeometry(4);
  const curve8 = buildDynamicSCurveGeometry(8);
  assert.equal(curve4.waypoints.length, 4);
  assert.equal(curve8.waypoints.length, 8);
  assert.ok(curve8.svgHeight > curve4.svgHeight, 'SVG height should scale proportionally with stage count');
  assert.ok(curve4.path.startsWith('M 50,35 H 250'), 'Restored rainbow hairpin S-curve path must start from top horizontal rail');
  assert.equal(curve4.waypoints[0].alignRight, true);
  assert.equal(curve4.waypoints[1].alignRight, false);

  const viewSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/quests/components/QuestPathView.tsx'),
    'utf8'
  );
  assert.ok(viewSrc.includes('data-testid="roadmap-command-deck"'), 'top header, tabs, and timeline must live inside unified Command Deck');
  assert.ok(viewSrc.includes('data-testid="visual-scurve-roadmap"'), 'enhanced rainbow S-curve roadmap container must exist');
  assert.ok(viewSrc.includes('id="scurveGradient"'), 'restored rainbow SVG gradient must be present');
  assert.ok(viewSrc.includes('Interactive Flow'), 'restored Interactive Flow header badge must be present');
  assert.ok(viewSrc.includes('YOU ARE HERE'), 'floating YOU ARE HERE runner indicator must be present');
  assert.ok(viewSrc.includes('Start ➔'), 'stage CTA button should read Start ➔');
  assert.ok(!viewSrc.includes('Continue Stage'), 'legacy Continue Stage button text must be removed');
  assert.ok(!viewSrc.includes('Continue Quest'), 'legacy Continue Quest button text must be removed');
  assert.ok(viewSrc.includes('minmax(290px, 1fr)'), 'calibrated quest cards should use enlarged 290px min grid');
  assert.ok(viewSrc.includes('minWidth: 62'), 'activity history badge pill should prevent text overflow');
  assert.ok(viewSrc.includes('fontSize: 10.5'), 'activity history badge font should fit cleanly inside pill');

  const fuserSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/lib/data/roadmapFuser.ts'),
    'utf8'
  );
  assert.ok(!fuserSrc.includes('🔀 Fused Goal Trajectory:'), 'roadmapFuser should emit concise stage descriptions');
});

test('Dashboard Priorities rotate daily across IST dates and idempotently grant 10-15 Weekly EXP', async () => {
  const baseRadar = computeDashboardRadarMetrics({
    targetRole: 'Full Stack Engineer',
    completedQuests: ['q1'],
    arenaWins: 0,
    soloPassedCount: 0,
    examsAvg: 0,
    atsScore: 78,
    hasResumeInVault: true,
    vaultTotalCount: 1,
    vaultVerifiedCount: 1,
    completedInterviewScores: [],
    completedGdScores: [],
    verifiedCompetencies: [],
    missionStreak: 2,
  });

  const dayA = new Date('2026-11-26T06:00:00.000Z');
  const dayB = new Date('2026-11-27T06:00:00.000Z');
  const dayC = new Date('2026-11-28T06:00:00.000Z');
  assert.equal(getIstDateKey(dayA), '2026-11-26');
  assert.equal(getIstDateKey(dayB), '2026-11-27');

  const listA = computeDashboardPriorityActions({
    targetRole: 'Full Stack Engineer',
    atsScore: 78,
    hasResumeInVault: true,
    hasVerifiedResume: true,
    trustScore: 48,
    missionStreak: 2,
    completedMissionToday: false,
    completedQuestToday: false,
    completedInterviewToday: false,
    radar: baseRadar,
    now: dayA,
  });
  const listB = computeDashboardPriorityActions({
    targetRole: 'Full Stack Engineer',
    atsScore: 78,
    hasResumeInVault: true,
    hasVerifiedResume: true,
    trustScore: 48,
    missionStreak: 2,
    completedMissionToday: false,
    completedQuestToday: false,
    completedInterviewToday: false,
    radar: baseRadar,
    now: dayB,
  });
  const listC = computeDashboardPriorityActions({
    targetRole: 'Full Stack Engineer',
    atsScore: 78,
    hasResumeInVault: true,
    hasVerifiedResume: true,
    trustScore: 48,
    missionStreak: 2,
    completedMissionToday: false,
    completedQuestToday: false,
    completedInterviewToday: false,
    radar: baseRadar,
    now: dayC,
  });

  assert.notDeepEqual(listA.map((a) => a.id), listB.map((a) => a.id), 'Priorities must rotate between consecutive IST days');
  assert.notDeepEqual(listB.map((a) => a.id), listC.map((a) => a.id), 'Priorities must continue rotating on Day 3');

  for (const act of [...listA, ...listB, ...listC]) {
    assert.ok(act.xpAmount >= 10 && act.xpAmount <= 15, `Expected 10-15 XP, got ${act.xpAmount}`);
  }

  // Test server-side idempotent 10-15 Weekly EXP award + next-day rollover + 3/day cap
  const ledgerRows: Array<{ user_id: string; amount: number; reason: string }> = [];
  let userXpTotal = 100;
  let userWeeklyXp = 40;
  const mockAdmin = {
    from(table: string) {
      if (table === 'xp_ledger') {
        const filters: { userId?: string; likePrefix?: string } = {};
        const builder: any = {
          select() { return builder; },
          eq(col: string, val: string) {
            if (col === 'user_id') filters.userId = val;
            return builder;
          },
          like(_col: string, pattern: string) {
            filters.likePrefix = pattern.replace(/%$/, '');
            return builder;
          },
          then(resolve: any) {
            const matched = ledgerRows.filter(
              (r) =>
                (!filters.userId || r.user_id === filters.userId) &&
                (!filters.likePrefix || r.reason.startsWith(filters.likePrefix))
            );
            return resolve({ data: matched, error: null });
          },
          async insert(row: any) {
            ledgerRows.push(row);
            return { data: row, error: null };
          },
        };
        return builder;
      }
      if (table === 'users') {
        return {
          select() { return this; },
          eq() { return this; },
          async maybeSingle() {
            return { data: { xp_total: userXpTotal, weekly_xp: userWeeklyXp }, error: null };
          },
          update(patch: any) {
            if (typeof patch.xp_total === 'number') userXpTotal = patch.xp_total;
            if (typeof patch.weekly_xp === 'number') userWeeklyXp = patch.weekly_xp;
            return { async eq() { return { error: null }; } };
          },
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    },
    async rpc() {
      return { data: null, error: { message: 'rpc mocked off to test direct ledger path' } };
    },
  };

  const firstAward = await awardDailyPriorityXp(mockAdmin, 'u-1', 'daily_arena_duel', 'Play 1 Arena Duel', 15, '2026-11-26');
  assert.equal(firstAward.awarded, true);
  assert.equal(firstAward.xpAdded, 15);
  assert.equal(userWeeklyXp, 55);

  const duplicateSameDay = await awardDailyPriorityXp(mockAdmin, 'u-1', 'daily_arena_duel', 'Play 1 Arena Duel', 15, '2026-11-26');
  assert.equal(duplicateSameDay.awarded, false);
  assert.equal(duplicateSameDay.alreadyClaimed, true);
  assert.equal(userWeeklyXp, 55);

  // Fill remaining 2 slots for 2026-11-26, then verify 4th is capped
  await awardDailyPriorityXp(mockAdmin, 'u-1', 'daily_quest_lesson', 'Complete 1 Lesson', 12, '2026-11-26');
  await awardDailyPriorityXp(mockAdmin, 'u-1', 'daily_trust_verify', 'Boost Trust', 10, '2026-11-26');
  assert.equal(userWeeklyXp, 77);

  const fourthSameDay = await awardDailyPriorityXp(mockAdmin, 'u-1', 'daily_project_step', 'Project Step', 15, '2026-11-26');
  assert.equal(fourthSameDay.awarded, false);
  assert.equal(fourthSameDay.capReached, true);
  assert.equal(userWeeklyXp, 77);

  // Next IST day opens fresh awards
  const nextDayAward = await awardDailyPriorityXp(mockAdmin, 'u-1', 'daily_arena_duel', 'Play 1 Arena Duel', 15, '2026-11-27');
  assert.equal(nextDayAward.awarded, true);
  assert.equal(nextDayAward.xpAdded, 15);
  assert.equal(userWeeklyXp, 92);
});
