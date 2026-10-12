import test from 'node:test';
import assert from 'node:assert/strict';
import { getLongLessonLanguage } from '../src/lib/data/longLessons';
import { executeBashSuite } from '../src/lib/code/runners/bashRunner';
import { executeCppSuite } from '../src/lib/code/runners/cppRunner';

test('Lesson Language Resolution: Correctly maps systems and CLI courses', () => {
  assert.equal(getLongLessonLanguage('comp_fund'), 'bash');
  assert.equal(getLongLessonLanguage('git_vcs'), 'bash');
  assert.equal(getLongLessonLanguage('iot_emb'), 'cpp');
  assert.equal(getLongLessonLanguage('iot_edge'), 'python');
  assert.equal(getLongLessonLanguage('iot_net'), 'python');
  assert.equal(getLongLessonLanguage('iot_sec'), 'python');
  assert.equal(getLongLessonLanguage('react-basics'), 'javascript');
  assert.equal(getLongLessonLanguage('node-web'), 'typescript');
  assert.equal(getLongLessonLanguage('sql-mastery'), 'sql');
});

test('Lesson Slide Bash Execution: Executes POSIX shell code and formats output', async () => {
  const slideScript = `
echo "System Status: Online"
pwd
ls
`;
  const result = await executeBashSuite(slideScript);
  assert.equal(result.allPassed, true);
  assert.ok(result.stdout?.includes('System Status: Online'));
  assert.ok(result.stdout?.includes('/home/student/workspace'));
  assert.ok(result.stdout?.includes('notes.txt'));
});

test('Lesson Slide C++ Invariant Execution: Evaluates MCU / Embedded code', async () => {
  const mcuCode = `
#include <iostream>

int readPinValue(int pinNumber) {
    if (pinNumber < 0) return -1;
    return 1024;
}
`;
  const result = await executeCppSuite(mcuCode, 'readPinValue');
  assert.equal(result.language, 'cpp');
  assert.equal(result.allPassed, true);
  assert.ok(result.terminalLogs.some(log => log.includes('[SUCCESS] Function signature \'readPinValue\' and control flow verified')));
});

test('Lesson Slide C++ Invariant Rejection: Flags missing return statement', async () => {
  const brokenCode = `
#include <iostream>

int readPinValue(int pinNumber) {
    int x = pinNumber * 2;
}
`;
  const result = await executeCppSuite(brokenCode, 'readPinValue');
  assert.equal(result.allPassed, false);
  assert.ok(result.terminalLogs.some(log => log.includes('[FAIL] Missing valid function signature or return statement')));
});
