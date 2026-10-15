import test from 'node:test';
import assert from 'node:assert/strict';
import { getLongLesson, getLongLessonLanguage, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

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

test('G3D Day 4: Resolution & Structural Invariants for Multi-Pass Deferred, Clustered & Compute Physics', () => {
  const g3dD4 = getLongLesson('g3d', 4);
  assert.ok(g3dD4, 'g3d Day 4 long lesson must resolve');
  assert.equal(g3dD4.day, 4);
  assert.equal(g3dD4.parts.length, 5, 'g3d Day 4 must contain exactly 5 parts');
  assert.ok(g3dD4.summary.length >= 4, 'Summary must contain at least 4 items');
  assert.ok(g3dD4.projectStep, 'Day 4 must declare a projectStep');
  assert.ok(g3dD4.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(g3dD4);
  const totalMin = estimateLessonMinutes(g3dD4);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of g3dD4.parts) {
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

test('G3D Day 4: Domain-Specific Content Assertions', () => {
  const g3dD4 = getLongLesson('g3d', 4);
  assert.ok(g3dD4);

  // Part 1 – Multi-Pass Deferred Shading & WebGPU G-Buffer
  assert.ok(g3dD4.parts[0].title.includes('Deferred') || g3dD4.parts[0].title.includes('G-Buffer'));
  assert.ok(g3dD4.parts[0].output.includes('Pass 1 (G-Buffer Raster)'));
  assert.ok(g3dD4.parts[0].output.includes('Pass 2 (Deferred Composite)'));

  // Part 2 – Clustered Forward & Tiled Light Culling
  assert.ok(g3dD4.parts[1].title.includes('Clustered') || g3dD4.parts[1].title.includes('Light Culling'));
  assert.ok(g3dD4.parts[1].output.includes('Frustum Clusters'));
  assert.ok(g3dD4.parts[1].output.includes('Cluster Near'));

  // Part 3 – Cook-Torrance GGX Specular BRDF & Energy Conservation
  assert.ok(g3dD4.parts[2].title.includes('Cook-Torrance') || g3dD4.parts[2].title.includes('BRDF'));
  assert.ok(g3dD4.parts[2].output.includes('Dielectric Surface'));
  assert.ok(g3dD4.parts[2].output.includes('Metallic Surface'));

  // Part 4 – WebGPU Compute Broadphase & Spatial Hash Grid Physics
  assert.ok(g3dD4.parts[3].title.includes('Broadphase') || g3dD4.parts[3].title.includes('Spatial Hash'));
  assert.ok(g3dD4.parts[3].output.includes('100,000 Particle Physics'));
  assert.ok(g3dD4.parts[3].output.includes('Broadphase Clustered Pairs'));

  // Part 5 – Mipmap Generation & Anisotropic Texture Filtering
  assert.ok(g3dD4.parts[4].title.includes('Mipmap') || g3dD4.parts[4].title.includes('Anisotropic'));
  assert.ok(g3dD4.parts[4].output.includes('Texture Base: 1024x1024'));
  assert.ok(g3dD4.parts[4].output.includes('Mip LOD'));
});

test('G3D Day 5: Resolution & Structural Invariants for WebGPU Ray Tracing, Compute Particles & Fog', () => {
  const g3dD5 = getLongLesson('g3d', 5);
  assert.ok(g3dD5, 'g3d Day 5 long lesson must resolve');
  assert.equal(g3dD5.day, 5);
  assert.equal(g3dD5.parts.length, 5, 'g3d Day 5 must contain exactly 5 parts');
  assert.ok(g3dD5.summary.length >= 4, 'Summary must contain at least 4 items');
  assert.ok(g3dD5.projectStep, 'Day 5 must declare a projectStep');
  assert.ok(g3dD5.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(g3dD5);
  const totalMin = estimateLessonMinutes(g3dD5);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of g3dD5.parts) {
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

test('G3D Day 5: Domain-Specific Content Assertions', () => {
  const g3dD5 = getLongLesson('g3d', 5);
  assert.ok(g3dD5);

  // Part 1 – WebGPU Ray Tracing & Möller-Trumbore
  assert.ok(g3dD5.parts[0].title.includes('Ray Tracing') || g3dD5.parts[0].title.includes('BVH'));
  assert.ok(g3dD5.parts[0].output.includes('HIT_CONFIRMED'));
  assert.ok(g3dD5.parts[0].output.includes('Möller-Trumbore'));

  // Part 2 – WebGPU Compute Particles (1 Million)
  assert.ok(g3dD5.parts[1].title.includes('Compute Particle') || g3dD5.parts[1].title.includes('1 Million'));
  assert.ok(g3dD5.parts[1].output.includes('1,000,000 Active Particles'));
  assert.ok(g3dD5.parts[1].output.includes('Ping-Pong'));

  // Part 3 – Screen-Space Reflections (SSR)
  assert.ok(g3dD5.parts[2].title.includes('Screen-Space Reflections') || g3dD5.parts[2].title.includes('SSR'));
  assert.ok(g3dD5.parts[2].output.includes('SURFACE_HIT_FOUND'));
  assert.ok(g3dD5.parts[2].output.includes('Schlick Fresnel Reflectance'));

  // Part 4 – Volumetric Fog & Beer-Lambert
  assert.ok(g3dD5.parts[3].title.includes('Volumetric') || g3dD5.parts[3].title.includes('Beer-Lambert'));
  assert.ok(g3dD5.parts[3].output.includes('Beer-Lambert Transmittance'));
  assert.ok(g3dD5.parts[3].output.includes('Henyey-Greenstein Phase'));

  // Part 5 – HDR ACES Tone Mapping & TAA
  assert.ok(g3dD5.parts[4].title.includes('ACES') || g3dD5.parts[4].title.includes('Tone Mapping'));
  assert.ok(g3dD5.parts[4].output.includes('ACES Filmic Curve'));
  assert.ok(g3dD5.parts[4].output.includes('Temporal Anti-Aliasing (TAA)'));
});

test('Fullstack-JS Day 5: Resolution & Structural Invariants for Edge Geo-Routing, Redlock, CRDTs & Circuit Breakers', () => {
  const fsD5 = getLongLesson('fullstack-js', 5);
  assert.ok(fsD5, 'fullstack-js Day 5 long lesson must resolve');
  assert.equal(fsD5.day, 5);
  assert.equal(fsD5.parts.length, 5, 'fullstack-js Day 5 must contain exactly 5 parts');
  assert.ok(fsD5.summary.length >= 4, 'Summary must contain at least 4 items');
  assert.ok(fsD5.projectStep, 'Day 5 must declare a projectStep');
  assert.ok(fsD5.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(fsD5);
  const totalMin = estimateLessonMinutes(fsD5);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of fsD5.parts) {
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

test('Fullstack-JS Day 5: Domain-Specific Content Assertions', () => {
  const fsD5 = getLongLesson('fullstack-js', 5);
  assert.ok(fsD5);

  // Part 1 – Distributed Edge Geo-Routing & V8 Isolate Middleware
  assert.ok(fsD5.parts[0].title.includes('Edge Geo-Routing') || fsD5.parts[0].title.includes('V8 Isolate'));
  assert.ok(fsD5.parts[0].output.includes('ORIGIN_EU_CENTRAL_FRANKFURT'));
  assert.ok(fsD5.parts[0].output.includes('Second Request Cached: true'));
  assert.ok(fsD5.parts[0].output.includes('Second Request Latency: 2ms'));

  // Part 2 – Distributed Locks & Concurrency Control via Redis Redlock
  assert.ok(fsD5.parts[1].title.includes('Distributed Locks') || fsD5.parts[1].title.includes('Redlock'));
  assert.ok(fsD5.parts[1].output.includes('Redlock Acquired (Quorum 3/5): true'));
  assert.ok(fsD5.parts[1].output.includes('Duplicate Concurrent Acquisition: false'));
  assert.ok(fsD5.parts[1].output.includes('Released Across Nodes Count: 5'));

  // Part 3 – Zero-Downtime Database Migrations & The Expand/Contract Pattern
  assert.ok(fsD5.parts[2].title.includes('Database Migrations') || fsD5.parts[2].title.includes('Expand/Contract'));
  assert.ok(fsD5.parts[2].output.includes('Phase CONTRACT Historic u1 First Name: Ada'));
  assert.ok(fsD5.parts[2].output.includes('Dual-Written u2 Last Name: Turing'));
  assert.ok(fsD5.parts[2].output.includes('DROPPED_COLUMN'));

  // Part 4 – Multi-Region Eventual Consistency & CRDTs
  assert.ok(fsD5.parts[3].title.includes('Multi-Region') || fsD5.parts[3].title.includes('CRDT'));
  assert.ok(fsD5.parts[3].output.includes('Merged Value in US Node: High Contrast Mode'));
  assert.ok(fsD5.parts[3].output.includes('Commutative Equality (A + B === B + A): true'));

  // Part 5 – Enterprise Chaos Engineering, Resiliency & SLO Circuit Breakers
  assert.ok(fsD5.parts[4].title.includes('Circuit Breaker') || fsD5.parts[4].title.includes('Chaos Engineering'));
  assert.ok(fsD5.parts[4].output.includes('Initial Call Status: SUCCESS_200_OK (CLOSED)'));
  assert.ok(fsD5.parts[4].output.includes('Tripping Call State: OPEN'));
  assert.ok(fsD5.parts[4].output.includes('FAST_FAIL_FALLBACK_TRIGGERED'));
});

test('G3D Days 6–10 & Milestone 2 Capstone: Resolution, Word Counts & Invariants', () => {
  for (let day = 6; day <= 10; day++) {
    const lesson = getLongLesson('g3d', day);
    assert.ok(lesson, `G3D Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `G3D Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.minutes >= 35, `G3D Day ${day} must be >= 35 minutes`);
    assert.ok(lesson.summary.length >= 4, `G3D Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `G3D Day ${day} must have a hands-on project step`);

    // Total Spoken Words check (>= 2,940 words)
    let totalWords = 0;
    for (const part of lesson.parts) {
      assert.ok(part.code, `Day ${day} Part '${part.title}' must contain code`);
      assert.ok(part.output, `Day ${day} Part '${part.title}' must declare expected output`);
      assert.ok(part.check, `Day ${day} Part '${part.title}' must have Socratic check`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part '${part.title}' MCQ must have 4 options`);
      assert.ok(part.check.answer >= 0 && part.check.answer <= 3, `Day ${day} Part '${part.title}' answer must be in 0..3`);
      assert.ok(part.check.why.length > 20, `Day ${day} Part '${part.title}' explanation must be rigorous`);

      const text = Array.isArray(part.say) ? part.say.join(' ') : part.say;
      const w = text.trim().split(/\s+/).filter(Boolean).length;
      totalWords += w;
    }
    assert.ok(totalWords >= 2940, `G3D Day ${day} must have >= 2,940 spoken words (actual: ${totalWords})`);
  }
});

test('G3D Days 6–10: Domain-Specific Content Assertions', () => {
  // Day 6: Spherical Harmonics & GI
  const d6 = getLongLesson('g3d', 6);
  assert.ok(d6.title.includes('Spherical Harmonics') || d6.title.includes('Irradiance Probes'));
  assert.ok(d6.parts[0].output.includes('SH Pipeline'));
  assert.ok(d6.parts[1].output.includes('Chebyshev Test'));

  // Day 7: Cascaded Shadow Maps & PCSS
  const d7 = getLongLesson('g3d', 7);
  assert.ok(d7.title.includes('Cascaded Shadow Maps') || d7.title.includes('PCSS'));
  assert.ok(d7.parts[0].output.includes('CSM Pipeline'));
  assert.ok(d7.parts[0].output.includes('Texel Snapping'));

  // Day 8: GPU-Driven Rendering & Mesh Shaders
  const d8 = getLongLesson('g3d', 8);
  assert.ok(d8.title.includes('GPU-Driven') || d8.title.includes('Mesh Shaders'));
  assert.ok(d8.parts[0].output.includes('GPU-Driven Pipeline'));
  assert.ok(d8.parts[2].output.includes('Hi-Z'));

  // Day 9: TAA & Motion Vectors
  const d9 = getLongLesson('g3d', 9);
  assert.ok(d9.title.includes('Temporal Anti-Aliasing') || d9.title.includes('TAA'));
  assert.ok(d9.parts[0].output.includes('Velocity Pipeline'));
  assert.ok(d9.parts[1].output.includes('Halton'));
  assert.ok(d9.parts[2].output.includes('YCoCg'));

  // Day 10: ⭐ Milestone 2 Capstone
  const d10 = getLongLesson('g3d', 10);
  assert.ok(d10.title.includes('Milestone 2 Capstone'));
  assert.ok(d10.parts[0].title.includes('Tier 1'));
  assert.ok(d10.parts[1].title.includes('Tier 2'));
  assert.ok(d10.parts[2].title.includes('Tier 3'));
  assert.ok(d10.parts[3].title.includes('Tier 4'));
  assert.ok(d10.parts[4].title.includes('Tier 5'));
  assert.ok(d10.parts[4].output.includes('5-GATE ARCHITECTURE VIVA VOCE DEFENSE MATRIX'));
  assert.ok(d10.parts[4].output.includes('109.89 FPS @ 4K Resolution'));
  assert.ok(d10.parts[4].output.includes('Principal 3D Computer Graphics & WebGPU Shader Architect Certification'));
});
