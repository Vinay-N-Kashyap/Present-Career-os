import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import esbuild from 'esbuild';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';

test('Full-Stack JavaScript Long Lessons: Resolution & Language Invariants', () => {
  assert.equal(getLongLessonLanguage('fullstack-js'), 'typescript');

  for (let day = 1; day <= 8; day++) {
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


