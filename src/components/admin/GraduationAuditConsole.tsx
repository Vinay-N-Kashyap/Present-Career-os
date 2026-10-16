'use client';

import React, { useState } from 'react';
import {
  StudentTranscript,
  DegreeAuditResult,
  GraduationStatus,
  degreeAuditStore,
  exportConvocationRosterCSV,
} from '@/lib/admin/degreeAudit';

interface GraduationAuditConsoleProps {
  institutionId?: string;
}

const SEED_TRANSCRIPTS: StudentTranscript[] = [
  {
    studentId: 'CS2026-001',
    institutionId: 'inst-apex-001',
    studentName: 'Aarav Patel',
    degreeName: 'B.Tech Computer Science & Engineering',
    department: 'Computer Science',
    admissionYear: 2022,
    expectedGraduationYear: 2026,
    coreCreditsEarned: 104,
    electiveCreditsEarned: 42,
    capstoneCreditsEarned: 20, // Total 166 >= 160
    cgpa: 9.24,
    activeBacklogsCount: 0,
    pendingFeeDues: 0,
    disciplinaryHold: false,
  },
  {
    studentId: 'CS2026-015',
    institutionId: 'inst-apex-001',
    studentName: 'Rohan Varma',
    degreeName: 'B.Tech Computer Science & Engineering',
    department: 'Computer Science',
    admissionYear: 2022,
    expectedGraduationYear: 2026,
    coreCreditsEarned: 100,
    electiveCreditsEarned: 40,
    capstoneCreditsEarned: 20, // Total 160 >= 160
    cgpa: 8.62,
    activeBacklogsCount: 0,
    pendingFeeDues: 0,
    disciplinaryHold: false,
  },
  {
    studentId: 'CS2026-034',
    institutionId: 'inst-apex-001',
    studentName: 'Ananya Deshmukh',
    degreeName: 'B.Tech Computer Science & Engineering',
    department: 'Computer Science',
    admissionYear: 2022,
    expectedGraduationYear: 2026,
    coreCreditsEarned: 96, // Core deficit (needs 100)
    electiveCreditsEarned: 40,
    capstoneCreditsEarned: 16, // Total 152 < 160
    cgpa: 7.84,
    activeBacklogsCount: 1, // 1 backlog
    pendingFeeDues: 0,
    disciplinaryHold: false,
  },
  {
    studentId: 'IT2026-008',
    institutionId: 'inst-apex-001',
    studentName: 'Devansh Kulkarni',
    degreeName: 'B.Tech Information Technology',
    department: 'Information Technology',
    admissionYear: 2022,
    expectedGraduationYear: 2026,
    coreCreditsEarned: 102,
    electiveCreditsEarned: 40,
    capstoneCreditsEarned: 20, // Total 162 >= 160
    cgpa: 8.15,
    activeBacklogsCount: 0,
    pendingFeeDues: 18500, // Bursar financial hold
    disciplinaryHold: false,
  },
  {
    studentId: 'IT2026-022',
    institutionId: 'inst-apex-001',
    studentName: 'Kabir Singhania',
    degreeName: 'B.Tech Information Technology',
    department: 'Information Technology',
    admissionYear: 2022,
    expectedGraduationYear: 2026,
    coreCreditsEarned: 100,
    electiveCreditsEarned: 40,
    capstoneCreditsEarned: 20,
    cgpa: 7.42,
    activeBacklogsCount: 0,
    pendingFeeDues: 0,
    disciplinaryHold: true, // Disciplinary hold
  },
];

