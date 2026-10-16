/**
 * Central University College Affiliation & Inspection Committee Scrutiny Engine
 * Statutory Compliance: UGC (Affiliation of Colleges by Universities) Regulations,
 * AICTE Approval Process Handbook (APH) & State University Statutory Affiliation Acts.
 *
 * Platform: PinIT Career OS - Campus Administration Platform
 * Zero-Collision Invariant: Pure Branch C administrative governance.
 */

import { createHash } from 'crypto';

export type AffiliationType =
  | 'TEMPORARY_PROVISIONAL'
  | 'PERMANENT_AFFILIATION'
  | 'AUTONOMOUS_EXTENSION'
  | 'NEW_PROGRAMME_VARIATION_INTAKE';

export type InspectionStage =
  | 'APPLICATION_SUBMITTED'
  | 'SCRUTINY_DESK_VERIFIED'
  | 'AIC_INSPECTION_SCHEDULED'
  | 'AIC_REPORT_SUBMITTED'
  | 'SYNDICATE_SANCTIONED'
  | 'AFFILIATION_REJECTED';

export type DeficiencySeverity = 'CRITICAL_DEFICIENCY' | 'MINOR_OBSERVATION' | 'COMPLIANT';

export interface AicInspectionFinding {
  areaCategory:
    | 'INFRASTRUCTURE_LAND'
    | 'FACULTY_STUDENT_RATIO'
    | 'LABORATORY_EQUIPMENT'
    | 'LIBRARY_JOURNALS'
    | 'SAFETY_ACCESSIBILITY';
  requiredStandard: string;
  observedMetric: string;
  severity: DeficiencySeverity;
  complianceDeadlineDays?: number;
  isRectified: boolean;
}

export interface AffiliationRecord {
  affiliationId: string;
  certificateToken: string; // AFF-[YEAR]-[INST]-[HEX6]
  institutionCode: string; // e.g. INST-104
  institutionName: string;
  trustOrSociety: string;
  affiliationType: AffiliationType;
  academicYear: string; // e.g. "2026-2027"
  programmeName: string;
  approvedIntake: number; // e.g. 60, 120, 180 seats
  stage: InspectionStage;
  aicChairman?: string;
  aicMembers: string[];
  inspectionDate?: string;
  findings: AicInspectionFinding[];
  syndicateResolutionNumber?: string;
  cryptographicAffiliationSeal?: string; // SHA-256 seal
  remarks?: string;
  lastUpdated: string;
}

/**
 * Generate unique affiliation certificate token: AFF-[YEAR]-[INST]-[HEX6]
 */
export function generateAffiliationToken(instCode: string, year: number = new Date().getFullYear()): string {
  const cleanInst = instCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6) || 'INST';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `AFF-${year}-${cleanInst}-${randomHex}`;
}

/**
 * Evaluate Annual Inspection Committee (AIC) inspection findings
 */
export function evaluateAicCompliance(findings: AicInspectionFinding[]): {
  canApprove: boolean;
  criticalDeficiencyCount: number;
  minorObservationCount: number;
  reason?: string;
} {
  const unrectifiedCritical = findings.filter((f) => f.severity === 'CRITICAL_DEFICIENCY' && !f.isRectified);
  const minorObservations = findings.filter((f) => f.severity === 'MINOR_OBSERVATION');

  if (unrectifiedCritical.length > 0) {
    return {
      canApprove: false,
      criticalDeficiencyCount: unrectifiedCritical.length,
      minorObservationCount: minorObservations.length,
      reason: `Affiliation vetoed: ${unrectifiedCritical.length} critical statutory deficiencies remain unresolved.`,
    };
  }

  return {
    canApprove: true,
    criticalDeficiencyCount: 0,
    minorObservationCount: minorObservations.length,
  };
}

/**
 * Generate tamper-proof SHA-256 seal for affiliation record
 */
