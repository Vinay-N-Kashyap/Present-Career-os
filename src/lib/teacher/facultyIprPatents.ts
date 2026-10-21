/**
 * Faculty Intellectual Property Rights (IPR), Patent Filing & Commercialization Royalty Engine
 * Statutory Compliance: Indian Patents Act 1970 (as amended 2005), National IPR Policy (CIPAM),
 * DPIIT Patent Office Guidelines & UGC CAS Table 2 Category 3 (Inventions & Patents).
 *
 * Platform: PinIT Career OS - Teacher Portal & Faculty Governance
 * Zero-Collision Invariant: Pure Branch C administrative and faculty governance.
 */

import { createHash } from 'crypto';

export type IprCategory =
  | 'INTERNATIONAL_PCT_PATENT'
  | 'NATIONAL_INDIAN_PATENT'
  | 'COPYRIGHT_SOFTWARE_CODE'
  | 'INDUSTRIAL_DESIGN_PROTOTYPE';

export type PatentLifecycleStage =
  | 'INVENTION_DISCLOSURE_SUBMITTED'
  | 'PRIOR_ART_SEARCH_CLEARED'
  | 'PROVISIONAL_APPLICATION_FILED'
  | 'COMPLETE_SPECIFICATION_FILED'
  | 'FER_FIRST_EXAMINATION_RESPONDED'
  | 'PATENT_GRANTED'
  | 'COMMERCIAL_LICENSE_EXECUTED'
  | 'APPLICATION_ABANDONED';

export interface FacultyInventorContribution {
  empId: string;
  facultyName: string;
  department: string;
  isLeadInventor: boolean;
  contributionPercentage: number; // e.g. 50%
}

export interface CommercialLicenseRecord {
  licenseId: string;
  licenseeCompanyName: string;
  licenseType: 'EXCLUSIVE' | 'NON_EXCLUSIVE';
  upfrontTechnologyFeeInr: number;
  royaltyPercentageOnSales: number;
  totalRoyaltyRealizedInr: number;
  facultyShareInr: number; // 60%
  departmentShareInr: number; // 20%
  universityCorpusShareInr: number; // 20%
  agreementDate: string;
}

export interface FacultyPatentRecord {
  patentId: string;
  trackingToken: string; // PAT-[YEAR]-[DEPT]-[HEX6]
  inventionTitle: string;
  category: IprCategory;
  applicationNumber: string; // e.g. 202611094812 A or PCT/IN2026/050123
  filingDate: string; // YYYY-MM-DD
  grantDate?: string;
  leadInventorName: string;
  leadDepartment: string;
  inventors: FacultyInventorContribution[];
  ugcCasPoints: number;
  stage: PatentLifecycleStage;
  commercialLicense?: CommercialLicenseRecord;
  cryptographicSeal?: string; // SHA-256 seal
  lastUpdated: string;
}

/**
 * Standard UGC CAS Table 2 Category 3 Scoring for IPR:
 * - International Patent Granted: 10 points
 * - National Patent Granted: 7 points
 * - Patent Published / Filed: 5 points
 * - Copyright / Design Granted: 3 points
 */
export const UGC_IPR_POINTS_MATRIX = {
  INTERNATIONAL_GRANTED: 10,
  NATIONAL_GRANTED: 7,
  PATENT_FILED_PUBLISHED: 5,
  COPYRIGHT_DESIGN_GRANTED: 3,
};

/**
 * Standard Statutory Royalty Distribution Split (MoE / CSIR Guidelines):
 * - Faculty Inventors Pool: 60%
 * - Departmental Lab Infrastructure & Research Fund: 20%
 * - Central University Research Corpus: 20%
 */
export const ROYALTY_DISTRIBUTION_SPLIT = {
  FACULTY_INVENTORS: 0.60,
  DEPARTMENT_FUND: 0.20,
  UNIVERSITY_CORPUS: 0.20,
};

/**
 * Generate unique patent tracking token: PAT-[YEAR]-[DEPT]-[HEX6]
 */
