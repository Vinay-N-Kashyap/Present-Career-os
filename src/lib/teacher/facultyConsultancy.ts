/**
 * Faculty Sponsored Research & Corporate Consultancy (SRIC / IRD) Ledger Engine
 *
 * Statutory Alignment:
 * - Industrial Research & Development (IRD) / Sponsored Research & Industrial Consultancy (SRIC) Framework
 * - AICTE & UGC Guidelines on Institutional Consultancy, Faculty Honorarium & University Overheads
 * - Statutory Indirect Taxation & GST (18%) Compliance for Contractual R&D Services
 *
 * Capabilities:
 * 1. Industrial consultancy project lifecycle:
 *    PROPOSAL_SUBMITTED -> DEAN_SRIC_APPROVED -> AGREEMENT_SIGNED -> INVOICE_DISPATCHED -> PAYMENT_RECEIVED -> COMPLETED_CLOSED.
 * 2. Formulaic Institutional Overhead vs Faculty Honorarium split:
 *    - 70% Faculty Principal Investigator (PI) & Team Honorarium
 *    - 30% University Institutional Overhead (15% Department Development Fund, 15% Central Research Fund).
 * 3. 18% GST calculation and commercial billing invoice generation.
 * 4. Faculty time commitment watchdog (max 52 days per year / 1 day per week AICTE ceiling).
 * 5. Unique Consultancy Project Code: SRIC-[YEAR]-[DEPT]-[HEX6].
 * 6. Cryptographic Corporate Contract Seal (SHA-256).
 * 7. University SRIC Industrial Consultancy Ledger CSV export.
 */

import crypto from 'node:crypto';

export type ConsultancyCategory =
  | 'RETAINER_CONSULTANCY'
  | 'EXPERT_INVESTIGATION'
  | 'PRODUCT_DEVELOPMENT'
  | 'ROUTINE_TESTING';

export type ConsultancyStage =
  | 'PROPOSAL_SUBMITTED'
  | 'DEAN_SRIC_APPROVED'
  | 'AGREEMENT_SIGNED'
  | 'INVOICE_DISPATCHED'
  | 'PAYMENT_RECEIVED'
  | 'COMPLETED_CLOSED'
  | 'TERMINATED';

export interface ConsultancyFinancialBreakdown {
  netContractValueInr: number;
  gstAmountInr: number; // 18% of Net
  grossInvoiceAmountInr: number; // Net + GST
  facultyHonorariumInr: number; // 70% of Net
  universityOverheadInr: number; // 30% of Net
  departmentFundInr: number; // 15% of Net
  centralDevFundInr: number; // 15% of Net
}

export interface FacultyConsultancyProject {
  id: string;
  projectCode: string; // e.g. "SRIC-2026-CSE-9B3E12"
  title: string;
  category: ConsultancyCategory;
  clientCompany: string;
  clientGstin?: string;
  facultyPiName: string;
  facultyPiEmployeeId: string;
  facultyCoPiName?: string;
  department: string;
  netContractValueInr: number;
  gstAmountInr: number;
  grossInvoiceAmountInr: number;
  facultyHonorariumInr: number;
  universityOverheadInr: number;
  departmentFundInr: number;
  centralDevFundInr: number;
  estimatedDaysCommitment: number; // max 52 days/yr
  stage: ConsultancyStage;
  cryptographicAgreementDigest?: string; // SHA-256
  startDate: string;
  targetEndDate: string;
  deliverablesSummary: string;
  createdDate: string;
}

/**
 * Calculates complete financial breakdown including 18% GST and 70/30 overhead split.
 */
export function calculateConsultancyFinances(
  netContractValue: number
): ConsultancyFinancialBreakdown {
  const safeNet = Math.max(0, netContractValue);
  const gstAmountInr = Math.round(safeNet * 0.18);
  const grossInvoiceAmountInr = safeNet + gstAmountInr;

  const facultyHonorariumInr = Math.round(safeNet * 0.70);
  const universityOverheadInr = safeNet - facultyHonorariumInr; // 30%
  const departmentFundInr = Math.round(universityOverheadInr * 0.50); // 15%
  const centralDevFundInr = universityOverheadInr - departmentFundInr; // 15%

  return {
    netContractValueInr: safeNet,
    gstAmountInr,
    grossInvoiceAmountInr,
    facultyHonorariumInr,
    universityOverheadInr,
    departmentFundInr,
    centralDevFundInr,
  };
}

/**
 * Validates faculty consultancy time commitment against AICTE statutory limit (<= 52 days/year).
 */
export function validateConsultancyCommitment(daysPerYear: number): boolean {
  return daysPerYear >= 0 && daysPerYear <= 52;
}

