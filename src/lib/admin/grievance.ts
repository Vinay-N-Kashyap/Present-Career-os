/**
 * Institutional Student Grievance Redressal & Ombudsman Engine (TASK-883)
 * 
 * Implements:
 * 1. AICTE & UGC Student Grievance Redressal compliance norms.
 * 2. 5-stage lifecycle: SUBMITTED -> UNDER_COMMITTEE_REVIEW -> HEARING_SCHEDULED -> ACTION_TAKEN -> CLOSED.
 * 3. Anonymous reporting mode with zero-knowledge tracking tokens (PII protection).
 * 4. 15-Day statutory SLA watchdog and escalation tracking.
 * 5. Strict multi-tenant isolation and Ombudsman compliance audit export.
 */

import { createHmac, randomBytes } from 'crypto';

export type GrievanceCategory = 
  | 'ACADEMIC'
  | 'HARASSMENT_OR_DISCRIMINATION'
  | 'FEE_OR_FINANCIAL'
  | 'INFRASTRUCTURE_OR_HOSTEL'
  | 'DISCIPLINARY_OR_PROCTORIAL'
  | 'GENERAL';

export type GrievanceSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type GrievanceStatus = 
  | 'SUBMITTED'
  | 'UNDER_COMMITTEE_REVIEW'
  | 'HEARING_SCHEDULED'
  | 'ACTION_TAKEN'
  | 'CLOSED';

export interface GrievanceFilingInput {
  institutionId: string;
  category: GrievanceCategory;
  severity: GrievanceSeverity;
  subject: string;
  description: string;
  isAnonymous: boolean;
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  department?: string;
}

export interface CommitteeHearing {
  hearingDate: string; // ISO string
  locationOrMeetingLink: string;
  committeeChair: string;
  committeeMembers: string[];
  notes?: string;
}

export interface GrievanceRecord {
  grievanceId: string;
  institutionId: string;
  trackingToken: string; // Token given to student to track status privately
  category: GrievanceCategory;
  severity: GrievanceSeverity;
  subject: string;
  description: string;
  isAnonymous: boolean;
  department: string;
  // Redacted if isAnonymous is true
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  status: GrievanceStatus;
  submittedAt: string; // ISO date
  updatedAt: string;
  slaDeadlineDays: number; // Regulatory SLA (default 15 days)
  slaDaysRemaining: number;
  isOverdue: boolean;
  hearingDetails?: CommitteeHearing;
  actionTakenReport?: {
    resolvedAt: string;
    resolutionSummary: string;
    actionAuthor: string;
  };
}

const REGULATORY_SLA_DAYS = 15;
const SYSTEM_SECRET = process.env.GRIEVANCE_HMAC_SECRET || 'pinit-grievance-ombudsman-2026';

/**
 * Generates an unforgeable tracking token for the filer
 */
export function generateTrackingToken(institutionId: string, grievanceId: string): string {
  const nonce = randomBytes(4).toString('hex');
  const signature = createHmac('sha256', SYSTEM_SECRET)
    .update(`${institutionId}:${grievanceId}:${nonce}`)
    .digest('hex')
    .slice(0, 12)
    .toUpperCase();
  return `GRV-${signature}`;
}

/**
 * Calculates remaining SLA days and overdue status based on filing date
 */
export function evaluateSlaCompliance(submittedAtISO: string, currentStatus: GrievanceStatus): {
  daysElapsed: number;
  daysRemaining: number;
  isOverdue: boolean;
} {
  const filedTime = new Date(submittedAtISO).getTime();
  const now = Date.now();
  const daysElapsed = Math.floor((now - filedTime) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, REGULATORY_SLA_DAYS - daysElapsed);
  const isFinalState = currentStatus === 'ACTION_TAKEN' || currentStatus === 'CLOSED';
  const isOverdue = !isFinalState && daysElapsed > REGULATORY_SLA_DAYS;

  return {
    daysElapsed,
    daysRemaining,
    isOverdue,
  };
}

export class GrievanceStore {
  private records: Map<string, GrievanceRecord> = new Map();

