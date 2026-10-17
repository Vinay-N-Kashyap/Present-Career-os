/**
 * Faculty International Conference Deputation & CPDA Travel Grant Ledger Engine
 * Statutory Compliance: Cumulative Professional Development Allowance (CPDA - MoE/UGC),
 * DST-SERB International Travel Support (ITS) & Ministry of External Affairs (MEA) Political Clearance Norms.
 *
 * Platform: PinIT Career OS - Teacher Portal & Faculty Governance
 * Zero-Collision Invariant: Pure Branch C administrative and faculty governance.
 */

import { createHash } from 'crypto';

export type TravelFundingScheme =
  | 'INST_CPDA_SCHEME'
  | 'DST_SERB_ITS_GRANT'
  | 'SPONSORED_PROJECT_TRAVEL'
  | 'DEAN_SRIC_OVERHEAD_TRAVEL';

export type ConferenceTier =
  | 'TIER_1_CORE_A_STAR'
  | 'TIER_2_CORE_A'
  | 'TIER_3_SCOPUS_WOS';

export type DeputationStage =
  | 'PROPOSAL_SUBMITTED'
  | 'HOD_SUBSTITUTION_APPROVED'
  | 'MEA_CLEARANCE_OBTAINED'
  | 'DIRECTOR_SANCTIONED'
  | 'CONFERENCE_ATTENDED'
  | 'SETTLEMENT_REIMBURSED'
  | 'REJECTED';

export interface TravelExpenseBreakdown {
  airfare: number; // GeM/Air India economy
  registrationFee: number;
  dailyAllowance: number; // MEA per diem rates
  visaAndInsurance: number;
}

export interface TravelGrantRecord {
  grantId: string;
  deputationRefNumber: string; // CPDA-[YEAR]-[DEPT]-[HEX6]
  facultyName: string;
  department: string;
  fundingScheme: TravelFundingScheme;
  conferenceTitle: string;
  conferenceTier: ConferenceTier;
  destinationCityCountry: string; // e.g. Vancouver, Canada
  paperTitle: string;
  presentationType: 'ORAL_KEYNOTE' | 'ORAL_TECHNICAL' | 'POSTER_PRESENTATION';
  travelStartDate: string; // YYYY-MM-DD
  travelEndDate: string;
  availableCpdaBalance: number; // in INR
  requestedExpenses: TravelExpenseBreakdown;
  totalClaimAmount: number; // in INR
  sanctionedAmount?: number;
  meaClearanceNumber?: string; // MEA political clearance reference
  stage: DeputationStage;
  reimbursementDate?: string;
  cryptographicSeal?: string; // SHA-256 seal
  remarks?: string;
}

/**
 * Validates whether the requested travel grant outlay is within CPDA or grant solvency
 */
export function validateCpdaSolvency(
  requestedAmount: number,
  availableCpdaBalance: number
): boolean {
  return requestedAmount > 0 && requestedAmount <= availableCpdaBalance;
}

/**
 * Calculates sum of all travel expenses
 */
export function calculateTotalTravelClaim(expenses: TravelExpenseBreakdown): number {
  return (
    expenses.airfare +
    expenses.registrationFee +
    expenses.dailyAllowance +
    expenses.visaAndInsurance
  );
}

/**
 * Generates unique Deputation Reference Token: CPDA-[YEAR]-[DEPT]-[HEX6]
 */
