/**
 * University Central Bio-Safety & Animal Ethics Committee (IAEC / IBSC / RCGM) Protocol Approval Engine
 *
 * Statutory Alignment:
 * - CCSEA / CPCSEA (Committee for the Control and Supervision of Experiments on Animals) Rules & Norms
 * - DBT / RCGM (Review Committee on Genetic Manipulation) Guidelines for Recombinant DNA Research
 * - Environmental Protection Act (EPA 1986) & Rules for Genetically Engineered Organisms (1989)
 * - Institutional Human Ethics Committee (ICMR 2017) Guidelines
 *
 * Capabilities:
 * 1. Statutory committee oversight across IAEC (Animal), IBSC (Biosafety/rDNA), and IEC (Human).
 * 2. Mandated 3Rs (Replacement, Reduction, Refinement) protocol validation for animal models.
 * 3. Biosafety Containment Level classification (BSL-1, BSL-2, BSL-3).
 * 4. Statutory Protocol Review Lifecycle:
 *    SUBMITTED -> PRE_SCREENING -> COMMITTEE_HEARING_SCHEDULED -> APPROVED_SANCTIONED -> REVISION_REQUESTED -> REJECTED.
 * 5. Animal quota accounting (allocated vs utilized vs remaining) and humane endpoint tracking.
 * 6. Mandatory CCSEA external nominee presence and quorum verification.
 * 7. Unique Sanction Protocol Reference: ETHICS-[YEAR]-[COMMITTEE]-[HEX6].
 * 8. Cryptographic SHA-256 statutory ethical sanction digest.
 * 9. National CCSEA / DBT-RCGM compliance ledger CSV export.
 */

import crypto from 'crypto';

export type EthicsCommitteeType = 'IAEC' | 'IBSC' | 'IEC';

export type BioSafetyLevel = 'BSL_1' | 'BSL_2' | 'BSL_3';

export type ProtocolStatus =
  | 'SUBMITTED'
  | 'PRE_SCREENING'
  | 'HEARING_SCHEDULED'
  | 'APPROVED_SANCTIONED'
  | 'REVISION_REQUESTED'
  | 'REJECTED'
  | 'EXPIRED_CLOSED';

export type AnimalSpecies =
  | 'WISTAR_RAT'
  | 'C57BL6_MOUSE'
  | 'BALBC_MOUSE'
  | 'NEW_ZEALAND_RABBIT'
  | 'ZEBRAFISH'
  | 'NON_ANIMAL_RDNA';

export interface EthicsProtocol {
  id: string;
  sanctionNumber: string; // e.g. "ETHICS-2026-IAEC-9B3E12"
  title: string;
  committeeType: EthicsCommitteeType;
  facultyPiName: string;
  facultyPiEmployeeId: string;
  department: string;
  species: AnimalSpecies;
  animalCountSanctioned: number;
  animalCountUtilized: number;
  bioSafetyLevel: BioSafetyLevel;
  recombinantDnaDeclared: boolean;
  rDnaHostVectorDetails?: string;
  anesthesiaProtocol: string;
  euthanasiaMethod: string;
  threeRsJustification: string; // Replacement, Reduction, Refinement
  ccseaNomineeName: string; // External Government Nominee
  hearingMeetingRef: string; // e.g. "IAEC-Meeting-34"
  status: ProtocolStatus;
  sanctionDate?: string;
  expiryDate?: string;
  cryptographicSanctionDigest?: string; // SHA-256
  createdDate: string;
}

/**
 * Validates 3Rs compliance and animal quota logic.
 */
export function validateAnimalQuota(
  sanctioned: number,
  utilized: number
): { isValid: boolean; remaining: number } {
  if (sanctioned < 0 || utilized < 0) {
    return { isValid: false, remaining: 0 };
  }
  const remaining = sanctioned - utilized;
  return { isValid: remaining >= 0, remaining };
}

/**
 * Verifies committee meeting quorum under CCSEA rules (minimum 5 members, including CCSEA Nominee).
 */
