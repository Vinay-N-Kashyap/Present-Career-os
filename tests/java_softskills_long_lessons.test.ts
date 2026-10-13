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

test('Java Basics Day 2: Resolution & Structural Invariants for JMM, HashMap & Spring', () => {
  const javaD2 = getLongLesson('java-basics', 2);
  assert.ok(javaD2, 'java-basics Day 2 long lesson must resolve');
  assert.equal(javaD2.day, 2);
  assert.equal(javaD2.parts.length, 5, 'java-basics Day 2 must contain exactly 5 parts');
  assert.ok(javaD2.summary.length >= 4, 'java-basics Day 2 must contain comprehensive summary');
  assert.ok(javaD2.projectStep, 'java-basics Day 2 must have a hands-on project step');
  assert.ok(javaD2.minutes >= 15, 'java-basics Day 2 must be at least 15 minutes');

  // Structural invariants for every part
  for (const part of javaD2.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);

    // Socratic MCQ
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Java Basics Day 2: Domain-Specific Content Assertions', () => {
  const javaD2 = getLongLesson('java-basics', 2);
  assert.ok(javaD2);

  // Part 1 – JMM & Volatile Memory Barrier
  assert.ok(javaD2.parts[0].title.includes('Java Memory Model') || javaD2.parts[0].title.includes('JMM'));
  assert.ok(javaD2.parts[0].output.includes('MEMORY BARRIER SYNCHRONIZED'));

  // Part 2 – HashMap Resizing & Treeify
  assert.ok(javaD2.parts[1].title.includes('HashMap'));
  assert.ok(javaD2.parts[1].output.includes('TREEIFY_THRESHOLD'));

  // Part 3 – Streams & Spliterator
  assert.ok(javaD2.parts[2].title.includes('Streams') || javaD2.parts[2].title.includes('Spliterator'));
  assert.ok(javaD2.parts[2].output.includes('100% IDENTICAL REDUCE OUTPUT'));

  // Part 4 – Spring IoC & AOP Proxy
  assert.ok(javaD2.parts[3].title.includes('Spring') || javaD2.parts[3].title.includes('AOP'));
  assert.ok(javaD2.parts[3].output.includes('@Transactional'));
  assert.ok(javaD2.parts[3].output.includes('COMMIT TRANSACTION'));

  // Part 5 – ConcurrentHashMap CAS & CompletableFuture
  assert.ok(javaD2.parts[4].title.includes('ConcurrentHashMap') || javaD2.parts[4].title.includes('CompletableFuture'));
  assert.ok(javaD2.parts[4].output.includes('ORDER CONFIRMED'));
});

test('Soft Skills Day 2: Resolution & Structural Invariants for Minto Pyramid & Engineering Leadership', () => {
  const ssD2 = getLongLesson('soft-skills', 2);
  assert.ok(ssD2, 'soft-skills Day 2 long lesson must resolve');
  assert.equal(ssD2.day, 2);
  assert.equal(ssD2.parts.length, 5, 'soft-skills Day 2 must contain exactly 5 parts');
  assert.ok(ssD2.summary.length >= 4, 'soft-skills Day 2 must contain comprehensive summary');
  assert.ok(ssD2.projectStep, 'soft-skills Day 2 must have a hands-on project step');
  assert.ok(ssD2.minutes >= 15, 'soft-skills Day 2 must be at least 15 minutes');

  // Structural invariants for every part
  for (const part of ssD2.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);

    // Socratic MCQ
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 2: Domain-Specific Content Assertions', () => {
  const ssD2 = getLongLesson('soft-skills', 2);
  assert.ok(ssD2);

  // Part 1 – Minto Pyramid & BLUF
  assert.ok(ssD2.parts[0].title.includes('Minto Pyramid') || ssD2.parts[0].title.includes('BLUF'));
  assert.ok(ssD2.parts[0].output.includes('BLUF Stated in Sentence 1: YES'));

  // Part 2 – Disagree and Commit
  assert.ok(ssD2.parts[1].title.includes('Disagree & Commit') || ssD2.parts[1].title.includes('Disagree and Commit'));
  assert.ok(ssD2.parts[1].output.includes('DISAGREE_AND_COMMIT'));

  // Part 3 – Sprint Capacity Triangle
  assert.ok(ssD2.parts[2].title.includes('Stakeholder') || ssD2.parts[2].title.includes('Iron Triangle'));
  assert.ok(ssD2.parts[2].output.includes('HEALTHY & BALANCED'));

  // Part 4 – Code Reviews & Psychological Safety
  assert.ok(ssD2.parts[3].title.includes('Code Reviews') || ssD2.parts[3].title.includes('Psychological Safety'));
  assert.ok(ssD2.parts[3].output.includes('Psychological Safety Invariant'));

  // Part 5 – Staff+ Influence Without Authority
  assert.ok(ssD2.parts[4].title.includes('Influence Without Authority') || ssD2.parts[4].title.includes('Cross-Org'));
  assert.ok(ssD2.parts[4].output.includes('PASSED (Deprecation Window Scheduled)'));
});
