/**
 * Central University Campus Transport Fleet, EV Shuttle & Fuel Card Telemetry Engine
 * 
 * Statutory & Regulatory Framework:
 * - Motor Vehicles Act 1988 (MVA 1988) & Central Motor Vehicles Rules 1989 (CMVR 1989)
 * - Ministry of Road Transport and Highways (MoRTH) Commercial/Institutional Fitness & PUC Norms
 * - Bureau of Energy Efficiency (BEE) National Electric Mobility Mission Guidelines
 * - Petroleum and Explosives Safety Organization (PESO) & Fleet Telemetry Standards
 */

import { createHash } from 'crypto';

export type VehicleCategory = 
  | 'ELECTRIC_BUS_SHUTTLE'
  | 'DIESEL_CAMPUS_BUS'
  | 'VIP_STAFF_SEDAN'
  | 'AMBULANCE_EMERGENCY'
  | 'UTILITY_MAINTENANCE_VAN';

export type FleetStatus = 
  | 'AVAILABLE_ACTIVE'
  | 'ON_ROUTE_DISPATCHED'
  | 'SCHEDULED_MAINTENANCE'
  | 'OUT_OF_SERVICE_FITNESS_EXPIRED'
  | 'DECOMMISSIONED';

export type FuelType = 
  | 'EV_BATTERY_ELECTRIC'
  | 'DIESEL'
  | 'PETROL'
  | 'CNG';

export type MaintenanceType = 
  | 'PERIODIC_SERVICE'
  | 'FITNESS_RENEWAL'
  | 'PUC_TEST'
  | 'BATTERY_HEALTH_CHECK'
  | 'BREAKDOWN_REPAIR';

export interface FuelCardTransaction {
  transactionId: string;
  fuelCardNumber: string;
  vehicleId: string;
  unitsDispensed: number; // Liters for ICE, kWh for EV
  unitRateInr: number;
  totalAmountInr: number;
  odometerKm: number;
  dispenserStation: string;
  timestamp: string;
  telemetrySha256: string;
}

export interface TripDispatchRecord {
  tripId: string;
  vehicleId: string;
  driverName: string;
  driverLicenseNumber: string;
  routeName: string;
  departureTimestamp: string;
  expectedReturnTimestamp: string;
  actualReturnTimestamp?: string;
  startOdometerKm: number;
  endOdometerKm?: number;
  passengerCount: number;
  purpose: 'REGULAR_CAMPUS_SHUTTLE' | 'STUDENT_EXCURSION' | 'FACULTY_CONFERENCE' | 'MEDICAL_EMERGENCY' | 'ADMINISTRATIVE_LOGISTICS';
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
}

export interface MaintenanceLog {
  maintenanceId: string;
  vehicleId: string;
  type: MaintenanceType;
  serviceDate: string;
  odometerKm: number;
  costInr: number;
  serviceVendor: string;
  certificationNumber: string;
  notes: string;
}

export interface TransportFleetVehicle {
  vehicleId: string; // Token format: TRP-[YEAR]-[CAT]-[HEX6]
  registrationNumber: string; // e.g. KA-01-EQ-9102
  chassisNumber: string;
  category: VehicleCategory;
  fuelType: FuelType;
  seatingCapacity: number;
  odometerKm: number;
  batterySocPercent?: number; // 0-100% for EV
  fuelLevelPercent?: number; // 0-100% for ICE
  ratedEfficiencyKmPerUnit: number; // km/kWh for EV, km/L for ICE
  pucExpiryDate: string; // ISO Date YYYY-MM-DD
  fitnessExpiryDate: string; // ISO Date YYYY-MM-DD
  insuranceExpiryDate: string; // ISO Date YYYY-MM-DD
  assignedDriver: string;
  assignedDriverLicense: string;
  assignedFuelCardNumber?: string;
  status: FleetStatus;
  lastServiceDate: string;
  nextServiceOdometerKm: number;
  trips: TripDispatchRecord[];
  fuelTransactions: FuelCardTransaction[];
  maintenanceLogs: MaintenanceLog[];
  createdTimestamp: string;
  auditSha256: string;
}

// Minimum battery state-of-charge required to permit EV dispatch
export const MIN_EV_DISPATCH_SOC_PERCENT = 25;

/**
 * Generate cryptographic SHA-256 seal for vehicle telemetry state
 */
