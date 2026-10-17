/**
 * Faculty Academic Book Publishing Royalty & Text Translation Grant Ledger Engine
 * 
 * Statutory & Regulatory Framework:
 * - UGC Career Advancement Scheme (CAS Table 2 Category 2 Research Score for Books)
 *   - International Peer-Reviewed Monograph: 12 CAS Points
 *   - National Academic Textbook with ISBN: 10 CAS Points
 *   - Chapter in Edited Volume: 5 CAS Points
 *   - Academic Translation of Reference Book into Indian Language: 8 CAS Points
 * - Indian Copyright Act 1957 (as amended) & Section 194J Income Tax Act (10% Statutory TDS on Royalties)
 * - NEP 2020 Bharatiya Bhasha Textbook Writing & Higher Education Translation Grant Scheme
 * - Central University Press Subsidized Publishing vs Commercial Publishing Royalty Distributions
 */

import { createHash } from 'crypto';

export type BookPublicationType = 
  | 'INTERNATIONAL_PEER_REVIEWED_MONOGRAPH'
  | 'NATIONAL_ACADEMIC_TEXTBOOK'
  | 'EDITED_VOLUME_CHAPTER'
  | 'TRANSLATED_INDIAN_LANGUAGE_WORK';

export type BookPublishingStatus = 
  | 'MANUSCRIPT_ACCEPTED'
  | 'PUBLISHED_IN_CIRCULATION'
  | 'ROYALTY_ACTIVE'
  | 'OUT_OF_PRINT_ARCHIVED';

export interface RoyaltyCycle {
  cycleId: string;
  cyclePeriod: string; // e.g. "2025-2026 H1"
  copiesSold: number;
  grossSalesInr: number;
  royaltyPercent: number; // e.g. 12%
  grossRoyaltyEarnedInr: number;
  tdsDeductedInr: number; // 10% statutory TDS under Sec 194J
  netDisbursedInr: number;
  disbursementDate?: string;
  payoutReferenceNumber?: string;
  status: 'CALCULATED_PENDING' | 'DISBURSED_CLEARED';
}

export interface TranslationGrant {
  grantSanctionNumber: string;
  sourceLanguage: string;
  targetIndianLanguage: string;
  sanctionedAmountInr: number; // Max ₹2,50,000 under NEP 2020 scheme
  disbursedAmountInr: number;
  milestone1Disbursed: boolean; // 50% on first-half manuscript
  milestone2Disbursed: boolean; // 50% on final printed publication
  approvalDate: string;
}

export interface FacultyBookPublishingRecord {
  bookRecordId: string; // Token format: PUB-[YEAR]-[DEPT]-[HEX6]
  facultyAuthorId: string;
  facultyAuthorName: string;
  department: string;
  coAuthors: { authorName: string; institutionalAffiliation: string; royaltyRatio: number }[];
  bookTitle: string;
  isbnNumber: string; // 13-digit standard ISBN
  publisherName: string;
  publicationType: BookPublicationType;
  ugcCasPoints: number;
  royaltyAgreementPercent: number;
  isUniversityPressSubsidized: boolean;
  royaltyCycles: RoyaltyCycle[];
  translationGrant?: TranslationGrant;
  totalRoyaltyEarnedInr: number;
  totalCopiesSold: number;
  publicationYear: number;
  status: BookPublishingStatus;
  createdTimestamp: string;
  auditSha256: string;
}

// Statutory UGC CAS Table 2 Category 2 API Points Allocation
export const UGC_CAS_BOOK_POINTS: Record<BookPublicationType, number> = {
  INTERNATIONAL_PEER_REVIEWED_MONOGRAPH: 12,
  NATIONAL_ACADEMIC_TEXTBOOK: 10,
  TRANSLATED_INDIAN_LANGUAGE_WORK: 8,
  EDITED_VOLUME_CHAPTER: 5
};

// Section 194J Income Tax Act Statutory TDS Rate on Book Royalties
export const STATUTORY_ROYALTY_TDS_PERCENT = 10;

