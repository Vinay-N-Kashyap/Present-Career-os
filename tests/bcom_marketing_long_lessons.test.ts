import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';

test('Block 29: bcom-marketing Day 1 long lesson resolves with full 5-part pedagogical structure', () => {
  const lesson = getLongLesson('bcom-marketing', 1);
  assert.ok(lesson, 'bcom-marketing Day 1 must resolve');
  assert.equal(lesson.day, 1);
  assert.equal(lesson.parts.length, 5, 'Must contain exactly 5 in-depth parts');

  // Verify alias resolution for bcom_mkt
  const aliased = getLongLesson('bcom_mkt', 1);
  assert.ok(aliased, 'bcom_mkt alias must resolve');
  assert.equal(aliased.title, lesson.title);

  // Assert language mapping
  assert.equal(getLongLessonLanguage('bcom-marketing'), 'python');
  assert.equal(getLongLessonLanguage('bcom_mkt'), 'python');

  // Assert realistic lesson length
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 9, `Spoken minutes (${spoken}) must be at least 9 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 29: bcom-marketing parts uphold strict code, output, and check question invariants', () => {
  const lesson = getLongLesson('bcom-marketing', 1)!;

  lesson.parts.forEach((part, idx) => {
    assert.ok(part.title, `Part ${idx + 1} must have a title`);
    assert.ok(Array.isArray(part.say) && part.say.length >= 3, `Part ${idx + 1} must have detailed teaching paragraphs`);
    assert.ok(part.example, `Part ${idx + 1} must include an everyday example`);
    assert.ok(part.code, `Part ${idx + 1} must include executable Python code`);
    assert.ok(part.output, `Part ${idx + 1} must include expected console output`);
    assert.ok(part.tryIt, `Part ${idx + 1} must include a tryIt interactive challenge`);

    // Check quiz contract
    assert.ok(part.check.question, `Part ${idx + 1} check must have question text`);
    assert.ok(Array.isArray(part.check.options) && part.check.options.length >= 3, `Part ${idx + 1} check must have >= 3 options`);
    assert.equal(typeof part.check.answer, 'number', `Part ${idx + 1} check must have numerical answer`);
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, `Part ${idx + 1} answer must be in options range`);
    assert.ok(part.check.why, `Part ${idx + 1} check must have educational rationale`);
  });

  // Verify specific Part concepts
  assert.match(lesson.parts[0].title, /5 Competing Organizational Orientations/i);
  assert.match(lesson.parts[1].title, /Customer Value Equation/i);
  assert.match(lesson.parts[2].title, /Expectation-Disconfirmation/i);
  assert.match(lesson.parts[3].title, /STP/i);
  assert.match(lesson.parts[4].title, /CBBE/i);
});

test('Block 29: nlp quest prefix parity resolves directly to NLP long lessons', () => {
  const nlpLesson = getLongLesson('nlp', 1);
  assert.ok(nlpLesson, 'nlp quest prefix must resolve to Day 1 long lesson');
  assert.equal(nlpLesson.day, 1);
  assert.ok(nlpLesson.parts.length >= 5, 'NLP lesson must have >= 5 parts');
  assert.equal(getLongLessonLanguage('nlp'), 'python');
});

test('Block 30: bcom-marketing Day 2 long lesson resolves with 5 in-depth parts', () => {
  const lesson = getLongLesson('bcom-marketing', 2);
  assert.ok(lesson, 'bcom-marketing Day 2 must resolve');
  assert.equal(lesson.day, 2);
  assert.equal(lesson.parts.length, 5, 'Must contain exactly 5 in-depth parts');

  // Verify alias resolution for bcom_mkt Day 2
  const aliased = getLongLesson('bcom_mkt', 2);
  assert.ok(aliased, 'bcom_mkt alias Day 2 must resolve');
  assert.equal(aliased.title, lesson.title);

  // Assert realistic lesson length
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 9, `Spoken minutes (${spoken}) must be at least 9 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 30: bcom-marketing Day 2 parts uphold strict code, output, and check question invariants', () => {
  const lesson = getLongLesson('bcom-marketing', 2)!;

  lesson.parts.forEach((part, idx) => {
    assert.ok(part.title, `Day 2 Part ${idx + 1} must have a title`);
    assert.ok(Array.isArray(part.say) && part.say.length >= 3, `Day 2 Part ${idx + 1} must have detailed teaching paragraphs`);
    assert.ok(part.example, `Day 2 Part ${idx + 1} must include an everyday example`);
    assert.ok(part.code, `Day 2 Part ${idx + 1} must include executable Python code`);
    assert.ok(part.output, `Day 2 Part ${idx + 1} must include expected console output`);
    assert.ok(part.tryIt, `Day 2 Part ${idx + 1} must include a tryIt interactive challenge`);

    // Check quiz contract
    assert.ok(part.check.question, `Day 2 Part ${idx + 1} check must have question text`);
    assert.ok(Array.isArray(part.check.options) && part.check.options.length >= 3, `Day 2 Part ${idx + 1} check must have >= 3 options`);
    assert.equal(typeof part.check.answer, 'number', `Day 2 Part ${idx + 1} check must have numerical answer`);
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, `Day 2 Part ${idx + 1} answer must be in options range`);
    assert.ok(part.check.why, `Day 2 Part ${idx + 1} check must have educational rationale`);
  });

  // Verify specific Day 2 concepts
  assert.match(lesson.parts[0].title, /PESTLE/i);
  assert.match(lesson.parts[1].title, /Porter.*Five.*Forces/i);
  assert.match(lesson.parts[2].title, /Substitutes.*Cross-Price Elasticity/i);
  assert.match(lesson.parts[3].title, /Buyer & Supplier Power.*Value Chain/i);
  assert.match(lesson.parts[4].title, /TOWS.*Action Grid/i);
});

