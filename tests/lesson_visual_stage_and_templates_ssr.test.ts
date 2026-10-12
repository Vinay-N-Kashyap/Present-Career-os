import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  VisualStage,
  isInteractiveTemplate,
  FlowTemplate,
  BoxesTemplate,
  WireframeTemplate,
  RegisterBitsTemplate,
  LedgerSheetTemplate,
  FunnelTemplate,
} from '../src/app/quests/lesson/components/visuals';
import type { LessonVisual } from '../src/lib/types/lessonVisual';

describe('Lesson Visual Stage and Templates SSR Suite (Block 55 / TASK-343)', () => {
  test('isInteractiveTemplate identifies interactive visual templates accurately', () => {
    assert.equal(isInteractiveTemplate('component-tree'), true);
    assert.equal(isInteractiveTemplate('wireframe'), true);
    assert.equal(isInteractiveTemplate('workflow'), true);
    assert.equal(isInteractiveTemplate('register-bits'), true);
    assert.equal(isInteractiveTemplate('ledger-sheet'), true);
    assert.equal(isInteractiveTemplate('funnel'), true);
    assert.equal(isInteractiveTemplate('flow'), true);
    assert.equal(isInteractiveTemplate('boxes'), true);

    // Non-interactive or unknown templates
    assert.equal(isInteractiveTemplate('letters'), false);
    assert.equal(isInteractiveTemplate('bars'), false);
    assert.equal(isInteractiveTemplate('table'), false);
    assert.equal(isInteractiveTemplate('unknown-template'), false);
    assert.equal(isInteractiveTemplate(undefined), false);
    assert.equal(isInteractiveTemplate(''), false);
  });

  test('VisualStage renders stage root, template, counter, caption, and controls in SSR', () => {
    const mockVisual: LessonVisual = {
      template: 'boxes',
      title: 'Memory State Visualization',
      boxes: [
        { id: 'b1', label: 'counter', tone: 'idle' },
        { id: 'b2', label: 'total', tone: 'data' },
      ],
      steps: [
        {
          at: '0s',
          caption: 'Initialize memory registers to zero',
          values: { b1: 0, b2: 0 },
          tones: { b1: 'idle', b2: 'idle' },
        },
        {
          at: '5s',
          caption: 'Increment accumulator state',
          values: { b1: 1, b2: 10 },
          tones: { b1: 'data', b2: 'data' },
        },
      ],
    } as any;

    const html = renderToStaticMarkup(
      React.createElement(VisualStage, {
        visual: mockVisual,
        currentStepIndex: 0,
        onStepChange: () => {},
        isManualOverride: false,
        onSyncWithVoice: () => {},
        highlightedLabel: null,
        onShapeTap: () => {},
        fallbackNote: 'Reference architecture diagram',
      })
    );

    assert.ok(html.includes('data-testid="visual-stage-root"'));
    assert.ok(html.includes('data-visual-template="boxes"'));
    assert.ok(html.includes('Memory State Visualization'));
    assert.ok(html.includes('data-testid="visual-step-counter"'));
    assert.ok(html.includes('1/2'));
    assert.ok(html.includes('data-testid="visual-prev-btn"'));
    assert.ok(html.includes('data-testid="visual-next-btn"'));
    assert.ok(html.includes('data-testid="visual-stage-caption"'));
    assert.ok(html.includes('Initialize memory registers to zero'));
    assert.ok(html.includes('data-testid="visual-step-dot-0"'));
    assert.ok(html.includes('data-testid="visual-step-dot-1"'));
    assert.ok(html.includes('data-testid="visual-fallback-note"'));
    assert.ok(html.includes('Reference architecture diagram'));
    assert.ok(html.includes('data-testid="boxes-template-root"'));
  });

  test('VisualStage renders sync with voice trigger when manual override is active', () => {
    const mockVisual: LessonVisual = {
      template: 'boxes',
      title: 'Override Test',
      boxes: [{ id: 'b1', label: 'x', tone: 'idle' }],
      steps: [{ at: '0s', caption: 'Step 1', values: {}, tones: {} }],
    } as any;

    const html = renderToStaticMarkup(
      React.createElement(VisualStage, {
        visual: mockVisual,
        currentStepIndex: 0,
        onStepChange: () => {},
        isManualOverride: true,
        onSyncWithVoice: () => {},
        highlightedLabel: null,
        onShapeTap: () => {},
      })
    );

    assert.ok(html.includes('data-testid="visual-sync-voice-btn"'));
    assert.ok(html.includes('Sync with voice'));
  });

  test('FlowTemplate renders linear and convergent data pipelines in SSR', () => {
    // Linear 3-node flow
    const linearHtml = renderToStaticMarkup(
      React.createElement(FlowTemplate, {
        nodes: [
          { id: 'input', label: 'Source Stream', tone: 'idle' },
          { id: 'transform', label: 'Map / Filter', tone: 'data' },
          { id: 'sink', label: 'PostgreSQL Store', tone: 'ok' },
        ],
        step: {
          at: '0s',
          caption: 'Stream pipeline',
          arrows: [['input', 'transform'], ['transform', 'sink']],
          tones: { input: 'idle', transform: 'data', sink: 'ok' },
        },
        highlightedLabel: null,
      })
    );

    assert.ok(linearHtml.includes('data-testid="flow-template-root"'));
    assert.ok(linearHtml.includes('data-flow-layout="linear"'));
    assert.ok(linearHtml.includes('Source Stream'));
    assert.ok(linearHtml.includes('PostgreSQL Store'));

    // Convergent 5-node flow
    const convergentHtml = renderToStaticMarkup(
      React.createElement(FlowTemplate, {
        nodes: [
          { id: 'item', label: 'Raw Item', tone: 'idle' },
          { id: 'clean_item', label: 'Clean Item', tone: 'data' },
          { id: 'category', label: 'Category', tone: 'idle' },
          { id: 'clean_category', label: 'Clean Cat', tone: 'data' },
          { id: 'label', label: 'Target Model', tone: 'ok' },
        ],
        step: {
          at: '0s',
          caption: 'Convergent join',
          arrows: [['item', 'clean_item'], ['category', 'clean_category']],
          tones: {},
        },
        highlightedLabel: null,
      })
    );

    assert.ok(convergentHtml.includes('data-testid="flow-template-root"'));
    assert.ok(convergentHtml.includes('data-flow-layout="convergent"'));
    assert.ok(convergentHtml.includes('Target Model'));
  });

  test('Specialized domain templates render deterministic roots and data in SSR', () => {
    // 1. WireframeTemplate
    const wireframeHtml = renderToStaticMarkup(
      React.createElement(WireframeTemplate, {
        boxes: [
          { id: 'h', label: 'Header', tone: 'idle' },
          { id: 'm', label: 'Main Feed', tone: 'data' },
        ],
        step: {
          at: '0s',
          caption: 'Flexbox column layout',
          layoutMode: 'flex-col',
        },
      })
    );
    assert.ok(wireframeHtml.includes('data-testid="wireframe-template-root"'));

    // 2. RegisterBitsTemplate (IoT / Systems)
    const registerBitsHtml = renderToStaticMarkup(
      React.createElement(RegisterBitsTemplate, {
        step: {
          at: '0s',
          caption: 'Configure UART Control Register',
          registerName: 'UART_CR1',
          bitWidth: 8,
          decimalValue: 13,
          hexValue: '0x0D',
          bits: [
            { index: 0, label: 'UE', value: 1, tone: 'ok' },
            { index: 2, label: 'RE', value: 1, tone: 'data' },
            { index: 3, label: 'TE', value: 1, tone: 'data' },
          ],
        },
      })
    );
    assert.ok(registerBitsHtml.includes('data-testid="visual-register-bits"'));
    assert.ok(registerBitsHtml.includes('UART_CR1'));
    assert.ok(registerBitsHtml.includes('0x0D'));

    // 3. LedgerSheetTemplate (Accounting / Commerce)
    const ledgerHtml = renderToStaticMarkup(
      React.createElement(LedgerSheetTemplate, {
        step: {
          at: '0s',
          caption: 'Record accounts receivable receipt',
          totalDebit: 1500,
          totalCredit: 1500,
          isBalanced: true,
          entries: [
            { id: 'e1', date: '2026-10-12', account: 'Cash', debit: 1500, credit: 0, tone: 'ok' },
            { id: 'e2', date: '2026-10-12', account: 'Accounts Receivable', debit: 0, credit: 1500, tone: 'data' },
          ],
        },
      })
    );
    assert.ok(ledgerHtml.includes('data-testid="visual-ledger-sheet"'));
    assert.ok(ledgerHtml.includes('$1,500.00'));
    assert.ok(ledgerHtml.includes('Accounts Receivable'));

    // 4. FunnelTemplate (Marketing / Sales)
    const funnelHtml = renderToStaticMarkup(
      React.createElement(FunnelTemplate, {
        step: {
          at: '0s',
          caption: 'Customer acquisition conversion funnel',
          stages: [
            { id: 's1', label: 'Impressions', value: 10000, tone: 'idle' },
            { id: 's2', label: 'Signups', value: 1200, tone: 'data' },
            { id: 's3', label: 'Subscribers', value: 300, tone: 'ok' },
          ],
        },
      })
    );
    assert.ok(funnelHtml.includes('data-testid="visual-funnel"'));
    assert.ok(funnelHtml.includes('Impressions'));
    assert.ok(funnelHtml.includes('Subscribers'));
  });
});
