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

// ============================================================================
// TASK-933: Faculty Mentorship, Proctor & Student Counseling Telemetry Engine
// (Preserves strict compatibility with tests/student_health_and_mentorship.test.ts)
// ============================================================================

export type MenteeProgressStatus = 'THRIVING' | 'STABLE' | 'NEEDS_SUPPORT' | 'CRITICAL_RISK';

export type MentorshipCategory =
  | 'ACADEMIC_PROGRESS'
  | 'ATTENDANCE_INTERVENTION'
  | 'CAREER_GUIDANCE'
  | 'MENTAL_HEALTH_WELLBEING'
  | 'DISCIPLINARY_CONDUCT'
  | 'RESEARCH_PROJECTS';

export type InterventionUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_COUNSELOR_ESCALATION';

export interface MenteeProfile {
  studentId: string;
  studentName: string;
  rollNumber: string;
  institutionId: string;
  department: string;
  cgpa: number;
  attendancePercent: number;
  backlogsCount: number;
  status: MenteeProgressStatus;
  assignedFacultyId: string;
}

export interface MentorshipSession {
  id: string; // MNT-[HEX8]
  institutionId: string;
  mentorFacultyId: string;
  mentorFacultyName: string;
  department: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  category: MentorshipCategory;
  urgency: InterventionUrgency;
  discussionPoints: string;
  actionPlan: string;
  parentContacted: boolean;
  referredToProfessionalCounselor: boolean;
  sessionDate: string;
  followUpDate?: string;
  createdAt: string;
}

export interface FacultyMentorshipSummary {
  facultyId: string;
  facultyName: string;
  department: string;
  totalMenteesCount: number;
  totalSessionsCompleted: number;
  isRatioCompliant: boolean;
  criticalInterventionsCount: number;
  professionalCounselorReferrals: number;
  riskDistribution: Record<MenteeProgressStatus, number>;
}

let menteeStore: MenteeProfile[] = [];
let sessionStore: MentorshipSession[] = [];

export function evaluateMenteeStatus(
  cgpa: number,
  attendancePercent: number,
  backlogsCount: number
): MenteeProgressStatus {
  if (cgpa < 5.0 || attendancePercent < 60 || backlogsCount >= 3) {
    return 'CRITICAL_RISK';
  }
  if (cgpa < 7.0 || attendancePercent < 75 || backlogsCount >= 1) {
    return 'NEEDS_SUPPORT';
  }
  if (cgpa < 8.5 || attendancePercent < 85) {
    return 'STABLE';
  }
  return 'THRIVING';
}

export function getMentorshipSessions(
  institutionId: string,
  filter?: { mentorFacultyId?: string; studentId?: string }
): MentorshipSession[] {
  return sessionStore
    .filter(s => s.institutionId === institutionId)
    .filter(s => !filter?.mentorFacultyId || s.mentorFacultyId === filter.mentorFacultyId)
    .filter(s => !filter?.studentId || s.studentId === filter.studentId)
    .map(s => ({ ...s }));
}

export function getMentees(
  institutionId: string,
  filter?: { assignedFacultyId?: string; status?: MenteeProgressStatus }
): MenteeProfile[] {
  return menteeStore
    .filter(m => m.institutionId === institutionId)
    .filter(m => !filter?.assignedFacultyId || m.assignedFacultyId === filter.assignedFacultyId)
    .filter(m => !filter?.status || m.status === filter.status)
    .map(m => ({ ...m }));
}

export function assignMentee(mentee: MenteeProfile): MenteeProfile {
  const existing = menteeStore.find(
    m => m.studentId === mentee.studentId && m.institutionId === mentee.institutionId
  );
  const status = evaluateMenteeStatus(mentee.cgpa, mentee.attendancePercent, mentee.backlogsCount);

  if (existing) {
    existing.assignedFacultyId = mentee.assignedFacultyId;
    existing.cgpa = mentee.cgpa;
    existing.attendancePercent = mentee.attendancePercent;
    existing.backlogsCount = mentee.backlogsCount;
    existing.status = status;
    return { ...existing };
  }

  const newMentee: MenteeProfile = {
    ...mentee,
    status
  };
  menteeStore.push(newMentee);
  return { ...newMentee };
}

