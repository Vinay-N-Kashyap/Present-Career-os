import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import crypto from 'node:crypto';
import esbuild from 'esbuild';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';

test('Full-Stack JavaScript Long Lessons: Resolution & Language Invariants', () => {
  assert.equal(getLongLessonLanguage('fullstack-js'), 'typescript');

  for (let day = 1; day <= 25; day++) {
    const lesson = getLongLesson('fullstack-js', day);
    assert.ok(lesson, `fullstack-js Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `fullstack-js Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.summary.length >= 4, `fullstack-js Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `fullstack-js Day ${day} must have a hands-on project step`);
  }
});

test('Full-Stack JS Day 6: Next.js App Router Data Fetching, Request Memoization & Cache Revalidation', async () => {
  const lesson = getLongLesson('fullstack-js', 6);
  assert.ok(lesson, 'fullstack-js Day 6 long lesson must resolve');
  assert.equal(lesson.day, 6);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 6 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 6 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 6 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 80));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('RequestMemoizationEngine'));
  assert.ok(lesson.parts[1].code?.includes('NextDataCacheEngine'));
  assert.ok(lesson.parts[2].code?.includes('NextRevalidationCoordinator'));
  assert.ok(lesson.parts[3].code?.includes('NextRouteCompilerEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseDataPipelineMasterEngine'));
});

test('Full-Stack JS Day 7: Server Actions, Form Mutations & Optimistic UI Architecture', async () => {
  const lesson = getLongLesson('fullstack-js', 7);
  assert.ok(lesson, 'fullstack-js Day 7 long lesson must resolve');
  assert.equal(lesson.day, 7);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 7 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 7 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 7 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 80));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('NextServerActionRpcEngine'));
  assert.ok(lesson.parts[1].code?.includes('FormStateReducerMachine'));
  assert.ok(lesson.parts[2].code?.includes('OptimisticUiEngine'));
  assert.ok(lesson.parts[3].code?.includes('ServerActionValidatorEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseMutationPipelineMasterEngine'));
});

test('Full-Stack JS Day 8: Edge Middleware, Distributed Session Verification & Request Routing', async () => {
  const lesson = getLongLesson('fullstack-js', 8);
  assert.ok(lesson, 'fullstack-js Day 8 long lesson must resolve');
  assert.equal(lesson.day, 8);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 8 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 8 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 8 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      RegExp,
      URL,
      encodeURIComponent,
      crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 80));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('NextEdgeMiddlewareEngine'));
  assert.ok(lesson.parts[1].code?.includes('EdgeJwtVerificationEngine'));
  assert.ok(lesson.parts[2].code?.includes('NextEdgeTransformationCoordinator'));
  assert.ok(lesson.parts[3].code?.includes('EdgeSlidingWindowRateLimiter'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseEdgeSecurityGatewayMasterEngine'));
});

test('Full-Stack JS Day 9: Advanced Routing Architecture: Intercepting Routes & Parallel Slots', async () => {
  const lesson = getLongLesson('fullstack-js', 9);
  assert.ok(lesson, 'fullstack-js Day 9 long lesson must resolve');
  assert.equal(lesson.day, 9);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 9 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 9 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 9 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 80));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('NextParallelRoutesEngine'));
  assert.ok(lesson.parts[1].code?.includes('NextInterceptingRouteEngine'));
  assert.ok(lesson.parts[2].code?.includes('NextSlotReconciliationEngine'));
  assert.ok(lesson.parts[3].code?.includes('NextLayoutHierarchyEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseMultiPaneDashboardMasterEngine'));
});

test('Full-Stack JS Day 10 ⭐ Milestone 2 Capstone: Distributed Enterprise SaaS & E-Commerce Core Architecture', async () => {
  const lesson = getLongLesson('fullstack-js', 10);
  assert.ok(lesson, 'fullstack-js Day 10 long lesson must resolve');
  assert.equal(lesson.day, 10);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 10 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 10 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 10 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      URL
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 100));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('CapstoneEdgeGatewayEngine'));
  assert.ok(lesson.parts[1].code?.includes('CapstoneParallelLayoutCoordinator'));
  assert.ok(lesson.parts[2].code?.includes('CapstoneDataCacheMasterEngine'));
  assert.ok(lesson.parts[3].code?.includes('CapstoneOptimisticMutationEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseFullStackCommerceMasterEngine'));
});

test('Full-Stack JS Day 11: Password Hashing with Argon2/Bcrypt & Salt Invariants', async () => {
  const lesson = getLongLesson('fullstack-js', 11);
  assert.ok(lesson, 'fullstack-js Day 11 long lesson must resolve');
  assert.equal(lesson.day, 11);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 11 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 11 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 11 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      Uint32Array,
      parseInt
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 100));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('SaltDefenseEngine'));
  assert.ok(lesson.parts[1].code?.includes('BcryptArchitectureEngine'));
  assert.ok(lesson.parts[2].code?.includes('Argon2idSimulationEngine'));
  assert.ok(lesson.parts[3].code?.includes('ConstantTimeComparisonEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterprisePasswordLifecycleEngine'));
});

test('Full-Stack JS Day 12: Prisma ORM, Schema Migrations & Relational Modeling', async () => {
  const lesson = getLongLesson('fullstack-js', 12);
  assert.ok(lesson, 'fullstack-js Day 12 long lesson must resolve');
  assert.equal(lesson.day, 12);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 12 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 12 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 12 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 100));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('PrismaSchemaEngine'));
  assert.ok(lesson.parts[1].code?.includes('PrismaMigrationEngine'));
  assert.ok(lesson.parts[2].code?.includes('PrismaQueryCompilerEngine'));
  assert.ok(lesson.parts[3].code?.includes('PrismaTransactionEngine'));
  assert.ok(lesson.parts[4].code?.includes('ServerlessConnectionPoolEngine'));
});

test('Full-Stack JS Day 13: The N+1 Query Problem & DataLoader Batching', async () => {
  const lesson = getLongLesson('fullstack-js', 13);
  assert.ok(lesson, 'fullstack-js Day 13 long lesson must resolve');
  assert.equal(lesson.day, 13);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 13 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 13 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 13 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 100));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('NPlusOneDegradationEngine'));
  assert.ok(lesson.parts[1].code?.includes('MicrotaskDataLoader'));
  assert.ok(lesson.parts[2].code?.includes('RequestScopedDataLoaderManager'));
  assert.ok(lesson.parts[3].code?.includes('OneToManyBatchingEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseDataLoaderOrchestratorEngine'));
});

test('Full-Stack JS Day 14: Redis In-Memory Caching & Cache-Aside Invalidation', async () => {
  const lesson = getLongLesson('fullstack-js', 14);
  assert.ok(lesson, 'fullstack-js Day 14 long lesson must resolve');
  assert.equal(lesson.day, 14);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 14 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 14 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 14 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 150));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('InVirtualRedisEngine'));
  assert.ok(lesson.parts[1].code?.includes('CacheAsideService'));
  assert.ok(lesson.parts[2].code?.includes('StampedeProtectedCache'));
  assert.ok(lesson.parts[3].code?.includes('VirtualRedisServer'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseCacheManager'));
});

test('Full-Stack JS Day 15 ⭐ Milestone 3 Capstone: Enterprise Multi-Tenant Authentication & Session Hub', async () => {
  const lesson = getLongLesson('fullstack-js', 15);
  assert.ok(lesson, 'fullstack-js Day 15 long lesson must resolve');
  assert.equal(lesson.day, 15);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 15 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 15 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 15 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process,
      crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 150));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('TenantResolutionEngine'));
  assert.ok(lesson.parts[1].code?.includes('CryptographicAuthHub'));
  assert.ok(lesson.parts[2].code?.includes('DistributedSessionHub'));
  assert.ok(lesson.parts[3].code?.includes('MultiTenantPermissionLoader'));
  assert.ok(lesson.parts[4].code?.includes('EndToEndAuthCapstoneSuite'));
});

test('Full-Stack JS Day 16: GraphQL APIs, Resolvers & Query Complexity Cost Analysis', async () => {
  const lesson = getLongLesson('fullstack-js', 16);
  assert.ok(lesson, 'fullstack-js Day 16 long lesson must resolve');
  assert.equal(lesson.day, 16);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 16 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 16 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 16 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process,
      crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 150));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('VirtualGraphQLSchemaRegistry'));
  assert.ok(lesson.parts[1].code?.includes('VirtualGraphQLExecutor'));
  assert.ok(lesson.parts[2].code?.includes('GraphQLSecurityAnalyzer'));
  assert.ok(lesson.parts[3].code?.includes('DirectiveSchemaDecorator'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseGraphQLGateway'));
});

test('Full-Stack JS Day 17: End-to-End Type Safety with tRPC & Zod Invariants', async () => {
  const lesson = getLongLesson('fullstack-js', 17);
  assert.ok(lesson, 'fullstack-js Day 17 long lesson must resolve');
  assert.equal(lesson.day, 17);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 17 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 17 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 17 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process,
      crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 150));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('VirtualTrpcRouter'));
  assert.ok(lesson.parts[1].code?.includes('ProcedureBuilder'));
  assert.ok(lesson.parts[2].code?.includes('VirtualZodType'));
  assert.ok(lesson.parts[3].code?.includes('TrpcHttpBatchLinkEngine'));
  assert.ok(lesson.parts[4].code?.includes('SuperJsonSerializer'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseTrpcRouter'));
});

test('Full-Stack JS Day 18: Real-Time Bidirectional Streaming with WebSockets & Server-Sent Events', async () => {
  const lesson = getLongLesson('fullstack-js', 18);
  assert.ok(lesson, 'fullstack-js Day 18 long lesson must resolve');
  assert.equal(lesson.day, 18);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 18 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 18 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 18 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process,
      crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 150));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('RealtimeProtocolAnalyzer'));
  assert.ok(lesson.parts[1].code?.includes('WebSocketHandshakeSimulator'));
  assert.ok(lesson.parts[2].code?.includes('WebSocketHeartbeatManager'));
  assert.ok(lesson.parts[3].code?.includes('DistributedPubSubCluster'));
  assert.ok(lesson.parts[4].code?.includes('BackpressureManagedSocket'));
});

test('Full-Stack JS Day 19: Message Queues & Background Job Processing with BullMQ, Redis & Dead-Letter Queues', async () => {
  const lesson = getLongLesson('fullstack-js', 19);
  assert.ok(lesson, 'fullstack-js Day 19 long lesson must resolve');
  assert.equal(lesson.day, 19);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 19 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 19 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 19 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process,
      crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 150));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('DistributedJobQueueEngine'));
  assert.ok(lesson.parts[1].code?.includes('SandboxedWorkerPoolSimulator'));
  assert.ok(lesson.parts[2].code?.includes('RetryAndDeadLetterEngine'));
  assert.ok(lesson.parts[3].code?.includes('PriorityRateLimitedQueueCoordinator'));
  assert.ok(lesson.parts[4].code?.includes('IdempotentWorkflowEngine'));
});

test('Full-Stack JS Day 20 ⭐ Milestone 4 Capstone: Real-Time Event-Driven Collaboration & Background Processing Engine', async () => {
  const lesson = getLongLesson('fullstack-js', 20);
  assert.ok(lesson, 'fullstack-js Day 20 long lesson must resolve');
  assert.equal(lesson.day, 20);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 20 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 20 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 20 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process,
      crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 150));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('HybridGatewayDispatcher'));
  assert.ok(lesson.parts[1].code?.includes('CrdtMultiplayerSyncEngine'));
  assert.ok(lesson.parts[2].code?.includes('DistributedMultiTenantPubSubMesh'));
  assert.ok(lesson.parts[3].code?.includes('OffloadJobDagPipeline'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseResilienceTelemetryHub'));
});

test('Full-Stack JS Day 21: Next.js Route Handlers, Web Streams & Edge Streaming Architecture', async () => {
  const lesson = getLongLesson('fullstack-js', 21);
  assert.ok(lesson, 'fullstack-js Day 21 long lesson must resolve');
  assert.equal(lesson.day, 21);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 21 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 21 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 21 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 5);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('console.log('));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.ok(check.options.length >= 4);
    assert.ok(check.answer >= 0 && check.answer < check.options.length);
    assert.ok(check.why.length > 15);

    let stdout = '';
    const sandbox = {
      console: { log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; } },
      setTimeout, Promise, Date, Map, Set, Array, JSON, Math, Number, isNaN, Object, Buffer, process, crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    const normActual = stdout.trim().replace(/\r\n/g, '\n').replace(/timestamp":\d+/g, 'timestamp":0');
    const normExpected = part.output.trim().replace(/\r\n/g, '\n').replace(/timestamp":\d*/g, 'timestamp":0');
    assert.equal(normActual, normExpected, `Day 21 Part ${i + 1} stdout mismatch`);
  }

  assert.ok(lesson.parts[0].code?.includes('WebStreamChunkTransformer'));
  assert.ok(lesson.parts[1].code?.includes('NdjsonStreamingProtocolEngine'));
  assert.ok(lesson.parts[2].code?.includes('BackpressuredStreamPipeline'));
  assert.ok(lesson.parts[3].code?.includes('SseProtocolEngine'));
  assert.ok(lesson.parts[4].code?.includes('StreamingGatewayEngine'));
});

test('Full-Stack JS Day 22: Distributed Microservices, gRPC & Protocol Buffers (Protobuf)', async () => {
  const lesson = getLongLesson('fullstack-js', 22);
  assert.ok(lesson, 'fullstack-js Day 22 long lesson must resolve');
  assert.equal(lesson.day, 22);
  assert.equal(lesson.parts.length, 5);
  assert.ok(lesson.summary.length >= 4);
  assert.ok(lesson.projectStep);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.check.options.length >= 4);

    let stdout = '';
    const sandbox = {
      console: { log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; } },
      setTimeout, Promise, Date, Map, Set, Array, JSON, Math, Number, isNaN, Object, Buffer, process, crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    const normActual = stdout.trim().replace(/\r\n/g, '\n');
    const normExpected = part.output.trim().replace(/\r\n/g, '\n');
    assert.equal(normActual, normExpected, `Day 22 Part ${i + 1} stdout mismatch`);
  }

  assert.ok(lesson.parts[0].code?.includes('ProtobufBinaryEncoder'));
  assert.ok(lesson.parts[1].code?.includes('GrpcHttp2MultiplexedTransport'));
  assert.ok(lesson.parts[2].code?.includes('GrpcDeadlineManager'));
  assert.ok(lesson.parts[3].code?.includes('GrpcBidirectionalSyncEngine'));
  assert.ok(lesson.parts[4].code?.includes('GrpcJsonTranscodingEngine'));
});

test('Full-Stack JS Day 23: Event-Driven Architecture with Apache Kafka & Distributed Log Streaming', async () => {
  const lesson = getLongLesson('fullstack-js', 23);
  assert.ok(lesson, 'fullstack-js Day 23 long lesson must resolve');
  assert.equal(lesson.day, 23);
  assert.equal(lesson.parts.length, 5);
  assert.ok(lesson.summary.length >= 4);
  assert.ok(lesson.projectStep);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.check.options.length >= 4);

    let stdout = '';
    const sandbox = {
      console: { log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; } },
      setTimeout, Promise, Date, Map, Set, Array, JSON, Math, Number, isNaN, Object, Buffer, process, crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    const normActual = stdout.trim().replace(/\r\n/g, '\n');
    const normExpected = part.output.trim().replace(/\r\n/g, '\n');
    assert.equal(normActual, normExpected, `Day 23 Part ${i + 1} stdout mismatch`);
  }

  assert.ok(lesson.parts[0].code?.includes('KafkaPartitionCommitLog'));
  assert.ok(lesson.parts[1].code?.includes('KafkaPartitionHasher'));
  assert.ok(lesson.parts[2].code?.includes('ConsumerGroupCoordinator'));
  assert.ok(lesson.parts[3].code?.includes('IdempotentProducerTransactionalMesh'));
  assert.ok(lesson.parts[4].code?.includes('SchemaRegistryValidator'));
});

test('Full-Stack JS Day 24: Docker Containerization, Multi-Stage Production Builds & Alpine Security', async () => {
  const lesson = getLongLesson('fullstack-js', 24);
  assert.ok(lesson, 'fullstack-js Day 24 long lesson must resolve');
  assert.equal(lesson.day, 24);
  assert.equal(lesson.parts.length, 5);
  assert.ok(lesson.summary.length >= 4);
  assert.ok(lesson.projectStep);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.check.options.length >= 4);

    let stdout = '';
    const sandbox = {
      console: { log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; } },
      setTimeout, Promise, Date, Map, Set, Array, JSON, Math, Number, isNaN, Object, Buffer, process, crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    const normActual = stdout.trim().replace(/\r\n/g, '\n');
    const normExpected = part.output.trim().replace(/\r\n/g, '\n');
    assert.equal(normActual, normExpected, `Day 24 Part ${i + 1} stdout mismatch`);
  }

  assert.ok(lesson.parts[0].code?.includes('DockerLayerCacheEngine'));
  assert.ok(lesson.parts[1].code?.includes('NextjsMultiStageBuilder'));
  assert.ok(lesson.parts[2].code?.includes('ContainerSecurityAuditor'));
  assert.ok(lesson.parts[3].code?.includes('ContainerHealthProbeManager'));
  assert.ok(lesson.parts[4].code?.includes('DockerComposeOrchestrator'));
});

test('Full-Stack JS Day 25: ⭐ Milestone 5 Capstone: Distributed Event-Driven Cloud Microservices Architecture', async () => {
  const lesson = getLongLesson('fullstack-js', 25);
  assert.ok(lesson, 'fullstack-js Day 25 long lesson must resolve');
  assert.equal(lesson.day, 25);
  assert.equal(lesson.parts.length, 5);
  assert.ok(lesson.summary.length >= 4);
  assert.ok(lesson.projectStep);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.check.options.length >= 4);

    let stdout = '';
    const sandbox = {
      console: { log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; } },
      setTimeout, Promise, Date, Map, Set, Array, JSON, Math, Number, isNaN, Object, Buffer, process, crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    const normActual = stdout.trim().replace(/\r\n/g, '\n').replace(/PID=\d+/g, 'PID=0');
    const normExpected = part.output.trim().replace(/\r\n/g, '\n').replace(/PID=\d*/g, 'PID=0');
    assert.equal(normActual, normExpected, `Day 25 Part ${i + 1} stdout mismatch`);
  }

  assert.ok(lesson.parts[0].code?.includes('EdgeGrpcGatewayBridge'));
  assert.ok(lesson.parts[1].code?.includes('GrpcServiceContractEnforcer'));
  assert.ok(lesson.parts[2].code?.includes('KafkaEventFabricManager'));
  assert.ok(lesson.parts[3].code?.includes('ContainerWorkerSupervisor'));
  assert.ok(lesson.parts[4].code?.includes('Milestone5CapstoneCertificationMatrix'));
});
