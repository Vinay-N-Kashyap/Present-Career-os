import test from 'node:test';
import assert from 'node:assert/strict';
import { getLongLesson, getLongLessonLanguage } from '../src/lib/data/longLessons';

test('G3D & Fullstack-JS Long Lessons: Resolution & Language Invariants', () => {
  // 1. g3d
  const g3dLesson = getLongLesson('g3d', 1);
  assert.ok(g3dLesson, 'g3d Day 1 long lesson must resolve');
  assert.equal(g3dLesson.day, 1);
  assert.equal(g3dLesson.parts.length, 5, 'g3d Day 1 must contain exactly 5 parts');
  assert.ok(g3dLesson.summary.length >= 4, 'g3d Day 1 must contain comprehensive summary');
  assert.ok(g3dLesson.projectStep, 'g3d Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('g3d'), 'typescript');

  // 2. fullstack-js
  const fullstackLesson = getLongLesson('fullstack-js', 1);
  assert.ok(fullstackLesson, 'fullstack-js Day 1 long lesson must resolve');
  assert.equal(fullstackLesson.day, 1);
  assert.equal(fullstackLesson.parts.length, 5, 'fullstack-js Day 1 must contain exactly 5 parts');
  assert.ok(fullstackLesson.summary.length >= 4, 'fullstack-js Day 1 must contain comprehensive summary');
  assert.ok(fullstackLesson.projectStep, 'fullstack-js Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('fullstack-js'), 'typescript');
});

test('G3D Day 1: WebGL2 & Shader Math Code Snippets & Socratic Checks Verification', () => {
  const g3dLesson = getLongLesson('g3d', 1);
  assert.ok(g3dLesson);

  for (const part of g3dLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable TypeScript code`);
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

test('Fullstack-JS Day 1: React Server Components & Streaming SSR Code Snippets & Socratic Checks Verification', () => {
  const fullstackLesson = getLongLesson('fullstack-js', 1);
  assert.ok(fullstackLesson);

  for (const part of fullstackLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable TypeScript code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected output`);
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

test('G3D Day 2: Resolution & Structural Invariants for PBR, Shadows & WebGPU', () => {
  const g3dD2 = getLongLesson('g3d', 2);
  assert.ok(g3dD2, 'g3d Day 2 long lesson must resolve');
  assert.equal(g3dD2.day, 2);
  assert.equal(g3dD2.parts.length, 5, 'g3d Day 2 must contain exactly 5 parts');
  assert.ok(g3dD2.summary.length >= 4, 'g3d Day 2 must contain comprehensive summary');
  assert.ok(g3dD2.projectStep, 'g3d Day 2 must have a hands-on project step');
  assert.ok(g3dD2.minutes >= 15, 'g3d Day 2 must be at least 15 minutes');

  // Structural invariants for every part
  for (const part of g3dD2.parts) {
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

test('G3D Day 2: Domain-Specific Content Assertions', () => {
  const g3dD2 = getLongLesson('g3d', 2);
  assert.ok(g3dD2);

  // Part 1 – PBR Cook-Torrance
  assert.ok(g3dD2.parts[0].title.includes('PBR') || g3dD2.parts[0].title.includes('Cook-Torrance'));
  assert.ok(g3dD2.parts[0].output.includes('Energy Conserved: YES'));

  // Part 2 – Shadow Mapping & PCF
  assert.ok(g3dD2.parts[1].title.includes('Shadow'));
  assert.ok(g3dD2.parts[1].output.includes('PCF'));

  // Part 3 – Deferred Shading
  assert.ok(g3dD2.parts[2].title.includes('Deferred'));
  assert.ok(g3dD2.parts[2].output.includes('3.0x Faster'));

  // Part 4 – WebGPU
  assert.ok(g3dD2.parts[3].title.includes('WebGPU'));
  assert.ok(g3dD2.parts[3].output.includes('IMMUTABLE'));

  // Part 5 – Frustum Culling
  assert.ok(g3dD2.parts[4].title.includes('Culling') || g3dD2.parts[4].title.includes('AABB'));
  assert.ok(g3dD2.parts[4].output.includes('Culled Draw Calls Eliminated: 2'));
});

test('Fullstack-JS Day 2: Resolution & Structural Invariants for Streaming SSR, Server Actions & tRPC', () => {
  const fsD2 = getLongLesson('fullstack-js', 2);
  assert.ok(fsD2, 'fullstack-js Day 2 long lesson must resolve');
  assert.equal(fsD2.day, 2);
  assert.equal(fsD2.parts.length, 5, 'fullstack-js Day 2 must contain exactly 5 parts');
  assert.ok(fsD2.summary.length >= 4, 'fullstack-js Day 2 must contain comprehensive summary');
  assert.ok(fsD2.projectStep, 'fullstack-js Day 2 must have a hands-on project step');
  assert.ok(fsD2.minutes >= 15, 'fullstack-js Day 2 must be at least 15 minutes');

  // Structural invariants for every part
  for (const part of fsD2.parts) {
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

test('Fullstack-JS Day 2: Domain-Specific Content Assertions', () => {
  const fsD2 = getLongLesson('fullstack-js', 2);
  assert.ok(fsD2);

  // Part 1 – Streaming SSR
  assert.ok(fsD2.parts[0].title.includes('Streaming SSR'));
  assert.ok(fsD2.parts[0].output.includes('Out-of-Order Flush Parallelism'));

  // Part 2 – Server Actions with Optimistic Rollbacks
  assert.ok(fsD2.parts[1].title.includes('Server Actions'));
  assert.ok(fsD2.parts[1].output.includes('UI Consistency Guarantee: DISPLAY === CONFIRMED = true'));

  // Part 3 – Edge Middleware JWT Auth
  assert.ok(fsD2.parts[2].title.includes('Edge Middleware'));
  assert.ok(fsD2.parts[2].output.includes('GDPR geo-rewrite'));

  // Part 4 – tRPC Type-Safe RPCs
  assert.ok(fsD2.parts[3].title.includes('tRPC'));
  assert.ok(fsD2.parts[3].output.includes('ZERO runtime schema validation needed'));

  // Part 5 – Server-Sent Events (SSE)
  assert.ok(fsD2.parts[4].title.includes('Server-Sent Events') || fsD2.parts[4].title.includes('SSE'));
  assert.ok(fsD2.parts[4].output.includes('Last-Event-ID'));
});
