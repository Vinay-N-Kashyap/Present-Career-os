import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import CapstoneInternshipPortal from '../src/app/quests/components/CapstoneInternshipPortal';
import CareerGrowthGraph, {
  catmullRomSpline,
  computeGrowthTrajectoryData,
} from '../src/app/quests/components/CareerGrowthGraph';
import { InternshipStatusBanner } from '../src/app/quests/components/internship/InternshipStatusBanner';
import { InternshipCertificateCard } from '../src/app/quests/components/internship/InternshipCertificateCard';

describe('Block 47 — Capstone Portal, CareerGrowthGraph & Internship Status/Cert SSR Suite', () => {
  it('renders CapstoneInternshipPortal in locked state, unlocked sprint progression, and certificate issued state', () => {
    const baseEnrollment = {
      enrollmentId: 'enr-cap-01',
      userId: 'usr-1',
      planId: '12m' as const,
      planTitle: '12-Month Full Career OS',
      enrolledAt: '2026-01-01T00:00:00.000Z',
      expiresAt: '2027-01-01T00:00:00.000Z',
      currentMonth: 12,
      status: 'active' as const,
      paymentId: 'pay-1',
      amountPaidInr: 19999,
      milestoneProgress: {},
      certificatesIssued: {},
    };

    const lockedHtml = renderToStaticMarkup(
      React.createElement(CapstoneInternshipPortal, {
        enrollment: baseEnrollment,
        planTitle: '12-Month Full Career OS',
        studentName: 'Aarav Mehta',
        lessonsLeft: 4,
        onEnrollmentUpdated: () => {},
        onClose: () => {},
      })
    );

    assert.ok(lockedHtml.includes('data-testid="capstone-internship-portal"'));
    assert.ok(lockedHtml.includes('data-testid="capstone-locked-banner"'));
    assert.ok(lockedHtml.includes('data-testid="capstone-approved-counter"'));
    assert.ok(lockedHtml.includes('0/4'));

    const sprint4OpenHtml = renderToStaticMarkup(
      React.createElement(CapstoneInternshipPortal, {
        enrollment: {
          ...baseEnrollment,
          milestoneProgress: {
            sprint1Approved: true,
            sprint1RepoUrl: 'https://github.com/org/repo',
            sprint1DesignUrl: 'https://github.com/org/repo/blob/main/docs/arch.md',
            sprint2Approved: true,
            sprint2ApiUrl: 'https://github.com/org/repo/tree/main/src/api',
            sprint3RepoUrl: 'https://github.com/org/repo',
            sprint3LiveUrl: 'https://app.example.com',
          },
        },
        planTitle: '12-Month Full Career OS',
        studentName: 'Aarav Mehta',
        lessonsLeft: 0,
        onEnrollmentUpdated: () => {},
        onClose: () => {},
      })
    );

    assert.ok(!sprint4OpenHtml.includes('data-testid="capstone-locked-banner"'));
    assert.ok(sprint4OpenHtml.includes('3/4'));
    assert.ok(sprint4OpenHtml.includes('data-testid="capstone-sprint-card-1"'));
    assert.ok(sprint4OpenHtml.includes('data-testid="capstone-sprint-card-2"'));
    assert.ok(sprint4OpenHtml.includes('data-testid="capstone-sprint-card-3"'));
    assert.ok(sprint4OpenHtml.includes('data-testid="capstone-sprint-card-4"'));
    assert.ok(sprint4OpenHtml.includes('data-testid="btn-start-capstone-defense"'));

    const issuedHtml = renderToStaticMarkup(
      React.createElement(CapstoneInternshipPortal, {
        enrollment: {
          ...baseEnrollment,
          milestoneProgress: {
            sprint1Approved: true,
            sprint1RepoUrl: 'https://github.com/org/repo',
            sprint1DesignUrl: 'https://github.com/org/repo/blob/main/docs/arch.md',
            sprint2Approved: true,
            sprint2ApiUrl: 'https://github.com/org/repo/tree/main/src/api',
            sprint3RepoUrl: 'https://github.com/org/repo',
            sprint3LiveUrl: 'https://app.example.com',
            sprint4DefenseScore: 88,
            sprint4Verdict: 'Strong Hire',
          },
          certificatesIssued: {
            projectCertHash: 'PINIT-CAP-2026-9988',
          },
        },
        planTitle: '12-Month Full Career OS',
        studentName: 'Aarav Mehta',
        lessonsLeft: 0,
        onEnrollmentUpdated: () => {},
        onClose: () => {},
      })
    );

    assert.ok(issuedHtml.includes('4/4'));
    assert.ok(issuedHtml.includes('data-testid="capstone-certificate-issued"'));
    assert.ok(issuedHtml.includes('data-testid="capstone-certificate-id"'));
    assert.ok(issuedHtml.includes('PINIT-CAP-2026-9988'));
  });

  it('computes deterministic growth trajectory data and renders CareerGrowthGraph safely across edge cases', () => {
    const traj6 = computeGrowthTrajectoryData(6);
    assert.equal(traj6.months, 6);
    assert.equal(traj6.baseline.length, 6);
    assert.equal(traj6.current.length, 6);
    assert.equal(traj6.target.length, 6);
    assert.ok(traj6.hireabilityIndex >= 0 && traj6.hireabilityIndex <= 100);
    assert.ok(traj6.speedFactor >= 0);
    assert.ok(traj6.codeQuality >= 0 && traj6.codeQuality <= 100);

    const customTraj = computeGrowthTrajectoryData(3, [55, 72, 88]);
    assert.deepEqual(customTraj.current, [55, 72, 88]);
    assert.equal(customTraj.hireabilityIndex, 88);

    const spline = catmullRomSpline([
      { x: 0, y: 100 },
      { x: 50, y: 80 },
      { x: 100, y: 40 },
    ]);
    assert.ok(spline.startsWith('L0.0,100.0'));
    assert.ok(spline.includes('L'));

    const graphHtml = renderToStaticMarkup(
      React.createElement(CareerGrowthGraph, {
        monthsCount: 0, // Edge case: 0 months should clamp to 1 safely
      })
    );
    assert.ok(graphHtml.includes('data-testid="career-growth-graph"'));
    assert.ok(graphHtml.includes('data-testid="growth-months-badge"'));
    assert.ok(graphHtml.includes('data-testid="growth-metric-hireability"'));
    assert.ok(graphHtml.includes('data-testid="growth-svg-chart"'));
    assert.ok(graphHtml.includes('data-testid="growth-summary-badge"'));
  });

  it('renders InternshipStatusBanner across all 7 lifecycle states', () => {
    const loadingHtml = renderToStaticMarkup(
      React.createElement(InternshipStatusBanner, { state: 'loading' })
    );
    assert.ok(loadingHtml.includes('data-testid="internship-status-loading"'));

    const lockedHtml = renderToStaticMarkup(
      React.createElement(InternshipStatusBanner, {
        state: 'not_eligible',
        notEligibleReason: 'Complete Month 1 Checkpoint first.',
      })
    );
    assert.ok(lockedHtml.includes('data-testid="internship-status-not-eligible"'));
    assert.ok(lockedHtml.includes('Complete Month 1 Checkpoint first.'));

    const generatingHtml = renderToStaticMarkup(
      React.createElement(InternshipStatusBanner, { state: 'generating' })
    );
    assert.ok(generatingHtml.includes('data-testid="internship-status-generating"'));

    const failedHtml = renderToStaticMarkup(
      React.createElement(InternshipStatusBanner, { state: 'generation_failed' })
    );
    assert.ok(failedHtml.includes('data-testid="internship-status-failed"'));
    assert.ok(failedHtml.includes('data-testid="btn-retry-generation"'));

    const readyHtml = renderToStaticMarkup(
      React.createElement(InternshipStatusBanner, {
        state: 'ready_to_start',
        track: 'web_fullstack',
        startError: 'Transient network error',
      })
    );
    assert.ok(readyHtml.includes('data-testid="internship-status-ready"'));
    assert.ok(readyHtml.includes('data-testid="internship-start-error"'));
    assert.ok(readyHtml.includes('data-testid="btn-start-simulation"'));

    const expiredCanRestartHtml = renderToStaticMarkup(
      React.createElement(InternshipStatusBanner, {
        state: 'expired',
        restarts: 0,
      })
    );
    assert.ok(expiredCanRestartHtml.includes('data-testid="internship-status-expired"'));
    assert.ok(expiredCanRestartHtml.includes('data-testid="btn-restart-simulation"'));

    const expiredMaxRestartsHtml = renderToStaticMarkup(
      React.createElement(InternshipStatusBanner, {
        state: 'expired',
        restarts: 1,
      })
    );
    assert.ok(expiredMaxRestartsHtml.includes('data-testid="internship-max-restarts-msg"'));

    const completedHtml = renderToStaticMarkup(
      React.createElement(InternshipStatusBanner, {
        state: 'completed',
        certificateId: 'INT-CERT-001',
        hasFinalReport: true,
        onOpenReport: () => {},
      })
    );
    assert.ok(completedHtml.includes('data-testid="internship-status-completed"'));
    assert.ok(completedHtml.includes('data-testid="btn-view-internship-cert"'));
    assert.ok(completedHtml.includes('data-testid="btn-review-standup-report"'));
  });

  it('renders InternshipCertificateCard modal with verifiable QR and metadata', () => {
    const certHtml = renderToStaticMarkup(
      React.createElement(InternshipCertificateCard, {
        certificateId: 'PINIT-INT-2026-ABCD',
        studentName: 'Aarav Mehta',
        planTitle: 'Full-Stack Web Job Simulation',
        companyName: 'FinPulse Labs',
        completedAt: '2026-10-12T10:00:00.000Z',
        onClose: () => {},
      })
    );

    assert.ok(certHtml.includes('data-testid="internship-certificate-modal"'));
    assert.ok(certHtml.includes('role="dialog"'));
    assert.ok(certHtml.includes('aria-modal="true"'));
    assert.ok(certHtml.includes('data-testid="internship-cert-student"'));
    assert.ok(certHtml.includes('Aarav Mehta'));
    assert.ok(certHtml.includes('FinPulse Labs'));
    assert.ok(certHtml.includes('data-testid="internship-cert-id"'));
    assert.ok(certHtml.includes('PINIT-INT-2026-ABCD'));
    assert.ok(certHtml.includes('data-testid="internship-cert-verify-link"'));
    assert.ok(certHtml.includes('/verify/PINIT-INT-2026-ABCD'));
    assert.ok(certHtml.includes('<svg'));
  });
});
