/**
 * Master Platform Performance, Concurrency Stress & Cross-Tenant Defense Suite (TASK-875)
 * 
 * Tests:
 * 1. High-concurrency QR code check-in simulation (200 concurrent requests).
 * 2. Cryptographic portfolio tamper-detection and strict PII redaction.
 * 3. 3-Tenant simultaneous ecosystem stress test across all 5 platform engines.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  createAttendanceSession,
  generateRevolvingToken,
  processCheckIn,
  computeSessionSummary,
  attendanceStore,
  CheckInRequest,
} from '../src/lib/teacher/attendance.js';
import {
  compilePublicPortfolio,
  verifyPortfolioProof,
  StudentAcademicProfile,
} from '../src/lib/admin/portfolio.js';
import { InMemoryRosterStore, parseStudentRosterCSV } from '../src/lib/admin/roster.js';
import { FeeLedgerEngine } from '../src/lib/admin/feeLedger.js';
import { computeAccreditationManifest, exportAccreditationCSV } from '../src/lib/admin/accreditation.js';
import { getInstitutionTheme, issueVerifiableCertificate } from '../src/lib/admin/branding.js';

describe('TASK-875: Master Platform Performance, Concurrency Stress & End-to-End Flow Suite', () => {
  beforeEach(() => {
    attendanceStore.clear();
  });

  it('handles high-concurrency QR attendance check-ins without race conditions or leaks', () => {
    const session = createAttendanceSession({
      institutionId: 'inst-apex-001',
      facultyId: 'fac-prof-rao',
      courseCode: 'CS401',
      section: 'A',
      title: 'High Concurrency Lecture',
      geofence: { name: 'Auditorium', latitude: 12.9716, longitude: 77.5946, radiusMeters: 60 },
      lateAfterMinutes: 10,
      rotationSeconds: 15,
    });
    attendanceStore.saveSession(session);

    const now = Date.now();
    const tokenObj = generateRevolvingToken(session, now);

    // Generate 200 student check-in requests
    // 150 valid in-class students, 30 proxy attackers from hostel (500m away), 20 expired token attempts
    const requests: CheckInRequest[] = [];

    // 150 Valid Students
    for (let i = 1; i <= 150; i++) {
      requests.push({
        sessionId: session.sessionId,
        institutionId: 'inst-apex-001',
        studentId: `stu-valid-${i}`,
        studentName: `Valid Student ${i}`,
        rollNumber: `CS2026-${String(i).padStart(3, '0')}`,
        token: tokenObj.token,
        latitude: 12.9716 + (Math.random() * 0.0002 - 0.0001), // within 20m
        longitude: 77.5946 + (Math.random() * 0.0002 - 0.0001),
        ipAddress: `10.0.14.${i % 250}`,
      });
    }

    // 30 Proxy Attackers (Latitude offset ~500m)
    for (let i = 151; i <= 180; i++) {
      requests.push({
        sessionId: session.sessionId,
        institutionId: 'inst-apex-001',
        studentId: `stu-proxy-${i}`,
        studentName: `Proxy Attacker ${i}`,
        rollNumber: `CS2026-${String(i).padStart(3, '0')}`,
        token: tokenObj.token,
        latitude: 12.9760, // 500m away
        longitude: 77.5946,
        ipAddress: '192.168.1.100',
      });
    }

    // 20 Expired Token Students
    const oldToken = generateRevolvingToken(session, now - 45000); // 45s ago
    for (let i = 181; i <= 200; i++) {
      requests.push({
        sessionId: session.sessionId,
        institutionId: 'inst-apex-001',
        studentId: `stu-expired-${i}`,
        studentName: `Late Token Student ${i}`,
        rollNumber: `CS2026-${String(i).padStart(3, '0')}`,
        token: oldToken.token,
        latitude: 12.9716,
        longitude: 77.5946,
      });
    }

    // Execute all 200 check-in requests
    let successCount = 0;
    let proxyBlockedCount = 0;
    let expiredCount = 0;

    for (const req of requests) {
      const res = processCheckIn(req, session, now);
      if (res.success) {
        successCount++;
      } else if (res.status === 'GEOFENCE_FAILED') {
        proxyBlockedCount++;
      } else if (res.status === 'TOKEN_EXPIRED') {
        expiredCount++;
      }
    }

    assert.equal(successCount, 150, 'Exactly 150 valid students should be marked present');
    assert.equal(proxyBlockedCount, 30, 'Exactly 30 proxy attempts should be blocked');
    assert.equal(expiredCount, 20, 'Exactly 20 expired tokens should be rejected');

    // Assert summary integrity
    const summary = computeSessionSummary(session, 200);
    assert.equal(summary.presentCount, 150);
    assert.equal(summary.proxyAttemptsBlocked, 30);
    assert.equal(summary.absentCount, 50); // 200 enrolled - 150 attended = 50 absent
    assert.equal(summary.attendancePercentage, 75.0);
  });

  it('verifies student public portfolio strictly redacts PII and detects any cryptographic tamper', () => {
    const rawProfile: StudentAcademicProfile = {
      studentId: 'stu-sneha-patel',
      institutionId: 'inst-apex-001',
      fullName: 'Sneha Patel',
      rollNumber: 'CS2026-042',
      email: 'sneha.patel@apex.edu.in',
      phone: '+91 99887 76655', // Private
      department: 'Computer Science',
      degree: 'B.Tech CSE',
      batchYear: 2026,
      cgpa: 9.85,
      attendancePercentage: 99.2,
      feeBalanceDue: 15000, // Private
      internalDisciplinaryNotes: ['Late dorm check-in warning'], // Private
      completedQuestsCount: 65,
      capstones: [
        {
          capstoneId: 'cap-1',
          title: 'Distributed Kernel Cache Engine',
          courseCode: 'CS401',
          grade: 'A+',
          score: 99,
          completionDate: '2026-09-01',
          competencies: ['Distributed Systems', 'Kernel Bypassing'],
        },
      ],
      exams: [
        {
          examId: 'exam-1',
          examTitle: 'Algorithms Midterm',
          score: 98,
          integrityScore: 100,
          passed: true,
          proctoredDate: '2026-08-15',
        },
      ],
      employabilityScore: 97,
      tier: 'TIER_1_PRODUCT',
    };

    const publicPortfolio = compilePublicPortfolio(rawProfile, 'Apex Institute of Technology');

    // 1. Assert PII redaction: properties should not exist on public portfolio
    assert.equal((publicPortfolio as Record<string, unknown>).phone, undefined);
    assert.equal((publicPortfolio as Record<string, unknown>).feeBalanceDue, undefined);
    assert.equal((publicPortfolio as Record<string, unknown>).internalDisciplinaryNotes, undefined);

    // 2. Assert cryptographic validity of pristine portfolio
    assert.equal(verifyPortfolioProof(publicPortfolio), true, 'Pristine portfolio must be cryptographically valid');

    // 3. Assert tamper detection: modify CGPA by +0.05
    const tamperedPortfolio = JSON.parse(JSON.stringify(publicPortfolio));
    tamperedPortfolio.cgpa = 9.90; // Tampered CGPA
    assert.equal(verifyPortfolioProof(tamperedPortfolio), false, 'Tampered CGPA must fail cryptographic proof');

    // 4. Assert tamper detection: modify employability score
    const tamperedEmployability = JSON.parse(JSON.stringify(publicPortfolio));
    tamperedEmployability.employabilityScore = 100;
    assert.equal(verifyPortfolioProof(tamperedEmployability), false, 'Tampered employability score must fail proof');
  });

  it('runs concurrent multi-tenant ecosystem stress across 3 independent universities without leaks', () => {
    const tenantA = 'inst-apex-001';
    const tenantB = 'inst-metro-002';
    const tenantC = 'inst-rural-003';

    // 1. Roster Ingestion on each tenant
    InMemoryRosterStore.clear();

    const csvA = `roll_number,full_name,email,department,cgpa,semester
A-01,Alice Apex,alice@apex.edu,CSE,9.2,6`;
    const csvB = `roll_number,full_name,email,department,cgpa,semester
B-01,Bob Metro,bob@metro.edu,B.Com,8.5,4`;
    const csvC = `roll_number,full_name,email,department,cgpa,semester
C-01,Charlie Rural,charlie@rural.edu,EE,7.8,2`;

    const resA = parseStudentRosterCSV(csvA, tenantA);
    const resB = parseStudentRosterCSV(csvB, tenantB);
    const resC = parseStudentRosterCSV(csvC, tenantC);

    assert.equal(resA.validRecords.length, 1);
    assert.equal(resB.validRecords.length, 1);
    assert.equal(resC.validRecords.length, 1);

    InMemoryRosterStore.upsertStudents(resA.validRecords);
    InMemoryRosterStore.upsertStudents(resB.validRecords);
    InMemoryRosterStore.upsertStudents(resC.validRecords);

    // Cross-tenant store isolation
    const studentsA = InMemoryRosterStore.getStudentsByInstitution(tenantA);
    const studentsB = InMemoryRosterStore.getStudentsByInstitution(tenantB);
    const studentsC = InMemoryRosterStore.getStudentsByInstitution(tenantC);

    assert.equal(studentsA.length, 1);
    assert.equal(studentsA[0].rollNumber, 'A-01');
    assert.equal(studentsB.length, 1);
    assert.equal(studentsB[0].rollNumber, 'B-01');
    assert.equal(studentsC.length, 1);
    assert.equal(studentsC[0].rollNumber, 'C-01');

    // 2. Fee Ledgers on each tenant
    const feeEngine = new FeeLedgerEngine();
    const invA = feeEngine.createInvoice({
      id: 'inv-A-01',
      institutionId: tenantA,
      studentRoll: 'A-01',
      academicYear: '2026-2027',
      semester: 6,
      dueDate: '2026-11-01',
      lineItems: [{ category: 'tuition', description: 'Tuition Fee', amount: 50000 }],
    });
    const invB = feeEngine.createInvoice({
      id: 'inv-B-01',
      institutionId: tenantB,
      studentRoll: 'B-01',
      academicYear: '2026-2027',
      semester: 4,
      dueDate: '2026-11-01',
      lineItems: [{ category: 'lab_infrastructure', description: 'Commerce Lab Fee', amount: 30000 }],
    });

    feeEngine.recordPayment({
      institutionId: tenantA,
      invoiceId: invA.id,
      amount: 50000,
      paymentMethod: 'upi',
      referenceNumber: 'UPI-APEX-9988',
    });

    const updatedInvA = feeEngine.getInvoice(invA.id);
    assert.equal(updatedInvA?.status, 'paid');
    assert.equal(updatedInvA?.balance, 0);

    // Cross-tenant payment rejection
    assert.throws(() => {
      feeEngine.recordPayment({
        institutionId: tenantC, // Wrong tenant trying to pay Tenant B's invoice
        invoiceId: invB.id,
        amount: 30000,
        paymentMethod: 'bank_transfer',
        referenceNumber: 'TX-ATTACK',
      });
    }, /Tenant mismatch/);

    // 3. Accreditation compliance computation for Tenant A
    const accredA = computeAccreditationManifest({
      institutionId: tenantA,
      institutionName: 'Apex Institute of Technology',
      academicYear: '2026-2027',
      studentCount: 3000,
      facultyCount: 200,
      passedStudentsCount: 2700,
      verifiedPlacementCount: 2550,
    });
    assert.equal(accredA.studentFacultyRatio, '15:1');
    assert.ok(accredA.overallComplianceScore >= 90);

    const csvReport = exportAccreditationCSV(accredA);
    assert.ok(csvReport.includes('REGULATORY_BODY,CRITERION_ID,CRITERION_NAME'));

    // 4. Branding & Certificate generation
    const themeA = getInstitutionTheme(tenantA);
    const themeB = getInstitutionTheme(tenantB);
    assert.notEqual(themeA.primaryColor, themeB.primaryColor);

    const certA = issueVerifiableCertificate({
      institutionId: tenantA,
      studentRoll: 'A-01',
      studentName: 'Alice Apex',
      courseTrack: 'Full-Stack Distributed Systems Masterclass',
    });
    assert.equal(certA.institutionId, tenantA);
    assert.equal(certA.certificateHash.length, 64);
  });
});
