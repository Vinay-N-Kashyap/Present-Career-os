import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BCOM_BAN_LONG_LESSONS } from '../src/lib/data/bcomBanLongLessons';

describe('BCOM Banking Month 2 Block 12 Expansion (Days 56-60 & Grand Master Milestone 12 Capstone)', () => {
  it('should contain Days 56 through 60 in BCOM_BAN_LONG_LESSONS', () => {
    assert(BCOM_BAN_LONG_LESSONS.length >= 60, `Expected >= 60 days, found ${BCOM_BAN_LONG_LESSONS.length}`);
    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum);
      assert(lesson, `Day ${dayNum} not found in BCOM_BAN_LONG_LESSONS`);
      assert.strictEqual(lesson.coursePrefix, 'bcom_ban');
      assert(lesson.title && lesson.title.length > 5, `Day ${dayNum} missing title`);
      assert(lesson.goal && lesson.goal.length > 10, `Day ${dayNum} missing goal`);
      assert(lesson.recap && lesson.recap.length > 10, `Day ${dayNum} missing recap`);
      if (dayNum === 60) {
        assert.strictEqual(lesson.minutes, 60, `Day 60 Grand Master Capstone must have minutes: 60`);
      } else {
        assert([45, 55].includes(lesson.minutes || 0), `Day ${dayNum} minutes invalid: ${lesson.minutes}`);
      }
    }
  });

  it('should have exactly 5 parts per day for Days 56 through 60', () => {
    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
      assert.strictEqual(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);
    }
  });

  it('should satisfy pedagogical invariants: >= 600 words per part for Days 56 to 60', () => {
    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
      let dayWords = 0;
      lesson.parts.forEach((part, idx) => {
        const sayText = Array.isArray(part.say) ? part.say.join(' ') : part.say;
        const words = sayText.trim().split(/\s+/).filter(Boolean).length;
        dayWords += words;
        assert(
          words >= 600,
          `Day ${dayNum} Part ${idx + 1} (${part.title}) has ${words} words, must be >= 600`
        );
      });
      assert(dayWords >= 3000, `Day ${dayNum} total words (${dayWords}) must be >= 3000`);
    }
  });

  it('should satisfy assessment invariants: 4 options, answerIndex === 0, why >= 20 chars', () => {
    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
      lesson.parts.forEach((part, idx) => {
        const check = part.check;
        assert(check, `Day ${dayNum} Part ${idx + 1} missing check`);
        assert(check.question && check.question.length > 10, `Day ${dayNum} Part ${idx + 1} invalid question`);
        assert.strictEqual(check.options.length, 4, `Day ${dayNum} Part ${idx + 1} must have 4 options`);
        assert.strictEqual(check.answerIndex, 0, `Day ${dayNum} Part ${idx + 1} answerIndex must be 0`);
        assert(check.why && check.why.length >= 20, `Day ${dayNum} Part ${idx + 1} why must be >= 20 chars`);
      });
    }
  });

  it('should have executable code snippets and non-empty outputs in every part', () => {
    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
      lesson.parts.forEach((part, idx) => {
        assert(part.code && part.code.length > 20, `Day ${dayNum} Part ${idx + 1} missing code`);
        assert(part.output && part.output.length > 5, `Day ${dayNum} Part ${idx + 1} missing output`);
        assert(part.tryIt && part.tryIt.length > 5, `Day ${dayNum} Part ${idx + 1} missing tryIt`);
        assert(part.example && part.example.length > 10, `Day ${dayNum} Part ${idx + 1} missing example`);
      });
    }
  });

  it('should have valid Gate v2 visual envelopes with cryptographic SHA-256 bindings', () => {
    const visualsDir = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom_ban');
    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const filePath = path.join(visualsDir, `day-${dayNum}.json`);
      assert(fs.existsSync(filePath), `Visual file not found: ${filePath}`);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const visual = JSON.parse(raw);

      assert.strictEqual(visual.schemaVersion, 1);
      assert.strictEqual(visual.prefix, 'bcom_ban');
      assert.strictEqual(visual.day, dayNum);
      assert.strictEqual(visual.entries.length, 5, `Day ${dayNum} must have 5 visual entries`);

      visual.entries.forEach((entry: any, eIdx: number) => {
        const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
        const part = lesson.parts[eIdx];
        const partStr = part.title + (Array.isArray(part.say) ? part.say.join('') : part.say) + (part.code || '');
        const expectedHash = crypto.createHash('sha256').update(partStr).digest('hex');
        assert.strictEqual(entry.codeHash, expectedHash, `Day ${dayNum} Part ${eIdx + 1} codeHash mismatch`);

        assert(entry.partTitle, `Day ${dayNum} Entry ${eIdx} missing partTitle`);
        assert(entry.codeHash && entry.codeHash.length === 64, `Day ${dayNum} Entry ${eIdx} invalid codeHash`);
        assert.strictEqual(entry.spec.template, 'funnel');
        assert.strictEqual(entry.spec.steps.length, 4, `Day ${dayNum} Entry ${eIdx} must have 4 steps`);

        const expectedSteps = ['intro', 'say1', 'example', 'tryIt'];
        entry.spec.steps.forEach((step: any, sIdx: number) => {
          assert.strictEqual(step.at, expectedSteps[sIdx]);
          assert(step.caption.endsWith('.'), `Caption must end with period: '${step.caption}'`);
          assert(step.caption.length <= 75, `Caption too long: '${step.caption}'`);
          assert(!/\d/.test(step.caption), `Caption must contain no digits: '${step.caption}'`);
        });
      });
    }
  });

  it('COURSE 05 GRADUATION CONFIRMED: BCOM Banking 60/60 Days Full Curriculum Complete', () => {
    assert.strictEqual(BCOM_BAN_LONG_LESSONS.length, 60, `Expected exactly 60 days, found ${BCOM_BAN_LONG_LESSONS.length}`);
    const daysPresent = new Set(BCOM_BAN_LONG_LESSONS.map((l) => l.day));
    for (let day = 1; day <= 60; day++) {
      assert(daysPresent.has(day), `Missing day ${day} in BCOM_BAN_LONG_LESSONS`);
    }
  });
});
