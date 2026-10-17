/**
 * PinIT Career OS - Teacher Exam Scheduler & Proctoring Engine
 * Module ID: TASK-866
 * Architecture Reference: teach-portal.md & PINIT_ALL_IN_ONE_MASTER_SRS_AND_VISUALS_BIBLE.pdf
 * 
 * Capabilities:
 * - Exam scheduling with department, semester, duration, and proctoring threshold configurations.
 * - Real-time proctoring telemetry aggregator: monitors tab switches, gaze tracking anomalies, and microphone audio spikes.
 * - Automated disciplinary integrity flags: transitions session from ACTIVE -> WARNING -> FLAGGED -> DISQUALIFIED.
 * - Multi-tenant isolation ensuring exam data and proctoring telemetry remain hard-partitioned by institutionId.
 */

export interface ProctoringConfig {
  maxTabSwitches: number; // default 3
  webcamRequired: boolean;
  audioDetection: boolean;
  fullScreenMandatory: boolean;
  autoDisqualifyOnLimit: boolean;
}

export interface ExamSchedule {
  id: string;
  institutionId: string;
  courseCode: string;
  title: string;
  department: string;
  semester: number;
  startTime: string; // ISO string
  durationMinutes: number;
  totalMarks: number;
  proctoringConfig: ProctoringConfig;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export type ProctoringViolationType =
  | 'TAB_SWITCH'
  | 'GAZE_AWAY'
  | 'MULTIPLE_FACES_DETECTED'
  | 'NO_FACE_DETECTED'
  | 'AUDIO_NOISE_SPIKE'
  | 'FULLSCREEN_EXIT';

export interface ProctoringViolation {
  timestamp: string;
  type: ProctoringViolationType;
  details: string;
}

export interface ProctoringSession {
  sessionId: string;
  examId: string;
  studentRoll: string;
  institutionId: string;
  tabSwitchCount: number;
  gazeAnomalyCount: number;
  audioNoiseCount: number;
  integrityScore: number; // 0 to 100 (starts at 100, docks points on violation)
  status: 'active' | 'warning' | 'flagged' | 'disqualified';
  violations: ProctoringViolation[];
  startedAt: string;
  lastPingAt: string;
}

export interface ExamProctoringSummary {
  examId: string;
  institutionId: string;
  totalCandidates: number;
  activeCount: number;
  warningCount: number;
  flaggedCount: number;
  disqualifiedCount: number;
  averageIntegrityScore: number;
}

export class ExamProctoringEngine {
  private exams: Map<string, ExamSchedule> = new Map();
  private sessions: Map<string, ProctoringSession> = new Map();

