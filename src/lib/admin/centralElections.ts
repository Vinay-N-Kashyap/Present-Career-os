/**
 * Central University Student Election & Campus Council Representation Governance Engine
 * Statutory Compliance: Lyngdoh Committee Recommendations (Hon'ble Supreme Court of India Order),
 * Model Code of Conduct (MCC) for University Student Elections & State University Acts.
 *
 * Platform: PinIT Career OS - Campus Administration Platform
 * Zero-Collision Invariant: Pure Branch C administrative governance.
 */

import { createHash } from 'crypto';

export type ElectoralPost =
  | 'PRESIDENT'
  | 'VICE_PRESIDENT'
  | 'GENERAL_SECRETARY'
  | 'JOINT_SECRETARY'
  | 'ACADEMIC_COUNCIL_REP'
  | 'FACULTY_SPORTS_REP';

export type CandidateDegreeLevel = 'UNDERGRADUATE' | 'POSTGRADUATE' | 'RESEARCH_SCHOLAR';

export type ElectionStage =
  | 'NOTIFICATION_ISSUED'
  | 'NOMINATIONS_OPEN'
  | 'SCRUTINY_COMPLETED'
  | 'CAMPAIGN_PERIOD'
  | 'POLLING_ACTIVE'
  | 'RESULTS_DECLARED'
  | 'ELECTION_COUNTERMANDED';

export interface ElectionCandidate {
  candidateId: string;
  studentId: string;
  fullName: string;
  enrollmentNumber: string;
  department: string;
  degreeLevel: CandidateDegreeLevel;
  ageYears: number;
  attendancePercentage: number;
  academicBacklogs: number;
  hasDisciplinaryAction: boolean;
  campaignExpenditureInr: number;
  isScrutinyApproved: boolean;
  disqualificationReason?: string;
  votesReceived: number;
}

export interface ElectionRecord {
  electionId: string;
  certificateToken: string; // ELEC-[YEAR]-[POST]-[HEX6]
  post: ElectoralPost;
  academicYear: string; // e.g. "2026-2027"
  stage: ElectionStage;
  returningOfficerName: string;
  pollingDate: string; // YYYY-MM-DD
  eligibleVoterCount: number;
  totalVotesCast: number;
  rejectedBallotsCount: number;
  candidates: ElectionCandidate[];
  declaredWinnerCandidateId?: string;
  modelCodeViolationsCount: number;
  cryptographicElectionSeal?: string; // SHA-256 seal
  lastUpdated: string;
}

/**
 * Statutory Lyngdoh Committee Constraints:
 * 1. Age limits:
 *    - Undergraduate: 17 to 22 years
 *    - Postgraduate: up to 25 years
 *    - Research Scholar: up to 28 years
 * 2. Academic criteria:
 *    - Minimum attendance >= 75.0%
 *    - No academic backlogs / arrears
 * 3. Conduct criteria:
 *    - Clean disciplinary record (zero penalties / suspensions)
 * 4. Maximum campaign expenditure:
 *    - INR 5,000 per candidate
 */
export const MAX_CAMPAIGN_EXPENDITURE_INR = 5000;
export const MIN_ATTENDANCE_PERCENTAGE = 75.0;

/**
 * Generate unique election certificate token: ELEC-[YEAR]-[POST]-[HEX6]
 */
export function generateElectionToken(post: ElectoralPost, year: number = new Date().getFullYear()): string {
  const cleanPost = post.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'POST';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `ELEC-${year}-${cleanPost}-${randomHex}`;
}

/**
 * Validate candidate eligibility under Lyngdoh Committee Recommendations
 */
