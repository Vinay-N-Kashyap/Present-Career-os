import test from 'node:test';
import assert from 'node:assert/strict';
import { getLongLesson, getLongLessonLanguage } from '../src/lib/data/longLessons';
import { BCOM_TAX_LONG_LESSONS } from '../src/lib/data/bcomTaxLongLessons';
import { BCOM_AUD_LONG_LESSONS } from '../src/lib/data/bcomAudLongLessons';

test('B.Com Corporate Tax & Forensic Audit Long Lessons: Resolution & Language Invariants', () => {
  // Corporate Tax (bcom_tax)
  const taxLesson = getLongLesson('bcom_tax', 1);
  assert.ok(taxLesson, 'bcom_tax Day 1 lesson must be defined');
  assert.equal(taxLesson.coursePrefix, 'bcom_tax');
  assert.equal(taxLesson.day, 1);
  assert.equal(taxLesson.parts.length, 5, 'bcom_tax Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_tax'), 'python', 'bcom_tax must use Python language runner');

  // Forensic Audit (bcom_aud)
  const audLesson = getLongLesson('bcom_aud', 1);
  assert.ok(audLesson, 'bcom_aud Day 1 lesson must be defined');
  assert.equal(audLesson.coursePrefix, 'bcom_aud');
  assert.equal(audLesson.day, 1);
  assert.equal(audLesson.parts.length, 5, 'bcom_aud Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_aud'), 'python', 'bcom_aud must use Python language runner');
});

test('B.Com Corporate Tax Day 1: DTL Reversal, Debt Shield & OECD Transfer Pricing Snippets Verification', () => {
  const lesson = BCOM_TAX_LONG_LESSONS[0];
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
  assert.ok(lesson.parts[0].code?.includes('DeferredTaxSchedule'));
  assert.ok(lesson.parts[1].code?.includes('DebtTaxShieldEngine'));
  assert.ok(lesson.parts[2].code?.includes('TransferPricingTNMM'));
  assert.ok(lesson.parts[3].code?.includes('NolTaxShieldSimulator'));
  assert.ok(lesson.parts[4].code?.includes('VatSupplyChainNode'));
});

test('B.Com Forensic Audit Day 1: Audit Risk Model, Benford Chi-Square & MUS Snippets Verification', () => {
  const lesson = BCOM_AUD_LONG_LESSONS[0];
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
  assert.ok(lesson.parts[0].code?.includes('AuditRiskEngine'));
  assert.ok(lesson.parts[1].code?.includes('BenfordFraudDetector'));
  assert.ok(lesson.parts[2].code?.includes('MonetaryUnitSamplingEngine'));
  assert.ok(lesson.parts[3].code?.includes('SoxSodComplianceEngine'));
  assert.ok(lesson.parts[4].code?.includes('StatutoryOpinionEngine'));
});
