/**
 * Faculty Departmental Purchase Requisition & Asset Inward Engine
 * Statutory Compliance: General Financial Rules (GFR 2017) Rule 144/149/166,
 * Departmental Purchase Committee (DPC) & University Dead-Stock Asset Registry.
 *
 * Platform: PinIT Career OS - Teacher Portal & Faculty Governance
 * Zero-Collision Invariant: Pure Branch C administrative and faculty governance.
 */

import { createHash } from 'crypto';

export type IndentCategory =
  | 'LAB_CONSUMABLES'
  | 'RESEARCH_EQUIPMENT_CAPEX'
  | 'SOFTWARE_LICENSES'
  | 'BOOKS_AND_JOURNALS'
  | 'MAINTENANCE_AND_SPARES';

export type BudgetHeadType =
  | 'INST_DEV_FUND'
  | 'EXT_SPONSORED_RESEARCH'
  | 'FACULTY_SEED_GRANT'
  | 'CONSULTANCY_OVERHEAD';

export type IndentStage =
  | 'DRAFTED'
  | 'HOD_RECOMMENDED'
  | 'FINANCE_VETTED'
  | 'PO_ISSUED'
  | 'DELIVERED_INSPECTED'
  | 'ASSET_INWARDED'
  | 'REJECTED';

export interface IndentItem {
  itemId: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number; // in INR
  totalPrice: number;
  hsnCode?: string;
  catalogNumber?: string;
}

export interface FacultyIndentRecord {
  indentId: string;
  indentNumber: string; // IND-[DEPT]-[YEAR]-[HEX6]
  facultyPi: string;
  department: string;
  category: IndentCategory;
  budgetHead: BudgetHeadType;
  budgetProjectCode?: string; // e.g. DST-CRG-2025-0012
  availableBudget: number; // in INR
  totalEstimatedOutlay: number; // in INR
  isPac: boolean; // Proprietary Article Certificate (GFR Rule 166)
  pacJustification?: string;
  items: IndentItem[];
  stage: IndentStage;
  submissionDate: string; // YYYY-MM-DD
  poNumber?: string;
  vendorName?: string;
  assetTagNumber?: string; // AST-[DEPT]-[YEAR]-[HEX6]
  inspectionDate?: string;
  inspectorFaculty?: string;
  invoiceNumber?: string;
  cryptographicSeal?: string; // SHA-256
  remarks?: string;
}

/**
 * Validates budget solvency before sanctioning requisition
 */
export function validateBudgetAvailability(
  requestedAmount: number,
  budgetHeadBalance: number
): boolean {
  return requestedAmount > 0 && requestedAmount <= budgetHeadBalance;
}

/**
 * Generates unique departmental indent token: IND-[DEPT]-[YEAR]-[HEX6]
 */
