/**
 * Central University Equal Opportunity Cell (EOC), PwD Accessibility & Diversity Compliance Engine
 * 
 * Statutory & Regulatory Framework:
 * - Rights of Persons with Disabilities (RPwD) Act 2016 (Statutory 4% reservation, 40% benchmark disability)
 * - UGC Guidelines for Schemes of Equal Opportunity Cell (EOC) in Universities and Colleges
 * - CPWD Harmonised Guidelines and Standards for Universal Accessibility in Built Environment 2021
 * - Ministry of Social Justice and Empowerment Unique Disability ID (UDID) Card Standard
 * - NEP 2020 Socially and Economically Disadvantaged Groups (SEDGs) and Gender/Disability Inclusion Framework
 * - UGC Standard Operating Procedure for Scribe and Compensatory Time in Academic Examinations
 */

import { createHash } from 'crypto';

export type DisabilityCategory = 
  | 'LOCOMOTOR_DISABILITY'
  | 'VISUAL_IMPAIRMENT_BLINDNESS'
  | 'LOW_VISION'
  | 'HEARING_SPEECH_IMPAIRMENT'
  | 'AUTISM_SPEC_NEURODIVERGENT'
  | 'MULTIPLE_DISABILITIES_OTHER';

export type AssistiveServiceType = 
  | 'EXAM_SCRIBE_COMPENSATORY_TIME'
  | 'ASSISTIVE_TECHNOLOGY_HARDWARE'
  | 'MOBILITY_TRANSPORT_SHUTTLE'
  | 'SIGN_LANGUAGE_INTERPRETER'
  | 'REMEDIAL_COACHING_GRANT';

export type FacilityAuditType = 
  | 'BUILDING_RAMP_ENTRANCE'
  | 'BRAILLE_ELEVATOR_LIFT'
  | 'TACTILE_FLOORING_PATHWAY'
  | 'ACCESSIBLE_WASHROOM'
  | 'DIGITAL_PORTAL_WCAG_A11Y';

export interface AllocatedService {
  serviceId: string;
  serviceType: AssistiveServiceType;
  sanctionDate: string;
  validUntil: string;
  assignedResourceDetails: string;
  disbursedCostInr: number;
  status: 'ACTIVE' | 'UTILIZED_COMPLETED' | 'REVOKED';
}

export interface EocScholarRecord {
  scholarRecordId: string; // Token format: EOC-[YEAR]-[CAT]-[HEX6]
  studentRollNumber: string;
  scholarName: string;
  department: string;
  academicYear: string;
  disabilityCategory: DisabilityCategory;
  udidNumber: string; // 18-character alphanumeric Unique Disability ID
  disabilityPercentage: number;
  isBenchmarkDisability: boolean; // >= 40% benchmark under RPwD Act 2016
  allocatedServices: AllocatedService[];
  accessibilityAccommodations: string[];
  status: 'REGISTERED_ACTIVE' | 'SERVICES_DISBURSED' | 'GRADUATED_DISCHARGED';
  createdTimestamp: string;
  auditSha256: string;
}

export interface CampusAccessibilityAudit {
  auditId: string; // Token format: AUD-A11Y-[HEX6]
  buildingName: string;
  facilityType: FacilityAuditType;
  auditScorePercent: number; // 0 to 100%
  isCompliant: boolean; // >= 80% benchmark compliance
  deficienciesIdentified: string[];
  rectificationDeadline: string;
  rectificationCostEstInr: number;
  status: 'AUDITED_PENDING_CIVIL' | 'RECTIFICATION_COMPLETED';
}

// Statutory Benchmark Threshold: Minimum 40% disability required for affirmative action benefits
export const MIN_BENCHMARK_DISABILITY_PERCENT = 40;

// Statutory Exam Compensatory Time: 20 minutes per 1 hour (60 mins) of examination
export const STATUTORY_COMPENSATORY_MINS_PER_HOUR = 20;

/**
 * Validate Unique Disability ID (UDID) format (18 alphanumeric characters)
 */
export function validateUdidFormat(udid: string): boolean {
  const sanitized = udid.replace(/[-\s]/g, '').toUpperCase();
  return /^[A-Z]{2}[0-9]{16}$/.test(sanitized);
}

