/**
 * Central University Alumni Endowment, Philanthropy & Legacy Giving Engine
 * Statutory Compliance: Indian Trusts Act 1882, Income Tax Act Section 80G,
 * Foreign Contribution Regulation Act (FCRA 2010), and MoE Guidelines on University Endowment Funds.
 *
 * Platform: PinIT Career OS - Campus Administration Platform
 * Zero-Collision Invariant: Pure Branch C administrative governance.
 */

import { createHash } from 'crypto';

export type EndowmentCategory =
  | 'CHAIR_PROFESSORSHIP'
  | 'STUDENT_MERIT_SCHOLARSHIP'
  | 'INFRASTRUCTURE_NAMING'
  | 'RESEARCH_INCUBATION_SEED'
  | 'UNRESTRICTED_DISCRETIONARY';

export type DonationCurrency = 'INR' | 'USD' | 'GBP' | 'EUR';

export type PaymentInstrument =
  | 'DOMESTIC_NEFT_RTGS'
  | 'OVERSEAS_WIRE_SWIFT'
  | 'ESCROW_ACCOUNT_TRANSFER'
  | 'EQUITY_STOCK_TRANSFER'
  | 'BANKERS_CHEQUE';

export type EndowmentLifecycleStage =
  | 'PLEDGE_FILED'
  | 'FCRA_CLEARANCE_PENDING'
  | 'CORPUS_REALIZED'
  | 'SECTION_80G_CERTIFIED'
  | 'ENDOWMENT_CHAIR_OPERATIONAL'
  | 'PLEDGE_REVOKED';

export interface EndowmentPledgeRecord {
  endowmentId: string;
  trackingToken: string; // ENDW-[YEAR]-[CAT]-[HEX6]
  donorFullName: string;
  donorBatchYear: number;
  donorAlmaMaterDegree: string;
  donorPanNumber: string;
  donorEmail: string;
  organizationAffiliation?: string;
  category: EndowmentCategory;
  pledgedAmount: number;
  currency: DonationCurrency;
  exchangeRateToInr: number;
  realizedAmountInr: number;
  isForeignDonation: boolean;
  fcraApprovalNumber?: string;
  section80gCertNumber?: string;
  designatedDepartmentOrPurpose: string;
  expectedAnnualYieldRatePercentage: number; // default e.g. 6.5%
  annualNetPayoutInr: number;
  stage: EndowmentLifecycleStage;
  cryptographicSeal?: string; // SHA-256 seal
  lastUpdated: string;
}

/**
 * Standard University Endowment Yield & Admin Overhead Parameters:
 * - Sovereign Bond Yield: 6.5% per annum
 * - Corpus Maintenance & University Reinvestment Overhead: 0.5% per annum
 * - Net Effective Payout Rate: 6.0% per annum
 */
export const DEFAULT_ENDOWMENT_YIELD_RATE = 6.5;
export const ENDOWMENT_ADMIN_OVERHEAD_RATE = 0.5;

/**
 * Minimum Corpus Benchmarks (in INR)
 */
export const MIN_CHAIR_PROFESSORSHIP_CORPUS_INR = 50000000; // ₹5 Crore
export const MIN_SCHOLARSHIP_CORPUS_INR = 5000000;          // ₹50 Lakhs
export const MIN_NAMING_RIGHTS_CORPUS_INR = 100000000;      // ₹10 Crore

/**
 * Generate unique endowment tracking token: ENDW-[YEAR]-[CAT]-[HEX6]
 */
export function generateEndowmentToken(
  category: EndowmentCategory,
  year: number = new Date().getFullYear()
): string {
  const cleanCat = category.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'ENDW';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `ENDW-${year}-${cleanCat}-${randomHex}`;
}

/**
 * Calculate net annual endowment payout yield:
 * Net Payout = Realized Corpus * ((Yield Rate - Admin Overhead) / 100)
 */
