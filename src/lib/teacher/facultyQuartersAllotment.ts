/**
 * Faculty Residential Campus Quarters Allotment & HRA License Fee Recovery Engine
 * Statutory Compliance: Directorate of Estates (DoE) General Pool Residential Accommodation (GPRA) Rules,
 * UGC 7th CPC House Rent Allowance (HRA) Surrender Regulations & Standard License Fee Recovery.
 *
 * Platform: PinIT Career OS - Teacher Portal & Faculty Governance
 * Zero-Collision Invariant: Pure Branch C administrative and faculty governance.
 */

import { createHash } from 'crypto';

export type QuarterScaleType =
  | 'TYPE_III_ASSISTANT_PROF'
  | 'TYPE_IV_ASSOCIATE_PROF'
  | 'TYPE_V_PROFESSOR_DEAN'
  | 'TYPE_VI_VICE_CHANCELLOR_DIRECTOR';

export type CampusCityHraTier = 'TIER_X_27PCT' | 'TIER_Y_18PCT' | 'TIER_Z_9PCT';

export type QuartersAllotmentStage =
  | 'APPLICATION_WAITLISTED'
  | 'QUARTER_OFFERED'
  | 'POSSESSION_OCCUPIED_HRA_SURRENDERED'
  | 'VACATION_NOTICE_SERVED'
  | 'SURRENDERED_NO_DUES_ISSUED';

export interface FacultyQuarterRecord {
  allotmentId: string;
  trackingToken: string; // QTR-[YEAR]-[TYPE]-[HEX6]
  facultyName: string;
  empId: string;
  department: string;
  academicPayLevel: string; // e.g. Level 10, Level 12, Level 14
  basicPayInr: number;
  dateOfJoiningLevel: string; // YYYY-MM-DD for GPRA seniority
  dateOfBirth: string;        // YYYY-MM-DD for tie-breaking
  quarterType: QuarterScaleType;
  quarterNumber?: string;     // e.g. QTR-IV/B-12
  plinthAreaSqm: number;
  cityHraTier: CampusCityHraTier;
  monthlyHraSurrenderedInr: number;
  monthlyLicenseFeeInr: number;
  monthlyWaterElectricityChargesInr: number;
  possessionDate?: string;
  vacationDate?: string;
  stage: QuartersAllotmentStage;
  cryptographicSeal?: string; // SHA-256 seal
  lastUpdated: string;
}

/**
 * Standard DoE License Fee & Plinth Area Matrix
 */
export const QUARTER_STANDARDS: Record<
  QuarterScaleType,
  { plinthAreaSqm: number; standardLicenseFeeInr: number }
> = {
  TYPE_III_ASSISTANT_PROF: { plinthAreaSqm: 65, standardLicenseFeeInr: 750 },
  TYPE_IV_ASSOCIATE_PROF: { plinthAreaSqm: 90, standardLicenseFeeInr: 1560 },
  TYPE_V_PROFESSOR_DEAN: { plinthAreaSqm: 120, standardLicenseFeeInr: 2450 },
  TYPE_VI_VICE_CHANCELLOR_DIRECTOR: { plinthAreaSqm: 240, standardLicenseFeeInr: 4100 },
};

/**
 * HRA Percentage Rate Map (7th CPC)
 */
export const HRA_TIER_PERCENTAGES: Record<CampusCityHraTier, number> = {
  TIER_X_27PCT: 0.27,
  TIER_Y_18PCT: 0.18,
  TIER_Z_9PCT: 0.09,
};

export const STANDARD_WATER_ELECTRICITY_INR = 450;

/**
 * Generate unique quarters tracking token: QTR-[YEAR]-[TYPE]-[HEX6]
 */
export function generateQuartersToken(
  quarterType: QuarterScaleType,
  year: number = new Date().getFullYear()
): string {
  const cleanType = quarterType.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'QTR';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `QTR-${year}-${cleanType}-${randomHex}`;
}

/**
 * Calculate Monthly 7th CPC HRA Surrender:
 * Monthly HRA = Basic Pay * City HRA Percentage
 */
export function calculateMonthlyHraSurrender(
  basicPayInr: number,
  tier: CampusCityHraTier
): number {
  if (basicPayInr <= 0) return 0;
  const pct = HRA_TIER_PERCENTAGES[tier];
  return Number((basicPayInr * pct).toFixed(2));
}

/**
 * Calculate total monthly pay-bill deduction upon occupying quarter:
 * Total = HRA Surrender + Standard License Fee + Water & Electricity
 */
