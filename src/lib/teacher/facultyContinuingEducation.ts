/**
 * Faculty Continuing Education Workshop & ATAL FDP Management Engine
 * Statutory Compliance: AICTE Training and Learning (ATAL) Academy Guidelines,
 * Quality Improvement Programme (QIP) Norms & MoE Malaviya Mission Teacher Training Framework.
 *
 * Platform: PinIT Career OS - Teacher Portal & Faculty Governance
 * Zero-Collision Invariant: Pure Branch C administrative and faculty governance.
 */

import { createHash } from 'crypto';

export type FdpScheme =
  | 'AICTE_ATAL_ACADEMY'
  | 'GIAN_INTERNATIONAL'
  | 'INSTITUTE_SELF_FINANCED_QIP'
  | 'INDUSTRY_COLLABORATIVE_STC';

export type CourseMode = 'OFFLINE_RESIDENTIAL' | 'ONLINE_HYBRID' | 'HANDS_ON_BOOTCAMP';

export type CourseLifecycle =
  | 'PROPOSAL_DRAFTED'
  | 'DEAN_CE_APPROVED'
  | 'REGISTRATION_OPEN'
  | 'COURSE_CONDUCTED'
  | 'CERTIFICATES_ISSUED'
  | 'ACCOUNTS_SETTLED';

export interface ParticipantRecord {
  participantId: string;
  fullName: string;
  institutionName: string;
  designation: string;
  email: string;
  attendancePercentage: number;
  mcqAssessmentScore?: number; // 0 to 100
  certificateIssued: boolean;
}

export interface ContinuingEducationCourse {
  courseId: string;
  certificateToken: string; // FDP-[YEAR]-[DEPT]-[HEX6]
  courseTitle: string;
  department: string;
  coordinatorName: string;
  coordinatorEmpId: string;
  scheme: FdpScheme;
  mode: CourseMode;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  durationDays: number;
  targetCapacity: number;
  sanctionedBudgetInr: number;
  stage: CourseLifecycle;
  participants: ParticipantRecord[];
  syllabusModules: string[];
  cryptographicCourseSeal?: string; // SHA-256 seal
  lastUpdated: string;
}

/**
 * Standard AICTE ATAL / QIP certification threshold:
 * - Attendance >= 80.0%
 * - End-course Assessment Score >= 60.0%
 */
export const MIN_ATTENDANCE_PERCENTAGE = 80.0;
export const MIN_ASSESSMENT_SCORE = 60.0;

/**
 * Generate unique FDP / STC tracking token: FDP-[YEAR]-[DEPT]-[HEX6]
 */
export function generateFdpToken(dept: string, year: number = new Date().getFullYear()): string {
  const cleanDept = dept.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'DEPT';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `FDP-${year}-${cleanDept}-${randomHex}`;
}

/**
 * Validate participant eligibility for AICTE ATAL / QIP certificate
 */
export function validateCertificateEligibility(
  attendance: number,
  testScore?: number
): { eligible: boolean; reason?: string } {
  if (attendance < MIN_ATTENDANCE_PERCENTAGE) {
    return {
      eligible: false,
      reason: `Attendance ${attendance.toFixed(1)}% is below statutory threshold (${MIN_ATTENDANCE_PERCENTAGE}%).`,
    };
  }
  if (testScore === undefined || testScore < MIN_ASSESSMENT_SCORE) {
    return {
      eligible: false,
      reason: `Assessment score ${testScore !== undefined ? testScore.toFixed(1) : 0}% is below hurdle (${MIN_ASSESSMENT_SCORE}%).`,
    };
  }
  return { eligible: true };
}

/**
 * Generate tamper-proof SHA-256 seal for continuing education course
 */
