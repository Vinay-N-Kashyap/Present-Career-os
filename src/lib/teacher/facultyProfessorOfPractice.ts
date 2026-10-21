/**
 * Faculty Professor of Practice (PoP), Industry Chair & Adjunct Scholar Governance Engine
 * 
 * Statutory & Regulatory Framework:
 * - UGC Guidelines for Engaging Professor of Practice in Universities and Colleges (2022)
 * - Minimum 15-Year Industry / Professional Leadership Criteria (PhD requirement waived by UGC)
 * - Three Funding Models: Industry-Sponsored, University-Funded (Max ₹1,00,000/month or ₹8,000/day), Honorary
 * - Institutional Ceiling: Maximum 10% of total sanctioned academic faculty strength
 * - Maximum Appointment Duration: Initial 1 year, extendable up to a maximum of 3 (or 4) years total
 * - Section 194J Income Tax Act (10% Statutory TDS on Professional Advisory & Honorarium Disbursals)
 * - NEP 2020 Higher Education Industry-Academia Synergy & Experiential Learning Framework
 */

import { createHash } from 'crypto';

export type PoPFundingModel = 
  | 'INDUSTRY_SPONSORED_POP'
  | 'UNIVERSITY_FUNDED_POP'
  | 'HONORARY_POP';

export type PoPTenureStatus = 
  | 'APPOINTMENT_ACTIVE'
  | 'TENURE_EXTENDED'
  | 'TENURE_COMPLETED_DISCHARGED'
  | 'EARLY_RELIEVED';

export interface PoPHonorariumBill {
  billId: string;
  billingMonth: string; // e.g. "2026-03"
  daysDelivered: number;
  dailyRateInr: number;
  grossAmountInr: number;
  tdsDeductionInr: number; // 10% TDS under Sec 194J
  netPayableInr: number;
  payoutReference?: string;
  disbursementDate?: string;
  status: 'GENERATED_PENDING_AUDIT' | 'DISBURSED_CLEARED';
}

export interface ProfessorOfPracticeRecord {
  popRecordId: string; // Token format: POP-[YEAR]-[DEPT]-[HEX6]
  expertName: string;
  parentOrganization: string;
  designationInIndustry: string;
  totalYearsIndustryExperience: number; // Minimum 15 years required under UGC guidelines
  department: string;
  fundingModel: PoPFundingModel;
  sponsoringIndustryPartner?: string;
  monthlyHonorariumRateInr: number; // Max ₹1,00,000 under university-funded scheme
  appointmentStartDate: string;
  appointmentEndDate: string;
  tenureYearsTotal: number; // Max 3 (or 4) years total duration
  coTaughtCourseCodes: string[];
  mentoredCapstonesCount: number;
  status: PoPTenureStatus;
  honorariumBills: PoPHonorariumBill[];
  createdTimestamp: string;
  auditSha256: string;
}

// Statutory UGC Guidelines 2022 Constants
export const MIN_INDUSTRY_EXPERIENCE_YEARS = 15;
export const MAX_POP_TENURE_YEARS = 4;
export const MAX_UNIVERSITY_MONTHLY_HONORARIUM_INR = 100000;
export const STATUTORY_TDS_PERCENT = 10;

/**
 * Generate cryptographic SHA-256 seal for Professor of Practice record
 */
