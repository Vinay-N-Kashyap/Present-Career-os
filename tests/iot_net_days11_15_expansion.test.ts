import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { getLongLesson } from '../src/lib/data/longLessons';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { getTappableLabelsForVisual } from '../src/lib/visuals/visualRules';

test('Course 18: IoT Networking & Cloud Protocols (iot_net) Month 1 Block 3 (Days 11-15) Expansion & Milestone 3 Capstone Verification Suite', async (t) => {
  clearDayFileCache();

  await t.test('1. Visuals enablement for iot_net course prefix', () => {
    assert.equal(isCourseVisualsEnabled('iot_net'), true, 'Course "iot_net" must be enabled in enabledCourses');
  });

  await t.test('2. LongLessons structural integrity, pedagogical depth, and invariants for Days 11-15', () => {
    for (let day = 11; day <= 15; day++) {
      const lesson = getLongLesson('iot_net', day);
      assert.ok(lesson, `Day ${day} must be resolved from getLongLesson('iot_net', ${day})`);
      assert.equal(lesson.day, day, `Day mismatch for Day ${day}`);
      assert.ok(lesson.title && lesson.title.length > 10, `Day ${day} must have a descriptive title`);
      
      // Strict 38 min class duration requirement
      assert.equal(lesson.minutes, 38, `Day ${day} minutes must be strictly 38`);
      
      assert.ok(Array.isArray(lesson.parts), `Day ${day} parts must be an array`);
      assert.equal(lesson.parts.length, 5, `Day ${day} must contain exactly 5 parts`);

      let totalDayWords = 0;

      // Verify each part
      for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
        const part = lesson.parts[pIdx];
        const ctx = `Day ${day} Part ${pIdx + 1} (${part.title})`;

        assert.ok(part.title && part.title.length > 5, `${ctx}: title must be non-empty`);
        assert.ok(Array.isArray(part.say) && part.say.length >= 4, `${ctx}: say must have at least 4 deep explanations`);
        
        // Strict word count invariant: >= 580 words per part
        const partWords = part.say.reduce((acc, s) => acc + s.split(/\s+/).filter(Boolean).length, 0);
        assert.ok(partWords >= 580, `${ctx}: part words (${partWords}) must be >= 580 for rich pedagogical depth`);
        totalDayWords += partWords;

        assert.ok(part.example && part.example.length > 15, `${ctx}: example must provide clear intuition`);
        assert.ok(part.code && part.code.length > 50, `${ctx}: code must contain substantive runnable code`);
        assert.ok(part.output && part.output.length > 0, `${ctx}: output must specify expected terminal output`);
        assert.ok(Array.isArray(part.codeNotes) && part.codeNotes.length >= 3, `${ctx}: codeNotes must have >= 3 items`);
        assert.ok(typeof part.tryIt === 'string' && part.tryIt.length > 15, `${ctx}: tryIt must be a plain string challenge`);

        // Check question verification
        assert.ok(part.check, `${ctx}: check must be present`);
        assert.ok(part.check.question && part.check.question.length > 10, `${ctx}: check.question must be descriptive`);
        assert.ok(Array.isArray(part.check.options) && part.check.options.length === 4, `${ctx}: check.options must have exactly 4 items`);
        const ans = (part.check as any).answer !== undefined ? (part.check as any).answer : (part.check as any).answerIndex;
        assert.equal(ans, 0, `${ctx}: check.answer must be 0 (correct index)`);
        assert.ok(part.check.why && part.check.why.length > 20, `${ctx}: check.why must provide thorough explanation`);
      }

      // Assert total day words >= 3,000
      assert.ok(totalDayWords >= 3000, `Day ${day} total words (${totalDayWords}) must be >= 3,000 words`);

      // Summary and projectStep
      assert.ok(Array.isArray(lesson.summary) && lesson.summary.length >= 4, `Day ${day} summary must have >= 4 takeaways`);
      assert.ok(lesson.projectStep, `Day ${day} must include a projectStep`);
      assert.ok(lesson.projectStep.title && lesson.projectStep.title.length > 10, `Day ${day} projectStep must have a title`);
      assert.ok(Array.isArray(lesson.projectStep.steps) && lesson.projectStep.steps.length >= 4, `Day ${day} projectStep must have >= 4 steps`);
      assert.equal((lesson.projectStep as any).desc, undefined, `Day ${day} projectStep must NOT have 'desc' field`);
    }
  });

  await t.test('3. On-disk visual JSON files and raw SHA-256 codeHash contracts for Days 11-15', async () => {
    for (let day = 11; day <= 15; day++) {
      const paddedName = `day-${String(day).padStart(2, '0')}.json`;
      const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/iot_net/${paddedName}`);
      assert.ok(fs.existsSync(filePath), `Visual day file must exist on disk: ${filePath}`);

      const dayFile = loadDayFile('iot_net', day);
      assert.ok(dayFile, `loadDayFile('iot_net', ${day}) must successfully load`);
      assert.equal(dayFile.schemaVersion, 1, `Day ${day} schemaVersion must be 1`);
      assert.equal(dayFile.prefix, 'iot_net', `Day ${day} prefix must be iot_net`);
      assert.equal(dayFile.day, day, `Day ${day} day must be ${day}`);
      assert.equal(dayFile.entries.length, 5, `Day ${day} entries length must be 5`);

      const lesson = getLongLesson('iot_net', day);

      for (let pIdx = 0; pIdx < 5; pIdx++) {
        const entry = dayFile.entries[pIdx];
        const part = lesson.parts[pIdx];
        const ctx = `Day ${day} Part ${pIdx + 1}`;

        assert.equal(entry.partTitle, part.title, `${ctx}: partTitle mismatch`);
        const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
        assert.equal(entry.codeHash, expectedHash, `${ctx}: SHA-256 codeHash mismatch between lesson code and visual contract`);

        const visual = getVisual('iot_net', day, pIdx);
        assert.ok(visual, `${ctx}: getVisual must return valid visual spec`);
        assert.equal(visual.template, 'register-bits', `${ctx}: visual template must be register-bits`);
        assert.ok((visual as any).steps && (visual as any).steps.length >= 4, `${ctx}: visual must have >= 4 steps`);

        // Check tappable labels
        const labels = getTappableLabelsForVisual(visual);
        assert.ok(labels.length > 0, `${ctx}: must have tappable labels`);
      }
    }
  });

  await t.test('4. Dynamic Python code execution and deterministic output verification for Days 11-15', () => {
    for (let day = 11; day <= 15; day++) {
      const lesson = getLongLesson('iot_net', day);
      for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
        const part = lesson.parts[pIdx];
        const ctx = `Day ${day} Part ${pIdx + 1}`;
        
        // Execute python script via stdin
        const rawStdout = execSync('python -', {
          input: part.code,
          encoding: 'utf-8',
          timeout: 15000,
          env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
        });
        const stdout = rawStdout.replace(/\r\n/g, '\n').trim();
        const expected = part.output.replace(/\r\n/g, '\n').trim();

        assert.equal(stdout, expected, `${ctx}: Executed Python output does not match stored output`);
      }
    }
  });

  await t.test('5. Milestone 3 Capstone Invariant Verification for Day 15', () => {
    const day15 = getLongLesson('iot_net', 15);
    assert.ok(day15, 'Day 15 must exist');
    assert.ok(day15.title.includes('Milestone 3 Capstone'), 'Day 15 title must state Milestone 3 Capstone');
    
    const capstonePart = day15.parts[4];
    assert.ok(capstonePart.title.includes('Milestone 3 Capstone'), 'Day 15 Part 5 must be the Milestone 3 Capstone');
    assert.ok(capstonePart.code.includes('class BLELinkLayerEngine'), 'Capstone code must define BLELinkLayerEngine');
    assert.ok(capstonePart.code.includes('BLE_LINK_LAYER_ENGINE_GRADE_A_PLUS_CERTIFIED'), 'Capstone code must define BLE_LINK_LAYER_ENGINE_GRADE_A_PLUS_CERTIFIED');
    assert.ok(capstonePart.output.includes('BLE_LINK_LAYER_ENGINE_GRADE_A_PLUS_CERTIFIED'), 'Capstone output must contain BLE_LINK_LAYER_ENGINE_GRADE_A_PLUS_CERTIFIED');
  });

  await t.test('6. Cumulative Month 1 Course 18 Progress Verification (Days 1-15)', () => {
    for (let day = 1; day <= 15; day++) {
      const lesson = getLongLesson('iot_net', day);
      assert.ok(lesson, `Day ${day} of Course 18 must be fully present in registry`);
      assert.equal(lesson.parts.length, 5, `Day ${day} must have 5 parts`);
    }
  });
});
