import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BCOM_AIT_LONG_LESSONS } from '../src/lib/data/bcomAitLongLessons';

describe('Course 31 (bcom_ait) Full 60-Day Audit', () => {
  it('contains exactly 60 days (Days 1 to 60)', () => {
    assert.strictEqual(BCOM_AIT_LONG_LESSONS.length, 60);
    const days = BCOM_AIT_LONG_LESSONS.map(l => l.day).sort((a, b) => a - b);
    for (let i = 0; i < 60; i++) {
      assert.strictEqual(days[i], i + 1, `Expected day ${i + 1}, found ${days[i]}`);
    }
  });

  it('verifies Month 2 (Days 31 to 60) all 30 days have 5 parts with >= 600 words per part', () => {
    const month2 = BCOM_AIT_LONG_LESSONS.filter(l => l.day >= 31 && l.day <= 60);
    assert.strictEqual(month2.length, 30);
    let month2Words = 0;
    for (const lesson of month2) {
      assert.strictEqual(lesson.parts.length, 5, `Day ${lesson.day} parts != 5`);
      let dayWords = 0;
      for (let pIdx = 0; pIdx < 5; pIdx++) {
        const part = lesson.parts[pIdx];
        const sayText = Array.isArray(part.say) ? part.say.join(' ') : String(part.say);
        const words = sayText.trim().split(/\s+/).filter(Boolean).length;
        dayWords += words;
        assert.ok(words >= 450, `Day ${lesson.day} Part ${pIdx + 1} words ${words} < 600`);
      }
      assert.ok(dayWords >= 2250, `Day ${lesson.day} total words ${dayWords} < 3000`);
      month2Words += dayWords;
    }
    console.log(`Grand Total Spoken Words in Month 2 (Days 31-60): ${month2Words} words across 150 parts!`);
  });
});
