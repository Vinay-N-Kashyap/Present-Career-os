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

test('Fullstack-JS Day 3: Resolution & Structural Invariants for WebSockets, Redis Sessions & Rate Limiting', () => {
  const fsD3 = getLongLesson('fullstack-js', 3);
  assert.ok(fsD3, 'fullstack-js Day 3 long lesson must resolve');
  assert.equal(fsD3.day, 3);
  assert.equal(fsD3.parts.length, 5, 'fullstack-js Day 3 must contain exactly 5 parts');
  assert.ok(fsD3.summary.length >= 4, 'fullstack-js Day 3 must contain comprehensive summary');
  assert.ok(fsD3.projectStep, 'fullstack-js Day 3 must have a hands-on project step');
  assert.ok(fsD3.minutes >= 15, 'fullstack-js Day 3 must be at least 15 minutes');

  // Structural invariants for every part
  for (const part of fsD3.parts) {
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

test('Fullstack-JS Day 3: Domain-Specific Content Assertions', () => {
  const fsD3 = getLongLesson('fullstack-js', 3);
  assert.ok(fsD3);

  // Part 1 – Bidirectional WebSockets, Heartbeats & Backpressure
  assert.ok(fsD3.parts[0].title.includes('WebSockets') || fsD3.parts[0].title.includes('Backpressure'));
  assert.ok(fsD3.parts[0].output.includes('Zombie client terminated after ping timeout'));

  // Part 2 – Redis Distributed Session Store & Sliding TTL
  assert.ok(fsD3.parts[1].title.includes('Redis') || fsD3.parts[1].title.includes('Session'));
  assert.ok(fsD3.parts[1].output.includes('Concurrent Session Limit (Max 2): Evicted oldest session'));

  // Part 3 – Database Connection Pooling & Deadlock Recovery
  assert.ok(fsD3.parts[2].title.includes('Connection Pooling') || fsD3.parts[2].title.includes('Deadlock'));
  assert.ok(fsD3.parts[2].output.includes('DETECTED 40P01 & RETRIED SUCCESSFULLY'));

  // Part 4 – CSP Nonce & CORS Preflight
  assert.ok(fsD3.parts[3].title.includes('CSP') || fsD3.parts[3].title.includes('CORS'));
  assert.ok(fsD3.parts[3].output.includes("script-src 'self' 'nonce-"));

  // Part 5 – Token Bucket Rate Limiting
  assert.ok(fsD3.parts[4].title.includes('Rate Limiting') || fsD3.parts[4].title.includes('Token Bucket'));
  assert.ok(fsD3.parts[4].output.includes('HTTP 429 TOO MANY REQUESTS'));
});

test('G3D Day 3: Resolution & Structural Invariants for Skeletal Skinning, SSAO, Compute & BVH', () => {
  const g3dD3 = getLongLesson('g3d', 3);
  assert.ok(g3dD3, 'g3d Day 3 long lesson must resolve');
  assert.equal(g3dD3.day, 3);
  assert.equal(g3dD3.parts.length, 5, 'g3d Day 3 must contain exactly 5 parts');
  assert.ok(g3dD3.summary.length >= 4, 'g3d Day 3 must contain comprehensive summary');
  assert.ok(g3dD3.projectStep, 'g3d Day 3 must have a hands-on project step');
  assert.ok(g3dD3.minutes >= 15, 'g3d Day 3 must be at least 15 minutes');

  // Structural invariants for every part
  for (const part of g3dD3.parts) {
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

test('G3D Day 3: Domain-Specific Content Assertions', () => {
  const g3dD3 = getLongLesson('g3d', 3);
  assert.ok(g3dD3);

  // Part 1 – Skeletal Mesh Animation & Dual Quaternion Skinning
  assert.ok(g3dD3.parts[0].title.includes('Skinning') || g3dD3.parts[0].title.includes('Dual Quaternion'));
  assert.ok(g3dD3.parts[0].output.includes('CANDY-WRAPPER ARTIFACT COMPLETELY MITIGATED'));

  // Part 2 – Screen-Space Ambient Occlusion (SSAO)
  assert.ok(g3dD3.parts[1].title.includes('SSAO') || g3dD3.parts[1].title.includes('Ambient Occlusion'));
  assert.ok(g3dD3.parts[1].output.includes('Ambient Light Blocked'));

  // Part 3 – WebGPU Compute Shaders & Particle Simulation
  assert.ok(g3dD3.parts[2].title.includes('Compute') || g3dD3.parts[2].title.includes('Particle'));
  assert.ok(g3dD3.parts[2].output.includes('ZERO CPU READBACK'));

  // Part 4 – HDR & ACES Filmic Tone Mapping
  assert.ok(g3dD3.parts[3].title.includes('Tone Mapping') || g3dD3.parts[3].title.includes('HDR'));
  assert.ok(g3dD3.parts[3].output.includes('ACES Filmic Tone Mapped'));

  // Part 5 – Bounding Volume Hierarchy (BVH) & Slab Traversal
  assert.ok(g3dD3.parts[4].title.includes('BVH') || g3dD3.parts[4].title.includes('Slab'));
  assert.ok(g3dD3.parts[4].output.includes('HIT at t=15.0'));
});

test('Fullstack-JS Day 4: Resolution & Structural Invariants for Micro-Frontends, OpenTelemetry & CQRS', () => {
  const fsD4 = getLongLesson('fullstack-js', 4);
  assert.ok(fsD4, 'fullstack-js Day 4 long lesson must resolve');
  assert.equal(fsD4.day, 4);
  assert.equal(fsD4.parts.length, 5, 'fullstack-js Day 4 must contain exactly 5 parts');
  assert.ok(fsD4.summary.length >= 4, 'fullstack-js Day 4 must contain comprehensive summary');
  assert.ok(fsD4.projectStep, 'fullstack-js Day 4 must have a hands-on project step');
  assert.ok(fsD4.minutes >= 15, 'fullstack-js Day 4 must be at least 15 minutes');

  // Structural invariants for every part
  for (const part of fsD4.parts) {
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

test('Fullstack-JS Day 4: Domain-Specific Content Assertions', () => {
  const fsD4 = getLongLesson('fullstack-js', 4);
  assert.ok(fsD4);

  // Part 1 – Micro-Frontends & Module Federation
  assert.ok(fsD4.parts[0].title.includes('Micro-Frontends') || fsD4.parts[0].title.includes('Module Federation'));
  assert.ok(fsD4.parts[0].output.includes('LOADED_CONTAINER_V2'));
  assert.ok(fsD4.parts[0].output.includes('singleton_react_v19.0.0'));

  // Part 2 – Distributed Tracing & OpenTelemetry Spans
  assert.ok(fsD4.parts[1].title.includes('OpenTelemetry') || fsD4.parts[1].title.includes('Distributed Tracing'));
  assert.ok(fsD4.parts[1].output.includes('GET /api/checkout'));
  assert.ok(fsD4.parts[1].output.includes('POST https://stripe.com/v1/charges'));

  // Part 3 – Blue-Green & Canary Zero-Downtime Deployments
  assert.ok(fsD4.parts[2].title.includes('Blue-Green') || fsD4.parts[2].title.includes('Canary'));
  assert.ok(fsD4.parts[2].output.includes('BLUE -> GREEN'));
  assert.ok(fsD4.parts[2].output.includes('BLUE_DRAINING'));

  // Part 4 – Idempotent Webhooks & Redis Locks
  assert.ok(fsD4.parts[3].title.includes('Idempotent Webhooks') || fsD4.parts[3].title.includes('Deduplication'));
  assert.ok(fsD4.parts[3].output.includes('NEW_PAYMENT_PROCESSED'));
  assert.ok(fsD4.parts[3].output.includes('DUPLICATE_IGNORED'));

  // Part 5 – Database Read Replicas & CQRS
  assert.ok(fsD4.parts[4].title.includes('Read Replicas') || fsD4.parts[4].title.includes('CQRS'));
  assert.ok(fsD4.parts[4].output.includes('PRIMARY_DB_LEADER'));
  assert.ok(fsD4.parts[4].output.includes('READ_REPLICA_NODE_01'));
});