export function generateIndentToken(department: string): string {
  const deptCode = department
    .replace(/[^A-Za-z]/g, '')
    .slice(0, 4)
    .toUpperCase() || 'DEPT';
  const year = new Date().getFullYear();
  const hex = createHash('sha256')
    .update(`${deptCode}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .slice(0, 6)
    .toUpperCase();
  return `IND-${deptCode}-${year}-${hex}`;
}

/**
 * Generates central dead-stock asset tag: AST-[DEPT]-[YEAR]-[HEX6]
 */
export function generateAssetTag(department: string): string {
  const deptCode = department
    .replace(/[^A-Za-z]/g, '')
    .slice(0, 4)
    .toUpperCase() || 'ASST';
  const year = new Date().getFullYear();
  const hex = createHash('sha256')
    .update(`AST-${deptCode}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .slice(0, 6)
    .toUpperCase();
  return `AST-${deptCode}-${year}-${hex}`;
}

/**
 * Computes tamper-proof SHA-256 inspection & asset inwarding seal
 */
export function generateInspectionCertificateSeal(
  indentNumber: string,
  assetTag: string,
  inspector: string,
  invoiceNumber: string,
  totalAmount: number
): string {
  const payload = [
    indentNumber,
    assetTag,
    inspector,
    invoiceNumber,
    totalAmount.toFixed(2),
    new Date().toISOString().split('T')[0],
  ].join('||');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Creates new faculty purchase requisition
 */
export function createFacultyIndent(params: {
  facultyPi: string;
  department: string;
  category: IndentCategory;
  budgetHead: BudgetHeadType;
  budgetProjectCode?: string;
  availableBudget: number;
  items: Omit<IndentItem, 'totalPrice'>[];
  isPac?: boolean;
  pacJustification?: string;
}): FacultyIndentRecord {
  const itemsWithTotal: IndentItem[] = params.items.map((it) => ({
    ...it,
    totalPrice: it.quantity * it.estimatedUnitPrice,
  }));

  const totalEstimatedOutlay = itemsWithTotal.reduce((acc, it) => acc + it.totalPrice, 0);

  if (!validateBudgetAvailability(totalEstimatedOutlay, params.availableBudget)) {
    throw new Error('Requested outlay exceeds available departmental/grant budget head');
  }

  const indentNumber = generateIndentToken(params.department);
  const indentId = `IND-${Date.now().toString(36)}`;

  return {
    indentId,
    indentNumber,
    facultyPi: params.facultyPi,
    department: params.department,
    category: params.category,
    budgetHead: params.budgetHead,
    budgetProjectCode: params.budgetProjectCode,
    availableBudget: params.availableBudget,
    totalEstimatedOutlay,
    isPac: Boolean(params.isPac),
    pacJustification: params.pacJustification,
    items: itemsWithTotal,
    stage: 'DRAFTED',
    submissionDate: new Date().toISOString().split('T')[0],
  };
}

/**
 * Advances the indent lifecycle stage
 */
export function advanceIndentStage(
  indent: FacultyIndentRecord,
  nextStage: IndentStage,
  additionalDetails?: {
    poNumber?: string;
    vendorName?: string;
    remarks?: string;
  }
): FacultyIndentRecord {
  return {
    ...indent,
    stage: nextStage,
    poNumber: additionalDetails?.poNumber || indent.poNumber,
    vendorName: additionalDetails?.vendorName || indent.vendorName,
    remarks: additionalDetails?.remarks || indent.remarks,
  };
}

/**
 * Completes consignment receipt, inspection, dead-stock asset tagging and cryptographic sealing
 */
export function completeAssetInwarding(
  indent: FacultyIndentRecord,
  inspectorFaculty: string,
  invoiceNumber: string
): FacultyIndentRecord {
  const assetTagNumber = generateAssetTag(indent.department);
  const inspectionDate = new Date().toISOString().split('T')[0];

  const cryptographicSeal = generateInspectionCertificateSeal(
    indent.indentNumber,
    assetTagNumber,
    inspectorFaculty,
    invoiceNumber,
    indent.totalEstimatedOutlay
  );

  return {
    ...indent,
    stage: 'ASSET_INWARDED',
    assetTagNumber,
    inspectionDate,
    inspectorFaculty,
    invoiceNumber,
    cryptographicSeal,
  };
}

/**
 * Exports faculty indent and dead-stock registry CSV for DPC audits
 */
export function exportFacultyIndentsCSV(indents: FacultyIndentRecord[]): string {
  const headers = [
    'Indent Number',
    'Faculty PI',
    'Department',
    'Category',
    'Item Summary',
    'Budget Head',
    'Budget Project Code',
    'Total Outlay (INR)',
    'PAC (GFR 166)',
    'Stage',
    'PO Number',
    'Vendor Name',
    'Asset Tag Number',
    'Inspection Date',
    'Inspector Faculty',
    'Invoice Number',
    'Cryptographic SHA-256 Seal',
  ];

  const escapeField = (val: string | number | boolean | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = indents.map((i) =>
    [
      escapeField(i.indentNumber),
      escapeField(i.facultyPi),
      escapeField(i.department),
      escapeField(i.category),
      escapeField(i.items.map((it) => it.description).join('; ')),
      escapeField(i.budgetHead),
      escapeField(i.budgetProjectCode ?? 'N/A'),
      escapeField(i.totalEstimatedOutlay),
      escapeField(i.isPac ? 'YES' : 'NO'),
      escapeField(i.stage),
      escapeField(i.poNumber ?? 'N/A'),
      escapeField(i.vendorName ?? 'N/A'),
      escapeField(i.assetTagNumber ?? 'N/A'),
      escapeField(i.inspectionDate ?? 'N/A'),
      escapeField(i.inspectorFaculty ?? 'N/A'),
      escapeField(i.invoiceNumber ?? 'N/A'),
      escapeField(i.cryptographicSeal ?? 'N/A'),
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Seed Dataset for Faculty Indents and Requisitions
 */
export const SEED_INDENTS: FacultyIndentRecord[] = [
  {
    indentId: 'IND-001',
    indentNumber: 'IND-ELEC-2026-90AE12',
    facultyPi: 'Prof. Arvind Swaminathan',
    department: 'Electrical & Electronics Engineering',
    category: 'RESEARCH_EQUIPMENT_CAPEX',
    budgetHead: 'EXT_SPONSORED_RESEARCH',
    budgetProjectCode: 'DST-SERB-CRG-2024-88',
    availableBudget: 3_500_000,
    totalEstimatedOutlay: 1_850_000,
    isPac: true,
    pacJustification: 'Keysight Infiniium 4-Channel 4GHz High-Bandwidth Real-Time Oscilloscope with proprietary pulse analysis firmware (GFR Rule 166).',
    stage: 'ASSET_INWARDED',
    submissionDate: '2026-01-20',
    poNumber: 'PO-2026-EE-0091',
    vendorName: 'Keysight Technologies India Pvt Ltd',
    assetTagNumber: 'AST-ELEC-2026-44DF10',
    inspectionDate: '2026-02-28',
    inspectorFaculty: 'Dr. M. S. Narayanan (Lab In-charge)',
    invoiceNumber: 'INV-KEY-2026-4401',
    cryptographicSeal: 'c58f01b9a89d1204859d042bb8481e1948502847c1a2e46b9a8039281745cd12',
    items: [
      {
        itemId: 'ITM-01',
        description: 'Keysight Infiniium MXR-Series 4-Channel Real-Time Oscilloscope (4GHz, 16 GSa/s)',
        quantity: 1,
        unit: 'Unit',
        estimatedUnitPrice: 1_650_000,
        totalPrice: 1_650_000,
        catalogNumber: 'MXR404A',
      },
      {
        itemId: 'ITM-02',
        description: 'Differential Active Probe Set 3.5 GHz with accessory kit',
        quantity: 2,
        unit: 'Set',
        estimatedUnitPrice: 100_000,
        totalPrice: 200_000,
        catalogNumber: 'N2750A',
      },
    ],
  },
  {
    indentId: 'IND-002',
    indentNumber: 'IND-CHEM-2026-1188BC',
    facultyPi: 'Dr. Meenakshi Sundaram',
    department: 'Department of Chemistry',
    category: 'LAB_CONSUMABLES',
    budgetHead: 'INST_DEV_FUND',
    availableBudget: 800_000,
    totalEstimatedOutlay: 420_000,
    isPac: false,
    stage: 'PO_ISSUED',
    submissionDate: '2026-02-05',
    poNumber: 'PO-2026-CH-0142',
    vendorName: 'Sigma-Aldrich Chemicals Pvt Ltd (Merck)',
    items: [
      {
        itemId: 'ITM-10',
        description: 'Deuterated Chloroform (CDCl3 99.8 atom % D with 0.03% v/v TMS)',
        quantity: 20,
        unit: 'Bottle (100ml)',
        estimatedUnitPrice: 6_000,
        totalPrice: 120_000,
        catalogNumber: 'SIG-151858',
      },
      {
        itemId: 'ITM-11',
        description: 'HPLC Grade Acetonitrile (MeCN >= 99.9% spectrophotometric grade)',
        quantity: 50,
        unit: 'Winchester (2.5L)',
        estimatedUnitPrice: 6_000,
        totalPrice: 300_000,
        catalogNumber: 'SIG-34851',
      },
    ],
  },
  {
    indentId: 'IND-003',
    indentNumber: 'IND-COMP-2026-3392FF',
    facultyPi: 'Dr. Rajiv Malhotra',
    department: 'Computer Science & Engineering',
    category: 'SOFTWARE_LICENSES',
    budgetHead: 'FACULTY_SEED_GRANT',
    budgetProjectCode: 'SEED-CSE-2025-04',
    availableBudget: 500_000,
    totalEstimatedOutlay: 350_000,
    isPac: true,
    pacJustification: 'Academic campus license for MATLAB & Simulink Parallel Computing Toolbox for Deep Learning research group.',
    stage: 'FINANCE_VETTED',
    submissionDate: '2026-02-14',
    items: [
      {
        itemId: 'ITM-20',
        description: 'MathWorks MATLAB Academic Campus Network Concurrent 25-Seat License',
        quantity: 1,
        unit: 'License Pack',
        estimatedUnitPrice: 350_000,
        totalPrice: 350_000,
        catalogNumber: 'MW-ACAD-25',
      },
    ],
  },
  {
    indentId: 'IND-004',
    indentNumber: 'IND-MECH-2026-7788AA',
    facultyPi: 'Prof. K. R. Nambiar',
    department: 'Mechanical Engineering',
    category: 'MAINTENANCE_AND_SPARES',
    budgetHead: 'CONSULTANCY_OVERHEAD',
    budgetProjectCode: 'SRIC-2026-MECH-C1',
    availableBudget: 600_000,
    totalEstimatedOutlay: 180_000,
    isPac: false,
    stage: 'HOD_RECOMMENDED',
    submissionDate: '2026-02-22',
    items: [
      {
        itemId: 'ITM-30',
        description: 'Replacement Tungsten Carbide CNC Tool Inserts & Collet Chucks',
        quantity: 15,
        unit: 'Pack of 10',
        estimatedUnitPrice: 12_000,
        totalPrice: 180_000,
        catalogNumber: 'SANDVIK-CNMG',
      },
    ],
  },
];
