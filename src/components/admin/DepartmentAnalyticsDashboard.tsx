'use client';

import React, { useState } from 'react';
import {
  FacultyMember,
  CourseHealthSummary,
  computeDepartmentAnalytics,
  exportDepartmentAnalyticsCSV,
  evaluateFacultyWorkload,
  DepartmentSummaryReport,
} from '@/lib/admin/departmentAnalytics';

interface DepartmentAnalyticsDashboardProps {
  institutionId?: string;
}

const MOCK_FACULTY: FacultyMember[] = [
  {
    facultyId: 'fac-01',
    institutionId: 'inst-apex-001',
    name: 'Dr. Ramesh Sundaram',
    department: 'Computer Science',
    designation: 'PROFESSOR',
    teachingHoursPerWeek: 12,
    labHoursPerWeek: 4, // total 16 > 14 (Overloaded)
    mentoredStudentsCount: 22,
    studentFeedbackRating: 4.8,
  },
  {
    facultyId: 'fac-02',
    institutionId: 'inst-apex-001',
    name: 'Dr. Shalini Gupta',
    department: 'Computer Science',
    designation: 'ASSOCIATE_PROF',
    teachingHoursPerWeek: 12,
    labHoursPerWeek: 2, // total 14 <= 16 (Compliant)
    mentoredStudentsCount: 18,
    studentFeedbackRating: 4.6,
  },
  {
    facultyId: 'fac-03',
    institutionId: 'inst-apex-001',
    name: 'Prof. Ankit Mehta',
    department: 'Computer Science',
    designation: 'ASSISTANT_PROF',
    teachingHoursPerWeek: 14,
    labHoursPerWeek: 6, // total 20 > 18 (Overloaded)
    mentoredStudentsCount: 15,
    studentFeedbackRating: 4.2,
  },
  {
    facultyId: 'fac-04',
    institutionId: 'inst-apex-001',
    name: 'Prof. Priya Nair',
    department: 'Computer Science',
    designation: 'ASSISTANT_PROF',
    teachingHoursPerWeek: 12,
    labHoursPerWeek: 4, // total 16 <= 18 (Compliant)
    mentoredStudentsCount: 14,
    studentFeedbackRating: 4.5,
  },
  {
    facultyId: 'fac-05',
    institutionId: 'inst-apex-001',
    name: 'Dr. Arvind Joshi',
    department: 'Information Technology',
    designation: 'PROFESSOR',
    teachingHoursPerWeek: 10,
    labHoursPerWeek: 2, // total 12 <= 14 (Compliant)
    mentoredStudentsCount: 20,
    studentFeedbackRating: 4.7,
  },
  {
    facultyId: 'fac-06',
    institutionId: 'inst-apex-001',
    name: 'Prof. Neha Sen',
    department: 'Information Technology',
    designation: 'ASSISTANT_PROF',
    teachingHoursPerWeek: 14,
    labHoursPerWeek: 3, // total 17 <= 18 (Compliant)
    mentoredStudentsCount: 15,
    studentFeedbackRating: 4.3,
  },
];

const MOCK_COURSES: CourseHealthSummary[] = [
  {
    courseCode: 'CS401',
    courseTitle: 'Distributed Systems & Cloud Computing',
    department: 'Computer Science',
    enrolledStudents: 120,
    averagePassRate: 88,
    averageAttendanceRate: 84,
    syllabusCoverageRate: 92,
    status: 'EXCELLENT',
  },
  {
    courseCode: 'CS402',
    courseTitle: 'Advanced Operating Systems Internals',
    department: 'Computer Science',
    enrolledStudents: 115,
    averagePassRate: 64,
    averageAttendanceRate: 71,
    syllabusCoverageRate: 78,
    status: 'AT_RISK',
  },
  {
    courseCode: 'CS403',
    courseTitle: 'Full-Stack Web Architectures',
    department: 'Computer Science',
    enrolledStudents: 124,
    averagePassRate: 94,
    averageAttendanceRate: 89,
    syllabusCoverageRate: 96,
    status: 'EXCELLENT',
  },
  {
    courseCode: 'IT301',
    courseTitle: 'Network Security & Cryptography',
    department: 'Information Technology',
    enrolledStudents: 90,
    averagePassRate: 82,
    averageAttendanceRate: 80,
    syllabusCoverageRate: 85,
    status: 'SATISFACTORY',
  },
];

