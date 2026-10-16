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

test('Systems Long Lessons: comp_fund Day 5 Storage Engines, Inodes, Zero-Copy & Containers Verification', async () => {
  const compFundD5 = getLongLesson('comp_fund', 5);
  assert.ok(compFundD5, 'comp_fund Day 5 must resolve');
  assert.equal(compFundD5.day, 5);
  assert.equal(compFundD5.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(compFundD5);
  const totalMin = estimateLessonMinutes(compFundD5);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < compFundD5.parts.length; i++) {
    const part = compFundD5.parts[i];
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

  // Part 1: Ext4/XFS Filesystem Inodes & Directory Structures
  const res1 = await executeBashSuite(compFundD5.parts[0].code!);
  assert.equal(res1.allPassed, true, 'Part 1 inodes must succeed');
  assert.ok(res1.stdout?.includes('INODE_NUMBER: 1048576'), 'Must display inode number');
  assert.ok(res1.stdout?.includes('HARD_LINK_COUNT: 2'), 'Must display hard link count');

  // Part 2: Page Cache & fsync()
  const res2 = await executeBashSuite(compFundD5.parts[1].code!);
  assert.equal(res2.allPassed, true, 'Part 2 page cache fsync must succeed');
  assert.ok(res2.stdout?.includes('DIRTY_IN_RAM'), 'Must mark dirty in RAM');
  assert.ok(res2.stdout?.includes('DURABLE_ON_NVME_FLASH'), 'Must verify fsync durability');

  // Part 3: Zero-Copy sendfile() & DMA
  const res3 = await executeBashSuite(compFundD5.parts[2].code!);
  assert.equal(res3.allPassed, true, 'Part 3 zero-copy must succeed');
  assert.ok(res3.stdout?.includes('ZERO_COPY_SENDFILE: PAGE_CACHE_TO_NIC_RING'), 'Must trace zero-copy sendfile');
  assert.ok(res3.stdout?.includes('USER_SPACE_COPIES: 0'), 'Must verify 0 user space copies');

  // Part 4: Virtual Memory Mapping via mmap()
  const res4 = await executeBashSuite(compFundD5.parts[3].code!);
  assert.equal(res4.allPassed, true, 'Part 4 mmap must succeed');
  assert.ok(res4.stdout?.includes('VIRTUAL_ADDR_START: 0x7fff5000'), 'Must map virtual memory address');
  assert.ok(res4.stdout?.includes('DEMAND_PAGING: LAZY_PAGE_FAULT_RESOLVED'), 'Must resolve demand paging fault');

  // Part 5: cgroups v2 & Linux Namespaces
  const res5 = await executeBashSuite(compFundD5.parts[4].code!);
  assert.equal(res5.allPassed, true, 'Part 5 containers must succeed');
  assert.ok(res5.stdout?.includes('NAMESPACES: PID_NET_MNT_IPC_UTS_USER'), 'Must declare 6 namespaces');
  assert.ok(res5.stdout?.includes('CONTAINER_ISOLATION: STRICT_KERNEL_ENFORCED'), 'Must verify kernel containment');
});

test('Systems Long Lessons: git_vcs Day 5 Packfiles, fsck Disaster Recovery, ORT & Governance Verification', async () => {
  const gitVcsD5 = getLongLesson('git_vcs', 5);
  assert.ok(gitVcsD5, 'git_vcs Day 5 must resolve');
  assert.equal(gitVcsD5.day, 5);
  assert.equal(gitVcsD5.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(gitVcsD5);
  const totalMin = estimateLessonMinutes(gitVcsD5);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < gitVcsD5.parts.length; i++) {
    const part = gitVcsD5.parts[i];
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

  // Part 1: Packfiles & Delta Compression
  const res1 = await executeBashSuite(gitVcsD5.parts[0].code!);
  assert.equal(res1.allPassed, true, 'Part 1 packfiles must succeed');
  assert.ok(res1.stdout?.includes('DELTA_COMPRESSION_SAVING: 88.4%'), 'Must calculate delta compression savings');
  assert.ok(res1.stdout?.includes('LOOSE_OBJECTS_PACKED: 14200'), 'Must track packed loose objects');

  // Part 2: Disaster Recovery via git fsck
  const res2 = await executeBashSuite(gitVcsD5.parts[1].code!);
  assert.equal(res2.allPassed, true, 'Part 2 fsck disaster recovery must succeed');
  assert.ok(res2.stdout?.includes('DANGLING_COMMIT_FOUND: 7a8b9c0'), 'Must discover dangling commit');
  assert.ok(res2.stdout?.includes('SALVAGE_VERDICT: RECOVERED_INTO_REFS_HEADS_RECOVERY'), 'Must salvage commit into recovery ref');

  // Part 3: Merge Engine ORT & Rerere
  const res3 = await executeBashSuite(gitVcsD5.parts[2].code!);
  assert.equal(res3.allPassed, true, 'Part 3 ORT merge engine must succeed');
  assert.ok(res3.stdout?.includes('RENAME_DETECTION: 100x_SPEEDUP_OVER_RECURSIVE'), 'Must verify ORT rename speedup');
  assert.ok(res3.stdout?.includes('RERERE_ENABLED: RECORDED_RESOLUTION_REUSED'), 'Must verify rerere automated reuse');

  // Part 4: Historical Secret Purging via git-filter-repo
  const res4 = await executeBashSuite(gitVcsD5.parts[3].code!);
  assert.equal(res4.allPassed, true, 'Part 4 secret purging must succeed');
  assert.ok(res4.stdout?.includes('HISTORY_REWRITTEN: 450_COMMITS_CLEANSED'), 'Must rewrite historical commits');
  assert.ok(res4.stdout?.includes('CREDENTIAL_LEAK_STATUS: COMPLETELY_ERADICATED'), 'Must confirm leak eradication');

  // Part 5: Multi-Remote Sync & Force-With-Lease
  const res5 = await executeBashSuite(gitVcsD5.parts[4].code!);
  assert.equal(res5.allPassed, true, 'Part 5 governance must succeed');
  assert.ok(res5.stdout?.includes('PUSH_SAFETY: FORCE_WITH_LEASE_ENFORCED'), 'Must enforce force-with-lease safety');
  assert.ok(res5.stdout?.includes('BRANCH_PROTECTION: TRUNK_BASED_LINEAR_HISTORY'), 'Must verify trunk-based protection');
});

test('Systems Long Lessons: iot_emb Day 4 FreeRTOS Preemption, Canaries, Queues & Priority Inheritance AST Verification', async () => {
  const iotEmbLesson4 = getLongLesson('iot_emb', 4);
  assert.ok(iotEmbLesson4, 'iot_emb Day 4 must resolve');
  assert.equal(iotEmbLesson4.day, 4);
  assert.equal(iotEmbLesson4.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(iotEmbLesson4);
  const totalMin = estimateLessonMinutes(iotEmbLesson4);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < iotEmbLesson4.parts.length; i++) {
    const part = iotEmbLesson4.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.ok(check.options.length >= 3, `Part ${i + 1} check must have at least 3 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics AST verification
  const res1 = await executeCppSuite(iotEmbLesson4.parts[0].code!, 'scheduleFreeRtosTask');
  assert.equal(res1.allPassed, true, 'Part 1 scheduleFreeRtosTask must pass AST analysis');

  const res2 = await executeCppSuite(iotEmbLesson4.parts[1].code!, 'evaluateStackWatermark');
  assert.equal(res2.allPassed, true, 'Part 2 evaluateStackWatermark must pass AST analysis');

  const res3 = await executeCppSuite(iotEmbLesson4.parts[2].code!, 'dispatchQueueMessage');
  assert.equal(res3.allPassed, true, 'Part 3 dispatchQueueMessage must pass AST analysis');

  const res4 = await executeCppSuite(iotEmbLesson4.parts[3].code!, 'resolvePriorityInversion');
  assert.equal(res4.allPassed, true, 'Part 4 resolvePriorityInversion must pass AST analysis');

  const res5 = await executeCppSuite(iotEmbLesson4.parts[4].code!, 'configureTicklessIdle');
  assert.equal(res5.allPassed, true, 'Part 5 configureTicklessIdle must pass AST analysis');
});

test('Systems Long Lessons: iot_emb Day 5 Wireless Networking, BLE GATT & Secure OTA Invariants', async () => {
  const iotEmbLesson5 = getLongLesson('iot_emb', 5);
  assert.ok(iotEmbLesson5, 'iot_emb Day 5 lesson must be resolved');
  assert.equal(iotEmbLesson5.day, 5);
  assert.equal(iotEmbLesson5.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(iotEmbLesson5);
  const totalMin = estimateLessonMinutes(iotEmbLesson5);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < iotEmbLesson5.parts.length; i++) {
    const part = iotEmbLesson5.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.ok(check.options.length >= 3, `Part ${i + 1} check must have at least 3 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics AST verification
  const res1 = await executeCppSuite(iotEmbLesson5.parts[0].code!, 'buildBleAdvPacket');
  assert.equal(res1.allPassed, true, 'Part 1 buildBleAdvPacket must pass AST analysis');

  const res2 = await executeCppSuite(iotEmbLesson5.parts[1].code!, 'handleGattCccdWrite');
  assert.equal(res2.allPassed, true, 'Part 2 handleGattCccdWrite must pass AST analysis');

  const res3 = await executeCppSuite(iotEmbLesson5.parts[3].code!, 'evaluateBootloaderBank');
  assert.equal(res3.allPassed, true, 'Part 4 evaluateBootloaderBank must pass AST analysis');

  const res4 = await executeCppSuite(iotEmbLesson5.parts[2].code!, 'compress6LoWpanHeader');
  assert.equal(res4.allPassed, true, 'Part 3 compress6LoWpanHeader must pass AST analysis');

  const res5 = await executeCppSuite(iotEmbLesson5.parts[4].code!, 'verifyOtaFirmwareSignature');
  assert.equal(res5.allPassed, true, 'Part 5 verifyOtaFirmwareSignature must pass AST analysis');
});

test('Systems Long Lessons: comp_fund Day 6 Process Management & Multitasking Verification', async () => {
  const compFundD6 = getLongLesson('comp_fund', 6);
  assert.ok(compFundD6, 'comp_fund Day 6 must resolve');
  assert.equal(compFundD6.day, 6);
  assert.equal(compFundD6.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(compFundD6);
  const totalMin = estimateLessonMinutes(compFundD6);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < compFundD6.parts.length; i++) {
    const part = compFundD6.parts[i];
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

  // Part 1: PCB & PID
  const res1 = await executeBashSuite(compFundD6.parts[0].code!);
  assert.equal(res1.allPassed, true, 'Part 1 PCB must succeed');
  assert.ok(res1.stdout?.includes('PID: 1042'), 'Must report PID');
  assert.ok(res1.stdout?.includes('TASK_RUNNING'), 'Must report running state');

  // Part 2: Multithreading & Mutex
  const res2 = await executeBashSuite(compFundD6.parts[1].code!);
  assert.equal(res2.allPassed, true, 'Part 2 thread TCB must succeed');
  assert.ok(res2.stdout?.includes('THREAD_ID: T1'), 'Must report thread ID');
  assert.ok(res2.stdout?.includes('MUTEX_LOCK_HELD: LOCK_DB_POOL'), 'Must report mutex lock');

  // Part 3: CPU Scheduling & vruntime
  const res3 = await executeBashSuite(compFundD6.parts[2].code!);
  assert.equal(res3.allPassed, true, 'Part 3 scheduling must succeed');
  assert.ok(res3.stdout?.includes('vruntime='), 'Must report vruntime');

  // Part 4: Context switching & cgroups
  const res4 = await executeBashSuite(compFundD6.parts[3].code!);
  assert.equal(res4.allPassed, true, 'Part 4 cgroups must succeed');
  assert.ok(res4.stdout?.includes('nr_throttled: 142'), 'Must report throttled count');

  // Part 5: SRE Health Index
  const res5 = await executeBashSuite(compFundD6.parts[4].code!);
  assert.equal(res5.allPassed, true, 'Part 5 telemetry audit must succeed');
  assert.ok(res5.stdout?.includes('HEALTH_INDEX: 98/100'), 'Must report health index');
});

test('Systems Long Lessons: comp_fund Day 7 Memory Hierarchy & Caching Verification', async () => {
  const d7 = getLongLesson('comp_fund', 7);
  assert.ok(d7, 'comp_fund Day 7 must resolve');
  assert.equal(d7.day, 7);
  assert.equal(d7.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(d7);
  const totalMin = estimateLessonMinutes(d7);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < d7.parts.length; i++) {
    const part = d7.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} title non-empty`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} say paragraphs >= 3`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} example non-empty`);
    assert.ok(part.code && part.code.length > 0, `Part ${i + 1} code non-empty`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} output non-empty`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} tryIt non-empty`);
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question`);
    assert.ok(check.options.length >= 3, `Part ${i + 1} check options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} check answer`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check why`);
  }

  const res1 = await executeBashSuite(d7.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('MAIN_DRAM'));

  const res2 = await executeBashSuite(d7.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('L1_HIT'));

  const res3 = await executeBashSuite(d7.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('EXCLUSIVE'));

  const res4 = await executeBashSuite(d7.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('TLB_HIT'));

  const res5 = await executeBashSuite(d7.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('MEMORY_HEALTH_INDEX: 99/100'));
});

test('Systems Long Lessons: comp_fund Day 8 Storage Technologies & Data Integrity Verification', async () => {
  const d8 = getLongLesson('comp_fund', 8);
  assert.ok(d8, 'comp_fund Day 8 must resolve');
  assert.equal(d8.day, 8);
  assert.equal(d8.parts.length, 5);

  const res1 = await executeBashSuite(d8.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('BLK_004'));

  const res2 = await executeBashSuite(d8.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('SATURATED_PEAK'));

  const res3 = await executeBashSuite(d8.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('STRIPE_01'));

  const res4 = await executeBashSuite(d8.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('DATA_INTEGRITY_VERIFIED'));

  const res5 = await executeBashSuite(d8.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('STORAGE_HEALTH_INDEX: 99/100'));
});

test('Systems Long Lessons: comp_fund Day 9 Computer Networking & Subnetting Verification', async () => {
  const d9 = getLongLesson('comp_fund', 9);
  assert.ok(d9, 'comp_fund Day 9 must resolve');
  assert.equal(d9.day, 9);
  assert.equal(d9.parts.length, 5);

  const res1 = await executeBashSuite(d9.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('IP_PACKET'));

  const res2 = await executeBashSuite(d9.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('REACHABLE'));

  const res3 = await executeBashSuite(d9.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('172.16.0.0/26'));

  const res4 = await executeBashSuite(d9.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('CNAME'));

  const res5 = await executeBashSuite(d9.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('NETWORK_HEALTH_INDEX: 99/100'));
});

test('Systems Long Lessons: comp_fund Day 10 Web Protocols & TLS 1.3 Verification', async () => {
  const d10 = getLongLesson('comp_fund', 10);
  assert.ok(d10, 'comp_fund Day 10 must resolve');
  assert.equal(d10.day, 10);
  assert.equal(d10.parts.length, 5);

  const res1 = await executeBashSuite(d10.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('LISTEN'));

  const res2 = await executeBashSuite(d10.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('ESTABLISHED'));

  const res3 = await executeBashSuite(d10.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('INTERLEAVED'));

  const res4 = await executeBashSuite(d10.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('APPLICATION_DATA_FLOW'));

  const res5 = await executeBashSuite(d10.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('WEB_HEALTH_INDEX: 99/100'));
});

test('Systems Long Lessons: comp_fund Day 11 Browser DevTools & Web Performance Verification', async () => {
  const d11 = getLongLesson('comp_fund', 11);
  assert.ok(d11, 'comp_fund Day 11 must resolve');
  assert.equal(d11.day, 11);
  assert.equal(d11.parts.length, 5);

  const res1 = await executeBashSuite(d11.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('GPU_ACCELERATED'));

  const res2 = await executeBashSuite(d11.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('DISK_CACHE_HIT'));

  const res3 = await executeBashSuite(d11.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('PROTECTED'));

  const res4 = await executeBashSuite(d11.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('DRAINED_IMMEDIATELY'));

  const res5 = await executeBashSuite(d11.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('FRONTEND_HEALTH_INDEX: 99/100'));
});

