/**
 * Central University Academic Bank of Credits (ABC), Digilocker NAD & APAAR ID Synchronization Engine
 * 
 * Statutory & Regulatory Framework:
 * - National Education Policy 2020 (NEP 2020) Multiple Entry and Exit in Academic Programmes (MEES)
 * - UGC (Establishment and Operation of Academic Bank of Credits in Higher Education) Regulations 2021
 * - Ministry of Education (MoE) Automated Permanent Academic Account Registry (APAAR ID) Framework
 * - National Academic Depository (NAD) & Digilocker API v2 Standard Schema
 */

import { createHash } from 'crypto';

export type MeesCredentialTier = 
  | 'UG_CERTIFICATE'      // 40 Credits (Year 1 Exit)
  | 'UG_DIPLOMA'          // 80 Credits (Year 2 Exit)
  | 'BACHELORS_DEGREE'    // 120 Credits (Year 3 Exit)
  | 'BACHELORS_HONOURS';  // 160 Credits (Year 4 Completion)

export type AbcSyncStatus = 
  | 'PENDING_VERIFICATION'
  | 'SYNCED_DIGILOCKER_NAD'
  | 'CREDIT_REDEMPTION_PROCESSING'
  | 'DEGREE_AWARDED_CLOSED'
  | 'SYNC_FAILED_MISMATCH';

export interface CreditCourseItem {
  courseCode: string;
  courseTitle: string;
  creditsEarned: number;
  semester: number;
  gradeEarned: string; // e.g. 'O', 'A+', 'A', 'B+'
  academicYear: string; // e.g. '2025-2026'
  awardingInstitute: string;
  institutionCode: string; // AISHE or UGC Code
  isExternalTransfer: boolean;
  completionDate: string; // ISO Date YYYY-MM-DD
  verifiedDigilockerSha: string;
}

export interface CreditRedemptionRecord {
  redemptionId: string;
  credentialTier: MeesCredentialTier;
  creditsRedeemed: number;
  minimumCreditsRequired: number;
  requestDate: string;
  approvalDate?: string;
  approvedByDean: boolean;
  certificateSerialNumber?: string;
  status: 'REQUESTED' | 'APPROVED' | 'DISCHARGED';
}

export interface StudentAbcRecord {
  abcRecordId: string; // Token format: ABC-[YEAR]-[DEPT]-[HEX6]
  studentId: string; // University Roll Number
  studentName: string;
  apaarId: string; // 12-digit standard APAAR ID (e.g. "9821-4401-8923" or "982144018923")
  digilockerUri?: string; // in.gov.digilocker.nad/CERT/...
  programName: string;
  department: string;
  admissionYear: number;
  totalCreditsAccumulated: number;
  totalCreditsRedeemed: number;
  activeCreditBalance: number;
  courses: CreditCourseItem[];
  redemptions: CreditRedemptionRecord[];
  syncStatus: AbcSyncStatus;
  lastSyncedAt?: string;
  createdTimestamp: string;
  auditSha256: string;
}

// NEP 2020 Minimum Credit Thresholds for Higher Education Multiple Entry / Exit
export const NEP_CREDIT_THRESHOLDS: Record<MeesCredentialTier, number> = {
  UG_CERTIFICATE: 40,
  UG_DIPLOMA: 80,
  BACHELORS_DEGREE: 120,
  BACHELORS_HONOURS: 160
};

/**
 * Validate standard 12-digit APAAR ID format
 */
export function validateApaarId(apaarId: string): boolean {
  const sanitized = apaarId.replace(/[\s-]/g, '');
  return /^\d{12}$/.test(sanitized);
}

/**
 * Format sanitized 12-digit APAAR ID with standard dashes (XXXX-XXXX-XXXX)
 */
export function formatApaarId(apaarId: string): string {
  const sanitized = apaarId.replace(/[\s-]/g, '');
  if (!/^\d{12}$/.test(sanitized)) {
    throw new Error(`Invalid APAAR ID format: Must be exactly 12 numeric digits.`);
  }
  return `${sanitized.slice(0, 4)}-${sanitized.slice(4, 8)}-${sanitized.slice(8, 12)}`;
}

/**
 * Generate cryptographic SHA-256 seal for Student ABC and Digilocker record
 */
