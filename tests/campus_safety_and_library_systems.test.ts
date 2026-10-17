/**
 * Campus Safety & Digital Library Systems Verification Audit Suite (TASK-900)
 * 
 * Verifies:
 * 1. Campus emergency incident logging, responder dispatch, and zone evacuation state machines.
 * 2. Statutory Safety Incident Audit CSV export formatting.
 * 3. Digital library inventory search, asset types, and availability limits.
 * 4. 14-day circulation window, RFID checkout decrements, and overdue fine assessment.
 * 5. Strict multi-tenant isolation across safety and library resources.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  campusSafetyStore,
  exportSafetyIncidentsCSV,
  CampusZone,
} from '../src/lib/admin/campusSafety.js';
import {
  digitalLibraryStore,
  exportLibraryCatalogCSV,
  LibraryItem,
} from '../src/lib/admin/libraryCatalog.js';

describe('TASK-900: Campus Safety & Digital Library Systems Suite', () => {
  beforeEach(() => {
    campusSafetyStore.clear();
    digitalLibraryStore.clear();
  });

  const MOCK_ZONE: CampusZone = {
    zoneId: 'zn-chem-01',
    institutionId: 'inst-apex-001',
    zoneName: 'Chemistry Research Complex',
    buildingCode: 'CHEM-01',
    latitude: 12.9716,
    longitude: 77.5946,
    radiusMeters: 100,
    currentEvacuationStatus: 'NORMAL',
    headOfZoneSecurity: 'Officer R. Deshmukh',
  };

  const MOCK_BOOK: LibraryItem = {
    itemId: 'bk-db-01',
    institutionId: 'inst-apex-001',
    title: 'Database System Concepts',
    authors: ['Abraham Silberschatz', 'Henry F. Korth'],
    isbnOrDoi: '978-0078022159',
    assetType: 'PHYSICAL_BOOK',
    publisher: 'McGraw-Hill',
    publicationYear: 2019,
    department: 'Computer Science',
    totalCopies: 3,
    availableCopies: 1, // Only 1 copy available
    isDigitalAccessible: false,
  };

  it('manages safety incident reporting, evacuation status changes, and responder dispatch', () => {
    campusSafetyStore.registerZone(MOCK_ZONE);

    // 1. Report Critical Red Alert (Chemical Spill)
    const incident = campusSafetyStore.reportIncident({
      institutionId: 'inst-apex-001',
      zoneId: 'zn-chem-01',
      type: 'FIRE_OR_CHEMICAL_SPILL',
      severity: 'CRITICAL_RED_ALERT',
      title: 'Hydrochloric acid container breach in lab 402',
      description: 'Acid spill vaporizing. Immediate evacuation required.',
      reportedBy: 'Lab Assistant K. Verma',
    });

    assert.strictEqual(incident.status, 'ACTIVE');
    assert.strictEqual(incident.broadcastSent, true);

    // Zone should immediately transition to EVACUATE
    const zone = campusSafetyStore.getZonesByInstitution('inst-apex-001')[0];
    assert.strictEqual(zone.currentEvacuationStatus, 'EVACUATE');

    // 2. Dispatch Hazardous Containment Squad
    const dispatched = campusSafetyStore.dispatchResponders({
      incidentId: incident.incidentId,
      institutionId: 'inst-apex-001',
      responderTeams: ['Hazardous Chemical Containment Squad', 'Paramedics'],
    });

    assert.strictEqual(dispatched.status, 'RESPONDERS_DISPATCHED');
    assert.ok(dispatched.assignedResponders.includes('Hazardous Chemical Containment Squad'));

    // 3. Resolve incident with After-Action Review (AAR)
    const resolved = campusSafetyStore.resolveIncident({
      incidentId: incident.incidentId,
      institutionId: 'inst-apex-001',
      afterActionSummary: 'Spill neutralized with soda ash. Fume hoods ventilated. Zone declared safe.',
    });

    assert.strictEqual(resolved.status, 'RESOLVED');
    assert.ok(resolved.resolvedAt);

    // Zone evacuation status resets to NORMAL
    const restoredZone = campusSafetyStore.getZonesByInstitution('inst-apex-001')[0];
    assert.strictEqual(restoredZone.currentEvacuationStatus, 'NORMAL');
  });

  it('exports valid safety incident audit CSV logs', () => {
    campusSafetyStore.registerZone(MOCK_ZONE);
    const inc = campusSafetyStore.reportIncident({
      institutionId: 'inst-apex-001',
      zoneId: 'zn-chem-01',
      type: 'MEDICAL_EMERGENCY',
      severity: 'HIGH',
      title: 'Student fainting in corridor',
      description: 'First aid needed.',
      reportedBy: 'Faculty',
    });

    const csv = exportSafetyIncidentsCSV([inc]);
    assert.ok(csv.includes('Incident_ID,Institution_ID,Zone_Name,Type,Severity'));
    assert.ok(csv.includes('"inst-apex-001","Chemistry Research Complex"'));
    assert.ok(csv.includes('MEDICAL_EMERGENCY'));
  });

  it('manages digital library catalog search and enforces copy availability limits', () => {
    digitalLibraryStore.addCatalogItem(MOCK_BOOK);

    // Add journal paper
    digitalLibraryStore.addCatalogItem({
      itemId: 'jr-acm-01',
      institutionId: 'inst-apex-001',
      title: 'Spanner: Google’s Globally-Distributed Database',
      authors: ['James C. Corbett'],
      isbnOrDoi: '10.1145/2491245',
      assetType: 'JOURNAL_PAPER',
      publisher: 'ACM Transactions on Computer Systems',
      publicationYear: 2013,
      department: 'Computer Science',
      totalCopies: 1,
      availableCopies: 1,
      isDigitalAccessible: true,
      digitalAccessUrl: 'https://acm.org/spanner.pdf',
    });

    // Search by title
    const searchRes = digitalLibraryStore.searchCatalog({
      institutionId: 'inst-apex-001',
      query: 'Spanner',
    });
    assert.strictEqual(searchRes.length, 1);
    assert.strictEqual(searchRes[0].assetType, 'JOURNAL_PAPER');

    // Filter by assetType PHYSICAL_BOOK
    const bookRes = digitalLibraryStore.searchCatalog({
      institutionId: 'inst-apex-001',
      assetType: 'PHYSICAL_BOOK',
    });
    assert.strictEqual(bookRes.length, 1);
    assert.strictEqual(bookRes[0].itemId, 'bk-db-01');

    // Rejects negative copy count
    assert.throws(() => {
      digitalLibraryStore.addCatalogItem({
        ...MOCK_BOOK,
        itemId: 'bk-bad',
        totalCopies: -1,
      });
    }, /COPIES_NON_NEGATIVE/);
  });

  it('circulates checkouts and calculates daily overdue fines correctly', () => {
    digitalLibraryStore.addCatalogItem({ ...MOCK_BOOK, availableCopies: 1 });

    // 1. Checkout the only available copy
    const checkout = digitalLibraryStore.checkoutItem({
      institutionId: 'inst-apex-001',
      itemId: 'bk-db-01',
      studentId: 'CS2026-088',
      studentName: 'Rohan Varma',
    });

    assert.strictEqual(checkout.status, 'BORROWED');
    assert.strictEqual(checkout.fineAmount, 0);

    // Available copies should be 0 now
    const updatedBook = digitalLibraryStore.searchCatalog({ institutionId: 'inst-apex-001', query: 'Database' })[0];
    assert.strictEqual(updatedBook.availableCopies, 0);

    // Second checkout must fail (NO_COPIES_AVAILABLE)
    assert.throws(() => {
      digitalLibraryStore.checkoutItem({
        institutionId: 'inst-apex-001',
        itemId: 'bk-db-01',
        studentId: 'CS2026-099',
        studentName: 'Priya N',
      });
    }, /NO_COPIES_AVAILABLE/);

    // 2. Return on time (fine = 0)
    const nowISO = new Date().toISOString();
    const returned = digitalLibraryStore.returnItem(checkout.checkoutId, nowISO);
    assert.strictEqual(returned.status, 'RETURNED');
    assert.strictEqual(returned.fineAmount, 0);

    // Book copy restored
    const restoredBook = digitalLibraryStore.searchCatalog({ institutionId: 'inst-apex-001', query: 'Database' })[0];
    assert.strictEqual(restoredBook.availableCopies, 1);

    // 3. Test overdue return calculation (5 days past due)
    const overdueCheckout = digitalLibraryStore.checkoutItem({
      institutionId: 'inst-apex-001',
      itemId: 'bk-db-01',
      studentId: 'CS2026-099',
      studentName: 'Late Student',
    });

    // Simulate return 19 days after checkout (14 days allowed + 5 days overdue)
    const borrowTime = new Date(overdueCheckout.borrowedAt).getTime();
    const lateReturnTime = new Date(borrowTime + 19 * 24 * 60 * 60 * 1000).toISOString();

    const lateReturn = digitalLibraryStore.returnItem(overdueCheckout.checkoutId, lateReturnTime);
    assert.strictEqual(lateReturn.status, 'RETURNED');
    assert.strictEqual(lateReturn.overdueDays, 5);
    assert.strictEqual(lateReturn.fineAmount, 5.0); // 5 * $1.00 = $5.00
  });

  it('enforces multi-tenant isolation across campus safety and digital library catalog', () => {
    campusSafetyStore.registerZone(MOCK_ZONE);
    digitalLibraryStore.addCatalogItem(MOCK_BOOK);

    // Tenant 2 queries
    const t2Zones = campusSafetyStore.getZonesByInstitution('inst-global-002');
    const t2Catalog = digitalLibraryStore.searchCatalog({ institutionId: 'inst-global-002' });

    assert.strictEqual(t2Zones.length, 0);
    assert.strictEqual(t2Catalog.length, 0);

    // Attempt to checkout Tenant 1 book in Tenant 2
    assert.throws(() => {
      digitalLibraryStore.checkoutItem({
        institutionId: 'inst-global-002', // Wrong tenant!
        itemId: 'bk-db-01',
        studentId: 'stu-global',
        studentName: 'Global Student',
      });
    }, /ITEM_NOT_FOUND_OR_TENANT_MISMATCH/);

    // Attempt to report incident in Tenant 2 for Tenant 1 zone
    assert.throws(() => {
      campusSafetyStore.reportIncident({
        institutionId: 'inst-global-002', // Wrong tenant!
        zoneId: 'zn-chem-01',
        type: 'SECURITY_BREACH',
        severity: 'HIGH',
        title: 'Unauthorized entry',
        description: 'Details',
        reportedBy: 'Guard',
      });
    }, /ZONE_NOT_FOUND_OR_TENANT_MISMATCH/);
  });
});