export const DepartmentAnalyticsDashboard: React.FC<DepartmentAnalyticsDashboardProps> = ({
  institutionId = 'inst-apex-001',
}) => {
  const [selectedDept, setSelectedDept] = useState<'Computer Science' | 'Information Technology'>('Computer Science');
  const [studentsCount, setStudentsCount] = useState<number>(selectedDept === 'Computer Science' ? 64 : 32);
  const [avgCGPA, setAvgCGPA] = useState<number>(8.2);
  const [attendanceRate, setAttendanceRate] = useState<number>(81.5);
  const [placementRate, setPlacementRate] = useState<number>(86.4);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Department report calculation
  const report: DepartmentSummaryReport = computeDepartmentAnalytics({
    department: selectedDept,
    institutionId,
    studentsCount,
    cohortAverageCGPA: avgCGPA,
    averageAttendance: attendanceRate,
    placementRate,
    facultyList: MOCK_FACULTY,
    courses: MOCK_COURSES,
  });

  const deptFaculty = MOCK_FACULTY.filter(
    f => f.institutionId === institutionId && f.department.toLowerCase() === selectedDept.toLowerCase()
  );

  const deptCourses = MOCK_COURSES.filter(
    c => c.department.toLowerCase() === selectedDept.toLowerCase()
  );

  const handleDownloadCSV = () => {
    // Generate reports for both departments for institution-wide export
    const csReport = computeDepartmentAnalytics({
      department: 'Computer Science',
      institutionId,
      studentsCount: 64,
      cohortAverageCGPA: 8.2,
      averageAttendance: 81.5,
      placementRate: 86.4,
      facultyList: MOCK_FACULTY,
      courses: MOCK_COURSES,
    });

    const itReport = computeDepartmentAnalytics({
      department: 'Information Technology',
      institutionId,
      studentsCount: 32,
      cohortAverageCGPA: 7.9,
      averageAttendance: 79.2,
      placementRate: 82.0,
      facultyList: MOCK_FACULTY,
      courses: MOCK_COURSES,
    });

    const csvData = exportDepartmentAnalyticsCSV([csReport, itReport]);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Department_Analytics_${institutionId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice('Dean Department Analytics CSV exported successfully.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const statusColor = {
    EXCELLENT: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    SATISFACTORY: 'text-blue-400 bg-blue-950/40 border-blue-500/30',
    NEEDS_ATTENTION: 'text-rose-400 bg-rose-950/40 border-rose-500/30',
  }[report.healthStatus];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xl font-bold">
              📊
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">
                Department Performance & Faculty Workload Analytics
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Institutional Dean cockpit synthesizing DPI, AICTE faculty workload, course risk, and NBA/NAAC SFR compliance.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <span>📥</span> Export Dean Report CSV
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-sm rounded-lg flex items-center gap-2">
          <span>✓</span> {exportNotice}
        </div>
      )}

      {/* Control panel: Department switch & simulation sliders */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Department Scope
          </label>
          <select
            value={selectedDept}
            onChange={(e) => {
              const val = e.target.value as 'Computer Science' | 'Information Technology';
              setSelectedDept(val);
              setStudentsCount(val === 'Computer Science' ? 64 : 32);
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="Computer Science">Computer Science & Engineering</option>
            <option value="Information Technology">Information Technology</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Enrolled Students ({studentsCount})
          </label>
          <input
            type="range"
            min="10"
            max="120"
            value={studentsCount}
            onChange={(e) => setStudentsCount(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Placement Rate: {placementRate}%
          </label>
          <input
            type="range"
            min="40"
            max="100"
            step="0.5"
            value={placementRate}
            onChange={(e) => setPlacementRate(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Attendance Rate: {attendanceRate}%
          </label>
          <input
            type="range"
            min="50"
            max="100"
            step="0.5"
            value={attendanceRate}
            onChange={(e) => setAttendanceRate(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Main KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Department Performance Index (DPI) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>DPI INDEX (0-100)</span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${statusColor}`}>
              {report.healthStatus}
            </span>
          </div>
          <div className="my-3">
            <div className="text-4xl font-extrabold text-slate-100">
              {report.departmentPerformanceIndex}
              <span className="text-lg font-normal text-slate-500"> / 100</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full ${
                  report.departmentPerformanceIndex >= 85
                    ? 'bg-emerald-500'
                    : report.departmentPerformanceIndex >= 70
                    ? 'bg-blue-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, report.departmentPerformanceIndex))}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Synthesizes Placement, CGPA, Attendance, SFR, and Feedback ratings.
          </div>
        </div>

        {/* Student-to-Faculty Ratio (SFR) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>STUDENT-FACULTY RATIO</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                report.sfrCompliant
                  ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
                  : 'text-amber-400 bg-amber-950/40 border-amber-500/30'
              }`}
            >
              {report.sfrCompliant ? 'NBA COMPLIANT' : 'SFR DEFICIT'}
            </span>
          </div>
          <div className="my-3">
            <div className="text-4xl font-extrabold text-slate-100">
              {report.studentFacultyRatio}:1
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {report.totalStudents} students / {report.totalFaculty} active faculty
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Target: &le; 15:1 for NBA Tier 1 / &le; 20:1 for NAAC accreditation.
          </div>
        </div>

        {/* Cohort Academics & Feedback */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">
            <span>ACADEMIC HEALTH & FEEDBACK</span>
          </div>
          <div className="my-3 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Cohort CGPA</span>
              <span className="text-xl font-bold text-slate-100">{report.averageCGPA} / 10</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Faculty Feedback</span>
              <span className="text-xl font-bold text-amber-400">{report.averageFacultyFeedback} ★ / 5.0</span>
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Audited across end-semester outcome examinations.
          </div>
        </div>

        {/* Faculty Workload Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>WORKLOAD BALANCE</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                report.overloadedFacultyCount === 0
                  ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
                  : 'text-rose-400 bg-rose-950/40 border-rose-500/30'
              }`}
            >
              {report.overloadedFacultyCount === 0 ? 'BALANCED' : `${report.overloadedFacultyCount} OVERLOADED`}
            </span>
          </div>
          <div className="my-3">
            <div className="text-4xl font-extrabold text-slate-100">
              {report.overloadedFacultyCount} / {report.totalFaculty}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Faculty exceeding AICTE contact hour maximums.
            </div>
          </div>
          <div className="text-xs text-slate-400">
            AICTE: Prof &le; 14h, Assoc &le; 16h, Asst &le; 18h per week.
          </div>
        </div>
      </div>

      {/* Action Recommendations Banner */}
      {report.actionRecommendations.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-5">
          <h2 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span>⚠️</span> Dean Governance Action Recommendations
          </h2>
          <ul className="space-y-1.5 text-sm text-amber-200/90 pl-5 list-disc">
            {report.actionRecommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Two columns: Faculty workload roster & Course health radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty workload roster */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100">
              Faculty Workload Allocation ({deptFaculty.length} Instructors)
            </h2>
            <span className="text-xs text-slate-400">AICTE Guideline Check</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Faculty</th>
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Hours (L+P)</th>
                  <th className="py-2.5 px-3">Rating</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {deptFaculty.map(f => {
                  const workload = evaluateFacultyWorkload(f);
                  return (
                    <tr key={f.facultyId} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-medium text-slate-200">
                        {f.name}
                      </td>
                      <td className="py-2.5 px-3 text-xs text-slate-400">
                        {f.designation.replace('_', ' ')}
                      </td>
                      <td className="py-2.5 px-3 text-xs">
                        <span className="font-semibold">{workload.totalHours} hrs</span>
                        <span className="text-slate-500"> / {workload.maxRecommended}h max</span>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-amber-400 font-semibold">
                        {f.studentFeedbackRating} ★
                      </td>
                      <td className="py-2.5 px-3 text-xs">
                        {workload.isOverloaded ? (
                          <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-500/30 font-medium">
                            +{workload.variance}h Overload
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-medium">
                            Compliant
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Course Health and Syllabus Velocity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100">
              Course Health & Pass Rate Radar ({deptCourses.length} Courses)
            </h2>
            <span className="text-xs text-slate-400">End-Semester Tracking</span>
          </div>

          <div className="space-y-3">
            {deptCourses.map(course => (
              <div
                key={course.courseCode}
                className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-500/30">
                      {course.courseCode}
                    </span>
                    <span className="text-sm font-semibold text-slate-200">
                      {course.courseTitle}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Enrolled: {course.enrolledStudents}</span>
                    <span>•</span>
                    <span>Pass: {course.averagePassRate}%</span>
                    <span>•</span>
                    <span>Attendance: {course.averageAttendanceRate}%</span>
                    <span>•</span>
                    <span>Coverage: {course.syllabusCoverageRate}%</span>
                  </div>
                </div>

                <div>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                      course.status === 'EXCELLENT'
                        ? 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30'
                        : course.status === 'SATISFACTORY'
                        ? 'text-blue-400 bg-blue-950/50 border-blue-500/30'
                        : 'text-rose-400 bg-rose-950/50 border-rose-500/30'
                    }`}
                  >
                    {course.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentAnalyticsDashboard;
