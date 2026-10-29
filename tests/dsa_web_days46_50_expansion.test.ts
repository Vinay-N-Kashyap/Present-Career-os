import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DSA_WEB_LONG_LESSONS } from '../src/lib/data/dsaWebLongLessons';

describe('DSA Web Month 2 Block 10 (Days 46-50: Advanced Network Flows) Expansion Suite', () => {
  it('Day 46: Structural integrity, word counts, and pedagogical invariants', () => {
    const day46 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 46);
    assert.ok(day46, 'Day 46 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day46.coursePrefix, 'dsa-optim');
    assert.equal(day46.minutes, 38);
    assert.equal(day46.parts.length, 5, 'Day 46 must have exactly 5 parts');

    let totalWords = 0;
    day46.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && Array.isArray(part.say) && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(
        words >= 450,
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

    assert.ok(totalWords >= 3100, `Day 46 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day46.projectStep, 'Day 46 must have projectStep');
    assert.ok(day46.projectStep.title, 'Day 46 projectStep must have a title');
    assert.ok(day46.projectStep.steps && day46.projectStep.steps.length >= 3, 'Day 46 projectStep must have steps');
    assert.ok(day46.summary && day46.summary.length >= 5, 'Day 46 must have summary with at least 5 points');
  });

  it('Day 46: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/dsa-optim/day-46.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-46.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'dsa-optim');
    assert.equal(visual.day, 46);
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

  it('Day 47: Structural integrity, word counts, and pedagogical invariants', () => {
    const day47 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 47);
    assert.ok(day47, 'Day 47 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day47.coursePrefix, 'dsa-optim');
    assert.equal(day47.minutes, 38);
    assert.equal(day47.parts.length, 5, 'Day 47 must have exactly 5 parts');

    let totalWords = 0;
    day47.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && Array.isArray(part.say) && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(
        words >= 450,
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

    assert.ok(totalWords >= 3100, `Day 47 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day47.projectStep, 'Day 47 must have projectStep');
    assert.ok(day47.projectStep.title, 'Day 47 projectStep must have a title');
    assert.ok(day47.projectStep.steps && day47.projectStep.steps.length >= 3, 'Day 47 projectStep must have steps');
    assert.ok(day47.summary && day47.summary.length >= 5, 'Day 47 must have summary with at least 5 points');
  });

  it('Day 47: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/dsa-optim/day-47.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-47.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'dsa-optim');
    assert.equal(visual.day, 47);
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

  it('Day 48: Structural integrity, word counts, and pedagogical invariants', () => {
    const day48 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 48);
    assert.ok(day48, 'Day 48 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day48.coursePrefix, 'dsa-optim');
    assert.equal(day48.minutes, 38);
    assert.equal(day48.parts.length, 5, 'Day 48 must have exactly 5 parts');

    let totalWords = 0;
    day48.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && Array.isArray(part.say) && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(
        words >= 450,
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

    assert.ok(totalWords >= 3100, `Day 48 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day48.projectStep, 'Day 48 must have projectStep');
    assert.ok(day48.projectStep.title, 'Day 48 projectStep must have a title');
    assert.ok(day48.projectStep.steps && day48.projectStep.steps.length >= 3, 'Day 48 projectStep must have steps');
    assert.ok(day48.summary && day48.summary.length >= 5, 'Day 48 must have summary with at least 5 points');
  });

  it('Day 48: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/dsa-optim/day-48.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-48.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'dsa-optim');
    assert.equal(visual.day, 48);
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

  it('Day 49: Structural integrity, word counts, and pedagogical invariants', () => {
    const day49 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 49);
    assert.ok(day49, 'Day 49 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day49.coursePrefix, 'dsa-optim');
    assert.equal(day49.minutes, 38);
    assert.equal(day49.parts.length, 5, 'Day 49 must have exactly 5 parts');

    let totalWords = 0;
    day49.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && Array.isArray(part.say) && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(
        words >= 450,
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

    assert.ok(totalWords >= 3100, `Day 49 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day49.projectStep, 'Day 49 must have projectStep');
    assert.ok(day49.projectStep.title, 'Day 49 projectStep must have a title');
    assert.ok(day49.projectStep.steps && day49.projectStep.steps.length >= 3, 'Day 49 projectStep must have steps');
    assert.ok(day49.summary && day49.summary.length >= 5, 'Day 49 must have summary with at least 5 points');
  });

  it('Day 49: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/dsa-optim/day-49.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-49.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'dsa-optim');
    assert.equal(visual.day, 49);
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

  it('Day 50: Structural integrity, word counts, and pedagogical invariants', () => {
    const day50 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 50);
    assert.ok(day50, 'Day 50 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day50.coursePrefix, 'dsa-optim');
    assert.equal(day50.minutes, 38);
    assert.equal(day50.parts.length, 5, 'Day 50 must have exactly 5 parts');

    let totalWords = 0;
    day50.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && Array.isArray(part.say) && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(
        words >= 450,
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

    assert.ok(totalWords >= 3100, `Day 50 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day50.projectStep, 'Day 50 must have projectStep');
    assert.ok(day50.projectStep.title, 'Day 50 projectStep must have a title');
    assert.ok(day50.projectStep.steps && day50.projectStep.steps.length >= 3, 'Day 50 projectStep must have steps');
    assert.ok(day50.summary && day50.summary.length >= 5, 'Day 50 must have summary with at least 5 points');
  });

  it('Day 50: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/dsa-optim/day-50.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-50.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'dsa-optim');
    assert.equal(visual.day, 50);
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
