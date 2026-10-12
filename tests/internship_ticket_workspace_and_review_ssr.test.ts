import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { CodeReviewCard } from '../src/app/quests/components/internship/CodeReviewCard';
import {
  TicketEditorTabs,
  getTicketLanguageInfo,
} from '../src/app/quests/components/internship/TicketEditorTabs';
import { TicketTerminalOutput } from '../src/app/quests/components/internship/TicketTerminalOutput';
import { TicketWorkspace } from '../src/app/quests/components/internship/TicketWorkspace';
import type { ClientInternshipTask } from '../src/lib/internships/types';
import type { CodeReview } from '../src/lib/internships/codeReview';

describe('Block 50 — TicketWorkspace, TicketEditorTabs, TicketTerminalOutput & CodeReviewCard SSR Suite', () => {
  const sampleReview: CodeReview = {
    scores: {
      correctness: 5,
      readability: 4,
      edgeCases: 4,
      naming: 5,
    },
    strengths: [
      'Clean modular functional composition with proper error boundary handling.',
      'Optimal O(N) linear time complexity with bounded memory allocation.',
    ],
    improvements: [
      'Add defensive typing around undefined payload metadata.',
      'Document idempotent retry behavior in function docstring.',
    ],
    summary: 'Outstanding architectural implementation ready for production staging.',
  };

  const sampleTaskPython: ClientInternshipTask = {
    id: 'ticket-py-01',
    companyId: 'finpulse-ai',
    title: 'Implement Decimal Quantizer for Real-Time Order Stream',
    brief: 'Implement parse_and_quantize(amounts) to round high-precision trade orders to 4 decimal places without float drift.',
    starterCode: 'def parse_and_quantize(amounts):\n    # TODO: Implement\n    pass\n',
    visibleTests: 'assert parse_and_quantize(["1.00004"]) == ["1.0000"]\nprint("Visible tests passed!")',
    language: 'python',
    status: 'open',
    seq: 1,
    attempts: 0,
    maxAttempts: 10,
    passedAt: null,
  };

  const sampleTaskTsx: ClientInternshipTask = {
    id: 'ticket-tsx-02',
    companyId: 'finpulse-ai',
    title: 'Build Live Order Book Depth Visualizer Widget',
    brief: 'Create a reactive component rendering order depth with green bids and red asks.',
    starterCode: 'export function OrderDepth() { return <div>Depth</div>; }',
    visibleTests: 'import { render } from "@testing-library/react";\n// assertions',
    language: 'tsx',
    status: 'passed',
    seq: 2,
    attempts: 2,
    maxAttempts: 10,
    passedAt: '2026-10-12T12:00:00.000Z',
  };

  it('correctly maps language metadata across python, tsx, typescript, and sql', () => {
    const py = getTicketLanguageInfo('python');
    assert.equal(py.codeFileName, 'main.py');
    assert.equal(py.testFileName, 'test_visible.py');
    assert.equal(py.label, 'Python');
    assert.equal(py.indentSize, 4);

    const tsx = getTicketLanguageInfo('tsx');
    assert.equal(tsx.codeFileName, 'Component.tsx');
    assert.equal(tsx.testFileName, 'test_visible.tsx');
    assert.equal(tsx.label, 'React TSX');
    assert.equal(tsx.indentSize, 2);

    const ts = getTicketLanguageInfo('typescript');
    assert.equal(ts.codeFileName, 'solution.ts');
    assert.equal(ts.testFileName, 'test_visible.ts');
    assert.equal(ts.label, 'TypeScript');
    assert.equal(ts.indentSize, 2);

    const sql = getTicketLanguageInfo('sql');
    assert.equal(sql.codeFileName, 'query.sql');
    assert.equal(sql.testFileName, 'test_visible.sql');
    assert.equal(sql.label, 'PostgreSQL');
    assert.equal(sql.indentSize, 2);

    const fallback = getTicketLanguageInfo(undefined);
    assert.equal(fallback.label, 'Python');
  });

  it('renders CodeReviewCard SSR with criteria scores, strengths, and improvements', () => {
    // null review check
    const nullMarkup = renderToStaticMarkup(React.createElement(CodeReviewCard, { review: null }));
    assert.equal(nullMarkup, '');

    // filled review check
    const markup = renderToStaticMarkup(
      React.createElement(CodeReviewCard, { review: sampleReview })
    );

    assert.ok(markup.includes('data-testid="code-review-card"'));
    assert.ok(markup.includes('Senior AI Code Review'));
    assert.ok(markup.includes('data-testid="code-review-scores-grid"'));
    assert.ok(markup.includes('data-testid="code-review-score-correctness"'));
    assert.ok(markup.includes('5/5'));
    assert.ok(markup.includes('data-testid="code-review-score-readability"'));
    assert.ok(markup.includes('4/5'));
    assert.ok(markup.includes('data-testid="code-review-strengths"'));
    assert.ok(markup.includes('Clean modular functional composition'));
    assert.ok(markup.includes('data-testid="code-review-improvements"'));
    assert.ok(markup.includes('Add defensive typing around undefined payload metadata'));
  });

  it('renders TicketEditorTabs SSR with solution/tests tab triggers and language badge', () => {
    let dummyCode = sampleTaskPython.starterCode;
    const markup = renderToStaticMarkup(
      React.createElement(TicketEditorTabs, {
        code: dummyCode,
        setCode: (c: string) => { dummyCode = c; },
        starterCode: sampleTaskPython.starterCode,
        visibleTests: sampleTaskPython.visibleTests,
        language: 'python',
      })
    );

    assert.ok(markup.includes('data-testid="ticket-editor-tabs-root"'));
    assert.ok(markup.includes('data-testid="btn-tab-solution"'));
    assert.ok(markup.includes('main.py (Solution)'));
    assert.ok(markup.includes('data-testid="btn-tab-tests"'));
    assert.ok(markup.includes('test_visible.py (Tests)'));
    assert.ok(markup.includes('data-testid="ticket-lang-badge"'));
    assert.ok(markup.includes('Python'));
    assert.ok(markup.includes('data-testid="btn-toggle-editor-mode"'));
    assert.ok(markup.includes('data-testid="btn-reset-starter-code"'));
  });

  it('renders TicketTerminalOutput SSR across sandbox local execution and server verification states', () => {
    // Both null check
    const emptyMarkup = renderToStaticMarkup(
      React.createElement(TicketTerminalOutput, {
        localOutput: null,
        submitResult: null,
      })
    );
    assert.equal(emptyMarkup, '');

    // Local sandbox output
    const localMarkup = renderToStaticMarkup(
      React.createElement(TicketTerminalOutput, {
        localOutput: 'Assert 1 passed: 1.0000 == 1.0000\nDone.',
        submitResult: null,
      })
    );
    assert.ok(localMarkup.includes('data-testid="ticket-terminal-output"'));
    assert.ok(localMarkup.includes('Local Sandbox'));
    assert.ok(localMarkup.includes('Assert 1 passed'));

    // Server verification output with AI review
    const serverMarkup = renderToStaticMarkup(
      React.createElement(TicketTerminalOutput, {
        localOutput: null,
        submitResult: {
          passed: true,
          output: 'All 8 hidden edge cases verified successfully!',
          attempts: 1,
          aiReview: sampleReview,
        },
      })
    );
    assert.ok(serverMarkup.includes('data-testid="ticket-terminal-output"'));
    assert.ok(serverMarkup.includes('✓ All Tests Passed'));
    assert.ok(serverMarkup.includes('(Attempt #1)'));
    assert.ok(serverMarkup.includes('All 8 hidden edge cases verified successfully!'));
    assert.ok(serverMarkup.includes('data-testid="code-review-card"'));
  });

  it('renders TicketWorkspace SSR modal with dialog accessibility, header, brief, and action buttons', () => {
    const markup = renderToStaticMarkup(
      React.createElement(TicketWorkspace, {
        task: sampleTaskTsx,
        onBack: () => {},
        onTaskPassed: () => {},
      })
    );

    assert.ok(markup.includes('data-testid="ticket-workspace-modal"'));
    assert.ok(markup.includes('role="dialog"'));
    assert.ok(markup.includes('aria-modal="true"'));
    assert.ok(markup.includes('aria-label="Ticket #2: Build Live Order Book Depth Visualizer Widget"'));
    assert.ok(markup.includes('data-testid="btn-back-to-backlog"'));
    assert.ok(markup.includes('data-testid="btn-close-ticket-workspace"'));
    assert.ok(markup.includes('data-testid="ticket-workspace-title"'));
    assert.ok(markup.includes('Build Live Order Book Depth Visualizer Widget'));
    assert.ok(markup.includes('data-testid="ticket-workspace-brief"'));
    assert.ok(markup.includes('Create a reactive component rendering order depth'));
    assert.ok(markup.includes('data-testid="btn-run-visible-tests"'));
    assert.ok(markup.includes('data-testid="btn-submit-ticket-solution"'));
  });
});
