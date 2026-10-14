import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';

test('Master Standalone Visuals E2E: All 25 Standalone & B.Com Tracks Persisted On Disk', () => {
  clearDayFileCache();
  const allStandalonePrefixes = [
    // 4 IoT & Hardware
    'iot_emb', 'iot_net', 'iot_edge', 'iot_sec',
    // 4 Launchpad & Core
    'comp_fund', 'git_vcs', 'excel_viz', 'soft-skills',
    // 7 Advanced Systems & Graphics
    'java-basics', 'mobile', 'fullstack-js', 'design', 'blockchain', 'g3d', 'quant-systems',
    // 14 Commerce & B.Com Specializations
    'bcom-accounting', 'bcom-finance', 'bcom_tax', 'bcom_aud', 'bcom_ban', 'bcom_law',
    'bcom_ops', 'bcom_ait', 'bcom_ana', 'bcom_scrm', 'bcom_ent', 'bcom_ecom', 'bcom_dmkt', 'bcom-marketing'
  ];

  let verifiedDayFiles = 0;

  for (const prefix of allStandalonePrefixes) {
    assert.equal(isCourseVisualsEnabled(prefix), true, `Prefix "${prefix}" must be enabled in enabledCourses`);

    const dir = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/${prefix}`);
    assert.ok(fs.existsSync(dir), `Visuals directory missing for "${prefix}" at ${dir}`);

    for (let day = 1; day <= 5; day++) {
      const dayPadded = String(day).padStart(2, '0');
      const filePath = path.join(dir, `day-${dayPadded}.json`);
      assert.ok(fs.existsSync(filePath), `Day file missing: ${filePath}`);

      const dayFile = loadDayFile(prefix, day);
      assert.ok(dayFile, `loadDayFile returned null for ${prefix} Day ${day}`);
      assert.equal(dayFile.schemaVersion, 1);
      assert.equal(dayFile.prefix, prefix);
      assert.equal(dayFile.day, day);
      assert.ok(dayFile.entries.length >= 4, `Expected >= 4 entries in ${prefix} Day ${day}`);

      const v0 = getVisual(prefix, day, 0);
      assert.ok(v0, `getVisual returned null for ${prefix} Day ${day} Part 0`);
      assert.ok(v0.template, `Visual must have a valid template`);
      assert.equal(v0.steps.length, 4, `Visual must have 4 steps for ${prefix} Day ${day} Part 0`);

      verifiedDayFiles++;
    }
  }

  assert.equal(verifiedDayFiles, 29 * 5, `Expected exactly 145 on-disk visual day files across all 29 standalone course prefixes`);
  console.log(`Verified ${verifiedDayFiles} on-disk visual day files across ${allStandalonePrefixes.length} course tracks!`);
});

test('Master Visuals Catalog Parity: Total On-Disk Visual File Volume', () => {
  const visualsDir = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals');
  const dirs = fs.readdirSync(visualsDir).filter(d => fs.statSync(path.join(visualsDir, d)).isDirectory());

  let totalJsonFiles = 0;
  for (const d of dirs) {
    const files = fs.readdirSync(path.join(visualsDir, d)).filter(f => f.startsWith('day-') && f.endsWith('.json'));
    totalJsonFiles += files.length;
  }

  // 23 cert tracks * 30 files (690) + 29 standalone tracks * 5 files (145) = 835 files
  assert.ok(totalJsonFiles >= 835, `Expected >= 835 total visual day files, found ${totalJsonFiles}`);
  console.log(`Total on-disk lesson visual files across all courses: ${totalJsonFiles} files across ${dirs.length} course directories!`);
});
