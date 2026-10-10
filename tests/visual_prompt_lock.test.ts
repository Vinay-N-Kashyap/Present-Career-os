import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

describe('Prompt Lock (Task E-16)', () => {
  const promptPath = path.resolve(
    process.cwd(),
    'docs/visuals/py_cert_generator_prompt.md'
  );

  it('py_cert_generator_prompt.md exists', () => {
    assert.ok(fs.existsSync(promptPath), 'Prompt file must exist');
  });

  it('asserts SHA-256 matches 40f8f16b2525e42c7f0b483d22d713d09de2863485546f1f4616ab814dbe7a68', () => {
    const raw = fs.readFileSync(promptPath, 'utf-8');
    // Normalize CRLF to LF for cross-platform deterministic hashing
    const normalized = raw.replace(/\r\n/g, '\n');
    const hash = crypto.createHash('sha256').update(normalized).digest('hex');

    const expectedHash =
      '40f8f16b2525e42c7f0b483d22d713d09de2863485546f1f4616ab814dbe7a68';

    assert.equal(
      hash,
      expectedHash,
      `Prompt SHA-256 mismatch.\nExpected: ${expectedHash}\nActual:   ${hash}`
    );
  });
});
