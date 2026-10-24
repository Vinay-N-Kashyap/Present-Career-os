import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BCOM_OPS_LONG_LESSONS } from '../src/lib/data/bcomOpsLongLessons';
import fs from 'node:fs';
import path from 'node:path';

describe('B.Com Operations Month 2 (Days 36-40) Expansion Suite', () => {
  it('Day 36: Structural integrity, word counts, and pedagogical invariants', () => {
    const day36 = BCOM_OPS_LONG_LESSONS.find((l) => l.day === 36);
    assert.ok(day36, 'Day 36 must be present in BCOM_OPS_LONG_LESSONS');
    assert.equal(day36.coursePrefix, 'bcom_ops');
    assert.equal(day36.minutes, 38);
    assert.equal(day36.parts.length, 5, 'Day 36 must have exactly 5 parts');

    let totalWords = 0;
    day36.parts.forEach((part, idx) => {
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

    assert.ok(totalWords >= 3000, `Day 36 total words (${totalWords}) must be >= 3000 words`);
    assert.ok(day36.projectStep, 'Day 36 must have projectStep');
    assert.ok(day36.projectStep.title, 'Day 36 projectStep must have a title');
    assert.ok(day36.projectStep.steps && day36.projectStep.steps.length >= 3, 'Day 36 projectStep must have steps');
  });

  it('Day 36: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom_ops/day-36.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-36.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'bcom_ops');
    assert.equal(visual.day, 36);
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

  it('Day 37: Structural integrity, word counts, and pedagogical invariants', () => {
    const day37 = BCOM_OPS_LONG_LESSONS.find((l) => l.day === 37);
    assert.ok(day37, 'Day 37 must be present in BCOM_OPS_LONG_LESSONS');
    assert.equal(day37.coursePrefix, 'bcom_ops');
    assert.equal(day37.minutes, 38);
    assert.equal(day37.parts.length, 5, 'Day 37 must have exactly 5 parts');

    let totalWords = 0;
    day37.parts.forEach((part, idx) => {
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

    assert.ok(totalWords >= 3000, `Day 37 total words (${totalWords}) must be >= 3000 words`);
    assert.ok(day37.projectStep, 'Day 37 must have projectStep');
    assert.ok(day37.projectStep.title, 'Day 37 projectStep must have a title');
    assert.ok(day37.projectStep.steps && day37.projectStep.steps.length >= 3, 'Day 37 projectStep must have steps');
  });

  it('Day 37: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom_ops/day-37.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-37.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'bcom_ops');
    assert.equal(visual.day, 37);
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

  it('Day 38: Structural integrity, word counts, and pedagogical invariants', () => {
    const day38 = BCOM_OPS_LONG_LESSONS.find((l) => l.day === 38);
    assert.ok(day38, 'Day 38 must be present in BCOM_OPS_LONG_LESSONS');
    assert.equal(day38.coursePrefix, 'bcom_ops');
    assert.equal(day38.minutes, 38);
    assert.equal(day38.parts.length, 5, 'Day 38 must have exactly 5 parts');

    let totalWords = 0;
    day38.parts.forEach((part, idx) => {
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

    assert.ok(totalWords >= 3000, `Day 38 total words (${totalWords}) must be >= 3000 words`);
    assert.ok(day38.projectStep, 'Day 38 must have projectStep');
    assert.ok(day38.projectStep.title, 'Day 38 projectStep must have a title');
    assert.ok(day38.projectStep.steps && day38.projectStep.steps.length >= 3, 'Day 38 projectStep must have steps');
  });

  it('Day 38: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom_ops/day-38.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-38.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'bcom_ops');
    assert.equal(visual.day, 38);
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
