'use client';

import React, { useState, useEffect } from 'react';
import {
  InMemoryIncidentStore,
  ModerationIncident,
  ToxicitySeverity,
} from '@/lib/admin/moderation';

interface ModerationIncidentQueueProps {
  institutionId?: string;
}

export default function ModerationIncidentQueue({
  institutionId = 'inst-apex-001',
}: ModerationIncidentQueueProps) {
  const [incidents, setIncidents] = useState<ModerationIncident[]>([]);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | ToxicitySeverity>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<ModerationIncident | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  // Pre-seed mock incidents if empty
  useEffect(() => {
    let existing = InMemoryIncidentStore.getIncidents(institutionId);
    if (existing.length === 0) {
      InMemoryIncidentStore.logIncident({
        institutionId,
        userId: 'student-2026-099',
        userName: 'Vikram Singh',
        channel: 'discussion_forum',
        text: 'Download leaked exam question paper for CS301 midterm here!',
      });

      InMemoryIncidentStore.logIncident({
        institutionId,
        userId: 'student-2026-042',
        userName: 'Anonymous Peer',
        channel: 'peer_review',
        text: 'Your code is pure shit and you are worthless at programming.',
      });

      InMemoryIncidentStore.logIncident({
        institutionId,
        userId: 'student-2026-015',
        userName: 'Rohan Varma',
        channel: 'mock_interview_transcript',
        text: 'Will pay me to solve my test online tomorrow?',
      });

      existing = InMemoryIncidentStore.getIncidents(institutionId);
    }
    setIncidents(existing);
  }, [institutionId]);

  const refreshIncidents = () => {
    setIncidents(InMemoryIncidentStore.getIncidents(institutionId));
  };

  const handleResolve = (status: 'action_taken' | 'false_positive_dismissed') => {
    if (!selectedIncident) return;
    InMemoryIncidentStore.resolveIncident(
      selectedIncident.id,
      status,
      actionNotes || (status === 'action_taken' ? 'Disciplinary action confirmed by Dean.' : 'Dismissed as false positive.')
    );
    setSelectedIncident(null);
    setActionNotes('');
    refreshIncidents();
  };

  const filtered = incidents.filter((inc) => {
    if (severityFilter === 'ALL') return true;
    return inc.severity === severityFilter;
  });

  const pendingCount = incidents.filter((i) => i.status === 'pending_review').length;
  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL_AUTO_SUSPEND').length;
  const resolvedCount = incidents.filter((i) => i.status !== 'pending_review').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Metric Cards */}
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
          borderLeft: '4px solid #ef4444'
        }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Critical Auto-Suspensions</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#ef4444' }}>
            {criticalCount}
          </div>
          <div style={{ fontSize: 12, color: '#fca5a5', marginTop: 4 }}>
            Exam leak / extreme abuse triggers
          </div>
        </div>

        <div style={{
          background: 'var(--card, #0f172a)',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 20,
          borderLeft: '4px solid #f59e0b'
        }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Pending Dean Review</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#f59e0b' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: 12, color: '#fde68a', marginTop: 4 }}>
            Harassment & academic integrity flags
          </div>
        </div>

        <div style={{
          background: 'var(--card, #0f172a)',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 20,
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Incidents Resolved</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#10b981' }}>
            {resolvedCount}
          </div>
          <div style={{ fontSize: 12, color: '#86efac', marginTop: 4 }}>
            Disciplinary audits completed
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
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Severity Filter:</span>
          {(['ALL', 'CRITICAL_AUTO_SUSPEND', 'HIGH', 'MEDIUM'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSeverityFilter(lvl as any)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                background:
                  severityFilter === lvl
                    ? lvl === 'CRITICAL_AUTO_SUSPEND'
                      ? '#ef4444'
                      : lvl === 'HIGH'
                      ? '#f59e0b'
                      : '#4f46e5'
                    : '#1e293b',
                color: '#ffffff',
                border: '1px solid #334155'
              }}
            >
              {lvl.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Table */}
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
            Incident Escalation Queue ({filtered.length})
          </h2>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            Multi-Tenant Isolated to: <code>{institutionId}</code>
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#020617', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>STUDENT / USER</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>CHANNEL</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>VIOLATION</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>SEVERITY</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>CENSORED CONTENT</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>STATUS</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inc, idx) => (
                <tr
                  key={inc.id}
                  style={{
                    borderBottom: '1px solid #1e293b',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'
                  }}
                >
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#f8fafc' }}>
                    {inc.userName}
                    <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{inc.userId}</div>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#a5b4fc', fontSize: 12 }}>
                    {inc.channel.replace(/_/g, ' ')}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: '#1e293b',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#f59e0b'
                    }}>
                      {inc.category.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      background:
                        inc.severity === 'CRITICAL_AUTO_SUSPEND'
                          ? 'rgba(239, 68, 68, 0.15)'
                          : inc.severity === 'HIGH'
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(59, 130, 246, 0.15)',
                      color:
                        inc.severity === 'CRITICAL_AUTO_SUSPEND'
                          ? '#ef4444'
                          : inc.severity === 'HIGH'
                          ? '#f59e0b'
                          : '#60a5fa'
                    }}>
                      {inc.severity.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#cbd5e1', maxWidth: 280, wordBreak: 'break-word', fontSize: 12 }}>
                    {inc.censoredText}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: inc.status === 'pending_review' ? '#f59e0b' : '#10b981'
                    }}>
                      {inc.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <button
                      onClick={() => setSelectedIncident(inc)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        background: '#4f46e5',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Resolution Modal */}
      {selectedIncident && (
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
                  Incident Review: {selectedIncident.id}
                </h3>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                  User: {selectedIncident.userName} • Channel: {selectedIncident.channel}
                </span>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>Raw Uncensored Content (Admin Eyes Only):</div>
              <div style={{ padding: 12, borderRadius: 8, background: '#020617', border: '1px solid #334155', color: '#f8fafc', fontSize: 13, fontFamily: 'monospace' }}>
                {selectedIncident.originalText}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>Resolution Disciplinary Notes:</div>
              <textarea
                rows={3}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Enter notes for student file (e.g. 24h suspension applied, academic integrity warning issued)..."
                style={{
                  width: '100%',
                  background: '#020617',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  padding: 10,
                  color: '#f8fafc',
                  fontSize: 13,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => handleResolve('false_positive_dismissed')}
                style={{ padding: '9px 16px', borderRadius: 6, background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', cursor: 'pointer', fontSize: 13 }}
              >
                Dismiss (False Positive)
              </button>
              <button
                onClick={() => handleResolve('action_taken')}
                style={{ padding: '9px 18px', borderRadius: 6, background: '#ef4444', color: '#ffffff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
              >
                Confirm Disciplinary Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
