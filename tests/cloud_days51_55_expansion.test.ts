import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { getLongLesson } from '../src/lib/data/longLessons';
import { CLOUD_WEB_LONG_LESSONS } from '../src/lib/data/cloudWebLongLessons';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { loadDayFile, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { compileTs } from '../src/lib/code/ts/compileTs';

// TypeScript runner for Cloud snippets using project's compileTs
async function runTypeScriptSnippet(code: string): Promise<string> {
  const compiled = await compileTs(code);
  const out: string[] = [];

  const sandbox = {
    console: {
      log: (...args: unknown[]) => out.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
    },
    Math,
    Map,
    Set,
    String,
    Number,
    Boolean,
    Array,
    Object,
    JSON
  };
  vm.runInNewContext(compiled.js, sandbox, { timeout: 2000 });
  return out.join('\n');
}

test('Course 16: Cloud Native AWS Architecture (cloud) Month 2 Block 11 Expansion Suite', async (t) => {
  clearDayFileCache();

  await t.test('1. Visuals enablement for cloud course prefix', () => {
    assert.equal(isCourseVisualsEnabled('cloud'), true, 'cloud course prefix must have visuals support enabled');
  });

  const availableDays = [51];

  await t.test('2. LongLessons structural integrity, pedagogical depth, and invariants for Block 11', () => {
    for (const day of availableDays) {
      const lesson = getLongLesson('cloud', day) || CLOUD_WEB_LONG_LESSONS.find(l => l.day === day);
      assert.ok(lesson, `Day ${day} must exist in cloudWebLongLessons.ts registry`);
      assert.equal(lesson.coursePrefix, 'cloud', `Day ${day} coursePrefix must be 'cloud'`);
      assert.equal(lesson.day, day, `Day property must match ${day}`);
      assert.ok(lesson.title && lesson.title.length > 5, `Day ${day} must have a descriptive title`);
      assert.ok(lesson.parts && lesson.parts.length === 5, `Day ${day} must have exactly 5 parts, found ${lesson.parts?.length}`);
      assert.ok(lesson.summary && Array.isArray(lesson.summary) && lesson.summary.length >= 4, `Day ${day} must have summary array >= 4 points`);

      let totalDayWords = 0;

      for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
        const part = lesson.parts[pIdx];
        const partNum = pIdx + 1;

        assert.ok(part.title && part.title.length > 5, `Day ${day} Part ${partNum} must have a title`);
        assert.ok(Array.isArray(part.say) && part.say.length >= 3, `Day ${day} Part ${partNum} must have say array >= 3 paragraphs`);

        const partWords = part.say.reduce((sum, para) => sum + para.trim().split(/\s+/).filter(Boolean).length, 0);
        totalDayWords += partWords;

        assert.ok(
          partWords >= 580,
          `Day ${day} Part ${partNum} word count must be >= 580 words (found ${partWords} words)`
        );

        // Deterministic code & output
        assert.ok(part.code && part.code.trim().length > 20, `Day ${day} Part ${partNum} must have runnable code snippet`);
        assert.ok(part.output && part.output.trim().length > 0, `Day ${day} Part ${partNum} must have expected deterministic output`);
        assert.ok(Array.isArray(part.codeNotes) && part.codeNotes.length >= 2, `Day ${day} Part ${partNum} must have >= 2 codeNotes`);

        // Strict Diagnostic MCQ invariants
        assert.ok(part.check, `Day ${day} Part ${partNum} must have diagnostic check`);
        assert.ok(part.check.question && part.check.question.length > 10, `Day ${day} Part ${partNum} check must have question`);
        assert.ok(Array.isArray(part.check.options) && part.check.options.length === 4, `Day ${day} Part ${partNum} check must have exactly 4 options`);
        assert.equal(part.check.answer, 0, `Day ${day} Part ${partNum} check answer must be 0 (correct engineering pattern first)`);
        assert.ok(part.check.explanation && part.check.explanation.length > 15, `Day ${day} Part ${partNum} check must have architectural explanation`);
      }

      assert.ok(
        totalDayWords >= 3000,
        `Day ${day} total spoken words must be >= 3000 (found ${totalDayWords} words, avatar speaking >= 20 mins)`
      );
    }
  });

  await t.test('3. Visuals file verification, step synchronizations, and SHA-256 bindings for Block 11', async () => {
    for (const day of availableDays) {
      const dayData = await loadDayFile('cloud', day);
      assert.ok(dayData, `Visuals day file for Day ${day} must exist`);
      assert.equal(dayData.schemaVersion, 2, `Day ${day} visuals schemaVersion must be 2`);
      assert.equal(dayData.prefix, 'cloud', `Day ${day} visuals prefix must be 'cloud'`);
      assert.equal(dayData.day, day, `Day ${day} visuals day property must match ${day}`);
      assert.equal(dayData.entries.length, 5, `Day ${day} visuals entries length must be exactly 5 (one per part)`);

      const lesson = getLongLesson('cloud', day) || CLOUD_WEB_LONG_LESSONS.find(l => l.day === day)!;

      for (let eIdx = 0; eIdx < dayData.entries.length; eIdx++) {
        const entry = dayData.entries[eIdx];
        const part = lesson.parts[eIdx];

        assert.equal(entry.partTitle, part.title, `Day ${day} entry [${eIdx}] partTitle must match part.title`);
        assert.equal(entry.spec.template, 'compare', `Day ${day} entry [${eIdx}] spec.template must be 'compare'`);

        // SHA-256 verification
        const expectedHash = crypto.createHash('sha256').update(part.code.trim()).digest('hex');
        assert.equal(entry.codeHash, expectedHash, `Day ${day} entry [${eIdx}] codeHash must match sha256(part.code)`);

        // Step sync verification
        assert.equal(entry.spec.steps.length, 4, `Day ${day} entry [${eIdx}] must have exactly 4 steps`);
        assert.deepEqual(
          entry.spec.steps.map(s => s.at),
          ['say1', 'say2', 'example', 'tryIt'],
          `Day ${day} entry [${eIdx}] step synchronization targets must be say1, say2, example, tryIt`
        );

        for (const step of entry.spec.steps) {
          assert.ok(step.annotation && step.annotation.length <= 75, `Step annotation length must be <= 75 chars: "${step.annotation}"`);
          assert.ok(step.annotation.endsWith('.'), `Step annotation must end with period: "${step.annotation}"`);
          assert.ok(!/\d/.test(step.annotation), `Step annotation must have 0 digits: "${step.annotation}"`);
        }
      }
    }
  });

  await t.test('4. Deterministic execution sandbox verification for Block 11 code snippets', async () => {
    for (const day of availableDays) {
      const lesson = getLongLesson('cloud', day) || CLOUD_WEB_LONG_LESSONS.find(l => l.day === day)!;

      for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
        const part = lesson.parts[pIdx];
        const expected = part.output.trim().replace(/\r\n/g, '\n');

        const actualRaw = await runTypeScriptSnippet(part.code);
        const actual = actualRaw.trim().replace(/\r\n/g, '\n');

        assert.equal(
          actual,
          expected,
          `Day ${day} Part ${pIdx + 1} execution stdout mismatch:\nExpected:\n${expected}\nActual:\n${actual}`
        );
      }
    }
  });
});
