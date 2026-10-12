import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { CompanyProfileCard } from '../src/app/quests/components/internship/CompanyProfileCard';
import {
  InternshipDeadlineBanner,
  computeDeadlineStatus,
} from '../src/app/quests/components/internship/InternshipDeadlineBanner';
import { TicketListCard } from '../src/app/quests/components/internship/TicketListCard';
import { Tier1Desk } from '../src/app/quests/components/internship/Tier1Desk';
import {
  FinalReportModal,
  evaluateReportWordCount,
} from '../src/app/quests/components/internship/FinalReportModal';
import type { ClientInternshipTask, ClientInternshipEnrollment } from '../src/lib/internships/types';

describe('Block 48 — Internship Tier1Desk, CompanyProfileCard, DeadlineBanner, TicketListCard & FinalReportModal SSR Suite', () => {
  it('renders CompanyProfileCard with industry badge, README body, and expand toggle for long READMEs', () => {
    const nullHtml = renderToStaticMarkup(React.createElement(CompanyProfileCard, { profile: null }));
    assert.equal(nullHtml, '');

    const longReadme = 'Welcome to CloudPulse Engineering. '.repeat(10);
    const html = renderToStaticMarkup(
      React.createElement(CompanyProfileCard, {
        profile: {
          name: 'CloudPulse Systems',
          industry: 'Cloud Infrastructure & FinOps',
          readme: longReadme,
        },
      })
    );

    assert.ok(html.includes('data-testid="company-profile-card"'));
    assert.ok(html.includes('data-testid="company-profile-name"'));
    assert.ok(html.includes('CloudPulse Systems'));
    assert.ok(html.includes('data-testid="company-profile-industry"'));
    assert.ok(html.includes('Cloud Infrastructure &amp; FinOps'));
    assert.ok(html.includes('data-testid="company-profile-readme"'));
    assert.ok(html.includes('data-testid="btn-toggle-company-readme"'));
  });

  it('computes deadline status accurately and renders InternshipDeadlineBanner across active, urgent, extended, and expired states', () => {
    const baseNow = new Date('2026-10-12T12:00:00.000Z').getTime();

    const activeStatus = computeDeadlineStatus('2026-10-22T18:00:00.000Z', baseNow);
    assert.equal(activeStatus.isPast, false);
    assert.equal(activeStatus.isUrgent, false);
    assert.equal(activeStatus.timeDisplay, '10d 6h remaining');

    const urgentStatus = computeDeadlineStatus('2026-10-14T15:00:00.000Z', baseNow);
    assert.equal(urgentStatus.isPast, false);
    assert.equal(urgentStatus.isUrgent, true);
    assert.equal(urgentStatus.timeDisplay, '2d 3h remaining');

    const pastStatus = computeDeadlineStatus('2026-10-10T12:00:00.000Z', baseNow);
    assert.equal(pastStatus.isPast, true);
    assert.equal(pastStatus.timeDisplay, 'Simulation period ended');

    const futureIso = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const bannerHtml = renderToStaticMarkup(
      React.createElement(InternshipDeadlineBanner, {
        dueAt: futureIso,
        extended: false,
        status: 'active',
        onRequestExtension: async () => {},
      })
    );
    assert.ok(bannerHtml.includes('data-testid="internship-deadline-banner"'));
    assert.ok(bannerHtml.includes('data-testid="deadline-time-display"'));
    assert.ok(bannerHtml.includes('data-testid="btn-request-extension"'));

    const extendedHtml = renderToStaticMarkup(
      React.createElement(InternshipDeadlineBanner, {
        dueAt: futureIso,
        extended: true,
        status: 'active',
      })
    );
    assert.ok(extendedHtml.includes('data-testid="deadline-extended-badge"'));
  });

  it('renders TicketListCard and Tier1Desk with sequential tickets, statuses, and final report banner', () => {
    const sampleTasks: ClientInternshipTask[] = [
      {
        id: 'tsk-1',
        seq: 1,
        title: 'Fix Null Dereference in Billing Webhook',
        kind: 'bug_fix',
        brief: 'Guard missing customer metadata on Stripe invoice.paid payloads.',
        starterCode: 'def handle_webhook(evt):\n    pass',
        publicTests: 'assert True',
        skills: ['Python', 'Webhooks'],
        status: 'passed',
        attempts: 1,
        passedAt: '2026-10-12T10:00:00.000Z',
        lastSubmittedCode: null,
        lastAiReview: null,
      },
      {
        id: 'tsk-2',
        seq: 2,
        title: 'Implement Idempotency Key Validator',
        kind: 'new_function',
        brief: 'Prevent duplicate ledger postings within 24h window.',
        starterCode: 'def check_idempotency(key):\n    pass',
        publicTests: 'assert True',
        skills: ['Idempotency', 'Redis'],
        status: 'open',
        attempts: 2,
        passedAt: null,
        lastSubmittedCode: null,
        lastAiReview: null,
      },
      {
        id: 'tsk-3',
        seq: 3,
        title: 'Refactor Retry Backoff Scheduler',
        kind: 'refactor',
        brief: 'Add jittered exponential backoff.',
        starterCode: '',
        publicTests: '',
        skills: ['Resilience'],
        status: 'locked',
        attempts: 0,
        passedAt: null,
        lastSubmittedCode: null,
        lastAiReview: null,
      },
    ];

    const enrollment: ClientInternshipEnrollment = {
      id: 'int-enr-1',
      planId: '1m',
      track: 'python_ai',
      tier: 'tier1_solo',
      status: 'active',
      companyProfile: {
        name: 'FinLedger AI',
        industry: 'FinTech',
        readme: 'Core payment infrastructure simulation.',
      },
      startedAt: '2026-10-01T00:00:00.000Z',
      dueAt: new Date(Date.now() + 5 * 86400000).toISOString(),
      extended: false,
      restarts: 0,
      completedAt: null,
      finalReport: null,
      certificateId: null,
    };

    const deskHtml = renderToStaticMarkup(
      React.createElement(Tier1Desk, {
        enrollment,
        tasks: sampleTasks,
        needsFinalReport: true,
        onExtendDeadline: () => {},
        isExtending: false,
        onOpenReport: () => {},
        onSelectTicket: () => {},
      })
    );

    assert.ok(deskHtml.includes('data-testid="internship-deadline-banner"'));
    assert.ok(deskHtml.includes('data-testid="company-profile-card"'));
    assert.ok(deskHtml.includes('data-testid="tier1-final-report-banner"'));
    assert.ok(deskHtml.includes('data-testid="btn-open-final-report"'));
    assert.ok(deskHtml.includes('data-testid="ticket-list-card"'));
    assert.ok(deskHtml.includes('data-testid="ticket-passed-counter"'));
    assert.ok(deskHtml.includes('1 of 3 Tickets Passed'));
    assert.ok(deskHtml.includes('data-testid="ticket-card-1"'));
    assert.ok(deskHtml.includes('data-testid="ticket-card-2"'));
    assert.ok(deskHtml.includes('data-testid="ticket-card-3"'));
    assert.ok(deskHtml.includes('data-testid="btn-open-ticket-1"'));
    assert.ok(deskHtml.includes('data-testid="btn-open-ticket-2"'));
    assert.ok(!deskHtml.includes('data-testid="btn-open-ticket-3"'));
  });

  it('evaluates FinalReportModal word count bounds (100-300 words) and renders modal accessibility attributes', () => {
    const shortStats = evaluateReportWordCount('Too short summary with only seven words.');
    assert.equal(shortStats.wordCount, 7);
    assert.equal(shortStats.isTooShort, true);
    assert.equal(shortStats.isValidLength, false);

    const validReport = Array.from({ length: 145 }, (_, i) => `word${i + 1}`).join(' ');
    const validStats = evaluateReportWordCount(validReport);
    assert.equal(validStats.wordCount, 145);
    assert.equal(validStats.isTooShort, false);
    assert.equal(validStats.isTooLong, false);
    assert.equal(validStats.isValidLength, true);

    const longReport = Array.from({ length: 310 }, (_, i) => `word${i + 1}`).join(' ');
    const longStats = evaluateReportWordCount(longReport);
    assert.equal(longStats.wordCount, 310);
    assert.equal(longStats.isTooLong, true);
    assert.equal(longStats.isValidLength, false);

    const modalHtml = renderToStaticMarkup(
      React.createElement(FinalReportModal, {
        enrollmentId: 'int-enr-1',
        onClose: () => {},
        onReportAccepted: () => {},
      })
    );

    assert.ok(modalHtml.includes('data-testid="final-report-modal"'));
    assert.ok(modalHtml.includes('role="dialog"'));
    assert.ok(modalHtml.includes('aria-modal="true"'));
    assert.ok(modalHtml.includes('data-testid="btn-close-final-report"'));
    assert.ok(modalHtml.includes('data-testid="final-report-word-count"'));
    assert.ok(modalHtml.includes('data-testid="textarea-final-report"'));
    assert.ok(modalHtml.includes('data-testid="btn-cancel-final-report"'));
    assert.ok(modalHtml.includes('data-testid="btn-submit-final-report"'));
  });
});
