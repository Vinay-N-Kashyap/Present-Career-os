import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { getLongLesson } from '../src/lib/data/longLessons';
import { getTappableLabelsForVisual } from '../src/lib/visuals/visualRules';

test('Block 146: Advanced Systems, Mobile & Graphics On-Disk Visual Suites (Days 1–5)', () => {
  clearDayFileCache();
  const advancedExpectations: Array<{ prefix: string; expectedTemplate: string }> = [
    { prefix: 'java-basics', expectedTemplate: 'stack-queue' },
    { prefix: 'mobile', expectedTemplate: 'component-tree' },
    { prefix: 'fullstack-js', expectedTemplate: 'flow' },
    { prefix: 'design', expectedTemplate: 'wireframe' },
    { prefix: 'blockchain', expectedTemplate: 'sequence' },
    { prefix: 'g3d', expectedTemplate: 'states' },
    { prefix: 'quant-systems', expectedTemplate: 'states' },
  ];

  for (const { prefix, expectedTemplate } of advancedExpectations) {
    assert.equal(isCourseVisualsEnabled(prefix), true, `Course "${prefix}" must be enabled in enabledCourses`);

    for (let day = 1; day <= 5; day++) {
      const dayPadded = String(day).padStart(2, '0');
      const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/${prefix}/day-${dayPadded}.json`);
      assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

      const dayFile = loadDayFile(prefix, day);
      assert.ok(dayFile, `loadDayFile failed for ${prefix} Day ${day}`);
      assert.equal(dayFile.schemaVersion, 1);
      assert.equal(dayFile.prefix, prefix);
      assert.equal(dayFile.day, day);
      assert.ok(dayFile.entries.length >= 4, `Expected >= 4 entries in ${prefix} Day ${day}`);

      const lesson = getLongLesson(prefix, day);
      assert.ok(lesson, `LongLesson missing for ${prefix} Day ${day}`);
      assert.equal(dayFile.entries.length, lesson.parts.length, `Parts count mismatch for ${prefix} Day ${day}`);

      for (let partIdx = 0; partIdx < lesson.parts.length; partIdx++) {
        const entry = dayFile.entries[partIdx];
        const part = lesson.parts[partIdx];

        assert.equal(entry.partTitle, part.title, `partTitle mismatch at ${prefix} Day ${day} Part ${partIdx}`);
        const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
        assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at ${prefix} Day ${day} Part ${partIdx}`);

        const visual = getVisual(prefix, day, partIdx);
        assert.ok(visual, `getVisual returned null for ${prefix} Day ${day} Part ${partIdx}`);
        assert.equal(visual.template, expectedTemplate, `Expected template "${expectedTemplate}" for ${prefix}`);
        assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for ${prefix} Day ${day} Part ${partIdx}`);
        assert.deepEqual(
          visual.steps.map(s => s.at),
          ['intro', 'say1', 'example', 'tryIt'],
          `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
        );

        const labels = getTappableLabelsForVisual(visual);
        assert.ok(labels.length > 0, `Expected non-empty tappable labels for ${prefix} Day ${day} Part ${partIdx}`);
      }
    }
  }
});

test('Mobile Expansion (Days 6–15): Component-Tree Visual Spec Verification', () => {
  clearDayFileCache();
  const prefix = 'mobile';
  const expectedTemplate = 'component-tree';

  // Test currently generated days (6-25 complete)
  for (let day = 6; day <= 25; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/${prefix}/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile(prefix, day);
    assert.ok(dayFile, `loadDayFile failed for ${prefix} Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, prefix);
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in ${prefix} Day ${day}`);

    const lesson = getLongLesson(prefix, day);
    assert.ok(lesson, `LongLesson missing for ${prefix} Day ${day}`);
    assert.equal(dayFile.entries.length, lesson.parts.length, `Parts count mismatch for ${prefix} Day ${day}`);

    for (let partIdx = 0; partIdx < lesson.parts.length; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at ${prefix} Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at ${prefix} Day ${day} Part ${partIdx}`);

      const visual = getVisual(prefix, day, partIdx);
      assert.ok(visual, `getVisual returned null for ${prefix} Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, expectedTemplate, `Expected template "${expectedTemplate}" for ${prefix}`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for ${prefix} Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for ${prefix} Day ${day} Part ${partIdx}`);
    }
  }
});
