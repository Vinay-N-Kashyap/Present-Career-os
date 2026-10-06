import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { shardFiles } = require('../scripts/utils/run-tests.cjs');

test('4 shards of a fake list of 10 files cover all 10 exactly once, and no shard is empty', () => {
  const fakeFiles = [
    'tests/file01.test.ts',
    'tests/file02.test.ts',
    'tests/file03.test.ts',
    'tests/file04.test.ts',
    'tests/file05.test.ts',
    'tests/file06.test.ts',
    'tests/file07.test.ts',
    'tests/file08.test.ts',
    'tests/file09.test.ts',
    'tests/file10.test.ts',
  ];

  const shard1 = shardFiles(fakeFiles, '1/4');
  const shard2 = shardFiles(fakeFiles, '2/4');
  const shard3 = shardFiles(fakeFiles, '3/4');
  const shard4 = shardFiles(fakeFiles, '4/4');

  // Verify none is empty
  assert.ok(shard1.length > 0, 'Shard 1 must not be empty');
  assert.ok(shard2.length > 0, 'Shard 2 must not be empty');
  assert.ok(shard3.length > 0, 'Shard 3 must not be empty');
  assert.ok(shard4.length > 0, 'Shard 4 must not be empty');

  // Verify counts (10 files over 4 shards: 3, 3, 2, 2)
  assert.equal(shard1.length, 3, 'Shard 1 has 3 files');
  assert.equal(shard2.length, 3, 'Shard 2 has 3 files');
  assert.equal(shard3.length, 2, 'Shard 3 has 2 files');
  assert.equal(shard4.length, 2, 'Shard 4 has 2 files');

  // Verify all 10 covered exactly once
  const allSharded = [...shard1, ...shard2, ...shard3, ...shard4];
  assert.equal(allSharded.length, 10, 'Total sharded files must equal 10');

  const set = new Set(allSharded);
  assert.equal(set.size, 10, 'All 10 files must be unique across shards');

  for (const f of fakeFiles) {
    assert.ok(set.has(f), `File ${f} must be present in the union of shards`);
  }
});
