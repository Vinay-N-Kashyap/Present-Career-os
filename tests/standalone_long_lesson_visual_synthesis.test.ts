import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { synthesizeLongLessonVisual } from '../src/lib/visuals/loadVisuals';
import { getLongLesson } from '../src/lib/data/longLessons';
import { getTappableLabelsForVisual } from '../src/lib/visuals/visualRules';

test('Block 37, 38 & 39: All 28 standalone & B.Com course prefixes are enabled and synthesize 13 specialized 4-step visuals for Day 1 LongLessons', () => {
  const courseExpectations: Array<{
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
    // IoT & Hardware -> register-bits
    { prefix: 'iot_emb', expectedTemplate: 'register-bits' },
    { prefix: 'iot_edge', expectedTemplate: 'register-bits' },
    { prefix: 'iot_sec', expectedTemplate: 'register-bits' },
    { prefix: 'iot_net', expectedTemplate: 'register-bits' },

    // Sales, CRM, Marketing, E-Commerce & Entrepreneurship -> funnel
    { prefix: 'bcom_scrm', expectedTemplate: 'funnel' },
    { prefix: 'bcom_dmkt', expectedTemplate: 'funnel' },
    { prefix: 'bcom-marketing', expectedTemplate: 'funnel' },
    { prefix: 'bcom_ecom', expectedTemplate: 'funnel' },
    { prefix: 'bcom_ent', expectedTemplate: 'funnel' },

    // Operations, Git VCS & Soft Skills -> workflow
    { prefix: 'bcom_ops', expectedTemplate: 'workflow' },
    { prefix: 'git_vcs', expectedTemplate: 'workflow' },
    { prefix: 'soft-skills', expectedTemplate: 'workflow' },

    // Business Analytics & Excel Visualization -> bars
    { prefix: 'bcom_ana', expectedTemplate: 'bars' },
    { prefix: 'excel_viz', expectedTemplate: 'bars' },

    // AI Business Transformation -> tree-graph
    { prefix: 'bcom_ait', expectedTemplate: 'tree-graph' },

    // Accounting, Finance, Tax, Audit, Banking & Corporate Law -> ledger-sheet
    { prefix: 'bcom-accounting', expectedTemplate: 'ledger-sheet' },
    { prefix: 'bcom-finance', expectedTemplate: 'ledger-sheet' },
    { prefix: 'bcom_tax', expectedTemplate: 'ledger-sheet' },
    { prefix: 'bcom_aud', expectedTemplate: 'ledger-sheet' },
    { prefix: 'bcom_ban', expectedTemplate: 'ledger-sheet' },
    { prefix: 'bcom_law', expectedTemplate: 'ledger-sheet' },

    // UI/UX Design -> wireframe
    { prefix: 'design', expectedTemplate: 'wireframe' },

    // Mobile Architecture -> component-tree
    { prefix: 'mobile', expectedTemplate: 'component-tree' },

    // Blockchain & Web3 -> sequence
    { prefix: 'blockchain', expectedTemplate: 'sequence' },

    // 3D Graphics & Quant Systems -> states
    { prefix: 'quant-systems', expectedTemplate: 'states' },
    { prefix: 'g3d', expectedTemplate: 'states' },

    // Java Systems -> stack-queue
    { prefix: 'java-basics', expectedTemplate: 'stack-queue' },

    // Computer Fundamentals -> cells
    { prefix: 'comp_fund', expectedTemplate: 'cells' },

    // Full-Stack JS -> flow
    { prefix: 'fullstack-js', expectedTemplate: 'flow' }
  ];

  for (const { prefix, expectedTemplate } of courseExpectations) {
    assert.equal(isCourseVisualsEnabled(prefix), true, `Expected prefix "${prefix}" to be enabled in ENABLED_COURSES`);

    const lesson = getLongLesson(prefix, 1);
    assert.ok(lesson, `Expected Day 1 LongLesson for "${prefix}"`);
    assert.ok(lesson.parts.length >= 4, `Expected >= 4 parts in Day 1 LongLesson for "${prefix}"`);

    const visual = synthesizeLongLessonVisual(prefix, 1, 0, lesson.parts[0]);
    assert.ok(visual, `Expected synthesized visual for "${prefix}" Day 1 Part 0`);
    assert.equal(visual.template, expectedTemplate, `Expected "${prefix}" to synthesize template "${expectedTemplate}", got "${visual.template}"`);
    assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps (intro, say1, example, tryIt) for "${prefix}"`);
    assert.deepEqual(
      visual.steps.map(s => s.at),
      ['intro', 'say1', 'example', 'tryIt'],
      `Expected step markers ['intro', 'say1', 'example', 'tryIt'] for "${prefix}"`
    );

    const labels = getTappableLabelsForVisual(visual);
    assert.ok(labels.length > 0, `Expected non-empty tappable labels for "${prefix}" (${visual.template})`);
  }
});

test('Block 37: synthesizeLongLessonVisual returns null for disabled unknown course prefixes', () => {
  const res = synthesizeLongLessonVisual('disabled-course-xyz', 1, 0, { title: 'Test Part' });
  assert.equal(res, null);
});
