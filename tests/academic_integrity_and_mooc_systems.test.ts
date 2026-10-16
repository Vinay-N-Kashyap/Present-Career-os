import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  determinePlagiarismLevel,
  generatePlagiarismToken,
  generatePlagiarismCaseSeal,
  registerPlagiarismAllegation,
  recordDaipInquiryReport,
  scheduleIaipHearing,
  adjudicateFinalPenalty,
  exportPlagiarismTribunalCSV,
} from '../src/lib/admin/centralAcademicIntegrity';

import {
  UGC_MOOC_API_POINTS_MATRIX,
  MIN_PROCTORED_PASS_PERCENTAGE,
  evaluateQuadrantCompleteness,
  generateMoocToken,
  generateMoocCourseSeal,
  authorMoocCourse,
  updateQuadrantContent,
  recordProctoredExamResults,
  exportFacultyMoocCoursesCSV,
} from '../src/lib/teacher/facultyMoocCourse';

describe('TASK-1010: Master Academic Integrity & SWAYAM MOOC Systems Test Suite', () => {
  describe('TASK-1006: Central University Academic Integrity & Plagiarism Prevention Tribunal Engine', () => {
    it('1. generates unique plagiarism tracking token matching PLAG-[YEAR]-[DEPT]-[HEX6]', () => {
      const token = generatePlagiarismToken('Computer Science', 2026);
      assert.match(token, /^PLAG-2026-COMP-[0-9A-F]{6}$/);

      const token2 = generatePlagiarismToken('EEE', 2026);
      assert.match(token2, /^PLAG-2026-EEE-[0-9A-F]{6}$/);
    });

    it('2. evaluates UGC 2018 Academic Integrity Regulations similarity levels and statutory penalties', () => {
      // Level 0: <= 10.0%
      const l0 = determinePlagiarismLevel(8.5);
      assert.strictEqual(l0.level, 'LEVEL_0_TOLERABLE');
      assert.match(l0.studentPenalty, /No penalty applicable/);

      // Level 1: > 10.0% and <= 40.0%
      const l1 = determinePlagiarismLevel(25.0);
      assert.strictEqual(l1.level, 'LEVEL_1_MINOR');
      assert.match(l1.studentPenalty, /up to 6 months/);
      assert.match(l1.facultyPenalty, /Mandatory withdrawal of manuscript/);

      // Level 2: > 40.0% and <= 60.0%
      const l2 = determinePlagiarismLevel(48.5);
      assert.strictEqual(l2.level, 'LEVEL_2_MODERATE');
      assert.match(l2.studentPenalty, /period of 1 year/);
      assert.match(l2.facultyPenalty, /forfeiture of 1 annual increment/);

      // Level 3: > 60.0%
      const l3 = determinePlagiarismLevel(72.0);
      assert.strictEqual(l3.level, 'LEVEL_3_SEVERE');
      assert.match(l3.studentPenalty, /cancellation of academic registration/);
      assert.match(l3.facultyPenalty, /forfeiture of 2 consecutive annual increments/);
    });

    it('3. registers plagiarism allegation and enforces initial stage based on similarity thresholds', () => {
      // Level 0 registration immediately exonerates as compliant
      const exonerated = registerPlagiarismAllegation({
        documentTitle: 'Undergraduate Term Paper',
        respondentName: 'Aarav Kumar',
        respondentRole: 'POSTGRADUATE_STUDENT',
        department: 'CSE',
        complainantType: 'EXAMINER',
        rawSimilarityPercentage: 12.0,
        netSimilarityPercentage: 8.0, // <= 10%
        daipChairmanName: 'Prof. Ramesh Sharma',
      });
      assert.strictEqual(exonerated.stage, 'EXONERATED_COMPLIANT');
      assert.strictEqual(exonerated.plagiarismLevel, 'LEVEL_0_TOLERABLE');

      // Level 2 registration enters ALLEGATION_REGISTERED stage
      const moderate = registerPlagiarismAllegation({
        documentTitle: 'Doctoral Dissertation in Distributed Algorithms',
        respondentName: 'Suresh Patil',
        respondentRole: 'RESEARCH_SCHOLAR',
        department: 'CSE',
        complainantType: 'EXAMINER',
        rawSimilarityPercentage: 54.0,
        netSimilarityPercentage: 48.0, // > 40% to 60%
        daipChairmanName: 'Prof. Ramesh Sharma',
      });
      assert.strictEqual(moderate.stage, 'ALLEGATION_REGISTERED');
      assert.strictEqual(moderate.plagiarismLevel, 'LEVEL_2_MODERATE');
      assert.ok(moderate.cryptographicSeal);
      assert.strictEqual(moderate.cryptographicSeal.length, 64);

      // Throws on out-of-bounds similarity percentage
      assert.throws(
        () =>
          registerPlagiarismAllegation({
            documentTitle: 'Invalid',
            respondentName: 'Test',
            respondentRole: 'FACULTY_AUTHOR',
            department: 'ME',
            complainantType: 'CHIEF_EDITOR',
            rawSimilarityPercentage: 120,
            netSimilarityPercentage: 105,
            daipChairmanName: 'Prof. HOD',
          }),
        /Similarity percentage must be bounded/
      );
    });

    it('4. records DAIP preliminary inquiry report and updates confirmed similarity and stage', () => {
      const caseRecord = registerPlagiarismAllegation({
        documentTitle: 'Solid State DC Breakers',
        respondentName: 'Dr. Vivek Joshi',
        respondentRole: 'FACULTY_AUTHOR',
        department: 'EEE',
        complainantType: 'CHIEF_EDITOR',
        rawSimilarityPercentage: 25.0,
        netSimilarityPercentage: 22.0,
        daipChairmanName: 'Dr. Neha Kulkarni',
      });

      const reported = recordDaipInquiryReport(
        caseRecord,
        'DAIP verified overlap in survey section. Manuscript withdrawal recommended.',
        18.5
      );

      assert.strictEqual(reported.stage, 'DAIP_REPORT_SUBMITTED');
      assert.strictEqual(reported.netSimilarityPercentage, 18.5);
      assert.strictEqual(reported.plagiarismLevel, 'LEVEL_1_MINOR');
      assert.strictEqual(reported.daipFindings, 'DAIP verified overlap in survey section. Manuscript withdrawal recommended.');
    });

    it('5. schedules IAIP hearing and executes final statutory penalty order with resolution seal', () => {
      const caseRecord = registerPlagiarismAllegation({
        documentTitle: 'Doctoral Thesis',
        respondentName: 'Suresh Patil',
        respondentRole: 'RESEARCH_SCHOLAR',
        department: 'CSE',
        complainantType: 'EXAMINER',
        rawSimilarityPercentage: 50.0,
        netSimilarityPercentage: 45.0,
        daipChairmanName: 'Prof. Sharma',
      });

      const daipReported = recordDaipInquiryReport(
        caseRecord,
        'Verbatim text matches confirmed without citation.',
        45.0
      );

      // Cannot execute final penalty before scheduling IAIP hearing
      assert.throws(
        () => adjudicateFinalPenalty(daipReported, 'IAIP-ORD-2026-01'),
        /Final penalty adjudication requires formal IAIP hearing stage/
      );

      // Schedule IAIP hearing
      const scheduled = scheduleIaipHearing(
        daipReported,
        'Prof. B. K. Ramanathan (Dean Academic Affairs)',
        '2026-03-20'
      );
      assert.strictEqual(scheduled.stage, 'IAIP_HEARING_SCHEDULED');
      assert.strictEqual(scheduled.iaipChairmanName, 'Prof. B. K. Ramanathan (Dean Academic Affairs)');

      // Adjudicate final order
      const adjudicated = adjudicateFinalPenalty(scheduled, 'IAIP-ORD-2026-08');
      assert.strictEqual(adjudicated.stage, 'FINAL_PENALTY_ADJUDICATED');
      assert.strictEqual(adjudicated.finalOrderResolutionNumber, 'IAIP-ORD-2026-08');
      assert.notStrictEqual(adjudicated.cryptographicSeal, caseRecord.cryptographicSeal);
    });
  });

  describe('TASK-1008: Faculty MOOC Course Authoring & SWAYAM/NPTEL E-Content Repository Engine', () => {
    it('6. generates unique MOOC course tracking token matching MOOC-[YEAR]-[DEPT]-[HEX6]', () => {
      const token = generateMoocToken('Computer Science', 2026);
      assert.match(token, /^MOOC-2026-COMP-[0-9A-F]{6}$/);

      const token2 = generateMoocToken('EEE', 2026);
      assert.match(token2, /^MOOC-2026-EEE-[0-9A-F]{6}$/);
    });

    it('7. authors MOOC course proposal with UGC CAS Table 2 scoring (4-credit 20 pts, 2-credit 10 pts, module 5 pts)', () => {
      assert.strictEqual(UGC_MOOC_API_POINTS_MATRIX.FOUR_CREDIT_MOOC_COURSE, 20);
      assert.strictEqual(UGC_MOOC_API_POINTS_MATRIX.TWO_CREDIT_MOOC_COURSE, 10);
      assert.strictEqual(UGC_MOOC_API_POINTS_MATRIX.MOOC_MODULE_DEVELOPMENT, 5);
      assert.strictEqual(UGC_MOOC_API_POINTS_MATRIX.COURSE_COORDINATOR_4_CREDIT, 8);

      const course = authorMoocCourse({
        courseTitle: 'Cloud-Native Distributed Computing',
        department: 'CSE',
        leadCoordinatorName: 'Dr. Siddharth Sen',
        leadCoordinatorEmpId: 'EMP-CSE-042',
        nationalCoordinator: 'NPTEL',
        contributionType: 'FOUR_CREDIT_MOOC_COURSE',
        credits: 4,
        totalModulesCount: 12,
        durationWeeks: 12,
      });

      assert.strictEqual(course.ugcApiPoints, 20);
      assert.strictEqual(course.credits, 4);
      assert.strictEqual(course.stage, 'PROPOSAL_SUBMITTED');
      assert.ok(course.cryptographicCourseSeal);
      assert.strictEqual(course.cryptographicCourseSeal.length, 64);

      // Throws on zero credits or weeks
      assert.throws(
        () =>
          authorMoocCourse({
            courseTitle: 'Invalid',
            department: 'CSE',
            leadCoordinatorName: 'Dr. Sen',
            leadCoordinatorEmpId: 'EMP-01',
            nationalCoordinator: 'NPTEL',
            contributionType: 'TWO_CREDIT_MOOC_COURSE',
            credits: 0,
            totalModulesCount: 6,
            durationWeeks: 8,
          }),
        /Course credits must be strictly greater than 0/
      );
    });

    it('8. evaluates 4-quadrant e-learning architecture completeness (e-Tutorial, e-Content, Web Resources, Assessment)', () => {
      // 0 quadrants
      assert.strictEqual(
        evaluateQuadrantCompleteness({
          quadrant1ETutorial: false,
          quadrant2EContent: false,
          quadrant3WebResources: false,
          quadrant4SelfAssessment: false,
        }),
        0
      );

      // 2 quadrants = 50%
      assert.strictEqual(
        evaluateQuadrantCompleteness({
          quadrant1ETutorial: true,
          quadrant2EContent: true,
          quadrant3WebResources: false,
          quadrant4SelfAssessment: false,
        }),
        50
      );

      // 4 quadrants = 100%
      assert.strictEqual(
        evaluateQuadrantCompleteness({
          quadrant1ETutorial: true,
          quadrant2EContent: true,
          quadrant3WebResources: true,
          quadrant4SelfAssessment: true,
        }),
        100
      );

      const course = authorMoocCourse({
        courseTitle: 'Power Semiconductors',
        department: 'EEE',
        leadCoordinatorName: 'Dr. Neha Kulkarni',
        leadCoordinatorEmpId: 'EMP-EEE-018',
        nationalCoordinator: 'CEC',
        contributionType: 'TWO_CREDIT_MOOC_COURSE',
        credits: 2,
        totalModulesCount: 8,
        durationWeeks: 8,
        quadrants: { quadrant1ETutorial: true, quadrant2EContent: true },
      });

      // Update to 100% complete
      const updated = updateQuadrantContent(course, {
        quadrant1ETutorial: true,
        quadrant2EContent: true,
        quadrant3WebResources: true,
        quadrant4SelfAssessment: true,
      });

      assert.strictEqual(updated.stage, 'CONTENT_DEVELOPED');
      assert.strictEqual(evaluateQuadrantCompleteness(updated.quadrants), 100);
    });

    it('9. records proctored exam results and verifies Academic Bank of Credits (ABC) transfer clearance (>= 40% hurdle)', () => {
      assert.strictEqual(MIN_PROCTORED_PASS_PERCENTAGE, 40.0);

      const course = authorMoocCourse({
        courseTitle: 'AI in Power Systems',
        department: 'EEE',
        leadCoordinatorName: 'Dr. Neha Kulkarni',
        leadCoordinatorEmpId: 'EMP-EEE-018',
        nationalCoordinator: 'NPTEL',
        contributionType: 'TWO_CREDIT_MOOC_COURSE',
        credits: 2,
        totalModulesCount: 8,
        durationWeeks: 8,
      });

      const readyCourse = updateQuadrantContent(course, {
        quadrant1ETutorial: true,
        quadrant2EContent: true,
        quadrant3WebResources: true,
        quadrant4SelfAssessment: true,
      });

      // Passing exam (75.5% >= 40%) -> Clears ABC transfer
      const cleared = recordProctoredExamResults(readyCourse, 2500, 75.5);
      assert.strictEqual(cleared.isAbcTransferEligible, true);
      assert.strictEqual(cleared.stage, 'ABC_CREDITS_TRANSFERRED');
      assert.strictEqual(cleared.enrolledLearnersCount, 2500);

      // Failing exam (35.0% < 40%) -> Ineligible for ABC transfer
      const failed = recordProctoredExamResults(readyCourse, 2500, 35.0);
      assert.strictEqual(failed.isAbcTransferEligible, false);
      assert.strictEqual(failed.stage, 'EXAM_CONDUCTED');
    });

    it('10. exports valid and deterministic CSV ledgers for both Academic Integrity and SWAYAM MOOC engines', () => {
      const plagCase = registerPlagiarismAllegation({
        documentTitle: 'Memory Allocators',
        respondentName: 'Suresh Patil',
        respondentRole: 'RESEARCH_SCHOLAR',
        department: 'CSE',
        complainantType: 'EXAMINER',
        rawSimilarityPercentage: 52.0,
        netSimilarityPercentage: 46.0,
        daipChairmanName: 'Prof. Sharma',
      });

      const plagCsv = exportPlagiarismTribunalCSV([plagCase]);
      assert.ok(plagCsv.includes('Case ID,Tracking Token,Document Title,Respondent Name'));
      assert.ok(plagCsv.includes('"Memory Allocators"'));
      assert.ok(plagCsv.includes('"Suresh Patil"'));

      const moocCourse = authorMoocCourse({
        courseTitle: 'Cloud Distributed Systems',
        department: 'CSE',
        leadCoordinatorName: 'Dr. Siddharth Sen',
        leadCoordinatorEmpId: 'EMP-CSE-042',
        nationalCoordinator: 'NPTEL',
        contributionType: 'FOUR_CREDIT_MOOC_COURSE',
        credits: 4,
        totalModulesCount: 12,
        durationWeeks: 12,
      });

      const moocCsv = exportFacultyMoocCoursesCSV([moocCourse]);
      assert.ok(moocCsv.includes('Course ID,Tracking Token,Course Title,Department,Lead Coordinator'));
      assert.ok(moocCsv.includes('"Cloud Distributed Systems"'));
      assert.ok(moocCsv.includes('"NPTEL"'));
    });
  });
});
