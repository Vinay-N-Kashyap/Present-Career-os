import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';
import { BCOM_FINANCE_LONG_LESSONS } from '../src/lib/data/bcomFinanceLongLessons';

test('B.Com Finance & Accounting Long Lessons: Resolution & Language Invariants', () => {
  // 1. bcom-finance
  const finLesson = getLongLesson('bcom-finance', 1);
  assert.ok(finLesson, 'bcom-finance Day 1 long lesson must resolve');
  assert.equal(finLesson.day, 1);
  assert.equal(finLesson.parts.length, 5, 'bcom-finance Day 1 must contain exactly 5 parts');
  assert.ok(finLesson.summary.length >= 4, 'bcom-finance Day 1 must contain comprehensive summary');
  assert.ok(finLesson.projectStep, 'bcom-finance Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('bcom-finance'), 'python');

  const finLesson2 = getLongLesson('bcom-finance', 2);
  assert.ok(finLesson2, 'bcom-finance Day 2 long lesson must resolve');
  assert.equal(finLesson2.day, 2);
  assert.equal(finLesson2.parts.length, 5, 'bcom-finance Day 2 must contain exactly 5 parts');

  // 2. bcom-accounting
  const acctLesson = getLongLesson('bcom-accounting', 1);
  assert.ok(acctLesson, 'bcom-accounting Day 1 long lesson must resolve');
  assert.equal(acctLesson.day, 1);
  assert.equal(acctLesson.parts.length, 5, 'bcom-accounting Day 1 must contain exactly 5 parts');
  assert.ok(acctLesson.summary.length >= 4, 'bcom-accounting Day 1 must contain comprehensive summary');
  assert.ok(acctLesson.projectStep, 'bcom-accounting Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('bcom-accounting'), 'python');

  const acctLesson2 = getLongLesson('bcom-accounting', 2);
  assert.ok(acctLesson2, 'bcom-accounting Day 2 long lesson must resolve');
  assert.equal(acctLesson2.day, 2);
  assert.equal(acctLesson2.parts.length, 5, 'bcom-accounting Day 2 must contain exactly 5 parts');
});

test('B.Com Finance Day 1: DCF, WACC & DuPont ROE Python Code Snippets & Socratic Checks Verification', () => {
  const finLesson = getLongLesson('bcom-finance', 1);
  assert.ok(finLesson);

  for (const part of finLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable Python code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);

    // Verify Socratic MCQ Check
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');

    // Structural code invariants
    assert.ok(part.code.includes('print('), `Code in '${part.title}' must print results`);
  }
});

test('B.Com Accounting Day 1: Accrual Invariants & Double-Entry Ledger Python Code Snippets & Socratic Checks Verification', () => {
  const acctLesson = getLongLesson('bcom-accounting', 1);
  assert.ok(acctLesson);

  for (const part of acctLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable Python code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);

    // Verify Socratic MCQ Check
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');

    // Structural code invariants
    assert.ok(part.code.includes('print('), `Code in '${part.title}' must print results`);
  }
});

test('B.Com Finance Day 2: LBO Modeling, M&A Accretion, Real Options & FX Hedging Snippets Verification', () => {
  const finLesson2 = getLongLesson('bcom-finance', 2);
  assert.ok(finLesson2, 'bcom-finance Day 2 must resolve');
  assert.equal(finLesson2.day, 2);
  assert.equal(finLesson2.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(finLesson2);
  const totalMin = estimateLessonMinutes(finLesson2);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < finLesson2.parts.length; i++) {
    const part = finLesson2.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code?.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.ok(finLesson2.parts[0].code?.includes('calculate_lbo_returns'));
  assert.ok(finLesson2.parts[1].code?.includes('calculate_mna_accretion_dilution'));
  assert.ok(finLesson2.parts[2].code?.includes('calculate_real_option_value'));
  assert.ok(finLesson2.parts[3].code?.includes('calculate_optimal_capital_structure'));
  assert.ok(finLesson2.parts[4].code?.includes('evaluate_fx_hedging_strategies'));
});

test('B.Com Accounting Day 2: ASC 842 Leases, Multi-Currency Consolidation, Inventory Costing, Goodwill & ERP Recon Snippets Verification', () => {
  const acctLesson2 = getLongLesson('bcom-accounting', 2);
  assert.ok(acctLesson2, 'bcom-accounting Day 2 must resolve');
  assert.equal(acctLesson2.day, 2);
  assert.equal(acctLesson2.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(acctLesson2);
  const totalMin = estimateLessonMinutes(acctLesson2);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < acctLesson2.parts.length; i++) {
    const part = acctLesson2.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code?.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.ok(acctLesson2.parts[0].code?.includes('calculate_lease_amortization_schedule'));
  assert.ok(acctLesson2.parts[1].code?.includes('consolidate_foreign_subsidiary'));
  assert.ok(acctLesson2.parts[2].code?.includes('calculate_inventory_costing_models'));
  assert.ok(acctLesson2.parts[3].code?.includes('evaluate_goodwill_impairment'));
  assert.ok(acctLesson2.parts[4].code?.includes('reconcile_subledger_to_general_ledger'));
});

test('Block 124: B.Com Finance Day 3: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom-finance', 3);
  assert.ok(lesson, 'bcom-finance Day 3 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom-finance');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5, 'bcom-finance Day 3 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom-finance'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 124: B.Com Finance Day 3: Multi-Stage DCF, Hamada Beta, WACC Sensitivity, LBO Waterfall & Equity Bridge Verification', () => {
  const lesson = BCOM_FINANCE_LONG_LESSONS[2];
  assert.ok(lesson, 'BCOM_FINANCE_LONG_LESSONS[2] must exist');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code?.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);
    assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Part ${i + 1} must have >= 3 codeNotes`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.ok(check.options.length === 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.equal(typeof check.answer, 'number', `Part ${i + 1} answer must be numerical index`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be within options range`);
    assert.ok(check.why && check.why.length > 0, `Part ${i + 1} check why explanation must be non-empty`);
    assert.equal(check.answerIndex, check.answer);
    assert.equal(check.explanation, check.why);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /Multi-Stage DCF.*Gordon Growth/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_multistage_dcf_valuation'));
  assert.match(lesson.parts[1].title, /Hamada Equation/i);
  assert.ok(lesson.parts[1].code?.includes('relever_beta_hamada_equation'));
  assert.match(lesson.parts[2].title, /WACC Matrix.*Sensitivity/i);
  assert.ok(lesson.parts[2].code?.includes('build_dcf_sensitivity_matrix'));
  assert.match(lesson.parts[3].title, /LBO.*Debt Waterfall.*Cash Sweep/i);
  assert.ok(lesson.parts[3].code?.includes('model_lbo_debt_sweep_waterfall'));
  assert.match(lesson.parts[4].title, /Equity Value Bridge/i);
  assert.ok(lesson.parts[4].code?.includes('synthesize_equity_value_bridge'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});


