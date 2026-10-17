'use client';

import React, { useState, useMemo } from 'react';
import { useGovernanceStore } from '@/lib/hooks/useGovernanceStore';
import {
  TenderRecord,
  TenderCategory,
  TenderStage,
  ProcurementMode,
  SEED_TENDERS,
  registerTenderNotice,
  awardTenderContract,
  evaluateTwoBids,
  exportProcurementLedgerCSV,
} from '@/lib/admin/centralProcurement';

export default function CentralProcurementManager() {
  const {
    records: tenders,
    setRecords: setTenders,
    syncSource,
    isSaving,
    saveRecord
  } = useGovernanceStore<TenderRecord>('central_procurement_tenders', SEED_TENDERS, 'tenderId');
  const [selectedCategory, setSelectedCategory] = useState<TenderCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewTenderModalOpen, setIsNewTenderModalOpen] = useState(false);
  const [evalModalTender, setEvalModalTender] = useState<TenderRecord | null>(null);
  const [sealModalTender, setSealModalTender] = useState<TenderRecord | null>(null);

  // New Tender Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TenderCategory>('SCIENTIFIC_LAB_EQUIPMENT');
  const [estimatedValue, setEstimatedValue] = useState<number>(5_000_000);
  const [indenterDepartment, setIndenterDepartment] = useState('Department of Chemistry');
  const [publishedDate, setPublishedDate] = useState('2026-03-01');
  const [closingDate, setClosingDate] = useState('2026-03-31');
  const [cpcChairperson, setCpcChairperson] = useState('Prof. S. R. Iyengar (Dean Infrastructure)');
  const [isPac, setIsPac] = useState(false);

  // Award Form State
  const [selectedBidderId, setSelectedBidderId] = useState('');
  const [officers, setOfficers] = useState('Prof. S. R. Iyengar, Dr. R. Verma, Registrar Dr. P. K. Dash');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Tenders
  const filteredTenders = useMemo(() => {
    return tenders.filter((t) => {
      const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.tenderRefNumber.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.indenterDepartment.toLowerCase().includes(q) ||
        t.bids.some((b) => b.vendorName.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [tenders, selectedCategory, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = tenders.length;
    const active = tenders.filter((t) => t.stage !== 'COMPLETED' && t.stage !== 'CANCELLED').length;
    const totalOutlay = tenders.reduce((acc, t) => acc + t.estimatedValue, 0);
    const awardedContracts = tenders.filter((t) => t.stage === 'L1_AWARDED' || t.stage === 'CONTRACT_SIGNED').length;
    return {
      total,
      active,
      totalOutlayCr: (totalOutlay / 10_000_000).toFixed(2),
      awardedContracts,
    };
  }, [tenders]);

  const handleCreateTender = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || estimatedValue <= 0) {
      showToast('Please provide valid tender title and estimated value');
      return;
    }

    const created = registerTenderNotice({
      title: title.trim(),
      category,
      estimatedValue,
      indenterDepartment: indenterDepartment.trim(),
      publishedDate,
      closingDate,
      cpcChairperson: cpcChairperson.trim(),
      isPac,
    });

    await saveRecord(created);
    setIsNewTenderModalOpen(false);
    setTitle('');
    showToast(`Tender ${created.tenderRefNumber} published successfully under GFR guidelines`);
  };

  const handleAwardContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalModalTender || !selectedBidderId) {
      showToast('Please select a qualified bidder to award');
      return;
    }

    try {
      const officerList = officers.split(',').map((o) => o.trim()).filter(Boolean);
      const updated = awardTenderContract(evalModalTender, selectedBidderId, officerList);
      await saveRecord(updated);
      setEvalModalTender(null);
      setSelectedBidderId('');
      showToast(`Contract awarded to ${selectedBidderId} with SHA-256 seal!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error awarding contract';
      showToast(`Award failed: ${msg}`);
    }
  };

  const handleExportCSV = () => {
    const csv = exportProcurementLedgerCSV(tenders);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Central_Procurement_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Procurement ledger CSV exported successfully');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl text-sm font-medium animate-bounce flex items-center gap-2 border border-emerald-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-indigo-500/20 text-indigo-400 text-xs px-3 py-1 rounded-full font-semibold tracking-wide border border-indigo-500/30 uppercase">
                GFR 2017 & GeM Mandate
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold tracking-wide border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CVC Compliance Verified
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2 tracking-tight flex items-center gap-3">
              Central University Tender & Works e-Procurement Portal
              <span className={`text-xs px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 font-normal ${
                syncSource === 'supabase'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${syncSource === 'supabase' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
                {syncSource === 'supabase' ? 'PostgreSQL Active (support.pinit)' : 'Resilient Local Storage'}
                {isSaving && <span className="text-emerald-400 ml-1">Saving...</span>}
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Apex institutional procurement, Central Purchase Committee (CPC) two-bid evaluations,
              and contract award lifecycle under General Financial Rules (GFR 2017) Rule 149/153.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNewTenderModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 border border-indigo-400/40 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Publish Tender (NIT)
            </button>
            <button
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-xl transition flex items-center gap-2 border border-slate-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export GFR CSV
            </button>
          </div>
        </div>
      </div>

      {/* KPI Telemetry */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Tenders</p>
          <p className="text-2xl md:text-3xl font-extrabold text-white mt-1">{stats.active}</p>
          <div className="text-xs text-indigo-400 mt-2 flex items-center gap-1 font-medium">
            <span>In-procurement</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Outlay</p>
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 mt-1">₹{stats.totalOutlayCr} Cr</p>
          <div className="text-xs text-amber-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>Aggregate budget sanctioned</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Awarded Contracts</p>
          <p className="text-2xl md:text-3xl font-extrabold text-emerald-400 mt-1">{stats.awardedContracts}</p>
          <div className="text-xs text-emerald-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>Cryptographically sealed</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Statutory Audit</p>
          <p className="text-2xl md:text-3xl font-extrabold text-cyan-400 mt-1">100%</p>
          <div className="text-xs text-cyan-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>Zero CVC integrity breach</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              'ALL',
              'SCIENTIFIC_LAB_EQUIPMENT',
              'IT_HARDWARE_INFRASTRUCTURE',
              'CAMPUS_CIVIL_ELECTRICAL_WORKS',
              'LAB_CHEMICALS_CONSUMABLES',
              'FACILITY_MANAGEMENT_SERVICES',
            ] as const
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-2 rounded-xl font-medium transition border ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL'
                ? 'All Tenders'
                : cat
                    .split('_')
                    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
                    .join(' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tender, ref, dept, vendor..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Tender List */}
      <div className="space-y-6">
        {filteredTenders.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-slate-400 font-medium">No tenders matching selected criteria</p>
          </div>
        ) : (
          filteredTenders.map((tender) => {
            const isAwarded = tender.stage === 'L1_AWARDED' || tender.stage === 'CONTRACT_SIGNED';
            const winningBid = tender.bids.find((b) => b.bidderId === tender.awardedBidderId);

            return (
              <div
                key={tender.tenderId}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition shadow-lg space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2.5 py-1 rounded-md">
                      {tender.tenderRefNumber}
                    </span>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                      {tender.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs bg-slate-800/70 text-slate-400 px-2.5 py-0.5 rounded-full">
                      {tender.procurementMode.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                        tender.stage === 'L1_AWARDED' || tender.stage === 'CONTRACT_SIGNED'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : tender.stage === 'NIT_PUBLISHED'
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {tender.stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Title & Details */}
                <div>
                  <h3 className="text-lg font-bold text-white">{tender.title}</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400 mt-2">
                    <span>
                      <strong className="text-slate-300">Department:</strong> {tender.indenterDepartment}
                    </span>
                    <span>
                      <strong className="text-slate-300">CPC Chairperson:</strong> {tender.cpcChairperson}
                    </span>
                    <span>
                      <strong className="text-slate-300">Published:</strong> {tender.publishedDate}
                    </span>
                    <span>
                      <strong className="text-slate-300">Closing:</strong> {tender.closingDate}
                    </span>
                  </div>
                </div>

                {/* Financial Securities Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 text-xs">
                  <div>
                    <span className="text-slate-400 block">Estimated Outlay:</span>
                    <span className="text-amber-400 font-bold text-sm">
                      ₹{tender.estimatedValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">EMD (Earnest Money):</span>
                    <span className="text-slate-200 font-semibold text-sm">
                      ₹{tender.emdAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">PBG (5% Security):</span>
                    <span className="text-slate-200 font-semibold text-sm">
                      ₹{tender.pbgAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Submissions:</span>
                    <span className="text-indigo-400 font-semibold text-sm">{tender.bids.length} Vendors</span>
                  </div>
                </div>

                {/* Two-Bid Evaluation Table */}
                {tender.bids.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                      Two-Bid Evaluation Summary (Technical & Financial)
                    </p>
                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                          <tr>
                            <th className="py-2.5 px-3">Vendor Name</th>
                            <th className="py-2.5 px-3">GeM Seller ID</th>
                            <th className="py-2.5 px-3">Tech Score</th>
                            <th className="py-2.5 px-3">Financial Bid</th>
                            <th className="py-2.5 px-3">Rank</th>
                            <th className="py-2.5 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {tender.bids.map((b) => (
                            <tr
                              key={b.bidderId}
                              className={`hover:bg-slate-800/40 ${
                                b.bidRank === 'L1' ? 'bg-emerald-950/20' : ''
                              }`}
                            >
                              <td className="py-2.5 px-3 font-medium text-white flex items-center gap-2">
                                {b.vendorName}
                                {b.isMsmeExempt && (
                                  <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-800 px-1.5 py-0.2 rounded">
                                    MSME
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-400">
                                {b.gemSellerId || 'OFFLINE'}
                              </td>
                              <td className="py-2.5 px-3">
                                <span
                                  className={`font-semibold ${
                                    b.technicalScore >= 70 ? 'text-emerald-400' : 'text-rose-400'
                                  }`}
                                >
                                  {b.technicalScore}/100
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-bold text-slate-100">
                                ₹{b.financialBidAmount.toLocaleString('en-IN')}
                              </td>
                              <td className="py-2.5 px-3">
                                {b.bidRank ? (
                                  <span
                                    className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                                      b.bidRank === 'L1'
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-slate-800 text-slate-300'
                                    }`}
                                  >
                                    {b.bidRank}
                                  </span>
                                ) : (
                                  '—'
                                )}
                              </td>
                              <td className="py-2.5 px-3">
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                    b.status === 'AWARDED_L1'
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : b.status === 'QUALIFIED'
                                      ? 'bg-indigo-500/20 text-indigo-400'
                                      : 'bg-rose-500/20 text-rose-400'
                                  }`}
                                >
                                  {b.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Footer Controls & Award Seal */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-slate-800/60">
                  <div>
                    {isAwarded && winningBid ? (
                      <div className="text-xs text-emerald-400 flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>
                          Contract awarded to <strong className="text-white">{winningBid.vendorName}</strong> at ₹
                          {tender.contractValue?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        {tender.bids.length === 0
                          ? 'Awaiting vendor bids on CPPP / GeM portal'
                          : 'Bids under CPC evaluation'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {tender.cryptographicSeal && (
                      <button
                        onClick={() => setSealModalTender(tender)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Inspect SHA-256 Seal
                      </button>
                    )}

                    {!isAwarded && tender.bids.length > 0 && (
                      <button
                        onClick={() => {
                          setEvalModalTender(tender);
                          const evaluated = evaluateTwoBids(tender.bids);
                          const l1 = evaluated.find((b) => b.bidRank === 'L1');
                          if (l1) setSelectedBidderId(l1.bidderId);
                        }}
                        className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3.5 py-1.5 rounded-lg transition border border-indigo-400/40"
                      >
                        Evaluate & Award L1
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Publish New Tender (NIT) */}
      {isNewTenderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Publish Tender Notice (NIT)</h3>
              <button
                onClick={() => setIsNewTenderModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTender} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Tender Title / Works Description
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Supply and Commissioning of 500 MHz NMR Spectrometer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TenderCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="SCIENTIFIC_LAB_EQUIPMENT">Scientific Lab Equipment</option>
                    <option value="IT_HARDWARE_INFRASTRUCTURE">IT Hardware Infrastructure</option>
                    <option value="CAMPUS_CIVIL_ELECTRICAL_WORKS">Campus Civil/Electrical Works</option>
                    <option value="LAB_CHEMICALS_CONSUMABLES">Lab Chemicals & Consumables</option>
                    <option value="FACILITY_MANAGEMENT_SERVICES">Facility Management Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Estimated Outlay (INR)
                  </label>
                  <input
                    type="number"
                    min="10000"
                    required
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Indenter Department
                  </label>
                  <input
                    type="text"
                    required
                    value={indenterDepartment}
                    onChange={(e) => setIndenterDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    CPC Chairperson
                  </label>
                  <input
                    type="text"
                    required
                    value={cpcChairperson}
                    onChange={(e) => setCpcChairperson(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Published Date
                  </label>
                  <input
                    type="date"
                    required
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Bid Closing Date
                  </label>
                  <input
                    type="date"
                    required
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPac"
                  checked={isPac}
                  onChange={(e) => setIsPac(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="isPac" className="text-xs text-slate-300">
                  Proprietary Article Certificate (PAC) under GFR Rule 166 (Single Source)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTenderModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Issue Tender NIT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Evaluate & Award L1 */}
      {evalModalTender && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">CPC Award Contract (L1)</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{evalModalTender.tenderRefNumber}</p>
              </div>
              <button
                onClick={() => setEvalModalTender(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAwardContract} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                  Select Awardee Bidder (Evaluated L1 Recommended)
                </label>
                <div className="space-y-2">
                  {evaluateTwoBids(evalModalTender.bids).map((bid) => (
                    <label
                      key={bid.bidderId}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition ${
                        selectedBidderId === bid.bidderId
                          ? 'bg-indigo-950/40 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      } ${!bid.technicallyQualified ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="awardee"
                          disabled={!bid.technicallyQualified}
                          checked={selectedBidderId === bid.bidderId}
                          onChange={() => setSelectedBidderId(bid.bidderId)}
                          className="text-indigo-600 focus:ring-0"
                        />
                        <div>
                          <p className="font-semibold text-white">{bid.vendorName}</p>
                          <p className="text-[11px] text-slate-400">
                            Score: {bid.technicalScore}/100 | Rank:{' '}
                            <strong className="text-emerald-400">{bid.bidRank || 'Disqualified'}</strong>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-amber-400">
                          ₹{bid.financialBidAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  CPC Sign-Off Committee Officers
                </label>
                <input
                  type="text"
                  required
                  value={officers}
                  onChange={(e) => setOfficers(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Names included in the cryptographic SHA-256 contract seal payload
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEvalModalTender(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Award Contract & Seal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: SHA-256 Cryptographic Seal Inspector */}
      {sealModalTender && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-base font-bold text-white">Cryptographic SHA-256 Audit Seal</h3>
              </div>
              <button
                onClick={() => setSealModalTender(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Tender Reference:</span>
                <span className="font-mono text-indigo-400 font-semibold">{sealModalTender.tenderRefNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Winning Bidder:</span>
                <span className="text-slate-200 font-medium">
                  {sealModalTender.bids.find((b) => b.bidderId === sealModalTender.awardedBidderId)?.vendorName || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Contract Value:</span>
                <span className="text-amber-400 font-bold font-mono">
                  ₹{sealModalTender.contractValue?.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">SHA-256 Digest:</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 break-all font-mono text-[11px] text-emerald-400">
                  {sealModalTender.cryptographicSeal}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSealModalTender(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
