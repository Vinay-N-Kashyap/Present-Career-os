/**
 * Central University Sports Quota & Inter-University Tournament Governance Engine
 * Statutory Compliance: Association of Indian Universities (AIU) Inter-University Sports Board,
 * National Sports Development Code of India & University Sports Quota Admission Regulations.
 *
 * Platform: PinIT Career OS - Campus Administration Platform
 * Zero-Collision Invariant: Pure Branch C administrative governance.
 */

import { createHash } from 'crypto';

export type SportsDiscipline =
  | 'ATHLETICS'
  | 'BASKETBALL'
  | 'BADMINTON'
  | 'CRICKET'
  | 'FOOTBALL'
  | 'SWIMMING'
  | 'TABLE_TENNIS'
  | 'VOLLEYBALL'
  | 'CHESS';

export type SportsAchievementTier =
  | 'TIER_1_INTERNATIONAL'       // Olympics, Asian Games, World University Games (Grade A+, 100 pts)
  | 'TIER_2_ALL_INDIA_AIU'       // All India Inter-University / Sr National Medalist (Grade A, 85 pts)
  | 'TIER_3_ZONAL_INTER_UNIV'    // Zonal Inter-University / State Champion (Grade B, 65 pts)
  | 'TIER_4_INTER_COLLEGIATE';   // Inter-Collegiate / District Winner (Grade C, 45 pts)

export type QuotaAdmissionStage =
  | 'APPLICATION_FILED'
  | 'CERTIFICATES_SCRUTINIZED'
  | 'FITNESS_TRIALS_COMPLETED'
  | 'MERIT_SEAT_OFFERED'
  | 'ADMISSION_CONFIRMED'
  | 'APPLICATION_REJECTED';

export interface PhysicalFitnessTrialMetrics {
  sprint50mSeconds: number;       // e.g. 6.8s
  standingBroadJumpMeters: number; // e.g. 2.45m
  enduranceRun1000mMinutes: number; // e.g. 3.4m
  skillTrialScore: number;        // 0 to 50
  fitnessTrialScore: number;      // 0 to 50
  totalTrialScore: number;        // 0 to 100
  isTrialQualified: boolean;      // total >= 50
}

export interface SportsQuotaApplicant {
  applicantId: string;
  trackingToken: string; // SPRT-[YEAR]-[DISC]-[HEX6]
  fullName: string;
  enrollmentOrAppNo: string;
  sportsDiscipline: SportsDiscipline;
  achievementTier: SportsAchievementTier;
  highestTournamentName: string;
  certificateIssuingAuthority: string;
  certificateYear: number;
  departmentApplied: string;
  baseAchievementPoints: number;
  trialMetrics?: PhysicalFitnessTrialMetrics;
  compositeSportsMeritScore: number; // base (50%) + trials (50%)
  stage: QuotaAdmissionStage;
  sportsScholarshipAwardedInr: number;
  disqualificationReason?: string;
  cryptographicSeal?: string; // SHA-256 seal
  lastUpdated: string;
}

/**
 * Standard AIU / Ministry of Youth Affairs Achievement Point Matrix (out of 100):
 * - Tier 1 International: 100 points
 * - Tier 2 All India AIU / Senior National: 85 points
 * - Tier 3 Zonal Inter-University / State: 65 points
 * - Tier 4 Inter-Collegiate / District: 45 points
 */
export const SPORTS_TIER_POINTS_MATRIX: Record<SportsAchievementTier, number> = {
  TIER_1_INTERNATIONAL: 100,
  TIER_2_ALL_INDIA_AIU: 85,
  TIER_3_ZONAL_INTER_UNIV: 65,
  TIER_4_INTER_COLLEGIATE: 45,
};

/**
 * Statutory 5% Supernumerary Sports Quota Ceiling
 */
export const MAX_SPORTS_QUOTA_PERCENTAGE = 5.0;
export const MIN_TRIAL_QUALIFYING_SCORE = 50.0;

/**
 * Generate unique sports quota tracking token: SPRT-[YEAR]-[DISC]-[HEX6]
 */
export function generateSportsToken(discipline: SportsDiscipline, year: number = new Date().getFullYear()): string {
  const cleanDisc = discipline.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'SPRT';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `SPRT-${year}-${cleanDisc}-${randomHex}`;
}

/**
 * Calculate composite sports merit score:
 * Base achievement points (weight 50%) + Physical fitness & skill trial score (weight 50%)
 */
export function calculateCompositeSportsScore(
  baseAchievementPoints: number,
  trialScore: number
): number {
  const weightedBase = baseAchievementPoints * 0.5;
  const weightedTrial = trialScore * 0.5;
  return Number((weightedBase + weightedTrial).toFixed(2));
}

/**
 * Generate tamper-proof SHA-256 seal for sports quota applicant record
 */
