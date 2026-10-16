/**
 * Hostels & Campus Housing Facility Allocation Engine (TASK-903)
 * 
 * Provides:
 * 1. Gender-segregated and co-ed residential facility management (Blocks, Floors, Rooms, Beds).
 * 2. Room allocation invariants (Gender policy enforcement, capacity limits, single-room allocation per student).
 * 3. Resident maintenance ticketing system (Plumbing, Electrical, Carpentry, HVAC, Wi-Fi) with priority SLAs.
 * 4. Night-out passes and curfew compliance engine with parental consent verification and overdue tracking.
 * 5. Occupancy rate analytics and statutory campus facility CSV exports.
 */

export type GenderPolicy = 'MALE' | 'FEMALE' | 'CO_ED_RESIDENCE';
export type RoomType = 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'FOUR_SHARING';
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
export type MaintenanceCategory = 'PLUMBING' | 'ELECTRICAL' | 'CARPENTRY' | 'CLEANLINESS' | 'HVAC_WIFI';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
export type NightPassStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'CHECKED_OUT' | 'RETURNED' | 'OVERDUE';
export type StudentGender = 'MALE' | 'FEMALE' | 'OTHER';

export interface HostelBlock {
  id: string;
  institutionId: string;
  name: string; // e.g. "Aryabhata Hall of Residence"
  code: string; // e.g. "BH-1"
  genderPolicy: GenderPolicy;
  totalFloors: number;
  totalRooms: number;
  wardenName: string;
  wardenContact: string;
  emergencyExtension: string;
  curfewTime: string; // "21:30"
}

export interface RoomOccupant {
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  gender: StudentGender;
  allocatedAt: string;
}

export interface HostelRoom {
  id: string;
  institutionId: string;
  blockId: string;
  roomNumber: string; // e.g. "BH1-204"
  floor: number;
  roomType: RoomType;
  capacity: number;
  occupants: RoomOccupant[];
  amenities: string[];
  feePerSemesterINR: number;
  status: RoomStatus;
}

