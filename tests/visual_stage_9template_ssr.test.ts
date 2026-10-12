import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { VisualStage } from '../src/app/quests/lesson/components/visuals/VisualStage';
import { synthesizeLongLessonVisual } from '../src/lib/visuals/loadVisuals';
import { getLongLesson } from '../src/lib/data/longLessons';
import { getTappableLabelsForVisual } from '../src/lib/visuals/visualRules';

test('Block 38 & 39: VisualStage SSR renders all 13 specialized synthesized templates across all 4 steps without error', () => {
  const representativeCourses: Array<{
    prefix: string;
    expectedTemplate:
      | 'register-bits'
      | 'funnel'
      | 'workflow'
      | 'bars'
      | 'tree-graph'
      | 'ledger-sheet'
      | 'wireframe'
      | 'component-tree'
      | 'sequence'
      | 'states'
      | 'stack-queue'
      | 'cells'
      | 'flow';
  }> = [
    { prefix: 'iot_emb', expectedTemplate: 'register-bits' },
    { prefix: 'bcom_scrm', expectedTemplate: 'funnel' },
    { prefix: 'bcom_ops', expectedTemplate: 'workflow' },
    { prefix: 'bcom_ana', expectedTemplate: 'bars' },
    { prefix: 'bcom_ait', expectedTemplate: 'tree-graph' },
    { prefix: 'bcom-accounting', expectedTemplate: 'ledger-sheet' },
    { prefix: 'design', expectedTemplate: 'wireframe' },
    { prefix: 'mobile', expectedTemplate: 'component-tree' },
    { prefix: 'blockchain', expectedTemplate: 'sequence' },
    { prefix: 'quant-systems', expectedTemplate: 'states' },
    { prefix: 'java-basics', expectedTemplate: 'stack-queue' },
    { prefix: 'comp_fund', expectedTemplate: 'cells' },
    { prefix: 'fullstack-js', expectedTemplate: 'flow' }
  ];

  for (const { prefix, expectedTemplate } of representativeCourses) {
    const lesson = getLongLesson(prefix, 1);
    assert.ok(lesson, `Expected Day 1 LongLesson for "${prefix}"`);

    const visual = synthesizeLongLessonVisual(prefix, 1, 0, lesson.parts[0]);
    assert.ok(visual, `Expected synthesized visual for "${prefix}"`);
    assert.equal(visual.template, expectedTemplate);

    const tappableLabels = getTappableLabelsForVisual(visual);
    assert.ok(tappableLabels.length >= 2, `Expected >= 2 tappable labels for "${prefix}" (${expectedTemplate})`);

    for (let stepIdx = 0; stepIdx < visual.steps.length; stepIdx++) {
      const markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(VisualStage, {
          visual,
          currentStepIndex: stepIdx,
          onStepChange: () => {},
          isManualOverride: stepIdx === 2,
          onSyncWithVoice: () => {},
          highlightedLabel: tappableLabels[stepIdx % tappableLabels.length],
          onShapeTap: () => {},
          fallbackNote: stepIdx === 3 ? 'Synthesized domain telemetry' : null
        })
      );

      const htmlEscape = (str: string) =>
        str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      assert.ok(
        markup.includes(`data-testid="visual-template-${expectedTemplate}"`),
        `Expected rendered VisualStage for "${prefix}" step ${stepIdx} to include data-testid="visual-template-${expectedTemplate}"`
      );
      assert.ok(
        markup.includes('data-testid="visual-step-counter"') && markup.includes(`${stepIdx + 1}/4`),
        `Expected rendered VisualStage for "${prefix}" step ${stepIdx} to include step counter ${stepIdx + 1}/4`
      );
      assert.ok(
        markup.includes(htmlEscape(visual.title)) || markup.includes(visual.title),
        `Expected rendered VisualStage for "${prefix}" step ${stepIdx} to include visual title`
      );
      assert.ok(
        markup.includes(htmlEscape(visual.steps[stepIdx].caption)) || markup.includes(visual.steps[stepIdx].caption),
        `Expected rendered VisualStage for "${prefix}" step ${stepIdx} to include step caption`
      );
      if (stepIdx === 0) {
        assert.ok(
          markup.includes(htmlEscape(tappableLabels[0])) || markup.includes(tappableLabels[0]),
          `Expected rendered VisualStage for "${prefix}" step 0 to include tappable label "${tappableLabels[0]}"`
        );
      }
      if (stepIdx === 2) {
        assert.ok(
          markup.includes('data-testid="visual-sync-voice-btn"'),
          `Expected rendered VisualStage for "${prefix}" step 2 (manual override) to include sync-voice button`
        );
      }
    }
  }
});

