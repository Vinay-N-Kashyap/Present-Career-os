'use client';

import React from 'react';
import type { CareerTrajectory, TrajectoryNode } from '@/lib/data/careerTrajectories';
import type { Course } from '@/lib/data/coursesData';
import { getAuthoritativeQuest } from '@/lib/quests/questRegistry';
import { toast } from '@/lib/store/useAppStore';
import {
  ExtraRoadmap,
  LearningPathMode,
  extraRoadmapMode,
  formatCompactDuration,
  formatDurationLabel,
} from '@/lib/quests/extraRoadmaps';
import {
  Quest,
  Module,
  playPopSound
} from './useQuestProgression';

export interface QuestPathViewProps {
  activeCourseId: string | null;
  setActiveCourseId: (id: string) => void;
  trajectory: CareerTrajectory;
  COURSES_REGISTRY: Course[];
  completedQuests: string[];
  modules?: Module[];
  setShowFullJourneyModal: (show: boolean) => void;
  learningPathMode: LearningPathMode;
  setLearningPathMode: (mode: LearningPathMode) => void;
  fusedCourseId?: string;
  extraRoadmaps: ExtraRoadmap[];
  closeExtraRoadmap: (id: string) => void;
  setShowRoadmapModal: (show: boolean) => void;
  isPlacementPrepFastTrack: boolean;
  setIsPlacementPrepFastTrack: (val: boolean) => void;
  setActiveGateModalNode: (node: TrajectoryNode | null) => void;
  handleLaunchQuest: (quest: Quest, courseId: string) => void;
  pinsHistory: any[];
  onboardingAnswers: any;
  historyFilter: 'all' | 'quests' | 'pins';
  setHistoryFilter: (filter: 'all' | 'quests' | 'pins') => void;
  activeSubTab: 'certification_passport' | 'custom_roadmap' | 'standalone' | 'language';
  router: any;
}

