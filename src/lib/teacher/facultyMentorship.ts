/**
 * Faculty Student Proctorial Mentorship & Holistic Student Wellness Engine
 * Statutory Compliance: UGC Guidelines on Student Mentoring (Deeksharambh),
 * AICTE Proctorial System Mandates (1:20 Ratio) & NEP 2020 Holistic Student Wellness.
 *
 * Platform: PinIT Career OS - Teacher Portal & Faculty Governance
 * Zero-Collision Invariant: Pure Branch C administrative and faculty governance.
 */

import { createHash } from 'crypto';

export type MenteeRiskLevel =
  | 'LOW_NORMAL'
  | 'ACADEMIC_WARNING'
  | 'CRITICAL_CONCERN';

export type InteractionCategory =
  | 'ROUTINE_ACADEMIC_AUDIT'
  | 'ATTENDANCE_INTERVENTION'
  | 'CAREER_PLACEMENT_GUIDANCE'
  | 'PSYCHOSOCIAL_WELLNESS'
  | 'PARENT_TEACHER_CONSULTATION'
  | 'EMERGENCY_DISPENSARY_REFERRAL';

export interface MentorshipInteraction {
  interactionId: string;
  interactionToken: string; // MNT-[YEAR]-[DEPT]-[HEX6]
  studentId: string;
  enrollmentNumber: string; // e.g. 2024CSB019
  studentName: string;
  semester: number; // 1 to 8
  department: string;
  facultyMentorName: string;
  facultyMentorEmpId: string;
  category: InteractionCategory;
  date: string; // YYYY-MM-DD
  currentCgpa: number;
  attendancePercentage: number;
  riskLevel: MenteeRiskLevel;
  actionPlanDiscussion: string;
  parentContacted: boolean;
  referralToCounselor: boolean;
  followUpDate?: string;
  isResolved: boolean;
  resolutionNotes?: string;
  cryptographicSeal?: string; // SHA-256 seal
}

/**
 * Assess student academic & wellness risk under UGC Proctorial Norms
 */
export function assessMenteeRisk(
  cgpa: number,
  attendancePercentage: number,
  isDistressed: boolean = false
): MenteeRiskLevel {
  if (isDistressed || cgpa < 5.0 || attendancePercentage < 65) {
    return 'CRITICAL_CONCERN';
  }
  if (cgpa < 6.0 || attendancePercentage < 75) {
    return 'ACADEMIC_WARNING';
  }
  return 'LOW_NORMAL';
}

/**
 * Generate unique mentorship session tracking token: MNT-[YEAR]-[DEPT]-[HEX6]
 */
export function generateMentorshipToken(dept: string, year: number = new Date().getFullYear()): string {
  const cleanDept = dept.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'DEPT';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `MNT-${year}-${cleanDept}-${randomHex}`;
}

/**
 * Generate tamper-proof SHA-256 seal for mentorship interaction log
 */
