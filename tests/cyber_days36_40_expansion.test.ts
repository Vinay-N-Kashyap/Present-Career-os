import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, getLongLessonLanguage } from '../src/lib/data/longLessons';

test('CYBER Month 2 Expansion: Days 36-40 & Milestone 8 Capstone Resolution & Invariants', () => {
  assert.equal(getLongLessonLanguage('cyber'), 'typescript');

  for (let day = 36; day <= 40; day++) {
    const lesson = getLongLesson('cyber', day);
    assert.ok(lesson, `cyber Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.coursePrefix, 'cyber');
    assert.equal(lesson.parts.length, 5, `cyber Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.summary && lesson.summary.length >= 4, `cyber Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `cyber Day ${day} must contain projectStep`);
    assert.ok(lesson.projectStep.title, `cyber Day ${day} projectStep must have title`);
    assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, `cyber Day ${day} projectStep must have >= 3 steps`);

    let dayTotalWords = 0;
    for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
      const part = lesson.parts[pIdx];
      assert.ok(part.title, `Day ${day} Part ${pIdx + 1} must have title`);
      assert.ok(part.example, `Day ${day} Part ${pIdx + 1} must have everyday analogy example`);
      assert.ok(part.code, `Day ${day} Part ${pIdx + 1} must have runnable TypeScript code`);
      assert.ok(part.output, `Day ${day} Part ${pIdx + 1} must have expected output`);

      // Pedagogical slow-reader word count invariant: >= 600 words per part
      const sayText = Array.isArray(part.say) ? part.say.join(' ') : part.say;
      const wordCount = sayText.trim().split(/\s+/).length;
      dayTotalWords += wordCount;
      assert.ok(
        wordCount >= 600,
        `Day ${day} Part ${pIdx + 1} ("${part.title}") word count must be >= 600 words, got ${wordCount}`
      );

      // Socratic check invariants: exactly 4 options, answer 0, answerIndex 0, why >= 50 chars
      const check = part.check;
      assert.ok(check, `Day ${day} Part ${pIdx + 1} must have Socratic check`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${pIdx + 1} check must have exactly 4 options`);
      assert.equal(check.answer, 0, `Day ${day} Part ${pIdx + 1} check answer must be 0`);
      assert.equal(check.answerIndex, 0, `Day ${day} Part ${pIdx + 1} check answerIndex must be 0`);
      assert.ok(
        check.why && check.why.trim().length >= 50,
        `Day ${day} Part ${pIdx + 1} check why explanation must be >= 50 characters, got ${check.why?.length}`
      );
    }

    assert.ok(
      dayTotalWords >= 3000,
      `Day ${day} total word count must be >= 3,000 words, got ${dayTotalWords}`
    );
  }
});

test('CYBER Month 2 Expansion: Days 36-40 Gate v2 Visual Envelopes Audit', () => {
  const visualsDir = path.resolve('src/lib/data/lessonVisuals/cyber');

  for (let day = 36; day <= 40; day++) {
    const visualPath = path.join(visualsDir, `day-${day}.json`);
    assert.ok(fs.existsSync(visualPath), `Visual envelope for Day ${day} must exist at ${visualPath}`);

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visualDoc = JSON.parse(raw);

    assert.equal(visualDoc.schemaVersion, 2, `Day ${day} must use schemaVersion 2`);
    assert.equal(visualDoc.prefix, 'cyber');
    assert.equal(visualDoc.day, day);
    assert.ok(visualDoc.promptSha && visualDoc.promptSha.length === 64, `Day ${day} must have 64-char sha256 promptSha`);
    assert.equal(visualDoc.entries.length, 5, `Day ${day} visual envelope must have exactly 5 entries`);

    const lesson = getLongLesson('cyber', day);

    for (let eIdx = 0; eIdx < visualDoc.entries.length; eIdx++) {
      const entry = visualDoc.entries[eIdx];
      const part = lesson.parts[eIdx];

      assert.equal(entry.partTitle, part.title, `Day ${day} entry ${eIdx + 1} title mismatch`);

      const expectedCodeHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(entry.codeHash, expectedCodeHash, `Day ${day} entry ${eIdx + 1} codeHash mismatch`);

      assert.equal(entry.spec.template, 'compare', `Day ${day} entry ${eIdx + 1} must use compare template`);
      assert.ok(entry.spec.left && entry.spec.left.content.length >= 3, `Day ${day} entry ${eIdx + 1} left content must have >= 3 items`);
      assert.ok(entry.spec.right && entry.spec.right.content.length >= 3, `Day ${day} entry ${eIdx + 1} right content must have >= 3 items`);

      assert.equal(entry.spec.steps.length, 4, `Day ${day} entry ${eIdx + 1} must have 4 synchronized steps`);
      const stepAts = entry.spec.steps.map((s: any) => s.at);
      assert.deepEqual(stepAts, ['intro', 'inspect', 'compare', 'verify'], `Day ${day} entry ${eIdx + 1} step sequence invalid`);

      // STRICT ZERO-DIGIT INVARIANT: Step captions must NEVER contain any numeric digits (0-9)
      for (const step of entry.spec.steps) {
        assert.ok(
          !/\d/.test(step.caption),
          `Day ${day} entry ${eIdx + 1} step caption "${step.caption}" contains numeric digits! Violates Gate v2 rule.`
        );
      }
    }
  }
});