export const QuestPathView: React.FC<QuestPathViewProps> = ({
  activeCourseId,
  setActiveCourseId,
  trajectory,
  COURSES_REGISTRY,
  completedQuests,
  modules = [],
  setShowFullJourneyModal,
  learningPathMode,
  setLearningPathMode,
  fusedCourseId,
  extraRoadmaps,
  closeExtraRoadmap,
  setShowRoadmapModal,
  isPlacementPrepFastTrack,
  setIsPlacementPrepFastTrack,
  setActiveGateModalNode,
  handleLaunchQuest,
  pinsHistory,
  onboardingAnswers,
  historyFilter,
  setHistoryFilter,
  activeSubTab,
  router
}) => {
  const [expandedStages, setExpandedStages] = React.useState<Record<string, boolean>>({});
  const [focusedStageIdx, setFocusedStageIdx] = React.useState<number | null>(null);

  const activeExtra = learningPathMode.startsWith('extra:')
    ? extraRoadmaps.find(rm => extraRoadmapMode(rm.id) === learningPathMode) || null
    : null;
  const activeEvidence = activeExtra?.evidenceSummary || (onboardingAnswers as any)?.roadmap_evidence_summary || null;
  const isResumePersonalized = Boolean(
    activeExtra?.usedResume !== false &&
    activeEvidence?.usedResume !== false &&
    (activeEvidence?.resumeTitle || (activeEvidence?.provenSkills?.length > 0) || (activeEvidence?.targetGaps?.length > 0))
  );

  const totalDurationDays = Math.max(
    30,
    activeExtra?.durationDays ||
      trajectory?.targetTotalDays ||
      (modules.length > 0 && typeof (modules[modules.length - 1] as any)?.endDay === 'number'
        ? Number((modules[modules.length - 1] as any).endDay)
        : modules.length * 7) ||
      30
  );

  const stageItems = React.useMemo(() => {
    if (activeSubTab === 'custom_roadmap' && modules && modules.length > 0) {
      let dayCursor = 1;
      const totalQ = Math.max(1, modules.reduce((s, m) => s + (m.quests?.length || 0), 0));
      return modules.map((m: any, idx) => {
        const qs = m.quests || [];
        const cleared = qs.filter((q: Quest) => completedQuests.includes(q.id)).length;
        const pct = Math.min(100, Math.round((cleared / Math.max(1, qs.length)) * 100));
        const isCompleted = qs.length > 0 && cleared === qs.length;
        const explicitStart = typeof m.startDay === 'number' ? m.startDay : null;
        const explicitEnd = typeof m.endDay === 'number' ? m.endDay : null;
        const estSpan = idx === modules.length - 1
          ? Math.max(1, totalDurationDays - dayCursor + 1)
          : Math.max(1, Math.round((qs.length / totalQ) * totalDurationDays));
        const startDay = explicitStart ?? dayCursor;
        const endDay = explicitEnd ?? Math.min(totalDurationDays, startDay + estSpan - 1);
        dayCursor = endDay + 1;
        return {
          key: m.id,
          anchorId: `stage-card-${m.id}`,
          courseId: m.courseId || activeCourseId || COURSES_REGISTRY[0]?.id,
          title: (m.title || `Stage ${idx + 1}`).replace(/^Phase\s*\d+:\s*/i, '').trim() || m.title,
          shortLabel: (m.courseTitle || m.title || `Stage ${idx + 1}`).replace(/^Phase\s*\d+:\s*/i, '').trim(),
          desc: m.desc || '',
          whyThisStage: m.whyThisStage || '',
          difficulty: m.difficulty || 'Intermediate',
          startDay,
          endDay,
          estimatedWeeks: m.estimatedWeeks || Math.max(1, Math.round((endDay - startDay + 1) / 7)),
          cleared,
          total: qs.length,
          pct,
          isCompleted,
          quests: qs,
        };
      });
    }

    const nodes = trajectory?.nodes || [];
    let dayCursor = 1;
    return nodes.map((node, idx) => {
      const nodeCourse = COURSES_REGISTRY.find(c => c.id === node.courseId) || COURSES_REGISTRY[0];
      const qs = nodeCourse?.quests || [];
      const cleared = qs.filter(q => completedQuests.includes(q.id)).length;
      const pct = Math.min(100, Math.round((cleared / Math.max(1, qs.length)) * 100));
      const span = Math.max(7, node.estimatedDays || 15);
      const startDay = dayCursor;
      const endDay = startDay + span - 1;
      dayCursor = endDay + 1;
      return {
        key: node.nodeId,
        anchorId: `node-card-${node.nodeId}`,
        courseId: node.courseId,
        title: node.title,
        shortLabel: node.title,
        desc: node.shortDesc || '',
        whyThisStage: node.careerImpact || '',
        difficulty: idx === 0 ? 'Foundational' : idx >= 2 ? 'Advanced' : 'Intermediate',
        startDay,
        endDay,
        estimatedWeeks: Math.max(1, Math.round(span / 7)),
        cleared,
        total: qs.length || 30,
        pct,
        isCompleted: pct === 100 && qs.length > 0,
        quests: qs,
        node,
      };
    });
  }, [activeSubTab, modules, trajectory, completedQuests, COURSES_REGISTRY, activeCourseId, totalDurationDays]);

  const activeStageIdxComputed = React.useMemo(() => {
    const firstIncomplete = stageItems.findIndex((s) => !s.isCompleted);
    if (firstIncomplete >= 0) return firstIncomplete;
    return Math.max(0, stageItems.length - 1);
  }, [stageItems]);

  const overallClearedCount = stageItems.reduce((sum, s) => sum + s.cleared, 0);
  const overallTotalCount = Math.max(1, stageItems.reduce((sum, s) => sum + s.total, 0));
  const overallPct = Math.min(100, Math.round((overallClearedCount / overallTotalCount) * 100));

  const targetFinishLabel = React.useMemo(() => {
    const dt = new Date(Date.now() + totalDurationDays * 86400000);
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, [totalDurationDays]);

  const scrollToStage = (item: typeof stageItems[number], idx: number) => {
    playPopSound();
    setFocusedStageIdx(idx);
    if (item.courseId) setActiveCourseId(item.courseId);
    if (typeof document !== 'undefined') {
      const el = document.getElementById(item.anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const STEP_ACCENTS = ['#10b981', '#6366f1', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6'];

  return (
    <>
      {/* ── MODE 2: Executive Dynamic Career Roadmap & Interactive Timeline ── */}
      <div
        data-testid="quest-path-view-root"
        className="animate-fade-in"
        id="quest-roadmap-chart-section"
      >
        {/* Top Command Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 18,
            flexWrap: 'wrap',
            gap: 16,
            padding: '20px 24px',
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(99,102,241,0.08))',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ flex: '1 1 380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <span
                data-testid="roadmap-duration-badge"
                style={{
                  fontSize: 11.5,
                  fontWeight: 900,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: 'rgba(16,185,129,0.16)',
                  border: '1px solid rgba(16,185,129,0.35)',
                  color: '#34d399',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {formatDurationLabel(totalDurationDays)}
              </span>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: isResumePersonalized ? 'rgba(99,102,241,0.18)' : 'rgba(148,163,184,0.14)',
                  border: `1px solid ${isResumePersonalized ? 'rgba(99,102,241,0.35)' : 'var(--border)'}`,
                  color: isResumePersonalized ? '#a5b4fc' : 'var(--t2)',
                }}
              >
                {isResumePersonalized ? 'Resume + Gap Personalized' : 'Goal-Aligned Curriculum'}
              </span>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: 'var(--t2)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {overallClearedCount} / {overallTotalCount} Quests ({overallPct}%)
              </span>
            </div>

            <h2
              data-testid="quest-roadmap-title"
              style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-display)', letterSpacing: '-0.3px', margin: 0 }}
            >
              Dynamic Career Roadmap ({activeExtra?.goal || COURSES_REGISTRY.find(c => c.id === activeCourseId)?.title.split('(')[0].trim() || onboardingAnswers?.role || trajectory.roleTitle})
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--t3)', margin: '6px 0 0 0' }}>
              Click any timeline phase or stage card to launch calibrated lessons, coding labs, and milestone tests.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              data-testid="btn-open-custom-roadmap"
              onClick={() => {
                playPopSound();
                setShowRoadmapModal(true);
              }}
              style={{
                padding: '10px 18px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(16,185,129,0.28)',
              }}
            >
              + New Custom Roadmap
            </button>
            <button
              type="button"
              data-testid="btn-view-detailed-journey"
              onClick={() => setShowFullJourneyModal(true)}
              style={{
                padding: '10px 16px',
                borderRadius: 12,
                border: '1.5px solid rgba(16,185,129,0.45)',
                background: 'rgba(16,185,129,0.12)',
                color: '#34d399',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              View Entire Detailed Journey ➔
            </button>
          </div>
        </div>

        {/* Clean Saved Roadmap Tab Bar */}
        {activeSubTab === 'custom_roadmap' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderRadius: 16,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            marginBottom: 18,
            flexWrap: 'wrap',
            gap: 10,
          }}>
            <div role="tablist" aria-label="Learning roadmaps" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', maxWidth: '100%' }}>
              <button
                type="button"
                role="tab"
                aria-selected={learningPathMode === 'fused_roadmap'}
                onClick={() => {
                  playPopSound();
                  setLearningPathMode('fused_roadmap');
                  if (fusedCourseId) setActiveCourseId(fusedCourseId);
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: 10,
                  border: `1.5px solid ${learningPathMode === 'fused_roadmap' ? '#10b981' : 'var(--border)'}`,
                  background: learningPathMode === 'fused_roadmap' ? 'rgba(16,185,129,0.16)' : 'var(--bg3)',
                  color: learningPathMode === 'fused_roadmap' ? '#34d399' : 'var(--t2)',
                  fontSize: 13.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>Fused Career Trajectory</span>
                <span style={{ fontSize: 11, fontWeight: 800, background: 'rgba(16,185,129,0.22)', padding: '2px 7px', borderRadius: 6, color: '#34d399' }}>
                  Primary
                </span>
              </button>

              {extraRoadmaps.map(rm => {
                const isOn = learningPathMode === extraRoadmapMode(rm.id);
                return (
                  <div
                    key={rm.id}
                    role="tab"
                    aria-selected={isOn}
                    onClick={() => {
                      playPopSound();
                      setLearningPathMode(extraRoadmapMode(rm.id));
                      setActiveCourseId(rm.courseId);
                    }}
                    onAuxClick={(e) => {
                      if (e.button === 1) {
                        e.preventDefault();
                        e.stopPropagation();
                        closeExtraRoadmap(rm.id);
                      }
                    }}
                    title={`${rm.goal} · ${formatDurationLabel(rm.durationDays)} · close with ×`}
                    style={{
                      padding: '7px 8px 7px 14px',
                      borderRadius: 10,
                      border: `1.5px solid ${isOn ? '#f59e0b' : 'var(--border)'}`,
                      background: isOn ? 'rgba(245,158,11,0.16)' : 'var(--bg3)',
                      color: isOn ? '#fbbf24' : 'var(--t2)',
                      fontSize: 13.5,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                    }}
                  >
                    <span style={{ whiteSpace: 'nowrap' }}>Roadmap {rm.number}</span>
                    <span style={{
                      fontSize: 10.5,
                      fontWeight: 900,
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 6px',
                      borderRadius: 5,
                      background: isOn ? 'rgba(245,158,11,0.22)' : 'rgba(255,255,255,0.06)',
                      color: isOn ? '#fcd34d' : 'var(--t3)',
                    }}>
                      {formatCompactDuration(rm.durationDays)}
                    </span>
                    <button
                      type="button"
                      aria-label={`Close Roadmap ${rm.number}`}
                      title="Close tab"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeExtraRoadmap(rm.id);
                      }}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        border: 'none',
                        background: isOn ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.06)',
                        color: isOn ? '#fff' : 'var(--t3)',
                        cursor: 'pointer',
                        fontSize: 14,
                        lineHeight: '20px',
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                title="Create new custom roadmap"
                onClick={() => {
                  playPopSound();
                  setShowRoadmapModal(true);
                }}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: '1.5px dashed rgba(16,185,129,0.5)',
                  background: 'rgba(16,185,129,0.08)',
                  color: '#34d399',
                  fontSize: 20,
                  fontWeight: 800,
                  cursor: 'pointer',
                  lineHeight: 1
                }}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Interactive Horizontal Phase Timeline Strip */}
        {stageItems.length > 0 && (
          <div
            data-testid="roadmap-timeline-strip"
            style={{
              padding: '18px 20px',
              borderRadius: 20,
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              marginBottom: 22,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#34d399' }}>
                  Execution Timeline
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t2)' }}>
                  Day 1 → Day {totalDurationDays} ({stageItems.length} Phases)
                </span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                Est. Target Finish: <strong style={{ color: 'var(--t1)' }}>{targetFinishLabel}</strong>
              </div>
            </div>

            {/* Overall Progress Rail */}
            <div style={{ position: 'relative', height: 8, borderRadius: 999, background: 'var(--bg3)', overflow: 'hidden', marginBottom: 14, border: '1px solid var(--border)' }}>
              <div
                style={{
                  width: `${Math.max(overallPct > 0 ? overallPct : 3, 0)}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, #10b981, #06b6d4, #6366f1)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            {/* Clickable Phase Timeline Stops */}
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {stageItems.map((item, idx) => {
                const accent = STEP_ACCENTS[idx % STEP_ACCENTS.length];
                const isActive = (focusedStageIdx ?? activeStageIdxComputed) === idx;
                return (
                  <button
                    key={item.key || `tl-${idx}`}
                    type="button"
                    onClick={() => scrollToStage(item, idx)}
                    style={{
                      flex: '1 0 155px',
                      minWidth: 155,
                      maxWidth: 230,
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: 12,
                      border: `1.5px solid ${item.isCompleted ? '#10b981' : isActive ? accent : 'var(--border)'}`,
                      background: isActive ? `${accent}18` : 'var(--bg3)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 900, fontFamily: 'var(--font-mono)', color: item.isCompleted ? '#10b981' : accent }}>
                        Day {item.startDay}–{item.endDay}
                      </span>
                      <span style={{
                        fontSize: 9.5,
                        fontWeight: 900,
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: item.isCompleted ? 'rgba(16,185,129,0.2)' : isActive ? `${accent}26` : 'rgba(255,255,255,0.06)',
                        color: item.isCompleted ? '#34d399' : isActive ? '#ffffff' : 'var(--t3)',
                      }}>
                        {item.isCompleted ? 'DONE' : isActive ? 'ACTIVE' : `${item.pct}%`}
                      </span>
                    </div>
                    <div style={{
                      fontSize: 12.5,
                      fontWeight: 800,
                      color: 'var(--t1)',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {idx + 1}. {item.shortLabel}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 32% / 68% CLEAN EXECUTIVE TIMELINE + STAGE WORKSPACE ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 32%) minmax(0, 1fr)', gap: 22, marginTop: 12, alignItems: 'start' }}>

          {/* ── LEFT COLUMN (32%): Sticky Milestone Progress Spine ── */}
          <div
            className="glass-card-premium"
            style={{
              padding: '20px 18px',
              borderRadius: 22,
              border: '1px solid var(--border)',
              background: 'var(--bg2)',
              position: 'sticky',
              top: 18,
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16.5, fontWeight: 900, color: 'var(--t1)', margin: 0, fontFamily: 'var(--font-display)' }}>
                  Milestone Map
                </h3>
                <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>
                  {stageItems.length} structured phases · {totalDurationDays} days
                </span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, background: 'rgba(16,185,129,0.14)', color: '#34d399', padding: '3px 9px', borderRadius: 999 }}>
                Live Flow
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stageItems.map((item, idx) => {
                const accent = STEP_ACCENTS[idx % STEP_ACCENTS.length];
                const isSelected = (focusedStageIdx ?? activeStageIdxComputed) === idx;
                const isPrevPending = idx > 0 && !stageItems[idx - 1].isCompleted && stageItems[idx - 1].total > 0;
                return (
                  <button
                    key={item.key || `tl-${idx}`}
                    type="button"
                    onClick={() => scrollToStage(item, idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      width: '100%',
                      textAlign: 'left',
                      padding: '11px 12px',
                      borderRadius: 14,
                      border: `1.5px solid ${isSelected ? accent : item.isCompleted ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
                      background: isSelected ? `linear-gradient(135deg, ${accent}1a, var(--bg3))` : 'var(--bg3)',
                      cursor: 'pointer',
                      opacity: isPrevPending && !isSelected ? 0.72 : 1,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        flexShrink: 0,
                        background: item.isCompleted ? '#10b981' : isSelected ? accent : 'var(--bg2)',
                        border: `2px solid ${item.isCompleted ? '#34d399' : accent}`,
                        color: item.isCompleted || isSelected ? '#ffffff' : 'var(--t1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: 900,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {item.isCompleted ? '✓' : idx + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: item.isCompleted ? '#34d399' : accent, fontFamily: 'var(--font-mono)' }}>
                          DAYS {item.startDay}–{item.endDay}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                          {item.cleared}/{item.total}
                        </span>
                      </div>
                      <div style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: 'var(--t1)',
                        lineHeight: 1.35,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {item.title}
                      </div>
                      <div style={{ height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.06)', marginTop: 7, overflow: 'hidden' }}>
                        <div style={{ width: `${item.pct}%`, height: '100%', background: item.isCompleted ? '#10b981' : accent }} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT COLUMN (68%): Detailed Stage Cards & Calibrated Quests ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {isResumePersonalized && activeEvidence && (
              <div
                data-testid="roadmap-personalization-banner"
                style={{
                  padding: '13px 16px',
                  borderRadius: 16,
                  background: 'rgba(16, 185, 129, 0.09)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  fontSize: 12.5,
                  color: 'var(--t2)',
                }}
              >
                <div style={{ fontWeight: 900, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 11.5 }}>
                  Personalized From Your Resume, Vault &amp; Target Gaps
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  {activeEvidence.resumeTitle && <span>Resume: <strong style={{ color: 'var(--t1)' }}>{activeEvidence.resumeTitle}</strong></span>}
                  {Array.isArray(activeEvidence.provenSkills) && activeEvidence.provenSkills.length > 0 && (
                    <span>Proven Skills: <strong style={{ color: 'var(--t1)' }}>{activeEvidence.provenSkills.slice(0, 6).join(', ')}</strong></span>
                  )}
                  {Array.isArray(activeEvidence.targetGaps) && activeEvidence.targetGaps.length > 0 && (
                    <span>Target Gaps Prioritized: <strong style={{ color: '#fbbf24' }}>{activeEvidence.targetGaps.slice(0, 5).join(', ')}</strong></span>
                  )}
                </div>
              </div>
            )}

            {activeSubTab === 'custom_roadmap' ? (
              modules && modules.length > 0 ? (
                stageItems.map((item, idx) => {
                  const mod = modules[idx] as any;
                  const stageQuests: Quest[] = item.quests || [];
                  const isStageCompleted = item.isCompleted;
                  const isLocked = idx > 0 && !stageItems[idx - 1].isCompleted && stageItems[idx - 1].total > 0;
                  const nextQuestInStage = stageQuests.find(q => !completedQuests.includes(q.id)) || stageQuests[0];
                  const currentColor = STEP_ACCENTS[idx % STEP_ACCENTS.length];
                  const isExpanded = Boolean(expandedStages[item.key]);
                  const nextIdx = stageQuests.findIndex(q => !completedQuests.includes(q.id));
                  const windowStart = nextIdx > 2 ? Math.max(0, nextIdx - 1) : 0;
                  const visibleQuests = isExpanded
                    ? stageQuests
                    : stageQuests.slice(windowStart, windowStart + 6);

                  return (
                    <div
                      id={item.anchorId}
                      key={item.key}
                      onClick={() => {
                        if (isLocked) {
                          toast.warning('Prerequisite Stage Locked', 'Please complete the previous stage quests before advancing to this stage.');
                          return;
                        }
                        if (isStageCompleted) {
                          toast.warning('Milestone Completed 🔒', 'All classes in this milestone have been completed. Previous classes cannot be re-accessed.');
                          return;
                        }
                        if (nextQuestInStage) {
                          handleLaunchQuest(nextQuestInStage, item.courseId || 'course-fullstack-js');
                        }
                      }}
                      className={`glass-card-premium ${isLocked ? '' : 'card-hover'}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 14,
                        padding: '20px 22px',
                        borderRadius: 20,
                        border: isStageCompleted
                          ? '1.5px solid #10b981'
                          : !isLocked
                            ? `1.5px solid ${currentColor}`
                            : '1px solid var(--border)',
                        background: !isLocked
                          ? `linear-gradient(135deg, ${currentColor}12, var(--bg2))`
                          : 'var(--bg2)',
                        cursor: isLocked ? 'not-allowed' : 'pointer',
                        opacity: isLocked ? 0.65 : 1,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 320px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 900, background: `${currentColor}24`, color: currentColor, padding: '3px 8px', borderRadius: 6, border: `1px solid ${currentColor}44` }}>
                              STAGE {idx + 1}
                            </span>
                            <span style={{ fontSize: 10.5, fontWeight: 800, fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.06)', color: 'var(--t2)', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>
                              Days {item.startDay}–{item.endDay} (~{item.estimatedWeeks}w)
                            </span>
                            <span style={{ fontSize: 10.5, fontWeight: 800, background: 'var(--bg3)', color: 'var(--t3)', padding: '3px 8px', borderRadius: 6 }}>
                              {item.difficulty}
                            </span>
                          </div>
                          <h3 style={{ fontSize: 17.5, fontWeight: 900, color: 'var(--t1)', margin: 0, lineHeight: 1.3 }}>
                            {item.title}
                          </h3>
                          <p style={{ fontSize: 13, color: 'var(--t3)', margin: '6px 0 0 0', lineHeight: 1.45 }}>
                            {item.desc}
                          </p>
                          {mod?.whyThisStage && (
                            <div style={{ fontSize: 12, color: '#34d399', fontWeight: 700, marginTop: 6 }}>
                              {mod.whyThisStage}
                            </div>
                          )}
                        </div>

                        <div style={{ minWidth: 155, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, marginLeft: 'auto' }}>
                          <div style={{ fontSize: 12.5, fontWeight: 800, color: isStageCompleted ? '#10b981' : currentColor, fontFamily: 'var(--font-mono)' }}>
                            {item.cleared} / {item.total} Cleared ({item.pct}%)
                          </div>
                          <div style={{ width: 136, height: 6, background: 'var(--bg3)', borderRadius: 999, overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <div style={{ width: `${item.pct}%`, height: '100%', background: isStageCompleted ? '#10b981' : currentColor }} />
                          </div>
                          <button
                            type="button"
                            style={{
                              marginTop: 4,
                              background: isStageCompleted ? 'rgba(16,185,129,0.12)' : isLocked ? 'var(--bg3)' : `linear-gradient(135deg, ${currentColor}, #059669)`,
                              border: isStageCompleted ? '1px solid #10b981' : 'none',
                              color: isStageCompleted ? '#34d399' : isLocked ? 'var(--t4)' : '#ffffff',
                              padding: '7px 14px',
                              borderRadius: 10,
                              fontSize: 12.5,
                              fontWeight: 800,
                              cursor: isLocked ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {isStageCompleted ? 'Completed ✓' : isLocked ? 'Locked' : 'Continue Stage ➔'}
                          </button>
                        </div>
                      </div>

                      {stageQuests.length > 0 && (
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Calibrated Quests ({visibleQuests.length} of {stageQuests.length} shown)
                            </span>
                            {stageQuests.length > 6 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedStages((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: currentColor,
                                  fontSize: 12,
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  padding: '2px 6px',
                                }}
                              >
                                {isExpanded ? 'Show Compact View' : `Show All ${stageQuests.length} Quests ▾`}
                              </button>
                            )}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 8 }}>
                            {visibleQuests.map((q) => {
                              const realIdx = stageQuests.findIndex((sq) => sq.id === q.id);
                              const isQDone = completedQuests.includes(q.id);
                              const isExam = q.category === 'exam' || q.type === 'interactive' || q.id.includes('exam');
                              const isCode = q.type === 'coding';
                              const catLabel = isExam ? 'EXAM' : isCode ? 'CODE' : 'LEARN';
                              const isPrevQuestDone = realIdx <= 0 || completedQuests.includes(stageQuests[realIdx - 1].id);
                              const isQuestLocked = isLocked || (!isQDone && !isPrevQuestDone);
                              return (
                                <button
                                  key={q.id}
                                  type="button"
                                  disabled={isQuestLocked}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isQuestLocked) {
                                      if (isLocked) {
                                        toast.warning('Prerequisite Stage Locked', 'Complete previous stage quests first.');
                                      } else {
                                        const prevQ = stageQuests[realIdx - 1];
                                        toast.warning('Prerequisite Quest Locked', `Complete "${prevQ?.title || 'previous quest'}" first.`);
                                      }
                                      return;
                                    }
                                    handleLaunchQuest(q, item.courseId || 'course-fullstack-js');
                                  }}
                                  className={isQuestLocked ? '' : 'card-hover'}
                                  style={{
                                    textAlign: 'left',
                                    fontSize: 12.5,
                                    fontWeight: 700,
                                    background: isQDone ? 'rgba(16,185,129,0.14)' : isQuestLocked ? 'var(--bg3)' : 'rgba(15,23,42,0.55)',
                                    border: `1px solid ${isQDone ? '#10b981' : isQuestLocked ? 'rgba(255,255,255,0.05)' : 'var(--border)'}`,
                                    color: isQDone ? '#34d399' : isQuestLocked ? 'var(--t4)' : 'var(--t1)',
                                    padding: '9px 11px',
                                    borderRadius: 10,
                                    cursor: isQuestLocked ? 'not-allowed' : 'pointer',
                                    opacity: isQuestLocked ? 0.65 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                  }}
                                >
                                  <span style={{
                                    fontSize: 10,
                                    fontWeight: 900,
                                    padding: '2px 6px',
                                    borderRadius: 5,
                                    background: isQDone ? 'rgba(16,185,129,0.22)' : 'rgba(255,255,255,0.07)',
                                    color: isQDone ? '#34d399' : isCode ? '#38bdf8' : isExam ? '#fbbf24' : '#a5b4fc',
                                    flexShrink: 0,
                                  }}>
                                    {isQDone ? 'DONE' : catLabel}
                                  </span>
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {q.title.replace(/^Day \d+[:\s-]*/i, '').replace(/Challenge:?\s*/i, '').replace(/Assignment:?\s*/i, '')}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1.5px dashed var(--border)',
                  borderRadius: 20,
                }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)' }}>Personalized Roadmap Initializing</h3>
                  <p style={{ fontSize: 14.5, color: 'var(--t3)', maxWidth: 440, margin: '8px auto 20px', lineHeight: 1.5 }}>
                    We are crafting your stage-by-stage learning path tailored to your target goal and timeline.
                  </p>
                  <button
                    onClick={() => { if (typeof window !== 'undefined') window.location.reload(); }}
                    className="btn-primary"
                    style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}
                  >
                    Synchronize Roadmap
                  </button>
                </div>
              )
            ) : (
              trajectory.nodes.map((node, idx) => {
                const nodeCourse = COURSES_REGISTRY.find(c => c.id === node.courseId) || COURSES_REGISTRY[0];
                const nodeQuests = nodeCourse?.quests || [];
                const nodeCompletedCount = nodeQuests.filter(q => completedQuests.includes(q.id)).length;
                const nodeProgressPct = Math.min(100, Math.round((nodeCompletedCount / Math.max(1, nodeQuests.length)) * 100));
                const isNodeCompleted = nodeProgressPct === 100;
                const isCurrentActiveNode = node.courseId === activeCourseId;
                const isLocked = idx > 0 && (() => {
                  const prevNode = trajectory.nodes[idx - 1];
                  const prevCourse = COURSES_REGISTRY.find(c => c.id === prevNode.courseId);
                  const prevQuests = prevCourse?.quests || [];
                  const prevCleared = prevQuests.filter(q => completedQuests.includes(q.id)).length;
                  return prevCleared < prevQuests.length && prevQuests.length > 0;
                })();
                const nextQuestInNode = nodeQuests.find(q => !completedQuests.includes(q.id)) || nodeQuests[0];
                const currentColor = STEP_ACCENTS[idx % STEP_ACCENTS.length];
                const itemMeta = stageItems[idx];

                return (
                  <div id={`node-card-${node.nodeId || idx}`} key={node.nodeId || `node-${idx}`} style={{ position: 'relative' }}>
                    {node.gate && (
                      <div onClick={() => setActiveGateModalNode(node)} style={{ marginBottom: 10, display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{
                          padding: '7px 14px',
                          background: 'rgba(var(--warning-rgb),0.08)',
                          border: '1px solid rgba(var(--warning-rgb),0.3)',
                          borderRadius: 12,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--amber)',
                          cursor: 'pointer'
                        }} className="card-hover">
                          <span>Career Gate Checkpoint (Click to Audit):</span>
                          <span style={{ color: 'var(--t2)' }}>
                            {node.gate.minDsaScore ? `✓ DSA ≥ ${node.gate.minDsaScore}% ` : ''}
                            {node.gate.minCommunicationScore ? `✓ Soft Skills ≥ ${node.gate.minCommunicationScore}% ` : ''}
                            {node.gate.minAtsScore ? `✓ ATS Resume ≥ ${node.gate.minAtsScore}% ` : ''}
                            {node.gate.requireProjectVerification ? `✓ Capstone Verified` : ''}
                          </span>
                        </div>
                      </div>
                    )}

                    <div
                      onClick={() => {
                        if (isLocked) {
                          toast.warning('Prerequisite Stage Locked', 'Please complete the previous stage quests before advancing to this stage.');
                          return;
                        }
                        if (isNodeCompleted) {
                          toast.warning('Milestone Completed 🔒', 'All classes in this milestone have been completed. Previous classes cannot be re-accessed.');
                          return;
                        }
                        if (nextQuestInNode) {
                          handleLaunchQuest(nextQuestInNode, node.courseId);
                        }
                      }}
                      className={`glass-card-premium ${isLocked ? '' : 'card-hover'}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 18,
                        flexWrap: 'wrap',
                        padding: '20px 22px',
                        borderRadius: 20,
                        border: isCurrentActiveNode ? `1.5px solid ${currentColor}` : isNodeCompleted ? '1.5px solid #10b981' : '1px solid var(--border)',
                        background: isCurrentActiveNode ? `linear-gradient(135deg, ${currentColor}14, var(--bg2))` : 'var(--bg2)',
                        cursor: isLocked ? 'not-allowed' : 'pointer',
                        opacity: isLocked ? 0.65 : 1,
                      }}
                    >
                      <div style={{ flex: '1 1 320px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 900, background: `${currentColor}22`, color: currentColor, padding: '3px 8px', borderRadius: 6 }}>
                            STAGE {idx + 1}
                          </span>
                          {itemMeta && (
                            <span style={{ fontSize: 10.5, fontWeight: 800, fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.06)', color: 'var(--t2)', padding: '3px 8px', borderRadius: 6 }}>
                              Days {itemMeta.startDay}–{itemMeta.endDay}
                            </span>
                          )}
                          <span style={{ fontSize: 10.5, fontWeight: 800, background: 'rgba(16,185,129,0.12)', color: '#34d399', padding: '3px 8px', borderRadius: 6 }}>
                            {node.careerImpact}
                          </span>
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>{node.title}</h3>
                        <p style={{ fontSize: 13, color: 'var(--t3)', margin: '6px 0 8px 0', lineHeight: 1.4 }}>{node.shortDesc}</p>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {node.skillsLearned.map(skill => (
                            <span key={skill} style={{ fontSize: 11, background: 'var(--bg3)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 6, color: 'var(--t2)', fontWeight: 600 }}>
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ minWidth: 150, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 800, color: isNodeCompleted ? '#10b981' : currentColor, fontFamily: 'var(--font-mono)' }}>
                          {nodeCompletedCount} / {nodeQuests.length || 30} Cleared ({nodeProgressPct}%)
                        </div>
                        <div style={{ width: 130, height: 6, background: 'var(--bg3)', borderRadius: 999, overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <div style={{ width: `${nodeProgressPct}%`, height: '100%', background: isNodeCompleted ? '#10b981' : currentColor }} />
                        </div>
                        <button
                          type="button"
                          style={{
                            marginTop: 4,
                            background: isNodeCompleted ? 'rgba(16,185,129,0.12)' : isLocked ? 'var(--bg3)' : `linear-gradient(135deg, ${currentColor}, #059669)`,
                            border: isNodeCompleted ? '1px solid #10b981' : 'none',
                            color: isNodeCompleted ? '#34d399' : isLocked ? 'var(--t4)' : '#ffffff',
                            padding: '7px 14px',
                            borderRadius: 10,
                            fontSize: 12.5,
                            fontWeight: 800,
                            cursor: isLocked ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {isNodeCompleted ? 'Completed ✓' : isLocked ? 'Locked' : 'Continue Quest ➔'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Quest & Learning Activity History Panel ── */}
      {activeSubTab !== 'language' && (
        <div className="glass-card-premium" style={{
          padding: '32px 28px',
          borderRadius: 24,
          marginTop: 40,
          marginBottom: 32,
          border: '1px solid var(--border)',
          background: 'var(--bg2)'
        }}>
          {/* Section Header & Metrics Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--t1)', margin: 0, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display)' }}>
                Quest Completion & Learning Activity History
              </h3>
              <span style={{ fontSize: 14, color: 'var(--t3)', marginTop: 4, display: 'block' }}>
                Verified record of completed syllabus lectures, passed coding exams, and earned reward milestones.
              </span>
            </div>

            {/* Metric Summary Badges */}
            {(() => {
              let totalXp = 0;
              let totalPins = 0;
              for (const qId of completedQuests) {
                const aq = getAuthoritativeQuest(qId);
                totalXp += aq?.xp ?? 150;
                totalPins += aq?.pins ?? 5;
              }
              return (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ padding: '8px 14px', borderRadius: 12, background: 'rgba(var(--success-rgb),0.1)', border: '1px solid rgba(var(--success-rgb),0.25)', fontSize: 13, fontWeight: 800, color: 'var(--success-bright)' }}>
                    ✓ {completedQuests.length} Quests Cleared
                  </div>
                  <div style={{ padding: '8px 14px', borderRadius: 12, background: 'rgba(var(--brand-rgb),0.1)', border: '1px solid rgba(var(--brand-rgb),0.25)', fontSize: 13, fontWeight: 800, color: 'var(--brand-bright)' }}>
                    +{totalXp} XP Accumulated
                  </div>
                  <div style={{ padding: '8px 14px', borderRadius: 12, background: 'rgba(var(--warning-rgb),0.1)', border: '1px solid rgba(var(--warning-rgb),0.25)', fontSize: 13, fontWeight: 800, color: 'var(--warning-bright)' }}>
                    +{totalPins} Pins Bonus
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Filter Navigation Tabs */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
            {[
              { id: 'all', label: `All Activity (${completedQuests.length + (pinsHistory?.length || 0)})` },
              { id: 'quests', label: `Quests & Exams (${completedQuests.length})` },
              { id: 'pins', label: `Pins & Rewards (${pinsHistory?.length || 0})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setHistoryFilter(tab.id as any)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: `1.5px solid ${historyFilter === tab.id ? 'var(--success)' : 'transparent'}`,
                  background: historyFilter === tab.id ? 'rgba(var(--success-rgb),0.15)' : 'var(--bg3)',
                  color: historyFilter === tab.id ? 'var(--success-bright)' : 'var(--t2)',
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Activity List */}
          {(() => {
            // Construct Quest History Items
            const questHistoryItems = completedQuests.map((qId, idx) => {
              let foundQuest: any = null;
              let foundCourseTitle = 'Career Trajectory';
              const authQuest = getAuthoritativeQuest(qId);
              
              for (const c of COURSES_REGISTRY) {
                const q = (c.quests || []).find(item => item.id === qId);
                if (q) {
                  foundQuest = q;
                  foundCourseTitle = c.title.split('(')[0].trim();
                  break;
                }
              }

              const rawTimestampTag = onboardingAnswers?.completedQuestsTimestamps?.[idx];
              let displayDate = 'Recently Cleared';
              if (rawTimestampTag) {
                try {
                  const tsStr = rawTimestampTag.split('|')[0];
                  const d = new Date(tsStr);
                  if (!isNaN(d.getTime())) {
                    displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                  }
                } catch {}
              }

              return {
                id: `history_quest_${qId}_${idx}`,
                type: 'quest',
                title: authQuest?.title || foundQuest?.title || qId.replace(/-/g, ' ').toUpperCase(),
                courseTitle: foundCourseTitle,
                desc: authQuest?.desc || foundQuest?.desc || 'Successfully cleared syllabus lecture & technical evaluation.',
                date: displayDate,
                xp: authQuest?.xp ?? foundQuest?.xp ?? 150,
                pins: authQuest?.pins ?? foundQuest?.pins ?? 5,
                questId: qId,
                icon: (authQuest?.category === 'exam' || qId.includes('exam')) ? 'TEST' : 'QUEST'
              };
            });

            // Construct Pin History Items
            const pinHistoryItems = (pinsHistory || []).map((p: any, pIdx: number) => ({
              id: `history_pin_${pIdx}`,
              type: 'pin',
              title: p.description || (p.amount > 0 ? 'Earned Bonus Pins' : 'Spent Pins'),
              courseTitle: 'PinIT Rewards',
              desc: `Transaction amount: ${p.amount > 0 ? `+${p.amount}` : p.amount} Pins`,
              date: p.date ? new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent',
              xp: 0,
              pins: p.amount,
              questId: null,
              icon: 'PINS'
            }));

            let displayItems = [];
            if (historyFilter === 'quests') displayItems = questHistoryItems;
            else if (historyFilter === 'pins') displayItems = pinHistoryItems;
            else displayItems = [...questHistoryItems, ...pinHistoryItems];

            if (displayItems.length === 0) {
              return (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  background: 'var(--bg3)',
                  borderRadius: 16,
                  border: '1px dashed var(--border)'
                }}>
                  
                  <h4 style={{ fontSize: 16.5, fontWeight: 800, color: 'var(--t1)', margin: '0 0 4px 0' }}>No Activity History Recorded Yet</h4>
                  <p style={{ fontSize: 14, color: 'var(--t3)', margin: 0 }}>
                    Complete your first quest or pass a syllabus exam above to build your permanent learning history!
                  </p>
                </div>
              );
            }

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {displayItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      padding: '16px 20px',
                      borderRadius: 16,
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 14,
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 260 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: item.type === 'quest' ? 'rgba(var(--success-rgb),0.12)' : 'rgba(var(--warning-rgb),0.12)',
                        border: `1px solid ${item.type === 'quest' ? 'rgba(var(--success-rgb),0.3)' : 'rgba(var(--warning-rgb),0.3)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24
                      }}>
                        {item.icon}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 15.5, fontWeight: 900, color: 'var(--t1)' }}>{item.title}</span>
                          <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: 'var(--success)', border: '1px solid var(--border)' }}>
                            {item.courseTitle}
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--t3)', margin: '3px 0 0 0', lineHeight: 1.4 }}>{item.desc}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'var(--t4)', fontWeight: 700 }}>{item.date}</span>
                      
                      {item.xp > 0 && (
                        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--brand-bright)', background: 'rgba(var(--brand-rgb),0.1)', padding: '4px 8px', borderRadius: 6 }}>
                          +{item.xp} XP
                        </span>
                      )}

                      {item.pins !== 0 && (
                        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--warning-bright)', background: 'rgba(var(--warning-rgb),0.1)', padding: '4px 8px', borderRadius: 6 }}>
                          {item.pins > 0 ? `+${item.pins}` : item.pins} Pins
                        </span>
                      )}

                      {item.questId && (
                        <button
                          onClick={() => {
                            const preferred = (typeof window !== 'undefined' ? localStorage.getItem('pinit_selected_teacher_id') || localStorage.getItem('pinit_preferred_teaching_avatar') : null);
                            if (preferred && ['kashyap', 'karthic', 'maya', 'divya'].includes(preferred)) {
                              router.push(`/quests/lesson?questId=${item.questId}&teacherId=${preferred}`);
                            } else {
                              router.push(`/quests/teacher-select?questId=${item.questId}`);
                            }
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 8,
                            border: '1px solid var(--border)',
                            background: 'var(--bg2)',
                            color: 'var(--t1)',
                            fontSize: 12.5,
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          Revisit Lesson ➔
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
};
