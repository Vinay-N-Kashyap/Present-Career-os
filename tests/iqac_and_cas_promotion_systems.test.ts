/**
 * Master IQAC Accreditation & Faculty CAS Promotion Systems Test Suite (TASK-940)
 * 
 * Verifies:
 * 1. Internal Quality Assurance Cell (IQAC) & NAAC AQAR Synthesizer Engine (TASK-936).
 * 2. 7 Statutory NAAC criteria weighted CGPA calculation (0.00 - 4.00) and grade banding (A++, A+, etc.).
 * 3. Dynamic criterion grade point adjustment and real-time accreditation status updates.
 * 4. Digital seal digest hashing and NAAC portal submission state machine.
 * 5. Statutory AQAR summary CSV report generation.
 * 6. Faculty Career Advancement Scheme (CAS) Promotion Dossier Engine (TASK-938).
 * 7. UGC 2018 statutory eligibility invariants across Stages 1 through 5.
 * 8. External subject expert peer review scoring and recommendation aggregation.
 * 9. Dossier lifecycle progression (IQAC Scrutiny -> Peer Review -> Promotion Sanction).
 * 10. UGC CAS Promotion Dossier Registry CSV export.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  seedIqacData,
  resetIqacStore,
  getAqarReports,
  createAqarReport,
  updateCriterionScore,
  submitAqarToNaacPortal,
  computeNaacGrade,
  calculateCompositeCgpa,
  exportAqarReportCSV,
  NAAC_CRITERIA_METADATA
} from '../src/lib/admin/iqacAccreditation';

import {
  seedCasDossierData,
  resetCasStore,
  getCasDossiers,
  submitCasDossier,
  advanceDossierStatus,
  recordExternalPeerReview,
  validateCasEligibility,
  computeFacultyCasSummary,
  exportCasDossierRegistryCSV
} from '../src/lib/teacher/casPromotionDossier';

describe('TASK-940: IQAC Accreditation & Faculty CAS Promotion Systems Suite', () => {
  const TEST_INSTITUTION = 'inst-apex-test';

  beforeEach(() => {
    resetIqacStore();
    seedIqacData(TEST_INSTITUTION);

    resetCasStore();
    seedCasDossierData(TEST_INSTITUTION);
  });

  describe('TASK-936: Internal Quality Assurance Cell (IQAC) & NAAC AQAR Engine', () => {
    it('calculates NAAC grade and status deterministically based on CGPA thresholds', () => {
      assert.deepEqual(computeNaacGrade(3.85), { grade: 'A++', status: 'ACCREDITED' });
      assert.deepEqual(computeNaacGrade(3.35), { grade: 'A+', status: 'ACCREDITED' });
      assert.deepEqual(computeNaacGrade(3.10), { grade: 'A', status: 'ACCREDITED' });
      assert.deepEqual(computeNaacGrade(2.80), { grade: 'B++', status: 'ACCREDITED' });
      assert.deepEqual(computeNaacGrade(2.60), { grade: 'B+', status: 'ACCREDITED' });
      assert.deepEqual(computeNaacGrade(2.20), { grade: 'B', status: 'ACCREDITED' });
      assert.deepEqual(computeNaacGrade(1.70), { grade: 'C', status: 'ACCREDITED' });
      assert.deepEqual(computeNaacGrade(1.20), { grade: 'UNACCREDITED', status: 'NOT_ACCREDITED' });
    });

    it('creates an AQAR report and calculates composite weighted CGPA correctly', () => {
      const res = createAqarReport({
        institutionId: TEST_INSTITUTION,
        academicYear: '2026-2027',
        cycleNumber: 3,
        iqacCoordinatorName: 'Prof. K. R. Ramanathan',
        headOfInstitutionName: 'Dr. Vikramaditya Sen',
        criterionGradePoints: {
          CRITERION_1_CURRICULAR: 3.80,
          CRITERION_2_TEACHING_EVALUATION: 3.85,
          CRITERION_3_RESEARCH_INNOVATION: 3.75,
          CRITERION_4_INFRASTRUCTURE: 3.70,
          CRITERION_5_STUDENT_SUPPORT: 3.90,
          CRITERION_6_GOVERNANCE_MANAGEMENT: 3.70,
          CRITERION_7_INSTITUTIONAL_VALUES: 3.80
        }
      });

      assert.equal(res.success, true);
      assert.ok(res.report?.id.startsWith('AQAR-2026-'));
      assert.ok(res.report?.cgpa >= 3.75 && res.report?.cgpa <= 3.85);
      assert.equal(res.report?.projectedGrade, 'A++');
      assert.equal(res.report?.accreditationStatus, 'ACCREDITED');
      assert.ok(res.report?.digitalSealDigest.startsWith('SHA256:'));
    });

    it('rejects invalid or out-of-range criterion grade points', () => {
      const res = createAqarReport({
        institutionId: TEST_INSTITUTION,
        academicYear: '2026-2027',
        cycleNumber: 3,
        iqacCoordinatorName: 'Prof. K. R. Ramanathan',
        headOfInstitutionName: 'Dr. Vikramaditya Sen',
        criterionGradePoints: {
          CRITERION_1_CURRICULAR: 4.5, // Invalid > 4.0
          CRITERION_2_TEACHING_EVALUATION: 3.85,
          CRITERION_3_RESEARCH_INNOVATION: 3.75,
          CRITERION_4_INFRASTRUCTURE: 3.70,
          CRITERION_5_STUDENT_SUPPORT: 3.90,
          CRITERION_6_GOVERNANCE_MANAGEMENT: 3.70,
          CRITERION_7_INSTITUTIONAL_VALUES: 3.80
        }
      });

      assert.equal(res.success, false);
      assert.ok(res.error?.includes('INVALID_GRADE_POINT'));
    });

    it('updates criterion score dynamically and recalculates composite CGPA', () => {
      const report = getAqarReports(TEST_INSTITUTION)[0];
      const initialCgpa = report.cgpa;

      // Update Criterion 2 (Weight 350)
      const res = updateCriterionScore(report.id, 'CRITERION_2_TEACHING_EVALUATION', 2.0);
      assert.equal(res.success, true);
      assert.ok(res.report!.cgpa < initialCgpa);
    });

    it('submits AQAR report to NAAC portal and exports statutory CSV', () => {
      const report = getAqarReports(TEST_INSTITUTION)[0];
      const submitted = submitAqarToNaacPortal(report.id);

      assert.equal(submitted.success, true);
      assert.equal(submitted.report?.submittedToNaacPortal, true);
      assert.ok(submitted.report?.submissionDate);

      const csv = exportAqarReportCSV(TEST_INSTITUTION);
      assert.ok(csv.includes('=== NAAC STATUTORY ANNUAL QUALITY ASSURANCE REPORT (AQAR) SUMMARY ==='));
      assert.ok(csv.includes('AQAR-2026-APEX01'));
      assert.ok(csv.includes('A++'));
    });
  });

  describe('TASK-938: Faculty Career Advancement Scheme (CAS) Promotion Dossier Engine', () => {
    it('validates UGC 2018 promotion eligibility across different career stages', () => {
      // Ineligible Stage 1 to 2 (only 2 years service instead of 4)
      const test1 = validateCasEligibility({
        casStage: 'STAGE_1_TO_2',
        yearsInCurrentGrade: 2,
        claimedApiScore: 50,
        scopusPublicationsCount: 2,
        phdScholarsGuidedCount: 0
      });
      assert.equal(test1.isEligible, false);
      assert.ok(test1.error?.includes('SERVICE_YEARS_INSUFFICIENT'));

      // Ineligible Full Professor (Stage 4 to 5: missing PhD guidance)
      const test2 = validateCasEligibility({
        casStage: 'STAGE_4_TO_5_PROFESSOR',
        yearsInCurrentGrade: 4,
        claimedApiScore: 130,
        scopusPublicationsCount: 12,
        phdScholarsGuidedCount: 0 // Ineligible (needs >= 1 PhD guided)
      });
      assert.equal(test2.isEligible, false);
      assert.ok(test2.error?.includes('PHD_SUPERVISION_DEFICIT'));

      // Eligible Associate Professor (Stage 3 to 4)
      const test3 = validateCasEligibility({
        casStage: 'STAGE_3_TO_4_ASSOC_PROF',
        yearsInCurrentGrade: 3,
        claimedApiScore: 75,
        scopusPublicationsCount: 4,
        phdScholarsGuidedCount: 0
      });
      assert.equal(test3.isEligible, true);
    });

    it('submits valid CAS dossier and advances through IQAC scrutiny with clearance seal', () => {
      const res = submitCasDossier({
        institutionId: TEST_INSTITUTION,
        facultyId: 'FAC-CS-002',
        facultyName: 'Dr. Evelyn Zhang',
        department: 'Computer Science & Engineering',
        currentDesignation: 'Assistant Professor (Level 12)',
        targetDesignation: 'Associate Professor (Level 13A)',
        casStage: 'STAGE_3_TO_4_ASSOC_PROF',
        yearsInCurrentGrade: 3,
        claimedApiScore: 85,
        scopusPublicationsCount: 6,
        patentsCount: 1,
        phdScholarsGuidedCount: 0
      });

      assert.equal(res.success, true);
      assert.ok(res.dossier?.id.startsWith('DOS-'));
      assert.equal(res.dossier?.status, 'SUBMITTED_TO_IQAC');

      // Advance to IQAC Scrutiny Cleared
      const scrutinized = advanceDossierStatus(res.dossier!.id, 'IQAC_SCRUTINY_CLEARED', {
        verifiedApiScore: 82
      });
      assert.equal(scrutinized.success, true);
      assert.equal(scrutinized.dossier?.status, 'IQAC_SCRUTINY_CLEARED');
      assert.equal(scrutinized.dossier?.verifiedApiScore, 82);
      assert.ok(scrutinized.dossier?.iqacClearanceDigest?.startsWith('SHA256:'));
    });

    it('records external subject expert peer reviews and issues promotion order', () => {
      const dossier = getCasDossiers(TEST_INSTITUTION, { casStage: 'STAGE_4_TO_5_PROFESSOR' })[0];
      assert.ok(dossier);
      assert.equal(dossier.externalPeerReviews.length, 2);
      assert.equal(dossier.averagePeerReviewScore, 90);
      assert.equal(dossier.status, 'EXTERNAL_PEER_REVIEW_APPROVED');

      // Issue formal promotion sanction order
      const promoted = advanceDossierStatus(dossier.id, 'PROMOTION_ORDER_ISSUED', {
        promotionOrderNumber: 'UGC-CAS-ORDER-2026-99'
      });
      assert.equal(promoted.success, true);
      assert.equal(promoted.dossier?.status, 'PROMOTION_ORDER_ISSUED');
      assert.equal(promoted.dossier?.promotionOrderNumber, 'UGC-CAS-ORDER-2026-99');
      assert.ok(promoted.dossier?.selectionCommitteeApprovalDate);
    });

    it('computes faculty CAS summary and exports promotion dossier registry CSV', () => {
      const summary = computeFacultyCasSummary('FAC-CS-001', TEST_INSTITUTION);
      assert.equal(summary.facultyName, 'Dr. Aris Thorne');
      assert.ok(summary.totalVerifiedApi >= 110);
      assert.equal(summary.isEligibleForPromotion, true);

      const csv = exportCasDossierRegistryCSV(TEST_INSTITUTION);
      assert.ok(csv.includes('=== UGC CAREER ADVANCEMENT SCHEME (CAS) PROMOTION DOSSIER REGISTRY ==='));
      assert.ok(csv.includes('Dr. Aris Thorne'));
      assert.ok(csv.includes('Professor (Level 14)'));
    });
  });
});
