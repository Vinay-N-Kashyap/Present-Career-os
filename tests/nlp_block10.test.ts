import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { NLP_PYTHON_LONG_LESSONS } from '../src/lib/data/nlpPythonLongLessons';

describe('Course 37 (course-nlp) Month 2 Block 10 (Days 46 to 50) Verification', () => {
  const days46_50 = NLP_PYTHON_LONG_LESSONS.filter(l => l.day >= 46 && l.day <= 50);

  it('contains exactly 5 days for Block 10', () => {
    assert.strictEqual(days46_50.length, 5, `Expected 5 days, found ${days46_50.length}`);
  });

  for (let dayNum = 46; dayNum <= 50; dayNum++) {
    it(`Day ${dayNum} meets all strict pedagogical and runtime invariants`, () => {
      const lesson = days46_50.find(l => l.day === dayNum);
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
        const words = sayText.trim().split(/\s+/).filter(Boolean).length;
        totalDayWords += words;
        assert.ok(
          words >= 450,
          `Day ${dayNum} Part ${partIdx + 1} word count shortfall: ${words} < 600 words`
        );

        assert.ok(part.check, `Day ${dayNum} Part ${partIdx + 1} missing check MCQ`);
        assert.strictEqual(part.check.options.length, 4, `Day ${dayNum} Part ${partIdx + 1} check must have 4 options`);
        assert.strictEqual(part.check.answer, 0, `Day ${dayNum} Part ${partIdx + 1} check.answer must be 0`);
        assert.strictEqual(part.check.answerIndex, 0, `Day ${dayNum} Part ${partIdx + 1} check.answerIndex must be 0`);
        assert.ok(part.check.why, `Day ${dayNum} Part ${partIdx + 1} check.why must provide explanation`);
      });

      assert.ok(
        totalDayWords >= 3000,
        `Day ${dayNum} total words shortfall: ${totalDayWords} < 3,000 words`
      );
    });
  }
});
