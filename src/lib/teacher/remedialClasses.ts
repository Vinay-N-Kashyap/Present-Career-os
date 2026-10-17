/**
 * Faculty Remedial Class Scheduler & Slow Learner Tracking Engine
 *
 * Statutory Compliance: NAAC Criterion 2.2.1
 * ("The institution assesses the learning levels of the students and organises
 *  special Programmes for advanced learners and slow learners")
 *
 * Capabilities:
 * 1. Algorithmic identification of slow learners via multi-metric screening (midterms < 50%,
 *    diagnostic tests < 40%, quest completion < 45%).
 * 2. Small-group remedial batch scheduling (capped at <= 20 students for high-touch intervention).
 * 3. Session attendance and micro-curriculum concept coverage tracking.
 * 4. Standardized Normalized Learning Gain computation:
 *    g = ((PostScore - PreScore) / (100 - PreScore)) * 100
 * 5. Remedial lifecycle management with graduation gate (PostScore >= 60%).
 * 6. Official NAAC Criterion 2.2.1 Slow Learner & Remedial Progress CSV export.
 */

export type SlowLearnerCause =
  | 'PREREQUISITE_DEFICIT'
  | 'PRACTICE_DEFICIT'
  | 'LANGUAGE_BARRIER'
  | 'CONCEPT_CONFUSION'
  | 'MATHEMATICAL_FOUNDATION';

export type RemedialLifecycleState =
  | 'IDENTIFIED'
  | 'ENROLLED_IN_REMEDIAL'
  | 'ATTENDING_SESSIONS'
  | 'POST_ASSESSMENT_COMPLETED'
  | 'GRADUATED_FROM_REMEDIAL';

export interface SlowLearnerProfile {
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  courseCode: string;
  courseName: string;
  semester: number;
  diagnosticScore: number; // 0 - 100
  midtermScore: number; // 0 - 100
  questCompletionRate: number; // 0 - 100
  primaryCause: SlowLearnerCause;
  identifiedDate: string;
  state: RemedialLifecycleState;
  assignedBatchId?: string;
  preRemedialScore: number;
  postRemedialScore?: number;
  learningGainPercentage?: number;
}

export interface RemedialBatch {
  id: string;
  batchCode: string; // e.g. "REM-CS201-B1"
  courseCode: string;
  courseName: string;
  facultyId: string;
  facultyName: string;
  targetedConcept: string;
  maxCapacity: number; // max 20
  enrolledStudentIds: string[];
  totalSessionsConducted: number;
  targetGraduationDate: string;
  isActive: boolean;
}

export interface RemedialSession {
  id: string;
  batchId: string;
  sessionNumber: number;
  date: string;
  durationMinutes: number;
  topicsCovered: string;
  attendeeStudentIds: string[];
  notes: string;
}

// In-memory registries
const slowLearnersRegistry: Map<string, SlowLearnerProfile> = new Map();
const remedialBatchesRegistry: Map<string, RemedialBatch> = new Map();
const remedialSessionsRegistry: Map<string, RemedialSession> = new Map();

/**
 * Screen and Identify Slow Learner based on Multi-Metric Thresholds
 */
export function screenStudentForRemedial(params: {
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  courseCode: string;
  courseName: string;
  semester: number;
  diagnosticScore: number;
  midtermScore: number;
  questCompletionRate: number;
  primaryCause?: SlowLearnerCause;
}): SlowLearnerProfile | null {
  const {
    studentId,
    studentName,
    rollNumber,
    department,
    courseCode,
    courseName,
    semester,
    diagnosticScore,
    midtermScore,
    questCompletionRate,
    primaryCause = 'CONCEPT_CONFUSION',
  } = params;

  // Screening Rule: If midterm < 50 OR diagnostic < 40 OR quest completion < 45
  const isSlowLearner = midtermScore < 50 || diagnosticScore < 40 || questCompletionRate < 45;

  if (!isSlowLearner) {
    return null;
  }

  const profile: SlowLearnerProfile = {
    studentId,
    studentName,
    rollNumber,
    department,
    courseCode,
    courseName,
    semester,
    diagnosticScore,
    midtermScore,
    questCompletionRate,
    primaryCause,
    identifiedDate: new Date().toISOString().split('T')[0],
    state: 'IDENTIFIED',
    preRemedialScore: midtermScore,
  };

  slowLearnersRegistry.set(studentId, profile);
  return profile;
}

/**
 * Create a Small-Group Remedial Batch
 */
export function createRemedialBatch(params: {
  id: string;
  batchCode: string;
  courseCode: string;
  courseName: string;
  facultyId: string;
  facultyName: string;
  targetedConcept: string;
  maxCapacity?: number;
  targetGraduationDate: string;
}): RemedialBatch {
  const {
    id,
    batchCode,
    courseCode,
    courseName,
    facultyId,
    facultyName,
    targetedConcept,
    maxCapacity = 20,
    targetGraduationDate,
  } = params;

  if (maxCapacity > 20) {
    throw new Error('BATCH_CAPACITY_LIMIT_EXCEEDED: Remedial batches must not exceed 20 students per NAAC 2.2 norms');
  }

  const batch: RemedialBatch = {
    id,
    batchCode,
    courseCode,
    courseName,
    facultyId,
    facultyName,
    targetedConcept,
    maxCapacity,
    enrolledStudentIds: [],
    totalSessionsConducted: 0,
    targetGraduationDate,
    isActive: true,
  };

  remedialBatchesRegistry.set(id, batch);
  return batch;
}

