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

test('Systems Long Lessons: comp_fund Day 12 Digital Productivity & OS Ergonomics Verification', async () => {
  const d12 = getLongLesson('comp_fund', 12);
  assert.ok(d12, 'comp_fund Day 12 must resolve');
  assert.equal(d12.day, 12);
  assert.equal(d12.parts.length, 5);

  const res1 = await executeBashSuite(d12.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('TOUCH_TYPING_BENCHMARK_VERIFIED'));

  const res2 = await executeBashSuite(d12.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('HOTKEY_ERGONOMICS_VERIFIED'));

  const res3 = await executeBashSuite(d12.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('TILING_WINDOW_MANAGER_VERIFIED'));

  const res4 = await executeBashSuite(d12.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('CLI_NAVIGATION_EFFICIENCY_VERIFIED'));

  const res5 = await executeBashSuite(d12.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('SOVEREIGN_WORKFLOW_INDEX: 99/100'));
});

test('Systems Long Lessons: comp_fund Day 13 Cloud Storage & Distributed Sync Verification', async () => {
  const d13 = getLongLesson('comp_fund', 13);
  assert.ok(d13, 'comp_fund Day 13 must resolve');
  assert.equal(d13.day, 13);
  assert.equal(d13.parts.length, 5);

  const res1 = await executeBashSuite(d13.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('STORAGE_TIER_MATRIX_VERIFIED'));

  const res2 = await executeBashSuite(d13.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('DIFFERENTIAL_DELTA_COMMITTED'));

  const res3 = await executeBashSuite(d13.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('CONCURRENT_DIVERGENCE_DETECTED'));

  const res4 = await executeBashSuite(d13.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('100% VERIFIED'));

  const res5 = await executeBashSuite(d13.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Health Index:          99/100'));
});

test('Systems Long Lessons: comp_fund Day 14 Data Formats & Encoding Standards Verification', async () => {
  const d14 = getLongLesson('comp_fund', 14);
  assert.ok(d14, 'comp_fund Day 14 must resolve');
  assert.equal(d14.day, 14);
  assert.equal(d14.parts.length, 5);

  const res1 = await executeBashSuite(d14.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('BASE_CONVERSION_VERIFIED'));

  const res2 = await executeBashSuite(d14.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('ASCII_7BIT_STANDARDS_VERIFIED'));

  const res3 = await executeBashSuite(d14.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('UTF8_VARIABLE_LENGTH_STANDARDS_VERIFIED'));

  const res4 = await executeBashSuite(d14.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('SERIALIZATION_BENCHMARK_VERIFIED'));

  const res5 = await executeBashSuite(d14.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Integrity Index:       99/100'));
});

test('Systems Long Lessons: comp_fund Day 15 ⭐ MILESTONE 2 Capstone Verification', async () => {
  const d15 = getLongLesson('comp_fund', 15);
  assert.ok(d15, 'comp_fund Day 15 must resolve');
  assert.equal(d15.day, 15);
  assert.equal(d15.parts.length, 5);

  const res1 = await executeBashSuite(d15.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('MEMORY_HIERARCHY_VERIFIED'));

  const res2 = await executeBashSuite(d15.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('NETWORK_STACK_VERIFIED'));

  const res3 = await executeBashSuite(d15.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('WEB_PERFORMANCE_VERIFIED'));

  const res4 = await executeBashSuite(d15.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('PERSISTENCE_ENCODING_VERIFIED'));

  const res5 = await executeBashSuite(d15.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Full-Stack Health:     100/100'));
});

test('Systems Long Lessons: comp_fund Day 16 Information Security & Digital Hygiene Verification', async () => {
  const d16 = getLongLesson('comp_fund', 16);
  assert.ok(d16, 'comp_fund Day 16 must resolve');
  assert.equal(d16.day, 16);
  assert.equal(d16.parts.length, 5);

  const res1 = await executeBashSuite(d16.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('CIA_TRIAD_VERIFIED'));

  const res2 = await executeBashSuite(d16.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('SHANNON_ENTROPY_VERIFIED'));

  const res3 = await executeBashSuite(d16.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('SALTED_HASHING_VERIFIED'));

  const res4 = await executeBashSuite(d16.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('TOTP_RFC6238_ENGINE_VERIFIED'));

  const res5 = await executeBashSuite(d16.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Hygiene Index:         100/100'));
});

test('Systems Long Lessons: comp_fund Day 17 Operating System Security & Firewall Verification', async () => {
  const d17 = getLongLesson('comp_fund', 17);
  assert.ok(d17, 'comp_fund Day 17 must resolve');
  assert.equal(d17.day, 17);
  assert.equal(d17.parts.length, 5);

  const res1 = await executeBashSuite(d17.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('UAC_PRIVILEGE_BOUNDARY_VERIFIED'));

  const res2 = await executeBashSuite(d17.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('SUDO_PRIVILEGE_DELEGATION_VERIFIED'));

  const res3 = await executeBashSuite(d17.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('HOST_FIREWALL_SPI_VERIFIED'));

  const res4 = await executeBashSuite(d17.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('MANDATORY_ACCESS_CONTROL_VERIFIED'));

  const res5 = await executeBashSuite(d17.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Security Health Index: 100/100'));
});

test('Systems Long Lessons: comp_fund Day 18 Cryptography Fundamentals Verification', async () => {
  const d18 = getLongLesson('comp_fund', 18);
  assert.ok(d18, 'comp_fund Day 18 must resolve');
  assert.equal(d18.day, 18);
  assert.equal(d18.parts.length, 5);

  const res1 = await executeBashSuite(d18.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('AES256_GCM_AUTHENTICATED_ENCRYPTION_VERIFIED'));

  const res2 = await executeBashSuite(d18.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('ASYMMETRIC_CRYPTOGRAPHY_VERIFIED'));

  const res3 = await executeBashSuite(d18.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('OPENSSH_KEY_AUTHENTICATION_VERIFIED'));

  const res4 = await executeBashSuite(d18.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('PKI_CERTIFICATE_AUTHORITY_VERIFIED'));

  const res5 = await executeBashSuite(d18.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Crypto Health Index:     100/100'));
});

test('Systems Long Lessons: comp_fund Day 19 Hardware Peripherals & Display Interfaces Verification', async () => {
  const d19 = getLongLesson('comp_fund', 19);
  assert.ok(d19, 'comp_fund Day 19 must resolve');
  assert.equal(d19.day, 19);
  assert.equal(d19.parts.length, 5);

  const res1 = await executeBashSuite(d19.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('USB4_THUNDERBOLT4_TUNNELING_VERIFIED'));

  const res2 = await executeBashSuite(d19.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('DISPLAY_INTERFACE_BANDWIDTH_VERIFIED'));

  const res3 = await executeBashSuite(d19.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('PCIE_IOMMU_DMA_PROTECTION_VERIFIED'));

  const res4 = await executeBashSuite(d19.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('USB_PD_EPR_POWER_DELIVERY_VERIFIED'));

  const res5 = await executeBashSuite(d19.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Peripheral Health Index: 100/100'));
});

test('Systems Long Lessons: comp_fund Day 20 Software Installation & Package Managers Verification', async () => {
  const d20 = getLongLesson('comp_fund', 20);
  assert.ok(d20, 'comp_fund Day 20 must resolve');
  assert.equal(d20.day, 20);
  assert.equal(d20.parts.length, 5);

  const res1 = await executeBashSuite(d20.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('PACKAGE_DEPENDENCY_GRAPH_VERIFIED'));

  const res2 = await executeBashSuite(d20.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('APT_PACKAGE_ECOSYSTEM_VERIFIED'));

  const res3 = await executeBashSuite(d20.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('CROSS_PLATFORM_PACKAGE_MANAGEMENT_VERIFIED'));

  const res4 = await executeBashSuite(d20.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('PATH_PRECEDENCE_RESOLUTION_VERIFIED'));

  const res5 = await executeBashSuite(d20.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Package Health Index:    100/100'));
});

test('Systems Long Lessons: comp_fund Day 21 Milestone 3 Capstone Verification', async () => {
  const d21 = getLongLesson('comp_fund', 21);
  assert.ok(d21, 'comp_fund Day 21 must resolve');
  assert.equal(d21.day, 21);
  assert.equal(d21.parts.length, 5);

  const res1 = await executeBashSuite(d21.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('MILESTONE3_HOST_DEFENSE_VERIFIED'));

  const res2 = await executeBashSuite(d21.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('MILESTONE3_CRYPTOGRAPHIC_ENGINE_VERIFIED'));

  const res3 = await executeBashSuite(d21.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('MILESTONE3_PERIPHERAL_BUS_VERIFIED'));

  const res4 = await executeBashSuite(d21.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('MILESTONE3_ENVIRONMENT_PACKAGING_VERIFIED'));

  const res5 = await executeBashSuite(d21.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Milestone 3 Health:    100/100'));
});

test('Systems Long Lessons: comp_fund Day 22 Virtualization & Container Isolation Verification', async () => {
  const d22 = getLongLesson('comp_fund', 22);
  assert.ok(d22, 'comp_fund Day 22 must resolve');
  assert.equal(d22.day, 22);
  assert.equal(d22.parts.length, 5);

  const res1 = await executeBashSuite(d22.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('VIRTUALIZATION_CONTAINER_ISOLATION_VERIFIED'));

  const res2 = await executeBashSuite(d22.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('LINUX_KERNEL_NAMESPACES_CGROUPS_VERIFIED'));

  const res3 = await executeBashSuite(d22.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('OVERLAYFS_CONTAINER_LAYERING_VERIFIED'));

  const res4 = await executeBashSuite(d22.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('CONTAINER_SECURITY_BOUNDARY_VERIFIED'));

  const res5 = await executeBashSuite(d22.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Virtualization Health: 100/100'));
});

test('Systems Long Lessons: comp_fund Day 23 Troubleshooting & Diagnostic Methodology Verification', async () => {
  const d23 = getLongLesson('comp_fund', 23);
  assert.ok(d23, 'comp_fund Day 23 must resolve');
  assert.equal(d23.day, 23);
  assert.equal(d23.parts.length, 5);

  const res1 = await executeBashSuite(d23.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('SEVEN_STEP_TROUBLESHOOTING_VERIFIED'));

  const res2 = await executeBashSuite(d23.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('DIVIDE_AND_CONQUER_ISOLATION_VERIFIED'));

  const res3 = await executeBashSuite(d23.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('ACTION_PLAN_ROLLBACK_VERIFIED'));

  const res4 = await executeBashSuite(d23.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('PREVENTATIVE_CONTROLS_VERIFIED'));

  const res5 = await executeBashSuite(d23.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Troubleshooting Health Index: 100/100'));
});

test('Systems Long Lessons: comp_fund Day 24 Automation Scripting & Cron Scheduling Verification', async () => {
  const d24 = getLongLesson('comp_fund', 24);
  assert.ok(d24, 'comp_fund Day 24 must resolve');
  assert.equal(d24.day, 24);
  assert.equal(d24.parts.length, 5);

  const res1 = await executeBashSuite(d24.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('POSIX_EXIT_CODE_EVALUATION_VERIFIED'));

  const res2 = await executeBashSuite(d24.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('DETERMINISTIC_CONTROL_FLOW_VERIFIED'));

  const res3 = await executeBashSuite(d24.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('UNIX_CRON_SCHEDULER_VERIFIED'));

  const res4 = await executeBashSuite(d24.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('PRODUCTION_LOGGING_LOCKFILE_VERIFIED'));

  const res5 = await executeBashSuite(d24.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Automation Health Index: 100/100'));
});

test('Systems Long Lessons: comp_fund Day 25 Office Productivity & Spreadsheet Architecture Verification', async () => {
  const d25 = getLongLesson('comp_fund', 25);
  assert.ok(d25, 'comp_fund Day 25 must resolve');
  assert.equal(d25.day, 25);
  assert.equal(d25.parts.length, 5);

  const res1 = await executeBashSuite(d25.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('SPREADSHEET_PRODUCTIVITY_VERIFIED'));

  const res2 = await executeBashSuite(d25.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('RELATIONAL_LOOKUP_ALGORITHMS_VERIFIED'));

  const res3 = await executeBashSuite(d25.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('DYNAMIC_ARRAY_SPILL_ENGINE_VERIFIED'));

  const res4 = await executeBashSuite(d25.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('SPREADSHEET_DATA_HYGIENE_VERIFIED'));

  const res5 = await executeBashSuite(d25.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Spreadsheet Health Index: 100/100'));
});

test('Systems Long Lessons: comp_fund Day 26 Data Privacy & VPN Tunnel Verification', async () => {
  const d26 = getLongLesson('comp_fund', 26);
  assert.ok(d26, 'comp_fund Day 26 must resolve');
  assert.equal(d26.day, 26);
  assert.equal(d26.parts.length, 5);

  const res1 = await executeBashSuite(d26.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('DATA_PRIVACY_VPN_DOH_VERIFIED'));

  const res2 = await executeBashSuite(d26.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('ENCRYPTED_DOMAIN_RESOLUTION_VERIFIED'));

  const res3 = await executeBashSuite(d26.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('WIREGUARD_VPN_TUNNEL_VERIFIED'));

  const res4 = await executeBashSuite(d26.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('WEB_TRACKING_MITIGATION_VERIFIED'));

  const res5 = await executeBashSuite(d26.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Data Privacy Health Index: 100/100'));
});
test('Systems Long Lessons: comp_fund Day 27 Remote Work & Collaboration Infrastructure Verification', async () => {
  const d27 = getLongLesson('comp_fund', 27);
  assert.ok(d27, 'comp_fund Day 27 must resolve');
  assert.equal(d27.day, 27);
  assert.equal(d27.parts.length, 5);

  const res1 = await executeBashSuite(d27.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('REMOTE_WORK_INFRASTRUCTURE_VERIFIED'));

  const res2 = await executeBashSuite(d27.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('SSH_PORT_FORWARDING_TUNNELS_VERIFIED'));

  const res3 = await executeBashSuite(d27.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('CLOUD_VDI_COLLABORATION_VERIFIED'));

  const res4 = await executeBashSuite(d27.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('ZERO_TRUST_NETWORK_ACCESS_VERIFIED'));

  const res5 = await executeBashSuite(d27.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Remote Work Health Index: 100/100'));
});

test('Systems Long Lessons: comp_fund Day 28 Hardware Maintenance, Thermals & UPS Power Verification', async () => {
  const d28 = getLongLesson('comp_fund', 28);
  assert.ok(d28, 'comp_fund Day 28 must resolve');
  assert.equal(d28.day, 28);
  assert.equal(d28.parts.length, 5);

  const res1 = await executeBashSuite(d28.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('CPU_THERMAL_SAFETY_MARGIN_VERIFIED'));

  const res2 = await executeBashSuite(d28.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('THERMAL_THROTTLING_MITIGATION_VERIFIED'));

  const res3 = await executeBashSuite(d28.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('PSU_80_PLUS_EFFICIENCY_VERIFIED'));

  const res4 = await executeBashSuite(d28.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('UPS_BATTERY_BACKUP_VERIFIED'));

  const res5 = await executeBashSuite(d28.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Hardware Reliability Index: 100/100'));
});

test('Systems Long Lessons: comp_fund Day 29 Sustainable Computing & Data Sanitization Verification', async () => {
  const d29 = getLongLesson('comp_fund', 29);
  assert.ok(d29, 'comp_fund Day 29 must resolve');
  assert.equal(d29.day, 29);
  assert.equal(d29.parts.length, 5);

  const res1 = await executeBashSuite(d29.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('DATA_REMANENCE_THREAT_VERIFIED'));

  const res2 = await executeBashSuite(d29.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('DOD_5220_22_M_SANITIZATION_VERIFIED'));

  const res3 = await executeBashSuite(d29.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('SSD_CRYPTOGRAPHIC_ERASURE_VERIFIED'));

  const res4 = await executeBashSuite(d29.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('NIST_800_88_EWASTE_STEWARDSHIP_VERIFIED'));

  const res5 = await executeBashSuite(d29.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Sanitization & Sustainability Index: 100/100'));
});

test('Systems Long Lessons: comp_fund Day 30 🏆 GRAND FINAL CAPSTONE: Sovereign Computer Literacy & OS Master Suite Verification', async () => {
  const d30 = getLongLesson('comp_fund', 30);
  assert.ok(d30, 'comp_fund Day 30 must resolve');
  assert.equal(d30.day, 30);
  assert.equal(d30.parts.length, 5);

  const res1 = await executeBashSuite(d30.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('COMPUTING_FOUNDATIONS_SYNTHESIS_VERIFIED'));

  const res2 = await executeBashSuite(d30.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('SYSTEMS_NETWORKING_STORAGE_SYNTHESIS_VERIFIED'));

  const res3 = await executeBashSuite(d30.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('SECURITY_CRYPTOGRAPHY_PERIPHERALS_SYNTHESIS_VERIFIED'));

  const res4 = await executeBashSuite(d30.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('WORKFLOWS_VIRTUALIZATION_PRIVACY_SYNTHESIS_VERIFIED'));

  const res5 = await executeBashSuite(d30.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('SOVEREIGN_SYSTEMS_MASTER_CAPSTONE_VERIFIED'));
  assert.ok(res5.stdout?.includes('GRAND_CAPSTONE_HEALTH: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 6 File Ignoring & Repository Hygiene Verification', async () => {
  const d6 = getLongLesson('git_vcs', 6);
  assert.ok(d6, 'git_vcs Day 6 must resolve');
  assert.equal(d6.day, 6);
  assert.equal(d6.parts.length, 5);

  const res1 = await executeBashSuite(d6.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('GITIGNORE_PATTERN_MATCHING_VERIFIED'));

  const res2 = await executeBashSuite(d6.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('GIT_RM_CACHED_UNTRACKING_VERIFIED'));

  const res3 = await executeBashSuite(d6.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('DIRECTORY_SLASH_ANCHORING_VERIFIED'));

  const res4 = await executeBashSuite(d6.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('REPOSITORY_EXCLUSION_HIERARCHY_VERIFIED'));

  const res5 = await executeBashSuite(d6.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Repository Hygiene Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 7 Undoing Local Changes, Restore, Amend & Reset Verification', async () => {
  const d7 = getLongLesson('git_vcs', 7);
  assert.ok(d7, 'git_vcs Day 7 must resolve');
  assert.equal(d7.day, 7);
  assert.equal(d7.parts.length, 5);

  const res1 = await executeBashSuite(d7.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('GIT_RESTORE_OPERATIONS_VERIFIED'));

  const res2 = await executeBashSuite(d7.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('GIT_COMMIT_AMEND_VERIFIED'));

  const res3 = await executeBashSuite(d7.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('GIT_CLEAN_UNTRACKED_VERIFIED'));

  const res4 = await executeBashSuite(d7.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('GIT_REVERT_AND_RESET_VERIFIED'));

  const res5 = await executeBashSuite(d7.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Local Undo Health Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 8 Git History Inspection, Topology Visualization & Pickaxe Verification', async () => {
  const d8 = getLongLesson('git_vcs', 8);
  assert.ok(d8, 'git_vcs Day 8 must resolve');
  assert.equal(d8.day, 8);
  assert.equal(d8.parts.length, 5);

  const res1 = await executeBashSuite(d8.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('GIT_PICKAXE_AUDIT_VERIFIED'));

  const res2 = await executeBashSuite(d8.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('GIT_TOPOLOGY_VISUALIZATION_VERIFIED'));

  const res3 = await executeBashSuite(d8.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('GIT_METADATA_INSPECTION_VERIFIED'));

  const res4 = await executeBashSuite(d8.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('GIT_BLAME_AND_LINE_TRACE_VERIFIED'));

  const res5 = await executeBashSuite(d8.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Git History Inspection Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 9 Git Branching Architecture, Fast-Forward & Detached HEAD Verification', async () => {
  const d9 = getLongLesson('git_vcs', 9);
  assert.ok(d9, 'git_vcs Day 9 must resolve');
  assert.equal(d9.day, 9);
  assert.equal(d9.parts.length, 5);

  const res1 = await executeBashSuite(d9.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('BRANCH_POINTER_ADVANCEMENT_VERIFIED'));

  const res2 = await executeBashSuite(d9.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('FAST_FORWARD_MERGE_VERIFIED'));

  const res3 = await executeBashSuite(d9.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('GIT_SWITCH_OPERATIONS_VERIFIED'));

  const res4 = await executeBashSuite(d9.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('DETACHED_HEAD_SALVAGE_VERIFIED'));

  const res5 = await executeBashSuite(d9.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Branching Architecture Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 10 ⭐ MILESTONE 2 Capstone: 3-Way Merge Mechanics, Topology & ORT Verification', async () => {
  const d10 = getLongLesson('git_vcs', 10);
  assert.ok(d10, 'git_vcs Day 10 must resolve');
  assert.equal(d10.day, 10);
  assert.equal(d10.parts.length, 5);

  const res1 = await executeBashSuite(d10.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('THREE_WAY_MERGE_COMMIT_VERIFIED'));

  const res2 = await executeBashSuite(d10.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('CONFLICT_RESOLUTION_MECHANICS_VERIFIED'));

  const res3 = await executeBashSuite(d10.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('NO_FF_TOPOLOGY_PRESERVATION_VERIFIED'));

  const res4 = await executeBashSuite(d10.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('GIT_MERGE_ABORT_VERIFIED'));

  const res5 = await executeBashSuite(d10.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Merge Architecture Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 11 Merge Conflict Detection, Index Stages & zdiff3 Verification', async () => {
  const d11 = getLongLesson('git_vcs', 11);
  assert.ok(d11, 'git_vcs Day 11 must resolve');
  assert.equal(d11.day, 11);
  assert.equal(d11.parts.length, 5);

  const res1 = await executeBashSuite(d11.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('CONFLICT_MARKERS_ANATOMY_VERIFIED'));

  const res2 = await executeBashSuite(d11.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('UNMERGED_INDEX_STAGES_VERIFIED'));

  const res3 = await executeBashSuite(d11.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('CLEAN_CONFLICT_SYNTHESIS_VERIFIED'));

  const res4 = await executeBashSuite(d11.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('ZDIFF3_COMMON_ANCESTOR_VERIFIED'));

  const res5 = await executeBashSuite(d11.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Merge Conflict Resolution Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 12 Git Stash LIFO Stack, Untracked & Branch Recovery Verification', async () => {
  const d12 = getLongLesson('git_vcs', 12);
  assert.ok(d12, 'git_vcs Day 12 must resolve');
  assert.equal(d12.day, 12);
  assert.equal(d12.parts.length, 5);

  const res1 = await executeBashSuite(d12.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('GIT_STASH_LIFO_STACK_VERIFIED'));

  const res2 = await executeBashSuite(d12.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('STASH_POP_VS_APPLY_VERIFIED'));

  const res3 = await executeBashSuite(d12.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('STASH_UNTRACKED_AND_ALL_VERIFIED'));

  const res4 = await executeBashSuite(d12.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('PARTIAL_STASH_AND_BRANCH_VERIFIED'));

  const res5 = await executeBashSuite(d12.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Git Stash Architecture Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 13 Git Tagging & Release Management: Lightweight, Annotated & SemVer Verification', async () => {
  const d13 = getLongLesson('git_vcs', 13);
  assert.ok(d13, 'git_vcs Day 13 must resolve');
  assert.equal(d13.day, 13);
  assert.equal(d13.parts.length, 5);

  const res1 = await executeBashSuite(d13.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('LIGHTWEIGHT_VS_ANNOTATED_TAG_VERIFIED'));

  const res2 = await executeBashSuite(d13.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('SEMVER_SPECIFICATION_VERIFIED'));

  const res3 = await executeBashSuite(d13.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('CRYPTOGRAPHIC_TAG_SIGNATURE_VERIFIED'));

  const res4 = await executeBashSuite(d13.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('REMOTE_TAG_SYNCHRONIZATION_VERIFIED'));

  const res5 = await executeBashSuite(d13.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Git Tagging & Release Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 14 Time-Travel & Reset Modes: Soft, Mixed, Hard & Reflog Verification', async () => {
  const d14 = getLongLesson('git_vcs', 14);
  assert.ok(d14, 'git_vcs Day 14 must resolve');
  assert.equal(d14.day, 14);
  assert.equal(d14.parts.length, 5);

  const res1 = await executeBashSuite(d14.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('RESET_SOFT_MODE_VERIFIED'));

  const res2 = await executeBashSuite(d14.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('RESET_MIXED_MODE_VERIFIED'));

  const res3 = await executeBashSuite(d14.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('RESET_HARD_DESTRUCTIVE_VERIFIED'));

  const res4 = await executeBashSuite(d14.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('REFLOG_DISASTER_RECOVERY_VERIFIED'));

  const res5 = await executeBashSuite(d14.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Reset & Reflog Recovery Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 15 ⭐ MILESTONE 2 CAPSTONE: Intermediate Git Concurrency & Recovery Engine Verification', async () => {
  const d15 = getLongLesson('git_vcs', 15);
  assert.ok(d15, 'git_vcs Day 15 must resolve');
  assert.equal(d15.day, 15);
  assert.equal(d15.parts.length, 5);

  const res1 = await executeBashSuite(d15.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('BRANCH_POINTER_DAG_SYNTHESIS_VERIFIED'));

  const res2 = await executeBashSuite(d15.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('THREE_WAY_MERGE_BASE_SYNTHESIS_VERIFIED'));

  const res3 = await executeBashSuite(d15.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('CONFLICT_RESOLUTION_ZERO_ARTIFACT_VERIFIED'));

  const res4 = await executeBashSuite(d15.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('STASH_LIFO_AND_REFLOG_SALVAGE_VERIFIED'));

  const res5 = await executeBashSuite(d15.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Milestone 2 Intermediate Index: 100/100'));
});


