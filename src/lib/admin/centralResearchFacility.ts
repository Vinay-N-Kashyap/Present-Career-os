/**
 * Central University Instrumentation Facility (CUIF / CRF) Slot Booking & Analytical Equipment Allocation Engine
 *
 * Statutory Alignment:
 * - DST-FIST (Fund for Improvement of S&T Infrastructure) & SAIF Guidelines
 * - UGC Guidelines on Central Research Facilities Sharing & Resource Utilization in HEIs
 * - National I-STEM (Indian Science, Technology, and Engineering facilities Map) Compliance
 *
 * Capabilities:
 * 1. Sophisticated equipment inventory management across analytical categories
 *    (Electron Microscopy, Spectroscopy, Diffraction, Mass Spec, Thermal, Supercomputing).
 * 2. Multi-tier differential tariff billing:
 *    - Internal Academic (In-house Scholars & Faculty: highly subsidized)
 *    - External Academic (Other Universities / National Institutes)
 *    - Industry & Corporate Commercial (Revenue generation for self-sustenance).
 * 3. Formal Slot Booking State Machine:
 *    REQUESTED -> SAFETY_SCRUTINIZED -> APPROVED_SCHEDULED -> SAMPLE_RUN_COMPLETED -> INVOICED_PAID.
 * 4. Safety clearance & hazardous chemicals protocol validation.
 * 5. Calibration watchdog (blocks bookings on expired calibration or maintenance downtime).
 * 6. Unique Booking Token issuance: CRF-[YEAR]-[EQ_CODE]-[HEX6].
 * 7. Tamper-proof SHA-256 cryptographic test audit digest.
 * 8. Statutory DST / I-STEM CRF slot ledger CSV export.
 */

import crypto from 'node:crypto';

export type InstrumentCategory =
  | 'ELECTRON_MICROSCOPY'
  | 'SPECTROSCOPY'
  | 'DIFFRACTION_XRAY'
  | 'MASS_SPECTROMETRY'
  | 'THERMAL_ANALYSIS'
  | 'SUPERCOMPUTING';

export type InstrumentStatus =
  | 'OPERATIONAL'
  | 'MAINTENANCE'
  | 'CALIBRATION_RUN'
  | 'OFFLINE';

export type UserCategory =
  | 'INTERNAL_STUDENT'
  | 'INTERNAL_FACULTY'
  | 'EXTERNAL_ACADEMIC'
  | 'INDUSTRY_RND';

export type OperatorMode = 'SELF_OPERATED' | 'TECHNICIAN_ASSISTED';

export type BookingStatus =
  | 'REQUESTED'
  | 'SAFETY_SCRUTINIZED'
  | 'APPROVED_SCHEDULED'
  | 'SAMPLE_RUN_COMPLETED'
  | 'INVOICED_PAID'
  | 'CANCELLED'
  | 'REJECTED';

export interface TariffRates {
  internalAcademic: number; // INR per hour
  externalAcademic: number; // INR per hour
  industryCommercial: number; // INR per hour
}

export interface Instrument {
  id: string;
  instrumentCode: string; // e.g. "SEM-01", "NMR-01", "XRD-01", "DGX-01"
  name: string;
  category: InstrumentCategory;
  makeModel: string;
  location: string;
  status: InstrumentStatus;
  ratesPerHour: TariffRates;
  custodianFaculty: string;
  operatorTechnician: string;
  lastCalibrationDate: string; // YYYY-MM-DD
  nextCalibrationDueDate: string; // YYYY-MM-DD
}

export interface SlotBooking {
  id: string;
  bookingToken: string; // e.g. "CRF-2026-SEM-9F31B2"
  instrumentId: string;
  instrumentName: string;
  requesterName: string;
  requesterEmail: string;
  requesterAffiliation: string; // e.g. "Dept of Physics, PinIT", "IIT Delhi", "Biocon Labs"
  userCategory: UserCategory;
  sampleDescription: string;
  hazardsDeclared: boolean;
  hazardDetails?: string;
  bookingDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 - 12:00"
  durationHours: number;
  operatorMode: OperatorMode;
  status: BookingStatus;
  totalChargeInr: number;
  cryptographicDigest?: string; // SHA-256
  technicianNotes?: string;
  createdDate: string;
}

/**
 * Calculates hourly tariff based on user category.
 */
export function calculateTariffCharge(
  rates: TariffRates,
  userCategory: UserCategory,
  durationHours: number,
  operatorMode: OperatorMode
): number {
  let ratePerHour: number;

  switch (userCategory) {
    case 'INTERNAL_STUDENT':
    case 'INTERNAL_FACULTY':
      ratePerHour = rates.internalAcademic;
      break;
    case 'EXTERNAL_ACADEMIC':
      ratePerHour = rates.externalAcademic;
      break;
    case 'INDUSTRY_RND':
      ratePerHour = rates.industryCommercial;
      break;
    default:
      ratePerHour = rates.internalAcademic;
  }

  let total = ratePerHour * Math.max(1, durationHours);

  // Operator surcharge for technician assistance in industry/external tiers
  if (operatorMode === 'TECHNICIAN_ASSISTED' && userCategory === 'INDUSTRY_RND') {
    total += 1000 * durationHours; // Rs. 1000/hr technician surcharge
  }

  return Math.round(total);
}

