'use client';

import React, { useState, useMemo } from 'react';
import {
  MentorshipInteraction,
  MenteeRiskLevel,
  InteractionCategory,
  INITIAL_MENTORSHIP_RECORDS,
  logMentorshipInteraction,
  escalateToCampusCounselor,
  resolveMentorshipFollowup,
  exportFacultyMentorshipCSV,
} from '@/lib/teacher/facultyMentorship';

export default function FacultyMentorshipStudio() {
  const [records, setRecords] = useState<MentorshipInteraction[]>(INITIAL_MENTORSHIP_RECORDS);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | MenteeRiskLevel | 'COUNSELOR_REFERRED' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [escalateModalRecord, setEscalateModalRecord] = useState<MentorshipInteraction | null>(null);
  const [resolveModalRecord, setResolveModalRecord] = useState<MentorshipInteraction | null>(null);
  const [sealModalRecord, setSealModalRecord] = useState<MentorshipInteraction | null>(null);

  // New Interaction Form State
  const [enrollmentNumber, setEnrollmentNumber] = useState('2024CSB031');
  const [studentName, setStudentName] = useState('Rohan S. Mehta');
  const [semester, setSemester] = useState(4);
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [facultyMentorName, setFacultyMentorName] = useState('Prof. Arvind Swaminathan');
  const [facultyMentorEmpId, setFacultyMentorEmpId] = useState('EMP-CSE-007');
  const [category, setCategory] = useState<InteractionCategory>('ROUTINE_ACADEMIC_AUDIT');
  const [currentCgpa, setCurrentCgpa] = useState<number>(7.45);
  const [attendancePercentage, setAttendancePercentage] = useState<number>(84.0);
  const [actionPlanDiscussion, setActionPlanDiscussion] = useState('Reviewed end-semester academic goals. Student expressed interest in open-source projects.');
  const [parentContacted, setParentContacted] = useState(false);
  const [referralToCounselor, setReferralToCounselor] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('2026-05-15');

  // Escalation & Resolution Form State
  const [escalationReason, setEscalationReason] = useState('Acute academic anxiety and sleep disruption observed.');
  const [resolutionNotes, setResolutionNotes] = useState('Remedial attendance completed and student demonstrated significant academic turnaround.');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      let matchesFilter = true;
      if (selectedFilter === 'COUNSELOR_REFERRED') {
        matchesFilter = r.referralToCounselor;
      } else if (selectedFilter === 'RESOLVED') {
        matchesFilter = r.isResolved;
      } else if (selectedFilter !== 'ALL') {
        matchesFilter = r.riskLevel === selectedFilter;
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.studentName.toLowerCase().includes(q) ||
        r.enrollmentNumber.toLowerCase().includes(q) ||
        r.facultyMentorName.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.interactionToken.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [records, selectedFilter, searchQuery]);

  // Telemetry Metrics
  const metrics = useMemo(() => {
    const total = records.length;
    const criticalCount = records.filter((r) => r.riskLevel === 'CRITICAL_CONCERN' && !r.isResolved).length;
    const warningCount = records.filter((r) => r.riskLevel === 'ACADEMIC_WARNING' && !r.isResolved).length;
    const stableCount = records.filter((r) => r.riskLevel === 'LOW_NORMAL' || r.isResolved).length;
    const resolvedCount = records.filter((r) => r.isResolved).length;

    const stablePercent = total > 0 ? Math.round((stableCount / total) * 100) : 0;

    return { total, criticalCount, warningCount, stablePercent, resolvedCount };
  }, [records]);

  // Handle Log Interaction
  const handleLogInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollmentNumber.trim() || !studentName.trim() || !actionPlanDiscussion.trim()) {
      showToast('Please provide all mandatory interaction fields.');
      return;
    }

    try {
      const created = logMentorshipInteraction({
        studentId: `STU-${Date.now().toString(36).toUpperCase()}`,
        enrollmentNumber: enrollmentNumber.trim(),
        studentName: studentName.trim(),
        semester: Number(semester),
        department: department.trim(),
        facultyMentorName: facultyMentorName.trim(),
        facultyMentorEmpId: facultyMentorEmpId.trim(),
        category,
        currentCgpa: Number(currentCgpa),
        attendancePercentage: Number(attendancePercentage),
        actionPlanDiscussion: actionPlanDiscussion.trim(),
        parentContacted,
        referralToCounselor,
        followUpDate: followUpDate || undefined,
      });

      setRecords([created, ...records]);
      setIsLogModalOpen(false);
      showToast(`Proctorial mentorship session logged: ${created.interactionToken}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error logging interaction.';
      showToast(msg);
    }
  };

  // Handle Counselor Escalation
  const handleEscalateCounselor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalateModalRecord || !escalationReason.trim()) return;

    try {
      const updated = escalateToCampusCounselor(escalateModalRecord, escalationReason.trim());
      setRecords(records.map((r) => (r.interactionId === updated.interactionId ? updated : r)));
      setEscalateModalRecord(null);
      showToast(`Student escalated to Campus Counselor: ${updated.studentName}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Escalation failed.';
      showToast(msg);
    }
  };

  // Handle Resolution
  const handleResolveFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveModalRecord || !resolutionNotes.trim()) return;

    try {
      const updated = resolveMentorshipFollowup(resolveModalRecord, resolutionNotes.trim());
      setRecords(records.map((r) => (r.interactionId === updated.interactionId ? updated : r)));
      setResolveModalRecord(null);
      showToast(`Proctorial follow-up resolved for ${updated.studentName}!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Resolution failed.';
      showToast(msg);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent = exportFacultyMentorshipCSV(records);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `proctorial_mentorship_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Proctorial mentorship audit ledger exported to CSV.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-600 text-white px-5 py-3 rounded-lg shadow-xl border border-teal-400 flex items-center space-x-3 animate-fade-in">
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
            <span className="p-2.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Faculty Proctorial Mentorship & Student Wellness Studio
              </h1>
              <p className="text-sm text-slate-400">
                UGC Student Mentoring (Deeksharambh), AICTE Proctorial Ratio (1:20) & Holistic Student Wellness
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
            <span>Export Mentorship CSV</span>
          </button>
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium transition flex items-center space-x-2 shadow-lg shadow-teal-600/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Log Mentorship Session</span>
          </button>
        </div>
      </div>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Total Mentee Sessions</span>
            <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{metrics.total}</div>
          <div className="text-xs text-slate-500 mt-1">UGC 1:20 Proctorial Ratio verified</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Stable & Low Risk</span>
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{metrics.stablePercent}%</div>
          <div className="text-xs text-slate-500 mt-1">CGPA ≥ 7.0 & Attendance ≥ 80%</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Critical Concerns</span>
            <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2">{metrics.criticalCount}</div>
          <div className="text-xs text-slate-500 mt-1">Attendance &lt; 65% or mental distress</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Resolved Action Plans</span>
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-indigo-400 mt-2">{metrics.resolvedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Academic turnarounds completed</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['ALL', 'All Mentees'],
              ['CRITICAL_CONCERN', 'Critical Concerns'],
              ['ACADEMIC_WARNING', 'Academic Warnings'],
              ['LOW_NORMAL', 'Low Risk'],
              ['COUNSELOR_REFERRED', 'Counselor Referred'],
              ['RESOLVED', 'Resolved'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedFilter(key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedFilter === key
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
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
            placeholder="Search student, enrollment, mentor, token..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Mentorship Interactions List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-sm">
            No proctorial mentorship records found matching the selected filter criteria.
          </div>
        ) : (
          filteredRecords.map((r) => (
            <div
              key={r.interactionId}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition rounded-xl p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/20">
                      {r.enrollmentNumber}
                    </span>
                    <span className="font-mono text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                      {r.interactionToken}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        r.riskLevel === 'CRITICAL_CONCERN'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse'
                          : r.riskLevel === 'ACADEMIC_WARNING'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {r.riskLevel.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded font-mono font-medium">
                      {r.category.replace(/_/g, ' ')}
                    </span>
                    {r.isResolved && (
                      <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-semibold">
                        ✓ ACTION PLAN RESOLVED
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-white">{r.studentName}</h3>

                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400">
                    <div>
                      <span className="text-slate-500">Dept:</span> {r.department} (Semester {r.semester})
                    </div>
                    <div>
                      <span className="text-slate-500">Faculty Mentor:</span> {r.facultyMentorName} ({r.facultyMentorEmpId})
                    </div>
                    <div>
                      <span className="text-slate-500">CGPA:</span>{' '}
                      <span className={`font-semibold ${r.currentCgpa < 6.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                        {r.currentCgpa.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Attendance:</span>{' '}
                      <span className={`font-semibold ${r.attendancePercentage < 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {r.attendancePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-xs bg-slate-950/70 border border-slate-800/80 p-2.5 rounded text-slate-300">
                    <span className="text-teal-400 font-semibold">Action Plan / Discussion:</span> {r.actionPlanDiscussion}
                  </div>

                  {r.resolutionNotes && (
                    <div className="text-xs bg-emerald-950/30 border border-emerald-800/50 p-2 rounded text-emerald-300">
                      <span className="font-semibold">Resolution Note:</span> {r.resolutionNotes}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400 pt-1">
                    <div>
                      <span className="text-slate-500">Parent Alerted:</span>{' '}
                      {r.parentContacted ? <span className="text-amber-400 font-medium">Yes</span> : 'No'}
                    </div>
                    <div>
                      <span className="text-slate-500">Counselor Referral:</span>{' '}
                      {r.referralToCounselor ? <span className="text-rose-400 font-medium">Yes (Active Wellness Watch)</span> : 'No'}
                    </div>
                    {r.followUpDate && (
                      <div>
                        <span className="text-slate-500">Next Review:</span>{' '}
                        <span className="text-teal-300 font-mono">{r.followUpDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap lg:flex-col items-end gap-2 mt-4 lg:mt-0">
                  {!r.referralToCounselor && !r.isResolved && (
                    <button
                      onClick={() => setEscalateModalRecord(r)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-medium transition"
                    >
                      Refer to Counselor
                    </button>
                  )}

                  {!r.isResolved && (
                    <button
                      onClick={() => setResolveModalRecord(r)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition"
                    >
                      Resolve Follow-up
                    </button>
                  )}

                  <button
                    onClick={() => setSealModalRecord(r)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition"
                  >
                    View Proctor Seal
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL 1: Log Mentorship Session */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Log Proctorial Mentorship Session</h2>
              <button onClick={() => setIsLogModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleLogInteraction} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Enrollment Number</label>
                  <input
                    type="text"
                    value={enrollmentNumber}
                    onChange={(e) => setEnrollmentNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Student Full Name</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Semester</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Current CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={currentCgpa}
                    onChange={(e) => setCurrentCgpa(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Attendance %</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={attendancePercentage}
                    onChange={(e) => setAttendancePercentage(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Interaction Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as InteractionCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="ROUTINE_ACADEMIC_AUDIT">Routine Academic Audit</option>
                    <option value="ATTENDANCE_INTERVENTION">Attendance Intervention (&lt;75%)</option>
                    <option value="CAREER_PLACEMENT_GUIDANCE">Career & Placement Guidance</option>
                    <option value="PSYCHOSOCIAL_WELLNESS">Psychosocial Wellness</option>
                    <option value="PARENT_TEACHER_CONSULTATION">Parent-Teacher Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Action Plan & Proctorial Discussion</label>
                <textarea
                  value={actionPlanDiscussion}
                  onChange={(e) => setActionPlanDiscussion(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="flex items-center space-x-6 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={parentContacted}
                    onChange={(e) => setParentContacted(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-teal-500"
                  />
                  <span className="text-slate-300">Contact Parent / Guardian</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={referralToCounselor}
                    onChange={(e) => setReferralToCounselor(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-rose-500"
                  />
                  <span className="text-rose-400">Escalate to Campus Counselor</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded font-medium shadow"
                >
                  Record Interaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Escalate to Counselor */}
      {escalateModalRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-900/50">
              <h2 className="text-base font-bold text-white">Escalate to University Wellness Counselor</h2>
              <button onClick={() => setEscalateModalRecord(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleEscalateCounselor} className="space-y-4 text-xs">
              <div className="bg-rose-950/40 border border-rose-800/80 rounded-lg p-3 text-rose-200">
                Notice: Escalating triggers a confidential clinical wellness referral to the University Chief Medical Officer & Student Psychological Counseling Cell.
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Reason for Immediate Escalation</label>
                <textarea
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEscalateModalRecord(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium shadow"
                >
                  Confirm Counselor Escalation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Resolve Follow-up */}
      {resolveModalRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Resolve Proctorial Follow-up</h2>
              <button onClick={() => setResolveModalRecord(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleResolveFollowup} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Resolution & Turnaround Notes</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setResolveModalRecord(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium shadow"
                >
                  Mark Action Plan Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Proctorial Seal Inspector Modal */}
      {sealModalRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Cryptographic Proctorial Seal Inspector</h2>
              <button onClick={() => setSealModalRecord(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-slate-500">Mentee Scholar:</div>
                <div className="font-semibold text-white">{sealModalRecord.studentName} ({sealModalRecord.enrollmentNumber})</div>
              </div>
              <div>
                <div className="text-slate-500">Proctorial Token:</div>
                <div className="font-mono text-teal-400 font-semibold">{sealModalRecord.interactionToken}</div>
              </div>
              <div>
                <div className="text-slate-500">Faculty Proctor:</div>
                <div className="text-slate-300">{sealModalRecord.facultyMentorName} ({sealModalRecord.facultyMentorEmpId})</div>
              </div>
              <div>
                <div className="text-slate-500">SHA-256 Audit Seal:</div>
                <div className="font-mono text-emerald-400 break-all bg-slate-950 p-2.5 rounded border border-slate-800 select-all">
                  {sealModalRecord.cryptographicSeal}
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
