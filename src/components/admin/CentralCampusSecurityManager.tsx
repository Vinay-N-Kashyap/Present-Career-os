'use client';

import React, { useState } from 'react';
import {
  SecurityPassType,
  GateCheckpointId,
  SecurityPassLifecycleStage,
  SecurityGatePassRecord,
  INITIAL_SECURITY_PASSES,
  issueSecurityGatePass,
  logSecurityPassExit,
  flagSecurityBreach,
  exportCampusSecurityLedgerCSV,
} from '@/lib/admin/centralCampusSecurity';

export default function CentralCampusSecurityManager() {
  const [passes, setPasses] = useState<SecurityGatePassRecord[]>(INITIAL_SECURITY_PASSES);
  const [filterType, setFilterType] = useState<SecurityPassType | 'ALL'>('ALL');

  // Modal states
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState<SecurityGatePassRecord | null>(null);

  // Issue Form state
  const [newType, setNewType] = useState<SecurityPassType>('OFFICIAL_VISITOR_ENTRY_PASS');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newIdType, setNewIdType] = useState<'UNIVERSITY_ID' | 'AADHAAR' | 'DRIVING_LICENSE' | 'PASSPORT'>('AADHAAR');
  const [newIdNo, setNewIdNo] = useState('');
  const [newHost, setNewHost] = useState('Department of Computer Science & Engineering');
  const [newPurpose, setNewPurpose] = useState('Academic Guest Lecture & Lab Inspection');
  const [newEntryGate, setNewEntryGate] = useState<GateCheckpointId>('MAIN_CAMPUS_GATE_1');
  const [newExpectedExit, setNewExpectedExit] = useState('2026-04-10T20:00:00Z');
  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicleReg, setVehicleReg] = useState('');
  const [vehicleType, setVehicleType] = useState<'TWO_WHEELER' | 'FOUR_WHEELER' | 'COMMERCIAL_TRUCK' | 'EMERGENCY_VAN'>('FOUR_WHEELER');
  const [newCurfewDeadline, setNewCurfewDeadline] = useState('2026-04-10T21:30:00Z');
  const [officerBadge, setOfficerBadge] = useState('SEC-OFF-082');
  const [formError, setFormError] = useState<string | null>(null);

  // Exit Modal state
  const [exitGate, setExitGate] = useState<GateCheckpointId>('MAIN_CAMPUS_GATE_1');

  // Hold Modal state
  const [holdReason, setHoldReason] = useState('Unauthorized photography in high-security mainframe server facility');

  // Filtered List
  const filteredList = filterType === 'ALL'
    ? passes
    : passes.filter((p) => p.passType === filterType);

  // Telemetry Aggregations
  const activeCount = passes.filter((p) => p.stage === 'ACTIVE_ON_CAMPUS').length;
  const overstayCount = passes.filter((p) => p.isOverstayDetected || p.stage === 'CURFEW_OVERSTAY_FLAGGED').length;
  const totalCount = passes.length;
  const blacklistedCount = passes.filter((p) => p.stage === 'BLACKLISTED_SECURITY_HOLD').length;

  const handleIssuePass = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const created = issueSecurityGatePass({
        passType: newType,
        holderFullName: newName,
        holderContactPhone: newPhone,
        holderIdProofType: newIdType,
        holderIdProofNumber: newIdNo,
        affiliatedDepartmentOrHost: newHost,
        purposeOfVisit: newPurpose,
        entryCheckpoint: newEntryGate,
        expectedExitTimestamp: newExpectedExit,
        vehicle: hasVehicle
          ? {
              vehicleRegistrationNumber: vehicleReg,
              vehicleType,
              isRfidTagActive: true,
            }
          : undefined,
        curfewDeadlineTimestamp: newType === 'RESIDENT_STUDENT_OUT_PASS' ? newCurfewDeadline : undefined,
        securityOfficerBadgeId: officerBadge,
      });

      setPasses([created, ...passes]);
      setIsIssueModalOpen(false);
      setNewName('');
      setNewPhone('');
      setNewIdNo('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('An error occurred issuing security gate pass.');
      }
    }
  };

  const handleOpenExitModal = (pass: SecurityGatePassRecord) => {
    setSelectedPass(pass);
    setIsExitModalOpen(true);
  };

  const handleConfirmExit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPass) return;
    try {
      const updated = logSecurityPassExit(selectedPass, exitGate);
      setPasses(passes.map((p) => (p.passId === updated.passId ? updated : p)));
      setIsExitModalOpen(false);
      setSelectedPass(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error logging outward gate exit.');
    }
  };

  const handleOpenHoldModal = (pass: SecurityGatePassRecord) => {
    setSelectedPass(pass);
    setIsHoldModalOpen(true);
  };

  const handleConfirmHold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPass) return;
    try {
      const updated = flagSecurityBreach(selectedPass, holdReason);
      setPasses(passes.map((p) => (p.passId === updated.passId ? updated : p)));
      setIsHoldModalOpen(false);
      setSelectedPass(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error flagging security hold.');
    }
  };

  const handleDownloadCsv = () => {
    const csvContent = exportCampusSecurityLedgerCSV(passes);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Campus_Security_Access_Ledger_${new Date().getFullYear()}.csv`);
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
              MHA Campus Security Standards
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              ANPR & Automated RFID Gate Pass
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-2">
            Central University Campus Security, Gate Pass & Access Control Directorate
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            24/7 Perimeter Checkpoints, Automated ANPR Vehicle Logging, Curfew Overstay Surveillance & Security Breach Holds
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
            onClick={() => setIsIssueModalOpen(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20 transition"
          >
            + Issue Gate Pass
          </button>
        </div>
      </div>

      {/* Telemetry Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active On Campus</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{activeCount}</div>
          <span className="text-xs text-slate-500">Currently within campus gates</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Curfew Overstays</span>
          <div className="text-2xl font-bold text-red-400 mt-1">{overstayCount}</div>
          <span className="text-xs text-slate-500">Flagged past 21:30 curfew</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Access Passes</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{totalCount}</div>
          <span className="text-xs text-slate-500">Inward/outward movements today</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Security Holds / Blacklisted</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{blacklistedCount}</div>
          <span className="text-xs text-slate-500">Perimeter access detained</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
        {(['ALL', 'OFFICIAL_VISITOR_ENTRY_PASS', 'RESIDENT_STUDENT_OUT_PASS', 'FACULTY_STAFF_VEHICLE_PASS', 'CONTRACTOR_LABOUR_BADGE', 'EMERGENCY_AMBULANCE_FIRE_ACCESS'] as const).map((type) => (
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

      {/* Pass Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((pass) => (
          <div
            key={pass.passId}
            className="flex flex-col justify-between p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300">
                  {pass.trackingToken}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                    pass.stage === 'ACTIVE_ON_CAMPUS'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : pass.stage === 'LOGGED_OUT_OF_CAMPUS'
                      ? 'bg-slate-700 text-slate-300 border-slate-600'
                      : pass.stage === 'CURFEW_OVERSTAY_FLAGGED'
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {pass.stage.replace(/_/g, ' ')}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white mt-3">{pass.holderFullName}</h3>
              <p className="text-xs text-slate-400">
                {pass.passType.replace(/_/g, ' ')} • {pass.holderContactPhone}
              </p>
              <p className="text-xs text-cyan-400 mt-0.5 font-medium">{pass.affiliatedDepartmentOrHost}</p>

              <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Entry Checkpoint:</span>
                  <span className="font-semibold text-white">{pass.entryCheckpoint.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Entry Time:</span>
                  <span className="text-slate-300 font-mono text-[11px]">{new Date(pass.entryTimestamp).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">ID Proof:</span>
                  <span className="text-slate-300 font-mono">{pass.holderIdProofType}: {pass.holderIdProofNumber}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Vehicle:</span>
                  <span className="font-mono text-cyan-400">
                    {pass.vehicle ? `${pass.vehicle.vehicleRegistrationNumber} (${pass.vehicle.vehicleType})` : 'PEDESTRIAN'}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-xs">
                <span className="text-slate-400 block font-medium">Purpose of Visit:</span>
                <span className="text-slate-200">{pass.purposeOfVisit}</span>
              </div>

              {pass.isCurfewApplicable && (
                <div className="mt-3 p-2 rounded bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-400">
                  Curfew Deadline: {pass.curfewDeadlineTimestamp ? new Date(pass.curfewDeadlineTimestamp).toLocaleTimeString() : '21:30'}
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]">
                Badge: {pass.securityOfficerBadgeId}
              </span>

              <div className="flex items-center gap-2">
                {pass.stage === 'ACTIVE_ON_CAMPUS' && (
                  <>
                    <button
                      onClick={() => handleOpenExitModal(pass)}
                      className="px-2.5 py-1 text-xs font-medium rounded bg-emerald-600 hover:bg-emerald-500 text-white transition"
                    >
                      Log Outward
                    </button>
                    <button
                      onClick={() => handleOpenHoldModal(pass)}
                      className="px-2 py-1 text-[11px] font-medium rounded bg-red-600/80 hover:bg-red-500 text-white transition"
                    >
                      Hold
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Issue Gate Pass */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-1">Issue Campus Security Gate Pass</h2>
            <p className="text-xs text-slate-400 mb-4">
              MHA Campus Perimeter Norms, ANPR RFID Logging & Curfew Surveillance.
            </p>

            {formError && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleIssuePass} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Pass Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as SecurityPassType)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="OFFICIAL_VISITOR_ENTRY_PASS">Official Visitor Entry Pass</option>
                    <option value="RESIDENT_STUDENT_OUT_PASS">Resident Student Out-Pass</option>
                    <option value="FACULTY_STAFF_VEHICLE_PASS">Faculty Staff Vehicle Pass</option>
                    <option value="CONTRACTOR_LABOUR_BADGE">Contractor Labour Badge</option>
                    <option value="EMERGENCY_AMBULANCE_FIRE_ACCESS">Emergency Ambulance / Fire</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Entry Gate Checkpoint</label>
                  <select
                    value={newEntryGate}
                    onChange={(e) => setNewEntryGate(e.target.value as GateCheckpointId)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="MAIN_CAMPUS_GATE_1">Main Campus Gate 1</option>
                    <option value="RESIDENTIAL_NORTH_GATE_2">Residential North Gate 2</option>
                    <option value="RESEARCH_PARK_EAST_GATE_3">Research Park East Gate 3</option>
                    <option value="SPORTS_COMPLEX_WEST_GATE_4">Sports Complex West Gate 4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Holder Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Alok Nath"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91-9876543210"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">ID Proof Type</label>
                  <select
                    value={newIdType}
                    onChange={(e) => setNewIdType(e.target.value as 'UNIVERSITY_ID' | 'AADHAAR' | 'DRIVING_LICENSE' | 'PASSPORT')}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="UNIVERSITY_ID">University ID Card</option>
                    <option value="AADHAAR">Aadhaar Card</option>
                    <option value="DRIVING_LICENSE">Driving License</option>
                    <option value="PASSPORT">Passport</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">ID Proof Number</label>
                <input
                  type="text"
                  required
                  value={newIdNo}
                  onChange={(e) => setNewIdNo(e.target.value)}
                  placeholder="ID / Aadhaar / DL number"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Affiliated Department or Host Official</label>
                <input
                  type="text"
                  required
                  value={newHost}
                  onChange={(e) => setNewHost(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  required
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="vehicleCheck"
                  checked={hasVehicle}
                  onChange={(e) => setHasVehicle(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-cyan-600 focus:ring-0"
                />
                <label htmlFor="vehicleCheck" className="text-xs text-slate-300">
                  Vehicle Access (Automated ANPR & RFID barrier)
                </label>
              </div>

              {hasVehicle && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Vehicle Reg Number</label>
                    <input
                      type="text"
                      value={vehicleReg}
                      onChange={(e) => setVehicleReg(e.target.value)}
                      placeholder="e.g. DL-01-AB-1234"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Vehicle Category</label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value as 'TWO_WHEELER' | 'FOUR_WHEELER' | 'COMMERCIAL_TRUCK' | 'EMERGENCY_VAN')}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="FOUR_WHEELER">Four-Wheeler Car</option>
                      <option value="TWO_WHEELER">Two-Wheeler Bike/Scooter</option>
                      <option value="COMMERCIAL_TRUCK">Commercial / Delivery Truck</option>
                      <option value="EMERGENCY_VAN">Emergency Ambulance/Fire</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Expected Exit Timestamp</label>
                  <input
                    type="text"
                    required
                    value={newExpectedExit}
                    onChange={(e) => setNewExpectedExit(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Officer Badge ID</label>
                  <input
                    type="text"
                    required
                    value={officerBadge}
                    onChange={(e) => setOfficerBadge(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition"
                >
                  Issue Pass & Lift Barrier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Outward Exit */}
      {isExitModalOpen && selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-white mb-1">Log Outward Gate Exit</h2>
            <p className="text-xs text-slate-400 mb-4">
              Pass Holder: {selectedPass.holderFullName} ({selectedPass.trackingToken})
            </p>

            <form onSubmit={handleConfirmExit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Exit Checkpoint Gate</label>
                <select
                  value={exitGate}
                  onChange={(e) => setExitGate(e.target.value as GateCheckpointId)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="MAIN_CAMPUS_GATE_1">Main Campus Gate 1</option>
                  <option value="RESIDENTIAL_NORTH_GATE_2">Residential North Gate 2</option>
                  <option value="RESEARCH_PARK_EAST_GATE_3">Research Park East Gate 3</option>
                  <option value="SPORTS_COMPLEX_WEST_GATE_4">Sports Complex West Gate 4</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExitModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                >
                  Confirm Exit & Close Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Flag Security Hold */}
      {isHoldModalOpen && selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-white mb-1">Flag Security Hold / Blacklist</h2>
            <p className="text-xs text-slate-400 mb-4">
              Pass Holder: {selectedPass.holderFullName} ({selectedPass.trackingToken})
            </p>

            <form onSubmit={handleConfirmHold} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Security Reason / Incident</label>
                <textarea
                  required
                  rows={3}
                  value={holdReason}
                  onChange={(e) => setHoldReason(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsHoldModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-500 text-white transition"
                >
                  Execute Security Hold
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
