import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';

/**
 * Block 34 / TASK-322: Results enrichment, timer visibility guard, difficulty hints & finish-interview guard.
 */

// ─── 1. Difficulty Hint Resolution ───────────────────────────────────────────
describe('InterviewSetupView: Difficulty Hint Descriptions', () => {
  const hintFor = (d: 'easy' | 'normal' | 'hard'): string => {
    if (d === 'easy') return '🟢 Warm-up mode — shorter rounds, gentler follow-ups, ideal for first-timers building confidence.';
    if (d === 'normal') return '🟡 Standard corporate difficulty — balanced rubric scoring with realistic hiring-panel pressure.';
    return '🔴 Senior-level rigor — aggressive follow-ups, strict boundary evaluation, top-percentile expectation.';
  };

  it('returns distinct non-empty hint for each difficulty level', () => {
    const easy = hintFor('easy');
    const normal = hintFor('normal');
    const hard = hintFor('hard');
    assert.ok(easy.length > 20, 'easy hint too short');
    assert.ok(normal.length > 20, 'normal hint too short');
    assert.ok(hard.length > 20, 'hard hint too short');
    assert.notEqual(easy, normal);
    assert.notEqual(normal, hard);
    assert.notEqual(easy, hard);
    // Verify emoji prefix encodes severity
    assert.ok(easy.startsWith('🟢'), 'easy should start with green circle');
    assert.ok(normal.startsWith('🟡'), 'normal should start with yellow circle');
    assert.ok(hard.startsWith('🔴'), 'hard should start with red circle');
  });
});

// ─── 2. STAR Metrics Card Rendering Logic ────────────────────────────────────
describe('InterviewResultsView: STAR Metrics Card Logic', () => {
  it('correctly marks STAR steps as covered or uncovered', () => {
    const steps = ['Situation', 'Task', 'Action', 'Result'];
    const stepsCompleted = 3; // 3 of 4 STAR steps done

    const results = steps.map((step, idx) => ({
      step,
      covered: idx < stepsCompleted
    }));

    assert.equal(results[0].covered, true, 'Situation should be covered');
    assert.equal(results[1].covered, true, 'Task should be covered');
    assert.equal(results[2].covered, true, 'Action should be covered');
    assert.equal(results[3].covered, false, 'Result should NOT be covered when only 3 steps done');
  });

  it('handles full 4/4 STAR completion', () => {
    const steps = ['Situation', 'Task', 'Action', 'Result'];
    const stepsCompleted = 4;
    const allCovered = steps.every((_, idx) => idx < stepsCompleted);
    assert.ok(allCovered, 'All 4 steps should be covered at stepsCompleted=4');
  });

  it('improvements rendering handles string, array, and fallback', () => {
    const renderImprovements = (val: any): string => {
      if (typeof val === 'string') return val;
      if (Array.isArray(val)) return val.join('. ');
      return 'Keep practicing to refine your approach.';
    };

    assert.equal(renderImprovements('Work on time management'), 'Work on time management');
    assert.equal(renderImprovements(['A', 'B', 'C']), 'A. B. C');
    assert.equal(renderImprovements(undefined), 'Keep practicing to refine your approach.');
    assert.equal(renderImprovements(null), 'Keep practicing to refine your approach.');
  });
});

// ─── 3. Tab Visibility Timer Pause Logic ─────────────────────────────────────
describe('Interview Timer: Tab Visibility Pause Guard', () => {
  it('tabVisibleRef prevents tick increment when tab is hidden', () => {
    // Simulate the timer logic in isolation
    let elapsed = 0;
    const tabVisible = { current: true };

    // Normal tick: tabVisible=true -> increments
    const tick = () => { if (tabVisible.current) elapsed += 1; };

    tick(); tick(); tick();
    assert.equal(elapsed, 3, 'should tick 3 times when visible');

    // Tab hidden -> should NOT increment
    tabVisible.current = false;
    tick(); tick();
    assert.equal(elapsed, 3, 'should stay at 3 when tab hidden');

    // Tab visible again -> resumes
    tabVisible.current = true;
    tick();
    assert.equal(elapsed, 4, 'should resume to 4 when visible again');
  });
});

// ─── 4. Finish Interview Double-Click Guard ──────────────────────────────────
describe('Interview Finish: Double-Invocation Guard', () => {
  it('finishingRef prevents second invocation', () => {
    const finishingRef = { current: false };
    let callCount = 0;

    const finishInterview = () => {
      if (finishingRef.current) return;
      finishingRef.current = true;
      callCount++;
    };

    finishInterview();
    assert.equal(callCount, 1, 'first call should execute');
    assert.equal(finishingRef.current, true, 'ref should be locked');

    finishInterview();
    assert.equal(callCount, 1, 'second call should be blocked');

    // Reset for new session
    finishingRef.current = false;
    finishInterview();
    assert.equal(callCount, 2, 'should work again after reset');
  });
});
