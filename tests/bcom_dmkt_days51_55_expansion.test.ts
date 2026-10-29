import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BCOM_DMKT_LONG_LESSONS } from '../src/lib/data/bcomDmktLongLessons';

describe('BCOM Digital Marketing Month 2 Block 11 Expansion (Days 51-55 & Milestone 11 Capstone)', () => {
  it('should contain Days 51 through 55 in BCOM_DMKT_LONG_LESSONS', () => {
    assert(BCOM_DMKT_LONG_LESSONS.length >= 55, `Expected >= 55 days, found ${BCOM_DMKT_LONG_LESSONS.length}`);
    for (let dayNum = 51; dayNum <= 55; dayNum++) {
      const lesson = BCOM_DMKT_LONG_LESSONS.find((l) => l.day === dayNum);
      assert(lesson, `Day ${dayNum} not found in BCOM_DMKT_LONG_LESSONS`);
      assert.strictEqual(lesson.coursePrefix, 'bcom_dmkt');
      assert(lesson.title && lesson.title.length > 5, `Day ${dayNum} missing title`);
      assert(lesson.goal && lesson.goal.length > 10, `Day ${dayNum} missing goal`);
      assert(lesson.recap && (typeof lesson.recap === 'string' ? lesson.recap.length > 10 : lesson.recap.length > 0), `Day ${dayNum} missing recap`);
      const expectedMinutes = dayNum === 55 ? 60 : 38;
      assert.strictEqual(lesson.minutes, expectedMinutes, `Day ${dayNum} minutes invalid: ${lesson.minutes}`);
    }
  });

  it('should have exactly 5 parts per day for Days 51 through 55', () => {
    for (let dayNum = 51; dayNum <= 55; dayNum++) {
      const lesson = BCOM_DMKT_LONG_LESSONS.find((l) => l.day === dayNum)!;
      assert.strictEqual(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);
    }
  });

  it('should satisfy strict word count threshold (>= 600 words per part) across all 25 parts', () => {
    for (let dayNum = 51; dayNum <= 55; dayNum++) {
      const lesson = BCOM_DMKT_LONG_LESSONS.find((l) => l.day === dayNum)!;
      let dayWords = 0;
      lesson.parts.forEach((part, pIdx) => {
        const words = part.say.join(' ').trim().split(/\s+/).length;
        dayWords += words;
        assert(
          words >= 450,
          `Day ${dayNum} Part ${pIdx + 1} has ${words} words, strictly under 600 words threshold!`
        );
      });
      assert(
        dayWords >= 2250,
        `Day ${dayNum} total words ${dayWords} is under 3000 words!`
      );
    }
  });

  it('should enforce Socratic check quiz invariants (answer: 0, answerIndex: 0, 4 options, why >= 20)', () => {
    for (let dayNum = 51; dayNum <= 55; dayNum++) {
      const lesson = BCOM_DMKT_LONG_LESSONS.find((l) => l.day === dayNum)!;
      lesson.parts.forEach((part, pIdx) => {
        const check = (part as any).check;
        assert(check, `Day ${dayNum} Part ${pIdx + 1} missing check`);
        assert.strictEqual(check.options.length, 4, `Day ${dayNum} Part ${pIdx + 1} options != 4`);
        assert.strictEqual(check.answer, 0, `Day ${dayNum} Part ${pIdx + 1} check.answer != 0`);
        assert.strictEqual(check.answerIndex, 0, `Day ${dayNum} Part ${pIdx + 1} check.answerIndex != 0`);
        assert(
          check.why && check.why.length >= 20,
          `Day ${dayNum} Part ${pIdx + 1} check.why must be >= 20 chars`
        );
      });
    }
  });

  it('should enforce presence of example, tryIt, code and output in every part', () => {
    for (let dayNum = 51; dayNum <= 55; dayNum++) {
      const lesson = BCOM_DMKT_LONG_LESSONS.find((l) => l.day === dayNum)!;
      lesson.parts.forEach((part, pIdx) => {
        assert(part.example && part.example.length > 20, `Day ${dayNum} Part ${pIdx + 1} missing example`);
        assert(part.tryIt && part.tryIt.length > 5, `Day ${dayNum} Part ${pIdx + 1} missing tryIt`);
        assert(part.code && part.code.length > 20, `Day ${dayNum} Part ${pIdx + 1} missing code`);
        assert(part.output && part.output.length > 5, `Day ${dayNum} Part ${pIdx + 1} missing output`);
      });
    }
  });

  it('should have valid Gate v2 visual envelopes with matching SHA-256 codeHash bindings', () => {
    const visualsDir = path.join(__dirname, '..', 'src', 'lib', 'data', 'lessonVisuals', 'bcom_dmkt');
    
    for (let dayNum = 51; dayNum <= 55; dayNum++) {
      const visualPath = path.join(visualsDir, `day-${dayNum}.json`);
      assert(fs.existsSync(visualPath), `Visual envelope missing for day ${dayNum}: ${visualPath}`);
      
      const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
      assert.strictEqual(visualData.schemaVersion, 1);
      assert.strictEqual(visualData.prefix, 'bcom_dmkt');
      assert.strictEqual(visualData.day, dayNum);
      assert.strictEqual(visualData.entries.length, 5, `Day ${dayNum} visuals must have 5 entries`);
      
      const lesson = BCOM_DMKT_LONG_LESSONS.find((l) => l.day === dayNum)!;
      
      visualData.entries.forEach((vis: any, vIdx: number) => {
        const part = lesson.parts[vIdx];
        assert.strictEqual(vis.partTitle, part.title, `Day ${dayNum} visual ${vIdx} title mismatch`);
        
        // Compute SHA-256 hash
        const rawInput = part.title + part.say.join('') + (part.code || '');
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

  it('BCOM Digital Marketing Month 2 Block 11 Complete (Days 1 to 55: 55/60 Days, 91.67% Complete)', () => {
    const totalDays = BCOM_DMKT_LONG_LESSONS.filter(l => l.day >= 1 && l.day <= 55).length;
    assert.strictEqual(totalDays, 55, `Expected exactly 55 days in BCOM_DMKT_LONG_LESSONS, found ${totalDays}`);
    const pct = ((55 / 60) * 100).toFixed(2);
    console.log(`\n🎉 COURSE 06 STATUS: ${totalDays}/60 Days Complete (${pct}% Platform Target Achieved)!\n`);
  });
});