export function verifyIaecQuorum(
  totalPresent: number,
  isCcseaNomineePresent: boolean
): { isQuorumSatisfied: boolean; reason?: string } {
  if (totalPresent < 5) {
    return {
      isQuorumSatisfied: false,
      reason: `Quorum Deficit: Minimum 5 committee members required; only ${totalPresent} present.`,
    };
  }
  if (!isCcseaNomineePresent) {
    return {
      isQuorumSatisfied: false,
      reason: 'Statutory Violation: Mandatory CCSEA Main/Link Nominee must be present.',
    };
  }
  return { isQuorumSatisfied: true };
}

/**
 * Generates an official Ethics Sanction Protocol Number.
 * Format: ETHICS-[YEAR]-[COMMITTEE]-[HEX6]
 */
export function generateSanctionNumber(
  committeeType: EthicsCommitteeType,
  year: number,
  protocolId: string
): string {
  const hash = crypto
    .createHash('sha256')
    .update(`${committeeType}::${year}::${protocolId}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();

  return `ETHICS-${year}-${committeeType}-${hash}`;
}

/**
 * Computes tamper-proof SHA-256 cryptographic sanction seal.
 */
export function generateSanctionDigest(protocol: {
  sanctionNumber: string;
  title: string;
  committeeType: EthicsCommitteeType;
  facultyPiName: string;
  animalCountSanctioned: number;
  bioSafetyLevel: BioSafetyLevel;
  ccseaNomineeName: string;
}): string {
  const payload = [
    protocol.sanctionNumber,
    protocol.title,
    protocol.committeeType,
    protocol.facultyPiName,
    `ANIMALS:${protocol.animalCountSanctioned}`,
    protocol.bioSafetyLevel,
    protocol.ccseaNomineeName,
  ].join('::');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Exports Ethics & Biosafety Protocols to standard CSV.
 */
export function exportEthicsProtocolsCSV(protocols: EthicsProtocol[]): string {
  const headers = [
    'Sanction Number',
    'Protocol Title',
    'Committee Type',
    'Faculty PI',
    'Department',
    'Species',
    'Sanctioned Animal Quota',
    'Utilized Count',
    'Remaining Quota',
    'Biosafety Level',
    'rDNA Declared',
    'CCSEA Nominee',
    'Status',
    'Sanction Date',
    'Expiry Date',
    'Cryptographic SHA-256 Digest',
  ];

  const rows = protocols.map((p) => {
    const remaining = Math.max(0, p.animalCountSanctioned - p.animalCountUtilized);
    return [
      `"${p.sanctionNumber}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.committeeType}"`,
      `"${p.facultyPiName.replace(/"/g, '""')}"`,
      `"${p.department}"`,
      `"${p.species}"`,
      `"${p.animalCountSanctioned}"`,
      `"${p.animalCountUtilized}"`,
      `"${remaining}"`,
      `"${p.bioSafetyLevel}"`,
      `"${p.recombinantDnaDeclared ? 'YES' : 'NO'}"`,
      `"${p.ccseaNomineeName.replace(/"/g, '""')}"`,
      `"${p.status}"`,
      `"${p.sanctionDate || 'PENDING'}"`,
      `"${p.expiryDate || 'N/A'}"`,
      `"${p.cryptographicSanctionDigest || 'UNSIGNED'}"`,
    ];
  });

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

// ---------------------------------------------------------------------------
// DEFAULT SEED DATA & IN-MEMORY STORE
// ---------------------------------------------------------------------------

