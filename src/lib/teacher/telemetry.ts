/**
 * PinIT Career OS - Live Class Engagement Telemetry & Student Risk Early Warning Radar
 * Module ID: TASK-855
 * Architecture Reference: teach-portal.md & PINIT_ALL_IN_ONE_MASTER_SRS_AND_VISUALS_BIBLE.pdf
 * 
 * Capabilities:
 * - Aggregates multi-source telemetry signals: Attendance, Coding quests, Quiz averages, Communication labs, Assignment submissions, and Inactivity gaps.
 * - Computes multi-factor Student Risk Score (0-100) and categorizes into SAFE, MODERATE, or CRITICAL.
 * - Generates automated early-warning alerts, actionable intervention campaigns, and parent summary triggers.
 * - Computes cohort-wide health distribution telemetry and identifies systemic class-level risk patterns.
 */

export type RiskLevel = 'SAFE' | 'MODERATE' | 'CRITICAL';

export interface StudentTelemetryInput {
  studentRoll: string;
  fullName: string;
  department: string;
  institutionId: string;
  attendancePercentage: number; // 0 - 100
  codingQuestCompletionRate: number; // 0 - 100
  quizAverage: number; // 0 - 100
  communicationLabScore: number; // 0 - 100
  assignmentSubmissionRate: number; // 0 - 100
  daysSinceLastActive: number; // >= 0
}

export interface RiskFactor {
  factor: string;
  severity: 'low' | 'medium' | 'high';
  impact: string;
}

export interface StudentRiskProfile {
  studentRoll: string;
  fullName: string;
  department: string;
  institutionId: string;
  riskScore: number; // 0 to 100 (higher = greater risk of backlog/dropout)
  riskLevel: RiskLevel;
  contributingFactors: RiskFactor[];
  prescriptiveInterventions: string[];
  parentMeetingRecommended: boolean;
  computedAt: string;
}

export interface CohortRiskSummary {
  institutionId: string;
  department?: string;
  totalStudents: number;
  distribution: {
    safe: number;
    moderate: number;
    critical: number;
  };
  criticalRate: number; // percentage
  classHealthScore: number; // 0 - 100 (higher = healthier cohort)
  topSystemicRisks: string[];
}

/**
 * Computes individual Student Risk Score and early warning profile.
 */
