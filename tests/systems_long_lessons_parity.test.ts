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

  const gitVcsLesson2 = getLongLesson('git_vcs', 2);
  assert.ok(gitVcsLesson2, 'git_vcs Day 2 lesson must be resolved');
  assert.equal(gitVcsLesson2.day, 2);
  assert.equal(gitVcsLesson2.parts.length, 5);

  // Verify all check questions across all parts
  for (const lesson of [compFundLesson, compFundLesson2, gitVcsLesson, gitVcsLesson2, iotEmbLesson, iotEmbLesson2]) {
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

test('Systems Long Lessons: git_vcs Day 2 Bash Snippets Execute Successfully in POSIX Runner', async () => {
  const gitVcsLesson2 = getLongLesson('git_vcs', 2)!;

  // Part 1: Branch pointers & HEAD inspection
  const res1 = await executeBashSuite(gitVcsLesson2.parts[0].code!);
  assert.equal(res1.allPassed, true, 'Part 1 branch pointers must succeed');
  assert.ok(res1.stdout?.includes('ref: refs/heads/feature-auth'), 'Must report active HEAD ref');
  assert.ok(res1.stdout?.includes('commit_sha_101'), 'Must report branch commit SHA');

  // Part 2: Fast-forward vs 3-way merge inspection
  const res2 = await executeBashSuite(gitVcsLesson2.parts[1].code!);
  assert.equal(res2.allPassed, true, 'Part 2 merge tree grep must succeed');
  assert.ok(res2.stdout?.includes('main: add_nav'), 'Must report main branch state');
  assert.ok(res2.stdout?.includes('feature: add_login'), 'Must report feature branch state');

  // Part 3: Merge conflict markers
  const res3 = await executeBashSuite(gitVcsLesson2.parts[2].code!);
  assert.equal(res3.allPassed, true, 'Part 3 conflict markers must succeed');
  assert.ok(res3.stdout?.includes('<<<<<<< HEAD'), 'Must include HEAD conflict marker');
  assert.ok(res3.stdout?.includes('======='), 'Must include divider marker');
  assert.ok(res3.stdout?.includes('>>>>>>> feature-config'), 'Must include incoming branch marker');

  // Part 4: .gitignore secret prevention
  const res4 = await executeBashSuite(gitVcsLesson2.parts[3].code!);
  assert.equal(res4.allPassed, true, 'Part 4 gitignore must succeed');
  assert.ok(res4.stdout?.includes('node_modules/'), 'Must ignore dependencies');
  assert.ok(res4.stdout?.includes('.env'), 'Must ignore secret files');
  assert.ok(res4.stdout?.includes('.env.example'), 'Must permit example template');

  // Part 5: Linear rebase history & wc -l
  const res5 = await executeBashSuite(gitVcsLesson2.parts[4].code!);
  assert.equal(res5.allPassed, true, 'Part 5 rebase log must succeed');
  assert.ok(res5.stdout?.includes('commit_1 (base)'), 'Must include rebased base');
  assert.ok(res5.stdout?.includes('3'), 'Must count 3 linear commits');
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

test('Systems Long Lessons: comp_fund Day 3 Process Lifecycle, Signals, Memory & CFS Verification', async () => {
  const compFundD3 = getLongLesson('comp_fund', 3);
  assert.ok(compFundD3, 'comp_fund Day 3 must resolve');
  assert.equal(compFundD3.day, 3);
  assert.equal(compFundD3.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(compFundD3);
  const totalMin = estimateLessonMinutes(compFundD3);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < compFundD3.parts.length; i++) {
    const part = compFundD3.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.length > 0, `Part ${i + 1} code must contain bash commands`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.ok(check.options.length >= 3, `Part ${i + 1} check must have at least 3 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Part 1: Process Table & Fork/Exec/Zombie
  const res1 = await executeBashSuite(compFundD3.parts[0].code!);
  assert.equal(res1.allPassed, true, 'Part 1 process table must succeed');
  assert.ok(res1.stdout?.includes('RUNNING node'), 'Must report active node process');
  assert.ok(res1.stdout?.includes('ZOMBIE  worker-child'), 'Must identify zombie process');

  // Part 2: POSIX Signals
  const res2 = await executeBashSuite(compFundD3.parts[1].code!);
  assert.equal(res2.allPassed, true, 'Part 2 signals table must succeed');
  assert.ok(res2.stdout?.includes('SIGTERM 15 GRACEFUL'), 'Must include SIGTERM');
  assert.ok(res2.stdout?.includes('SIGKILL 9  TERMINATE'), 'Must include SIGKILL');
  assert.ok(res2.stdout?.includes('3'), 'Must count 3 catchable signals');

  // Part 3: Virtual Memory Page Tables
  const res3 = await executeBashSuite(compFundD3.parts[2].code!);
  assert.equal(res3.allPassed, true, 'Part 3 page table must succeed');
  assert.ok(res3.stdout?.includes('0x001 0x0A4'), 'Must include mapped page');
  assert.ok(res3.stdout?.includes('0x003 0x000'), 'Must capture unmapped page fault frame');

  // Part 4: Completely Fair Scheduler (CFS) vruntime queue
  const res4 = await executeBashSuite(compFundD3.parts[3].code!);
  assert.equal(res4.allPassed, true, 'Part 4 CFS queue must succeed');
  assert.ok(res4.stdout?.includes('012.5ms PID_1088 realtime_audio'), 'Lowest vruntime task scheduled first');
  assert.ok(res4.stdout?.includes('042.1ms PID_1001 api_gateway'), 'Second lowest vruntime task scheduled next');

  // Part 5: File Descriptors & Inodes
  const res5 = await executeBashSuite(compFundD3.parts[4].code!);
  assert.equal(res5.allPassed, true, 'Part 5 file descriptors & inodes must succeed');
  assert.ok(res5.stdout?.includes('INODE:984321'), 'Must display inode metadata');
  assert.ok(res5.stdout?.includes('STDOUT: fd_1 active'), 'Must verify stdout fd_1');
  assert.ok(res5.stdout?.includes('STDERR: fd_2 connected'), 'Must verify stderr fd_2');
});

test('Systems Long Lessons: git_vcs Day 3 Objects, DAG, Reflog & Bisect Verification', async () => {
  const gitVcsD3 = getLongLesson('git_vcs', 3);
  assert.ok(gitVcsD3, 'git_vcs Day 3 must resolve');
  assert.equal(gitVcsD3.day, 3);
  assert.equal(gitVcsD3.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(gitVcsD3);
  const totalMin = estimateLessonMinutes(gitVcsD3);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < gitVcsD3.parts.length; i++) {
    const part = gitVcsD3.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.length > 0, `Part ${i + 1} code must contain bash commands`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.ok(check.options.length >= 3, `Part ${i + 1} check must have at least 3 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Part 1: Git Object Model (Blobs, Trees, Commits, Tags)
  const res1 = await executeBashSuite(gitVcsD3.parts[0].code!);
  assert.equal(res1.allPassed, true, 'Part 1 objects must succeed');
  assert.ok(res1.stdout?.includes('BLOB:   4b825dc642cb6eb9a060e54bf8d69288fbee4904'), 'Must list blob object');
  assert.ok(res1.stdout?.includes('COMMIT: f077af716a4a15a8128392182093847120938471'), 'Must list commit object');

  // Part 2: DAG Traversal & Merge Commits
  const res2 = await executeBashSuite(gitVcsD3.parts[1].code!);
  assert.equal(res2.allPassed, true, 'Part 2 DAG traversal must succeed');
  assert.ok(res2.stdout?.includes('M4 (merge-commit, parents: C2 C3)'), 'Must identify merge commit with 2 parents');

  // Part 3: Git Reflog Disaster Recovery
  const res3 = await executeBashSuite(gitVcsD3.parts[2].code!);
  assert.equal(res3.allPassed, true, 'Part 3 reflog must succeed');
  assert.ok(res3.stdout?.includes('ACCIDENTAL_DROP'), 'Must isolate accidental drop event in reflog');

  // Part 4: Bisect Regression Hunting
  const res4 = await executeBashSuite(gitVcsD3.parts[3].code!);
  assert.equal(res4.allPassed, true, 'Part 4 bisect must succeed');
  assert.ok(res4.stdout?.includes('CULPRIT: commit_704 introduced regression'), 'Must isolate culprit commit');

  // Part 5: Interactive Rebase Squashing
  const res5 = await executeBashSuite(gitVcsD3.parts[4].code!);
  assert.equal(res5.allPassed, true, 'Part 5 interactive rebase must succeed');
  assert.ok(res5.stdout?.includes('pick   c101 feat: add user auth schema'), 'Must preserve base pick commit');
  assert.ok(res5.stdout?.includes('2'), 'Must count 2 squashed commits');
});

test('Systems Long Lessons: comp_fund Day 4 POSIX Sockets, TCP State, epoll & TLS 1.3 Verification', async () => {
  const compFundD4 = getLongLesson('comp_fund', 4);
  assert.ok(compFundD4, 'comp_fund Day 4 must resolve');
  assert.equal(compFundD4.day, 4);
  assert.equal(compFundD4.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(compFundD4);
  const totalMin = estimateLessonMinutes(compFundD4);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < compFundD4.parts.length; i++) {
    const part = compFundD4.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.length > 0, `Part ${i + 1} code must contain bash commands`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.ok(check.options.length >= 3, `Part ${i + 1} check must have at least 3 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Part 1: POSIX Berkeley Sockets
  const res1 = await executeBashSuite(compFundD4.parts[0].code!);
  assert.equal(res1.allPassed, true, 'Part 1 sockets must succeed');
  assert.ok(res1.stdout?.includes('FD_3 LISTEN'), 'Must list listening socket FD_3');
  assert.ok(res1.stdout?.includes('ESTABLISHED'), 'Must isolate established client channels');

  // Part 2: TCP 3-Way Handshake & Teardown
  const res2 = await executeBashSuite(compFundD4.parts[1].code!);
  assert.equal(res2.allPassed, true, 'Part 2 TCP handshake must succeed');
  assert.ok(res2.stdout?.includes('SYN-ACK'), 'Must include SYN-ACK step');
  assert.ok(res2.stdout?.includes('TIME_WAIT 2MSL_TIMEOUT:60s'), 'Must verify TIME_WAIT teardown state');

  // Part 3: epoll I/O Multiplexing
  const res3 = await executeBashSuite(compFundD4.parts[2].code!);
  assert.equal(res3.allPassed, true, 'Part 3 epoll must succeed');
  assert.ok(res3.stdout?.includes('EPOLL_EVENT: FD_4 EPOLLIN'), 'Must capture read readiness event');

  // Part 4: DNS Recursive Resolution Hierarchy
  const res4 = await executeBashSuite(compFundD4.parts[3].code!);
  assert.equal(res4.allPassed, true, 'Part 4 DNS hierarchy must succeed');
  assert.ok(res4.stdout?.includes('ROOT_SERVER'), 'Must traverse root server referral');
  assert.ok(res4.stdout?.includes('AUTH_NAMESERVER'), 'Must resolve authoritative A record');

  // Part 5: TLS 1.3 1-RTT Handshake
  const res5 = await executeBashSuite(compFundD4.parts[4].code!);
  assert.equal(res5.allPassed, true, 'Part 5 TLS 1.3 must succeed');
  assert.ok(res5.stdout?.includes('TLS_1_3'), 'Must verify TLS 1.3 version');
  assert.ok(res5.stdout?.includes('FORWARD_SECRECY: VERIFIED'), 'Must confirm forward secrecy');
});

test('Systems Long Lessons: git_vcs Day 4 Hooks, Signed Commits, Worktrees & Monorepo Scaling Verification', async () => {
  const gitVcsD4 = getLongLesson('git_vcs', 4);
  assert.ok(gitVcsD4, 'git_vcs Day 4 must resolve');
  assert.equal(gitVcsD4.day, 4);
  assert.equal(gitVcsD4.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(gitVcsD4);
  const totalMin = estimateLessonMinutes(gitVcsD4);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < gitVcsD4.parts.length; i++) {
    const part = gitVcsD4.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.length > 0, `Part ${i + 1} code must contain bash commands`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.ok(check.options.length >= 3, `Part ${i + 1} check must have at least 3 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Part 1: Git Hooks Architecture (pre-commit, commit-msg)
  const res1 = await executeBashSuite(gitVcsD4.parts[0].code!);
  assert.equal(res1.allPassed, true, 'Part 1 git hooks must succeed');
  assert.ok(res1.stdout?.includes('HOOK_STATUS: COMMIT_MSG_VALIDATED'), 'Must validate commit message hook');

  // Part 2: Cryptographically Signed Commits (GPG/SSH)
  const res2 = await executeBashSuite(gitVcsD4.parts[1].code!);
  assert.equal(res2.allPassed, true, 'Part 2 signed commits must succeed');
  assert.ok(res2.stdout?.includes('GPG_VERIFIED_VALID'), 'Must verify cryptographic GPG signature');

  // Part 3: Git Worktrees
  const res3 = await executeBashSuite(gitVcsD4.parts[2].code!);
  assert.equal(res3.allPassed, true, 'Part 3 worktrees must succeed');
  assert.ok(res3.stdout?.includes('agent/antigravity'), 'Must identify agent worktree');

  // Part 4: Git Submodules vs Subtrees
  const res4 = await executeBashSuite(gitVcsD4.parts[3].code!);
  assert.equal(res4.allPassed, true, 'Part 4 submodules must succeed');
  assert.ok(res4.stdout?.includes('160000 commit e9a0812'), 'Must detect submodule commit mode 160000');

  // Part 5: Monorepo Scaling (Partial / Blobless Clones)
  const res5 = await executeBashSuite(gitVcsD4.parts[4].code!);
  assert.equal(res5.allPassed, true, 'Part 5 monorepo scaling must succeed');
  assert.ok(res5.stdout?.includes('INITIAL_DOWNLOAD_SAVING: 92%'), 'Must calculate download performance savings');
});

test('Systems Long Lessons: iot_emb Day 3 UART, SPI, I2C, CAN & CRC-16 AST Verification', async () => {
  const iotEmbLesson3 = getLongLesson('iot_emb', 3);
  assert.ok(iotEmbLesson3, 'iot_emb Day 3 must resolve');
  assert.equal(iotEmbLesson3.day, 3);
  assert.equal(iotEmbLesson3.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(iotEmbLesson3);
  const totalMin = estimateLessonMinutes(iotEmbLesson3);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < iotEmbLesson3.parts.length; i++) {
    const part = iotEmbLesson3.parts[i];
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
  const res1 = await executeCppSuite(iotEmbLesson3.parts[0].code!, 'encodeUartFrame');
  assert.equal(res1.allPassed, true, 'Part 1 encodeUartFrame must pass AST analysis');

  const res2 = await executeCppSuite(iotEmbLesson3.parts[1].code!, 'simulateSpiTransfer');
  assert.equal(res2.allPassed, true, 'Part 2 simulateSpiTransfer must pass AST analysis');

  const res3 = await executeCppSuite(iotEmbLesson3.parts[2].code!, 'evaluateI2cArbitration');
  assert.equal(res3.allPassed, true, 'Part 3 evaluateI2cArbitration must pass AST analysis');

  const res4 = await executeCppSuite(iotEmbLesson3.parts[3].code!, 'evaluateCanArbitration');
  assert.equal(res4.allPassed, true, 'Part 4 evaluateCanArbitration must pass AST analysis');

  const res5 = await executeCppSuite(iotEmbLesson3.parts[4].code!, 'calculateCrc16');
  assert.equal(res5.allPassed, true, 'Part 5 calculateCrc16 must pass AST analysis');
});






