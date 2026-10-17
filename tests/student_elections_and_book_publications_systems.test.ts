import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  MAX_CAMPAIGN_EXPENDITURE_INR,
  MIN_ATTENDANCE_PERCENTAGE,
  generateElectionToken,
  validateCandidateEligibility,
  auditCampaignExpenditure,
  initializeElectionNotification,
  registerCandidateNomination,
  finalizeCandidateScrutiny,
  recordPollingResults,
  certifyElectionResults,
  exportElectionAuditCSV,
} from '../src/lib/admin/centralElections';

import {
  UGC_API_POINTS_MATRIX,
  validateIsbn,
  generatePublicationToken,
  generateRepositoryDoi,
  calculateAuthorPointShares,
  registerAcademicPublication,
  depositToOpenAccessRepository,
  exportFacultyBookPublicationsCSV,
} from '../src/lib/teacher/facultyBookPublication';

describe('TASK-1005: Master Student Elections & Faculty Book Publications Systems Test Suite', () => {
  describe('TASK-1001: Central University Student Election & Campus Council Representation Governance Engine', () => {
    it('1. generates unique election certificate token matching ELEC-[YEAR]-[POST]-[HEX6]', () => {
      const token = generateElectionToken('PRESIDENT', 2026);
      assert.match(token, /^ELEC-2026-PRES-[0-9A-F]{6}$/);

      const token2 = generateElectionToken('GENERAL_SECRETARY', 2026);
      assert.match(token2, /^ELEC-2026-GENE-[0-9A-F]{6}$/);
    });

    it('2. validates candidate eligibility under Lyngdoh Committee statutory criteria (age, attendance, backlogs, conduct)', () => {
      assert.strictEqual(MAX_CAMPAIGN_EXPENDITURE_INR, 5000);
      assert.strictEqual(MIN_ATTENDANCE_PERCENTAGE, 75.0);

      // Valid UG candidate (age 20, attendance 85%, 0 backlogs, clean conduct)
      const validUg = validateCandidateEligibility({
        studentId: 'STU-001',
        fullName: 'Meera Deshmukh',
        enrollmentNumber: '2023CSB041',
        department: 'CSE',
        degreeLevel: 'UNDERGRADUATE',
        ageYears: 20,
        attendancePercentage: 85.0,
        academicBacklogs: 0,
        hasDisciplinaryAction: false,
        campaignExpenditureInr: 0,
      });
      assert.strictEqual(validUg.isEligible, true);

      // Age violation: UG age 23 (> 22)
      const invalidAge = validateCandidateEligibility({
        studentId: 'STU-002',
        fullName: 'Suraj Patil',
        enrollmentNumber: '2022MEB088',
        department: 'ME',
        degreeLevel: 'UNDERGRADUATE',
        ageYears: 23,
        attendancePercentage: 80.0,
        academicBacklogs: 0,
        hasDisciplinaryAction: false,
        campaignExpenditureInr: 0,
      });
      assert.strictEqual(invalidAge.isEligible, false);
      assert.match(invalidAge.disqualificationReason!, /Lyngdoh Age Rule/);

      // Attendance violation: 72% (< 75%)
      const invalidAttendance = validateCandidateEligibility({
        studentId: 'STU-003',
        fullName: 'Aarav Kumar',
        enrollmentNumber: '2023EEB012',
        department: 'EE',
        degreeLevel: 'UNDERGRADUATE',
        ageYears: 21,
        attendancePercentage: 72.0,
        academicBacklogs: 0,
        hasDisciplinaryAction: false,
        campaignExpenditureInr: 0,
      });
      assert.strictEqual(invalidAttendance.isEligible, false);
      assert.match(invalidAttendance.disqualificationReason!, /Lyngdoh Attendance Rule/);

      // Backlog violation: 1 backlog
      const invalidBacklog = validateCandidateEligibility({
        studentId: 'STU-004',
        fullName: 'Rohan Sharma',
        enrollmentNumber: '2023CEB005',
        department: 'CE',
        degreeLevel: 'UNDERGRADUATE',
        ageYears: 21,
        attendancePercentage: 80.0,
        academicBacklogs: 1,
        hasDisciplinaryAction: false,
        campaignExpenditureInr: 0,
      });
      assert.strictEqual(invalidBacklog.isEligible, false);
      assert.match(invalidBacklog.disqualificationReason!, /Lyngdoh Academic Rule/);

      // Disciplinary violation
      const invalidConduct = validateCandidateEligibility({
        studentId: 'STU-005',
        fullName: 'Kiran Rao',
        enrollmentNumber: '2023CSB099',
        department: 'CSE',
        degreeLevel: 'UNDERGRADUATE',
        ageYears: 21,
        attendancePercentage: 80.0,
        academicBacklogs: 0,
        hasDisciplinaryAction: true,
        campaignExpenditureInr: 0,
      });
      assert.strictEqual(invalidConduct.isEligible, false);
      assert.match(invalidConduct.disqualificationReason!, /Lyngdoh Conduct Rule/);
    });

    it('3. initializes election notification and registers candidate nomination with scrutiny audit', () => {
      const election = initializeElectionNotification({
        post: 'PRESIDENT',
        academicYear: '2026-2027',
        returningOfficerName: 'Prof. Aniruddha Sen',
        pollingDate: '2026-09-15',
        eligibleVoterCount: 4200,
      });

      assert.strictEqual(election.stage, 'NOTIFICATION_ISSUED');
      assert.strictEqual(election.eligibleVoterCount, 4200);
      assert.ok(election.cryptographicElectionSeal);
      assert.strictEqual(election.cryptographicElectionSeal.length, 64);

      // Throws on zero voter count
      assert.throws(
        () =>
          initializeElectionNotification({
            post: 'PRESIDENT',
            academicYear: '2026-2027',
            returningOfficerName: 'Prof. Sen',
            pollingDate: '2026-09-15',
            eligibleVoterCount: 0,
          }),
        /Eligible voter count must be greater than 0/
      );

      // Register eligible candidate
      const withCandidate = registerCandidateNomination(election, {
        studentId: 'STU-01',
        fullName: 'Meera Deshmukh',
        enrollmentNumber: '2023CSB041',
        department: 'CSE',
        degreeLevel: 'UNDERGRADUATE',
        ageYears: 20,
        attendancePercentage: 88.5,
        academicBacklogs: 0,
        hasDisciplinaryAction: false,
        campaignExpenditureInr: 0,
      });

      assert.strictEqual(withCandidate.stage, 'NOMINATIONS_OPEN');
      assert.strictEqual(withCandidate.candidates.length, 1);
      assert.strictEqual(withCandidate.candidates[0].isScrutinyApproved, true);
    });

    it('4. audits candidate campaign expenditures against statutory INR 5,000 ceiling', () => {
      const candidate: any = {
        candidateId: 'CND-01',
        fullName: 'Kabir Varma',
        campaignExpenditureInr: 4000,
      };

      // Valid expense within limit (4000 + 800 = 4800 <= 5000)
      const checkValid = auditCampaignExpenditure(candidate, 800);
      assert.strictEqual(checkValid.approved, true);
      assert.strictEqual(checkValid.totalExpenditureInr, 4800);

      // Excessive expense breaching limit (4000 + 1200 = 5200 > 5000)
      const checkBreach = auditCampaignExpenditure(candidate, 1200);
      assert.strictEqual(checkBreach.approved, false);
      assert.strictEqual(checkBreach.totalExpenditureInr, 4000);
      assert.match(checkBreach.reason!, /Lyngdoh Expenditure Ceiling/);
    });

    it('5. records secret ballot polling and certifies election result declaring winner with SHA-256 seal', () => {
      const election = initializeElectionNotification({
        post: 'PRESIDENT',
        academicYear: '2026-2027',
        returningOfficerName: 'Prof. Aniruddha Sen',
        pollingDate: '2026-09-15',
        eligibleVoterCount: 1000,
      });

      const withCand1 = registerCandidateNomination(election, {
        studentId: 'S1',
        fullName: 'Meera Deshmukh',
        enrollmentNumber: '2023CSB041',
        department: 'CSE',
        degreeLevel: 'UNDERGRADUATE',
        ageYears: 20,
        attendancePercentage: 88.5,
        academicBacklogs: 0,
        hasDisciplinaryAction: false,
        campaignExpenditureInr: 0,
      });

      const withCand2 = registerCandidateNomination(withCand1, {
        studentId: 'S2',
        fullName: 'Kabir Varma',
        enrollmentNumber: '2023EEB019',
        department: 'EE',
        degreeLevel: 'UNDERGRADUATE',
        ageYears: 21,
        attendancePercentage: 82.0,
        academicBacklogs: 0,
        hasDisciplinaryAction: false,
        campaignExpenditureInr: 0,
      });

      const scrutinized = finalizeCandidateScrutiny(withCand2);
      assert.strictEqual(scrutinized.stage, 'SCRUTINY_COMPLETED');

      const cand1Id = scrutinized.candidates[0].candidateId;
      const cand2Id = scrutinized.candidates[1].candidateId;

      // Poll results: cand1 gets 600, cand2 gets 350, rejected 20 (total 970 <= 1000)
      const polled = recordPollingResults(
        scrutinized,
        { [cand1Id]: 600, [cand2Id]: 350 },
        20
      );

      assert.strictEqual(polled.stage, 'POLLING_ACTIVE');
      assert.strictEqual(polled.totalVotesCast, 970);
      assert.strictEqual(polled.rejectedBallotsCount, 20);

      // Throws if total votes exceed eligible voters
      assert.throws(
        () => recordPollingResults(scrutinized, { [cand1Id]: 800, [cand2Id]: 300 }, 50),
        /Voter fraud alert: Total votes cast/
      );

      // Certify results
      const certified = certifyElectionResults(polled);
      assert.strictEqual(certified.stage, 'RESULTS_DECLARED');
      assert.strictEqual(certified.declaredWinnerCandidateId, cand1Id);
      assert.notStrictEqual(certified.cryptographicElectionSeal, election.cryptographicElectionSeal);
    });
  });

  describe('TASK-1003: Faculty Academic Book Publication & Institutional Open-Access Repository Engine', () => {
    it('6. generates unique publication tracking token matching PUB-[YEAR]-[DEPT]-[HEX6]', () => {
      const token = generatePublicationToken('Computer Science', 2026);
      assert.match(token, /^PUB-2026-COMP-[0-9A-F]{6}$/);

      const token2 = generatePublicationToken('EEE', 2026);
      assert.match(token2, /^PUB-2026-EEE-[0-9A-F]{6}$/);
    });

    it('7. validates standard ISBN-10 and ISBN-13 formats and rejects malformed strings', () => {
      // Valid ISBN-10
      assert.strictEqual(validateIsbn('0-521-86697-2'), true);
      assert.strictEqual(validateIsbn('0521866972'), true);

      // Valid ISBN-13
      assert.strictEqual(validateIsbn('978-0-521-86697-2'), true);
      assert.strictEqual(validateIsbn('9789811558474'), true);

      // Invalid ISBNs
      assert.strictEqual(validateIsbn('12345'), false);
      assert.strictEqual(validateIsbn('978-INVALID-ISBN'), false);
    });

    it('8. calculates UGC CAS Table 2 Category 3 co-author point distribution (70/30 formula)', () => {
      // Single author: 100% of 12 points
      const single = calculateAuthorPointShares(12, [
        {
          authorId: 'A1',
          fullName: 'Dr. Single Author',
          institutionName: 'Univ',
          isFirstAuthor: true,
          isCorrespondingAuthor: true,
        },
      ]);
      assert.strictEqual(single[0].allocatedApiScore, 12);

      // Two authors: 1 First Author (70% = 8.4), 1 Co-Author (30% = 3.6)
      const duo = calculateAuthorPointShares(12, [
        {
          authorId: 'A1',
          fullName: 'Dr. Lead Author',
          institutionName: 'Univ',
          isFirstAuthor: true,
          isCorrespondingAuthor: true,
        },
        {
          authorId: 'A2',
          fullName: 'Prof. Co-Author',
          institutionName: 'Univ',
          isFirstAuthor: false,
          isCorrespondingAuthor: false,
        },
      ]);
      assert.strictEqual(duo[0].allocatedApiScore, 8.4);
      assert.strictEqual(duo[1].allocatedApiScore, 3.6);

      // Three authors: 1 First, 1 Corresponding, 1 Co-Author
      // 70% pool = 8.4 / 2 = 4.2 each for First & Corresponding; 30% pool = 3.6 for Co-Author
      const trio = calculateAuthorPointShares(12, [
        {
          authorId: 'A1',
          fullName: 'Dr. First',
          institutionName: 'Univ',
          isFirstAuthor: true,
          isCorrespondingAuthor: false,
        },
        {
          authorId: 'A2',
          fullName: 'Dr. Corresponding',
          institutionName: 'Univ',
          isFirstAuthor: false,
          isCorrespondingAuthor: true,
        },
        {
          authorId: 'A3',
          fullName: 'Dr. Contributor',
          institutionName: 'Univ',
          isFirstAuthor: false,
          isCorrespondingAuthor: false,
        },
      ]);
      assert.strictEqual(trio[0].allocatedApiScore, 4.2);
      assert.strictEqual(trio[1].allocatedApiScore, 4.2);
      assert.strictEqual(trio[2].allocatedApiScore, 3.6);
    });

    it('9. registers academic book publication with UGC points matrix and deposits to open-access repository', () => {
      assert.strictEqual(UGC_API_POINTS_MATRIX.INTERNATIONAL_MONOGRAPH_BOOK, 12);
      assert.strictEqual(UGC_API_POINTS_MATRIX.NATIONAL_MONOGRAPH_BOOK, 10);
      assert.strictEqual(UGC_API_POINTS_MATRIX.CHAPTER_IN_EDITED_BOOK, 5);

      const pub = registerAcademicPublication({
        title: 'Distributed Systems & Fault-Tolerant Consensus Protocols',
        publicationType: 'INTERNATIONAL_MONOGRAPH_BOOK',
        department: 'CSE',
        publisherName: 'Cambridge University Press',
        isbn: '978-0-521-86697-2',
        publicationYear: 2026,
        isPeerReviewed: true,
        isOpenAccess: false,
        authors: [
          {
            authorId: 'A1',
            fullName: 'Dr. Siddharth Sen',
            institutionName: 'PinIT University',
            isFirstAuthor: true,
            isCorrespondingAuthor: true,
          },
        ],
      });

      assert.strictEqual(pub.totalApiPointsBase, 12);
      assert.strictEqual(pub.isOpenAccess, false);
      assert.ok(pub.cryptographicPublicationSeal);
      assert.strictEqual(pub.cryptographicPublicationSeal.length, 64);

      // Deposit to Open Access Repository
      const deposited = depositToOpenAccessRepository(pub, 'CC_BY_4_0');
      assert.strictEqual(deposited.isOpenAccess, true);
      assert.strictEqual(deposited.license, 'CC_BY_4_0');
      assert.match(deposited.repositoryDoiUri!, /^doi:10\.campus\.press\/2026\/[0-9A-F]{6}$/);
      assert.notStrictEqual(deposited.cryptographicPublicationSeal, pub.cryptographicPublicationSeal);
    });

    it('10. exports valid and deterministic CSV ledgers for both Student Election and Faculty Book Publication engines', () => {
      const election = initializeElectionNotification({
        post: 'PRESIDENT',
        academicYear: '2026-2027',
        returningOfficerName: 'Prof. Aniruddha Sen',
        pollingDate: '2026-09-15',
        eligibleVoterCount: 4200,
      });

      const electionCsv = exportElectionAuditCSV([election]);
      assert.ok(electionCsv.includes('Election ID,Tracking Token,Electoral Post,Academic Year,Stage'));
      assert.ok(electionCsv.includes('"PRESIDENT"'));
      assert.ok(electionCsv.includes('"Prof. Aniruddha Sen"'));

      const pub = registerAcademicPublication({
        title: 'Power Semiconductors in Renewable Systems',
        publicationType: 'CHAPTER_IN_EDITED_BOOK',
        department: 'EEE',
        publisherName: 'Springer Nature',
        isbn: '978-981-15-5847-4',
        publicationYear: 2026,
        isPeerReviewed: true,
        isOpenAccess: true,
        authors: [
          {
            authorId: 'A1',
            fullName: 'Dr. Neha Kulkarni',
            institutionName: 'PinIT University',
            isFirstAuthor: true,
            isCorrespondingAuthor: true,
          },
        ],
      });

      const pubCsv = exportFacultyBookPublicationsCSV([pub]);
      assert.ok(pubCsv.includes('Publication ID,Tracking Token,Title,Type,Department,Publisher'));
      assert.ok(pubCsv.includes('"Power Semiconductors in Renewable Systems"'));
      assert.ok(pubCsv.includes('"CHAPTER_IN_EDITED_BOOK"'));
      assert.ok(pubCsv.includes('YES'));
    });
  });
});
