'use client';

import React, { useState, useMemo } from 'react';
import {
  StudentTelemetryInput,
  StudentRiskProfile,
  evaluateStudentRisk,
  analyzeCohortTelemetry,
  RiskLevel,
} from '@/lib/teacher/telemetry';

export default function StudentRiskRadar() {
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [activeStudent, setActiveStudent] = useState<StudentRiskProfile | null>(null);

  // Pre-seeded telemetry dataset reflecting realistic cohort conditions
  const rawCohort: StudentTelemetryInput[] = useMemo(() => [
    {
      studentRoll: 'CS-2026-001',
      fullName: 'Aarav Sharma',
      department: 'CSE',
      institutionId: 'inst-apex-001',
      attendancePercentage: 94,
      codingQuestCompletionRate: 92,
      quizAverage: 88,
      communicationLabScore: 90,
      assignmentSubmissionRate: 98,
      daysSinceLastActive: 1,
    },
    {
      studentRoll: 'CS-2026-014',
      fullName: 'Vikram Singh',
      department: 'CSE',
      institutionId: 'inst-apex-001',
      attendancePercentage: 52, // Critical deficit
      codingQuestCompletionRate: 25, // Failing labs
      quizAverage: 38,
      communicationLabScore: 45,
      assignmentSubmissionRate: 35,
      daysSinceLastActive: 15, // Long inactivity
    },
    {
      studentRoll: 'CS-2026-022',
      fullName: 'Sneha Kulkarni',
      department: 'CSE',
      institutionId: 'inst-apex-001',
      attendancePercentage: 71, // Borderline
      codingQuestCompletionRate: 60,
      quizAverage: 58,
      communicationLabScore: 75,
      assignmentSubmissionRate: 68,
      daysSinceLastActive: 3,
    },
    {
      studentRoll: 'EC-2026-008',
      fullName: 'Rohan Varma',
      department: 'ECE',
      institutionId: 'inst-apex-001',
      attendancePercentage: 86,
      codingQuestCompletionRate: 80,
      quizAverage: 78,
      communicationLabScore: 82,
      assignmentSubmissionRate: 85,
      daysSinceLastActive: 2,
    },
    {
      studentRoll: 'EC-2026-031',
      fullName: 'Tanvi Joshi',
      department: 'ECE',
      institutionId: 'inst-apex-001',
      attendancePercentage: 58, // Critical
      codingQuestCompletionRate: 35,
      quizAverage: 42,
      communicationLabScore: 50,
      assignmentSubmissionRate: 40,
      daysSinceLastActive: 10,
    },
    {
      studentRoll: 'ME-2026-005',
      fullName: 'Arjun Das',
      department: 'MECH',
      institutionId: 'inst-apex-001',
      attendancePercentage: 90,
      codingQuestCompletionRate: 75,
      quizAverage: 82,
      communicationLabScore: 88,
      assignmentSubmissionRate: 85,
      daysSinceLastActive: 1,
    },
  ], []);

  const evaluatedCohort = useMemo(() => {
    return rawCohort.map(evaluateStudentRisk);
  }, [rawCohort]);

  const cohortSummary = useMemo(() => {
    return analyzeCohortTelemetry(
      'inst-apex-001',
      rawCohort,
      selectedDept === 'ALL' ? undefined : selectedDept
    );
  }, [rawCohort, selectedDept]);

  const filteredStudents = useMemo(() => {
    return evaluatedCohort.filter((s) => {
      const matchDept = selectedDept === 'ALL' || s.department === selectedDept;
      const matchRisk = riskFilter === 'ALL' || s.riskLevel === riskFilter;
      return matchDept && matchRisk;
    });
  }, [evaluatedCohort, selectedDept, riskFilter]);

  const departments = ['ALL', 'CSE', 'ECE', 'MECH'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Telemetry KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16
      }}>
        <div style={{
          background: 'var(--card, #0f172a)',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 20,
          borderLeft: `4px solid ${cohortSummary.classHealthScore >= 75 ? '#10b981' : '#f59e0b'}`
        }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Class Health Index</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#f8fafc' }}>
            {cohortSummary.classHealthScore} <span style={{ fontSize: 16, color: '#94a3b8', fontWeight: 400 }}>/ 100</span>
          </div>
          <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>
            Syllabus pace & continuous assessment health
          </div>
        </div>

        <div style={{
          background: 'var(--card, #0f172a)',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 20,
          borderLeft: '4px solid #ef4444'
        }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Critical Backlog Risk</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#ef4444' }}>
            {cohortSummary.distribution.critical} <span style={{ fontSize: 16, color: '#94a3b8', fontWeight: 400 }}>({cohortSummary.criticalRate}%)</span>
          </div>
          <div style={{ fontSize: 12, color: '#fca5a5', marginTop: 4 }}>
            Immediate intervention required
          </div>
        </div>

        <div style={{
          background: 'var(--card, #0f172a)',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 20,
          borderLeft: '4px solid #f59e0b'
        }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Moderate Watchlist</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#f59e0b' }}>
            {cohortSummary.distribution.moderate} <span style={{ fontSize: 16, color: '#94a3b8', fontWeight: 400 }}>Students</span>
          </div>
          <div style={{ fontSize: 12, color: '#fde68a', marginTop: 4 }}>
            Borderline attendance or missing labs
          </div>
        </div>

        <div style={{
          background: 'var(--card, #0f172a)',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 20,
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Healthy / On Track</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#10b981' }}>
            {cohortSummary.distribution.safe} <span style={{ fontSize: 16, color: '#94a3b8', fontWeight: 400 }}>Students</span>
          </div>
          <div style={{ fontSize: 12, color: '#86efac', marginTop: 4 }}>
            Consistent quest & exam retention
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        background: 'var(--card, #0f172a)',
        border: '1px solid #1e293b',
        borderRadius: 12,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Department:</span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                background: selectedDept === dept ? '#4f46e5' : '#1e293b',
                color: selectedDept === dept ? '#ffffff' : '#94a3b8',
                border: '1px solid #334155'
              }}
            >
              {dept}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Risk Filter:</span>
          {(['ALL', 'CRITICAL', 'MODERATE', 'SAFE'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                background:
                  riskFilter === lvl
                    ? lvl === 'CRITICAL'
                      ? '#ef4444'
                      : lvl === 'MODERATE'
                      ? '#f59e0b'
                      : '#4f46e5'
                    : '#1e293b',
                color: '#ffffff',
                border: '1px solid #334155'
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Student Early Warning Radar Table */}
      <div style={{
        background: 'var(--card, #0f172a)',
        borderRadius: 12,
        border: '1px solid #1e293b',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
            Student Early Warning Radar ({filteredStudents.length})
          </h2>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            Predictive Telemetry Updates Every Class Period
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#020617', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>ROLL NUMBER</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>STUDENT NAME</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>DEPT</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>RISK SCORE</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>STATUS LEVEL</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>TOP RISK FACTOR</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, idx) => (
                <tr
                  key={s.studentRoll}
                  style={{
                    borderBottom: '1px solid #1e293b',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'
                  }}
                >
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 600, color: '#38bdf8' }}>
                    {s.studentRoll}
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#f8fafc' }}>
                    {s.fullName}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, background: '#1e293b', fontSize: 11, fontWeight: 600, color: '#a5b4fc' }}>
                      {s.department}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 800, fontSize: 14, color: s.riskScore >= 70 ? '#ef4444' : s.riskScore >= 40 ? '#f59e0b' : '#10b981' }}>
                    {s.riskScore} / 100
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      background:
                        s.riskLevel === 'CRITICAL'
                          ? 'rgba(239, 68, 68, 0.15)'
                          : s.riskLevel === 'MODERATE'
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(16, 185, 129, 0.15)',
                      color:
                        s.riskLevel === 'CRITICAL'
                          ? '#ef4444'
                          : s.riskLevel === 'MODERATE'
                          ? '#f59e0b'
                          : '#10b981'
                    }}>
                      {s.riskLevel}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#cbd5e1', fontSize: 12 }}>
                    {s.contributingFactors.length > 0 ? s.contributingFactors[0].factor : 'Consistent Performance'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <button
                      onClick={() => setActiveStudent(s)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        background: s.parentMeetingRecommended ? '#ef4444' : '#4f46e5',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {s.parentMeetingRecommended ? 'Alert Parent' : 'View Action'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Action & Prescriptive Modal */}
      {activeStudent && (
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
            maxWidth: 620,
            padding: 28,
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  {activeStudent.fullName} ({activeStudent.studentRoll})
                </h3>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Risk Assessment Profile</span>
              </div>
              <button
                onClick={() => setActiveStudent(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 14,
              borderRadius: 8,
              background: activeStudent.riskLevel === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              marginBottom: 16
            }}>
              <div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Calculated Risk Score</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: activeStudent.riskLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b' }}>
                  {activeStudent.riskScore} / 100 ({activeStudent.riskLevel})
                </div>
              </div>
              {activeStudent.parentMeetingRecommended && (
                <span style={{ padding: '4px 10px', borderRadius: 6, background: '#ef4444', color: '#fff', fontSize: 11.5, fontWeight: 700 }}>
                  PARENT CONFERENCE URGENT
                </span>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 8 }}>Contributing Risk Factors:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {activeStudent.contributingFactors.map((f, i) => (
                  <div key={i} style={{ padding: 10, borderRadius: 6, background: '#020617', border: '1px solid #1e293b', fontSize: 12 }}>
                    <b style={{ color: f.severity === 'high' ? '#ef4444' : '#f59e0b' }}>{f.factor}: </b>
                    <span style={{ color: '#94a3b8' }}>{f.impact}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 8 }}>Prescriptive Interventions:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {activeStudent.prescriptiveInterventions.map((tip, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#86efac' }}>
                    • {tip}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setActiveStudent(null)}
                style={{ padding: '9px 16px', borderRadius: 6, background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', cursor: 'pointer', fontSize: 13 }}
              >
                Close
              </button>
              {activeStudent.parentMeetingRecommended && (
                <button
                  onClick={() => {
                    alert(`Parent conference meeting invitation dispatched for ${activeStudent.fullName}.`);
                    setActiveStudent(null);
                  }}
                  style={{ padding: '9px 18px', borderRadius: 6, background: '#ef4444', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
                >
                  Send Parent Alert Notice
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
