import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BCOM_ECOM_LONG_LESSONS } from '../src/lib/data/bcomEcomLongLessons';

describe('BCOM E-Commerce Month 2 Block 10 Expansion (Days 46-50 & Milestone 10 Capstone)', () => {
  it('should contain Days 46 through 50 in BCOM_ECOM_LONG_LESSONS', () => {
    assert(BCOM_ECOM_LONG_LESSONS.length >= 50, `Expected >= 50 days, found ${BCOM_ECOM_LONG_LESSONS.length}`);
    for (let dayNum = 46; dayNum <= 50; dayNum++) {
      const lesson = BCOM_ECOM_LONG_LESSONS.find((l) => l.day === dayNum);
      assert(lesson, `Day ${dayNum} not found in BCOM_ECOM_LONG_LESSONS`);
      assert.strictEqual(lesson.coursePrefix, 'bcom_ecom');
      assert(lesson.title && lesson.title.length > 5, `Day ${dayNum} missing title`);
      assert(lesson.goal && lesson.goal.length > 10, `Day ${dayNum} missing goal`);
      assert(lesson.recap && (typeof lesson.recap === 'string' ? lesson.recap.length > 10 : (lesson.recap as any).length > 0), `Day ${dayNum} missing recap`);
      const expectedMinutes = dayNum === 50 ? 60 : 38;
      assert.strictEqual(lesson.minutes, expectedMinutes, `Day ${dayNum} minutes invalid: ${lesson.minutes}`);
    }
  });

  it('should have exactly 5 parts per day for Days 46 through 50', () => {
    for (let dayNum = 46; dayNum <= 50; dayNum++) {
      const lesson = BCOM_ECOM_LONG_LESSONS.find((l) => l.day === dayNum)!;
      assert.strictEqual(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);
    }
  });

  it('should satisfy strict word count threshold (>= 580 words per part) across all 25 parts', () => {
    let totalBlockWords = 0;
    const partWordCounts: { day: number; part: number; words: number }[] = [];

    for (let dayNum = 46; dayNum <= 50; dayNum++) {
      const lesson = BCOM_ECOM_LONG_LESSONS.find((l) => l.day === dayNum)!;
      let dayWords = 0;
      lesson.parts.forEach((part, pIdx) => {
        const text = Array.isArray(part.say) ? part.say.join(' ') : part.say;
        const wordCount = text.trim().split(/\s+/).length;
        dayWords += wordCount;
        totalBlockWords += wordCount;
        partWordCounts.push({ day: dayNum, part: pIdx + 1, words: wordCount });
        assert(
          wordCount >= 580,
          `Day ${dayNum} Part ${pIdx + 1} has ${wordCount} words, below 580 word minimum!`
        );
      });
      assert(
        dayWords >= 3000,
        `Day ${dayNum} has ${dayWords} total words, below 3,000 word minimum!`
      );
    }
    console.log(`\n🎉 Block 10 Verified: ${totalBlockWords.toLocaleString()} total words across 25 parts.`);
  });

  it('should enforce Socratic check quiz invariants (answer: 0, answerIndex: 0, 4 options, why >= 20)', () => {
    for (let dayNum = 46; dayNum <= 50; dayNum++) {
      const lesson = BCOM_ECOM_LONG_LESSONS.find((l) => l.day === dayNum)!;
      lesson.parts.forEach((part, pIdx) => {
        assert(part.check, `Day ${dayNum} Part ${pIdx + 1} missing Socratic check`);
        const chk = part.check as any;
        const ans = chk.answer !== undefined ? chk.answer : chk.answerIndex;
        assert.strictEqual(ans, 0, `Day ${dayNum} Part ${pIdx + 1} answer must be 0`);
        assert.strictEqual(chk.options.length, 4, `Day ${dayNum} Part ${pIdx + 1} must have 4 options`);
        assert(chk.why && chk.why.length >= 20, `Day ${dayNum} Part ${pIdx + 1} why explanation too short`);
      });
    }
  });

  it('should enforce presence of example, tryIt, code and output in every part', () => {
    for (let dayNum = 46; dayNum <= 50; dayNum++) {
      const lesson = BCOM_ECOM_LONG_LESSONS.find((l) => l.day === dayNum)!;
      lesson.parts.forEach((part, pIdx) => {
        assert(part.example && part.example.length > 10, `Day ${dayNum} Part ${pIdx + 1} missing example`);
        assert(part.tryIt && part.tryIt.length > 10, `Day ${dayNum} Part ${pIdx + 1} missing tryIt`);
        assert(part.code && part.code.length > 20, `Day ${dayNum} Part ${pIdx + 1} missing code`);
        assert(part.output && part.output.length > 5, `Day ${dayNum} Part ${pIdx + 1} missing output`);
      });
    }
  });

  it('should have valid Gate v2 visual envelopes with matching SHA-256 codeHash bindings', () => {
    const visualsDir = path.join(__dirname, '../src/lib/data/lessonVisuals/bcom_ecom');
    for (let dayNum = 46; dayNum <= 50; dayNum++) {
      const visualPath = path.join(visualsDir, `day-${dayNum}.json`);
      assert(fs.existsSync(visualPath), `Visual envelope missing for Day ${dayNum}: ${visualPath}`);
      const raw = fs.readFileSync(visualPath, 'utf-8');
      const visualData = JSON.parse(raw);

      assert.strictEqual(visualData.schemaVersion, 1);
      assert.strictEqual(visualData.prefix, 'bcom_ecom');
      assert.strictEqual(visualData.day, dayNum);
      assert.strictEqual(visualData.entries.length, 5);

      const lesson = BCOM_ECOM_LONG_LESSONS.find((l) => l.day === dayNum)!;

      visualData.entries.forEach((entry: any, pIdx: number) => {
        const part = lesson.parts[pIdx];
        const computedHash = crypto.createHash('sha256').update(part.code).digest('hex');
        assert.strictEqual(
          entry.codeHash,
          computedHash,
          `Day ${dayNum} Part ${pIdx + 1} codeHash mismatch`
        );
        assert.strictEqual(entry.spec.steps.length, 4);
        for (const step of entry.spec.steps) {
          assert(!/\d/.test(step.caption), `Caption contains numeric digit: ${step.caption}`);
          assert(step.caption.endsWith('.'), `Caption missing terminal period: ${step.caption}`);
          assert(step.caption.length <= 75, `Caption exceeds 75 chars: ${step.caption}`);
        }
      });
    }
  });

  it('BCOM E-Commerce Month 2 Block 10 Complete (Days 1 to 50: 50/60 Days, 83.33% Complete)', () => {
    const totalDays = BCOM_ECOM_LONG_LESSONS.length;
    assert(totalDays >= 50, `Expected at least 50 days, got ${totalDays}`);
    const pct = ((50 / 60) * 100).toFixed(2);
    console.log(`\n🎉 COURSE 07 STATUS: 50/60 Days Complete (${pct}% Platform Target Achieved)!`);
  });
});
