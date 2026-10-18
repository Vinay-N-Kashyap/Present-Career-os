import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson } from '../src/lib/data/longLessons';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { getTappableLabelsForVisual } from '../src/lib/visuals/visualRules';

test('Course 14: IoT, Firmware & Embedded Systems (iot_emb) Month 2 Block 10 (Days 46–50) FOTA, Fleet Management & Milestone 9 Suite', async (t) => {
  clearDayFileCache();

  await t.test('1. Visuals enablement for iot_emb course prefix', () => {
    assert.equal(isCourseVisualsEnabled('iot_emb'), true, 'Course "iot_emb" must be enabled in enabledCourses');
  });

  await t.test('2. LongLessons structural integrity, pedagogical depth, and invariants for Days 46–50', () => {
    for (let day = 46; day <= 50; day++) {
      const lesson = getLongLesson('iot_emb', day);
      assert.ok(lesson, `Day ${day} must be resolved from getLongLesson('iot_emb', ${day})`);
      assert.equal(lesson.day, day, `Day mismatch for Day ${day}`);
      assert.ok(lesson.title && lesson.title.length > 10, `Day ${day} must have a descriptive title`);
      assert.ok(lesson.goal && lesson.goal.length > 25, `Day ${day} must have a rigorous goal`);
      
      // Strict 35-40 min class duration requirement
      assert.ok(lesson.minutes >= 35 && lesson.minutes <= 40, `Day ${day} minutes (${lesson.minutes}) must be in strict 35-40 min range`);
      
      assert.ok(lesson.recap && lesson.recap.length > 20, `Day ${day} must have a contextual recap`);
      assert.ok(Array.isArray(lesson.parts), `Day ${day} parts must be an array`);
      assert.equal(lesson.parts.length, 5, `Day ${day} must contain exactly 5 parts`);

      let totalDayWords = 0;

      // Verify each part
      for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
        const part = lesson.parts[pIdx];
        const ctx = `Day ${day} Part ${pIdx + 1} (${part.title})`;

        assert.ok(part.title && part.title.length > 5, `${ctx}: title must be non-empty`);
        assert.ok(Array.isArray(part.say) && part.say.length >= 4, `${ctx}: say must have at least 4 deep explanations`);
        
        // Strict word count invariant: >= 580 words per part for 20+ min spoken avatar
        const partWords = part.say.reduce((acc, s) => acc + s.split(/\s+/).filter(Boolean).length, 0);
        assert.ok(partWords >= 580, `${ctx}: part words (${partWords}) must be >= 580 for rich pedagogical depth`);
        totalDayWords += partWords;

        assert.ok(part.example && part.example.length > 15, `${ctx}: example must provide clear intuition`);
        assert.ok(part.code && part.code.includes('#include'), `${ctx}: code must contain C++ standard includes`);
        assert.ok(part.code.includes('int main()'), `${ctx}: code must contain main function entrypoint`);
        assert.ok(part.output && part.output.length > 0, `${ctx}: output must specify expected terminal output`);
        assert.ok(Array.isArray(part.codeNotes) && part.codeNotes.length >= 2, `${ctx}: codeNotes must have at least 2 annotated lines`);
        assert.ok(part.tryIt && part.tryIt.length > 15, `${ctx}: tryIt must provide actionable extension`);

        // Check question
        const chk = part.check;
        assert.ok(chk, `${ctx}: check question must exist`);
        assert.ok(chk.question && chk.question.length > 10, `${ctx}: question text must be rigorous`);
        assert.ok(Array.isArray(chk.options) && chk.options.length >= 3, `${ctx}: must have at least 3 multiple choice options`);
        assert.equal(chk.answer, 0, `${ctx}: answer index must be 0 (first option correct convention)`);
        assert.ok(chk.why && chk.why.length > 20, `${ctx}: why must explain the reasoning thoroughly`);
      }

      // Total spoken avatar audio: >= 2400 words (20+ minutes)
      assert.ok(totalDayWords >= 2400, `Day ${day} total say words (${totalDayWords}) must be >= 2400 (20+ min spoken audio)`);

      // Summary and projectStep
      assert.ok(Array.isArray(lesson.summary) && lesson.summary.length >= 4, `Day ${day} summary must have at least 4 key takeaways`);
      assert.ok(lesson.projectStep && lesson.projectStep.title, `Day ${day} projectStep must have a title`);
      assert.ok(Array.isArray(lesson.projectStep.steps) && lesson.projectStep.steps.length >= 4, `Day ${day} projectStep must have at least 4 practical steps`);
    }
  });

  await t.test('3. On-disk visual JSON files and raw SHA-256 codeHash contracts for Days 46–50', async () => {
    for (let day = 46; day <= 50; day++) {
      const dayPadded = String(day).padStart(2, '0');
      const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/iot_emb/day-${dayPadded}.json`);
      assert.ok(fs.existsSync(filePath), `Visual day file must exist on disk: ${filePath}`);

      const dayFile = loadDayFile('iot_emb', day);
      assert.ok(dayFile, `loadDayFile('iot_emb', ${day}) must successfully load`);
      assert.equal(dayFile.schemaVersion, 1, `Day ${day} schemaVersion must be 1`);
      assert.equal(dayFile.prefix, 'iot_emb', `Day ${day} prefix must be iot_emb`);
      assert.equal(dayFile.day, day, `Day ${day} day must be ${day}`);
      assert.equal(dayFile.entries.length, 5, `Day ${day} entries length must be 5`);

      const lesson = getLongLesson('iot_emb', day);

      for (let pIdx = 0; pIdx < 5; pIdx++) {
        const entry = dayFile.entries[pIdx];
        const part = lesson.parts[pIdx];
        const ctx = `Day ${day} Part ${pIdx + 1}`;

        assert.equal(entry.partTitle, part.title, `${ctx}: partTitle mismatch`);
        const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
        assert.equal(entry.codeHash, expectedHash, `${ctx}: SHA-256 codeHash mismatch between lesson code and visual contract`);

        const visual = getVisual('iot_emb', day, pIdx);
        assert.ok(visual, `${ctx}: getVisual must return valid visual object`);
        assert.equal(visual.template, 'register-bits', `${ctx}: template must be "register-bits"`);
        assert.ok(visual.steps && visual.steps.length >= 4, `${ctx}: must have at least 4 progressive steps`);

        // Verify 4-step markers: intro, say1, example, tryIt
        const stepAts = visual.steps.map((s: any) => s.at);
        assert.ok(stepAts.includes('intro'), `${ctx}: steps must include "intro"`);
        assert.ok(stepAts.includes('say1'), `${ctx}: steps must include "say1"`);
        assert.ok(stepAts.includes('example'), `${ctx}: steps must include "example"`);
        assert.ok(stepAts.includes('tryIt'), `${ctx}: steps must include "tryIt"`);

        // Verify tappable labels
        const tappableLabels = getTappableLabelsForVisual(visual);
        assert.ok(Array.isArray(tappableLabels), `${ctx}: tappable labels must be an array`);
        assert.ok(tappableLabels.length >= 2, `${ctx}: should extract at least 2 register bit labels`);
      }
    }
  });

  await t.test('4. Milestone 9 Comprehensive Verification (Day 50)', () => {
    const day50 = getLongLesson('iot_emb', 50);
    assert.ok(day50, 'Day 50 must resolve');
    assert.equal(day50.minutes, 40, 'Milestone 9 must declare 40 minutes');
    assert.match(day50.title, /Milestone 9/i, 'Day 50 title must mention Milestone 9');
    
    // Check Part 5 of Day 50
    const m9Part = day50.parts[4];
    assert.match(m9Part.title, /Milestone 9/i, 'Day 50 Part 5 must be the Milestone 9 Execution');
    assert.ok(m9Part.code.includes('Milestone9MasterEngine'), 'Code must contain Milestone9MasterEngine class');
    assert.ok(m9Part.output.includes('MILESTONE 9 GATE VERDICT: FULLY PASSING & CERTIFIED OPERATIONAL'), 'Output must contain Milestone 9 PASS verdict');
  });
});
