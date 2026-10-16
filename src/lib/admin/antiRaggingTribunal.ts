/**
 * University Anti-Ragging Cell & Disciplinary Tribunal Engine (TASK-916)
 * 
 * Provides:
 * 1. Statutory Supreme Court & UGC 2009 Anti-Ragging Regulations enforcement.
 * 2. Zero-tolerance incident reporting with anonymous whistleblower token hashing (ARC-[HEX10]).
 * 3. Anti-Ragging Squad (ARS) emergency patrol dispatching and zone containment.
 * 4. Disciplinary tribunal punitive sanctions (Suspension, Semester Rustication, Expulsion & FIR).
 * 5. Statutory 7-day Action Taken Report (ATR) watchdog and UGC Monitoring Agency CSV export.
 */

export type RaggingCategory = 'VERBAL_ABUSE' | 'PSYCHOLOGICAL_INTIMIDATION' | 'PHYSICAL_ASSAULT' | 'FINANCIAL_EXTORTION' | 'GROSS_HUMILIATION';
export type TribunalSanction = 'NONE' | 'WARNING_WITH_APOLOGY' | 'HOSTEL_EVICTION' | 'SEMESTER_RUSTICATION' | 'EXPULSION_AND_FIR_LODGED';
export type IncidentStage = 'LODGED' | 'SQUAD_INVESTIGATING' | 'TRIBUNAL_HEARING_SCHEDULED' | 'SANCTION_PRONOUNCED' | 'FIR_LODGED' | 'CLOSED';

