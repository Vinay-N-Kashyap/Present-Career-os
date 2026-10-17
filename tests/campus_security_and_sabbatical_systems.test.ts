import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  STANDARD_STUDENT_CURFEW_HOUR,
  MAX_VISITOR_PERMITTED_HOURS,
  generateSecurityToken,
  checkCurfewOverstay,
  generateSecurityPassSeal,
  issueSecurityGatePass,
  logSecurityPassExit,
  flagSecurityBreach,
  exportCampusSecurityLedgerCSV,
  INITIAL_SECURITY_PASSES,
} from '../src/lib/admin/centralCampusSecurity';

import {
  MIN_SERVICE_YEARS_FOR_SABBATICAL,
  MAX_SABBATICAL_DURATION_MONTHS,
  MANDATORY_SERVICE_BOND_YEARS,
  generateSabbaticalToken,
  validateSabbaticalEligibility,
  generateSabbaticalSeal,
  proposeSabbaticalLeave,
  sanctionByExecutiveCouncil,
  activateSabbaticalDeputation,
  submitCompletionAndReturnToDuty,
  exportFacultySabbaticalLedgerCSV,
  INITIAL_FACULTY_SABBATICALS,
} from '../src/lib/teacher/facultySabbaticalLeave';

describe('TASK-1030: Master Campus Security & Faculty Sabbatical Systems Test Suite', () => {
  describe('TASK-1026: Central University Campus Security, Gate Pass Access Control & Visitor Protocol Engine', () => {
    it('1. generates unique security gate pass tracking token matching SEC-[YEAR]-[GATE]-[HEX6]', () => {
      const tokenGate1 = generateSecurityToken('MAIN_CAMPUS_GATE_1', 2026);
      assert.match(tokenGate1, /^SEC-2026-MAIN-[0-9A-F]{6}$/);

      const tokenGate2 = generateSecurityToken('RESIDENTIAL_NORTH_GATE_2', 2026);
      assert.match(tokenGate2, /^SEC-2026-RESI-[0-9A-F]{6}$/);

      const tokenGate3 = generateSecurityToken('RESEARCH_PARK_EAST_GATE_3', 2026);
      assert.match(tokenGate3, /^SEC-2026-RESE-[0-9A-F]{6}$/);
    });

    it('2. evaluates curfew overstay detection based on statutory curfew timestamp', () => {
      assert.strictEqual(STANDARD_STUDENT_CURFEW_HOUR, 21.5);
      assert.strictEqual(MAX_VISITOR_PERMITTED_HOURS, 12);

      const curfewDeadline = '2026-04-10T21:30:00Z';

      // Timestamp at 20:45 is compliant (false)
      assert.strictEqual(checkCurfewOverstay('2026-04-10T20:45:00Z', curfewDeadline), false);

      // Timestamp at 21:29 is compliant (false)
      assert.strictEqual(checkCurfewOverstay('2026-04-10T21:29:00Z', curfewDeadline), false);

      // Timestamp at 21:45 is an overstay breach (true)
      assert.strictEqual(checkCurfewOverstay('2026-04-10T21:45:00Z', curfewDeadline), true);

      // Timestamp at 22:30 is an overstay breach (true)
      assert.strictEqual(checkCurfewOverstay('2026-04-10T22:30:00Z', curfewDeadline), true);
    });

    it('3. issues security gate pass with input validation and cryptographic SHA-256 seal', () => {
      // Blank holder name throws error
      assert.throws(() => {
        issueSecurityGatePass({
          passType: 'OFFICIAL_VISITOR_ENTRY_PASS',
          holderFullName: '',
          holderContactPhone: '9876543210',
          holderIdProofType: 'AADHAAR',
          holderIdProofNumber: '1234',
          affiliatedDepartmentOrHost: 'Dean Office',
          purposeOfVisit: 'Inspection',
          entryCheckpoint: 'MAIN_CAMPUS_GATE_1',
          expectedExitTimestamp: '2026-04-10T18:00:00Z',
          securityOfficerBadgeId: 'OFF-01',
        });
      }, /Pass holder full name cannot be blank/);

      // Blank phone throws error
      assert.throws(() => {
        issueSecurityGatePass({
          passType: 'OFFICIAL_VISITOR_ENTRY_PASS',
          holderFullName: 'Kavita Roy',
          holderContactPhone: '  ',
          holderIdProofType: 'AADHAAR',
          holderIdProofNumber: '1234',
          affiliatedDepartmentOrHost: 'Dean Office',
          purposeOfVisit: 'Inspection',
          entryCheckpoint: 'MAIN_CAMPUS_GATE_1',
          expectedExitTimestamp: '2026-04-10T18:00:00Z',
          securityOfficerBadgeId: 'OFF-01',
        });
      }, /Emergency contact phone number must be provided/);

      const pass = issueSecurityGatePass({
        passType: 'OFFICIAL_VISITOR_ENTRY_PASS',
        holderFullName: 'Prof. N. K. Bansal',
        holderContactPhone: '+91-9876501234',
        holderIdProofType: 'UNIVERSITY_ID',
        holderIdProofNumber: 'IITD-FAC-401',
        affiliatedDepartmentOrHost: 'Physics Department (Dr. Sen)',
        purposeOfVisit: 'SERB Project Expert Review Committee',
        entryCheckpoint: 'MAIN_CAMPUS_GATE_1',
        expectedExitTimestamp: '2026-04-10T18:00:00Z',
        vehicle: {
          vehicleRegistrationNumber: 'DL-04-CA-8819',
          vehicleType: 'FOUR_WHEELER',
          isRfidTagActive: true,
        },
        securityOfficerBadgeId: 'SEC-OFF-011',
      });

      assert.strictEqual(pass.holderFullName, 'Prof. N. K. Bansal');
      assert.strictEqual(pass.stage, 'ACTIVE_ON_CAMPUS');
      assert.strictEqual(pass.vehicle?.vehicleRegistrationNumber, 'DL-04-CA-8819');
      assert.strictEqual(pass.cryptographicSeal?.length, 64);
    });

    it('4. logs outward exit with on-time closure vs curfew overstay flagging', () => {
      const studentPass = issueSecurityGatePass({
        passType: 'RESIDENT_STUDENT_OUT_PASS',
        holderFullName: 'Rohit Kulkarni',
        holderContactPhone: '+91-9988776655',
        holderIdProofType: 'UNIVERSITY_ID',
        holderIdProofNumber: 'EN-2024-ME-019',
        affiliatedDepartmentOrHost: 'Block A Hostels',
        purposeOfVisit: 'Evening group project study',
        entryCheckpoint: 'RESIDENTIAL_NORTH_GATE_2',
        expectedExitTimestamp: '2026-04-10T21:00:00Z',
        curfewDeadlineTimestamp: '2026-04-10T21:30:00Z',
        securityOfficerBadgeId: 'SEC-OFF-022',
      });

      assert.strictEqual(studentPass.isCurfewApplicable, true);

      // On-time exit at 21:15
      const closedOnTime = logSecurityPassExit(
        studentPass,
        'RESIDENTIAL_NORTH_GATE_2',
        '2026-04-10T21:15:00Z'
      );
      assert.strictEqual(closedOnTime.stage, 'LOGGED_OUT_OF_CAMPUS');
      assert.strictEqual(closedOnTime.isOverstayDetected, false);

      // Delayed exit at 22:10 (past 21:30 curfew)
      const overstayPass = logSecurityPassExit(
        studentPass,
        'RESIDENTIAL_NORTH_GATE_2',
        '2026-04-10T22:10:00Z'
      );
      assert.strictEqual(overstayPass.stage, 'CURFEW_OVERSTAY_FLAGGED');
      assert.strictEqual(overstayPass.isOverstayDetected, true);
    });

    it('5. flags security breach, detains pass under security hold, and blocks routine exit', () => {
      const visitorPass = issueSecurityGatePass({
        passType: 'OFFICIAL_VISITOR_ENTRY_PASS',
        holderFullName: 'Unknown Contractor Courier',
        holderContactPhone: '+91-9123456780',
        holderIdProofType: 'DRIVING_LICENSE',
        holderIdProofNumber: 'DL-01-2020-00192',
        affiliatedDepartmentOrHost: 'General Administration',
        purposeOfVisit: 'Courier delivery',
        entryCheckpoint: 'MAIN_CAMPUS_GATE_1',
        expectedExitTimestamp: '2026-04-10T14:00:00Z',
        securityOfficerBadgeId: 'SEC-OFF-011',
      });

      const detained = flagSecurityBreach(
        visitorPass,
        'Found loitering in restricted high-voltage sub-station perimeter without escort'
      );

      assert.strictEqual(detained.stage, 'BLACKLISTED_SECURITY_HOLD');
      assert.match(detained.purposeOfVisit, /SECURITY BREACH/);

      // Cannot execute routine exit when held
      assert.throws(() => {
        logSecurityPassExit(detained, 'MAIN_CAMPUS_GATE_1');
      }, /Cannot log routine exit: Pass is currently detained under security hold/);
    });
  });

  describe('TASK-1028: Faculty Sabbatical Leave & Research Deputation Governance Engine', () => {
    it('6. generates unique sabbatical tracking token matching SAB-[YEAR]-[DEPT]-[HEX6]', () => {
      const tokenCSE = generateSabbaticalToken('Computer Science', 2026);
      assert.match(tokenCSE, /^SAB-2026-COMP-[0-9A-F]{6}$/);

      const tokenPhysics = generateSabbaticalToken('Physics', 2026);
      assert.match(tokenPhysics, /^SAB-2026-PHYS-[0-9A-F]{6}$/);
    });

    it('7. evaluates UGC Clause 8.4 sabbatical eligibility constraints', () => {
      assert.strictEqual(MIN_SERVICE_YEARS_FOR_SABBATICAL, 6.0);
      assert.strictEqual(MAX_SABBATICAL_DURATION_MONTHS, 12);
      assert.strictEqual(MANDATORY_SERVICE_BOND_YEARS, 3);

      // Under 6 years service fails
      const underService = validateSabbaticalEligibility('PROFESSOR', 4.5, 12);
      assert.strictEqual(underService.isEligible, false);
      assert.match(underService.error || '', /below statutory hurdle/);

      // Over 12 months duration fails
      const overDuration = validateSabbaticalEligibility('PROFESSOR', 7.0, 15);
      assert.strictEqual(overDuration.isEligible, false);
      assert.match(overDuration.error || '', /exceeds statutory ceiling/);

      // 6.5 years service and 12 months duration is eligible
      const valid = validateSabbaticalEligibility('PROFESSOR', 6.5, 12);
      assert.strictEqual(valid.isEligible, true);
    });

    it('8. proposes sabbatical leave with input validation and requires service bond for EC sanction', () => {
      // Validation failure on empty title
      assert.throws(() => {
        proposeSabbaticalLeave({
          facultyName: 'Dr. Sen',
          empId: 'EMP-01',
          department: 'CSE',
          designation: 'PROFESSOR',
          completedContinuousServiceYears: 8.0,
          category: 'FOREIGN_POSTDOCTORAL_FELLOWSHIP',
          hostInstitutionName: 'MIT',
          hostCountry: 'USA',
          proposedStartDate: '2026-09-01',
          proposedEndDate: '2027-08-31',
          durationMonths: 12,
          researchProjectTitle: '',
        });
      }, /Research project title must be specified/);

      const proposal = proposeSabbaticalLeave({
        facultyName: 'Dr. Meera Iyer',
        empId: 'EMP-AERO-01',
        department: 'Aerospace Engineering',
        designation: 'PROFESSOR',
        completedContinuousServiceYears: 9.0,
        category: 'FOREIGN_POSTDOCTORAL_FELLOWSHIP',
        hostInstitutionName: 'NASA Jet Propulsion Laboratory / Caltech',
        hostCountry: 'United States',
        proposedStartDate: '2026-09-01',
        proposedEndDate: '2027-08-31',
        durationMonths: 12,
        researchProjectTitle: 'Autonomous Ion Propulsion Trajectory Optimization for Deep Space Probes',
        externalMonthlyStipendInr: 550000,
      });

      assert.strictEqual(proposal.stage, 'SABBATICAL_PROPOSED');
      assert.strictEqual(proposal.isServiceBondSigned, false);

      // Refusal to sign service bond prevents Executive Council sanction
      assert.throws(() => {
        sanctionByExecutiveCouncil(proposal, false);
      }, /Executive Council cannot sanction sabbatical without execution of mandatory 3-year service bond/);

      // Sanction with bond execution
      const sanctioned = sanctionByExecutiveCouncil(proposal, true);
      assert.strictEqual(sanctioned.stage, 'EXECUTIVE_COUNCIL_SANCTIONED');
      assert.strictEqual(sanctioned.isServiceBondSigned, true);
      assert.strictEqual(sanctioned.serviceBondDurationYears, 3);
    });

    it('9. activates sabbatical deputation, submits monograph report, and certifies return to duty', () => {
      const proposal = proposeSabbaticalLeave({
        facultyName: 'Dr. Anand Kumar',
        empId: 'EMP-CHEM-031',
        department: 'Chemistry',
        designation: 'ASSOCIATE_PROFESSOR',
        completedContinuousServiceYears: 6.8,
        category: 'NATIONAL_LAB_VISITING_SCIENTIST',
        hostInstitutionName: 'CSIR National Chemical Laboratory (NCL Pune)',
        hostCountry: 'India',
        proposedStartDate: '2026-06-01',
        proposedEndDate: '2026-11-30',
        durationMonths: 6,
        researchProjectTitle: 'Green Catalytic Synthesis of Biodegradable Polymers from Agricultural Biomass',
      });

      const sanctioned = sanctionByExecutiveCouncil(proposal, true);
      const activated = activateSabbaticalDeputation(sanctioned);
      assert.strictEqual(activated.stage, 'DEPUTATION_ACTIVE_ONGOING');

      // Monograph submission cannot be empty
      assert.throws(() => {
        submitCompletionAndReturnToDuty(activated, {
          completionMonographTitle: '',
          returnToDutyDate: '2026-12-01',
        });
      }, /Completion research monograph title or book treatise must be submitted/);

      const returned = submitCompletionAndReturnToDuty(activated, {
        completionMonographTitle: 'Monograph on Heterogeneous Nanocatalysis for Sustainable Biomass Upcycling',
        returnToDutyDate: '2026-12-01',
      });

      assert.strictEqual(returned.stage, 'RETURN_TO_DUTY_CERTIFIED');
      assert.strictEqual(returned.returnToDutyDate, '2026-12-01');
      assert.strictEqual(returned.cryptographicSeal?.length, 64);
    });

    it('10. generates deterministic statutory CSV exports for both Security Gate and Sabbatical ledgers', () => {
      const securityCsv = exportCampusSecurityLedgerCSV(INITIAL_SECURITY_PASSES);
      assert.match(securityCsv, /Pass ID,Tracking Token,Pass Type/);
      assert.match(securityCsv, /Kunal Verma/);
      assert.match(securityCsv, /Dr. Vivek Swaminathan/);

      const sabbaticalCsv = exportFacultySabbaticalLedgerCSV(INITIAL_FACULTY_SABBATICALS);
      assert.match(sabbaticalCsv, /Sabbatical ID,Tracking Token,Faculty Name/);
      assert.match(sabbaticalCsv, /Dr. Siddharth Sen/);
      assert.match(sabbaticalCsv, /Dr. Neha Kulkarni/);
    });
  });
});
