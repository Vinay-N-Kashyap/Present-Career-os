'use client';

import React, { useState } from 'react';
import {
  CampusZone,
  SafetyIncident,
  SafetyIncidentType,
  IncidentSeverity,
  campusSafetyStore,
  exportSafetyIncidentsCSV,
} from '@/lib/admin/campusSafety';

interface CampusSafetyBroadcastManagerProps {
  institutionId?: string;
}

const SEED_ZONES: CampusZone[] = [
  {
    zoneId: 'zn-01',
    institutionId: 'inst-apex-001',
    zoneName: 'Engineering Complex Block B',
    buildingCode: 'ENG-B',
    latitude: 12.9716,
    longitude: 77.5946,
    radiusMeters: 120,
    currentEvacuationStatus: 'NORMAL',
    headOfZoneSecurity: 'Capt. R. Deshmukh',
  },
  {
    zoneId: 'zn-02',
    institutionId: 'inst-apex-001',
    zoneName: 'Main Central Library Quad',
    buildingCode: 'LIB-MAIN',
    latitude: 12.9722,
    longitude: 77.5952,
    radiusMeters: 150,
    currentEvacuationStatus: 'NORMAL',
    headOfZoneSecurity: 'Sub-Inspector M. Kulkarni',
  },
  {
    zoneId: 'zn-03',
    institutionId: 'inst-apex-001',
    zoneName: 'Chemical & Materials Research Center',
    buildingCode: 'RES-CHEM',
    latitude: 12.9708,
    longitude: 77.5938,
    radiusMeters: 80,
    currentEvacuationStatus: 'NORMAL',
    headOfZoneSecurity: 'Safety Officer P. Nair',
  },
];

const SEED_INCIDENTS = [
  {
    institutionId: 'inst-apex-001',
    zoneId: 'zn-03',
    type: 'INFRASTRUCTURE_HAZARD' as SafetyIncidentType,
    severity: 'MEDIUM' as IncidentSeverity,
    title: 'Minor cooling pump pressure drop in Polymer Synthesis Lab',
    description: 'Chilled water loop pump 2 reported a 15% pressure deficit. Maintenance alerted.',
    reportedBy: 'Lab Technician S. Swamy',
  },
];

