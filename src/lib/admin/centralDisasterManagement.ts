/**
 * Central University Disaster Management, Fire Safety & Campus Evacuation Protocol Engine
 * 
 * Statutory & Regulatory Framework:
 * - Disaster Management Act 2005 (DMA 2005) & National Disaster Management Authority (NDMA) Guidelines
 * - National Building Code of India (NBC 2016 Part 4: Fire and Life Safety Standards)
 * - State Fire Service Acts & Directorate of Fire and Emergency Services Periodic NOC Norms
 * - Ministry of Education SOP on Safety and Security of Students in Higher Educational Institutions
 * - Hazardous Materials & Chemical Emergency Response Guidelines (OSHA / Central Pollution Control Board)
 */

import { createHash } from 'crypto';

export type HazardCategory = 
  | 'FIRE_HAZARD'
  | 'CHEMICAL_BIO_SPILL'
  | 'SEISMIC_EARTHQUAKE'
  | 'CYCLONE_FLOOD_WEATHER'
  | 'CIVIL_UNREST_ACTIVE_THREAT';

export type CampusThreatLevel = 
  | 'NORMAL_MONITORED'
  | 'LEVEL_1_LOCALIZED_ALERT'
  | 'LEVEL_2_BUILDING_EVACUATION'
  | 'LEVEL_3_CAMPUS_WIDE_DISASTER';

export type DrillType = 
  | 'ANNUAL_CAMPUS_EVACUATION_DRILL'
  | 'LAB_CHEMICAL_SPILL_CONTAINMENT'
  | 'HOSTEL_NIGHT_FIRE_SIMULATION'
  | 'EARTHQUAKE_DROP_COVER_HOLD';

export interface MusterPointHeadcount {
  musterPointId: string; // e.g. "MUSTER-NORTH-SPORTS-GROUND"
  musterPointName: string;
  designatedZone: string;
  expectedHeadcount: number;
  evacuatedHeadcount: number;
  unaccountedPersons: number;
  isZoneClear: boolean;
  clearanceOfficer: string;
}

export interface DisasterIncidentRecord {
  incidentId: string; // Token format: DSM-[YEAR]-[HAZ]-[HEX6]
  incidentTimestamp: string;
  hazardCategory: HazardCategory;
  threatLevel: CampusThreatLevel;
  primaryLocation: string;
  reportingOfficer: string;
  sirenTriggered: boolean;
  massAlertDispatched: boolean;
  fireNocValidUntil: string;
  musterHeadcounts: MusterPointHeadcount[];
  casualtyCount: number;
  incidentStatus: 'ACTIVE_EMERGENCY' | 'CONTAINMENT_IN_PROGRESS' | 'ALL_CLEAR_RECOVERED';
  remedialActionsTaken: string[];
  createdTimestamp: string;
  auditSha256: string;
}

export interface FireEquipmentInspection {
  inspectionId: string;
  equipmentType: 'ABC_DRY_POWDER' | 'CO2_EXTINGUISHER' | 'FIRE_HYDRANT' | 'SMOKE_DETECTOR_LOOP';
  locationTag: string;
  lastHydrotestDate: string;
  nextHydrotestDueDate: string;
  pressureGaugePsi: number;
  isOperationallyReady: boolean;
  inspectorName: string;
}

// Statutory Standards
export const MIN_ACCEPTABLE_HYDRANT_PRESSURE_PSI = 45;
export const MAX_EVACUATION_TIME_MINUTES = 8; // NDMA benchmark for university academic blocks

/**
 * Generate cryptographic SHA-256 seal for Disaster Management record
 */
