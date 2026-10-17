/**
 * Central University Tender, e-Procurement & Works Contract Management Engine
 * Statutory Compliance: General Financial Rules (GFR 2017) Rule 149/153/161/162,
 * Government e-Marketplace (GeM) Mandate & Central Vigilance Commission (CVC) Guidelines.
 *
 * Platform: PinIT Career OS - Campus Administration Platform
 * Zero-Collision Invariant: Pure Branch C administrative governance.
 */

import { createHash } from 'crypto';

export type ProcurementMode =
  | 'DIRECT_GEM_PURCHASE'
  | 'GEM_L1_COMPARISON'
  | 'LIMITED_TENDER_ENQUIRY'
  | 'OPEN_ADVERTISED_TENDER'
  | 'GLOBAL_TENDER_ENQUIRY'
  | 'PROPRIETARY_ARTICLE_PROCUREMENT';

export type TenderCategory =
  | 'SCIENTIFIC_LAB_EQUIPMENT'
  | 'IT_HARDWARE_INFRASTRUCTURE'
  | 'CAMPUS_CIVIL_ELECTRICAL_WORKS'
  | 'LAB_CHEMICALS_CONSUMABLES'
  | 'FACILITY_MANAGEMENT_SERVICES';

export type TenderStage =
  | 'DRAFTED'
  | 'NIT_PUBLISHED'
  | 'TECH_BIDS_OPENED'
  | 'FINANCIAL_BIDS_OPENED'
  | 'L1_AWARDED'
  | 'CONTRACT_SIGNED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface BidderSubmission {
  bidderId: string;
  vendorName: string;
  gemSellerId?: string;
  technicalScore: number; // out of 100
  technicallyQualified: boolean;
  financialBidAmount: number; // in INR
  isMsmeExempt: boolean;
  bidRank?: string; // L1, L2, L3...
  status: 'SUBMITTED' | 'TECH_REJECTED' | 'QUALIFIED' | 'AWARDED_L1' | 'DISQUALIFIED';
}

export interface TenderRecord {
  tenderId: string;
  tenderRefNumber: string; // TDR-[YEAR]-[CAT]-[HEX6]
  title: string;
  category: TenderCategory;
  procurementMode: ProcurementMode;
  estimatedValue: number; // in INR
  emdAmount: number; // Earnest Money Deposit
  pbgAmount: number; // Performance Bank Guarantee
  indenterDepartment: string;
  publishedDate: string; // YYYY-MM-DD
  closingDate: string;
  cpcChairperson: string; // Central Purchase Committee Chair
  stage: TenderStage;
  bids: BidderSubmission[];
  awardedBidderId?: string;
  contractValue?: number;
  cryptographicSeal?: string; // SHA-256
  remarks?: string;
}

/**
 * Evaluates the statutory procurement mode under GFR 2017 & GeM guidelines
 */
export function determineProcurementMode(estimatedValue: number, isPac = false): ProcurementMode {
  if (isPac) {
    return 'PROPRIETARY_ARTICLE_PROCUREMENT';
  }
  if (estimatedValue <= 25_000) {
    return 'DIRECT_GEM_PURCHASE';
  }
  if (estimatedValue <= 500_000) {
    return 'GEM_L1_COMPARISON';
  }
  if (estimatedValue <= 2_500_000) {
    return 'LIMITED_TENDER_ENQUIRY';
  }
  if (estimatedValue <= 2_000_000_000) {
    return 'OPEN_ADVERTISED_TENDER';
  }
  return 'GLOBAL_TENDER_ENQUIRY';
}

/**
 * Calculates statutory securities (EMD 2-5%, PBG 3-10%) under GFR 2017
 * MSMEs and DPIIT-recognized startups are exempt from EMD
 */
export function calculateTenderSecurities(
  estimatedValue: number,
  isMsme = false,
  emdPercent = 2.0,
  pbgPercent = 5.0
): { emdAmount: number; pbgAmount: number } {
  const emdAmount = isMsme ? 0 : Math.round((estimatedValue * emdPercent) / 100);
  const pbgAmount = Math.round((estimatedValue * pbgPercent) / 100);
  return { emdAmount, pbgAmount };
}

/**
 * Evaluates two-bid tenders:
 * 1. Filters technically qualified bidders (score >= minTechHurdle, default 70)
 * 2. Ranks qualified bidders by financial bid (lowest = L1, then L2, L3)
 */
