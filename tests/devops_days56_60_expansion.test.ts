import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { getLongLesson } from '../src/lib/data/longLessons';
import { DEVOPS_WEB_LONG_LESSONS } from '../src/lib/data/devopsWebLongLessons';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { loadDayFile, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { compileTs } from '../src/lib/code/ts/compileTs';

// TypeScript runner for DevOps snippets using project's compileTs
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
    JSON,
    Date,
    Buffer,
    setTimeout,
    clearTimeout
  };
  vm.runInNewContext(compiled.js, sandbox, { timeout: 3000 });
  return out.join('\n');
}

const STOPWORDS = new Set([
  'this', 'that', 'with', 'from', 'have', 'were', 'been', 'their', 'there',
  'which', 'about', 'would', 'could', 'should', 'these', 'those', 'where',
  'after', 'before', 'while', 'under', 'other', 'into', 'then', 'than',
  'when', 'what', 'some', 'more', 'most', 'such', 'only', 'over', 'also',
  'will', 'your', 'each', 'make', 'many', 'very', 'well', 'much', 'even'
]);

function extractMeaningfulWords(text: string): Set<string> {
  const matches = text.toLowerCase().match(/[a-z]{4,}/g) || [];
  return new Set(matches.filter(w => !STOPWORDS.has(w)));
}