  /**
   * File a new student grievance with optional privacy redaction
   */
  public submit(input: GrievanceFilingInput): GrievanceRecord {
    if (!input.institutionId || !input.subject || !input.description) {
      throw new Error('INVALID_GRIEVANCE_PAYLOAD');
    }

    const grievanceId = `grv-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const trackingToken = generateTrackingToken(input.institutionId, grievanceId);
    const now = new Date().toISOString();

    const sla = evaluateSlaCompliance(now, 'SUBMITTED');

    const record: GrievanceRecord = {
      grievanceId,
      institutionId: input.institutionId,
      trackingToken,
      category: input.category,
      severity: input.severity,
      subject: input.subject.trim(),
      description: input.description.trim(),
      isAnonymous: input.isAnonymous,
      department: input.department || 'General',
      // If anonymous, strictly redact student personal identifiers
      studentId: input.isAnonymous ? undefined : input.studentId,
      studentName: input.isAnonymous ? 'Confidential / Anonymous' : input.studentName,
      studentEmail: input.isAnonymous ? undefined : input.studentEmail,
      status: 'SUBMITTED',
      submittedAt: now,
      updatedAt: now,
      slaDeadlineDays: REGULATORY_SLA_DAYS,
      slaDaysRemaining: sla.daysRemaining,
      isOverdue: sla.isOverdue,
    };

    this.records.set(grievanceId, record);
    return record;
  }

  /**
   * Schedule a formal committee hearing
   */
  public scheduleHearing(params: {
    grievanceId: string;
    institutionId: string;
    hearing: CommitteeHearing;
  }): GrievanceRecord {
    const record = this.records.get(params.grievanceId);
    if (!record || record.institutionId !== params.institutionId) {
      throw new Error('GRIEVANCE_NOT_FOUND_OR_TENANT_MISMATCH');
    }

    record.hearingDetails = params.hearing;
    record.status = 'HEARING_SCHEDULED';
    record.updatedAt = new Date().toISOString();

    this.records.set(params.grievanceId, record);
    return record;
  }

  /**
   * Transition grievance status with Action Taken Report (ATR)
   */
  public resolveGrievance(params: {
    grievanceId: string;
    institutionId: string;
    actionAuthor: string;
    resolutionSummary: string;
    targetStatus?: 'ACTION_TAKEN' | 'CLOSED';
  }): GrievanceRecord {
    const record = this.records.get(params.grievanceId);
    if (!record || record.institutionId !== params.institutionId) {
      throw new Error('GRIEVANCE_NOT_FOUND_OR_TENANT_MISMATCH');
    }

    const now = new Date().toISOString();
    record.status = params.targetStatus || 'ACTION_TAKEN';
    record.updatedAt = now;
    record.actionTakenReport = {
      resolvedAt: now,
      resolutionSummary: params.resolutionSummary,
      actionAuthor: params.actionAuthor,
    };

    // Recompute SLA (final state stops overdue flag)
    const sla = evaluateSlaCompliance(record.submittedAt, record.status);
    record.slaDaysRemaining = sla.daysRemaining;
    record.isOverdue = sla.isOverdue;

    this.records.set(params.grievanceId, record);
    return record;
  }

  /**
   * Retrieve records strictly isolated by institutionId
   */
  public getByInstitution(
    institutionId: string,
    filter?: { status?: GrievanceStatus; category?: GrievanceCategory; isOverdue?: boolean }
  ): GrievanceRecord[] {
    const results: GrievanceRecord[] = [];

    for (const record of this.records.values()) {
      if (record.institutionId !== institutionId) continue;

      // Update SLA status dynamically
      const sla = evaluateSlaCompliance(record.submittedAt, record.status);
      record.slaDaysRemaining = sla.daysRemaining;
      record.isOverdue = sla.isOverdue;

      if (filter?.status && record.status !== filter.status) continue;
      if (filter?.category && record.category !== filter.category) continue;
      if (filter?.isOverdue !== undefined && record.isOverdue !== filter.isOverdue) continue;

      results.push({ ...record });
    }

    return results.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  /**
   * Anonymous tracking lookup via tracking token
   */
  public trackByToken(trackingToken: string): GrievanceRecord | null {
    for (const record of this.records.values()) {
      if (record.trackingToken === trackingToken) {
        const sla = evaluateSlaCompliance(record.submittedAt, record.status);
        return {
          ...record,
          slaDaysRemaining: sla.daysRemaining,
          isOverdue: sla.isOverdue,
        };
      }
    }
    return null;
  }

  /**
   * Clear in-memory store (primarily for unit test isolation)
   */
  public clear(): void {
    this.records.clear();
  }
}

export const grievanceStore = new GrievanceStore();

/**
 * Generate Ombudsman Compliance Audit CSV
 */
export function exportGrievanceAuditCSV(records: GrievanceRecord[]): string {
  const headers = [
    'Grievance_ID',
    'Tracking_Token',
    'Institution_ID',
    'Category',
    'Severity',
    'Status',
    'Anonymous',
    'Department',
    'Filing_Date',
    'SLA_Days_Remaining',
    'Is_Overdue',
    'Hearing_Scheduled',
    'Resolution_Summary',
  ];

  const rows = records.map(r => [
    `"${r.grievanceId}"`,
    `"${r.trackingToken}"`,
    `"${r.institutionId}"`,
    `"${r.category}"`,
    `"${r.severity}"`,
    `"${r.status}"`,
    r.isAnonymous ? 'YES' : 'NO',
    `"${r.department}"`,
    `"${r.submittedAt.split('T')[0]}"`,
    r.slaDaysRemaining,
    r.isOverdue ? 'YES' : 'NO',
    r.hearingDetails ? 'YES' : 'NO',
    `"${r.actionTakenReport?.resolutionSummary?.replace(/"/g, '""') || 'PENDING'}"`,
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}
