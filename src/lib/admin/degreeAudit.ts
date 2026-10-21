/**
 * Academic Dean Transcript Verification & Degree Audit Engine (TASK-893)
 * 
 * Implements:
 * 1. Statutory University Degree Clearance & Credit Invariant Verification.
 * 2. Multi-tier graduation eligibility rules (Credit totals, CGPA threshold, Active backlogs, Financial holds).
 * 3. Honors degree classification (FIRST_CLASS_WITH_DISTINCTION, FIRST_CLASS, SECOND_CLASS).
 * 4. Cryptographic SHA-256 Dean Degree Clearance Digest for verifiable credentials.
 * 5. Multi-tenant isolation and convocation roster CSV export.
 */

import { createHash } from 'crypto';

export type GraduationStatus = 
  | 'CLEARED_FOR_GRADUATION'
  | 'DEFICIT_CREDITS'
  | 'ACTIVE_BACKLOGS'
  | 'FINANCIAL_HOLD'
  | 'DISCIPLINARY_HOLD';

export type HonorsClassification = 
  | 'FIRST_CLASS_WITH_DISTINCTION'
  | 'FIRST_CLASS'
  | 'SECOND_CLASS'
  | 'NOT_QUALIFIED';

export interface DegreeRequirementRules {
  totalCreditsRequired: number; // e.g. 160
  minCoreCredits: number; // e.g. 100
  minElectiveCredits: number; // e.g. 40
  minCapstoneCredits: number; // e.g. 20
  minCGPAForGraduation: number; // e.g. 5.0
  distinctionThresholdCGPA: number; // e.g. 8.5
  firstClassThresholdCGPA: number; // e.g. 6.75
}

export interface StudentTranscript {
  studentId: string;
  institutionId: string;
  studentName: string;
  degreeName: string; // e.g. "Bachelor of Technology in Computer Science"
  department: string;
  admissionYear: number;
  expectedGraduationYear: number;
  coreCreditsEarned: number;
  electiveCreditsEarned: number;
  capstoneCreditsEarned: number;
  cgpa: number; // 0.0 to 10.0 scale
  activeBacklogsCount: number;
  pendingFeeDues: number;
  disciplinaryHold: boolean;
}

export interface DegreeAuditResult {
  auditId: string;
  institutionId: string;
  studentId: string;
  studentName: string;
  degreeName: string;
  department: string;
  totalCreditsEarned: number;
  totalCreditsRequired: number;
  coreCreditsEarned: number;
  electiveCreditsEarned: number;
  capstoneCreditsEarned: number;
  cgpa: number;
  status: GraduationStatus;
  honors: HonorsClassification;
  unmetRequirements: string[];
  deanCleared: boolean;
  deanClearanceTimestamp?: string;
  deanApprovedBy?: string;
  cryptographicAuditHash: string; // SHA-256
}

export const DEFAULT_BTECH_RULES: DegreeRequirementRules = {
  totalCreditsRequired: 160,
  minCoreCredits: 100,
  minElectiveCredits: 40,
  minCapstoneCredits: 20,
  minCGPAForGraduation: 5.0,
  distinctionThresholdCGPA: 8.5,
  firstClassThresholdCGPA: 6.75,
};

/**
 * Evaluates student transcript against institutional degree requirements
 */
