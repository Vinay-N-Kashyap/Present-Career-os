/**
 * Central University Academic Integrity & Plagiarism Prevention Tribunal Engine
 * Statutory Compliance: UGC (Promotion of Academic Integrity and Prevention of Plagiarism
 * in Higher Educational Institutions) Regulations, 2018 & State University Examination Ordinances.
 *
 * Platform: PinIT Career OS - Campus Administration Platform
 * Zero-Collision Invariant: Pure Branch C administrative governance.
 */

import { createHash } from 'crypto';

export type PlagiarismLevel =
  | 'LEVEL_0_TOLERABLE' // <= 10% similarity
  | 'LEVEL_1_MINOR'     // > 10% to 40% similarity
  | 'LEVEL_2_MODERATE'  // > 40% to 60% similarity
  | 'LEVEL_3_SEVERE';   // > 60% similarity

export type CaseComplainantType = 'FACULTY_SUPERVISOR' | 'EXAMINER' | 'CHIEF_EDITOR' | 'WHISTLEBLOWER';

export type CaseTargetRole = 'RESEARCH_SCHOLAR' | 'POSTGRADUATE_STUDENT' | 'FACULTY_AUTHOR';

export type TribunalStage =
  | 'ALLEGATION_REGISTERED'
  | 'DAIP_INQUIRY_IN_PROGRESS'
  | 'DAIP_REPORT_SUBMITTED'
  | 'IAIP_HEARING_SCHEDULED'
  | 'FINAL_PENALTY_ADJUDICATED'
  | 'EXONERATED_COMPLIANT';

export interface ExclusionChecklist {
  excludeBibliography: boolean;
  excludeQuotesAndAttributions: boolean;
  excludeSmallMatchesUnder10Words: boolean;
  excludeGenericMathematicalFormulas: boolean;
}

export interface PlagiarismCaseRecord {
  caseId: string;
  trackingToken: string; // PLAG-[YEAR]-[DEPT]-[HEX6]
  documentTitle: string;
  respondentName: string;
  respondentRole: CaseTargetRole;
  department: string;
  complainantType: CaseComplainantType;
  allegationDate: string; // YYYY-MM-DD
  rawSimilarityPercentage: number;
  netSimilarityPercentage: number;
  plagiarismLevel: PlagiarismLevel;
  exclusions: ExclusionChecklist;
  stage: TribunalStage;
  daipChairmanName: string;
  daipFindings?: string;
  iaipChairmanName?: string;
  iaipHearingDate?: string;
  statutoryStudentPenalty?: string;
  statutoryFacultyPenalty?: string;
  finalOrderResolutionNumber?: string;
  cryptographicSeal?: string; // SHA-256 seal
  lastUpdated: string;
}

/**
 * UGC 2018 Academic Integrity Regulations:
 * - Level 0: <= 10.0% similarity -> Minor similarities, no penalty.
 * - Level 1: > 10.0% and <= 40.0% -> Student: resubmit script within 6 months; Faculty: withdraw manuscript.
 * - Level 2: > 40.0% and <= 60.0% -> Student: debarred 1 year; Faculty: withdraw manuscript, deny 1 increment, debar 2 yrs supervision.
 * - Level 3: > 60.0% -> Student: registration cancelled; Faculty: withdraw manuscript, deny 2 increments, debar 3 yrs supervision.
 */
export function determinePlagiarismLevel(similarityPct: number): {
  level: PlagiarismLevel;
  studentPenalty: string;
  facultyPenalty: string;
} {
  if (similarityPct <= 10.0) {
    return {
      level: 'LEVEL_0_TOLERABLE',
      studentPenalty: 'Level 0: Minor similarity <= 10.0%. No penalty applicable.',
      facultyPenalty: 'Level 0: Minor similarity <= 10.0%. No penalty applicable.',
    };
  }

  if (similarityPct <= 40.0) {
    return {
      level: 'LEVEL_1_MINOR',
      studentPenalty: 'Level 1: Debarred from submitting script for revised evaluation for up to 6 months.',
      facultyPenalty: 'Level 1: Mandatory withdrawal of manuscript from publication and formal written reprimand.',
    };
  }

  if (similarityPct <= 60.0) {
    return {
      level: 'LEVEL_2_MODERATE',
      studentPenalty: 'Level 2: Debarred from submitting revised thesis/dissertation for a period of 1 year.',
      facultyPenalty: 'Level 2: Manuscript withdrawn, forfeiture of 1 annual increment, and debarred from supervising research scholars for 2 years.',
    };
  }

  return {
    level: 'LEVEL_3_SEVERE',
    studentPenalty: 'Level 3: Immediate cancellation of academic registration and expulsion from the University programme.',
    facultyPenalty: 'Level 3: Manuscript withdrawn, forfeiture of 2 consecutive annual increments, and debarred from supervising research scholars for 3 years.',
  };
}

