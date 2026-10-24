import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BCOM_FINANCE_LONG_LESSONS } from '../src/lib/data/bcomFinanceLongLessons';

function countWords(text: string): number {
  return (text.match(/\b[A-Za-z0-9_-]+\b/g) || []).length;
}

test('bcom-finance Days 31-35 Block 7 & Milestone 7 Capstone Expansion Invariants', async (t) => {
  await t.test('bcom-finance Course 02 Total Days Count Verification (Must have >= 35 days)', () => {
    assert.ok(
      BCOM_FINANCE_LONG_LESSONS.length >= 35,
      `BCOM_FINANCE_LONG_LESSONS must have at least 35 days (current: ${BCOM_FINANCE_LONG_LESSONS.length})`
    );
  });

  const targetDays = [31, 32, 33, 34, 35];

  for (const dayNum of targetDays) {
    const lesson = BCOM_FINANCE_LONG_LESSONS.find((l) => l.day === dayNum);
    assert.ok(lesson, `Day ${dayNum} must exist in BCOM_FINANCE_LONG_LESSONS`);

    await t.test(`bcom-finance Day ${dayNum} curriculum integrity & pedagogical standards`, () => {
      assert.equal(lesson.id, `bcom_fin-day-${dayNum}`);
      assert.equal(lesson.course, 'Corporate Finance & Capital Markets');
      assert.equal(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);

      let totalDayWords = 0;

      lesson.parts.forEach((part, idx) => {
        const partNum = idx + 1;
        assert.equal(part.part, partNum, `Day ${dayNum} Part ${partNum} index mismatch`);
        assert.ok(part.title && part.title.length > 5, `Day ${dayNum} Part ${partNum} must have a valid title`);

        const sayText = Array.isArray(part.say) ? part.say.join(' ') : String(part.say);
        const words = countWords(sayText);
        totalDayWords += words;
        assert.ok(
          words >= 580,
          `Day ${dayNum} Part ${partNum} word count (${words}) must be >= 580 words (Law 1)`
        );

        assert.ok(part.code && part.code.includes('print'), `Day ${dayNum} Part ${partNum} must contain Python code with print`);
        assert.ok(part.output && part.output.trim().length > 0, `Day ${dayNum} Part ${partNum} must contain non-empty output`);

        assert.ok(part.check, `Day ${dayNum} Part ${partNum} must have check question`);
        assert.equal(part.check.options.length, 4, `Day ${dayNum} Part ${partNum} check must have 4 options`);
        assert.equal(part.check.answer, 0, `Day ${dayNum} Part ${partNum} check.answer must be 0`);
        assert.equal(part.check.answerIndex, 0, `Day ${dayNum} Part ${partNum} check.answerIndex must be 0`);
        assert.ok(part.check.explanation && part.check.explanation.length > 10, `Day ${dayNum} Part ${partNum} must have explanation`);
        assert.ok(part.check.why && part.check.why.length > 10, `Day ${dayNum} Part ${partNum} must have why field`);
      });

      assert.ok(
        totalDayWords >= 3000,
        `Day ${dayNum} total words (${totalDayWords}) must be >= 3,000 words`
      );
    });

    await t.test(`bcom-finance Day ${dayNum} Gate v2 visual envelope verification (Law 2)`, () => {
      const visualPath = path.join(
        process.cwd(),
        'src/lib/data/lessonVisuals/bcom-finance',
        `day-${dayNum}.json`
      );
      assert.ok(fs.existsSync(visualPath), `Visual envelope file must exist at ${visualPath}`);

      const raw = fs.readFileSync(visualPath, 'utf-8');
      const envelope = JSON.parse(raw);

      assert.equal(envelope.schemaVersion, 1);
      assert.equal(envelope.prefix, 'bcom-finance');
      assert.equal(envelope.day, dayNum);
      assert.equal(envelope.entries.length, 5, `Day ${dayNum} visual envelope must have 5 entries`);

      envelope.entries.forEach((entry: any, idx: number) => {
        const correspondingPart = lesson.parts[idx];
        assert.equal(entry.partTitle, correspondingPart.title);

        const expectedHash = crypto.createHash('sha256').update(correspondingPart.code || '', 'utf-8').digest('hex');
        assert.equal(entry.codeHash, expectedHash, `Day ${dayNum} Part ${idx + 1} codeHash must match exact SHA-256`);

        assert.equal(entry.spec.template, 'ledger-sheet');
        assert.equal(entry.spec.steps.length, 4);

        entry.spec.steps.forEach((step: any) => {
          assert.equal(step.isBalanced, true, `Step '${step.title}' must be balanced`);
          assert.equal(step.totalDebit, step.totalCredit, `Step '${step.title}' debit must equal credit`);
        });
      });
    });
  }

  await t.test('bcom-finance Day 35 Milestone 7 Capstone Verification Token', () => {
    const day35 = BCOM_FINANCE_LONG_LESSONS.find((l) => l.day === 35);
    assert.ok(day35);
    assert.ok(day35.title.includes('Milestone 7') || day35.title.includes('Capstone'));

    const lastPart = day35.parts[4];
    assert.ok(
      lastPart.output.includes('INVESTMENT_BANKING_TRANSACTION_SIMULATOR_PASS'),
      'Day 35 Part 5 must emit INVESTMENT_BANKING_TRANSACTION_SIMULATOR_PASS'
    );
  });
});
