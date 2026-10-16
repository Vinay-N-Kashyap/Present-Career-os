/**
 * Master Research Publications, Patents & Campus Hostel Systems Test Suite (TASK-905)
 * 
 * Verifies:
 * 1. Faculty Research Publications & Patent Tracking Engine (TASK-901).
 * 2. Hirsch index (h-index) deterministic calculation.
 * 3. Faculty Research Impact Score (FRIS) with indexing weights and citation rewards.
 * 4. NAAC Criterion 3.3/3.4 statutory CSV export formatting.
 * 5. Hostels & Campus Housing Facility Allocation Engine (TASK-903).
 * 6. Gender policy invariants and capacity limits.
 * 7. Maintenance ticket dispatch and lifecycle.
 * 8. Night-out pass curfew approvals and overdue detection.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  seedResearchData,
  resetResearchStore,
  calculateHIndex,
  calculateFRIS,
  computeFacultyMetrics,
  addPublication,
  updatePublication,
  deletePublication,
  addPatent,
  updatePatentStatus,
  getPublicationsByInstitution,
  getPatentsByInstitution,
  exportResearchPublicationsCSV,
  Publication,
  Patent,
  ResearchGrant
} from '../src/lib/teacher/researchPublications';

import {
  seedHostelData,
  resetHostelStore,
  getBlocks,
  getRooms,
  allocateRoomBed,
  vacateRoomBed,
  createMaintenanceTicket,
  updateMaintenanceTicketStatus,
  getMaintenanceTickets,
  requestNightOutPass,
  approveNightOutPass,
  checkoutNightPass,
  recordNightPassReturn,
  checkAndFlagOverduePasses,
  computeHostelOccupancySummary,
  exportHostelRosterCSV
} from '../src/lib/admin/hostelManagement';

describe('TASK-905: Research Publications & Campus Hostel Systems Suite', () => {
  const TEST_INSTITUTION = 'inst-apex-test';

  beforeEach(() => {
    resetResearchStore();
    seedResearchData(TEST_INSTITUTION);

    resetHostelStore();
    seedHostelData(TEST_INSTITUTION);
  });

  describe('TASK-901: Faculty Research Publications & Patent Tracking Engine', () => {
    it('calculates Hirsch index (h-index) deterministically according to citation distribution', () => {
      assert.equal(calculateHIndex([]), 0);
      assert.equal(calculateHIndex([10]), 1);
      assert.equal(calculateHIndex([0, 0, 0]), 0);
      assert.equal(calculateHIndex([10, 8, 5, 4, 3]), 4);
      assert.equal(calculateHIndex([25, 8, 5, 3, 3]), 3);
      assert.equal(calculateHIndex([100, 90, 80, 70, 60, 50]), 6);
    });

    it('computes Faculty Research Impact Score (FRIS) with indexing weights and citation rewards', () => {
      const mockPubs: Publication[] = [
        {
          id: 'p1',
          institutionId: TEST_INSTITUTION,
          facultyId: 'fac-1',
          facultyName: 'Dr. Test',
          department: 'CSE',
          title: 'Paper 1',
          type: 'JOURNAL',
          venue: 'IEEE Trans',
          indexing: ['WEB_OF_SCIENCE'],
          publicationYear: 2025,
          citationCount: 20,
          isFirstOrCorrespondingAuthor: true,
          coAuthors: [],
          createdAt: ''
        }
      ];

      const mockPatents: Patent[] = [
        {
          id: 'pat1',
          institutionId: TEST_INSTITUTION,
          facultyId: 'fac-1',
          facultyName: 'Dr. Test',
          department: 'CSE',
          title: 'Patent 1',
          applicationNumber: 'PAT-01',
          filingDate: '2025-01-01',
          status: 'GRANTED',
          patentOffice: 'INDIAN_PATENT_OFFICE',
          inventors: [],
          createdAt: ''
        }
      ];

      const mockGrants: ResearchGrant[] = [
        {
          id: 'grt1',
          institutionId: TEST_INSTITUTION,
          facultyId: 'fac-1',
          facultyName: 'Dr. Test',
          department: 'CSE',
          projectTitle: 'Grant 1',
          fundingAgency: 'SERB',
          sanctionedAmountINR: 1000000,
          durationMonths: 24,
          startDate: '2025-01-01',
          status: 'ACTIVE',
          createdAt: ''
        }
      ];

      // Points breakdown:
      // Paper 1: WoS (10 pts) + firstAuthor (2 pts) = 12 pts
      // Citations: 20 * 0.5 = 10 pts
      // Patent 1: GRANTED = 15 pts
      // Grant 1: 10,00,000 / 50,000 = 20 pts (maxed at 20)
      // Total: 12 + 10 + 15 + 20 = 57 pts
      const fris = calculateFRIS(mockPubs, mockPatents, mockGrants);
      assert.equal(fris, 57);
    });

    it('aggregates comprehensive faculty research metrics and h-index', () => {
      const metrics = computeFacultyMetrics('FAC-CSE-001', TEST_INSTITUTION);
      assert.equal(metrics.facultyId, 'FAC-CSE-001');
      assert.equal(metrics.totalPublications, 2);
      assert.equal(metrics.scopusCount, 2);
      assert.equal(metrics.webOfScienceCount, 1);
      assert.equal(metrics.totalCitations, 60); // 42 + 18
      assert.equal(metrics.hIndex, 2);
      assert.equal(metrics.patentsGranted, 1);
      assert.equal(metrics.activeGrantsINR, 3500000);
      assert.ok(metrics.frisScore > 50);
    });

    it('supports publication CRUD and patent lifecycle transitions', () => {
      const newPub = addPublication({
        institutionId: TEST_INSTITUTION,
        facultyId: 'FAC-CSE-001',
        facultyName: 'Dr. Aris Thorne',
        department: 'Computer Science & Engineering',
        title: 'Zero-Knowledge Cryptographic Rollups on Edge Devices',
        type: 'CONFERENCE',
        venue: 'IEEE INFOCOM 2026',
        indexing: ['SCOPUS', 'IEEE_ACM'],
        publicationYear: 2026,
        doi: '10.1109/INFOCOM.2026.9999',
        citationCount: 4,
        isFirstOrCorrespondingAuthor: true,
        coAuthors: ['K. V. Rao']
      });

      assert.match(newPub.id, /^PUB-/);
      let pubs = getPublicationsByInstitution(TEST_INSTITUTION);
      assert.ok(pubs.some(p => p.id === newPub.id));

      // Update publication
      const updated = updatePublication(newPub.id, { citationCount: 15 });
      assert.equal(updated?.citationCount, 15);

      // Advance patent status
      const updatedPatent = updatePatentStatus('PAT-202', 'GRANTED', '2026-10-16');
      assert.equal(updatedPatent?.status, 'GRANTED');
      assert.equal(updatedPatent?.grantDate, '2026-10-16');

      // Delete publication
      const deleted = deletePublication(newPub.id);
      assert.equal(deleted, true);
      pubs = getPublicationsByInstitution(TEST_INSTITUTION);
      assert.equal(pubs.some(p => p.id === newPub.id), false);
    });

    it('exports NAAC Criterion 3.3 and 3.4 CSV audit reports', () => {
      const csv = exportResearchPublicationsCSV(TEST_INSTITUTION);
      assert.ok(csv.includes('=== NAAC CRITERION 3.4: RESEARCH PUBLICATIONS AUDIT ==='));
      assert.ok(csv.includes('=== NAAC CRITERION 3.3: INTELLECTUAL PROPERTY & PATENTS AUDIT ==='));
      assert.ok(csv.includes('Scalable Byz-Quorum Consensus'));
      assert.ok(csv.includes('PAT-2025-883912'));
    });
  });

  describe('TASK-903: Hostels & Campus Housing Facility Allocation Engine', () => {
    it('enforces gender policy invariants during room bed allocation', () => {
      // BH1 is a MALE hostel block
      const femaleAllocation = allocateRoomBed({
        institutionId: TEST_INSTITUTION,
        roomId: 'RM-102', // in BH1
        studentId: 'STU-FEMALE-1',
        studentName: 'Sneha Roy',
        enrollmentNumber: 'ENG-2024-099',
        gender: 'FEMALE'
      });

      assert.equal(femaleAllocation.success, false);
      assert.ok(femaleAllocation.error?.includes('GENDER_POLICY_VIOLATION'));

      // GH1 is a FEMALE hostel block
      const maleAllocation = allocateRoomBed({
        institutionId: TEST_INSTITUTION,
        roomId: 'RM-202', // in GH1
        studentId: 'STU-MALE-1',
        studentName: 'Karan Mehra',
        enrollmentNumber: 'ENG-2024-100',
        gender: 'MALE'
      });

      assert.equal(maleAllocation.success, false);
      assert.ok(maleAllocation.error?.includes('GENDER_POLICY_VIOLATION'));
    });

    it('enforces room capacity bounds and prevents duplicate allocations', () => {
      // RM-101 has capacity 2 and currently has 2 occupants (Aarav, Vikram)
      const overflowAllocation = allocateRoomBed({
        institutionId: TEST_INSTITUTION,
        roomId: 'RM-101',
        studentId: 'STU-1004',
        studentName: 'Sameer Sen',
        enrollmentNumber: 'ENG-2023-145',
        gender: 'MALE'
      });

      assert.equal(overflowAllocation.success, false);
      assert.equal(overflowAllocation.error, 'ROOM_CAPACITY_EXCEEDED');

      // Duplicate student allocation prevention: Aarav is already in RM-101
      const duplicateAllocation = allocateRoomBed({
        institutionId: TEST_INSTITUTION,
        roomId: 'RM-102', // has free bed
        studentId: 'STU-1001', // Aarav Sharma
        studentName: 'Aarav Sharma',
        enrollmentNumber: 'ENG-2023-014',
        gender: 'MALE'
      });

      assert.equal(duplicateAllocation.success, false);
      assert.ok(duplicateAllocation.error?.includes('STUDENT_ALREADY_ALLOCATED'));
    });

    it('allows valid bed allocation, room state update, and subsequent vacancy', () => {
      // RM-102 has capacity 2 and currently 1 occupant (Rohan)
      const validAllocation = allocateRoomBed({
        institutionId: TEST_INSTITUTION,
        roomId: 'RM-102',
        studentId: 'STU-1005',
        studentName: 'Aditya Kumar',
        enrollmentNumber: 'ENG-2023-205',
        gender: 'MALE'
      });

      assert.equal(validAllocation.success, true);
      assert.equal(validAllocation.room?.status, 'OCCUPIED'); // Now full (2/2)

      // Vacate student
      const vacated = vacateRoomBed(TEST_INSTITUTION, 'RM-102', 'STU-1005');
      assert.equal(vacated, true);

      const rooms = getRooms(TEST_INSTITUTION);
      const rm102 = rooms.find(r => r.id === 'RM-102');
      assert.equal(rm102?.occupants.length, 1);
      assert.equal(rm102?.status, 'AVAILABLE');
    });

    it('handles maintenance ticket dispatch and lifecycle status transitions', () => {
      const ticket = createMaintenanceTicket({
        institutionId: TEST_INSTITUTION,
        blockId: 'BLK-BH1',
        roomNumber: 'BH1-102',
        reportedByStudentId: 'STU-1003',
        reportedByStudentName: 'Rohan Gupta',
        category: 'ELECTRICAL',
        priority: 'HIGH',
        description: 'Ceiling fan regulator short-circuited and sparking.'
      });

      assert.match(ticket.id, /^TCK-/);
      assert.equal(ticket.status, 'OPEN');

      // Dispatch technician
      const inProgress = updateMaintenanceTicketStatus(ticket.id, 'IN_PROGRESS', 'Electrician Vinod');
      assert.equal(inProgress?.status, 'IN_PROGRESS');
      assert.equal(inProgress?.assignedTechnician, 'Electrician Vinod');

      // Resolve ticket
      const resolved = updateMaintenanceTicketStatus(ticket.id, 'RESOLVED');
      assert.equal(resolved?.status, 'RESOLVED');
      assert.ok(resolved?.resolvedAt);
    });

    it('enforces night-out pass approvals, gate check-out, and overdue tracking', () => {
      const pass = requestNightOutPass({
        institutionId: TEST_INSTITUTION,
        studentId: 'STU-1003',
        studentName: 'Rohan Gupta',
        roomNumber: 'BH1-102',
        destination: 'Hackathon Bangalore',
        parentConsentVerified: false,
        departureTimestamp: '2026-10-16T18:00:00Z',
        expectedReturnTimestamp: '2026-10-16T21:00:00Z'
      });

      assert.equal(pass.status, 'REQUESTED');

      // Rejects without parental consent
      const failedApprove = approveNightOutPass(pass.id, 'Prof. Ramesh', false);
      assert.equal(failedApprove.success, false);
      assert.equal(failedApprove.error, 'PARENTAL_CONSENT_REQUIRED');

      // Approves with parental consent
      const successApprove = approveNightOutPass(pass.id, 'Prof. Ramesh', true);
      assert.equal(successApprove.success, true);
      assert.equal(successApprove.pass?.status, 'APPROVED');

      // Student checks out at campus gate
      const checkedOut = checkoutNightPass(pass.id);
      assert.equal(checkedOut, true);

      // If current time is 22:00, pass with expected return 21:00 is overdue
      const overdueList = checkAndFlagOverduePasses(TEST_INSTITUTION, '2026-10-16T22:00:00Z');
      assert.ok(overdueList.some(p => p.id === pass.id));

      // Student returns at 22:15
      const returned = recordNightPassReturn(pass.id, '2026-10-16T22:15:00Z');
      assert.equal(returned, true);
    });

    it('computes overall occupancy summary and exports AICTE roster CSV', () => {
      const summary = computeHostelOccupancySummary(TEST_INSTITUTION);
      assert.equal(summary.totalBlocks, 2);
      assert.equal(summary.totalCapacityBeds, 7); // 2 + 2 + 1 + 2
      assert.equal(summary.occupiedBeds, 4); // 2 + 1 + 1 + 0
      assert.equal(summary.availableBeds, 3);
      assert.equal(summary.occupancyRate, 57); // 4/7 = 57%

      const csv = exportHostelRosterCSV(TEST_INSTITUTION);
      assert.ok(csv.includes('=== AICTE CAMPUS HOUSING & HOSTEL ALLOCATION ROSTER ==='));
      assert.ok(csv.includes('Aryabhata Hall of Residence'));
      assert.ok(csv.includes('BH1-101'));
      assert.ok(csv.includes('Gargi Hall of Residence'));
    });
  });
});
