import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkCommitScope,
  checkPushScope,
  isContentOnlyPush,
} from '../scripts/ci/check-task-scope.mjs';

const FAKE_TASKS_MAP = {
  'S-02': {
    id: 'S-02',
    title: 'Secret scanner in CI',
    allowedFiles: ['.github/workflows/ci-cd.yml', '.gitleaks.toml'],
  },
  'S-03': {
    id: 'S-03',
    title: 'Task-scope guard',
    allowedFiles: [
      'scripts/ci/check-task-scope.mjs',
      'tests/task_scope.test.ts',
      '.github/workflows/ci-cd.yml',
    ],
  },
  'X-SPEC': {
    id: 'X-SPEC',
    title: 'Claude spec updates (Claude only)',
    allowedFiles: ['docs/visuals/**'],
  },
};

test('1. allowed file passes', () => {
  const result = checkCommitScope(
    '[task:S-02] Secret scanner in CI',
    ['.github/workflows/ci-cd.yml', '.gitleaks.toml'],
    FAKE_TASKS_MAP
  );
  assert.equal(result.ok, true, 'Allowed files for task S-02 must pass');
  assert.equal(result.taskId, 'S-02');
});

test('2. other file fails', () => {
  const result = checkCommitScope(
    '[task:S-02] Secret scanner in CI',
    ['src/app/page.tsx'],
    FAKE_TASKS_MAP
  );
  assert.equal(result.ok, false, 'Unallowed file for task S-02 must fail');
  assert.match(result.error, /does not allow modifying file/);
});

test('3. unknown ID fails', () => {
  const result = checkCommitScope(
    '[task:UNKNOWN-999] Fake task ID',
    ['.gitleaks.toml'],
    FAKE_TASKS_MAP
  );
  assert.equal(result.ok, false, 'Unknown task ID must fail');
  assert.match(result.error, /Unknown task ID/);
});

test('4. missing tag on a protected path fails', () => {
  const result = checkCommitScope(
    'Update visual data without task tag',
    ['src/lib/data/lessonVisuals/python/day-01.json'],
    FAKE_TASKS_MAP
  );
  assert.equal(result.ok, false, 'Untagged commit touching protected path must fail');
  assert.match(result.error, /Untagged commit touches protected file/);
});

test('5. missing tag on a normal path passes', () => {
  const result = checkCommitScope(
    'Refactor landing button component',
    ['src/components/ui/Button.tsx', 'src/styles/landing.css'],
    FAKE_TASKS_MAP
  );
  assert.equal(result.ok, true, 'Untagged commit touching non-protected files must pass');
  assert.equal(result.taskId, null);
});

test('6. a glob match passes', () => {
  const result = checkCommitScope(
    '[task:X-SPEC] Update spec documentation',
    ['docs/visuals/PINIT_PY_CERT_VISUALS_PLAN.md', 'docs/visuals/sub/guide.md'],
    FAKE_TASKS_MAP
  );
  assert.equal(result.ok, true, 'Files matching glob docs/visuals/** must pass');
  assert.equal(result.taskId, 'X-SPEC');
});

test('7. in a push of 2 commits, a bad first commit fails even when the last commit is fine', () => {
  const commits = [
    {
      sha: 'commit1_bad',
      message: '[task:S-02] First commit with unauthorized file',
      files: ['src/forbidden_file.ts'],
    },
    {
      sha: 'commit2_good',
      message: '[task:S-02] Second commit with allowed file',
      files: ['.gitleaks.toml'],
    },
  ];

  const result = checkPushScope(commits, FAKE_TASKS_MAP);
  assert.equal(result.ok, false, 'Push with a bad first commit must fail');
  assert.match(result.error, /Commit 1 of 2/);
});

