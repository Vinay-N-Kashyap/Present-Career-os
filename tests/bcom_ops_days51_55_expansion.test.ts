import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BCOM_OPS_LONG_LESSONS } from '../src/lib/data/bcomOpsLongLessons';
import fs from 'node:fs';
import path from 'node:path';

describe('B.Com Operations Month 2 (Days 51-55) Expansion Suite', () => {

  it('Day 51: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_OPS_LONG_LESSONS.find((l) => l.day === 51);
    assert.ok(day, 'Day 51 must be present in BCOM_OPS_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_ops');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 51 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
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
      assert.ok(part.check.why, `Part ${idx + 1} check must have a why explanation`);
    });

    assert.ok(
      totalWords >= 3000,
      `Day 51 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 51: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom_ops/day-51.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-51.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'bcom_ops');
    assert.equal(visual.day, 51);
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

  it('Day 52: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_OPS_LONG_LESSONS.find((l) => l.day === 52);
    assert.ok(day, 'Day 52 must be present in BCOM_OPS_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_ops');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 52 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
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
      assert.ok(part.check.why, `Part ${idx + 1} check must have a why explanation`);
    });

    assert.ok(
      totalWords >= 3000,
      `Day 52 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 52: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom_ops/day-52.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-52.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'bcom_ops');
    assert.equal(visual.day, 52);
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

  it('Day 53: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_OPS_LONG_LESSONS.find((l) => l.day === 53);
    assert.ok(day, 'Day 53 must be present in BCOM_OPS_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_ops');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 53 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
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
      assert.ok(part.check.why, `Part ${idx + 1} check must have a why explanation`);
    });

    assert.ok(
      totalWords >= 3000,
      `Day 53 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 53: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom_ops/day-53.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-53.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'bcom_ops');
    assert.equal(visual.day, 53);
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

  it('Day 54: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_OPS_LONG_LESSONS.find((l) => l.day === 54);
    assert.ok(day, 'Day 54 must be present in BCOM_OPS_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_ops');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 54 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
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
      assert.ok(part.check.why, `Part ${idx + 1} check must have a why explanation`);
    });

    assert.ok(
      totalWords >= 3000,
      `Day 54 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 54: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom_ops/day-54.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-54.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'bcom_ops');
    assert.equal(visual.day, 54);
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

  it('Day 55: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_OPS_LONG_LESSONS.find((l) => l.day === 55);
    assert.ok(day, 'Day 55 must be present in BCOM_OPS_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_ops');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 55 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
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
      assert.ok(part.check.why, `Part ${idx + 1} check must have a why explanation`);
    });

    assert.ok(
      totalWords >= 3000,
      `Day 55 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 55: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom_ops/day-55.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-55.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'bcom_ops');
    assert.equal(visual.day, 55);
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
