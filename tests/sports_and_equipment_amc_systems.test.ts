import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  SPORTS_TIER_POINTS_MATRIX,
  MAX_SPORTS_QUOTA_PERCENTAGE,
  MIN_TRIAL_QUALIFYING_SCORE,
  generateSportsToken,
  calculateCompositeSportsScore,
  generateSportsApplicantSeal,
  registerSportsApplicant,
  recordFitnessTrials,
  offerSportsQuotaAdmission,
  confirmSportsAdmission,
  exportSportsQuotaLedgerCSV,
  INITIAL_SPORTS_APPLICANTS,
} from '../src/lib/admin/centralSports';

import {
  DAILY_PENALTY_PERCENTAGE,
  generateAmcToken,
  calculateDowntimePenalty,
  generateEquipmentAmcSeal,
  registerEquipmentAsset,
  logEquipmentBreakdown,
  recordCalibrationService,
  renewMaintenanceContract,
  exportEquipmentAmcLedgerCSV,
  INITIAL_EQUIPMENT_ASSETS,
} from '../src/lib/teacher/facultyEquipmentAmc';

describe('TASK-1015: Master Sports Quota & Laboratory Equipment AMC Systems Test Suite', () => {
  describe('TASK-1011: Central University Sports Quota & Inter-University Tournament Governance Engine', () => {
    it('1. generates unique sports tracking token matching SPRT-[YEAR]-[DISC]-[HEX6]', () => {
      const tokenBasketball = generateSportsToken('BASKETBALL', 2026);
      assert.match(tokenBasketball, /^SPRT-2026-BASK-[0-9A-F]{6}$/);

      const tokenSwimming = generateSportsToken('SWIMMING', 2026);
      assert.match(tokenSwimming, /^SPRT-2026-SWIM-[0-9A-F]{6}$/);

      const tokenAthletics = generateSportsToken('ATHLETICS', 2026);
      assert.match(tokenAthletics, /^SPRT-2026-ATHL-[0-9A-F]{6}$/);
    });

    it('2. validates AIU achievement tier points matrix and composite sports merit calculation', () => {
      assert.strictEqual(SPORTS_TIER_POINTS_MATRIX.TIER_1_INTERNATIONAL, 100);
      assert.strictEqual(SPORTS_TIER_POINTS_MATRIX.TIER_2_ALL_INDIA_AIU, 85);
      assert.strictEqual(SPORTS_TIER_POINTS_MATRIX.TIER_3_ZONAL_INTER_UNIV, 65);
      assert.strictEqual(SPORTS_TIER_POINTS_MATRIX.TIER_4_INTER_COLLEGIATE, 45);

      assert.strictEqual(MAX_SPORTS_QUOTA_PERCENTAGE, 5.0);
      assert.strictEqual(MIN_TRIAL_QUALIFYING_SCORE, 50.0);

      // Composite score formula: base * 0.5 + trial * 0.5
      // 85 base + 87 trial = 42.5 + 43.5 = 86.0
      const composite1 = calculateCompositeSportsScore(85, 87);
      assert.strictEqual(composite1, 86.0);

      // 100 base + 95 trial = 50.0 + 47.5 = 97.5
      const composite2 = calculateCompositeSportsScore(100, 95);
      assert.strictEqual(composite2, 97.5);
    });

    it('3. registers sports quota applicant with input validation and cryptographic SHA-256 seal', () => {
      // Validation failure on blank full name
      assert.throws(() => {
        registerSportsApplicant({
          fullName: '   ',
          enrollmentOrAppNo: 'APP-001',
          sportsDiscipline: 'BADMINTON',
          achievementTier: 'TIER_3_ZONAL_INTER_UNIV',
          highestTournamentName: 'Zonal Inter-University Badminton',
          certificateIssuingAuthority: 'AIU',
          certificateYear: 2025,
          departmentApplied: 'CSE',
        });
      }, /Applicant full name cannot be blank/);

      // Validation failure on empty tournament name
      assert.throws(() => {
        registerSportsApplicant({
          fullName: 'Vikram Singh',
          enrollmentOrAppNo: 'APP-001',
          sportsDiscipline: 'BADMINTON',
          achievementTier: 'TIER_3_ZONAL_INTER_UNIV',
          highestTournamentName: '',
          certificateIssuingAuthority: 'AIU',
          certificateYear: 2025,
          departmentApplied: 'CSE',
        });
      }, /Tournament name must be specified/);

      const applicant = registerSportsApplicant({
        fullName: 'Vikram Singh',
        enrollmentOrAppNo: 'SPRT-APP-2026-101',
        sportsDiscipline: 'BADMINTON',
        achievementTier: 'TIER_3_ZONAL_INTER_UNIV',
        highestTournamentName: 'North Zone Inter-University Championship 2025',
        certificateIssuingAuthority: 'Association of Indian Universities',
        certificateYear: 2025,
        departmentApplied: 'Computer Science & Engineering',
      });

      assert.strictEqual(applicant.fullName, 'Vikram Singh');
      assert.strictEqual(applicant.sportsDiscipline, 'BADMINTON');
      assert.strictEqual(applicant.achievementTier, 'TIER_3_ZONAL_INTER_UNIV');
      assert.strictEqual(applicant.baseAchievementPoints, 65);
      assert.strictEqual(applicant.stage, 'APPLICATION_FILED');
      assert.match(applicant.trackingToken, /^SPRT-\d{4}-BADM-[0-9A-F]{6}$/);
      assert.strictEqual(applicant.cryptographicSeal?.length, 64);
    });

    it('4. records fitness trials with 50-point hurdle qualification and rejection logic', () => {
      const applicant = registerSportsApplicant({
        fullName: 'Kavita Nair',
        enrollmentOrAppNo: 'SPRT-APP-2026-102',
        sportsDiscipline: 'VOLLEYBALL',
        achievementTier: 'TIER_2_ALL_INDIA_AIU',
        highestTournamentName: 'All India Inter-University Volleyball Tourney',
        certificateIssuingAuthority: 'AIU Sports Board',
        certificateYear: 2025,
        departmentApplied: 'School of Biotechnology',
      });

      // Passing trial: skill 42 + fitness 38 = 80 (>= 50 hurdle)
      const qualified = recordFitnessTrials(applicant, {
        sprint50mSeconds: 6.7,
        standingBroadJumpMeters: 2.3,
        enduranceRun1000mMinutes: 3.5,
        skillTrialScore: 42,
        fitnessTrialScore: 38,
      });

      assert.strictEqual(qualified.stage, 'FITNESS_TRIALS_COMPLETED');
      assert.strictEqual(qualified.trialMetrics?.isTrialQualified, true);
      assert.strictEqual(qualified.trialMetrics?.totalTrialScore, 80);
      assert.strictEqual(qualified.compositeSportsMeritScore, (85 * 0.5) + (80 * 0.5)); // 42.5 + 40 = 82.5
      assert.strictEqual(qualified.disqualificationReason, undefined);

      // Failing trial: skill 20 + fitness 25 = 45 (< 50 hurdle)
      const rejected = recordFitnessTrials(applicant, {
        sprint50mSeconds: 8.5,
        standingBroadJumpMeters: 1.8,
        enduranceRun1000mMinutes: 5.0,
        skillTrialScore: 20,
        fitnessTrialScore: 25,
      });

      assert.strictEqual(rejected.stage, 'APPLICATION_REJECTED');
      assert.strictEqual(rejected.trialMetrics?.isTrialQualified, false);
      assert.match(rejected.disqualificationReason || '', /below statutory hurdle/);
    });

    it('5. offers supernumerary sports quota admission and confirms enrollment with cryptographic audit trail', () => {
      const applicant = registerSportsApplicant({
        fullName: 'Sameer Khan',
        enrollmentOrAppNo: 'SPRT-APP-2026-103',
        sportsDiscipline: 'CRICKET',
        achievementTier: 'TIER_1_INTERNATIONAL',
        highestTournamentName: 'ICC U-19 World Cup Representative',
        certificateIssuingAuthority: 'BCCI / ICC',
        certificateYear: 2025,
        departmentApplied: 'Commerce & Management',
      });

      // Cannot offer admission before qualifying trials
      assert.throws(() => {
        offerSportsQuotaAdmission(applicant);
      }, /Cannot offer admission: Applicant must qualify fitness trials/);

      const trialQualified = recordFitnessTrials(applicant, {
        sprint50mSeconds: 6.2,
        standingBroadJumpMeters: 2.7,
        enduranceRun1000mMinutes: 3.1,
        skillTrialScore: 48,
        fitnessTrialScore: 46,
      });

      const seatOffered = offerSportsQuotaAdmission(trialQualified, 60000);
      assert.strictEqual(seatOffered.stage, 'MERIT_SEAT_OFFERED');
      assert.strictEqual(seatOffered.sportsScholarshipAwardedInr, 60000);

      // Cannot confirm without seat offered
      assert.throws(() => {
        confirmSportsAdmission(trialQualified);
      }, /Cannot confirm admission: Seat must be offered first/);

      const confirmed = confirmSportsAdmission(seatOffered);
      assert.strictEqual(confirmed.stage, 'ADMISSION_CONFIRMED');
      assert.strictEqual(confirmed.cryptographicSeal?.length, 64);
      assert.notStrictEqual(confirmed.cryptographicSeal, seatOffered.cryptographicSeal);
    });
  });

  describe('TASK-1013: Faculty Laboratory Equipment Maintenance & AMC Ledger Engine', () => {
    it('6. generates unique equipment AMC tracking token matching AMC-[YEAR]-[DEPT]-[HEX6]', () => {
      const tokenCSE = generateAmcToken('Computer Science', 2026);
      assert.match(tokenCSE, /^AMC-2026-COMP-[0-9A-F]{6}$/);

      const tokenEEE = generateAmcToken('Electrical Engineering', 2026);
      assert.match(tokenEEE, /^AMC-2026-ELEC-[0-9A-F]{6}$/);
    });

    it('7. calculates GFR Rule 169 downtime penalty based on SLA excess hours', () => {
      assert.strictEqual(DAILY_PENALTY_PERCENTAGE, 1.0);

      const annualAmcValue = 1200000; // 12 Lakhs annual contract
      const maxSlaHours = 48; // 2 days resolution window

      // Zero penalty within SLA window
      assert.strictEqual(calculateDowntimePenalty(annualAmcValue, 24, maxSlaHours), 0);
      assert.strictEqual(calculateDowntimePenalty(annualAmcValue, 48, maxSlaHours), 0);

      // Exceeding SLA: 96 hours downtime (excess 48 hours = 2 days)
      // Daily penalty = 1% of 1,200,000 = 12,000 INR
      // 2 days * 12,000 = 24,000 INR
      const penalty48Excess = calculateDowntimePenalty(annualAmcValue, 96, maxSlaHours);
      assert.strictEqual(penalty48Excess, 24000);

      // 72 hours downtime (excess 24 hours = 1 day) -> 12,000 INR
      const penalty24Excess = calculateDowntimePenalty(annualAmcValue, 72, maxSlaHours);
      assert.strictEqual(penalty24Excess, 12000);
    });

    it('8. registers laboratory equipment asset with custodian validation and initial operational status', () => {
      // Validation failure on missing equipment name
      assert.throws(() => {
        registerEquipmentAsset({
          equipmentName: '',
          serialNumber: 'SN-001',
          department: 'Physics',
          labLocation: 'Optics Lab',
          facultyCustodianName: 'Dr. Ray',
          facultyCustodianEmpId: 'EMP-01',
          category: 'ANALYTICAL_RESEARCH_INSTRUMENT',
          procurementValueInr: 500000,
          contractType: 'OEM_WARRANTY',
          vendorName: 'Zeiss',
          contractStartDate: '2026-01-01',
          contractEndDate: '2027-01-01',
          annualContractValueInr: 50000,
        });
      }, /Equipment name cannot be blank/);

      // Validation failure on zero or negative procurement value
      assert.throws(() => {
        registerEquipmentAsset({
          equipmentName: 'Digital Storage Oscilloscope',
          serialNumber: 'SN-001',
          department: 'Physics',
          labLocation: 'Optics Lab',
          facultyCustodianName: 'Dr. Ray',
          facultyCustodianEmpId: 'EMP-01',
          category: 'DEPARTMENTAL_TEACHING_BENCH',
          procurementValueInr: 0,
          contractType: 'OEM_WARRANTY',
          vendorName: 'Tektronix',
          contractStartDate: '2026-01-01',
          contractEndDate: '2027-01-01',
          annualContractValueInr: 50000,
        });
      }, /Procurement value must be strictly greater than 0/);

      const asset = registerEquipmentAsset({
        equipmentName: 'Field Emission Scanning Electron Microscope (FE-SEM)',
        serialNumber: 'SN-SEM-99014',
        department: 'Metallurgical & Materials Engineering',
        labLocation: 'Advanced Characterization Central Facility',
        facultyCustodianName: 'Dr. Meera Iyer',
        facultyCustodianEmpId: 'EMP-MME-031',
        category: 'ANALYTICAL_RESEARCH_INSTRUMENT',
        procurementValueInr: 25000000,
        contractType: 'COMPREHENSIVE_CAMC',
        vendorName: 'JEOL India Pvt Ltd',
        contractStartDate: '2026-04-01',
        contractEndDate: '2027-03-31',
        annualContractValueInr: 1800000,
        maxSlaResolutionHours: 24,
      });

      assert.strictEqual(asset.status, 'OPERATIONAL');
      assert.strictEqual(asset.activeDowntimeHours, 0);
      assert.strictEqual(asset.accruedDowntimePenaltyInr, 0);
      assert.strictEqual(asset.maxSlaResolutionHours, 24);
      assert.match(asset.trackingToken, /^AMC-\d{4}-META-[0-9A-F]{6}$/);
      assert.strictEqual(asset.cryptographicSeal?.length, 64);
    });

    it('9. logs equipment breakdown, calculates GFR SLA penalty, and verifies state transition', () => {
      const asset = registerEquipmentAsset({
        equipmentName: 'High-Temperature Vacuum Sintering Furnace',
        serialNumber: 'SN-FURNACE-101',
        department: 'Mechanical Engineering',
        labLocation: 'Thermodynamics & Materials Lab',
        facultyCustodianName: 'Dr. Tarun Verma',
        facultyCustodianEmpId: 'EMP-MECH-022',
        category: 'HEAVY_ENGINEERING_RIG',
        procurementValueInr: 8000000,
        contractType: 'NON_COMPREHENSIVE_AMC',
        vendorName: 'Thermfurn Systems India',
        contractStartDate: '2026-01-01',
        contractEndDate: '2026-12-31',
        annualContractValueInr: 400000,
        maxSlaResolutionHours: 48,
      });

      // Log 96 hours breakdown (48 hours excess = 2 days)
      // Daily penalty = 1% of 400,000 = 4,000 INR
      // 2 days * 4,000 = 8,000 INR
      const underRepair = logEquipmentBreakdown(asset, 96);
      assert.strictEqual(underRepair.status, 'UNDER_BREAKDOWN_REPAIR');
      assert.strictEqual(underRepair.activeDowntimeHours, 96);
      assert.strictEqual(underRepair.accruedDowntimePenaltyInr, 8000);
      assert.strictEqual(underRepair.cryptographicSeal?.length, 64);
    });

    it('10. records NABL calibration service, contract renewal, and generates statutory CSV exports', () => {
      const asset = registerEquipmentAsset({
        equipmentName: 'Inductively Coupled Plasma Mass Spectrometer (ICP-MS)',
        serialNumber: 'SN-ICPMS-4411',
        department: 'Chemistry',
        labLocation: 'Trace Analysis Lab (Room 214)',
        facultyCustodianName: 'Dr. Sunita Rao',
        facultyCustodianEmpId: 'EMP-CHEM-015',
        category: 'ANALYTICAL_RESEARCH_INSTRUMENT',
        procurementValueInr: 18000000,
        contractType: 'COMPREHENSIVE_CAMC',
        vendorName: 'Agilent Technologies India',
        contractStartDate: '2025-04-01',
        contractEndDate: '2026-03-31',
        annualContractValueInr: 1200000,
        maxSlaResolutionHours: 24,
      });

      // Record successful NABL calibration
      const calibrated = recordCalibrationService(asset, {
        calibrationDate: '2026-02-15',
        nextDueDate: '2027-02-15',
        certifyingAgency: 'National Accreditation Board for Testing and Calibration Laboratories (NABL)',
        certificateNumber: 'NABL-CAL-CHEM-2026-092',
        isCompliant: true,
      });

      assert.strictEqual(calibrated.status, 'OPERATIONAL');
      assert.strictEqual(calibrated.calibrationHistory.length, 1);
      assert.strictEqual(calibrated.calibrationHistory[0].certificateNumber, 'NABL-CAL-CHEM-2026-092');

      // Renew AMC
      const renewed = renewMaintenanceContract(calibrated, {
        contractType: 'COMPREHENSIVE_CAMC',
        vendorName: 'Agilent Technologies India',
        contractStartDate: '2026-04-01',
        contractEndDate: '2027-03-31',
        annualContractValueInr: 1350000,
      });

      assert.strictEqual(renewed.annualContractValueInr, 1350000);
      assert.strictEqual(renewed.contractStartDate, '2026-04-01');

      // CSV export tests for sports quota and equipment AMC
      const sportsCsv = exportSportsQuotaLedgerCSV(INITIAL_SPORTS_APPLICANTS);
      assert.match(sportsCsv, /Applicant ID,Tracking Token,Full Name/);
      assert.match(sportsCsv, /Rohan Deshmukh/);
      assert.match(sportsCsv, /Ananya Roy/);

      const amcCsv = exportEquipmentAmcLedgerCSV(INITIAL_EQUIPMENT_ASSETS);
      assert.match(amcCsv, /Asset ID,Tracking Token,Equipment Name/);
      assert.match(amcCsv, /High-Density GPU Cluster/);
      assert.match(amcCsv, /High-Voltage Impulse Generator/);
    });
  });
});
