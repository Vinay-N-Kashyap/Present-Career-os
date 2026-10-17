import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { MOCK_INSTITUTIONS } from '../src/lib/admin/tenant';
import { parseStudentRosterCSV, InMemoryRosterStore } from '../src/lib/admin/roster';
import { FeeLedgerEngine } from '../src/lib/admin/feeLedger';
import { AssignmentRubric, evaluateSubmission, batchGradeCohort } from '../src/lib/teacher/rubrics';
import { evaluateStudentRisk, analyzeCohortTelemetry } from '../src/lib/teacher/telemetry';

describe('TASK-856..860: Campus Admin & Teacher UI Flow Integration Tests', () => {
  test('verifies multi-tenant registry contains all required institutional configurations', () => {
    assert.ok(MOCK_INSTITUTIONS['inst-apex-001']);
    assert.ok(MOCK_INSTITUTIONS['inst-metro-002']);
    assert.ok(MOCK_INSTITUTIONS['inst-royal-003']);

    const apex = MOCK_INSTITUTIONS['inst-apex-001'];
    assert.equal(apex.slug, 'apex-tech');
    assert.equal(apex.tier, 'enterprise');
    assert.ok(apex.featuresEnabled.includes('fee_ledger'));
    assert.ok(apex.featuresEnabled.includes('placement_radar'));
  });

  test('executes full student roster onboarding workflow from CSV string to in-memory store', () => {
    InMemoryRosterStore.clear();

    const csvData = `Roll Number,Full Name,Email,Department,Semester,CGPA
CS-2026-901,Sneha Sharma,sneha@apex.edu,CSE,6,9.25
EC-2026-902,Rahul Gupta,rahul@apex.edu,ECE,6,8.50`;

    const res = parseStudentRosterCSV(csvData, 'inst-apex-001');
    assert.equal(res.success, true);
    assert.equal(res.validRecords.length, 2);

    const upsertRes = InMemoryRosterStore.upsertStudents(res.validRecords);
    assert.equal(upsertRes.inserted, 2);

    const fetched = InMemoryRosterStore.getStudentsByInstitution('inst-apex-001');
    assert.equal(fetched.length, 2);
    assert.equal(fetched[0].rollNumber, 'CS-2026-901');
    assert.equal(fetched[1].rollNumber, 'EC-2026-902');
  });

  test('executes institutional fee invoice creation and multi-installment settlement workflow', () => {
    const ledger = new FeeLedgerEngine();

    const inv = ledger.createInvoice({
      id: 'INV-TEST-001',
      institutionId: 'inst-apex-001',
      studentRoll: 'CS-2026-901',
      academicYear: '2026-2027',
      semester: 6,
      dueDate: '2026-11-30',
      lineItems: [
        { category: 'tuition', description: 'Tuition Fee', amount: 40000 },
        { category: 'lab_infrastructure', description: 'Lab Fee', amount: 10000 },
      ],
    });

    assert.equal(inv.totalDue, 50000);
    assert.equal(inv.balance, 50000);

    // Installment 1
    const p1 = ledger.recordPayment({
      invoiceId: 'INV-TEST-001',
      institutionId: 'inst-apex-001',
      amount: 25000,
      paymentMethod: 'upi',
      referenceNumber: 'TXN-P1',
    });
    assert.equal(p1.invoice.balance, 25000);
    assert.equal(p1.invoice.status, 'partially_paid');
    assert.ok(p1.transaction.receiptHash.length === 64);

    // Installment 2 (Full settlement)
    const p2 = ledger.recordPayment({
      invoiceId: 'INV-TEST-001',
      institutionId: 'inst-apex-001',
      amount: 25000,
      paymentMethod: 'card',
      referenceNumber: 'TXN-P2',
    });
    assert.equal(p2.invoice.balance, 0);
    assert.equal(p2.invoice.status, 'paid');

    const summary = ledger.getInstitutionalSummary('inst-apex-001');
    assert.equal(summary.totalBilled, 50000);
    assert.equal(summary.totalCollected, 50000);
    assert.equal(summary.totalOutstanding, 0);
    assert.equal(summary.invariantSatisfied, true);
  });

  test('grades student code assignment with weighted rubric and generates remediation guidance', () => {
    const rubric: AssignmentRubric = {
      id: 'rubric-wal',
      assignmentId: 'assign-wal',
      institutionId: 'inst-apex-001',
      title: 'WAL Log Durability',
      passThreshold: 60,
      createdAt: new Date().toISOString(),
      criteria: [
        {
          id: 'crit-fsync',
          name: 'fsync Invariant',
          description: 'Force sync to disk',
          weight: 50,
          maxScore: 100,
          levels: [{ minScore: 0, maxScore: 100, label: 'Tested', feedback: 'Checked' }],
        },
        {
          id: 'crit-recovery',
          name: 'Crash Recovery',
          description: 'Redo and undo logs',
          weight: 50,
          maxScore: 100,
          levels: [{ minScore: 0, maxScore: 100, label: 'Tested', feedback: 'Checked' }],
        },
      ],
    };

    const submission = {
      submissionId: 'sub-wal-1',
      studentRoll: 'CS-01',
      assignmentId: 'assign-wal',
      institutionId: 'inst-apex-001',
      rawCriterionScores: { 'crit-fsync': 90, 'crit-recovery': 50 },
      submittedAt: new Date().toISOString(),
    };

    const res = evaluateSubmission(rubric, submission);
    // Score: (90*0.5) + (50*0.5) = 45 + 25 = 70%
    assert.equal(res.overallScore, 70);
    assert.equal(res.passed, true);
    assert.equal(res.remediationPlan.length, 1);
    assert.match(res.remediationPlan[0], /Crash Recovery/);
  });

  test('identifies high-risk students and triggers parent conference recommendation', () => {
    const telemetry = {
      studentRoll: 'CS-RISK-01',
      fullName: 'At-Risk Student',
      department: 'CSE',
      institutionId: 'inst-apex-001',
      attendancePercentage: 48, // Critical (<60)
      codingQuestCompletionRate: 20, // Critical (<40)
      quizAverage: 35, // Critical (<45)
      communicationLabScore: 40,
      assignmentSubmissionRate: 30, // Critical (<50)
      daysSinceLastActive: 16, // Extended inactivity (>=14)
    };

    const risk = evaluateStudentRisk(telemetry);
    assert.equal(risk.riskLevel, 'CRITICAL');
    assert.equal(risk.riskScore, 100);
    assert.equal(risk.parentMeetingRecommended, true);
    assert.ok(risk.prescriptiveInterventions.length >= 3);

    const cohort = analyzeCohortTelemetry('inst-apex-001', [telemetry]);
    assert.equal(cohort.distribution.critical, 1);
    assert.equal(cohort.criticalRate, 100);
  });
});
