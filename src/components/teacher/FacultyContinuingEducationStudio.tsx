'use client';

import React, { useState, useMemo } from 'react';
import {
  ContinuingEducationCourse,
  FdpScheme,
  CourseMode,
  CourseLifecycle,
  ParticipantRecord,
  INITIAL_FDP_COURSES,
  createContinuingEducationCourse,
  registerCourseParticipant,
  recordParticipantEvaluation,
  issueBatchCertificates,
  exportContinuingEducationCSV,
} from '@/lib/teacher/facultyContinuingEducation';

export default function FacultyContinuingEducationStudio() {
  const [courses, setCourses] = useState<ContinuingEducationCourse[]>(INITIAL_FDP_COURSES);
  const [selectedFilter, setSelectedFilter] = useState<CourseLifecycle | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);
  const [registerParticipantCourse, setRegisterParticipantCourse] = useState<ContinuingEducationCourse | null>(null);
  const [evaluateModalCourse, setEvaluateModalCourse] = useState<ContinuingEducationCourse | null>(null);
  const [sealModalCourse, setSealModalCourse] = useState<ContinuingEducationCourse | null>(null);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(courses[0]?.courseId || null);

  // New Course Form State
  const [courseTitle, setCourseTitle] = useState('Quantum Computing Algorithms & Qiskit Hardware Compilation');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [coordinatorName, setCoordinatorName] = useState('Dr. Siddharth Sen');
  const [coordinatorEmpId, setCoordinatorEmpId] = useState('EMP-CSE-042');
  const [scheme, setScheme] = useState<FdpScheme>('AICTE_ATAL_ACADEMY');
  const [mode, setMode] = useState<CourseMode>('HANDS_ON_BOOTCAMP');
  const [startDate, setStartDate] = useState('2026-08-10');
  const [endDate, setEndDate] = useState('2026-08-15');
  const [durationDays, setDurationDays] = useState(6);
  const [targetCapacity, setTargetCapacity] = useState(50);
  const [sanctionedBudgetInr, setSanctionedBudgetInr] = useState(350000);

  // Participant Form State
  const [partName, setPartName] = useState('Dr. S. K. Gupta');
  const [partInst, setPartInst] = useState('BITS Pilani');
  const [partDesig, setPartDesig] = useState('Associate Professor');
  const [partEmail, setPartEmail] = useState('skgupta@pilani.bits-pilani.ac.in');

  // Evaluation Form State
  const [selectedPartId, setSelectedPartId] = useState('');
  const [evalAttendance, setEvalAttendance] = useState(90.0);
  const [evalScore, setEvalScore] = useState(85.0);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesStage = selectedFilter === 'ALL' || c.stage === selectedFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.courseTitle.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.coordinatorName.toLowerCase().includes(q) ||
        c.certificateToken.toLowerCase().includes(q);

      return matchesStage && matchesSearch;
    });
  }, [courses, selectedFilter, searchQuery]);

  // Telemetry Metrics
  const metrics = useMemo(() => {
    const totalCourses = courses.length;
    const totalParticipants = courses.reduce((acc, c) => acc + c.participants.length, 0);
    const totalBudgetLakhs = (courses.reduce((acc, c) => acc + c.sanctionedBudgetInr, 0) / 100000).toFixed(1);
    const certifiedCount = courses.reduce(
      (acc, c) => acc + c.participants.filter((p) => p.certificateIssued).length,
      0
    );
    const certifiedPercent = totalParticipants > 0 ? Math.round((certifiedCount / totalParticipants) * 100) : 0;

    return { totalCourses, totalParticipants, totalBudgetLakhs, certifiedCount, certifiedPercent };
  }, [courses]);

  // Handle Create Course
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !department.trim()) {
      showToast('Please provide course title and department.');
      return;
    }

    try {
      const created = createContinuingEducationCourse({
        courseTitle: courseTitle.trim(),
        department: department.trim(),
        coordinatorName: coordinatorName.trim(),
        coordinatorEmpId: coordinatorEmpId.trim(),
        scheme,
        mode,
        startDate,
        endDate,
        durationDays: Number(durationDays),
        targetCapacity: Number(targetCapacity),
        sanctionedBudgetInr: Number(sanctionedBudgetInr),
      });

      setCourses([created, ...courses]);
      setExpandedCourseId(created.courseId);
      setIsNewCourseModalOpen(false);
      showToast(`Workshop proposal created: ${created.certificateToken}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating course.';
      showToast(msg);
    }
  };

  // Handle Register Participant
  const handleRegisterParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerParticipantCourse || !partName.trim() || !partEmail.trim()) {
      showToast('Please provide participant full name and email.');
      return;
    }

    try {
      const updated = registerCourseParticipant(registerParticipantCourse, {
        fullName: partName.trim(),
        institutionName: partInst.trim(),
        designation: partDesig.trim(),
        email: partEmail.trim(),
        attendancePercentage: 0,
      });

      setCourses(courses.map((c) => (c.courseId === updated.courseId ? updated : c)));
      setRegisterParticipantCourse(null);
      showToast(`Participant registered: ${partName.trim()}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      showToast(msg);
    }
  };

  // Handle Participant Evaluation
  const handleEvaluateParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluateModalCourse || !selectedPartId) return;

    try {
      const updated = recordParticipantEvaluation(
        evaluateModalCourse,
        selectedPartId,
        Number(evalAttendance),
        Number(evalScore)
      );

      setCourses(courses.map((c) => (c.courseId === updated.courseId ? updated : c)));
      setEvaluateModalCourse(null);
      showToast('Participant attendance and assessment score recorded.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Evaluation update failed.';
      showToast(msg);
    }
  };

  // Handle Issue Batch Certificates
  const handleIssueCertificates = (course: ContinuingEducationCourse) => {
    try {
      const updated = issueBatchCertificates(course);
      setCourses(courses.map((c) => (c.courseId === updated.courseId ? updated : c)));
      const certified = updated.participants.filter((p) => p.certificateIssued).length;
      showToast(`Batch certificates issued to ${certified} qualifying participants!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Certificate issuance failed.';
      showToast(msg);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent = exportContinuingEducationCSV(courses);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `continuing_education_fdp_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Continuing education course ledger exported to CSV.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl border border-emerald-400 flex items-center space-x-3 animate-fade-in">
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
            <span className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Faculty Continuing Education & ATAL FDP Studio
              </h1>
              <p className="text-sm text-slate-400">
                AICTE ATAL Academy, MoE GIAN International Courses & Quality Improvement Programme (QIP) Workbench
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
            <span>Export FDP CSV</span>
          </button>
          <button
            onClick={() => setIsNewCourseModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition flex items-center space-x-2 shadow-lg shadow-emerald-600/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Propose New Workshop / FDP</span>
          </button>
        </div>
      </div>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Organized Courses</span>
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{metrics.totalCourses}</div>
          <div className="text-xs text-slate-500 mt-1">ATAL, GIAN & QIP short-term courses</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Enrolled Participants</span>
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-cyan-400 mt-2">{metrics.totalParticipants}</div>
          <div className="text-xs text-slate-500 mt-1">Faculty & research delegates nationwide</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Sanctioned Grants</span>
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2">₹{metrics.totalBudgetLakhs}L</div>
          <div className="text-xs text-slate-500 mt-1">AICTE & MoE sponsored budgets</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Certificates Conferred</span>
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-indigo-400 mt-2">{metrics.certifiedPercent}%</div>
          <div className="text-xs text-slate-500 mt-1">{metrics.certifiedCount} satisfied 80% att & 60% score</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['ALL', 'All Courses'],
              ['PROPOSAL_DRAFTED', 'Drafting'],
              ['COURSE_CONDUCTED', 'Conducting'],
              ['CERTIFICATES_ISSUED', 'Certificates Issued'],
            ] as const
          ).map(([stage, label]) => (
            <button
              key={stage}
              onClick={() => setSelectedFilter(stage as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedFilter === stage
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
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
            placeholder="Search course title, coordinator, token..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-sm">
            No continuing education courses found matching the selected filter criteria.
          </div>
        ) : (
          filteredCourses.map((c) => {
            const isExpanded = expandedCourseId === c.courseId;
            const certifiedParticipants = c.participants.filter((p) => p.certificateIssued).length;

            return (
              <div
                key={c.courseId}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition rounded-xl p-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                        {c.certificateToken}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          c.stage === 'CERTIFICATES_ISSUED'
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                            : c.stage === 'COURSE_CONDUCTED'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-700 text-slate-300 border border-slate-600'
                        }`}
                      >
                        {c.stage.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-mono font-medium">
                        {c.scheme.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded font-mono">
                        {c.mode.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-white">{c.courseTitle}</h3>

                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400">
                      <div>
                        <span className="text-slate-500">Dept:</span> {c.department}
                      </div>
                      <div>
                        <span className="text-slate-500">Coordinator:</span> {c.coordinatorName} ({c.coordinatorEmpId})
                      </div>
                      <div>
                        <span className="text-slate-500">Duration:</span> {c.durationDays} Days ({c.startDate} to {c.endDate})
                      </div>
                      <div>
                        <span className="text-slate-500">Enrolled:</span> {c.participants.length} / {c.targetCapacity}
                      </div>
                      <div>
                        <span className="text-slate-500">Budget:</span> ₹{c.sanctionedBudgetInr.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Syllabus modules */}
                    <div className="pt-1 flex flex-wrap gap-1 text-[11px]">
                      {c.syllabusModules.map((m, idx) => (
                        <span key={idx} className="bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                          • {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap lg:flex-col items-end gap-2 mt-4 lg:mt-0">
                    <button
                      onClick={() => setRegisterParticipantCourse(c)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition"
                    >
                      + Register Delegate
                    </button>

                    {c.participants.length > 0 && (
                      <button
                        onClick={() => {
                          setEvaluateModalCourse(c);
                          setSelectedPartId(c.participants[0].participantId);
                        }}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition"
                      >
                        Record Evaluation
                      </button>
                    )}

                    {c.stage !== 'CERTIFICATES_ISSUED' && c.participants.length > 0 && (
                      <button
                        onClick={() => handleIssueCertificates(c)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition"
                      >
                        Issue Batch Certificates
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedCourseId(isExpanded ? null : c.courseId)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition"
                    >
                      {isExpanded ? 'Hide Delegates' : `Delegates (${c.participants.length})`}
                    </button>

                    <button
                      onClick={() => setSealModalCourse(c)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition"
                    >
                      View Course Seal
                    </button>
                  </div>
                </div>

                {/* Delegates List Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                    <div className="text-xs font-semibold text-slate-300">Registered Delegates ({c.participants.length}):</div>
                    {c.participants.length === 0 ? (
                      <div className="text-xs text-slate-500 italic">No delegates registered yet for this workshop.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {c.participants.map((p) => (
                          <div
                            key={p.participantId}
                            className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 text-xs flex items-center justify-between"
                          >
                            <div>
                              <div className="font-semibold text-white">{p.fullName}</div>
                              <div className="text-slate-400 text-[11px]">{p.designation} - {p.institutionName}</div>
                              <div className="text-slate-500 text-[11px] font-mono">
                                Att: {p.attendancePercentage}% | Score: {p.mcqAssessmentScore !== undefined ? `${p.mcqAssessmentScore}%` : 'N/A'}
                              </div>
                            </div>
                            <div>
                              {p.certificateIssued ? (
                                <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-bold">
                                  CERTIFIED
                                </span>
                              ) : (
                                <span className="text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[11px]">
                                  PENDING
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: Propose New Workshop */}
      {isNewCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Propose Faculty Continuing Education Course</h2>
              <button onClick={() => setIsNewCourseModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Funding Scheme</label>
                  <select
                    value={scheme}
                    onChange={(e) => setScheme(e.target.value as FdpScheme)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="AICTE_ATAL_ACADEMY">AICTE ATAL Academy</option>
                    <option value="GIAN_INTERNATIONAL">MoE GIAN International</option>
                    <option value="INSTITUTE_SELF_FINANCED_QIP">Institute QIP Course</option>
                    <option value="INDUSTRY_COLLABORATIVE_STC">Industry Collaborative STC</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Coordinator Full Name</label>
                  <input
                    type="text"
                    value={coordinatorName}
                    onChange={(e) => setCoordinatorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Coordinator Employee ID</label>
                  <input
                    type="text"
                    value={coordinatorEmpId}
                    onChange={(e) => setCoordinatorEmpId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Delivery Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as CourseMode)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="HANDS_ON_BOOTCAMP">Hands-on Bootcamp</option>
                    <option value="OFFLINE_RESIDENTIAL">Offline Residential</option>
                    <option value="ONLINE_HYBRID">Online Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Capacity</label>
                  <input
                    type="number"
                    value={targetCapacity}
                    onChange={(e) => setTargetCapacity(Number(e.target.value))}
                    min={10}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Budget (INR)</label>
                  <input
                    type="number"
                    value={sanctionedBudgetInr}
                    onChange={(e) => setSanctionedBudgetInr(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewCourseModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium shadow"
                >
                  Submit Course Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Register Participant */}
      {registerParticipantCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Register Workshop Delegate</h2>
              <button onClick={() => setRegisterParticipantCourse(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterParticipant} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Parent Institution</label>
                <input
                  type="text"
                  value={partInst}
                  onChange={(e) => setPartInst(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Designation</label>
                  <input
                    type="text"
                    value={partDesig}
                    onChange={(e) => setPartDesig(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Official Email</label>
                  <input
                    type="email"
                    value={partEmail}
                    onChange={(e) => setPartEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRegisterParticipantCourse(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium shadow"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Record Evaluation */}
      {evaluateModalCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Record Delegate Evaluation</h2>
              <button onClick={() => setEvaluateModalCourse(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleEvaluateParticipant} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Select Delegate</label>
                <select
                  value={selectedPartId}
                  onChange={(e) => setSelectedPartId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                >
                  {evaluateModalCourse.participants.map((p) => (
                    <option key={p.participantId} value={p.participantId}>
                      {p.fullName} ({p.institutionName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Attendance % (Min 80%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={evalAttendance}
                    onChange={(e) => setEvalAttendance(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">MCQ Test % (Min 60%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={evalScore}
                    onChange={(e) => setEvalScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEvaluateModalCourse(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium shadow"
                >
                  Save Metrics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Course Seal Inspector */}
      {sealModalCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Cryptographic Course Seal Inspector</h2>
              <button onClick={() => setSealModalCourse(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-slate-500">Course Title:</div>
                <div className="font-semibold text-white">{sealModalCourse.courseTitle}</div>
              </div>
              <div>
                <div className="text-slate-500">Certificate Token:</div>
                <div className="font-mono text-emerald-400 font-semibold">{sealModalCourse.certificateToken}</div>
              </div>
              <div>
                <div className="text-slate-500">SHA-256 Course Digest:</div>
                <div className="font-mono text-cyan-400 break-all bg-slate-950 p-2.5 rounded border border-slate-800 select-all">
                  {sealModalCourse.cryptographicCourseSeal}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSealModalCourse(null)}
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
