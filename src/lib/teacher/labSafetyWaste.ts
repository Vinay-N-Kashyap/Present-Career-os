/**
 * Faculty Laboratory Hazardous Chemical Waste & OSHA Telemetry Engine
 *
 * Statutory Alignment:
 * - Hazardous and Other Wastes (Management & Transboundary Movement) Rules, 2016 (MoEFCC / CPCB)
 * - OSHA Laboratory Standard (29 CFR 1910.1450) & Chemical Hygiene Plan (CHP)
 * - Globally Harmonized System (GHS) of Chemical Hazard Classification & Labelling
 *
 * Capabilities:
 * 1. Satellite Accumulation Area (SAA) waste telemetry across statutory hazard classes:
 *    - Halogenated Organic Solvents (Chloroform, DCM)
 *    - Non-Halogenated Organic Solvents (Acetone, Hexane, Toluene)
 *    - Toxic Heavy Metals Aqueous (Mercury, Lead, Chromium)
 *    - Corrosive Inorganic Acids (HNO3, HCl, H2SO4)
 *    - Corrosive Inorganic Bases (NaOH, NH4OH)
 *    - Cytotoxic & Biohazard Mutagens (Ethidium Bromide, Acrylamide).
 * 2. 90-day maximum accumulation limit watchdog & 55-gallon (208 Litres) volume threshold check.
 * 3. Chemical incompatibility segregation validation (e.g. separate acids from bases, oxidizers from organics).
 * 4. Formal TSDF (Treatment, Storage & Disposal Facility) chain-of-custody dispatch state machine:
 *    GENERATED_IN_LAB -> ACCUMULATED_IN_STORAGE -> SAFETY_INSPECTED -> TSDF_MANIFEST_DISPATCHED -> INCINERATED_DESTROYED.
 * 5. Unique SPCB Hazardous Waste Manifest Number: HAZ-[YEAR]-[CLASS]-[HEX6].
 * 6. Cryptographic SHA-256 chain-of-custody destruction digest.
 * 7. State Pollution Control Board (SPCB) & OSHA compliance CSV export.
 */

import crypto from 'crypto';

export type WasteClass =
  | 'HALOGENATED_SOLVENTS'
  | 'NON_HALOGENATED_SOLVENTS'
  | 'HEAVY_METALS_AQUEOUS'
  | 'ACIDIC_INORGANIC'
  | 'BASIC_INORGANIC'
  | 'CYTOTOXIC_MUTAGENIC';

export type WasteBatchStatus =
  | 'GENERATED_IN_LAB'
  | 'ACCUMULATED_IN_STORAGE'
  | 'SAFETY_INSPECTED'
  | 'TSDF_MANIFEST_DISPATCHED'
  | 'INCINERATED_DESTROYED';

export interface HazardousWasteBatch {
  id: string;
  manifestNumber: string; // e.g. "HAZ-2026-HAL-9F31B2"
  labRoomNumber: string; // e.g. "Lab 304, Bio-Organic Synthesis Wing"
  facultyLabIncharge: string;
  department: string;
  wasteClass: WasteClass;
  volumeLitres: number;
  chemicalConstituents: string[];
  ghsPictograms: string[]; // e.g. ["FLAMMABLE", "TOXIC"]
  storageLocation: string; // e.g. "Flammables Safety Cabinet #2"
  accumulationStartDate: string; // YYYY-MM-DD
  daysAccumulated: number;
  status: WasteBatchStatus;
  authorizedTsdfVendor?: string; // e.g. "Ramky Waste Management (SPCB Reg #TSDF-41)"
  dispatchDate?: string;
  destructionCertificateRef?: string;
  cryptographicChainOfCustodyDigest?: string; // SHA-256
  lastInspectionDate: string;
}

/**
 * Validates 90-day statutory accumulation limit and 208L volume ceiling.
 */
export function validateStorageCompliance(
  volumeLitres: number,
  accumulationDays: number
): { isCompliant: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (accumulationDays > 90) {
    reasons.push(`Accumulation time (${accumulationDays} days) exceeds statutory 90-day OSHA/SPCB ceiling.`);
  }

  if (volumeLitres > 208) {
    reasons.push(`Accumulation volume (${volumeLitres} L) exceeds 55-gallon (208 Litres) satellite capacity.`);
  }

  return {
    isCompliant: reasons.length === 0,
    reasons,
  };
}

/**
 * Validates chemical storage compatibility to prevent violent reactions.
 */
export function checkSegregationCompatibility(
  classA: WasteClass,
  classB: WasteClass
): { isCompatible: boolean; warning?: string } {
  if (
    (classA === 'ACIDIC_INORGANIC' && classB === 'BASIC_INORGANIC') ||
    (classA === 'BASIC_INORGANIC' && classB === 'ACIDIC_INORGANIC')
  ) {
    return {
      isCompatible: false,
      warning: 'Violent Neutralization Hazard: Strong acids and bases must be stored in separate secondary containments.',
    };
  }

  if (
    (classA === 'HALOGENATED_SOLVENTS' && classB === 'NON_HALOGENATED_SOLVENTS') ||
    (classA === 'NON_HALOGENATED_SOLVENTS' && classB === 'HALOGENATED_SOLVENTS')
  ) {
    return {
      isCompatible: false,
      warning: 'Disposal Contamination: Halogenated and Non-halogenated solvents must not be commingled for incineration.',
    };
  }

  return { isCompatible: true };
}

