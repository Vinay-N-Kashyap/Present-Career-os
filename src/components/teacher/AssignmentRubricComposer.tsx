'use client';

import React, { useState } from 'react';
import {
  AssignmentRubric,
  validateRubric,
  evaluateSubmission,
  batchGradeCohort,
  EvaluationResult,
  BatchGradingSummary,
} from '@/lib/teacher/rubrics';

export default function AssignmentRubricComposer() {
  const [rubric, setRubric] = useState<AssignmentRubric>({
    id: 'rubric-ds-2026',
    assignmentId: 'assign-b+tree-wal',
    institutionId: 'inst-apex-001',
    title: 'B+ Tree Page Allocation & Write-Ahead Log (WAL) Durability',
    passThreshold: 65,
    createdAt: new Date().toISOString(),
    criteria: [
      {
        id: 'crit-wal',
        name: 'WAL Flush Pre-Condition & Invariants',
        description: 'Assert delta log records flushed prior to mutating memory buffers.',
        weight: 40,
        maxScore: 100,
        levels: [
          { minScore: 85, maxScore: 100, label: 'Exemplary', feedback: 'Tamper-proof monotonic sequence ordering.' },
          { minScore: 65, maxScore: 84, label: 'Proficient', feedback: 'Correct flush order with minor disk recovery gaps.' },
          { minScore: 0, maxScore: 64, label: 'Deficient', feedback: 'Dirty pages written before WAL fsync (crash hazard).' },
        ],
      },
      {
        id: 'crit-split',
        name: 'Leaf Node Split & Median Key Promotion',
        description: 'Accurate ceil(M/2) split logic and parent pointer adjustment.',
        weight: 35,
        maxScore: 100,
        levels: [
          { minScore: 80, maxScore: 100, label: 'Optimal', feedback: 'Exact median computation with zero memory leak.' },
          { minScore: 0, maxScore: 79, label: 'Suboptimal', feedback: 'Off-by-one error during leaf saturation boundary.' },
        ],
      },
      {
        id: 'crit-tests',
        name: 'Concurrency Stress Testing',
        description: 'Multi-threaded race condition fuzz tests.',
        weight: 25,
        maxScore: 100,
        levels: [
          { minScore: 75, maxScore: 100, label: 'Robust', feedback: 'No deadlocks under 1,000 parallel workers.' },
          { minScore: 0, maxScore: 74, label: 'Vulnerable', feedback: 'Deadlock detected during concurrent page split.' },
        ],
      },
    ],
  });

  const [testScores, setTestScores] = useState<Record<string, number>>({
    'crit-wal': 90,
    'crit-split': 60,
    'crit-tests': 70,
  });

  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [cohortSummary, setCohortSummary] = useState<BatchGradingSummary | null>(null);

  const validation = validateRubric(rubric);
  const totalWeight = rubric.criteria.reduce((sum, c) => sum + c.weight, 0);

  const handleWeightChange = (index: number, newWeight: number) => {
    const updated = [...rubric.criteria];
    updated[index].weight = newWeight;
    setRubric({ ...rubric, criteria: updated });
  };

  const handleRunEvaluation = () => {
    try {
      const res = evaluateSubmission(rubric, {
        submissionId: 'sub-demo-01',
        studentRoll: 'CS-2026-042',
        assignmentId: rubric.assignmentId,
        institutionId: rubric.institutionId,
        rawCriterionScores: testScores,
        submittedAt: new Date().toISOString(),
      });
      setEvaluationResult(res);
    } catch (e: any) {
      alert(`Grading failed: ${e.message}`);
    }
  };

  const handleSimulateCohort = () => {
    const mockCohort = [
      {
        submissionId: 'sub-1',
        studentRoll: 'CS-01',
        assignmentId: rubric.assignmentId,
        institutionId: rubric.institutionId,
        rawCriterionScores: { 'crit-wal': 95, 'crit-split': 90, 'crit-tests': 85 },
        submittedAt: new Date().toISOString(),
      },
      {
        submissionId: 'sub-2',
        studentRoll: 'CS-02',
        assignmentId: rubric.assignmentId,
        institutionId: rubric.institutionId,
        rawCriterionScores: { 'crit-wal': 70, 'crit-split': 65, 'crit-tests': 60 },
        submittedAt: new Date().toISOString(),
      },
      {
        submissionId: 'sub-3',
        studentRoll: 'CS-03',
        assignmentId: rubric.assignmentId,
        institutionId: rubric.institutionId,
        rawCriterionScores: { 'crit-wal': 50, 'crit-split': 45, 'crit-tests': 40 },
        submittedAt: new Date().toISOString(),
      },
      {
        submissionId: 'sub-4',
        studentRoll: 'CS-04',
        assignmentId: rubric.assignmentId,
        institutionId: rubric.institutionId,
        rawCriterionScores: { 'crit-wal': 85, 'crit-split': 80, 'crit-tests': 75 },
        submittedAt: new Date().toISOString(),
      },
    ];

    const { summary } = batchGradeCohort(rubric, mockCohort);
    setCohortSummary(summary);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Rubric Header & Weight Balance Verification Badge */}
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
          <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Assignment Rubric Standard</span>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '4px 0 0 0', color: '#f8fafc' }}>{rubric.title}</h2>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
            Pass Threshold: <b style={{ color: '#f59e0b' }}>{rubric.passThreshold}%</b> • Criteria Count: <b style={{ color: '#cbd5e1' }}>{rubric.criteria.length}</b>
          </div>
        </div>

        <div style={{
          padding: '8px 16px',
          borderRadius: 8,
          background: validation.valid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${validation.valid ? '#10b98155' : '#ef444455'}`,
          color: validation.valid ? '#10b981' : '#ef4444',
          fontWeight: 700,
          fontSize: 13.5
        }}>
          {validation.valid ? `✓ 100% Weight Invariant Satisfied` : `✕ Unbalanced: ${totalWeight}% / 100%`}
        </div>
      </div>

      {/* Criteria Weight Sliders */}
      <div style={{
        background: 'var(--card, #0f172a)',
        border: '1px solid #1e293b',
        borderRadius: 12,
        padding: 24
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px 0' }}>Multi-Dimensional Evaluation Dimensions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {rubric.criteria.map((c, idx) => (
            <div key={c.id} style={{
              background: '#020617',
              border: '1px solid #1e293b',
              borderRadius: 8,
              padding: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{c.description}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#818cf8', fontFamily: 'monospace' }}>
                  {c.weight}% Weight
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="range"
                  min={5}
                  max={70}
                  step={5}
                  value={c.weight}
                  onChange={(e) => handleWeightChange(idx, Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#6366f1' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-Grading & Remediation Simulation Workbench */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 20
      }}>
        {/* Test Submission Panel */}
        <div style={{
          background: 'var(--card, #0f172a)',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 24
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px 0' }}>Student Submission Grader</h3>
          <p style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 16 }}>
            Adjust raw scores (0-100) to test weighted evaluation and prescriptive feedback generation.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rubric.criteria.map((c) => (
              <div key={c.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                  <span style={{ color: '#cbd5e1' }}>{c.name}</span>
                  <span style={{ fontWeight: 700, color: '#38bdf8' }}>{testScores[c.id] || 0} / 100</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={testScores[c.id] || 0}
                  onChange={(e) => setTestScores({ ...testScores, [c.id]: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#38bdf8' }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button
              onClick={handleRunEvaluation}
              style={{
                flex: 1,
                padding: '10px 14px',
                background: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Grade Submission
            </button>
            <button
              onClick={handleSimulateCohort}
              style={{
                padding: '10px 14px',
                background: '#1e293b',
                color: '#94a3b8',
                border: '1px solid #334155',
                borderRadius: 8,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Cohort Test
            </button>
          </div>
        </div>

        {/* Evaluation Output & AI Feedback */}
        <div style={{
          background: 'var(--card, #0f172a)',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 24
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px 0' }}>Evaluation Result & Remediation</h3>
          
          {evaluationResult ? (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                borderRadius: 8,
                background: evaluationResult.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                marginBottom: 16
              }}>
                <div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>Weighted Score</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: evaluationResult.passed ? '#10b981' : '#ef4444' }}>
                    {evaluationResult.overallScore}%
                  </div>
                </div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  background: evaluationResult.passed ? '#10b981' : '#ef4444',
                  color: '#ffffff'
                }}>
                  {evaluationResult.passed ? 'PASSED' : 'REVISION NEEDED'}
                </span>
              </div>

              {/* Criterion Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                {evaluationResult.criterionFeedback.map((cf) => (
                  <div key={cf.criterionId} style={{
                    fontSize: 12,
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: '#020617',
                    border: '1px solid #1e293b'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#f8fafc' }}>
                      <span>{cf.criterionName} ({cf.levelLabel})</span>
                      <span style={{ color: '#818cf8' }}>+{cf.weightedContribution}%</span>
                    </div>
                    <div style={{ color: '#94a3b8', marginTop: 2 }}>{cf.feedback}</div>
                  </div>
                ))}
              </div>

              {/* Prescriptive Remediation Tips */}
              {evaluationResult.remediationPlan.length > 0 && (
                <div style={{ padding: 12, borderRadius: 6, background: '#f59e0b15', border: '1px solid #f59e0b44' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', marginBottom: 4 }}>
                    💡 AI Prescriptive Remediation Action:
                  </div>
                  {evaluationResult.remediationPlan.map((tip, i) => (
                    <div key={i} style={{ fontSize: 11.5, color: '#fde68a', marginTop: 2 }}>• {tip}</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b', fontSize: 13 }}>
              Click "Grade Submission" to preview rubric scoring and feedback.
            </div>
          )}

          {/* Cohort Summary Box */}
          {cohortSummary && (
            <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: '#020617', border: '1px solid #334155' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', marginBottom: 4 }}>Cohort Simulation:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1' }}>
                <span>Pass Rate: <b>{cohortSummary.passRate}%</b></span>
                <span>Avg: <b>{cohortSummary.averageScore}%</b></span>
                <span>Max: <b>{cohortSummary.highestScore}%</b></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
