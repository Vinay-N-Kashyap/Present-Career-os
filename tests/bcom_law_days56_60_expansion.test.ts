import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BCOM_LAW_LONG_LESSONS } from '../src/lib/data/bcomLawLongLessons';

function countWords(text: string): number {
  return (text.match(/\b[A-Za-z0-9_-]+\b/g) || []).length;
}

test('bcom_law Days 56-60 Block 12 & Milestone 12 Capstone Invariants', async (t) => {
  const targetDays = [56, 57, 58, 59, 60];

  for (const dayNum of targetDays) {
    const lesson = BCOM_LAW_LONG_LESSONS.find((l) => l.day === dayNum);
    assert.ok(lesson, `Day ${dayNum} must exist in BCOM_LAW_LONG_LESSONS`);

    await t.test(`bcom_law Day ${dayNum} curriculum integrity & pedagogical standards`, () => {
      assert.equal(lesson.id, `bcom_law-day-${dayNum}`);
      assert.equal(lesson.course, 'Corporate Law, IBC & Compliance');
      assert.equal(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);

      let totalDayWords = 0;

      lesson.parts.forEach((part, idx) => {
        const partNum = idx + 1;
        assert.equal(part.part, partNum, `Day ${dayNum} Part ${partNum} index mismatch`);
        assert.ok(part.title && part.title.length > 5, `Day ${dayNum} Part ${partNum} must have a valid title`);

        const words = countWords(part.say);
        totalDayWords += words;
        assert.ok(
          words >= 580,
          `Day ${dayNum} Part ${partNum} word count (${words}) must be >= 580 words`
        );

        assert.ok(part.code && part.code.includes('print'), `Day ${dayNum} Part ${partNum} must contain Python code with print`);
        assert.ok(part.output && part.output.trim().length > 0, `Day ${dayNum} Part ${partNum} must contain non-empty output`);

        assert.ok(part.check, `Day ${dayNum} Part ${partNum} must have check question`);
        assert.equal(part.check.options.length, 4, `Day ${dayNum} Part ${partNum} check must have 4 options`);
        assert.equal(part.check.answer, 0, `Day ${dayNum} Part ${partNum} check.answer must be 0`);
        assert.equal(part.check.answerIndex, 0, `Day ${dayNum} Part ${partNum} check.answerIndex must be 0`);
        assert.ok(part.check.explanation && part.check.explanation.length > 10, `Day ${dayNum} Part ${partNum} must have explanation`);
      });

      assert.ok(
        totalDayWords >= 3000,
        `Day ${dayNum} total words (${totalDayWords}) must be >= 3,000 words`
      );
    });

    await t.test(`bcom_law Day ${dayNum} Gate v2 visual envelope verification`, () => {
      const visualPath = path.join(
        process.cwd(),
        'src/lib/data/lessonVisuals/bcom_law',
        `day-${String(dayNum).padStart(2, '0')}.json`
      );
      assert.ok(fs.existsSync(visualPath), `Visual envelope file must exist at ${visualPath}`);

      const raw = fs.readFileSync(visualPath, 'utf-8');
      const envelope = JSON.parse(raw);

      assert.equal(envelope.schemaVersion, 1);
      assert.equal(envelope.prefix, 'bcom_law');
      assert.equal(envelope.day, dayNum);
      assert.equal(envelope.entries.length, 5, `Day ${dayNum} visual envelope must have 5 entries`);

      envelope.entries.forEach((entry: any, idx: number) => {
        const correspondingPart = lesson.parts[idx];
        assert.equal(entry.partTitle, correspondingPart.title);

        const expectedHash = crypto.createHash('sha256').update(correspondingPart.code, 'utf-8').digest('hex');
        assert.equal(entry.codeHash, expectedHash, `Day ${dayNum} Part ${idx + 1} codeHash must match exact SHA-256`);

        assert.equal(entry.spec.template, 'workflow');
        assert.equal(entry.spec.stages.length, 4);
        assert.equal(entry.spec.steps.length, 4);
      });
    });
  }

  await t.test('bcom_law Day 60 Milestone 12 Grand Master Capstone Certification Invariants', () => {
    const day60 = BCOM_LAW_LONG_LESSONS.find((l) => l.day === 60);
    assert.ok(day60);
    assert.ok(day60.title.includes('Milestone 12') || day60.title.includes('Grand Master Capstone'));

    const lastPart = day60.parts[4];
    assert.ok(lastPart.output.includes('TRANSNATIONAL_GENERAL_COUNSEL_MASTER_PASS'));
    assert.equal(BCOM_LAW_LONG_LESSONS.length, 60, 'Full Course 06 (bcom_law) must have exactly 60 days complete!');
  });
});
