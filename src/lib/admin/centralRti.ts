/**
 * Central University Right to Information (RTI Act 2005) & CPGRAMS Public Redressal Engine
 * Statutory Compliance: Right to Information Act, 2005 (Act No. 22 of 2005),
 * DoPT Guidelines, Central Information Commission (CIC) & CPGRAMS Redressal Norms.
 *
 * Platform: PinIT Career OS - Campus Administration Platform
 * Zero-Collision Invariant: Pure Branch C administrative governance.
 */

import { createHash } from 'crypto';

export type RtiCategory =
  | 'ADMISSIONS_AND_RESERVATIONS'
  | 'EXAMINATIONS_AND_EVALUATION'
  | 'RECRUITMENT_AND_PROMOTION'
  | 'FINANCIAL_AND_TENDERS'
  | 'ADMINISTRATIVE_AND_ESTATE';

export type RtiStage =
  | 'RECEIVED'
  | 'CPIO_SCRUTINIZING'
  | 'TRANSFERRED_SEC_6_3'
  | 'INFO_DISCLOSED'
  | 'PARTIALLY_DISCLOSED_SEC_10'
  | 'EXEMPTED_REJECTED_SEC_8'
  | 'FIRST_APPEAL_FILED'
  | 'FAA_DISPOSED'
  | 'CIC_DIRECTIVE_COMPLIED';

export type Section8ExemptionClause =
  | 'SEC_8_1_A_SOVEREIGNTY_SECURITY'
  | 'SEC_8_1_D_COMMERCIAL_IP'
  | 'SEC_8_1_E_FIDUCIARY_RELATIONSHIP'
  | 'SEC_8_1_G_LIFE_SAFETY_SOURCE'
  | 'SEC_8_1_J_PERSONAL_PRIVACY';

export interface RtiRecord {
  rtiId: string;
  registrationNumber: string; // RTI-[YEAR]-[DEPT]-[HEX6]
  applicantName: string;
  isBplExempt: boolean; // Below Poverty Line fee exemption
  category: RtiCategory;
  subjectDescription: string;
  departmentConcerned: string;
  receivedDate: string; // YYYY-MM-DD
  dueDate: string; // Statutory deadline
  isLifeOrLiberty: boolean; // Proviso to Sec 7(1) - 48 hours deadline
  isTransferredSec6_3: boolean; // Transferred to another public authority (+5 days)
  transferredToDepartment?: string;
  stage: RtiStage;
  cpioOfficer: string;
  dispositionDate?: string;
  exemptionsApplied?: Section8ExemptionClause[];
  dispositionRemarks?: string;
  appealFilingDate?: string;
  faaOfficer?: string; // First Appellate Authority
  faaOrderDate?: string;
  faaOrderSummary?: string;
  cryptographicSeal?: string; // SHA-256 seal
}

/**
 * Calculates statutory response due date under RTI Act 2005:
 * - Life or Liberty: 48 hours (2 days)
 * - Transferred under Sec 6(3): 35 days (30 + 5 days)
 * - Standard RTI: 30 days
 */
export function calculateRtiDueWindow(
  receivedDateStr: string,
  isLifeOrLiberty = false,
  isTransferred = false
): string {
  const date = new Date(receivedDateStr);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid received date format');
  }

  let daysToAdd = 30;
  if (isLifeOrLiberty) {
    daysToAdd = 2; // 48 hours
  } else if (isTransferred) {
    daysToAdd = 35; // Section 6(3) transfer window
  }

  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
}

/**
 * Evaluates whether requested information attracts statutory exemptions under Section 8(1)
 */
export function evaluateSection8Exemptions(
  requestedText: string,
  options: {
    containsExaminerIdentity?: boolean;
    containsThirdPartyPersonal?: boolean;
    containsTradeSecret?: boolean;
  }
): Section8ExemptionClause[] {
  const exemptions: Section8ExemptionClause[] = [];

  const textLower = requestedText.toLowerCase();

  if (
    options.containsExaminerIdentity ||
    textLower.includes('examiner name') ||
    textLower.includes('question paper setter')
  ) {
    exemptions.push('SEC_8_1_E_FIDUCIARY_RELATIONSHIP');
  }

  if (
    options.containsThirdPartyPersonal ||
    textLower.includes('medical record') ||
    textLower.includes('personal itr') ||
    textLower.includes('private bank account')
  ) {
    exemptions.push('SEC_8_1_J_PERSONAL_PRIVACY');
  }

  if (
    options.containsTradeSecret ||
    textLower.includes('patent secret') ||
    textLower.includes('vendor proprietary formula')
  ) {
    exemptions.push('SEC_8_1_D_COMMERCIAL_IP');
  }

  return exemptions;
}

