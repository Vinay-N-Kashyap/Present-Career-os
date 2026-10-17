/**
 * Faculty Consultancy Project & Corporate R&D Client Billing Engine
 * 
 * Statutory & Institutional Governance Framework:
 * - UGC / MoE Guidelines on Consultancy Projects & Technology Transfer for University Faculty
 * - Goods & Services Tax (GST Act 2017) SAC Code 9983 (Scientific & Technical Consulting Services @ 18%)
 * - Central University Revenue Sharing Norms:
 *   - Type I (Advisory / Software / Conceptual): 70% Faculty, 20% University Central Fund, 10% Dept Development Fund (DDF)
 *   - Type II (Institutional Facility Testing / Heavy Lab Usage): 50% Faculty, 30% University Central Fund, 20% DDF
 * - IIT / Central University Faculty Annual Consultancy Ceiling Safeguards (100% of Annual Gross Salary)
 */

import { createHash } from 'crypto';

export type ConsultancyType = 
  | 'RETAINER_ADVISORY'
  | 'CORPORATE_R_AND_D'
  | 'INSTITUTIONAL_FACILITY_TESTING'
  | 'GOVERNMENT_POLICY_CONSULTING';

export type ConsultancyStatus = 
  | 'PROPOSAL_UNDER_EVALUATION'
  | 'MOU_CLIENT_EXECUTED'
  | 'MILESTONE_INVOICE_RAISED'
  | 'PAYMENT_RECEIVED_CLEARED'
  | 'PROJECT_COMPLETED_DISCHARGED'
  | 'DEFAULT_TERMINATED';

export type MilestoneInvoiceStatus = 
  | 'SCHEDULED_PENDING'
  | 'TAX_INVOICE_ISSUED'
  | 'PAYMENT_RECEIVED_RECONCILED'
  | 'OVERDUE_FLAGGED';

export interface ConsultancyMilestone {
  milestoneId: string;
  milestoneNumber: number;
  title: string;
  deliverableDescription: string;
  targetCompletionDate: string; // ISO Date YYYY-MM-DD
  baseAmountInr: number;
  gstRatePercent: number; // 18% standard GST SAC 9983
  gstAmountInr: number;
  totalInvoiceAmountInr: number;
  invoiceNumber?: string; // e.g. INV-2026-CNS-01
  invoiceDate?: string;
  status: MilestoneInvoiceStatus;
  paymentReceiptRef?: string;
  paymentClearedDate?: string;
}

export interface RevenueDisbursementSplit {
  totalPaidBaseAmountInr: number;
  facultyHonorariumInr: number;
  facultySharePercent: number; // 70% (Type I) or 50% (Type II)
  universityCentralOverheadInr: number;
  universitySharePercent: number; // 20% (Type I) or 30% (Type II)
  departmentDevelopmentFundInr: number;
  ddfSharePercent: number; // 10% (Type I) or 20% (Type II)
  gstPaidToGovernmentInr: number;
}

export interface ConsultancyProject {
  projectId: string; // Token format: CNS-[YEAR]-[DEPT]-[HEX6]
  projectTitle: string;
  leadFacultyId: string;
  leadFacultyName: string;
  department: string;
  facultyAnnualGrossSalaryInr: number;
  coInvestigators: { facultyId: string; name: string; shareRatio: number }[];
  clientOrganization: string;
  clientGstin: string;
  clientPan: string;
  clientAddress: string;
  consultancyType: ConsultancyType;
  totalContractValueInr: number; // Total base value across all milestones
  sacCode: string; // SAC 9983
  milestones: ConsultancyMilestone[];
  disbursementSummary: RevenueDisbursementSplit;
  status: ConsultancyStatus;
  mouExecutionDate: string;
  expectedDischargeDate: string;
  actualDischargeDate?: string;
  createdTimestamp: string;
  auditSha256: string;
}

// Standard GST Rate for Technical & Engineering Consulting Services
export const STANDARD_CONSULTANCY_GST_PERCENT = 18;
export const STANDARD_CONSULTANCY_SAC_CODE = '9983';

