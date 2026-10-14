import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { getLongLesson } from '../src/lib/data/longLessons';
import { getTappableLabelsForVisual } from '../src/lib/visuals/visualRules';

test('Java Basics Visuals Expansion: Days 6 to 20 On-Disk Spec Verification', () => {
  clearDayFileCache();
  const prefix = 'java-basics';
  const expectedTemplate = 'stack-queue';

  assert.equal(isCourseVisualsEnabled(prefix), true, `Course "${prefix}" must be enabled in enabledCourses`);

  for (const day of [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/${prefix}/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile(prefix, day);
    assert.ok(dayFile, `loadDayFile failed for ${prefix} Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, prefix);
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected exactly 5 entries in ${prefix} Day ${day}`);

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

test('Java Basics Duration Invariant: Days >= 11 Meet 20+ Spoken Min and 35-40 Total Min', () => {
  const { estimateSpokenMinutes, estimateLessonMinutes } = require('../src/lib/data/longLessons');
  for (const day of [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]) {
    const lesson = getLongLesson('java-basics', day);
    assert.ok(lesson);
    const spoken = estimateSpokenMinutes(lesson);
    const total = estimateLessonMinutes(lesson);

    assert.ok(spoken >= 20, `Day ${day} spoken duration must be >= 20 min, got ${spoken}`);
    assert.ok(total >= 35 && total <= 40, `Day ${day} total duration must be 35-40 min, got ${total}`);
  }
});

