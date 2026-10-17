'use client';

import React, { useState } from 'react';
import { useGovernanceStore } from '@/lib/hooks/useGovernanceStore';
import {
  StudentAbcRecord,
  MeesCredentialTier,
  SAMPLE_ABC_RECORDS,
  createStudentAbcRecord,
  syncWithDigilockerNad,
  addCourseCredits,
  redeemCreditsForCredential,
  exportAcademicBankLedgerCSV,
  evaluateMeesEligibility,
  NEP_CREDIT_THRESHOLDS
} from '@/lib/admin/centralAcademicBankOfCredits';

export default function CentralAcademicBankManager() {
  const {
    records,
    setRecords,
    syncSource,
    isSaving,
    saveRecord
  } = useGovernanceStore<StudentAbcRecord>('central_academic_bank_credits', SAMPLE_ABC_RECORDS, 'abcRecordId');
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<StudentAbcRecord | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showCreditModal, setShowCreditModal] = useState<boolean>(false);
  const [showRedeemModal, setShowRedeemModal] = useState<boolean>(false);
  const [showSealModal, setShowSealModal] = useState<boolean>(false);
  const [alertBanner, setAlertBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Student Form state
  const [newRoll, setNewRoll] = useState('');
  const [newName, setNewName] = useState('');
  const [newApaar, setNewApaar] = useState('');
  const [newProgram, setNewProgram] = useState('B.Tech in Artificial Intelligence & Data Science');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newAdmYear, setNewAdmYear] = useState(2024);

  // Add Course Credit Form state
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCredits, setCourseCredits] = useState(4);
  const [courseSem, setCourseSem] = useState(3);
  const [courseGrade, setCourseGrade] = useState('A+');
  const [courseYear, setCourseYear] = useState('2025-2026');
  const [courseInst, setCourseInst] = useState('PinIT Central University');
  const [courseInstCode, setCourseInstCode] = useState('U-0123');
  const [isExternal, setIsExternal] = useState(false);

  // Redeem Form state
  const [redeemTier, setRedeemTier] = useState<MeesCredentialTier>('UG_CERTIFICATE');

  // Filtering
  const filteredRecords = records.filter(r => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'CERTIFICATE') return r.activeCreditBalance >= NEP_CREDIT_THRESHOLDS.UG_CERTIFICATE;
    if (activeTab === 'DIPLOMA') return r.activeCreditBalance >= NEP_CREDIT_THRESHOLDS.UG_DIPLOMA;
    if (activeTab === 'DEGREE') return r.activeCreditBalance >= NEP_CREDIT_THRESHOLDS.BACHELORS_DEGREE;
    if (activeTab === 'HONOURS') return r.activeCreditBalance >= NEP_CREDIT_THRESHOLDS.BACHELORS_HONOURS;
    return true;
  });

  // Telemetry KPIs
  const totalAccounts = records.length;
  const totalCreditsBanked = records.reduce((sum, r) => sum + r.totalCreditsAccumulated, 0);
  const syncedCount = records.filter(r => r.syncStatus === 'SYNCED_DIGILOCKER_NAD' || r.syncStatus === 'DEGREE_AWARDED_CLOSED').length;
  const syncRatePct = totalAccounts > 0 ? Math.round((syncedCount / totalAccounts) * 100) : 0;
  const totalRedeemedDegrees = records.reduce((sum, r) => sum + r.redemptions.length, 0);

  // Handlers
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rec = createStudentAbcRecord({
        studentId: newRoll,
        studentName: newName,
        apaarId: newApaar,
        programName: newProgram,
        department: newDept,
        admissionYear: Number(newAdmYear)
      });

      await saveRecord(rec);
      setShowAddModal(false);
      setAlertBanner({ type: 'success', message: `APAAR ID ${rec.apaarId} registered successfully for ${rec.studentName}` });
    } catch (err: unknown) {
      setAlertBanner({ type: 'error', message: err instanceof Error ? err.message : 'Registration failed' });
    }
  };

  const handleSyncDigilocker = async (record: StudentAbcRecord) => {
    const res = syncWithDigilockerNad(record);
    await saveRecord(res.record);
    setAlertBanner({ type: 'success', message: `Digilocker NAD synced: ${res.digilockerUri}` });
  };

  const handleAddCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const updated = addCourseCredits(selectedRecord, {
      courseCode: courseCode.toUpperCase(),
      courseTitle,
      creditsEarned: Number(courseCredits),
      semester: Number(courseSem),
      gradeEarned: courseGrade,
      academicYear: courseYear,
      awardingInstitute: courseInst,
      institutionCode: courseInstCode,
      isExternalTransfer: isExternal,
      completionDate: new Date().toISOString().split('T')[0]
    });

    await saveRecord(updated);
    setSelectedRecord(updated);
    setShowCreditModal(false);
    setAlertBanner({ type: 'success', message: `${courseCredits} Credits deposited for ${courseCode}. New Balance: ${updated.activeCreditBalance}` });
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const res = redeemCreditsForCredential(selectedRecord, redeemTier);
    if (!res.success) {
      setAlertBanner({ type: 'error', message: res.error || 'Redemption rejected' });
      return;
    }

    await saveRecord(res.record);
    setSelectedRecord(res.record);
    setShowRedeemModal(false);
    setAlertBanner({
      type: 'success',
      message: `Exit Credential ${redeemTier.replace(/_/g, ' ')} conferred! Certificate Serial: ${res.redemption?.certificateSerialNumber}`
    });
  };

  const handleExportCSV = () => {
    const csvData = exportAcademicBankLedgerCSV(records);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Academic_Bank_of_Credits_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAlertBanner({ type: 'success', message: 'Academic Bank of Credits CSV exported successfully' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400 font-mono text-sm">
              NEP 2020 MEES Architecture
            </span>
            <span className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 font-mono text-sm">
              Digilocker NAD & APAAR Registry
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mt-2 flex items-center gap-3">
            Central University Academic Bank of Credits (ABC) & Digilocker NAD Console
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
            Automated Permanent Academic Account Registry (APAAR ID), Multiple Entry/Exit Credit Accumulation & Degree Redemption Engine
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-lg shadow-indigo-950"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Register APAAR / ABC
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export ABC Ledger CSV
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
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered APAAR Accounts</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">{totalAccounts}</p>
          <p className="text-xs text-slate-500 mt-1">One Nation One Student ID</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Total Banked Credits</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{totalCreditsBanked}</p>
          <p className="text-xs text-slate-500 mt-1">Accumulated in Central Ledger</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Digilocker NAD Sync Rate</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">{syncRatePct}%</p>
          <p className="text-xs text-slate-500 mt-1">{syncedCount} Repositories Verified</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Conferred Exit Awards</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{totalRedeemedDegrees}</p>
          <p className="text-xs text-slate-500 mt-1">NEP Multiple Exit Credentials</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        {[
          { id: 'ALL', label: 'All Scholars' },
          { id: 'CERTIFICATE', label: 'UG Cert (40+)' },
          { id: 'DIPLOMA', label: 'UG Diploma (80+)' },
          { id: 'DEGREE', label: 'Degree (120+)' },
          { id: 'HONOURS', label: 'Honours (160+)' }
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

      {/* Student ABC Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredRecords.map(record => {
          const mees = evaluateMeesEligibility(record.activeCreditBalance);
          const progressPct = Math.min(100, Math.round((record.activeCreditBalance / 160) * 100));

          return (
            <div
              key={record.abcRecordId}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {record.studentId}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                      APAAR: {record.apaarId}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mt-1.5">{record.studentName}</h3>
                  <p className="text-xs text-slate-400">{record.programName}</p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    record.syncStatus === 'SYNCED_DIGILOCKER_NAD'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : record.syncStatus === 'DEGREE_AWARDED_CLOSED'
                      ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                      : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  }`}>
                    {record.syncStatus.replace(/_/g, ' ')}
                  </span>
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

              {/* Credit Balance Progress Dial */}
              <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">NEP 2020 Active Credit Balance</span>
                  <span className="font-bold text-indigo-300 text-sm">
                    {record.activeCreditBalance} Credits
                    <span className="text-xs text-slate-500 font-normal ml-1">
                      (Acc: {record.totalCreditsAccumulated} | Red: {record.totalCreditsRedeemed})
                    </span>
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span className={record.activeCreditBalance >= 40 ? 'text-emerald-400 font-semibold' : ''}>
                    Cert (40)
                  </span>
                  <span className={record.activeCreditBalance >= 80 ? 'text-emerald-400 font-semibold' : ''}>
                    Diploma (80)
                  </span>
                  <span className={record.activeCreditBalance >= 120 ? 'text-emerald-400 font-semibold' : ''}>
                    Degree (120)
                  </span>
                  <span className={record.activeCreditBalance >= 160 ? 'text-cyan-400 font-bold' : ''}>
                    Honours (160)
                  </span>
                </div>
              </div>

              {/* Digilocker URI & Eligible Exits */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Highest Eligible Credential:</span>
                  <span className="font-semibold text-emerald-400">
                    {mees.highestCredential ? mees.highestCredential.replace(/_/g, ' ') : 'Below Certificate Threshold (<40)'}
                  </span>
                </div>

                {record.digilockerUri && (
                  <div className="text-right">
                    <span className="text-slate-500 block">Digilocker NAD URI:</span>
                    <span className="font-mono text-cyan-400 text-[11px] truncate max-w-[200px] block">
                      {record.digilockerUri}
                    </span>
                  </div>
                )}
              </div>

              {/* Recent Courses Preview */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Deposited Course Credits ({record.courses.length} courses)
                </span>
                <div className="max-h-28 overflow-y-auto space-y-1 text-xs">
                  {record.courses.map(c => (
                    <div key={c.courseCode} className="p-1.5 bg-slate-950/40 rounded border border-slate-800/60 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-200">{c.courseCode}:</span>{' '}
                        <span className="text-slate-400">{c.courseTitle}</span>
                        {c.isExternalTransfer && (
                          <span className="ml-1 text-[10px] px-1 bg-amber-950 text-amber-300 rounded border border-amber-800">
                            Transfer
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-indigo-400 font-bold">{c.creditsEarned} Cr ({c.gradeEarned})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
                {record.syncStatus !== 'SYNCED_DIGILOCKER_NAD' && record.syncStatus !== 'DEGREE_AWARDED_CLOSED' && (
                  <button
                    onClick={() => handleSyncDigilocker(record)}
                    className="flex-1 py-1.5 px-3 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 rounded text-xs font-medium transition"
                  >
                    Sync Digilocker NAD
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedRecord(record);
                    setShowCreditModal(true);
                  }}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition"
                >
                  Deposit Credits
                </button>

                {record.activeCreditBalance >= 40 && (
                  <button
                    onClick={() => {
                      setSelectedRecord(record);
                      setRedeemTier(mees.highestCredential || 'UG_CERTIFICATE');
                      setShowRedeemModal(true);
                    }}
                    className="py-1.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded text-xs font-medium transition"
                  >
                    Redeem Credential
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Register New Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100">Register APAAR ID & ABC Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-sm">
              <div>
                <label className="text-slate-400 text-xs">Student Roll Number</label>
                <input
                  type="text"
                  required
                  value={newRoll}
                  onChange={e => setNewRoll(e.target.value)}
                  placeholder="2024-BTECH-CS-109"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1 uppercase"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Karthik Venkatesh"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs">12-Digit APAAR ID (One Nation One Student ID)</label>
                <input
                  type="text"
                  required
                  value={newApaar}
                  onChange={e => setNewApaar(e.target.value)}
                  placeholder="9821-4401-8923"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs">Academic Program</label>
                <input
                  type="text"
                  required
                  value={newProgram}
                  onChange={e => setNewProgram(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="text-slate-400 text-xs">Admission Year</label>
                  <input
                    type="number"
                    required
                    value={newAdmYear}
                    onChange={e => setNewAdmYear(Number(e.target.value))}
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Credits Modal */}
      {showCreditModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Deposit Course Credits</h3>
                <p className="text-xs text-slate-400">{selectedRecord.studentName} ({selectedRecord.apaarId})</p>
              </div>
              <button onClick={() => setShowCreditModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleAddCredit} className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Course Code</label>
                  <input
                    type="text"
                    required
                    value={courseCode}
                    onChange={e => setCourseCode(e.target.value)}
                    placeholder="CS501"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1 uppercase"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Credits Earned</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={courseCredits}
                    onChange={e => setCourseCredits(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs">Course Title</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={e => setCourseTitle(e.target.value)}
                  placeholder="Cloud Computing & Distributed Systems"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Semester</label>
                  <input
                    type="number"
                    value={courseSem}
                    onChange={e => setCourseSem(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Grade</label>
                  <select
                    value={courseGrade}
                    onChange={e => setCourseGrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  >
                    <option value="O">O (Outstanding)</option>
                    <option value="A+">A+ (Excellent)</option>
                    <option value="A">A (Very Good)</option>
                    <option value="B+">B+ (Good)</option>
                    <option value="B">B (Above Average)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Academic Year</label>
                  <input
                    type="text"
                    value={courseYear}
                    onChange={e => setCourseYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="extCheck"
                  checked={isExternal}
                  onChange={e => setIsExternal(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-indigo-600"
                />
                <label htmlFor="extCheck" className="text-xs text-slate-300">
                  External Transfer (SWAYAM / NPTEL / Other University)
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreditModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                >
                  Deposit to Bank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Redeem Credits Modal */}
      {showRedeemModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Redeem Credits for NEP Exit Award</h3>
                <p className="text-xs text-slate-400">{selectedRecord.studentName}</p>
              </div>
              <button onClick={() => setShowRedeemModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleRedeem} className="space-y-3 text-sm">
              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Bank Balance:</span>
                  <span className="font-bold text-indigo-400">{selectedRecord.activeCreditBalance} Credits</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs">Target Multiple Entry/Exit Credential</label>
                <select
                  value={redeemTier}
                  onChange={e => setRedeemTier(e.target.value as MeesCredentialTier)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                >
                  <option value="UG_CERTIFICATE">Undergraduate Certificate (40 Credits)</option>
                  <option value="UG_DIPLOMA">Undergraduate Diploma (80 Credits)</option>
                  <option value="BACHELORS_DEGREE">Bachelor's Degree (120 Credits)</option>
                  <option value="BACHELORS_HONOURS">Bachelor's Degree with Honours / Research (160 Credits)</option>
                </select>
              </div>

              <div className="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded text-xs text-indigo-300">
                <p className="font-semibold">Statutory Award Verification:</p>
                <p className="text-[11px] text-indigo-400/80 mt-0.5">
                  Conferring {redeemTier.replace(/_/g, ' ')} will redeem {NEP_CREDIT_THRESHOLDS[redeemTier]} credits from the scholar's bank and seal the award in Digilocker NAD.
                </p>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRedeemModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                >
                  Authorize & Issue Award
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
                <p className="text-xs text-slate-400 font-mono">{selectedRecord.abcRecordId}</p>
              </div>
              <button onClick={() => setShowSealModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 block">SHA-256 Ledger Audit Seal</span>
                <span className="font-mono text-emerald-400 break-all">{selectedRecord.auditSha256}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Roll No:</span>
                  <span className="text-slate-200 font-mono">{selectedRecord.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">APAAR ID:</span>
                  <span className="text-slate-200 font-mono">{selectedRecord.apaarId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Accumulated Credits:</span>
                  <span className="text-slate-200 font-semibold">{selectedRecord.totalCreditsAccumulated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Redeemed Credits:</span>
                  <span className="text-slate-200 font-semibold">{selectedRecord.totalCreditsRedeemed}</span>
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