export interface AntiRaggingIncident {
  id: string; // Token format: ARC-[HEX10]
  institutionId: string;
  category: RaggingCategory;
  location: string; // e.g. "Aryabhata Boys Hostel Block B 3rd Floor"
  incidentTimestamp: string;
  isAnonymous: boolean;
  complainantHash: string; // SHA-256 hash or pseudonym
  accusedStudentIds: string[];
  accusedStudentNames: string[];
  witnessNames: string[];
  description: string;
  stage: IncidentStage;
  assignedSquadOfficer?: string;
  tribunalHearingDate?: string;
  pronouncement?: TribunalSanction;
  firNumber?: string;
  policeStationName?: string;
  actionTakenReportNotes?: string;
  statutorySlaDeadline: string; // 7 days from lodging
  isSlaViolated: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface AntiRaggingTribunalSummary {
  institutionId: string;
  totalIncidentsLodged: number;
  activeInvestigations: number;
  tribunalHearingsPending: number;
  severePunitiveSanctions: number;
  firLodgedCount: number;
  slaCompliancePercent: number;
}

// In-Memory Data Store
let incidentStore: AntiRaggingIncident[] = [];

export function getIncidents(institutionId: string): AntiRaggingIncident[] {
  return incidentStore
    .filter(i => i.institutionId === institutionId)
    .map(i => ({
      ...i,
      accusedStudentIds: [...i.accusedStudentIds],
      accusedStudentNames: [...i.accusedStudentNames],
      witnessNames: [...i.witnessNames]
    }));
}

export function lodgeAntiRaggingIncident(params: {
  institutionId: string;
  category: RaggingCategory;
  location: string;
  incidentTimestamp: string;
  isAnonymous: boolean;
  complainantIdentifier: string; // Name or Anonymous token
  accusedStudentIds: string[];
  accusedStudentNames: string[];
  witnessNames?: string[];
  description: string;
}): AntiRaggingIncident {
  const hex = Math.floor(Math.random() * 0xFFFFFFFFFF).toString(16).padStart(10, '0').toUpperCase();
  const id = `ARC-${hex}`;
  const now = new Date();
  const slaDeadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const newIncident: AntiRaggingIncident = {
    id,
    institutionId: params.institutionId,
    category: params.category,
    location: params.location,
    incidentTimestamp: params.incidentTimestamp,
    isAnonymous: params.isAnonymous,
    complainantHash: params.isAnonymous ? `ANON-${hex.substring(0, 6)}` : params.complainantIdentifier,
    accusedStudentIds: [...params.accusedStudentIds],
    accusedStudentNames: [...params.accusedStudentNames],
    witnessNames: params.witnessNames ? [...params.witnessNames] : [],
    description: params.description,
    stage: 'LODGED',
    statutorySlaDeadline: slaDeadline,
    isSlaViolated: false,
    createdAt: now.toISOString()
  };

  incidentStore.push(newIncident);
  return { ...newIncident };
}

export function advanceIncidentStage(
  incidentId: string,
  nextStage: IncidentStage,
  options?: {
    squadOfficer?: string;
    hearingDate?: string;
    sanction?: TribunalSanction;
    firNumber?: string;
    policeStation?: string;
    atrNotes?: string;
  }
): { success: boolean; incident?: AntiRaggingIncident; error?: string } {
  const incident = incidentStore.find(i => i.id === incidentId);
  if (!incident) return { success: false, error: 'INCIDENT_NOT_FOUND' };

  incident.stage = nextStage;

  if (options?.squadOfficer) {
    incident.assignedSquadOfficer = options.squadOfficer;
  }
  if (options?.hearingDate) {
    incident.tribunalHearingDate = options.hearingDate;
  }
  if (options?.sanction) {
    incident.pronouncement = options.sanction;
  }
  if (options?.firNumber) {
    incident.firNumber = options.firNumber;
    incident.policeStationName = options.policeStation || 'District Police Station';
  }
  if (options?.atrNotes) {
    incident.actionTakenReportNotes = options.atrNotes;
  }

  if (nextStage === 'CLOSED' || nextStage === 'SANCTION_PRONOUNCED' || nextStage === 'FIR_LODGED') {
    incident.resolvedAt = new Date().toISOString();
  }

  return { success: true, incident: { ...incident } };
}

export function evaluateSlaCompliance(institutionId: string, currentTimestamp: string): AntiRaggingIncident[] {
  const violated: AntiRaggingIncident[] = [];
  const currentMs = new Date(currentTimestamp).getTime();

  for (const inc of incidentStore) {
    if (inc.institutionId === institutionId && inc.stage !== 'CLOSED' && inc.stage !== 'SANCTION_PRONOUNCED') {
      const deadlineMs = new Date(inc.statutorySlaDeadline).getTime();
      if (currentMs > deadlineMs) {
        inc.isSlaViolated = true;
        violated.push({ ...inc });
      }
    }
  }

  return violated;
}

export function computeTribunalSummary(institutionId: string): AntiRaggingTribunalSummary {
  const incidents = getIncidents(institutionId);

  const active = incidents.filter(i => i.stage === 'LODGED' || i.stage === 'SQUAD_INVESTIGATING').length;
  const hearings = incidents.filter(i => i.stage === 'TRIBUNAL_HEARING_SCHEDULED').length;
  const severe = incidents.filter(i =>
    i.pronouncement === 'SEMESTER_RUSTICATION' ||
    i.pronouncement === 'EXPULSION_AND_FIR_LODGED' ||
    i.pronouncement === 'HOSTEL_EVICTION'
  ).length;
  const firs = incidents.filter(i => i.firNumber !== undefined || i.stage === 'FIR_LODGED').length;
  const violated = incidents.filter(i => i.isSlaViolated).length;
  const compliance = incidents.length > 0 ? Math.round(((incidents.length - violated) / incidents.length) * 100) : 100;

  return {
    institutionId,
    totalIncidentsLodged: incidents.length,
    activeInvestigations: active,
    tribunalHearingsPending: hearings,
    severePunitiveSanctions: severe,
    firLodgedCount: firs,
    slaCompliancePercent: compliance
  };
}

export function exportAntiRaggingATRReportCSV(institutionId: string): string {
  const incidents = getIncidents(institutionId);

  const lines: string[] = [];
  lines.push('=== UGC ANTI-RAGGING STATUTORY ACTION TAKEN REPORT (ATR) ===');
  lines.push('Case_Token,Category,Location,Incident_Date,Is_Anonymous,Accused_Students,Stage,Hearing_Date,Sanction,FIR_Number,Police_Station,SLA_Violated');

  for (const i of incidents) {
    const accused = i.accusedStudentNames.join('; ');
    lines.push(
      `"${i.id}","${i.category}","${i.location.replace(/"/g, '""')}","${i.incidentTimestamp}",${i.isAnonymous ? 'YES' : 'NO'},"${accused}","${i.stage}","${i.tribunalHearingDate || 'N/A'}","${i.pronouncement || 'PENDING'}","${i.firNumber || 'N/A'}","${i.policeStationName || 'N/A'}",${i.isSlaViolated ? 'YES' : 'NO'}`
    );
  }

  return lines.join('\n');
}

export function seedAntiRaggingData(institutionId: string): void {
  incidentStore = [
    {
      id: 'ARC-A4918B091F',
      institutionId,
      category: 'PSYCHOLOGICAL_INTIMIDATION',
      location: 'Junior Boys Hostel Quadrangle Block 2',
      incidentTimestamp: '2026-09-10T22:30:00Z',
      isAnonymous: true,
      complainantHash: 'ANON-A4918B',
      accusedStudentIds: ['STU-SR-801', 'STU-SR-802'],
      accusedStudentNames: ['Karthik Reddy (Senior)', 'Rishabh Mehta (Senior)'],
      witnessNames: ['Anonymous Fresher 1', 'Anonymous Fresher 2'],
      description: 'First-year students forced to stand outside rooms late night and recite senior names under duress.',
      stage: 'SANCTION_PRONOUNCED',
      assignedSquadOfficer: 'Prof. Ramesh Kulkarni (Warden)',
      tribunalHearingDate: '2026-09-12T15:00:00Z',
      pronouncement: 'HOSTEL_EVICTION',
      actionTakenReportNotes: 'Both accused evicted from campus hostels for the academic year; parents notified.',
      statutorySlaDeadline: '2026-09-17T22:30:00Z',
      isSlaViolated: false,
      createdAt: '2026-09-10T23:00:00Z',
      resolvedAt: '2026-09-13T10:00:00Z'
    }
  ];
}

export function resetAntiRaggingStore(): void {
  incidentStore = [];
}
