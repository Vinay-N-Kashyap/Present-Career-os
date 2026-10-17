/**
 * Faculty Academic Book Publication & Institutional Open-Access Repository Engine
 * Statutory Compliance: UGC Regulations on Minimum Qualifications for Appointment of Teachers
 * (Table 2 CAS Category 3 - Research and Academic Contributions: Books, Chapters & Edited Volumes).
 *
 * Platform: PinIT Career OS - Teacher Portal & Faculty Governance
 * Zero-Collision Invariant: Pure Branch C administrative and faculty governance.
 */

import { createHash } from 'crypto';

export type PublicationType =
  | 'INTERNATIONAL_MONOGRAPH_BOOK'
  | 'NATIONAL_MONOGRAPH_BOOK'
  | 'CHAPTER_IN_EDITED_BOOK'
  | 'EDITOR_INTERNATIONAL_BOOK'
  | 'EDITOR_NATIONAL_BOOK';

export type CreativeCommonsLicense =
  | 'CC_BY_4_0'
  | 'CC_BY_NC_4_0'
  | 'CC_BY_ND_4_0'
  | 'ALL_RIGHTS_RESERVED';

export interface AuthorContributor {
  authorId: string;
  fullName: string;
  institutionName: string;
  isFirstAuthor: boolean;
  isCorrespondingAuthor: boolean;
  allocatedApiScore: number;
}

export interface AcademicBookRecord {
  publicationId: string;
  trackingToken: string; // PUB-[YEAR]-[DEPT]-[HEX6]
  title: string;
  publicationType: PublicationType;
  department: string;
  publisherName: string;
  isbn: string;
  publicationYear: number;
  editionOrVolume?: string;
  totalApiPointsBase: number;
  authors: AuthorContributor[];
  isPeerReviewed: boolean;
  isOpenAccess: boolean;
  repositoryDoiUri?: string; // doi:10.campus.press/[YEAR]/[HEX6]
  license: CreativeCommonsLicense;
  cryptographicPublicationSeal?: string; // SHA-256 seal
  lastUpdated: string;
}

/**
 * Standard UGC Regulations Table 2 (Category 3) Base API Points:
 * - International Publisher Book: 12 points
 * - National Publisher Book: 10 points
 * - Chapter in Edited Book: 5 points
 * - Editor of International Book: 10 points
 * - Editor of National Book: 8 points
 */
export const UGC_API_POINTS_MATRIX: Record<PublicationType, number> = {
  INTERNATIONAL_MONOGRAPH_BOOK: 12,
  NATIONAL_MONOGRAPH_BOOK: 10,
  CHAPTER_IN_EDITED_BOOK: 5,
  EDITOR_INTERNATIONAL_BOOK: 10,
  EDITOR_NATIONAL_BOOK: 8,
};

/**
 * Validate standard ISBN-10 or ISBN-13 format
 */
export function validateIsbn(isbn: string): boolean {
  const clean = isbn.replace(/[-\s]/g, '');
  if (/^(978|979)?\d{9}[\dX]$/i.test(clean)) {
    return clean.length === 10 || clean.length === 13;
  }
  return false;
}

/**
 * Generate unique publication tracking token: PUB-[YEAR]-[DEPT]-[HEX6]
 */
export function generatePublicationToken(dept: string, year: number = new Date().getFullYear()): string {
  const cleanDept = dept.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'DEPT';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `PUB-${year}-${cleanDept}-${randomHex}`;
}

/**
 * Generate Institutional Digital Repository DOI URI: doi:10.campus.press/[YEAR]/[HEX6]
 */
export function generateRepositoryDoi(year: number = new Date().getFullYear()): string {
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `doi:10.campus.press/${year}/${randomHex}`;
}

/**
 * Calculate UGC CAS Co-Author Point Distribution:
 * - Single author: 100% of base points.
 * - Multiple authors:
 *   - First / Principal author and Corresponding author receive 70% of total points shared equally.
 *   - Other co-authors receive remaining 30% of total points shared equally.
 */
