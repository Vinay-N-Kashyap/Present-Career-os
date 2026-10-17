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

test('Systems Long Lessons: git_vcs Day 16 Rebase vs Merge Architecture: Linear History Mechanics Verification', async () => {
  const d16 = getLongLesson('git_vcs', 16);
  assert.ok(d16, 'git_vcs Day 16 must resolve');
  assert.equal(d16.day, 16);
  assert.equal(d16.parts.length, 5);

  const res1 = await executeBashSuite(d16.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('REBASE_DAG_REPLAY_VERIFIED'));

  const res2 = await executeBashSuite(d16.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('REBASE_VS_MERGE_CHRONOLOGY_VERIFIED'));

  const res3 = await executeBashSuite(d16.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('GOLDEN_RULE_OF_REBASING_VERIFIED'));

  const res4 = await executeBashSuite(d16.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('REBASE_CONFLICT_RESOLUTION_VERIFIED'));

  const res5 = await executeBashSuite(d16.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Linear Rebase Architecture Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 17 Interactive Rebasing (`git rebase -i`): Squashing, Rewording & Dropping Verification', async () => {
  const d17 = getLongLesson('git_vcs', 17);
  assert.ok(d17, 'git_vcs Day 17 must resolve');
  assert.equal(d17.day, 17);
  assert.equal(d17.parts.length, 5);

  const res1 = await executeBashSuite(d17.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('INTERACTIVE_TODO_GRAMMAR_VERIFIED'));

  const res2 = await executeBashSuite(d17.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('SQUASH_AND_FIXUP_CONSOLIDATION_VERIFIED'));

  const res3 = await executeBashSuite(d17.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('REWORD_AND_DROP_PURGE_VERIFIED'));

  const res4 = await executeBashSuite(d17.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('EDIT_SPLIT_AND_EXEC_VERIFIED'));

  const res5 = await executeBashSuite(d17.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Interactive Rebasing Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 18 Cherry-Picking & Selective Patching: `git cherry-pick <sha>` & Hotfixes Verification', async () => {
  const d18 = getLongLesson('git_vcs', 18);
  assert.ok(d18, 'git_vcs Day 18 must resolve');
  assert.equal(d18.day, 18);
  assert.equal(d18.parts.length, 5);

  const res1 = await executeBashSuite(d18.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('CHERRY_PICK_MECHANICS_VERIFIED'));

  const res2 = await executeBashSuite(d18.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('HOTFIX_BACKPORTING_VERIFIED'));

  const res3 = await executeBashSuite(d18.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('CHERRY_PICK_RANGES_AND_TRACE_VERIFIED'));

  const res4 = await executeBashSuite(d18.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('CHERRY_PICK_CONFLICTS_VERIFIED'));

  const res5 = await executeBashSuite(d18.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Cherry-Pick & Patching Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 19 Remote Repositories & Protocol Mechanics: HTTPS, SSH Keys & Remote Management Verification', async () => {
  const d19 = getLongLesson('git_vcs', 19);
  assert.ok(d19, 'git_vcs Day 19 must resolve');
  assert.equal(d19.day, 19);
  assert.equal(d19.parts.length, 5);

  const res1 = await executeBashSuite(d19.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('REMOTE_CONFIG_AND_REFS_VERIFIED'));

  const res2 = await executeBashSuite(d19.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('HTTPS_VS_SSH_PROTOCOLS_VERIFIED'));

  const res3 = await executeBashSuite(d19.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('MULTI_REMOTE_ORCHESTRATION_VERIFIED'));

  const res4 = await executeBashSuite(d19.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('REMOTE_MANAGEMENT_PLUMBING_VERIFIED'));

  const res5 = await executeBashSuite(d19.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Remote Architecture Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 20 Remote Synchronization Workflow: `git fetch`, `git pull --rebase` & Upstream Tracking Verification', async () => {
  const d20 = getLongLesson('git_vcs', 20);
  assert.ok(d20, 'git_vcs Day 20 must resolve');
  assert.equal(d20.day, 20);
  assert.equal(d20.parts.length, 5);

  const res1 = await executeBashSuite(d20.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('GIT_FETCH_NON_DESTRUCTIVE_VERIFIED'));

  const res2 = await executeBashSuite(d20.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('UPSTREAM_BRANCH_TRACKING_VERIFIED'));

  const res3 = await executeBashSuite(d20.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('PULL_MERGE_BUBBLES_VERIFIED'));

  const res4 = await executeBashSuite(d20.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('PULL_REBASE_LINEAR_SYNC_VERIFIED'));

  const res5 = await executeBashSuite(d20.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Remote Synchronization Index: 100/100'));
});
test('Systems Long Lessons: git_vcs Day 21 ⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine Verification', async () => {
  const d21 = getLongLesson('git_vcs', 21);
  assert.ok(d21, 'git_vcs Day 21 must resolve');
  assert.equal(d21.day, 21);
  assert.equal(d21.parts.length, 5);

  const res1 = await executeBashSuite(d21.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('LINEAR_REBASE_REPLAY_SYNTHESIS_VERIFIED'));

  const res2 = await executeBashSuite(d21.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('INTERACTIVE_SQUASH_CONSOLIDATION_VERIFIED'));

  const res3 = await executeBashSuite(d21.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('CHERRY_PICK_PATCH_APPLICATION_VERIFIED'));

  const res4 = await executeBashSuite(d21.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('SSH_ED25519_REMOTE_HYGIENE_VERIFIED'));

  const res5 = await executeBashSuite(d21.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Milestone 3 Advanced Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 22 GitHub Collaboration & Pull Request (PR) Lifecycle: Forking vs Branching Models Verification', async () => {
  const d22 = getLongLesson('git_vcs', 22);
  assert.ok(d22, 'git_vcs Day 22 must resolve');
  assert.equal(d22.day, 22);
  assert.equal(d22.parts.length, 5);

  const res1 = await executeBashSuite(d22.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('COLLABORATION_MODELS_CONTRASTED_VERIFIED'));

  const res2 = await executeBashSuite(d22.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('PR_LIFECYCLE_ANATOMY_VERIFIED'));

  const res3 = await executeBashSuite(d22.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('PR_DESCRIPTION_AND_LINKING_VERIFIED'));

  const res4 = await executeBashSuite(d22.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('CODEOWNERS_AND_REVIEWER_ORCHESTRATION_VERIFIED'));

  const res5 = await executeBashSuite(d22.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('GitHub Collaboration Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 23 Code Review Best Practices: Reviewing Diffs, Inline Comments & LGTM Approvals Verification', async () => {
  const d23 = getLongLesson('git_vcs', 23);
  assert.ok(d23, 'git_vcs Day 23 must resolve');
  assert.equal(d23.day, 23);
  assert.equal(d23.parts.length, 5);

  const res1 = await executeBashSuite(d23.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('DIFF_VIEWING_AND_NAVIGATION_VERIFIED'));

  const res2 = await executeBashSuite(d23.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('ACTIONABLE_INLINE_COMMENTS_VERIFIED'));

  const res3 = await executeBashSuite(d23.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('GITHUB_SUGGESTED_CHANGES_VERIFIED'));

  const res4 = await executeBashSuite(d23.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('REVIEW_VERDICTS_AND_LGTM_VERIFIED'));

  const res5 = await executeBashSuite(d23.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Code Review Mastery Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 24 GitHub Branch Protection Rules: Required CI Status Checks & Protected main Verification', async () => {
  const d24 = getLongLesson('git_vcs', 24);
  assert.ok(d24, 'git_vcs Day 24 must resolve');
  assert.equal(d24.day, 24);
  assert.equal(d24.parts.length, 5);

  const res1 = await executeBashSuite(d24.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('PROTECTED_BRANCH_RULES_VERIFIED'));

  const res2 = await executeBashSuite(d24.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('REQUIRED_PR_REVIEWS_AND_CODEOWNERS_VERIFIED'));

  const res3 = await executeBashSuite(d24.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('REQUIRED_STATUS_CHECKS_VERIFIED'));

  const res4 = await executeBashSuite(d24.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('FORCE_PUSH_BLOCKING_AND_BYPASS_VERIFIED'));

  const res5 = await executeBashSuite(d24.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Branch Governance Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 25 Git Workflows & Branching Strategies: Trunk-Based Development vs GitFlow Verification', async () => {
  const d25 = getLongLesson('git_vcs', 25);
  assert.ok(d25, 'git_vcs Day 25 must resolve');
  assert.equal(d25.day, 25);
  assert.equal(d25.parts.length, 5);

  const res1 = await executeBashSuite(d25.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('TRUNK_BASED_DEVELOPMENT_VERIFIED'));

  const res2 = await executeBashSuite(d25.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('FEATURE_FLAGS_ARCHITECTURE_VERIFIED'));

  const res3 = await executeBashSuite(d25.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('GITFLOW_BRANCHING_STRATEGY_VERIFIED'));

  const res4 = await executeBashSuite(d25.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('STRATEGY_SELECTION_RUBRIC_VERIFIED'));

  const res5 = await executeBashSuite(d25.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Branching Strategy Index: 100/100'));
});
test('Systems Long Lessons: git_vcs Day 26 GitHub Issues, Milestones & Project Boards: Agile Kanban Workflow Tracking Verification', async () => {
  const d26 = getLongLesson('git_vcs', 26);
  assert.ok(d26, 'git_vcs Day 26 must resolve');
  assert.equal(d26.day, 26);
  assert.equal(d26.parts.length, 5);

  const res1 = await executeBashSuite(d26.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('GITHUB_ISSUES_ARCHITECTURE_VERIFIED'));

  const res2 = await executeBashSuite(d26.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('LABEL_TAXONOMY_GOVERNANCE_VERIFIED'));

  const res3 = await executeBashSuite(d26.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('MILESTONES_BURNDOWN_VELOCITY_VERIFIED'));

  const res4 = await executeBashSuite(d26.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('KANBAN_PROJECT_AUTOMATION_VERIFIED'));

  const res5 = await executeBashSuite(d26.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Agile Tracking Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 27 GitHub Actions CI/CD Basics: Automated Workflow Pipelines (.github/workflows) Verification', async () => {
  const d27 = getLongLesson('git_vcs', 27);
  assert.ok(d27, 'git_vcs Day 27 must resolve');
  assert.equal(d27.day, 27);
  assert.equal(d27.parts.length, 5);

  const res1 = await executeBashSuite(d27.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('ACTIONS_EVENT_RUNNER_ARCHITECTURE_VERIFIED'));

  const res2 = await executeBashSuite(d27.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('WORKFLOW_YAML_ANATOMY_VERIFIED'));

  const res3 = await executeBashSuite(d27.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('ACTIONS_CACHE_SIMULATION_VERIFIED'));

  const res4 = await executeBashSuite(d27.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('MATRIX_STRATEGY_PARITY_VERIFIED'));

  const res5 = await executeBashSuite(d27.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Actions CI/CD Pipeline Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 28 Git Submodules & Monorepo Multi-Package Management: git submodule Mechanics Verification', async () => {
  const d28 = getLongLesson('git_vcs', 28);
  assert.ok(d28, 'git_vcs Day 28 must resolve');
  assert.equal(d28.day, 28);
  assert.equal(d28.parts.length, 5);

  const res1 = await executeBashSuite(d28.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('SUBMODULE_ARCHITECTURE_VERIFIED'));

  const res2 = await executeBashSuite(d28.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('SUBMODULE_ADD_AND_RECORD_VERIFIED'));

  const res3 = await executeBashSuite(d28.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('CLONE_RECURSIVE_SUBMODULES_VERIFIED'));

  const res4 = await executeBashSuite(d28.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('SUBMODULE_PINNING_AND_UPDATE_VERIFIED'));

  const res5 = await executeBashSuite(d28.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Submodule Architecture Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 29 Git Hooks & Automated Pre-Commit Linting: Husky, Lint-Staged & Commitlint Verification', async () => {
  const d29 = getLongLesson('git_vcs', 29);
  assert.ok(d29, 'git_vcs Day 29 must resolve');
  assert.equal(d29.day, 29);
  assert.equal(d29.parts.length, 5);

  const res1 = await executeBashSuite(d29.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('GIT_HOOKS_ARCHITECTURE_VERIFIED'));

  const res2 = await executeBashSuite(d29.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('HUSKY_HOOK_MANAGEMENT_VERIFIED'));

  const res3 = await executeBashSuite(d29.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('LINT_STAGED_TARGETED_EXECUTION_VERIFIED'));

  const res4 = await executeBashSuite(d29.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('COMMITLINT_GOVERNANCE_VERIFIED'));

  const res5 = await executeBashSuite(d29.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Automated Linting & Hook Governance Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 30 🏆 FINAL CAPSTONE: Sovereign Git, GitHub & Master Version Control Suite Verification', async () => {
  const d30 = getLongLesson('git_vcs', 30);
  assert.ok(d30, 'git_vcs Day 30 must resolve');
  assert.equal(d30.day, 30);
  assert.equal(d30.parts.length, 5);

  const res1 = await executeBashSuite(d30.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('PILLAR1_FOUNDATIONS_VERIFIED'));

  const res2 = await executeBashSuite(d30.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('PILLAR2_BRANCHING_AND_RECOVERY_VERIFIED'));

  const res3 = await executeBashSuite(d30.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('PILLAR3_HISTORY_AND_REMOTES_VERIFIED'));

  const res4 = await executeBashSuite(d30.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('PILLAR4_COLLABORATION_AND_GOVERNANCE_VERIFIED'));

  const res5 = await executeBashSuite(d30.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Master Version Control Sovereign Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 31 Packfiles & Pack Indices: .pack and .idx Binary Layout, Fan-Out Tables & Delta Compression', async () => {
  const d31 = getLongLesson('git_vcs', 31);
  assert.ok(d31, 'git_vcs Day 31 must resolve');
  assert.equal(d31.day, 31);
  assert.equal(d31.parts.length, 5);

  const res1 = await executeBashSuite(d31.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('PACKFILE_SIGNATURE: PACK'));

  const res2 = await executeBashSuite(d31.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res1.stdout?.includes('PACKFILE_SIGNATURE: PACK'));
  assert.ok(res2.stdout?.includes('FANOUT_TABLE_ENTRIES: 256'));

  const res3 = await executeBashSuite(d31.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('SAVINGS_PERCENTAGE: 91.2%'));

  const res4 = await executeBashSuite(d31.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('CRC32_INTEGRITY: 100% MATCH'));

  const res5 = await executeBashSuite(d31.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: PACKFILE-V2-STORAGE-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 32 The Git Index (.git/index) Binary Internals: DIRC Header, 40-Byte Stat Cache & Tree Cache Extension', async () => {
  const d32 = getLongLesson('git_vcs', 32);
  assert.ok(d32, 'git_vcs Day 32 must resolve');
  assert.equal(d32.day, 32);
  assert.equal(d32.parts.length, 5);

  const res1 = await executeBashSuite(d32.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('DIRC_HEADER_SIGNATURE: DIRC'));

  const res2 = await executeBashSuite(d32.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('REMEDY: git update-index --refresh'));

  const res3 = await executeBashSuite(d32.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('CONFLICT_RESOLUTION: Unmerged entries resolved into Stage 0'));

  const res4 = await executeBashSuite(d32.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('WRITE_TREE_ACCELERATION: 95%'));

  const res5 = await executeBashSuite(d32.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: GIT-INDEX-DIRC-INTEGRITY-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 33 Delta Compression & Object Deduplication: Sliding Window Algorithms, Max Delta Depth & Thin Packs', async () => {
  const d33 = getLongLesson('git_vcs', 33);
  assert.ok(d33, 'git_vcs Day 33 must resolve');
  assert.equal(d33.day, 33);
  assert.equal(d33.parts.length, 5);

  const res1 = await executeBashSuite(d33.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('ALGORITHM: Sliding Window Delta Compression'));

  const res2 = await executeBashSuite(d33.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('INVARIANT: pack.depth <= 50'));

  const res3 = await executeBashSuite(d33.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('RECEIVER_ACTION: git index-pack --fix-thin'));

  const res4 = await executeBashSuite(d33.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('OOM_STATUS: 0 crashes'));

  const res5 = await executeBashSuite(d33.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: DELTA-COMPRESSION-BOUNDED-PASS'));
});

test('Systems Long Lessons: git_vcs Day 34 Garbage Collection, MIDX & Alternate Stores: git gc, git prune, Multi-Pack-Index & info/alternates', async () => {
  const d34 = getLongLesson('git_vcs', 34);
  assert.ok(d34, 'git_vcs Day 34 must resolve');
  assert.equal(d34.day, 34);
  assert.equal(d34.parts.length, 5);

  const res1 = await executeBashSuite(d34.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('INDEX_TYPE: Multi-Pack-Index'));

  const res2 = await executeBashSuite(d34.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('ARCHITECTURAL_RULE: Alternates must be STRICTLY IMMUTABLE'));

  const res3 = await executeBashSuite(d34.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('LOG_TRAVERSAL_SPEED: 15s reduced to 180ms'));

  const res4 = await executeBashSuite(d34.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('BACKGROUND_GC_SAFETY: Zero race condition deletions'));

  const res5 = await executeBashSuite(d34.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: REPOSITORY-MAINTENANCE-MIDX-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 35 Milestone 4 (M2): ApexPlumbing Custom Git Object Database & Packfile Decoder Suite', async () => {
  const d35 = getLongLesson('git_vcs', 35);
  assert.ok(d35, 'git_vcs Day 35 must resolve');
  assert.equal(d35.day, 35);
  assert.equal(d35.parts.length, 5);

  const res1 = await executeBashSuite(d35.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('CANONICAL_PARITY: Exact byte-for-byte matching'));

  const res2 = await executeBashSuite(d35.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('RESTORATION: ApexPlumbing recalculated SHA-1 trailer'));

  const res3 = await executeBashSuite(d35.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('BYTE_INTEGRITY: 100% match against git cat-file -p output'));

  const res4 = await executeBashSuite(d35.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('CANONICAL_EQUIVALENCE: Exactly matches git rev-list --topo-order'));

  const res5 = await executeBashSuite(d35.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: APEX-PLUMBING-MILESTONE-4-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 36 Branching Strategies at Scale: Gitflow vs GitHub Flow vs Trunk-Based Development', async () => {
  const d36 = getLongLesson('git_vcs', 36);
  assert.ok(d36, 'git_vcs Day 36 must resolve');
  assert.equal(d36.day, 36);
  assert.equal(d36.parts.length, 5);

  const res1 = await executeBashSuite(d36.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('STRATEGY: Trunk-Based Development'));

  const res2 = await executeBashSuite(d36.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('CONFLICT_COUNT: 1400 merge conflicts across 300 files'));

  const res3 = await executeBashSuite(d36.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('FEATURE_FLAG: ENABLE_V2_PAYMENTS = true'));

  const res4 = await executeBashSuite(d36.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('MAINLINE_STABILITY: 100% green trunk builds guaranteed'));

  const res5 = await executeBashSuite(d36.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: TRUNK-BASED-INTEGRATION-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 37 Monorepo vs Polyrepo Architecture: Scaling Bottlenecks, Hermetic Builds & Dependency Graph Management', async () => {
  const d37 = getLongLesson('git_vcs', 37);
  assert.ok(d37, 'git_vcs Day 37 must resolve');
  assert.equal(d37.day, 37);
  assert.equal(d37.parts.length, 5);

  const res1 = await executeBashSuite(d37.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('ARCHITECTURE: Unified Enterprise Monorepo'));

  const res2 = await executeBashSuite(d37.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('INCIDENT: 45-Minute Polyrepo Version Dependency Deadlock'));

  const res3 = await executeBashSuite(d37.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('CI_RUNTIME_REDUCTION: 4 hours reduced to 85 seconds'));

  const res4 = await executeBashSuite(d37.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('TOTAL_PACKAGES: 5000 packages indexed'));

  const res5 = await executeBashSuite(d37.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: MONOREPO-HERMETIC-BUILD-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 38 Scalable Large Repositories: Sparse Checkout (git sparse-checkout), Blobless Clones & Microsoft Scalar', async () => {
  const d38 = getLongLesson('git_vcs', 38);
  assert.ok(d38, 'git_vcs Day 38 must resolve');
  assert.equal(d38.day, 38);
  assert.equal(d38.parts.length, 5);

  const res1 = await executeBashSuite(d38.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('CLONE_TYPE: Blobless Partial Clone (--filter=blob:none)'));

  const res2 = await executeBashSuite(d38.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('BEST_PRACTICE: Always prefer --filter=blob:none for full offline history'));

  const res3 = await executeBashSuite(d38.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('SPARSE_MODE: Cone Mode Enabled'));

  const res4 = await executeBashSuite(d38.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('FS_MONITOR: core.fsmonitor = true (OS kernel change events)'));

  const res5 = await executeBashSuite(d38.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: LARGE-REPO-SCALABILITY-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 39 Git LFS (Large File Storage): Pointer Files, Smudge/Clean Filters, S3 Storage Backends & Asset Deduplication', async () => {
  const d39 = getLongLesson('git_vcs', 39);
  assert.ok(d39, 'git_vcs Day 39 must resolve');
  assert.equal(d39.day, 39);
  assert.equal(d39.parts.length, 5);

  const res1 = await executeBashSuite(d39.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('POINTER_SIZE: 130 bytes representing 1.8GB binary asset'));

  const res2 = await executeBashSuite(d39.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('REMEDY: git lfs pull inside CI build container before packaging'));

  const res3 = await executeBashSuite(d39.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('STORAGE_BACKEND: Amazon S3 Object Storage'));

  const res4 = await executeBashSuite(d39.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('COLLISION_PREVENTION: Unmergeable binary merge conflicts eliminated'));

  const res5 = await executeBashSuite(d39.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: GIT-LFS-HYDRATION-VERIFIED'));
});

test('Systems Long Lessons: git_vcs Day 40 Milestone 5 (M2): ApexRelease Enterprise Trunk-Based CI/CD Release Engine Suite', async () => {
  const d40 = getLongLesson('git_vcs', 40);
  assert.ok(d40, 'git_vcs Day 40 must resolve');
  assert.equal(d40.day, 40);
  assert.equal(d40.parts.length, 5);

  const res1 = await executeBashSuite(d40.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('PLATFORM: ApexRelease Enterprise Trunk-Based CI/CD Engine'));

  const res2 = await executeBashSuite(d40.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('GATE_ACTION: ApexRelease blocked deployment preventing production container crash'));

  const res3 = await executeBashSuite(d40.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('ENGINE: ApexRelease Monorepo SemVer Tagger'));

  const res4 = await executeBashSuite(d40.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('AVERAGE_BRANCH_AGE: 6.4 hours (Trunk-Based standard achieved)'));

  const res5 = await executeBashSuite(d40.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: APEX-RELEASE-MILESTONE-5-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 41 Cryptographic Commit & Tag Signing: GPG vs SSH Key Signatures, Web-Flow Verification & Allowed Signers', async () => {
  const d41 = getLongLesson('git_vcs', 41);
  assert.ok(d41, 'git_vcs Day 41 must resolve');
  assert.equal(d41.day, 41);
  assert.equal(d41.parts.length, 5);

  const res1 = await executeBashSuite(d41.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('SIGNING_FORMAT: ssh'));

  const res2 = await executeBashSuite(d41.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('INCIDENT: Forged Executive Commit Detected'));

  const res3 = await executeBashSuite(d41.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('ALLOWED_SIGNERS_REGISTRY: /home/student/workspace/git_allowed_signers/allowed_signers'));

  const res4 = await executeBashSuite(d41.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('ATTACK_SIMULATION: Bit-Flipping on Signed Commit Object'));

  const res5 = await executeBashSuite(d41.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: CRYPTOGRAPHIC-PROVENANCE-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 42 Secret Detection & Pre-Commit Hardening: Pre-Commit Hooks, Gitleaks, TruffleHog & Entropy Scanning', async () => {
  const d42 = getLongLesson('git_vcs', 42);
  assert.ok(d42, 'git_vcs Day 42 must resolve');
  assert.equal(d42.day, 42);
  assert.equal(d42.parts.length, 5);

  const res1 = await executeBashSuite(d42.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('SCANNER: Shannon Entropy Analysis Engine'));

  const res2 = await executeBashSuite(d42.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('INCIDENT: Leaked AWS Root Key AKIAIOSFODNN7EXAMPLE'));

  const res3 = await executeBashSuite(d42.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('PRE_COMMIT_HOOK: Active in .git/hooks/pre-commit'));

  const res4 = await executeBashSuite(d42.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('DETECTION_RATE: 100% (5/5 attack vectors intercepted)'));

  const res5 = await executeBashSuite(d42.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: SHIFT-LEFT-SECRETS-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 43 Permanent Secret Purging & Repository Cleansing: git filter-repo vs BFG, Rewriting Packfiles & Reflogs', async () => {
  const d43 = getLongLesson('git_vcs', 43);
  assert.ok(d43, 'git_vcs Day 43 must resolve');
  assert.equal(d43.day, 43);
  assert.equal(d43.parts.length, 5);

  const res1 = await executeBashSuite(d43.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('TOOL: git filter-repo (Modern high-performance Python DAG rewriter)'));

  const res2 = await executeBashSuite(d43.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('INCIDENT: Dangling Reflog Secret Exfiltration'));

  const res3 = await executeBashSuite(d43.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('GARBAGE_COLLECTION: git gc --prune=now --aggressive (COMPLETE)'));

  const res4 = await executeBashSuite(d43.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('BENCHMARK: 5000 commits scrubbed in 1.4 seconds'));

  const res5 = await executeBashSuite(d43.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: REPOSITORY-CLEANSE-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 44 Tamper-Evident Repository Auditing: Merkle Tree Invariants, SHA-1 Collision Attacks & SHA-256 Architecture', async () => {
  const d44 = getLongLesson('git_vcs', 44);
  assert.ok(d44, 'git_vcs Day 44 must resolve');
  assert.equal(d44.day, 44);
  assert.equal(d44.parts.length, 5);

  const res1 = await executeBashSuite(d44.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('MERKLE_INVARIANT: Delta Blob cascades to Delta Tree and Delta Commit'));

  const res2 = await executeBashSuite(d44.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('COLLISION_DETECTED: SHA-1DC detected mathematical collision signature'));

  const res3 = await executeBashSuite(d44.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('OBJECT_FORMAT: sha256'));

  const res4 = await executeBashSuite(d44.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('TRANSLATION_TABLE: Bidirectional SHA-1 to SHA-256 mapping verified'));

  const res5 = await executeBashSuite(d44.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: MERKLE-COLLISION-RESISTANCE-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 45 Milestone 6 (M2): ApexAudit Cryptographic Git Verification & Secrets Hardening Suite', async () => {
  const d45 = getLongLesson('git_vcs', 45);
  assert.ok(d45, 'git_vcs Day 45 must resolve');
  assert.equal(d45.day, 45);
  assert.equal(d45.parts.length, 5);

  const res1 = await executeBashSuite(d45.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('SUITE: ApexAudit Institutional Security Platform'));

  const res2 = await executeBashSuite(d45.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('DEFECT: Lingering annotated tag refs/tags/v1.0.0 contained unpurged secret'));

  const res3 = await executeBashSuite(d45.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('STATUS: Institutional security posture certified'));

  const res4 = await executeBashSuite(d45.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('RESILIENCE_SCORE: 100% (4/4 attacks neutralized)'));

  const res5 = await executeBashSuite(d45.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: APEX-AUDIT-MILESTONE-6-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 46 Advanced GitHub Actions: Composite Actions, Reusable Workflows (workflow_call), Matrix Strategies & Cache', async () => {
  const d46 = getLongLesson('git_vcs', 46);
  assert.ok(d46, 'git_vcs Day 46 must resolve');
  assert.equal(d46.day, 46);
  assert.equal(d46.parts.length, 5);

  const res1 = await executeBashSuite(d46.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('ARCHITECTURE: Modular CI Encapsulation (workflow_call + Composite Actions)'));

  const res2 = await executeBashSuite(d46.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('INCIDENT: Mutable @main Tag Supply-Chain Poisoning'));

  const res3 = await executeBashSuite(d46.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('MATRIX_TOPOLOGY: 3 OS (ubuntu, windows, macos) x 3 Node (18, 20, 22) = 9 Parallel Jobs'));

  const res4 = await executeBashSuite(d46.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('FALLBACK_RESTORE: Partial prefix match via restore-keys (node-linux-x64-)'));

  const res5 = await executeBashSuite(d46.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: MODULAR-GHA-ARCHITECTURE-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 47 Self-Hosted Runners, Security Isolation, Ephemeral Environments & OIDC Cloud Authentication (AWS/GCP)', async () => {
  const d47 = getLongLesson('git_vcs', 47);
  assert.ok(d47, 'git_vcs Day 47 must resolve');
  assert.equal(d47.day, 47);
  assert.equal(d47.parts.length, 5);

  const res1 = await executeBashSuite(d47.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('AUTH_PROTOCOL: OpenID Connect (OIDC) Zero-Secret Federation'));

  const res2 = await executeBashSuite(d47.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('INCIDENT: Persistent Self-Hosted Runner Disk Cache Exfiltration'));

  const res3 = await executeBashSuite(d47.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('LEGACY_KEYS_PURGED: 50 static 3-year-old github-actions-user IAM keys deleted'));

  const res4 = await executeBashSuite(d47.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('CROSS_JOB_LEAKAGE: 0 bytes of residual state across 50 isolated executions'));

  const res5 = await executeBashSuite(d47.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: ZERO-SECRET-OIDC-FEDERATION-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 48 GitHub Enterprise Administration: GitHub Apps vs Fine-Grained PATs, Webhooks & Audit Log Streaming', async () => {
  const d48 = getLongLesson('git_vcs', 48);
  assert.ok(d48, 'git_vcs Day 48 must resolve');
  assert.equal(d48.day, 48);
  assert.equal(d48.parts.length, 5);

  const res1 = await executeBashSuite(d48.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('IDENTITY_MODEL: Organization GitHub App Service Identity'));

  const res2 = await executeBashSuite(d48.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('INCIDENT: Departed Engineer PAT Revocation Production Blackout'));

  const res3 = await executeBashSuite(d48.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('SIGNATURE_HEADER: X-Hub-Signature-256 verified via constant-time digest comparison'));

  const res4 = await executeBashSuite(d48.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('ANOMALY_DETECTED: Unauthorized branch protection bypass flagged in 180ms'));

  const res5 = await executeBashSuite(d48.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: GITHUB-ENTERPRISE-GOVERNANCE-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 49 Repository Governance at Scale: Organization Rulesets, CODEOWNERS, Automated Merge Queues & Branch Policies', async () => {
  const d49 = getLongLesson('git_vcs', 49);
  assert.ok(d49, 'git_vcs Day 49 must resolve');
  assert.equal(d49.day, 49);
  assert.equal(d49.parts.length, 5);

  const res1 = await executeBashSuite(d49.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('GOVERNANCE_LAYER: GitHub Organization-Wide Repository Rulesets'));

  const res2 = await executeBashSuite(d49.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('INCIDENT: Semantic Integration Race Condition (PR A + PR B Broken Main)'));

  const res3 = await executeBashSuite(d49.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('RULE_1: /services/billing/ -> @pinit-org/billing-security (Mandatory)'));

  const res4 = await executeBashSuite(d49.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('FAULT_EVICTION: PR #14 (incompatible schema change) automatically evicted from queue'));

  const res5 = await executeBashSuite(d49.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: REPOSITORY-GOVERNANCE-SCALE-CERTIFIED'));
});

test('Systems Long Lessons: git_vcs Day 50 Milestone 7 (M2): ApexAutomate Enterprise GitHub Actions & Security Automation Suite', async () => {
  const d50 = getLongLesson('git_vcs', 50);
  assert.ok(d50, 'git_vcs Day 50 must resolve');
  assert.equal(d50.day, 50);
  assert.equal(d50.parts.length, 5);

  const res1 = await executeBashSuite(d50.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('PLATFORM: ApexAutomate Enterprise CI/CD & Governance Suite'));

  const res2 = await executeBashSuite(d50.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('CRITICAL_VULNERABILITY: pull_request_target Untrusted Checkout Secret Exfiltration'));

  const res3 = await executeBashSuite(d50.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('ACTION_PIN_SCAN: 420 workflow files verified; 100% using 40-char commit SHAs'));

  const res4 = await executeBashSuite(d50.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('ATTACK_2: Forged webhook POST payload -> REJECTED (HTTP 401 HMAC mismatch)'));

  const res5 = await executeBashSuite(d50.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('AUDIT_SEAL: APEX-AUTOMATE-MILESTONE-7-CERTIFIED'));
});