/**
 * Generates official RTI Registration Token: RTI-[YEAR]-[DEPT_CODE]-[HEX6]
 */
export function generateRtiToken(department: string): string {
  const deptCode = department
    .replace(/[^A-Za-z]/g, '')
    .slice(0, 4)
    .toUpperCase() || 'ADMN';
  const year = new Date().getFullYear();
  const hex = createHash('sha256')
    .update(`${deptCode}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .slice(0, 6)
    .toUpperCase();
  return `RTI-${year}-${deptCode}-${hex}`;
}

/**
 * Computes tamper-proof SHA-256 RTI Disposition Seal
 */
export function generateRtiDispositionSeal(
  regNumber: string,
  applicantName: string,
  stage: RtiStage,
  dispositionDate: string,
  cpioOfficer: string,
  exemptions: Section8ExemptionClause[]
): string {
  const payload = [
    regNumber,
    applicantName,
    stage,
    dispositionDate,
    cpioOfficer,
    exemptions.slice().sort().join('::'),
  ].join('||');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Registers new RTI Application under Section 6(1)
 */
export function registerRtiApplication(params: {
  applicantName: string;
  isBplExempt?: boolean;
  category: RtiCategory;
  subjectDescription: string;
  departmentConcerned: string;
  receivedDate: string;
  isLifeOrLiberty?: boolean;
  isTransferredSec6_3?: boolean;
  transferredToDepartment?: string;
  cpioOfficer: string;
}): RtiRecord {
  const isLifeOrLiberty = Boolean(params.isLifeOrLiberty);
  const isTransferred = Boolean(params.isTransferredSec6_3);
  const dueDate = calculateRtiDueWindow(params.receivedDate, isLifeOrLiberty, isTransferred);
  const registrationNumber = generateRtiToken(params.departmentConcerned);
  const rtiId = `RTI-${Date.now().toString(36)}`;

  return {
    rtiId,
    registrationNumber,
    applicantName: params.applicantName,
    isBplExempt: Boolean(params.isBplExempt),
    category: params.category,
    subjectDescription: params.subjectDescription,
    departmentConcerned: params.departmentConcerned,
    receivedDate: params.receivedDate,
    dueDate,
    isLifeOrLiberty,
    isTransferredSec6_3: isTransferred,
    transferredToDepartment: params.transferredToDepartment,
    stage: isTransferred ? 'TRANSFERRED_SEC_6_3' : 'CPIO_SCRUTINIZING',
    cpioOfficer: params.cpioOfficer,
  };
}

/**
 * Records CPIO statutory decision / disposal with cryptographic seal
 */
export function recordRtiDecision(
  rti: RtiRecord,
  decision: {
    stage: 'INFO_DISCLOSED' | 'PARTIALLY_DISCLOSED_SEC_10' | 'EXEMPTED_REJECTED_SEC_8';
    exemptionsApplied?: Section8ExemptionClause[];
    remarks: string;
    dispositionDate: string;
  }
): RtiRecord {
  const exemptions = decision.exemptionsApplied || [];
  const seal = generateRtiDispositionSeal(
    rti.registrationNumber,
    rti.applicantName,
    decision.stage,
    decision.dispositionDate,
    rti.cpioOfficer,
    exemptions
  );

  return {
    ...rti,
    stage: decision.stage,
    exemptionsApplied: exemptions,
    dispositionRemarks: decision.remarks,
    dispositionDate: decision.dispositionDate,
    cryptographicSeal: seal,
  };
}

/**
 * Records First Appeal under Section 19(1) of RTI Act
 */
export function recordFirstAppeal(
  rti: RtiRecord,
  appealDetails: {
    appealFilingDate: string;
    faaOfficer: string;
    groundForAppeal: string;
  }
): RtiRecord {
  return {
    ...rti,
    stage: 'FIRST_APPEAL_FILED',
    appealFilingDate: appealDetails.appealFilingDate,
    faaOfficer: appealDetails.faaOfficer,
    dispositionRemarks: `${rti.dispositionRemarks || ''} | First Appeal Ground: ${appealDetails.groundForAppeal}`,
  };
}

/**
 * Exports CIC Annual Return & DoPT compliant RTI Ledger CSV
 */
export function exportRtiAnnualReturnCSV(records: RtiRecord[]): string {
  const headers = [
    'Registration Number',
    'Applicant Name',
    'BPL Fee Exempt',
    'Category',
    'Department Concerned',
    'Received Date',
    'Statutory Due Date',
    'Life / Liberty (48h)',
    'Sec 6(3) Transferred',
    'Stage',
    'CPIO Officer',
    'Disposition Date',
    'Sec 8 Exemptions Applied',
    'FAA Officer',
    'Cryptographic SHA-256 Seal',
  ];

  const escapeField = (val: string | number | boolean | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = records.map((r) =>
    [
      escapeField(r.registrationNumber),
      escapeField(r.applicantName),
      escapeField(r.isBplExempt ? 'YES' : 'NO'),
      escapeField(r.category),
      escapeField(r.departmentConcerned),
      escapeField(r.receivedDate),
      escapeField(r.dueDate),
      escapeField(r.isLifeOrLiberty ? 'YES (48h)' : 'NO'),
      escapeField(r.isTransferredSec6_3 ? 'YES' : 'NO'),
      escapeField(r.stage),
      escapeField(r.cpioOfficer),
      escapeField(r.dispositionDate ?? 'PENDING'),
      escapeField(r.exemptionsApplied?.join('; ') ?? 'NONE'),
      escapeField(r.faaOfficer ?? 'N/A'),
      escapeField(r.cryptographicSeal ?? 'N/A'),
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Seed Dataset for Central RTI Registry
 */
export const SEED_RTIS: RtiRecord[] = [
  {
    rtiId: 'RTI-001',
    registrationNumber: 'RTI-2026-EXAM-99AB12',
    applicantName: 'Sanjay Deshmukh',
    isBplExempt: false,
    category: 'EXAMINATIONS_AND_EVALUATION',
    subjectDescription: 'Request for certified photocopies of evaluated answer scripts for B.Tech CS-601 Compiler Design exam held in Dec 2025.',
    departmentConcerned: 'Controller of Examinations',
    receivedDate: '2026-02-01',
    dueDate: '2026-03-03',
    isLifeOrLiberty: false,
    isTransferredSec6_3: false,
    stage: 'INFO_DISCLOSED',
    cpioOfficer: 'Dr. R. K. Mukherjee (CPIO Administration)',
    dispositionDate: '2026-02-18',
    dispositionRemarks: 'Certified copy provided after redacting examiner signature & code under Section 10(1) severability.',
    cryptographicSeal: '7a19283b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f7',
  },
  {
    rtiId: 'RTI-002',
    registrationNumber: 'RTI-2026-RECR-44CD89',
    applicantName: 'Dr. Priya V. Sharma',
    isBplExempt: false,
    category: 'RECRUITMENT_AND_PROMOTION',
    subjectDescription: 'Cut-off API benchmark scores, screening shortlist criteria, and selection committee minutes for Assistant Professor (Grade I) recruitment in Physics.',
    departmentConcerned: 'Faculty Recruitment Cell',
    receivedDate: '2026-02-10',
    dueDate: '2026-03-12',
    isLifeOrLiberty: false,
    isTransferredSec6_3: false,
    stage: 'PARTIALLY_DISCLOSED_SEC_10',
    cpioOfficer: 'Dr. R. K. Mukherjee (CPIO Administration)',
    dispositionDate: '2026-02-25',
    exemptionsApplied: ['SEC_8_1_J_PERSONAL_PRIVACY'],
    dispositionRemarks: 'Screening criteria and applicant own scores disclosed. Other candidates confidential appraisal forms withheld under Section 8(1)(j).',
    cryptographicSeal: 'fa82194857b10294856cd89123485761a2938475b6c7d8e9f0123456789abcde',
  },
  {
    rtiId: 'RTI-003',
    registrationNumber: 'RTI-2026-FINA-12EF34',
    applicantName: 'M/s Apex Infrastructure Watch',
    isBplExempt: false,
    category: 'FINANCIAL_AND_TENDERS',
    subjectDescription: 'Copies of comparative statement of bids and technical evaluation sheets for Campus Auditorium HVAC Central Chiller Works Tender.',
    departmentConcerned: 'Central Procurement Office',
    receivedDate: '2026-02-15',
    dueDate: '2026-03-17',
    isLifeOrLiberty: false,
    isTransferredSec6_3: false,
    stage: 'CPIO_SCRUTINIZING',
    cpioOfficer: 'Dr. R. K. Mukherjee (CPIO Administration)',
  },
  {
    rtiId: 'RTI-004',
    registrationNumber: 'RTI-2026-ADMN-889900',
    applicantName: 'Rohit Kumar (Parent)',
    isBplExempt: true,
    category: 'ADMISSIONS_AND_RESERVATIONS',
    subjectDescription: 'Category-wise vacant seat matrix and opening/closing ranks after Special Round of M.Tech Data Science admissions 2025-26.',
    departmentConcerned: 'Academic Affairs Office',
    receivedDate: '2026-02-22',
    dueDate: '2026-03-24',
    isLifeOrLiberty: false,
    isTransferredSec6_3: false,
    stage: 'CPIO_SCRUTINIZING',
    cpioOfficer: 'Dr. R. K. Mukherjee (CPIO Administration)',
  },
];
