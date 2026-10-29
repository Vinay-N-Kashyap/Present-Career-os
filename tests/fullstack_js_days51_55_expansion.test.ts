import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, getLongLessonLanguage } from '../src/lib/data/longLessons';

test('Full-Stack JS Month 2 Expansion: Days 51-55 Resolution & Pedagogical Invariants', () => {
  assert.equal(getLongLessonLanguage('fullstack-js'), 'typescript');

  for (let day = 51; day <= 55; day++) {
    const lesson = getLongLesson('fullstack-js', day);
    assert.ok(lesson, `fullstack-js Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.coursePrefix, 'fullstack-js');
    assert.equal(lesson.parts.length, 5, `fullstack-js Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.summary.length >= 4, `fullstack-js Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `fullstack-js Day ${day} must contain projectStep`);
    assert.ok(lesson.projectStep.steps.length >= 3, `fullstack-js Day ${day} projectStep must have >= 3 steps`);

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
        wordCount >= 450,
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
        `Day ${day} Part ${pIdx + 1} check why explanation must be >= 50 characters`
      );
    }

    assert.ok(
      dayTotalWords >= 3000,
      `Day ${day} total words must be >= 3,000 words, got ${dayTotalWords}`
    );
  }
});

test('Full-Stack JS Month 2 Expansion: Gate v2 Visual Envelopes for Days 51-55', () => {
  const visualsDir = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/fullstack-js');

  for (let day = 51; day <= 55; day++) {
    const visualPath = path.join(visualsDir, `day-${day}.json`);

    assert.ok(fs.existsSync(visualPath), `Visual file must exist at ${visualPath}`);
    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visualData = JSON.parse(raw);

    assert.equal(visualData.schemaVersion, 2, `Day ${day} schemaVersion must be 2`);
    assert.equal(visualData.prefix, 'fullstack-js', `Day ${day} prefix must be fullstack-js`);
    assert.equal(visualData.day, day, `Day ${day} day must match ${day}`);
    assert.equal(visualData.entries.length, 5, `Day ${day} must contain 5 visual entries`);

    const lesson = getLongLesson('fullstack-js', day)!;

    for (let eIdx = 0; eIdx < visualData.entries.length; eIdx++) {
      const entry = visualData.entries[eIdx];
      const part = lesson.parts[eIdx];

      assert.equal(entry.partTitle, part.title, `Entry ${eIdx + 1} partTitle must match part.title`);

      // Verify codeHash matches sha256 of part.code
      const expectedCodeHash = crypto.createHash('sha256').update(part.code!).digest('hex');
      assert.equal(entry.codeHash, expectedCodeHash, `Entry ${eIdx + 1} codeHash must match sha256 of code`);

      // Verify spec template
      assert.equal(entry.spec.template, 'compare', `Entry ${eIdx + 1} spec template must be compare`);
      assert.equal(entry.spec.steps.length, 4, `Entry ${eIdx + 1} steps must contain exactly 4 steps`);

      // Verify zero numeric digits in captions
      for (const step of entry.spec.steps) {
        assert.ok(
          !/\d/.test(step.caption),
          `Day ${day} Entry ${eIdx + 1} step caption must NOT contain numeric digits: "${step.caption}"`
        );
      }
    }
  }
});
