'use client';

import React, { useState } from 'react';
import {
  StartupIncubationStage,
  IncubatedStartupRecord,
  MIN_UNIVERSITY_EQUITY_PERCENT,
  MAX_UNIVERSITY_EQUITY_PERCENT,
  MAX_SEED_GRANT_INR,
  registerIncubatedStartup,
  recordRocIncorporation,
  sanctionSeedGrant,
  disburseSeedTranche,
  exportStartupIncubationCSV,
  SAMPLE_STARTUPS,
} from '@/lib/teacher/facultyStartupIncubation';

export default function FacultyStartupIncubationStudio() {
  const [startups, setStartups] = useState<IncubatedStartupRecord[]>(SAMPLE_STARTUPS);
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStartup, setSelectedStartup] = useState<IncubatedStartupRecord | null>(null);

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showRocModal, setShowRocModal] = useState(false);
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [actionStartup, setActionStartup] = useState<IncubatedStartupRecord | null>(null);

  // Register Form State
  const [name, setName] = useState('NeuralEdge Vision AI Labs');
  const [domain, setDomain] = useState('Edge Computing & Computer Vision');
  const [founderName, setFounderName] = useState('Aditya Roy');
  const [founderRoll, setFounderRoll] = useState('2023CSB045');
  const [mentorName, setMentorName] = useState('Dr. Siddharth Sen');
  const [mentorId, setMentorId] = useState('FAC-CS-2016-092');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [facultyTime, setFacultyTime] = useState<number>(15);
  const [registerError, setRegisterError] = useState('');

  // ROC Incorporation Form State
  const [cinNumber, setCinNumber] = useState('U72900DL2026PTC219483');
  const [incorpDate, setIncorpDate] = useState('2026-02-18');
  const [equityStake, setEquityStake] = useState<number>(5.0);
  const [rocError, setRocError] = useState('');

  // Seed Grant Form State
  const [seedAmount, setSeedAmount] = useState<number>(600000);
  const [seedError, setSeedError] = useState('');

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // KPIs
  const totalStartups = startups.length;
  const incorporatedCount = startups.filter(s => !!s.rocCinOrLlpin).length;
  const totalSanctionedSeedInr = startups.reduce((acc, s) => acc + s.totalSanctionedSeedFundInr, 0);
  const totalDisbursedSeedInr = startups.reduce((acc, s) => acc + s.totalDisbursedSeedFundInr, 0);
  const avgEquityStake =
    incorporatedCount > 0
      ? (startups.filter(s => !!s.rocCinOrLlpin).reduce((acc, s) => acc + s.universityEquityStakePercent, 0) / incorporatedCount).toFixed(1)
      : '0.0';

  // Filtered List
  const filteredStartups = startups.filter(s => {
    const matchesStage = selectedStage === 'ALL' || s.incubationStage === selectedStage;
    const matchesSearch =
      s.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.founderStudentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.facultyMentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.primaryDomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.startupRecordId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  // Handlers
  const handleRegisterStartup = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    try {
      const created = registerIncubatedStartup({
        startupName: name,
        primaryDomain: domain,
        founderStudentName: founderName,
        founderStudentRoll: founderRoll,
        facultyMentorName: mentorName,
        facultyMentorEmpId: mentorId,
        department,
        facultyTimeCommitmentPercent: facultyTime,
      });

      setStartups([created, ...startups]);
      setShowRegisterModal(false);
      notify(`Venture "${created.startupName}" inducted into university pre-incubation!`);
    } catch (err: any) {
      setRegisterError(err.message || 'Failed to register startup');
    }
  };

  const handleOpenRocModal = (startup: IncubatedStartupRecord) => {
    setActionStartup(startup);
    setRocError('');
    setShowRocModal(true);
  };

  const handleRecordRoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionStartup) return;
    setRocError('');

    try {
      const updated = recordRocIncorporation(actionStartup, {
        rocCinOrLlpin: cinNumber,
        incorporationDate: incorpDate,
        universityEquityStakePercent: equityStake,
      });

      setStartups(startups.map(s => (s.startupRecordId === updated.startupRecordId ? updated : s)));
      if (selectedStartup?.startupRecordId === updated.startupRecordId) {
        setSelectedStartup(updated);
      }
      setShowRocModal(false);
      notify(`ROC Incorporation certified for ${updated.startupName}. Assigned ${updated.universityEquityStakePercent}% University Equity.`);
    } catch (err: any) {
      setRocError(err.message || 'Failed to record ROC incorporation');
    }
  };

  const handleOpenSeedModal = (startup: IncubatedStartupRecord) => {
    setActionStartup(startup);
    setSeedError('');
    setShowSeedModal(true);
  };

  const handleSanctionSeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionStartup) return;
    setSeedError('');

    try {
      const updated = sanctionSeedGrant(actionStartup, seedAmount);
      setStartups(startups.map(s => (s.startupRecordId === updated.startupRecordId ? updated : s)));
      if (selectedStartup?.startupRecordId === updated.startupRecordId) {
        setSelectedStartup(updated);
      }
      setShowSeedModal(false);
      notify(`Sanctioned ₹${seedAmount.toLocaleString('en-IN')} NISP/DST Seed Grant in 3 milestone tranches.`);
    } catch (err: any) {
      setSeedError(err.message || 'Failed to sanction seed grant');
    }
  };

  const handleDisburseTranche = (startup: IncubatedStartupRecord, trancheNum: 1 | 2 | 3) => {
    const res = disburseSeedTranche(startup, trancheNum);
    if (!res.success) {
      notify(res.error || 'Failed to disburse tranche', 'error');
      return;
    }

    setStartups(startups.map(s => (s.startupRecordId === res.record.startupRecordId ? res.record : s)));
    if (selectedStartup?.startupRecordId === res.record.startupRecordId) {
      setSelectedStartup(res.record);
    }
    notify(`Tranche ${trancheNum} disbursed successfully for ${startup.startupName}!`);
  };

  const handleExportCSV = () => {
    const csv = exportStartupIncubationCSV(startups);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `incubated_startups_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Official University Incubated Start-Up Ledger CSV exported.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      {/* Toast Notification */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Faculty Student Start-Up Incubation & Innovation Studio
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                National Innovation & Start-up Policy (NISP 2019) • 2.0% to 9.5% University Equity Cap • ₹10L Seed Fund Tranches • MoE IIC Framework
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Startups CSV
          </button>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Induct New Start-Up
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Incubated Startups</p>
          <p className="text-2xl font-bold text-white mt-1">{totalStartups}</p>
          <span className="text-[11px] text-violet-400 mt-1 block">Student & Faculty Ventures</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">ROC Incorporated</p>
          <p className="text-2xl font-bold text-emerald-300 mt-1">{incorporatedCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">CIN / LLPIN Certified</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">Sanctioned Seed Fund</p>
          <p className="text-2xl font-bold text-amber-300 mt-1">₹{totalSanctionedSeedInr.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">DST / NISP Innovation Capital</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-cyan-400 uppercase tracking-wider">Disbursed Seed Grants</p>
          <p className="text-2xl font-bold text-cyan-300 mt-1">₹{totalDisbursedSeedInr.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Milestone Tranches Released</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider">Avg University Equity</p>
          <p className="text-2xl font-bold text-indigo-300 mt-1">{avgEquityStake}%</p>
          <span className="text-[11px] text-slate-500 mt-1 block">2% - 9.5% NISP Cap</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-purple-400 uppercase tracking-wider">Faculty Time Norm</p>
          <p className="text-2xl font-bold text-purple-300 mt-1">≤20%</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Permitted Startup Mentorship</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center overflow-x-auto gap-2 border border-slate-800 rounded-lg p-1 bg-slate-900/40">
          {[
            { id: 'ALL', label: 'All Ventures' },
            { id: 'IDEATION_PRE_INCUBATION', label: 'Ideation / Pre-Incubation' },
            { id: 'STARTUP_INCORPORATED_ROC', label: 'ROC Incorporated' },
            { id: 'SEED_FUNDED_SCALING', label: 'Seed Funded' },
            { id: 'GRADUATED_EXIT', label: 'Graduated' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStage(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
                selectedStage === tab.id
                  ? 'bg-violet-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search venture, founder, mentor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
          <svg className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Startups Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Venture Name & Token</th>
                <th className="py-3 px-4">Primary Domain</th>
                <th className="py-3 px-4">Student Founder</th>
                <th className="py-3 px-4">Faculty Mentor</th>
                <th className="py-3 px-4 text-center">University Equity</th>
                <th className="py-3 px-4 text-right">Seed Fund Disbursed</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredStartups.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No incubated startups match the criteria.
                  </td>
                </tr>
              ) : (
                filteredStartups.map(s => {
                  const hasRoc = !!s.rocCinOrLlpin;
                  const hasSeed = s.totalSanctionedSeedFundInr > 0;
                  return (
                    <tr key={s.startupRecordId} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{s.startupName}</div>
                        <div className="text-[11px] font-mono text-violet-400">{s.startupRecordId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-200">{s.primaryDomain}</span>
                        <div className="text-[10px] text-slate-500">{s.department}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{s.founderStudentName}</div>
                        <div className="text-[10px] font-mono text-slate-500">{s.founderStudentRoll}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-300">{s.facultyMentorName}</div>
                        <div className="text-[10px] text-slate-500">{s.facultyTimeCommitmentPercent}% time</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {hasRoc ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {s.universityEquityStakePercent}% Stake
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Pre-ROC</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {hasSeed ? (
                          <div>
                            <span className="font-bold text-amber-300">₹{s.totalDisbursedSeedFundInr.toLocaleString('en-IN')}</span>
                            <div className="text-[10px] text-slate-500">of ₹{s.totalSanctionedSeedFundInr.toLocaleString('en-IN')}</div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-600 italic">No Grant</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            s.incubationStage === 'SEED_FUNDED_SCALING'
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                              : s.incubationStage === 'STARTUP_INCORPORATED_ROC'
                              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {s.incubationStage.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!hasRoc && (
                            <button
                              onClick={() => handleOpenRocModal(s)}
                              title="Record ROC Incorporation & Assign Equity"
                              className="p-1.5 rounded-md hover:bg-slate-800 text-indigo-400 border border-slate-800 transition"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </button>
                          )}
                          {!hasSeed && (
                            <button
                              onClick={() => handleOpenSeedModal(s)}
                              title="Sanction NISP Seed Grant"
                              className="p-1.5 rounded-md hover:bg-slate-800 text-amber-400 border border-slate-800 transition"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedStartup(s)}
                            title="View Venture Dossier & Audit Seal"
                            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Startup Detail Modal */}
      {selectedStartup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono text-violet-400">{selectedStartup.startupRecordId}</span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedStartup.startupName}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Domain: <span className="text-slate-200">{selectedStartup.primaryDomain}</span> • Founder:{' '}
                  <span className="text-slate-200">{selectedStartup.founderStudentName}</span> • Mentor:{' '}
                  <span className="text-slate-200">{selectedStartup.facultyMentorName}</span>
                </p>
              </div>
              <button onClick={() => setSelectedStartup(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase">ROC Registration</span>
                <p className="text-xs font-mono text-cyan-300 mt-1">{selectedStartup.rocCinOrLlpin || 'UNINCORPORATED'}</p>
                <p className="text-[10px] text-slate-500 mt-1">MCA Companies Act 2013</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase">University Equity</span>
                <p className="text-2xl font-bold text-indigo-300 mt-1">{selectedStartup.universityEquityStakePercent}%</p>
                <p className="text-[11px] text-slate-500 mt-1">NISP Cap: 9.5% Max</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase">Faculty Mentorship</span>
                <p className="text-2xl font-bold text-violet-300 mt-1">{selectedStartup.facultyTimeCommitmentPercent}% Time</p>
                <p className="text-[11px] text-slate-500 mt-1">NISP Max: 20%</p>
              </div>
            </div>

            {/* Seed Grant Tranches */}
            {selectedStartup.totalSanctionedSeedFundInr > 0 && (
              <div className="border border-slate-800 rounded-xl overflow-hidden mb-6">
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200 uppercase">
                    DST / NISP Innovation Seed Grant Tranches (30 / 40 / 30)
                  </h3>
                  <span className="text-[11px] text-amber-300 font-bold">
                    Disbursed: ₹{selectedStartup.totalDisbursedSeedFundInr.toLocaleString('en-IN')} / ₹
                    {selectedStartup.totalSanctionedSeedFundInr.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="divide-y divide-slate-800/60 p-2 bg-slate-900/60">
                  {selectedStartup.seedTranches.map(t => (
                    <div key={t.trancheNumber} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            Tranche {t.trancheNumber} ({t.tranchePercent}%) — ₹{t.amountInr.toLocaleString('en-IN')}
                          </span>
                          {t.isDisbursed && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              CLEARED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{t.milestoneDescription}</p>
                      </div>
                      <div>
                        {!t.isDisbursed ? (
                          <button
                            onClick={() => handleDisburseTranche(selectedStartup, t.trancheNumber)}
                            className="px-3 py-1 text-xs font-bold rounded bg-amber-500 hover:bg-amber-400 text-slate-950 transition"
                          >
                            Disburse
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500">{t.payoutReference}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
              <span className="text-[10px] text-slate-400 uppercase">Cryptographic Audit Seal</span>
              <p className="text-xs font-mono text-emerald-400 break-all mt-1">{selectedStartup.auditSha256}</p>
              <p className="text-[10px] text-slate-500 mt-1">SHA-256 Tamper-Proof Audit Token</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedStartup(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register Startup */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h2 className="text-lg font-bold text-white">Induct New Venture into Pre-Incubation</h2>
              <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {registerError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200">
                {registerError}
              </div>
            )}

            <form onSubmit={handleRegisterStartup} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Startup / Venture Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Primary Tech Domain *</label>
                  <input
                    type="text"
                    required
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Student Founder Name *</label>
                  <input
                    type="text"
                    required
                    value={founderName}
                    onChange={e => setFounderName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Student Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={founderRoll}
                    onChange={e => setFounderRoll(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Faculty Mentor Name *</label>
                  <input
                    type="text"
                    required
                    value={mentorName}
                    onChange={e => setMentorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Faculty Mentor Employee ID *</label>
                  <input
                    type="text"
                    required
                    value={mentorId}
                    onChange={e => setMentorId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Faculty Time Commitment (Max 20%) *</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={facultyTime}
                    onChange={e => setFacultyTime(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                  <span className="text-[10px] text-slate-500">NISP 2019 statutory ceiling: 20%</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold transition"
                >
                  Induct Startup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: ROC Incorporation */}
      {showRocModal && actionStartup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Certify ROC Incorporation</h2>
                <p className="text-xs text-slate-400 mt-0.5">{actionStartup.startupName}</p>
              </div>
              <button onClick={() => setShowRocModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {rocError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200">
                {rocError}
              </div>
            )}

            <form onSubmit={handleRecordRoc} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">MCA Corporate Identification Number (CIN / LLPIN) *</label>
                <input
                  type="text"
                  required
                  value={cinNumber}
                  onChange={e => setCinNumber(e.target.value.toUpperCase())}
                  placeholder="U72900DL2026PTC219483"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Date of Incorporation *</label>
                <input
                  type="date"
                  required
                  value={incorpDate}
                  onChange={e => setIncorpDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">University Incubation Center Equity Stake (2.0% - 9.5%) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="2.0"
                  max="9.5"
                  required
                  value={equityStake}
                  onChange={e => setEquityStake(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500">NISP 2019 guideline limits: 2.0% to 9.5%</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRocModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold transition"
                >
                  Certify & Assign Stake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Sanction Seed Grant */}
      {showSeedModal && actionStartup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Sanction NISP / DST Seed Fund Grant</h2>
                <p className="text-xs text-slate-400 mt-0.5">{actionStartup.startupName}</p>
              </div>
              <button onClick={() => setShowSeedModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {seedError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200">
                {seedError}
              </div>
            )}

            <form onSubmit={handleSanctionSeed} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Total Seed Grant (Max ₹10,00,000) *</label>
                <input
                  type="number"
                  min="50000"
                  max="1000000"
                  step="25000"
                  required
                  value={seedAmount}
                  onChange={e => setSeedAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Tranche Preview */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Tranche Breakdown Preview (30 / 40 / 30):</span>
                <div className="flex justify-between text-slate-300 text-[11px]">
                  <span>Tranche 1 (30% - Prototype):</span>
                  <span className="font-bold text-amber-300">₹{Math.round(seedAmount * 0.3).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-300 text-[11px]">
                  <span>Tranche 2 (40% - MVP Pilot):</span>
                  <span className="font-bold text-amber-300">₹{Math.round(seedAmount * 0.4).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-300 text-[11px]">
                  <span>Tranche 3 (30% - Traction):</span>
                  <span className="font-bold text-amber-300">₹{(seedAmount - Math.round(seedAmount * 0.3) - Math.round(seedAmount * 0.4)).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSeedModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
                >
                  Sanction Seed Fund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
