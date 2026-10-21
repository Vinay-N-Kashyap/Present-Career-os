/**
 * Central University Guest House Transit Accommodation & VIP Protocol Allocation Engine
 * Statutory Compliance: University Guest House & Hospitality Regulations,
 * Ministry of Education Protocol Guidelines & Estate Office Tariff Directives.
 *
 * Platform: PinIT Career OS - Campus Administration Platform
 * Zero-Collision Invariant: Pure Branch C administrative governance.
 */

import { createHash } from 'crypto';

export type GuestCategory =
  | 'CATEGORY_A_INSTITUTIONAL'
  | 'CATEGORY_B_ACADEMIC_VISITOR'
  | 'CATEGORY_C_PERSONAL_GENERAL';

export type RoomType =
  | 'VIP_PRESIDENTIAL_SUITE'
  | 'EXECUTIVE_DELUXE'
  | 'STANDARD_DOUBLE'
  | 'TRANSIT_SCHOLAR_STUDIO';

export type BookingStage =
  | 'REQUESTED'
  | 'ESTATE_OFFICER_APPROVED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT_BILLED'
  | 'CANCELLED';

export interface GuestBookingRecord {
  bookingId: string;
  bookingRefNumber: string; // GH-[YEAR]-[TIER]-[HEX6]
  guestName: string;
  guestDesignation: string; // e.g. External PhD Examiner, IIT Bombay
  guestCategory: GuestCategory;
  roomType: RoomType;
  roomNumber: string; // e.g. Suite-101, Deluxe-204
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  durationDays: number;
  tariffPerDay: number; // in INR (0 for Category A)
  totalBillingAmount: number; // in INR
  sponsoringDepartment: string;
  sponsoringFacultyPi?: string;
  vipProtocolRequired: boolean; // e.g. Car escort, Chancellor tea service
  stage: BookingStage;
  approvalRemarks?: string;
  cryptographicSeal?: string; // SHA-256 seal
}

/**
 * Standard daily tariff matrix (INR) under University Estate Office regulations
 */
export const DAILY_TARIFF_MATRIX: Record<RoomType, Record<GuestCategory, number>> = {
  VIP_PRESIDENTIAL_SUITE: {
    CATEGORY_A_INSTITUTIONAL: 0,
    CATEGORY_B_ACADEMIC_VISITOR: 1_500,
    CATEGORY_C_PERSONAL_GENERAL: 4_000,
  },
  EXECUTIVE_DELUXE: {
    CATEGORY_A_INSTITUTIONAL: 0,
    CATEGORY_B_ACADEMIC_VISITOR: 1_000,
    CATEGORY_C_PERSONAL_GENERAL: 2_500,
  },
  STANDARD_DOUBLE: {
    CATEGORY_A_INSTITUTIONAL: 0,
    CATEGORY_B_ACADEMIC_VISITOR: 600,
    CATEGORY_C_PERSONAL_GENERAL: 1_500,
  },
  TRANSIT_SCHOLAR_STUDIO: {
    CATEGORY_A_INSTITUTIONAL: 0,
    CATEGORY_B_ACADEMIC_VISITOR: 500,
    CATEGORY_C_PERSONAL_GENERAL: 1_200,
  },
};

/**
 * Calculates total billing based on room type, category, and stay duration
 */
export function calculateGuestTariff(
  roomType: RoomType,
  category: GuestCategory,
  durationDays: number
): { tariffPerDay: number; totalBillingAmount: number } {
  if (durationDays <= 0) {
    throw new Error('Stay duration must be at least 1 day');
  }

  const tariffPerDay = DAILY_TARIFF_MATRIX[roomType][category];
  const totalBillingAmount = tariffPerDay * durationDays;
  return { tariffPerDay, totalBillingAmount };
}

/**
 * Checks for temporal clashes on a given room across existing bookings
 */
export function checkRoomAvailability(
  existingBookings: GuestBookingRecord[],
  roomNumber: string,
  newCheckIn: string,
  newCheckOut: string,
  excludeBookingId?: string
): boolean {
  const newStart = new Date(newCheckIn).getTime();
  const newEnd = new Date(newCheckOut).getTime();

  if (isNaN(newStart) || isNaN(newEnd) || newEnd <= newStart) {
    throw new Error('Invalid check-in or check-out date range');
  }

  for (const b of existingBookings) {
    if (b.bookingId === excludeBookingId || b.stage === 'CANCELLED') continue;
    if (b.roomNumber !== roomNumber) continue;

    const bStart = new Date(b.checkInDate).getTime();
    const bEnd = new Date(b.checkOutDate).getTime();

    // Overlap condition: startA < endB and endA > startB
    if (newStart < bEnd && newEnd > bStart) {
      return false; // Clash detected
    }
  }

  return true; // Available
}

