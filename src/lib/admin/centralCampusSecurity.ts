/**
 * Central University Campus Security, Gate Pass Access Control & Visitor Protocol Engine
 * Statutory Compliance: University Security Manual, Ministry of Home Affairs (MHA)
 * Campus Perimeter Security Guidelines, Automated RFID / ANPR Vehicle Access & Visitor Regulations.
 *
 * Platform: PinIT Career OS - Campus Administration Platform
 * Zero-Collision Invariant: Pure Branch C administrative governance.
 */

import { createHash } from 'crypto';

export type SecurityPassType =
  | 'RESIDENT_STUDENT_OUT_PASS'
  | 'FACULTY_STAFF_VEHICLE_PASS'
  | 'OFFICIAL_VISITOR_ENTRY_PASS'
  | 'CONTRACTOR_LABOUR_BADGE'
  | 'EMERGENCY_AMBULANCE_FIRE_ACCESS';

export type GateCheckpointId =
  | 'MAIN_CAMPUS_GATE_1'
  | 'RESIDENTIAL_NORTH_GATE_2'
  | 'RESEARCH_PARK_EAST_GATE_3'
  | 'SPORTS_COMPLEX_WEST_GATE_4';

export type SecurityPassLifecycleStage =
  | 'PASS_ISSUED'
  | 'ACTIVE_ON_CAMPUS'
  | 'LOGGED_OUT_OF_CAMPUS'
  | 'CURFEW_OVERSTAY_FLAGGED'
  | 'PASS_EXPIRED_CLOSED'
  | 'BLACKLISTED_SECURITY_HOLD';

export interface VehicleDetails {
  vehicleRegistrationNumber: string; // e.g. DL-01-AB-1234
  vehicleType: 'TWO_WHEELER' | 'FOUR_WHEELER' | 'COMMERCIAL_TRUCK' | 'EMERGENCY_VAN';
  isRfidTagActive: boolean;
}

export interface SecurityGatePassRecord {
  passId: string;
  trackingToken: string; // SEC-[YEAR]-[GATE]-[HEX6]
  passType: SecurityPassType;
  holderFullName: string;
  holderContactPhone: string;
  holderIdProofType: 'UNIVERSITY_ID' | 'AADHAAR' | 'DRIVING_LICENSE' | 'PASSPORT';
  holderIdProofNumber: string;
  affiliatedDepartmentOrHost: string;
  purposeOfVisit: string;
  entryCheckpoint: GateCheckpointId;
  exitCheckpoint?: GateCheckpointId;
  entryTimestamp: string;
  expectedExitTimestamp: string;
  actualExitTimestamp?: string;
  vehicle?: VehicleDetails;
  isCurfewApplicable: boolean;
  curfewDeadlineTimestamp?: string; // e.g. 21:30 curfew
  isOverstayDetected: boolean;
  stage: SecurityPassLifecycleStage;
  securityOfficerBadgeId: string;
  cryptographicSeal?: string; // SHA-256 seal
  lastUpdated: string;
}

/**
 * Standard Campus Gate Hours & Curfew Parameters:
 * - Resident Student Standard Curfew: 21:30 (9:30 PM)
 * - Visitor Access Hours: 08:00 to 20:00 (8:00 AM to 8:00 PM)
 */
export const STANDARD_STUDENT_CURFEW_HOUR = 21.5; // 21:30
export const MAX_VISITOR_PERMITTED_HOURS = 12;

/**
 * Generate unique security pass tracking token: SEC-[YEAR]-[GATE]-[HEX6]
 */
export function generateSecurityToken(
  checkpoint: GateCheckpointId,
  year: number = new Date().getFullYear()
): string {
  const cleanGate = checkpoint.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4) || 'GATE';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `SEC-${year}-${cleanGate}-${randomHex}`;
}

/**
 * Check if a timestamp exceeds the specified curfew deadline
 */
export function checkCurfewOverstay(currentTimestamp: string, curfewDeadlineTimestamp: string): boolean {
  const current = new Date(currentTimestamp).getTime();
  const deadline = new Date(curfewDeadlineTimestamp).getTime();
  return current > deadline;
}

/**
 * Generate tamper-proof SHA-256 seal for security pass record
 */
