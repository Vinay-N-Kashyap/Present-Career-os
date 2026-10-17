/**
 * Dean Department Performance & Faculty Workload Analytics Engine (TASK-881)
 * 
 * Provides:
 * 1. Multi-metric Department Performance Index (DPI: 0-100 scale) synthesizing Placement Rate,
 *    Cohort CGPA, Attendance Reliability, Student Feedback, and Student-to-Faculty Ratio (SFR).
 * 2. Faculty workload imbalance detection (overload vs under-allocation based on AICTE/UGC norms).
 * 3. Course and departmental health status categorization (EXCELLENT, SATISFACTORY, NEEDS_ATTENTION).
 * 4. Multi-tenant isolation and regulatory dean report CSV export.
 */

export type FacultyDesignation = 'PROFESSOR' | 'ASSOCIATE_PROF' | 'ASSISTANT_PROF';

export interface FacultyMember {
  facultyId: string;
  institutionId: string;
  name: string;
  department: string;
  designation: FacultyDesignation;
  teachingHoursPerWeek: number;
  labHoursPerWeek: number;
  mentoredStudentsCount: number;
  studentFeedbackRating: number; // 0.0 to 5.0 scale
}

export interface CourseHealthSummary {
  courseCode: string;
  courseTitle: string;
  department: string;
  enrolledStudents: number;
  averagePassRate: number; // percentage
  averageAttendanceRate: number; // percentage
  syllabusCoverageRate: number; // percentage
  status: 'EXCELLENT' | 'SATISFACTORY' | 'AT_RISK';
}

export interface DepartmentSummaryReport {
  department: string;
  institutionId: string;
  totalStudents: number;
  totalFaculty: number;
  studentFacultyRatio: number; // e.g. 15.2
  sfrCompliant: boolean; // SFR <= 15:1 for NBA Tier 1 / 20:1 for NAAC
  averageCGPA: number;
  averageAttendancePercentage: number;
  placementPercentage: number;
  averageFacultyFeedback: number; // out of 5.0
  departmentPerformanceIndex: number; // 0 to 100
  healthStatus: 'EXCELLENT' | 'SATISFACTORY' | 'NEEDS_ATTENTION';
  overloadedFacultyCount: number;
  actionRecommendations: string[];
}

/** Max teaching hour guidelines by AICTE/UGC norms */
export const MAX_TEACHING_HOURS: Record<FacultyDesignation, number> = {
  PROFESSOR: 14,
  ASSOCIATE_PROF: 16,
  ASSISTANT_PROF: 18,
};

/**
 * Evaluates individual faculty member workload compliance
 */
export function evaluateFacultyWorkload(faculty: FacultyMember): {
  isOverloaded: boolean;
  totalHours: number;
  maxRecommended: number;
  variance: number;
} {
  const totalHours = faculty.teachingHoursPerWeek + faculty.labHoursPerWeek;
  const maxRecommended = MAX_TEACHING_HOURS[faculty.designation];
  const variance = totalHours - maxRecommended;

  return {
    isOverloaded: variance > 0,
    totalHours,
    maxRecommended,
    variance,
  };
}

/**
 * Computes Department Performance Index (DPI: 0-100) and actionable dean insights
 */