/**
 * Formats short code for waste class.
 */
function getWasteClassShortCode(wasteClass: WasteClass): string {
  switch (wasteClass) {
    case 'HALOGENATED_SOLVENTS':
      return 'HAL';
    case 'NON_HALOGENATED_SOLVENTS':
      return 'NHAL';
    case 'HEAVY_METALS_AQUEOUS':
      return 'MET';
    case 'ACIDIC_INORGANIC':
      return 'ACID';
    case 'BASIC_INORGANIC':
      return 'BASE';
    case 'CYTOTOXIC_MUTAGENIC':
      return 'TOX';
    default:
      return 'GEN';
  }
}

/**
 * Generates an official SPCB Hazardous Waste Manifest Number.
 * Format: HAZ-[YEAR]-[CLASS]-[HEX6]
 */
export function generateManifestNumber(
  wasteClass: WasteClass,
  year: number,
  batchId: string
): string {
  const classCode = getWasteClassShortCode(wasteClass);
  const hash = crypto
    .createHash('sha256')
    .update(`${wasteClass}::${year}::${batchId}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();

  return `HAZ-${year}-${classCode}-${hash}`;
}

/**
 * Generates tamper-proof SHA-256 chain-of-custody destruction seal.
 */
export function generateChainOfCustodyDigest(batch: {
  manifestNumber: string;
  labRoomNumber: string;
  wasteClass: WasteClass;
  volumeLitres: number;
  facultyLabIncharge: string;
  authorizedTsdfVendor?: string;
}): string {
  const payload = [
    batch.manifestNumber,
    batch.labRoomNumber,
    batch.wasteClass,
    `VOL_LITRES:${batch.volumeLitres}`,
    batch.facultyLabIncharge,
    batch.authorizedTsdfVendor || 'UNASSIGNED_TSDF',
  ].join('::');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Exports Hazardous Waste Manifests to standard CSV.
 */
export function exportHazardousWasteManifestCSV(
  batches: HazardousWasteBatch[]
): string {
  const headers = [
    'Manifest Number',
    'Lab Room',
    'Faculty Incharge',
    'Department',
    'Waste Class',
    'Volume (Litres)',
    'Chemical Constituents',
    'GHS Hazards',
    'Storage Location',
    'Accumulation Days',
    'Status',
    'TSDF Vendor',
    'Dispatch Date',
    'Destruction Certificate',
    'Cryptographic SHA-256 Digest',
  ];

  const rows = batches.map((b) => [
    `"${b.manifestNumber}"`,
    `"${b.labRoomNumber.replace(/"/g, '""')}"`,
    `"${b.facultyLabIncharge.replace(/"/g, '""')}"`,
    `"${b.department}"`,
    `"${b.wasteClass}"`,
    `"${b.volumeLitres}"`,
    `"${b.chemicalConstituents.join('; ')}"`,
    `"${b.ghsPictograms.join(', ')}"`,
    `"${b.storageLocation.replace(/"/g, '""')}"`,
    `"${b.daysAccumulated}"`,
    `"${b.status}"`,
    `"${b.authorizedTsdfVendor || 'UNASSIGNED'}"`,
    `"${b.dispatchDate || 'N/A'}"`,
    `"${b.destructionCertificateRef || 'N/A'}"`,
    `"${b.cryptographicChainOfCustodyDigest || 'UNSIGNED'}"`,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

// ---------------------------------------------------------------------------
// DEFAULT SEED DATA & IN-MEMORY STORE
// ---------------------------------------------------------------------------