export function generateDisasterSeal(record: Omit<DisasterIncidentRecord, 'auditSha256'>): string {
  const musterSummary = record.musterHeadcounts
    .map(m => `${m.musterPointId}:${m.evacuatedHeadcount}:${m.unaccountedPersons}:${m.isZoneClear}`)
    .join(';');

  const payload = [
    record.incidentId,
    record.hazardCategory,
    record.threatLevel,
    record.primaryLocation,
    record.sirenTriggered,
    record.massAlertDispatched,
    musterSummary,
    record.incidentStatus,
    record.casualtyCount
  ].join('|');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Format statutory unique Disaster Incident tracking token
 */
export function formatDisasterRecordId(hazard: HazardCategory, year: number = 2026): string {
  const hazCode = hazard.substring(0, 4).toUpperCase();
  const hex = createHash('sha256')
    .update(`${hazard}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();
  return `DSM-${year}-${hazCode}-${hex}`;
}

/**
 * Log a new Campus Disaster Incident or Emergency Drill
 */
export function logDisasterIncident(params: {
  hazardCategory: HazardCategory;
  threatLevel: CampusThreatLevel;
  primaryLocation: string;
  reportingOfficer: string;
  sirenTriggered?: boolean;
  massAlertDispatched?: boolean;
  fireNocValidUntil?: string;
  musterHeadcounts?: MusterPointHeadcount[];
  year?: number;
}): DisasterIncidentRecord {
  const incidentId = formatDisasterRecordId(params.hazardCategory, params.year);
  const now = new Date().toISOString();

  const defaultMuster: MusterPointHeadcount[] = [
    {
      musterPointId: 'MUSTER-01',
      musterPointName: 'Main University Stadium Ground',
      designatedZone: 'North Academic Quadrant',
      expectedHeadcount: 450,
      evacuatedHeadcount: 450,
      unaccountedPersons: 0,
      isZoneClear: true,
      clearanceOfficer: 'Capt. R. Deshmukh (Chief Security Officer)'
    },
    {
      musterPointId: 'MUSTER-02',
      musterPointName: 'Tagore Amphitheatre Open Lawn',
      designatedZone: 'South Hostel Complex',
      expectedHeadcount: 320,
      evacuatedHeadcount: 320,
      unaccountedPersons: 0,
      isZoneClear: true,
      clearanceOfficer: 'Insp. V. Saxena (Hostel Safety Warden)'
    }
  ];

  const baseRecord: Omit<DisasterIncidentRecord, 'auditSha256'> = {
    incidentId,
    incidentTimestamp: now,
    hazardCategory: params.hazardCategory,
    threatLevel: params.threatLevel,
    primaryLocation: params.primaryLocation,
    reportingOfficer: params.reportingOfficer,
    sirenTriggered: params.sirenTriggered ?? (params.threatLevel === 'LEVEL_3_CAMPUS_WIDE_DISASTER' || params.threatLevel === 'LEVEL_2_BUILDING_EVACUATION'),
    massAlertDispatched: params.massAlertDispatched ?? (params.threatLevel !== 'NORMAL_MONITORED'),
    fireNocValidUntil: params.fireNocValidUntil || '2027-03-31',
    musterHeadcounts: params.musterHeadcounts || defaultMuster,
    casualtyCount: 0,
    incidentStatus: params.threatLevel === 'NORMAL_MONITORED' ? 'ALL_CLEAR_RECOVERED' : 'ACTIVE_EMERGENCY',
    remedialActionsTaken: [
      `Automated incident logging at ${now}`,
      `Security Command Center alerted for ${params.primaryLocation}`
    ],
    createdTimestamp: now
  };

  const auditSha256 = generateDisasterSeal(baseRecord);
  return { ...baseRecord, auditSha256 };
}

/**
 * Update muster point evacuation headcount and mark zone clearance
 */
export function updateMusterHeadcount(
  record: DisasterIncidentRecord,
  musterPointId: string,
  params: {
    evacuatedHeadcount: number;
    unaccountedPersons: number;
    isZoneClear: boolean;
  }
): DisasterIncidentRecord {
  const musterIdx = record.musterHeadcounts.findIndex(m => m.musterPointId === musterPointId);
  if (musterIdx === -1) {
    throw new Error(`Muster point ${musterPointId} not found in incident ${record.incidentId}`);
  }

  const updatedMuster = [...record.musterHeadcounts];
  updatedMuster[musterIdx] = {
    ...updatedMuster[musterIdx],
    evacuatedHeadcount: params.evacuatedHeadcount,
    unaccountedPersons: params.unaccountedPersons,
    isZoneClear: params.isZoneClear
  };

  const allClear = updatedMuster.every(m => m.isZoneClear && m.unaccountedPersons === 0);

  const updated: DisasterIncidentRecord = {
    ...record,
    musterHeadcounts: updatedMuster,
    incidentStatus: allClear ? 'CONTAINMENT_IN_PROGRESS' : record.incidentStatus
  };

  return { ...updated, auditSha256: generateDisasterSeal(updated) };
}

/**
 * Issue All-Clear Declaration and archive disaster response
 */
export function issueAllClearDeclaration(
  record: DisasterIncidentRecord,
  officerName: string,
  remedialSummary: string
): DisasterIncidentRecord {
  const updated: DisasterIncidentRecord = {
    ...record,
    threatLevel: 'NORMAL_MONITORED',
    incidentStatus: 'ALL_CLEAR_RECOVERED',
    remedialActionsTaken: [
      ...record.remedialActionsTaken,
      `ALL-CLEAR officially sanctioned by ${officerName}: ${remedialSummary}`
    ]
  };

  return { ...updated, auditSha256: generateDisasterSeal(updated) };
}

/**
 * Inspect and certify fire safety equipment readiness
 */
export function inspectFireEquipment(params: {
  equipmentType: FireEquipmentInspection['equipmentType'];
  locationTag: string;
  pressureGaugePsi: number;
  inspectorName: string;
}): FireEquipmentInspection {
  const isReady = params.pressureGaugePsi >= MIN_ACCEPTABLE_HYDRANT_PRESSURE_PSI;
  const now = new Date();
  const nextDue = new Date(now);
  nextDue.setFullYear(nextDue.getFullYear() + 1);

  return {
    inspectionId: `F-EQ-${Date.now().toString().slice(-6)}`,
    equipmentType: params.equipmentType,
    locationTag: params.locationTag,
    lastHydrotestDate: now.toISOString().split('T')[0],
    nextHydrotestDueDate: nextDue.toISOString().split('T')[0],
    pressureGaugePsi: params.pressureGaugePsi,
    isOperationallyReady: isReady,
    inspectorName: params.inspectorName
  };
}

/**
 * Export official CSV of Disaster Management & Emergency Response Ledger
 */
export function exportDisasterManagementCSV(records: DisasterIncidentRecord[]): string {
  const headers = [
    'Incident ID',
    'Timestamp',
    'Hazard Category',
    'Threat Level',
    'Primary Location',
    'Reporting Officer',
    'Siren Triggered',
    'Mass Alert Dispatched',
    'Total Evacuated',
    'Total Unaccounted',
    'Incident Status',
    'Audit SHA-256'
  ];

  const rows = records.map(r => {
    const totalEvac = r.musterHeadcounts.reduce((acc, m) => acc + m.evacuatedHeadcount, 0);
    const totalUnacc = r.musterHeadcounts.reduce((acc, m) => acc + m.unaccountedPersons, 0);

    return [
      r.incidentId,
      r.incidentTimestamp,
      r.hazardCategory,
      r.threatLevel,
      `"${r.primaryLocation}"`,
      `"${r.reportingOfficer}"`,
      r.sirenTriggered ? 'YES' : 'NO',
      r.massAlertDispatched ? 'YES' : 'NO',
      totalEvac,
      totalUnacc,
      r.incidentStatus,
      r.auditSha256
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Sample initial dataset for Disaster Management
 */
export const SAMPLE_DISASTER_INCIDENTS: DisasterIncidentRecord[] = [
  logDisasterIncident({
    hazardCategory: 'FIRE_HAZARD',
    threatLevel: 'LEVEL_2_BUILDING_EVACUATION',
    primaryLocation: 'Chemistry Wing - 2nd Floor Organic Synthesis Lab',
    reportingOfficer: 'Prof. Anirudh Banerji (Lab Safety Officer)',
    sirenTriggered: true,
    massAlertDispatched: true
  }),
  logDisasterIncident({
    hazardCategory: 'SEISMIC_EARTHQUAKE',
    threatLevel: 'NORMAL_MONITORED',
    primaryLocation: 'Campus-wide Annual Evacuation Drill',
    reportingOfficer: 'Capt. R. Deshmukh (Chief Security Officer)',
    sirenTriggered: true,
    massAlertDispatched: true
  })
];

export const SAMPLE_FIRE_EQUIPMENT: FireEquipmentInspection[] = [
  inspectFireEquipment({
    equipmentType: 'FIRE_HYDRANT',
    locationTag: 'Central Admin Building - North Riser #4',
    pressureGaugePsi: 65,
    inspectorName: 'Station Officer K. Verma (Delhi Fire Service)'
  }),
  inspectFireEquipment({
    equipmentType: 'CO2_EXTINGUISHER',
    locationTag: 'High Performance Computing Cluster Data Center',
    pressureGaugePsi: 58,
    inspectorName: 'Station Officer K. Verma (Delhi Fire Service)'
  })
];