export function generateCourseSeal(
  course: Omit<ContinuingEducationCourse, 'cryptographicCourseSeal'>
): string {
  const canonicalPayload = [
    course.courseId,
    course.certificateToken,
    course.courseTitle,
    course.department,
    course.coordinatorEmpId,
    course.scheme,
    course.durationDays,
    course.targetCapacity,
    course.sanctionedBudgetInr,
    course.stage,
    course.participants.length,
    course.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Create a new Continuing Education / FDP Workshop Course
 */
export function createContinuingEducationCourse(params: {
  courseTitle: string;
  department: string;
  coordinatorName: string;
  coordinatorEmpId: string;
  scheme: FdpScheme;
  mode: CourseMode;
  startDate: string;
  endDate: string;
  durationDays: number;
  targetCapacity: number;
  sanctionedBudgetInr: number;
  syllabusModules?: string[];
}): ContinuingEducationCourse {
  if (params.durationDays <= 0) {
    throw new Error('Course duration must be at least 1 day.');
  }

  if (params.targetCapacity <= 0) {
    throw new Error('Target participant capacity must be greater than 0.');
  }

  const certificateToken = generateFdpToken(params.department);
  const now = new Date().toISOString();

  const baseCourse: Omit<ContinuingEducationCourse, 'cryptographicCourseSeal'> = {
    courseId: `FDP-${Date.now().toString(36).toUpperCase()}`,
    certificateToken,
    courseTitle: params.courseTitle,
    department: params.department,
    coordinatorName: params.coordinatorName,
    coordinatorEmpId: params.coordinatorEmpId,
    scheme: params.scheme,
    mode: params.mode,
    startDate: params.startDate,
    endDate: params.endDate,
    durationDays: params.durationDays,
    targetCapacity: params.targetCapacity,
    sanctionedBudgetInr: params.sanctionedBudgetInr,
    stage: 'PROPOSAL_DRAFTED',
    participants: [],
    syllabusModules: params.syllabusModules || [
      'Foundations & Core Principles',
      'Advanced Practical Lab Experiments',
      'Industry Applications & Capstone Case Studies',
    ],
    lastUpdated: now,
  };

  const cryptographicCourseSeal = generateCourseSeal(baseCourse);
  return { ...baseCourse, cryptographicCourseSeal };
}

/**
 * Register a participant in the workshop
 */
export function registerCourseParticipant(
  course: ContinuingEducationCourse,
  participant: Omit<ParticipantRecord, 'participantId' | 'certificateIssued'>
): ContinuingEducationCourse {
  if (course.participants.length >= course.targetCapacity) {
    throw new Error(`Enrollment capped: Course target capacity of ${course.targetCapacity} reached.`);
  }

  const participantId = `PRT-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
  const newParticipant: ParticipantRecord = {
    ...participant,
    participantId,
    certificateIssued: false,
  };

  const now = new Date().toISOString();
  const updated: Omit<ContinuingEducationCourse, 'cryptographicCourseSeal'> = {
    ...course,
    participants: [...course.participants, newParticipant],
    lastUpdated: now,
  };

  const cryptographicCourseSeal = generateCourseSeal(updated);
  return { ...updated, cryptographicCourseSeal };
}

/**
 * Record participant evaluation metrics (attendance and assessment test score)
 */
export function recordParticipantEvaluation(
  course: ContinuingEducationCourse,
  participantId: string,
  attendancePercentage: number,
  mcqAssessmentScore: number
): ContinuingEducationCourse {
  const updatedParticipants = course.participants.map((p) => {
    if (p.participantId === participantId) {
      return {
        ...p,
        attendancePercentage,
        mcqAssessmentScore,
      };
    }
    return p;
  });

  const now = new Date().toISOString();
  const updated: Omit<ContinuingEducationCourse, 'cryptographicCourseSeal'> = {
    ...course,
    participants: updatedParticipants,
    lastUpdated: now,
  };

  const cryptographicCourseSeal = generateCourseSeal(updated);
  return { ...updated, cryptographicCourseSeal };
}

/**
 * Issue batch AICTE / QIP certificates to qualifying participants
 */
export function issueBatchCertificates(course: ContinuingEducationCourse): ContinuingEducationCourse {
  if (course.participants.length === 0) {
    throw new Error('Cannot issue certificates: Course has 0 registered participants.');
  }

  const updatedParticipants = course.participants.map((p) => {
    const check = validateCertificateEligibility(p.attendancePercentage, p.mcqAssessmentScore);
    return {
      ...p,
      certificateIssued: check.eligible,
    };
  });

  const now = new Date().toISOString();
  const updated: Omit<ContinuingEducationCourse, 'cryptographicCourseSeal'> = {
    ...course,
    stage: 'CERTIFICATES_ISSUED',
    participants: updatedParticipants,
    lastUpdated: now,
  };

  const cryptographicCourseSeal = generateCourseSeal(updated);
  return { ...updated, cryptographicCourseSeal };
}

/**
 * Export Continuing Education Course Ledger as statutory CSV
 */
export function exportContinuingEducationCSV(courses: ContinuingEducationCourse[]): string {
  const headers = [
    'Course ID',
    'Tracking Token',
    'Course Title',
    'Department',
    'Coordinator',
    'Scheme',
    'Mode',
    'Duration Days',
    'Registered Participants',
    'Target Capacity',
    'Certificates Issued',
    'Sanctioned Budget INR',
    'Stage',
    'Cryptographic Seal',
  ];

  const rows = courses.map((c) => {
    const certifiedCount = c.participants.filter((p) => p.certificateIssued).length;
    return [
      `"${c.courseId}"`,
      `"${c.certificateToken}"`,
      `"${c.courseTitle.replace(/"/g, '""')}"`,
      `"${c.department.replace(/"/g, '""')}"`,
      `"${c.coordinatorName.replace(/"/g, '""')}"`,
      `"${c.scheme}"`,
      `"${c.mode}"`,
      c.durationDays,
      c.participants.length,
      c.targetCapacity,
      certifiedCount,
      c.sanctionedBudgetInr,
      `"${c.stage}"`,
      `"${c.cryptographicCourseSeal || ''}"`,
    ];
  });

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Demonstration Continuing Education Courses
 */