export function auditStudentDegree(
  transcript: StudentTranscript,
  rules: DegreeRequirementRules = DEFAULT_BTECH_RULES
): DegreeAuditResult {
  if (transcript.cgpa < 0 || transcript.cgpa > 10) {
    throw new Error('CGPA_OUT_OF_BOUNDS');
  }

  const totalCreditsEarned = 
    transcript.coreCreditsEarned + 
    transcript.electiveCreditsEarned + 
    transcript.capstoneCreditsEarned;

  const unmetRequirements: string[] = [];

  // Check credits
  if (totalCreditsEarned < rules.totalCreditsRequired) {
    unmetRequirements.push(`Credit Deficit: Earned ${totalCreditsEarned}/${rules.totalCreditsRequired} required credits`);
  }
  if (transcript.coreCreditsEarned < rules.minCoreCredits) {
    unmetRequirements.push(`Core Deficit: Earned ${transcript.coreCreditsEarned}/${rules.minCoreCredits} core credits`);
  }
  if (transcript.electiveCreditsEarned < rules.minElectiveCredits) {
    unmetRequirements.push(`Elective Deficit: Earned ${transcript.electiveCreditsEarned}/${rules.minElectiveCredits} elective credits`);
  }
  if (transcript.capstoneCreditsEarned < rules.minCapstoneCredits) {
    unmetRequirements.push(`Capstone Deficit: Earned ${transcript.capstoneCreditsEarned}/${rules.minCapstoneCredits} capstone/internship credits`);
  }

  // Check academics
  if (transcript.activeBacklogsCount > 0) {
    unmetRequirements.push(`Active Backlogs: ${transcript.activeBacklogsCount} subject(s) pending clearance`);
  }
  if (transcript.cgpa < rules.minCGPAForGraduation) {
    unmetRequirements.push(`CGPA Below Minimum: ${transcript.cgpa} < ${rules.minCGPAForGraduation} passing threshold`);
  }

  // Check holds
  if (transcript.pendingFeeDues > 0) {
    unmetRequirements.push(`Bursar Financial Hold: Pending fee dues of $${transcript.pendingFeeDues.toLocaleString()}`);
  }
  if (transcript.disciplinaryHold) {
    unmetRequirements.push('Proctorial Disciplinary Hold in place');
  }

  // Determine status
  let status: GraduationStatus = 'CLEARED_FOR_GRADUATION';
  if (transcript.disciplinaryHold) {
    status = 'DISCIPLINARY_HOLD';
  } else if (transcript.pendingFeeDues > 0) {
    status = 'FINANCIAL_HOLD';
  } else if (transcript.activeBacklogsCount > 0) {
    status = 'ACTIVE_BACKLOGS';
  } else if (totalCreditsEarned < rules.totalCreditsRequired) {
    status = 'DEFICIT_CREDITS';
  }

  // Honors classification
  let honors: HonorsClassification = 'NOT_QUALIFIED';
  if (status === 'CLEARED_FOR_GRADUATION') {
    if (transcript.cgpa >= rules.distinctionThresholdCGPA) {
      honors = 'FIRST_CLASS_WITH_DISTINCTION';
    } else if (transcript.cgpa >= rules.firstClassThresholdCGPA) {
      honors = 'FIRST_CLASS';
    } else {
      honors = 'SECOND_CLASS';
    }
  }

  const auditId = `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const auditTimestamp = new Date().toISOString();

  // Generate tamper-proof SHA-256 clearance digest
  const cryptographicAuditHash = createHash('sha256')
    .update(`${transcript.institutionId}:${transcript.studentId}:${totalCreditsEarned}:${transcript.cgpa}:${status}:${auditTimestamp}`)
    .digest('hex');

  return {
    auditId,
    institutionId: transcript.institutionId,
    studentId: transcript.studentId,
    studentName: transcript.studentName,
    degreeName: transcript.degreeName,
    department: transcript.department,
    totalCreditsEarned,
    totalCreditsRequired: rules.totalCreditsRequired,
    coreCreditsEarned: transcript.coreCreditsEarned,
    electiveCreditsEarned: transcript.electiveCreditsEarned,
    capstoneCreditsEarned: transcript.capstoneCreditsEarned,
    cgpa: transcript.cgpa,
    status,
    honors,
    unmetRequirements,
    deanCleared: status === 'CLEARED_FOR_GRADUATION',
    deanClearanceTimestamp: status === 'CLEARED_FOR_GRADUATION' ? auditTimestamp : undefined,
    deanApprovedBy: status === 'CLEARED_FOR_GRADUATION' ? 'Office of Dean Academics' : undefined,
    cryptographicAuditHash,
  };
}

export class DegreeAuditStore {
  private audits: Map<string, DegreeAuditResult> = new Map();

  /**
   * Run and store student audit
   */
  public recordAudit(transcript: StudentTranscript, rules?: DegreeRequirementRules): DegreeAuditResult {
    const result = auditStudentDegree(transcript, rules);
    this.audits.set(result.studentId, result);
    return result;
  }

  /**
   * Dean sign-off override once hold is resolved
   */
  public overrideDeanClearance(params: {
    studentId: string;
    institutionId: string;
    deanName: string;
  }): DegreeAuditResult {
    const existing = this.audits.get(params.studentId);
    if (!existing || existing.institutionId !== params.institutionId) {
      throw new Error('AUDIT_NOT_FOUND_OR_TENANT_MISMATCH');
    }

    const now = new Date().toISOString();
    existing.deanCleared = true;
    existing.status = 'CLEARED_FOR_GRADUATION';
    existing.deanApprovedBy = params.deanName;
    existing.deanClearanceTimestamp = now;

    // Recalculate hash
    existing.cryptographicAuditHash = createHash('sha256')
      .update(`${existing.institutionId}:${existing.studentId}:${existing.totalCreditsEarned}:${existing.cgpa}:CLEARED:${now}`)
      .digest('hex');

    this.audits.set(params.studentId, existing);
    return existing;
  }

  /**
   * Query audits strictly by institution
   */
  public getAuditsByInstitution(
    institutionId: string,
    filter?: { status?: GraduationStatus; department?: string }
  ): DegreeAuditResult[] {
    const results: DegreeAuditResult[] = [];
    for (const a of this.audits.values()) {
      if (a.institutionId !== institutionId) continue;
      if (filter?.status && a.status !== filter.status) continue;
      if (filter?.department && a.department.toLowerCase() !== filter.department.toLowerCase()) continue;
      results.push({ ...a });
    }
    return results.sort((a, b) => b.cgpa - a.cgpa);
  }

  /**
   * Clear in-memory audits
   */
  public clear(): void {
    this.audits.clear();
  }
}

export const degreeAuditStore = new DegreeAuditStore();

/**
 * Standard Convocation Graduation Clearance CSV Export
 */
export function exportConvocationRosterCSV(audits: DegreeAuditResult[]): string {
  const headers = [
    'Student_ID',
    'Student_Name',
    'Institution_ID',
    'Degree',
    'Department',
    'Total_Credits',
    'CGPA',
    'Graduation_Status',
    'Honors_Classification',
    'Dean_Cleared',
    'Audit_Hash_SHA256',
  ];

  const rows = audits.map(a => [
    `"${a.studentId}"`,
    `"${a.studentName}"`,
    `"${a.institutionId}"`,
    `"${a.degreeName}"`,
    `"${a.department}"`,
    a.totalCreditsEarned,
    a.cgpa,
    `"${a.status}"`,
    `"${a.honors}"`,
    a.deanCleared ? 'YES' : 'NO',
    `"${a.cryptographicAuditHash}"`,
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}
