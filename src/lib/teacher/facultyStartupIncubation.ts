/**
 * Faculty Student Start-Up Incubation & Innovation Seed Fund Grant Engine
 * 
 * Statutory & Regulatory Framework:
 * - National Innovation and Start-up Policy (NISP 2019) for Students and Faculty in HEIs
 * - Ministry of Education (MoE) Innovation Cell (MIC) & Institution's Innovation Council (IIC)
 * - NISP Equity Governance: 2.0% to 9.5% Equity/Stake cap for University Incubation Center
 * - Faculty Entrepreneurship Norms: Up to 20% working time permitted for startup mentorship/directorship
 * - Seed Grant Financing Slabs: Up to ₹10,00,000 DST/NISP/University Innovation Seed Fund (30/40/30 tranches)
 * - Indian Companies Act 2013 / LLP Act 2008: Ministry of Corporate Affairs ROC Incorporation (CIN/LLPIN)
 */

import { createHash } from 'crypto';

export type StartupIncubationStage = 
  | 'IDEATION_PRE_INCUBATION'
  | 'PROTOTYPE_VALIDATION'
  | 'STARTUP_INCORPORATED_ROC'
  | 'SEED_FUNDED_SCALING'
  | 'GRADUATED_EXIT';

export interface SeedGrantTranche {
  trancheNumber: 1 | 2 | 3;
  tranchePercent: number; // 30%, 40%, 30%
  amountInr: number;
  milestoneDescription: string;
  isDisbursed: boolean;
  disbursementDate?: string;
  payoutReference?: string;
}

export interface IncubatedStartupRecord {
  startupRecordId: string; // Token format: STU-[YEAR]-[DEPT]-[HEX6]
  startupName: string;
  primaryDomain: string; // e.g. "Generative AI", "CleanTech", "MedTech"
  founderStudentName: string;
  founderStudentRoll: string;
  facultyMentorName: string;
  facultyMentorEmpId: string;
  department: string;
  incubationStage: StartupIncubationStage;
  rocCinOrLlpin?: string; // 21-character CIN or 7-character LLPIN
  incorporationDate?: string;
  universityEquityStakePercent: number; // 2.0% to 9.5% under NISP 2019
  facultyTimeCommitmentPercent: number; // Max 20% under NISP 2019
  totalSanctionedSeedFundInr: number; // Up to ₹10,00,000
  totalDisbursedSeedFundInr: number;
  seedTranches: SeedGrantTranche[];
  patentsFiledCount: number;
  createdTimestamp: string;
  auditSha256: string;
}

// NISP 2019 Statutory Limits
export const MIN_UNIVERSITY_EQUITY_PERCENT = 2.0;
export const MAX_UNIVERSITY_EQUITY_PERCENT = 9.5;
export const MAX_FACULTY_TIME_COMMITMENT_PERCENT = 20.0;
export const MAX_SEED_GRANT_INR = 1000000; // ₹10,00,000 maximum seed funding

/**
 * Generate cryptographic SHA-256 seal for Incubated Startup record
 */
