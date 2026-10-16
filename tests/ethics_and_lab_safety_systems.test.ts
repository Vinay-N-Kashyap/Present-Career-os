import test, { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  validateAnimalQuota,
  verifyIaecQuorum,
  generateSanctionNumber,
  generateSanctionDigest,
  exportEthicsProtocolsCSV,
  getAllProtocols,
  registerEthicsProtocol,
  updateProtocolStatus,
  recordAnimalUtilization,
  resetEthicsStore,
  EthicsProtocol,
} from '../src/lib/admin/iaecAnimalEthics.ts';

import {
  validateStorageCompliance,
  checkSegregationCompatibility,
  generateManifestNumber,
  generateChainOfCustodyDigest,
  exportHazardousWasteManifestCSV,
  getAllWasteBatches,
  registerWasteBatch,
  updateWasteBatchStatus,
  resetWasteStore,
  HazardousWasteBatch,
} from '../src/lib/teacher/labSafetyWaste.ts';

describe('TASK-970: Institutional Ethics & Laboratory Chemical Safety Systems Suite', () => {
  beforeEach(() => {
    resetEthicsStore();
    resetWasteStore();
  });

  describe('TASK-966: University Bio-Safety & Animal Ethics Committee (IAEC / IBSC) Engine', () => {
    it('validates 3Rs animal quota calculations and remaining balance', () => {
      const q1 = validateAnimalQuota(48, 36);
      assert.equal(q1.isValid, true);
      assert.equal(q1.remaining, 12);

      const q2 = validateAnimalQuota(48, 48);
      assert.equal(q2.isValid, true);
      assert.equal(q2.remaining, 0);

      const q3 = validateAnimalQuota(48, 50);
      assert.equal(q3.isValid, false);
      assert.equal(q3.remaining, -2);
    });

    it('verifies CCSEA mandatory quorum rules (min 5 members including CCSEA Nominee)', () => {
      // Valid meeting
      const v1 = verifyIaecQuorum(6, true);
      assert.equal(v1.isQuorumSatisfied, true);

      // Quorum deficit (< 5 members)
      const v2 = verifyIaecQuorum(4, true);
      assert.equal(v2.isQuorumSatisfied, false);
      assert.ok(v2.reason?.includes('Minimum 5'));

      // Missing CCSEA Nominee
      const v3 = verifyIaecQuorum(7, false);
      assert.equal(v3.isQuorumSatisfied, false);
      assert.ok(v3.reason?.includes('CCSEA Main/Link Nominee'));
    });

    it('registers ethics protocol and generates sanction number and SHA-256 seal', () => {
      const initialCount = getAllProtocols().length;

      const registered = registerEthicsProtocol({
        id: 'PRT-TEST-1',
        title: 'Safety Evaluation of Antimicrobial Peptide Hydrogel in Murine Wound Model',
        committeeType: 'IAEC',
        facultyPiName: 'Dr. Vivek Bhattacharya',
        facultyPiEmployeeId: 'FAC-BIO-04',
        department: 'Biotechnology & Biomedical Engineering',
        species: 'BALBC_MOUSE',
        animalCountSanctioned: 24,
        animalCountUtilized: 0,
        bioSafetyLevel: 'BSL_2',
        recombinantDnaDeclared: false,
        anesthesiaProtocol: 'Ketamine/Xylazine cocktail',
        euthanasiaMethod: 'CO2 asphyxiation',
        threeRsJustification: 'In-vitro biofilm assay completed; mice model minimal required.',
        ccseaNomineeName: 'Dr. Rameshwar Rao',
        hearingMeetingRef: 'IAEC-Meeting-36',
        status: 'APPROVED_SANCTIONED',
        sanctionDate: '2026-10-17',
        expiryDate: '2027-10-16',
        createdDate: '2026-10-17',
      });

      assert.equal(getAllProtocols().length, initialCount + 1);
      assert.ok(registered.sanctionNumber.startsWith('ETHICS-2026-IAEC-'));
      assert.ok(
        registered.cryptographicSanctionDigest &&
          registered.cryptographicSanctionDigest.length === 64
      );
    });

    it('records animal utilization and prevents exceeding sanctioned quota', () => {
      // Protocol PRT-001 has sanctioned: 48, utilized: 36 (remaining: 12)
      const res1 = recordAnimalUtilization('PRT-001', 6);
      assert.equal(res1.success, true);
      assert.equal(res1.protocol?.animalCountUtilized, 42);

      // Attempt to record 10 (would make 52 > 48 quota)
      const res2 = recordAnimalUtilization('PRT-001', 10);
      assert.equal(res2.success, false);
      assert.ok(res2.error?.includes('Quota Exceeded'));
    });

    it('exports CCSEA and DBT-RCGM Ethics Protocols CSV with proper headers', () => {
      const protocols = getAllProtocols();
      const csv = exportEthicsProtocolsCSV(protocols);

      assert.ok(csv.includes('Sanction Number,Protocol Title,Committee Type'));
      assert.ok(csv.includes('ETHICS-2026-IAEC-9B3E12'));
      assert.ok(csv.includes('WISTAR_RAT'));
      assert.ok(csv.includes('BSL_2'));
    });
  });

  describe('TASK-968: Faculty Laboratory Chemical Safety & OSHA Hazardous Waste Engine', () => {
    it('validates 90-day storage ceiling and 208L volume capacity limits', () => {
      // Compliant batch (45L, 30 days)
      const c1 = validateStorageCompliance(45, 30);
      assert.equal(c1.isCompliant, true);
      assert.equal(c1.reasons.length, 0);

      // Overdue batch (95 days)
      const c2 = validateStorageCompliance(45, 95);
      assert.equal(c2.isCompliant, false);
      assert.ok(c2.reasons[0].includes('exceeds statutory 90-day'));

      // Overflow batch (250 Litres)
      const c3 = validateStorageCompliance(250, 40);
      assert.equal(c3.isCompliant, false);
      assert.ok(c3.reasons[0].includes('exceeds 55-gallon'));
    });

    it('enforces chemical waste segregation and incompatibility checks', () => {
      // Incompatible: Acids and Bases
      const check1 = checkSegregationCompatibility('ACIDIC_INORGANIC', 'BASIC_INORGANIC');
      assert.equal(check1.isCompatible, false);
      assert.ok(check1.warning?.includes('Violent Neutralization Hazard'));

      // Incompatible: Halogenated and Non-halogenated solvents
      const check2 = checkSegregationCompatibility('HALOGENATED_SOLVENTS', 'NON_HALOGENATED_SOLVENTS');
      assert.equal(check2.isCompatible, false);
      assert.ok(check2.warning?.includes('Disposal Contamination'));

      // Compatible: Solvents and Heavy metals in separate aqueous
      const check3 = checkSegregationCompatibility('HEAVY_METALS_AQUEOUS', 'CYTOTOXIC_MUTAGENIC');
      assert.equal(check3.isCompatible, true);
    });

    it('registers hazardous chemical waste batch and generates manifest number', () => {
      const initialCount = getAllWasteBatches().length;

      const registered = registerWasteBatch({
        id: 'BAT-TEST-1',
        labRoomNumber: 'Lab 501, Nanomaterials Lab',
        facultyLabIncharge: 'Prof. Anita Deshmukh',
        department: 'Chemical Engineering',
        wasteClass: 'ACIDIC_INORGANIC',
        volumeLitres: 25,
        chemicalConstituents: ['Sulfuric Acid 50%', 'Hydrogen Peroxide 30% (Piranha Solution)'],
        ghsPictograms: ['CORROSIVE', 'OXIDIZER'],
        storageLocation: 'Corrosives Safety Cabinet #1',
        accumulationStartDate: '2026-10-10',
        status: 'ACCUMULATED_IN_STORAGE',
        lastInspectionDate: '2026-10-17',
      });

      assert.equal(getAllWasteBatches().length, initialCount + 1);
      assert.ok(registered.manifestNumber.startsWith('HAZ-2026-ACID-'));
      assert.equal(registered.volumeLitres, 25);
    });

    it('dispatches waste manifest to TSDF vendor and generates SHA-256 chain-of-custody seal', () => {
      const updated = updateWasteBatchStatus(
        'BAT-001',
        'TSDF_MANIFEST_DISPATCHED',
        'Ramky Enviro Engineers Ltd (SPCB Reg #TSDF-41)',
        '2026-10-17',
        'TSDF-CERT-2026-1092'
      );

      assert.ok(updated);
      assert.equal(updated.status, 'TSDF_MANIFEST_DISPATCHED');
      assert.equal(updated.authorizedTsdfVendor, 'Ramky Enviro Engineers Ltd (SPCB Reg #TSDF-41)');
      assert.ok(
        updated.cryptographicChainOfCustodyDigest &&
          updated.cryptographicChainOfCustodyDigest.length === 64
      );
    });

    it('exports SPCB Hazardous Waste Manifests CSV with proper formatting and escaping', () => {
      const batches = getAllWasteBatches();
      const csv = exportHazardousWasteManifestCSV(batches);

      assert.ok(csv.includes('Manifest Number,Lab Room,Faculty Incharge'));
      assert.ok(csv.includes('HAZ-2026-HAL-9F31B2'));
      assert.ok(csv.includes('HALOGENATED_SOLVENTS'));
      assert.ok(csv.includes('Dichloromethane (DCM) 65%'));
    });
  });
});
