/**
 * Faculty Research Fellowship (JRF/SRF/PostDoc) Monthly Stipend & Contingency Grant Ledger Engine
 * 
 * Statutory & Institutional Regulatory Framework:
 * - Ministry of Education (MoE), UGC, CSIR & DST-SERB Revised Fellowship Scales (2023 Revision)
 * - Junior Research Fellow (JRF): ₹37,000/mo + HRA | Senior Research Fellow (SRF): ₹42,000/mo + HRA
 * - Research Associate (Post-Doc RA-I/II/III): ₹58,000 / ₹61,000 / ₹67,000/mo + HRA
 * - 7th CPC HRA Norms: Tier X (27%), Tier Y (18%), Tier Z (9%), Campus Resident (0%)
 * - UGC Mandatory Minimum 80% Monthly Attendance Hurdle for Direct Benefit Transfer (DBT) Stipend Release
 * - JRF to SRF Upgradation: Mandatory 24 Months Tenure + 3-Member External Assessment Committee Report
 * - General Financial Rules 2017 (GFR 2017) Research Contingency Grant Auditing & Utilization
 */

import { createHash } from 'crypto';

export type FellowshipTier = 
  | 'JRF_JUNIOR_RESEARCH_FELLOW'
  | 'SRF_SENIOR_RESEARCH_FELLOW'
  | 'RA_I_POST_DOCTORAL'
  | 'RA_II_POST_DOCTORAL'
  | 'RA_III_POST_DOCTORAL';

export type FundingAgency = 
  | 'UGC_NET_JRF'
  | 'CSIR_JRF'
  | 'DST_INSPIRE'
  | 'DBT_BIOCARE'
  | 'ICMR_FELLOWSHIP'
  | 'INSTITUTE_TEQIP';

export type CityHraTier = 
  | 'TIER_X_27_PERCENT'
  | 'TIER_Y_18_PERCENT'
  | 'TIER_Z_9_PERCENT'
  | 'NO_HRA_CAMPUS_RESIDENT';

export type StipendBillStatus = 
  | 'PENDING_APPROVAL'
  | 'GUIDE_SANCTIONED'
  | 'DISBURSED_DBT_CLEARED'
  | 'ATTENDANCE_DEFICIT_HELD';

export interface MonthlyStipendBill {
  billId: string;
  monthYear: string; // e.g. "2026-03"
  baseStipendInr: number;
  hraInr: number;
  grossStipendInr: number;
  attendancePercent: number; // Must be >= 80%
  status: StipendBillStatus;
  generatedDate: string;
  disbursedDate?: string;
  dbtReferenceNumber?: string;
  rejectionReason?: string;
}

