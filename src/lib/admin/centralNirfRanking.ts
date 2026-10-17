/**
 * Central University NIRF & QS World Ranking Telemetry Synthesizer Engine
 * 
 * Statutory & Benchmark Compliance:
 * - Ministry of Education (MoE) National Institutional Ranking Framework (NIRF) Methodology
 * - 5 Core Weighted Dimensions:
 *   1. Teaching, Learning & Resources (TLR - Weight: 0.30)
 *   2. Research and Professional Practice (RPC - Weight: 0.30)
 *   3. Graduation Outcomes (GO - Weight: 0.20)
 *   4. Outreach and Inclusivity (OI - Weight: 0.10)
 *   5. Perception (PR - Weight: 0.10)
 * - QS World University Rankings & Times Higher Education (THE) Telemetry Bridge
 * - Data Capture System (DCS) Public Disclosure Mandate
 * - Cryptographic SHA-256 seal verification on all ranking metric submissions
 */

import { createHash } from 'crypto';

export type NirfRankingCategory =
  | 'OVERALL'
  | 'UNIVERSITIES'
  | 'ENGINEERING'
  | 'MANAGEMENT'
  | 'PHARMACY'
  | 'COLLEGES'
  | 'INNOVATION';

export type DcsSubmissionStatus =
  | 'DRAFT_DATA_COLLECTION'
  | 'INTERNAL_AUDIT_VERIFIED'
  | 'DCS_UPLOADED'
  | 'PUBLIC_DISCLOSURE_HOSTED'
  | 'FINAL_RANK_DECLARED';

export interface TlrMetrics {
  studentStrength: number;
  facultyStudentRatio: number; // Benchmark 1:15 = 15.0
  facultyWithPhdPct: number; // 0 - 100
  financialResourceUtilizationScore: number; // 0 - 100
  tlrScore: number; // 0 - 100
}

export interface RpcMetrics {
  publicationsScopusWos: number;
  citationPerPaper: number;
  iprPatentsGrantedOrPublished: number;
  sponsoredResearchFundingInr: number;
  rpcScore: number; // 0 - 100
}

export interface GoMetrics {
  examPassRatePct: number;
  phdGraduatedAnnualCount: number;
  medianPlacementSalaryLpa: number;
  goScore: number; // 0 - 100
}

export interface OiMetrics {
  otherStatesCountriesPct: number;
  womenStudentsFacultyPct: number;
  economicallyChallengedStudentsPct: number;
  differentlyAbledFacilitiesScore: number; // 0 - 100
  oiScore: number; // 0 - 100
}

export interface PrMetrics {
  academicPeerScore: number; // 0 - 100
  employerFeedbackScore: number; // 0 - 100
  prScore: number; // 0 - 100
}

export interface QsTelemetryBridge {
  qsAcademicReputationScore: number;
  qsEmployerReputationScore: number;
  qsCitationsPerFaculty: number;
  qsInternationalFacultyPct: number;
  qsProjectedRankBand: string;
}

export interface NirfRankingRecord {
  recordId: string;
  rankingYear: number;
  category: NirfRankingCategory;
  institutionName: string;
  tlr: TlrMetrics;
  rpc: RpcMetrics;
  go: GoMetrics;
  oi: OiMetrics;
  pr: PrMetrics;
  compositeScore: number; // 0 - 100
  projectedRankBand: string;
  officialDeclaredRank?: number;
  qsBridge: QsTelemetryBridge;
  status: DcsSubmissionStatus;
  nodalOfficer: string;
  publicDisclosureUrl: string;
  lastAuditDate: string;
  auditSha256: string;
}

// Statutory NIRF Core Weightings
export const NIRF_WEIGHTS = {
  TLR: 0.30,
  RPC: 0.30,
  GO: 0.20,
  OI: 0.10,
  PR: 0.10
} as const;

export const BENCHMARK_FACULTY_STUDENT_RATIO = 15.0; // 1:15

/**
 * Calculate Teaching, Learning & Resources (TLR) Score (0 - 100)
 */
