import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  registerExamHall,
  getAllExamHalls,
  generateInterleavedSeatingPlan,
  assignInvigilationDuty,
  logMalpracticeIncident,
  resolveMalpracticeIncident,
  exportExamSeatingPlanCSV,
  ExamCandidate,
  ExamHall,
} from '../src/lib/admin/examSeating.ts';

import {
  screenStudentForRemedial,
  createRemedialBatch,
  enrollStudentInRemedialBatch,
  recordRemedialSession,
  recordPostRemedialAssessment,
  exportRemedialLedgerCSV,
} from '../src/lib/teacher/remedialClasses.ts';

describe('TASK-945: University Exam Seating & Faculty Remedial Systems Suite', () => {
  describe('TASK-941: University Examination Hall Seating & Invigilation Duty Engine', () => {
    it('registers exam halls and computes capacity based on rows and columns', () => {
      const hall: ExamHall = {
        id: 'TEST-HALL-1',
        hallName: 'Test Hall Alpha',
        building: 'Science Block',
        floor: 1,
        rows: 5,
        columns: 6,
        totalCapacity: 0,
        hasCCTV: true,
        isActive: true,
      };

      const registered = registerExamHall(hall);
      assert.equal(registered.totalCapacity, 30);

      assert.throws(
        () => registerExamHall({ ...hall, rows: 0 }),
        /INVALID_HALL_DIMENSIONS/
      );
    });

    it('generates interleaved anti-cheating seating plan ensuring no adjacent seats share the same course', () => {
      registerExamHall({
        id: 'TEST-INTERLEAVE-HALL',
        hallName: 'Interleaving Test Hall',
        building: 'Exam Wing',
        floor: 2,
        rows: 4,
        columns: 4,
        totalCapacity: 16,
        hasCCTV: true,
        isActive: true,
      });

      const courseACandidates: ExamCandidate[] = Array.from({ length: 8 }, (_, i) => ({
        id: `STU-A-${i + 1}`,
        name: `Student A${i + 1}`,
        rollNumber: `21CS0${i + 1}`,
        courseCode: 'CS401',
        courseName: 'Distributed Systems',
        department: 'CSE',
        semester: 7,
      }));

      const courseBCandidates: ExamCandidate[] = Array.from({ length: 8 }, (_, i) => ({
        id: `STU-B-${i + 1}`,
        name: `Student B${i + 1}`,
        rollNumber: `21EC0${i + 1}`,
        courseCode: 'EC402',
        courseName: 'VLSI Design',
        department: 'ECE',
        semester: 7,
      }));

      const plan = generateInterleavedSeatingPlan({
        planId: 'PLAN-TEST-INTERLEAVE',
        hallId: 'TEST-INTERLEAVE-HALL',
        examDate: '2026-12-01',
        timeSlot: 'MORNING_09_12',
        sessionType: 'END_SEMESTER',
        candidatesByCourse: [courseACandidates, courseBCandidates],
        assignedInvigilators: [{ id: 'FAC-T1', name: 'Dr. Test Invigilator' }],
      });

      assert.equal(plan.totalSeatsFilled, 16);
      assert.equal(plan.occupancyPercentage, 100);
      assert.ok(plan.digest.length > 0);

      // Verify that horizontally adjacent seats do not share the same course code
      for (let r = 1; r <= 4; r++) {
        for (let c = 1; c < 4; c++) {
          const current = plan.allocatedSeats.find((s) => s.row === r && s.column === c);
          const right = plan.allocatedSeats.find((s) => s.row === r && s.column === c + 1);

          if (current && right) {
            assert.notEqual(
              current.courseCode,
              right.courseCode,
              `Horizontal adjacency violation at Row ${r}, Col ${c} and ${c + 1}`
            );
          }
        }
      }
    });

    it('rejects seating generation when candidates exceed hall capacity', () => {
      registerExamHall({
        id: 'TINY-HALL',
        hallName: 'Tiny Hall',
        building: 'Old Block',
        floor: 1,
        rows: 2,
        columns: 2,
        totalCapacity: 4,
        hasCCTV: false,
        isActive: true,
      });

      const sixCandidates: ExamCandidate[] = Array.from({ length: 6 }, (_, i) => ({
        id: `STU-${i}`,
        name: `Candidate ${i}`,
        rollNumber: `ROLL-${i}`,
        courseCode: 'CS101',
        courseName: 'Intro to CS',
        department: 'CSE',
        semester: 1,
      }));

      assert.throws(
        () =>
          generateInterleavedSeatingPlan({
            planId: 'PLAN-OVERFLOW',
            hallId: 'TINY-HALL',
            examDate: '2026-12-01',
            timeSlot: 'MORNING_09_12',
            sessionType: 'MID_SEMESTER',
            candidatesByCourse: [sixCandidates],
            assignedInvigilators: [],
          }),
        /CAPACITY_EXCEEDED/
      );
    });

    it('enforces conflict of interest and double-duty guards for faculty invigilation duties', () => {
      const duty1 = assignInvigilationDuty({
        id: 'DUTY-T1',
        facultyId: 'FAC-MATH-01',
        facultyName: 'Dr. Srinivasa Rao',
        department: 'Mathematics',
        hallId: 'TEST-INTERLEAVE-HALL',
        examDate: '2026-12-05',
        timeSlot: 'MORNING_09_12',
        role: 'ROOM_INVIGILATOR',
      });

      assert.equal(duty1.status, 'SCHEDULED');

      // Conflict of Interest check: faculty cannot invigilate their own subject
      assert.throws(
        () =>
          assignInvigilationDuty({
            id: 'DUTY-CONFLICT',
            facultyId: 'FAC-CS-02',
            facultyName: 'Prof. Ananth',
            department: 'Computer Science',
            hallId: 'TEST-INTERLEAVE-HALL',
            examDate: '2026-12-05',
            timeSlot: 'AFTERNOON_14_17',
            role: 'ROOM_INVIGILATOR',
            subjectTaughtCode: 'CS401',
            activeExamCourseCodesInHall: ['CS401', 'EC402'],
          }),
        /CONFLICT_OF_INTEREST/
      );

      // Double-booking check: same faculty at same date and slot
      assert.throws(
        () =>
          assignInvigilationDuty({
            id: 'DUTY-DOUBLE',
            facultyId: 'FAC-MATH-01',
            facultyName: 'Dr. Srinivasa Rao',
            department: 'Mathematics',
            hallId: 'TINY-HALL',
            examDate: '2026-12-05',
            timeSlot: 'MORNING_09_12',
            role: 'RELIEVER_INVIGILATOR',
          }),
        /DOUBLE_DUTY_COLLISION/
      );
    });

    it('logs malpractice incidents, generates unique tokens, and resolves disciplinary action', () => {
      const incident = logMalpracticeIncident({
        id: 'UFM-CASE-01',
        studentId: 'STU-ROGUE-01',
        studentRoll: '21CS099',
        studentName: 'Vikas Sharma',
        hallId: 'TEST-INTERLEAVE-HALL',
        courseCode: 'CS401',
        reportedByFacultyId: 'FAC-T1',
        reportedByFacultyName: 'Dr. Test Invigilator',
        description: 'Unauthorized handwritten material concealed in pencil box',
        evidenceItems: ['2 handwritten chits'],
      });

      assert.match(incident.token, /^COE-UFM-[A-F0-9]{8}$/);
      assert.equal(incident.status, 'PENDING_COE_INQUIRY');

      const resolved = resolveMalpracticeIncident(incident.id, {
        status: 'PENALTY_IMPOSED',
        penalty: 'CANCEL_CURRENT_PAPER',
      });

      assert.equal(resolved.status, 'PENALTY_IMPOSED');
      assert.equal(resolved.penalty, 'CANCEL_CURRENT_PAPER');
    });

    it('exports CoE seating plan CSV with statutory headers', () => {
      const csv = exportExamSeatingPlanCSV('PLAN-TEST-INTERLEAVE');
      assert.ok(csv.includes('Seat Number,Row,Column,Student Roll,Student Name,Course Code'));
      assert.ok(csv.includes('21CS01'));
      assert.ok(csv.includes('EC402'));
    });
  });

  describe('TASK-943: Faculty Remedial Class Scheduler & Slow Learner Tracking Engine', () => {
    it('screens and flags slow learners based on diagnostic and midterm performance', () => {
      const slowStudent = screenStudentForRemedial({
        studentId: 'STU-SLOW-1',
        studentName: 'Manoj Kumar',
        rollNumber: '22CS088',
        department: 'CSE',
        courseCode: 'CS201',
        courseName: 'DSA',
        semester: 3,
        diagnosticScore: 34,
        midtermScore: 42,
        questCompletionRate: 30,
        primaryCause: 'CONCEPT_CONFUSION',
      });

      assert.ok(slowStudent !== null);
      assert.equal(slowStudent.state, 'IDENTIFIED');
      assert.equal(slowStudent.preRemedialScore, 42);

      // Thriving student (scores >= 50%) is not flagged
      const thrivingStudent = screenStudentForRemedial({
        studentId: 'STU-TOP-1',
        studentName: 'Sneha Rao',
        rollNumber: '22CS001',
        department: 'CSE',
        courseCode: 'CS201',
        courseName: 'DSA',
        semester: 3,
        diagnosticScore: 82,
        midtermScore: 88,
        questCompletionRate: 95,
      });

      assert.equal(thrivingStudent, null);
    });

    it('creates small-group remedial batch and enforces max capacity constraint', () => {
      const batch = createRemedialBatch({
        id: 'REM-BATCH-TEST',
        batchCode: 'REM-CS201-TEST',
        courseCode: 'CS201',
        courseName: 'DSA',
        facultyId: 'FAC-REM-1',
        facultyName: 'Prof. Vasudevan',
        targetedConcept: 'Pointer recursion & binary search trees',
        maxCapacity: 15,
        targetGraduationDate: '2026-12-15',
      });

      assert.equal(batch.enrolledStudentIds.length, 0);

      // Cannot exceed 20 students per NAAC 2.2 norms
      assert.throws(
        () =>
          createRemedialBatch({
            id: 'REM-BATCH-OVERSIZED',
            batchCode: 'REM-CS201-OVER',
            courseCode: 'CS201',
            courseName: 'DSA',
            facultyId: 'FAC-REM-1',
            facultyName: 'Prof. Vasudevan',
            targetedConcept: 'Pointers',
            maxCapacity: 25,
            targetGraduationDate: '2026-12-15',
          }),
        /BATCH_CAPACITY_LIMIT_EXCEEDED/
      );
    });

    it('enrolls students into batch, records remedial sessions, and tracks attendance', () => {
      const student = enrollStudentInRemedialBatch('REM-BATCH-TEST', 'STU-SLOW-1');
      assert.equal(student.state, 'ENROLLED_IN_REMEDIAL');
      assert.equal(student.assignedBatchId, 'REM-BATCH-TEST');

      // Duplicate enrollment check
      assert.throws(
        () => enrollStudentInRemedialBatch('REM-BATCH-TEST', 'STU-SLOW-1'),
        /STUDENT_ALREADY_ENROLLED/
      );

      const session = recordRemedialSession({
        id: 'SESS-01',
        batchId: 'REM-BATCH-TEST',
        date: '2026-10-25',
        durationMinutes: 60,
        topicsCovered: 'Memory layout, pointers, and reference passing',
        attendeeStudentIds: ['STU-SLOW-1'],
      });

      assert.equal(session.sessionNumber, 1);
      assert.equal(student.state, 'ATTENDING_SESSIONS');
    });

    it('records post-remedial assessment, computes normalized learning gain, and graduates student', () => {
      // Pre-score was 42. Post-score 71.
      // Expected gain = ((71 - 42) / (100 - 42)) * 100 = (29 / 58) * 100 = 50%
      const evaluated = recordPostRemedialAssessment('STU-SLOW-1', 71);

      assert.equal(evaluated.postRemedialScore, 71);
      assert.equal(evaluated.learningGainPercentage, 50);
      assert.equal(evaluated.state, 'GRADUATED_FROM_REMEDIAL'); // Post-score >= 60

      // Edge case: if post score < 60, state is POST_ASSESSMENT_COMPLETED (not yet graduated)
      const student2 = screenStudentForRemedial({
        studentId: 'STU-SLOW-2',
        studentName: 'Rajesh G',
        rollNumber: '22CS089',
        department: 'CSE',
        courseCode: 'CS201',
        courseName: 'DSA',
        semester: 3,
        diagnosticScore: 25,
        midtermScore: 30,
        questCompletionRate: 20,
      })!;

      const evaluated2 = recordPostRemedialAssessment(student2.studentId, 55);
      assert.equal(evaluated2.state, 'POST_ASSESSMENT_COMPLETED');
    });

    it('exports NAAC Criterion 2.2.1 slow learner progress ledger CSV with statutory fields', () => {
      const csv = exportRemedialLedgerCSV();
      assert.ok(csv.includes('Student Roll,Student Name,Department,Course Code,Course Name'));
      assert.ok(csv.includes('Normalized Learning Gain (%)'));
      assert.ok(csv.includes('22CS088'));
      assert.ok(csv.includes('GRADUATED_FROM_REMEDIAL'));
    });
  });
});
