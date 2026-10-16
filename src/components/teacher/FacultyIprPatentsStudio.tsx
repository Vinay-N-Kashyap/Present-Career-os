'use client';

import React, { useState } from 'react';
import {
  IprCategory,
  PatentLifecycleStage,
  FacultyPatentRecord,
  INITIAL_FACULTY_PATENTS,
  registerFacultyPatent,
  recordPatentGrant,
  executeCommercialLicense,
  exportFacultyPatentsLedgerCSV,
} from '@/lib/teacher/facultyIprPatents';

export default function FacultyIprPatentsStudio() {
  const [patents, setPatents] = useState<FacultyPatentRecord[]>(INITIAL_FACULTY_PATENTS);
  const [filterCategory, setFilterCategory] = useState<IprCategory | 'ALL'>('ALL');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [selectedPatent, setSelectedPatent] = useState<FacultyPatentRecord | null>(null);

  // Grant Modal state
  const [grantDateInput, setGrantDateInput] = useState('2026-03-01');

  // License Modal state
  const [licenseeName, setLicenseeName] = useState('');
  const [licenseType, setLicenseType] = useState<'EXCLUSIVE' | 'NON_EXCLUSIVE'>('EXCLUSIVE');
  const [upfrontFee, setUpfrontFee] = useState(1000000);
  const [royaltyPct, setRoyaltyPct] = useState(5.0);
  const [totalRoyaltyInput, setTotalRoyaltyInput] = useState(1500000);

  // New Patent Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<IprCategory>('NATIONAL_INDIAN_PATENT');
  const [newAppNo, setNewAppNo] = useState('');
  const [newFilingDate, setNewFilingDate] = useState('2026-04-10');
  const [newLeadName, setNewLeadName] = useState('Dr. Siddharth Sen');
  const [newLeadDept, setNewLeadDept] = useState('Computer Science & Engineering');
  const [newLeadEmpId, setNewLeadEmpId] = useState('EMP-CSE-042');
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered List
  const filteredList = filterCategory === 'ALL'
    ? patents
    : patents.filter((p) => p.category === filterCategory);

  // Telemetry Aggregations
  const totalPatentsCount = patents.length;
  const grantedCount = patents.filter((p) => p.stage === 'PATENT_GRANTED' || p.stage === 'COMMERCIAL_LICENSE_EXECUTED').length;
  const grantRate = totalPatentsCount > 0 ? ((grantedCount / totalPatentsCount) * 100).toFixed(1) : '0';
  const totalCasPoints = patents.reduce((sum, p) => sum + p.ugcCasPoints, 0);
  const totalRoyaltyRealized = patents.reduce(
    (sum, p) => sum + (p.commercialLicense?.totalRoyaltyRealizedInr || 0),
    0
  );

  const handleRegisterPatent = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const created = registerFacultyPatent({
        inventionTitle: newTitle,
        category: newCategory,
        applicationNumber: newAppNo,
        filingDate: newFilingDate,
        leadInventorName: newLeadName,
        leadDepartment: newLeadDept,
        inventors: [
          {
            empId: newLeadEmpId,
            facultyName: newLeadName,
            department: newLeadDept,
            isLeadInventor: true,
            contributionPercentage: 100,
          },
        ],
      });

      setPatents([created, ...patents]);
      setIsRegisterModalOpen(false);
      // Reset form
      setNewTitle('');
      setNewAppNo('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('An error occurred registering patent disclosure.');
      }
    }
  };

  const handleOpenGrantModal = (patent: FacultyPatentRecord) => {
    setSelectedPatent(patent);
    setIsGrantModalOpen(true);
  };

  const handleConfirmGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatent) return;
    try {
      const updated = recordPatentGrant(selectedPatent, grantDateInput);
      setPatents(patents.map((p) => (p.patentId === updated.patentId ? updated : p)));
      setIsGrantModalOpen(false);
      setSelectedPatent(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error granting patent.');
    }
  };

  const handleOpenLicenseModal = (patent: FacultyPatentRecord) => {
    setSelectedPatent(patent);
    setIsLicenseModalOpen(true);
  };

  const handleConfirmLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatent) return;
    try {
      const updated = executeCommercialLicense(selectedPatent, {
        licenseeCompanyName: licenseeName,
        licenseType,
        upfrontTechnologyFeeInr: Number(upfrontFee),
        royaltyPercentageOnSales: Number(royaltyPct),
        totalRoyaltyRealizedInr: Number(totalRoyaltyInput),
        agreementDate: new Date().toISOString().split('T')[0],
      });

      setPatents(patents.map((p) => (p.patentId === updated.patentId ? updated : p)));
      setIsLicenseModalOpen(false);
      setSelectedPatent(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error executing commercial license.');
    }
  };

  const handleDownloadCsv = () => {
    const csvContent = exportFacultyPatentsLedgerCSV(patents);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Faculty_IPR_Patents_Ledger_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Indian Patents Act 1970 & CIPAM
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              UGC CAS Table 2 Category 3 & 60/20/20 Royalty
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-2">
            Faculty Intellectual Property Rights (IPR) & Patent Commercialization Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Invention Disclosures, Patent Prosecution, UGC CAS Research Credits & Statutory Commercial Royalty Distribution
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            Export Statutory CSV
          </button>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20 transition"
          >
            + File Invention Disclosure
          </button>
        </div>
      </div>

      {/* Telemetry Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Filed Patents & IPR</span>
          <div className="text-2xl font-bold text-white mt-1">{totalPatentsCount}</div>
          <span className="text-xs text-slate-500">Active prosecution portfolio</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Patent Grant Success</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{grantRate}%</div>
          <span className="text-xs text-slate-500">{grantedCount} granted & commercialized</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">UGC CAS API Points</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{totalCasPoints} pts</div>
          <span className="text-xs text-slate-500">Category 3 research promotion credits</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Commercial Royalty</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            ₹{(totalRoyaltyRealized / 100000).toFixed(2)} L
          </div>
          <span className="text-xs text-slate-500">60% faculty / 20% dept / 20% corpus</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
        {(['ALL', 'INTERNATIONAL_PCT_PATENT', 'NATIONAL_INDIAN_PATENT', 'COPYRIGHT_SOFTWARE_CODE', 'INDUSTRIAL_DESIGN_PROTOTYPE'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
              filterCategory === cat
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {cat.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Patent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredList.map((patent) => (
          <div
            key={patent.patentId}
            className="flex flex-col justify-between p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300">
                  {patent.trackingToken}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                    patent.stage === 'COMMERCIAL_LICENSE_EXECUTED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : patent.stage === 'PATENT_GRANTED'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      : patent.stage === 'FER_FIRST_EXAMINATION_RESPONDED'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {patent.stage.replace(/_/g, ' ')}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white mt-3 leading-snug">
                {patent.inventionTitle}
              </h3>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                  App No: {patent.applicationNumber}
                </span>
                <span className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-slate-300">
                  Filing: {patent.filingDate}
                </span>
                {patent.grantDate && (
                  <span className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Granted: {patent.grantDate}
                  </span>
                )}
                <span className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                  UGC CAS: +{patent.ugcCasPoints} pts
                </span>
              </div>

              {/* Inventors Roster */}
              <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-xs font-medium text-slate-400 block mb-1">
                  Inventors & Contribution Split:
                </span>
                <div className="space-y-1">
                  {patent.inventors.map((inv) => (
                    <div key={inv.empId} className="flex justify-between items-center text-xs">
                      <span className="text-slate-300">
                        {inv.facultyName} {inv.isLeadInventor && <span className="text-cyan-400 font-semibold">(Lead)</span>}
                      </span>
                      <span className="font-mono text-slate-400">{inv.contributionPercentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commercial License & Royalty Details */}
              {patent.commercialLicense && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-emerald-400 font-medium">Licensed to:</span>
                    <span className="text-white font-semibold">{patent.commercialLicense.licenseeCompanyName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mt-2 pt-2 border-t border-emerald-500/20 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Faculty (60%)</span>
                      <span className="text-emerald-400 font-bold">
                        ₹{(patent.commercialLicense.facultyShareInr / 100000).toFixed(2)} L
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Dept Fund (20%)</span>
                      <span className="text-cyan-400 font-bold">
                        ₹{(patent.commercialLicense.departmentShareInr / 100000).toFixed(2)} L
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Uni Corpus (20%)</span>
                      <span className="text-indigo-400 font-bold">
                        ₹{(patent.commercialLicense.universityCorpusShareInr / 100000).toFixed(2)} L
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]">
                Seal: {patent.cryptographicSeal?.slice(0, 10)}...
              </span>

              <div className="flex items-center gap-2">
                {patent.stage !== 'PATENT_GRANTED' && patent.stage !== 'COMMERCIAL_LICENSE_EXECUTED' && (
                  <button
                    onClick={() => handleOpenGrantModal(patent)}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-cyan-600 hover:bg-cyan-500 text-white transition"
                  >
                    Record Grant
                  </button>
                )}

                {patent.stage === 'PATENT_GRANTED' && (
                  <button
                    onClick={() => handleOpenLicenseModal(patent)}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-emerald-600 hover:bg-emerald-500 text-white transition"
                  >
                    Execute License
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: File Invention Disclosure */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-1">File Invention Disclosure (Form 1/2)</h2>
            <p className="text-xs text-slate-400 mb-4">
              DPIIT Indian Patent Office & UGC CAS Category 3 Compliance.
            </p>

            {formError && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleRegisterPatent} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Invention Title</label>
                <textarea
                  required
                  rows={2}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. High-Efficiency Perovskite Solar Cell with Interfacial Graphene Quantum Dots"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">IPR Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as IprCategory)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="NATIONAL_INDIAN_PATENT">National Indian Patent</option>
                    <option value="INTERNATIONAL_PCT_PATENT">International PCT Patent</option>
                    <option value="COPYRIGHT_SOFTWARE_CODE">Copyright Software Code</option>
                    <option value="INDUSTRIAL_DESIGN_PROTOTYPE">Industrial Design Prototype</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Application Number</label>
                  <input
                    type="text"
                    required
                    value={newAppNo}
                    onChange={(e) => setNewAppNo(e.target.value)}
                    placeholder="e.g. 202611099214 A"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Filing Date</label>
                  <input
                    type="date"
                    required
                    value={newFilingDate}
                    onChange={(e) => setNewFilingDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Lead Department</label>
                  <input
                    type="text"
                    required
                    value={newLeadDept}
                    onChange={(e) => setNewLeadDept(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Lead Inventor Name</label>
                  <input
                    type="text"
                    required
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Lead Inventor Emp ID</label>
                  <input
                    type="text"
                    required
                    value={newLeadEmpId}
                    onChange={(e) => setNewLeadEmpId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition"
                >
                  Register Disclosure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Patent Grant */}
      {isGrantModalOpen && selectedPatent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-white mb-1">Record Patent Grant Decision</h2>
            <p className="text-xs text-slate-400 mb-4">
              Patent: {selectedPatent.inventionTitle} ({selectedPatent.applicationNumber})
            </p>

            <form onSubmit={handleConfirmGrant} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Official Grant Date</label>
                <input
                  type="date"
                  required
                  value={grantDateInput}
                  onChange={(e) => setGrantDateInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <p className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                Recording the patent grant elevates UGC CAS Research Table 2 Category 3 points to maximum statutory weight.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGrantModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition"
                >
                  Confirm Patent Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Execute Commercial Licensing Agreement */}
      {isLicenseModalOpen && selectedPatent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-white mb-1">Execute Technology Commercial License</h2>
            <p className="text-xs text-slate-400 mb-4">
              Patent: {selectedPatent.inventionTitle}
            </p>

            <form onSubmit={handleConfirmLicense} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Licensee Company Name</label>
                <input
                  type="text"
                  required
                  value={licenseeName}
                  onChange={(e) => setLicenseeName(e.target.value)}
                  placeholder="e.g. Bharat Semiconductors Pvt Ltd"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">License Type</label>
                  <select
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value as 'EXCLUSIVE' | 'NON_EXCLUSIVE')}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="EXCLUSIVE">Exclusive</option>
                    <option value="NON_EXCLUSIVE">Non-Exclusive</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Royalty on Sales (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={royaltyPct}
                    onChange={(e) => setRoyaltyPct(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Upfront Fee INR</label>
                  <input
                    type="number"
                    required
                    value={upfrontFee}
                    onChange={(e) => setUpfrontFee(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Total Royalty Realized INR</label>
                  <input
                    type="number"
                    required
                    value={totalRoyaltyInput}
                    onChange={(e) => setTotalRoyaltyInput(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                <span className="text-slate-400 font-medium block">Statutory MoE / CSIR Royalty Split:</span>
                <div className="flex justify-between text-slate-300">
                  <span>Faculty Inventors Pool (60%):</span>
                  <span className="font-semibold text-emerald-400">
                    ₹{(Number(totalRoyaltyInput) * 0.6).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Department Development (20%):</span>
                  <span className="font-semibold text-cyan-400">
                    ₹{(Number(totalRoyaltyInput) * 0.2).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>University Central Corpus (20%):</span>
                  <span className="font-semibold text-indigo-400">
                    ₹{(Number(totalRoyaltyInput) * 0.2).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLicenseModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                >
                  Execute License & Distribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
