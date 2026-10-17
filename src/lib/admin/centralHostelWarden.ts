/**
 * Central University Hostel Allocation, Mess Rebate & Wardenship Disciplinary Engine
 * Statutory Compliance: UGC Guidelines on Student Residential Hostels, Chief Warden /
 * Proctorial Standing Committee Code of Conduct & National Building Code (NBC) Residential Norms.
 *
 * Platform: PinIT Career OS - Campus Administration Platform
 * Zero-Collision Invariant: Pure Branch C administrative governance.
 */

import { createHash } from 'crypto';

export type HostelBlockName =
  | 'BLOCK_A_MENS_JUNIOR'
  | 'BLOCK_B_MENS_SENIOR'
  | 'BLOCK_C_WOMENS_MAIN'
  | 'BLOCK_D_WOMENS_RESEARCH'
  | 'INTERNATIONAL_SCHOLAR_TOWER';

export type RoomSharingType =
  | 'SINGLE_OCCUPANCY_SCHOLAR'
  | 'DOUBLE_SHARING'
  | 'TRIPLE_SHARING';

export type HostelAdmissionStage =
  | 'APPLICATION_SUBMITTED'
  | 'DISTANCE_MERIT_SCRUTINIZED'
  | 'ROOM_ALLOTTED'
  | 'CHECKED_IN'
  | 'DISCIPLINARY_PROBATION'
  | 'VACATED_AND_CAUTION_REFUNDED'
  | 'EXPELLED_FROM_RESIDENCE';

export type DisciplinaryViolationType =
  | 'CURFEW_BREACH'
  | 'UNAUTHORIZED_GUEST_ENTRY'
  | 'SUBSTANCE_POSSESSION'
  | 'RAGGING_INTIMIDATION'
  | 'PROPERTY_DAMAGE';

export interface MessRebateRecord {
  rebateId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  totalLeaveDays: number;
  approvedDailyRebateInr: number;
  totalRebateCreditInr: number;
  isApprovedByWarden: boolean;
}

export interface DisciplinaryIncident {
  incidentId: string;
  date: string;
  violation: DisciplinaryViolationType;
  fineAmountInr: number;
  actionTaken: string;
  penalizedByWardenName: string;
}

export interface HostelResidentRecord {
  residentId: string;
  trackingToken: string; // HSTL-[YEAR]-[BLOCK]-[HEX6]
  studentFullName: string;
  enrollmentNumber: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  department: string;
  academicProgram: string;
  homeDistanceKm: number;
  academicCgpa: number;
  priorityMeritScore: number; // (Distance * 0.5) + (CGPA/10 * 100 * 0.5)
  isPwdCategory: boolean;
  blockName: HostelBlockName;
  roomNumber?: string;
  roomType: RoomSharingType;
  annualHostelFeeInr: number;
  cautionDepositInr: number;
  stage: HostelAdmissionStage;
  messRebates: MessRebateRecord[];
  disciplinaryIncidents: DisciplinaryIncident[];
  cryptographicSeal?: string; // SHA-256 seal
  lastUpdated: string;
}

/**
 * Statutory Parameters:
 * - Minimum distance from campus for hostel eligibility: 50 km (unless PwD)
 * - Standard Daily Mess Rebate: ₹150 / day for leave >= 5 consecutive days
 * - Minimum consecutive leave days for mess rebate: 5 days
 */
export const MIN_HOSTEL_DISTANCE_KM = 50;
export const MIN_MESS_REBATE_DAYS = 5;
export const DAILY_MESS_REBATE_INR = 150;

/**
 * Generate unique hostel tracking token: HSTL-[YEAR]-[BLOCK]-[HEX6]
 */
export function generateHostelToken(
  block: HostelBlockName,
  year: number = new Date().getFullYear()
): string {
  const cleanBlock = block.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'HSTL';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `HSTL-${year}-${cleanBlock}-${randomHex}`;
}

/**
 * Calculate distance-merit priority score:
 * (Capped Normalized Distance * 0.5) + (Normalized CGPA * 0.5)
 * Distance normalized up to 1000 km (100 pts max)
 * CGPA normalized: (CGPA / 10.0) * 100
 */
