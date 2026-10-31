'use client';

import React, { useState } from 'react';
import { CRASH_COURSE_PLANS, CrashPlan, INTERNSHIP_AVAILABLE } from '@/lib/data/crashPlansData';
import { toast } from '@/lib/store/useAppStore';
import EnhancedCrashCoursePlanCard from './EnhancedCrashCoursePlanCard';
import CredentialPreviewModal from './CredentialPreviewModal';

interface CrashCoursePlanCardsProps {
  currentPlanId?: string;
  onSelectPlan: (planId: string, track: 'web_fullstack' | 'python_ai', courseIdToActivate: string) => void;
  onOpenStandaloneCatalog: () => void;
  onOpenPracticeReport?: (testTitle: string) => void;
  onOpenCheckout?: (plan: CrashPlan, track: 'web_fullstack' | 'python_ai') => void;
  userPins?: number;
}

export const CrashCoursePlanCards: React.FC<CrashCoursePlanCardsProps> = ({
  currentPlanId,
  onSelectPlan,
  onOpenStandaloneCatalog,
  onOpenPracticeReport,
  onOpenCheckout,
  userPins = 100,
}) => {
  const [activeTrack, setActiveTrack] = useState<'web_fullstack' | 'python_ai'>('web_fullstack');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewPlan, setPreviewPlan] = useState<CrashPlan | null>(null);

  const handleEnroll = (plan: CrashPlan) => {
    const modules = plan.modulesByTrack[activeTrack] || [];
    const firstCourseId = modules[0]?.courseId || (activeTrack === 'web_fullstack' ? 'course-react-web' : 'course-python');

    onSelectPlan(plan.id, activeTrack, firstCourseId);
    if (onOpenCheckout) {
      onOpenCheckout(plan, activeTrack);
    } else {
      toast.success(
        'Plan Selected!',
        `Enrolled in ${plan.title} (${activeTrack === 'web_fullstack' ? 'Full-Stack Web' : 'Python & AI'}). All roadmap nodes and internship timeline unlocked!`
      );
    }
  };

  return (
    <div data-testid="crash-plan-cards-root" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Top Header & Domain Switcher ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          padding: '18px 22px',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ maxWidth: 620 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>⚡</span>
            <h3
              style={{
                fontSize: 19,
                fontWeight: 900,
                color: 'var(--t1)',
                margin: 0,
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.3px',
              }}
            >
              {INTERNSHIP_AVAILABLE
                ? 'Industry Crash Certification & Real-Time Internship Programs'
                : 'Industry Crash Certification Programs'}
            </h3>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--t3)', margin: '4px 0 0 0', lineHeight: 1.5 }}>
            {INTERNSHIP_AVAILABLE
              ? 'Daily 1-Hour micro-learning, production capstone sprint, PinIT Tech Labs fellowship, and dual tamper-proof credentials.'
              : 'Daily 1-Hour micro-learning, production capstone sprint, and a cryptographically verified certificate.'}
          </p>
        </div>

        {/* Track Selector Controls */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: 4,
            borderRadius: 12,
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            gap: 4,
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            data-testid="btn-track-web"
            onClick={() => setActiveTrack('web_fullstack')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              border: `1px solid ${activeTrack === 'web_fullstack' ? 'var(--accent)' : 'transparent'}`,
              background: activeTrack === 'web_fullstack' ? 'var(--accent-light)' : 'transparent',
              color: activeTrack === 'web_fullstack' ? 'var(--accent)' : 'var(--t2)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>🌐</span> Full-Stack Web Development
          </button>

          <button
            type="button"
            data-testid="btn-track-python"
            onClick={() => setActiveTrack('python_ai')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              border: `1px solid ${activeTrack === 'python_ai' ? 'var(--green)' : 'transparent'}`,
              background: activeTrack === 'python_ai' ? 'var(--green-light)' : 'transparent',
              color: activeTrack === 'python_ai' ? 'var(--green)' : 'var(--t2)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>🐍</span> Python & Data Engineering
          </button>

          <button
            type="button"
            data-testid="btn-open-36-courses"
            onClick={onOpenStandaloneCatalog}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid var(--border)',
              background: 'var(--bg2)',
              color: 'var(--t3)',
              transition: 'all 0.15s ease',
            }}
            title="Browse all standalone courses"
          >
            <span>📦</span> Standalone Courses Library →
          </button>
        </div>
      </div>

      {/* ── Crash Course Plan Cards Grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 18,
          alignItems: 'stretch',
        }}
      >
        {CRASH_COURSE_PLANS.map((plan) => {
          const isEnrolled = Boolean(currentPlanId && currentPlanId === plan.id);
          return (
            <EnhancedCrashCoursePlanCard
              key={plan.id}
              plan={plan}
              activeTrack={activeTrack}
              isSelected={isEnrolled}
              onSelectPlan={handleEnroll}
              onPreviewCredentials={(p) => {
                setPreviewPlan(p);
                setPreviewModalOpen(true);
              }}
              onOpenDiagnosticReport={onOpenPracticeReport}
              userPins={userPins}
            />
          );
        })}
      </div>

      {/* ── Dual Credential Preview Modal ── */}
      <CredentialPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        planTitle={previewPlan?.title}
        trackTitle={
          previewPlan?.flagshipBuildByTrack?.[activeTrack]?.title ||
          (activeTrack === 'web_fullstack' ? 'Full-Stack Software Architecture' : 'Python & AI Engineering')
        }
        onProceedToEnroll={() => {
          if (previewPlan) {
            setPreviewModalOpen(false);
            handleEnroll(previewPlan);
          }
        }}
      />
    </div>
  );
};
