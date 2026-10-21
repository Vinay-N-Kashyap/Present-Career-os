import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson } from '../src/lib/data/longLessons';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { getTappableLabelsForVisual } from '../src/lib/visuals/visualRules';

test('Course 18: IoT Networking & Cloud Protocols (iot_net) Month 1 Block 4 (Days 16-20) Expansion & Milestone 4 Capstone Verification Suite', async (t) => {
  clearDayFileCache();

  await t.test('1. Visuals enablement for iot_net course prefix', () => {
    assert.equal(isCourseVisualsEnabled('iot_net'), true, 'iot_net course prefix must have visuals support enabled');
  });

  await t.test('2. LongLessons structural integrity, pedagogical depth, and invariants for Days 16-20', () => {
    for (let day = 16; day <= 20; day++) {
      const lesson = getLongLesson('iot_net', day);
      assert.ok(lesson, `Day ${day} must exist in iotNetLongLessons.ts registry`);
      assert.equal(lesson.coursePrefix, 'iot_net', `Day ${day} coursePrefix must be 'iot_net'`);
      assert.equal(lesson.day, day, `Day property must match ${day}`);
      assert.ok(lesson.title && lesson.title.length > 5, `Day ${day} must have a descriptive title`);
      assert.ok(lesson.parts && lesson.parts.length === 5, `Day ${day} must have exactly 5 parts, found ${lesson.parts?.length}`);

      let dayTotalWords = 0;

      for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
        const part = lesson.parts[pIdx];
        const ctx = `Day ${day} Part ${pIdx + 1} ('${part.title}')`;

        assert.ok(part.title && part.title.length > 0, `${ctx}: title must not be empty`);
        assert.ok(part.say && Array.isArray(part.say) && part.say.length >= 3, `${ctx}: say array must contain >= 3 paragraphs`);
        
        const partWordCount = part.say.join(' ').split(/\s+/).filter(Boolean).length;
        dayTotalWords += partWordCount;
        assert.ok(
          partWordCount >= 580,
          `${ctx}: word count ${partWordCount} must be >= 580 words for rigorous pedagogical depth`
        );

        assert.ok(part.code && part.code.trim().length > 0, `${ctx}: code snippet must not be empty`);
        assert.ok(part.output && part.output.trim().length > 0, `${ctx}: expected output must not be empty`);
      }

      assert.ok(
        dayTotalWords >= 3000,
        `Day ${day}: total word count ${dayTotalWords} must be >= 3000 words`
      );
    }
  });

  await t.test('3. On-disk visual JSON files and raw SHA-256 codeHash contracts for Days 16-20', () => {
    for (let day = 16; day <= 20; day++) {
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

  await t.test('4. Dynamic Python code execution and deterministic output verification for Days 16-20', () => {
    for (let day = 16; day <= 20; day++) {
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

  await t.test('5. Milestone 4 Capstone Invariant Verification for Day 20', () => {
    const day20 = getLongLesson('iot_net', 20);
    assert.ok(day20, 'Day 20 must exist');
    assert.ok(day20.title.includes('Milestone 4 Capstone'), 'Day 20 title must state Milestone 4 Capstone');
    
    const capstonePart = day20.parts[4];
    assert.ok(capstonePart.title.includes('Milestone 4 Capstone'), 'Day 20 Part 5 must be the Milestone 4 Capstone');
    assert.ok(capstonePart.code.includes('class SixLoWPANEngine'), 'Capstone code must define SixLoWPANEngine');
    assert.ok(capstonePart.code.includes('SIXLOWPAN_COMPRESSION_AND_FRAGMENTATION_GRADE_A_PLUS_CERTIFIED'), 'Capstone code must define SIXLOWPAN_COMPRESSION_AND_FRAGMENTATION_GRADE_A_PLUS_CERTIFIED');
    assert.ok(capstonePart.output.includes('SIXLOWPAN_COMPRESSION_AND_FRAGMENTATION_GRADE_A_PLUS_CERTIFIED'), 'Capstone output must contain SIXLOWPAN_COMPRESSION_AND_FRAGMENTATION_GRADE_A_PLUS_CERTIFIED');
  });

  await t.test('6. Cumulative Month 1 Course 18 Progress Verification (Days 1-20)', () => {
    for (let d = 1; d <= 20; d++) {
      const l = getLongLesson('iot_net', d);
      assert.ok(l, `Cumulative registry integrity check: Day ${d} must exist`);
      assert.equal(l.parts.length, 5, `Day ${d} must have 5 parts`);
    }
  });
});
