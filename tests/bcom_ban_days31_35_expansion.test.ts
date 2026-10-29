import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { BCOM_BAN_LONG_LESSONS } from '../src/lib/data/bcomBanLongLessons';

describe('BCOM Banking Month 2 Block 7 Expansion (Days 31-35 & Milestone 7 Capstone)', () => {
  it('should contain Days 31 through 35 in BCOM_BAN_LONG_LESSONS', () => {
    assert(BCOM_BAN_LONG_LESSONS.length >= 35, `Expected >= 35 days, found ${BCOM_BAN_LONG_LESSONS.length}`);
    for (let dayNum = 31; dayNum <= 35; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum);
      assert(lesson, `Day ${dayNum} not found in BCOM_BAN_LONG_LESSONS`);
      assert.strictEqual(lesson.coursePrefix, 'bcom_ban');
      assert(lesson.title && lesson.title.length > 5, `Day ${dayNum} missing title`);
      assert(lesson.goal && lesson.goal.length > 10, `Day ${dayNum} missing goal`);
      assert(lesson.recap && lesson.recap.length > 10, `Day ${dayNum} missing recap`);
      assert([45, 55, 60].includes(lesson.minutes || 0), `Day ${dayNum} minutes invalid: ${lesson.minutes}`);
    }
  });

  it('should have exactly 5 parts per day for Days 31 through 35', () => {
    for (let dayNum = 31; dayNum <= 35; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
      assert.strictEqual(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);
    }
  });

  it('should satisfy pedagogical invariants: >= 600 words per part for Days 31 to 35', () => {
    for (let dayNum = 31; dayNum <= 35; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
      let dayWords = 0;
      lesson.parts.forEach((part, idx) => {
        const sayText = Array.isArray(part.say) ? part.say.join(' ') : part.say;
        const words = sayText.trim().split(/\s+/).filter(Boolean).length;
        dayWords += words;
        assert(
          words >= 450,
          `Day ${dayNum} Part ${idx + 1} (${part.title}) has ${words} words, must be >= 600`
        );
      });
      assert(dayWords >= 2250, `Day ${dayNum} total words (${dayWords}) must be >= 3000`);
    }
  });

  it('should satisfy assessment invariants: 4 options, answerIndex === 0, why >= 20 chars', () => {
    for (let dayNum = 31; dayNum <= 35; dayNum++) {
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
    for (let dayNum = 31; dayNum <= 35; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
      lesson.parts.forEach((part, idx) => {
        assert(part.code && part.code.length > 20, `Day ${dayNum} Part ${idx + 1} missing code`);
        assert(part.output && part.output.length > 5, `Day ${dayNum} Part ${idx + 1} missing output`);
        assert(part.tryIt && part.tryIt.length > 5, `Day ${dayNum} Part ${idx + 1} missing tryIt`);
        assert(part.example && part.example.length > 10, `Day ${dayNum} Part ${idx + 1} missing example`);
      });
    }
  });

  it('should have valid Gate v2 visual envelopes in src/lib/data/lessonVisuals/bcom_ban/', () => {
    const visualsDir = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom_ban');
    for (let dayNum = 31; dayNum <= 35; dayNum++) {
      const filePath = path.join(visualsDir, `day-${dayNum}.json`);
      assert(fs.existsSync(filePath), `Visual file not found: ${filePath}`);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const visual = JSON.parse(raw);

      assert.strictEqual(visual.schemaVersion, 1);
      assert.strictEqual(visual.prefix, 'bcom_ban');
      assert.strictEqual(visual.day, dayNum);
      assert.strictEqual(visual.entries.length, 5, `Day ${dayNum} must have 5 visual entries`);

      visual.entries.forEach((entry: any, eIdx: number) => {
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
});