export function validateCandidateEligibility(candidate: Omit<ElectionCandidate, 'candidateId' | 'isScrutinyApproved' | 'votesReceived'>): {
  isEligible: boolean;
  disqualificationReason?: string;
} {
  // 1. Age limit check
  if (candidate.degreeLevel === 'UNDERGRADUATE' && (candidate.ageYears < 17 || candidate.ageYears > 22)) {
    return {
      isEligible: false,
      disqualificationReason: `Lyngdoh Age Rule: Undergraduate candidate age (${candidate.ageYears} yrs) must be between 17 and 22.`,
    };
  }
  if (candidate.degreeLevel === 'POSTGRADUATE' && candidate.ageYears > 25) {
    return {
      isEligible: false,
      disqualificationReason: `Lyngdoh Age Rule: Postgraduate candidate age (${candidate.ageYears} yrs) cannot exceed 25 years.`,
    };
  }
  if (candidate.degreeLevel === 'RESEARCH_SCHOLAR' && candidate.ageYears > 28) {
    return {
      isEligible: false,
      disqualificationReason: `Lyngdoh Age Rule: Research Scholar candidate age (${candidate.ageYears} yrs) cannot exceed 28 years.`,
    };
  }

  // 2. Minimum attendance check
  if (candidate.attendancePercentage < MIN_ATTENDANCE_PERCENTAGE) {
    return {
      isEligible: false,
      disqualificationReason: `Lyngdoh Attendance Rule: Candidate attendance (${candidate.attendancePercentage.toFixed(1)}%) is below mandatory ${MIN_ATTENDANCE_PERCENTAGE}%.`,
    };
  }

  // 3. Academic backlogs check
  if (candidate.academicBacklogs > 0) {
    return {
      isEligible: false,
      disqualificationReason: `Lyngdoh Academic Rule: Candidate has ${candidate.academicBacklogs} unresolved backlogs/arrears.`,
    };
  }

  // 4. Disciplinary action check
  if (candidate.hasDisciplinaryAction) {
    return {
      isEligible: false,
      disqualificationReason: 'Lyngdoh Conduct Rule: Candidate has prior disciplinary actions/reprimands on record.',
    };
  }

  return { isEligible: true };
}

/**
 * Audit campaign expenditure against statutory INR 5,000 ceiling
 */
export function auditCampaignExpenditure(candidate: ElectionCandidate, additionalExpenseInr: number): {
  approved: boolean;
  totalExpenditureInr: number;
  reason?: string;
} {
  const projectedTotal = candidate.campaignExpenditureInr + additionalExpenseInr;
  if (projectedTotal > MAX_CAMPAIGN_EXPENDITURE_INR) {
    return {
      approved: false,
      totalExpenditureInr: candidate.campaignExpenditureInr,
      reason: `Lyngdoh Expenditure Ceiling: Expense exceeds ₹${MAX_CAMPAIGN_EXPENDITURE_INR} limit (projected: ₹${projectedTotal}).`,
    };
  }

  return {
    approved: true,
    totalExpenditureInr: projectedTotal,
  };
}

/**
 * Generate tamper-proof SHA-256 seal for election record
 */
