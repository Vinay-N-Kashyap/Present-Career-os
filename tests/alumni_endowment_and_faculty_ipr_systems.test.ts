import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  DEFAULT_ENDOWMENT_YIELD_RATE,
  ENDOWMENT_ADMIN_OVERHEAD_RATE,
  MIN_CHAIR_PROFESSORSHIP_CORPUS_INR,
  generateEndowmentToken,
  calculateAnnualEndowmentPayout,
  generateEndowmentSeal,
  registerEndowmentPledge,
  realizeCorpusAndCertify80G,
  activateEndowmentChair,
  exportAlumniEndowmentLedgerCSV,
  INITIAL_ALUMNI_ENDOWMENTS,
} from '../src/lib/admin/centralAlumniEndowment';

import {
  UGC_IPR_POINTS_MATRIX,
  ROYALTY_DISTRIBUTION_SPLIT,
  generatePatentToken,
  calculateUgcCasPoints,
  calculateRoyaltyDistribution,
  generatePatentSeal,
  registerFacultyPatent,
  recordPatentGrant,
  executeCommercialLicense,
  exportFacultyPatentsLedgerCSV,
  INITIAL_FACULTY_PATENTS,
} from '../src/lib/teacher/facultyIprPatents';

describe('TASK-1020: Master Alumni Endowment & Faculty IPR Patent Systems Test Suite', () => {
  describe('TASK-1016: Central University Alumni Endowment, Philanthropy & Legacy Giving Engine', () => {
    it('1. generates unique alumni endowment tracking token matching ENDW-[YEAR]-[CAT]-[HEX6]', () => {
      const tokenChair = generateEndowmentToken('CHAIR_PROFESSORSHIP', 2026);
      assert.match(tokenChair, /^ENDW-2026-CHAI-[0-9A-F]{6}$/);

      const tokenScholarship = generateEndowmentToken('STUDENT_MERIT_SCHOLARSHIP', 2026);
      assert.match(tokenScholarship, /^ENDW-2026-STUD-[0-9A-F]{6}$/);

      const tokenNaming = generateEndowmentToken('INFRASTRUCTURE_NAMING', 2026);
      assert.match(tokenNaming, /^ENDW-2026-INFR-[0-9A-F]{6}$/);
    });

    it('2. calculates net perpetual annual endowment payout based on sovereign yield and admin overhead', () => {
      assert.strictEqual(DEFAULT_ENDOWMENT_YIELD_RATE, 6.5);
      assert.strictEqual(ENDOWMENT_ADMIN_OVERHEAD_RATE, 0.5);
      assert.strictEqual(MIN_CHAIR_PROFESSORSHIP_CORPUS_INR, 50000000); // ₹5 Crore

      // Net effective payout rate = 6.5% - 0.5% = 6.0%
      // ₹1 Crore corpus -> 6% = ₹6,00,000 / year
      const payout1Cr = calculateAnnualEndowmentPayout(10000000);
      assert.strictEqual(payout1Cr, 600000);

      // ₹10 Crore corpus -> 6% = ₹60,00,000 / year
      const payout10Cr = calculateAnnualEndowmentPayout(100000000);
      assert.strictEqual(payout10Cr, 6000000);

      // Zero or negative corpus returns 0
      assert.strictEqual(calculateAnnualEndowmentPayout(0), 0);
      assert.strictEqual(calculateAnnualEndowmentPayout(-50000), 0);
    });

    it('3. registers alumni endowment pledge with strict validation and cryptographic SHA-256 seal', () => {
      // Blank donor name fails
      assert.throws(() => {
        registerEndowmentPledge({
          donorFullName: '',
          donorBatchYear: 1995,
          donorAlmaMaterDegree: 'B.Tech EE',
          donorPanNumber: 'ABCDE1234F',
          donorEmail: 'donor@alumni.edu',
          category: 'CHAIR_PROFESSORSHIP',
          pledgedAmount: 50000000,
          currency: 'INR',
          isForeignDonation: false,
          designatedDepartmentOrPurpose: 'Robotics Chair',
        });
      }, /Donor full name cannot be blank/);

      // Non-positive pledged amount fails
      assert.throws(() => {
        registerEndowmentPledge({
          donorFullName: 'Anand Kumar',
          donorBatchYear: 1995,
          donorAlmaMaterDegree: 'B.Tech EE',
          donorPanNumber: 'ABCDE1234F',
          donorEmail: 'anand@alumni.edu',
          category: 'CHAIR_PROFESSORSHIP',
          pledgedAmount: 0,
          currency: 'INR',
          isForeignDonation: false,
          designatedDepartmentOrPurpose: 'Robotics Chair',
        });
      }, /Pledged amount must be strictly greater than 0/);

      // Valid registration
      const pledge = registerEndowmentPledge({
        donorFullName: 'Pooja Agarwal',
        donorBatchYear: 1998,
        donorAlmaMaterDegree: 'B.Tech Civil Engineering',
        donorPanNumber: 'AAPPA8812K',
        donorEmail: 'pooja.agarwal@alumni.univ.edu',
        category: 'STUDENT_MERIT_SCHOLARSHIP',
        pledgedAmount: 10000000,
        currency: 'INR',
        isForeignDonation: false,
        designatedDepartmentOrPurpose: 'Agarwal Merit Scholarships for Underprivileged Civil Engineers',
      });

      assert.strictEqual(pledge.donorFullName, 'Pooja Agarwal');
      assert.strictEqual(pledge.realizedAmountInr, 10000000);
      assert.strictEqual(pledge.annualNetPayoutInr, 600000);
      assert.strictEqual(pledge.stage, 'PLEDGE_FILED');
      assert.strictEqual(pledge.cryptographicSeal?.length, 64);
    });

    it('4. enforces FCRA MHA clearance for foreign overseas alumni donations', () => {
      // Foreign donation without FCRA approval enters FCRA_CLEARANCE_PENDING stage
      const foreignPledge = registerEndowmentPledge({
        donorFullName: 'Dr. Sanjay Rao',
        donorBatchYear: 1988,
        donorAlmaMaterDegree: 'B.Tech Mechanical Engineering',
        donorPanNumber: 'AANPS9910D',
        donorEmail: 'sanjay.rao@siliconvalley.com',
        category: 'RESEARCH_INCUBATION_SEED',
        pledgedAmount: 200000,
        currency: 'USD',
        exchangeRateToInr: 86.5,
        isForeignDonation: true,
        fcraApprovalNumber: undefined,
        designatedDepartmentOrPurpose: 'DeepTech Startup Incubation Seed Grant',
      });

      assert.strictEqual(foreignPledge.stage, 'FCRA_CLEARANCE_PENDING');
      assert.strictEqual(foreignPledge.realizedAmountInr, 17300000); // 200,000 * 86.5 = 1.73 Cr

      // Realizing foreign corpus without FCRA approval throws error
      assert.throws(() => {
        realizeCorpusAndCertify80G(foreignPledge, 17300000);
      }, /Statutory FCRA clearance required before realizing foreign alumni endowment corpus/);
    });

    it('5. realizes corpus funds, generates Form 10BE Section 80G certificate, and activates chair', () => {
      const domesticPledge = registerEndowmentPledge({
        donorFullName: 'Kiran Mazumdar',
        donorBatchYear: 1978,
        donorAlmaMaterDegree: 'M.Sc Chemistry',
        donorPanNumber: 'AAAPM1129E',
        donorEmail: 'kiran@biotech.org',
        category: 'CHAIR_PROFESSORSHIP',
        pledgedAmount: 60000000,
        currency: 'INR',
        isForeignDonation: false,
        designatedDepartmentOrPurpose: 'Distinguished Bio-Innovation Chair Professorship',
      });

      // Cannot activate chair before realizing funds
      assert.throws(() => {
        activateEndowmentChair(domesticPledge);
      }, /Corpus must be realized and certified before activation/);

      const realized = realizeCorpusAndCertify80G(domesticPledge, 60000000);
      assert.strictEqual(realized.stage, 'SECTION_80G_CERTIFIED');
      assert.match(realized.section80gCertNumber || '', /^80G-IT-UNIV-\d{4}-[0-9A-Z]+$/);
      assert.strictEqual(realized.annualNetPayoutInr, 3600000); // 6% of 6 Cr = 36 Lakhs/year

      const active = activateEndowmentChair(realized);
      assert.strictEqual(active.stage, 'ENDOWMENT_CHAIR_OPERATIONAL');
      assert.strictEqual(active.cryptographicSeal?.length, 64);
    });
  });

  describe('TASK-1018: Faculty Intellectual Property Rights (IPR), Patent Filing & Commercialization Engine', () => {
    it('6. generates unique patent tracking token matching PAT-[YEAR]-[DEPT]-[HEX6]', () => {
      const tokenCSE = generatePatentToken('Computer Science', 2026);
      assert.match(tokenCSE, /^PAT-2026-COMP-[0-9A-F]{6}$/);

      const tokenMech = generatePatentToken('Mechanical Engineering', 2026);
      assert.match(tokenMech, /^PAT-2026-MECH-[0-9A-F]{6}$/);
    });

    it('7. calculates UGC CAS Table 2 Category 3 research scoring for patents and copyrights', () => {
      assert.strictEqual(UGC_IPR_POINTS_MATRIX.INTERNATIONAL_GRANTED, 10);
      assert.strictEqual(UGC_IPR_POINTS_MATRIX.NATIONAL_GRANTED, 7);
      assert.strictEqual(UGC_IPR_POINTS_MATRIX.PATENT_FILED_PUBLISHED, 5);
      assert.strictEqual(UGC_IPR_POINTS_MATRIX.COPYRIGHT_DESIGN_GRANTED, 3);

      // National patent filed/published = 5 pts; granted = 7 pts
      assert.strictEqual(calculateUgcCasPoints('NATIONAL_INDIAN_PATENT', 'PROVISIONAL_APPLICATION_FILED'), 5);
      assert.strictEqual(calculateUgcCasPoints('NATIONAL_INDIAN_PATENT', 'PATENT_GRANTED'), 7);

      // International PCT patent filed = 5 pts; granted = 10 pts
      assert.strictEqual(calculateUgcCasPoints('INTERNATIONAL_PCT_PATENT', 'COMPLETE_SPECIFICATION_FILED'), 5);
      assert.strictEqual(calculateUgcCasPoints('INTERNATIONAL_PCT_PATENT', 'PATENT_GRANTED'), 10);

      // Software Copyright granted = 3 pts
      assert.strictEqual(calculateUgcCasPoints('COPYRIGHT_SOFTWARE_CODE', 'PATENT_GRANTED'), 3);
    });

    it('8. registers invention disclosure with inventor contribution validation summing to 100%', () => {
      // Contribution summing to 90% fails
      assert.throws(() => {
        registerFacultyPatent({
          inventionTitle: 'Quantum Cryptography QKD Repeater',
          category: 'NATIONAL_INDIAN_PATENT',
          applicationNumber: '202611001234 A',
          filingDate: '2026-03-01',
          leadInventorName: 'Dr. Sen',
          leadDepartment: 'CSE',
          inventors: [
            { empId: '01', facultyName: 'Dr. Sen', department: 'CSE', isLeadInventor: true, contributionPercentage: 60 },
            { empId: '02', facultyName: 'Dr. Roy', department: 'CSE', isLeadInventor: false, contributionPercentage: 30 },
          ],
        });
      }, /Total inventor contribution percentage must equal exactly 100%/);

      // Valid registration
      const patent = registerFacultyPatent({
        inventionTitle: 'Quantum Key Distribution (QKD) Photonic Entanglement Repeater',
        category: 'NATIONAL_INDIAN_PATENT',
        applicationNumber: '202611005512 A',
        filingDate: '2026-03-01',
        leadInventorName: 'Dr. Siddharth Sen',
        leadDepartment: 'Computer Science & Engineering',
        inventors: [
          { empId: 'EMP-01', facultyName: 'Dr. Siddharth Sen', department: 'CSE', isLeadInventor: true, contributionPercentage: 70 },
          { empId: 'EMP-02', facultyName: 'Dr. Ananya Roy', department: 'CSE', isLeadInventor: false, contributionPercentage: 30 },
        ],
      });

      assert.strictEqual(patent.stage, 'PROVISIONAL_APPLICATION_FILED');
      assert.strictEqual(patent.ugcCasPoints, 5); // 5 pts for filed patent
      assert.strictEqual(patent.cryptographicSeal?.length, 64);
    });

    it('9. records official patent grant decision and elevates UGC CAS points', () => {
      const patent = registerFacultyPatent({
        inventionTitle: 'Solid-State Battery Electrolyte Matrix with Dendrite Suppression',
        category: 'INTERNATIONAL_PCT_PATENT',
        applicationNumber: 'PCT/IB2025/099112',
        filingDate: '2025-06-15',
        leadInventorName: 'Dr. Tarun Verma',
        leadDepartment: 'Materials Science',
        inventors: [
          { empId: 'EMP-MS-01', facultyName: 'Dr. Tarun Verma', department: 'Materials Science', isLeadInventor: true, contributionPercentage: 100 },
        ],
      });

      assert.strictEqual(patent.ugcCasPoints, 5);

      const granted = recordPatentGrant(patent, '2026-04-10');
      assert.strictEqual(granted.stage, 'PATENT_GRANTED');
      assert.strictEqual(granted.grantDate, '2026-04-10');
      assert.strictEqual(granted.ugcCasPoints, 10); // Elevated to 10 points for International Granted
      assert.strictEqual(granted.cryptographicSeal?.length, 64);
    });

    it('10. executes commercial licensing agreement, audits 60/20/20 royalty split, and exports statutory CSVs', () => {
      assert.strictEqual(ROYALTY_DISTRIBUTION_SPLIT.FACULTY_INVENTORS, 0.60);
      assert.strictEqual(ROYALTY_DISTRIBUTION_SPLIT.DEPARTMENT_FUND, 0.20);
      assert.strictEqual(ROYALTY_DISTRIBUTION_SPLIT.UNIVERSITY_CORPUS, 0.20);

      // Verify mathematical royalty distribution for ₹50,00,000 royalty
      const shares = calculateRoyaltyDistribution(5000000);
      assert.strictEqual(shares.facultyShareInr, 3000000); // 60% = 30 Lakhs
      assert.strictEqual(shares.departmentShareInr, 1000000); // 20% = 10 Lakhs
      assert.strictEqual(shares.universityCorpusShareInr, 1000000); // 20% = 10 Lakhs

      const patent = registerFacultyPatent({
        inventionTitle: 'AI Drone Autonomous Navigation for GPS-Denied Underground Tunnels',
        category: 'NATIONAL_INDIAN_PATENT',
        applicationNumber: '202511044190 A',
        filingDate: '2025-01-10',
        leadInventorName: 'Dr. Meera Iyer',
        leadDepartment: 'Aerospace Engineering',
        inventors: [
          { empId: 'EMP-AERO-01', facultyName: 'Dr. Meera Iyer', department: 'Aerospace', isLeadInventor: true, contributionPercentage: 100 },
        ],
      });

      // Cannot license before grant
      assert.throws(() => {
        executeCommercialLicense(patent, {
          licenseeCompanyName: 'AeroTunnel Robotics Ltd',
          licenseType: 'EXCLUSIVE',
          upfrontTechnologyFeeInr: 2000000,
          royaltyPercentageOnSales: 6.0,
          totalRoyaltyRealizedInr: 4000000,
          agreementDate: '2026-04-15',
        });
      }, /Cannot execute commercial license: Patent must be granted first/);

      const grantedPatent = recordPatentGrant(patent, '2026-03-25');
      const licensed = executeCommercialLicense(grantedPatent, {
        licenseeCompanyName: 'AeroTunnel Robotics Ltd',
        licenseType: 'EXCLUSIVE',
        upfrontTechnologyFeeInr: 2000000,
        royaltyPercentageOnSales: 6.0,
        totalRoyaltyRealizedInr: 4000000,
        agreementDate: '2026-04-15',
      });

      assert.strictEqual(licensed.stage, 'COMMERCIAL_LICENSE_EXECUTED');
      assert.strictEqual(licensed.commercialLicense?.facultyShareInr, 2400000); // 60% of 40L
      assert.strictEqual(licensed.commercialLicense?.departmentShareInr, 800000); // 20% of 40L
      assert.strictEqual(licensed.commercialLicense?.universityCorpusShareInr, 800000); // 20% of 40L

      // CSV exports verification
      const endowmentCsv = exportAlumniEndowmentLedgerCSV(INITIAL_ALUMNI_ENDOWMENTS);
      assert.match(endowmentCsv, /Endowment ID,Tracking Token,Donor Name/);
      assert.match(endowmentCsv, /Rajesh & Vandana Mehta/);
      assert.match(endowmentCsv, /Dr. Alok Nath Mukherjee/);

      const patentCsv = exportFacultyPatentsLedgerCSV(INITIAL_FACULTY_PATENTS);
      assert.match(patentCsv, /Patent ID,Tracking Token,Invention Title/);
      assert.match(patentCsv, /Neuromorphic Spiking Neural Network Accelerator/);
      assert.match(patentCsv, /Dr. Siddharth Sen/);
    });
  });
});
