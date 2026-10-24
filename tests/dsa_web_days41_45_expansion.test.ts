import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DSA_WEB_LONG_LESSONS } from '../src/lib/data/dsaWebLongLessons';

describe('DSA Web Month 2 Block 9 (Days 41-45: Tree DP & Rerooting) Expansion Suite', () => {
  it('Day 41: Structural integrity, word counts, and pedagogical invariants', () => {
    const day41 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 41);
    assert.ok(day41, 'Day 41 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day41.coursePrefix, 'dsa-optim');
    assert.equal(day41.minutes, 38);
    assert.equal(day41.parts.length, 5, 'Day 41 must have exactly 5 parts');

    let totalWords = 0;
    day41.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && Array.isArray(part.say) && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
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

    assert.ok(totalWords >= 3100, `Day 41 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day41.projectStep, 'Day 41 must have projectStep');
    assert.ok(day41.projectStep.title, 'Day 41 projectStep must have a title');
    assert.ok(day41.projectStep.steps && day41.projectStep.steps.length >= 3, 'Day 41 projectStep must have steps');
    assert.ok(day41.summary && day41.summary.length >= 5, 'Day 41 must have summary with at least 5 points');
  });

  it('Day 41: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/dsa-optim/day-41.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-41.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'dsa-optim');
    assert.equal(visual.day, 41);
    assert.equal(visual.entries.length, 5, 'Must have 5 visual entries');

    visual.entries.forEach((entry: any, idx: number) => {
      assert.equal(entry.spec.template, 'table', `Entry ${idx + 1} template must be table`);
      assert.equal(entry.spec.steps.length, 4, `Entry ${idx + 1} must have 4 steps`);
      entry.spec.steps.forEach((step: any, sIdx: number) => {
        assert.ok(step.caption.length <= 75, `Step ${sIdx + 1} caption length <= 75`);
        assert.ok(step.caption.endsWith('.'), `Step ${sIdx + 1} caption must end with .`);
        assert.ok(!/\d/.test(step.caption), `Step ${sIdx + 1} caption must contain zero digits`);
      });
    });
  });

  it('Day 42: Structural integrity, word counts, and pedagogical invariants', () => {
    const day42 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 42);
    assert.ok(day42, 'Day 42 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day42.coursePrefix, 'dsa-optim');
    assert.equal(day42.minutes, 38);
    assert.equal(day42.parts.length, 5, 'Day 42 must have exactly 5 parts');

    let totalWords = 0;
    day42.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && Array.isArray(part.say) && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
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

    assert.ok(totalWords >= 3100, `Day 42 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day42.projectStep, 'Day 42 must have projectStep');
    assert.ok(day42.projectStep.title, 'Day 42 projectStep must have a title');
    assert.ok(day42.projectStep.steps && day42.projectStep.steps.length >= 3, 'Day 42 projectStep must have steps');
    assert.ok(day42.summary && day42.summary.length >= 5, 'Day 42 must have summary with at least 5 points');
  });

  it('Day 42: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/dsa-optim/day-42.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-42.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'dsa-optim');
    assert.equal(visual.day, 42);
    assert.equal(visual.entries.length, 5, 'Must have 5 visual entries');

    visual.entries.forEach((entry: any, idx: number) => {
      assert.equal(entry.spec.template, 'table', `Entry ${idx + 1} template must be table`);
      assert.equal(entry.spec.steps.length, 4, `Entry ${idx + 1} must have 4 steps`);
      entry.spec.steps.forEach((step: any, sIdx: number) => {
        assert.ok(step.caption.length <= 75, `Step ${sIdx + 1} caption length <= 75`);
        assert.ok(step.caption.endsWith('.'), `Step ${sIdx + 1} caption must end with .`);
        assert.ok(!/\d/.test(step.caption), `Step ${sIdx + 1} caption must contain zero digits`);
      });
    });
  });

  it('Day 43: Structural integrity, word counts, and pedagogical invariants', () => {
    const day43 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 43);
    assert.ok(day43, 'Day 43 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day43.coursePrefix, 'dsa-optim');
    assert.equal(day43.minutes, 38);
    assert.equal(day43.parts.length, 5, 'Day 43 must have exactly 5 parts');

    let totalWords = 0;
    day43.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && Array.isArray(part.say) && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
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

    assert.ok(totalWords >= 3100, `Day 43 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day43.projectStep, 'Day 43 must have projectStep');
    assert.ok(day43.projectStep.title, 'Day 43 projectStep must have a title');
    assert.ok(day43.projectStep.steps && day43.projectStep.steps.length >= 3, 'Day 43 projectStep must have steps');
    assert.ok(day43.summary && day43.summary.length >= 5, 'Day 43 must have summary with at least 5 points');
  });

  it('Day 43: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/dsa-optim/day-43.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-43.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'dsa-optim');
    assert.equal(visual.day, 43);
    assert.equal(visual.entries.length, 5, 'Must have 5 visual entries');

    visual.entries.forEach((entry: any, idx: number) => {
      assert.equal(entry.spec.template, 'table', `Entry ${idx + 1} template must be table`);
      assert.equal(entry.spec.steps.length, 4, `Entry ${idx + 1} must have 4 steps`);
      entry.spec.steps.forEach((step: any, sIdx: number) => {
        assert.ok(step.caption.length <= 75, `Step ${sIdx + 1} caption length <= 75`);
        assert.ok(step.caption.endsWith('.'), `Step ${sIdx + 1} caption must end with .`);
        assert.ok(!/\d/.test(step.caption), `Step ${sIdx + 1} caption must contain zero digits`);
      });
    });
  });
});
