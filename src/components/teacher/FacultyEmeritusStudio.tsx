'use client';

import React, { useState } from 'react';
import {
  FacultyEmeritusRecord,
  EmeritusFellowshipStage,
  DEFAULT_EMERITUS_FELLOWS,
  registerEmeritusFellowship,
  activateEmeritusTenure,
  generateMonthlyHonorariumVoucher,
  claimContingencyExpense,
  concludeEmeritusTenure,
  exportFacultyEmeritusLedgerCSV,
  ContingencyClaim
} from '@/lib/teacher/facultyEmeritusFellowship';

export default function FacultyEmeritusStudio() {
  const [fellows, setFellows] = useState<FacultyEmeritusRecord[]>(DEFAULT_EMERITUS_FELLOWS);
  const [activeTab, setActiveTab] = useState<'ALL' | EmeritusFellowshipStage>('ALL');
  const [selectedFellow, setSelectedFellow] = useState<FacultyEmeritusRecord | null>(null);

  // Modal toggles
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isConcludeModalOpen, setIsConcludeModalOpen] = useState(false);
  const [isSealModalOpen, setIsSealModalOpen] = useState(false);

  // Onboard Form State
  const [formName, setFormName] = useState('Prof. Dr. V. K. Ramanathan');
  const [formEmail, setFormEmail] = useState('vk.ramanathan@university.ac.in');
  const [formDept, setFormDept] = useState('Chemistry & Chemical Biology');
  const [formSuperDate, setFormSuperDate] = useState('2025-11-30');
  const [formAgeSuper, setFormAgeSuper] = useState(65);
  const [formCurrentAge, setFormCurrentAge] = useState(65);
  const [formSpec, setFormSpec] = useState('Asymmetric Catalysis & Sustainable Organic Synthesis');
  const [formMonograph, setFormMonograph] = useState('Chiral Ligand Architecture in Modern Organocatalysis');
  const [formError, setFormError] = useState<string | null>(null);

  // Voucher Form State
  const [voucherMonth, setVoucherMonth] = useState('2026-03');
  const [voucherNeft, setVoucherNeft] = useState('');

  // Claim Form State
  const [claimCategory, setClaimCategory] = useState<ContingencyClaim['expenseCategory']>('ACADEMIC_BOOKS');
  const [claimDesc, setClaimDesc] = useState('');
  const [claimAmount, setClaimAmount] = useState(15000);
  const [claimDate, setClaimDate] = useState(new Date().toISOString().split('T')[0]);
  const [claimError, setClaimError] = useState<string | null>(null);

  // Conclude Form State
  const [concludeIsbn, setConcludeIsbn] = useState('isbn:978-0-19-887412-5');
  const [concludeScholars, setConcludeScholars] = useState(3);
  const [concludeMasterclasses, setConcludeMasterclasses] = useState(10);

  // Telemetry Aggregates
  const totalFellows = fellows.length;
  const activeCount = fellows.filter(f => f.stage === 'FELLOWSHIP_ACTIVE').length;
  const totalGrossDisbursed = fellows.reduce((acc, f) => {
    return acc + f.vouchers.reduce((sum, v) => sum + v.grossHonorariumInr, 0);
  }, 0);
  const totalTdsDeducted = fellows.reduce((acc, f) => {
    return acc + f.vouchers.reduce((sum, v) => sum + v.tdsDeductionInr, 0);
  }, 0);
  const totalContingencyUtilized = fellows.reduce((acc, f) => acc + f.contingencyUtilizedInr, 0);
  const totalScholarsMentored = fellows.reduce((acc, f) => acc + f.coMentoredPhdScholarsCount, 0);

  const filteredFellows = activeTab === 'ALL'
    ? fellows
    : fellows.filter(f => f.stage === activeTab);

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const newFellow = registerEmeritusFellowship({
        facultyName: formName,
        facultyEmail: formEmail,
        hostDepartment: formDept,
        dateOfSuperannuation: formSuperDate,
        ageAtSuperannuation: Number(formAgeSuper),
        currentAge: Number(formCurrentAge),
        academicSpecialization: formSpec,
        proposedResearchMonograph: formMonograph
      });

      // Automatically activate tenure for demonstration
      const activated = activateEmeritusTenure(newFellow, new Date().toISOString().split('T')[0]);
      setFellows([activated, ...fellows]);
      setIsOnboardModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Validation error');
    }
  };

  const handleGenerateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFellow) return;
    try {
      const updated = generateMonthlyHonorariumVoucher(selectedFellow, voucherMonth, voucherNeft || undefined);
      setFellows(fellows.map(f => f.fellowshipId === updated.fellowshipId ? updated : f));
      setSelectedFellow(updated);
      setIsVoucherModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Voucher generation failed');
    }
  };

  const handleClaimContingency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFellow) return;
    setClaimError(null);
    try {
      const updated = claimContingencyExpense(selectedFellow, {
        expenseCategory: claimCategory,
        description: claimDesc,
        claimedAmountInr: Number(claimAmount),
        invoiceDate: claimDate
      });
      setFellows(fellows.map(f => f.fellowshipId === updated.fellowshipId ? updated : f));
      setSelectedFellow(updated);
      setIsClaimModalOpen(false);
    } catch (err: any) {
      setClaimError(err.message || 'Contingency claim failed');
    }
  };

  const handleConcludeTenure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFellow) return;
    const updated = concludeEmeritusTenure(selectedFellow, {
      monographDoiOrIsbn: concludeIsbn,
      coMentoredPhdScholarsCount: Number(concludeScholars),
      masterclassesConductedCount: Number(concludeMasterclasses)
    });
    setFellows(fellows.map(f => f.fellowshipId === updated.fellowshipId ? updated : f));
    setSelectedFellow(updated);
    setIsConcludeModalOpen(false);
  };

  const handleExportCSV = () => {
    const csv = exportFacultyEmeritusLedgerCSV(fellows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `UGC_Emeritus_Fellowship_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStageBadge = (stage: EmeritusFellowshipStage) => {
    switch (stage) {
      case 'APPLICATION_SUBMITTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">SUBMITTED</span>;
      case 'PEER_COMMITTEE_RECOMMENDED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-700/60">PEER RECOMMENDED</span>;
      case 'SYNDICATE_APPROVED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/60">SYNDICATE APPROVED</span>;
      case 'FELLOWSHIP_ACTIVE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">FELLOWSHIP ACTIVE</span>;
      case 'FINAL_MONOGRAPH_SUBMITTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-700/60">MONOGRAPH SUBMITTED</span>;
      case 'TENURE_HONORABLY_COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60">HONORABLY CONCLUDED</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                Faculty Emeritus Fellowship & Superannuation Studio
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                  UGC Scheme Mandate
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                UGC Emeritus Guidelines (Fixed ₹50,000/mo Honorarium, ₹50,000/yr Contingency, 10% Section 194J TDS Deduction)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnboardModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Onboard Superannuated Professor
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Emeritus CSV
          </button>
        </div>
      </div>

      {/* Telemetry Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Active Fellows</span>
          <p className="text-2xl font-bold text-white">{activeCount} <span className="text-xs text-slate-500 font-normal">/ {totalFellows}</span></p>
          <span className="text-[11px] text-emerald-400">Tenure Active</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Monthly Honorarium</span>
          <p className="text-2xl font-bold text-cyan-400">₹{(activeCount * 50000 / 100000).toFixed(2)} L</p>
          <span className="text-[11px] text-slate-500">₹50,000 / month per fellow</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Gross Disbursed</span>
          <p className="text-2xl font-bold text-emerald-400">₹{(totalGrossDisbursed / 100000).toFixed(2)} L</p>
          <span className="text-[11px] text-slate-500">Cumulative Outlay</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Section 194J TDS (10%)</span>
          <p className="text-2xl font-bold text-amber-400">₹{(totalTdsDeducted / 100000).toFixed(2)} L</p>
          <span className="text-[11px] text-slate-500">Remitted to IT Dept</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Contingency Utilized</span>
          <p className="text-2xl font-bold text-indigo-400">₹{(totalContingencyUtilized / 1000).toFixed(1)} K</p>
          <span className="text-[11px] text-slate-500">₹50K Grant / Year</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Ph.D. Scholars Co-Mentored</span>
          <p className="text-2xl font-bold text-purple-400">{totalScholarsMentored}</p>
          <span className="text-[11px] text-slate-500">Doctoral Mentorship</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {(['ALL', 'FELLOWSHIP_ACTIVE', 'TENURE_HONORABLY_COMPLETED', 'APPLICATION_SUBMITTED'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {tab.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Fellows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFellows.map(fellow => {
          const totalVouchersGross = fellow.vouchers.reduce((s, v) => s + v.grossHonorariumInr, 0);
          const totalVouchersNet = fellow.vouchers.reduce((s, v) => s + v.netDisbursedInr, 0);
          const contingencyRemaining = fellow.annualContingencyGrantInr - fellow.contingencyUtilizedInr;

          return (
            <div
              key={fellow.fellowshipId}
              className="p-6 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl space-y-5 transition-all shadow-lg"
            >
              {/* Header */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {fellow.fellowshipId}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">
                      Age {fellow.currentAge} Yrs (Superannuated at {fellow.ageAtSuperannuation})
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{fellow.facultyName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {fellow.hostDepartment} • {fellow.academicSpecialization}
                  </p>
                </div>
                <div>{getStageBadge(fellow.stage)}</div>
              </div>

              {/* Research Monograph & Deliverables */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Research Monograph:</span>
                  <span className="text-slate-200 font-semibold">{fellow.proposedResearchMonograph}</span>
                </div>
                {fellow.monographDoiOrIsbn && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-[11px]">
                      {fellow.monographDoiOrIsbn}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800/60 text-[11px]">
                  <span>Co-Mentored Scholars: <strong className="text-purple-300">{fellow.coMentoredPhdScholarsCount}</strong></span>
                  <span>Masterclasses Delivered: <strong className="text-amber-300">{fellow.masterclassesConductedCount}</strong></span>
                  <span>Tenure: <strong className="text-slate-200">{fellow.tenureStartDate || 'Pending'} to {fellow.tenureEndDate || 'Pending'}</strong></span>
                </div>
              </div>

              {/* Financial Progress & Contingency Bar */}
              <div className="space-y-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Annual Research Contingency (₹50,000)</span>
                  <span className="text-indigo-400 font-semibold">₹{fellow.contingencyUtilizedInr} / ₹{fellow.annualContingencyGrantInr}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${Math.min(100, (fellow.contingencyUtilizedInr / fellow.annualContingencyGrantInr) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Balance: <strong className="text-emerald-400">₹{contingencyRemaining}</strong></span>
                  <span>Honorarium Disbursed: <strong className="text-white">₹{totalVouchersNet}</strong> (Gross ₹{totalVouchersGross})</span>
                </div>
              </div>

              {/* Vouchers & Claims Count */}
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Disbursed Months: <strong className="text-white">{fellow.vouchers.length}</strong></span>
                <span>Contingency Invoices: <strong className="text-white">{fellow.contingencyClaims.length}</strong></span>
              </div>

              {/* Card Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                <button
                  onClick={() => {
                    setSelectedFellow(fellow);
                    setIsSealModalOpen(true);
                  }}
                  className="text-slate-400 hover:text-slate-200 underline font-mono text-[11px]"
                >
                  Seal: {fellow.auditSha256.substring(0, 10)}...
                </button>

                <div className="flex items-center gap-1.5">
                  {fellow.stage === 'FELLOWSHIP_ACTIVE' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedFellow(fellow);
                          setIsVoucherModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium"
                      >
                        Monthly Voucher (10% TDS)
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFellow(fellow);
                          setIsClaimModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
                      >
                        Claim Contingency
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFellow(fellow);
                          setIsConcludeModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium"
                      >
                        Conclude Tenure
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Onboard Superannuated Professor */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white">Onboard Superannuated Professor (UGC Emeritus)</h2>
              <button
                onClick={() => setIsOnboardModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 rounded text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleOnboard} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Faculty Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Faculty Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Host Department</label>
                <input
                  type="text"
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Superannuation Date</label>
                  <input
                    type="date"
                    value={formSuperDate}
                    onChange={(e) => setFormSuperDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Age at Superannuation</label>
                  <input
                    type="number"
                    min="60"
                    max="70"
                    value={formAgeSuper}
                    onChange={(e) => setFormAgeSuper(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                    required
                  />
                  <span className="text-[10px] text-slate-500">UGC Min: 60 Yrs</span>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Current Age</label>
                  <input
                    type="number"
                    min="60"
                    max="70"
                    value={formCurrentAge}
                    onChange={(e) => setFormCurrentAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                    required
                  />
                  <span className="text-[10px] text-slate-500">UGC Max: 70 Yrs</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Academic Specialization</label>
                <input
                  type="text"
                  value={formSpec}
                  onChange={(e) => setFormSpec(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Proposed Research Monograph / Book Title</label>
                <input
                  type="text"
                  value={formMonograph}
                  onChange={(e) => setFormMonograph(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium shadow-md"
                >
                  Register & Activate Tenure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Generate Monthly Voucher */}
      {isVoucherModalOpen && selectedFellow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Generate Monthly Fellowship Voucher</h2>
            <p className="text-xs text-slate-400">
              Disbursement for <span className="text-white font-semibold">{selectedFellow.facultyName}</span>
            </p>

            <form onSubmit={handleGenerateVoucher} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Month & Year (YYYY-MM)</label>
                <input
                  type="month"
                  value={voucherMonth}
                  onChange={(e) => setVoucherMonth(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross UGC Honorarium:</span>
                  <span className="text-white font-semibold">₹50,000</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>Section 194J TDS (10%):</span>
                  <span>- ₹5,000</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1">
                  <span>Net NEFT Disbursement:</span>
                  <span>₹45,000</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">NEFT Bank Transaction Ref (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. NEFT-SBI-48912384"
                  value={voucherNeft}
                  onChange={(e) => setVoucherNeft(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold"
                >
                  Authorize NEFT Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Claim Contingency */}
      {isClaimModalOpen && selectedFellow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Claim Research & Book Contingency</h2>
            <p className="text-xs text-slate-400">
              Grant for <span className="text-white font-semibold">{selectedFellow.facultyName}</span> (Remaining Balance: ₹{selectedFellow.annualContingencyGrantInr - selectedFellow.contingencyUtilizedInr})
            </p>

            {claimError && (
              <div className="p-2.5 bg-rose-950/80 border border-rose-800 rounded text-rose-300 text-xs">
                {claimError}
              </div>
            )}

            <form onSubmit={handleClaimContingency} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Expense Category</label>
                <select
                  value={claimCategory}
                  onChange={(e) => setClaimCategory(e.target.value as ContingencyClaim['expenseCategory'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                >
                  <option value="ACADEMIC_BOOKS">ACADEMIC BOOKS & MONOGRAPHS</option>
                  <option value="FIELD_TRAVEL">FIELD TRAVEL & DATA COLLECTION</option>
                  <option value="LAB_REAGENTS">LAB CONSUMABLES & REAGENTS</option>
                  <option value="CONFERENCE_REGISTRATION">CONFERENCE REGISTRATION FEE</option>
                  <option value="MONOGRAPH_PUBLICATION">MONOGRAPH PUBLICATION SUBVENTION</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Expense Description</label>
                <input
                  type="text"
                  placeholder="e.g. Oxford University Press reference volumes"
                  value={claimDesc}
                  onChange={(e) => setClaimDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Amount Claimed (INR)</label>
                  <input
                    type="number"
                    max={selectedFellow.annualContingencyGrantInr - selectedFellow.contingencyUtilizedInr}
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={claimDate}
                    onChange={(e) => setClaimDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold"
                >
                  Sanction Contingency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Conclude Tenure */}
      {isConcludeModalOpen && selectedFellow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Conclude Tenure & Submit Monograph</h2>
            <p className="text-xs text-slate-400">
              Concluding for <span className="text-white font-semibold">{selectedFellow.facultyName}</span>
            </p>

            <form onSubmit={handleConcludeTenure} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Monograph ISBN or Permanent DOI</label>
                <input
                  type="text"
                  value={concludeIsbn}
                  onChange={(e) => setConcludeIsbn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Total Co-Mentored Scholars</label>
                  <input
                    type="number"
                    min="1"
                    value={concludeScholars}
                    onChange={(e) => setConcludeScholars(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Masterclasses Delivered</label>
                  <input
                    type="number"
                    min="1"
                    value={concludeMasterclasses}
                    onChange={(e) => setConcludeMasterclasses(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConcludeModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-semibold"
                >
                  Conclude Tenure Honorably
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: SHA-256 Seal Verification */}
      {isSealModalOpen && selectedFellow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Cryptographic Fellowship Audit Seal
            </h2>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs break-all text-emerald-400">
              {selectedFellow.auditSha256}
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Fellowship ID: <span className="text-slate-200">{selectedFellow.fellowshipId}</span></p>
              <p>Faculty Fellow: <span className="text-slate-200">{selectedFellow.facultyName}</span></p>
              <p>Host Department: <span className="text-slate-200">{selectedFellow.hostDepartment}</span></p>
              <p>Lifecycle Stage: <span className="text-cyan-400">{selectedFellow.stage}</span></p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsSealModalOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold"
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
