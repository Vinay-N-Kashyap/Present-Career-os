'use client';

import React, { useState } from 'react';
import {
  SabbaticalCategory,
  SabbaticalStage,
  FacultySabbaticalRecord,
  INITIAL_FACULTY_SABBATICALS,
  proposeSabbaticalLeave,
  sanctionByExecutiveCouncil,
  activateSabbaticalDeputation,
  submitCompletionAndReturnToDuty,
  exportFacultySabbaticalLedgerCSV,
} from '@/lib/teacher/facultySabbaticalLeave';

export default function FacultySabbaticalStudio() {
  const [sabbaticals, setSabbaticals] = useState<FacultySabbaticalRecord[]>(INITIAL_FACULTY_SABBATICALS);
  const [filterCategory, setFilterCategory] = useState<SabbaticalCategory | 'ALL'>('ALL');

  // Modal states
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedSabbatical, setSelectedSabbatical] = useState<FacultySabbaticalRecord | null>(null);

  // Propose Form state
  const [newName, setNewName] = useState('Dr. Siddharth Sen');
  const [newEmpId, setNewEmpId] = useState('EMP-CSE-042');
  const [newDept, setNewDept] = useState('Computer Science & Engineering');
  const [newDesignation, setNewDesignation] = useState<'PROFESSOR' | 'ASSOCIATE_PROFESSOR'>('PROFESSOR');
  const [newServiceYears, setNewServiceYears] = useState(7.5);
  const [newCategory, setNewCategory] = useState<SabbaticalCategory>('FOREIGN_POSTDOCTORAL_FELLOWSHIP');
  const [newHostInst, setNewHostInst] = useState('Oxford University (Department of Computer Science)');
  const [newHostCountry, setNewHostCountry] = useState('United Kingdom');
  const [newStartDate, setNewStartDate] = useState('2026-08-01');
  const [newEndDate, setNewEndDate] = useState('2027-07-31');
  const [newDuration, setNewDuration] = useState(12);
  const [newProjectTitle, setNewProjectTitle] = useState('Post-Quantum Lattice Cryptography for Decentralized Autonomous Organizations');
  const [newStipend, setNewStipend] = useState(400000);
  const [formError, setFormError] = useState<string | null>(null);

  // Return Modal state
  const [monographTitle, setMonographTitle] = useState('');
  const [returnDate, setReturnDate] = useState('2026-06-01');

  // Filtered List
  const filteredList = filterCategory === 'ALL'
    ? sabbaticals
    : sabbaticals.filter((s) => s.category === filterCategory);

  // Telemetry Aggregations
  const totalCount = sabbaticals.length;
  const activeDeputations = sabbaticals.filter((s) => s.stage === 'DEPUTATION_ACTIVE_ONGOING').length;
  const completedCount = sabbaticals.filter((s) => s.stage === 'RETURN_TO_DUTY_CERTIFIED').length;
  const bondsExecutedCount = sabbaticals.filter((s) => s.isServiceBondSigned).length;

  const handlePropose = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const created = proposeSabbaticalLeave({
        facultyName: newName,
        empId: newEmpId,
        department: newDept,
        designation: newDesignation,
        completedContinuousServiceYears: Number(newServiceYears),
        category: newCategory,
        hostInstitutionName: newHostInst,
        hostCountry: newHostCountry,
        proposedStartDate: newStartDate,
        proposedEndDate: newEndDate,
        durationMonths: Number(newDuration),
        researchProjectTitle: newProjectTitle,
        externalMonthlyStipendInr: Number(newStipend) || undefined,
      });

      setSabbaticals([created, ...sabbaticals]);
      setIsProposeModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('An error occurred proposing sabbatical leave.');
      }
    }
  };

  const handleSanction = (sabbatical: FacultySabbaticalRecord) => {
    try {
      const updated = sanctionByExecutiveCouncil(sabbatical, true);
      setSabbaticals(sabbaticals.map((s) => (s.sabbaticalId === updated.sabbaticalId ? updated : s)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error sanctioning sabbatical.');
    }
  };

  const handleActivate = (sabbatical: FacultySabbaticalRecord) => {
    try {
      const updated = activateSabbaticalDeputation(sabbatical);
      setSabbaticals(sabbaticals.map((s) => (s.sabbaticalId === updated.sabbaticalId ? updated : s)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error activating deputation.');
    }
  };

  const handleOpenReturnModal = (sabbatical: FacultySabbaticalRecord) => {
    setSelectedSabbatical(sabbatical);
    setMonographTitle(`Research Monograph on ${sabbatical.researchProjectTitle}`);
    setIsReturnModalOpen(true);
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSabbatical) return;
    try {
      const updated = submitCompletionAndReturnToDuty(selectedSabbatical, {
        completionMonographTitle: monographTitle,
        returnToDutyDate: returnDate,
      });

      setSabbaticals(sabbaticals.map((s) => (s.sabbaticalId === updated.sabbaticalId ? updated : s)));
      setIsReturnModalOpen(false);
      setSelectedSabbatical(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error certifying return to duty.');
    }
  };

  const handleDownloadCsv = () => {
    const csvContent = exportFacultySabbaticalLedgerCSV(sabbaticals);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Faculty_Sabbatical_Deputation_Ledger_${new Date().getFullYear()}.csv`);
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
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              UGC Clause 8.4 Sabbatical Leave
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              CCS Rules & 3-Year Service Bond
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-2">
            Faculty Sabbatical Leave & Research Deputation Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            International Postdoctoral Fellowships, National Lab Deputations, UGC 6-Year Service Rules & Monograph Audits
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
            onClick={() => setIsProposeModalOpen(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition"
          >
            + Propose Sabbatical
          </button>
        </div>
      </div>

      {/* Telemetry Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Sabbaticals</span>
          <div className="text-2xl font-bold text-white mt-1">{totalCount}</div>
          <span className="text-xs text-slate-500">Executive council recorded leaves</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Global Deputations</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{activeDeputations}</div>
          <span className="text-xs text-slate-500">Currently abroad / in national labs</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Monographs Submitted</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{completedCount}</div>
          <span className="text-xs text-slate-500">Return to duty certified</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">3-Yr Service Bonds</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{bondsExecutedCount}</div>
          <span className="text-xs text-slate-500">Legally executed post-return bonds</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
        {(['ALL', 'FOREIGN_POSTDOCTORAL_FELLOWSHIP', 'NATIONAL_LAB_VISITING_SCIENTIST', 'INDUSTRY_R_AND_D_DEPUTATION', 'ACADEMIC_BOOK_WRITING_FELLOWSHIP'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {cat.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Sabbatical Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredList.map((sab) => (
          <div
            key={sab.sabbaticalId}
            className="flex flex-col justify-between p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300">
                  {sab.trackingToken}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                    sab.stage === 'DEPUTATION_ACTIVE_ONGOING'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : sab.stage === 'RETURN_TO_DUTY_CERTIFIED'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      : sab.stage === 'EXECUTIVE_COUNCIL_SANCTIONED'
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {sab.stage.replace(/_/g, ' ')}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white mt-3">{sab.facultyName}</h3>
              <p className="text-xs text-slate-400">
                {sab.designation} • {sab.empId} • {sab.department}
              </p>

              <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Host Institution:</span>
                  <span className="font-semibold text-white truncate max-w-[200px]">{sab.hostInstitutionName}</span>
                </div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Country:</span>
                  <span className="text-cyan-400 font-medium">{sab.hostCountry}</span>
                </div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Duration:</span>
                  <span className="text-slate-300 font-semibold">{sab.durationMonths} Months ({sab.proposedStartDate} to {sab.proposedEndDate})</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Continuous Service:</span>
                  <span className="text-emerald-400 font-bold">{sab.completedContinuousServiceYears} Years (Hurdle ≥ 6.0)</span>
                </div>
              </div>

              <div className="mt-3 text-xs">
                <span className="text-slate-400 block font-medium">Research Project Title:</span>
                <span className="text-slate-200">{sab.researchProjectTitle}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                {sab.isServiceBondSigned ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ✓ 3-Year Service Bond Executed
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Bond Pending
                  </span>
                )}
                {sab.externalMonthlyStipendInr && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Stipend: ₹{(sab.externalMonthlyStipendInr / 100000).toFixed(2)} L/mo
                  </span>
                )}
              </div>

              {sab.completionMonographTitle && (
                <div className="mt-3 p-2 rounded bg-cyan-950/20 border border-cyan-500/30 text-[11px] text-cyan-300">
                  📘 Monograph: {sab.completionMonographTitle} (Returned: {sab.returnToDutyDate})
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]">
                Seal: {sab.cryptographicSeal?.slice(0, 10)}...
              </span>

              <div className="flex items-center gap-2">
                {sab.stage === 'SABBATICAL_PROPOSED' && (
                  <button
                    onClick={() => handleSanction(sab)}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-indigo-600 hover:bg-indigo-500 text-white transition"
                  >
                    Sanction & Bond
                  </button>
                )}

                {sab.stage === 'EXECUTIVE_COUNCIL_SANCTIONED' && (
                  <button
                    onClick={() => handleActivate(sab)}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-emerald-600 hover:bg-emerald-500 text-white transition"
                  >
                    Activate Deputation
                  </button>
                )}

                {sab.stage === 'DEPUTATION_ACTIVE_ONGOING' && (
                  <button
                    onClick={() => handleOpenReturnModal(sab)}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-cyan-600 hover:bg-cyan-500 text-white transition"
                  >
                    Submit Monograph
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Propose Sabbatical */}
      {isProposeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-1">Propose Faculty Sabbatical Leave</h2>
            <p className="text-xs text-slate-400 mb-4">
              UGC 2018 Regulations (Clause 8.4) & Mandatory 3-Year Post-Return Service Bond.
            </p>

            {formError && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handlePropose} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Faculty Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    value={newEmpId}
                    onChange={(e) => setNewEmpId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Designation</label>
                  <select
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value as 'PROFESSOR' | 'ASSOCIATE_PROFESSOR')}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="PROFESSOR">Professor</option>
                    <option value="ASSOCIATE_PROFESSOR">Associate Professor</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Continuous Service Years (Min 6.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newServiceYears}
                    onChange={(e) => setNewServiceYears(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Deputation Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as SabbaticalCategory)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="FOREIGN_POSTDOCTORAL_FELLOWSHIP">Foreign Postdoctoral Fellowship</option>
                  <option value="NATIONAL_LAB_VISITING_SCIENTIST">National Lab Visiting Scientist (IISc/CSIR/TIFR)</option>
                  <option value="INDUSTRY_R_AND_D_DEPUTATION">Industry R&D Deputation</option>
                  <option value="ACADEMIC_BOOK_WRITING_FELLOWSHIP">Academic Book Writing Fellowship</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Host Institution</label>
                  <input
                    type="text"
                    required
                    value={newHostInst}
                    onChange={(e) => setNewHostInst(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Host Country</label>
                  <input
                    type="text"
                    required
                    value={newHostCountry}
                    onChange={(e) => setNewHostCountry(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Duration (Months ≤ 12)</label>
                  <input
                    type="number"
                    max="12"
                    min="1"
                    required
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Research Project / Monograph Title</label>
                <textarea
                  required
                  rows={2}
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProposeModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
                >
                  Submit Sabbatical Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Submit Monograph & Certify Return */}
      {isReturnModalOpen && selectedSabbatical && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-white mb-1">Submit Monograph & Certify Return</h2>
            <p className="text-xs text-slate-400 mb-4">
              Faculty: {selectedSabbatical.facultyName} ({selectedSabbatical.hostInstitutionName})
            </p>

            <form onSubmit={handleConfirmReturn} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Research Monograph / Book Title</label>
                <textarea
                  required
                  rows={2}
                  value={monographTitle}
                  onChange={(e) => setMonographTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Official Return to Duty Date</label>
                <input
                  type="date"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition"
                >
                  Certify Return to Duty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
