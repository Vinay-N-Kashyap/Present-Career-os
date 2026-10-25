import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DESIGN_WEB_LONG_LESSONS } from '../src/lib/data/designWebLongLessons';

test('Design Systems Month 2 Block 10 (Days 46-50) Structural & Pedagogical Integrity', () => {
  const days46to50 = DESIGN_WEB_LONG_LESSONS.filter(l => l.day >= 46 && l.day <= 50);
  assert.equal(days46to50.length, 5, 'Must contain exactly 5 days (Days 46 to 50)');

  for (const day of days46to50) {
    assert.ok(day.title.length > 5, `Day ${day.day} must have a valid title`);
    assert.ok(day.goal.length > 20, `Day ${day.day} must have a descriptive goal`);
    assert.equal(day.minutes, 25, `Day ${day.day} must specify 25 minutes`);
    assert.equal(typeof day.recap, 'string', `Day ${day.day} recap must be a string`);
    assert.equal(day.parts.length, 5, `Day ${day.day} must contain exactly 5 parts`);
    assert.ok(day.summary && day.summary.length >= 3, `Day ${day.day} must have summary points`);
    assert.ok(day.projectStep && day.projectStep.steps.length >= 3, `Day ${day.day} must have projectStep`);

    for (let i = 0; i < day.parts.length; i++) {
      const part = day.parts[i];
      assert.ok(part.title.length > 5, `Day ${day.day} Part ${i + 1} must have a valid title`);
      const sayArray = Array.isArray(part.say) ? part.say : [part.say];
      assert.ok(sayArray.length >= 4, `Day ${day.day} Part ${i + 1} must have multiple paragraphs`);

      const wordCount = sayArray.join(' ').match(/\b[A-Za-z0-9_\-\.\$\/\:\@\']+\b/g)?.length || 0;
      assert.ok(
        wordCount >= 580,
        `Day ${day.day} Part ${i + 1} must satisfy slow-reader word count invariant (got ${wordCount}, expected >= 580)`
      );

      assert.ok((part.example?.length || 0) > 20, `Day ${day.day} Part ${i + 1} must have a physical analogy`);
      assert.ok((part.code?.length || 0) > 30, `Day ${day.day} Part ${i + 1} must have executable TypeScript code`);
      assert.ok((part.output?.length || 0) > 5, `Day ${day.day} Part ${i + 1} must have matching code output`);
      assert.ok((part.codeNotes?.length || 0) >= 2, `Day ${day.day} Part ${i + 1} must have >= 2 codeNotes`);
      assert.ok((part.tryIt?.length || 0) > 10, `Day ${day.day} Part ${i + 1} must have a tryIt prompt`);

      // Socratic check invariants
      assert.equal(part.check?.options.length, 4, `Day ${day.day} Part ${i + 1} check must have 4 options`);
      assert.equal(part.check?.answer, 0, `Day ${day.day} Part ${i + 1} check answer must be 0`);
      assert.equal(part.check?.answerIndex, 0, `Day ${day.day} Part ${i + 1} check answerIndex must be 0`);
      assert.ok(
        (part.check?.why?.length || 0) >= 50,
        `Day ${day.day} Part ${i + 1} check why explanation must be >= 50 characters`
      );
    }

    // Gate v2 Visual Envelope Verification
    const visualPath = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', 'design', `day-${day.day}.json`);
    assert.ok(fs.existsSync(visualPath), `Visual file must exist for Day ${day.day}: ${visualPath}`);

    const visualContent = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualContent.schemaVersion, '2.0', `Day ${day.day} must be Gate v2`);
    assert.equal(visualContent.courseId, 'course-design-systems', `Day ${day.day} courseId match`);
    assert.equal(visualContent.day, day.day, `Day ${day.day} number match`);
    assert.equal(visualContent.visuals.length, 4, `Day ${day.day} must have 4 visual parts`);

    for (let v = 0; v < visualContent.visuals.length; v++) {
      const visual = visualContent.visuals[v];
      assert.equal(visual.template, 'compare', `Visual ${v + 1} must use compare template`);
      assert.equal(visual.steps.length, 4, `Visual ${v + 1} must have exactly 4 steps`);

      // Verify codeHash matches part code
      const expectedCodeHash = crypto.createHash('sha256').update(day.parts[v].code || '').digest('hex');
      assert.equal(visual.codeHash, expectedCodeHash, `Day ${day.day} Part ${v + 1} codeHash must match exact code`);

      // Verify promptSha matches prompt
      const expectedPromptSha = crypto.createHash('sha256').update(visual.prompt).digest('hex');
      assert.equal(visual.promptSha, expectedPromptSha, `Day ${day.day} Part ${v + 1} promptSha must match prompt`);

      // Verify zero numeric digits in captions
      for (const step of visual.steps) {
        assert.ok(!/\d/.test(step.caption), `Day ${day.day} visual caption must not contain digits: "${step.caption}"`);
        assert.ok(step.caption.endsWith('.'), `Day ${day.day} visual caption must end with period: "${step.caption}"`);
      }
    }
  }
});
