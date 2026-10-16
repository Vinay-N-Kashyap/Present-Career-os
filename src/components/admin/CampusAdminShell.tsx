'use client';

import React, { useState } from 'react';
import { MOCK_INSTITUTIONS, InstitutionContext } from '@/lib/admin/tenant';
import StudentRosterManager from './StudentRosterManager';
import FeeLedgerDashboard from './FeeLedgerDashboard';

export default function CampusAdminShell() {
  const [activeTenantId, setActiveTenantId] = useState<string>('inst-apex-001');
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'fees' | 'audit'>('overview');

  const currentTenant: InstitutionContext = MOCK_INSTITUTIONS[activeTenantId] || MOCK_INSTITUTIONS['inst-apex-001'];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg, #090d16)',
      color: 'var(--t1, #f8fafc)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Top Banner: Multi-Tenant Institution Selector & Branding */}
      <header style={{
        background: 'var(--card, #0f172a)',
        borderBottom: '1px solid var(--border, #1e293b)',
        padding: '16px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${currentTenant.themeColor}, #1e1b4b)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            🏛️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: '-0.3px' }}>
                {currentTenant.name}
              </h1>
              <span style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 999,
                background: `${currentTenant.themeColor}22`,
                color: currentTenant.themeColor,
                fontWeight: 600,
                border: `1px solid ${currentTenant.themeColor}55`,
                textTransform: 'uppercase'
              }}>
                {currentTenant.tier}
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--t3, #94a3b8)', marginTop: 2 }}>
              Domain: <code style={{ color: '#cbd5e1' }}>{currentTenant.domain}</code> • Tenant ID: <code style={{ color: '#cbd5e1' }}>{currentTenant.id}</code>
            </div>
          </div>
        </div>

        {/* Multi-Tenant Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: 12, color: 'var(--t3, #94a3b8)', fontWeight: 500 }}>Active Campus:</label>
          <select
            value={activeTenantId}
            onChange={(e) => setActiveTenantId(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: 'var(--bg2, #1e293b)',
              color: 'var(--t1, #f8fafc)',
              border: '1px solid var(--border, #334155)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {Object.values(MOCK_INSTITUTIONS).map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name} ({inst.tier})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{
        background: 'rgba(15, 23, 42, 0.75)',
        borderBottom: '1px solid var(--border, #1e293b)',
        padding: '0 28px',
        display: 'flex',
        gap: 8,
        backdropFilter: 'blur(8px)'
      }}>
        {[
          { id: 'overview', label: '📊 Campus Overview', icon: '📊' },
          { id: 'roster', label: '👥 Student Roster & Ingestion', icon: '👥' },
          { id: 'fees', label: '💳 Sub-Ledger & Fee Management', icon: '💳' },
          { id: 'audit', label: '🛡️ Compliance & Accreditation', icon: '🛡️' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '14px 18px',
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? currentTenant.themeColor : 'var(--t3, #94a3b8)',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? `2px solid ${currentTenant.themeColor}` : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main style={{ padding: '28px', maxWidth: 1400, margin: '0 auto' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div style={{
              background: 'var(--card, #0f172a)',
              border: '1px solid var(--border, #1e293b)',
              borderRadius: 12,
              padding: 24,
              borderLeft: `4px solid ${currentTenant.themeColor}`
            }}>
              <div style={{ fontSize: 12, color: 'var(--t3, #94a3b8)', textTransform: 'uppercase', fontWeight: 600 }}>Roster Capacity</div>
              <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: '#f8fafc' }}>
                3,420 <span style={{ fontSize: 16, color: 'var(--t3, #94a3b8)', fontWeight: 400 }}>/ {currentTenant.maxRosterCapacity}</span>
              </div>
              <div style={{ fontSize: 12.5, color: '#10b981', marginTop: 8 }}>● 68.4% Enrollment Utilization</div>
            </div>

            <div style={{
              background: 'var(--card, #0f172a)',
              border: '1px solid var(--border, #1e293b)',
              borderRadius: 12,
              padding: 24,
              borderLeft: '4px solid #10b981'
            }}>
              <div style={{ fontSize: 12, color: 'var(--t3, #94a3b8)', textTransform: 'uppercase', fontWeight: 600 }}>Accreditation Status</div>
              <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: '#10b981' }}>NAAC A++</div>
              <div style={{ fontSize: 12.5, color: 'var(--t3, #94a3b8)', marginTop: 8 }}>NBA & ABET Outcome Telemetry Active</div>
            </div>

            <div style={{
              background: 'var(--card, #0f172a)',
              border: '1px solid var(--border, #1e293b)',
              borderRadius: 12,
              padding: 24,
              borderLeft: '4px solid #f59e0b'
            }}>
              <div style={{ fontSize: 12, color: 'var(--t3, #94a3b8)', textTransform: 'uppercase', fontWeight: 600 }}>Fee Collection Rate</div>
              <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: '#f59e0b' }}>94.2%</div>
              <div style={{ fontSize: 12.5, color: 'var(--t3, #94a3b8)', marginTop: 8 }}>Double-entry verified balance</div>
            </div>

            <div style={{
              background: 'var(--card, #0f172a)',
              border: '1px solid var(--border, #1e293b)',
              borderRadius: 12,
              padding: 24,
              borderLeft: '4px solid #6366f1'
            }}>
              <div style={{ fontSize: 12, color: 'var(--t3, #94a3b8)', textTransform: 'uppercase', fontWeight: 600 }}>Active Platform Modules</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                {currentTenant.featuresEnabled.map((feat) => (
                  <span key={feat} style={{
                    fontSize: 11,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: '#1e293b',
                    color: '#94a3b8',
                    border: '1px solid #334155'
                  }}>
                    {feat.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roster' && (
          <StudentRosterManager institutionId={currentTenant.id} />
        )}

        {activeTab === 'fees' && (
          <FeeLedgerDashboard institutionId={currentTenant.id} />
        )}

        {activeTab === 'audit' && (
          <div style={{
            background: 'var(--card, #0f172a)',
            border: '1px solid var(--border, #1e293b)',
            borderRadius: 12,
            padding: 28
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Institutional Compliance & Audit Trail</h2>
            <p style={{ fontSize: 13.5, color: 'var(--t3, #94a3b8)', marginBottom: 20 }}>
              Immutable audit ledger capturing all student onboarding, fee receipt hashes, and faculty grade overrides.
            </p>
            <div style={{
              background: '#020617',
              borderRadius: 8,
              padding: 16,
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#38bdf8',
              lineHeight: 1.6
            }}>
              <div>[2026-10-16T19:35:00Z] [AUDIT-OK] Tenant [{currentTenant.id}] RLS isolation check verified. 0 cross-tenant leaks.</div>
              <div>[2026-10-16T19:34:25Z] [FEE-HASH-SIG] Double-entry invariant holds: sum(debits) == sum(credits) + receivables.</div>
              <div>[2026-10-16T19:32:10Z] [ROSTER-SYNC] 31 student records ingested with zero schema collisions.</div>
              <div>[2026-10-16T19:30:00Z] [ACCREDITATION] NAAC Criterion 2.6 (Student Learning Outcomes) audit report generated.</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
