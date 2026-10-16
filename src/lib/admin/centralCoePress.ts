/**
 * Central University Confidential Examination Printing Press & Question Paper Custody Engine
 * Statutory Compliance: Controller of Examinations (CoE) Confidential Press Operating Manual,
 * Ordinance for the Conduct of University Examinations & UGC Fair Examination Security Norms.
 *
 * Platform: PinIT Career OS - Campus Administration Platform
 * Zero-Collision Invariant: Pure Branch C administrative governance.
 */

import { createHash } from 'crypto';

export type ExamSession =
  | 'END_SEM_SPRING_2026'
  | 'END_SEM_AUTUMN_2026'
  | 'ANNUAL_SUMMER_2026'
  | 'SUPPLEMENTARY_2026';

export type CustodyStage =
  | 'JOB_INITIALIZED'
  | 'CONFIDENTIAL_PRINTING'
  | 'PACKETS_SEALED'
  | 'DOUBLE_LOCK_VAULT'
  | 'DISPATCHED_TO_CENTERS'
  | 'VERIFIED_AT_CENTER'
  | 'EMERGENCY_QUARANTINED';

export type PaperSet = 'SET_A' | 'SET_B' | 'SET_C';

export interface DoubleLockVerification {
  custodianOneId: string; // e.g. COE-CONF-01 (Joint Controller Confidential)
  custodianOneName: string;
  custodianOneKeyVerified: boolean;
  custodianTwoId: string; // e.g. CSO-SEC-09 (Chief Security Officer / Asst Registrar)
  custodianTwoName: string;
  custodianTwoKeyVerified: boolean;
  verifiedTimestamp: string;
  vaultLocation: string; // e.g. VAULT-ROOM-A-BAY-3
}

export interface CenterAllocation {
  centerCode: string; // e.g. CENT-01
  centerName: string; // e.g. Main Science Block Examination Hall
  superintendentName: string;
  candidateCount: number;
  packetsAllocated: number; // 25 candidates per waterproof tamper-evident packet
  packetTrackingCodes: string[];
  receivedVerified: boolean;
  centerVerificationTimestamp?: string;
}

export interface EmergencyFallbackEvent {
  compromisedSet: PaperSet;
  fallbackSetActivated: PaperSet;
  reason: string;
  reportedBy: string;
  authorizedByCoE: string;
  triggeredTimestamp: string;
  allCentersNotified: boolean;
}

export interface CoePressJob {
  jobId: string;
  packetBarcodeSeal: string; // QPB-[YEAR]-[PAPER]-[HEX6]
  examSession: ExamSession;
  courseCode: string; // e.g. CS401, EE202, MA101
  courseTitle: string;
  examDate: string; // YYYY-MM-DD
  examSlot: 'FORENOON_0930_1230' | 'AFTERNOON_1400_1700';
  activeSet: PaperSet;
  availableSets: PaperSet[];
  totalCandidates: number;
  totalCopiesPrinted: number; // Candidates + 5% emergency buffer
  packetsCount: number;
  stage: CustodyStage;
  doubleLockVerification?: DoubleLockVerification;
  centerAllocations: CenterAllocation[];
  fallbackHistory: EmergencyFallbackEvent[];
  cryptographicSeal?: string; // SHA-256 custody seal
  remarks?: string;
  lastUpdated: string;
}

/**
 * Standard packet sizing: 25 candidate papers per tamper-evident envelope
 * Emergency buffer: 5% extra copies printed and sealed in separate buffer envelopes
 */
export const CANDIDATES_PER_PACKET = 25;
export const BUFFER_PERCENTAGE = 0.05;

/**
 * Generate unique tamper-evident barcode seal: QPB-[YEAR]-[PAPER]-[HEX6]
 */
export function generatePacketBarcodeSeal(paperCode: string, year: number = new Date().getFullYear()): string {
  const sanitizedCode = paperCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `QPB-${year}-${sanitizedCode}-${randomHex}`;
}

/**
 * Calculate packet counts and print run with emergency buffer
 */
export function calculatePrintRunMetrics(candidateCount: number): {
  packetsCount: number;
  bufferCopies: number;
  totalCopiesPrinted: number;
} {
  if (candidateCount <= 0) {
    throw new Error('Candidate count must be strictly greater than 0.');
  }
  const bufferCopies = Math.max(5, Math.ceil(candidateCount * BUFFER_PERCENTAGE));
  const totalCopiesPrinted = candidateCount + bufferCopies;
  const packetsCount = Math.ceil(totalCopiesPrinted / CANDIDATES_PER_PACKET);

  return {
    packetsCount,
    bufferCopies,
    totalCopiesPrinted,
  };
}