test('Block 31: bcom-marketing Day 3 long lesson resolves with 5 in-depth parts', () => {
  const lesson = getLongLesson('bcom-marketing', 3);
  assert.ok(lesson, 'bcom-marketing Day 3 must resolve');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5, 'Must contain exactly 5 in-depth parts');

  // Verify alias resolution for bcom_mkt Day 3
  const aliased = getLongLesson('bcom_mkt', 3);
  assert.ok(aliased, 'bcom_mkt alias Day 3 must resolve');
  assert.equal(aliased.title, lesson.title);

  // Assert realistic lesson length
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 9, `Spoken minutes (${spoken}) must be at least 9 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 31: bcom-marketing Day 3 parts uphold strict code, output, and check question invariants', () => {
  const lesson = getLongLesson('bcom-marketing', 3)!;

  lesson.parts.forEach((part, idx) => {
    assert.ok(part.title, `Day 3 Part ${idx + 1} must have a title`);
    assert.ok(Array.isArray(part.say) && part.say.length >= 3, `Day 3 Part ${idx + 1} must have detailed teaching paragraphs`);
    assert.ok(part.example, `Day 3 Part ${idx + 1} must include an everyday example`);
    assert.ok(part.code, `Day 3 Part ${idx + 1} must include executable Python code`);
    assert.ok(part.output, `Day 3 Part ${idx + 1} must include expected console output`);
    assert.ok(part.tryIt, `Day 3 Part ${idx + 1} must include a tryIt interactive challenge`);

    // Check quiz contract
    assert.ok(part.check.question, `Day 3 Part ${idx + 1} check must have question text`);
    assert.ok(Array.isArray(part.check.options) && part.check.options.length >= 3, `Day 3 Part ${idx + 1} check must have >= 3 options`);
    assert.equal(typeof part.check.answer, 'number', `Day 3 Part ${idx + 1} check must have numerical answer`);
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, `Day 3 Part ${idx + 1} answer must be in options range`);
    assert.ok(part.check.why, `Day 3 Part ${idx + 1} check must have educational rationale`);
  });

  // Verify specific Day 3 concepts
  assert.match(lesson.parts[0].title, /5-Stage Consumer Buying Decision Process/i);
  assert.match(lesson.parts[1].title, /Maslow.*Selective Perceptual Defense/i);
  assert.match(lesson.parts[2].title, /Reference Groups.*Conspicuous/i);
  assert.match(lesson.parts[3].title, /Fishbein Attitude/i);
  assert.match(lesson.parts[4].title, /Cognitive Dissonance.*Buyer.*Remorse/i);
});

test('Block 32: bcom-marketing Day 4 long lesson resolves with 5 in-depth parts', () => {
  const lesson = getLongLesson('bcom-marketing', 4);
  assert.ok(lesson, 'bcom-marketing Day 4 must resolve');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5, 'Must contain exactly 5 in-depth parts');

  // Verify alias resolution for bcom_mkt Day 4
  const aliased = getLongLesson('bcom_mkt', 4);
  assert.ok(aliased, 'bcom_mkt alias Day 4 must resolve');
  assert.equal(aliased.title, lesson.title);

  // Assert realistic lesson length
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 9, `Spoken minutes (${spoken}) must be at least 9 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 32: bcom-marketing Day 4 parts uphold strict code, output, and check question invariants', () => {
  const lesson = getLongLesson('bcom-marketing', 4)!;

  lesson.parts.forEach((part, idx) => {
    assert.ok(part.title, `Day 4 Part ${idx + 1} must have a title`);
    assert.ok(Array.isArray(part.say) && part.say.length >= 3, `Day 4 Part ${idx + 1} must have detailed teaching paragraphs`);
    assert.ok(part.example, `Day 4 Part ${idx + 1} must include an everyday example`);
    assert.ok(part.code, `Day 4 Part ${idx + 1} must include executable Python code`);
    assert.ok(part.output, `Day 4 Part ${idx + 1} must include expected console output`);
    assert.ok(part.tryIt, `Day 4 Part ${idx + 1} must include a tryIt interactive challenge`);

    // Check quiz contract
    assert.ok(part.check.question, `Day 4 Part ${idx + 1} check must have question text`);
    assert.ok(Array.isArray(part.check.options) && part.check.options.length >= 3, `Day 4 Part ${idx + 1} check must have >= 3 options`);
    assert.equal(typeof part.check.answer, 'number', `Day 4 Part ${idx + 1} check must have numerical answer`);
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, `Day 4 Part ${idx + 1} answer must be in options range`);
    assert.ok(part.check.why, `Day 4 Part ${idx + 1} check must have educational rationale`);
  });

  // Verify specific Day 4 concepts
  assert.match(lesson.parts[0].title, /5-Step Marketing Research Process.*Cochran/i);
  assert.match(lesson.parts[1].title, /Survey Instrument.*Likert.*Neutrality/i);
  assert.match(lesson.parts[2].title, /Demand Forecasting.*Moving Averages.*Exponential Smoothing/i);
  assert.match(lesson.parts[3].title, /Market Sizing.*TAM.*SAM.*SOM/i);
  assert.match(lesson.parts[4].title, /Delphi Method.*Expert Consensus/i);
});