export function generateMentorshipSeal(
  record: Omit<MentorshipInteraction, 'cryptographicSeal'>
): string {
  const canonicalPayload = [
    record.interactionId,
    record.interactionToken,
    record.enrollmentNumber,
    record.facultyMentorEmpId,
    record.category,
    record.date,
    record.currentCgpa.toFixed(2),
    record.attendancePercentage.toFixed(1),
    record.riskLevel,
    record.parentContacted ? 'PARENT_ALERTED' : 'NO_PARENT',
    record.referralToCounselor ? 'COUNSELOR_REFERRED' : 'NO_COUNSELOR',
    record.isResolved ? 'RESOLVED' : 'ACTIVE_WATCH',
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Log a new student proctorial mentorship interaction
 */
export function logMentorshipInteraction(params: {
  studentId: string;
  enrollmentNumber: string;
  studentName: string;
  semester: number;
  department: string;
  facultyMentorName: string;
  facultyMentorEmpId: string;
  category: InteractionCategory;
  date?: string;
  currentCgpa: number;
  attendancePercentage: number;
  isDistressed?: boolean;
  actionPlanDiscussion: string;
  parentContacted?: boolean;
  referralToCounselor?: boolean;
  followUpDate?: string;
}): MentorshipInteraction {
  if (params.currentCgpa < 0 || params.currentCgpa > 10) {
    throw new Error('CGPA must be bounded within 0.00 and 10.00.');
  }

  if (params.attendancePercentage < 0 || params.attendancePercentage > 100) {
    throw new Error('Attendance percentage must be bounded within 0% and 100%.');
  }

  const riskLevel = assessMenteeRisk(
    params.currentCgpa,
    params.attendancePercentage,
    params.isDistressed || params.referralToCounselor
  );

  const interactionToken = generateMentorshipToken(params.department);
  const date = params.date || new Date().toISOString().slice(0, 10);

  const baseRecord: Omit<MentorshipInteraction, 'cryptographicSeal'> = {
    interactionId: `MNT-${Date.now().toString(36).toUpperCase()}`,
    interactionToken,
    studentId: params.studentId,
    enrollmentNumber: params.enrollmentNumber.toUpperCase(),
    studentName: params.studentName,
    semester: params.semester,
    department: params.department,
    facultyMentorName: params.facultyMentorName,
    facultyMentorEmpId: params.facultyMentorEmpId,
    category: params.category,
    date,
    currentCgpa: params.currentCgpa,
    attendancePercentage: params.attendancePercentage,
    riskLevel,
    actionPlanDiscussion: params.actionPlanDiscussion,
    parentContacted: Boolean(params.parentContacted),
    referralToCounselor: Boolean(params.referralToCounselor),
    followUpDate: params.followUpDate,
    isResolved: false,
  };

  const cryptographicSeal = generateMentorshipSeal(baseRecord);
  return { ...baseRecord, cryptographicSeal };
}

/**
 * Escalate student to Campus Psychological Counselor / Dispensary
 */
export function escalateToCampusCounselor(
  record: MentorshipInteraction,
  reason: string
): MentorshipInteraction {
  const updated: Omit<MentorshipInteraction, 'cryptographicSeal'> = {
    ...record,
    referralToCounselor: true,
    riskLevel: 'CRITICAL_CONCERN',
    actionPlanDiscussion: `${record.actionPlanDiscussion} [ESCALATION]: Referred to Chief Counselor. Reason: ${reason}`,
  };

  const cryptographicSeal = generateMentorshipSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Close and resolve proctorial follow-up action plan
 */
export function resolveMentorshipFollowup(
  record: MentorshipInteraction,
  resolutionNotes: string
): MentorshipInteraction {
  const updated: Omit<MentorshipInteraction, 'cryptographicSeal'> = {
    ...record,
    isResolved: true,
    resolutionNotes,
    riskLevel: 'LOW_NORMAL',
  };

  const cryptographicSeal = generateMentorshipSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Export Faculty Mentorship Ledger as statutory UGC CSV
 */
export function exportFacultyMentorshipCSV(records: MentorshipInteraction[]): string {
  const headers = [
    'Interaction ID',
    'Tracking Token',
    'Enrollment Number',
    'Student Name',
    'Semester',
    'Department',
    'Faculty Mentor',
    'Category',
    'Date',
    'CGPA',
    'Attendance %',
    'Risk Level',
    'Parent Contacted',
    'Counselor Referred',
    'Resolved',
    'Cryptographic Seal',
  ];

  const rows = records.map((r) => [
    `"${r.interactionId}"`,
    `"${r.interactionToken}"`,
    `"${r.enrollmentNumber}"`,
    `"${r.studentName.replace(/"/g, '""')}"`,
    r.semester,
    `"${r.department.replace(/"/g, '""')}"`,
    `"${r.facultyMentorName.replace(/"/g, '""')}"`,
    `"${r.category}"`,
    `"${r.date}"`,
    r.currentCgpa.toFixed(2),
    r.attendancePercentage.toFixed(1),
    `"${r.riskLevel}"`,
    r.parentContacted ? 'YES' : 'NO',
    r.referralToCounselor ? 'YES' : 'NO',
    r.isResolved ? 'YES' : 'NO',
    `"${r.cryptographicSeal || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Demonstration Proctorial Records
 */
export const INITIAL_MENTORSHIP_RECORDS: MentorshipInteraction[] = [
  {
    interactionId: 'MNT-2026-001',
    interactionToken: 'MNT-2026-CSED-4A91B0',
    studentId: 'STU-2024-CSE-019',
    enrollmentNumber: '2024CSB019',
    studentName: 'Vikram Aditya Roy',
    semester: 4,
    department: 'Computer Science & Engineering',
    facultyMentorName: 'Prof. Arvind Swaminathan',
    facultyMentorEmpId: 'EMP-CSE-007',
    category: 'ATTENDANCE_INTERVENTION',
    date: '2026-03-12',
    currentCgpa: 5.42,
    attendancePercentage: 62.5,
    riskLevel: 'CRITICAL_CONCERN',
    actionPlanDiscussion: 'Attendance dropped below statutory 75% limit due to medical typhoid spell. Action plan agreed to attend remedial lab batches and submit assignments.',
    parentContacted: true,
    referralToCounselor: false,
    followUpDate: '2026-04-10',
    isResolved: false,
    cryptographicSeal: '57b29a1038472910482918471928374829104829184719283748291048291842',
  },
  {
    interactionId: 'MNT-2026-002',
    interactionToken: 'MNT-2026-CSED-8B29C1',
    studentId: 'STU-2023-CSE-088',
    enrollmentNumber: '2023CSB088',
    studentName: 'Ananya Deshmukh',
    semester: 6,
    department: 'Computer Science & Engineering',
    facultyMentorName: 'Dr. Siddharth Sen',
    facultyMentorEmpId: 'EMP-CSE-042',
    category: 'CAREER_PLACEMENT_GUIDANCE',
    date: '2026-03-24',
    currentCgpa: 8.85,
    attendancePercentage: 94.0,
    riskLevel: 'LOW_NORMAL',
    actionPlanDiscussion: 'Advised on applying for Google Summer of Code (GSoC) and summer research internships at IISc Bangalore in distributed storage systems.',
    parentContacted: false,
    referralToCounselor: false,
    isResolved: true,
    resolutionNotes: 'Submitted GSoC proposal and successfully secured industry R&D internship.',
    cryptographicSeal: '8910482918471928374829104829184719283748291048291847192837482910',
  },
  {
    interactionId: 'MNT-2026-003',
    interactionToken: 'MNT-2026-EEED-19C482',
    studentId: 'STU-2025-EEE-004',
    enrollmentNumber: '2025EEB004',
    studentName: 'Kavya S. Iyer',
    semester: 2,
    department: 'Electrical & Electronics Engineering',
    facultyMentorName: 'Dr. Neha Kulkarni',
    facultyMentorEmpId: 'EMP-EEE-018',
    category: 'PSYCHOSOCIAL_WELLNESS',
    date: '2026-04-02',
    currentCgpa: 6.80,
    attendancePercentage: 78.5,
    riskLevel: 'CRITICAL_CONCERN',
    actionPlanDiscussion: 'First-year hostel adjustment anxiety and severe exam stress reported. Escalated to university wellness counselor for therapeutic sessions.',
    parentContacted: false,
    referralToCounselor: true,
    followUpDate: '2026-04-16',
    isResolved: false,
    cryptographicSeal: '1048291847192837482910482918471928374829104829184719283748291048',
  },
];
