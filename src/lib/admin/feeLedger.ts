/**
 * PinIT Career OS - Campus Sub-Ledger & Fee Ledger Engine
 * Module ID: TASK-853
 * Architecture Reference: INSTITUTIONAL_ONE_PAGER_MEMO.md & PINIT_ALL_IN_ONE_MASTER_SRS_AND_VISUALS_BIBLE.pdf
 * 
 * Capabilities:
 * - Double-entry sub-ledger accounting for campus fees (Tuition, Lab Infrastructure, Library, Examination, Hostel).
 * - Partial installment management with over-payment prevention.
 * - Cryptographic SHA-256 tamper-evident receipt verification hashing.
 * - Invariant assertions: sum(DEBIT) === sum(CREDIT) + total_outstanding_receivables.
 * - Multi-tenant isolation with institutionId partitioning.
 */

import { createHash } from 'crypto';

export type FeeCategory =
  | 'tuition'
  | 'lab_infrastructure'
  | 'library'
  | 'examination'
  | 'hostel_mess'
  | 'career_training';

export type PaymentMethod =
  | 'bank_transfer'
  | 'card'
  | 'upi'
  | 'scholarship'
  | 'waiver';

export interface FeeLineItem {
  category: FeeCategory;
  description: string;
  amount: number;
}

export interface FeeInvoice {
  id: string;
  institutionId: string;
  studentRoll: string;
  academicYear: string;
  semester: number;
  dueDate: string;
  lineItems: FeeLineItem[];
  totalDue: number;
  totalPaid: number;
  balance: number;
  status: 'unpaid' | 'partially_paid' | 'paid' | 'overdue' | 'waived';
  createdAt: string;
}

export interface LedgerTransaction {
  id: string;
  invoiceId: string;
  institutionId: string;
  studentRoll: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  category: FeeCategory;
  paymentMethod?: PaymentMethod;
  referenceNumber: string;
  receiptHash: string;
  timestamp: string;
}

export interface InstitutionalLedgerSummary {
  institutionId: string;
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
  transactionCount: number;
  invariantSatisfied: boolean;
}

/**
 * Computes tamper-evident SHA-256 hash for payment receipt verification.
 */
export function computeReceiptHash(
  institutionId: string,
  invoiceId: string,
  studentRoll: string,
  amount: number,
  timestamp: string,
  referenceNumber: string
): string {
  const payload = `${institutionId}:${invoiceId}:${studentRoll}:${amount.toFixed(2)}:${timestamp}:${referenceNumber}`;
  return createHash('sha256').update(payload).digest('hex');
}

export class FeeLedgerEngine {
  private invoices: Map<string, FeeInvoice> = new Map();
  private transactions: LedgerTransaction[] = [];

  /**
   * Generates a new student fee invoice and records corresponding DEBIT transactions.
   */
  createInvoice(params: {
    id: string;
    institutionId: string;
    studentRoll: string;
    academicYear: string;
    semester: number;
    dueDate: string;
    lineItems: FeeLineItem[];
  }): FeeInvoice {
    const { id, institutionId, studentRoll, academicYear, semester, dueDate, lineItems } = params;

    if (!institutionId || !studentRoll) {
      throw new Error('FeeLedger: institutionId and studentRoll are mandatory.');
    }

    if (!lineItems || lineItems.length === 0) {
      throw new Error('FeeLedger: Invoice must have at least one line item.');
    }

    let totalDue = 0;
    for (const item of lineItems) {
      if (item.amount <= 0) {
        throw new Error(`FeeLedger: Line item [${item.description}] has non-positive amount [${item.amount}].`);
      }
      totalDue += item.amount;
    }

    const now = new Date().toISOString();
    const invoice: FeeInvoice = {
      id,
      institutionId,
      studentRoll,
      academicYear,
      semester,
      dueDate,
      lineItems,
      totalDue: Math.round(totalDue * 100) / 100,
      totalPaid: 0,
      balance: Math.round(totalDue * 100) / 100,
      status: 'unpaid',
      createdAt: now,
    };

    this.invoices.set(id, invoice);

    // Record initial DEBIT entry for each line item (Institutional Accounts Receivable)
    lineItems.forEach((item, idx) => {
      const txId = `tx-deb-${id}-${idx + 1}`;
      const hash = computeReceiptHash(institutionId, id, studentRoll, item.amount, now, txId);
      this.transactions.push({
        id: txId,
        invoiceId: id,
        institutionId,
        studentRoll,
        type: 'DEBIT',
        amount: item.amount,
        category: item.category,
        referenceNumber: txId,
        receiptHash: hash,
        timestamp: now,
      });
    });

    return invoice;
  }

