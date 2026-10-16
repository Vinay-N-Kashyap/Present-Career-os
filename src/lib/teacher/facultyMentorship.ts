/**
 * Faculty Mentorship, Proctor & Student Counseling Telemetry Engine (TASK-933)
 * 
 * Provides:
 * 1. AICTE & UGC statutory Proctor / Mentoring System (1 Faculty Mentor : 15-20 Students).
 * 2. Multi-category 1-on-1 counseling encounters:
 *    - Academic Progress & Backlog Remediation
 *    - Career Trajectory & Higher Studies Guidance
 *    - Mental Health & Emotional Wellbeing
 *    - Attendance Deficit & Drop-Out Interventions
 *    - Disciplinary Counseling
 * 3. Dynamic student risk state evaluation (THRIVING, STABLE, NEEDS_SUPPORT, CRITICAL_RISK).
 * 4. Escalation to licensed campus psychologist / professional counselor.
 * 5. Parent communication telemetry & NAAC Criterion 5.1.4 mentoring CSV export.
 */

export type MentorshipCategory = 
  | 'ACADEMIC_PROGRESS' 
  | 'CAREER_GUIDANCE' 
  | 'MENTAL_HEALTH_WELLBEING' 
  | 'ATTENDANCE_INTERVENTION' 
  | 'DISCIPLINARY_COUNSELING';

export type InterventionUrgency = 'LOW' | 'MEDIUM' | 'CRITICAL_COUNSELOR_ESCALATION';

export type MenteeProgressStatus = 'THRIVING' | 'STABLE' | 'NEEDS_SUPPORT' | 'CRITICAL_RISK';

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

export interface FacultyMentorshipSummary {
  facultyId: string;
  facultyName: string;
  department: string;
  totalMenteesCount: number;
  totalSessionsCompleted: number;
  isRatioCompliant: boolean; // True if mentees <= 20 as per AICTE guidelines
  criticalInterventionsCount: number;
  professionalCounselorReferrals: number;
  riskDistribution: Record<MenteeProgressStatus, number>;
}

// In-Memory Store
let sessionStore: MentorshipSession[] = [];
let menteeStore: MenteeProfile[] = [];

export function evaluateMenteeStatus(
  cgpa: number,
  attendancePercent: number,
  backlogsCount: number
): MenteeProgressStatus {
  if (backlogsCount >= 2 || attendancePercent < 60 || cgpa < 5.0) {
    return 'CRITICAL_RISK';
  }
  if (backlogsCount === 1 || attendancePercent < 75 || cgpa < 6.5) {
    return 'NEEDS_SUPPORT';
  }
  if (cgpa >= 8.0 && attendancePercent >= 85 && backlogsCount === 0) {
    return 'THRIVING';
  }
  return 'STABLE';
}

export function getMentorshipSessions(
  institutionId: string,
  filter?: { mentorFacultyId?: string; studentId?: string; category?: MentorshipCategory }
): MentorshipSession[] {
  return sessionStore
    .filter(s => s.institutionId === institutionId)
    .filter(s => !filter?.mentorFacultyId || s.mentorFacultyId === filter.mentorFacultyId)
    .filter(s => !filter?.studentId || s.studentId === filter.studentId)
    .filter(s => !filter?.category || s.category === filter.category)
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
    actionPlan: params.actionPlan.trim() || 'Continue regular academic monitoring',
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
