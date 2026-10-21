'use client';

import React, { useState, useMemo } from 'react';
import {
  IncubationStage,
  IpStatus,
  TtoStartup,
  getAllStartups,
  registerTtoStartup,
  advanceIncubationStage,
  logRoyaltyRevenue,
  validateNispEquity,
  validateFacultyTimeCommitment,
  calculateRoyaltyDistribution,
  exportTtoStartupsCSV,
} from '@/lib/teacher/ttoIncubation';

export default function TtoIncubationStudio() {
  const [startups, setStartups] = useState<TtoStartup[]>(() => getAllStartups());
  const [selectedStage, setSelectedStage] = useState<IncubationStage | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isDiscloseModalOpen, setIsDiscloseModalOpen] = useState(false);
  const [stageModalStartup, setStageModalStartup] = useState<TtoStartup | null>(null);
  const [royaltyModalStartup, setRoyaltyModalStartup] = useState<TtoStartup | null>(null);
  const [sealModalStartup, setSealModalStartup] = useState<TtoStartup | null>(null);

  // New Startup Form State
  const [ventureName, setVentureName] = useState('');
  const [facultyLead, setFacultyLead] = useState('Prof. Anita Deshmukh');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [coFounders, setCoFounders] = useState('');
  const [patentNumber, setPatentNumber] = useState('');
  const [ipStatus, setIpStatus] = useState<IpStatus>('PROVISIONAL_PATENT');
  const [equityPercent, setEquityPercent] = useState<number>(5.0);
  const [weeklyHours, setWeeklyHours] = useState<number>(6.0);
  const [seedGrant, setSeedGrant] = useState<number>(1500000);
  const [summary, setSummary] = useState('');

  // Advance Stage Form State
  const [targetStage, setTargetStage] = useState<IncubationStage>('PROTOTYPE_VALIDATED');
  const [targetTrl, setTargetTrl] = useState<number>(6);

  // Royalty Form State
  const [royaltyInput, setRoyaltyInput] = useState<number>(500000);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Startups
  const filteredStartups = useMemo(() => {
    return startups.filter((item) => {
      const matchStage = selectedStage === 'ALL' || item.stage === selectedStage;
      const matchQuery =
        searchQuery.trim() === '' ||
        item.ventureName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.startupCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.facultyLeadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStage && matchQuery;
    });
  }, [startups, selectedStage, searchQuery]);

  // Telemetry Aggregates
  const stats = useMemo(() => {
    const totalVentures = startups.length;
    const totalSeed = startups.reduce((acc, s) => acc + s.seedGrantSanctionedInr, 0);
    const totalRaised = startups.reduce((acc, s) => acc + s.externalFundingRaisedInr, 0);
    const totalRoyalty = startups.reduce((acc, s) => acc + s.totalRoyaltyRevenueInr, 0);
    const avgEquity =
      totalVentures > 0
        ? (startups.reduce((acc, s) => acc + s.institutionEquityPercent, 0) / totalVentures).toFixed(1)
        : '0.0';

    return { totalVentures, totalSeed, totalRaised, totalRoyalty, avgEquity };
  }, [startups]);

  const handleExportCSV = () => {
    const csvContent = exportTtoStartupsCSV(filteredStartups);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NISP_Faculty_Startups_Portfolio_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('NISP & TTO Incubator Portfolio CSV exported successfully.');
  };

  const handleDiscloseStartup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ventureName.trim() || !facultyLead.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    if (!validateNispEquity(equityPercent)) {
      alert('Statutory NISP 2019 Violation: University equity must be between 2.0% and 9.5%.');
      return;
    }

    if (!validateFacultyTimeCommitment(weeklyHours)) {
      alert('AICTE Code of Conduct Violation: Faculty weekly commitment cannot exceed 20% (8.0 hours/week).');
      return;
    }

    const coFoundersList = coFounders
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const created = registerTtoStartup({
      ventureName: ventureName.trim(),
      facultyLeadName: facultyLead.trim(),
      facultyEmployeeId: `FAC-${Date.now().toString().slice(-3)}`,
      department: department.trim(),
      studentCoFounders: coFoundersList.length > 0 ? coFoundersList : ['Graduate Research Fellow'],
      stage: 'INCUBATED_IN_PARK',
      techReadinessLevel: 4,
      ipPatentAppNumber: patentNumber.trim() || undefined,
      ipStatus,
      institutionEquityPercent: Number(equityPercent),
      facultyWeeklyTimeHours: Number(weeklyHours),
      seedGrantSanctionedInr: Number(seedGrant),
      externalFundingRaisedInr: 0,
      totalRoyaltyRevenueInr: 0,
      registeredDate: new Date().toISOString().split('T')[0],
      summary: summary.trim() || 'Invention disclosure admitted to Technology Business Incubator.',
    });

    setStartups(getAllStartups());
    setIsDiscloseModalOpen(false);
    // Reset form
    setVentureName('');
    setCoFounders('');
    setPatentNumber('');
    setSummary('');
    showToast(`Startup ${created.startupCode} (${created.ventureName}) successfully registered.`);
  };

  const handleOpenAdvanceStage = (startup: TtoStartup) => {
    setStageModalStartup(startup);
    setTargetStage(startup.stage);
    setTargetTrl(startup.techReadinessLevel);
  };

  const handleSubmitAdvanceStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageModalStartup) return;

    advanceIncubationStage(stageModalStartup.id, targetStage, Number(targetTrl));
    setStartups(getAllStartups());
    setStageModalStartup(null);
    showToast(`Incubation stage updated to ${targetStage} (TRL ${targetTrl}).`);
  };

  const handleOpenRoyalty = (startup: TtoStartup) => {
    setRoyaltyModalStartup(startup);
    setRoyaltyInput(500000);
  };

  const handleSubmitRoyalty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!royaltyModalStartup) return;

    logRoyaltyRevenue(royaltyModalStartup.id, Number(royaltyInput));
    setStartups(getAllStartups());
    setRoyaltyModalStartup(null);
    showToast(`Royalty of ₹${Number(royaltyInput).toLocaleString()} logged with 70/30 NISP distribution.`);
  };

  const liveRoyaltySplit = useMemo(() => {
    return calculateRoyaltyDistribution(royaltyInput || 0);
  }, [royaltyInput]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl border border-emerald-400 flex items-center space-x-2 animate-bounce">
          <svg className="w-5 h-5 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-950/70 rounded-lg border border-emerald-700/60 text-emerald-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Faculty Innovation & Technology Transfer Office (TTO) Studio
              </h1>
              <p className="text-sm text-slate-400">
                National Innovation & Start-up Policy (NISP 2019), Incubator Equity Governance & Patent Royalty Commercialization
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold rounded-lg flex items-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export NISP CSV</span>
          </button>
          <button
            onClick={() => setIsDiscloseModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Disclose Faculty Startup</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Incubated Ventures</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.totalVentures}</h3>
            <p className="text-xs text-emerald-400 mt-1">NISP 2019 Certified</p>
          </div>
          <div className="w-12 h-12 bg-indigo-950/60 border border-indigo-800/60 rounded-xl flex items-center justify-center text-indigo-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Seed Grants Disbursed</p>
            <h3 className="text-2xl font-bold text-sky-400 mt-1">₹{(stats.totalSeed / 100000).toFixed(1)} Lakhs</h3>
            <p className="text-xs text-slate-500 mt-1">₹{(stats.totalRaised / 10000000).toFixed(2)} Cr VC Co-funding</p>
          </div>
          <div className="w-12 h-12 bg-sky-950/60 border border-sky-800/60 rounded-xl flex items-center justify-center text-sky-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Commercial Royalty</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">₹{(stats.totalRoyalty / 100000).toFixed(1)} Lakhs</h3>
            <p className="text-xs text-slate-400 mt-1">70% Faculty / 30% Uni Split</p>
          </div>
          <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-center justify-center text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg University Equity</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">{stats.avgEquity}%</h3>
            <p className="text-xs text-slate-500 mt-1">Cap: 2.0% - 9.5% (NISP)</p>
          </div>
          <div className="w-12 h-12 bg-purple-950/60 border border-purple-800/60 rounded-xl flex items-center justify-center text-purple-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedStage('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedStage === 'ALL'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            All Ventures ({startups.length})
          </button>
          <button
            onClick={() => setSelectedStage('INCUBATED_IN_PARK')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedStage === 'INCUBATED_IN_PARK'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Incubated in Park
          </button>
          <button
            onClick={() => setSelectedStage('PROTOTYPE_VALIDATED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedStage === 'PROTOTYPE_VALIDATED'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Prototype Validated (TRL 5-7)
          </button>
          <button
            onClick={() => setSelectedStage('SPINOFF_INCORPORATED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedStage === 'SPINOFF_INCORPORATED'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Spinoff Incorporated
          </button>
          <button
            onClick={() => setSelectedStage('COMMERCIALIZED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedStage === 'COMMERCIALIZED'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Commercialized & Royalties
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search venture, faculty lead, patent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Startups Portfolio Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredStartups.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
            No faculty startups found matching the selected filter.
          </div>
        ) : (
          filteredStartups.map((stu) => {
            return (
              <div
                key={stu.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg hover:border-slate-700 transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                        {stu.startupCode}
                      </span>
                      {stu.stage === 'COMMERCIALIZED' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-700 text-emerald-300">
                          COMMERCIALIZED
                        </span>
                      )}
                      {stu.stage === 'SPINOFF_INCORPORATED' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 border border-indigo-700 text-indigo-300">
                          SPINOFF INCORPORATED
                        </span>
                      )}
                      {stu.stage === 'PROTOTYPE_VALIDATED' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 border border-sky-700 text-sky-300">
                          PROTOTYPE VALIDATED
                        </span>
                      )}
                      {stu.stage === 'INCUBATED_IN_PARK' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 border border-amber-700 text-amber-300">
                          INCUBATED IN PARK
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5">{stu.ventureName}</h3>
                    <p className="text-xs text-slate-400">
                      Lead: <strong className="text-slate-200">{stu.facultyLeadName}</strong> ({stu.department})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-purple-300 font-bold bg-purple-950/80 border border-purple-800 px-2 py-0.5 rounded block">
                      {stu.institutionEquityPercent.toFixed(1)}% Uni Equity
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {stu.facultyWeeklyTimeHours}h / wk commitment
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-300 line-clamp-2">{stu.summary}</p>

                {/* TRL Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Technology Readiness Level (TRL)</span>
                    <span className="font-bold text-slate-200">TRL {stu.techReadinessLevel} / 9</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stu.techReadinessLevel >= 8
                          ? 'bg-emerald-500'
                          : stu.techReadinessLevel >= 5
                          ? 'bg-sky-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${(stu.techReadinessLevel / 9) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Co-Founders & IP status */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Student Co-Founders</span>
                    <span className="text-slate-300 font-medium text-[11px] line-clamp-1">
                      {stu.studentCoFounders.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Patent / IP Protection</span>
                    <span className="text-indigo-300 font-medium text-[11px] font-mono">
                      {stu.ipPatentAppNumber ? `${stu.ipPatentAppNumber} (${stu.ipStatus.replace('_', ' ')})` : stu.ipStatus}
                    </span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-950/90 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Seed Sanctioned</span>
                    <span className="font-bold text-sky-400">₹{(stu.seedGrantSanctionedInr / 100000).toFixed(1)} L</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">External Raised</span>
                    <span className="font-bold text-white">₹{(stu.externalFundingRaisedInr / 100000).toFixed(1)} L</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Royalty Revenue</span>
                    <span className="font-bold text-emerald-400">₹{(stu.totalRoyaltyRevenueInr / 100000).toFixed(1)} L</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/80 text-xs">
                  <button
                    onClick={() => handleOpenAdvanceStage(stu)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white rounded border border-slate-700 font-medium transition-colors"
                  >
                    Advance Stage
                  </button>
                  <button
                    onClick={() => handleOpenRoyalty(stu)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white rounded border border-slate-700 font-medium transition-colors"
                  >
                    Log Royalty (70/30)
                  </button>
                  {stu.cryptographicIpSeal && (
                    <button
                      onClick={() => setSealModalStartup(stu)}
                      className="px-2.5 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 rounded font-medium transition-colors"
                    >
                      IP Seal
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Disclose New Faculty Startup */}
      {isDiscloseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Disclose Faculty Startup (NISP 2019)</span>
              </h3>
              <button
                onClick={() => setIsDiscloseModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleDiscloseStartup} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Venture Name / Commercial Entity</label>
                <input
                  type="text"
                  placeholder="e.g. AeroOptix Photonics Labs"
                  value={ventureName}
                  onChange={(e) => setVentureName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Faculty Lead / Inventor</label>
                  <input
                    type="text"
                    value={facultyLead}
                    onChange={(e) => setFacultyLead(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Host Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Student / Scholar Co-Founders (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Aarohi Shenoy (B.Tech), Rohan Iyer (M.Tech)"
                  value={coFounders}
                  onChange={(e) => setCoFounders(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Patent Application No.</label>
                  <input
                    type="text"
                    placeholder="e.g. 202611094821A"
                    value={patentNumber}
                    onChange={(e) => setPatentNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">IP Protection Status</label>
                  <select
                    value={ipStatus}
                    onChange={(e) => setIpStatus(e.target.value as IpStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="PROVISIONAL_PATENT">Provisional Patent</option>
                    <option value="PUBLISHED_PATENT">Published Patent</option>
                    <option value="GRANTED_PATENT">Granted Patent</option>
                    <option value="TRADE_SECRET">Trade Secret</option>
                    <option value="COPYRIGHT">Copyright</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-purple-400 font-semibold mb-1">University Equity (2-9.5%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="2.0"
                    max="9.5"
                    value={equityPercent}
                    onChange={(e) => setEquityPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-purple-800/80 rounded px-2.5 py-1.5 text-purple-300 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Weekly Effort (Max 8h)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1.0"
                    max="8.0"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sky-400 font-semibold mb-1">Seed Grant (INR)</label>
                  <input
                    type="number"
                    step="50000"
                    value={seedGrant}
                    onChange={(e) => setSeedGrant(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-sky-800/80 rounded px-2.5 py-1.5 text-sky-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Invention & Commercialization Summary</label>
                <textarea
                  rows={2}
                  placeholder="Problem solved, market opportunity, and TTO support required..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                />
              </div>

              <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded text-[11px] text-emerald-300">
                <span>Compliance Note: Under NISP 2019, faculty inventors retain full IP inventorship while granting non-predatory university equity (max 9.5%).</span>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDiscloseModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold"
                >
                  Register & Seal Venture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Advance Stage */}
      {stageModalStartup && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Advance Incubation Stage</h3>
                <p className="text-xs text-emerald-400 font-mono mt-0.5">{stageModalStartup.startupCode}</p>
              </div>
              <button
                onClick={() => setStageModalStartup(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitAdvanceStage} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Incubation Stage</label>
                <select
                  value={targetStage}
                  onChange={(e) => setTargetStage(e.target.value as IncubationStage)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                >
                  <option value="IDEA_DISCLOSURE">Idea Disclosure</option>
                  <option value="TTO_EVALUATION">TTO Evaluation</option>
                  <option value="INCUBATED_IN_PARK">Incubated in Park</option>
                  <option value="PROTOTYPE_VALIDATED">Prototype Validated</option>
                  <option value="SPINOFF_INCORPORATED">Spinoff Incorporated</option>
                  <option value="COMMERCIALIZED">Commercialized</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Technology Readiness Level (TRL 1-9)</label>
                <input
                  type="number"
                  min="1"
                  max="9"
                  value={targetTrl}
                  onChange={(e) => setTargetTrl(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-bold"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStageModalStartup(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-semibold"
                >
                  Update Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Royalty */}
      {royaltyModalStartup && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Log Commercial Royalty Revenue</h3>
                <p className="text-xs text-emerald-400 font-mono mt-0.5">{royaltyModalStartup.ventureName}</p>
              </div>
              <button
                onClick={() => setRoyaltyModalStartup(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitRoyalty} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Gross Commercial License / Royalty (INR)</label>
                <input
                  type="number"
                  step="10000"
                  value={royaltyInput}
                  onChange={(e) => setRoyaltyInput(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-emerald-800 rounded px-2.5 py-1.5 text-emerald-300 font-bold text-sm"
                  required
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Faculty Innovator Share (70%):</span>
                  <span className="font-bold text-emerald-400">₹{liveRoyaltySplit.facultyShare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Host Department Research Fund (15%):</span>
                  <span className="font-bold text-sky-400">₹{liveRoyaltySplit.departmentShare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">University Central Incubator Pool (15%):</span>
                  <span className="font-bold text-purple-400">₹{liveRoyaltySplit.centralPoolShare.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Total University TTO Share (30%):</span>
                  <span className="font-bold text-white">₹{liveRoyaltySplit.universityShare.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRoyaltyModalStartup(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold"
                >
                  Disburse Royalty Split
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cryptographic IP Seal */}
      {sealModalStartup && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">📜</span>
                <h3 className="text-base font-bold text-white">NISP Intellectual Property Cryptographic Seal</h3>
              </div>
              <button
                onClick={() => setSealModalStartup(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Startup Code</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{sealModalStartup.startupCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Venture Name</span>
                <span className="text-slate-200 font-medium">{sealModalStartup.ventureName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Faculty Inventor & Department</span>
                <span className="text-slate-300 font-medium">{sealModalStartup.facultyLeadName} ({sealModalStartup.department})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">University Equity Covenant</span>
                <span className="text-purple-300 font-semibold">{sealModalStartup.institutionEquityPercent.toFixed(1)}% (NISP 2019 Compliant)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">SHA-256 Tamper-Proof IP Seal</span>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-emerald-300 break-all">
                  {sealModalStartup.cryptographicIpSeal}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSealModalStartup(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold"
              >
                Close Seal Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