test('Block 33: bcom-marketing Day 5 long lesson resolves with 5 in-depth parts', () => {
  const lesson = getLongLesson('bcom-marketing', 5);
  assert.ok(lesson, 'bcom-marketing Day 5 must resolve');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5, 'Must contain exactly 5 in-depth parts');

  // Verify alias resolution for bcom_mkt Day 5
  const aliased = getLongLesson('bcom_mkt', 5);
  assert.ok(aliased, 'bcom_mkt alias Day 5 must resolve');
  assert.equal(aliased.title, lesson.title);

  // Assert realistic lesson length
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 9, `Spoken minutes (${spoken}) must be at least 9 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 33: bcom-marketing Day 5 parts uphold strict code, output, and check question invariants', () => {
  const lesson = getLongLesson('bcom-marketing', 5)!;

  lesson.parts.forEach((part, idx) => {
    assert.ok(part.title, `Day 5 Part ${idx + 1} must have a title`);
    assert.ok(Array.isArray(part.say) && part.say.length >= 3, `Day 5 Part ${idx + 1} must have detailed teaching paragraphs`);
    assert.ok(part.example, `Day 5 Part ${idx + 1} must include an everyday example`);
    assert.ok(part.code, `Day 5 Part ${idx + 1} must include executable Python code`);
    assert.ok(part.output, `Day 5 Part ${idx + 1} must include expected console output`);
    assert.ok(part.tryIt, `Day 5 Part ${idx + 1} must include a tryIt interactive challenge`);

    // Check quiz contract
    assert.ok(part.check.question, `Day 5 Part ${idx + 1} check must have question text`);
    assert.ok(Array.isArray(part.check.options) && part.check.options.length >= 3, `Day 5 Part ${idx + 1} check must have >= 3 options`);
    assert.equal(typeof part.check.answer, 'number', `Day 5 Part ${idx + 1} check must have numerical answer`);
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, `Day 5 Part ${idx + 1} answer must be in options range`);
    assert.ok(part.check.why, `Day 5 Part ${idx + 1} check must have educational rationale`);
  });

  // Verify specific Day 5 concepts
  assert.match(lesson.parts[0].title, /STP Paradigm.*4 Primary Segmentation Vectors/i);
  assert.match(lesson.parts[1].title, /Kotler.*MASDA Criteria/i);
  assert.match(lesson.parts[2].title, /4 Classical Targeting Strategies/i);
  assert.match(lesson.parts[3].title, /Segment Unit Economics.*CLV.*CAC Payback/i);
  assert.match(lesson.parts[4].title, /K-Means Behavioral Clustering.*Centroid Assignment/i);
});

test('Block 192 (TASK-751..755): bcom-marketing Days 6–10 resolve with strict 5-part pedagogical invariants & 20+ min spoken audio', () => {
  for (let day = 6; day <= 10; day++) {
    const lesson = getLongLesson('bcom-marketing', day);
    assert.ok(lesson, `bcom-marketing Day ${day} must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must contain exactly 5 in-depth parts`);

    // Verify alias resolution
    const aliased = getLongLesson('bcom_mkt', day);
    assert.ok(aliased, `bcom_mkt alias Day ${day} must resolve`);
    assert.equal(aliased.title, lesson.title);

    // Assert spoken audio duration (>= 20 min) and total duration (>= 35 min)
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} spoken minutes (${spoken}) must be at least 20 minutes (>= 2,400 spoken words @ 120 wpm)`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 35, `Day ${day} total lesson minutes (${total}) must be at least 35 minutes`);

    // Verify summary and projectStep
    assert.ok(Array.isArray(lesson.summary) && lesson.summary.length >= 3, `Day ${day} must have executive summary`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 3, `Day ${day} must have capstone projectStep`);

    // Verify each part
    lesson.parts.forEach((part, idx) => {
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(Array.isArray(part.say) && part.say.length >= 5, `Day ${day} Part ${idx + 1} must have >= 5 teaching paragraphs`);

      const partWordCount = (part.say as string[]).reduce((sum, p) => sum + p.split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWordCount >= 580, `Day ${day} Part ${idx + 1} word count (${partWordCount}) must be >= 580 words`);

      assert.ok(part.example, `Day ${day} Part ${idx + 1} must include an everyday corporate example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must include executable Python code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must include expected console output`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must include a tryIt interactive challenge`);

      // Check quiz contract
      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question text`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 diagnostic options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, `Day ${day} Part ${idx + 1} answer must be in options range`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });
  }
});

