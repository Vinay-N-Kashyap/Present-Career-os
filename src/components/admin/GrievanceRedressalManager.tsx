'use client';

import React, { useState } from 'react';
import {
  GrievanceRecord,
  GrievanceCategory,
  GrievanceSeverity,
  GrievanceStatus,
  grievanceStore,
  exportGrievanceAuditCSV,
} from '@/lib/admin/grievance';

interface GrievanceRedressalManagerProps {
  institutionId?: string;
}

// Initial mock grievances to populate store if empty
const SEED_GRIEVANCES = [
  {
    institutionId: 'inst-apex-001',
    category: 'ACADEMIC' as GrievanceCategory,
    severity: 'MEDIUM' as GrievanceSeverity,
    subject: 'Delayed mid-term evaluation feedback for Distributed Systems',
    description: 'The mid-term assignment scores for CS401 have not been released after 3 weeks, delaying preparation for end-semester capstone.',
    isAnonymous: false,
    studentId: 'stu-apex-012',
    studentName: 'Rohan Varma',
    studentEmail: 'rohan.v@apex.edu',
    department: 'Computer Science',
  },
  {
    institutionId: 'inst-apex-001',
    category: 'INFRASTRUCTURE_OR_HOSTEL' as GrievanceCategory,
    severity: 'HIGH' as GrievanceSeverity,
    subject: 'GPU cluster workstation node connectivity failure in AI lab',
    description: 'Nodes 4 and 5 in the AI research lab have recurring kernel panics during deep learning model training. No maintenance response for 10 days.',
    isAnonymous: true,
    department: 'Information Technology',
  },
  {
    institutionId: 'inst-apex-001',
    category: 'HARASSMENT_OR_DISCRIMINATION' as GrievanceCategory,
    severity: 'CRITICAL' as GrievanceSeverity,
    subject: 'Confidential reporting regarding discriminatory remarks during lab viva',
    description: 'Discriminatory comments made regarding regional origin during practical viva examination. Requesting immediate ombudsman committee inquiry.',
    isAnonymous: true,
    department: 'Computer Science',
  },
];

