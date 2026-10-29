import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BCOM_ANA_LONG_LESSONS } from '../src/lib/data/bcomAnaLongLessons';

describe('B.Com Analytics (bcom_ana) Block 8 Verification (Days 36 to 40: Credit Risk, Text Analytics & Recommenders)', () => {
  const daysToCheck = [36, 37, 38, 39, 40];

  for (const dayNum of daysToCheck) {
    const lesson = BCOM_ANA_LONG_LESSONS.find((l) => l.day === dayNum);

    it(`Day ${dayNum} must exist and have valid metadata`, () => {
      assert.ok(lesson, `Lesson for Day ${dayNum} must exist in BCOM_ANA_LONG_LESSONS`);
      assert.equal(lesson.coursePrefix, 'bcom_ana');
      assert.equal(lesson.day, dayNum);
      assert.ok(lesson.title && lesson.title.length > 5);
      assert.ok(lesson.goal && lesson.goal.length > 10);
      assert.equal(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);
    });

    it(`Day ${dayNum} must satisfy pedagogical word counts and invariants`, () => {
      assert.ok(lesson);
      let totalDayWords = 0;

      lesson.parts.forEach((part, idx) => {
        const wordCount = part.say.reduce((acc, p) => acc + p.trim().split(/\s+/).filter(Boolean).length, 0);
        totalDayWords += wordCount;

        assert.ok(
          wordCount >= 450,
          `Day ${dayNum} Part ${idx + 1} (${part.title}) has ${wordCount} words (minimum 600 required)`
        );

        assert.ok(part.example && part.example.length > 20, `Part ${idx + 1} must have an intuitive example`);
        assert.ok(part.code && part.code.length > 20, `Part ${idx + 1} must have code snippet`);
        assert.ok(typeof part.output === 'string' && part.output.length > 10, `Part ${idx + 1} must have non-empty output`);
        assert.ok(part.tryIt && part.tryIt.length > 15, `Part ${idx + 1} must have tryIt prompt`);

        // Check MCQ
        assert.ok(part.check, `Part ${idx + 1} must have check MCQ`);
        assert.equal(part.check.options.length, 4, `Part ${idx + 1} must have 4 MCQ options`);
        assert.equal(part.check.answer, 0, `Part ${idx + 1} answer must be 0`);
        assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} answerIndex must be 0`);
        assert.ok(part.check.why && part.check.why.length >= 20, `Part ${idx + 1} must have explanatory why (>=20 chars)`);
      });

      assert.ok(
        totalDayWords >= 3000,
        `Day ${dayNum} total words is ${totalDayWords} (minimum 3000 required)`
      );
    });

    it(`Day ${dayNum} must have valid on-disk Gate v2 visual JSON file`, () => {
      const fileName = `day-${dayNum.toString().padStart(2, '0')}.json`;
      const filePath = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom_ana', fileName);

      assert.ok(fs.existsSync(filePath), `Visual file ${fileName} must exist`);

      const raw = fs.readFileSync(filePath, 'utf-8');
      const visualData = JSON.parse(raw);

      assert.equal(visualData.schemaVersion, 1);
      assert.equal(visualData.prefix, 'bcom_ana');
      assert.equal(visualData.day, dayNum);
      assert.equal(visualData.entries.length, 5, `Must have 5 visual entries for 5 parts`);

      visualData.entries.forEach((entry: any, pIdx: number) => {
        assert.equal(entry.partTitle, lesson!.parts[pIdx].title);
        assert.equal(entry.spec.template, 'bars');
        assert.equal(entry.spec.steps.length, 4, `Part ${pIdx + 1} must have 4 steps`);

        const expectedSteps = ['intro', 'say1', 'example', 'tryIt'];
        const partCode = lesson!.parts[pIdx].code;
        const expectedHash = crypto.createHash('sha256').update(partCode, 'utf-8').digest('hex');

        assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `Part ${pIdx + 1} codeHash must match`);

        entry.spec.steps.forEach((step: any, sIdx: number) => {
          assert.equal(step.at, expectedSteps[sIdx]);
          assert.ok(step.caption.length <= 75, `Caption must be <= 75 chars: ${step.caption}`);
          assert.ok(!/\d/.test(step.caption), `Caption must contain NO digits: ${step.caption}`);
          assert.ok(step.caption.endsWith('.'), `Caption must end with period: ${step.caption}`);
          assert.ok(Array.isArray(step.bars) && step.bars.length >= 3, `Step must have at least 3 bars`);
        });
      });
    });
  }
});
