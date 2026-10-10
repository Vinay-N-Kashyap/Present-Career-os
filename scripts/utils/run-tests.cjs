/**
 * Cross-platform test runner for `npm test`.
 * Discovers all *.test.ts files under tests/ (excluding e2e) and passes them to tsx --test.
 * Avoids shell globbing and quote mismatch across Windows, Linux, and macOS.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const TESTS_DIR = path.join(ROOT, 'tests');

function getTestFiles(dir = TESTS_DIR) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'e2e' && entry.name !== 'fixtures' && entry.name !== 'helpers') {
        results = results.concat(getTestFiles(fullPath));
      }
    } else if (entry.name.endsWith('.test.ts')) {
      const relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/');
      results.push(relPath);
    }
  }
  return results;
}

function shardFiles(allFiles, shardStr) {
  if (!shardStr) {
    return allFiles;
  }
  const match = shardStr.trim().match(/^(\d+)\/(\d+)$/);
  if (!match) {
    throw new Error(`Invalid TEST_SHARD format: "${shardStr}". Expected N/M, e.g. 1/4.`);
  }
  const n = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (m < 1 || n < 1 || n > m) {
    throw new Error(`Invalid TEST_SHARD range: N must be between 1 and M (${shardStr}).`);
  }
  return allFiles.filter((_, idx) => (idx % m) === (n - 1));
}

function run() {
  const allFiles = getTestFiles(TESTS_DIR);
  if (allFiles.length === 0) {
    console.error('No test files found in tests/');
    process.exit(1);
  }

  // Sort alphabetically so shards are completely deterministic across all machines
  allFiles.sort();

  const shardEnv = process.env.TEST_SHARD;
  const filesToRun = shardFiles(allFiles, shardEnv);

  if (process.argv.includes('--list')) {
    for (const f of filesToRun) {
      console.log(f);
    }
    process.exit(0);
  }

  if (filesToRun.length === 0) {
    console.log('No test files assigned to this shard.');
    process.exit(0);
  }

  const tsxCli = require.resolve('tsx/cli');
  const result = spawnSync(process.execPath, [tsxCli, '--test', '--test-reporter=spec', ...filesToRun], {
    cwd: ROOT,
    stdio: 'inherit',
  });

  process.exit(result.status ?? (result.error ? 1 : 0));
}

if (require.main === module) {
  run();
}

module.exports = {
  getTestFiles,
  shardFiles,
};

