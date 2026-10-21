import { describe, it, expect } from './helpers/testShim';
import {
  validateUdidFormat,
  calculateExamCompensatoryTime,
  registerEocScholar,
  assignAssistiveService,
  conductAccessibilityAudit,
  exportEocLedgerCSV,
  SAMPLE_EOC_SCHOLARS,
  SAMPLE_A11Y_AUDITS,
  MIN_BENCHMARK_DISABILITY_PERCENT,
  STATUTORY_COMPENSATORY_MINS_PER_HOUR,
} from '../src/lib/admin/centralEqualOpportunity';

import {
  onboardProfessorOfPractice,
  generatePoPHonorariumBill,
  disbursePoPHonorarium,
  exportPoPLedgerCSV,
  SAMPLE_POP_RECORDS,
  MIN_INDUSTRY_EXPERIENCE_YEARS,
  MAX_POP_TENURE_YEARS,
  MAX_UNIVERSITY_MONTHLY_HONORARIUM_INR,
  STATUTORY_TDS_PERCENT,
} from '../src/lib/teacher/facultyProfessorOfPractice';

describe('Block 38: Central Equal Opportunity & Professor of Practice Governance Systems', () => {
  // Test 1: UDID Card validation
  it('correctly validates statutory 18-character Indian UDID format and rejects invalid formats', () => {
    expect(validateUdidFormat('KA0110320020089123')).toBe(true);
    expect(validateUdidFormat('DL0420520010067890')).toBe(true);
    expect(validateUdidFormat('MH12-3456-7890-123456')).toBe(true); // sanitized 18-char UDID
    expect(validateUdidFormat('INVALID123')).toBe(false);
    expect(validateUdidFormat('123456789012345678')).toBe(false); // missing state prefix
  });

  // Test 2: EOC Scholar registration and RPwD benchmark check
  it('registers EOC scholars and accurately assigns benchmark disability status under RPwD Act 2016', () => {
    const benchmarkScholar = registerEocScholar({
      studentRollNumber: '2025CSB099',
      scholarName: 'Sunita Sharma',
      department: 'Computer Science',
      disabilityCategory: 'VISUAL_IMPAIRMENT_BLINDNESS',
      udidNumber: 'UP0510119990034567',
      disabilityPercentage: 75,
    });

    expect(benchmarkScholar.isBenchmarkDisability).toBe(true);
    expect(benchmarkScholar.scholarRecordId).toMatch(/^EOC-2026-VISU-[A-F0-9]{6}$/);
    expect(benchmarkScholar.auditSha256).toHaveLength(64);

    const nonBenchmark = registerEocScholar({
      studentRollNumber: '2025ME041',
      scholarName: 'Deepak Joshi',
      department: 'Mechanical Engineering',
      disabilityCategory: 'LOCOMOTOR_DISABILITY',
      udidNumber: 'MH0220319980045678',
      disabilityPercentage: 30, // below 40% benchmark
    });

    expect(nonBenchmark.isBenchmarkDisability).toBe(false);

    expect(() =>
      registerEocScholar({
        studentRollNumber: '2025CSB100',
        scholarName: 'Invalid Scholar',
        department: 'CS',
        disabilityCategory: 'LOW_VISION',
        udidNumber: 'BAD_UDID',
        disabilityPercentage: 50,
      })
    ).toThrow(/Invalid UDID card format/);
  });

  // Test 3: UGC Scribe and Compensatory Extra Time calculation
  it('calculates statutory compensatory exam time under UGC/RPwD norms (20 min/hr for benchmark)', () => {
    // 3 hours (180 mins) exam -> 3 * 20 = 60 mins extra time
    expect(calculateExamCompensatoryTime(180, 50)).toBe(60);
    // 2 hours (120 mins) exam -> 2 * 20 = 40 mins extra time
    expect(calculateExamCompensatoryTime(120, 100)).toBe(40);
    // 1 hour (60 mins) exam -> 1 * 20 = 20 mins extra time
    expect(calculateExamCompensatoryTime(60, 40)).toBe(20);
    // Non-benchmark (<40%) -> 0 extra time
    expect(calculateExamCompensatoryTime(180, 35)).toBe(0);
  });

  // Test 4: Assistive device and service allocation with SHA-256 seal integrity
  it('allocates assistive services and updates scholar status while preserving audit hash integrity', () => {
    const scholar = SAMPLE_EOC_SCHOLARS[0];
    const initialServices = scholar.allocatedServices.length;

    const { record: updated, service } = assignAssistiveService(scholar, {
      serviceType: 'ASSISTIVE_TECHNOLOGY_HARDWARE',
      assignedResourceDetails: 'Refreshable 40-cell Braille Display Unit',
      disbursedCostInr: 85000,
      validityMonths: 24,
    });

    expect(updated.allocatedServices.length).toBe(initialServices + 1);
    expect(updated.status).toBe('SERVICES_DISBURSED');
    expect(service.disbursedCostInr).toBe(85000);
    expect(service.status).toBe('ACTIVE');
    expect(updated.auditSha256).toHaveLength(64);
    expect(updated.auditSha256).not.toBe(scholar.auditSha256);
  });

  // Test 5: CPWD Universal Campus Accessibility Infrastructure Audit
  it('conducts CPWD universal campus accessibility audits and flags deficiency benchmarks', () => {
    const compliant = conductAccessibilityAudit({
      buildingName: 'Main Admin Block',
      facilityType: 'BUILDING_RAMP_ENTRANCE',
      auditScorePercent: 92,
      deficienciesIdentified: ['Minor tactile paver wear'],
      rectificationCostEstInr: 15000,
    });
    expect(compliant.isCompliant).toBe(true);
    expect(compliant.status).toBe('RECTIFICATION_COMPLETED');
    expect(compliant.auditId).toMatch(/^AUD-A11Y-[A-F0-9]{6}$/);

    const nonCompliant = conductAccessibilityAudit({
      buildingName: 'Old Mechanical Workshop',
      facilityType: 'BRAILLE_ELEVATOR_LIFT',
      auditScorePercent: 55,
      deficienciesIdentified: ['Elevator lacks Braille keypad', 'No voice synthesizer annunciator'],
      rectificationCostEstInr: 180000,
    });
    expect(nonCompliant.isCompliant).toBe(false);
    expect(nonCompliant.status).toBe('AUDITED_PENDING_CIVIL');
  });

  // Test 6: EOC Ledger CSV export
  it('exports valid official CSV for Equal Opportunity Cell scholar ledger', () => {
    const csv = exportEocLedgerCSV(SAMPLE_EOC_SCHOLARS);
    expect(csv).toContain('Scholar Record ID,Roll Number,Scholar Name,Department');
    expect(csv).toContain('KA0210419980012345');
    expect(csv).toContain('Aarav Sundaram');
  });

  // Test 7: Professor of Practice 15-year industry experience validation
  it('enforces UGC 2022 minimum 15-year industry experience requirement for Professor of Practice', () => {
    const pop = onboardProfessorOfPractice({
      expertName: 'Vinod Khosla',
      parentOrganization: 'Silicon Valley Venture & CleanTech',
      designationInIndustry: 'Founding General Partner',
      totalYearsIndustryExperience: 30,
      department: 'Management Studies',
      fundingModel: 'HONORARY_POP',
    });

    expect(pop.popRecordId).toMatch(/^POP-2026-MANA-[A-F0-9]{6}$/);
    expect(pop.totalYearsIndustryExperience).toBe(30);
    expect(pop.auditSha256).toHaveLength(64);

    expect(() =>
      onboardProfessorOfPractice({
        expertName: 'Junior Engineer',
        parentOrganization: 'Tech Startup',
        designationInIndustry: 'Senior Developer',
        totalYearsIndustryExperience: 10, // less than 15 years
        department: 'CS',
        fundingModel: 'UNIVERSITY_FUNDED_POP',
      })
    ).toThrow(/minimum of 15 years/);
  });

  // Test 8: PoP tenure and honorarium cap constraints under UGC guidelines
  it('enforces maximum 4-year tenure and ₹1,00,000 monthly honorarium cap for university-funded PoPs', () => {
    expect(() =>
      onboardProfessorOfPractice({
        expertName: 'Dr. Over Tenure',
        parentOrganization: 'Corporate Lab',
        designationInIndustry: 'Director',
        totalYearsIndustryExperience: 20,
        department: 'Physics',
        fundingModel: 'UNIVERSITY_FUNDED_POP',
        tenureYears: 5, // exceeds 4 years
      })
    ).toThrow(/restrict total appointment duration to a maximum of 4 years/);

    expect(() =>
      onboardProfessorOfPractice({
        expertName: 'Dr. High Honorarium',
        parentOrganization: 'Fintech Firm',
        designationInIndustry: 'Managing Director',
        totalYearsIndustryExperience: 22,
        department: 'Commerce',
        fundingModel: 'UNIVERSITY_FUNDED_POP',
        monthlyHonorariumRateInr: 150000, // exceeds ₹1,00,000
      })
    ).toThrow(/cannot exceed ₹1,00,000\/month/);
  });

  // Test 9: PoP monthly honorarium billing, 10% TDS deduction and NEFT disbursement
  it('generates honorarium bills with 10% Section 194J TDS and handles NEFT disbursement clearance', () => {
    const pop = SAMPLE_POP_RECORDS[1]; // University-funded at ₹1,00,000/mo
    const { record: withBill, bill } = generatePoPHonorariumBill(pop, {
      billingMonth: '2026-04',
      daysDelivered: 20,
    });

    expect(bill.grossAmountInr).toBe(100000);
    expect(bill.tdsDeductionInr).toBe(10000); // 10% of 100,000
    expect(bill.netPayableInr).toBe(90000);
    expect(bill.status).toBe('GENERATED_PENDING_AUDIT');

    const disburseRes = disbursePoPHonorarium(withBill, bill.billId, 'TXN-NEFT-POP-TEST-9988');
    expect(disburseRes.success).toBe(true);
    expect(disburseRes.record.honorariumBills[0].status).toBe('DISBURSED_CLEARED');
    expect(disburseRes.record.honorariumBills[0].payoutReference).toBe('TXN-NEFT-POP-TEST-9988');
  });

  // Test 10: PoP CSV export
  it('exports official CSV for Professor of Practice ledger with tamper-proof SHA-256 seals', () => {
    const csv = exportPoPLedgerCSV(SAMPLE_POP_RECORDS);
    expect(csv).toContain('PoP Record ID,Expert Name,Parent Organization');
    expect(csv).toContain('Rameshwaram Krishnan');
    expect(csv).toContain('Intel Technology India');
  });
});
