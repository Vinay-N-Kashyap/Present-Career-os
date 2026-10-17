/**
 * Faculty Emeritus Fellowship & Superannuation Honorarium Ledger Engine
 * 
 * Statutory & Benchmark Compliance:
 * - UGC Guidelines for the Scheme of Emeritus Fellowship for Superannuated Teachers
 * - Statutory Superannuation Age Hurdle: >= 60 years of age (up to 70 years age ceiling)
 * - Maximum Fellowship Tenure: 2 Years
 * - Fixed Statutory UGC Honorarium: ₹50,000 per month
 * - Annual Research & Book Contingency Grant: ₹50,000 per annum
 * - Income Tax Act Section 194J Statutory TDS: 10% on monthly honorarium disbursements
 * - Cryptographic SHA-256 audit seal on all fellowship records and payment vouchers
 */

import { createHash } from 'crypto';

export type EmeritusFellowshipStage =
  | 'APPLICATION_SUBMITTED'
  | 'PEER_COMMITTEE_RECOMMENDED'
  | 'SYNDICATE_APPROVED'
  | 'FELLOWSHIP_ACTIVE'
  | 'FINAL_MONOGRAPH_SUBMITTED'
  | 'TENURE_HONORABLY_COMPLETED';

export interface MonthlyFellowshipVoucher {
  voucherId: string;
  monthYear: string; // 'YYYY-MM'
  grossHonorariumInr: number; // 50,000
  tdsDeductionInr: number; // 5,000 (10%)
  netDisbursedInr: number; // 45,000
  neftTransactionRef: string;
  disbursedDate: string;
}

export interface ContingencyClaim {
  claimId: string;
  expenseCategory: 'ACADEMIC_BOOKS' | 'FIELD_TRAVEL' | 'LAB_REAGENTS' | 'CONFERENCE_REGISTRATION' | 'MONOGRAPH_PUBLICATION';
  description: string;
  claimedAmountInr: number;
  sanctionedAmountInr: number;
  invoiceDate: string;
  claimDate: string;
  financeSanctionOrder: string;
}

export interface FacultyEmeritusRecord {
  fellowshipId: string; // EMR-[YEAR]-[DEPT]-[HEX6]
  facultyName: string;
  facultyEmail: string;
  hostDepartment: string;
  dateOfSuperannuation: string;
  ageAtSuperannuation: number; // Must be >= 60
  currentAge: number; // Must be <= 70
  academicSpecialization: string;
  proposedResearchMonograph: string;
  coMentoredPhdScholarsCount: number;
  masterclassesConductedCount: number;
  tenureStartDate?: string;
  tenureEndDate?: string;
  monthlyHonorariumInr: number; // 50,000
  annualContingencyGrantInr: number; // 50,000
  contingencyUtilizedInr: number;
  contingencyClaims: ContingencyClaim[];
  vouchers: MonthlyFellowshipVoucher[];
  stage: EmeritusFellowshipStage;
  monographSubmissionDate?: string;
  monographDoiOrIsbn?: string;
  createdTimestamp: string;
  auditSha256: string;
}

// Statutory Constants
export const MIN_SUPERANNUATION_AGE = 60;
export const MAX_EMERITUS_AGE_CEILING = 70;
export const MAX_FELLOWSHIP_TENURE_YEARS = 2;
export const STATUTORY_MONTHLY_HONORARIUM_INR = 50000;
export const STATUTORY_ANNUAL_CONTINGENCY_INR = 50000;
export const TDS_RATE_SECTION_194J = 0.10; // 10%

/**
 * Generate cryptographic SHA-256 seal for Emeritus Fellowship record
 */
