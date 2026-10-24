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

test('Course 16: Cloud Native AWS Architecture (cloud) Month 2 Block 10 Expansion Suite', async (t) => {
  clearDayFileCache();

  await t.test('1. Visuals enablement for cloud course prefix', () => {
    assert.equal(isCourseVisualsEnabled('cloud'), true, 'cloud course prefix must have visuals support enabled');
  });

  const availableDays = [46, 47, 48];

  await t.test('2. LongLessons structural integrity, pedagogical depth, and invariants for Block 10', () => {
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
        assert.ok(part.check, `Day ${day} Part ${partNum} must have diagnostic check object`);
        assert.ok(part.check.question && part.check.question.length > 10, `Day ${day} Part ${partNum} must have a detailed diagnostic question`);
        assert.ok(Array.isArray(part.check.options) && part.check.options.length === 4, `Day ${day} Part ${partNum} check must have exactly 4 options`);
        assert.equal(part.check.answer, 0, `Day ${day} Part ${partNum} check.answer must be 0 (invariant: first option is always the correct engineering answer)`);
        assert.ok(part.check.explanation && part.check.explanation.length > 30, `Day ${day} Part ${partNum} check must provide detailed architectural explanation`);
      }

      assert.ok(
        totalDayWords >= 3000,
        `Day ${day} total word count must be >= 3,000 words (found ${totalDayWords} words, avatar speaking >= 20 mins)`
      );
    }
  });

  await t.test('3. Visuals file verification, step synchronizations, and SHA-256 bindings for Block 10', () => {
    for (const day of availableDays) {
      const dayFile = loadDayFile('cloud', day);
      assert.ok(dayFile, `Visuals day file for Day ${day} must exist and load successfully`);
      assert.equal(dayFile.schemaVersion, 2, `Day ${day} visual file schemaVersion must be 2`);
      assert.equal(dayFile.prefix, 'cloud', `Day ${day} prefix must be 'cloud'`);
      assert.equal(dayFile.entries.length, 5, `Day ${day} visual file must have exactly 5 entries`);

      const lesson = getLongLesson('cloud', day) || CLOUD_WEB_LONG_LESSONS.find(l => l.day === day)!;

      for (let i = 0; i < 5; i++) {
        const entry = dayFile.entries[i];
        const part = lesson.parts[i];

        assert.ok(entry.partTitle, `Day ${day} entry ${i + 1} must have a partTitle`);
        assert.equal(entry.spec.template, 'compare', `Day ${day} entry ${i + 1} template must be compare`);

        // Verify SHA-256 code binding
        const expectedHash = crypto.createHash('sha256').update(part.code.trim()).digest('hex');
        assert.equal(entry.codeHash, expectedHash, `Day ${day} entry ${i + 1} codeHash must match SHA-256 of part.code`);

        // Check steps synchronization
        assert.equal(entry.spec.steps.length, 4, `Day ${day} entry ${i + 1} must have exactly 4 visual steps`);
        const stepAts = entry.spec.steps.map(s => s.at);
        assert.deepEqual(stepAts, ['say1', 'say2', 'example', 'tryIt'], `Day ${day} entry ${i + 1} step timing must match Gate v2 spec`);
      }
    }
  });

  await t.test('4. Deterministic execution sandbox verification for Block 10 code snippets', async () => {
    for (const day of availableDays) {
      const lesson = getLongLesson('cloud', day) || CLOUD_WEB_LONG_LESSONS.find(l => l.day === day)!;
      for (let i = 0; i < lesson.parts.length; i++) {
        const part = lesson.parts[i];
        const actualOutput = (await runTypeScriptSnippet(part.code)).rstrip ? (await runTypeScriptSnippet(part.code)).rstrip('\r\n') : (await runTypeScriptSnippet(part.code)).replace(/[\r\n]+$/, '');
        const expectedOutput = part.output.replace(/[\r\n]+$/, '');
        assert.equal(
          actualOutput,
          expectedOutput,
          `Day ${day} Part ${i + 1} code stdout must match expected output deterministically`
        );
      }
    }
  });
});