export function generatePatentToken(dept: string, year: number = new Date().getFullYear()): string {
  const cleanDept = dept.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'DEPT';
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `PAT-${year}-${cleanDept}-${randomHex}`;
}

/**
 * Calculate UGC CAS Table 2 API points for patent/IP record
 */
export function calculateUgcCasPoints(
  category: IprCategory,
  stage: PatentLifecycleStage
): number {
  if (category === 'COPYRIGHT_SOFTWARE_CODE' || category === 'INDUSTRIAL_DESIGN_PROTOTYPE') {
    return stage === 'PATENT_GRANTED' || stage === 'COMMERCIAL_LICENSE_EXECUTED'
      ? UGC_IPR_POINTS_MATRIX.COPYRIGHT_DESIGN_GRANTED
      : 1;
  }

  if (category === 'INTERNATIONAL_PCT_PATENT') {
    return stage === 'PATENT_GRANTED' || stage === 'COMMERCIAL_LICENSE_EXECUTED'
      ? UGC_IPR_POINTS_MATRIX.INTERNATIONAL_GRANTED
      : UGC_IPR_POINTS_MATRIX.PATENT_FILED_PUBLISHED;
  }

  // National Indian Patent
  return stage === 'PATENT_GRANTED' || stage === 'COMMERCIAL_LICENSE_EXECUTED'
    ? UGC_IPR_POINTS_MATRIX.NATIONAL_GRANTED
    : UGC_IPR_POINTS_MATRIX.PATENT_FILED_PUBLISHED;
}

/**
 * Calculate commercialization royalty revenue distribution
 */
export function calculateRoyaltyDistribution(totalRealizedInr: number) {
  if (totalRealizedInr <= 0) {
    return { facultyShareInr: 0, departmentShareInr: 0, universityCorpusShareInr: 0 };
  }

  const facultyShareInr = Number((totalRealizedInr * ROYALTY_DISTRIBUTION_SPLIT.FACULTY_INVENTORS).toFixed(2));
  const departmentShareInr = Number((totalRealizedInr * ROYALTY_DISTRIBUTION_SPLIT.DEPARTMENT_FUND).toFixed(2));
  const universityCorpusShareInr = Number((totalRealizedInr * ROYALTY_DISTRIBUTION_SPLIT.UNIVERSITY_CORPUS).toFixed(2));

  return { facultyShareInr, departmentShareInr, universityCorpusShareInr };
}

/**
 * Generate tamper-proof SHA-256 seal for patent record
 */
