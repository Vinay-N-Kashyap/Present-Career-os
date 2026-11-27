'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getIstDateKey,
  PRIORITY_CATALOG_XP,
  type ServerPriorityAction,
} from '@/lib/dashboard/dashboardMetrics';

export interface ActionProfile {
  user_id?: string;
  ats_score?: number;
  has_resume_in_vault?: boolean;
  trust_score?: number;
  career_dna_score?: number;
  mission_streak?: number;
  missions_completed?: number;
  recruiter_visibility?: number;
  vault_count?: number;
  interviews_done?: number;
  weak_areas?: string[];
  skill_tags?: string[];
  xp_total?: number;
  active_track?: 'sde' | 'iot' | string;
  target_role?: string;
  server_actions?: ServerPriorityAction[];
}

interface Action {
  id: string;
  icon: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  xp: string;
  xpAmount?: number;
  rewardClaimed?: boolean;
  color: string;
  bg: string;
  border: string;
  urgency: number;
  serverCompleted?: boolean;
  completionReason?: string;
  progressPct?: number;
}

function pickActions(profile: ActionProfile): Action[] {
  const ats = profile?.ats_score || 0;
  const trust = profile?.trust_score || 0;
  const streak = profile?.mission_streak || 0;
  const vault = profile?.vault_count || 0;
  const intDone = profile?.interviews_done || 0;
  const trackName = profile?.target_role || (profile?.active_track === 'iot' ? 'IoT Hardware' : 'your target track');
  const dayKey = getIstDateKey();
  const dayIdx = Math.floor(Date.parse(`${dayKey}T00:00:00Z`) / 86400000);

  const candidates: Action[] = [
    {
      id: ats === 0 ? 'upload_resume' : 'daily_quest_lesson',
      icon: ats === 0 ? 'RESUME' : 'QUEST',
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.12)',
      border: 'rgba(99,102,241,0.25)',
      title: ats === 0 ? 'Optimize Resume' : 'Complete 1 Roadmap Lesson',
      desc: ats === 0
        ? `Upload your resume to map keyword gaps for ${trackName}.`
        : `Clear today's focused lesson module in your ${trackName} roadmap.`,
      href: ats === 0 ? '/career-builder' : '/quests',
      cta: ats === 0 ? 'Open Resume Builder' : 'Open Quests',
      xp: ats === 0 ? '+15 Weekly XP' : '+12 Weekly XP',
      xpAmount: ats === 0 ? 15 : 12,
      urgency: ats === 0 ? 95 : 80 + ((dayIdx + 0) % 15),
    },
    {
      id: streak === 0 ? 'daily_streak_guard' : 'daily_mission_sprint',
      icon: streak === 0 ? 'STREAK' : 'SPRINT',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.12)',
      border: 'rgba(245,158,11,0.25)',
      title: streak === 0 ? 'Start Daily Streak' : `Extend ${streak}-Day Streak`,
      desc: streak === 0
        ? 'Complete a 15-min daily mission today to start earning Weekly EXP.'
        : `Finish today's quick sprint to earn Weekly EXP and extend your streak.`,
      href: '/missions',
      cta: "Launch Today's Mission",
      xp: streak === 0 ? '+10 Weekly XP' : '+12 Weekly XP',
      xpAmount: streak === 0 ? 10 : 12,
      urgency: streak === 0 ? 90 : 75 + ((dayIdx + 1) % 15),
    },
    {
      id: 'daily_trust_verify',
      icon: 'TRUST',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.25)',
      title: trust < 50 ? 'Boost Trust Quotient' : `Trust Standing: ${Math.round(trust)}`,
      desc: trust < 50
        ? 'Verify a certificate or pass a quick quiz today to earn Weekly EXP.'
        : 'Keep institutional trust active and verify new credentials in Vault.',
      href: trust < 50 ? '/trust' : '/vault',
      cta: trust < 50 ? 'Verify Credentials' : 'Verify Proof',
      xp: '+10 Weekly XP',
      xpAmount: 10,
      urgency: trust < 50 ? 88 : 70 + ((dayIdx + 2) % 15),
    },
    {
      id: 'daily_mock_interview',
      icon: 'MOCK',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.12)',
      border: 'rgba(59,130,246,0.25)',
      title: intDone === 0 ? 'Complete 1 AI Interview Round' : `Mock Practice (${intDone} Cleared)`,
      desc: 'Practice a focused technical round with Ms. Priya today for Weekly EXP.',
      href: '/interview',
      cta: 'Start Mock Interview',
      xp: '+15 Weekly XP',
      xpAmount: 15,
      urgency: 72 + ((dayIdx + 3) % 15),
    },
    {
      id: 'daily_arena_duel',
      icon: 'ARENA',
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.12)',
      border: 'rgba(6,182,212,0.25)',
      title: vault === 0 ? 'Play 1 Coding Arena Duel' : `Arena Sprint (${vault} Proofs)`,
      desc: 'Compete in a quick timed Arena match today to boost League Points.',
      href: '/arena',
      cta: 'Enter Arena',
      xp: '+15 Weekly XP',
      xpAmount: 15,
      urgency: 74 + ((dayIdx + 4) % 15),
    },
    {
      id: 'daily_gd_round',
      icon: 'DEBATE',
      color: '#14b8a6',
      bg: 'rgba(20,184,166,0.12)',
      border: 'rgba(20,184,166,0.25)',
      title: 'Join 1 Group Discussion',
      desc: 'Sharpen your technical communication in the AI Boardroom today.',
      href: '/interview?tab=gd',
      cta: 'Join GD Room',
      xp: '+12 Weekly XP',
      xpAmount: 12,
      urgency: 68 + ((dayIdx + 5) % 15),
    },
  ];

  return candidates
    .sort((a, b) => b.urgency - a.urgency)
    .slice(0, 3);
}

