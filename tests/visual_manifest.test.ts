import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getLongLesson } from '@/lib/data/longLessons';
import { COURSES, computeVisualsStatus, renderStatusOutput } from '../scripts/visuals/status.mts';

describe('Manifest Check in CI (Task E-14)', () => {
  const manifestPath = path.resolve(process.cwd(), 'docs/visuals/py_cert_manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'docs/visuals/py_cert_manifest.json must exist');

  const raw = fs.readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(raw);

  it('manifest has exactly 2,160 keys', () => {
    const keys = Object.keys(manifest.keys || {});
    assert.equal(keys.length, 2160, `Expected exactly 2,160 keys in manifest, found ${keys.length}`);
  });

  it('keys equal the real lesson parts across all 12 courses', () => {
    const expectedKeys = new Set<string>();

    for (const prefix of COURSES) {
      for (let day = 1; day <= 30; day++) {
        const lesson = getLongLesson(prefix, day);
        assert.ok(lesson, `Lesson must exist for course "${prefix}" day ${day}`);
        assert.equal(
          lesson.parts.length,
          6,
          `Course "${prefix}" day ${day} must have exactly 6 parts, found ${lesson.parts.length}`
        );

        for (let partIdx = 0; partIdx < 6; partIdx++) {
          const key = `${prefix}:${day}:${partIdx}`;
          expectedKeys.add(key);

          const item = manifest.keys[key];
          assert.ok(item, `Manifest missing entry for key "${key}"`);
          assert.equal(
            item.partTitle,
            lesson.parts[partIdx].title,
            `partTitle mismatch at key "${key}": expected "${lesson.parts[partIdx].title}", got "${item.partTitle}"`
          );
        }
      }
    }

    assert.equal(expectedKeys.size, 2160);
    const actualKeys = new Set(Object.keys(manifest.keys));
    assert.equal(actualKeys.size, expectedKeys.size);

    for (const k of expectedKeys) {
      assert.ok(actualKeys.has(k), `Manifest missing expected key "${k}"`);
    }
  });

  it('each status matches the day files (Rule R11)', () => {
    for (const [key, item] of Object.entries<any>(manifest.keys)) {
      const [prefix, dayStr, partStr] = key.split(':');
      const day = parseInt(dayStr, 10);
      const dayPadded = String(day).padStart(2, '0');
      const dayFilePath = path.resolve(
        process.cwd(),
        `src/lib/data/lessonVisuals/${prefix}/day-${dayPadded}.json`
      );
      const dayFileExists = fs.existsSync(dayFilePath);

      if (dayFileExists) {
        assert.ok(
          ['passed', 'none', 'needs-review'].includes(item.status),
          `Key "${key}" has day file, but status is "${item.status}" (expected passed, none, or needs-review)`
        );
      } else {
        if (prefix === 'python' && day <= 3) {
          assert.equal(
            item.status,
            'pilot',
            `Key "${key}" without day file must have status "pilot", got "${item.status}"`
          );
        } else {
          assert.equal(
            item.status,
            'todo',
            `Key "${key}" without day file must have status "todo", got "${item.status}"`
          );
        }
      }
    }
  });

  it('visuals status aggregates match manifest totals', () => {
    const status = computeVisualsStatus(manifestPath);
    let totalAllCourses = 0;
    for (const course of COURSES) {
      const counts = status[course];
      assert.ok(counts, `Counts missing for course "${course}"`);
      assert.equal(counts.total, 180, `Course "${course}" should have 180 total parts`);
      totalAllCourses += counts.total;
    }
    assert.equal(totalAllCourses, 2160);

    const { lines, markdown } = renderStatusOutput(status);
    assert.equal(lines.length, 12, 'Should print 12 course lines');
    assert.ok(markdown.includes('| **Total** |'), 'Markdown should include total row');
    assert.ok(markdown.includes('2160'), 'Markdown should include grand total of 2160');
  });
});