export const GraduationAuditConsole: React.FC<GraduationAuditConsoleProps> = ({
  institutionId = 'inst-apex-001',
}) => {
  // Seed store if empty
  useState(() => {
    const existing = degreeAuditStore.getAuditsByInstitution(institutionId);
    if (existing.length === 0) {
      for (const t of SEED_TRANSCRIPTS) {
        degreeAuditStore.recordAudit(t);
      }
    }
  });

  const [audits, setAudits] = useState<DegreeAuditResult[]>(() =>
    degreeAuditStore.getAuditsByInstitution(institutionId)
  );

  const [selectedAudit, setSelectedAudit] = useState<DegreeAuditResult | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const refreshList = () => {
    setAudits(degreeAuditStore.getAuditsByInstitution(institutionId));
  };

  const filteredAudits = audits.filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (deptFilter !== 'ALL' && a.department.toLowerCase() !== deptFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = a.studentName.toLowerCase().includes(q) || a.studentId.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalSeniors = audits.length;
  const clearedCount = audits.filter(a => a.status === 'CLEARED_FOR_GRADUATION').length;
  const holdCount = audits.filter(a => a.status === 'FINANCIAL_HOLD' || a.status === 'DISCIPLINARY_HOLD').length;
  const deficitCount = audits.filter(a => a.status === 'DEFICIT_CREDITS' || a.status === 'ACTIVE_BACKLOGS').length;
  const clearanceRate = totalSeniors > 0 ? Math.round((clearedCount / totalSeniors) * 100) : 0;

  const handleOverrideClearance = (studentId: string) => {
    try {
      const cleared = degreeAuditStore.overrideDeanClearance({
        studentId,
        institutionId,
        deanName: 'Prof. R. Venkatraman (Dean of Academic Affairs)',
      });

      refreshList();
      setSelectedAudit(cleared);
      setBannerNotice(`Dean Academic Clearance approved for ${cleared.studentName} (${cleared.studentId})`);
      setTimeout(() => setBannerNotice(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'CLEARANCE_OVERRIDE_FAILED';
      setBannerNotice(`Clearance failed: ${msg}`);
      setTimeout(() => setBannerNotice(null), 4000);
    }
  };

  const handleExportCSV = () => {
    const csv = exportConvocationRosterCSV(audits);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `Convocation_Graduation_Roster_${institutionId}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBannerNotice('Convocation Graduation Clearance CSV exported successfully.');
    setTimeout(() => setBannerNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xl font-bold">
            🎓
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Graduation Degree Audit & Convocation Clearance Console
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Verifies 160-credit degree invariants, GPA passing standards, honors eligibility, and dean sign-off holds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <span>📥</span> Export Convocation Roster CSV
          </button>
        </div>
      </div>

      {bannerNotice && (
        <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-sm rounded-lg flex items-center gap-2">
          <span>✓</span> {bannerNotice}
        </div>
      )}

      {/* Convocation Readiness Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evaluated Seniors</div>
          <div className="text-3xl font-bold text-slate-100 mt-2">{totalSeniors}</div>
          <div className="text-xs text-slate-500 mt-1">Graduating Class of 2026</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Cleared for Degree</div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">{clearedCount} ({clearanceRate}%)</div>
          <div className="text-xs text-slate-500 mt-1">All degree invariants satisfied</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Academic Deficits</div>
          <div className="text-3xl font-bold text-amber-400 mt-2">{deficitCount}</div>
          <div className="text-xs text-slate-500 mt-1">Pending backlogs or credits</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Administrative Holds</div>
          <div className="text-3xl font-bold text-rose-400 mt-2">{holdCount}</div>
          <div className="text-xs text-slate-500 mt-1">Bursar fees or disciplinary holds</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search student or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 w-60 focus:outline-none focus:border-indigo-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Clearance Statuses</option>
            <option value="CLEARED_FOR_GRADUATION">Cleared for Degree</option>
            <option value="DEFICIT_CREDITS">Credit Deficit</option>
            <option value="ACTIVE_BACKLOGS">Active Backlogs</option>
            <option value="FINANCIAL_HOLD">Financial Hold</option>
            <option value="DISCIPLINARY_HOLD">Disciplinary Hold</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
          </select>
        </div>

        <div className="text-xs text-slate-400">
          Showing {filteredAudits.length} of {totalSeniors} students
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Credits (C+E+Cap)</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Honors</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAudits.map((item) => {
                const statusBadge = {
                  CLEARED_FOR_GRADUATION: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
                  DEFICIT_CREDITS: 'bg-amber-950/60 text-amber-400 border-amber-500/30',
                  ACTIVE_BACKLOGS: 'bg-rose-950/60 text-rose-400 border-rose-500/30',
                  FINANCIAL_HOLD: 'bg-orange-950/60 text-orange-400 border-orange-500/30',
                  DISCIPLINARY_HOLD: 'bg-purple-950/60 text-purple-400 border-purple-500/30',
                }[item.status];

                return (
                  <tr key={item.studentId} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100">{item.studentName}</div>
                      <div className="text-xs font-mono text-slate-500">{item.studentId}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {item.department}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono">
                      <span className="font-semibold text-slate-200">{item.totalCreditsEarned}</span>
                      <span className="text-slate-500"> / {item.totalCreditsRequired} ({item.coreCreditsEarned}+{item.electiveCreditsEarned}+{item.capstoneCreditsEarned})</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-100">
                      {item.cgpa.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-indigo-300">
                      {item.honors.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className={`px-2.5 py-1 rounded border font-semibold ${statusBadge}`}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedAudit(item)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition"
                      >
                        Inspect Audit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Student Audit Drawer / Modal */}
      {selectedAudit && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">{selectedAudit.studentName}</h3>
                <div className="text-xs font-mono text-indigo-400">{selectedAudit.studentId} • {selectedAudit.degreeName}</div>
              </div>
              <button
                onClick={() => setSelectedAudit(null)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block">Total Credits</span>
                  <span className="font-bold text-slate-200 text-sm">{selectedAudit.totalCreditsEarned} / {selectedAudit.totalCreditsRequired}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Graduation CGPA</span>
                  <span className="font-bold text-slate-200 text-sm">{selectedAudit.cgpa.toFixed(2)} / 10.0</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dean Audit Status</label>
                <div className="mt-1 flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-200">{selectedAudit.status.replace(/_/g, ' ')}</span>
                  <span className="text-xs font-mono text-slate-500">{selectedAudit.honors.replace(/_/g, ' ')}</span>
                </div>
              </div>

              {selectedAudit.unmetRequirements.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Unmet Requirements / Holds</label>
                  <ul className="mt-1 space-y-1 p-3 bg-rose-950/30 border border-rose-500/30 rounded-lg text-xs text-rose-300">
                    {selectedAudit.unmetRequirements.map((r, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span>⚠️</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tamper-Proof Audit Hash</label>
                <div className="mt-1 font-mono text-[11px] text-slate-400 p-2 bg-slate-950 rounded border border-slate-800 truncate">
                  SHA-256: {selectedAudit.cryptographicAuditHash}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedAudit(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm"
              >
                Close
              </button>

              {!selectedAudit.deanCleared && (
                <button
                  onClick={() => handleOverrideClearance(selectedAudit.studentId)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition"
                >
                  Authorize Dean Sign-Off
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraduationAuditConsole;
