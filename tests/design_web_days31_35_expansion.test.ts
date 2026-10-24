import test from 'node:test';
import assert from 'node:assert/strict';
import { DESIGN_WEB_LONG_LESSONS } from '../src/lib/data/designWebLongLessons';

test('Design Systems Month 2 Block 7 (Days 31-35) Structural Integrity', () => {
  const days31to35 = DESIGN_WEB_LONG_LESSONS.filter(l => l.day >= 31 && l.day <= 35);
  assert.equal(days31to35.length, 5, 'Must contain exactly 5 days (Days 31 to 35)');

  for (const day of days31to35) {
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
  }
});
