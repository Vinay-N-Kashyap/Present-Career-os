import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { VisualStage } from '../src/app/quests/lesson/components/visuals/VisualStage';
import { synthesizeLongLessonVisual } from '../src/lib/visuals/loadVisuals';
import { getLongLesson } from '../src/lib/data/longLessons';
import { getTappableLabelsForVisual } from '../src/lib/visuals/visualRules';

test('Block 38: VisualStage SSR renders all 9 specialized synthesized templates across all 4 steps without error', () => {
  const representativeCourses: Array<{
    prefix: string;
    expectedTemplate:
      | 'register-bits'
      | 'funnel'
      | 'workflow'
      | 'ledger-sheet'
      | 'wireframe'
      | 'component-tree'
      | 'sequence'
      | 'states'
      | 'flow';
  }> = [
    { prefix: 'iot_emb', expectedTemplate: 'register-bits' },
    { prefix: 'bcom_scrm', expectedTemplate: 'funnel' },
    { prefix: 'bcom_ops', expectedTemplate: 'workflow' },
    { prefix: 'bcom-accounting', expectedTemplate: 'ledger-sheet' },
    { prefix: 'design', expectedTemplate: 'wireframe' },
    { prefix: 'mobile', expectedTemplate: 'component-tree' },
    { prefix: 'blockchain', expectedTemplate: 'sequence' },
    { prefix: 'quant-systems', expectedTemplate: 'states' },
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
    }
  }
});

test('Block 38: getTappableLabelsForVisual extracts labels for component-tree, workflow, wireframe, states, and sequence', () => {
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
});