test('8. a protected file listed only through a glob fails', () => {
  const tasksMap = {
    'TEST-GLOB': {
      id: 'TEST-GLOB',
      title: 'Task with glob for tests',
      allowedFiles: ['tests/**'],
    },
    'SPEC-GLOB': {
      id: 'SPEC-GLOB',
      title: 'Spec task with glob',
      allowedFiles: ['docs/visuals/**'],
    },
    'CI-GLOB': {
      id: 'CI-GLOB',
      title: 'CI task with glob',
      allowedFiles: ['.github/**'],
    },
  };

  // 1. tests/** glob fails on tests/task_scope.test.ts
  const res1 = checkCommitScope(
    '[task:TEST-GLOB] Try modifying test via glob',
    ['tests/task_scope.test.ts'],
    tasksMap
  );
  assert.equal(res1.ok, false, 'Protected test file listed only through glob must fail');
  assert.match(res1.error, /does not allow modifying file/);

  // 2. docs/visuals/** glob fails on docs/visuals/py_cert_tasks.json
  const res2 = checkCommitScope(
    '[task:SPEC-GLOB] Try modifying py_cert_tasks.json via glob',
    ['docs/visuals/py_cert_tasks.json'],
    tasksMap
  );
  assert.equal(res2.ok, false, 'Protected py_cert_tasks.json listed only through glob must fail');
  assert.match(res2.error, /does not allow modifying file/);

  // 3. docs/visuals/** glob fails on docs/visuals/py_cert_generator_prompt.md
  const res3 = checkCommitScope(
    '[task:SPEC-GLOB] Try modifying py_cert_generator_prompt.md via glob',
    ['docs/visuals/py_cert_generator_prompt.md'],
    tasksMap
  );
  assert.equal(res3.ok, false, 'Protected py_cert_generator_prompt.md listed only through glob must fail');
  assert.match(res3.error, /does not allow modifying file/);

  // 4. .github/** glob fails on .github/workflows/ci-cd.yml
  const res4 = checkCommitScope(
    '[task:CI-GLOB] Try modifying workflow via glob',
    ['.github/workflows/ci-cd.yml'],
    tasksMap
  );
  assert.equal(res4.ok, false, 'Protected workflow file listed only through glob must fail');
  assert.match(res4.error, /does not allow modifying file/);
});

test('9. a protected file listed exactly passes', () => {
  const tasksMap = {
    'S-04': {
      id: 'S-04',
      title: 'Protected files list',
      allowedFiles: [
        'scripts/ci/check-task-scope.mjs',
        'tests/task_scope.test.ts',
      ],
    },
    'E-16': {
      id: 'E-16',
      title: 'Prompt lock',
      allowedFiles: [
        'docs/visuals/py_cert_generator_prompt.md',
        'tests/visual_prompt.test.ts',
      ],
    },
  };

  const res1 = checkCommitScope(
    '[task:S-04] Protected files list',
    ['scripts/ci/check-task-scope.mjs', 'tests/task_scope.test.ts'],
    tasksMap
  );
  assert.equal(res1.ok, true, 'Protected files listed by exact path must pass');
  assert.equal(res1.taskId, 'S-04');

  const res2 = checkCommitScope(
    '[task:E-16] Lock generator prompt',
    ['docs/visuals/py_cert_generator_prompt.md', 'tests/visual_prompt.test.ts'],
    tasksMap
  );
  assert.equal(res2.ok, true, 'Protected prompt file and test file listed exactly must pass');
  assert.equal(res2.taskId, 'E-16');
});

test('10. content_only is true for a pure content commit, and false if the same push also touches any other file', () => {
  // 1. Pure content commit
  const pureContentCommits = [
    {
      sha: 'commit_content_1',
      message: '[task:C-python-D04] visuals for python day 4',
      files: [
        'src/lib/data/lessonVisuals/python/day-04.json',
        'docs/visuals/py_cert_manifest.json',
      ],
    },
  ];
  assert.equal(
    isContentOnlyPush(pureContentCommits),
    true,
    'Pure content commit must have content_only=true'
  );

  // 2. Content commit touching another file in the same commit
  const mixedFilesContentCommits = [
    {
      sha: 'commit_content_2',
      message: '[task:C-python-D04] visuals for python day 4 with extra code',
      files: [
        'src/lib/data/lessonVisuals/python/day-04.json',
        'docs/visuals/py_cert_manifest.json',
        'src/lib/types/lessonVisual.ts',
      ],
    },
  ];
  assert.equal(
    isContentOnlyPush(mixedFilesContentCommits),
    false,
    'Content commit touching another file must have content_only=false'
  );

  // 3. Push of 2 commits: one pure content, one code task
  const multiCommitMixed = [
    {
      sha: 'commit_content_3',
      message: '[task:C-python-D04] visuals for python day 4',
      files: [
        'src/lib/data/lessonVisuals/python/day-04.json',
        'docs/visuals/py_cert_manifest.json',
      ],
    },
    {
      sha: 'commit_code_1',
      message: '[task:E-01] Types, Zod schema, registry',
      files: ['src/lib/types/lessonVisual.ts'],
    },
  ];
  assert.equal(
    isContentOnlyPush(multiCommitMixed),
    false,
    'Push containing any non-content commit must have content_only=false'
  );

  // 4. Code task commit
  const codeCommits = [
    {
      sha: 'commit_code_2',
      message: '[task:S-05] CI speed: parallel tests',
      files: ['.github/workflows/ci-cd.yml'],
    },
  ];
  assert.equal(
    isContentOnlyPush(codeCommits),
    false,
    'Code commit must have content_only=false'
  );
});


