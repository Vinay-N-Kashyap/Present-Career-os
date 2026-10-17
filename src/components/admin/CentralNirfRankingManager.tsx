'use client';

import React, { useState } from 'react';
import {
  NirfRankingRecord,
  NirfRankingCategory,
  DcsSubmissionStatus,
  DEFAULT_NIRF_RECORDS,
  createNirfSubmission,
  advanceDcsStatus,
  recordOfficialRankDeclared,
  exportNirfDcsSummaryCSV
} from '@/lib/admin/centralNirfRanking';

export default function CentralNirfRankingManager() {
  const [records, setRecords] = useState<NirfRankingRecord[]>(DEFAULT_NIRF_RECORDS);
  const [activeTab, setActiveTab] = useState<'ALL' | NirfRankingCategory>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<NirfRankingRecord | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  const [isSealModalOpen, setIsSealModalOpen] = useState(false);
  const [officialRankInput, setOfficialRankInput] = useState<number>(18);

  // New Simulation Form State
  const [formCategory, setFormCategory] = useState<NirfRankingCategory>('OVERALL');
  const [formInstName, setFormInstName] = useState('Central University Main Campus');
  const [formNodalOfficer, setFormNodalOfficer] = useState('Prof. A. K. Banerjee (Director, IQAC)');
  const [formStudentStrength, setFormStudentStrength] = useState(7200);
  const [formFsr, setFormFsr] = useState(14.0);
  const [formPhdPct, setFormPhdPct] = useState(90);
  const [formFruScore, setFormFruScore] = useState(85);
  const [formPubs, setFormPubs] = useState(1300);
  const [formCpp, setFormCpp] = useState(10.5);
  const [formPatents, setFormPatents] = useState(22);
  const [formFundingCr, setFormFundingCr] = useState(7.5);
  const [formPassRate, setFormPassRate] = useState(93.5);
  const [formPhdGrads, setFormPhdGrads] = useState(110);
  const [formPlacementLpa, setFormPlacementLpa] = useState(13.8);
  const [formOtherStatesPct, setFormOtherStatesPct] = useState(42);
  const [formWomenPct, setFormWomenPct] = useState(40);
  const [formEscsPct, setFormEscsPct] = useState(36);
  const [formPwdScore, setFormPwdScore] = useState(90);
  const [formPeerScore, setFormPeerScore] = useState(82);
  const [formEmployerScore, setFormEmployerScore] = useState(84);

  // Telemetry Aggregates
  const totalSubmissions = records.length;
  const avgCompositeScore = (
    records.reduce((acc, r) => acc + r.compositeScore, 0) / (records.length || 1)
  ).toFixed(2);
  const overallRecord = records.find(r => r.category === 'OVERALL') || records[0];
  const publicDisclosedCount = records.filter(r => r.status === 'PUBLIC_DISCLOSURE_HOSTED' || r.status === 'FINAL_RANK_DECLARED').length;

  const filteredRecords = activeTab === 'ALL'
    ? records
    : records.filter(r => r.category === activeTab);

  const handleCreateSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = createNirfSubmission({
      category: formCategory,
      institutionName: formInstName,
      nodalOfficer: formNodalOfficer,
      rankingYear: 2026,
      tlrMetrics: {
        studentStrength: Number(formStudentStrength),
        facultyStudentRatio: Number(formFsr),
        facultyWithPhdPct: Number(formPhdPct),
        financialResourceUtilizationScore: Number(formFruScore)
      },
      rpcMetrics: {
        publicationsScopusWos: Number(formPubs),
        citationPerPaper: Number(formCpp),
        iprPatentsGrantedOrPublished: Number(formPatents),
        sponsoredResearchFundingInr: Number(formFundingCr) * 10000000
      },
      goMetrics: {
        examPassRatePct: Number(formPassRate),
        phdGraduatedAnnualCount: Number(formPhdGrads),
        medianPlacementSalaryLpa: Number(formPlacementLpa)
      },
      oiMetrics: {
        otherStatesCountriesPct: Number(formOtherStatesPct),
        womenStudentsFacultyPct: Number(formWomenPct),
        economicallyChallengedStudentsPct: Number(formEscsPct),
        differentlyAbledFacilitiesScore: Number(formPwdScore)
      },
      prMetrics: {
        academicPeerScore: Number(formPeerScore),
        employerFeedbackScore: Number(formEmployerScore)
      }
    });

    setRecords([newRecord, ...records]);
    setIsNewModalOpen(false);
  };

  const handleAdvanceStatus = (record: NirfRankingRecord, nextStatus: DcsSubmissionStatus) => {
    const updated = advanceDcsStatus(record, nextStatus);
    setRecords(records.map(r => r.recordId === updated.recordId ? updated : r));
    if (selectedRecord?.recordId === updated.recordId) setSelectedRecord(updated);
  };

  const handleRecordOfficialRank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    const updated = recordOfficialRankDeclared(selectedRecord, officialRankInput);
    setRecords(records.map(r => r.recordId === updated.recordId ? updated : r));
    setSelectedRecord(updated);
    setIsRankModalOpen(false);
  };

  const handleExportCSV = () => {
    const csv = exportNirfDcsSummaryCSV(records);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NIRF_2026_DCS_Telemetry_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: DcsSubmissionStatus) => {
    switch (status) {
      case 'DRAFT_DATA_COLLECTION':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">DRAFT DCS</span>;
      case 'INTERNAL_AUDIT_VERIFIED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-700/60">IQAC AUDITED</span>;
      case 'DCS_UPLOADED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/60">DCS UPLOADED</span>;
      case 'PUBLIC_DISCLOSURE_HOSTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60">PUBLIC DISCLOSED</span>;
      case 'FINAL_RANK_DECLARED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">RANK DECLARED</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8">
      {/* Top Protocol Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                Central NIRF & QS World Ranking Synthesizer
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  MoE DCS 2026 Ready
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Ministry of Education NIRF 5-Dimensional Telemetry (TLR 30%, RPC 30%, GO 20%, OI 10%, PR 10%) & QS World Telemetry Bridge
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Simulate / New Submission
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export DCS CSV
          </button>
        </div>
      </div>

      {/* Real-Time Telemetry Radar Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Projected Band</span>
          <p className="text-lg font-bold text-emerald-400 truncate">{overallRecord?.projectedRankBand.split(' ')[0]} {overallRecord?.projectedRankBand.split(' ')[1]}</p>
          <span className="text-[11px] text-slate-500">Based on Overall DCS</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Composite Score</span>
          <p className="text-2xl font-bold text-white">{overallRecord?.compositeScore.toFixed(2)} <span className="text-xs text-slate-400">/ 100</span></p>
          <span className="text-[11px] text-emerald-400">Weight: 100.0%</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">TLR (30%)</span>
          <p className="text-xl font-bold text-cyan-400">{overallRecord?.tlr.tlrScore.toFixed(1)}</p>
          <span className="text-[11px] text-slate-500">FSR: {overallRecord?.tlr.facultyStudentRatio.toFixed(1)}:1</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">RPC (30%)</span>
          <p className="text-xl font-bold text-indigo-400">{overallRecord?.rpc.rpcScore.toFixed(1)}</p>
          <span className="text-[11px] text-slate-500">{overallRecord?.rpc.publicationsScopusWos} Pubs</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">GO (20%)</span>
          <p className="text-xl font-bold text-purple-400">{overallRecord?.go.goScore.toFixed(1)}</p>
          <span className="text-[11px] text-slate-500">{overallRecord?.go.medianPlacementSalaryLpa} LPA Median</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">OI & PR (20%)</span>
          <p className="text-xl font-bold text-amber-400">{(overallRecord?.oi.oiScore * 0.1 + overallRecord?.pr.prScore * 0.1).toFixed(1)}</p>
          <span className="text-[11px] text-slate-500">Outreach + Perception</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">QS Bridge Projection</span>
          <p className="text-lg font-bold text-sky-400 truncate">{overallRecord?.qsBridge.qsProjectedRankBand}</p>
          <span className="text-[11px] text-slate-500">Global Reputation</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {(['ALL', 'OVERALL', 'ENGINEERING', 'MANAGEMENT', 'UNIVERSITIES', 'PHARMACY'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecords.map(record => (
          <div
            key={record.recordId}
            className="p-6 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl space-y-5 transition-all shadow-lg"
          >
            {/* Header info */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {record.recordId}
                  </span>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    {record.category} CATEGORY
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{record.institutionName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Nodal Officer: {record.nodalOfficer}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                {getStatusBadge(record.status)}
                {record.officialDeclaredRank ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
                    Official: Rank {record.officialDeclaredRank}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-mono">
                    {record.projectedRankBand}
                  </span>
                )}
              </div>
            </div>

            {/* Parameter Score Progress Breakdown */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-300">Composite NIRF Score</span>
                <span className="text-emerald-400 font-bold text-sm">{record.compositeScore.toFixed(2)} / 100</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, record.compositeScore)}%` }}
                />
              </div>

              {/* 5 Dimensions Subgrid */}
              <div className="grid grid-cols-5 gap-2 pt-2 text-center text-xs">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">TLR (30%)</span>
                  <span className="font-bold text-cyan-400">{record.tlr.tlrScore.toFixed(1)}</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">RPC (30%)</span>
                  <span className="font-bold text-indigo-400">{record.rpc.rpcScore.toFixed(1)}</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">GO (20%)</span>
                  <span className="font-bold text-purple-400">{record.go.goScore.toFixed(1)}</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">OI (10%)</span>
                  <span className="font-bold text-amber-400">{record.oi.oiScore.toFixed(1)}</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">PR (10%)</span>
                  <span className="font-bold text-emerald-400">{record.pr.prScore.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* QS World Rankings Telemetry Bridge */}
            <div className="flex justify-between items-center bg-sky-950/20 border border-sky-800/30 p-3 rounded-lg text-xs">
              <div>
                <span className="text-sky-300 font-semibold block">QS Global Telemetry Bridge:</span>
                <span className="text-slate-400">
                  Acad Rep: {record.qsBridge.qsAcademicReputationScore} | Citations/Faculty: {record.qsBridge.qsCitationsPerFaculty}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-sky-900/60 text-sky-200 border border-sky-700/50 font-bold">
                {record.qsBridge.qsProjectedRankBand}
              </span>
            </div>

            {/* Card Action Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedRecord(record);
                    setIsSealModalOpen(true);
                  }}
                  className="text-slate-400 hover:text-slate-200 underline font-mono text-[11px]"
                >
                  Seal: {record.auditSha256.substring(0, 10)}...
                </button>
                <a
                  href={record.publicDisclosureUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 text-[11px] underline"
                >
                  Public DCS Link
                </a>
              </div>

              <div className="flex items-center gap-1.5">
                {record.status === 'DRAFT_DATA_COLLECTION' && (
                  <button
                    onClick={() => handleAdvanceStatus(record, 'INTERNAL_AUDIT_VERIFIED')}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium"
                  >
                    Verify IQAC
                  </button>
                )}
                {record.status === 'INTERNAL_AUDIT_VERIFIED' && (
                  <button
                    onClick={() => handleAdvanceStatus(record, 'DCS_UPLOADED')}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium"
                  >
                    Upload DCS
                  </button>
                )}
                {record.status === 'DCS_UPLOADED' && (
                  <button
                    onClick={() => handleAdvanceStatus(record, 'PUBLIC_DISCLOSURE_HOSTED')}
                    className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium"
                  >
                    Host Public Disclosure
                  </button>
                )}
                {record.status === 'PUBLIC_DISCLOSURE_HOSTED' && (
                  <button
                    onClick={() => {
                      setSelectedRecord(record);
                      setIsRankModalOpen(true);
                    }}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium"
                  >
                    Record MoE Rank
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Simulate / New NIRF Submission */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white">Simulate / New NIRF DCS Telemetry Submission</h2>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmission} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Ranking Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as NirfRankingCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  >
                    <option value="OVERALL">OVERALL</option>
                    <option value="UNIVERSITIES">UNIVERSITIES</option>
                    <option value="ENGINEERING">ENGINEERING</option>
                    <option value="MANAGEMENT">MANAGEMENT</option>
                    <option value="PHARMACY">PHARMACY</option>
                    <option value="COLLEGES">COLLEGES</option>
                    <option value="INNOVATION">INNOVATION</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Institution / School Name</label>
                  <input
                    type="text"
                    value={formInstName}
                    onChange={(e) => setFormInstName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nodal Officer & Designation</label>
                <input
                  type="text"
                  value={formNodalOfficer}
                  onChange={(e) => setFormNodalOfficer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-3">
                <span className="font-semibold text-cyan-400 block">1. TLR Parameters (Weight: 30%)</span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-slate-400">Total Enrolled</label>
                    <input
                      type="number"
                      value={formStudentStrength}
                      onChange={(e) => setFormStudentStrength(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400">FSR Ratio (1:X)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formFsr}
                      onChange={(e) => setFormFsr(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400">Faculty Ph.D. %</label>
                    <input
                      type="number"
                      value={formPhdPct}
                      onChange={(e) => setFormPhdPct(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400">FRU Spend Score</label>
                    <input
                      type="number"
                      value={formFruScore}
                      onChange={(e) => setFormFruScore(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-3">
                <span className="font-semibold text-indigo-400 block">2. RPC Parameters (Weight: 30%)</span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-slate-400">Scopus/WoS Pubs</label>
                    <input
                      type="number"
                      value={formPubs}
                      onChange={(e) => setFormPubs(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400">Citations / Paper</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formCpp}
                      onChange={(e) => setFormCpp(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400">Patents Granted</label>
                    <input
                      type="number"
                      value={formPatents}
                      onChange={(e) => setFormPatents(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400">Funding (₹ Cr)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formFundingCr}
                      onChange={(e) => setFormFundingCr(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-3">
                <span className="font-semibold text-purple-400 block">3. GO Parameters (Weight: 20%)</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-400">Pass Rate %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formPassRate}
                      onChange={(e) => setFormPassRate(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400">Ph.D. Graduated</label>
                    <input
                      type="number"
                      value={formPhdGrads}
                      onChange={(e) => setFormPhdGrads(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400">Median Salary (LPA)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formPlacementLpa}
                      onChange={(e) => setFormPlacementLpa(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-3">
                <span className="font-semibold text-amber-400 block">4. OI & PR Parameters (Weight: 10% + 10%)</span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-slate-400">Other States %</label>
                    <input
                      type="number"
                      value={formOtherStatesPct}
                      onChange={(e) => setFormOtherStatesPct(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400">Women %</label>
                    <input
                      type="number"
                      value={formWomenPct}
                      onChange={(e) => setFormWomenPct(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400">Academic Peer</label>
                    <input
                      type="number"
                      value={formPeerScore}
                      onChange={(e) => setFormPeerScore(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400">Employer Feedback</label>
                    <input
                      type="number"
                      value={formEmployerScore}
                      onChange={(e) => setFormEmployerScore(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium shadow-md"
                >
                  Synthesize & Save Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Official Rank */}
      {isRankModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Record Official MoE NIRF Declared Rank</h2>
            <p className="text-xs text-slate-400">
              Record for <span className="text-white font-semibold">{selectedRecord.institutionName}</span> ({selectedRecord.category})
            </p>

            <form onSubmit={handleRecordOfficialRank} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Official National Rank</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={officialRankInput}
                  onChange={(e) => setOfficialRankInput(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white text-lg font-bold"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRankModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                >
                  Confirm Official Rank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: SHA-256 Seal Verification */}
      {isSealModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Cryptographic DCS Audit Seal
            </h2>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs break-all text-emerald-400">
              {selectedRecord.auditSha256}
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Record ID: <span className="text-slate-200">{selectedRecord.recordId}</span></p>
              <p>Ranking Category: <span className="text-slate-200">{selectedRecord.category}</span></p>
              <p>Verified Timestamp: <span className="text-slate-200">{selectedRecord.lastAuditDate}</span></p>
              <p>Public Disclosure URL: <span className="text-cyan-400">{selectedRecord.publicDisclosureUrl}</span></p>
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
