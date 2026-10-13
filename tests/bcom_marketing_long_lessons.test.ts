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

