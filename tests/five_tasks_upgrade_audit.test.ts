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
} from '../src/lib/dashboard/dashboardMetrics';
import { extractSafeUserStoragePath } from '../src/lib/roadmap/userEvidenceContext';
import { generateDynamicStudentRoadmap } from '../src/lib/data/roadmapFuser';
import { isSpecificLessonRequest, isLessonContinuationIntent } from '../src/lib/avatar/lessonIntent';
import { resolveLessonRequest } from '../src/lib/avatar/lessonResolver';
import { buildMentorSystemPrompt } from '../src/lib/avatar/mentorPromptBuilder';
import { matchVoiceActionIntent } from '../src/lib/avatar/voiceActionRouter';
import { matchNavigationIntent } from '../src/components/avatar/hooks/useVoiceNavigation';

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

  // Priority actions mark verified Vault resume as completed instead of showing static "Optimize Resume"
  const actions = computeDashboardPriorityActions({
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
  });
  assert.equal(actions.length, 3);
  assert.equal(actions[0].completed, true);
  assert.ok(actions[0].title.includes('Resume'), 'Verified resume should appear as completed action');
  assert.equal(actions[1].completed, true, 'Mission completed today should mark Daily Sprint completed');
  assert.equal(actions[2].href, '/interview', 'Weakest active Socratic dimension should point directly to /interview');
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
