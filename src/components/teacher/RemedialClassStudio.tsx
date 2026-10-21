'use client';

import React, { useState } from 'react';
import {
  SlowLearnerProfile,
  RemedialBatch,
  getAllSlowLearners,
  getAllRemedialBatches,
  screenStudentForRemedial,
  createRemedialBatch,
  enrollStudentInRemedialBatch,
  recordPostRemedialAssessment,
  exportRemedialLedgerCSV,
} from '@/lib/teacher/remedialClasses';

export default function RemedialClassStudio() {
  const [slowLearners, setSlowLearners] = useState<SlowLearnerProfile[]>(() => {
    const existing = getAllSlowLearners();
    if (existing.length > 0) return existing;

    // Seed realistic initial cohort
    const s1 = screenStudentForRemedial({
      studentId: 'STU-REM-01',
      studentName: 'Karthik Subbaraj',
      rollNumber: '22CS014',
      department: 'Computer Science',
      courseCode: 'CS201',
      courseName: 'Data Structures & Algorithms',
      semester: 3,
      diagnosticScore: 32,
      midtermScore: 38,
      questCompletionRate: 35,
      primaryCause: 'CONCEPT_CONFUSION',
    })!;

    const s2 = screenStudentForRemedial({
      studentId: 'STU-REM-02',
      studentName: 'Sneha Banerjee',
      rollNumber: '22CS029',
      department: 'Computer Science',
      courseCode: 'CS201',
      courseName: 'Data Structures & Algorithms',
      semester: 3,
      diagnosticScore: 35,
      midtermScore: 42,
      questCompletionRate: 40,
      primaryCause: 'PRACTICE_DEFICIT',
    })!;

    const s3 = screenStudentForRemedial({
      studentId: 'STU-REM-03',
      studentName: 'Aditya Choudhury',
      rollNumber: '22EC011',
      department: 'Electronics & Communication',
      courseCode: 'EC202',
      courseName: 'Signals & Systems',
      semester: 3,
      diagnosticScore: 28,
      midtermScore: 44,
      questCompletionRate: 38,
      primaryCause: 'MATHEMATICAL_FOUNDATION',
    })!;

    // Complete s1 with post-assessment demo
    recordPostRemedialAssessment(s1.studentId, 72);

    return getAllSlowLearners();
  });

  const [batches, setBatches] = useState<RemedialBatch[]>(() => {
    const existing = getAllRemedialBatches();
    if (existing.length > 0) return existing;

    const b1 = createRemedialBatch({
      id: 'BATCH-CS201-B1',
      batchCode: 'REM-CS201-B1',
      courseCode: 'CS201',
      courseName: 'Data Structures & Algorithms',
      facultyId: 'FAC-201',
      facultyName: 'Dr. Meenakshi Sundaram',
      targetedConcept: 'Pointer Arithmetic, Linked Lists & Tree Recursion',
      maxCapacity: 15,
      targetGraduationDate: '2026-11-30',
    });

    enrollStudentInRemedialBatch(b1.id, 'STU-REM-01');
    enrollStudentInRemedialBatch(b1.id, 'STU-REM-02');

    return getAllRemedialBatches();
  });

  const [activeTab, setActiveTab] = useState<'RADAR' | 'BATCHES'>('RADAR');

  // Modals
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [newBatchCode, setNewBatchCode] = useState('REM-EC202-B1');
  const [newCourseCode, setNewCourseCode] = useState('EC202');
  const [newCourseName, setNewCourseName] = useState('Signals & Systems');
  const [newTargetedConcept, setNewTargetedConcept] = useState('Fourier Transform & Z-Domain Stability');
  const [newMaxCapacity, setNewMaxCapacity] = useState(15);

  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [postAssessmentScore, setPostAssessmentScore] = useState<number>(65);

  // Stats calculation
  const totalIdentified = slowLearners.length;
  const activeBatchesCount = batches.filter((b) => b.isActive).length;
  const evaluatedStudents = slowLearners.filter((s) => s.learningGainPercentage !== undefined);
  const avgLearningGain =
    evaluatedStudents.length > 0
      ? Math.round(
          evaluatedStudents.reduce((acc, s) => acc + (s.learningGainPercentage || 0), 0) /
            evaluatedStudents.length
        )
      : 0;
  const graduatedCount = slowLearners.filter((s) => s.state === 'GRADUATED_FROM_REMEDIAL').length;
  const graduationRate = totalIdentified > 0 ? Math.round((graduatedCount / totalIdentified) * 100) : 0;

  const handleDownloadCSV = () => {
    try {
      const csv = exportRemedialLedgerCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `NAAC_2.2.1_Remedial_Progression_Ledger.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: any) {
      alert(`Error exporting CSV: ${e.message}`);
    }
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const b = createRemedialBatch({
        id: `BATCH-${Date.now()}`,
        batchCode: newBatchCode,
        courseCode: newCourseCode,
        courseName: newCourseName,
        facultyId: 'FAC-201',
        facultyName: 'Dr. Meenakshi Sundaram',
        targetedConcept: newTargetedConcept,
        maxCapacity: Number(newMaxCapacity),
        targetGraduationDate: '2026-12-15',
      });
      setBatches(getAllRemedialBatches());
      setShowBatchModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRecordAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    try {
      recordPostRemedialAssessment(selectedStudentId, Number(postAssessmentScore));
      setSlowLearners(getAllSlowLearners());
      setShowAssessmentModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8 font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              NAAC Criterion 2.2.1
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Differentiated Instruction & Remedial Cell
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Faculty Remedial Studio & Slow Learner Tracking
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Diagnostic multi-metric student screening, customized small-batch remedial sessions, and normalized learning gain telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold rounded-lg shadow-sm transition flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export NAAC 2.2.1 CSV
          </button>

          <button
            onClick={() => setShowBatchModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow-sm transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Schedule Remedial Batch
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Identified Slow Learners</p>
            <p className="text-3xl font-bold text-amber-400 mt-1">{totalIdentified}</p>
            <p className="text-xs text-amber-400/80 mt-1">Midterms &lt; 50% or Diag &lt; 40%</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Active Remedial Batches</p>
            <p className="text-3xl font-bold text-blue-400 mt-1">{activeBatchesCount}</p>
            <p className="text-xs text-blue-400/80 mt-1">Max 15-20 students per cohort</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Avg Normalized Learning Gain</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">+{avgLearningGain}%</p>
            <p className="text-xs text-emerald-400/80 mt-1">Hake&apos;s normalized gain index</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Remedial Graduation Rate</p>
            <p className="text-3xl font-bold text-purple-400 mt-1">{graduationRate}%</p>
            <p className="text-xs text-purple-400/80 mt-1">{graduatedCount} out of {totalIdentified} scored &gt;= 60%</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 flex gap-4">
        <button
          onClick={() => setActiveTab('RADAR')}
          className={`pb-3 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'RADAR'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Slow Learners Identification Radar & Cohort Ledger
        </button>
        <button
          onClick={() => setActiveTab('BATCHES')}
          className={`pb-3 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'BATCHES'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Remedial Batches & Small-Group Scheduling
        </button>
      </div>

      {activeTab === 'RADAR' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">Screened Slow Learners Cohort</h2>
                <p className="text-xs text-slate-400 mt-0.5">Students identified with learning deficits needing personalized faculty scaffolding</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Identified Cause</th>
                    <th className="py-3 px-4">Pre-Score</th>
                    <th className="py-3 px-4">Post-Score</th>
                    <th className="py-3 px-4">Normalized Gain</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {slowLearners.map((student) => {
                    const isGraduated = student.state === 'GRADUATED_FROM_REMEDIAL';
                    return (
                      <tr key={student.studentId} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-white">{student.studentName}</p>
                          <p className="text-xs text-slate-400 font-mono">{student.rollNumber} • Sem {student.semester}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs font-bold text-emerald-400">{student.courseCode}</span>
                          <p className="text-[11px] text-slate-400">{student.courseName}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            {student.primaryCause.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-red-400">
                          {student.preRemedialScore}%
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {student.postRemedialScore !== undefined ? `${student.postRemedialScore}%` : '—'}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          {student.learningGainPercentage !== undefined ? `+${student.learningGainPercentage}%` : '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              isGraduated
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {student.state.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedStudentId(student.studentId);
                              setShowAssessmentModal(true);
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded border border-slate-700 transition"
                          >
                            Record Post-Test
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'BATCHES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => (
              <div key={batch.id} className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {batch.batchCode}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{batch.courseCode} - {batch.courseName}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Active Cohort
                  </span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs space-y-1">
                  <p className="text-slate-400"><strong className="text-slate-300">Target Concept:</strong> {batch.targetedConcept}</p>
                  <p className="text-slate-400"><strong className="text-slate-300">Instructor:</strong> {batch.facultyName}</p>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>Enrolled: <strong className="text-white">{batch.enrolledStudentIds.length}</strong> / {batch.maxCapacity}</span>
                  <span>Sessions: <strong className="text-emerald-400">{batch.totalSessionsConducted}</strong> conducted</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create Customized Remedial Batch</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Batch Code</label>
                <input
                  type="text"
                  required
                  value={newBatchCode}
                  onChange={(e) => setNewBatchCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Max Capacity (&le; 20)</label>
                  <input
                    type="number"
                    max={20}
                    min={5}
                    value={newMaxCapacity}
                    onChange={(e) => setNewMaxCapacity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Targeted Weak Concept / Module</label>
                <input
                  type="text"
                  required
                  value={newTargetedConcept}
                  onChange={(e) => setNewTargetedConcept(e.target.value)}
                  placeholder="e.g. Memory pointers, recursion, state machines"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition shadow"
                >
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Record Post-Remedial Assessment</h3>
              <button onClick={() => setShowAssessmentModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleRecordAssessment} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Post-Remedial Test Score (0 - 100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={postAssessmentScore}
                  onChange={(e) => setPostAssessmentScore(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-emerald-500 outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Scores &ge; 60% automatically qualify student for remedial graduation.</p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAssessmentModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition shadow"
                >
                  Save & Compute Gain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
