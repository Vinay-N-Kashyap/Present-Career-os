import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BCOM_TAX_LONG_LESSONS } from '../src/lib/data/bcomTaxLongLessons';
import fs from 'node:fs';
import path from 'node:path';

describe('B.Com Corporate Tax Month 2 (Days 56-60) Expansion Suite - Full Course Conquest', () => {

  it('Day 56: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 56);
    assert.ok(day, 'Day 56 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 56 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = (Array.isArray(part.say) ? part.say.join(' ') : part.say).split(/\s+/).filter(Boolean).length;
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
      assert.ok(part.check.why, `Part ${idx + 1} check must have a why explanation`);
    });

    assert.ok(
      totalWords >= 3000,
      `Day 56 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 57: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 57);
    assert.ok(day, 'Day 57 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 57 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = (Array.isArray(part.say) ? part.say.join(' ') : part.say).split(/\s+/).filter(Boolean).length;
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
      assert.ok(part.check.why, `Part ${idx + 1} check must have a why explanation`);
    });

    assert.ok(
      totalWords >= 3000,
      `Day 57 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 58: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 58);
    assert.ok(day, 'Day 58 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 58 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = (Array.isArray(part.say) ? part.say.join(' ') : part.say).split(/\s+/).filter(Boolean).length;
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
      assert.ok(part.check.why, `Part ${idx + 1} check must have a why explanation`);
    });

    assert.ok(
      totalWords >= 3000,
      `Day 58 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 59: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 59);
    assert.ok(day, 'Day 59 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 59 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = (Array.isArray(part.say) ? part.say.join(' ') : part.say).split(/\s+/).filter(Boolean).length;
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
      assert.ok(part.check.why, `Part ${idx + 1} check must have a why explanation`);
    });

    assert.ok(
      totalWords >= 3000,
      `Day 59 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 60: Structural integrity, word counts, and pedagogical invariants (Grand Master Capstone)', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 60);
    assert.ok(day, 'Day 60 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 60 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = (Array.isArray(part.say) ? part.say.join(' ') : part.say).split(/\s+/).filter(Boolean).length;
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
      assert.ok(part.check.why, `Part ${idx + 1} check must have a why explanation`);
    });

    assert.ok(
      totalWords >= 3000,
      `Day 60 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  // Visual Envelope Tests (Gate v2)
  [56, 57, 58, 59, 60].forEach((day) => {
    it(`Day ${day}: Gate v2 visual JSON invariants validation`, () => {
      const visualPath = path.resolve(
        __dirname,
        `../src/lib/data/lessonVisuals/bcom_tax/day-${day}.json`
      );
      assert.ok(fs.existsSync(visualPath), `Visual JSON must exist at ${visualPath}`);

      const raw = fs.readFileSync(visualPath, 'utf-8');
      const data = JSON.parse(raw);

      assert.equal(data.schemaVersion, '2.0.0');
      assert.equal(data.prefix, 'bcom_tax');
      assert.equal(data.day, day);
      assert.equal(data.entries.length, 5, 'Must contain exactly 5 visual entries');

      data.entries.forEach((entry: any, pIdx: number) => {
        assert.equal(entry.partIndex, pIdx);
        assert.ok(entry.spec.title, `Part ${pIdx + 1} must have spec title`);
        assert.equal(entry.spec.steps.length, 4, `Part ${pIdx + 1} must have exactly 4 steps`);

        entry.spec.steps.forEach((step: any, sIdx: number) => {
          assert.ok(
            step.caption.length <= 75,
            `Day ${day} P${pIdx + 1}S${sIdx + 1} caption too long (${step.caption.length}): ${step.caption}`
          );
          assert.ok(
            step.caption.endsWith('.'),
            `Day ${day} P${pIdx + 1}S${sIdx + 1} caption must end with period: ${step.caption}`
          );
          assert.ok(
            !/\d/.test(step.caption),
            `Day ${day} P${pIdx + 1}S${sIdx + 1} caption contains digits: ${step.caption}`
          );
        });
      });
    });
  });

  // Full Course 100% Invariant Test
  it('Course 03 (bcom_tax) 100% Full Course Invariant: Exactly 60 Days Registered & Validated', () => {
    assert.equal(BCOM_TAX_LONG_LESSONS.length, 60, 'Course bcom_tax must have exactly 60 days');
    const dayNumbers = BCOM_TAX_LONG_LESSONS.map((l) => l.day);
    const expected = Array.from({ length: 60 }, (_, i) => i + 1);
    assert.deepEqual(dayNumbers, expected, 'Days must be strictly sequential from 1 to 60');
  });

});
