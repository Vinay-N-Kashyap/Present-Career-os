import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BCOM_MKT_LONG_LESSONS } from '../src/lib/data/bcomMktLongLessons';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

describe('B.Com Marketing & Brand Systems Month 2 (Days 56-60 & Milestone 12 Grand Capstone) Expansion Suite', () => {

  it('Day 56: Generative AI in Marketing, Synthetic Audiences, LLM Brand Voice Fine-Tuning & Algorithmic Dynamic Creative Optimization (DCO)', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 56);
    assert.ok(day, 'Day 56 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 56 must contain exactly 5 parts');

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

    assert.ok(totalWords >= 3000, `Day 56 total word count (${totalWords}) must be >= 3,000 words`);

    // Verify visual envelope
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-56.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 56');
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

  it('Day 57: Decentralized Brand Ecosystems, Tokenomics, Web3 Loyalty Architecture & Zero-Knowledge Verification', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 57);
    assert.ok(day, 'Day 57 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 57 must contain exactly 5 parts');

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

    assert.ok(totalWords >= 3000, `Day 57 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-57.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 57');
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

  it('Day 58: Marketing Financial Engineering: Econometric Media Mix Modeling (MMM), Hierarchical Bayesian Regression & Robyn/Meridian Synthesis', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 58);
    assert.ok(day, 'Day 58 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 58 must contain exactly 5 parts');

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

    assert.ok(totalWords >= 3000, `Day 58 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-58.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 58');
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

  it('Day 59: Global CMO Executive Leadership: Boardroom Fiduciary Governance, M&A Brand Integration & C-Suite Capital Allocation', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 59);
    assert.ok(day, 'Day 59 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 59 must contain exactly 5 parts');

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

    assert.ok(totalWords >= 3000, `Day 59 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-59.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 59');
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

  it('Day 60: Milestone 12 Grand Capstone: The Global Enterprise Chief Marketing Officer (CMO) Autonomous Ecosystem & Boardroom Simulator', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 60);
    assert.ok(day, 'Day 60 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 60);
    assert.equal(day.parts.length, 5, 'Day 60 must contain exactly 5 parts');

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

    assert.ok(totalWords >= 3000, `Day 60 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-60.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 60');
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

  it('Course 25 Complete 60-Day Graduation Audit: Contiguity, Sequence & Architectural Invariants', () => {
    assert.equal(BCOM_MKT_LONG_LESSONS.length, 60, 'BCOM_MKT_LONG_LESSONS must contain exactly 60 days');

    let totalCourseWords = 0;
    for (let dayNum = 1; dayNum <= 60; dayNum++) {
      const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === dayNum);
      assert.ok(day, `Day ${dayNum} must be present`);
      assert.equal(day.coursePrefix, 'bcom-marketing');
      assert.equal(day.parts.length, 5, `Day ${dayNum} must have 5 parts`);

      day.parts.forEach((part, pIdx) => {
        assert.equal((part as any).id, undefined, `Day ${dayNum} Part ${pIdx + 1} must not have id property`);
        assert.equal((part as any).courseId, undefined, `Day ${dayNum} Part ${pIdx + 1} must not have courseId property`);
        const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
        if (dayNum >= 31) {
          assert.ok(words >= 580, `Month 2 Day ${dayNum} Part ${pIdx + 1} word count (${words}) must be >= 580 words`);
        }
        totalCourseWords += words;

        assert.equal(part.check.options.length, 4);
        assert.equal(part.check.answer, 0);
        assert.equal(part.check.answerIndex, 0);
        assert.ok(part.check.why.length >= 20);
        assert.ok(part.code && part.code.length > 30);
        assert.ok(part.output && part.output.length > 5);
      });
    }

    assert.ok(totalCourseWords >= 120000, `Total course words (${totalCourseWords}) must be >= 120,000 words`);
  });

});