test('Block 192 (TASK-751..755): bcom-marketing Days 6–10 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');
  const { getTappableLabelsForVisual } = await import('../src/lib/visuals/visualRules');

  clearDayFileCache();

  for (let day = 6; day <= 10; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom-marketing/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom-marketing', day);
    assert.ok(dayFile, `loadDayFile failed for bcom-marketing Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom-marketing');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom-marketing Day ${day}`);

    const lesson = getLongLesson('bcom-marketing', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom-marketing Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom-marketing Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom-marketing', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom-marketing Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'funnel', `Expected template "funnel" for bcom-marketing`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom-marketing Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for bcom-marketing Day ${day} Part ${partIdx}`);
    }
  }
});

test('Block 193 (TASK-756..760): bcom-marketing Days 11–15 resolve with strict 5-part pedagogical invariants & 20+ min spoken audio', () => {
  for (let day = 11; day <= 15; day++) {
    const lesson = getLongLesson('bcom-marketing', day);
    assert.ok(lesson, `bcom-marketing Day ${day} must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must contain exactly 5 in-depth parts`);

    // Verify alias resolution
    const aliased = getLongLesson('bcom_mkt', day);
    assert.ok(aliased, `bcom_mkt alias Day ${day} must resolve`);
    assert.equal(aliased.title, lesson.title);

    // Assert spoken audio duration (>= 20 min) and total duration (>= 35 min)
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} spoken minutes (${spoken}) must be at least 20 minutes (>= 2,400 spoken words @ 120 wpm)`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 35, `Day ${day} total lesson minutes (${total}) must be at least 35 minutes`);

    // Verify summary and projectStep
    assert.ok(Array.isArray(lesson.summary) && lesson.summary.length >= 3, `Day ${day} must have executive summary`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 3, `Day ${day} must have capstone projectStep`);

    // Verify each part
    lesson.parts.forEach((part, idx) => {
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(Array.isArray(part.say) && part.say.length >= 5, `Day ${day} Part ${idx + 1} must have >= 5 teaching paragraphs`);

      const partWordCount = (part.say as string[]).reduce((sum, p) => sum + p.split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWordCount >= 580, `Day ${day} Part ${idx + 1} word count (${partWordCount}) must be >= 580 words`);

      assert.ok(part.example, `Day ${day} Part ${idx + 1} must include an everyday corporate example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must include executable Python code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must include expected console output`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must include a tryIt interactive challenge`);

      // Check quiz contract
      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question text`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 diagnostic options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, `Day ${day} Part ${idx + 1} answer must be in options range`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });
  }
});

test('Block 193 (TASK-756..760): bcom-marketing Days 11–15 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');
  const { getTappableLabelsForVisual } = await import('../src/lib/visuals/visualRules');

  clearDayFileCache();

  for (let day = 11; day <= 15; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom-marketing/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom-marketing', day);
    assert.ok(dayFile, `loadDayFile failed for bcom-marketing Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom-marketing');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom-marketing Day ${day}`);

    const lesson = getLongLesson('bcom-marketing', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom-marketing Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom-marketing Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom-marketing', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom-marketing Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'funnel', `Expected template "funnel" for bcom-marketing`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom-marketing Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for bcom-marketing Day ${day} Part ${partIdx}`);
    }
  }
});