export function generateAffiliationSeal(
  record: Omit<AffiliationRecord, 'cryptographicAffiliationSeal'>
): string {
  const canonicalPayload = [
    record.affiliationId,
    record.certificateToken,
    record.institutionCode,
    record.affiliationType,
    record.academicYear,
    record.programmeName,
    record.approvedIntake,
    record.stage,
    record.aicChairman || 'NO_AIC_CHAIR',
    record.findings.length,
    record.syndicateResolutionNumber || 'PENDING_SYNDICATE',
    record.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Register a new college affiliation application
 */
export function registerAffiliationApplication(params: {
  institutionCode: string;
  institutionName: string;
  trustOrSociety: string;
  affiliationType: AffiliationType;
  academicYear: string;
  programmeName: string;
  approvedIntake: number;
  remarks?: string;
}): AffiliationRecord {
  if (params.approvedIntake <= 0) {
    throw new Error('Approved intake must be strictly greater than 0 seats.');
  }

  const certificateToken = generateAffiliationToken(params.institutionCode);
  const now = new Date().toISOString();

  const baseRecord: Omit<AffiliationRecord, 'cryptographicAffiliationSeal'> = {
    affiliationId: `AFF-${Date.now().toString(36).toUpperCase()}`,
    certificateToken,
    institutionCode: params.institutionCode.toUpperCase(),
    institutionName: params.institutionName,
    trustOrSociety: params.trustOrSociety,
    affiliationType: params.affiliationType,
    academicYear: params.academicYear,
    programmeName: params.programmeName,
    approvedIntake: params.approvedIntake,
    stage: 'APPLICATION_SUBMITTED',
    aicMembers: [],
    findings: [],
    remarks: params.remarks,
    lastUpdated: now,
  };

  const cryptographicAffiliationSeal = generateAffiliationSeal(baseRecord);
  return { ...baseRecord, cryptographicAffiliationSeal };
}

/**
 * Schedule Annual Inspection Committee (AIC) inspection visit
 */
export function scheduleAicInspection(
  record: AffiliationRecord,
  params: {
    aicChairman: string;
    aicMembers: string[];
    inspectionDate: string;
  }
): AffiliationRecord {
  if (!params.aicChairman.trim()) {
    throw new Error('AIC Chairman must be nominated from University Senior Professor panel.');
  }

  if (params.aicMembers.length === 0) {
    throw new Error('At least 1 subject expert member must be empaneled for AIC inspection.');
  }

  const now = new Date().toISOString();
  const updated: Omit<AffiliationRecord, 'cryptographicAffiliationSeal'> = {
    ...record,
    stage: 'AIC_INSPECTION_SCHEDULED',
    aicChairman: params.aicChairman.trim(),
    aicMembers: params.aicMembers,
    inspectionDate: params.inspectionDate,
    lastUpdated: now,
  };

  const cryptographicAffiliationSeal = generateAffiliationSeal(updated);
  return { ...updated, cryptographicAffiliationSeal };
}

/**
 * Submit AIC physical inspection findings & deficiency report
 */
export function submitAicInspectionReport(
  record: AffiliationRecord,
  findings: AicInspectionFinding[]
): AffiliationRecord {
  if (record.stage !== 'AIC_INSPECTION_SCHEDULED') {
    throw new Error(`Invalid stage transition: Inspection must be scheduled prior to report submission (current: ${record.stage}).`);
  }

  const now = new Date().toISOString();
  const updated: Omit<AffiliationRecord, 'cryptographicAffiliationSeal'> = {
    ...record,
    stage: 'AIC_REPORT_SUBMITTED',
    findings,
    lastUpdated: now,
  };

  const cryptographicAffiliationSeal = generateAffiliationSeal(updated);
  return { ...updated, cryptographicAffiliationSeal };
}

/**
 * Sanction affiliation by University Syndicate / Executive Council
 */
export function sanctionByUniversitySyndicate(
  record: AffiliationRecord,
  resolutionNumber: string
): AffiliationRecord {
  if (record.stage !== 'AIC_REPORT_SUBMITTED') {
    throw new Error(`Syndicate scrutiny requires submitted AIC inspection report (current: ${record.stage}).`);
  }

  const compliance = evaluateAicCompliance(record.findings);
  if (!compliance.canApprove) {
    throw new Error(compliance.reason);
  }

  const now = new Date().toISOString();
  const updated: Omit<AffiliationRecord, 'cryptographicAffiliationSeal'> = {
    ...record,
    stage: 'SYNDICATE_SANCTIONED',
    syndicateResolutionNumber: resolutionNumber.trim(),
    lastUpdated: now,
  };

  const cryptographicAffiliationSeal = generateAffiliationSeal(updated);
  return { ...updated, cryptographicAffiliationSeal };
}

/**
 * Export Affiliation Inspection Ledger as statutory CSV
 */
export function exportAffiliationAuditCSV(records: AffiliationRecord[]): string {
  const headers = [
    'Affiliation ID',
    'Certificate Token',
    'Institution Code',
    'Institution Name',
    'Trust / Society',
    'Affiliation Type',
    'Academic Year',
    'Programme Name',
    'Approved Intake',
    'Stage',
    'AIC Chairman',
    'Deficiency Count',
    'Syndicate Resolution',
    'Cryptographic Seal',
  ];

  const rows = records.map((r) => [
    `"${r.affiliationId}"`,
    `"${r.certificateToken}"`,
    `"${r.institutionCode}"`,
    `"${r.institutionName.replace(/"/g, '""')}"`,
    `"${r.trustOrSociety.replace(/"/g, '""')}"`,
    `"${r.affiliationType}"`,
    `"${r.academicYear}"`,
    `"${r.programmeName.replace(/"/g, '""')}"`,
    r.approvedIntake,
    `"${r.stage}"`,
    `"${r.aicChairman || 'N/A'}"`,
    r.findings.length,
    `"${r.syndicateResolutionNumber || 'N/A'}"`,
    `"${r.cryptographicAffiliationSeal || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Seed demonstration datasets for College Affiliations
 */
export const INITIAL_AFFILIATION_RECORDS: AffiliationRecord[] = [
  {
    affiliationId: 'AFF-2026-001',
    certificateToken: 'AFF-2026-SIT04-8B1A20',
    institutionCode: 'INST-SIT04',
    institutionName: 'St. Xavier Institute of Technology',
    trustOrSociety: 'Xavier Educational & Charitable Trust',
    affiliationType: 'PERMANENT_AFFILIATION',
    academicYear: '2026-2027',
    programmeName: 'B.Tech Computer Science & Artificial Intelligence',
    approvedIntake: 180,
    stage: 'SYNDICATE_SANCTIONED',
    aicChairman: 'Prof. B. K. Ramanathan (Former Dean of Engineering)',
    aicMembers: ['Dr. Ananya Sen (Dept of CSE)', 'Prof. Rajesh K. Varma (AICTE Nominee)'],
    inspectionDate: '2026-02-18',
    findings: [
      {
        areaCategory: 'FACULTY_STUDENT_RATIO',
        requiredStandard: '1:15 Cadre Ratio (Cadre Prof:Assoc:Asst = 1:2:6)',
        observedMetric: 'Cadre ratio verified at 1:14.2 with 100% PhD qualification in core AI faculty.',
        severity: 'COMPLIANT',
        isRectified: true,
      },
      {
        areaCategory: 'LABORATORY_EQUIPMENT',
        requiredStandard: 'NVIDIA GPU Workstation cluster with >= 100 TFLOPS FP16 compute',
        observedMetric: '4x NVIDIA A100 80GB clusters operational in AI Research Lab.',
        severity: 'COMPLIANT',
        isRectified: true,
      },
    ],
    syndicateResolutionNumber: 'SYN-RES-2026-ITEM-44',
    cryptographicAffiliationSeal: '4a91b03847291048291847192837482910482918471928374829104829184712',
    remarks: 'Permanent affiliation recommended by Syndicate based on NAAC A++ accreditation and zero deficiencies.',
    lastUpdated: '2026-03-01T11:00:00Z',
  },
  {
    affiliationId: 'AFF-2026-002',
    certificateToken: 'AFF-2026-GEC09-31F9B2',
    institutionCode: 'INST-GEC09',
    institutionName: 'Government Engineering College, Greenfield Campus',
    trustOrSociety: 'Department of Higher Education, State Government',
    affiliationType: 'NEW_PROGRAMME_VARIATION_INTAKE',
    academicYear: '2026-2027',
    programmeName: 'B.Tech Robotics & Autonomous Mechatronics',
    approvedIntake: 60,
    stage: 'AIC_REPORT_SUBMITTED',
    aicChairman: 'Prof. K. S. Balasubramanian (Mechanical & Robotics)',
    aicMembers: ['Dr. Neha Kulkarni (Electrical)', 'Col. V. R. Sharma (Industry Expert)'],
    inspectionDate: '2026-03-10',
    findings: [
      {
        areaCategory: 'LABORATORY_EQUIPMENT',
        requiredStandard: '6-DOF Industrial Robot Arm with ROS2 real-time kinematics controllers',
        observedMetric: 'Procurement PO issued under GeM; delivery pending within 30 days.',
        severity: 'MINOR_OBSERVATION',
        complianceDeadlineDays: 45,
        isRectified: false,
      },
    ],
    cryptographicAffiliationSeal: '98d1204859182374b891820491823bc89104829fa2198d1a37c02b9f8481238',
    remarks: 'AIC report submitted. Minor observation on robot arm delivery pending compliance verification.',
    lastUpdated: '2026-03-12T14:30:00Z',
  },
  {
    affiliationId: 'AFF-2026-003',
    certificateToken: 'AFF-2026-PCE12-9A4C01',
    institutionCode: 'INST-PCE12',
    institutionName: 'Polytechnic College of Engineering & Research',
    trustOrSociety: 'Pratibha Vidya Mandal',
    affiliationType: 'TEMPORARY_PROVISIONAL',
    academicYear: '2026-2027',
    programmeName: 'B.Tech Civil & Infrastructure Engineering',
    approvedIntake: 60,
    stage: 'AIC_REPORT_SUBMITTED',
    aicChairman: 'Prof. Ramesh Sharma (Civil & Structural Engg)',
    aicMembers: ['Dr. P. K. Deshmukh', 'Dr. S. K. Gupta'],
    inspectionDate: '2026-03-05',
    findings: [
      {
        areaCategory: 'FACULTY_STUDENT_RATIO',
        requiredStandard: '1:20 FSR with minimum 2 Associate Professors',
        observedMetric: 'FSR currently 1:28; zero Associate Professors on regular payroll.',
        severity: 'CRITICAL_DEFICIENCY',
        complianceDeadlineDays: 30,
        isRectified: false,
      },
    ],
    cryptographicAffiliationSeal: '1048291847192837482910482918471928374829104829184719283748291048',
    remarks: 'Critical deficiency in faculty cadre ratio. Show-cause notice issued; cannot sanction until rectified.',
    lastUpdated: '2026-03-08T09:15:00Z',
  },
];