/**
 * Generates unique booking reference token: GH-[YEAR]-[TIER_CODE]-[HEX6]
 */
export function generateGuestHouseToken(category: GuestCategory): string {
  const tierCodeMap: Record<GuestCategory, string> = {
    CATEGORY_A_INSTITUTIONAL: 'INST',
    CATEGORY_B_ACADEMIC_VISITOR: 'ACAD',
    CATEGORY_C_PERSONAL_GENERAL: 'GENL',
  };
  const code = tierCodeMap[category] || 'GUEST';
  const year = new Date().getFullYear();
  const hex = createHash('sha256')
    .update(`${code}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .slice(0, 6)
    .toUpperCase();
  return `GH-${year}-${code}-${hex}`;
}

/**
 * Computes tamper-proof SHA-256 seal for booking confirmation and clearance
 */
export function generateGuestHouseSeal(
  bookingRef: string,
  guestName: string,
  roomNumber: string,
  checkInDate: string,
  checkOutDate: string,
  totalBilling: number
): string {
  const payload = [
    bookingRef,
    guestName,
    roomNumber,
    checkInDate,
    checkOutDate,
    totalBilling.toFixed(2),
  ].join('||');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Registers new guest house accommodation request
 */
export function registerGuestBooking(
  existingBookings: GuestBookingRecord[],
  params: {
    guestName: string;
    guestDesignation: string;
    guestCategory: GuestCategory;
    roomType: RoomType;
    roomNumber: string;
    checkInDate: string;
    checkOutDate: string;
    sponsoringDepartment: string;
    sponsoringFacultyPi?: string;
    vipProtocolRequired?: boolean;
  }
): GuestBookingRecord {
  const isAvailable = checkRoomAvailability(
    existingBookings,
    params.roomNumber,
    params.checkInDate,
    params.checkOutDate
  );

  if (!isAvailable) {
    throw new Error(`Room ${params.roomNumber} is already occupied for the requested dates`);
  }

  const start = new Date(params.checkInDate).getTime();
  const end = new Date(params.checkOutDate).getTime();
  const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  const { tariffPerDay, totalBillingAmount } = calculateGuestTariff(
    params.roomType,
    params.guestCategory,
    durationDays
  );

  const bookingRefNumber = generateGuestHouseToken(params.guestCategory);
  const bookingId = `GH-${Date.now().toString(36)}`;

  return {
    bookingId,
    bookingRefNumber,
    guestName: params.guestName,
    guestDesignation: params.guestDesignation,
    guestCategory: params.guestCategory,
    roomType: params.roomType,
    roomNumber: params.roomNumber,
    checkInDate: params.checkInDate,
    checkOutDate: params.checkOutDate,
    durationDays,
    tariffPerDay,
    totalBillingAmount,
    sponsoringDepartment: params.sponsoringDepartment,
    sponsoringFacultyPi: params.sponsoringFacultyPi,
    vipProtocolRequired: Boolean(params.vipProtocolRequired),
    stage: 'REQUESTED',
  };
}

/**
 * Advances booking status through lifecycle and seals upon checkout or approval
 */
export function updateGuestBookingStatus(
  booking: GuestBookingRecord,
  nextStage: BookingStage,
  remarks?: string
): GuestBookingRecord {
  let seal = booking.cryptographicSeal;

  if (nextStage === 'ESTATE_OFFICER_APPROVED' || nextStage === 'CHECKED_OUT_BILLED') {
    seal = generateGuestHouseSeal(
      booking.bookingRefNumber,
      booking.guestName,
      booking.roomNumber,
      booking.checkInDate,
      booking.checkOutDate,
      booking.totalBillingAmount
    );
  }

  return {
    ...booking,
    stage: nextStage,
    approvalRemarks: remarks || booking.approvalRemarks,
    cryptographicSeal: seal,
  };
}

/**
 * Exports University Guest House Ledger CSV compliant with Estate Office audits
 */
export function exportGuestHouseBookingsCSV(records: GuestBookingRecord[]): string {
  const headers = [
    'Booking Reference',
    'Guest Name',
    'Designation',
    'Category',
    'Room Type',
    'Room Number',
    'Check-In Date',
    'Check-Out Date',
    'Duration (Days)',
    'Tariff/Day (INR)',
    'Total Billing (INR)',
    'Sponsoring Department',
    'VIP Protocol',
    'Stage',
    'Cryptographic SHA-256 Seal',
  ];

  const escapeField = (val: string | number | boolean | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = records.map((b) =>
    [
      escapeField(b.bookingRefNumber),
      escapeField(b.guestName),
      escapeField(b.guestDesignation),
      escapeField(b.guestCategory),
      escapeField(b.roomType),
      escapeField(b.roomNumber),
      escapeField(b.checkInDate),
      escapeField(b.checkOutDate),
      escapeField(b.durationDays),
      escapeField(b.tariffPerDay),
      escapeField(b.totalBillingAmount),
      escapeField(b.sponsoringDepartment),
      escapeField(b.vipProtocolRequired ? 'YES' : 'NO'),
      escapeField(b.stage),
      escapeField(b.cryptographicSeal ?? 'N/A'),
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Seed Dataset for Central Guest House Reservations
 */
export const SEED_GUEST_BOOKINGS: GuestBookingRecord[] = [
  {
    bookingId: 'GH-001',
    bookingRefNumber: 'GH-2026-INST-88DF10',
    guestName: 'Prof. Manindra Agrawal',
    guestDesignation: 'Director, IIT Kanpur & National Cyber Security Advisor',
    guestCategory: 'CATEGORY_A_INSTITUTIONAL',
    roomType: 'VIP_PRESIDENTIAL_SUITE',
    roomNumber: 'VIP-Suite-01',
    checkInDate: '2026-02-15',
    checkOutDate: '2026-02-17',
    durationDays: 2,
    tariffPerDay: 0,
    totalBillingAmount: 0,
    sponsoringDepartment: 'Office of the Vice-Chancellor',
    vipProtocolRequired: true,
    stage: 'CHECKED_OUT_BILLED',
    approvalRemarks: 'Keynote Speaker for Annual Institute Convocation 2026.',
    cryptographicSeal: 'b4a694f83726591024e58b19a12c4193856112948c264a9712bfd91e846011c3',
  },
  {
    bookingId: 'GH-002',
    bookingRefNumber: 'GH-2026-INST-99AE23',
    guestName: 'Dr. C. P. Ravikumar',
    guestDesignation: 'External Viva Examiner (Texas Instruments India)',
    guestCategory: 'CATEGORY_A_INSTITUTIONAL',
    roomType: 'EXECUTIVE_DELUXE',
    roomNumber: 'Deluxe-201',
    checkInDate: '2026-02-20',
    checkOutDate: '2026-02-22',
    durationDays: 2,
    tariffPerDay: 0,
    totalBillingAmount: 0,
    sponsoringDepartment: 'Electrical & Electronics Engineering',
    sponsoringFacultyPi: 'Prof. Arvind Swaminathan',
    vipProtocolRequired: false,
    stage: 'ESTATE_OFFICER_APPROVED',
    approvalRemarks: 'External Examiner for PhD thesis viva defense.',
    cryptographicSeal: 'fa82194857b10294856cd89123485761a2938475b6c7d8e9f0123456789abcde',
  },
  {
    bookingId: 'GH-003',
    bookingRefNumber: 'GH-2026-ACAD-33BC45',
    guestName: 'Dr. Elena Rostova',
    guestDesignation: 'Visiting Research Scientist, Max Planck Institute Germany',
    guestCategory: 'CATEGORY_B_ACADEMIC_VISITOR',
    roomType: 'TRANSIT_SCHOLAR_STUDIO',
    roomNumber: 'Transit-304',
    checkInDate: '2026-03-01',
    checkOutDate: '2026-03-10',
    durationDays: 9,
    tariffPerDay: 500,
    totalBillingAmount: 4_500,
    sponsoringDepartment: 'Department of Chemistry',
    sponsoringFacultyPi: 'Dr. Meenakshi Sundaram',
    vipProtocolRequired: false,
    stage: 'ESTATE_OFFICER_APPROVED',
    approvalRemarks: 'Joint Indo-German DST project bilateral collaborator.',
  },
  {
    bookingId: 'GH-004',
    bookingRefNumber: 'GH-2026-GENL-55FF12',
    guestName: 'Mr. & Mrs. R. K. Mittal',
    guestDesignation: 'Parents of B.Tech Gold Medalist Graduating Student',
    guestCategory: 'CATEGORY_C_PERSONAL_GENERAL',
    roomType: 'STANDARD_DOUBLE',
    roomNumber: 'Standard-105',
    checkInDate: '2026-03-14',
    checkOutDate: '2026-03-16',
    durationDays: 2,
    tariffPerDay: 1_500,
    totalBillingAmount: 3_000,
    sponsoringDepartment: 'Dean Student Affairs Office',
    vipProtocolRequired: false,
    stage: 'REQUESTED',
  },
];
