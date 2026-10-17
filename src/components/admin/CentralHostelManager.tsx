'use client';

import React, { useState } from 'react';
import {
  HostelBlockName,
  RoomSharingType,
  HostelAdmissionStage,
  DisciplinaryViolationType,
  HostelResidentRecord,
  INITIAL_HOSTEL_RESIDENTS,
  registerHostelApplicant,
  allotHostelRoom,
  checkInResident,
  approveMessRebate,
  recordHostelDiscipline,
  exportHostelAllocationLedgerCSV,
} from '@/lib/admin/centralHostelWarden';

export default function CentralHostelManager() {
  const [residents, setResidents] = useState<HostelResidentRecord[]>(INITIAL_HOSTEL_RESIDENTS);
  const [filterStage, setFilterStage] = useState<HostelAdmissionStage | 'ALL'>('ALL');

  // Modals state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isAllotModalOpen, setIsAllotModalOpen] = useState(false);
  const [isRebateModalOpen, setIsRebateModalOpen] = useState(false);
  const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<HostelResidentRecord | null>(null);

  // New Application Form State
  const [newName, setNewName] = useState('');
  const [newEnrollment, setNewEnrollment] = useState('');
  const [newGender, setNewGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [newDept, setNewDept] = useState('Computer Science & Engineering');
  const [newProgram, setNewProgram] = useState('B.Tech CSE (Year 1)');
  const [newDistance, setNewDistance] = useState(350);
  const [newCgpa, setNewCgpa] = useState(8.5);
  const [newIsPwd, setNewIsPwd] = useState(false);
  const [newBlock, setNewBlock] = useState<HostelBlockName>('BLOCK_A_MENS_JUNIOR');
  const [newRoomType, setNewRoomType] = useState<RoomSharingType>('DOUBLE_SHARING');
  const [formError, setFormError] = useState<string | null>(null);

  // Allot Modal State
  const [roomNumberInput, setRoomNumberInput] = useState('');

  // Rebate Modal State
  const [rebateStartDate, setRebateStartDate] = useState('2026-04-01');
  const [rebateEndDate, setRebateEndDate] = useState('2026-04-07');
  const [rebateDays, setRebateDays] = useState(7);

  // Discipline Modal State
  const [violationType, setViolationType] = useState<DisciplinaryViolationType>('CURFEW_BREACH');
  const [fineAmount, setFineAmount] = useState(500);
  const [disciplineAction, setDisciplineAction] = useState('First written warning & fine levied');
  const [wardenName, setWardenName] = useState('Prof. A. K. Varma (Chief Warden)');
  const [isExpulsion, setIsExpulsion] = useState(false);

  // Filtered List
  const filteredList = filterStage === 'ALL'
    ? residents
    : residents.filter((r) => r.stage === filterStage);

  // Telemetry Aggregations
  const totalResidentsCount = residents.length;
  const checkedInCount = residents.filter((r) => r.stage === 'CHECKED_IN').length;
  const occupancyRate = totalResidentsCount > 0 ? ((checkedInCount / totalResidentsCount) * 100).toFixed(1) : '0';
  const totalRebatesCount = residents.reduce((sum, r) => sum + r.messRebates.length, 0);
  const probationCount = residents.filter((r) => r.stage === 'DISCIPLINARY_PROBATION' || r.stage === 'EXPELLED_FROM_RESIDENCE').length;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const created = registerHostelApplicant({
        studentFullName: newName,
        enrollmentNumber: newEnrollment,
        gender: newGender,
        department: newDept,
        academicProgram: newProgram,
        homeDistanceKm: Number(newDistance),
        academicCgpa: Number(newCgpa),
        isPwdCategory: newIsPwd,
        blockName: newBlock,
        roomType: newRoomType,
      });

      setResidents([created, ...residents]);
      setIsApplyModalOpen(false);
      setNewName('');
      setNewEnrollment('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('An error occurred submitting hostel application.');
      }
    }
  };

  const handleOpenAllotModal = (resident: HostelResidentRecord) => {
    setSelectedResident(resident);
    setRoomNumberInput('');
    setIsAllotModalOpen(true);
  };

  const handleConfirmAllot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResident) return;
    try {
      const updated = allotHostelRoom(selectedResident, roomNumberInput);
      setResidents(residents.map((r) => (r.residentId === updated.residentId ? updated : r)));
      setIsAllotModalOpen(false);
      setSelectedResident(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error allotting room.');
    }
  };

  const handleCheckIn = (resident: HostelResidentRecord) => {
    try {
      const updated = checkInResident(resident);
      setResidents(residents.map((r) => (r.residentId === updated.residentId ? updated : r)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error checking in resident.');
    }
  };

  const handleOpenRebateModal = (resident: HostelResidentRecord) => {
    setSelectedResident(resident);
    setIsRebateModalOpen(true);
  };

  const handleConfirmRebate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResident) return;
    try {
      const updated = approveMessRebate(selectedResident, {
        startDate: rebateStartDate,
        endDate: rebateEndDate,
        totalLeaveDays: Number(rebateDays),
      });

      setResidents(residents.map((r) => (r.residentId === updated.residentId ? updated : r)));
      setIsRebateModalOpen(false);
      setSelectedResident(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error approving mess rebate.');
    }
  };

  const handleOpenDisciplineModal = (resident: HostelResidentRecord) => {
    setSelectedResident(resident);
    setIsDisciplineModalOpen(true);
  };

  const handleConfirmDiscipline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResident) return;
    try {
      const updated = recordHostelDiscipline(selectedResident, {
        violation: violationType,
        fineAmountInr: Number(fineAmount),
        actionTaken: disciplineAction,
        wardenName,
        isSevereExpulsion: isExpulsion,
      });

      setResidents(residents.map((r) => (r.residentId === updated.residentId ? updated : r)));
      setIsDisciplineModalOpen(false);
      setSelectedResident(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error recording disciplinary action.');
    }
  };

  const handleDownloadCsv = () => {
    const csvContent = exportHostelAllocationLedgerCSV(residents);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Hostel_Allocation_Ledger_${new Date().getFullYear()}.csv`);
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
              UGC Residential Hostels Guidelines
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Chief Warden & Proctorial Code
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-2">
            Central University Student Hostel Allocation & Wardenship Directorate
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Distance-Merit Allotments, National Building Code Capacity, Mess Fee Rebate Auditing & Disciplinary Governance
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
            className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition"
          >
            + New Hostel Application
          </button>
        </div>
      </div>

      {/* Telemetry Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Resident Roster</span>
          <div className="text-2xl font-bold text-white mt-1">{totalResidentsCount}</div>
          <span className="text-xs text-slate-500">Registered campus hostellers</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Checked-In Occupancy</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{occupancyRate}%</div>
          <span className="text-xs text-slate-500">{checkedInCount} occupied residential berths</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Mess Rebates Granted</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{totalRebatesCount}</div>
          <span className="text-xs text-slate-500">Leaves ≥ 5 days @ ₹150/day</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Disciplinary Probations</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{probationCount}</div>
          <span className="text-xs text-slate-500">Warden code of conduct sanctions</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
        {(['ALL', 'APPLICATION_SUBMITTED', 'ROOM_ALLOTTED', 'CHECKED_IN', 'DISCIPLINARY_PROBATION', 'EXPELLED_FROM_RESIDENCE'] as const).map((stage) => (
          <button
            key={stage}
            onClick={() => setFilterStage(stage)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
              filterStage === stage
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {stage.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Resident Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((res) => (
          <div
            key={res.residentId}
            className="flex flex-col justify-between p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300">
                  {res.trackingToken}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                    res.stage === 'CHECKED_IN'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : res.stage === 'ROOM_ALLOTTED'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      : res.stage === 'DISCIPLINARY_PROBATION'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : res.stage === 'EXPELLED_FROM_RESIDENCE'
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {res.stage.replace(/_/g, ' ')}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white mt-3">{res.studentFullName}</h3>
              <p className="text-xs text-slate-400">
                {res.enrollmentNumber} • {res.academicProgram}
              </p>
              <p className="text-xs text-indigo-400 mt-0.5 font-medium">{res.department}</p>

              <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Hostel Block:</span>
                  <span className="font-semibold text-white">{res.blockName.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Room Number:</span>
                  <span className="font-mono font-bold text-cyan-400">{res.roomNumber || 'PENDING ALLOTMENT'}</span>
                </div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Sharing Type:</span>
                  <span className="text-slate-300">{res.roomType.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Distance & Merit Score:</span>
                  <span className="font-bold text-emerald-400">{res.priorityMeritScore} / 100</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {res.homeDistanceKm} km from campus
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  CGPA: {res.academicCgpa.toFixed(2)}
                </span>
                {res.isPwdCategory && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                    PwD Top Priority
                  </span>
                )}
                {res.messRebates.length > 0 && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Rebates: {res.messRebates.length}
                  </span>
                )}
              </div>

              {/* Disciplinary warning chip */}
              {res.disciplinaryIncidents.length > 0 && (
                <div className="mt-3 p-2 rounded bg-red-950/30 border border-red-500/30 text-[11px] text-red-400">
                  ⚠️ Disciplinary Incidents: {res.disciplinaryIncidents.length} record(s) on file.
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]">
                Seal: {res.cryptographicSeal?.slice(0, 10)}...
              </span>

              <div className="flex items-center gap-2">
                {res.stage === 'APPLICATION_SUBMITTED' && (
                  <button
                    onClick={() => handleOpenAllotModal(res)}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-cyan-600 hover:bg-cyan-500 text-white transition"
                  >
                    Allot Room
                  </button>
                )}

                {res.stage === 'ROOM_ALLOTTED' && (
                  <button
                    onClick={() => handleCheckIn(res)}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-emerald-600 hover:bg-emerald-500 text-white transition"
                  >
                    Check In
                  </button>
                )}

                {(res.stage === 'CHECKED_IN' || res.stage === 'DISCIPLINARY_PROBATION') && (
                  <>
                    <button
                      onClick={() => handleOpenRebateModal(res)}
                      className="px-2 py-1 text-[11px] font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    >
                      Mess Rebate
                    </button>
                    <button
                      onClick={() => handleOpenDisciplineModal(res)}
                      className="px-2 py-1 text-[11px] font-medium rounded bg-red-600/80 hover:bg-red-500 text-white transition"
                    >
                      Discipline
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Hostel Application */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-1">Student Hostel Admission Application</h2>
            <p className="text-xs text-slate-400 mb-4">
              Distance-Merit Priority Algorithm (UGC & NBC Guidelines).
            </p>

            {formError && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Rahul Dev Sharma"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Enrollment Number</label>
                  <input
                    type="text"
                    required
                    value={newEnrollment}
                    onChange={(e) => setNewEnrollment(e.target.value)}
                    placeholder="EN-2026-CSE-101"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as 'MALE' | 'FEMALE' | 'OTHER')}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Academic Program</label>
                  <input
                    type="text"
                    required
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Home Distance from Campus (km)</label>
                  <input
                    type="number"
                    required
                    value={newDistance}
                    onChange={(e) => setNewDistance(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Academic CGPA (out of 10)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newCgpa}
                    onChange={(e) => setNewCgpa(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="pwdCheckbox"
                  checked={newIsPwd}
                  onChange={(e) => setNewIsPwd(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="pwdCheckbox" className="text-xs text-slate-300">
                  PwD Category (Guaranteed ground-floor priority allotment)
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Hostel Block</label>
                  <select
                    value={newBlock}
                    onChange={(e) => setNewBlock(e.target.value as HostelBlockName)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="BLOCK_A_MENS_JUNIOR">Block A (Men Junior)</option>
                    <option value="BLOCK_B_MENS_SENIOR">Block B (Men Senior)</option>
                    <option value="BLOCK_C_WOMENS_MAIN">Block C (Women Main)</option>
                    <option value="BLOCK_D_WOMENS_RESEARCH">Block D (Women Research)</option>
                    <option value="INTERNATIONAL_SCHOLAR_TOWER">International Scholar Tower</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Room Sharing Type</label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value as RoomSharingType)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="DOUBLE_SHARING">Double Sharing (₹30,000/yr)</option>
                    <option value="TRIPLE_SHARING">Triple Sharing (₹22,000/yr)</option>
                    <option value="SINGLE_OCCUPANCY_SCHOLAR">Single Scholar (₹45,000/yr)</option>
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
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
                >
                  Submit & Compute Priority
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Allot Room */}
      {isAllotModalOpen && selectedResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-white mb-1">Allot Hostel Room</h2>
            <p className="text-xs text-slate-400 mb-4">
              Resident: {selectedResident.studentFullName} ({selectedResident.blockName.replace(/_/g, ' ')})
            </p>

            <form onSubmit={handleConfirmAllot} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Room Number</label>
                <input
                  type="text"
                  required
                  value={roomNumberInput}
                  onChange={(e) => setRoomNumberInput(e.target.value)}
                  placeholder="e.g. A-204"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAllotModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition"
                >
                  Confirm Room Allotment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Approve Mess Rebate */}
      {isRebateModalOpen && selectedResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-white mb-1">Sanction Mess Leave Rebate</h2>
            <p className="text-xs text-slate-400 mb-4">
              Hosteller: {selectedResident.studentFullName} ({selectedResident.roomNumber})
            </p>

            <form onSubmit={handleConfirmRebate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={rebateStartDate}
                    onChange={(e) => setRebateStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={rebateEndDate}
                    onChange={(e) => setRebateEndDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Total Consecutive Leave Days (Min 5)</label>
                <input
                  type="number"
                  min="5"
                  required
                  value={rebateDays}
                  onChange={(e) => setRebateDays(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                Statutory daily mess rebate credit: <strong className="text-emerald-400">₹{(Number(rebateDays) * 150).toLocaleString()}</strong> (₹150/day).
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRebateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                >
                  Approve Rebate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Warden Disciplinary Action */}
      {isDisciplineModalOpen && selectedResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-white mb-1">Warden Disciplinary Action Order</h2>
            <p className="text-xs text-slate-400 mb-4">
              Resident: {selectedResident.studentFullName} ({selectedResident.roomNumber})
            </p>

            <form onSubmit={handleConfirmDiscipline} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Violation Category</label>
                <select
                  value={violationType}
                  onChange={(e) => setViolationType(e.target.value as DisciplinaryViolationType)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="CURFEW_BREACH">Curfew Breach</option>
                  <option value="UNAUTHORIZED_GUEST_ENTRY">Unauthorized Guest Entry</option>
                  <option value="SUBSTANCE_POSSESSION">Substance / Alcohol Possession</option>
                  <option value="RAGGING_INTIMIDATION">Ragging / Intimidation</option>
                  <option value="PROPERTY_DAMAGE">Hostel Property Damage</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Fine Levied (INR)</label>
                <input
                  type="number"
                  required
                  value={fineAmount}
                  onChange={(e) => setFineAmount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Action & Sanction Summary</label>
                <input
                  type="text"
                  required
                  value={disciplineAction}
                  onChange={(e) => setDisciplineAction(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="expelCheckbox"
                  checked={isExpulsion}
                  onChange={(e) => setIsExpulsion(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-red-600 focus:ring-0"
                />
                <label htmlFor="expelCheckbox" className="text-xs text-red-400 font-medium">
                  Severe Sanction: Expel from University Residence
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDisciplineModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-500 text-white transition"
                >
                  Execute Disciplinary Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
