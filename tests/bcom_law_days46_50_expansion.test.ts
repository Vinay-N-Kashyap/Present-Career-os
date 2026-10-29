import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BCOM_LAW_LONG_LESSONS } from '../src/lib/data/bcomLawLongLessons';
import { getLongLesson } from '../src/lib/data/longLessons';

function countWords(say: string | string[]): number {
  if (Array.isArray(say)) {
    return say.reduce((acc, curr) => acc + curr.trim().split(/\s+/).filter(Boolean).length, 0);
  }
  return say.trim().split(/\s+/).filter(Boolean).length;
}

test('bcom_law Days 46-50 Block 10 & Milestone 10 Capstone Invariants', async (t) => {
  const targetDays = [46, 47, 48, 49, 50];

  for (const dayNum of targetDays) {
    await t.test(`bcom_law Day ${dayNum} curriculum integrity & pedagogical standards`, () => {
      const lesson = BCOM_LAW_LONG_LESSONS.find((l) => l.day === dayNum);
      assert.ok(lesson, `bcom_law Day ${dayNum} must exist in BCOM_LAW_LONG_LESSONS`);
      assert.equal(lesson.coursePrefix, 'bcom_law', `Day ${dayNum} coursePrefix must be bcom_law`);
      assert.equal(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);

      let totalDayWords = 0;
      for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
        const part = lesson.parts[pIdx];
        assert.ok(part.title, `Day ${dayNum} Part ${pIdx + 1} must have a title`);
        assert.ok(part.code, `Day ${dayNum} Part ${pIdx + 1} must contain runnable code`);
        assert.ok(part.output, `Day ${dayNum} Part ${pIdx + 1} must have expected output`);

        const partWords = countWords(part.say);
        totalDayWords += partWords;
        assert.ok(
          partWords >= 580,
          `Day ${dayNum} Part ${pIdx + 1} must have >= 580 words (found ${partWords})`
        );

        assert.ok(part.check, `Day ${dayNum} Part ${pIdx + 1} must have a check question`);
        assert.equal(
          part.check.answer,
          0,
          `Day ${dayNum} Part ${pIdx + 1} check.answer must be index 0`
        );
        if (part.check.answerIndex !== undefined) {
          assert.equal(
            part.check.answerIndex,
            0,
            `Day ${dayNum} Part ${pIdx + 1} check.answerIndex must be index 0`
          );
        }
        assert.ok(part.check.options.length >= 4, `Day ${dayNum} Part ${pIdx + 1} must have at least 4 options`);
      }

      assert.ok(
        totalDayWords >= 3000,
        `Day ${dayNum} total words must be >= 3000 (found ${totalDayWords})`
      );
    });

    await t.test(`bcom_law Day ${dayNum} Gate v2 visual envelope verification`, () => {
      const lesson = BCOM_LAW_LONG_LESSONS.find((l) => l.day === dayNum)!;
      const visualPath = path.resolve(
        process.cwd(),
        `src/lib/data/lessonVisuals/bcom_law/day-${dayNum < 10 ? '0' + dayNum : dayNum}.json`
      );

      assert.ok(fs.existsSync(visualPath), `Visual envelope must exist at ${visualPath}`);
      const rawJson = fs.readFileSync(visualPath, 'utf-8');
      const visualData = JSON.parse(rawJson);

      assert.equal(visualData.schemaVersion, 1, `Visual envelope schemaVersion must be 1`);
      assert.equal(visualData.prefix, 'bcom_law', `Visual envelope prefix must be bcom_law`);
      assert.equal(visualData.day, dayNum, `Visual envelope day must match ${dayNum}`);
      assert.equal(visualData.entries.length, 5, `Visual envelope must have 5 entries`);

      for (let i = 0; i < 5; i++) {
        const part = lesson.parts[i];
        const entry = visualData.entries[i];

        assert.equal(entry.partTitle, part.title, `Entry ${i + 1} title mismatch`);
        const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
        assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `Entry ${i + 1} codeHash mismatch`);
        assert.ok(entry.spec, `Entry ${i + 1} must have visual spec`);
        assert.ok(entry.spec.template, `Entry ${i + 1} must define a visual template`);
      }
    });
  }

  await t.test('bcom_law Day 50 Milestone 10 Capstone Certification Invariants', () => {
    const day50 = BCOM_LAW_LONG_LESSONS.find((l) => l.day === 50)!;
    assert.ok(day50.title.includes('Milestone 10 Capstone'), 'Day 50 must be Milestone 10 Capstone');
    const p5 = day50.parts[4];
    assert.ok(
      p5.output?.includes('GLOBAL_CROSS_BORDER_INSOLVENCY_SHIELD_PASS'),
      'Day 50 Part 5 output must certify GLOBAL_CROSS_BORDER_INSOLVENCY_SHIELD_PASS'
    );
  });
});
