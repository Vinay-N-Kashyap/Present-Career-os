/**
 * Faculty Innovation Incubation & Technology Transfer Office (TTO) Commercialization Engine
 *
 * Statutory Alignment:
 * - National Innovation and Start-up Policy (NISP 2019) for Students & Faculty in HEIs
 * - AICTE Guidelines for Institutional Start-ups & Technology Business Incubators (TBIs)
 * - UGC Intellectual Property Rights (IPR) & Technology Commercialization Norms
 *
 * Capabilities:
 * 1. Faculty Startup Incubation Lifecycle:
 *    IDEA_DISCLOSURE -> TTO_EVALUATION -> INCUBATED_IN_PARK -> PROTOTYPE_VALIDATED -> SPINOFF_INCORPORATED -> COMMERCIALIZED.
 * 2. Statutory NISP Institutional Equity Holding bounds (2.0% - 9.5% max cap).
 * 3. TTO Royalty Revenue Sharing model:
 *    - 70% Faculty Innovator / Co-Founders
 *    - 30% University Technology Transfer Office (15% Department, 15% Central Incubation Pool).
 * 4. Faculty Conflict of Interest (COI) & time commitment ceiling (max 20% weekly effort / 8 hrs/week).
 * 5. Unique TTO Startup Identifier: TTO-[YEAR]-[DEPT]-[HEX6].
 * 6. Cryptographic IP & Technology Transfer Seal (SHA-256).
 * 7. NISP & TTO Incubator Portfolio CSV export.
 */

import crypto from 'crypto';

export type IncubationStage =
  | 'IDEA_DISCLOSURE'
  | 'TTO_EVALUATION'
  | 'INCUBATED_IN_PARK'
  | 'PROTOTYPE_VALIDATED'
  | 'SPINOFF_INCORPORATED'
  | 'COMMERCIALIZED'
  | 'SHELVED';

export type IpStatus =
  | 'PROVISIONAL_PATENT'
  | 'PUBLISHED_PATENT'
  | 'GRANTED_PATENT'
  | 'TRADE_SECRET'
  | 'COPYRIGHT';

export interface RoyaltyDistribution {
  totalAmountInr: number;
  facultyShare: number; // 70%
  universityShare: number; // 30%
  departmentShare: number; // 15% of total
  centralPoolShare: number; // 15% of total
}

export interface TtoStartup {
  id: string;
  startupCode: string; // e.g. "TTO-2026-CSE-9B3E12"
  ventureName: string;
  facultyLeadName: string;
  facultyEmployeeId: string;
  department: string;
  studentCoFounders: string[];
  stage: IncubationStage;
  techReadinessLevel: number; // TRL 1 to 9
  ipPatentAppNumber?: string;
  ipStatus: IpStatus;
  institutionEquityPercent: number; // Must be 2.0% - 9.5%
  facultyWeeklyTimeHours: number; // Must be <= 8h (20% of 40h)
  seedGrantSanctionedInr: number;
  externalFundingRaisedInr: number;
  totalRoyaltyRevenueInr: number;
  cryptographicIpSeal?: string;
  registeredDate: string;
  commercializationDate?: string;
  summary: string;
}

/**
 * Validates NISP 2019 equity guidelines (institutional equity strictly 2.0% to 9.5%).
 */
export function validateNispEquity(equityPercent: number): boolean {
  return equityPercent >= 2.0 && equityPercent <= 9.5;
}

/**
 * Validates faculty time commitment ceiling under AICTE norms (<= 20% of 40-hour work week = 8 hours).
 */
export function validateFacultyTimeCommitment(
  hoursPerWeek: number,
  totalWorkHours: number = 40
): boolean {
  if (hoursPerWeek < 0) return false;
  return hoursPerWeek <= totalWorkHours * 0.20;
}

/**
 * Calculates standard 70/30 NISP royalty distribution between faculty innovator and university.
 */
export function calculateRoyaltyDistribution(
  totalRoyaltyAmount: number,
  facultyShareRatio: number = 0.70
): RoyaltyDistribution {
  const safeTotal = Math.max(0, totalRoyaltyAmount);
  const facultyShare = Math.round(safeTotal * facultyShareRatio);
  const universityShare = safeTotal - facultyShare;
  const departmentShare = Math.round(universityShare * 0.50);
  const centralPoolShare = universityShare - departmentShare;

  return {
    totalAmountInr: safeTotal,
    facultyShare,
    universityShare,
    departmentShare,
    centralPoolShare,
  };
}

/**
 * Sanitizes department string to uppercase alphanumeric code.
 */
function sanitizeDeptCode(dept: string): string {
  const clean = dept.replace(/[^a-zA-Z]/g, '').toUpperCase();
  if (clean.includes('COMPUTER') || clean.includes('CSE')) return 'CSE';
  if (clean.includes('ELECTR') || clean.includes('ECE')) return 'ECE';
  if (clean.includes('MECH')) return 'MECH';
  if (clean.includes('BIO')) return 'BIO';
  if (clean.includes('CIVIL')) return 'CIVIL';
  return clean.substring(0, 4) || 'GEN';
}