export function recordMentorshipSession(params: {
  institutionId: string;
  mentorFacultyId: string;
  mentorFacultyName: string;
  department: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  category: MentorshipCategory;
  urgency: InterventionUrgency;
  discussionPoints: string;
  actionPlan: string;
  parentContacted?: boolean;
  referredToProfessionalCounselor?: boolean;
  sessionDate: string;
  followUpDate?: string;
}): { success: boolean; session?: MentorshipSession; error?: string } {
  if (!params.discussionPoints || params.discussionPoints.trim().length === 0) {
    return {
      success: false,
      error: 'MISSING_DISCUSSION_NOTES: Mentorship session must record discussion points.'
    };
  }

  const hex = Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
  const id = `MNT-${hex}`;

  const newSession: MentorshipSession = {
    id,
    institutionId: params.institutionId,
    mentorFacultyId: params.mentorFacultyId,
    mentorFacultyName: params.mentorFacultyName,
    department: params.department,
    studentId: params.studentId,
    studentName: params.studentName,
    rollNumber: params.rollNumber,
    category: params.category,
    urgency: params.urgency,
    discussionPoints: params.discussionPoints.trim(),
    actionPlan: params.actionPlan?.trim() || 'Continue regular academic monitoring',
    parentContacted: !!params.parentContacted,
    referredToProfessionalCounselor: !!params.referredToProfessionalCounselor,
    sessionDate: params.sessionDate,
    followUpDate: params.followUpDate,
    createdAt: new Date().toISOString()
  };

  sessionStore.push(newSession);
  return { success: true, session: { ...newSession } };
}

export function computeFacultyMentorshipSummary(
  facultyId: string,
  institutionId: string
): FacultyMentorshipSummary {
  const mentees = getMentees(institutionId, { assignedFacultyId: facultyId });
  const sessions = getMentorshipSessions(institutionId, { mentorFacultyId: facultyId });

  let facultyName = 'Faculty Mentor';
  let department = 'Computer Science';

  if (mentees.length > 0) {
    department = mentees[0].department;
  }
  if (sessions.length > 0) {
    facultyName = sessions[0].mentorFacultyName;
    department = sessions[0].department;
  }

  const riskDistribution: Record<MenteeProgressStatus, number> = {
    THRIVING: 0,
    STABLE: 0,
    NEEDS_SUPPORT: 0,
    CRITICAL_RISK: 0
  };

  for (const m of mentees) {
    riskDistribution[m.status] = (riskDistribution[m.status] || 0) + 1;
  }

  const criticalCount = sessions.filter(
    s => s.urgency === 'CRITICAL_COUNSELOR_ESCALATION' || s.urgency === 'MEDIUM'
  ).length;

  const counselorReferrals = sessions.filter(
    s => s.referredToProfessionalCounselor
  ).length;

  const isRatioCompliant = mentees.length <= 20;

  return {
    facultyId,
    facultyName,
    department,
    totalMenteesCount: mentees.length,
    totalSessionsCompleted: sessions.length,
    isRatioCompliant,
    criticalInterventionsCount: criticalCount,
    professionalCounselorReferrals: counselorReferrals,
    riskDistribution
  };
}

