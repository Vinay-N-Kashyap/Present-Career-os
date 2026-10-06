import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkCommitScope,
  checkPushScope,
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
