import test from 'node:test';
import assert from 'node:assert/strict';
import { getLongLesson, getLongLessonLanguage } from '../src/lib/data/longLessons';

test('B.Com Ops & AI Digital Transformation Long Lessons: Resolution & Language Invariants', () => {
  // 1. bcom_ops
  const opsLesson = getLongLesson('bcom_ops', 1);
  assert.ok(opsLesson, 'bcom_ops Day 1 long lesson must resolve');
  assert.equal(opsLesson.day, 1);
  assert.equal(opsLesson.parts.length, 5, 'bcom_ops Day 1 must contain exactly 5 parts');
  assert.ok(opsLesson.summary.length >= 4, 'bcom_ops Day 1 must contain comprehensive summary');
  assert.ok(opsLesson.projectStep, 'bcom_ops Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('bcom_ops'), 'python');

  // 2. bcom_ait
  const aitLesson = getLongLesson('bcom_ait', 1);
  assert.ok(aitLesson, 'bcom_ait Day 1 long lesson must resolve');
  assert.equal(aitLesson.day, 1);
  assert.equal(aitLesson.parts.length, 5, 'bcom_ait Day 1 must contain exactly 5 parts');
  assert.ok(aitLesson.summary.length >= 4, 'bcom_ait Day 1 must contain comprehensive summary');
  assert.ok(aitLesson.projectStep, 'bcom_ait Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('bcom_ait'), 'python');
});

test('B.Com Ops Day 1: Little\'s Law, EOQ & Six Sigma Python Code Snippets & Socratic Checks Verification', () => {
  const opsLesson = getLongLesson('bcom_ops', 1);
  assert.ok(opsLesson);

  for (const part of opsLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable Python code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);

    // Verify Socratic MCQ Check
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');

    // Structural code invariants
    assert.ok(part.code.includes('print('), `Code in '${part.title}' must print results`);
  }
});

test('B.Com AIT Day 1: IDP OCR, Process Mining & Circuit Breaker Python Code Snippets & Socratic Checks Verification', () => {
  const aitLesson = getLongLesson('bcom_ait', 1);
  assert.ok(aitLesson);

  for (const part of aitLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable Python code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);

    // Verify Socratic MCQ Check
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');

    // Structural code invariants
    assert.ok(part.code.includes('print('), `Code in '${part.title}' must print results`);
  }
});