/**
 * Generate unique plagiarism tracking token: PLAG-[YEAR]-[DEPT]-[HEX6]
 */
export function generatePlagiarismToken(dept: string, year: number = new Date().getFullYear()): string {
  const cleanDept = dept.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'DEPT';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `PLAG-${year}-${cleanDept}-${randomHex}`;
}

/**
 * Generate tamper-proof SHA-256 seal for academic integrity case
 */
export function generatePlagiarismCaseSeal(
  record: Omit<PlagiarismCaseRecord, 'cryptographicSeal'>
): string {
  const canonicalPayload = [
    record.caseId,
    record.trackingToken,
    record.documentTitle,
    record.respondentName,
    record.respondentRole,
    record.department,
    record.netSimilarityPercentage.toFixed(2),
    record.plagiarismLevel,
    record.stage,
    record.finalOrderResolutionNumber || 'PENDING_ORDER',
    record.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Register a new academic integrity / plagiarism allegation
 */
export function registerPlagiarismAllegation(params: {
  documentTitle: string;
  respondentName: string;
  respondentRole: CaseTargetRole;
  department: string;
  complainantType: CaseComplainantType;
  rawSimilarityPercentage: number;
  netSimilarityPercentage: number;
  daipChairmanName: string;
  exclusions?: Partial<ExclusionChecklist>;
}): PlagiarismCaseRecord {
  if (!params.documentTitle.trim()) {
    throw new Error('Document title cannot be blank.');
  }

  if (params.netSimilarityPercentage < 0 || params.netSimilarityPercentage > 100) {
    throw new Error('Similarity percentage must be bounded between 0.00% and 100.00%.');
  }

  if (!params.daipChairmanName.trim()) {
    throw new Error('DAIP Chairman (Head of Department) must be assigned.');
  }

  const trackingToken = generatePlagiarismToken(params.department);
  const now = new Date().toISOString();
  const today = now.slice(0, 10);

  const penaltyInfo = determinePlagiarismLevel(params.netSimilarityPercentage);

  const fullExclusions: ExclusionChecklist = {
    excludeBibliography: params.exclusions?.excludeBibliography ?? true,
    excludeQuotesAndAttributions: params.exclusions?.excludeQuotesAndAttributions ?? true,
    excludeSmallMatchesUnder10Words: params.exclusions?.excludeSmallMatchesUnder10Words ?? true,
    excludeGenericMathematicalFormulas: params.exclusions?.excludeGenericMathematicalFormulas ?? true,
  };

  const initialStage: TribunalStage =
    penaltyInfo.level === 'LEVEL_0_TOLERABLE' ? 'EXONERATED_COMPLIANT' : 'ALLEGATION_REGISTERED';

  const baseRecord: Omit<PlagiarismCaseRecord, 'cryptographicSeal'> = {
    caseId: `PLAG-${Date.now().toString(36).toUpperCase()}`,
    trackingToken,
    documentTitle: params.documentTitle.trim(),
    respondentName: params.respondentName.trim(),
    respondentRole: params.respondentRole,
    department: params.department,
    complainantType: params.complainantType,
    allegationDate: today,
    rawSimilarityPercentage: params.rawSimilarityPercentage,
    netSimilarityPercentage: params.netSimilarityPercentage,
    plagiarismLevel: penaltyInfo.level,
    exclusions: fullExclusions,
    stage: initialStage,
    daipChairmanName: params.daipChairmanName.trim(),
    statutoryStudentPenalty: penaltyInfo.studentPenalty,
    statutoryFacultyPenalty: penaltyInfo.facultyPenalty,
    lastUpdated: now,
  };

  const cryptographicSeal = generatePlagiarismCaseSeal(baseRecord);
  return { ...baseRecord, cryptographicSeal };
}

/**
 * Record Departmental Academic Integrity Panel (DAIP) inquiry recommendations
 */
export function recordDaipInquiryReport(
  record: PlagiarismCaseRecord,
  findings: string,
  confirmedNetSimilarity: number
): PlagiarismCaseRecord {
  if (record.stage === 'EXONERATED_COMPLIANT' || record.stage === 'FINAL_PENALTY_ADJUDICATED') {
    throw new Error(`Cannot submit DAIP report: Case is already resolved in stage ${record.stage}.`);
  }

  const penaltyInfo = determinePlagiarismLevel(confirmedNetSimilarity);
  const now = new Date().toISOString();

  const nextStage: TribunalStage =
    penaltyInfo.level === 'LEVEL_0_TOLERABLE' ? 'EXONERATED_COMPLIANT' : 'DAIP_REPORT_SUBMITTED';

  const updated: Omit<PlagiarismCaseRecord, 'cryptographicSeal'> = {
    ...record,
    stage: nextStage,
    netSimilarityPercentage: confirmedNetSimilarity,
    plagiarismLevel: penaltyInfo.level,
    daipFindings: findings.trim(),
    statutoryStudentPenalty: penaltyInfo.studentPenalty,
    statutoryFacultyPenalty: penaltyInfo.facultyPenalty,
    lastUpdated: now,
  };

  const cryptographicSeal = generatePlagiarismCaseSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Schedule Institutional Academic Integrity Panel (IAIP) hearing
 */
export function scheduleIaipHearing(
  record: PlagiarismCaseRecord,
  iaipChairmanName: string,
  hearingDate: string
): PlagiarismCaseRecord {
  if (record.stage !== 'DAIP_REPORT_SUBMITTED') {
    throw new Error(`IAIP hearing requires a submitted DAIP inquiry report (current: ${record.stage}).`);
  }

  const now = new Date().toISOString();
  const updated: Omit<PlagiarismCaseRecord, 'cryptographicSeal'> = {
    ...record,
    stage: 'IAIP_HEARING_SCHEDULED',
    iaipChairmanName: iaipChairmanName.trim(),
    iaipHearingDate: hearingDate,
    lastUpdated: now,
  };

  const cryptographicSeal = generatePlagiarismCaseSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Adjudicate final statutory penalty by Institutional Academic Integrity Panel (IAIP)
 */
export function adjudicateFinalPenalty(
  record: PlagiarismCaseRecord,
  resolutionNumber: string
): PlagiarismCaseRecord {
  if (record.stage !== 'IAIP_HEARING_SCHEDULED') {
    throw new Error(`Final penalty adjudication requires formal IAIP hearing stage (current: ${record.stage}).`);
  }

  const now = new Date().toISOString();
  const updated: Omit<PlagiarismCaseRecord, 'cryptographicSeal'> = {
    ...record,
    stage: 'FINAL_PENALTY_ADJUDICATED',
    finalOrderResolutionNumber: resolutionNumber.trim(),
    lastUpdated: now,
  };

  const cryptographicSeal = generatePlagiarismCaseSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Export Plagiarism Tribunal Ledger as statutory CSV
 */
export function exportPlagiarismTribunalCSV(cases: PlagiarismCaseRecord[]): string {
  const headers = [
    'Case ID',
    'Tracking Token',
    'Document Title',
    'Respondent Name',
    'Respondent Role',
    'Department',
    'Net Similarity %',
    'Plagiarism Level',
    'Stage',
    'DAIP Chairman',
    'IAIP Hearing Date',
    'Order Resolution',
    'Cryptographic Seal',
  ];

  const rows = cases.map((c) => [
    `"${c.caseId}"`,
    `"${c.trackingToken}"`,
    `"${c.documentTitle.replace(/"/g, '""')}"`,
    `"${c.respondentName.replace(/"/g, '""')}"`,
    `"${c.respondentRole}"`,
    `"${c.department.replace(/"/g, '""')}"`,
    `${c.netSimilarityPercentage.toFixed(2)}%`,
    `"${c.plagiarismLevel}"`,
    `"${c.stage}"`,
    `"${c.daipChairmanName.replace(/"/g, '""')}"`,
    `"${c.iaipHearingDate || 'N/A'}"`,
    `"${c.finalOrderResolutionNumber || 'N/A'}"`,
    `"${c.cryptographicSeal || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Initial demonstration academic integrity cases
 */
export const INITIAL_PLAGIARISM_CASES: PlagiarismCaseRecord[] = [
  {
    caseId: 'PLAG-2026-001',
    trackingToken: 'PLAG-2026-CSED-44B109',
    documentTitle: 'Doctoral Dissertation: High-Throughput Memory Allocators in Asynchronous Runtimes',
    respondentName: 'Suresh Patil',
    respondentRole: 'RESEARCH_SCHOLAR',
    department: 'Computer Science & Engineering',
    complainantType: 'EXAMINER',
    allegationDate: '2026-01-15',
    rawSimilarityPercentage: 52.4,
    netSimilarityPercentage: 46.8, // Level 2 (>40% to 60%)
    plagiarismLevel: 'LEVEL_2_MODERATE',
    exclusions: {
      excludeBibliography: true,
      excludeQuotesAndAttributions: true,
      excludeSmallMatchesUnder10Words: true,
      excludeGenericMathematicalFormulas: true,
    },
    stage: 'FINAL_PENALTY_ADJUDICATED',
    daipChairmanName: 'Prof. Ramesh Sharma (HoD CSE)',
    daipFindings: 'DAIP inquiry verified verbatim overlap with 3 prior IEEE conference papers without citation.',
    iaipChairmanName: 'Prof. B. K. Ramanathan (Dean Academic Affairs)',
    iaipHearingDate: '2026-02-10',
    statutoryStudentPenalty: 'Level 2: Debarred from submitting revised thesis/dissertation for a period of 1 year.',
    statutoryFacultyPenalty: 'Level 2: Manuscript withdrawn, forfeiture of 1 annual increment, and debarred from supervising research scholars for 2 years.',
    finalOrderResolutionNumber: 'IAIP-ORD-2026-08',
    cryptographicSeal: '44b1093847291048291847192837482910482918471928374829104829184712',
    lastUpdated: '2026-02-12T10:00:00Z',
  },
  {
    caseId: 'PLAG-2026-002',
    trackingToken: 'PLAG-2026-EEED-7C2A88',
    documentTitle: 'Research Manuscript: GaN-Based Solid State Circuit Breakers for DC Microgrids',
    respondentName: 'Dr. Vivek Joshi',
    respondentRole: 'FACULTY_AUTHOR',
    department: 'Electrical Engineering',
    complainantType: 'CHIEF_EDITOR',
    allegationDate: '2026-02-20',
    rawSimilarityPercentage: 24.5,
    netSimilarityPercentage: 18.2, // Level 1 (>10% to 40%)
    plagiarismLevel: 'LEVEL_1_MINOR',
    exclusions: {
      excludeBibliography: true,
      excludeQuotesAndAttributions: true,
      excludeSmallMatchesUnder10Words: true,
      excludeGenericMathematicalFormulas: true,
    },
    stage: 'DAIP_REPORT_SUBMITTED',
    daipChairmanName: 'Dr. Neha Kulkarni (HoD EEE)',
    daipFindings: 'DAIP verified secondary text overlap in literature survey section. Manuscript withdrawal initiated.',
    statutoryStudentPenalty: 'Level 1: Debarred from submitting script for revised evaluation for up to 6 months.',
    statutoryFacultyPenalty: 'Level 1: Mandatory withdrawal of manuscript from publication and formal written reprimand.',
    cryptographicSeal: '7c2a883847291048291847192837482910482918471928374829104829184714',
    lastUpdated: '2026-02-28T16:00:00Z',
  },
];
