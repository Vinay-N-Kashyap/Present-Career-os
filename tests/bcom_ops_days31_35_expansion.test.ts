import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BCOM_OPS_LONG_LESSONS } from '../src/lib/data/bcomOpsLongLessons';
import fs from 'node:fs';
import path from 'node:path';

describe('B.Com Operations Month 2 (Days 31-35) Expansion Suite', () => {
  it('Day 31: Structural integrity, word counts, and pedagogical invariants', () => {
    const day31 = BCOM_OPS_LONG_LESSONS.find((l) => l.day === 31);
    assert.ok(day31, 'Day 31 must be present in BCOM_OPS_LONG_LESSONS');
    assert.equal(day31.coursePrefix, 'bcom_ops');
    assert.equal(day31.minutes, 38);
    assert.equal(day31.parts.length, 5, 'Day 31 must have exactly 5 parts');

    let totalWords = 0;
    day31.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(
        words >= 600,
        `Part ${idx + 1} word count (${words}) must be >= 600 words`
      );
      totalWords += words;

      // Assessment Invariants
      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why && part.check.why.length >= 50, `Part ${idx + 1} why rationale must be detailed`);

      // Code & Output Invariants
      assert.ok(part.code, `Part ${idx + 1} must have a code snippet`);
      assert.ok(part.output, `Part ${idx + 1} must have an output string`);
    });

    assert.ok(totalWords >= 3000, `Day 31 total words (${totalWords}) must be >= 3000 words`);
    assert.ok(day31.projectStep, 'Day 31 must have projectStep');
    assert.ok(day31.projectStep.title, 'Day 31 projectStep must have a title');
    assert.ok(day31.projectStep.steps && day31.projectStep.steps.length >= 3, 'Day 31 projectStep must have steps');
  });

  it('Day 31: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom_ops/day-31.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-31.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'bcom_ops');
    assert.equal(visual.day, 31);
    assert.equal(visual.entries.length, 5, 'Must have 5 visual entries');

    visual.entries.forEach((entry: any, idx: number) => {
      assert.equal(entry.spec.template, 'funnel', `Entry ${idx + 1} template must be funnel`);
      assert.equal(entry.spec.steps.length, 4, `Entry ${idx + 1} must have 4 steps`);
      entry.spec.steps.forEach((step: any, sIdx: number) => {
        assert.ok(step.caption.length <= 75, `Step ${sIdx + 1} caption length <= 75`);
        assert.ok(step.caption.endsWith('.'), `Step ${sIdx + 1} caption must end with .`);
        assert.ok(!/\d/.test(step.caption), `Step ${sIdx + 1} caption must contain zero digits`);
      });
    });
  });

  it('Day 32: Structural integrity, word counts, and pedagogical invariants', () => {
    const day32 = BCOM_OPS_LONG_LESSONS.find((l) => l.day === 32);
    assert.ok(day32, 'Day 32 must be present in BCOM_OPS_LONG_LESSONS');
    assert.equal(day32.coursePrefix, 'bcom_ops');
    assert.equal(day32.minutes, 38);
    assert.equal(day32.parts.length, 5, 'Day 32 must have exactly 5 parts');

    let totalWords = 0;
    day32.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(
        words >= 600,
        `Part ${idx + 1} word count (${words}) must be >= 600 words`
      );
      totalWords += words;

      // Assessment Invariants
      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why && part.check.why.length >= 50, `Part ${idx + 1} why rationale must be detailed`);

      // Code & Output Invariants
      assert.ok(part.code, `Part ${idx + 1} must have a code snippet`);
      assert.ok(part.output, `Part ${idx + 1} must have an output string`);
    });

    assert.ok(totalWords >= 3000, `Day 32 total words (${totalWords}) must be >= 3000 words`);
    assert.ok(day32.projectStep, 'Day 32 must have projectStep');
    assert.ok(day32.projectStep.title, 'Day 32 projectStep must have a title');
    assert.ok(day32.projectStep.steps && day32.projectStep.steps.length >= 3, 'Day 32 projectStep must have steps');
  });

  it('Day 32: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom_ops/day-32.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-32.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'bcom_ops');
    assert.equal(visual.day, 32);
    assert.equal(visual.entries.length, 5, 'Must have 5 visual entries');

    visual.entries.forEach((entry: any, idx: number) => {
      assert.equal(entry.spec.template, 'funnel', `Entry ${idx + 1} template must be funnel`);
      assert.equal(entry.spec.steps.length, 4, `Entry ${idx + 1} must have 4 steps`);
      entry.spec.steps.forEach((step: any, sIdx: number) => {
        assert.ok(step.caption.length <= 75, `Step ${sIdx + 1} caption length <= 75`);
        assert.ok(step.caption.endsWith('.'), `Step ${sIdx + 1} caption must end with .`);
        assert.ok(!/\d/.test(step.caption), `Step ${sIdx + 1} caption must contain zero digits`);
      });
    });
  });

  it('Day 33: Structural integrity, word counts, and pedagogical invariants', () => {
    const day33 = BCOM_OPS_LONG_LESSONS.find((l) => l.day === 33);
    assert.ok(day33, 'Day 33 must be present in BCOM_OPS_LONG_LESSONS');
    assert.equal(day33.coursePrefix, 'bcom_ops');
    assert.equal(day33.minutes, 38);
    assert.equal(day33.parts.length, 5, 'Day 33 must have exactly 5 parts');

    let totalWords = 0;
    day33.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(
        words >= 600,
        `Part ${idx + 1} word count (${words}) must be >= 600 words`
      );
      totalWords += words;

      // Assessment Invariants
      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why && part.check.why.length >= 50, `Part ${idx + 1} why rationale must be detailed`);

      // Code & Output Invariants
      assert.ok(part.code, `Part ${idx + 1} must have a code snippet`);
      assert.ok(part.output, `Part ${idx + 1} must have an output string`);
    });

    assert.ok(totalWords >= 3000, `Day 33 total words (${totalWords}) must be >= 3000 words`);
    assert.ok(day33.projectStep, 'Day 33 must have projectStep');
    assert.ok(day33.projectStep.title, 'Day 33 projectStep must have a title');
    assert.ok(day33.projectStep.steps && day33.projectStep.steps.length >= 3, 'Day 33 projectStep must have steps');
  });

  it('Day 33: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom_ops/day-33.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-33.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'bcom_ops');
    assert.equal(visual.day, 33);
    assert.equal(visual.entries.length, 5, 'Must have 5 visual entries');

    visual.entries.forEach((entry: any, idx: number) => {
      assert.equal(entry.spec.template, 'funnel', `Entry ${idx + 1} template must be funnel`);
      assert.equal(entry.spec.steps.length, 4, `Entry ${idx + 1} must have 4 steps`);
      entry.spec.steps.forEach((step: any, sIdx: number) => {
        assert.ok(step.caption.length <= 75, `Step ${sIdx + 1} caption length <= 75`);
        assert.ok(step.caption.endsWith('.'), `Step ${sIdx + 1} caption must end with .`);
        assert.ok(!/\d/.test(step.caption), `Step ${sIdx + 1} caption must contain zero digits`);
      });
    });
  });
});
