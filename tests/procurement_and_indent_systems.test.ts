import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  determineProcurementMode,
  calculateTenderSecurities,
  evaluateTwoBids,
  generateTenderReference,
  registerTenderNotice,
  awardTenderContract,
  exportProcurementLedgerCSV,
  BidderSubmission,
} from '../src/lib/admin/centralProcurement';

import {
  validateBudgetAvailability,
  generateIndentToken,
  generateAssetTag,
  createFacultyIndent,
  advanceIndentStage,
  completeAssetInwarding,
  exportFacultyIndentsCSV,
} from '../src/lib/teacher/facultyIndents';

describe('TASK-975: Institutional Central Procurement & Faculty Indent Systems Suite', () => {
  describe('TASK-971: Central University Tender e-Procurement & Works Management Engine', () => {
    it('determines statutory procurement mode based on estimated outlay and PAC rules', () => {
      assert.strictEqual(determineProcurementMode(20_000), 'DIRECT_GEM_PURCHASE');
      assert.strictEqual(determineProcurementMode(250_000), 'GEM_L1_COMPARISON');
      assert.strictEqual(determineProcurementMode(1_500_000), 'LIMITED_TENDER_ENQUIRY');
      assert.strictEqual(determineProcurementMode(45_000_000), 'OPEN_ADVERTISED_TENDER');
      assert.strictEqual(determineProcurementMode(500_000, true), 'PROPRIETARY_ARTICLE_PROCUREMENT');
    });

    it('calculates statutory securities (EMD and PBG) and applies MSME exemption', () => {
      // Standard commercial bidder (2% EMD, 5% PBG)
      const sec1 = calculateTenderSecurities(10_000_000, false);
      assert.strictEqual(sec1.emdAmount, 200_000);
      assert.strictEqual(sec1.pbgAmount, 500_000);

      // MSME / Startup bidder (EMD exempt, 5% PBG)
      const sec2 = calculateTenderSecurities(10_000_000, true);
      assert.strictEqual(sec2.emdAmount, 0);
      assert.strictEqual(sec2.pbgAmount, 500_000);
    });

    it('evaluates two-bid tenders filtering sub-hurdle bids and ranking qualified L1/L2/L3', () => {
      const bids: BidderSubmission[] = [
        {
          bidderId: 'B1',
          vendorName: 'Vendor High Tech High Price',
          technicalScore: 95,
          technicallyQualified: true,
          financialBidAmount: 5_000_000,
          isMsmeExempt: false,
          status: 'SUBMITTED',
        },
        {
          bidderId: 'B2',
          vendorName: 'Vendor Substandard Low Price',
          technicalScore: 55, // Fails 70-point hurdle
          technicallyQualified: false,
          financialBidAmount: 3_000_000,
          isMsmeExempt: false,
          status: 'SUBMITTED',
        },
        {
          bidderId: 'B3',
          vendorName: 'Vendor Qualified Best Price',
          technicalScore: 88,
          technicallyQualified: true,
          financialBidAmount: 4_200_000, // Lowest qualified = L1
          isMsmeExempt: true,
          status: 'SUBMITTED',
        },
      ];

      const evaluated = evaluateTwoBids(bids, 70);

      const b2 = evaluated.find((b) => b.bidderId === 'B2');
      assert.strictEqual(b2?.technicallyQualified, false);
      assert.strictEqual(b2?.status, 'TECH_REJECTED');

      const b3 = evaluated.find((b) => b.bidderId === 'B3');
      assert.strictEqual(b3?.technicallyQualified, true);
      assert.strictEqual(b3?.bidRank, 'L1');
      assert.strictEqual(b3?.status, 'AWARDED_L1');

      const b1 = evaluated.find((b) => b.bidderId === 'B1');
      assert.strictEqual(b1?.technicallyQualified, true);
      assert.strictEqual(b1?.bidRank, 'L2');
    });

    it('registers tender notice and awards contract with cryptographic SHA-256 seal', () => {
      const tender = registerTenderNotice({
        title: 'Procurement of High-Capacity Campus Server',
        category: 'IT_HARDWARE_INFRASTRUCTURE',
        estimatedValue: 12_000_000,
        indenterDepartment: 'Computer Science',
        publishedDate: '2026-03-01',
        closingDate: '2026-03-31',
        cpcChairperson: 'Prof. S. R. Iyengar',
      });

      assert.match(tender.tenderRefNumber, /^TDR-\d{4}-IT-[0-9A-F]{6}$/);
      assert.strictEqual(tender.stage, 'NIT_PUBLISHED');
      assert.strictEqual(tender.emdAmount, 240_000);

      // Add bids and award
      tender.bids = [
        {
          bidderId: 'V1',
          vendorName: 'Qualified Winner',
          technicalScore: 92,
          technicallyQualified: true,
          financialBidAmount: 11_500_000,
          isMsmeExempt: false,
          status: 'QUALIFIED',
        },
      ];

      const awarded = awardTenderContract(tender, 'V1', ['Prof. Iyengar', 'Registrar']);
      assert.strictEqual(awarded.stage, 'L1_AWARDED');
      assert.strictEqual(awarded.awardedBidderId, 'V1');
      assert.strictEqual(awarded.contractValue, 11_500_000);
      assert.match(awarded.cryptographicSeal || '', /^[0-9a-f]{64}$/);
    });

    it('exports GFR 2017 & CVC procurement ledger CSV with proper headers', () => {
      const tender = registerTenderNotice({
        title: 'Chemical Fume Hoods Installation',
        category: 'CAMPUS_CIVIL_ELECTRICAL_WORKS',
        estimatedValue: 3_500_000,
        indenterDepartment: 'Estate Office',
        publishedDate: '2026-03-10',
        closingDate: '2026-04-10',
        cpcChairperson: 'Dean Works',
      });

      const csv = exportProcurementLedgerCSV([tender]);
      assert.ok(csv.includes('Tender Ref Number,Title,Category,Procurement Mode'));
      assert.ok(csv.includes('Chemical Fume Hoods Installation'));
      assert.ok(csv.includes('CAMPUS_CIVIL_ELECTRICAL_WORKS'));
    });
  });

  describe('TASK-973: Faculty Departmental Purchase Requisition & Asset Inward Engine', () => {
    it('validates budget solvency and rejects insufficient allocations', () => {
      assert.strictEqual(validateBudgetAvailability(500_000, 1_000_000), true);
      assert.strictEqual(validateBudgetAvailability(1_200_000, 1_000_000), false);
      assert.strictEqual(validateBudgetAvailability(0, 1_000_000), false);
    });

    it('creates faculty purchase indent and generates unique token', () => {
      const indent = createFacultyIndent({
        facultyPi: 'Dr. Vivek Bhattacharya',
        department: 'Biotechnology',
        category: 'LAB_CONSUMABLES',
        budgetHead: 'EXT_SPONSORED_RESEARCH',
        budgetProjectCode: 'DST-SERB-BT-01',
        availableBudget: 600_000,
        items: [
          {
            itemId: 'ITM-1',
            description: 'Taq DNA Polymerase Kit (500 Units)',
            quantity: 5,
            unit: 'Kit',
            estimatedUnitPrice: 12_000,
          },
          {
            itemId: 'ITM-2',
            description: 'Ultra-Pure dNTP Set (100mM each)',
            quantity: 4,
            unit: 'Set',
            estimatedUnitPrice: 15_000,
          },
        ],
      });

      assert.match(indent.indentNumber, /^IND-BIOT-\d{4}-[0-9A-F]{6}$/);
      assert.strictEqual(indent.totalEstimatedOutlay, 60_000 + 60_000); // 120,000
      assert.strictEqual(indent.stage, 'DRAFTED');

      // Test budget ceiling violation
      assert.throws(() => {
        createFacultyIndent({
          facultyPi: 'Dr. Vivek',
          department: 'Biotechnology',
          category: 'LAB_CONSUMABLES',
          budgetHead: 'EXT_SPONSORED_RESEARCH',
          availableBudget: 50_000, // less than requested
          items: [
            {
              itemId: 'ITM-1',
              description: 'Costly item',
              quantity: 1,
              unit: 'Unit',
              estimatedUnitPrice: 100_000,
            },
          ],
        });
      }, /Requested outlay exceeds available departmental\/grant budget head/);
    });

    it('advances indent stage and records PO information', () => {
      const indent = createFacultyIndent({
        facultyPi: 'Dr. Meenakshi',
        department: 'Chemistry',
        category: 'LAB_CONSUMABLES',
        budgetHead: 'INST_DEV_FUND',
        availableBudget: 500_000,
        items: [
          {
            itemId: 'ITM-1',
            description: 'Solvents',
            quantity: 10,
            unit: 'Litre',
            estimatedUnitPrice: 2_000,
          },
        ],
      });

      const hodRec = advanceIndentStage(indent, 'HOD_RECOMMENDED');
      assert.strictEqual(hodRec.stage, 'HOD_RECOMMENDED');

      const poIssued = advanceIndentStage(hodRec, 'PO_ISSUED', {
        poNumber: 'PO-2026-CH-991',
        vendorName: 'Merck India Ltd',
      });
      assert.strictEqual(poIssued.stage, 'PO_ISSUED');
      assert.strictEqual(poIssued.poNumber, 'PO-2026-CH-991');
      assert.strictEqual(poIssued.vendorName, 'Merck India Ltd');
    });

    it('completes consignment receipt, tags dead-stock asset, and computes SHA-256 seal', () => {
      const indent = createFacultyIndent({
        facultyPi: 'Prof. Swaminathan',
        department: 'Electrical Engineering',
        category: 'RESEARCH_EQUIPMENT_CAPEX',
        budgetHead: 'EXT_SPONSORED_RESEARCH',
        availableBudget: 2_000_000,
        items: [
          {
            itemId: 'ITM-1',
            description: 'Digital Signal Analyzer',
            quantity: 1,
            unit: 'Unit',
            estimatedUnitPrice: 850_000,
          },
        ],
      });

      const inwarded = completeAssetInwarding(indent, 'Dr. Narayanan', 'INV-2026-0044');
      assert.strictEqual(inwarded.stage, 'ASSET_INWARDED');
      assert.match(inwarded.assetTagNumber || '', /^AST-ELEC-\d{4}-[0-9A-F]{6}$/);
      assert.strictEqual(inwarded.inspectorFaculty, 'Dr. Narayanan');
      assert.strictEqual(inwarded.invoiceNumber, 'INV-2026-0044');
      assert.match(inwarded.cryptographicSeal || '', /^[0-9a-f]{64}$/);
    });

    it('exports faculty indent and dead-stock asset ledger CSV with escaping', () => {
      const indent = createFacultyIndent({
        facultyPi: 'Prof. K. R. Nambiar',
        department: 'Mechanical Engineering',
        category: 'MAINTENANCE_AND_SPARES',
        budgetHead: 'CONSULTANCY_OVERHEAD',
        availableBudget: 300_000,
        items: [
          {
            itemId: 'ITM-1',
            description: 'CNC Machine Collets, 12mm "Special"',
            quantity: 4,
            unit: 'Pack',
            estimatedUnitPrice: 15_000,
          },
        ],
      });

      const csv = exportFacultyIndentsCSV([indent]);
      assert.ok(csv.includes('Indent Number,Faculty PI,Department,Category'));
      assert.ok(csv.includes('Prof. K. R. Nambiar'));
      assert.ok(csv.includes('CNC Machine Collets, 12mm ""Special""'));
    });
  });
});