export function calculateTlrScore(metrics: Omit<TlrMetrics, 'tlrScore'>): number {
  // 1. Student Strength (SS): up to 25 pts
  const ssScore = Math.min(25, (metrics.studentStrength / 8000) * 25);

  // 2. Faculty Student Ratio (FSR): up to 30 pts (1:15 benchmark gets 30, scaled down if > 15)
  let fsrScore = 0;
  if (metrics.facultyStudentRatio <= BENCHMARK_FACULTY_STUDENT_RATIO) {
    fsrScore = 30;
  } else {
    fsrScore = Math.max(0, 30 * (BENCHMARK_FACULTY_STUDENT_RATIO / metrics.facultyStudentRatio));
  }

  // 3. Faculty with Ph.D. (FQE): up to 20 pts
  const fqeScore = (metrics.facultyWithPhdPct / 100) * 20;

  // 4. Financial Resource Utilization (FRU): up to 25 pts
  const fruScore = (metrics.financialResourceUtilizationScore / 100) * 25;

  const raw = ssScore + fsrScore + fqeScore + fruScore;
  return Math.min(100, Math.max(0, parseFloat(raw.toFixed(2))));
}

/**
 * Calculate Research and Professional Practice (RPC) Score (0 - 100)
 */
export function calculateRpcScore(metrics: Omit<RpcMetrics, 'rpcScore'>): number {
  // 1. Publications in Scopus/WoS: up to 35 pts (e.g. 1500 publications gets max 35)
  const pubScore = Math.min(35, (metrics.publicationsScopusWos / 1500) * 35);

  // 2. Citation per Paper (Quality): up to 30 pts (e.g. 12+ citations/paper gets 30)
  const citScore = Math.min(30, (metrics.citationPerPaper / 12) * 30);

  // 3. IPR Patents: up to 15 pts (e.g. 30 granted/published patents gets 15)
  const iprScore = Math.min(15, (metrics.iprPatentsGrantedOrPublished / 30) * 15);

  // 4. Sponsored Research & Consultancy Funding: up to 20 pts (₹10 Cr = 10,00,00,000 gets 20)
  const fundScore = Math.min(20, (metrics.sponsoredResearchFundingInr / 100000000) * 20);

  const raw = pubScore + citScore + iprScore + fundScore;
  return Math.min(100, Math.max(0, parseFloat(raw.toFixed(2))));
}

/**
 * Calculate Graduation Outcomes (GO) Score (0 - 100)
 */
export function calculateGoScore(metrics: Omit<GoMetrics, 'goScore'>): number {
  // 1. Exam Pass Rate (GUE): up to 35 pts (100% pass gets 35)
  const gueScore = (metrics.examPassRatePct / 100) * 35;

  // 2. Ph.D. Students Graduated (GPHD): up to 25 pts (150 grads gets 25)
  const gphdScore = Math.min(25, (metrics.phdGraduatedAnnualCount / 150) * 25);

  // 3. Median Placement Salary (GMS): up to 40 pts (16 LPA gets 40)
  const gmsScore = Math.min(40, (metrics.medianPlacementSalaryLpa / 16) * 40);

  const raw = gueScore + gphdScore + gmsScore;
  return Math.min(100, Math.max(0, parseFloat(raw.toFixed(2))));
}

/**
 * Calculate Outreach and Inclusivity (OI) Score (0 - 100)
 */
export function calculateOiScore(metrics: Omit<OiMetrics, 'oiScore'>): number {
  // 1. Regional Diversity (RD - other states/countries): up to 25 pts (50% gets 25)
  const rdScore = Math.min(25, (metrics.otherStatesCountriesPct / 50) * 25);

  // 2. Women Diversity (WD): up to 30 pts (50% parity gets 30)
  const wdScore = Math.min(30, (metrics.womenStudentsFacultyPct / 50) * 30);

  // 3. Economically & Socially Challenged Students (ESCS): up to 25 pts (50% gets 25)
  const escsScore = Math.min(25, (metrics.economicallyChallengedStudentsPct / 50) * 25);

  // 4. Facilities for Physically Challenged Students (PCS): up to 20 pts
  const pcsScore = (metrics.differentlyAbledFacilitiesScore / 100) * 20;

  const raw = rdScore + wdScore + escsScore + pcsScore;
  return Math.min(100, Math.max(0, parseFloat(raw.toFixed(2))));
}