/**
 * Generate cryptographic SHA-256 seal for consultancy project and audit trail
 */
export function generateConsultancySeal(project: Omit<ConsultancyProject, 'auditSha256'>): string {
  const payload = [
    project.projectId,
    project.leadFacultyId,
    project.clientGstin,
    project.consultancyType,
    project.totalContractValueInr,
    project.disbursementSummary.facultyHonorariumInr,
    project.disbursementSummary.universityCentralOverheadInr,
    project.status,
    project.milestones.length,
    project.mouExecutionDate
  ].join('|');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Format statutory unique project identifier token
 */
export function formatProjectId(department: string, year: number = 2026): string {
  const deptCode = department.replace(/[^A-Z]/gi, '').substring(0, 4).toUpperCase() || 'ENGG';
  const hex = createHash('sha256')
    .update(`${department}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();
  return `CNS-${year}-${deptCode}-${hex}`;
}

/**
 * Calculate revenue sharing percentages based on consultancy type
 */
export function getRevenueShareNorms(type: ConsultancyType): {
  facultySharePercent: number;
  universitySharePercent: number;
  ddfSharePercent: number;
} {
  if (type === 'INSTITUTIONAL_FACILITY_TESTING') {
    // Type II - Heavy institutional lab & equipment utilization
    return {
      facultySharePercent: 50,
      universitySharePercent: 30,
      ddfSharePercent: 20
    };
  }

  // Type I - Advisory, Software, Corporate R&D, Govt Policy Consulting
  return {
    facultySharePercent: 70,
    universitySharePercent: 20,
    ddfSharePercent: 10
  };
}

/**
 * Calculate statutory GST (18% SAC 9983) and invoice amounts for a milestone
 */
export function calculateMilestoneBilling(baseAmountInr: number, gstRatePercent: number = STANDARD_CONSULTANCY_GST_PERCENT): {
  gstAmountInr: number;
  totalInvoiceAmountInr: number;
} {
  const gstAmountInr = Math.round(baseAmountInr * (gstRatePercent / 100) * 100) / 100;
  const totalInvoiceAmountInr = Math.round((baseAmountInr + gstAmountInr) * 100) / 100;
  return {
    gstAmountInr,
    totalInvoiceAmountInr
  };
}

/**
 * Create a new Faculty Consultancy Project record
 */
export function createConsultancyProject(params: {
  projectTitle: string;
  leadFacultyId: string;
  leadFacultyName: string;
  department: string;
  facultyAnnualGrossSalaryInr: number;
  coInvestigators?: { facultyId: string; name: string; shareRatio: number }[];
  clientOrganization: string;
  clientGstin: string;
  clientPan: string;
  clientAddress: string;
  consultancyType: ConsultancyType;
  mouExecutionDate: string;
  expectedDischargeDate: string;
  milestonesData: {
    title: string;
    deliverableDescription: string;
    targetCompletionDate: string;
    baseAmountInr: number;
  }[];
  year?: number;
}): ConsultancyProject {
  const projectId = formatProjectId(params.department, params.year);
  const now = new Date().toISOString();
  const shareNorms = getRevenueShareNorms(params.consultancyType);

  let totalContractValueInr = 0;
  const milestones: ConsultancyMilestone[] = params.milestonesData.map((m, idx) => {
    totalContractValueInr += m.baseAmountInr;
    const { gstAmountInr, totalInvoiceAmountInr } = calculateMilestoneBilling(m.baseAmountInr);
    return {
      milestoneId: `MLS-${Date.now()}-${idx + 1}`,
      milestoneNumber: idx + 1,
      title: m.title,
      deliverableDescription: m.deliverableDescription,
      targetCompletionDate: m.targetCompletionDate,
      baseAmountInr: m.baseAmountInr,
      gstRatePercent: STANDARD_CONSULTANCY_GST_PERCENT,
      gstAmountInr,
      totalInvoiceAmountInr,
      status: 'SCHEDULED_PENDING'
    };
  });

  const baseProject: Omit<ConsultancyProject, 'auditSha256'> = {
    projectId,
    projectTitle: params.projectTitle,
    leadFacultyId: params.leadFacultyId,
    leadFacultyName: params.leadFacultyName,
    department: params.department,
    facultyAnnualGrossSalaryInr: params.facultyAnnualGrossSalaryInr,
    coInvestigators: params.coInvestigators || [],
    clientOrganization: params.clientOrganization,
    clientGstin: params.clientGstin.toUpperCase(),
    clientPan: params.clientPan.toUpperCase(),
    clientAddress: params.clientAddress,
    consultancyType: params.consultancyType,
    totalContractValueInr,
    sacCode: STANDARD_CONSULTANCY_SAC_CODE,
    milestones,
    disbursementSummary: {
      totalPaidBaseAmountInr: 0,
      facultyHonorariumInr: 0,
      facultySharePercent: shareNorms.facultySharePercent,
      universityCentralOverheadInr: 0,
      universitySharePercent: shareNorms.universitySharePercent,
      departmentDevelopmentFundInr: 0,
      ddfSharePercent: shareNorms.ddfSharePercent,
      gstPaidToGovernmentInr: 0
    },
    status: 'MOU_CLIENT_EXECUTED',
    mouExecutionDate: params.mouExecutionDate,
    expectedDischargeDate: params.expectedDischargeDate,
    createdTimestamp: now
  };

  const auditSha256 = generateConsultancySeal(baseProject);
  return { ...baseProject, auditSha256 };
}

/**
 * Raise official GST 18% Tax Invoice for a project milestone
 */
export function raiseMilestoneInvoice(
  project: ConsultancyProject,
  milestoneNumber: number,
  invoiceDate: string = new Date().toISOString().split('T')[0]
): { success: boolean; project: ConsultancyProject; invoiceNumber?: string; error?: string } {
  const milestoneIdx = project.milestones.findIndex(m => m.milestoneNumber === milestoneNumber);
  if (milestoneIdx === -1) {
    return { success: false, project, error: `Milestone ${milestoneNumber} not found` };
  }

  const milestone = project.milestones[milestoneIdx];
  if (milestone.status !== 'SCHEDULED_PENDING') {
    return { success: false, project, error: `Milestone ${milestoneNumber} already has status: ${milestone.status}` };
  }

  const invoiceNumber = `INV-${new Date().getFullYear()}-${project.projectId.split('-').pop()}-M${milestoneNumber}`;

  const updatedMilestone: ConsultancyMilestone = {
    ...milestone,
    invoiceNumber,
    invoiceDate,
    status: 'TAX_INVOICE_ISSUED'
  };

  const updatedMilestones = [...project.milestones];
  updatedMilestones[milestoneIdx] = updatedMilestone;

  const updated: ConsultancyProject = {
    ...project,
    status: 'MILESTONE_INVOICE_RAISED',
    milestones: updatedMilestones
  };

  return {
    success: true,
    project: { ...updated, auditSha256: generateConsultancySeal(updated) },
    invoiceNumber
  };
}

/**
 * Record client payment receipt and disburse statutory revenue shares
 * Checks whether cumulative faculty honorarium exceeds annual gross salary ceiling
 */
export function recordClientPaymentAndDisburse(
  project: ConsultancyProject,
  params: {
    milestoneNumber: number;
    paymentReceiptRef: string;
    paymentClearedDate?: string;
  }
): {
  success: boolean;
  project: ConsultancyProject;
  disbursement: {
    facultyPayout: number;
    universityOverhead: number;
    ddfPayout: number;
    gstAmount: number;
  };
  isCeilingWarning: boolean;
  error?: string;
} {
  const milestoneIdx = project.milestones.findIndex(m => m.milestoneNumber === params.milestoneNumber);
  if (milestoneIdx === -1) {
    return {
      success: false,
      project,
      disbursement: { facultyPayout: 0, universityOverhead: 0, ddfPayout: 0, gstAmount: 0 },
      isCeilingWarning: false,
      error: `Milestone ${params.milestoneNumber} not found`
    };
  }

  const milestone = project.milestones[milestoneIdx];
  if (milestone.status !== 'TAX_INVOICE_ISSUED') {
    return {
      success: false,
      project,
      disbursement: { facultyPayout: 0, universityOverhead: 0, ddfPayout: 0, gstAmount: 0 },
      isCeilingWarning: false,
      error: `Cannot record payment: Milestone ${params.milestoneNumber} invoice is not issued (Status: ${milestone.status})`
    };
  }

  const shareNorms = getRevenueShareNorms(project.consultancyType);
  const baseAmount = milestone.baseAmountInr;
  const gstAmount = milestone.gstAmountInr;

  const facultyPayout = Math.round(baseAmount * (shareNorms.facultySharePercent / 100) * 100) / 100;
  const universityOverhead = Math.round(baseAmount * (shareNorms.universitySharePercent / 100) * 100) / 100;
  const ddfPayout = Math.round(baseAmount * (shareNorms.ddfSharePercent / 100) * 100) / 100;

  const newTotalPaidBase = project.disbursementSummary.totalPaidBaseAmountInr + baseAmount;
  const newFacultyHonorarium = project.disbursementSummary.facultyHonorariumInr + facultyPayout;
  const newUnivOverhead = project.disbursementSummary.universityCentralOverheadInr + universityOverhead;
  const newDdf = project.disbursementSummary.departmentDevelopmentFundInr + ddfPayout;
  const newGstPaid = project.disbursementSummary.gstPaidToGovernmentInr + gstAmount;

  // Check 100% annual gross salary ceiling hurdle
  const isCeilingWarning = newFacultyHonorarium > project.facultyAnnualGrossSalaryInr;

  const now = params.paymentClearedDate || new Date().toISOString().split('T')[0];

  const updatedMilestone: ConsultancyMilestone = {
    ...milestone,
    paymentReceiptRef: params.paymentReceiptRef,
    paymentClearedDate: now,
    status: 'PAYMENT_RECEIVED_RECONCILED'
  };

  const updatedMilestones = [...project.milestones];
  updatedMilestones[milestoneIdx] = updatedMilestone;

  // Check if all milestones are paid
  const allPaid = updatedMilestones.every(m => m.status === 'PAYMENT_RECEIVED_RECONCILED');

  const updated: ConsultancyProject = {
    ...project,
    status: allPaid ? 'PROJECT_COMPLETED_DISCHARGED' : 'PAYMENT_RECEIVED_CLEARED',
    milestones: updatedMilestones,
    disbursementSummary: {
      totalPaidBaseAmountInr: newTotalPaidBase,
      facultyHonorariumInr: newFacultyHonorarium,
      facultySharePercent: shareNorms.facultySharePercent,
      universityCentralOverheadInr: newUnivOverhead,
      universitySharePercent: shareNorms.universitySharePercent,
      departmentDevelopmentFundInr: newDdf,
      ddfSharePercent: shareNorms.ddfSharePercent,
      gstPaidToGovernmentInr: newGstPaid
    }
  };

  return {
    success: true,
    project: { ...updated, auditSha256: generateConsultancySeal(updated) },
    disbursement: {
      facultyPayout,
      universityOverhead,
      ddfPayout,
      gstAmount
    },
    isCeilingWarning
  };
}

/**
 * Generate official CSV export of Faculty Corporate Consultancy Projects
 */
export function exportFacultyConsultancyLedgerCSV(projects: ConsultancyProject[]): string {
  const headers = [
    'Project ID',
    'Project Title',
    'Lead Faculty',
    'Department',
    'Client Organization',
    'Client GSTIN',
    'Consultancy Type',
    'Total Contract Base INR',
    'GST Invoiced INR',
    'Total Paid INR',
    'Faculty Honorarium INR',
    'University Overhead INR',
    'DDF INR',
    'Status',
    'Audit SHA-256'
  ];

  const rows = projects.map(p => {
    const totalGstInvoiced = p.milestones
      .filter(m => m.status !== 'SCHEDULED_PENDING')
      .reduce((sum, m) => sum + m.gstAmountInr, 0);

    return [
      p.projectId,
      `"${p.projectTitle.replace(/"/g, '""')}"`,
      `"${p.leadFacultyName}"`,
      p.department,
      `"${p.clientOrganization.replace(/"/g, '""')}"`,
      p.clientGstin,
      p.consultancyType,
      p.totalContractValueInr.toFixed(2),
      totalGstInvoiced.toFixed(2),
      p.disbursementSummary.totalPaidBaseAmountInr.toFixed(2),
      p.disbursementSummary.facultyHonorariumInr.toFixed(2),
      p.disbursementSummary.universityCentralOverheadInr.toFixed(2),
      p.disbursementSummary.departmentDevelopmentFundInr.toFixed(2),
      p.status,
      p.auditSha256
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Sample initial dataset for Faculty Consultancy Projects
 */
export const SAMPLE_CONSULTANCY_PROJECTS: ConsultancyProject[] = [
  createConsultancyProject({
    projectTitle: 'Real-Time Battery Management Algorithms for Commercial EV Powertrains',
    leadFacultyId: 'FAC-EE-2016-092',
    leadFacultyName: 'Dr. Vikramaditya Sen (Associate Professor)',
    department: 'Electrical & Electronics Engineering',
    facultyAnnualGrossSalaryInr: 2200000, // ₹22 Lakhs
    coInvestigators: [
      { facultyId: 'FAC-ME-2019-104', name: 'Dr. Arpita Deshmukh', shareRatio: 0.3 }
    ],
    clientOrganization: 'Aether Mobility Technologies Pvt Ltd',
    clientGstin: '29AAACA4011G1Z2',
    clientPan: 'AAACA4011G',
    clientAddress: 'Plot 42, Electronic City Phase 1, Bangalore, Karnataka - 560100',
    consultancyType: 'CORPORATE_R_AND_D',
    mouExecutionDate: '2026-01-15',
    expectedDischargeDate: '2026-10-31',
    milestonesData: [
      {
        title: 'Phase 1: Electrochemical Cell Modeling & Impedance Characterization',
        deliverableDescription: 'Deliverable D1: Matlab/Simulink SoC estimation neural filter model',
        targetCompletionDate: '2026-03-31',
        baseAmountInr: 600000 // ₹6 Lakhs
      },
      {
        title: 'Phase 2: Thermal Runaway Predictive Safety Firmware Implementation',
        deliverableDescription: 'Deliverable D2: Embedded C code optimized for automotive CAN bus controller',
        targetCompletionDate: '2026-07-31',
        baseAmountInr: 900000 // ₹9 Lakhs
      }
    ]
  }),
  createConsultancyProject({
    projectTitle: 'Geotechnical Soil Stability & Seismic Vulnerability Assessment of Metro Viaduct',
    leadFacultyId: 'FAC-CIVIL-2014-041',
    leadFacultyName: 'Prof. Harish Chandra Rao (Professor & Chair)',
    department: 'Civil & Infrastructure Engineering',
    facultyAnnualGrossSalaryInr: 2800000, // ₹28 Lakhs
    clientOrganization: 'National Urban Metro Rail Corporation Ltd',
    clientGstin: '07AAACN5512H1ZQ',
    clientPan: 'AAACN5512H',
    clientAddress: 'Metro Bhawan, Fire Brigade Lane, Barakhamba Road, New Delhi - 110001',
    consultancyType: 'INSTITUTIONAL_FACILITY_TESTING',
    mouExecutionDate: '2026-02-10',
    expectedDischargeDate: '2026-08-31',
    milestonesData: [
      {
        title: 'Triaxial Core Shear Strength & Heavy Shaking Table Testing',
        deliverableDescription: 'Deliverable R1: Full geotechnical lab core test analysis report',
        targetCompletionDate: '2026-05-15',
        baseAmountInr: 1200000 // ₹12 Lakhs
      }
    ]
  })
];
