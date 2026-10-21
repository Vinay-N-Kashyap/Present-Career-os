/**
 * Faculty Dynamic Attendance & Geofenced QR Check-In Engine (TASK-871)
 * 
 * Provides:
 * 1. Revolving TOTP-based QR token generation (15s rotation) with HMAC signatures to prevent screen forwarding.
 * 2. Haversine geofence verification calculating distance in meters against classroom coordinates.
 * 3. Multi-status attendance evaluation (PRESENT, LATE, GEOFENCE_FAILED, TOKEN_EXPIRED, PROXY_BLOCKED).
 * 4. Idempotent check-in recording and multi-tenant isolation.
 * 5. Cohort attendance aggregation and regulatory CSV compliance export.
 */

import { createHmac, randomBytes } from 'crypto';

export interface ClassroomGeofence {
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number; // e.g. 50 meters
  allowedSubnet?: string; // Optional IP subnet CIDR for campus Wi-Fi validation
}

export type AttendanceStatus = 
  | 'PRESENT'
  | 'LATE'
  | 'GEOFENCE_FAILED'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'ALREADY_CHECKED_IN'
  | 'MANUAL_OVERRIDE';

export interface AttendanceRecord {
  recordId: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  institutionId: string;
  timestamp: string;
  status: AttendanceStatus;
  distanceMeters: number;
  ipAddress?: string;
  verifiedBy: 'QR_TOTP' | 'MANUAL_FACULTY';
}

export interface AttendanceSession {
  sessionId: string;
  institutionId: string;
  facultyId: string;
  courseCode: string;
  section: string;
  title: string;
  startTime: string;
  lateAfterMinutes: number;
  isActive: boolean;
  geofence: ClassroomGeofence;
  secretKey: string; // HMAC secret for revolving QR tokens
  rotationSeconds: number; // default 15
}

export interface CheckInRequest {
  sessionId: string;
  institutionId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  token: string;
  latitude: number;
  longitude: number;
  ipAddress?: string;
  timestamp?: string; // Defaults to now
}

export interface AttendanceSessionSummary {
  sessionId: string;
  courseCode: string;
  section: string;
  totalEnrolled: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  proxyAttemptsBlocked: number;
  attendancePercentage: number;
  averageDistanceMeters: number;
}

// Earth radius in meters for Haversine
const EARTH_RADIUS_METERS = 6371000;

/**
 * Calculates Great-Circle distance in meters between two lat/lon coordinates using Haversine formula
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_METERS * c * 10) / 10;
}

/**
 * Creates an active faculty attendance session
 */
export function createAttendanceSession(params: {
  sessionId?: string;
  institutionId: string;
  facultyId: string;
  courseCode: string;
  section: string;
  title: string;
  geofence: ClassroomGeofence;
  lateAfterMinutes?: number;
  rotationSeconds?: number;
}): AttendanceSession {
  if (!params.institutionId || !params.facultyId || !params.courseCode) {
    throw new Error('MISSING_REQUIRED_SESSION_FIELDS');
  }

  return {
    sessionId: params.sessionId || `sess_${Date.now()}_${randomBytes(4).toString('hex')}`,
    institutionId: params.institutionId,
    facultyId: params.facultyId,
    courseCode: params.courseCode,
    section: params.section,
    title: params.title,
    startTime: new Date().toISOString(),
    lateAfterMinutes: params.lateAfterMinutes ?? 10,
    isActive: true,
    geofence: params.geofence,
    secretKey: randomBytes(16).toString('hex'),
    rotationSeconds: params.rotationSeconds ?? 15,
  };
}

/**
 * Generates dynamic revolving QR token for an active session
 * Token encodes: sessionId:timeWindow:signature
 */
export function generateRevolvingToken(
  session: AttendanceSession,
  currentTimeMs: number = Date.now()
): { token: string; windowExpiresInSeconds: number; windowIndex: number } {
  if (!session.isActive) {
    throw new Error('SESSION_NOT_ACTIVE');
  }

  const windowSec = session.rotationSeconds;
  const windowIndex = Math.floor(currentTimeMs / (windowSec * 1000));
  const remainingSec = windowSec - Math.floor((currentTimeMs / 1000) % windowSec);

  const payload = `${session.sessionId}:${session.institutionId}:${windowIndex}`;
  const signature = createHmac('sha256', session.secretKey)
    .update(payload)
    .digest('hex')
    .slice(0, 16);

  const token = `${session.sessionId}.${windowIndex}.${signature}`;

  return {
    token,
    windowExpiresInSeconds: remainingSec,
    windowIndex,
  };
}

