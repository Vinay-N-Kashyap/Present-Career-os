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
    Date
  };
  vm.runInNewContext(compiled.js, sandbox, { timeout: 2000 });
  return out.join('\n');
}

const STOPWORDS = new Set([
  'this', 'that', 'with', 'from', 'have', 'were', 'been', 'their', 'there',
  'which', 'about', 'would', 'could', 'should', 'these', 'those', 'where',
  'after', 'before', 'while', 'under', 'other', 'into', 'then', 'than',
  'when', 'what', 'some', 'more', 'most', 'such', 'only', 'over', 'also'
]);

function extractMeaningfulWords(text: string): Set<string> {
  const matches = text.toLowerCase().match(/[a-z]{4,}/g) || [];
  return new Set(matches.filter(w => !STOPWORDS.has(w)));
}

test('Course 15: DevOps Engineering & GitOps (devops) Month 2 Block 8 Expansion Suite', async (t) => {
  clearDayFileCache();

  await t.test('1. Visuals enablement for devops course prefix', () => {
    assert.equal(isCourseVisualsEnabled('devops'), true, 'devops course prefix must have visuals support enabled');
  });

  await t.test('2. LongLessons structural integrity, pedagogical depth, and invariants for Days 36-40 (Block 8 Complete)', () => {
    for (const day of [36, 37, 38, 39, 40]) {
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
        assert.equal(part.check.answer, 0, `${ctx}: check answer index must be 0`);
        assert.equal(part.check.options.length, 4, `${ctx}: check must have exactly 4 options`);
        assert.ok(part.check.explanation && part.check.explanation.length > 20, `${ctx}: check explanation must be substantial`);
      }

      assert.ok(
        dayTotalWords >= 3000,
        `Day ${day} total spoken word count ${dayTotalWords} must be >= 3,000 words (for 20+ minute lecture depth)`
      );
    }
  });

  await t.test('3. Visuals file verification, step synchronizations, and SHA-256 bindings for Days 36-40 (Block 8 Complete)', () => {
    for (const day of [36, 37, 38, 39, 40]) {
      const dayFile = loadDayFile('devops', day);
      assert.ok(dayFile, `Visuals day file for Day ${day} must exist and load successfully`);
      assert.equal(dayFile.schemaVersion, 2, `Day ${day} visual file schemaVersion must be 2`);
      assert.equal(dayFile.prefix, 'devops', `Day ${day} prefix must be 'devops'`);
      assert.equal(dayFile.entries.length, 5, `Day ${day} visual file must have exactly 5 entries`);

      const lesson = getLongLesson('devops', day) || DEVOPS_WEB_LONG_LESSONS.find(l => l.day === day)!;

      for (let i = 0; i < 5; i++) {
        const entry = dayFile.entries[i];
        const part = lesson.parts[i];
        const ctx = `Day ${day} Visual Entry ${i + 1}`;

        assert.equal(entry.partTitle, part.title, `${ctx}: partTitle must match LongLesson part title`);
        const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
        assert.equal(entry.codeHash, expectedHash, `${ctx}: codeHash must strictly bind to SHA-256 of code`);

        const spec = entry.spec;
        assert.ok(spec, `${ctx}: visual spec must exist`);
        assert.equal(spec.template, 'compare', `${ctx}: template must be 'compare'`);
        assert.ok(Array.isArray(spec.steps) && spec.steps.length === 4, `${ctx}: spec must have 4 synchronized steps`);

        for (const step of spec.steps) {
          assert.ok(step.caption.length <= 75, `${ctx}: caption exceeds 75 chars: ${step.caption}`);
          assert.ok(step.caption.endsWith('.'), `${ctx}: caption must end with period: ${step.caption}`);
          assert.ok(!/\d/.test(step.caption), `${ctx}: caption must contain 0 digits: ${step.caption}`);

          let lessonText = '';
          if (step.at.startsWith('say')) {
            const sIdx = parseInt(step.at.slice(3), 10) - 1;
            const sayArr = Array.isArray(part.say) ? part.say : [part.say];
            lessonText = sayArr[sIdx] || '';
          } else if (step.at === 'example') {
            lessonText = part.example || '';
          } else if (step.at === 'tryIt') {
            lessonText = part.tryIt || '';
          }

          const captionWords = extractMeaningfulWords(step.caption);
          const lessonWords = extractMeaningfulWords(lessonText);
          const shared = [...captionWords].filter(w => lessonWords.has(w));
          assert.ok(shared.length >= 2, `${ctx} step ${step.at}: caption shares < 2 words (${shared.join(', ')}) with lesson text: '${step.caption}'`);
        }
      }
    }
  });

  await t.test('4. Deterministic execution sandbox verification for Days 36-40 code snippets (Block 8 Complete)', async () => {
    for (const day of [36, 37, 38, 39, 40]) {
      const lesson = getLongLesson('devops', day) || DEVOPS_WEB_LONG_LESSONS.find(l => l.day === day)!;
      for (let i = 0; i < lesson.parts.length; i++) {
        const part = lesson.parts[i];
        const actual = await runTypeScriptSnippet(part.code!);
        assert.equal(actual.trim(), part.output!.trim(), `Day ${day} Part ${i + 1} sandbox stdout mismatch`);
      }
    }
  });
});
