import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

export const PROTECTED_PREFIXES = [
  'src/lib/data/lessonVisuals/',
  'scripts/visuals/',
  'src/lib/visuals/',
  'docs/visuals/py_cert_',
  'tests/',
  '.github/',
];

export function isProtectedPath(filePath) {
  const norm = filePath.replace(/\\/g, '/');
  return PROTECTED_PREFIXES.some((prefix) => norm.startsWith(prefix));
}

export function matchGlob(file, glob) {
  const normFile = file.replace(/\\/g, '/');
  const normGlob = glob.replace(/\\/g, '/');
  if (normGlob === normFile) return true;
  if (normGlob.endsWith('/**')) {
    const dir = normGlob.slice(0, -3);
    return normFile === dir || normFile.startsWith(dir + '/');
  }
  const regexStr = '^' + normGlob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '.*')
    .replace(/(?<!\.)\*/g, '[^/]*') + '$';
  return new RegExp(regexStr).test(normFile);
}

export function extractTaskId(commitMessage) {
  const match = commitMessage.match(/\[task:([a-zA-Z0-9_\-:]+)\]/);
  return match ? match[1] : null;
}

export function checkCommitScope(commitMessage, changedFiles, tasksMap) {
  const taskId = extractTaskId(commitMessage);

  if (!taskId) {
    // Untagged commit: only allowed if it touches NO protected files
    const protectedFiles = changedFiles.filter(isProtectedPath);
    if (protectedFiles.length > 0) {
      return {
        ok: false,
        error: `Untagged commit touches protected file(s): ${protectedFiles.join(', ')}`,
      };
    }
    return { ok: true, taskId: null };
  }

  const task = tasksMap[taskId];
  if (!task) {
    return {
      ok: false,
      error: `Unknown task ID: [task:${taskId}]`,
    };
  }

  const allowedPatterns = task.allowedFiles || [];
  const unauthorizedFiles = [];

  for (const file of changedFiles) {
    const isAllowed = allowedPatterns.some((pattern) => matchGlob(file, pattern));
    if (!isAllowed) {
      unauthorizedFiles.push(file);
    }
  }

  if (unauthorizedFiles.length > 0) {
    return {
      ok: false,
      error: `Task [task:${taskId}] does not allow modifying file(s): ${unauthorizedFiles.join(', ')}. Allowed patterns: ${allowedPatterns.join(', ')}`,
    };
  }

  return { ok: true, taskId };
}

export function checkPushScope(commits, tasksMap) {
  for (let i = 0; i < commits.length; i++) {
    const commit = commits[i];
    const result = checkCommitScope(commit.message, commit.files, tasksMap);
    if (!result.ok) {
      return {
        ok: false,
        error: `Commit ${i + 1} of ${commits.length} (${commit.sha || 'unknown'}) failed task-scope guard: ${result.error}`,
      };
    }
  }
  return { ok: true };
}

export function loadTasksMap(tasksJsonPath) {
  const raw = fs.readFileSync(tasksJsonPath, 'utf8');
  const parsed = JSON.parse(raw);
  const map = {};
  for (const t of parsed.tasks || []) {
    map[t.id] = t;
  }
  return map;
}

export function runGitScopeCheck() {
  const rootDir = process.cwd();
  const tasksPath = path.join(rootDir, 'docs', 'visuals', 'py_cert_tasks.json');
  if (!fs.existsSync(tasksPath)) {
    console.error(`Error: tasks file not found at ${tasksPath}`);
    process.exit(1);
  }
  const tasksMap = loadTasksMap(tasksPath);

  let range = '';
  if (process.env.GITHUB_EVENT_PATH && fs.existsSync(process.env.GITHUB_EVENT_PATH)) {
    try {
      const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
      if (process.env.GITHUB_EVENT_NAME === 'pull_request' && event.pull_request) {
        range = `${event.pull_request.base.sha}..${event.pull_request.head.sha}`;
      } else if (event.before && event.before !== '0000000000000000000000000000000000000000') {
        try {
          execSync(`git rev-parse --verify ${event.before}`, { stdio: 'ignore' });
          range = `${event.before}..${event.after || process.env.GITHUB_SHA || 'HEAD'}`;
        } catch {
          range = '';
        }
      }
    } catch (e) {
      console.warn('Could not parse GITHUB_EVENT_PATH:', e.message);
    }
  }

  let commitShas = [];
  if (range) {
    try {
      const output = execSync(`git log --format="%H" ${range}`, { encoding: 'utf8' }).trim();
      if (output) {
        commitShas = output.split('\n').map((s) => s.trim()).filter(Boolean);
      }
    } catch (e) {
      console.warn(`git log failed for range ${range}:`, e.message);
    }
  }

  if (commitShas.length === 0) {
    const headSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    commitShas = [headSha];
  }

  console.log(`Checking ${commitShas.length} commit(s) for task-scope guard...`);

  const commits = commitShas.map((sha) => {
    const message = execSync(`git log -1 --format="%B" ${sha}`, { encoding: 'utf8' });
    let files = [];
    try {
      const filesRaw = execSync(`git diff --name-only ${sha}~1 ${sha}`, { encoding: 'utf8' }).trim();
      if (filesRaw) files = filesRaw.split('\n').map((f) => f.trim()).filter(Boolean);
    } catch {
      const filesRaw = execSync(`git diff-tree --no-commit-id --name-only -r ${sha}`, { encoding: 'utf8' }).trim();
      if (filesRaw) files = filesRaw.split('\n').map((f) => f.trim()).filter(Boolean);
    }
    return { sha, message, files };
  });

  const result = checkPushScope(commits, tasksMap);
  if (!result.ok) {
    console.error(`❌ Task Scope Guard FAILED:\n${result.error}`);
    process.exit(1);
  }

  console.log(`✅ All ${commits.length} commit(s) passed task-scope guard.`);
}

// Auto-run if executed directly
const currentFilePath = fileURLToPath ? fileURLToPath(import.meta.url) : '';
if (process.argv[1] && currentFilePath && path.resolve(process.argv[1]) === path.resolve(currentFilePath)) {
  runGitScopeCheck();
}