/**
 * Calculate Perception (PR) Score (0 - 100)
 */
export function calculatePrScore(academicPeerScore: number, employerFeedbackScore: number): number {
  const raw = (academicPeerScore * 0.5) + (employerFeedbackScore * 0.5);
  return Math.min(100, Math.max(0, parseFloat(raw.toFixed(2))));
}

/**
 * Formulate Composite NIRF Overall Score
 * NIRF Score = 0.30*TLR + 0.30*RPC + 0.20*GO + 0.10*OI + 0.10*PR
 */
export function calculateNirfCompositeScore(
  tlr: number,
  rpc: number,
  go: number,
  oi: number,
  pr: number
): number {
  const score = (
    tlr * NIRF_WEIGHTS.TLR +
    rpc * NIRF_WEIGHTS.RPC +
    go * NIRF_WEIGHTS.GO +
    oi * NIRF_WEIGHTS.OI +
    pr * NIRF_WEIGHTS.PR
  );
  return parseFloat(score.toFixed(2));
}

/**
 * Project Rank Band based on composite NIRF score
 */
export function projectRankBand(compositeScore: number): string {
  if (compositeScore >= 80.0) return 'Rank 1 - 10 (Top Tier Elite)';
  if (compositeScore >= 70.0) return 'Rank 11 - 25 (Premier University)';
  if (compositeScore >= 60.0) return 'Rank 26 - 50 (National High Achiever)';
  if (compositeScore >= 50.0) return 'Rank 51 - 100 (Established Leading Institute)';
  if (compositeScore >= 40.0) return 'Rank 101 - 150 (Rank Band)';
  return 'Rank 151 - 200 (Emerging Institute Band)';
}

/**
 * Generate cryptographic SHA-256 seal for NIRF Ranking Record
 */