export function generateTransportSeal(vehicle: Omit<TransportFleetVehicle, 'auditSha256'>): string {
  const payload = [
    vehicle.vehicleId,
    vehicle.registrationNumber,
    vehicle.category,
    vehicle.fuelType,
    vehicle.odometerKm,
    vehicle.batterySocPercent ?? 'N/A',
    vehicle.status,
    vehicle.pucExpiryDate,
    vehicle.fitnessExpiryDate,
    vehicle.trips.length,
    vehicle.fuelTransactions.length,
    vehicle.maintenanceLogs.length
  ].join('|');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Format statutory unique vehicle identifier token
 */
export function formatVehicleId(category: VehicleCategory, year: number = 2026): string {
  const catCode = category === 'ELECTRIC_BUS_SHUTTLE' ? 'EVBUS'
    : category === 'DIESEL_CAMPUS_BUS' ? 'DSBUS'
    : category === 'VIP_STAFF_SEDAN' ? 'SEDAN'
    : category === 'AMBULANCE_EMERGENCY' ? 'AMBUL'
    : 'VAN';
  const hex = createHash('sha256')
    .update(`${category}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();
  return `TRP-${year}-${catCode}-${hex}`;
}

/**
 * Check statutory validity of MVA Fitness and PUC certificates against a reference date
 */
export function checkStatutoryCompliance(
  vehicle: Pick<TransportFleetVehicle, 'pucExpiryDate' | 'fitnessExpiryDate' | 'insuranceExpiryDate'>,
  referenceDate: string = new Date().toISOString()
): { isCompliant: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const refDate = new Date(referenceDate.split('T')[0]);

  const fitnessDate = new Date(vehicle.fitnessExpiryDate);
  if (fitnessDate < refDate) {
    reasons.push(`Fitness certificate expired on ${vehicle.fitnessExpiryDate} (MVA 1988 Sec 56)`);
  }

  const pucDate = new Date(vehicle.pucExpiryDate);
  if (pucDate < refDate) {
    reasons.push(`Pollution Under Control (PUC) expired on ${vehicle.pucExpiryDate} (CMVR 1989 Rule 115)`);
  }

  const insDate = new Date(vehicle.insuranceExpiryDate);
  if (insDate < refDate) {
    reasons.push(`Vehicle insurance expired on ${vehicle.insuranceExpiryDate} (MVA 1988 Sec 146)`);
  }

  return {
    isCompliant: reasons.length === 0,
    reasons
  };
}

/**
 * Create a new Transport Fleet Vehicle record
 */
export function createFleetVehicle(params: {
  registrationNumber: string;
  chassisNumber: string;
  category: VehicleCategory;
  fuelType: FuelType;
  seatingCapacity: number;
  initialOdometerKm: number;
  batterySocPercent?: number;
  fuelLevelPercent?: number;
  ratedEfficiencyKmPerUnit: number;
  pucExpiryDate: string;
  fitnessExpiryDate: string;
  insuranceExpiryDate: string;
  assignedDriver: string;
  assignedDriverLicense: string;
  assignedFuelCardNumber?: string;
  lastServiceDate?: string;
  nextServiceOdometerKm?: number;
  year?: number;
}): TransportFleetVehicle {
  const vehicleId = formatVehicleId(params.category, params.year);
  const now = new Date().toISOString();

  // Evaluate statutory compliance
  const compliance = checkStatutoryCompliance(params, now);
  const initialStatus: FleetStatus = compliance.isCompliant 
    ? 'AVAILABLE_ACTIVE' 
    : 'OUT_OF_SERVICE_FITNESS_EXPIRED';

  const baseVehicle: Omit<TransportFleetVehicle, 'auditSha256'> = {
    vehicleId,
    registrationNumber: params.registrationNumber.toUpperCase(),
    chassisNumber: params.chassisNumber.toUpperCase(),
    category: params.category,
    fuelType: params.fuelType,
    seatingCapacity: params.seatingCapacity,
    odometerKm: params.initialOdometerKm,
    batterySocPercent: params.fuelType === 'EV_BATTERY_ELECTRIC' ? (params.batterySocPercent ?? 100) : undefined,
    fuelLevelPercent: params.fuelType !== 'EV_BATTERY_ELECTRIC' ? (params.fuelLevelPercent ?? 100) : undefined,
    ratedEfficiencyKmPerUnit: params.ratedEfficiencyKmPerUnit,
    pucExpiryDate: params.pucExpiryDate,
    fitnessExpiryDate: params.fitnessExpiryDate,
    insuranceExpiryDate: params.insuranceExpiryDate,
    assignedDriver: params.assignedDriver,
    assignedDriverLicense: params.assignedDriverLicense,
    assignedFuelCardNumber: params.assignedFuelCardNumber,
    status: initialStatus,
    lastServiceDate: params.lastServiceDate || now.split('T')[0],
    nextServiceOdometerKm: params.nextServiceOdometerKm || (params.initialOdometerKm + 10000),
    trips: [],
    fuelTransactions: [],
    maintenanceLogs: [],
    createdTimestamp: now
  };

  const auditSha256 = generateTransportSeal(baseVehicle);
  return { ...baseVehicle, auditSha256 };
}

/**
 * Dispatch a fleet vehicle on a route trip
 * Enforces battery SoC >= 25% for EV and non-expired statutory certificates
 */
export function dispatchVehicleTrip(
  vehicle: TransportFleetVehicle,
  params: {
    routeName: string;
    expectedReturnTimestamp: string;
    passengerCount: number;
    purpose: TripDispatchRecord['purpose'];
    customDriver?: string;
    customDriverLicense?: string;
  }
): { success: boolean; vehicle: TransportFleetVehicle; error?: string } {
  // Check active availability
  if (vehicle.status !== 'AVAILABLE_ACTIVE') {
    return {
      success: false,
      vehicle,
      error: `Vehicle ${vehicle.registrationNumber} is not available (Current status: ${vehicle.status})`
    };
  }

  // Statutory certificate validation
  const compliance = checkStatutoryCompliance(vehicle);
  if (!compliance.isCompliant) {
    const updatedVehicle: TransportFleetVehicle = {
      ...vehicle,
      status: 'OUT_OF_SERVICE_FITNESS_EXPIRED'
    };
    return {
      success: false,
      vehicle: { ...updatedVehicle, auditSha256: generateTransportSeal(updatedVehicle) },
      error: `Statutory non-compliance: ${compliance.reasons.join('; ')}`
    };
  }

  // EV Battery check
  if (vehicle.fuelType === 'EV_BATTERY_ELECTRIC') {
    const currentSoc = vehicle.batterySocPercent ?? 0;
    if (currentSoc < MIN_EV_DISPATCH_SOC_PERCENT) {
      return {
        success: false,
        vehicle,
        error: `EV dispatch rejected: Battery SoC (${currentSoc}%) is below mandatory threshold (${MIN_EV_DISPATCH_SOC_PERCENT}%). Recharge required.`
      };
    }
  }

  const tripId = `TRP-RUN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();

  const newTrip: TripDispatchRecord = {
    tripId,
    vehicleId: vehicle.vehicleId,
    driverName: params.customDriver || vehicle.assignedDriver,
    driverLicenseNumber: params.customDriverLicense || vehicle.assignedDriverLicense,
    routeName: params.routeName,
    departureTimestamp: now,
    expectedReturnTimestamp: params.expectedReturnTimestamp,
    startOdometerKm: vehicle.odometerKm,
    passengerCount: params.passengerCount,
    purpose: params.purpose,
    status: 'IN_TRANSIT'
  };

  const updated: TransportFleetVehicle = {
    ...vehicle,
    status: 'ON_ROUTE_DISPATCHED',
    trips: [newTrip, ...vehicle.trips]
  };

  return {
    success: true,
    vehicle: { ...updated, auditSha256: generateTransportSeal(updated) }
  };
}

/**
 * Complete a vehicle trip, recording return odometer and calculating distance
 */
export function completeVehicleTrip(
  vehicle: TransportFleetVehicle,
  params: {
    tripId: string;
    endOdometerKm: number;
    remainingBatterySocPercent?: number;
    remainingFuelLevelPercent?: number;
  }
): { success: boolean; vehicle: TransportFleetVehicle; distanceKm: number; error?: string } {
  const tripIndex = vehicle.trips.findIndex(t => t.tripId === params.tripId);
  if (tripIndex === -1) {
    return { success: false, vehicle, distanceKm: 0, error: `Trip ${params.tripId} not found` };
  }

  const trip = vehicle.trips[tripIndex];
  if (trip.status !== 'IN_TRANSIT') {
    return { success: false, vehicle, distanceKm: 0, error: `Trip ${params.tripId} is already ${trip.status}` };
  }

  if (params.endOdometerKm < trip.startOdometerKm) {
    return { 
      success: false, 
      vehicle, 
      distanceKm: 0, 
      error: `Invalid odometer: End km (${params.endOdometerKm}) cannot be less than start km (${trip.startOdometerKm})` 
    };
  }

  const distanceKm = params.endOdometerKm - trip.startOdometerKm;
  const now = new Date().toISOString();

  const updatedTrip: TripDispatchRecord = {
    ...trip,
    actualReturnTimestamp: now,
    endOdometerKm: params.endOdometerKm,
    status: 'COMPLETED'
  };

  const updatedTrips = [...vehicle.trips];
  updatedTrips[tripIndex] = updatedTrip;

  const updated: TransportFleetVehicle = {
    ...vehicle,
    status: 'AVAILABLE_ACTIVE',
    odometerKm: params.endOdometerKm,
    batterySocPercent: params.remainingBatterySocPercent !== undefined ? params.remainingBatterySocPercent : vehicle.batterySocPercent,
    fuelLevelPercent: params.remainingFuelLevelPercent !== undefined ? params.remainingFuelLevelPercent : vehicle.fuelLevelPercent,
    trips: updatedTrips
  };

  return {
    success: true,
    vehicle: { ...updated, auditSha256: generateTransportSeal(updated) },
    distanceKm
  };
}

/**
 * Log a Fuel Card or EV Charging Station Dispensation Transaction
 * Detects fuel siphon or efficiency anomalies (> 25% worse than rated)
 */
export function logFuelCardTransaction(
  vehicle: TransportFleetVehicle,
  params: {
    fuelCardNumber: string;
    unitsDispensed: number; // Liters or kWh
    unitRateInr: number;
    odometerKm: number;
    dispenserStation: string;
    newSocOrFuelPercent?: number;
  }
): { 
  vehicle: TransportFleetVehicle; 
  transaction: FuelCardTransaction; 
  hasEfficiencyAnomaly: boolean; 
  observedEfficiency: number 
} {
  const totalAmountInr = Math.round(params.unitsDispensed * params.unitRateInr * 100) / 100;
  const now = new Date().toISOString();
  const transactionId = `FLX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const telemetryPayload = `${transactionId}|${vehicle.vehicleId}|${params.fuelCardNumber}|${params.unitsDispensed}|${params.odometerKm}|${now}`;
  const telemetrySha256 = createHash('sha256').update(telemetryPayload).digest('hex');

  const transaction: FuelCardTransaction = {
    transactionId,
    fuelCardNumber: params.fuelCardNumber,
    vehicleId: vehicle.vehicleId,
    unitsDispensed: params.unitsDispensed,
    unitRateInr: params.unitRateInr,
    totalAmountInr,
    odometerKm: params.odometerKm,
    dispenserStation: params.dispenserStation,
    timestamp: now,
    telemetrySha256
  };

  // Efficiency telemetry calculation
  let observedEfficiency = vehicle.ratedEfficiencyKmPerUnit;
  let hasEfficiencyAnomaly = false;

  if (vehicle.fuelTransactions.length > 0) {
    const lastTx = vehicle.fuelTransactions[0];
    const kmTraveled = params.odometerKm - lastTx.odometerKm;
    if (kmTraveled > 0 && params.unitsDispensed > 0) {
      observedEfficiency = Math.round((kmTraveled / params.unitsDispensed) * 100) / 100;
      // Anomaly threshold: 25% lower efficiency than rated
      if (observedEfficiency < vehicle.ratedEfficiencyKmPerUnit * 0.75) {
        hasEfficiencyAnomaly = true;
      }
    }
  }

  const updated: TransportFleetVehicle = {
    ...vehicle,
    odometerKm: Math.max(vehicle.odometerKm, params.odometerKm),
    batterySocPercent: vehicle.fuelType === 'EV_BATTERY_ELECTRIC' ? (params.newSocOrFuelPercent ?? 100) : vehicle.batterySocPercent,
    fuelLevelPercent: vehicle.fuelType !== 'EV_BATTERY_ELECTRIC' ? (params.newSocOrFuelPercent ?? 100) : vehicle.fuelLevelPercent,
    fuelTransactions: [transaction, ...vehicle.fuelTransactions]
  };

  return {
    vehicle: { ...updated, auditSha256: generateTransportSeal(updated) },
    transaction,
    hasEfficiencyAnomaly,
    observedEfficiency
  };
}

/**
 * Schedule or record a vehicle maintenance log
 */
export function recordMaintenanceLog(
  vehicle: TransportFleetVehicle,
  params: {
    type: MaintenanceType;
    serviceDate: string;
    odometerKm: number;
    costInr: number;
    serviceVendor: string;
    certificationNumber: string;
    notes: string;
    newFitnessExpiry?: string;
    newPucExpiry?: string;
  }
): TransportFleetVehicle {
  const maintenanceId = `MNT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const log: MaintenanceLog = {
    maintenanceId,
    vehicleId: vehicle.vehicleId,
    type: params.type,
    serviceDate: params.serviceDate,
    odometerKm: params.odometerKm,
    costInr: params.costInr,
    serviceVendor: params.serviceVendor,
    certificationNumber: params.certificationNumber,
    notes: params.notes
  };

  const updated: TransportFleetVehicle = {
    ...vehicle,
    lastServiceDate: params.serviceDate,
    nextServiceOdometerKm: params.odometerKm + 10000,
    fitnessExpiryDate: params.newFitnessExpiry || vehicle.fitnessExpiryDate,
    pucExpiryDate: params.newPucExpiry || vehicle.pucExpiryDate,
    status: 'AVAILABLE_ACTIVE',
    maintenanceLogs: [log, ...vehicle.maintenanceLogs]
  };

  return {
    ...updated,
    auditSha256: generateTransportSeal(updated)
  };
}

/**
 * Generate official CSV export of Central University Transport Fleet
 */
export function exportCampusTransportFleetCSV(vehicles: TransportFleetVehicle[]): string {
  const headers = [
    'Vehicle ID',
    'Registration Number',
    'Category',
    'Fuel Type',
    'Seating Capacity',
    'Odometer Km',
    'Battery SoC %',
    'Fuel Level %',
    'Status',
    'Assigned Driver',
    'Driver License',
    'Fitness Expiry',
    'PUC Expiry',
    'Total Completed Trips',
    'Total Fuel Spend INR',
    'Audit SHA-256'
  ];

  const rows = vehicles.map(v => {
    const completedTrips = v.trips.filter(t => t.status === 'COMPLETED').length;
    const totalFuelSpend = v.fuelTransactions.reduce((acc, tx) => acc + tx.totalAmountInr, 0);

    return [
      v.vehicleId,
      v.registrationNumber,
      v.category,
      v.fuelType,
      v.seatingCapacity,
      v.odometerKm,
      v.batterySocPercent ?? 'N/A',
      v.fuelLevelPercent ?? 'N/A',
      v.status,
      `"${v.assignedDriver}"`,
      v.assignedDriverLicense,
      v.fitnessExpiryDate,
      v.pucExpiryDate,
      completedTrips,
      totalFuelSpend.toFixed(2),
      v.auditSha256
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Sample initial dataset for Central Campus Transport Fleet
 */
export const SAMPLE_FLEET_VEHICLES: TransportFleetVehicle[] = [
  createFleetVehicle({
    registrationNumber: 'KA-01-EQ-9102',
    chassisNumber: 'MAT628491EKB00192',
    category: 'ELECTRIC_BUS_SHUTTLE',
    fuelType: 'EV_BATTERY_ELECTRIC',
    seatingCapacity: 45,
    initialOdometerKm: 14250,
    batterySocPercent: 88,
    ratedEfficiencyKmPerUnit: 1.15, // km/kWh
    pucExpiryDate: '2027-04-30',
    fitnessExpiryDate: '2027-03-31',
    insuranceExpiryDate: '2026-12-31',
    assignedDriver: 'Rameshwar Prasad',
    assignedDriverLicense: 'DL-KA-2012-0098124',
    assignedFuelCardNumber: 'FC-IOCL-EV-9102'
  }),
  createFleetVehicle({
    registrationNumber: 'KA-01-MB-3450',
    chassisNumber: 'MAT628491DSB00881',
    category: 'DIESEL_CAMPUS_BUS',
    fuelType: 'DIESEL',
    seatingCapacity: 52,
    initialOdometerKm: 48900,
    fuelLevelPercent: 72,
    ratedEfficiencyKmPerUnit: 4.2, // km/L
    pucExpiryDate: '2026-11-15',
    fitnessExpiryDate: '2027-01-20',
    insuranceExpiryDate: '2026-10-31',
    assignedDriver: 'Gurpreet Singh',
    assignedDriverLicense: 'DL-PB-2008-0043911',
    assignedFuelCardNumber: 'FC-HPCL-DSL-3450'
  }),
  createFleetVehicle({
    registrationNumber: 'KA-01-EM-1122',
    chassisNumber: 'WBA33AY899AMB0011',
    category: 'AMBULANCE_EMERGENCY',
    fuelType: 'DIESEL',
    seatingCapacity: 4,
    initialOdometerKm: 8200,
    fuelLevelPercent: 95,
    ratedEfficiencyKmPerUnit: 11.5,
    pucExpiryDate: '2027-06-30',
    fitnessExpiryDate: '2028-06-30',
    insuranceExpiryDate: '2027-05-15',
    assignedDriver: 'Dr. Sudhir Naik (Paramedic Lead)',
    assignedDriverLicense: 'DL-KA-2015-0012908',
    assignedFuelCardNumber: 'FC-BPCL-EMG-1122'
  })
];