export function generatePoPSeal(record: Omit<ProfessorOfPracticeRecord, 'auditSha256'>): string {
  const payload = [
    record.popRecordId,
    record.expertName,
    record.parentOrganization,
    record.totalYearsIndustryExperience,
    record.fundingModel,
    record.monthlyHonorariumRateInr,
    record.status,
    record.tenureYearsTotal,
    record.honorariumBills.length
  ].join('|');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Format statutory unique PoP tracking token
 */
export function formatPoPRecordId(department: string, year: number = 2026): string {
  const deptCode = department.replace(/[^A-Z]/gi, '').substring(0, 4).toUpperCase() || 'ENGG';
  const hex = createHash('sha256')
    .update(`${department}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();
  return `POP-${year}-${deptCode}-${hex}`;
}

/**
 * Onboard and engage a new Professor of Practice under UGC 2022 Guidelines
 */
export function onboardProfessorOfPractice(params: {
  expertName: string;
  parentOrganization: string;
  designationInIndustry: string;
  totalYearsIndustryExperience: number;
  department: string;
  fundingModel: PoPFundingModel;
  sponsoringIndustryPartner?: string;
  monthlyHonorariumRateInr?: number;
  appointmentStartDate?: string;
  tenureYears?: number;
  coTaughtCourseCodes?: string[];
  year?: number;
}): ProfessorOfPracticeRecord {
  if (params.totalYearsIndustryExperience < MIN_INDUSTRY_EXPERIENCE_YEARS) {
    throw new Error(
      `Eligibility rejection: Candidate possesses ${params.totalYearsIndustryExperience} years experience. UGC 2022 guidelines mandate a minimum of 15 years distinguished professional practice.`
    );
  }

  const tenureYears = params.tenureYears || 1;
  if (tenureYears > MAX_POP_TENURE_YEARS) {
    throw new Error(
      `Invalid tenure: UGC guidelines restrict total appointment duration to a maximum of ${MAX_POP_TENURE_YEARS} years.`
    );
  }

  let honorarium = params.monthlyHonorariumRateInr || 0;
  if (params.fundingModel === 'UNIVERSITY_FUNDED_POP' && honorarium > MAX_UNIVERSITY_MONTHLY_HONORARIUM_INR) {
    throw new Error(
      `Statutory honorarium cap violation: University-funded PoP cannot exceed ₹${MAX_UNIVERSITY_MONTHLY_HONORARIUM_INR.toLocaleString('en-IN')}/month under UGC norms.`
    );
  } else if (params.fundingModel === 'HONORARY_POP') {
    honorarium = 0;
  }

  const popRecordId = formatPoPRecordId(params.department, params.year);
  const startDate = params.appointmentStartDate || new Date().toISOString().split('T')[0];
  const start = new Date(startDate);
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + tenureYears);

  const baseRecord: Omit<ProfessorOfPracticeRecord, 'auditSha256'> = {
    popRecordId,
    expertName: params.expertName,
    parentOrganization: params.parentOrganization,
    designationInIndustry: params.designationInIndustry,
    totalYearsIndustryExperience: params.totalYearsIndustryExperience,
    department: params.department,
    fundingModel: params.fundingModel,
    sponsoringIndustryPartner: params.sponsoringIndustryPartner,
    monthlyHonorariumRateInr: honorarium,
    appointmentStartDate: startDate,
    appointmentEndDate: end.toISOString().split('T')[0],
    tenureYearsTotal: tenureYears,
    coTaughtCourseCodes: params.coTaughtCourseCodes || ['CS-701-ADV-SYS', 'CS-802-IND-CAP'],
    mentoredCapstonesCount: 0,
    status: 'APPOINTMENT_ACTIVE',
    honorariumBills: [],
    createdTimestamp: new Date().toISOString()
  };

  const auditSha256 = generatePoPSeal(baseRecord);
  return { ...baseRecord, auditSha256 };
}

/**
 * Generate monthly honorarium claim bill with 10% statutory TDS under Section 194J
 */
export function generatePoPHonorariumBill(
  record: ProfessorOfPracticeRecord,
  params: {
    billingMonth: string;
    daysDelivered: number;
  }
): { record: ProfessorOfPracticeRecord; bill: PoPHonorariumBill } {
  if (record.fundingModel === 'HONORARY_POP') {
    throw new Error(`Honorary Professors of Practice do not draw monthly professional honorarium.`);
  }

  const dailyRate = Math.round(record.monthlyHonorariumRateInr / 20); // assuming standard 20 academic working days
  const grossAmount = Math.min(record.monthlyHonorariumRateInr, dailyRate * params.daysDelivered);
  const tdsDeduction = Math.round(grossAmount * (STATUTORY_TDS_PERCENT / 100));
  const netPayable = grossAmount - tdsDeduction;

  const billId = `BILL-POP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const bill: PoPHonorariumBill = {
    billId,
    billingMonth: params.billingMonth,
    daysDelivered: params.daysDelivered,
    dailyRateInr: dailyRate,
    grossAmountInr: grossAmount,
    tdsDeductionInr: tdsDeduction,
    netPayableInr: netPayable,
    status: 'GENERATED_PENDING_AUDIT'
  };

  const updated: ProfessorOfPracticeRecord = {
    ...record,
    honorariumBills: [bill, ...record.honorariumBills]
  };

  return {
    record: { ...updated, auditSha256: generatePoPSeal(updated) },
    bill
  };
}

/**
 * Disburse approved honorarium to Professor of Practice bank account
 */
export function disbursePoPHonorarium(
  record: ProfessorOfPracticeRecord,
  billId: string,
  payoutRef: string = `TXN-NEFT-POP-${Date.now().toString().slice(-8)}`
): { success: boolean; record: ProfessorOfPracticeRecord; error?: string } {
  const billIdx = record.honorariumBills.findIndex(b => b.billId === billId);
  if (billIdx === -1) {
    return { success: false, record, error: `Bill ${billId} not found` };
  }

  const bill = record.honorariumBills[billIdx];
  if (bill.status !== 'GENERATED_PENDING_AUDIT') {
    return { success: false, record, error: `Bill ${billId} is already disbursed` };
  }

  const updatedBill: PoPHonorariumBill = {
    ...bill,
    status: 'DISBURSED_CLEARED',
    disbursementDate: new Date().toISOString().split('T')[0],
    payoutReference: payoutRef
  };

  const updatedBills = [...record.honorariumBills];
  updatedBills[billIdx] = updatedBill;

  const updated: ProfessorOfPracticeRecord = {
    ...record,
    honorariumBills: updatedBills
  };

  return {
    success: true,
    record: { ...updated, auditSha256: generatePoPSeal(updated) }
  };
}

/**
 * Export official CSV of Professor of Practice (PoP) Ledger
 */
export function exportPoPLedgerCSV(records: ProfessorOfPracticeRecord[]): string {
  const headers = [
    'PoP Record ID',
    'Expert Name',
    'Parent Organization',
    'Industry Experience (Years)',
    'Department',
    'Funding Model',
    'Monthly Honorarium INR',
    'Tenure (Years)',
    'Co-Taught Courses',
    'Status',
    'Audit SHA-256'
  ];

  const rows = records.map(r => {
    return [
      r.popRecordId,
      `"${r.expertName}"`,
      `"${r.parentOrganization}"`,
      r.totalYearsIndustryExperience,
      r.department,
      r.fundingModel,
      r.monthlyHonorariumRateInr,
      r.tenureYearsTotal,
      `"${r.coTaughtCourseCodes.join('; ')}"`,
      r.status,
      r.auditSha256
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Sample initial dataset for Professor of Practice
 */
export const SAMPLE_POP_RECORDS: ProfessorOfPracticeRecord[] = [
  onboardProfessorOfPractice({
    expertName: 'Rameshwaram Krishnan',
    parentOrganization: 'Intel Technology India & Semiconductor Council',
    designationInIndustry: 'Distinguished Fellow & VP of VLSI Systems',
    totalYearsIndustryExperience: 24,
    department: 'Electronics & Communication',
    fundingModel: 'INDUSTRY_SPONSORED_POP',
    sponsoringIndustryPartner: 'Intel India Semiconductor CSR Fund',
    monthlyHonorariumRateInr: 150000,
    tenureYears: 2,
    coTaughtCourseCodes: ['ECE-740-CHIP-ARCH', 'ECE-801-PHYSICAL-DESIGN']
  }),
  onboardProfessorOfPractice({
    expertName: 'Dr. (hc) Malini Narayanan',
    parentOrganization: 'Tata Consultancy Services Research & Innovations',
    designationInIndustry: 'Chief AI Architect & Global Practice Lead',
    totalYearsIndustryExperience: 19,
    department: 'Computer Science & AI',
    fundingModel: 'UNIVERSITY_FUNDED_POP',
    monthlyHonorariumRateInr: 100000,
    tenureYears: 1,
    coTaughtCourseCodes: ['CS-620-CLOUD-AGENT', 'CS-710-SYSTEM-ARCH']
  })
];
