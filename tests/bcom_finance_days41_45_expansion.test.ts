// tests/bcom_finance_days41_45_expansion.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { BCOM_FINANCE_LONG_LESSONS } from '../src/lib/data/bcomFinanceLongLessons';

function countWords(text: string): number {
  return (text.match(/\b[A-Za-z0-9_-]+\b/g) || []).length;
}

test('bcom-finance Days 41-45 Block 9 & Milestone 9 Capstone Expansion Invariants', async (t) => {
  // 1. Total Days Count Invariant (Must now have at least 45 days)
  await t.test('bcom-finance Course 02 Total Days Count Verification (Must have >= 45 days)', () => {
    assert.ok(
      BCOM_FINANCE_LONG_LESSONS.length >= 45,
      `BCOM_FINANCE_LONG_LESSONS must have at least 45 days (current: ${BCOM_FINANCE_LONG_LESSONS.length})`
    );
    const dayNumbers = BCOM_FINANCE_LONG_LESSONS.map((l) => l.day);
    for (let d = 1; d <= 45; d++) {
      assert.ok(dayNumbers.includes(d), `Missing Day ${d} in BCOM_FINANCE_LONG_LESSONS`);
    }
  });

  // Verify each day 41-45 specifically
  const targetDays = [41, 42, 43, 44, 45];
  for (const dayNum of targetDays) {
    const lesson = BCOM_FINANCE_LONG_LESSONS.find((l) => l.day === dayNum);
    assert.ok(lesson, `Day ${dayNum} must exist in BCOM_FINANCE_LONG_LESSONS`);

    await t.test(`bcom-finance Day ${dayNum} curriculum integrity & pedagogical standards`, () => {
      assert.ok(lesson.title && lesson.title.length > 5, `Day ${dayNum} title missing or too short`);
      assert.equal(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);
      assert.ok(lesson.summary.length >= 4, `Day ${dayNum} summary must have >= 4 points`);
      assert.ok(lesson.projectStep && lesson.projectStep.steps.length >= 3, `Day ${dayNum} projectStep must have >= 3 steps`);

      let totalDayWords = 0;
      for (let idx = 0; idx < lesson.parts.length; idx++) {
        const part = lesson.parts[idx];
        assert.equal(part.part, idx + 1, `Part index mismatch in Day ${dayNum} Part ${idx + 1}`);
        assert.ok(part.title && part.title.length > 5, `Part ${idx + 1} title too short`);
        assert.ok(part.say.length >= 7, `Day ${dayNum} Part ${idx + 1} must have >= 7 paragraphs (found ${part.say.length})`);

        const partWords = part.say.reduce((sum, p) => sum + countWords(p), 0);
        assert.ok(partWords >= 580, `Day ${dayNum} Part ${idx + 1} word count must be >= 580 words (found ${partWords})`);
        totalDayWords += partWords;

        // Verify check invariants
        assert.ok(part.check, `Day ${dayNum} Part ${idx + 1} missing check object`);
        assert.equal(part.check.answer, 0, `Day ${dayNum} Part ${idx + 1} check answer must strictly be 0`);
        assert.equal(part.check.answerIndex, 0, `Day ${dayNum} Part ${idx + 1} check answerIndex must strictly be 0`);
        assert.equal(part.check.options.length, 4, `Day ${dayNum} Part ${idx + 1} check must have 4 options`);

        // Verify code execution & token
        assert.ok(part.code.includes('print('), `Day ${dayNum} Part ${idx + 1} code must contain print statement`);
        assert.ok(part.output && part.output.length > 50, `Day ${dayNum} Part ${idx + 1} output must be rich`);
      }

      assert.ok(totalDayWords >= 3000, `Day ${dayNum} total words must be >= 3000 (found ${totalDayWords})`);
    });

    await t.test(`bcom-finance Day ${dayNum} Gate v2 visual envelope verification (Law 2)`, () => {
      const visualPath = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom-finance', `day-${dayNum}.json`);
      assert.ok(fs.existsSync(visualPath), `Visual envelope file must exist at ${visualPath}`);

      const content = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
      assert.equal(content.prefix, 'bcom-finance', `Prefix must be 'bcom-finance'`);
      assert.equal(content.day, dayNum, `Visual day must equal ${dayNum}`);
      assert.equal(content.visuals.length, 5, `Must have exactly 5 visual entries for Day ${dayNum}`);

      for (let i = 0; i < content.visuals.length; i++) {
        const v = content.visuals[i];
        assert.equal(v.step, `part-${i + 1}`);
        assert.equal(v.template, 'ledger-sheet');
        assert.ok(v.data.sheet.isBalanced, `Ledger sheet must be balanced`);
        assert.equal(v.data.sheet.totalDebit, v.data.sheet.totalCredit, `Debit must equal Credit`);
        assert.ok(v.data.steps.length === 4, `Must have 4 steps in visual entry`);
        assert.ok(v.data.caption.length <= 75, `Caption must be <= 75 chars (found ${v.data.caption.length})`);
        assert.ok(v.data.caption.endsWith('.'), `Caption must end in a period`);
        assert.ok(!/\d/.test(v.data.caption), `Caption must contain zero digits`);
        assert.ok(v.codeBindings && v.codeBindings.length >= 1, `Must have valid codeBindings`);
      }
    });
  }

  // 3. Milestone 9 Capstone Verification Token Check
  await t.test('bcom-finance Day 45 Milestone 9 Capstone Verification Token', () => {
    const day45 = BCOM_FINANCE_LONG_LESSONS.find((l) => l.day === 45);
    assert.ok(day45, 'Day 45 must exist');
    const lastPart = day45.parts[4];
    assert.ok(
      lastPart.output.includes('QUANT_RISK_FIN_ENGINEERING_SIMULATOR_PASS'),
      'Day 45 Part 5 output must contain QUANT_RISK_FIN_ENGINEERING_SIMULATOR_PASS'
    );
  });
});