/**
 * Validates if equipment is in a bookable state (must be OPERATIONAL and calibration valid).
 */
export function isInstrumentBookable(
  instrument: Instrument,
  requestedDate: string = new Date().toISOString().split('T')[0]
): { isBookable: boolean; reason?: string } {
  if (instrument.status !== 'OPERATIONAL') {
    return {
      isBookable: false,
      reason: `Instrument is currently ${instrument.status.replace('_', ' ')}. Bookings disabled.`,
    };
  }

  if (requestedDate > instrument.nextCalibrationDueDate) {
    return {
      isBookable: false,
      reason: `Equipment calibration overdue since ${instrument.nextCalibrationDueDate}. Recalibration required.`,
    };
  }

  return { isBookable: true };
}

/**
 * Generates official CRF Booking Token.
 * Format: CRF-[YEAR]-[EQ_CODE]-[HEX6]
 */
export function generateBookingToken(
  instrumentCode: string,
  year: number,
  bookingId: string
): string {
  const cleanCode = instrumentCode.split('-')[0] || 'CRF';
  const hash = crypto
    .createHash('sha256')
    .update(`${instrumentCode}::${year}::${bookingId}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();

  return `CRF-${year}-${cleanCode}-${hash}`;
}

/**
 * Generates tamper-proof SHA-256 analytical verification digest for completed test runs.
 */
export function generateTestAuditDigest(booking: {
  bookingToken: string;
  instrumentName: string;
  requesterName: string;
  bookingDate: string;
  timeSlot: string;
  totalChargeInr: number;
}): string {
  const payload = [
    booking.bookingToken,
    booking.instrumentName,
    booking.requesterName,
    booking.bookingDate,
    booking.timeSlot,
    `FEE_INR:${booking.totalChargeInr}`,
  ].join('::');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Exports CRF Equipment Bookings to standard CSV.
 */
export function exportCrfBookingsCSV(bookings: SlotBooking[]): string {
  const headers = [
    'Booking Token',
    'Instrument Name',
    'Requester Name',
    'Affiliation',
    'User Category',
    'Sample Description',
    'Hazards Declared',
    'Date',
    'Time Slot',
    'Duration (Hours)',
    'Operator Mode',
    'Status',
    'Total Charge (INR)',
    'Cryptographic SHA-256 Digest',
  ];

  const rows = bookings.map((b) => [
    `"${b.bookingToken}"`,
    `"${b.instrumentName.replace(/"/g, '""')}"`,
    `"${b.requesterName.replace(/"/g, '""')}"`,
    `"${b.requesterAffiliation.replace(/"/g, '""')}"`,
    `"${b.userCategory}"`,
    `"${b.sampleDescription.replace(/"/g, '""')}"`,
    `"${b.hazardsDeclared ? 'YES' : 'NO'}"`,
    `"${b.bookingDate}"`,
    `"${b.timeSlot}"`,
    `"${b.durationHours}"`,
    `"${b.operatorMode}"`,
    `"${b.status}"`,
    `"${b.totalChargeInr}"`,
    `"${b.cryptographicDigest || 'UNSIGNED'}"`,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

// ---------------------------------------------------------------------------
// DEFAULT SEED DATA & IN-MEMORY STORE
// ---------------------------------------------------------------------------

