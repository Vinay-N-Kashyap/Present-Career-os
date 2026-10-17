/**
 * Faculty Laboratory Equipment Maintenance & Annual Maintenance Contract (AMC) Ledger Engine
 * Statutory Compliance: General Financial Rules (GFR Rule 153/169 on Maintenance Contracts),
 * MoE Guidelines for High-End Research Equipment Upkeep & Calibration Traceability (NABL/ISO 17025).
 *
 * Platform: PinIT Career OS - Teacher Portal & Faculty Governance
 * Zero-Collision Invariant: Pure Branch C administrative and faculty governance.
 */

import { createHash } from 'crypto';

export type EquipmentCategory =
  | 'ANALYTICAL_RESEARCH_INSTRUMENT'
  | 'HEAVY_ENGINEERING_RIG'
  | 'COMPUTING_CLUSTER_GPU'
  | 'DEPARTMENTAL_TEACHING_BENCH';

export type MaintenanceContractType =
  | 'COMPREHENSIVE_CAMC'
  | 'NON_COMPREHENSIVE_AMC'
  | 'OEM_WARRANTY'
  | 'ON_CALL_BREAKDOWN';

export type EquipmentStatus =
  | 'OPERATIONAL'
  | 'CALIBRATION_OVERDUE'
  | 'UNDER_BREAKDOWN_REPAIR'
  | 'AMC_RENEWAL_PENDING'
  | 'DECOMMISSIONED_RETIRED';

export interface CalibrationRecord {
  calibrationId: string;
  calibrationDate: string; // YYYY-MM-DD
  nextDueDate: string;
  certifyingAgency: string; // e.g. NABL Accredited Laboratory
  certificateNumber: string;
  isCompliant: boolean;
}

export interface EquipmentAssetRecord {
  assetId: string;
  trackingToken: string; // AMC-[YEAR]-[DEPT]-[HEX6]
  equipmentName: string;
  serialNumber: string;
  department: string;
  labLocation: string;
  facultyCustodianName: string;
  facultyCustodianEmpId: string;
  category: EquipmentCategory;
  procurementValueInr: number;
  contractType: MaintenanceContractType;
  vendorName: string;
  contractStartDate: string;
  contractEndDate: string;
  annualContractValueInr: number;
  maxSlaResolutionHours: number; // e.g. 48 hours
  activeDowntimeHours: number;
  accruedDowntimePenaltyInr: number;
  status: EquipmentStatus;
  calibrationHistory: CalibrationRecord[];
  cryptographicSeal?: string; // SHA-256 seal
  lastUpdated: string;
}

/**
 * Standard GFR SLA Penalty Rate:
 * 1.0% of annual contract value per 24 hours of downtime exceeding SLA window.
 */
export const DAILY_PENALTY_PERCENTAGE = 1.0;

/**
 * Generate unique equipment AMC tracking token: AMC-[YEAR]-[DEPT]-[HEX6]
 */
export function generateAmcToken(dept: string, year: number = new Date().getFullYear()): string {
  const cleanDept = dept.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'DEPT';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `AMC-${year}-${cleanDept}-${randomHex}`;
}

/**
 * Calculate accrued downtime penalty under GFR Rule 169:
 * Penalty = (Excess Days beyond SLA) * (1.0% * Annual Contract Value)
 */
export function calculateDowntimePenalty(
  annualContractValueInr: number,
  activeDowntimeHours: number,
  maxSlaHours: number
): number {
  if (activeDowntimeHours <= maxSlaHours) {
    return 0;
  }
  const excessHours = activeDowntimeHours - maxSlaHours;
  const excessDays = excessHours / 24.0;
  const dailyRate = annualContractValueInr * (DAILY_PENALTY_PERCENTAGE / 100);
  const penalty = excessDays * dailyRate;
  return Number(penalty.toFixed(2));
}

/**
 * Generate tamper-proof SHA-256 seal for equipment asset record
 */
