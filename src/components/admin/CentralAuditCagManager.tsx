'use client';

import React, { useState } from 'react';
import { useGovernanceStore } from '@/lib/hooks/useGovernanceStore';
import {
  AuditObservationRecord,
  AuditParaCategory,
  AuditSeverity,
  SAMPLE_AUDIT_OBSERVATIONS,
  createAuditObservationRecord,
  submitDepartmentAtnReply,
  recordFinancialRecovery,
  dropAuditObservation,
  exportInternalAuditCagLedgerCSV,
  isAuditOverdue
} from '@/lib/admin/centralAuditCagCompliance';

export default function CentralAuditCagManager() {
  const {
    records,
    setRecords,
    syncSource,
    isSaving,
    saveRecord
  } = useGovernanceStore<AuditObservationRecord>('central_internal_audit_cag', SAMPLE_AUDIT_OBSERVATIONS, 'auditRecordId');
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<AuditObservationRecord | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAtnModal, setShowAtnModal] = useState<boolean>(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState<boolean>(false);
  const [showSealModal, setShowSealModal] = useState<boolean>(false);
  const [alertBanner, setAlertBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Audit Memo Form state
  const [newFy, setNewFy] = useState('2025-2026');
  const [newBody, setNewBody] = useState<AuditObservationRecord['auditingBody']>('CAG_PRINCIPAL_DIRECTOR_AUDIT');
  const [newDept, setNewDept] = useState('Central Administration');
  const [newCategory, setNewCategory] = useState<AuditParaCategory>('PROCUREMENT_TENDER_IRREGULARITY');
  const [newSeverity, setNewSeverity] = useState<AuditSeverity>('CRITICAL_CAG_PARA');
  const [newTitle, setNewTitle] = useState('');
  const [newNarrative, setNewNarrative] = useState('');
  const [newImplication, setNewImplication] = useState(500000);
  const [newTargetDate, setNewTargetDate] = useState('2026-06-30');

  // ATN Form state
  const [atnNarrative, setAtnNarrative] = useState('');

  // Recovery Form state
  const [recoveryAmount, setRecoveryAmount] = useState(100000);
  const [recoveryVoucher, setRecoveryVoucher] = useState('RV-2026-0912');

  // Filtering
  const filteredRecords = records.filter(r => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'CAG_CRITICAL') return r.severity === 'CRITICAL_CAG_PARA';
    if (activeTab === 'PROCUREMENT') return r.category === 'PROCUREMENT_TENDER_IRREGULARITY';
    if (activeTab === 'WORKS') return r.category === 'WORKS_CONTRACT_DELAY_PENALTY_NON_RECOVERY';
    if (activeTab === 'GRANTS') return r.category === 'RESEARCH_GRANT_UNSPENT_BALANCE_RETENTION';
    return true;
  });

  // Telemetry KPIs
  const totalObservations = records.length;
  const totalImplicationInr = records.reduce((sum, r) => sum + r.financialImplicationInr, 0);
  const totalRecoveredInr = records.reduce((sum, r) => sum + r.remedialRecoveryAmountInr, 0);
  const droppedCount = records.filter(r => r.status === 'DROPPED_AND_RESOLVED').length;
  const resolvedRatePct = totalObservations > 0 ? Math.round((droppedCount / totalObservations) * 100) : 0;

  // Handlers
  const handleAddObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rec = createAuditObservationRecord({
        financialYear: newFy,
        auditingBody: newBody,
        department: newDept,
        category: newCategory,
        severity: newSeverity,
        observationTitle: newTitle,
        observationNarrative: newNarrative,
        financialImplicationInr: Number(newImplication),
        targetResolutionDate: newTargetDate
      });

      await saveRecord(rec);
      setShowAddModal(false);
      setAlertBanner({ type: 'success', message: `Audit query ${rec.auditRecordId} logged under ${rec.category}` });
    } catch (err: unknown) {
      setAlertBanner({ type: 'error', message: err instanceof Error ? err.message : 'Failed to log observation' });
    }
  };

  const handleAtnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const updated = submitDepartmentAtnReply(selectedRecord, {
      actionTakenNoteNarrative: atnNarrative
    });

    await saveRecord(updated);
    setSelectedRecord(updated);
    setShowAtnModal(false);
    setAlertBanner({ type: 'success', message: `Department ATN reply submitted for ${updated.auditRecordId}` });
  };

  const handleRecordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const updated = recordFinancialRecovery(selectedRecord, {
      recoveryAmountInr: Number(recoveryAmount),
      recoveryVoucherNumber: recoveryVoucher
    });

    await saveRecord(updated);
    setSelectedRecord(updated);
    setShowRecoveryModal(false);
    setAlertBanner({
      type: 'success',
      message: `Recovery of ₹${recoveryAmount.toLocaleString()} recorded via voucher ${recoveryVoucher}. Remaining pending: ₹${updated.pendingRecoveryInr.toLocaleString()}`
    });
  };

  const handleDropObservation = async (record: AuditObservationRecord) => {
    const res = dropAuditObservation(record);
    if (!res.success) {
      setAlertBanner({ type: 'error', message: res.error || 'Cannot drop observation' });
      return;
    }

    await saveRecord(res.record);
    setAlertBanner({
      type: 'success',
      message: `Audit observation ${record.auditRecordId} dropped and resolved by Finance Committee!`
    });
  };

  const handleExportCSV = () => {
    const csvData = exportInternalAuditCagLedgerCSV(records);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Internal_Audit_CAG_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAlertBanner({ type: 'success', message: 'Internal Audit & CAG ledger CSV exported successfully' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 font-mono text-sm">
              CAG Statutory Regulations 2020
            </span>
            <span className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 font-mono text-sm">
              GFR 2017 & PAC Action Taken Notes
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mt-2 flex items-center gap-3">
            Central University Internal Audit & CAG Redressal Console
            <span className={`text-xs px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
              syncSource === 'supabase'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${syncSource === 'supabase' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
              {syncSource === 'supabase' ? 'PostgreSQL Active (support.pinit)' : 'Resilient Local Storage'}
              {isSaving && <span className="text-emerald-400 ml-1">Saving...</span>}
            </span>
          </h1>
          <p className="text-sm text-slate-400">
            Audit memo tracking, GFR public procurement compliance, financial recovery vouchers & ATN para resolution
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-lg shadow-rose-950"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Log Audit Memo
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Audit CSV
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alertBanner && (
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          alertBanner.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
            : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="font-bold">{alertBanner.type === 'success' ? '✓' : '⚠️'}</span>
            <p className="text-sm">{alertBanner.message}</p>
          </div>
          <button onClick={() => setAlertBanner(null)} className="text-slate-400 hover:text-slate-200 text-sm">✕</button>
        </div>
      )}

      {/* Telemetry Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Audit Observations</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">{totalObservations}</p>
          <p className="text-xs text-slate-500 mt-1">CAG & Internal Audit Queries</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Financial Risk Exposure</p>
          <p className="text-2xl font-bold text-rose-400 mt-1">₹{(totalImplicationInr / 100000).toFixed(2)} L</p>
          <p className="text-xs text-slate-500 mt-1">Total Audit Implication</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Recovered / Regularized</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">₹{(totalRecoveredInr / 100000).toFixed(2)} L</p>
          <p className="text-xs text-slate-500 mt-1">Voucher Backed Settlements</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Dropped & Resolved Rate</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">{resolvedRatePct}%</p>
          <p className="text-xs text-slate-500 mt-1">{droppedCount} Observations Dropped</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        {[
          { id: 'ALL', label: 'All Queries' },
          { id: 'CAG_CRITICAL', label: 'CAG Critical Paras' },
          { id: 'PROCUREMENT', label: 'GeM & Procurement' },
          { id: 'WORKS', label: 'Works Contract & LD' },
          { id: 'GRANTS', label: 'Grants & Interest CFI' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === tab.id
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Audit Observation Cards Grid */}
      <div className="space-y-5">
        {filteredRecords.map(record => {
          const overdue = isAuditOverdue(record);
          const recoveryPct = record.financialImplicationInr > 0 
            ? Math.min(100, Math.round((record.remedialRecoveryAmountInr / record.financialImplicationInr) * 100))
            : 100;

          return (
            <div
              key={record.auditRecordId}
              className={`bg-slate-900/50 border rounded-xl p-5 space-y-4 hover:border-slate-700 transition ${
                record.severity === 'CRITICAL_CAG_PARA' ? 'border-rose-900/50' : 'border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {record.auditRecordId}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      record.severity === 'CRITICAL_CAG_PARA'
                        ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold'
                        : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    }`}>
                      {record.severity.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {record.auditingBody.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100">{record.observationTitle}</h3>
                  <p className="text-xs text-slate-400">
                    Dept: <span className="text-slate-200 font-medium">{record.department}</span> | FY: {record.financialYear}
                  </p>
                  <p className="text-xs text-slate-300 mt-1 bg-slate-950/40 p-2.5 rounded border border-slate-800/60">
                    {record.observationNarrative}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 min-w-[200px]">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    record.status === 'DROPPED_AND_RESOLVED'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : record.status === 'DEPARTMENT_REPLY_SUBMITTED'
                      ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                  }`}>
                    {record.status.replace(/_/g, ' ')}
                  </span>

                  {overdue && (
                    <span className="text-[11px] px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded font-mono animate-pulse">
                      ⚠️ OVERDUE FOR ATN
                    </span>
                  )}

                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Target: <span className="text-slate-200 font-semibold">{record.targetResolutionDate}</span>
                  </p>

                  <button
                    onClick={() => {
                      setSelectedRecord(record);
                      setShowSealModal(true);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono mt-1"
                  >
                    <span>Audit Seal</span>
                    <span>🔍</span>
                  </button>
                </div>
              </div>

              {/* Financial Implication & Recovery Bar */}
              <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Financial Implication & Recovery Progress</span>
                  <span className="font-bold text-slate-200">
                    Recovered: <span className="text-emerald-400">₹{record.remedialRecoveryAmountInr.toLocaleString()}</span> / ₹{record.financialImplicationInr.toLocaleString()}
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      recoveryPct === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${recoveryPct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>
                    Pending Recovery: <span className="text-rose-400 font-bold">₹{record.pendingRecoveryInr.toLocaleString()}</span>
                  </span>
                  {record.recoveryVoucherNumber && (
                    <span className="font-mono text-slate-400">
                      Voucher: {record.recoveryVoucherNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Department ATN Reply Preview */}
              {record.actionTakenNoteNarrative && (
                <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded text-xs text-cyan-200 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Department Action Taken Note (ATN):</span>
                    <span className="font-mono text-[11px] text-cyan-400">Submitted: {record.departmentReplyDate}</span>
                  </div>
                  <p className="text-slate-300">{record.actionTakenNoteNarrative}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedRecord(record);
                    setAtnNarrative(record.actionTakenNoteNarrative || '');
                    setShowAtnModal(true);
                  }}
                  className="py-1.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded text-xs font-medium transition"
                >
                  Submit ATN Reply
                </button>

                <button
                  onClick={() => {
                    setSelectedRecord(record);
                    setRecoveryAmount(record.pendingRecoveryInr || 50000);
                    setShowRecoveryModal(true);
                  }}
                  className="py-1.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded text-xs font-medium transition"
                >
                  Record Recovery Voucher
                </button>

                {record.status !== 'DROPPED_AND_RESOLVED' && record.pendingRecoveryInr === 0 && (
                  <button
                    onClick={() => handleDropObservation(record)}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition"
                  >
                    Drop & Resolve Para
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Audit Memo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100">Log New Audit Observation / Memo</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleAddObservation} className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Financial Year</label>
                  <input
                    type="text"
                    required
                    value={newFy}
                    onChange={e => setNewFy(e.target.value)}
                    placeholder="2025-2026"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Auditing Body</label>
                  <select
                    value={newBody}
                    onChange={e => setNewBody(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  >
                    <option value="CAG_PRINCIPAL_DIRECTOR_AUDIT">CAG Principal Director of Audit</option>
                    <option value="INTERNAL_AUDIT_OFFICE">University Internal Audit Office</option>
                    <option value="MINISTRY_FINANCE_INSPECTION">Ministry of Finance Inspection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Department Concerned</label>
                  <input
                    type="text"
                    required
                    value={newDept}
                    onChange={e => setNewDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as AuditParaCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  >
                    <option value="PROCUREMENT_TENDER_IRREGULARITY">Procurement & GeM Irregularity</option>
                    <option value="WORKS_CONTRACT_DELAY_PENALTY_NON_RECOVERY">Works Delay & LD Non-Recovery</option>
                    <option value="ESTABLISHMENT_PAY_FIXATION_ERROR">Pay Fixation & Pension Anomaly</option>
                    <option value="RESEARCH_GRANT_UNSPENT_BALANCE_RETENTION">Unspent Grant / CFI Interest</option>
                    <option value="UNAUTHORIZED_FEE_CONCESSION">Unauthorized Fee Concession</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs">Observation Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Non-adherence to GFR 149 GeM bidding..."
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs">Detailed Narrative / Audit Finding</label>
                <textarea
                  rows={3}
                  required
                  value={newNarrative}
                  onChange={e => setNewNarrative(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Financial Implication (INR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newImplication}
                    onChange={e => setNewImplication(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Target ATN Date</label>
                  <input
                    type="date"
                    required
                    value={newTargetDate}
                    onChange={e => setNewTargetDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold"
                >
                  Record Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit ATN Reply Modal */}
      {showAtnModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Submit Action Taken Note (ATN)</h3>
                <p className="text-xs text-slate-400">{selectedRecord.auditRecordId}</p>
              </div>
              <button onClick={() => setShowAtnModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleAtnSubmit} className="space-y-3 text-sm">
              <div>
                <label className="text-slate-400 text-xs">Department Formal Reply & Remedial Action</label>
                <textarea
                  rows={4}
                  required
                  value={atnNarrative}
                  onChange={e => setAtnNarrative(e.target.value)}
                  placeholder="Provide detailed statutory explanation and evidence of regularized procedures..."
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAtnModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                >
                  Submit Official ATN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Recovery Modal */}
      {showRecoveryModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Record Financial Recovery Voucher</h3>
                <p className="text-xs text-slate-400">{selectedRecord.auditRecordId}</p>
              </div>
              <button onClick={() => setShowRecoveryModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleRecordRecovery} className="space-y-3 text-sm">
              <div>
                <label className="text-slate-400 text-xs">Recovery Amount (INR)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={recoveryAmount}
                  onChange={e => setRecoveryAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Outstanding Pending: ₹{selectedRecord.pendingRecoveryInr.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="text-slate-400 text-xs">Treasury / Recovery Voucher No.</label>
                <input
                  type="text"
                  required
                  value={recoveryVoucher}
                  onChange={e => setRecoveryVoucher(e.target.value)}
                  placeholder="RV-2026-9901"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1 uppercase"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                >
                  Confirm Recovery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seal Inspector Modal */}
      {showSealModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Cryptographic Seal Inspector</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedRecord.auditRecordId}</p>
              </div>
              <button onClick={() => setShowSealModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 block">SHA-256 Audit Seal</span>
                <span className="font-mono text-emerald-400 break-all">{selectedRecord.auditSha256}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Auditing Body:</span>
                  <span className="text-slate-200 font-semibold">{selectedRecord.auditingBody}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Financial Implication:</span>
                  <span className="text-slate-200 font-semibold">₹{selectedRecord.financialImplicationInr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Remedial Recovery:</span>
                  <span className="text-emerald-400 font-semibold">₹{selectedRecord.remedialRecoveryAmountInr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pending Balance:</span>
                  <span className="text-rose-400 font-semibold">₹{selectedRecord.pendingRecoveryInr.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowSealModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
