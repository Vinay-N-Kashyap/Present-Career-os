import test from 'node:test';
import assert from 'node:assert/strict';
import { getLongLesson, getLongLessonLanguage, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

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

test('Java Basics Day 3: Resolution & Structural Invariants for Generics, Reflection & Sealed Classes', () => {
  const javaD3 = getLongLesson('java-basics', 3);
  assert.ok(javaD3, 'java-basics Day 3 long lesson must resolve');
  assert.equal(javaD3.day, 3);
  assert.equal(javaD3.parts.length, 5, 'java-basics Day 3 must contain exactly 5 parts');
  assert.ok(javaD3.summary.length >= 4, 'java-basics Day 3 must contain comprehensive summary');
  assert.ok(javaD3.projectStep, 'java-basics Day 3 must have a hands-on project step');
  assert.ok(javaD3.minutes >= 15, 'java-basics Day 3 must be at least 15 minutes');

  // Structural invariants for every part
  for (const part of javaD3.parts) {
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

test('Java Basics Day 3: Domain-Specific Content Assertions', () => {
  const javaD3 = getLongLesson('java-basics', 3);
  assert.ok(javaD3);

  // Part 1 – Generics & Type Erasure
  assert.ok(javaD3.parts[0].title.includes('Generics') || javaD3.parts[0].title.includes('Type Erasure'));
  assert.ok(javaD3.parts[0].output.includes('T erased to Object'));

  // Part 2 – Reflection API & Dynamic Invocation
  assert.ok(javaD3.parts[1].title.includes('Reflection'));
  assert.ok(javaD3.parts[1].output.includes('Method Dynamically Dispatched'));

  // Part 3 – Custom Annotations & Runtime Metadata
  assert.ok(javaD3.parts[2].title.includes('Annotations') || javaD3.parts[2].title.includes('Metadata'));
  assert.ok(javaD3.parts[2].output.includes('@Retention(RetentionPolicy.RUNTIME)'));

  // Part 4 – Java 21 Sealed Classes & Pattern Matching
  assert.ok(javaD3.parts[3].title.includes('Sealed Classes') || javaD3.parts[3].title.includes('Pattern Matching'));
  assert.ok(javaD3.parts[3].output.includes('Exhaustiveness Guarantee'));

  // Part 5 – ClassLoader Hierarchy & Parent Delegation
  assert.ok(javaD3.parts[4].title.includes('ClassLoader') || javaD3.parts[4].title.includes('Parent Delegation'));
  assert.ok(javaD3.parts[4].output.includes('Parent delegation prevents rogue plugins'));
});

test('Soft Skills Day 3: Resolution & Structural Invariants for Radical Candor, NVC & Executive Briefings', () => {
  const ssD3 = getLongLesson('soft-skills', 3);
  assert.ok(ssD3, 'soft-skills Day 3 long lesson must resolve');
  assert.equal(ssD3.day, 3);
  assert.equal(ssD3.parts.length, 5, 'soft-skills Day 3 must contain exactly 5 parts');
  assert.ok(ssD3.summary.length >= 4, 'soft-skills Day 3 must contain comprehensive summary');
  assert.ok(ssD3.projectStep, 'soft-skills Day 3 must have a hands-on project step');
  assert.ok(ssD3.minutes >= 15, 'soft-skills Day 3 must be at least 15 minutes');

  // Structural invariants for every part
  for (const part of ssD3.parts) {
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

test('Soft Skills Day 3: Domain-Specific Content Assertions', () => {
  const ssD3 = getLongLesson('soft-skills', 3);
  assert.ok(ssD3);

  // Part 1 – Radical Candor
  assert.ok(ssD3.parts[0].title.includes('Radical Candor'));
  assert.ok(ssD3.parts[0].output.includes('RADICAL_CANDOR'));

  // Part 2 – Crucial Conversations & NVC
  assert.ok(ssD3.parts[1].title.includes('Crucial Conversations') || ssD3.parts[1].title.includes('Non-Violent Communication'));
  assert.ok(ssD3.parts[1].output.includes('100% VALID NVC STRUCTURE'));

  // Part 3 – Cross-Functional RFC & ADR
  assert.ok(ssD3.parts[2].title.includes('RFC') || ssD3.parts[2].title.includes('PRD'));
  assert.ok(ssD3.parts[2].output.includes('APPROVED_ADR'));

  // Part 4 – Stakeholder Escalation Matrix
  assert.ok(ssD3.parts[3].title.includes('Escalation'));
  assert.ok(ssD3.parts[3].output.includes('LEVEL_3_VP_EXECUTIVE_ESC'));

  // Part 5 – Executive Presentation Framing
  assert.ok(ssD3.parts[4].title.includes('Executive Presentation') || ssD3.parts[4].title.includes('Boardroom'));
  assert.ok(ssD3.parts[4].output.includes('FUND_IMMEDIATELY'));
});

test('Java Basics Day 4: Resolution & Structural Invariants for WebFlux, Netty & R2DBC', () => {
  const javaD4 = getLongLesson('java-basics', 4);
  assert.ok(javaD4, 'java-basics Day 4 long lesson must resolve');
  assert.equal(javaD4.day, 4);
  assert.equal(javaD4.parts.length, 5, 'java-basics Day 4 must contain exactly 5 parts');
  assert.ok(javaD4.summary.length >= 4, 'java-basics Day 4 must contain comprehensive summary');
  assert.ok(javaD4.projectStep, 'java-basics Day 4 must have a hands-on project step');
  assert.ok(javaD4.minutes >= 15, 'java-basics Day 4 must be at least 15 minutes');

  // Structural invariants for every part
  for (const part of javaD4.parts) {
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

test('Java Basics Day 4: Domain-Specific Content Assertions', () => {
  const javaD4 = getLongLesson('java-basics', 4);
  assert.ok(javaD4);

  // Part 1 – Reactive Streams Mono & Flux
  assert.ok(javaD4.parts[0].title.includes('Mono') || javaD4.parts[0].title.includes('Flux'));
  assert.ok(javaD4.parts[0].output.includes('ORDER_VERIFIED'));

  // Part 2 – Netty EventLoop & Multiplexing
  assert.ok(javaD4.parts[1].title.includes('Netty') || javaD4.parts[1].title.includes('EventLoop'));
  assert.ok(javaD4.parts[1].output.includes('Active Sockets Ready for Read: 2'));

  // Part 3 – Reactive Backpressure
  assert.ok(javaD4.parts[2].title.includes('Backpressure'));
  assert.ok(javaD4.parts[2].output.includes('DROP Strategy'));

  // Part 4 – R2DBC Non-blocking DB
  assert.ok(javaD4.parts[3].title.includes('R2DBC'));
  assert.ok(javaD4.parts[3].output.includes('ASYNC_STREAM_SUBSCRIBED'));

  // Part 5 – Distributed Tracing & W3C Context
  assert.ok(javaD4.parts[4].title.includes('Distributed Tracing') || javaD4.parts[4].title.includes('OpenTelemetry'));
  assert.ok(javaD4.parts[4].output.includes('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'));
});

test('Soft Skills Day 4: Resolution & Structural Invariants for Principled Negotiation, RICE & Org Leadership', () => {
  const ssD4 = getLongLesson('soft-skills', 4);
  assert.ok(ssD4, 'soft-skills Day 4 long lesson must resolve');
  assert.equal(ssD4.day, 4);
  assert.equal(ssD4.parts.length, 5, 'soft-skills Day 4 must contain exactly 5 parts');
  assert.ok(ssD4.summary.length >= 4, 'Summary must contain at least 4 items');
  assert.ok(ssD4.projectStep, 'Day 4 must declare a projectStep');
  assert.ok(ssD4.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(ssD4);
  const totalMin = estimateLessonMinutes(ssD4);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of ssD4.parts) {
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

test('Soft Skills Day 4: Domain-Specific Content Assertions', () => {
  const ssD4 = getLongLesson('soft-skills', 4);
  assert.ok(ssD4);

  // Part 1 – Principled Negotiation & BATNA/ZOPA
  assert.ok(ssD4.parts[0].title.includes('Negotiation') || ssD4.parts[0].title.includes('BATNA'));
  assert.ok(ssD4.parts[0].output.includes('FEASIBLE'));
  assert.ok(ssD4.parts[0].output.includes('AGREEMENT_REACHED'));

  // Part 2 – Quantitative Roadmap Prioritization (RICE)
  assert.ok(ssD4.parts[1].title.includes('RICE') || ssD4.parts[1].title.includes('Prioritization'));
  assert.ok(ssD4.parts[1].output.includes('GraphQL Gateway Migration'));
  assert.ok(ssD4.parts[1].output.includes('RICE Score: 20000'));

  // Part 3 – Coaching Underperformance & Constructive PIP
  assert.ok(ssD4.parts[2].title.includes('Underperformance') || ssD4.parts[2].title.includes('PIP'));
  assert.ok(ssD4.parts[2].output.includes('COACHABLE_SKILL_GAP'));
  assert.ok(ssD4.parts[2].output.includes('Pair with Staff Engineer mentor'));

  // Part 4 – Staff+ Engineering Archetypes & Org Leverage
  assert.ok(ssD4.parts[3].title.includes('Staff+') || ssD4.parts[3].title.includes('Archetypes'));
  assert.ok(ssD4.parts[3].output.includes('CROSS-ORG MULTIPLIER'));
  assert.ok(ssD4.parts[3].output.includes('Setting multi-year technical vision'));

  // Part 5 – Crisis Management & Blameless Postmortem
  assert.ok(ssD4.parts[4].title.includes('Crisis') || ssD4.parts[4].title.includes('Postmortem'));
  assert.ok(ssD4.parts[4].output.includes('BLAMELESS_RETROSPECTIVE_CONCLUDED'));
  assert.ok(ssD4.parts[4].output.includes('circuit breaker pattern'));
});

test('Java Basics Day 5: Resolution & Structural Invariants for Panama FFM, Loom Virtual Threads & ZGC', () => {
  const javaD5 = getLongLesson('java-basics', 5);
  assert.ok(javaD5, 'java-basics Day 5 long lesson must resolve');
  assert.equal(javaD5.day, 5);
  assert.equal(javaD5.parts.length, 5, 'java-basics Day 5 must contain exactly 5 parts');
  assert.ok(javaD5.summary.length >= 4, 'java-basics Day 5 must contain comprehensive summary');
  assert.ok(javaD5.projectStep, 'java-basics Day 5 must have a hands-on project step');
  assert.ok(javaD5.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(javaD5);
  const totalMin = estimateLessonMinutes(javaD5);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of javaD5.parts) {
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

test('Java Basics Day 5: Domain-Specific Content Assertions', () => {
  const javaD5 = getLongLesson('java-basics', 5);
  assert.ok(javaD5);

  // Part 1 – Project Panama FFM Off-Heap Memory & C Linkage
  assert.ok(javaD5.parts[0].title.includes('Panama') || javaD5.parts[0].title.includes('Foreign Function'));
  assert.ok(javaD5.parts[0].output.includes('OFF_HEAP_CONFINED_ARENA_ACTIVE'));
  assert.ok(javaD5.parts[0].output.includes('strlen'));

  // Part 2 – Project Loom Virtual Threads Concurrency
  assert.ok(javaD5.parts[1].title.includes('Loom') || javaD5.parts[1].title.includes('Virtual Threads'));
  assert.ok(javaD5.parts[1].output.includes('Concurrent Task Count: 100,000'));
  assert.ok(javaD5.parts[1].output.includes('100K_TASKS_DISPATCHED_CLEANLY'));

  // Part 3 – Structured Concurrency & StructuredTaskScope
  assert.ok(javaD5.parts[2].title.includes('Structured Concurrency') || javaD5.parts[2].title.includes('StructuredTaskScope'));
  assert.ok(javaD5.parts[2].output.includes('CANCELLED_ON_FAILURE'));
  assert.ok(javaD5.parts[2].output.includes('CreditBureauCheck'));

  // Part 4 – Scoped Values
  assert.ok(javaD5.parts[3].title.includes('Scoped Values') || javaD5.parts[3].title.includes('ScopedValue'));
  assert.ok(javaD5.parts[3].output.includes('SECURITY_CONTEXT'));
  assert.ok(javaD5.parts[3].output.includes('Tenant_AcmeCorp_Admin'));

  // Part 5 – Generational ZGC vs G1GC Tuning
  assert.ok(javaD5.parts[4].title.includes('ZGC') || javaD5.parts[4].title.includes('G1GC'));
  assert.ok(javaD5.parts[4].output.includes('Generational ZGC P99 Pause Time: 0.45 ms'));
  assert.ok(javaD5.parts[4].output.includes('G1GC P99 Pause Time: 35 ms'));
});

test('Soft Skills Day 5: Resolution & Structural Invariants for SCQA, Stakeholder Matrix & DORA Metrics', () => {
  const ssD5 = getLongLesson('soft-skills', 5);
  assert.ok(ssD5, 'soft-skills Day 5 long lesson must resolve');
  assert.equal(ssD5.day, 5);
  assert.equal(ssD5.parts.length, 5, 'soft-skills Day 5 must contain exactly 5 parts');
  assert.ok(ssD5.summary.length >= 4, 'soft-skills Day 5 must contain comprehensive summary');
  assert.ok(ssD5.projectStep, 'soft-skills Day 5 must have a hands-on project step');
  assert.ok(ssD5.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(ssD5);
  const totalMin = estimateLessonMinutes(ssD5);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of ssD5.parts) {
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

test('Soft Skills Day 5: Domain-Specific Content Assertions', () => {
  const ssD5 = getLongLesson('soft-skills', 5);
  assert.ok(ssD5);

  // Part 1 – SCQA Executive Storytelling
  assert.ok(ssD5.parts[0].title.includes('SCQA') || ssD5.parts[0].title.includes('Executive Storytelling'));
  assert.ok(ssD5.parts[0].output.includes('VERIFIED_SCQA_STRUCTURE'));
  assert.ok(ssD5.parts[0].output.includes('Executive Readiness Score: 100/100'));
  assert.ok(ssD5.parts[0].output.includes('$14.2M Annualized Impact'));

  // Part 2 – Mendelow Stakeholder Power-Interest Matrix
  assert.ok(ssD5.parts[1].title.includes('Mendelow') || ssD5.parts[1].title.includes('Stakeholder'));
  assert.ok(ssD5.parts[1].output.includes('KEEP_SATISFIED'));
  assert.ok(ssD5.parts[1].output.includes('MANAGE_CLOSELY'));
  assert.ok(ssD5.parts[1].output.includes('Influence without authority'));

  // Part 3 – DORA Metrics & C-Suite Business Value
  assert.ok(ssD5.parts[2].title.includes('DORA') || ssD5.parts[2].title.includes('Velocity'));
  assert.ok(ssD5.parts[2].output.includes('ELITE_PERFORMER'));
  assert.ok(ssD5.parts[2].output.includes('$1530k/year'));

  // Part 4 – Crisis Communications & Incident Command Public Relations
  assert.ok(ssD5.parts[3].title.includes('Crisis') || ssD5.parts[3].title.includes('Incident Communications'));
  assert.ok(ssD5.parts[3].output.includes('[SEV-1 UPDATE]'));
  assert.ok(ssD5.parts[3].output.includes('20 minutes guaranteed'));
  assert.ok(ssD5.parts[3].output.includes('EMPATHY_AND_ACCOUNTABILITY_MAINTAINED'));

  // Part 5 – Staff+ Engineering Promotion Dossier
  assert.ok(ssD5.parts[4].title.includes('Staff+') || ssD5.parts[4].title.includes('Promotion Dossier'));
  assert.ok(ssD5.parts[4].output.includes('PROMOTION_APPROVED'));
  assert.ok(ssD5.parts[4].output.includes('CROSS_ORG'));
  assert.ok(ssD5.parts[4].output.includes('5 Engineers Mentored & Promoted'));
  assert.ok(ssD5.parts[4].output.includes('$3.4M Validated ROI'));
});

test('Java Basics Day 6: Resolution & Structural Invariants for Switch Statements, Arrow Expressions & Pattern Matching', () => {
  const javaD6 = getLongLesson('java-basics', 6);
  assert.ok(javaD6, 'java-basics Day 6 long lesson must resolve');
  assert.equal(javaD6.day, 6);
  assert.equal(javaD6.parts.length, 5, 'java-basics Day 6 must contain exactly 5 parts');
  assert.ok(javaD6.summary.length >= 4, 'java-basics Day 6 must contain comprehensive summary');
  assert.ok(javaD6.projectStep, 'java-basics Day 6 must have a hands-on project step');
  assert.ok(javaD6.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(javaD6);
  const totalMin = estimateLessonMinutes(javaD6);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of javaD6.parts) {
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

test('Java Basics Day 6: Domain-Specific Content Assertions', () => {
  const javaD6 = getLongLesson('java-basics', 6);
  assert.ok(javaD6);

  // Part 1 – Arrow Syntax & Yielding Values
  assert.ok(javaD6.parts[0].title.includes('Switch Expressions') || javaD6.parts[0].title.includes('Arrow Syntax'));
  assert.ok(javaD6.parts[0].output.includes('NPCI_IMMEDIATE_SWITCH'));
  assert.ok(javaD6.parts[0].output.includes('120 bps'));

  // Part 2 – Fallthrough & Break
  assert.ok(javaD6.parts[1].title.includes('Fallthrough') || javaD6.parts[1].title.includes('Break'));
  assert.ok(javaD6.parts[1].output.includes('STOP_VEHICLES'));
  assert.ok(javaD6.parts[1].output.includes('PREPARE_TO_STOP'));
  assert.ok(javaD6.parts[1].output.includes('BLINKING_AMBER_CAUTION'));

  // Part 3 – Default Guards & Protocol Status
  assert.ok(javaD6.parts[2].title.includes('Default Guards') || javaD6.parts[2].title.includes('Exhaustiveness'));
  assert.ok(javaD6.parts[2].output.includes('SUCCESS_OK'));
  assert.ok(javaD6.parts[2].output.includes('CLIENT_ERROR'));
  assert.ok(javaD6.parts[2].output.includes('UNKNOWN_PROTOCOL_STATUS'));

  // Part 4 – Pattern Matching for Switch
  assert.ok(javaD6.parts[3].title.includes('Pattern Matching'));
  assert.ok(javaD6.parts[3].output.includes('ACCOUNT_LOCKED_SECURITY_ALERT'));
  assert.ok(javaD6.parts[3].output.includes('FLAG_HIGH_VALUE_AML_REVIEW'));

  // Part 5 – Sealed Interfaces & Exhaustive State Machines
  assert.ok(javaD6.parts[4].title.includes('Sealed') || javaD6.parts[4].title.includes('Exhaustive'));
  assert.ok(javaD6.parts[4].output.includes('RESERVE_INVENTORY'));
  assert.ok(javaD6.parts[4].output.includes('DISPATCH_FULFILLMENT'));
  assert.ok(javaD6.parts[4].output.includes('REQUEST_CUSTOMER_FEEDBACK'));
});

test('Java Basics Day 7: Resolution & Structural Invariants for While Loops, Do-While & Iterative State Machines', () => {
  const javaD7 = getLongLesson('java-basics', 7);
  assert.ok(javaD7, 'java-basics Day 7 long lesson must resolve');
  assert.equal(javaD7.day, 7);
  assert.equal(javaD7.parts.length, 5, 'java-basics Day 7 must contain exactly 5 parts');
  assert.ok(javaD7.summary.length >= 4, 'java-basics Day 7 must contain comprehensive summary');
  assert.ok(javaD7.projectStep, 'java-basics Day 7 must have a hands-on project step');
  assert.ok(javaD7.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(javaD7);
  const totalMin = estimateLessonMinutes(javaD7);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of javaD7.parts) {
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

test('Java Basics Day 7: Domain-Specific Content Assertions', () => {
  const javaD7 = getLongLesson('java-basics', 7);
  assert.ok(javaD7);

  // Part 1 – Pre-Condition While & Exponential Backoff
  assert.ok(javaD7.parts[0].title.includes('While Loop') || javaD7.parts[0].title.includes('Pre-Condition'));
  assert.ok(javaD7.parts[0].output.includes('CONNECTED'));
  assert.ok(javaD7.parts[0].output.includes('Total Attempts: 3'));
  assert.ok(javaD7.parts[0].output.includes('ATTEMPT_3_SUCCESS'));

  // Part 2 – Do-While & Guaranteed First Execution
  assert.ok(javaD7.parts[1].title.includes('Do-While') || javaD7.parts[1].title.includes('Post-Condition'));
  assert.ok(javaD7.parts[1].output.includes('HANDSHAKE_ACK'));
  assert.ok(javaD7.parts[1].output.includes('Handshake Attempts Required: 2'));

  // Part 3 – Counter Progression & Watchdog Guard
  assert.ok(javaD7.parts[2].title.includes('Infinite Loops') || javaD7.parts[2].title.includes('Watchdog'));
  assert.ok(javaD7.parts[2].output.includes('Drain 30 Tokens: iterations=3, remaining=0'));
  assert.ok(javaD7.parts[2].output.includes('Watchdog Guard Triggered: true, iterations=5'));

  // Part 4 – Labeled Loops in Matrix Traversals
  assert.ok(javaD7.parts[3].title.includes('Labeled Loops') || javaD7.parts[3].title.includes('Break'));
  assert.ok(javaD7.parts[3].output.includes('Target Found: true'));
  assert.ok(javaD7.parts[3].output.includes('Target Coordinates: Row 1, Col 1'));

  // Part 5 – Message Consumer & Graceful Shutdown
  assert.ok(javaD7.parts[4].title.includes('Queue Consumers') || javaD7.parts[4].title.includes('State Machines'));
  assert.ok(javaD7.parts[4].output.includes('Processed Messages Count: 3'));
  assert.ok(javaD7.parts[4].output.includes('Remaining in Queue: 0'));
  assert.ok(javaD7.parts[4].output.includes('DRAINED_CLEANLY'));
});

test('Java Basics Day 8: Resolution & Structural Invariants for For Loops, Enhanced For-Each & Cache Locality', () => {
  const javaD8 = getLongLesson('java-basics', 8);
  assert.ok(javaD8, 'java-basics Day 8 long lesson must resolve');
  assert.equal(javaD8.day, 8);
  assert.equal(javaD8.parts.length, 5, 'java-basics Day 8 must contain exactly 5 parts');
  assert.ok(javaD8.summary.length >= 4, 'java-basics Day 8 must contain comprehensive summary');
  assert.ok(javaD8.projectStep, 'java-basics Day 8 must have a hands-on project step');
  assert.ok(javaD8.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(javaD8);
  const totalMin = estimateLessonMinutes(javaD8);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of javaD8.parts) {
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

test('Java Basics Day 8: Domain-Specific Content Assertions', () => {
  const javaD8 = getLongLesson('java-basics', 8);
  assert.ok(javaD8);

  // Part 1 – Classic Three-Part For Loop & Custom Strides
  assert.ok(javaD8.parts[0].title.includes('Three-Part') || javaD8.parts[0].title.includes('Stride'));
  assert.ok(javaD8.parts[0].output.includes('Sequential Sum: 360'));
  assert.ok(javaD8.parts[0].output.includes('Stride-2 Sum: 160'));

  // Part 2 – Enhanced For-Each & Iterable Abstraction
  assert.ok(javaD8.parts[1].title.includes('Enhanced For-Each') || javaD8.parts[1].title.includes('Iterable'));
  assert.ok(javaD8.parts[1].output.includes('In-Stock Items: 2'));
  assert.ok(javaD8.parts[1].output.includes('Total Available Inventory Value: $6900'));

  // Part 3 – Row-Major Order & CPU Cache Locality in 2D Arrays
  assert.ok(javaD8.parts[2].title.includes('Multi-Dimensional') || javaD8.parts[2].title.includes('Cache Locality'));
  assert.ok(javaD8.parts[2].output.includes('Matrix Total Sum: 45'));
  assert.ok(javaD8.parts[2].output.includes('Cell Traversal Count: 9'));

  // Part 4 – Safe Iterator Removal vs ConcurrentModificationException
  assert.ok(javaD8.parts[3].title.includes('ConcurrentModificationException') || javaD8.parts[3].title.includes('Safe Iterator Removal'));
  assert.ok(javaD8.parts[3].output.includes('Valid Active Tokens: 2'));
  assert.ok(javaD8.parts[3].output.includes('Safely Pruned Expired Tokens: 2'));
  assert.ok(javaD8.parts[3].output.includes('CONCURRENT_SAFETY_VERIFIED'));

  // Part 5 – Parallel Streams vs For Loops & ForkJoin Heuristics
  assert.ok(javaD8.parts[4].title.includes('Parallel Streams') || javaD8.parts[4].title.includes('ForkJoinPool'));
  assert.ok(javaD8.parts[4].output.includes('500 Elements Strategy: SEQUENTIAL_FOR_LOOP'));
  assert.ok(javaD8.parts[4].output.includes('100,000 Elements Strategy: PARALLEL_STREAM_FORK_JOIN'));
});

test('Java Basics Day 9: Resolution & Structural Invariants for Methods, Pass-by-Value & Overloading', () => {
  const javaD9 = getLongLesson('java-basics', 9);
  assert.ok(javaD9, 'java-basics Day 9 long lesson must resolve');
  assert.equal(javaD9.day, 9);
  assert.equal(javaD9.parts.length, 5, 'java-basics Day 9 must contain exactly 5 parts');
  assert.ok(javaD9.summary.length >= 4, 'java-basics Day 9 must contain comprehensive summary');
  assert.ok(javaD9.projectStep, 'java-basics Day 9 must have a hands-on project step');
  assert.ok(javaD9.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(javaD9);
  const totalMin = estimateLessonMinutes(javaD9);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of javaD9.parts) {
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

test('Java Basics Day 9: Domain-Specific Content Assertions', () => {
  const javaD9 = getLongLesson('java-basics', 9);
  assert.ok(javaD9);

  // Part 1 – Method Signatures & Early Return Guard Clauses
  assert.ok(javaD9.parts[0].title.includes('Signatures') || javaD9.parts[0].title.includes('Guard Clauses'));
  assert.ok(javaD9.parts[0].output.includes('Valid Transfer: status=TRANSFER_APPROVED, fee=100'));
  assert.ok(javaD9.parts[0].output.includes('Invalid Transfer: status=INVALID_ACCOUNT_ID, fee=0'));

  // Part 2 – Primitive Pass-by-Value Photocopy Invariant
  assert.ok(javaD9.parts[1].title.includes('Pass-by-Value') || javaD9.parts[1].title.includes('Primitive'));
  assert.ok(javaD9.parts[1].output.includes('Caller Frame Price After Method Return: 2500'));
  assert.ok(javaD9.parts[1].output.includes('Method Frame Internal Price: 2000'));
  assert.ok(javaD9.parts[1].output.includes('PRIMITIVE_PASS_BY_VALUE_VERIFIED'));

  // Part 3 – Object References as Values: Heap Mutation vs Reassignment
  assert.ok(javaD9.parts[2].title.includes('Object References') || javaD9.parts[2].title.includes('Heap Mutation'));
  assert.ok(javaD9.parts[2].output.includes('Post-Mutation Host: prod-cluster-01, Weight: 85'));
  assert.ok(javaD9.parts[2].output.includes('Post-Reassignment Host: prod-cluster-01, Weight: 85'));
  assert.ok(javaD9.parts[2].output.includes('HEAP_MUTATION_ALLOWED_REASSIGNMENT_ISOLATED'));

  // Part 4 – Method Overloading Precedence: Exact > Widening > Boxing > Varargs
  assert.ok(javaD9.parts[3].title.includes('Overloading') || javaD9.parts[3].title.includes('Widening'));
  assert.ok(javaD9.parts[3].output.includes('EXACT_MATCH: String -> System initialized'));
  assert.ok(javaD9.parts[3].output.includes('PRIMITIVE_NUMERIC: number -> 404'));
  assert.ok(javaD9.parts[3].output.includes('VARARGS_FALLBACK: count=3'));
  assert.ok(javaD9.parts[3].output.includes('EXACT_MATCH > WIDENING > BOXING > VARARGS'));

  // Part 5 – Pure Functions & Idempotent Backend Services
  assert.ok(javaD9.parts[4].title.includes('Pure Functions') || javaD9.parts[4].title.includes('Idempotent'));
  assert.ok(javaD9.parts[4].output.includes('Initial Balance: $10000'));
  assert.ok(javaD9.parts[4].output.includes('Balance After First Credit: $12500'));
  assert.ok(javaD9.parts[4].output.includes('Balance After Duplicate Retry: $12500'));
  assert.ok(javaD9.parts[4].output.includes('PURE_IDEMPOTENT_TRANSACTION_VERIFIED'));
});

test('Java Basics Day 10: Resolution & Structural Invariants for Call Stack, Recursion & Milestone 2 Capstone', () => {
  const javaD10 = getLongLesson('java-basics', 10);
  assert.ok(javaD10, 'java-basics Day 10 long lesson must resolve');
  assert.equal(javaD10.day, 10);
  assert.equal(javaD10.parts.length, 5, 'java-basics Day 10 must contain exactly 5 parts');
  assert.ok(javaD10.summary.length >= 4, 'java-basics Day 10 must contain comprehensive summary');
  assert.ok(javaD10.projectStep, 'java-basics Day 10 must have a hands-on project step');
  assert.ok(javaD10.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(javaD10);
  const totalMin = estimateLessonMinutes(javaD10);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of javaD10.parts) {
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

test('Java Basics Day 10: Domain-Specific Content Assertions & Milestone 2 Certification', () => {
  const javaD10 = getLongLesson('java-basics', 10);
  assert.ok(javaD10);

  // Part 1 – JVM Call Stack Architecture & LIFO Lifecycle
  assert.ok(javaD10.parts[0].title.includes('Call Stack') || javaD10.parts[0].title.includes('Frame Allocation'));
  assert.ok(javaD10.parts[0].output.includes('Peak Stack Depth: 3'));
  assert.ok(javaD10.parts[0].output.includes('Popped Frame: lookupJurisdiction'));
  assert.ok(javaD10.parts[0].output.includes('LIFO_FRAME_ALLOCATION_VERIFIED'));

  // Part 2 – Recursion Base Case Contract vs StackOverflowError
  assert.ok(javaD10.parts[1].title.includes('Recursion') || javaD10.parts[1].title.includes('StackOverflow'));
  assert.ok(javaD10.parts[1].output.includes('Safe Run Factorial(5): 120, Depth: 5'));
  assert.ok(javaD10.parts[1].output.includes('Guarded Run Status: STACK_OVERFLOW_GUARD_TRIGGERED, Depth: 51'));
  assert.ok(javaD10.parts[1].output.includes('INDUCTIVE_BASE_CASE_MANDATORY'));

  // Part 3 – Tail Recursion vs HotSpot Invariant (No TCO)
  assert.ok(javaD10.parts[2].title.includes('Tail Recursion') || javaD10.parts[2].title.includes('TCO'));
  assert.ok(javaD10.parts[2].output.includes('Tail-Recursive Factorial(6): 720'));
  assert.ok(javaD10.parts[2].output.includes('Iterative Loop Factorial(6): 720'));
  assert.ok(javaD10.parts[2].output.includes('ZERO_HOTSPOT_TCO_USE_ITERATIVE_LOOPS'));

  // Part 4 – Thread Stack Sizing (-Xss) & Heap Trampoline Stacks
  assert.ok(javaD10.parts[3].title.includes('Stack Sizing') || javaD10.parts[3].title.includes('Trampoline'));
  assert.ok(javaD10.parts[3].output.includes('Heap Trampoline Total Sum: 325'));
  assert.ok(javaD10.parts[3].output.includes('Heap Trampoline Nodes Visited: 4'));
  assert.ok(javaD10.parts[3].output.includes('HEAP_WORK_STACK_PREVENTS_XSS_OVERFLOW'));

  // Part 5 – Milestone 2 Capstone Financial Engine Synthesis
  assert.ok(javaD10.parts[4].title.includes('Milestone 2') || javaD10.parts[4].title.includes('Financial Engine'));
  assert.ok(javaD10.parts[4].output.includes('Portfolio Gross Value: ₹1500000'));
  assert.ok(javaD10.parts[4].output.includes('Total Regulatory Surcharge: ₹2470'));
  assert.ok(javaD10.parts[4].output.includes('Net Audited Valuation: ₹1497530'));
  assert.ok(javaD10.parts[4].output.includes('JAVA_FUNDAMENTALS_CORE_ENGINE_CERTIFIED'));
});

test('Java Basics Day 11: Resolution & Structural Invariants for Classes, Objects & Memory Layout', () => {
  const javaD11 = getLongLesson('java-basics', 11);
  assert.ok(javaD11, 'java-basics Day 11 long lesson must resolve');
  assert.equal(javaD11.day, 11);
  assert.equal(javaD11.parts.length, 5, 'java-basics Day 11 must contain exactly 5 parts');
  assert.ok(javaD11.summary.length >= 4, 'java-basics Day 11 must contain comprehensive summary');
  assert.ok(javaD11.projectStep, 'java-basics Day 11 must have a hands-on project step');
  assert.ok(javaD11.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(javaD11);
  const totalMin = estimateLessonMinutes(javaD11);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of javaD11.parts) {
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

test('Java Basics Day 11: Domain-Specific Content Assertions', () => {
  const javaD11 = getLongLesson('java-basics', 11);
  assert.ok(javaD11);

  // Part 1 – Field Initialization Sequence
  assert.ok(javaD11.parts[0].title.includes('Blueprint') || javaD11.parts[0].title.includes('Initialization Order'));
  assert.ok(javaD11.parts[0].output.includes('Session 1: id=sess-alpha-01, state=ACTIVE_READY, retries=3'));
  assert.ok(javaD11.parts[0].output.includes('Session 2: id=sess-beta-02, state=ACTIVE_READY, retries=5'));
  assert.ok(javaD11.parts[0].output.includes('ZERO_DEFAULTS -> FIELD_INITS -> CONSTRUCTOR_BODY'));

  // Part 2 – Constructor Chaining via this()
  assert.ok(javaD11.parts[1].title.includes('Constructors') || javaD11.parts[1].title.includes('Constructor Chaining'));
  assert.ok(javaD11.parts[1].output.includes('Config 1: https://api.pinit.os, timeout=5000ms, conns=10'));
  assert.ok(javaD11.parts[1].output.includes('Config 2: https://payments.pinit.os, timeout=12000ms, conns=20'));
  assert.ok(javaD11.parts[1].output.includes('THIS_CALL_DELEGATES_TO_PRIMARY_CONSTRUCTOR'));

  // Part 3 – Fluent Builder & this Reference Disambiguation
  assert.ok(javaD11.parts[2].title.includes('this Reference') || javaD11.parts[2].title.includes('Fluent'));
  assert.ok(javaD11.parts[2].output.includes('Request Line: POST /v1/settlements'));
  assert.ok(javaD11.parts[2].output.includes('Authorization Verified: true'));
  assert.ok(javaD11.parts[2].output.includes('Payload Size: 17 bytes'));
  assert.ok(javaD11.parts[2].output.includes('RETURN_THIS_ENABLES_FLUENT_CHAINING'));

  // Part 4 – JVM Object Memory Layout & 8-Byte Alignment
  assert.ok(javaD11.parts[3].title.includes('Memory Layout') || javaD11.parts[3].title.includes('Mark Word'));
  assert.ok(javaD11.parts[3].output.includes('Layout 1 (Heavy): Header=12B, Fields=28B, Padding=0B, Total=40B'));
  assert.ok(javaD11.parts[3].output.includes('Layout 2 (Tiny):  Header=12B, Fields=1B, Padding=3B, Total=16B'));
  assert.ok(javaD11.parts[3].output.includes('HOTSPOT_8_BYTE_BOUNDARY_PADDING_VERIFIED'));

  // Part 5 – Reference Identity vs Semantic Equivalence (.equals & hashCode)
  assert.ok(javaD11.parts[4].title.includes('Identity') || javaD11.parts[4].title.includes('HashCode'));
  assert.ok(javaD11.parts[4].output.includes('ordA == ordB (Reference Identity): false'));
  assert.ok(javaD11.parts[4].output.includes('ordA.equals(ordB) (Semantic Equivalence): true'));
  assert.ok(javaD11.parts[4].output.includes('ordA == ordC (Shared Reference): true'));
  assert.ok(javaD11.parts[4].output.includes('HashCodes Match: true'));
  assert.ok(javaD11.parts[4].output.includes('EQUALS_AND_HASHCODE_CONTRACT_ENFORCED'));
});

test('Java Basics Day 12: Resolution & Structural Invariants for Encapsulation & Immutability Patterns', () => {
  const javaD12 = getLongLesson('java-basics', 12);
  assert.ok(javaD12, 'java-basics Day 12 long lesson must resolve');
  assert.equal(javaD12.day, 12);
  assert.equal(javaD12.parts.length, 5, 'java-basics Day 12 must contain exactly 5 parts');
  assert.ok(javaD12.summary.length >= 4, 'java-basics Day 12 must contain comprehensive summary');
  assert.ok(javaD12.projectStep, 'java-basics Day 12 must have a hands-on project step');
  assert.ok(javaD12.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(javaD12);
  const totalMin = estimateLessonMinutes(javaD12);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of javaD12.parts) {
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

test('Java Basics Day 12: Domain-Specific Content Assertions', () => {
  const javaD12 = getLongLesson('java-basics', 12);
  assert.ok(javaD12);

  // Part 1 – Access Modifiers & Scope Boundaries
  assert.ok(javaD12.parts[0].title.includes('Access Modifiers') || javaD12.parts[0].title.includes('Scope Boundaries'));
  assert.ok(javaD12.parts[0].output.includes('Private from Same Class: true'));
  assert.ok(javaD12.parts[0].output.includes('Private from Same Package: false'));
  assert.ok(javaD12.parts[0].output.includes('Protected from Subclass in Other Package: true'));
  assert.ok(javaD12.parts[0].output.includes('ACCESS_LEVELS_STRICTLY_ENFORCED'));

  // Part 2 – Validated Mutators & Invariant Guards
  assert.ok(javaD12.parts[1].title.includes('Defensive Getters') || javaD12.parts[1].title.includes('Validation Guards'));
  assert.ok(javaD12.parts[1].output.includes('Account Holder: Kashyap Vinay'));
  assert.ok(javaD12.parts[1].output.includes('Current Invariant Balance: ₹11000'));
  assert.ok(javaD12.parts[1].output.includes('MUTATION_GUARDS_ACTIVE'));

  // Part 3 – Defensive Copying vs Reference Escape
  assert.ok(javaD12.parts[2].title.includes('Defensive Copying') || javaD12.parts[2].title.includes('Reference Escape'));
  assert.ok(javaD12.parts[2].output.includes('Super Admin Authorized: false'));
  assert.ok(javaD12.parts[2].output.includes('Root Override Authorized: false'));
  assert.ok(javaD12.parts[2].output.includes('Policy Roles Count: 2'));
  assert.ok(javaD12.parts[2].output.includes('ZERO_REFERENCE_ESCAPE_VERIFIED'));

  // Part 4 – Immutable Records & Value Objects
  assert.ok(javaD12.parts[3].title.includes('Immutability') || javaD12.parts[3].title.includes('Records'));
  assert.ok(javaD12.parts[3].output.includes('Pair: USD/INR @ 83.45'));
  assert.ok(javaD12.parts[3].output.includes('Conversion of $1,000: ₹83450'));
  assert.ok(javaD12.parts[3].output.includes('IMMUTABLE_VALUE_OBJECT_CERTIFIED'));

  // Part 5 – Encapsulated Wallet & Audit Ledger
  assert.ok(javaD12.parts[4].title.includes('Encapsulated Wallet') || javaD12.parts[4].title.includes('Audit Ledger'));
  assert.ok(javaD12.parts[4].output.includes('Final Wallet Balance: ₹6000'));
  assert.ok(javaD12.parts[4].output.includes('Total Ledger Entries: 3'));
  assert.ok(javaD12.parts[4].output.includes('TAMPER_PROOF_LEDGER_ENFORCED'));
});












test('Soft Skills Day 6: Resolution & Structural Invariants for Cross-Functional Alignment & ELI5', () => {
  const ssD6 = getLongLesson('soft-skills', 6);
  assert.ok(ssD6, 'soft-skills Day 6 long lesson must resolve');
  assert.equal(ssD6.day, 6);
  assert.equal(ssD6.parts.length, 5, 'soft-skills Day 6 must contain exactly 5 parts');
  assert.ok(ssD6.summary.length >= 4, 'soft-skills Day 6 must contain comprehensive summary');
  assert.ok(ssD6.projectStep, 'soft-skills Day 6 must have a hands-on project step');
  assert.ok(ssD6.minutes >= 15, 'soft-skills Day 6 must be at least 15 minutes');

  const spokenMin = estimateSpokenMinutes(ssD6);
  const totalMin = estimateLessonMinutes(ssD6);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (const part of ssD6.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);

    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 6: Domain-Specific Content Assertions', () => {
  const ssD6 = getLongLesson('soft-skills', 6);
  assert.ok(ssD6);

  // Part 1 – Curse of Knowledge & Jargon Density
  assert.ok(ssD6.parts[0].title.includes('Curse of Knowledge') || ssD6.parts[0].title.includes('Jargon'));
  assert.ok(ssD6.parts[0].output.includes('Readability Assessment: HIGH_COGNITIVE_OVERLOAD') || ssD6.parts[0].output.includes('Jargon Density'));

  // Part 2 – ELI5 Framework & Analogy Pairing
  assert.ok(ssD6.parts[1].title.includes('ELI5') || ssD6.parts[1].title.includes('Analogy'));
  assert.ok(ssD6.parts[1].output.includes('ELI5 TRANSLATION BRIEF') || ssD6.parts[1].output.includes('PHYSICAL-WORLD INTUITIVE ANALOGY') || ssD6.parts[1].output.includes('ELI5 Invariant'));

  // Part 3 – Executive Business Metrics (Revenue, Latency, Churn)
  assert.ok(ssD6.parts[2].title.includes('Executive Business Metrics') || ssD6.parts[2].title.includes('ROI'));
  assert.ok(ssD6.parts[2].output.includes('EXECUTIVE INVESTMENT DOSSIER') || ssD6.parts[2].output.includes('Total Annual Business Return') || ssD6.parts[2].output.includes('FUND_IMMEDIATELY'));

  // Part 4 – Project Management Iron Triangle
  assert.ok(ssD6.parts[3].title.includes('Iron Triangle') || ssD6.parts[3].title.includes('Scope'));
  assert.ok(ssD6.parts[3].output.includes('CROSS-FUNCTIONAL ALIGNMENT DOSSIER') || ssD6.parts[3].output.includes('Iron Triangle Invariant'));

  // Part 5 – Master Cross-Functional Alignment Suite
  assert.ok(ssD6.parts[4].title.includes('Master Alignment Suite') || ssD6.parts[4].title.includes('Cross-Functional'));
  assert.ok(ssD6.parts[4].output.includes('MASTER CROSS-FUNCTIONAL CERTIFICATION') || ssD6.parts[4].output.includes('CERTIFIED_CROSS_FUNCTIONAL_LEADER'));
});

test('Soft Skills Day 7: Resolution & Structural Invariants for SBI Feedback & Code Reviews', () => {
  const ssD7 = getLongLesson('soft-skills', 7);
  assert.ok(ssD7, 'soft-skills Day 7 long lesson must resolve');
  assert.equal(ssD7.day, 7);
  assert.equal(ssD7.parts.length, 5, 'soft-skills Day 7 must contain exactly 5 parts');
  assert.ok(ssD7.summary.length >= 4, 'soft-skills Day 7 must contain comprehensive summary');
  assert.ok(ssD7.projectStep, 'soft-skills Day 7 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD7);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD7.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 7: Domain-Specific Content Assertions', () => {
  const ssD7 = getLongLesson('soft-skills', 7);
  assert.ok(ssD7);

  // Part 1 – Code Review Psychology & Accusatory Framing
  assert.ok(ssD7.parts[0].title.includes('Psychology of Code Reviews') || ssD7.parts[0].title.includes('Accusatory'));
  assert.ok(ssD7.parts[0].output.includes('CODE REVIEW PSYCHOLOGY AUDIT') || ssD7.parts[0].output.includes('TOXIC_DEFENSIVE'));

  // Part 2 – The SBI Model (Situation, Behavior, Impact)
  assert.ok(ssD7.parts[1].title.includes('SBI') || ssD7.parts[1].title.includes('Situation-Behavior-Impact'));
  assert.ok(ssD7.parts[1].output.includes('SBI CONSTRUCTIVE FEEDBACK DISPATCH') || ssD7.parts[1].output.includes('SBI_COMPLIANT') || ssD7.parts[1].output.includes('SBI Invariant'));

  // Part 3 – Conventional Comments Standardization
  assert.ok(ssD7.parts[2].title.includes('Conventional Comments') || ssD7.parts[2].title.includes('Triage'));
  assert.ok(ssD7.parts[2].output.includes('PULL REQUEST CODE REVIEW AUDIT') || ssD7.parts[2].output.includes('Conventional Invariant'));

  // Part 4 – 3-Comment Circuit Breaker & Disagree and Commit
  assert.ok(ssD7.parts[3].title.includes('Disagreements') || ssD7.parts[3].title.includes('Escalations') || ssD7.parts[3].title.includes('Circuit Breaker'));
  assert.ok(ssD7.parts[3].output.includes('PULL REQUEST CONFLICT CIRCUIT BREAKER') || ssD7.parts[3].output.includes('HAVE_BACKBONE_DISAGREE_AND_COMMIT'));

  // Part 5 – Master Feedback Suite & Psychological Safety
  assert.ok(ssD7.parts[4].title.includes('Master Constructive Feedback') || ssD7.parts[4].title.includes('High-Trust'));
  assert.ok(ssD7.parts[4].output.includes('HIGH-TRUST ENGINEERING CULTURE CERTIFICATION') || ssD7.parts[4].output.includes('HIGH_TRUST_ELITE_SQUAD'));
});

test('Soft Skills Day 8: Resolution & Structural Invariants for Conflict Resolution & The IBR Approach', () => {
  const ssD8 = getLongLesson('soft-skills', 8);
  assert.ok(ssD8, 'soft-skills Day 8 long lesson must resolve');
  assert.equal(ssD8.day, 8);
  assert.equal(ssD8.parts.length, 5, 'soft-skills Day 8 must contain exactly 5 parts');
  assert.ok(ssD8.summary.length >= 4, 'soft-skills Day 8 must contain comprehensive summary');
  assert.ok(ssD8.projectStep, 'soft-skills Day 8 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD8);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD8.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 8: Domain-Specific Content Assertions', () => {
  const ssD8 = getLongLesson('soft-skills', 8);
  assert.ok(ssD8);

  // Part 1 – Conflict Taxonomy (Cognitive vs Affective)
  assert.ok(ssD8.parts[0].title.includes('Cognitive') || ssD8.parts[0].title.includes('Affective'));
  assert.ok(ssD8.parts[0].output.includes('TECHNICAL CONFLICT TAXONOMY AUDIT') || ssD8.parts[0].output.includes('TOXIC_AFFECTIVE'));

  // Part 2 – Interest-Based Relational (IBR) Framework
  assert.ok(ssD8.parts[1].title.includes('Interest-Based Relational') || ssD8.parts[1].title.includes('IBR'));
  assert.ok(ssD8.parts[1].output.includes('IBR CONFLICT DE-ESCALATION PROTOCOL') || ssD8.parts[1].output.includes('SEPARATING PEOPLE FROM THE PROBLEM'));

  // Part 3 – Positions vs Underlying Interests
  assert.ok(ssD8.parts[2].title.includes('Positions vs Interests') || ssD8.parts[2].title.includes('Position'));
  assert.ok(ssD8.parts[2].output.includes('POSITION-TO-INTEREST MAPPING ANALYSIS') || ssD8.parts[2].output.includes('CREATIVE HYBRID SYNTHESIS'));

  // Part 4 – Weighted Pugh Decision Matrix
  assert.ok(ssD8.parts[3].title.includes('Pugh Decision Matrix') || ssD8.parts[3].title.includes('Pugh'));
  assert.ok(ssD8.parts[3].output.includes('WEIGHTED PUGH DECISION MATRIX') || ssD8.parts[3].output.includes('Objective Winner'));

  // Part 5 – Master Conflict Resolution Suite
  assert.ok(ssD8.parts[4].title.includes('Master Conflict Resolution') || ssD8.parts[4].title.includes('Consensus'));
  assert.ok(ssD8.parts[4].output.includes('MASTER TECHNICAL CONSENSUS CERTIFICATION') || ssD8.parts[4].output.includes('CERTIFIED_CONSENSUS_BUILDER'));
});

test('Soft Skills Day 9: Resolution & Structural Invariants for Agile Standups & The 90-Second Update', () => {
  const ssD9 = getLongLesson('soft-skills', 9);
  assert.ok(ssD9, 'soft-skills Day 9 long lesson must resolve');
  assert.equal(ssD9.day, 9);
  assert.equal(ssD9.parts.length, 5, 'soft-skills Day 9 must contain exactly 5 parts');
  assert.ok(ssD9.summary.length >= 4, 'soft-skills Day 9 must contain comprehensive summary');
  assert.ok(ssD9.projectStep, 'soft-skills Day 9 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD9);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD9.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 9: Domain-Specific Content Assertions', () => {
  const ssD9 = getLongLesson('soft-skills', 9);
  assert.ok(ssD9);

  // Part 1 – Attention Economics & Maker's Schedule
  assert.ok(ssD9.parts[0].title.includes('Attention') || ssD9.parts[0].title.includes('Maker'));
  assert.ok(ssD9.parts[0].output.includes('MEETING ATTENTION ECONOMICS REPORT') || ssD9.parts[0].output.includes('Context-Switch Penalty'));

  // Part 2 – The 90-Second Standup Protocol
  assert.ok(ssD9.parts[1].title.includes('90-Second Standup') || ssD9.parts[1].title.includes('90-Second'));
  assert.ok(ssD9.parts[1].output.includes('90-SECOND STANDUP UPDATE AUDIT') || ssD9.parts[1].output.includes('Signal-to-Noise'));

  // Part 3 – The Parking Lot Pattern
  assert.ok(ssD9.parts[2].title.includes('Parking Lot'));
  assert.ok(ssD9.parts[2].output.includes('STANDUP PARKING LOT AUDIT') || ssD9.parts[2].output.includes('SCHEDULE POST-STANDUP BREAKOUT'));

  // Part 4 – Active Facilitation & Right-to-Left Board-Walking
  assert.ok(ssD9.parts[3].title.includes('Active Facilitation') || ssD9.parts[3].title.includes('Board-Walking'));
  assert.ok(ssD9.parts[3].output.includes('AGILE CEREMONY BOARD-WALKING AUDIT') || ssD9.parts[3].output.includes('Right-to-Left Walk'));

  // Part 5 – Master Synchronous Collaboration Suite
  assert.ok(ssD9.parts[4].title.includes('Master Synchronous Collaboration') || ssD9.parts[4].title.includes('Velocity Index'));
  assert.ok(ssD9.parts[4].output.includes('MASTER AGILE CEREMONY VELOCITY CERTIFICATION') || ssD9.parts[4].output.includes('CERTIFIED_AGILE_HIGH_VELOCITY'));
});

test('Soft Skills Day 10: Resolution & Structural Invariants for Technical Presentations & Minto Pyramid', () => {
  const ssD10 = getLongLesson('soft-skills', 10);
  assert.ok(ssD10, 'soft-skills Day 10 long lesson must resolve');
  assert.equal(ssD10.day, 10);
  assert.equal(ssD10.parts.length, 5, 'soft-skills Day 10 must contain exactly 5 parts');
  assert.ok(ssD10.summary.length >= 4, 'soft-skills Day 10 must contain comprehensive summary');
  assert.ok(ssD10.projectStep, 'soft-skills Day 10 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD10);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD10.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 10: Domain-Specific Content Assertions', () => {
  const ssD10 = getLongLesson('soft-skills', 10);
  assert.ok(ssD10);

  // Part 1 – Top-Down vs Bottom-Up Communication
  assert.ok(ssD10.parts[0].title.includes('Top-Down') || ssD10.parts[0].title.includes('Bottom-Up'));
  assert.ok(ssD10.parts[0].output.includes('PRESENTATION FLOW & ATTENTION AUDIT') || ssD10.parts[0].output.includes('Time to Recommendation'));

  // Part 2 – Barbara Minto's Pyramid Principle & MECE
  assert.ok(ssD10.parts[1].title.includes('Minto Pyramid') || ssD10.parts[1].title.includes('MECE'));
  assert.ok(ssD10.parts[1].output.includes('MINTO PYRAMID MECE AUDIT') || ssD10.parts[1].output.includes('MECE Compliant'));

  // Part 3 – The SCQA Narrative Arc
  assert.ok(ssD10.parts[2].title.includes('SCQA') || ssD10.parts[2].title.includes('Narrative'));
  assert.ok(ssD10.parts[2].output.includes('SCQA NARRATIVE PERSUASION AUDIT') || ssD10.parts[2].output.includes('BOARDROOM_READY'));

  // Part 4 – High-Signal Visual Slide Design
  assert.ok(ssD10.parts[3].title.includes('Visual Slide Design') || ssD10.parts[3].title.includes('1-Idea-Per-Slide'));
  assert.ok(ssD10.parts[3].output.includes('SLIDE COGNITIVE LOAD AUDIT') || ssD10.parts[3].output.includes('OPTIMAL_HIGH_SIGNAL'));

  // Part 5 – Master Technical Presentation Suite
  assert.ok(ssD10.parts[4].title.includes('Master Technical Presentation') || ssD10.parts[4].title.includes('Executive Storytelling'));
  assert.ok(ssD10.parts[4].output.includes('MASTER EXECUTIVE STORYTELLING CERTIFICATION') || ssD10.parts[4].output.includes('ACCREDITED_EXECUTIVE_STORYTELLER'));
});

test('Soft Skills Day 11: Resolution & Structural Invariants for Executive Presence & SCR Framework', () => {
  const ssD11 = getLongLesson('soft-skills', 11);
  assert.ok(ssD11, 'soft-skills Day 11 long lesson must resolve');
  assert.equal(ssD11.day, 11);
  assert.equal(ssD11.parts.length, 5, 'soft-skills Day 11 must contain exactly 5 parts');
  assert.ok(ssD11.summary.length >= 4, 'soft-skills Day 11 must contain comprehensive summary');
  assert.ok(ssD11.projectStep, 'soft-skills Day 11 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD11);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD11.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 11: Domain-Specific Content Assertions', () => {
  const ssD11 = getLongLesson('soft-skills', 11);
  assert.ok(ssD11);

  // Part 1 – The Psychology of Delivering Bad News
  assert.ok(ssD11.parts[0].title.includes('Delivering Bad News') || ssD11.parts[0].title.includes('Concealment'));
  assert.ok(ssD11.parts[0].output.includes('INCIDENT ESCALATION & CONCEALMENT AUDIT'));

  // Part 2 – The SCR Communication Framework
  assert.ok(ssD11.parts[1].title.includes('SCR') || ssD11.parts[1].title.includes('Situation'));
  assert.ok(ssD11.parts[1].output.includes('SCR EXECUTIVE CRISIS BRIEF AUDIT'));

  // Part 3 – Root Cause Attribution without Blame
  assert.ok(ssD11.parts[2].title.includes('Blame') || ssD11.parts[2].title.includes('Root Cause'));
  assert.ok(ssD11.parts[2].output.includes('BLAMELESS POST-MORTEM & SYSTEMIC AUDIT'));

  // Part 4 – Actionable Remediation Commitments
  assert.ok(ssD11.parts[3].title.includes('Remediation') || ssD11.parts[3].title.includes('SMART-E'));
  assert.ok(ssD11.parts[3].output.includes('REMEDIATION COMMITMENT GOVERNANCE AUDIT'));

  // Part 5 – Master Incident & Crisis Communication Suite
  assert.ok(ssD11.parts[4].title.includes('Master Incident') || ssD11.parts[4].title.includes('Executive Trust'));
  assert.ok(ssD11.parts[4].output.includes('MASTER CRISIS LEADERSHIP & TRUST CERTIFICATION'));
});

test('Soft Skills Day 12: Resolution & Structural Invariants for Negotiation & ZOPA/BATNA', () => {
  const ssD12 = getLongLesson('soft-skills', 12);
  assert.ok(ssD12, 'soft-skills Day 12 long lesson must resolve');
  assert.equal(ssD12.day, 12);
  assert.equal(ssD12.parts.length, 5, 'soft-skills Day 12 must contain exactly 5 parts');
  assert.ok(ssD12.summary.length >= 4, 'soft-skills Day 12 must contain comprehensive summary');
  assert.ok(ssD12.projectStep, 'soft-skills Day 12 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD12);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD12.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 12: Domain-Specific Content Assertions', () => {
  const ssD12 = getLongLesson('soft-skills', 12);
  assert.ok(ssD12);

  // Part 1 – Harvard Principled Negotiation
  assert.ok(ssD12.parts[0].title.includes('Principled Negotiation') || ssD12.parts[0].title.includes('Separating People'));
  assert.ok(ssD12.parts[0].output.includes('HARVARD PRINCIPLED NEGOTIATION AUDIT'));

  // Part 2 – Mathematical Mechanics of ZOPA
  assert.ok(ssD12.parts[1].title.includes('ZOPA'));
  assert.ok(ssD12.parts[1].output.includes('ZOPA TIMELINE OVERLAP EVALUATION'));

  // Part 3 – Engineering BATNA
  assert.ok(ssD12.parts[2].title.includes('BATNA'));
  assert.ok(ssD12.parts[2].output.includes('ENGINEERING BATNA & LEVERAGE AUDIT'));

  // Part 4 – Iron Triangle & Anchoring Bias
  assert.ok(ssD12.parts[3].title.includes('Iron Triangle') || ssD12.parts[3].title.includes('Anchoring'));
  assert.ok(ssD12.parts[3].output.includes('IRON TRIANGLE & ANCHORING BIAS AUDIT'));

  // Part 5 – Master Engineering Persuasion Suite
  assert.ok(ssD12.parts[4].title.includes('Master Engineering Persuasion') || ssD12.parts[4].title.includes('Negotiation Orchestrator'));
  assert.ok(ssD12.parts[4].output.includes('MASTER ENGINEERING PERSUASION ORCHESTRATION'));
});

test('Soft Skills Day 13: Resolution & Structural Invariants for Maker Schedule & Deep Work', () => {
  const ssD13 = getLongLesson('soft-skills', 13);
  assert.ok(ssD13, 'soft-skills Day 13 long lesson must resolve');
  assert.equal(ssD13.day, 13);
  assert.equal(ssD13.parts.length, 5, 'soft-skills Day 13 must contain exactly 5 parts');
  assert.ok(ssD13.summary.length >= 4, 'soft-skills Day 13 must contain comprehensive summary');
  assert.ok(ssD13.projectStep, 'soft-skills Day 13 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD13);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD13.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 13: Domain-Specific Content Assertions', () => {
  const ssD13 = getLongLesson('soft-skills', 13);
  assert.ok(ssD13);

  // Part 1 – Attention Residue & Context Switching
  assert.ok(ssD13.parts[0].title.includes('Attention Residue') || ssD13.parts[0].title.includes('Context Switching'));
  assert.ok(ssD13.parts[0].output.includes('CONTEXT SWITCHING OVERHEAD & ATTENTION RESIDUE AUDIT'));

  // Part 2 – Maker's Schedule vs Manager's Schedule
  assert.ok(ssD13.parts[1].title.includes('Maker') || ssD13.parts[1].title.includes('Manager'));
  assert.ok(ssD13.parts[1].output.includes("MAKER'S SCHEDULE AUDIT"));

  // Part 3 – The Positive 'No' Framework
  assert.ok(ssD13.parts[2].title.includes('Positive') || ssD13.parts[2].title.includes('No'));
  assert.ok(ssD13.parts[2].output.includes("WILLIAM URY POSITIVE 'NO' BOUNDARY AUDIT"));

  // Part 4 – Asynchronous Communication Batching
  assert.ok(ssD13.parts[3].title.includes('Asynchronous') || ssD13.parts[3].title.includes('Batching'));
  assert.ok(ssD13.parts[3].output.includes('ASYNCHRONOUS NOTIFICATION BATCHING SIMULATION'));

  // Part 5 – Master Engineering Focus & Schedule Auditor
  assert.ok(ssD13.parts[4].title.includes('Master Engineering Focus') || ssD13.parts[4].title.includes('Deep Work'));
  assert.ok(ssD13.parts[4].output.includes('MASTER ENGINEERING DEEP WORK & COGNITIVE AUDIT'));
});

test('Soft Skills Day 14: Resolution & Structural Invariants for Psychological Safety & Burnout Prevention', () => {
  const ssD14 = getLongLesson('soft-skills', 14);
  assert.ok(ssD14, 'soft-skills Day 14 long lesson must resolve');
  assert.equal(ssD14.day, 14);
  assert.equal(ssD14.parts.length, 5, 'soft-skills Day 14 must contain exactly 5 parts');
  assert.ok(ssD14.summary.length >= 4, 'soft-skills Day 14 must contain comprehensive summary');
  assert.ok(ssD14.projectStep, 'soft-skills Day 14 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD14);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD14.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 14: Domain-Specific Content Assertions', () => {
  const ssD14 = getLongLesson('soft-skills', 14);
  assert.ok(ssD14);

  // Part 1 – Amy Edmondson's 7 Dimensions & Project Aristotle
  assert.ok(ssD14.parts[0].title.includes('Amy Edmondson') || ssD14.parts[0].title.includes('Aristotle'));
  assert.ok(ssD14.parts[0].output.includes('AMY EDMONDSON PSYCHOLOGICAL SAFETY AUDIT'));

  // Part 2 – Deconstructing Imposter Syndrome & Brag Document
  assert.ok(ssD14.parts[1].title.includes('Imposter') || ssD14.parts[1].title.includes('Brag Document'));
  assert.ok(ssD14.parts[1].output.includes('IMPOSTER SYNDROME DECONSTRUCTION AUDIT'));

  // Part 3 – Physiology & Stages of Burnout
  assert.ok(ssD14.parts[2].title.includes('Burnout') || ssD14.parts[2].title.includes('Maslach'));
  assert.ok(ssD14.parts[2].output.includes('MASLACH BURNOUT INVENTORY (MBI) DIAGNOSTIC'));

  // Part 4 – Growth Mindset & Cognitive Reframing
  assert.ok(ssD14.parts[3].title.includes('Growth Mindset') || ssD14.parts[3].title.includes('Cognitive Reframing'));
  assert.ok(ssD14.parts[3].output.includes('COGNITIVE GROWTH MINDSET REFRAMING AUDIT'));

  // Part 5 – Master Engineering Well-Being & Resilience Suite
  assert.ok(ssD14.parts[4].title.includes('Master Engineering Well-Being') || ssD14.parts[4].title.includes('Resilience'));
  assert.ok(ssD14.parts[4].output.includes('MASTER ENGINEERING WELL-BEING & RESILIENCE CERTIFICATION'));
});

test('Soft Skills Day 15: Resolution & Structural Invariants for Milestone 2 Technical Leadership Engine', () => {
  const ssD15 = getLongLesson('soft-skills', 15);
  assert.ok(ssD15, 'soft-skills Day 15 long lesson must resolve');
  assert.equal(ssD15.day, 15);
  assert.equal(ssD15.parts.length, 5, 'soft-skills Day 15 must contain exactly 5 parts');
  assert.ok(ssD15.summary.length >= 4, 'soft-skills Day 15 must contain comprehensive summary');
  assert.ok(ssD15.projectStep, 'soft-skills Day 15 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD15);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD15.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 15: Domain-Specific Content Assertions', () => {
  const ssD15 = getLongLesson('soft-skills', 15);
  assert.ok(ssD15);

  // Part 1 – Integrated Technical Leadership Pipeline
  assert.ok(ssD15.parts[0].title.includes('Leadership Pipeline') || ssD15.parts[0].title.includes('Synthesis'));
  assert.ok(ssD15.parts[0].output.includes('LEADERSHIP COMPETENCY MATRIX AUDIT'));

  // Part 2 – Cross-Functional Business Value Translation & ROI
  assert.ok(ssD15.parts[1].title.includes('Cross-Functional') || ssD15.parts[1].title.includes('ELI5'));
  assert.ok(ssD15.parts[1].output.includes('CROSS-FUNCTIONAL TRANSLATION GATEWAY AUDIT'));

  // Part 3 – High-Trust Feedback & Conflict De-escalation
  assert.ok(ssD15.parts[2].title.includes('SBI') || ssD15.parts[2].title.includes('IBR') || ssD15.parts[2].title.includes('Feedback'));
  assert.ok(ssD15.parts[2].output.includes('SBI & IBR HIGH-TRUST MEDIATION GATEWAY AUDIT'));

  // Part 4 – Executive Crisis Communication & Strategic Storytelling
  assert.ok(ssD15.parts[3].title.includes('SCR') || ssD15.parts[3].title.includes('Crisis') || ssD15.parts[3].title.includes('Storytelling'));
  assert.ok(ssD15.parts[3].output.includes('SCR EXECUTIVE CRISIS COMMUNICATION GATEWAY AUDIT'));

  // Part 5 – Sovereign Technical Leadership Certification Gateway
  assert.ok(ssD15.parts[4].title.includes('Sovereign Technical Leadership') || ssD15.parts[4].title.includes('Certification Gateway'));
  assert.ok(ssD15.parts[4].output.includes('SOVEREIGN TECH LEADERSHIP MASTER GATEWAY'));
});
test('Soft Skills Day 16: Resolution & Structural Invariants for Tech Resume Engineering & Google X-Y-Z', () => {
  const ssD16 = getLongLesson('soft-skills', 16);
  assert.ok(ssD16, 'soft-skills Day 16 long lesson must resolve');
  assert.equal(ssD16.day, 16);
  assert.equal(ssD16.parts.length, 5, 'soft-skills Day 16 must contain exactly 5 parts');
  assert.ok(ssD16.summary.length >= 4, 'soft-skills Day 16 must contain comprehensive summary');
  assert.ok(ssD16.projectStep, 'soft-skills Day 16 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD16);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD16.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 16: Domain-Specific Content Assertions', () => {
  const ssD16 = getLongLesson('soft-skills', 16);
  assert.ok(ssD16);

  // Part 1 – ATS Parser & 6-Second Screen
  assert.ok(ssD16.parts[0].title.includes('ATS') || ssD16.parts[0].title.includes('6-Second'));
  assert.ok(ssD16.parts[0].output.includes('ATS PARSER') || ssD16.parts[0].output.includes('6-SECOND'));

  // Part 2 – Google X-Y-Z Formula
  assert.ok(ssD16.parts[1].title.includes('X-Y-Z') || ssD16.parts[1].title.includes('Google'));
  assert.ok(ssD16.parts[1].output.includes('GOOGLE X-Y-Z'));

  // Part 3 – Active Verbs vs Weak Buzzwords
  assert.ok(ssD16.parts[2].title.includes('Action Verbs') || ssD16.parts[2].title.includes('Passive'));
  assert.ok(ssD16.parts[2].output.includes('ACTION VERB'));

  // Part 4 – Engineering Scale Quantification
  assert.ok(ssD16.parts[3].title.includes('Scale') || ssD16.parts[3].title.includes('Metrics'));
  assert.ok(ssD16.parts[3].output.includes('ENGINEERING SCALE'));

  // Part 5 – Master Technical Resume Audit Suite
  assert.ok(ssD16.parts[4].title.includes('Master Technical Resume') || ssD16.parts[4].title.includes('Auditor'));
  assert.ok(ssD16.parts[4].output.includes('MASTER TECHNICAL RESUME'));
});

test('Soft Skills Day 17: Resolution & Structural Invariants for LinkedIn Optimization & Personal Branding', () => {
  const ssD17 = getLongLesson('soft-skills', 17);
  assert.ok(ssD17, 'soft-skills Day 17 long lesson must resolve');
  assert.equal(ssD17.day, 17);
  assert.equal(ssD17.parts.length, 5, 'soft-skills Day 17 must contain exactly 5 parts');
  assert.ok(ssD17.summary.length >= 4, 'soft-skills Day 17 must contain comprehensive summary');
  assert.ok(ssD17.projectStep, 'soft-skills Day 17 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD17);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD17.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 17: Domain-Specific Content Assertions', () => {
  const ssD17 = getLongLesson('soft-skills', 17);
  assert.ok(ssD17);

  // Part 1 – Recruiter Search & Boolean Algorithms
  assert.ok(ssD17.parts[0].title.includes('Recruiter Search') || ssD17.parts[0].title.includes('Boolean'));
  assert.ok(ssD17.parts[0].output.includes('RECRUITER BOOLEAN SEARCH'));

  // Part 2 – 3-Part Technical Headline
  assert.ok(ssD17.parts[1].title.includes('Headline') || ssD17.parts[1].title.includes('Role | Core Stack'));
  assert.ok(ssD17.parts[1].output.includes('LINKEDIN TECHNICAL HEADLINE'));

  // Part 3 – About Section Narrative Arc
  assert.ok(ssD17.parts[2].title.includes('About') || ssD17.parts[2].title.includes('Narrative Arc'));
  assert.ok(ssD17.parts[2].output.includes('LINKEDIN ABOUT SECTION'));

  // Part 4 – Showcasing Proof-of-Work & GitHub
  assert.ok(ssD17.parts[3].title.includes('Proof-of-Work') || ssD17.parts[3].title.includes('GitHub'));
  assert.ok(ssD17.parts[3].output.includes('LINKEDIN FEATURED SECTION'));

  // Part 5 – Master LinkedIn Profile & Personal Brand Suite
  assert.ok(ssD17.parts[4].title.includes('Master LinkedIn Profile') || ssD17.parts[4].title.includes('Magnet'));
  assert.ok(ssD17.parts[4].output.includes('MASTER LINKEDIN PROFILE'));
});

test('Soft Skills Day 18: Resolution & Structural Invariants for Behavioral Interview Framework & STAR Method', () => {
  const ssD18 = getLongLesson('soft-skills', 18);
  assert.ok(ssD18, 'soft-skills Day 18 long lesson must resolve');
  assert.equal(ssD18.day, 18);
  assert.equal(ssD18.parts.length, 5, 'soft-skills Day 18 must contain exactly 5 parts');
  assert.ok(ssD18.summary.length >= 4, 'soft-skills Day 18 must contain comprehensive summary');
  assert.ok(ssD18.projectStep, 'soft-skills Day 18 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD18);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD18.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 18: Domain-Specific Content Assertions', () => {
  const ssD18 = getLongLesson('soft-skills', 18);
  assert.ok(ssD18);

  // Part 1 – Psychology of Tech Behavioral Interviews
  assert.ok(ssD18.parts[0].title.includes('Psychology') || ssD18.parts[0].title.includes('Behavioral'));
  assert.ok(ssD18.parts[0].output.includes('BEHAVIORAL COMPETENCY RUBRIC EVALUATION'));

  // Part 2 – STAR Method Deconstructed
  assert.ok(ssD18.parts[1].title.includes('STAR Method') || ssD18.parts[1].title.includes('Deconstructed'));
  assert.ok(ssD18.parts[1].output.includes('STAR FRAMEWORK STRUCTURAL AUDIT'));

  // Part 3 – 60/40 Pacing Invariant
  assert.ok(ssD18.parts[2].title.includes('Pacing') || ssD18.parts[2].title.includes('Context Trap'));
  assert.ok(ssD18.parts[2].output.includes('STAR PACING & TIME ALLOCATION AUDIT'));

  // Part 4 – First-Person Ownership
  assert.ok(ssD18.parts[3].title.includes('First-Person') || ssD18.parts[3].title.includes('Ownership'));
  assert.ok(ssD18.parts[3].output.includes('FIRST-PERSON OWNERSHIP & AGENCY EVALUATION'));

  // Part 5 – Master STAR Behavioral Interview Suite
  assert.ok(ssD18.parts[4].title.includes('Master STAR') || ssD18.parts[4].title.includes('Scoring Engine'));
  assert.ok(ssD18.parts[4].output.includes('MASTER STAR BEHAVIORAL INTERVIEW SCORECARD'));
});

test('Soft Skills Day 19: Resolution & Structural Invariants for Answering Tell Me About Yourself', () => {
  const ssD19 = getLongLesson('soft-skills', 19);
  assert.ok(ssD19, 'soft-skills Day 19 long lesson must resolve');
  assert.equal(ssD19.day, 19);
  assert.equal(ssD19.parts.length, 5, 'soft-skills Day 19 must contain exactly 5 parts');
  assert.ok(ssD19.summary.length >= 4, 'soft-skills Day 19 must contain comprehensive summary');
  assert.ok(ssD19.projectStep, 'soft-skills Day 19 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD19);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD19.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 19: Domain-Specific Content Assertions', () => {
  const ssD19 = getLongLesson('soft-skills', 19);
  assert.ok(ssD19);

  // Part 1 – Opening Screen Impression
  assert.ok(ssD19.parts[0].title.includes('Opening Screen') || ssD19.parts[0].title.includes('Makes or Breaks'));
  assert.ok(ssD19.parts[0].output.includes('OPENING SCREEN IMPRESSION AUDIT'));

  // Part 2 – 3-Act Narrative Arc
  assert.ok(ssD19.parts[1].title.includes('3-Act') || ssD19.parts[1].title.includes('Present, Past'));
  assert.ok(ssD19.parts[1].output.includes('3-ACT ELEVATOR PITCH NARRATIVE AUDIT'));

  // Part 3 – Crucible Project Teaser
  assert.ok(ssD19.parts[2].title.includes('Crucible') || ssD19.parts[2].title.includes('Technical Depth'));
  assert.ok(ssD19.parts[2].output.includes('CRUCIBLE HOOK & TECHNICAL BAIT AUDIT'));

  // Part 4 – 90-Second Stopwatch & Conversational Pass-Back
  assert.ok(ssD19.parts[3].title.includes('Stopwatch') || ssD19.parts[3].title.includes('Pass-Back'));
  assert.ok(ssD19.parts[3].output.includes('PITCH PACING & CONVERSATIONAL PASS-BACK AUDIT'));

  // Part 5 – Master Elevator Pitch Engine
  assert.ok(ssD19.parts[4].title.includes('Master Elevator Pitch') || ssD19.parts[4].title.includes('Synthesis'));
  assert.ok(ssD19.parts[4].output.includes('MASTER ELEVATOR PITCH EVALUATION SCORECARD'));
});

test('Soft Skills Day 20: Resolution & Structural Invariants for Tackling Failure Questions & Blameless Postmortems', () => {
  const ssD20 = getLongLesson('soft-skills', 20);
  assert.ok(ssD20, 'soft-skills Day 20 long lesson must resolve');
  assert.equal(ssD20.day, 20);
  assert.equal(ssD20.parts.length, 5, 'soft-skills Day 20 must contain exactly 5 parts');
  assert.ok(ssD20.summary.length >= 4, 'soft-skills Day 20 must contain comprehensive summary');
  assert.ok(ssD20.projectStep, 'soft-skills Day 20 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD20);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD20.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 20: Domain-Specific Content Assertions', () => {
  const ssD20 = getLongLesson('soft-skills', 20);
  assert.ok(ssD20);

  // Part 1 – Psychology of the Failure Question
  assert.ok(ssD20.parts[0].title.includes('Psychology') || ssD20.parts[0].title.includes('Failure Question'));
  assert.ok(ssD20.parts[0].output.includes('FAILURE STORY SCREENING & RUBRIC AUDIT'));

  // Part 2 – Blameless Postmortem Mindset
  assert.ok(ssD20.parts[1].title.includes('Blameless Postmortem') || ssD20.parts[1].title.includes('SRE'));
  assert.ok(ssD20.parts[1].output.includes('BLAMELESS POSTMORTEM STRUCTURE AUDIT'));

  // Part 3 – Five Whys Root Cause Chain
  assert.ok(ssD20.parts[2].title.includes('Five Whys') || ssD20.parts[2].title.includes('Root Cause'));
  assert.ok(ssD20.parts[2].output.includes('FIVE WHYS ROOT CAUSE CHAIN AUDIT'));

  // Part 4 – Systemic Prevention Guardrails
  assert.ok(ssD20.parts[3].title.includes('Guardrails') || ssD20.parts[3].title.includes('Prevention'));
  assert.ok(ssD20.parts[3].output.includes('SYSTEMIC PREVENTION GUARDRAILS AUDIT'));

  // Part 5 – Master Blameless Postmortem Storytelling Suite
  assert.ok(ssD20.parts[4].title.includes('Master Blameless Postmortem') || ssD20.parts[4].title.includes('Suite'));
  assert.ok(ssD20.parts[4].output.includes('MASTER BLAMELESS POSTMORTEM EVALUATION'));
});