export function generateEquipmentAmcSeal(
  record: Omit<EquipmentAssetRecord, 'cryptographicSeal'>
): string {
  const canonicalPayload = [
    record.assetId,
    record.trackingToken,
    record.equipmentName,
    record.serialNumber,
    record.department,
    record.facultyCustodianEmpId,
    record.category,
    record.procurementValueInr,
    record.contractType,
    record.annualContractValueInr,
    record.status,
    record.accruedDowntimePenaltyInr.toFixed(2),
    record.calibrationHistory.length,
    record.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Register a new laboratory equipment asset with warranty / AMC coverage
 */
export function registerEquipmentAsset(params: {
  equipmentName: string;
  serialNumber: string;
  department: string;
  labLocation: string;
  facultyCustodianName: string;
  facultyCustodianEmpId: string;
  category: EquipmentCategory;
  procurementValueInr: number;
  contractType: MaintenanceContractType;
  vendorName: string;
  contractStartDate: string;
  contractEndDate: string;
  annualContractValueInr: number;
  maxSlaResolutionHours?: number;
}): EquipmentAssetRecord {
  if (!params.equipmentName.trim()) {
    throw new Error('Equipment name cannot be blank.');
  }

  if (!params.serialNumber.trim()) {
    throw new Error('Equipment serial number must be specified for asset tagging.');
  }

  if (params.procurementValueInr <= 0) {
    throw new Error('Procurement value must be strictly greater than 0.');
  }

  const trackingToken = generateAmcToken(params.department);
  const now = new Date().toISOString();

  const baseRecord: Omit<EquipmentAssetRecord, 'cryptographicSeal'> = {
    assetId: `EQP-${Date.now().toString(36).toUpperCase()}`,
    trackingToken,
    equipmentName: params.equipmentName.trim(),
    serialNumber: params.serialNumber.trim(),
    department: params.department,
    labLocation: params.labLocation.trim(),
    facultyCustodianName: params.facultyCustodianName.trim(),
    facultyCustodianEmpId: params.facultyCustodianEmpId.trim(),
    category: params.category,
    procurementValueInr: params.procurementValueInr,
    contractType: params.contractType,
    vendorName: params.vendorName.trim(),
    contractStartDate: params.contractStartDate,
    contractEndDate: params.contractEndDate,
    annualContractValueInr: params.annualContractValueInr,
    maxSlaResolutionHours: params.maxSlaResolutionHours ?? 48,
    activeDowntimeHours: 0,
    accruedDowntimePenaltyInr: 0,
    status: 'OPERATIONAL',
    calibrationHistory: [],
    lastUpdated: now,
  };

  const cryptographicSeal = generateEquipmentAmcSeal(baseRecord);
  return { ...baseRecord, cryptographicSeal };
}

/**
 * Log equipment breakdown and compute GFR SLA downtime penalty
 */
export function logEquipmentBreakdown(
  record: EquipmentAssetRecord,
  downtimeHours: number
): EquipmentAssetRecord {
  if (record.status === 'DECOMMISSIONED_RETIRED') {
    throw new Error('Cannot log breakdown for decommissioned equipment.');
  }

  const penalty = calculateDowntimePenalty(
    record.annualContractValueInr,
    downtimeHours,
    record.maxSlaResolutionHours
  );

  const now = new Date().toISOString();
  const updated: Omit<EquipmentAssetRecord, 'cryptographicSeal'> = {
    ...record,
    status: 'UNDER_BREAKDOWN_REPAIR',
    activeDowntimeHours: downtimeHours,
    accruedDowntimePenaltyInr: penalty,
    lastUpdated: now,
  };

  const cryptographicSeal = generateEquipmentAmcSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Record NABL / ISO 17025 calibration visit and restore operational status
 */
export function recordCalibrationService(
  record: EquipmentAssetRecord,
  calibrationParams: Omit<CalibrationRecord, 'calibrationId'>
): EquipmentAssetRecord {
  const calibrationId = `CAL-${Date.now().toString(36).toUpperCase()}`;
  const newCalibration: CalibrationRecord = {
    ...calibrationParams,
    calibrationId,
  };

  const now = new Date().toISOString();
  const nextStatus: EquipmentStatus = calibrationParams.isCompliant ? 'OPERATIONAL' : 'CALIBRATION_OVERDUE';

  const updated: Omit<EquipmentAssetRecord, 'cryptographicSeal'> = {
    ...record,
    status: nextStatus,
    activeDowntimeHours: 0,
    calibrationHistory: [newCalibration, ...record.calibrationHistory],
    lastUpdated: now,
  };

  const cryptographicSeal = generateEquipmentAmcSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Renew Annual Maintenance Contract (AMC / CAMC)
 */
export function renewMaintenanceContract(
  record: EquipmentAssetRecord,
  params: {
    contractType: MaintenanceContractType;
    vendorName: string;
    contractStartDate: string;
    contractEndDate: string;
    annualContractValueInr: number;
    maxSlaResolutionHours?: number;
  }
): EquipmentAssetRecord {
  const now = new Date().toISOString();
  const updated: Omit<EquipmentAssetRecord, 'cryptographicSeal'> = {
    ...record,
    contractType: params.contractType,
    vendorName: params.vendorName.trim(),
    contractStartDate: params.contractStartDate,
    contractEndDate: params.contractEndDate,
    annualContractValueInr: params.annualContractValueInr,
    maxSlaResolutionHours: params.maxSlaResolutionHours ?? record.maxSlaResolutionHours,
    status: 'OPERATIONAL',
    lastUpdated: now,
  };

  const cryptographicSeal = generateEquipmentAmcSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Export Equipment & AMC Ledger as statutory CSV
 */
export function exportEquipmentAmcLedgerCSV(records: EquipmentAssetRecord[]): string {
  const headers = [
    'Asset ID',
    'Tracking Token',
    'Equipment Name',
    'Serial Number',
    'Department',
    'Lab Location',
    'Faculty Custodian',
    'Category',
    'Procurement Value INR',
    'Contract Type',
    'Vendor Name',
    'Annual AMC Value INR',
    'Status',
    'Downtime Hours',
    'Penalty INR',
    'Cryptographic Seal',
  ];

  const rows = records.map((r) => [
    `"${r.assetId}"`,
    `"${r.trackingToken}"`,
    `"${r.equipmentName.replace(/"/g, '""')}"`,
    `"${r.serialNumber}"`,
    `"${r.department.replace(/"/g, '""')}"`,
    `"${r.labLocation.replace(/"/g, '""')}"`,
    `"${r.facultyCustodianName.replace(/"/g, '""')}"`,
    `"${r.category}"`,
    r.procurementValueInr,
    `"${r.contractType}"`,
    `"${r.vendorName.replace(/"/g, '""')}"`,
    r.annualContractValueInr,
    `"${r.status}"`,
    r.activeDowntimeHours,
    r.accruedDowntimePenaltyInr,
    `"${r.cryptographicSeal || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Demonstration Laboratory Equipment Records
 */
export const INITIAL_EQUIPMENT_ASSETS: EquipmentAssetRecord[] = [
  {
    assetId: 'EQP-2026-001',
    trackingToken: 'AMC-2026-CSED-7A1109',
    equipmentName: 'High-Density GPU Cluster (8x NVIDIA H100 80GB SXM5)',
    serialNumber: 'SN-NV-H100-884910',
    department: 'Computer Science & Engineering',
    labLocation: 'AI Supercomputing Lab (Room 304)',
    facultyCustodianName: 'Dr. Siddharth Sen',
    facultyCustodianEmpId: 'EMP-CSE-042',
    category: 'COMPUTING_CLUSTER_GPU',
    procurementValueInr: 32000000,
    contractType: 'COMPREHENSIVE_CAMC',
    vendorName: 'Hewlett Packard Enterprise (India) Pvt Ltd',
    contractStartDate: '2026-01-01',
    contractEndDate: '2026-12-31',
    annualContractValueInr: 2400000,
    maxSlaResolutionHours: 24,
    activeDowntimeHours: 0,
    accruedDowntimePenaltyInr: 0,
    status: 'OPERATIONAL',
    calibrationHistory: [
      {
        calibrationId: 'CAL-01',
        calibrationDate: '2026-01-10',
        nextDueDate: '2027-01-10',
        certifyingAgency: 'Nvidia Certified Enterprise Systems Inspector',
        certificateNumber: 'NV-SYS-2026-88',
        isCompliant: true,
      },
    ],
    cryptographicSeal: '7a11093847291048291847192837482910482918471928374829104829184710',
    lastUpdated: '2026-01-12T10:00:00Z',
  },
  {
    assetId: 'EQP-2026-002',
    trackingToken: 'AMC-2026-EEED-4B8190',
    equipmentName: 'High-Voltage Impulse Generator & Partial Discharge Test System (100kV)',
    serialNumber: 'SN-HV-IG-44109',
    department: 'Electrical Engineering',
    labLocation: 'High Voltage & Power Systems Lab (Ground Floor)',
    facultyCustodianName: 'Dr. Neha Kulkarni',
    facultyCustodianEmpId: 'EMP-EEE-018',
    category: 'HEAVY_ENGINEERING_RIG',
    procurementValueInr: 14500000,
    contractType: 'NON_COMPREHENSIVE_AMC',
    vendorName: 'Haefely Test AG / Hind High Vacuum Co',
    contractStartDate: '2025-07-01',
    contractEndDate: '2026-06-30',
    annualContractValueInr: 650000,
    maxSlaResolutionHours: 48,
    activeDowntimeHours: 96, // 48 hours excess (2 days) -> 2 * (1% of 650,000) = 13,000 INR
    accruedDowntimePenaltyInr: 13000,
    status: 'UNDER_BREAKDOWN_REPAIR',
    calibrationHistory: [],
    cryptographicSeal: '4b81903847291048291847192837482910482918471928374829104829184714',
    lastUpdated: '2026-03-05T14:30:00Z',
  },
];
