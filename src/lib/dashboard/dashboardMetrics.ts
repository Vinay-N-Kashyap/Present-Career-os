export type RadarAxisKey = 'coding' | 'arch' | 'data' | 'socratic' | 'iot';

export interface RadarAxisMetric {
  key: RadarAxisKey;
  label: string;
  plainLabel: string;
  score: number;
  level: 'Not Started' | 'Developing' | 'Proficient' | 'Job-Ready';
  evidenceSummary: string;
  nextActionLabel: string;
  nextActionHref: string;
}

export interface RadarMetricsSummary {
  overallScore: number;
  strongestAxis: RadarAxisKey;
  weakestAxis: RadarAxisKey;
  axes: RadarAxisMetric[];
}

export const PRIORITY_XP_MIN = 10;
export const PRIORITY_XP_MAX = 15;
export const MAX_DAILY_PRIORITY_AWARDS = 3;

export function getIstDateKey(now: Date = new Date()): string {
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffsetMs);
  return ist.toISOString().slice(0, 10);
}

export function buildPriorityXpReason(dayKey: string, priorityId: string): string {
  return `[priority:${dayKey}:${priorityId}]`;
}

export const PRIORITY_CATALOG_XP: Record<string, { title: string; xpAmount: number }> = {
  upload_resume: { title: 'Upload & Audit Resume', xpAmount: 15 },
  daily_quest_lesson: { title: 'Complete 1 Roadmap Lesson', xpAmount: 12 },
  daily_mission_sprint: { title: "Finish Today's Daily Mission", xpAmount: 12 },
  daily_streak_guard: { title: 'Keep Daily Learning Streak Alive', xpAmount: 10 },
  daily_arena_duel: { title: 'Play 1 Coding Arena Duel', xpAmount: 15 },
  daily_mock_interview: { title: 'Complete 1 AI Interview Round', xpAmount: 15 },
  daily_gd_round: { title: 'Join 1 Group Discussion', xpAmount: 12 },
  daily_weakest_skill: { title: 'Target Weakest Skill Axis', xpAmount: 12 },
  daily_trust_verify: { title: 'Boost Trust Quotient', xpAmount: 10 },
  daily_attention_focus: { title: '5-Min Attention Focus Sprint', xpAmount: 10 },
  daily_project_step: { title: 'Advance a Portfolio Project', xpAmount: 15 },
};

export interface ServerPriorityAction {
  id: string;
  icon: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  xp: string;
  xpAmount: number;
  rewardClaimed?: boolean;
  dayKey?: string;
  color: string;
  bg: string;
  border: string;
  completed: boolean;
  completionReason?: string;
  progressPct?: number;
}

export interface RadarEvidenceInput {
  targetRole?: string;
  completedQuests: string[];
  arenaWins: number;
  soloPassedCount: number;
  examsAvg: number;
  atsScore: number;
  hasResumeInVault: boolean;
  vaultTotalCount: number;
  vaultVerifiedCount: number;
  completedInterviewScores: number[];
  completedGdScores: number[];
  verifiedCompetencies: Array<{ competency_id: string; composite_score?: number | null }>;
  missionStreak: number;
}

function getTier(score: number): 'Not Started' | 'Developing' | 'Proficient' | 'Job-Ready' {
  if (score <= 0) return 'Not Started';
  if (score < 45) return 'Developing';
  if (score < 75) return 'Proficient';
  return 'Job-Ready';
}

export function isTodayIst(isoOrDateString: unknown, now: Date = new Date()): boolean {
  if (typeof isoOrDateString !== 'string' || !isoOrDateString.trim()) return false;
  const raw = isoOrDateString.split('|')[0]?.trim();
  const parsed = Date.parse(raw);
  if (!Number.isFinite(parsed)) return false;
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const dIst = new Date(parsed + istOffsetMs);
  const nIst = new Date(now.getTime() + istOffsetMs);
  return (
    dIst.getUTCFullYear() === nIst.getUTCFullYear() &&
    dIst.getUTCMonth() === nIst.getUTCMonth() &&
    dIst.getUTCDate() === nIst.getUTCDate()
  );
}

