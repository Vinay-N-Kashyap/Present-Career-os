/**
 * Central University Annual Convocation Degree Scroll Sealing & Chancellor Medals Engine
 * Statutory Compliance: University Ordinance on the Conferment of Degrees and Diplomas,
 * UGC Model Convocation Regulations & National Academic Depository (NAD DigiLocker) Standards.
 *
 * Platform: PinIT Career OS - Campus Administration Platform
 * Zero-Collision Invariant: Pure Branch C administrative governance.
 */

import { createHash } from 'crypto';

export type MedalCategory =
  | 'PRESIDENTS_GOLD_MEDAL'
  | 'CHANCELLORS_GOLD_MEDAL'
  | 'DIRECTORS_GOLD_MEDAL'
  | 'INSTITUTE_SILVER_MEDAL';

export type DegreeConfermentMode = 'IN_PERSON' | 'IN_ABSENTIA';

export type DegreeClassification =
  | 'FIRST_CLASS_WITH_DISTINCTION'
  | 'FIRST_CLASS'
  | 'SECOND_CLASS';

export interface DegreeScrollRecord {
  scrollId: string;
  degreeWatermarkToken: string; // SCR-[YEAR]-[DEGREE]-[HEX6]
  studentId: string;
  enrollmentNumber: string; // e.g. 2022CSB042
  studentName: string;
  degreeProgram: string; // e.g. "Bachelor of Technology in Computer Science & Engineering"
  degreeAbbreviation: string; // e.g. "B.Tech", "M.Tech", "Ph.D."
  department: string;
  cgpa: number;
  classification: DegreeClassification;
  confermentMode: DegreeConfermentMode;
  medalAwarded?: MedalCategory;
  thesisTitle?: string; // For PhD / Master scholars
  dignitarySignaturesVerified: boolean; // Registrar + Vice Chancellor dual seal
  dispatchTrackingNumber?: string; // For IN_ABSENTIA degrees via India Post
  cryptographicParchmentSeal?: string; // SHA-256 parchment seal
  nadDigiLockerUri?: string;
  dateConferred: string;
}

export interface ConvocationSession {
  convocationNumber: number; // e.g. 52nd Annual Convocation
  academicYear: string; // e.g. "2025-2026"
  convocationDate: string; // YYYY-MM-DD
  venue: string;
  chiefGuest: string;
  chancellorName: string;
  viceChancellorName: string;
  registrarName: string;
  status: 'SCHEDULED' | 'MEDALISTS_FINALIZED' | 'SCROLLS_SEALED' | 'CONVOCATION_CONCLUDED';
}

/**
 * Classify degree performance under academic ordinances
 */
export function classifyDegree(cgpa: number, hasBacklogs: boolean = false): DegreeClassification {
  if (cgpa < 5.0) {
    throw new Error(`Ineligible for degree conferment: CGPA ${cgpa.toFixed(2)} is below the minimum graduation hurdle (5.00).`);
  }
  if (cgpa >= 8.5 && !hasBacklogs) {
    return 'FIRST_CLASS_WITH_DISTINCTION';
  }
  if (cgpa >= 6.5) {
    return 'FIRST_CLASS';
  }
  return 'SECOND_CLASS';
}

/**
 * Generate unique degree scroll watermark token: SCR-[YEAR]-[DEGREE]-[HEX6]
 */
export function generateDegreeScrollToken(degreeAbbrev: string, year: number = new Date().getFullYear()): string {
  const cleanDegree = degreeAbbrev.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6) || 'DEG';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `SCR-${year}-${cleanDegree}-${randomHex}`;
}

/**
 * Validate institute medal eligibility criteria
 */
