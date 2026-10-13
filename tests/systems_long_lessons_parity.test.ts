import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';
import { executeBashSuite } from '../src/lib/code/runners/bashRunner';
import { executeCppSuite } from '../src/lib/code/runners/cppRunner';

test('Systems Long Lessons: Resolution & Structural Integrity for comp_fund, git_vcs, iot_emb', () => {
  const compFundLesson = getLongLesson('comp_fund', 1);
  assert.ok(compFundLesson, 'comp_fund Day 1 lesson must be resolved');
  assert.equal(compFundLesson.day, 1);
  assert.equal(compFundLesson.parts.length, 5);
  assert.equal(getLongLessonLanguage('comp_fund'), 'bash');

  const gitVcsLesson = getLongLesson('git_vcs', 1);
  assert.ok(gitVcsLesson, 'git_vcs Day 1 lesson must be resolved');
  assert.equal(gitVcsLesson.day, 1);
  assert.equal(gitVcsLesson.parts.length, 5);
  assert.equal(getLongLessonLanguage('git_vcs'), 'bash');

  const iotEmbLesson = getLongLesson('iot_emb', 1);
  assert.ok(iotEmbLesson, 'iot_emb Day 1 lesson must be resolved');
  assert.equal(iotEmbLesson.day, 1);
  assert.equal(iotEmbLesson.parts.length, 5);
  assert.equal(getLongLessonLanguage('iot_emb'), 'cpp');

  const iotEmbLesson2 = getLongLesson('iot_emb', 2);
  assert.ok(iotEmbLesson2, 'iot_emb Day 2 lesson must be resolved');
  assert.equal(iotEmbLesson2.day, 2);
  assert.equal(iotEmbLesson2.parts.length, 5);

  const compFundLesson2 = getLongLesson('comp_fund', 2);
  assert.ok(compFundLesson2, 'comp_fund Day 2 lesson must be resolved');
  assert.equal(compFundLesson2.day, 2);
  assert.equal(compFundLesson2.parts.length, 5);

  // Verify all check questions across all parts
  for (const lesson of [compFundLesson, compFundLesson2, gitVcsLesson, iotEmbLesson, iotEmbLesson2]) {
    for (const part of lesson.parts) {
      assert.ok(part.check.question.length > 10, 'Question must be substantial');
      assert.ok(part.check.options.length >= 2, 'Options must have at least 2 choices');
      assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index within bounds');
      assert.ok(part.check.why.length > 10, 'Pedagogical explanation must be substantial');
    }
  }
});

test('Systems Long Lessons: comp_fund Day 1 Bash Snippets Execute Successfully in POSIX Runner', async () => {
  const compFundLesson = getLongLesson('comp_fund', 1)!;
  const part1Code = compFundLesson.parts[0].code!;
  const res1 = await executeBashSuite(part1Code);
  assert.equal(res1.allPassed, true, 'Part 1 directory navigation must succeed');
  assert.ok(res1.stdout?.includes('/home/student/workspace'), 'Must report POSIX paths');

  const part4Code = compFundLesson.parts[3].code!;
  const res4 = await executeBashSuite(part4Code);
  assert.equal(res4.allPassed, true, 'Part 4 grep and pipeline must succeed');
  assert.ok(res4.stdout?.includes('ERROR database connection timeout'), 'Grep must filter errors');
  assert.ok(res4.stdout?.includes('2'), 'Piped wc -l must count 2 errors');
});

