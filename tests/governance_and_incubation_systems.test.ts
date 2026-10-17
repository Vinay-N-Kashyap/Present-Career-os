import test, { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateQuorum,
  verifyMeetingQuorum,
  evaluateResolutionVoting,
  generateGazetteNumber,
  generateCryptographicSeal,
  isAtrOverdue,
  exportBogResolutionsCSV,
  getAllResolutions,
  registerGovernanceResolution,
  recordResolutionVoting,
  updateResolutionAtr,
  resetGovernanceStore,
  BogResolution,
} from '../src/lib/admin/bogGovernance.ts';

import {
  validateNispEquity,
  validateFacultyTimeCommitment,
  calculateRoyaltyDistribution,
  generateStartupId,
  generateCryptographicIpSeal,
  exportTtoStartupsCSV,
  getAllStartups,
  registerTtoStartup,
  advanceIncubationStage,
  logRoyaltyRevenue,
  resetTtoStore,
  TtoStartup,
} from '../src/lib/teacher/ttoIncubation.ts';

describe('TASK-955: University Statutory Governance & Faculty Innovation Systems Suite', () => {
  beforeEach(() => {
    resetGovernanceStore();
    resetTtoStore();
  });

  describe('TASK-951: Central University Statutory Governance & BoG Resolution Engine', () => {
    it('calculates statutory quorum requirements (>= 50% voting members, rounded up)', () => {
      assert.equal(calculateQuorum(0), 0);
      assert.equal(calculateQuorum(7), 4);
      assert.equal(calculateQuorum(8), 4);
      assert.equal(calculateQuorum(15), 8);
      assert.equal(calculateQuorum(16), 8);

      assert.equal(verifyMeetingQuorum(7, 4), true);
      assert.equal(verifyMeetingQuorum(7, 3), false);
      assert.equal(verifyMeetingQuorum(16, 8), true);
      assert.equal(verifyMeetingQuorum(16, 7), false);
    });

    it('evaluates resolution voting state machine correctly', () => {
      // Tabled (no votes)
      assert.equal(
        evaluateResolutionVoting({ votesFor: 0, votesAgainst: 0, abstentions: 0 }),
        'TABLED_IN_MEETING'
      );

      // Unanimously passed
      assert.equal(
        evaluateResolutionVoting({ votesFor: 6, votesAgainst: 0, abstentions: 0 }),
        'UNANIMOUSLY_PASSED'
      );

      // Passed by majority
      assert.equal(
        evaluateResolutionVoting({ votesFor: 5, votesAgainst: 2, abstentions: 1 }),
        'PASSED_BY_MAJORITY'
      );

      // Deferred (tied votes)
      assert.equal(
        evaluateResolutionVoting({ votesFor: 3, votesAgainst: 3, abstentions: 0 }),
        'DEFERRED'
      );

      // Rejected
      assert.equal(
        evaluateResolutionVoting({ votesFor: 2, votesAgainst: 5, abstentions: 0 }),
        'REJECTED'
      );
    });

    it('registers new governance resolution and records voting with gazette issuance', () => {
      const initialCount = getAllResolutions().length;

      const created = registerGovernanceResolution({
        id: 'RES-TEST-01',
        resolutionNumber: 'RES-BOG-69-01',
        meetingId: 'MTG-BOG-69',
        meetingNumber: 'BOG-69',
        body: 'BOARD_OF_GOVERNORS',
        category: 'ACADEMIC_REGULATIONS',
        title: 'Introduction of Interdisciplinary Quantum Computing Minor',
        agendaItemNumber: 'Agenda Item 69.1',
        summary: 'Establishment of 20-credit minor specialization across CSE and Physics.',
        mover: 'Prof. Harish Chandra',
        seconder: 'Prof. Anita Deshmukh',
        tabledDate: '2026-10-17',
        status: 'TABLED_IN_MEETING',
        voting: { votesFor: 0, votesAgainst: 0, abstentions: 0 },
        atrStatus: 'ATR_PENDING',
      });

      assert.equal(getAllResolutions().length, initialCount + 1);
      assert.equal(created.status, 'TABLED_IN_MEETING');
      assert.equal(created.gazetteNotificationNumber, undefined);

      // Vote unanimously
      const voted = recordResolutionVoting('RES-TEST-01', {
        votesFor: 7,
        votesAgainst: 0,
        abstentions: 0,
      });

      assert.ok(voted);
      assert.equal(voted.status, 'UNANIMOUSLY_PASSED');
      assert.ok(voted.gazetteNotificationNumber?.startsWith('GAZ-2026-BOG-'));
      assert.ok(voted.cryptographicDigest && voted.cryptographicDigest.length === 64);
    });

    it('updates Action Taken Report (ATR) status and detects overdue deadlines', () => {
      const updated = updateResolutionAtr(
        'RES-001',
        'IMPLEMENTED',
        'Executive Engineer & CFO',
        '2026-12-31',
        'All work completed and commissioning certificate received.'
      );

      assert.ok(updated);
      assert.equal(updated.atrStatus, 'IMPLEMENTED');
      assert.equal(updated.implementationOfficer, 'Executive Engineer & CFO');

      // Check overdue detection
      // Not overdue if status is IMPLEMENTED
      assert.equal(isAtrOverdue('2026-01-01', 'IMPLEMENTED', '2026-10-17'), false);
      // Overdue if deadline has passed and status is IN_PROGRESS
      assert.equal(isAtrOverdue('2026-09-01', 'IN_PROGRESS', '2026-10-17'), true);
      // Not overdue if deadline is in the future
      assert.equal(isAtrOverdue('2026-12-31', 'IN_PROGRESS', '2026-10-17'), false);
    });

    it('exports standard BoG Resolutions CSV with proper formatting', () => {
      const resolutions = getAllResolutions();
      const csv = exportBogResolutionsCSV(resolutions);

      assert.ok(csv.includes('Resolution Number,Statutory Body,Meeting Ref'));
      assert.ok(csv.includes('RES-BOG-68-01'));
      assert.ok(csv.includes('BOARD_OF_GOVERNORS'));
      assert.ok(csv.includes('UNANIMOUSLY_PASSED'));
    });
  });

  describe('TASK-953: Faculty Innovation Incubation & Technology Transfer Office (TTO) Commercialization Engine', () => {
    it('enforces statutory NISP 2019 equity limits (2.0% to 9.5%)', () => {
      assert.equal(validateNispEquity(2.0), true);
      assert.equal(validateNispEquity(5.0), true);
      assert.equal(validateNispEquity(9.5), true);

      // Rejections
      assert.equal(validateNispEquity(1.5), false);
      assert.equal(validateNispEquity(1.9), false);
      assert.equal(validateNispEquity(9.6), false);
      assert.equal(validateNispEquity(15.0), false);
    });

    it('validates faculty weekly time commitment ceiling (<= 20% of 40-hr week = 8h)', () => {
      assert.equal(validateFacultyTimeCommitment(4.0), true);
      assert.equal(validateFacultyTimeCommitment(8.0), true);

      // Violations
      assert.equal(validateFacultyTimeCommitment(8.5), false);
      assert.equal(validateFacultyTimeCommitment(12.0), false);
      assert.equal(validateFacultyTimeCommitment(-2.0), false);
    });

    it('calculates 70/30 NISP royalty revenue distribution accurately', () => {
      const royalty = 1000000; // 10 Lakhs INR
      const distribution = calculateRoyaltyDistribution(royalty);

      assert.equal(distribution.totalAmountInr, 1000000);
      assert.equal(distribution.facultyShare, 700000); // 70%
      assert.equal(distribution.universityShare, 300000); // 30%
      assert.equal(distribution.departmentShare, 150000); // 15%
      assert.equal(distribution.centralPoolShare, 150000); // 15%
    });

    it('registers new TTO faculty startup with unique ID and cryptographic IP seal', () => {
      const initialCount = getAllStartups().length;

      const registered = registerTtoStartup({
        ventureName: 'SynapseBio Microfluidics',
        facultyLeadName: 'Prof. Ramesh Kulkarni',
        facultyEmployeeId: 'FAC-BIO-09',
        department: 'Biotechnology & Biomedical Engineering',
        studentCoFounders: ['Priya Sharma (M.Tech)'],
        stage: 'INCUBATED_IN_PARK',
        techReadinessLevel: 4,
        ipPatentAppNumber: '202611029481A',
        ipStatus: 'PROVISIONAL_PATENT',
        institutionEquityPercent: 6.5,
        facultyWeeklyTimeHours: 6.0,
        seedGrantSanctionedInr: 2000000,
        externalFundingRaisedInr: 0,
        totalRoyaltyRevenueInr: 0,
        registeredDate: '2026-10-17',
        summary: 'Point-of-care microfluidic cartridge for infectious disease screening.',
      });

      assert.equal(getAllStartups().length, initialCount + 1);
      assert.ok(registered.startupCode.startsWith('TTO-2026-BIO-'));
      assert.equal(registered.institutionEquityPercent, 6.5);
      assert.ok(registered.cryptographicIpSeal && registered.cryptographicIpSeal.length === 64);
    });

    it('advances startup incubation stage and logs commercial royalty revenue', () => {
      const updated = advanceIncubationStage('STU-001', 'COMMERCIALIZED', 9);
      assert.ok(updated);
      assert.equal(updated.stage, 'COMMERCIALIZED');
      assert.equal(updated.techReadinessLevel, 9);
      assert.ok(updated.commercializationDate);

      // Log royalty
      const result = logRoyaltyRevenue('STU-001', 500000);
      assert.ok(result);
      assert.equal(result.startup.totalRoyaltyRevenueInr, 2300000); // 18L + 5L = 23L
      assert.equal(result.distribution.facultyShare, 350000); // 70% of 500k
      assert.equal(result.distribution.universityShare, 150000); // 30% of 500k
    });

    it('exports NISP startup incubation portfolio CSV with all mandatory headers', () => {
      const startups = getAllStartups();
      const csv = exportTtoStartupsCSV(startups);

      assert.ok(csv.includes('Startup Code,Venture Name,Faculty Lead,Department'));
      assert.ok(csv.includes('Qubyte Quantum Cryptography Labs Pvt Ltd'));
      assert.ok(csv.includes('University Equity (%)'));
      assert.ok(csv.includes('Total Royalty Generated (INR)'));
    });
  });
});