test('Block 194 (TASK-761..765): bcom-marketing Days 16–20 resolve with full 5-part pedagogical structure, 580+ words/part, and 35+ min duration', () => {
  for (let day = 16; day <= 20; day++) {
    const lesson = getLongLesson('bcom-marketing', day);
    assert.ok(lesson, `bcom-marketing Day ${day} must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must contain exactly 5 in-depth parts`);

    // Verify alias resolution for bcom_mkt
    const aliased = getLongLesson('bcom_mkt', day);
    assert.ok(aliased, `bcom_mkt alias Day ${day} must resolve`);
    assert.equal(aliased.title, lesson.title);

    // Assert language mapping
    assert.equal(getLongLessonLanguage('bcom-marketing'), 'python');
    assert.equal(getLongLessonLanguage('bcom_mkt'), 'python');

    // Assert spoken audio duration (>= 20 min) and total duration (>= 35 min)
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} spoken minutes (${spoken}) must be at least 20 minutes (>= 2,400 spoken words @ 120 wpm)`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 35, `Day ${day} total lesson minutes (${total}) must be at least 35 minutes`);

    // Verify summary and projectStep
    assert.ok(Array.isArray(lesson.summary) && lesson.summary.length >= 3, `Day ${day} must have executive summary`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 3, `Day ${day} must have capstone projectStep`);

    // Verify each part
    lesson.parts.forEach((part, idx) => {
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(Array.isArray(part.say) && part.say.length >= 5, `Day ${day} Part ${idx + 1} must have >= 5 teaching paragraphs`);

      const partWordCount = (part.say as string[]).reduce((sum, p) => sum + p.split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWordCount >= 580, `Day ${day} Part ${idx + 1} word count (${partWordCount}) must be >= 580 words`);

      assert.ok(part.example, `Day ${day} Part ${idx + 1} must include an everyday corporate example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must include executable Python code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must include expected console output`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must include a tryIt interactive challenge`);

      // Check quiz contract
      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question text`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 diagnostic options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, `Day ${day} Part ${idx + 1} answer must be in options range`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });
  }
});

test('Block 194 (TASK-761..765): bcom-marketing Days 16–20 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');
  const { getTappableLabelsForVisual } = await import('../src/lib/visuals/visualRules');

  clearDayFileCache();

  for (let day = 16; day <= 20; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom-marketing/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom-marketing', day);
    assert.ok(dayFile, `loadDayFile failed for bcom-marketing Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom-marketing');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom-marketing Day ${day}`);

    const lesson = getLongLesson('bcom-marketing', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom-marketing Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom-marketing Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom-marketing', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom-marketing Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'funnel', `Expected template "funnel" for bcom-marketing`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom-marketing Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for bcom-marketing Day ${day} Part ${partIdx}`);
    }
  }
});

