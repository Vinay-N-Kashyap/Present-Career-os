'use client';

import React, { useState } from 'react';
import { CrashPlan } from '@/lib/data/crashPlansData';

export interface EnhancedCrashCoursePlanCardProps {
  plan: CrashPlan;
  activeTrack: 'web_fullstack' | 'python_ai';
  isSelected: boolean;
  onSelectPlan: (plan: CrashPlan) => void;
  onPreviewCredentials: (plan: CrashPlan) => void;
  onOpenDiagnosticReport?: (title: string) => void;
  userPins?: number;
}

const TAB_LABELS = ['📚 Curriculum', '🛠️ Capstone Spec', '📜 Credentials'] as const;
const tabs = ['curriculum', 'capstone', 'credentials'] as const;

export const EnhancedCrashCoursePlanCard: React.FC<EnhancedCrashCoursePlanCardProps> = ({
  plan,
  activeTrack,
  isSelected,
  onSelectPlan,
  onPreviewCredentials,
  onOpenDiagnosticReport,
}) => {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'capstone' | 'credentials'>('curriculum');

  const modules = plan.modulesByTrack[activeTrack] || [];
  const flagship = plan.flagshipBuildByTrack[activeTrack] || {
    title: 'Production Engineering Project',
    desc: 'End-to-end full lifecycle architecture deployment.',
    tech: ['TypeScript', 'Next.js', 'PostgreSQL'],
  };
  const steps = plan.journeySteps || [];
  const hc = plan.highlightColor || 'var(--accent)';

  return (
    <div
      data-testid={`crash-plan-card-${plan.id}`}
      style={{
        borderRadius: 'var(--radius-xl)',
        padding: '22px 20px',
        background: 'var(--card)',
        border: isSelected ? `2px solid ${hc}` : '1px solid var(--border)',
        boxShadow: isSelected
          ? `0 10px 28px -4px color-mix(in srgb, ${hc} 28%, transparent)`
          : 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        minHeight: 520,
      }}
    >
      {/* Featured Badge */}
      {plan.badge && (
        <div
          style={{
            position: 'absolute',
            top: -11,
            right: 18,
            padding: '3px 12px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.04em',
            background: `linear-gradient(135deg, ${hc}, var(--accent))`,
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          {plan.badge}
        </div>
      )}

      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: hc,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {plan.tier.toUpperCase()} INTENSIVE
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 9px',
            borderRadius: 999,
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            fontSize: 11.5,
            fontWeight: 700,
            color: 'var(--t2)',
          }}
        >
          <span>{plan.targetRole}</span>
          <span style={{ color: hc, fontWeight: 800 }}>• {plan.hireabilityBoost}</span>
        </span>
      </div>

      {/* Title & Subtitle */}
      <div>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: 'var(--t1)',
            margin: '0 0 3px 0',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.3px',
          }}
        >
          {plan.title}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--t3)', margin: '0 0 4px 0', lineHeight: 1.4 }}>
          {plan.subtitle}
        </p>
        <span style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          ⏱️ {plan.totalProgramDuration}
        </span>
      </div>

      {/* Flagship Project Highlight Box */}
      <div
        style={{
          padding: '12px 14px',
          borderRadius: 12,
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, color: hc, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span>🚀</span> Flagship Build: {flagship.title}
        </div>
        <p style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.4, margin: 0 }}>
          {flagship.desc}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
          {flagship.tech.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 10.5,
                padding: '2px 7px',
                borderRadius: 5,
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                fontWeight: 600,
                color: 'var(--t2)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 3-Tab Curriculum / Capstone / Credentials Switcher */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: 3,
          borderRadius: 10,
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
        }}
      >
        {tabs.map((tKey, idx) => {
          const active = activeTab === tKey;
          return (
            <button
              key={tKey}
              type="button"
              data-testid={`plan-tab-${tKey}`}
              onClick={() => setActiveTab(tKey)}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: 8,
                border: 'none',
                background: active ? 'var(--card)' : 'transparent',
                color: active ? 'var(--t1)' : 'var(--t3)',
                fontSize: 11.5,
                fontWeight: active ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: active ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {TAB_LABELS[idx]}
            </button>
          );
        })}
      </div>

      {/* Tab Content Box */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          minHeight: 120,
        }}
      >
        {activeTab === 'curriculum' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {modules.map((m) => (
              <div
                key={m.month}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 10px',
                  background: 'var(--bg3)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'var(--t2)',
                }}
              >
                <span>{m.icon}</span>
                <span style={{ fontWeight: 700, flex: 1, color: 'var(--t1)' }}>{m.title}</span>
                {m.skills.slice(0, 2).map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 10.5,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: 'var(--accent-light)',
                      color: 'var(--accent)',
                      fontWeight: 700,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            ))}
            {onOpenDiagnosticReport && (
              <button
                type="button"
                onClick={() => onOpenDiagnosticReport(`${plan.title} Diagnostic Assessment`)}
                style={{
                  alignSelf: 'flex-start',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'var(--accent)',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 2,
                }}
              >
                📊 View Diagnostic Assessment Report ➔
              </button>
            )}
          </div>
        )}

        {activeTab === 'capstone' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { s: 'Sprint 1', d: 'Requirements & Architecture Design' },
              { s: 'Sprint 2', d: 'Core Feature Implementation & Auth' },
              { s: 'Sprint 3', d: 'Integration, Testing & CI/CD Pipeline' },
              { s: 'Sprint 4', d: 'Deploy & Oral Defense Review' },
            ].map((sp) => (
              <div
                key={sp.s}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  background: 'var(--bg3)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              >
                <span style={{ fontWeight: 800, color: hc }}>{sp.s}</span>
                <span style={{ color: 'var(--t2)' }}>{sp.d}</span>
              </div>
            ))}
            <p style={{ fontSize: 11, color: 'var(--t3)', margin: '4px 0 0 0' }}>
              <strong>Stack:</strong> Microservices • PostgreSQL/Supabase • GitHub Actions + Docker
            </p>
          </div>
        )}

        {activeTab === 'credentials' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              '✓ Industrial Project Certificate (ISO-Aligned, Cryptographically Signed)',
              '✓ PinIT Tech Labs Experience Letter (Engineering Fellow)',
              '✓ SHA-256 Tamper-Proof Hash & QR Verifiable',
              '✓ Live Public Verification at /verify/[id]',
            ].map((c, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.4 }}>
                {c}
              </div>
            ))}
            <button
              type="button"
              data-testid="btn-preview-credentials"
              onClick={() => onPreviewCredentials(plan)}
              style={{
                alignSelf: 'flex-start',
                marginTop: 6,
                padding: '6px 12px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                color: '#000000',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(245,158,11,0.25)',
              }}
            >
              🏆 Preview Sample Credentials ➔
            </button>
          </div>
        )}
      </div>

      {/* Rewards & Savings Footnote */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderRadius: 10,
          background: 'var(--accent-light)',
          border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--accent)',
        }}
      >
        <span>📦 +{plan.scholarCashbackPins || 350} Scholar Reward Coins</span>
        <span style={{ color: 'var(--green)', fontWeight: 800 }}>💡 {plan.competitorSavings}</span>
      </div>

      {/* Pricing & CTA Button */}
      <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 21, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-display)' }}>
              ⚡ {plan.pinsPrice}
            </span>
            <span style={{ fontSize: 12.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
              Pins · ₹{plan.inrPrice.toLocaleString('en-IN')}
            </span>
          </div>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 6,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              fontSize: 10.5,
              fontWeight: 900,
              color: '#000000',
            }}
          >
            PINIT2026 (-₹1,000)
          </span>
        </div>

        <button
          type="button"
          data-testid={`btn-select-plan-${plan.id}`}
          onClick={() => onSelectPlan(plan)}
          disabled={isSelected}
          style={{
            padding: '11px 18px',
            borderRadius: 10,
            border: 'none',
            background: isSelected
              ? 'var(--bg3)'
              : `linear-gradient(135deg, ${hc}, var(--accent))`,
            color: isSelected ? 'var(--t3)' : '#ffffff',
            fontSize: 14,
            fontWeight: 800,
            cursor: isSelected ? 'default' : 'pointer',
            boxShadow: isSelected ? 'none' : `0 4px 14px color-mix(in srgb, ${hc} 40%, transparent)`,
            transition: 'all 0.15s ease',
            letterSpacing: '0.01em',
            width: '100%',
          }}
        >
          {isSelected ? '✓ Currently Active Plan' : 'Select & Unlock Program ➔'}
        </button>
      </div>
    </div>
  );
};

export default EnhancedCrashCoursePlanCard;
