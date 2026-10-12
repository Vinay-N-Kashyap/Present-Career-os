import test from 'node:test';
import assert from 'node:assert/strict';
import { getLongLesson, getLongLessonLanguage } from '../src/lib/data/longLessons';

test('IoT Edge & IoT Sec Long Lessons: Resolution & Language Invariants', () => {
  // 1. iot_edge
  const edgeLesson = getLongLesson('iot_edge', 1);
  assert.ok(edgeLesson, 'iot_edge Day 1 long lesson must resolve');
  assert.equal(edgeLesson.day, 1);
  assert.equal(edgeLesson.parts.length, 5, 'iot_edge Day 1 must contain exactly 5 parts');
  assert.ok(edgeLesson.summary.length >= 4, 'iot_edge Day 1 must contain comprehensive summary');
  assert.ok(edgeLesson.projectStep, 'iot_edge Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('iot_edge'), 'python');

  // 2. iot_sec
  const secLesson = getLongLesson('iot_sec', 1);
  assert.ok(secLesson, 'iot_sec Day 1 long lesson must resolve');
  assert.equal(secLesson.day, 1);
  assert.equal(secLesson.parts.length, 5, 'iot_sec Day 1 must contain exactly 5 parts');
  assert.ok(secLesson.summary.length >= 4, 'iot_sec Day 1 must contain comprehensive summary');
  assert.ok(secLesson.projectStep, 'iot_sec Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('iot_sec'), 'python');
});

test('IoT Edge Day 1: Edge AI & INT8 Quantization Python Code Snippets & Socratic Checks Verification', () => {
  const edgeLesson = getLongLesson('iot_edge', 1);
  assert.ok(edgeLesson);

  for (const part of edgeLesson.parts) {
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

test('IoT Sec Day 1: Hardware Root of Trust & Secure Boot Python Code Snippets & Socratic Checks Verification', () => {
  const secLesson = getLongLesson('iot_sec', 1);
  assert.ok(secLesson);

  for (const part of secLesson.parts) {
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