/**
 * In-memory multi-tenant attendance registry
 */
class AttendanceStore {
  private sessions: Map<string, AttendanceSession> = new Map();
  private records: Map<string, AttendanceRecord[]> = new Map(); // sessionId -> records

  public saveSession(session: AttendanceSession): void {
    this.sessions.set(session.sessionId, session);
    if (!this.records.has(session.sessionId)) {
      this.records.set(session.sessionId, []);
    }
  }

  public getSession(sessionId: string, institutionId: string): AttendanceSession | null {
    const sess = this.sessions.get(sessionId);
    if (!sess) return null;
    if (sess.institutionId !== institutionId) {
      throw new Error(`CROSS_TENANT_ACCESS_DENIED: Session ${sessionId} does not belong to ${institutionId}`);
    }
    return sess;
  }

  public getRecords(sessionId: string, institutionId: string): AttendanceRecord[] {
    this.getSession(sessionId, institutionId); // Enforce tenant check
    return this.records.get(sessionId) || [];
  }

  public recordCheckIn(record: AttendanceRecord): void {
    const list = this.records.get(record.sessionId) || [];
    list.push(record);
    this.records.set(record.sessionId, list);
  }

  public clear(): void {
    this.sessions.clear();
    this.records.clear();
  }
}

export const attendanceStore = new AttendanceStore();

/**
 * Validates check-in request and records attendance
 */
export function processCheckIn(
  request: CheckInRequest,
  session: AttendanceSession,
  currentTimeMs: number = Date.now()
): { success: boolean; status: AttendanceStatus; record?: AttendanceRecord; reason?: string } {
  // 1. Multi-tenant boundary check
  if (session.institutionId !== request.institutionId) {
    throw new Error(`CROSS_TENANT_CHECKIN_DENIED: Expected ${session.institutionId}, got ${request.institutionId}`);
  }

  if (!session.isActive) {
    return { success: false, status: 'TOKEN_EXPIRED', reason: 'Session is no longer active' };
  }

  // 2. Check for duplicate submission
  const existingRecords = attendanceStore.getRecords(session.sessionId, session.institutionId);
  const alreadyCheckedIn = existingRecords.some(
    r => r.studentId === request.studentId && (r.status === 'PRESENT' || r.status === 'LATE' || r.status === 'MANUAL_OVERRIDE')
  );
  if (alreadyCheckedIn) {
    return { success: false, status: 'ALREADY_CHECKED_IN', reason: 'Student has already been marked present for this session' };
  }

  // 3. Verify TOTP Token
  const parts = request.token.split('.');
  if (parts.length !== 3) {
    return { success: false, status: 'TOKEN_INVALID', reason: 'Malformed QR token format' };
  }

  const [tSessionId, tWindowStr, tSignature] = parts;
  if (tSessionId !== session.sessionId) {
    return { success: false, status: 'TOKEN_INVALID', reason: 'Token belongs to a different session' };
  }

  const tokenWindowIndex = parseInt(tWindowStr, 10);
  const currentWindowIndex = Math.floor(currentTimeMs / (session.rotationSeconds * 1000));

  // Allow current window or immediately preceding window (1-window tolerance for network latency)
  const isWindowValid = tokenWindowIndex === currentWindowIndex || tokenWindowIndex === currentWindowIndex - 1;
  if (!isWindowValid) {
    return { success: false, status: 'TOKEN_EXPIRED', reason: 'QR Code has expired, please scan the updated screen' };
  }

  // Validate HMAC signature
  const expectedPayload = `${session.sessionId}:${session.institutionId}:${tokenWindowIndex}`;
  const expectedSig = createHmac('sha256', session.secretKey)
    .update(expectedPayload)
    .digest('hex')
    .slice(0, 16);

  if (tSignature !== expectedSig) {
    return { success: false, status: 'TOKEN_INVALID', reason: 'Cryptographic QR signature mismatch (tampering detected)' };
  }

  // 4. Geofence Verification
  const distance = calculateHaversineDistance(
    request.latitude,
    request.longitude,
    session.geofence.latitude,
    session.geofence.longitude
  );

  const withinGeofence = distance <= session.geofence.radiusMeters;
  if (!withinGeofence) {
    const blockedRecord: AttendanceRecord = {
      recordId: `rec_${Date.now()}_${randomBytes(3).toString('hex')}`,
      sessionId: session.sessionId,
      studentId: request.studentId,
      studentName: request.studentName,
      rollNumber: request.rollNumber,
      institutionId: session.institutionId,
      timestamp: new Date(currentTimeMs).toISOString(),
      status: 'GEOFENCE_FAILED',
      distanceMeters: distance,
      ipAddress: request.ipAddress,
      verifiedBy: 'QR_TOTP',
    };
    attendanceStore.recordCheckIn(blockedRecord);

    return {
      success: false,
      status: 'GEOFENCE_FAILED',
      record: blockedRecord,
      reason: `Geofence check failed: You are ${distance}m away (max allowed ${session.geofence.radiusMeters}m)`,
    };
  }

  // 5. Determine PRESENT vs LATE
  const sessionStartMs = new Date(session.startTime).getTime();
  const elapsedMinutes = (currentTimeMs - sessionStartMs) / (1000 * 60);
  const isLate = elapsedMinutes > session.lateAfterMinutes;
  const finalStatus: AttendanceStatus = isLate ? 'LATE' : 'PRESENT';

  const validRecord: AttendanceRecord = {
    recordId: `rec_${Date.now()}_${randomBytes(3).toString('hex')}`,
    sessionId: session.sessionId,
    studentId: request.studentId,
    studentName: request.studentName,
    rollNumber: request.rollNumber,
    institutionId: session.institutionId,
    timestamp: new Date(currentTimeMs).toISOString(),
    status: finalStatus,
    distanceMeters: distance,
    ipAddress: request.ipAddress,
    verifiedBy: 'QR_TOTP',
  };

  attendanceStore.recordCheckIn(validRecord);

  return {
    success: true,
    status: finalStatus,
    record: validRecord,
  };
}