test('Block 195 (TASK-766..770): bcom-marketing Days 21–25 resolve with full 5-part pedagogical structure, 580+ words/part, and 35+ min duration', () => {
  for (let day = 21; day <= 25; day++) {
    const lesson = getLongLesson('bcom-marketing', day);
    assert.ok(lesson, `bcom-marketing Day ${day} must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must contain exactly 5 in-depth parts`);

    // Verify alias resolution for bcom_mkt
    const aliased = getLongLesson('bcom_mkt', day);
    assert.ok(aliased, `bcom_mkt alias Day ${day} must resolve`);
    assert.equal(aliased.title, lesson.title);

    // Assert language mapping
    assert.equal(getLongLessonLanguage('bcom-marketing'), 'python');
    assert.equal(getLongLessonLanguage('bcom_mkt'), 'python');

    // Assert spoken audio duration (>= 20 min) and total duration (>= 35 min)
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} spoken minutes (${spoken}) must be at least 20 minutes (>= 2,400 spoken words @ 120 wpm)`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 35, `Day ${day} total lesson minutes (${total}) must be at least 35 minutes`);

    // Verify summary and projectStep
    assert.ok(Array.isArray(lesson.summary) && lesson.summary.length >= 3, `Day ${day} must have executive summary`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 3, `Day ${day} must have capstone projectStep`);

    // Verify each part
    lesson.parts.forEach((part, idx) => {
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(Array.isArray(part.say) && part.say.length >= 5, `Day ${day} Part ${idx + 1} must have >= 5 teaching paragraphs`);

      const partWordCount = (part.say as string[]).reduce((sum, p) => sum + p.split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWordCount >= 580, `Day ${day} Part ${idx + 1} word count (${partWordCount}) must be >= 580 words`);

      assert.ok(part.example, `Day ${day} Part ${idx + 1} must include an everyday corporate example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must include executable Python code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must include expected console output`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must include a tryIt interactive challenge`);

      // Check quiz contract
      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question text`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 diagnostic options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, `Day ${day} Part ${idx + 1} answer must be in options range`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });
  }
});

test('Block 195 (TASK-766..770): bcom-marketing Days 21–25 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');
  const { getTappableLabelsForVisual } = await import('../src/lib/visuals/visualRules');

  clearDayFileCache();

  for (let day = 21; day <= 25; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom-marketing/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom-marketing', day);
    assert.ok(dayFile, `loadDayFile failed for bcom-marketing Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom-marketing');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom-marketing Day ${day}`);

    const lesson = getLongLesson('bcom-marketing', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom-marketing Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom-marketing Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom-marketing', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom-marketing Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'funnel', `Expected template "funnel" for bcom-marketing`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom-marketing Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for bcom-marketing Day ${day} Part ${partIdx}`);
    }
  }
});

