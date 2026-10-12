import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  CareerGateModal,
  MasterJourneyModal,
  QrModal,
  CustomRoadmapModal,
} from '../src/app/quests/components/QuestDetailModal';
import { CrashCoursePlanCards } from '../src/app/quests/components/CrashCoursePlanCards';
import EnhancedCrashCoursePlanCard from '../src/app/quests/components/EnhancedCrashCoursePlanCard';
import CredentialPreviewModal from '../src/app/quests/components/CredentialPreviewModal';
import CrashCourseCheckoutModal, {
  calculateCheckoutPricing,
  formatINR,
} from '../src/app/quests/components/CrashCourseCheckoutModal';
import { CRASH_COURSE_PLANS } from '../src/lib/data/crashPlansData';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { CANONICAL_TRAJECTORIES } from '../src/lib/data/careerTrajectories';

describe('Quest Detail Modals & Crash Course Plan Cards SSR Parity', () => {
  it('renders CareerGateModal in both pending and cleared readiness states without requiring CareerOSProvider', () => {
    const sampleCourse = COURSES_REGISTRY[0];
    const allQuestIds = (sampleCourse.quests || []).map((q) => q.id);
    const sampleNode = {
      nodeId: 'node-1',
      title: 'Frontend Foundations',
      courseId: sampleCourse.id,
      phase: 'Phase 1',
      duration: '4 Weeks',
      description: 'Core web architecture',
      gate: {
        minCourseCompletionPct: 100,
        minCommunicationScore: 70,
        minAtsScore: 80,
        requireProjectVerification: true,
      },
    };

    const pendingHtml = renderToStaticMarkup(
      React.createElement(CareerGateModal, {
        node: sampleNode as any,
        onClose: () => {},
        completedQuests: allQuestIds.slice(0, 1),
        COURSES_REGISTRY,
        commScore: 55,
        atsScore: 60,
        isProjectVerified: false,
      })
    );

    assert.ok(pendingHtml.includes('data-testid="career-gate-modal"'));
    assert.ok(pendingHtml.includes('data-testid="career-gate-status"'));
    assert.ok(pendingHtml.includes('Career Gate Audit Checkpoint'));
    assert.ok(pendingHtml.includes('data-testid="gate-check-tech"'));
    assert.ok(pendingHtml.includes('data-testid="gate-check-comm"'));
    assert.ok(pendingHtml.includes('data-testid="gate-check-ats"'));
    assert.ok(pendingHtml.includes('data-testid="gate-check-capstone"'));
    assert.ok(pendingHtml.includes('Close Readiness Audit'));

    const clearedHtml = renderToStaticMarkup(
      React.createElement(CareerGateModal, {
        node: sampleNode as any,
        onClose: () => {},
        completedQuests: allQuestIds,
        COURSES_REGISTRY,
        commScore: 88,
        atsScore: 92,
        isProjectVerified: true,
      })
    );

    assert.ok(clearedHtml.includes('Career Gate Cleared'));
    assert.ok(clearedHtml.includes('Continue Journey'));
  });

  it('renders MasterJourneyModal, QrModal, and CustomRoadmapModal with deterministic testids', () => {
    const trajectory = Object.values(CANONICAL_TRAJECTORIES)[0];
    const journeyHtml = renderToStaticMarkup(
      React.createElement(MasterJourneyModal, {
        isOpen: true,
        onClose: () => {},
        trajectory,
        COURSES_REGISTRY,
        completedQuests: [],
        onSelectQuest: () => {},
      })
    );

    assert.ok(journeyHtml.includes('data-testid="master-journey-modal"'));
    assert.ok(journeyHtml.includes('data-testid="btn-close-master-journey"'));
    assert.ok(journeyHtml.includes(`data-testid="journey-node-${trajectory.nodes[0].nodeId}"`));

    const qrHtml = renderToStaticMarkup(
      React.createElement(QrModal, {
        isOpen: true,
        onClose: () => {},
        userId: 'usr-verify-99',
        copiedLink: false,
        onCopyLink: () => {},
      })
    );

    assert.ok(qrHtml.includes('data-testid="qr-modal"'));
    assert.ok(qrHtml.includes('data-testid="qr-verify-url"'));
    assert.ok(qrHtml.includes('/verify/usr-verify-99'));
    assert.ok(qrHtml.includes('data-testid="btn-copy-verify-url"'));
    assert.ok(qrHtml.includes('data-testid="btn-close-qr-modal"'));

    const customHtml = renderToStaticMarkup(
      React.createElement(CustomRoadmapModal, {
        isOpen: true,
        onClose: () => {},
        isGenerating: false,
        generationStep: 0,
        selectedDuration: 90,
        setSelectedDuration: () => {},
        selectedPace: 2,
        setSelectedPace: () => {},
        selectedTrack: 'web_fullstack',
        setSelectedTrack: () => {},
        customGoal: 'Full-Stack AI Engineer',
        setCustomGoal: () => {},
        extraRoadmaps: [],
        qt1: 82,
        archetype: 'Builder',
        activeCourseTitle: 'React Mastery',
        onSubmit: () => {},
        trajectory,
        COURSES_REGISTRY,
      })
    );

    assert.ok(customHtml.includes('data-testid="custom-roadmap-modal"'));
    assert.ok(customHtml.includes('data-testid="input-custom-goal"'));
    assert.ok(customHtml.includes('data-testid="slider-roadmap-duration"'));
    assert.ok(customHtml.includes('data-testid="btn-generate-roadmap"'));
  });

  it('renders CrashCoursePlanCards, EnhancedCrashCoursePlanCard, and CredentialPreviewModal cleanly in SSR', () => {
    const plan = CRASH_COURSE_PLANS[0];
    const singleCardHtml = renderToStaticMarkup(
      React.createElement(EnhancedCrashCoursePlanCard, {
        plan,
        activeTrack: 'web_fullstack',
        isSelected: false,
        onSelectPlan: () => {},
        onPreviewCredentials: () => {},
        onOpenDiagnosticReport: () => {},
        userPins: 500,
      })
    );

    assert.ok(singleCardHtml.includes(`data-testid="crash-plan-card-${plan.id}"`));
    assert.ok(singleCardHtml.includes('data-testid="plan-tab-curriculum"'));
    assert.ok(singleCardHtml.includes('data-testid="plan-tab-capstone"'));
    assert.ok(singleCardHtml.includes('data-testid="plan-tab-credentials"'));
    assert.ok(singleCardHtml.includes(`data-testid="btn-select-plan-${plan.id}"`));

    const gridHtml = renderToStaticMarkup(
      React.createElement(CrashCoursePlanCards, {
        currentPlanId: plan.id,
        onSelectPlan: () => {},
        onOpenStandaloneCatalog: () => {},
      })
    );

    assert.ok(gridHtml.includes('data-testid="crash-plan-cards-root"'));
    assert.ok(gridHtml.includes('data-testid="btn-track-web"'));
    assert.ok(gridHtml.includes('data-testid="btn-track-python"'));
    assert.ok(gridHtml.includes('data-testid="btn-open-36-courses"'));

    const previewHtml = renderToStaticMarkup(
      React.createElement(CredentialPreviewModal, {
        isOpen: true,
        onClose: () => {},
        planTitle: plan.title,
        trackTitle: 'Full-Stack Web Development',
        onProceedToEnroll: () => {},
      })
    );

    assert.ok(previewHtml.includes('data-testid="credential-preview-modal"'));
    assert.ok(previewHtml.includes('data-testid="credential-project-card"'));
    assert.ok(previewHtml.includes('data-testid="btn-close-credential-preview"'));
    assert.ok(previewHtml.includes('data-testid="btn-enroll-from-preview"'));
  });

  it('calculates checkout pricing accurately with and without PINIT2026 scholarship and renders CrashCourseCheckoutModal', () => {
    const plan = CRASH_COURSE_PLANS[0];
    const withoutPromo = calculateCheckoutPricing(2999, false);
    assert.equal(withoutPromo.baseTuition, 2999);
    assert.equal(withoutPromo.discount, 0);
    assert.equal(withoutPromo.discountedSubtotal, 2999);
    assert.equal(withoutPromo.gstAmount, Math.round(2999 * 0.18));
    assert.equal(withoutPromo.finalPayable, 2999 + Math.round(2999 * 0.18));

    const withPromo = calculateCheckoutPricing(2999, true);
    assert.equal(withPromo.discount, 1000);
    assert.equal(withPromo.discountedSubtotal, 1999);
    assert.equal(withPromo.gstAmount, Math.round(1999 * 0.18));
    assert.equal(withPromo.finalPayable, 1999 + Math.round(1999 * 0.18));
    assert.ok(formatINR(withPromo.finalPayable).includes('2,359'));

    const checkoutHtml = renderToStaticMarkup(
      React.createElement(CrashCourseCheckoutModal, {
        isOpen: true,
        onClose: () => {},
        plan,
        activeTrack: 'python_ai',
        onSuccessEnrollment: () => {},
        studentName: 'Aarav Sharma',
        userPins: 1200,
      })
    );

    assert.ok(checkoutHtml.includes('data-testid="crash-checkout-modal"'));
    assert.ok(checkoutHtml.includes('data-testid="checkout-base-tuition"'));
    assert.ok(checkoutHtml.includes('data-testid="checkout-gst-amount"'));
    assert.ok(checkoutHtml.includes('data-testid="checkout-final-payable"'));
    assert.ok(checkoutHtml.includes('data-testid="input-promo-code"'));
    assert.ok(checkoutHtml.includes('data-testid="btn-apply-promo"'));
    assert.ok(checkoutHtml.includes('data-testid="btn-payment-method-razorpay"'));
    assert.ok(checkoutHtml.includes('data-testid="btn-payment-method-pins"'));
    assert.ok(checkoutHtml.includes('data-testid="btn-payment-method-sandbox"'));
    assert.ok(checkoutHtml.includes('data-testid="btn-submit-checkout"'));
  });
});