export function generateSportsApplicantSeal(
  applicant: Omit<SportsQuotaApplicant, 'cryptographicSeal'>
): string {
  const canonicalPayload = [
    applicant.applicantId,
    applicant.trackingToken,
    applicant.fullName,
    applicant.enrollmentOrAppNo,
    applicant.sportsDiscipline,
    applicant.achievementTier,
    applicant.departmentApplied,
    applicant.compositeSportsMeritScore.toFixed(2),
    applicant.stage,
    applicant.sportsScholarshipAwardedInr,
    applicant.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Register a new sports quota admission application
 */
export function registerSportsApplicant(params: {
  fullName: string;
  enrollmentOrAppNo: string;
  sportsDiscipline: SportsDiscipline;
  achievementTier: SportsAchievementTier;
  highestTournamentName: string;
  certificateIssuingAuthority: string;
  certificateYear: number;
  departmentApplied: string;
}): SportsQuotaApplicant {
  if (!params.fullName.trim()) {
    throw new Error('Applicant full name cannot be blank.');
  }

  if (!params.highestTournamentName.trim()) {
    throw new Error('Tournament name must be specified for sports quota evaluation.');
  }

  const trackingToken = generateSportsToken(params.sportsDiscipline);
  const now = new Date().toISOString();
  const baseAchievementPoints = SPORTS_TIER_POINTS_MATRIX[params.achievementTier];

  const baseRecord: Omit<SportsQuotaApplicant, 'cryptographicSeal'> = {
    applicantId: `SPRT-${Date.now().toString(36).toUpperCase()}`,
    trackingToken,
    fullName: params.fullName.trim(),
    enrollmentOrAppNo: params.enrollmentOrAppNo.trim(),
    sportsDiscipline: params.sportsDiscipline,
    achievementTier: params.achievementTier,
    highestTournamentName: params.highestTournamentName.trim(),
    certificateIssuingAuthority: params.certificateIssuingAuthority.trim(),
    certificateYear: params.certificateYear,
    departmentApplied: params.departmentApplied.trim(),
    baseAchievementPoints,
    compositeSportsMeritScore: Number((baseAchievementPoints * 0.5).toFixed(2)),
    stage: 'APPLICATION_FILED',
    sportsScholarshipAwardedInr: 0,
    lastUpdated: now,
  };

  const cryptographicSeal = generateSportsApplicantSeal(baseRecord);
  return { ...baseRecord, cryptographicSeal };
}

/**
 * Record physical fitness trials & skill test score
 */
export function recordFitnessTrials(
  applicant: SportsQuotaApplicant,
  trialParams: {
    sprint50mSeconds: number;
    standingBroadJumpMeters: number;
    enduranceRun1000mMinutes: number;
    skillTrialScore: number;
    fitnessTrialScore: number;
  }
): SportsQuotaApplicant {
  const totalTrialScore = trialParams.skillTrialScore + trialParams.fitnessTrialScore;
  const isTrialQualified = totalTrialScore >= MIN_TRIAL_QUALIFYING_SCORE;

  const trialMetrics: PhysicalFitnessTrialMetrics = {
    ...trialParams,
    totalTrialScore,
    isTrialQualified,
  };

  const compositeSportsMeritScore = calculateCompositeSportsScore(
    applicant.baseAchievementPoints,
    totalTrialScore
  );

  const now = new Date().toISOString();
  const nextStage: QuotaAdmissionStage = isTrialQualified
    ? 'FITNESS_TRIALS_COMPLETED'
    : 'APPLICATION_REJECTED';

  const disqualificationReason = isTrialQualified
    ? undefined
    : `Trials Unqualified: Total trial score (${totalTrialScore}/100) below statutory hurdle (${MIN_TRIAL_QUALIFYING_SCORE}).`;

  const updated: Omit<SportsQuotaApplicant, 'cryptographicSeal'> = {
    ...applicant,
    trialMetrics,
    compositeSportsMeritScore,
    stage: nextStage,
    disqualificationReason,
    lastUpdated: now,
  };

  const cryptographicSeal = generateSportsApplicantSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Offer supernumerary sports quota admission & scholarship
 */
export function offerSportsQuotaAdmission(
  applicant: SportsQuotaApplicant,
  scholarshipInr: number = 25000
): SportsQuotaApplicant {
  if (applicant.stage !== 'FITNESS_TRIALS_COMPLETED') {
    throw new Error(`Cannot offer admission: Applicant must qualify fitness trials (current: ${applicant.stage}).`);
  }

  const now = new Date().toISOString();
  const updated: Omit<SportsQuotaApplicant, 'cryptographicSeal'> = {
    ...applicant,
    stage: 'MERIT_SEAT_OFFERED',
    sportsScholarshipAwardedInr: scholarshipInr,
    lastUpdated: now,
  };

  const cryptographicSeal = generateSportsApplicantSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Confirm sports quota admission enrollment
 */
export function confirmSportsAdmission(applicant: SportsQuotaApplicant): SportsQuotaApplicant {
  if (applicant.stage !== 'MERIT_SEAT_OFFERED') {
    throw new Error(`Cannot confirm admission: Seat must be offered first (current: ${applicant.stage}).`);
  }

  const now = new Date().toISOString();
  const updated: Omit<SportsQuotaApplicant, 'cryptographicSeal'> = {
    ...applicant,
    stage: 'ADMISSION_CONFIRMED',
    lastUpdated: now,
  };

  const cryptographicSeal = generateSportsApplicantSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Export Sports Quota Ledger as statutory CSV
 */
export function exportSportsQuotaLedgerCSV(applicants: SportsQuotaApplicant[]): string {
  const headers = [
    'Applicant ID',
    'Tracking Token',
    'Full Name',
    'App / Enrollment No',
    'Discipline',
    'Achievement Tier',
    'Tournament Name',
    'Department Applied',
    'Base Points',
    'Trial Score',
    'Composite Merit Score',
    'Stage',
    'Scholarship INR',
    'Cryptographic Seal',
  ];

  const rows = applicants.map((a) => [
    `"${a.applicantId}"`,
    `"${a.trackingToken}"`,
    `"${a.fullName.replace(/"/g, '""')}"`,
    `"${a.enrollmentOrAppNo}"`,
    `"${a.sportsDiscipline}"`,
    `"${a.achievementTier}"`,
    `"${a.highestTournamentName.replace(/"/g, '""')}"`,
    `"${a.departmentApplied.replace(/"/g, '""')}"`,
    a.baseAchievementPoints,
    a.trialMetrics?.totalTrialScore ?? 'N/A',
    a.compositeSportsMeritScore,
    `"${a.stage}"`,
    a.sportsScholarshipAwardedInr,
    `"${a.cryptographicSeal || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Initial demonstration sports quota applicants
 */
export const INITIAL_SPORTS_APPLICANTS: SportsQuotaApplicant[] = [
  {
    applicantId: 'SPRT-2026-001',
    trackingToken: 'SPRT-2026-BASK-9A1C20',
    fullName: 'Rohan Deshmukh',
    enrollmentOrAppNo: 'SPRT-APP-2026-041',
    sportsDiscipline: 'BASKETBALL',
    achievementTier: 'TIER_2_ALL_INDIA_AIU',
    highestTournamentName: 'All India Inter-University Basketball Championship',
    certificateIssuingAuthority: 'Association of Indian Universities (AIU)',
    certificateYear: 2025,
    departmentApplied: 'Computer Science & Engineering',
    baseAchievementPoints: 85,
    trialMetrics: {
      sprint50mSeconds: 6.4,
      standingBroadJumpMeters: 2.65,
      enduranceRun1000mMinutes: 3.2,
      skillTrialScore: 45,
      fitnessTrialScore: 42,
      totalTrialScore: 87,
      isTrialQualified: true,
    },
    compositeSportsMeritScore: 86.0, // (85*0.5) + (87*0.5) = 42.5 + 43.5 = 86.0
    stage: 'ADMISSION_CONFIRMED',
    sportsScholarshipAwardedInr: 50000,
    cryptographicSeal: '9a1c203847291048291847192837482910482918471928374829104829184712',
    lastUpdated: '2026-06-15T11:00:00Z',
  },
  {
    applicantId: 'SPRT-2026-002',
    trackingToken: 'SPRT-2026-SWIM-4B8199',
    fullName: 'Ananya Roy',
    enrollmentOrAppNo: 'SPRT-APP-2026-088',
    sportsDiscipline: 'SWIMMING',
    achievementTier: 'TIER_1_INTERNATIONAL',
    highestTournamentName: 'Asian Youth Games 2025 (100m Freestyle Silver)',
    certificateIssuingAuthority: 'Swimming Federation of India / Olympic Council of Asia',
    certificateYear: 2025,
    departmentApplied: 'School of Management Studies',
    baseAchievementPoints: 100,
    trialMetrics: {
      sprint50mSeconds: 6.1,
      standingBroadJumpMeters: 2.8,
      enduranceRun1000mMinutes: 3.0,
      skillTrialScore: 48,
      fitnessTrialScore: 47,
      totalTrialScore: 95,
      isTrialQualified: true,
    },
    compositeSportsMeritScore: 97.5,
    stage: 'MERIT_SEAT_OFFERED',
    sportsScholarshipAwardedInr: 75000,
    cryptographicSeal: '4b81993847291048291847192837482910482918471928374829104829184715',
    lastUpdated: '2026-06-18T14:30:00Z',
  },
];
