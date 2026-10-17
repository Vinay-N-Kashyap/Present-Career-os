'use client';

import React, { useState, useMemo } from 'react';
import {
  PeerObservationRecord,
  AcademicAuditType,
  RubricScores,
  SEED_OBSERVATIONS,
  schedulePeerObservation,
  submitObservationReport,
  facultyAcknowledgeAudit,
  exportAcademicAuditLedgerCSV,
} from '@/lib/teacher/academicAudit';
import { useGovernanceStore } from '@/lib/hooks/useGovernanceStore';

export default function AcademicAuditStudio() {
  const {
    records: observations,
    setRecords: setObservations,
    syncSource,
    isSaving,
    saveRecord
  } = useGovernanceStore<PeerObservationRecord>(
    'faculty_academic_audits',
    SEED_OBSERVATIONS,
    'auditId'
  );
  const [selectedType, setSelectedType] = useState<AcademicAuditType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [reportModalObs, setReportModalObs] = useState<PeerObservationRecord | null>(null);
  const [ackModalObs, setAckModalObs] = useState<PeerObservationRecord | null>(null);
  const [sealModalObs, setSealModalObs] = useState<PeerObservationRecord | null>(null);

  // Schedule Form State
  const [facultyInstructor, setFacultyInstructor] = useState('Dr. Vivek Bhattacharya');
  const [peerAuditor, setPeerAuditor] = useState('Dr. Aruna Chatterjee (HoD Biotechnology)');
  const [department, setDepartment] = useState('Biotechnology & Biomedical Engineering');
  const [courseCode, setCourseCode] = useState('BT-302');
  const [courseTitle, setCourseTitle] = useState('Genetic Engineering & Recombinant DNA');
  const [topicTaught, setTopicTaught] = useState('CRISPR-Cas9 Guide RNA Design');
  const [classBatch, setClassBatch] = useState('B.Tech Biotech 6th Sem');
  const [scheduledDate, setScheduledDate] = useState('2026-03-10');

  // Report Submission Form State
  const [scores, setScores] = useState<RubricScores>({
    coursePlanAdherence: 4.5,
    activeLearningEngagement: 4.5,
    ictIntegration: 4.5,
    formativeAssessment: 4.0,
    inclusivityAndSupport: 4.5,
  });
  const [commendations, setCommendations] = useState('Effective student participation in CRISPR sequence analysis exercise.');
  const [recommendations, setRecommendations] = useState('Introduce a 5-minute diagnostic poll at midpoint.');

  // Acknowledgement Form State
  const [facultyRemarks, setFacultyRemarks] = useState('Feedback gratefully received. Midpoint polling integrated into lesson plan.');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Observations
  const filteredObservations = useMemo(() => {
    return observations.filter((o) => {
      const matchesType = selectedType === 'ALL' || o.auditType === selectedType;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        o.auditRefNumber.toLowerCase().includes(q) ||
        o.facultyInstructor.toLowerCase().includes(q) ||
        o.peerAuditor.toLowerCase().includes(q) ||
        o.courseCode.toLowerCase().includes(q) ||
        o.topicTaught.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [observations, selectedType, searchQuery]);

  // Telemetry Stats
  const stats = useMemo(() => {
    const total = observations.length;
    const completed = observations.filter((o) => o.compositeAqi !== undefined);
    const avgAqi =
      completed.length > 0
        ? (completed.reduce((acc, o) => acc + (o.compositeAqi || 0), 0) / completed.length).toFixed(2)
        : '4.50';
    const pendingAck = observations.filter((o) => o.stage === 'REPORT_SUBMITTED').length;
    const scheduled = observations.filter((o) => o.stage === 'OBSERVATION_SCHEDULED').length;
    return { total, completedCount: completed.length, avgAqi, pendingAck, scheduled };
  }, [observations]);

  const handleScheduleObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyInstructor.trim() || !courseCode.trim() || !topicTaught.trim()) {
      showToast('Please provide complete instructor, course, and topic information');
      return;
    }

    const created = schedulePeerObservation({
      facultyInstructor: facultyInstructor.trim(),
      peerAuditor: peerAuditor.trim(),
      department: department.trim(),
      courseCode: courseCode.trim(),
      courseTitle: courseTitle.trim(),
      topicTaught: topicTaught.trim(),
      classBatch: classBatch.trim(),
      scheduledDate,
    });

    setObservations([created, ...observations]);
    await saveRecord(created);
    setIsScheduleModalOpen(false);
    showToast(`Peer observation ${created.auditRefNumber} scheduled successfully!`);
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportModalObs) return;

    try {
      const updated = submitObservationReport(reportModalObs, {
        scores,
        commendations: commendations.trim(),
        recommendations: recommendations.trim(),
        observationDate: new Date().toISOString().split('T')[0],
      });

      setObservations(observations.map((o) => (o.auditId === updated.auditId ? updated : o)));
      await saveRecord(updated);
      setReportModalObs(null);
      showToast(`Observation report submitted with AQI ${updated.compositeAqi} and SHA-256 seal!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting report';
      showToast(`Submission failed: ${msg}`);
    }
  };

  const handleAcknowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ackModalObs || !facultyRemarks.trim()) {
      showToast('Please provide your acknowledgement remarks');
      return;
    }

    const updated = facultyAcknowledgeAudit(ackModalObs, facultyRemarks.trim());
    setObservations(observations.map((o) => (o.auditId === updated.auditId ? updated : o)));
    await saveRecord(updated);
    setAckModalObs(null);
    showToast(`Feedback acknowledged for ${updated.auditRefNumber}!`);
  };

  const handleExportCSV = () => {
    const csv = exportAcademicAuditLedgerCSV(observations);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NAAC_Criterion_2_3_1_Academic_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('NAAC Criterion 2.3.1 academic audit CSV exported successfully');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl text-sm font-medium animate-bounce flex items-center gap-2 border border-emerald-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full font-semibold tracking-wide border border-amber-500/30 uppercase">
                NAAC Criterion 2.3.1 & IQAC
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold tracking-wide border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Peer Pedagogy Observation
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Faculty Academic Audit & Peer Teaching Observation Studio
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Internal Quality Assurance Cell (IQAC) annual peer observation rubric evaluating course plan adherence,
              active learning, ICT integration, formative assessment, and classroom inclusivity.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${syncSource === 'supabase' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{syncSource === 'supabase' ? 'Live Supabase DB' : syncSource === 'local_storage' ? 'Local Persistence' : 'Runtime Cache'}</span>
              {isSaving && <span className="text-cyan-400 ml-1">(saving...)</span>}
            </div>
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 border border-amber-400/40 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Schedule Peer Observation
            </button>
            <button
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-xl transition flex items-center gap-2 border border-slate-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export NAAC CSV
            </button>
          </div>
        </div>
      </div>

      {/* KPI Telemetry */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Observations</p>
          <p className="text-2xl md:text-3xl font-extrabold text-white mt-1">{stats.total}</p>
          <div className="text-xs text-amber-400 mt-2 flex items-center gap-1 font-medium">
            <span>{stats.scheduled} upcoming</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Department AQI</p>
          <p className="text-2xl md:text-3xl font-extrabold text-emerald-400 mt-1">{stats.avgAqi} / 5.0</p>
          <div className="text-xs text-emerald-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>Exemplary Grade A++</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Reports</p>
          <p className="text-2xl md:text-3xl font-extrabold text-sky-400 mt-1">{stats.completedCount}</p>
          <div className="text-xs text-sky-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>Peer rubrics logged</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Ack</p>
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 mt-1">{stats.pendingAck}</p>
          <div className="text-xs text-amber-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>Awaiting faculty response</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              'ALL',
              'PEER_CLASSROOM_TEACHING_OBSERVATION',
              'ANNUAL_DEPARTMENTAL_ACADEMIC_AUDIT',
              'COURSE_FILE_AND_SYLLABUS_AUDIT',
            ] as const
          ).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`text-xs px-3.5 py-2 rounded-xl font-medium transition border ${
                selectedType === t
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {t === 'ALL'
                ? 'All Audits'
                : t
                    .split('_')
                    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
                    .join(' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search instructor, course, topic..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Observation Cards List */}
      <div className="space-y-6">
        {filteredObservations.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-slate-400 font-medium">No peer observation records found</p>
          </div>
        ) : (
          filteredObservations.map((obs) => {
            const isCompleted = obs.compositeAqi !== undefined;

            return (
              <div
                key={obs.auditId}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition shadow-lg space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700/50 px-2.5 py-1 rounded-md">
                      {obs.auditRefNumber}
                    </span>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                      {obs.auditType.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono text-xs bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-800">
                      {obs.courseCode}
                    </span>
                    <span className="text-xs bg-slate-800/70 text-slate-400 px-2.5 py-0.5 rounded-full">
                      {obs.classBatch}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {obs.qualityGrade && (
                      <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {obs.qualityGrade}
                      </span>
                    )}
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                        obs.stage === 'FACULTY_ACKNOWLEDGED' || obs.stage === 'IQAC_ACTION_LOCKED'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : obs.stage === 'REPORT_SUBMITTED'
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {obs.stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-base font-bold text-white">
                    {obs.courseTitle} — <span className="text-amber-400">{obs.topicTaught}</span>
                  </h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400 mt-2">
                    <span>
                      <strong className="text-slate-300">Instructor:</strong> {obs.facultyInstructor}
                    </span>
                    <span>
                      <strong className="text-slate-300">Peer Auditor:</strong> {obs.peerAuditor}
                    </span>
                    <span>
                      <strong className="text-slate-300">Date:</strong> {obs.observationDate || obs.scheduledDate}
                    </span>
                  </div>
                </div>

                {/* Rubric Breakdown Grid */}
                {obs.scores && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 text-xs">
                    <div>
                      <span className="text-slate-400 block">Course Plan:</span>
                      <span className="text-emerald-400 font-bold text-sm">{obs.scores.coursePlanAdherence} / 5.0</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Active Learning:</span>
                      <span className="text-emerald-400 font-bold text-sm">{obs.scores.activeLearningEngagement} / 5.0</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">ICT Integration:</span>
                      <span className="text-emerald-400 font-bold text-sm">{obs.scores.ictIntegration} / 5.0</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Formative Assmt:</span>
                      <span className="text-emerald-400 font-bold text-sm">{obs.scores.formativeAssessment} / 5.0</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Inclusivity:</span>
                      <span className="text-emerald-400 font-bold text-sm">{obs.scores.inclusivityAndSupport} / 5.0</span>
                    </div>
                  </div>
                )}

                {/* Qualitative Feedback */}
                {(obs.commendations || obs.recommendations || obs.facultyRemarks) && (
                  <div className="space-y-2 text-xs">
                    {obs.commendations && (
                      <div className="bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-xl text-emerald-300">
                        <strong>Commendations:</strong> {obs.commendations}
                      </div>
                    )}
                    {obs.recommendations && (
                      <div className="bg-amber-950/20 border border-amber-900/30 p-2.5 rounded-xl text-amber-300">
                        <strong>Areas for Pedagogical Enhancement:</strong> {obs.recommendations}
                      </div>
                    )}
                    {obs.facultyRemarks && (
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-300 italic">
                        <strong>Faculty Acknowledgement:</strong> {obs.facultyRemarks}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-slate-800/60">
                  <div className="text-xs text-slate-400">
                    {isCompleted
                      ? `Composite Academic Quality Index: ${obs.compositeAqi} / 5.00`
                      : 'Classroom observation scheduled'}
                  </div>

                  <div className="flex items-center gap-2">
                    {obs.cryptographicSeal && (
                      <button
                        onClick={() => setSealModalObs(obs)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Inspect Audit Seal
                      </button>
                    )}

                    {obs.stage === 'OBSERVATION_SCHEDULED' && (
                      <button
                        onClick={() => setReportModalObs(obs)}
                        className="text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium px-3.5 py-1.5 rounded-lg transition border border-amber-400/40"
                      >
                        Submit Observation Report
                      </button>
                    )}

                    {obs.stage === 'REPORT_SUBMITTED' && (
                      <button
                        onClick={() => setAckModalObs(obs)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3.5 py-1.5 rounded-lg transition border border-emerald-400/40"
                      >
                        Acknowledge Feedback
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Schedule Peer Observation */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Schedule Peer Teaching Observation</h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleObservation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Faculty Instructor Being Observed
                  </label>
                  <input
                    type="text"
                    required
                    value={facultyInstructor}
                    onChange={(e) => setFacultyInstructor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Peer Auditor / Observer
                  </label>
                  <input
                    type="text"
                    required
                    value={peerAuditor}
                    onChange={(e) => setPeerAuditor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. CS-402"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    required
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g. Distributed Cloud Computing"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Topic to be Observed
                  </label>
                  <input
                    type="text"
                    required
                    value={topicTaught}
                    onChange={(e) => setTopicTaught(e.target.value)}
                    placeholder="e.g. Byzantine Fault Tolerance"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Class Cohort / Batch
                  </label>
                  <input
                    type="text"
                    required
                    value={classBatch}
                    onChange={(e) => setClassBatch(e.target.value)}
                    placeholder="e.g. B.Tech CSE 7th Sem"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Scheduled Observation Date
                </label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Submit Observation Report */}
      {reportModalObs && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Peer Pedagogy Rubric Scoring</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{reportModalObs.auditRefNumber}</p>
              </div>
              <button
                onClick={() => setReportModalObs(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  5 Pedagogical Dimensions (Score 1.0 to 5.0)
                </p>

                {[
                  { key: 'coursePlanAdherence', label: 'Course Plan & Lesson Adherence' },
                  { key: 'activeLearningEngagement', label: 'Active Learning & Student Engagement' },
                  { key: 'ictIntegration', label: 'ICT Tools, LMS & Digital Integration' },
                  { key: 'formativeAssessment', label: 'Formative Assessment & Continuous Feedback' },
                  { key: 'inclusivityAndSupport', label: 'Inclusivity & Query Responsiveness' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-4 text-xs">
                    <span className="text-slate-300">{item.label}</span>
                    <input
                      type="number"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      required
                      value={scores[item.key as keyof RubricScores]}
                      onChange={(e) =>
                        setScores({
                          ...scores,
                          [item.key]: Number(e.target.value),
                        })
                      }
                      className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-center font-bold text-emerald-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Commendations (Strengths Observed)
                </label>
                <textarea
                  rows={2}
                  required
                  value={commendations}
                  onChange={(e) => setCommendations(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Areas for Pedagogical Enhancement
                </label>
                <textarea
                  rows={2}
                  required
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReportModalObs(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Submit & Seal Audit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Faculty Acknowledgement */}
      {ackModalObs && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Faculty Observation Acknowledgement</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{ackModalObs.auditRefNumber}</p>
              </div>
              <button
                onClick={() => setAckModalObs(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAcknowledge} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Faculty Action Plan & Response
                </label>
                <textarea
                  rows={3}
                  required
                  value={facultyRemarks}
                  onChange={(e) => setFacultyRemarks(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAckModalObs(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Acknowledge & Lock Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: SHA-256 Seal Inspector */}
      {sealModalObs && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-base font-bold text-white">Cryptographic Academic Audit Seal</h3>
              </div>
              <button
                onClick={() => setSealModalObs(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Audit Reference:</span>
                <span className="font-mono text-amber-400 font-semibold">{sealModalObs.auditRefNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Instructor & Course:</span>
                <span className="text-slate-200 font-medium">
                  {sealModalObs.facultyInstructor} ({sealModalObs.courseCode})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Composite AQI / Grade:</span>
                <span className="text-emerald-400 font-bold">
                  {sealModalObs.compositeAqi} / 5.0 — {sealModalObs.qualityGrade}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">SHA-256 Digest:</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 break-all font-mono text-[11px] text-amber-400">
                  {sealModalObs.cryptographicSeal}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSealModalObs(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-xl"
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
