import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { InternshipPanel } from '../src/app/quests/components/internship/InternshipPanel';
import { resolveInternshipState } from '../src/app/quests/components/internship/useInternshipData';
import type { CrashCourseEnrollment } from '../src/lib/services/crashCourseEnrollmentService';
import type {
  ClientInternshipEnrollment,
  ClientInternshipTask,
  ClientInternshipTeam,
  ClientInternshipTeamMember,
  ClientInternshipSprint,
} from '../src/lib/internships/types';
import type { ProductBrief } from '../src/lib/internships/productBrief';

describe('Block 51 — InternshipPanel Orchestration & State Resolution SSR Suite', () => {
  const sampleCrashEnrollmentPython: CrashCourseEnrollment = {
    enrollmentId: 'enroll-py-1',
    planId: 'plan-python-mastery',
    planTitle: 'Python & AI Engineer Job Simulation Track',
    track: 'python_ai',
    startedAt: '2026-09-01T00:00:00.000Z',
    status: 'active',
    completedAt: null,
    certificatesIssued: {
      completionCertHash: 'hash-comp',
      projectCertHash: 'hash-proj',
      internshipCertHash: null,
    },
    milestoneProgress: {
      sprint1Approved: true,
      sprint2Approved: true,
      sprint3RepoUrl: 'https://github.com/finpulse/repo',
      sprint4DefenseScore: 90,
    },
    progress: {
      completedLessonIds: [],
      completedCheckpointDays: [],
      currentMonth: 4,
      capstoneSprints: [
        { sprintNumber: 1, status: 'approved', submittedAt: '2026-10-01', reviewNotes: 'Done' },
        { sprintNumber: 2, status: 'approved', submittedAt: '2026-10-05', reviewNotes: 'Done' },
        { sprintNumber: 3, status: 'approved', submittedAt: '2026-10-08', reviewNotes: 'Done' },
        { sprintNumber: 4, status: 'approved', submittedAt: '2026-10-10', reviewNotes: 'Done' },
      ],
      examScore: 92,
      certificateIssued: true,
      lastActiveAt: '2026-10-12T00:00:00.000Z',
    },
  };

  const sampleIncompleteCrashEnrollment: CrashCourseEnrollment = {
    ...sampleCrashEnrollmentPython,
    certificatesIssued: null,
    milestoneProgress: {
      sprint1Approved: true,
      sprint2Approved: false,
      sprint3RepoUrl: null,
      sprint4DefenseScore: null,
    },
    progress: {
      ...sampleCrashEnrollmentPython.progress,
      capstoneSprints: [
        { sprintNumber: 1, status: 'approved', submittedAt: '2026-10-01', reviewNotes: 'Done' },
        { sprintNumber: 2, status: 'pending', submittedAt: '2026-10-05', reviewNotes: null },
      ],
    },
  };

  const sampleIneligibleTrackEnrollment: CrashCourseEnrollment = {
    ...sampleCrashEnrollmentPython,
    track: 'data_science_ai' as any,
  };

  const sampleTier1Enrollment: ClientInternshipEnrollment = {
    id: 'sim-t1-enroll',
    studentId: 'student-42',
    tier: 't1_job_sim',
    track: 'python_ai',
    status: 'active',
    dueAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    restarts: 0,
    companyProfile: {
      name: 'FinPulse Systems',
      industry: 'Quantitative Finance & Algorithmic Trading',
      readmeMarkdown: '# Welcome to FinPulse Quantitative Trading Desk',
    },
    finalReport: null,
    certificateId: null,
    completedAt: null,
  };

  const sampleTier2Enrollment: ClientInternshipEnrollment = {
    ...sampleTier1Enrollment,
    id: 'sim-t2-enroll',
    tier: 't2_virtual_team',
  };

  const sampleTasks: ClientInternshipTask[] = [
    {
      id: 'task-1',
      companyId: 'finpulse',
      title: 'Fix High-Frequency Order Quantizer Float Precision',
      brief: 'Ensure trade rounding matches IEEE 754-2008 without drift.',
      starterCode: 'def quantize(): pass',
      visibleTests: 'assert True',
      language: 'python',
      status: 'passed',
      seq: 1,
      attempts: 1,
      maxAttempts: 10,
      passedAt: '2026-10-12T00:00:00.000Z',
    },
    {
      id: 'task-2',
      companyId: 'finpulse',
      title: 'Optimize Postgres Order Ledger Indexing',
      brief: 'Add composite indexes for execution timestamp and status.',
      starterCode: 'SELECT 1;',
      visibleTests: 'SELECT 1;',
      language: 'sql',
      status: 'open',
      seq: 2,
      attempts: 0,
      maxAttempts: 10,
      passedAt: null,
    },
  ];

  const sampleBrief: ProductBrief = {
    productName: 'Apollo Quantitative Streamer',
    summary: 'Low-latency financial market data bus.',
    architecture: 'Distributed microservices with Kafka and FastAPI.',
    stories: [
      { id: 'STORY-01', title: 'Order Book Depth Engine', acceptance: ['Supports L2 market depth'] },
    ],
    dataModel: [
      { table: 'market_ticks', columns: ['symbol varchar(16)', 'price numeric', 'ts timestamptz'] },
    ],
  };

  const sampleTeam: ClientInternshipTeam = {
    id: 'squad-42',
    name: 'Apollo Quantitative Pod',
    repoUrl: 'https://github.com/finpulse/apollo-pod',
    projectBrief: sampleBrief,
  };

  const sampleMembers: ClientInternshipTeamMember[] = [
    { studentId: 'student-42', role: 'lead', joinedAt: '2026-10-01T00:00:00.000Z' },
    { studentId: 'student-99', role: 'member', joinedAt: '2026-10-01T00:00:00.000Z' },
  ];

  const sampleSprints: ClientInternshipSprint[] = [
    {
      sprintNumber: 1,
      week: 1,
      goal: 'Core high-throughput ingress gateway & telemetry pipeline',
      status: 'in_progress',
      prLink: null,
      standupDone: 'Implemented fast serializer',
      standupNext: 'Attach Kafka consumer topic',
      standupBlockers: 'None',
      submittedAt: null,
      reviewedAt: null,
      reviewNotes: null,
    },
  ];

  it('evaluates resolveInternshipState across loading, track eligibility, capstone readiness, and active statuses', () => {
    // 1. Loading
    const loadRes = resolveInternshipState(true, null, sampleCrashEnrollmentPython);
    assert.equal(loadRes.state, 'loading');
    assert.equal(loadRes.reason, '');

    // 2. Ineligible track
    const trackRes = resolveInternshipState(false, null, sampleIneligibleTrackEnrollment);
    assert.equal(trackRes.state, 'not_eligible');
    assert.ok(trackRes.reason.includes('exclusive to the Python & AI Engineering and Full-Stack Web tracks'));

    // 3. Capstone incomplete
    const capstoneRes = resolveInternshipState(false, null, sampleIncompleteCrashEnrollment);
    assert.equal(capstoneRes.state, 'not_eligible');
    assert.ok(capstoneRes.reason.includes('Capstone Project Desk must be completed'));

    // 4. Ready to start
    const readyRes = resolveInternshipState(false, null, sampleCrashEnrollmentPython);
    assert.equal(readyRes.state, 'ready_to_start');
    assert.equal(readyRes.reason, '');

    // 5. Active enrollment
    const activeRes = resolveInternshipState(false, sampleTier1Enrollment, sampleCrashEnrollmentPython);
    assert.equal(activeRes.state, 'active');
  });

  it('renders InternshipPanel SSR modal attributes, title, engineer info, and close button', () => {
    const markup = renderToStaticMarkup(
      React.createElement(InternshipPanel, {
        crashEnrollment: sampleCrashEnrollmentPython,
        planTitle: 'Python & AI Engineer Simulation',
        studentName: 'Alex Mercer',
        onClose: () => {},
        initialData: {
          loading: false,
          enrollment: null,
        },
      })
    );

    assert.ok(markup.includes('data-testid="internship-panel-modal"'));
    assert.ok(markup.includes('role="dialog"'));
    assert.ok(markup.includes('aria-modal="true"'));
    assert.ok(markup.includes('data-testid="internship-panel-title"'));
    assert.ok(markup.includes('Python &amp; AI Engineer Simulation · Virtual Simulation Desk'));
    assert.ok(markup.includes('data-testid="internship-engineer-info"'));
    assert.ok(markup.includes('Alex Mercer'));
    assert.ok(markup.includes('data-testid="btn-close-internship-panel"'));
  });

  it('renders InternshipPanel SSR loading and not-eligible states', () => {
    // Loading state
    const loadingMarkup = renderToStaticMarkup(
      React.createElement(InternshipPanel, {
        crashEnrollment: sampleCrashEnrollmentPython,
        onClose: () => {},
        initialData: {
          loading: true,
          enrollment: null,
        },
      })
    );
    assert.ok(loadingMarkup.includes('data-testid="internship-status-loading"'));
    assert.ok(loadingMarkup.includes('Loading your internship program status...'));

    // Not-eligible state (incomplete capstone)
    const notEligibleMarkup = renderToStaticMarkup(
      React.createElement(InternshipPanel, {
        crashEnrollment: sampleIncompleteCrashEnrollment,
        onClose: () => {},
        initialData: {
          loading: false,
          enrollment: null,
        },
      })
    );
    assert.ok(notEligibleMarkup.includes('data-testid="internship-status-not-eligible"'));
    assert.ok(notEligibleMarkup.includes('Internship Access Locked'));
    assert.ok(notEligibleMarkup.includes('Capstone Project Desk must be completed and approved'));
  });

  it('renders InternshipPanel SSR active Tier 1 desk with tickets and deadline', () => {
    const markup = renderToStaticMarkup(
      React.createElement(InternshipPanel, {
        crashEnrollment: sampleCrashEnrollmentPython,
        studentName: 'Alex Mercer',
        onClose: () => {},
        initialData: {
          loading: false,
          enrollment: sampleTier1Enrollment,
          tasks: sampleTasks,
        },
      })
    );

    assert.ok(markup.includes('data-testid="tier1-desk-root"'));
    assert.ok(markup.includes('data-testid="company-profile-card"'));
    assert.ok(markup.includes('FinPulse Systems'));
    assert.ok(markup.includes('data-testid="internship-deadline-banner"'));
    assert.ok(markup.includes('data-testid="ticket-list-card"'));
    assert.ok(markup.includes('data-testid="ticket-card-1"'));
    assert.ok(markup.includes('Fix High-Frequency Order Quantizer Float Precision'));
    assert.ok(markup.includes('data-testid="ticket-card-2"'));
    assert.ok(markup.includes('Optimize Postgres Order Ledger Indexing'));
  });

  it('renders InternshipPanel SSR active Tier 2 squad desk with team, backlog and sprint board', () => {
    const markup = renderToStaticMarkup(
      React.createElement(InternshipPanel, {
        crashEnrollment: sampleCrashEnrollmentPython,
        studentName: 'Alex Mercer',
        onClose: () => {},
        initialData: {
          loading: false,
          enrollment: sampleTier2Enrollment,
          tasks: sampleTasks,
          team: sampleTeam,
          members: sampleMembers,
          sprints: sampleSprints,
          isSolo: false,
        },
      })
    );

    assert.ok(markup.includes('data-testid="tier2-desk-root"'));
    assert.ok(markup.includes('data-testid="team-card"'));
    assert.ok(markup.includes('finpulse/apollo-pod'));
    assert.ok(markup.includes('data-testid="backlog-card"'));
    assert.ok(markup.includes('Apollo Quantitative Streamer'));
    assert.ok(markup.includes('data-testid="sprint-board-card"'));
    assert.ok(markup.includes('data-testid="tier2-demo-card"'));
  });
});