export function generateNirfSeal(record: Omit<NirfRankingRecord, 'auditSha256'>): string {
  const payload = [
    record.recordId,
    record.rankingYear,
    record.category,
    record.institutionName,
    record.tlr.tlrScore,
    record.rpc.rpcScore,
    record.go.goScore,
    record.oi.oiScore,
    record.pr.prScore,
    record.compositeScore,
    record.status,
    record.nodalOfficer,
    record.lastAuditDate
  ].join('|');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Format statutory unique NIRF record tracking token
 */
export function formatNirfRecordId(category: NirfRankingCategory, year: number = 2026): string {
  const catCode = category.substring(0, 4).toUpperCase();
  const hex = createHash('sha256')
    .update(`${category}-${year}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();
  return `NIRF-${year}-${catCode}-${hex}`;
}

/**
 * Create a new NIRF Ranking Submission & Telemetry Record
 */
export function createNirfSubmission(params: {
  category: NirfRankingCategory;
  institutionName: string;
  nodalOfficer: string;
  rankingYear?: number;
  tlrMetrics: Omit<TlrMetrics, 'tlrScore'>;
  rpcMetrics: Omit<RpcMetrics, 'rpcScore'>;
  goMetrics: Omit<GoMetrics, 'goScore'>;
  oiMetrics: Omit<OiMetrics, 'oiScore'>;
  prMetrics: Omit<PrMetrics, 'prScore'>;
  qsBridge?: Partial<QsTelemetryBridge>;
  publicDisclosureUrl?: string;
}): NirfRankingRecord {
  const rankingYear = params.rankingYear || 2026;
  const recordId = formatNirfRecordId(params.category, rankingYear);
  const now = new Date().toISOString();

  const tlrScore = calculateTlrScore(params.tlrMetrics);
  const tlr: TlrMetrics = { ...params.tlrMetrics, tlrScore };

  const rpcScore = calculateRpcScore(params.rpcMetrics);
  const rpc: RpcMetrics = { ...params.rpcMetrics, rpcScore };

  const goScore = calculateGoScore(params.goMetrics);
  const go: GoMetrics = { ...params.goMetrics, goScore };

  const oiScore = calculateOiScore(params.oiMetrics);
  const oi: OiMetrics = { ...params.oiMetrics, oiScore };

  const prScore = calculatePrScore(params.prMetrics.academicPeerScore, params.prMetrics.employerFeedbackScore);
  const pr: PrMetrics = { ...params.prMetrics, prScore };

  const compositeScore = calculateNirfCompositeScore(tlrScore, rpcScore, goScore, oiScore, prScore);
  const projectedRank = projectRankBand(compositeScore);

  const defaultQs: QsTelemetryBridge = {
    qsAcademicReputationScore: parseFloat((prScore * 0.9).toFixed(1)),
    qsEmployerReputationScore: parseFloat((params.prMetrics.employerFeedbackScore * 0.95).toFixed(1)),
    qsCitationsPerFaculty: parseFloat((rpc.citationPerPaper * 1.8).toFixed(1)),
    qsInternationalFacultyPct: parseFloat((oi.otherStatesCountriesPct * 0.3).toFixed(1)),
    qsProjectedRankBand: compositeScore >= 70 ? 'QS 251-300' : 'QS 401-450'
  };

  const baseRecord: Omit<NirfRankingRecord, 'auditSha256'> = {
    recordId,
    rankingYear,
    category: params.category,
    institutionName: params.institutionName,
    tlr,
    rpc,
    go,
    oi,
    pr,
    compositeScore,
    projectedRankBand: projectedRank,
    qsBridge: { ...defaultQs, ...params.qsBridge },
    status: 'DRAFT_DATA_COLLECTION',
    nodalOfficer: params.nodalOfficer,
    publicDisclosureUrl: params.publicDisclosureUrl || `https://university.ac.in/nirf/${rankingYear}/${params.category.toLowerCase()}`,
    lastAuditDate: now
  };

  const auditSha256 = generateNirfSeal(baseRecord);
  return { ...baseRecord, auditSha256 };
}

/**
 * Advance DCS Status throughout the NIRF lifecycle
 */
export function advanceDcsStatus(
  record: NirfRankingRecord,
  nextStatus: DcsSubmissionStatus,
  auditorRemarks?: string
): NirfRankingRecord {
  const updated: NirfRankingRecord = {
    ...record,
    status: nextStatus,
    lastAuditDate: new Date().toISOString()
  };

  return { ...updated, auditSha256: generateNirfSeal(updated) };
}

/**
 * Record Official MoE NIRF Rank release
 */
export function recordOfficialRankDeclared(
  record: NirfRankingRecord,
  officialRank: number
): NirfRankingRecord {
  const updated: NirfRankingRecord = {
    ...record,
    officialDeclaredRank: officialRank,
    status: 'FINAL_RANK_DECLARED',
    lastAuditDate: new Date().toISOString()
  };

  return { ...updated, auditSha256: generateNirfSeal(updated) };
}

/**
 * Export official NIRF Data Capture System (DCS) CSV
 */
export function exportNirfDcsSummaryCSV(records: NirfRankingRecord[]): string {
  const headers = [
    'Record ID',
    'Year',
    'Category',
    'Institution Name',
    'TLR Score (30%)',
    'RPC Score (30%)',
    'GO Score (20%)',
    'OI Score (10%)',
    'PR Score (10%)',
    'Composite Score (100)',
    'Projected Rank Band',
    'Official Declared Rank',
    'QS Rank Projection',
    'DCS Status',
    'Nodal Officer',
    'Public Disclosure URL',
    'Audit Date',
    'Audit SHA-256'
  ];

  const rows = records.map(r => [
    r.recordId,
    r.rankingYear,
    r.category,
    `"${r.institutionName.replace(/"/g, '""')}"`,
    r.tlr.tlrScore.toFixed(2),
    r.rpc.rpcScore.toFixed(2),
    r.go.goScore.toFixed(2),
    r.oi.oiScore.toFixed(2),
    r.pr.prScore.toFixed(2),
    r.compositeScore.toFixed(2),
    `"${r.projectedRankBand}"`,
    r.officialDeclaredRank ? `Rank ${r.officialDeclaredRank}` : 'Awaiting MoE Notification',
    `"${r.qsBridge.qsProjectedRankBand}"`,
    r.status,
    `"${r.nodalOfficer.replace(/"/g, '""')}"`,
    r.publicDisclosureUrl,
    r.lastAuditDate,
    r.auditSha256
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Default Seed Records for Central University NIRF Telemetry
 */
export const DEFAULT_NIRF_RECORDS: NirfRankingRecord[] = [
  createNirfSubmission({
    category: 'OVERALL',
    institutionName: 'Apex Central University of Science & Technology',
    nodalOfficer: 'Prof. S. R. Ramaswamy (Dean, Planning & Quality Assurance)',
    rankingYear: 2026,
    tlrMetrics: {
      studentStrength: 7850,
      facultyStudentRatio: 13.8, // better than 1:15
      facultyWithPhdPct: 92.5,
      financialResourceUtilizationScore: 88.0
    },
    rpcMetrics: {
      publicationsScopusWos: 1420,
      citationPerPaper: 11.4,
      iprPatentsGrantedOrPublished: 26,
      sponsoredResearchFundingInr: 88000000 // 8.8 Cr
    },
    goMetrics: {
      examPassRatePct: 94.6,
      phdGraduatedAnnualCount: 138,
      medianPlacementSalaryLpa: 14.5
    },
    oiMetrics: {
      otherStatesCountriesPct: 44.0,
      womenStudentsFacultyPct: 42.5,
      economicallyChallengedStudentsPct: 38.0,
      differentlyAbledFacilitiesScore: 92.0
    },
    prMetrics: {
      academicPeerScore: 84.0,
      employerFeedbackScore: 86.5
    },
    qsBridge: {
      qsAcademicReputationScore: 78.4,
      qsEmployerReputationScore: 82.1,
      qsCitationsPerFaculty: 68.5,
      qsInternationalFacultyPct: 14.2,
      qsProjectedRankBand: 'QS 280-320'
    }
  }),
  createNirfSubmission({
    category: 'ENGINEERING',
    institutionName: 'Faculty of Engineering & Technology, Apex Central University',
    nodalOfficer: 'Prof. K. Narayanan (Head, Internal Quality Assurance Cell)',
    rankingYear: 2026,
    tlrMetrics: {
      studentStrength: 4200,
      facultyStudentRatio: 14.2,
      facultyWithPhdPct: 95.0,
      financialResourceUtilizationScore: 91.5
    },
    rpcMetrics: {
      publicationsScopusWos: 1150,
      citationPerPaper: 13.2,
      iprPatentsGrantedOrPublished: 32,
      sponsoredResearchFundingInr: 95000000 // 9.5 Cr
    },
    goMetrics: {
      examPassRatePct: 96.2,
      phdGraduatedAnnualCount: 92,
      medianPlacementSalaryLpa: 16.2
    },
    oiMetrics: {
      otherStatesCountriesPct: 48.0,
      womenStudentsFacultyPct: 36.5,
      economicallyChallengedStudentsPct: 35.0,
      differentlyAbledFacilitiesScore: 94.0
    },
    prMetrics: {
      academicPeerScore: 88.5,
      employerFeedbackScore: 91.0
    },
    qsBridge: {
      qsAcademicReputationScore: 82.0,
      qsEmployerReputationScore: 88.5,
      qsCitationsPerFaculty: 74.0,
      qsInternationalFacultyPct: 16.5,
      qsProjectedRankBand: 'QS 180-220 (Engineering Subject)'
    }
  })
];
