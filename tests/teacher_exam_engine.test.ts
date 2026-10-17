import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ExamProctoringEngine } from '../src/lib/teacher/exams';

describe('TASK-866: Teacher Exam Scheduler & Proctoring Engine', () => {
  let engine: ExamProctoringEngine;

  beforeEach(() => {
    engine = new ExamProctoringEngine();
  });

  test('schedules an exam with strict proctoring thresholds', () => {
    const exam = engine.scheduleExam({
      id: 'EXAM-CS301-2026',
      institutionId: 'inst-apex-001',
      courseCode: 'CS301',
      title: 'Database Systems & Write-Ahead Log Durability',
      department: 'CSE',
      semester: 6,
      startTime: '2026-11-20T10:00:00Z',
      durationMinutes: 120,
      totalMarks: 100,
      proctoringConfig: { maxTabSwitches: 3, autoDisqualifyOnLimit: false },
    });

    assert.equal(exam.id, 'EXAM-CS301-2026');
    assert.equal(exam.department, 'CSE');
    assert.equal(exam.durationMinutes, 120);
    assert.equal(exam.proctoringConfig.maxTabSwitches, 3);
  });

  test('tracks proctoring telemetry and updates integrity score and warning status', () => {
    engine.scheduleExam({
      id: 'EXAM-CS301',
      institutionId: 'inst-apex-001',
      courseCode: 'CS301',
      title: 'Databases',
      department: 'CSE',
      semester: 6,
      startTime: '2026-11-20T10:00:00Z',
      durationMinutes: 60,
      totalMarks: 50,
    });

    const session = engine.startSession({
      sessionId: 'sess-001',
      examId: 'EXAM-CS301',
      studentRoll: 'CS-2026-001',
      institutionId: 'inst-apex-001',
    });

    assert.equal(session.integrityScore, 100);
    assert.equal(session.status, 'active');

    // First tab switch (-15 points -> score 85)
    engine.recordViolation({
      sessionId: 'sess-001',
      institutionId: 'inst-apex-001',
      type: 'TAB_SWITCH',
      details: 'Switched to Chrome DevTools tab',
    });

    // Audio noise spike (-8 points -> score 77 < 80 -> status: warning)
    const updated = engine.recordViolation({
      sessionId: 'sess-001',
      institutionId: 'inst-apex-001',
      type: 'AUDIO_NOISE_SPIKE',
      details: 'Background speech detected',
    });

    assert.equal(updated.tabSwitchCount, 1);
    assert.equal(updated.audioNoiseCount, 1);
    assert.equal(updated.integrityScore, 77);
    assert.equal(updated.status, 'warning');
    assert.equal(updated.violations.length, 2);
  });

  test('transitions to FLAGGED when tab switch limit is reached', () => {
    engine.scheduleExam({
      id: 'EXAM-FLAG-TEST',
      institutionId: 'inst-apex-001',
      courseCode: 'CS301',
      title: 'Databases',
      department: 'CSE',
      semester: 6,
      startTime: '2026-11-20T10:00:00Z',
      durationMinutes: 60,
      totalMarks: 50,
      proctoringConfig: { maxTabSwitches: 2 },
    });

    engine.startSession({
      sessionId: 'sess-flag',
      examId: 'EXAM-FLAG-TEST',
      studentRoll: 'CS-02',
      institutionId: 'inst-apex-001',
    });

    engine.recordViolation({ sessionId: 'sess-flag', institutionId: 'inst-apex-001', type: 'TAB_SWITCH' });
    const flaggedSession = engine.recordViolation({ sessionId: 'sess-flag', institutionId: 'inst-apex-001', type: 'TAB_SWITCH' });

    assert.equal(flaggedSession.tabSwitchCount, 2);
    assert.equal(flaggedSession.status, 'flagged');
  });

  test('auto-disqualifies student when autoDisqualifyOnLimit is true', () => {
    engine.scheduleExam({
      id: 'EXAM-STRICT',
      institutionId: 'inst-apex-001',
      courseCode: 'CS301',
      title: 'Databases',
      department: 'CSE',
      semester: 6,
      startTime: '2026-11-20T10:00:00Z',
      durationMinutes: 60,
      totalMarks: 50,
      proctoringConfig: { maxTabSwitches: 1, autoDisqualifyOnLimit: true },
    });

    engine.startSession({
      sessionId: 'sess-dq',
      examId: 'EXAM-STRICT',
      studentRoll: 'CS-03',
      institutionId: 'inst-apex-001',
    });

    engine.recordViolation({ sessionId: 'sess-dq', institutionId: 'inst-apex-001', type: 'TAB_SWITCH' });
    const dqSession = engine.recordViolation({ sessionId: 'sess-dq', institutionId: 'inst-apex-001', type: 'TAB_SWITCH' });

    assert.equal(dqSession.status, 'disqualified');
  });

  test('aggregates real-time exam proctoring summary correctly', () => {
    engine.scheduleExam({
      id: 'EXAM-SUMMARY',
      institutionId: 'inst-apex-001',
      courseCode: 'CS301',
      title: 'Databases',
      department: 'CSE',
      semester: 6,
      startTime: '2026-11-20T10:00:00Z',
      durationMinutes: 60,
      totalMarks: 50,
    });

    engine.startSession({ sessionId: 's1', examId: 'EXAM-SUMMARY', studentRoll: 'CS-01', institutionId: 'inst-apex-001' });
    engine.startSession({ sessionId: 's2', examId: 'EXAM-SUMMARY', studentRoll: 'CS-02', institutionId: 'inst-apex-001' });
    engine.startSession({ sessionId: 's3', examId: 'EXAM-SUMMARY', studentRoll: 'CS-03', institutionId: 'inst-apex-001' });

    // s2 -> warning
    engine.recordViolation({ sessionId: 's2', institutionId: 'inst-apex-001', type: 'TAB_SWITCH' });
    engine.recordViolation({ sessionId: 's2', institutionId: 'inst-apex-001', type: 'AUDIO_NOISE_SPIKE' });

    // s3 -> manual disqualification
    engine.disqualifySession('s3', 'inst-apex-001', 'Unauthorized physical material found');

    const summary = engine.getExamSummary('EXAM-SUMMARY', 'inst-apex-001');
    assert.equal(summary.totalCandidates, 3);
    assert.equal(summary.activeCount, 1);
    assert.equal(summary.warningCount, 1);
    assert.equal(summary.disqualifiedCount, 1);
    assert.ok(summary.averageIntegrityScore > 0);
  });

  test('strictly blocks cross-tenant proctoring session access', () => {
    engine.scheduleExam({
      id: 'EXAM-METRO',
      institutionId: 'inst-metro-002',
      courseCode: 'ECE201',
      title: 'Signals',
      department: 'ECE',
      semester: 4,
      startTime: '2026-11-20T10:00:00Z',
      durationMinutes: 60,
      totalMarks: 50,
    });

    assert.throws(() => {
      engine.startSession({
        sessionId: 'sess-cross',
        examId: 'EXAM-METRO',
        studentRoll: 'CS-01',
        institutionId: 'inst-apex-001', // Mismatched tenant
      });
    }, /Tenant mismatch/);
  });
});