test('Systems Long Lessons: comp_fund Day 2 Bash Snippets Execute Successfully in POSIX Runner', async () => {
  const compFundLesson2 = getLongLesson('comp_fund', 2)!;

  // Part 1: permissions long listing
  const res1 = await executeBashSuite(compFundLesson2.parts[0].code!);
  assert.equal(res1.allPassed, true, 'Part 1 permissions must succeed');
  assert.ok(res1.stdout?.includes('-rw-r--r--'), 'Must report permission modes');
  assert.ok(res1.stdout?.includes('keys.pem'), 'Must list keys.pem');

  // Part 2: head -n 2
  const res2 = await executeBashSuite(compFundLesson2.parts[1].code!);
  assert.equal(res2.allPassed, true, 'Part 2 head must succeed');
  assert.ok(res2.stdout?.includes('PAGE 1: Authentication Gateway'), 'Must include page 1');
  assert.ok(res2.stdout?.includes('PAGE 2: Customer Dashboard'), 'Must include page 2');

  // Part 3: grep -i, sort, uniq
  const res3 = await executeBashSuite(compFundLesson2.parts[2].code!);
  assert.equal(res3.allPassed, true, 'Part 3 grep -i pipeline must succeed');
  assert.ok(res3.stdout?.includes('database timeout'), 'Must match database errors');

  // Part 4: wc -l metric aggregation
  const res4 = await executeBashSuite(compFundLesson2.parts[3].code!);
  assert.equal(res4.allPassed, true, 'Part 4 wc -l must succeed');
  assert.ok(res4.stdout?.includes('4'), 'Must count 4 total nodes');
  assert.ok(res4.stdout?.includes('3'), 'Must count 3 active nodes');

  // Part 5: chained && execution
  const res5 = await executeBashSuite(compFundLesson2.parts[4].code!);
  assert.equal(res5.allPassed, true, 'Part 5 && chain must succeed');
  assert.ok(res5.stdout?.includes('Build Success'), 'Must print Build Success');
  assert.ok(res5.stdout?.includes('bundle.js'), 'Must verify bundle artifact');
});

test('Systems Long Lessons: iot_emb Day 1 C++ Snippets Pass AST Invariant Verification', async () => {
  const iotEmbLesson = getLongLesson('iot_emb', 1)!;
  const part1Code = iotEmbLesson.parts[0].code!;
  const res1 = await executeCppSuite(part1Code, 'main');
  assert.equal(res1.allPassed, true, 'Part 1 C++ memory region inspector must pass AST analysis');

  const part3Code = iotEmbLesson.parts[2].code!;
  const res3 = await executeCppSuite(part3Code, 'setBit');
  assert.equal(res3.allPassed, true, 'Part 3 C++ bitwise masking functions must pass AST analysis');
});

test('Systems Long Lessons: iot_emb Day 2 C++ Snippets Pass AST Invariant Verification', async () => {
  const iotEmbLesson2 = getLongLesson('iot_emb', 2);
  assert.ok(iotEmbLesson2, 'iot_emb Day 2 must resolve');
  assert.equal(iotEmbLesson2.day, 2);
  assert.equal(iotEmbLesson2.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(iotEmbLesson2);
  const totalMin = estimateLessonMinutes(iotEmbLesson2);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < iotEmbLesson2.parts.length; i++) {
    const part = iotEmbLesson2.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics AST verification
  const res1 = await executeCppSuite(iotEmbLesson2.parts[0].code!, 'encodeNvicPriority');
  assert.equal(res1.allPassed, true, 'Part 1 encodeNvicPriority must pass AST analysis');

  const res2 = await executeCppSuite(iotEmbLesson2.parts[1].code!, 'calculateTimerPwmConfig');
  assert.equal(res2.allPassed, true, 'Part 2 calculateTimerPwmConfig must pass AST analysis');

  const res3 = await executeCppSuite(iotEmbLesson2.parts[2].code!, 'main');
  assert.equal(res3.allPassed, true, 'Part 3 DmaRingBuffer main must pass AST analysis');

  const res4 = await executeCppSuite(iotEmbLesson2.parts[3].code!, 'calculateUsartBrr');
  assert.equal(res4.allPassed, true, 'Part 4 calculateUsartBrr must pass AST analysis');

  const res5 = await executeCppSuite(iotEmbLesson2.parts[4].code!, 'calculateBatteryLifeHours');
  assert.equal(res5.allPassed, true, 'Part 5 calculateBatteryLifeHours must pass AST analysis');
});

