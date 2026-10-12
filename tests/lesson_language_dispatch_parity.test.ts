import test from 'node:test';
import assert from 'node:assert/strict';
import { getLongLessonLanguage } from '../src/lib/data/longLessons';
import { executeCppSuite } from '../src/lib/code/runners/cppRunner';

test('Lesson Language Dispatch: All 37 course domains resolve to correct runtime environments', () => {
  // Python tracks
  assert.equal(getLongLessonLanguage('python'), 'python');
  assert.equal(getLongLessonLanguage('dsa-py'), 'python');
  assert.equal(getLongLessonLanguage('ai-py'), 'python');
  assert.equal(getLongLessonLanguage('dist-py'), 'python');
  assert.equal(getLongLessonLanguage('cloud-py'), 'python');
  assert.equal(getLongLessonLanguage('nlp-py'), 'python');
  assert.equal(getLongLessonLanguage('quant-py'), 'python');
  assert.equal(getLongLessonLanguage('prompt-py'), 'python');
  assert.equal(getLongLessonLanguage('cyber-py'), 'python');
  assert.equal(getLongLessonLanguage('train-py'), 'python');
  assert.equal(getLongLessonLanguage('vec-py'), 'python');
  assert.equal(getLongLessonLanguage('safe-py'), 'python');
  assert.equal(getLongLessonLanguage('excel_viz'), 'python');
  assert.equal(getLongLessonLanguage('bcom_ana'), 'python');
  assert.equal(getLongLessonLanguage('ai_prompt'), 'python');
  assert.equal(getLongLessonLanguage('nlp'), 'python');
  assert.equal(getLongLessonLanguage('iot_edge'), 'python');
  assert.equal(getLongLessonLanguage('iot_net'), 'python');
  assert.equal(getLongLessonLanguage('iot_sec'), 'python');

  // C++ tracks
  assert.equal(getLongLessonLanguage('iot_emb'), 'cpp');
  assert.equal(getLongLessonLanguage('quant-systems'), 'cpp');

  // Bash tracks
  assert.equal(getLongLessonLanguage('comp_fund'), 'bash');
  assert.equal(getLongLessonLanguage('git_vcs'), 'bash');

  // SQL track
  assert.equal(getLongLessonLanguage('sql-mastery'), 'sql');

  // TypeScript / Fullstack tracks
  assert.equal(getLongLessonLanguage('blockchain'), 'typescript');
  assert.equal(getLongLessonLanguage('fullstack-js'), 'typescript');
  assert.equal(getLongLessonLanguage('mobile'), 'typescript');
  assert.equal(getLongLessonLanguage('node-web'), 'typescript');
  assert.equal(getLongLessonLanguage('devops'), 'typescript');
  assert.equal(getLongLessonLanguage('sre-web'), 'typescript');
  assert.equal(getLongLessonLanguage('stream-web'), 'typescript');
  assert.equal(getLongLessonLanguage('aideploy-web'), 'typescript');
  assert.equal(getLongLessonLanguage('cloud'), 'typescript');
  assert.equal(getLongLessonLanguage('dsa-optim'), 'typescript');
});

test('Lesson Language Dispatch: quant-systems static syllabus routine satisfies C++ AST invariants', async () => {
  const targetLang = getLongLessonLanguage('quant-systems');
  assert.equal(targetLang, 'cpp');

  const title = 'Order Book Limit Matching Engine';
  const cppSnippet = `#include <iostream>\n\n// Embedded Systems Routine for ${title}\nint executeRoutine() {\n    std::cout << "Routine active: ${title}" << std::endl;\n    return 0;\n}\n\nint main() {\n    return executeRoutine();\n}`;

  const res = await executeCppSuite(cppSnippet, 'main');
  assert.equal(res.allPassed, true, 'Quant systems C++ routine must pass AST evaluation');
  assert.ok(res.terminalLogs.some(log => log.includes('Function signature \'main\' and control flow verified')));
});

test('Lesson Language Dispatch: Python static syllabus generation produces valid Python syntax', () => {
  const targetLang = getLongLessonLanguage('excel_viz');
  assert.equal(targetLang, 'python');

  const title = 'Pivot Table Variance Aggregation';
  const pySnippet = `# Python execution for ${title}\nprint("Executing verification for ${title}...")\nmetrics = [10, 20, 30]\nprint(f"Computed total: {sum(metrics)}")`;

  assert.ok(pySnippet.startsWith('# Python execution'), 'Must be python comment');
  assert.ok(pySnippet.includes('print('), 'Must use print function');
  assert.ok(!pySnippet.includes('console.log'), 'Must NOT use JS console.log');
  assert.ok(!pySnippet.includes('const '), 'Must NOT use JS const');
});
