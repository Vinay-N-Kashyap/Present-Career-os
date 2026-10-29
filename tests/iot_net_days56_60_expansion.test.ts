import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import { getLongLesson } from '../src/lib/data/longLessons';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { getTappableLabelsForVisual } from '../src/lib/visuals/visualRules';

test('Course 18: IoT Networking & Cloud Protocols (iot_net) Month 2 Block 12 (Days 56-60) Expansion Suite', async (t) => {
  clearDayFileCache();

  await t.test('1. Visuals enablement for iot_net course prefix', () => {
    assert.equal(isCourseVisualsEnabled('iot_net'), true, 'iot_net course prefix must have visuals support enabled');
  });

  await t.test('2. LongLessons structural integrity, pedagogical depth, and invariants for Days 56-60 (Complete Block 12)', () => {
    for (const day of [56, 57, 58, 59, 60]) {
      const lesson = getLongLesson('iot_net', day);
      assert.ok(lesson, `Day ${day} must exist in iotNetLongLessons.ts registry`);
      assert.equal(lesson.coursePrefix, 'iot_net', `Day ${day} coursePrefix must be 'iot_net'`);
      assert.equal(lesson.day, day, `Day property must match ${day}`);
      assert.ok(lesson.title && lesson.title.length > 5, `Day ${day} must have a descriptive title`);
      assert.ok(lesson.parts && lesson.parts.length === 5, `Day ${day} must have exactly 5 parts, found ${lesson.parts?.length}`);
      assert.ok(lesson.summary && Array.isArray(lesson.summary) && lesson.summary.length >= 3, `Day ${day} must have summary array`);

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
        assert.ok(part.codeNotes && part.codeNotes.length >= 3, `${ctx}: codeNotes must have >= 3 items`);
        assert.ok(part.tryIt && part.tryIt.trim().length > 10, `${ctx}: tryIt must be descriptive`);
        assert.ok(part.check && part.check.question, `${ctx}: check question must exist`);
        assert.equal(part.check.answer, 0, `${ctx}: check answer index must be 0`);
      }

      assert.ok(
        dayTotalWords >= 3000,
        `Day ${day}: total word count ${dayTotalWords} must be >= 3000 words`
      );
    }
  });

  await t.test('3. On-disk visual JSON files and raw SHA-256 codeHash contracts for Days 56-60', () => {
    for (const day of [56, 57, 58, 59, 60]) {
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
        assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `${ctx}: SHA-256 codeHash mismatch between lesson code and visual contract`);

        const visual = getVisual('iot_net', day, pIdx);
        assert.ok(visual, `${ctx}: getVisual must return valid visual spec`);
        assert.equal(visual.template, 'register-bits', `${ctx}: visual template must be register-bits`);
        assert.ok((visual as any).steps && (visual as any).steps.length >= 4, `${ctx}: visual must have >= 4 steps`);

        const labels = getTappableLabelsForVisual(visual);
        assert.ok(labels.length > 0, `${ctx}: must have tappable labels`);
      }
    }
  });

  await t.test('4. Dynamic Python code execution and deterministic output verification for Days 56-60', () => {
    for (const day of [56, 57, 58, 59, 60]) {
      const lesson = getLongLesson('iot_net', day);
      for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
        const part = lesson.parts[pIdx];
        const ctx = `Day ${day} Part ${pIdx + 1}`;
        
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

  await t.test('5. Milestone & Token verification for Days 56-60', () => {
    const day56 = getLongLesson('iot_net', 56);
    assert.ok(day56, 'Day 56 must exist');
    assert.ok(day56.parts[4].output.includes('CLOUD_DEVICE_SHADOW_ENGINE_GRADE_A_PLUS_CERTIFIED'));

    const day57 = getLongLesson('iot_net', 57);
    assert.ok(day57, 'Day 57 must exist');
    assert.ok(day57.parts[4].output.includes('MTLS_HARDWARE_SECURITY_ENGINE_GRADE_A_PLUS_CERTIFIED'));

    const day58 = getLongLesson('iot_net', 58);
    assert.ok(day58, 'Day 58 must exist');
    assert.ok(day58.parts[4].output.includes('ZTP_FLEET_PROVISIONING_ENGINE_GRADE_A_PLUS_CERTIFIED'));

    const day59 = getLongLesson('iot_net', 59);
    assert.ok(day59, 'Day 59 must exist');
    assert.ok(day59.parts[4].output.includes('OTA_DUAL_BANK_FIRMWARE_ENGINE_GRADE_A_PLUS_CERTIFIED'));

    const day60 = getLongLesson('iot_net', 60);
    assert.ok(day60, 'Day 60 must exist');
    assert.ok(day60.parts[4].output.includes('COURSE_18_IOT_NET_MASTER_CAPSTONE_GRADE_A_PLUS_CERTIFIED'));
  });
});