export const INITIAL_FDP_COURSES: ContinuingEducationCourse[] = [
  {
    courseId: 'FDP-2026-001',
    certificateToken: 'FDP-2026-CSED-7A1B29',
    courseTitle: 'Generative AI & LLM Systems Engineering: Architectural Foundations & Deployments',
    department: 'Computer Science & Engineering',
    coordinatorName: 'Dr. Siddharth Sen',
    coordinatorEmpId: 'EMP-CSE-042',
    scheme: 'AICTE_ATAL_ACADEMY',
    mode: 'HANDS_ON_BOOTCAMP',
    startDate: '2026-06-08',
    endDate: '2026-06-13',
    durationDays: 6,
    targetCapacity: 50,
    sanctionedBudgetInr: 350000,
    stage: 'CERTIFICATES_ISSUED',
    syllabusModules: [
      'Transformer Architecture & FlashAttention Mechanics',
      'LoRA Fine-Tuning & Quantization (AWQ/GPTQ)',
      'vLLM Continuous Batching & Tensor Parallelism',
      'AI Safety, Guardrails & Real-time Evaluation',
    ],
    participants: [
      {
        participantId: 'PRT-CSE-01',
        fullName: 'Prof. Ramesh K. Verma',
        institutionName: 'IIT Roorkee',
        designation: 'Associate Professor',
        email: 'ramesh.verma@iitr.ac.in',
        attendancePercentage: 100.0,
        mcqAssessmentScore: 92.0,
        certificateIssued: true,
      },
      {
        participantId: 'PRT-CSE-02',
        fullName: 'Dr. Preeti Deshmukh',
        institutionName: 'NIT Nagpur',
        designation: 'Assistant Professor',
        email: 'pdeshmukh@nitn.ac.in',
        attendancePercentage: 85.0,
        mcqAssessmentScore: 78.0,
        certificateIssued: true,
      },
      {
        participantId: 'PRT-CSE-03',
        fullName: 'Kiran Patel',
        institutionName: 'Sardar Patel Institute of Tech',
        designation: 'Research Scholar',
        email: 'kiran.patel@spit.ac.in',
        attendancePercentage: 65.0,
        mcqAssessmentScore: 50.0,
        certificateIssued: false, // Ineligible under ATAL 80%/60% rule
      },
    ],
    cryptographicCourseSeal: '7a1b293847291048291847192837482910482918471928374829104829184712',
    lastUpdated: '2026-06-14T10:00:00Z',
  },
  {
    courseId: 'FDP-2026-002',
    certificateToken: 'FDP-2026-EEED-48C109',
    courseTitle: 'Wide Bandgap Semiconductors & High-Power GaN/SiC Converters for Electric Mobility',
    department: 'Electrical & Electronics Engineering',
    coordinatorName: 'Dr. Neha Kulkarni',
    coordinatorEmpId: 'EMP-EEE-018',
    scheme: 'GIAN_INTERNATIONAL',
    mode: 'OFFLINE_RESIDENTIAL',
    startDate: '2026-07-06',
    endDate: '2026-07-11',
    durationDays: 6,
    targetCapacity: 40,
    sanctionedBudgetInr: 500000,
    stage: 'COURSE_CONDUCTED',
    syllabusModules: [
      'Physics of GaN HEMT and SiC MOSFET devices',
      'High dV/dt gate drivers and parasitic inductance elimination',
      'Bidirectional 800V EV Traction Inverters',
    ],
    participants: [
      {
        participantId: 'PRT-EEE-01',
        fullName: 'Dr. Amitav Ghosh',
        institutionName: 'Jadavpur University',
        designation: 'Associate Professor',
        email: 'aghosh@ju.ac.in',
        attendancePercentage: 95.0,
        mcqAssessmentScore: 84.0,
        certificateIssued: false,
      },
    ],
    cryptographicCourseSeal: '48c1093847291048291847192837482910482918471928374829104829184710',
    lastUpdated: '2026-07-10T16:00:00Z',
  },
];
