import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, getLongLessonLanguage } from '../src/lib/data/longLessons';

test('DIST Month 2 Expansion: Days 46-50 & Milestone 10 Capstone Resolution & Invariants', () => {
  assert.equal(getLongLessonLanguage('dist'), 'typescript');

  for (let day = 46; day <= 50; day++) {
    const lesson = getLongLesson('dist', day);
    assert.ok(lesson, `dist Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.coursePrefix, 'dist');
    assert.equal(lesson.parts.length, 5, `dist Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.summary && lesson.summary.length >= 4, `dist Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `dist Day ${day} must contain projectStep`);
    assert.ok(lesson.projectStep.title, `dist Day ${day} projectStep must have title`);
    assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, `dist Day ${day} projectStep must have >= 3 steps`);

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

test('DIST Month 2 Expansion: Days 46-50 Gate v2 Visual Envelopes Audit', () => {
  const visualsDir = path.resolve('src/lib/data/lessonVisuals/dist');

  for (let day = 46; day <= 50; day++) {
    const visualPath = path.join(visualsDir, `day-${day}.json`);
    assert.ok(fs.existsSync(visualPath), `Visual envelope for Day ${day} must exist at ${visualPath}`);

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visualDoc = JSON.parse(raw);

    assert.equal(visualDoc.schemaVersion, 2, `Day ${day} must use schemaVersion 2`);
    assert.equal(visualDoc.prefix, 'dist');
    assert.equal(visualDoc.day, day);
    assert.match(visualDoc.promptSha, /^[a-f0-9]{64}$/, `Day ${day} promptSha must be valid 64-char sha256`);
    assert.equal(visualDoc.entries.length, 5, `Day ${day} visual envelope must have exactly 5 entries`);

    const lesson = getLongLesson('dist', day);
    assert.ok(lesson);

    for (let eIdx = 0; eIdx < visualDoc.entries.length; eIdx++) {
      const entry = visualDoc.entries[eIdx];
      const part = lesson.parts[eIdx];

      assert.equal(entry.partTitle, part.title, `Day ${day} entry ${eIdx + 1} partTitle must match lesson part title`);
      assert.match(entry.codeHash, /^[a-f0-9]{64}$/, `Day ${day} entry ${eIdx + 1} codeHash must be valid sha256`);

      // Verify codeHash matches actual part code
      const expectedCodeHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedCodeHash, `Day ${day} entry ${eIdx + 1} codeHash must match actual part.code`);

      // Verify compare template spec
      const spec = entry.spec;
      assert.equal(spec.template, 'compare', `Day ${day} entry ${eIdx + 1} template must be compare`);
      assert.ok(spec.title, `Day ${day} entry ${eIdx + 1} must have title`);
      assert.ok(spec.left && spec.left.label && spec.left.content.length >= 3);
      assert.ok(spec.right && spec.right.label && spec.right.content.length >= 3);
      assert.equal(spec.steps.length, 4, `Day ${day} entry ${eIdx + 1} must have exactly 4 synchronized steps`);

      for (let sIdx = 0; sIdx < spec.steps.length; sIdx++) {
        const step = spec.steps[sIdx];
        assert.ok(step.caption, `Day ${day} entry ${eIdx + 1} step ${sIdx + 1} must have caption`);

        // GATE V2 VISUAL INVARIANT: ZERO NUMERIC DIGITS IN CAPTIONS
        assert.doesNotMatch(
          step.caption,
          /\d/,
          `Day ${day} Part ${eIdx + 1} Step ${sIdx + 1} caption contains numeric digit: "${step.caption}"`
        );
      }
    }
  }
});