test('Block 38 & 39: getTappableLabelsForVisual extracts labels for component-tree, workflow, wireframe, states, sequence, bars, tree-graph, stack-queue, and cells', () => {
  const designVisual = synthesizeLongLessonVisual('design', 1, 0, { title: 'Responsive Grid Tokens' });
  assert.ok(designVisual);
  assert.equal(designVisual.template, 'wireframe');
  assert.deepEqual(getTappableLabelsForVisual(designVisual), ['Navigation Bar', 'Primary Hero Viewport', 'Interactive CTA Card']);

  const mobileVisual = synthesizeLongLessonVisual('mobile', 1, 0, { title: 'Navigation Stack Lifecycle' });
  assert.ok(mobileVisual);
  assert.equal(mobileVisual.template, 'component-tree');
  assert.deepEqual(getTappableLabelsForVisual(mobileVisual), [
    '<MobileAppShell />',
    '<NavigationStack />',
    '<ScreenViewport />',
    '<NativeSensorBridge />'
  ]);

  const blockchainVisual = synthesizeLongLessonVisual('blockchain', 1, 0, { title: 'Smart Contract Execution' });
  assert.ok(blockchainVisual);
  assert.equal(blockchainVisual.template, 'sequence');
  assert.deepEqual(getTappableLabelsForVisual(blockchainVisual), [
    'Wallet Signer',
    'Mempool Node',
    'EVM Contract',
    'Block Ledger'
  ]);

  const quantVisual = synthesizeLongLessonVisual('quant-systems', 1, 0, { title: 'Order Book Execution Engine' });
  assert.ok(quantVisual);
  assert.equal(quantVisual.template, 'states');
  assert.deepEqual(getTappableLabelsForVisual(quantVisual), [
    'Market Feed',
    'Risk Gate',
    'Limit Order Book',
    'Execution Fill'
  ]);

  const anaVisual = synthesizeLongLessonVisual('bcom_ana', 1, 0, { title: 'Cohort Revenue Decomposition' });
  assert.ok(anaVisual);
  assert.equal(anaVisual.template, 'bars');
  assert.deepEqual(getTappableLabelsForVisual(anaVisual), [
    'Revenue Run-Rate',
    'Contribution Margin',
    'Operating Cash Flow',
    'Net EBITDA'
  ]);

  const aitVisual = synthesizeLongLessonVisual('bcom_ait', 1, 0, { title: 'Enterprise RAG Guardrails' });
  assert.ok(aitVisual);
  assert.equal(aitVisual.template, 'tree-graph');
  assert.deepEqual(getTappableLabelsForVisual(aitVisual), [
    'Context Query',
    'Vector Retriever',
    'Policy Guardrail',
    'Synthesized Action'
  ]);

  const javaVisual = synthesizeLongLessonVisual('java-basics', 1, 0, { title: 'JVM Stack Frame Allocation' });
  assert.ok(javaVisual);
  assert.equal(javaVisual.template, 'stack-queue');
  assert.deepEqual(getTappableLabelsForVisual(javaVisual), [
    'main() Frame',
    'Service.invoke()',
    'Repository.query()'
  ]);

  const compVisual = synthesizeLongLessonVisual('comp_fund', 1, 0, { title: 'Von Neumann Fetch-Decode-Execute' });
  assert.ok(compVisual);
  assert.equal(compVisual.template, 'cells');
  assert.deepEqual(getTappableLabelsForVisual(compVisual), [
    '0x00: OPCODE',
    '0x04: REG_A',
    '0x08: REG_B',
    '0x0C: ACCUM'
  ]);
});