test('Block 196 (TASK-771..775): bcom-marketing Days 26–30 resolve with full 5-part pedagogical structure, 580+ words/part, and 35+ min duration', () => {
  for (let day = 26; day <= 30; day++) {
    const lesson = getLongLesson('bcom-marketing', day);
    assert.ok(lesson, `bcom-marketing Day ${day} must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must contain exactly 5 in-depth parts`);

    // Verify alias resolution for bcom_mkt
    const aliased = getLongLesson('bcom_mkt', day);
    assert.ok(aliased, `bcom_mkt alias Day ${day} must resolve`);
    assert.equal(aliased.title, lesson.title);

    // Assert language mapping
    assert.equal(getLongLessonLanguage('bcom-marketing'), 'python');
    assert.equal(getLongLessonLanguage('bcom_mkt'), 'python');

    // Assert spoken audio duration (>= 20 min) and total duration (>= 35 min)
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} spoken minutes (${spoken}) must be at least 20 minutes (>= 2,400 spoken words @ 120 wpm)`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 35, `Day ${day} total lesson minutes (${total}) must be at least 35 minutes`);

    // Verify summary and projectStep
    assert.ok(Array.isArray(lesson.summary) && lesson.summary.length >= 3, `Day ${day} must have executive summary`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 3, `Day ${day} must have capstone projectStep`);

    // Verify each part
    lesson.parts.forEach((part, idx) => {
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(Array.isArray(part.say) && part.say.length >= 5, `Day ${day} Part ${idx + 1} must have >= 5 teaching paragraphs`);

      const partWordCount = (part.say as string[]).reduce((sum, p) => sum + p.split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWordCount >= 580, `Day ${day} Part ${idx + 1} word count (${partWordCount}) must be >= 580 words`);

      assert.ok(part.example, `Day ${day} Part ${idx + 1} must include an everyday corporate example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must include executable Python code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must include expected console output`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must include a tryIt interactive challenge`);

      // Check quiz contract
      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question text`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 diagnostic options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, `Day ${day} Part ${idx + 1} answer must be in options range`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });
  }
});

test('Block 196 (TASK-771..775): bcom-marketing Days 26–30 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');
  const { getTappableLabelsForVisual } = await import('../src/lib/visuals/visualRules');

  clearDayFileCache();

  for (let day = 26; day <= 30; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom-marketing/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom-marketing', day);
    assert.ok(dayFile, `loadDayFile failed for bcom-marketing Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom-marketing');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom-marketing Day ${day}`);

    const lesson = getLongLesson('bcom-marketing', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom-marketing Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom-marketing Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom-marketing', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom-marketing Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'funnel', `Expected template "funnel" for bcom-marketing`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom-marketing Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for bcom-marketing Day ${day} Part ${partIdx}`);
    }
  }
});

test('Course 25 Milestone Certification: bcom-marketing 100% Complete across all 30 Days (Days 1–30)', () => {
  for (let day = 1; day <= 30; day++) {
    const lesson = getLongLesson('bcom-marketing', day);
    assert.ok(lesson, `bcom-marketing Day ${day} must resolve in master registry`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5);
  }
});




