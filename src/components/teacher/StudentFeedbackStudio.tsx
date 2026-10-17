'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  StudentFeedbackSubmission,
  FeedbackDimension,
  PerformanceBand,
  SentimentTag,
  getFeedbackSubmissions,
  submitStudentFeedback,
  computeTeacherTEI,
  exportNaacSssCSV,
  seedStudentFeedbackData
} from '@/lib/teacher/studentFeedback';

interface StudentFeedbackStudioProps {
  institutionId?: string;
  facultyId?: string;
  facultyName?: string;
  department?: string;
}

export const StudentFeedbackStudio: React.FC<StudentFeedbackStudioProps> = ({
  institutionId = 'inst-apex-001',
  facultyId = 'FAC-CS-001',
  facultyName = 'Dr. Aris Thorne',
  department = 'Computer Science'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('ALL');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal State for simulating student evaluation
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [courseCode, setCourseCode] = useState('CS-301');
  const [courseTitle, setCourseTitle] = useState('Distributed Systems & Cloud Computing');
  const [semester, setSemester] = useState('Fall 2026');
  const [studentToken, setStudentToken] = useState('');
  const [courseDeliveryRating, setCourseDeliveryRating] = useState(5);
  const [subjectMasteryRating, setSubjectMasteryRating] = useState(5);
  const [gradingFairnessRating, setGradingFairnessRating] = useState(4);
  const [doubtAvailabilityRating, setDoubtAvailabilityRating] = useState(5);
  const [socraticEngagementRating, setSocraticEngagementRating] = useState(4);
  const [qualitativeComments, setQualitativeComments] = useState('');

  // Initial Seed
  useEffect(() => {
    const existing = getFeedbackSubmissions(institutionId, { facultyId });
    if (existing.length === 0) {
      seedStudentFeedbackData(institutionId);
      setRefreshKey(k => k + 1);
    }
  }, [institutionId, facultyId]);

  const submissions = useMemo(() => {
    return getFeedbackSubmissions(institutionId, { facultyId });
  }, [institutionId, facultyId, refreshKey]);

  const teiSummary = useMemo(() => {
    return computeTeacherTEI(facultyId, institutionId, 60);
  }, [facultyId, institutionId, refreshKey]);

  const filteredComments = useMemo(() => {
    return teiSummary.qualitativeHighlights.filter(h => {
      const matchesSentiment = sentimentFilter === 'ALL' || h.sentiment === sentimentFilter;
      const matchesSearch = h.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSentiment && matchesSearch;
    });
  }, [teiSummary, sentimentFilter, searchTerm]);

  const handleExportCSV = () => {
    const csvContent = exportNaacSssCSV(institutionId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NAAC_SSS_Criterion_2_7_${facultyId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const token = studentToken.trim() || `TOKEN-SIM-${Math.floor(Math.random() * 100000)}`;

    const res = submitStudentFeedback({
      institutionId,
      facultyId,
      facultyName,
      department,
      courseCode,
      courseTitle,
      semester,
      academicYear: '2026-2027',
      studentTokenHash: token,
      ratings: {
        COURSE_DELIVERY: courseDeliveryRating,
        SUBJECT_MASTERY: subjectMasteryRating,
        GRADING_FAIRNESS: gradingFairnessRating,
        DOUBT_AVAILABILITY: doubtAvailabilityRating,
        SOCRATIC_ENGAGEMENT: socraticEngagementRating
      },
      qualitativeComments
    });

    if (!res.success) {
      setSubmitError(res.error || 'Failed to submit feedback');
      return;
    }

    setShowSimulateModal(false);
    setQualitativeComments('');
    setStudentToken('');
    setRefreshKey(k => k + 1);
  };

  const getBandBadge = (band: PerformanceBand) => {
    switch (band) {
      case 'EXEMPLARY':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">EXEMPLARY (TEI ≥ 85)</span>;
      case 'PROFICIENT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">PROFICIENT (TEI 70-84)</span>;
      case 'DEVELOPING':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800">DEVELOPING (TEI 50-69)</span>;
      case 'NEEDS_IMPROVEMENT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950 text-rose-400 border border-rose-800">NEEDS IMPROVEMENT (&lt; 50)</span>;
    }
  };

  const getSentimentBadge = (sentiment: SentimentTag) => {
    switch (sentiment) {
      case 'POSITIVE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">POSITIVE</span>;
      case 'CONSTRUCTIVE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-900/60 text-amber-300 border border-amber-700/50">CONSTRUCTIVE</span>;
      case 'NEUTRAL':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">NEUTRAL</span>;
    }
  };

  const dimensionsList: { key: FeedbackDimension; label: string; desc: string }[] = [
    { key: 'COURSE_DELIVERY', label: 'Course Delivery & Clarity', desc: 'Clarity of structure, lecture pace, and modern instructional design.' },
    { key: 'SUBJECT_MASTERY', label: 'Subject Depth & Rigor', desc: 'Depth of conceptual mastery, rigor, and industry relevance.' },
    { key: 'GRADING_FAIRNESS', label: 'Evaluation & Grading Fairness', desc: 'Transparent rubrics, timely grading, and objective assessment.' },
    { key: 'DOUBT_AVAILABILITY', label: 'Accessibility & Doubts Resolution', desc: 'Availability during office hours, doubt clearing, and guidance.' },
    { key: 'SOCRATIC_ENGAGEMENT', label: 'Socratic & Interactive Pedagogy', desc: 'Active student participation, debate encouragement, and engagement.' }
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Student Evaluation of Teaching (SET) Studio
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800">
              NAAC Criterion 2.7
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Faculty: <span className="text-slate-200 font-medium">{facultyName}</span> ({department}) | Academic Year 2026-2027
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowSimulateModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Simulate Student Evaluation
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export NAAC SSS CSV
          </button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TEI Index */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Teacher Effectiveness Index</span>
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{teiSummary.teiScore}</span>
            <span className="text-slate-400 text-sm">/ 100</span>
          </div>
          <div className="mt-3">
            {getBandBadge(teiSummary.performanceBand)}
          </div>
        </div>

        {/* Card 2: Student Quorum & NAAC SSS Validity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Student Participation</span>
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{teiSummary.participationRatePercent}%</span>
            <span className="text-slate-400 text-xs">({teiSummary.totalResponses} / {teiSummary.enrolledStudentsCount} students)</span>
          </div>
          <div className="mt-3">
            {teiSummary.isNaacValid ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                ✓ NAAC 60% Quorum Met
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800">
                ⚠ Quorum Pending (&lt; 60%)
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Course Delivery & Subject Mastery */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Pedagogy & Mastery</span>
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{teiSummary.dimensionAverages.COURSE_DELIVERY}</span>
            <span className="text-slate-400 text-xs">/ 5.00 delivery</span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Subject Depth: <span className="text-emerald-400 font-semibold">{teiSummary.dimensionAverages.SUBJECT_MASTERY} / 5.0</span>
          </p>
        </div>

        {/* Card 4: Grading Fairness & Doubts */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Fairness & Mentorship</span>
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{teiSummary.dimensionAverages.GRADING_FAIRNESS}</span>
            <span className="text-slate-400 text-xs">/ 5.00 grading</span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Doubt Access: <span className="text-amber-400 font-semibold">{teiSummary.dimensionAverages.DOUBT_AVAILABILITY} / 5.0</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Dimensions & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 5 Core Dimensions Breakdown */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-2">Evaluation Across 5 Statutory Dimensions</h2>
          <p className="text-slate-400 text-xs mb-6">
            Aggregated anonymized feedback normalized against AICTE & NAAC Criterion 2.7 quality standards.
          </p>

          <div className="space-y-5">
            {dimensionsList.map(dim => {
              const score = teiSummary.dimensionAverages[dim.key];
              const percent = Math.round((score / 5) * 100);
              return (
                <div key={dim.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-200">{dim.label}</span>
                    <span className="text-indigo-400 font-bold">{score.toFixed(2)} / 5.00</span>
                  </div>
                  <p className="text-slate-400 text-xs">{dim.desc}</p>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Star Rating Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-2">Rating Distribution</h2>
            <p className="text-slate-400 text-xs mb-5">Cumulative response frequencies across all questions</p>

            <div className="space-y-3">
              {[
                { star: 5, count: teiSummary.feedbackDistribution.star5, color: 'bg-emerald-500' },
                { star: 4, count: teiSummary.feedbackDistribution.star4, color: 'bg-cyan-500' },
                { star: 3, count: teiSummary.feedbackDistribution.star3, color: 'bg-indigo-500' },
                { star: 2, count: teiSummary.feedbackDistribution.star2, color: 'bg-amber-500' },
                { star: 1, count: teiSummary.feedbackDistribution.star1, color: 'bg-rose-500' }
              ].map(item => {
                const total = teiSummary.totalResponses * 5 || 1;
                const pct = Math.round((item.count / total) * 100);
                return (
                  <div key={item.star} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-slate-300 font-medium">{item.star} Stars</span>
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-slate-400">{item.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="text-indigo-400 font-semibold">Whistleblower Protection:</span> Student voter identity is cryptographically hashed with zero linkability to roll numbers or GPA records.
          </div>
        </div>
      </div>

      {/* Student Voice & Qualitative Comments Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Qualitative Feedback & Automated Sentiment Analysis</h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Natural Language Processing sentiment classification of student reflections and pedagogical feedback.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search comments or courses..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-56"
              />
            </div>

            <select
              value={sentimentFilter}
              onChange={e => setSentimentFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Sentiments</option>
              <option value="POSITIVE">Positive</option>
              <option value="CONSTRUCTIVE">Constructive</option>
              <option value="NEUTRAL">Neutral</option>
            </select>
          </div>
        </div>

        {/* Comments List */}
        {filteredComments.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No qualitative comments matching filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredComments.map(item => (
              <div key={item.id} className="bg-slate-950 border border-slate-800/80 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900">
                    {item.courseCode}
                  </span>
                  {getSentimentBadge(item.sentiment)}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed italic">
                  &ldquo;{item.comment}&rdquo;
                </p>
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>Anonymous Student Token</span>
                  <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simulation Modal */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Simulate Student Course Evaluation</h3>
              <button
                onClick={() => setShowSimulateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {submitError && (
              <div className="bg-rose-950/60 border border-rose-800 text-rose-300 text-xs p-3 rounded-lg">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSimulateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Course</label>
                <select
                  value={courseCode}
                  onChange={e => {
                    setCourseCode(e.target.value);
                    if (e.target.value === 'CS-301') {
                      setCourseTitle('Distributed Systems & Cloud Computing');
                    } else {
                      setCourseTitle('Advanced Distributed Protocols');
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                >
                  <option value="CS-301">CS-301: Distributed Systems & Cloud Computing</option>
                  <option value="CS-402">CS-402: Advanced Distributed Protocols</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Student Anonymous Token (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. TOKEN-STUDENT-A99 (auto-generated if blank)"
                  value={studentToken}
                  onChange={e => setStudentToken(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                />
              </div>

              {/* 5 Dimension Ratings */}
              <div className="space-y-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-xs font-semibold text-indigo-300">Dimension Ratings (1 to 5 Stars):</span>

                {[
                  { label: 'Course Delivery & Clarity', val: courseDeliveryRating, set: setCourseDeliveryRating },
                  { label: 'Subject Depth & Rigor', val: subjectMasteryRating, set: setSubjectMasteryRating },
                  { label: 'Evaluation & Grading Fairness', val: gradingFairnessRating, set: setGradingFairnessRating },
                  { label: 'Doubt Clearing & Accessibility', val: doubtAvailabilityRating, set: setDoubtAvailabilityRating },
                  { label: 'Socratic & Interactive Pedagogy', val: socraticEngagementRating, set: setSocraticEngagementRating }
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{row.label}</span>
                    <select
                      value={row.val}
                      onChange={e => row.set(parseInt(e.target.value, 10))}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Satisfactory</option>
                      <option value="2">2 - Developing</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Qualitative Student Comments</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Thorough explanations of consensus algorithms. Office hours were very helpful."
                  value={qualitativeComments}
                  onChange={e => setQualitativeComments(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                >
                  Submit Anonymous Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
