'use client';

import React, { useState, useMemo } from 'react';
import {
  TravelGrantRecord,
  TravelFundingScheme,
  ConferenceTier,
  DeputationStage,
  TravelExpenseBreakdown,
  SEED_TRAVEL_GRANTS,
  submitTravelGrantProposal,
  advanceDeputationStage,
  settleTravelReimbursement,
  exportTravelGrantsCSV,
} from '@/lib/teacher/facultyTravelGrants';
import { useGovernanceStore } from '@/lib/hooks/useGovernanceStore';

export default function FacultyTravelGrantStudio() {
  const {
    records: grants,
    setRecords: setGrants,
    syncSource,
    isSaving,
    saveRecord
  } = useGovernanceStore<TravelGrantRecord>(
    'faculty_travel_grants',
    SEED_TRAVEL_GRANTS,
    'grantId'
  );
  const [selectedScheme, setSelectedScheme] = useState<TravelFundingScheme | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewProposalModalOpen, setIsNewProposalModalOpen] = useState(false);
  const [stageModalGrant, setStageModalGrant] = useState<TravelGrantRecord | null>(null);
  const [settleModalGrant, setSettleModalGrant] = useState<TravelGrantRecord | null>(null);
  const [sealModalGrant, setSealModalGrant] = useState<TravelGrantRecord | null>(null);

  // New Proposal Form State
  const [facultyName, setFacultyName] = useState('Dr. Rajiv Malhotra');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [fundingScheme, setFundingScheme] = useState<TravelFundingScheme>('INST_CPDA_SCHEME');
  const [conferenceTitle, setConferenceTitle] = useState('ACM SIGCOMM 2026');
  const [conferenceTier, setConferenceTier] = useState<ConferenceTier>('TIER_1_CORE_A_STAR');
  const [destinationCityCountry, setDestinationCityCountry] = useState('Tokyo, Japan');
  const [paperTitle, setPaperTitle] = useState('Programmable Data Planes for Sub-Nanosecond Telemetry');
  const [presentationType, setPresentationType] = useState<'ORAL_KEYNOTE' | 'ORAL_TECHNICAL' | 'POSTER_PRESENTATION'>('ORAL_TECHNICAL');
  const [travelStartDate, setTravelStartDate] = useState('2026-08-15');
  const [travelEndDate, setTravelEndDate] = useState('2026-08-21');
  const [availableCpdaBalance, setAvailableCpdaBalance] = useState<number>(300_000);

  const [expenses, setExpenses] = useState<TravelExpenseBreakdown>({
    airfare: 75_000,
    registrationFee: 50_000,
    dailyAllowance: 36_000,
    visaAndInsurance: 10_000,
  });

  // Stage Advancement Form State
  const [targetStage, setTargetStage] = useState<DeputationStage>('DIRECTOR_SANCTIONED');
  const [meaClearanceNumber, setMeaClearanceNumber] = useState('MEA/POL/2026/JP-9921');
  const [sanctionedAmount, setSanctionedAmount] = useState<number>(171_000);
  const [remarks, setRemarks] = useState('Sanctioned as per standard institute entitlement norms.');

  // Settlement Form State
  const [actualAmount, setActualAmount] = useState<number>(168_500);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Grants
  const filteredGrants = useMemo(() => {
    return grants.filter((g) => {
      const matchesScheme = selectedScheme === 'ALL' || g.fundingScheme === selectedScheme;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        g.deputationRefNumber.toLowerCase().includes(q) ||
        g.facultyName.toLowerCase().includes(q) ||
        g.conferenceTitle.toLowerCase().includes(q) ||
        g.destinationCityCountry.toLowerCase().includes(q) ||
        g.paperTitle.toLowerCase().includes(q);
      return matchesScheme && matchesSearch;
    });
  }, [grants, selectedScheme, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = grants.length;
    const tier1Count = grants.filter((g) => g.conferenceTier === 'TIER_1_CORE_A_STAR').length;
    const totalOutlay = grants.reduce((acc, g) => acc + (g.sanctionedAmount || g.totalClaimAmount), 0);
    const pendingSanction = grants.filter(
      (g) => g.stage === 'PROPOSAL_SUBMITTED' || g.stage === 'HOD_SUBSTITUTION_APPROVED' || g.stage === 'MEA_CLEARANCE_OBTAINED'
    ).length;
    return {
      total,
      tier1Count,
      totalOutlayLakhs: (totalOutlay / 100_000).toFixed(1),
      pendingSanction,
    };
  }, [grants]);

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyName.trim() || !conferenceTitle.trim() || !paperTitle.trim()) {
      showToast('Please provide faculty name, conference title, and accepted paper title');
      return;
    }

    try {
      const created = submitTravelGrantProposal({
        facultyName: facultyName.trim(),
        department: department.trim(),
        fundingScheme,
        conferenceTitle: conferenceTitle.trim(),
        conferenceTier,
        destinationCityCountry: destinationCityCountry.trim(),
        paperTitle: paperTitle.trim(),
        presentationType,
        travelStartDate,
        travelEndDate,
        availableCpdaBalance,
        requestedExpenses: expenses,
      });

      setGrants([created, ...grants]);
      await saveRecord(created);
      setIsNewProposalModalOpen(false);
      showToast(`Deputation proposal ${created.deputationRefNumber} submitted!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting proposal';
      showToast(`Proposal failed: ${msg}`);
    }
  };

  const handleAdvanceStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageModalGrant) return;

    const updated = advanceDeputationStage(stageModalGrant, targetStage, {
      meaClearanceNumber: meaClearanceNumber.trim() || undefined,
      sanctionedAmount: Number(sanctionedAmount),
      remarks: remarks.trim() || undefined,
    });

    setGrants(grants.map((g) => (g.grantId === updated.grantId ? updated : g)));
    await saveRecord(updated);
    setStageModalGrant(null);
    showToast(`Deputation advanced to ${targetStage.replace(/_/g, ' ')}!`);
  };

  const handleSettleReimbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settleModalGrant) return;

    const updated = settleTravelReimbursement(
      settleModalGrant,
      actualAmount,
      new Date().toISOString().split('T')[0]
    );

    setGrants(grants.map((g) => (g.grantId === updated.grantId ? updated : g)));
    await saveRecord(updated);
    setSettleModalGrant(null);
    showToast(`Travel claim settled at ₹${actualAmount.toLocaleString('en-IN')} with SHA-256 seal!`);
  };

  const handleExportCSV = () => {
    const csv = exportTravelGrantsCSV(grants);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Faculty_CPDA_Travel_Grants_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Travel grant ledger CSV exported successfully');
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
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-semibold tracking-wide border border-emerald-500/30 uppercase">
                CPDA & UGC Travel Grants
              </span>
              <span className="bg-sky-500/20 text-sky-400 text-xs px-3 py-1 rounded-full font-semibold tracking-wide border border-sky-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                MEA Political Clearance Tracking
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Faculty International Conference Deputation & CPDA Studio
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Cumulative Professional Development Allowance (CPDA) & DST International Travel Grants (ITS).
              Track paper presentation proposals, MEA clearances, teaching substitutions, and audit reimbursements.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${syncSource === 'supabase' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{syncSource === 'supabase' ? 'Live Supabase DB' : syncSource === 'local_storage' ? 'Local Persistence' : 'Runtime Cache'}</span>
              {isSaving && <span className="text-cyan-400 ml-1">(saving...)</span>}
            </div>
            <button
              onClick={() => setIsNewProposalModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 border border-emerald-400/40 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Apply Travel Grant
            </button>
            <button
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-xl transition flex items-center gap-2 border border-slate-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CPDA CSV
            </button>
          </div>
        </div>
      </div>

      {/* KPI Telemetry */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deputations</p>
          <p className="text-2xl md:text-3xl font-extrabold text-white mt-1">{stats.total}</p>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
            <span>Global conferences</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tier-1 Core A*</p>
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 mt-1">{stats.tier1Count}</p>
          <div className="text-xs text-amber-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>Flagship venues</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sanctioned Outlay</p>
          <p className="text-2xl md:text-3xl font-extrabold text-sky-400 mt-1">₹{stats.totalOutlayLakhs} L</p>
          <div className="text-xs text-sky-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>Institute & DST funded</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Sanction</p>
          <p className="text-2xl md:text-3xl font-extrabold text-rose-400 mt-1">{stats.pendingSanction}</p>
          <div className="text-xs text-rose-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>In approval pipeline</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              'ALL',
              'INST_CPDA_SCHEME',
              'DST_SERB_ITS_GRANT',
              'SPONSORED_PROJECT_TRAVEL',
              'DEAN_SRIC_OVERHEAD_TRAVEL',
            ] as const
          ).map((s) => (
            <button
              key={s}
              onClick={() => setSelectedScheme(s)}
              className={`text-xs px-3.5 py-2 rounded-xl font-medium transition border ${
                selectedScheme === s
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {s === 'ALL'
                ? 'All Schemes'
                : s
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
            placeholder="Search faculty, conference, country..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grants List */}
      <div className="space-y-6">
        {filteredGrants.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-400 font-medium">No international travel grant records found</p>
          </div>
        ) : (
          filteredGrants.map((g) => {
            const isSettled = g.stage === 'SETTLEMENT_REIMBURSED';
            const isSanctioned = g.stage === 'DIRECTOR_SANCTIONED' || isSettled;

            return (
              <div
                key={g.grantId}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition shadow-lg space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2.5 py-1 rounded-md">
                      {g.deputationRefNumber}
                    </span>
                    <span className="font-bold text-xs bg-slate-800 text-amber-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                      {g.conferenceTier.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs bg-slate-800/70 text-slate-400 px-2.5 py-0.5 rounded-full">
                      {g.fundingScheme.replace(/_/g, ' ')}
                    </span>
                    {g.meaClearanceNumber && (
                      <span className="text-[11px] bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded-full font-semibold">
                        MEA Cleared
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                        isSettled
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : isSanctioned
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {g.stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-base font-bold text-white">{g.conferenceTitle}</h3>
                  <p className="text-xs text-amber-300 font-medium mt-0.5">
                    📍 {g.destinationCityCountry} | 🗓️ {g.travelStartDate} to {g.travelEndDate}
                  </p>
                  <p className="text-xs text-slate-300 mt-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                    <strong className="text-white">Accepted Paper:</strong> "{g.paperTitle}" ({g.presentationType.replace(/_/g, ' ')})
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400 mt-2">
                    <span>
                      <strong className="text-slate-300">Faculty:</strong> {g.facultyName} ({g.department})
                    </span>
                    {g.meaClearanceNumber && (
                      <span>
                        <strong className="text-slate-300">MEA Ref:</strong> {g.meaClearanceNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expenses Breakdown Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 text-xs">
                  <div>
                    <span className="text-slate-400 block">Airfare (GeM):</span>
                    <span className="text-slate-200 font-semibold text-sm">
                      ₹{g.requestedExpenses.airfare.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Registration:</span>
                    <span className="text-slate-200 font-semibold text-sm">
                      ₹{g.requestedExpenses.registrationFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Per Diem (MEA):</span>
                    <span className="text-slate-200 font-semibold text-sm">
                      ₹{g.requestedExpenses.dailyAllowance.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Visa & Travel Ins:</span>
                    <span className="text-slate-200 font-semibold text-sm">
                      ₹{g.requestedExpenses.visaAndInsurance.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Sanctioned:</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      ₹{(g.sanctionedAmount || g.totalClaimAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-slate-800/60">
                  <div className="text-xs text-slate-400">
                    Remaining CPDA Block Balance: ₹{g.availableCpdaBalance.toLocaleString('en-IN')}
                  </div>

                  <div className="flex items-center gap-2">
                    {g.cryptographicSeal && (
                      <button
                        onClick={() => setSealModalGrant(g)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Sanction Seal
                      </button>
                    )}

                    {!isSettled && (
                      <>
                        <button
                          onClick={() => {
                            setStageModalGrant(g);
                            if (g.stage === 'PROPOSAL_SUBMITTED') setTargetStage('HOD_SUBSTITUTION_APPROVED');
                            else if (g.stage === 'HOD_SUBSTITUTION_APPROVED') setTargetStage('MEA_CLEARANCE_OBTAINED');
                            else if (g.stage === 'MEA_CLEARANCE_OBTAINED') setTargetStage('DIRECTOR_SANCTIONED');
                          }}
                          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3 py-1.5 rounded-lg transition border border-slate-700"
                        >
                          Advance Stage
                        </button>

                        <button
                          onClick={() => {
                            setSettleModalGrant(g);
                            setActualAmount(g.sanctionedAmount || g.totalClaimAmount);
                          }}
                          className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3.5 py-1.5 rounded-lg transition border border-emerald-400/40"
                        >
                          Settle Reimbursement
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: New Proposal */}
      {isNewProposalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Apply International Travel Grant</h3>
              <button
                onClick={() => setIsNewProposalModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Faculty Name
                  </label>
                  <input
                    type="text"
                    required
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Funding Scheme
                  </label>
                  <select
                    value={fundingScheme}
                    onChange={(e) => setFundingScheme(e.target.value as TravelFundingScheme)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="INST_CPDA_SCHEME">Institute CPDA Block Scheme (₹3L)</option>
                    <option value="DST_SERB_ITS_GRANT">DST-SERB International Travel Support</option>
                    <option value="SPONSORED_PROJECT_TRAVEL">Sponsored Project Travel Head</option>
                    <option value="DEAN_SRIC_OVERHEAD_TRAVEL">Consultancy Overhead (DDF)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Conference Tier
                  </label>
                  <select
                    value={conferenceTier}
                    onChange={(e) => setConferenceTier(e.target.value as ConferenceTier)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="TIER_1_CORE_A_STAR">Tier 1: Flagship Core A*</option>
                    <option value="TIER_2_CORE_A">Tier 2: Premier Core A</option>
                    <option value="TIER_3_SCOPUS_WOS">Tier 3: Scopus / WoS Indexed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Conference Title
                  </label>
                  <input
                    type="text"
                    required
                    value={conferenceTitle}
                    onChange={(e) => setConferenceTitle(e.target.value)}
                    placeholder="e.g. IEEE INFOCOM 2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Destination (City, Country)
                  </label>
                  <input
                    type="text"
                    required
                    value={destinationCityCountry}
                    onChange={(e) => setDestinationCityCountry(e.target.value)}
                    placeholder="e.g. London, UK"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Accepted Paper Title
                </label>
                <input
                  type="text"
                  required
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Expense Inputs */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <p className="font-bold text-emerald-400 uppercase tracking-wide">
                  Estimated Expenditure (INR)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Economy Airfare:</label>
                    <input
                      type="number"
                      min="0"
                      value={expenses.airfare}
                      onChange={(e) => setExpenses({ ...expenses, airfare: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Registration Fee:</label>
                    <input
                      type="number"
                      min="0"
                      value={expenses.registrationFee}
                      onChange={(e) => setExpenses({ ...expenses, registrationFee: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">MEA Per Diem Allowance:</label>
                    <input
                      type="number"
                      min="0"
                      value={expenses.dailyAllowance}
                      onChange={(e) => setExpenses({ ...expenses, dailyAllowance: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Visa & Overseas Insurance:</label>
                    <input
                      type="number"
                      min="0"
                      value={expenses.visaAndInsurance}
                      onChange={(e) => setExpenses({ ...expenses, visaAndInsurance: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewProposalModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Submit Deputation Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Advance Stage */}
      {stageModalGrant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Advance Deputation Clearance</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{stageModalGrant.deputationRefNumber}</p>
              </div>
              <button
                onClick={() => setStageModalGrant(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdvanceStage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Target Stage
                </label>
                <select
                  value={targetStage}
                  onChange={(e) => setTargetStage(e.target.value as DeputationStage)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="HOD_SUBSTITUTION_APPROVED">HOD Teaching Substitution Approved</option>
                  <option value="MEA_CLEARANCE_OBTAINED">MEA Political Clearance Obtained</option>
                  <option value="DIRECTOR_SANCTIONED">Director Formal Travel Sanction</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {targetStage === 'MEA_CLEARANCE_OBTAINED' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    MEA Clearance Reference Number
                  </label>
                  <input
                    type="text"
                    required
                    value={meaClearanceNumber}
                    onChange={(e) => setMeaClearanceNumber(e.target.value)}
                    placeholder="e.g. MEA/POL/2026/US-1021"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {targetStage === 'DIRECTOR_SANCTIONED' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Sanctioned Travel Outlay (INR)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={sanctionedAmount}
                    onChange={(e) => setSanctionedAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Remarks / Substitution Details
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStageModalGrant(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Update Deputation Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Settle Reimbursement */}
      {settleModalGrant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Post-Conference Claim Settlement</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{settleModalGrant.deputationRefNumber}</p>
              </div>
              <button
                onClick={() => setSettleModalGrant(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSettleReimbursement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Actual Reimbursed Amount (INR)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={actualAmount}
                  onChange={(e) => setActualAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Audited boarding passes, original hotel folios, and registration receipts verified
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSettleModalGrant(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Settle & Seal Reimbursement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: SHA-256 Seal Inspector */}
      {sealModalGrant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-base font-bold text-white">Cryptographic Travel Grant Seal</h3>
              </div>
              <button
                onClick={() => setSealModalGrant(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Deputation Reference:</span>
                <span className="font-mono text-emerald-400 font-semibold">{sealModalGrant.deputationRefNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Faculty & Destination:</span>
                <span className="text-slate-200 font-medium">
                  {sealModalGrant.facultyName} ({sealModalGrant.destinationCityCountry})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Sanctioned Outlay:</span>
                <span className="text-amber-400 font-bold font-mono">
                  ₹{(sealModalGrant.sanctionedAmount || sealModalGrant.totalClaimAmount).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">SHA-256 Digest:</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 break-all font-mono text-[11px] text-emerald-400">
                  {sealModalGrant.cryptographicSeal}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSealModalGrant(null)}
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
