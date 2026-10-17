'use client';

import React, { useState, useEffect } from 'react';
import {
  FeeLedgerEngine,
  FeeInvoice,
  PaymentMethod,
  InstitutionalLedgerSummary,
} from '@/lib/admin/feeLedger';

interface FeeLedgerDashboardProps {
  institutionId: string;
}

// Global persistent instance for runtime demonstration
const ledgerEngine = new FeeLedgerEngine();

export default function FeeLedgerDashboard({ institutionId }: FeeLedgerDashboardProps) {
  const [invoices, setInvoices] = useState<FeeInvoice[]>([]);
  const [summary, setSummary] = useState<InstitutionalLedgerSummary | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [lastReceiptHash, setLastReceiptHash] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Initialize demo invoices
  useEffect(() => {
    let existing = ledgerEngine.getStudentInvoices(institutionId, 'CS-2026-001');
    if (existing.length === 0) {
      ledgerEngine.createInvoice({
        id: 'INV-APEX-2026-001',
        institutionId,
        studentRoll: 'CS-2026-001',
        academicYear: '2026-2027',
        semester: 6,
        dueDate: '2026-11-30',
        lineItems: [
          { category: 'tuition', description: 'Semester 6 Engineering Tuition', amount: 55000 },
          { category: 'lab_infrastructure', description: 'AI & GPU Lab Access', amount: 15000 },
          { category: 'career_training', description: 'PinIT Career OS Masterclass License', amount: 5000 },
        ],
      });

      ledgerEngine.createInvoice({
        id: 'INV-APEX-2026-002',
        institutionId,
        studentRoll: 'CS-2026-002',
        academicYear: '2026-2027',
        semester: 6,
        dueDate: '2026-11-30',
        lineItems: [
          { category: 'tuition', description: 'Semester 6 Engineering Tuition', amount: 55000 },
          { category: 'hostel_mess', description: 'Hostel Accommodation & Dining', amount: 35000 },
        ],
      });

      ledgerEngine.createInvoice({
        id: 'INV-APEX-2026-003',
        institutionId,
        studentRoll: 'EC-2026-015',
        academicYear: '2026-2027',
        semester: 6,
        dueDate: '2026-11-30',
        lineItems: [
          { category: 'tuition', description: 'Semester 6 ECE Tuition', amount: 50000 },
          { category: 'examination', description: 'University Board Exam Fee', amount: 4000 },
        ],
      });

      // Pre-record partial payment on invoice 1
      ledgerEngine.recordPayment({
        invoiceId: 'INV-APEX-2026-001',
        institutionId,
        amount: 35000,
        paymentMethod: 'bank_transfer',
        referenceNumber: 'NEFT-884210',
      });
    }

    refreshData();
  }, [institutionId]);

  const refreshData = () => {
    const list = [
      ...ledgerEngine.getStudentInvoices(institutionId, 'CS-2026-001'),
      ...ledgerEngine.getStudentInvoices(institutionId, 'CS-2026-002'),
      ...ledgerEngine.getStudentInvoices(institutionId, 'EC-2026-015'),
    ];
    setInvoices(list);
    setSummary(ledgerEngine.getInstitutionalSummary(institutionId));
  };

  const handlePay = () => {
    if (!selectedInvoice) return;
    setPaymentError(null);

    try {
      const res = ledgerEngine.recordPayment({
        invoiceId: selectedInvoice.id,
        institutionId,
        amount: paymentAmount,
        paymentMethod,
        referenceNumber: `TXN-${Date.now().toString(36).toUpperCase()}`,
      });
      setLastReceiptHash(res.transaction.receiptHash);
      refreshData();
      setSelectedInvoice(res.invoice);
    } catch (err: any) {
      setPaymentError(err.message || 'Payment processing failed.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Financial Summary & Double-Entry Invariant Card */}
      {summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16
        }}>
          <div style={{
            background: 'var(--card, #0f172a)',
            border: '1px solid #1e293b',
            borderRadius: 12,
            padding: 20,
            borderLeft: '4px solid #6366f1'
          }}>
            <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Total Billed (Debits)</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6, color: '#f8fafc' }}>
              ₹{summary.totalBilled.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Institutional gross receivables</div>
          </div>

          <div style={{
            background: 'var(--card, #0f172a)',
            border: '1px solid #1e293b',
            borderRadius: 12,
            padding: 20,
            borderLeft: '4px solid #10b981'
          }}>
            <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Total Collected (Credits)</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6, color: '#10b981' }}>
              ₹{summary.totalCollected.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>
              {Math.round((summary.totalCollected / summary.totalBilled) * 100)}% realization rate
            </div>
          </div>

          <div style={{
            background: 'var(--card, #0f172a)',
            border: '1px solid #1e293b',
            borderRadius: 12,
            padding: 20,
            borderLeft: '4px solid #f59e0b'
          }}>
            <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Outstanding Balance</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6, color: '#f59e0b' }}>
              ₹{summary.totalOutstanding.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Pending student installments</div>
          </div>

          <div style={{
            background: 'var(--card, #0f172a)',
            border: '1px solid #1e293b',
            borderRadius: 12,
            padding: 20,
            borderLeft: `4px solid ${summary.invariantSatisfied ? '#10b981' : '#ef4444'}`
          }}>
            <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Double-Entry Invariant</div>
            <div style={{
              fontSize: 18,
              fontWeight: 800,
              marginTop: 10,
              color: summary.invariantSatisfied ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              {summary.invariantSatisfied ? '✓ Invariant Verified' : '✕ Invariant Violation'}
            </div>
            <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 4, fontFamily: 'monospace' }}>
              Σ(DEBITS) === Σ(CREDITS) + BAL
            </div>
          </div>
        </div>
      )}

      {/* Invoices Sub-Ledger Table */}
      <div style={{
        background: 'var(--card, #0f172a)',
        borderRadius: 12,
        border: '1px solid #1e293b',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Fee Invoices & Student Accounts</h2>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            Audited Ledger Transactions ({summary?.transactionCount || 0})
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#020617', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>INVOICE ID</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>STUDENT ROLL</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>TOTAL DUE</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>TOTAL PAID</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>BALANCE</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>STATUS</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, idx) => (
                <tr
                  key={inv.id}
                  style={{
                    borderBottom: '1px solid #1e293b',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'
                  }}
                >
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 600, color: '#38bdf8' }}>
                    {inv.id}
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#f8fafc' }}>
                    {inv.studentRoll}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>
                    ₹{inv.totalDue.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#10b981', fontWeight: 600 }}>
                    ₹{inv.totalPaid.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 20px', color: inv.balance > 0 ? '#f59e0b' : '#94a3b8', fontWeight: 700 }}>
                    ₹{inv.balance.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600,
                      background:
                        inv.status === 'paid'
                          ? 'rgba(16, 185, 129, 0.15)'
                          : inv.status === 'partially_paid'
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(239, 68, 68, 0.15)',
                      color:
                        inv.status === 'paid'
                          ? '#10b981'
                          : inv.status === 'partially_paid'
                          ? '#f59e0b'
                          : '#ef4444'
                    }}>
                      {inv.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {inv.balance > 0 ? (
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setPaymentAmount(inv.balance);
                          setLastReceiptHash(null);
                          setPaymentError(null);
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 6,
                          background: '#4f46e5',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Record Payment
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Recording Modal */}
      {selectedInvoice && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 20
        }}>
          <div style={{
            background: '#0f172a',
            borderRadius: 14,
            border: '1px solid #334155',
            width: '100%',
            maxWidth: 560,
            padding: 28,
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Record Payment Sub-Ledger</h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
              Student: <b style={{ color: '#f8fafc' }}>{selectedInvoice.studentRoll}</b> • Remaining Balance: <b style={{ color: '#f59e0b' }}>₹{selectedInvoice.balance.toLocaleString()}</b>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  max={selectedInvoice.balance}
                  style={{
                    width: '100%',
                    background: '#020617',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    padding: 10,
                    color: '#f8fafc',
                    fontSize: 14,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Payment Gateway / Channel
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  style={{
                    width: '100%',
                    background: '#020617',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    padding: 10,
                    color: '#f8fafc',
                    fontSize: 13,
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="upi">UPI (Instant Settlement)</option>
                  <option value="bank_transfer">NEFT / RTGS Bank Transfer</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="scholarship">Institutional Scholarship Waiver</option>
                </select>
              </div>

              {paymentError && (
                <div style={{ padding: 10, borderRadius: 6, background: '#ef444422', border: '1px solid #ef444455', color: '#fca5a5', fontSize: 12 }}>
                  {paymentError}
                </div>
              )}

              {lastReceiptHash && (
                <div style={{
                  padding: 12,
                  borderRadius: 6,
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid #10b98155',
                  color: '#10b981',
                  fontSize: 12
                }}>
                  <div>✓ Payment Settled Successfully!</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    SHA-256 Receipt Proof: {lastReceiptHash}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
              <button
                onClick={() => setSelectedInvoice(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: 6,
                  background: '#1e293b',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  cursor: 'pointer',
                  fontSize: 13
                }}
              >
                Close
              </button>
              <button
                onClick={handlePay}
                style={{
                  padding: '9px 20px',
                  borderRadius: 6,
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 13
                }}
              >
                Execute Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
