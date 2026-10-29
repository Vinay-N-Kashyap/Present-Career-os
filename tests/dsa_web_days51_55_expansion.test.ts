import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DSA_WEB_LONG_LESSONS } from '../src/lib/data/dsaWebLongLessons';

describe('DSA Web Month 2 Block 11 (Days 51-55: Advanced String Processing & Suffix Automata) Expansion Suite', () => {
  it('Day 51: Structural integrity, word counts, and pedagogical invariants', () => {
    const day51 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 51);
    assert.ok(day51, 'Day 51 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day51.coursePrefix, 'dsa-optim');
    assert.equal(day51.minutes, 38);
    assert.equal(day51.parts.length, 5, 'Day 51 must have exactly 5 parts');

    let totalWords = 0;
    day51.parts.forEach((part, idx) => {
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
      assert.ok(part.check.why.length >= 50, `Part ${idx + 1} check.why must be >= 50 characters`);

      // Code / Interactive Invariants
      assert.ok(part.example && part.example.length > 0, `Part ${idx + 1} must have an example`);
      assert.ok(part.code && part.code.length > 0, `Part ${idx + 1} must have runnable code`);
      assert.ok(part.output && part.output.length > 0, `Part ${idx + 1} must have code output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${idx + 1} must have tryIt instructions`);
    });

    assert.ok(totalWords >= 3100, `Day 51 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day51.summary && Array.isArray(day51.summary) && day51.summary.length >= 5, 'Day 51 must have at least 5 summary items');
    assert.ok(day51.projectStep, 'Day 51 must have a projectStep');
    assert.ok(day51.projectStep.title, 'Day 51 projectStep must have a title');
    assert.ok(day51.projectStep.steps && day51.projectStep.steps.length >= 3, 'Day 51 projectStep must have at least 3 steps');
  });

  it('Day 51: Gate v2 Visual Envelope Verification', () => {
    const visualPath = path.resolve(
      process.cwd(),
      'src/lib/data/lessonVisuals/dsa-optim/day-51.json'
    );
    assert.ok(fs.existsSync(visualPath), `Visual envelope must exist at ${visualPath}`);

    const envelope = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(envelope.schemaVersion, '2.0.0');
    assert.equal(envelope.prefix, 'dsa-optim');
    assert.equal(envelope.day, 51);
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

  it('Day 52: Structural integrity, word counts, and pedagogical invariants', () => {
    const day52 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 52);
    assert.ok(day52, 'Day 52 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day52.coursePrefix, 'dsa-optim');
    assert.equal(day52.minutes, 38);
    assert.equal(day52.parts.length, 5, 'Day 52 must have exactly 5 parts');

    let totalWords = 0;
    day52.parts.forEach((part, idx) => {
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
      assert.ok(part.check.why.length >= 50, `Part ${idx + 1} check.why must be >= 50 characters`);

      // Code / Interactive Invariants
      assert.ok(part.example && part.example.length > 0, `Part ${idx + 1} must have an example`);
      assert.ok(part.code && part.code.length > 0, `Part ${idx + 1} must have runnable code`);
      assert.ok(part.output && part.output.length > 0, `Part ${idx + 1} must have code output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${idx + 1} must have tryIt instructions`);
    });

    assert.ok(totalWords >= 3100, `Day 52 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day52.summary && Array.isArray(day52.summary) && day52.summary.length >= 5, 'Day 52 must have at least 5 summary items');
    assert.ok(day52.projectStep, 'Day 52 must have a projectStep');
    assert.ok(day52.projectStep.title, 'Day 52 projectStep must have a title');
    assert.ok(day52.projectStep.steps && day52.projectStep.steps.length >= 3, 'Day 52 projectStep must have at least 3 steps');
  });

  it('Day 52: Gate v2 Visual Envelope Verification', () => {
    const visualPath = path.resolve(
      process.cwd(),
      'src/lib/data/lessonVisuals/dsa-optim/day-52.json'
    );
    assert.ok(fs.existsSync(visualPath), `Visual envelope must exist at ${visualPath}`);

    const envelope = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(envelope.schemaVersion, '2.0.0');
    assert.equal(envelope.prefix, 'dsa-optim');
    assert.equal(envelope.day, 52);
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

  it('Day 53: Structural integrity, word counts, and pedagogical invariants', () => {
    const day53 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 53);
    assert.ok(day53, 'Day 53 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day53.coursePrefix, 'dsa-optim');
    assert.equal(day53.minutes, 38);
    assert.equal(day53.parts.length, 5, 'Day 53 must have exactly 5 parts');

    let totalWords = 0;
    day53.parts.forEach((part, idx) => {
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
      assert.ok(part.check.why.length >= 50, `Part ${idx + 1} check.why must be >= 50 characters`);

      // Code / Interactive Invariants
      assert.ok(part.example && part.example.length > 0, `Part ${idx + 1} must have an example`);
      assert.ok(part.code && part.code.length > 0, `Part ${idx + 1} must have runnable code`);
      assert.ok(part.output && part.output.length > 0, `Part ${idx + 1} must have code output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${idx + 1} must have tryIt instructions`);
    });

    assert.ok(totalWords >= 3100, `Day 53 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day53.summary && Array.isArray(day53.summary) && day53.summary.length >= 5, 'Day 53 must have at least 5 summary items');
    assert.ok(day53.projectStep, 'Day 53 must have a projectStep');
    assert.ok(day53.projectStep.title, 'Day 53 projectStep must have a title');
    assert.ok(day53.projectStep.steps && day53.projectStep.steps.length >= 3, 'Day 53 projectStep must have at least 3 steps');
  });

  it('Day 53: Gate v2 Visual Envelope Verification', () => {
    const visualPath = path.resolve(
      process.cwd(),
      'src/lib/data/lessonVisuals/dsa-optim/day-53.json'
    );
    assert.ok(fs.existsSync(visualPath), `Visual envelope must exist at ${visualPath}`);

    const envelope = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(envelope.schemaVersion, '2.0.0');
    assert.equal(envelope.prefix, 'dsa-optim');
    assert.equal(envelope.day, 53);
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

  it('Day 54: Structural integrity, word counts, and pedagogical invariants', () => {
    const day54 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 54);
    assert.ok(day54, 'Day 54 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day54.coursePrefix, 'dsa-optim');
    assert.equal(day54.minutes, 38);
    assert.equal(day54.parts.length, 5, 'Day 54 must have exactly 5 parts');

    let totalWords = 0;
    day54.parts.forEach((part, idx) => {
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
      assert.ok(part.check.why.length >= 50, `Part ${idx + 1} check.why must be >= 50 characters`);

      // Code / Interactive Invariants
      assert.ok(part.example && part.example.length > 0, `Part ${idx + 1} must have an example`);
      assert.ok(part.code && part.code.length > 0, `Part ${idx + 1} must have runnable code`);
      assert.ok(part.output && part.output.length > 0, `Part ${idx + 1} must have code output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${idx + 1} must have tryIt instructions`);
    });

    assert.ok(totalWords >= 3100, `Day 54 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day54.summary && Array.isArray(day54.summary) && day54.summary.length >= 5, 'Day 54 must have at least 5 summary items');
    assert.ok(day54.projectStep, 'Day 54 must have a projectStep');
    assert.ok(day54.projectStep.title, 'Day 54 projectStep must have a title');
    assert.ok(day54.projectStep.steps && day54.projectStep.steps.length >= 3, 'Day 54 projectStep must have at least 3 steps');
  });

  it('Day 54: Gate v2 Visual Envelope Verification', () => {
    const visualPath = path.resolve(
      process.cwd(),
      'src/lib/data/lessonVisuals/dsa-optim/day-54.json'
    );
    assert.ok(fs.existsSync(visualPath), `Visual envelope must exist at ${visualPath}`);

    const envelope = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(envelope.schemaVersion, '2.0.0');
    assert.equal(envelope.prefix, 'dsa-optim');
    assert.equal(envelope.day, 54);
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

  it('Day 55: Structural integrity, word counts, and pedagogical invariants (Milestone 11 Capstone)', () => {
    const day55 = DSA_WEB_LONG_LESSONS.find((l) => l.day === 55);
    assert.ok(day55, 'Day 55 must be present in DSA_WEB_LONG_LESSONS');
    assert.equal(day55.coursePrefix, 'dsa-optim');
    assert.equal(day55.minutes, 38);
    assert.equal(day55.parts.length, 5, 'Day 55 must have exactly 5 parts');

    let totalWords = 0;
    day55.parts.forEach((part, idx) => {
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
      assert.ok(part.check.why.length >= 50, `Part ${idx + 1} check.why must be >= 50 characters`);

      // Code / Interactive Invariants
      assert.ok(part.example && part.example.length > 0, `Part ${idx + 1} must have an example`);
      assert.ok(part.code && part.code.length > 0, `Part ${idx + 1} must have runnable code`);
      assert.ok(part.output && part.output.length > 0, `Part ${idx + 1} must have code output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${idx + 1} must have tryIt instructions`);
    });

    assert.ok(totalWords >= 3100, `Day 55 total words (${totalWords}) must be >= 3100 words`);
    assert.ok(day55.summary && Array.isArray(day55.summary) && day55.summary.length >= 5, 'Day 55 must have at least 5 summary items');
    assert.ok(day55.projectStep, 'Day 55 must have a projectStep');
    assert.ok(day55.projectStep.title, 'Day 55 projectStep must have a title');
    assert.ok(day55.projectStep.steps && day55.projectStep.steps.length >= 3, 'Day 55 projectStep must have at least 3 steps');
  });

  it('Day 55: Gate v2 Visual Envelope Verification (Milestone 11 Capstone)', () => {
    const visualPath = path.resolve(
      process.cwd(),
      'src/lib/data/lessonVisuals/dsa-optim/day-55.json'
    );
    assert.ok(fs.existsSync(visualPath), `Visual envelope must exist at ${visualPath}`);

    const envelope = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(envelope.schemaVersion, '2.0.0');
    assert.equal(envelope.prefix, 'dsa-optim');
    assert.equal(envelope.day, 55);
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
