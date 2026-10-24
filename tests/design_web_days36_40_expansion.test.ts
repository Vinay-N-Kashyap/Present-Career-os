import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DESIGN_WEB_LONG_LESSONS } from '../src/lib/data/designWebLongLessons';

test('Design Systems Month 2 Block 8 (Days 36-40) Structural & Pedagogical Integrity', () => {
  const days36to40 = DESIGN_WEB_LONG_LESSONS.filter(l => l.day >= 36 && l.day <= 40);
  assert.equal(days36to40.length, 5, 'Must contain exactly 5 days (Days 36 to 40)');

  for (const day of days36to40) {
    assert.ok(day.title.length > 5, `Day ${day.day} must have a valid title`);
    assert.ok(day.goal.length > 20, `Day ${day.day} must have a descriptive goal`);
    assert.equal(day.minutes, 25, `Day ${day.day} must specify 25 minutes`);
    assert.equal(day.parts.length, 5, `Day ${day.day} must contain exactly 5 parts`);
    assert.equal(day.summary.length, 5, `Day ${day.day} must contain 5 summary bullets`);
    assert.ok(day.projectStep.title.length > 5, `Day ${day.day} must have a projectStep title`);
    assert.ok(day.projectStep.steps.length >= 4, `Day ${day.day} must have >= 4 projectStep steps`);

    for (let i = 0; i < day.parts.length; i++) {
      const part = day.parts[i];
      assert.ok(part.title.length > 5, `Day ${day.day} Part ${i + 1} must have a valid title`);
      assert.ok(part.say.length >= 7, `Day ${day.day} Part ${i + 1} must have >= 7 paragraphs`);

      const wordCount = part.say.join(' ').match(/\b[A-Za-z0-9_\-\.\$\/\:\@\']+\b/g)?.length || 0;
      assert.ok(
        wordCount >= 580,
        `Day ${day.day} Part ${i + 1} must satisfy slow-reader word count invariant (got ${wordCount}, expected >= 580)`
      );

      assert.ok(part.example.length > 20, `Day ${day.day} Part ${i + 1} must have a physical analogy`);
      assert.ok(part.code.length > 30, `Day ${day.day} Part ${i + 1} must have executable TypeScript code`);
      assert.ok(part.output.length > 5, `Day ${day.day} Part ${i + 1} must have matching code output`);
      assert.ok(part.codeNotes.length >= 2, `Day ${day.day} Part ${i + 1} must have >= 2 codeNotes`);
      assert.ok(part.tryIt.length > 10, `Day ${day.day} Part ${i + 1} must have a tryIt prompt`);

      // Socratic check invariants
      assert.equal(part.check.options.length, 4, `Day ${day.day} Part ${i + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Day ${day.day} Part ${i + 1} check answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Day ${day.day} Part ${i + 1} check answerIndex must be 0`);
      assert.ok(
        part.check.why.length >= 50,
        `Day ${day.day} Part ${i + 1} check why explanation must be >= 50 characters`
      );
    }

    // Gate v2 Visual Envelope Verification
    const visualPath = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', 'design', `day-${day.day}.json`);
    assert.ok(fs.existsSync(visualPath), `Visual file must exist for Day ${day.day}: ${visualPath}`);

    const visualRaw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(visualRaw);

    assert.equal(visual.schemaVersion, 1, `Day ${day.day} visual must have schemaVersion 1`);
    assert.equal(visual.prefix, 'design', `Day ${day.day} visual must have prefix "design"`);
    assert.equal(visual.day, day.day, `Day ${day.day} visual day number mismatch`);
    assert.equal(visual.entries.length, 5, `Day ${day.day} visual must contain 5 entries`);

    const titlesConcat = day.parts.map(p => p.title).join('');
    const expectedPromptSha = crypto.createHash('sha256').update(titlesConcat).digest('hex');
    assert.equal(visual.promptSha, expectedPromptSha, `Day ${day.day} visual promptSha mismatch`);

    for (let i = 0; i < visual.entries.length; i++) {
      const entry = visual.entries[i];
      const part = day.parts[i];

      assert.equal(entry.partTitle, part.title, `Day ${day.day} Entry ${i + 1} partTitle mismatch`);
      const expectedCodeHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(entry.codeHash, expectedCodeHash, `Day ${day.day} Entry ${i + 1} codeHash mismatch`);

      assert.equal(entry.spec.template, 'compare', `Day ${day.day} Entry ${i + 1} template must be compare`);
      assert.equal(entry.spec.steps.length, 4, `Day ${day.day} Entry ${i + 1} must contain exactly 4 steps`);

      for (const step of entry.spec.steps) {
        // Assert no numeric digits in captions
        assert.ok(
          !/\d/.test(step.leftCaption),
          `Day ${day.day} Entry ${i + 1} Step ${step.stepNumber} leftCaption must contain 0 digits: "${step.leftCaption}"`
        );
        assert.ok(
          !/\d/.test(step.rightCaption),
          `Day ${day.day} Entry ${i + 1} Step ${step.stepNumber} rightCaption must contain 0 digits: "${step.rightCaption}"`
        );
        assert.ok(
          step.leftCaption.endsWith('.'),
          `Day ${day.day} Entry ${i + 1} Step ${step.stepNumber} leftCaption must end with period: "${step.leftCaption}"`
        );
        assert.ok(
          step.rightCaption.endsWith('.'),
          `Day ${day.day} Entry ${i + 1} Step ${step.stepNumber} rightCaption must end with period: "${step.rightCaption}"`
        );
      }
    }
  }
});