export function evaluateTwoBids(
  bids: BidderSubmission[],
  minTechHurdle = 70
): BidderSubmission[] {
  const processed: BidderSubmission[] = bids.map((bid) => {
    const qualified = bid.technicalScore >= minTechHurdle;
    return {
      ...bid,
      technicallyQualified: qualified,
      status: qualified ? ('QUALIFIED' as const) : ('TECH_REJECTED' as const),
    };
  });

  const qualifiedBids = processed.filter((b) => b.technicallyQualified);
  qualifiedBids.sort((a, b) => a.financialBidAmount - b.financialBidAmount);

  qualifiedBids.forEach((bid, idx) => {
    bid.bidRank = `L${idx + 1}`;
    if (idx === 0) {
      bid.status = 'AWARDED_L1';
    }
  });

  return processed.map((bid) => {
    const q = qualifiedBids.find((item) => item.bidderId === bid.bidderId);
    return q || bid;
  });
}

/**
 * Issues official Tender Reference Token: TDR-[YEAR]-[CAT_CODE]-[HEX6]
 */
export function generateTenderReference(category: TenderCategory): string {
  const catCodeMap: Record<TenderCategory, string> = {
    SCIENTIFIC_LAB_EQUIPMENT: 'SCI',
    IT_HARDWARE_INFRASTRUCTURE: 'IT',
    CAMPUS_CIVIL_ELECTRICAL_WORKS: 'WRK',
    LAB_CHEMICALS_CONSUMABLES: 'CHM',
    FACILITY_MANAGEMENT_SERVICES: 'SVC',
  };
  const code = catCodeMap[category] || 'GEN';
  const year = new Date().getFullYear();
  const hex = createHash('sha256')
    .update(`${code}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .slice(0, 6)
    .toUpperCase();
  return `TDR-${year}-${code}-${hex}`;
}

/**
 * Computes tamper-proof SHA-256 seal for contract award and CPC sign-off
 */
export function generateTenderAwardSeal(
  tenderRefNumber: string,
  winningBidder: BidderSubmission,
  contractValue: number,
  officers: string[]
): string {
  const payload = [
    tenderRefNumber,
    winningBidder.bidderId,
    winningBidder.vendorName,
    contractValue.toFixed(2),
    officers.slice().sort().join('::'),
    new Date().toISOString().split('T')[0],
  ].join('||');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Registers new tender notice with GFR calculations
 */
export function registerTenderNotice(params: {
  title: string;
  category: TenderCategory;
  estimatedValue: number;
  indenterDepartment: string;
  publishedDate: string;
  closingDate: string;
  cpcChairperson: string;
  isPac?: boolean;
}): TenderRecord {
  const procurementMode = determineProcurementMode(params.estimatedValue, params.isPac);
  const { emdAmount, pbgAmount } = calculateTenderSecurities(params.estimatedValue);
  const tenderRefNumber = generateTenderReference(params.category);
  const tenderId = `TDR-${Date.now().toString(36)}`;

  return {
    tenderId,
    tenderRefNumber,
    title: params.title,
    category: params.category,
    procurementMode,
    estimatedValue: params.estimatedValue,
    emdAmount,
    pbgAmount,
    indenterDepartment: params.indenterDepartment,
    publishedDate: params.publishedDate,
    closingDate: params.closingDate,
    cpcChairperson: params.cpcChairperson,
    stage: 'NIT_PUBLISHED',
    bids: [],
  };
}

/**
 * Awards tender contract to L1 bidder and records cryptographic seal
 */
export function awardTenderContract(
  tender: TenderRecord,
  winningBidderId: string,
  committeeOfficers: string[]
): TenderRecord {
  const evaluatedBids = evaluateTwoBids(tender.bids);
  const winningBid = evaluatedBids.find((b) => b.bidderId === winningBidderId);

  if (!winningBid || !winningBid.technicallyQualified) {
    throw new Error('Winning bidder must be technically qualified with valid score');
  }

  const seal = generateTenderAwardSeal(
    tender.tenderRefNumber,
    winningBid,
    winningBid.financialBidAmount,
    committeeOfficers
  );

  return {
    ...tender,
    bids: evaluatedBids,
    stage: 'L1_AWARDED',
    awardedBidderId: winningBid.bidderId,
    contractValue: winningBid.financialBidAmount,
    cryptographicSeal: seal,
  };
}

/**
 * Exports procurement register CSV compliant with GFR 2017 & CVC audit reporting
 */
export function exportProcurementLedgerCSV(tenders: TenderRecord[]): string {
  const headers = [
    'Tender Ref Number',
    'Title',
    'Category',
    'Procurement Mode',
    'Estimated Value (INR)',
    'EMD Amount (INR)',
    'PBG Amount (INR)',
    'Indenter Department',
    'Published Date',
    'Closing Date',
    'Stage',
    'Awarded Bidder',
    'Contract Value (INR)',
    'Cryptographic SHA-256 Seal',
  ];

  const escapeField = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = tenders.map((t) => {
    const awarded = t.bids.find((b) => b.bidderId === t.awardedBidderId);
    return [
      escapeField(t.tenderRefNumber),
      escapeField(t.title),
      escapeField(t.category),
      escapeField(t.procurementMode),
      escapeField(t.estimatedValue),
      escapeField(t.emdAmount),
      escapeField(t.pbgAmount),
      escapeField(t.indenterDepartment),
      escapeField(t.publishedDate),
      escapeField(t.closingDate),
      escapeField(t.stage),
      escapeField(awarded ? awarded.vendorName : 'N/A'),
      escapeField(t.contractValue ?? 'N/A'),
      escapeField(t.cryptographicSeal ?? 'N/A'),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Seed Dataset for Central Procurement and Works
 */
export const SEED_TENDERS: TenderRecord[] = [
  {
    tenderId: 'TDR-001',
    tenderRefNumber: 'TDR-2026-IT-98F1C2',
    title: 'Procurement of High-Performance NVIDIA DGX H100 GPU Cluster for AI Research',
    category: 'IT_HARDWARE_INFRASTRUCTURE',
    procurementMode: 'OPEN_ADVERTISED_TENDER',
    estimatedValue: 45_000_000,
    emdAmount: 900_000,
    pbgAmount: 2_250_000,
    indenterDepartment: 'Computer Science & Engineering',
    publishedDate: '2026-01-15',
    closingDate: '2026-02-15',
    cpcChairperson: 'Prof. S. R. Iyengar (Dean Infrastructure)',
    stage: 'L1_AWARDED',
    awardedBidderId: 'BID-001',
    contractValue: 42_800_000,
    cryptographicSeal: 'b4a694f83726591024e58b19a12c4193856112948c264a9712bfd91e846011c3',
    bids: [
      {
        bidderId: 'BID-001',
        vendorName: 'Netweb Technologies India Ltd',
        gemSellerId: 'GEM-NETWEB-2024',
        technicalScore: 96,
        technicallyQualified: true,
        financialBidAmount: 42_800_000,
        isMsmeExempt: false,
        bidRank: 'L1',
        status: 'AWARDED_L1',
      },
      {
        bidderId: 'BID-002',
        vendorName: 'Hewlett Packard Enterprise India Pvt Ltd',
        gemSellerId: 'GEM-HPE-8819',
        technicalScore: 94,
        technicallyQualified: true,
        financialBidAmount: 44_200_000,
        isMsmeExempt: false,
        bidRank: 'L2',
        status: 'QUALIFIED',
      },
      {
        bidderId: 'BID-003',
        vendorName: 'Dell Global Business Services',
        gemSellerId: 'GEM-DELL-1092',
        technicalScore: 92,
        technicallyQualified: true,
        financialBidAmount: 44_950_000,
        isMsmeExempt: false,
        bidRank: 'L3',
        status: 'QUALIFIED',
      },
      {
        bidderId: 'BID-004',
        vendorName: 'Apex Data Systems',
        gemSellerId: 'GEM-APEX-4411',
        technicalScore: 62,
        technicallyQualified: false,
        financialBidAmount: 39_000_000,
        isMsmeExempt: true,
        status: 'TECH_REJECTED',
      },
    ],
  },
  {
    tenderId: 'TDR-002',
    tenderRefNumber: 'TDR-2026-SCI-73E8A1',
    title: 'High-Resolution Field Emission Scanning Electron Microscope (FE-SEM)',
    category: 'SCIENTIFIC_LAB_EQUIPMENT',
    procurementMode: 'OPEN_ADVERTISED_TENDER',
    estimatedValue: 38_000_000,
    emdAmount: 760_000,
    pbgAmount: 1_900_000,
    indenterDepartment: 'Metallurgical & Materials Engineering',
    publishedDate: '2026-02-01',
    closingDate: '2026-03-05',
    cpcChairperson: 'Prof. K. Venkatesh (Dean R&D)',
    stage: 'FINANCIAL_BIDS_OPENED',
    bids: [
      {
        bidderId: 'BID-010',
        vendorName: 'Carl Zeiss India Pvt Ltd',
        gemSellerId: 'GEM-ZEISS-9011',
        technicalScore: 98,
        technicallyQualified: true,
        financialBidAmount: 36_500_000,
        isMsmeExempt: false,
        bidRank: 'L1',
        status: 'AWARDED_L1',
      },
      {
        bidderId: 'BID-011',
        vendorName: 'JEOL India Pvt Ltd',
        gemSellerId: 'GEM-JEOL-5521',
        technicalScore: 95,
        technicallyQualified: true,
        financialBidAmount: 37_200_000,
        isMsmeExempt: false,
        bidRank: 'L2',
        status: 'QUALIFIED',
      },
      {
        bidderId: 'BID-012',
        vendorName: 'Thermo Fisher Scientific India',
        gemSellerId: 'GEM-THERMO-1188',
        technicalScore: 94,
        technicallyQualified: true,
        financialBidAmount: 37_900_000,
        isMsmeExempt: false,
        bidRank: 'L3',
        status: 'QUALIFIED',
      },
    ],
  },
  {
    tenderId: 'TDR-003',
    tenderRefNumber: 'TDR-2026-WRK-A3D992',
    title: 'Modernization of Campus 11kV Substation & High-Efficiency Diesel Genset Synchronization',
    category: 'CAMPUS_CIVIL_ELECTRICAL_WORKS',
    procurementMode: 'OPEN_ADVERTISED_TENDER',
    estimatedValue: 18_500_000,
    emdAmount: 370_000,
    pbgAmount: 925_000,
    indenterDepartment: 'Estate & Works Office',
    publishedDate: '2026-02-10',
    closingDate: '2026-03-12',
    cpcChairperson: 'Prof. S. R. Iyengar (Dean Infrastructure)',
    stage: 'TECH_BIDS_OPENED',
    bids: [
      {
        bidderId: 'BID-020',
        vendorName: 'Schneider Electric India Pvt Ltd',
        gemSellerId: 'GEM-SCHNEIDER-412',
        technicalScore: 91,
        technicallyQualified: true,
        financialBidAmount: 17_900_000,
        isMsmeExempt: false,
        status: 'QUALIFIED',
      },
      {
        bidderId: 'BID-021',
        vendorName: 'Siemens Energy Ltd',
        gemSellerId: 'GEM-SIEMENS-889',
        technicalScore: 93,
        technicallyQualified: true,
        financialBidAmount: 18_100_000,
        isMsmeExempt: false,
        status: 'QUALIFIED',
      },
      {
        bidderId: 'BID-022',
        vendorName: 'Voltas Engineering Services',
        gemSellerId: 'GEM-VOLTAS-301',
        technicalScore: 68,
        technicallyQualified: false,
        financialBidAmount: 16_800_000,
        isMsmeExempt: false,
        status: 'TECH_REJECTED',
      },
    ],
  },
  {
    tenderId: 'TDR-004',
    tenderRefNumber: 'TDR-2026-SVC-55BC01',
    title: 'Comprehensive Campus-wide Wi-Fi 6 & Optical Fiber Network Annual Maintenance Contract (AMC)',
    category: 'FACILITY_MANAGEMENT_SERVICES',
    procurementMode: 'LIMITED_TENDER_ENQUIRY',
    estimatedValue: 2_400_000,
    emdAmount: 48_000,
    pbgAmount: 120_000,
    indenterDepartment: 'Computer Support Group (CSG)',
    publishedDate: '2026-02-18',
    closingDate: '2026-03-20',
    cpcChairperson: 'Prof. Ananya Sen (Head CSG)',
    stage: 'NIT_PUBLISHED',
    bids: [],
  },
];
