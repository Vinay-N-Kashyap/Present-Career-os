'use client';

import React, { useState } from 'react';
import { useGovernanceStore } from '@/lib/hooks/useGovernanceStore';
import {
  EquipmentCategory,
  MaintenanceContractType,
  EquipmentStatus,
  EquipmentAssetRecord,
  INITIAL_EQUIPMENT_ASSETS,
  registerEquipmentAsset,
  logEquipmentBreakdown,
  recordCalibrationService,
  renewMaintenanceContract,
  exportEquipmentAmcLedgerCSV,
} from '@/lib/teacher/facultyEquipmentAmc';

export default function FacultyEquipmentAmcStudio() {
  const {
    records: assets,
    setRecords: setAssets,
    syncSource,
    isSaving,
    saveRecord
  } = useGovernanceStore<EquipmentAssetRecord>('faculty_equipment_amc', INITIAL_EQUIPMENT_ASSETS, 'assetId');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedAsset, setSelectedAsset] = useState<EquipmentAssetRecord | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [showCalibModal, setShowCalibModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showSealModal, setShowSealModal] = useState(false);

  // Add Form State
  const [newName, setNewName] = useState('');
  const [newSerial, setNewSerial] = useState('');
  const [newDept, setNewDept] = useState('Computer Science & Engineering');
  const [newLab, setNewLab] = useState('Advanced Systems Lab');
  const [newCustodian, setNewCustodian] = useState('Dr. Siddharth Sen');
  const [newCustodianEmp, setNewCustodianEmp] = useState('EMP-CSE-042');
  const [newCategory, setNewCategory] = useState<EquipmentCategory>('COMPUTING_CLUSTER_GPU');
  const [newProcurementVal, setNewProcurementVal] = useState(5000000);
  const [newContractType, setNewContractType] = useState<MaintenanceContractType>('COMPREHENSIVE_CAMC');
  const [newVendor, setNewVendor] = useState('Dell Technologies India');
  const [newStartDate, setNewStartDate] = useState('2026-01-01');
  const [newEndDate, setNewEndDate] = useState('2026-12-31');
  const [newAnnualVal, setNewAnnualVal] = useState(350000);
  const [newSlaHours, setNewSlaHours] = useState(24);

  // Breakdown Form State
  const [downtimeHours, setDowntimeHours] = useState(72);

  // Calibration Form State
  const [calibDate, setCalibDate] = useState('2026-03-15');
  const [nextCalibDate, setNextCalibDate] = useState('2027-03-15');
  const [calibAgency, setCalibAgency] = useState('NABL Accredited Calibration Services Ltd');
  const [calibCertNo, setCalibCertNo] = useState('CAL-2026-NABL-099');
  const [calibCompliant, setCalibCompliant] = useState(true);

  // Renew Form State
  const [renewType, setRenewType] = useState<MaintenanceContractType>('COMPREHENSIVE_CAMC');
  const [renewVendor, setRenewVendor] = useState('');
  const [renewStart, setRenewStart] = useState('2026-07-01');
  const [renewEnd, setRenewEnd] = useState('2027-06-30');
  const [renewVal, setRenewVal] = useState(400000);

  // Feedback Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showMsg = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // KPIs
  const totalAssets = assets.length;
  const operationalCount = assets.filter((a) => a.status === 'OPERATIONAL').length;
  const operationalPct = totalAssets > 0 ? ((operationalCount / totalAssets) * 100).toFixed(0) : '0';
  const totalAmcValue = assets.reduce((sum, a) => sum + a.annualContractValueInr, 0);
  const totalPenalties = assets.reduce((sum, a) => sum + a.accruedDowntimePenaltyInr, 0);

  // Filter
  const filteredAssets = selectedStatus === 'ALL'
    ? assets
    : assets.filter((a) => a.status === selectedStatus);

  // Handlers
  const handleRegisterAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = registerEquipmentAsset({
        equipmentName: newName,
        serialNumber: newSerial,
        department: newDept,
        labLocation: newLab,
        facultyCustodianName: newCustodian,
        facultyCustodianEmpId: newCustodianEmp,
        category: newCategory,
        procurementValueInr: Number(newProcurementVal),
        contractType: newContractType,
        vendorName: newVendor,
        contractStartDate: newStartDate,
        contractEndDate: newEndDate,
        annualContractValueInr: Number(newAnnualVal),
        maxSlaResolutionHours: Number(newSlaHours),
      });

      await saveRecord(created);
      setShowAddModal(false);
      showMsg(`Lab asset '${created.equipmentName}' registered (${created.trackingToken}) under ${created.contractType}.`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleLogBreakdown = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    try {
      const updated = logEquipmentBreakdown(selectedAsset, Number(downtimeHours));
      await saveRecord(updated);
      setSelectedAsset(updated);
      setShowBreakdownModal(false);
      showMsg(`Breakdown logged (${downtimeHours}h). Accrued GFR SLA Penalty: ₹${updated.accruedDowntimePenaltyInr}.`, 'error');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleRecordCalibration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    try {
      const updated = recordCalibrationService(selectedAsset, {
        calibrationDate: calibDate,
        nextDueDate: nextCalibDate,
        certifyingAgency: calibAgency,
        certificateNumber: calibCertNo,
        isCompliant: calibCompliant,
      });

      await saveRecord(updated);
      setSelectedAsset(updated);
      setShowCalibModal(false);
      showMsg(`Calibration certificate (${calibCertNo}) recorded. Status restored to ${updated.status}.`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleRenewContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    try {
      const updated = renewMaintenanceContract(selectedAsset, {
        contractType: renewType,
        vendorName: renewVendor,
        contractStartDate: renewStart,
        contractEndDate: renewEnd,
        annualContractValueInr: Number(renewVal),
      });

      await saveRecord(updated);
      setSelectedAsset(updated);
      setShowRenewModal(false);
      showMsg(`Contract renewed successfully for ₹${renewVal} with ${renewVendor}.`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleExportCSV = () => {
    const csv = exportEquipmentAmcLedgerCSV(assets);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Equipment_Maintenance_AMC_Ledger_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showMsg('Equipment & AMC Ledger CSV exported successfully.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔬</span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Faculty Lab Equipment Maintenance & AMC Service Studio
              <span className={`text-xs px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 font-normal ${
                syncSource === 'supabase'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${syncSource === 'supabase' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
                {syncSource === 'supabase' ? 'PostgreSQL Active (support.pinit)' : 'Resilient Local Storage'}
                {isSaving && <span className="text-emerald-400 ml-1">Saving...</span>}
              </span>
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Statutory Compliance: General Financial Rules (GFR Rule 153/169 on Maintenance Contracts) & NABL/ISO 17025 Calibration Traceability.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
          >
            <span>+</span> Register Lab Asset
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
          >
            <span>📥</span> Export GFR CSV
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {notification && (
        <div
          className={`p-4 rounded-lg text-sm font-medium border ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/80 border-rose-800 text-rose-200'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Equipment Assets</div>
          <div className="text-2xl font-bold text-white mt-2">{totalAssets}</div>
          <div className="text-slate-500 text-xs mt-1">Instrumented Research Benches</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Operational Uptime</div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{operationalPct}%</div>
          <div className="text-slate-500 text-xs mt-1">{operationalCount} of {totalAssets} Assets Operational</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Annual AMC Commitments</div>
          <div className="text-2xl font-bold text-indigo-400 mt-2">₹{totalAmcValue.toLocaleString()}</div>
          <div className="text-slate-500 text-xs mt-1">Vendor Maintenance Contracts</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Accrued SLA Penalties</div>
          <div className="text-2xl font-bold text-rose-400 mt-2">₹{totalPenalties.toLocaleString()}</div>
          <div className="text-slate-500 text-xs mt-1">GFR Rule 169 Deductions</div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {['ALL', 'OPERATIONAL', 'UNDER_BREAKDOWN_REPAIR', 'CALIBRATION_OVERDUE', 'AMC_RENEWAL_PENDING', 'DECOMMISSIONED_RETIRED'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedStatus === st
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {st.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Equipment List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredAssets.map((asset) => {
          const isOper = asset.status === 'OPERATIONAL';
          const isRepair = asset.status === 'UNDER_BREAKDOWN_REPAIR';
          const isCalibOver = asset.status === 'CALIBRATION_OVERDUE';

          return (
            <div
              key={asset.assetId}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-indigo-950 border border-indigo-800 text-indigo-300 rounded text-xs font-semibold">
                      {asset.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{asset.trackingToken}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
                      {asset.contractType.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        isOper
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : isRepair
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : isCalibOver
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {asset.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-1.5">{asset.equipmentName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Serial: <span className="text-slate-200 font-mono">{asset.serialNumber}</span> | Location: <span className="text-slate-200">{asset.labLocation}</span> | Custodian: <span className="text-slate-200">{asset.facultyCustodianName}</span> ({asset.department})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {asset.status === 'OPERATIONAL' && (
                    <button
                      onClick={() => {
                        setSelectedAsset(asset);
                        setShowBreakdownModal(true);
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-medium transition"
                    >
                      Log Breakdown
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedAsset(asset);
                      setShowCalibModal(true);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition"
                  >
                    Record Calibration
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAsset(asset);
                      setRenewVendor(asset.vendorName);
                      setRenewVal(asset.annualContractValueInr);
                      setShowRenewModal(true);
                    }}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium transition"
                  >
                    Renew Contract
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAsset(asset);
                      setShowSealModal(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs font-medium transition"
                  >
                    View Cryptographic Seal
                  </button>
                </div>
              </div>

              {/* Maintenance Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-slate-400">Procurement Asset Value</div>
                  <div className="text-lg font-bold text-white mt-1">₹{asset.procurementValueInr.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Capital Asset Register</div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-slate-400">Annual AMC Contract Value</div>
                  <div className="text-lg font-bold text-indigo-400 mt-1">₹{asset.annualContractValueInr.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Vendor: {asset.vendorName}</div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-slate-400">Resolution SLA & Downtime</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">
                    {asset.activeDowntimeHours}h / {asset.maxSlaResolutionHours}h SLA
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Valid to: {asset.contractEndDate}</div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-slate-400">Accrued Downtime Penalty</div>
                  <div className={`text-lg font-bold mt-1 ${asset.accruedDowntimePenaltyInr > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ₹{asset.accruedDowntimePenaltyInr.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">GFR Rule 169 Rate: 1%/day</div>
                </div>
              </div>

              {/* Calibration History */}
              {asset.calibrationHistory.length > 0 && (
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs space-y-1">
                  <div className="font-semibold text-slate-300">Latest NABL / ISO 17025 Calibration Certificate:</div>
                  <div className="text-[11px] text-slate-400">
                    Cert No: <span className="text-white font-mono">{asset.calibrationHistory[0].certificateNumber}</span> | Agency: <span className="text-white">{asset.calibrationHistory[0].certifyingAgency}</span> | Calibrated: <span className="text-white">{asset.calibrationHistory[0].calibrationDate}</span> | Next Due: <span className="text-amber-400 font-medium">{asset.calibrationHistory[0].nextDueDate}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal 1: Register Asset */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white">🔬 Register Laboratory Equipment Asset</h3>
            <p className="text-xs text-slate-400">
              General Financial Rules (GFR Rule 153/169) & MoE High-End Research Equipment Regulations.
            </p>
            <form onSubmit={handleRegisterAsset} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Equipment Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. High-Density GPU Cluster (8x H100)"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value)}
                    placeholder="e.g. SN-NV-8849"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EquipmentCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="COMPUTING_CLUSTER_GPU">COMPUTING CLUSTER GPU</option>
                    <option value="ANALYTICAL_RESEARCH_INSTRUMENT">ANALYTICAL INSTRUMENT</option>
                    <option value="HEAVY_ENGINEERING_RIG">HEAVY ENGINEERING RIG</option>
                    <option value="DEPARTMENTAL_TEACHING_BENCH">TEACHING BENCH</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Lab Room Location</label>
                  <input
                    type="text"
                    value={newLab}
                    onChange={(e) => setNewLab(e.target.value)}
                    placeholder="e.g. AI Supercomputing Lab 304"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Faculty Custodian Name</label>
                  <input
                    type="text"
                    value={newCustodian}
                    onChange={(e) => setNewCustodian(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Custodian Employee ID</label>
                  <input
                    type="text"
                    value={newCustodianEmp}
                    onChange={(e) => setNewCustodianEmp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Procurement Value (INR)</label>
                  <input
                    type="number"
                    value={newProcurementVal}
                    onChange={(e) => setNewProcurementVal(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Maintenance Contract Type</label>
                  <select
                    value={newContractType}
                    onChange={(e) => setNewContractType(e.target.value as MaintenanceContractType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="COMPREHENSIVE_CAMC">Comprehensive CAMC (Parts + Labor)</option>
                    <option value="NON_COMPREHENSIVE_AMC">Non-Comprehensive AMC (Labor Only)</option>
                    <option value="OEM_WARRANTY">OEM Warranty</option>
                    <option value="ON_CALL_BREAKDOWN">On-Call Breakdown</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Vendor Name</label>
                  <input
                    type="text"
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Annual AMC Value (INR)</label>
                  <input
                    type="number"
                    value={newAnnualVal}
                    onChange={(e) => setNewAnnualVal(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Contract Start</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Contract End</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">SLA Limit (Hours)</label>
                  <input
                    type="number"
                    value={newSlaHours}
                    onChange={(e) => setNewSlaHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Log Breakdown */}
      {showBreakdownModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">⚠️ Log Equipment Breakdown</h3>
            <p className="text-xs text-slate-400">
              Contract SLA: {selectedAsset.maxSlaResolutionHours} hours. Excess hours penalized at 1.0% per 24 hours under GFR Rule 169.
            </p>
            <form onSubmit={handleLogBreakdown} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Total Active Downtime (Hours)</label>
                <input
                  type="number"
                  value={downtimeHours}
                  onChange={(e) => setDowntimeHours(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-400">
                Annual Contract Value: <strong className="text-white">₹{selectedAsset.annualContractValueInr.toLocaleString()}</strong>.
                {downtimeHours > selectedAsset.maxSlaResolutionHours && (
                  <div className="text-rose-400 font-semibold mt-1">
                    ⚠️ SLA breached by {downtimeHours - selectedAsset.maxSlaResolutionHours} hours. Penalty will be deducted from vendor billing.
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBreakdownModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium"
                >
                  Confirm Breakdown & Compute Penalty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Calibration Service */}
      {showCalibModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">📋 Record Calibration Certificate</h3>
            <p className="text-xs text-slate-400">
              NABL / ISO 17025 accredited calibration traceability certificate.
            </p>
            <form onSubmit={handleRecordCalibration} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Certifying Agency Name</label>
                <input
                  type="text"
                  value={calibAgency}
                  onChange={(e) => setCalibAgency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Calibration Certificate Number</label>
                <input
                  type="text"
                  value={calibCertNo}
                  onChange={(e) => setCalibCertNo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Calibration Date</label>
                  <input
                    type="date"
                    value={calibDate}
                    onChange={(e) => setCalibDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Next Calibration Due</label>
                  <input
                    type="date"
                    value={nextCalibDate}
                    onChange={(e) => setNextCalibDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={calibCompliant}
                    onChange={(e) => setCalibCompliant(e.target.checked)}
                  />
                  <span>Calibration within statutory tolerance parameters (Compliant)</span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCalibModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium"
                >
                  Save Calibration & Restore Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Renew Contract */}
      {showRenewModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">🔄 Renew Maintenance Contract (AMC / CAMC)</h3>
            <p className="text-xs text-slate-400">
              General Financial Rules compliance for service contract renewal.
            </p>
            <form onSubmit={handleRenewContract} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Contract Type</label>
                <select
                  value={renewType}
                  onChange={(e) => setRenewType(e.target.value as MaintenanceContractType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                >
                  <option value="COMPREHENSIVE_CAMC">Comprehensive CAMC (Parts + Labor)</option>
                  <option value="NON_COMPREHENSIVE_AMC">Non-Comprehensive AMC (Labor Only)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Vendor Name</label>
                <input
                  type="text"
                  value={renewVendor}
                  onChange={(e) => setRenewVendor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Contract Start</label>
                  <input
                    type="date"
                    value={renewStart}
                    onChange={(e) => setRenewStart(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Contract End</label>
                  <input
                    type="date"
                    value={renewEnd}
                    onChange={(e) => setRenewEnd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Annual Contract Value (INR)</label>
                <input
                  type="number"
                  value={renewVal}
                  onChange={(e) => setRenewVal(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRenewModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded font-medium"
                >
                  Confirm Renewal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Cryptographic Seal Inspector */}
      {showSealModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🔐</span> Tamper-Proof Cryptographic AMC Seal
            </h3>
            <p className="text-xs text-slate-400">
              Immutable SHA-256 digest bound to asset serial number, contract value, calibration certificates, and accrued GFR SLA penalties.
            </p>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
              {selectedAsset.cryptographicSeal || 'PENDING_SEAL'}
            </div>
            <div className="space-y-1 text-xs text-slate-400">
              <div><strong className="text-slate-300">Tracking Token:</strong> {selectedAsset.trackingToken}</div>
              <div><strong className="text-slate-300">Equipment:</strong> {selectedAsset.equipmentName}</div>
              <div><strong className="text-slate-300">Serial No:</strong> {selectedAsset.serialNumber}</div>
              <div><strong className="text-slate-300">Last Verified:</strong> {selectedAsset.lastUpdated}</div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSealModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