export function generateEmeritusSeal(record: Omit<FacultyEmeritusRecord, 'auditSha256'>): string {
  const vouchersSummary = record.vouchers.map(v => `${v.voucherId}:${v.netDisbursedInr}`).join(';');
  const claimsSummary = record.contingencyClaims.map(c => `${c.claimId}:${c.sanctionedAmountInr}`).join(';');

  const payload = [
    record.fellowshipId,
    record.facultyName,
    record.hostDepartment,
    record.ageAtSuperannuation,
    record.currentAge,
    record.stage,
    record.monthlyHonorariumInr,
    record.contingencyUtilizedInr,
    record.coMentoredPhdScholarsCount,
    vouchersSummary,
    claimsSummary
  ].join('|');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Format statutory unique Emeritus Fellowship token
 */
export function formatEmeritusRecordId(department: string, year: number = 2026): string {
  const deptCode = department.substring(0, 4).toUpperCase();
  const hex = createHash('sha256')
    .update(`${department}-${year}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();
  return `EMR-${year}-${deptCode}-${hex}`;
}

/**
 * Onboard and register a superannuated professor for UGC Emeritus Fellowship
 */
export function registerEmeritusFellowship(params: {
  facultyName: string;
  facultyEmail: string;
  hostDepartment: string;
  dateOfSuperannuation: string;
  ageAtSuperannuation: number;
  currentAge: number;
  academicSpecialization: string;
  proposedResearchMonograph: string;
  year?: number;
}): FacultyEmeritusRecord {
  // Validate UGC Statutory Age Hurdle
  if (params.ageAtSuperannuation < MIN_SUPERANNUATION_AGE) {
    throw new Error(
      `Statutory UGC Violation: Superannuation age must be at least ${MIN_SUPERANNUATION_AGE} years. Provided: ${params.ageAtSuperannuation}`
    );
  }
  if (params.currentAge > MAX_EMERITUS_AGE_CEILING) {
    throw new Error(
      `Statutory UGC Violation: Age exceeds Emeritus Fellowship statutory ceiling of ${MAX_EMERITUS_AGE_CEILING} years. Provided: ${params.currentAge}`
    );
  }

  const year = params.year || 2026;
  const fellowshipId = formatEmeritusRecordId(params.hostDepartment, year);
  const now = new Date().toISOString();

  const baseRecord: Omit<FacultyEmeritusRecord, 'auditSha256'> = {
    fellowshipId,
    facultyName: params.facultyName,
    facultyEmail: params.facultyEmail,
    hostDepartment: params.hostDepartment,
    dateOfSuperannuation: params.dateOfSuperannuation,
    ageAtSuperannuation: params.ageAtSuperannuation,
    currentAge: params.currentAge,
    academicSpecialization: params.academicSpecialization,
    proposedResearchMonograph: params.proposedResearchMonograph,
    coMentoredPhdScholarsCount: 0,
    masterclassesConductedCount: 0,
    monthlyHonorariumInr: STATUTORY_MONTHLY_HONORARIUM_INR,
    annualContingencyGrantInr: STATUTORY_ANNUAL_CONTINGENCY_INR,
    contingencyUtilizedInr: 0,
    contingencyClaims: [],
    vouchers: [],
    stage: 'APPLICATION_SUBMITTED',
    createdTimestamp: now
  };

  const auditSha256 = generateEmeritusSeal(baseRecord);
  return { ...baseRecord, auditSha256 };
}

/**
 * Sanction and activate Emeritus Fellowship tenure
 */
export function activateEmeritusTenure(
  record: FacultyEmeritusRecord,
  startDate: string
): FacultyEmeritusRecord {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + MAX_FELLOWSHIP_TENURE_YEARS);

  const updated: FacultyEmeritusRecord = {
    ...record,
    stage: 'FELLOWSHIP_ACTIVE',
    tenureStartDate: startDate,
    tenureEndDate: end.toISOString().split('T')[0]
  };

  return { ...updated, auditSha256: generateEmeritusSeal(updated) };
}

/**
 * Generate monthly honorarium disbursement voucher with Section 194J 10% TDS deduction
 */
export function generateMonthlyHonorariumVoucher(
  record: FacultyEmeritusRecord,
  monthYear: string,
  neftRef?: string
): FacultyEmeritusRecord {
  if (record.stage !== 'FELLOWSHIP_ACTIVE') {
    throw new Error(`Cannot generate voucher: Fellowship stage must be FELLOWSHIP_ACTIVE. Current: ${record.stage}`);
  }

  const gross = record.monthlyHonorariumInr;
  const tds = Math.round(gross * TDS_RATE_SECTION_194J);
  const net = gross - tds;
  const voucherId = `VOUCH-${record.fellowshipId}-${monthYear}`;
  const now = new Date().toISOString();

  const newVoucher: MonthlyFellowshipVoucher = {
    voucherId,
    monthYear,
    grossHonorariumInr: gross,
    tdsDeductionInr: tds,
    netDisbursedInr: net,
    neftTransactionRef: neftRef || `NEFT-SBI-${Date.now().toString().slice(-8)}`,
    disbursedDate: now
  };

  const updated: FacultyEmeritusRecord = {
    ...record,
    vouchers: [...record.vouchers, newVoucher]
  };

  return { ...updated, auditSha256: generateEmeritusSeal(updated) };
}

/**
 * Sanction a research and book contingency claim against annual statutory grant
 */
export function claimContingencyExpense(
  record: FacultyEmeritusRecord,
  params: {
    expenseCategory: ContingencyClaim['expenseCategory'];
    description: string;
    claimedAmountInr: number;
    invoiceDate: string;
  }
): FacultyEmeritusRecord {
  const availableContingency = record.annualContingencyGrantInr - record.contingencyUtilizedInr;
  if (params.claimedAmountInr > availableContingency) {
    throw new Error(
      `Contingency Grant Exhausted: Claim of ₹${params.claimedAmountInr} exceeds remaining balance of ₹${availableContingency}`
    );
  }

  const claimId = `CONT-${record.fellowshipId}-${record.contingencyClaims.length + 1}`;
  const now = new Date().toISOString();

  const newClaim: ContingencyClaim = {
    claimId,
    expenseCategory: params.expenseCategory,
    description: params.description,
    claimedAmountInr: params.claimedAmountInr,
    sanctionedAmountInr: params.claimedAmountInr,
    invoiceDate: params.invoiceDate,
    claimDate: now,
    financeSanctionOrder: `FIN-SANCT-${Date.now().toString().slice(-6)}`
  };

  const updated: FacultyEmeritusRecord = {
    ...record,
    contingencyUtilizedInr: record.contingencyUtilizedInr + params.claimedAmountInr,
    contingencyClaims: [...record.contingencyClaims, newClaim]
  };

  return { ...updated, auditSha256: generateEmeritusSeal(updated) };
}

/**
 * Submit final research monograph and conclude emeritus tenure honorably
 */
export function concludeEmeritusTenure(
  record: FacultyEmeritusRecord,
  params: {
    monographDoiOrIsbn: string;
    coMentoredPhdScholarsCount: number;
    masterclassesConductedCount: number;
  }
): FacultyEmeritusRecord {
  const now = new Date().toISOString();
  const updated: FacultyEmeritusRecord = {
    ...record,
    stage: 'TENURE_HONORABLY_COMPLETED',
    monographDoiOrIsbn: params.monographDoiOrIsbn,
    monographSubmissionDate: now,
    coMentoredPhdScholarsCount: params.coMentoredPhdScholarsCount,
    masterclassesConductedCount: params.masterclassesConductedCount
  };

  return { ...updated, auditSha256: generateEmeritusSeal(updated) };
}

/**
 * Export official UGC Emeritus Fellowship Ledger CSV
 */
export function exportFacultyEmeritusLedgerCSV(records: FacultyEmeritusRecord[]): string {
  const headers = [
    'Fellowship ID',
    'Faculty Name',
    'Host Department',
    'Superannuation Date',
    'Age at Superannuation',
    'Current Age',
    'Specialization',
    'Research Monograph',
    'Stage',
    'Monthly Honorarium (INR)',
    'Total Gross Disbursed (INR)',
    'Total TDS Deducted 10% (INR)',
    'Net Disbursed (INR)',
    'Annual Contingency (INR)',
    'Contingency Utilized (INR)',
    'Ph.D. Scholars Mentored',
    'Masterclasses Held',
    'Monograph ISBN/DOI',
    'Audit SHA-256'
  ];

  const rows = records.map(r => {
    const totalGross = r.vouchers.reduce((sum, v) => sum + v.grossHonorariumInr, 0);
    const totalTds = r.vouchers.reduce((sum, v) => sum + v.tdsDeductionInr, 0);
    const totalNet = r.vouchers.reduce((sum, v) => sum + v.netDisbursedInr, 0);

    return [
      r.fellowshipId,
      `"${r.facultyName.replace(/"/g, '""')}"`,
      `"${r.hostDepartment.replace(/"/g, '""')}"`,
      r.dateOfSuperannuation,
      r.ageAtSuperannuation,
      r.currentAge,
      `"${r.academicSpecialization.replace(/"/g, '""')}"`,
      `"${r.proposedResearchMonograph.replace(/"/g, '""')}"`,
      r.stage,
      r.monthlyHonorariumInr,
      totalGross,
      totalTds,
      totalNet,
      r.annualContingencyGrantInr,
      r.contingencyUtilizedInr,
      r.coMentoredPhdScholarsCount,
      r.masterclassesConductedCount,
      r.monographDoiOrIsbn || 'Pending Submission',
      r.auditSha256
    ];
  });

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Default Seed Records for Faculty Emeritus Fellowship Studio
 */