export function validateMedalEligibility(
  medal: MedalCategory,
  cgpa: number,
  rankInCohort: number
): { eligible: boolean; reason?: string } {
  if (medal === 'PRESIDENTS_GOLD_MEDAL') {
    if (rankInCohort !== 1 || cgpa < 9.5) {
      return {
        eligible: false,
        reason: 'President Gold Medal requires Overall Rank 1 across entire graduating cohort with CGPA >= 9.50.',
      };
    }
  } else if (medal === 'CHANCELLORS_GOLD_MEDAL') {
    if (rankInCohort > 3 || cgpa < 9.0) {
      return {
        eligible: false,
        reason: 'Chancellor Gold Medal requires Top 3 Cohort Standing with CGPA >= 9.00 and holistic leadership.',
      };
    }
  } else if (medal === 'DIRECTORS_GOLD_MEDAL') {
    if (rankInCohort !== 1 || cgpa < 9.0) {
      return {
        eligible: false,
        reason: 'Director Gold Medal requires Rank 1 in Postgraduate / Masters cohort with CGPA >= 9.00.',
      };
    }
  } else if (medal === 'INSTITUTE_SILVER_MEDAL') {
    if (rankInCohort !== 1 || cgpa < 8.5) {
      return {
        eligible: false,
        reason: 'Institute Silver Medal requires Department Branch Topper standing with CGPA >= 8.50.',
      };
    }
  }

  return { eligible: true };
}

/**
 * Generate tamper-proof SHA-256 parchment seal
 */