export const CampusSafetyBroadcastManager: React.FC<CampusSafetyBroadcastManagerProps> = ({
  institutionId = 'inst-apex-001',
}) => {
  // Seed store if empty
  useState(() => {
    const existing = campusSafetyStore.getZonesByInstitution(institutionId);
    if (existing.length === 0) {
      for (const z of SEED_ZONES) campusSafetyStore.registerZone(z);
      for (const inc of SEED_INCIDENTS) campusSafetyStore.reportIncident(inc);
    }
  });

  const [zones, setZones] = useState<CampusZone[]>(() =>
    campusSafetyStore.getZonesByInstitution(institutionId)
  );

  const [incidents, setIncidents] = useState<SafetyIncident[]>(() =>
    campusSafetyStore.getIncidentsByInstitution(institutionId)
  );

  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  // New incident modal state
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [targetZoneId, setTargetZoneId] = useState<string>(SEED_ZONES[0].zoneId);
  const [incType, setIncType] = useState<SafetyIncidentType>('MEDICAL_EMERGENCY');
  const [incSeverity, setIncSeverity] = useState<IncidentSeverity>('HIGH');
  const [incTitle, setIncTitle] = useState<string>('');
  const [incDesc, setIncDesc] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>('Campus Security Desk');

  // Dispatch / Resolve modal state
  const [selectedIncident, setSelectedIncident] = useState<SafetyIncident | null>(null);
  const [isDispatchOpen, setIsDispatchOpen] = useState<boolean>(false);
  const [isResolveOpen, setIsResolveOpen] = useState<boolean>(false);
  const [newResponder, setNewResponder] = useState<string>('Paramedic Emergency Unit');
  const [aarSummary, setAarSummary] = useState<string>('');

  const refreshAll = () => {
    setZones(campusSafetyStore.getZonesByInstitution(institutionId));
    setIncidents(campusSafetyStore.getIncidentsByInstitution(institutionId));
  };

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const redAlerts = incidents.filter(i => i.status !== 'RESOLVED' && i.severity === 'CRITICAL_RED_ALERT');

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incTitle.trim() || !incDesc.trim()) return;

    const inc = campusSafetyStore.reportIncident({
      institutionId,
      zoneId: targetZoneId,
      type: incType,
      severity: incSeverity,
      title: incTitle.trim(),
      description: incDesc.trim(),
      reportedBy: reporterName.trim(),
    });

    setIsReportOpen(false);
    setIncTitle('');
    setIncDesc('');
    refreshAll();
    setBannerNotice(`Safety Alert Reported: ${inc.title} in ${inc.zoneName} (${inc.severity})`);
    setTimeout(() => setBannerNotice(null), 6000);
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident) return;

    campusSafetyStore.dispatchResponders({
      incidentId: selectedIncident.incidentId,
      institutionId,
      responderTeams: [newResponder],
    });

    setIsDispatchOpen(false);
    refreshAll();
    setBannerNotice(`Dispatched ${newResponder} to ${selectedIncident.zoneName}`);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !aarSummary.trim()) return;

    campusSafetyStore.resolveIncident({
      incidentId: selectedIncident.incidentId,
      institutionId,
      afterActionSummary: aarSummary.trim(),
    });

    setIsResolveOpen(false);
    setAarSummary('');
    refreshAll();
    setBannerNotice(`Incident ${selectedIncident.incidentId} marked RESOLVED with After-Action Review.`);
    setTimeout(() => setBannerNotice(null), 5000);
  };

  const handleExportCSV = () => {
    const csv = exportSafetyIncidentsCSV(incidents);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `Campus_Safety_Audit_${institutionId}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBannerNotice('Campus Safety Audit CSV exported successfully.');
    setTimeout(() => setBannerNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xl font-bold">
            🚨
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Campus Safety & Emergency Response Dispatch Console
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time campus security geofences, zone evacuation monitoring, multi-channel sirens, and responder telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsReportOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-rose-600/20 animate-pulse"
          >
            <span>🚨</span> Broadcast Safety Alert
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
          >
            <span>📥</span> Export Safety Log CSV
          </button>
        </div>
      </div>

      {bannerNotice && (
        <div className="p-3 bg-rose-950/50 border border-rose-500/40 text-rose-300 text-sm rounded-lg flex items-center gap-2">
          <span>⚠️</span> {bannerNotice}
        </div>
      )}

      {/* Safety Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monitored Zones</div>
          <div className="text-3xl font-bold text-slate-100 mt-2">{zones.length} Zones</div>
          <div className="text-xs text-slate-500 mt-1">Geofenced perimeter control</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Active Incidents</div>
          <div className="text-3xl font-bold text-amber-400 mt-2">{activeIncidents.length}</div>
          <div className="text-xs text-slate-500 mt-1">Responders mobilized</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Critical Red Alerts</div>
          <div className="text-3xl font-bold text-rose-400 mt-2">{redAlerts.length}</div>
          <div className="text-xs text-rose-300/80 mt-1">
            {redAlerts.length > 0 ? 'Evacuation protocol in effect' : 'Zero red alerts active'}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Response Speed</div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">2.4 min</div>
          <div className="text-xs text-slate-500 mt-1">Average QRT dispatch time</div>
        </div>
      </div>

      {/* Monitored Campus Zones Radar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100">
            Monitored Campus Zones & Evacuation Readiness ({zones.length})
          </h2>
          <span className="text-xs text-slate-400">Continuous Perimeter Geofences</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {zones.map((zone) => {
            const isEvac = zone.currentEvacuationStatus === 'EVACUATE';
            const isShelter = zone.currentEvacuationStatus === 'SHELTER_IN_PLACE';

            return (
              <div
                key={zone.zoneId}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                  isEvac
                    ? 'bg-rose-950/40 border-rose-500/50 ring-1 ring-rose-500'
                    : isShelter
                    ? 'bg-amber-950/40 border-amber-500/50 ring-1 ring-amber-500'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                      {zone.buildingCode}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        isEvac
                          ? 'bg-rose-900 text-rose-200 border-rose-500 animate-pulse'
                          : isShelter
                          ? 'bg-amber-900 text-amber-200 border-amber-500'
                          : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {zone.currentEvacuationStatus}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 pt-1">
                    {zone.zoneName}
                  </h3>
                </div>

                <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800/80">
                  <div>Radius: <span className="text-slate-200 font-semibold">{zone.radiusMeters}m</span></div>
                  <div>Security Lead: <span className="text-slate-200">{zone.headOfZoneSecurity}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Incidents Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100">
            Safety Incidents & Responder Dispatch Queue ({incidents.length})
          </h2>
          <span className="text-xs text-slate-400">Emergency Operation Center (EOC)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Incident</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Responders</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {incidents.map((item) => {
                const severityBadge = {
                  CRITICAL_RED_ALERT: 'bg-rose-950 text-rose-300 border-rose-500/60 animate-pulse',
                  HIGH: 'bg-amber-950 text-amber-300 border-amber-500/40',
                  MEDIUM: 'bg-blue-950 text-blue-300 border-blue-500/40',
                  LOW: 'bg-slate-950 text-slate-400 border-slate-700',
                }[item.severity];

                const isResolved = item.status === 'RESOLVED';

                return (
                  <tr key={item.incidentId} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100">{item.title}</div>
                      <div className="text-xs text-slate-500">{item.type.replace(/_/g, ' ')} • Reported by {item.reportedBy}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-300">
                      {item.zoneName}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className={`px-2 py-0.5 rounded border font-semibold ${severityBadge}`}>
                        {item.severity.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className={`px-2 py-0.5 rounded font-medium border ${
                        isResolved ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' : 'bg-slate-950 text-slate-300 border-slate-700'
                      }`}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-indigo-300">
                      {item.assignedResponders.join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {!isResolved && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedIncident(item);
                              setIsDispatchOpen(true);
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs"
                          >
                            Dispatch
                          </button>
                          <button
                            onClick={() => {
                              setSelectedIncident(item);
                              setIsResolveOpen(true);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Incident Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form onSubmit={handleReportIncident} className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>🚨</span> Report Campus Safety Incident
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Campus Zone</label>
                <select
                  value={targetZoneId}
                  onChange={(e) => setTargetZoneId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                >
                  {zones.map(z => (
                    <option key={z.zoneId} value={z.zoneId}>{z.zoneName} ({z.buildingCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Incident Type</label>
                <select
                  value={incType}
                  onChange={(e) => setIncType(e.target.value as SafetyIncidentType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                >
                  <option value="MEDICAL_EMERGENCY">Medical Emergency</option>
                  <option value="INFRASTRUCTURE_HAZARD">Infrastructure Hazard</option>
                  <option value="FIRE_OR_CHEMICAL_SPILL">Fire / Chemical Spill</option>
                  <option value="SECURITY_BREACH">Security Breach</option>
                  <option value="SEVERE_WEATHER_ALERT">Severe Weather Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Severity Level</label>
                <select
                  value={incSeverity}
                  onChange={(e) => setIncSeverity(e.target.value as IncidentSeverity)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                >
                  <option value="LOW">Low (Routine maintenance)</option>
                  <option value="MEDIUM">Medium (Local hazard)</option>
                  <option value="HIGH">High (Immediate response needed)</option>
                  <option value="CRITICAL_RED_ALERT">Critical Red Alert (Triggers Evacuation)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Incident Title</label>
                <input
                  type="text"
                  required
                  value={incTitle}
                  onChange={(e) => setIncTitle(e.target.value)}
                  placeholder="e.g. Chemical fume exhaust failure"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description & Exact Location</label>
                <textarea
                  rows={3}
                  required
                  value={incDesc}
                  onChange={(e) => setIncDesc(e.target.value)}
                  placeholder="Room number, current conditions..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-semibold"
              >
                Broadcast Incident
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Dispatch Responder Modal */}
      {isDispatchOpen && selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form onSubmit={handleDispatch} className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>🚒</span> Dispatch Emergency Responder Team
            </h3>
            <p className="text-xs text-slate-400">
              Mobilize teams to {selectedIncident.zoneName} for {selectedIncident.title}.
            </p>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Select Response Unit</label>
                <select
                  value={newResponder}
                  onChange={(e) => setNewResponder(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                >
                  <option value="Paramedic Emergency First Aid Unit">Paramedic Emergency First Aid Unit</option>
                  <option value="Municipal Fire & Rescue Liaison">Municipal Fire & Rescue Liaison</option>
                  <option value="Hazardous Chemical Containment Squad">Hazardous Chemical Containment Squad</option>
                  <option value="Campus Facilities & High-Voltage Electricians">Campus Facilities & Electricians</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsDispatchOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold"
              >
                Confirm Dispatch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resolve Incident Modal */}
      {isResolveOpen && selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form onSubmit={handleResolve} className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>✅</span> File After-Action Review & Resolve
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">After-Action Summary & Remediation</label>
                <textarea
                  rows={4}
                  required
                  value={aarSummary}
                  onChange={(e) => setAarSummary(e.target.value)}
                  placeholder="Detail containment steps, root cause, and zone safety clearance..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsResolveOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold"
              >
                Resolve & Clear Zone
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CampusSafetyBroadcastManager;
