'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  MentorshipSession,
  MenteeProfile,
  MentorshipCategory,
  InterventionUrgency,
  MenteeProgressStatus,
  getMentorshipSessions,
  getMentees,
  recordMentorshipSession,
  computeFacultyMentorshipSummary,
  exportMentorshipLogCSV,
  seedMentorshipData
} from '@/lib/teacher/facultyMentorship';

interface FacultyMentorshipStudioProps {
  institutionId?: string;
  facultyId?: string;
  facultyName?: string;
  department?: string;
}

export const FacultyMentorshipStudio: React.FC<FacultyMentorshipStudioProps> = ({
  institutionId = 'inst-apex-001',
  facultyId = 'FAC-CS-001',
  facultyName = 'Dr. Aris Thorne',
  department = 'Computer Science'
}) => {
  const [activeTab, setActiveTab] = useState<'MENTEES' | 'SESSIONS'>('MENTEES');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal
  const [showLogModal, setShowLogModal] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [category, setCategory] = useState<MentorshipCategory>('ACADEMIC_PROGRESS');
  const [urgency, setUrgency] = useState<InterventionUrgency>('LOW');
  const [discussion, setDiscussion] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [parentContacted, setParentContacted] = useState(false);
  const [referCounselor, setReferCounselor] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('2026-11-05');

  // Initial Seed
  useEffect(() => {
    const existingMentees = getMentees(institutionId, { assignedFacultyId: facultyId });
    if (existingMentees.length === 0) {
      seedMentorshipData(institutionId);
      setRefreshKey(k => k + 1);
    }
  }, [institutionId, facultyId]);

  const mentees = useMemo(() => {
    return getMentees(institutionId, { assignedFacultyId: facultyId });
  }, [institutionId, facultyId, refreshKey]);

  const sessions = useMemo(() => {
    return getMentorshipSessions(institutionId, { mentorFacultyId: facultyId });
  }, [institutionId, facultyId, refreshKey]);

  const summary = useMemo(() => {
    return computeFacultyMentorshipSummary(facultyId, institutionId);
  }, [facultyId, institutionId, refreshKey]);

  useEffect(() => {
    if (mentees.length > 0 && !selectedStudentId) {
      setSelectedStudentId(mentees[0].studentId);
    }
  }, [mentees, selectedStudentId]);

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchesCategory = categoryFilter === 'ALL' || s.category === categoryFilter;
      const matchesUrgency = urgencyFilter === 'ALL' || s.urgency === urgencyFilter;
      const matchesSearch = s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.discussionPoints.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesUrgency && matchesSearch;
    });
  }, [sessions, categoryFilter, urgencyFilter, searchTerm]);

  const handleExportCSV = () => {
    const csvContent = exportMentorshipLogCSV(institutionId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NAAC_Criterion_5_1_4_Mentoring_${facultyId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLogError(null);

    const mentee = mentees.find(m => m.studentId === selectedStudentId);
    if (!mentee) {
      setLogError('Please select a valid mentee student.');
      return;
    }

    const res = recordMentorshipSession({
      institutionId,
      mentorFacultyId: facultyId,
      mentorFacultyName: facultyName,
      department,
      studentId: mentee.studentId,
      studentName: mentee.studentName,
      rollNumber: mentee.rollNumber,
      category,
      urgency,
      discussionPoints: discussion,
      actionPlan,
      parentContacted,
      referredToProfessionalCounselor: referCounselor,
      sessionDate: new Date().toISOString(),
      followUpDate: followUpDate || undefined
    });

    if (!res.success) {
      setLogError(res.error || 'Failed to record session');
      return;
    }

    setShowLogModal(false);
    setDiscussion('');
    setActionPlan('');
    setParentContacted(false);
    setReferCounselor(false);
    setRefreshKey(k => k + 1);
  };

  const getStatusBadge = (status: MenteeProgressStatus) => {
    switch (status) {
      case 'THRIVING':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">THRIVING</span>;
      case 'STABLE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-950 text-cyan-400 border border-cyan-800">STABLE</span>;
      case 'NEEDS_SUPPORT':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950 text-amber-400 border border-amber-800">NEEDS SUPPORT</span>;
      case 'CRITICAL_RISK':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">CRITICAL RISK</span>;
    }
  };

  const getUrgencyBadge = (urg: InterventionUrgency) => {
    switch (urg) {
      case 'CRITICAL_COUNSELOR_ESCALATION':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-800">ESCALATED TO COUNSELOR</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">ROUTINE</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Faculty Mentorship & Student Counseling Studio
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800">
              NAAC Criterion 5.1.4
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Faculty Mentor: <span className="text-slate-200 font-medium">{facultyName}</span> ({department}) | AICTE Mandatory Proctor-Mentee System
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Log 1-on-1 Counseling Session
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export NAAC 5.1.4 CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Assigned Mentees */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Assigned Mentees</span>
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary.totalMenteesCount}</span>
            <span className="text-slate-400 text-xs">students allocated</span>
          </div>
          <div className="mt-3">
            {summary.isRatioCompliant ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                ✓ AICTE 20:1 Ratio Compliant
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950 text-rose-400 border border-rose-800">
                ⚠ Ratio Exceeded (&gt;20:1)
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Completed Sessions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Counseling Sessions</span>
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary.totalSessionsCompleted}</span>
            <span className="text-slate-400 text-xs">encounters completed</span>
          </div>
          <p className="mt-3 text-xs text-emerald-400">
            Active 1-on-1 dialogue ongoing
          </p>
        </div>

        {/* Card 3: High-Risk Students */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>High-Support Mentees</span>
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {summary.riskDistribution.CRITICAL_RISK + summary.riskDistribution.NEEDS_SUPPORT}
            </span>
            <span className="text-slate-400 text-xs">academic / attendance risk</span>
          </div>
          <p className="mt-3 text-xs text-amber-400">
            Critical Risk: <span className="font-bold">{summary.riskDistribution.CRITICAL_RISK}</span>
          </p>
        </div>

        {/* Card 4: Counselor Referrals */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Psychologist Referrals</span>
            <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary.professionalCounselorReferrals}</span>
            <span className="text-slate-400 text-xs">escalations to clinic</span>
          </div>
          <p className="mt-3 text-xs text-rose-300">
            Professional mental health support
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('MENTEES')}
          className={`pb-2 px-1 text-sm font-semibold transition ${
            activeTab === 'MENTEES'
              ? 'border-b-2 border-indigo-500 text-indigo-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Assigned Mentees Cohort Radar ({mentees.length})
        </button>
        <button
          onClick={() => setActiveTab('SESSIONS')}
          className={`pb-2 px-1 text-sm font-semibold transition ${
            activeTab === 'SESSIONS'
              ? 'border-b-2 border-indigo-500 text-indigo-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Counseling Sessions Ledger ({filteredSessions.length})
        </button>
      </div>

      {/* Tab 1: Mentees Grid */}
      {activeTab === 'MENTEES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mentees.map(m => (
            <div key={m.studentId} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-300 font-semibold">{m.rollNumber}</span>
                {getStatusBadge(m.status)}
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{m.studentName}</h3>
                <p className="text-slate-400 text-xs mt-0.5">{m.department}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
                <div>
                  <div className="text-slate-400 text-[10px]">CGPA</div>
                  <div className={`font-bold ${m.cgpa < 6.0 ? 'text-rose-400' : 'text-white'}`}>{m.cgpa.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Attendance</div>
                  <div className={`font-bold ${m.attendancePercent < 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {m.attendancePercent}%
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Backlogs</div>
                  <div className={`font-bold ${m.backlogsCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {m.backlogsCount}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setSelectedStudentId(m.studentId);
                    setShowLogModal(true);
                  }}
                  className="w-full py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-medium transition shadow-sm"
                >
                  Log Mentoring Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Sessions Table */}
      {activeTab === 'SESSIONS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search session notes, student, or roll no..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Categories</option>
                <option value="ACADEMIC_PROGRESS">Academic Progress</option>
                <option value="CAREER_GUIDANCE">Career Guidance</option>
                <option value="MENTAL_HEALTH_WELLBEING">Mental Health & Wellbeing</option>
                <option value="ATTENDANCE_INTERVENTION">Attendance Intervention</option>
                <option value="DISCIPLINARY_COUNSELING">Disciplinary</option>
              </select>

              <select
                value={urgencyFilter}
                onChange={e => setUrgencyFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Urgencies</option>
                <option value="CRITICAL_COUNSELOR_ESCALATION">Counselor Escalation</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Routine</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Mentee & Roll No</th>
                  <th className="py-3 px-3">Category & Urgency</th>
                  <th className="py-3 px-3">Discussion Points & Plan</th>
                  <th className="py-3 px-3">Follow-up / Escalation</th>
                  <th className="py-3 px-3 text-right">Session Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredSessions.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">{s.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.rollNumber}</div>
                      <div className="text-[10px] text-indigo-400 font-mono mt-0.5">{s.id}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-200">{s.category.replace(/_/g, ' ')}</div>
                      <div className="mt-1">{getUrgencyBadge(s.urgency)}</div>
                    </td>

                    <td className="py-3.5 px-3 max-w-xs">
                      <p className="text-slate-300 line-clamp-2">{s.discussionPoints}</p>
                      <p className="text-[11px] text-indigo-300 mt-0.5 font-medium">Plan: {s.actionPlan}</p>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5 text-[11px]">
                        {s.referredToProfessionalCounselor && (
                          <span className="block text-rose-400 font-semibold">✓ Campus Psychologist Referred</span>
                        )}
                        {s.parentContacted && (
                          <span className="block text-amber-400 font-medium">✓ Parent Informed</span>
                        )}
                        {s.followUpDate && (
                          <span className="block text-slate-400 text-[10px]">Follow-up: {s.followUpDate}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right text-slate-400 text-[11px]">
                      {new Date(s.sessionDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log Session Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Log 1-on-1 Mentorship Encounter</h3>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {logError && (
              <div className="bg-rose-950/60 border border-rose-800 text-rose-300 text-xs p-3 rounded-lg">
                {logError}
              </div>
            )}

            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Mentee</label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                >
                  {mentees.map(m => (
                    <option key={m.studentId} value={m.studentId}>
                      {m.studentName} ({m.rollNumber}) - Status: {m.status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Session Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as MentorshipCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="ACADEMIC_PROGRESS">Academic Progress</option>
                    <option value="CAREER_GUIDANCE">Career Guidance</option>
                    <option value="MENTAL_HEALTH_WELLBEING">Mental Health & Wellbeing</option>
                    <option value="ATTENDANCE_INTERVENTION">Attendance Intervention</option>
                    <option value="DISCIPLINARY_COUNSELING">Disciplinary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Urgency Level</label>
                  <select
                    value={urgency}
                    onChange={e => setUrgency(e.target.value as InterventionUrgency)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="LOW">Routine Follow-up</option>
                    <option value="MEDIUM">Needs Attention</option>
                    <option value="CRITICAL_COUNSELOR_ESCALATION">Critical Counselor Escalation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Discussion Points & Observations</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Student experiencing acute stress about mid-term algorithms exam; attendance dipped below 65%."
                  value={discussion}
                  onChange={e => setDiscussion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Agreed Action Plan</label>
                <input
                  type="text"
                  placeholder="e.g. Enrolled in peer tutoring sessions; review in 2 weeks"
                  value={actionPlan}
                  onChange={e => setActionPlan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={e => setFollowUpDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={parentContacted}
                    onChange={e => setParentContacted(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-indigo-500"
                  />
                  Parent Contacted & Briefed
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={referCounselor}
                    onChange={e => setReferCounselor(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-rose-500"
                  />
                  Refer to Licensed Campus Psychologist
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                >
                  Record Mentoring Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
