import test from 'node:test';
import assert from 'node:assert/strict';
import { getLongLesson, getLongLessonLanguage } from '../src/lib/data/longLessons';
import { BCOM_SCRM_LONG_LESSONS } from '../src/lib/data/bcomScrmLongLessons';
import { BCOM_ENT_LONG_LESSONS } from '../src/lib/data/bcomEntLongLessons';

test('B.Com SCRM & Entrepreneurship Long Lessons: Resolution & Language Invariants', () => {
  // SCRM (Sales, Customer Success & CRM)
  const scrmLesson = getLongLesson('bcom_scrm', 1);
  assert.ok(scrmLesson, 'bcom_scrm Day 1 lesson must be defined');
  assert.equal(scrmLesson.coursePrefix, 'bcom_scrm');
  assert.equal(scrmLesson.day, 1);
  assert.equal(scrmLesson.parts.length, 5, 'bcom_scrm Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_scrm'), 'python', 'bcom_scrm must use Python language runner');

  // Entrepreneurship & Venture Capital
  const entLesson = getLongLesson('bcom_ent', 1);
  assert.ok(entLesson, 'bcom_ent Day 1 lesson must be defined');
  assert.equal(entLesson.coursePrefix, 'bcom_ent');
  assert.equal(entLesson.day, 1);
  assert.equal(entLesson.parts.length, 5, 'bcom_ent Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ent'), 'python', 'bcom_ent must use Python language runner');
});

test('B.Com SCRM Day 1: Pipeline Velocity, LTV/CAC & NRR Python Snippets Verification', () => {
  const lesson = BCOM_SCRM_LONG_LESSONS[0];
  assert.equal(lesson.parts.length, 5);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('def ') || part.code?.includes('class '), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('CRMOpportunity'));
  assert.ok(lesson.parts[1].code?.includes('UnitEconomicsEngine'));
  assert.ok(lesson.parts[2].code?.includes('CohortRetentionEngine'));
  assert.ok(lesson.parts[3].code?.includes('CustomerHealthScorer'));
  assert.ok(lesson.parts[4].code?.includes('NetPromoterScoreEngine'));
});

test('B.Com Entrepreneurship Day 1: Lean Validation, Runway Physics & SAFE Cap Table Snippets Verification', () => {
  const lesson = BCOM_ENT_LONG_LESSONS[0];
  assert.equal(lesson.parts.length, 5);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code?.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('LeanValidationEngine'));
  assert.ok(lesson.parts[1].code?.includes('StartupRunwaySimulator'));
  assert.ok(lesson.parts[2].code?.includes('SafeNoteInvestment'));
  assert.ok(lesson.parts[3].code?.includes('CapTableDilutionModel'));
  assert.ok(lesson.parts[4].code?.includes('LiquidationWaterfall'));
});