/**
 * Generate cryptographic SHA-256 seal for Equal Opportunity Scholar Record
 */
export function generateEocSeal(record: Omit<EocScholarRecord, 'auditSha256'>): string {
  const payload = [
    record.scholarRecordId,
    record.studentRollNumber,
    record.udidNumber,
    record.disabilityCategory,
    record.disabilityPercentage,
    record.isBenchmarkDisability,
    record.allocatedServices.length,
    record.status
  ].join('|');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Format statutory unique EOC scholar record token
 */
export function formatEocRecordId(disabilityCategory: DisabilityCategory, year: number = 2026): string {
  const catCode = disabilityCategory.substring(0, 4).toUpperCase();
  const hex = createHash('sha256')
    .update(`${disabilityCategory}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();
  return `EOC-${year}-${catCode}-${hex}`;
}

/**
 * Register a new PwD Scholar with Equal Opportunity Cell (EOC)
 */
export function registerEocScholar(params: {
  studentRollNumber: string;
  scholarName: string;
  department: string;
  academicYear?: string;
  disabilityCategory: DisabilityCategory;
  udidNumber: string;
  disabilityPercentage: number;
  accommodations?: string[];
  year?: number;
}): EocScholarRecord {
  if (!validateUdidFormat(params.udidNumber)) {
    throw new Error(`Invalid UDID card format. Must be an 18-character statutory Indian UDID (2-letter state code + 16 digits).`);
  }

  if (params.disabilityPercentage < 1 || params.disabilityPercentage > 100) {
    throw new Error(`Disability percentage must be between 1% and 100%.`);
  }

  const isBenchmark = params.disabilityPercentage >= MIN_BENCHMARK_DISABILITY_PERCENT;
  const scholarRecordId = formatEocRecordId(params.disabilityCategory, params.year);
  const now = new Date().toISOString();

  const baseRecord: Omit<EocScholarRecord, 'auditSha256'> = {
    scholarRecordId,
    studentRollNumber: params.studentRollNumber,
    scholarName: params.scholarName,
    department: params.department,
    academicYear: params.academicYear || '2025-2026',
    disabilityCategory: params.disabilityCategory,
    udidNumber: params.udidNumber.toUpperCase(),
    disabilityPercentage: params.disabilityPercentage,
    isBenchmarkDisability: isBenchmark,
    allocatedServices: [],
    accessibilityAccommodations: params.accommodations || ['Accessible Ground Floor Seating', 'Compensatory Exam Time'],
    status: 'REGISTERED_ACTIVE',
    createdTimestamp: now
  };

  const auditSha256 = generateEocSeal(baseRecord);
  return { ...baseRecord, auditSha256 };
}

/**
 * Assign and sanction an Assistive Device or Service to an EOC Scholar
 */
export function assignAssistiveService(
  record: EocScholarRecord,
  params: {
    serviceType: AssistiveServiceType;
    assignedResourceDetails: string;
    disbursedCostInr: number;
    validityMonths?: number;
  }
): { record: EocScholarRecord; service: AllocatedService } {
  const serviceId = `SRV-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date();
  const validUntil = new Date(now);
  validUntil.setMonth(validUntil.getMonth() + (params.validityMonths || 12));

  const service: AllocatedService = {
    serviceId,
    serviceType: params.serviceType,
    sanctionDate: now.toISOString().split('T')[0],
    validUntil: validUntil.toISOString().split('T')[0],
    assignedResourceDetails: params.assignedResourceDetails,
    disbursedCostInr: params.disbursedCostInr,
    status: 'ACTIVE'
  };

  const updated: EocScholarRecord = {
    ...record,
    status: 'SERVICES_DISBURSED',
    allocatedServices: [service, ...record.allocatedServices]
  };

  return {
    record: { ...updated, auditSha256: generateEocSeal(updated) },
    service
  };
}

/**
 * Calculate statutory compensatory examination time under UGC/RPwD norms
 * Rule: 20 minutes compensatory extra time per 60 minutes for benchmark disability (>=40%)
 */
export function calculateExamCompensatoryTime(examMinutes: number, disabilityPercentage: number): number {
  if (disabilityPercentage < MIN_BENCHMARK_DISABILITY_PERCENT) {
    return 0;
  }
  const hours = examMinutes / 60;
  return Math.round(hours * STATUTORY_COMPENSATORY_MINS_PER_HOUR);
}

/**
 * Conduct and register a CPWD/UGC Universal Campus Accessibility Infrastructure Audit
 */
export function conductAccessibilityAudit(params: {
  buildingName: string;
  facilityType: FacilityAuditType;
  auditScorePercent: number;
  deficienciesIdentified: string[];
  rectificationCostEstInr: number;
  targetDays?: number;
}): CampusAccessibilityAudit {
  const hex = createHash('sha256')
    .update(`${params.buildingName}-${params.facilityType}-${Date.now()}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();
  
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + (params.targetDays || 90));

  return {
    auditId: `AUD-A11Y-${hex}`,
    buildingName: params.buildingName,
    facilityType: params.facilityType,
    auditScorePercent: params.auditScorePercent,
    isCompliant: params.auditScorePercent >= 80,
    deficienciesIdentified: params.deficienciesIdentified,
    rectificationDeadline: deadline.toISOString().split('T')[0],
    rectificationCostEstInr: params.rectificationCostEstInr,
    status: params.auditScorePercent >= 80 ? 'RECTIFICATION_COMPLETED' : 'AUDITED_PENDING_CIVIL'
  };
}

/**
 * Export official CSV of Equal Opportunity Cell (EOC) Scholar Ledger
 */
export function exportEocLedgerCSV(records: EocScholarRecord[]): string {
  const headers = [
    'Scholar Record ID',
    'Roll Number',
    'Scholar Name',
    'Department',
    'Disability Category',
    'UDID Number',
    'Disability %',
    'Benchmark PwD (>=40%)',
    'Services Count',
    'Status',
    'Audit SHA-256'
  ];

  const rows = records.map(r => {
    return [
      r.scholarRecordId,
      r.studentRollNumber,
      `"${r.scholarName}"`,
      r.department,
      r.disabilityCategory,
      r.udidNumber,
      `${r.disabilityPercentage}%`,
      r.isBenchmarkDisability ? 'YES' : 'NO',
      r.allocatedServices.length,
      r.status,
      r.auditSha256
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Sample initial dataset for Equal Opportunity Cell and Campus Accessibility
 */
export const SAMPLE_EOC_SCHOLARS: EocScholarRecord[] = [
  registerEocScholar({
    studentRollNumber: '2023CSB024',
    scholarName: 'Aarav Sundaram',
    department: 'Computer Science & Engineering',
    disabilityCategory: 'VISUAL_IMPAIRMENT_BLINDNESS',
    udidNumber: 'KA0210419980012345',
    disabilityPercentage: 100,
    accommodations: ['JAWS Screen Reader Software', 'Exam Scribe + 60m Extra Time', 'Accessible Ground Floor Lab']
  }),
  registerEocScholar({
    studentRollNumber: '2024ECE019',
    scholarName: 'Priya Meenakshi',
    department: 'Electronics & Communication',
    disabilityCategory: 'LOCOMOTOR_DISABILITY',
    udidNumber: 'DL0420520010067890',
    disabilityPercentage: 65,
    accommodations: ['Battery EV Campus Shuttle', 'Ramp & Elevator Priority Key', '20m Compensatory Exam Time']
  })
];

export const SAMPLE_A11Y_AUDITS: CampusAccessibilityAudit[] = [
  conductAccessibilityAudit({
    buildingName: 'Dr. A.P.J. Abdul Kalam Central Academic Complex',
    facilityType: 'BUILDING_RAMP_ENTRANCE',
    auditScorePercent: 95,
    deficienciesIdentified: ['Ramp gradient exceeds 1:12 on North entrance — rectified with 1:15 dual handrail'],
    rectificationCostEstInr: 45000
  }),
  conductAccessibilityAudit({
    buildingName: 'Sir C.V. Raman Science & Research Laboratories',
    facilityType: 'BRAILLE_ELEVATOR_LIFT',
    auditScorePercent: 62,
    deficienciesIdentified: ['Missing auditory floor chime annunciator', 'Braille buttons worn out on Ground Floor'],
    rectificationCostEstInr: 120000,
    targetDays: 45
  })
];
