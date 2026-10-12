import test from 'node:test';
import assert from 'node:assert/strict';
import { getLongLesson, getLongLessonLanguage } from '../src/lib/data/longLessons';

test('Java Basics & Soft Skills Long Lessons: Resolution & Language Invariants', () => {
  // 1. java-basics
  const javaLesson = getLongLesson('java-basics', 1);
  assert.ok(javaLesson, 'java-basics Day 1 long lesson must resolve');
  assert.equal(javaLesson.day, 1);
  assert.equal(javaLesson.parts.length, 5, 'java-basics Day 1 must contain exactly 5 parts');
  assert.ok(javaLesson.summary.length >= 4, 'java-basics Day 1 must contain comprehensive summary');
  assert.ok(javaLesson.projectStep, 'java-basics Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('java-basics'), 'javascript');

  // 2. soft-skills
  const softSkillsLesson = getLongLesson('soft-skills', 1);
  assert.ok(softSkillsLesson, 'soft-skills Day 1 long lesson must resolve');
  assert.equal(softSkillsLesson.day, 1);
  assert.equal(softSkillsLesson.parts.length, 5, 'soft-skills Day 1 must contain exactly 5 parts');
  assert.ok(softSkillsLesson.summary.length >= 4, 'soft-skills Day 1 must contain comprehensive summary');
  assert.ok(softSkillsLesson.projectStep, 'soft-skills Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('soft-skills'), 'javascript');
});

test('Java Basics Day 1: JVM & Modern Architecture Code & Socratic Checks Verification', () => {
  const javaLesson = getLongLesson('java-basics', 1);
  assert.ok(javaLesson);

  for (const part of javaLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);

    // Verify Socratic MCQ Check
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');

    // Structural code invariants
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
  }
});

test('Soft Skills Day 1: Behavioral Leadership & Communication Socratic Checks Verification', () => {
  const softSkillsLesson = getLongLesson('soft-skills', 1);
  assert.ok(softSkillsLesson);

  for (const part of softSkillsLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable simulation code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected simulation output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);

    // Verify Socratic MCQ Check
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');

    // Structural simulation code invariants
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
  }
});