/**
 * Computes live session attendance analytics
 */
export function computeSessionSummary(
  session: AttendanceSession,
  totalEnrolled: number
): AttendanceSessionSummary {
  const records = attendanceStore.getRecords(session.sessionId, session.institutionId);

  let presentCount = 0;
  let lateCount = 0;
  let proxyAttemptsBlocked = 0;
  let totalDistance = 0;
  let validRecordsCount = 0;

  for (const r of records) {
    if (r.status === 'PRESENT' || r.status === 'MANUAL_OVERRIDE') {
      presentCount++;
      totalDistance += r.distanceMeters;
      validRecordsCount++;
    } else if (r.status === 'LATE') {
      lateCount++;
      totalDistance += r.distanceMeters;
      validRecordsCount++;
    } else if (r.status === 'GEOFENCE_FAILED' || r.status === 'TOKEN_INVALID') {
      proxyAttemptsBlocked++;
    }
  }

  const effectiveAttended = presentCount + lateCount;
  const absentCount = Math.max(0, totalEnrolled - effectiveAttended);
  const attendancePercentage = totalEnrolled > 0
    ? Math.round((effectiveAttended / totalEnrolled) * 1000) / 10
    : 0;

  const avgDistance = validRecordsCount > 0
    ? Math.round((totalDistance / validRecordsCount) * 10) / 10
    : 0;

  return {
    sessionId: session.sessionId,
    courseCode: session.courseCode,
    section: session.section,
    totalEnrolled,
    presentCount,
    lateCount,
    absentCount,
    proxyAttemptsBlocked,
    attendancePercentage,
    averageDistanceMeters: avgDistance,
  };
}

/**
 * Exports standardized attendance CSV for university administration
 */
export function exportAttendanceCSV(session: AttendanceSession): string {
  const records = attendanceStore.getRecords(session.sessionId, session.institutionId);

  const headers = [
    'Record_ID',
    'Student_ID',
    'Student_Name',
    'Roll_Number',
    'Course_Code',
    'Section',
    'Status',
    'Distance_Meters',
    'Timestamp',
    'Verified_By',
  ];

  const rows = records.map(r => [
    `"${r.recordId}"`,
    `"${r.studentId}"`,
    `"${r.studentName}"`,
    `"${r.rollNumber}"`,
    `"${session.courseCode}"`,
    `"${session.section}"`,
    `"${r.status}"`,
    r.distanceMeters,
    `"${r.timestamp}"`,
    `"${r.verifiedBy}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