export function generateStartupSeal(record: Omit<IncubatedStartupRecord, 'auditSha256'>): string {
  const payload = [
    record.startupRecordId,
    record.startupName,
    record.founderStudentRoll,
    record.facultyMentorEmpId,
    record.incubationStage,
    record.rocCinOrLlpin || 'UNINCORPORATED',
    record.universityEquityStakePercent,
    record.totalSanctionedSeedFundInr,
    record.totalDisbursedSeedFundInr,
    record.seedTranches.length
  ].join('|');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Format statutory unique Startup tracking token
 */
export function formatStartupRecordId(department: string, year: number = 2026): string {
  const deptCode = department.replace(/[^A-Z]/gi, '').substring(0, 4).toUpperCase() || 'TECH';
  const hex = createHash('sha256')
    .update(`${department}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();
  return `STU-${year}-${deptCode}-${hex}`;
}

/**
 * Register a new Student-Faculty Incubated Venture
 */
export function registerIncubatedStartup(params: {
  startupName: string;
  primaryDomain: string;
  founderStudentName: string;
  founderStudentRoll: string;
  facultyMentorName: string;
  facultyMentorEmpId: string;
  department: string;
  facultyTimeCommitmentPercent?: number;
  year?: number;
}): IncubatedStartupRecord {
  const facultyTime = params.facultyTimeCommitmentPercent || 10;
  if (facultyTime > MAX_FACULTY_TIME_COMMITMENT_PERCENT) {
    throw new Error(
      `NISP 2019 Violation: Faculty mentor time commitment cannot exceed ${MAX_FACULTY_TIME_COMMITMENT_PERCENT}% of academic working hours.`
    );
  }

  const startupRecordId = formatStartupRecordId(params.department, params.year);
  const now = new Date().toISOString();

  const baseRecord: Omit<IncubatedStartupRecord, 'auditSha256'> = {
    startupRecordId,
    startupName: params.startupName,
    primaryDomain: params.primaryDomain,
    founderStudentName: params.founderStudentName,
    founderStudentRoll: params.founderStudentRoll,
    facultyMentorName: params.facultyMentorName,
    facultyMentorEmpId: params.facultyMentorEmpId,
    department: params.department,
    incubationStage: 'IDEATION_PRE_INCUBATION',
    universityEquityStakePercent: 0, // Assigned upon official ROC incorporation
    facultyTimeCommitmentPercent: facultyTime,
    totalSanctionedSeedFundInr: 0,
    totalDisbursedSeedFundInr: 0,
    seedTranches: [],
    patentsFiledCount: 0,
    createdTimestamp: now
  };

  const auditSha256 = generateStartupSeal(baseRecord);
  return { ...baseRecord, auditSha256 };
}

/**
 * Record Ministry of Corporate Affairs ROC Incorporation and University Equity Stake
 */
export function recordRocIncorporation(
  record: IncubatedStartupRecord,
  params: {
    rocCinOrLlpin: string;
    incorporationDate: string;
    universityEquityStakePercent: number;
  }
): IncubatedStartupRecord {
  if (
    params.universityEquityStakePercent < MIN_UNIVERSITY_EQUITY_PERCENT ||
    params.universityEquityStakePercent > MAX_UNIVERSITY_EQUITY_PERCENT
  ) {
    throw new Error(
      `NISP 2019 Equity Violation: University incubation stake must be between ${MIN_UNIVERSITY_EQUITY_PERCENT}% and ${MAX_UNIVERSITY_EQUITY_PERCENT}%. Received: ${params.universityEquityStakePercent}%.`
    );
  }

  const updated: IncubatedStartupRecord = {
    ...record,
    rocCinOrLlpin: params.rocCinOrLlpin.toUpperCase(),
    incorporationDate: params.incorporationDate,
    universityEquityStakePercent: params.universityEquityStakePercent,
    incubationStage: 'STARTUP_INCORPORATED_ROC'
  };

  return { ...updated, auditSha256: generateStartupSeal(updated) };
}

/**
 * Sanction NISP / DST Innovation Seed Fund Grant in 3 standard milestone tranches (30% / 40% / 30%)
 */
export function sanctionSeedGrant(
  record: IncubatedStartupRecord,
  sanctionedAmountInr: number
): IncubatedStartupRecord {
  if (sanctionedAmountInr > MAX_SEED_GRANT_INR) {
    throw new Error(
      `Seed grant exceeds statutory ceiling: Maximum allowable seed grant is ₹${MAX_SEED_GRANT_INR.toLocaleString('en-IN')}.`
    );
  }

  const t1 = Math.round(sanctionedAmountInr * 0.30);
  const t2 = Math.round(sanctionedAmountInr * 0.40);
  const t3 = sanctionedAmountInr - (t1 + t2);

  const tranches: SeedGrantTranche[] = [
    {
      trancheNumber: 1,
      tranchePercent: 30,
      amountInr: t1,
      milestoneDescription: 'Working Prototype & Lab Validation Report',
      isDisbursed: false
    },
    {
      trancheNumber: 2,
      tranchePercent: 40,
      amountInr: t2,
      milestoneDescription: 'Minimum Viable Product (MVP) Field Pilot Testing',
      isDisbursed: false
    },
    {
      trancheNumber: 3,
      tranchePercent: 30,
      amountInr: t3,
      milestoneDescription: 'Commercial Customer Traction & Revenue Generation',
      isDisbursed: false
    }
  ];

  const updated: IncubatedStartupRecord = {
    ...record,
    totalSanctionedSeedFundInr: sanctionedAmountInr,
    seedTranches: tranches,
    incubationStage: 'SEED_FUNDED_SCALING'
  };

  return { ...updated, auditSha256: generateStartupSeal(updated) };
}

/**
 * Disburse Seed Grant Tranche upon verified milestone completion
 */
export function disburseSeedTranche(
  record: IncubatedStartupRecord,
  trancheNumber: 1 | 2 | 3,
  payoutRef: string = `TXN-SEED-DST-${Date.now().toString().slice(-8)}`
): { success: boolean; record: IncubatedStartupRecord; error?: string } {
  const trancheIdx = record.seedTranches.findIndex(t => t.trancheNumber === trancheNumber);
  if (trancheIdx === -1) {
    return { success: false, record, error: `Tranche ${trancheNumber} not found` };
  }

  const tranche = record.seedTranches[trancheIdx];
  if (tranche.isDisbursed) {
    return { success: false, record, error: `Tranche ${trancheNumber} is already disbursed` };
  }

  if (trancheNumber > 1) {
    const prev = record.seedTranches[trancheIdx - 1];
    if (!prev.isDisbursed) {
      return { success: false, record, error: `Previous tranche ${prev.trancheNumber} must be disbursed first` };
    }
  }

  const updatedTranches = [...record.seedTranches];
  updatedTranches[trancheIdx] = {
    ...tranche,
    isDisbursed: true,
    disbursementDate: new Date().toISOString().split('T')[0],
    payoutReference: payoutRef
  };

  const updated: IncubatedStartupRecord = {
    ...record,
    seedTranches: updatedTranches,
    totalDisbursedSeedFundInr: record.totalDisbursedSeedFundInr + tranche.amountInr
  };

  return {
    success: true,
    record: { ...updated, auditSha256: generateStartupSeal(updated) }
  };
}

/**
 * Export official CSV of University Incubated Start-Up Ledger
 */
export function exportStartupIncubationCSV(records: IncubatedStartupRecord[]): string {
  const headers = [
    'Startup Token ID',
    'Startup Name',
    'Domain',
    'Student Founder',
    'Faculty Mentor',
    'Department',
    'Incubation Stage',
    'ROC CIN/LLPIN',
    'University Equity %',
    'Sanctioned Seed Fund INR',
    'Disbursed Seed Fund INR',
    'Audit SHA-256'
  ];

  const rows = records.map(r => {
    return [
      r.startupRecordId,
      `"${r.startupName}"`,
      `"${r.primaryDomain}"`,
      `"${r.founderStudentName}"`,
      `"${r.facultyMentorName}"`,
      r.department,
      r.incubationStage,
      r.rocCinOrLlpin || 'UNINCORPORATED',
      `${r.universityEquityStakePercent}%`,
      r.totalSanctionedSeedFundInr,
      r.totalDisbursedSeedFundInr,
      r.auditSha256
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Sample initial dataset for Incubated Startups
 */
export const SAMPLE_STARTUPS: IncubatedStartupRecord[] = [
  sanctionSeedGrant(
    recordRocIncorporation(
      registerIncubatedStartup({
        startupName: 'AeroGrid Autonomous Robotics Pvt Ltd',
        primaryDomain: 'DeepTech & Agricultural Drones',
        founderStudentName: 'Devansh Kulkarni',
        founderStudentRoll: '2023ME014',
        facultyMentorName: 'Prof. S. R. Deshpande',
        facultyMentorEmpId: 'FAC-ME-2017-088',
        department: 'Mechanical Engineering',
        facultyTimeCommitmentPercent: 15
      }),
      {
        rocCinOrLlpin: 'U72900KA2025PTC184920',
        incorporationDate: '2025-11-14',
        universityEquityStakePercent: 5.0
      }
    ),
    500000
  ),
  registerIncubatedStartup({
    startupName: 'BioSynthetica Therapeutics',
    primaryDomain: 'Bio-Pharmaceutical Genomics',
    founderStudentName: 'Shreya Sengupta',
    founderStudentRoll: '2024BT009',
    facultyMentorName: 'Dr. Nandini Mukherjee',
    facultyMentorEmpId: 'FAC-BT-2019-032',
    department: 'Biotechnology & Bioinformatics',
    facultyTimeCommitmentPercent: 12
  })
];
