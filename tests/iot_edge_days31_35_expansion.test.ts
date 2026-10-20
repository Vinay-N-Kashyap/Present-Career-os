import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson } from '../src/lib/data/longLessons';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { getTappableLabelsForVisual } from '../src/lib/visuals/visualRules';

test('Course 18: Edge AI, DSP & TinyML Systems (iot_edge) Month 2 Block 7 (Days 31–35) Expansion Verification Suite', async (t) => {
  clearDayFileCache();

  await t.test('1. Visuals enablement for iot_edge course prefix', () => {
    assert.equal(isCourseVisualsEnabled('iot_edge'), true, 'Course "iot_edge" must be enabled in enabledCourses');
  });

  await t.test('2. LongLessons structural integrity, pedagogical depth, and invariants for Days 31–35', () => {
    for (let day = 31; day <= 35; day++) {
      const lesson = getLongLesson('iot_edge', day);
      assert.ok(lesson, `Day ${day} must be resolved from getLongLesson('iot_edge', ${day})`);
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
        
        // Strict word count invariant: >= 580 words per part for rich pedagogical depth
        const partWords = part.say.reduce((acc, s) => acc + s.split(/\s+/).filter(Boolean).length, 0);
        assert.ok(partWords >= 580, `${ctx}: part words (${partWords}) must be >= 580 for rich pedagogical depth`);
        totalDayWords += partWords;

        assert.ok(part.example && part.example.length > 15, `${ctx}: example must provide clear intuition`);
        assert.ok(part.code && part.code.length > 50, `${ctx}: code must contain substantive runnable code`);
        assert.ok(part.output && part.output.length > 0, `${ctx}: output must specify expected terminal output`);
        assert.ok(Array.isArray(part.codeNotes) && part.codeNotes.length >= 3, `${ctx}: codeNotes must have at least 3 annotated lines`);
        assert.ok(part.tryIt && typeof part.tryIt === 'string' && part.tryIt.length > 15, `${ctx}: tryIt must provide actionable string challenge`);

        // Check question
        const chk = part.check;
        assert.ok(chk, `${ctx}: check question must exist`);
        assert.ok(chk.question && chk.question.length > 10, `${ctx}: question text must be rigorous`);
        assert.equal(chk.options.length, 4, `${ctx}: must have exactly 4 multiple choice options`);
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

  await t.test('3. On-disk visual JSON files and raw SHA-256 codeHash contracts for Days 31–35', async () => {
    for (let day = 31; day <= 35; day++) {
      const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/iot_edge/day-${day}.json`);
      assert.ok(fs.existsSync(filePath), `Visual day file must exist on disk: ${filePath}`);

      const dayFile = loadDayFile('iot_edge', day);
      assert.ok(dayFile, `loadDayFile('iot_edge', ${day}) must successfully load`);
      assert.equal(dayFile.schemaVersion, 1, `Day ${day} schemaVersion must be 1`);
      assert.equal(dayFile.prefix, 'iot_edge', `Day ${day} prefix must be iot_edge`);
      assert.equal(dayFile.day, day, `Day ${day} day must be ${day}`);
      assert.equal(dayFile.entries.length, 5, `Day ${day} entries length must be 5`);

      const lesson = getLongLesson('iot_edge', day);

      for (let pIdx = 0; pIdx < 5; pIdx++) {
        const entry = dayFile.entries[pIdx];
        const part = lesson.parts[pIdx];
        const ctx = `Day ${day} Part ${pIdx + 1}`;

        assert.equal(entry.partTitle, part.title, `${ctx}: partTitle mismatch`);
        const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
        assert.equal(entry.codeHash, expectedHash, `${ctx}: SHA-256 codeHash mismatch between lesson code and visual contract`);

        const visual = getVisual('iot_edge', day, pIdx);
        assert.ok(visual, `${ctx}: getVisual must return valid visual object`);
        assert.equal(visual.template, 'register-bits', `${ctx}: template must be "register-bits"`);
        assert.equal(visual.steps.length, 4, `${ctx}: visual must have 4 synchronized steps`);
        assert.deepEqual(
          visual.steps.map(s => s.at),
          ['intro', 'say1', 'example', 'tryIt'],
          `${ctx}: visual steps must match ['intro', 'say1', 'example', 'tryIt']`
        );

        const labels = getTappableLabelsForVisual(visual);
        assert.ok(labels.length > 0, `${ctx}: tappable labels must not be empty`);
      }
    }
  });

  await t.test('4. Block 7 Milestone: Day 35 Milestone 6 Micro-Vision Centroid Pipeline Engine', () => {
    const d35Lesson = getLongLesson('iot_edge', 35);
    assert.ok(d35Lesson, 'Day 35 lesson must exist');
    assert.equal(d35Lesson.day, 35, 'Day 35 must be Day 35');
    assert.ok(d35Lesson.title.includes('Milestone 6') && d35Lesson.title.includes('Micro-Vision Centroid'), 'Title must declare Milestone 6 Micro-Vision Centroid Engine');
    
    // Check Part 5 certification ledger output
    const d35p5 = d35Lesson.parts[4];
    assert.ok(d35p5.output.includes('Milestone 6') || d35p5.output.includes('Edge Micro-Vision Architect'), 'Day 35 Part 5 must confer Edge Micro-Vision Architect title');
  });

  await t.test('5. Complete Course 18 Total Days Count (35/35 Days Verified)', () => {
    for (let day = 1; day <= 35; day++) {
      const lesson = getLongLesson('iot_edge', day);
      assert.ok(lesson, `Day ${day} must exist in Course 18`);
      assert.equal(lesson.day, day, `Day ${day} day number must match`);
    }
  });
});