export function generateSecurityPassSeal(
  record: Omit<SecurityGatePassRecord, 'cryptographicSeal'>
): string {
  const canonicalPayload = [
    record.passId,
    record.trackingToken,
    record.passType,
    record.holderFullName,
    record.holderIdProofNumber,
    record.entryCheckpoint,
    record.entryTimestamp,
    record.expectedExitTimestamp,
    record.stage,
    record.isOverstayDetected ? 'OVERSTAY' : 'ON_SCHEDULE',
    record.securityOfficerBadgeId,
    record.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Issue new campus security gate pass
 */
export function issueSecurityGatePass(params: {
  passType: SecurityPassType;
  holderFullName: string;
  holderContactPhone: string;
  holderIdProofType: 'UNIVERSITY_ID' | 'AADHAAR' | 'DRIVING_LICENSE' | 'PASSPORT';
  holderIdProofNumber: string;
  affiliatedDepartmentOrHost: string;
  purposeOfVisit: string;
  entryCheckpoint: GateCheckpointId;
  expectedExitTimestamp: string;
  vehicle?: VehicleDetails;
  isCurfewApplicable?: boolean;
  curfewDeadlineTimestamp?: string;
  securityOfficerBadgeId: string;
}): SecurityGatePassRecord {
  if (!params.holderFullName.trim()) {
    throw new Error('Pass holder full name cannot be blank.');
  }

  if (!params.holderContactPhone.trim()) {
    throw new Error('Emergency contact phone number must be provided for security gate access.');
  }

  const trackingToken = generateSecurityToken(params.entryCheckpoint);
  const now = new Date().toISOString();
  const isCurfew = params.isCurfewApplicable ?? (params.passType === 'RESIDENT_STUDENT_OUT_PASS');

  const baseRecord: Omit<SecurityGatePassRecord, 'cryptographicSeal'> = {
    passId: `SEC-${Date.now().toString(36).toUpperCase()}`,
    trackingToken,
    passType: params.passType,
    holderFullName: params.holderFullName.trim(),
    holderContactPhone: params.holderContactPhone.trim(),
    holderIdProofType: params.holderIdProofType,
    holderIdProofNumber: params.holderIdProofNumber.trim().toUpperCase(),
    affiliatedDepartmentOrHost: params.affiliatedDepartmentOrHost.trim(),
    purposeOfVisit: params.purposeOfVisit.trim(),
    entryCheckpoint: params.entryCheckpoint,
    entryTimestamp: now,
    expectedExitTimestamp: params.expectedExitTimestamp,
    vehicle: params.vehicle,
    isCurfewApplicable: isCurfew,
    curfewDeadlineTimestamp: params.curfewDeadlineTimestamp,
    isOverstayDetected: false,
    stage: 'ACTIVE_ON_CAMPUS',
    securityOfficerBadgeId: params.securityOfficerBadgeId.trim().toUpperCase(),
    lastUpdated: now,
  };

  const cryptographicSeal = generateSecurityPassSeal(baseRecord);
  return { ...baseRecord, cryptographicSeal };
}

/**
 * Log outward exit of pass holder at security gate checkpoint
 */
export function logSecurityPassExit(
  record: SecurityGatePassRecord,
  exitCheckpoint: GateCheckpointId,
  exitTimestamp: string = new Date().toISOString()
): SecurityGatePassRecord {
  if (record.stage === 'LOGGED_OUT_OF_CAMPUS' || record.stage === 'PASS_EXPIRED_CLOSED') {
    throw new Error('Gate pass has already been logged out.');
  }

  if (record.stage === 'BLACKLISTED_SECURITY_HOLD') {
    throw new Error('Cannot log routine exit: Pass is currently detained under security hold.');
  }

  const isOverstay = record.curfewDeadlineTimestamp
    ? checkCurfewOverstay(exitTimestamp, record.curfewDeadlineTimestamp)
    : false;

  const nextStage: SecurityPassLifecycleStage = isOverstay
    ? 'CURFEW_OVERSTAY_FLAGGED'
    : 'LOGGED_OUT_OF_CAMPUS';

  const now = new Date().toISOString();
  const updated: Omit<SecurityGatePassRecord, 'cryptographicSeal'> = {
    ...record,
    exitCheckpoint,
    actualExitTimestamp: exitTimestamp,
    isOverstayDetected: isOverstay,
    stage: nextStage,
    lastUpdated: now,
  };

  const cryptographicSeal = generateSecurityPassSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Flag security hold / blacklisting for access breach
 */
export function flagSecurityBreach(
  record: SecurityGatePassRecord,
  securityReason: string
): SecurityGatePassRecord {
  const now = new Date().toISOString();
  const updated: Omit<SecurityGatePassRecord, 'cryptographicSeal'> = {
    ...record,
    purposeOfVisit: `${record.purposeOfVisit} [SECURITY BREACH: ${securityReason}]`,
    stage: 'BLACKLISTED_SECURITY_HOLD',
    lastUpdated: now,
  };

  const cryptographicSeal = generateSecurityPassSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Export Campus Security Pass Ledger as statutory CSV
 */
export function exportCampusSecurityLedgerCSV(records: SecurityGatePassRecord[]): string {
  const headers = [
    'Pass ID',
    'Tracking Token',
    'Pass Type',
    'Holder Name',
    'Phone',
    'ID Proof',
    'Affiliated Host',
    'Purpose',
    'Entry Checkpoint',
    'Exit Checkpoint',
    'Entry Timestamp',
    'Exit Timestamp',
    'Vehicle Reg No',
    'Overstay Flagged',
    'Stage',
    'Security Officer',
    'Cryptographic Seal',
  ];

  const rows = records.map((r) => [
    `"${r.passId}"`,
    `"${r.trackingToken}"`,
    `"${r.passType}"`,
    `"${r.holderFullName.replace(/"/g, '""')}"`,
    `"${r.holderContactPhone}"`,
    `"${r.holderIdProofType}: ${r.holderIdProofNumber}"`,
    `"${r.affiliatedDepartmentOrHost.replace(/"/g, '""')}"`,
    `"${r.purposeOfVisit.replace(/"/g, '""')}"`,
    `"${r.entryCheckpoint}"`,
    `"${r.exitCheckpoint || 'ON_CAMPUS'}"`,
    `"${r.entryTimestamp}"`,
    `"${r.actualExitTimestamp || 'N/A'}"`,
    `"${r.vehicle?.vehicleRegistrationNumber || 'PEDESTRIAN'}"`,
    r.isOverstayDetected ? 'YES' : 'NO',
    `"${r.stage}"`,
    `"${r.securityOfficerBadgeId}"`,
    `"${r.cryptographicSeal || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Demonstration Campus Security Gate Records
 */
export const INITIAL_SECURITY_PASSES: SecurityGatePassRecord[] = [
  {
    passId: 'SEC-2026-001',
    trackingToken: 'SEC-2026-MAIN-9A1010',
    passType: 'RESIDENT_STUDENT_OUT_PASS',
    holderFullName: 'Kunal Verma',
    holderContactPhone: '+91-9876543210',
    holderIdProofType: 'UNIVERSITY_ID',
    holderIdProofNumber: 'ID-2024-CSE-091',
    affiliatedDepartmentOrHost: 'Block B Hostels (Warden sanctioned)',
    purposeOfVisit: 'Weekend library & medical store errand',
    entryCheckpoint: 'MAIN_CAMPUS_GATE_1',
    entryTimestamp: '2026-04-10T16:00:00Z',
    expectedExitTimestamp: '2026-04-10T21:00:00Z',
    isCurfewApplicable: true,
    curfewDeadlineTimestamp: '2026-04-10T21:30:00Z',
    isOverstayDetected: false,
    stage: 'ACTIVE_ON_CAMPUS',
    securityOfficerBadgeId: 'SEC-OFF-082',
    cryptographicSeal: '9a10103847291048291847192837482910482918471928374829104829184701',
    lastUpdated: '2026-04-10T16:00:00Z',
  },
  {
    passId: 'SEC-2026-002',
    trackingToken: 'SEC-2026-RESE-4C8190',
    passType: 'OFFICIAL_VISITOR_ENTRY_PASS',
    holderFullName: 'Dr. Vivek Swaminathan',
    holderContactPhone: '+91-9811223344',
    holderIdProofType: 'AADHAAR',
    holderIdProofNumber: 'XXXX-XXXX-4412',
    affiliatedDepartmentOrHost: 'Department of Electrical Engineering (Dr. Neha Kulkarni)',
    purposeOfVisit: 'External PhD Viva Examiner & Research Evaluation',
    entryCheckpoint: 'RESEARCH_PARK_EAST_GATE_3',
    entryTimestamp: '2026-04-10T09:30:00Z',
    expectedExitTimestamp: '2026-04-10T17:30:00Z',
    actualExitTimestamp: '2026-04-10T17:15:00Z',
    exitCheckpoint: 'MAIN_CAMPUS_GATE_1',
    vehicle: {
      vehicleRegistrationNumber: 'KA-01-MJ-9914',
      vehicleType: 'FOUR_WHEELER',
      isRfidTagActive: true,
    },
    isCurfewApplicable: false,
    isOverstayDetected: false,
    stage: 'LOGGED_OUT_OF_CAMPUS',
    securityOfficerBadgeId: 'SEC-OFF-014',
    cryptographicSeal: '4c81903847291048291847192837482910482918471928374829104829184705',
    lastUpdated: '2026-04-10T17:15:00Z',
  },
];
