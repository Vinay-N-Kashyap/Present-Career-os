'use client';

import React, { useState, useMemo } from 'react';
import {
  AffiliationRecord,
  AffiliationType,
  InspectionStage,
  AicInspectionFinding,
  DeficiencySeverity,
  INITIAL_AFFILIATION_RECORDS,
  registerAffiliationApplication,
  scheduleAicInspection,
  submitAicInspectionReport,
  sanctionByUniversitySyndicate,
  exportAffiliationAuditCSV,
} from '@/lib/admin/centralAffiliation';

export default function CentralAffiliationManager() {
  const [records, setRecords] = useState<AffiliationRecord[]>(INITIAL_AFFILIATION_RECORDS);
  const [selectedFilter, setSelectedFilter] = useState<InspectionStage | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [scheduleModalRecord, setScheduleModalRecord] = useState<AffiliationRecord | null>(null);
  const [findingsModalRecord, setFindingsModalRecord] = useState<AffiliationRecord | null>(null);
  const [syndicateModalRecord, setSyndicateModalRecord] = useState<AffiliationRecord | null>(null);
  const [sealModalRecord, setSealModalRecord] = useState<AffiliationRecord | null>(null);

  // New Application Form State
  const [institutionCode, setInstitutionCode] = useState('INST-MCE08');
  const [institutionName, setInstitutionName] = useState('Modern College of Engineering & Research');
  const [trustOrSociety, setTrustOrSociety] = useState('Modern Technical Education Society');
  const [affiliationType, setAffiliationType] = useState<AffiliationType>('NEW_PROGRAMME_VARIATION_INTAKE');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [programmeName, setProgrammeName] = useState('B.Tech Data Science & Cyber Security');
  const [approvedIntake, setApprovedIntake] = useState(60);

  // Schedule Inspection Form State
  const [aicChairman, setAicChairman] = useState('Prof. B. K. Ramanathan (Senior Dean)');
  const [aicMemberOne, setAicMemberOne] = useState('Dr. Ananya Sen (Dept of CSE)');
  const [aicMemberTwo, setAicMemberTwo] = useState('Prof. Rajesh K. Varma (AICTE Nominee)');
  const [inspectionDate, setInspectionDate] = useState('2026-04-15');

  // Findings Form State
  const [findingCategory, setFindingCategory] = useState<AicInspectionFinding['areaCategory']>('FACULTY_STUDENT_RATIO');
  const [findingReq, setFindingReq] = useState('1:15 Cadre Ratio with 1 Professor and 2 Associate Professors');
  const [findingObs, setFindingObs] = useState('Cadre ratio verified at 1:15.5 with adequate regular faculty appointments.');
  const [findingSeverity, setFindingSeverity] = useState<DeficiencySeverity>('COMPLIANT');

  // Syndicate Sanction Form State
  const [syndicateResolution, setSyndicateResolution] = useState('SYN-RES-2026-ITEM-88');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesStage = selectedFilter === 'ALL' || r.stage === selectedFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.institutionName.toLowerCase().includes(q) ||
        r.institutionCode.toLowerCase().includes(q) ||
        r.programmeName.toLowerCase().includes(q) ||
        r.certificateToken.toLowerCase().includes(q);

      return matchesStage && matchesSearch;
    });
  }, [records, selectedFilter, searchQuery]);

  // Telemetry Metrics
  const metrics = useMemo(() => {
    const total = records.length;
    const permanentCount = records.filter((r) => r.affiliationType === 'PERMANENT_AFFILIATION').length;
    const sanctionedCount = records.filter((r) => r.stage === 'SYNDICATE_SANCTIONED').length;
    const criticalDeficiencies = records.reduce(
      (acc, r) => acc + r.findings.filter((f) => f.severity === 'CRITICAL_DEFICIENCY' && !f.isRectified).length,
      0
    );

    return { total, permanentCount, sanctionedCount, criticalDeficiencies };
  }, [records]);

  // Handle Register Application
  const handleRegisterApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionCode.trim() || !institutionName.trim() || !programmeName.trim()) {
      showToast('Please fill out all mandatory institution fields.');
      return;
    }

    try {
      const created = registerAffiliationApplication({
        institutionCode: institutionCode.trim(),
        institutionName: institutionName.trim(),
        trustOrSociety: trustOrSociety.trim(),
        affiliationType,
        academicYear,
        programmeName: programmeName.trim(),
        approvedIntake: Number(approvedIntake),
      });

      setRecords([created, ...records]);
      setIsNewAppModalOpen(false);
      showToast(`Affiliation dossier registered: ${created.certificateToken}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error registering affiliation.';
      showToast(msg);
    }
  };

  // Handle Schedule Inspection
  const handleScheduleInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleModalRecord || !aicChairman.trim()) return;

    try {
      const updated = scheduleAicInspection(scheduleModalRecord, {
        aicChairman: aicChairman.trim(),
        aicMembers: [aicMemberOne.trim(), aicMemberTwo.trim()].filter(Boolean),
        inspectionDate,
      });

      setRecords(records.map((r) => (r.affiliationId === updated.affiliationId ? updated : r)));
      setScheduleModalRecord(null);
      showToast(`AIC Inspection scheduled on ${inspectionDate} under ${updated.aicChairman}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error scheduling inspection.';
      showToast(msg);
    }
  };

  // Handle Submit Inspection Findings
  const handleSubmitFindings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findingsModalRecord) return;

    const newFinding: AicInspectionFinding = {
      areaCategory: findingCategory,
      requiredStandard: findingReq.trim(),
      observedMetric: findingObs.trim(),
      severity: findingSeverity,
      isRectified: findingSeverity === 'COMPLIANT',
    };

    try {
      const updated = submitAicInspectionReport(findingsModalRecord, [
        ...findingsModalRecord.findings,
        newFinding,
      ]);

      setRecords(records.map((r) => (r.affiliationId === updated.affiliationId ? updated : r)));
      setFindingsModalRecord(null);
      showToast('AIC physical inspection findings report submitted.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting findings.';
      showToast(msg);
    }
  };

  // Handle Syndicate Sanction
  const handleSyndicateSanction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!syndicateModalRecord || !syndicateResolution.trim()) return;

    try {
      const updated = sanctionByUniversitySyndicate(syndicateModalRecord, syndicateResolution.trim());
      setRecords(records.map((r) => (r.affiliationId === updated.affiliationId ? updated : r)));
      setSyndicateModalRecord(null);
      showToast(`Affiliation sanctioned by Syndicate (Res: ${syndicateResolution})!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Syndicate sanction failed.';
      showToast(msg);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent = exportAffiliationAuditCSV(records);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `affiliation_inspection_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('College affiliation audit ledger exported to CSV.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-600 text-white px-5 py-3 rounded-lg shadow-xl border border-cyan-400 flex items-center space-x-3 animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <span className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                University College Affiliation & Inspection Committee Console
              </h1>
              <p className="text-sm text-slate-400">
                Statutory UGC Affiliation Regulations, AICTE Approval Process Handbook (APH) & Syndicate Governance
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-sm font-medium transition flex items-center space-x-2"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Affiliation CSV</span>
          </button>
          <button
            onClick={() => setIsNewAppModalOpen(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition flex items-center space-x-2 shadow-lg shadow-cyan-600/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Affiliation Dossier</span>
          </button>
        </div>
      </div>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Affiliation Applications</span>
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{metrics.total}</div>
          <div className="text-xs text-slate-500 mt-1">Colleges & specialized institutes</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Permanent Affiliations</span>
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{metrics.permanentCount}</div>
          <div className="text-xs text-slate-500 mt-1">NAAC A++ accredited colleges</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Syndicate Sanctioned</span>
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-indigo-400 mt-2">{metrics.sanctionedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Statutory council orders issued</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Pending Deficiencies</span>
            <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2">{metrics.criticalDeficiencies}</div>
          <div className="text-xs text-slate-500 mt-1">Unrectified critical observations</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['ALL', 'All Dossiers'],
              ['APPLICATION_SUBMITTED', 'Submitted'],
              ['AIC_INSPECTION_SCHEDULED', 'Inspection Scheduled'],
              ['AIC_REPORT_SUBMITTED', 'AIC Report Submitted'],
              ['SYNDICATE_SANCTIONED', 'Syndicate Sanctioned'],
            ] as const
          ).map(([stage, label]) => (
            <button
              key={stage}
              onClick={() => setSelectedFilter(stage as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedFilter === stage
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search college, code, program, token..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Affiliation Dossiers List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-sm">
            No college affiliation dossiers found matching the selected filter criteria.
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record.affiliationId}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition rounded-xl p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                      {record.institutionCode}
                    </span>
                    <span className="font-mono text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                      {record.certificateToken}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        record.stage === 'SYNDICATE_SANCTIONED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : record.stage === 'AIC_REPORT_SUBMITTED'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : record.stage === 'AIC_INSPECTION_SCHEDULED'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : 'bg-slate-700 text-slate-300 border border-slate-600'
                      }`}
                    >
                      {record.stage.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded font-mono font-medium">
                      {record.affiliationType.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white">{record.institutionName}</h3>

                  <div className="text-xs text-slate-300">
                    <span className="text-slate-500">Program & Intake:</span> {record.programmeName} ({record.approvedIntake} Seats)
                  </div>

                  <div className="text-xs text-slate-400">
                    <span className="text-slate-500">Trust:</span> {record.trustOrSociety} | <span className="text-slate-500">AY:</span> {record.academicYear}
                  </div>

                  {record.aicChairman && (
                    <div className="text-xs bg-slate-950/70 border border-slate-800/80 p-2.5 rounded text-slate-300">
                      <div className="font-semibold text-cyan-400">AIC Committee: {record.aicChairman}</div>
                      <div className="text-[11px] text-slate-500">Inspection Date: {record.inspectionDate} | Members: {record.aicMembers.join(', ')}</div>
                    </div>
                  )}

                  {/* Findings breakdown */}
                  {record.findings.length > 0 && (
                    <div className="pt-1 space-y-1.5">
                      <div className="text-xs font-semibold text-slate-400">AIC Inspection Findings ({record.findings.length}):</div>
                      <div className="space-y-1">
                        {record.findings.map((f, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded border text-xs flex items-center justify-between ${
                              f.severity === 'CRITICAL_DEFICIENCY' && !f.isRectified
                                ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                                : f.severity === 'MINOR_OBSERVATION'
                                ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                                : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                            }`}
                          >
                            <div>
                              <span className="font-semibold">{f.areaCategory.replace(/_/g, ' ')}:</span> {f.observedMetric}
                            </div>
                            <span className="text-[11px] px-2 py-0.5 rounded font-bold uppercase">
                              {f.severity.replace(/_/g, ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {record.syndicateResolutionNumber && (
                    <div className="text-xs text-emerald-400 font-mono pt-1">
                      Syndicate Order: {record.syndicateResolutionNumber}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap lg:flex-col items-end gap-2 mt-4 lg:mt-0">
                  {record.stage === 'APPLICATION_SUBMITTED' && (
                    <button
                      onClick={() => setScheduleModalRecord(record)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition"
                    >
                      Schedule AIC Inspection
                    </button>
                  )}

                  {record.stage === 'AIC_INSPECTION_SCHEDULED' && (
                    <button
                      onClick={() => setFindingsModalRecord(record)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition"
                    >
                      Record Inspection Findings
                    </button>
                  )}

                  {record.stage === 'AIC_REPORT_SUBMITTED' && (
                    <button
                      onClick={() => setSyndicateModalRecord(record)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition"
                    >
                      University Syndicate Sanction
                    </button>
                  )}

                  <button
                    onClick={() => setSealModalRecord(record)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition"
                  >
                    View Affiliation Seal
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL 1: Register New Application */}
      {isNewAppModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Register College Affiliation Application</h2>
              <button onClick={() => setIsNewAppModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterApp} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Institution Code</label>
                  <input
                    type="text"
                    value={institutionCode}
                    onChange={(e) => setInstitutionCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Institution Name</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Registered Trust / Society</label>
                <input
                  type="text"
                  value={trustOrSociety}
                  onChange={(e) => setTrustOrSociety(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Affiliation Type</label>
                  <select
                    value={affiliationType}
                    onChange={(e) => setAffiliationType(e.target.value as AffiliationType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="TEMPORARY_PROVISIONAL">Temporary Provisional (Annual)</option>
                    <option value="PERMANENT_AFFILIATION">Permanent Affiliation (NAAC A++)</option>
                    <option value="NEW_PROGRAMME_VARIATION_INTAKE">New Programme / Intake Variation</option>
                    <option value="AUTONOMOUS_EXTENSION">Conferment of Autonomous Status</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Approved Intake (Seats)</label>
                  <input
                    type="number"
                    value={approvedIntake}
                    onChange={(e) => setApprovedIntake(Number(e.target.value))}
                    min={30}
                    step={30}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Degree Programme Name</label>
                <input
                  type="text"
                  value={programmeName}
                  onChange={(e) => setProgrammeName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewAppModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium shadow"
                >
                  Register Dossier & Issue Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Schedule AIC Inspection */}
      {scheduleModalRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Empanel Annual Inspection Committee (AIC)</h2>
              <button onClick={() => setScheduleModalRecord(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleInspection} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">AIC Chairman (Senior Professor)</label>
                <input
                  type="text"
                  value={aicChairman}
                  onChange={(e) => setAicChairman(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Subject Expert Member 1</label>
                <input
                  type="text"
                  value={aicMemberOne}
                  onChange={(e) => setAicMemberOne(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Statutory Body / AICTE Nominee Member 2</label>
                <input
                  type="text"
                  value={aicMemberTwo}
                  onChange={(e) => setAicMemberTwo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Physical Inspection Visit Date</label>
                <input
                  type="date"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setScheduleModalRecord(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow"
                >
                  Dispatch AIC Committee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Submit Inspection Findings */}
      {findingsModalRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Submit AIC Inspection Findings</h2>
              <button onClick={() => setFindingsModalRecord(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitFindings} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Area of Scrutiny</label>
                <select
                  value={findingCategory}
                  onChange={(e) => setFindingCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                >
                  <option value="FACULTY_STUDENT_RATIO">Faculty-Student Cadre Ratio (FSR)</option>
                  <option value="INFRASTRUCTURE_LAND">Infrastructure, Carpet Area & Classrooms</option>
                  <option value="LABORATORY_EQUIPMENT">Laboratory Equipment & Computing Facilities</option>
                  <option value="LIBRARY_JOURNALS">Library Holdings & IEEE/Springer e-Journals</option>
                  <option value="SAFETY_ACCESSIBILITY">Fire Safety, Sewage TSDF & Barrier-Free Access</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Required Statutory Standard</label>
                <input
                  type="text"
                  value={findingReq}
                  onChange={(e) => setFindingReq(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Observed Metric by Committee</label>
                <input
                  type="text"
                  value={findingObs}
                  onChange={(e) => setFindingObs(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Deficiency Severity</label>
                <select
                  value={findingSeverity}
                  onChange={(e) => setFindingSeverity(e.target.value as DeficiencySeverity)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                >
                  <option value="COMPLIANT">Compliant (Zero Deficiency)</option>
                  <option value="MINOR_OBSERVATION">Minor Observation (45 Days Rectification)</option>
                  <option value="CRITICAL_DEFICIENCY">Critical Statutory Deficiency (Disqualifying)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setFindingsModalRecord(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium shadow"
                >
                  Append AIC Finding & Sign-off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Syndicate Sanction */}
      {syndicateModalRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">University Syndicate / Council Sanction</h2>
              <button onClick={() => setSyndicateModalRecord(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSyndicateSanction} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Syndicate Resolution Order Number</label>
                <input
                  type="text"
                  value={syndicateResolution}
                  onChange={(e) => setSyndicateResolution(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  placeholder="e.g. SYN-RES-2026-ITEM-88"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSyndicateModalRecord(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium shadow"
                >
                  Execute Syndicate Affiliation Sanction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Affiliation Seal Inspector */}
      {sealModalRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Cryptographic Affiliation Seal Inspector</h2>
              <button onClick={() => setSealModalRecord(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-slate-500">Institution:</div>
                <div className="font-semibold text-white">{sealModalRecord.institutionName} ({sealModalRecord.institutionCode})</div>
              </div>
              <div>
                <div className="text-slate-500">Affiliation Token:</div>
                <div className="font-mono text-cyan-400 font-semibold">{sealModalRecord.certificateToken}</div>
              </div>
              <div>
                <div className="text-slate-500">SHA-256 Affiliation Seal:</div>
                <div className="font-mono text-emerald-400 break-all bg-slate-950 p-2.5 rounded border border-slate-800 select-all">
                  {sealModalRecord.cryptographicAffiliationSeal}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSealModalRecord(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium text-xs"
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