export function generateParchmentSeal(scroll: Omit<DegreeScrollRecord, 'cryptographicParchmentSeal'>): string {
  const canonicalPayload = [
    scroll.scrollId,
    scroll.degreeWatermarkToken,
    scroll.enrollmentNumber,
    scroll.studentName,
    scroll.degreeProgram,
    scroll.cgpa.toFixed(2),
    scroll.classification,
    scroll.confermentMode,
    scroll.medalAwarded || 'NO_MEDAL',
    scroll.dignitarySignaturesVerified ? 'SEALED_BY_CHANCELLOR' : 'UNSEALED',
    scroll.dateConferred,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Create a new degree scroll record
 */
export function createDegreeScroll(params: {
  studentId: string;
  enrollmentNumber: string;
  studentName: string;
  degreeProgram: string;
  degreeAbbreviation: string;
  department: string;
  cgpa: number;
  hasBacklogs?: boolean;
  confermentMode: DegreeConfermentMode;
  medalAwarded?: MedalCategory;
  cohortRank?: number;
  thesisTitle?: string;
  dateConferred?: string;
}): DegreeScrollRecord {
  const classification = classifyDegree(params.cgpa, params.hasBacklogs || false);

  if (params.medalAwarded && params.cohortRank !== undefined) {
    const medalCheck = validateMedalEligibility(params.medalAwarded, params.cgpa, params.cohortRank);
    if (!medalCheck.eligible) {
      throw new Error(`Medal allocation rejected: ${medalCheck.reason}`);
    }
  }

  const dateConferred = params.dateConferred || new Date().toISOString().slice(0, 10);
  const watermarkToken = generateDegreeScrollToken(params.degreeAbbreviation);
  const nadDigiLockerUri = `nad://in.gov.digilocker.degrees/${params.enrollmentNumber.toLowerCase()}`;

  const baseScroll: Omit<DegreeScrollRecord, 'cryptographicParchmentSeal'> = {
    scrollId: `DEG-${Date.now().toString(36).toUpperCase()}`,
    degreeWatermarkToken: watermarkToken,
    studentId: params.studentId,
    enrollmentNumber: params.enrollmentNumber.toUpperCase(),
    studentName: params.studentName,
    degreeProgram: params.degreeProgram,
    degreeAbbreviation: params.degreeAbbreviation,
    department: params.department,
    cgpa: params.cgpa,
    classification,
    confermentMode: params.confermentMode,
    medalAwarded: params.medalAwarded,
    thesisTitle: params.thesisTitle,
    dignitarySignaturesVerified: false,
    nadDigiLockerUri,
    dateConferred,
  };

  const cryptographicParchmentSeal = generateParchmentSeal(baseScroll);
  return { ...baseScroll, cryptographicParchmentSeal };
}

/**
 * Authorize Chancellor & Vice Chancellor physical and cryptographic seal on parchment scroll
 */
export function authorizeChancellorSealing(
  scroll: DegreeScrollRecord,
  registrarAuth: boolean,
  vcAuth: boolean
): DegreeScrollRecord {
  if (!registrarAuth || !vcAuth) {
    throw new Error('Dual seal authorization failed: Both Registrar and Vice Chancellor must execute sign-off.');
  }

  const updated: Omit<DegreeScrollRecord, 'cryptographicParchmentSeal'> = {
    ...scroll,
    dignitarySignaturesVerified: true,
  };

  const cryptographicParchmentSeal = generateParchmentSeal(updated);
  return { ...updated, cryptographicParchmentSeal };
}

/**
 * Dispatch In-Absentia degree via registered India Post
 */
export function dispatchInAbsentiaDegree(
  scroll: DegreeScrollRecord,
  trackingNumber: string
): DegreeScrollRecord {
  if (scroll.confermentMode !== 'IN_ABSENTIA') {
    throw new Error('Only In-Absentia degrees can be dispatched via registered postal transit.');
  }

  if (!scroll.dignitarySignaturesVerified) {
    throw new Error('Cannot dispatch unsealed degree parchment: Dignitary seal required prior to postal dispatch.');
  }

  return {
    ...scroll,
    dispatchTrackingNumber: trackingNumber,
  };
}

/**
 * Export Convocation Degree Ledger as statutory CSV
 */
export function exportConvocationScrollsCSV(scrolls: DegreeScrollRecord[]): string {
  const headers = [
    'Scroll ID',
    'Degree Watermark Token',
    'Enrollment Number',
    'Student Name',
    'Degree Program',
    'Department',
    'CGPA',
    'Classification',
    'Conferment Mode',
    'Medal Awarded',
    'Dignitary Seal Verified',
    'Postal Dispatch Tracking',
    'NAD DigiLocker URI',
    'Parchment Seal Hash',
  ];

  const rows = scrolls.map((s) => [
    `"${s.scrollId}"`,
    `"${s.degreeWatermarkToken}"`,
    `"${s.enrollmentNumber}"`,
    `"${s.studentName.replace(/"/g, '""')}"`,
    `"${s.degreeProgram.replace(/"/g, '""')}"`,
    `"${s.department.replace(/"/g, '""')}"`,
    s.cgpa.toFixed(2),
    `"${s.classification}"`,
    `"${s.confermentMode}"`,
    `"${s.medalAwarded || 'NONE'}"`,
    s.dignitarySignaturesVerified ? 'YES' : 'NO',
    `"${s.dispatchTrackingNumber || 'N/A'}"`,
    `"${s.nadDigiLockerUri || ''}"`,
    `"${s.cryptographicParchmentSeal || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Demonstration Convocation Session & Seed Scrolls
 */
export const INITIAL_CONVOCATION_SESSION: ConvocationSession = {
  convocationNumber: 52,
  academicYear: '2025-2026',
  convocationDate: '2026-11-28',
  venue: 'Dr. B. R. Ambedkar Convocation Auditorium',
  chiefGuest: "Hon'ble Dr. K. Radhakrishnan (Former Chairman, ISRO)",
  chancellorName: 'Smt. Anandiben Patel (Hon’ble Governor & Chancellor)',
  viceChancellorName: 'Prof. S. R. Venkatraman (Vice Chancellor)',
  registrarName: 'Col. K. S. Nair (Registrar)',
  status: 'SCROLLS_SEALED',
};

export const INITIAL_DEGREE_SCROLLS: DegreeScrollRecord[] = [
  {
    scrollId: 'DEG-52-CS01',
    degreeWatermarkToken: 'SCR-2026-BTECH-9B2F10',
    studentId: 'STU-2022-CSE-001',
    enrollmentNumber: '2022CSB001',
    studentName: 'Aarav V. Shenoy',
    degreeProgram: 'Bachelor of Technology in Computer Science & Engineering',
    degreeAbbreviation: 'B.Tech',
    department: 'Computer Science & Engineering',
    cgpa: 9.88,
    classification: 'FIRST_CLASS_WITH_DISTINCTION',
    confermentMode: 'IN_PERSON',
    medalAwarded: 'PRESIDENTS_GOLD_MEDAL',
    dignitarySignaturesVerified: true,
    cryptographicParchmentSeal: '98d1a37c02b9f848123847e91204859182374b891820491823bc89104829fa21',
    nadDigiLockerUri: 'nad://in.gov.digilocker.degrees/2022csb001',
    dateConferred: '2026-11-28',
  },
  {
    scrollId: 'DEG-52-EE04',
    degreeWatermarkToken: 'SCR-2026-BTECH-81C92A',
    studentId: 'STU-2022-EEE-014',
    enrollmentNumber: '2022EEB014',
    studentName: 'Divya R. Kulkarni',
    degreeProgram: 'Bachelor of Technology in Electrical & Electronics Engineering',
    degreeAbbreviation: 'B.Tech',
    department: 'Electrical & Electronics Engineering',
    cgpa: 9.42,
    classification: 'FIRST_CLASS_WITH_DISTINCTION',
    confermentMode: 'IN_PERSON',
    medalAwarded: 'INSTITUTE_SILVER_MEDAL',
    dignitarySignaturesVerified: true,
    cryptographicParchmentSeal: '47b8921a8471092837482910fa8921471829038471892019482918471928bcde',
    nadDigiLockerUri: 'nad://in.gov.digilocker.degrees/2022eeb014',
    dateConferred: '2026-11-28',
  },
  {
    scrollId: 'DEG-52-PHD02',
    degreeWatermarkToken: 'SCR-2026-PHD-33C401',
    studentId: 'STU-2021-PHD-008',
    enrollmentNumber: '2021PHDCSE008',
    studentName: 'Dr. Siddharth M. Joshi',
    degreeProgram: 'Doctor of Philosophy in Computer Science',
    degreeAbbreviation: 'Ph.D.',
    department: 'Computer Science & Engineering',
    cgpa: 9.15,
    classification: 'FIRST_CLASS_WITH_DISTINCTION',
    confermentMode: 'IN_ABSENTIA',
    thesisTitle: 'Self-Stabilizing Fault-Tolerant Consensus In High-Throughput Sharded Blockchains',
    dignitarySignaturesVerified: true,
    dispatchTrackingNumber: 'EM948201948IN',
    cryptographicParchmentSeal: 'a194827103847291048291847192837482910482918471928374829104829184',
    nadDigiLockerUri: 'nad://in.gov.digilocker.degrees/2021phdcse008',
    dateConferred: '2026-11-28',
  },
  {
    scrollId: 'DEG-52-ME12',
    degreeWatermarkToken: 'SCR-2026-BTECH-F82B91',
    studentId: 'STU-2022-ME-035',
    enrollmentNumber: '2022MEB035',
    studentName: 'Rohit K. Nair',
    degreeProgram: 'Bachelor of Technology in Mechanical Engineering',
    degreeAbbreviation: 'B.Tech',
    department: 'Mechanical Engineering',
    cgpa: 7.65,
    classification: 'FIRST_CLASS',
    confermentMode: 'IN_PERSON',
    dignitarySignaturesVerified: false,
    cryptographicParchmentSeal: '1948201948291847192837482910482918471928374829104829184719283748',
    nadDigiLockerUri: 'nad://in.gov.digilocker.degrees/2022meb035',
    dateConferred: '2026-11-28',
  },
];