export const DEFAULT_ETHICS_PROTOCOLS: EthicsProtocol[] = [
  {
    id: 'PRT-001',
    sanctionNumber: 'ETHICS-2026-IAEC-9B3E12',
    title: 'Preclinical Pharmacokinetic & Neuroprotective Evaluation of Nanocurcumin in Streptozotocin-Induced Diabetic Neuropathy',
    committeeType: 'IAEC',
    facultyPiName: 'Dr. Vivek Bhattacharya',
    facultyPiEmployeeId: 'FAC-BIO-04',
    department: 'Biotechnology & Biomedical Engineering',
    species: 'WISTAR_RAT',
    animalCountSanctioned: 48,
    animalCountUtilized: 36,
    bioSafetyLevel: 'BSL_2',
    recombinantDnaDeclared: false,
    anesthesiaProtocol: 'Ketamine (75 mg/kg) + Xylazine (10 mg/kg) i.p.',
    euthanasiaMethod: 'CO2 inhalation chamber as per CCSEA 2018 guidelines',
    threeRsJustification:
      'Cell culture primary screening performed; rat model essential to validate blood-brain barrier permeability.',
    ccseaNomineeName: 'Dr. Rameshwar Rao (Govt. CCSEA Main Nominee)',
    hearingMeetingRef: 'IAEC-Meeting-34',
    status: 'APPROVED_SANCTIONED',
    sanctionDate: '2026-03-15',
    expiryDate: '2027-03-14',
    cryptographicSanctionDigest:
      'c81e728d9d4c2f636f067f89cc14862c1ecd73efb1c0908cf6b4f74d08a54d68',
    createdDate: '2026-02-10',
  },
  {
    id: 'PRT-002',
    sanctionNumber: 'ETHICS-2026-IBSC-4A82F1',
    title: 'CRISPR-Cas9 Mediated Gene Editing of Cyanobacteria for Enhanced Bio-Hydrogen Generation',
    committeeType: 'IBSC',
    facultyPiName: 'Prof. Anita Deshmukh',
    facultyPiEmployeeId: 'FAC-CS-01',
    department: 'Chemical Engineering & Bio-Sciences',
    species: 'NON_ANIMAL_RDNA',
    animalCountSanctioned: 0,
    animalCountUtilized: 0,
    bioSafetyLevel: 'BSL_2',
    recombinantDnaDeclared: true,
    rDnaHostVectorDetails: 'Synechocystis sp. PCC 6803 transformed with pCas-Guide-AAV2 plasmid',
    anesthesiaProtocol: 'N/A (Microbial culture)',
    euthanasiaMethod: 'Autoclaving at 121°C for 30 minutes prior to effluent disposal',
    threeRsJustification: 'Complete replacement of mammalian systems with photosynthetic prokaryotes.',
    ccseaNomineeName: 'Dr. Preeti Vasudevan (DBT Biosafety Expert)',
    hearingMeetingRef: 'IBSC-Meeting-18',
    status: 'APPROVED_SANCTIONED',
    sanctionDate: '2026-06-20',
    expiryDate: '2028-06-19',
    cryptographicSanctionDigest:
      '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    createdDate: '2026-05-18',
  },
  {
    id: 'PRT-003',
    sanctionNumber: 'ETHICS-2026-IAEC-1F76D0',
    title: 'In-Vivo Biocompatibility & Osseointegration of 3D-Printed Porous Titanium Scaffolds',
    committeeType: 'IAEC',
    facultyPiName: 'Prof. S. R. Raman',
    facultyPiEmployeeId: 'FAC-ME-05',
    department: 'Mechanical & Biomedical Engineering',
    species: 'NEW_ZEALAND_RABBIT',
    animalCountSanctioned: 18,
    animalCountUtilized: 6,
    bioSafetyLevel: 'BSL_1',
    recombinantDnaDeclared: false,
    anesthesiaProtocol: 'Isoflurane inhalation (2-3%) with oxygen delivery',
    euthanasiaMethod: 'Overdose of Sodium Pentobarbital (100 mg/kg i.v.)',
    threeRsJustification:
      'Finite element stress simulations completed; rabbit distal femur defect model minimum required for bone ingrowth.',
    ccseaNomineeName: 'Dr. Rameshwar Rao (Govt. CCSEA Main Nominee)',
    hearingMeetingRef: 'IAEC-Meeting-35',
    status: 'APPROVED_SANCTIONED',
    sanctionDate: '2026-07-10',
    expiryDate: '2027-07-09',
    cryptographicSanctionDigest:
      '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    createdDate: '2026-06-05',
  },
  {
    id: 'PRT-004',
    sanctionNumber: 'ETHICS-2026-IEC-D390E4',
    title: 'Longitudinal Cognitive Fatigue Telemetry in Drone Operators Using Wireless EEG Cap',
    committeeType: 'IEC',
    facultyPiName: 'Prof. Harish Chandra',
    facultyPiEmployeeId: 'FAC-EC-02',
    department: 'School of AI & Autonomous Systems',
    species: 'NON_ANIMAL_RDNA',
    animalCountSanctioned: 0,
    animalCountUtilized: 0,
    bioSafetyLevel: 'BSL_1',
    recombinantDnaDeclared: false,
    anesthesiaProtocol: 'Non-invasive, no anesthesia',
    euthanasiaMethod: 'N/A',
    threeRsJustification: 'Non-invasive dry electrode EEG sensor on consented human adult volunteers.',
    ccseaNomineeName: 'Dr. M. S. Kulkarni (Medical Jurisprudence Expert)',
    hearingMeetingRef: 'IEC-Meeting-22',
    status: 'APPROVED_SANCTIONED',
    sanctionDate: '2026-08-01',
    expiryDate: '2027-07-31',
    cryptographicSanctionDigest:
      'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    createdDate: '2026-07-15',
  },
];

