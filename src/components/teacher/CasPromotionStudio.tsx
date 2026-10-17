'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  CasPromotionDossier,
  CasCareerStage,
  DossierStatus,
  getCasDossiers,
  submitCasDossier,
  advanceDossierStatus,
  computeFacultyCasSummary,
  exportCasDossierRegistryCSV,
  seedCasDossierData
} from '@/lib/teacher/casPromotionDossier';

interface CasPromotionStudioProps {
  institutionId?: string;
  facultyId?: string;
  facultyName?: string;
  department?: string;
}

export const CasPromotionStudio: React.FC<CasPromotionStudioProps> = ({
  institutionId = 'inst-apex-001',
  facultyId = 'FAC-CS-001',
  facultyName = 'Dr. Aris Thorne',
  department = 'Computer Science & Engineering'
}) => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  // Form State
  const [casStage, setCasStage] = useState<CasCareerStage>('STAGE_4_TO_5_PROFESSOR');
  const [currentDesignation, setCurrentDesignation] = useState('Associate Professor (Level 13A)');
  const [targetDesignation, setTargetDesignation] = useState('Professor (Level 14)');
  const [yearsInGrade, setYearsInGrade] = useState(4);
  const [claimedApi, setClaimedApi] = useState(145);
  const [papersCount, setPapersCount] = useState(16);
  const [patentsCount, setPatentsCount] = useState(3);
  const [phdCount, setPhdCount] = useState(2);

  // Initial Seed
  useEffect(() => {
    const existing = getCasDossiers(institutionId, { facultyId });
    if (existing.length === 0) {
      seedCasDossierData(institutionId);
      setRefreshKey(k => k + 1);
    }
  }, [institutionId, facultyId]);

  const dossiers = useMemo(() => {
    return getCasDossiers(institutionId, { facultyId });
  }, [institutionId, facultyId, refreshKey]);

  const activeDossier = dossiers.length > 0 ? dossiers[0] : null;
  const summary = useMemo(() => {
    return computeFacultyCasSummary(facultyId, institutionId);
  }, [facultyId, institutionId, refreshKey]);

  const handleStageSelect = (stage: CasCareerStage) => {
    setCasStage(stage);
    if (stage === 'STAGE_1_TO_2') {
      setCurrentDesignation('Assistant Professor (Level 10)');
      setTargetDesignation('Assistant Professor (Level 11)');
      setYearsInGrade(4);
      setClaimedApi(45);
      setPapersCount(2);
      setPhdCount(0);
    } else if (stage === 'STAGE_2_TO_3') {
      setCurrentDesignation('Assistant Professor (Level 11)');
      setTargetDesignation('Assistant Professor (Level 12)');
      setYearsInGrade(5);
      setClaimedApi(55);
      setPapersCount(3);
      setPhdCount(0);
    } else if (stage === 'STAGE_3_TO_4_ASSOC_PROF') {
      setCurrentDesignation('Assistant Professor (Level 12)');
      setTargetDesignation('Associate Professor (Level 13A)');
      setYearsInGrade(3);
      setClaimedApi(80);
      setPapersCount(5);
      setPhdCount(0);
    } else {
      setCurrentDesignation('Associate Professor (Level 13A)');
      setTargetDesignation('Professor (Level 14)');
      setYearsInGrade(4);
      setClaimedApi(145);
      setPapersCount(16);
      setPhdCount(2);
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError(null);

    const res = submitCasDossier({
      institutionId,
      facultyId,
      facultyName,
      department,
      currentDesignation,
      targetDesignation,
      casStage,
      yearsInCurrentGrade: Number(yearsInGrade),
      claimedApiScore: Number(claimedApi),
      scopusPublicationsCount: Number(papersCount),
      patentsCount: Number(patentsCount),
      phdScholarsGuidedCount: Number(phdCount)
    });

    if (!res.success) {
      setApplyError(res.error || 'Failed to submit dossier');
      return;
    }

    setShowApplyModal(false);
    setRefreshKey(k => k + 1);
  };

  const handleIssuePromotionOrder = (dossierId: string) => {
    advanceDossierStatus(dossierId, 'PROMOTION_ORDER_ISSUED', {
      promotionOrderNumber: `UGC-CAS-CONF-${Date.now().toString().slice(-6)}`
    });
    setRefreshKey(k => k + 1);
  };

  const handleExportCSV = () => {
    const csvContent = exportCasDossierRegistryCSV(institutionId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `UGC_CAS_Promotion_Dossier_${facultyId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: DossierStatus) => {
    switch (status) {
      case 'PROMOTION_ORDER_ISSUED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">PROMOTION SANCTIONED</span>;
      case 'EXTERNAL_PEER_REVIEW_APPROVED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">PEER REVIEW CLEARED</span>;
      case 'IQAC_SCRUTINY_CLEARED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800">IQAC SCRUTINIZED</span>;
      case 'SUBMITTED_TO_IQAC':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800">UNDER IQAC REVIEW</span>;
      case 'DRAFT':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">DRAFT</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-950 text-rose-400 border border-rose-800">REJECTED</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Faculty CAS Promotion Dossier & Peer Review Portfolio
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800">
              UGC 2018 Regulations
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Faculty: <span className="text-slate-200 font-medium">{facultyName}</span> ({department}) | Career Advancement Scheme (CAS) Portfolio
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowApplyModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Submit CAS Dossier
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CAS Dossier CSV
          </button>
        </div>
      </div>

      {activeDossier && (
        <>
          {/* Milestone Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                Active Career Advancement Submission ({activeDossier.id})
              </div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{activeDossier.currentDesignation}</span>
                <span className="text-indigo-400">→</span>
                <span className="text-emerald-400">{activeDossier.targetDesignation}</span>
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                IQAC Digital Clearance Seal: {activeDossier.iqacClearanceDigest || 'In Review'}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {getStatusBadge(activeDossier.status)}
              {activeDossier.status === 'EXTERNAL_PEER_REVIEW_APPROVED' && (
                <button
                  onClick={() => handleIssuePromotionOrder(activeDossier.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
                >
                  Issue Formal Promotion Order
                </button>
              )}
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Verified API Score */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-sm">
                <span>Verified PBAS API</span>
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{activeDossier.verifiedApiScore}</span>
                <span className="text-slate-400 text-xs">/ 110 minimum required</span>
              </div>
              <div className="mt-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  ✓ API Score Exceeded (+30 pts)
                </span>
              </div>
            </div>

            {/* Card 2: Research Papers */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-sm">
                <span>Scopus/WoS Papers</span>
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{activeDossier.scopusPublicationsCount}</span>
                <span className="text-slate-400 text-xs">/ 10 required</span>
              </div>
              <p className="mt-3 text-xs text-emerald-400">
                Patents Published/Granted: <span className="font-bold">{activeDossier.patentsCount}</span>
              </p>
            </div>

            {/* Card 3: PhD Supervision */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-sm">
                <span>Doctoral Supervision</span>
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{activeDossier.phdScholarsGuidedCount}</span>
                <span className="text-slate-400 text-xs">PhDs awarded</span>
              </div>
              <p className="mt-3 text-xs text-cyan-300">
                UGC Professorship Invariant Satisfied
              </p>
            </div>

            {/* Card 4: External Peer Review Score */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-sm">
                <span>Peer Review Average</span>
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{activeDossier.averagePeerReviewScore || 0}</span>
                <span className="text-slate-400 text-xs">/ 100</span>
              </div>
              <p className="mt-3 text-xs text-amber-300">
                Evaluated by 2 Premier External Referees
              </p>
            </div>
          </div>

          {/* External Peer Review Scorecards */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-white text-base">External Subject Expert Peer Review Scorecards</h3>
            <p className="text-slate-400 text-xs">
              UGC statutory confidential referee reports submitted by external experts from national institutions of eminence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDossier.externalPeerReviews.map(r => (
                <div key={r.reviewerId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{r.reviewerName}</div>
                      <div className="text-[11px] text-slate-400">{r.affiliation}</div>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {r.scoreOutOf100}/100
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    &ldquo;{r.qualitativeRemarks}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                    <span className="text-emerald-400 font-semibold">{r.recommendation.replace(/_/g, ' ')}</span>
                    <span>Reviewed: {new Date(r.reviewedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Submit UGC CAS Promotion Dossier</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {applyError && (
              <div className="bg-rose-950/60 border border-rose-800 text-rose-300 text-xs p-3 rounded-lg">
                {applyError}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">CAS Career Stage</label>
                <select
                  value={casStage}
                  onChange={e => handleStageSelect(e.target.value as CasCareerStage)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                >
                  <option value="STAGE_1_TO_2">Stage 1 to 2: Assistant Professor (Level 10 to 11)</option>
                  <option value="STAGE_2_TO_3">Stage 2 to 3: Assistant Professor (Level 11 to 12)</option>
                  <option value="STAGE_3_TO_4_ASSOC_PROF">Stage 3 to 4: Associate Professor (Level 12 to 13A)</option>
                  <option value="STAGE_4_TO_5_PROFESSOR">Stage 4 to 5: Full Professor (Level 13A to 14)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Designation</label>
                  <input
                    type="text"
                    required
                    value={currentDesignation}
                    onChange={e => setCurrentDesignation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Designation</label>
                  <input
                    type="text"
                    required
                    value={targetDesignation}
                    onChange={e => setTargetDesignation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Years in Current Grade</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={yearsInGrade}
                    onChange={e => setYearsInGrade(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Claimed API Score</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={claimedApi}
                    onChange={e => setClaimedApi(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Scopus Papers</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={papersCount}
                    onChange={e => setPapersCount(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Patents</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={patentsCount}
                    onChange={e => setPatentsCount(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">PhDs Awarded</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={phdCount}
                    onChange={e => setPhdCount(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                >
                  Submit Dossier to IQAC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
