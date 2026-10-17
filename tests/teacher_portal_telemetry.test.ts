import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateStudentRisk,
  analyzeCohortTelemetry,
  StudentTelemetryInput,
} from '../src/lib/teacher/telemetry';

describe('TASK-855: Live Class Engagement Telemetry & Student Risk Early Warning Radar', () => {
  test('evaluates high-performing engaged student as SAFE', () => {
    const student: StudentTelemetryInput = {
      studentRoll: 'CS-001',
      fullName: 'Aarav Sharma',
      department: 'CSE',
      institutionId: 'inst-apex-001',
      attendancePercentage: 92,
      codingQuestCompletionRate: 95,
      quizAverage: 88,
      communicationLabScore: 90,
      assignmentSubmissionRate: 100,
      daysSinceLastActive: 1,
    };

    const profile = evaluateStudentRisk(student);
    assert.equal(profile.riskLevel, 'SAFE');
    assert.equal(profile.riskScore, 0);
    assert.equal(profile.parentMeetingRecommended, false);
    assert.equal(profile.contributingFactors.length, 0);
  });

  test('detects MODERATE risk student with borderline attendance and lagging quests', () => {
    const student: StudentTelemetryInput = {
      studentRoll: 'CS-002',
      fullName: 'Priya Verma',
      department: 'CSE',
      institutionId: 'inst-apex-001',
      attendancePercentage: 72, // Borderline (<75% -> 18 risk)
      codingQuestCompletionRate: 55, // Lagging (<65% -> 12 risk)
      quizAverage: 55, // Sub-par (<60% -> 8 risk)
      communicationLabScore: 70,
      assignmentSubmissionRate: 65, // Incomplete (<70% -> 10 risk)
      daysSinceLastActive: 3,
    };

    const profile = evaluateStudentRisk(student);
    // Expected risk: 18 + 12 + 8 + 10 = 48 -> MODERATE
    assert.equal(profile.riskLevel, 'MODERATE');
    assert.equal(profile.riskScore, 48);
    assert.equal(profile.parentMeetingRecommended, false);
    assert.ok(profile.contributingFactors.length >= 3);
  });

  test('triggers CRITICAL risk and parent meeting conference on severe deficits', () => {
    const student: StudentTelemetryInput = {
      studentRoll: 'CS-099',
      fullName: 'Vikram Singh',
      department: 'MECH',
      institutionId: 'inst-apex-001',
      attendancePercentage: 45, // Severe (<60% -> 30 risk)
      codingQuestCompletionRate: 20, // Critical (<40% -> 25 risk)
      quizAverage: 30, // Internal failure (<45% -> 15 risk)
      communicationLabScore: 40,
      assignmentSubmissionRate: 30, // Missing (<50% -> 20 risk)
      daysSinceLastActive: 16, // Extended dropout risk (>=14 -> 10 risk)
    };

    const profile = evaluateStudentRisk(student);
    // Risk: 30 + 25 + 15 + 20 + 10 = 100 -> CRITICAL
    assert.equal(profile.riskLevel, 'CRITICAL');
    assert.equal(profile.riskScore, 100);
    assert.equal(profile.parentMeetingRecommended, true);
    assert.match(profile.prescriptiveInterventions[0], /Urgent: Schedule Dean\/HOD parent intervention/);
  });

  test('clamps negative and out-of-bound telemetry numbers safely', () => {
    const student: StudentTelemetryInput = {
      studentRoll: 'CS-SAFECLAMP',
      fullName: 'Test Clamped',
      department: 'CSE',
      institutionId: 'inst-apex-001',
      attendancePercentage: 150, // Clamped to 100
      codingQuestCompletionRate: -10, // Clamped to 0
      quizAverage: 120, // Clamped to 100
      communicationLabScore: 80,
      assignmentSubmissionRate: 90,
      daysSinceLastActive: -5, // Clamped to 0
    };

    const profile = evaluateStudentRisk(student);
    assert.ok(profile.riskScore >= 0 && profile.riskScore <= 100);
  });

  test('aggregates cohort telemetry into institutional health telemetry', () => {
    const cohort: StudentTelemetryInput[] = [
      {
        studentRoll: 'CS-1',
        fullName: 'Good Student',
        department: 'CSE',
        institutionId: 'inst-apex-001',
        attendancePercentage: 95,
        codingQuestCompletionRate: 95,
        quizAverage: 90,
        communicationLabScore: 90,
        assignmentSubmissionRate: 95,
        daysSinceLastActive: 1,
      },
      {
        studentRoll: 'CS-2',
        fullName: 'Struggling Student',
        department: 'CSE',
        institutionId: 'inst-apex-001',
        attendancePercentage: 50,
        codingQuestCompletionRate: 30,
        quizAverage: 40,
        communicationLabScore: 40,
        assignmentSubmissionRate: 40,
        daysSinceLastActive: 15,
      },
      {
        studentRoll: 'EC-1',
        fullName: 'ECE Student',
        department: 'ECE',
        institutionId: 'inst-apex-001',
        attendancePercentage: 80,
        codingQuestCompletionRate: 80,
        quizAverage: 80,
        communicationLabScore: 80,
        assignmentSubmissionRate: 80,
        daysSinceLastActive: 2,
      },
    ];

    // Entire institution
    const summary = analyzeCohortTelemetry('inst-apex-001', cohort);
    assert.equal(summary.totalStudents, 3);
    assert.equal(summary.distribution.safe, 2);
    assert.equal(summary.distribution.critical, 1);
    assert.equal(summary.criticalRate, 33.33);
    assert.ok(summary.topSystemicRisks.length > 0);

    // Department filtered
    const cseSummary = analyzeCohortTelemetry('inst-apex-001', cohort, 'CSE');
    assert.equal(cseSummary.totalStudents, 2);
    assert.equal(cseSummary.distribution.safe, 1);
    assert.equal(cseSummary.distribution.critical, 1);
  });
});