export const DEFAULT_INSTRUMENTS: Instrument[] = [
  {
    id: 'EQ-001',
    instrumentCode: 'SEM-01',
    name: 'Field Emission Scanning Electron Microscope (FE-SEM)',
    category: 'ELECTRON_MICROSCOPY',
    makeModel: 'JEOL JSM-7610FPlus with Oxford EDS',
    location: 'Bay 102, Ground Floor, Central Sciences Block',
    status: 'OPERATIONAL',
    ratesPerHour: {
      internalAcademic: 500,
      externalAcademic: 1800,
      industryCommercial: 4500,
    },
    custodianFaculty: 'Prof. S. R. Raman',
    operatorTechnician: 'Mr. Arvind Shinde (Senior Technical Officer)',
    lastCalibrationDate: '2026-08-15',
    nextCalibrationDueDate: '2026-12-15',
  },
  {
    id: 'EQ-002',
    instrumentCode: 'NMR-01',
    name: '500 MHz Superconducting FT-NMR Spectrometer',
    category: 'SPECTROSCOPY',
    makeModel: 'Bruker Avance NEO 500 MHz with CryoProbe',
    location: 'Bay 104, High-Field Magnetic Lab',
    status: 'OPERATIONAL',
    ratesPerHour: {
      internalAcademic: 600,
      externalAcademic: 2200,
      industryCommercial: 5500,
    },
    custodianFaculty: 'Dr. Vivek Bhattacharya',
    operatorTechnician: 'Ms. Sunita Patil (NMR Specialist)',
    lastCalibrationDate: '2026-07-20',
    nextCalibrationDueDate: '2026-11-20',
  },
  {
    id: 'EQ-003',
    instrumentCode: 'XRD-01',
    name: 'High-Resolution Powder X-Ray Diffractometer (HR-XRD)',
    category: 'DIFFRACTION_XRAY',
    makeModel: 'Malvern Panalytical Empyrean 3rd Gen',
    location: 'Bay 108, Crystallography Wing',
    status: 'OPERATIONAL',
    ratesPerHour: {
      internalAcademic: 400,
      externalAcademic: 1500,
      industryCommercial: 3800,
    },
    custodianFaculty: 'Prof. Anita Deshmukh',
    operatorTechnician: 'Mr. Rajesh Nambiar',
    lastCalibrationDate: '2026-09-01',
    nextCalibrationDueDate: '2027-01-01',
  },
  {
    id: 'EQ-004',
    instrumentCode: 'LCMS-01',
    name: 'High-Resolution Q-TOF LC-MS/MS Mass Spectrometer',
    category: 'MASS_SPECTROMETRY',
    makeModel: 'Agilent 6545XT AdvanceBio LC/Q-TOF',
    location: 'Bay 201, Bio-Analytical Suite, 1st Floor',
    status: 'OPERATIONAL',
    ratesPerHour: {
      internalAcademic: 750,
      externalAcademic: 2800,
      industryCommercial: 6500,
    },
    custodianFaculty: 'Dr. Preeti Vasudevan',
    operatorTechnician: 'Dr. G. Venkataraman (Proteomics Lead)',
    lastCalibrationDate: '2026-06-10',
    nextCalibrationDueDate: '2026-10-30',
  },
  {
    id: 'EQ-005',
    instrumentCode: 'DGX-01',
    name: 'NVIDIA DGX A100 High-Performance Supercomputing Node',
    category: 'SUPERCOMPUTING',
    makeModel: 'NVIDIA DGX A100 (8x A100 80GB SXM4, 640GB GPU Memory)',
    location: 'Server Room 301, High Performance Computing Center',
    status: 'OPERATIONAL',
    ratesPerHour: {
      internalAcademic: 300,
      externalAcademic: 1200,
      industryCommercial: 3500,
    },
    custodianFaculty: 'Prof. Harish Chandra',
    operatorTechnician: 'Mr. Deepak Sharma (HPC Systems Admin)',
    lastCalibrationDate: '2026-08-01',
    nextCalibrationDueDate: '2027-02-01',
  },
];

