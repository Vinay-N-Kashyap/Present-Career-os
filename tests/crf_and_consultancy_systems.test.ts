import test, { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateTariffCharge,
  isInstrumentBookable,
  generateBookingToken,
  generateTestAuditDigest,
  exportCrfBookingsCSV,
  getAllInstruments,
  getAllBookings,
  registerCrfBooking,
  updateBookingStatus,
  resetCrfStore,
  Instrument,
  SlotBooking,
} from '../src/lib/admin/centralResearchFacility.ts';

import {
  calculateConsultancyFinances,
  validateConsultancyCommitment,
  generateConsultancyCode,
  generateAgreementSeal,
  exportFacultyConsultancyCSV,
  getAllConsultancyProjects,
  registerConsultancyProject,
  updateConsultancyStage,
  resetConsultancyStore,
  FacultyConsultancyProject,
} from '../src/lib/teacher/facultyConsultancy.ts';

describe('TASK-965: Central Research Facility & Faculty Industrial Consultancy Systems Suite', () => {
  beforeEach(() => {
    resetCrfStore();
    resetConsultancyStore();
  });

  describe('TASK-961: Central Research Facility (CRF / CUIF) Slot Booking & Allocation Engine', () => {
    it('calculates differential tariffs across user categories and operator surcharges', () => {
      const rates = {
        internalAcademic: 500,
        externalAcademic: 1800,
        industryCommercial: 4500,
      };

      // In-house student self-operated for 2 hours
      const chargeInternal = calculateTariffCharge(rates, 'INTERNAL_STUDENT', 2, 'SELF_OPERATED');
      assert.equal(chargeInternal, 1000); // 500 * 2

      // External academic technician-assisted for 2 hours
      const chargeExternal = calculateTariffCharge(rates, 'EXTERNAL_ACADEMIC', 2, 'TECHNICIAN_ASSISTED');
      assert.equal(chargeExternal, 3600); // 1800 * 2

      // Industry commercial technician-assisted for 3 hours (includes Rs. 1000/hr surcharge)
      const chargeIndustry = calculateTariffCharge(rates, 'INDUSTRY_RND', 3, 'TECHNICIAN_ASSISTED');
      assert.equal(chargeIndustry, 16500); // (4500 + 1000) * 3 = 16,500
    });

    it('enforces equipment bookability invariants (operational state and calibration validity)', () => {
      const validInstrument: Instrument = {
        id: 'EQ-TEST-1',
        instrumentCode: 'SEM-01',
        name: 'FE-SEM',
        category: 'ELECTRON_MICROSCOPY',
        makeModel: 'JEOL JSM',
        location: 'Bay 101',
        status: 'OPERATIONAL',
        ratesPerHour: { internalAcademic: 500, externalAcademic: 1800, industryCommercial: 4500 },
        custodianFaculty: 'Prof. Raman',
        operatorTechnician: 'Mr. Shinde',
        lastCalibrationDate: '2026-08-01',
        nextCalibrationDueDate: '2026-12-31',
      };

      // Valid on current date
      assert.equal(isInstrumentBookable(validInstrument, '2026-10-17').isBookable, true);

      // Fails when maintenance
      const maintenanceInstrument = { ...validInstrument, status: 'MAINTENANCE' as const };
      assert.equal(isInstrumentBookable(maintenanceInstrument, '2026-10-17').isBookable, false);

      // Fails when calibration overdue
      assert.equal(isInstrumentBookable(validInstrument, '2027-01-15').isBookable, false);
    });

    it('registers slot booking and issues official CRF booking token', () => {
      const initialCount = getAllBookings().length;

      const res = registerCrfBooking({
        id: 'BKG-TEST-1',
        instrumentId: 'EQ-001',
        instrumentName: '',
        requesterName: 'Vikram Singhania',
        requesterEmail: 'vikram.s@pinit.edu',
        requesterAffiliation: 'Department of Electronics, PinIT',
        userCategory: 'INTERNAL_STUDENT',
        sampleDescription: 'Graphene FET channel scanning',
        hazardsDeclared: false,
        bookingDate: '2026-10-25',
        timeSlot: '14:00 - 16:00',
        durationHours: 2,
        operatorMode: 'SELF_OPERATED',
        status: 'APPROVED_SCHEDULED',
        totalChargeInr: 1000,
        createdDate: '2026-10-17',
      });

      assert.equal(res.success, true);
      assert.ok(res.booking);
      assert.ok(res.booking.bookingToken.startsWith('CRF-2026-SEM-'));
      assert.equal(getAllBookings().length, initialCount + 1);
    });

    it('updates analytical run status and issues cryptographic test audit digest', () => {
      const updated = updateBookingStatus(
        'BKG-001',
        'SAMPLE_RUN_COMPLETED',
        'Micrograph magnification 150k achieved with zero charging.'
      );

      assert.ok(updated);
      assert.equal(updated.status, 'SAMPLE_RUN_COMPLETED');
      assert.equal(
        updated.technicianNotes,
        'Micrograph magnification 150k achieved with zero charging.'
      );
      assert.ok(updated.cryptographicDigest && updated.cryptographicDigest.length === 64);
    });

    it('exports standard I-STEM CRF slot bookings CSV with proper formatting', () => {
      const bookings = getAllBookings();
      const csv = exportCrfBookingsCSV(bookings);

      assert.ok(csv.includes('Booking Token,Instrument Name,Requester Name'));
      assert.ok(csv.includes('CRF-2026-SEM-9F31B2'));
      assert.ok(csv.includes('Field Emission Scanning Electron Microscope'));
      assert.ok(csv.includes('INTERNAL_STUDENT'));
    });
  });

  describe('TASK-963: Faculty Sponsored Research & Corporate Consultancy (SRIC / IRD) Ledger Engine', () => {
    it('calculates 18% GST and 70/30 honorarium & institutional overhead split accurately', () => {
      const netValue = 2000000; // 20 Lakhs INR
      const finances = calculateConsultancyFinances(netValue);

      assert.equal(finances.netContractValueInr, 2000000);
      assert.equal(finances.gstAmountInr, 360000); // 18% of 20L
      assert.equal(finances.grossInvoiceAmountInr, 2360000); // 23.60 Lakhs
      assert.equal(finances.facultyHonorariumInr, 1400000); // 70% of 20L
      assert.equal(finances.universityOverheadInr, 600000); // 30% of 20L
      assert.equal(finances.departmentFundInr, 300000); // 15% of 20L
      assert.equal(finances.centralDevFundInr, 300000); // 15% of 20L
    });

    it('enforces AICTE annual faculty commitment ceiling (<= 52 days/year)', () => {
      assert.equal(validateConsultancyCommitment(20), true);
      assert.equal(validateConsultancyCommitment(52), true);

      // Violations
      assert.equal(validateConsultancyCommitment(53), false);
      assert.equal(validateConsultancyCommitment(65), false);
      assert.equal(validateConsultancyCommitment(-5), false);
    });

    it('registers corporate consultancy project and generates cryptographic contract seal', () => {
      const initialCount = getAllConsultancyProjects().length;

      const registered = registerConsultancyProject({
        id: 'PRJ-TEST-1',
        title: 'Autonomous Vision Guidance Algorithm for Warehouse Robotics',
        category: 'PRODUCT_DEVELOPMENT',
        clientCompany: 'Amazon Robotics India',
        clientGstin: '29AAACA1209P1ZZ',
        facultyPiName: 'Prof. Harish Chandra',
        facultyPiEmployeeId: 'FAC-CS-02',
        department: 'Computer Science & Engineering',
        netContractValueInr: 3000000,
        estimatedDaysCommitment: 25,
        stage: 'AGREEMENT_SIGNED',
        startDate: '2026-11-01',
        targetEndDate: '2027-05-31',
        deliverablesSummary: 'SLAM navigation algorithms and hardware ROS integration.',
        createdDate: '2026-10-17',
      });

      assert.equal(getAllConsultancyProjects().length, initialCount + 1);
      assert.ok(registered.projectCode.startsWith('SRIC-2026-CSE-'));
      assert.equal(registered.facultyHonorariumInr, 2100000); // 70% of 30L
      assert.equal(registered.universityOverheadInr, 900000); // 30% of 30L
      assert.ok(
        registered.cryptographicAgreementDigest &&
          registered.cryptographicAgreementDigest.length === 64
      );
    });

    it('advances consultancy project stage through the contract lifecycle', () => {
      const updated = updateConsultancyStage('PRJ-001', 'PAYMENT_RECEIVED');
      assert.ok(updated);
      assert.equal(updated.stage, 'PAYMENT_RECEIVED');

      const completed = updateConsultancyStage('PRJ-001', 'COMPLETED_CLOSED');
      assert.ok(completed);
      assert.equal(completed.stage, 'COMPLETED_CLOSED');
    });

    it('exports standard SRIC Corporate Consultancy Ledger CSV with all mandatory columns', () => {
      const projects = getAllConsultancyProjects();
      const csv = exportFacultyConsultancyCSV(projects);

      assert.ok(csv.includes('Project Code,Project Title,Category,Client Company'));
      assert.ok(csv.includes('Tata Motors EV Technologies Ltd'));
      assert.ok(csv.includes('Net Contract Value (INR)'));
      assert.ok(csv.includes('Faculty Honorarium 70% (INR)'));
    });
  });
});
