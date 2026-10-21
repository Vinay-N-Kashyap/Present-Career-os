'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ScholarshipScheme,
  StudentScholarshipApplication,
  ScholarshipType,
  ScholarshipStatus,
  getSchemes,
  getApplications,
  registerScholarshipScheme,
  applyForScholarship,
  updateApplicationStatus,
  computeFinancialAidSummary,
  exportScholarshipLedgerCSV,
  seedScholarshipData
} from '@/lib/admin/scholarshipManagement';

interface ScholarshipLedgerManagerProps {
  institutionId?: string;
}

export const ScholarshipLedgerManager: React.FC<ScholarshipLedgerManagerProps> = ({
  institutionId = 'inst-apex-001',
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'schemes'>('applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  // Application Form State
  const [selectedSchemeId, setSelectedSchemeId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState(6);
  const [cgpa, setCgpa] = useState<number>(8.8);
  const [familyIncome, setFamilyIncome] = useState<number>(350000);
  const [attendance, setAttendance] = useState<number>(88);
  const [bankAccount, setBankAccount] = useState('981240182910');
  const [bankIfsc, setBankIfsc] = useState('HDFC0001092');

  // Scheme Form State
  const [newSchemeName, setNewSchemeName] = useState('');
  const [newSchemeType, setNewSchemeType] = useState<ScholarshipType>('INSTITUTIONAL_FREESHIP');
  const [newFundingBody, setNewFundingBody] = useState('');
  const [newAnnualBudget, setNewAnnualBudget] = useState(1000000);
  const [newAwardPerStudent, setNewAwardPerStudent] = useState(25000);
  const [newMinCgpa, setNewMinCgpa] = useState(7.5);
  const [newMaxIncome, setNewMaxIncome] = useState(500000);

  // Initial Seed
  useEffect(() => {
    const existing = getSchemes(institutionId);
    if (existing.length === 0) {
      seedScholarshipData(institutionId);
      setRefreshKey(k => k + 1);
    }
  }, [institutionId]);

  const schemes = useMemo(() => getSchemes(institutionId), [institutionId, refreshKey]);
  const applications = useMemo(() => getApplications(institutionId), [institutionId, refreshKey]);
  const summary = useMemo(() => computeFinancialAidSummary(institutionId), [institutionId, refreshKey]);

  const schemeMap = useMemo(() => new Map(schemes.map(s => [s.schemeId, s])), [schemes]);

  const filteredApplications = useMemo(() => {
    return applications.filter(a => {
      const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
      const matchesSearch = a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.department.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [applications, statusFilter, searchTerm]);

  const handleExportCSV = () => {
    const csvContent = exportScholarshipLedgerCSV(institutionId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NAAC_5.1_Scholarships_Ledger_${institutionId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError(null);

    if (!selectedSchemeId || !studentId.trim() || !studentName.trim() || !enrollmentNumber.trim()) {
      setApplyError('Please fill in all required fields');
      return;
    }

    const res = applyForScholarship({
      institutionId,
      schemeId: selectedSchemeId,
      studentId: studentId.trim(),
      studentName: studentName.trim(),
      enrollmentNumber: enrollmentNumber.trim(),
      department,
      semester,
      cgpa,
      annualFamilyIncomeINR: familyIncome,
      attendancePercent: attendance,
      bankAccountNumber: bankAccount.trim(),
      bankIfsc: bankIfsc.trim()
    });

    if (!res.success) {
      setApplyError(res.error || 'Failed to submit scholarship application');
      return;
    }

    setShowApplyModal(false);
    setStudentId('');
    setStudentName('');
    setEnrollmentNumber('');
    setRefreshKey(k => k + 1);
  };

  const handleCreateScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchemeName.trim() || !newFundingBody.trim()) return;

    registerScholarshipScheme({
      institutionId,
      name: newSchemeName.trim(),
      type: newSchemeType,
      fundingBody: newFundingBody.trim(),
      annualBudgetINR: newAnnualBudget,
      awardAmountPerStudentINR: newAwardPerStudent,
      minCgpa: newMinCgpa,
      maxFamilyIncomeINR: newMaxIncome > 0 ? newMaxIncome : undefined,
      minAttendancePercent: 75,
      activeAcademicYear: '2025-2026'
    });

    setShowSchemeModal(false);
    setNewSchemeName('');
    setNewFundingBody('');
    setRefreshKey(k => k + 1);
  };

  const handleApprove = (appId: string) => {
    updateApplicationStatus(appId, 'COMMITTEE_APPROVED');
    setRefreshKey(k => k + 1);
  };

  const handleDisburse = (appId: string) => {
    const utr = prompt('Enter Bank Direct Benefit Transfer (DBT) UTR Number:');
    if (utr) {
      const res = updateApplicationStatus(appId, 'DISBURSED', { utrNumber: utr.trim() });
      if (!res.success) {
        alert(`Disbursement Error: ${res.error}`);
      } else {
        setRefreshKey(k => k + 1);
      }
    }
  };

  const handleReject = (appId: string) => {
    const reason = prompt('Enter reason for scholarship rejection:');
    if (reason) {
      updateApplicationStatus(appId, 'REJECTED', { rejectionReason: reason.trim() });
      setRefreshKey(k => k + 1);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 bg-slate-900 text-slate-100 rounded-xl min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Student Financial Aid & Scholarships Portal</h1>
              <p className="text-sm text-slate-400">
                NAAC Criterion 5.1.1 / 5.1.2 • Institutional Freeships • Merit-cum-Means • DBT Disbursement Ledger
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export NAAC 5.1 CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Aid Disbursed</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-emerald-400">₹{(summary.totalDisbursedAmountINR / 100000).toFixed(2)}L</h3>
            <span className="text-xs text-slate-400">/ ₹{(summary.totalAllocatedBudgetINR / 100000).toFixed(1)}L Budget</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${summary.budgetUtilizationPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">{summary.budgetUtilizationPercent}% Corpus Disbursed</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Funded Beneficiaries</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-blue-400">{summary.totalBeneficiariesCount}</h3>
            <span className="text-xs text-slate-400">students funded</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Direct-to-bank account DBT</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Schemes</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-purple-400">{summary.totalSchemes}</h3>
            <span className="text-xs text-slate-400">funding programs</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Merit, Freeships & CSR</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Review</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-amber-400">{summary.pendingApplicationsCount}</h3>
            <span className="text-xs text-slate-400">awaiting approval</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Committee verification queue</p>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'applications'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Applications Ledger ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'schemes'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Funding Schemes ({schemes.length})
          </button>
        </div>

        {activeTab === 'applications' && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search student or department..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 w-full sm:w-60"
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPLIED">Applied</option>
              <option value="COMMITTEE_APPROVED">Approved</option>
              <option value="DISBURSED">Disbursed</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <button
              onClick={() => {
                setApplyError(null);
                setShowApplyModal(true);
              }}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shrink-0"
            >
              + Apply for Aid
            </button>
          </div>
        )}

        {activeTab === 'schemes' && (
          <button
            onClick={() => setShowSchemeModal(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shrink-0"
          >
            + Register New Scheme
          </button>
        )}
      </div>

      {/* Tab 1: Applications Ledger */}
      {activeTab === 'applications' && (
        <div className="space-y-3">
          {filteredApplications.length === 0 ? (
            <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400">
              No financial aid applications found matching your criteria.
            </div>
          ) : (
            filteredApplications.map(app => {
              const scheme = schemeMap.get(app.schemeId);
              return (
                <div
                  key={app.id}
                  className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 hover:border-slate-600 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-emerald-400">{app.id}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                        {scheme?.name || 'Financial Aid Scheme'}
                      </span>
                      <span className="text-xs text-slate-400">Sem {app.semester} • {app.department}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{app.studentName}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                      <p>Enrollment: <span className="text-slate-200 font-semibold">{app.enrollmentNumber}</span></p>
                      <p>CGPA: <span className="text-emerald-400 font-bold">{app.cgpa}</span></p>
                      <p>Family Income: <span className="text-slate-200">₹{(app.annualFamilyIncomeINR).toLocaleString('en-IN')}/yr</span></p>
                      <p>Attendance: <span className="text-slate-200">{app.attendancePercent}%</span></p>
                    </div>
                    {app.utrTransactionNumber && (
                      <p className="text-xs font-mono text-emerald-400 pt-1">
                        Bank UTR: {app.utrTransactionNumber} (Disbursed: {new Date(app.disbursedAt || '').toLocaleDateString()})
                      </p>
                    )}
                    {app.rejectionReason && (
                      <p className="text-xs text-rose-400 italic pt-1">Reason: {app.rejectionReason}</p>
                    )}
                  </div>

                  <div className="flex flex-col md:items-end gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-xl font-bold text-emerald-400">₹{(app.awardAmountINR).toLocaleString('en-IN')}</p>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block mt-1 ${
                        app.status === 'DISBURSED'
                          ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/40'
                          : app.status === 'COMMITTEE_APPROVED'
                          ? 'bg-blue-900/40 text-blue-300 border border-blue-500/40'
                          : app.status === 'REJECTED'
                          ? 'bg-rose-900/40 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-900/40 text-amber-300 border border-amber-500/40'
                      }`}>
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {app.status === 'APPLIED' && (
                        <>
                          <button
                            onClick={() => handleApprove(app.id)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded"
                          >
                            Approve Aid
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            className="px-3 py-1 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800 text-xs font-semibold rounded"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {app.status === 'COMMITTEE_APPROVED' && (
                        <button
                          onClick={() => handleDisburse(app.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded shadow"
                        >
                          Disburse via DBT &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Funding Schemes */}
      {activeTab === 'schemes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes.map(scheme => {
            const utilization = scheme.annualBudgetINR > 0
              ? Math.round((scheme.disbursedAmountINR / scheme.annualBudgetINR) * 100)
              : 0;
            return (
              <div
                key={scheme.schemeId}
                className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 hover:border-slate-600 transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2.5 py-0.5 rounded font-mono font-bold bg-purple-900/40 text-purple-300 border border-purple-700/50">
                      {scheme.type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">AY {scheme.activeAcademicYear}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{scheme.name}</h3>
                  <p className="text-xs text-slate-400">Funding Sponsor: <span className="text-slate-200 font-semibold">{scheme.fundingBody}</span></p>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/50">
                    <div>
                      <p className="text-slate-400">Award / Student</p>
                      <p className="text-base font-bold text-emerald-400">₹{(scheme.awardAmountPerStudentINR).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Eligibility Minimum</p>
                      <p className="text-xs font-semibold text-slate-200">CGPA ≥ {scheme.minCgpa} • Attend ≥ {scheme.minAttendancePercent}%</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/50 space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Disbursed: ₹{(scheme.disbursedAmountINR).toLocaleString('en-IN')}</span>
                    <span>Budget: ₹{(scheme.annualBudgetINR).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${utilization}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Student Scholarship Application</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {applyError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-lg text-rose-300 text-xs">
                {applyError}
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Scholarship Scheme</label>
                <select
                  required
                  value={selectedSchemeId}
                  onChange={e => setSelectedSchemeId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="">Select Scheme...</option>
                  {schemes.map(s => (
                    <option key={s.schemeId} value={s.schemeId}>
                      {s.name} (Min CGPA: {s.minCgpa})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  placeholder="e.g. Shruti Nair"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Student ID</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    placeholder="STU-2091"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Enrollment No.</label>
                  <input
                    type="text"
                    required
                    value={enrollmentNumber}
                    onChange={e => setEnrollmentNumber(e.target.value)}
                    placeholder="ENG-2023-098"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Current CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={cgpa}
                    onChange={e => setCgpa(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Family Income</label>
                  <input
                    type="number"
                    required
                    value={familyIncome}
                    onChange={e => setFamilyIncome(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Attendance %</label>
                  <input
                    type="number"
                    required
                    value={attendance}
                    onChange={e => setAttendance(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Bank Account No.</label>
                  <input
                    type="text"
                    required
                    value={bankAccount}
                    onChange={e => setBankAccount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    required
                    value={bankIfsc}
                    onChange={e => setBankIfsc(e.target.value)}
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scheme Modal */}
      {showSchemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create Scholarship Scheme</h3>
              <button onClick={() => setShowSchemeModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateScheme} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Scheme Name</label>
                <input
                  type="text"
                  required
                  value={newSchemeName}
                  onChange={e => setNewSchemeName(e.target.value)}
                  placeholder="e.g. Infosys Foundation Women in STEM"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>
                  <select
                    value={newSchemeType}
                    onChange={e => setNewSchemeType(e.target.value as ScholarshipType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="INSTITUTIONAL_FREESHIP">Institutional Freeship</option>
                    <option value="MERIT_CUM_MEANS">Merit-cum-Means</option>
                    <option value="CORPORATE_CSR">Corporate CSR</option>
                    <option value="ALUMNI_ENDOWMENT">Alumni Endowment</option>
                    <option value="GOVERNMENT_SCHEME">Government Scheme</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Funding Sponsor</label>
                  <input
                    type="text"
                    required
                    value={newFundingBody}
                    onChange={e => setNewFundingBody(e.target.value)}
                    placeholder="e.g. Infosys CSR Trust"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Annual Budget INR</label>
                  <input
                    type="number"
                    value={newAnnualBudget}
                    onChange={e => setNewAnnualBudget(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Award / Student INR</label>
                  <input
                    type="number"
                    value={newAwardPerStudent}
                    onChange={e => setNewAwardPerStudent(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMinCgpa}
                    onChange={e => setNewMinCgpa(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Max Income INR</label>
                  <input
                    type="number"
                    value={newMaxIncome}
                    onChange={e => setNewMaxIncome(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSchemeModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold"
                >
                  Register Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
