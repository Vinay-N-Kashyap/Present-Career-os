'use client';

import React, { useState } from 'react';
import {
  CourseExitSurveyConfig,
  CourseOutcome,
  ProgramOutcomeSummary,
  getAllCourseAttainmentConfigs,
  registerCourseAttainmentConfig,
  submitCourseExitSurvey,
  computeProgramOutcomeAttainments,
  exportCoPoAttainmentCSV,
} from '@/lib/teacher/courseExitSurvey';

export default function CourseOutcomeStudio() {
  const [config, setConfig] = useState<CourseExitSurveyConfig>(() => {
    const existing = getAllCourseAttainmentConfigs();
    if (existing.length > 0) return existing[0];

    const initialOutcomes: CourseOutcome[] = [
      {
        id: 'CO1',
        description: 'Apply principles of distributed algorithms, consensus protocols, and clock synchronization',
        bloomLevel: 'APPLY',
        cieScore: 2.6,
        seeScore: 2.4,
        directAttainment: 2.48,
        indirectAttainment: 2.52,
        overallAttainment: 2.49,
        targetBenchmark: 2.1,
        isTargetAchieved: true,
      },
      {
        id: 'CO2',
        description: 'Design and evaluate fault-tolerant replication models using Raft and Paxos state machines',
        bloomLevel: 'CREATE',
        cieScore: 2.3,
        seeScore: 2.5,
        directAttainment: 2.42,
        indirectAttainment: 2.4,
        overallAttainment: 2.42,
        targetBenchmark: 2.1,
        isTargetAchieved: true,
      },
      {
        id: 'CO3',
        description: 'Implement distributed hash tables, RPC interfaces, and concurrent lock managers',
        bloomLevel: 'APPLY',
        cieScore: 2.5,
        seeScore: 2.7,
        directAttainment: 2.62,
        indirectAttainment: 2.7,
        overallAttainment: 2.64,
        targetBenchmark: 2.1,
        isTargetAchieved: true,
      },
      {
        id: 'CO4',
        description: 'Utilize modern profiling, tracing (OpenTelemetry), and gRPC benchmarks for performance audits',
        bloomLevel: 'ANALYZE',
        cieScore: 2.7,
        seeScore: 2.6,
        directAttainment: 2.64,
        indirectAttainment: 2.64,
        overallAttainment: 2.64,
        targetBenchmark: 2.1,
        isTargetAchieved: true,
      },
      {
        id: 'CO5',
        description: 'Critique real-world microservices architectures, CAP theorem trade-offs, and data consistency models',
        bloomLevel: 'EVALUATE',
        cieScore: 2.4,
        seeScore: 2.3,
        directAttainment: 2.34,
        indirectAttainment: 2.46,
        overallAttainment: 2.36,
        targetBenchmark: 2.1,
        isTargetAchieved: true,
      },
    ];

    const coPoMapping: Record<string, Record<string, number>> = {
      CO1: { PO1: 3, PO2: 3, PO3: 2, PO4: 2, PO5: 1, PO12: 2, PSO1: 3, PSO2: 2 },
      CO2: { PO1: 2, PO2: 3, PO3: 3, PO4: 3, PO5: 2, PO12: 2, PSO1: 3, PSO2: 3 },
      CO3: { PO1: 2, PO2: 2, PO3: 3, PO4: 2, PO5: 3, PO9: 2, PO10: 1, PO12: 2, PSO1: 2, PSO2: 3 },
      CO4: { PO1: 1, PO2: 2, PO4: 3, PO5: 3, PO11: 2, PO12: 3, PSO1: 2, PSO2: 3 },
      CO5: { PO1: 3, PO2: 3, PO3: 2, PO6: 2, PO7: 1, PO8: 2, PO12: 3, PSO1: 3, PSO2: 2 },
    };

    return registerCourseAttainmentConfig({
      courseCode: 'CS401',
      courseName: 'Distributed Operating Systems',
      department: 'Computer Science & Engineering',
      semester: 7,
      academicYear: '2025-2026',
      facultyId: 'FAC-CS-101',
      facultyName: 'Dr. Meenakshi Sundaram',
      totalEnrolledStudents: 65,
      surveyResponses: [
        {
          id: 'RESP-01',
          studentToken: 'STU-ANON-101',
          submittedAt: '2026-10-15T10:30:00Z',
          ratings: { CO1: 5, CO2: 4, CO3: 5, CO4: 4, CO5: 4 },
          qualitativeStrengths: 'Hands-on Raft cluster implementation in Go was phenomenal',
          qualitativeImprovements: 'More case studies on Cassandra multi-region partitioning',
        },
        {
          id: 'RESP-02',
          studentToken: 'STU-ANON-102',
          submittedAt: '2026-10-15T11:15:00Z',
          ratings: { CO1: 4, CO2: 4, CO3: 4, CO4: 5, CO5: 4 },
          qualitativeStrengths: 'Rigorous Socratic lab challenges and automated grading test harnesses',
          qualitativeImprovements: 'None, excellent course delivery',
        },
      ],
      outcomes: initialOutcomes,
      coPoMapping,
    });
  });

  const [activeTab, setActiveTab] = useState<'CO_ATTAINMENT' | 'PO_MAPPING'>('CO_ATTAINMENT');
  const [showSurveyModal, setShowSurveyModal] = useState(false);

  // Survey modal form
  const [surveyRatings, setSurveyRatings] = useState<Record<string, number>>({
    CO1: 5,
    CO2: 4,
    CO3: 5,
    CO4: 4,
    CO5: 5,
  });
  const [surveyStrengths, setSurveyStrengths] = useState('Excellent coverage of Paxos state machines');
  const [surveyImprovements, setSurveyImprovements] = useState('Add more real-world failure injection drills');

  // Stats
  const poSummaries: ProgramOutcomeSummary[] = computeProgramOutcomeAttainments(config.courseCode);
  const avgCoScore = Number(
    (config.outcomes.reduce((acc, co) => acc + co.overallAttainment, 0) / config.outcomes.length).toFixed(2)
  );
  const responseRate = Math.round((config.surveyResponses.length / config.totalEnrolledStudents) * 100);
  const achievedCOsCount = config.outcomes.filter((co) => co.isTargetAchieved).length;

  const handleDownloadCSV = () => {
    try {
      const csv = exportCoPoAttainmentCSV(config.courseCode);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `NBA_Criterion_3_4_Attainment_${config.courseCode}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: any) {
      alert(`Error exporting CSV: ${e.message}`);
    }
  };

  const handleRecordSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = submitCourseExitSurvey({
        courseCode: config.courseCode,
        studentToken: `STU-ANON-${Date.now()}`,
        ratings: surveyRatings,
        qualitativeStrengths: surveyStrengths,
        qualitativeImprovements: surveyImprovements,
      });
      setConfig({ ...updated });
      setShowSurveyModal(false);
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              NBA Criteria 3 & 4
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
              Outcome-Based Education (OBE)
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Faculty Course Outcome (CO/PO) Attainment Studio
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Direct (CIE + SEE) & Indirect (Course Exit Survey) dual-attainment engine, Washington Accord PO mapping, and NBA accreditation reporting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold rounded-lg shadow-sm transition flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export NBA Attainment CSV
          </button>

          <button
            onClick={() => setShowSurveyModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Record Student Exit Survey
          </button>
        </div>
      </div>

      {/* Course Context Header Card */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-slate-300">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-mono text-emerald-400 font-bold">{config.courseCode}</span>
          <span className="text-white font-semibold">{config.courseName}</span>
          <span className="text-slate-400">• Sem {config.semester}</span>
          <span className="text-slate-400">• {config.department}</span>
          <span className="text-slate-400">• AY {config.academicYear}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Faculty:</span>
          <span className="text-white font-bold">{config.facultyName}</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Average CO Attainment</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">{avgCoScore} <span className="text-sm font-normal text-slate-500">/ 3.00</span></p>
            <p className="text-xs text-emerald-400/80 mt-1">Target benchmark: 2.10 (70%)</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">COs Achieved</p>
            <p className="text-3xl font-bold text-blue-400 mt-1">{achievedCOsCount} <span className="text-sm font-normal text-slate-500">/ {config.outcomes.length}</span></p>
            <p className="text-xs text-blue-400/80 mt-1">100% NBA Criteria Met</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Exit Survey (CES) Cohort</p>
            <p className="text-3xl font-bold text-purple-400 mt-1">{config.surveyResponses.length} <span className="text-sm font-normal text-slate-500">/ {config.totalEnrolledStudents}</span></p>
            <p className="text-xs text-purple-400/80 mt-1">{responseRate}% Participation (Quorum &ge; 60%)</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Dual Attainment Formula</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">80% : 20%</p>
            <p className="text-xs text-amber-400/80 mt-1">Direct (CIE+SEE) : Indirect (CES)</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 flex gap-4">
        <button
          onClick={() => setActiveTab('CO_ATTAINMENT')}
          className={`pb-3 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'CO_ATTAINMENT'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Course Outcomes (CO1-CO5) Attainment & CES Analysis
        </button>
        <button
          onClick={() => setActiveTab('PO_MAPPING')}
          className={`pb-3 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'PO_MAPPING'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
          NBA CO-to-PO (PO1-PO12 & PSO1-PSO2) Mapping Matrix
        </button>
      </div>

      {activeTab === 'CO_ATTAINMENT' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">Course Outcomes Attainment Table</h2>
                <p className="text-xs text-slate-400 mt-0.5">Composite calculation (0.80 Direct [CIE 40% + SEE 60%] + 0.20 Indirect [CES])</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">CO Code</th>
                    <th className="py-3 px-4">Bloom Taxonomy</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Direct Attainment (3.0)</th>
                    <th className="py-3 px-4">Indirect Attainment (3.0)</th>
                    <th className="py-3 px-4">Overall Score</th>
                    <th className="py-3 px-4">Target Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {config.outcomes.map((co) => (
                    <tr key={co.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4 font-mono font-bold text-blue-400">{co.id}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          {co.bloomLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-300 max-w-md">{co.description}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-200">
                        {co.directAttainment} <span className="text-[10px] text-slate-500">({co.cieScore} / {co.seeScore})</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-purple-400">
                        {co.indirectAttainment}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {co.overallAttainment}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            co.isTargetAchieved
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {co.isTargetAchieved ? 'ACHIEVED' : 'GAP'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student Qualitative Feedback Stream */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <h2 className="text-lg font-bold text-white">Student Course Exit Survey Qualitative Insights</h2>
            <div className="space-y-3">
              {config.surveyResponses.map((r, i) => (
                <div key={r.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="font-mono text-purple-400 font-semibold">{r.studentToken}</span>
                    <span>{new Date(r.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-300"><strong className="text-emerald-400">Strengths:</strong> {r.qualitativeStrengths}</p>
                  <p className="text-slate-300"><strong className="text-amber-400">Suggested Improvements:</strong> {r.qualitativeImprovements}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'PO_MAPPING' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">NBA Program Outcome (PO1 - PO12 & PSO1 - PSO2) Attainment</h2>
                <p className="text-xs text-slate-400 mt-0.5">Weighted matrix aggregation based on Course Outcome attainment vectors</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {poSummaries.map((po) => (
                <div key={po.poKey} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-400">{po.poKey}</span>
                      <h4 className="text-sm font-semibold text-white mt-0.5">{po.poTitle}</h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        po.isTargetAchieved
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {po.isTargetAchieved ? 'COMPLIANT' : 'GAP'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Attainment Score:</span>
                      <span className="font-mono font-bold text-emerald-400">{po.weightedScore} / 3.0</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (po.weightedScore / 3.0) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Target: {po.targetBenchmark} (70%)</span>
                      <span>{po.percentageAchieved}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Survey Response Modal */}
      {showSurveyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Record Student Course Exit Survey</h3>
              <button onClick={() => setShowSurveyModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleRecordSurvey} className="space-y-4 text-sm">
              <p className="text-xs text-slate-400">Rate your mastery level for each Course Outcome on a scale of 1 to 5 stars:</p>

              <div className="space-y-3">
                {config.outcomes.map((co) => (
                  <div key={co.id} className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-xs font-mono font-bold text-blue-400">{co.id}</span>
                    <select
                      value={surveyRatings[co.id] || 4}
                      onChange={(e) =>
                        setSurveyRatings((prev) => ({
                          ...prev,
                          [co.id]: Number(e.target.value),
                        }))
                      }
                      className="bg-slate-900 border border-slate-700 text-white text-xs rounded px-2 py-1 outline-none"
                    >
                      <option value={5}>5 - Excellent Mastery</option>
                      <option value={4}>4 - Good Understanding</option>
                      <option value={3}>3 - Moderate Grasp</option>
                      <option value={2}>2 - Needs More Practice</option>
                      <option value={1}>1 - Minimal Comprehension</option>
                    </select>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Qualitative Strengths</label>
                <input
                  type="text"
                  required
                  value={surveyStrengths}
                  onChange={(e) => setSurveyStrengths(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Suggested Improvements</label>
                <input
                  type="text"
                  required
                  value={surveyImprovements}
                  onChange={(e) => setSurveyImprovements(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSurveyModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition shadow"
                >
                  Submit Anonymous Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
