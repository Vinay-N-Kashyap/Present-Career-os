import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateGuestTariff,
  checkRoomAvailability,
  generateGuestHouseToken,
  registerGuestBooking,
  updateGuestBookingStatus,
  exportGuestHouseBookingsCSV,
  GuestBookingRecord,
} from '../src/lib/admin/centralGuestHouse';

import {
  validateCpdaSolvency,
  calculateTotalTravelClaim,
  generateDeputationToken,
  submitTravelGrantProposal,
  advanceDeputationStage,
  settleTravelReimbursement,
  exportTravelGrantsCSV,
  TravelExpenseBreakdown,
} from '../src/lib/teacher/facultyTravelGrants';

describe('TASK-985: Institutional Guest House Protocol & Faculty Travel Grant Systems Suite', () => {
  describe('TASK-981: Central University Guest House Transit Accommodation & VIP Protocol Engine', () => {
    it('calculates differential room tariffs across guest categories (Cat A Free, Cat B Subsidized, Cat C Commercial)', () => {
      // Category A: 100% University Sponsored (0 INR)
      const tA = calculateGuestTariff('VIP_PRESIDENTIAL_SUITE', 'CATEGORY_A_INSTITUTIONAL', 3);
      assert.strictEqual(tA.tariffPerDay, 0);
      assert.strictEqual(tA.totalBillingAmount, 0);

      // Category B: Subsidized Academic (1000/day for Deluxe)
      const tB = calculateGuestTariff('EXECUTIVE_DELUXE', 'CATEGORY_B_ACADEMIC_VISITOR', 4);
      assert.strictEqual(tB.tariffPerDay, 1_000);
      assert.strictEqual(tB.totalBillingAmount, 4_000);

      // Category C: Commercial (2500/day for Deluxe)
      const tC = calculateGuestTariff('EXECUTIVE_DELUXE', 'CATEGORY_C_PERSONAL_GENERAL', 2);
      assert.strictEqual(tC.tariffPerDay, 2_500);
      assert.strictEqual(tC.totalBillingAmount, 5_000);

      // Throws on 0 days
      assert.throws(() => calculateGuestTariff('STANDARD_DOUBLE', 'CATEGORY_C_PERSONAL_GENERAL', 0), /Stay duration must be at least 1 day/);
    });

    it('enforces temporal clash detection and prevents room double-booking', () => {
      const existing: GuestBookingRecord[] = [
        {
          bookingId: 'B1',
          bookingRefNumber: 'GH-2026-INST-001',
          guestName: 'Prof. Agrawal',
          guestDesignation: 'BoG Member',
          guestCategory: 'CATEGORY_A_INSTITUTIONAL',
          roomType: 'VIP_PRESIDENTIAL_SUITE',
          roomNumber: 'VIP-Suite-01',
          checkInDate: '2026-03-10',
          checkOutDate: '2026-03-15',
          durationDays: 5,
          tariffPerDay: 0,
          totalBillingAmount: 0,
          sponsoringDepartment: 'Directorate',
          vipProtocolRequired: true,
          stage: 'ESTATE_OFFICER_APPROVED',
        },
      ];

      // Overlapping booking on same room: March 12 to 14
      const isClashing = checkRoomAvailability(existing, 'VIP-Suite-01', '2026-03-12', '2026-03-14');
      assert.strictEqual(isClashing, false);

      // Non-overlapping on same room: March 16 to 18
      const isFree = checkRoomAvailability(existing, 'VIP-Suite-01', '2026-03-16', '2026-03-18');
      assert.strictEqual(isFree, true);

      // Same dates but different room
      const diffRoom = checkRoomAvailability(existing, 'Deluxe-201', '2026-03-12', '2026-03-14');
      assert.strictEqual(diffRoom, true);
    });

    it('registers guest reservation with proper token and prevents booking clashing rooms', () => {
      const existing: GuestBookingRecord[] = [];

      const booking = registerGuestBooking(existing, {
        guestName: 'Dr. C. P. Ravikumar',
        guestDesignation: 'External Viva Examiner',
        guestCategory: 'CATEGORY_A_INSTITUTIONAL',
        roomType: 'EXECUTIVE_DELUXE',
        roomNumber: 'Deluxe-201',
        checkInDate: '2026-03-20',
        checkOutDate: '2026-03-22',
        sponsoringDepartment: 'Electrical Engineering',
        sponsoringFacultyPi: 'Prof. Swaminathan',
      });

      assert.match(booking.bookingRefNumber, /^GH-\d{4}-INST-[0-9A-F]{6}$/);
      assert.strictEqual(booking.durationDays, 2);
      assert.strictEqual(booking.totalBillingAmount, 0); // Category A
      assert.strictEqual(booking.stage, 'REQUESTED');

      // Attempt to register overlapping booking on Deluxe-201
      assert.throws(() => {
        registerGuestBooking([booking], {
          guestName: 'Another Guest',
          guestDesignation: 'Visitor',
          guestCategory: 'CATEGORY_C_PERSONAL_GENERAL',
          roomType: 'EXECUTIVE_DELUXE',
          roomNumber: 'Deluxe-201',
          checkInDate: '2026-03-21',
          checkOutDate: '2026-03-23',
          sponsoringDepartment: 'Admin',
        });
      }, /Room Deluxe-201 is already occupied for the requested dates/);
    });

    it('advances reservation stages and issues SHA-256 cryptographic seal upon approval and billing', () => {
      const booking = registerGuestBooking([], {
        guestName: 'Elena Rostova',
        guestDesignation: 'Visiting Scholar',
        guestCategory: 'CATEGORY_B_ACADEMIC_VISITOR',
        roomType: 'TRANSIT_SCHOLAR_STUDIO',
        roomNumber: 'Transit-304',
        checkInDate: '2026-04-01',
        checkOutDate: '2026-04-06',
        sponsoringDepartment: 'Chemistry',
      });

      const approved = updateGuestBookingStatus(booking, 'ESTATE_OFFICER_APPROVED', 'Approved by Estate Officer');
      assert.strictEqual(approved.stage, 'ESTATE_OFFICER_APPROVED');
      assert.match(approved.cryptographicSeal || '', /^[0-9a-f]{64}$/);

      const checkedIn = updateGuestBookingStatus(approved, 'CHECKED_IN');
      assert.strictEqual(checkedIn.stage, 'CHECKED_IN');

      const billed = updateGuestBookingStatus(checkedIn, 'CHECKED_OUT_BILLED', 'Paid via POS machine receipt #8819');
      assert.strictEqual(billed.stage, 'CHECKED_OUT_BILLED');
      assert.match(billed.cryptographicSeal || '', /^[0-9a-f]{64}$/);
    });

    it('exports Estate Office guest house room inventory CSV with proper headers', () => {
      const booking = registerGuestBooking([], {
        guestName: 'Mr. & Mrs. Mittal',
        guestDesignation: 'Student Parents',
        guestCategory: 'CATEGORY_C_PERSONAL_GENERAL',
        roomType: 'STANDARD_DOUBLE',
        roomNumber: 'Standard-105',
        checkInDate: '2026-04-10',
        checkOutDate: '2026-04-12',
        sponsoringDepartment: 'Student Affairs',
      });

      const csv = exportGuestHouseBookingsCSV([booking]);
      assert.ok(csv.includes('Booking Reference,Guest Name,Designation,Category,Room Type'));
      assert.ok(csv.includes('Mr. & Mrs. Mittal'));
      assert.ok(csv.includes('CATEGORY_C_PERSONAL_GENERAL'));
      assert.ok(csv.includes('Standard-105'));
    });
  });

  describe('TASK-983: Faculty International Conference Deputation & CPDA Travel Grant Ledger Engine', () => {
    it('validates CPDA solvency and computes accurate travel expense sum', () => {
      assert.strictEqual(validateCpdaSolvency(250_000, 300_000), true);
      assert.strictEqual(validateCpdaSolvency(350_000, 300_000), false);
      assert.strictEqual(validateCpdaSolvency(0, 300_000), false);

      const exp: TravelExpenseBreakdown = {
        airfare: 90_000,
        registrationFee: 45_000,
        dailyAllowance: 36_000,
        visaAndInsurance: 12_000,
      };
      assert.strictEqual(calculateTotalTravelClaim(exp), 183_000);
    });

    it('submits international travel proposal and enforces CPDA 3-year block ceiling', () => {
      const exp: TravelExpenseBreakdown = {
        airfare: 100_000,
        registrationFee: 50_000,
        dailyAllowance: 40_000,
        visaAndInsurance: 10_000,
      };

      const grant = submitTravelGrantProposal({
        facultyName: 'Prof. Arvind Swaminathan',
        department: 'Computer Science',
        fundingScheme: 'INST_CPDA_SCHEME',
        conferenceTitle: 'IEEE S&P 2026',
        conferenceTier: 'TIER_1_CORE_A_STAR',
        destinationCityCountry: 'San Francisco, USA',
        paperTitle: 'Sub-Microsecond Zero-Allocation Consensus',
        presentationType: 'ORAL_TECHNICAL',
        travelStartDate: '2026-05-18',
        travelEndDate: '2026-05-24',
        availableCpdaBalance: 250_000,
        requestedExpenses: exp,
      });

      assert.match(grant.deputationRefNumber, /^CPDA-\d{4}-COMP-[0-9A-F]{6}$/);
      assert.strictEqual(grant.totalClaimAmount, 200_000);
      assert.strictEqual(grant.stage, 'PROPOSAL_SUBMITTED');

      // Attempt to submit proposal exceeding balance
      assert.throws(() => {
        submitTravelGrantProposal({
          facultyName: 'Prof. Arvind',
          department: 'Computer Science',
          fundingScheme: 'INST_CPDA_SCHEME',
          conferenceTitle: 'Excess Conference',
          conferenceTier: 'TIER_1_CORE_A_STAR',
          destinationCityCountry: 'Paris, France',
          paperTitle: 'Excess Outlay Paper',
          presentationType: 'ORAL_TECHNICAL',
          travelStartDate: '2026-06-01',
          travelEndDate: '2026-06-05',
          availableCpdaBalance: 150_000, // Less than requested 200,000
          requestedExpenses: exp,
        });
      }, /Requested travel outlay exceeds available 3-year CPDA block balance/);
    });

    it('advances deputation stage and records MEA clearance and Director sanction with SHA-256 seal', () => {
      const exp: TravelExpenseBreakdown = {
        airfare: 80_000,
        registrationFee: 40_000,
        dailyAllowance: 30_000,
        visaAndInsurance: 10_000,
      };

      const grant = submitTravelGrantProposal({
        facultyName: 'Dr. Meenakshi Sundaram',
        department: 'Chemistry',
        fundingScheme: 'DST_SERB_ITS_GRANT',
        conferenceTitle: 'IUPAC Congress 2026',
        conferenceTier: 'TIER_2_CORE_A',
        destinationCityCountry: 'Munich, Germany',
        paperTitle: 'Organocatalysis',
        presentationType: 'ORAL_TECHNICAL',
        travelStartDate: '2026-07-10',
        travelEndDate: '2026-07-16',
        availableCpdaBalance: 300_000,
        requestedExpenses: exp,
      });

      const meaApproved = advanceDeputationStage(grant, 'MEA_CLEARANCE_OBTAINED', {
        meaClearanceNumber: 'MEA/POL/2026/EU-4412',
      });
      assert.strictEqual(meaApproved.stage, 'MEA_CLEARANCE_OBTAINED');
      assert.strictEqual(meaApproved.meaClearanceNumber, 'MEA/POL/2026/EU-4412');

      const sanctioned = advanceDeputationStage(meaApproved, 'DIRECTOR_SANCTIONED', {
        sanctionedAmount: 160_000,
        remarks: 'Approved by Director',
      });
      assert.strictEqual(sanctioned.stage, 'DIRECTOR_SANCTIONED');
      assert.strictEqual(sanctioned.sanctionedAmount, 160_000);
      assert.match(sanctioned.cryptographicSeal || '', /^[0-9a-f]{64}$/);
    });

    it('settles post-conference reimbursement with actual receipts and generates settlement seal', () => {
      const exp: TravelExpenseBreakdown = {
        airfare: 50_000,
        registrationFee: 30_000,
        dailyAllowance: 25_000,
        visaAndInsurance: 8_000,
      };

      const grant = submitTravelGrantProposal({
        facultyName: 'Dr. Vivek Bhattacharya',
        department: 'Biotechnology',
        fundingScheme: 'SPONSORED_PROJECT_TRAVEL',
        conferenceTitle: 'CRISPR 2026',
        conferenceTier: 'TIER_1_CORE_A_STAR',
        destinationCityCountry: 'Singapore',
        paperTitle: 'Epigenetic Editing',
        presentationType: 'POSTER_PRESENTATION',
        travelStartDate: '2026-06-02',
        travelEndDate: '2026-06-06',
        availableCpdaBalance: 200_000,
        requestedExpenses: exp,
      });

      const settled = settleTravelReimbursement(grant, 110_000, '2026-06-15');
      assert.strictEqual(settled.stage, 'SETTLEMENT_REIMBURSED');
      assert.strictEqual(settled.sanctionedAmount, 110_000);
      assert.strictEqual(settled.reimbursementDate, '2026-06-15');
      assert.match(settled.cryptographicSeal || '', /^[0-9a-f]{64}$/);
    });

    it('exports CPDA travel grant ledger CSV with all statutory columns and escaping', () => {
      const exp: TravelExpenseBreakdown = {
        airfare: 75_000,
        registrationFee: 40_000,
        dailyAllowance: 32_000,
        visaAndInsurance: 9_000,
      };

      const grant = submitTravelGrantProposal({
        facultyName: 'Dr. Rajiv Malhotra',
        department: 'Computer Science',
        fundingScheme: 'INST_CPDA_SCHEME',
        conferenceTitle: 'ACM SIGCOMM 2026, "Tokyo Special"',
        conferenceTier: 'TIER_1_CORE_A_STAR',
        destinationCityCountry: 'Tokyo, Japan',
        paperTitle: 'Programmable Data Planes',
        presentationType: 'ORAL_TECHNICAL',
        travelStartDate: '2026-08-15',
        travelEndDate: '2026-08-21',
        availableCpdaBalance: 300_000,
        requestedExpenses: exp,
      });

      const csv = exportTravelGrantsCSV([grant]);
      assert.ok(csv.includes('Deputation Reference,Faculty Name,Department,Funding Scheme'));
      assert.ok(csv.includes('Dr. Rajiv Malhotra'));
      assert.ok(csv.includes('ACM SIGCOMM 2026, ""Tokyo Special""'));
    });
  });
});