/**
 * Validate dual-custodian double-lock authorization
 * Both custodian keys must be explicitly present, verified, and belong to distinct officers.
 */
export function validateDoubleLockAuthorization(verification: DoubleLockVerification): {
  valid: boolean;
  reason?: string;
} {
  if (!verification.custodianOneKeyVerified || !verification.custodianTwoKeyVerified) {
    return {
      valid: false,
      reason: 'Dual-lock breach: Both Custodian 1 (CoE) and Custodian 2 (Security) must verify physical keys.',
    };
  }

  if (verification.custodianOneId === verification.custodianTwoId) {
    return {
      valid: false,
      reason: 'Segregation of duties violation: Custodian 1 and Custodian 2 cannot be the same individual.',
    };
  }

  if (!verification.vaultLocation || verification.vaultLocation.trim().length === 0) {
    return {
      valid: false,
      reason: 'Invalid vault location reference.',
    };
  }

  return { valid: true };
}

/**
 * Generate tamper-proof SHA-256 seal for CoE Press custody
 */
export function generateCoePressCustodySeal(job: Omit<CoePressJob, 'cryptographicSeal'>): string {
  const canonicalPayload = [
    job.jobId,
    job.packetBarcodeSeal,
    job.examSession,
    job.courseCode,
    job.examDate,
    job.examSlot,
    job.activeSet,
    job.totalCandidates,
    job.totalCopiesPrinted,
    job.packetsCount,
    job.stage,
    job.doubleLockVerification?.custodianOneId || 'NO_CUST1',
    job.doubleLockVerification?.custodianTwoId || 'NO_CUST2',
    job.fallbackHistory.length,
    job.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Initialize a new CoE Confidential Printing Press Job
 */
export function createCoePressJob(params: {
  courseCode: string;
  courseTitle: string;
  examSession: ExamSession;
  examDate: string;
  examSlot: 'FORENOON_0930_1230' | 'AFTERNOON_1400_1700';
  totalCandidates: number;
  centerAllocations: {
    centerCode: string;
    centerName: string;
    superintendentName: string;
    candidateCount: number;
  }[];
  remarks?: string;
}): CoePressJob {
  const { packetsCount, bufferCopies, totalCopiesPrinted } = calculatePrintRunMetrics(params.totalCandidates);
  const barcodeSeal = generatePacketBarcodeSeal(params.courseCode);
  const now = new Date().toISOString();

  // Distribute packet tracking barcodes across centers
  let packetCounter = 1;
  const allocations: CenterAllocation[] = params.centerAllocations.map((c) => {
    const centerPackets = Math.ceil(c.candidateCount / CANDIDATES_PER_PACKET);
    const codes: string[] = [];
    for (let i = 0; i < centerPackets; i++) {
      codes.push(`${barcodeSeal}-PKT${String(packetCounter).padStart(3, '0')}`);
      packetCounter++;
    }
    return {
      centerCode: c.centerCode,
      centerName: c.centerName,
      superintendentName: c.superintendentName,
      candidateCount: c.candidateCount,
      packetsAllocated: centerPackets,
      packetTrackingCodes: codes,
      receivedVerified: false,
    };
  });

  const baseJob: Omit<CoePressJob, 'cryptographicSeal'> = {
    jobId: `CPJ-${Date.now().toString(36).toUpperCase()}`,
    packetBarcodeSeal: barcodeSeal,
    examSession: params.examSession,
    courseCode: params.courseCode.toUpperCase(),
    courseTitle: params.courseTitle,
    examDate: params.examDate,
    examSlot: params.examSlot,
    activeSet: 'SET_A',
    availableSets: ['SET_A', 'SET_B', 'SET_C'],
    totalCandidates: params.totalCandidates,
    totalCopiesPrinted,
    packetsCount,
    stage: 'JOB_INITIALIZED',
    centerAllocations: allocations,
    fallbackHistory: [],
    remarks: params.remarks || `Confidential printing scheduled for ${params.courseCode} with ${bufferCopies} buffer copies.`,
    lastUpdated: now,
  };

  const cryptographicSeal = generateCoePressCustodySeal(baseJob);
  return { ...baseJob, cryptographicSeal };
}

/**
 * Transition job into double-lock vault
 */
export function secureInDoubleLockVault(
  job: CoePressJob,
  verification: DoubleLockVerification
): CoePressJob {
  const auth = validateDoubleLockAuthorization(verification);
  if (!auth.valid) {
    throw new Error(auth.reason);
  }

  const updated: Omit<CoePressJob, 'cryptographicSeal'> = {
    ...job,
    stage: 'DOUBLE_LOCK_VAULT',
    doubleLockVerification: {
      ...verification,
      verifiedTimestamp: new Date().toISOString(),
    },
    lastUpdated: new Date().toISOString(),
  };

  const cryptographicSeal = generateCoePressCustodySeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Dispatch confidential packets to examination centers with armed escort
 */
export function dispatchPacketsToCenters(
  job: CoePressJob,
  verification: DoubleLockVerification
): CoePressJob {
  if (job.stage !== 'DOUBLE_LOCK_VAULT') {
    throw new Error(`Invalid custody transition: Job must be in DOUBLE_LOCK_VAULT prior to dispatch (current: ${job.stage}).`);
  }

  const auth = validateDoubleLockAuthorization(verification);
  if (!auth.valid) {
    throw new Error(`Dispatch unauthorized: ${auth.reason}`);
  }

  const updated: Omit<CoePressJob, 'cryptographicSeal'> = {
    ...job,
    stage: 'DISPATCHED_TO_CENTERS',
    doubleLockVerification: {
      ...verification,
      verifiedTimestamp: new Date().toISOString(),
    },
    lastUpdated: new Date().toISOString(),
  };

  const cryptographicSeal = generateCoePressCustodySeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Record center superintendent physical packet verification
 */
export function verifyCenterPacketReceipt(
  job: CoePressJob,
  centerCode: string,
  superintendentName: string
): CoePressJob {
  const now = new Date().toISOString();
  let found = false;

  const updatedAllocations = job.centerAllocations.map((alloc) => {
    if (alloc.centerCode === centerCode) {
      found = true;
      return {
        ...alloc,
        receivedVerified: true,
        superintendentName,
        centerVerificationTimestamp: now,
      };
    }
    return alloc;
  });

  if (!found) {
    throw new Error(`Center code ${centerCode} not found in job allocations.`);
  }

  const allVerified = updatedAllocations.every((a) => a.receivedVerified);
  const nextStage: CustodyStage = allVerified ? 'VERIFIED_AT_CENTER' : job.stage;

  const updated: Omit<CoePressJob, 'cryptographicSeal'> = {
    ...job,
    centerAllocations: updatedAllocations,
    stage: nextStage,
    lastUpdated: now,
  };

  const cryptographicSeal = generateCoePressCustodySeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Emergency Fallback Activation:
 * If an examination set (e.g. Set A) is reported compromised or leaked,
 * automatically quarantine the compromised set and activate the next reserve set (Set B or Set C).
 */
export function activateEmergencyFallback(
  job: CoePressJob,
  params: {
    compromisedSet: PaperSet;
    reason: string;
    reportedBy: string;
    authorizedByCoE: string;
  }
): CoePressJob {
  if (job.activeSet !== params.compromisedSet) {
    throw new Error(`Active set mismatch: Current active set is ${job.activeSet}, cannot quarantine ${params.compromisedSet}.`);
  }

  // Determine next reserve set
  const remainingSets = job.availableSets.filter((s) => s !== params.compromisedSet);
  if (remainingSets.length === 0) {
    throw new Error('Critical Security Alert: Zero reserve fallback sets remain in double-lock vault.');
  }

  const fallbackSetActivated = remainingSets[0];
  const now = new Date().toISOString();

  const fallbackEvent: EmergencyFallbackEvent = {
    compromisedSet: params.compromisedSet,
    fallbackSetActivated,
    reason: params.reason,
    reportedBy: params.reportedBy,
    authorizedByCoE: params.authorizedByCoE,
    triggeredTimestamp: now,
    allCentersNotified: true,
  };

  const updated: Omit<CoePressJob, 'cryptographicSeal'> = {
    ...job,
    activeSet: fallbackSetActivated,
    availableSets: remainingSets,
    stage: 'EMERGENCY_QUARANTINED',
    fallbackHistory: [...job.fallbackHistory, fallbackEvent],
    remarks: `EMERGENCY CONTINGENCY: ${params.compromisedSet} quarantined. Fallback ${fallbackSetActivated} activated under CoE authorization. Reason: ${params.reason}`,
    lastUpdated: now,
  };

  const cryptographicSeal = generateCoePressCustodySeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Export CoE confidential press audit ledger as statutory CSV
 */
export function exportCoePressAuditCSV(jobs: CoePressJob[]): string {
  const headers = [
    'Job ID',
    'Barcode Seal',
    'Exam Session',
    'Course Code',
    'Course Title',
    'Exam Date',
    'Slot',
    'Active Set',
    'Candidates',
    'Print Run',
    'Packets',
    'Custody Stage',
    'Custodian 1',
    'Custodian 2',
    'Vault Location',
    'Fallback Count',
    'Cryptographic Seal',
  ];

  const rows = jobs.map((j) => [
    `"${j.jobId}"`,
    `"${j.packetBarcodeSeal}"`,
    `"${j.examSession}"`,
    `"${j.courseCode}"`,
    `"${j.courseTitle.replace(/"/g, '""')}"`,
    `"${j.examDate}"`,
    `"${j.examSlot}"`,
    `"${j.activeSet}"`,
    j.totalCandidates,
    j.totalCopiesPrinted,
    j.packetsCount,
    `"${j.stage}"`,
    `"${j.doubleLockVerification?.custodianOneName || 'N/A'}"`,
    `"${j.doubleLockVerification?.custodianTwoName || 'N/A'}"`,
    `"${j.doubleLockVerification?.vaultLocation || 'N/A'}"`,
    j.fallbackHistory.length,
    `"${j.cryptographicSeal || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Seed demonstration datasets for CoE Press
 */
export const INITIAL_COE_PRESS_JOBS: CoePressJob[] = [
  {
    jobId: 'CPJ-2026-CS401',
    packetBarcodeSeal: 'QPB-2026-CS401-E4F9A1',
    examSession: 'END_SEM_SPRING_2026',
    courseCode: 'CS401',
    courseTitle: 'Advanced Distributed Operating Systems & Cloud Computing',
    examDate: '2026-05-12',
    examSlot: 'FORENOON_0930_1230',
    activeSet: 'SET_A',
    availableSets: ['SET_A', 'SET_B', 'SET_C'],
    totalCandidates: 320,
    totalCopiesPrinted: 336,
    packetsCount: 14,
    stage: 'VERIFIED_AT_CENTER',
    doubleLockVerification: {
      custodianOneId: 'COE-CONF-01',
      custodianOneName: 'Dr. Ramesh Sharma (Joint Controller Conf.)',
      custodianOneKeyVerified: true,
      custodianTwoId: 'CSO-SEC-04',
      custodianTwoName: 'Col. Vikram Rathore (Chief Security Officer)',
      custodianTwoKeyVerified: true,
      verifiedTimestamp: '2026-05-11T18:00:00Z',
      vaultLocation: 'STRONG-ROOM-A-BAY-1',
    },
    centerAllocations: [
      {
        centerCode: 'CENT-01',
        centerName: 'Main Science Complex Hall A',
        superintendentName: 'Prof. Ananya Sen',
        candidateCount: 180,
        packetsAllocated: 8,
        packetTrackingCodes: ['QPB-2026-CS401-PKT001', 'QPB-2026-CS401-PKT002', 'QPB-2026-CS401-PKT003'],
        receivedVerified: true,
        centerVerificationTimestamp: '2026-05-12T07:45:00Z',
      },
      {
        centerCode: 'CENT-02',
        centerName: 'North Campus Engineering Center',
        superintendentName: 'Dr. B. K. Verma',
        candidateCount: 140,
        packetsAllocated: 6,
        packetTrackingCodes: ['QPB-2026-CS401-PKT004', 'QPB-2026-CS401-PKT005', 'QPB-2026-CS401-PKT006'],
        receivedVerified: true,
        centerVerificationTimestamp: '2026-05-12T08:00:00Z',
      },
    ],
    fallbackHistory: [],
    cryptographicSeal: 'e83a6b5791c890f5b1287e0fa728c942918451892ef0321a5c683b548bce9123',
    remarks: 'Dispatched under armed university escort and verified intact by Center Superintendents.',
    lastUpdated: '2026-05-12T08:05:00Z',
  },
  {
    jobId: 'CPJ-2026-EE202',
    packetBarcodeSeal: 'QPB-2026-EE202-B83C72',
    examSession: 'END_SEM_SPRING_2026',
    courseCode: 'EE202',
    courseTitle: 'Signals, Systems & Digital Signal Processing',
    examDate: '2026-05-14',
    examSlot: 'AFTERNOON_1400_1700',
    activeSet: 'SET_A',
    availableSets: ['SET_A', 'SET_B', 'SET_C'],
    totalCandidates: 240,
    totalCopiesPrinted: 252,
    packetsCount: 11,
    stage: 'DOUBLE_LOCK_VAULT',
    doubleLockVerification: {
      custodianOneId: 'COE-CONF-01',
      custodianOneName: 'Dr. Ramesh Sharma (Joint Controller Conf.)',
      custodianOneKeyVerified: true,
      custodianTwoId: 'CSO-SEC-04',
      custodianTwoName: 'Col. Vikram Rathore (Chief Security Officer)',
      custodianTwoKeyVerified: true,
      verifiedTimestamp: '2026-05-13T16:30:00Z',
      vaultLocation: 'STRONG-ROOM-A-BAY-4',
    },
    centerAllocations: [
      {
        centerCode: 'CENT-01',
        centerName: 'Main Science Complex Hall B',
        superintendentName: 'Prof. S. K. Gupta',
        candidateCount: 120,
        packetsAllocated: 5,
        packetTrackingCodes: ['QPB-2026-EE202-PKT001', 'QPB-2026-EE202-PKT002'],
        receivedVerified: false,
      },
      {
        centerCode: 'CENT-03',
        centerName: 'South Campus Polytechnic Hall',
        superintendentName: 'Dr. Preeti Deshmukh',
        candidateCount: 120,
        packetsAllocated: 6,
        packetTrackingCodes: ['QPB-2026-EE202-PKT003', 'QPB-2026-EE202-PKT004'],
        receivedVerified: false,
      },
    ],
    fallbackHistory: [],
    cryptographicSeal: '31cb54091f893e2576b91c109404285918ca12850f1190bc20857361a9bc3829',
    remarks: 'Waterproof sealed packets placed in double-lock vault awaiting 06:00 dispatch.',
    lastUpdated: '2026-05-13T17:00:00Z',
  },
  {
    jobId: 'CPJ-2026-MA101',
    packetBarcodeSeal: 'QPB-2026-MA101-9F3112',
    examSession: 'END_SEM_SPRING_2026',
    courseCode: 'MA101',
    courseTitle: 'Multivariable Calculus, Linear Algebra & Differential Equations',
    examDate: '2026-05-16',
    examSlot: 'FORENOON_0930_1230',
    activeSet: 'SET_B',
    availableSets: ['SET_B', 'SET_C'],
    totalCandidates: 650,
    totalCopiesPrinted: 683,
    packetsCount: 28,
    stage: 'EMERGENCY_QUARANTINED',
    doubleLockVerification: {
      custodianOneId: 'COE-CONF-01',
      custodianOneName: 'Dr. Ramesh Sharma (Joint Controller Conf.)',
      custodianOneKeyVerified: true,
      custodianTwoId: 'CSO-SEC-04',
      custodianTwoName: 'Col. Vikram Rathore (Chief Security Officer)',
      custodianTwoKeyVerified: true,
      verifiedTimestamp: '2026-05-14T11:00:00Z',
      vaultLocation: 'STRONG-ROOM-B-BAY-2',
    },
    centerAllocations: [
      {
        centerCode: 'CENT-01',
        centerName: 'Main Science Complex Hall A & B',
        superintendentName: 'Prof. Ananya Sen',
        candidateCount: 350,
        packetsAllocated: 15,
        packetTrackingCodes: ['QPB-2026-MA101-PKT001', 'QPB-2026-MA101-PKT002'],
        receivedVerified: false,
      },
      {
        centerCode: 'CENT-02',
        centerName: 'North Campus Engineering Hall',
        superintendentName: 'Dr. B. K. Verma',
        candidateCount: 300,
        packetsAllocated: 13,
        packetTrackingCodes: ['QPB-2026-MA101-PKT003', 'QPB-2026-MA101-PKT004'],
        receivedVerified: false,
      },
    ],
    fallbackHistory: [
      {
        compromisedSet: 'SET_A',
        fallbackSetActivated: 'SET_B',
        reason: 'Pre-examination security breach report received from external printing courier. Set A invalidated.',
        reportedBy: 'Vigilance Officer (Investigation Unit)',
        authorizedByCoE: 'Prof. M. K. Narayanan (Controller of Examinations)',
        triggeredTimestamp: '2026-05-15T09:15:00Z',
        allCentersNotified: true,
      },
    ],
    cryptographicSeal: 'b45c22998a101f35832a59ef091a32948c21a4f00b9123847e19374028bcfa91',
    remarks: 'EMERGENCY CONTINGENCY: SET_A quarantined. Fallback SET_B activated under CoE authorization.',
    lastUpdated: '2026-05-15T09:30:00Z',
  },
];
