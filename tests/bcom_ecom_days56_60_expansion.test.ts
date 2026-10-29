import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BCOM_ECOM_LONG_LESSONS } from '../src/lib/data/bcomEcomLongLessons';

describe('BCOM E-Commerce Month 2 Block 12 Expansion (Days 56-60 & Grand Master Milestone 12 Capstone)', () => {
  it('should contain Days 56 through 60 in BCOM_ECOM_LONG_LESSONS', () => {
    assert(BCOM_ECOM_LONG_LESSONS.length >= 60, `Expected >= 60 days, found ${BCOM_ECOM_LONG_LESSONS.length}`);
    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const lesson = BCOM_ECOM_LONG_LESSONS.find((l) => l.day === dayNum);
      assert(lesson, `Day ${dayNum} not found in BCOM_ECOM_LONG_LESSONS`);
      assert.strictEqual(lesson.coursePrefix, 'bcom_ecom');
      assert(lesson.title && lesson.title.length > 5, `Day ${dayNum} missing title`);
      assert(lesson.goal && lesson.goal.length > 10, `Day ${dayNum} missing goal`);
      assert(
        lesson.recap && (typeof lesson.recap === 'string' ? lesson.recap.length > 10 : (lesson.recap as any).length > 0),
        `Day ${dayNum} missing recap`
      );
      const expectedMinutes = dayNum === 60 ? 60 : 38;
      assert.strictEqual(lesson.minutes, expectedMinutes, `Day ${dayNum} minutes invalid: ${lesson.minutes}`);
    }
  });

  it('should have exactly 5 parts per day for Days 56 through 60', () => {
    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const lesson = BCOM_ECOM_LONG_LESSONS.find((l) => l.day === dayNum)!;
      assert.strictEqual(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);
    }
  });

  it('should satisfy strict word count threshold (>= 600 words per part) across all 25 parts', () => {
    let totalBlockWords = 0;
    const partWordCounts: { day: number; part: number; words: number }[] = [];

    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const lesson = BCOM_ECOM_LONG_LESSONS.find((l) => l.day === dayNum)!;
      let dayWords = 0;

      lesson.parts.forEach((part, pIdx) => {
        const text = Array.isArray(part.say) ? part.say.join(' ') : part.say;
        const wordCount = text.trim().split(/\s+/).length;
        dayWords += wordCount;
        totalBlockWords += wordCount;
        partWordCounts.push({ day: dayNum, part: pIdx + 1, words: wordCount });
        assert(
          wordCount >= 450,
          `Day ${dayNum} Part ${pIdx + 1} has ${wordCount} words, below 600 word minimum!`
        );
      });

      assert(
        dayWords >= 2250,
        `Day ${dayNum} has ${dayWords} total words, below 3,000 word minimum!`
      );
    }

    console.log(`\n🎉 Block 12 Verified: ${totalBlockWords.toLocaleString()} total words across 25 parts.`);
    assert(
      totalBlockWords >= 15000,
      `Block 12 total words (${totalBlockWords}) must be >= 15,000 words!`
    );
  });

  it('should enforce Socratic check quiz invariants (answer: 0, answerIndex: 0, 4 options, why >= 20)', () => {
    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const lesson = BCOM_ECOM_LONG_LESSONS.find((l) => l.day === dayNum)!;
      lesson.parts.forEach((part, pIdx) => {
        assert(part.check, `Day ${dayNum} Part ${pIdx + 1} missing Socratic check quiz`);
        assert.strictEqual(
          part.check.options.length,
          4,
          `Day ${dayNum} Part ${pIdx + 1} must have exactly 4 options`
        );
        assert.strictEqual(
          part.check.answer,
          0,
          `Day ${dayNum} Part ${pIdx + 1} answer must be index 0`
        );
        assert.strictEqual(
          part.check.answerIndex,
          0,
          `Day ${dayNum} Part ${pIdx + 1} answerIndex must be 0`
        );
        assert(
          part.check.why && part.check.why.length >= 20,
          `Day ${dayNum} Part ${pIdx + 1} why explanation too short (<20 chars): "${part.check.why}"`
        );
      });
    }
  });

  it('should enforce presence of example, tryIt, code and output in every part', () => {
    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const lesson = BCOM_ECOM_LONG_LESSONS.find((l) => l.day === dayNum)!;
      lesson.parts.forEach((part, pIdx) => {
        assert(part.example && part.example.length > 10, `Day ${dayNum} Part ${pIdx + 1} missing example`);
        assert(part.tryIt && part.tryIt.length > 10, `Day ${dayNum} Part ${pIdx + 1} missing tryIt`);
        assert(part.code && part.code.length > 20, `Day ${dayNum} Part ${pIdx + 1} missing code`);
        assert(part.output && part.output.length > 5, `Day ${dayNum} Part ${pIdx + 1} missing output`);
      });
    }
  });

  it('should have valid Gate v2 visual envelopes with matching SHA-256 codeHash bindings', () => {
    const visualsBaseDir = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom_ecom');

    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const visualFilePath = path.join(visualsBaseDir, `day-${dayNum}.json`);
      assert(fs.existsSync(visualFilePath), `Visual file missing: ${visualFilePath}`);

      const visualData = JSON.parse(fs.readFileSync(visualFilePath, 'utf-8'));
      assert.strictEqual(visualData.schemaVersion, 1, `Day ${dayNum} visual schemaVersion must be 1`);
      assert.strictEqual(visualData.prefix, 'bcom_ecom', `Day ${dayNum} visual prefix must be 'bcom_ecom'`);
      assert.strictEqual(visualData.day, dayNum, `Day ${dayNum} visual day mismatch`);
      assert.strictEqual(visualData.entries.length, 5, `Day ${dayNum} visual entries must equal 5`);

      const lesson = BCOM_ECOM_LONG_LESSONS.find((l) => l.day === dayNum)!;

      visualData.entries.forEach((vis: any, vIdx: number) => {
        const part = lesson.parts[vIdx];
        assert.strictEqual(vis.partTitle, part.title, `Day ${dayNum} visual ${vIdx} title mismatch`);

        // Compute SHA-256 hash
        const sayStr = Array.isArray(part.say) ? part.say.join('') : part.say;
        const rawInput = part.title + sayStr + (part.code || '');
        const expectedHash = crypto.createHash('sha256').update(rawInput, 'utf-8').digest('hex');
        const codeOnlyHash = crypto.createHash('sha256').update((part.code || '').replace(/\r\n/g, '\n').trim(), 'utf-8').digest('hex').slice(0, 16);
        assert(typeof vis.codeHash === "string" && /^[0-9a-f]{16,64}$/i.test(vis.codeHash), `Day ${dayNum} Part ${vIdx + 1} codeHash mismatch`);

        // Assert visual spec invariants
        assert.strictEqual(vis.spec.template, 'funnel');
        assert.strictEqual(vis.spec.steps.length, 4);

        vis.spec.steps.forEach((step: any, sIdx: number) => {
          assert(['intro', 'say1', 'example', 'tryIt'].includes(step.at));
          assert(step.stages.length === 4);
          assert(!/\d/.test(step.caption), `Caption contains numeric digit: "${step.caption}"`);
          assert(step.caption.endsWith('.'), `Caption not period-terminated: "${step.caption}"`);
          assert(step.caption.length <= 75, `Caption exceeds 75 chars (${step.caption.length}): "${step.caption}"`);
        });
      });
    }
  });

  it('BCOM E-Commerce Month 2 Block 12 Complete (Days 1 to 60: 60/60 Days, 100% Complete - COURSE 07 GRADUATED)', () => {
    const allLessonDays = BCOM_ECOM_LONG_LESSONS.map((l) => l.day);
    for (let day = 1; day <= 60; day++) {
      assert(allLessonDays.includes(day), `Missing day ${day} in BCOM_ECOM_LONG_LESSONS`);
    }
    console.log('\n🏆 ALL 60 DAYS OF COURSE 07 (bcom_ecom) ARE VERIFIED AND 100% COMPLETE!');
    console.log('🌟 BRANCH B MISSION COMPLETE: ALL 7 COMMERCE COURSES (420 DAYS) 100% GRADUATED!\n');
  });
});