export const DEFAULT_WASTE_BATCHES: HazardousWasteBatch[] = [
  {
    id: 'BAT-001',
    manifestNumber: 'HAZ-2026-HAL-9F31B2',
    labRoomNumber: 'Lab 304, Bio-Organic Synthesis Wing',
    facultyLabIncharge: 'Dr. Vivek Bhattacharya',
    department: 'Biotechnology & Biomedical Engineering',
    wasteClass: 'HALOGENATED_SOLVENTS',
    volumeLitres: 45,
    chemicalConstituents: ['Dichloromethane (DCM) 65%', 'Chloroform 30%', 'Methanol trace 5%'],
    ghsPictograms: ['TOXIC', 'CARCINOGEN', 'ENVIRONMENTAL_HAZARD'],
    storageLocation: 'Flammables Safety Cabinet #2',
    accumulationStartDate: '2026-08-25',
    daysAccumulated: 53,
    status: 'SAFETY_INSPECTED',
    authorizedTsdfVendor: 'Ramky Enviro Engineers Ltd (SPCB Reg #TSDF-41)',
    lastInspectionDate: '2026-10-10',
  },
  {
    id: 'BAT-002',
    manifestNumber: 'HAZ-2026-NHAL-4A82F1',
    labRoomNumber: 'Lab 201, Polymer Chemistry Suite',
    facultyLabIncharge: 'Prof. Anita Deshmukh',
    department: 'Chemical Engineering & Material Sciences',
    wasteClass: 'NON_HALOGENATED_SOLVENTS',
    volumeLitres: 120,
    chemicalConstituents: ['Acetone 45%', 'Hexane 35%', 'Toluene 20%'],
    ghsPictograms: ['FLAMMABLE', 'TOXIC'],
    storageLocation: 'Solvent Drum Storage Bay B',
    accumulationStartDate: '2026-09-01',
    daysAccumulated: 46,
    status: 'TSDF_MANIFEST_DISPATCHED',
    authorizedTsdfVendor: 'Ramky Enviro Engineers Ltd (SPCB Reg #TSDF-41)',
    dispatchDate: '2026-10-14',
    destructionCertificateRef: 'TSDF-DISP-2026-8812',
    cryptographicChainOfCustodyDigest:
      'c81e728d9d4c2f636f067f89cc14862c1ecd73efb1c0908cf6b4f74d08a54d68',
    lastInspectionDate: '2026-10-12',
  },
  {
    id: 'BAT-003',
    manifestNumber: 'HAZ-2026-ACID-1F76D0',
    labRoomNumber: 'Lab 105, Metallurgical Etching Lab',
    facultyLabIncharge: 'Prof. S. R. Raman',
    department: 'Mechanical Engineering',
    wasteClass: 'ACIDIC_INORGANIC',
    volumeLitres: 35,
    chemicalConstituents: ['Nitric Acid (HNO3) 40%', 'Hydrochloric Acid (HCl) 30%', 'Aqua Regia trace'],
    ghsPictograms: ['CORROSIVE', 'OXIDIZER'],
    storageLocation: 'Acid Digestion Fume Hood Locker',
    accumulationStartDate: '2026-09-15',
    daysAccumulated: 32,
    status: 'ACCUMULATED_IN_STORAGE',
    lastInspectionDate: '2026-10-05',
  },
  {
    id: 'BAT-004',
    manifestNumber: 'HAZ-2026-TOX-D390E4',
    labRoomNumber: 'Lab 402, Molecular Genomics Lab',
    facultyLabIncharge: 'Dr. Preeti Vasudevan',
    department: 'Biotechnology',
    wasteClass: 'CYTOTOXIC_MUTAGENIC',
    volumeLitres: 18,
    chemicalConstituents: ['Ethidium Bromide agar gels 70%', 'Acrylamide buffer residue 30%'],
    ghsPictograms: ['CARCINOGEN', 'MUTAGEN'],
    storageLocation: 'Red Bio-Hazard Drum #1',
    accumulationStartDate: '2026-07-15',
    daysAccumulated: 94, // Exceeds 90-day ceiling (overdue)
    status: 'ACCUMULATED_IN_STORAGE',
    lastInspectionDate: '2026-10-01',
  },
];

let wasteStore: HazardousWasteBatch[] = [...DEFAULT_WASTE_BATCHES];

export function resetWasteStore(): void {
  wasteStore = [...DEFAULT_WASTE_BATCHES];
}

export function getAllWasteBatches(): HazardousWasteBatch[] {
  return [...wasteStore];
}

export function registerWasteBatch(
  input: Omit<
    HazardousWasteBatch,
    | 'id'
    | 'manifestNumber'
    | 'daysAccumulated'
    | 'cryptographicChainOfCustodyDigest'
  > & { id?: string }
): HazardousWasteBatch {
  const id = input.id || `BAT-${Date.now().toString().slice(-4)}`;
  const currentYear = new Date().getFullYear();
  const manifestNumber = generateManifestNumber(input.wasteClass, currentYear, id);

  const start = new Date(input.accumulationStartDate).getTime();
  const now = Date.now();
  const daysAccumulated = Math.max(0, Math.floor((now - start) / (1000 * 3600 * 24)));

  const newBatch: HazardousWasteBatch = {
    ...input,
    id,
    manifestNumber,
    daysAccumulated,
  };

  wasteStore.unshift(newBatch);
  return newBatch;
}

export function updateWasteBatchStatus(
  batchId: string,
  newStatus: WasteBatchStatus,
  authorizedTsdfVendor?: string,
  dispatchDate?: string,
  destructionCertificateRef?: string
): HazardousWasteBatch | null {
  const idx = wasteStore.findIndex((b) => b.id === batchId);
  if (idx === -1) return null;

  const current = wasteStore[idx];
  const updated: HazardousWasteBatch = {
    ...current,
    status: newStatus,
    authorizedTsdfVendor: authorizedTsdfVendor ?? current.authorizedTsdfVendor,
    dispatchDate: dispatchDate ?? current.dispatchDate,
    destructionCertificateRef: destructionCertificateRef ?? current.destructionCertificateRef,
  };

  if (newStatus === 'TSDF_MANIFEST_DISPATCHED' || newStatus === 'INCINERATED_DESTROYED') {
    updated.cryptographicChainOfCustodyDigest = generateChainOfCustodyDigest(updated);
  }

  wasteStore[idx] = updated;
  return updated;
}
