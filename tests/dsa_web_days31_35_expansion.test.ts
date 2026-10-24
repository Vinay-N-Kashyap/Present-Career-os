import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DSA_WEB_LONG_LESSONS } from '../src/lib/data/dsaWebLongLessons';
import fs from 'node:fs';
import path from 'node:path';

describe('DSA Web Month 2 (Days 31-35) Expansion Suite', () => {
  it('Day 31: Structural integrity, word counts, and pedagogical invariants', () => {
    const day31 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 31);
    assert.ok(day31, 'Day 31 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day31.coursePrefix, 'dsa-optim');
    assert.equal(day31.minutes, 38);
    assert.equal(day31.parts.length, 5, 'Day 31 must have exactly 5 parts');

    let totalWords = 0;
    day31.parts.forEach((part, idx) => {
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

    assert.ok(totalWords >= 3100, `Day 31 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day31.projectStep, 'Day 31 must have projectStep');
    assert.ok(day31.projectStep.title, 'Day 31 projectStep must have a title');
    assert.ok(day31.projectStep.steps && day31.projectStep.steps.length >= 3, 'Day 31 projectStep must have steps');
    assert.ok(day31.summary && day31.summary.length >= 5, 'Day 31 must have summary with at least 5 points');
  });

  it('Day 31: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/dsa-optim/day-31.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-31.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'dsa-optim');
    assert.equal(visual.day, 31);
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

  it('Day 32: Structural integrity, word counts, and pedagogical invariants', () => {
    const day32 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 32);
    assert.ok(day32, 'Day 32 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day32.coursePrefix, 'dsa-optim');
    assert.equal(day32.minutes, 38);
    assert.equal(day32.parts.length, 5, 'Day 32 must have exactly 5 parts');

    let totalWords = 0;
    day32.parts.forEach((part, idx) => {
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

    assert.ok(totalWords >= 3100, `Day 32 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day32.projectStep, 'Day 32 must have projectStep');
    assert.ok(day32.projectStep.title, 'Day 32 projectStep must have a title');
    assert.ok(day32.projectStep.steps && day32.projectStep.steps.length >= 3, 'Day 32 projectStep must have steps');
    assert.ok(day32.summary && day32.summary.length >= 5, 'Day 32 must have summary with at least 5 points');
  });

  it('Day 32: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/dsa-optim/day-32.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-32.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'dsa-optim');
    assert.equal(visual.day, 32);
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
