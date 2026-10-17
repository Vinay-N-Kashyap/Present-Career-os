'use client';

import React, { useState } from 'react';
import {
  MoocNationalCoordinator,
  MoocContributionType,
  MoocCourseRecord,
  FourQuadrantCompleteness,
  INITIAL_MOOC_COURSES,
  UGC_MOOC_API_POINTS_MATRIX,
  MIN_PROCTORED_PASS_PERCENTAGE,
  evaluateQuadrantCompleteness,
  authorMoocCourse,
  updateQuadrantContent,
  recordProctoredExamResults,
  exportFacultyMoocCoursesCSV,
} from '@/lib/teacher/facultyMoocCourse';
import { useGovernanceStore } from '@/lib/hooks/useGovernanceStore';

export default function FacultyMoocCourseStudio() {
  const {
    records: courses,
    setRecords: setCourses,
    syncSource,
    isSaving,
    saveRecord,
  } = useGovernanceStore<MoocCourseRecord>(
    'faculty_mooc_courses',
    INITIAL_MOOC_COURSES,
    'courseId'
  );
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedCourse, setSelectedCourse] = useState<MoocCourseRecord | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQuadrantModal, setShowQuadrantModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showSealModal, setShowSealModal] = useState(false);

  // Add Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Computer Science & Engineering');
  const [newCoordName, setNewCoordName] = useState('Dr. Siddharth Sen');
  const [newCoordEmpId, setNewCoordEmpId] = useState('EMP-CSE-042');
  const [newNC, setNewNC] = useState<MoocNationalCoordinator>('NPTEL');
  const [newContribution, setNewContribution] = useState<MoocContributionType>('FOUR_CREDIT_MOOC_COURSE');
  const [newCredits, setNewCredits] = useState(4);
  const [newModules, setNewModules] = useState(12);
  const [newWeeks, setNewWeeks] = useState(12);
  const [newQ1, setNewQ1] = useState(true);
  const [newQ2, setNewQ2] = useState(true);
  const [newQ3, setNewQ3] = useState(false);
  const [newQ4, setNewQ4] = useState(false);

  // Quadrants Form State
  const [editQ1, setEditQ1] = useState(true);
  const [editQ2, setEditQ2] = useState(true);
  const [editQ3, setEditQ3] = useState(true);
  const [editQ4, setEditQ4] = useState(true);

  // Exam Form State
  const [examLearners, setExamLearners] = useState(1000);
  const [examPassPct, setExamPassPct] = useState(78.5);

  // Feedback Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showMsg = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // KPIs
  const totalCourses = courses.length;
  const totalApiScore = courses.reduce((sum, c) => sum + c.ugcApiPoints, 0);
  const totalLearners = courses.reduce((sum, c) => sum + c.enrolledLearnersCount, 0);
  const abcEligibleCount = courses.filter((c) => c.isAbcTransferEligible).length;
  const abcEligiblePct = totalCourses > 0 ? ((abcEligibleCount / totalCourses) * 100).toFixed(0) : '0';

  // Filters
  const filteredCourses = selectedStage === 'ALL'
    ? courses
    : courses.filter((c) => c.stage === selectedStage);

  // Handlers
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = authorMoocCourse({
        courseTitle: newTitle,
        department: newDept,
        leadCoordinatorName: newCoordName,
        leadCoordinatorEmpId: newCoordEmpId,
        nationalCoordinator: newNC,
        contributionType: newContribution,
        credits: Number(newCredits),
        totalModulesCount: Number(newModules),
        durationWeeks: Number(newWeeks),
        quadrants: {
          quadrant1ETutorial: newQ1,
          quadrant2EContent: newQ2,
          quadrant3WebResources: newQ3,
          quadrant4SelfAssessment: newQ4,
        },
      });

      await saveRecord(created);
      setShowAddModal(false);
      showMsg(`SWAYAM MOOC '${created.courseTitle}' proposal registered (${created.trackingToken}) with ${created.ugcApiPoints} UGC CAS points.`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleUpdateQuadrants = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    try {
      const updated = updateQuadrantContent(selectedCourse, {
        quadrant1ETutorial: editQ1,
        quadrant2EContent: editQ2,
        quadrant3WebResources: editQ3,
        quadrant4SelfAssessment: editQ4,
      });

      await saveRecord(updated);
      setSelectedCourse(updated);
      setShowQuadrantModal(false);
      const pct = evaluateQuadrantCompleteness(updated.quadrants);
      showMsg(`Updated 4-quadrant e-learning content (${pct}% complete). Stage: ${updated.stage}.`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleRecordExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    try {
      const updated = recordProctoredExamResults(selectedCourse, Number(examLearners), Number(examPassPct));
      await saveRecord(updated);
      setSelectedCourse(updated);
      setShowExamModal(false);
      if (updated.isAbcTransferEligible) {
        showMsg(`Proctored exam recorded (${updated.proctoredExamPassPercentage}% pass). Cleared for Academic Bank of Credits (ABC) transfer!`, 'success');
      } else {
        showMsg(`Proctored exam recorded. ABC transfer pending: Requires $\\ge 40\\%$ pass mark and 100% 4-quadrant completeness.`, 'error');
      }
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleExportCSV = () => {
    const csv = exportFacultyMoocCoursesCSV(courses);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Faculty_SWAYAM_MOOC_Courses_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showMsg('SWAYAM MOOC Courses Ledger CSV exported successfully.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌐</span>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Faculty SWAYAM MOOC & 4-Quadrant E-Content Studio
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
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Statutory Compliance: UGC (Credit Framework for Online Courses through SWAYAM) & MoE 4-Quadrant E-Learning Architecture (UGC Table 2 Category 3).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
          >
            <span>+</span> Author MOOC Course
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
          >
            <span>📥</span> Export SWAYAM CSV
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {notification && (
        <div
          className={`p-4 rounded-lg text-sm font-medium border ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/80 border-rose-800 text-rose-200'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">SWAYAM MOOC Courses</div>
          <div className="text-2xl font-bold text-white mt-2">{totalCourses}</div>
          <div className="text-slate-500 text-xs mt-1">Active Course Repositories</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total UGC CAS MOOC Points</div>
          <div className="text-2xl font-bold text-indigo-400 mt-2">{totalApiScore}</div>
          <div className="text-slate-500 text-xs mt-1">Table 2 Category 3 Verified</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Enrolled Online Learners</div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{totalLearners.toLocaleString()}</div>
          <div className="text-slate-500 text-xs mt-1">Across SWAYAM & NPTEL Portals</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">ABC Credit Transfer Rate</div>
          <div className="text-2xl font-bold text-amber-400 mt-2">{abcEligiblePct}%</div>
          <div className="text-slate-500 text-xs mt-1">{abcEligibleCount} of {totalCourses} Courses Cleared</div>
        </div>
      </div>

      {/* Lifecycle Stage Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {['ALL', 'PROPOSAL_SUBMITTED', 'NC_APPROVED', 'CONTENT_DEVELOPED', 'COURSE_LIVE_ON_SWAYAM', 'EXAM_CONDUCTED', 'ABC_CREDITS_TRANSFERRED'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStage(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedStage === st
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {st.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredCourses.map((c) => {
          const completeness = evaluateQuadrantCompleteness(c.quadrants);

          return (
            <div
              key={c.courseId}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-indigo-950 border border-indigo-800 text-indigo-300 rounded text-xs font-semibold">
                      {c.nationalCoordinator}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{c.trackingToken}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
                      {c.stage.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      UGC: {c.ugcApiPoints} API Points
                    </span>
                    {c.isAbcTransferEligible && (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-teal-950 text-teal-300 border border-teal-800">
                        🎓 ABC CREDIT TRANSFER CLEARED
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-1.5">{c.courseTitle}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Lead Coordinator: <span className="text-slate-200 font-medium">{c.leadCoordinatorName}</span> ({c.leadCoordinatorEmpId}) | Dept: <span className="text-slate-200">{c.department}</span> | {c.credits} Credits ({c.durationWeeks} Weeks, {c.totalModulesCount} Modules)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCourse(c);
                      setEditQ1(c.quadrants.quadrant1ETutorial);
                      setEditQ2(c.quadrants.quadrant2EContent);
                      setEditQ3(c.quadrants.quadrant3WebResources);
                      setEditQ4(c.quadrants.quadrant4SelfAssessment);
                      setShowQuadrantModal(true);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition"
                  >
                    Update 4-Quadrant Content
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(c);
                      setExamLearners(c.enrolledLearnersCount || 1000);
                      setExamPassPct(c.proctoredExamPassPercentage || 75.0);
                      setShowExamModal(true);
                    }}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium transition"
                  >
                    Record Proctored Exam & ABC
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(c);
                      setShowSealModal(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs font-medium transition"
                  >
                    View Cryptographic Seal
                  </button>
                </div>
              </div>

              {/* 4-Quadrant Completeness Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>MoE 4-Quadrant E-Learning Completeness ({completeness.toFixed(0)}%)</span>
                  <span className="font-semibold text-slate-200">{c.enrolledLearnersCount.toLocaleString()} Enrolled Learners</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
              </div>

              {/* Quadrant Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className={`p-3 rounded-lg border ${c.quadrants.quadrant1ETutorial ? 'bg-indigo-950/40 border-indigo-800/60' : 'bg-slate-950 border-slate-800 opacity-60'}`}>
                  <div className="font-semibold text-white">Quadrant I: e-Tutorial</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Video Lectures & Simulations</div>
                  <div className={`text-[10px] font-medium mt-1 ${c.quadrants.quadrant1ETutorial ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {c.quadrants.quadrant1ETutorial ? '✓ Developed & Indexed' : '○ Pending'}
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${c.quadrants.quadrant2EContent ? 'bg-indigo-950/40 border-indigo-800/60' : 'bg-slate-950 border-slate-800 opacity-60'}`}>
                  <div className="font-semibold text-white">Quadrant II: e-Content</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">e-Books, PDFs & Case Studies</div>
                  <div className={`text-[10px] font-medium mt-1 ${c.quadrants.quadrant2EContent ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {c.quadrants.quadrant2EContent ? '✓ Developed & Indexed' : '○ Pending'}
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${c.quadrants.quadrant3WebResources ? 'bg-indigo-950/40 border-indigo-800/60' : 'bg-slate-950 border-slate-800 opacity-60'}`}>
                  <div className="font-semibold text-white">Quadrant III: Web Resources</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Open-Access Links & Papers</div>
                  <div className={`text-[10px] font-medium mt-1 ${c.quadrants.quadrant3WebResources ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {c.quadrants.quadrant3WebResources ? '✓ Curated & Linked' : '○ Pending'}
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${c.quadrants.quadrant4SelfAssessment ? 'bg-indigo-950/40 border-indigo-800/60' : 'bg-slate-950 border-slate-800 opacity-60'}`}>
                  <div className="font-semibold text-white">Quadrant IV: Assessment</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">MCQs, Quizzes & Forums</div>
                  <div className={`text-[10px] font-medium mt-1 ${c.quadrants.quadrant4SelfAssessment ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {c.quadrants.quadrant4SelfAssessment ? '✓ Active Quizzes' : '○ Pending'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 1: Author MOOC */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white">🌐 Author SWAYAM / NPTEL MOOC Course</h3>
            <p className="text-xs text-slate-400">
              UGC Regulations (Credit Framework for Online Learning Courses through SWAYAM).
            </p>
            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Course Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Cloud-Native Distributed Systems"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">National Coordinator</label>
                  <select
                    value={newNC}
                    onChange={(e) => setNewNC(e.target.value as MoocNationalCoordinator)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="NPTEL">NPTEL (Engineering)</option>
                    <option value="CEC">CEC (UG Arts & Science)</option>
                    <option value="AICTE">AICTE (Technical PG/Self-Paced)</option>
                    <option value="IIMB">IIMB (Management)</option>
                    <option value="UGC">UGC (Non-Technical PG)</option>
                    <option value="IGNOU">IGNOU (Certificate/Diploma)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Lead Coordinator Name</label>
                  <input
                    type="text"
                    value={newCoordName}
                    onChange={(e) => setNewCoordName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Coordinator Employee ID</label>
                  <input
                    type="text"
                    value={newCoordEmpId}
                    onChange={(e) => setNewCoordEmpId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Contribution Type</label>
                  <select
                    value={newContribution}
                    onChange={(e) => setNewContribution(e.target.value as MoocContributionType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="FOUR_CREDIT_MOOC_COURSE">4-Credit Course (20 pts)</option>
                    <option value="TWO_CREDIT_MOOC_COURSE">2-Credit Course (10 pts)</option>
                    <option value="MOOC_MODULE_DEVELOPMENT">Module Dev (5 pts)</option>
                    <option value="COURSE_COORDINATOR_4_CREDIT">Coordinator (8 pts)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Credits</label>
                  <input
                    type="number"
                    value={newCredits}
                    onChange={(e) => setNewCredits(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    value={newWeeks}
                    onChange={(e) => setNewWeeks(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>

              {/* Initial Quadrants */}
              <div className="border-t border-slate-800 pt-2 space-y-1 text-slate-300">
                <div className="text-slate-400 font-semibold mb-1">MoE 4-Quadrant Architecture:</div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={newQ1} onChange={(e) => setNewQ1(e.target.checked)} />
                    <span>Q1: e-Tutorial</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={newQ2} onChange={(e) => setNewQ2(e.target.checked)} />
                    <span>Q2: e-Content</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={newQ3} onChange={(e) => setNewQ3(e.target.checked)} />
                    <span>Q3: Web Resources</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={newQ4} onChange={(e) => setNewQ4(e.target.checked)} />
                    <span>Q4: Self-Assessment</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
                >
                  Create Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Update Quadrants */}
      {showQuadrantModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">🧩 Update 4-Quadrant Content</h3>
            <p className="text-xs text-slate-400">
              Verify readiness of video lectures, digital reading materials, curated open-access resources, and end-module assessments.
            </p>
            <form onSubmit={handleUpdateQuadrants} className="space-y-3 text-xs">
              <div className="space-y-2 text-slate-300">
                <label className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800 cursor-pointer">
                  <input type="checkbox" checked={editQ1} onChange={(e) => setEditQ1(e.target.checked)} />
                  <div>
                    <div className="font-semibold text-white">Quadrant I: e-Tutorial</div>
                    <div className="text-[11px] text-slate-400">Audio/video lectures, animations, virtual lab simulations</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800 cursor-pointer">
                  <input type="checkbox" checked={editQ2} onChange={(e) => setEditQ2(e.target.checked)} />
                  <div>
                    <div className="font-semibold text-white">Quadrant II: e-Content</div>
                    <div className="text-[11px] text-slate-400">Downloadable text, digital e-Books, research papers</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800 cursor-pointer">
                  <input type="checkbox" checked={editQ3} onChange={(e) => setEditQ3(e.target.checked)} />
                  <div>
                    <div className="font-semibold text-white">Quadrant III: Web Resources</div>
                    <div className="text-[11px] text-slate-400">Related links, open-access papers, Wikipedia references</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800 cursor-pointer">
                  <input type="checkbox" checked={editQ4} onChange={(e) => setEditQ4(e.target.checked)} />
                  <div>
                    <div className="font-semibold text-white">Quadrant IV: Self-Assessment</div>
                    <div className="text-[11px] text-slate-400">MCQs, quizzes, problem sets, discussion forum moderation</div>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuadrantModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium"
                >
                  Save Quadrants
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Record Proctored Exam & ABC */}
      {showExamModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">🎓 Record Proctored Exam & ABC Transfer</h3>
            <p className="text-xs text-slate-400">
              National Testing Agency (NTA) proctored exam results. Minimum 40.0% required to clear Academic Bank of Credits (ABC) transfer.
            </p>
            <form onSubmit={handleRecordExam} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Total Enrolled SWAYAM Learners</label>
                <input
                  type="number"
                  value={examLearners}
                  onChange={(e) => setExamLearners(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Proctored Examination Pass %</label>
                <input
                  type="number"
                  step="0.1"
                  value={examPassPct}
                  onChange={(e) => setExamPassPct(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-400">
                Pass mark hurdle: <strong className="text-white">&ge; {MIN_PROCTORED_PASS_PERCENTAGE}%</strong>. Current 4-quadrant completeness: <strong className="text-indigo-400">{evaluateQuadrantCompleteness(selectedCourse.quadrants)}%</strong>. Both required for ABC eligibility.
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded font-medium"
                >
                  Save Exam & Clear ABC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Cryptographic Seal Inspector */}
      {showSealModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🔐</span> Tamper-Proof Cryptographic Course Seal
            </h3>
            <p className="text-xs text-slate-400">
              Immutable SHA-256 digest bound to course title, national coordinator, credits, 4-quadrant completeness, and ABC transfer status.
            </p>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
              {selectedCourse.cryptographicCourseSeal || 'PENDING_SEAL'}
            </div>
            <div className="space-y-1 text-xs text-slate-400">
              <div><strong className="text-slate-300">Tracking Token:</strong> {selectedCourse.trackingToken}</div>
              <div><strong className="text-slate-300">Course:</strong> {selectedCourse.courseTitle}</div>
              <div><strong className="text-slate-300">Coordinator:</strong> {selectedCourse.leadCoordinatorName}</div>
              <div><strong className="text-slate-300">Last Verified:</strong> {selectedCourse.lastUpdated}</div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSealModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium"
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
