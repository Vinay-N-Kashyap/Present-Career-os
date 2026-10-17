/**
 * Faculty Course Syllabus & Semester Schedule Planner Engine (TASK-876)
 * 
 * Provides:
 * 1. 16-week semester syllabus decomposition mapped to NAAC/NBA Course Learning Outcomes (CLOs).
 * 2. Contact hour allocation invariants (Lecture + Tutorial + Practical: L-T-P credit structure).
 * 3. Weekly delivery tracking, syllabus completion velocity, and delay drift diagnostics.
 * 4. Multi-tenant isolation and regulatory accreditation lesson plan CSV export.
 */

export interface CourseLearningOutcome {
  cloId: string;
  code: string; // e.g. "CLO-1"
  description: string;
  bloomTaxonomyLevel: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE';
  mappedProgramOutcomes: string[]; // e.g. ["PO-1", "PO-2", "PO-3"]
}

export interface SyllabusModule {
  moduleId: string;
  moduleNumber: number;
  title: string;
  plannedLectureHours: number;
  plannedLabHours: number;
  learningOutcomes: string[]; // references CLO codes
  keyTopics: string[];
}

export interface WeeklyLessonPlan {
  weekNumber: number; // 1 to 16
  moduleId: string;
  theme: string;
  topicsCovered: string[];
  labPracticalTopics: string[];
  deliverableMilestone?: string;
  plannedHours: number;
  deliveredHours: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  facultyNotes?: string;
}

export interface CourseSyllabus {
  syllabusId: string;
  institutionId: string;
  facultyId: string;
  courseCode: string;
  courseTitle: string;
  department: string;
  semester: number;
  academicYear: string;
  totalCredits: number; // e.g. 4
  lectureCredits: number; // e.g. 3
  labCredits: number; // e.g. 1
  totalContactHours: number; // e.g. 60
  clos: CourseLearningOutcome[];
  modules: SyllabusModule[];
  weeklyPlan: WeeklyLessonPlan[];
  createdAt: string;
  updatedAt: string;
}

export interface SyllabusVelocityReport {
  syllabusId: string;
  courseCode: string;
  totalPlannedHours: number;
  totalDeliveredHours: number;
  completionPercentage: number;
  targetWeek: number;
  currentDeliveredWeek: number;
  isDrifting: boolean;
  driftHours: number; // negative indicates lagging
  status: 'ON_TRACK' | 'SLIGHT_DELAY' | 'CRITICAL_LAG';
  remedialRecommendation?: string;
}

/**
 * Creates and validates a comprehensive course syllabus
 */
