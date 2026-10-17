'use client';

import React, { useState } from 'react';
import {
  HazardCategory,
  CampusThreatLevel,
  DisasterIncidentRecord,
  FireEquipmentInspection,
  logDisasterIncident,
  updateMusterHeadcount,
  issueAllClearDeclaration,
  inspectFireEquipment,
  exportDisasterManagementCSV,
  SAMPLE_DISASTER_INCIDENTS,
  SAMPLE_FIRE_EQUIPMENT,
} from '@/lib/admin/centralDisasterManagement';
import { useGovernanceStore } from '@/lib/hooks/useGovernanceStore';

export default function CentralDisasterSafetyManager() {
  const {
    records: incidents,
    setRecords: setIncidents,
    syncSource,
    isSaving,
    saveRecord
  } = useGovernanceStore<DisasterIncidentRecord>('central_disaster_safety', SAMPLE_DISASTER_INCIDENTS, 'incidentId');
  const [equipmentList, setEquipmentList] = useState<FireEquipmentInspection[]>(SAMPLE_FIRE_EQUIPMENT);
  const [selectedIncident, setSelectedIncident] = useState<DisasterIncidentRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'INCIDENTS' | 'EQUIPMENT'>('INCIDENTS');
  const [threatFilter, setThreatFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showLogModal, setShowLogModal] = useState(false);
  const [showMusterModal, setShowMusterModal] = useState(false);
  const [showAllClearModal, setShowAllClearModal] = useState(false);
  const [showInspectModal, setShowInspectModal] = useState(false);
  const [actionIncident, setActionIncident] = useState<DisasterIncidentRecord | null>(null);

  // Form State: Log Incident
  const [newHazard, setNewHazard] = useState<HazardCategory>('FIRE_HAZARD');
  const [newThreat, setNewThreat] = useState<CampusThreatLevel>('LEVEL_2_BUILDING_EVACUATION');
  const [newLocation, setNewLocation] = useState('Central Library Basement Server Room');
  const [newOfficer, setNewOfficer] = useState('Chief Fire Marshall S. Nair');
  const [triggerSiren, setTriggerSiren] = useState(true);
  const [dispatchAlert, setDispatchAlert] = useState(true);

  // Form State: Muster Update
  const [selectedMusterId, setSelectedMusterId] = useState('MUSTER-01');
  const [evacHeadcount, setEvacHeadcount] = useState<number>(450);
  const [unaccHeadcount, setUnaccHeadcount] = useState<number>(0);
  const [zoneClear, setZoneClear] = useState<boolean>(true);

  // Form State: All Clear
  const [allClearOfficer, setAllClearOfficer] = useState('Registrar / Chief Disaster Response Officer');
  const [allClearSummary, setAllClearSummary] = useState('Thermal imaging confirmed zero hotspots; atmospheric sensors safe.');

  // Form State: Equipment Inspection
  const [eqType, setEqType] = useState<FireEquipmentInspection['equipmentType']>('FIRE_HYDRANT');
  const [eqLocation, setEqLocation] = useState('Library North Emergency Stairwell');
  const [eqPressure, setEqPressure] = useState<number>(55);
  const [eqInspector, setEqInspector] = useState('Sub-Fire Officer K. P. Yadav');

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // KPIs
  const activeEmergencies = incidents.filter(i => i.incidentStatus === 'ACTIVE_EMERGENCY').length;
  const operationalEquip = equipmentList.filter(e => e.isOperationallyReady).length;
  const equipmentReadinessRate = equipmentList.length > 0 ? Math.round((operationalEquip / equipmentList.length) * 100) : 0;
  const totalEvacuated = incidents.reduce((acc, inc) => {
    return acc + inc.musterHeadcounts.reduce((mAcc, m) => mAcc + m.evacuatedHeadcount, 0);
  }, 0);

  // Filtered Incidents
  const filteredIncidents = incidents.filter(i => {
    const matchesThreat = threatFilter === 'ALL' || i.threatLevel === threatFilter;
    const matchesSearch =
      i.incidentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.primaryLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.reportingOfficer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.hazardCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesThreat && matchesSearch;
  });

  // Handlers
  const handleLogIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = logDisasterIncident({
      hazardCategory: newHazard,
      threatLevel: newThreat,
      primaryLocation: newLocation,
      reportingOfficer: newOfficer,
      sirenTriggered: triggerSiren,
      massAlertDispatched: dispatchAlert,
    });

    await saveRecord(created);
    setShowLogModal(false);
    notify(`EMERGENCY ALERT: ${created.hazardCategory} reported at ${created.primaryLocation}! Threat level: ${created.threatLevel}.`);
  };

  const handleOpenMusterModal = (incident: DisasterIncidentRecord) => {
    setActionIncident(incident);
    if (incident.musterHeadcounts.length > 0) {
      setSelectedMusterId(incident.musterHeadcounts[0].musterPointId);
      setEvacHeadcount(incident.musterHeadcounts[0].evacuatedHeadcount);
      setUnaccHeadcount(incident.musterHeadcounts[0].unaccountedPersons);
      setZoneClear(incident.musterHeadcounts[0].isZoneClear);
    }
    setShowMusterModal(true);
  };

  const handleUpdateMuster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionIncident) return;

    try {
      const updated = updateMusterHeadcount(actionIncident, selectedMusterId, {
        evacuatedHeadcount: evacHeadcount,
        unaccountedPersons: unaccHeadcount,
        isZoneClear: zoneClear,
      });

      await saveRecord(updated);
      if (selectedIncident?.incidentId === updated.incidentId) {
        setSelectedIncident(updated);
      }
      setShowMusterModal(false);
      notify(`Muster point ${selectedMusterId} updated. Status: ${zoneClear ? 'ZONE CLEAR' : 'CLEARANCE PENDING'}.`);
    } catch (err: any) {
      notify(err.message || 'Failed to update muster point', 'error');
    }
  };

  const handleOpenAllClear = (incident: DisasterIncidentRecord) => {
    setActionIncident(incident);
    setShowAllClearModal(true);
  };

  const handleConfirmAllClear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionIncident) return;

    const updated = issueAllClearDeclaration(actionIncident, allClearOfficer, allClearSummary);
    await saveRecord(updated);
    if (selectedIncident?.incidentId === updated.incidentId) {
      setSelectedIncident(updated);
    }
    setShowAllClearModal(false);
    notify(`ALL-CLEAR DECLARED for ${updated.primaryLocation}. Incident closed.`);
  };

  const handleInspectEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    const created = inspectFireEquipment({
      equipmentType: eqType,
      locationTag: eqLocation,
      pressureGaugePsi: eqPressure,
      inspectorName: eqInspector,
    });

    setEquipmentList([created, ...equipmentList]);
    setShowInspectModal(false);
    notify(`Fire safety inspection logged for ${created.locationTag} (${created.pressureGaugePsi} PSI).`);
  };

  const handleExportCSV = () => {
    const csv = exportDisasterManagementCSV(incidents);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `campus_disaster_management_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Official Disaster Management Ledger CSV exported.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      {/* Toast Notification */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                Disaster Management, Fire Safety & Evacuation Console
                <span className={`text-xs px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                  syncSource === 'supabase'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${syncSource === 'supabase' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
                  {syncSource === 'supabase' ? 'PostgreSQL Active (support.pinit)' : 'Resilient Local Storage'}
                  {isSaving && <span className="text-emerald-400 ml-1">Saving...</span>}
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Disaster Management Act 2005 • NDMA Safety Guidelines • NBC 2016 Fire Standards • Automated Siren & Mass Evacuation Protocol
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Safety CSV
          </button>
          <button
            onClick={() => setShowInspectModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 border border-rose-500/40 text-rose-300 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Inspect Hydrant/Extinguisher
          </button>
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Trigger Hazard Incident
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Emergencies</p>
          <p className={`text-2xl font-bold mt-1 ${activeEmergencies > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
            {activeEmergencies}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Live Incidents</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">Campus Threat Level</p>
          <p className="text-sm font-bold text-amber-300 mt-1 uppercase">
            {incidents.length > 0 ? incidents[0].threatLevel.replace(/_/g, ' ') : 'NORMAL'}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Security Posture</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Hydrant Readiness</p>
          <p className="text-2xl font-bold text-emerald-300 mt-1">{equipmentReadinessRate}%</p>
          <span className="text-[11px] text-slate-500 mt-1 block">≥45 PSI Operating Pressure</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-cyan-400 uppercase tracking-wider">Evacuated Headcount</p>
          <p className="text-2xl font-bold text-cyan-300 mt-1">{totalEvacuated}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Accounted at Muster Points</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider">NDMA Evac Window</p>
          <p className="text-2xl font-bold text-indigo-300 mt-1">8 Mins</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Max Clear Benchmark</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-purple-400 uppercase tracking-wider">Fire NOC Status</p>
          <p className="text-sm font-bold text-purple-300 mt-1">VALID (2027)</p>
          <span className="text-[11px] text-slate-500 mt-1 block">State Fire Directorate</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('INCIDENTS')}
          className={`pb-3 text-xs font-bold tracking-wide uppercase transition relative ${
            activeTab === 'INCIDENTS' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Incident Response & Evacuation Roster ({incidents.length})
          {activeTab === 'INCIDENTS' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-400 rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab('EQUIPMENT')}
          className={`pb-3 text-xs font-bold tracking-wide uppercase transition relative ${
            activeTab === 'EQUIPMENT' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Fire Extinguishers & Hydrant Hydro-Tests ({equipmentList.length})
          {activeTab === 'EQUIPMENT' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-400 rounded-full" />}
        </button>
      </div>

      {activeTab === 'INCIDENTS' ? (
        <>
          {/* Threat Filter & Search */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center overflow-x-auto gap-2 border border-slate-800 rounded-lg p-1 bg-slate-900/40">
              {[
                { id: 'ALL', label: 'All Postures' },
                { id: 'LEVEL_3_CAMPUS_WIDE_DISASTER', label: 'Level 3 Disaster' },
                { id: 'LEVEL_2_BUILDING_EVACUATION', label: 'Level 2 Evacuation' },
                { id: 'LEVEL_1_LOCALIZED_ALERT', label: 'Level 1 Localized' },
                { id: 'NORMAL_MONITORED', label: 'Normal / Routine Drill' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setThreatFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
                    threatFilter === tab.id
                      ? 'bg-rose-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search incident, location, officer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <svg className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Incidents Table */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Incident Token & Category</th>
                    <th className="py-3 px-4">Threat Level</th>
                    <th className="py-3 px-4">Primary Location</th>
                    <th className="py-3 px-4">Command Officer</th>
                    <th className="py-3 px-4 text-center">Siren & Alert</th>
                    <th className="py-3 px-4 text-right">Muster Points</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        No disaster or hazard incidents match the criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredIncidents.map(inc => (
                      <tr key={inc.incidentId} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{inc.hazardCategory.replace(/_/g, ' ')}</div>
                          <div className="text-[11px] font-mono text-rose-400">{inc.incidentId}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                              inc.threatLevel === 'LEVEL_3_CAMPUS_WIDE_DISASTER'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                                : inc.threatLevel === 'LEVEL_2_BUILDING_EVACUATION'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {inc.threatLevel.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-white font-medium">{inc.primaryLocation}</div>
                          <div className="text-[10px] text-slate-500">{inc.incidentTimestamp}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-slate-200">{inc.reportingOfficer}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              inc.sirenTriggered
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {inc.sirenTriggered ? 'SIREN ON' : 'SILENT'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-bold text-white">{inc.musterHeadcounts.length} Points</span>
                          <div className="text-[10px] text-cyan-400">
                            {inc.musterHeadcounts.reduce((a, m) => a + m.evacuatedHeadcount, 0)} Evacuated
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              inc.incidentStatus === 'ACTIVE_EMERGENCY'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : inc.incidentStatus === 'CONTAINMENT_IN_PROGRESS'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {inc.incidentStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {inc.incidentStatus !== 'ALL_CLEAR_RECOVERED' && (
                              <>
                                <button
                                  onClick={() => handleOpenMusterModal(inc)}
                                  title="Update Muster Point Headcount"
                                  className="p-1.5 rounded-md hover:bg-slate-800 text-cyan-400 border border-slate-800 transition"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleOpenAllClear(inc)}
                                  title="Declare ALL-CLEAR"
                                  className="p-1.5 rounded-md hover:bg-slate-800 text-emerald-400 border border-slate-800 transition"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setSelectedIncident(inc)}
                              title="View Full Incident Dossier & Audit Seal"
                              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Equipment Inspections Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {equipmentList.map(eq => (
            <div key={eq.inspectionId} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-rose-400">{eq.inspectionId}</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{eq.locationTag}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Type: {eq.equipmentType.replace(/_/g, ' ')}</p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${eq.isOperationallyReady ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {eq.pressureGaugePsi} PSI
                  </span>
                  <div className="text-[10px] text-slate-500">
                    {eq.isOperationallyReady ? 'OPERATIONALLY READY' : 'PRESSURE DEFICIT (<45 PSI)'}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Inspector: <span className="text-slate-200">{eq.inspectorName}</span></span>
                <span>Next Hydro-Test: <span className="text-slate-200">{eq.nextHydrotestDueDate}</span></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Incident Dossier Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono text-rose-400">{selectedIncident.incidentId}</span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedIncident.hazardCategory.replace(/_/g, ' ')}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Location: <span className="text-slate-200">{selectedIncident.primaryLocation}</span> • Commander:{' '}
                  <span className="text-slate-200">{selectedIncident.reportingOfficer}</span>
                </p>
              </div>
              <button onClick={() => setSelectedIncident(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Muster Point Status Table */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-300 uppercase mb-3">Evacuation Muster Points & Zone Clearance</h3>
              <div className="space-y-3">
                {selectedIncident.musterHeadcounts.map(m => (
                  <div key={m.musterPointId} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-white">{m.musterPointName} ({m.designatedZone})</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Clearance Officer: {m.clearanceOfficer}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-cyan-300">
                        {m.evacuatedHeadcount} / {m.expectedHeadcount} Evacuated
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                          m.isZoneClear
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {m.isZoneClear ? 'ZONE ALL CLEAR' : `${m.unaccountedPersons} UNACCOUNTED`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Remedial Actions Taken */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-300 uppercase mb-2">Log of Emergency Remedial Actions</h3>
              <ul className="space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                {selectedIncident.remedialActionsTaken.map((action, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
              <span className="text-[10px] text-slate-400 uppercase">Cryptographic Audit Seal</span>
              <p className="text-xs font-mono text-emerald-400 break-all mt-1">{selectedIncident.auditSha256}</p>
              <p className="text-[10px] text-slate-500 mt-1">SHA-256 Tamper-Proof Audit Token</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Log Hazard Incident */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h2 className="text-lg font-bold text-white">Log Campus Hazard / Trigger Emergency</h2>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleLogIncident} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Hazard Category *</label>
                  <select
                    value={newHazard}
                    onChange={e => setNewHazard(e.target.value as HazardCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="FIRE_HAZARD">Fire Hazard / Explosion</option>
                    <option value="CHEMICAL_BIO_SPILL">Chemical / Hazardous Material Spill</option>
                    <option value="SEISMIC_EARTHQUAKE">Seismic Earthquake / Structural</option>
                    <option value="CYCLONE_FLOOD_WEATHER">Severe Cyclone / Flood Inundation</option>
                    <option value="CIVIL_UNREST_ACTIVE_THREAT">Civil Unrest / Active Security Threat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Threat Level *</label>
                  <select
                    value={newThreat}
                    onChange={e => setNewThreat(e.target.value as CampusThreatLevel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="LEVEL_3_CAMPUS_WIDE_DISASTER">Level 3 (Campus-Wide Disaster)</option>
                    <option value="LEVEL_2_BUILDING_EVACUATION">Level 2 (Building Evacuation)</option>
                    <option value="LEVEL_1_LOCALIZED_ALERT">Level 1 (Localized Incident)</option>
                    <option value="NORMAL_MONITORED">Normal / Routine Drill</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Primary Affected Location *</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Reporting Officer / Safety Marshall *</label>
                <input
                  type="text"
                  required
                  value={newOfficer}
                  onChange={e => setNewOfficer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={triggerSiren}
                    onChange={e => setTriggerSiren(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-rose-500"
                  />
                  Trigger Campus Siren System
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dispatchAlert}
                    onChange={e => setDispatchAlert(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-rose-500"
                  />
                  Dispatch Mass SMS / App Push
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold transition"
                >
                  Log & Dispatch Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Muster Point */}
      {showMusterModal && actionIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Update Muster Point Headcount</h2>
                <p className="text-xs text-slate-400 mt-0.5">{actionIncident.primaryLocation}</p>
              </div>
              <button onClick={() => setShowMusterModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdateMuster} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Muster Point *</label>
                <select
                  value={selectedMusterId}
                  onChange={e => {
                    const id = e.target.value;
                    setSelectedMusterId(id);
                    const found = actionIncident.musterHeadcounts.find(m => m.musterPointId === id);
                    if (found) {
                      setEvacHeadcount(found.evacuatedHeadcount);
                      setUnaccHeadcount(found.unaccountedPersons);
                      setZoneClear(found.isZoneClear);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {actionIncident.musterHeadcounts.map(m => (
                    <option key={m.musterPointId} value={m.musterPointId}>
                      {m.musterPointName} ({m.designatedZone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Evacuated Headcount *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={evacHeadcount}
                    onChange={e => setEvacHeadcount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Unaccounted Persons *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={unaccHeadcount}
                    onChange={e => setUnaccHeadcount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={zoneClear}
                    onChange={e => setZoneClear(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-emerald-500"
                  />
                  Mark Designated Building / Zone as 100% Cleared
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMusterModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition"
                >
                  Save Headcount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Declare ALL-CLEAR */}
      {showAllClearModal && actionIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Declare Official ALL-CLEAR</h2>
                <p className="text-xs text-slate-400 mt-0.5">{actionIncident.primaryLocation}</p>
              </div>
              <button onClick={() => setShowAllClearModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConfirmAllClear} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Sanctioning Officer *</label>
                <input
                  type="text"
                  required
                  value={allClearOfficer}
                  onChange={e => setAllClearOfficer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Remedial Action / Clearance Summary *</label>
                <textarea
                  required
                  rows={3}
                  value={allClearSummary}
                  onChange={e => setAllClearSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAllClearModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition"
                >
                  Sanction ALL-CLEAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Inspect Equipment */}
      {showInspectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h2 className="text-lg font-bold text-white">Log Fire Equipment Inspection</h2>
              <button onClick={() => setShowInspectModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleInspectEquipment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Equipment Type *</label>
                <select
                  value={eqType}
                  onChange={e => setEqType(e.target.value as FireEquipmentInspection['equipmentType'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
                >
                  <option value="FIRE_HYDRANT">Fire Hydrant Standpipe Riser</option>
                  <option value="ABC_DRY_POWDER">ABC Dry Chemical Powder (DCP) Extinguisher</option>
                  <option value="CO2_EXTINGUISHER">CO2 Clean Agent Gas Extinguisher</option>
                  <option value="SMOKE_DETECTOR_LOOP">Optical Smoke Detector Sensor Loop</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Location Tag *</label>
                <input
                  type="text"
                  required
                  value={eqLocation}
                  onChange={e => setEqLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Pressure Gauge (PSI) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={eqPressure}
                    onChange={e => setEqPressure(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                  <span className="text-[10px] text-slate-500">Min 45 PSI benchmark</span>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Inspector Name *</label>
                  <input
                    type="text"
                    required
                    value={eqInspector}
                    onChange={e => setEqInspector(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInspectModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold transition"
                >
                  Certify Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