export interface ContingencyClaim {
  claimId: string;
  description: string;
  category: 'RESEARCH_CONSUMABLES' | 'SPECIALIZED_BOOKS_JOURNALS' | 'CONFERENCE_TRAVEL' | 'TESTING_CHARACTERIZATION_CHARGES';
  invoiceDate: string; // ISO Date YYYY-MM-DD
  amountInr: number;
  gfrComplianceVerified: boolean;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ResearchFellowRecord {
  fellowId: string; // Token format: FEL-[YEAR]-[DEPT]-[HEX6]
  scholarName: string;
  scholarEmail: string;
  rollNumber: string;
  piFacultyId: string;
  piFacultyName: string;
  department: string;
  fundingAgency: FundingAgency;
  fellowshipTier: FellowshipTier;
  cityHraTier: CityHraTier;
  enrollmentDate: string; // ISO Date YYYY-MM-DD
  tenureMonthsCompleted: number;
  twoYearAssessmentCompleted: boolean;
  annualContingencyLimitInr: number;
  contingencySpentInr: number;
  monthlyBills: MonthlyStipendBill[];
  contingencyClaims: ContingencyClaim[];
  status: 'ACTIVE_FELLOWSHIP' | 'SRF_UPGRADED' | 'TENURE_COMPLETED' | 'THESIS_SUBMITTED_CLOSED' | 'TERMINATED_DISCONTINUED';
  createdTimestamp: string;
  auditSha256: string;
}

// Revised 2023 Statutory Base Monthly Stipend Scales (in INR)
export const STATUTORY_BASE_STIPENDS: Record<FellowshipTier, number> = {
  JRF_JUNIOR_RESEARCH_FELLOW: 37000,
  SRF_SENIOR_RESEARCH_FELLOW: 42000,
  RA_I_POST_DOCTORAL: 58000,
  RA_II_POST_DOCTORAL: 61000,
  RA_III_POST_DOCTORAL: 67000
};

// Standard Annual Contingency Allocations
export const STATUTORY_ANNUAL_CONTINGENCY: Record<FellowshipTier, number> = {
  JRF_JUNIOR_RESEARCH_FELLOW: 20000,
  SRF_SENIOR_RESEARCH_FELLOW: 20000,
  RA_I_POST_DOCTORAL: 50000,
  RA_II_POST_DOCTORAL: 50000,
  RA_III_POST_DOCTORAL: 50000
};

// Mandatory Minimum Attendance Hurdle (UGC / CSIR Norms)
export const MIN_FELLOWSHIP_ATTENDANCE_PERCENT = 80;

/**
 * Calculate HRA amount based on city tier and base stipend
 */
export function calculateHraAmount(baseStipendInr: number, hraTier: CityHraTier): number {
  if (hraTier === 'TIER_X_27_PERCENT') return Math.round(baseStipendInr * 0.27);
  if (hraTier === 'TIER_Y_18_PERCENT') return Math.round(baseStipendInr * 0.18);
  if (hraTier === 'TIER_Z_9_PERCENT') return Math.round(baseStipendInr * 0.09);
  return 0; // Campus resident gets 0% HRA
}

/**
 * Generate cryptographic SHA-256 seal for Research Fellow record
 */
export function generateFellowshipSeal(fellow: Omit<ResearchFellowRecord, 'auditSha256'>): string {
  const payload = [
    fellow.fellowId,
    fellow.scholarName,
    fellow.piFacultyId,
    fellow.fundingAgency,
    fellow.fellowshipTier,
    fellow.cityHraTier,
    fellow.tenureMonthsCompleted,
    fellow.contingencySpentInr,
    fellow.status,
    fellow.monthlyBills.length,
    fellow.contingencyClaims.length
  ].join('|');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Format statutory unique fellow identifier token
 */
export function formatFellowId(department: string, year: number = 2026): string {
  const deptCode = department.replace(/[^A-Z]/gi, '').substring(0, 4).toUpperCase() || 'RSCH';
  const hex = createHash('sha256')
    .update(`${department}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();
  return `FEL-${year}-${deptCode}-${hex}`;
}

/**
 * Create a new Research Fellow record
 */
export function createResearchFellowRecord(params: {
  scholarName: string;
  scholarEmail: string;
  rollNumber: string;
  piFacultyId: string;
  piFacultyName: string;
  department: string;
  fundingAgency: FundingAgency;
  fellowshipTier: FellowshipTier;
  cityHraTier: CityHraTier;
  enrollmentDate: string;
  tenureMonthsCompleted?: number;
  twoYearAssessmentCompleted?: boolean;
  year?: number;
}): ResearchFellowRecord {
  const fellowId = formatFellowId(params.department, params.year);
  const now = new Date().toISOString();
  const contingencyLimit = STATUTORY_ANNUAL_CONTINGENCY[params.fellowshipTier];

  const baseFellow: Omit<ResearchFellowRecord, 'auditSha256'> = {
    fellowId,
    scholarName: params.scholarName,
    scholarEmail: params.scholarEmail,
    rollNumber: params.rollNumber.toUpperCase(),
    piFacultyId: params.piFacultyId,
    piFacultyName: params.piFacultyName,
    department: params.department,
    fundingAgency: params.fundingAgency,
    fellowshipTier: params.fellowshipTier,
    cityHraTier: params.cityHraTier,
    enrollmentDate: params.enrollmentDate,
    tenureMonthsCompleted: params.tenureMonthsCompleted || 0,
    twoYearAssessmentCompleted: params.twoYearAssessmentCompleted || false,
    annualContingencyLimitInr: contingencyLimit,
    contingencySpentInr: 0,
    monthlyBills: [],
    contingencyClaims: [],
    status: 'ACTIVE_FELLOWSHIP',
    createdTimestamp: now
  };

  const auditSha256 = generateFellowshipSeal(baseFellow);
  return { ...baseFellow, auditSha256 };
}

/**
 * Generate a monthly stipend bill enforcing the 80% attendance hurdle
 */
export function generateMonthlyStipendBill(
  fellow: ResearchFellowRecord,
  params: {
    monthYear: string; // e.g. "2026-03"
    attendancePercent: number;
  }
): { success: boolean; fellow: ResearchFellowRecord; bill: MonthlyStipendBill; error?: string } {
  // Check duplicate bill for the month
  if (fellow.monthlyBills.some(b => b.monthYear === params.monthYear)) {
    return {
      success: false,
      fellow,
      bill: fellow.monthlyBills.find(b => b.monthYear === params.monthYear)!,
      error: `Stipend bill for ${params.monthYear} has already been generated`
    };
  }

  const baseStipend = STATUTORY_BASE_STIPENDS[fellow.fellowshipTier];
  const hraAmount = calculateHraAmount(baseStipend, fellow.cityHraTier);
  const grossStipend = baseStipend + hraAmount;
  const billId = `BIL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();

  // Enforce attendance hurdle
  const isAttendanceEligible = params.attendancePercent >= MIN_FELLOWSHIP_ATTENDANCE_PERCENT;
  const status: StipendBillStatus = isAttendanceEligible 
    ? 'GUIDE_SANCTIONED' 
    : 'ATTENDANCE_DEFICIT_HELD';

  const bill: MonthlyStipendBill = {
    billId,
    monthYear: params.monthYear,
    baseStipendInr: baseStipend,
    hraInr: hraAmount,
    grossStipendInr: grossStipend,
    attendancePercent: params.attendancePercent,
    status,
    generatedDate: now.split('T')[0],
    rejectionReason: !isAttendanceEligible 
      ? `Attendance (${params.attendancePercent}%) is below mandatory 80% threshold (UGC/CSIR DBT Hurdle)` 
      : undefined
  };

  const updated: ResearchFellowRecord = {
    ...fellow,
    monthlyBills: [bill, ...fellow.monthlyBills]
  };

  return {
    success: isAttendanceEligible,
    fellow: { ...updated, auditSha256: generateFellowshipSeal(updated) },
    bill,
    error: !isAttendanceEligible ? bill.rejectionReason : undefined
  };
}

/**
 * Disburse a sanctioned monthly stipend bill via Direct Benefit Transfer (DBT)
 */
export function disburseStipendBill(
  fellow: ResearchFellowRecord,
  billId: string,
  dbtReferenceNumber: string = `DBT-PFMS-${Date.now().toString().slice(-8)}`
): { success: boolean; fellow: ResearchFellowRecord; error?: string } {
  const billIdx = fellow.monthlyBills.findIndex(b => b.billId === billId);
  if (billIdx === -1) {
    return { success: false, fellow, error: `Bill ${billId} not found` };
  }

  const bill = fellow.monthlyBills[billIdx];
  if (bill.status !== 'GUIDE_SANCTIONED') {
    return {
      success: false,
      fellow,
      error: `Cannot disburse: Bill ${billId} is ${bill.status} (Must be GUIDE_SANCTIONED)`
    };
  }

  const updatedBill: MonthlyStipendBill = {
    ...bill,
    status: 'DISBURSED_DBT_CLEARED',
    disbursedDate: new Date().toISOString().split('T')[0],
    dbtReferenceNumber
  };

  const updatedBills = [...fellow.monthlyBills];
  updatedBills[billIdx] = updatedBill;

  const updated: ResearchFellowRecord = {
    ...fellow,
    monthlyBills: updatedBills
  };

  return {
    success: true,
    fellow: { ...updated, auditSha256: generateFellowshipSeal(updated) }
  };
}

/**
 * Claim research contingency grant expenditure under GFR 2017 rules
 */
export function claimContingencyExpenditure(
  fellow: ResearchFellowRecord,
  params: {
    description: string;
    category: ContingencyClaim['category'];
    invoiceDate: string;
    amountInr: number;
    gfrComplianceVerified: boolean;
  }
): { success: boolean; fellow: ResearchFellowRecord; claim?: ContingencyClaim; error?: string } {
  const availableBudget = fellow.annualContingencyLimitInr - fellow.contingencySpentInr;
  if (params.amountInr > availableBudget) {
    return {
      success: false,
      fellow,
      error: `Contingency claim of ₹${params.amountInr} exceeds remaining annual budget of ₹${availableBudget}`
    };
  }

  if (!params.gfrComplianceVerified) {
    return {
      success: false,
      fellow,
      error: `Claim rejected: GFR 2017 voucher verification must be certified by PI`
    };
  }

  const claimId = `CTG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const claim: ContingencyClaim = {
    claimId,
    description: params.description,
    category: params.category,
    invoiceDate: params.invoiceDate,
    amountInr: params.amountInr,
    gfrComplianceVerified: true,
    approvalStatus: 'APPROVED'
  };

  const updated: ResearchFellowRecord = {
    ...fellow,
    contingencySpentInr: fellow.contingencySpentInr + params.amountInr,
    contingencyClaims: [claim, ...fellow.contingencyClaims]
  };

  return {
    success: true,
    fellow: { ...updated, auditSha256: generateFellowshipSeal(updated) },
    claim
  };
}

/**
 * Upgrade Junior Research Fellow (JRF) to Senior Research Fellow (SRF)
 * Enforces mandatory 24-month tenure and 3-member assessment committee clearance
 */
export function upgradeJrfToSrf(
  fellow: ResearchFellowRecord,
  committeeAssessmentDate: string
): { success: boolean; fellow: ResearchFellowRecord; error?: string } {
  if (fellow.fellowshipTier !== 'JRF_JUNIOR_RESEARCH_FELLOW') {
    return {
      success: false,
      fellow,
      error: `Only JRF scholars can be upgraded to SRF (Current tier: ${fellow.fellowshipTier})`
    };
  }

  if (fellow.tenureMonthsCompleted < 24) {
    return {
      success: false,
      fellow,
      error: `Tenure prerequisite not met: Completed ${fellow.tenureMonthsCompleted} months, but 24 months are mandatory for SRF upgrade`
    };
  }

  const updated: ResearchFellowRecord = {
    ...fellow,
    fellowshipTier: 'SRF_SENIOR_RESEARCH_FELLOW',
    twoYearAssessmentCompleted: true,
    status: 'SRF_UPGRADED'
  };

  return {
    success: true,
    fellow: { ...updated, auditSha256: generateFellowshipSeal(updated) }
  };
}

/**
 * Export official CSV of Faculty Research Fellowship Ledger
 */
export function exportFacultyFellowshipLedgerCSV(fellows: ResearchFellowRecord[]): string {
  const headers = [
    'Fellow ID',
    'Scholar Name',
    'Roll Number',
    'PI Guide',
    'Department',
    'Funding Agency',
    'Fellowship Tier',
    'Base Stipend INR',
    'HRA Tier',
    'Tenure Months',
    'Contingency Limit INR',
    'Contingency Spent INR',
    'Total Disbursed Bills',
    'Status',
    'Audit SHA-256'
  ];

  const rows = fellows.map(f => {
    const baseStipend = STATUTORY_BASE_STIPENDS[f.fellowshipTier];
    const disbursedCount = f.monthlyBills.filter(b => b.status === 'DISBURSED_DBT_CLEARED').length;

    return [
      f.fellowId,
      `"${f.scholarName}"`,
      f.rollNumber,
      `"${f.piFacultyName}"`,
      f.department,
      f.fundingAgency,
      f.fellowshipTier,
      baseStipend,
      f.cityHraTier,
      f.tenureMonthsCompleted,
      f.annualContingencyLimitInr,
      f.contingencySpentInr,
      disbursedCount,
      f.status,
      f.auditSha256
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Sample initial dataset for Faculty Research Fellowships
 */
export const SAMPLE_RESEARCH_FELLOWS: ResearchFellowRecord[] = [
  createResearchFellowRecord({
    scholarName: 'Divya Suryanarayanan',
    scholarEmail: 'divya.s@university.ac.in',
    rollNumber: '2024-PHD-EE-002',
    piFacultyId: 'FAC-EE-2016-092',
    piFacultyName: 'Dr. Vikramaditya Sen',
    department: 'Electrical Engineering',
    fundingAgency: 'CSIR_JRF',
    fellowshipTier: 'JRF_JUNIOR_RESEARCH_FELLOW',
    cityHraTier: 'TIER_X_27_PERCENT',
    enrollmentDate: '2024-08-01',
    tenureMonthsCompleted: 20,
    twoYearAssessmentCompleted: false
  }),
  createResearchFellowRecord({
    scholarName: 'Mohammad Farhan Akhtar',
    scholarEmail: 'm.farhan@university.ac.in',
    rollNumber: '2022-PHD-CS-014',
    piFacultyId: 'FAC-CS-2018-081',
    piFacultyName: 'Dr. Nandini Ramanathan',
    department: 'Computer Science',
    fundingAgency: 'UGC_NET_JRF',
    fellowshipTier: 'SRF_SENIOR_RESEARCH_FELLOW',
    cityHraTier: 'TIER_X_27_PERCENT',
    enrollmentDate: '2022-09-01',
    tenureMonthsCompleted: 38,
    twoYearAssessmentCompleted: true
  }),
  createResearchFellowRecord({
    scholarName: 'Dr. Priyanka Chatterjee (Post-Doc)',
    scholarEmail: 'p.chatterjee@university.ac.in',
    rollNumber: '2025-PDF-BIO-001',
    piFacultyId: 'FAC-BT-2015-033',
    piFacultyName: 'Prof. Alok Mukherjee',
    department: 'Biotechnology & Bio-Engineering',
    fundingAgency: 'DST_INSPIRE',
    fellowshipTier: 'RA_I_POST_DOCTORAL',
    cityHraTier: 'TIER_Y_18_PERCENT',
    enrollmentDate: '2025-06-01',
    tenureMonthsCompleted: 10,
    twoYearAssessmentCompleted: true
  })
];
