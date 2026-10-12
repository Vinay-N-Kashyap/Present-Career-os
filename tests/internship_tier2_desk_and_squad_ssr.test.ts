import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { TeamCard } from '../src/app/quests/components/internship/TeamCard';
import { BacklogCard } from '../src/app/quests/components/internship/BacklogCard';
import { SprintBoardCard } from '../src/app/quests/components/internship/SprintBoardCard';
import { StandupModal } from '../src/app/quests/components/internship/StandupModal';
import { Tier2Desk } from '../src/app/quests/components/internship/Tier2Desk';
import type {
  ClientInternshipTeam,
  ClientInternshipTeamMember,
  ClientInternshipSprint,
  ClientInternshipTask,
  ClientInternshipEnrollment,
} from '../src/lib/internships/types';
import type { ProductBrief } from '../src/lib/internships/productBrief';

describe('Block 49 — Internship Tier2Desk, Squad TeamCard, BacklogCard, SprintBoardCard & StandupModal SSR Suite', () => {
  const sampleTeam: ClientInternshipTeam = {
    id: 'team-squad-1',
    name: 'Core Engine Squad',
    repoUrl: 'https://github.com/finpulse/core-engine',
    projectBrief: null,
  };

  const sampleMembers: ClientInternshipTeamMember[] = [
    { studentId: 'stu-1', role: 'lead', joinedAt: '2026-10-01T00:00:00.000Z' },
    { studentId: 'stu-2', role: 'member', joinedAt: '2026-10-01T00:00:00.000Z' },
    { studentId: 'stu-3', role: 'member', joinedAt: '2026-10-01T00:00:00.000Z' },
  ];

  const sampleBrief: ProductBrief = {
    productName: 'HealthSync Telehealth Platform',
    summary: 'HIPAA-compliant asynchronous patient intake and clinical triage ledger.',
    architecture: 'Microservices with Next.js frontend and Python FastAPI backend.',
    stories: [
      {
        id: 'US-01',
        title: 'Patient Intake Validation',
        acceptance: ['Validates national health identifier', 'Rejects expired coverage'],
      },
      {
        id: 'US-02',
        title: 'Triage Conflict Resolver',
        acceptance: ['Locks concurrent doctor appointments', 'Emits audit trail event'],
      },
    ],
    dataModel: [
      {
        table: 'patients',
        columns: ['id uuid PRIMARY KEY', 'identifier varchar(32)', 'created_at timestamptz'],
      },
      {
        table: 'appointments',
        columns: ['id uuid PRIMARY KEY', 'patient_id uuid', 'slot_time timestamptz'],
      },
    ],
  };

  const sampleSprints: ClientInternshipSprint[] = [
    {
      id: 'sp-1',
      number: 1,
      goal: 'Database schema migrations & intake verification endpoint',
      status: 'approved',
      prUrl: 'https://github.com/finpulse/core-engine/pull/1',
      submittedAt: '2026-10-03T00:00:00.000Z',
    },
    {
      id: 'sp-2',
      number: 2,
      goal: 'Asynchronous task queue & email reminder service',
      status: 'active',
      prUrl: null,
      submittedAt: null,
    },
    {
      id: 'sp-3',
      number: 3,
      goal: 'Audit trail ledger and concurrency locks',
      status: 'active',
      prUrl: null,
      submittedAt: null,
    },
    {
      id: 'sp-4',
      number: 4,
      goal: 'Production deployment to Cloud Run & end-to-end tests',
      status: 'active',
      prUrl: null,
      submittedAt: null,
    },
  ];

  it('renders TeamCard in both solo and squad modes with deterministic testids', () => {
    const soloHtml = renderToStaticMarkup(
      React.createElement(TeamCard, {
        team: null,
        members: [{ studentId: 'stu-solo', role: 'lead', joinedAt: '2026-10-01T00:00:00.000Z' }],
        isSolo: true,
        onUpdateRepo: async () => true,
      })
    );
    assert.ok(soloHtml.includes('data-testid="team-card"'));
    assert.ok(soloHtml.includes('data-testid="team-mode-badge"'));
    assert.ok(soloHtml.includes('Solo Mode'));
    assert.ok(soloHtml.includes('data-testid="team-repo-row"'));
    assert.ok(soloHtml.includes('data-testid="btn-edit-repo"'));
    assert.ok(soloHtml.includes('data-testid="team-member-card-1"'));

    const squadHtml = renderToStaticMarkup(
      React.createElement(TeamCard, {
        team: sampleTeam,
        members: sampleMembers,
        isSolo: false,
        onUpdateRepo: async () => true,
      })
    );
    assert.ok(squadHtml.includes('data-testid="team-card"'));
    assert.ok(squadHtml.includes('Team Active'));
    assert.ok(squadHtml.includes('data-testid="team-repo-link"'));
    assert.ok(squadHtml.includes('finpulse/core-engine'));
    assert.ok(squadHtml.includes('data-testid="team-member-card-1"'));
    assert.ok(squadHtml.includes('data-testid="team-member-card-2"'));
    assert.ok(squadHtml.includes('data-testid="team-member-card-3"'));
  });

  it('renders BacklogCard with user stories tab and PostgreSQL schema view tabs', () => {
    const backlogHtml = renderToStaticMarkup(
      React.createElement(BacklogCard, {
        brief: sampleBrief,
      })
    );

    assert.ok(backlogHtml.includes('data-testid="backlog-card"'));
    assert.ok(backlogHtml.includes('data-testid="backlog-product-name"'));
    assert.ok(backlogHtml.includes('HealthSync Telehealth Platform'));
    assert.ok(backlogHtml.includes('data-testid="btn-tab-stories"'));
    assert.ok(backlogHtml.includes('data-testid="btn-tab-schema"'));
    assert.ok(backlogHtml.includes('data-testid="story-card-US-01"'));
    assert.ok(backlogHtml.includes('data-testid="story-card-US-02"'));
    assert.ok(backlogHtml.includes('Patient Intake Validation'));
  });

  it('renders SprintBoardCard across 4-week sprint schedule with PR form and standup trigger', () => {
    const sprintHtml = renderToStaticMarkup(
      React.createElement(SprintBoardCard, {
        sprints: sampleSprints,
        activeWeek: 2,
        onSubmitPrLink: async () => true,
        onSubmitSprint: async () => true,
        onOpenStandup: () => {},
      })
    );

    assert.ok(sprintHtml.includes('data-testid="sprint-board-card"'));
    assert.ok(sprintHtml.includes('data-testid="btn-open-standup"'));
    assert.ok(sprintHtml.includes('data-testid="btn-select-sprint-1"'));
    assert.ok(sprintHtml.includes('data-testid="btn-select-sprint-2"'));
    assert.ok(sprintHtml.includes('data-testid="btn-select-sprint-3"'));
    assert.ok(sprintHtml.includes('data-testid="btn-select-sprint-4"'));
    assert.ok(sprintHtml.includes('data-testid="sprint-goal"'));
    assert.ok(sprintHtml.includes('data-testid="input-pr-link"'));
    assert.ok(sprintHtml.includes('data-testid="btn-record-pr"'));
    assert.ok(sprintHtml.includes('data-testid="btn-submit-sprint"'));
  });

  it('renders StandupModal dialog with word-count validator and accessible controls', () => {
    const closedHtml = renderToStaticMarkup(
      React.createElement(StandupModal, {
        week: 2,
        isOpen: false,
        onClose: () => {},
        onSubmitStandup: async () => true,
      })
    );
    assert.equal(closedHtml, '');

    const openHtml = renderToStaticMarkup(
      React.createElement(StandupModal, {
        week: 2,
        isOpen: true,
        onClose: () => {},
        onSubmitStandup: async () => true,
      })
    );

    assert.ok(openHtml.includes('data-testid="standup-modal"'));
    assert.ok(openHtml.includes('role="dialog"'));
    assert.ok(openHtml.includes('aria-modal="true"'));
    assert.ok(openHtml.includes('data-testid="btn-close-standup"'));
    assert.ok(openHtml.includes('data-testid="textarea-standup-done"'));
    assert.ok(openHtml.includes('data-testid="textarea-standup-next"'));
    assert.ok(openHtml.includes('data-testid="input-standup-blockers"'));
    assert.ok(openHtml.includes('data-testid="standup-word-count"'));
    assert.ok(openHtml.includes('data-testid="btn-cancel-standup"'));
    assert.ok(openHtml.includes('data-testid="btn-save-standup"'));
  });

  it('renders Tier2Desk root composition cleanly in SSR', () => {
    const enrollment: ClientInternshipEnrollment = {
      id: 'int-tier2-1',
      planId: '1m',
      track: 'web_fullstack',
      tier: 'tier2_squad',
      status: 'active',
      companyProfile: null,
      startedAt: '2026-10-01T00:00:00.000Z',
      dueAt: new Date(Date.now() + 20 * 86400000).toISOString(),
      extended: false,
      restarts: 0,
      completedAt: null,
      finalReport: null,
      certificateId: null,
    };

    const deskHtml = renderToStaticMarkup(
      React.createElement(Tier2Desk, {
        enrollment,
        tasks: [],
        team: {
          ...sampleTeam,
          projectBrief: sampleBrief,
        },
        members: sampleMembers,
        sprints: sampleSprints,
        isSolo: false,
        onSubmitDemoUrl: async () => true,
        onStartDefense: () => {},
      })
    );

    assert.ok(deskHtml.includes('data-testid="tier2-desk-root"'));
    assert.ok(deskHtml.includes('data-testid="team-card"'));
    assert.ok(deskHtml.includes('data-testid="backlog-card"'));
    assert.ok(deskHtml.includes('data-testid="sprint-board-card"'));
    assert.ok(deskHtml.includes('data-testid="tier2-demo-card"'));
    assert.ok(deskHtml.includes('data-testid="input-demo-url"'));
    assert.ok(deskHtml.includes('data-testid="btn-verify-demo"'));
    assert.ok(deskHtml.includes('data-testid="btn-launch-oral-defense"'));
  });
});
