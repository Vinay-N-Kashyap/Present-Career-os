/**
 * Campus Events, Auditorium & Venue Scheduling Engine (TASK-921)
 * 
 * Provides:
 * 1. Multi-venue inventory (Auditoriums, Seminar Halls, Amphitheatres, Arenas).
 * 2. Strict spatial and temporal clash detection preventing double bookings.
 * 3. Seating capacity enforcement and CPCB noise pollution regulation checks.
 * 4. 4-Stage event governance lifecycle:
 *    REQUESTED -> FACULTY_ADVISOR_APPROVED -> ESTATE_OFFICE_SANCTIONED -> COMPLETED.
 * 5. Security escort & visitor gate pass generation for keynote speakers.
 * 6. NAAC Criterion 5.3 (Student Participation & Activities) CSV export.
 */

export type EventCategory = 
  | 'TECHNICAL_SYMPOSIUM' 
  | 'CULTURAL_FEST' 
  | 'ACADEMIC_CONFERENCE' 
  | 'HACKATHON' 
  | 'GUEST_KEYNOTE' 
  | 'SPORTS_TOURNAMENT';

export type EventStatus = 
  | 'REQUESTED' 
  | 'FACULTY_ADVISOR_APPROVED' 
  | 'ESTATE_OFFICE_SANCTIONED' 
  | 'REJECTED' 
  | 'COMPLETED';

export type VenueType = 'INDOOR_AUDITORIUM' | 'SEMINAR_HALL' | 'OPEN_AIR_AMPHITHEATRE' | 'INNOVATION_ARENA';

export interface CampusVenue {
  id: string; // VEN-[HEX6]
  institutionId: string;
  name: string;
  type: VenueType;
  seatingCapacity: number;
  avEquipment: string[];
  isAirConditioned: boolean;
  noisePermitRequired: boolean;
  locationBlock: string;
}