/**
 * Generates an official TTO Startup Identifier.
 * Format: TTO-[YEAR]-[DEPT]-[HEX6]
 */
export function generateStartupId(
  dept: string,
  year: number,
  ventureId: string
): string {
  const deptCode = sanitizeDeptCode(dept);
  const hash = crypto
    .createHash('sha256')
    .update(`${dept}::${year}::${ventureId}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();

  return `TTO-${year}-${deptCode}-${hash}`;
}

/**
 * Generates a tamper-proof SHA-256 cryptographic seal binding IP terms and equity agreements.
 */
export function generateCryptographicIpSeal(startup: {
  startupCode: string;
  ventureName: string;
  facultyLeadName: string;
  institutionEquityPercent: number;
  ipPatentAppNumber?: string;
  ipStatus: IpStatus;
}): string {
  const payload = [
    startup.startupCode,
    startup.ventureName,
    startup.facultyLeadName,
    `EQUITY:${startup.institutionEquityPercent.toFixed(2)}%`,
    startup.ipPatentAppNumber || 'NO_PATENT_APP',
    startup.ipStatus,
  ].join('::');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Exports TTO incubation portfolio to standard CSV.
 */
export function exportTtoStartupsCSV(startups: TtoStartup[]): string {
  const headers = [
    'Startup Code',
    'Venture Name',
    'Faculty Lead',
    'Department',
    'Student Co-Founders',
    'Stage',
    'TRL Level',
    'IP Status',
    'Patent Application Number',
    'University Equity (%)',
    'Faculty Weekly Hours',
    'Seed Grant Sanctioned (INR)',
    'External Funding Raised (INR)',
    'Total Royalty Generated (INR)',
    'Cryptographic IP Seal',
  ];

  const rows = startups.map((s) => [
    `"${s.startupCode}"`,
    `"${s.ventureName.replace(/"/g, '""')}"`,
    `"${s.facultyLeadName.replace(/"/g, '""')}"`,
    `"${s.department}"`,
    `"${s.studentCoFounders.join('; ')}"`,
    `"${s.stage}"`,
    `"${s.techReadinessLevel}"`,
    `"${s.ipStatus}"`,
    `"${s.ipPatentAppNumber || 'N/A'}"`,
    `"${s.institutionEquityPercent}%"`,
    `"${s.facultyWeeklyTimeHours}h"`,
    `"${s.seedGrantSanctionedInr}"`,
    `"${s.externalFundingRaisedInr}"`,
    `"${s.totalRoyaltyRevenueInr}"`,
    `"${s.cryptographicIpSeal || 'UNSIGNED'}"`,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

// ---------------------------------------------------------------------------
// DEFAULT SEED DATA & IN-MEMORY STORE
// ---------------------------------------------------------------------------

