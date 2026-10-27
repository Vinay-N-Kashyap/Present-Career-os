import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { NLP_PYTHON_LONG_LESSONS } from '../src/lib/data/nlpPythonLongLessons';

describe('Course 37 (course-nlp) Month 2 Block 12 (Days 56 to 60 & Grand Master Capstone) Verification', () => {
  const days56_60 = NLP_PYTHON_LONG_LESSONS.filter(l => l.day >= 56 && l.day <= 60);

  it('contains exactly 5 days for Block 12', () => {
    assert.strictEqual(days56_60.length, 5, `Expected 5 days, found ${days56_60.length}`);
  });

  for (let dayNum = 56; dayNum <= 60; dayNum++) {
    it(`Day ${dayNum} meets all strict pedagogical and runtime invariants`, () => {
      const lesson = days56_60.find(l => l.day === dayNum);
      assert.ok(lesson, `Day ${dayNum} not found in NLP_PYTHON_LONG_LESSONS`);
      assert.strictEqual(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);

      let totalDayWords = 0;
      lesson.parts.forEach((part, partIdx) => {
        assert.ok(part.title, `Day ${dayNum} Part ${partIdx + 1} missing title`);
        assert.ok(part.example, `Day ${dayNum} Part ${partIdx + 1} missing example`);
        assert.ok(part.code, `Day ${dayNum} Part ${partIdx + 1} missing code`);
        assert.ok(part.output !== undefined, `Day ${dayNum} Part ${partIdx + 1} missing output`);
        assert.ok(part.tryIt, `Day ${dayNum} Part ${partIdx + 1} missing tryIt`);

        const sayText = Array.isArray(part.say) ? part.say.join(' ') : String(part.say);
        const words = sayText.trim().split(/\s+/).length;
        totalDayWords += words;

        assert.ok(
          words >= 600,
          `Day ${dayNum} Part ${partIdx + 1} has ${words} words, strictly below invariant of 600 words`
        );

        assert.ok(part.check, `Day ${dayNum} Part ${partIdx + 1} missing check`);
        assert.strictEqual(
          part.check.options.length,
          4,
          `Day ${dayNum} Part ${partIdx + 1} check must have 4 options`
        );
        assert.strictEqual(
          part.check.answer,
          0,
          `Day ${dayNum} Part ${partIdx + 1} check answer must be 0`
        );
        assert.strictEqual(
          part.check.answerIndex,
          0,
          `Day ${dayNum} Part ${partIdx + 1} check answerIndex must be 0`
        );
        assert.ok(part.check.why, `Day ${dayNum} Part ${partIdx + 1} check missing why`);
        assert.strictEqual(
          part.check.why,
          part.check.explanation,
          `Day ${dayNum} Part ${partIdx + 1} check why != explanation`
        );
      });

      assert.ok(
        totalDayWords >= 3000,
        `Day ${dayNum} total words ${totalDayWords} strictly below daily invariant of 3,000 words`
      );
    });
  }
});
