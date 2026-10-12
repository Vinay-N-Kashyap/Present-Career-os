import test from 'node:test';
import assert from 'node:assert/strict';
import { getLongLesson, getLongLessonLanguage } from '../src/lib/data/longLessons';

test('Blockchain & Mobile Long Lessons: Resolution & Language Invariants', () => {
  // 1. blockchain
  const blockchainLesson = getLongLesson('blockchain', 1);
  assert.ok(blockchainLesson, 'blockchain Day 1 long lesson must resolve');
  assert.equal(blockchainLesson.day, 1);
  assert.equal(blockchainLesson.parts.length, 5, 'blockchain Day 1 must contain exactly 5 parts');
  assert.ok(blockchainLesson.summary.length >= 4, 'blockchain Day 1 must contain comprehensive summary');
  assert.ok(blockchainLesson.projectStep, 'blockchain Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('blockchain'), 'typescript');

  // 2. mobile
  const mobileLesson = getLongLesson('mobile', 1);
  assert.ok(mobileLesson, 'mobile Day 1 long lesson must resolve');
  assert.equal(mobileLesson.day, 1);
  assert.equal(mobileLesson.parts.length, 5, 'mobile Day 1 must contain exactly 5 parts');
  assert.ok(mobileLesson.summary.length >= 4, 'mobile Day 1 must contain comprehensive summary');
  assert.ok(mobileLesson.projectStep, 'mobile Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('mobile'), 'typescript');

  // 3. g3d and java-basics language mapping
  assert.equal(getLongLessonLanguage('g3d'), 'typescript');
  assert.equal(getLongLessonLanguage('java-basics'), 'javascript');
});

test('Blockchain Day 1: TypeScript Code Snippets & Socratic Checks Verification', () => {
  const blockchainLesson = getLongLesson('blockchain', 1);
  assert.ok(blockchainLesson);

  for (const part of blockchainLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable TypeScript code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);

    // Verify Socratic MCQ Check
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');

    // Structural code invariants
    assert.ok(part.code.includes('console.log('), `TypeScript code in '${part.title}' must print results`);
  }
});

test('Mobile Day 1: React Native Architecture Code Snippets & Socratic Checks Verification', () => {
  const mobileLesson = getLongLesson('mobile', 1);
  assert.ok(mobileLesson);

  for (const part of mobileLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable TypeScript code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);

    // Verify Socratic MCQ Check
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');

    // Structural code invariants
    assert.ok(part.code.includes('console.log('), `TypeScript code in '${part.title}' must print results`);
  }
});
