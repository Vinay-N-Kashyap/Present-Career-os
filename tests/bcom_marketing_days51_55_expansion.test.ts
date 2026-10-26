import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BCOM_MKT_LONG_LESSONS } from '../src/lib/data/bcomMktLongLessons';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

describe('B.Com Marketing & Brand Systems Month 2 (Days 51-55 & Milestone 11 Capstone) Expansion Suite', () => {

  it('Day 51: Global Brand Governance, Trademark Portfolios & Multi-Jurisdictional IP Valuation', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 51);
    assert.ok(day, 'Day 51 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 51 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must contain at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 600, `Part ${idx + 1} word count (${words}) must be >= 600 words`);
      totalWords += words;

      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why && part.check.why.length >= 20, `Part ${idx + 1} check must have detailed why`);
    });

    assert.ok(totalWords >= 3000, `Day 51 total word count (${totalWords}) must be >= 3,000 words`);

    // Verify visual envelope
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-51.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 51');
    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);
    visualData.entries.forEach((entry: any, pIdx: number) => {
      assert.equal(entry.spec.template, 'funnel');
      assert.equal(entry.spec.steps.length, 4);
      const code = day.parts[pIdx].code || '';
      const expectedHash = crypto.createHash('sha256').update(code).digest('hex');
      assert.equal(entry.codeHash, expectedHash);
      entry.spec.steps.forEach((step: any) => {
        assert.ok(step.caption.length <= 75, `Caption too long: ${step.caption}`);
        assert.ok(step.caption.endsWith('.'), `Caption must end with dot: ${step.caption}`);
        assert.ok(!/\d/.test(step.caption), `Caption must contain no digits: ${step.caption}`);
      });
    });
  });

  it('Day 52: Marketing Operations (MOps), Agile Marketing Sprints & Creative Operations Governance', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 52);
    assert.ok(day, 'Day 52 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 52 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must contain at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 600, `Part ${idx + 1} word count (${words}) must be >= 600 words`);
      totalWords += words;

      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why && part.check.why.length >= 20, `Part ${idx + 1} check must have detailed why`);
    });

    assert.ok(totalWords >= 3000, `Day 52 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-52.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 52');
    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);
    visualData.entries.forEach((entry: any, pIdx: number) => {
      assert.equal(entry.spec.template, 'funnel');
      assert.equal(entry.spec.steps.length, 4);
      const code = day.parts[pIdx].code || '';
      const expectedHash = crypto.createHash('sha256').update(code).digest('hex');
      assert.equal(entry.codeHash, expectedHash);
      entry.spec.steps.forEach((step: any) => {
        assert.ok(step.caption.length <= 75, `Caption too long: ${step.caption}`);
        assert.ok(step.caption.endsWith('.'), `Caption must end with dot: ${step.caption}`);
        assert.ok(!/\d/.test(step.caption), `Caption must contain no digits: ${step.caption}`);
      });
    });
  });

  it('Day 53: Predictive Customer Analytics, Uplift Modeling & Algorithmic Churn Interventions', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 53);
    assert.ok(day, 'Day 53 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 53 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must contain at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 600, `Part ${idx + 1} word count (${words}) must be >= 600 words`);
      totalWords += words;

      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why && part.check.why.length >= 20, `Part ${idx + 1} check must have detailed why`);
    });

    assert.ok(totalWords >= 3000, `Day 53 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-53.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 53');
    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);
    visualData.entries.forEach((entry: any, pIdx: number) => {
      assert.equal(entry.spec.template, 'funnel');
      assert.equal(entry.spec.steps.length, 4);
      const code = day.parts[pIdx].code || '';
      const expectedHash = crypto.createHash('sha256').update(code).digest('hex');
      assert.equal(entry.codeHash, expectedHash);
      entry.spec.steps.forEach((step: any) => {
        assert.ok(step.caption.length <= 75, `Caption too long: ${step.caption}`);
        assert.ok(step.caption.endsWith('.'), `Caption must end with dot: ${step.caption}`);
        assert.ok(!/\d/.test(step.caption), `Caption must contain no digits: ${step.caption}`);
      });
    });
  });

  it('Day 54: Sustainable Marketing, ESG Brand Metrics, Carbon Audits & Anti-Greenwashing Compliance', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 54);
    assert.ok(day, 'Day 54 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 45);
    assert.equal(day.parts.length, 5, 'Day 54 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must contain at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 600, `Part ${idx + 1} word count (${words}) must be >= 600 words`);
      totalWords += words;

      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why && part.check.why.length >= 20, `Part ${idx + 1} check must have detailed why`);
    });

    assert.ok(totalWords >= 3000, `Day 54 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-54.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 54');
    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);
    visualData.entries.forEach((entry: any, pIdx: number) => {
      assert.equal(entry.spec.template, 'funnel');
      assert.equal(entry.spec.steps.length, 4);
      const code = day.parts[pIdx].code || '';
      const expectedHash = crypto.createHash('sha256').update(code).digest('hex');
      assert.equal(entry.codeHash, expectedHash);
      entry.spec.steps.forEach((step: any) => {
        assert.ok(step.caption.length <= 75, `Caption too long: ${step.caption}`);
        assert.ok(step.caption.endsWith('.'), `Caption must end with dot: ${step.caption}`);
        assert.ok(!/\d/.test(step.caption), `Caption must contain no digits: ${step.caption}`);
      });
    });
  });

  it('Day 55: Milestone 11 Capstone: Global Omnichannel Brand Governance & Predictive MOps Simulator', () => {
    const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === 55);
    assert.ok(day, 'Day 55 must be present in BCOM_MKT_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom-marketing');
    assert.equal(day.minutes, 60);
    assert.equal(day.parts.length, 5, 'Day 55 must contain exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must contain at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 600, `Part ${idx + 1} word count (${words}) must be >= 600 words`);
      totalWords += words;

      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why && part.check.why.length >= 20, `Part ${idx + 1} check must have detailed why`);
    });

    assert.ok(totalWords >= 3000, `Day 55 total word count (${totalWords}) must be >= 3,000 words`);

    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom-marketing/day-55.json');
    assert.ok(fs.existsSync(visualPath), 'On-disk visual file missing for Day 55');
    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);
    visualData.entries.forEach((entry: any, pIdx: number) => {
      assert.equal(entry.spec.template, 'funnel');
      assert.equal(entry.spec.steps.length, 4);
      const code = day.parts[pIdx].code || '';
      const expectedHash = crypto.createHash('sha256').update(code).digest('hex');
      assert.equal(entry.codeHash, expectedHash);
      entry.spec.steps.forEach((step: any) => {
        assert.ok(step.caption.length <= 75, `Caption too long: ${step.caption}`);
        assert.ok(step.caption.endsWith('.'), `Caption must end with dot: ${step.caption}`);
        assert.ok(!/\d/.test(step.caption), `Caption must contain no digits: ${step.caption}`);
      });
    });
  });

  it('Block 11 Aggregate Integrity: Days 51-55 Word Counts and Architectural Guardrails', () => {
    const blockDays = [51, 52, 53, 54, 55];
    let totalBlockWords = 0;

    blockDays.forEach((dayNum) => {
      const day = BCOM_MKT_LONG_LESSONS.find((l) => l.day === dayNum);
      assert.ok(day, `Day ${dayNum} must exist`);
      assert.equal(day.coursePrefix, 'bcom-marketing');
      assert.equal(day.parts.length, 5);

      day.parts.forEach((part, pIdx) => {
        // Assert no forbidden properties
        assert.equal((part as any).id, undefined, `Day ${dayNum} Part ${pIdx + 1} must not have id property`);
        assert.equal((part as any).courseId, undefined, `Day ${dayNum} Part ${pIdx + 1} must not have courseId property`);

        const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
        assert.ok(words >= 600, `Day ${dayNum} Part ${pIdx + 1} must be >= 600 words (actual: ${words})`);
        totalBlockWords += words;

        assert.equal(part.check.options.length, 4);
        assert.equal(part.check.answer, 0);
        assert.equal(part.check.answerIndex, 0);
        assert.ok(part.check.why.length >= 20);
        assert.ok(part.code && part.code.length > 50);
        assert.ok(part.output && part.output.length > 10);
      });
    });

    assert.ok(totalBlockWords >= 15000, `Block 11 total words (${totalBlockWords}) must be >= 15,000 words`);
  });

});