export const DEFAULT_EMERITUS_FELLOWS: FacultyEmeritusRecord[] = [
  {
    fellowshipId: 'EMR-2026-COMP-8A4F12',
    facultyName: 'Prof. Dr. M. S. Narasimhan',
    facultyEmail: 'ms.narasimhan@university.ac.in',
    hostDepartment: 'Computer Science & Engineering',
    dateOfSuperannuation: '2025-06-30',
    ageAtSuperannuation: 65,
    currentAge: 66,
    academicSpecialization: 'Formal Verification & Quantum Computing Algorithms',
    proposedResearchMonograph: 'Categorical Quantum Mechanics and Topos-Theoretic Logic Systems',
    coMentoredPhdScholarsCount: 3,
    masterclassesConductedCount: 8,
    tenureStartDate: '2025-07-01',
    tenureEndDate: '2027-06-30',
    monthlyHonorariumInr: STATUTORY_MONTHLY_HONORARIUM_INR,
    annualContingencyGrantInr: STATUTORY_ANNUAL_CONTINGENCY_INR,
    contingencyUtilizedInr: 28500,
    contingencyClaims: [
      {
        claimId: 'CONT-EMR-2026-COMP-8A4F12-1',
        expenseCategory: 'ACADEMIC_BOOKS',
        description: 'Springer Graduate Texts in Mathematics & Oxford Quantum Monograph Compendium',
        claimedAmountInr: 16500,
        sanctionedAmountInr: 16500,
        invoiceDate: '2025-09-12',
        claimDate: '2025-09-20',
        financeSanctionOrder: 'FIN-SANCT-882190'
      },
      {
        claimId: 'CONT-EMR-2026-COMP-8A4F12-2',
        expenseCategory: 'CONFERENCE_REGISTRATION',
        description: 'IEEE Quantum Week International Conference Author Registration',
        claimedAmountInr: 12000,
        sanctionedAmountInr: 12000,
        invoiceDate: '2025-11-04',
        claimDate: '2025-11-10',
        financeSanctionOrder: 'FIN-SANCT-889412'
      }
    ],
    vouchers: [
      {
        voucherId: 'VOUCH-EMR-2026-COMP-8A4F12-2026-01',
        monthYear: '2026-01',
        grossHonorariumInr: 50000,
        tdsDeductionInr: 5000,
        netDisbursedInr: 45000,
        neftTransactionRef: 'NEFT-SBI-98214512',
        disbursedDate: '2026-01-31'
      },
      {
        voucherId: 'VOUCH-EMR-2026-COMP-8A4F12-2026-02',
        monthYear: '2026-02',
        grossHonorariumInr: 50000,
        tdsDeductionInr: 5000,
        netDisbursedInr: 45000,
        neftTransactionRef: 'NEFT-SBI-98334189',
        disbursedDate: '2026-02-28'
      }
    ],
    stage: 'FELLOWSHIP_ACTIVE',
    createdTimestamp: '2025-07-01T00:00:00.000Z',
    auditSha256: '9f8e7d6c5b4a31201928374655abcdef0123456789abcdef0123456789abcdef'
  },
  {
    fellowshipId: 'EMR-2026-PHYS-77C1B9',
    facultyName: 'Prof. Dr. Sarojini Sen',
    facultyEmail: 'sarojini.sen@university.ac.in',
    hostDepartment: 'Physics & Astrophysics',
    dateOfSuperannuation: '2024-05-31',
    ageAtSuperannuation: 65,
    currentAge: 67,
    academicSpecialization: 'Relativistic Astrophysics & Gravitational Waves',
    proposedResearchMonograph: 'Gravitational Wave Astronomy with Ground-Based and Space Interferometers',
    coMentoredPhdScholarsCount: 4,
    masterclassesConductedCount: 12,
    tenureStartDate: '2024-06-01',
    tenureEndDate: '2026-05-31',
    monthlyHonorariumInr: STATUTORY_MONTHLY_HONORARIUM_INR,
    annualContingencyGrantInr: STATUTORY_ANNUAL_CONTINGENCY_INR,
    contingencyUtilizedInr: 50000,
    contingencyClaims: [
      {
        claimId: 'CONT-EMR-2026-PHYS-77C1B9-1',
        expenseCategory: 'MONOGRAPH_PUBLICATION',
        description: 'Cambridge University Press Open Access Monograph Open-Access Subvention',
        claimedAmountInr: 50000,
        sanctionedAmountInr: 50000,
        invoiceDate: '2025-10-15',
        claimDate: '2025-10-22',
        financeSanctionOrder: 'FIN-SANCT-771209'
      }
    ],
    vouchers: [
      {
        voucherId: 'VOUCH-EMR-2026-PHYS-77C1B9-2026-01',
        monthYear: '2026-01',
        grossHonorariumInr: 50000,
        tdsDeductionInr: 5000,
        netDisbursedInr: 45000,
        neftTransactionRef: 'NEFT-SBI-77881920',
        disbursedDate: '2026-01-31'
      }
    ],
    stage: 'TENURE_HONORABLY_COMPLETED',
    monographDoiOrIsbn: 'isbn:978-1-108-84512-3',
    monographSubmissionDate: '2026-02-15T10:00:00.000Z',
    createdTimestamp: '2024-06-01T00:00:00.000Z',
    auditSha256: 'a1b2c3d4e5f6071829384756abcdef0123456789abcdef0123456789abcdef01'
  }
];

// Initialize seal hashes for seed records
DEFAULT_EMERITUS_FELLOWS[0].auditSha256 = generateEmeritusSeal(DEFAULT_EMERITUS_FELLOWS[0]);
DEFAULT_EMERITUS_FELLOWS[1].auditSha256 = generateEmeritusSeal(DEFAULT_EMERITUS_FELLOWS[1]);
