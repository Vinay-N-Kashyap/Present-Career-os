'use client';

import React, { useState } from 'react';
import { useGovernanceStore } from '@/lib/hooks/useGovernanceStore';
import {
  ResearchFellowRecord,
  FellowshipTier,
  FundingAgency,
  CityHraTier,
  SAMPLE_RESEARCH_FELLOWS,
  createResearchFellowRecord,
  generateMonthlyStipendBill,
  disburseStipendBill,
  claimContingencyExpenditure,
  upgradeJrfToSrf,
  exportFacultyFellowshipLedgerCSV,
  STATUTORY_BASE_STIPENDS,
  calculateHraAmount,
  MIN_FELLOWSHIP_ATTENDANCE_PERCENT
} from '@/lib/teacher/facultyFellowshipStipend';

export default function FacultyFellowshipStudio() {
  const {
    records: fellows,
    setRecords: setFellows,
    syncSource,
    isSaving,
    saveRecord
  } = useGovernanceStore<ResearchFellowRecord>('faculty_research_fellowships', SAMPLE_RESEARCH_FELLOWS, 'fellowId');
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [selectedFellow, setSelectedFellow] = useState<ResearchFellowRecord | null>(null);

  // Modals state
  const [showEnrollModal, setShowEnrollModal] = useState<boolean>(false);
  const [showBillModal, setShowBillModal] = useState<boolean>(false);
  const [showContingencyModal, setShowContingencyModal] = useState<boolean>(false);
  const [showSealModal, setShowSealModal] = useState<boolean>(false);
  const [alertBanner, setAlertBanner] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  // Enroll Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRoll, setNewRoll] = useState('');
  const [newPiId, setNewPiId] = useState('FAC-EE-2016-092');
  const [newPiName, setNewPiName] = useState('Dr. Vikramaditya Sen');
  const [newDept, setNewDept] = useState('Electrical Engineering');
  const [newAgency, setNewAgency] = useState<FundingAgency>('CSIR_JRF');
  const [newTier, setNewTier] = useState<FellowshipTier>('JRF_JUNIOR_RESEARCH_FELLOW');
  const [newHraTier, setNewHraTier] = useState<CityHraTier>('TIER_X_27_PERCENT');
  const [newEnrollDate, setNewEnrollDate] = useState('2025-01-15');

  // Generate Bill Form state
  const [billMonthYear, setBillMonthYear] = useState('2026-03');
  const [billAttendance, setBillAttendance] = useState(88);

  // Contingency Claim Form state
  const [claimDesc, setClaimDesc] = useState('');
  const [claimCategory, setClaimCategory] = useState<'RESEARCH_CONSUMABLES' | 'SPECIALIZED_BOOKS_JOURNALS' | 'CONFERENCE_TRAVEL' | 'TESTING_CHARACTERIZATION_CHARGES'>('RESEARCH_CONSUMABLES');
  const [claimAmount, setClaimAmount] = useState(4500);
  const [gfrVerified, setGfrVerified] = useState(true);

  // Filtering
  const filteredFellows = fellows.filter(f => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'JRF') return f.fellowshipTier === 'JRF_JUNIOR_RESEARCH_FELLOW';
    if (activeTab === 'SRF') return f.fellowshipTier === 'SRF_SENIOR_RESEARCH_FELLOW';
    if (activeTab === 'POSTDOC') return f.fellowshipTier.startsWith('RA_');
    if (activeTab === 'UGC_CSIR') return f.fundingAgency === 'UGC_NET_JRF' || f.fundingAgency === 'CSIR_JRF';
    return true;
  });

  // Telemetry KPIs
  const totalFellows = fellows.length;
  const totalStipendDisbursedInr = fellows.reduce((sum, f) => {
    return sum + f.monthlyBills
      .filter(b => b.status === 'DISBURSED_DBT_CLEARED')
      .reduce((acc, b) => acc + b.grossStipendInr, 0);
  }, 0);
  const totalContingencySpentInr = fellows.reduce((sum, f) => sum + f.contingencySpentInr, 0);

  // Average attendance across all generated bills
  const allBills = fellows.flatMap(f => f.monthlyBills);
  const avgAttendance = allBills.length > 0 
    ? Math.round(allBills.reduce((acc, b) => acc + b.attendancePercent, 0) / allBills.length) 
    : 85;

  // Handlers
  const handleEnrollFellow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rec = createResearchFellowRecord({
        scholarName: newName,
        scholarEmail: newEmail,
        rollNumber: newRoll,
        piFacultyId: newPiId,
        piFacultyName: newPiName,
        department: newDept,
        fundingAgency: newAgency,
        fellowshipTier: newTier,
        cityHraTier: newHraTier,
        enrollmentDate: newEnrollDate
      });

      await saveRecord(rec);
      setShowEnrollModal(false);
      setAlertBanner({ type: 'success', message: `Scholar ${rec.scholarName} enrolled with ID ${rec.fellowId} under ${rec.fundingAgency}` });
    } catch (err: unknown) {
      setAlertBanner({ type: 'error', message: err instanceof Error ? err.message : 'Enrollment failed' });
    }
  };

  const handleGenerateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFellow) return;

    const res = generateMonthlyStipendBill(selectedFellow, {
      monthYear: billMonthYear,
      attendancePercent: Number(billAttendance)
    });

    await saveRecord(res.fellow);
    setSelectedFellow(res.fellow);
    setShowBillModal(false);

    if (!res.success) {
      setAlertBanner({
        type: 'error',
        message: `Stipend bill flagged: ${res.error}`
      });
    } else {
      setAlertBanner({
        type: 'success',
        message: `Monthly stipend bill of ₹${res.bill.grossStipendInr.toLocaleString()} sanctioned by PI for ${selectedFellow.scholarName}`
      });
    }
  };

  const handleDisburseBill = async (billId: string) => {
    if (!selectedFellow) return;

    const res = disburseStipendBill(selectedFellow, billId);
    if (!res.success) {
      setAlertBanner({ type: 'error', message: res.error || 'Disbursement failed' });
      return;
    }

    await saveRecord(res.fellow);
    setSelectedFellow(res.fellow);
    setAlertBanner({ type: 'success', message: `Stipend DBT transfer released and cleared via PFMS!` });
  };

  const handleClaimContingency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFellow) return;

    const res = claimContingencyExpenditure(selectedFellow, {
      description: claimDesc,
      category: claimCategory,
      invoiceDate: new Date().toISOString().split('T')[0],
      amountInr: Number(claimAmount),
      gfrComplianceVerified: gfrVerified
    });

    if (!res.success) {
      setAlertBanner({ type: 'error', message: res.error || 'Claim rejected' });
      return;
    }

    await saveRecord(res.fellow);
    setSelectedFellow(res.fellow);
    setShowContingencyModal(false);
    setAlertBanner({
      type: 'success',
      message: `GFR 2017 research contingency voucher of ₹${res.claim?.amountInr} approved!`
    });
  };

  const handleUpgradeSrf = async (fellow: ResearchFellowRecord) => {
    const res = upgradeJrfToSrf(fellow, new Date().toISOString().split('T')[0]);
    if (!res.success) {
      setAlertBanner({ type: 'error', message: res.error || 'Upgrade rejected' });
      return;
    }

    await saveRecord(res.fellow);
    setAlertBanner({
      type: 'success',
      message: `🎉 Promotion approved! Scholar upgraded to SRF (Base: ₹42,000/mo) after 2-year assessment committee clearance.`
    });
  };

  const handleExportCSV = () => {
    const csvData = exportFacultyFellowshipLedgerCSV(fellows);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Faculty_Research_Fellowship_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAlertBanner({ type: 'success', message: 'Research Fellowship ledger CSV exported successfully' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400 font-mono text-sm">
              MoE / UGC / CSIR 2023 Scale
            </span>
            <span className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-mono text-sm">
              GFR 2017 Contingency DBT
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mt-2 flex items-center gap-3">
            Faculty Research Fellowship & Scholar Stipend Studio
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
            JRF/SRF/PostDoc monthly stipend billing, 80% attendance countersign hurdle, HRA tiering & contingency ledger
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEnrollModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-lg shadow-indigo-950"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Enroll Research Scholar
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Fellowship CSV
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alertBanner && (
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          alertBanner.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
            : alertBanner.type === 'warning'
            ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
            : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="font-bold">{alertBanner.type === 'success' ? '✓' : alertBanner.type === 'warning' ? '⚠️' : '✕'}</span>
            <p className="text-sm">{alertBanner.message}</p>
          </div>
          <button onClick={() => setAlertBanner(null)} className="text-slate-400 hover:text-slate-200 text-sm">✕</button>
        </div>
      )}

      {/* Telemetry Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Research Fellows</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">{totalFellows}</p>
          <p className="text-xs text-slate-500 mt-1">JRF, SRF & Post-Docs</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Disbursed DBT Stipends</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">₹{(totalStipendDisbursedInr / 100000).toFixed(2)} L</p>
          <p className="text-xs text-slate-500 mt-1">Base + 7th CPC HRA</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Monthly Attendance Hurdle</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{avgAttendance}%</p>
          <p className="text-xs text-slate-500 mt-1">Min {MIN_FELLOWSHIP_ATTENDANCE_PERCENT}% Required for DBT</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Contingency Utilized</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">₹{(totalContingencySpentInr / 1000).toFixed(1)} K</p>
          <p className="text-xs text-slate-500 mt-1">GFR 2017 Verified Vouchers</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        {[
          { id: 'ALL', label: 'All Scholars' },
          { id: 'JRF', label: 'JRF Fellows (₹37k)' },
          { id: 'SRF', label: 'SRF Fellows (₹42k)' },
          { id: 'POSTDOC', label: 'Post-Doc RAs (₹58k+)' },
          { id: 'UGC_CSIR', label: 'CSIR / UGC NET' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Fellows Grid */}
      <div className="space-y-5">
        {filteredFellows.map(fellow => {
          const baseStipend = STATUTORY_BASE_STIPENDS[fellow.fellowshipTier];
          const hraAmount = calculateHraAmount(baseStipend, fellow.cityHraTier);
          const grossMonthly = baseStipend + hraAmount;
          const contingencyBudgetLeft = fellow.annualContingencyLimitInr - fellow.contingencySpentInr;
          const canUpgradeSrf = fellow.fellowshipTier === 'JRF_JUNIOR_RESEARCH_FELLOW' && fellow.tenureMonthsCompleted >= 24;

          return (
            <div
              key={fellow.fellowId}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition"
            >
              {/* Card Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {fellow.fellowId}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                      {fellow.fellowshipTier.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {fellow.fundingAgency.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100">{fellow.scholarName}</h3>
                  <p className="text-xs text-slate-400">
                    Roll: <span className="text-slate-200 font-mono">{fellow.rollNumber}</span> | Email: {fellow.scholarEmail}
                  </p>
                  <p className="text-xs text-slate-400">
                    PI Supervisor: <span className="text-slate-200 font-medium">{fellow.piFacultyName}</span> | Dept: {fellow.department}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    fellow.status === 'ACTIVE_FELLOWSHIP'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : fellow.status === 'SRF_UPGRADED'
                      ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {fellow.status.replace(/_/g, ' ')}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Gross Monthly Payout</p>
                    <p className="text-base font-bold text-emerald-400">
                      ₹{grossMonthly.toLocaleString()} / mo
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFellow(fellow);
                      setShowSealModal(true);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono mt-1"
                  >
                    <span>Audit Seal</span>
                    <span>🔍</span>
                  </button>
                </div>
              </div>

              {/* Financial & Tenure Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 block">Stipend Breakdown</span>
                  <span className="text-slate-200 font-semibold">
                    Base: ₹{baseStipend.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    + HRA ({fellow.cityHraTier.includes('27') ? '27%' : fellow.cityHraTier.includes('18') ? '18%' : '0%'}): ₹{hraAmount.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Contingency Grant (GFR 2017)</span>
                  <span className="text-cyan-400 font-semibold">
                    ₹{contingencyBudgetLeft.toLocaleString()} available
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Spent: ₹{fellow.contingencySpentInr.toLocaleString()} / ₹{fellow.annualContingencyLimitInr.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Tenure Completed</span>
                  <span className="text-slate-200 font-semibold">
                    {fellow.tenureMonthsCompleted} Months
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Enrolled: {fellow.enrollmentDate}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">2-Year Assessment Status</span>
                  {fellow.twoYearAssessmentCompleted ? (
                    <span className="text-emerald-400 font-semibold block">✓ Committee Certified</span>
                  ) : (
                    <span className="text-amber-400 font-semibold block">Pending Assessment</span>
                  )}
                  {canUpgradeSrf && (
                    <button
                      onClick={() => handleUpgradeSrf(fellow)}
                      className="mt-1 text-[11px] px-2 py-0.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 rounded font-medium"
                    >
                      Promote to SRF (₹42k)
                    </button>
                  )}
                </div>
              </div>

              {/* Monthly Stipend Bills History */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Recent Monthly Stipend Bills ({fellow.monthlyBills.length} generated)
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedFellow(fellow);
                        setShowBillModal(true);
                      }}
                      className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded text-xs font-medium transition"
                    >
                      + Generate Monthly Bill
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFellow(fellow);
                        setShowContingencyModal(true);
                      }}
                      className="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 rounded text-xs font-medium transition"
                    >
                      + Claim Contingency
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {fellow.monthlyBills.map(b => (
                    <div
                      key={b.billId}
                      className="p-2.5 bg-slate-950/40 border border-slate-800/60 rounded flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-200 font-mono">{b.monthYear}:</span>
                        <span className="text-slate-300">
                          Gross: ₹{b.grossStipendInr.toLocaleString()}
                        </span>
                        <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                          b.attendancePercent >= MIN_FELLOWSHIP_ATTENDANCE_PERCENT
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          Attn: {b.attendancePercent}%
                        </span>
                        <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                          b.status === 'DISBURSED_DBT_CLEARED'
                            ? 'text-emerald-400'
                            : b.status === 'GUIDE_SANCTIONED'
                            ? 'text-cyan-400'
                            : 'text-rose-400'
                        }`}>
                          {b.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.dbtReferenceNumber && (
                          <span className="text-slate-500 font-mono text-[11px]">{b.dbtReferenceNumber}</span>
                        )}
                        {b.status === 'GUIDE_SANCTIONED' && (
                          <button
                            onClick={() => {
                              setSelectedFellow(fellow);
                              handleDisburseBill(b.billId);
                            }}
                            className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-medium"
                          >
                            Release DBT Transfer
                          </button>
                        )}
                        {b.status === 'ATTENDANCE_DEFICIT_HELD' && (
                          <span className="text-rose-400 text-[11px]">⚠️ Held (&lt;80% attendance)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enroll Fellow Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100">Enroll Research Scholar</h3>
              <button onClick={() => setShowEnrollModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleEnrollFellow} className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Scholar Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Siddharth Rao"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={newRoll}
                    onChange={e => setNewRoll(e.target.value)}
                    placeholder="2025-PHD-EE-008"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs">Scholar Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="siddharth.r@university.ac.in"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">PI Supervisor Name</label>
                  <input
                    type="text"
                    required
                    value={newPiName}
                    onChange={e => setNewPiName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Department</label>
                  <input
                    type="text"
                    required
                    value={newDept}
                    onChange={e => setNewDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Funding Agency</label>
                  <select
                    value={newAgency}
                    onChange={e => setNewAgency(e.target.value as FundingAgency)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  >
                    <option value="CSIR_JRF">CSIR JRF</option>
                    <option value="UGC_NET_JRF">UGC NET JRF</option>
                    <option value="DST_INSPIRE">DST INSPIRE</option>
                    <option value="DBT_BIOCARE">DBT BioCARE</option>
                    <option value="ICMR_FELLOWSHIP">ICMR Fellowship</option>
                    <option value="INSTITUTE_TEQIP">Institute TEQIP</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Fellowship Tier (2023 Scale)</label>
                  <select
                    value={newTier}
                    onChange={e => setNewTier(e.target.value as FellowshipTier)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  >
                    <option value="JRF_JUNIOR_RESEARCH_FELLOW">JRF (₹37,000 / mo)</option>
                    <option value="SRF_SENIOR_RESEARCH_FELLOW">SRF (₹42,000 / mo)</option>
                    <option value="RA_I_POST_DOCTORAL">RA-I PostDoc (₹58,000 / mo)</option>
                    <option value="RA_II_POST_DOCTORAL">RA-II PostDoc (₹61,000 / mo)</option>
                    <option value="RA_III_POST_DOCTORAL">RA-III PostDoc (₹67,000 / mo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">City HRA Category</label>
                  <select
                    value={newHraTier}
                    onChange={e => setNewHraTier(e.target.value as CityHraTier)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  >
                    <option value="TIER_X_27_PERCENT">Tier X (27% Metro HRA)</option>
                    <option value="TIER_Y_18_PERCENT">Tier Y (18% HRA)</option>
                    <option value="TIER_Z_9_PERCENT">Tier Z (9% HRA)</option>
                    <option value="NO_HRA_CAMPUS_RESIDENT">Campus Resident (0% HRA)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Enrollment Date</label>
                  <input
                    type="date"
                    required
                    value={newEnrollDate}
                    onChange={e => setNewEnrollDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                >
                  Enroll Scholar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Monthly Bill Modal */}
      {showBillModal && selectedFellow && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Generate Monthly Stipend Bill</h3>
                <p className="text-xs text-slate-400">{selectedFellow.scholarName} ({selectedFellow.fellowshipTier})</p>
              </div>
              <button onClick={() => setShowBillModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleGenerateBill} className="space-y-3 text-sm">
              <div>
                <label className="text-slate-400 text-xs">Billing Month (YYYY-MM)</label>
                <input
                  type="month"
                  required
                  value={billMonthYear}
                  onChange={e => setBillMonthYear(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs">Monthly Attendance % (Mandatory &ge; 80%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={billAttendance}
                  onChange={e => setBillAttendance(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
                {billAttendance < MIN_FELLOWSHIP_ATTENDANCE_PERCENT && (
                  <p className="text-[11px] text-rose-400 mt-1">
                    ⚠️ Deficit attendance: Below UGC minimum 80%. Bill will be flagged as HELD.
                  </p>
                )}
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Stipend:</span>
                  <span className="text-slate-200 font-semibold">₹{STATUTORY_BASE_STIPENDS[selectedFellow.fellowshipTier].toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">HRA Allowance:</span>
                  <span className="text-slate-200 font-semibold">
                    ₹{calculateHraAmount(STATUTORY_BASE_STIPENDS[selectedFellow.fellowshipTier], selectedFellow.cityHraTier).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800 font-bold">
                  <span className="text-slate-200">Total Gross:</span>
                  <span className="text-emerald-400">
                    ₹{(STATUTORY_BASE_STIPENDS[selectedFellow.fellowshipTier] + calculateHraAmount(STATUTORY_BASE_STIPENDS[selectedFellow.fellowshipTier], selectedFellow.cityHraTier)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBillModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                >
                  Sanction Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Claim Contingency Modal */}
      {showContingencyModal && selectedFellow && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Claim Research Contingency Grant</h3>
                <p className="text-xs text-slate-400">{selectedFellow.scholarName}</p>
              </div>
              <button onClick={() => setShowContingencyModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleClaimContingency} className="space-y-3 text-sm">
              <div>
                <label className="text-slate-400 text-xs">Voucher Description</label>
                <input
                  type="text"
                  required
                  value={claimDesc}
                  onChange={e => setClaimDesc(e.target.value)}
                  placeholder="Sigma-Aldrich Chemical Reagents & Solvents..."
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs">Expenditure Category</label>
                <select
                  value={claimCategory}
                  onChange={e => setClaimCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                >
                  <option value="RESEARCH_CONSUMABLES">Research Consumables & Reagents</option>
                  <option value="SPECIALIZED_BOOKS_JOURNALS">Specialized Books & IEEE/Springer Journals</option>
                  <option value="CONFERENCE_TRAVEL">Academic Conference Travel & Registration</option>
                  <option value="TESTING_CHARACTERIZATION_CHARGES">Lab Testing & SEM/TEM Characterization</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-xs">Claim Amount (INR)</label>
                <input
                  type="number"
                  min="1"
                  max={selectedFellow.annualContingencyLimitInr - selectedFellow.contingencySpentInr}
                  required
                  value={claimAmount}
                  onChange={e => setClaimAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Remaining Annual Limit: ₹{(selectedFellow.annualContingencyLimitInr - selectedFellow.contingencySpentInr).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="gfrCheck"
                  checked={gfrVerified}
                  onChange={e => setGfrVerified(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-indigo-600"
                />
                <label htmlFor="gfrCheck" className="text-xs text-slate-300">
                  Certified compliant with GFR 2017 & university procurement rules
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowContingencyModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold"
                >
                  Approve Contingency Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seal Inspector Modal */}
      {showSealModal && selectedFellow && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Cryptographic Seal Inspector</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedFellow.fellowId}</p>
              </div>
              <button onClick={() => setShowSealModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 block">SHA-256 Ledger Audit Seal</span>
                <span className="font-mono text-emerald-400 break-all">{selectedFellow.auditSha256}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Scholar Roll No:</span>
                  <span className="text-slate-200 font-mono">{selectedFellow.rollNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Funding Agency:</span>
                  <span className="text-slate-200 font-semibold">{selectedFellow.fundingAgency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Monthly Bills:</span>
                  <span className="text-slate-200 font-semibold">{selectedFellow.monthlyBills.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contingency Claims:</span>
                  <span className="text-slate-200 font-semibold">{selectedFellow.contingencyClaims.length}</span>
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
