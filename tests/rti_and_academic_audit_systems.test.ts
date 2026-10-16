import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateRtiDueWindow,
  evaluateSection8Exemptions,
  generateRtiToken,
  registerRtiApplication,
  recordRtiDecision,
  recordFirstAppeal,
  exportRtiAnnualReturnCSV,
} from '../src/lib/admin/centralRti';

import {
  validateRubricScores,
  calculateCompositeAqi,
  generateAuditToken,
  schedulePeerObservation,
  submitObservationReport,
  facultyAcknowledgeAudit,
  exportAcademicAuditLedgerCSV,
  RubricScores,
} from '../src/lib/teacher/academicAudit';

describe('TASK-980: Institutional RTI Governance & Faculty Academic Audit Systems Suite', () => {
  describe('TASK-976: Central University Right to Information (RTI 2005) & CPGRAMS Engine', () => {
    it('calculates statutory response due windows (30 days, 48 hours for Life/Liberty, 35 days for Sec 6(3))', () => {
      const baseDate = '2026-03-01';

      // Standard RTI: exactly 30 days
      const standardDue = calculateRtiDueWindow(baseDate, false, false);
      assert.strictEqual(standardDue, '2026-03-31');

      // Proviso to Section 7(1): Life or Liberty mandatory 48 hours (2 days)
      const lifeDue = calculateRtiDueWindow(baseDate, true, false);
      assert.strictEqual(lifeDue, '2026-03-03');

      // Section 6(3) Transfer to another authority: 30 + 5 = 35 days
      const transferDue = calculateRtiDueWindow(baseDate, false, true);
      assert.strictEqual(transferDue, '2026-04-05');
    });

    it('evaluates statutory Section 8(1) exemption clauses accurately', () => {
      // Fiduciary Relationship / Examiner Identity
      const ex1 = evaluateSection8Exemptions('Please disclose examiner name and question paper setter details', {
        containsExaminerIdentity: true,
      });
      assert.ok(ex1.includes('SEC_8_1_E_FIDUCIARY_RELATIONSHIP'));

      // Personal Privacy
      const ex2 = evaluateSection8Exemptions('Requesting medical record and personal ITR of faculty member', {
        containsThirdPartyPersonal: true,
      });
      assert.ok(ex2.includes('SEC_8_1_J_PERSONAL_PRIVACY'));

      // Clean request without exemptions
      const ex3 = evaluateSection8Exemptions('Provide sanctioned course syllabus and seat matrix', {});
      assert.strictEqual(ex3.length, 0);
    });

    it('registers RTI application under Section 6(1) with unique token and statutory due date', () => {
      const rti = registerRtiApplication({
        applicantName: 'Naveen Jindal',
        category: 'EXAMINATIONS_AND_EVALUATION',
        subjectDescription: 'Certified copies of answer scripts for B.Tech End-Semester Examination',
        departmentConcerned: 'Controller of Examinations',
        receivedDate: '2026-03-01',
        cpioOfficer: 'Dr. R. K. Mukherjee',
      });

      assert.match(rti.registrationNumber, /^RTI-\d{4}-CONT-[0-9A-F]{6}$/);
      assert.strictEqual(rti.stage, 'CPIO_SCRUTINIZING');
      assert.strictEqual(rti.dueDate, '2026-03-31');
      assert.strictEqual(rti.isBplExempt, false);
    });

    it('records CPIO disposal decision and computes cryptographic SHA-256 seal', () => {
      const rti = registerRtiApplication({
        applicantName: 'Anita Roy',
        category: 'RECRUITMENT_AND_PROMOTION',
        subjectDescription: 'Cutoff marks for Assistant Professor post',
        departmentConcerned: 'Establishment Cell',
        receivedDate: '2026-03-05',
        cpioOfficer: 'Dr. Mukherjee',
      });

      const decided = recordRtiDecision(rti, {
        stage: 'PARTIALLY_DISCLOSED_SEC_10',
        exemptionsApplied: ['SEC_8_1_J_PERSONAL_PRIVACY'],
        remarks: 'Candidate own score provided. Scores of other competitors withheld under Section 8(1)(j).',
        dispositionDate: '2026-03-20',
      });

      assert.strictEqual(decided.stage, 'PARTIALLY_DISCLOSED_SEC_10');
      assert.strictEqual(decided.dispositionDate, '2026-03-20');
      assert.ok(decided.exemptionsApplied?.includes('SEC_8_1_J_PERSONAL_PRIVACY'));
      assert.match(decided.cryptographicSeal || '', /^[0-9a-f]{64}$/);
    });

    it('records First Appeal under Section 19(1) and exports CIC Annual Return CSV', () => {
      const rti = registerRtiApplication({
        applicantName: 'Vikas Sharma',
        category: 'FINANCIAL_AND_TENDERS',
        subjectDescription: 'Campus Wi-Fi tender comparative sheet',
        departmentConcerned: 'Procurement Cell',
        receivedDate: '2026-02-15',
        cpioOfficer: 'Dr. Mukherjee',
      });

      const appealed = recordFirstAppeal(rti, {
        appealFilingDate: '2026-03-15',
        faaOfficer: 'Prof. S. R. Iyengar (FAA)',
        groundForAppeal: 'Delay in supplying technical evaluation document',
      });

      assert.strictEqual(appealed.stage, 'FIRST_APPEAL_FILED');
      assert.strictEqual(appealed.faaOfficer, 'Prof. S. R. Iyengar (FAA)');

      const csv = exportRtiAnnualReturnCSV([appealed]);
      assert.ok(csv.includes('Registration Number,Applicant Name,BPL Fee Exempt,Category'));
      assert.ok(csv.includes('Vikas Sharma'));
      assert.ok(csv.includes('FINANCIAL_AND_TENDERS'));
      assert.ok(csv.includes('Prof. S. R. Iyengar (FAA)'));
    });
  });

  describe('TASK-978: Faculty Academic Audit & Peer Classroom Teaching Observation Engine', () => {
    it('validates rubric scores enforcing 1.0 to 5.0 range boundaries', () => {
      const validScores: RubricScores = {
        coursePlanAdherence: 4.5,
        activeLearningEngagement: 4.8,
        ictIntegration: 4.2,
        formativeAssessment: 4.0,
        inclusivityAndSupport: 4.6,
      };
      assert.strictEqual(validateRubricScores(validScores), true);

      const invalidScores: RubricScores = {
        coursePlanAdherence: 5.5, // Exceeds 5.0
        activeLearningEngagement: 4.0,
        ictIntegration: 4.0,
        formativeAssessment: 4.0,
        inclusivityAndSupport: 4.0,
      };
      assert.strictEqual(validateRubricScores(invalidScores), false);
    });

    it('calculates composite Academic Quality Index (AQI) and assigns correct NAAC grade bands', () => {
      const exemplaryScores: RubricScores = {
        coursePlanAdherence: 4.8,
        activeLearningEngagement: 4.6,
        ictIntegration: 4.9,
        formativeAssessment: 4.5,
        inclusivityAndSupport: 4.7,
      };
      const r1 = calculateCompositeAqi(exemplaryScores);
      assert.strictEqual(r1.aqi, 4.7);
      assert.strictEqual(r1.grade, 'EXEMPLARY');
      assert.strictEqual(r1.band, 'A++');

      const commendableScores: RubricScores = {
        coursePlanAdherence: 4.2,
        activeLearningEngagement: 4.0,
        ictIntegration: 4.1,
        formativeAssessment: 4.0,
        inclusivityAndSupport: 4.2,
      };
      const r2 = calculateCompositeAqi(commendableScores);
      assert.strictEqual(r2.aqi, 4.1);
      assert.strictEqual(r2.grade, 'COMMENDABLE');
      assert.strictEqual(r2.band, 'A+');
    });

    it('schedules peer observation session and issues unique audit token', () => {
      const obs = schedulePeerObservation({
        facultyInstructor: 'Prof. Arvind Swaminathan',
        peerAuditor: 'Dr. Rajiv Malhotra',
        department: 'Computer Science',
        courseCode: 'CS-402',
        courseTitle: 'Cloud Systems',
        topicTaught: 'Raft Consensus',
        classBatch: 'B.Tech CSE 8th Sem',
        scheduledDate: '2026-03-12',
      });

      assert.match(obs.auditRefNumber, /^AAA-\d{4}-COMP-[0-9A-F]{6}$/);
      assert.strictEqual(obs.stage, 'OBSERVATION_SCHEDULED');
      assert.strictEqual(obs.facultyInstructor, 'Prof. Arvind Swaminathan');
    });

    it('submits observation report and calculates SHA-256 audit seal', () => {
      const obs = schedulePeerObservation({
        facultyInstructor: 'Dr. Meenakshi Sundaram',
        peerAuditor: 'Prof. Iyengar',
        department: 'Electrical Engineering',
        courseCode: 'EE-304',
        courseTitle: 'Power Electronics',
        topicTaught: 'Space Vector PWM',
        classBatch: 'B.Tech EEE 6th Sem',
        scheduledDate: '2026-03-15',
      });

      const reportScores: RubricScores = {
        coursePlanAdherence: 4.5,
        activeLearningEngagement: 4.2,
        ictIntegration: 4.4,
        formativeAssessment: 4.0,
        inclusivityAndSupport: 4.3,
      };

      const submitted = submitObservationReport(obs, {
        scores: reportScores,
        commendations: 'Clear mathematical derivations',
        recommendations: 'Add in-class quick diagnostic poll',
        observationDate: '2026-03-15',
      });

      assert.strictEqual(submitted.stage, 'REPORT_SUBMITTED');
      assert.strictEqual(submitted.compositeAqi, 4.28);
      assert.strictEqual(submitted.qualityGrade, 'COMMENDABLE (A+)');
      assert.match(submitted.cryptographicSeal || '', /^[0-9a-f]{64}$/);
    });

    it('records faculty acknowledgement feedback and exports NAAC Criterion 2.3.1 CSV', () => {
      const obs = schedulePeerObservation({
        facultyInstructor: 'Dr. Vivek Bhattacharya',
        peerAuditor: 'Dr. Aruna Chatterjee',
        department: 'Biotechnology',
        courseCode: 'BT-302',
        courseTitle: 'Genetic Engineering',
        topicTaught: 'CRISPR-Cas9 Guide Design',
        classBatch: 'B.Tech Biotech 6th Sem',
        scheduledDate: '2026-03-20',
      });

      const acknowledged = facultyAcknowledgeAudit(obs, 'Feedback gratefully acknowledged and integrated into course file.');
      assert.strictEqual(acknowledged.stage, 'FACULTY_ACKNOWLEDGED');
      assert.strictEqual(acknowledged.facultyRemarks, 'Feedback gratefully acknowledged and integrated into course file.');

      const csv = exportAcademicAuditLedgerCSV([acknowledged]);
      assert.ok(csv.includes('Audit Reference,Audit Type,Instructor Faculty,Peer Auditor,Department'));
      assert.ok(csv.includes('Dr. Vivek Bhattacharya'));
      assert.ok(csv.includes('CRISPR-Cas9 Guide Design'));
    });
  });
});