export function evaluateStudentRisk(input: StudentTelemetryInput): StudentRiskProfile {
  if (!input.institutionId || !input.studentRoll) {
    throw new Error('Telemetry: institutionId and studentRoll are mandatory.');
  }

  // Normalize inputs safely between bounds
  const attendance = Math.max(0, Math.min(100, input.attendancePercentage || 0));
  const coding = Math.max(0, Math.min(100, input.codingQuestCompletionRate || 0));
  const quiz = Math.max(0, Math.min(100, input.quizAverage || 0));
  const comm = Math.max(0, Math.min(100, input.communicationLabScore || 0));
  const assignments = Math.max(0, Math.min(100, input.assignmentSubmissionRate || 0));
  const inactiveDays = Math.max(0, input.daysSinceLastActive || 0);

  let rawRisk = 0;
  const contributingFactors: RiskFactor[] = [];
  const interventions: string[] = [];

  // 1. Attendance Telemetry (30% weight)
  // Standard campus regulatory threshold: 75% attendance
  if (attendance < 60) {
    rawRisk += 30;
    contributingFactors.push({
      factor: 'Severe Attendance Deficit',
      severity: 'high',
      impact: `Current attendance is ${attendance.toFixed(1)}% (regulatory threshold: 75%). High risk of exam debarment.`,
    });
    interventions.push('Initiate automated attendance recovery counseling.');
  } else if (attendance < 75) {
    rawRisk += 18;
    contributingFactors.push({
      factor: 'Borderline Attendance',
      severity: 'medium',
      impact: `Current attendance is ${attendance.toFixed(1)}%. Approaching debarment limit.`,
    });
    interventions.push('Issue attendance warning notification to student.');
  }

  // 2. Coding Quests & Practical Labs (25% weight)
  if (coding < 40) {
    rawRisk += 25;
    contributingFactors.push({
      factor: 'Critical Practical Lab Deficit',
      severity: 'high',
      impact: `Coding quest completion at ${coding.toFixed(1)}%. Student failing practical competencies.`,
    });
    interventions.push('Assign peer-tutoring lab buddy and foundational coding sandboxes.');
  } else if (coding < 65) {
    rawRisk += 12;
    contributingFactors.push({
      factor: 'Lagging Practical Submissions',
      severity: 'medium',
      impact: `Coding completion at ${coding.toFixed(1)}%. Behind syllabus milestone pace.`,
    });
  }

  // 3. Assignment Submission Rate (20% weight)
  if (assignments < 50) {
    rawRisk += 20;
    contributingFactors.push({
      factor: 'Missing Assignments',
      severity: 'high',
      impact: `Assignment completion rate is ${assignments.toFixed(1)}%. Continuous assessment marks severely impacted.`,
    });
    interventions.push('Grant 48-hour makeup window for overdue assignments.');
  } else if (assignments < 70) {
    rawRisk += 10;
    contributingFactors.push({
      factor: 'Incomplete Continuous Assessments',
      severity: 'medium',
      impact: `Assignment completion at ${assignments.toFixed(1)}%.`,
    });
  }

  // 4. Quiz / Academic Assessments (15% weight)
  if (quiz < 45) {
    rawRisk += 15;
    contributingFactors.push({
      factor: 'Internal Test Failure',
      severity: 'high',
      impact: `Internal quiz average is ${quiz.toFixed(1)}%. Concept retention failure detected.`,
    });
    interventions.push('Trigger Socratic AI Tutor diagnostic review quest.');
  } else if (quiz < 60) {
    rawRisk += 8;
    contributingFactors.push({
      factor: 'Sub-Par Quiz Retention',
      severity: 'medium',
      impact: `Quiz average is ${quiz.toFixed(1)}%.`,
    });
  }

  // 5. Inactivity Gap Penalty (10% weight)
  if (inactiveDays >= 14) {
    rawRisk += 10;
    contributingFactors.push({
      factor: 'Extended Inactivity Dropout Risk',
      severity: 'high',
      impact: `No LMS engagement for ${inactiveDays} consecutive days.`,
    });
    interventions.push('Conduct faculty welfare phone check.');
  } else if (inactiveDays >= 7) {
    rawRisk += 5;
    contributingFactors.push({
      factor: 'Engagement Drop',
      severity: 'medium',
      impact: `Inactive for ${inactiveDays} days.`,
    });
  }

  const finalRiskScore = Math.min(100, Math.round(rawRisk));

  let riskLevel: RiskLevel = 'SAFE';
  let parentMeetingRecommended = false;

  if (finalRiskScore >= 70) {
    riskLevel = 'CRITICAL';
    parentMeetingRecommended = true;
    interventions.unshift('Urgent: Schedule Dean/HOD parent intervention conference.');
  } else if (finalRiskScore >= 40) {
    riskLevel = 'MODERATE';
    if (attendance < 65 || inactiveDays >= 10) {
      parentMeetingRecommended = true;
    }
  }

  return {
    studentRoll: input.studentRoll,
    fullName: input.fullName,
    department: input.department,
    institutionId: input.institutionId,
    riskScore: finalRiskScore,
    riskLevel,
    contributingFactors,
    prescriptiveInterventions: interventions,
    parentMeetingRecommended,
    computedAt: new Date().toISOString(),
  };
}

/**
 * Aggregates cohort telemetry into institutional health telemetry.
 */
export function analyzeCohortTelemetry(
  institutionId: string,
  students: StudentTelemetryInput[],
  department?: string
): CohortRiskSummary {
  const filtered = department
    ? students.filter((s) => s.department.toUpperCase() === department.toUpperCase())
    : students;

  if (filtered.length === 0) {
    return {
      institutionId,
      department,
      totalStudents: 0,
      distribution: { safe: 0, moderate: 0, critical: 0 },
      criticalRate: 0,
      classHealthScore: 100,
      topSystemicRisks: [],
    };
  }

  const evaluations = filtered.map(evaluateStudentRisk);

  let safe = 0;
  let moderate = 0;
  let critical = 0;
  let totalRiskScore = 0;
  const factorFrequencies: Record<string, number> = {};

  for (const ev of evaluations) {
    totalRiskScore += ev.riskScore;
    if (ev.riskLevel === 'SAFE') safe++;
    else if (ev.riskLevel === 'MODERATE') moderate++;
    else if (ev.riskLevel === 'CRITICAL') critical++;

    for (const f of ev.contributingFactors) {
      factorFrequencies[f.factor] = (factorFrequencies[f.factor] || 0) + 1;
    }
  }

  const criticalRate = Math.round((critical / filtered.length) * 10000) / 100;
  const avgRisk = totalRiskScore / filtered.length;
  const classHealthScore = Math.max(0, Math.min(100, Math.round(100 - avgRisk)));

  const topSystemicRisks = Object.entries(factorFrequencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([factor, count]) => `${factor} (${count} students affected)`);

  return {
    institutionId,
    department,
    totalStudents: filtered.length,
    distribution: { safe, moderate, critical },
    criticalRate,
    classHealthScore,
    topSystemicRisks,
  };
}