export function calculateDistanceMeritScore(
  homeDistanceKm: number,
  cgpa: number,
  isPwd: boolean = false
): number {
  if (isPwd) {
    // PwD students receive statutory top priority (100.0)
    return 100.0;
  }
  const normDistance = Math.min(100.0, (homeDistanceKm / 1000.0) * 100.0);
  const normCgpa = Math.min(100.0, (cgpa / 10.0) * 100.0);
  const score = (normDistance * 0.5) + (normCgpa * 0.5);
  return Number(score.toFixed(2));
}

/**
 * Calculate approved mess rebate credit:
 * Only applicable if total leave days >= 5
 */
export function calculateMessRebate(totalLeaveDays: number, dailyRate: number = DAILY_MESS_REBATE_INR): number {
  if (totalLeaveDays < MIN_MESS_REBATE_DAYS) {
    return 0;
  }
  return totalLeaveDays * dailyRate;
}

/**
 * Generate tamper-proof SHA-256 seal for hostel resident record
 */
export function generateHostelSeal(
  record: Omit<HostelResidentRecord, 'cryptographicSeal'>
): string {
  const canonicalPayload = [
    record.residentId,
    record.trackingToken,
    record.studentFullName,
    record.enrollmentNumber,
    record.blockName,
    record.roomNumber || 'UNASSIGNED',
    record.roomType,
    record.priorityMeritScore.toFixed(2),
    record.stage,
    record.disciplinaryIncidents.length,
    record.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Register a new student hostel admission application
 */
export function registerHostelApplicant(params: {
  studentFullName: string;
  enrollmentNumber: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  department: string;
  academicProgram: string;
  homeDistanceKm: number;
  academicCgpa: number;
  isPwdCategory?: boolean;
  blockName: HostelBlockName;
  roomType: RoomSharingType;
}): HostelResidentRecord {
  if (!params.studentFullName.trim()) {
    throw new Error('Student full name cannot be blank.');
  }

  if (!params.enrollmentNumber.trim()) {
    throw new Error('Enrollment number must be specified.');
  }

  const isPwd = params.isPwdCategory ?? false;
  if (!isPwd && params.homeDistanceKm < MIN_HOSTEL_DISTANCE_KM) {
    throw new Error(`Ineligible for hostel: Home distance (${params.homeDistanceKm} km) is below statutory threshold (${MIN_HOSTEL_DISTANCE_KM} km).`);
  }

  const priorityMeritScore = calculateDistanceMeritScore(params.homeDistanceKm, params.academicCgpa, isPwd);
  const trackingToken = generateHostelToken(params.blockName);
  const now = new Date().toISOString();

  const annualHostelFeeInr = params.roomType === 'SINGLE_OCCUPANCY_SCHOLAR'
    ? 45000
    : params.roomType === 'DOUBLE_SHARING'
    ? 30000
    : 22000;

  const baseRecord: Omit<HostelResidentRecord, 'cryptographicSeal'> = {
    residentId: `HSTL-${Date.now().toString(36).toUpperCase()}`,
    trackingToken,
    studentFullName: params.studentFullName.trim(),
    enrollmentNumber: params.enrollmentNumber.trim().toUpperCase(),
    gender: params.gender,
    department: params.department.trim(),
    academicProgram: params.academicProgram.trim(),
    homeDistanceKm: params.homeDistanceKm,
    academicCgpa: params.academicCgpa,
    priorityMeritScore,
    isPwdCategory: isPwd,
    blockName: params.blockName,
    roomType: params.roomType,
    annualHostelFeeInr,
    cautionDepositInr: 5000,
    stage: 'APPLICATION_SUBMITTED',
    messRebates: [],
    disciplinaryIncidents: [],
    lastUpdated: now,
  };

  const cryptographicSeal = generateHostelSeal(baseRecord);
  return { ...baseRecord, cryptographicSeal };
}

/**
 * Allot specific hostel room number
 */
export function allotHostelRoom(
  record: HostelResidentRecord,
  roomNumber: string
): HostelResidentRecord {
  if (record.stage === 'EXPELLED_FROM_RESIDENCE') {
    throw new Error('Cannot allot room to an expelled resident.');
  }

  if (!roomNumber.trim()) {
    throw new Error('Room number must be specified.');
  }

  const now = new Date().toISOString();
  const updated: Omit<HostelResidentRecord, 'cryptographicSeal'> = {
    ...record,
    roomNumber: roomNumber.trim().toUpperCase(),
    stage: 'ROOM_ALLOTTED',
    lastUpdated: now,
  };

  const cryptographicSeal = generateHostelSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Check in resident into allocated room
 */
export function checkInResident(record: HostelResidentRecord): HostelResidentRecord {
  if (record.stage !== 'ROOM_ALLOTTED') {
    throw new Error(`Cannot check in: Room must be allotted first (current: ${record.stage}).`);
  }

  const now = new Date().toISOString();
  const updated: Omit<HostelResidentRecord, 'cryptographicSeal'> = {
    ...record,
    stage: 'CHECKED_IN',
    lastUpdated: now,
  };

  const cryptographicSeal = generateHostelSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Submit and approve mess leave rebate
 */
export function approveMessRebate(
  record: HostelResidentRecord,
  params: {
    startDate: string;
    endDate: string;
    totalLeaveDays: number;
  }
): HostelResidentRecord {
  if (record.stage !== 'CHECKED_IN' && record.stage !== 'DISCIPLINARY_PROBATION') {
    throw new Error('Resident must be actively residing in hostel to claim mess rebate.');
  }

  const rebateCredit = calculateMessRebate(params.totalLeaveDays);
  if (rebateCredit <= 0) {
    throw new Error(`Mess rebate rejected: Leave duration (${params.totalLeaveDays} days) is less than minimum statutory threshold (${MIN_MESS_REBATE_DAYS} days).`);
  }

  const rebateRecord: MessRebateRecord = {
    rebateId: `REB-${Date.now().toString(36).toUpperCase()}`,
    startDate: params.startDate,
    endDate: params.endDate,
    totalLeaveDays: params.totalLeaveDays,
    approvedDailyRebateInr: DAILY_MESS_REBATE_INR,
    totalRebateCreditInr: rebateCredit,
    isApprovedByWarden: true,
  };

  const now = new Date().toISOString();
  const updated: Omit<HostelResidentRecord, 'cryptographicSeal'> = {
    ...record,
    messRebates: [rebateRecord, ...record.messRebates],
    lastUpdated: now,
  };

  const cryptographicSeal = generateHostelSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Record Warden Disciplinary Action & Fine
 */
export function recordHostelDiscipline(
  record: HostelResidentRecord,
  params: {
    violation: DisciplinaryViolationType;
    fineAmountInr: number;
    actionTaken: string;
    wardenName: string;
    isSevereExpulsion?: boolean;
  }
): HostelResidentRecord {
  const incident: DisciplinaryIncident = {
    incidentId: `DISC-${Date.now().toString(36).toUpperCase()}`,
    date: new Date().toISOString().split('T')[0],
    violation: params.violation,
    fineAmountInr: params.fineAmountInr,
    actionTaken: params.actionTaken.trim(),
    penalizedByWardenName: params.wardenName.trim(),
  };

  const nextStage: HostelAdmissionStage = params.isSevereExpulsion
    ? 'EXPELLED_FROM_RESIDENCE'
    : 'DISCIPLINARY_PROBATION';

  const now = new Date().toISOString();
  const updated: Omit<HostelResidentRecord, 'cryptographicSeal'> = {
    ...record,
    stage: nextStage,
    disciplinaryIncidents: [incident, ...record.disciplinaryIncidents],
    lastUpdated: now,
  };

  const cryptographicSeal = generateHostelSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Export Hostel Allocation Ledger as statutory CSV
 */
export function exportHostelAllocationLedgerCSV(records: HostelResidentRecord[]): string {
  const headers = [
    'Resident ID',
    'Tracking Token',
    'Full Name',
    'Enrollment No',
    'Block Name',
    'Room Number',
    'Room Type',
    'Distance (km)',
    'CGPA',
    'Priority Score',
    'PwD',
    'Stage',
    'Annual Fee INR',
    'Mess Rebates Count',
    'Disciplinary Incidents',
    'Cryptographic Seal',
  ];

  const rows = records.map((r) => [
    `"${r.residentId}"`,
    `"${r.trackingToken}"`,
    `"${r.studentFullName.replace(/"/g, '""')}"`,
    `"${r.enrollmentNumber}"`,
    `"${r.blockName}"`,
    `"${r.roomNumber || 'UNASSIGNED'}"`,
    `"${r.roomType}"`,
    r.homeDistanceKm,
    r.academicCgpa,
    r.priorityMeritScore,
    r.isPwdCategory ? 'YES' : 'NO',
    `"${r.stage}"`,
    r.annualHostelFeeInr,
    r.messRebates.length,
    r.disciplinaryIncidents.length,
    `"${r.cryptographicSeal || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Demonstration Hostel Resident Records
 */
export const INITIAL_HOSTEL_RESIDENTS: HostelResidentRecord[] = [
  {
    residentId: 'HSTL-2026-001',
    trackingToken: 'HSTL-2026-BLOC-8A1099',
    studentFullName: 'Aarav Sharma',
    enrollmentNumber: 'EN-2024-CSE-091',
    gender: 'MALE',
    department: 'Computer Science & Engineering',
    academicProgram: 'B.Tech CSE (Year 3)',
    homeDistanceKm: 750,
    academicCgpa: 8.8,
    priorityMeritScore: 81.5, // (75 * 0.5) + (88 * 0.5) = 37.5 + 44.0 = 81.5
    isPwdCategory: false,
    blockName: 'BLOCK_B_MENS_SENIOR',
    roomNumber: 'B-312',
    roomType: 'DOUBLE_SHARING',
    annualHostelFeeInr: 30000,
    cautionDepositInr: 5000,
    stage: 'CHECKED_IN',
    messRebates: [
      {
        rebateId: 'REB-01',
        startDate: '2026-02-10',
        endDate: '2026-02-17',
        totalLeaveDays: 8,
        approvedDailyRebateInr: 150,
        totalRebateCreditInr: 1200,
        isApprovedByWarden: true,
      },
    ],
    disciplinaryIncidents: [],
    cryptographicSeal: '8a10993847291048291847192837482910482918471928374829104829184703',
    lastUpdated: '2026-02-20T10:00:00Z',
  },
  {
    residentId: 'HSTL-2026-002',
    trackingToken: 'HSTL-2026-BLOC-2C4410',
    studentFullName: 'Meghna Sengupta',
    enrollmentNumber: 'EN-2025-MTH-014',
    gender: 'FEMALE',
    department: 'Mathematics & Computing',
    academicProgram: 'M.Sc Mathematics (Year 2)',
    homeDistanceKm: 420,
    academicCgpa: 9.4,
    priorityMeritScore: 68.0, // (42 * 0.5) + (94 * 0.5) = 21.0 + 47.0 = 68.0
    isPwdCategory: false,
    blockName: 'BLOCK_D_WOMENS_RESEARCH',
    roomNumber: 'D-108',
    roomType: 'SINGLE_OCCUPANCY_SCHOLAR',
    annualHostelFeeInr: 45000,
    cautionDepositInr: 5000,
    stage: 'CHECKED_IN',
    messRebates: [],
    disciplinaryIncidents: [],
    cryptographicSeal: '2c44103847291048291847192837482910482918471928374829104829184709',
    lastUpdated: '2026-03-01T12:00:00Z',
  },
  {
    residentId: 'HSTL-2026-003',
    trackingToken: 'HSTL-2026-INTE-99A120',
    studentFullName: 'Tariq Al-Mansoor',
    enrollmentNumber: 'EN-2025-CIV-088',
    gender: 'MALE',
    department: 'Civil Engineering',
    academicProgram: 'Ph.D Structural Dynamics',
    homeDistanceKm: 2800, // International
    academicCgpa: 8.5,
    priorityMeritScore: 92.5, // (100 * 0.5) + (85 * 0.5) = 50 + 42.5 = 92.5
    isPwdCategory: false,
    blockName: 'INTERNATIONAL_SCHOLAR_TOWER',
    roomNumber: 'INT-402',
    roomType: 'SINGLE_OCCUPANCY_SCHOLAR',
    annualHostelFeeInr: 60000,
    cautionDepositInr: 10000,
    stage: 'ROOM_ALLOTTED',
    messRebates: [],
    disciplinaryIncidents: [],
    cryptographicSeal: '99a1203847291048291847192837482910482918471928374829104829184711',
    lastUpdated: '2026-03-15T09:00:00Z',
  },
];
