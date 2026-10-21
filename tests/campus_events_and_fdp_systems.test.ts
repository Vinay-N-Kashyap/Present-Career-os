/**
 * Master Campus Events & Faculty Professional Development Systems Test Suite (TASK-925)
 * 
 * Verifies:
 * 1. Campus Events, Auditorium & Venue Scheduling Engine (TASK-921).
 * 2. Spatial and temporal clash detection preventing venue double bookings.
 * 3. Seating capacity invariants and CPCB noise pollution regulation checks.
 * 4. Keynote visitor pass generation and multi-stage approval workflow.
 * 5. NAAC Criterion 5.3 (Student Participation & Campus Events) CSV export.
 * 6. Faculty Continuous Professional Development (CPD) & FDP Tracker Engine (TASK-923).
 * 7. Category-specific deterministic CPD credit scoring algorithms.
 * 8. Certificate cryptographic verification hashing (SHA-256).
 * 9. AICTE annual 40-credit compliance quota evaluation and deficit tracking.
 * 10. NAAC Criterion 6.3.3 / 6.3.4 FDP participation CSV export.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  seedCampusEventData,
  resetCampusEventStore,
  getVenues,
  getCampusEvents,
  registerVenue,
  requestCampusEvent,
  updateEventApprovalStatus,
  checkTimeClash,
  computeEventGovernanceSummary,
  exportCampusEventsCSV
} from '../src/lib/admin/campusEvents';

import {
  seedFacultyFdpData,
  resetFdpStore,
  getFdpRecords,
  registerFdpParticipation,
  advanceFdpStatus,
  verifyFdpCertificate,
  computeFacultyCpdSummary,
  calculateCpdCredits,
  exportFacultyFdpCSV
} from '../src/lib/teacher/facultyFdp';

describe('TASK-925: Campus Events & Faculty FDP Systems Suite', () => {
  const TEST_INSTITUTION = 'inst-apex-test';

  beforeEach(() => {
    resetCampusEventStore();
    seedCampusEventData(TEST_INSTITUTION);

    resetFdpStore();
    seedFacultyFdpData(TEST_INSTITUTION);
  });

  describe('TASK-921: Campus Events, Auditorium & Venue Scheduling Engine', () => {
    it('registers new venues with defined capacity and AV infrastructure', () => {
      const venue = registerVenue({
        institutionId: TEST_INSTITUTION,
        name: 'APJ Abdul Kalam Innovation Arena',
        type: 'INNOVATION_ARENA',
        seatingCapacity: 150,
        avEquipment: ['Dual Projectors', 'Wireless Mics', 'Polycom Conference Cam'],
        isAirConditioned: true,
        noisePermitRequired: false,
        locationBlock: 'R&D Block 3rd Floor'
      });

      assert.ok(venue.id.startsWith('VEN-'));
      assert.equal(venue.name, 'APJ Abdul Kalam Innovation Arena');
      assert.equal(venue.seatingCapacity, 150);
      assert.equal(venue.avEquipment.length, 3);
    });

    it('enforces seating capacity invariant when requested attendees exceeds venue size', () => {
      const res = requestCampusEvent({
        institutionId: TEST_INSTITUTION,
        title: 'Mega Tech Summit',
        category: 'TECHNICAL_SYMPOSIUM',
        venueId: 'VEN-RAMAN-HALL', // Capacity 300
        organizingClubOrDept: 'Dept of CSE',
        facultyAdvisorName: 'Dr. Aris Thorne',
        studentLeadName: 'Kunal Verma',
        startDateTime: '2026-12-01T10:00:00Z',
        endDateTime: '2026-12-01T17:00:00Z',
        expectedAttendees: 500 // Exceeds 300
      });

      assert.equal(res.success, false);
      assert.ok(res.error?.includes('VENUE_CAPACITY_EXCEEDED'));
    });

    it('detects temporal clashes and prevents double booking in the same venue', () => {
      // Existing event in seed: EVT-7B9011FA in VEN-MAIN-AUD on 2026-11-10T09:00:00Z to 2026-11-11T18:00:00Z
      const clash = checkTimeClash(
        'VEN-MAIN-AUD',
        '2026-11-10T14:00:00Z',
        '2026-11-10T16:00:00Z'
      );
      assert.equal(clash, true);

      // Attempt booking overlapping event
      const res = requestCampusEvent({
        institutionId: TEST_INSTITUTION,
        title: 'Clashing Seminar',
        category: 'ACADEMIC_CONFERENCE',
        venueId: 'VEN-MAIN-AUD',
        organizingClubOrDept: 'Dept of ECE',
        facultyAdvisorName: 'Dr. Ramesh Kumar',
        studentLeadName: 'Neha Sen',
        startDateTime: '2026-11-10T12:00:00Z',
        endDateTime: '2026-11-10T15:00:00Z',
        expectedAttendees: 400
      });

      assert.equal(res.success, false);
      assert.ok(res.error?.includes('VENUE_CLASH_DETECTED'));
    });

    it('allows valid booking, flags late-night outdoor noise permits, and issues guest passes', () => {
      // Night concert in open amphitheatre past 22:00
      const res = requestCampusEvent({
        institutionId: TEST_INSTITUTION,
        title: 'Apex Annual Classical Music Evening',
        category: 'CULTURAL_FEST',
        venueId: 'VEN-AMPHI-OPEN',
        organizingClubOrDept: 'Cultural Society',
        facultyAdvisorName: 'Dr. S. Mukherjee',
        studentLeadName: 'Aditi Rao',
        startDateTime: '2026-11-25T18:00:00Z',
        endDateTime: '2026-11-25T23:30:00Z', // 23:30 past 22:00
        expectedAttendees: 1500,
        keynoteSpeakers: ['Ustad Zakir Hussain', 'Pt. Hariprasad Chaurasia']
      });

      assert.equal(res.success, true);
      assert.ok(res.event?.id.startsWith('EVT-'));
      assert.equal(res.event?.noiseClearanceObtained, false); // Flags noise clearance required
      assert.equal(res.event?.visitorPassCodes?.length, 2);
      assert.ok(res.event?.visitorPassCodes?.[0].startsWith('PASS-GATE-'));
    });

    it('manages multi-stage event governance lifecycle and exports NAAC 5.3 CSV', () => {
      const event = getCampusEvents(TEST_INSTITUTION, { status: 'FACULTY_ADVISOR_APPROVED' })[0];
      assert.ok(event);

      // Estate Office sanctions venue
      const sanctioned = updateEventApprovalStatus(event.id, 'ESTATE_OFFICE_SANCTIONED', {
        sanctionOrderNumber: 'SO-EVT-SPECIAL-001'
      });
      assert.equal(sanctioned.success, true);
      assert.equal(sanctioned.event?.status, 'ESTATE_OFFICE_SANCTIONED');
      assert.equal(sanctioned.event?.sanctionOrderNumber, 'SO-EVT-SPECIAL-001');

      // Summary
      const summary = computeEventGovernanceSummary(TEST_INSTITUTION);
      assert.ok(summary.totalVenues >= 3);
      assert.ok(summary.totalEventsSanctioned >= 2);

      // CSV Export
      const csv = exportCampusEventsCSV(TEST_INSTITUTION);
      assert.ok(csv.includes('=== NAAC CRITERION 5.3: STUDENT PARTICIPATION & CAMPUS EVENTS REGISTRY ==='));
      assert.ok(csv.includes('Apex Annual National Hackathon'));
      assert.ok(csv.includes('Sir M. Visvesvaraya Grand Auditorium'));
    });
  });

  describe('TASK-923: Faculty Continuous Professional Development (CPD) & FDP Tracker Engine', () => {
    it('calculates CPD credits deterministically across diverse FDP categories', () => {
      // AICTE ATAL (6 days) -> 10 credits
      assert.equal(calculateCpdCredits('AICTE_ATAL_ACADEMY', 6, 36), 10);

      // UGC HRDC (10 days) -> 15 credits
      assert.equal(calculateCpdCredits('UGC_HRDC_ORIENTATION', 10, 60), 15);

      // NPTEL SWAYAM (12-week course) -> 15 credits
      assert.equal(calculateCpdCredits('NPTEL_SWAYAM_MOOC', 84, 45), 15);

      // Industry Immersion (14 days) -> 20 credits
      assert.equal(calculateCpdCredits('INDUSTRY_IMMERSION', 14, 80), 20);

      // Pedagogical Workshop (3 days) -> 5 credits
      assert.equal(calculateCpdCredits('PEDAGOGICAL_WORKSHOP', 3, 18), 5);
    });

    it('registers new FDP participation and rejects non-positive durations', () => {
      const invalid = registerFdpParticipation({
        institutionId: TEST_INSTITUTION,
        facultyId: 'FAC-CS-002',
        facultyName: 'Dr. Evelyn Zhang',
        department: 'Computer Science',
        title: 'Zero Days Workshop',
        category: 'PEDAGOGICAL_WORKSHOP',
        organizingBody: 'Apex Centre for Teaching and Learning',
        mode: 'IN_PERSON',
        startDate: '2026-11-01',
        endDate: '2026-11-01',
        durationDays: 0, // Invalid
        totalContactHours: 0
      });
      assert.equal(invalid.success, false);
      assert.ok(invalid.error?.includes('INVALID_DURATION'));

      const valid = registerFdpParticipation({
        institutionId: TEST_INSTITUTION,
        facultyId: 'FAC-CS-002',
        facultyName: 'Dr. Evelyn Zhang',
        department: 'Computer Science',
        title: 'Outcome-Based Education & Bloom Taxonomy Assessment Workshop',
        category: 'PEDAGOGICAL_WORKSHOP',
        organizingBody: 'Apex Centre for Teaching and Learning',
        mode: 'IN_PERSON',
        startDate: '2026-11-01',
        endDate: '2026-11-03',
        durationDays: 3,
        totalContactHours: 18
      });
      assert.equal(valid.success, true);
      assert.ok(valid.record?.id.startsWith('FDP-'));
      assert.equal(valid.record?.creditsEarned, 5);
      assert.equal(valid.record?.status, 'PLANNED');
    });

    it('verifies FDP certificates with SHA-256 cryptographic digest', () => {
      const newRec = registerFdpParticipation({
        institutionId: TEST_INSTITUTION,
        facultyId: 'FAC-CS-003',
        facultyName: 'Prof. Alistair Finch',
        department: 'Computer Science',
        title: 'AICTE ATAL FDP on Cloud Security & DevSecOps',
        category: 'AICTE_ATAL_ACADEMY',
        organizingBody: 'IIT Roorkee',
        mode: 'ONLINE',
        startDate: '2026-08-10',
        endDate: '2026-08-15',
        durationDays: 6,
        totalContactHours: 36,
        status: 'ATTENDED',
        certificateUrl: 'https://atal.aicte-india.org/verify/ATAL-ROORKEE-902'
      });
      assert.equal(newRec.success, true);

      const verified = verifyFdpCertificate(newRec.record!.id, 'Prof. Dean Academics');
      assert.equal(verified.success, true);
      assert.equal(verified.record?.status, 'CERTIFICATE_VERIFIED');
      assert.equal(verified.record?.verifiedBy, 'Prof. Dean Academics');
      assert.ok(verified.record?.certificateVerificationHash?.startsWith('SHA256:'));
      assert.ok(verified.record?.verifiedAt);
    });

    it('computes annual CPD summary and evaluates AICTE 40-credit compliance quota', () => {
      // Dr. Aris Thorne in seed has 3 verified FDPs:
      // 1. AICTE ATAL: 10 credits
      // 2. NPTEL SWAYAM: 15 credits
      // 3. Industry Immersion: 20 credits
      // Total: 45 credits (>= 40 credits -> Compliant)
      const cpd = computeFacultyCpdSummary('FAC-CS-001', TEST_INSTITUTION);

      assert.equal(cpd.facultyName, 'Dr. Aris Thorne');
      assert.equal(cpd.totalFdpCount, 3);
      assert.equal(cpd.totalCreditsEarned, 45);
      assert.equal(cpd.isAicteCompliant, true);
      assert.equal(cpd.creditsDeficit, 0);
      assert.equal(cpd.categoryBreakdown.AICTE_ATAL_ACADEMY, 1);
      assert.equal(cpd.categoryBreakdown.NPTEL_SWAYAM_MOOC, 1);
      assert.equal(cpd.categoryBreakdown.INDUSTRY_IMMERSION, 1);
    });

    it('detects credit deficit when faculty has not achieved 40 credits', () => {
      // Dr. Evelyn Zhang only has 1 workshop (5 credits) in planned, so 0 completed credits
      const cpd = computeFacultyCpdSummary('FAC-CS-002', TEST_INSTITUTION);

      assert.equal(cpd.totalCreditsEarned, 0);
      assert.equal(cpd.isAicteCompliant, false);
      assert.equal(cpd.creditsDeficit, 40);
    });

    it('exports official NAAC Criterion 6.3.3 FDP registry CSV', () => {
      const csv = exportFacultyFdpCSV(TEST_INSTITUTION);

      assert.ok(csv.includes('=== NAAC CRITERION 6.3.3: FACULTY DEVELOPMENT PROGRAMS (FDP) REGISTRY ==='));
      assert.ok(csv.includes('FAC-CS-001'));
      assert.ok(csv.includes('AICTE ATAL FDP on Quantum Algorithms'));
      assert.ok(csv.includes('Enterprise Cloud Sabbatical'));
      assert.ok(csv.includes('SHA256:'));
    });
  });
});
