/**
 * Faculty Sabbatical Leave & Research Deputation Governance Engine
 * Statutory Compliance: UGC Regulations on Minimum Qualifications for Appointment of Teachers, 2018
 * (Clause 8.4: Sabbatical Leave), Central Civil Services (CCS Leave Rules 1972) & MoE Foreign Deputation Norms.
 *
 * Platform: PinIT Career OS - Teacher Portal & Faculty Governance
 * Zero-Collision Invariant: Pure Branch C administrative and faculty governance.
 */

import { createHash } from 'crypto';

export type SabbaticalCategory =
  | 'FOREIGN_POSTDOCTORAL_FELLOWSHIP'
  | 'NATIONAL_LAB_VISITING_SCIENTIST'
  | 'INDUSTRY_R_AND_D_DEPUTATION'
  | 'ACADEMIC_BOOK_WRITING_FELLOWSHIP';

export type SabbaticalStage =
  | 'SABBATICAL_PROPOSED'
  | 'FACULTY_BOARD_RECOMMENDED'
  | 'EXECUTIVE_COUNCIL_SANCTIONED'
  | 'DEPUTATION_ACTIVE_ONGOING'
  | 'COMPLETION_REPORT_SUBMITTED'
  | 'RETURN_TO_DUTY_CERTIFIED'
  | 'APPLICATION_REJECTED';

export interface FacultySabbaticalRecord {
  sabbaticalId: string;
  trackingToken: string; // SAB-[YEAR]-[DEPT]-[HEX6]
  facultyName: string;
  empId: string;
  department: string;
  designation: 'PROFESSOR' | 'ASSOCIATE_PROFESSOR';
  completedContinuousServiceYears: number; // must be >= 6 years
  category: SabbaticalCategory;
  hostInstitutionName: string;
  hostCountry: string;
  proposedStartDate: string; // YYYY-MM-DD
  proposedEndDate: string;   // YYYY-MM-DD
  durationMonths: number;    // must be <= 12 months
  researchProjectTitle: string;
  isServiceBondSigned: boolean;
  serviceBondDurationYears: number; // standard 3 years post-return
  externalMonthlyStipendInr?: number;
  stage: SabbaticalStage;
  completionMonographTitle?: string;
  returnToDutyDate?: string;
  rejectionReason?: string;
  cryptographicSeal?: string; // SHA-256 seal
  lastUpdated: string;
}

/**
 * Statutory UGC Sabbatical Constraints:
 * - Minimum continuous service in university: 6.0 years
 * - Maximum sabbatical duration at a time: 12 months
 * - Mandatory return service bond: 3 years
 */
export const MIN_SERVICE_YEARS_FOR_SABBATICAL = 6.0;
export const MAX_SABBATICAL_DURATION_MONTHS = 12;
export const MANDATORY_SERVICE_BOND_YEARS = 3;

/**
 * Generate unique sabbatical tracking token: SAB-[YEAR]-[DEPT]-[HEX6]
 */
export function generateSabbaticalToken(
  dept: string,
  year: number = new Date().getFullYear()
): string {
  const cleanDept = dept.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'DEPT';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `SAB-${year}-${cleanDept}-${randomHex}`;
}

/**
 * Validate statutory eligibility for sabbatical leave under UGC Clause 8.4
 */
export function validateSabbaticalEligibility(
  designation: 'PROFESSOR' | 'ASSOCIATE_PROFESSOR',
  completedYears: number,
  durationMonths: number
): { isEligible: boolean; error?: string } {
  if (completedYears < MIN_SERVICE_YEARS_FOR_SABBATICAL) {
    return {
      isEligible: false,
      error: `Ineligible: Continuous service (${completedYears} years) is below statutory hurdle (${MIN_SERVICE_YEARS_FOR_SABBATICAL} years).`,
    };
  }

  if (durationMonths <= 0 || durationMonths > MAX_SABBATICAL_DURATION_MONTHS) {
    return {
      isEligible: false,
      error: `Invalid duration: Sabbatical leave duration (${durationMonths} months) exceeds statutory ceiling (${MAX_SABBATICAL_DURATION_MONTHS} months).`,
    };
  }

  return { isEligible: true };
}

/**
 * Generate tamper-proof SHA-256 seal for sabbatical record
 */