export function computeDepartmentAnalytics(params: {
  department: string;
  institutionId: string;
  studentsCount: number;
  cohortAverageCGPA: number; // 0 to 10 scale
  averageAttendance: number; // 0 to 100 percentage
  placementRate: number; // 0 to 100 percentage
  facultyList: FacultyMember[];
  courses: CourseHealthSummary[];
}): DepartmentSummaryReport {
  const {
    department,
    institutionId,
    studentsCount,
    cohortAverageCGPA,
    averageAttendance,
    placementRate,
    facultyList,
    courses,
  } = params;

  if (studentsCount < 0) {
    throw new Error('STUDENTS_COUNT_NON_NEGATIVE');
  }

  // Filter faculty by institution and department
  const deptFaculty = facultyList.filter(
    f => f.institutionId === institutionId && f.department.toLowerCase() === department.toLowerCase()
  );

  const totalFaculty = deptFaculty.length;
  const sfr = totalFaculty > 0 ? Math.round((studentsCount / totalFaculty) * 10) / 10 : 0;
  const sfrCompliant = sfr > 0 && sfr <= 20;

  // Workload analysis
  let overloadedFacultyCount = 0;
  let totalFeedback = 0;

  for (const f of deptFaculty) {
    const workload = evaluateFacultyWorkload(f);
    if (workload.isOverloaded) {
      overloadedFacultyCount++;
    }
    totalFeedback += Math.min(5, Math.max(0, f.studentFeedbackRating));
  }

  const avgFeedback = totalFaculty > 0 ? Math.round((totalFeedback / totalFaculty) * 10) / 10 : 0;

  // Compute Department Performance Index (DPI)
  // Weights: Placement (25%), CGPA scaled to 100 (25%), Attendance (20%), Feedback scaled to 100 (15%), SFR score (15%)
  const placementComponent = Math.min(100, Math.max(0, placementRate)) * 0.25;
  const cgpaComponent = Math.min(100, Math.max(0, cohortAverageCGPA * 10)) * 0.25;
  const attendanceComponent = Math.min(100, Math.max(0, averageAttendance)) * 0.20;
  const feedbackComponent = Math.min(100, (avgFeedback / 5.0) * 100) * 0.15;
  
  // SFR score: 15:1 or better = 100, 20:1 = 75, > 25:1 = 40
  let sfrScore = 50;
  if (sfr > 0 && sfr <= 15) sfrScore = 100;
  else if (sfr <= 20) sfrScore = 75;
  else if (sfr <= 25) sfrScore = 60;
  else sfrScore = 30;

  const sfrComponent = sfrScore * 0.15;

  const rawDPI = placementComponent + cgpaComponent + attendanceComponent + feedbackComponent + sfrComponent;
  const dpi = Math.round(rawDPI * 10) / 10;

  let healthStatus: DepartmentSummaryReport['healthStatus'] = 'SATISFACTORY';
  if (dpi >= 85) {
    healthStatus = 'EXCELLENT';
  } else if (dpi < 70) {
    healthStatus = 'NEEDS_ATTENTION';
  }

  // Recommendations
  const actionRecommendations: string[] = [];
  if (!sfrCompliant && totalFaculty > 0) {
    actionRecommendations.push(`Recruit ${Math.ceil(studentsCount / 15 - totalFaculty)} additional faculty to achieve 15:1 NBA SFR compliance`);
  }
  if (overloadedFacultyCount > 0) {
    actionRecommendations.push(`Rebalance workload: ${overloadedFacultyCount} faculty member(s) exceed AICTE max weekly contact hour limits`);
  }
  if (placementRate < 75) {
    actionRecommendations.push(`Accelerate capstone project reviews: Placement rate (${placementRate}%) is below institutional 75% target`);
  }
  if (averageAttendance < 75) {
    actionRecommendations.push(`Trigger parent early-warning notices: Department attendance (${averageAttendance}%) has dropped below regulatory 75% threshold`);
  }

  // Flag any courses at risk
  const atRiskCourses = courses.filter(c => c.status === 'AT_RISK');
  if (atRiskCourses.length > 0) {
    actionRecommendations.push(`Remedial action needed for ${atRiskCourses.length} at-risk course(s): ${atRiskCourses.map(c => c.courseCode).join(', ')}`);
  }

  return {
    department,
    institutionId,
    totalStudents: studentsCount,
    totalFaculty,
    studentFacultyRatio: sfr,
    sfrCompliant,
    averageCGPA: cohortAverageCGPA,
    averageAttendancePercentage: averageAttendance,
    placementPercentage: placementRate,
    averageFacultyFeedback: avgFeedback,
    departmentPerformanceIndex: dpi,
    healthStatus,
    overloadedFacultyCount,
    actionRecommendations,
  };
}

/**
 * Standardized Department Performance CSV Export
 */
export function exportDepartmentAnalyticsCSV(reports: DepartmentSummaryReport[]): string {
  const headers = [
    'Department',
    'Institution_ID',
    'Total_Students',
    'Total_Faculty',
    'SFR_Ratio',
    'SFR_Compliant',
    'Average_CGPA',
    'Average_Attendance_Pct',
    'Placement_Pct',
    'Faculty_Feedback_Rating',
    'DPI_Score',
    'Health_Status',
    'Overloaded_Faculty_Count',
  ];

  const rows = reports.map(r => [
    `"${r.department}"`,
    `"${r.institutionId}"`,
    r.totalStudents,
    r.totalFaculty,
    r.studentFacultyRatio,
    r.sfrCompliant ? 'YES' : 'NO',
    r.averageCGPA,
    r.averageAttendancePercentage,
    r.placementPercentage,
    r.averageFacultyFeedback,
    r.departmentPerformanceIndex,
    `"${r.healthStatus}"`,
    r.overloadedFacultyCount,
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}
