'use client';

import React, { useState, useMemo } from 'react';
import {
  StatutoryBody,
  ResolutionCategory,
  AtrStatus,
  BogResolution,
  GovernanceMeeting,
  getAllMeetings,
  getAllResolutions,
  registerGovernanceResolution,
  recordResolutionVoting,
  updateResolutionAtr,
  exportBogResolutionsCSV,
  isAtrOverdue,
} from '@/lib/admin/bogGovernance';

export default function BogGovernanceManager() {
  const [meetings] = useState<GovernanceMeeting[]>(() => getAllMeetings());
  const [resolutions, setResolutions] = useState<BogResolution[]>(() => getAllResolutions());
  const [selectedBody, setSelectedBody] = useState<StatutoryBody | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [votingModalResolution, setVotingModalResolution] = useState<BogResolution | null>(null);
  const [atrModalResolution, setAtrModalResolution] = useState<BogResolution | null>(null);
  const [sealModalResolution, setSealModalResolution] = useState<BogResolution | null>(null);

  // New Resolution Form State
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState<StatutoryBody>('BOARD_OF_GOVERNORS');
  const [newCategory, setNewCategory] = useState<ResolutionCategory>('ACADEMIC_REGULATIONS');
  const [newAgendaItem, setNewAgendaItem] = useState('');
  const [newMover, setNewMover] = useState('');
  const [newSeconder, setNewSeconder] = useState('');
  const [newSummary, setNewSummary] = useState('');

  // Voting Form State
  const [voteFor, setVoteFor] = useState(0);
  const [voteAgainst, setVoteAgainst] = useState(0);
  const [voteAbstain, setVoteAbstain] = useState(0);

  // ATR Form State
  const [atrStatus, setAtrStatus] = useState<AtrStatus>('IN_PROGRESS');
  const [atrOfficer, setAtrOfficer] = useState('');
  const [atrDeadline, setAtrDeadline] = useState('');
  const [atrRemarks, setAtrRemarks] = useState('');

  // Notification / Feedback
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Filtered Resolutions
  const filteredResolutions = useMemo(() => {
    return resolutions.filter((res) => {
      const matchBody = selectedBody === 'ALL' || res.body === selectedBody;
      const matchQuery =
        searchQuery.trim() === '' ||
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.resolutionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (res.gazetteNotificationNumber &&
          res.gazetteNotificationNumber.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchBody && matchQuery;
    });
  }, [resolutions, selectedBody, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = resolutions.length;
    const passed = resolutions.filter(
      (r) => r.status === 'UNANIMOUSLY_PASSED' || r.status === 'PASSED_BY_MAJORITY'
    ).length;
    const pendingAtr = resolutions.filter(
      (r) => r.atrStatus === 'ATR_PENDING' || r.atrStatus === 'IN_PROGRESS'
    ).length;
    const totalMeetings = meetings.length;
    const quorumMetCount = meetings.filter((m) => m.isQuorumMet).length;
    const quorumRate = totalMeetings > 0 ? Math.round((quorumMetCount / totalMeetings) * 100) : 100;

    return { total, passed, pendingAtr, quorumRate, totalMeetings };
  }, [resolutions, meetings]);

  // Active meeting for selected body
  const activeMeeting = useMemo(() => {
    if (selectedBody === 'ALL') {
      return meetings[0] || null;
    }
    return meetings.find((m) => m.body === selectedBody) || meetings[0] || null;
  }, [selectedBody, meetings]);

  const handleExportCSV = () => {
    const csvContent = exportBogResolutionsCSV(filteredResolutions);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PinIT_Governance_Resolutions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Statutory BoG Resolution Gazette CSV exported successfully.');
  };

  const handleCreateResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAgendaItem.trim() || !newMover.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const meeting = meetings.find((m) => m.body === newBody) || meetings[0];
    const resolutionCount = resolutions.filter((r) => r.body === newBody).length + 1;
    const shortCode = newBody === 'BOARD_OF_GOVERNORS' ? 'BOG' : newBody === 'ACADEMIC_COUNCIL' ? 'AC' : newBody === 'FINANCE_COMMITTEE' ? 'FC' : 'BWC';
    const resolutionNumber = `RES-${shortCode}-${meeting?.meetingNumber.split('-')[1] || '01'}-${String(resolutionCount).padStart(2, '0')}`;

    const created = registerGovernanceResolution({
      resolutionNumber,
      meetingId: meeting?.id || 'MTG-01',
      meetingNumber: meeting?.meetingNumber || 'BOG-68',
      body: newBody,
      category: newCategory,
      title: newTitle.trim(),
      agendaItemNumber: newAgendaItem.trim(),
      summary: newSummary.trim() || 'Formal resolution tabled before the statutory council.',
      mover: newMover.trim(),
      seconder: newSeconder.trim() || 'Senate Representative',
      tabledDate: new Date().toISOString().split('T')[0],
      status: 'TABLED_IN_MEETING',
      voting: { votesFor: 0, votesAgainst: 0, abstentions: 0 },
      atrStatus: 'ATR_PENDING',
    });

    setResolutions(getAllResolutions());
    setIsTableModalOpen(false);
    // Reset inputs
    setNewTitle('');
    setNewAgendaItem('');
    setNewMover('');
    setNewSeconder('');
    setNewSummary('');
    showNotification(`Resolution ${created.resolutionNumber} successfully tabled in ${meeting?.meetingNumber}.`);
  };

  const handleOpenVoting = (res: BogResolution) => {
    setVotingModalResolution(res);
    setVoteFor(res.voting.votesFor);
    setVoteAgainst(res.voting.votesAgainst);
    setVoteAbstain(res.voting.abstentions);
  };

  const handleSubmitVoting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!votingModalResolution) return;

    recordResolutionVoting(votingModalResolution.id, {
      votesFor: Number(voteFor),
      votesAgainst: Number(voteAgainst),
      abstentions: Number(voteAbstain),
    });

    setResolutions(getAllResolutions());
    setVotingModalResolution(null);
    showNotification(`Voting recorded for ${votingModalResolution.resolutionNumber}.`);
  };

  const handleOpenAtr = (res: BogResolution) => {
    setAtrModalResolution(res);
    setAtrStatus(res.atrStatus);
    setAtrOfficer(res.implementationOfficer || '');
    setAtrDeadline(res.implementationDeadline || '');
    setAtrRemarks(res.atrRemarks || '');
  };

  const handleSubmitAtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!atrModalResolution) return;

    updateResolutionAtr(
      atrModalResolution.id,
      atrStatus,
      atrOfficer.trim() || undefined,
      atrDeadline || undefined,
      atrRemarks.trim() || undefined
    );

    setResolutions(getAllResolutions());
    setAtrModalResolution(null);
    showNotification(`Action Taken Report updated for ${atrModalResolution.resolutionNumber}.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Toast Notification */}
      {feedbackMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl border border-emerald-400 flex items-center space-x-2 animate-bounce">
          <svg className="w-5 h-5 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium text-sm">{feedbackMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-900/50 rounded-lg border border-indigo-700/60 text-indigo-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Statutory Governance & Board of Governors Console
              </h1>
              <p className="text-sm text-slate-400">
                Apex University Policy Resolutions, Council Quorum & Statutory Gazette Ledger (UGC / AICTE Norms)
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
            <span>Export Gazette CSV</span>
          </button>
          <button
            onClick={() => setIsTableModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Table New Resolution</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Passed Resolutions</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{stats.passed}</h3>
            <p className="text-xs text-slate-500 mt-1">out of {stats.total} total tabled</p>
          </div>
          <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-center justify-center text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Statutory Meetings</p>
            <h3 className="text-2xl font-bold text-indigo-400 mt-1">{stats.totalMeetings}</h3>
            <p className="text-xs text-slate-500 mt-1">BoG, AC, FC & BWC</p>
          </div>
          <div className="w-12 h-12 bg-indigo-950/60 border border-indigo-800/60 rounded-xl flex items-center justify-center text-indigo-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quorum Compliance</p>
            <h3 className="text-2xl font-bold text-sky-400 mt-1">{stats.quorumRate}%</h3>
            <p className="text-xs text-slate-500 mt-1">Min 50% voting quorum met</p>
          </div>
          <div className="w-12 h-12 bg-sky-950/60 border border-sky-800/60 rounded-xl flex items-center justify-center text-sky-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending ATRs</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">{stats.pendingAtr}</h3>
            <p className="text-xs text-slate-500 mt-1">Action Taken Reports in progress</p>
          </div>
          <div className="w-12 h-12 bg-amber-950/60 border border-amber-800/60 rounded-xl flex items-center justify-center text-amber-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Meeting Spotlight Card */}
      {activeMeeting && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-900/70 border border-indigo-700 text-indigo-300">
                  {activeMeeting.meetingNumber}
                </span>
                <span className="text-xs text-slate-400">{activeMeeting.meetingDate}</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-medium">
                  QUORUM SATISFIED ({activeMeeting.presentVotingMembers}/{activeMeeting.totalVotingMembers})
                </span>
              </div>
              <h2 className="text-lg font-semibold text-white">{activeMeeting.title}</h2>
              <p className="text-xs text-slate-400 flex items-center space-x-2">
                <span>📍 {activeMeeting.venue}</span>
                <span>•</span>
                <span>Presided by: <strong className="text-slate-300">{activeMeeting.presidedBy}</strong></span>
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-lg">
              <div>
                <span className="text-slate-500 block">Voting Members</span>
                <span className="font-bold text-slate-200">{activeMeeting.presentVotingMembers} / {activeMeeting.totalVotingMembers}</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block">Statutory Quorum</span>
                <span className="font-bold text-emerald-400">≥ {activeMeeting.quorumRequired} Members</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block">Minutes Status</span>
                <span className="font-bold text-indigo-300">{activeMeeting.isMinutesAdopted ? 'ADOPTED' : 'PENDING'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedBody('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedBody === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            All Bodies ({resolutions.length})
          </button>
          <button
            onClick={() => setSelectedBody('BOARD_OF_GOVERNORS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedBody === 'BOARD_OF_GOVERNORS'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Board of Governors (BoG)
          </button>
          <button
            onClick={() => setSelectedBody('ACADEMIC_COUNCIL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedBody === 'ACADEMIC_COUNCIL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Academic Council (AC)
          </button>
          <button
            onClick={() => setSelectedBody('FINANCE_COMMITTEE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedBody === 'FINANCE_COMMITTEE'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Finance Committee (FC)
          </button>
          <button
            onClick={() => setSelectedBody('BUILDING_AND_WORKS_COMMITTEE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedBody === 'BUILDING_AND_WORKS_COMMITTEE'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Building & Works (BWC)
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search resolutions, gazette ref, summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Resolutions Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Resolution Number & Body</th>
                <th className="py-3 px-4">Agenda & Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Voting & Status</th>
                <th className="py-3 px-4">Action Taken Report (ATR)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredResolutions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No resolutions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredResolutions.map((res) => {
                  const overdue = isAtrOverdue(res.implementationDeadline, res.atrStatus);

                  return (
                    <tr key={res.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-indigo-400 font-mono">{res.resolutionNumber}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{res.meetingNumber}</div>
                        {res.gazetteNotificationNumber && (
                          <span className="inline-block mt-1 font-mono text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300">
                            {res.gazetteNotificationNumber}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                        <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block">
                          {res.agendaItemNumber}
                        </span>
                        <div className="font-semibold text-slate-100 text-sm mt-0.5">{res.title}</div>
                        <p className="text-slate-400 text-xs line-clamp-2 mt-1">{res.summary}</p>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Mover: <span className="text-slate-400 font-medium">{res.mover}</span> • Seconder: <span className="text-slate-400 font-medium">{res.seconder}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 border border-slate-700 text-slate-300">
                          {res.category.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {res.status === 'UNANIMOUSLY_PASSED' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-800 text-emerald-400">
                            UNANIMOUS ({res.voting.votesFor}-0)
                          </span>
                        )}
                        {res.status === 'PASSED_BY_MAJORITY' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-950 border border-blue-800 text-blue-400">
                            PASSED ({res.voting.votesFor}-{res.voting.votesAgainst})
                          </span>
                        )}
                        {res.status === 'TABLED_IN_MEETING' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-950 border border-amber-800 text-amber-400">
                            TABLED
                          </span>
                        )}
                        {res.status === 'DEFERRED' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-950 border border-purple-800 text-purple-400">
                            DEFERRED
                          </span>
                        )}
                        {res.status === 'REJECTED' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-950 border border-rose-800 text-rose-400">
                            REJECTED
                          </span>
                        )}
                        <div className="text-[11px] text-slate-500 mt-1">
                          For: {res.voting.votesFor} | Against: {res.voting.votesAgainst} | Abs: {res.voting.abstentions}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {res.atrStatus === 'IMPLEMENTED' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                            IMPLEMENTED
                          </span>
                        )}
                        {res.atrStatus === 'IN_PROGRESS' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-950/80 border border-sky-800 text-sky-300">
                            IN PROGRESS
                          </span>
                        )}
                        {res.atrStatus === 'ATR_PENDING' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/80 border border-amber-800 text-amber-300">
                            ATR PENDING
                          </span>
                        )}
                        {res.atrStatus === 'SUPERSEDED' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-400">
                            SUPERSEDED
                          </span>
                        )}
                        {overdue && (
                          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 border border-rose-800 text-rose-400">
                            OVERDUE
                          </span>
                        )}
                        <div className="text-[11px] text-slate-400 mt-1">
                          Officer: <strong className="text-slate-300">{res.implementationOfficer || 'Unassigned'}</strong>
                        </div>
                        {res.implementationDeadline && (
                          <div className="text-[10px] text-slate-500">
                            Target: {res.implementationDeadline}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleOpenVoting(res)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white rounded border border-slate-700 text-xs font-medium transition-colors"
                        >
                          Vote
                        </button>
                        <button
                          onClick={() => handleOpenAtr(res)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded border border-slate-700 text-xs font-medium transition-colors"
                        >
                          ATR
                        </button>
                        {res.cryptographicDigest && (
                          <button
                            onClick={() => setSealModalResolution(res)}
                            className="px-2.5 py-1 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 rounded text-xs font-medium transition-colors"
                          >
                            Seal
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Table New Resolution */}
      {isTableModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Table New University Resolution</span>
              </h3>
              <button
                onClick={() => setIsTableModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateResolution} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Statutory Body</label>
                  <select
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value as StatutoryBody)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="BOARD_OF_GOVERNORS">Board of Governors (BoG)</option>
                    <option value="ACADEMIC_COUNCIL">Academic Council (AC)</option>
                    <option value="FINANCE_COMMITTEE">Finance Committee (FC)</option>
                    <option value="BUILDING_AND_WORKS_COMMITTEE">Building & Works (BWC)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ResolutionCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="ACADEMIC_REGULATIONS">Academic Regulations</option>
                    <option value="CAPITAL_INFRASTRUCTURE">Capital Infrastructure</option>
                    <option value="FACULTY_RECRUITMENT_CADRE">Faculty Cadre</option>
                    <option value="FINANCE_AND_ENDOWMENT">Finance & Endowment</option>
                    <option value="STUDENT_STATUTE_AND_WELFARE">Student Statute</option>
                    <option value="DISCIPLINARY_AND_INTEGRITY">Disciplinary Action</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Agenda Item Number</label>
                <input
                  type="text"
                  placeholder="e.g. Agenda Item 68.7"
                  value={newAgendaItem}
                  onChange={(e) => setNewAgendaItem(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Resolution Title</label>
                <input
                  type="text"
                  placeholder="e.g. Establishment of High-Performance Quantum Computing Cluster"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Mover (Proposer)</label>
                  <input
                    type="text"
                    placeholder="e.g. Prof. Harish Chandra"
                    value={newMover}
                    onChange={(e) => setNewMover(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Seconder</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Preeti Vasudevan"
                    value={newSeconder}
                    onChange={(e) => setNewSeconder(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Summary / Statutory Justification</label>
                <textarea
                  rows={3}
                  placeholder="Detailed background, financial outlay, and regulatory references..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTableModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold"
                >
                  Table Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Voting */}
      {votingModalResolution && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Record Statutory Voting</h3>
                <p className="text-xs text-indigo-400 font-mono mt-0.5">{votingModalResolution.resolutionNumber}</p>
              </div>
              <button
                onClick={() => setVotingModalResolution(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitVoting} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <p className="text-slate-300 font-medium">{votingModalResolution.title}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Votes For</label>
                  <input
                    type="number"
                    min="0"
                    value={voteFor}
                    onChange={(e) => setVoteFor(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-emerald-800/80 rounded px-2.5 py-1.5 text-emerald-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-rose-400 font-semibold mb-1">Votes Against</label>
                  <input
                    type="number"
                    min="0"
                    value={voteAgainst}
                    onChange={(e) => setVoteAgainst(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-rose-800/80 rounded px-2.5 py-1.5 text-rose-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Abstentions</label>
                  <input
                    type="number"
                    min="0"
                    value={voteAbstain}
                    onChange={(e) => setVoteAbstain(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded text-slate-300 text-[11px]">
                <p>
                  <strong>Outcome Rule:</strong> Unanimous if Votes Against is 0 and Votes For &gt; 0; Majority if Votes For &gt; Votes Against; Deferred if tied.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setVotingModalResolution(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold"
                >
                  Confirm Voting & Gazette
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update ATR */}
      {atrModalResolution && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Action Taken Report (ATR)</h3>
                <p className="text-xs text-amber-400 font-mono mt-0.5">{atrModalResolution.resolutionNumber}</p>
              </div>
              <button
                onClick={() => setAtrModalResolution(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitAtr} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">ATR Implementation Status</label>
                <select
                  value={atrStatus}
                  onChange={(e) => setAtrStatus(e.target.value as AtrStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                >
                  <option value="ATR_PENDING">ATR Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="IMPLEMENTED">Implemented (Closed)</option>
                  <option value="SUPERSEDED">Superseded</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Designated Implementation Officer</label>
                <input
                  type="text"
                  placeholder="e.g. Registrar, Dean Academics, Chief Financial Officer"
                  value={atrOfficer}
                  onChange={(e) => setAtrOfficer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Completion Deadline</label>
                <input
                  type="date"
                  value={atrDeadline}
                  onChange={(e) => setAtrDeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">ATR Implementation Remarks</label>
                <textarea
                  rows={3}
                  placeholder="Details of office orders dispatched, committees formed, or tenders floated..."
                  value={atrRemarks}
                  onChange={(e) => setAtrRemarks(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAtrModalResolution(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-semibold"
                >
                  Save ATR Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cryptographic Gazette Seal */}
      {sealModalResolution && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🏛️</span>
                <h3 className="text-base font-bold text-white">Official Gazette Cryptographic Digest</h3>
              </div>
              <button
                onClick={() => setSealModalResolution(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Statutory Gazette Reference</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {sealModalResolution.gazetteNotificationNumber || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Resolution Number</span>
                <span className="font-mono text-indigo-300 font-semibold">{sealModalResolution.resolutionNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Statutory Body</span>
                <span className="text-slate-300 font-medium">{sealModalResolution.body}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Title</span>
                <span className="text-slate-200 font-medium">{sealModalResolution.title}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">SHA-256 Tamper-Proof Seal</span>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-emerald-300 break-all">
                  {sealModalResolution.cryptographicDigest}
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded text-[11px] text-emerald-300 flex items-center space-x-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>This resolution is cryptographically sealed by the Vice-Chancellor & Chancellor Secretariat under the University Statutes.</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSealModalResolution(null)}
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
