'use client';

import React, { useState, useMemo } from 'react';
import {
  CoePressJob,
  ExamSession,
  CustodyStage,
  PaperSet,
  DoubleLockVerification,
  INITIAL_COE_PRESS_JOBS,
  createCoePressJob,
  secureInDoubleLockVault,
  dispatchPacketsToCenters,
  verifyCenterPacketReceipt,
  activateEmergencyFallback,
  exportCoePressAuditCSV,
} from '@/lib/admin/centralCoePress';
import { useGovernanceStore } from '@/lib/hooks/useGovernanceStore';

export default function CentralCoePressManager() {
  const {
    records: jobs,
    setRecords: setJobs,
    syncSource,
    isSaving,
    saveRecord,
  } = useGovernanceStore<CoePressJob>(
    'central_coe_press_custody',
    INITIAL_COE_PRESS_JOBS,
    'jobId'
  );
  const [selectedFilter, setSelectedFilter] = useState<CustodyStage | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [doubleLockModalJob, setDoubleLockModalJob] = useState<{
    job: CoePressJob;
    mode: 'VAULT' | 'DISPATCH';
  } | null>(null);
  const [fallbackModalJob, setFallbackModalJob] = useState<CoePressJob | null>(null);
  const [centerVerifyModalJob, setCenterVerifyModalJob] = useState<CoePressJob | null>(null);
  const [sealModalJob, setSealModalJob] = useState<CoePressJob | null>(null);

  // New Print Job Form State
  const [courseCode, setCourseCode] = useState('CY301');
  const [courseTitle, setCourseTitle] = useState('Applied Cryptography & Network Security Protocols');
  const [examSession, setExamSession] = useState<ExamSession>('END_SEM_SPRING_2026');
  const [examDate, setExamDate] = useState('2026-05-18');
  const [examSlot, setExamSlot] = useState<'FORENOON_0930_1230' | 'AFTERNOON_1400_1700'>('FORENOON_0930_1230');
  const [totalCandidates, setTotalCandidates] = useState(200);
  const [centerOneName, setCenterOneName] = useState('Main Science Block Hall A');
  const [centerOneSupt, setCenterOneSupt] = useState('Prof. Ananya Sen');
  const [centerOneCount, setCenterOneCount] = useState(120);
  const [centerTwoName, setCenterTwoName] = useState('North Campus Engineering Hall');
  const [centerTwoSupt, setCenterTwoSupt] = useState('Dr. B. K. Verma');
  const [centerTwoCount, setCenterTwoCount] = useState(80);

  // Double-Lock Authorization State
  const [custodianOneName, setCustodianOneName] = useState('Dr. Ramesh Sharma (Joint Controller Conf.)');
  const [custodianOneKey, setCustodianOneKey] = useState(true);
  const [custodianTwoName, setCustodianTwoName] = useState('Col. Vikram Rathore (Chief Security Officer)');
  const [custodianTwoKey, setCustodianTwoKey] = useState(true);
  const [vaultLocation, setVaultLocation] = useState('STRONG-ROOM-A-BAY-2');

  // Emergency Fallback State
  const [compromisedSet, setCompromisedSet] = useState<PaperSet>('SET_A');
  const [fallbackReason, setFallbackReason] = useState('Anomalous seal tamper flag detected on external dispatch transit packet.');
  const [reportedBy, setReportedBy] = useState('Assistant Registrar (Flying Squad & Vigilance)');
  const [authorizedBy, setAuthorizedBy] = useState('Prof. M. K. Narayanan (Controller of Examinations)');

  // Center Verification State
  const [selectedCenterCode, setSelectedCenterCode] = useState('');
  const [superintendentSignoff, setSuperintendentSignoff] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchesStage = selectedFilter === 'ALL' || j.stage === selectedFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        j.courseCode.toLowerCase().includes(q) ||
        j.courseTitle.toLowerCase().includes(q) ||
        j.packetBarcodeSeal.toLowerCase().includes(q) ||
        j.jobId.toLowerCase().includes(q);
      return matchesStage && matchesSearch;
    });
  }, [jobs, selectedFilter, searchQuery]);

  // Telemetry Metrics
  const metrics = useMemo(() => {
    const totalJobs = jobs.length;
    const totalCandidates = jobs.reduce((acc, j) => acc + j.totalCandidates, 0);
    const inVault = jobs.filter((j) => j.stage === 'DOUBLE_LOCK_VAULT').length;
    const dispatched = jobs.filter((j) => j.stage === 'DISPATCHED_TO_CENTERS' || j.stage === 'VERIFIED_AT_CENTER').length;
    const fallbacksTriggered = jobs.reduce((acc, j) => acc + j.fallbackHistory.length, 0);
    return { totalJobs, totalCandidates, inVault, dispatched, fallbacksTriggered };
  }, [jobs]);

  // Handle Create Job
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseTitle.trim() || totalCandidates <= 0) {
      showToast('Please fill out all required job parameters.');
      return;
    }

    try {
      const created = createCoePressJob({
        courseCode: courseCode.trim(),
        courseTitle: courseTitle.trim(),
        examSession,
        examDate,
        examSlot,
        totalCandidates: Number(totalCandidates),
        centerAllocations: [
          {
            centerCode: 'CENT-01',
            centerName: centerOneName.trim(),
            superintendentName: centerOneSupt.trim(),
            candidateCount: Number(centerOneCount),
          },
          {
            centerCode: 'CENT-02',
            centerName: centerTwoName.trim(),
            superintendentName: centerTwoSupt.trim(),
            candidateCount: Number(centerTwoCount),
          },
        ],
      });

      await saveRecord(created);
      setIsNewJobModalOpen(false);
      showToast(`Confidential print job initialized with seal ${created.packetBarcodeSeal}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating print job.';
      showToast(msg);
    }
  };

  // Handle Double-Lock Execution
  const handleExecuteDoubleLock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubleLockModalJob) return;

    const verification: DoubleLockVerification = {
      custodianOneId: 'COE-CONF-01',
      custodianOneName: custodianOneName.trim(),
      custodianOneKeyVerified: custodianOneKey,
      custodianTwoId: 'CSO-SEC-04',
      custodianTwoName: custodianTwoName.trim(),
      custodianTwoKeyVerified: custodianTwoKey,
      verifiedTimestamp: new Date().toISOString(),
      vaultLocation: vaultLocation.trim(),
    };

    try {
      let updated: CoePressJob;
      if (doubleLockModalJob.mode === 'VAULT') {
        updated = secureInDoubleLockVault(doubleLockModalJob.job, verification);
        showToast(`Job secured in double-lock vault (${vaultLocation}).`);
      } else {
        updated = dispatchPacketsToCenters(doubleLockModalJob.job, verification);
        showToast('Confidential packets dispatched to examination centers under armed guard.');
      }

      await saveRecord(updated);
      setDoubleLockModalJob(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Double-lock execution failed.';
      showToast(msg);
    }
  };

  // Handle Emergency Fallback
  const handleActivateFallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fallbackModalJob) return;

    try {
      const updated = activateEmergencyFallback(fallbackModalJob, {
        compromisedSet,
        reason: fallbackReason.trim(),
        reportedBy: reportedBy.trim(),
        authorizedByCoE: authorizedBy.trim(),
      });

      await saveRecord(updated);
      setFallbackModalJob(null);
      showToast(`EMERGENCY: ${compromisedSet} quarantined. Fallback ${updated.activeSet} activated!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fallback activation failed.';
      showToast(msg);
    }
  };

  // Handle Center Verification
  const handleCenterVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!centerVerifyModalJob || !selectedCenterCode) return;

    try {
      const updated = verifyCenterPacketReceipt(
        centerVerifyModalJob,
        selectedCenterCode,
        superintendentSignoff.trim() || 'Center Superintendent'
      );

      await saveRecord(updated);
      setCenterVerifyModalJob(null);
      showToast(`Center ${selectedCenterCode} verified physical packet seal intact.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Center verification failed.';
      showToast(msg);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent = exportCoePressAuditCSV(jobs);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `coe_press_audit_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CoE confidential press audit ledger exported to CSV.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-lg shadow-xl border border-indigo-400 flex items-center space-x-3 animate-fade-in">
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
            <span className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Controller of Examinations Confidential Press & Custody
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border ${
                  syncSource === 'supabase'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {syncSource === 'supabase' ? 'Supabase Live' : 'Local Fallback'}
                </span>
                {isSaving && (
                  <span className="text-xs text-rose-400 animate-pulse font-medium">Syncing...</span>
                )}
              </div>
              <p className="text-sm text-slate-400">
                Statutory Examination Ordinance & UGC Secure Confidential Custody Controller (Double-Lock Protocol)
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
            <span>Export Audit CSV</span>
          </button>
          <button
            onClick={() => setIsNewJobModalOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-medium transition flex items-center space-x-2 shadow-lg shadow-rose-600/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Confidential Print Run</span>
          </button>
        </div>
      </div>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Total Press Runs</span>
            <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{metrics.totalJobs}</div>
          <div className="text-xs text-slate-500 mt-1">{metrics.totalCandidates} total candidates registered</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Double-Lock Vault</span>
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2">{metrics.inVault}</div>
          <div className="text-xs text-slate-500 mt-1">Dual-custodian physical keys verified</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Dispatched / Center Verified</span>
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{metrics.dispatched}</div>
          <div className="text-xs text-slate-500 mt-1">Under armed escort & receipt signoff</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Emergency Contingencies</span>
            <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2">{metrics.fallbacksTriggered}</div>
          <div className="text-xs text-slate-500 mt-1">Reserve Set B/C fallback activations</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['ALL', 'All Jobs'],
              ['JOB_INITIALIZED', 'Initialized'],
              ['DOUBLE_LOCK_VAULT', 'In Vault'],
              ['DISPATCHED_TO_CENTERS', 'Dispatched'],
              ['VERIFIED_AT_CENTER', 'Center Verified'],
              ['EMERGENCY_QUARANTINED', 'Quarantined / Fallback'],
            ] as const
          ).map(([stage, label]) => (
            <button
              key={stage}
              onClick={() => setSelectedFilter(stage as CustodyStage | 'ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedFilter === stage
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
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
            placeholder="Search paper, barcode seal, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Print Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-sm">
            No confidential printing jobs found matching the selected filter criteria.
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.jobId}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition rounded-xl p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20">
                      {job.courseCode}
                    </span>
                    <span className="font-mono text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                      {job.packetBarcodeSeal}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        job.stage === 'VERIFIED_AT_CENTER'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : job.stage === 'DOUBLE_LOCK_VAULT'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : job.stage === 'EMERGENCY_QUARANTINED'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {job.stage.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                      ACTIVE: {job.activeSet}
                    </span>
                    {job.fallbackHistory.length > 0 && (
                      <span className="text-xs bg-rose-950 text-rose-300 border border-rose-700 px-2 py-0.5 rounded font-semibold animate-pulse">
                        ⚠️ FALLBACK ACTIVE
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-white">{job.courseTitle}</h3>

                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400">
                    <div>
                      <span className="text-slate-500">Session:</span> {job.examSession}
                    </div>
                    <div>
                      <span className="text-slate-500">Date & Slot:</span> {job.examDate} ({job.examSlot.replace(/_/g, ' ')})
                    </div>
                    <div>
                      <span className="text-slate-500">Candidates:</span> {job.totalCandidates}
                    </div>
                    <div>
                      <span className="text-slate-500">Total Print Run:</span> {job.totalCopiesPrinted} copies ({job.packetsCount} packets)
                    </div>
                  </div>

                  {/* Centers Summary */}
                  <div className="pt-2">
                    <div className="text-xs font-medium text-slate-400 mb-1">Center Dispatches:</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {job.centerAllocations.map((alloc) => (
                        <div
                          key={alloc.centerCode}
                          className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-slate-200">{alloc.centerCode}</span> - {alloc.centerName}
                            <div className="text-slate-500 text-[11px]">
                              Supt: {alloc.superintendentName} ({alloc.candidateCount} cands, {alloc.packetsAllocated} pkts)
                            </div>
                          </div>
                          <div>
                            {alloc.receivedVerified ? (
                              <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-medium flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[11px]">
                                In Transit
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap lg:flex-col items-end gap-2 mt-4 lg:mt-0">
                  {job.stage === 'JOB_INITIALIZED' && (
                    <button
                      onClick={() => setDoubleLockModalJob({ job, mode: 'VAULT' })}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition"
                    >
                      Double-Lock Vault Secure
                    </button>
                  )}

                  {job.stage === 'DOUBLE_LOCK_VAULT' && (
                    <button
                      onClick={() => setDoubleLockModalJob({ job, mode: 'DISPATCH' })}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition"
                    >
                      Dispatch to Centers
                    </button>
                  )}

                  {job.stage === 'DISPATCHED_TO_CENTERS' && (
                    <button
                      onClick={() => {
                        setCenterVerifyModalJob(job);
                        const firstUnverified = job.centerAllocations.find((a) => !a.receivedVerified);
                        if (firstUnverified) {
                          setSelectedCenterCode(firstUnverified.centerCode);
                          setSuperintendentSignoff(firstUnverified.superintendentName);
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition"
                    >
                      Verify Center Receipt
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setFallbackModalJob(job);
                      setCompromisedSet(job.activeSet);
                    }}
                    className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded text-xs font-medium transition"
                  >
                    Emergency Fallback Switch
                  </button>

                  <button
                    onClick={() => setSealModalJob(job)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition"
                  >
                    View Custody Seal
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL 1: Create New Confidential Print Job */}
      {isNewJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Create Confidential Question Paper Print Run</h2>
              <button onClick={() => setIsNewJobModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Course Code</label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    placeholder="e.g. CS401"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Exam Session</label>
                  <select
                    value={examSession}
                    onChange={(e) => setExamSession(e.target.value as ExamSession)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="END_SEM_SPRING_2026">End Semester Spring 2026</option>
                    <option value="END_SEM_AUTUMN_2026">End Semester Autumn 2026</option>
                    <option value="ANNUAL_SUMMER_2026">Annual Summer 2026</option>
                    <option value="SUPPLEMENTARY_2026">Supplementary 2026</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Course Title</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Exam Slot</label>
                  <select
                    value={examSlot}
                    onChange={(e) => setExamSlot(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="FORENOON_0930_1230">Forenoon (09:30 - 12:30)</option>
                    <option value="AFTERNOON_1400_1700">Afternoon (14:00 - 17:00)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Total Candidates</label>
                  <input
                    type="number"
                    value={totalCandidates}
                    onChange={(e) => setTotalCandidates(Number(e.target.value))}
                    min={1}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              {/* Center Allocations */}
              <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/40 space-y-3">
                <div className="font-semibold text-slate-300">Center Allocations (Dual Center Distribution)</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Center 1 Name"
                    value={centerOneName}
                    onChange={(e) => setCenterOneName(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Superintendent 1"
                    value={centerOneSupt}
                    onChange={(e) => setCenterOneSupt(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                  />
                  <input
                    type="number"
                    placeholder="Candidate Count"
                    value={centerOneCount}
                    onChange={(e) => setCenterOneCount(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Center 2 Name"
                    value={centerTwoName}
                    onChange={(e) => setCenterTwoName(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Superintendent 2"
                    value={centerTwoSupt}
                    onChange={(e) => setCenterTwoSupt(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                  />
                  <input
                    type="number"
                    placeholder="Candidate Count"
                    value={centerTwoCount}
                    onChange={(e) => setCenterTwoCount(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewJobModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium shadow-md"
                >
                  Schedule Printing & Generate Seal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Double-Lock Authorization Modal */}
      {doubleLockModalJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white">Dual-Custodian Double-Lock Authorization</h2>
                <p className="text-xs text-slate-400">
                  {doubleLockModalJob.mode === 'VAULT' ? 'Vault Entry Verification' : 'Dispatch Release Authorization'}
                </p>
              </div>
              <button onClick={() => setDoubleLockModalJob(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteDoubleLock} className="space-y-4 text-xs">
              <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">Custodian 1 (CoE Joint Custodian)</div>
                    <div className="text-[11px] text-slate-400">{custodianOneName}</div>
                  </div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={custodianOneKey}
                      onChange={(e) => setCustodianOneKey(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-rose-500"
                    />
                    <span className="text-xs text-rose-400 font-medium">Physical Key 1 Verified</span>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div>
                    <div className="font-semibold text-slate-200">Custodian 2 (Chief Security Officer)</div>
                    <div className="text-[11px] text-slate-400">{custodianTwoName}</div>
                  </div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={custodianTwoKey}
                      onChange={(e) => setCustodianTwoKey(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-rose-500"
                    />
                    <span className="text-xs text-rose-400 font-medium">Physical Key 2 Verified</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Double-Lock Vault Strong Room</label>
                <input
                  type="text"
                  value={vaultLocation}
                  onChange={(e) => setVaultLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDoubleLockModalJob(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!custodianOneKey || !custodianTwoKey}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded font-medium shadow"
                >
                  Authenticate & Authorize Custody
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Emergency Fallback Activation Modal */}
      {fallbackModalJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-900/50">
              <div className="flex items-center space-x-2 text-rose-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="text-base font-bold text-white">Emergency Question Paper Fallback Activation</h2>
              </div>
              <button onClick={() => setFallbackModalJob(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleActivateFallback} className="space-y-4 text-xs">
              <div className="bg-rose-950/40 border border-rose-800/80 rounded-lg p-3 text-rose-200">
                Warning: Triggering emergency fallback will immediately quarantine the compromised set and switch all examination centers to the secondary reserve set held in double-lock reserve.
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Compromised Set to Quarantine</label>
                <input
                  type="text"
                  value={compromisedSet}
                  readOnly
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-rose-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Reason for Quarantine / Breach Vector</label>
                <textarea
                  value={fallbackReason}
                  onChange={(e) => setFallbackReason(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Reported By (Vigilance / Superintendent)</label>
                <input
                  type="text"
                  value={reportedBy}
                  onChange={(e) => setReportedBy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Authorized By (CoE Ordinance Norms)</label>
                <input
                  type="text"
                  value={authorizedBy}
                  onChange={(e) => setAuthorizedBy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setFallbackModalJob(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium shadow"
                >
                  Execute Emergency Set Switch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Center Receipt Verification Modal */}
      {centerVerifyModalJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Center Superintendent Physical Verification</h2>
              <button onClick={() => setCenterVerifyModalJob(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCenterVerification} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Select Center Code</label>
                <select
                  value={selectedCenterCode}
                  onChange={(e) => setSelectedCenterCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                >
                  {centerVerifyModalJob.centerAllocations.map((a) => (
                    <option key={a.centerCode} value={a.centerCode}>
                      {a.centerCode} - {a.centerName} ({a.receivedVerified ? 'Already Verified' : 'Pending Receipt'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Center Superintendent Sign-off Name</label>
                <input
                  type="text"
                  value={superintendentSignoff}
                  onChange={(e) => setSuperintendentSignoff(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCenterVerifyModalJob(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium shadow"
                >
                  Confirm Physical Seal Intact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Cryptographic SHA-256 Seal Modal */}
      {sealModalJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Cryptographic Custody Seal Inspector</h2>
              <button onClick={() => setSealModalJob(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-slate-500">Job Reference:</div>
                <div className="font-semibold text-white">{sealModalJob.jobId}</div>
              </div>
              <div>
                <div className="text-slate-500">Barcode Tracking Seal:</div>
                <div className="font-mono text-rose-400 font-semibold">{sealModalJob.packetBarcodeSeal}</div>
              </div>
              <div>
                <div className="text-slate-500">Active Paper Set:</div>
                <div className="font-semibold text-purple-400">{sealModalJob.activeSet}</div>
              </div>
              <div>
                <div className="text-slate-500">SHA-256 Custody Hash:</div>
                <div className="font-mono text-emerald-400 break-all bg-slate-950 p-2.5 rounded border border-slate-800 select-all">
                  {sealModalJob.cryptographicSeal}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Last Telemetry Timestamp:</div>
                <div className="text-slate-300">{sealModalJob.lastUpdated}</div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSealModalJob(null)}
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
