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

test('Course 16: Cloud Native AWS Architecture (cloud) Month 2 Block 9 Expansion Suite', async (t) => {
  clearDayFileCache();

  await t.test('1. Visuals enablement for cloud course prefix', () => {
    assert.equal(isCourseVisualsEnabled('cloud'), true, 'cloud course prefix must have visuals support enabled');
  });

  const availableDays = [41, 42, 43, 44];

  await t.test('2. LongLessons structural integrity, pedagogical depth, and invariants for Block 9', () => {
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

  await t.test('3. Visuals file verification, step synchronizations, and SHA-256 bindings for Block 9', () => {
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
        const ctx = `Day ${day} Visual Entry ${i + 1}`;

        assert.equal(entry.partTitle, part.title, `${ctx}: partTitle must match LongLesson part title`);
        const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
        assert.equal(entry.codeHash, expectedHash, `${ctx}: codeHash must strictly bind to SHA-256 of code`);

        const spec = entry.spec;
        assert.ok(spec, `${ctx}: visual spec must exist`);
        assert.equal(spec.template, 'workflow', `${ctx}: template must be 'workflow'`);
        assert.ok(Array.isArray(spec.steps) && spec.steps.length === 4, `${ctx}: spec must have 4 synchronized steps`);

        const stepAts = (spec.steps as { at: string }[]).map(s => s.at);
        assert.deepEqual(stepAts, ['say1', 'say2', 'example', 'tryIt'], `${ctx}: steps must strictly synchronize with lecture progression`);
      }
    }
  });

  await t.test('4. Deterministic execution sandbox verification for Block 9 code snippets', async () => {
    for (const day of availableDays) {
      const lesson = getLongLesson('cloud', day) || CLOUD_WEB_LONG_LESSONS.find(l => l.day === day)!;
      for (let i = 0; i < lesson.parts.length; i++) {
        const part = lesson.parts[i];
        const actual = await runTypeScriptSnippet(part.code!);
        assert.equal(actual.trim(), part.output!.trim(), `Day ${day} Part ${i + 1} sandbox stdout mismatch`);
      }
    }
  });
});
