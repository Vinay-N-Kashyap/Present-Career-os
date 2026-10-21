import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateRubric,
  evaluateSubmission,
  batchGradeCohort,
  AssignmentRubric,
  StudentSubmission,
} from '../src/lib/teacher/rubrics';

describe('TASK-854: Teacher Assignment & Auto-Grading Rubric Engine', () => {
  const sampleRubric: AssignmentRubric = {
    id: 'rubric-algo-001',
    assignmentId: 'assign-dsa-trees',
    institutionId: 'inst-apex-001',
    title: 'Balanced Binary Search Tree Implementation',
    passThreshold: 65,
    createdAt: new Date().toISOString(),
    criteria: [
      {
        id: 'crit-correctness',
        name: 'Correctness & Invariant Assertions',
        description: 'AVL or Red-Black balance maintenance during rotations.',
        weight: 40,
        maxScore: 100,
        levels: [
          { minScore: 85, maxScore: 100, label: 'Exemplary', feedback: 'All AVL balance invariants hold under stress.' },
          { minScore: 65, maxScore: 84, label: 'Proficient', feedback: 'Rotations functional with minor edge case leaks.' },
          { minScore: 0, maxScore: 64, label: 'Deficient', feedback: 'Tree becomes unbalanced on duplicate key inserts.' },
        ],
      },
      {
        id: 'crit-complexity',
        name: 'Time Complexity Guarantee',
        description: 'Search, insert, and delete guaranteed in O(log N).',
        weight: 30,
        maxScore: 100,
        levels: [
          { minScore: 80, maxScore: 100, label: 'Optimal', feedback: 'Strict logarithmic performance demonstrated.' },
          { minScore: 0, maxScore: 79, label: 'Suboptimal', feedback: 'Unnecessary linear traversals identified.' },
        ],
      },
      {
        id: 'crit-clean-code',
        name: 'Type Safety & Documentation',
        description: 'Clean TypeScript types and docstrings.',
        weight: 30,
        maxScore: 100,
        levels: [
          { minScore: 70, maxScore: 100, label: 'Clean', feedback: 'Well-structured modular code.' },
          { minScore: 0, maxScore: 69, label: 'Needs Improvement', feedback: 'Missing generic type assertions.' },
        ],
      },
    ],
  };

  test('validates valid rubric with weights summing to 100%', () => {
    const res = validateRubric(sampleRubric);
    assert.equal(res.valid, true);
    assert.equal(res.errors.length, 0);
  });

  test('rejects rubrics where weights do not equal 100%', () => {
    const invalidRubric: AssignmentRubric = {
      ...sampleRubric,
      criteria: [
        { ...sampleRubric.criteria[0], weight: 40 },
        { ...sampleRubric.criteria[1], weight: 40 }, // sums to 80
      ],
    };

    const res = validateRubric(invalidRubric);
    assert.equal(res.valid, false);
    assert.match(res.errors[0], /must sum to exactly 100%/);
  });

  test('evaluates high-performing student submission accurately', () => {
    const submission: StudentSubmission = {
      submissionId: 'sub-001',
      studentRoll: 'CS-2026-042',
      assignmentId: 'assign-dsa-trees',
      institutionId: 'inst-apex-001',
      submittedAt: new Date().toISOString(),
      rawCriterionScores: {
        'crit-correctness': 95, // 95 * 0.40 = 38
        'crit-complexity': 90,  // 90 * 0.30 = 27
        'crit-clean-code': 85,  // 85 * 0.30 = 25.5
      },
    };

    const evalResult = evaluateSubmission(sampleRubric, submission);
    assert.equal(evalResult.overallScore, 90.5);
    assert.equal(evalResult.passed, true);
    assert.equal(evalResult.remediationPlan.length, 0);
    assert.equal(evalResult.criterionFeedback[0].levelLabel, 'Exemplary');
  });

  test('flags struggling student and produces actionable remediation guidance', () => {
    const submission: StudentSubmission = {
      submissionId: 'sub-002',
      studentRoll: 'CS-2026-099',
      assignmentId: 'assign-dsa-trees',
      institutionId: 'inst-apex-001',
      submittedAt: new Date().toISOString(),
      rawCriterionScores: {
        'crit-correctness': 50, // Below 65 pass threshold -> generates tip
        'crit-complexity': 60,  // Below 65 pass threshold -> generates tip
        'crit-clean-code': 75,
      },
    };

    const evalResult = evaluateSubmission(sampleRubric, submission);
    // Score: (50*0.4) + (60*0.3) + (75*0.3) = 20 + 18 + 22.5 = 60.5
    assert.equal(evalResult.overallScore, 60.5);
    assert.equal(evalResult.passed, false); // threshold is 65
    assert.equal(evalResult.remediationPlan.length, 2);
    assert.match(evalResult.remediationPlan[0], /Correctness & Invariant Assertions/);
  });

  test('batch grades entire cohort and computes accurate aggregate metrics', () => {
    const cohort: StudentSubmission[] = [
      {
        submissionId: 'sub-1',
        studentRoll: 'CS-01',
        assignmentId: 'assign-dsa-trees',
        institutionId: 'inst-apex-001',
        submittedAt: new Date().toISOString(),
        rawCriterionScores: { 'crit-correctness': 90, 'crit-complexity': 90, 'crit-clean-code': 90 }, // 90
      },
      {
        submissionId: 'sub-2',
        studentRoll: 'CS-02',
        assignmentId: 'assign-dsa-trees',
        institutionId: 'inst-apex-001',
        submittedAt: new Date().toISOString(),
        rawCriterionScores: { 'crit-correctness': 70, 'crit-complexity': 70, 'crit-clean-code': 70 }, // 70
      },
      {
        submissionId: 'sub-3',
        studentRoll: 'CS-03',
        assignmentId: 'assign-dsa-trees',
        institutionId: 'inst-apex-001',
        submittedAt: new Date().toISOString(),
        rawCriterionScores: { 'crit-correctness': 40, 'crit-complexity': 40, 'crit-clean-code': 40 }, // 40 (Fail)
      },
    ];

    const { evaluations, summary } = batchGradeCohort(sampleRubric, cohort);
    assert.equal(evaluations.length, 3);
    assert.equal(summary.totalSubmissions, 3);
    assert.equal(summary.passCount, 2);
    assert.equal(summary.failCount, 1);
    assert.equal(summary.passRate, 66.67);
    assert.equal(summary.averageScore, 66.67);
    assert.equal(summary.highestScore, 90);
    assert.equal(summary.lowestScore, 40);
  });

  test('strictly blocks evaluation when submission belongs to another institution', () => {
    const crossTenantSub: StudentSubmission = {
      submissionId: 'sub-hack',
      studentRoll: 'CS-HACK',
      assignmentId: 'assign-dsa-trees',
      institutionId: 'inst-metro-002', // Mismatched tenant
      submittedAt: new Date().toISOString(),
      rawCriterionScores: { 'crit-correctness': 100 },
    };

    assert.throws(() => {
      evaluateSubmission(sampleRubric, crossTenantSub);
    }, /Tenant mismatch/);
  });
});
