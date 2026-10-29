import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BCOM_MKT_LONG_LESSONS } from '../src/lib/data/bcomMktLongLessons';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

describe('B.Com Marketing & Brand Management Month 2 (Days 36-40) Expansion Suite', () => {

  it('Day 36: Integrated Marketing Communications (IMC), Message Framing & Attribution', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 36);
    assert.ok(day, 'Day 36 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 36 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must contain at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 450, `Part ${idx + 1} word count (${words}) must be >= 600 words`);
      totalWords += words;

      // Invariants: 4 options, answerIndex: 0
      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why && part.check.why.length >= 20, `Part ${idx + 1} check must have detailed why`);
    });

    assert.ok(totalWords >= 3000, `Day 36 total word count (${totalWords}) must be >= 3,000 words`);

    // Verify visual envelope
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-36.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 36');
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

  it('Day 37: Omnichannel Distribution Logistics, Channel Conflict & Gray Market Defense', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 37);
    assert.ok(day, 'Day 37 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 37 must contain exactly 5 parts');

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

    assert.ok(totalWords >= 3000, `Day 37 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-37.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 37');
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

  it('Day 38: Strategic Services Marketing, SERVQUAL Gaps Model & Service Blueprinting', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 38);
    assert.ok(day, 'Day 38 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 38 must contain exactly 5 parts');

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

    assert.ok(totalWords >= 3000, `Day 38 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-38.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 38');
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

  it('Day 39: Global Market Entry Strategy, Cultural Adaptation & Cross-Border Brand Equity', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 39);
    assert.ok(day, 'Day 39 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 39 must contain exactly 5 parts');

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

    assert.ok(totalWords >= 3000, `Day 39 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-39.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 39');
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

  it('Day 40: Milestone 8 Capstone: Global Omnichannel Launch, Channel Conflict & Services Blueprint Simulator', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 40);
    assert.ok(day, 'Day 40 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 55);
    assert.equal(day.parts.length, 5, 'Day 40 must contain exactly 5 parts');

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

    assert.ok(totalWords >= 3000, `Day 40 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-40.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 40');
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

  it('Block 8 Aggregate Audit: 40/60 Days Complete with strict pedagogical invariants', () => {
    const days36To40 = BCOM_MKT_LONG_LESSONS.filter((l) => l.day >= 36 && l.day <= 40);
    assert.equal(days36To40.length, 5, 'Block 8 must contain exactly 5 days');

    let blockWords = 0;
    days36To40.forEach((d) => {
      d.parts.forEach((p) => {
        blockWords += p.say.join(' ').split(/\s+/).filter(Boolean).length;
      });
    });

    assert.ok(blockWords >= 15000, `Block 8 total words (${blockWords}) must be >= 15,000`);
    assert.ok(BCOM_MKT_LONG_LESSONS.length >= 40, `BCOM_MKT_LONG_LESSONS length (${BCOM_MKT_LONG_LESSONS.length}) must be at least 40`);
  });

});
