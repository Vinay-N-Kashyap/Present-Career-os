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

export interface ServerPriorityAction {
  id: string;
  icon: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  xp: string;
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
  radar: RadarMetricsSummary;
}

export function computeDashboardPriorityActions(input: PriorityActionInput): ServerPriorityAction[] {
  const roleLabel = input.targetRole?.trim() || 'your target role';
  const resumeDone = input.hasVerifiedResume || (input.hasResumeInVault && input.atsScore >= 70);

  // Action 1: Resume / Proof Vault verification state (always reflects real Vault state!)
  const resumeAction: ServerPriorityAction = resumeDone
    ? {
        id: 'resume_verified',
        icon: 'VAULT',
        title: 'Resume Uploaded & Scored',
        desc: `Vault resume is synced (${input.atsScore > 0 ? `ATS ${input.atsScore}/100` : 'Verified'}). Keep skills updated or generate your custom roadmap.`,
        href: '/quests?tab=custom',
        cta: 'View Custom Roadmap',
        xp: 'Done',
        color: '#10b981',
        bg: 'rgba(16,185,129,0.12)',
        border: 'rgba(16,185,129,0.28)',
        completed: true,
        completionReason: input.hasVerifiedResume ? 'Verified in Vault' : `ATS ${input.atsScore}/100`,
        progressPct: 100,
      }
    : input.hasResumeInVault
    ? {
        id: 'verify_resume',
        icon: 'VAULT',
        title: 'Verify Your Resume in Oral Defense',
        desc: `Your resume is in Proof Vault. Pass a quick Ms. Priya oral check to unlock Verified status for ${roleLabel}.`,
        href: '/interview?mode=vault_verify',
        cta: 'Verify Proof',
        xp: '+50 XP',
        color: '#6366f1',
        bg: 'rgba(99,102,241,0.12)',
        border: 'rgba(99,102,241,0.25)',
        completed: false,
        completionReason: input.atsScore > 0 ? `ATS ${input.atsScore}/100 • Unverified` : 'Uploaded • Needs Oral Defense',
        progressPct: 50,
      }
    : {
        id: 'upload_resume',
        icon: 'RESUME',
        title: 'Upload & Audit Resume',
        desc: `Upload your PDF resume in Vault to unlock ATS scoring and personalized ${roleLabel} roadmaps.`,
        href: '/vault',
        cta: 'Open Proof Vault',
        xp: '+50 XP',
        color: '#6366f1',
        bg: 'rgba(99,102,241,0.12)',
        border: 'rgba(99,102,241,0.25)',
        completed: false,
        progressPct: 0,
      };

  // Action 2: Today's Sprint / Learning Consistency (checked strictly against IST today)
  const sprintDoneToday = input.completedMissionToday || input.completedQuestToday;
  const streakLabel = input.missionStreak > 0 ? `${input.missionStreak}-Day Streak` : 'Daily Sprint';
  const dailySprintAction: ServerPriorityAction = sprintDoneToday
    ? {
        id: 'daily_sprint',
        icon: 'STREAK',
        title: `${streakLabel} Secured Today`,
        desc: `You completed today's learning sprint. Keep pushing to climb this week's League standings.`,
        href: '/missions',
        cta: 'View Missions',
        xp: 'Done',
        color: '#10b981',
        bg: 'rgba(16,185,129,0.12)',
        border: 'rgba(16,185,129,0.28)',
        completed: true,
        completionReason: 'Completed today',
        progressPct: 100,
      }
    : {
        id: 'daily_sprint',
        icon: 'STREAK',
        title: input.missionStreak > 0 ? `Extend ${input.missionStreak}-Day Streak` : 'Start Daily Sprint',
        desc: `Finish 1 quest or daily mission today to earn Weekly EXP and extend your streak.`,
        href: '/missions',
        cta: 'Launch Mission',
        xp: '+35 XP',
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.12)',
        border: 'rgba(245,158,11,0.25)',
        completed: false,
        progressPct: 0,
      };

  // Action 3: Weakest Radar Dimension / Interview & Trust Action
  const weakestAxisObj = input.radar.axes.find((a) => a.key === input.radar.weakestAxis) || input.radar.axes[0];
  let growthAction: ServerPriorityAction;
  if (input.completedInterviewToday) {
    growthAction = {
      id: 'interview_today',
      icon: 'MOCK',
      title: 'Mock Interview Completed Today',
      desc: `Today's verbal evaluation is recorded. Check your Socratic radar breakdown to review feedback.`,
      href: '/interview',
      cta: 'Review Sessions',
      xp: 'Done',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.28)',
      completed: true,
      completionReason: 'Scored today',
      progressPct: 100,
    };
  } else if (weakestAxisObj && weakestAxisObj.key === 'socratic') {
    growthAction = {
      id: 'boost_socratic',
      icon: 'MOCK',
      title: 'Raise Interview Readiness',
      desc: `Socratic score is ${weakestAxisObj.score}/100. Complete a scored AI Interview or Group Discussion.`,
      href: '/interview',
      cta: 'Start Interview',
      xp: '+75 XP',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.12)',
      border: 'rgba(59,130,246,0.25)',
      completed: false,
      progressPct: weakestAxisObj.score,
    };
  } else if (weakestAxisObj && weakestAxisObj.key === 'coding') {
    growthAction = {
      id: 'boost_coding',
      icon: 'ARENA',
      title: 'Raise Coding & Arena Score',
      desc: `Coding radar is ${weakestAxisObj.score}/100. Win an Arena coding duel to earn League Points.`,
      href: '/arena',
      cta: 'Enter Arena',
      xp: '+50 Pts',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.12)',
      border: 'rgba(59,130,246,0.25)',
      completed: false,
      progressPct: weakestAxisObj.score,
    };
  } else if (input.trustScore < 65) {
    growthAction = {
      id: 'boost_trust',
      icon: 'TRUST',
      title: `Boost Trust Quotient (${Math.round(input.trustScore)})`,
      desc: `Pass a proctored exam or verify credentials in Vault to strengthen recruiter confidence.`,
      href: '/vault',
      cta: 'Verify Proof',
      xp: '+40 XP',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.25)',
      completed: false,
      progressPct: Math.min(100, Math.round(input.trustScore)),
    };
  } else {
    growthAction = {
      id: `boost_${weakestAxisObj?.key || 'data'}`,
      icon: (weakestAxisObj?.label || 'SKILL').toUpperCase(),
      title: `Level Up ${weakestAxisObj?.plainLabel || 'Core Skills'}`,
      desc: weakestAxisObj?.evidenceSummary || 'Complete targeted lessons to raise your weakest competency.',
      href: weakestAxisObj?.nextActionHref || '/quests',
      cta: weakestAxisObj?.nextActionLabel || 'Open Quests',
      xp: '+45 XP',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.12)',
      border: 'rgba(59,130,246,0.25)',
      completed: false,
      progressPct: weakestAxisObj?.score ?? 0,
    };
  }

  return [resumeAction, dailySprintAction, growthAction];
}
