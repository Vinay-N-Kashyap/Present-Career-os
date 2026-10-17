'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  FacultyFdpRecord,
  FdpCategory,
  DeliveryMode,
  FdpStatus,
  getFdpRecords,
  registerFdpParticipation,
  advanceFdpStatus,
  verifyFdpCertificate,
  computeFacultyCpdSummary,
  calculateCpdCredits,
  exportFacultyFdpCSV,
  seedFacultyFdpData
} from '@/lib/teacher/facultyFdp';

interface FacultyFdpStudioProps {
  institutionId?: string;
  facultyId?: string;
  facultyName?: string;
  department?: string;
}

export const FacultyFdpStudio: React.FC<FacultyFdpStudioProps> = ({
  institutionId = 'inst-apex-001',
  facultyId = 'FAC-CS-001',
  facultyName = 'Dr. Aris Thorne',
  department = 'Computer Science'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal State
  const [showLogModal, setShowLogModal] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FdpCategory>('AICTE_ATAL_ACADEMY');
  const [organizingBody, setOrganizingBody] = useState('');
  const [mode, setMode] = useState<DeliveryMode>('HYBRID');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-06');
  const [durationDays, setDurationDays] = useState(6);
  const [contactHours, setContactHours] = useState(36);
  const [certificateUrl, setCertificateUrl] = useState('');

  // Initial Seed
  useEffect(() => {
    const existing = getFdpRecords(institutionId, { facultyId });
    if (existing.length === 0) {
      seedFacultyFdpData(institutionId);
      setRefreshKey(k => k + 1);
    }
  }, [institutionId, facultyId]);

  const records = useMemo(() => {
    return getFdpRecords(institutionId, { facultyId });
  }, [institutionId, facultyId, refreshKey]);

  const summary = useMemo(() => {
    return computeFacultyCpdSummary(facultyId, institutionId);
  }, [facultyId, institutionId, refreshKey]);

  const calculatedCreditsPreview = useMemo(() => {
    return calculateCpdCredits(category, durationDays, contactHours);
  }, [category, durationDays, contactHours]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesCategory = categoryFilter === 'ALL' || r.category === categoryFilter;
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.organizingBody.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [records, categoryFilter, statusFilter, searchTerm]);

  const handleExportCSV = () => {
    const csvContent = exportFacultyFdpCSV(institutionId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NAAC_Criterion_6_3_FDP_${facultyId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLogError(null);

    const res = registerFdpParticipation({
      institutionId,
      facultyId,
      facultyName,
      department,
      title: title.trim(),
      category,
      organizingBody: organizingBody.trim() || 'Premier University / Institute',
      mode,
      startDate,
      endDate,
      durationDays: Number(durationDays),
      totalContactHours: Number(contactHours),
      status: certificateUrl.trim() ? 'ATTENDED' : 'PLANNED',
      certificateUrl: certificateUrl.trim() || undefined
    });

    if (!res.success) {
      setLogError(res.error || 'Failed to log FDP record');
      return;
    }

    setShowLogModal(false);
    setTitle('');
    setOrganizingBody('');
    setCertificateUrl('');
    setRefreshKey(k => k + 1);
  };

  const handleVerify = (recordId: string) => {
    verifyFdpCertificate(recordId, 'Dean of Faculty Affairs');
    setRefreshKey(k => k + 1);
  };

  const getStatusBadge = (status: FdpStatus) => {
    switch (status) {
      case 'CERTIFICATE_VERIFIED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">VERIFIED</span>;
      case 'ATTENDED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">ATTENDED</span>;
      case 'DEPUTED_BY_INSTITUTION':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800">DEPUTED</span>;
      case 'PLANNED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800">PLANNED</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Faculty Continuous Professional Development (CPD) Studio
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800">
              NAAC Criterion 6.3
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Faculty: <span className="text-slate-200 font-medium">{facultyName}</span> ({department}) | AICTE / UGC Annual FDP Credits Tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Log FDP Participation
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export NAAC 6.3 CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total CPD Credits */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Annual CPD Credits</span>
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary.totalCreditsEarned}</span>
            <span className="text-slate-400 text-xs">/ 40 target credits</span>
          </div>
          <div className="mt-3">
            {summary.isAicteCompliant ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                ✓ AICTE 40-Credit Quota Met
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800">
                ⚠ Deficit: {summary.creditsDeficit} Credits
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Completed FDPs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Completed FDPs</span>
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary.totalFdpCount}</span>
            <span className="text-slate-400 text-xs">programs certified</span>
          </div>
          <p className="mt-3 text-xs text-emerald-400">
            Total Training: <span className="font-semibold">{summary.totalHoursCompleted} hrs</span>
          </p>
        </div>

        {/* Card 3: AICTE ATAL Academy */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>AICTE ATAL / NPTEL</span>
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {summary.categoryBreakdown.AICTE_ATAL_ACADEMY + summary.categoryBreakdown.NPTEL_SWAYAM_MOOC}
            </span>
            <span className="text-slate-400 text-xs">national programs</span>
          </div>
          <p className="mt-3 text-xs text-cyan-300">
            Advanced Tech & Pedagogy certified
          </p>
        </div>

        {/* Card 4: Industry Immersion */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Industry Immersion</span>
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary.categoryBreakdown.INDUSTRY_IMMERSION}</span>
            <span className="text-slate-400 text-xs">corporate immersions</span>
          </div>
          <p className="mt-3 text-xs text-amber-300">
            20 credits per 2-week cycle
          </p>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FDP title or organizing body..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Categories</option>
              <option value="AICTE_ATAL_ACADEMY">AICTE ATAL Academy</option>
              <option value="UGC_HRDC_ORIENTATION">UGC HRDC Orientation</option>
              <option value="NPTEL_SWAYAM_MOOC">NPTEL / SWAYAM MOOC</option>
              <option value="INDUSTRY_IMMERSION">Industry Immersion</option>
              <option value="PEDAGOGICAL_WORKSHOP">Pedagogical Workshop</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="CERTIFICATE_VERIFIED">Verified</option>
              <option value="ATTENDED">Attended</option>
              <option value="DEPUTED_BY_INSTITUTION">Deputed</option>
              <option value="PLANNED">Planned</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">FDP Program & Organizer</th>
                <th className="py-3 px-3">Category & Mode</th>
                <th className="py-3 px-3">Timeline & Hours</th>
                <th className="py-3 px-3">CPD Credits</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredRecords.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-white">{r.title}</div>
                    <div className="text-[11px] text-slate-400">{r.organizingBody}</div>
                    <div className="text-[10px] text-indigo-400 font-mono mt-0.5">{r.id}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-medium text-slate-200">{r.category.replace(/_/g, ' ')}</div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {r.mode}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-slate-300">
                      {new Date(r.startDate).toLocaleDateString()} to {new Date(r.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {r.durationDays} days ({r.totalContactHours} contact hrs)
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-extrabold text-indigo-400 text-sm">+{r.creditsEarned}</span>
                    <span className="text-slate-400 text-xs"> credits</span>
                  </td>

                  <td className="py-3.5 px-3">
                    {getStatusBadge(r.status)}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    {r.status === 'CERTIFICATE_VERIFIED' ? (
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-emerald-400">
                          {r.certificateVerificationHash}
                        </span>
                        <div className="text-[10px] text-slate-500">Verified by {r.verifiedBy}</div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleVerify(r.id)}
                        className="px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 rounded text-[11px] font-medium border border-emerald-700/50"
                      >
                        Verify Certificate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Log Faculty Development Program (FDP)</h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {logError && (
              <div className="bg-rose-950/60 border border-rose-800 text-rose-300 text-xs p-3 rounded-lg">
                {logError}
              </div>
            )}

            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Program Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AICTE ATAL Workshop on Generative AI & High-Performance Computing"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as FdpCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="AICTE_ATAL_ACADEMY">AICTE ATAL Academy</option>
                    <option value="UGC_HRDC_ORIENTATION">UGC HRDC Orientation</option>
                    <option value="NPTEL_SWAYAM_MOOC">NPTEL / SWAYAM MOOC</option>
                    <option value="INDUSTRY_IMMERSION">Industry Immersion</option>
                    <option value="PEDAGOGICAL_WORKSHOP">Pedagogical Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Delivery Mode</label>
                  <select
                    value={mode}
                    onChange={e => setMode(e.target.value as DeliveryMode)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="HYBRID">Hybrid</option>
                    <option value="ONLINE">Online</option>
                    <option value="IN_PERSON">In-Person</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Organizing Body / Host Institute</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IIT Delhi / NPTEL / Microsoft Research"
                  value={organizingBody}
                  onChange={e => setOrganizingBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={durationDays}
                    onChange={e => setDurationDays(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Contact Hours</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={contactHours}
                    onChange={e => setContactHours(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-400">Projected CPD Credit Score:</span>
                <span className="text-indigo-400 font-bold text-sm">+{calculatedCreditsPreview} Credits</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Certificate URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://swayam.gov.in/certificate/FDP-2026"
                  value={certificateUrl}
                  onChange={e => setCertificateUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                >
                  Save FDP Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
