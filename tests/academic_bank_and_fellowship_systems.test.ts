import { describe, it, expect } from 'vitest';
import {
  createStudentAbcRecord,
  syncWithDigilockerNad,
  addCourseCredits,
  redeemCreditsForCredential,
  exportAcademicBankLedgerCSV,
  generateAbcSeal,
  validateApaarId,
  formatApaarId,
  evaluateMeesEligibility,
  NEP_CREDIT_THRESHOLDS
} from '../src/lib/admin/centralAcademicBankOfCredits';

import {
  createResearchFellowRecord,
  generateMonthlyStipendBill,
  disburseStipendBill,
  claimContingencyExpenditure,
  upgradeJrfToSrf,
  exportFacultyFellowshipLedgerCSV,
  generateFellowshipSeal,
  calculateHraAmount,
  STATUTORY_BASE_STIPENDS,
  STATUTORY_ANNUAL_CONTINGENCY,
  MIN_FELLOWSHIP_ATTENDANCE_PERCENT
} from '../src/lib/teacher/facultyFellowshipStipend';

describe('Academic Bank of Credits & Research Fellowship Systems (TASK-1036..1040)', () => {
  // Test 1: Student ABC Record Creation and Token Formatting
  it('should create an ABC student record with statutory token and SHA-256 seal', () => {
    const record = createStudentAbcRecord({
      studentId: '2024-BTECH-CS-001',
      studentName: 'Rohan Sharma',
      apaarId: '982144018923',
      programName: 'B.Tech in Computer Science',
      department: 'Computer Science',
      admissionYear: 2024,
      initialCourses: [
        {
          courseCode: 'CS101',
          courseTitle: 'Introduction to Programming',
          creditsEarned: 4,
          semester: 1,
          gradeEarned: 'O',
          academicYear: '2024-2025',
          awardingInstitute: 'PinIT Central University',
          institutionCode: 'U-0123',
          isExternalTransfer: false,
          completionDate: '2024-12-15'
        }
      ],
      year: 2026
    });

    expect(record.abcRecordId).toMatch(/^ABC-2026-COMP-[A-F0-9]{6}$/);
    expect(record.apaarId).toBe('9821-4401-8923');
    expect(record.totalCreditsAccumulated).toBe(4);
    expect(record.activeCreditBalance).toBe(4);
    expect(record.syncStatus).toBe('PENDING_VERIFICATION');
    expect(record.auditSha256).toBeDefined();
    expect(record.auditSha256.length).toBe(64);
  });

  // Test 2: APAAR ID 12-Digit Format Validation
  it('should validate and format 12-digit APAAR IDs and reject invalid formats', () => {
    expect(validateApaarId('982144018923')).toBe(true);
    expect(validateApaarId('9821-4401-8923')).toBe(true);
    expect(validateApaarId('9821 4401 8923')).toBe(true);

    expect(validateApaarId('12345')).toBe(false); // Too short
    expect(validateApaarId('98214401892A')).toBe(false); // Non-digit character

    expect(formatApaarId('982144018923')).toBe('9821-4401-8923');
    expect(() => formatApaarId('invalid-id')).toThrow('Invalid APAAR ID format');
  });

  // Test 3: NEP 2020 MEES Credential Eligibility Calculations
  it('should evaluate NEP 2020 Multiple Entry/Exit credential eligibility across credit tiers', () => {
    // 35 Credits: Below Certificate
    const mees35 = evaluateMeesEligibility(35);
    expect(mees35.highestCredential).toBeNull();
    expect(mees35.creditsToNextTier).toBe(5);

    // 45 Credits: UG Certificate
    const mees45 = evaluateMeesEligibility(45);
    expect(mees45.highestCredential).toBe('UG_CERTIFICATE');
    expect(mees45.eligibleCredentials).toContain('UG_CERTIFICATE');

    // 85 Credits: UG Diploma
    const mees85 = evaluateMeesEligibility(85);
    expect(mees85.highestCredential).toBe('UG_DIPLOMA');
    expect(mees85.eligibleCredentials).toContain('UG_DIPLOMA');

    // 125 Credits: Bachelor's Degree
    const mees125 = evaluateMeesEligibility(125);
    expect(mees125.highestCredential).toBe('BACHELORS_DEGREE');
    expect(mees125.eligibleCredentials).toContain('BACHELORS_DEGREE');

    // 165 Credits: Bachelor's Degree with Honours / Research
    const mees165 = evaluateMeesEligibility(165);
    expect(mees165.highestCredential).toBe('BACHELORS_HONOURS');
    expect(mees165.eligibleCredentials).toContain('BACHELORS_HONOURS');
  });

  // Test 4: Digilocker NAD National Repository Synchronization
  it('should synchronize student record with Digilocker NAD repository and generate URI', () => {
    const record = createStudentAbcRecord({
      studentId: '2023-BTECH-EE-045',
      studentName: 'Sunita Menon',
      apaarId: '871234567890',
      programName: 'B.Tech Electrical Engineering',
      department: 'Electrical Engineering',
      admissionYear: 2023
    });

    const syncRes = syncWithDigilockerNad(record, 'U-0999');
    expect(syncRes.success).toBe(true);
    expect(syncRes.digilockerUri).toBe('in.gov.digilocker.nad/ABC/U-0999/2023/871234567890');
    expect(syncRes.record.syncStatus).toBe('SYNCED_DIGILOCKER_NAD');
    expect(syncRes.record.lastSyncedAt).toBeDefined();
  });

  // Test 5: Credit Redemption for Exit Credential Award
  it('should redeem banked credits, deduct balance, and prevent redemption on insufficient credits', () => {
    let record = createStudentAbcRecord({
      studentId: '2022-BTECH-ME-020',
      studentName: 'Vikram Joshi',
      apaarId: '556677889900',
      programName: 'B.Tech Mechanical Engineering',
      department: 'Mechanical Engineering',
      admissionYear: 2022
    });

    // Add 85 credits
    record = addCourseCredits(record, {
      courseCode: 'ME-CORE-PACK',
      courseTitle: 'Mechanical Engineering Core Curriculum Package',
      creditsEarned: 85,
      semester: 4,
      gradeEarned: 'A+',
      academicYear: '2023-2024',
      awardingInstitute: 'PinIT Central University',
      institutionCode: 'U-0123',
      isExternalTransfer: false,
      completionDate: '2024-05-30'
    });

    expect(record.activeCreditBalance).toBe(85);

    // Attempt redemption of Bachelor's Degree (Requires 120 credits, fails)
    const failedRedeem = redeemCreditsForCredential(record, 'BACHELORS_DEGREE');
    expect(failedRedeem.success).toBe(false);
    expect(failedRedeem.error).toContain('Insufficient active credit balance');

    // Redeem UG Diploma (Requires 80 credits, succeeds)
    const successRedeem = redeemCreditsForCredential(record, 'UG_DIPLOMA');
    expect(successRedeem.success).toBe(true);
    expect(successRedeem.redemption?.creditsRedeemed).toBe(80);
    expect(successRedeem.record.totalCreditsRedeemed).toBe(80);
    expect(successRedeem.record.activeCreditBalance).toBe(5); // 85 - 80 = 5
    expect(successRedeem.record.redemptions.length).toBe(1);
    expect(successRedeem.redemption?.certificateSerialNumber).toBeDefined();
  });

  // Test 6: Academic Bank of Credits Cryptographic Seal & CSV Ledger Export
  it('should verify ABC SHA-256 seal integrity and produce valid CSV ledger export', () => {
    const record = createStudentAbcRecord({
      studentId: '2024-BTECH-CIV-012',
      studentName: 'Ananya Roy',
      apaarId: '112233445566',
      programName: 'B.Tech Civil Engineering',
      department: 'Civil Engineering',
      admissionYear: 2024
    });

    const seal = generateAbcSeal(record);
    expect(seal).toBe(record.auditSha256);

    const csv = exportAcademicBankLedgerCSV([record]);
    expect(csv).toContain('ABC Record ID,Student ID,Student Name,APAAR ID');
    expect(csv).toContain('1122-3344-5566');
    expect(csv).toContain('Civil Engineering');
    expect(csv).toContain(seal);
  });

  // Test 7: Research Fellow Creation with Revised 2023 Fellowship Scales
  it('should initialize research fellow with 2023 statutory stipend and HRA scales', () => {
    // JRF in Tier X (27% Metro HRA)
    const jrf = createResearchFellowRecord({
      scholarName: 'Deepak Verma',
      scholarEmail: 'd.verma@univ.ac.in',
      rollNumber: '2025-PHD-CHEM-001',
      piFacultyId: 'FAC-CH-2017-009',
      piFacultyName: 'Dr. Meera Iyer',
      department: 'Chemical Sciences',
      fundingAgency: 'CSIR_JRF',
      fellowshipTier: 'JRF_JUNIOR_RESEARCH_FELLOW',
      cityHraTier: 'TIER_X_27_PERCENT',
      enrollmentDate: '2025-08-01',
      year: 2026
    });

    expect(jrf.fellowId).toMatch(/^FEL-2026-CHEM-[A-F0-9]{6}$/);
    expect(STATUTORY_BASE_STIPENDS[jrf.fellowshipTier]).toBe(37000);
    expect(calculateHraAmount(37000, 'TIER_X_27_PERCENT')).toBe(9990); // 27% of 37,000
    expect(jrf.annualContingencyLimitInr).toBe(20000);
    expect(jrf.auditSha256).toBeDefined();

    // RA-I Post-Doc in Tier Y (18% HRA)
    const postDoc = createResearchFellowRecord({
      scholarName: 'Dr. Siddharth Sen',
      scholarEmail: 's.sen@univ.ac.in',
      rollNumber: '2025-PDF-PHY-001',
      piFacultyId: 'FAC-PH-2015-002',
      piFacultyName: 'Prof. N. Bose',
      department: 'Physics',
      fundingAgency: 'DST_INSPIRE',
      fellowshipTier: 'RA_I_POST_DOCTORAL',
      cityHraTier: 'TIER_Y_18_PERCENT',
      enrollmentDate: '2025-06-01'
    });

    expect(STATUTORY_BASE_STIPENDS[postDoc.fellowshipTier]).toBe(58000);
    expect(calculateHraAmount(58000, 'TIER_Y_18_PERCENT')).toBe(10440); // 18% of 58,000
    expect(postDoc.annualContingencyLimitInr).toBe(50000);
  });

  // Test 8: Monthly Stipend Generation with Mandatory 80% Attendance Hurdle
  it('should enforce the mandatory 80% attendance hurdle for stipend bill sanction and DBT release', () => {
    const fellow = createResearchFellowRecord({
      scholarName: 'Kavita Nair',
      scholarEmail: 'k.nair@univ.ac.in',
      rollNumber: '2024-PHD-BIO-009',
      piFacultyId: 'FAC-BT-2016-011',
      piFacultyName: 'Prof. R. Menon',
      department: 'Biotechnology',
      fundingAgency: 'DBT_BIOCARE',
      fellowshipTier: 'JRF_JUNIOR_RESEARCH_FELLOW',
      cityHraTier: 'TIER_X_27_PERCENT',
      enrollmentDate: '2024-09-01'
    });

    // Attendance 72% (< 80% hurdle)
    const deficitBill = generateMonthlyStipendBill(fellow, {
      monthYear: '2026-02',
      attendancePercent: 72
    });

    expect(deficitBill.success).toBe(false);
    expect(deficitBill.bill.status).toBe('ATTENDANCE_DEFICIT_HELD');
    expect(deficitBill.error).toContain('below mandatory 80% threshold');

    // Attendance 88% (>= 80% hurdle)
    const validBill = generateMonthlyStipendBill(deficitBill.fellow, {
      monthYear: '2026-03',
      attendancePercent: 88
    });

    expect(validBill.success).toBe(true);
    expect(validBill.bill.status).toBe('GUIDE_SANCTIONED');
    expect(validBill.bill.grossStipendInr).toBe(37000 + 9990); // ₹46,990

    // Disburse via DBT
    const dbtRes = disburseStipendBill(validBill.fellow, validBill.bill.billId, 'DBT-PFMS-99887711');
    expect(dbtRes.success).toBe(true);
    const clearedBill = dbtRes.fellow.monthlyBills.find(b => b.billId === validBill.bill.billId);
    expect(clearedBill?.status).toBe('DISBURSED_DBT_CLEARED');
    expect(clearedBill?.dbtReferenceNumber).toBe('DBT-PFMS-99887711');
  });

  // Test 9: JRF to SRF Upgradation Hurdle
  it('should reject SRF upgrade when tenure is < 24 months and authorize when tenure is 24+ months', () => {
    // 18 months tenure
    const jrf18 = createResearchFellowRecord({
      scholarName: 'Amit Trivedi',
      scholarEmail: 'a.trivedi@univ.ac.in',
      rollNumber: '2024-PHD-EE-044',
      piFacultyId: 'FAC-EE-2016-092',
      piFacultyName: 'Dr. Vikramaditya Sen',
      department: 'Electrical Engineering',
      fundingAgency: 'UGC_NET_JRF',
      fellowshipTier: 'JRF_JUNIOR_RESEARCH_FELLOW',
      cityHraTier: 'TIER_X_27_PERCENT',
      enrollmentDate: '2024-08-01',
      tenureMonthsCompleted: 18
    });

    const failedUpgrade = upgradeJrfToSrf(jrf18, '2026-02-15');
    expect(failedUpgrade.success).toBe(false);
    expect(failedUpgrade.error).toContain('24 months are mandatory for SRF upgrade');

    // 25 months tenure
    const jrf25 = { ...jrf18, tenureMonthsCompleted: 25 };
    const successUpgrade = upgradeJrfToSrf(jrf25, '2026-03-01');
    expect(successUpgrade.success).toBe(true);
    expect(successUpgrade.fellow.fellowshipTier).toBe('SRF_SENIOR_RESEARCH_FELLOW');
    expect(successUpgrade.fellow.twoYearAssessmentCompleted).toBe(true);
    expect(successUpgrade.fellow.status).toBe('SRF_UPGRADED');
  });

  // Test 10: Research Contingency Grant Auditing & CSV Ledger Export
  it('should approve GFR 2017 compliant contingency claims, block budget overruns, and export CSV', () => {
    let fellow = createResearchFellowRecord({
      scholarName: 'Nisha Pillai',
      scholarEmail: 'n.pillai@univ.ac.in',
      rollNumber: '2023-PHD-CS-022',
      piFacultyId: 'FAC-CS-2018-081',
      piFacultyName: 'Dr. Nandini Ramanathan',
      department: 'Computer Science',
      fundingAgency: 'CSIR_JRF',
      fellowshipTier: 'SRF_SENIOR_RESEARCH_FELLOW',
      cityHraTier: 'TIER_X_27_PERCENT',
      enrollmentDate: '2023-08-01'
    });

    expect(fellow.annualContingencyLimitInr).toBe(20000);

    // Claim ₹12,000 for IEEE conference registration
    const claim1 = claimContingencyExpenditure(fellow, {
      description: 'IEEE ICRA 2026 Author Conference Registration',
      category: 'CONFERENCE_TRAVEL',
      invoiceDate: '2026-02-10',
      amountInr: 12000,
      gfrComplianceVerified: true
    });

    expect(claim1.success).toBe(true);
    expect(claim1.fellow.contingencySpentInr).toBe(12000);
    fellow = claim1.fellow;

    // Over-budget claim of ₹10,000 (Remaining is ₹8,000, fails)
    const claimOverrun = claimContingencyExpenditure(fellow, {
      description: 'High-Performance GPU Cloud Compute Hours',
      category: 'TESTING_CHARACTERIZATION_CHARGES',
      invoiceDate: '2026-03-01',
      amountInr: 10000,
      gfrComplianceVerified: true
    });

    expect(claimOverrun.success).toBe(false);
    expect(claimOverrun.error).toContain('exceeds remaining annual budget of ₹8000');

    // SHA-256 seal check and CSV export
    const seal = generateFellowshipSeal(fellow);
    expect(seal).toBe(fellow.auditSha256);

    const csv = exportFacultyFellowshipLedgerCSV([fellow]);
    expect(csv).toContain('Fellow ID,Scholar Name,Roll Number,PI Guide');
    expect(csv).toContain('Nisha Pillai');
    expect(csv).toContain('SRF_SENIOR_RESEARCH_FELLOW');
    expect(csv).toContain(seal);
  });
});
