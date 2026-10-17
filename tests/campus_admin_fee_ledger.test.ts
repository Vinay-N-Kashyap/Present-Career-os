import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { FeeLedgerEngine, computeReceiptHash } from '../src/lib/admin/feeLedger';

describe('TASK-853: Campus Sub-Ledger & Fee Ledger Engine', () => {
  let engine: FeeLedgerEngine;

  beforeEach(() => {
    engine = new FeeLedgerEngine();
  });

  test('creates invoice with multiple line items and generates double-entry DEBITs', () => {
    const inv = engine.createInvoice({
      id: 'inv-2026-001',
      institutionId: 'inst-apex-001',
      studentRoll: 'CS-2026-042',
      academicYear: '2026-2027',
      semester: 5,
      dueDate: '2026-11-15',
      lineItems: [
        { category: 'tuition', description: 'Semester Tuition Fee', amount: 45000 },
        { category: 'lab_infrastructure', description: 'High-Performance Computing Lab', amount: 12000 },
        { category: 'examination', description: 'Term End Exam Fee', amount: 3000 },
      ],
    });

    assert.equal(inv.id, 'inv-2026-001');
    assert.equal(inv.totalDue, 60000);
    assert.equal(inv.totalPaid, 0);
    assert.equal(inv.balance, 60000);
    assert.equal(inv.status, 'unpaid');

    const summary = engine.getInstitutionalSummary('inst-apex-001');
    assert.equal(summary.totalBilled, 60000);
    assert.equal(summary.totalCollected, 0);
    assert.equal(summary.totalOutstanding, 60000);
    assert.equal(summary.transactionCount, 3);
    assert.equal(summary.invariantSatisfied, true);
  });

  test('records partial payments and updates balance and status', () => {
    engine.createInvoice({
      id: 'inv-2026-002',
      institutionId: 'inst-apex-001',
      studentRoll: 'CS-2026-042',
      academicYear: '2026-2027',
      semester: 5,
      dueDate: '2026-11-15',
      lineItems: [{ category: 'tuition', description: 'Tuition', amount: 50000 }],
    });

    const res = engine.recordPayment({
      invoiceId: 'inv-2026-002',
      institutionId: 'inst-apex-001',
      amount: 20000,
      paymentMethod: 'upi',
      referenceNumber: 'UPI-TXN-984210',
    });

    assert.equal(res.invoice.totalPaid, 20000);
    assert.equal(res.invoice.balance, 30000);
    assert.equal(res.invoice.status, 'partially_paid');
    assert.equal(res.transaction.type, 'CREDIT');
    assert.equal(res.transaction.amount, 20000);

    const summary = engine.getInstitutionalSummary('inst-apex-001');
    assert.equal(summary.totalBilled, 50000);
    assert.equal(summary.totalCollected, 20000);
    assert.equal(summary.totalOutstanding, 30000);
    assert.equal(summary.invariantSatisfied, true);
  });

  test('completes full payment settlement to zero balance', () => {
    engine.createInvoice({
      id: 'inv-2026-003',
      institutionId: 'inst-apex-001',
      studentRoll: 'CS-2026-042',
      academicYear: '2026-2027',
      semester: 5,
      dueDate: '2026-11-15',
      lineItems: [{ category: 'tuition', description: 'Tuition', amount: 40000 }],
    });

    engine.recordPayment({
      invoiceId: 'inv-2026-003',
      institutionId: 'inst-apex-001',
      amount: 25000,
      paymentMethod: 'bank_transfer',
      referenceNumber: 'NEFT-88392',
    });

    const secondPayment = engine.recordPayment({
      invoiceId: 'inv-2026-003',
      institutionId: 'inst-apex-001',
      amount: 15000,
      paymentMethod: 'card',
      referenceNumber: 'CARD-AUTH-1029',
    });

    assert.equal(secondPayment.invoice.totalPaid, 40000);
    assert.equal(secondPayment.invoice.balance, 0);
    assert.equal(secondPayment.invoice.status, 'paid');

    const summary = engine.getInstitutionalSummary('inst-apex-001');
    assert.equal(summary.totalOutstanding, 0);
    assert.equal(summary.totalCollected, 40000);
    assert.equal(summary.invariantSatisfied, true);
  });

  test('strictly rejects overpayment beyond remaining invoice balance', () => {
    engine.createInvoice({
      id: 'inv-2026-004',
      institutionId: 'inst-apex-001',
      studentRoll: 'CS-2026-042',
      academicYear: '2026-2027',
      semester: 5,
      dueDate: '2026-11-15',
      lineItems: [{ category: 'tuition', description: 'Tuition', amount: 10000 }],
    });

    assert.throws(
      () => {
        engine.recordPayment({
          invoiceId: 'inv-2026-004',
          institutionId: 'inst-apex-001',
          amount: 15000, // Exceeds balance by 5000
          paymentMethod: 'card',
          referenceNumber: 'ERR-TXN',
        });
      },
      /Overpayment rejected/
    );
  });

  test('blocks cross-tenant invoice payment access', () => {
    engine.createInvoice({
      id: 'inv-apex-005',
      institutionId: 'inst-apex-001',
      studentRoll: 'CS-001',
      academicYear: '2026-2027',
      semester: 1,
      dueDate: '2026-11-15',
      lineItems: [{ category: 'tuition', description: 'Tuition', amount: 5000 }],
    });

    assert.throws(
      () => {
        engine.recordPayment({
          invoiceId: 'inv-apex-005',
          institutionId: 'inst-metro-002', // Mismatched institution
          amount: 5000,
          paymentMethod: 'upi',
          referenceNumber: 'FAIL-TXN',
        });
      },
      /Tenant mismatch/
    );
  });

  test('generates cryptographic SHA-256 tamper-evident receipt verification proof', () => {
    const hash = computeReceiptHash(
      'inst-apex-001',
      'inv-001',
      'CS-001',
      50000,
      '2026-10-16T12:00:00.000Z',
      'TXN-VERIFY'
    );
    assert.equal(typeof hash, 'string');
    assert.equal(hash.length, 64); // SHA-256 hex digest length
  });
});