export function createCourseSyllabus(params: {
  syllabusId?: string;
  institutionId: string;
  facultyId: string;
  courseCode: string;
  courseTitle: string;
  department: string;
  semester: number;
  academicYear: string;
  totalCredits: number;
  lectureCredits: number;
  labCredits: number;
  clos: CourseLearningOutcome[];
  modules: SyllabusModule[];
  weeklyPlan: WeeklyLessonPlan[];
}): CourseSyllabus {
  if (!params.institutionId || !params.facultyId || !params.courseCode) {
    throw new Error('MISSING_MANDATORY_SYLLABUS_FIELDS');
  }

  // Validate credit sum invariant: lectureCredits + labCredits === totalCredits
  if (params.lectureCredits + params.labCredits !== params.totalCredits) {
    throw new Error(
      `CREDIT_MISMATCH_INVARIANT: Lecture credits (${params.lectureCredits}) + Lab credits (${params.labCredits}) must equal Total credits (${params.totalCredits})`
    );
  }

  // 1 lecture credit = 15 contact hours; 1 lab credit = 30 contact hours
  const expectedTotalHours = (params.lectureCredits * 15) + (params.labCredits * 30);

  // Validate weekly plan contact hours sum
  const sumWeeklyPlannedHours = params.weeklyPlan.reduce((sum, w) => sum + w.plannedHours, 0);
  if (sumWeeklyPlannedHours !== expectedTotalHours) {
    throw new Error(
      `HOURS_ALLOCATION_INVARIANT: Sum of weekly planned hours (${sumWeeklyPlannedHours}) must match total contact hours (${expectedTotalHours})`
    );
  }

  // Validate 16-week semester structure
  if (params.weeklyPlan.length !== 16) {
    throw new Error(`SEMESTER_STRUCTURE_INVARIANT: Weekly plan must have exactly 16 weeks, got ${params.weeklyPlan.length}`);
  }

  const now = new Date().toISOString();

  return {
    syllabusId: params.syllabusId || `syl_${params.institutionId}_${params.courseCode}_${params.semester}`,
    institutionId: params.institutionId,
    facultyId: params.facultyId,
    courseCode: params.courseCode,
    courseTitle: params.courseTitle,
    department: params.department,
    semester: params.semester,
    academicYear: params.academicYear,
    totalCredits: params.totalCredits,
    lectureCredits: params.lectureCredits,
    labCredits: params.labCredits,
    totalContactHours: expectedTotalHours,
    clos: params.clos,
    modules: params.modules,
    weeklyPlan: params.weeklyPlan,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Updates delivery progress for a specific semester week
 */
export function recordWeeklyProgress(
  syllabus: CourseSyllabus,
  weekNumber: number,
  deliveredHours: number,
  facultyNotes?: string
): CourseSyllabus {
  const week = syllabus.weeklyPlan.find(w => w.weekNumber === weekNumber);
  if (!week) {
    throw new Error(`WEEK_NOT_FOUND: Week ${weekNumber} does not exist in syllabus`);
  }

  if (deliveredHours < 0) {
    throw new Error('DELIVERED_HOURS_NON_NEGATIVE');
  }

  week.deliveredHours = deliveredHours;
  if (facultyNotes !== undefined) {
    week.facultyNotes = facultyNotes;
  }

  if (deliveredHours >= week.plannedHours) {
    week.status = 'COMPLETED';
  } else if (deliveredHours > 0) {
    week.status = 'IN_PROGRESS';
  } else {
    week.status = 'DELAYED';
  }

  syllabus.updatedAt = new Date().toISOString();
  return syllabus;
}

/**
 * Computes syllabus delivery velocity and drift diagnostics against academic calendar target week
 */
export function computeSyllabusVelocity(
  syllabus: CourseSyllabus,
  targetCalendarWeek: number // where the semester calendar currently stands (1 to 16)
): SyllabusVelocityReport {
  if (targetCalendarWeek < 1 || targetCalendarWeek > 16) {
    throw new Error('INVALID_TARGET_CALENDAR_WEEK');
  }

  let expectedHoursByTargetWeek = 0;
  for (let i = 0; i < targetCalendarWeek; i++) {
    expectedHoursByTargetWeek += syllabus.weeklyPlan[i].plannedHours;
  }

  const totalPlannedHours = syllabus.totalContactHours;
  const totalDeliveredHours = syllabus.weeklyPlan.reduce((sum, w) => sum + w.deliveredHours, 0);

  const completionPercentage = totalPlannedHours > 0
    ? Math.round((totalDeliveredHours / totalPlannedHours) * 1000) / 10
    : 0;

  // Drift = Delivered Hours - Expected Hours by Target Week
  const driftHours = totalDeliveredHours - expectedHoursByTargetWeek;

  let currentDeliveredWeek = 0;
  let accumulatedDelivered = 0;
  for (const w of syllabus.weeklyPlan) {
    accumulatedDelivered += w.deliveredHours;
    if (accumulatedDelivered >= expectedHoursByTargetWeek) {
      currentDeliveredWeek = w.weekNumber;
      break;
    }
    if (w.deliveredHours > 0) {
      currentDeliveredWeek = w.weekNumber;
    }
  }

  let status: SyllabusVelocityReport['status'] = 'ON_TRACK';
  let isDrifting = false;
  let remedialRecommendation: string | undefined;

  // Lagging by more than 6 hours (~1.5 weeks) is CRITICAL
  if (driftHours <= -6) {
    status = 'CRITICAL_LAG';
    isDrifting = true;
    remedialRecommendation = `CRITICAL: Schedule ${Math.abs(driftHours)} extra lab/tutorial hours to bridge syllabus gap before Midterms`;
  } else if (driftHours < 0) {
    status = 'SLIGHT_DELAY';
    isDrifting = true;
    remedialRecommendation = `Minor lag of ${Math.abs(driftHours)} hours. Accelerate introductory topics in upcoming sessions`;
  }

  return {
    syllabusId: syllabus.syllabusId,
    courseCode: syllabus.courseCode,
    totalPlannedHours,
    totalDeliveredHours,
    completionPercentage,
    targetWeek: targetCalendarWeek,
    currentDeliveredWeek,
    isDrifting,
    driftHours,
    status,
    remedialRecommendation,
  };
}

/**
 * Standardized NAAC / NBA Lesson Plan CSV Export Engine
 */
export function exportLessonPlanCSV(syllabus: CourseSyllabus): string {
  const headers = [
    'Week_Number',
    'Course_Code',
    'Module_ID',
    'Theme',
    'Lecture_Topics',
    'Lab_Practicals',
    'Planned_Hours',
    'Delivered_Hours',
    'Status',
    'Faculty_Notes',
  ];

  const rows = syllabus.weeklyPlan.map(w => [
    w.weekNumber,
    `"${syllabus.courseCode}"`,
    `"${w.moduleId}"`,
    `"${w.theme.replace(/"/g, '""')}"`,
    `"${w.topicsCovered.join('; ').replace(/"/g, '""')}"`,
    `"${w.labPracticalTopics.join('; ').replace(/"/g, '""')}"`,
    w.plannedHours,
    w.deliveredHours,
    `"${w.status}"`,
    `"${(w.facultyNotes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
