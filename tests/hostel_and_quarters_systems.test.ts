import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  MIN_HOSTEL_DISTANCE_KM,
  MIN_MESS_REBATE_DAYS,
  DAILY_MESS_REBATE_INR,
  generateHostelToken,
  calculateDistanceMeritScore,
  calculateMessRebate,
  generateHostelSeal,
  registerHostelApplicant,
  allotHostelRoom,
  checkInResident,
  approveMessRebate,
  recordHostelDiscipline,
  exportHostelAllocationLedgerCSV,
  INITIAL_HOSTEL_RESIDENTS,
} from '../src/lib/admin/centralHostelWarden';

import {
  QUARTER_STANDARDS,
  HRA_TIER_PERCENTAGES,
  STANDARD_WATER_ELECTRICITY_INR,
  generateQuartersToken,
  calculateMonthlyHraSurrender,
  calculateTotalMonthlyDeductions,
  generateQuartersSeal,
  applyForResidentialQuarter,
  offerResidentialQuarter,
  occupyQuarterAndSurrenderHra,
  vacateQuarterAndIssueNoDues,
  exportFacultyQuartersLedgerCSV,
  INITIAL_FACULTY_QUARTERS,
} from '../src/lib/teacher/facultyQuartersAllotment';

describe('TASK-1025: Master Hostel Welfare & Faculty Campus Quarters Systems Test Suite', () => {
  describe('TASK-1021: Central University Hostel Allocation, Mess Rebate & Wardenship Disciplinary Engine', () => {
    it('1. generates unique hostel tracking token matching HSTL-[YEAR]-[BLOCK]-[HEX6]', () => {
      const tokenA = generateHostelToken('BLOCK_A_MENS_JUNIOR', 2026);
      assert.match(tokenA, /^HSTL-2026-BLOC-[0-9A-F]{6}$/);

      const tokenC = generateHostelToken('BLOCK_C_WOMENS_MAIN', 2026);
      assert.match(tokenC, /^HSTL-2026-BLOC-[0-9A-F]{6}$/);

      const tokenInt = generateHostelToken('INTERNATIONAL_SCHOLAR_TOWER', 2026);
      assert.match(tokenInt, /^HSTL-2026-INTE-[0-9A-F]{6}$/);
    });

    it('2. calculates distance-merit priority score and awards statutory PwD 100.0 priority', () => {
      assert.strictEqual(MIN_HOSTEL_DISTANCE_KM, 50);

      // Distance 500 km (norm = 50), CGPA 9.0 (norm = 90) -> (50 * 0.5) + (90 * 0.5) = 25 + 45 = 70.0
      const score = calculateDistanceMeritScore(500, 9.0, false);
      assert.strictEqual(score, 70.0);

      // Distance 1000 km (norm = 100), CGPA 10.0 (norm = 100) -> 100.0
      const maxScore = calculateDistanceMeritScore(1200, 10.0, false);
      assert.strictEqual(maxScore, 100.0);

      // PwD category guarantees 100.0 regardless of distance or CGPA
      const pwdScore = calculateDistanceMeritScore(60, 6.5, true);
      assert.strictEqual(pwdScore, 100.0);
    });

    it('3. registers student hostel applicant with statutory 50 km distance threshold check', () => {
      // Ineligible student residing < 50 km (e.g. 35 km) throws error unless PwD
      assert.throws(() => {
        registerHostelApplicant({
          studentFullName: 'Vikas Sharma',
          enrollmentNumber: 'EN-001',
          gender: 'MALE',
          department: 'CSE',
          academicProgram: 'B.Tech',
          homeDistanceKm: 35,
          academicCgpa: 8.5,
          blockName: 'BLOCK_A_MENS_JUNIOR',
          roomType: 'DOUBLE_SHARING',
        });
      }, /Ineligible for hostel: Home distance \(35 km\) is below statutory threshold/);

      // PwD student residing < 50 km is permitted
      const pwdApplicant = registerHostelApplicant({
        studentFullName: 'Divya Patel',
        enrollmentNumber: 'EN-002',
        gender: 'FEMALE',
        department: 'ECE',
        academicProgram: 'B.Tech',
        homeDistanceKm: 25,
        academicCgpa: 8.2,
        isPwdCategory: true,
        blockName: 'BLOCK_C_WOMENS_MAIN',
        roomType: 'DOUBLE_SHARING',
      });

      assert.strictEqual(pwdApplicant.isPwdCategory, true);
      assert.strictEqual(pwdApplicant.priorityMeritScore, 100.0);
      assert.strictEqual(pwdApplicant.stage, 'APPLICATION_SUBMITTED');
      assert.strictEqual(pwdApplicant.cryptographicSeal?.length, 64);
    });

    it('4. executes room allotment and resident check-in state transitions', () => {
      const applicant = registerHostelApplicant({
        studentFullName: 'Harsh Vardhan',
        enrollmentNumber: 'EN-2026-ME-041',
        gender: 'MALE',
        department: 'Mechanical Engineering',
        academicProgram: 'B.Tech ME',
        homeDistanceKm: 600,
        academicCgpa: 8.0,
        blockName: 'BLOCK_B_MENS_SENIOR',
        roomType: 'DOUBLE_SHARING',
      });

      // Cannot check in before room allotment
      assert.throws(() => {
        checkInResident(applicant);
      }, /Cannot check in: Room must be allotted first/);

      const allotted = allotHostelRoom(applicant, 'B-204');
      assert.strictEqual(allotted.stage, 'ROOM_ALLOTTED');
      assert.strictEqual(allotted.roomNumber, 'B-204');

      const checkedIn = checkInResident(allotted);
      assert.strictEqual(checkedIn.stage, 'CHECKED_IN');
      assert.strictEqual(checkedIn.cryptographicSeal?.length, 64);
      assert.notStrictEqual(checkedIn.cryptographicSeal, allotted.cryptographicSeal);
    });

    it('5. enforces minimum 5-day consecutive leave hurdle for mess rebate auditing', () => {
      assert.strictEqual(MIN_MESS_REBATE_DAYS, 5);
      assert.strictEqual(DAILY_MESS_REBATE_INR, 150);

      // Less than 5 days yields 0 rebate
      assert.strictEqual(calculateMessRebate(4), 0);
      assert.strictEqual(calculateMessRebate(1), 0);

      // 7 days leave = 7 * 150 = 1050 INR
      assert.strictEqual(calculateMessRebate(7), 1050);

      // 10 days leave = 10 * 150 = 1500 INR
      assert.strictEqual(calculateMessRebate(10), 1500);

      const resident = checkInResident(
        allotHostelRoom(
          registerHostelApplicant({
            studentFullName: 'Pooja Reddy',
            enrollmentNumber: 'EN-2026-CH-012',
            gender: 'FEMALE',
            department: 'Chemical Engineering',
            academicProgram: 'M.Tech',
            homeDistanceKm: 500,
            academicCgpa: 9.1,
            blockName: 'BLOCK_D_WOMENS_RESEARCH',
            roomType: 'SINGLE_OCCUPANCY_SCHOLAR',
          }),
          'D-305'
        )
      );

      // Leave under 5 days throws validation error
      assert.throws(() => {
        approveMessRebate(resident, {
          startDate: '2026-05-01',
          endDate: '2026-05-04',
          totalLeaveDays: 4,
        });
      }, /Mess rebate rejected: Leave duration \(4 days\) is less than minimum statutory threshold/);

      const rebated = approveMessRebate(resident, {
        startDate: '2026-05-01',
        endDate: '2026-05-08',
        totalLeaveDays: 8,
      });

      assert.strictEqual(rebated.messRebates.length, 1);
      assert.strictEqual(rebated.messRebates[0].totalRebateCreditInr, 1200);
    });

    it('6. records warden disciplinary incidents, fines, probation, and expulsion', () => {
      const resident = checkInResident(
        allotHostelRoom(
          registerHostelApplicant({
            studentFullName: 'Kunal Mishra',
            enrollmentNumber: 'EN-2026-CE-089',
            gender: 'MALE',
            department: 'Civil Engineering',
            academicProgram: 'B.Tech',
            homeDistanceKm: 300,
            academicCgpa: 7.4,
            blockName: 'BLOCK_A_MENS_JUNIOR',
            roomType: 'TRIPLE_SHARING',
          }),
          'A-110'
        )
      );

      // Minor incident: Curfew breach
      const disciplined = recordHostelDiscipline(resident, {
        violation: 'CURFEW_BREACH',
        fineAmountInr: 500,
        actionTaken: 'Formal reprimand and ₹500 fine',
        wardenName: 'Dr. V. P. Singh (Warden)',
        isSevereExpulsion: false,
      });

      assert.strictEqual(disciplined.stage, 'DISCIPLINARY_PROBATION');
      assert.strictEqual(disciplined.disciplinaryIncidents.length, 1);
      assert.strictEqual(disciplined.disciplinaryIncidents[0].fineAmountInr, 500);

      // Severe incident: Expulsion
      const expelled = recordHostelDiscipline(disciplined, {
        violation: 'RAGGING_INTIMIDATION',
        fineAmountInr: 5000,
        actionTaken: 'Proctorial board decision: Immediate expulsion from university hostel',
        wardenName: 'Prof. A. K. Varma (Chief Warden)',
        isSevereExpulsion: true,
      });

      assert.strictEqual(expelled.stage, 'EXPELLED_FROM_RESIDENCE');
      assert.strictEqual(expelled.disciplinaryIncidents.length, 2);
    });
  });

  describe('TASK-1023: Faculty Residential Campus Quarters Allotment & HRA Recovery Engine', () => {
    it('7. generates unique quarters tracking token matching QTR-[YEAR]-[TYPE]-[HEX6]', () => {
      const tokenIV = generateQuartersToken('TYPE_IV_ASSOCIATE_PROF', 2026);
      assert.match(tokenIV, /^QTR-2026-TYPE-[0-9A-F]{6}$/);

      const tokenV = generateQuartersToken('TYPE_V_PROFESSOR_DEAN', 2026);
      assert.match(tokenV, /^QTR-2026-TYPE-[0-9A-F]{6}$/);
    });

    it('8. calculates 7th CPC HRA surrender and total payroll deductions across City Tiers', () => {
      assert.strictEqual(HRA_TIER_PERCENTAGES.TIER_X_27PCT, 0.27);
      assert.strictEqual(HRA_TIER_PERCENTAGES.TIER_Y_18PCT, 0.18);
      assert.strictEqual(HRA_TIER_PERCENTAGES.TIER_Z_9PCT, 0.09);

      const basicPay = 100000;

      // Tier X: 27% = ₹27,000
      assert.strictEqual(calculateMonthlyHraSurrender(basicPay, 'TIER_X_27PCT'), 27000);

      // Tier Y: 18% = ₹18,000
      assert.strictEqual(calculateMonthlyHraSurrender(basicPay, 'TIER_Y_18PCT'), 18000);

      // Tier Z: 9% = ₹9,000
      assert.strictEqual(calculateMonthlyHraSurrender(basicPay, 'TIER_Z_9PCT'), 9000);

      // Type IV deductions in Tier X:
      // HRA: ₹27,000 + License Fee: ₹1,560 + Water/Elec: ₹450 = ₹29,010
      const totalDeductionTypeIV = calculateTotalMonthlyDeductions(basicPay, 'TIER_X_27PCT', 'TYPE_IV_ASSOCIATE_PROF');
      assert.strictEqual(totalDeductionTypeIV, 29010);
    });

    it('9. executes faculty residential quarters waitlisting, offer, occupation, and vacation with No-Dues', () => {
      const applicant = applyForResidentialQuarter({
        facultyName: 'Dr. Ramesh Chandran',
        empId: 'EMP-PHY-019',
        department: 'Physics',
        academicPayLevel: 'Academic Level 14',
        basicPayInr: 144200,
        dateOfJoiningLevel: '2020-09-01',
        dateOfBirth: '1975-08-10',
        quarterType: 'TYPE_V_PROFESSOR_DEAN',
        cityHraTier: 'TIER_X_27PCT',
      });

      assert.strictEqual(applicant.stage, 'APPLICATION_WAITLISTED');
      assert.strictEqual(applicant.plinthAreaSqm, 120);
      assert.strictEqual(applicant.monthlyLicenseFeeInr, 2450);
      assert.strictEqual(applicant.monthlyHraSurrenderedInr, Math.round(144200 * 0.27)); // 38,934

      // Offer quarter
      const offered = offerResidentialQuarter(applicant, 'V-A-02');
      assert.strictEqual(offered.stage, 'QUARTER_OFFERED');
      assert.strictEqual(offered.quarterNumber, 'V-A-02');

      // Occupy and surrender HRA
      const occupied = occupyQuarterAndSurrenderHra(offered, '2026-03-01');
      assert.strictEqual(occupied.stage, 'POSSESSION_OCCUPIED_HRA_SURRENDERED');
      assert.strictEqual(occupied.possessionDate, '2026-03-01');

      // Vacate and issue No-Dues
      const vacated = vacateQuarterAndIssueNoDues(occupied, '2026-12-31');
      assert.strictEqual(vacated.stage, 'SURRENDERED_NO_DUES_ISSUED');
      assert.strictEqual(vacated.vacationDate, '2026-12-31');
      assert.strictEqual(vacated.cryptographicSeal?.length, 64);
    });

    it('10. exports deterministic statutory CSV ledgers for both Hostel and Quarters systems', () => {
      const hostelCsv = exportHostelAllocationLedgerCSV(INITIAL_HOSTEL_RESIDENTS);
      assert.match(hostelCsv, /Resident ID,Tracking Token,Full Name/);
      assert.match(hostelCsv, /Aarav Sharma/);
      assert.match(hostelCsv, /Meghna Sengupta/);

      const quartersCsv = exportFacultyQuartersLedgerCSV(INITIAL_FACULTY_QUARTERS);
      assert.match(quartersCsv, /Allotment ID,Tracking Token,Faculty Name/);
      assert.match(quartersCsv, /Dr. Siddharth Sen/);
      assert.match(quartersCsv, /Dr. Neha Kulkarni/);
    });
  });
});