export function computeDashboardRadarMetrics(input: RadarEvidenceInput): RadarMetricsSummary {
  const quests = input.completedQuests || [];
  const roleLower = (input.targetRole || '').toLowerCase();

  const iotQuests = quests.filter((q) => /^iot[_-]|embedded|hardware|mqtt/i.test(q));
  const dataQuests = quests.filter((q) => /^(sql|data|ai|ml|analytics|dsa-py|prompt|bcom_ana)/i.test(q));
  const archQuests = quests.filter((q) => /(arch|sys|cloud|devops|sre|node-web|fullstack|security|bcom_aud)/i.test(q));
  const codingQuests = quests.filter((q) => !/^iot[_-]/i.test(q));

  const verifiedCount = input.verifiedCompetencies.length;
  const techCompetencies = input.verifiedCompetencies.filter((c) => !/iot|data|ai|comm/i.test(c.competency_id)).length;
  const dataCompetencies = input.verifiedCompetencies.filter((c) => /sql|data|ai|ml/i.test(c.competency_id)).length;
  const iotCompetencies = input.verifiedCompetencies.filter((c) => /iot|emb|edge|net|sec/i.test(c.competency_id)).length;

  // 1. Coding & Algorithms
  const rawCoding =
    codingQuests.length * 6 +
    input.arenaWins * 12 +
    input.soloPassedCount * 10 +
    techCompetencies * 10 +
    (input.examsAvg > 0 ? Math.round(input.examsAvg * 0.25) : 0);
  const codingScore = Math.min(100, Math.max(0, Math.round(rawCoding)));

  // 2. Architecture & Proof (backed by verified vault items, ATS resume structure, arch quests)
  const rawArch =
    archQuests.length * 6 +
    input.vaultVerifiedCount * 18 +
    (input.hasResumeInVault ? 12 : 0) +
    (input.atsScore > 0 ? Math.round(input.atsScore * 0.3) : 0) +
    verifiedCount * 6;
  const archScore = Math.min(100, Math.max(0, Math.round(rawArch)));

  // 3. Data, SQL & AI
  const rawData = dataQuests.length * 10 + dataCompetencies * 14 + (input.examsAvg > 0 && dataQuests.length > 0 ? 10 : 0);
  const dataScore = Math.min(100, Math.max(0, Math.round(rawData)));

  // 4. Socratic (Oral Defense, Mock Interviews & GD):
  // ONLY counts completed interviews/GDs with real score > 0 plus verified Vault oral defenses.
  // Applies a confidence ramp so 1 single session cannot artificially pin Socratic to 100.
  const oralScores = [...input.completedInterviewScores, ...input.completedGdScores].filter(
    (s) => typeof s === 'number' && Number.isFinite(s) && s > 0
  );
  const totalOralProofs = oralScores.length + input.vaultVerifiedCount;
  let socraticScore = 0;
  if (totalOralProofs > 0) {
    const avgOral =
      oralScores.length > 0
        ? oralScores.reduce((sum, v) => sum + v, 0) / oralScores.length
        : 65; // verified oral vault defense baseline
    const confidenceRamp = Math.min(1, totalOralProofs / 3);
    const oralBonus = Math.min(15, input.vaultVerifiedCount * 8);
    socraticScore = Math.min(100, Math.max(0, Math.round(avgOral * confidenceRamp + oralBonus * confidenceRamp)));
  }

  // 5. IoT & Hardware (strictly grounded in actual IoT quests/competencies — never fabricated from SDE score)
  const iotScore = Math.min(100, Math.max(0, Math.round(iotQuests.length * 12 + iotCompetencies * 16)));

  const axes: RadarAxisMetric[] = [
    {
      key: 'coding',
      label: 'Coding',
      plainLabel: 'Coding & Problem Solving',
      score: codingScore,
      level: getTier(codingScore),
      evidenceSummary:
        codingScore > 0
          ? `${codingQuests.length} quest(s), ${input.arenaWins + input.soloPassedCount} Arena win(s)${input.examsAvg > 0 ? `, ${Math.round(input.examsAvg)}% exam avg` : ''}`
          : 'No coding quests or Arena matches cleared yet',
      nextActionLabel: 'Win an Arena Match',
      nextActionHref: '/arena',
    },
    {
      key: 'arch',
      label: 'Arch',
      plainLabel: 'System Design & Proof Vault',
      score: archScore,
      level: getTier(archScore),
      evidenceSummary:
        archScore > 0
          ? `${input.vaultVerifiedCount}/${input.vaultTotalCount} Vault proof(s) verified${input.atsScore > 0 ? `, ATS ${input.atsScore}/100` : ''}`
          : 'Upload & verify a project or resume in Proof Vault',
      nextActionLabel: 'Open Proof Vault',
      nextActionHref: '/vault',
    },
    {
      key: 'data',
      label: 'Data',
      plainLabel: 'Data, SQL & Applied AI',
      score: dataScore,
      level: getTier(dataScore),
      evidenceSummary:
        dataScore > 0
          ? `${dataQuests.length} SQL/Data/AI lesson(s) & ${dataCompetencies} verified skill(s)`
          : 'Complete SQL, Data, or Python AI quests to score here',
      nextActionLabel: 'Practice SQL / AI Quests',
      nextActionHref: '/quests',
    },
    {
      key: 'socratic',
      label: 'Socratic',
      plainLabel: 'Interviews & Verbal Defense',
      score: socraticScore,
      level: getTier(socraticScore),
      evidenceSummary:
        totalOralProofs > 0
          ? `${input.completedInterviewScores.length} scored interview(s), ${input.completedGdScores.length} GD(s), ${input.vaultVerifiedCount} Vault defense(s)`
          : 'No completed scored interviews, GD rounds, or Vault defenses yet',
      nextActionLabel: 'Start AI Interview',
      nextActionHref: '/interview',
    },
    {
      key: 'iot',
      label: 'IoT',
      plainLabel: 'IoT & Embedded Systems',
      score: iotScore,
      level: getTier(iotScore),
      evidenceSummary:
        iotScore > 0
          ? `${iotQuests.length} IoT/embedded module(s) & ${iotCompetencies} hardware skill(s)`
          : roleLower.includes('iot') || roleLower.includes('embedded')
          ? 'Start IoT Embedded Day 1 to build hardware mastery'
          : 'Optional for Web/SDE tracks — 0 IoT quests taken yet',
      nextActionLabel: 'Explore IoT Track',
      nextActionHref: '/quests',
    },
  ];

  const primaryAxes = axes.filter((a) => (a.key === 'iot' ? a.score > 0 || roleLower.includes('iot') : true));
  const overallScore = Math.round(
    primaryAxes.reduce((acc, a) => acc + a.score, 0) / Math.max(1, primaryAxes.length)
  );
  const sortedDesc = [...primaryAxes].sort((a, b) => b.score - a.score);
  const strongestAxis = sortedDesc[0]?.key || 'coding';
  const weakestAxis = sortedDesc[sortedDesc.length - 1]?.key || 'socratic';

  return {
    overallScore,
    strongestAxis,
    weakestAxis,
    axes,
  };
}