export function generatePatentSeal(
  record: Omit<FacultyPatentRecord, 'cryptographicSeal'>
): string {
  const canonicalPayload = [
    record.patentId,
    record.trackingToken,
    record.inventionTitle,
    record.category,
    record.applicationNumber,
    record.filingDate,
    record.leadDepartment,
    record.ugcCasPoints,
    record.stage,
    record.commercialLicense?.totalRoyaltyRealizedInr ?? 0,
    record.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Register a new invention disclosure or patent application
 */
export function registerFacultyPatent(params: {
  inventionTitle: string;
  category: IprCategory;
  applicationNumber: string;
  filingDate: string;
  leadInventorName: string;
  leadDepartment: string;
  inventors: FacultyInventorContribution[];
}): FacultyPatentRecord {
  if (!params.inventionTitle.trim()) {
    throw new Error('Invention title cannot be blank.');
  }

  if (!params.applicationNumber.trim()) {
    throw new Error('Patent application number must be specified.');
  }

  const totalContribution = params.inventors.reduce((sum, inv) => sum + inv.contributionPercentage, 0);
  if (Math.abs(totalContribution - 100) > 0.01) {
    throw new Error(`Total inventor contribution percentage must equal exactly 100% (current: ${totalContribution}%).`);
  }

  const trackingToken = generatePatentToken(params.leadDepartment);
  const now = new Date().toISOString();
  const initialStage: PatentLifecycleStage = 'PROVISIONAL_APPLICATION_FILED';
  const ugcCasPoints = calculateUgcCasPoints(params.category, initialStage);

  const baseRecord: Omit<FacultyPatentRecord, 'cryptographicSeal'> = {
    patentId: `PAT-${Date.now().toString(36).toUpperCase()}`,
    trackingToken,
    inventionTitle: params.inventionTitle.trim(),
    category: params.category,
    applicationNumber: params.applicationNumber.trim().toUpperCase(),
    filingDate: params.filingDate,
    leadInventorName: params.leadInventorName.trim(),
    leadDepartment: params.leadDepartment.trim(),
    inventors: params.inventors,
    ugcCasPoints,
    stage: initialStage,
    lastUpdated: now,
  };

  const cryptographicSeal = generatePatentSeal(baseRecord);
  return { ...baseRecord, cryptographicSeal };
}

/**
 * Record patent grant decision by Indian Patent Office / WIPO
 */
export function recordPatentGrant(
  record: FacultyPatentRecord,
  grantDate: string
): FacultyPatentRecord {
  if (record.stage === 'APPLICATION_ABANDONED') {
    throw new Error('Cannot grant an abandoned patent application.');
  }

  const nextStage: PatentLifecycleStage = 'PATENT_GRANTED';
  const ugcCasPoints = calculateUgcCasPoints(record.category, nextStage);
  const now = new Date().toISOString();

  const updated: Omit<FacultyPatentRecord, 'cryptographicSeal'> = {
    ...record,
    grantDate,
    stage: nextStage,
    ugcCasPoints,
    lastUpdated: now,
  };

  const cryptographicSeal = generatePatentSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Execute technology commercialization licensing agreement and distribute royalty
 */
export function executeCommercialLicense(
  record: FacultyPatentRecord,
  licenseParams: {
    licenseeCompanyName: string;
    licenseType: 'EXCLUSIVE' | 'NON_EXCLUSIVE';
    upfrontTechnologyFeeInr: number;
    royaltyPercentageOnSales: number;
    totalRoyaltyRealizedInr: number;
    agreementDate: string;
  }
): FacultyPatentRecord {
  if (record.stage !== 'PATENT_GRANTED') {
    throw new Error(`Cannot execute commercial license: Patent must be granted first (current: ${record.stage}).`);
  }

  const shares = calculateRoyaltyDistribution(licenseParams.totalRoyaltyRealizedInr);

  const commercialLicense: CommercialLicenseRecord = {
    licenseId: `LIC-${Date.now().toString(36).toUpperCase()}`,
    licenseeCompanyName: licenseParams.licenseeCompanyName.trim(),
    licenseType: licenseParams.licenseType,
    upfrontTechnologyFeeInr: licenseParams.upfrontTechnologyFeeInr,
    royaltyPercentageOnSales: licenseParams.royaltyPercentageOnSales,
    totalRoyaltyRealizedInr: licenseParams.totalRoyaltyRealizedInr,
    facultyShareInr: shares.facultyShareInr,
    departmentShareInr: shares.departmentShareInr,
    universityCorpusShareInr: shares.universityCorpusShareInr,
    agreementDate: licenseParams.agreementDate,
  };

  const now = new Date().toISOString();
  const updated: Omit<FacultyPatentRecord, 'cryptographicSeal'> = {
    ...record,
    stage: 'COMMERCIAL_LICENSE_EXECUTED',
    commercialLicense,
    lastUpdated: now,
  };

  const cryptographicSeal = generatePatentSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Export Faculty Patent & IPR Ledger as statutory CSV
 */
export function exportFacultyPatentsLedgerCSV(records: FacultyPatentRecord[]): string {
  const headers = [
    'Patent ID',
    'Tracking Token',
    'Invention Title',
    'Category',
    'Application Number',
    'Filing Date',
    'Grant Date',
    'Lead Inventor',
    'Lead Department',
    'UGC CAS Points',
    'Stage',
    'Licensee Company',
    'Total Royalty INR',
    'Faculty Share (60%)',
    'Dept Share (20%)',
    'Uni Corpus (20%)',
    'Cryptographic Seal',
  ];

  const rows = records.map((r) => [
    `"${r.patentId}"`,
    `"${r.trackingToken}"`,
    `"${r.inventionTitle.replace(/"/g, '""')}"`,
    `"${r.category}"`,
    `"${r.applicationNumber}"`,
    r.filingDate,
    r.grantDate || 'PENDING',
    `"${r.leadInventorName.replace(/"/g, '""')}"`,
    `"${r.leadDepartment.replace(/"/g, '""')}"`,
    r.ugcCasPoints,
    `"${r.stage}"`,
    `"${r.commercialLicense?.licenseeCompanyName || 'N/A'}"`,
    r.commercialLicense?.totalRoyaltyRealizedInr || 0,
    r.commercialLicense?.facultyShareInr || 0,
    r.commercialLicense?.departmentShareInr || 0,
    r.commercialLicense?.universityCorpusShareInr || 0,
    `"${r.cryptographicSeal || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Demonstration Faculty Patent & IPR Records
 */
export const INITIAL_FACULTY_PATENTS: FacultyPatentRecord[] = [
  {
    patentId: 'PAT-2026-001',
    trackingToken: 'PAT-2026-CSED-8A1102',
    inventionTitle: 'Neuromorphic Spiking Neural Network Accelerator for Low-Power Edge Inference',
    category: 'NATIONAL_INDIAN_PATENT',
    applicationNumber: '202411084910 A',
    filingDate: '2024-05-10',
    grantDate: '2026-01-20',
    leadInventorName: 'Dr. Siddharth Sen',
    leadDepartment: 'Computer Science & Engineering',
    inventors: [
      {
        empId: 'EMP-CSE-042',
        facultyName: 'Dr. Siddharth Sen',
        department: 'Computer Science & Engineering',
        isLeadInventor: true,
        contributionPercentage: 60,
      },
      {
        empId: 'EMP-CSE-089',
        facultyName: 'Dr. Ananya Roy',
        department: 'Computer Science & Engineering',
        isLeadInventor: false,
        contributionPercentage: 40,
      },
    ],
    ugcCasPoints: 7, // National Granted = 7 pts
    stage: 'COMMERCIAL_LICENSE_EXECUTED',
    commercialLicense: {
      licenseId: 'LIC-2026-001',
      licenseeCompanyName: 'Synapse Edge Microelectronics India Pvt Ltd',
      licenseType: 'EXCLUSIVE',
      upfrontTechnologyFeeInr: 2500000,
      royaltyPercentageOnSales: 5.0,
      totalRoyaltyRealizedInr: 3000000,
      facultyShareInr: 1800000, // 60%
      departmentShareInr: 600000, // 20%
      universityCorpusShareInr: 600000, // 20%
      agreementDate: '2026-02-15',
    },
    cryptographicSeal: '8a11023847291048291847192837482910482918471928374829104829184702',
    lastUpdated: '2026-02-20T10:00:00Z',
  },
  {
    patentId: 'PAT-2026-002',
    trackingToken: 'PAT-2026-EEED-3B9911',
    inventionTitle: 'Autonomous Solid-State GaN Inverter Architecture with Active Thermal Decoupling for EV Powertrains',
    category: 'INTERNATIONAL_PCT_PATENT',
    applicationNumber: 'PCT/IB2025/054192',
    filingDate: '2025-08-14',
    leadInventorName: 'Dr. Neha Kulkarni',
    leadDepartment: 'Electrical Engineering',
    inventors: [
      {
        empId: 'EMP-EEE-018',
        facultyName: 'Dr. Neha Kulkarni',
        department: 'Electrical Engineering',
        isLeadInventor: true,
        contributionPercentage: 100,
      },
    ],
    ugcCasPoints: 5, // International Published / Filed = 5 pts
    stage: 'FER_FIRST_EXAMINATION_RESPONDED',
    cryptographicSeal: '3b99113847291048291847192837482910482918471928374829104829184707',
    lastUpdated: '2026-03-05T14:00:00Z',
  },
];