export function generateElectionSeal(
  election: Omit<ElectionRecord, 'cryptographicElectionSeal'>
): string {
  const canonicalPayload = [
    election.electionId,
    election.certificateToken,
    election.post,
    election.academicYear,
    election.stage,
    election.returningOfficerName,
    election.eligibleVoterCount,
    election.totalVotesCast,
    election.rejectedBallotsCount,
    election.candidates.length,
    election.declaredWinnerCandidateId || 'NO_WINNER',
    election.modelCodeViolationsCount,
    election.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Initialize a new campus student council election notification
 */
export function initializeElectionNotification(params: {
  post: ElectoralPost;
  academicYear: string;
  returningOfficerName: string;
  pollingDate: string;
  eligibleVoterCount: number;
}): ElectionRecord {
  if (params.eligibleVoterCount <= 0) {
    throw new Error('Eligible voter count must be greater than 0.');
  }

  if (!params.returningOfficerName.trim()) {
    throw new Error('Returning Officer must be officially designated by University Administration.');
  }

  const certificateToken = generateElectionToken(params.post);
  const now = new Date().toISOString();

  const baseRecord: Omit<ElectionRecord, 'cryptographicElectionSeal'> = {
    electionId: `ELEC-${Date.now().toString(36).toUpperCase()}`,
    certificateToken,
    post: params.post,
    academicYear: params.academicYear,
    stage: 'NOTIFICATION_ISSUED',
    returningOfficerName: params.returningOfficerName.trim(),
    pollingDate: params.pollingDate,
    eligibleVoterCount: params.eligibleVoterCount,
    totalVotesCast: 0,
    rejectedBallotsCount: 0,
    candidates: [],
    modelCodeViolationsCount: 0,
    lastUpdated: now,
  };

  const cryptographicElectionSeal = generateElectionSeal(baseRecord);
  return { ...baseRecord, cryptographicElectionSeal };
}

/**
 * Register candidate nomination and conduct Lyngdoh Committee scrutiny
 */
export function registerCandidateNomination(
  election: ElectionRecord,
  candidateParams: Omit<ElectionCandidate, 'candidateId' | 'isScrutinyApproved' | 'votesReceived' | 'disqualificationReason'>
): ElectionRecord {
  if (election.stage !== 'NOTIFICATION_ISSUED' && election.stage !== 'NOMINATIONS_OPEN') {
    throw new Error(`Nominations closed: Cannot file nomination in stage ${election.stage}.`);
  }

  const candidateId = `CND-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
  const eligibility = validateCandidateEligibility(candidateParams);

  const newCandidate: ElectionCandidate = {
    ...candidateParams,
    candidateId,
    isScrutinyApproved: eligibility.isEligible,
    disqualificationReason: eligibility.disqualificationReason,
    votesReceived: 0,
  };

  const now = new Date().toISOString();
  const updated: Omit<ElectionRecord, 'cryptographicElectionSeal'> = {
    ...election,
    stage: 'NOMINATIONS_OPEN',
    candidates: [...election.candidates, newCandidate],
    lastUpdated: now,
  };

  const cryptographicElectionSeal = generateElectionSeal(updated);
  return { ...updated, cryptographicElectionSeal };
}

/**
 * Finalize scrutiny and publish approved ballot list
 */
export function finalizeCandidateScrutiny(election: ElectionRecord): ElectionRecord {
  const approvedCandidates = election.candidates.filter((c) => c.isScrutinyApproved);
  if (approvedCandidates.length === 0) {
    throw new Error('Cannot finalize scrutiny: Zero candidates met Lyngdoh Committee eligibility criteria.');
  }

  const now = new Date().toISOString();
  const updated: Omit<ElectionRecord, 'cryptographicElectionSeal'> = {
    ...election,
    stage: 'SCRUTINY_COMPLETED',
    lastUpdated: now,
  };

  const cryptographicElectionSeal = generateElectionSeal(updated);
  return { ...updated, cryptographicElectionSeal };
}

/**
 * Record polled ballots and tally vote counts
 */
export function recordPollingResults(
  election: ElectionRecord,
  voteDistribution: { [candidateId: string]: number },
  rejectedBallotsCount: number
): ElectionRecord {
  if (election.stage !== 'SCRUTINY_COMPLETED' && election.stage !== 'CAMPAIGN_PERIOD' && election.stage !== 'POLLING_ACTIVE') {
    throw new Error(`Invalid stage for polling recording: Current stage is ${election.stage}.`);
  }

  let totalValidVotes = 0;
  const updatedCandidates = election.candidates.map((c) => {
    const votes = voteDistribution[c.candidateId] || 0;
    totalValidVotes += votes;
    return {
      ...c,
      votesReceived: votes,
    };
  });

  const totalVotesCast = totalValidVotes + rejectedBallotsCount;
  if (totalVotesCast > election.eligibleVoterCount) {
    throw new Error(`Voter fraud alert: Total votes cast (${totalVotesCast}) exceeds registered eligible voters (${election.eligibleVoterCount}).`);
  }

  const now = new Date().toISOString();
  const updated: Omit<ElectionRecord, 'cryptographicElectionSeal'> = {
    ...election,
    stage: 'POLLING_ACTIVE',
    totalVotesCast,
    rejectedBallotsCount,
    candidates: updatedCandidates,
    lastUpdated: now,
  };

  const cryptographicElectionSeal = generateElectionSeal(updated);
  return { ...updated, cryptographicElectionSeal };
}

/**
 * Certify and declare election winner by Returning Officer
 */
export function certifyElectionResults(election: ElectionRecord): ElectionRecord {
  const validCandidates = election.candidates.filter((c) => c.isScrutinyApproved);
  if (validCandidates.length === 0) {
    throw new Error('Cannot certify results: No approved candidates found.');
  }

  if (election.totalVotesCast === 0) {
    throw new Error('Cannot declare results: Zero votes have been recorded.');
  }

  // Find candidate with highest votes
  const sorted = [...validCandidates].sort((a, b) => b.votesReceived - a.votesReceived);
  const winner = sorted[0];

  const now = new Date().toISOString();
  const updated: Omit<ElectionRecord, 'cryptographicElectionSeal'> = {
    ...election,
    stage: 'RESULTS_DECLARED',
    declaredWinnerCandidateId: winner.candidateId,
    lastUpdated: now,
  };

  const cryptographicElectionSeal = generateElectionSeal(updated);
  return { ...updated, cryptographicElectionSeal };
}

/**
 * Export Student Election Ledger as statutory CSV
 */
export function exportElectionAuditCSV(elections: ElectionRecord[]): string {
  const headers = [
    'Election ID',
    'Tracking Token',
    'Electoral Post',
    'Academic Year',
    'Stage',
    'Returning Officer',
    'Eligible Voters',
    'Votes Cast',
    'Turnout %',
    'Winner Candidate ID',
    'Cryptographic Seal',
  ];

  const rows = elections.map((e) => {
    const turnoutPct = e.eligibleVoterCount > 0 ? ((e.totalVotesCast / e.eligibleVoterCount) * 100).toFixed(2) : '0.00';
    return [
      `"${e.electionId}"`,
      `"${e.certificateToken}"`,
      `"${e.post}"`,
      `"${e.academicYear}"`,
      `"${e.stage}"`,
      `"${e.returningOfficerName.replace(/"/g, '""')}"`,
      e.eligibleVoterCount,
      e.totalVotesCast,
      `${turnoutPct}%`,
      `"${e.declaredWinnerCandidateId || 'N/A'}"`,
      `"${e.cryptographicElectionSeal || ''}"`,
    ];
  });

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Initial demonstration student election datasets
 */