  /**
   * Records a payment against an invoice with double-entry CREDIT and cryptographic receipt.
   */
  recordPayment(params: {
    invoiceId: string;
    institutionId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    referenceNumber: string;
    category?: FeeCategory;
  }): { invoice: FeeInvoice; transaction: LedgerTransaction } {
    const { invoiceId, institutionId, amount, paymentMethod, referenceNumber, category } = params;

    const invoice = this.invoices.get(invoiceId);
    if (!invoice) {
      throw new Error(`FeeLedger: Invoice [${invoiceId}] not found.`);
    }

    if (invoice.institutionId !== institutionId) {
      throw new Error(`FeeLedger: Tenant mismatch. Attempted to access invoice from another institution.`);
    }

    if (amount <= 0) {
      throw new Error(`FeeLedger: Payment amount must be strictly positive.`);
    }

    if (amount > invoice.balance + 0.001) {
      throw new Error(
        `FeeLedger: Overpayment rejected. Payment amount [${amount}] exceeds remaining balance [${invoice.balance}].`
      );
    }

    const now = new Date().toISOString();
    const txId = `tx-crd-${invoiceId}-${Date.now()}`;
    const hash = computeReceiptHash(institutionId, invoiceId, invoice.studentRoll, amount, now, referenceNumber);

    const transaction: LedgerTransaction = {
      id: txId,
      invoiceId,
      institutionId,
      studentRoll: invoice.studentRoll,
      type: 'CREDIT',
      amount,
      category: category || invoice.lineItems[0].category,
      paymentMethod,
      referenceNumber,
      receiptHash: hash,
      timestamp: now,
    };

    this.transactions.push(transaction);

    // Update invoice state
    invoice.totalPaid = Math.round((invoice.totalPaid + amount) * 100) / 100;
    invoice.balance = Math.round((invoice.totalDue - invoice.totalPaid) * 100) / 100;

    if (invoice.balance <= 0.001) {
      invoice.balance = 0;
      invoice.status = 'paid';
    } else {
      invoice.status = 'partially_paid';
    }

    return { invoice, transaction };
  }

  /**
   * Validates double-entry accounting invariant: sum(DEBIT) === sum(CREDIT) + sum(OUTSTANDING)
   */
  getInstitutionalSummary(institutionId: string): InstitutionalLedgerSummary {
    let totalBilled = 0;
    let totalCollected = 0;
    let transactionCount = 0;

    for (const tx of this.transactions) {
      if (tx.institutionId === institutionId) {
        transactionCount++;
        if (tx.type === 'DEBIT') {
          totalBilled += tx.amount;
        } else if (tx.type === 'CREDIT') {
          totalCollected += tx.amount;
        }
      }
    }

    let totalOutstanding = 0;
    for (const inv of this.invoices.values()) {
      if (inv.institutionId === institutionId) {
        totalOutstanding += inv.balance;
      }
    }

    totalBilled = Math.round(totalBilled * 100) / 100;
    totalCollected = Math.round(totalCollected * 100) / 100;
    totalOutstanding = Math.round(totalOutstanding * 100) / 100;

    const discrepancy = Math.abs(totalBilled - (totalCollected + totalOutstanding));
    const invariantSatisfied = discrepancy < 0.01;

    return {
      institutionId,
      totalBilled,
      totalCollected,
      totalOutstanding,
      transactionCount,
      invariantSatisfied,
    };
  }

  getInvoice(invoiceId: string): FeeInvoice | null {
    return this.invoices.get(invoiceId) || null;
  }

  getStudentInvoices(institutionId: string, studentRoll: string): FeeInvoice[] {
    const list: FeeInvoice[] = [];
    for (const inv of this.invoices.values()) {
      if (inv.institutionId === institutionId && inv.studentRoll === studentRoll) {
        list.push(inv);
      }
    }
    return list;
  }

  clear(): void {
    this.invoices.clear();
    this.transactions = [];
  }
}