export function calculateAnnualEndowmentPayout(
  corpusInr: number,
  yieldRatePercentage: number = DEFAULT_ENDOWMENT_YIELD_RATE,
  adminOverheadPercentage: number = ENDOWMENT_ADMIN_OVERHEAD_RATE
): number {
  if (corpusInr <= 0) return 0;
  const netRate = Math.max(0, yieldRatePercentage - adminOverheadPercentage);
  const annualPayout = corpusInr * (netRate / 100);
  return Number(annualPayout.toFixed(2));
}

/**
 * Generate tamper-proof SHA-256 seal for endowment record
 */
export function generateEndowmentSeal(
  record: Omit<EndowmentPledgeRecord, 'cryptographicSeal'>
): string {
  const canonicalPayload = [
    record.endowmentId,
    record.trackingToken,
    record.donorFullName,
    record.donorPanNumber,
    record.category,
    record.pledgedAmount,
    record.currency,
    record.realizedAmountInr.toFixed(2),
    record.isForeignDonation ? record.fcraApprovalNumber || 'FCRA_REQUIRED' : 'DOMESTIC',
    record.section80gCertNumber || 'PENDING_80G',
    record.stage,
    record.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Register a new alumni endowment pledge
 */
export function registerEndowmentPledge(params: {
  donorFullName: string;
  donorBatchYear: number;
  donorAlmaMaterDegree: string;
  donorPanNumber: string;
  donorEmail: string;
  organizationAffiliation?: string;
  category: EndowmentCategory;
  pledgedAmount: number;
  currency: DonationCurrency;
  exchangeRateToInr?: number;
  isForeignDonation: boolean;
  fcraApprovalNumber?: string;
  designatedDepartmentOrPurpose: string;
  expectedAnnualYieldRatePercentage?: number;
}): EndowmentPledgeRecord {
  if (!params.donorFullName.trim()) {
    throw new Error('Donor full name cannot be blank.');
  }

  if (params.pledgedAmount <= 0) {
    throw new Error('Pledged amount must be strictly greater than 0.');
  }

  if (params.isForeignDonation && params.currency === 'INR') {
    throw new Error('Foreign donations must designate an overseas currency or FCRA approved banking channel.');
  }

  const exchangeRate = params.exchangeRateToInr ?? (params.currency === 'INR' ? 1.0 : 85.0);
  const realizedAmountInr = Number((params.pledgedAmount * exchangeRate).toFixed(2));
  const trackingToken = generateEndowmentToken(params.category);
  const now = new Date().toISOString();

  const yieldRate = params.expectedAnnualYieldRatePercentage ?? DEFAULT_ENDOWMENT_YIELD_RATE;
  const annualNetPayoutInr = calculateAnnualEndowmentPayout(realizedAmountInr, yieldRate);

  const initialStage: EndowmentLifecycleStage = params.isForeignDonation && !params.fcraApprovalNumber
    ? 'FCRA_CLEARANCE_PENDING'
    : 'PLEDGE_FILED';

  const baseRecord: Omit<EndowmentPledgeRecord, 'cryptographicSeal'> = {
    endowmentId: `ENDW-${Date.now().toString(36).toUpperCase()}`,
    trackingToken,
    donorFullName: params.donorFullName.trim(),
    donorBatchYear: params.donorBatchYear,
    donorAlmaMaterDegree: params.donorAlmaMaterDegree.trim(),
    donorPanNumber: params.donorPanNumber.trim().toUpperCase(),
    donorEmail: params.donorEmail.trim().toLowerCase(),
    organizationAffiliation: params.organizationAffiliation?.trim(),
    category: params.category,
    pledgedAmount: params.pledgedAmount,
    currency: params.currency,
    exchangeRateToInr: exchangeRate,
    realizedAmountInr,
    isForeignDonation: params.isForeignDonation,
    fcraApprovalNumber: params.fcraApprovalNumber?.trim(),
    designatedDepartmentOrPurpose: params.designatedDepartmentOrPurpose.trim(),
    expectedAnnualYieldRatePercentage: yieldRate,
    annualNetPayoutInr,
    stage: initialStage,
    lastUpdated: now,
  };

  const cryptographicSeal = generateEndowmentSeal(baseRecord);
  return { ...baseRecord, cryptographicSeal };
}

/**
 * Realize corpus funds and issue Income Tax Act Section 80G Exemption Certificate
 */
export function realizeCorpusAndCertify80G(
  record: EndowmentPledgeRecord,
  actualRealizedInr: number
): EndowmentPledgeRecord {
  if (record.stage === 'PLEDGE_REVOKED') {
    throw new Error('Cannot realize corpus for a revoked pledge.');
  }

  if (record.isForeignDonation && !record.fcraApprovalNumber) {
    throw new Error('Statutory FCRA clearance required before realizing foreign alumni endowment corpus.');
  }

  const now = new Date().toISOString();
  const cert80g = `80G-IT-UNIV-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
  const annualNetPayoutInr = calculateAnnualEndowmentPayout(
    actualRealizedInr,
    record.expectedAnnualYieldRatePercentage
  );

  const updated: Omit<EndowmentPledgeRecord, 'cryptographicSeal'> = {
    ...record,
    realizedAmountInr: actualRealizedInr,
    section80gCertNumber: cert80g,
    annualNetPayoutInr,
    stage: 'SECTION_80G_CERTIFIED',
    lastUpdated: now,
  };

  const cryptographicSeal = generateEndowmentSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Operationalize endowed chair professorship or permanent initiative
 */
export function activateEndowmentChair(record: EndowmentPledgeRecord): EndowmentPledgeRecord {
  if (record.stage !== 'SECTION_80G_CERTIFIED' && record.stage !== 'CORPUS_REALIZED') {
    throw new Error(`Corpus must be realized and certified before activation (current: ${record.stage}).`);
  }

  const now = new Date().toISOString();
  const updated: Omit<EndowmentPledgeRecord, 'cryptographicSeal'> = {
    ...record,
    stage: 'ENDOWMENT_CHAIR_OPERATIONAL',
    lastUpdated: now,
  };

  const cryptographicSeal = generateEndowmentSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Export Alumni Endowment Ledger as statutory CSV
 */
export function exportAlumniEndowmentLedgerCSV(records: EndowmentPledgeRecord[]): string {
  const headers = [
    'Endowment ID',
    'Tracking Token',
    'Donor Name',
    'Batch Year',
    'Degree',
    'PAN Number',
    'Category',
    'Pledged Amount',
    'Currency',
    'Realized INR',
    'Foreign Donation',
    'FCRA Reg No',
    '80G Certificate No',
    'Designated Purpose',
    'Annual Payout INR',
    'Stage',
    'Cryptographic Seal',
  ];

  const rows = records.map((r) => [
    `"${r.endowmentId}"`,
    `"${r.trackingToken}"`,
    `"${r.donorFullName.replace(/"/g, '""')}"`,
    r.donorBatchYear,
    `"${r.donorAlmaMaterDegree}"`,
    `"${r.donorPanNumber}"`,
    `"${r.category}"`,
    r.pledgedAmount,
    `"${r.currency}"`,
    r.realizedAmountInr,
    r.isForeignDonation ? 'YES' : 'NO',
    `"${r.fcraApprovalNumber || 'N/A'}"`,
    `"${r.section80gCertNumber || 'PENDING'}"`,
    `"${r.designatedDepartmentOrPurpose.replace(/"/g, '""')}"`,
    r.annualNetPayoutInr,
    `"${r.stage}"`,
    `"${r.cryptographicSeal || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Demonstration Alumni Endowment Records
 */
export const INITIAL_ALUMNI_ENDOWMENTS: EndowmentPledgeRecord[] = [
  {
    endowmentId: 'ENDW-2026-001',
    trackingToken: 'ENDW-2026-CHAI-991A01',
    donorFullName: 'Rajesh & Vandana Mehta',
    donorBatchYear: 1994,
    donorAlmaMaterDegree: 'B.Tech Computer Science & Engineering',
    donorPanNumber: 'AAAPM8841K',
    donorEmail: 'rajesh.mehta@alumni.univ.edu',
    organizationAffiliation: 'Mehta Silicon Ventures (Palo Alto, CA)',
    category: 'CHAIR_PROFESSORSHIP',
    pledgedAmount: 1000000,
    currency: 'USD',
    exchangeRateToInr: 86.5,
    realizedAmountInr: 86500000, // ₹8.65 Crore
    isForeignDonation: true,
    fcraApprovalNumber: 'FCRA-MHA-2025-08149',
    section80gCertNumber: '80G-IT-UNIV-2026-99A01',
    designatedDepartmentOrPurpose: 'Mehta Chair Professorship in Quantum Computing & AI Ethics',
    expectedAnnualYieldRatePercentage: 6.5,
    annualNetPayoutInr: 5190000, // ₹51.9 Lakhs/year net payout (6.0%)
    stage: 'ENDOWMENT_CHAIR_OPERATIONAL',
    cryptographicSeal: '991a013847291048291847192837482910482918471928374829104829184701',
    lastUpdated: '2026-02-14T11:00:00Z',
  },
  {
    endowmentId: 'ENDW-2026-002',
    trackingToken: 'ENDW-2026-STUD-77B214',
    donorFullName: 'Dr. Alok Nath Mukherjee',
    donorBatchYear: 1982,
    donorAlmaMaterDegree: 'M.Sc Physics & Electronics',
    donorPanNumber: 'ABCPM3319L',
    donorEmail: 'alok.mukherjee@alumni.univ.edu',
    organizationAffiliation: 'Mukherjee Foundation India',
    category: 'STUDENT_MERIT_SCHOLARSHIP',
    pledgedAmount: 25000000,
    currency: 'INR',
    exchangeRateToInr: 1.0,
    realizedAmountInr: 25000000, // ₹2.5 Crore
    isForeignDonation: false,
    section80gCertNumber: '80G-IT-UNIV-2026-77B21',
    designatedDepartmentOrPurpose: 'Mukherjee Scholars: Full Tuition Fellowship for 10 Rural Women in STEM',
    expectedAnnualYieldRatePercentage: 6.5,
    annualNetPayoutInr: 1500000, // ₹15.0 Lakhs/year (1.5L x 10 scholars)
    stage: 'SECTION_80G_CERTIFIED',
    cryptographicSeal: '77b2143847291048291847192837482910482918471928374829104829184705',
    lastUpdated: '2026-03-01T15:30:00Z',
  },
  {
    endowmentId: 'ENDW-2026-003',
    trackingToken: 'ENDW-2026-INFR-44D998',
    donorFullName: 'Kavita Sundaram',
    donorBatchYear: 2001,
    donorAlmaMaterDegree: 'B.Tech Electrical & Electronics',
    donorPanNumber: 'AANPS4419E',
    donorEmail: 'kavita.s@alumni.univ.edu',
    organizationAffiliation: 'Sundaram Green Tech UK Ltd',
    category: 'INFRASTRUCTURE_NAMING',
    pledgedAmount: 1500000,
    currency: 'GBP',
    exchangeRateToInr: 108.0,
    realizedAmountInr: 162000000, // ₹16.2 Crore
    isForeignDonation: true,
    fcraApprovalNumber: undefined, // Pending FCRA
    designatedDepartmentOrPurpose: 'Sundaram Net-Zero Clean Energy Research Complex (Naming Rights)',
    expectedAnnualYieldRatePercentage: 6.5,
    annualNetPayoutInr: 9720000,
    stage: 'FCRA_CLEARANCE_PENDING',
    cryptographicSeal: '44d9983847291048291847192837482910482918471928374829104829184708',
    lastUpdated: '2026-03-20T09:15:00Z',
  },
];
