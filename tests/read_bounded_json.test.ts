import assert from 'node:assert/strict';
import test from 'node:test';
import { isJsonObject, readBoundedJson, RequestBodyError } from '../src/lib/server/readBoundedJson';

test('bounded JSON reader parses valid JSON', async () => {
  const request = new Request('http://localhost/api', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ answer: 'clear and concise' }),
  });

  assert.deepEqual(await readBoundedJson(request, 128), { answer: 'clear and concise' });
});

test('bounded JSON reader rejects oversized bodies', async () => {
  const request = new Request('http://localhost/api', {
    method: 'POST',
    body: JSON.stringify({ answer: 'this is too long' }),
  });

  await assert.rejects(readBoundedJson(request, 8), (error: unknown) =>
    error instanceof RequestBodyError && error.status === 413
  );
});

test('bounded JSON reader rejects malformed JSON and object guard excludes arrays', async () => {
  const request = new Request('http://localhost/api', { method: 'POST', body: '{broken' });

  await assert.rejects(readBoundedJson(request, 128), (error: unknown) =>
    error instanceof RequestBodyError && error.status === 400
  );
  assert.equal(isJsonObject([]), false);
  assert.equal(isJsonObject(null), false);
  assert.equal(isJsonObject({ ok: true }), true);
});
