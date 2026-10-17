'use client';

import React, { useState, useMemo } from 'react';
import {
  WasteClass,
  WasteBatchStatus,
  HazardousWasteBatch,
  getAllWasteBatches,
  registerWasteBatch,
  updateWasteBatchStatus,
  validateStorageCompliance,
  exportHazardousWasteManifestCSV,
} from '@/lib/teacher/labSafetyWaste';

export default function LabSafetyStudio() {
  const [batches, setBatches] = useState<HazardousWasteBatch[]>(() => getAllWasteBatches());
  const [selectedClass, setSelectedClass] = useState<WasteClass | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [dispatchModalBatch, setDispatchModalBatch] = useState<HazardousWasteBatch | null>(null);
  const [sealModalBatch, setSealModalBatch] = useState<HazardousWasteBatch | null>(null);

  // New Batch Form State
  const [labRoom, setLabRoom] = useState('');
  const [facultyIncharge, setFacultyIncharge] = useState('Dr. Vivek Bhattacharya');
  const [department, setDepartment] = useState('Biotechnology & Biomedical Engineering');
  const [wasteClass, setWasteClass] = useState<WasteClass>('HALOGENATED_SOLVENTS');
  const [volumeLitres, setVolumeLitres] = useState<number>(30);
  const [constituents, setConstituents] = useState('Dichloromethane 70%, Methanol 30%');
  const [storageCabinet, setStorageCabinet] = useState('Flammables Safety Cabinet #3');
  const [accumulationStartDate, setAccumulationStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [ghsHazards, setGhsHazards] = useState<string[]>(['TOXIC', 'FLAMMABLE']);

  // Dispatch Form State
  const [targetStatus, setTargetStatus] = useState<WasteBatchStatus>('TSDF_MANIFEST_DISPATCHED');
  const [tsdfVendor, setTsdfVendor] = useState('Ramky Enviro Engineers Ltd (SPCB Reg #TSDF-41)');
  const [dispatchDate, setDispatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [destructionCert, setDestructionCert] = useState('TSDF-CERT-2026-9912');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Batches
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const matchClass = selectedClass === 'ALL' || b.wasteClass === selectedClass;
      const matchQuery =
        searchQuery.trim() === '' ||
        b.manifestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.labRoomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.facultyLabIncharge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.chemicalConstituents.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchClass && matchQuery;
    });
  }, [batches, selectedClass, searchQuery]);

  // Telemetry Aggregates
  const stats = useMemo(() => {
    const totalBatches = batches.length;
    const totalVolume = batches.reduce((acc, b) => acc + b.volumeLitres, 0);
    const overdueCount = batches.filter((b) => b.daysAccumulated > 90).length;
    const dispatchedCount = batches.filter(
      (b) => b.status === 'TSDF_MANIFEST_DISPATCHED' || b.status === 'INCINERATED_DESTROYED'
    ).length;

    return { totalBatches, totalVolume, overdueCount, dispatchedCount };
  }, [batches]);

  const handleExportCSV = () => {
    const csvContent = exportHazardousWasteManifestCSV(filteredBatches);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SPCB_OSHA_Hazardous_Waste_Manifests_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('SPCB Hazardous Waste Manifest CSV exported successfully.');
  };

  const handleLogBatch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!labRoom.trim() || !facultyIncharge.trim() || !constituents.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const constituentsList = constituents
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const created = registerWasteBatch({
      labRoomNumber: labRoom.trim(),
      facultyLabIncharge: facultyIncharge.trim(),
      department: department.trim(),
      wasteClass,
      volumeLitres: Number(volumeLitres),
      chemicalConstituents: constituentsList,
      ghsPictograms: ghsHazards,
      storageLocation: storageCabinet.trim(),
      accumulationStartDate,
      status: 'ACCUMULATED_IN_STORAGE',
      lastInspectionDate: new Date().toISOString().split('T')[0],
    });

    setBatches(getAllWasteBatches());
    setIsLogModalOpen(false);
    // Reset inputs
    setLabRoom('');
    setConstituents('');
    showToast(`Batch ${created.manifestNumber} logged into Satellite Accumulation Area.`);
  };

  const handleOpenDispatch = (batch: HazardousWasteBatch) => {
    setDispatchModalBatch(batch);
    setTargetStatus('TSDF_MANIFEST_DISPATCHED');
  };

  const handleSubmitDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModalBatch) return;

    updateWasteBatchStatus(
      dispatchModalBatch.id,
      targetStatus,
      tsdfVendor.trim(),
      dispatchDate,
      destructionCert.trim()
    );

    setBatches(getAllWasteBatches());
    setDispatchModalBatch(null);
    showToast(`Manifest ${dispatchModalBatch.manifestNumber} dispatched to ${tsdfVendor}.`);
  };

  const toggleGhsHazard = (hazard: string) => {
    if (ghsHazards.includes(hazard)) {
      setGhsHazards(ghsHazards.filter((h) => h !== hazard));
    } else {
      setGhsHazards([...ghsHazards, hazard]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl border border-emerald-400 flex items-center space-x-2 animate-bounce">
          <svg className="w-5 h-5 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-950/70 rounded-lg border border-amber-700/60 text-amber-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Faculty Laboratory Chemical Safety & Hazardous Waste Studio
              </h1>
              <p className="text-sm text-slate-400">
                OSHA Satellite Accumulation Area (SAA) Telemetry, 90-Day Watchdog & SPCB TSDF Manifest Dispatch
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold rounded-lg flex items-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export SPCB CSV</span>
          </button>
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg flex items-center space-x-2 shadow-lg shadow-amber-600/30 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Log Chemical Waste Batch</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Waste Batches</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.totalBatches}</h3>
            <p className="text-xs text-slate-500 mt-1">Satellite storage logged</p>
          </div>
          <div className="w-12 h-12 bg-indigo-950/60 border border-indigo-800/60 rounded-xl flex items-center justify-center text-indigo-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stored Volume</p>
            <h3 className="text-2xl font-bold text-sky-400 mt-1">{stats.totalVolume} Litres</h3>
            <p className="text-xs text-slate-500 mt-1">Across 4 research bays</p>
          </div>
          <div className="w-12 h-12 bg-sky-950/60 border border-sky-800/60 rounded-xl flex items-center justify-center text-sky-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">90-Day Overdue Watchdog</p>
            <h3 className={`text-2xl font-bold mt-1 ${stats.overdueCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {stats.overdueCount} Overdue
            </h3>
            <p className="text-xs text-slate-500 mt-1">Max 90 days storage ceiling</p>
          </div>
          <div className="w-12 h-12 bg-rose-950/60 border border-rose-800/60 rounded-xl flex items-center justify-center text-rose-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">TSDF Dispatched</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{stats.dispatchedCount} Manifests</h3>
            <p className="text-xs text-slate-500 mt-1">Chain of Custody sealed</p>
          </div>
          <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-center justify-center text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedClass('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedClass === 'ALL'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            All Classes ({batches.length})
          </button>
          <button
            onClick={() => setSelectedClass('HALOGENATED_SOLVENTS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedClass === 'HALOGENATED_SOLVENTS'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Halogenated Solvents
          </button>
          <button
            onClick={() => setSelectedClass('NON_HALOGENATED_SOLVENTS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedClass === 'NON_HALOGENATED_SOLVENTS'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Non-Halogenated Solvents
          </button>
          <button
            onClick={() => setSelectedClass('ACIDIC_INORGANIC')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedClass === 'ACIDIC_INORGANIC'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Inorganic Acids
          </button>
          <button
            onClick={() => setSelectedClass('CYTOTOXIC_MUTAGENIC')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedClass === 'CYTOTOXIC_MUTAGENIC'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Cytotoxic & Mutagenic
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search manifest, chemical constituent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Waste Batches Ledger Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredBatches.map((b) => {
          const compliance = validateStorageCompliance(b.volumeLitres, b.daysAccumulated);
          const accumulationPercent = Math.min(100, Math.round((b.daysAccumulated / 90) * 100));

          return (
            <div
              key={b.id}
              className={`bg-slate-900 border rounded-xl p-5 shadow-lg space-y-4 transition-all ${
                !compliance.isCompliant ? 'border-rose-800/80' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">
                      {b.manifestNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                      {b.wasteClass.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 border border-indigo-700 text-indigo-300">
                      {b.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">{b.labRoomNumber}</h3>
                  <p className="text-xs text-slate-400">
                    Incharge: <strong className="text-slate-200">{b.facultyLabIncharge}</strong> ({b.department})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Batch Volume</span>
                  <span className="text-base font-bold text-sky-400">{b.volumeLitres} Litres</span>
                </div>
              </div>

              {/* 90-Day Accumulation Meter */}
              <div className="space-y-1 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>
                    Accumulated: <strong className="text-slate-200">{b.daysAccumulated} Days</strong> / 90 Max
                  </span>
                  <span className={`font-bold ${b.daysAccumulated > 90 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {b.daysAccumulated > 90 ? 'OVERDUE FOR TSDF DISPATCH' : `${90 - b.daysAccumulated} Days Remaining`}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      b.daysAccumulated > 90
                        ? 'bg-rose-500'
                        : b.daysAccumulated > 60
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${accumulationPercent}%` }}
                  />
                </div>
              </div>

              {/* Chemical Constituents & GHS Hazard Tags */}
              <div className="space-y-1.5 text-xs bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">Chemical Constituents</span>
                  <span className="text-slate-300 text-[11px] font-mono">{b.chemicalConstituents.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">GHS Hazard Tags</span>
                  <div className="flex items-center space-x-1 mt-0.5">
                    {b.ghsPictograms.map((g) => (
                      <span key={g} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-950/70 border border-rose-800 text-rose-300">
                        ⚠️ {g}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 pt-1">
                  Location: <span className="text-slate-300">{b.storageLocation}</span> • Inspected: <span className="text-slate-300">{b.lastInspectionDate}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-[11px] text-slate-500">
                  Vendor: {b.authorizedTsdfVendor || 'In Satellite Storage'}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleOpenDispatch(b)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded border border-slate-700 font-medium transition-colors"
                  >
                    Dispatch TSDF
                  </button>
                  {b.cryptographicChainOfCustodyDigest && (
                    <button
                      onClick={() => setSealModalBatch(b)}
                      className="px-2.5 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 rounded font-medium transition-colors"
                    >
                      Manifest Seal
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Log Chemical Waste Batch */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Log Hazardous Chemical Waste Batch</h3>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleLogBatch} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Laboratory Room Number</label>
                  <input
                    type="text"
                    placeholder="e.g. Lab 304, Bio-Organic Wing"
                    value={labRoom}
                    onChange={(e) => setLabRoom(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Faculty Incharge</label>
                  <input
                    type="text"
                    value={facultyIncharge}
                    onChange={(e) => setFacultyIncharge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Waste Class</label>
                  <select
                    value={wasteClass}
                    onChange={(e) => setWasteClass(e.target.value as WasteClass)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="HALOGENATED_SOLVENTS">Halogenated Solvents</option>
                    <option value="NON_HALOGENATED_SOLVENTS">Non-Halogenated Solvents</option>
                    <option value="HEAVY_METALS_AQUEOUS">Heavy Metals Aqueous</option>
                    <option value="ACIDIC_INORGANIC">Inorganic Acids</option>
                    <option value="BASIC_INORGANIC">Inorganic Bases</option>
                    <option value="CYTOTOXIC_MUTAGENIC">Cytotoxic / Mutagenic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Volume (Litres)</label>
                  <input
                    type="number"
                    min="1"
                    max="208"
                    value={volumeLitres}
                    onChange={(e) => setVolumeLitres(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Chemical Constituents (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Dichloromethane 60%, Chloroform 35%, trace hexane"
                  value={constituents}
                  onChange={(e) => setConstituents(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Storage Location</label>
                  <input
                    type="text"
                    value={storageCabinet}
                    onChange={(e) => setStorageCabinet(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Accumulation Start Date</label>
                  <input
                    type="date"
                    value={accumulationStartDate}
                    onChange={(e) => setAccumulationStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">GHS Hazard Pictograms</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['FLAMMABLE', 'TOXIC', 'CORROSIVE', 'CARCINOGEN', 'OXIDIZER', 'ENVIRONMENTAL_HAZARD'].map(
                    (tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleGhsHazard(tag)}
                        className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                          ghsHazards.includes(tag)
                            ? 'bg-rose-950 border-rose-700 text-rose-300'
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-semibold"
                >
                  Log Container Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Dispatch TSDF */}
      {dispatchModalBatch && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Dispatch to Authorized TSDF Vendor</h3>
                <p className="text-xs text-amber-400 font-mono mt-0.5">{dispatchModalBatch.manifestNumber}</p>
              </div>
              <button
                onClick={() => setDispatchModalBatch(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitDispatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">State Pollution Control Board TSDF Vendor</label>
                <input
                  type="text"
                  value={tsdfVendor}
                  onChange={(e) => setTsdfVendor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Dispatch Date</label>
                <input
                  type="date"
                  value={dispatchDate}
                  onChange={(e) => setDispatchDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Destruction / Incineration Certificate Ref</label>
                <input
                  type="text"
                  value={destructionCert}
                  onChange={(e) => setDestructionCert(e.target.value)}
                  placeholder="e.g. TSDF-CERT-2026-9912"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDispatchModalBatch(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold"
                >
                  Seal & Dispatch Manifest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Chain of Custody Seal */}
      {sealModalBatch && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">☣️</span>
                <h3 className="text-base font-bold text-white">SPCB Hazardous Waste Chain of Custody Seal</h3>
              </div>
              <button
                onClick={() => setSealModalBatch(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Manifest Number</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{sealModalBatch.manifestNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Originating Laboratory</span>
                <span className="text-slate-200 font-medium">{sealModalBatch.labRoomNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Authorized TSDF Vendor</span>
                <span className="text-slate-300 font-medium">{sealModalBatch.authorizedTsdfVendor}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Destruction Certificate</span>
                <span className="text-indigo-300 font-mono">{sealModalBatch.destructionCertificateRef || 'Dispatched'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">SHA-256 Tamper-Proof Chain of Custody Digest</span>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-emerald-300 break-all">
                  {sealModalBatch.cryptographicChainOfCustodyDigest}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSealModalBatch(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold"
              >
                Close Seal Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