export function calculateTotalMonthlyDeductions(
  basicPayInr: number,
  tier: CampusCityHraTier,
  quarterType: QuarterScaleType
): number {
  const hra = calculateMonthlyHraSurrender(basicPayInr, tier);
  const licenseFee = QUARTER_STANDARDS[quarterType].standardLicenseFeeInr;
  return Number((hra + licenseFee + STANDARD_WATER_ELECTRICITY_INR).toFixed(2));
}

/**
 * Generate tamper-proof SHA-256 seal for faculty quarter record
 */
export function generateQuartersSeal(
  record: Omit<FacultyQuarterRecord, 'cryptographicSeal'>
): string {
  const canonicalPayload = [
    record.allotmentId,
    record.trackingToken,
    record.facultyName,
    record.empId,
    record.quarterType,
    record.quarterNumber || 'WAITLISTED',
    record.basicPayInr,
    record.cityHraTier,
    record.monthlyHraSurrenderedInr.toFixed(2),
    record.stage,
    record.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Register faculty member onto residential quarters waitlist
 */
export function applyForResidentialQuarter(params: {
  facultyName: string;
  empId: string;
  department: string;
  academicPayLevel: string;
  basicPayInr: number;
  dateOfJoiningLevel: string;
  dateOfBirth: string;
  quarterType: QuarterScaleType;
  cityHraTier: CampusCityHraTier;
}): FacultyQuarterRecord {
  if (!params.facultyName.trim()) {
    throw new Error('Faculty name cannot be blank.');
  }

  if (!params.empId.trim()) {
    throw new Error('Employee ID must be specified.');
  }

  if (params.basicPayInr <= 0) {
    throw new Error('Basic pay must be strictly greater than 0.');
  }

  const standard = QUARTER_STANDARDS[params.quarterType];
  const monthlyHraSurrenderedInr = calculateMonthlyHraSurrender(params.basicPayInr, params.cityHraTier);
  const trackingToken = generateQuartersToken(params.quarterType);
  const now = new Date().toISOString();

  const baseRecord: Omit<FacultyQuarterRecord, 'cryptographicSeal'> = {
    allotmentId: `QTR-${Date.now().toString(36).toUpperCase()}`,
    trackingToken,
    facultyName: params.facultyName.trim(),
    empId: params.empId.trim().toUpperCase(),
    department: params.department.trim(),
    academicPayLevel: params.academicPayLevel.trim(),
    basicPayInr: params.basicPayInr,
    dateOfJoiningLevel: params.dateOfJoiningLevel,
    dateOfBirth: params.dateOfBirth,
    quarterType: params.quarterType,
    plinthAreaSqm: standard.plinthAreaSqm,
    cityHraTier: params.cityHraTier,
    monthlyHraSurrenderedInr,
    monthlyLicenseFeeInr: standard.standardLicenseFeeInr,
    monthlyWaterElectricityChargesInr: STANDARD_WATER_ELECTRICITY_INR,
    stage: 'APPLICATION_WAITLISTED',
    lastUpdated: now,
  };

  const cryptographicSeal = generateQuartersSeal(baseRecord);
  return { ...baseRecord, cryptographicSeal };
}

/**
 * Offer quarter to faculty member from priority waitlist
 */
export function offerResidentialQuarter(
  record: FacultyQuarterRecord,
  quarterNumber: string
): FacultyQuarterRecord {
  if (record.stage !== 'APPLICATION_WAITLISTED') {
    throw new Error(`Quarter can only be offered to waitlisted applicants (current: ${record.stage}).`);
  }

  if (!quarterNumber.trim()) {
    throw new Error('Quarter number must be specified.');
  }

  const now = new Date().toISOString();
  const updated: Omit<FacultyQuarterRecord, 'cryptographicSeal'> = {
    ...record,
    quarterNumber: quarterNumber.trim().toUpperCase(),
    stage: 'QUARTER_OFFERED',
    lastUpdated: now,
  };

  const cryptographicSeal = generateQuartersSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Occupy quarter and formally surrender HRA with license fee payroll deduction
 */
export function occupyQuarterAndSurrenderHra(
  record: FacultyQuarterRecord,
  possessionDate: string
): FacultyQuarterRecord {
  if (record.stage !== 'QUARTER_OFFERED') {
    throw new Error(`Cannot occupy quarter: Quarter must be offered first (current: ${record.stage}).`);
  }

  const now = new Date().toISOString();
  const updated: Omit<FacultyQuarterRecord, 'cryptographicSeal'> = {
    ...record,
    possessionDate,
    stage: 'POSSESSION_OCCUPIED_HRA_SURRENDERED',
    lastUpdated: now,
  };

  const cryptographicSeal = generateQuartersSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Serve vacation notice and issue No-Dues Certificate
 */
export function vacateQuarterAndIssueNoDues(
  record: FacultyQuarterRecord,
  vacationDate: string
): FacultyQuarterRecord {
  if (record.stage !== 'POSSESSION_OCCUPIED_HRA_SURRENDERED' && record.stage !== 'VACATION_NOTICE_SERVED') {
    throw new Error('Quarter must be actively occupied to issue surrender certificate.');
  }

  const now = new Date().toISOString();
  const updated: Omit<FacultyQuarterRecord, 'cryptographicSeal'> = {
    ...record,
    vacationDate,
    stage: 'SURRENDERED_NO_DUES_ISSUED',
    lastUpdated: now,
  };

  const cryptographicSeal = generateQuartersSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Export Faculty Residential Quarters Ledger as statutory CSV
 */
export function exportFacultyQuartersLedgerCSV(records: FacultyQuarterRecord[]): string {
  const headers = [
    'Allotment ID',
    'Tracking Token',
    'Faculty Name',
    'Emp ID',
    'Department',
    'Pay Level',
    'Basic Pay INR',
    'Quarter Type',
    'Quarter Number',
    'Plinth Area (sqm)',
    'HRA Tier',
    'Monthly HRA Surrender INR',
    'Monthly License Fee INR',
    'Total Deductions INR',
    'Stage',
    'Possession Date',
    'Cryptographic Seal',
  ];

  const rows = records.map((r) => {
    const totalDeductions = r.monthlyHraSurrenderedInr + r.monthlyLicenseFeeInr + r.monthlyWaterElectricityChargesInr;
    return [
      `"${r.allotmentId}"`,
      `"${r.trackingToken}"`,
      `"${r.facultyName.replace(/"/g, '""')}"`,
      `"${r.empId}"`,
      `"${r.department.replace(/"/g, '""')}"`,
      `"${r.academicPayLevel}"`,
      r.basicPayInr,
      `"${r.quarterType}"`,
      `"${r.quarterNumber || 'WAITLISTED'}"`,
      r.plinthAreaSqm,
      `"${r.cityHraTier}"`,
      r.monthlyHraSurrenderedInr,
      r.monthlyLicenseFeeInr,
      totalDeductions,
      `"${r.stage}"`,
      `"${r.possessionDate || 'N/A'}"`,
      `"${r.cryptographicSeal || ''}"`,
    ];
  });

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Demonstration Faculty Quarter Records
 */
export const INITIAL_FACULTY_QUARTERS: FacultyQuarterRecord[] = [
  {
    allotmentId: 'QTR-2026-001',
    trackingToken: 'QTR-2026-TYPE-9A1002',
    facultyName: 'Dr. Siddharth Sen',
    empId: 'EMP-CSE-042',
    department: 'Computer Science & Engineering',
    academicPayLevel: 'Academic Level 13A',
    basicPayInr: 139600,
    dateOfJoiningLevel: '2021-07-01',
    dateOfBirth: '1981-05-14',
    quarterType: 'TYPE_IV_ASSOCIATE_PROF',
    quarterNumber: 'IV-B-08',
    plinthAreaSqm: 90,
    cityHraTier: 'TIER_X_27PCT',
    monthlyHraSurrenderedInr: 37692, // 27% of 139,600
    monthlyLicenseFeeInr: 1560,
    monthlyWaterElectricityChargesInr: 450,
    possessionDate: '2022-01-15',
    stage: 'POSSESSION_OCCUPIED_HRA_SURRENDERED',
    cryptographicSeal: '9a10023847291048291847192837482910482918471928374829104829184704',
    lastUpdated: '2026-01-10T11:00:00Z',
  },
  {
    allotmentId: 'QTR-2026-002',
    trackingToken: 'QTR-2026-TYPE-3C4491',
    facultyName: 'Dr. Neha Kulkarni',
    empId: 'EMP-EEE-018',
    department: 'Electrical Engineering',
    academicPayLevel: 'Academic Level 12',
    basicPayInr: 101500,
    dateOfJoiningLevel: '2023-08-15',
    dateOfBirth: '1986-11-20',
    quarterType: 'TYPE_IV_ASSOCIATE_PROF',
    plinthAreaSqm: 90,
    cityHraTier: 'TIER_X_27PCT',
    monthlyHraSurrenderedInr: 27405, // 27% of 101,500
    monthlyLicenseFeeInr: 1560,
    monthlyWaterElectricityChargesInr: 450,
    stage: 'APPLICATION_WAITLISTED',
    cryptographicSeal: '3c44913847291048291847192837482910482918471928374829104829184706',
    lastUpdated: '2026-02-14T14:30:00Z',
  },
];