export interface CampusEvent {
  id: string; // EVT-[HEX8]
  institutionId: string;
  title: string;
  category: EventCategory;
  venueId: string;
  venueName: string;
  organizingClubOrDept: string;
  facultyAdvisorName: string;
  studentLeadName: string;
  startDateTime: string; // ISO String
  endDateTime: string;   // ISO String
  expectedAttendees: number;
  noiseClearanceObtained: boolean;
  keynoteSpeakers?: string[];
  visitorPassCodes?: string[];
  status: EventStatus;
  advisorEndorsementDate?: string;
  sanctionOrderNumber?: string;
  estateSanctionDate?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface EventGovernanceSummary {
  institutionId: string;
  totalVenues: number;
  totalEventsSanctioned: number;
  pendingApprovalsCount: number;
  activeKeynotesCount: number;
  averageAuditoriumUtilizationPercent: number;
}

// In-Memory Store
let venueStore: CampusVenue[] = [];
let eventStore: CampusEvent[] = [];

export function getVenues(institutionId: string): CampusVenue[] {
  return venueStore
    .filter(v => v.institutionId === institutionId)
    .map(v => ({ ...v, avEquipment: [...v.avEquipment] }));
}

export function getCampusEvents(
  institutionId: string,
  filter?: { status?: EventStatus; venueId?: string }
): CampusEvent[] {
  return eventStore
    .filter(e => e.institutionId === institutionId)
    .filter(e => !filter?.status || e.status === filter.status)
    .filter(e => !filter?.venueId || e.venueId === filter.venueId)
    .map(e => ({
      ...e,
      keynoteSpeakers: e.keynoteSpeakers ? [...e.keynoteSpeakers] : undefined,
      visitorPassCodes: e.visitorPassCodes ? [...e.visitorPassCodes] : undefined
    }));
}

export function registerVenue(venue: Omit<CampusVenue, 'id'> & { id?: string }): CampusVenue {
  const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase();
  const id = venue.id || `VEN-${hex}`;
  const newVenue: CampusVenue = {
    ...venue,
    id,
    avEquipment: [...venue.avEquipment]
  };
  venueStore.push(newVenue);
  return { ...newVenue };
}

export function checkTimeClash(
  venueId: string,
  startIso: string,
  endIso: string,
  excludeEventId?: string
): boolean {
  const reqStart = new Date(startIso).getTime();
  const reqEnd = new Date(endIso).getTime();

  return eventStore.some(e => {
    if (e.venueId !== venueId) return false;
    if (excludeEventId && e.id === excludeEventId) return false;
    if (e.status === 'REJECTED') return false;

    const eStart = new Date(e.startDateTime).getTime();
    const eEnd = new Date(e.endDateTime).getTime();

    // Overlapping condition: (StartA < EndB) and (EndA > StartB)
    return reqStart < eEnd && reqEnd > eStart;
  });
}

export function requestCampusEvent(params: {
  institutionId: string;
  title: string;
  category: EventCategory;
  venueId: string;
  organizingClubOrDept: string;
  facultyAdvisorName: string;
  studentLeadName: string;
  startDateTime: string;
  endDateTime: string;
  expectedAttendees: number;
  keynoteSpeakers?: string[];
}): { success: boolean; event?: CampusEvent; error?: string } {
  const venue = venueStore.find(v => v.id === params.venueId && v.institutionId === params.institutionId);
  if (!venue) {
    return { success: false, error: 'VENUE_NOT_FOUND: The specified campus venue does not exist.' };
  }

  // 1. Capacity Invariant
  if (params.expectedAttendees > venue.seatingCapacity) {
    return {
      success: false,
      error: `VENUE_CAPACITY_EXCEEDED: Requested attendees (${params.expectedAttendees}) exceeds venue capacity (${venue.seatingCapacity}).`
    };
  }

  // 2. Temporal Clash Invariant
  if (checkTimeClash(params.venueId, params.startDateTime, params.endDateTime)) {
    return {
      success: false,
      error: 'VENUE_CLASH_DETECTED: Another sanctioned or active event is already scheduled in this venue during the requested time slot.'
    };
  }

  // 3. Noise pollution regulations: Open air past 22:00 requires noise clearance
  const endHour = new Date(params.endDateTime).getHours();
  let noiseClearanceObtained = true;
  if (venue.type === 'OPEN_AIR_AMPHITHEATRE' && (endHour >= 22 || endHour < 6)) {
    // Flag potential violation if not explicitly managed
    noiseClearanceObtained = false;
  }

  const hex = Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
  const id = `EVT-${hex}`;

  // Generate visitor passes for keynote speakers if any
  const visitorPasses = params.keynoteSpeakers?.map((sp, idx) => {
    return `PASS-GATE-${hex.substring(0, 4)}-${idx + 1}`;
  });

  const newEvent: CampusEvent = {
    id,
    institutionId: params.institutionId,
    title: params.title,
    category: params.category,
    venueId: params.venueId,
    venueName: venue.name,
    organizingClubOrDept: params.organizingClubOrDept,
    facultyAdvisorName: params.facultyAdvisorName,
    studentLeadName: params.studentLeadName,
    startDateTime: params.startDateTime,
    endDateTime: params.endDateTime,
    expectedAttendees: params.expectedAttendees,
    noiseClearanceObtained,
    keynoteSpeakers: params.keynoteSpeakers ? [...params.keynoteSpeakers] : undefined,
    visitorPassCodes: visitorPasses,
    status: 'REQUESTED',
    createdAt: new Date().toISOString()
  };

  eventStore.push(newEvent);
  return { success: true, event: { ...newEvent } };
}

export function updateEventApprovalStatus(
  eventId: string,
  newStatus: EventStatus,
  options?: {
    rejectionReason?: string;
    sanctionOrderNumber?: string;
  }
): { success: boolean; event?: CampusEvent; error?: string } {
  const event = eventStore.find(e => e.id === eventId);
  if (!event) {
    return { success: false, error: 'EVENT_NOT_FOUND' };
  }

  event.status = newStatus;

  if (newStatus === 'FACULTY_ADVISOR_APPROVED') {
    event.advisorEndorsementDate = new Date().toISOString();
  } else if (newStatus === 'ESTATE_OFFICE_SANCTIONED') {
    event.estateSanctionDate = new Date().toISOString();
    event.sanctionOrderNumber = options?.sanctionOrderNumber || `SO-EVT-${Date.now().toString().slice(-6)}`;
  } else if (newStatus === 'REJECTED') {
    event.rejectionReason = options?.rejectionReason || 'Venue unavailable or administrative constraint';
  }

  return { success: true, event: { ...event } };
}

export function computeEventGovernanceSummary(institutionId: string): EventGovernanceSummary {
  const venues = getVenues(institutionId);
  const events = getCampusEvents(institutionId);

  const sanctioned = events.filter(e => e.status === 'ESTATE_OFFICE_SANCTIONED' || e.status === 'COMPLETED').length;
  const pending = events.filter(e => e.status === 'REQUESTED' || e.status === 'FACULTY_ADVISOR_APPROVED').length;
  
  let keynotesCount = 0;
  for (const e of events) {
    if (e.keynoteSpeakers && e.keynoteSpeakers.length > 0) {
      keynotesCount += e.keynoteSpeakers.length;
    }
  }

  // Calculate approximate venue utilization
  const totalCapacity = venues.reduce((acc, v) => acc + v.seatingCapacity, 0);
  const totalAttendeesSanctioned = events
    .filter(e => e.status === 'ESTATE_OFFICE_SANCTIONED')
    .reduce((acc, e) => acc + e.expectedAttendees, 0);

  const utilPercent = totalCapacity > 0 ? Math.min(100, Math.round((totalAttendeesSanctioned / totalCapacity) * 100)) : 0;

  return {
    institutionId,
    totalVenues: venues.length,
    totalEventsSanctioned: sanctioned,
    pendingApprovalsCount: pending,
    activeKeynotesCount: keynotesCount,
    averageAuditoriumUtilizationPercent: utilPercent
  };
}

export function exportCampusEventsCSV(institutionId: string): string {
  const events = getCampusEvents(institutionId);

  const lines: string[] = [];
  lines.push('=== NAAC CRITERION 5.3: STUDENT PARTICIPATION & CAMPUS EVENTS REGISTRY ===');
  lines.push('Event_ID,Title,Category,Venue,Club_Dept,Faculty_Advisor,Expected_Attendees,Start_Time,End_Time,Status,Sanction_Order,Speakers_Count');

  for (const e of events) {
    const spCount = e.keynoteSpeakers?.length || 0;
    lines.push(
      `"${e.id}","${e.title.replace(/"/g, '""')}","${e.category}","${e.venueName}","${e.organizingClubOrDept}","${e.facultyAdvisorName}",${e.expectedAttendees},"${e.startDateTime}","${e.endDateTime}","${e.status}","${e.sanctionOrderNumber || 'N/A'}",${spCount}`
    );
  }

  return lines.join('\n');
}

export function seedCampusEventData(institutionId: string): void {
  venueStore = [
    {
      id: 'VEN-MAIN-AUD',
      institutionId,
      name: 'Sir M. Visvesvaraya Grand Auditorium',
      type: 'INDOOR_AUDITORIUM',
      seatingCapacity: 1200,
      avEquipment: ['Dual 4K Laser Projectors', 'Line-Array Audio System', 'Dual Wireless Podiums', 'Multi-Cam Stream Rig'],
      isAirConditioned: true,
      noisePermitRequired: false,
      locationBlock: 'Central Administrative Complex, Ground Floor'
    },
    {
      id: 'VEN-RAMAN-HALL',
      institutionId,
      name: 'Dr. C.V. Raman Seminar Hall',
      type: 'SEMINAR_HALL',
      seatingCapacity: 300,
      avEquipment: ['Interactive Smart Board', 'Surround Sound', 'Podium Mic'],
      isAirConditioned: true,
      noisePermitRequired: false,
      locationBlock: 'Science & Engineering Tower, Block B'
    },
    {
      id: 'VEN-AMPHI-OPEN',
      institutionId,
      name: 'Open Air Cultural Amphitheatre',
      type: 'OPEN_AIR_AMPHITHEATRE',
      seatingCapacity: 2500,
      avEquipment: ['High-Output Stage Sound', 'Stage Floodlights', 'LED Video Wall'],
      isAirConditioned: false,
      noisePermitRequired: true,
      locationBlock: 'South Quadrangle Lakeside'
    }
  ];

  eventStore = [
    {
      id: 'EVT-7B9011FA',
      institutionId,
      title: 'Apex Annual National Hackathon: Smart India 2026',
      category: 'HACKATHON',
      venueId: 'VEN-MAIN-AUD',
      venueName: 'Sir M. Visvesvaraya Grand Auditorium',
      organizingClubOrDept: 'ACM Student Chapter & Dept of CSE',
      facultyAdvisorName: 'Dr. Aris Thorne',
      studentLeadName: 'Kunal Verma (3rd Year CSE)',
      startDateTime: '2026-11-10T09:00:00Z',
      endDateTime: '2026-11-11T18:00:00Z',
      expectedAttendees: 600,
      noiseClearanceObtained: true,
      keynoteSpeakers: ['Dr. Sudha Murthy (Chief Guest)', 'Sridhar Vembu (Keynote)'],
      visitorPassCodes: ['PASS-GATE-7B90-1', 'PASS-GATE-7B90-2'],
      status: 'ESTATE_OFFICE_SANCTIONED',
      advisorEndorsementDate: '2026-10-01T10:00:00Z',
      sanctionOrderNumber: 'SO-EVT-889012',
      estateSanctionDate: '2026-10-03T14:30:00Z',
      createdAt: '2026-09-30T11:00:00Z'
    },
    {
      id: 'EVT-7B9011FB',
      institutionId,
      title: 'Global AI & Autonomous Agents Research Symposium',
      category: 'ACADEMIC_CONFERENCE',
      venueId: 'VEN-RAMAN-HALL',
      venueName: 'Dr. C.V. Raman Seminar Hall',
      organizingClubOrDept: 'Dept of Artificial Intelligence',
      facultyAdvisorName: 'Dr. Evelyn Zhang',
      studentLeadName: 'Rhea Pillai (M.Tech AI)',
      startDateTime: '2026-11-15T10:00:00Z',
      endDateTime: '2026-11-15T17:00:00Z',
      expectedAttendees: 250,
      noiseClearanceObtained: true,
      keynoteSpeakers: ['Prof. Yoshua Bengio (Virtual Keynote)'],
      visitorPassCodes: ['PASS-GATE-7B91-1'],
      status: 'FACULTY_ADVISOR_APPROVED',
      advisorEndorsementDate: '2026-10-05T12:00:00Z',
      createdAt: '2026-10-04T09:30:00Z'
    }
  ];
}

export function resetCampusEventStore(): void {
  venueStore = [];
  eventStore = [];
}
