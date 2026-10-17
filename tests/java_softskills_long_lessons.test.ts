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

test('Soft Skills Day 21: Resolution & Structural Invariants for ⭐ MILESTONE 3: Complete Google X-Y-Z Resume, STAR Method & Failure Engine', () => {
  const ssD21 = getLongLesson('soft-skills', 21);
  assert.ok(ssD21, 'soft-skills Day 21 long lesson must resolve');
  assert.equal(ssD21.day, 21);
  assert.equal(ssD21.parts.length, 5, 'soft-skills Day 21 must contain exactly 5 parts');
  assert.ok(ssD21.summary.length >= 4, 'soft-skills Day 21 must contain comprehensive summary');
  assert.ok(ssD21.projectStep, 'soft-skills Day 21 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD21);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD21.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 21: Domain-Specific Content Assertions & Milestone 3 Certification', () => {
  const ssD21 = getLongLesson('soft-skills', 21);
  assert.ok(ssD21);

  // Part 1 – Milestone 3 Competency Architecture
  assert.ok(ssD21.parts[0].title.includes('Milestone 3') || ssD21.parts[0].title.includes('Competency'));
  assert.ok(ssD21.parts[0].output.includes('MILESTONE 3: TECH CAREER & INTERVIEW COMPETENCY MATRIX'));

  // Part 2 – Inbound / Outbound Lead Gateway
  assert.ok(ssD21.parts[1].title.includes('Inbound') || ssD21.parts[1].title.includes('Lead Generation'));
  assert.ok(ssD21.parts[1].output.includes('INBOUND & OUTBOUND LEAD GENERATION GATEWAY'));

  // Part 3 – STAR & Technical Depth Simulation
  assert.ok(ssD21.parts[2].title.includes('STAR') || ssD21.parts[2].title.includes('Pacing'));
  assert.ok(ssD21.parts[2].output.includes('BEHAVIORAL COMPETENCY & 60/40 PACING GATEWAY'));

  // Part 4 – Pitch & Postmortem
  assert.ok(ssD21.parts[3].title.includes('Elevator Pitch') || ssD21.parts[3].title.includes('Postmortem'));
  assert.ok(ssD21.parts[3].output.includes('CRUCIBLE PITCH & BLAMELESS POSTMORTEM GATEWAY'));

  // Part 5 – Sovereign Tech Career Engine
  assert.ok(ssD21.parts[4].title.includes('Sovereign') || ssD21.parts[4].title.includes('Certification'));
  assert.ok(ssD21.parts[4].output.includes('SOVEREIGN TECH CAREER & INTERVIEW CERTIFICATION GATEWAY'));
});

test('Soft Skills Day 22: Resolution & Structural Invariants for High-Signal Reverse Interviewing', () => {
  const ssD22 = getLongLesson('soft-skills', 22);
  assert.ok(ssD22, 'soft-skills Day 22 long lesson must resolve');
  assert.equal(ssD22.day, 22);
  assert.equal(ssD22.parts.length, 5, 'soft-skills Day 22 must contain exactly 5 parts');
  assert.ok(ssD22.summary.length >= 4, 'soft-skills Day 22 must contain comprehensive summary');
  assert.ok(ssD22.projectStep, 'soft-skills Day 22 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD22);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD22.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 22: Domain-Specific Content Assertions', () => {
  const ssD22 = getLongLesson('soft-skills', 22);
  assert.ok(ssD22);

  // Part 1 – Reverse Question Signal Classifier
  assert.ok(ssD22.parts[0].title.includes('Reverse Interview Paradox') || ssD22.parts[0].title.includes('Audition'));
  assert.ok(ssD22.parts[0].output.includes('REVERSE INTERVIEW QUESTION SIGNAL AUDIT'));

  // Part 2 – 4 Pillars of High-Signal Inquiry
  assert.ok(ssD22.parts[1].title.includes('4 Pillars') || ssD22.parts[1].title.includes('Pillars'));
  assert.ok(ssD22.parts[1].output.includes('4-PILLARS REVERSE INQUIRY AUDIT'));

  // Part 3 – Diagnosing Culture Red Flags
  assert.ok(ssD22.parts[2].title.includes('Red Flags') || ssD22.parts[2].title.includes('Burnout'));
  assert.ok(ssD22.parts[2].output.includes('ENGINEERING CULTURE RED FLAG AUDIT'));

  // Part 4 – Role-Tailored Inquiries
  assert.ok(ssD22.parts[3].title.includes('Role-Tailored') || ssD22.parts[3].title.includes('Recruiter vs'));
  assert.ok(ssD22.parts[3].output.includes('INTERVIEWER PERSONA QUESTION TARGETING AUDIT'));

  // Part 5 – Master Reverse Interviewing Simulator
  assert.ok(ssD22.parts[4].title.includes('Master Reverse Interviewing') || ssD22.parts[4].title.includes('Simulator'));
  assert.ok(ssD22.parts[4].output.includes('MASTER REVERSE INTERVIEWING EVALUATION'));
});

test('Soft Skills Day 23: Resolution & Structural Invariants for Live Coding Communication & Think-Aloud Protocols', () => {
  const ssD23 = getLongLesson('soft-skills', 23);
  assert.ok(ssD23, 'soft-skills Day 23 long lesson must resolve');
  assert.equal(ssD23.day, 23);
  assert.equal(ssD23.parts.length, 5, 'soft-skills Day 23 must contain exactly 5 parts');
  assert.ok(ssD23.summary.length >= 4, 'soft-skills Day 23 must contain comprehensive summary');
  assert.ok(ssD23.projectStep, 'soft-skills Day 23 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD23);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD23.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 23: Domain-Specific Content Assertions', () => {
  const ssD23 = getLongLesson('soft-skills', 23);
  assert.ok(ssD23);

  // Part 1 – Think-Aloud Signpost Auditor
  assert.ok(ssD23.parts[0].title.includes('Psychology') || ssD23.parts[0].title.includes('Thought Process'));
  assert.ok(ssD23.parts[0].output.includes('THINK-ALOUD SIGNPOST AUDIT'));

  // Part 2 – 5-Step Clarification Protocol
  assert.ok(ssD23.parts[1].title.includes('5-Step') || ssD23.parts[1].title.includes('Clarification'));
  assert.ok(ssD23.parts[1].output.includes('5-STEP REQUIREMENT CLARIFICATION AUDIT'));

  // Part 3 – Cognitive Signposting Engine
  assert.ok(ssD23.parts[2].title.includes('Cognitive Signposting') || ssD23.parts[2].title.includes('Implementation'));
  assert.ok(ssD23.parts[2].output.includes('LIVE CODING COGNITIVE SIGNPOSTING AUDIT'));

  // Part 4 – Receptive Hint Handling
  assert.ok(ssD23.parts[3].title.includes('Hint Handling') || ssD23.parts[3].title.includes('Coachability'));
  assert.ok(ssD23.parts[3].output.includes('INTERVIEWER HINT RECEPTION AUDIT'));

  // Part 5 – Master Live Coding Communication Simulator
  assert.ok(ssD23.parts[4].title.includes('Master Live Coding') || ssD23.parts[4].title.includes('Simulator'));
  assert.ok(ssD23.parts[4].output.includes('MASTER LIVE CODING SCREEN EVALUATION'));
});

test('Soft Skills Day 24: Resolution & Structural Invariants for System Design Interview Communication & RADIO Framework', () => {
  const ssD24 = getLongLesson('soft-skills', 24);
  assert.ok(ssD24, 'soft-skills Day 24 long lesson must resolve');
  assert.equal(ssD24.day, 24);
  assert.equal(ssD24.parts.length, 5, 'soft-skills Day 24 must contain exactly 5 parts');
  assert.ok(ssD24.summary.length >= 4, 'soft-skills Day 24 must contain comprehensive summary');
  assert.ok(ssD24.projectStep, 'soft-skills Day 24 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD24);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD24.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 24: Domain-Specific Content Assertions', () => {
  const ssD24 = getLongLesson('soft-skills', 24);
  assert.ok(ssD24);

  // Part 1 – Anatomy of System Design Communication
  assert.ok(ssD24.parts[0].title.includes('Anatomy') || ssD24.parts[0].title.includes('Structured Dialogue'));
  assert.ok(ssD24.parts[0].output.includes('SYSTEM DESIGN COMMUNICATION AUDIT'));

  // Part 2 – RADIO Pillar R & A
  assert.ok(ssD24.parts[1].title.includes('RADIO Pillar R & A') || ssD24.parts[1].title.includes('Requirements'));
  assert.ok(ssD24.parts[1].output.includes('RADIO PILLAR R & A: REQUIREMENTS & HIGH-LEVEL ARCHITECTURE'));

  // Part 3 – RADIO Pillar D & I
  assert.ok(ssD24.parts[2].title.includes('RADIO Pillar D & I') || ssD24.parts[2].title.includes('Data Model'));
  assert.ok(ssD24.parts[2].output.includes('RADIO PILLAR D & I: DATA MODEL & API CONTRACTS'));

  // Part 4 – RADIO Pillar O
  assert.ok(ssD24.parts[3].title.includes('RADIO Pillar O') || ssD24.parts[3].title.includes('Optimization'));
  assert.ok(ssD24.parts[3].output.includes('RADIO PILLAR O: OPTIMIZATIONS & DEEP-DIVE RESILIENCE'));

  // Part 5 – Master RADIO System Design Suite
  assert.ok(ssD24.parts[4].title.includes('Master RADIO') || ssD24.parts[4].title.includes('Simulator'));
  assert.ok(ssD24.parts[4].output.includes('MASTER RADIO SYSTEM DESIGN EVALUATION'));
});

test('Soft Skills Day 25: Resolution & Structural Invariants for Salary Negotiation & Total Compensation Mechanics', () => {
  const ssD25 = getLongLesson('soft-skills', 25);
  assert.ok(ssD25, 'soft-skills Day 25 long lesson must resolve');
  assert.equal(ssD25.day, 25);
  assert.equal(ssD25.parts.length, 5, 'soft-skills Day 25 must contain exactly 5 parts');
  assert.ok(ssD25.summary.length >= 4, 'soft-skills Day 25 must contain comprehensive summary');
  assert.ok(ssD25.projectStep, 'soft-skills Day 25 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD25);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD25.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 25: Domain-Specific Content Assertions', () => {
  const ssD25 = getLongLesson('soft-skills', 25);
  assert.ok(ssD25);

  // Part 1 – Total Compensation Model
  assert.ok(ssD25.parts[0].title.includes('Total Compensation') || ssD25.parts[0].title.includes('TC'));
  assert.ok(ssD25.parts[0].output.includes('TOTAL COMPENSATION (TC) ANALYSIS'));

  // Part 2 – Equity Mechanics Demystified
  assert.ok(ssD25.parts[1].title.includes('Equity Mechanics') || ssD25.parts[1].title.includes('RSUs'));
  assert.ok(ssD25.parts[1].output.includes('EQUITY MECHANICS & VESTING SIMULATION'));

  // Part 3 – Salary Anchor Deflection
  assert.ok(ssD25.parts[2].title.includes('Information Asymmetry') || ssD25.parts[2].title.includes('Deflection'));
  assert.ok(ssD25.parts[2].output.includes('SALARY ANCHOR DEFLECTION AUDIT'));

  // Part 4 – Counter-Offer Protocol
  assert.ok(ssD25.parts[3].title.includes('Counter-Offer') || ssD25.parts[3].title.includes('Protocol'));
  assert.ok(ssD25.parts[3].output.includes('COUNTER-OFFER PROTOCOL & SCRIPT AUDIT'));

  // Part 5 – Master Compensation Negotiation Suite
  assert.ok(ssD25.parts[4].title.includes('Master Compensation') || ssD25.parts[4].title.includes('Optimization'));
  assert.ok(ssD25.parts[4].output.includes('MASTER COMPENSATION NEGOTIATION EVALUATION'));
});

test('Soft Skills Day 26: Resolution & Structural Invariants for Impostor Syndrome, Boundary Setting & Assertiveness', () => {
  const ssD26 = getLongLesson('soft-skills', 26);
  assert.ok(ssD26, 'soft-skills Day 26 long lesson must resolve');
  assert.equal(ssD26.day, 26);
  assert.equal(ssD26.parts.length, 5, 'soft-skills Day 26 must contain exactly 5 parts');
  assert.ok(ssD26.summary.length >= 4, 'soft-skills Day 26 must contain comprehensive summary');
  assert.ok(ssD26.projectStep, 'soft-skills Day 26 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD26);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD26.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 26: Domain-Specific Content Assertions', () => {
  const ssD26 = getLongLesson('soft-skills', 26);
  assert.ok(ssD26);

  // Part 1 – Impostor Syndrome
  assert.ok(ssD26.parts[0].title.includes('Impostor Syndrome') || ssD26.parts[0].title.includes('Psychology'));
  assert.ok(ssD26.parts[0].output.includes('IMPOSTOR SYNDROME DIAGNOSTIC & REFRAMING AUDIT'));

  // Part 2 – Professional No
  assert.ok(ssD26.parts[1].title.includes('Professional') || ssD26.parts[1].title.includes('Boundary'));
  assert.ok(ssD26.parts[1].output.includes('PROFESSIONAL BOUNDARY & THE ART OF "NO" AUDIT'));

  // Part 3 – Managing Up & Realistic Deadlines
  assert.ok(ssD26.parts[2].title.includes('Managing Up') || ssD26.parts[2].title.includes('Deadlines'));
  assert.ok(ssD26.parts[2].output.includes('MANAGING UP & DEADLINE NEGOTIATION AUDIT'));

  // Part 4 – Healthy Assertiveness
  assert.ok(ssD26.parts[3].title.includes('Assertiveness') || ssD26.parts[3].title.includes('Aggression'));
  assert.ok(ssD26.parts[3].output.includes('CODE REVIEW ASSERTIVENESS AUDIT'));

  // Part 5 – Master Boundary & Assertiveness Suite
  assert.ok(ssD26.parts[4].title.includes('Master') || ssD26.parts[4].title.includes('Assertiveness'));
  assert.ok(ssD26.parts[4].output.includes('MASTER SELF-EFFICACY & PROFESSIONAL BOUNDARY EVALUATION'));
});

test('Soft Skills Day 27: Resolution & Structural Invariants for Cross-Cultural Communication & Global Teams', () => {
  const ssD27 = getLongLesson('soft-skills', 27);
  assert.ok(ssD27, 'soft-skills Day 27 long lesson must resolve');
  assert.equal(ssD27.day, 27);
  assert.equal(ssD27.parts.length, 5, 'soft-skills Day 27 must contain exactly 5 parts');
  assert.ok(ssD27.summary.length >= 4, 'soft-skills Day 27 must contain comprehensive summary');
  assert.ok(ssD27.projectStep, 'soft-skills Day 27 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD27);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD27.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 27: Domain-Specific Content Assertions', () => {
  const ssD27 = getLongLesson('soft-skills', 27);
  assert.ok(ssD27);

  // Part 1 – Cultural Map
  assert.ok(ssD27.parts[0].title.includes('Cultural Map') || ssD27.parts[0].title.includes('High-Context'));
  assert.ok(ssD27.parts[0].output.includes('CROSS-CULTURAL ENGINEERING CONTEXT AUDIT'));

  // Part 2 – Async Hygiene
  assert.ok(ssD27.parts[1].title.includes('Asynchronous') || ssD27.parts[1].title.includes('Hygiene'));
  assert.ok(ssD27.parts[1].output.includes('ASYNCHRONOUS ENGINEERING HYGIENE AUDIT'));

  // Part 3 – Time-Zone Sovereignty
  assert.ok(ssD27.parts[2].title.includes('Time-Zone') || ssD27.parts[2].title.includes('Handshake'));
  assert.ok(ssD27.parts[2].output.includes('TIME-ZONE SOVEREIGNTY & GOLDEN HANDSHAKE AUDIT'));

  // Part 4 – International Code Reviews
  assert.ok(ssD27.parts[3].title.includes('Code Review') || ssD27.parts[3].title.includes('Idiom'));
  assert.ok(ssD27.parts[3].output.includes('INTERNATIONAL CODE REVIEW & IDIOM SANITIZER AUDIT'));

  // Part 5 – Master Cross-Cultural Suite
  assert.ok(ssD27.parts[4].title.includes('Master') || ssD27.parts[4].title.includes('Cross-Cultural'));
  assert.ok(ssD27.parts[4].output.includes('MASTER CROSS-CULTURAL DISTRIBUTED TEAM EVALUATION'));
});

test('Soft Skills Day 28: Resolution & Structural Invariants for Influence Without Authority & Driving Change', () => {
  const ssD28 = getLongLesson('soft-skills', 28);
  assert.ok(ssD28, 'soft-skills Day 28 long lesson must resolve');
  assert.equal(ssD28.day, 28);
  assert.equal(ssD28.parts.length, 5, 'soft-skills Day 28 must contain exactly 5 parts');
  assert.ok(ssD28.summary.length >= 4, 'soft-skills Day 28 must contain comprehensive summary');
  assert.ok(ssD28.projectStep, 'soft-skills Day 28 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD28);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD28.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 28: Domain-Specific Content Assertions', () => {
  const ssD28 = getLongLesson('soft-skills', 28);
  assert.ok(ssD28);

  // Part 1 – Influence Dilemma
  assert.ok(ssD28.parts[0].title.includes('Influence') || ssD28.parts[0].title.includes('Dilemma'));
  assert.ok(ssD28.parts[0].output.includes('ENGINEERING INFLUENCE DILEMMA AUDIT'));

  // Part 2 – Stakeholder Power Grid
  assert.ok(ssD28.parts[1].title.includes('Stakeholder') || ssD28.parts[1].title.includes('Power Grid'));
  assert.ok(ssD28.parts[1].output.includes('STAKEHOLDER POWER GRID MAPPING AUDIT'));

  // Part 3 – Nemawashi Pre-Wire
  assert.ok(ssD28.parts[2].title.includes('Nemawashi') || ssD28.parts[2].title.includes('Pre-Wire'));
  assert.ok(ssD28.parts[2].output.includes('NEMAWASHI PRE-WIRE CONSENSUS AUDIT'));

  // Part 4 – Technical to Business Value
  assert.ok(ssD28.parts[3].title.includes('Business Value') || ssD28.parts[3].title.includes('Framing'));
  assert.ok(ssD28.parts[3].output.includes('TECHNICAL TO BUSINESS VALUE TRANSLATION AUDIT'));

  // Part 5 – Master Influence Suite
  assert.ok(ssD28.parts[4].title.includes('Master') || ssD28.parts[4].title.includes('Influence'));
  assert.ok(ssD28.parts[4].output.includes('MASTER INFLUENCE WITHOUT AUTHORITY EVALUATION'));
});

test('Soft Skills Day 29: Resolution & Structural Invariants for Tech Specs, Architecture RFCs & Consensus', () => {
  const ssD29 = getLongLesson('soft-skills', 29);
  assert.ok(ssD29, 'soft-skills Day 29 long lesson must resolve');
  assert.equal(ssD29.day, 29);
  assert.equal(ssD29.parts.length, 5, 'soft-skills Day 29 must contain exactly 5 parts');
  assert.ok(ssD29.summary.length >= 4, 'soft-skills Day 29 must contain comprehensive summary');
  assert.ok(ssD29.projectStep, 'soft-skills Day 29 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD29);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD29.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 29: Domain-Specific Content Assertions', () => {
  const ssD29 = getLongLesson('soft-skills', 29);
  assert.ok(ssD29);

  // Part 1 – Tech Spec Anatomy
  assert.ok(ssD29.parts[0].title.includes('Tech Spec') || ssD29.parts[0].title.includes('Anatomy'));
  assert.ok(ssD29.parts[0].output.includes('TECH SPEC STRUCTURAL COMPLETENESS AUDIT'));

  // Part 2 – Alternatives Considered
  assert.ok(ssD29.parts[1].title.includes('Alternatives Considered') || ssD29.parts[1].title.includes('Trade-Off'));
  assert.ok(ssD29.parts[1].output.includes('ALTERNATIVES CONSIDERED & ARCHITECTURAL RIGOR AUDIT'));

  // Part 3 – RFC Comment Management
  assert.ok(ssD29.parts[2].title.includes('RFC Review') || ssD29.parts[2].title.includes('Bikeshed'));
  assert.ok(ssD29.parts[2].output.includes('RFC COMMENT MANAGEMENT & BIKESHED AUDIT'));

  // Part 4 – Migration Strategy & Safeguards
  assert.ok(ssD29.parts[3].title.includes('Migration') || ssD29.parts[3].title.includes('Rollout'));
  assert.ok(ssD29.parts[3].output.includes('MIGRATION SAFEGUARDS & ZERO-DOWNTIME ROLLOUT AUDIT'));

  // Part 5 – Master RFC Lifecycle Suite
  assert.ok(ssD29.parts[4].title.includes('Master') || ssD29.parts[4].title.includes('RFC'));
  assert.ok(ssD29.parts[4].output.includes('MASTER TECHNICAL RFC LIFECYCLE EVALUATION'));
});

test('Soft Skills Day 30: Resolution & Structural Invariants for Milestone 4 Grand Capstone & Sovereign Leadership', () => {
  const ssD30 = getLongLesson('soft-skills', 30);
  assert.ok(ssD30, 'soft-skills Day 30 long lesson must resolve');
  assert.equal(ssD30.day, 30);
  assert.equal(ssD30.parts.length, 5, 'soft-skills Day 30 must contain exactly 5 parts');
  assert.ok(ssD30.summary.length >= 4, 'soft-skills Day 30 must contain comprehensive summary');
  assert.ok(ssD30.projectStep, 'soft-skills Day 30 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD30);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD30.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 30: Domain-Specific Content Assertions', () => {
  const ssD30 = getLongLesson('soft-skills', 30);
  assert.ok(ssD30);

  // Part 1 – Milestone 4 Competency Matrix
  assert.ok(ssD30.parts[0].title.includes('Competency Matrix') || ssD30.parts[0].title.includes('360-Degree'));
  assert.ok(ssD30.parts[0].output.includes('MILESTONE 4: ADVANCED LEADERSHIP & CAREER CAPSTONE MATRIX'));

  // Part 2 – Executive Interview Loop Simulator
  assert.ok(ssD30.parts[1].title.includes('Executive Interview') || ssD30.parts[1].title.includes('Loop'));
  assert.ok(ssD30.parts[1].output.includes('EXECUTIVE INTERVIEW LOOP EVALUATION'));

  // Part 3 – Cross-Functional Influence & RFC Governance Gateway
  assert.ok(ssD30.parts[2].title.includes('Influence') || ssD30.parts[2].title.includes('Governance'));
  assert.ok(ssD30.parts[2].output.includes('CROSS-FUNCTIONAL INFLUENCE & RFC GOVERNANCE GATEWAY'));

  // Part 4 – Sovereign Offer Gateway
  assert.ok(ssD30.parts[3].title.includes('Offer Optimization') || ssD30.parts[3].title.includes('Total Compensation'));
  assert.ok(ssD30.parts[3].output.includes('OFFER OPTIMIZATION & TOTAL COMPENSATION SOVEREIGN GATEWAY'));

  // Part 5 – Grand Career OS Capstone Certification
  assert.ok(ssD30.parts[4].title.includes('Capstone Certification') || ssD30.parts[4].title.includes('Sovereign Technical Leader'));
  assert.ok(ssD30.parts[4].output.includes('GRAND CAREER OS CAPSTONE CERTIFICATION'));
});

test('Soft Skills Day 31: Resolution & Structural Invariants for Scope Clarification & Capacity Estimation', () => {
  const ssD31 = getLongLesson('soft-skills', 31);
  assert.ok(ssD31, 'soft-skills Day 31 long lesson must resolve');
  assert.equal(ssD31.day, 31);
  assert.equal(ssD31.parts.length, 5, 'soft-skills Day 31 must contain exactly 5 parts');
  assert.ok(ssD31.summary.length >= 4, 'soft-skills Day 31 must contain comprehensive summary');
  assert.ok(ssD31.projectStep, 'soft-skills Day 31 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD31);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD31.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 31: Domain-Specific Content Assertions', () => {
  const ssD31 = getLongLesson('soft-skills', 31);
  assert.ok(ssD31);

  assert.ok(ssD31.parts[0].output.includes('SYSTEM DESIGN OPENING CALCULUS EVALUATION'));
  assert.ok(ssD31.parts[1].output.includes('AMBIGUITY BOUNDARY PROBE EVALUATION'));
  assert.ok(ssD31.parts[2].output.includes('BACK-OF-THE-ENVELOPE CAPACITY EVALUATION'));
  assert.ok(ssD31.parts[3].output.includes('LIVE SCOPING UNDER FIRE LAB EVALUATION'));
  assert.ok(ssD31.parts[4].output.includes('DAY 31 SYSTEM DESIGN PROTOCOL CERTIFICATION'));
  assert.ok(ssD31.parts[4].output.includes('DAY_31_SCOPE_AND_ESTIMATION_100_PCT_VERIFIED'));
});

test('Soft Skills Day 32: Resolution & Structural Invariants for Driving the Whiteboard & Topological Canvas', () => {
  const ssD32 = getLongLesson('soft-skills', 32);
  assert.ok(ssD32, 'soft-skills Day 32 long lesson must resolve');
  assert.equal(ssD32.day, 32);
  assert.equal(ssD32.parts.length, 5, 'soft-skills Day 32 must contain exactly 5 parts');
  assert.ok(ssD32.summary.length >= 4, 'soft-skills Day 32 must contain comprehensive summary');
  assert.ok(ssD32.projectStep, 'soft-skills Day 32 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD32);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD32.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 32: Domain-Specific Content Assertions', () => {
  const ssD32 = getLongLesson('soft-skills', 32);
  assert.ok(ssD32);

  assert.ok(ssD32.parts[0].output.includes('VISUAL SYSTEMS TOPOLOGY EVALUATION'));
  assert.ok(ssD32.parts[1].output.includes('RIDE-SHARING DISPATCH ARCHITECTURE AUDIT'));
  assert.ok(ssD32.parts[1].output.includes('UBER_H3_HEXAGONAL_INDEX_LEVEL_8'));
  assert.ok(ssD32.parts[2].output.includes('ARCHITECTURE CANVAS EXPORTER EVALUATION'));
  assert.ok(ssD32.parts[3].output.includes('LIVE WHITEBOARD DRIVING LAB EVALUATION'));
  assert.ok(ssD32.parts[4].output.includes('DAY 32 WHITEBOARD MASTERY CERTIFICATION'));
  assert.ok(ssD32.parts[4].output.includes('DAY_32_WHITEBOARD_DRIVING_100_PCT_VERIFIED'));
});

test('Soft Skills Day 33: Resolution & Structural Invariants for Communicating Trade-Offs Under Pressure', () => {
  const ssD33 = getLongLesson('soft-skills', 33);
  assert.ok(ssD33, 'soft-skills Day 33 long lesson must resolve');
  assert.equal(ssD33.day, 33);
  assert.equal(ssD33.parts.length, 5, 'soft-skills Day 33 must contain exactly 5 parts');
  assert.ok(ssD33.summary.length >= 4, 'soft-skills Day 33 must contain comprehensive summary');
  assert.ok(ssD33.projectStep, 'soft-skills Day 33 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD33);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD33.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 33: Domain-Specific Content Assertions', () => {
  const ssD33 = getLongLesson('soft-skills', 33);
  assert.ok(ssD33);

  assert.ok(ssD33.parts[0].output.includes('MULTI-DIMENSIONAL TRADE-OFF MATRIX EVALUATION'));
  assert.ok(ssD33.parts[0].output.includes('PACELC_TRADE_OFF_RIGOR_VERIFIED'));
  assert.ok(ssD33.parts[1].output.includes('ARCHITECTURAL TRADE-OFF DISSECTION AUDIT'));
  assert.ok(ssD33.parts[2].output.includes('AUTOMATED TRADE-OFF RADAR EVALUATION'));
  assert.ok(ssD33.parts[3].output.includes('TRADE-OFF CROSS-EXAMINATION LAB EVALUATION'));
  assert.ok(ssD33.parts[4].output.includes('DAY 33 TRADE-OFF MASTERY CERTIFICATION'));
  assert.ok(ssD33.parts[4].output.includes('DAY_33_TRADE_OFFS_100_PCT_VERIFIED'));
});

test('Soft Skills Day 34: Resolution & Structural Invariants for Handling Pushback & Curveballs', () => {
  const ssD34 = getLongLesson('soft-skills', 34);
  assert.ok(ssD34, 'soft-skills Day 34 long lesson must resolve');
  assert.equal(ssD34.day, 34);
  assert.equal(ssD34.parts.length, 5, 'soft-skills Day 34 must contain exactly 5 parts');
  assert.ok(ssD34.summary.length >= 4, 'soft-skills Day 34 must contain comprehensive summary');
  assert.ok(ssD34.projectStep, 'soft-skills Day 34 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD34);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD34.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 34: Domain-Specific Content Assertions', () => {
  const ssD34 = getLongLesson('soft-skills', 34);
  assert.ok(ssD34);

  assert.ok(ssD34.parts[0].output.includes('EVALUATOR STRESS-TESTING PSYCHOLOGY EVALUATION'));
  assert.ok(ssD34.parts[1].output.includes('CURVEBALL TAXONOMY & PLAYBOOK AUDIT'));
  assert.ok(ssD34.parts[2].output.includes('CURVEBALL SIMULATOR EVALUATION'));
  assert.ok(ssD34.parts[2].output.includes('CURVEBALL_GENERATOR_SIMULATION_PASSED'));
  assert.ok(ssD34.parts[3].output.includes('HIGH-STRESS CURVEBALL GAUNTLET LAB EVALUATION'));
  assert.ok(ssD34.parts[4].output.includes('DAY 34 CURVEBALL MASTERY CERTIFICATION'));
  assert.ok(ssD34.parts[4].output.includes('DAY_34_CURVEBALLS_100_PCT_VERIFIED'));
});

test('Soft Skills Day 35: Resolution & Structural Invariants for Milestone 4 (M2) ApexDesign System Design Suite', () => {
  const ssD35 = getLongLesson('soft-skills', 35);
  assert.ok(ssD35, 'soft-skills Day 35 long lesson must resolve');
  assert.equal(ssD35.day, 35);
  assert.equal(ssD35.parts.length, 5, 'soft-skills Day 35 must contain exactly 5 parts');
  assert.ok(ssD35.summary.length >= 4, 'soft-skills Day 35 must contain comprehensive summary');
  assert.ok(ssD35.projectStep, 'soft-skills Day 35 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD35);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD35.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 35: Domain-Specific Content Assertions', () => {
  const ssD35 = getLongLesson('soft-skills', 35);
  assert.ok(ssD35);

  assert.ok(ssD35.parts[0].output.includes('PLANETARY SCALE SYSTEM DESIGN RUBRIC EVALUATION'));
  assert.ok(ssD35.parts[1].output.includes('APEXDESIGN ARCHITECTURE DOSSIER AUDIT'));
  assert.ok(ssD35.parts[2].output.includes('APEXDESIGN INTERACTIVE WHITEBOARD EVALUATION'));
  assert.ok(ssD35.parts[3].output.includes('APEXDESIGN BAR RAISER DEFENSE LAB EVALUATION'));
  assert.ok(ssD35.parts[4].output.includes('MILESTONE 4 APEXDESIGN CAPSTONE CERTIFICATION'));
  assert.ok(ssD35.parts[4].output.includes('MILESTONE_4_APEXDESIGN_SUITE_100_PCT_VERIFIED'));
});

test('Soft Skills Day 36: Resolution & Structural Invariants for Live Coding Communication', () => {
  const ssD36 = getLongLesson('soft-skills', 36);
  assert.ok(ssD36, 'soft-skills Day 36 long lesson must resolve');
  assert.equal(ssD36.day, 36);
  assert.equal(ssD36.parts.length, 5, 'soft-skills Day 36 must contain exactly 5 parts');
  assert.ok(ssD36.summary.length >= 4, 'soft-skills Day 36 must contain comprehensive summary');
  assert.ok(ssD36.projectStep, 'soft-skills Day 36 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD36);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD36.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 36: Domain-Specific Content Assertions', () => {
  const ssD36 = getLongLesson('soft-skills', 36);
  assert.ok(ssD36);

  assert.ok(ssD36.parts[0].output.includes('COGNITIVE LOAD DUAL-TASK EXECUTION EVALUATION'));
  assert.ok(ssD36.parts[1].output.includes('BABBLY NOISE FILTER EVALUATION'));
  assert.ok(ssD36.parts[2].output.includes('TEST-DRIVEN VERBALIZATION EVALUATION'));
  assert.ok(ssD36.parts[3].output.includes('HIGH-PRESSURE LIVE CODING VERBALIZATION LAB'));
  assert.ok(ssD36.parts[4].output.includes('DAY 36 LIVE CODING MASTERY CERTIFICATION'));
  assert.ok(ssD36.parts[4].output.includes('DAY_36_LIVE_CODING_COMMUNICATION_100_PCT_VERIFIED'));
});

test('Soft Skills Day 37: Resolution & Structural Invariants for Scientific Debugging Under Pressure', () => {
  const ssD37 = getLongLesson('soft-skills', 37);
  assert.ok(ssD37, 'soft-skills Day 37 long lesson must resolve');
  assert.equal(ssD37.day, 37);
  assert.equal(ssD37.parts.length, 5, 'soft-skills Day 37 must contain exactly 5 parts');
  assert.ok(ssD37.summary.length >= 4, 'soft-skills Day 37 must contain comprehensive summary');
  assert.ok(ssD37.projectStep, 'soft-skills Day 37 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD37);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD37.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 37: Domain-Specific Content Assertions', () => {
  const ssD37 = getLongLesson('soft-skills', 37);
  assert.ok(ssD37);

  assert.ok(ssD37.parts[0].output.includes('SCIENTIFIC METHOD IN SOFTWARE DIAGNOSTICS'));
  assert.ok(ssD37.parts[1].output.includes('DRY-RUN TRACE TABLE MATRIX'));
  assert.ok(ssD37.parts[2].output.includes('DEBUGGING VERBALIZATION EVALUATION'));
  assert.ok(ssD37.parts[3].output.includes('4-MINUTE CLOCK PANIC DEBUGGING LAB'));
  assert.ok(ssD37.parts[4].output.includes('DAY 37 SCIENTIFIC DEBUGGING MASTERY CERTIFICATION'));
  assert.ok(ssD37.parts[4].output.includes('DAY_37_SCIENTIFIC_DEBUGGING_100_PCT_VERIFIED'));
});

test('Soft Skills Day 38: Resolution & Structural Invariants for Staff Engineer Archetypes', () => {
  const ssD38 = getLongLesson('soft-skills', 38);
  assert.ok(ssD38, 'soft-skills Day 38 long lesson must resolve');
  assert.equal(ssD38.day, 38);
  assert.equal(ssD38.parts.length, 5, 'soft-skills Day 38 must contain exactly 5 parts');
  assert.ok(ssD38.summary.length >= 4, 'soft-skills Day 38 must contain comprehensive summary');
  assert.ok(ssD38.projectStep, 'soft-skills Day 38 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD38);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD38.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 38: Domain-Specific Content Assertions', () => {
  const ssD38 = getLongLesson('soft-skills', 38);
  assert.ok(ssD38);

  assert.ok(ssD38.parts[0].output.includes('WILL LARSON STAFF ARCHETYPE TAXONOMY EVALUATION'));
  assert.ok(ssD38.parts[1].output.includes('STAFF ARCHETYPE DIAGNOSTIC MATRIX AUDIT'));
  assert.ok(ssD38.parts[2].output.includes('STAFF OPERATING RHYTHM BLUEPRINT'));
  assert.ok(ssD38.parts[3].output.includes('MULTI-ARCHETYPE EXECUTIVE SIMULATION LAB'));
  assert.ok(ssD38.parts[4].output.includes('DAY 38 STAFF ARCHETYPE MASTERY CERTIFICATION'));
  assert.ok(ssD38.parts[4].output.includes('DAY_38_STAFF_ARCHETYPES_100_PCT_VERIFIED'));
});

test('Soft Skills Day 39: Resolution & Structural Invariants for Grassroots Coalitions & Bottom-Up Adoption', () => {
  const ssD39 = getLongLesson('soft-skills', 39);
  assert.ok(ssD39, 'soft-skills Day 39 long lesson must resolve');
  assert.equal(ssD39.day, 39);
  assert.equal(ssD39.parts.length, 5, 'soft-skills Day 39 must contain exactly 5 parts');
  assert.ok(ssD39.summary.length >= 4, 'soft-skills Day 39 must contain comprehensive summary');
  assert.ok(ssD39.projectStep, 'soft-skills Day 39 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD39);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD39.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 39: Domain-Specific Content Assertions', () => {
  const ssD39 = getLongLesson('soft-skills', 39);
  assert.ok(ssD39);

  assert.ok(ssD39.parts[0].output.includes('ROGERS DIFFUSION OF INNOVATIONS IN SOFTWARE ORGS'));
  assert.ok(ssD39.parts[1].output.includes('THE LIGHTHOUSE TEAM PLAYBOOK (30-60-90 DAYS)'));
  assert.ok(ssD39.parts[2].output.includes('GRASSROOTS ADOPTION TELEMETRY EVALUATION'));
  assert.ok(ssD39.parts[3].output.includes('HOSTILE SKEPTIC SQUAD CONVERSION LAB'));
  assert.ok(ssD39.parts[4].output.includes('DAY 39 GRASSROOTS COALITION MASTERY CERTIFICATION'));
  assert.ok(ssD39.parts[4].output.includes('DAY_39_GRASSROOTS_COALITIONS_100_PCT_VERIFIED'));
});

test('Soft Skills Day 40: Resolution & Structural Invariants for Milestone 5 ApexInfluence Strategy Suite', () => {
  const ssD40 = getLongLesson('soft-skills', 40);
  assert.ok(ssD40, 'soft-skills Day 40 long lesson must resolve');
  assert.equal(ssD40.day, 40);
  assert.equal(ssD40.parts.length, 5, 'soft-skills Day 40 must contain exactly 5 parts');
  assert.ok(ssD40.summary.length >= 4, 'soft-skills Day 40 must contain comprehensive summary');
  assert.ok(ssD40.projectStep, 'soft-skills Day 40 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD40);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD40.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 40: Domain-Specific Content Assertions', () => {
  const ssD40 = getLongLesson('soft-skills', 40);
  assert.ok(ssD40);

  assert.ok(ssD40.parts[0].output.includes('THE POLITICAL ECONOMY OF SOFTWARE ENGINEERING'));
  assert.ok(ssD40.parts[1].output.includes('APEXINFLUENCE MASTER CAMPAIGN BLUEPRINT'));
  assert.ok(ssD40.parts[2].output.includes('APEXINFLUENCE CAMPAIGN HEALTH TELEMETRY'));
  assert.ok(ssD40.parts[3].output.includes('PUBLIC ENGINEERING REVOLT MEDIATION LAB'));
  assert.ok(ssD40.parts[4].output.includes('MILESTONE 5 APEXINFLUENCE CAPSTONE CERTIFICATION'));
  assert.ok(ssD40.parts[4].output.includes('MILESTONE_5_APEXINFLUENCE_SUITE_100_PCT_VERIFIED'));
});

test('Soft Skills Day 41: Resolution & Structural Invariants for Managing Executive Stakeholders & ROI', () => {
  const ssD41 = getLongLesson('soft-skills', 41);
  assert.ok(ssD41, 'soft-skills Day 41 long lesson must resolve');
  assert.equal(ssD41.day, 41);
  assert.equal(ssD41.parts.length, 5, 'soft-skills Day 41 must contain exactly 5 parts');
  assert.ok(ssD41.summary.length >= 4, 'soft-skills Day 41 must contain comprehensive summary');
  assert.ok(ssD41.projectStep, 'soft-skills Day 41 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD41);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD41.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 41: Domain-Specific Content Assertions', () => {
  const ssD41 = getLongLesson('soft-skills', 41);
  assert.ok(ssD41);

  assert.ok(ssD41.parts[0].output.includes('AMAZON 6-PAGE NARRATIVE MEMO EVALUATION'));
  assert.ok(ssD41.parts[0].output.includes('narrative memos persuade through rigorous logic'));
  assert.ok(ssD41.parts[1].output.includes('EXECUTIVE RISK HEAT MAP BLUEPRINT AUDIT'));
  assert.ok(ssD41.parts[1].output.includes('ENGINEERING_TECH_DEBT_TRANSLATED_INTO_BALANCE_SHEET_LIABILITY'));
  assert.ok(ssD41.parts[2].output.includes('EXECUTIVE MEMO MARKDOWN LINTER EVALUATION'));
  assert.ok(ssD41.parts[2].output.includes('CONCISE_ACTIVE_VOICE_DRIVES_EXECUTIVE_ACTION'));
  assert.ok(ssD41.parts[3].output.includes('LIVE 5-MINUTE CEO PITCH SIMULATION LAB EVALUATION'));
  assert.ok(ssD41.parts[3].output.includes('SPEAK_IN_REVENUE_EFFICIENCY_AND_ENTERPRISE_RISK'));
  assert.ok(ssD41.parts[4].output.includes('MASTER C-SUITE BRIEFING & RISK GOVERNANCE EVALUATION'));
  assert.ok(ssD41.parts[4].output.includes('DAY_41_EXECUTIVE_STAKEHOLDERS_100_PCT_VERIFIED'));
});

test('Soft Skills Day 42: Resolution & Structural Invariants for Engineering Strategy Documents & North Star', () => {
  const ssD42 = getLongLesson('soft-skills', 42);
  assert.ok(ssD42, 'soft-skills Day 42 long lesson must resolve');
  assert.equal(ssD42.day, 42);
  assert.equal(ssD42.parts.length, 5, 'soft-skills Day 42 must contain exactly 5 parts');
  assert.ok(ssD42.summary.length >= 4, 'soft-skills Day 42 must contain comprehensive summary');
  assert.ok(ssD42.projectStep, 'soft-skills Day 42 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD42);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD42.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 42: Domain-Specific Content Assertions', () => {
  const ssD42 = getLongLesson('soft-skills', 42);
  assert.ok(ssD42);

  assert.ok(ssD42.parts[0].output.includes('RICHARD RUMELT STRATEGY KERNEL EVALUATION'));
  assert.ok(ssD42.parts[0].output.includes('STRATEGY_IS_ABOUT_FOCUS_AND_DECIDING_WHAT_NOT_TO_DO'));
  assert.ok(ssD42.parts[1].output.includes('THE NORTH STAR EVOLUTIONARY BLUEPRINT AUDIT'));
  assert.ok(ssD42.parts[1].output.includes('A North Star without intermediate milestones is a daydream'));
  assert.ok(ssD42.parts[2].output.includes('TECHNICAL STRATEGY ROADMAP DEPENDENCY GRAPHER'));
  assert.ok(ssD42.parts[2].output.includes('DEPENDENCY_AWARE_ARCHITECTURE_PREVENTS_BLOCKERS'));
  assert.ok(ssD42.parts[3].output.includes('ADVERSARIAL ARCHITECTURE STRATEGY DEFENSE LAB'));
  assert.ok(ssD42.parts[3].output.includes('DEFEND_STRATEGY_WITH_INCREMENTAL_VALUE_NOT_THEORETICAL_PERFECTION'));
  assert.ok(ssD42.parts[4].output.includes('MASTER TECHNICAL STRATEGY & NORTH STAR ALIGNMENT EVALUATION'));
  assert.ok(ssD42.parts[4].output.includes('DAY_42_STRATEGY_DOCUMENTS_100_PCT_VERIFIED'));
});

test('Soft Skills Day 43: Resolution & Structural Invariants for Culture & Technical Mentorship Ladders', () => {
  const ssD43 = getLongLesson('soft-skills', 43);
  assert.ok(ssD43, 'soft-skills Day 43 long lesson must resolve');
  assert.equal(ssD43.day, 43);
  assert.equal(ssD43.parts.length, 5, 'soft-skills Day 43 must contain exactly 5 parts');
  assert.ok(ssD43.summary.length >= 4, 'soft-skills Day 43 must contain comprehensive summary');
  assert.ok(ssD43.projectStep, 'soft-skills Day 43 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD43);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD43.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 43: Domain-Specific Content Assertions', () => {
  const ssD43 = getLongLesson('soft-skills', 43);
  assert.ok(ssD43);

  assert.ok(ssD43.parts[0].output.includes('SOCIOLOGY OF SPONSORSHIP VS MENTORSHIP EVALUATION'));
  assert.ok(ssD43.parts[0].output.includes('MENTORSHIP_GIVES_ADVICE_SPONSORSHIP_GIVES_OPPORTUNITY'));
  assert.ok(ssD43.parts[1].output.includes('ENGINEERING CAREER LADDER BLUEPRINT AUDIT'));
  assert.ok(ssD43.parts[1].output.includes('ELIMINATE_PROMOTION_FAVORITISM_THROUGH_RADICAL_CLARITY'));
  assert.ok(ssD43.parts[2].output.includes('MENTORSHIP & GROWTH MILESTONES TRACKER'));
  assert.ok(ssD43.parts[2].output.includes('STRUCTURED_GOALS_ACCELERATE_ENGINEERING_MATURITY'));
  assert.ok(ssD43.parts[3].output.includes('UNDERPERFORMING SENIOR ENGINEER COACHING LAB'));
  assert.ok(ssD43.parts[3].output.includes('COACH_WITH_EMPATHY_RESTORING_HIGH_AGENCY_BEATS_PUNISHMENT'));
  assert.ok(ssD43.parts[4].output.includes('MASTER CULTURE, SPONSORSHIP & CAREER LADDER EVALUATION'));
  assert.ok(ssD43.parts[4].output.includes('DAY_43_CULTURE_AND_MENTORSHIP_100_PCT_VERIFIED'));
});

test('Soft Skills Day 44: Resolution & Structural Invariants for Reorganizations & Strategy Pivots', () => {
  const ssD44 = getLongLesson('soft-skills', 44);
  assert.ok(ssD44, 'soft-skills Day 44 long lesson must resolve');
  assert.equal(ssD44.day, 44);
  assert.equal(ssD44.parts.length, 5, 'soft-skills Day 44 must contain exactly 5 parts');
  assert.ok(ssD44.summary.length >= 4, 'soft-skills Day 44 must contain comprehensive summary');
  assert.ok(ssD44.projectStep, 'soft-skills Day 44 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD44);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD44.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 44: Domain-Specific Content Assertions', () => {
  const ssD44 = getLongLesson('soft-skills', 44);
  assert.ok(ssD44);

  assert.ok(ssD44.parts[0].output.includes('CHANGE MANAGEMENT & EMOTIONAL CYCLE EVALUATION'));
  assert.ok(ssD44.parts[0].output.includes('ORGANIZATIONAL_SHOCK_ABSORBER_DISCIPLINE_VERIFIED'));
  assert.ok(ssD44.parts[1].output.includes('STRATEGIC REORIENTATION ADDRESS AUDIT'));
  assert.ok(ssD44.parts[1].output.includes('LEADERS_ABSORB_CHAOS_AND_TRANSMIT_CALM_CLARITY'));
  assert.ok(ssD44.parts[2].output.includes('ASSET SALVAGE & TRANSITION AUDIT CLI'));
  assert.ok(ssD44.parts[2].output.includes('CODE_CAN_BE_DEPRECATED_BUT_ENGINEERING_CAPITAL_NEVER_DIES'));
  assert.ok(ssD44.parts[3].output.includes('EMERGENCY TEAM MUTINY DE-ESCALATION LAB'));
  assert.ok(ssD44.parts[3].output.includes('IN_TIMES_OF_CHURN_THE_STAFF_ENGINEER_IS_THE_ANCHOR_OF_THE_TEAM'));
  assert.ok(ssD44.parts[4].output.includes('MASTER ORGANIZATIONAL RESILIENCE & TRANSITION EVALUATION'));
  assert.ok(ssD44.parts[4].output.includes('DAY_44_REORGS_AND_PIVOTS_100_PCT_VERIFIED'));
});

test('Soft Skills Day 45: Resolution & Structural Invariants for Milestone 6 (M2) ApexStrategy Strategy Suite', () => {
  const ssD45 = getLongLesson('soft-skills', 45);
  assert.ok(ssD45, 'soft-skills Day 45 long lesson must resolve');
  assert.equal(ssD45.day, 45);
  assert.equal(ssD45.parts.length, 5, 'soft-skills Day 45 must contain exactly 5 parts');
  assert.ok(ssD45.summary.length >= 4, 'soft-skills Day 45 must contain comprehensive summary');
  assert.ok(ssD45.projectStep, 'soft-skills Day 45 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD45);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD45.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 45: Domain-Specific Content Assertions', () => {
  const ssD45 = getLongLesson('soft-skills', 45);
  assert.ok(ssD45);

  assert.ok(ssD45.parts[0].output.includes('STRATEGIC ENTERPRISE ARCHITECTURE VALUATION'));
  assert.ok(ssD45.parts[0].output.includes('STRATEGIC_ENTERPRISE_ARCHITECTURE_VALUATION_RATIFIED'));
  assert.ok(ssD45.parts[1].output.includes('APEXSTRATEGY 3-YEAR MASTER BLUEPRINT AUDIT'));
  assert.ok(ssD45.parts[1].output.includes('SELF_FUNDING_ARCHITECTURE_WINS_BOARD_OF_DIRECTORS_APPROVAL'));
  assert.ok(ssD45.parts[2].output.includes('APEXSTRATEGY EXECUTIVE DECISION SUPPORT TOOL'));
  assert.ok(ssD45.parts[2].output.includes('QUANTIFIABLE_METRICS_ALIGNED_WITH_MULTI_YEAR_SHAREHOLDER_VALUE'));
  assert.ok(ssD45.parts[3].output.includes('BOARD OF DIRECTORS STRATEGY VIVA VOCE EXAMINATION'));
  assert.ok(ssD45.parts[3].output.includes('APEXSTRATEGY_RATIFIED_WITH_HIGHEST_HONORS'));
  assert.ok(ssD45.parts[4].output.includes('MILESTONE 6 APEXSTRATEGY CAPSTONE CERTIFICATION'));
  assert.ok(ssD45.parts[4].output.includes('MILESTONE_6_APEXSTRATEGY_SUITE_100_PCT_VERIFIED'));
});

test('Soft Skills Day 46: Resolution & Structural Invariants for Tech Offer Evaluation & Equity Anatomy', () => {
  const ssD46 = getLongLesson('soft-skills', 46);
  assert.ok(ssD46, 'soft-skills Day 46 long lesson must resolve');
  assert.equal(ssD46.day, 46);
  assert.equal(ssD46.parts.length, 5, 'soft-skills Day 46 must contain exactly 5 parts');
  assert.ok(ssD46.summary.length >= 4, 'soft-skills Day 46 must contain comprehensive summary');
  assert.ok(ssD46.projectStep, 'soft-skills Day 46 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD46);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD46.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 46: Domain-Specific Content Assertions', () => {
  const ssD46 = getLongLesson('soft-skills', 46);
  assert.ok(ssD46);

  assert.ok(ssD46.parts[0].output.includes('TECH OFFER TOTAL COMPENSATION EVALUATION'));
  assert.ok(ssD46.parts[1].output.includes('4-YEAR TOTAL COMPENSATION LIFECYCLE MODEL'));
  assert.ok(ssD46.parts[2].output.includes('TECH EQUITY DILUTION & LIQUIDATION SIMULATION'));
  assert.ok(ssD46.parts[3].output.includes('COMPLEX OFFER CONTRACT & PREDATORY CLAUSE AUDIT'));
  assert.ok(ssD46.parts[4].output.includes('DAY 46 TECH OFFER EVALUATION CERTIFICATION'));
  assert.ok(ssD46.parts[4].output.includes('DAY_46_TECH_OFFER_EVALUATION_100_PCT_VERIFIED'));
});

test('Soft Skills Day 47: Resolution & Structural Invariants for Compensation Negotiation Playbook', () => {
  const ssD47 = getLongLesson('soft-skills', 47);
  assert.ok(ssD47, 'soft-skills Day 47 long lesson must resolve');
  assert.equal(ssD47.day, 47);
  assert.equal(ssD47.parts.length, 5, 'soft-skills Day 47 must contain exactly 5 parts');
  assert.ok(ssD47.summary.length >= 4, 'soft-skills Day 47 must contain comprehensive summary');
  assert.ok(ssD47.projectStep, 'soft-skills Day 47 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD47);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD47.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 47: Domain-Specific Content Assertions', () => {
  const ssD47 = getLongLesson('soft-skills', 47);
  assert.ok(ssD47);

  assert.ok(ssD47.parts[0].output.includes('COMPENSATION NEGOTIATION PLAYBOOK EVALUATION'));
  assert.ok(ssD47.parts[1].output.includes('3-WAY BIDDING WAR EMAIL SEQUENCE BLUEPRINT'));
  assert.ok(ssD47.parts[2].output.includes('COUNTER-OFFER GENERATOR CLI'));
  assert.ok(ssD47.parts[3].output.includes('LIVE RECRUITER HARDBALL LAB'));
  assert.ok(ssD47.parts[4].output.includes('DAY 47 COMPENSATION NEGOTIATION MASTERY CERTIFICATION'));
  assert.ok(ssD47.parts[4].output.includes('DAY_47_NEGOTIATION_PLAYBOOK_100_PCT_VERIFIED'));
});

test('Soft Skills Day 48: Resolution & Structural Invariants for Difficult Conversations & Performance', () => {
  const ssD48 = getLongLesson('soft-skills', 48);
  assert.ok(ssD48, 'soft-skills Day 48 long lesson must resolve');
  assert.equal(ssD48.day, 48);
  assert.equal(ssD48.parts.length, 5, 'soft-skills Day 48 must contain exactly 5 parts');
  assert.ok(ssD48.summary.length >= 4, 'soft-skills Day 48 must contain comprehensive summary');
  assert.ok(ssD48.projectStep, 'soft-skills Day 48 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD48);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD48.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 48: Domain-Specific Content Assertions', () => {
  const ssD48 = getLongLesson('soft-skills', 48);
  assert.ok(ssD48);

  assert.ok(ssD48.parts[0].output.includes('RADICAL CANDOR MATRIX EVALUATION'));
  assert.ok(ssD48.parts[1].output.includes('OBJECTIVE PERFORMANCE DOCUMENTATION DOSSIER'));
  assert.ok(ssD48.parts[2].output.includes('DIFFICULT CONVERSATION SBI SCRIPTING ENGINE'));
  assert.ok(ssD48.parts[3].output.includes('HIGH-EMOTION PERFORMANCE REVIEW LAB'));
  assert.ok(ssD48.parts[4].output.includes('DAY 48 DIFFICULT CONVERSATIONS CERTIFICATION'));
  assert.ok(ssD48.parts[4].output.includes('DAY_48_DIFFICULT_CONVERSATIONS_100_PCT_VERIFIED'));
});

test('Soft Skills Day 49: Resolution & Structural Invariants for Delivering Bad News to Leadership', () => {
  const ssD49 = getLongLesson('soft-skills', 49);
  assert.ok(ssD49, 'soft-skills Day 49 long lesson must resolve');
  assert.equal(ssD49.day, 49);
  assert.equal(ssD49.parts.length, 5, 'soft-skills Day 49 must contain exactly 5 parts');
  assert.ok(ssD49.summary.length >= 4, 'soft-skills Day 49 must contain comprehensive summary');
  assert.ok(ssD49.projectStep, 'soft-skills Day 49 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD49);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD49.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 49: Domain-Specific Content Assertions', () => {
  const ssD49 = getLongLesson('soft-skills', 49);
  assert.ok(ssD49);

  assert.ok(ssD49.parts[0].output.includes('EPISTEMOLOGY OF BAD NEWS DELIVERY EVALUATION'));
  assert.ok(ssD49.parts[1].output.includes('EXECUTIVE CRISIS ESCALATION MEMO BLUEPRINT'));
  assert.ok(ssD49.parts[2].output.includes('PROJECT HEALTH RISK SENTINEL REPORT'));
  assert.ok(ssD49.parts[3].output.includes('HOSTILE EXECUTIVE BAD NEWS DELIVERY LAB'));
  assert.ok(ssD49.parts[4].output.includes('DAY 49 BAD NEWS DELIVERY CERTIFICATION'));
  assert.ok(ssD49.parts[4].output.includes('DAY_49_BAD_NEWS_DELIVERY_100_PCT_VERIFIED'));
});

test('Soft Skills Day 50: Resolution & Structural Invariants for Milestone 7 ApexNegotiation Suite', () => {
  const ssD50 = getLongLesson('soft-skills', 50);
  assert.ok(ssD50, 'soft-skills Day 50 long lesson must resolve');
  assert.equal(ssD50.day, 50);
  assert.equal(ssD50.parts.length, 5, 'soft-skills Day 50 must contain exactly 5 parts');
  assert.ok(ssD50.summary.length >= 4, 'soft-skills Day 50 must contain comprehensive summary');
  assert.ok(ssD50.projectStep, 'soft-skills Day 50 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD50);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD50.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 50: Domain-Specific Content Assertions', () => {
  const ssD50 = getLongLesson('soft-skills', 50);
  assert.ok(ssD50);

  assert.ok(ssD50.parts[0].output.includes('GAME THEORY IN EXECUTIVE COMPENSATION'));
  assert.ok(ssD50.parts[1].output.includes('APEXNEGOTIATION MASTER DOSSIER'));
  assert.ok(ssD50.parts[2].output.includes('APEXNEGOTIATION AUTOMATED COUNTER-OFFER SIMULATOR'));
  assert.ok(ssD50.parts[3].output.includes('LIVE RECRUITER & EXECUTIVE GAUNTLET LAB'));
  assert.ok(ssD50.parts[4].output.includes('MILESTONE 7 APEXNEGOTIATION CAPSTONE CERTIFICATION'));
  assert.ok(ssD50.parts[4].output.includes('MILESTONE_7_APEXNEGOTIATION_SUITE_100_PCT_VERIFIED'));
});

test('Soft Skills Day 51: Resolution & Structural Invariants for Public Speaking & Tech Conferences', () => {
  const ssD51 = getLongLesson('soft-skills', 51);
  assert.ok(ssD51, 'soft-skills Day 51 long lesson must resolve');
  assert.equal(ssD51.day, 51);
  assert.equal(ssD51.parts.length, 5, 'soft-skills Day 51 must contain exactly 5 parts');
  assert.ok(ssD51.summary.length >= 4, 'soft-skills Day 51 must contain comprehensive summary');
  assert.ok(ssD51.projectStep, 'soft-skills Day 51 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD51);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD51.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 51: Domain-Specific Content Assertions', () => {
  const ssD51 = getLongLesson('soft-skills', 51);
  assert.ok(ssD51);

  assert.ok(ssD51.parts[0].output.includes('TECH CONFERENCE CFP EVALUATION'));
  assert.ok(ssD51.parts[0].output.includes('TECH_CONFERENCE_CFP_ENGINE_100_PCT_VERIFIED'));
  assert.ok(ssD51.parts[1].output.includes('MAGNETIC CFP SUBMISSION BLUEPRINT'));
  assert.ok(ssD51.parts[1].output.includes('CFP_SUBMISSION_BLUEPRINT_100_PCT_VERIFIED'));
  assert.ok(ssD51.parts[2].output.includes('CONFERENCE LIVE DEMO RISK AUDIT'));
  assert.ok(ssD51.parts[2].output.includes('DEMO_RISK_MITIGATION_100_PCT_VERIFIED'));
  assert.ok(ssD51.parts[3].output.includes('LIVE TECHNICAL KEYNOTE INCIDENT LAB'));
  assert.ok(ssD51.parts[3].output.includes('KEYNOTE_INCIDENT_LAB_100_PCT_VERIFIED'));
  assert.ok(ssD51.parts[4].output.includes('DAY 51 PUBLIC SPEAKING CERTIFICATION'));
  assert.ok(ssD51.parts[4].output.includes('DAY_51_PUBLIC_SPEAKING_100_PCT_VERIFIED'));
});

test('Soft Skills Day 52: Resolution & Structural Invariants for Technical Writing & Engineering Blogs', () => {
  const ssD52 = getLongLesson('soft-skills', 52);
  assert.ok(ssD52, 'soft-skills Day 52 long lesson must resolve');
  assert.equal(ssD52.day, 52);
  assert.equal(ssD52.parts.length, 5, 'soft-skills Day 52 must contain exactly 5 parts');
  assert.ok(ssD52.summary.length >= 4, 'soft-skills Day 52 must contain comprehensive summary');
  assert.ok(ssD52.projectStep, 'soft-skills Day 52 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD52);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD52.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 52: Domain-Specific Content Assertions', () => {
  const ssD52 = getLongLesson('soft-skills', 52);
  assert.ok(ssD52);

  assert.ok(ssD52.parts[0].output.includes('HACKER NEWS TECHNICAL VIRALITY AUDIT'));
  assert.ok(ssD52.parts[0].output.includes('HACKER_NEWS_VIRALITY_ENGINE_100_PCT_VERIFIED'));
  assert.ok(ssD52.parts[1].output.includes('FRONT-PAGE ENGINEERING BLOG BLUEPRINT'));
  assert.ok(ssD52.parts[1].output.includes('ENGINEERING_BLOG_BLUEPRINT_100_PCT_VERIFIED'));
  assert.ok(ssD52.parts[2].output.includes('TECHNICAL PUBLICATION MARKDOWN ENGINE'));
  assert.ok(ssD52.parts[2].output.includes('PUBLICATION_MARKDOWN_ENGINE_100_PCT_VERIFIED'));
  assert.ok(ssD52.parts[3].output.includes('HACKER NEWS COMMENT SECTION DEFENSE LAB'));
  assert.ok(ssD52.parts[3].output.includes('HACKER_NEWS_DEFENSE_LAB_100_PCT_VERIFIED'));
  assert.ok(ssD52.parts[4].output.includes('DAY 52 TECHNICAL WRITING CERTIFICATION'));
  assert.ok(ssD52.parts[4].output.includes('DAY_52_TECHNICAL_WRITING_100_PCT_VERIFIED'));
});

test('Soft Skills Day 53: Resolution & Structural Invariants for Remote & Distributed Team Communication', () => {
  const ssD53 = getLongLesson('soft-skills', 53);
  assert.ok(ssD53, 'soft-skills Day 53 long lesson must resolve');
  assert.equal(ssD53.day, 53);
  assert.equal(ssD53.parts.length, 5, 'soft-skills Day 53 must contain exactly 5 parts');
  assert.ok(ssD53.summary.length >= 4, 'soft-skills Day 53 must contain comprehensive summary');
  assert.ok(ssD53.projectStep, 'soft-skills Day 53 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD53);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD53.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 53: Domain-Specific Content Assertions', () => {
  const ssD53 = getLongLesson('soft-skills', 53);
  assert.ok(ssD53);

  assert.ok(ssD53.parts[0].output.includes('GITLAB HANDBOOK & ASYNC SOVEREIGNTY AUDIT'));
  assert.ok(ssD53.parts[0].output.includes('REMOTE_CULTURE_AUDIT_ENGINE_100_PCT_VERIFIED'));
  assert.ok(ssD53.parts[1].output.includes('120-SECOND ASYNC VIDEO WALKTHROUGH BLUEPRINT'));
  assert.ok(ssD53.parts[1].output.includes('ASYNC_VIDEO_WALKTHROUGH_100_PCT_VERIFIED'));
  assert.ok(ssD53.parts[2].output.includes('GLOBAL ASYNC COLLABORATION SCHEDULER'));
  assert.ok(ssD53.parts[2].output.includes('GLOBAL_ASYNC_SCHEDULER_100_PCT_VERIFIED'));
  assert.ok(ssD53.parts[3].output.includes('GLOBAL TIME ZONE CRISIS RESOLUTION LAB'));
  assert.ok(ssD53.parts[3].output.includes('GLOBAL_CRISIS_LAB_100_PCT_VERIFIED'));
  assert.ok(ssD53.parts[4].output.includes('DAY 53 REMOTE ASYNC SOVEREIGNTY CERTIFICATION'));
  assert.ok(ssD53.parts[4].output.includes('DAY_53_REMOTE_SOVEREIGNTY_100_PCT_VERIFIED'));
});

test('Soft Skills Day 54: Resolution & Structural Invariants for The Staff+ Interview Gauntlet', () => {
  const ssD54 = getLongLesson('soft-skills', 54);
  assert.ok(ssD54, 'soft-skills Day 54 long lesson must resolve');
  assert.equal(ssD54.day, 54);
  assert.equal(ssD54.parts.length, 5, 'soft-skills Day 54 must contain exactly 5 parts');
  assert.ok(ssD54.summary.length >= 4, 'soft-skills Day 54 must contain comprehensive summary');
  assert.ok(ssD54.projectStep, 'soft-skills Day 54 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD54);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD54.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 54: Domain-Specific Content Assertions', () => {
  const ssD54 = getLongLesson('soft-skills', 54);
  assert.ok(ssD54);

  assert.ok(ssD54.parts[0].output.includes('BAYESIAN HIRING COMMITTEE EVALUATION'));
  assert.ok(ssD54.parts[0].output.includes('BAYESIAN_HIRING_COMMITTEE_100_PCT_VERIFIED'));
  assert.ok(ssD54.parts[1].output.includes('5-ROUND ONSITE MASTER PREPARATION PLAN'));
  assert.ok(ssD54.parts[1].output.includes('ONSITE_PREP_PLAN_100_PCT_VERIFIED'));
  assert.ok(ssD54.parts[2].output.includes('FULL-LOOP ONSITE PERFORMANCE TRACKER'));
  assert.ok(ssD54.parts[2].output.includes('ONSITE_PERFORMANCE_TRACKER_100_PCT_VERIFIED'));
  assert.ok(ssD54.parts[3].output.includes('FULL 5-ROUND MOCK ONSITE GAUNTLET LAB'));
  assert.ok(ssD54.parts[3].output.includes('ONSITE_GAUNTLET_SIMULATOR_100_PCT_VERIFIED'));
  assert.ok(ssD54.parts[4].output.includes('DAY 54 STAFF+ INTERVIEW GAUNTLET CERTIFICATION'));
  assert.ok(ssD54.parts[4].output.includes('DAY_54_STAFF_INTERVIEW_GAUNTLET_100_PCT_VERIFIED'));
});

test('Soft Skills Day 55: Resolution & Structural Invariants for The Space Shuttle Challenger Disaster', () => {
  const ssD55 = getLongLesson('soft-skills', 55);
  assert.ok(ssD55, 'soft-skills Day 55 long lesson must resolve');
  assert.equal(ssD55.day, 55);
  assert.equal(ssD55.parts.length, 5, 'soft-skills Day 55 must contain exactly 5 parts');
  assert.ok(ssD55.summary.length >= 4, 'soft-skills Day 55 must contain comprehensive summary');
  assert.ok(ssD55.projectStep, 'soft-skills Day 55 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD55);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD55.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 55: Domain-Specific Content Assertions', () => {
  const ssD55 = getLongLesson('soft-skills', 55);
  assert.ok(ssD55);

  assert.ok(ssD55.parts[0].output.includes('EDWARD TUFTE FORENSIC ANALYSIS OF CHALLENGER CHARTS'));
  assert.ok(ssD55.parts[0].output.includes('TUFTE_FORENSIC_ENGINE_100_PCT_VERIFIED'));
  assert.ok(ssD55.parts[1].output.includes('RECONSTRUCTED DEFINITIVE 1-PAGE TUFTE SCATTERPLOT'));
  assert.ok(ssD55.parts[1].output.includes('CHALLENGER_RECONSTRUCTION_100_PCT_VERIFIED'));
  assert.ok(ssD55.parts[2].output.includes('CRITICAL THREAT VISUALIZER CLI'));
  assert.ok(ssD55.parts[2].output.includes('CRITICAL_THREAT_VISUALIZER_100_PCT_VERIFIED'));
  assert.ok(ssD55.parts[3].output.includes('HIGH-PRESSURE LAUNCH SAFETY DEFENSE LAB'));
  assert.ok(ssD55.parts[3].output.includes('LAUNCH_SAFETY_DEFENSE_100_PCT_VERIFIED'));
  assert.ok(ssD55.parts[4].output.includes('DAY 55 ETHICAL ENGINEERING & CRISIS COMMUNICATION CERTIFICATION'));
  assert.ok(ssD55.parts[4].output.includes('DAY_55_ETHICAL_ENGINEERING_100_PCT_VERIFIED'));
});
