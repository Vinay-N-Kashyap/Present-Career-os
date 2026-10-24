// tests/bcom_finance_days51_55_expansion.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { BCOM_FINANCE_LONG_LESSONS } from '../src/lib/data/bcomFinanceLongLessons';

test('bcom-finance Days 51-55 Block 11 & Milestone 11 Capstone Expansion Invariants', async (t) => {
  const days51To55 = BCOM_FINANCE_LONG_LESSONS.filter(lesson => lesson.day >= 51 && lesson.day <= 55);

  await t.test('bcom-finance Course 02 Total Days Count Verification (Must have >= 55 days)', () => {
    assert.ok(BCOM_FINANCE_LONG_LESSONS.length >= 55, `Expected >= 55 days, got ${BCOM_FINANCE_LONG_LESSONS.length}`);
  });

  for (const lesson of days51To55) {
    await t.test(`bcom-finance Day ${lesson.day} curriculum integrity & pedagogical standards`, () => {
      assert.strictEqual(lesson.coursePrefix, 'bcom-finance', `Course prefix must be bcom-finance, got ${lesson.coursePrefix}`);
      assert.strictEqual(lesson.parts.length, 5, `Day ${lesson.day} must have exactly 5 parts`);

      let totalDayWords = 0;
      for (const part of lesson.parts) {
        assert.ok(part.part >= 1 && part.part <= 5, `Part number must be between 1 and 5`);
        assert.ok(part.title && part.title.length > 5, `Part ${part.part} must have a descriptive title`);
        assert.ok(Array.isArray(part.say) && part.say.length >= 7, `Part ${part.part} must have >= 7 paragraphs`);

        const partWords = part.say.reduce((sum, p) => sum + p.split(/\s+/).filter(Boolean).length, 0);
        assert.ok(partWords >= 600, `Part ${part.part} word count must be >= 600, got ${partWords}`);
        totalDayWords += partWords;

        assert.ok(part.example && part.example.length > 5, `Part ${part.part} missing example`);
        assert.ok(part.tryIt && part.tryIt.length > 5, `Part ${part.part} missing tryIt`);

        assert.ok(part.check, `Part ${part.part} missing check`);
        assert.strictEqual(part.check.answer, 0, `Check answer must be 0 for pedagogical standard`);
        assert.ok(part.check.options.length >= 4, `Check must have >= 4 options`);
      }

      assert.ok(totalDayWords >= 3000, `Day ${lesson.day} total word count must be >= 3000, got ${totalDayWords}`);

      // Part 5 must contain standalone runnable Python code
      const part5 = lesson.parts[4];
      assert.ok(part5.code && part5.code.includes('def main():'), `Day ${lesson.day} Part 5 must contain runnable Python code`);
    });

    await t.test(`bcom-finance Day ${lesson.day} Gate v2 visual envelope verification (Law 2)`, () => {
      const visualFilePath = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom-finance', `day-${lesson.day}.json`);
      assert.ok(fs.existsSync(visualFilePath), `Visual envelope missing at ${visualFilePath}`);

      const visualData = JSON.parse(fs.readFileSync(visualFilePath, 'utf-8'));
      assert.strictEqual(visualData.prefix, 'bcom-finance', `Prefix must be bcom-finance`);
      assert.strictEqual(visualData.day, lesson.day, `Day number mismatch`);
      assert.strictEqual(visualData.visuals.length, 5, `Must have exactly 5 visual entries`);

      for (const entry of visualData.visuals) {
        assert.strictEqual(entry.template, 'ledger-sheet', `Visual template must be ledger-sheet`);
        assert.ok(entry.caption && entry.caption.length <= 75, `Caption must be <= 75 chars`);
        assert.ok(entry.caption.endsWith('.'), `Caption must end with period`);
        assert.ok(!/\d/.test(entry.caption), `Caption must contain zero digits`);
        assert.strictEqual(entry.data.isBalanced, true, `Ledger sheet must balance`);
        assert.strictEqual(entry.data.steps.length, 4, `Must have 4 interactive steps`);
        assert.ok(entry.codeBinding && entry.codeBinding.verified, `Code binding must be verified`);
      }
    });
  }

  await t.test('bcom-finance Day 55 Milestone 11 Capstone Verification Token', () => {
    const day55 = days51To55.find(l => l.day === 55);
    assert.ok(day55, 'Day 55 not found');
    const part5 = day55.parts[4];
    assert.ok(part5.code && part5.code.includes('SOVEREIGN_INFRASTRUCTURE_ESG_MASTER_CAPSTONE_PASS'), 'Day 55 missing capstone token');
  });
});
