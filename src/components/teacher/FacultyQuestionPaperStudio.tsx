'use client';

import React, { useState, useMemo } from 'react';
import {
  FacultyQuestionPaper,
  QuestionItem,
  CognitiveLevel,
  CourseOutcomeCode,
  PaperSet,
  ModerationStatus,
  INITIAL_FACULTY_PAPERS,
  createFacultyQuestionPaper,
  addOrUpdateQuestionItem,
  submitQuestionPaperToDmc,
  reviewByDmc,
  exportFacultyQuestionPapersCSV,
} from '@/lib/teacher/facultyQuestionPaper';

export default function FacultyQuestionPaperStudio() {
  const [papers, setPapers] = useState<FacultyQuestionPaper[]>(INITIAL_FACULTY_PAPERS);
  const [selectedFilter, setSelectedFilter] = useState<ModerationStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewPaperModalOpen, setIsNewPaperModalOpen] = useState(false);
  const [questionModalPaper, setQuestionModalPaper] = useState<FacultyQuestionPaper | null>(null);
  const [dmcModalPaper, setDmcModalPaper] = useState<FacultyQuestionPaper | null>(null);
  const [sealModalPaper, setSealModalPaper] = useState<FacultyQuestionPaper | null>(null);
  const [expandedPaperId, setExpandedPaperId] = useState<string | null>(papers[0]?.paperId || null);

  // New Paper Form State
  const [courseCode, setCourseCode] = useState('IT304');
  const [courseTitle, setCourseTitle] = useState('Machine Learning Systems & High-Scale Inference Pipelines');
  const [department, setDepartment] = useState('Information Technology');
  const [facultySetterName, setFacultySetterName] = useState('Prof. Meenakshi Sundaram');
  const [facultySetterEmpId, setFacultySetterEmpId] = useState('EMP-IT-029');
  const [paperSet, setPaperSet] = useState<PaperSet>('SET_A');
  const [targetTotalMarks, setTargetTotalMarks] = useState(100);
  const [examDurationMinutes, setExamDurationMinutes] = useState(180);

  // New Question Item Form State
  const [questionNumber, setQuestionNumber] = useState(1);
  const [subQuestionPart, setSubQuestionPart] = useState('a');
  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState(15);
  const [cognitiveLevel, setCognitiveLevel] = useState<CognitiveLevel>('L4_ANALYZE');
  const [courseOutcome, setCourseOutcome] = useState<CourseOutcomeCode>('CO3');
  const [unitModuleNumber, setUnitModuleNumber] = useState(3);
  const [rubricKeyOutline, setRubricKeyOutline] = useState('');

  // DMC Moderation Review Form State
  const [dmcDecision, setDmcDecision] = useState<'APPROVE' | 'REQUEST_REVISION'>('APPROVE');
  const [dmcConvenorName, setDmcConvenorName] = useState('Prof. Arvind Swaminathan (DMC Chair)');
  const [dmcRemarks, setDmcRemarks] = useState('Cognitive balance verified. HOTS ratio satisfies AICTE norms.');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered papers
  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      const matchesStatus = selectedFilter === 'ALL' || p.status === selectedFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.courseCode.toLowerCase().includes(q) ||
        p.courseTitle.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.facultySetterName.toLowerCase().includes(q) ||
        p.submissionToken.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [papers, selectedFilter, searchQuery]);

  // Telemetry Metrics
  const metrics = useMemo(() => {
    const totalPapers = papers.length;
    const totalQuestions = papers.reduce((acc, p) => acc + p.questions.length, 0);
    const balancedCount = papers.filter((p) => p.cognitiveDistribution.isBalanced).length;
    const allCoCoveredCount = papers.filter((p) => p.cognitiveDistribution.allCosCovered).length;
    const approvedCount = papers.filter((p) => p.status === 'APPROVED_FOR_COE').length;

    const avgHots =
      totalPapers > 0
        ? Math.round(papers.reduce((acc, p) => acc + p.cognitiveDistribution.hotsPercentage, 0) / totalPapers)
        : 0;

    return { totalPapers, totalQuestions, balancedCount, allCoCoveredCount, approvedCount, avgHots };
  }, [papers]);

  // Handle Create Paper
  const handleCreatePaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseTitle.trim() || !department.trim()) {
      showToast('Please provide course code, title, and department.');
      return;
    }

    try {
      const created = createFacultyQuestionPaper({
        courseCode: courseCode.trim(),
        courseTitle: courseTitle.trim(),
        department: department.trim(),
        facultySetterName: facultySetterName.trim(),
        facultySetterEmpId: facultySetterEmpId.trim(),
        paperSet,
        targetTotalMarks: Number(targetTotalMarks),
        examDurationMinutes: Number(examDurationMinutes),
      });

      setPapers([created, ...papers]);
      setExpandedPaperId(created.paperId);
      setIsNewPaperModalOpen(false);
      showToast(`Question paper draft created: ${created.submissionToken}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating paper draft.';
      showToast(msg);
    }
  };

  // Handle Add Question
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionModalPaper || !questionText.trim()) {
      showToast('Please provide question text.');
      return;
    }

    try {
      const updated = addOrUpdateQuestionItem(questionModalPaper, {
        questionNumber: Number(questionNumber),
        subQuestionPart: subQuestionPart.trim() || undefined,
        text: questionText.trim(),
        marks: Number(marks),
        cognitiveLevel,
        courseOutcome,
        unitModuleNumber: Number(unitModuleNumber),
        rubricKeyOutline: rubricKeyOutline.trim() || undefined,
      });

      setPapers(papers.map((p) => (p.paperId === updated.paperId ? updated : p)));
      setQuestionModalPaper(null);
      setQuestionText('');
      setRubricKeyOutline('');
      showToast(`Question Q${questionNumber}${subQuestionPart} added with Bloom's level ${cognitiveLevel}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error adding question.';
      showToast(msg);
    }
  };

  // Handle Submit to DMC
  const handleSubmitToDmc = (paper: FacultyQuestionPaper) => {
    try {
      const updated = submitQuestionPaperToDmc(paper);
      setPapers(papers.map((p) => (p.paperId === updated.paperId ? updated : p)));
      showToast(`Paper ${paper.courseCode} submitted to Departmental Moderation Committee.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed.';
      showToast(msg);
    }
  };

  // Handle DMC Review
  const handleDmcReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmcModalPaper) return;

    try {
      const updated = reviewByDmc(dmcModalPaper, {
        decision: dmcDecision,
        dmcConvenorName: dmcConvenorName.trim(),
        remarks: dmcRemarks.trim(),
      });

      setPapers(papers.map((p) => (p.paperId === updated.paperId ? updated : p)));
      setDmcModalPaper(null);
      showToast(
        dmcDecision === 'APPROVE'
          ? `Paper approved for CoE confidential printing!`
          : `Revision requested from paper setter.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'DMC moderation failed.';
      showToast(msg);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent = exportFacultyQuestionPapersCSV(papers);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `faculty_question_papers_dmc_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Faculty question paper moderation ledger exported to CSV.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-lg shadow-xl border border-indigo-400 flex items-center space-x-3 animate-fade-in">
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
            <span className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Faculty Question Paper Authoring & Moderation Studio
              </h1>
              <p className="text-sm text-slate-400">
                Outcome-Based Education (OBE) AICTE Exam Reforms & Departmental Moderation Committee (DMC) Workbench
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
            <span>Export DMC CSV</span>
          </button>
          <button
            onClick={() => setIsNewPaperModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition flex items-center space-x-2 shadow-lg shadow-indigo-600/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Draft New Question Paper</span>
          </button>
        </div>
      </div>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Authored Papers</span>
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{metrics.totalPapers}</div>
          <div className="text-xs text-slate-500 mt-1">{metrics.totalQuestions} questions authored across sets</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Average HOTS Ratio</span>
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{metrics.avgHots}%</div>
          <div className="text-xs text-slate-500 mt-1">AICTE benchmark: HOTS ≥ 30% (L4-L6)</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>CO Coverage Compliance</span>
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-2">
            {metrics.allCoCoveredCount} / {metrics.totalPapers}
          </div>
          <div className="text-xs text-slate-500 mt-1">All CO1..CO5 outcomes fully mapped</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>DMC Approved for CoE</span>
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2">{metrics.approvedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Ready for double-lock confidential press</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['ALL', 'All Papers'],
              ['DRAFTED', 'Drafting'],
              ['SUBMITTED_TO_DMC', 'Under Moderation'],
              ['APPROVED_FOR_COE', 'Approved for CoE'],
              ['REVISION_REQUESTED', 'Revision Requested'],
            ] as const
          ).map(([status, label]) => (
            <button
              key={status}
              onClick={() => setSelectedFilter(status as ModerationStatus | 'ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedFilter === status
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
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
            placeholder="Search course, token, faculty setter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Papers List */}
      <div className="space-y-4">
        {filteredPapers.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-sm">
            No question papers found matching the selected filter criteria.
          </div>
        ) : (
          filteredPapers.map((paper) => {
            const isExpanded = expandedPaperId === paper.paperId;
            return (
              <div
                key={paper.paperId}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition rounded-xl p-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                        {paper.courseCode}
                      </span>
                      <span className="font-mono text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                        {paper.submissionToken}
                      </span>
                      <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                        {paper.paperSet}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          paper.status === 'APPROVED_FOR_COE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : paper.status === 'SUBMITTED_TO_DMC'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : paper.status === 'REVISION_REQUESTED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-700 text-slate-300 border border-slate-600'
                        }`}
                      >
                        {paper.status.replace(/_/g, ' ')}
                      </span>
                      {paper.cognitiveDistribution.isBalanced && (
                        <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-semibold">
                          ✓ OBE BALANCED
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-white">{paper.courseTitle}</h3>

                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400">
                      <div>
                        <span className="text-slate-500">Dept:</span> {paper.department}
                      </div>
                      <div>
                        <span className="text-slate-500">Paper Setter:</span> {paper.facultySetterName} ({paper.facultySetterEmpId})
                      </div>
                      <div>
                        <span className="text-slate-500">Duration:</span> {paper.examDurationMinutes} min
                      </div>
                      <div>
                        <span className="text-slate-500">Marks:</span> {paper.cognitiveDistribution.totalMarks} / {paper.targetTotalMarks}
                      </div>
                    </div>

                    {/* Bloom's Distribution & CO Breakdown Bar */}
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-slate-400">Cognitive Balance:</span>
                        <span className="text-indigo-400 font-semibold">LOTS {paper.cognitiveDistribution.lotsPercentage}%</span>
                        <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden flex">
                          <div
                            className="bg-indigo-500 h-2"
                            style={{ width: `${paper.cognitiveDistribution.lotsPercentage}%` }}
                          />
                          <div
                            className="bg-emerald-500 h-2"
                            style={{ width: `${paper.cognitiveDistribution.hotsPercentage}%` }}
                          />
                        </div>
                        <span className="text-emerald-400 font-semibold">HOTS {paper.cognitiveDistribution.hotsPercentage}%</span>
                      </div>

                      {/* Course Outcomes Mapping Chips */}
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400 mr-1">CO Coverage:</span>
                        {(['CO1', 'CO2', 'CO3', 'CO4', 'CO5'] as CourseOutcomeCode[]).map((co) => {
                          const marksForCo = paper.cognitiveDistribution.coBreakdown[co] || 0;
                          return (
                            <span
                              key={co}
                              className={`px-2 py-0.5 rounded font-mono ${
                                marksForCo > 0
                                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                  : 'bg-slate-900 text-slate-600 border border-slate-800'
                              }`}
                            >
                              {co}: {marksForCo}m
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {paper.dmcRemarks && (
                      <div className="text-xs bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-slate-300">
                        <span className="text-indigo-400 font-semibold">DMC Remarks ({paper.dmcConvenorName || 'Committee'}):</span>{' '}
                        {paper.dmcRemarks}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap lg:flex-col items-end gap-2 mt-4 lg:mt-0">
                    <button
                      onClick={() => {
                        setQuestionModalPaper(paper);
                        setQuestionNumber(paper.questions.length + 1);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition"
                    >
                      + Add Question
                    </button>

                    {paper.status === 'DRAFTED' && (
                      <button
                        onClick={() => handleSubmitToDmc(paper)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition"
                      >
                        Submit to DMC
                      </button>
                    )}

                    {(paper.status === 'SUBMITTED_TO_DMC' || paper.status === 'REVISION_REQUESTED') && (
                      <button
                        onClick={() => setDmcModalPaper(paper)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium transition"
                      >
                        DMC Moderation Review
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedPaperId(isExpanded ? null : paper.paperId)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition"
                    >
                      {isExpanded ? 'Hide Questions' : `View ${paper.questions.length} Questions`}
                    </button>

                    <button
                      onClick={() => setSealModalPaper(paper)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition"
                    >
                      View Hash Seal
                    </button>
                  </div>
                </div>

                {/* Questions Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                    <div className="text-xs font-semibold text-slate-300">Question Item Breakdown:</div>
                    {paper.questions.length === 0 ? (
                      <div className="text-xs text-slate-500 italic">No questions added yet to this paper set.</div>
                    ) : (
                      paper.questions.map((q) => (
                        <div
                          key={q.questionId}
                          className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-indigo-400">
                                Q{q.questionNumber}{q.subQuestionPart ? `.${q.subQuestionPart}` : ''}
                              </span>
                              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-medium">
                                {q.marks} Marks
                              </span>
                              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-mono">
                                {q.courseOutcome}
                              </span>
                              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">
                                Unit {q.unitModuleNumber}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                q.cognitiveLevel === 'L4_ANALYZE' ||
                                q.cognitiveLevel === 'L5_EVALUATE' ||
                                q.cognitiveLevel === 'L6_CREATE'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                              }`}
                            >
                              {q.cognitiveLevel.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-slate-200">{q.text}</p>
                          {q.rubricKeyOutline && (
                            <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded border border-slate-800">
                              <span className="text-slate-500 font-medium">Rubric Key:</span> {q.rubricKeyOutline}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: Draft New Question Paper */}
      {isNewPaperModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Draft New Faculty Question Paper</h2>
              <button onClick={() => setIsNewPaperModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePaper} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Course Code</label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    placeholder="e.g. IT304"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Paper Set</label>
                  <select
                    value={paperSet}
                    onChange={(e) => setPaperSet(e.target.value as PaperSet)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="SET_A">Set A (Primary)</option>
                    <option value="SET_B">Set B (Reserve Fallback)</option>
                    <option value="SET_C">Set C (Contingency)</option>
                  </select>
                </div>
              </div>

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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Faculty Setter Name</label>
                  <input
                    type="text"
                    value={facultySetterName}
                    onChange={(e) => setFacultySetterName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={facultySetterEmpId}
                    onChange={(e) => setFacultySetterEmpId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Total Marks</label>
                  <input
                    type="number"
                    value={targetTotalMarks}
                    onChange={(e) => setTargetTotalMarks(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={examDurationMinutes}
                    onChange={(e) => setExamDurationMinutes(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewPaperModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium shadow"
                >
                  Initialize Paper Set
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Question Item Modal */}
      {questionModalPaper && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white">Add Question Item</h2>
                <p className="text-xs text-slate-400">{questionModalPaper.courseCode} - {questionModalPaper.courseTitle}</p>
              </div>
              <button onClick={() => setQuestionModalPaper(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Q. Number</label>
                  <input
                    type="number"
                    value={questionNumber}
                    onChange={(e) => setQuestionNumber(Number(e.target.value))}
                    min={1}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Part</label>
                  <input
                    type="text"
                    value={subQuestionPart}
                    onChange={(e) => setSubQuestionPart(e.target.value)}
                    placeholder="a, b, c..."
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Marks</label>
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    min={1}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Unit Module</label>
                  <input
                    type="number"
                    value={unitModuleNumber}
                    onChange={(e) => setUnitModuleNumber(Number(e.target.value))}
                    min={1}
                    max={5}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Bloom's Taxonomy Level</label>
                  <select
                    value={cognitiveLevel}
                    onChange={(e) => setCognitiveLevel(e.target.value as CognitiveLevel)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="L1_REMEMBER">L1: Remember (LOTS)</option>
                    <option value="L2_UNDERSTAND">L2: Understand (LOTS)</option>
                    <option value="L3_APPLY">L3: Apply (LOTS)</option>
                    <option value="L4_ANALYZE">L4: Analyze (HOTS)</option>
                    <option value="L5_EVALUATE">L5: Evaluate (HOTS)</option>
                    <option value="L6_CREATE">L6: Create (HOTS)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Course Outcome (NBA CO)</label>
                  <select
                    value={courseOutcome}
                    onChange={(e) => setCourseOutcome(e.target.value as CourseOutcomeCode)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="CO1">CO1: Foundational Theory</option>
                    <option value="CO2">CO2: Conceptual Modeling</option>
                    <option value="CO3">CO3: Applied Problem Solving</option>
                    <option value="CO4">CO4: Critical Analysis & Design</option>
                    <option value="CO5">CO5: Synthesis & Modern Tools</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Question Statement</label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={3}
                  placeholder="Enter the full question statement..."
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Rubric Key & Marking Scheme Outline</label>
                <textarea
                  value={rubricKeyOutline}
                  onChange={(e) => setRubricKeyOutline(e.target.value)}
                  rows={2}
                  placeholder="Outline key derivation steps, diagrams, and marks allocation..."
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuestionModalPaper(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium shadow"
                >
                  Save Question Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DMC Moderation Review Modal */}
      {dmcModalPaper && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/50">
              <h2 className="text-base font-bold text-white">Departmental Moderation Committee (DMC) Review</h2>
              <button onClick={() => setDmcModalPaper(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleDmcReview} className="space-y-4 text-xs">
              <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-1">
                <div className="font-semibold text-slate-200">{dmcModalPaper.courseCode}: {dmcModalPaper.courseTitle}</div>
                <div className="text-slate-400">Total Marks: {dmcModalPaper.cognitiveDistribution.totalMarks} / {dmcModalPaper.targetTotalMarks}</div>
                <div className="text-slate-400">
                  HOTS: {dmcModalPaper.cognitiveDistribution.hotsPercentage}% | LOTS: {dmcModalPaper.cognitiveDistribution.lotsPercentage}%
                </div>
                <div className="text-purple-400">
                  CO Coverage: {dmcModalPaper.cognitiveDistribution.allCosCovered ? 'All CO1..CO5 Covered' : 'Missing CO Coverage'}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">DMC Decision</label>
                <select
                  value={dmcDecision}
                  onChange={(e) => setDmcDecision(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                >
                  <option value="APPROVE">Approve & Sign-off for CoE Confidential Printing</option>
                  <option value="REQUEST_REVISION">Request Revision from Paper Setter</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">DMC Convenor / Chair Name</label>
                <input
                  type="text"
                  value={dmcConvenorName}
                  onChange={(e) => setDmcConvenorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Committee Remarks & Suggestions</label>
                <textarea
                  value={dmcRemarks}
                  onChange={(e) => setDmcRemarks(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDmcModalPaper(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-medium shadow"
                >
                  Record DMC Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Cryptographic Seal Inspector Modal */}
      {sealModalPaper && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Cryptographic Moderation Seal Inspector</h2>
              <button onClick={() => setSealModalPaper(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-slate-500">Submission Token:</div>
                <div className="font-mono text-indigo-400 font-semibold">{sealModalPaper.submissionToken}</div>
              </div>
              <div>
                <div className="text-slate-500">Course & Set:</div>
                <div className="font-semibold text-white">{sealModalPaper.courseCode} ({sealModalPaper.paperSet})</div>
              </div>
              <div>
                <div className="text-slate-500">Faculty Setter:</div>
                <div className="text-slate-300">{sealModalPaper.facultySetterName}</div>
              </div>
              <div>
                <div className="text-slate-500">SHA-256 Moderation Hash:</div>
                <div className="font-mono text-emerald-400 break-all bg-slate-950 p-2.5 rounded border border-slate-800 select-all">
                  {sealModalPaper.cryptographicSeal}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Last Telemetry Timestamp:</div>
                <div className="text-slate-300">{sealModalPaper.lastUpdated}</div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSealModalPaper(null)}
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