export interface MaintenanceTicket {
  id: string;
  institutionId: string;
  blockId: string;
  roomNumber: string;
  reportedByStudentId: string;
  reportedByStudentName: string;
  category: MaintenanceCategory;
  priority: TicketPriority;
  description: string;
  status: TicketStatus;
  assignedTechnician?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface NightOutPass {
  id: string;
  institutionId: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  destination: string;
  parentConsentVerified: boolean;
  departureTimestamp: string;
  expectedReturnTimestamp: string;
  actualReturnTimestamp?: string;
  status: NightPassStatus;
  approverWarden?: string;
  createdAt: string;
}

export interface HostelOccupancySummary {
  institutionId: string;
  totalBlocks: number;
  totalCapacityBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  occupancyRate: number; // 0 - 100%
  openMaintenanceTickets: number;
  pendingNightPasses: number;
}

// In-Memory Data Store
let blocksStore: HostelBlock[] = [];
let roomsStore: HostelRoom[] = [];
let ticketsStore: MaintenanceTicket[] = [];
let passesStore: NightOutPass[] = [];

export function getBlocks(institutionId: string): HostelBlock[] {
  return blocksStore
    .filter(b => b.institutionId === institutionId)
    .map(b => ({ ...b }));
}

export function getRooms(institutionId: string, blockId?: string): HostelRoom[] {
  return roomsStore
    .filter(r => r.institutionId === institutionId && (!blockId || r.blockId === blockId))
    .map(r => ({
      ...r,
      occupants: r.occupants.map(o => ({ ...o }))
    }));
}

export function allocateRoomBed(params: {
  institutionId: string;
  roomId: string;
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  gender: StudentGender;
}): { success: boolean; error?: string; room?: HostelRoom } {
  const room = roomsStore.find(r => r.id === params.roomId && r.institutionId === params.institutionId);
  if (!room) {
    return { success: false, error: 'ROOM_NOT_FOUND' };
  }

  const block = blocksStore.find(b => b.id === room.blockId && b.institutionId === params.institutionId);
  if (!block) {
    return { success: false, error: 'HOSTEL_BLOCK_NOT_FOUND' };
  }

  // 1. Gender Policy Invariant
  if (block.genderPolicy === 'MALE' && params.gender !== 'MALE') {
    return { success: false, error: 'GENDER_POLICY_VIOLATION: Cannot allocate female student to male hostel' };
  }
  if (block.genderPolicy === 'FEMALE' && params.gender !== 'FEMALE') {
    return { success: false, error: 'GENDER_POLICY_VIOLATION: Cannot allocate male student to female hostel' };
  }

  // 2. Capacity Invariant
  if (room.occupants.length >= room.capacity) {
    return { success: false, error: 'ROOM_CAPACITY_EXCEEDED' };
  }

  if (room.status === 'MAINTENANCE') {
    return { success: false, error: 'ROOM_UNDER_MAINTENANCE' };
  }

  // 3. Duplicate Allocation Invariant
  const existingAllocation = roomsStore.find(r =>
    r.institutionId === params.institutionId &&
    r.occupants.some(o => o.studentId === params.studentId)
  );
  if (existingAllocation) {
    return { success: false, error: `STUDENT_ALREADY_ALLOCATED: Currently in room ${existingAllocation.roomNumber}` };
  }

  const newOccupant: RoomOccupant = {
    studentId: params.studentId,
    studentName: params.studentName,
    enrollmentNumber: params.enrollmentNumber,
    gender: params.gender,
    allocatedAt: new Date().toISOString()
  };

  room.occupants.push(newOccupant);
  if (room.occupants.length >= room.capacity) {
    room.status = 'OCCUPIED';
  } else {
    room.status = 'AVAILABLE';
  }

  return { success: true, room: { ...room, occupants: room.occupants.map(o => ({ ...o })) } };
}

export function vacateRoomBed(institutionId: string, roomId: string, studentId: string): boolean {
  const room = roomsStore.find(r => r.id === roomId && r.institutionId === institutionId);
  if (!room) return false;

  const initialLen = room.occupants.length;
  room.occupants = room.occupants.filter(o => o.studentId !== studentId);
  if (room.occupants.length < initialLen) {
    if (room.status !== 'MAINTENANCE') {
      room.status = 'AVAILABLE';
    }
    return true;
  }
  return false;
}

export function createMaintenanceTicket(params: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'status'>): MaintenanceTicket {
  const newTicket: MaintenanceTicket = {
    ...params,
    id: `TCK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: 'OPEN',
    createdAt: new Date().toISOString()
  };
  ticketsStore.push(newTicket);
  return { ...newTicket };
}

export function updateMaintenanceTicketStatus(
  id: string,
  status: TicketStatus,
  assignedTechnician?: string
): MaintenanceTicket | null {
  const ticket = ticketsStore.find(t => t.id === id);
  if (!ticket) return null;

  ticket.status = status;
  if (assignedTechnician) {
    ticket.assignedTechnician = assignedTechnician;
  }
  if (status === 'RESOLVED') {
    ticket.resolvedAt = new Date().toISOString();
  }
  return { ...ticket };
}

export function getMaintenanceTickets(institutionId: string, status?: TicketStatus): MaintenanceTicket[] {
  return ticketsStore
    .filter(t => t.institutionId === institutionId && (!status || t.status === status))
    .map(t => ({ ...t }));
}

export function requestNightOutPass(params: Omit<NightOutPass, 'id' | 'createdAt' | 'status'>): NightOutPass {
  const newPass: NightOutPass = {
    ...params,
    id: `NOP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: 'REQUESTED',
    createdAt: new Date().toISOString()
  };
  passesStore.push(newPass);
  return { ...newPass };
}

export function approveNightOutPass(
  passId: string,
  approverWarden: string,
  parentConsentVerified: boolean
): { success: boolean; pass?: NightOutPass; error?: string } {
  const pass = passesStore.find(p => p.id === passId);
  if (!pass) return { success: false, error: 'PASS_NOT_FOUND' };

  if (!parentConsentVerified) {
    return { success: false, error: 'PARENTAL_CONSENT_REQUIRED' };
  }

  pass.parentConsentVerified = true;
  pass.approverWarden = approverWarden;
  pass.status = 'APPROVED';
  return { success: true, pass: { ...pass } };
}

export function checkoutNightPass(passId: string): boolean {
  const pass = passesStore.find(p => p.id === passId);
  if (!pass || pass.status !== 'APPROVED') return false;

  pass.status = 'CHECKED_OUT';
  return true;
}

export function recordNightPassReturn(passId: string, returnTimestamp?: string): boolean {
  const pass = passesStore.find(p => p.id === passId);
  if (!pass || (pass.status !== 'CHECKED_OUT' && pass.status !== 'OVERDUE')) return false;

  pass.actualReturnTimestamp = returnTimestamp || new Date().toISOString();
  pass.status = 'RETURNED';
  return true;
}

export function checkAndFlagOverduePasses(institutionId: string, currentTimestamp: string): NightOutPass[] {
  const overdue: NightOutPass[] = [];
  const currentTime = new Date(currentTimestamp).getTime();

  for (const pass of passesStore) {
    if (pass.institutionId === institutionId && pass.status === 'CHECKED_OUT') {
      const expectedTime = new Date(pass.expectedReturnTimestamp).getTime();
      if (currentTime > expectedTime) {
        pass.status = 'OVERDUE';
        overdue.push({ ...pass });
      }
    }
  }

  return overdue;
}

export function getNightPasses(institutionId: string): NightOutPass[] {
  return passesStore
    .filter(p => p.institutionId === institutionId)
    .map(p => ({ ...p }));
}

export function computeHostelOccupancySummary(institutionId: string): HostelOccupancySummary {
  const instBlocks = getBlocks(institutionId);
  const instRooms = getRooms(institutionId);
  const instTickets = getMaintenanceTickets(institutionId);
  const instPasses = getNightPasses(institutionId);

  const totalCapacityBeds = instRooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = instRooms.reduce((acc, r) => acc + r.occupants.length, 0);
  const availableBeds = Math.max(0, totalCapacityBeds - occupiedBeds);
  const occupancyRate = totalCapacityBeds > 0 ? Math.round((occupiedBeds / totalCapacityBeds) * 100) : 0;

  const openMaintenanceTickets = instTickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const pendingNightPasses = instPasses.filter(p => p.status === 'REQUESTED').length;

  return {
    institutionId,
    totalBlocks: instBlocks.length,
    totalCapacityBeds,
    occupiedBeds,
    availableBeds,
    occupancyRate,
    openMaintenanceTickets,
    pendingNightPasses
  };
}

export function exportHostelRosterCSV(institutionId: string): string {
  const rooms = getRooms(institutionId);
  const blocks = getBlocks(institutionId);
  const blockMap = new Map(blocks.map(b => [b.id, b.name]));

  const lines: string[] = [];
  lines.push('=== AICTE CAMPUS HOUSING & HOSTEL ALLOCATION ROSTER ===');
  lines.push('Block_Name,Room_Number,Floor,Room_Type,Capacity,Current_Occupants,Occupant_Names,Fee_Per_Semester_INR,Status');

  for (const r of rooms) {
    const blockName = blockMap.get(r.blockId) || r.blockId;
    const names = r.occupants.map(o => `${o.studentName} (${o.enrollmentNumber})`).join('; ');
    lines.push(`"${blockName}","${r.roomNumber}",${r.floor},"${r.roomType}",${r.capacity},${r.occupants.length},"${names.replace(/"/g, '""')}",${r.feePerSemesterINR},"${r.status}"`);
  }

  return lines.join('\n');
}

export function seedHostelData(institutionId: string): void {
  blocksStore = [
    {
      id: 'BLK-BH1',
      institutionId,
      name: 'Aryabhata Hall of Residence',
      code: 'BH-1',
      genderPolicy: 'MALE',
      totalFloors: 4,
      totalRooms: 40,
      wardenName: 'Prof. Ramesh Kulkarni',
      wardenContact: '+91 98450 11223',
      emergencyExtension: '401',
      curfewTime: '21:30'
    },
    {
      id: 'BLK-GH1',
      institutionId,
      name: 'Gargi Hall of Residence',
      code: 'GH-1',
      genderPolicy: 'FEMALE',
      totalFloors: 4,
      totalRooms: 40,
      wardenName: 'Dr. Meenakshi Sundaram',
      wardenContact: '+91 98450 33445',
      emergencyExtension: '402',
      curfewTime: '21:30'
    }
  ];

  roomsStore = [
    {
      id: 'RM-101',
      institutionId,
      blockId: 'BLK-BH1',
      roomNumber: 'BH1-101',
      floor: 1,
      roomType: 'DOUBLE',
      capacity: 2,
      occupants: [
        {
          studentId: 'STU-1001',
          studentName: 'Aarav Sharma',
          enrollmentNumber: 'ENG-2023-014',
          gender: 'MALE',
          allocatedAt: '2025-08-01T09:00:00Z'
        },
        {
          studentId: 'STU-1002',
          studentName: 'Vikram Patel',
          enrollmentNumber: 'ENG-2023-089',
          gender: 'MALE',
          allocatedAt: '2025-08-01T09:30:00Z'
        }
      ],
      amenities: ['Wi-Fi 6', 'Attached Balcony', 'Study Desks', 'Water Geyser'],
      feePerSemesterINR: 45000,
      status: 'OCCUPIED'
    },
    {
      id: 'RM-102',
      institutionId,
      blockId: 'BLK-BH1',
      roomNumber: 'BH1-102',
      floor: 1,
      roomType: 'DOUBLE',
      capacity: 2,
      occupants: [
        {
          studentId: 'STU-1003',
          studentName: 'Rohan Gupta',
          enrollmentNumber: 'ENG-2023-112',
          gender: 'MALE',
          allocatedAt: '2025-08-01T10:00:00Z'
        }
      ],
      amenities: ['Wi-Fi 6', 'Study Desks', 'Water Geyser'],
      feePerSemesterINR: 42000,
      status: 'AVAILABLE'
    },
    {
      id: 'RM-201',
      institutionId,
      blockId: 'BLK-GH1',
      roomNumber: 'GH1-201',
      floor: 2,
      roomType: 'SINGLE',
      capacity: 1,
      occupants: [
        {
          studentId: 'STU-2001',
          studentName: 'Ananya Deshmukh',
          enrollmentNumber: 'ENG-2023-005',
          gender: 'FEMALE',
          allocatedAt: '2025-08-01T09:00:00Z'
        }
      ],
      amenities: ['Air Conditioned', 'Wi-Fi 6', 'Balcony', 'Ensuite Bathroom'],
      feePerSemesterINR: 65000,
      status: 'OCCUPIED'
    },
    {
      id: 'RM-202',
      institutionId,
      blockId: 'BLK-GH1',
      roomNumber: 'GH1-202',
      floor: 2,
      roomType: 'DOUBLE',
      capacity: 2,
      occupants: [],
      amenities: ['Wi-Fi 6', 'Study Desks', 'Water Geyser'],
      feePerSemesterINR: 42000,
      status: 'AVAILABLE'
    }
  ];

  ticketsStore = [
    {
      id: 'TCK-501',
      institutionId,
      blockId: 'BLK-BH1',
      roomNumber: 'BH1-101',
      reportedByStudentId: 'STU-1001',
      reportedByStudentName: 'Aarav Sharma',
      category: 'PLUMBING',
      priority: 'HIGH',
      description: 'Bathroom washbasin faucet dripping continuously and water pressure low.',
      status: 'OPEN',
      createdAt: '2026-10-15T08:30:00Z'
    }
  ];

  passesStore = [
    {
      id: 'NOP-601',
      institutionId,
      studentId: 'STU-1002',
      studentName: 'Vikram Patel',
      roomNumber: 'BH1-101',
      destination: 'Home (Pune) for Festival Weekend',
      parentConsentVerified: true,
      departureTimestamp: '2026-10-17T17:00:00Z',
      expectedReturnTimestamp: '2026-10-19T21:00:00Z',
      status: 'APPROVED',
      approverWarden: 'Prof. Ramesh Kulkarni',
      createdAt: '2026-10-15T14:00:00Z'
    }
  ];
}

export function resetHostelStore(): void {
  blocksStore = [];
  roomsStore = [];
  ticketsStore = [];
  passesStore = [];
}
