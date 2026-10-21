import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  generateAffiliationToken,
  evaluateAicCompliance,
  generateAffiliationSeal,
  registerAffiliationApplication,
  scheduleAicInspection,
  submitAicInspectionReport,
  sanctionByUniversitySyndicate,
  exportAffiliationAuditCSV,
  AicInspectionFinding,
} from '../src/lib/admin/centralAffiliation';

import {
  MIN_ATTENDANCE_PERCENTAGE,
  MIN_ASSESSMENT_SCORE,
  generateFdpToken,
  validateCertificateEligibility,
  createContinuingEducationCourse,
  registerCourseParticipant,
  recordParticipantEvaluation,
  issueBatchCertificates,
  exportContinuingEducationCSV,
} from '../src/lib/teacher/facultyContinuingEducation';

describe('TASK-1000: Master College Affiliation & Faculty Continuing Education Systems Test Suite', () => {
  describe('TASK-996: Central University College Affiliation & Inspection Committee Scrutiny Engine', () => {
    it('1. generates unique affiliation certificate token matching AFF-[YEAR]-[INST]-[HEX6]', () => {
      const token = generateAffiliationToken('INST-SIT04', 2026);
      assert.match(token, /^AFF-2026-INSTSI-[0-9A-F]{6}$/);

      const token2 = generateAffiliationToken('IITD', 2026);
      assert.match(token2, /^AFF-2026-IITD-[0-9A-F]{6}$/);
    });

    it('2. registers affiliation application with APPLICATION_SUBMITTED stage and SHA-256 seal, rejecting invalid intake', () => {
      const record = registerAffiliationApplication({
        institutionCode: 'INST-GEC09',
        institutionName: 'Government Engineering College',
        trustOrSociety: 'State Dept of Higher Education',
        affiliationType: 'NEW_PROGRAMME_VARIATION_INTAKE',
        academicYear: '2026-2027',
        programmeName: 'B.Tech Robotics & AI',
        approvedIntake: 60,
      });

      assert.strictEqual(record.stage, 'APPLICATION_SUBMITTED');
      assert.strictEqual(record.institutionCode, 'INST-GEC09');
      assert.strictEqual(record.approvedIntake, 60);
      assert.ok(record.cryptographicAffiliationSeal);
      assert.strictEqual(record.cryptographicAffiliationSeal.length, 64);

      // Throws on zero or negative intake
      assert.throws(
        () =>
          registerAffiliationApplication({
            institutionCode: 'INST-FAIL',
            institutionName: 'Fail College',
            trustOrSociety: 'Trust',
            affiliationType: 'TEMPORARY_PROVISIONAL',
            academicYear: '2026-2027',
            programmeName: 'B.Tech Civil',
            approvedIntake: 0,
          }),
        /Approved intake must be strictly greater than 0 seats/
      );
    });

    it('3. schedules AIC inspection visit with chairman and committee members validation', () => {
      const record = registerAffiliationApplication({
        institutionCode: 'INST-SIT04',
        institutionName: 'St. Xavier Institute',
        trustOrSociety: 'Xavier Trust',
        affiliationType: 'PERMANENT_AFFILIATION',
        academicYear: '2026-2027',
        programmeName: 'B.Tech CSE',
        approvedIntake: 180,
      });

      // Throws if AIC Chairman is empty
      assert.throws(
        () =>
          scheduleAicInspection(record, {
            aicChairman: '   ',
            aicMembers: ['Dr. A. Sen'],
            inspectionDate: '2026-03-25',
          }),
        /AIC Chairman must be nominated/
      );

      // Throws if no AIC members empaneled
      assert.throws(
        () =>
          scheduleAicInspection(record, {
            aicChairman: 'Prof. Ramanathan',
            aicMembers: [],
            inspectionDate: '2026-03-25',
          }),
        /At least 1 subject expert member must be empaneled/
      );

      const scheduled = scheduleAicInspection(record, {
        aicChairman: 'Prof. Ramanathan',
        aicMembers: ['Dr. A. Sen', 'Prof. R. Varma'],
        inspectionDate: '2026-03-25',
      });

      assert.strictEqual(scheduled.stage, 'AIC_INSPECTION_SCHEDULED');
      assert.strictEqual(scheduled.aicChairman, 'Prof. Ramanathan');
      assert.strictEqual(scheduled.aicMembers.length, 2);
      assert.notStrictEqual(scheduled.cryptographicAffiliationSeal, record.cryptographicAffiliationSeal);
    });

    it('4. submits AIC physical inspection findings and enforces stage transition prerequisites', () => {
      const record = registerAffiliationApplication({
        institutionCode: 'INST-PCE12',
        institutionName: 'Polytechnic College',
        trustOrSociety: 'Pratibha Mandal',
        affiliationType: 'TEMPORARY_PROVISIONAL',
        academicYear: '2026-2027',
        programmeName: 'B.Tech Civil',
        approvedIntake: 60,
      });

      const sampleFindings: AicInspectionFinding[] = [
        {
          areaCategory: 'FACULTY_STUDENT_RATIO',
          requiredStandard: '1:20 Cadre Ratio',
          observedMetric: 'Current FSR is 1:28 without required Associate Professors',
          severity: 'CRITICAL_DEFICIENCY',
          complianceDeadlineDays: 30,
          isRectified: false,
        },
      ];

      // Cannot submit report before scheduling inspection
      assert.throws(
        () => submitAicInspectionReport(record, sampleFindings),
        /Invalid stage transition: Inspection must be scheduled prior to report submission/
      );

      const scheduled = scheduleAicInspection(record, {
        aicChairman: 'Prof. Ramesh Sharma',
        aicMembers: ['Dr. P. K. Deshmukh'],
        inspectionDate: '2026-03-05',
      });

      const reportSubmitted = submitAicInspectionReport(scheduled, sampleFindings);
      assert.strictEqual(reportSubmitted.stage, 'AIC_REPORT_SUBMITTED');
      assert.strictEqual(reportSubmitted.findings.length, 1);
      assert.strictEqual(reportSubmitted.findings[0].severity, 'CRITICAL_DEFICIENCY');
    });

    it('5. evaluates statutory compliance and blocks Syndicate sanction on unrectified critical deficiencies', () => {
      const findingsWithCritical: AicInspectionFinding[] = [
        {
          areaCategory: 'FACULTY_STUDENT_RATIO',
          requiredStandard: '1:20 FSR',
          observedMetric: 'FSR 1:28',
          severity: 'CRITICAL_DEFICIENCY',
          isRectified: false,
        },
        {
          areaCategory: 'LIBRARY_JOURNALS',
          requiredStandard: 'IEEE Xplore subscription',
          observedMetric: 'Subscription renewal underway',
          severity: 'MINOR_OBSERVATION',
          isRectified: false,
        },
      ];

      const checkFail = evaluateAicCompliance(findingsWithCritical);
      assert.strictEqual(checkFail.canApprove, false);
      assert.strictEqual(checkFail.criticalDeficiencyCount, 1);
      assert.match(checkFail.reason!, /Affiliation vetoed: 1 critical statutory deficiencies remain unresolved/);

      // Rectify critical deficiency
      const rectifiedFindings: AicInspectionFinding[] = [
        {
          ...findingsWithCritical[0],
          isRectified: true,
        },
        findingsWithCritical[1],
      ];

      const checkPass = evaluateAicCompliance(rectifiedFindings);
      assert.strictEqual(checkPass.canApprove, true);
      assert.strictEqual(checkPass.criticalDeficiencyCount, 0);
      assert.strictEqual(checkPass.minorObservationCount, 1);
    });

    it('6. sanctions affiliation by University Syndicate with resolution number upon full compliance', () => {
      const record = registerAffiliationApplication({
        institutionCode: 'INST-SIT04',
        institutionName: 'St. Xavier Institute',
        trustOrSociety: 'Xavier Trust',
        affiliationType: 'PERMANENT_AFFILIATION',
        academicYear: '2026-2027',
        programmeName: 'B.Tech AI',
        approvedIntake: 180,
      });

      const scheduled = scheduleAicInspection(record, {
        aicChairman: 'Prof. Ramanathan',
        aicMembers: ['Dr. A. Sen'],
        inspectionDate: '2026-02-18',
      });

      const reportWithDeficiency = submitAicInspectionReport(scheduled, [
        {
          areaCategory: 'SAFETY_ACCESSIBILITY',
          requiredStandard: 'Fire NOC & Ramp access',
          observedMetric: 'Fire NOC expired',
          severity: 'CRITICAL_DEFICIENCY',
          isRectified: false,
        },
      ]);

      // Syndicate sanction should fail due to unrectified critical deficiency
      assert.throws(
        () => sanctionByUniversitySyndicate(reportWithDeficiency, 'SYN-RES-2026-ITEM-12'),
        /Affiliation vetoed/
      );

      // Submit compliant report
      const reportCompliant = submitAicInspectionReport(scheduled, [
        {
          areaCategory: 'SAFETY_ACCESSIBILITY',
          requiredStandard: 'Fire NOC & Ramp access',
          observedMetric: 'Valid Fire NOC inspected and verified',
          severity: 'COMPLIANT',
          isRectified: true,
        },
      ]);

      const sanctioned = sanctionByUniversitySyndicate(reportCompliant, 'SYN-RES-2026-ITEM-44');
      assert.strictEqual(sanctioned.stage, 'SYNDICATE_SANCTIONED');
      assert.strictEqual(sanctioned.syndicateResolutionNumber, 'SYN-RES-2026-ITEM-44');
      assert.ok(sanctioned.cryptographicAffiliationSeal);
    });
  });

  describe('TASK-998: Faculty Continuing Education Workshop & ATAL FDP Management Engine', () => {
    it('7. generates unique FDP tracking token matching FDP-[YEAR]-[DEPT]-[HEX6]', () => {
      const token = generateFdpToken('Computer Science', 2026);
      assert.match(token, /^FDP-2026-COMP-[0-9A-F]{6}$/);

      const token2 = generateFdpToken('EEE', 2026);
      assert.match(token2, /^FDP-2026-EEE-[0-9A-F]{6}$/);
    });

    it('8. validates AICTE ATAL / QIP certification threshold (attendance >= 80% and test score >= 60%)', () => {
      assert.strictEqual(MIN_ATTENDANCE_PERCENTAGE, 80.0);
      assert.strictEqual(MIN_ASSESSMENT_SCORE, 60.0);

      // Both passing
      assert.deepStrictEqual(validateCertificateEligibility(85.0, 75.0), { eligible: true });
      assert.deepStrictEqual(validateCertificateEligibility(80.0, 60.0), { eligible: true });

      // Attendance below 80%
      const attFail = validateCertificateEligibility(79.5, 90.0);
      assert.strictEqual(attFail.eligible, false);
      assert.match(attFail.reason!, /Attendance 79.5% is below statutory threshold/);

      // Assessment score below 60%
      const scoreFail = validateCertificateEligibility(90.0, 58.0);
      assert.strictEqual(scoreFail.eligible, false);
      assert.match(scoreFail.reason!, /Assessment score 58.0% is below hurdle/);

      // Missing assessment score
      const undefinedScore = validateCertificateEligibility(85.0, undefined);
      assert.strictEqual(undefinedScore.eligible, false);
      assert.match(undefinedScore.reason!, /Assessment score 0% is below hurdle/);
    });

    it('9. manages course lifecycle, participant enrollment with capacity cap, and evaluation metrics', () => {
      const course = createContinuingEducationCourse({
        courseTitle: 'Generative AI & LLM Systems Engineering',
        department: 'CSE',
        coordinatorName: 'Dr. Siddharth Sen',
        coordinatorEmpId: 'EMP-CSE-042',
        scheme: 'AICTE_ATAL_ACADEMY',
        mode: 'HANDS_ON_BOOTCAMP',
        startDate: '2026-06-08',
        endDate: '2026-06-13',
        durationDays: 6,
        targetCapacity: 2, // Test low capacity limit
        sanctionedBudgetInr: 350000,
      });

      assert.strictEqual(course.stage, 'PROPOSAL_DRAFTED');
      assert.strictEqual(course.targetCapacity, 2);
      assert.strictEqual(course.participants.length, 0);

      // Enroll participant 1
      const withP1 = registerCourseParticipant(course, {
        fullName: 'Prof. Ramesh Verma',
        institutionName: 'IIT Roorkee',
        designation: 'Associate Professor',
        email: 'ramesh.verma@iitr.ac.in',
        attendancePercentage: 0,
      });
      assert.strictEqual(withP1.participants.length, 1);

      // Enroll participant 2
      const withP2 = registerCourseParticipant(withP1, {
        fullName: 'Dr. Preeti Deshmukh',
        institutionName: 'NIT Nagpur',
        designation: 'Assistant Professor',
        email: 'pdeshmukh@nitn.ac.in',
        attendancePercentage: 0,
      });
      assert.strictEqual(withP2.participants.length, 2);

      // Enroll participant 3 exceeds capacity cap
      assert.throws(
        () =>
          registerCourseParticipant(withP2, {
            fullName: 'Extra Participant',
            institutionName: 'State Tech',
            designation: 'Lecturer',
            email: 'extra@state.edu',
            attendancePercentage: 0,
          }),
        /Enrollment capped: Course target capacity of 2 reached/
      );

      // Record evaluation
      const evaluated = recordParticipantEvaluation(
        withP2,
        withP2.participants[0].participantId,
        100.0,
        92.0
      );
      assert.strictEqual(evaluated.participants[0].attendancePercentage, 100.0);
      assert.strictEqual(evaluated.participants[0].mcqAssessmentScore, 92.0);
    });

    it('10. issues batch certificates based on statutory hurdles and exports deterministic CSV ledgers for both engines', () => {
      const course = createContinuingEducationCourse({
        courseTitle: 'Wide Bandgap Semiconductors',
        department: 'EEE',
        coordinatorName: 'Dr. Neha Kulkarni',
        coordinatorEmpId: 'EMP-EEE-018',
        scheme: 'GIAN_INTERNATIONAL',
        mode: 'OFFLINE_RESIDENTIAL',
        startDate: '2026-07-06',
        endDate: '2026-07-11',
        durationDays: 6,
        targetCapacity: 10,
        sanctionedBudgetInr: 500000,
      });

      // Cannot issue certificates with 0 participants
      assert.throws(() => issueBatchCertificates(course), /Cannot issue certificates: Course has 0 registered participants/);

      // Add eligible and ineligible participants
      const p1Course = registerCourseParticipant(course, {
        fullName: 'Dr. Amitav Ghosh',
        institutionName: 'Jadavpur University',
        designation: 'Associate Professor',
        email: 'aghosh@ju.ac.in',
        attendancePercentage: 95.0,
        mcqAssessmentScore: 84.0,
      });

      const p2Course = registerCourseParticipant(p1Course, {
        fullName: 'Kiran Patel',
        institutionName: 'Sardar Patel Tech',
        designation: 'Research Scholar',
        email: 'kiran.patel@spit.ac.in',
        attendancePercentage: 65.0,
        mcqAssessmentScore: 50.0,
      });

      const certifiedCourse = issueBatchCertificates(p2Course);
      assert.strictEqual(certifiedCourse.stage, 'CERTIFICATES_ISSUED');
      assert.strictEqual(certifiedCourse.participants[0].certificateIssued, true); // 95% att, 84% score
      assert.strictEqual(certifiedCourse.participants[1].certificateIssued, false); // 65% att, 50% score

      // Verify CSV export for Continuing Education
      const fdpCsv = exportContinuingEducationCSV([certifiedCourse]);
      assert.ok(fdpCsv.includes('Course ID,Tracking Token,Course Title,Department,Coordinator'));
      assert.ok(fdpCsv.includes('"Dr. Neha Kulkarni"'));
      assert.ok(fdpCsv.includes('"CERTIFICATES_ISSUED"'));

      // Verify CSV export for Affiliation
      const affRecord = registerAffiliationApplication({
        institutionCode: 'INST-SIT04',
        institutionName: 'St. Xavier Institute of Technology',
        trustOrSociety: 'Xavier Educational Trust',
        affiliationType: 'PERMANENT_AFFILIATION',
        academicYear: '2026-2027',
        programmeName: 'B.Tech AI',
        approvedIntake: 180,
      });
      const affCsv = exportAffiliationAuditCSV([affRecord]);
      assert.ok(affCsv.includes('Affiliation ID,Certificate Token,Institution Code,Institution Name'));
      assert.ok(affCsv.includes('"St. Xavier Institute of Technology"'));
      assert.ok(affCsv.includes('"APPLICATION_SUBMITTED"'));
    });
  });
});
