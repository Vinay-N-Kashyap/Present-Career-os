'use client';

import React, { useState } from 'react';
import {
  QuarterScaleType,
  CampusCityHraTier,
  FacultyQuarterRecord,
  INITIAL_FACULTY_QUARTERS,
  applyForResidentialQuarter,
  offerResidentialQuarter,
  occupyQuarterAndSurrenderHra,
  vacateQuarterAndIssueNoDues,
  exportFacultyQuartersLedgerCSV,
} from '@/lib/teacher/facultyQuartersAllotment';

export default function FacultyQuartersStudio() {
  const [quarters, setQuarters] = useState<FacultyQuarterRecord[]>(INITIAL_FACULTY_QUARTERS);
  const [filterType, setFilterType] = useState<QuarterScaleType | 'ALL'>('ALL');

  // Modal states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isVacateModalOpen, setIsVacateModalOpen] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState<FacultyQuarterRecord | null>(null);

  // Apply Form state
  const [newName, setNewName] = useState('Dr. Neha Kulkarni');
  const [newEmpId, setNewEmpId] = useState('EMP-EEE-018');
  const [newDept, setNewDept] = useState('Electrical Engineering');
  const [newLevel, setNewLevel] = useState('Academic Level 12');
  const [newBasicPay, setNewBasicPay] = useState(101500);
  const [newJoiningDate, setNewJoiningDate] = useState('2023-08-15');
  const [newDob, setNewDob] = useState('1986-11-20');
  const [newQuarterType, setNewQuarterType] = useState<QuarterScaleType>('TYPE_IV_ASSOCIATE_PROF');
  const [newCityTier, setNewCityTier] = useState<CampusCityHraTier>('TIER_X_27PCT');
  const [formError, setFormError] = useState<string | null>(null);

  // Offer Modal state
  const [quarterNoInput, setQuarterNoInput] = useState('');

  // Vacate Modal state
  const [vacationDateInput, setVacationDateInput] = useState('2026-05-31');

  // Filtered List
  const filteredList = filterType === 'ALL'
    ? quarters
    : quarters.filter((q) => q.quarterType === filterType);

  // Telemetry Aggregations
  const totalCount = quarters.length;
  const occupiedCount = quarters.filter((q) => q.stage === 'POSSESSION_OCCUPIED_HRA_SURRENDERED').length;
  const occupancyRate = totalCount > 0 ? ((occupiedCount / totalCount) * 100).toFixed(1) : '0';
  const totalHraSurrenderedInr = quarters
    .filter((q) => q.stage === 'POSSESSION_OCCUPIED_HRA_SURRENDERED')
    .reduce((sum, q) => sum + q.monthlyHraSurrenderedInr, 0);
  const waitlistCount = quarters.filter((q) => q.stage === 'APPLICATION_WAITLISTED').length;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const created = applyForResidentialQuarter({
        facultyName: newName,
        empId: newEmpId,
        department: newDept,
        academicPayLevel: newLevel,
        basicPayInr: Number(newBasicPay),
        dateOfJoiningLevel: newJoiningDate,
        dateOfBirth: newDob,
        quarterType: newQuarterType,
        cityHraTier: newCityTier,
      });

      setQuarters([created, ...quarters]);
      setIsApplyModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('An error occurred applying for quarters.');
      }
    }
  };

  const handleOpenOfferModal = (quarter: FacultyQuarterRecord) => {
    setSelectedQuarter(quarter);
    setQuarterNoInput('');
    setIsOfferModalOpen(true);
  };

  const handleConfirmOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuarter) return;
    try {
      const updated = offerResidentialQuarter(selectedQuarter, quarterNoInput);
      setQuarters(quarters.map((q) => (q.allotmentId === updated.allotmentId ? updated : q)));
      setIsOfferModalOpen(false);
      setSelectedQuarter(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error offering quarter.');
    }
  };

  const handleOccupy = (quarter: FacultyQuarterRecord) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const updated = occupyQuarterAndSurrenderHra(quarter, today);
      setQuarters(quarters.map((q) => (q.allotmentId === updated.allotmentId ? updated : q)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error taking possession.');
    }
  };

  const handleOpenVacateModal = (quarter: FacultyQuarterRecord) => {
    setSelectedQuarter(quarter);
    setIsVacateModalOpen(true);
  };

  const handleConfirmVacate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuarter) return;
    try {
      const updated = vacateQuarterAndIssueNoDues(selectedQuarter, vacationDateInput);
      setQuarters(quarters.map((q) => (q.allotmentId === updated.allotmentId ? updated : q)));
      setIsVacateModalOpen(false);
      setSelectedQuarter(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error processing vacation.');
    }
  };

  const handleDownloadCsv = () => {
    const csvContent = exportFacultyQuartersLedgerCSV(quarters);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Faculty_Residential_Quarters_Ledger_${new Date().getFullYear()}.csv`);
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
              DoE GPRA Residential Rules
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              7th CPC HRA Surrender & License Fee Audit
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-2">
            Faculty Residential Campus Quarters & Housing Allotment Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            GPRA Seniority Rosters, Plinth Area Standards, Automatic Payroll HRA Surrenders & Standard License Fee Deductions
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
            onClick={() => setIsApplyModalOpen(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20 transition"
          >
            + Apply for Quarters
          </button>
        </div>
      </div>

      {/* Telemetry Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Quarters Roster</span>
          <div className="text-2xl font-bold text-white mt-1">{totalCount}</div>
          <span className="text-xs text-slate-500">Estate office residential units</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Occupancy Rate</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{occupancyRate}%</div>
          <span className="text-xs text-slate-500">{occupiedCount} faculty in possession</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Monthly HRA Recovered</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">
            ₹{(totalHraSurrenderedInr / 100000).toFixed(2)} L/mo
          </div>
          <span className="text-xs text-slate-500">7th CPC salary surrender credit</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Waitlist Queue</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{waitlistCount}</div>
          <span className="text-xs text-slate-500">Faculty awaiting quarter offer</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
        {(['ALL', 'TYPE_III_ASSISTANT_PROF', 'TYPE_IV_ASSOCIATE_PROF', 'TYPE_V_PROFESSOR_DEAN', 'TYPE_VI_VICE_CHANCELLOR_DIRECTOR'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
              filterType === type
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {type.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Quarter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((qtr) => {
          const totalDeductions =
            qtr.monthlyHraSurrenderedInr + qtr.monthlyLicenseFeeInr + qtr.monthlyWaterElectricityChargesInr;

          return (
            <div
              key={qtr.allotmentId}
              className="flex flex-col justify-between p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300">
                    {qtr.trackingToken}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                      qtr.stage === 'POSSESSION_OCCUPIED_HRA_SURRENDERED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : qtr.stage === 'QUARTER_OFFERED'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : qtr.stage === 'SURRENDERED_NO_DUES_ISSUED'
                        ? 'bg-slate-700 text-slate-300 border-slate-600'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {qtr.stage.replace(/_/g, ' ')}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white mt-3">{qtr.facultyName}</h3>
                <p className="text-xs text-slate-400">
                  {qtr.empId} • {qtr.academicPayLevel}
                </p>
                <p className="text-xs text-cyan-400 mt-0.5 font-medium">{qtr.department}</p>

                <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-400">Quarter Number:</span>
                    <span className="font-mono font-bold text-white">
                      {qtr.quarterNumber || 'WAITLISTED'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-400">Scale & Plinth Area:</span>
                    <span className="text-slate-300">
                      {qtr.quarterType.replace(/_/g, ' ')} ({qtr.plinthAreaSqm} sqm)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-400">Basic Pay:</span>
                    <span className="font-semibold text-slate-200">
                      ₹{qtr.basicPayInr.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Monthly HRA Surrender:</span>
                    <span className="font-bold text-amber-400">
                      ₹{qtr.monthlyHraSurrenderedInr.toLocaleString()}/mo
                    </span>
                  </div>
                </div>

                {/* Payroll Deductions Breakdown */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>License Fee (DoE):</span>
                    <span className="text-slate-200 font-mono">₹{qtr.monthlyLicenseFeeInr}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Water & Electricity:</span>
                    <span className="text-slate-200 font-mono">₹{qtr.monthlyWaterElectricityChargesInr}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800 font-medium">
                    <span>Total Payroll Deduction:</span>
                    <span className="text-emerald-400 font-bold">₹{totalDeductions.toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]">
                  Seal: {qtr.cryptographicSeal?.slice(0, 10)}...
                </span>

                <div className="flex items-center gap-2">
                  {qtr.stage === 'APPLICATION_WAITLISTED' && (
                    <button
                      onClick={() => handleOpenOfferModal(qtr)}
                      className="px-2.5 py-1 text-xs font-medium rounded bg-cyan-600 hover:bg-cyan-500 text-white transition"
                    >
                      Offer Quarter
                    </button>
                  )}

                  {qtr.stage === 'QUARTER_OFFERED' && (
                    <button
                      onClick={() => handleOccupy(qtr)}
                      className="px-2.5 py-1 text-xs font-medium rounded bg-emerald-600 hover:bg-emerald-500 text-white transition"
                    >
                      Occupy & Deduct
                    </button>
                  )}

                  {qtr.stage === 'POSSESSION_OCCUPIED_HRA_SURRENDERED' && (
                    <button
                      onClick={() => handleOpenVacateModal(qtr)}
                      className="px-2.5 py-1 text-xs font-medium rounded bg-amber-600 hover:bg-amber-500 text-white transition"
                    >
                      Vacate & No-Dues
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Apply for Quarters */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-1">Apply for Residential Campus Quarter</h2>
            <p className="text-xs text-slate-400 mb-4">
              DoE GPRA Priority Seniority Roster & 7th CPC Salary Schedule.
            </p>

            {formError && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Faculty Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
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
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Academic Pay Level</label>
                  <input
                    type="text"
                    required
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Basic Pay (INR)</label>
                  <input
                    type="number"
                    required
                    value={newBasicPay}
                    onChange={(e) => setNewBasicPay(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Date of Joining Level (Seniority)</label>
                  <input
                    type="date"
                    required
                    value={newJoiningDate}
                    onChange={(e) => setNewJoiningDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Date of Birth (Tie-Breaker)</label>
                  <input
                    type="date"
                    required
                    value={newDob}
                    onChange={(e) => setNewDob(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Quarter Scale Type</label>
                  <select
                    value={newQuarterType}
                    onChange={(e) => setNewQuarterType(e.target.value as QuarterScaleType)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="TYPE_III_ASSISTANT_PROF">Type III (Assistant Prof - 65 sqm)</option>
                    <option value="TYPE_IV_ASSOCIATE_PROF">Type IV (Associate Prof - 90 sqm)</option>
                    <option value="TYPE_V_PROFESSOR_DEAN">Type V (Professor / Dean - 120 sqm)</option>
                    <option value="TYPE_VI_VICE_CHANCELLOR_DIRECTOR">Type VI (VC / Director Bungalow)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">City HRA Tier</label>
                  <select
                    value={newCityTier}
                    onChange={(e) => setNewCityTier(e.target.value as CampusCityHraTier)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="TIER_X_27PCT">Tier X (27% HRA)</option>
                    <option value="TIER_Y_18PCT">Tier Y (18% HRA)</option>
                    <option value="TIER_Z_9PCT">Tier Z (9% HRA)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Offer Quarter */}
      {isOfferModalOpen && selectedQuarter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-white mb-1">Offer Quarter to Waitlisted Faculty</h2>
            <p className="text-xs text-slate-400 mb-4">
              Faculty: {selectedQuarter.facultyName} ({selectedQuarter.quarterType.replace(/_/g, ' ')})
            </p>

            <form onSubmit={handleConfirmOffer} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Quarter Unit Identifier</label>
                <input
                  type="text"
                  required
                  value={quarterNoInput}
                  onChange={(e) => setQuarterNoInput(e.target.value)}
                  placeholder="e.g. IV-B-14"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition"
                >
                  Dispatch Allotment Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Vacate Quarter */}
      {isVacateModalOpen && selectedQuarter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-white mb-1">Vacate Quarter & Issue No-Dues</h2>
            <p className="text-xs text-slate-400 mb-4">
              Quarter: {selectedQuarter.quarterNumber} ({selectedQuarter.facultyName})
            </p>

            <form onSubmit={handleConfirmVacate} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Official Vacation Date</label>
                <input
                  type="date"
                  required
                  value={vacationDateInput}
                  onChange={(e) => setVacationDateInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <p className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                Issuing the No-Dues Certificate will cease HRA surrender deductions on the subsequent month pay-bill.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVacateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition"
                >
                  Confirm Vacation & No-Dues
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