export function generateDeputationToken(department: string): string {
  const deptCode = department
    .replace(/[^A-Za-z]/g, '')
    .slice(0, 4)
    .toUpperCase() || 'FAAC';
  const year = new Date().getFullYear();
  const hex = createHash('sha256')
    .update(`${deptCode}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .slice(0, 6)
    .toUpperCase();
  return `CPDA-${year}-${deptCode}-${hex}`;
}

/**
 * Computes tamper-proof SHA-256 sanction & settlement seal
 */
export function generateTravelGrantSeal(
  deputationRef: string,
  facultyName: string,
  conferenceTitle: string,
  destination: string,
  sanctionedAmount: number,
  date: string
): string {
  const payload = [
    deputationRef,
    facultyName,
    conferenceTitle,
    destination,
    sanctionedAmount.toFixed(2),
    date,
  ].join('||');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Submits new travel grant / conference deputation proposal
 */
export function submitTravelGrantProposal(params: {
  facultyName: string;
  department: string;
  fundingScheme: TravelFundingScheme;
  conferenceTitle: string;
  conferenceTier: ConferenceTier;
  destinationCityCountry: string;
  paperTitle: string;
  presentationType: 'ORAL_KEYNOTE' | 'ORAL_TECHNICAL' | 'POSTER_PRESENTATION';
  travelStartDate: string;
  travelEndDate: string;
  availableCpdaBalance: number;
  requestedExpenses: TravelExpenseBreakdown;
}): TravelGrantRecord {
  const totalClaimAmount = calculateTotalTravelClaim(params.requestedExpenses);

  if (params.fundingScheme === 'INST_CPDA_SCHEME') {
    if (!validateCpdaSolvency(totalClaimAmount, params.availableCpdaBalance)) {
      throw new Error('Requested travel outlay exceeds available 3-year CPDA block balance');
    }
  }

  const deputationRefNumber = generateDeputationToken(params.department);
  const grantId = `TRV-${Date.now().toString(36)}`;

  return {
    grantId,
    deputationRefNumber,
    facultyName: params.facultyName,
    department: params.department,
    fundingScheme: params.fundingScheme,
    conferenceTitle: params.conferenceTitle,
    conferenceTier: params.conferenceTier,
    destinationCityCountry: params.destinationCityCountry,
    paperTitle: params.paperTitle,
    presentationType: params.presentationType,
    travelStartDate: params.travelStartDate,
    travelEndDate: params.travelEndDate,
    availableCpdaBalance: params.availableCpdaBalance,
    requestedExpenses: params.requestedExpenses,
    totalClaimAmount,
    stage: 'PROPOSAL_SUBMITTED',
  };
}

/**
 * Advances deputation through approval stages (HOD, MEA clearance, Director sanction)
 */
export function advanceDeputationStage(
  grant: TravelGrantRecord,
  nextStage: DeputationStage,
  additionalDetails?: {
    meaClearanceNumber?: string;
    sanctionedAmount?: number;
    remarks?: string;
  }
): TravelGrantRecord {
  let seal = grant.cryptographicSeal;

  if (nextStage === 'DIRECTOR_SANCTIONED') {
    const sanctioned = additionalDetails?.sanctionedAmount || grant.totalClaimAmount;
    seal = generateTravelGrantSeal(
      grant.deputationRefNumber,
      grant.facultyName,
      grant.conferenceTitle,
      grant.destinationCityCountry,
      sanctioned,
      new Date().toISOString().split('T')[0]
    );
  }

  return {
    ...grant,
    stage: nextStage,
    meaClearanceNumber: additionalDetails?.meaClearanceNumber || grant.meaClearanceNumber,
    sanctionedAmount: additionalDetails?.sanctionedAmount || grant.sanctionedAmount || grant.totalClaimAmount,
    remarks: additionalDetails?.remarks || grant.remarks,
    cryptographicSeal: seal,
  };
}

/**
 * Finalizes post-conference settlement and audit reimbursement
 */
export function settleTravelReimbursement(
  grant: TravelGrantRecord,
  actualReimbursedAmount: number,
  settlementDate: string
): TravelGrantRecord {
  const seal = generateTravelGrantSeal(
    grant.deputationRefNumber,
    grant.facultyName,
    grant.conferenceTitle,
    grant.destinationCityCountry,
    actualReimbursedAmount,
    settlementDate
  );

  return {
    ...grant,
    stage: 'SETTLEMENT_REIMBURSED',
    sanctionedAmount: actualReimbursedAmount,
    reimbursementDate: settlementDate,
    cryptographicSeal: seal,
  };
}

/**
 * Exports CPDA and Travel Grant Ledger CSV for internal audit & UGC compliance
 */
export function exportTravelGrantsCSV(grants: TravelGrantRecord[]): string {
  const headers = [
    'Deputation Reference',
    'Faculty Name',
    'Department',
    'Funding Scheme',
    'Conference Title',
    'Tier',
    'Destination',
    'Paper Title',
    'Presentation Type',
    'Travel Start',
    'Travel End',
    'Total Claim (INR)',
    'Sanctioned / Reimbursed (INR)',
    'MEA Clearance Ref',
    'Stage',
    'Cryptographic SHA-256 Seal',
  ];

  const escapeField = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = grants.map((g) =>
    [
      escapeField(g.deputationRefNumber),
      escapeField(g.facultyName),
      escapeField(g.department),
      escapeField(g.fundingScheme),
      escapeField(g.conferenceTitle),
      escapeField(g.conferenceTier),
      escapeField(g.destinationCityCountry),
      escapeField(g.paperTitle),
      escapeField(g.presentationType),
      escapeField(g.travelStartDate),
      escapeField(g.travelEndDate),
      escapeField(g.totalClaimAmount),
      escapeField(g.sanctionedAmount ?? 'PENDING'),
      escapeField(g.meaClearanceNumber ?? 'NOT_REQUIRED_DOMESTIC'),
      escapeField(g.stage),
      escapeField(g.cryptographicSeal ?? 'N/A'),
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Seed Dataset for Faculty Conference Deputations & CPDA Grants
 */
export const SEED_TRAVEL_GRANTS: TravelGrantRecord[] = [
  {
    grantId: 'TRV-001',
    deputationRefNumber: 'CPDA-2026-COMP-8877AA',
    facultyName: 'Prof. Arvind Swaminathan',
    department: 'Computer Science & Engineering',
    fundingScheme: 'INST_CPDA_SCHEME',
    conferenceTitle: '45th IEEE Symposium on Security and Privacy (IEEE S&P 2026)',
    conferenceTier: 'TIER_1_CORE_A_STAR',
    destinationCityCountry: 'San Francisco, CA, USA',
    paperTitle: 'Sub-Microsecond Zero-Allocation Consensus in Distributed Low-Latency Systems',
    presentationType: 'ORAL_TECHNICAL',
    travelStartDate: '2026-05-18',
    travelEndDate: '2026-05-24',
    availableCpdaBalance: 280_000,
    requestedExpenses: {
      airfare: 110_000,
      registrationFee: 65_000,
      dailyAllowance: 48_000,
      visaAndInsurance: 15_000,
    },
    totalClaimAmount: 238_000,
    sanctionedAmount: 238_000,
    meaClearanceNumber: 'MEA/POL/2026/US-8891',
    stage: 'DIRECTOR_SANCTIONED',
    cryptographicSeal: 'b4a694f83726591024e58b19a12c4193856112948c264a9712bfd91e846011c3',
    remarks: 'Approved by Director with full airfare on Air India direct flight routing.',
  },
  {
    grantId: 'TRV-002',
    deputationRefNumber: 'CPDA-2026-CHEM-1122BB',
    facultyName: 'Dr. Meenakshi Sundaram',
    department: 'Department of Chemistry',
    fundingScheme: 'DST_SERB_ITS_GRANT',
    conferenceTitle: 'IUPAC World Chemistry Congress 2026',
    conferenceTier: 'TIER_2_CORE_A',
    destinationCityCountry: 'Munich, Germany',
    paperTitle: 'Novel Organocatalytic Enantioselective Synthesis using Green Solvents',
    presentationType: 'ORAL_TECHNICAL',
    travelStartDate: '2026-07-10',
    travelEndDate: '2026-07-16',
    availableCpdaBalance: 300_000,
    requestedExpenses: {
      airfare: 85_000,
      registrationFee: 45_000,
      dailyAllowance: 42_000,
      visaAndInsurance: 12_000,
    },
    totalClaimAmount: 184_000,
    sanctionedAmount: 184_000,
    meaClearanceNumber: 'MEA/POL/2026/EU-4412',
    stage: 'MEA_CLEARANCE_OBTAINED',
    remarks: 'DST-SERB 100% travel support approved. Awaiting Director final formal deputation sanction.',
  },
  {
    grantId: 'TRV-003',
    deputationRefNumber: 'CPDA-2026-BIOT-5566CC',
    facultyName: 'Dr. Vivek Bhattacharya',
    department: 'Biotechnology & Biomedical Engineering',
    fundingScheme: 'SPONSORED_PROJECT_TRAVEL',
    conferenceTitle: 'CRISPR 2026 International Symposium',
    conferenceTier: 'TIER_1_CORE_A_STAR',
    destinationCityCountry: 'Singapore',
    paperTitle: 'High-Fidelity Epigenetic Base Editing in Mammalian Cell Lines',
    presentationType: 'POSTER_PRESENTATION',
    travelStartDate: '2026-06-02',
    travelEndDate: '2026-06-06',
    availableCpdaBalance: 250_000,
    requestedExpenses: {
      airfare: 45_000,
      registrationFee: 35_000,
      dailyAllowance: 28_000,
      visaAndInsurance: 8_000,
    },
    totalClaimAmount: 116_000,
    stage: 'HOD_SUBSTITUTION_APPROVED',
    remarks: 'Teaching substitution arranged with Dr. Aruna Chatterjee for Biotech 6th Sem.',
  },
];