  /**
   * Schedules a new proctored examination.
   */
  scheduleExam(params: {
    id: string;
    institutionId: string;
    courseCode: string;
    title: string;
    department: string;
    semester: number;
    startTime: string;
    durationMinutes: number;
    totalMarks: number;
    proctoringConfig?: Partial<ProctoringConfig>;
  }): ExamSchedule {
    if (!params.institutionId || !params.courseCode) {
      throw new Error('ExamEngine: institutionId and courseCode are mandatory.');
    }
    if (params.durationMinutes <= 0 || params.totalMarks <= 0) {
      throw new Error('ExamEngine: Duration and total marks must be strictly positive.');
    }

    const config: ProctoringConfig = {
      maxTabSwitches: 3,
      webcamRequired: true,
      audioDetection: true,
      fullScreenMandatory: true,
      autoDisqualifyOnLimit: false,
      ...(params.proctoringConfig || {}),
    };

    const exam: ExamSchedule = {
      id: params.id,
      institutionId: params.institutionId,
      courseCode: params.courseCode,
      title: params.title,
      department: params.department.toUpperCase(),
      semester: params.semester,
      startTime: params.startTime,
      durationMinutes: params.durationMinutes,
      totalMarks: params.totalMarks,
      proctoringConfig: config,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    this.exams.set(params.id, exam);
    return exam;
  }

  /**
   * Initializes a student exam proctoring session.
   */
  startSession(params: {
    sessionId: string;
    examId: string;
    studentRoll: string;
    institutionId: string;
  }): ProctoringSession {
    const exam = this.exams.get(params.examId);
    if (!exam) {
      throw new Error(`ExamEngine: Exam [${params.examId}] not found.`);
    }
    if (exam.institutionId !== params.institutionId) {
      throw new Error(`ExamEngine: Tenant mismatch for exam [${params.examId}].`);
    }

    const now = new Date().toISOString();
    const session: ProctoringSession = {
      sessionId: params.sessionId,
      examId: params.examId,
      studentRoll: params.studentRoll,
      institutionId: params.institutionId,
      tabSwitchCount: 0,
      gazeAnomalyCount: 0,
      audioNoiseCount: 0,
      integrityScore: 100,
      status: 'active',
      violations: [],
      startedAt: now,
      lastPingAt: now,
    };

    this.sessions.set(params.sessionId, session);
    return session;
  }

  /**
   * Records a proctoring telemetry event and updates integrity status.
   */
  recordViolation(params: {
    sessionId: string;
    institutionId: string;
    type: ProctoringViolationType;
    details?: string;
  }): ProctoringSession {
    const session = this.sessions.get(params.sessionId);
    if (!session) {
      throw new Error(`ExamEngine: Session [${params.sessionId}] not found.`);
    }
    if (session.institutionId !== params.institutionId) {
      throw new Error(`ExamEngine: Tenant mismatch on session [${params.sessionId}].`);
    }

    if (session.status === 'disqualified') {
      return session; // Terminal status
    }

    const exam = this.exams.get(session.examId);
    const maxTabs = exam?.proctoringConfig.maxTabSwitches ?? 3;
    const now = new Date().toISOString();

    let penalty = 5;

    switch (params.type) {
      case 'TAB_SWITCH':
      case 'FULLSCREEN_EXIT':
        session.tabSwitchCount++;
        penalty = 15;
        break;
      case 'GAZE_AWAY':
      case 'NO_FACE_DETECTED':
        session.gazeAnomalyCount++;
        penalty = 10;
        break;
      case 'MULTIPLE_FACES_DETECTED':
        penalty = 25;
        break;
      case 'AUDIO_NOISE_SPIKE':
        session.audioNoiseCount++;
        penalty = 8;
        break;
    }

    session.integrityScore = Math.max(0, session.integrityScore - penalty);
    session.lastPingAt = now;
    session.violations.push({
      timestamp: now,
      type: params.type,
      details: params.details || `Proctoring trigger: ${params.type}`,
    });

    // Update status based on violations & thresholds
    if (exam?.proctoringConfig.autoDisqualifyOnLimit && session.tabSwitchCount > maxTabs) {
      session.status = 'disqualified';
    } else if (session.tabSwitchCount >= maxTabs || session.integrityScore < 50) {
      session.status = 'flagged';
    } else if (session.integrityScore < 80) {
      session.status = 'warning';
    }

    return session;
  }

  /**
   * Disqualifies a student manually by faculty or proctor.
   */
  disqualifySession(sessionId: string, institutionId: string, reason: string): ProctoringSession {
    const session = this.sessions.get(sessionId);
    if (!session || session.institutionId !== institutionId) {
      throw new Error(`ExamEngine: Invalid session or tenant mismatch.`);
    }

    session.status = 'disqualified';
    session.integrityScore = 0;
    session.violations.push({
      timestamp: new Date().toISOString(),
      type: 'TAB_SWITCH',
      details: `Manual Proctor Disqualification: ${reason}`,
    });

    return session;
  }

  /**
   * Aggregates real-time exam proctoring summary telemetry.
   */
  getExamSummary(examId: string, institutionId: string): ExamProctoringSummary {
    const exam = this.exams.get(examId);
    if (!exam || exam.institutionId !== institutionId) {
      throw new Error(`ExamEngine: Invalid exam or tenant mismatch.`);
    }

    let activeCount = 0;
    let warningCount = 0;
    let flaggedCount = 0;
    let disqualifiedCount = 0;
    let totalScore = 0;
    let totalCandidates = 0;

    for (const session of this.sessions.values()) {
      if (session.examId === examId && session.institutionId === institutionId) {
        totalCandidates++;
        totalScore += session.integrityScore;

        if (session.status === 'active') activeCount++;
        else if (session.status === 'warning') warningCount++;
        else if (session.status === 'flagged') flaggedCount++;
        else if (session.status === 'disqualified') disqualifiedCount++;
      }
    }

    const averageIntegrityScore = totalCandidates > 0 ? Math.round(totalScore / totalCandidates) : 100;

    return {
      examId,
      institutionId,
      totalCandidates,
      activeCount,
      warningCount,
      flaggedCount,
      disqualifiedCount,
      averageIntegrityScore,
    };
  }

  getExamsByInstitution(institutionId: string): ExamSchedule[] {
    const list: ExamSchedule[] = [];
    for (const ex of this.exams.values()) {
      if (ex.institutionId === institutionId) list.push(ex);
    }
    return list;
  }

  getSessionsByExam(examId: string, institutionId: string): ProctoringSession[] {
    const list: ProctoringSession[] = [];
    for (const s of this.sessions.values()) {
      if (s.examId === examId && s.institutionId === institutionId) list.push(s);
    }
    return list;
  }

  clear(): void {
    this.exams.clear();
    this.sessions.clear();
  }
}
