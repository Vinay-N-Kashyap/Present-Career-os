/**
 * Central University Internal Audit & CAG Statutory Compliance Review Engine
 * 
 * Statutory & Institutional Regulatory Framework:
 * - Comptroller and Auditor General of India (CAG) Regulations on Audit and Accounts 2020
 * - General Financial Rules 2017 (GFR 2017) Rule 144/149 (Public Procurement & GeM Mandate)
 * - Public Accounts Committee (PAC) Action Taken Note (ATN) Guidelines
 * - University Internal Audit Manual & Finance Committee Audit Para Resolution
 */

import { createHash } from 'crypto';

export type AuditParaCategory = 
  | 'PROCUREMENT_TENDER_IRREGULARITY'
  | 'UNAUTHORIZED_FEE_CONCESSION'
  | 'ESTABLISHMENT_PAY_FIXATION_ERROR'
  | 'RESEARCH_GRANT_UNSPENT_BALANCE_RETENTION'
  | 'WORKS_CONTRACT_DELAY_PENALTY_NON_RECOVERY';

export type AuditSeverity = 
  | 'CRITICAL_CAG_PARA'
  | 'MAJOR_INTERNAL_OBSERVATION'
  | 'ROUTINE_PROCEDURAL_QUERY';

export type AuditStatus = 
  | 'HALF_MARGIN_QUERY_ISSUED'
  | 'DEPARTMENT_REPLY_SUBMITTED'
  | 'ATN_ACTION_TAKEN_NOTE_ACCEPTED'
  | 'REJECTED_AUDIT_PARA_SUSTAINED'
  | 'DROPPED_AND_RESOLVED';

export interface AuditObservationRecord {
  auditRecordId: string; // Token format: AUD-[YEAR]-[CAT]-[HEX6]
  financialYear: string; // e.g. "2025-2026"
  auditingBody: 'CAG_PRINCIPAL_DIRECTOR_AUDIT' | 'INTERNAL_AUDIT_OFFICE' | 'MINISTRY_FINANCE_INSPECTION';
  department: string;
  category: AuditParaCategory;
  severity: AuditSeverity;
  observationTitle: string;
  observationNarrative: string;
  financialImplicationInr: number;
  remedialRecoveryAmountInr: number;
  pendingRecoveryInr: number;
  targetResolutionDate: string; // ISO Date YYYY-MM-DD
  halfMarginIssueDate: string; // ISO Date YYYY-MM-DD
  departmentReplyDate?: string;
  actionTakenNoteNarrative?: string;
  recoveryVoucherNumber?: string;
  status: AuditStatus;
  createdTimestamp: string;
  auditSha256: string;
}

/**
 * Generate cryptographic SHA-256 seal for Audit Observation Record
 */