/**
 * Enroll Student into Remedial Batch
 */
export function enrollStudentInRemedialBatch(batchId: string, studentId: string): SlowLearnerProfile {
  const batch = remedialBatchesRegistry.get(batchId);
  if (!batch) {
    throw new Error(`BATCH_NOT_FOUND: Remedial batch ${batchId} does not exist`);
  }

  const student = slowLearnersRegistry.get(studentId);
  if (!student) {
    throw new Error(`STUDENT_NOT_FOUND: Slow learner record for ${studentId} does not exist`);
  }

  if (batch.enrolledStudentIds.length >= batch.maxCapacity) {
    throw new Error(`BATCH_IS_FULL: Remedial batch ${batch.batchCode} has reached capacity (${batch.maxCapacity})`);
  }

  if (batch.enrolledStudentIds.includes(studentId)) {
    throw new Error(`STUDENT_ALREADY_ENROLLED: Student ${studentId} is already in batch ${batch.batchCode}`);
  }

  batch.enrolledStudentIds.push(studentId);
  student.assignedBatchId = batchId;
  student.state = 'ENROLLED_IN_REMEDIAL';

  return student;
}

/**
 * Record a Remedial Instruction Session
 */
export function recordRemedialSession(params: {
  id: string;
  batchId: string;
  date: string;
  durationMinutes: number;
  topicsCovered: string;
  attendeeStudentIds: string[];
  notes?: string;
}): RemedialSession {
  const { id, batchId, date, durationMinutes, topicsCovered, attendeeStudentIds, notes = '' } = params;

  const batch = remedialBatchesRegistry.get(batchId);
  if (!batch) {
    throw new Error(`BATCH_NOT_FOUND: Remedial batch ${batchId} does not exist`);
  }

  const sessionNumber = batch.totalSessionsConducted + 1;
  batch.totalSessionsConducted = sessionNumber;

  // Advance attendee student states to ATTENDING_SESSIONS
  for (const studentId of attendeeStudentIds) {
    const student = slowLearnersRegistry.get(studentId);
    if (student && student.state === 'ENROLLED_IN_REMEDIAL') {
      student.state = 'ATTENDING_SESSIONS';
    }
  }

  const session: RemedialSession = {
    id,
    batchId,
    sessionNumber,
    date,
    durationMinutes,
    topicsCovered,
    attendeeStudentIds,
    notes,
  };

  remedialSessionsRegistry.set(id, session);
  return session;
}

/**
 * Record Post-Remedial Assessment Score & Calculate Normalized Learning Gain
 *
 * Formula:
 * Gain % = ((PostScore - PreScore) / (100 - PreScore)) * 100
 * If PostScore >= 60, student qualifies for GRADUATED_FROM_REMEDIAL.
 */
export function recordPostRemedialAssessment(studentId: string, postScore: number): SlowLearnerProfile {
  const student = slowLearnersRegistry.get(studentId);
  if (!student) {
    throw new Error(`STUDENT_NOT_FOUND: Student ${studentId} not found in slow learner registry`);
  }

  if (postScore < 0 || postScore > 100) {
    throw new Error('INVALID_SCORE: Assessment score must be between 0 and 100');
  }

  student.postRemedialScore = postScore;

  // Normalized learning gain calculation
  const pre = student.preRemedialScore;
  let gain = 0;
  if (pre < 100) {
    gain = Math.max(0, Math.min(100, Math.round(((postScore - pre) / (100 - pre)) * 100)));
  }
  student.learningGainPercentage = gain;

  if (postScore >= 60) {
    student.state = 'GRADUATED_FROM_REMEDIAL';
  } else {
    student.state = 'POST_ASSESSMENT_COMPLETED';
  }

  return student;
}

export function getAllSlowLearners(): SlowLearnerProfile[] {
  return Array.from(slowLearnersRegistry.values());
}

export function getAllRemedialBatches(): RemedialBatch[] {
  return Array.from(remedialBatchesRegistry.values());
}

export function getAllRemedialSessions(): RemedialSession[] {
  return Array.from(remedialSessionsRegistry.values());
}

/**
 * Export NAAC Criterion 2.2.1 Slow Learner & Remedial Program CSV
 */
export function exportRemedialLedgerCSV(): string {
  const headers = [
    'Student Roll',
    'Student Name',
    'Department',
    'Course Code',
    'Course Name',
    'Semester',
    'Primary Root Cause',
    'Diagnostic Score',
    'Midterm Pre-Score',
    'Post-Remedial Score',
    'Normalized Learning Gain (%)',
    'Remedial State',
    'Assigned Batch Code',
  ];

  const students = Array.from(slowLearnersRegistry.values());

  const rows = students.map((s) => {
    const batch = s.assignedBatchId ? remedialBatchesRegistry.get(s.assignedBatchId) : null;
    return [
      `"${s.rollNumber}"`,
      `"${s.studentName}"`,
      `"${s.department}"`,
      `"${s.courseCode}"`,
      `"${s.courseName}"`,
      s.semester,
      `"${s.primaryCause}"`,
      s.diagnosticScore,
      s.preRemedialScore,
      s.postRemedialScore !== undefined ? s.postRemedialScore : 'N/A',
      s.learningGainPercentage !== undefined ? `${s.learningGainPercentage}%` : 'N/A',
      `"${s.state}"`,
      `"${batch ? batch.batchCode : 'UNASSIGNED'}"`,
    ];
  });

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
