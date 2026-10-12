import test from 'node:test';
import assert from 'node:assert/strict';
import { getLongLesson, getLongLessonLanguage } from '../src/lib/data/longLessons';
import { BCOM_BAN_LONG_LESSONS } from '../src/lib/data/bcomBanLongLessons';
import { BCOM_LAW_LONG_LESSONS } from '../src/lib/data/bcomLawLongLessons';

test('B.Com Commercial Banking & Corporate Law Long Lessons: Resolution & Language Invariants', () => {
  // Commercial Banking (bcom_ban)
  const banLesson = getLongLesson('bcom_ban', 1);
  assert.ok(banLesson, 'bcom_ban Day 1 lesson must be defined');
  assert.equal(banLesson.coursePrefix, 'bcom_ban');
  assert.equal(banLesson.day, 1);
  assert.equal(banLesson.parts.length, 5, 'bcom_ban Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ban'), 'python', 'bcom_ban must use Python language runner');

  // Corporate Law (bcom_law)
  const lawLesson = getLongLesson('bcom_law', 1);
  assert.ok(lawLesson, 'bcom_law Day 1 lesson must be defined');
  assert.equal(lawLesson.coursePrefix, 'bcom_law');
  assert.equal(lawLesson.day, 1);
  assert.equal(lawLesson.parts.length, 5, 'bcom_law Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_law'), 'python', 'bcom_law must use Python language runner');
});

test('B.Com Commercial Banking Day 1: Money Multiplier, Duration Gap & Basel III Snippets Verification', () => {
  const lesson = BCOM_BAN_LONG_LESSONS[0];
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
  assert.ok(lesson.parts[0].code?.includes('FractionalReserveSystem'));
  assert.ok(lesson.parts[1].code?.includes('AssetLiabilityManager'));
  assert.ok(lesson.parts[2].code?.includes('BaselThreeCapitalEngine'));
  assert.ok(lesson.parts[3].code?.includes('LiquidityCoverageModel'));
  assert.ok(lesson.parts[4].code?.includes('CreditPortfolioRiskEngine'));
});

test('B.Com Corporate Law Day 1: Contracts, Veil Piercing, Fiduciary & Antitrust HHI Snippets Verification', () => {
  const lesson = BCOM_LAW_LONG_LESSONS[0];
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
  assert.ok(lesson.parts[0].code?.includes('ContractClauseValidator'));
  assert.ok(lesson.parts[1].code?.includes('CorporateVeilRiskModel'));
  assert.ok(lesson.parts[2].code?.includes('DirectorFiduciaryReview'));
  assert.ok(lesson.parts[3].code?.includes('InsiderTradingComplianceGate'));
  assert.ok(lesson.parts[4].code?.includes('AntitrustHHIAnalyzer'));
});
