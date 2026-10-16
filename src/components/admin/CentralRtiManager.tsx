'use client';

import React, { useState, useMemo } from 'react';
import {
  RtiRecord,
  RtiCategory,
  RtiStage,
  Section8ExemptionClause,
  SEED_RTIS,
  registerRtiApplication,
  recordRtiDecision,
  recordFirstAppeal,
  exportRtiAnnualReturnCSV,
} from '@/lib/admin/centralRti';

export default function CentralRtiManager() {
  const [rtis, setRtis] = useState<RtiRecord[]>(SEED_RTIS);
  const [selectedCategory, setSelectedCategory] = useState<RtiCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewRtiModalOpen, setIsNewRtiModalOpen] = useState(false);
  const [decisionModalRti, setDecisionModalRti] = useState<RtiRecord | null>(null);
  const [appealModalRti, setAppealModalRti] = useState<RtiRecord | null>(null);
  const [sealModalRti, setSealModalRti] = useState<RtiRecord | null>(null);

  // New RTI Form State
  const [applicantName, setApplicantName] = useState('');
  const [isBplExempt, setIsBplExempt] = useState(false);
  const [category, setCategory] = useState<RtiCategory>('ADMISSIONS_AND_RESERVATIONS');
  const [subjectDescription, setSubjectDescription] = useState('');
  const [departmentConcerned, setDepartmentConcerned] = useState('Academic Affairs');
  const [receivedDate, setReceivedDate] = useState('2026-03-01');
  const [isLifeOrLiberty, setIsLifeOrLiberty] = useState(false);
  const [cpioOfficer, setCpioOfficer] = useState('Dr. R. K. Mukherjee (CPIO Administration)');

  // Decision Form State
  const [targetDecision, setTargetDecision] = useState<'INFO_DISCLOSED' | 'PARTIALLY_DISCLOSED_SEC_10' | 'EXEMPTED_REJECTED_SEC_8'>('INFO_DISCLOSED');
  const [exemptions, setExemptions] = useState<Section8ExemptionClause[]>([]);
  const [dispositionRemarks, setDispositionRemarks] = useState('');

  // Appeal Form State
  const [faaOfficer, setFaaOfficer] = useState('Prof. S. R. Iyengar (First Appellate Authority)');
  const [groundForAppeal, setGroundForAppeal] = useState('Incomplete information provided by CPIO regarding category cutoffs');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered RTIs
  const filteredRtis = useMemo(() => {
    return rtis.filter((r) => {
      const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.registrationNumber.toLowerCase().includes(q) ||
        r.applicantName.toLowerCase().includes(q) ||
        r.departmentConcerned.toLowerCase().includes(q) ||
        r.subjectDescription.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [rtis, selectedCategory, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = rtis.length;
    const disposed = rtis.filter((r) => r.stage !== 'RECEIVED' && r.stage !== 'CPIO_SCRUTINIZING').length;
    const pending = total - disposed;
    const complianceRate = total > 0 ? ((disposed / total) * 100).toFixed(0) : '100';
    return { total, disposed, pending, complianceRate };
  }, [rtis]);

  const handleRegisterRti = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !subjectDescription.trim()) {
      showToast('Please provide applicant name and subject description');
      return;
    }

    const created = registerRtiApplication({
      applicantName: applicantName.trim(),
      isBplExempt,
      category,
      subjectDescription: subjectDescription.trim(),
      departmentConcerned: departmentConcerned.trim(),
      receivedDate,
      isLifeOrLiberty,
      cpioOfficer,
    });

    setRtis([created, ...rtis]);
    setIsNewRtiModalOpen(false);
    setApplicantName('');
    setSubjectDescription('');
    showToast(`RTI Application ${created.registrationNumber} registered!`);
  };

  const handleRecordDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionModalRti) return;

    const updated = recordRtiDecision(decisionModalRti, {
      stage: targetDecision,
      exemptionsApplied: exemptions,
      remarks: dispositionRemarks.trim() || 'Statutory CPIO disposal recorded under RTI Act 2005.',
      dispositionDate: new Date().toISOString().split('T')[0],
    });

    setRtis(rtis.map((r) => (r.rtiId === updated.rtiId ? updated : r)));
    setDecisionModalRti(null);
    setExemptions([]);
    setDispositionRemarks('');
    showToast(`Decision recorded for ${updated.registrationNumber} with SHA-256 seal!`);
  };

  const handleRecordAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealModalRti) return;

    const updated = recordFirstAppeal(appealModalRti, {
      appealFilingDate: new Date().toISOString().split('T')[0],
      faaOfficer: faaOfficer.trim(),
      groundForAppeal: groundForAppeal.trim(),
    });

    setRtis(rtis.map((r) => (r.rtiId === updated.rtiId ? updated : r)));
    setAppealModalRti(null);
    showToast(`First Appeal registered for ${updated.registrationNumber}!`);
  };

  const handleExportCSV = () => {
    const csv = exportRtiAnnualReturnCSV(rtis);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CIC_RTI_Quarterly_Return_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CIC / DoPT RTI Return CSV exported successfully');
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
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-sky-500/20 text-sky-400 text-xs px-3 py-1 rounded-full font-semibold tracking-wide border border-sky-500/30 uppercase">
                RTI Act 2005 & CIC Norms
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold tracking-wide border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CPGRAMS Redressal Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Right to Information (RTI 2005) & Public Grievance Portal
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Statutory 30-day response tracking, Section 8 exemption audits, First Appellate Authority (FAA)
              hearings, and Central Information Commission (CIC) quarterly return ledgers.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNewRtiModalOpen(true)}
              className="bg-sky-600 hover:bg-sky-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 border border-sky-400/40 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              File RTI Application
            </button>
            <button
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-xl transition flex items-center gap-2 border border-slate-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CIC CSV
            </button>
          </div>
        </div>
      </div>

      {/* KPI Telemetry */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total RTIs</p>
          <p className="text-2xl md:text-3xl font-extrabold text-white mt-1">{stats.total}</p>
          <div className="text-xs text-sky-400 mt-2 flex items-center gap-1 font-medium">
            <span>Annual cohort</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Disposed in Window</p>
          <p className="text-2xl md:text-3xl font-extrabold text-emerald-400 mt-1">{stats.disposed}</p>
          <div className="text-xs text-emerald-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>{stats.complianceRate}% timely compliance</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending CPIO</p>
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 mt-1">{stats.pending}</p>
          <div className="text-xs text-amber-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>Under active scrutiny</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Statutory Limit</p>
          <p className="text-2xl md:text-3xl font-extrabold text-indigo-400 mt-1">30 Days</p>
          <div className="text-xs text-indigo-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>48h for Life & Liberty</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              'ALL',
              'ADMISSIONS_AND_RESERVATIONS',
              'EXAMINATIONS_AND_EVALUATION',
              'RECRUITMENT_AND_PROMOTION',
              'FINANCIAL_AND_TENDERS',
              'ADMINISTRATIVE_AND_ESTATE',
            ] as const
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-2 rounded-xl font-medium transition border ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white border-sky-500 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL'
                ? 'All Categories'
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
            placeholder="Search token, applicant, dept..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* RTI Applications List */}
      <div className="space-y-6">
        {filteredRtis.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-slate-400 font-medium">No RTI applications matching current filter</p>
          </div>
        ) : (
          filteredRtis.map((rti) => {
            const isDisposed = rti.stage === 'INFO_DISCLOSED' || rti.stage === 'PARTIALLY_DISCLOSED_SEC_10' || rti.stage === 'EXEMPTED_REJECTED_SEC_8';

            return (
              <div
                key={rti.rtiId}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition shadow-lg space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-sky-950 text-sky-300 border border-sky-700/50 px-2.5 py-1 rounded-md">
                      {rti.registrationNumber}
                    </span>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                      {rti.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs bg-slate-800/70 text-slate-400 px-2.5 py-0.5 rounded-full">
                      {rti.departmentConcerned}
                    </span>
                    {rti.isBplExempt && (
                      <span className="text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        BPL Fee Exempt
                      </span>
                    )}
                    {rti.isLifeOrLiberty && (
                      <span className="text-[11px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full font-bold animate-pulse">
                        Life/Liberty (48h)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                        rti.stage === 'INFO_DISCLOSED'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : rti.stage === 'PARTIALLY_DISCLOSED_SEC_10'
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                          : rti.stage === 'EXEMPTED_REJECTED_SEC_8'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {rti.stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Subject & Applicant */}
                <div>
                  <h3 className="text-base font-bold text-white">{rti.applicantName}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                    {rti.subjectDescription}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400 mt-2">
                    <span>
                      <strong className="text-slate-300">Received:</strong> {rti.receivedDate}
                    </span>
                    <span>
                      <strong className="text-slate-300">Statutory Due:</strong> {rti.dueDate}
                    </span>
                    <span>
                      <strong className="text-slate-300">CPIO Officer:</strong> {rti.cpioOfficer}
                    </span>
                    {rti.dispositionDate && (
                      <span>
                        <strong className="text-slate-300">Disposed On:</strong> {rti.dispositionDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Section 8 Exemptions & Remarks */}
                {(rti.exemptionsApplied || rti.dispositionRemarks) && (
                  <div className="space-y-2">
                    {rti.exemptionsApplied && rti.exemptionsApplied.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-rose-400 font-semibold">Exemptions Applied:</span>
                        {rti.exemptionsApplied.map((ex) => (
                          <span
                            key={ex}
                            className="text-[11px] bg-rose-950/40 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded-md font-mono"
                          >
                            {ex.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                    {rti.dispositionRemarks && (
                      <p className="text-xs text-slate-300 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40">
                        {rti.dispositionRemarks}
                      </p>
                    )}
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-slate-800/60">
                  <div className="text-xs text-slate-400">
                    {isDisposed
                      ? 'Decision recorded under Section 7(1) of RTI Act 2005'
                      : 'Pending CPIO verification and departmental document retrieval'}
                  </div>

                  <div className="flex items-center gap-2">
                    {rti.cryptographicSeal && (
                      <button
                        onClick={() => setSealModalRti(rti)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Inspect Seal
                      </button>
                    )}

                    {!isDisposed && (
                      <button
                        onClick={() => setDecisionModalRti(rti)}
                        className="text-xs bg-sky-600 hover:bg-sky-500 text-white font-medium px-3.5 py-1.5 rounded-lg transition border border-sky-400/40"
                      >
                        Record CPIO Decision
                      </button>
                    )}

                    {isDisposed && rti.stage !== 'FIRST_APPEAL_FILED' && (
                      <button
                        onClick={() => setAppealModalRti(rti)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-3 py-1.5 rounded-lg transition border border-slate-700"
                      >
                        File First Appeal (FAA)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: File RTI Application */}
      {isNewRtiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">File RTI Application (Section 6)</h3>
              <button
                onClick={() => setIsNewRtiModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterRti} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Applicant Name
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as RtiCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="ADMISSIONS_AND_RESERVATIONS">Admissions & Reservations</option>
                    <option value="EXAMINATIONS_AND_EVALUATION">Examinations & Evaluation</option>
                    <option value="RECRUITMENT_AND_PROMOTION">Recruitment & Promotion</option>
                    <option value="FINANCIAL_AND_TENDERS">Financial & Tenders</option>
                    <option value="ADMINISTRATIVE_AND_ESTATE">Administrative & Estate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Subject / Information Requested
                </label>
                <textarea
                  rows={3}
                  required
                  value={subjectDescription}
                  onChange={(e) => setSubjectDescription(e.target.value)}
                  placeholder="Specific information requested under RTI Act 2005..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Department Concerned
                  </label>
                  <input
                    type="text"
                    required
                    value={departmentConcerned}
                    onChange={(e) => setDepartmentConcerned(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Received Date
                  </label>
                  <input
                    type="date"
                    required
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isBpl"
                    checked={isBplExempt}
                    onChange={(e) => setIsBplExempt(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-sky-600 focus:ring-0"
                  />
                  <label htmlFor="isBpl" className="text-xs text-slate-300">
                    Below Poverty Line (BPL) Fee Exemption
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isLife"
                    checked={isLifeOrLiberty}
                    onChange={(e) => setIsLifeOrLiberty(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-rose-600 focus:ring-0"
                  />
                  <label htmlFor="isLife" className="text-xs text-rose-400 font-semibold">
                    Life or Liberty Concern (Mandatory 48-hour response)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewRtiModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Register Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: CPIO Decision */}
      {decisionModalRti && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Record CPIO Disposal Decision</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{decisionModalRti.registrationNumber}</p>
              </div>
              <button
                onClick={() => setDecisionModalRti(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordDecision} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Disposal Decision
                </label>
                <select
                  value={targetDecision}
                  onChange={(e) => setTargetDecision(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  <option value="INFO_DISCLOSED">Full Information Disclosed</option>
                  <option value="PARTIALLY_DISCLOSED_SEC_10">Partially Disclosed (Section 10 Severability)</option>
                  <option value="EXEMPTED_REJECTED_SEC_8">Rejected under Section 8(1) Exemptions</option>
                </select>
              </div>

              {targetDecision !== 'INFO_DISCLOSED' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Section 8(1) Exemption Clauses Applicable
                  </label>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    {[
                      { id: 'SEC_8_1_E_FIDUCIARY_RELATIONSHIP', label: '8(1)(e) - Fiduciary Relationship / Examiner Identity' },
                      { id: 'SEC_8_1_J_PERSONAL_PRIVACY', label: '8(1)(j) - Third-Party Personal Privacy' },
                      { id: 'SEC_8_1_D_COMMERCIAL_IP', label: '8(1)(d) - Commercial Confidence & Intellectual Property' },
                      { id: 'SEC_8_1_A_SOVEREIGNTY_SECURITY', label: '8(1)(a) - Security / Sovereignty of State' },
                    ].map((item) => (
                      <label key={item.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={exemptions.includes(item.id as Section8ExemptionClause)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setExemptions([...exemptions, item.id as Section8ExemptionClause]);
                            } else {
                              setExemptions(exemptions.filter((x) => x !== item.id));
                            }
                          }}
                          className="rounded border-slate-800 bg-slate-950 text-sky-600 focus:ring-0"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Disposal Remarks / Justification
                </label>
                <textarea
                  rows={3}
                  required
                  value={dispositionRemarks}
                  onChange={(e) => setDispositionRemarks(e.target.value)}
                  placeholder="Record CPIO order details and dispatch reference..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDecisionModalRti(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Record & Seal Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: First Appeal (FAA) */}
      {appealModalRti && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">File First Appeal (Section 19(1))</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{appealModalRti.registrationNumber}</p>
              </div>
              <button
                onClick={() => setAppealModalRti(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordAppeal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  First Appellate Authority (FAA)
                </label>
                <input
                  type="text"
                  required
                  value={faaOfficer}
                  onChange={(e) => setFaaOfficer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Grounds for Appeal
                </label>
                <textarea
                  rows={3}
                  required
                  value={groundForAppeal}
                  onChange={(e) => setGroundForAppeal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAppealModalRti(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Register Appeal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: SHA-256 Seal Inspector */}
      {sealModalRti && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-base font-bold text-white">Cryptographic RTI Disposition Seal</h3>
              </div>
              <button
                onClick={() => setSealModalRti(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Registration Reference:</span>
                <span className="font-mono text-sky-400 font-semibold">{sealModalRti.registrationNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Applicant:</span>
                <span className="text-slate-200 font-medium">{sealModalRti.applicantName}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">CPIO Disposition:</span>
                <span className="text-emerald-400 font-semibold">{sealModalRti.stage}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">SHA-256 Digest:</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 break-all font-mono text-[11px] text-emerald-400">
                  {sealModalRti.cryptographicSeal}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSealModalRti(null)}
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