export function generateAuditSeal(record: Omit<AuditObservationRecord, 'auditSha256'>): string {
  const payload = [
    record.auditRecordId,
    record.financialYear,
    record.auditingBody,
    record.department,
    record.category,
    record.severity,
    record.financialImplicationInr,
    record.remedialRecoveryAmountInr,
    record.pendingRecoveryInr,
    record.status,
    record.targetResolutionDate
  ].join('|');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Format statutory unique audit observation identifier token
 */
export function formatAuditRecordId(category: AuditParaCategory, year: number = 2026): string {
  const catCode = category === 'PROCUREMENT_TENDER_IRREGULARITY' ? 'PROC'
    : category === 'ESTABLISHMENT_PAY_FIXATION_ERROR' ? 'PAY'
    : category === 'RESEARCH_GRANT_UNSPENT_BALANCE_RETENTION' ? 'GRNT'
    : category === 'WORKS_CONTRACT_DELAY_PENALTY_NON_RECOVERY' ? 'WRKS'
    : 'FEES';
  const hex = createHash('sha256')
    .update(`${category}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();
  return `AUD-${year}-${catCode}-${hex}`;
}

/**
 * Check if an audit observation is overdue for resolution
 */
export function isAuditOverdue(record: Pick<AuditObservationRecord, 'targetResolutionDate' | 'status'>, referenceDate: string = new Date().toISOString()): boolean {
  if (record.status === 'DROPPED_AND_RESOLVED') return false;
  const refDate = new Date(referenceDate.split('T')[0]);
  const targetDate = new Date(record.targetResolutionDate);
  return targetDate < refDate;
}

/**
 * Create a new Audit Observation Record
 */
export function createAuditObservationRecord(params: {
  financialYear: string;
  auditingBody: AuditObservationRecord['auditingBody'];
  department: string;
  category: AuditParaCategory;
  severity: AuditSeverity;
  observationTitle: string;
  observationNarrative: string;
  financialImplicationInr: number;
  targetResolutionDate: string;
  halfMarginIssueDate?: string;
  initialRecoveryInr?: number;
  year?: number;
}): AuditObservationRecord {
  const auditRecordId = formatAuditRecordId(params.category, params.year);
  const now = new Date().toISOString();
  const initialRecovery = params.initialRecoveryInr || 0;
  const pendingRecoveryInr = Math.max(0, params.financialImplicationInr - initialRecovery);

  const baseRecord: Omit<AuditObservationRecord, 'auditSha256'> = {
    auditRecordId,
    financialYear: params.financialYear,
    auditingBody: params.auditingBody,
    department: params.department,
    category: params.category,
    severity: params.severity,
    observationTitle: params.observationTitle,
    observationNarrative: params.observationNarrative,
    financialImplicationInr: params.financialImplicationInr,
    remedialRecoveryAmountInr: initialRecovery,
    pendingRecoveryInr,
    targetResolutionDate: params.targetResolutionDate,
    halfMarginIssueDate: params.halfMarginIssueDate || now.split('T')[0],
    status: 'HALF_MARGIN_QUERY_ISSUED',
    createdTimestamp: now
  };

  const auditSha256 = generateAuditSeal(baseRecord);
  return { ...baseRecord, auditSha256 };
}

/**
 * Submit departmental Action Taken Note (ATN) reply to audit observation
 */
export function submitDepartmentAtnReply(
  record: AuditObservationRecord,
  params: {
    actionTakenNoteNarrative: string;
    replyDate?: string;
  }
): AuditObservationRecord {
  const replyDate = params.replyDate || new Date().toISOString().split('T')[0];

  const updated: AuditObservationRecord = {
    ...record,
    actionTakenNoteNarrative: params.actionTakenNoteNarrative,
    departmentReplyDate: replyDate,
    status: 'DEPARTMENT_REPLY_SUBMITTED'
  };

  return {
    ...updated,
    auditSha256: generateAuditSeal(updated)
  };
}

/**
 * Record financial recovery or adjustment against audit objection
 */
export function recordFinancialRecovery(
  record: AuditObservationRecord,
  params: {
    recoveryAmountInr: number;
    recoveryVoucherNumber: string;
  }
): AuditObservationRecord {
  const newRecoveryTotal = record.remedialRecoveryAmountInr + params.recoveryAmountInr;
  const newPending = Math.max(0, record.financialImplicationInr - newRecoveryTotal);

  const updated: AuditObservationRecord = {
    ...record,
    remedialRecoveryAmountInr: newRecoveryTotal,
    pendingRecoveryInr: newPending,
    recoveryVoucherNumber: params.recoveryVoucherNumber
  };

  return {
    ...updated,
    auditSha256: generateAuditSeal(updated)
  };
}

/**
 * Drop and resolve audit observation
 * Requires 100% financial recovery / regularized justification
 */
export function dropAuditObservation(
  record: AuditObservationRecord,
  options?: { allowWaiverWithoutFullRecovery?: boolean }
): { success: boolean; record: AuditObservationRecord; error?: string } {
  if (record.pendingRecoveryInr > 0 && !options?.allowWaiverWithoutFullRecovery) {
    return {
      success: false,
      record,
      error: `Cannot drop audit observation: Financial recovery incomplete. Outstanding pending: ₹${record.pendingRecoveryInr}`
    };
  }

  const updated: AuditObservationRecord = {
    ...record,
    status: 'DROPPED_AND_RESOLVED'
  };

  return {
    success: true,
    record: { ...updated, auditSha256: generateAuditSeal(updated) }
  };
}

/**
 * Export official CSV of Central University Internal Audit & CAG Observations
 */
export function exportInternalAuditCagLedgerCSV(records: AuditObservationRecord[]): string {
  const headers = [
    'Audit Record ID',
    'Financial Year',
    'Auditing Body',
    'Department',
    'Category',
    'Severity',
    'Observation Title',
    'Financial Implication INR',
    'Recovered INR',
    'Pending Recovery INR',
    'Status',
    'Target Date',
    'Overdue Flag',
    'Audit SHA-256'
  ];

  const rows = records.map(r => {
    const overdue = isAuditOverdue(r);
    return [
      r.auditRecordId,
      r.financialYear,
      r.auditingBody,
      r.department,
      r.category,
      r.severity,
      `"${r.observationTitle.replace(/"/g, '""')}"`,
      r.financialImplicationInr.toFixed(2),
      r.remedialRecoveryAmountInr.toFixed(2),
      r.pendingRecoveryInr.toFixed(2),
      r.status,
      r.targetResolutionDate,
      overdue ? 'OVERDUE' : 'ON_SCHEDULE',
      r.auditSha256
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Sample initial dataset for Central Audit & CAG Compliance
 */
export const SAMPLE_AUDIT_OBSERVATIONS: AuditObservationRecord[] = [
  createAuditObservationRecord({
    financialYear: '2025-2026',
    auditingBody: 'CAG_PRINCIPAL_DIRECTOR_AUDIT',
    department: 'Central Works & Engineering Division',
    category: 'WORKS_CONTRACT_DELAY_PENALTY_NON_RECOVERY',
    severity: 'CRITICAL_CAG_PARA',
    observationTitle: 'Non-levy of Liquidated Damages (LD) on Delay in Academic Complex Phase II Construction',
    observationNarrative: 'Contractor delayed completion by 14 weeks without approved extension of time (EOT). Liquidated damages @ 0.5% per week subject to 10% maximum was not withheld from running bills contrary to GFR 2017 norms.',
    financialImplicationInr: 1850000, // ₹18.5 Lakhs
    initialRecoveryInr: 1850000,
    targetResolutionDate: '2026-06-30'
  }),
  createAuditObservationRecord({
    financialYear: '2025-2026',
    auditingBody: 'INTERNAL_AUDIT_OFFICE',
    department: 'Central Procurement Office',
    category: 'PROCUREMENT_TENDER_IRREGULARITY',
    severity: 'MAJOR_INTERNAL_OBSERVATION',
    observationTitle: 'Procurement of High-End Workstations outside Government e-Marketplace (GeM)',
    observationNarrative: 'Procurement of 25 workstations costing ₹32.5 Lakhs executed through offline single-tender quotation instead of GeM primary procurement mandate under GFR 149.',
    financialImplicationInr: 750000, // ₹7.5 Lakhs potential excess over GeM L1 rate
    initialRecoveryInr: 0,
    targetResolutionDate: '2026-04-30'
  }),
  createAuditObservationRecord({
    financialYear: '2024-2025',
    auditingBody: 'CAG_PRINCIPAL_DIRECTOR_AUDIT',
    department: 'Sponsored Research & Industrial Consultancy (SRIC)',
    category: 'RESEARCH_GRANT_UNSPENT_BALANCE_RETENTION',
    severity: 'CRITICAL_CAG_PARA',
    observationTitle: 'Non-remittance of Accrued Interest on Unspent Central Grants into Consolidated Fund of India',
    observationNarrative: 'Accrued bank interest of ₹4.8 Lakhs earned on unspent DST research grants retained in project saving accounts instead of mandatory return to Bharatkosh / CFI.',
    financialImplicationInr: 480000, // ₹4.8 Lakhs
    initialRecoveryInr: 200000,
    targetResolutionDate: '2026-05-15'
  })
];