export function calculateAuthorPointShares(
  basePoints: number,
  authors: Omit<AuthorContributor, 'allocatedApiScore'>[]
): AuthorContributor[] {
  if (authors.length === 0) return [];

  if (authors.length === 1) {
    return [
      {
        ...authors[0],
        allocatedApiScore: Number(basePoints.toFixed(2)),
      },
    ];
  }

  // Identify principal authors (First or Corresponding)
  const principalAuthors = authors.filter((a) => a.isFirstAuthor || a.isCorrespondingAuthor);
  const otherAuthors = authors.filter((a) => !a.isFirstAuthor && !a.isCorrespondingAuthor);

  // If none designated as principal, default first author as principal
  let finalPrincipals = principalAuthors;
  let finalOthers = otherAuthors;

  if (finalPrincipals.length === 0) {
    finalPrincipals = [authors[0]];
    finalOthers = authors.slice(1);
  }

  const pool70 = basePoints * 0.7;
  const pool30 = basePoints * 0.3;

  const scorePerPrincipal = finalPrincipals.length > 0 ? pool70 / finalPrincipals.length : 0;
  const scorePerOther = finalOthers.length > 0 ? pool30 / finalOthers.length : 0;

  return authors.map((a) => {
    const isPrincipal = finalPrincipals.some((p) => p.authorId === a.authorId);
    return {
      ...a,
      allocatedApiScore: Number((isPrincipal ? scorePerPrincipal : scorePerOther).toFixed(2)),
    };
  });
}

/**
 * Generate tamper-proof SHA-256 seal for academic publication record
 */
