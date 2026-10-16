'use client';

import React, { useState, useEffect } from 'react';
import { 
  AttendanceSession, 
  AttendanceRecord, 
  AttendanceSessionSummary,
  createAttendanceSession,
  generateRevolvingToken,
  computeSessionSummary,
  exportAttendanceCSV,
  attendanceStore,
  ClassroomGeofence
} from '@/lib/teacher/attendance';

interface LiveAttendanceSessionProps {
  institutionId?: string;
  facultyId?: string;
}

const DEFAULT_GEOFENCES: ClassroomGeofence[] = [
  { name: 'CS Lecture Hall 402', latitude: 12.9716, longitude: 77.5946, radiusMeters: 50 },
  { name: 'ECE Seminar Hall A', latitude: 12.9725, longitude: 77.5950, radiusMeters: 45 },
  { name: 'Main Campus Auditorium', latitude: 12.9700, longitude: 77.5930, radiusMeters: 100 },
];

export const LiveAttendanceSession: React.FC<LiveAttendanceSessionProps> = ({
  institutionId = 'inst-apex-001',
  facultyId = 'fac-prof-rao'
}) => {
  const [courseCode, setCourseCode] = useState('CS401');
  const [section, setSection] = useState('A');
  const [sessionTitle, setSessionTitle] = useState('Distributed Systems & Consensus');
  const [selectedGeofence, setSelectedGeofence] = useState<ClassroomGeofence>(DEFAULT_GEOFENCES[0]);
  const [totalEnrolled, setTotalEnrolled] = useState(60);

  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
  const [currentToken, setCurrentToken] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSessionSummary | null>(null);

  // Initialize or start session
  const handleStartSession = () => {
    const session = createAttendanceSession({
      institutionId,
      facultyId,
      courseCode,
      section,
      title: sessionTitle,
      geofence: selectedGeofence,
      lateAfterMinutes: 10,
      rotationSeconds: 15,
    });
    attendanceStore.saveSession(session);
    setActiveSession(session);

    // Initial token
    const tokenObj = generateRevolvingToken(session);
    setCurrentToken(tokenObj.token);
    setSecondsRemaining(tokenObj.windowExpiresInSeconds);
    setRecords([]);
    setSummary(computeSessionSummary(session, totalEnrolled));
  };

  const handleStopSession = () => {
    if (activeSession) {
      activeSession.isActive = false;
      setActiveSession({ ...activeSession, isActive: false });
    }
  };

  // Timer loop for revolving TOTP QR token
  useEffect(() => {
    if (!activeSession || !activeSession.isActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const tokenObj = generateRevolvingToken(activeSession, now);
      setCurrentToken(tokenObj.token);
      setSecondsRemaining(tokenObj.windowExpiresInSeconds);
      
      // Refresh records and summary
      const currentRecords = attendanceStore.getRecords(activeSession.sessionId, activeSession.institutionId);
      setRecords([...currentRecords]);
      setSummary(computeSessionSummary(activeSession, totalEnrolled));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, totalEnrolled]);

  // Simulate a test student check-in
  const handleSimulateCheckIn = (isLate = false, isProxy = false) => {
    if (!activeSession || !activeSession.isActive) return;

    const studentNum = Math.floor(Math.random() * 80) + 1;
    const studentId = `stu-sim-${studentNum}`;
    const name = `Student ${studentNum}`;
    const roll = `CS2026-${String(studentNum).padStart(3, '0')}`;

    const dist = isProxy ? 450 : Math.round(Math.random() * 20 * 10) / 10;
    const status = isProxy ? 'GEOFENCE_FAILED' : isLate ? 'LATE' : 'PRESENT';

    const newRecord: AttendanceRecord = {
      recordId: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sessionId: activeSession.sessionId,
      studentId,
      studentName: name,
      rollNumber: roll,
      institutionId: activeSession.institutionId,
      timestamp: new Date().toISOString(),
      status,
      distanceMeters: dist,
      ipAddress: isProxy ? '192.168.1.100 (Hostel)' : '10.0.14.88 (Campus-WiFi)',
      verifiedBy: 'QR_TOTP',
    };

    attendanceStore.recordCheckIn(newRecord);
    setRecords([...attendanceStore.getRecords(activeSession.sessionId, activeSession.institutionId)]);
    setSummary(computeSessionSummary(activeSession, totalEnrolled));
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!activeSession) return;
    const csvData = exportAttendanceCSV(activeSession);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Attendance_${activeSession.courseCode}_${activeSession.section}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Session Controls */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">📱</span>
              Dynamic Geofenced Attendance Hub
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Rotating 15-second cryptographic TOTP QR codes with classroom geofencing and anti-proxy protection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!activeSession || !activeSession.isActive ? (
              <button
                onClick={handleStartSession}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-lg shadow-emerald-500/20"
              >
                <span>▶</span>
                Start Live Session
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStopSession}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-semibold transition"
                >
                  <span>⏹</span>
                  End Session
                </button>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition"
                >
                  <span>📥</span>
                  Export CSV
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Configuration inputs if session not started */}
        {(!activeSession || !activeSession.isActive) && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Course Code
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={e => setCourseCode(e.target.value)}
                className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Section
              </label>
              <input
                type="text"
                value={section}
                onChange={e => setSection(e.target.value)}
                className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Classroom Geofence
              </label>
              <select
                value={selectedGeofence.name}
                onChange={e => {
                  const g = DEFAULT_GEOFENCES.find(item => item.name === e.target.value);
                  if (g) setSelectedGeofence(g);
                }}
                className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
              >
                {DEFAULT_GEOFENCES.map(g => (
                  <option key={g.name} value={g.name}>
                    {g.name} ({g.radiusMeters}m radius)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Enrolled Strength
              </label>
              <input
                type="number"
                value={totalEnrolled}
                onChange={e => setTotalEnrolled(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Live Display Area */}
      {activeSession && activeSession.isActive && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rotating QR Stage */}
          <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full mb-4">
              <span className="animate-spin text-sm">🔄</span>
              Revolving Token (15s Window)
            </div>

            {/* Visual Simulated QR Container */}
            <div className="relative w-64 h-64 bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-2xl shadow-indigo-500/10 border-4 border-slate-700">
              {/* Pseudo QR matrix pattern */}
              <div className="w-full h-full bg-slate-950 rounded-lg p-3 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-12 h-12 bg-white rounded p-1 flex items-center justify-center">
                    <div className="w-6 h-6 bg-slate-950 rounded-sm" />
                  </div>
                  <div className="w-12 h-12 bg-white rounded p-1 flex items-center justify-center">
                    <div className="w-6 h-6 bg-slate-950 rounded-sm" />
                  </div>
                </div>
                <div className="text-center font-mono text-[9px] text-emerald-400 break-all px-2 select-all">
                  {currentToken.slice(0, 32)}...
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-12 h-12 bg-white rounded p-1 flex items-center justify-center">
                    <div className="w-6 h-6 bg-slate-950 rounded-sm" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                    {secondsRemaining}s
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown Bar */}
            <div className="w-full mt-5">
              <div className="flex justify-between text-xs text-slate-400 font-mono mb-1.5">
                <span>QR Token Refresh</span>
                <span className="text-indigo-400 font-bold">{secondsRemaining} seconds</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${(secondsRemaining / 15) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-rose-400">📍</span>
              <span>{activeSession.geofence.name}</span>
              <span className="text-slate-600">•</span>
              <span>Radius: {activeSession.geofence.radiusMeters}m</span>
            </div>

            {/* Simulator buttons for live demo testing */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 w-full flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Demo Simulator</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSimulateCheckIn(false, false)}
                  className="px-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30 transition"
                >
                  + Present
                </button>
                <button
                  onClick={() => handleSimulateCheckIn(true, false)}
                  className="px-2 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30 transition"
                >
                  + Late
                </button>
                <button
                  onClick={() => handleSimulateCheckIn(false, true)}
                  className="px-2 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium border border-rose-500/30 transition"
                >
                  + Proxy (Blocked)
                </button>
              </div>
            </div>
          </div>

          {/* Real-Time Metrics & Attendance Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* KPI Cards */}
            {summary && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Attended</span>
                    <span className="text-emerald-400">✓</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {summary.presentCount + summary.lateCount}{' '}
                    <span className="text-xs text-slate-500 font-normal">/ {summary.totalEnrolled}</span>
                  </div>
                  <div className="text-xs text-emerald-400 mt-1 font-semibold">
                    {summary.attendancePercentage}% turn-out
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">On-Time</span>
                    <span className="text-indigo-400">⏱</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{summary.presentCount}</div>
                  <div className="text-xs text-slate-400 mt-1">Within grace window</div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Late Arrivals</span>
                    <span className="text-amber-400">⏳</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{summary.lateCount}</div>
                  <div className="text-xs text-amber-400 mt-1">After 10 min cutoff</div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Proxy Blocked</span>
                    <span className="text-rose-400">🛡</span>
                  </div>
                  <div className="text-2xl font-bold text-rose-400">{summary.proxyAttemptsBlocked}</div>
                  <div className="text-xs text-slate-400 mt-1">Outside geofence</div>
                </div>
              </div>
            )}

            {/* Check-In Roster Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>👥</span>
                  Live Attendance Feed ({records.length})
                </h3>
              </div>

              {records.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Waiting for students to scan the QR code...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3">Student</th>
                        <th className="pb-3">Roll Number</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Distance</th>
                        <th className="pb-3">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {records.slice().reverse().map(record => (
                        <tr key={record.recordId} className="hover:bg-slate-800/30 transition">
                          <td className="py-3 font-medium text-white">{record.studentName}</td>
                          <td className="py-3 text-slate-400 font-mono text-xs">{record.rollNumber}</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                              record.status === 'PRESENT'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : record.status === 'LATE'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-400 text-xs font-mono">
                            {record.distanceMeters}m
                          </td>
                          <td className="py-3 text-slate-500 text-xs">
                            {new Date(record.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
