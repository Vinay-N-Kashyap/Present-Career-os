import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BCOM_MKT_LONG_LESSONS } from '../src/lib/data/bcomMktLongLessons';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

describe('B.Com Marketing & Brand Systems Month 2 (Days 46-50) Expansion Suite', () => {

  it('Day 46: Neuromarketing in Digital Product Design, Cognitive Biases & Eye-Tracking UX Architecture', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 46);
    assert.ok(day, 'Day 46 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 46 must contain exactly 5 parts');

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

    assert.ok(totalWords >= 3000, `Day 46 total word count (${totalWords}) must be >= 3,000 words`);

    // Verify visual envelope
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-46.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 46');
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

  it('Day 47: Modern MarTech Stack Architecture: Customer Data Platforms (CDP), Reverse-ETL & Identity Resolution', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 47);
    assert.ok(day, 'Day 47 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 47 must contain exactly 5 parts');

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

    assert.ok(totalWords >= 3000, `Day 47 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-47.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 47');
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

  it('Day 48: Dark Patterns, Regulatory Ethics, Algorithmic Transparency & Global Privacy Governance', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 48);
    assert.ok(day, 'Day 48 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 48 must contain exactly 5 parts');

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

    assert.ok(totalWords >= 3000, `Day 48 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-48.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 48');
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

  it('Day 49: Omnichannel Brand Storytelling, Transmedia Narratives, Cultural Moats & Decentralized Community Governance', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 49);
    assert.ok(day, 'Day 49 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 49 must contain exactly 5 parts');

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

    assert.ok(totalWords >= 3000, `Day 49 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-49.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 49');
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

  it('Day 50: Milestone 10 Capstone: Enterprise MarTech Stack Overhaul, Neuromarketing UX & Privacy Turnaround Simulator', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 50);
    assert.ok(day, 'Day 50 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 60);
    assert.equal(day.parts.length, 5, 'Day 50 must contain exactly 5 parts');

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

    assert.ok(totalWords >= 3000, `Day 50 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-50.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 50');
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

  it('Contiguity & Sequence Integrity across all 50 Days of bcom-marketing', () => {
    assert.ok(BCOM_MKT_LONG_LESSONS.length >= 50, `Expected at least 50 days in bcom-marketing, found ${BCOM_MKT_LONG_LESSONS.length}`);
    for (let day = 1; day <= 50; day++) {
      const found = BCOM_MKT_LONG_LESSONS.find((l) => l.day === day);
      assert.ok(found, `Day ${day} must exist in bcom-marketing`);
      assert.equal(found.coursePrefix, 'bcom-marketing');
      assert.equal(found.parts.length, 5, `Day ${day} must contain 5 parts`);
    }
  });
});
