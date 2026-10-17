'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  FleetVehicle,
  BusRoute,
  StudentBusPass,
  VehicleStatus,
  ShiftType,
  getVehicles,
  getRoutes,
  getStudentPasses,
  registerVehicle,
  updateVehicleStatus,
  createBusRoute,
  issueStudentBusPass,
  recordRfidBoarding,
  computeFleetSummary,
  exportTransportRosterCSV,
  seedTransportData
} from '@/lib/admin/transportManagement';

interface TransportFleetManagerProps {
  institutionId?: string;
}

export const TransportFleetManager: React.FC<TransportFleetManagerProps> = ({
  institutionId = 'inst-apex-001',
}) => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'routes' | 'passes'>('vehicles');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('ALL');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals state
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  // New Vehicle Form State
  const [newBusNumber, setNewBusNumber] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newCapacity, setNewCapacity] = useState(40);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');

  // New Bus Pass Form State
  const [passStudentId, setPassStudentId] = useState('');
  const [passStudentName, setPassStudentName] = useState('');
  const [passEnrollment, setPassEnrollment] = useState('');
  const [passRouteId, setPassRouteId] = useState('');
  const [passStopId, setPassStopId] = useState('');

  // Initial Seed
  useEffect(() => {
    const existing = getVehicles(institutionId);
    if (existing.length === 0) {
      seedTransportData(institutionId);
      setRefreshKey(k => k + 1);
    }
  }, [institutionId]);

  const vehicles = useMemo(() => getVehicles(institutionId), [institutionId, refreshKey]);
  const routes = useMemo(() => getRoutes(institutionId), [institutionId, refreshKey]);
  const passes = useMemo(() => getStudentPasses(institutionId), [institutionId, refreshKey]);
  const summary = useMemo(() => computeFleetSummary(institutionId), [institutionId, refreshKey]);

  const routeMap = useMemo(() => new Map(routes.map(r => [r.id, r])), [routes]);

  const filteredPasses = useMemo(() => {
    return passes.filter(p => {
      const matchesRoute = selectedRouteFilter === 'ALL' || p.routeId === selectedRouteFilter;
      const matchesSearch = p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.rfidTag.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRoute && matchesSearch;
    });
  }, [passes, selectedRouteFilter, searchTerm]);

  const handleExportCSV = () => {
    const csvContent = exportTransportRosterCSV(institutionId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Campus_Transport_Roster_${institutionId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegisterVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusNumber.trim() || !newDriverName.trim()) return;

    registerVehicle({
      institutionId,
      busNumber: newBusNumber.trim().toUpperCase(),
      vehicleModel: newModel.trim() || 'Standard 40-Seater Bus',
      capacity: newCapacity,
      driverName: newDriverName.trim(),
      driverPhone: newDriverPhone.trim() || '+91 90000 00000',
      fitnessExpiryDate: '2027-12-31',
      speedGovernorCompliant: true,
      maxSpeedKmH: 50,
      currentFuelOrChargePercent: 100,
      status: 'IDLE'
    });

    setNewBusNumber('');
    setNewModel('');
    setNewDriverName('');
    setNewDriverPhone('');
    setShowVehicleModal(false);
    setRefreshKey(k => k + 1);
  };

  const handleIssuePass = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    if (!passRouteId || !passStopId || !passStudentId.trim() || !passStudentName.trim() || !passEnrollment.trim()) {
      setPassError('Please fill all required fields');
      return;
    }

    const res = issueStudentBusPass({
      institutionId,
      studentId: passStudentId.trim(),
      studentName: passStudentName.trim(),
      enrollmentNumber: passEnrollment.trim(),
      routeId: passRouteId,
      pickupStopId: passStopId,
      academicYear: '2026-2027'
    });

    if (!res.success) {
      setPassError(res.error || 'Failed to issue pass');
      return;
    }

    setPassStudentId('');
    setPassStudentName('');
    setPassEnrollment('');
    setShowPassModal(false);
    setRefreshKey(k => k + 1);
  };

  const handleSimulateBoarding = (rfidTag: string) => {
    const res = recordRfidBoarding(institutionId, rfidTag);
    if (res.success) {
      alert(`Contactless RFID Boarding Recorded for ${res.pass?.studentName}!`);
      setRefreshKey(k => k + 1);
    } else {
      alert(`Boarding Denied: ${res.error}`);
    }
  };

  const handleStatusToggle = (busId: string, currentStatus: VehicleStatus) => {
    const nextStatus: VehicleStatus = currentStatus === 'ON_ROUTE' ? 'IDLE' : 'ON_ROUTE';
    updateVehicleStatus(busId, nextStatus);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 bg-slate-900 text-slate-100 rounded-xl min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-amber-600/20 text-amber-400 rounded-lg border border-amber-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Campus Transportation & Fleet Telemetry</h1>
              <p className="text-sm text-slate-400">
                Multi-Stop Commuter Routes • Live GPS Tracking • Contactless RFID Boarding • RTO Compliance
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Fleet Roster CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active on Route</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-amber-400">{summary.activeVehiclesOnRoute}</h3>
            <span className="text-xs text-slate-400">/ {summary.totalVehicles} buses running</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Speed governors active (≤ 50 km/h)</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Seating Capacity</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-emerald-400">{summary.totalSeatingCapacity}</h3>
            <span className="text-xs text-slate-400">seats across fleet</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">{summary.totalDailyRoutes} Scheduled Commuter Routes</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Subscribed Commuters</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-blue-400">{summary.totalSubscribedStudents}</h3>
            <span className="text-xs text-slate-400">active bus passes</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${summary.fleetUtilizationRate}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">{summary.fleetUtilizationRate}% Fleet Seat Utilization</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fleet Health & Safety</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-cyan-400">100%</h3>
            <span className="text-xs text-slate-400">RTO Certified</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            {summary.vehiclesNeedingMaintenance === 0 ? 'Zero active mechanical faults' : `${summary.vehiclesNeedingMaintenance} in maintenance`}
          </p>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'vehicles'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Fleet Vehicles ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'routes'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Bus Routes & Stops ({routes.length})
          </button>
          <button
            onClick={() => setActiveTab('passes')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'passes'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Student Bus Passes ({passes.length})
          </button>
        </div>

        {activeTab === 'vehicles' && (
          <button
            onClick={() => setShowVehicleModal(true)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg shrink-0"
          >
            + Register New Bus
          </button>
        )}

        {activeTab === 'passes' && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search student or RFID tag..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500 w-full sm:w-60"
            />
            <select
              value={selectedRouteFilter}
              onChange={e => setSelectedRouteFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Routes</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>{r.routeCode} ({r.routeName})</option>
              ))}
            </select>
            <button
              onClick={() => {
                setPassError(null);
                setShowPassModal(true);
              }}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg shrink-0"
            >
              + Issue Bus Pass
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Fleet Vehicles */}
      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map(bus => (
            <div
              key={bus.id}
              className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 hover:border-slate-600 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400">{bus.busNumber}</span>
                    <h3 className="text-base font-bold text-white leading-tight">{bus.vehicleModel}</h3>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    bus.status === 'ON_ROUTE'
                      ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40 animate-pulse'
                      : bus.status === 'IDLE'
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-rose-900/40 text-rose-300 border-rose-500/40'
                  }`}>
                    {bus.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>Capacity: <span className="text-slate-200 font-semibold">{bus.capacity} Seats</span> • Max Speed: {bus.maxSpeedKmH} km/h</p>
                  <p>Driver: <span className="text-slate-200 font-semibold">{bus.driverName}</span> ({bus.driverPhone})</p>
                  <p>Fitness Expiry: {bus.fitnessExpiryDate} • Fuel/Charge: {bus.currentFuelOrChargePercent}%</p>
                </div>

                {bus.currentLocation && bus.status === 'ON_ROUTE' && (
                  <div className="bg-slate-900/80 border border-slate-700/80 p-3 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between text-emerald-400 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Live GPS Signal Active
                      </span>
                      <span>{bus.currentLocation.speedKmH} km/h</span>
                    </div>
                    <p className="text-slate-400 font-mono">
                      Lat: {bus.currentLocation.latitude.toFixed(4)}, Lng: {bus.currentLocation.longitude.toFixed(4)}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-700/50">
                <button
                  onClick={() => handleStatusToggle(bus.id, bus.status)}
                  className={`w-full py-2 text-xs font-semibold rounded-lg transition ${
                    bus.status === 'ON_ROUTE'
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                      : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  {bus.status === 'ON_ROUTE' ? 'Mark Bus as Idle' : 'Dispatch on Route'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Bus Routes */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          {routes.map(route => {
            return (
              <div
                key={route.id}
                className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 hover:border-slate-600 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/50 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded font-mono font-bold bg-amber-900/40 text-amber-300 border border-amber-700/50">
                        {route.routeCode}
                      </span>
                      <span className="text-xs text-slate-400 uppercase font-semibold">{route.shift.replace('_', ' ')}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">{route.routeName}</h3>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <p>Total Distance: <span className="text-white font-semibold">{route.totalDistanceKm} km</span></p>
                    <p>Estimated Trip: <span className="text-white font-semibold">{route.estimatedDurationMinutes} mins</span></p>
                    <p className="text-amber-400 font-semibold">{route.activePassengerCount} registered commuters</p>
                  </div>
                </div>

                {/* Scheduled Multi-Stop Roadmap */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Scheduled Route Stops</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {route.stops.map(stop => (
                      <div key={stop.stopId} className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-400">Stop #{stop.sequenceNumber}</span>
                          <span className="font-mono text-slate-300">{stop.scheduledTime}</span>
                        </div>
                        <p className="font-semibold text-white">{stop.stopName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Student Bus Passes */}
      {activeTab === 'passes' && (
        <div className="space-y-3">
          {filteredPasses.length === 0 ? (
            <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400">
              No bus passes found matching criteria.
            </div>
          ) : (
            filteredPasses.map(pass => {
              const route = routeMap.get(pass.routeId);
              const stop = route?.stops.find(s => s.stopId === pass.pickupStopId);
              return (
                <div
                  key={pass.id}
                  className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 hover:border-slate-600 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-amber-400">{pass.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-700 text-slate-300">
                        {pass.rfidTag}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-amber-900/40 text-amber-300 border border-amber-700/50">
                        {route?.routeCode || 'RT-01'}
                      </span>
                      {pass.seatNumber && (
                        <span className="text-xs text-slate-400 font-mono">Seat #{pass.seatNumber}</span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white">{pass.studentName}</h3>
                    <p className="text-xs text-slate-400">
                      Enrollment: <span className="text-slate-300">{pass.enrollmentNumber}</span> • Pickup Stop: <span className="text-slate-200 font-semibold">{stop?.stopName || 'Designated Stop'}</span>
                      {pass.lastBoardedTimestamp && ` • Last Boarded: ${new Date(pass.lastBoardedTimestamp).toLocaleTimeString()}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      pass.paymentStatus === 'PAID'
                        ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-900/40 text-rose-300 border border-rose-500/40'
                    }`}>
                      {pass.paymentStatus}
                    </span>

                    <button
                      onClick={() => handleSimulateBoarding(pass.rfidTag)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded shadow transition"
                    >
                      Tap RFID
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Register Vehicle Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Register Campus Bus</h3>
              <button onClick={() => setShowVehicleModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleRegisterVehicle} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Registration No.</label>
                  <input
                    type="text"
                    required
                    value={newBusNumber}
                    onChange={e => setNewBusNumber(e.target.value)}
                    placeholder="KA-01-F-9901"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={e => setNewCapacity(parseInt(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Vehicle Model</label>
                <input
                  type="text"
                  value={newModel}
                  onChange={e => setNewModel(e.target.value)}
                  placeholder="e.g. Tata Ultra EV 50-Seater"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={newDriverName}
                    onChange={e => setNewDriverName(e.target.value)}
                    placeholder="e.g. Suresh Gowda"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Driver Phone</label>
                  <input
                    type="text"
                    value={newDriverPhone}
                    onChange={e => setNewDriverPhone(e.target.value)}
                    placeholder="+91 98450 XXXXX"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowVehicleModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold"
                >
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Pass Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Issue Student Bus Pass</h3>
              <button onClick={() => setShowPassModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {passError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-lg text-rose-300 text-xs">
                {passError}
              </div>
            )}

            <form onSubmit={handleIssuePass} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Route</label>
                  <select
                    required
                    value={passRouteId}
                    onChange={e => {
                      setPassRouteId(e.target.value);
                      const r = routeMap.get(e.target.value);
                      if (r && r.stops.length > 0) {
                        setPassStopId(r.stops[0].stopId);
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="">Select Route...</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>{r.routeCode} ({r.routeName})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Pickup Stop</label>
                  <select
                    required
                    value={passStopId}
                    onChange={e => setPassStopId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="">Select Stop...</option>
                    {passRouteId && routeMap.get(passRouteId)?.stops.map(s => (
                      <option key={s.stopId} value={s.stopId}>{s.stopName} ({s.scheduledTime})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={passStudentName}
                  onChange={e => setPassStudentName(e.target.value)}
                  placeholder="e.g. Priyanshu Mehta"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Student ID</label>
                  <input
                    type="text"
                    required
                    value={passStudentId}
                    onChange={e => setPassStudentId(e.target.value)}
                    placeholder="STU-9021"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Enrollment No.</label>
                  <input
                    type="text"
                    required
                    value={passEnrollment}
                    onChange={e => setPassEnrollment(e.target.value)}
                    placeholder="ENG-2024-512"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPassModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold"
                >
                  Issue Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
