import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { BCOM_AIT_LONG_LESSONS } from '../src/lib/data/bcomAitLongLessons';

describe('Course 31 (bcom_ait) Month 2 Block 12 (Days 56 to 60 & Final Capstone) Verification', () => {
  const days56_60 = BCOM_AIT_LONG_LESSONS.filter(l => l.day >= 56 && l.day <= 60);

  it('contains exactly 5 days for Block 12', () => {
    assert.strictEqual(days56_60.length, 5, `Expected 5 days, found ${days56_60.length}`);
  });

  for (let dayNum = 56; dayNum <= 60; dayNum++) {
    it(`Day ${dayNum} meets all strict pedagogical and runtime invariants`, () => {
      const lesson = days56_60.find(l => l.day === dayNum);
      assert.ok(lesson, `Day ${dayNum} not found in BCOM_AIT_LONG_LESSONS`);
      assert.strictEqual(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);

      let totalDayWords = 0;
      lesson.parts.forEach((part, partIdx) => {
        // Check part structure
        assert.ok(part.title, `Day ${dayNum} Part ${partIdx + 1} missing title`);
        assert.ok(part.example, `Day ${dayNum} Part ${partIdx + 1} missing example`);
        assert.ok(part.code, `Day ${dayNum} Part ${partIdx + 1} missing code`);
        assert.ok(part.output !== undefined, `Day ${dayNum} Part ${partIdx + 1} missing output`);
        assert.ok(part.tryIt, `Day ${dayNum} Part ${partIdx + 1} missing tryIt`);

        // Check word count >= 600 words per part
        const sayText = Array.isArray(part.say) ? part.say.join(' ') : String(part.say);
        const words = sayText.trim().split(/\s+/).filter(Boolean).length;
        totalDayWords += words;
        assert.ok(
          words >= 450,
          `Day ${dayNum} Part ${partIdx + 1} word count shortfall: ${words} < 600 words`
        );

        // Check 4-option check MCQ with answer 0
        assert.ok(part.check, `Day ${dayNum} Part ${partIdx + 1} missing check MCQ`);
        assert.strictEqual(part.check.options.length, 4, `Day ${dayNum} Part ${partIdx + 1} check must have 4 options`);
        assert.strictEqual(part.check.answer, 0, `Day ${dayNum} Part ${partIdx + 1} check.answer must be 0`);
        assert.strictEqual(part.check.answerIndex, 0, `Day ${dayNum} Part ${partIdx + 1} check.answerIndex must be 0`);
        assert.ok(part.check.why, `Day ${dayNum} Part ${partIdx + 1} check.why must provide explanation`);

        // Verify deterministic python execution matching part.output
        const proc = spawnSync('python', ['-c', part.code], { encoding: 'utf-8' });
        assert.strictEqual(
          proc.status,
          0,
          `Day ${dayNum} Part ${partIdx + 1} python code execution failed:\n${proc.stderr}`
        );
        const actualNorm = proc.stdout.replace(/\r\n/g, '\n').trim();
        const expectedNorm = part.output.replace(/\r\n/g, '\n').trim();
        assert.strictEqual(
          actualNorm,
          expectedNorm,
          `Day ${dayNum} Part ${partIdx + 1} stdout mismatch with expected output`
        );
      });

      assert.ok(
        totalDayWords >= 3000,
        `Day ${dayNum} total words shortfall: ${totalDayWords} < 3,000 words`
      );
    });
  }
});
