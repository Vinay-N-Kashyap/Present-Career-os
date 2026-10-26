import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DSA_WEB_LONG_LESSONS } from '../src/lib/data/dsaWebLongLessons';

describe('DSA Web Month 2 Block 12 (Days 56-60: Computational Geometry, Randomized Algorithms & Grand Finale Capstone) Expansion Suite', () => {
  it('Day 56: Structural integrity, word counts, and pedagogical invariants', () => {
    const day56 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 56);
    assert.ok(day56, 'Day 56 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day56.coursePrefix, 'dsa-optim');
    assert.equal(day56.minutes, 38);
    assert.equal(day56.parts.length, 5, 'Day 56 must have exactly 5 parts');

    let totalWords = 0;
    day56.parts.forEach((part, idx) => {
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
      assert.ok(part.check.why.length >= 50, `Part ${idx + 1} check.why must be >= 50 characters`);

      // Code / Interactive Invariants
      assert.ok(part.example && part.example.length > 0, `Part ${idx + 1} must have an example`);
      assert.ok(part.code && part.code.length > 0, `Part ${idx + 1} must have runnable code`);
      assert.ok(part.output && part.output.length > 0, `Part ${idx + 1} must have code output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${idx + 1} must have tryIt instructions`);
    });

    assert.ok(totalWords >= 3100, `Day 56 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day56.summary && Array.isArray(day56.summary) && day56.summary.length >= 5, 'Day 56 must have at least 5 summary items');
    assert.ok(day56.projectStep, 'Day 56 must have a projectStep');
    assert.ok(day56.projectStep.title, 'Day 56 projectStep must have a title');
    assert.ok(day56.projectStep.steps && day56.projectStep.steps.length >= 3, 'Day 56 projectStep must have at least 3 steps');
  });

  it('Day 56: Gate v2 Visual Envelope Verification', () => {
    const visualPath = path.resolve(
      process.cwd(),
      'src/lib/data/lessonVisuals/dsa-optim/day-56.json'
    );
    assert.ok(fs.existsSync(visualPath), `Visual envelope must exist at ${visualPath}`);

    const envelope = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(envelope.schemaVersion, '2.0.0');
    assert.equal(envelope.prefix, 'dsa-optim');
    assert.equal(envelope.day, 56);
    assert.equal(envelope.entries.length, 5, 'Must have 5 entries corresponding to the 5 parts');

    envelope.entries.forEach((entry: any, idx: number) => {
      assert.ok(entry.partTitle, `Entry ${idx + 1} must have partTitle`);
      assert.ok(entry.codeHash, `Entry ${idx + 1} must have codeHash`);
      assert.equal(entry.spec.template, 'table', `Entry ${idx + 1} template must be table`);
      assert.ok(entry.spec.title.endsWith('.'), `Entry ${idx + 1} title must end with period`);
      assert.ok(!/[0-9]/.test(entry.spec.title), `Entry ${idx + 1} title must not contain digits`);
      assert.equal(entry.spec.steps.length, 4, `Entry ${idx + 1} must have 4 steps`);

      entry.spec.steps.forEach((step: any, stepIdx: number) => {
        assert.ok(step.caption.length <= 75, `Entry ${idx + 1} step ${stepIdx + 1} caption too long (${step.caption.length})`);
        assert.ok(step.caption.endsWith('.'), `Entry ${idx + 1} step ${stepIdx + 1} caption must end with period`);
        assert.ok(!/[0-9]/.test(step.caption), `Entry ${idx + 1} step ${stepIdx + 1} caption must not contain digits`);
        assert.ok(Array.isArray(step.rows) && step.rows.length >= 2, `Entry ${idx + 1} step ${stepIdx + 1} must have >= 2 rows`);
      });
    });
  });

  it('Day 57: Structural integrity, word counts, and pedagogical invariants', () => {
    const day57 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 57);
    assert.ok(day57, 'Day 57 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day57.coursePrefix, 'dsa-optim');
    assert.equal(day57.minutes, 38);
    assert.equal(day57.parts.length, 5, 'Day 57 must have exactly 5 parts');

    let totalWords = 0;
    day57.parts.forEach((part, idx) => {
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
      assert.ok(part.check.why.length >= 50, `Part ${idx + 1} check.why must be >= 50 characters`);

      // Code / Interactive Invariants
      assert.ok(part.example && part.example.length > 0, `Part ${idx + 1} must have an example`);
      assert.ok(part.code && part.code.length > 0, `Part ${idx + 1} must have runnable code`);
      assert.ok(part.output && part.output.length > 0, `Part ${idx + 1} must have code output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${idx + 1} must have tryIt instructions`);
    });

    assert.ok(totalWords >= 3100, `Day 57 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day57.summary && Array.isArray(day57.summary) && day57.summary.length >= 5, 'Day 57 must have at least 5 summary items');
    assert.ok(day57.projectStep, 'Day 57 must have a projectStep');
    assert.ok(day57.projectStep.title, 'Day 57 projectStep must have a title');
    assert.ok(day57.projectStep.steps && day57.projectStep.steps.length >= 3, 'Day 57 projectStep must have at least 3 steps');
  });

  it('Day 57: Gate v2 Visual Envelope Verification', () => {
    const visualPath = path.resolve(
      process.cwd(),
      'src/lib/data/lessonVisuals/dsa-optim/day-57.json'
    );
    assert.ok(fs.existsSync(visualPath), `Visual envelope must exist at ${visualPath}`);

    const envelope = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(envelope.schemaVersion, '2.0.0');
    assert.equal(envelope.prefix, 'dsa-optim');
    assert.equal(envelope.day, 57);
    assert.equal(envelope.entries.length, 5, 'Must have 5 entries corresponding to the 5 parts');

    envelope.entries.forEach((entry: any, idx: number) => {
      assert.ok(entry.partTitle, `Entry ${idx + 1} must have partTitle`);
      assert.ok(entry.codeHash, `Entry ${idx + 1} must have codeHash`);
      assert.equal(entry.spec.template, 'table', `Entry ${idx + 1} template must be table`);
      assert.ok(entry.spec.title.endsWith('.'), `Entry ${idx + 1} title must end with period`);
      assert.ok(!/[0-9]/.test(entry.spec.title), `Entry ${idx + 1} title must not contain digits`);
      assert.equal(entry.spec.steps.length, 4, `Entry ${idx + 1} must have 4 steps`);

      entry.spec.steps.forEach((step: any, stepIdx: number) => {
        assert.ok(step.caption.length <= 75, `Entry ${idx + 1} step ${stepIdx + 1} caption too long (${step.caption.length})`);
        assert.ok(step.caption.endsWith('.'), `Entry ${idx + 1} step ${stepIdx + 1} caption must end with period`);
        assert.ok(!/[0-9]/.test(step.caption), `Entry ${idx + 1} step ${stepIdx + 1} caption must not contain digits`);
        assert.ok(Array.isArray(step.rows) && step.rows.length >= 2, `Entry ${idx + 1} step ${stepIdx + 1} must have >= 2 rows`);
      });
    });
  });

  it('Day 58: Structural integrity, word counts, and pedagogical invariants', () => {
    const day58 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 58);
    assert.ok(day58, 'Day 58 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day58.coursePrefix, 'dsa-optim');
    assert.equal(day58.minutes, 38);
    assert.equal(day58.parts.length, 5, 'Day 58 must have exactly 5 parts');

    let totalWords = 0;
    day58.parts.forEach((part, idx) => {
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
      assert.ok(part.check.why.length >= 50, `Part ${idx + 1} check.why must be >= 50 characters`);

      // Code / Interactive Invariants
      assert.ok(part.example && part.example.length > 0, `Part ${idx + 1} must have an example`);
      assert.ok(part.code && part.code.length > 0, `Part ${idx + 1} must have runnable code`);
      assert.ok(part.output && part.output.length > 0, `Part ${idx + 1} must have code output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${idx + 1} must have tryIt instructions`);
    });

    assert.ok(totalWords >= 3100, `Day 58 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day58.summary && Array.isArray(day58.summary) && day58.summary.length >= 5, 'Day 58 must have at least 5 summary items');
    assert.ok(day58.projectStep, 'Day 58 must have a projectStep');
    assert.ok(day58.projectStep.title, 'Day 58 projectStep must have a title');
    assert.ok(day58.projectStep.steps && day58.projectStep.steps.length >= 3, 'Day 58 projectStep must have at least 3 steps');
  });

  it('Day 58: Gate v2 Visual Envelope Verification', () => {
    const visualPath = path.resolve(
      process.cwd(),
      'src/lib/data/lessonVisuals/dsa-optim/day-58.json'
    );
    assert.ok(fs.existsSync(visualPath), `Visual envelope must exist at ${visualPath}`);

    const envelope = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(envelope.schemaVersion, '2.0.0');
    assert.equal(envelope.prefix, 'dsa-optim');
    assert.equal(envelope.day, 58);
    assert.equal(envelope.entries.length, 5, 'Must have 5 entries corresponding to the 5 parts');

    envelope.entries.forEach((entry: any, idx: number) => {
      assert.ok(entry.partTitle, `Entry ${idx + 1} must have partTitle`);
      assert.ok(entry.codeHash, `Entry ${idx + 1} must have codeHash`);
      assert.equal(entry.spec.template, 'table', `Entry ${idx + 1} template must be table`);
      assert.ok(entry.spec.title.endsWith('.'), `Entry ${idx + 1} title must end with period`);
      assert.ok(!/[0-9]/.test(entry.spec.title), `Entry ${idx + 1} title must not contain digits`);
      assert.equal(entry.spec.steps.length, 4, `Entry ${idx + 1} must have 4 steps`);

      entry.spec.steps.forEach((step: any, stepIdx: number) => {
        assert.ok(step.caption.length <= 75, `Entry ${idx + 1} step ${stepIdx + 1} caption too long (${step.caption.length})`);
        assert.ok(step.caption.endsWith('.'), `Entry ${idx + 1} step ${stepIdx + 1} caption must end with period`);
        assert.ok(!/[0-9]/.test(step.caption), `Entry ${idx + 1} step ${stepIdx + 1} caption must not contain digits`);
        assert.ok(Array.isArray(step.rows) && step.rows.length >= 2, `Entry ${idx + 1} step ${stepIdx + 1} must have >= 2 rows`);
      });
    });
  });

  it('Day 59: Structural integrity, word counts, and pedagogical invariants', () => {
    const day59 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 59);
    assert.ok(day59, 'Day 59 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day59.coursePrefix, 'dsa-optim');
    assert.equal(day59.minutes, 38);
    assert.equal(day59.parts.length, 5, 'Day 59 must have exactly 5 parts');

    let totalWords = 0;
    day59.parts.forEach((part, idx) => {
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
      assert.ok(part.check.why.length >= 50, `Part ${idx + 1} check.why must be >= 50 characters`);

      // Code / Interactive Invariants
      assert.ok(part.example && part.example.length > 0, `Part ${idx + 1} must have an example`);
      assert.ok(part.code && part.code.length > 0, `Part ${idx + 1} must have runnable code`);
      assert.ok(part.output && part.output.length > 0, `Part ${idx + 1} must have code output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${idx + 1} must have tryIt instructions`);
    });

    assert.ok(totalWords >= 3100, `Day 59 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day59.summary && Array.isArray(day59.summary) && day59.summary.length >= 5, 'Day 59 must have at least 5 summary items');
    assert.ok(day59.projectStep, 'Day 59 must have a projectStep');
    assert.ok(day59.projectStep.title, 'Day 59 projectStep must have a title');
    assert.ok(day59.projectStep.steps && day59.projectStep.steps.length >= 3, 'Day 59 projectStep must have at least 3 steps');
  });

  it('Day 59: Gate v2 Visual Envelope Verification', () => {
    const visualPath = path.resolve(
      process.cwd(),
      'src/lib/data/lessonVisuals/dsa-optim/day-59.json'
    );
    assert.ok(fs.existsSync(visualPath), `Visual envelope must exist at ${visualPath}`);

    const envelope = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(envelope.schemaVersion, '2.0.0');
    assert.equal(envelope.prefix, 'dsa-optim');
    assert.equal(envelope.day, 59);
    assert.equal(envelope.entries.length, 5, 'Must have 5 entries corresponding to the 5 parts');

    envelope.entries.forEach((entry: any, idx: number) => {
      assert.ok(entry.partTitle, `Entry ${idx + 1} must have partTitle`);
      assert.ok(entry.codeHash, `Entry ${idx + 1} must have codeHash`);
      assert.equal(entry.spec.template, 'table', `Entry ${idx + 1} template must be table`);
      assert.ok(entry.spec.title.endsWith('.'), `Entry ${idx + 1} title must end with period`);
      assert.ok(!/[0-9]/.test(entry.spec.title), `Entry ${idx + 1} title must not contain digits`);
      assert.equal(entry.spec.steps.length, 4, `Entry ${idx + 1} must have 4 steps`);

      entry.spec.steps.forEach((step: any, stepIdx: number) => {
        assert.ok(step.caption.length <= 75, `Entry ${idx + 1} step ${stepIdx + 1} caption too long (${step.caption.length})`);
        assert.ok(step.caption.endsWith('.'), `Entry ${idx + 1} step ${stepIdx + 1} caption must end with period`);
        assert.ok(!/[0-9]/.test(step.caption), `Entry ${idx + 1} step ${stepIdx + 1} caption must not contain digits`);
        assert.ok(Array.isArray(step.rows) && step.rows.length >= 2, `Entry ${idx + 1} step ${stepIdx + 1} must have >= 2 rows`);
      });
    });
  });

  it('Day 60: Structural integrity, word counts, and pedagogical invariants (Milestone 12 Grand Finale Capstone)', () => {
    const day60 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 60);
    assert.ok(day60, 'Day 60 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day60.coursePrefix, 'dsa-optim');
    assert.equal(day60.minutes, 38);
    assert.equal(day60.parts.length, 5, 'Day 60 must have exactly 5 parts');

    let totalWords = 0;
    day60.parts.forEach((part, idx) => {
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
      assert.ok(part.check.why.length >= 50, `Part ${idx + 1} check.why must be >= 50 characters`);

      // Code / Interactive Invariants
      assert.ok(part.example && part.example.length > 0, `Part ${idx + 1} must have an example`);
      assert.ok(part.code && part.code.length > 0, `Part ${idx + 1} must have runnable code`);
      assert.ok(part.output && part.output.length > 0, `Part ${idx + 1} must have code output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${idx + 1} must have tryIt instructions`);
    });

    assert.ok(totalWords >= 3100, `Day 60 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day60.summary && Array.isArray(day60.summary) && day60.summary.length >= 5, 'Day 60 must have at least 5 summary items');
    assert.ok(day60.projectStep, 'Day 60 must have a projectStep');
    assert.ok(day60.projectStep.title, 'Day 60 projectStep must have a title');
    assert.ok(day60.projectStep.steps && day60.projectStep.steps.length >= 3, 'Day 60 projectStep must have at least 3 steps');
  });

  it('Day 60: Gate v2 Visual Envelope Verification', () => {
    const visualPath = path.resolve(
      process.cwd(),
      'src/lib/data/lessonVisuals/dsa-optim/day-60.json'
    );
    assert.ok(fs.existsSync(visualPath), `Visual envelope must exist at ${visualPath}`);

    const envelope = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(envelope.schemaVersion, '2.0.0');
    assert.equal(envelope.prefix, 'dsa-optim');
    assert.equal(envelope.day, 60);
    assert.equal(envelope.entries.length, 5, 'Must have 5 entries corresponding to the 5 parts');

    envelope.entries.forEach((entry: any, idx: number) => {
      assert.ok(entry.partTitle, `Entry ${idx + 1} must have partTitle`);
      assert.ok(entry.codeHash, `Entry ${idx + 1} must have codeHash`);
      assert.equal(entry.spec.template, 'table', `Entry ${idx + 1} template must be table`);
      assert.ok(entry.spec.title.endsWith('.'), `Entry ${idx + 1} title must end with period`);
      assert.ok(!/[0-9]/.test(entry.spec.title), `Entry ${idx + 1} title must not contain digits`);
      assert.equal(entry.spec.steps.length, 4, `Entry ${idx + 1} must have 4 steps`);

      entry.spec.steps.forEach((step: any, stepIdx: number) => {
        assert.ok(step.caption.length <= 75, `Entry ${idx + 1} step ${stepIdx + 1} caption too long (${step.caption.length})`);
        assert.ok(step.caption.endsWith('.'), `Entry ${idx + 1} step ${stepIdx + 1} caption must end with period`);
        assert.ok(!/[0-9]/.test(step.caption), `Entry ${idx + 1} step ${stepIdx + 1} caption must not contain digits`);
        assert.ok(Array.isArray(step.rows) && step.rows.length >= 2, `Entry ${idx + 1} step ${stepIdx + 1} must have >= 2 rows`);
      });
    });
  });

});
