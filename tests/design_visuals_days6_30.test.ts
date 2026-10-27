import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Course 06 (design) Visual Envelopes Days 6 to 30', () => {
  const visDir = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/design');

  for (let day = 6; day <= 30; day++) {
    it(`validates visual envelope for day ${day}`, () => {
      const dayPadded = String(day).padStart(2, '0');
      const filePath = path.join(visDir, `day-${dayPadded}.json`);

      assert.ok(fs.existsSync(filePath), `Missing visual file: ${filePath}`);

      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      assert.strictEqual(content.prefix, 'design');
      assert.strictEqual(content.day, day);
      assert.ok(Array.isArray(content.entries), `Entries not array in day ${day}`);
      assert.ok(content.entries.length >= 5, `Expected at least 5 parts in day ${day}, got ${content.entries.length}`);

      for (const entry of content.entries) {
        assert.ok(entry.partTitle, `Missing partTitle in day ${day}`);
        assert.ok(entry.codeHash, `Missing codeHash in day ${day}`);
        assert.ok(entry.spec, `Missing spec in day ${day}`);
        assert.ok(entry.spec.template, `Missing template in day ${day}`);
      }
    });
  }
});
