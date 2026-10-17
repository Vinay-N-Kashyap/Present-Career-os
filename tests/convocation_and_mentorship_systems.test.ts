import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  classifyDegree,
  generateDegreeScrollToken,
  validateMedalEligibility,
  createDegreeScroll,
  authorizeChancellorSealing,
  dispatchInAbsentiaDegree,
  exportConvocationScrollsCSV,
} from '../src/lib/admin/centralConvocation';

import {
  assessMenteeRisk,
  generateMentorshipToken,
  logMentorshipInteraction,
  escalateToCampusCounselor,
  resolveMentorshipFollowup,
  exportFacultyMentorshipCSV,
} from '../src/lib/teacher/facultyMentorship';

describe('TASK-995: Master Convocation Protocols & Proctorial Mentorship Systems Test Suite', () => {
  describe('TASK-991: Central University Annual Convocation Degree Scroll Sealing & Chancellor Medals Engine', () => {
    it('1. classifies degrees under university graduation ordinances and rejects sub-hurdle CGPA', () => {
      // Distinction: CGPA >= 8.5 without backlogs
      assert.strictEqual(classifyDegree(9.2, false), 'FIRST_CLASS_WITH_DISTINCTION');
      assert.strictEqual(classifyDegree(8.5, false), 'FIRST_CLASS_WITH_DISTINCTION');

      // With backlogs, downgraded to FIRST_CLASS
      assert.strictEqual(classifyDegree(9.2, true), 'FIRST_CLASS');

      // First Class: 6.5 <= CGPA < 8.5
      assert.strictEqual(classifyDegree(7.4, false), 'FIRST_CLASS');
      assert.strictEqual(classifyDegree(6.5, false), 'FIRST_CLASS');

      // Second Class: 5.0 <= CGPA < 6.5
      assert.strictEqual(classifyDegree(5.8, false), 'SECOND_CLASS');
      assert.strictEqual(classifyDegree(5.0, false), 'SECOND_CLASS');

      // Throws on CGPA < 5.0
      assert.throws(() => classifyDegree(4.99), /Ineligible for degree conferment/);
    });

    it('2. generates unique degree scroll watermark token matching SCR-[YEAR]-[DEGREE]-[HEX6]', () => {
      const token = generateDegreeScrollToken('B.Tech', 2026);
      assert.match(token, /^SCR-2026-BTECH-[0-9A-F]{6}$/);

      const token2 = generateDegreeScrollToken('Ph.D.', 2026);
      assert.match(token2, /^SCR-2026-PHD-[0-9A-F]{6}$/);
    });

    it('3. validates institute medal criteria: President, Chancellor, Director and Silver medals', () => {
      // President's Gold Medal: Rank 1 overall and CGPA >= 9.5
      const presValid = validateMedalEligibility('PRESIDENTS_GOLD_MEDAL', 9.8, 1);
      assert.strictEqual(presValid.eligible, true);

      const presInvalidRank = validateMedalEligibility('PRESIDENTS_GOLD_MEDAL', 9.8, 2);
      assert.strictEqual(presInvalidRank.eligible, false);
      assert.match(presInvalidRank.reason!, /requires Overall Rank 1/);

      const presInvalidCgpa = validateMedalEligibility('PRESIDENTS_GOLD_MEDAL', 9.45, 1);
      assert.strictEqual(presInvalidCgpa.eligible, false);

      // Chancellor's Gold Medal: Top 3 and CGPA >= 9.0
      const chanValid = validateMedalEligibility('CHANCELLORS_GOLD_MEDAL', 9.2, 3);
      assert.strictEqual(chanValid.eligible, true);

      const chanInvalid = validateMedalEligibility('CHANCELLORS_GOLD_MEDAL', 9.2, 4);
      assert.strictEqual(chanInvalid.eligible, false);

      // Institute Silver Medal: Branch rank 1 and CGPA >= 8.5
      const silverValid = validateMedalEligibility('INSTITUTE_SILVER_MEDAL', 8.8, 1);
      assert.strictEqual(silverValid.eligible, true);

      const silverInvalid = validateMedalEligibility('INSTITUTE_SILVER_MEDAL', 8.4, 1);
      assert.strictEqual(silverInvalid.eligible, false);
    });

    it('4. initializes degree scroll, assigns DigiLocker URI, and verifies SHA-256 parchment seal', () => {
      const scroll = createDegreeScroll({
        studentId: 'STU-001',
        enrollmentNumber: '2022CSB001',
        studentName: 'Aarav Shenoy',
        degreeProgram: 'Bachelor of Technology in CSE',
        degreeAbbreviation: 'B.Tech',
        department: 'CSE',
        cgpa: 9.88,
        confermentMode: 'IN_PERSON',
        medalAwarded: 'PRESIDENTS_GOLD_MEDAL',
        cohortRank: 1,
      });

      assert.strictEqual(scroll.classification, 'FIRST_CLASS_WITH_DISTINCTION');
      assert.strictEqual(scroll.dignitarySignaturesVerified, false);
      assert.strictEqual(scroll.nadDigiLockerUri, 'nad://in.gov.digilocker.degrees/2022csb001');
      assert.ok(scroll.cryptographicParchmentSeal);
      assert.strictEqual(scroll.cryptographicParchmentSeal.length, 64);
    });

    it('5. enforces dual Registrar + Vice Chancellor sign-off for Chancellor parchment sealing', () => {
      const scroll = createDegreeScroll({
        studentId: 'STU-002',
        enrollmentNumber: '2022EEB014',
        studentName: 'Divya Kulkarni',
        degreeProgram: 'B.Tech in EEE',
        degreeAbbreviation: 'B.Tech',
        department: 'EEE',
        cgpa: 9.42,
        confermentMode: 'IN_PERSON',
      });

      // Registrar only missing VC
      assert.throws(() => authorizeChancellorSealing(scroll, true, false), /Dual seal authorization failed/);

      // VC only missing Registrar
      assert.throws(() => authorizeChancellorSealing(scroll, false, true), /Dual seal authorization failed/);

      // Both valid
      const sealed = authorizeChancellorSealing(scroll, true, true);
      assert.strictEqual(sealed.dignitarySignaturesVerified, true);
      assert.notStrictEqual(sealed.cryptographicParchmentSeal, scroll.cryptographicParchmentSeal);
    });

    it('6. validates postal dispatch for In-Absentia degree scrolls only after dignitary sealing', () => {
      const inPersonScroll = createDegreeScroll({
        studentId: 'STU-003',
        enrollmentNumber: '2022MEB035',
        studentName: 'Rohit Nair',
        degreeProgram: 'B.Tech in ME',
        degreeAbbreviation: 'B.Tech',
        department: 'ME',
        cgpa: 7.65,
        confermentMode: 'IN_PERSON',
      });

      // Cannot postal dispatch an In-Person scroll
      assert.throws(
        () => dispatchInAbsentiaDegree(inPersonScroll, 'EM123456789IN'),
        /Only In-Absentia degrees can be dispatched/
      );

      const inAbsentiaUnsealed = createDegreeScroll({
        studentId: 'STU-004',
        enrollmentNumber: '2021PHDCSE008',
        studentName: 'Dr. Siddharth Joshi',
        degreeProgram: 'Ph.D. in Computer Science',
        degreeAbbreviation: 'Ph.D.',
        department: 'CSE',
        cgpa: 9.15,
        confermentMode: 'IN_ABSENTIA',
        thesisTitle: 'Fault-Tolerant Consensus',
      });

      // Cannot dispatch without Chancellor seal
      assert.throws(
        () => dispatchInAbsentiaDegree(inAbsentiaUnsealed, 'EM123456789IN'),
        /Cannot dispatch unsealed degree parchment/
      );

      // Seal then dispatch
      const sealed = authorizeChancellorSealing(inAbsentiaUnsealed, true, true);
      const dispatched = dispatchInAbsentiaDegree(sealed, 'EM123456789IN');
      assert.strictEqual(dispatched.dispatchTrackingNumber, 'EM123456789IN');
    });
  });

  describe('TASK-993: Faculty Student Proctorial Mentorship & Holistic Student Wellness Engine', () => {
    it('7. assesses student proctorial risk levels (Critical Concern, Academic Warning, Low Normal)', () => {
      // Critical: CGPA < 5.0 or attendance < 65% or distressed
      assert.strictEqual(assessMenteeRisk(4.8, 80), 'CRITICAL_CONCERN');
      assert.strictEqual(assessMenteeRisk(7.5, 60), 'CRITICAL_CONCERN');
      assert.strictEqual(assessMenteeRisk(8.5, 90, true), 'CRITICAL_CONCERN');

      // Warning: CGPA < 6.0 or attendance < 75%
      assert.strictEqual(assessMenteeRisk(5.8, 80), 'ACADEMIC_WARNING');
      assert.strictEqual(assessMenteeRisk(7.2, 70), 'ACADEMIC_WARNING');

      // Normal: CGPA >= 6.0 and attendance >= 75%
      assert.strictEqual(assessMenteeRisk(7.5, 85), 'LOW_NORMAL');
    });

    it('8. logs proctorial mentorship session with MNT-[YEAR]-[DEPT]-[HEX6] token and SHA-256 seal', () => {
      const record = logMentorshipInteraction({
        studentId: 'STU-019',
        enrollmentNumber: '2024CSB019',
        studentName: 'Vikram Roy',
        semester: 4,
        department: 'Computer Science',
        facultyMentorName: 'Prof. Arvind Swaminathan',
        facultyMentorEmpId: 'EMP-007',
        category: 'ATTENDANCE_INTERVENTION',
        currentCgpa: 5.42,
        attendancePercentage: 62.5,
        actionPlanDiscussion: 'Typhoid recovery plan and remedial lab attendances.',
        parentContacted: true,
      });

      assert.match(record.interactionToken, /^MNT-\d{4}-COMP-[0-9A-F]{6}$/);
      assert.strictEqual(record.riskLevel, 'CRITICAL_CONCERN');
      assert.strictEqual(record.parentContacted, true);
      assert.strictEqual(record.isResolved, false);
      assert.ok(record.cryptographicSeal);
      assert.strictEqual(record.cryptographicSeal.length, 64);

      // Throws on invalid CGPA
      assert.throws(
        () =>
          logMentorshipInteraction({
            ...record,
            currentCgpa: 11.0,
          }),
        /CGPA must be bounded within 0.00 and 10.00/
      );
    });

    it('9. escalates student to university counselor and resolves proctorial follow-ups', () => {
      const record = logMentorshipInteraction({
        studentId: 'STU-004',
        enrollmentNumber: '2025EEB004',
        studentName: 'Kavya Iyer',
        semester: 2,
        department: 'Electrical',
        facultyMentorName: 'Dr. Neha Kulkarni',
        facultyMentorEmpId: 'EMP-018',
        category: 'PSYCHOSOCIAL_WELLNESS',
        currentCgpa: 6.8,
        attendancePercentage: 78.5,
        actionPlanDiscussion: 'Adjustment anxiety.',
      });

      assert.strictEqual(record.referralToCounselor, false);

      // Escalate to Counselor
      const escalated = escalateToCampusCounselor(record, 'Acute panic attacks during exams.');
      assert.strictEqual(escalated.referralToCounselor, true);
      assert.strictEqual(escalated.riskLevel, 'CRITICAL_CONCERN');
      assert.ok(escalated.actionPlanDiscussion.includes('[ESCALATION]'));
      assert.notStrictEqual(escalated.cryptographicSeal, record.cryptographicSeal);

      // Resolve follow-up
      const resolved = resolveMentorshipFollowup(escalated, 'Counseling completed and academic progress stabilized.');
      assert.strictEqual(resolved.isResolved, true);
      assert.strictEqual(resolved.riskLevel, 'LOW_NORMAL');
      assert.strictEqual(resolved.resolutionNotes, 'Counseling completed and academic progress stabilized.');
    });

    it('10. exports valid and deterministic CSV ledgers for both Convocation and Proctorial Mentorship engines', () => {
      const convocationCsv = exportConvocationScrollsCSV([
        createDegreeScroll({
          studentId: 'S1',
          enrollmentNumber: '2022CSB001',
          studentName: 'Aarav Shenoy',
          degreeProgram: 'B.Tech in CSE',
          degreeAbbreviation: 'B.Tech',
          department: 'CSE',
          cgpa: 9.88,
          confermentMode: 'IN_PERSON',
        }),
      ]);

      assert.ok(convocationCsv.includes('Scroll ID,Degree Watermark Token,Enrollment Number'));
      assert.ok(convocationCsv.includes('"Aarav Shenoy"'));

      const mentorshipCsv = exportFacultyMentorshipCSV([
        logMentorshipInteraction({
          studentId: 'S2',
          enrollmentNumber: '2024CSB019',
          studentName: 'Vikram Roy',
          semester: 4,
          department: 'CSE',
          facultyMentorName: 'Prof. Swaminathan',
          facultyMentorEmpId: 'EMP-007',
          category: 'ROUTINE_ACADEMIC_AUDIT',
          currentCgpa: 8.0,
          attendancePercentage: 90.0,
          actionPlanDiscussion: 'Course choices reviewed.',
        }),
      ]);

      assert.ok(mentorshipCsv.includes('Interaction ID,Tracking Token,Enrollment Number,Student Name'));
      assert.ok(mentorshipCsv.includes('"Vikram Roy"'));
    });
  });
});
