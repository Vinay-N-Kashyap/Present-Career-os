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




