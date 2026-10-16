import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculatePrintRunMetrics,
  generatePacketBarcodeSeal,
  validateDoubleLockAuthorization,
  generateCoePressCustodySeal,
  createCoePressJob,
  secureInDoubleLockVault,
  dispatchPacketsToCenters,
  verifyCenterPacketReceipt,
  activateEmergencyFallback,
  exportCoePressAuditCSV,
  DoubleLockVerification,
} from '../src/lib/admin/centralCoePress';

import {
  generateQuestionPaperToken,
  calculateCognitiveDistribution,
  generateQuestionPaperSeal,
  createFacultyQuestionPaper,
  addOrUpdateQuestionItem,
  submitQuestionPaperToDmc,
  reviewByDmc,
  exportFacultyQuestionPapersCSV,
  QuestionItem,
} from '../src/lib/teacher/facultyQuestionPaper';

describe('TASK-990: Master CoE Press Custody & Question Paper Moderation Systems Test Suite', () => {
  describe('TASK-986: Central University Confidential Examination Printing Press & Question Paper Custody Engine', () => {
    it('1. calculates print run metrics with 5% emergency buffer and 25 candidates per sealed packet', () => {
      // 100 candidates -> 5% buffer = 5 -> total 105 -> 105 / 25 = 5 packets
      const metrics1 = calculatePrintRunMetrics(100);
      assert.strictEqual(metrics1.bufferCopies, 5);
      assert.strictEqual(metrics1.totalCopiesPrinted, 105);
      assert.strictEqual(metrics1.packetsCount, 5);

      // 320 candidates -> 5% buffer = 16 -> total 336 -> 336 / 25 = 14 packets
      const metrics2 = calculatePrintRunMetrics(320);
      assert.strictEqual(metrics2.bufferCopies, 16);
      assert.strictEqual(metrics2.totalCopiesPrinted, 336);
      assert.strictEqual(metrics2.packetsCount, 14);

      // Throws on 0 or negative
      assert.throws(() => calculatePrintRunMetrics(0), /Candidate count must be strictly greater than 0/);
    });

    it('2. generates tamper-evident packet barcode seal conforming to QPB-[YEAR]-[PAPER]-[HEX6]', () => {
      const seal = generatePacketBarcodeSeal('CS401', 2026);
      assert.match(seal, /^QPB-2026-CS401-[0-9A-F]{6}$/);

      const seal2 = generatePacketBarcodeSeal('EE-202');
      assert.match(seal2, /^QPB-\d{4}-EE202-[0-9A-F]{6}$/);
    });

    it('3. initializes confidential print job with partitioned center allocations and tracking codes', () => {
      const job = createCoePressJob({
        courseCode: 'CS401',
        courseTitle: 'Advanced Operating Systems',
        examSession: 'END_SEM_SPRING_2026',
        examDate: '2026-05-12',
        examSlot: 'FORENOON_0930_1230',
        totalCandidates: 200,
        centerAllocations: [
          {
            centerCode: 'CENT-01',
            centerName: 'Hall 1',
            superintendentName: 'Prof. Sen',
            candidateCount: 125,
          },
          {
            centerCode: 'CENT-02',
            centerName: 'Hall 2',
            superintendentName: 'Dr. Verma',
            candidateCount: 75,
          },
        ],
      });

      assert.strictEqual(job.stage, 'JOB_INITIALIZED');
      assert.strictEqual(job.courseCode, 'CS401');
      assert.strictEqual(job.activeSet, 'SET_A');
      assert.strictEqual(job.centerAllocations.length, 2);
      assert.strictEqual(job.centerAllocations[0].packetsAllocated, 5); // 125 / 25
      assert.strictEqual(job.centerAllocations[1].packetsAllocated, 3); // 75 / 25
      assert.ok(job.cryptographicSeal);
      assert.strictEqual(job.cryptographicSeal.length, 64); // SHA-256
    });

    it('4. validates dual-custodian double-lock authorization and secures job in vault', () => {
      const job = createCoePressJob({
        courseCode: 'MA101',
        courseTitle: 'Calculus',
        examSession: 'END_SEM_SPRING_2026',
        examDate: '2026-05-15',
        examSlot: 'AFTERNOON_1400_1700',
        totalCandidates: 100,
        centerAllocations: [
          {
            centerCode: 'CENT-01',
            centerName: 'Hall A',
            superintendentName: 'Prof. Sen',
            candidateCount: 100,
          },
        ],
      });

      // Same custodian violates segregation of duties
      const invalidSameCustodian: DoubleLockVerification = {
        custodianOneId: 'COE-01',
        custodianOneName: 'Dr. Sharma',
        custodianOneKeyVerified: true,
        custodianTwoId: 'COE-01',
        custodianTwoName: 'Dr. Sharma',
        custodianTwoKeyVerified: true,
        verifiedTimestamp: '2026-05-14T10:00:00Z',
        vaultLocation: 'VAULT-1',
      };
      const checkSame = validateDoubleLockAuthorization(invalidSameCustodian);
      assert.strictEqual(checkSame.valid, false);
      assert.match(checkSame.reason!, /Segregation of duties violation/);

      // Missing physical key verification
      const unverifiedKey: DoubleLockVerification = {
        ...invalidSameCustodian,
        custodianTwoId: 'CSO-02',
        custodianTwoName: 'Col. Rathore',
        custodianTwoKeyVerified: false,
      };
      const checkUnverified = validateDoubleLockAuthorization(unverifiedKey);
      assert.strictEqual(checkUnverified.valid, false);
      assert.match(checkUnverified.reason!, /Dual-lock breach/);

      // Valid dual-custodian authentication
      const validVerification: DoubleLockVerification = {
        custodianOneId: 'COE-CONF-01',
        custodianOneName: 'Dr. Ramesh Sharma',
        custodianOneKeyVerified: true,
        custodianTwoId: 'CSO-SEC-04',
        custodianTwoName: 'Col. Vikram Rathore',
        custodianTwoKeyVerified: true,
        verifiedTimestamp: '2026-05-14T10:00:00Z',
        vaultLocation: 'STRONG-ROOM-A-BAY-2',
      };
      const vaultJob = secureInDoubleLockVault(job, validVerification);
      assert.strictEqual(vaultJob.stage, 'DOUBLE_LOCK_VAULT');
      assert.strictEqual(vaultJob.doubleLockVerification?.vaultLocation, 'STRONG-ROOM-A-BAY-2');
    });

    it('5. enforces dispatch workflow and transitions to VERIFIED_AT_CENTER once all centers report intact receipt', () => {
      const job = createCoePressJob({
        courseCode: 'EE202',
        courseTitle: 'Signals',
        examSession: 'END_SEM_SPRING_2026',
        examDate: '2026-05-14',
        examSlot: 'FORENOON_0930_1230',
        totalCandidates: 100,
        centerAllocations: [
          { centerCode: 'CENT-01', centerName: 'Hall 1', superintendentName: 'Dr. A', candidateCount: 50 },
          { centerCode: 'CENT-02', centerName: 'Hall 2', superintendentName: 'Dr. B', candidateCount: 50 },
        ],
      });

      const verification: DoubleLockVerification = {
        custodianOneId: 'COE-01',
        custodianOneName: 'Dr. A',
        custodianOneKeyVerified: true,
        custodianTwoId: 'CSO-02',
        custodianTwoName: 'Dr. B',
        custodianTwoKeyVerified: true,
        verifiedTimestamp: new Date().toISOString(),
        vaultLocation: 'VAULT-BAY-1',
      };

      // Cannot dispatch directly from initialized stage
      assert.throws(() => dispatchPacketsToCenters(job, verification), /Job must be in DOUBLE_LOCK_VAULT/);

      // Move to vault then dispatch
      const inVault = secureInDoubleLockVault(job, verification);
      const dispatched = dispatchPacketsToCenters(inVault, verification);
      assert.strictEqual(dispatched.stage, 'DISPATCHED_TO_CENTERS');

      // First center verifies
      const partialVerified = verifyCenterPacketReceipt(dispatched, 'CENT-01', 'Dr. A');
      assert.strictEqual(partialVerified.stage, 'DISPATCHED_TO_CENTERS'); // Still dispatched because CENT-02 pending
      assert.strictEqual(partialVerified.centerAllocations[0].receivedVerified, true);
      assert.strictEqual(partialVerified.centerAllocations[1].receivedVerified, false);

      // Second center verifies
      const allVerified = verifyCenterPacketReceipt(partialVerified, 'CENT-02', 'Dr. B');
      assert.strictEqual(allVerified.stage, 'VERIFIED_AT_CENTER');
      assert.strictEqual(allVerified.centerAllocations[1].receivedVerified, true);
    });

    it('6. activates emergency leak fallback: quarantines compromised set, switches to reserve set, and updates custody seal', () => {
      const job = createCoePressJob({
        courseCode: 'CY301',
        courseTitle: 'Cryptography',
        examSession: 'END_SEM_SPRING_2026',
        examDate: '2026-05-20',
        examSlot: 'FORENOON_0930_1230',
        totalCandidates: 150,
        centerAllocations: [
          { centerCode: 'CENT-01', centerName: 'Hall 1', superintendentName: 'Dr. A', candidateCount: 150 },
        ],
      });

      assert.strictEqual(job.activeSet, 'SET_A');
      assert.deepStrictEqual(job.availableSets, ['SET_A', 'SET_B', 'SET_C']);

      const fallbackJob = activateEmergencyFallback(job, {
        compromisedSet: 'SET_A',
        reason: 'Transit packet security seal tampered on National Highway route.',
        reportedBy: 'Superintendent Cent-01',
        authorizedByCoE: 'Prof. Narayanan (CoE)',
      });

      assert.strictEqual(fallbackJob.activeSet, 'SET_B');
      assert.strictEqual(fallbackJob.stage, 'EMERGENCY_QUARANTINED');
      assert.deepStrictEqual(fallbackJob.availableSets, ['SET_B', 'SET_C']);
      assert.strictEqual(fallbackJob.fallbackHistory.length, 1);
      assert.strictEqual(fallbackJob.fallbackHistory[0].compromisedSet, 'SET_A');
      assert.strictEqual(fallbackJob.fallbackHistory[0].fallbackSetActivated, 'SET_B');
      assert.notStrictEqual(fallbackJob.cryptographicSeal, job.cryptographicSeal);
    });
  });

  describe('TASK-988: Faculty Question Paper Authoring & Bloom Taxonomy Moderation Engine', () => {
    it('7. calculates cognitive distribution, LOTS/HOTS percentages, AICTE balance index, and CO coverage', () => {
      const sampleQuestions: QuestionItem[] = [
        {
          questionId: 'Q1',
          questionNumber: 1,
          text: 'Define Turing Machine.',
          marks: 10,
          cognitiveLevel: 'L1_REMEMBER',
          courseOutcome: 'CO1',
          unitModuleNumber: 1,
        },
        {
          questionId: 'Q2',
          questionNumber: 2,
          text: 'Explain Church-Turing thesis.',
          marks: 20,
          cognitiveLevel: 'L2_UNDERSTAND',
          courseOutcome: 'CO2',
          unitModuleNumber: 2,
        },
        {
          questionId: 'Q3',
          questionNumber: 3,
          text: 'Construct DFA recognizing binary multiples of 3.',
          marks: 20,
          cognitiveLevel: 'L3_APPLY',
          courseOutcome: 'CO3',
          unitModuleNumber: 3,
        },
        {
          questionId: 'Q4',
          questionNumber: 4,
          text: 'Prove that the Post Correspondence Problem is undecidable.',
          marks: 25,
          cognitiveLevel: 'L4_ANALYZE',
          courseOutcome: 'CO4',
          unitModuleNumber: 4,
        },
        {
          questionId: 'Q5',
          questionNumber: 5,
          text: 'Design a non-deterministic pushdown automaton for palindromes.',
          marks: 25,
          cognitiveLevel: 'L6_CREATE',
          courseOutcome: 'CO5',
          unitModuleNumber: 5,
        },
      ];

      const dist = calculateCognitiveDistribution(sampleQuestions);
      assert.strictEqual(dist.totalMarks, 100);
      assert.strictEqual(dist.lotsMarks, 50); // 10 + 20 + 20
      assert.strictEqual(dist.hotsMarks, 50); // 25 + 25
      assert.strictEqual(dist.lotsPercentage, 50);
      assert.strictEqual(dist.hotsPercentage, 50);
      assert.strictEqual(dist.isBalanced, true); // HOTS >= 30%
      assert.strictEqual(dist.allCosCovered, true); // CO1..CO5 all > 0
    });

    it('8. generates encrypted submission token conforming to QP-[DEPT]-[COURSE]-[HEX6]', () => {
      const token = generateQuestionPaperToken('Computer Science', 'CS401');
      assert.match(token, /^QP-COMP-CS401-[0-9A-F]{6}$/);

      const token2 = generateQuestionPaperToken('Electrical', 'EE202');
      assert.match(token2, /^QP-ELEC-EE202-[0-9A-F]{6}$/);
    });

    it('9. manages question insertion, updates cognitive metrics, and enforces DMC submission & moderation gates', () => {
      const paper = createFacultyQuestionPaper({
        courseCode: 'CS301',
        courseTitle: 'Data Structures & Algorithms',
        department: 'Computer Science',
        facultySetterName: 'Dr. Sen',
        facultySetterEmpId: 'EMP-01',
        targetTotalMarks: 50,
      });

      assert.strictEqual(paper.status, 'DRAFTED');

      // Cannot submit with 0 questions
      assert.throws(() => submitQuestionPaperToDmc(paper), /Cannot submit empty question paper/);

      // Add a question with 20 marks (target 50)
      const withQPartial = addOrUpdateQuestionItem(paper, {
        questionNumber: 1,
        text: 'Partial question.',
        marks: 20,
        cognitiveLevel: 'L1_REMEMBER',
        courseOutcome: 'CO1',
        unitModuleNumber: 1,
      });
      // Cannot submit with mark mismatch (20 != 50)
      assert.throws(() => submitQuestionPaperToDmc(withQPartial), /Mark mismatch/);

      // Add questions totaling 50 marks
      const withQ1 = addOrUpdateQuestionItem(paper, {
        questionNumber: 1,
        text: 'Explain AVL tree balancing.',
        marks: 25,
        cognitiveLevel: 'L3_APPLY',
        courseOutcome: 'CO1',
        unitModuleNumber: 1,
      });

      const withQ2 = addOrUpdateQuestionItem(withQ1, {
        questionNumber: 2,
        text: 'Analyze Dijkstra vs Bellman-Ford on negative weights.',
        marks: 25,
        cognitiveLevel: 'L4_ANALYZE',
        courseOutcome: 'CO2',
        unitModuleNumber: 2,
      });

      assert.strictEqual(withQ2.cognitiveDistribution.totalMarks, 50);

      // Now submission succeeds
      const submitted = submitQuestionPaperToDmc(withQ2);
      assert.strictEqual(submitted.status, 'SUBMITTED_TO_DMC');

      // DMC approval fails if not all COs covered
      assert.throws(
        () =>
          reviewByDmc(submitted, {
            decision: 'APPROVE',
            dmcConvenorName: 'Prof. Swaminathan',
            remarks: 'Incomplete CO coverage',
          }),
        /All 5 Course Outcomes \(CO1..CO5\) must be mapped/
      );

      // DMC can request revision
      const revision = reviewByDmc(submitted, {
        decision: 'REQUEST_REVISION',
        dmcConvenorName: 'Prof. Swaminathan',
        remarks: 'Please map questions to CO3, CO4, and CO5 as well.',
      });
      assert.strictEqual(revision.status, 'REVISION_REQUESTED');
      assert.strictEqual(revision.dmcRemarks, 'Please map questions to CO3, CO4, and CO5 as well.');
    });

    it('10. exports valid and deterministic CSV ledgers for both CoE Press and Faculty Question Paper engines', () => {
      const pressCsv = exportCoePressAuditCSV([
        createCoePressJob({
          courseCode: 'CS401',
          courseTitle: 'OS',
          examSession: 'END_SEM_SPRING_2026',
          examDate: '2026-05-12',
          examSlot: 'FORENOON_0930_1230',
          totalCandidates: 100,
          centerAllocations: [
            { centerCode: 'C1', centerName: 'Hall 1', superintendentName: 'Dr. A', candidateCount: 100 },
          ],
        }),
      ]);

      assert.ok(pressCsv.includes('Job ID,Barcode Seal,Exam Session,Course Code'));
      assert.ok(pressCsv.includes('"CS401"'));

      const paperCsv = exportFacultyQuestionPapersCSV([
        createFacultyQuestionPaper({
          courseCode: 'IT304',
          courseTitle: 'ML Systems',
          department: 'IT',
          facultySetterName: 'Dr. Sen',
          facultySetterEmpId: 'EMP-01',
        }),
      ]);

      assert.ok(paperCsv.includes('Paper ID,Submission Token,Course Code,Course Title'));
      assert.ok(paperCsv.includes('"IT304"'));
    });
  });
});