export function generatePublicationSeal(
  record: Omit<AcademicBookRecord, 'cryptographicPublicationSeal'>
): string {
  const canonicalPayload = [
    record.publicationId,
    record.trackingToken,
    record.title,
    record.publicationType,
    record.publisherName,
    record.isbn,
    record.publicationYear,
    record.totalApiPointsBase,
    record.authors.length,
    record.isOpenAccess,
    record.repositoryDoiUri || 'NO_DOI',
    record.license,
    record.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Register a new academic book / chapter publication
 */
export function registerAcademicPublication(params: {
  title: string;
  publicationType: PublicationType;
  department: string;
  publisherName: string;
  isbn: string;
  publicationYear: number;
  editionOrVolume?: string;
  isPeerReviewed: boolean;
  isOpenAccess: boolean;
  license?: CreativeCommonsLicense;
  authors: Omit<AuthorContributor, 'allocatedApiScore'>[];
}): AcademicBookRecord {
  if (!params.title.trim()) {
    throw new Error('Publication title cannot be blank.');
  }

  if (!validateIsbn(params.isbn)) {
    throw new Error(`Invalid ISBN '${params.isbn}': Must be a valid 10-digit or 13-digit standard ISBN.`);
  }

  if (params.authors.length === 0) {
    throw new Error('At least 1 author/contributor must be credited.');
  }

  const basePoints = UGC_API_POINTS_MATRIX[params.publicationType];
  const computedAuthors = calculateAuthorPointShares(basePoints, params.authors);
  const trackingToken = generatePublicationToken(params.department, params.publicationYear);
  const repositoryDoiUri = params.isOpenAccess ? generateRepositoryDoi(params.publicationYear) : undefined;
  const now = new Date().toISOString();

  const baseRecord: Omit<AcademicBookRecord, 'cryptographicPublicationSeal'> = {
    publicationId: `PUB-${Date.now().toString(36).toUpperCase()}`,
    trackingToken,
    title: params.title.trim(),
    publicationType: params.publicationType,
    department: params.department,
    publisherName: params.publisherName.trim(),
    isbn: params.isbn.trim(),
    publicationYear: params.publicationYear,
    editionOrVolume: params.editionOrVolume?.trim(),
    totalApiPointsBase: basePoints,
    authors: computedAuthors,
    isPeerReviewed: params.isPeerReviewed,
    isOpenAccess: params.isOpenAccess,
    repositoryDoiUri,
    license: params.license || 'CC_BY_4_0',
    lastUpdated: now,
  };

  const cryptographicPublicationSeal = generatePublicationSeal(baseRecord);
  return { ...baseRecord, cryptographicPublicationSeal };
}

/**
 * Deposit publication to Institutional Digital Open-Access Repository
 */
export function depositToOpenAccessRepository(
  record: AcademicBookRecord,
  license: CreativeCommonsLicense = 'CC_BY_4_0'
): AcademicBookRecord {
  const repositoryDoiUri = record.repositoryDoiUri || generateRepositoryDoi(record.publicationYear);
  const now = new Date().toISOString();

  const updated: Omit<AcademicBookRecord, 'cryptographicPublicationSeal'> = {
    ...record,
    isOpenAccess: true,
    repositoryDoiUri,
    license,
    lastUpdated: now,
  };

  const cryptographicPublicationSeal = generatePublicationSeal(updated);
  return { ...updated, cryptographicPublicationSeal };
}

/**
 * Export Faculty Academic Book Publication Ledger as statutory CSV
 */
export function exportFacultyBookPublicationsCSV(records: AcademicBookRecord[]): string {
  const headers = [
    'Publication ID',
    'Tracking Token',
    'Title',
    'Type',
    'Department',
    'Publisher',
    'ISBN',
    'Year',
    'Base API Points',
    'First Author',
    'Total Authors',
    'Open Access',
    'Repository DOI',
    'License',
    'Cryptographic Seal',
  ];

  const rows = records.map((r) => {
    const firstAuthor = r.authors.find((a) => a.isFirstAuthor)?.fullName || r.authors[0]?.fullName || 'N/A';
    return [
      `"${r.publicationId}"`,
      `"${r.trackingToken}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.publicationType}"`,
      `"${r.department.replace(/"/g, '""')}"`,
      `"${r.publisherName.replace(/"/g, '""')}"`,
      `"${r.isbn}"`,
      r.publicationYear,
      r.totalApiPointsBase,
      `"${firstAuthor.replace(/"/g, '""')}"`,
      r.authors.length,
      r.isOpenAccess ? 'YES' : 'NO',
      `"${r.repositoryDoiUri || 'N/A'}"`,
      `"${r.license}"`,
      `"${r.cryptographicPublicationSeal || ''}"`,
    ];
  });

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Demonstration Academic Book Publications
 */
export const INITIAL_BOOK_PUBLICATIONS: AcademicBookRecord[] = [
  {
    publicationId: 'PUB-2026-001',
    trackingToken: 'PUB-2026-CSED-9A10F2',
    title: 'Distributed Systems & Fault-Tolerant Consensus Protocols: Theory and Implementations',
    publicationType: 'INTERNATIONAL_MONOGRAPH_BOOK',
    department: 'Computer Science & Engineering',
    publisherName: 'Cambridge University Press',
    isbn: '978-0-521-86697-2',
    publicationYear: 2026,
    editionOrVolume: '1st Edition',
    totalApiPointsBase: 12,
    authors: [
      {
        authorId: 'AUT-01',
        fullName: 'Dr. Siddharth Sen',
        institutionName: 'PinIT University',
        isFirstAuthor: true,
        isCorrespondingAuthor: true,
        allocatedApiScore: 8.4, // 70% of 12
      },
      {
        authorId: 'AUT-02',
        fullName: 'Prof. Ananya Roy',
        institutionName: 'IIT Delhi',
        isFirstAuthor: false,
        isCorrespondingAuthor: false,
        allocatedApiScore: 3.6, // 30% of 12
      },
    ],
    isPeerReviewed: true,
    isOpenAccess: true,
    repositoryDoiUri: 'doi:10.campus.press/2026/8B1C09',
    license: 'CC_BY_4_0',
    cryptographicPublicationSeal: '9a10f23847291048291847192837482910482918471928374829104829184712',
    lastUpdated: '2026-01-20T10:00:00Z',
  },
  {
    publicationId: 'PUB-2026-002',
    trackingToken: 'PUB-2026-EEED-4B8801',
    title: 'Power Semiconductor Devices in Grid-Scale Renewable Storage Systems',
    publicationType: 'CHAPTER_IN_EDITED_BOOK',
    department: 'Electrical Engineering',
    publisherName: 'Springer Nature Singapore',
    isbn: '978-981-15-5847-4',
    publicationYear: 2026,
    editionOrVolume: 'Chapter 7 in Advances in Green Energy Conversion',
    totalApiPointsBase: 5,
    authors: [
      {
        authorId: 'AUT-03',
        fullName: 'Dr. Neha Kulkarni',
        institutionName: 'PinIT University',
        isFirstAuthor: true,
        isCorrespondingAuthor: false,
        allocatedApiScore: 3.5, // 70% of 5
      },
      {
        authorId: 'AUT-04',
        fullName: 'Rajesh Varma',
        institutionName: 'BHEL Research Labs',
        isFirstAuthor: false,
        isCorrespondingAuthor: false,
        allocatedApiScore: 1.5, // 30% of 5
      },
    ],
    isPeerReviewed: true,
    isOpenAccess: false,
    license: 'ALL_RIGHTS_RESERVED',
    cryptographicPublicationSeal: '4b88013847291048291847192837482910482918471928374829104829184715',
    lastUpdated: '2026-02-14T14:30:00Z',
  },
];