/**
 * Validate standard 13-digit ISBN format
 */
export function validateIsbn13(isbn: string): boolean {
  const sanitized = isbn.replace(/[-\s]/g, '');
  return /^(978|979)\d{10}$/.test(sanitized);
}

/**
 * Generate cryptographic SHA-256 seal for Faculty Book Publishing record
 */
export function generateBookPublishingSeal(record: Omit<FacultyBookPublishingRecord, 'auditSha256'>): string {
  const payload = [
    record.bookRecordId,
    record.facultyAuthorId,
    record.isbnNumber,
    record.publicationType,
    record.ugcCasPoints,
    record.totalRoyaltyEarnedInr,
    record.totalCopiesSold,
    record.status,
    record.royaltyCycles.length,
    record.translationGrant ? record.translationGrant.sanctionedAmountInr : 'NO_GRANT'
  ].join('|');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Format statutory unique book publication token
 */
export function formatBookRecordId(department: string, year: number = 2026): string {
  const deptCode = department.replace(/[^A-Z]/gi, '').substring(0, 4).toUpperCase() || 'PUB';
  const hex = createHash('sha256')
    .update(`${department}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();
  return `PUB-${year}-${deptCode}-${hex}`;
}

/**
 * Create a new Faculty Academic Book Publishing Record
 */
export function createBookPublishingRecord(params: {
  facultyAuthorId: string;
  facultyAuthorName: string;
  department: string;
  coAuthors?: { authorName: string; institutionalAffiliation: string; royaltyRatio: number }[];
  bookTitle: string;
  isbnNumber: string;
  publisherName: string;
  publicationType: BookPublicationType;
  royaltyAgreementPercent: number;
  isUniversityPressSubsidized?: boolean;
  publicationYear?: number;
  year?: number;
}): FacultyBookPublishingRecord {
  if (!validateIsbn13(params.isbnNumber)) {
    throw new Error(`Invalid ISBN-13 format: Must be standard 13 digits starting with 978 or 979.`);
  }

  const bookRecordId = formatBookRecordId(params.department, params.year);
  const now = new Date().toISOString();
  const ugcCasPoints = UGC_CAS_BOOK_POINTS[params.publicationType];

  const baseRecord: Omit<FacultyBookPublishingRecord, 'auditSha256'> = {
    bookRecordId,
    facultyAuthorId: params.facultyAuthorId,
    facultyAuthorName: params.facultyAuthorName,
    department: params.department,
    coAuthors: params.coAuthors || [],
    bookTitle: params.bookTitle,
    isbnNumber: params.isbnNumber,
    publisherName: params.publisherName,
    publicationType: params.publicationType,
    ugcCasPoints,
    royaltyAgreementPercent: params.royaltyAgreementPercent,
    isUniversityPressSubsidized: params.isUniversityPressSubsidized || false,
    royaltyCycles: [],
    totalRoyaltyEarnedInr: 0,
    totalCopiesSold: 0,
    publicationYear: params.publicationYear || new Date().getFullYear(),
    status: 'PUBLISHED_IN_CIRCULATION',
    createdTimestamp: now
  };

  const auditSha256 = generateBookPublishingSeal(baseRecord);
  return { ...baseRecord, auditSha256 };
}

/**
 * Record a biannual publisher royalty statement with 10% Section 194J TDS
 */
export function recordRoyaltyCycle(
  record: FacultyBookPublishingRecord,
  params: {
    cyclePeriod: string;
    copiesSold: number;
    grossSalesInr: number;
  }
): { record: FacultyBookPublishingRecord; cycle: RoyaltyCycle } {
  const grossRoyalty = Math.round(params.grossSalesInr * (record.royaltyAgreementPercent / 100));
  const tdsDeducted = Math.round(grossRoyalty * (STATUTORY_ROYALTY_TDS_PERCENT / 100));
  const netDisbursed = grossRoyalty - tdsDeducted;
  const cycleId = `ROY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const cycle: RoyaltyCycle = {
    cycleId,
    cyclePeriod: params.cyclePeriod,
    copiesSold: params.copiesSold,
    grossSalesInr: params.grossSalesInr,
    royaltyPercent: record.royaltyAgreementPercent,
    grossRoyaltyEarnedInr: grossRoyalty,
    tdsDeductedInr: tdsDeducted,
    netDisbursedInr: netDisbursed,
    status: 'CALCULATED_PENDING'
  };

  const updated: FacultyBookPublishingRecord = {
    ...record,
    totalCopiesSold: record.totalCopiesSold + params.copiesSold,
    totalRoyaltyEarnedInr: record.totalRoyaltyEarnedInr + grossRoyalty,
    status: 'ROYALTY_ACTIVE',
    royaltyCycles: [cycle, ...record.royaltyCycles]
  };

  return {
    record: { ...updated, auditSha256: generateBookPublishingSeal(updated) },
    cycle
  };
}

/**
 * Disburse calculated royalty to faculty author bank account
 */
export function disburseRoyaltyToAuthor(
  record: FacultyBookPublishingRecord,
  cycleId: string,
  payoutRef: string = `TXN-NEFT-${Date.now().toString().slice(-8)}`
): { success: boolean; record: FacultyBookPublishingRecord; error?: string } {
  const cycleIdx = record.royaltyCycles.findIndex(c => c.cycleId === cycleId);
  if (cycleIdx === -1) {
    return { success: false, record, error: `Royalty cycle ${cycleId} not found` };
  }

  const cycle = record.royaltyCycles[cycleIdx];
  if (cycle.status !== 'CALCULATED_PENDING') {
    return { success: false, record, error: `Cycle ${cycleId} is already disbursed` };
  }

  const updatedCycle: RoyaltyCycle = {
    ...cycle,
    status: 'DISBURSED_CLEARED',
    disbursementDate: new Date().toISOString().split('T')[0],
    payoutReferenceNumber: payoutRef
  };

  const updatedCycles = [...record.royaltyCycles];
  updatedCycles[cycleIdx] = updatedCycle;

  const updated: FacultyBookPublishingRecord = {
    ...record,
    royaltyCycles: updatedCycles
  };

  return {
    success: true,
    record: { ...updated, auditSha256: generateBookPublishingSeal(updated) }
  };
}

/**
 * Sanction NEP 2020 Indian Language Academic Translation Grant (up to ₹2,50,000)
 */
export function sanctionTranslationGrant(
  record: FacultyBookPublishingRecord,
  params: {
    sourceLanguage: string;
    targetIndianLanguage: string;
    sanctionedAmountInr: number;
  }
): { success: boolean; record: FacultyBookPublishingRecord; error?: string } {
  if (params.sanctionedAmountInr > 250000) {
    return {
      success: false,
      record,
      error: `Sanction rejected: Amount of ₹${params.sanctionedAmountInr} exceeds NEP 2020 Bhasha ceiling of ₹2,50,000`
    };
  }

  const sanctionNumber = `TRG-NEP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const grant: TranslationGrant = {
    grantSanctionNumber: sanctionNumber,
    sourceLanguage: params.sourceLanguage,
    targetIndianLanguage: params.targetIndianLanguage,
    sanctionedAmountInr: params.sanctionedAmountInr,
    disbursedAmountInr: 0,
    milestone1Disbursed: false,
    milestone2Disbursed: false,
    approvalDate: new Date().toISOString().split('T')[0]
  };

  const updated: FacultyBookPublishingRecord = {
    ...record,
    translationGrant: grant
  };

  return {
    success: true,
    record: { ...updated, auditSha256: generateBookPublishingSeal(updated) }
  };
}

/**
 * Disburse Translation Grant Milestone (Milestone 1: 50% draft, Milestone 2: 50% final published)
 */
export function disburseTranslationMilestone(
  record: FacultyBookPublishingRecord,
  milestone: 1 | 2
): { success: boolean; record: FacultyBookPublishingRecord; disbursedInr: number; error?: string } {
  if (!record.translationGrant) {
    return { success: false, record, disbursedInr: 0, error: 'No translation grant sanctioned for this book' };
  }

  const grant = record.translationGrant;
  const milestoneShare = grant.sanctionedAmountInr * 0.5;

  if (milestone === 1) {
    if (grant.milestone1Disbursed) {
      return { success: false, record, disbursedInr: 0, error: 'Milestone 1 already disbursed' };
    }

    const updatedGrant: TranslationGrant = {
      ...grant,
      milestone1Disbursed: true,
      disbursedAmountInr: grant.disbursedAmountInr + milestoneShare
    };

    const updated = { ...record, translationGrant: updatedGrant };
    return {
      success: true,
      record: { ...updated, auditSha256: generateBookPublishingSeal(updated) },
      disbursedInr: milestoneShare
    };
  } else {
    if (!grant.milestone1Disbursed) {
      return { success: false, record, disbursedInr: 0, error: 'Milestone 1 must be disbursed before Milestone 2' };
    }
    if (grant.milestone2Disbursed) {
      return { success: false, record, disbursedInr: 0, error: 'Milestone 2 already disbursed' };
    }

    const updatedGrant: TranslationGrant = {
      ...grant,
      milestone2Disbursed: true,
      disbursedAmountInr: grant.disbursedAmountInr + milestoneShare
    };

    const updated = { ...record, translationGrant: updatedGrant };
    return {
      success: true,
      record: { ...updated, auditSha256: generateBookPublishingSeal(updated) },
      disbursedInr: milestoneShare
    };
  }
}

/**
 * Export official CSV of Faculty Academic Book Publishing Ledger
 */
export function exportFacultyBookPublishingLedgerCSV(records: FacultyBookPublishingRecord[]): string {
  const headers = [
    'Book Record ID',
    'Faculty Author',
    'Department',
    'Book Title',
    'ISBN Number',
    'Publisher',
    'Publication Type',
    'UGC CAS Points',
    'Total Copies Sold',
    'Total Royalty Earned INR',
    'Status',
    'Translation Grant INR',
    'Audit SHA-256'
  ];

  const rows = records.map(r => {
    return [
      r.bookRecordId,
      `"${r.facultyAuthorName}"`,
      r.department,
      `"${r.bookTitle.replace(/"/g, '""')}"`,
      r.isbnNumber,
      `"${r.publisherName}"`,
      r.publicationType,
      r.ugcCasPoints,
      r.totalCopiesSold,
      r.totalRoyaltyEarnedInr.toFixed(2),
      r.status,
      r.translationGrant ? r.translationGrant.sanctionedAmountInr : 0,
      r.auditSha256
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Sample initial dataset for Faculty Academic Book Publishing
 */
export const SAMPLE_FACULTY_BOOKS: FacultyBookPublishingRecord[] = [
  createBookPublishingRecord({
    facultyAuthorId: 'FAC-CS-2018-081',
    facultyAuthorName: 'Dr. Nandini Ramanathan',
    department: 'Computer Science & AI',
    bookTitle: 'Foundations of Autonomous Agentic Architectures & Reinforcement Alignment',
    isbnNumber: '978-0-13-468599-1',
    publisherName: 'Springer Nature Academic Publishing',
    publicationType: 'INTERNATIONAL_PEER_REVIEWED_MONOGRAPH',
    royaltyAgreementPercent: 12,
    publicationYear: 2025
  }),
  createBookPublishingRecord({
    facultyAuthorId: 'FAC-EE-2016-092',
    facultyAuthorName: 'Dr. Vikramaditya Sen',
    department: 'Electrical Engineering',
    bookTitle: 'Modern Electric Vehicle Powertrain Control & Battery Dynamics',
    isbnNumber: '978-81-203-5120-2',
    publisherName: 'PHI Learning / Oxford University Press India',
    publicationType: 'NATIONAL_ACADEMIC_TEXTBOOK',
    royaltyAgreementPercent: 15,
    publicationYear: 2024
  })
];