export const INITIAL_ELECTION_RECORDS: ElectionRecord[] = [
  {
    electionId: 'ELEC-2026-001',
    certificateToken: 'ELEC-2026-PRES-8B2A10',
    post: 'PRESIDENT',
    academicYear: '2026-2027',
    stage: 'RESULTS_DECLARED',
    returningOfficerName: 'Prof. Aniruddha Sen (Dean of Student Affairs)',
    pollingDate: '2026-09-15',
    eligibleVoterCount: 4200,
    totalVotesCast: 3450,
    rejectedBallotsCount: 42,
    candidates: [
      {
        candidateId: 'CND-2026-01',
        studentId: 'STU-2023-CS-041',
        fullName: 'Meera Deshmukh',
        enrollmentNumber: '2023CSB041',
        department: 'Computer Science & Engineering',
        degreeLevel: 'UNDERGRADUATE',
        ageYears: 20,
        attendancePercentage: 88.5,
        academicBacklogs: 0,
        hasDisciplinaryAction: false,
        campaignExpenditureInr: 3850,
        isScrutinyApproved: true,
        votesReceived: 1890,
      },
      {
        candidateId: 'CND-2026-02',
        studentId: 'STU-2023-EE-019',
        fullName: 'Kabir Varma',
        enrollmentNumber: '2023EEB019',
        department: 'Electrical Engineering',
        degreeLevel: 'UNDERGRADUATE',
        ageYears: 21,
        attendancePercentage: 82.0,
        academicBacklogs: 0,
        hasDisciplinaryAction: false,
        campaignExpenditureInr: 4600,
        isScrutinyApproved: true,
        votesReceived: 1518,
      },
      {
        candidateId: 'CND-2026-03',
        studentId: 'STU-2022-ME-088',
        fullName: 'Suraj Patil',
        enrollmentNumber: '2022MEB088',
        department: 'Mechanical Engineering',
        degreeLevel: 'UNDERGRADUATE',
        ageYears: 23, // Ineligible under UG <= 22 rule
        attendancePercentage: 71.0, // Ineligible under < 75% rule
        academicBacklogs: 2, // Ineligible under backlog rule
        hasDisciplinaryAction: false,
        campaignExpenditureInr: 0,
        isScrutinyApproved: false,
        disqualificationReason: 'Lyngdoh Age Rule: Undergraduate candidate age (23 yrs) must be between 17 and 22.',
        votesReceived: 0,
      },
    ],
    declaredWinnerCandidateId: 'CND-2026-01',
    modelCodeViolationsCount: 0,
    cryptographicElectionSeal: '8b2a103847291048291847192837482910482918471928374829104829184710',
    lastUpdated: '2026-09-16T18:00:00Z',
  },
  {
    electionId: 'ELEC-2026-002',
    certificateToken: 'ELEC-2026-GENE-4F1C99',
    post: 'GENERAL_SECRETARY',
    academicYear: '2026-2027',
    stage: 'CAMPAIGN_PERIOD',
    returningOfficerName: 'Prof. Aniruddha Sen (Dean of Student Affairs)',
    pollingDate: '2026-09-22',
    eligibleVoterCount: 4200,
    totalVotesCast: 0,
    rejectedBallotsCount: 0,
    candidates: [
      {
        candidateId: 'CND-2026-04',
        studentId: 'STU-2024-MBA-012',
        fullName: 'Rohan Sengupta',
        enrollmentNumber: '2024MBAB012',
        department: 'School of Management Studies',
        degreeLevel: 'POSTGRADUATE',
        ageYears: 24,
        attendancePercentage: 91.0,
        academicBacklogs: 0,
        hasDisciplinaryAction: false,
        campaignExpenditureInr: 2900,
        isScrutinyApproved: true,
        votesReceived: 0,
      },
    ],
    modelCodeViolationsCount: 0,
    cryptographicElectionSeal: '4f1c993847291048291847192837482910482918471928374829104829184711',
    lastUpdated: '2026-09-18T11:00:00Z',
  },
];
