/**
 * Faculty MOOC Course Authoring & SWAYAM/NPTEL E-Content Repository Engine
 * Statutory Compliance: UGC (Credit Framework for Online Learning Courses through SWAYAM) Regulations,
 * MoE 4-Quadrant E-Learning Architecture & UGC CAS Table 2 (Category 3 - MOOCs & E-Content).
 *
 * Platform: PinIT Career OS - Teacher Portal & Faculty Governance
 * Zero-Collision Invariant: Pure Branch C administrative and faculty governance.
 */

import { createHash } from 'crypto';

export type MoocNationalCoordinator =
  | 'NPTEL'
  | 'CEC'
  | 'AICTE'
  | 'IIMB'
  | 'UGC'
  | 'IGNOU';

export type MoocContributionType =
  | 'FOUR_CREDIT_MOOC_COURSE'
  | 'TWO_CREDIT_MOOC_COURSE'
  | 'MOOC_MODULE_DEVELOPMENT'
  | 'CONTENT_WRITER_QUADRANT'
  | 'COURSE_COORDINATOR_4_CREDIT';

export type CourseLifecycleStage =
  | 'PROPOSAL_SUBMITTED'
  | 'NC_APPROVED'
  | 'CONTENT_DEVELOPED'
  | 'COURSE_LIVE_ON_SWAYAM'
  | 'EXAM_CONDUCTED'
  | 'ABC_CREDITS_TRANSFERRED';

export interface FourQuadrantCompleteness {
  quadrant1ETutorial: boolean;   // Video/Audio lectures & virtual simulations
  quadrant2EContent: boolean;     // e-Books, downloadable PDFs, references
  quadrant3WebResources: boolean; // Supplementary links, open access repositories
  quadrant4SelfAssessment: boolean; // MCQs, assignments, discussion forums
}

export interface MoocCourseRecord {
  courseId: string;
  trackingToken: string; // MOOC-[YEAR]-[DEPT]-[HEX6]
  courseTitle: string;
  department: string;
  leadCoordinatorName: string;
  leadCoordinatorEmpId: string;
  nationalCoordinator: MoocNationalCoordinator;
  contributionType: MoocContributionType;
  credits: number; // e.g. 2, 3, 4 credits
  totalModulesCount: number;
  durationWeeks: number; // e.g. 8, 12 weeks
  ugcApiPoints: number;
  stage: CourseLifecycleStage;
  quadrants: FourQuadrantCompleteness;
  enrolledLearnersCount: number;
  proctoredExamPassPercentage?: number; // e.g. 74.5%
  isAbcTransferEligible: boolean;
  swayamCourseUrl?: string;
  cryptographicCourseSeal?: string; // SHA-256 seal
  lastUpdated: string;
}

/**
 * Standard UGC CAS Table 2 (Category 3) MOOCs API Points:
 * - Development of complete 4-credit course: 20 points
 * - Development of complete 2-credit course: 10 points
 * - MOOC module / lecture development: 5 points per module
 * - Content writer / SME for single quadrant: 2 points per module
 * - Course Coordinator for 4-credit course: 8 points
 */
export const UGC_MOOC_API_POINTS_MATRIX: Record<MoocContributionType, number> = {
  FOUR_CREDIT_MOOC_COURSE: 20,
  TWO_CREDIT_MOOC_COURSE: 10,
  MOOC_MODULE_DEVELOPMENT: 5,
  CONTENT_WRITER_QUADRANT: 2,
  COURSE_COORDINATOR_4_CREDIT: 8,
};

export const MIN_PROCTORED_PASS_PERCENTAGE = 40.0;

/**
 * Evaluate 4-Quadrant Completeness percentage
 */
export function evaluateQuadrantCompleteness(quadrants: FourQuadrantCompleteness): number {
  let count = 0;
  if (quadrants.quadrant1ETutorial) count++;
  if (quadrants.quadrant2EContent) count++;
  if (quadrants.quadrant3WebResources) count++;
  if (quadrants.quadrant4SelfAssessment) count++;
  return (count / 4) * 100;
}

/**
 * Generate unique MOOC tracking token: MOOC-[YEAR]-[DEPT]-[HEX6]
 */
export function generateMoocToken(dept: string, year: number = new Date().getFullYear()): string {
  const cleanDept = dept.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'DEPT';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `MOOC-${year}-${cleanDept}-${randomHex}`;
}

/**
 * Generate tamper-proof SHA-256 seal for MOOC course record
 */
