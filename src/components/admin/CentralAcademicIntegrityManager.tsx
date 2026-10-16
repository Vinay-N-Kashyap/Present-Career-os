'use client';

import React, { useState } from 'react';
import {
  PlagiarismLevel,
  CaseComplainantType,
  CaseTargetRole,
  PlagiarismCaseRecord,
  INITIAL_PLAGIARISM_CASES,
  determinePlagiarismLevel,
  registerPlagiarismAllegation,
  recordDaipInquiryReport,
  scheduleIaipHearing,
  adjudicateFinalPenalty,
  exportPlagiarismTribunalCSV,
} from '@/lib/admin/centralAcademicIntegrity';

export default function CentralAcademicIntegrityManager() {
  const [cases, setCases] = useState<PlagiarismCaseRecord[]>(INITIAL_PLAGIARISM_CASES);
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedCase, setSelectedCase] = useState<PlagiarismCaseRecord | null>(null);

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDaipModal, setShowDaipModal] = useState(false);
  const [showIaipModal, setShowIaipModal] = useState(false);
  const [showVerdictModal, setShowVerdictModal] = useState(false);
  const [showSealModal, setShowSealModal] = useState(false);

  // Register Form State
  const [newTitle, setNewTitle] = useState('');
  const [newRespondent, setNewRespondent] = useState('');
  const [newRole, setNewRole] = useState<CaseTargetRole>('RESEARCH_SCHOLAR');
  const [newDept, setNewDept] = useState('Computer Science & Engineering');
  const [newComplainant, setNewComplainant] = useState<CaseComplainantType>('EXAMINER');
  const [newRawPct, setNewRawPct] = useState(25.0);
  const [newNetPct, setNewNetPct] = useState(18.5);
  const [newDaipChair, setNewDaipChair] = useState('Prof. Ramesh Sharma (HoD)');
  const [exclBib, setExclBib] = useState(true);
  const [exclQuotes, setExclQuotes] = useState(true);
  const [exclSmall, setExclSmall] = useState(true);
  const [exclMath, setExclMath] = useState(true);

  // DAIP Form State
  const [daipConfirmedPct, setDaipConfirmedPct] = useState(18.5);
  const [daipFindingsText, setDaipFindingsText] = useState('');

  // IAIP Form State
  const [iaipChair, setIaipChair] = useState('Prof. B. K. Ramanathan (Dean Academic Affairs)');
  const [iaipDate, setIaipDate] = useState('2026-03-30');

  // Final Verdict Form State
  const [verdictResolution, setVerdictResolution] = useState('IAIP-ORD-2026-');

  // Feedback Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showMsg = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // KPIs
  const totalCases = cases.length;
  const level0Count = cases.filter((c) => c.plagiarismLevel === 'LEVEL_0_TOLERABLE').length;
  const level0Pct = totalCases > 0 ? ((level0Count / totalCases) * 100).toFixed(0) : '0';
  const activeInquiries = cases.filter(
    (c) => c.stage === 'ALLEGATION_REGISTERED' || c.stage === 'DAIP_INQUIRY_IN_PROGRESS' || c.stage === 'DAIP_REPORT_SUBMITTED' || c.stage === 'IAIP_HEARING_SCHEDULED'
  ).length;
  const severeSanctions = cases.filter((c) => c.plagiarismLevel === 'LEVEL_2_MODERATE' || c.plagiarismLevel === 'LEVEL_3_SEVERE').length;

  // Filter
  const filteredCases = selectedLevel === 'ALL'
    ? cases
    : cases.filter((c) => c.plagiarismLevel === selectedLevel);

  // Handlers
  const handleRegisterCase = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = registerPlagiarismAllegation({
        documentTitle: newTitle,
        respondentName: newRespondent,
        respondentRole: newRole,
        department: newDept,
        complainantType: newComplainant,
        rawSimilarityPercentage: Number(newRawPct),
        netSimilarityPercentage: Number(newNetPct),
        daipChairmanName: newDaipChair,
        exclusions: {
          excludeBibliography: exclBib,
          excludeQuotesAndAttributions: exclQuotes,
          excludeSmallMatchesUnder10Words: exclSmall,
          excludeGenericMathematicalFormulas: exclMath,
        },
      });

      setCases([created, ...cases]);
      setShowRegisterModal(false);
      showMsg(`Allegation registered (${created.trackingToken}): Assessed as ${created.plagiarismLevel.replace(/_/g, ' ')}.`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleRecordDaip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    try {
      const updated = recordDaipInquiryReport(selectedCase, daipFindingsText, Number(daipConfirmedPct));
      setCases(cases.map((c) => (c.caseId === updated.caseId ? updated : c)));
      setSelectedCase(updated);
      setShowDaipModal(false);
      showMsg(`DAIP inquiry report submitted. Net similarity: ${updated.netSimilarityPercentage}%. Stage: ${updated.stage}.`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleScheduleIaip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    try {
      const updated = scheduleIaipHearing(selectedCase, iaipChair, iaipDate);
      setCases(cases.map((c) => (c.caseId === updated.caseId ? updated : c)));
      setSelectedCase(updated);
      setShowIaipModal(false);
      showMsg(`IAIP hearing scheduled on ${iaipDate} under ${iaipChair}.`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleAdjudicateVerdict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    try {
      const updated = adjudicateFinalPenalty(selectedCase, verdictResolution);
      setCases(cases.map((c) => (c.caseId === updated.caseId ? updated : c)));
      setSelectedCase(updated);
      setShowVerdictModal(false);
      showMsg(`Final statutory penalty order executed: Resolution ${updated.finalOrderResolutionNumber}.`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleExportCSV = () => {
    const csv = exportPlagiarismTribunalCSV(cases);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Academic_Integrity_Tribunal_Ledger_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showMsg('Academic Integrity Tribunal Ledger CSV exported successfully.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚖️</span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Central University Academic Integrity & Plagiarism Prevention Tribunal
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Statutory Compliance: UGC (Promotion of Academic Integrity and Prevention of Plagiarism in HEIs) Regulations, 2018 (DAIP & IAIP Protocols).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
          >
            <span>+</span> Register Allegation
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
          >
            <span>📥</span> Export Tribunal CSV
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {notification && (
        <div
          className={`p-4 rounded-lg text-sm font-medium border ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/80 border-rose-800 text-rose-200'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Inquired Cases</div>
          <div className="text-2xl font-bold text-white mt-2">{totalCases}</div>
          <div className="text-slate-500 text-xs mt-1">Active & Adjudicated Dossiers</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tolerable Exonerations</div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{level0Pct}%</div>
          <div className="text-slate-500 text-xs mt-1">Level 0 (&le; 10% Similarity)</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Tribunals</div>
          <div className="text-2xl font-bold text-amber-400 mt-2">{activeInquiries}</div>
          <div className="text-slate-500 text-xs mt-1">DAIP & IAIP Inquiries</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Severe Sanctions (L2/L3)</div>
          <div className="text-2xl font-bold text-rose-400 mt-2">{severeSanctions}</div>
          <div className="text-slate-500 text-xs mt-1">Suspensions / Debarments Executed</div>
        </div>
      </div>

      {/* Level Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {['ALL', 'LEVEL_0_TOLERABLE', 'LEVEL_1_MINOR', 'LEVEL_2_MODERATE', 'LEVEL_3_SEVERE'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedLevel === lvl
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {lvl.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Cases List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredCases.map((c) => {
          const isL0 = c.plagiarismLevel === 'LEVEL_0_TOLERABLE';
          const isL1 = c.plagiarismLevel === 'LEVEL_1_MINOR';
          const isL2 = c.plagiarismLevel === 'LEVEL_2_MODERATE';
          const isL3 = c.plagiarismLevel === 'LEVEL_3_SEVERE';

          const levelColor = isL0
            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
            : isL1
            ? 'bg-amber-950 text-amber-300 border-amber-800'
            : isL2
            ? 'bg-orange-950 text-orange-300 border-orange-800'
            : 'bg-rose-950 text-rose-300 border-rose-800';

          const gaugeColor = isL0 ? 'bg-emerald-500' : isL1 ? 'bg-amber-500' : isL2 ? 'bg-orange-500' : 'bg-rose-500';

          return (
            <div
              key={c.caseId}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${levelColor}`}>
                      {c.plagiarismLevel.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{c.trackingToken}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
                      {c.stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-1.5">{c.documentTitle}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Respondent: <span className="text-slate-200 font-medium">{c.respondentName}</span> ({c.respondentRole.replace(/_/g, ' ')}) | Dept: <span className="text-slate-200">{c.department}</span> | Allegation Filed: <span className="text-slate-200">{c.allegationDate}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {c.stage === 'ALLEGATION_REGISTERED' && (
                    <button
                      onClick={() => {
                        setSelectedCase(c);
                        setDaipConfirmedPct(c.netSimilarityPercentage);
                        setShowDaipModal(true);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition"
                    >
                      Record DAIP Findings
                    </button>
                  )}
                  {c.stage === 'DAIP_REPORT_SUBMITTED' && (
                    <button
                      onClick={() => {
                        setSelectedCase(c);
                        setShowIaipModal(true);
                      }}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium transition"
                    >
                      Schedule IAIP Hearing
                    </button>
                  )}
                  {c.stage === 'IAIP_HEARING_SCHEDULED' && (
                    <button
                      onClick={() => {
                        setSelectedCase(c);
                        setVerdictResolution(`IAIP-ORD-2026-${Math.floor(10 + Math.random() * 90)}`);
                        setShowVerdictModal(true);
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold transition"
                    >
                      Execute Final Order & Penalty
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedCase(c);
                      setShowSealModal(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs font-medium transition"
                  >
                    View Cryptographic Seal
                  </button>
                </div>
              </div>

              {/* Similarity Index Gauge */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>
                    Net Similarity Index (Raw: {c.rawSimilarityPercentage}%)
                  </span>
                  <span className="font-bold text-white text-sm">{c.netSimilarityPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${gaugeColor}`}
                    style={{ width: `${Math.min(c.netSimilarityPercentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Level 0: 0-10% (Tolerable)</span>
                  <span>Level 1: 10-40% (Minor)</span>
                  <span>Level 2: 40-60% (Moderate)</span>
                  <span>Level 3: &gt;60% (Severe)</span>
                </div>
              </div>

              {/* Statutory Penalties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="font-semibold text-slate-300">
                    {c.respondentRole === 'FACULTY_AUTHOR' ? 'Statutory Faculty Penalty (UGC 2018)' : 'Statutory Student Penalty (UGC 2018)'}
                  </div>
                  <div className="text-slate-400">
                    {c.respondentRole === 'FACULTY_AUTHOR' ? c.statutoryFacultyPenalty : c.statutoryStudentPenalty}
                  </div>
                  {c.finalOrderResolutionNumber && (
                    <div className="pt-2 text-emerald-400 font-medium">
                      Order Resolution: {c.finalOrderResolutionNumber}
                    </div>
                  )}
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="font-semibold text-slate-300">Inquiry Panels & Exclusions</div>
                  <div className="text-slate-400">
                    DAIP Chairman: <span className="text-slate-200">{c.daipChairmanName}</span>
                    {c.iaipChairmanName && (
                      <span> | IAIP: <span className="text-slate-200">{c.iaipChairmanName}</span></span>
                    )}
                  </div>
                  {c.daipFindings && (
                    <div className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
                      <strong>DAIP Findings:</strong> {c.daipFindings}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {c.exclusions.excludeBibliography && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">Excl. References</span>
                    )}
                    {c.exclusions.excludeQuotesAndAttributions && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">Excl. Quotes</span>
                    )}
                    {c.exclusions.excludeSmallMatchesUnder10Words && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">Excl. &le;10 Words</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 1: Register Allegation */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white">📋 Register Academic Plagiarism Allegation</h3>
            <p className="text-xs text-slate-400">
              UGC 2018 Academic Integrity Regulations. DAIP preliminary scrutiny will be initiated automatically.
            </p>
            <form onSubmit={handleRegisterCase} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Document / Manuscript / Thesis Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Systems"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Respondent Name</label>
                  <input
                    type="text"
                    value={newRespondent}
                    onChange={(e) => setNewRespondent(e.target.value)}
                    placeholder="Full legal name"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Respondent Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as CaseTargetRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="RESEARCH_SCHOLAR">RESEARCH SCHOLAR</option>
                    <option value="POSTGRADUATE_STUDENT">POSTGRADUATE STUDENT</option>
                    <option value="FACULTY_AUTHOR">FACULTY AUTHOR</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Complainant Type</label>
                  <select
                    value={newComplainant}
                    onChange={(e) => setNewComplainant(e.target.value as CaseComplainantType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="EXAMINER">EXTERNAL EXAMINER</option>
                    <option value="FACULTY_SUPERVISOR">FACULTY SUPERVISOR</option>
                    <option value="CHIEF_EDITOR">JOURNAL CHIEF EDITOR</option>
                    <option value="WHISTLEBLOWER">CONFIDENTIAL WHISTLEBLOWER</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Raw Similarity %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRawPct}
                    onChange={(e) => setNewRawPct(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Net Similarity % (after exclusions)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newNetPct}
                    onChange={(e) => setNewNetPct(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">DAIP Chairman (Head of Department)</label>
                <input
                  type="text"
                  value={newDaipChair}
                  onChange={(e) => setNewDaipChair(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>

              {/* Exclusions */}
              <div className="border-t border-slate-800 pt-2 space-y-1 text-slate-300">
                <div className="text-slate-400 font-semibold mb-1">Mandatory UGC Similarity Exclusions:</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={exclBib} onChange={(e) => setExclBib(e.target.checked)} />
                  <span>Exclude References / Bibliography</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={exclQuotes} onChange={(e) => setExclQuotes(e.target.checked)} />
                  <span>Exclude Quoted Work with Attribution</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={exclSmall} onChange={(e) => setExclSmall(e.target.checked)} />
                  <span>Exclude Small Matches under 10 Words</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={exclMath} onChange={(e) => setExclMath(e.target.checked)} />
                  <span>Exclude Generic Mathematical Formulae</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
                >
                  Register Allegation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Record DAIP Report */}
      {showDaipModal && selectedCase && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">📝 Record DAIP Inquiry Findings</h3>
            <p className="text-xs text-slate-400">
              Departmental Academic Integrity Panel inquiry findings and verified net similarity percentage.
            </p>
            <form onSubmit={handleRecordDaip} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Confirmed Net Similarity %</label>
                <input
                  type="number"
                  step="0.1"
                  value={daipConfirmedPct}
                  onChange={(e) => setDaipConfirmedPct(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">DAIP Inquiry Observations & Findings</label>
                <textarea
                  value={daipFindingsText}
                  onChange={(e) => setDaipFindingsText(e.target.value)}
                  rows={3}
                  placeholder="Detail primary sources of overlap, student/faculty defense, and recommendation."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDaipModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium"
                >
                  Submit DAIP Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Schedule IAIP Hearing */}
      {showIaipModal && selectedCase && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">⚖️ Schedule IAIP Hearing</h3>
            <p className="text-xs text-slate-400">
              Institutional Academic Integrity Panel hearing for formal adjudication of statutory penalties.
            </p>
            <form onSubmit={handleScheduleIaip} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">IAIP Chairman (Dean / Senior Professor)</label>
                <input
                  type="text"
                  value={iaipChair}
                  onChange={(e) => setIaipChair(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Hearing Date</label>
                <input
                  type="date"
                  value={iaipDate}
                  onChange={(e) => setIaipDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIaipModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded font-medium"
                >
                  Schedule Hearing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Execute Final Order */}
      {showVerdictModal && selectedCase && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">🔨 Adjudicate Final Penalty Order</h3>
            <p className="text-xs text-slate-400">
              Execute final statutory penalty under UGC 2018 Regulations and notify Registrar / CoE.
            </p>
            <form onSubmit={handleAdjudicateVerdict} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">IAIP / Syndicate Resolution Order Number</label>
                <input
                  type="text"
                  value={verdictResolution}
                  onChange={(e) => setVerdictResolution(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-slate-300 space-y-1">
                <div className="font-semibold text-rose-400">Enforced Statutory Penalty:</div>
                <div>
                  {selectedCase.respondentRole === 'FACULTY_AUTHOR'
                    ? selectedCase.statutoryFacultyPenalty
                    : selectedCase.statutoryStudentPenalty}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVerdictModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium"
                >
                  Issue Final Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Cryptographic Seal Inspector */}
      {showSealModal && selectedCase && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🔐</span> Tamper-Proof Cryptographic Tribunal Seal
            </h3>
            <p className="text-xs text-slate-400">
              Immutable SHA-256 digest bound to case ID, respondent, net similarity %, DAIP/IAIP findings, and final sanction order.
            </p>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
              {selectedCase.cryptographicSeal || 'PENDING_SEAL'}
            </div>
            <div className="space-y-1 text-xs text-slate-400">
              <div><strong className="text-slate-300">Tracking Token:</strong> {selectedCase.trackingToken}</div>
              <div><strong className="text-slate-300">Respondent:</strong> {selectedCase.respondentName}</div>
              <div><strong className="text-slate-300">Stage:</strong> {selectedCase.stage}</div>
              <div><strong className="text-slate-300">Last Verified:</strong> {selectedCase.lastUpdated}</div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSealModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium"
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
