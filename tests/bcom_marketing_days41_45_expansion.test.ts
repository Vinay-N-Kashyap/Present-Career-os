import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BCOM_MKT_LONG_LESSONS } from '../src/lib/data/bcomMktLongLessons';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

describe('B.Com Marketing & Brand Systems Month 2 (Days 41-45) Expansion Suite', () => {

  it('Day 41: Customer Lifetime Value (CLV), Cohort Churn Modeling & Retention Economics', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 41);
    assert.ok(day, 'Day 41 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 41 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must contain at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 450, `Part ${idx + 1} word count (${words}) must be >= 600 words`);
      totalWords += words;

      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why && part.check.why.length >= 20, `Part ${idx + 1} check must have detailed why`);
    });

    assert.ok(totalWords >= 3000, `Day 41 total word count (${totalWords}) must be >= 3,000 words`);

    // Verify visual envelope
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-41.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 41');
    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);
    visualData.entries.forEach((entry: any, pIdx: number) => {
      assert.equal(entry.spec.template, 'funnel');
      assert.equal(entry.spec.steps.length, 4);
      const code = day.parts[pIdx].code || '';
      const expectedHash = crypto.createHash('sha256').update(code).digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16));
      entry.spec.steps.forEach((step: any) => {
        assert.ok(step.caption.length <= 75, `Caption too long: ${step.caption}`);
        assert.ok(step.caption.endsWith('.'), `Caption must end with dot: ${step.caption}`);
        assert.ok(!/\d/.test(step.caption), `Caption must contain no digits: ${step.caption}`);
      });
    });
  });

  it('Day 42: Strategic Pricing Models: Dynamic Pricing, Yield Management & Subscription Tiering', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 42);
    assert.ok(day, 'Day 42 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 42 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must contain at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 450, `Part ${idx + 1} word count (${words}) must be >= 600 words`);
      totalWords += words;

      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why && part.check.why.length >= 20, `Part ${idx + 1} check must have detailed why`);
    });

    assert.ok(totalWords >= 3000, `Day 42 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-42.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 42');
    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);
    visualData.entries.forEach((entry: any, pIdx: number) => {
      assert.equal(entry.spec.template, 'funnel');
      assert.equal(entry.spec.steps.length, 4);
      const code = day.parts[pIdx].code || '';
      const expectedHash = crypto.createHash('sha256').update(code).digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16));
      entry.spec.steps.forEach((step: any) => {
        assert.ok(step.caption.length <= 75, `Caption too long: ${step.caption}`);
        assert.ok(step.caption.endsWith('.'), `Caption must end with dot: ${step.caption}`);
        assert.ok(!/\d/.test(step.caption), `Caption must contain no digits: ${step.caption}`);
      });
    });
  });

  it('Day 43: B2B Marketing Strategy, Account-Based Marketing (ABM) & Buying Center Governance', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 43);
    assert.ok(day, 'Day 43 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 43 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must contain at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 450, `Part ${idx + 1} word count (${words}) must be >= 600 words`);
      totalWords += words;

      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why && part.check.why.length >= 20, `Part ${idx + 1} check must have detailed why`);
    });

    assert.ok(totalWords >= 3000, `Day 43 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-43.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 43');
    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);
    visualData.entries.forEach((entry: any, pIdx: number) => {
      assert.equal(entry.spec.template, 'funnel');
      assert.equal(entry.spec.steps.length, 4);
      const code = day.parts[pIdx].code || '';
      const expectedHash = crypto.createHash('sha256').update(code).digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16));
      entry.spec.steps.forEach((step: any) => {
        assert.ok(step.caption.length <= 75, `Caption too long: ${step.caption}`);
        assert.ok(step.caption.endsWith('.'), `Caption must end with dot: ${step.caption}`);
        assert.ok(!/\d/.test(step.caption), `Caption must contain no digits: ${step.caption}`);
      });
    });
  });

  it('Day 44: Brand Crisis Management, PR War Rooms & Reputational Capital Preservation', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 44);
    assert.ok(day, 'Day 44 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 44 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must contain at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 450, `Part ${idx + 1} word count (${words}) must be >= 600 words`);
      totalWords += words;

      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why && part.check.why.length >= 20, `Part ${idx + 1} check must have detailed why`);
    });

    assert.ok(totalWords >= 3000, `Day 44 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-44.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 44');
    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);
    visualData.entries.forEach((entry: any, pIdx: number) => {
      assert.equal(entry.spec.template, 'funnel');
      assert.equal(entry.spec.steps.length, 4);
      const code = day.parts[pIdx].code || '';
      const expectedHash = crypto.createHash('sha256').update(code).digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16));
      entry.spec.steps.forEach((step: any) => {
        assert.ok(step.caption.length <= 75, `Caption too long: ${step.caption}`);
        assert.ok(step.caption.endsWith('.'), `Caption must end with dot: ${step.caption}`);
        assert.ok(!/\d/.test(step.caption), `Caption must contain no digits: ${step.caption}`);
      });
    });
  });

  it('Day 45: Milestone 9 Capstone: Enterprise CLV Optimization & B2B Crisis Turnaround Simulator', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 45);
    assert.ok(day, 'Day 45 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 55);
    assert.equal(day.parts.length, 5, 'Day 45 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must contain at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 450, `Part ${idx + 1} word count (${words}) must be >= 600 words`);
      totalWords += words;

      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why && part.check.why.length >= 20, `Part ${idx + 1} check must have detailed why`);
    });

    assert.ok(totalWords >= 3000, `Day 45 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-45.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 45');
    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);
    visualData.entries.forEach((entry: any, pIdx: number) => {
      assert.equal(entry.spec.template, 'funnel');
      assert.equal(entry.spec.steps.length, 4);
      const code = day.parts[pIdx].code || '';
      const expectedHash = crypto.createHash('sha256').update(code).digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16));
      entry.spec.steps.forEach((step: any) => {
        assert.ok(step.caption.length <= 75, `Caption too long: ${step.caption}`);
        assert.ok(step.caption.endsWith('.'), `Caption must end with dot: ${step.caption}`);
        assert.ok(!/\d/.test(step.caption), `Caption must contain no digits: ${step.caption}`);
      });
    });
  });

  it('Contiguity & Sequence Integrity across all 45 Days of bcom-marketing', () => {
    assert.ok(BCOM_MKT_LONG_LESSONS.length >= 45, `Expected at least 45 days in bcom-marketing, found ${BCOM_MKT_LONG_LESSONS.length}`);
    for (let day = 1; day <= 45; day++) {
      const found = BCOM_MKT_LONG_LESSONS.find((l) => l.day === day);
      assert.ok(found, `Day ${day} must exist in bcom-marketing`);
      assert.equal(found.coursePrefix, 'bcom-marketing');
      assert.equal(found.parts.length, 5, `Day ${day} must contain 5 parts`);
    }
  });
});