export interface PriorityActionInput {
  targetRole?: string;
  atsScore: number;
  hasResumeInVault: boolean;
  hasVerifiedResume: boolean;
  trustScore: number;
  missionStreak: number;
  completedMissionToday: boolean;
  completedQuestToday: boolean;
  completedInterviewToday: boolean;
  playedArenaToday?: boolean;
  completedGdToday?: boolean;
  claimedPriorityIdsToday?: string[];
  now?: Date;
  radar: RadarMetricsSummary;
}

export function computeDashboardPriorityActions(input: PriorityActionInput): ServerPriorityAction[] {
  const roleLabel = input.targetRole?.trim() || 'your target role';
  const dayKey = getIstDateKey(input.now ?? new Date());
  const dayIndex = Math.floor(Date.parse(`${dayKey}T00:00:00Z`) / 86400000);
  const claimedSet = new Set((input.claimedPriorityIdsToday || []).map((id) => String(id).trim()));
  const streakLabel = input.missionStreak > 0 ? `${input.missionStreak}-Day Streak` : 'Daily Streak';

  const makeXpLabel = (xpAmount: number, completed: boolean) =>
    completed ? `+${xpAmount} XP Done` : `+${xpAmount} Weekly XP`;

  // Slot 1: Onboarding resume upload or rotating daily learning habit (10-15 Weekly XP)
  let slot1: ServerPriorityAction;
  if (!input.hasResumeInVault) {
    const claimed = claimedSet.has('upload_resume');
    const xpAmount = PRIORITY_CATALOG_XP.upload_resume.xpAmount;
    slot1 = {
      id: 'upload_resume',
      icon: 'RESUME',
      title: 'Upload & Audit Resume',
      desc: `Upload your PDF resume in Vault to unlock ATS scoring and personalized ${roleLabel} roadmaps.`,
      href: '/vault',
      cta: 'Open Proof Vault',
      xp: makeXpLabel(xpAmount, claimed),
      xpAmount,
      rewardClaimed: claimed,
      dayKey,
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.12)',
      border: 'rgba(99,102,241,0.25)',
      completed: claimed,
      progressPct: claimed ? 100 : 0,
    };
  } else {
    const s1Variant = ((dayIndex % 3) + 3) % 3;
    if (s1Variant === 0) {
      const done = Boolean(input.completedQuestToday || claimedSet.has('daily_quest_lesson'));
      const claimed = claimedSet.has('daily_quest_lesson');
      const xpAmount = PRIORITY_CATALOG_XP.daily_quest_lesson.xpAmount;
      slot1 = {
        id: 'daily_quest_lesson',
        icon: 'QUEST',
        title: 'Complete 1 Roadmap Lesson',
        desc: `Clear today's focused lesson module in your ${roleLabel} track to earn +${xpAmount} Weekly EXP.`,
        href: '/quests',
        cta: 'Open Quests',
        xp: makeXpLabel(xpAmount, done),
        xpAmount,
        rewardClaimed: claimed,
        dayKey,
        color: '#10b981',
        bg: 'rgba(16,185,129,0.12)',
        border: 'rgba(16,185,129,0.28)',
        completed: done,
        completionReason: done ? 'Completed today' : undefined,
        progressPct: done ? 100 : 0,
      };
    } else if (s1Variant === 1) {
      const done = Boolean(input.completedMissionToday || claimedSet.has('daily_mission_sprint'));
      const claimed = claimedSet.has('daily_mission_sprint');
      const xpAmount = PRIORITY_CATALOG_XP.daily_mission_sprint.xpAmount;
      slot1 = {
        id: 'daily_mission_sprint',
        icon: 'SPRINT',
        title: "Finish Today's Daily Mission",
        desc: `Knock out a 15-minute mission briefing today to earn +${xpAmount} Weekly EXP toward your league.`,
        href: '/missions',
        cta: 'Launch Mission',
        xp: makeXpLabel(xpAmount, done),
        xpAmount,
        rewardClaimed: claimed,
        dayKey,
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.12)',
        border: 'rgba(245,158,11,0.28)',
        completed: done,
        completionReason: done ? 'Completed today' : undefined,
        progressPct: done ? 100 : 0,
      };
    } else {
      const done = Boolean(input.completedMissionToday || input.completedQuestToday || claimedSet.has('daily_streak_guard'));
      const claimed = claimedSet.has('daily_streak_guard');
      const xpAmount = PRIORITY_CATALOG_XP.daily_streak_guard.xpAmount;
      slot1 = {
        id: 'daily_streak_guard',
        icon: 'STREAK',
        title: `Extend ${streakLabel}`,
        desc: `Complete any quest or mission today to protect your consistency record and gain +${xpAmount} Weekly EXP.`,
        href: '/missions',
        cta: 'Protect Streak',
        xp: makeXpLabel(xpAmount, done),
        xpAmount,
        rewardClaimed: claimed,
        dayKey,
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.12)',
        border: 'rgba(245,158,11,0.25)',
        completed: done,
        completionReason: done ? 'Streak secured today' : undefined,
        progressPct: done ? 100 : 0,
      };
    }
  }

  // Slot 2: Daily rotating Arena / Mock Interview / Group Discussion challenge (12-15 Weekly XP)
  const s2Variant = (((dayIndex + 1) % 3) + 3) % 3;
  let slot2: ServerPriorityAction;
  if (s2Variant === 0) {
    const done = Boolean(input.playedArenaToday || claimedSet.has('daily_arena_duel'));
    const claimed = claimedSet.has('daily_arena_duel');
    const xpAmount = PRIORITY_CATALOG_XP.daily_arena_duel.xpAmount;
    slot2 = {
      id: 'daily_arena_duel',
      icon: 'ARENA',
      title: 'Play 1 Coding Arena Duel',
      desc: `Compete in today's timed Arena round to boost League Points and earn +${xpAmount} Weekly EXP.`,
      href: '/arena',
      cta: 'Enter Arena',
      xp: makeXpLabel(xpAmount, done),
      xpAmount,
      rewardClaimed: claimed,
      dayKey,
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.12)',
      border: 'rgba(6,182,212,0.28)',
      completed: done,
      completionReason: done ? 'Duel logged today' : undefined,
      progressPct: done ? 100 : 0,
    };
  } else if (s2Variant === 1) {
    const done = Boolean(input.completedInterviewToday || claimedSet.has('daily_mock_interview'));
    const claimed = claimedSet.has('daily_mock_interview');
    const xpAmount = PRIORITY_CATALOG_XP.daily_mock_interview.xpAmount;
    slot2 = {
      id: 'daily_mock_interview',
      icon: 'MOCK',
      title: 'Complete 1 AI Interview Round',
      desc: `Practice verbal technical answers with Ms. Priya today and earn +${xpAmount} Weekly EXP.`,
      href: '/interview',
      cta: 'Start Interview',
      xp: makeXpLabel(xpAmount, done),
      xpAmount,
      rewardClaimed: claimed,
      dayKey,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.12)',
      border: 'rgba(59,130,246,0.28)',
      completed: done,
      completionReason: done ? 'Interview scored today' : undefined,
      progressPct: done ? 100 : 0,
    };
  } else {
    const done = Boolean(input.completedGdToday || claimedSet.has('daily_gd_round'));
    const claimed = claimedSet.has('daily_gd_round');
    const xpAmount = PRIORITY_CATALOG_XP.daily_gd_round.xpAmount;
    slot2 = {
      id: 'daily_gd_round',
      icon: 'DEBATE',
      title: 'Join 1 Group Discussion',
      desc: `Sharpen structured speaking in today's AI Boardroom debate to gain +${xpAmount} Weekly EXP.`,
      href: '/interview?tab=gd',
      cta: 'Join GD Room',
      xp: makeXpLabel(xpAmount, done),
      xpAmount,
      rewardClaimed: claimed,
      dayKey,
      color: '#14b8a6',
      bg: 'rgba(20,184,166,0.12)',
      border: 'rgba(20,184,166,0.28)',
      completed: done,
      completionReason: done ? 'GD completed today' : undefined,
      progressPct: done ? 100 : 0,
    };
  }

  // Slot 3: Daily rotating Weakest Radar / Trust / Project focus (10-15 Weekly XP)
  const weakestAxisObj = input.radar.axes.find((a) => a.key === input.radar.weakestAxis) || input.radar.axes[0];
  const s3Variant = (((dayIndex + 2) % 3) + 3) % 3;
  let slot3: ServerPriorityAction;
  if (s3Variant === 0) {
    const claimed = claimedSet.has('daily_weakest_skill');
    const axisDone =
      weakestAxisObj?.key === 'socratic'
        ? Boolean(input.completedInterviewToday || input.completedGdToday)
        : weakestAxisObj?.key === 'coding'
          ? Boolean(input.playedArenaToday)
          : weakestAxisObj?.key === 'data'
            ? Boolean(input.completedQuestToday)
            : false;
    const done = Boolean(claimed || axisDone);
    const xpAmount = PRIORITY_CATALOG_XP.daily_weakest_skill.xpAmount;
    slot3 = {
      id: 'daily_weakest_skill',
      icon: (weakestAxisObj?.label || 'SKILL').toUpperCase(),
      title: `Strengthen ${weakestAxisObj?.plainLabel || 'Core Skills'}`,
      desc: `${weakestAxisObj?.label || 'Radar'} is ${weakestAxisObj?.score ?? 0}/100. Practice today for +${xpAmount} Weekly EXP.`,
      href: weakestAxisObj?.nextActionHref || '/quests',
      cta: weakestAxisObj?.nextActionLabel || 'Practice Now',
      xp: makeXpLabel(xpAmount, done),
      xpAmount,
      rewardClaimed: claimed,
      dayKey,
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.12)',
      border: 'rgba(99,102,241,0.25)',
      completed: done,
      completionReason: done ? 'Progress logged today' : undefined,
      progressPct: done ? 100 : weakestAxisObj?.score ?? 0,
    };
  } else if (s3Variant === 1) {
    if (input.trustScore < 85) {
      const done = Boolean(claimedSet.has('daily_trust_verify'));
      const xpAmount = PRIORITY_CATALOG_XP.daily_trust_verify.xpAmount;
      slot3 = {
        id: 'daily_trust_verify',
        icon: 'TRUST',
        title: `Boost Trust Quotient (${Math.round(input.trustScore)})`,
        desc: `Verify a proof or complete an exam step today for +${xpAmount} Weekly EXP.`,
        href: '/vault',
        cta: 'Verify Proof',
        xp: makeXpLabel(xpAmount, done),
        xpAmount,
        rewardClaimed: done,
        dayKey,
        color: '#10b981',
        bg: 'rgba(16,185,129,0.12)',
        border: 'rgba(16,185,129,0.25)',
        completed: done,
        completionReason: done ? 'Completed today' : undefined,
        progressPct: done ? 100 : Math.min(100, Math.round(input.trustScore)),
      };
    } else {
      const done = Boolean(claimedSet.has('daily_attention_focus'));
      const xpAmount = PRIORITY_CATALOG_XP.daily_attention_focus.xpAmount;
      slot3 = {
        id: 'daily_attention_focus',
        icon: 'FOCUS',
        title: '5-Min Attention Focus Sprint',
        desc: `Run a short deep-focus session today to sharpen recall and earn +${xpAmount} Weekly EXP.`,
        href: '/attention',
        cta: 'Start Focus',
        xp: makeXpLabel(xpAmount, done),
        xpAmount,
        rewardClaimed: done,
        dayKey,
        color: '#8b5cf6',
        bg: 'rgba(139,92,246,0.12)',
        border: 'rgba(139,92,246,0.25)',
        completed: done,
        completionReason: done ? 'Completed today' : undefined,
        progressPct: done ? 100 : 0,
      };
    }
  } else {
    const done = Boolean(claimedSet.has('daily_project_step'));
    const xpAmount = PRIORITY_CATALOG_XP.daily_project_step.xpAmount;
    slot3 = {
      id: 'daily_project_step',
      icon: 'BUILD',
      title: 'Advance a Portfolio Project',
      desc: `Ship one build milestone or code check in Projects today for +${xpAmount} Weekly EXP.`,
      href: '/projects',
      cta: 'Open Projects',
      xp: makeXpLabel(xpAmount, done),
      xpAmount,
      rewardClaimed: done,
      dayKey,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.25)',
      completed: done,
      completionReason: done ? 'Completed today' : undefined,
      progressPct: done ? 100 : 0,
    };
  }

  return [slot1, slot2, slot3];
}
