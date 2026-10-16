'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  SabbaticalApplication,
  LeaveType,
  LeaveStatus,
  getSabbaticalApplications,
  requestSabbaticalLeave,
  updateSabbaticalStatus,
  computeLeaveSummary,
  exportSabbaticalLeaveCSV,
  seedSabbaticalData
} from '@/lib/teacher/sabbaticalLeave';

interface SabbaticalPortalStudioProps {
  institutionId?: string;
  facultyId?: string;
  facultyName?: string;
  department?: string;
  currentDesignation?: string;
}

export const SabbaticalPortalStudio: React.FC<SabbaticalPortalStudioProps> = ({
  institutionId = 'inst-apex-001',
  facultyId = 'FAC-CSE-001',
  facultyName = 'Dr. Aris Thorne',
  department = 'Computer Science & Engineering',
  currentDesignation = 'Associate Professor',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  // Form State
  const [leaveType, setLeaveType] = useState<LeaveType>('SABBATICAL_RESEARCH');
  const [hostInstitution, setHostInstitution] = useState('');
  const [hostCountry, setHostCountry] = useState('India');
  const [researchTitle, setResearchTitle] = useState('');
  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2027-06-30');
  const [durationMonths, setDurationMonths] = useState(12);
  const [serviceYears, setServiceYears] = useState(7);

  // Initial Seed
  useEffect(() => {
    const existing = getSabbaticalApplications(institutionId);
    if (existing.length === 0) {
      seedSabbaticalData(institutionId);
      setRefreshKey(k => k + 1);
    }
  }, [institutionId]);

  const applications = useMemo(() => {
    return getSabbaticalApplications(institutionId);
  }, [institutionId, refreshKey]);

  const summary = useMemo(() => {
    return computeLeaveSummary(institutionId);
  }, [institutionId, refreshKey]);

  const filteredApplications = useMemo(() => {
    return applications.filter(a => {
      const matchesType = typeFilter === 'ALL' || a.leaveType === typeFilter;
      const matchesSearch = a.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.hostInstitution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.researchPlanTitle.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [applications, typeFilter, searchTerm]);

  const handleExportCSV = () => {
    const csvContent = exportSabbaticalLeaveCSV(institutionId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Faculty_Sabbaticals_Audit_${institutionId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError(null);

    if (!hostInstitution.trim() || !researchTitle.trim()) {
      setApplyError('Please fill all required fields');
      return;
    }

    const res = requestSabbaticalLeave({
      institutionId,
      facultyId,
      facultyName,
      department,
      currentDesignation,
      yearsOfContinuousService: serviceYears,
      leaveType,
      hostInstitution: hostInstitution.trim(),
      hostCountry: hostCountry.trim(),
      researchPlanTitle: researchTitle.trim(),
      startDate,
      endDate,
      durationMonths
    });

    if (!res.success) {
      setApplyError(res.error || 'Failed to submit sabbatical application');
      return;
    }

    setShowApplyModal(false);
    setHostInstitution('');
    setResearchTitle('');
    setRefreshKey(k => k + 1);
  };

  const handleAdvanceStatus = (appId: string, newStatus: LeaveStatus) => {
    const note = prompt(`Enter comments for advancing to ${newStatus}:`);
    if (note !== null) {
      updateSabbaticalStatus(appId, newStatus, { notes: note.trim() });
      setRefreshKey(k => k + 1);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 bg-slate-900 text-slate-100 rounded-xl min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-cyan-600/20 text-cyan-400 rounded-lg border border-cyan-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Faculty Sabbatical & Academic Deputation Portal</h1>
              <p className="text-sm text-slate-400">
                UGC Sabbatical Compliance (6-Yr Service Rule) • National/International Deputations • Research Lien Preservation
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setApplyError(null);
              setShowApplyModal(true);
            }}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            + Request Sabbatical Leave
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Sabbatical CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active on Sabbatical</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-cyan-400">{summary.activeFacultyOnSabbatical}</h3>
            <span className="text-xs text-slate-400">scholars</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">With full research pay allowance</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Academic Deputations</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-blue-400">{summary.totalDeputations}</h3>
            <span className="text-xs text-slate-400">deputed to IITs/foreign labs</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Lien on parent professorship maintained</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Governance Review</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-amber-400">{summary.pendingApprovalsCount}</h3>
            <span className="text-xs text-slate-400">requests</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">HoD & Faculty Affairs Committee</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Statutory Eligibility</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-emerald-400">≥ 6 Yrs</h3>
            <span className="text-xs text-slate-400">UGC Service Rule</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Max 12 continuous months per cycle</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search scholar or host institution..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 w-full sm:w-64"
          />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Leave Types</option>
            <option value="SABBATICAL_RESEARCH">Sabbatical Research</option>
            <option value="ACADEMIC_DEPUTATION">Academic Deputation</option>
            <option value="POSTDOC_FELLOWSHIP">Postdoc Fellowship</option>
            <option value="STUDY_LEAVE">Study Leave</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400">
            No sabbatical or academic deputation records found.
          </div>
        ) : (
          filteredApplications.map(app => (
            <div
              key={app.id}
              className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 hover:border-slate-600 transition space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-700/50 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-cyan-400">{app.id}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                      {app.leaveType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400">{app.yearsOfContinuousService} Years Service</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{app.facultyName}</h3>
                  <p className="text-xs text-slate-400">{app.currentDesignation} • {app.department}</p>
                </div>

                <div className="text-right">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block ${
                    app.status === 'SANCTIONED'
                      ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/40'
                      : app.status === 'HOD_RECOMMENDED'
                      ? 'bg-blue-900/40 text-blue-300 border border-blue-500/40'
                      : 'bg-amber-900/40 text-amber-300 border border-amber-500/40'
                  }`}>
                    {app.status.replace(/_/g, ' ')}
                  </span>
                  {app.sanctionOrderNumber && (
                    <p className="text-xs font-mono text-emerald-400 mt-1">Sanction: {app.sanctionOrderNumber}</p>
                  )}
                </div>
              </div>

              {/* Research Plan & Host Institution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-400">Research Plan</p>
                  <p className="text-sm font-semibold text-white">{app.researchPlanTitle}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400">Host Institution & Country</p>
                  <p className="text-sm font-semibold text-slate-200">{app.hostInstitution} ({app.hostCountry})</p>
                  <p className="text-slate-400">Duration: {app.durationMonths} Months ({app.startDate} to {app.endDate})</p>
                </div>
              </div>

              {app.hodNotes && (
                <div className="p-2.5 bg-slate-900/60 rounded text-xs text-slate-300 border border-slate-800">
                  <span className="text-slate-400 font-semibold">HoD Endorsement Notes:</span> {app.hodNotes}
                </div>
              )}

              {/* Status Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/50">
                {app.status === 'REQUESTED' && (
                  <button
                    onClick={() => handleAdvanceStatus(app.id, 'HOD_RECOMMENDED')}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded"
                  >
                    HoD Endorse & Forward
                  </button>
                )}

                {app.status === 'HOD_RECOMMENDED' && (
                  <button
                    onClick={() => handleAdvanceStatus(app.id, 'SANCTIONED')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded shadow"
                  >
                    Issue Sanction Order
                  </button>
                )}

                {app.status === 'SANCTIONED' && (
                  <button
                    onClick={() => handleAdvanceStatus(app.id, 'COMPLETED_REPORT_SUBMITTED')}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded"
                  >
                    Submit Completion Monograph
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sabbatical Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Request Sabbatical / Academic Deputation</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {applyError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-lg text-rose-300 text-xs">
                {applyError}
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Leave Type</label>
                  <select
                    value={leaveType}
                    onChange={e => setLeaveType(e.target.value as LeaveType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="SABBATICAL_RESEARCH">Sabbatical Research</option>
                    <option value="ACADEMIC_DEPUTATION">Academic Deputation</option>
                    <option value="POSTDOC_FELLOWSHIP">Postdoc Fellowship</option>
                    <option value="STUDY_LEAVE">Study Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Continuous Service (Years)</label>
                  <input
                    type="number"
                    required
                    value={serviceYears}
                    onChange={e => setServiceYears(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Host Institution / Research Lab</label>
                <input
                  type="text"
                  required
                  value={hostInstitution}
                  onChange={e => setHostInstitution(e.target.value)}
                  placeholder="e.g. Cambridge Computer Laboratory"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Host Country</label>
                  <input
                    type="text"
                    required
                    value={hostCountry}
                    onChange={e => setHostCountry(e.target.value)}
                    placeholder="e.g. United Kingdom"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Duration (Months, ≤ 12)</label>
                  <input
                    type="number"
                    max={12}
                    required
                    value={durationMonths}
                    onChange={e => setDurationMonths(parseInt(e.target.value) || 12)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Research Project Title & Abstract</label>
                <textarea
                  required
                  rows={3}
                  value={researchTitle}
                  onChange={e => setResearchTitle(e.target.value)}
                  placeholder="Detail the focus of study, research monographs to be written, and intended institutional publications..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
