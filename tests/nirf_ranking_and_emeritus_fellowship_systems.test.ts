import { describe, it, expect } from './helpers/testShim';
import {
  calculateNirfCompositeScore,
  calculateTlrScore,
  calculateRpcScore,
  calculateGoScore,
  calculateOiScore,
  calculatePrScore,
  createNirfSubmission,
  advanceDcsStatus,
  recordOfficialRankDeclared,
  exportNirfDcsSummaryCSV,
  BENCHMARK_FACULTY_STUDENT_RATIO,
  NIRF_WEIGHTS
} from '../src/lib/admin/centralNirfRanking';

import {
  registerEmeritusFellowship,
  activateEmeritusTenure,
  generateMonthlyHonorariumVoucher,
  claimContingencyExpense,
  concludeEmeritusTenure,
  exportFacultyEmeritusLedgerCSV,
  MIN_SUPERANNUATION_AGE,
  MAX_EMERITUS_AGE_CEILING,
  STATUTORY_MONTHLY_HONORARIUM_INR,
  STATUTORY_ANNUAL_CONTINGENCY_INR,
  TDS_RATE_SECTION_194J
} from '../src/lib/teacher/facultyEmeritusFellowship';

describe('Block 40: Central NIRF Ranking & Faculty Emeritus Fellowship Systems (TASK-1056..1060)', () => {
  // Test 1: NIRF Composite Score Calculation across 5 dimensions with exact statutory weights
  it('calculates NIRF composite score using 30/30/20/10/10 statutory weights accurately', () => {
    const tlr = 80.0;
    const rpc = 70.0;
    const go = 85.0;
    const oi = 75.0;
    const pr = 90.0;

    // Expected: 80*0.3 + 70*0.3 + 85*0.2 + 75*0.1 + 90*0.1 = 24 + 21 + 17 + 7.5 + 9 = 78.5
    const score = calculateNirfCompositeScore(tlr, rpc, go, oi, pr);
    expect(score).toBe(78.5);
    expect(NIRF_WEIGHTS.TLR).toBe(0.30);
    expect(NIRF_WEIGHTS.RPC).toBe(0.30);
    expect(NIRF_WEIGHTS.GO).toBe(0.20);
    expect(NIRF_WEIGHTS.OI).toBe(0.10);
    expect(NIRF_WEIGHTS.PR).toBe(0.10);
  });

  // Test 2: TLR Parameter Scoring and FSR Benchmark Threshold
  it('evaluates TLR score and awards full FSR points when meeting 1:15 benchmark ratio', () => {
    const compliantTlr = calculateTlrScore({
      studentStrength: 8000,
      facultyStudentRatio: BENCHMARK_FACULTY_STUDENT_RATIO, // 15.0
      facultyWithPhdPct: 100,
      financialResourceUtilizationScore: 100
    });
    expect(compliantTlr).toBe(100.0);

    // Degraded FSR ratio (1:30 is twice the benchmark, should halve FSR component from 30 to 15)
    const degradedTlr = calculateTlrScore({
      studentStrength: 8000,
      facultyStudentRatio: 30.0,
      facultyWithPhdPct: 100,
      financialResourceUtilizationScore: 100
    });
    expect(degradedTlr).toBe(85.0); // 25 + 15 + 20 + 25 = 85.0
  });

  // Test 3: RPC Parameter Scoring with Scopus/WoS publications and IPR patents
  it('evaluates RPC score scaling with Scopus publications, citation impact, and patents', () => {
    const rpc = calculateRpcScore({
      publicationsScopusWos: 1500, // max 35
      citationPerPaper: 12.0, // max 30
      iprPatentsGrantedOrPublished: 30, // max 15
      sponsoredResearchFundingInr: 100000000 // 10 Cr = max 20
    });
    expect(rpc).toBe(100.0);

    const partialRpc = calculateRpcScore({
      publicationsScopusWos: 750, // 17.5
      citationPerPaper: 6.0, // 15
      iprPatentsGrantedOrPublished: 15, // 7.5
      sponsoredResearchFundingInr: 50000000 // 10
    });
    expect(partialRpc).toBe(50.0);
  });

  // Test 4: Create NIRF submission with valid token, QS bridge, and SHA-256 seal
  it('creates new NIRF DCS submission with tracking token, QS bridge telemetry, and SHA-256 seal', () => {
    const submission = createNirfSubmission({
      category: 'ENGINEERING',
      institutionName: 'Apex School of Engineering & Technology',
      nodalOfficer: 'Prof. V. Raman',
      rankingYear: 2026,
      tlrMetrics: {
        studentStrength: 4000,
        facultyStudentRatio: 14.5,
        facultyWithPhdPct: 90,
        financialResourceUtilizationScore: 85
      },
      rpcMetrics: {
        publicationsScopusWos: 1200,
        citationPerPaper: 11.0,
        iprPatentsGrantedOrPublished: 25,
        sponsoredResearchFundingInr: 80000000
      },
      goMetrics: {
        examPassRatePct: 95.0,
        phdGraduatedAnnualCount: 90,
        medianPlacementSalaryLpa: 15.0
      },
      oiMetrics: {
        otherStatesCountriesPct: 45.0,
        womenStudentsFacultyPct: 40.0,
        economicallyChallengedStudentsPct: 35.0,
        differentlyAbledFacilitiesScore: 90.0
      },
      prMetrics: {
        academicPeerScore: 85.0,
        employerFeedbackScore: 88.0
      }
    });

    expect(submission.recordId).toMatch(/^NIRF-2026-ENGI-[A-F0-9]{6}$/);
    expect(submission.status).toBe('DRAFT_DATA_COLLECTION');
    expect(submission.compositeScore).toBeGreaterThan(65);
    expect(submission.qsBridge.qsProjectedRankBand).toBeDefined();
    expect(submission.auditSha256).toHaveLength(64);
  });

  // Test 5: Advance DCS status and record official MoE declared rank
  it('advances DCS lifecycle status to public disclosure and records official MoE rank', () => {
    const initial = createNirfSubmission({
      category: 'OVERALL',
      institutionName: 'National Apex Central University',
      nodalOfficer: 'Prof. S. Sen',
      tlrMetrics: { studentStrength: 7500, facultyStudentRatio: 14.0, facultyWithPhdPct: 92, financialResourceUtilizationScore: 88 },
      rpcMetrics: { publicationsScopusWos: 1400, citationPerPaper: 11.5, iprPatentsGrantedOrPublished: 28, sponsoredResearchFundingInr: 90000000 },
      goMetrics: { examPassRatePct: 95.5, phdGraduatedAnnualCount: 130, medianPlacementSalaryLpa: 14.8 },
      oiMetrics: { otherStatesCountriesPct: 42.0, womenStudentsFacultyPct: 42.0, economicallyChallengedStudentsPct: 38.0, differentlyAbledFacilitiesScore: 92.0 },
      prMetrics: { academicPeerScore: 86.0, employerFeedbackScore: 88.0 }
    });

    const audited = advanceDcsStatus(initial, 'INTERNAL_AUDIT_VERIFIED');
    expect(audited.status).toBe('INTERNAL_AUDIT_VERIFIED');
    expect(audited.auditSha256).not.toBe(initial.auditSha256);

    const publicDisclosed = advanceDcsStatus(audited, 'PUBLIC_DISCLOSURE_HOSTED');
    expect(publicDisclosed.status).toBe('PUBLIC_DISCLOSURE_HOSTED');

    const ranked = recordOfficialRankDeclared(publicDisclosed, 19);
    expect(ranked.status).toBe('FINAL_RANK_DECLARED');
    expect(ranked.officialDeclaredRank).toBe(19);
    expect(ranked.auditSha256).toHaveLength(64);
  });

  // Test 6: Export NIRF DCS CSV format
  it('exports valid official CSV for NIRF Data Capture System ledger', () => {
    const submission = createNirfSubmission({
      category: 'MANAGEMENT',
      institutionName: 'Department of Management Studies',
      nodalOfficer: 'Prof. K. Iyer',
      tlrMetrics: { studentStrength: 600, facultyStudentRatio: 12.0, facultyWithPhdPct: 95, financialResourceUtilizationScore: 90 },
      rpcMetrics: { publicationsScopusWos: 350, citationPerPaper: 9.0, iprPatentsGrantedOrPublished: 8, sponsoredResearchFundingInr: 30000000 },
      goMetrics: { examPassRatePct: 98.0, phdGraduatedAnnualCount: 25, medianPlacementSalaryLpa: 18.5 },
      oiMetrics: { otherStatesCountriesPct: 60.0, womenStudentsFacultyPct: 45.0, economicallyChallengedStudentsPct: 30.0, differentlyAbledFacilitiesScore: 95.0 },
      prMetrics: { academicPeerScore: 89.0, employerFeedbackScore: 92.0 }
    });

    const csv = exportNirfDcsSummaryCSV([submission]);
    expect(csv).toContain('Record ID,Year,Category,Institution Name');
    expect(csv).toContain(submission.recordId);
    expect(csv).toContain('Department of Management Studies');
    expect(csv).toContain(submission.auditSha256);
  });

  // Test 7: Register Emeritus Fellowship and validate UGC superannuation age criteria
  it('registers superannuated professor and strictly enforces UGC age >= 60 hurdle and <= 70 ceiling', () => {
    const validFellow = registerEmeritusFellowship({
      facultyName: 'Prof. Dr. A. P. Sengupta',
      facultyEmail: 'ap.sengupta@university.ac.in',
      hostDepartment: 'Physics',
      dateOfSuperannuation: '2025-08-31',
      ageAtSuperannuation: 65,
      currentAge: 66,
      academicSpecialization: 'Condensed Matter Physics',
      proposedResearchMonograph: 'Topological Insulators and Superconductivity Dynamics'
    });

    expect(validFellow.fellowshipId).toMatch(/^EMR-2026-PHYS-[A-F0-9]{6}$/);
    expect(validFellow.monthlyHonorariumInr).toBe(STATUTORY_MONTHLY_HONORARIUM_INR); // 50,000
    expect(validFellow.annualContingencyGrantInr).toBe(STATUTORY_ANNUAL_CONTINGENCY_INR); // 50,000
    expect(validFellow.stage).toBe('APPLICATION_SUBMITTED');
    expect(validFellow.auditSha256).toHaveLength(64);

    // Reject under-age applicant (< 60)
    expect(() => {
      registerEmeritusFellowship({
        facultyName: 'Dr. Young Scholar',
        facultyEmail: 'young@university.ac.in',
        hostDepartment: 'Math',
        dateOfSuperannuation: '2025-01-01',
        ageAtSuperannuation: 58,
        currentAge: 58,
        academicSpecialization: 'Algebra',
        proposedResearchMonograph: 'Group Theory'
      });
    }).toThrow(/Superannuation age must be at least 60/);

    // Reject over-age applicant (> 70)
    expect(() => {
      registerEmeritusFellowship({
        facultyName: 'Prof. Octogenarian',
        facultyEmail: 'senior@university.ac.in',
        hostDepartment: 'History',
        dateOfSuperannuation: '2015-01-01',
        ageAtSuperannuation: 65,
        currentAge: 72,
        academicSpecialization: 'Ancient History',
        proposedResearchMonograph: 'Harappan Archaeology'
      });
    }).toThrow(/exceeds Emeritus Fellowship statutory ceiling of 70/);
  });

  // Test 8: Generate monthly voucher enforcing 10% Section 194J TDS deduction
  it('generates monthly honorarium voucher with statutory 10% TDS deduction and ₹45,000 net payment', () => {
    const fellow = registerEmeritusFellowship({
      facultyName: 'Prof. Dr. N. K. Sharma',
      facultyEmail: 'nk.sharma@university.ac.in',
      hostDepartment: 'Civil Engineering',
      dateOfSuperannuation: '2025-06-30',
      ageAtSuperannuation: 65,
      currentAge: 65,
      academicSpecialization: 'Geotechnical Earthquake Engineering',
      proposedResearchMonograph: 'Seismic Soil-Structure Interaction in Alluvial Basins'
    });

    const active = activateEmeritusTenure(fellow, '2025-07-01');
    expect(active.stage).toBe('FELLOWSHIP_ACTIVE');
    expect(active.tenureStartDate).toBe('2025-07-01');
    expect(active.tenureEndDate).toBe('2027-07-01');

    const withVoucher = generateMonthlyHonorariumVoucher(active, '2026-03', 'NEFT-SBI-88123490');
    expect(withVoucher.vouchers).toHaveLength(1);
    const voucher = withVoucher.vouchers[0];
    expect(voucher.grossHonorariumInr).toBe(50000);
    expect(voucher.tdsDeductionInr).toBe(5000); // 10% TDS
    expect(voucher.netDisbursedInr).toBe(45000);
    expect(voucher.neftTransactionRef).toBe('NEFT-SBI-88123490');
    expect(withVoucher.auditSha256).not.toBe(active.auditSha256);
  });

  // Test 9: Sanction research contingency claim within ₹50,000 annual ceiling
  it('sanctions research contingency expense within annual ₹50,000 ceiling and prevents excess claims', () => {
    const fellow = registerEmeritusFellowship({
      facultyName: 'Prof. Dr. Gita Roy',
      facultyEmail: 'gita.roy@university.ac.in',
      hostDepartment: 'Life Sciences',
      dateOfSuperannuation: '2025-05-31',
      ageAtSuperannuation: 65,
      currentAge: 65,
      academicSpecialization: 'Plant Molecular Genetics',
      proposedResearchMonograph: 'CRISPR Gene Editing in Drought-Tolerant Crops'
    });

    const active = activateEmeritusTenure(fellow, '2025-06-01');

    // Claim ₹30,000 for books
    const claim1 = claimContingencyExpense(active, {
      expenseCategory: 'ACADEMIC_BOOKS',
      description: 'Elsevier and Cold Spring Harbor Laboratory Press Monograph Volumes',
      claimedAmountInr: 30000,
      invoiceDate: '2025-09-10'
    });

    expect(claim1.contingencyUtilizedInr).toBe(30000);
    expect(claim1.contingencyClaims).toHaveLength(1);

    // Claim ₹20,000 for conference registration (utilizing total 50,000)
    const claim2 = claimContingencyExpense(claim1, {
      expenseCategory: 'CONFERENCE_REGISTRATION',
      description: 'International Congress of Genetics Registration',
      claimedAmountInr: 20000,
      invoiceDate: '2025-11-15'
    });

    expect(claim2.contingencyUtilizedInr).toBe(50000);

    // Attempt excess claim of ₹5,000 (exceeds balance of ₹0)
    expect(() => {
      claimContingencyExpense(claim2, {
        expenseCategory: 'LAB_REAGENTS',
        description: 'Taq Polymerase and PCR primers',
        claimedAmountInr: 5000,
        invoiceDate: '2026-01-10'
      });
    }).toThrow(/Contingency Grant Exhausted: Claim of ₹5000 exceeds remaining balance of ₹0/);
  });

  // Test 10: Conclude tenure upon monograph submission and export statutory CSV
  it('concludes emeritus tenure honorably upon monograph submission and exports official CSV', () => {
    const fellow = registerEmeritusFellowship({
      facultyName: 'Prof. Dr. R. C. Majumdar',
      facultyEmail: 'rc.majumdar@university.ac.in',
      hostDepartment: 'History',
      dateOfSuperannuation: '2024-06-30',
      ageAtSuperannuation: 65,
      currentAge: 67,
      academicSpecialization: 'Epigraphy and Numismatics',
      proposedResearchMonograph: 'Corpus Inscriptionum Indicarum: New Epigraphic Discoveries'
    });

    const active = activateEmeritusTenure(fellow, '2024-07-01');
    const withVoucher = generateMonthlyHonorariumVoucher(active, '2026-01');

    const concluded = concludeEmeritusTenure(withVoucher, {
      monographDoiOrIsbn: 'isbn:978-0-19-948123-1',
      coMentoredPhdScholarsCount: 4,
      masterclassesConductedCount: 14
    });

    expect(concluded.stage).toBe('TENURE_HONORABLY_COMPLETED');
    expect(concluded.monographDoiOrIsbn).toBe('isbn:978-0-19-948123-1');
    expect(concluded.coMentoredPhdScholarsCount).toBe(4);
    expect(concluded.masterclassesConductedCount).toBe(14);
    expect(concluded.monographSubmissionDate).toBeDefined();

    const csv = exportFacultyEmeritusLedgerCSV([concluded]);
    expect(csv).toContain('Fellowship ID,Faculty Name,Host Department');
    expect(csv).toContain(concluded.fellowshipId);
    expect(csv).toContain('Prof. Dr. R. C. Majumdar');
    expect(csv).toContain('50000'); // Monthly Honorarium
    expect(csv).toContain('isbn:978-0-19-948123-1');
    expect(csv).toContain(concluded.auditSha256);
  });
});
