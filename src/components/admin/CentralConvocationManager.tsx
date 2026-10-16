'use client';

import React, { useState, useMemo } from 'react';
import {
  DegreeScrollRecord,
  ConvocationSession,
  MedalCategory,
  DegreeConfermentMode,
  INITIAL_CONVOCATION_SESSION,
  INITIAL_DEGREE_SCROLLS,
  createDegreeScroll,
  authorizeChancellorSealing,
  dispatchInAbsentiaDegree,
  exportConvocationScrollsCSV,
} from '@/lib/admin/centralConvocation';

export default function CentralConvocationManager() {
  const [session] = useState<ConvocationSession>(INITIAL_CONVOCATION_SESSION);
  const [scrolls, setScrolls] = useState<DegreeScrollRecord[]>(INITIAL_DEGREE_SCROLLS);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'MEDALISTS' | 'SEALED' | 'UNSEALED' | 'IN_ABSENTIA'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [sealModalScroll, setSealModalScroll] = useState<DegreeScrollRecord | null>(null);
  const [dispatchModalScroll, setDispatchModalScroll] = useState<DegreeScrollRecord | null>(null);
  const [inspectSealScroll, setInspectSealScroll] = useState<DegreeScrollRecord | null>(null);

  // New Scholar Form State
  const [enrollmentNumber, setEnrollmentNumber] = useState('2022CSB042');
  const [studentName, setStudentName] = useState('Pooja N. Hegde');
  const [degreeProgram, setDegreeProgram] = useState('Bachelor of Technology in Computer Science & Engineering');
  const [degreeAbbreviation, setDegreeAbbreviation] = useState('B.Tech');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [cgpa, setCgpa] = useState<number>(9.12);
  const [confermentMode, setConfermentMode] = useState<DegreeConfermentMode>('IN_PERSON');
  const [medalAwarded, setMedalAwarded] = useState<MedalCategory | 'NONE'>('NONE');
  const [cohortRank, setCohortRank] = useState<number>(5);
  const [thesisTitle, setThesisTitle] = useState('');

  // Dual Seal Form State
  const [registrarVerified, setRegistrarVerified] = useState(true);
  const [vcVerified, setVcVerified] = useState(true);

  // Dispatch Form State
  const [trackingNumber, setTrackingNumber] = useState('EM948209841IN');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered scrolls
  const filteredScrolls = useMemo(() => {
    return scrolls.filter((s) => {
      let matchesCategory = true;
      if (selectedFilter === 'MEDALISTS') {
        matchesCategory = Boolean(s.medalAwarded);
      } else if (selectedFilter === 'SEALED') {
        matchesCategory = s.dignitarySignaturesVerified;
      } else if (selectedFilter === 'UNSEALED') {
        matchesCategory = !s.dignitarySignaturesVerified;
      } else if (selectedFilter === 'IN_ABSENTIA') {
        matchesCategory = s.confermentMode === 'IN_ABSENTIA';
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.studentName.toLowerCase().includes(q) ||
        s.enrollmentNumber.toLowerCase().includes(q) ||
        s.degreeProgram.toLowerCase().includes(q) ||
        s.degreeWatermarkToken.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [scrolls, selectedFilter, searchQuery]);

  // Telemetry Metrics
  const metrics = useMemo(() => {
    const total = scrolls.length;
    const distinctionCount = scrolls.filter((s) => s.classification === 'FIRST_CLASS_WITH_DISTINCTION').length;
    const medalistsCount = scrolls.filter((s) => Boolean(s.medalAwarded)).length;
    const sealedCount = scrolls.filter((s) => s.dignitarySignaturesVerified).length;
    const inAbsentiaCount = scrolls.filter((s) => s.confermentMode === 'IN_ABSENTIA').length;

    const distinctionPercent = total > 0 ? Math.round((distinctionCount / total) * 100) : 0;
    const sealedPercent = total > 0 ? Math.round((sealedCount / total) * 100) : 0;

    return { total, distinctionCount, distinctionPercent, medalistsCount, sealedCount, sealedPercent, inAbsentiaCount };
  }, [scrolls]);

  // Handle Register Scholar
  const handleRegisterScholar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollmentNumber.trim() || !studentName.trim() || cgpa <= 0) {
      showToast('Please provide all mandatory scholar enrollment details.');
      return;
    }

    try {
      const created = createDegreeScroll({
        studentId: `STU-${Date.now().toString(36).toUpperCase()}`,
        enrollmentNumber: enrollmentNumber.trim(),
        studentName: studentName.trim(),
        degreeProgram: degreeProgram.trim(),
        degreeAbbreviation: degreeAbbreviation.trim(),
        department: department.trim(),
        cgpa: Number(cgpa),
        confermentMode,
        medalAwarded: medalAwarded === 'NONE' ? undefined : medalAwarded,
        cohortRank: medalAwarded !== 'NONE' ? Number(cohortRank) : undefined,
        thesisTitle: thesisTitle.trim() || undefined,
      });

      setScrolls([created, ...scrolls]);
      setIsRegisterModalOpen(false);
      showToast(`Graduating degree scroll initialized: ${created.degreeWatermarkToken}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error registering scholar.';
      showToast(msg);
    }
  };

  // Handle Chancellor Sealing
  const handleAuthorizeSeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sealModalScroll) return;

    try {
      const updated = authorizeChancellorSealing(sealModalScroll, registrarVerified, vcVerified);
      setScrolls(scrolls.map((s) => (s.scrollId === updated.scrollId ? updated : s)));
      setSealModalScroll(null);
      showToast(`Chancellor parchment seal verified for ${updated.studentName}!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sealing authorization failed.';
      showToast(msg);
    }
  };

  // Handle Postal Dispatch
  const handlePostalDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModalScroll || !trackingNumber.trim()) return;

    try {
      const updated = dispatchInAbsentiaDegree(dispatchModalScroll, trackingNumber.trim());
      setScrolls(scrolls.map((s) => (s.scrollId === updated.scrollId ? updated : s)));
      setDispatchModalScroll(null);
      showToast(`In-Absentia degree dispatched via India Post (Tracking: ${trackingNumber})!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Postal dispatch failed.';
      showToast(msg);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent = exportConvocationScrollsCSV(scrolls);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `convocation_degree_ledger_${session.convocationNumber}th_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Convocation degree scroll ledger exported to CSV.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-600 text-white px-5 py-3 rounded-lg shadow-xl border border-amber-400 flex items-center space-x-3 animate-fade-in">
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
            <span className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {session.convocationNumber}th Annual Convocation Degree Scroll Sealing Console
              </h1>
              <p className="text-sm text-slate-400">
                Statutory Degree Conferment Ordinance, Chancellor Protocol & DigiLocker National Academic Depository (NAD)
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
            <span>Export Scrolls CSV</span>
          </button>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition flex items-center space-x-2 shadow-lg shadow-amber-600/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Register Graduating Scholar</span>
          </button>
        </div>
      </div>

      {/* Convocation Session Protocol Banner */}
      <div className="my-6 bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-slate-900/60 border border-amber-900/40 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                OFFICIAL CONVOCATION PROTOCOL
              </span>
              <span className="text-xs text-slate-400 font-mono">Academic Year: {session.academicYear}</span>
            </div>
            <h2 className="text-lg font-bold text-white">Chief Guest: {session.chiefGuest}</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-300">
              <div>
                <span className="text-slate-500">Chancellor:</span> {session.chancellorName}
              </div>
              <div>
                <span className="text-slate-500">Vice Chancellor:</span> {session.viceChancellorName}
              </div>
              <div>
                <span className="text-slate-500">Registrar:</span> {session.registrarName}
              </div>
              <div>
                <span className="text-slate-500">Venue:</span> {session.venue}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold font-mono">
              CONVOCATION: {session.convocationDate}
            </span>
          </div>
        </div>
      </div>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Graduating Cohort</span>
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{metrics.total}</div>
          <div className="text-xs text-slate-500 mt-1">{metrics.inAbsentiaCount} In-Absentia postal awards</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Distinction Ratio</span>
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{metrics.distinctionPercent}%</div>
          <div className="text-xs text-slate-500 mt-1">{metrics.distinctionCount} First Class with Distinction</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Chancellor Medalists</span>
            <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-amber-300 mt-2">{metrics.medalistsCount}</div>
          <div className="text-xs text-slate-500 mt-1">President, Director & Silver medals</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Chancellor Sealed</span>
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-2">{metrics.sealedPercent}%</div>
          <div className="text-xs text-slate-500 mt-1">{metrics.sealedCount} scrolls dual-authenticated</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['ALL', 'All Scholars'],
              ['MEDALISTS', 'Medalists'],
              ['SEALED', 'Chancellor Sealed'],
              ['UNSEALED', 'Pending Seal'],
              ['IN_ABSENTIA', 'In-Absentia'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedFilter(key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedFilter === key
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
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
            placeholder="Search scholar, enrollment, degree, token..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Degree Scrolls Ledger */}
      <div className="space-y-4">
        {filteredScrolls.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-sm">
            No degree scroll records found matching the selected filter criteria.
          </div>
        ) : (
          filteredScrolls.map((scroll) => (
            <div
              key={scroll.scrollId}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition rounded-xl p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                      {scroll.enrollmentNumber}
                    </span>
                    <span className="font-mono text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                      {scroll.degreeWatermarkToken}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        scroll.classification === 'FIRST_CLASS_WITH_DISTINCTION'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : scroll.classification === 'FIRST_CLASS'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : 'bg-slate-700 text-slate-300 border border-slate-600'
                      }`}
                    >
                      {scroll.classification.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-semibold">
                      CGPA {scroll.cgpa.toFixed(2)}
                    </span>
                    {scroll.medalAwarded && (
                      <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-semibold flex items-center space-x-1">
                        <span>🏅</span>
                        <span>{scroll.medalAwarded.replace(/_/g, ' ')}</span>
                      </span>
                    )}
                    {scroll.confermentMode === 'IN_ABSENTIA' && (
                      <span className="text-xs bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded font-medium">
                        IN-ABSENTIA
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-white">{scroll.studentName}</h3>

                  <div className="text-xs text-slate-300">
                    <span className="text-slate-500">Degree:</span> {scroll.degreeProgram} ({scroll.department})
                  </div>

                  {scroll.thesisTitle && (
                    <div className="text-xs bg-slate-950/70 border border-slate-800/80 p-2 rounded text-slate-300">
                      <span className="text-slate-500 font-medium">Dissertation Title:</span> {scroll.thesisTitle}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400 pt-1">
                    <div>
                      <span className="text-slate-500">Chancellor Seal:</span>{' '}
                      {scroll.dignitarySignaturesVerified ? (
                        <span className="text-emerald-400 font-semibold">Dual Sign-off Authenticated</span>
                      ) : (
                        <span className="text-amber-400 font-semibold">Pending Dignitary Sealing</span>
                      )}
                    </div>
                    {scroll.dispatchTrackingNumber && (
                      <div>
                        <span className="text-slate-500">India Post Consignment:</span>{' '}
                        <span className="font-mono text-purple-300">{scroll.dispatchTrackingNumber}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500">DigiLocker:</span>{' '}
                      <span className="font-mono text-slate-400 text-[11px]">{scroll.nadDigiLockerUri}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap lg:flex-col items-end gap-2 mt-4 lg:mt-0">
                  {!scroll.dignitarySignaturesVerified && (
                    <button
                      onClick={() => setSealModalScroll(scroll)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition"
                    >
                      Chancellor Dual Seal
                    </button>
                  )}

                  {scroll.confermentMode === 'IN_ABSENTIA' && scroll.dignitarySignaturesVerified && !scroll.dispatchTrackingNumber && (
                    <button
                      onClick={() => setDispatchModalScroll(scroll)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium transition"
                    >
                      Record Postal Dispatch
                    </button>
                  )}

                  <button
                    onClick={() => setInspectSealScroll(scroll)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition"
                  >
                    View Parchment Seal
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL 1: Register Graduating Scholar */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Register Graduating Scholar for Convocation</h2>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterScholar} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Enrollment Number</label>
                  <input
                    type="text"
                    value={enrollmentNumber}
                    onChange={(e) => setEnrollmentNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                    placeholder="e.g. 2022CSB042"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Student Full Name</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Degree Program</label>
                <input
                  type="text"
                  value={degreeProgram}
                  onChange={(e) => setDegreeProgram(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Degree Abbrev</label>
                  <input
                    type="text"
                    value={degreeAbbreviation}
                    onChange={(e) => setDegreeAbbreviation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    placeholder="B.Tech, M.Tech..."
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
                <div>
                  <label className="block text-slate-400 font-medium mb-1">CGPA (out of 10)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="5.0"
                    max="10.0"
                    value={cgpa}
                    onChange={(e) => setCgpa(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Conferment Mode</label>
                  <select
                    value={confermentMode}
                    onChange={(e) => setConfermentMode(e.target.value as DegreeConfermentMode)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="IN_PERSON">In-Person (Auditorium Stage)</option>
                    <option value="IN_ABSENTIA">In-Absentia (Registered Post)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Medal Allocation</label>
                  <select
                    value={medalAwarded}
                    onChange={(e) => setMedalAwarded(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="NONE">No Medal (Graduating Scholar)</option>
                    <option value="PRESIDENTS_GOLD_MEDAL">President's Gold Medal</option>
                    <option value="CHANCELLORS_GOLD_MEDAL">Chancellor's Gold Medal</option>
                    <option value="DIRECTORS_GOLD_MEDAL">Director's Gold Medal</option>
                    <option value="INSTITUTE_SILVER_MEDAL">Institute Silver Medal</option>
                  </select>
                </div>
              </div>

              {medalAwarded !== 'NONE' && (
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Cohort Academic Rank</label>
                  <input
                    type="number"
                    value={cohortRank}
                    onChange={(e) => setCohortRank(Number(e.target.value))}
                    min={1}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-400 font-medium mb-1">Dissertation Title (Optional for Research)</label>
                <input
                  type="text"
                  value={thesisTitle}
                  onChange={(e) => setThesisTitle(e.target.value)}
                  placeholder="Enter PhD / Master dissertation title..."
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium shadow"
                >
                  Issue Scroll & Generate Watermark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Chancellor Dual Seal Authorization */}
      {sealModalScroll && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Chancellor Dual Dignitary Parchment Seal</h2>
              <button onClick={() => setSealModalScroll(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAuthorizeSeal} className="space-y-4 text-xs">
              <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-1">
                <div className="font-semibold text-slate-200">{sealModalScroll.studentName} ({sealModalScroll.enrollmentNumber})</div>
                <div className="text-slate-400">{sealModalScroll.degreeProgram}</div>
                <div className="font-mono text-amber-400">{sealModalScroll.degreeWatermarkToken}</div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={registrarVerified}
                    onChange={(e) => setRegistrarVerified(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-amber-500"
                  />
                  <span className="text-xs text-slate-200 font-medium">Registrar Attestation & Transcript Ledger Match</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vcVerified}
                    onChange={(e) => setVcVerified(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-amber-500"
                  />
                  <span className="text-xs text-slate-200 font-medium">Vice Chancellor Execution & Chancellor Seal Authorization</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSealModalScroll(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!registrarVerified || !vcVerified}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded font-medium shadow"
                >
                  Affix Chancellor Seal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: In-Absentia Postal Dispatch Modal */}
      {dispatchModalScroll && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Record Registered India Post Dispatch</h2>
              <button onClick={() => setDispatchModalScroll(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handlePostalDispatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">India Post Speed Post Tracking Consignment</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  placeholder="e.g. EM948209841IN"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDispatchModalScroll(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-medium shadow"
                >
                  Confirm Postal Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Parchment Seal Inspector Modal */}
      {inspectSealScroll && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Degree Parchment Seal & DigiLocker Inspector</h2>
              <button onClick={() => setInspectSealScroll(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-slate-500">Scholar & Degree:</div>
                <div className="font-semibold text-white">{inspectSealScroll.studentName} ({inspectSealScroll.enrollmentNumber})</div>
                <div className="text-slate-400">{inspectSealScroll.degreeProgram}</div>
              </div>
              <div>
                <div className="text-slate-500">Watermark Security Token:</div>
                <div className="font-mono text-amber-400 font-semibold">{inspectSealScroll.degreeWatermarkToken}</div>
              </div>
              <div>
                <div className="text-slate-500">National Academic Depository (NAD) URI:</div>
                <div className="font-mono text-indigo-400 break-all">{inspectSealScroll.nadDigiLockerUri}</div>
              </div>
              <div>
                <div className="text-slate-500">SHA-256 Parchment Seal:</div>
                <div className="font-mono text-emerald-400 break-all bg-slate-950 p-2.5 rounded border border-slate-800 select-all">
                  {inspectSealScroll.cryptographicParchmentSeal}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setInspectSealScroll(null)}
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