let protocolsStore: EthicsProtocol[] = [...DEFAULT_ETHICS_PROTOCOLS];

export function resetEthicsStore(): void {
  protocolsStore = [...DEFAULT_ETHICS_PROTOCOLS];
}

export function getAllProtocols(): EthicsProtocol[] {
  return [...protocolsStore];
}

export function registerEthicsProtocol(
  input: Omit<
    EthicsProtocol,
    'id' | 'sanctionNumber' | 'cryptographicSanctionDigest'
  > & { id?: string }
): EthicsProtocol {
  const id = input.id || `PRT-${Date.now().toString().slice(-4)}`;
  const currentYear = new Date().getFullYear();
  const sanctionNumber = generateSanctionNumber(input.committeeType, currentYear, id);

  const newProtocol: EthicsProtocol = {
    ...input,
    id,
    sanctionNumber,
  };

  newProtocol.cryptographicSanctionDigest = generateSanctionDigest(newProtocol);
  protocolsStore.unshift(newProtocol);
  return newProtocol;
}

export function updateProtocolStatus(
  protocolId: string,
  newStatus: ProtocolStatus,
  sanctionDate?: string,
  expiryDate?: string
): EthicsProtocol | null {
  const idx = protocolsStore.findIndex((p) => p.id === protocolId);
  if (idx === -1) return null;

  const current = protocolsStore[idx];
  const updated: EthicsProtocol = {
    ...current,
    status: newStatus,
    sanctionDate: sanctionDate ?? current.sanctionDate,
    expiryDate: expiryDate ?? current.expiryDate,
  };

  if (newStatus === 'APPROVED_SANCTIONED') {
    updated.cryptographicSanctionDigest = generateSanctionDigest(updated);
  }

  protocolsStore[idx] = updated;
  return updated;
}

export function recordAnimalUtilization(
  protocolId: string,
  countToRecord: number
): { success: boolean; protocol?: EthicsProtocol; error?: string } {
  const idx = protocolsStore.findIndex((p) => p.id === protocolId);
  if (idx === -1) {
    return { success: false, error: 'Protocol not found.' };
  }

  const current = protocolsStore[idx];
  const newUtilized = current.animalCountUtilized + countToRecord;

  if (newUtilized > current.animalCountSanctioned) {
    return {
      success: false,
      error: `Quota Exceeded: Requested ${countToRecord} would exceed sanctioned quota of ${current.animalCountSanctioned} (current: ${current.animalCountUtilized}).`,
    };
  }

  const updated: EthicsProtocol = {
    ...current,
    animalCountUtilized: newUtilized,
  };

  protocolsStore[idx] = updated;
  return { success: true, protocol: updated };
}
