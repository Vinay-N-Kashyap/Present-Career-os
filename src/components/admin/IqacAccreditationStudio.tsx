'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  IqacAqarReport,
  NaacCriterionKey,
  NaacGrade,
  NAAC_CRITERIA_METADATA,
  getAqarReports,
  updateCriterionScore,
  submitAqarToNaacPortal,
  exportAqarReportCSV,
  seedIqacData
} from '@/lib/admin/iqacAccreditation';

interface IqacAccreditationStudioProps {
  institutionId?: string;
}

export const IqacAccreditationStudio: React.FC<IqacAccreditationStudioProps> = ({
  institutionId = 'inst-apex-001',
}) => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Initial Seed
  useEffect(() => {
    const existing = getAqarReports(institutionId);
    if (existing.length === 0) {
      seedIqacData(institutionId);
      setRefreshKey(k => k + 1);
    }
  }, [institutionId]);

  const reports = useMemo(() => getAqarReports(institutionId), [institutionId, refreshKey]);
  const activeReport = reports.length > 0 ? reports[0] : null;

  const handleSliderChange = (criterionKey: NaacCriterionKey, val: number) => {
    if (!activeReport) return;
    updateCriterionScore(activeReport.id, criterionKey, val);
    setRefreshKey(k => k + 1);
  };

  const handleSubmitPortal = () => {
    if (!activeReport) return;
    submitAqarToNaacPortal(activeReport.id);
    setRefreshKey(k => k + 1);
  };

  const handleExportCSV = () => {
    const csvContent = exportAqarReportCSV(institutionId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NAAC_AQAR_Accreditation_Report_${institutionId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getGradeBadge = (grade: NaacGrade) => {
    switch (grade) {
      case 'A++':
        return <span className="px-3 py-1 rounded-full text-sm font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800">A++ (CGPA ≥ 3.51)</span>;
      case 'A+':
        return <span className="px-3 py-1 rounded-full text-sm font-extrabold bg-cyan-950 text-cyan-400 border border-cyan-800">A+ (CGPA 3.26 - 3.50)</span>;
      case 'A':
        return <span className="px-3 py-1 rounded-full text-sm font-extrabold bg-indigo-950 text-indigo-400 border border-indigo-800">A (CGPA 3.01 - 3.25)</span>;
      case 'B++':
        return <span className="px-3 py-1 rounded-full text-sm font-extrabold bg-amber-950 text-amber-400 border border-amber-800">B++ (CGPA 2.76 - 3.00)</span>;
      case 'B+':
        return <span className="px-3 py-1 rounded-full text-sm font-extrabold bg-amber-950 text-amber-400 border border-amber-800">B+ (CGPA 2.51 - 2.75)</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-sm font-extrabold bg-rose-950 text-rose-400 border border-rose-800">{grade}</span>;
    }
  };

  if (!activeReport) {
    return <div className="text-slate-400 p-8">Loading IQAC Accreditation Data...</div>;
  }

  const criteriaKeys = Object.keys(NAAC_CRITERIA_METADATA) as NaacCriterionKey[];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Internal Quality Assurance Cell (IQAC) Studio
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
              NAAC Statutory Body
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Institutional AQAR synthesizer, 7 statutory NAAC criteria modeling, and cryptographic digital accreditation seal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!activeReport.submittedToNaacPortal ? (
            <button
              onClick={handleSubmitPortal}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Seal & Submit AQAR to NAAC
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-emerald-800/80 text-emerald-400 text-xs font-semibold">
              ✓ Submitted to NAAC Portal ({activeReport.submissionDate?.slice(0, 10)})
            </div>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Statutory AQAR CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Projected NAAC Grade & CGPA */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Projected NAAC Grade</span>
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{activeReport.cgpa.toFixed(2)}</span>
            <span className="text-slate-400 text-xs">/ 4.00 CGPA</span>
          </div>
          <div className="mt-3">
            {getGradeBadge(activeReport.projectedGrade)}
          </div>
        </div>

        {/* Card 2: Total Statutory Weight */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Statutory Weight</span>
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">1,000</span>
            <span className="text-slate-400 text-xs">benchmark points</span>
          </div>
          <p className="mt-3 text-xs text-indigo-300">
            Cycle {activeReport.cycleNumber} | Year: {activeReport.academicYear}
          </p>
        </div>

        {/* Card 3: Top Scoring Criterion */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Top Criterion</span>
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">Crit 5 (3.90/4)</span>
          </div>
          <p className="mt-3 text-xs text-cyan-400">
            Student Support & DBT Scholarships
          </p>
        </div>

        {/* Card 4: Digital Seal & Verification */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Cryptographic Seal</span>
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="mt-3 text-xs font-mono text-emerald-400 truncate">
            {activeReport.digitalSealDigest}
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            Director: {activeReport.iqacCoordinatorName}
          </p>
        </div>
      </div>

      {/* Main 7-Criteria Interactive Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">NAAC 7 Statutory Criteria Quality Distribution</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Adjust criterion grade points to simulate institutional accreditation impact and inspect weighted contributions.
          </p>
        </div>

        <div className="space-y-6">
          {criteriaKeys.map(key => {
            const crit = activeReport.criteria[key];
            const meta = NAAC_CRITERIA_METADATA[key];
            const weightedPoints = (crit.gradePoint * crit.weight).toFixed(1);

            return (
              <div key={key} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{crit.name}</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900">
                        Weight: {meta.weight}
                      </span>
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5">
                      {crit.keyMetrics.join(' • ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      Weighted: <span className="font-bold text-slate-200">{weightedPoints} pts</span>
                    </span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">
                      {crit.gradePoint.toFixed(2)} / 4.00
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Slider */}
                <div className="space-y-1.5">
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${(crit.gradePoint / 4.0) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="range"
                      min="1.0"
                      max="4.0"
                      step="0.05"
                      value={crit.gradePoint}
                      onChange={e => handleSliderChange(key, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Institutional Best Practices & Distinctiveness */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Best Practices */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h3 className="font-bold text-white text-base">NAAC Criterion 7.2: Institutional Best Practices</h3>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <div className="text-xs font-bold text-indigo-300">1. {activeReport.bestPractice1Title}</div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{activeReport.bestPractice1Summary}</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <div className="text-xs font-bold text-emerald-300">2. {activeReport.bestPractice2Title}</div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{activeReport.bestPractice2Summary}</p>
            </div>
          </div>
        </div>

        {/* Card 2: Institutional Distinctiveness */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="font-bold text-white text-base">NAAC Criterion 7.3: Institutional Distinctiveness</h3>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &ldquo;{activeReport.institutionalDistinctiveness}&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
              <span>Authority: {activeReport.headOfInstitutionName}</span>
              <span>Report ID: {activeReport.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