export function generateSabbaticalSeal(
  record: Omit<FacultySabbaticalRecord, 'cryptographicSeal'>
): string {
  const canonicalPayload = [
    record.sabbaticalId,
    record.trackingToken,
    record.facultyName,
    record.empId,
    record.designation,
    record.completedContinuousServiceYears,
    record.category,
    record.hostInstitutionName,
    record.hostCountry,
    record.durationMonths,
    record.isServiceBondSigned ? 'BOND_EXECUTED' : 'BOND_PENDING',
    record.stage,
    record.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Propose new faculty sabbatical leave / research deputation
 */
export function proposeSabbaticalLeave(params: {
  facultyName: string;
  empId: string;
  department: string;
  designation: 'PROFESSOR' | 'ASSOCIATE_PROFESSOR';
  completedContinuousServiceYears: number;
  category: SabbaticalCategory;
  hostInstitutionName: string;
  hostCountry: string;
  proposedStartDate: string;
  proposedEndDate: string;
  durationMonths: number;
  researchProjectTitle: string;
  externalMonthlyStipendInr?: number;
}): FacultySabbaticalRecord {
  if (!params.facultyName.trim()) {
    throw new Error('Faculty name cannot be blank.');
  }

  if (!params.researchProjectTitle.trim()) {
    throw new Error('Research project title must be specified.');
  }

  const eligibility = validateSabbaticalEligibility(
    params.designation,
    params.completedContinuousServiceYears,
    params.durationMonths
  );

  if (!eligibility.isEligible) {
    throw new Error(eligibility.error);
  }

  const trackingToken = generateSabbaticalToken(params.department);
  const now = new Date().toISOString();

  const baseRecord: Omit<FacultySabbaticalRecord, 'cryptographicSeal'> = {
    sabbaticalId: `SAB-${Date.now().toString(36).toUpperCase()}`,
    trackingToken,
    facultyName: params.facultyName.trim(),
    empId: params.empId.trim().toUpperCase(),
    department: params.department.trim(),
    designation: params.designation,
    completedContinuousServiceYears: params.completedContinuousServiceYears,
    category: params.category,
    hostInstitutionName: params.hostInstitutionName.trim(),
    hostCountry: params.hostCountry.trim(),
    proposedStartDate: params.proposedStartDate,
    proposedEndDate: params.proposedEndDate,
    durationMonths: params.durationMonths,
    researchProjectTitle: params.researchProjectTitle.trim(),
    isServiceBondSigned: false,
    serviceBondDurationYears: MANDATORY_SERVICE_BOND_YEARS,
    externalMonthlyStipendInr: params.externalMonthlyStipendInr,
    stage: 'SABBATICAL_PROPOSED',
    lastUpdated: now,
  };

  const cryptographicSeal = generateSabbaticalSeal(baseRecord);
  return { ...baseRecord, cryptographicSeal };
}

/**
 * Sanction Sabbatical Leave by University Executive Council & Execute Service Bond
 */
export function sanctionByExecutiveCouncil(
  record: FacultySabbaticalRecord,
  isBondSigned: boolean = true
): FacultySabbaticalRecord {
  if (!isBondSigned) {
    throw new Error('Executive Council cannot sanction sabbatical without execution of mandatory 3-year service bond.');
  }

  const now = new Date().toISOString();
  const updated: Omit<FacultySabbaticalRecord, 'cryptographicSeal'> = {
    ...record,
    isServiceBondSigned: true,
    stage: 'EXECUTIVE_COUNCIL_SANCTIONED',
    lastUpdated: now,
  };

  const cryptographicSeal = generateSabbaticalSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Depute faculty and initiate active sabbatical period
 */
export function activateSabbaticalDeputation(record: FacultySabbaticalRecord): FacultySabbaticalRecord {
  if (record.stage !== 'EXECUTIVE_COUNCIL_SANCTIONED') {
    throw new Error(`Cannot activate deputation: Sabbatical must be sanctioned by Executive Council first (current: ${record.stage}).`);
  }

  const now = new Date().toISOString();
  const updated: Omit<FacultySabbaticalRecord, 'cryptographicSeal'> = {
    ...record,
    stage: 'DEPUTATION_ACTIVE_ONGOING',
    lastUpdated: now,
  };

  const cryptographicSeal = generateSabbaticalSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Submit research monograph / completion report and certify return to university duty
 */
export function submitCompletionAndReturnToDuty(
  record: FacultySabbaticalRecord,
  params: {
    completionMonographTitle: string;
    returnToDutyDate: string;
  }
): FacultySabbaticalRecord {
  if (record.stage !== 'DEPUTATION_ACTIVE_ONGOING') {
    throw new Error(`Return to duty can only be filed for active ongoing deputations (current: ${record.stage}).`);
  }

  if (!params.completionMonographTitle.trim()) {
    throw new Error('Completion research monograph title or book treatise must be submitted.');
  }

  const now = new Date().toISOString();
  const updated: Omit<FacultySabbaticalRecord, 'cryptographicSeal'> = {
    ...record,
    completionMonographTitle: params.completionMonographTitle.trim(),
    returnToDutyDate: params.returnToDutyDate,
    stage: 'RETURN_TO_DUTY_CERTIFIED',
    lastUpdated: now,
  };

  const cryptographicSeal = generateSabbaticalSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Export Faculty Sabbatical Ledger as statutory CSV
 */
export function exportFacultySabbaticalLedgerCSV(records: FacultySabbaticalRecord[]): string {
  const headers = [
    'Sabbatical ID',
    'Tracking Token',
    'Faculty Name',
    'Emp ID',
    'Department',
    'Designation',
    'Completed Years',
    'Category',
    'Host Institution',
    'Host Country',
    'Duration (Months)',
    'Project Title',
    'Service Bond Executed',
    'Stage',
    'Return to Duty Date',
    'Cryptographic Seal',
  ];

  const rows = records.map((r) => [
    `"${r.sabbaticalId}"`,
    `"${r.trackingToken}"`,
    `"${r.facultyName.replace(/"/g, '""')}"`,
    `"${r.empId}"`,
    `"${r.department.replace(/"/g, '""')}"`,
    `"${r.designation}"`,
    r.completedContinuousServiceYears,
    `"${r.category}"`,
    `"${r.hostInstitutionName.replace(/"/g, '""')}"`,
    `"${r.hostCountry}"`,
    r.durationMonths,
    `"${r.researchProjectTitle.replace(/"/g, '""')}"`,
    r.isServiceBondSigned ? 'YES' : 'NO',
    `"${r.stage}"`,
    `"${r.returnToDutyDate || 'N/A'}"`,
    `"${r.cryptographicSeal || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Demonstration Faculty Sabbatical Records
 */
export const INITIAL_FACULTY_SABBATICALS: FacultySabbaticalRecord[] = [
  {
    sabbaticalId: 'SAB-2026-001',
    trackingToken: 'SAB-2026-CSED-7A1190',
    facultyName: 'Dr. Siddharth Sen',
    empId: 'EMP-CSE-042',
    department: 'Computer Science & Engineering',
    designation: 'PROFESSOR',
    completedContinuousServiceYears: 8.5,
    category: 'FOREIGN_POSTDOCTORAL_FELLOWSHIP',
    hostInstitutionName: 'Stanford University (Center for Artificial Intelligence Research)',
    hostCountry: 'United States',
    proposedStartDate: '2025-06-01',
    proposedEndDate: '2026-05-31',
    durationMonths: 12,
    researchProjectTitle: 'Quantum Generative Adversarial Networks for Resilient Energy Grid Simulation',
    isServiceBondSigned: true,
    serviceBondDurationYears: 3,
    externalMonthlyStipendInr: 450000,
    stage: 'DEPUTATION_ACTIVE_ONGOING',
    cryptographicSeal: '7a11903847291048291847192837482910482918471928374829104829184702',
    lastUpdated: '2025-06-05T10:00:00Z',
  },
  {
    sabbaticalId: 'SAB-2026-002',
    trackingToken: 'SAB-2026-EEED-2B4412',
    facultyName: 'Dr. Neha Kulkarni',
    empId: 'EMP-EEE-018',
    department: 'Electrical Engineering',
    designation: 'ASSOCIATE_PROFESSOR',
    completedContinuousServiceYears: 6.2,
    category: 'NATIONAL_LAB_VISITING_SCIENTIST',
    hostInstitutionName: 'Indian Institute of Science (IISc Bangalore - High Voltage Division)',
    hostCountry: 'India',
    proposedStartDate: '2026-07-01',
    proposedEndDate: '2026-12-31',
    durationMonths: 6,
    researchProjectTitle: 'Solid-State DC Circuit Breakers for Hybrid Renewable Microgrids',
    isServiceBondSigned: true,
    serviceBondDurationYears: 3,
    stage: 'EXECUTIVE_COUNCIL_SANCTIONED',
    cryptographicSeal: '2b44123847291048291847192837482910482918471928374829104829184708',
    lastUpdated: '2026-03-20T14:30:00Z',
  },
];