export const GrievanceRedressalManager: React.FC<GrievanceRedressalManagerProps> = ({
  institutionId = 'inst-apex-001',
}) => {
  // Initialize with seed data if store is empty
  useState(() => {
    const existing = grievanceStore.getByInstitution(institutionId);
    if (existing.length === 0) {
      for (const item of SEED_GRIEVANCES) {
        grievanceStore.submit(item);
      }
    }
  });

  const [records, setRecords] = useState<GrievanceRecord[]>(() =>
    grievanceStore.getByInstitution(institutionId)
  );

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<GrievanceRecord | null>(null);

  // Hearing Modal State
  const [hearingDate, setHearingDate] = useState<string>('2026-10-24T14:00');
  const [committeeChair, setCommitteeChair] = useState<string>('Dr. V. Ramanathan (Ombudsman)');
  const [meetingVenue, setMeetingVenue] = useState<string>('Senate Hall A / Secure Web Conference');
  const [hearingNotes, setHearingNotes] = useState<string>('');

  // Resolution Modal State
  const [resolutionSummary, setResolutionSummary] = useState<string>('');
  const [actionAuthor, setActionAuthor] = useState<string>('Dean of Student Welfare');
  const [isResolveModalOpen, setIsResolveModalOpen] = useState<boolean>(false);
  const [isHearingModalOpen, setIsHearingModalOpen] = useState<boolean>(false);
  const [isNewFilingOpen, setIsNewFilingOpen] = useState<boolean>(false);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  // New filing state
  const [newSubject, setNewSubject] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newCategory, setNewCategory] = useState<GrievanceCategory>('ACADEMIC');
  const [newSeverity, setNewSeverity] = useState<GrievanceSeverity>('MEDIUM');
  const [newDept, setNewDept] = useState<string>('Computer Science');
  const [newAnonymous, setNewAnonymous] = useState<boolean>(true);

  const refreshList = () => {
    setRecords(grievanceStore.getByInstitution(institutionId));
  };

  const filteredRecords = records.filter(r => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
    return true;
  });

  const totalCases = records.length;
  const overdueCases = records.filter(r => r.isOverdue).length;
  const pendingHearings = records.filter(r => r.status === 'HEARING_SCHEDULED').length;
  const closedOrResolved = records.filter(r => r.status === 'ACTION_TAKEN' || r.status === 'CLOSED').length;
  const resolutionRate = totalCases > 0 ? Math.round((closedOrResolved / totalCases) * 100) : 100;

  const handleScheduleHearing = () => {
    if (!selectedRecord) return;
    grievanceStore.scheduleHearing({
      grievanceId: selectedRecord.grievanceId,
      institutionId,
      hearing: {
        hearingDate,
        locationOrMeetingLink: meetingVenue,
        committeeChair,
        committeeMembers: ['Dean Academics', 'Student Council Representative', 'External Legal Advisor'],
        notes: hearingNotes,
      },
    });

    setIsHearingModalOpen(false);
    refreshList();
    const updated = grievanceStore.trackByToken(selectedRecord.trackingToken);
    setSelectedRecord(updated);
    setBannerNotice(`Formal hearing scheduled for ${selectedRecord.trackingToken}`);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const handleResolveGrievance = () => {
    if (!selectedRecord || !resolutionSummary.trim()) return;
    grievanceStore.resolveGrievance({
      grievanceId: selectedRecord.grievanceId,
      institutionId,
      actionAuthor,
      resolutionSummary: resolutionSummary.trim(),
      targetStatus: 'ACTION_TAKEN',
    });

    setIsResolveModalOpen(false);
    setResolutionSummary('');
    refreshList();
    const updated = grievanceStore.trackByToken(selectedRecord.trackingToken);
    setSelectedRecord(updated);
    setBannerNotice(`Action Taken Report filed for ${selectedRecord.trackingToken}`);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const handleFileNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    const record = grievanceStore.submit({
      institutionId,
      category: newCategory,
      severity: newSeverity,
      subject: newSubject.trim(),
      description: newDescription.trim(),
      isAnonymous: newAnonymous,
      department: newDept,
      studentId: newAnonymous ? undefined : 'stu-apex-099',
      studentName: newAnonymous ? undefined : 'Pooja Hegde',
      studentEmail: newAnonymous ? undefined : 'pooja.h@apex.edu',
    });

    setIsNewFilingOpen(false);
    setNewSubject('');
    setNewDescription('');
    refreshList();
    setBannerNotice(`Grievance filed successfully with Private Tracking Token: ${record.trackingToken}`);
    setTimeout(() => setBannerNotice(null), 6000);
  };

  const handleExportCSV = () => {
    const csv = exportGrievanceAuditCSV(records);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `Ombudsman_Grievance_Report_${institutionId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBannerNotice('Ombudsman regulatory audit CSV exported successfully.');
    setTimeout(() => setBannerNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xl font-bold">
            ⚖️
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Student Grievance Redressal & Ombudsman Portal
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              AICTE / UGC compliant statutory dispute resolution with zero-knowledge anonymity and 15-day SLA enforcement.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewFilingOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <span>+</span> File Grievance Ticket
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
          >
            <span>📥</span> Export Audit CSV
          </button>
        </div>
      </div>

      {bannerNotice && (
        <div className="p-3 bg-indigo-950/50 border border-indigo-500/40 text-indigo-300 text-sm rounded-lg flex items-center gap-2">
          <span>ℹ️</span> {bannerNotice}
        </div>
      )}

      {/* Statutory SLA Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Cases</div>
          <div className="text-3xl font-bold text-slate-100 mt-2">{totalCases}</div>
          <div className="text-xs text-slate-500 mt-1">Across all departments</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">SLA Overdue (&gt; 15 Days)</div>
          <div className="text-3xl font-bold text-rose-400 mt-2">{overdueCases}</div>
          <div className="text-xs text-rose-300/80 mt-1">Requires immediate escalation</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Scheduled Hearings</div>
          <div className="text-3xl font-bold text-amber-400 mt-2">{pendingHearings}</div>
          <div className="text-xs text-slate-500 mt-1">Committee review in session</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Resolution Rate</div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">{resolutionRate}%</div>
          <div className="text-xs text-slate-500 mt-1">{closedOrResolved} of {totalCases} resolved</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_COMMITTEE_REVIEW">Under Review</option>
              <option value="HEARING_SCHEDULED">Hearing Scheduled</option>
              <option value="ACTION_TAKEN">Action Taken</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Categories</option>
              <option value="ACADEMIC">Academic</option>
              <option value="HARASSMENT_OR_DISCRIMINATION">Harassment / Discrimination</option>
              <option value="FEE_OR_FINANCIAL">Fee / Financial</option>
              <option value="INFRASTRUCTURE_OR_HOSTEL">Infrastructure / Hostel</option>
              <option value="DISCIPLINARY_OR_PROCTORIAL">Disciplinary</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Showing {filteredRecords.length} ticket(s)
        </div>
      </div>

      {/* Main Grid: Tickets list + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredRecords.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-400">
              No grievances found matching the selected filter criteria.
            </div>
          ) : (
            filteredRecords.map((item) => {
              const isSelected = selectedRecord?.grievanceId === item.grievanceId;

              const severityBadge = {
                CRITICAL: 'text-rose-400 bg-rose-950/60 border-rose-500/40',
                HIGH: 'text-amber-400 bg-amber-950/60 border-amber-500/40',
                MEDIUM: 'text-blue-400 bg-blue-950/60 border-blue-500/40',
                LOW: 'text-slate-400 bg-slate-950/60 border-slate-700',
              }[item.severity];

              return (
                <div
                  key={item.grievanceId}
                  onClick={() => setSelectedRecord(item)}
                  className={`p-4 bg-slate-900 border rounded-xl cursor-pointer transition flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-indigo-500 ring-1 ring-indigo-500 bg-slate-800/80'
                      : 'border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-950 text-indigo-400 border border-indigo-500/30">
                          {item.trackingToken}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${severityBadge}`}>
                          {item.severity}
                        </span>
                        {item.isAnonymous && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-500/30">
                            🔒 Anonymous
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-slate-100">
                        {item.subject}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-950 text-slate-300 border border-slate-700">
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                      <span>Dept: {item.department}</span>
                      <span>•</span>
                      <span>Filed: {item.submittedAt.split('T')[0]}</span>
                    </div>

                    <div>
                      {item.isOverdue ? (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          ⚠️ SLA EXCEEDED
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium">
                          {item.slaDaysRemaining}d remaining in SLA
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Record Detail Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          {selectedRecord ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs text-slate-400">Tracking Token</span>
                  <div className="text-lg font-mono font-bold text-indigo-400">
                    {selectedRecord.trackingToken}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Statutory SLA</span>
                  <div className={`text-sm font-bold ${selectedRecord.isOverdue ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedRecord.isOverdue ? 'OVERDUE' : `${selectedRecord.slaDaysRemaining} Days Left`}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject</label>
                <div className="text-sm font-bold text-slate-100 mt-1">{selectedRecord.subject}</div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filer Identification</label>
                <div className="text-sm text-slate-300 mt-1 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  {selectedRecord.isAnonymous ? (
                    <div className="flex items-center gap-2 text-purple-400 text-xs">
                      <span>🔒</span> Confidential / Anonymous Student (PII Redacted)
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold text-slate-200">{selectedRecord.studentName}</div>
                      <div className="text-xs text-slate-400">{selectedRecord.studentEmail} • ID: {selectedRecord.studentId}</div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confidential Grievance Statement</label>
                <div className="text-sm text-slate-300 mt-1 p-3 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedRecord.description}
                </div>
              </div>

              {selectedRecord.hearingDetails && (
                <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg space-y-1 text-xs">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>📅</span> Committee Hearing Scheduled
                  </div>
                  <div className="text-amber-200">Date: {new Date(selectedRecord.hearingDetails.hearingDate).toLocaleString()}</div>
                  <div className="text-amber-200">Venue: {selectedRecord.hearingDetails.locationOrMeetingLink}</div>
                  <div className="text-amber-200">Chair: {selectedRecord.hearingDetails.committeeChair}</div>
                </div>
              )}

              {selectedRecord.actionTakenReport && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg space-y-1 text-xs">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <span>✅</span> Action Taken Report (ATR)
                  </div>
                  <div className="text-emerald-200">Author: {selectedRecord.actionTakenReport.actionAuthor}</div>
                  <div className="text-emerald-200 mt-1">{selectedRecord.actionTakenReport.resolutionSummary}</div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => setIsHearingModalOpen(true)}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold transition"
                >
                  Schedule Ombudsman Hearing
                </button>
                <button
                  onClick={() => setIsResolveModalOpen(true)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition"
                >
                  File Action Taken Report (ATR)
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-8 text-slate-500 text-sm">
              Select a grievance ticket from the queue to view full audit logs, schedule ombudsman hearings, and file Action Taken Reports.
            </div>
          )}
        </div>
      </div>

      {/* Hearing Modal */}
      {isHearingModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>📅</span> Schedule Ombudsman Committee Hearing
            </h3>
            <p className="text-xs text-slate-400">
              Mandatory under AICTE Section 4 for tickets pending resolution beyond statutory review period.
            </p>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={hearingDate}
                  onChange={(e) => setHearingDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Committee Chair</label>
                <input
                  type="text"
                  value={committeeChair}
                  onChange={(e) => setCommitteeChair(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Venue / Secure Conference Link</label>
                <input
                  type="text"
                  value={meetingVenue}
                  onChange={(e) => setMeetingVenue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Confidential Committee Notes</label>
                <textarea
                  rows={3}
                  value={hearingNotes}
                  onChange={(e) => setHearingNotes(e.target.value)}
                  placeholder="Notes for committee members..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setIsHearingModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleHearing}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold"
              >
                Confirm Hearing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve / ATR Modal */}
      {isResolveModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>✅</span> File Action Taken Report (ATR)
            </h3>
            <p className="text-xs text-slate-400">
              Formally close ticket and notify complainant via cryptographic tracking token.
            </p>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Authorizing Official</label>
                <input
                  type="text"
                  value={actionAuthor}
                  onChange={(e) => setActionAuthor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Resolution Summary & Corrective Action</label>
                <textarea
                  rows={4}
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  placeholder="Detail the remedial measures enacted..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setIsResolveModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveGrievance}
                disabled={!resolutionSummary.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold"
              >
                Submit Action Taken Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Grievance Filing Modal */}
      {isNewFilingOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form onSubmit={handleFileNew} className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>📝</span> File New Student Grievance Ticket
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as GrievanceCategory)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                >
                  <option value="ACADEMIC">Academic Dispute / Evaluation</option>
                  <option value="HARASSMENT_OR_DISCRIMINATION">Harassment / Discrimination</option>
                  <option value="FEE_OR_FINANCIAL">Fee / Financial Dispute</option>
                  <option value="INFRASTRUCTURE_OR_HOSTEL">Infrastructure / Hostel</option>
                  <option value="DISCIPLINARY_OR_PROCTORIAL">Disciplinary Action</option>
                  <option value="GENERAL">General Grievance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Severity</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as GrievanceSeverity)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                >
                  <option value="LOW">Low (Minor grievance)</option>
                  <option value="MEDIUM">Medium (Standard academic)</option>
                  <option value="HIGH">High (Impacts graduation / career)</option>
                  <option value="CRITICAL">Critical (Harassment / Safety)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Department</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Concise summary of issue"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide chronological facts and specifics..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={newAnonymous}
                  onChange={(e) => setNewAnonymous(e.target.checked)}
                  className="accent-indigo-500 rounded cursor-pointer"
                />
                <label htmlFor="anonymousCheck" className="text-xs text-slate-300 cursor-pointer">
                  Submit Anonymously (Zero-knowledge token, PII redacted from committee)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsNewFilingOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GrievanceRedressalManager;
