'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  AntiRaggingIncident,
  RaggingCategory,
  TribunalSanction,
  IncidentStage,
  getIncidents,
  lodgeAntiRaggingIncident,
  advanceIncidentStage,
  computeTribunalSummary,
  exportAntiRaggingATRReportCSV,
  seedAntiRaggingData
} from '@/lib/admin/antiRaggingTribunal';

interface AntiRaggingTribunalManagerProps {
  institutionId?: string;
}

export const AntiRaggingTribunalManager: React.FC<AntiRaggingTribunalManagerProps> = ({
  institutionId = 'inst-apex-001',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals state
  const [showLodgeModal, setShowLodgeModal] = useState(false);

  // Form State
  const [category, setCategory] = useState<RaggingCategory>('PSYCHOLOGICAL_INTIMIDATION');
  const [location, setLocation] = useState('');
  const [incidentTime, setIncidentTime] = useState(new Date().toISOString().substring(0, 16));
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [complainantName, setComplainantName] = useState('');
  const [accusedNames, setAccusedNames] = useState('');
  const [witnesses, setWitnesses] = useState('');
  const [description, setDescription] = useState('');

  // Initial Seed
  useEffect(() => {
    const existing = getIncidents(institutionId);
    if (existing.length === 0) {
      seedAntiRaggingData(institutionId);
      setRefreshKey(k => k + 1);
    }
  }, [institutionId]);

  const incidents = useMemo(() => getIncidents(institutionId), [institutionId, refreshKey]);
  const summary = useMemo(() => computeTribunalSummary(institutionId), [institutionId, refreshKey]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(i => {
      const matchesStage = stageFilter === 'ALL' || i.stage === stageFilter;
      const matchesSearch = i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.accusedStudentNames.some(n => n.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesStage && matchesSearch;
    });
  }, [incidents, stageFilter, searchTerm]);

  const handleExportCSV = () => {
    const csvContent = exportAntiRaggingATRReportCSV(institutionId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `UGC_Anti_Ragging_ATR_${institutionId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLodge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !description.trim()) return;

    const accusedList = accusedNames.split(',').map(n => n.trim()).filter(Boolean);
    const witnessList = witnesses.split(',').map(n => n.trim()).filter(Boolean);

    lodgeAntiRaggingIncident({
      institutionId,
      category,
      location: location.trim(),
      incidentTimestamp: new Date(incidentTime).toISOString(),
      isAnonymous,
      complainantIdentifier: isAnonymous ? 'ANON' : (complainantName.trim() || 'Anonymous Student'),
      accusedStudentIds: accusedList.map((_, idx) => `ACC-STU-${idx + 1}`),
      accusedStudentNames: accusedList.length > 0 ? accusedList : ['Unidentified Senior Students'],
      witnessNames: witnessList,
      description: description.trim()
    });

    setShowLodgeModal(false);
    setLocation('');
    setDescription('');
    setAccusedNames('');
    setWitnesses('');
    setRefreshKey(k => k + 1);
  };

  const handleAssignSquad = (id: string) => {
    const officer = prompt('Assign Anti-Ragging Squad (ARS) Investigating Officer:');
    if (officer) {
      advanceIncidentStage(id, 'SQUAD_INVESTIGATING', { squadOfficer: officer.trim() });
      setRefreshKey(k => k + 1);
    }
  };

  const handleScheduleHearing = (id: string) => {
    const dateStr = prompt('Enter Disciplinary Tribunal Hearing Date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    if (dateStr) {
      advanceIncidentStage(id, 'TRIBUNAL_HEARING_SCHEDULED', { hearingDate: dateStr.trim() });
      setRefreshKey(k => k + 1);
    }
  };

  const handlePronounceSanction = (id: string) => {
    const sanctionChoice = prompt(
      'Select Sanction: 1: WARNING_WITH_APOLOGY, 2: HOSTEL_EVICTION, 3: SEMESTER_RUSTICATION, 4: EXPULSION_AND_FIR_LODGED',
      '2'
    );

    let sanction: TribunalSanction = 'WARNING_WITH_APOLOGY';
    if (sanctionChoice === '2') sanction = 'HOSTEL_EVICTION';
    else if (sanctionChoice === '3') sanction = 'SEMESTER_RUSTICATION';
    else if (sanctionChoice === '4') sanction = 'EXPULSION_AND_FIR_LODGED';

    let firNum: string | undefined = undefined;
    if (sanction === 'EXPULSION_AND_FIR_LODGED') {
      firNum = prompt('Enter Police FIR Registration Number:') || `FIR-${Math.floor(1000 + Math.random() * 9000)}/2026`;
    }

    advanceIncidentStage(id, 'SANCTION_PRONOUNCED', {
      sanction,
      firNumber: firNum,
      policeStation: firNum ? 'City North Police Station' : undefined,
      atrNotes: `Tribunal pronounced sanction: ${sanction}. Statutory parents summons completed.`
    });
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 bg-slate-900 text-slate-100 rounded-xl min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-rose-600/20 text-rose-400 rounded-lg border border-rose-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Anti-Ragging Cell & Disciplinary Tribunal</h1>
              <p className="text-sm text-slate-400">
                Supreme Court 2009 Mandate • Zero Tolerance • Anonymous ARC Token Protection • 7-Day Statutory ATR SLA
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLodgeModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            + Lodge Incident (Confidential)
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export UGC ATR CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Cases Lodged</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-white">{summary.totalIncidentsLodged}</h3>
            <span className="text-xs text-slate-400">logged in AY</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">24x7 Anonymous Intake Active</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Squad Probes</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-amber-400">{summary.activeInvestigations}</h3>
            <span className="text-xs text-slate-400">squad investigations</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Hostels & Canteen patrols</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Severe Sanctions Imposed</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-rose-400">{summary.severePunitiveSanctions}</h3>
            <span className="text-xs text-slate-400">evictions / rustication</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">{summary.firLodgedCount} Police FIRs Lodged</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">7-Day Statutory SLA</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-emerald-400">{summary.slaCompliancePercent}%</h3>
            <span className="text-xs text-slate-400">compliance rate</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Mandatory UGC 7-day action report</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search token, location, or accused..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-rose-500 w-full sm:w-64"
          />
          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Stages</option>
            <option value="LODGED">Lodged</option>
            <option value="SQUAD_INVESTIGATING">Squad Investigating</option>
            <option value="TRIBUNAL_HEARING_SCHEDULED">Hearing Scheduled</option>
            <option value="SANCTION_PRONOUNCED">Sanction Pronounced</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400">
            No anti-ragging incident reports matching your criteria.
          </div>
        ) : (
          filteredIncidents.map(inc => (
            <div
              key={inc.id}
              className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 hover:border-slate-600 transition space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-700/50 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-rose-400">{inc.id}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-rose-950/60 text-rose-300 border border-rose-800/40">
                      {inc.category.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      inc.isAnonymous ? 'bg-purple-900/40 text-purple-300 border border-purple-700/50' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {inc.isAnonymous ? 'Whistleblower Shield Active' : `Reported by: ${inc.complainantHash}`}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{inc.location}</h3>
                  <p className="text-xs text-slate-400">
                    Incident Time: {new Date(inc.incidentTimestamp).toLocaleString()} • SLA Deadline: {new Date(inc.statutorySlaDeadline).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block ${
                    inc.stage === 'SANCTION_PRONOUNCED' || inc.stage === 'CLOSED'
                      ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/40'
                      : inc.stage === 'TRIBUNAL_HEARING_SCHEDULED'
                      ? 'bg-blue-900/40 text-blue-300 border border-blue-500/40'
                      : 'bg-amber-900/40 text-amber-300 border border-amber-500/40'
                  }`}>
                    {inc.stage.replace(/_/g, ' ')}
                  </span>
                  {inc.pronouncement && inc.pronouncement !== 'NONE' && (
                    <p className="text-xs font-bold text-rose-400 mt-1">
                      Sanction: {inc.pronouncement.replace(/_/g, ' ')}
                    </p>
                  )}
                  {inc.firNumber && (
                    <p className="text-xs font-mono text-rose-400">FIR: {inc.firNumber} ({inc.policeStationName})</p>
                  )}
                </div>
              </div>

              {/* Description & Accused */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-400 font-semibold">Incident Details</p>
                  <p className="text-slate-200">{inc.description}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 font-semibold">Accused Individuals</p>
                  <p className="text-rose-300 font-semibold">{inc.accusedStudentNames.join(', ')}</p>
                  {inc.assignedSquadOfficer && (
                    <p className="text-slate-400 mt-1">
                      Squad Officer: <span className="text-slate-200 font-semibold">{inc.assignedSquadOfficer}</span>
                    </p>
                  )}
                </div>
              </div>

              {inc.actionTakenReportNotes && (
                <div className="p-2.5 bg-slate-900/60 rounded text-xs text-slate-300 border border-slate-800">
                  <span className="text-slate-400 font-semibold">Action Taken Report (ATR):</span> {inc.actionTakenReportNotes}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/50">
                {inc.stage === 'LODGED' && (
                  <button
                    onClick={() => handleAssignSquad(inc.id)}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded"
                  >
                    Dispatch Anti-Ragging Squad (ARS)
                  </button>
                )}

                {inc.stage === 'SQUAD_INVESTIGATING' && (
                  <button
                    onClick={() => handleScheduleHearing(inc.id)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded"
                  >
                    Summon Disciplinary Tribunal
                  </button>
                )}

                {inc.stage === 'TRIBUNAL_HEARING_SCHEDULED' && (
                  <button
                    onClick={() => handlePronounceSanction(inc.id)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded shadow"
                  >
                    Pronounce Sanction & Close
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lodge Incident Modal */}
      {showLodgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Lodge Anti-Ragging Report (Confidential)</h3>
              <button onClick={() => setShowLodgeModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleLodge} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Violation Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as RaggingCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="PSYCHOLOGICAL_INTIMIDATION">Psychological Intimidation</option>
                    <option value="VERBAL_ABUSE">Verbal Abuse</option>
                    <option value="PHYSICAL_ASSAULT">Physical Assault</option>
                    <option value="FINANCIAL_EXTORTION">Financial Extortion</option>
                    <option value="GROSS_HUMILIATION">Gross Humiliation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Incident Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={incidentTime}
                    onChange={e => setIncidentTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Exact Campus Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Aryabhata Hall Room 204 Corridor"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Accused Senior Students (Names, Comma-Separated)</label>
                <input
                  type="text"
                  value={accusedNames}
                  onChange={e => setAccusedNames(e.target.value)}
                  placeholder="e.g. Senior Student 1, Senior Student 2"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Incident Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe words spoken, physical contact, threats made, or demands..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={isAnonymous}
                  onChange={e => setIsAnonymous(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-rose-600"
                />
                <label htmlFor="anonCheck" className="text-xs text-slate-300">
                  Lodge Anonymously (Issue zero-knowledge cryptographic tracking token ARC-XXXXX)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLodgeModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold"
                >
                  Submit Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
