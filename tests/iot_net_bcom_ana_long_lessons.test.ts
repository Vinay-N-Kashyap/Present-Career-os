import test from 'node:test';
import assert from 'node:assert/strict';
import { getLongLesson, getLongLessonLanguage } from '../src/lib/data/longLessons';

test('IoT Net & B.Com Analytics Long Lessons: Resolution & Language Invariants', () => {
  // 1. iot_net
  const netLesson = getLongLesson('iot_net', 1);
  assert.ok(netLesson, 'iot_net Day 1 long lesson must resolve');
  assert.equal(netLesson.day, 1);
  assert.equal(netLesson.parts.length, 5, 'iot_net Day 1 must contain exactly 5 parts');
  assert.ok(netLesson.summary.length >= 4, 'iot_net Day 1 must contain comprehensive summary');
  assert.ok(netLesson.projectStep, 'iot_net Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('iot_net'), 'python');

  // 2. bcom_ana
  const anaLesson = getLongLesson('bcom_ana', 1);
  assert.ok(anaLesson, 'bcom_ana Day 1 long lesson must resolve');
  assert.equal(anaLesson.day, 1);
  assert.equal(anaLesson.parts.length, 5, 'bcom_ana Day 1 must contain exactly 5 parts');
  assert.ok(anaLesson.summary.length >= 4, 'bcom_ana Day 1 must contain comprehensive summary');
  assert.ok(anaLesson.projectStep, 'bcom_ana Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('bcom_ana'), 'python');
});

test('IoT Net Day 1: 6LoWPAN & Link Budget Python Code Snippets & Socratic Checks Verification', () => {
  const netLesson = getLongLesson('iot_net', 1);
  assert.ok(netLesson);

  for (const part of netLesson.parts) {
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

test('B.Com Analytics Day 1: Linear Optimization & Monte Carlo Python Code Snippets & Socratic Checks Verification', () => {
  const anaLesson = getLongLesson('bcom_ana', 1);
  assert.ok(anaLesson);

  for (const part of anaLesson.parts) {
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
