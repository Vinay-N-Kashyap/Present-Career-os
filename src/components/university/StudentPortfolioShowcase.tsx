'use client';

import React, { useState } from 'react';
import { PublicVerifiablePortfolio } from '@/lib/admin/portfolio';

interface StudentPortfolioShowcaseProps {
  portfolio: PublicVerifiablePortfolio;
}

export const StudentPortfolioShowcase: React.FC<StudentPortfolioShowcaseProps> = ({ portfolio }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(portfolio.cryptographicProof.sha256Fingerprint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Institutional Verification Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
              <span>🛡️</span>
              Institutional Cryptographic Verification Active
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {portfolio.fullName}
            </h1>
            <p className="text-base text-slate-300 font-medium mt-1">
              {portfolio.degree} in {portfolio.department}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mt-3">
              <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
                <span>🎓</span>
                {portfolio.institutionName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span>📅</span>
                Class of {portfolio.batchYear}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold">
                CGPA {portfolio.cgpa.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Employability Tier Badge */}
          <div className="flex flex-col items-end">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-right">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Employability Rating
              </div>
              <div className="text-3xl font-black text-indigo-400">
                {portfolio.employabilityScore}
                <span className="text-base font-normal text-slate-500">/100</span>
              </div>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {portfolio.tier.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div>
            <div className="text-xs text-slate-400">Attendance Reliability</div>
            <div className="text-lg font-bold text-white mt-0.5">{portfolio.attendancePercentage}%</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Verified Capstones</div>
            <div className="text-lg font-bold text-white mt-0.5">{portfolio.capstones.length} Completed</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Proctored Exams Passed</div>
            <div className="text-lg font-bold text-white mt-0.5">{portfolio.proctoredExamsSummary.totalPassed} Exams</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Anti-Cheat Integrity</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              {portfolio.proctoredExamsSummary.averageIntegrityScore}% Score
            </div>
          </div>
        </div>
      </div>

      {/* Verified Badges */}
      {portfolio.verifiedBadges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>✨</span>
            Institutional Verified Badges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {portfolio.verifiedBadges.map(badge => (
              <div 
                key={badge.badgeId}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-start gap-3.5 hover:border-slate-700 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-lg">
                  🎖️
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{badge.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-mono font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {badge.category}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Verified {badge.issuedDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Capstone Projects Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📦</span>
          Verified Capstone Engineering Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolio.capstones.map(cap => (
            <div 
              key={cap.capstoneId}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-semibold text-slate-400">{cap.courseCode}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Grade {cap.grade} ({cap.score}/100)
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{cap.title}</h3>
                
                <div className="flex flex-wrap gap-1.5 my-3">
                  {cap.competencies.map((comp, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-mono"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mt-4">
                <span>Completed: {cap.completionDate}</span>
                {cap.repositoryUrl && (
                  <a 
                    href={cap.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    <span>🔗</span>
                    Verified Repo ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cryptographic Authenticity Footer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white font-semibold">
              <span className="text-emerald-400">🛡️</span>
              Cryptographic Integrity Proof (SHA-256)
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tamper-evident hash issued by {portfolio.institutionName}. Guaranteed free of altered marks or proxy fabrication.
            </p>
            <div className="mt-2 font-mono text-xs text-slate-300 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 select-all break-all">
              {portfolio.cryptographicProof.sha256Fingerprint}
            </div>
          </div>

          <button
            onClick={handleCopyHash}
            className="self-start md:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition"
          >
            {copied ? '✓ Copied Hash' : '📋 Copy Hash Proof'}
          </button>
        </div>
      </div>
    </div>
  );
};
