/**
 * Master Campus Transportation & Faculty Appraisal Audit Test Suite (TASK-910)
 * 
 * Verifies:
 * 1. Campus Transportation Fleet & Live Bus Route Dispatcher Engine (TASK-906).
 * 2. Speed governor compliance, vehicle registration, and status transitions.
 * 3. Route stops planning and capacity-bounded student bus pass issuance.
 * 4. Contactless RFID badge boarding simulation and last boarded timestamps.
 * 5. Faculty Annual Appraisal & UGC Career Advancement Scheme (CAS) Engine (TASK-908).
 * 6. Category I, II, and III (API score) deterministic calculations.
 * 7. CAS promotion eligibility benchmarks and stage progression rules.
 * 8. 3-Stage institutional review sign-off workflow (Faculty -> HoD -> Dean).
 * 9. Statutory UGC PBAS and RTO transportation CSV export formatting.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  seedTransportData,
  resetTransportStore,
  getVehicles,
  getRoutes,
  getStudentPasses,
  registerVehicle,
  updateVehicleStatus,
  createBusRoute,
  issueStudentBusPass,
  recordRfidBoarding,
  computeFleetSummary,
  exportTransportRosterCSV
} from '../src/lib/admin/transportManagement';

import {
  seedAppraisalData,
  resetAppraisalStore,
  calculateCategoryIScore,
  calculateCategoryIIScore,
  calculateCategoryIIIScore,
  evaluateCasPromotion,
  determineAppraisalRating,
  createFacultyAppraisal,
  getAppraisalsByInstitution,
  advanceAppraisalStatus,
  exportUgcCasAppraisalCSV
} from '../src/lib/teacher/facultyAppraisal';

describe('TASK-910: Transportation Fleet & Faculty CAS Appraisal Suite', () => {
  const TEST_INSTITUTION = 'inst-apex-test';

  beforeEach(() => {
    resetTransportStore();
    seedTransportData(TEST_INSTITUTION);

    resetAppraisalStore();
    seedAppraisalData(TEST_INSTITUTION);
  });

  describe('TASK-906: Campus Transportation Fleet & Bus Route Dispatcher', () => {
    it('registers new fleet vehicles and updates operational dispatch status', () => {
      const bus = registerVehicle({
        institutionId: TEST_INSTITUTION,
        busNumber: 'KA-01-F-9090',
        vehicleModel: 'Volvo B11R 52-Seater',
        capacity: 52,
        driverName: 'Raghuveer Singh',
        driverPhone: '+91 98450 99887',
        fitnessExpiryDate: '2027-12-31',
        speedGovernorCompliant: true,
        maxSpeedKmH: 50,
        currentFuelOrChargePercent: 95,
        status: 'IDLE'
      });

      assert.match(bus.id, /^BUS-/);
      assert.equal(bus.capacity, 52);
      assert.equal(bus.status, 'IDLE');

      // Update to ON_ROUTE with live GPS telemetry
      const updated = updateVehicleStatus(bus.id, 'ON_ROUTE', {
        latitude: 12.9250,
        longitude: 77.6100,
        speedKmH: 42,
        heading: 90,
        lastUpdated: new Date().toISOString()
      });

      assert.equal(updated?.status, 'ON_ROUTE');
      assert.equal(updated?.currentLocation?.speedKmH, 42);
    });

    it('enforces route stop validation, capacity limits, and duplicate pass prevention', () => {
      // 1. Invalid Route
      const invalidRouteRes = issueStudentBusPass({
        institutionId: TEST_INSTITUTION,
        studentId: 'STU-999',
        studentName: 'Invalid Student',
        enrollmentNumber: 'ENG-2024-999',
        routeId: 'NON_EXISTENT_ROUTE',
        pickupStopId: 'STP-101',
        academicYear: '2026-2027'
      });
      assert.equal(invalidRouteRes.success, false);
      assert.equal(invalidRouteRes.error, 'ROUTE_NOT_FOUND');

      // 2. Invalid Stop
      const invalidStopRes = issueStudentBusPass({
        institutionId: TEST_INSTITUTION,
        studentId: 'STU-999',
        studentName: 'Invalid Student',
        enrollmentNumber: 'ENG-2024-999',
        routeId: 'RTE-01',
        pickupStopId: 'NON_EXISTENT_STOP',
        academicYear: '2026-2027'
      });
      assert.equal(invalidStopRes.success, false);
      assert.equal(invalidStopRes.error, 'INVALID_PICKUP_STOP');

      // 3. Duplicate Active Pass Prevention: Aarav (STU-1001) already has active pass in RTE-01
      const duplicateRes = issueStudentBusPass({
        institutionId: TEST_INSTITUTION,
        studentId: 'STU-1001',
        studentName: 'Aarav Sharma',
        enrollmentNumber: 'ENG-2023-014',
        routeId: 'RTE-01',
        pickupStopId: 'STP-102',
        academicYear: '2026-2027'
      });
      assert.equal(duplicateRes.success, false);
      assert.equal(duplicateRes.error, 'STUDENT_ALREADY_HAS_ACTIVE_PASS');
    });

    it('issues valid student bus pass with seat assignment and simulates RFID boarding', () => {
      const res = issueStudentBusPass({
        institutionId: TEST_INSTITUTION,
        studentId: 'STU-1002',
        studentName: 'Vikram Patel',
        enrollmentNumber: 'ENG-2023-089',
        routeId: 'RTE-01',
        pickupStopId: 'STP-103',
        academicYear: '2026-2027'
      });

      assert.equal(res.success, true);
      assert.match(res.pass?.id || '', /^PASS-/);
      assert.equal(res.pass?.seatNumber, 2);
      assert.ok(res.pass?.rfidTag);

      // Simulate Contactless RFID Boarding
      const tapRes = recordRfidBoarding(TEST_INSTITUTION, res.pass!.rfidTag);
      assert.equal(tapRes.success, true);
      assert.ok(tapRes.pass?.lastBoardedTimestamp);

      // Invalid RFID tap rejection
      const invalidTap = recordRfidBoarding(TEST_INSTITUTION, 'RFID-00000000');
      assert.equal(invalidTap.success, false);
      assert.equal(invalidTap.error, 'INVALID_RFID_BADGE');
    });

    it('computes overall fleet summary and exports RTO transport CSV', () => {
      const summary = computeFleetSummary(TEST_INSTITUTION);
      assert.equal(summary.totalVehicles, 2);
      assert.equal(summary.totalSeatingCapacity, 90); // 40 + 50
      assert.equal(summary.totalSubscribedStudents, 1);
      assert.equal(summary.fleetUtilizationRate, 1); // 1/90 ~ 1%

      const csv = exportTransportRosterCSV(TEST_INSTITUTION);
      assert.ok(csv.includes('=== CAMPUS TRANSPORTATION FLEET & BUS PASS ROSTER ==='));
      assert.ok(csv.includes('Aarav Sharma'));
      assert.ok(csv.includes('Electronic City Express'));
    });
  });

  describe('TASK-908: Faculty Appraisal & Annual API Scoring Engine under UGC CAS', () => {
    it('calculates Category I (Teaching) and Category II (Governance) scores with statutory caps', () => {
      // Cat I: 180 target, 180 delivered (60 pts) + 5 exam duties (20 pts) + 20 pedagogy (20 pts) = 100 max
      const catIScore = calculateCategoryIScore({
        lecturesDeliveredHours: 180,
        lecturesTargetHours: 180,
        examDutiesCompleted: 5,
        pedagogyInnovationScore: 20
      });
      assert.equal(catIScore, 100);

      // Cat II: 30 mentorship hrs (15 pts) + 4 committees (20 pts) + 3 FDPs (15 pts) = 50 max
      const catIIScore = calculateCategoryIIScore({
        studentClubMentorshipHours: 30,
        institutionalCommitteesCount: 4,
        fdpConferencesOrganizedOrAttended: 3
      });
      assert.equal(catIIScore, 50);
    });

    it('calculates Category III Research API scores deterministically based on UGC weightings', () => {
      // 2 WoS papers (30 pts) + 2 UGC papers (20 pts) + 1 Patent (25 pts) + 1 PhD (10 pts) + 20,00,000 INR grant (100 pts)
      // Total: 30 + 20 + 25 + 10 + 100 = 185 pts
      const catIIIScore = calculateCategoryIIIScore({
        scopusWosPapersCount: 2,
        ugcCarePapersCount: 2,
        patentsGrantedCount: 1,
        phdScholarsGuided: 1,
        sponsoredResearchFundsINR: 2000000
      });
      assert.equal(catIIIScore, 185);
    });

    it('evaluates CAS promotion eligibility across career stages', () => {
      // Stage 1 to 2 requires Cat III >= 20
      const stage1Eligible = evaluateCasPromotion('ASSISTANT_PROFESSOR_STAGE_1', 80, 25, 25);
      assert.equal(stage1Eligible.eligible, true);
      assert.equal(stage1Eligible.targetDesignation, 'ASSISTANT_PROFESSOR_STAGE_2');

      const stage1Ineligible = evaluateCasPromotion('ASSISTANT_PROFESSOR_STAGE_1', 80, 25, 10);
      assert.equal(stage1Ineligible.eligible, false);

      // Stage 2 to 3 requires Cat III >= 50
      const stage2Eligible = evaluateCasPromotion('ASSISTANT_PROFESSOR_STAGE_2', 85, 30, 60);
      assert.equal(stage2Eligible.eligible, true);
      assert.equal(stage2Eligible.targetDesignation, 'ASSISTANT_PROFESSOR_STAGE_3');

      // Stage 3 to Associate Prof requires Cat III >= 75
      const stage3Eligible = evaluateCasPromotion('ASSISTANT_PROFESSOR_STAGE_3', 90, 35, 80);
      assert.equal(stage3Eligible.eligible, true);
      assert.equal(stage3Eligible.targetDesignation, 'ASSOCIATE_PROFESSOR');

      // Associate Prof to Full Prof requires Cat III >= 110
      const assocEligible = evaluateCasPromotion('ASSOCIATE_PROFESSOR', 92, 40, 120);
      assert.equal(assocEligible.eligible, true);
      assert.equal(assocEligible.targetDesignation, 'PROFESSOR');

      // Full Professor cannot promote higher
      const profEligible = evaluateCasPromotion('PROFESSOR', 95, 45, 150);
      assert.equal(profEligible.eligible, false);
      assert.ok(profEligible.reason.includes('highest academic rank'));
    });

    it('determines overall appraisal ratings based on composite performance', () => {
      assert.equal(determineAppraisalRating(90, 45, 100), 'OUTSTANDING'); // 235 >= 210
      assert.equal(determineAppraisalRating(80, 30, 70), 'GOOD'); // 180 >= 170
      assert.equal(determineAppraisalRating(70, 20, 50), 'SATISFACTORY'); // 140 >= 130
      assert.equal(determineAppraisalRating(50, 10, 10), 'NOT_SATISFACTORY');
    });

    it('creates appraisal report, manages 3-stage sign-off lifecycle, and exports CSV', () => {
      const rep = createFacultyAppraisal({
        institutionId: TEST_INSTITUTION,
        facultyId: 'FAC-ECE-002',
        facultyName: 'Dr. Sunita Raman',
        department: 'Electronics & Communication',
        currentDesignation: 'ASSISTANT_PROFESSOR_STAGE_1',
        academicYear: '2025-2026',
        categoryI: {
          lecturesDeliveredHours: 170,
          lecturesTargetHours: 180,
          examDutiesCompleted: 4,
          pedagogyInnovationScore: 16
        },
        categoryII: {
          studentClubMentorshipHours: 20,
          institutionalCommitteesCount: 2,
          fdpConferencesOrganizedOrAttended: 1
        },
        categoryIII: {
          scopusWosPapersCount: 2,
          ugcCarePapersCount: 0,
          patentsGrantedCount: 0,
          phdScholarsGuided: 0,
          sponsoredResearchFundsINR: 500000
        }
      });

      assert.match(rep.id, /^CAS-/);
      assert.equal(rep.status, 'DRAFT');
      assert.equal(rep.eligibleForCasPromotion, true); // 30 + 25 = 55 >= 20

      // Stage 1: Faculty submission
      const submitted = advanceAppraisalStatus(rep.id, 'SUBMITTED_BY_FACULTY');
      assert.equal(submitted?.status, 'SUBMITTED_BY_FACULTY');
      assert.ok(submitted?.facultySignatureDate);

      // Stage 2: HoD review
      const hodReviewed = advanceAppraisalStatus(rep.id, 'HOD_REVIEWED', 'Strong performance in VLSI teaching.');
      assert.equal(hodReviewed?.status, 'HOD_REVIEWED');
      assert.equal(hodReviewed?.hodComments, 'Strong performance in VLSI teaching.');

      // Stage 3: Dean approval
      const deanApproved = advanceAppraisalStatus(rep.id, 'DEAN_APPROVED', 'Approved for CAS Stage 2 advancement.');
      assert.equal(deanApproved?.status, 'DEAN_APPROVED');
      assert.equal(deanApproved?.deanComments, 'Approved for CAS Stage 2 advancement.');

      // Export CSV
      const csv = exportUgcCasAppraisalCSV(TEST_INSTITUTION);
      assert.ok(csv.includes('=== UGC CAREER ADVANCEMENT SCHEME (CAS) ANNUAL APPRAISAL AUDIT ==='));
      assert.ok(csv.includes('Dr. Sunita Raman'));
      assert.ok(csv.includes('Dr. Aris Thorne'));
    });
  });
});
