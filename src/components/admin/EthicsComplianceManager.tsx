'use client';

import React, { useState, useMemo } from 'react';
import {
  EthicsCommitteeType,
  BioSafetyLevel,
  AnimalSpecies,
  ProtocolStatus,
  EthicsProtocol,
  getAllProtocols,
  registerEthicsProtocol,
  updateProtocolStatus,
  recordAnimalUtilization,
  exportEthicsProtocolsCSV,
} from '@/lib/admin/iaecAnimalEthics';

export default function EthicsComplianceManager() {
  const [protocols, setProtocols] = useState<EthicsProtocol[]>(() => getAllProtocols());
  const [selectedCommittee, setSelectedCommittee] = useState<EthicsCommitteeType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [usageModalProtocol, setUsageModalProtocol] = useState<EthicsProtocol | null>(null);
  const [statusModalProtocol, setStatusModalProtocol] = useState<EthicsProtocol | null>(null);
  const [sealModalProtocol, setSealModalProtocol] = useState<EthicsProtocol | null>(null);

  // New Protocol Form State
  const [title, setTitle] = useState('');
  const [committeeType, setCommitteeType] = useState<EthicsCommitteeType>('IAEC');
  const [facultyPi, setFacultyPi] = useState('Dr. Vivek Bhattacharya');
  const [department, setDepartment] = useState('Biotechnology & Biomedical Engineering');
  const [species, setSpecies] = useState<AnimalSpecies>('WISTAR_RAT');
  const [animalCount, setAnimalCount] = useState<number>(36);
  const [bioSafetyLevel, setBioSafetyLevel] = useState<BioSafetyLevel>('BSL_2');
  const [rDnaDeclared, setRDnaDeclared] = useState(false);
  const [rDnaDetails, setRDnaDetails] = useState('');
  const [anesthesia, setAnesthesia] = useState('Isoflurane inhalation (2%)');
  const [euthanasia, setEuthanasia] = useState('CO2 asphyxiation as per CCSEA 2018 guidelines');
  const [threeRsJustification, setThreeRsJustification] = useState('');
  const [ccseaNominee, setCcseaNominee] = useState('Dr. Rameshwar Rao (Govt. CCSEA Main Nominee)');

  // Usage Form State
  const [usageCount, setUsageCount] = useState<number>(6);

  // Status Form State
  const [targetStatus, setTargetStatus] = useState<ProtocolStatus>('APPROVED_SANCTIONED');
  const [sanctionDate, setSanctionDate] = useState('2026-10-20');
  const [expiryDate, setExpiryDate] = useState('2027-10-19');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Protocols
  const filteredProtocols = useMemo(() => {
    return protocols.filter((p) => {
      const matchComm = selectedCommittee === 'ALL' || p.committeeType === selectedCommittee;
      const matchQuery =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sanctionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.facultyPiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchComm && matchQuery;
    });
  }, [protocols, selectedCommittee, searchQuery]);

  // Aggregate Telemetry
  const stats = useMemo(() => {
    const totalProtocols = protocols.length;
    const sanctionedCount = protocols.filter((p) => p.status === 'APPROVED_SANCTIONED').length;
    const totalSanctionedAnimals = protocols.reduce((acc, p) => acc + p.animalCountSanctioned, 0);
    const totalUtilizedAnimals = protocols.reduce((acc, p) => acc + p.animalCountUtilized, 0);
    const bsl23Count = protocols.filter((p) => p.bioSafetyLevel === 'BSL_2' || p.bioSafetyLevel === 'BSL_3').length;

    return { totalProtocols, sanctionedCount, totalSanctionedAnimals, totalUtilizedAnimals, bsl23Count };
  }, [protocols]);

  const handleExportCSV = () => {
    const csvContent = exportEthicsProtocolsCSV(filteredProtocols);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CCSEA_DBT_Ethics_Protocols_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CCSEA & DBT-RCGM Ethics Protocols CSV exported successfully.');
  };

  const handleCreateProtocol = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !facultyPi.trim() || !threeRsJustification.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const created = registerEthicsProtocol({
      title: title.trim(),
      committeeType,
      facultyPiName: facultyPi.trim(),
      facultyPiEmployeeId: `FAC-${Date.now().toString().slice(-3)}`,
      department: department.trim(),
      species,
      animalCountSanctioned: Number(animalCount),
      animalCountUtilized: 0,
      bioSafetyLevel,
      recombinantDnaDeclared: rDnaDeclared,
      rDnaHostVectorDetails: rDnaDeclared ? rDnaDetails.trim() : undefined,
      anesthesiaProtocol: anesthesia.trim(),
      euthanasiaMethod: euthanasia.trim(),
      threeRsJustification: threeRsJustification.trim(),
      ccseaNomineeName: ccseaNominee.trim(),
      hearingMeetingRef: `${committeeType}-Meeting-${Math.floor(Math.random() * 20 + 20)}`,
      status: 'APPROVED_SANCTIONED',
      sanctionDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
    });

    setProtocols(getAllProtocols());
    setIsSubmitModalOpen(false);
    // Reset form
    setTitle('');
    setThreeRsJustification('');
    setRDnaDetails('');
    showToast(`Protocol ${created.sanctionNumber} registered and sanctioned.`);
  };

  const handleOpenUsage = (protocol: EthicsProtocol) => {
    setUsageModalProtocol(protocol);
    setUsageCount(Math.min(6, Math.max(1, protocol.animalCountSanctioned - protocol.animalCountUtilized)));
  };

  const handleSubmitUsage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usageModalProtocol) return;

    const res = recordAnimalUtilization(usageModalProtocol.id, Number(usageCount));
    if (!res.success) {
      alert(res.error);
      return;
    }

    setProtocols(getAllProtocols());
    setUsageModalProtocol(null);
    showToast(`Recorded utilization of ${usageCount} animals for ${usageModalProtocol.sanctionNumber}.`);
  };

  const handleOpenStatus = (protocol: EthicsProtocol) => {
    setStatusModalProtocol(protocol);
    setTargetStatus(protocol.status);
    setSanctionDate(protocol.sanctionDate || new Date().toISOString().split('T')[0]);
    setExpiryDate(protocol.expiryDate || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0]);
  };

  const handleSubmitStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalProtocol) return;

    updateProtocolStatus(statusModalProtocol.id, targetStatus, sanctionDate, expiryDate);
    setProtocols(getAllProtocols());
    setStatusModalProtocol(null);
    showToast(`Protocol ${statusModalProtocol.sanctionNumber} status updated to ${targetStatus}.`);
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
            <div className="p-2 bg-emerald-950/70 rounded-lg border border-emerald-700/60 text-emerald-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Institutional Bio-Safety & Animal Ethics Committee (IAEC / IBSC) Console
              </h1>
              <p className="text-sm text-slate-400">
                Statutory CCSEA & DBT-RCGM Animal Ethics, 3Rs Compliance, Biosafety Containment & Recombinant DNA Protocols
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
            <span>Export CCSEA CSV</span>
          </button>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Submit Ethics Protocol</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sanctioned Protocols</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.sanctionedCount}</h3>
            <p className="text-xs text-slate-500 mt-1">out of {stats.totalProtocols} total reviewed</p>
          </div>
          <div className="w-12 h-12 bg-indigo-950/60 border border-indigo-800/60 rounded-xl flex items-center justify-center text-indigo-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Animal Quota Utilization</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">
              {stats.totalUtilizedAnimals} / {stats.totalSanctionedAnimals}
            </h3>
            <p className="text-xs text-slate-500 mt-1">CCSEA Monitored Quota</p>
          </div>
          <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-center justify-center text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">BSL-2 / BSL-3 Protocols</p>
            <h3 className="text-2xl font-bold text-sky-400 mt-1">{stats.bsl23Count} Certified</h3>
            <p className="text-xs text-slate-500 mt-1">Negative pressure bio-containment</p>
          </div>
          <div className="w-12 h-12 bg-sky-950/60 border border-sky-800/60 rounded-xl flex items-center justify-center text-sky-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">3Rs Welfare Adherence</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">100%</h3>
            <p className="text-xs text-slate-500 mt-1">Replacement, Reduction, Refinement</p>
          </div>
          <div className="w-12 h-12 bg-purple-950/60 border border-purple-800/60 rounded-xl flex items-center justify-center text-purple-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCommittee('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCommittee === 'ALL'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            All Protocols ({protocols.length})
          </button>
          <button
            onClick={() => setSelectedCommittee('IAEC')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCommittee === 'IAEC'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Animal Ethics (IAEC)
          </button>
          <button
            onClick={() => setSelectedCommittee('IBSC')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCommittee === 'IBSC'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Bio-Safety & rDNA (IBSC)
          </button>
          <button
            onClick={() => setSelectedCommittee('IEC')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCommittee === 'IEC'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Human Ethics (IEC)
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search protocol, sanction ref, faculty PI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Protocols Ledger Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProtocols.map((p) => {
          const remaining = Math.max(0, p.animalCountSanctioned - p.animalCountUtilized);
          const usagePercent =
            p.animalCountSanctioned > 0
              ? Math.round((p.animalCountUtilized / p.animalCountSanctioned) * 100)
              : 0;

          return (
            <div
              key={p.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                      {p.sanctionNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                      {p.committeeType}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.bioSafetyLevel === 'BSL_3'
                          ? 'bg-rose-950 border border-rose-800 text-rose-300'
                          : p.bioSafetyLevel === 'BSL_2'
                          ? 'bg-amber-950 border border-amber-800 text-amber-300'
                          : 'bg-sky-950 border border-sky-800 text-sky-300'
                      }`}
                    >
                      {p.bioSafetyLevel.replace('_', '-')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-700 text-emerald-300">
                      {p.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">{p.title}</h3>
                  <p className="text-xs text-slate-400">
                    Lead: <strong className="text-slate-200">{p.facultyPiName}</strong> ({p.department})
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    CCSEA Nominee: <span className="text-slate-300">{p.ccseaNomineeName}</span> • Meeting: <span className="text-slate-300">{p.hearingMeetingRef}</span>
                  </p>
                </div>
              </div>

              {/* Animal Quota Progress (if applicable) */}
              {p.animalCountSanctioned > 0 && (
                <div className="space-y-1 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Species: <strong className="text-slate-200">{p.species.replace('_', ' ')}</strong></span>
                    <span className="font-bold text-emerald-400">
                      {p.animalCountUtilized} / {p.animalCountSanctioned} Utilized ({remaining} Remaining)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        usagePercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* 3Rs Welfare & Euthanasia summary */}
              <div className="text-xs text-slate-300 space-y-1 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">3Rs Justification</span>
                  <p className="text-slate-300 text-[11px] line-clamp-2">{p.threeRsJustification}</p>
                </div>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Anesthesia: {p.anesthesiaProtocol}</span>
                  <span>Euthanasia: {p.euthanasiaMethod}</span>
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-[11px] text-slate-500">
                  Sanctioned: {p.sanctionDate || 'Pending'} • Expiry: {p.expiryDate || 'N/A'}
                </span>
                <div className="space-x-2">
                  {p.animalCountSanctioned > 0 && (
                    <button
                      onClick={() => handleOpenUsage(p)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white rounded border border-slate-700 font-medium transition-colors"
                    >
                      Record Usage
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenStatus(p)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded border border-slate-700 font-medium transition-colors"
                  >
                    Status
                  </button>
                  {p.cryptographicSanctionDigest && (
                    <button
                      onClick={() => setSealModalProtocol(p)}
                      className="px-2.5 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 rounded font-medium transition-colors"
                    >
                      Sanction Seal
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Submit Ethics Protocol */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Submit Protocol for Ethics Clearance</h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateProtocol} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Protocol Title</label>
                <input
                  type="text"
                  placeholder="e.g. In-Vivo Evaluation of Polymeric Stent in Atherosclerosis"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Committee Type</label>
                  <select
                    value={committeeType}
                    onChange={(e) => setCommitteeType(e.target.value as EthicsCommitteeType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="IAEC">Animal Ethics Committee (IAEC)</option>
                    <option value="IBSC">Institutional Bio-Safety Committee (IBSC)</option>
                    <option value="IEC">Human Ethics Committee (IEC)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Biosafety Level</label>
                  <select
                    value={bioSafetyLevel}
                    onChange={(e) => setBioSafetyLevel(e.target.value as BioSafetyLevel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="BSL_1">BSL-1 (Standard Laboratory)</option>
                    <option value="BSL_2">BSL-2 (Moderate Bio-Risk)</option>
                    <option value="BSL_3">BSL-3 (High Bio-Containment)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Faculty PI</label>
                  <input
                    type="text"
                    value={facultyPi}
                    onChange={(e) => setFacultyPi(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Species</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as AnimalSpecies)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="WISTAR_RAT">Wistar Rat</option>
                    <option value="C57BL6_MOUSE">C57BL/6 Mouse</option>
                    <option value="BALBC_MOUSE">BALB/c Mouse</option>
                    <option value="NEW_ZEALAND_RABBIT">New Zealand Rabbit</option>
                    <option value="ZEBRAFISH">Zebrafish</option>
                    <option value="NON_ANIMAL_RDNA">Non-Animal rDNA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Sanctioned Animal Count</label>
                  <input
                    type="number"
                    min="0"
                    value={animalCount}
                    onChange={(e) => setAnimalCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">3Rs Ethical Justification</label>
                <textarea
                  rows={2}
                  value={threeRsJustification}
                  onChange={(e) => setThreeRsJustification(e.target.value)}
                  placeholder="Explain Replacement alternatives tried, statistical sample size Reduction, and surgical Refinement..."
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">CCSEA / Institutional Nominee</label>
                <input
                  type="text"
                  value={ccseaNominee}
                  onChange={(e) => setCcseaNominee(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold"
                >
                  Sanction Protocol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Animal Usage */}
      {usageModalProtocol && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Record Animal Utilization</h3>
                <p className="text-xs text-emerald-400 font-mono mt-0.5">{usageModalProtocol.sanctionNumber}</p>
              </div>
              <button
                onClick={() => setUsageModalProtocol(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitUsage} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Sanctioned Quota:</span>
                  <strong className="text-white">{usageModalProtocol.animalCountSanctioned}</strong>
                </div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Currently Utilized:</span>
                  <strong className="text-amber-400">{usageModalProtocol.animalCountUtilized}</strong>
                </div>
                <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
                  <span>Remaining Available:</span>
                  <strong className="text-emerald-400">
                    {usageModalProtocol.animalCountSanctioned - usageModalProtocol.animalCountUtilized}
                  </strong>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Number of Animals Utilized in Cohort</label>
                <input
                  type="number"
                  min="1"
                  max={usageModalProtocol.animalCountSanctioned - usageModalProtocol.animalCountUtilized}
                  value={usageCount}
                  onChange={(e) => setUsageCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-emerald-800 rounded px-2.5 py-1.5 text-emerald-300 font-bold"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setUsageModalProtocol(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold"
                >
                  Deduct from Quota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Status */}
      {statusModalProtocol && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Update Protocol Review Status</h3>
                <p className="text-xs text-emerald-400 font-mono mt-0.5">{statusModalProtocol.sanctionNumber}</p>
              </div>
              <button
                onClick={() => setStatusModalProtocol(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Protocol Review Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as ProtocolStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                >
                  <option value="APPROVED_SANCTIONED">Approved & Sanctioned</option>
                  <option value="HEARING_SCHEDULED">Hearing Scheduled</option>
                  <option value="REVISION_REQUESTED">Revision Requested</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="EXPIRED_CLOSED">Expired & Closed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Sanction Date</label>
                  <input
                    type="date"
                    value={sanctionDate}
                    onChange={(e) => setSanctionDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStatusModalProtocol(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-semibold"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Sanction Seal */}
      {sealModalProtocol && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🧬</span>
                <h3 className="text-base font-bold text-white">Statutory Ethical Sanction Seal</h3>
              </div>
              <button
                onClick={() => setSealModalProtocol(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Sanction Number</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{sealModalProtocol.sanctionNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Protocol Title</span>
                <span className="text-slate-200 font-medium">{sealModalProtocol.title}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Faculty PI & Department</span>
                <span className="text-slate-300 font-medium">{sealModalProtocol.facultyPiName} ({sealModalProtocol.department})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Government Oversight</span>
                <span className="text-indigo-300 font-semibold">{sealModalProtocol.ccseaNomineeName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">SHA-256 Tamper-Proof Cryptographic Seal</span>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-emerald-300 break-all">
                  {sealModalProtocol.cryptographicSanctionDigest}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSealModalProtocol(null)}
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
