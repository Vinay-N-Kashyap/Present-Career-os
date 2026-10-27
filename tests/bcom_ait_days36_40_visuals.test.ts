import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Course 31 (bcom_ait) Visual Envelopes Days 36 to 40 Verification', () => {
  const visDir = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom_ait');

  for (let day = 36; day <= 40; day++) {
    it(`validates visual envelope for day ${day}`, () => {
      const dayPadded = String(day).padStart(2, '0');
      const filePath = path.join(visDir, `day-${dayPadded}.json`);

      assert.ok(fs.existsSync(filePath), `Missing visual file: ${filePath}`);

      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      assert.strictEqual(content.prefix, 'bcom_ait');
      assert.strictEqual(content.day, day);
      assert.ok(Array.isArray(content.entries), `Entries not array in day ${day}`);
      assert.strictEqual(content.entries.length, 5, `Expected 5 parts in day ${day}`);

      for (const entry of content.entries) {
        assert.ok(entry.partTitle, `Missing partTitle in day ${day}`);
        assert.ok(entry.codeHash, `Missing codeHash in day ${day}`);
        assert.ok(entry.spec, `Missing spec in day ${day}`);
        assert.ok(entry.spec.template, `Missing template in day ${day}`);
      }
    });
  }
});