export function generateMoocCourseSeal(
  course: Omit<MoocCourseRecord, 'cryptographicCourseSeal'>
): string {
  const canonicalPayload = [
    course.courseId,
    course.trackingToken,
    course.courseTitle,
    course.department,
    course.leadCoordinatorEmpId,
    course.nationalCoordinator,
    course.contributionType,
    course.credits,
    course.ugcApiPoints,
    course.stage,
    evaluateQuadrantCompleteness(course.quadrants),
    course.enrolledLearnersCount,
    course.isAbcTransferEligible,
    course.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Author a new SWAYAM / NPTEL MOOC course proposal
 */
export function authorMoocCourse(params: {
  courseTitle: string;
  department: string;
  leadCoordinatorName: string;
  leadCoordinatorEmpId: string;
  nationalCoordinator: MoocNationalCoordinator;
  contributionType: MoocContributionType;
  credits: number;
  totalModulesCount: number;
  durationWeeks: number;
  quadrants?: Partial<FourQuadrantCompleteness>;
  swayamCourseUrl?: string;
}): MoocCourseRecord {
  if (!params.courseTitle.trim()) {
    throw new Error('Course title cannot be blank.');
  }

  if (params.credits <= 0) {
    throw new Error('Course credits must be strictly greater than 0.');
  }

  if (params.durationWeeks <= 0) {
    throw new Error('Duration weeks must be strictly greater than 0.');
  }

  const trackingToken = generateMoocToken(params.department);
  const now = new Date().toISOString();
  const ugcApiPoints = UGC_MOOC_API_POINTS_MATRIX[params.contributionType];

  const fullQuadrants: FourQuadrantCompleteness = {
    quadrant1ETutorial: params.quadrants?.quadrant1ETutorial ?? true,
    quadrant2EContent: params.quadrants?.quadrant2EContent ?? true,
    quadrant3WebResources: params.quadrants?.quadrant3WebResources ?? false,
    quadrant4SelfAssessment: params.quadrants?.quadrant4SelfAssessment ?? false,
  };

  const baseCourse: Omit<MoocCourseRecord, 'cryptographicCourseSeal'> = {
    courseId: `MOOC-${Date.now().toString(36).toUpperCase()}`,
    trackingToken,
    courseTitle: params.courseTitle.trim(),
    department: params.department,
    leadCoordinatorName: params.leadCoordinatorName.trim(),
    leadCoordinatorEmpId: params.leadCoordinatorEmpId.trim(),
    nationalCoordinator: params.nationalCoordinator,
    contributionType: params.contributionType,
    credits: params.credits,
    totalModulesCount: params.totalModulesCount,
    durationWeeks: params.durationWeeks,
    ugcApiPoints,
    stage: 'PROPOSAL_SUBMITTED',
    quadrants: fullQuadrants,
    enrolledLearnersCount: 0,
    isAbcTransferEligible: false,
    swayamCourseUrl: params.swayamCourseUrl,
    lastUpdated: now,
  };

  const cryptographicCourseSeal = generateMoocCourseSeal(baseCourse);
  return { ...baseCourse, cryptographicCourseSeal };
}

/**
 * Update 4-Quadrant E-Learning Content Completeness
 */
export function updateQuadrantContent(
  course: MoocCourseRecord,
  quadrants: FourQuadrantCompleteness
): MoocCourseRecord {
  const completeness = evaluateQuadrantCompleteness(quadrants);
  const nextStage: CourseLifecycleStage = completeness === 100 ? 'CONTENT_DEVELOPED' : course.stage;
  const now = new Date().toISOString();

  const updated: Omit<MoocCourseRecord, 'cryptographicCourseSeal'> = {
    ...course,
    stage: nextStage,
    quadrants,
    lastUpdated: now,
  };

  const cryptographicCourseSeal = generateMoocCourseSeal(updated);
  return { ...updated, cryptographicCourseSeal };
}

/**
 * Record End-Term Proctored Examination Results & verify ABC Credit Transfer
 */
export function recordProctoredExamResults(
  course: MoocCourseRecord,
  enrolledLearnersCount: number,
  proctoredExamPassPercentage: number
): MoocCourseRecord {
  if (course.stage !== 'CONTENT_DEVELOPED' && course.stage !== 'COURSE_LIVE_ON_SWAYAM') {
    throw new Error(`Cannot record examination results in stage '${course.stage}'. Course content must be developed.`);
  }

  if (proctoredExamPassPercentage < 0 || proctoredExamPassPercentage > 100) {
    throw new Error('Proctored exam pass percentage must be bounded between 0% and 100%.');
  }

  // Eligible for ABC credit transfer if pass rate >= 40% and all 4 quadrants complete
  const allQuadrantsReady = evaluateQuadrantCompleteness(course.quadrants) === 100;
  const isAbcTransferEligible = allQuadrantsReady && proctoredExamPassPercentage >= MIN_PROCTORED_PASS_PERCENTAGE;

  const now = new Date().toISOString();
  const updated: Omit<MoocCourseRecord, 'cryptographicCourseSeal'> = {
    ...course,
    stage: isAbcTransferEligible ? 'ABC_CREDITS_TRANSFERRED' : 'EXAM_CONDUCTED',
    enrolledLearnersCount,
    proctoredExamPassPercentage,
    isAbcTransferEligible,
    lastUpdated: now,
  };

  const cryptographicCourseSeal = generateMoocCourseSeal(updated);
  return { ...updated, cryptographicCourseSeal };
}

/**
 * Export Faculty MOOC Course Ledger as statutory CSV
 */
export function exportFacultyMoocCoursesCSV(courses: MoocCourseRecord[]): string {
  const headers = [
    'Course ID',
    'Tracking Token',
    'Course Title',
    'Department',
    'Lead Coordinator',
    'National Coordinator',
    'Contribution Type',
    'Credits',
    'Duration (Weeks)',
    'UGC API Points',
    'Stage',
    'Quadrant Completeness %',
    'Enrolled Learners',
    'Exam Pass %',
    'ABC Eligible',
    'Cryptographic Seal',
  ];

  const rows = courses.map((c) => {
    const completeness = evaluateQuadrantCompleteness(c.quadrants);
    return [
      `"${c.courseId}"`,
      `"${c.trackingToken}"`,
      `"${c.courseTitle.replace(/"/g, '""')}"`,
      `"${c.department.replace(/"/g, '""')}"`,
      `"${c.leadCoordinatorName.replace(/"/g, '""')}"`,
      `"${c.nationalCoordinator}"`,
      `"${c.contributionType}"`,
      c.credits,
      c.durationWeeks,
      c.ugcApiPoints,
      `"${c.stage}"`,
      `${completeness.toFixed(0)}%`,
      c.enrolledLearnersCount,
      c.proctoredExamPassPercentage !== undefined ? `${c.proctoredExamPassPercentage.toFixed(1)}%` : 'N/A',
      c.isAbcTransferEligible ? 'YES' : 'NO',
      `"${c.cryptographicCourseSeal || ''}"`,
    ];
  });

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Demonstration Faculty SWAYAM MOOC Courses
 */
export const INITIAL_MOOC_COURSES: MoocCourseRecord[] = [
  {
    courseId: 'MOOC-2026-001',
    trackingToken: 'MOOC-2026-CSED-8A1102',
    courseTitle: 'Cloud-Native Distributed Computing: Architecture, Kubernetes & Microservices',
    department: 'Computer Science & Engineering',
    leadCoordinatorName: 'Dr. Siddharth Sen',
    leadCoordinatorEmpId: 'EMP-CSE-042',
    nationalCoordinator: 'NPTEL',
    contributionType: 'FOUR_CREDIT_MOOC_COURSE',
    credits: 4,
    totalModulesCount: 12,
    durationWeeks: 12,
    ugcApiPoints: 20,
    stage: 'ABC_CREDITS_TRANSFERRED',
    quadrants: {
      quadrant1ETutorial: true,
      quadrant2EContent: true,
      quadrant3WebResources: true,
      quadrant4SelfAssessment: true,
    },
    enrolledLearnersCount: 4250,
    proctoredExamPassPercentage: 81.4,
    isAbcTransferEligible: true,
    swayamCourseUrl: 'https://swayam.gov.in/courses/cloud-native-distributed-computing',
    cryptographicCourseSeal: '8a11023847291048291847192837482910482918471928374829104829184710',
    lastUpdated: '2026-04-10T11:00:00Z',
  },
  {
    courseId: 'MOOC-2026-002',
    trackingToken: 'MOOC-2026-EEED-3B9014',
    courseTitle: 'Power Semiconductor Electronics & EV Traction Inverters',
    department: 'Electrical Engineering',
    leadCoordinatorName: 'Dr. Neha Kulkarni',
    leadCoordinatorEmpId: 'EMP-EEE-018',
    nationalCoordinator: 'CEC',
    contributionType: 'TWO_CREDIT_MOOC_COURSE',
    credits: 2,
    totalModulesCount: 8,
    durationWeeks: 8,
    ugcApiPoints: 10,
    stage: 'CONTENT_DEVELOPED',
    quadrants: {
      quadrant1ETutorial: true,
      quadrant2EContent: true,
      quadrant3WebResources: true,
      quadrant4SelfAssessment: true,
    },
    enrolledLearnersCount: 1820,
    isAbcTransferEligible: false,
    swayamCourseUrl: 'https://swayam.gov.in/courses/power-semiconductors-ev',
    cryptographicCourseSeal: '3b90143847291048291847192837482910482918471928374829104829184711',
    lastUpdated: '2026-05-02T15:30:00Z',
  },
];