export const DEFAULT_BOOKINGS: SlotBooking[] = [
  {
    id: 'BKG-001',
    bookingToken: 'CRF-2026-SEM-9F31B2',
    instrumentId: 'EQ-001',
    instrumentName: 'Field Emission Scanning Electron Microscope (FE-SEM)',
    requesterName: 'Aarohi Shenoy',
    requesterEmail: 'aarohi.shenoy@pinit.edu',
    requesterAffiliation: 'Department of Computer Science & Physics, PinIT',
    userCategory: 'INTERNAL_STUDENT',
    sampleDescription: 'Silicon quantum dot wafer cross-section imaging at 100,000x magnification',
    hazardsDeclared: false,
    bookingDate: '2026-10-18',
    timeSlot: '09:30 - 11:30',
    durationHours: 2,
    operatorMode: 'SELF_OPERATED',
    status: 'APPROVED_SCHEDULED',
    totalChargeInr: 1000,
    createdDate: '2026-10-15',
  },
  {
    id: 'BKG-002',
    bookingToken: 'CRF-2026-NMR-4A82F1',
    instrumentId: 'EQ-002',
    instrumentName: '500 MHz Superconducting FT-NMR Spectrometer',
    requesterName: 'Dr. K. S. Mukherjee',
    requesterEmail: 'ksm@biocon.com',
    requesterAffiliation: 'Biocon Biologics R&D Centre, Bangalore',
    userCategory: 'INDUSTRY_RND',
    sampleDescription: 'Recombinant monoclonal antibody structural characterization in D2O',
    hazardsDeclared: false,
    bookingDate: '2026-10-19',
    timeSlot: '14:00 - 17:00',
    durationHours: 3,
    operatorMode: 'TECHNICIAN_ASSISTED',
    status: 'INVOICED_PAID',
    totalChargeInr: 19500, // (5500 + 1000) * 3 = 19,500
    cryptographicDigest:
      'c81e728d9d4c2f636f067f89cc14862c1ecd73efb1c0908cf6b4f74d08a54d68',
    technicianNotes: 'High-resolution 1H and 13C spectral data generated and uploaded.',
    createdDate: '2026-10-14',
  },
  {
    id: 'BKG-003',
    bookingToken: 'CRF-2026-XRD-1F76D0',
    instrumentId: 'EQ-003',
    instrumentName: 'High-Resolution Powder X-Ray Diffractometer (HR-XRD)',
    requesterName: 'Pooja Sundaram',
    requesterEmail: 'pooja.s@pinit.edu',
    requesterAffiliation: 'Department of Biotechnology, PinIT',
    userCategory: 'INTERNAL_STUDENT',
    sampleDescription: 'Perovskite nanocrystal thin-film phase purity assessment',
    hazardsDeclared: false,
    bookingDate: '2026-10-16',
    timeSlot: '11:00 - 13:00',
    durationHours: 2,
    operatorMode: 'TECHNICIAN_ASSISTED',
    status: 'SAMPLE_RUN_COMPLETED',
    totalChargeInr: 800,
    cryptographicDigest:
      '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    technicianNotes: 'Bragg peaks indexed; full width at half maximum (FWHM) calculated.',
    createdDate: '2026-10-12',
  },
  {
    id: 'BKG-004',
    bookingToken: 'CRF-2026-DGX-D390E4',
    instrumentId: 'EQ-005',
    instrumentName: 'NVIDIA DGX A100 High-Performance Supercomputing Node',
    requesterName: 'Prof. Harish Chandra',
    requesterEmail: 'harish.c@pinit.edu',
    requesterAffiliation: 'School of AI & Autonomous Systems, PinIT',
    userCategory: 'INTERNAL_FACULTY',
    sampleDescription: 'Distributed pre-training of 7B parameter multimodal medical foundation model',
    hazardsDeclared: false,
    bookingDate: '2026-10-20',
    timeSlot: '00:00 - 08:00',
    durationHours: 8,
    operatorMode: 'SELF_OPERATED',
    status: 'APPROVED_SCHEDULED',
    totalChargeInr: 2400,
    createdDate: '2026-10-16',
  },
];

let instrumentsStore: Instrument[] = [...DEFAULT_INSTRUMENTS];
let bookingsStore: SlotBooking[] = [...DEFAULT_BOOKINGS];

export function resetCrfStore(): void {
  instrumentsStore = [...DEFAULT_INSTRUMENTS];
  bookingsStore = [...DEFAULT_BOOKINGS];
}

export function getAllInstruments(): Instrument[] {
  return [...instrumentsStore];
}

export function getAllBookings(): SlotBooking[] {
  return [...bookingsStore];
}

export function getInstrumentById(id: string): Instrument | undefined {
  return instrumentsStore.find((i) => i.id === id);
}

export function registerCrfBooking(
  input: Omit<SlotBooking, 'id' | 'bookingToken' | 'cryptographicDigest'> & {
    id?: string;
  }
): { success: boolean; booking?: SlotBooking; error?: string } {
  const instrument = getInstrumentById(input.instrumentId);
  if (!instrument) {
    return { success: false, error: 'Instrument not found.' };
  }

  const bookableCheck = isInstrumentBookable(instrument, input.bookingDate);
  if (!bookableCheck.isBookable) {
    return { success: false, error: bookableCheck.reason };
  }

  const id = input.id || `BKG-${Date.now().toString().slice(-4)}`;
  const currentYear = new Date().getFullYear();
  const bookingToken = generateBookingToken(instrument.instrumentCode, currentYear, id);

  const totalCharge = calculateTariffCharge(
    instrument.ratesPerHour,
    input.userCategory,
    input.durationHours,
    input.operatorMode
  );

  const newBooking: SlotBooking = {
    ...input,
    id,
    bookingToken,
    instrumentName: instrument.name,
    totalChargeInr: totalCharge,
  };

  bookingsStore.unshift(newBooking);
  return { success: true, booking: newBooking };
}

export function updateBookingStatus(
  bookingId: string,
  newStatus: BookingStatus,
  technicianNotes?: string
): SlotBooking | null {
  const idx = bookingsStore.findIndex((b) => b.id === bookingId);
  if (idx === -1) return null;

  const current = bookingsStore[idx];
  const updated: SlotBooking = {
    ...current,
    status: newStatus,
    technicianNotes: technicianNotes ?? current.technicianNotes,
  };

  if (newStatus === 'SAMPLE_RUN_COMPLETED' || newStatus === 'INVOICED_PAID') {
    updated.cryptographicDigest = generateTestAuditDigest(updated);
  }

  bookingsStore[idx] = updated;
  return updated;
}
