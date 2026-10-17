/**
 * Department Analytics & Grievance Redressal Verification Audit Suite (TASK-885)
 * 
 * Verifies:
 * 1. DPI Index (0-100) mathematical invariants, SFR boundaries, and health status mapping.
 * 2. AICTE/UGC faculty workload limits, overload detection, and dean recommendation generation.
 * 3. Student Grievance 5-stage lifecycle and anonymous PII redaction barrier.
 * 4. 15-day statutory SLA watchdog compliance and overdue escalation flags.
 * 5. Strict multi-tenant isolation and Ombudsman compliance CSV generation.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  FacultyMember,
  CourseHealthSummary,
  computeDepartmentAnalytics,
  evaluateFacultyWorkload,
  exportDepartmentAnalyticsCSV,
  MAX_TEACHING_HOURS,
} from '../src/lib/admin/departmentAnalytics.js';
import {
  grievanceStore,
  evaluateSlaCompliance,
  exportGrievanceAuditCSV,
  GrievanceRecord,
} from '../src/lib/admin/grievance.js';

describe('TASK-885: Department Analytics & Grievance Redressal Audit Suite', () => {
  beforeEach(() => {
    grievanceStore.clear();
  });

  const MOCK_FACULTY_POOL: FacultyMember[] = [
    {
      facultyId: 'fac-prof-1',
      institutionId: 'inst-apex-001',
      name: 'Dr. C. Ramanathan',
      department: 'Computer Science',
      designation: 'PROFESSOR',
      teachingHoursPerWeek: 12,
      labHoursPerWeek: 4, // 16h > 14h limit (Overloaded +2h)
      mentoredStudentsCount: 20,
      studentFeedbackRating: 4.8,
    },
    {
      facultyId: 'fac-assoc-2',
      institutionId: 'inst-apex-001',
      name: 'Dr. Meera Iyer',
      department: 'Computer Science',
      designation: 'ASSOCIATE_PROF',
      teachingHoursPerWeek: 10,
      labHoursPerWeek: 4, // 14h <= 16h limit (Compliant)
      mentoredStudentsCount: 15,
      studentFeedbackRating: 4.6,
    },
    {
      facultyId: 'fac-asst-3',
      institutionId: 'inst-apex-001',
      name: 'Prof. Ankit Shah',
      department: 'Computer Science',
      designation: 'ASSISTANT_PROF',
      teachingHoursPerWeek: 14,
      labHoursPerWeek: 6, // 20h > 18h limit (Overloaded +2h)
      mentoredStudentsCount: 12,
      studentFeedbackRating: 4.2,
    },
  ];

  const MOCK_COURSE_LIST: CourseHealthSummary[] = [
    {
      courseCode: 'CS401',
      courseTitle: 'Distributed Systems',
      department: 'Computer Science',
      enrolledStudents: 60,
      averagePassRate: 92,
      averageAttendanceRate: 88,
      syllabusCoverageRate: 95,
      status: 'EXCELLENT',
    },
    {
      courseCode: 'CS402',
      courseTitle: 'Compilers',
      department: 'Computer Science',
      enrolledStudents: 58,
      averagePassRate: 62,
      averageAttendanceRate: 70,
      syllabusCoverageRate: 75,
      status: 'AT_RISK',
    },
  ];

  it('evaluates individual faculty workload limits against AICTE standards', () => {
    const profWorkload = evaluateFacultyWorkload(MOCK_FACULTY_POOL[0]);
    assert.strictEqual(profWorkload.isOverloaded, true);
    assert.strictEqual(profWorkload.totalHours, 16);
    assert.strictEqual(profWorkload.maxRecommended, MAX_TEACHING_HOURS.PROFESSOR); // 14
    assert.strictEqual(profWorkload.variance, 2);

    const assocWorkload = evaluateFacultyWorkload(MOCK_FACULTY_POOL[1]);
    assert.strictEqual(assocWorkload.isOverloaded, false);
    assert.strictEqual(assocWorkload.totalHours, 14);
    assert.strictEqual(assocWorkload.maxRecommended, MAX_TEACHING_HOURS.ASSOCIATE_PROF); // 16
    assert.strictEqual(assocWorkload.variance, -2);
  });

  it('computes Department Performance Index (DPI) and triggers remedial actions', () => {
    const report = computeDepartmentAnalytics({
      department: 'Computer Science',
      institutionId: 'inst-apex-001',
      studentsCount: 60,
      cohortAverageCGPA: 8.5,
      averageAttendance: 82,
      placementRate: 88,
      facultyList: MOCK_FACULTY_POOL,
      courses: MOCK_COURSE_LIST,
    });

    assert.strictEqual(report.department, 'Computer Science');
    assert.strictEqual(report.totalFaculty, 3);
    assert.strictEqual(report.studentFacultyRatio, 20); // 60 / 3 = 20
    assert.strictEqual(report.sfrCompliant, true); // <= 20
    assert.strictEqual(report.overloadedFacultyCount, 2); // prof-1 and asst-3
    assert.ok(report.departmentPerformanceIndex >= 0 && report.departmentPerformanceIndex <= 100);
    assert.strictEqual(report.departmentPerformanceIndex, 84.4);
    assert.strictEqual(report.healthStatus, 'SATISFACTORY'); // 84.4 is in the 70-84.9 SATISFACTORY bracket

    // Action recommendations should flag the overloaded faculty and at-risk course CS402
    assert.ok(report.actionRecommendations.some(r => r.includes('Rebalance workload: 2 faculty member(s)')));
    assert.ok(report.actionRecommendations.some(r => r.includes('CS402')));

    // Rejects negative student counts
    assert.throws(() => {
      computeDepartmentAnalytics({
        department: 'Computer Science',
        institutionId: 'inst-apex-001',
        studentsCount: -5,
        cohortAverageCGPA: 8.0,
        averageAttendance: 80,
        placementRate: 80,
        facultyList: MOCK_FACULTY_POOL,
        courses: MOCK_COURSE_LIST,
      });
    }, /STUDENTS_COUNT_NON_NEGATIVE/);
  });

  it('exports valid CSV reports for departmental performance', () => {
    const report = computeDepartmentAnalytics({
      department: 'Computer Science',
      institutionId: 'inst-apex-001',
      studentsCount: 45,
      cohortAverageCGPA: 8.0,
      averageAttendance: 85,
      placementRate: 90,
      facultyList: MOCK_FACULTY_POOL,
      courses: MOCK_COURSE_LIST,
    });

    const csv = exportDepartmentAnalyticsCSV([report]);
    assert.ok(csv.includes('Department,Institution_ID,Total_Students'));
    assert.ok(csv.includes('"Computer Science","inst-apex-001",45,3,15,YES'));
  });

  it('enforces zero-knowledge anonymity and PII redaction for student grievances', () => {
    // 1. Submit Anonymous Grievance
    const anonGrievance = grievanceStore.submit({
      institutionId: 'inst-apex-001',
      category: 'HARASSMENT_OR_DISCRIMINATION',
      severity: 'CRITICAL',
      subject: 'Lab viva harassment grievance',
      description: 'Discriminatory comments during practical examination.',
      isAnonymous: true,
      studentId: 'stu-apex-012',
      studentName: 'Rohan Varma',
      studentEmail: 'rohan@apex.edu',
      department: 'Computer Science',
    });

    // PII MUST be completely redacted
    assert.strictEqual(anonGrievance.isAnonymous, true);
    assert.strictEqual(anonGrievance.studentId, undefined);
    assert.strictEqual(anonGrievance.studentEmail, undefined);
    assert.strictEqual(anonGrievance.studentName, 'Confidential / Anonymous');
    assert.ok(anonGrievance.trackingToken.startsWith('GRV-'));

    // Student can track resolution with token
    const fetched = grievanceStore.trackByToken(anonGrievance.trackingToken);
    assert.ok(fetched);
    assert.strictEqual(fetched?.subject, 'Lab viva harassment grievance');
    assert.strictEqual(fetched?.studentId, undefined);

    // 2. Submit Non-Anonymous Grievance
    const nonAnon = grievanceStore.submit({
      institutionId: 'inst-apex-001',
      category: 'ACADEMIC',
      severity: 'LOW',
      subject: 'Grade correction request',
      description: 'Total marks summation error in assignment 2.',
      isAnonymous: false,
      studentId: 'stu-apex-055',
      studentName: 'Priya Verma',
      studentEmail: 'priya@apex.edu',
      department: 'Computer Science',
    });

    assert.strictEqual(nonAnon.isAnonymous, false);
    assert.strictEqual(nonAnon.studentId, 'stu-apex-055');
    assert.strictEqual(nonAnon.studentName, 'Priya Verma');
  });

  it('manages 5-stage lifecycle, scheduled hearings, and Action Taken Reports (ATR)', () => {
    const grievance = grievanceStore.submit({
      institutionId: 'inst-apex-001',
      category: 'FEE_OR_FINANCIAL',
      severity: 'HIGH',
      subject: 'Excess lab deposit refund delay',
      description: 'Security deposit refund pending for over 60 days post graduation.',
      isAnonymous: false,
      studentId: 'stu-apex-088',
      studentName: 'Aditya Sen',
      department: 'Information Technology',
    });

    assert.strictEqual(grievance.status, 'SUBMITTED');

    // Schedule hearing
    const hearingScheduled = grievanceStore.scheduleHearing({
      grievanceId: grievance.grievanceId,
      institutionId: 'inst-apex-001',
      hearing: {
        hearingDate: '2026-10-30T10:00:00Z',
        locationOrMeetingLink: 'Finance Ombudsman Chamber Room 102',
        committeeChair: 'Prof. S. Swaminathan (Treasurer)',
        committeeMembers: ['Registrar', 'Student Union Secretary'],
        notes: 'Review ledger proof of payment and release bank demand draft.',
      },
    });

    assert.strictEqual(hearingScheduled.status, 'HEARING_SCHEDULED');
    assert.strictEqual(hearingScheduled.hearingDetails?.committeeChair, 'Prof. S. Swaminathan (Treasurer)');

    // Resolve grievance with ATR
    const resolved = grievanceStore.resolveGrievance({
      grievanceId: grievance.grievanceId,
      institutionId: 'inst-apex-001',
      actionAuthor: 'Chief Financial Officer',
      resolutionSummary: 'Refund voucher verified and electronic fund transfer initiated via RTGS.',
    });

    assert.strictEqual(resolved.status, 'ACTION_TAKEN');
    assert.strictEqual(resolved.actionTakenReport?.actionAuthor, 'Chief Financial Officer');
    assert.strictEqual(resolved.isOverdue, false); // Resolving clears overdue flag
  });

  it('evaluates 15-day statutory SLA compliance and overdue escalation', () => {
    // Current date test
    const freshSla = evaluateSlaCompliance(new Date().toISOString(), 'SUBMITTED');
    assert.strictEqual(freshSla.daysElapsed, 0);
    assert.strictEqual(freshSla.daysRemaining, 15);
    assert.strictEqual(freshSla.isOverdue, false);

    // Simulated overdue test (20 days ago)
    const twentyDaysAgo = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString();
    const overdueSla = evaluateSlaCompliance(twentyDaysAgo, 'SUBMITTED');
    assert.ok(overdueSla.daysElapsed >= 20);
    assert.strictEqual(overdueSla.daysRemaining, 0);
    assert.strictEqual(overdueSla.isOverdue, true);

    // If resolved or closed, never overdue even if elapsed > 15 days
    const resolvedSla = evaluateSlaCompliance(twentyDaysAgo, 'ACTION_TAKEN');
    assert.strictEqual(resolvedSla.isOverdue, false);
  });

  it('enforces multi-tenant isolation and generates Ombudsman compliance audit CSV', () => {
    // Submit in Institution 1
    const grv1 = grievanceStore.submit({
      institutionId: 'inst-apex-001',
      category: 'ACADEMIC',
      severity: 'MEDIUM',
      subject: 'Issue in Apex',
      description: 'Details for Apex University',
      isAnonymous: true,
    });

    // Submit in Institution 2
    grievanceStore.submit({
      institutionId: 'inst-global-002',
      category: 'ACADEMIC',
      severity: 'MEDIUM',
      subject: 'Issue in Global',
      description: 'Details for Global University',
      isAnonymous: true,
    });

    // Verify tenant 1 list contains only tenant 1 items
    const apexList = grievanceStore.getByInstitution('inst-apex-001');
    assert.strictEqual(apexList.length, 1);
    assert.strictEqual(apexList[0].subject, 'Issue in Apex');

    // Tenant mismatch protection on hearing scheduling
    assert.throws(() => {
      grievanceStore.scheduleHearing({
        grievanceId: grv1.grievanceId,
        institutionId: 'inst-global-002', // Wrong tenant!
        hearing: {
          hearingDate: '2026-11-01T10:00:00Z',
          locationOrMeetingLink: 'Room 1',
          committeeChair: 'Chair',
          committeeMembers: [],
        },
      });
    }, /GRIEVANCE_NOT_FOUND_OR_TENANT_MISMATCH/);

    // Verify CSV generation
    const csv = exportGrievanceAuditCSV(apexList);
    assert.ok(csv.includes('Grievance_ID,Tracking_Token,Institution_ID'));
    assert.ok(csv.includes('"inst-apex-001"'));
    assert.ok(!csv.includes('"inst-global-002"'));
  });
});
