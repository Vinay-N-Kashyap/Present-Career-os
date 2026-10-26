import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BCOM_DMKT_LONG_LESSONS } from '../src/lib/data/bcomDmktLongLessons';

describe('BCOM Digital Marketing Month 2 Block 7 Expansion (Days 31-35 & Milestone 7 Capstone)', () => {
  it('should contain Days 31 through 35 in BCOM_DMKT_LONG_LESSONS', () => {
    assert(BCOM_DMKT_LONG_LESSONS.length >= 35, `Expected >= 35 days, found ${BCOM_DMKT_LONG_LESSONS.length}`);
    for (let dayNum = 31; dayNum <= 35; dayNum++) {
      const lesson = BCOM_DMKT_LONG_LESSONS.find((l) => l.day === dayNum);
      assert(lesson, `Day ${dayNum} not found in BCOM_DMKT_LONG_LESSONS`);
      assert.strictEqual(lesson.coursePrefix, 'bcom_dmkt');
      assert(lesson.title && lesson.title.length > 5, `Day ${dayNum} missing title`);
      assert(lesson.goal && lesson.goal.length > 10, `Day ${dayNum} missing goal`);
      assert(lesson.recap && lesson.recap.length > 10, `Day ${dayNum} missing recap`);
      const expectedMinutes = dayNum === 35 ? 60 : 38;
      assert.strictEqual(lesson.minutes, expectedMinutes, `Day ${dayNum} minutes invalid: ${lesson.minutes}`);
    }
  });

  it('should have exactly 5 parts per day for Days 31 through 35', () => {
    for (let dayNum = 31; dayNum <= 35; dayNum++) {
      const lesson = BCOM_DMKT_LONG_LESSONS.find((l) => l.day === dayNum)!;
      assert.strictEqual(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);
    }
  });

  it('should satisfy strict word count threshold (>= 600 words per part) across all 25 parts', () => {
    for (let dayNum = 31; dayNum <= 35; dayNum++) {
      const lesson = BCOM_DMKT_LONG_LESSONS.find((l) => l.day === dayNum)!;
      let dayWords = 0;
      lesson.parts.forEach((part, pIdx) => {
        const words = part.say.join(' ').trim().split(/\s+/).length;
        dayWords += words;
        assert(
          words >= 600,
          `Day ${dayNum} Part ${pIdx + 1} has ${words} words, strictly under 600 words threshold!`
        );
      });
      assert(
        dayWords >= 3000,
        `Day ${dayNum} total words ${dayWords} is under 3000 words!`
      );
    }
  });

  it('should enforce Socratic check quiz invariants (answer: 0, answerIndex: 0, 4 options, why >= 20)', () => {
    for (let dayNum = 31; dayNum <= 35; dayNum++) {
      const lesson = BCOM_DMKT_LONG_LESSONS.find((l) => l.day === dayNum)!;
      lesson.parts.forEach((part, pIdx) => {
        const check = (part as any).check;
        assert(check, `Day ${dayNum} Part ${pIdx + 1} missing check`);
        assert.strictEqual(check.options.length, 4, `Day ${dayNum} Part ${pIdx + 1} options != 4`);
        assert.strictEqual(check.answer, 0, `Day ${dayNum} Part ${pIdx + 1} check.answer != 0`);
        assert.strictEqual(check.answerIndex, 0, `Day ${dayNum} Part ${pIdx + 1} check.answerIndex != 0`);
        assert(
          check.why && check.why.length >= 20,
          `Day ${dayNum} Part ${pIdx + 1} check.why must be >= 20 chars`
        );
      });
    }
  });

  it('should enforce presence of example, tryIt, code and output in every part', () => {
    for (let dayNum = 31; dayNum <= 35; dayNum++) {
      const lesson = BCOM_DMKT_LONG_LESSONS.find((l) => l.day === dayNum)!;
      lesson.parts.forEach((part, pIdx) => {
        assert(part.example && part.example.length > 20, `Day ${dayNum} Part ${pIdx + 1} missing example`);
        assert(part.tryIt && part.tryIt.length > 20, `Day ${dayNum} Part ${pIdx + 1} missing tryIt`);
        assert(part.code && part.code.length > 20, `Day ${dayNum} Part ${pIdx + 1} missing code`);
        assert(part.output && part.output.length > 10, `Day ${dayNum} Part ${pIdx + 1} missing output`);
      });
    }
  });

  it('should have valid Gate v2 visual envelopes with matching SHA-256 codeHash bindings', () => {
    const visualsDir = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom_dmkt');
    const standardStages = [
      'Traffic & Reach Discovery',
      'Qualified Intent Engagement',
      'Consideration & Conversion',
      'Customer Equity Retention'
    ];

    for (let dayNum = 31; dayNum <= 35; dayNum++) {
      const visualPath = path.join(visualsDir, `day-${dayNum}.json`);
      assert(fs.existsSync(visualPath), `Visual file not found: ${visualPath}`);
      const raw = fs.readFileSync(visualPath, 'utf-8');
      const visual = JSON.parse(raw);

      assert.strictEqual(visual.schemaVersion, 1);
      assert.strictEqual(visual.prefix, 'bcom_dmkt');
      assert.strictEqual(visual.day, dayNum);
      assert.strictEqual(visual.entries.length, 5);

      const lesson = BCOM_DMKT_LONG_LESSONS.find((l) => l.day === dayNum)!;

      visual.entries.forEach((entry: any, eIdx: number) => {
        const part = lesson.parts[eIdx];
        assert.strictEqual(entry.partTitle, part.title);
        assert.strictEqual(entry.spec.template, 'funnel');
        assert.strictEqual(entry.spec.steps.length, 4);

        // Check stages and captions
        entry.spec.steps.forEach((step: any) => {
          assert(['intro', 'say1', 'example', 'tryIt'].includes(step.at));
          assert(step.caption.endsWith('.'), `Caption must end with period: ${step.caption}`);
          assert(step.caption.length <= 75, `Caption exceeds 75 chars: ${step.caption}`);
          assert(!/\d/.test(step.caption), `Caption contains numeric digits: ${step.caption}`);
          assert.strictEqual(step.stages.length, 4);
          step.stages.forEach((st: any, sIdx: number) => {
            assert.strictEqual(st.label, standardStages[sIdx]);
          });
        });

        // Verify SHA-256 hash binding
        const expectedHash = crypto
          .createHash('sha256')
          .update(part.title + part.say.join('') + (part.code || ''))
          .digest('hex');
        assert.strictEqual(entry.codeHash, expectedHash, `Hash mismatch in Day ${dayNum} Part ${eIdx + 1}`);
      });
    }
  });

  it('BCOM Digital Marketing Month 2 Block 7 Complete (Days 1 to 35: 35/60 Days, 58.3% Complete)', () => {
    assert(BCOM_DMKT_LONG_LESSONS.length >= 35, `Expected at least 35 days, found ${BCOM_DMKT_LONG_LESSONS.length}`);
    const daysPresent = new Set(BCOM_DMKT_LONG_LESSONS.map((l) => l.day));
    for (let day = 1; day <= 35; day++) {
      assert(daysPresent.has(day), `Missing day ${day} in BCOM_DMKT_LONG_LESSONS`);
    }
  });
});