export function exportMentorshipLogCSV(institutionId: string): string {
  const sessions = getMentorshipSessions(institutionId);

  const lines: string[] = [];
  lines.push('=== NAAC CRITERION 5.1.4: FACULTY MENTORSHIP & STUDENT COUNSELING LOG ===');
  lines.push('Session_ID,Mentor_Name,Department,Student_Name,Roll_Number,Category,Urgency,Discussion_Notes,Action_Plan,Parent_Contacted,Counselor_Referred,Session_Date');

  for (const s of sessions) {
    lines.push(
      `"${s.id}","${s.mentorFacultyName}","${s.department}","${s.studentName}","${s.rollNumber}","${s.category}","${s.urgency}","${s.discussionPoints.replace(/"/g, '""')}","${s.actionPlan.replace(/"/g, '""')}",${s.parentContacted ? 'YES' : 'NO'},${s.referredToProfessionalCounselor ? 'YES' : 'NO'},"${s.sessionDate}"`
    );
  }

  return lines.join('\n');
}

export function seedMentorshipData(institutionId: string): void {
  menteeStore = [
    {
      studentId: 'STU-CS-2026-001',
      studentName: 'Aarav Nair',
      rollNumber: '2026-CSE-001',
      institutionId,
      department: 'Computer Science',
      cgpa: 9.2,
      attendancePercent: 94,
      backlogsCount: 0,
      status: 'THRIVING',
      assignedFacultyId: 'FAC-CS-001'
    },
    {
      studentId: 'STU-CS-2026-015',
      studentName: 'Siddharth Menon',
      rollNumber: '2026-CSE-015',
      institutionId,
      department: 'Computer Science',
      cgpa: 7.1,
      attendancePercent: 68,
      backlogsCount: 1,
      status: 'NEEDS_SUPPORT',
      assignedFacultyId: 'FAC-CS-001'
    },
    {
      studentId: 'STU-CS-2026-042',
      studentName: 'Priya Sundaram',
      rollNumber: '2026-CSE-042',
      institutionId,
      department: 'Computer Science',
      cgpa: 4.8,
      attendancePercent: 54,
      backlogsCount: 3,
      status: 'CRITICAL_RISK',
      assignedFacultyId: 'FAC-CS-001'
    }
  ];

  sessionStore = [
    {
      id: 'MNT-9102AAB1',
      institutionId,
      mentorFacultyId: 'FAC-CS-001',
      mentorFacultyName: 'Dr. Aris Thorne',
      department: 'Computer Science',
      studentId: 'STU-CS-2026-015',
      studentName: 'Siddharth Menon',
      rollNumber: '2026-CSE-015',
      category: 'ATTENDANCE_INTERVENTION',
      urgency: 'MEDIUM',
      discussionPoints: 'Student suffered shoulder trauma impacting commute; reviewed medical leave certificate and remedial notes.',
      actionPlan: 'Assign peer note-taker; coordinate with campus infirmary for physiotherapy timing.',
      parentContacted: true,
      referredToProfessionalCounselor: false,
      sessionDate: '2026-10-14T11:00:00Z',
      followUpDate: '2026-10-28',
      createdAt: '2026-10-14T11:30:00Z'
    },
    {
      id: 'MNT-9102AAB2',
      institutionId,
      mentorFacultyId: 'FAC-CS-001',
      mentorFacultyName: 'Dr. Aris Thorne',
      department: 'Computer Science',
      studentId: 'STU-CS-2026-042',
      studentName: 'Priya Sundaram',
      rollNumber: '2026-CSE-042',
      category: 'MENTAL_HEALTH_WELLBEING',
      urgency: 'CRITICAL_COUNSELOR_ESCALATION',
      discussionPoints: 'Severe anxiety surrounding semester examinations and multi-subject backlogs. Manifesting panic symptoms.',
      actionPlan: 'Immediate referral to Campus Psychologist at Health Centre; parent informed with compassionate protocol.',
      parentContacted: true,
      referredToProfessionalCounselor: true,
      sessionDate: '2026-10-15T15:00:00Z',
      followUpDate: '2026-10-20',
      createdAt: '2026-10-15T15:45:00Z'
    }
  ];
}

export function resetMentorshipStore(): void {
  sessionStore = [];
  menteeStore = [];
}