test('Course 15: DevOps Engineering & GitOps (devops) Month 2 Block 12 Grand Master Suite (Days 56-60)', async (t) => {
  clearDayFileCache();

  await t.test('1. Visuals enablement for devops course prefix', () => {
    assert.equal(isCourseVisualsEnabled('devops'), true, 'devops course prefix must have visuals support enabled');
  });

  await t.test('2. LongLessons structural integrity, pedagogical depth, and invariants for Days 56-60 (Block 12 Complete)', () => {
    for (const day of [56, 57, 58, 59, 60]) {
      const lesson = getLongLesson('devops', day) || DEVOPS_WEB_LONG_LESSONS.find(l => l.day === day);
      assert.ok(lesson, `Day ${day} must exist in devopsWebLongLessons.ts registry`);
      assert.equal(lesson.coursePrefix, 'devops', `Day ${day} coursePrefix must be 'devops'`);
      assert.equal(lesson.day, day, `Day property must match ${day}`);
      assert.ok(lesson.title && lesson.title.length > 5, `Day ${day} must have a descriptive title`);
      assert.ok(lesson.goal && lesson.goal.length > 10, `Day ${day} must have a clear pedagogical goal`);
      assert.ok(lesson.recap && lesson.recap.length > 10, `Day ${day} must include contextual recap`);
      assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 pedagogical parts`);

      let dayTotalWords = 0;

      for (let i = 0; i < lesson.parts.length; i++) {
        const part = lesson.parts[i];
        const ctx = `Day ${day} Part ${i + 1} (${part.title})`;

        assert.ok(part.title && part.title.length > 5, `${ctx}: title must be descriptive`);
        assert.ok(part.say, `${ctx}: say content must exist`);

        const sayArray = Array.isArray(part.say) ? part.say : [part.say];
        assert.ok(
          sayArray.length >= 7,
          `${ctx}: must contain >= 7 dense paragraphs (got ${sayArray.length})`
        );

        let partSpokenWords = 0;
        for (const para of sayArray) {
          const words = para.trim().split(/\s+/).filter(Boolean).length;
          partSpokenWords += words;
        }
        dayTotalWords += partSpokenWords;

        assert.ok(
          partSpokenWords >= 580,
          `${ctx}: word count ${partSpokenWords} must be >= 580 words for rigorous pedagogical depth`
        );

        assert.ok(part.code && part.code.trim().length > 0, `${ctx}: code snippet must not be empty`);
        assert.ok(part.output && part.output.trim().length > 0, `${ctx}: expected output must not be empty`);
        assert.ok(part.codeNotes && part.codeNotes.length >= 3, `${ctx}: codeNotes must have >= 3 items`);
        assert.ok(part.tryIt && part.tryIt.trim().length > 10, `${ctx}: tryIt must be descriptive`);
        assert.ok(part.check && part.check.question, `${ctx}: check question must exist`);
        assert.equal(part.check.options.length, 4, `${ctx}: check quiz must have exactly 4 options`);
        assert.equal(part.check.answerIndex, 0, `${ctx}: check quiz answerIndex must strictly be 0`);
        assert.equal(part.check.answer, 0, `${ctx}: check quiz answer must strictly be 0`);
        assert.ok(
          part.check.explanation || part.check.why,
          `${ctx}: check quiz explanation/why must be non-empty`
        );
      }

      assert.ok(
        dayTotalWords >= 3000,
        `Day ${day} total words (${dayTotalWords}) must exceed 3,000 words across all 5 parts`
      );
    }
  });

  await t.test('3. Gate v2 Visual specs and JSON envelope validation for Days 56-60', async () => {
    for (const day of [56, 57, 58, 59, 60]) {
      const visualDoc = await loadDayFile('devops', day);
      assert.ok(visualDoc, `Visual spec for devops Day ${day} must load successfully`);
      assert.equal(visualDoc.schemaVersion, 2, `Day ${day} visual spec must be schemaVersion 2`);
      assert.equal(visualDoc.prefix, 'devops', `Day ${day} visual prefix must be 'devops'`);
      assert.equal(visualDoc.day, day, `Day ${day} visual day must match ${day}`);
      assert.ok(visualDoc.promptSha && visualDoc.promptSha.length === 64, `Day ${day} promptSha must be 64-char sha256`);
      assert.equal(visualDoc.model, 'google/gemini-2.5-pro', `Day ${day} model must be google/gemini-2.5-pro`);
      assert.equal(visualDoc.entries.length, 5, `Day ${day} visual entries must equal 5 parts`);

      const lesson = getLongLesson('devops', day) || DEVOPS_WEB_LONG_LESSONS.find(l => l.day === day);
      assert.ok(lesson);

      for (let i = 0; i < visualDoc.entries.length; i++) {
        const entry = visualDoc.entries[i];
        const part = lesson.parts[i];
        const ctx = `Day ${day} Visual Entry ${i + 1} (${entry.partTitle})`;

        assert.equal(entry.partTitle, part.title, `${ctx}: entry title must match lesson part title`);

        const expectedHash = crypto.createHash('sha256').update(part.code.trim()).digest('hex');
        assert.equal(
          entry.codeHash,
          expectedHash,
          `${ctx}: codeHash must match SHA-256 of lesson code snippet`
        );

        assert.equal(entry.spec.template, 'compare', `${ctx}: template must be 'compare'`);
        assert.equal(entry.spec.steps.length, 4, `${ctx}: compare template must have 4 synchronized steps`);

        const expectedAts = ['say1', 'say2', 'example', 'tryIt'];
        for (let sIdx = 0; sIdx < entry.spec.steps.length; sIdx++) {
          const step = entry.spec.steps[sIdx];
          const sCtx = `${ctx} Step ${sIdx + 1} (${step.at})`;

          assert.equal(step.at, expectedAts[sIdx], `${sCtx}: step target must be ${expectedAts[sIdx]}`);
          assert.ok(step.caption, `${sCtx}: caption must exist`);
          assert.ok(step.caption.length <= 75, `${sCtx}: caption '${step.caption}' must be <= 75 chars`);
          assert.ok(step.caption.endsWith('.'), `${sCtx}: caption must end with a period`);
          assert.ok(!/\d/.test(step.caption), `${sCtx}: caption must contain zero numeric digits`);

          let targetText = '';
          if (step.at === 'say1') targetText = Array.isArray(part.say) ? part.say[0] : part.say;
          else if (step.at === 'say2') targetText = Array.isArray(part.say) ? part.say[1] : part.say;
          else if (step.at === 'example') targetText = part.example || '';
          else if (step.at === 'tryIt') targetText = part.tryIt || '';

          const capWords = extractMeaningfulWords(step.caption);
          const textWords = extractMeaningfulWords(targetText);
          const shared = [...capWords].filter(w => textWords.has(w));
          assert.ok(
            shared.length >= 2,
            `${sCtx}: caption must share >= 2 meaningful words with ${step.at} text (shared: ${shared.join(', ')})`
          );
        }
      }
    }
  });

  await t.test('4. Interactive code execution & exact terminal output verification for Days 56-60', async () => {
    for (const day of [56, 57, 58, 59, 60]) {
      const lesson = getLongLesson('devops', day) || DEVOPS_WEB_LONG_LESSONS.find(l => l.day === day);
      assert.ok(lesson);

      for (let i = 0; i < lesson.parts.length; i++) {
        const part = lesson.parts[i];
        const ctx = `Day ${day} Part ${i + 1} (${part.title})`;

        const actualOutput = await runTypeScriptSnippet(part.code);
        assert.equal(
          actualOutput.trim(),
          part.output.trim(),
          `${ctx}: compiled TypeScript output must match part.output exactly`
        );
      }
    }
  });

  await t.test('5. Course 15 Grand Master Graduation & Complete 60-Day Integrity Verification', () => {
    const daysFound = DEVOPS_WEB_LONG_LESSONS.map(l => l.day).sort((a, b) => a - b);
    assert.equal(daysFound.length, 60, `Must have exactly 60 days implemented in devops (found ${daysFound.length})`);

    for (let d = 1; d <= 60; d++) {
      assert.ok(daysFound.includes(d), `Day ${d} must exist in continuous sequence 1..60 in devopsWebLongLessons.ts`);
    }

    const day60 = DEVOPS_WEB_LONG_LESSONS.find(l => l.day === 60);
    assert.ok(day60, 'Day 60 Grand Master Capstone must exist');
    assert.equal(day60.parts.length, 5, 'Day 60 must have 5 parts');
  });
});
