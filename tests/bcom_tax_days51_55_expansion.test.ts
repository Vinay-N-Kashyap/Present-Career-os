import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BCOM_TAX_LONG_LESSONS } from '../src/lib/data/bcomTaxLongLessons';
import fs from 'node:fs';
import path from 'node:path';

describe('B.Com Corporate Tax Month 2 (Days 51-55) Expansion Suite', () => {

  it('Day 51: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 51);
    assert.ok(day, 'Day 51 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 51 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = (Array.isArray(part.say) ? part.say.join(' ') : part.say).split(/\s+/).filter(Boolean).length;
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

  it('Day 52: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 52);
    assert.ok(day, 'Day 52 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 52 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = (Array.isArray(part.say) ? part.say.join(' ') : part.say).split(/\s+/).filter(Boolean).length;
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

  it('Day 53: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 53);
    assert.ok(day, 'Day 53 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 53 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = (Array.isArray(part.say) ? part.say.join(' ') : part.say).split(/\s+/).filter(Boolean).length;
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

  it('Day 54: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 54);
    assert.ok(day, 'Day 54 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 54 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = (Array.isArray(part.say) ? part.say.join(' ') : part.say).split(/\s+/).filter(Boolean).length;
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

  it('Day 55: Structural integrity, word counts, and pedagogical invariants (Milestone 11 Capstone)', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 55);
    assert.ok(day, 'Day 55 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 55 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = (Array.isArray(part.say) ? part.say.join(' ') : part.say).split(/\s+/).filter(Boolean).length;
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

  // Visual Envelope Tests (Gate v2)
  [51, 52, 53, 54, 55].forEach((day) => {
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

});
