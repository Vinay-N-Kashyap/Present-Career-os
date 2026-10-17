'use client';

import React, { useState, useEffect } from 'react';
import {
  ExamProctoringEngine,
  ExamSchedule,
  ProctoringSession,
} from '@/lib/teacher/exams';

const examEngine = new ExamProctoringEngine();

export default function ExamSchedulerMonitor() {
  const institutionId = 'inst-apex-001';
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('EXAM-APEX-CS301');
  const [sessions, setSessions] = useState<ProctoringSession[]>([]);
  const [activeSessionModal, setActiveSessionModal] = useState<ProctoringSession | null>(null);

  // Pre-seed mock exam and proctoring candidates
  useEffect(() => {
    let existing = examEngine.getExamsByInstitution(institutionId);
    if (existing.length === 0) {
      examEngine.scheduleExam({
        id: 'EXAM-APEX-CS301',
        institutionId,
        courseCode: 'CS301',
        title: 'Database Internals & B+ Tree WAL Durability',
        department: 'CSE',
        semester: 6,
        startTime: '2026-11-20T10:00:00Z',
        durationMinutes: 90,
        totalMarks: 100,
        proctoringConfig: { maxTabSwitches: 3, webcamRequired: true, audioDetection: true },
      });

      examEngine.scheduleExam({
        id: 'EXAM-APEX-CS302',
        institutionId,
        courseCode: 'CS302',
        title: 'Distributed Consensus & Raft Invariants',
        department: 'CSE',
        semester: 6,
        startTime: '2026-11-22T14:00:00Z',
        durationMinutes: 120,
        totalMarks: 100,
      });

      // Pre-seed candidate sessions
      examEngine.startSession({
        sessionId: 'sess-01',
        examId: 'EXAM-APEX-CS301',
        studentRoll: 'CS-2026-001',
        institutionId,
      });

      examEngine.startSession({
        sessionId: 'sess-02',
        examId: 'EXAM-APEX-CS301',
        studentRoll: 'CS-2026-014',
        institutionId,
      });

      examEngine.startSession({
        sessionId: 'sess-03',
        examId: 'EXAM-APEX-CS301',
        studentRoll: 'CS-2026-022',
        institutionId,
      });

      // Give sess-02 tab switches & audio noise to trigger warning/flagged
      examEngine.recordViolation({
        sessionId: 'sess-02',
        institutionId,
        type: 'TAB_SWITCH',
        details: 'Navigated away to browser window (Google Search)',
      });
      examEngine.recordViolation({
        sessionId: 'sess-02',
        institutionId,
        type: 'TAB_SWITCH',
        details: 'Navigated to clipboard manager',
      });
      examEngine.recordViolation({
        sessionId: 'sess-02',
        institutionId,
        type: 'AUDIO_NOISE_SPIKE',
        details: 'Second voice conversational audio detected (48dB)',
      });

      // Give sess-03 minor gaze violation
      examEngine.recordViolation({
        sessionId: 'sess-03',
        institutionId,
        type: 'GAZE_AWAY',
        details: 'Eyes directed off-screen for 8 consecutive seconds',
      });
    }

    refresh();
  }, [institutionId]);

  const refresh = () => {
    setExams(examEngine.getExamsByInstitution(institutionId));
    setSessions(examEngine.getSessionsByExam(selectedExamId, institutionId));
  };

  const selectedExam = exams.find((e) => e.id === selectedExamId) || exams[0];
  const summary = selectedExam ? examEngine.getExamSummary(selectedExam.id, institutionId) : null;

  const handleDisqualify = (sessionId: string) => {
    examEngine.disqualifySession(sessionId, institutionId, 'Proctor manual intervention: Unauthorized aid confirmed');
    setActiveSessionModal(null);
    refresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header & Exam Selector */}
      <div style={{
        background: 'var(--card, #0f172a)',
        border: '1px solid #1e293b',
        borderRadius: 12,
        padding: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Proctored Examinations</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0 0', color: '#f8fafc' }}>
            Live Proctoring & Telemetry Control
          </h1>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
            Active Exam: <b style={{ color: '#818cf8' }}>{selectedExam?.title}</b> ({selectedExam?.courseCode})
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <select
            value={selectedExamId}
            onChange={(e) => {
              setSelectedExamId(e.target.value);
              setSessions(examEngine.getSessionsByExam(e.target.value, institutionId));
            }}
            style={{
              padding: '9px 14px',
              borderRadius: 8,
              background: '#020617',
              color: '#f8fafc',
              border: '1px solid #334155',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.courseCode}: {ex.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Proctoring Summary Cards */}
      {summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16
        }}>
          <div style={{
            background: 'var(--card, #0f172a)',
            border: '1px solid #1e293b',
            borderRadius: 12,
            padding: 20,
            borderLeft: '4px solid #10b981'
          }}>
            <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Active Candidates</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#10b981' }}>
              {summary.activeCount} <span style={{ fontSize: 16, color: '#94a3b8', fontWeight: 400 }}>/ {summary.totalCandidates}</span>
            </div>
            <div style={{ fontSize: 12, color: '#86efac', marginTop: 4 }}>Clean integrity standing</div>
          </div>

          <div style={{
            background: 'var(--card, #0f172a)',
            border: '1px solid #1e293b',
            borderRadius: 12,
            padding: 20,
            borderLeft: '4px solid #f59e0b'
          }}>
            <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Warnings Triggered</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#f59e0b' }}>
              {summary.warningCount}
            </div>
            <div style={{ fontSize: 12, color: '#fde68a', marginTop: 4 }}>Tab switches or gaze anomalies</div>
          </div>

          <div style={{
            background: 'var(--card, #0f172a)',
            border: '1px solid #1e293b',
            borderRadius: 12,
            padding: 20,
            borderLeft: '4px solid #ef4444'
          }}>
            <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Flagged / Review</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#ef4444' }}>
              {summary.flaggedCount + summary.disqualifiedCount}
            </div>
            <div style={{ fontSize: 12, color: '#fca5a5', marginTop: 4 }}>High-probability misconduct</div>
          </div>

          <div style={{
            background: 'var(--card, #0f172a)',
            border: '1px solid #1e293b',
            borderRadius: 12,
            padding: 20,
            borderLeft: '4px solid #6366f1'
          }}>
            <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Avg Integrity Index</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#818cf8' }}>
              {summary.averageIntegrityScore} <span style={{ fontSize: 16, color: '#94a3b8', fontWeight: 400 }}>/ 100</span>
            </div>
            <div style={{ fontSize: 12, color: '#a5b4fc', marginTop: 4 }}>Cohort algorithmic trust score</div>
          </div>
        </div>
      )}

      {/* Live Candidate Sessions Grid */}
      <div style={{
        background: 'var(--card, #0f172a)',
        borderRadius: 12,
        border: '1px solid #1e293b',
        padding: 24
      }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px 0', color: '#f8fafc' }}>
          Live Candidate Webcams & Telemetry Stream ({sessions.length})
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 16
        }}>
          {sessions.map((sess) => (
            <div
              key={sess.sessionId}
              style={{
                background: '#020617',
                border: `1px solid ${
                  sess.status === 'disqualified'
                    ? '#ef4444'
                    : sess.status === 'flagged'
                    ? '#f87171'
                    : sess.status === 'warning'
                    ? '#f59e0b'
                    : '#1e293b'
                }`,
                borderRadius: 10,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 14
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: 15 }}>
                    {sess.studentRoll}
                  </div>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    background:
                      sess.status === 'active'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : sess.status === 'warning'
                        ? 'rgba(245, 158, 11, 0.15)'
                        : 'rgba(239, 68, 68, 0.15)',
                    color:
                      sess.status === 'active'
                        ? '#10b981'
                        : sess.status === 'warning'
                        ? '#f59e0b'
                        : '#ef4444'
                  }}>
                    {sess.status.toUpperCase()}
                  </span>
                </div>

                {/* Simulated Webcam Viewport */}
                <div style={{
                  height: 120,
                  background: '#090d16',
                  borderRadius: 6,
                  border: '1px solid #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  marginBottom: 10
                }}>
                  <span style={{ fontSize: 32 }}>📹</span>
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: 'rgba(0,0,0,0.6)',
                    color: '#10b981',
                    fontFamily: 'monospace'
                  }}>
                    LIVE ● 30fps
                  </div>
                </div>

                {/* Telemetry Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, fontSize: 11, color: '#94a3b8' }}>
                  <div>Tabs: <b style={{ color: sess.tabSwitchCount > 0 ? '#ef4444' : '#f8fafc' }}>{sess.tabSwitchCount}</b></div>
                  <div>Gaze: <b style={{ color: sess.gazeAnomalyCount > 0 ? '#f59e0b' : '#f8fafc' }}>{sess.gazeAnomalyCount}</b></div>
                  <div>Audio: <b style={{ color: sess.audioNoiseCount > 0 ? '#f59e0b' : '#f8fafc' }}>{sess.audioNoiseCount}</b></div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: '#94a3b8' }}>Integrity Score</span>
                    <span style={{ fontWeight: 700, color: sess.integrityScore >= 80 ? '#10b981' : '#f59e0b' }}>
                      {sess.integrityScore}%
                    </span>
                  </div>
                  <div style={{ height: 6, background: '#1e293b', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${sess.integrityScore}%`,
                      background: sess.integrityScore >= 80 ? '#10b981' : sess.integrityScore >= 50 ? '#f59e0b' : '#ef4444'
                    }} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveSessionModal(sess)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 6,
                  background: '#1e293b',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Inspect Telemetry Log
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Session Details Modal */}
      {activeSessionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 20
        }}>
          <div style={{
            background: '#0f172a',
            borderRadius: 14,
            border: '1px solid #334155',
            width: '100%',
            maxWidth: 580,
            padding: 28,
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  Candidate Proctoring Log: {activeSessionModal.studentRoll}
                </h3>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Session ID: {activeSessionModal.sessionId}</span>
              </div>
              <button
                onClick={() => setActiveSessionModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 8 }}>Recorded Violation Events ({activeSessionModal.violations.length}):</div>
              {activeSessionModal.violations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
                  {activeSessionModal.violations.map((v, i) => (
                    <div key={i} style={{ padding: 10, borderRadius: 6, background: '#020617', border: '1px solid #1e293b', fontSize: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#f87171' }}>
                        <span>{v.type}</span>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{v.timestamp.slice(11, 19)}</span>
                      </div>
                      <div style={{ color: '#cbd5e1', marginTop: 2 }}>{v.details}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: '#10b981', padding: 12, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 6 }}>
                  ✓ Clean Session: No integrity infractions or anomalies detected.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setActiveSessionModal(null)}
                style={{ padding: '9px 16px', borderRadius: 6, background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', cursor: 'pointer', fontSize: 13 }}
              >
                Close
              </button>
              {activeSessionModal.status !== 'disqualified' && (
                <button
                  onClick={() => handleDisqualify(activeSessionModal.sessionId)}
                  style={{ padding: '9px 18px', borderRadius: 6, background: '#ef4444', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
                >
                  Disqualify Session
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
