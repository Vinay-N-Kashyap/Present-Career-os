/**
 * Master Scholarships & Faculty Sabbatical Systems Test Suite (TASK-915)
 * 
 * Verifies:
 * 1. Student Scholarship & Financial Aid Disbursement Engine (TASK-911).
 * 2. Minimum CGPA, family income ceiling, and attendance compliance validations.
 * 3. DBT Direct Beneficiary Transfer UTR transaction recording and scheme budget limits.
 * 4. Faculty Sabbatical & Academic Deputation Governance Engine (TASK-913).
 * 5. UGC 6-year continuous active service rule and 12-month duration limit invariants.
 * 6. Academic deputation lien preservation and review workflow (HoD -> Sanction -> Report).
 * 7. NAAC Criterion 5.1 and UGC statutory leave CSV export formatting.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  seedScholarshipData,
  resetScholarshipStore,
  getSchemes,
  getApplications,
  registerScholarshipScheme,
  applyForScholarship,
  updateApplicationStatus,
  computeFinancialAidSummary,
  exportScholarshipLedgerCSV
} from '../src/lib/admin/scholarshipManagement';

import {
  seedSabbaticalData,
  resetSabbaticalStore,
  getSabbaticalApplications,
  requestSabbaticalLeave,
  updateSabbaticalStatus,
  computeLeaveSummary,
  exportSabbaticalLeaveCSV
} from '../src/lib/teacher/sabbaticalLeave';

describe('TASK-915: Scholarships & Faculty Sabbatical Systems Suite', () => {
  const TEST_INSTITUTION = 'inst-apex-test';

  beforeEach(() => {
    resetScholarshipStore();
    seedScholarshipData(TEST_INSTITUTION);

    resetSabbaticalStore();
    seedSabbaticalData(TEST_INSTITUTION);
  });

  describe('TASK-911: Student Scholarship & Financial Aid Disbursement Engine', () => {
    it('registers new scholarship schemes with defined criteria and budgets', () => {
      const scheme = registerScholarshipScheme({
        institutionId: TEST_INSTITUTION,
        name: 'Women in Computing Fellowship',
        type: 'CORPORATE_CSR',
        fundingBody: 'Tech Innovations CSR Foundation',
        annualBudgetINR: 1000000,
        awardAmountPerStudentINR: 40000,
        minCgpa: 8.0,
        maxFamilyIncomeINR: 600000,
        minAttendancePercent: 80,
        activeAcademicYear: '2025-2026'
      });

      assert.match(scheme.schemeId, /^SCH-/);
      assert.equal(scheme.annualBudgetINR, 1000000);
      assert.equal(scheme.disbursedAmountINR, 0);

      const schemes = getSchemes(TEST_INSTITUTION);
      assert.ok(schemes.some(s => s.schemeId === scheme.schemeId));
    });

    it('enforces CGPA, family income ceiling, attendance, and duplicate application invariants', () => {
      // 1. CGPA Deficit: SCH-01 requires min CGPA 8.5
      const lowCgpaRes = applyForScholarship({
        institutionId: TEST_INSTITUTION,
        schemeId: 'SCH-01',
        studentId: 'STU-1002',
        studentName: 'Vikram Patel',
        enrollmentNumber: 'ENG-2023-089',
        department: 'CSE',
        semester: 6,
        cgpa: 7.8, // < 8.5
        annualFamilyIncomeINR: 300000,
        attendancePercent: 85,
        bankAccountNumber: '91823091',
        bankIfsc: 'HDFC0001'
      });
      assert.equal(lowCgpaRes.success, false);
      assert.ok(lowCgpaRes.error?.includes('INELIGIBLE_CGPA'));

      // 2. Income Ceiling Exceeded: SCH-02 requires max family income <= 400,000 INR
      const highIncomeRes = applyForScholarship({
        institutionId: TEST_INSTITUTION,
        schemeId: 'SCH-02',
        studentId: 'STU-1003',
        studentName: 'Rohan Gupta',
        enrollmentNumber: 'ENG-2023-112',
        department: 'CSE',
        semester: 6,
        cgpa: 8.2,
        annualFamilyIncomeINR: 650000, // > 400,000
        attendancePercent: 85,
        bankAccountNumber: '91823092',
        bankIfsc: 'HDFC0001'
      });
      assert.equal(highIncomeRes.success, false);
      assert.ok(highIncomeRes.error?.includes('INCOME_CEILING_EXCEEDED'));

      // 3. Attendance Deficit: SCH-01 requires min attendance >= 80%
      const lowAttendanceRes = applyForScholarship({
        institutionId: TEST_INSTITUTION,
        schemeId: 'SCH-01',
        studentId: 'STU-1004',
        studentName: 'Sameer Sen',
        enrollmentNumber: 'ENG-2023-145',
        department: 'CSE',
        semester: 6,
        cgpa: 8.9,
        annualFamilyIncomeINR: 300000,
        attendancePercent: 72, // < 80%
        bankAccountNumber: '91823093',
        bankIfsc: 'HDFC0001'
      });
      assert.equal(lowAttendanceRes.success, false);
      assert.ok(lowAttendanceRes.error?.includes('ATTENDANCE_DEFICIT'));

      // 4. Duplicate Application: Aarav (STU-1001) is already in SCH-01
      const duplicateRes = applyForScholarship({
        institutionId: TEST_INSTITUTION,
        schemeId: 'SCH-01',
        studentId: 'STU-1001',
        studentName: 'Aarav Sharma',
        enrollmentNumber: 'ENG-2023-014',
        department: 'CSE',
        semester: 6,
        cgpa: 9.1,
        annualFamilyIncomeINR: 450000,
        attendancePercent: 92,
        bankAccountNumber: '91823091820',
        bankIfsc: 'HDFC0001092'
      });
      assert.equal(duplicateRes.success, false);
      assert.equal(duplicateRes.error, 'APPLICATION_ALREADY_EXISTS');
    });

    it('submits valid financial aid application and manages DBT disbursement lifecycle', () => {
      const validApp = applyForScholarship({
        institutionId: TEST_INSTITUTION,
        schemeId: 'SCH-02',
        studentId: 'STU-2001',
        studentName: 'Ananya Deshmukh',
        enrollmentNumber: 'ENG-2023-005',
        department: 'ECE',
        semester: 6,
        cgpa: 8.4,
        annualFamilyIncomeINR: 320000,
        attendancePercent: 88,
        bankAccountNumber: '91820938102',
        bankIfsc: 'SBIN0004921'
      });

      assert.equal(validApp.success, true);
      assert.match(validApp.application?.id || '', /^APP-/);
      assert.equal(validApp.application?.status, 'APPLIED');

      // Committee Approval
      const approved = updateApplicationStatus(validApp.application!.id, 'COMMITTEE_APPROVED');
      assert.equal(approved.success, true);
      assert.equal(approved.application?.status, 'COMMITTEE_APPROVED');
      assert.ok(approved.application?.committeeReviewDate);

      // Disbursement requires UTR transaction number
      const failedDisburse = updateApplicationStatus(validApp.application!.id, 'DISBURSED');
      assert.equal(failedDisburse.success, false);
      assert.equal(failedDisburse.error, 'UTR_TRANSACTION_NUMBER_REQUIRED');

      // Disburse with UTR
      const disbursed = updateApplicationStatus(validApp.application!.id, 'DISBURSED', {
        utrNumber: 'UTR-2026-BANK-778899'
      });
      assert.equal(disbursed.success, true);
      assert.equal(disbursed.application?.status, 'DISBURSED');
      assert.equal(disbursed.application?.utrTransactionNumber, 'UTR-2026-BANK-778899');

      // Check scheme disbursedAmountINR was incremented
      const schemes = getSchemes(TEST_INSTITUTION);
      const sch02 = schemes.find(s => s.schemeId === 'SCH-02');
      assert.equal(sch02?.disbursedAmountINR, 35000);
    });

    it('computes financial aid summary and exports NAAC 5.1 ledger CSV', () => {
      const summary = computeFinancialAidSummary(TEST_INSTITUTION);
      assert.equal(summary.totalSchemes, 2);
      assert.equal(summary.totalAllocatedBudgetINR, 3500000); // 20L + 15L
      assert.equal(summary.totalBeneficiariesCount, 1);
      assert.equal(summary.totalDisbursedAmountINR, 50000);

      const csv = exportScholarshipLedgerCSV(TEST_INSTITUTION);
      assert.ok(csv.includes('=== NAAC CRITERION 5.1: STUDENT FINANCIAL AID & SCHOLARSHIP AUDIT ==='));
      assert.ok(csv.includes('Aarav Sharma'));
      assert.ok(csv.includes('Dr. APJ Abdul Kalam STEM Merit Fellowship'));
    });
  });

  describe('TASK-913: Faculty Sabbatical & Academic Deputation Governance Engine', () => {
    it('enforces UGC 6-year continuous service and 12-month maximum duration invariants', () => {
      // 1. UGC Service Rule Deficit (< 6 Years)
      const serviceViolation = requestSabbaticalLeave({
        institutionId: TEST_INSTITUTION,
        facultyId: 'FAC-ECE-002',
        facultyName: 'Dr. Sunita Raman',
        department: 'ECE',
        currentDesignation: 'Assistant Professor',
        yearsOfContinuousService: 4, // < 6 years
        leaveType: 'SABBATICAL_RESEARCH',
        hostInstitution: 'IISc Bangalore',
        hostCountry: 'India',
        researchPlanTitle: 'Cryogenic Low-Noise Amplifiers',
        startDate: '2026-07-01',
        endDate: '2027-06-30',
        durationMonths: 12
      });

      assert.equal(serviceViolation.success, false);
      assert.ok(serviceViolation.error?.includes('UGC_SERVICE_RULE_VIOLATION'));

      // 2. Maximum Duration Exceeded (> 12 Months)
      const durationViolation = requestSabbaticalLeave({
        institutionId: TEST_INSTITUTION,
        facultyId: 'FAC-ECE-003',
        facultyName: 'Dr. K. V. Rao',
        department: 'CSE',
        currentDesignation: 'Professor',
        yearsOfContinuousService: 10,
        leaveType: 'SABBATICAL_RESEARCH',
        hostInstitution: 'Stanford University',
        hostCountry: 'USA',
        researchPlanTitle: 'Quantum Key Distribution',
        startDate: '2026-07-01',
        endDate: '2028-06-30',
        durationMonths: 24 // > 12 months
      });

      assert.equal(durationViolation.success, false);
      assert.ok(durationViolation.error?.includes('DURATION_LIMIT_EXCEEDED'));

      // 3. Duplicate Active Sabbatical: Dr. Aris Thorne (FAC-CSE-001) already has SANCTIONED sabbatical
      const duplicateLeave = requestSabbaticalLeave({
        institutionId: TEST_INSTITUTION,
        facultyId: 'FAC-CSE-001',
        facultyName: 'Dr. Aris Thorne',
        department: 'CSE',
        currentDesignation: 'Associate Professor',
        yearsOfContinuousService: 7,
        leaveType: 'SABBATICAL_RESEARCH',
        hostInstitution: 'Oxford University',
        hostCountry: 'UK',
        researchPlanTitle: 'Decentralized Proofs',
        startDate: '2026-07-01',
        endDate: '2027-06-30',
        durationMonths: 12
      });

      assert.equal(duplicateLeave.success, false);
      assert.ok(duplicateLeave.error?.includes('ACTIVE_LEAVE_ALREADY_EXISTS'));
    });

    it('submits valid academic deputation and manages multi-stage approval lifecycle', () => {
      const validDeputation = requestSabbaticalLeave({
        institutionId: TEST_INSTITUTION,
        facultyId: 'FAC-MECH-004',
        facultyName: 'Dr. B. R. Ambedkar',
        department: 'Mechanical Engineering',
        currentDesignation: 'Professor',
        yearsOfContinuousService: 8,
        leaveType: 'ACADEMIC_DEPUTATION',
        hostInstitution: 'DRDO National Aerospace Laboratories',
        hostCountry: 'India',
        researchPlanTitle: 'Supersonic Combustion CFD Simulations',
        startDate: '2026-08-01',
        endDate: '2027-07-31',
        durationMonths: 12
      });

      assert.equal(validDeputation.success, true);
      assert.match(validDeputation.application?.id || '', /^SAB-/);
      assert.equal(validDeputation.application?.status, 'REQUESTED');

      // Stage 1: HoD Endorsement
      const hodReviewed = updateSabbaticalStatus(validDeputation.application!.id, 'HOD_RECOMMENDED', {
        notes: 'Strategic defense lab collaboration; teaching load shared among faculty.'
      });
      assert.equal(hodReviewed.success, true);
      assert.equal(hodReviewed.application?.status, 'HOD_RECOMMENDED');
      assert.ok(hodReviewed.application?.hodRecommendationDate);

      // Stage 2: Sanction Order
      const sanctioned = updateSabbaticalStatus(validDeputation.application!.id, 'SANCTIONED', {
        sanctionOrder: 'ORD-GOV-2026-8812'
      });
      assert.equal(sanctioned.success, true);
      assert.equal(sanctioned.application?.status, 'SANCTIONED');
      assert.equal(sanctioned.application?.sanctionOrderNumber, 'ORD-GOV-2026-8812');

      // Stage 3: Return & Completion Monograph
      const completed = updateSabbaticalStatus(validDeputation.application!.id, 'COMPLETED_REPORT_SUBMITTED', {
        reportAbstract: 'Developed high-enthalpy supersonic flow models published in AIAA Journal.'
      });
      assert.equal(completed.success, true);
      assert.equal(completed.application?.status, 'COMPLETED_REPORT_SUBMITTED');
      assert.ok(completed.application?.completionReportAbstract);
    });

    it('computes sabbatical summary and exports UGC leave CSV', () => {
      const summary = computeLeaveSummary(TEST_INSTITUTION);
      assert.equal(summary.totalApplications, 1);
      assert.equal(summary.activeFacultyOnSabbatical, 1);

      const csv = exportSabbaticalLeaveCSV(TEST_INSTITUTION);
      assert.ok(csv.includes('=== UGC/AICTE FACULTY SABBATICAL & DEPUTATION LEAVE AUDIT ==='));
      assert.ok(csv.includes('Dr. Aris Thorne'));
      assert.ok(csv.includes('Max Planck Institute for Informatics'));
    });
  });
});