export const DEFAULT_TTO_STARTUPS: TtoStartup[] = [
  {
    id: 'STU-001',
    startupCode: 'TTO-2026-CSE-9B3E12',
    ventureName: 'Qubyte Quantum Cryptography Labs Pvt Ltd',
    facultyLeadName: 'Prof. Anita Deshmukh',
    facultyEmployeeId: 'FAC-CS-01',
    department: 'Computer Science & Engineering',
    studentCoFounders: ['Aarohi Shenoy (B.Tech)', 'Rohan Iyer (M.Tech)'],
    stage: 'SPINOFF_INCORPORATED',
    techReadinessLevel: 8,
    ipPatentAppNumber: '202611094821A',
    ipStatus: 'GRANTED_PATENT',
    institutionEquityPercent: 5.0,
    facultyWeeklyTimeHours: 6.0,
    seedGrantSanctionedInr: 2500000, // 25 Lakhs
    externalFundingRaisedInr: 12500000, // 1.25 Crores Series Seed
    totalRoyaltyRevenueInr: 1800000, // 18 Lakhs
    cryptographicIpSeal:
      'c81e728d9d4c2f636f067f89cc14862c1ecd73efb1c0908cf6b4f74d08a54d68',
    registeredDate: '2025-08-10',
    commercializationDate: '2026-06-15',
    summary:
      'Post-quantum lattice-based key exchange hardware accelerators for zero-trust enterprise telecommunications.',
  },
  {
    id: 'STU-002',
    startupCode: 'TTO-2026-BIO-4A82F1',
    ventureName: 'NeuroPulse Wearable Diagnostics',
    facultyLeadName: 'Dr. Vivek Bhattacharya',
    facultyEmployeeId: 'FAC-BIO-04',
    department: 'Biotechnology & Biomedical Engineering',
    studentCoFounders: ['Pooja Sundaram (PhD)', 'Ananya Rao (B.Tech)'],
    stage: 'COMMERCIALIZED',
    techReadinessLevel: 9,
    ipPatentAppNumber: '202541088192A',
    ipStatus: 'GRANTED_PATENT',
    institutionEquityPercent: 7.5,
    facultyWeeklyTimeHours: 7.5,
    seedGrantSanctionedInr: 2000000,
    externalFundingRaisedInr: 25000000, // 2.5 Crores VC Round
    totalRoyaltyRevenueInr: 4500000, // 45 Lakhs
    cryptographicIpSeal:
      '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    registeredDate: '2025-02-14',
    commercializationDate: '2026-03-20',
    summary:
      'Continuous non-invasive multi-biomarker patch for early seizure and cardiac arrhythmia telemetry.',
  },
  {
    id: 'STU-003',
    startupCode: 'TTO-2026-ECE-1F76D0',
    ventureName: 'AgriSpectra Autonomous Drone Agritech',
    facultyLeadName: 'Prof. Harish Chandra',
    facultyEmployeeId: 'FAC-EC-02',
    department: 'Electronics & Communication Engineering',
    studentCoFounders: ['Vikram Singhania (B.Tech)', 'Karan Verma (B.Tech)'],
    stage: 'PROTOTYPE_VALIDATED',
    techReadinessLevel: 6,
    ipPatentAppNumber: '202641010291A',
    ipStatus: 'PUBLISHED_PATENT',
    institutionEquityPercent: 4.5,
    facultyWeeklyTimeHours: 5.0,
    seedGrantSanctionedInr: 1500000,
    externalFundingRaisedInr: 4000000,
    totalRoyaltyRevenueInr: 0,
    cryptographicIpSeal:
      '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    registeredDate: '2026-01-20',
    summary:
      'Hyperspectral Edge-AI drone payload for precision nitrogen and fungal infection soil mapping.',
  },
  {
    id: 'STU-004',
    startupCode: 'TTO-2026-MECH-D390E4',
    ventureName: 'AquaGraphene CleanTech Desalination',
    facultyLeadName: 'Prof. S. R. Raman',
    facultyEmployeeId: 'FAC-ME-05',
    department: 'Mechanical & Chemical Engineering',
    studentCoFounders: ['Meera Nambiar (PhD)'],
    stage: 'INCUBATED_IN_PARK',
    techReadinessLevel: 5,
    ipPatentAppNumber: '202641033812A',
    ipStatus: 'PROVISIONAL_PATENT',
    institutionEquityPercent: 6.0,
    facultyWeeklyTimeHours: 4.0,
    seedGrantSanctionedInr: 1200000,
    externalFundingRaisedInr: 1800000,
    totalRoyaltyRevenueInr: 0,
    cryptographicIpSeal:
      'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    registeredDate: '2026-04-12',
    summary:
      'Low-pressure nanoporous graphene oxide membranes for industrial wastewater zero liquid discharge (ZLD).',
  },
];

let startupsStore: TtoStartup[] = [...DEFAULT_TTO_STARTUPS];

export function resetTtoStore(): void {
  startupsStore = [...DEFAULT_TTO_STARTUPS];
}

export function getAllStartups(): TtoStartup[] {
  return [...startupsStore];
}

export function getStartupById(id: string): TtoStartup | undefined {
  return startupsStore.find((s) => s.id === id);
}

export function registerTtoStartup(
  input: Omit<TtoStartup, 'id' | 'startupCode' | 'cryptographicIpSeal'> & {
    id?: string;
  }
): TtoStartup {
  const id = input.id || `STU-${Date.now().toString().slice(-4)}`;
  const currentYear = new Date().getFullYear();
  const startupCode = generateStartupId(input.department, currentYear, id);

  const newStartup: TtoStartup = {
    ...input,
    id,
    startupCode,
  };

  newStartup.cryptographicIpSeal = generateCryptographicIpSeal(newStartup);
  startupsStore.unshift(newStartup);
  return newStartup;
}

export function advanceIncubationStage(
  id: string,
  nextStage: IncubationStage,
  newTrl?: number
): TtoStartup | null {
  const idx = startupsStore.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  const current = startupsStore[idx];
  const updated: TtoStartup = {
    ...current,
    stage: nextStage,
    techReadinessLevel: newTrl ?? current.techReadinessLevel,
    commercializationDate:
      nextStage === 'COMMERCIALIZED' && !current.commercializationDate
        ? new Date().toISOString().split('T')[0]
        : current.commercializationDate,
  };

  updated.cryptographicIpSeal = generateCryptographicIpSeal(updated);
  startupsStore[idx] = updated;
  return updated;
}

export function logRoyaltyRevenue(
  id: string,
  royaltyAmountInr: number
): { startup: TtoStartup; distribution: RoyaltyDistribution } | null {
  const idx = startupsStore.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  const current = startupsStore[idx];
  const newTotal = current.totalRoyaltyRevenueInr + royaltyAmountInr;
  const distribution = calculateRoyaltyDistribution(royaltyAmountInr);

  const updated: TtoStartup = {
    ...current,
    totalRoyaltyRevenueInr: newTotal,
    stage: current.stage === 'COMMERCIALIZED' ? 'COMMERCIALIZED' : 'COMMERCIALIZED',
    commercializationDate: current.commercializationDate || new Date().toISOString().split('T')[0],
  };

  startupsStore[idx] = updated;
  return { startup: updated, distribution };
}
