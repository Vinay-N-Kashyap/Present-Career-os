'use client';

import React, { useState } from 'react';
import {
  TransportFleetVehicle,
  VehicleCategory,
  FuelType,
  TripDispatchRecord,
  SAMPLE_FLEET_VEHICLES,
  createFleetVehicle,
  dispatchVehicleTrip,
  completeVehicleTrip,
  logFuelCardTransaction,
  recordMaintenanceLog,
  exportCampusTransportFleetCSV,
  checkStatutoryCompliance
} from '@/lib/admin/centralCampusTransport';

export default function CentralCampusTransportManager() {
  const [vehicles, setVehicles] = useState<TransportFleetVehicle[]>(SAMPLE_FLEET_VEHICLES);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [selectedVehicle, setSelectedVehicle] = useState<TransportFleetVehicle | null>(null);
  
  // Modals state
  const [showAddVehicleModal, setShowAddVehicleModal] = useState<boolean>(false);
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);
  const [showCompleteTripModal, setShowCompleteTripModal] = useState<boolean>(false);
  const [showFuelModal, setShowFuelModal] = useState<boolean>(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState<boolean>(false);
  const [showSealModal, setShowSealModal] = useState<boolean>(false);
  const [alertBanner, setAlertBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [newRegNumber, setNewRegNumber] = useState('');
  const [newChassisNumber, setNewChassisNumber] = useState('');
  const [newCategory, setNewCategory] = useState<VehicleCategory>('ELECTRIC_BUS_SHUTTLE');
  const [newFuelType, setNewFuelType] = useState<FuelType>('EV_BATTERY_ELECTRIC');
  const [newSeatingCapacity, setNewSeatingCapacity] = useState(45);
  const [newOdometer, setNewOdometer] = useState(1000);
  const [newDriver, setNewDriver] = useState('');
  const [newDriverLicense, setNewDriverLicense] = useState('');
  const [newFitnessExpiry, setNewFitnessExpiry] = useState('2027-05-30');
  const [newPucExpiry, setNewPucExpiry] = useState('2027-05-30');
  const [newInsuranceExpiry, setNewInsuranceExpiry] = useState('2027-05-30');
  const [newRatedEfficiency, setNewRatedEfficiency] = useState(1.2);

  // Dispatch form
  const [dispatchRoute, setDispatchRoute] = useState('');
  const [dispatchReturnTime, setDispatchReturnTime] = useState('');
  const [dispatchPassengers, setDispatchPassengers] = useState(30);
  const [dispatchPurpose, setDispatchPurpose] = useState<TripDispatchRecord['purpose']>('REGULAR_CAMPUS_SHUTTLE');

  // Complete Trip form
  const [completeTripEndOdo, setCompleteTripEndOdo] = useState(0);
  const [completeRemainingEnergy, setCompleteRemainingEnergy] = useState(70);

  // Fuel form
  const [fuelUnits, setFuelUnits] = useState(40);
  const [fuelRate, setFuelRate] = useState(9.5); // ₹/kWh or ₹/L
  const [fuelStation, setFuelStation] = useState('Campus Central Depot');
  const [fuelOdometer, setFuelOdometer] = useState(0);
  const [fuelCardNumber, setFuelCardNumber] = useState('');

  // Maintenance form
  const [maintType, setMaintType] = useState<'PERIODIC_SERVICE' | 'FITNESS_RENEWAL' | 'PUC_TEST' | 'BATTERY_HEALTH_CHECK' | 'BREAKDOWN_REPAIR'>('PERIODIC_SERVICE');
  const [maintCost, setMaintCost] = useState(5500);
  const [maintVendor, setMaintVendor] = useState('Tata Motors Authorized Workshop');
  const [maintCertNo, setMaintCertNo] = useState('SVC-2026-9921');
  const [maintNotes, setMaintNotes] = useState('Standard 10,000 km schedule service');

  // Filtering
  const filteredVehicles = vehicles.filter(v => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ELECTRIC') return v.fuelType === 'EV_BATTERY_ELECTRIC';
    if (activeTab === 'BUSES') return v.category === 'DIESEL_CAMPUS_BUS' || v.category === 'ELECTRIC_BUS_SHUTTLE';
    if (activeTab === 'SEDANS_VANS') return v.category === 'VIP_STAFF_SEDAN' || v.category === 'UTILITY_MAINTENANCE_VAN';
    if (activeTab === 'AMBULANCE') return v.category === 'AMBULANCE_EMERGENCY';
    return true;
  });

  // Telemetry KPIs
  const totalVehicles = vehicles.length;
  const onRouteCount = vehicles.filter(v => v.status === 'ON_ROUTE_DISPATCHED').length;
  const evCount = vehicles.filter(v => v.fuelType === 'EV_BATTERY_ELECTRIC').length;
  const evGreenSharePct = totalVehicles > 0 ? Math.round((evCount / totalVehicles) * 100) : 0;
  const totalFuelSpendInr = vehicles.reduce((sum, v) => {
    return sum + v.fuelTransactions.reduce((acc, t) => acc + t.totalAmountInr, 0);
  }, 0);

  // Handlers
  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const v = createFleetVehicle({
        registrationNumber: newRegNumber,
        chassisNumber: newChassisNumber,
        category: newCategory,
        fuelType: newFuelType,
        seatingCapacity: Number(newSeatingCapacity),
        initialOdometerKm: Number(newOdometer),
        ratedEfficiencyKmPerUnit: Number(newRatedEfficiency),
        pucExpiryDate: newPucExpiry,
        fitnessExpiryDate: newFitnessExpiry,
        insuranceExpiryDate: newInsuranceExpiry,
        assignedDriver: newDriver,
        assignedDriverLicense: newDriverLicense
      });

      setVehicles([v, ...vehicles]);
      setShowAddVehicleModal(false);
      setAlertBanner({ type: 'success', message: `Vehicle ${v.registrationNumber} added successfully with ID ${v.vehicleId}` });
    } catch (err: unknown) {
      setAlertBanner({ type: 'error', message: err instanceof Error ? err.message : 'Failed to add vehicle' });
    }
  };

  const handleDispatchTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const res = dispatchVehicleTrip(selectedVehicle, {
      routeName: dispatchRoute,
      expectedReturnTimestamp: dispatchReturnTime,
      passengerCount: Number(dispatchPassengers),
      purpose: dispatchPurpose
    });

    if (!res.success) {
      setAlertBanner({ type: 'error', message: res.error || 'Dispatch rejected' });
      return;
    }

    setVehicles(vehicles.map(v => v.vehicleId === res.vehicle.vehicleId ? res.vehicle : v));
    setSelectedVehicle(res.vehicle);
    setShowDispatchModal(false);
    setAlertBanner({ type: 'success', message: `Vehicle ${res.vehicle.registrationNumber} dispatched on ${dispatchRoute}` });
  };

  const handleCompleteTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const activeTrip = selectedVehicle.trips.find(t => t.status === 'IN_TRANSIT');
    if (!activeTrip) {
      setAlertBanner({ type: 'error', message: 'No active in-transit trip found' });
      return;
    }

    const res = completeVehicleTrip(selectedVehicle, {
      tripId: activeTrip.tripId,
      endOdometerKm: Number(completeTripEndOdo),
      remainingBatterySocPercent: selectedVehicle.fuelType === 'EV_BATTERY_ELECTRIC' ? Number(completeRemainingEnergy) : undefined,
      remainingFuelLevelPercent: selectedVehicle.fuelType !== 'EV_BATTERY_ELECTRIC' ? Number(completeRemainingEnergy) : undefined
    });

    if (!res.success) {
      setAlertBanner({ type: 'error', message: res.error || 'Failed to complete trip' });
      return;
    }

    setVehicles(vehicles.map(v => v.vehicleId === res.vehicle.vehicleId ? res.vehicle : v));
    setSelectedVehicle(res.vehicle);
    setShowCompleteTripModal(false);
    setAlertBanner({ type: 'success', message: `Trip completed! Traveled ${res.distanceKm} km. Vehicle available.` });
  };

  const handleLogFuel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const res = logFuelCardTransaction(selectedVehicle, {
      fuelCardNumber: fuelCardNumber || selectedVehicle.assignedFuelCardNumber || 'FC-CARD-DEFAULT',
      unitsDispensed: Number(fuelUnits),
      unitRateInr: Number(fuelRate),
      odometerKm: Number(fuelOdometer),
      dispenserStation: fuelStation,
      newSocOrFuelPercent: 100
    });

    setVehicles(vehicles.map(v => v.vehicleId === res.vehicle.vehicleId ? res.vehicle : v));
    setSelectedVehicle(res.vehicle);
    setShowFuelModal(false);

    if (res.hasEfficiencyAnomaly) {
      setAlertBanner({
        type: 'error',
        message: `Fuel recorded (₹${res.transaction.totalAmountInr}). WARNING: Efficiency anomaly detected! Observed: ${res.observedEfficiency} vs Rated: ${res.vehicle.ratedEfficiencyKmPerUnit}`
      });
    } else {
      setAlertBanner({
        type: 'success',
        message: `Dispensation logged: ${res.transaction.unitsDispensed} units for ₹${res.transaction.totalAmountInr} at ${fuelStation}`
      });
    }
  };

  const handleMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const updated = recordMaintenanceLog(selectedVehicle, {
      type: maintType,
      serviceDate: new Date().toISOString().split('T')[0],
      odometerKm: selectedVehicle.odometerKm,
      costInr: Number(maintCost),
      serviceVendor: maintVendor,
      certificationNumber: maintCertNo,
      notes: maintNotes
    });

    setVehicles(vehicles.map(v => v.vehicleId === updated.vehicleId ? updated : v));
    setSelectedVehicle(updated);
    setShowMaintenanceModal(false);
    setAlertBanner({ type: 'success', message: `Maintenance recorded for ${updated.registrationNumber}. Vehicle restored to ACTIVE.` });
  };

  const handleExportCSV = () => {
    const csvData = exportCampusTransportFleetCSV(vehicles);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Central_Campus_Transport_Fleet_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAlertBanner({ type: 'success', message: 'Transport fleet CSV ledger exported successfully' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-mono text-sm">
              MVA 1988 & CMVR 1989
            </span>
            <span className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 font-mono text-sm">
              BEE Green EV Fleet
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mt-2">
            Central University Campus Transport & EV Fleet Console
          </h1>
          <p className="text-sm text-slate-400">
            Real-time fleet dispatch, automated SoC battery hurdles, fuel card telemetry & MVA compliance audit
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddVehicleModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-lg shadow-emerald-950"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Fleet Vehicle
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Fleet CSV
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alertBanner && (
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          alertBanner.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
            : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="font-bold">{alertBanner.type === 'success' ? '✓' : '⚠️'}</span>
            <p className="text-sm">{alertBanner.message}</p>
          </div>
          <button onClick={() => setAlertBanner(null)} className="text-slate-400 hover:text-slate-200 text-sm">✕</button>
        </div>
      )}

      {/* Telemetry Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Fleet Assets</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">{totalVehicles}</p>
          <p className="text-xs text-slate-500 mt-1">Commercial & Utility Registered</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Active On-Route Dispatches</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">{onRouteCount}</p>
          <p className="text-xs text-slate-500 mt-1">Campus Shuttles in Transit</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">EV Fleet Green Share</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{evGreenSharePct}%</p>
          <p className="text-xs text-slate-500 mt-1">{evCount} Electric Shuttle Buses</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Total Fuel / Energy Spend</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">₹{(totalFuelSpendInr / 100000).toFixed(2)} L</p>
          <p className="text-xs text-slate-500 mt-1">Audited via Fuel Cards</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        {[
          { id: 'ALL', label: 'All Fleet' },
          { id: 'ELECTRIC', label: 'EV Electric Shuttles' },
          { id: 'BUSES', label: 'Campus Buses' },
          { id: 'SEDANS_VANS', label: 'Staff Sedans & Vans' },
          { id: 'AMBULANCE', label: 'Ambulance Emergency' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVehicles.map(vehicle => {
          const compliance = checkStatutoryCompliance(vehicle);
          const activeTrip = vehicle.trips.find(t => t.status === 'IN_TRANSIT');

          return (
            <div
              key={vehicle.vehicleId}
              className={`bg-slate-900/50 border rounded-xl p-5 flex flex-col justify-between transition hover:border-slate-700 ${
                vehicle.status === 'ON_ROUTE_DISPATCHED' 
                  ? 'border-cyan-500/40 bg-cyan-950/10' 
                  : vehicle.status === 'OUT_OF_SERVICE_FITNESS_EXPIRED'
                  ? 'border-rose-500/40 bg-rose-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {vehicle.category.replace(/_/g, ' ')}
                    </span>
                    <h3 className="text-lg font-bold text-slate-100 mt-1">{vehicle.registrationNumber}</h3>
                    <p className="text-xs text-slate-400 font-mono">{vehicle.vehicleId}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    vehicle.status === 'AVAILABLE_ACTIVE' 
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : vehicle.status === 'ON_ROUTE_DISPATCHED'
                      ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 animate-pulse'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                  }`}>
                    {vehicle.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Energy / Fuel Gauge */}
                <div className="mt-4 p-3 bg-slate-950/50 rounded-lg border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">
                      {vehicle.fuelType === 'EV_BATTERY_ELECTRIC' ? '🔋 Battery State-of-Charge (SoC)' : '⛽ Fuel Tank Level'}
                    </span>
                    <span className="font-bold text-slate-200">
                      {vehicle.fuelType === 'EV_BATTERY_ELECTRIC' 
                        ? `${vehicle.batterySocPercent}%` 
                        : `${vehicle.fuelLevelPercent}%`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        vehicle.fuelType === 'EV_BATTERY_ELECTRIC'
                          ? (vehicle.batterySocPercent ?? 0) < 25 ? 'bg-rose-500' : 'bg-emerald-500'
                          : (vehicle.fuelLevelPercent ?? 0) < 20 ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{
                        width: `${vehicle.fuelType === 'EV_BATTERY_ELECTRIC' ? vehicle.batterySocPercent : vehicle.fuelLevelPercent}%`
                      }}
                    />
                  </div>
                  {vehicle.fuelType === 'EV_BATTERY_ELECTRIC' && (vehicle.batterySocPercent ?? 0) < 25 && (
                    <p className="text-[11px] text-rose-400 mt-1 font-mono">⚠️ Below 25% minimum dispatch threshold</p>
                  )}
                </div>

                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-slate-950/40 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">Odometer</span>
                    <span className="font-semibold text-slate-200">{vehicle.odometerKm.toLocaleString()} km</span>
                  </div>
                  <div className="bg-slate-950/40 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">Capacity</span>
                    <span className="font-semibold text-slate-200">{vehicle.seatingCapacity} Passengers</span>
                  </div>
                  <div className="bg-slate-950/40 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">Assigned Driver</span>
                    <span className="font-semibold text-slate-200 truncate block">{vehicle.assignedDriver}</span>
                  </div>
                  <div className="bg-slate-950/40 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">Rated Efficiency</span>
                    <span className="font-semibold text-slate-200">
                      {vehicle.ratedEfficiencyKmPerUnit} {vehicle.fuelType === 'EV_BATTERY_ELECTRIC' ? 'km/kWh' : 'km/L'}
                    </span>
                  </div>
                </div>

                {/* Compliance Badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded ${
                    new Date(vehicle.fitnessExpiryDate) > new Date()
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900'
                      : 'bg-rose-950/40 text-rose-400 border border-rose-900'
                  }`}>
                    Fitness: {vehicle.fitnessExpiryDate}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded ${
                    new Date(vehicle.pucExpiryDate) > new Date()
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900'
                      : 'bg-rose-950/40 text-rose-400 border border-rose-900'
                  }`}>
                    PUC: {vehicle.pucExpiryDate}
                  </span>
                </div>

                {/* Active in-transit trip if any */}
                {activeTrip && (
                  <div className="mt-3 p-2.5 bg-cyan-950/30 border border-cyan-800/40 rounded text-xs text-cyan-200">
                    <p className="font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                      En-route: {activeTrip.routeName}
                    </p>
                    <p className="text-cyan-400/80 mt-0.5">
                      Pax: {activeTrip.passengerCount} | Dep: {new Date(activeTrip.departureTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
                {vehicle.status === 'AVAILABLE_ACTIVE' && (
                  <button
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setDispatchRoute('Route 4 - North Campus to Metro Gate 2');
                      setDispatchReturnTime(new Date(Date.now() + 7200000).toISOString().slice(0, 16));
                      setShowDispatchModal(true);
                    }}
                    className="flex-1 py-1.5 px-3 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 rounded text-xs font-medium transition"
                  >
                    Dispatch Trip
                  </button>
                )}

                {vehicle.status === 'ON_ROUTE_DISPATCHED' && activeTrip && (
                  <button
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setCompleteTripEndOdo(vehicle.odometerKm + 25);
                      setCompleteRemainingEnergy(
                        vehicle.fuelType === 'EV_BATTERY_ELECTRIC' 
                          ? Math.max(0, (vehicle.batterySocPercent ?? 80) - 15) 
                          : Math.max(0, (vehicle.fuelLevelPercent ?? 80) - 10)
                      );
                      setShowCompleteTripModal(true);
                    }}
                    className="flex-1 py-1.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded text-xs font-medium transition"
                  >
                    Complete Trip
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setFuelOdometer(vehicle.odometerKm);
                    setFuelCardNumber(vehicle.assignedFuelCardNumber || 'FC-CAMPUS-01');
                    setFuelRate(vehicle.fuelType === 'EV_BATTERY_ELECTRIC' ? 8.5 : 94.5);
                    setShowFuelModal(true);
                  }}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition"
                >
                  Fuel / Charge
                </button>

                <button
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setShowMaintenanceModal(true);
                  }}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition"
                >
                  Service
                </button>

                <button
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setShowSealModal(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-200 transition"
                  title="View Audit Seal"
                >
                  🔍
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100">Add New Transport Vehicle</h3>
              <button onClick={() => setShowAddVehicleModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Registration Number</label>
                  <input
                    type="text"
                    required
                    value={newRegNumber}
                    onChange={e => setNewRegNumber(e.target.value)}
                    placeholder="KA-01-EQ-1001"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1 uppercase"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Chassis Number</label>
                  <input
                    type="text"
                    required
                    value={newChassisNumber}
                    onChange={e => setNewChassisNumber(e.target.value)}
                    placeholder="MAT628491..."
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => {
                      const cat = e.target.value as VehicleCategory;
                      setNewCategory(cat);
                      if (cat === 'ELECTRIC_BUS_SHUTTLE') {
                        setNewFuelType('EV_BATTERY_ELECTRIC');
                        setNewRatedEfficiency(1.2);
                        setNewSeatingCapacity(45);
                      } else {
                        setNewFuelType('DIESEL');
                        setNewRatedEfficiency(4.5);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  >
                    <option value="ELECTRIC_BUS_SHUTTLE">Electric Bus Shuttle</option>
                    <option value="DIESEL_CAMPUS_BUS">Diesel Campus Bus</option>
                    <option value="VIP_STAFF_SEDAN">VIP Staff Sedan</option>
                    <option value="AMBULANCE_EMERGENCY">Ambulance Emergency</option>
                    <option value="UTILITY_MAINTENANCE_VAN">Utility Maintenance Van</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Fuel / Power Type</label>
                  <select
                    value={newFuelType}
                    onChange={e => setNewFuelType(e.target.value as FuelType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  >
                    <option value="EV_BATTERY_ELECTRIC">EV Battery Electric</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="PETROL">Petrol</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Seating Capacity</label>
                  <input
                    type="number"
                    value={newSeatingCapacity}
                    onChange={e => setNewSeatingCapacity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Odometer (km)</label>
                  <input
                    type="number"
                    value={newOdometer}
                    onChange={e => setNewOdometer(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Rated Efficiency</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRatedEfficiency}
                    onChange={e => setNewRatedEfficiency(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Assigned Driver</label>
                  <input
                    type="text"
                    required
                    value={newDriver}
                    onChange={e => setNewDriver(e.target.value)}
                    placeholder="Manoj Verma"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Driver License No.</label>
                  <input
                    type="text"
                    required
                    value={newDriverLicense}
                    onChange={e => setNewDriverLicense(e.target.value)}
                    placeholder="DL-01-2019-..."
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Fitness Expiry</label>
                  <input
                    type="date"
                    required
                    value={newFitnessExpiry}
                    onChange={e => setNewFitnessExpiry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">PUC Expiry</label>
                  <input
                    type="date"
                    required
                    value={newPucExpiry}
                    onChange={e => setNewPucExpiry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Insurance Expiry</label>
                  <input
                    type="date"
                    required
                    value={newInsuranceExpiry}
                    onChange={e => setNewInsuranceExpiry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                >
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispatch Trip Modal */}
      {showDispatchModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Dispatch Fleet Vehicle</h3>
                <p className="text-xs text-slate-400">{selectedVehicle.registrationNumber} ({selectedVehicle.category})</p>
              </div>
              <button onClick={() => setShowDispatchModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleDispatchTrip} className="space-y-3 text-sm">
              <div>
                <label className="text-slate-400 text-xs">Route Name / Destination</label>
                <input
                  type="text"
                  required
                  value={dispatchRoute}
                  onChange={e => setDispatchRoute(e.target.value)}
                  placeholder="Shuttle Loop A - Hostels to Academic Block"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Expected Return</label>
                  <input
                    type="datetime-local"
                    required
                    value={dispatchReturnTime}
                    onChange={e => setDispatchReturnTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Passenger Count</label>
                  <input
                    type="number"
                    value={dispatchPassengers}
                    max={selectedVehicle.seatingCapacity}
                    onChange={e => setDispatchPassengers(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs">Dispatch Purpose</label>
                <select
                  value={dispatchPurpose}
                  onChange={e => setDispatchPurpose(e.target.value as TripDispatchRecord['purpose'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                >
                  <option value="REGULAR_CAMPUS_SHUTTLE">Regular Campus Shuttle</option>
                  <option value="STUDENT_EXCURSION">Student Excursion / Field Trip</option>
                  <option value="FACULTY_CONFERENCE">Faculty Conference / Protocol</option>
                  <option value="MEDICAL_EMERGENCY">Medical Emergency Patient Transport</option>
                  <option value="ADMINISTRATIVE_LOGISTICS">Administrative Logistics</option>
                </select>
              </div>

              {selectedVehicle.fuelType === 'EV_BATTERY_ELECTRIC' && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded text-xs text-emerald-300">
                  <p className="font-semibold">⚡ Current Battery SoC: {selectedVehicle.batterySocPercent}%</p>
                  <p className="text-[11px] text-emerald-400/80 mt-0.5">Meets the 25% minimum threshold for EV dispatch.</p>
                </div>
              )}

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold"
                >
                  Authorize Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Trip Modal */}
      {showCompleteTripModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Complete Vehicle Trip</h3>
                <p className="text-xs text-slate-400">{selectedVehicle.registrationNumber}</p>
              </div>
              <button onClick={() => setShowCompleteTripModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleCompleteTrip} className="space-y-3 text-sm">
              <div>
                <label className="text-slate-400 text-xs">Return Odometer Reading (km)</label>
                <input
                  type="number"
                  required
                  min={selectedVehicle.odometerKm}
                  value={completeTripEndOdo}
                  onChange={e => setCompleteTripEndOdo(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
                <p className="text-[11px] text-slate-500 mt-1">Start Odometer was {selectedVehicle.odometerKm} km</p>
              </div>

              <div>
                <label className="text-slate-400 text-xs">
                  {selectedVehicle.fuelType === 'EV_BATTERY_ELECTRIC' ? 'Remaining Battery SoC %' : 'Remaining Fuel Level %'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={completeRemainingEnergy}
                  onChange={e => setCompleteRemainingEnergy(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCompleteTripModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                >
                  Log Return & Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fuel / Charge Modal */}
      {showFuelModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  {selectedVehicle.fuelType === 'EV_BATTERY_ELECTRIC' ? 'Log EV Rapid Charging' : 'Log Fuel Card Dispensation'}
                </h3>
                <p className="text-xs text-slate-400">{selectedVehicle.registrationNumber}</p>
              </div>
              <button onClick={() => setShowFuelModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleLogFuel} className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">
                    {selectedVehicle.fuelType === 'EV_BATTERY_ELECTRIC' ? 'Units (kWh)' : 'Volume (Liters)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={fuelUnits}
                    onChange={e => setFuelUnits(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Rate per Unit (₹)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={fuelRate}
                    onChange={e => setFuelRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs">Odometer at Dispensation (km)</label>
                <input
                  type="number"
                  required
                  value={fuelOdometer}
                  onChange={e => setFuelOdometer(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs">Station / EV Charging Hub</label>
                <input
                  type="text"
                  required
                  value={fuelStation}
                  onChange={e => setFuelStation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div className="p-3 bg-slate-950/50 rounded border border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Billed:</span>
                  <span className="font-bold text-amber-400">₹{(fuelUnits * fuelRate).toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFuelModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-semibold"
                >
                  Record Telemetry & Settle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Maintenance Modal */}
      {showMaintenanceModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Schedule Service & Maintenance</h3>
                <p className="text-xs text-slate-400">{selectedVehicle.registrationNumber}</p>
              </div>
              <button onClick={() => setShowMaintenanceModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleMaintenance} className="space-y-3 text-sm">
              <div>
                <label className="text-slate-400 text-xs">Maintenance Type</label>
                <select
                  value={maintType}
                  onChange={e => setMaintType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                >
                  <option value="PERIODIC_SERVICE">Periodic Scheduled Service</option>
                  <option value="FITNESS_RENEWAL">MVA Fitness Certificate Renewal</option>
                  <option value="PUC_TEST">Pollution Under Control (PUC) Testing</option>
                  <option value="BATTERY_HEALTH_CHECK">EV Battery Health & SOH Diagnostic</option>
                  <option value="BREAKDOWN_REPAIR">Breakdown Repair</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Cost (INR)</label>
                  <input
                    type="number"
                    value={maintCost}
                    onChange={e => setMaintCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Cert / Job Card No.</label>
                  <input
                    type="text"
                    value={maintCertNo}
                    onChange={e => setMaintCertNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs">Service Vendor / Workshop</label>
                <input
                  type="text"
                  value={maintVendor}
                  onChange={e => setMaintVendor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs">Work Performed / Notes</label>
                <textarea
                  rows={2}
                  value={maintNotes}
                  onChange={e => setMaintNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMaintenanceModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                >
                  Record Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seal Inspector Modal */}
      {showSealModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Cryptographic Seal Inspector</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedVehicle.vehicleId}</p>
              </div>
              <button onClick={() => setShowSealModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 block">SHA-256 Telemetry Seal</span>
                <span className="font-mono text-emerald-400 break-all">{selectedVehicle.auditSha256}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Chassis:</span>
                  <span className="text-slate-200 font-mono">{selectedVehicle.chassisNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Trips Logged:</span>
                  <span className="text-slate-200 font-semibold">{selectedVehicle.trips.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fuel Transactions:</span>
                  <span className="text-slate-200 font-semibold">{selectedVehicle.fuelTransactions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Maintenance Records:</span>
                  <span className="text-slate-200 font-semibold">{selectedVehicle.maintenanceLogs.length}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowSealModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
