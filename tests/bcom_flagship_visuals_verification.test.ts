import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { getLongLesson } from '../src/lib/data/longLessons';
import { getTappableLabelsForVisual } from '../src/lib/visuals/visualRules';

test('Block 147: Flagship Commerce & B.Com On-Disk Visual Suites (Days 1–5 across all 14 specializations)', () => {
  clearDayFileCache();
  const bcomExpectations: Array<{ prefix: string; expectedTemplate: string }> = [
    { prefix: 'bcom-accounting', expectedTemplate: 'ledger-sheet' },
    { prefix: 'bcom-finance', expectedTemplate: 'ledger-sheet' },
    { prefix: 'bcom_tax', expectedTemplate: 'ledger-sheet' },
    { prefix: 'bcom_aud', expectedTemplate: 'ledger-sheet' },
    { prefix: 'bcom_ban', expectedTemplate: 'ledger-sheet' },
    { prefix: 'bcom_law', expectedTemplate: 'ledger-sheet' },
    { prefix: 'bcom_ops', expectedTemplate: 'workflow' },
    { prefix: 'bcom_ait', expectedTemplate: 'tree-graph' },
    { prefix: 'bcom_ana', expectedTemplate: 'bars' },
    { prefix: 'bcom_scrm', expectedTemplate: 'funnel' },
    { prefix: 'bcom_ent', expectedTemplate: 'funnel' },
    { prefix: 'bcom_ecom', expectedTemplate: 'funnel' },
    { prefix: 'bcom_dmkt', expectedTemplate: 'funnel' },
    { prefix: 'bcom-marketing', expectedTemplate: 'funnel' },
  ];

  for (const { prefix, expectedTemplate } of bcomExpectations) {
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
      assert.equal(dayFile.entries.length, 5, `Expected 5 entries in ${prefix} Day ${day}`);

      const lesson = getLongLesson(prefix, day);
      assert.ok(lesson, `LongLesson missing for ${prefix} Day ${day}`);
      assert.equal(lesson.parts.length, 5, `Expected 5 parts in LongLesson for ${prefix} Day ${day}`);

      for (let partIdx = 0; partIdx < 5; partIdx++) {
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
