'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  FacultyAppraisalReport,
  FacultyDesignation,
  AppraisalStatus,
  createFacultyAppraisal,
  getAppraisalsByInstitution,
  advanceAppraisalStatus,
  exportUgcCasAppraisalCSV,
  seedAppraisalData
} from '@/lib/teacher/facultyAppraisal';

interface FacultyAppraisalStudioProps {
  institutionId?: string;
  facultyId?: string;
  facultyName?: string;
  department?: string;
}

export const FacultyAppraisalStudio: React.FC<FacultyAppraisalStudioProps> = ({
  institutionId = 'inst-apex-001',
  facultyId = 'FAC-CSE-001',
  facultyName = 'Dr. Aris Thorne',
  department = 'Computer Science & Engineering',
}) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form State
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [designation, setDesignation] = useState<FacultyDesignation>('ASSISTANT_PROFESSOR_STAGE_2');

  // Cat I inputs
  const [lecturesDelivered, setLecturesDelivered] = useState(175);
  const [lecturesTarget, setLecturesTarget] = useState(180);
  const [examDuties, setExamDuties] = useState(5);
  const [pedagogyScore, setPedagogyScore] = useState(18);

  // Cat II inputs
  const [mentorshipHours, setMentorshipHours] = useState(24);
  const [committeesCount, setCommitteesCount] = useState(3);
  const [fdpCount, setFdpCount] = useState(2);

  // Cat III inputs
  const [wosPapers, setWosPapers] = useState(3);
  const [ugcPapers, setUgcPapers] = useState(1);
  const [patents, setPatents] = useState(1);
  const [phdGuided, setPhdGuided] = useState(1);
  const [grantINR, setGrantINR] = useState(3500000);

  // Initial Seed
  useEffect(() => {
    const existing = getAppraisalsByInstitution(institutionId);
    if (existing.length === 0) {
      seedAppraisalData(institutionId);
      setRefreshKey(k => k + 1);
    }
  }, [institutionId]);

  const appraisals = useMemo(() => {
    return getAppraisalsByInstitution(institutionId);
  }, [institutionId, refreshKey]);

  // Current faculty's latest appraisal
  const currentAppraisal = useMemo(() => {
    return appraisals.find(a => a.facultyId === facultyId) || appraisals[0];
  }, [appraisals, facultyId]);

  const handleExportCSV = () => {
    const csvContent = exportUgcCasAppraisalCSV(institutionId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `UGC_CAS_Appraisal_Report_${institutionId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateAppraisal = (e: React.FormEvent) => {
    e.preventDefault();

    createFacultyAppraisal({
      institutionId,
      facultyId,
      facultyName,
      department,
      currentDesignation: designation,
      academicYear,
      categoryI: {
        lecturesDeliveredHours: lecturesDelivered,
        lecturesTargetHours: lecturesTarget,
        examDutiesCompleted: examDuties,
        pedagogyInnovationScore: pedagogyScore
      },
      categoryII: {
        studentClubMentorshipHours: mentorshipHours,
        institutionalCommitteesCount: committeesCount,
        fdpConferencesOrganizedOrAttended: fdpCount
      },
      categoryIII: {
        scopusWosPapersCount: wosPapers,
        ugcCarePapersCount: ugcPapers,
        patentsGrantedCount: patents,
        phdScholarsGuided: phdGuided,
        sponsoredResearchFundsINR: grantINR
      }
    });

    setShowSubmitModal(false);
    setRefreshKey(k => k + 1);
  };

  const handleAdvanceStatus = (id: string, newStatus: AppraisalStatus) => {
    const comments = prompt('Enter review comments for sign-off:');
    if (comments !== null) {
      advanceAppraisalStatus(id, newStatus, comments);
      setRefreshKey(k => k + 1);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 bg-slate-900 text-slate-100 rounded-xl min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-purple-600/20 text-purple-400 rounded-lg border border-purple-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Faculty Annual Appraisal & UGC CAS Studio</h1>
              <p className="text-sm text-slate-400">
                UGC Career Advancement Scheme (CAS) • PBAS Self-Assessment • API Score Verification • HoD & Dean Sign-off
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            + Create New Appraisal
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CAS PBAS CSV
          </button>
        </div>
      </div>

      {currentAppraisal ? (
        <div className="space-y-6">
          {/* Promotion Eligibility Banner */}
          <div className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            currentAppraisal.eligibleForCasPromotion
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
          }`}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  currentAppraisal.eligibleForCasPromotion ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {currentAppraisal.eligibleForCasPromotion ? 'Eligible for CAS Promotion' : 'CAS Promotion In-Progress'}
                </span>
                <span className="text-xs text-slate-400 font-mono">Academic Year {currentAppraisal.academicYear}</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {currentAppraisal.eligibleForCasPromotion
                  ? `Recommended for Advancement to: ${currentAppraisal.targetPromotionDesignation?.replace(/_/g, ' ')}`
                  : 'Currently compiling required research API & teaching benchmarks'}
              </h3>
              <p className="text-xs text-slate-300">
                Designation: <span className="font-semibold text-white">{currentAppraisal.currentDesignation.replace(/_/g, ' ')}</span> • Overall Rating: <span className="font-semibold text-white">{currentAppraisal.overallRating}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1.5 rounded-lg font-mono font-bold uppercase border ${
                currentAppraisal.status === 'DEAN_APPROVED'
                  ? 'bg-emerald-900/60 text-emerald-300 border-emerald-600'
                  : currentAppraisal.status === 'HOD_REVIEWED'
                  ? 'bg-blue-900/60 text-blue-300 border-blue-600'
                  : 'bg-amber-900/60 text-amber-300 border-amber-600'
              }`}>
                Stage: {currentAppraisal.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* KPI Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category I: Teaching */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category I: Teaching</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-extrabold text-blue-400">{currentAppraisal.categoryIScore}</h3>
                <span className="text-xs text-slate-400">/ 100 max</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${currentAppraisal.categoryIScore}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {currentAppraisal.categoryI.lecturesDeliveredHours}/{currentAppraisal.categoryI.lecturesTargetHours} Lecture Hours
              </p>
            </div>

            {/* Category II: Governance */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category II: Governance</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-extrabold text-purple-400">{currentAppraisal.categoryIIScore}</h3>
                <span className="text-xs text-slate-400">/ 50 max</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentAppraisal.categoryIIScore / 50) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {currentAppraisal.categoryII.institutionalCommitteesCount} Committees • {currentAppraisal.categoryII.studentClubMentorshipHours}h Mentorship
              </p>
            </div>

            {/* Category III: Research API */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category III: Research API</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-extrabold text-emerald-400">{currentAppraisal.categoryIIIScore}</h3>
                <span className="text-xs text-slate-400">points (uncapped)</span>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                {currentAppraisal.categoryIII.scopusWosPapersCount} WoS Papers • {currentAppraisal.categoryIII.patentsGrantedCount} Patents • ₹{(currentAppraisal.categoryIII.sponsoredResearchFundsINR / 100000).toFixed(1)}L Grants
              </p>
            </div>

            {/* Composite API Score */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Composite API</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-extrabold text-amber-400">{currentAppraisal.totalCompositeApiScore}</h3>
                <span className="text-xs text-slate-400">cumulative score</span>
              </div>
              <span className={`inline-block mt-3 text-xs px-2.5 py-0.5 rounded font-bold uppercase border ${
                currentAppraisal.overallRating === 'OUTSTANDING'
                  ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40'
                  : 'bg-blue-900/40 text-blue-300 border-blue-500/40'
              }`}>
                Rating: {currentAppraisal.overallRating}
              </span>
            </div>
          </div>

          {/* Institutional Review Sign-off Stepper */}
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Appraisal Review & Statutory Endorsement Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Faculty Step */}
              <div className={`p-4 rounded-lg border space-y-2 ${
                currentAppraisal.facultySignatureDate
                  ? 'bg-slate-900/80 border-emerald-500/50'
                  : 'bg-slate-900/40 border-slate-700'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">1. Faculty Self-Assessment</span>
                  <span className={currentAppraisal.facultySignatureDate ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {currentAppraisal.facultySignatureDate ? 'Submitted' : 'Pending'}
                  </span>
                </div>
                <p className="text-slate-400">Signed: {currentAppraisal.facultyName}</p>
                {currentAppraisal.status === 'DRAFT' && (
                  <button
                    onClick={() => handleAdvanceStatus(currentAppraisal.id, 'SUBMITTED_BY_FACULTY')}
                    className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded mt-2"
                  >
                    Submit to HoD
                  </button>
                )}
              </div>

              {/* HoD Step */}
              <div className={`p-4 rounded-lg border space-y-2 ${
                currentAppraisal.hodSignatureDate
                  ? 'bg-slate-900/80 border-emerald-500/50'
                  : 'bg-slate-900/40 border-slate-700'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">2. HoD Verification</span>
                  <span className={currentAppraisal.hodSignatureDate ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {currentAppraisal.hodSignatureDate ? 'Endorsed' : 'Awaiting Review'}
                  </span>
                </div>
                <p className="text-slate-400">{currentAppraisal.hodComments || 'Department verification pending'}</p>
                {currentAppraisal.status === 'SUBMITTED_BY_FACULTY' && (
                  <button
                    onClick={() => handleAdvanceStatus(currentAppraisal.id, 'HOD_REVIEWED')}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded mt-2"
                  >
                    HoD Endorse & Forward
                  </button>
                )}
              </div>

              {/* Dean Step */}
              <div className={`p-4 rounded-lg border space-y-2 ${
                currentAppraisal.deanSignatureDate
                  ? 'bg-slate-900/80 border-emerald-500/50'
                  : 'bg-slate-900/40 border-slate-700'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">3. Dean & Academic Council</span>
                  <span className={currentAppraisal.deanSignatureDate ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {currentAppraisal.deanSignatureDate ? 'Approved' : 'Awaiting Approval'}
                  </span>
                </div>
                <p className="text-slate-400">{currentAppraisal.deanComments || 'Dean review following HoD endorsement'}</p>
                {currentAppraisal.status === 'HOD_REVIEWED' && (
                  <button
                    onClick={() => handleAdvanceStatus(currentAppraisal.id, 'DEAN_APPROVED')}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded mt-2"
                  >
                    Dean Final Approval
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400">
          No appraisal records on file. Click "+ Create New Appraisal" to begin your annual self-assessment.
        </div>
      )}

      {/* New Appraisal Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create Annual UGC CAS Appraisal (PBAS)</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateAppraisal} className="space-y-4 text-sm max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Academic Year</label>
                  <input
                    type="text"
                    required
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Current Designation</label>
                  <select
                    value={designation}
                    onChange={e => setDesignation(e.target.value as FacultyDesignation)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="ASSISTANT_PROFESSOR_STAGE_1">Assistant Professor (Stage 1)</option>
                    <option value="ASSISTANT_PROFESSOR_STAGE_2">Assistant Professor (Stage 2)</option>
                    <option value="ASSISTANT_PROFESSOR_STAGE_3">Assistant Professor (Stage 3)</option>
                    <option value="ASSOCIATE_PROFESSOR">Associate Professor</option>
                    <option value="PROFESSOR">Full Professor</option>
                  </select>
                </div>
              </div>

              {/* Category I */}
              <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Category I: Teaching & Evaluation</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Lectures Delivered (Hours)</label>
                    <input
                      type="number"
                      value={lecturesDelivered}
                      onChange={e => setLecturesDelivered(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Target Lectures (Hours)</label>
                    <input
                      type="number"
                      value={lecturesTarget}
                      onChange={e => setLecturesTarget(parseInt(e.target.value) || 180)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Exam Duties Completed</label>
                    <input
                      type="number"
                      value={examDuties}
                      onChange={e => setExamDuties(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Pedagogy Innovation (0-20)</label>
                    <input
                      type="number"
                      max={20}
                      value={pedagogyScore}
                      onChange={e => setPedagogyScore(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Category II */}
              <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">Category II: Governance & Extension</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Club Mentorship (Hours)</label>
                    <input
                      type="number"
                      value={mentorshipHours}
                      onChange={e => setMentorshipHours(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Committees Count</label>
                    <input
                      type="number"
                      value={committeesCount}
                      onChange={e => setCommitteesCount(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">FDPs Attended/Held</label>
                    <input
                      type="number"
                      value={fdpCount}
                      onChange={e => setFdpCount(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Category III */}
              <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Category III: Research & API Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Scopus/WoS Papers (15 pts ea)</label>
                    <input
                      type="number"
                      value={wosPapers}
                      onChange={e => setWosPapers(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">UGC-CARE Papers (10 pts ea)</label>
                    <input
                      type="number"
                      value={ugcPapers}
                      onChange={e => setUgcPapers(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Patents Granted (25 pts ea)</label>
                    <input
                      type="number"
                      value={patents}
                      onChange={e => setPatents(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">PhD Scholars Guided</label>
                    <input
                      type="number"
                      value={phdGuided}
                      onChange={e => setPhdGuided(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Sanctioned Research Grant INR</label>
                  <input
                    type="number"
                    value={grantINR}
                    onChange={e => setGrantINR(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold"
                >
                  Generate Appraisal Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
