import { describe, it, expect } from './helpers/testShim';
import {
  createAuditObservationRecord,
  submitDepartmentAtnReply,
  recordFinancialRecovery,
  dropAuditObservation,
  exportInternalAuditCagLedgerCSV,
  generateAuditSeal,
  isAuditOverdue
} from '../src/lib/admin/centralAuditCagCompliance';

import {
  createBookPublishingRecord,
  recordRoyaltyCycle,
  disburseRoyaltyToAuthor,
  sanctionTranslationGrant,
  disburseTranslationMilestone,
  exportFacultyBookPublishingLedgerCSV,
  generateBookPublishingSeal,
  validateIsbn13,
  UGC_CAS_BOOK_POINTS,
  STATUTORY_ROYALTY_TDS_PERCENT
} from '../src/lib/teacher/facultyBookPublishingRoyalty';

describe('Internal Audit & Faculty Academic Book Publishing Systems (TASK-1041..1045)', () => {
  // Test 1: Audit Observation Creation & Token Formatting
  it('should create an audit observation record with statutory token and SHA-256 seal', () => {
    const record = createAuditObservationRecord({
      financialYear: '2025-2026',
      auditingBody: 'CAG_PRINCIPAL_DIRECTOR_AUDIT',
      department: 'Central Works Division',
      category: 'WORKS_CONTRACT_DELAY_PENALTY_NON_RECOVERY',
      severity: 'CRITICAL_CAG_PARA',
      observationTitle: 'Non-levy of Liquidated Damages on Hostel Construction',
      observationNarrative: 'Contractor delayed execution by 10 weeks; ₹12 Lakhs liquidated damages not deducted from bills.',
      financialImplicationInr: 1200000,
      targetResolutionDate: '2026-06-30',
      year: 2026
    });

    expect(record.auditRecordId).toMatch(/^AUD-2026-WRKS-[A-F0-9]{6}$/);
    expect(record.financialImplicationInr).toBe(1200000);
    expect(record.pendingRecoveryInr).toBe(1200000);
    expect(record.status).toBe('HALF_MARGIN_QUERY_ISSUED');
    expect(record.auditSha256).toBeDefined();
    expect(record.auditSha256.length).toBe(64);
  });

  // Test 2: GFR 144 / Public Procurement Anomaly Detection
  it('should log public procurement and GeM irregularities under GFR 2017 norms', () => {
    const record = createAuditObservationRecord({
      financialYear: '2025-2026',
      auditingBody: 'INTERNAL_AUDIT_OFFICE',
      department: 'Computer Science Lab',
      category: 'PROCUREMENT_TENDER_IRREGULARITY',
      severity: 'MAJOR_INTERNAL_OBSERVATION',
      observationTitle: 'Procurement of Server Hardware outside GeM Mandate',
      observationNarrative: 'Servers worth ₹15 Lakhs purchased through local quotation instead of mandatory GeM portal bidding.',
      financialImplicationInr: 350000,
      targetResolutionDate: '2026-05-31'
    });

    expect(record.category).toBe('PROCUREMENT_TENDER_IRREGULARITY');
    expect(record.auditingBody).toBe('INTERNAL_AUDIT_OFFICE');
    expect(record.remedialRecoveryAmountInr).toBe(0);
    expect(record.status).toBe('HALF_MARGIN_QUERY_ISSUED');
  });

  // Test 3: Financial Recovery Voucher Recording
  it('should record partial recovery voucher and correctly adjust pending balance', () => {
    let record = createAuditObservationRecord({
      financialYear: '2025-2026',
      auditingBody: 'CAG_PRINCIPAL_DIRECTOR_AUDIT',
      department: 'Finance Division',
      category: 'ESTABLISHMENT_PAY_FIXATION_ERROR',
      severity: 'MAJOR_INTERNAL_OBSERVATION',
      observationTitle: 'Excess HRA Drawal due to Non-Surrender of Quarters',
      observationNarrative: 'Officer drew both HRA and occupied residential quarter for 6 months.',
      financialImplicationInr: 180000,
      targetResolutionDate: '2026-07-31'
    });

    // Record recovery of ₹100,000
    record = recordFinancialRecovery(record, {
      recoveryAmountInr: 100000,
      recoveryVoucherNumber: 'RV-2026-8811'
    });

    expect(record.remedialRecoveryAmountInr).toBe(100000);
    expect(record.pendingRecoveryInr).toBe(80000);
    expect(record.recoveryVoucherNumber).toBe('RV-2026-8811');

    // Record remaining ₹80,000
    record = recordFinancialRecovery(record, {
      recoveryAmountInr: 80000,
      recoveryVoucherNumber: 'RV-2026-8812'
    });

    expect(record.remedialRecoveryAmountInr).toBe(180000);
    expect(record.pendingRecoveryInr).toBe(0);
  });

  // Test 4: ATN Action Taken Note Submission
  it('should submit departmental Action Taken Note (ATN) and update status', () => {
    const record = createAuditObservationRecord({
      financialYear: '2025-2026',
      auditingBody: 'CAG_PRINCIPAL_DIRECTOR_AUDIT',
      department: 'SRIC Grants Office',
      category: 'RESEARCH_GRANT_UNSPENT_BALANCE_RETENTION',
      severity: 'CRITICAL_CAG_PARA',
      observationTitle: 'Unspent Grant Interest Not Remitted to CFI',
      observationNarrative: 'Bank interest ₹2.4 Lakhs retained.',
      financialImplicationInr: 240000,
      targetResolutionDate: '2026-06-15'
    });

    const atnNarrative = 'Statutory challan deposited in Bharatkosh remitting full interest of ₹2.4L to Consolidated Fund of India.';
    const updated = submitDepartmentAtnReply(record, {
      actionTakenNoteNarrative: atnNarrative,
      replyDate: '2026-04-10'
    });

    expect(updated.status).toBe('DEPARTMENT_REPLY_SUBMITTED');
    expect(updated.actionTakenNoteNarrative).toBe(atnNarrative);
    expect(updated.departmentReplyDate).toBe('2026-04-10');
    expect(updated.auditSha256).not.toBe(record.auditSha256);
  });

  // Test 5: Drop Observation Hurdle (Financial Recovery Validation)
  it('should enforce recovery hurdle before dropping and resolving audit para', () => {
    const record = createAuditObservationRecord({
      financialYear: '2025-2026',
      auditingBody: 'CAG_PRINCIPAL_DIRECTOR_AUDIT',
      department: 'Central Store',
      category: 'PROCUREMENT_TENDER_IRREGULARITY',
      severity: 'CRITICAL_CAG_PARA',
      observationTitle: 'Overpayment on Printing Consumables',
      observationNarrative: 'Excess payment of ₹1.5 Lakhs.',
      financialImplicationInr: 150000,
      targetResolutionDate: '2026-05-30'
    });

    // Attempt to drop with ₹1.5L pending recovery (Must fail)
    const failedDrop = dropAuditObservation(record);
    expect(failedDrop.success).toBe(false);
    expect(failedDrop.error).toContain('Financial recovery incomplete');

    // Fully recover funds
    const recovered = recordFinancialRecovery(record, {
      recoveryAmountInr: 150000,
      recoveryVoucherNumber: 'TR-REC-9912'
    });

    // Drop observation now succeeds
    const successDrop = dropAuditObservation(recovered);
    expect(successDrop.success).toBe(true);
    expect(successDrop.record.status).toBe('DROPPED_AND_RESOLVED');
  });

  // Test 6: Overdue Audit Observation Identification & CSV Ledger Export
  it('should detect overdue audit observations and export valid CSV report', () => {
    const overdueRecord = createAuditObservationRecord({
      financialYear: '2024-2025',
      auditingBody: 'CAG_PRINCIPAL_DIRECTOR_AUDIT',
      department: 'Engineering Unit',
      category: 'WORKS_CONTRACT_DELAY_PENALTY_NON_RECOVERY',
      severity: 'CRITICAL_CAG_PARA',
      observationTitle: 'Water Treatment Plant Cost Overrun',
      observationNarrative: 'Delay penalty of ₹5 Lakhs unrecovered.',
      financialImplicationInr: 500000,
      targetResolutionDate: '2025-01-01' // Past date
    });

    expect(isAuditOverdue(overdueRecord, '2026-04-01')).toBe(true);

    const seal = generateAuditSeal(overdueRecord);
    expect(seal).toBe(overdueRecord.auditSha256);

    const csv = exportInternalAuditCagLedgerCSV([overdueRecord]);
    expect(csv).toContain('Audit Record ID,Financial Year,Auditing Body');
    expect(csv).toContain('Water Treatment Plant Cost Overrun');
    expect(csv).toContain(seal);
  });

  // Test 7: Faculty Book Publishing Record Creation & ISBN-13 Validation
  it('should validate 13-digit ISBN and create academic book record with token', () => {
    expect(validateIsbn13('978-0-13-468599-1')).toBe(true);
    expect(validateIsbn13('979-1-23-456789-0')).toBe(true);
    expect(validateIsbn13('12345')).toBe(false); // Invalid
    expect(validateIsbn13('878-0-13-468599-1')).toBe(false); // Does not start with 978 or 979

    const book = createBookPublishingRecord({
      facultyAuthorId: 'FAC-CS-2018-081',
      facultyAuthorName: 'Dr. Nandini Ramanathan',
      department: 'Computer Science',
      bookTitle: 'Artificial Intelligence Systems & Machine Cognition',
      isbnNumber: '978-0-13-468599-1',
      publisherName: 'Pearson Academic',
      publicationType: 'INTERNATIONAL_PEER_REVIEWED_MONOGRAPH',
      royaltyAgreementPercent: 12,
      year: 2026
    });

    expect(book.bookRecordId).toMatch(/^PUB-2026-COMP-[A-F0-9]{6}$/);
    expect(book.isbnNumber).toBe('978-0-13-468599-1');
    expect(book.status).toBe('PUBLISHED_IN_CIRCULATION');
    expect(book.auditSha256).toBeDefined();
  });

  // Test 8: UGC CAS Table 2 Category 2 Points Allocation
  it('should allocate correct UGC CAS Table 2 Category 2 points across publication types', () => {
    expect(UGC_CAS_BOOK_POINTS.INTERNATIONAL_PEER_REVIEWED_MONOGRAPH).toBe(12);
    expect(UGC_CAS_BOOK_POINTS.NATIONAL_ACADEMIC_TEXTBOOK).toBe(10);
    expect(UGC_CAS_BOOK_POINTS.TRANSLATED_INDIAN_LANGUAGE_WORK).toBe(8);
    expect(UGC_CAS_BOOK_POINTS.EDITED_VOLUME_CHAPTER).toBe(5);
  });

  // Test 9: Royalty Cycle Calculation with Section 194J 10% Statutory TDS
  it('should calculate gross royalty, deduct 10% statutory TDS, and disburse to author', () => {
    const book = createBookPublishingRecord({
      facultyAuthorId: 'FAC-EE-2016-092',
      facultyAuthorName: 'Dr. Vikramaditya Sen',
      department: 'Electrical Engineering',
      bookTitle: 'Renewable Power Grid Integration',
      isbnNumber: '978-81-203-5120-2',
      publisherName: 'McGraw Hill India',
      publicationType: 'NATIONAL_ACADEMIC_TEXTBOOK',
      royaltyAgreementPercent: 15 // 15% royalty
    });

    // Cycle: 1000 copies sold, ₹500,000 gross sales
    // Gross Royalty = 15% of 500,000 = ₹75,000
    // TDS (10% Sec 194J) = ₹7,500
    // Net Author Payout = ₹67,500
    const { record: updatedBook, cycle } = recordRoyaltyCycle(book, {
      cyclePeriod: '2025-2026 H1',
      copiesSold: 1000,
      grossSalesInr: 500000
    });

    expect(cycle.grossRoyaltyEarnedInr).toBe(75000);
    expect(cycle.tdsDeductedInr).toBe(7500);
    expect(cycle.netDisbursedInr).toBe(67500);
    expect(updatedBook.totalCopiesSold).toBe(1000);
    expect(updatedBook.totalRoyaltyEarnedInr).toBe(75000);
    expect(cycle.status).toBe('CALCULATED_PENDING');

    // Disburse royalty
    const disburseRes = disburseRoyaltyToAuthor(updatedBook, cycle.cycleId, 'TXN-NEFT-88991122');
    expect(disburseRes.success).toBe(true);
    expect(disburseRes.record.royaltyCycles[0].status).toBe('DISBURSED_CLEARED');
    expect(disburseRes.record.royaltyCycles[0].payoutReferenceNumber).toBe('TXN-NEFT-88991122');
  });

  // Test 10: NEP 2020 Bharatiya Bhasha Translation Grant Milestones & CSV Export
  it('should sanction NEP translation grant and disburse 50/50 milestones and export CSV', () => {
    let book = createBookPublishingRecord({
      facultyAuthorId: 'FAC-ME-2017-040',
      facultyAuthorName: 'Prof. Ramesh Kulkarni',
      department: 'Mechanical Engineering',
      bookTitle: 'Fluid Mechanics & Turbomachinery Principles',
      isbnNumber: '978-93-89845-12-0',
      publisherName: 'Central University Press',
      publicationType: 'TRANSLATED_INDIAN_LANGUAGE_WORK',
      royaltyAgreementPercent: 10
    });

    // Sanction Grant of ₹2,00,000 (Within ₹2.5L limit)
    const grantRes = sanctionTranslationGrant(book, {
      sourceLanguage: 'English',
      targetIndianLanguage: 'Marathi',
      sanctionedAmountInr: 200000
    });

    expect(grantRes.success).toBe(true);
    book = grantRes.record;
    expect(book.translationGrant?.sanctionedAmountInr).toBe(200000);

    // Disburse Milestone 1 (50% = ₹100,000)
    const m1Res = disburseTranslationMilestone(book, 1);
    expect(m1Res.success).toBe(true);
    expect(m1Res.disbursedInr).toBe(100000);
    book = m1Res.record;
    expect(book.translationGrant?.disbursedAmountInr).toBe(100000);

    // Disburse Milestone 2 (50% = ₹100,000)
    const m2Res = disburseTranslationMilestone(book, 2);
    expect(m2Res.success).toBe(true);
    expect(m2Res.disbursedInr).toBe(100000);
    book = m2Res.record;
    expect(book.translationGrant?.disbursedAmountInr).toBe(200000);

    // Verify SHA-256 seal and CSV export
    const seal = generateBookPublishingSeal(book);
    expect(seal).toBe(book.auditSha256);

    const csv = exportFacultyBookPublishingLedgerCSV([book]);
    expect(csv).toContain('Book Record ID,Faculty Author,Department,Book Title');
    expect(csv).toContain('Fluid Mechanics & Turbomachinery Principles');
    expect(csv).toContain('TRANSLATED_INDIAN_LANGUAGE_WORK');
    expect(csv).toContain(seal);
  });
});
