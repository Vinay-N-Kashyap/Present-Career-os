/**
 * Master Anti-Ragging Tribunal & Student Evaluation of Teaching Systems Test Suite (TASK-920)
 * 
 * Verifies:
 * 1. University Anti-Ragging Cell & Disciplinary Tribunal Engine (TASK-916).
 * 2. Whistleblower token generation (ARC-[HEX10]) and complainant anonymity protections.
 * 3. Anti-Ragging Squad (ARS) patrol dispatch, investigation, and hearing scheduling.
 * 4. Disciplinary tribunal sanctions (Hostel Eviction, Semester Rustication, Expulsion & FIR).
 * 5. Statutory 7-day Action Taken Report (ATR) watchdog and UGC CSV export.
 * 6. Student Evaluation of Teaching (SET) & Teacher Effectiveness Index Engine (TASK-918).
 * 7. 5-Dimension Likert (1-5) evaluation and anti-ballot-stuffing student token deduplication.
 * 8. Deterministic Teacher Effectiveness Index (TEI: 0 - 100) and performance banding.
 * 9. Automated sentiment classification on qualitative student reflections.
 * 10. NAAC Criterion 2.7 Student Satisfaction Survey (SSS) 60% quorum check & CSV export.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  seedAntiRaggingData,
  resetAntiRaggingStore,
  getIncidents,
  lodgeAntiRaggingIncident,
  advanceIncidentStage,
  evaluateSlaCompliance,
  computeTribunalSummary,
  exportAntiRaggingATRReportCSV
} from '../src/lib/admin/antiRaggingTribunal';

import {
  seedStudentFeedbackData,
  resetFeedbackStore,
  getFeedbackSubmissions,
  submitStudentFeedback,
  computeTeacherTEI,
  detectSentiment,
  exportNaacSssCSV
} from '../src/lib/teacher/studentFeedback';

describe('TASK-920: Anti-Ragging Tribunal & Student Evaluation of Teaching Suite', () => {
  const TEST_INSTITUTION = 'inst-apex-test';

  beforeEach(() => {
    resetAntiRaggingStore();
    seedAntiRaggingData(TEST_INSTITUTION);

    resetFeedbackStore();
    seedStudentFeedbackData(TEST_INSTITUTION);
  });

  describe('TASK-916: University Anti-Ragging Cell & Disciplinary Tribunal Engine', () => {
    it('lodges an incident with an anonymous ARC-[HEX10] token and 7-day statutory SLA', () => {
      const incident = lodgeAntiRaggingIncident({
        institutionId: TEST_INSTITUTION,
        category: 'PHYSICAL_ASSAULT',
        location: 'Hostel Dining Hall Corridor',
        incidentTimestamp: '2026-10-10T20:00:00Z',
        isAnonymous: true,
        complainantIdentifier: 'Freshman Student',
        accusedStudentIds: ['STU-SR-901'],
        accusedStudentNames: ['Vikram Singhania'],
        witnessNames: ['Mess Staff Member'],
        description: 'Physical confrontation and coercion to perform menial tasks.'
      });

      assert.ok(incident.id.startsWith('ARC-'));
      assert.equal(incident.category, 'PHYSICAL_ASSAULT');
      assert.equal(incident.stage, 'LODGED');
      assert.equal(incident.isAnonymous, true);
      assert.ok(incident.complainantHash.startsWith('ANON-'));
      assert.equal(incident.accusedStudentNames[0], 'Vikram Singhania');

      // Check SLA deadline is ~7 days ahead of creation
      const createdMs = new Date(incident.createdAt).getTime();
      const deadlineMs = new Date(incident.statutorySlaDeadline).getTime();
      const diffDays = Math.round((deadlineMs - createdMs) / (1000 * 60 * 60 * 24));
      assert.equal(diffDays, 7);
    });

    it('advances incident stage through squad investigation and tribunal hearing', () => {
      const incident = lodgeAntiRaggingIncident({
        institutionId: TEST_INSTITUTION,
        category: 'FINANCIAL_EXTORTION',
        location: 'Campus Canteen North',
        incidentTimestamp: '2026-10-11T13:00:00Z',
        isAnonymous: false,
        complainantIdentifier: 'Rohit Sharma (Roll 2026-CS-045)',
        accusedStudentIds: ['STU-SR-902'],
        accusedStudentNames: ['Manish Verma'],
        description: 'Demanded cash payment for access to badminton court.'
      });

      // 1. Assign Squad Officer
      const step1 = advanceIncidentStage(incident.id, 'SQUAD_INVESTIGATING', {
        squadOfficer: 'Capt. Sunita Rao (Anti-Ragging Squad)'
      });
      assert.equal(step1.success, true);
      assert.equal(step1.incident?.stage, 'SQUAD_INVESTIGATING');
      assert.equal(step1.incident?.assignedSquadOfficer, 'Capt. Sunita Rao (Anti-Ragging Squad)');

      // 2. Schedule Tribunal Hearing
      const step2 = advanceIncidentStage(incident.id, 'TRIBUNAL_HEARING_SCHEDULED', {
        hearingDate: '2026-10-14T11:00:00Z'
      });
      assert.equal(step2.success, true);
      assert.equal(step2.incident?.stage, 'TRIBUNAL_HEARING_SCHEDULED');
      assert.equal(step2.incident?.tribunalHearingDate, '2026-10-14T11:00:00Z');

      // 3. Pronounce Sanction
      const step3 = advanceIncidentStage(incident.id, 'SANCTION_PRONOUNCED', {
        sanction: 'SEMESTER_RUSTICATION',
        atrNotes: 'Accused suspended for Fall 2026 semester with zero academic credit.'
      });
      assert.equal(step3.success, true);
      assert.equal(step3.incident?.stage, 'SANCTION_PRONOUNCED');
      assert.equal(step3.incident?.pronouncement, 'SEMESTER_RUSTICATION');
      assert.ok(step3.incident?.resolvedAt);
    });

    it('supports police FIR lodgment for gross offenses', () => {
      const incident = lodgeAntiRaggingIncident({
        institutionId: TEST_INSTITUTION,
        category: 'GROSS_HUMILIATION',
        location: 'Off-Campus Private PG Annex',
        incidentTimestamp: '2026-10-12T23:00:00Z',
        isAnonymous: true,
        complainantIdentifier: 'ANON',
        accusedStudentIds: ['STU-SR-903'],
        accusedStudentNames: ['Aditya Chauhan'],
        description: 'Severe hazing incident recorded on mobile phone.'
      });

      const res = advanceIncidentStage(incident.id, 'FIR_LODGED', {
        sanction: 'EXPULSION_AND_FIR_LODGED',
        firNumber: 'FIR-2026/089/CRIMINAL',
        policeStation: 'Cyber Crime & Sector 14 Police Station',
        atrNotes: 'Expelled from university rolls; FIR handed over to Sub-Inspector.'
      });

      assert.equal(res.success, true);
      assert.equal(res.incident?.stage, 'FIR_LODGED');
      assert.equal(res.incident?.firNumber, 'FIR-2026/089/CRIMINAL');
      assert.equal(res.incident?.policeStationName, 'Cyber Crime & Sector 14 Police Station');
    });

    it('evaluates SLA compliance and flags overdue incidents past 7 days', () => {
      const incident = lodgeAntiRaggingIncident({
        institutionId: TEST_INSTITUTION,
        category: 'VERBAL_ABUSE',
        location: 'Library Quad',
        incidentTimestamp: '2026-10-01T10:00:00Z',
        isAnonymous: true,
        complainantIdentifier: 'ANON',
        accusedStudentIds: ['STU-SR-904'],
        accusedStudentNames: ['Kunal Rawat'],
        description: 'Derogatory verbal harassment in library quad.'
      });

      // 10 days later
      const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
      const violations = evaluateSlaCompliance(TEST_INSTITUTION, futureDate);

      assert.ok(violations.some(v => v.id === incident.id));
      assert.equal(violations.find(v => v.id === incident.id)?.isSlaViolated, true);
    });

    it('computes accurate tribunal metrics summary and generates statutory CSV', () => {
      const summary = computeTribunalSummary(TEST_INSTITUTION);
      assert.ok(summary.totalIncidentsLodged >= 1);
      assert.ok(summary.slaCompliancePercent >= 0 && summary.slaCompliancePercent <= 100);

      const csv = exportAntiRaggingATRReportCSV(TEST_INSTITUTION);
      assert.ok(csv.includes('=== UGC ANTI-RAGGING STATUTORY ACTION TAKEN REPORT (ATR) ==='));
      assert.ok(csv.includes('ARC-A4918B091F'));
      assert.ok(csv.includes('HOSTEL_EVICTION'));
    });
  });

  describe('TASK-918: Student Evaluation of Teaching (SET) & TEI Engine', () => {
    it('submits valid student feedback across all 5 dimensions', () => {
      const res = submitStudentFeedback({
        institutionId: TEST_INSTITUTION,
        facultyId: 'FAC-CS-002',
        facultyName: 'Dr. Evelyn Zhang',
        department: 'Computer Science',
        courseCode: 'CS-320',
        courseTitle: 'Database Systems Internals',
        semester: 'Fall 2026',
        academicYear: '2026-2027',
        studentTokenHash: 'TOKEN-STUDENT-Z1',
        ratings: {
          COURSE_DELIVERY: 5,
          SUBJECT_MASTERY: 5,
          GRADING_FAIRNESS: 5,
          DOUBT_AVAILABILITY: 4,
          SOCRATIC_ENGAGEMENT: 5
        },
        qualitativeComments: 'Brilliant deep-dive into B-Tree indexes and WAL logging. Very engaging!'
      });

      assert.equal(res.success, true);
      assert.ok(res.feedback?.id.startsWith('SET-'));
      assert.equal(res.feedback?.facultyId, 'FAC-CS-002');
      assert.equal(res.feedback?.sentiment, 'POSITIVE');
      assert.equal(res.feedback?.ratings.COURSE_DELIVERY, 5);
    });

    it('rejects invalid or out-of-range rating scores', () => {
      const res = submitStudentFeedback({
        institutionId: TEST_INSTITUTION,
        facultyId: 'FAC-CS-002',
        facultyName: 'Dr. Evelyn Zhang',
        department: 'Computer Science',
        courseCode: 'CS-320',
        courseTitle: 'Database Systems Internals',
        semester: 'Fall 2026',
        academicYear: '2026-2027',
        studentTokenHash: 'TOKEN-STUDENT-Z2',
        ratings: {
          COURSE_DELIVERY: 6, // Invalid > 5
          SUBJECT_MASTERY: 5,
          GRADING_FAIRNESS: 4,
          DOUBT_AVAILABILITY: 4,
          SOCRATIC_ENGAGEMENT: 4
        }
      });

      assert.equal(res.success, false);
      assert.ok(res.error?.includes('INVALID_RATING'));
    });

    it('rejects duplicate feedback submission from same student token in same course/semester', () => {
      const token = 'TOKEN-STUDENT-UNIQUE-DEDUP';

      const first = submitStudentFeedback({
        institutionId: TEST_INSTITUTION,
        facultyId: 'FAC-CS-003',
        facultyName: 'Prof. Alistair Finch',
        department: 'Computer Science',
        courseCode: 'CS-204',
        courseTitle: 'Data Structures & Algorithms',
        semester: 'Fall 2026',
        academicYear: '2026-2027',
        studentTokenHash: token,
        ratings: {
          COURSE_DELIVERY: 4,
          SUBJECT_MASTERY: 4,
          GRADING_FAIRNESS: 4,
          DOUBT_AVAILABILITY: 4,
          SOCRATIC_ENGAGEMENT: 4
        }
      });
      assert.equal(first.success, true);

      // Attempt duplicate submission
      const duplicate = submitStudentFeedback({
        institutionId: TEST_INSTITUTION,
        facultyId: 'FAC-CS-003',
        facultyName: 'Prof. Alistair Finch',
        department: 'Computer Science',
        courseCode: 'CS-204',
        courseTitle: 'Data Structures & Algorithms',
        semester: 'Fall 2026',
        academicYear: '2026-2027',
        studentTokenHash: token,
        ratings: {
          COURSE_DELIVERY: 2,
          SUBJECT_MASTERY: 2,
          GRADING_FAIRNESS: 2,
          DOUBT_AVAILABILITY: 2,
          SOCRATIC_ENGAGEMENT: 2
        }
      });
      assert.equal(duplicate.success, false);
      assert.ok(duplicate.error?.includes('DUPLICATE_FEEDBACK_SUBMISSION'));
    });

    it('correctly classifies positive, constructive, and neutral student sentiments', () => {
      assert.equal(detectSentiment('The explanations were brilliant, clear, and very helpful!'), 'POSITIVE');
      assert.equal(detectSentiment('Lectures were confusing and way too fast to follow.'), 'CONSTRUCTIVE');
      assert.equal(detectSentiment('Slides were uploaded on the university portal weekly.'), 'NEUTRAL');
    });

    it('computes Teacher Effectiveness Index (TEI), performance band, and NAAC quorum', () => {
      // Dr. Aris Thorne has 3 seeded reviews in seedStudentFeedbackData
      const tei = computeTeacherTEI('FAC-CS-001', TEST_INSTITUTION, 5); // 5 enrolled students, 3 reviews = 60% quorum

      assert.equal(tei.facultyName, 'Dr. Aris Thorne');
      assert.equal(tei.totalResponses, 3);
      assert.equal(tei.enrolledStudentsCount, 5);
      assert.equal(tei.participationRatePercent, 60);
      assert.equal(tei.isNaacValid, true);

      // High scores should yield exemplary performance band
      assert.ok(tei.teiScore >= 85);
      assert.equal(tei.performanceBand, 'EXEMPLARY');
      assert.ok(tei.dimensionAverages.SUBJECT_MASTERY === 5);
      assert.ok(tei.feedbackDistribution.star5 >= 8);
    });

    it('identifies below-quorum evaluations failing NAAC Criterion 2.7 60% threshold', () => {
      // 3 reviews out of 100 students = 3% participation rate
      const tei = computeTeacherTEI('FAC-CS-001', TEST_INSTITUTION, 100);

      assert.equal(tei.participationRatePercent, 3);
      assert.equal(tei.isNaacValid, false);
    });

    it('exports official NAAC Criterion 2.7 Student Satisfaction Survey CSV', () => {
      const csv = exportNaacSssCSV(TEST_INSTITUTION);

      assert.ok(csv.includes('=== NAAC CRITERION 2.7: STUDENT SATISFACTION SURVEY (SSS) REPORT ==='));
      assert.ok(csv.includes('FAC-CS-001'));
      assert.ok(csv.includes('CS-301'));
      assert.ok(csv.includes('Distributed Systems & Cloud Computing'));
      assert.ok(csv.includes('POSITIVE'));
    });
  });
});
