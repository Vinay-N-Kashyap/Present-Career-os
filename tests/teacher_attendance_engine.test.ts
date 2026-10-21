/**
 * Unit & Integration Tests: Faculty Dynamic Attendance & Geofenced QR Check-In Engine (TASK-871)
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateHaversineDistance,
  createAttendanceSession,
  generateRevolvingToken,
  processCheckIn,
  computeSessionSummary,
  exportAttendanceCSV,
  attendanceStore,
  ClassroomGeofence,
  CheckInRequest,
} from '../src/lib/teacher/attendance.js';

describe('TASK-871: Faculty Dynamic Attendance & Geofenced QR Check-In Engine', () => {
  const mockGeofence: ClassroomGeofence = {
    name: 'CS Lecture Hall 402',
    latitude: 12.9716, // Bangalore coordinates
    longitude: 77.5946,
    radiusMeters: 50, // 50m geofence
  };

  beforeEach(() => {
    attendanceStore.clear();
  });

  it('accurately computes Haversine distances in meters', () => {
    // Exact same coordinates should return 0 meters
    const distZero = calculateHaversineDistance(12.9716, 77.5946, 12.9716, 77.5946);
    assert.equal(distZero, 0);

    // Coordinate offset ~111 meters (0.001 deg latitude roughly 111m)
    const distOffset = calculateHaversineDistance(12.9716, 77.5946, 12.9726, 77.5946);
    assert.ok(distOffset >= 110 && distOffset <= 112);
  });

  it('creates active attendance session with unique HMAC secret key', () => {
    const session = createAttendanceSession({
      institutionId: 'inst-apex-001',
      facultyId: 'fac-prof-rao',
      courseCode: 'CS401',
      section: 'A',
      title: 'Distributed Systems Lecture 14',
      geofence: mockGeofence,
      lateAfterMinutes: 10,
      rotationSeconds: 15,
    });

    assert.ok(session.sessionId.startsWith('sess_'));
    assert.equal(session.isActive, true);
    assert.equal(session.rotationSeconds, 15);
    assert.ok(session.secretKey.length >= 16);
  });

  it('generates revolving TOTP tokens with valid signatures and countdowns', () => {
    const session = createAttendanceSession({
      institutionId: 'inst-apex-001',
      facultyId: 'fac-prof-rao',
      courseCode: 'CS401',
      section: 'A',
      title: 'Distributed Systems',
      geofence: mockGeofence,
    });

    const now = 1700000000000;
    const tokenObj = generateRevolvingToken(session, now);

    assert.ok(tokenObj.token.includes(session.sessionId));
    assert.ok(tokenObj.windowExpiresInSeconds > 0 && tokenObj.windowExpiresInSeconds <= 15);

    // Verify token parts: sessionId.windowIndex.signature
    const parts = tokenObj.token.split('.');
    assert.equal(parts.length, 3);
    assert.equal(parts[0], session.sessionId);
    assert.equal(parts[1], String(tokenObj.windowIndex));
  });

  it('records PRESENT when student is inside geofence within valid time window', () => {
    const session = createAttendanceSession({
      institutionId: 'inst-apex-001',
      facultyId: 'fac-prof-rao',
      courseCode: 'CS401',
      section: 'A',
      title: 'Distributed Systems',
      geofence: mockGeofence,
    });
    attendanceStore.saveSession(session);

    const now = Date.now();
    const tokenObj = generateRevolvingToken(session, now);

    const request: CheckInRequest = {
      sessionId: session.sessionId,
      institutionId: 'inst-apex-001',
      studentId: 'stu-arjun-01',
      studentName: 'Arjun Verma',
      rollNumber: 'CS2026-089',
      token: tokenObj.token,
      latitude: 12.97161, // ~1.5 meters away (well within 50m)
      longitude: 77.59461,
      ipAddress: '10.0.14.88',
    };

    const result = processCheckIn(request, session, now);
    assert.equal(result.success, true);
    assert.equal(result.status, 'PRESENT');
    assert.ok(result.record);
    assert.equal(result.record.studentId, 'stu-arjun-01');
    assert.ok(result.record.distanceMeters <= 5);
  });

  it('marks student LATE if checked in past the grace period cutoff', () => {
    const session = createAttendanceSession({
      institutionId: 'inst-apex-001',
      facultyId: 'fac-prof-rao',
      courseCode: 'CS401',
      section: 'A',
      title: 'Distributed Systems',
      geofence: mockGeofence,
      lateAfterMinutes: 10,
    });
    // Set start time 15 minutes in the past
    session.startTime = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    attendanceStore.saveSession(session);

    const now = Date.now();
    const tokenObj = generateRevolvingToken(session, now);

    const request: CheckInRequest = {
      sessionId: session.sessionId,
      institutionId: 'inst-apex-001',
      studentId: 'stu-sneha-02',
      studentName: 'Sneha Patel',
      rollNumber: 'CS2026-090',
      token: tokenObj.token,
      latitude: 12.9716,
      longitude: 77.5946,
    };

    const result = processCheckIn(request, session, now);
    assert.equal(result.success, true);
    assert.equal(result.status, 'LATE');
  });

  it('blocks check-in and records GEOFENCE_FAILED when student is outside radius', () => {
    const session = createAttendanceSession({
      institutionId: 'inst-apex-001',
      facultyId: 'fac-prof-rao',
      courseCode: 'CS401',
      section: 'A',
      title: 'Distributed Systems',
      geofence: mockGeofence, // 50m radius
    });
    attendanceStore.saveSession(session);

    const now = Date.now();
    const tokenObj = generateRevolvingToken(session, now);

    // Student is 500 meters away (proxy check-in from hostel)
    const request: CheckInRequest = {
      sessionId: session.sessionId,
      institutionId: 'inst-apex-001',
      studentId: 'stu-proxy-boy',
      studentName: 'Rohan Proxy',
      rollNumber: 'CS2026-999',
      token: tokenObj.token,
      latitude: 12.9760, // ~500m north
      longitude: 77.5946,
    };

    const result = processCheckIn(request, session, now);
    assert.equal(result.success, false);
    assert.equal(result.status, 'GEOFENCE_FAILED');
    assert.match(result.reason || '', /Geofence check failed/);
  });

  it('rejects expired QR tokens past window tolerance', () => {
    const session = createAttendanceSession({
      institutionId: 'inst-apex-001',
      facultyId: 'fac-prof-rao',
      courseCode: 'CS401',
      section: 'A',
      title: 'Distributed Systems',
      geofence: mockGeofence,
      rotationSeconds: 15,
    });
    attendanceStore.saveSession(session);

    const oldTime = Date.now() - 60000; // 60 seconds ago (4 windows expired)
    const oldToken = generateRevolvingToken(session, oldTime);

    const request: CheckInRequest = {
      sessionId: session.sessionId,
      institutionId: 'inst-apex-001',
      studentId: 'stu-tardy-03',
      studentName: 'Tardy Tom',
      rollNumber: 'CS2026-091',
      token: oldToken.token,
      latitude: 12.9716,
      longitude: 77.5946,
    };

    const result = processCheckIn(request, session, Date.now());
    assert.equal(result.success, false);
    assert.equal(result.status, 'TOKEN_EXPIRED');
  });

  it('rejects tampered or forged QR tokens', () => {
    const session = createAttendanceSession({
      institutionId: 'inst-apex-001',
      facultyId: 'fac-prof-rao',
      courseCode: 'CS401',
      section: 'A',
      title: 'Distributed Systems',
      geofence: mockGeofence,
    });
    attendanceStore.saveSession(session);

    const now = Date.now();
    const currentWindowIndex = Math.floor(now / (session.rotationSeconds * 1000));
    const forgedToken = `${session.sessionId}.${currentWindowIndex}.baddeadbeefcafe`;

    const request: CheckInRequest = {
      sessionId: session.sessionId,
      institutionId: 'inst-apex-001',
      studentId: 'stu-hacker-04',
      studentName: 'Mallory Hacker',
      rollNumber: 'CS2026-666',
      token: forgedToken,
      latitude: 12.9716,
      longitude: 77.5946,
    };

    const result = processCheckIn(request, session, Date.now());
    assert.equal(result.success, false);
    assert.equal(result.status, 'TOKEN_INVALID');
  });

  it('prevents duplicate check-in submissions', () => {
    const session = createAttendanceSession({
      institutionId: 'inst-apex-001',
      facultyId: 'fac-prof-rao',
      courseCode: 'CS401',
      section: 'A',
      title: 'Distributed Systems',
      geofence: mockGeofence,
    });
    attendanceStore.saveSession(session);

    const now = Date.now();
    const tokenObj = generateRevolvingToken(session, now);

    const req: CheckInRequest = {
      sessionId: session.sessionId,
      institutionId: 'inst-apex-001',
      studentId: 'stu-arjun-01',
      studentName: 'Arjun Verma',
      rollNumber: 'CS2026-089',
      token: tokenObj.token,
      latitude: 12.9716,
      longitude: 77.5946,
    };

    // First check-in
    const res1 = processCheckIn(req, session, now);
    assert.equal(res1.success, true);

    // Second check-in attempt
    const res2 = processCheckIn(req, session, now);
    assert.equal(res2.success, false);
    assert.equal(res2.status, 'ALREADY_CHECKED_IN');
  });

  it('enforces multi-tenant isolation and generates regulatory CSV export', () => {
    const session = createAttendanceSession({
      institutionId: 'inst-apex-001',
      facultyId: 'fac-prof-rao',
      courseCode: 'CS401',
      section: 'A',
      title: 'Distributed Systems',
      geofence: mockGeofence,
    });
    attendanceStore.saveSession(session);

    // Cross-tenant check-in attempt throws
    const crossReq: CheckInRequest = {
      sessionId: session.sessionId,
      institutionId: 'inst-other-999',
      studentId: 'stu-foreign',
      studentName: 'Foreign Student',
      rollNumber: 'OTHER-001',
      token: 'dummy',
      latitude: 12.9716,
      longitude: 77.5946,
    };

    assert.throws(() => {
      processCheckIn(crossReq, session);
    }, /CROSS_TENANT_CHECKIN_DENIED/);

    // Valid check-in for summary test
    const tokenObj = generateRevolvingToken(session, Date.now());
    processCheckIn({
      sessionId: session.sessionId,
      institutionId: 'inst-apex-001',
      studentId: 'stu-1',
      studentName: 'Student 1',
      rollNumber: 'CS-01',
      token: tokenObj.token,
      latitude: 12.9716,
      longitude: 77.5946,
    }, session);

    // Summary calculation
    const summary = computeSessionSummary(session, 60);
    assert.equal(summary.totalEnrolled, 60);
    assert.equal(summary.presentCount, 1);
    assert.equal(summary.absentCount, 59);
    assert.ok(summary.attendancePercentage > 0);

    // CSV export
    const csv = exportAttendanceCSV(session);
    assert.ok(csv.includes('Record_ID,Student_ID,Student_Name'));
    assert.ok(csv.includes('Student 1'));
  });
});