/**
 * Sanitizes department string to uppercase alphanumeric code.
 */
function getDepartmentCode(dept: string): string {
  const clean = dept.replace(/[^a-zA-Z]/g, '').toUpperCase();
  if (clean.includes('COMPUTER') || clean.includes('CSE')) return 'CSE';
  if (clean.includes('ELECTR') || clean.includes('ECE')) return 'ECE';
  if (clean.includes('MECH')) return 'MECH';
  if (clean.includes('CIVIL')) return 'CIVIL';
  if (clean.includes('BIO')) return 'BIO';
  return clean.substring(0, 4) || 'GEN';
}

/**
 * Generates an official SRIC Project Registration Code.
 * Format: SRIC-[YEAR]-[DEPT]-[HEX6]
 */
export function generateConsultancyCode(
  dept: string,
  year: number,
  projectId: string
): string {
  const deptCode = getDepartmentCode(dept);
  const hash = crypto
    .createHash('sha256')
    .update(`${dept}::${year}::${projectId}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();

  return `SRIC-${year}-${deptCode}-${hash}`;
}

/**
 * Generates tamper-proof SHA-256 corporate agreement seal.
 */
export function generateAgreementSeal(project: {
  projectCode: string;
  clientCompany: string;
  facultyPiName: string;
  netContractValueInr: number;
  category: ConsultancyCategory;
}): string {
  const payload = [
    project.projectCode,
    project.clientCompany,
    project.facultyPiName,
    `VALUE_INR:${project.netContractValueInr}`,
    project.category,
  ].join('::');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Exports SRIC Consultancy Ledger to standard CSV.
 */
export function exportFacultyConsultancyCSV(
  projects: FacultyConsultancyProject[]
): string {
  const headers = [
    'Project Code',
    'Project Title',
    'Category',
    'Client Company',
    'Faculty PI',
    'Department',
    'Net Contract Value (INR)',
    'GST 18% (INR)',
    'Gross Invoice (INR)',
    'Faculty Honorarium 70% (INR)',
    'University Overhead 30% (INR)',
    'Days Commitment',
    'Stage',
    'Target End Date',
    'Cryptographic Agreement Seal',
  ];

  const rows = projects.map((p) => [
    `"${p.projectCode}"`,
    `"${p.title.replace(/"/g, '""')}"`,
    `"${p.category}"`,
    `"${p.clientCompany.replace(/"/g, '""')}"`,
    `"${p.facultyPiName.replace(/"/g, '""')}"`,
    `"${p.department}"`,
    `"${p.netContractValueInr}"`,
    `"${p.gstAmountInr}"`,
    `"${p.grossInvoiceAmountInr}"`,
    `"${p.facultyHonorariumInr}"`,
    `"${p.universityOverheadInr}"`,
    `"${p.estimatedDaysCommitment}"`,
    `"${p.stage}"`,
    `"${p.targetEndDate}"`,
    `"${p.cryptographicAgreementDigest || 'UNSIGNED'}"`,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

// ---------------------------------------------------------------------------
// DEFAULT SEED DATA & IN-MEMORY STORE
// ---------------------------------------------------------------------------

