import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  getVisual,
  loadDayFile,
  registerDayFile,
  clearDayFileCache,
  type LessonVisualDayFile,
} from '@/lib/visuals/loadVisuals';
import { ENABLED_COURSES, isCourseVisualsEnabled } from '@/lib/visuals/enabledCourses';

describe('Loader and Release Switch (Task E-15)', () => {
  it('enabledCourses starts as ["python"]', () => {
    assert.deepEqual(ENABLED_COURSES, ['python']);
    assert.equal(isCourseVisualsEnabled('python'), true);
    assert.equal(isCourseVisualsEnabled('dsa-py'), false);
    assert.equal(isCourseVisualsEnabled('sql-mastery'), false);
    assert.equal(isCourseVisualsEnabled('ai-py'), false);
  });

  it('enabled course loads visuals for python Days 1–3 from pilot file', () => {
    // Day 1, Part 0
    const v1_0 = getVisual('python', 1, 0);
    assert.ok(v1_0, 'Expected visual for python:1:0');
    assert.equal(v1_0.template, 'flow');
    assert.equal(v1_0.title, 'From your instructions to the screen');

    // Day 2, Part 0
    const v2_0 = getVisual('python', 2, 0);
    assert.ok(v2_0, 'Expected visual for python:2:0');
    assert.equal(v2_0.template, 'boxes');

    // Day 3, Part 0 is flow, Part 1 is letters
    const v3_0 = getVisual('python', 3, 0);
    assert.ok(v3_0, 'Expected visual for python:3:0');
    assert.equal(v3_0.template, 'flow');

    const v3_1 = getVisual('python', 3, 1);
    assert.ok(v3_1, 'Expected visual for python:3:1');
    assert.equal(v3_1.template, 'letters');
  });

  it('disabled course gets no visuals (returns null)', () => {
    const disabledCourses = ['dsa-py', 'sql-mastery', 'ai-py', 'dist-py', 'cloud-py', 'nlp-py'];
    for (const prefix of disabledCourses) {
      assert.equal(isCourseVisualsEnabled(prefix), false);
      const v = getVisual(prefix, 1, 0);
      assert.equal(v, null, `Disabled course "${prefix}" must get no visuals`);
    }
  });

  it('missing file gets no visual and no crash', () => {
    // Python day 25 has no day file yet
    assert.doesNotThrow(() => {
      const v = getVisual('python', 25, 0);
      assert.equal(v, null);
    });

    // Out of bound day/part numbers
    assert.doesNotThrow(() => {
      const v = getVisual('python', 999, 999);
      assert.equal(v, null);
    });

    assert.doesNotThrow(() => {
      const v = getVisual('unknown-prefix', 1, 0);
      assert.equal(v, null);
    });
  });

  it('loads visual from registered day file for enabled course', () => {
    clearDayFileCache();

    const mockDayFile: LessonVisualDayFile = {
      schemaVersion: 1,
      prefix: 'python',
      day: 15,
      promptSha: 'mock-sha',
      model: 'test-model',
      entries: [
        {
          partTitle: 'Mock Part With Visual',
          codeHash: 'hash1',
          spec: { template: 'cells' },
          filled: {
            template: 'cells',
            title: 'Mock Cells Visual',
            cells: [{ label: '10' }, { label: '20' }],
            steps: [
              { at: 'say1', caption: 'Step one.', pointers: {} },
              { at: 'say2', caption: 'Step two.', pointers: {} },
            ],
          },
        },
        {
          partTitle: 'Mock Part None',
          codeHash: 'hash2',
          spec: { template: 'none', reason: 'Not needed' },
          filled: {},
        },
      ],
    };

    registerDayFile(mockDayFile);

    // Part 0 has a visual
    const visual0 = getVisual('python', 15, 0);
    assert.ok(visual0);
    assert.equal(visual0.template, 'cells');
    assert.equal(visual0.title, 'Mock Cells Visual');

    // Part 1 has template 'none' -> should return null
    const visual1 = getVisual('python', 15, 1);
    assert.equal(visual1, null);

    // Part 2 is out of range -> should return null
    const visual2 = getVisual('python', 15, 2);
    assert.equal(visual2, null);

    clearDayFileCache();
  });

  it('useLessonEngine.ts does not import PYTHON_M1_VISUALS directly', () => {
    const engineHookPath = path.resolve(
      process.cwd(),
      'src/app/quests/lesson/hooks/useLessonEngine.ts'
    );
    const content = fs.readFileSync(engineHookPath, 'utf-8');
    assert.ok(
      !content.includes('PYTHON_M1_VISUALS'),
      'useLessonEngine.ts must not contain direct reference to PYTHON_M1_VISUALS'
    );
    assert.ok(
      content.includes('getVisual('),
      'useLessonEngine.ts must invoke getVisual'
    );
  });
});