export interface WhatToDoTodayProps {
  profile?: ActionProfile | null;
  layout?: 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
}

export default function WhatToDoToday({
  profile,
  layout = 'vertical',
  className = '',
  style = {},
}: WhatToDoTodayProps) {
  const safeProfile = profile || ({} as ActionProfile);
  const actions: Action[] = Array.isArray(safeProfile.server_actions) && safeProfile.server_actions.length > 0
    ? safeProfile.server_actions.slice(0, 3).map((sa, idx) => ({
        id: sa.id,
        icon: sa.icon,
        title: sa.title,
        desc: sa.desc,
        href: sa.href,
        cta: sa.cta,
        xp: sa.xp,
        xpAmount: sa.xpAmount,
        rewardClaimed: sa.rewardClaimed,
        color: sa.color,
        bg: sa.bg,
        border: sa.border,
        urgency: 100 - idx,
        serverCompleted: Boolean(sa.completed),
        completionReason: sa.completionReason,
        progressPct: sa.progressPct,
      }))
    : pickActions(safeProfile);
  const isVertical = layout === 'vertical';

  // Honest baseline: 0 items pre-checked on initial render; server-verified actions override local state
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const uidSegment = safeProfile.user_id ? `${safeProfile.user_id}_` : '';
  const todayKey = typeof window !== 'undefined'
    ? `pinit_daily_actions_${uidSegment}${getIstDateKey()}`
    : 'pinit_daily_actions';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(todayKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') setCompletedItems(parsed);
      } else {
        setCompletedItems({});
      }
    } catch {}
  }, [todayKey]);

  const toggleComplete = async (action: Action) => {
    if (action.serverCompleted || completedItems[action.id] || claimingId === action.id) {
      return;
    }

    setCompletedItems(prev => {
      const next = { ...prev, [action.id]: true };
      if (typeof window !== 'undefined') {
        try { localStorage.setItem(todayKey, JSON.stringify(next)); } catch {}
      }
      return next;
    });

    if (!PRIORITY_CATALOG_XP[action.id] || typeof fetch === 'undefined') return;
    setClaimingId(action.id);
    try {
      const res = await fetch('/api/dashboard/priority-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priorityId: action.id }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('pinit:user_profile_updated', {
              detail: {
                source: 'priority_complete',
                ...(typeof data.newWeeklyXp === 'number' ? { weekly_xp: data.newWeeklyXp } : {}),
                ...(typeof data.newXp === 'number' ? { xp_total: data.newXp } : {}),
              },
            })
          );
        }
      }
    } catch {
      // Non-fatal network error; next dashboard refresh reconciles state
    } finally {
      setClaimingId(null);
    }
  };

  const doneCount = actions.filter(a => Boolean(a.serverCompleted || completedItems[a.id])).length;

  return (
    <div
      data-testid="what-to-do-today-root"
      className={`db-glass ${className}`.trim()}
      style={{
        padding: '20px 22px',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: isVertical ? 14 : 16 }}>
        <div>
          <span className="db-label" style={{ marginBottom: 2 }}>WHAT TO DO TODAY</span>
          <Link
            href="/missions"
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: 'var(--dash-text, var(--t1))',
              fontFamily: 'var(--font-display)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
            }}
          >
            <span>{isVertical ? '3 Priority Actions' : '3 concise actions personalized to your career progress'}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ color: 'var(--t3)' }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            data-testid="actions-done-pill"
            className="db-tabular"
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: doneCount === actions.length ? '#10b981' : 'var(--dash-subtext, var(--t2))',
              background: doneCount === actions.length ? 'rgba(16,185,129,0.12)' : 'var(--dash-subtle-bg, var(--bg3))',
              padding: '3px 9px',
              borderRadius: 7,
              border: `1px solid ${doneCount === actions.length ? 'rgba(16,185,129,0.32)' : 'var(--dash-inner-border, var(--border))'}`,
            }}
          >
            {doneCount}/{actions.length} Done
          </span>
          <Link
            href="/missions"
            className="db-tabular"
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: 'var(--accent-mid, var(--accent))',
              textDecoration: 'none',
              padding: '4px 10px',
              borderRadius: 7,
              background: 'rgba(99,102,241,0.10)',
              border: '1px solid rgba(99,102,241,0.24)',
              whiteSpace: 'nowrap',
            }}
          >
            All missions &rarr;
          </Link>
        </div>
      </div>

      {/* Action cards: vertical flex stack or horizontal grid */}
      <div
        data-testid={isVertical ? 'what-to-do-today-vertical-list' : 'what-to-do-today-horizontal-grid'}
        style={
          isVertical
            ? {
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                flex: 1,
                justifyContent: 'space-between',
              }
            : {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 12,
              }
        }
      >
        {actions.map((action, i) => {
          const isDone = Boolean(action.serverCompleted || completedItems[action.id]);
          return (
            <Link
              key={action.id + '-' + i}
              href={action.href}
              style={{ textDecoration: 'none', display: 'block', flex: isVertical ? 1 : undefined }}
              data-testid={`action-item-${isVertical ? 'vertical' : 'horizontal'}-${i}`}
            >
              <div
                style={{
                  background: isDone ? 'rgba(16, 185, 129, 0.10)' : 'var(--dash-subtle-bg, var(--bg3))',
                  border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.38)' : 'var(--dash-inner-border, var(--border))'}`,
                  borderRadius: 12,
                  padding: isVertical ? '12px 15px' : '14px 16px',
                  cursor: 'pointer',
                  transition: 'transform 0.18s ease, border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease',
                  borderLeft: `3.5px solid ${isDone ? '#10b981' : action.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  height: '100%',
                  boxSizing: 'border-box',
                  boxShadow: isDone
                    ? '0 4px 14px -2px rgba(16, 185, 129, 0.16)'
                    : 'var(--hud-card-shadow, 0 2px 8px -1px rgba(0,0,0,0.05))',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = isVertical ? 'translateX(4px)' : 'translateY(-2px)';
                  e.currentTarget.style.borderColor = isDone ? '#10b981' : action.color;
                  e.currentTarget.style.boxShadow = isDone
                    ? '0 8px 18px -4px rgba(16, 185, 129, 0.25)'
                    : '0 8px 18px -4px rgba(99, 102, 241, 0.20)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = isDone ? 'rgba(16, 185, 129, 0.38)' : 'var(--dash-inner-border, var(--border))';
                  e.currentTarget.style.borderLeftColor = isDone ? '#10b981' : action.color;
                  e.currentTarget.style.boxShadow = isDone
                    ? '0 4px 14px -2px rgba(16, 185, 129, 0.16)'
                    : 'var(--hud-card-shadow, 0 2px 8px -1px rgba(0,0,0,0.05))';
                }}
              >
                {/* Left Checkbox */}
                <button
                  type="button"
                  aria-label={`Toggle action item ${i + 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void toggleComplete(action);
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: `1.5px solid ${isDone ? '#10b981' : 'var(--dash-border-strong, var(--border2))'}`,
                    background: isDone ? 'rgba(16, 185, 129, 0.22)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#10b981',
                    flexShrink: 0,
                    padding: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isDone ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : null}
                </button>

                {/* Center Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span
                      className="db-tabular"
                      style={{
                        fontSize: 9.5,
                        fontWeight: 900,
                        color: action.color,
                        background: action.bg,
                        padding: '1.5px 6px',
                        borderRadius: 4,
                        letterSpacing: '0.04em',
                        flexShrink: 0,
                      }}
                    >
                      {action.icon}
                    </span>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: isVertical ? 13 : 13.5,
                        color: isDone ? 'var(--dash-subtext, var(--t2))' : 'var(--dash-text, var(--t1))',
                        textDecoration: isDone ? 'line-through' : 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {action.title}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: 'var(--dash-subtext, var(--t3))',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {action.desc}
                  </div>
                </div>

                {/* Right Single Contextual XP Reward or Server Verified Badge + Subtle Chevron */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {action.completionReason ? (
                    <span
                      className="db-tabular"
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: isDone ? '#10b981' : 'var(--dash-subtext, var(--t2))',
                        background: isDone ? 'rgba(16,185,129,0.14)' : 'rgba(99,102,241,0.10)',
                        border: `1px solid ${isDone ? 'rgba(16,185,129,0.32)' : 'rgba(99,102,241,0.22)'}`,
                        padding: '2px 6px',
                        borderRadius: 6,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {action.completionReason}
                    </span>
                  ) : null}
                  <span
                    className="db-tabular"
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      color: isDone ? '#10b981' : '#06b6d4',
                      background: isDone ? 'rgba(16,185,129,0.12)' : 'rgba(6,182,212,0.12)',
                      border: `1px solid ${isDone ? 'rgba(16,185,129,0.3)' : 'rgba(6,182,212,0.26)'}`,
                      padding: '2.5px 7px',
                      borderRadius: 6,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isDone && typeof action.xpAmount === 'number' ? `+${action.xpAmount} XP Done` : action.xp}
                  </span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ color: 'var(--t3)', opacity: 0.7 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
