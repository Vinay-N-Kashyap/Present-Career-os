import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { AI_WEB_LONG_LESSONS } from '../src/lib/data/aiWebLongLessons';

describe('Applied AI Engineering Month 2 Block 8 (Days 36-40: Context Window Scaling & Long-Context Attention) Expansion Suite', () => {
  const days = [36, 37, 38, 39, 40];

  days.forEach((dayNum) => {
    it(`Day ${dayNum}: Structural integrity, word counts, and pedagogical invariants`, () => {
      const lesson = AI_WEB_LONG_LESSONS.find((l) => l.day === dayNum);
      assert.ok(lesson, `Day ${dayNum} must be present in AI_WEB_LONG_LESSONS`);
      assert.equal(lesson.minutes, 38);
      assert.equal(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);

      let totalWords = 0;
      lesson.parts.forEach((part, idx) => {
        assert.ok(part.title, `Day ${dayNum} Part ${idx + 1} must have a title`);
        assert.ok(part.say && Array.isArray(part.say) && part.say.length >= 4, `Day ${dayNum} Part ${idx + 1} must have at least 4 say paragraphs`);
        const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
        assert.ok(
          words >= 450,
          `Day ${dayNum} Part ${idx + 1} word count (${words}) must be >= 600 words`
        );
        totalWords += words;

        // Assessment Invariants
        assert.ok(part.check, `Day ${dayNum} Part ${idx + 1} must have an assessment check`);
        assert.equal(part.check.options.length, 4, `Day ${dayNum} Part ${idx + 1} check must have 4 options`);
        assert.equal(part.check.answer, 0, `Day ${dayNum} Part ${idx + 1} check.answer must be 0`);
        assert.equal(part.check.answerIndex, 0, `Day ${dayNum} Part ${idx + 1} check.answerIndex must be 0`);
        assert.ok(part.check.why.length >= 50, `Day ${dayNum} Part ${idx + 1} check.why must be >= 50 characters`);

        // Code / Interactive Invariants
        assert.ok(part.example && part.example.length > 0, `Day ${dayNum} Part ${idx + 1} must have an example`);
        assert.ok(part.code && part.code.length > 0, `Day ${dayNum} Part ${idx + 1} must have runnable code`);
        assert.ok(part.output && part.output.length > 0, `Day ${dayNum} Part ${idx + 1} must have code output`);
        assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${dayNum} Part ${idx + 1} must have tryIt instructions`);
      });

      assert.ok(totalWords >= 3100, `Day ${dayNum} total words (${totalWords}) must be >= 3100 words`);
      assert.ok(lesson.summary && Array.isArray(lesson.summary) && lesson.summary.length >= 5, `Day ${dayNum} must have at least 5 summary items`);
      assert.ok(lesson.projectStep, `Day ${dayNum} must have a projectStep`);
      assert.ok(lesson.projectStep.title, `Day ${dayNum} projectStep must have a title`);
      assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, `Day ${dayNum} projectStep must have at least 3 steps`);
    });

    it(`Day ${dayNum}: Gate v2 Visual Envelope Verification`, () => {
      const visualPath = path.resolve(
        process.cwd(),
        `src/lib/data/lessonVisuals/ai/day-${dayNum}.json`
      );
      assert.ok(fs.existsSync(visualPath), `Visual envelope must exist at ${visualPath}`);

      const envelope = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
      assert.equal(envelope.schemaVersion, '2.0.0');
      assert.equal(envelope.prefix, 'ai');
      assert.equal(envelope.day, dayNum);
      assert.equal(envelope.entries.length, 5, `Day ${dayNum} must have 5 entries corresponding to the 5 parts`);

      envelope.entries.forEach((entry: any, idx: number) => {
        assert.ok(entry.partTitle, `Day ${dayNum} Entry ${idx + 1} must have partTitle`);
        assert.ok(entry.codeHash, `Day ${dayNum} Entry ${idx + 1} must have codeHash`);
        assert.equal(entry.spec.template, 'table', `Day ${dayNum} Entry ${idx + 1} template must be table`);
        assert.ok(entry.spec.title.endsWith('.'), `Day ${dayNum} Entry ${idx + 1} title must end with period`);
        assert.ok(!/[0-9]/.test(entry.spec.title), `Day ${dayNum} Entry ${idx + 1} title must not contain digits`);
        assert.equal(entry.spec.steps.length, 4, `Day ${dayNum} Entry ${idx + 1} must have 4 steps`);

        entry.spec.steps.forEach((step: any, stepIdx: number) => {
          assert.ok(step.caption.length <= 75, `Day ${dayNum} Entry ${idx + 1} step ${stepIdx + 1} caption too long (${step.caption.length})`);
          assert.ok(step.caption.endsWith('.'), `Day ${dayNum} Entry ${idx + 1} step ${stepIdx + 1} caption must end with period`);
          assert.ok(!/[0-9]/.test(step.caption), `Day ${dayNum} Entry ${idx + 1} step ${stepIdx + 1} caption must not contain digits`);
          assert.ok(Array.isArray(step.rows) && step.rows.length >= 2, `Day ${dayNum} Entry ${idx + 1} step ${stepIdx + 1} must have >= 2 rows`);
        });
      });
    });
  });
});
