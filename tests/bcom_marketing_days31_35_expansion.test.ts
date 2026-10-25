import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BCOM_MKT_LONG_LESSONS } from '../src/lib/data/bcomMktLongLessons';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

describe('B.Com Marketing & Brand Management Month 2 (Days 31-35) Expansion Suite', () => {

  it('Day 31: Brand Portfolio Architecture, Brand Relationship Spectrum & Cannibalization', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 31);
    assert.ok(day, 'Day 31 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 42);
    assert.equal(day.parts.length, 5, 'Day 31 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must contain at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 600, `Part ${idx + 1} word count (${words}) must be >= 600 words`);
      totalWords += words;

      // Invariants: 4 options, answerIndex: 0
      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why && part.check.why.length >= 20, `Part ${idx + 1} check must have detailed why`);
    });

    assert.ok(totalWords >= 3000, `Day 31 total word count (${totalWords}) must be >= 3,000 words`);

    // Verify visual envelope
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-31.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 31');
    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);
    visualData.entries.forEach((entry: any, pIdx: number) => {
      assert.equal(entry.partTitle, day.parts[pIdx].title);
      assert.equal(entry.spec.template, 'funnel');
      assert.equal(entry.spec.steps.length, 4);
      const expectedHash = crypto.createHash('sha256').update(day.parts[pIdx].code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash);
      entry.spec.steps.forEach((step: any) => {
        assert.ok(step.caption.length <= 75, `Caption too long: ${step.caption}`);
        assert.ok(step.caption.endsWith('.'), `Caption must end with dot: ${step.caption}`);
        assert.ok(!/\d/.test(step.caption), `Caption must contain zero digits: ${step.caption}`);
      });
    });
  });

  it('Day 32: Neuromarketing, Dual-Process Cognition, Loss Aversion & Asymmetric Decoys', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 32);
    assert.ok(day, 'Day 32 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.parts.length, 5, 'Day 32 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 600, `Day 32 Part ${idx + 1} word count (${words}) must be >= 600`);
      totalWords += words;

      assert.equal(part.check.options.length, 4);
      assert.equal(part.check.answer, 0);
      assert.equal(part.check.answerIndex, 0);
    });

    assert.ok(totalWords >= 3000, `Day 32 total word count (${totalWords}) must be >= 3,000 words`);

    // Verify visual envelope
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-32.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 32');
    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);
  });

  it('Day 33: Strategic Market Penetration, Blue Ocean Strategy & ERRC Grid', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 33);
    assert.ok(day, 'Day 33 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.parts.length, 5, 'Day 33 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 600, `Day 33 Part ${idx + 1} word count (${words}) must be >= 600`);
      totalWords += words;

      assert.equal(part.check.options.length, 4);
      assert.equal(part.check.answer, 0);
      assert.equal(part.check.answerIndex, 0);
    });

    assert.ok(totalWords >= 3000, `Day 33 total word count (${totalWords}) must be >= 3,000 words`);

    // Verify visual envelope
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-33.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 33');
    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);
  });

  it('Day 34: Enterprise Brand Valuation, ISO 10668 Royalty Relief & IAS 36 Impairment', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 34);
    assert.ok(day, 'Day 34 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.parts.length, 5, 'Day 34 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 600, `Day 34 Part ${idx + 1} word count (${words}) must be >= 600`);
      totalWords += words;

      assert.equal(part.check.options.length, 4);
      assert.equal(part.check.answer, 0);
      assert.equal(part.check.answerIndex, 0);
    });

    assert.ok(totalWords >= 3000, `Day 34 total word count (${totalWords}) must be >= 3,000 words`);

    // Verify visual envelope
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-34.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 34');
    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);
  });

  it('Day 35: Milestone 7 Capstone: Global Brand Turnaround & Master Accreditation', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 35);
    assert.ok(day, 'Day 35 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.parts.length, 5, 'Day 35 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 600, `Day 35 Part ${idx + 1} word count (${words}) must be >= 600`);
      totalWords += words;

      assert.equal(part.check.options.length, 4);
      assert.equal(part.check.answer, 0);
      assert.equal(part.check.answerIndex, 0);
    });

    assert.ok(totalWords >= 3000, `Day 35 total word count (${totalWords}) must be >= 3,000 words`);

    // Verify Capstone Token
    const p5 = day.parts[4];
    assert.ok(p5.say.some(s => s.includes('ENTERPRISE_BRAND_PORTFOLIO_MASTER_PASS')), 'Must confer master pass token');
    assert.ok(p5.code.includes('ENTERPRISE_BRAND_PORTFOLIO_MASTER_PASS'), 'Code must verify master token');

    // Verify visual envelope
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-35.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 35');
    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);
  });

  it('Contiguity & Sequence Integrity across all 35 Days of bcom-marketing', () => {
    assert.equal(BCOM_MKT_LONG_LESSONS.length, 35, 'BCOM_MKT_LONG_LESSONS must contain exactly 35 days');
    for (let day = 1; day <= 35; day++) {
      const found = BCOM_MKT_LONG_LESSONS.find((l) => l.day === day);
      assert.ok(found, `Day ${day} must exist in sequential order`);
      assert.equal(found.day, day);
      assert.equal(found.coursePrefix, 'bcom-marketing');
      assert.equal(found.parts.length, 5);
    }
  });

});