export function generateAbcSeal(record: Omit<StudentAbcRecord, 'auditSha256'>): string {
  const payload = [
    record.abcRecordId,
    record.studentId,
    record.apaarId,
    record.programName,
    record.totalCreditsAccumulated,
    record.totalCreditsRedeemed,
    record.activeCreditBalance,
    record.syncStatus,
    record.courses.length,
    record.redemptions.length
  ].join('|');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Format statutory unique ABC record token
 */
export function formatAbcRecordId(department: string, year: number = 2026): string {
  const deptCode = department.replace(/[^A-Z]/gi, '').substring(0, 4).toUpperCase() || 'ENGG';
  const hex = createHash('sha256')
    .update(`${department}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();
  return `ABC-${year}-${deptCode}-${hex}`;
}

/**
 * Check eligible NEP 2020 credential exits based on active credit balance
 */
export function evaluateMeesEligibility(activeCredits: number): {
  eligibleCredentials: MeesCredentialTier[];
  highestCredential: MeesCredentialTier | null;
  creditsToNextTier: number;
} {
  const eligibleCredentials: MeesCredentialTier[] = [];

  if (activeCredits >= NEP_CREDIT_THRESHOLDS.BACHELORS_HONOURS) {
    eligibleCredentials.push('BACHELORS_HONOURS', 'BACHELORS_DEGREE', 'UG_DIPLOMA', 'UG_CERTIFICATE');
    return {
      eligibleCredentials,
      highestCredential: 'BACHELORS_HONOURS',
      creditsToNextTier: 0
    };
  }

  if (activeCredits >= NEP_CREDIT_THRESHOLDS.BACHELORS_DEGREE) {
    eligibleCredentials.push('BACHELORS_DEGREE', 'UG_DIPLOMA', 'UG_CERTIFICATE');
    return {
      eligibleCredentials,
      highestCredential: 'BACHELORS_DEGREE',
      creditsToNextTier: NEP_CREDIT_THRESHOLDS.BACHELORS_HONOURS - activeCredits
    };
  }

  if (activeCredits >= NEP_CREDIT_THRESHOLDS.UG_DIPLOMA) {
    eligibleCredentials.push('UG_DIPLOMA', 'UG_CERTIFICATE');
    return {
      eligibleCredentials,
      highestCredential: 'UG_DIPLOMA',
      creditsToNextTier: NEP_CREDIT_THRESHOLDS.BACHELORS_DEGREE - activeCredits
    };
  }

  if (activeCredits >= NEP_CREDIT_THRESHOLDS.UG_CERTIFICATE) {
    eligibleCredentials.push('UG_CERTIFICATE');
    return {
      eligibleCredentials,
      highestCredential: 'UG_CERTIFICATE',
      creditsToNextTier: NEP_CREDIT_THRESHOLDS.UG_DIPLOMA - activeCredits
    };
  }

  return {
    eligibleCredentials: [],
    highestCredential: null,
    creditsToNextTier: NEP_CREDIT_THRESHOLDS.UG_CERTIFICATE - activeCredits
  };
}

/**
 * Create a new Student Academic Bank of Credits (ABC) Record
 */
export function createStudentAbcRecord(params: {
  studentId: string;
  studentName: string;
  apaarId: string;
  programName: string;
  department: string;
  admissionYear: number;
  initialCourses?: Omit<CreditCourseItem, 'verifiedDigilockerSha'>[];
  year?: number;
}): StudentAbcRecord {
  const formattedApaar = formatApaarId(params.apaarId);
  const abcRecordId = formatAbcRecordId(params.department, params.year);
  const now = new Date().toISOString();

  let totalAccumulated = 0;
  const courses: CreditCourseItem[] = (params.initialCourses || []).map(c => {
    totalAccumulated += c.creditsEarned;
    const shaPayload = `${c.courseCode}|${c.creditsEarned}|${c.gradeEarned}|${c.awardingInstitute}|${c.completionDate}`;
    const verifiedDigilockerSha = createHash('sha256').update(shaPayload).digest('hex');
    return {
      ...c,
      verifiedDigilockerSha
    };
  });

  const baseRecord: Omit<StudentAbcRecord, 'auditSha256'> = {
    abcRecordId,
    studentId: params.studentId.toUpperCase(),
    studentName: params.studentName,
    apaarId: formattedApaar,
    programName: params.programName,
    department: params.department,
    admissionYear: params.admissionYear,
    totalCreditsAccumulated: totalAccumulated,
    totalCreditsRedeemed: 0,
    activeCreditBalance: totalAccumulated,
    courses,
    redemptions: [],
    syncStatus: 'PENDING_VERIFICATION',
    createdTimestamp: now
  };

  const auditSha256 = generateAbcSeal(baseRecord);
  return { ...baseRecord, auditSha256 };
}

/**
 * Synchronize Student Record with Digilocker NAD National Repository
 */
export function syncWithDigilockerNad(
  record: StudentAbcRecord,
  institutionAisheCode: string = 'U-0123'
): { success: boolean; record: StudentAbcRecord; digilockerUri: string } {
  const now = new Date().toISOString();
  const sanitizedApaar = record.apaarId.replace(/[\s-]/g, '');
  const digilockerUri = `in.gov.digilocker.nad/ABC/${institutionAisheCode}/${record.admissionYear}/${sanitizedApaar}`;

  const updated: StudentAbcRecord = {
    ...record,
    digilockerUri,
    syncStatus: 'SYNCED_DIGILOCKER_NAD',
    lastSyncedAt: now
  };

  return {
    success: true,
    record: { ...updated, auditSha256: generateAbcSeal(updated) },
    digilockerUri
  };
}

/**
 * Add / Transfer Course Credits into the Academic Bank
 */
export function addCourseCredits(
  record: StudentAbcRecord,
  course: Omit<CreditCourseItem, 'verifiedDigilockerSha'>
): StudentAbcRecord {
  const shaPayload = `${course.courseCode}|${course.creditsEarned}|${course.gradeEarned}|${course.awardingInstitute}|${course.completionDate}`;
  const verifiedDigilockerSha = createHash('sha256').update(shaPayload).digest('hex');

  const newCourse: CreditCourseItem = {
    ...course,
    verifiedDigilockerSha
  };

  const newAccumulated = record.totalCreditsAccumulated + course.creditsEarned;
  const newActiveBalance = record.activeCreditBalance + course.creditsEarned;

  const updated: StudentAbcRecord = {
    ...record,
    totalCreditsAccumulated: newAccumulated,
    activeCreditBalance: newActiveBalance,
    courses: [...record.courses, newCourse]
  };

  return {
    ...updated,
    auditSha256: generateAbcSeal(updated)
  };
}

/**
 * Redeem Banked Credits for NEP 2020 Multiple Exit Credential Award
 */
export function redeemCreditsForCredential(
  record: StudentAbcRecord,
  credentialTier: MeesCredentialTier,
  options?: { customRedeemCredits?: number; approvedByDean?: boolean }
): { success: boolean; record: StudentAbcRecord; redemption?: CreditRedemptionRecord; error?: string } {
  const minRequired = NEP_CREDIT_THRESHOLDS[credentialTier];
  const creditsToRedeem = options?.customRedeemCredits ?? minRequired;

  if (record.activeCreditBalance < creditsToRedeem) {
    return {
      success: false,
      record,
      error: `Insufficient active credit balance: Has ${record.activeCreditBalance} credits, but requires ${creditsToRedeem} for ${credentialTier.replace(/_/g, ' ')}`
    };
  }

  const now = new Date().toISOString();
  const redemptionId = `RDM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const certSerial = `CERT-${new Date().getFullYear()}-${credentialTier.slice(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`;

  const redemption: CreditRedemptionRecord = {
    redemptionId,
    credentialTier,
    creditsRedeemed: creditsToRedeem,
    minimumCreditsRequired: minRequired,
    requestDate: now.split('T')[0],
    approvalDate: now.split('T')[0],
    approvedByDean: options?.approvedByDean ?? true,
    certificateSerialNumber: certSerial,
    status: 'APPROVED'
  };

  const newRedeemedTotal = record.totalCreditsRedeemed + creditsToRedeem;
  const newActiveBalance = record.activeCreditBalance - creditsToRedeem;
  const isDegreeClosed = credentialTier === 'BACHELORS_DEGREE' || credentialTier === 'BACHELORS_HONOURS';

  const updated: StudentAbcRecord = {
    ...record,
    totalCreditsRedeemed: newRedeemedTotal,
    activeCreditBalance: newActiveBalance,
    redemptions: [redemption, ...record.redemptions],
    syncStatus: isDegreeClosed ? 'DEGREE_AWARDED_CLOSED' : 'CREDIT_REDEMPTION_PROCESSING'
  };

  return {
    success: true,
    record: { ...updated, auditSha256: generateAbcSeal(updated) },
    redemption
  };
}

/**
 * Export official CSV of Central University Academic Bank of Credits
 */
export function exportAcademicBankLedgerCSV(records: StudentAbcRecord[]): string {
  const headers = [
    'ABC Record ID',
    'Student ID',
    'Student Name',
    'APAAR ID',
    'Program',
    'Department',
    'Total Credits Accumulated',
    'Total Credits Redeemed',
    'Active Credit Balance',
    'Eligible Highest Credential',
    'Digilocker Sync Status',
    'Digilocker URI',
    'Audit SHA-256'
  ];

  const rows = records.map(r => {
    const mees = evaluateMeesEligibility(r.activeCreditBalance);
    return [
      r.abcRecordId,
      r.studentId,
      `"${r.studentName}"`,
      r.apaarId,
      `"${r.programName}"`,
      r.department,
      r.totalCreditsAccumulated,
      r.totalCreditsRedeemed,
      r.activeCreditBalance,
      mees.highestCredential ?? 'BELOW_CERTIFICATE_THRESHOLD',
      r.syncStatus,
      r.digilockerUri || 'N/A',
      r.auditSha256
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Sample initial dataset for Central Academic Bank of Credits
 */
export const SAMPLE_ABC_RECORDS: StudentAbcRecord[] = [
  createStudentAbcRecord({
    studentId: '2023-BTECH-CS-041',
    studentName: 'Aaditya Narayan Swaminathan',
    apaarId: '982144018923',
    programName: 'B.Tech in Artificial Intelligence & Data Science',
    department: 'Computer Science',
    admissionYear: 2023,
    initialCourses: [
      {
        courseCode: 'CS101',
        courseTitle: 'Foundations of Computer Systems & Data Structures',
        creditsEarned: 4,
        semester: 1,
        gradeEarned: 'O',
        academicYear: '2023-2024',
        awardingInstitute: 'PinIT Central University',
        institutionCode: 'U-0123',
        isExternalTransfer: false,
        completionDate: '2023-12-15'
      },
      {
        courseCode: 'CS201',
        courseTitle: 'Design and Analysis of Algorithms',
        creditsEarned: 4,
        semester: 2,
        gradeEarned: 'A+',
        academicYear: '2023-2024',
        awardingInstitute: 'PinIT Central University',
        institutionCode: 'U-0123',
        isExternalTransfer: false,
        completionDate: '2024-05-20'
      },
      {
        courseCode: 'CS301',
        courseTitle: 'Machine Learning & Statistical Pattern Recognition',
        creditsEarned: 4,
        semester: 3,
        gradeEarned: 'O',
        academicYear: '2024-2025',
        awardingInstitute: 'IIT Madras (NPTEL Transfer)',
        institutionCode: 'CFTI-001',
        isExternalTransfer: true,
        completionDate: '2024-11-25'
      },
      {
        courseCode: 'CS401',
        courseTitle: 'Deep Neural Architectures & LLM Engineering',
        creditsEarned: 4,
        semester: 4,
        gradeEarned: 'O',
        academicYear: '2024-2025',
        awardingInstitute: 'PinIT Central University',
        institutionCode: 'U-0123',
        isExternalTransfer: false,
        completionDate: '2025-05-18'
      },
      {
        courseCode: 'CS-CAP-01',
        courseTitle: 'Junior Industry Internship & Capstone Practicum',
        creditsEarned: 26,
        semester: 5,
        gradeEarned: 'A+',
        academicYear: '2025-2026',
        awardingInstitute: 'PinIT Central University',
        institutionCode: 'U-0123',
        isExternalTransfer: false,
        completionDate: '2025-12-10'
      }
    ]
  }),
  createStudentAbcRecord({
    studentId: '2022-BTECH-EE-089',
    studentName: 'Meenakshi Sundaram',
    apaarId: '871299031124',
    programName: 'B.Tech in Electrical & Smart Grid Engineering',
    department: 'Electrical Engineering',
    admissionYear: 2022,
    initialCourses: [
      {
        courseCode: 'EE101',
        courseTitle: 'Network Theory and Circuit Analysis',
        creditsEarned: 20,
        semester: 1,
        gradeEarned: 'A+',
        academicYear: '2022-2023',
        awardingInstitute: 'PinIT Central University',
        institutionCode: 'U-0123',
        isExternalTransfer: false,
        completionDate: '2022-12-15'
      },
      {
        courseCode: 'EE201',
        courseTitle: 'Electrical Machines & Control Systems',
        creditsEarned: 22,
        semester: 2,
        gradeEarned: 'A',
        academicYear: '2022-2023',
        awardingInstitute: 'PinIT Central University',
        institutionCode: 'U-0123',
        isExternalTransfer: false,
        completionDate: '2023-05-20'
      },
      {
        courseCode: 'EE301',
        courseTitle: 'Power Electronics & EV Powertrains',
        creditsEarned: 42,
        semester: 3,
        gradeEarned: 'O',
        academicYear: '2023-2024',
        awardingInstitute: 'PinIT Central University',
        institutionCode: 'U-0123',
        isExternalTransfer: false,
        completionDate: '2024-05-15'
      }
    ]
  })
];