export const DEFAULT_CONSULTANCY_PROJECTS: FacultyConsultancyProject[] = [
  {
    id: 'PRJ-001',
    projectCode: 'SRIC-2026-CSE-9B3E12',
    title: 'Fault-Tolerant Distributed Consensus Optimization for Electric Vehicle Charging Grids',
    category: 'PRODUCT_DEVELOPMENT',
    clientCompany: 'Tata Motors EV Technologies Ltd',
    clientGstin: '27AAACT2941Q1ZT',
    facultyPiName: 'Prof. Anita Deshmukh',
    facultyPiEmployeeId: 'FAC-CS-01',
    facultyCoPiName: 'Prof. Harish Chandra',
    department: 'Computer Science & Engineering',
    netContractValueInr: 2500000, // 25 Lakhs
    gstAmountInr: 450000,
    grossInvoiceAmountInr: 2950000,
    facultyHonorariumInr: 1750000, // 70%
    universityOverheadInr: 750000, // 30%
    departmentFundInr: 375000,
    centralDevFundInr: 375000,
    estimatedDaysCommitment: 24,
    stage: 'AGREEMENT_SIGNED',
    cryptographicAgreementDigest:
      'c81e728d9d4c2f636f067f89cc14862c1ecd73efb1c0908cf6b4f74d08a54d68',
    startDate: '2026-08-01',
    targetEndDate: '2027-01-31',
    deliverablesSummary:
      'Benchmarked Raft protocol variant with sub-second Byzantine fault recovery across 5,000 edge nodes.',
    createdDate: '2026-07-20',
  },
  {
    id: 'PRJ-002',
    projectCode: 'SRIC-2026-MECH-4A82F1',
    title: 'Failure Root-Cause Investigation of Turbine Blade Microcracking Under Thermal Fatigue',
    category: 'EXPERT_INVESTIGATION',
    clientCompany: 'Bharat Heavy Electricals Ltd (BHEL)',
    clientGstin: '07AAACB1029P1ZX',
    facultyPiName: 'Prof. S. R. Raman',
    facultyPiEmployeeId: 'FAC-ME-05',
    department: 'Mechanical Engineering',
    netContractValueInr: 1200000,
    gstAmountInr: 216000,
    grossInvoiceAmountInr: 1416000,
    facultyHonorariumInr: 840000,
    universityOverheadInr: 360000,
    departmentFundInr: 180000,
    centralDevFundInr: 180000,
    estimatedDaysCommitment: 15,
    stage: 'PAYMENT_RECEIVED',
    cryptographicAgreementDigest:
      '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    startDate: '2026-05-15',
    targetEndDate: '2026-09-30',
    deliverablesSummary:
      'FE-SEM and XRD metallographic failure report confirming high-temperature creep embrittlement.',
    createdDate: '2026-05-01',
  },
  {
    id: 'PRJ-003',
    projectCode: 'SRIC-2026-ECE-1F76D0',
    title: 'Retainer Technical Advisory on 5G/6G MIMO Phased Array Antenna Calibration',
    category: 'RETAINER_CONSULTANCY',
    clientCompany: 'Qualcomm Wireless R&D India',
    clientGstin: '36AAACQ4921M1ZY',
    facultyPiName: 'Dr. Preeti Vasudevan',
    facultyPiEmployeeId: 'FAC-EC-03',
    department: 'Electronics & Communication Engineering',
    netContractValueInr: 1800000,
    gstAmountInr: 324000,
    grossInvoiceAmountInr: 2124000,
    facultyHonorariumInr: 1260000,
    universityOverheadInr: 540000,
    departmentFundInr: 270000,
    centralDevFundInr: 270000,
    estimatedDaysCommitment: 30,
    stage: 'INVOICE_DISPATCHED',
    cryptographicAgreementDigest:
      '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    startDate: '2026-06-01',
    targetEndDate: '2026-12-31',
    deliverablesSummary:
      'Bi-weekly technical advisory on beamforming codebooks and millimeter-wave chamber testing.',
    createdDate: '2026-05-20',
  },
];

let projectsStore: FacultyConsultancyProject[] = [...DEFAULT_CONSULTANCY_PROJECTS];

export function resetConsultancyStore(): void {
  projectsStore = [...DEFAULT_CONSULTANCY_PROJECTS];
}

export function getAllConsultancyProjects(): FacultyConsultancyProject[] {
  return [...projectsStore];
}

export function registerConsultancyProject(
  input: Omit<
    FacultyConsultancyProject,
    | 'id'
    | 'projectCode'
    | 'gstAmountInr'
    | 'grossInvoiceAmountInr'
    | 'facultyHonorariumInr'
    | 'universityOverheadInr'
    | 'departmentFundInr'
    | 'centralDevFundInr'
    | 'cryptographicAgreementDigest'
  > & { id?: string }
): FacultyConsultancyProject {
  const id = input.id || `PRJ-${Date.now().toString().slice(-4)}`;
  const currentYear = new Date().getFullYear();
  const projectCode = generateConsultancyCode(input.department, currentYear, id);

  const finances = calculateConsultancyFinances(input.netContractValueInr);

  const newProject: FacultyConsultancyProject = {
    ...input,
    id,
    projectCode,
    gstAmountInr: finances.gstAmountInr,
    grossInvoiceAmountInr: finances.grossInvoiceAmountInr,
    facultyHonorariumInr: finances.facultyHonorariumInr,
    universityOverheadInr: finances.universityOverheadInr,
    departmentFundInr: finances.departmentFundInr,
    centralDevFundInr: finances.centralDevFundInr,
  };

  newProject.cryptographicAgreementDigest = generateAgreementSeal(newProject);
  projectsStore.unshift(newProject);
  return newProject;
}

export function updateConsultancyStage(
  projectId: string,
  nextStage: ConsultancyStage
): FacultyConsultancyProject | null {
  const idx = projectsStore.findIndex((p) => p.id === projectId);
  if (idx === -1) return null;

  const current = projectsStore[idx];
  const updated: FacultyConsultancyProject = {
    ...current,
    stage: nextStage,
  };

  projectsStore[idx] = updated;
  return updated;
}
