import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';
import { BCOM_FINANCE_LONG_LESSONS } from '../src/lib/data/bcomFinanceLongLessons';
import { BCOM_ACCOUNTING_LONG_LESSONS } from '../src/lib/data/bcomAccountingLongLessons';

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

test('Block 125: B.Com Finance Day 4: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom-finance', 4);
  assert.ok(lesson, 'bcom-finance Day 4 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom-finance');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5, 'bcom-finance Day 4 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom-finance'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 125: B.Com Finance Day 4: Bond YTM, Duration-Convexity, Bootstrapping, CDS & Options Collar Verification', () => {
  const lesson = BCOM_FINANCE_LONG_LESSONS[3];
  assert.ok(lesson, 'BCOM_FINANCE_LONG_LESSONS[3] must exist');
  assert.equal(lesson.day, 4);
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
  assert.match(lesson.parts[0].title, /Bond Pricing.*Yield to Maturity.*Newton-Raphson/i);
  assert.ok(lesson.parts[0].code?.includes('solve_bond_yield_to_maturity'));
  assert.match(lesson.parts[1].title, /Macaulay Duration.*Convexity/i);
  assert.ok(lesson.parts[1].code?.includes('calculate_bond_duration_and_convexity'));
  assert.match(lesson.parts[2].title, /Spot Rate Bootstrapping.*Forward Rates/i);
  assert.ok(lesson.parts[2].code?.includes('bootstrap_spot_and_forward_yield_curve'));
  assert.match(lesson.parts[3].title, /Credit Default Swaps.*CDS.*Default Probability/i);
  assert.ok(lesson.parts[3].code?.includes('calculate_cds_implied_default_probability'));
  assert.match(lesson.parts[4].title, /Black-Scholes-Merton.*Treasury Collar/i);
  assert.ok(lesson.parts[4].code?.includes('model_black_scholes_options_and_treasury_collar'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 126: B.Com Finance Day 5 Capstone: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom-finance', 5);
  assert.ok(lesson, 'bcom-finance Day 5 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom-finance');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5, 'bcom-finance Day 5 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom-finance'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 126: B.Com Finance Day 5 Capstone: Football Field Valuation, WACC Optimization, Covenants & Treasury Hedging Verification', () => {
  const lesson = BCOM_FINANCE_LONG_LESSONS[4];
  assert.ok(lesson, 'BCOM_FINANCE_LONG_LESSONS[4] must exist');
  assert.equal(lesson.day, 5);
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
  assert.match(lesson.parts[0].title, /Triangulated Enterprise Valuation.*Multi-Stage DCF/i);
  assert.ok(lesson.parts[0].code?.includes('triangulate_enterprise_valuation_football_field'));
  assert.match(lesson.parts[1].title, /Trade-Off Capital Structure.*WACC Minimization/i);
  assert.ok(lesson.parts[1].code?.includes('optimize_capital_structure_wacc'));
  assert.match(lesson.parts[2].title, /Multi-Tranche Debt.*Covenant Headroom/i);
  assert.ok(lesson.parts[2].code?.includes('stress_test_debt_covenant_headroom'));
  assert.match(lesson.parts[3].title, /Enterprise Treasury.*Hedging/i);
  assert.ok(lesson.parts[3].code?.includes('execute_enterprise_treasury_hedging_portfolio'));
  assert.match(lesson.parts[4].title, /Boardroom Strategic Defense.*CFO Accreditation/i);
  assert.ok(lesson.parts[4].code?.includes('generate_cfo_boardroom_capital_plan_and_accreditation'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 127: B.Com Accounting Day 3: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom-accounting', 3);
  assert.ok(lesson, 'bcom-accounting Day 3 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom-accounting');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5, 'bcom-accounting Day 3 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom-accounting'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 127: B.Com Accounting Day 3: ABC Costing, Direct Materials, Direct Labor, Overhead & Flexible Budget Verification', () => {
  const lesson = BCOM_ACCOUNTING_LONG_LESSONS[2];
  assert.ok(lesson, 'BCOM_ACCOUNTING_LONG_LESSONS[2] must exist');
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
  assert.match(lesson.parts[0].title, /Activity-Based Costing/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_activity_based_costing_allocation'));
  assert.match(lesson.parts[1].title, /Direct Materials.*Variances/i);
  assert.ok(lesson.parts[1].code?.includes('calculate_direct_materials_variances'));
  assert.match(lesson.parts[2].title, /Direct Labor.*Variances/i);
  assert.ok(lesson.parts[2].code?.includes('calculate_direct_labor_variances'));
  assert.match(lesson.parts[3].title, /Manufacturing Overhead Variances/i);
  assert.ok(lesson.parts[3].code?.includes('calculate_manufacturing_overhead_variances'));
  assert.match(lesson.parts[4].title, /Flexible Budgeting.*Variance Waterfall/i);
  assert.ok(lesson.parts[4].code?.includes('reconcile_master_flexible_budget_variance'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 128: B.Com Accounting Day 4: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom-accounting', 4);
  assert.ok(lesson, 'bcom-accounting Day 4 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom-accounting');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5, 'bcom-accounting Day 4 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom-accounting'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 128: B.Com Accounting Day 4: Fair Value Hierarchy, CECL, Convertible Debt & Hedge Accounting Verification', () => {
  const lesson = BCOM_ACCOUNTING_LONG_LESSONS[3];
  assert.ok(lesson, 'BCOM_ACCOUNTING_LONG_LESSONS[3] must exist');
  assert.equal(lesson.day, 4);
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
  assert.match(lesson.parts[0].title, /ASC 820.*Fair Value/i);
  assert.ok(lesson.parts[0].code?.includes('classify_and_value_asc820_hierarchy'));
  assert.match(lesson.parts[1].title, /ASC 326.*CECL/i);
  assert.ok(lesson.parts[1].code?.includes('model_cecl_expected_credit_loss'));
  assert.match(lesson.parts[2].title, /ASC 470.*Convertible Debt/i);
  assert.ok(lesson.parts[2].code?.includes('bifurcate_convertible_bond_asc470'));
  assert.match(lesson.parts[3].title, /ASC 815.*Hedge/i);
  assert.ok(lesson.parts[3].code?.includes('evaluate_cash_flow_hedge_dollar_offset'));
  assert.match(lesson.parts[4].title, /Financial Instruments.*Control Tower/i);
  assert.ok(lesson.parts[4].code?.includes('run_integrated_financial_instruments_suite'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 129: B.Com Accounting Day 5 Capstone: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom-accounting', 5);
  assert.ok(lesson, 'bcom-accounting Day 5 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom-accounting');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5, 'bcom-accounting Day 5 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom-accounting'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 129: B.Com Accounting Day 5 Capstone: Multi-Entity Consolidation, Cash Flow, Tax Provision, Adjusted EBITDA & Global Controller Accreditation Verification', () => {
  const lesson = BCOM_ACCOUNTING_LONG_LESSONS[4];
  assert.ok(lesson, 'BCOM_ACCOUNTING_LONG_LESSONS[4] must exist');
  assert.equal(lesson.day, 5);
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
  assert.match(lesson.parts[0].title, /Multi-Entity.*Consolidation.*ASC 810/i);
  assert.ok(lesson.parts[0].code?.includes('consolidate_multi_entity_enterprise'));
  assert.match(lesson.parts[1].title, /ASC 230.*Cash Flow.*Indirect/i);
  assert.ok(lesson.parts[1].code?.includes('reconstruct_asc230_cash_flow_statement'));
  assert.match(lesson.parts[2].title, /ASC 740.*Income Tax.*Deferred/i);
  assert.ok(lesson.parts[2].code?.includes('model_asc740_income_tax_provision'));
  assert.match(lesson.parts[3].title, /Regulation G.*Adjusted EBITDA/i);
  assert.ok(lesson.parts[3].code?.includes('reconcile_gaap_to_adjusted_ebitda'));
  assert.match(lesson.parts[4].title, /Global Financial Controller.*Accreditation/i);
  assert.ok(lesson.parts[4].code?.includes('generate_global_controller_audit_dossier_and_accreditation'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

// ============================================================================
// BLOCK 2 (DAYS 6-10: TASK-1359..1363) - SUBSIDIARY BOOKS, BRS & RECTIFICATION
// ============================================================================

test('Block 130: B.Com Accounting Days 6-10: Resolution & Structure Invariants', () => {
  for (let d = 6; d <= 10; d++) {
    const lesson = getLongLesson('bcom-accounting', d);
    assert.ok(lesson, `bcom-accounting Day ${d} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom-accounting');
    assert.equal(lesson.day, d);
    assert.equal(lesson.parts.length, 5, `bcom-accounting Day ${d} must have exactly 5 parts`);
    assert.equal(getLongLessonLanguage('bcom-accounting'), 'python');

    const expectedMin = d === 10 ? 50 : 45;
    assert.equal(lesson.minutes, expectedMin, `Day ${d} minutes must be ${expectedMin}`);

    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 8, `Day ${d} spoken minutes (${spoken}) must be at least 8`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 15, `Day ${d} total lesson minutes (${total}) must be at least 15`);

    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${d} summary must have >= 4 bullets`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, `Day ${d} projectStep must have title and >= 4 steps`);

    for (let i = 0; i < lesson.parts.length; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${d} Part ${i + 1} must have a title`);
      assert.ok(part.say.length >= 3, `Day ${d} Part ${i + 1} must have >= 3 say paragraphs`);

      const words = part.say.join(' ').split(/\s+/).length;
      assert.ok(words >= 580, `Day ${d} Part ${i + 1} word count (${words}) must be >= 580`);

      assert.ok(part.example && part.example.length > 0, `Day ${d} Part ${i + 1} must have an example`);
      assert.ok(part.code && part.code.includes('def '), `Day ${d} Part ${i + 1} code must contain Python functions`);
      assert.ok(part.output && part.output.length > 0, `Day ${d} Part ${i + 1} must have expected output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${d} Part ${i + 1} must have tryIt instructions`);

      // Socratic Check Invariants
      const check = part.check as any;
      assert.ok(check.question.length > 10, `Day ${d} Part ${i + 1} check question must be descriptive`);
      assert.equal(check.options.length, 4, `Day ${d} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(typeof check.answer, 'number', `Day ${d} Part ${i + 1} answer must be number`);
      assert.equal(check.answer, 0, `Day ${d} Part ${i + 1} answer index must be 0`);
      assert.ok(check.why && check.why.length > 15, `Day ${d} Part ${i + 1} why explanation must be rigorous`);
      assert.equal(check.answerIndex, 0);
      assert.equal(check.explanation, check.why);
    }
  }
});

test('Block 130: B.Com Accounting Day 6: 3-Column Cash Book & Petty Cash Imprest System Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 6);
  assert.ok(lesson);
  assert.equal(lesson.day, 6);

  assert.match(lesson.parts[0].title, /Triple-Column.*Cash.*Bank.*Discount/i);
  assert.ok(lesson.parts[0].code?.includes('process_three_column_cash_book'));
  assert.ok(lesson.parts[0].output?.includes('Closing Cash Balance: $9250.0'));

  assert.match(lesson.parts[1].title, /Analytical Petty Cash.*Imprest/i);
  assert.ok(lesson.parts[1].code?.includes('manage_imprest_petty_cash'));
  assert.ok(lesson.parts[1].output?.includes('Remaining Float: $760.0'));

  assert.match(lesson.parts[2].title, /Bank Overdraft.*Interest Accruals/i);
  assert.ok(lesson.parts[2].code?.includes('calculate_bank_overdraft_interest'));
  assert.ok(lesson.parts[2].output?.includes('Sanctioned Overdraft Limit: $25000.0'));

  assert.match(lesson.parts[3].title, /Cheque Clearing.*Dishonour.*Stale/i);
  assert.ok(lesson.parts[3].code?.includes('reconcile_dishonoured_and_stale_cheques'));
  assert.ok(lesson.parts[3].output?.includes('Dishonoured Cheques Count: 1'));

  assert.match(lesson.parts[4].title, /Cash Book Audit Trail.*General Ledger Closure/i);
  assert.ok(lesson.parts[4].code?.includes('audit_and_post_cash_book_to_general_ledger'));
  assert.ok(lesson.parts[4].output?.includes('Total Debits: $127700.0'));
});

test('Block 130: B.Com Accounting Day 7: Subsidiary Day Books & Control Account Reconciliation Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 7);
  assert.ok(lesson);
  assert.equal(lesson.day, 7);

  assert.match(lesson.parts[0].title, /Purchases Day Book.*Trade Discounts/i);
  assert.ok(lesson.parts[0].code?.includes('record_purchases_day_book'));
  assert.ok(lesson.parts[0].output?.includes('Total Net Credit Purchases: $106975.0'));

  assert.match(lesson.parts[1].title, /Sales Day Book.*Accounts Receivable/i);
  assert.ok(lesson.parts[1].code?.includes('record_sales_day_book'));
  assert.ok(lesson.parts[1].output?.includes('Total Net Credit Sales: $192940.0'));

  assert.match(lesson.parts[2].title, /Returns Books.*Debit Notes vs Credit Notes/i);
  assert.ok(lesson.parts[2].code?.includes('process_returns_and_memos'));
  assert.ok(lesson.parts[2].output?.includes('Total Purchases Returns (Debit Notes): $4650.0'));

  assert.match(lesson.parts[3].title, /Bills Receivable & Bills Payable Registers/i);
  assert.ok(lesson.parts[3].code?.includes('manage_bills_registers'));
  assert.ok(lesson.parts[3].output?.includes('Contingent Liability (Discounted BR): $40000.0'));

  assert.match(lesson.parts[4].title, /Control Accounts & Subsidiary Ledger Reconciliation/i);
  assert.ok(lesson.parts[4].code?.includes('reconcile_subsidiary_ledgers_with_gl'));
  assert.ok(lesson.parts[4].output?.includes('Accounts Receivable Reconciliation: PASS EQUILIBRIUM'));
});

test('Block 130: B.Com Accounting Day 8: Bank Reconciliation Statement (BRS) Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 8);
  assert.ok(lesson);
  assert.equal(lesson.day, 8);

  assert.match(lesson.parts[0].title, /Bank Reconciliation Statement Fundamentals/i);
  assert.ok(lesson.parts[0].code?.includes('prepare_bank_reconciliation_statement'));
  assert.ok(lesson.parts[0].output?.includes('Reconciled Balance as per Pass Book: $51500.0'));

  assert.match(lesson.parts[1].title, /Corrected Cash Book Protocol/i);
  assert.ok(lesson.parts[1].code?.includes('compute_adjusted_cash_book_and_final_brs'));
  assert.ok(lesson.parts[1].output?.includes('Adjusted Cash Book (New True Balance): $47200.0'));

  assert.match(lesson.parts[2].title, /Bank Overdraft BRS Inversion/i);
  assert.ok(lesson.parts[2].code?.includes('reconcile_bank_overdraft_brs'));
  assert.ok(lesson.parts[2].output?.includes('Reconciled Overdraft as per Pass Book: $22800.0'));

  assert.match(lesson.parts[3].title, /Error Detection & Classification.*Cash Book vs Commercial Bank/i);
  assert.ok(lesson.parts[3].code?.includes('audit_and_classify_bank_reconciliation_errors'));
  assert.ok(lesson.parts[3].output?.includes('Cash Book Internal Errors: 2'));

  assert.match(lesson.parts[4].title, /Continuous Automated Reconciliation Pipelines/i);
  assert.ok(lesson.parts[4].code?.includes('run_continuous_bank_reconciliation_pipeline'));
  assert.ok(lesson.parts[4].output?.includes('Matched Transactions: 3 (75.0%)'));
});

test('Block 130: B.Com Accounting Day 9: Trial Balance Arithmetic Checksum & Error Detection Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 9);
  assert.ok(lesson);
  assert.equal(lesson.day, 9);

  assert.match(lesson.parts[0].title, /Trial Balance Architecture.*Closing Balances/i);
  assert.ok(lesson.parts[0].code?.includes('extract_and_balance_trial_balance'));
  assert.ok(lesson.parts[0].output?.includes('Total Debits: $602000.0'));

  assert.match(lesson.parts[1].title, /Taxonomy of Accounting Errors.*Disclosed vs Undisclosed/i);
  assert.ok(lesson.parts[1].code?.includes('classify_and_diagnose_accounting_errors'));
  assert.ok(lesson.parts[1].output?.includes('Disclosed Errors Count: 2'));

  assert.match(lesson.parts[2].title, /Forensic Checksum Analysis.*Transposition/i);
  assert.ok(lesson.parts[2].code?.includes('run_forensic_trial_balance_checksum'));
  assert.ok(lesson.parts[2].output?.includes('Divisible by 9: True'));

  assert.match(lesson.parts[3].title, /Compilation Methodologies.*Gross Totals.*Net Balances/i);
  assert.ok(lesson.parts[3].code?.includes('compare_trial_balance_compilation_methods'));
  assert.ok(lesson.parts[3].output?.includes('Balance Method: Debit=$230000.0'));

  assert.match(lesson.parts[4].title, /Pre-Closing Diagnostic Control Tower/i);
  assert.ok(lesson.parts[4].code?.includes('generate_pre_closing_trial_balance_dossier'));
  assert.ok(lesson.parts[4].output?.includes('Audit Readiness Score: 100.0/100'));
});

test('Block 130: B.Com Accounting Day 10 Capstone: Rectification of Errors, Suspense Account & IAS 8 Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 10);
  assert.ok(lesson);
  assert.equal(lesson.day, 10);

  assert.match(lesson.parts[0].title, /Stages of Error Rectification/i);
  assert.ok(lesson.parts[0].code?.includes('rectify_errors_by_accounting_stage'));
  assert.ok(lesson.parts[0].output?.includes('Total Error Stages Rectified: 3'));

  assert.match(lesson.parts[1].title, /Suspense Account Lifecycle.*Zero-Balance/i);
  assert.ok(lesson.parts[1].code?.includes('manage_suspense_account_lifecycle'));
  assert.ok(lesson.parts[1].output?.includes('Suspense Fully Liquidated (Zero Balance): True'));

  assert.match(lesson.parts[2].title, /Two-Sided Error Rectification Matrix/i);
  assert.ok(lesson.parts[2].code?.includes('rectify_two_sided_errors_matrix'));
  assert.ok(lesson.parts[2].output?.includes('Total Two-Sided Errors Rectified: 3'));

  assert.match(lesson.parts[3].title, /Prior Period Error Adjustments.*IAS 8/i);
  assert.ok(lesson.parts[3].code?.includes('model_prior_period_pnl_adjustment_waterfall'));
  assert.ok(lesson.parts[3].output?.includes('Restated Opening Retained Earnings: $428250.0'));

  assert.match(lesson.parts[4].title, /Milestone 2 Capstone.*Financial Controller Accreditation/i);
  assert.ok(lesson.parts[4].code?.includes('generate_milestone2_capstone_accreditation_dossier'));
  assert.ok(lesson.parts[4].output?.includes('CERTIFIED_ENTERPRISE_FINANCIAL_CONTROLLER'));
});

test('Block 130: B.Com Accounting Days 6-10 Gate v2 Visual JSON Integrity Verification', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let d = 6; d <= 10; d++) {
    const pad = String(d).padStart(2, '0');
    const visPath = path.join(__dirname, `../src/lib/data/lessonVisuals/bcom-accounting/day-${pad}.json`);
    assert.ok(fs.existsSync(visPath), `Visual JSON must exist for Day ${d}`);

    const vis = JSON.parse(fs.readFileSync(visPath, 'utf8'));
    assert.equal(vis.prefix, 'bcom-accounting');
    assert.equal(vis.day, d);
    assert.equal(vis.entries.length, 5, `Day ${d} visual must contain exactly 5 entries`);

    const lesson = getLongLesson('bcom-accounting', d);
    for (let i = 0; i < 5; i++) {
      const entry = vis.entries[i];
      const part = lesson.parts[i];

      assert.equal(entry.spec.template, 'ledger-sheet', `Day ${d} Part ${i + 1} must use ledger-sheet template`);
      assert.ok(entry.spec.steps.length >= 3, `Day ${d} Part ${i + 1} visual must have >= 3 steps`);

      // Verify SHA-256 binding between code and visual entry
      const expectedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(entry.codeHash, expectedHash, `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
    }
  }
});


test('Block 131: B.Com Accounting Days 11-15: Resolution & Structure Invariants', () => {
  for (let d = 11; d <= 15; d++) {
    const lesson = getLongLesson('bcom-accounting', d);
    assert.ok(lesson, `bcom-accounting Day ${d} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom-accounting');
    assert.equal(lesson.day, d);
    assert.equal(lesson.parts.length, 5, `bcom-accounting Day ${d} must have exactly 5 parts`);
    assert.equal(getLongLessonLanguage('bcom-accounting'), 'python');

    const expectedMin = d === 15 ? 50 : 45;
    assert.equal(lesson.minutes, expectedMin, `Day ${d} minutes must be ${expectedMin}`);

    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 8, `Day ${d} spoken minutes (${spoken}) must be at least 8`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 15, `Day ${d} total lesson minutes (${total}) must be at least 15`);

    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${d} summary must have >= 4 bullets`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, `Day ${d} projectStep must have title and >= 4 steps`);

    for (let i = 0; i < lesson.parts.length; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${d} Part ${i + 1} must have a title`);

      const words = part.say.join(' ').split(/\s+/).length;
      assert.ok(words >= 580, `Day ${d} Part ${i + 1} word count (${words}) must be >= 580`);

      assert.ok(part.example && part.example.length > 0, `Day ${d} Part ${i + 1} must have an example`);
      assert.ok(part.code && part.code.trim().length > 0, `Day ${d} Part ${i + 1} code must not be empty`);
      assert.ok(part.output && part.output.trim().length > 0, `Day ${d} Part ${i + 1} must have expected output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${d} Part ${i + 1} must have tryIt instructions`);

      // Socratic Check Invariants
      const check = part.check as any;
      assert.ok(check.question.length > 10, `Day ${d} Part ${i + 1} check question must be descriptive`);
      assert.equal(check.options.length, 4, `Day ${d} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(typeof check.answer, 'number', `Day ${d} Part ${i + 1} answer must be number`);
      assert.equal(check.answer, 0, `Day ${d} Part ${i + 1} answer index must be 0`);
      assert.equal(check.answerIndex, 0, `Day ${d} Part ${i + 1} answerIndex must be 0`);
      assert.ok(check.why && check.why.length > 10, `Day ${d} Part ${i + 1} check must have why explanation`);
    }
  }
});

test('Block 131: B.Com Accounting Day 11: Depreciation (SLM vs WDV), Disposal & IAS 12 Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 11);
  assert.equal(lesson.day, 11);

  // Part 1: SLM vs WDV
  assert.match(lesson.parts[0].title, /SLM.*vs.*WDV/i);
  assert.ok(lesson.parts[0].code?.includes('generate_dual_depreciation_schedule'));
  assert.ok(lesson.parts[0].output?.includes('Original Asset Cost'));

  // Part 2: Provision for Depreciation
  assert.match(lesson.parts[1].title, /Provision for Depreciation/i);
  assert.ok(lesson.parts[1].code?.includes('model_provision_for_depreciation_ledger'));
  assert.ok(lesson.parts[1].output?.includes('Historical Asset Cost'));

  // Part 3: Asset Disposal Account
  assert.match(lesson.parts[2].title, /Asset Disposal Account/i);
  assert.ok(lesson.parts[2].code?.includes('process_asset_disposal_transaction'));
  assert.ok(lesson.parts[2].output?.includes('Disposal Case 1'));

  // Part 4: Component Depreciation IAS 16
  assert.match(lesson.parts[3].title, /Component Depreciation/i);
  assert.ok(lesson.parts[3].code?.includes('model_component_depreciation_and_useful_life_revision'));
  assert.ok(lesson.parts[3].output?.includes('Initial Combined Annual Depreciation'));

  // Part 5: Tax vs Book Depreciation IAS 12
  assert.match(lesson.parts[4].title, /Tax Depreciation vs Book Depreciation/i);
  assert.ok(lesson.parts[4].code?.includes('compute_tax_vs_book_depreciation_timing_difference'));
  assert.ok(lesson.parts[4].output?.includes('DTL'));
});

test('Block 131: B.Com Accounting Day 12: Trading Account & COGS Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 12);
  assert.equal(lesson.day, 12);

  // Part 1: COGS Equation
  assert.match(lesson.parts[0].title, /Trading Account Architecture/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_trading_account_and_gross_profit'));
  assert.ok(lesson.parts[0].output?.includes('Net Sales Turnover'));

  // Part 2: Direct vs Indirect Expenses
  assert.match(lesson.parts[1].title, /Direct Expenses vs Indirect Expenses/i);
  assert.ok(lesson.parts[1].code?.includes('classify_expenditure_direct_vs_indirect'));
  assert.ok(lesson.parts[1].output?.includes('Total Direct Expenses'));

  // Part 3: Inventory Valuation IAS 2
  assert.match(lesson.parts[2].title, /Closing Inventory Valuation/i);
  assert.ok(lesson.parts[2].code?.includes('evaluate_inventory_at_cost_or_nrv'));
  assert.ok(lesson.parts[2].output?.includes('Gross Inventory at Historical Cost'));

  // Part 4: Abnormal Casualty Losses
  assert.match(lesson.parts[3].title, /Inventory Shrinkage Dynamics/i);
  assert.ok(lesson.parts[3].code?.includes('account_for_inventory_shrinkage_and_losses'));
  assert.ok(lesson.parts[3].output?.includes('Normal Spoilage Impact'));

  // Part 5: Manufacturing Account
  assert.match(lesson.parts[4].title, /Manufacturing Account/i);
  assert.ok(lesson.parts[4].code?.includes('compile_manufacturing_and_trading_account'));
  assert.ok(lesson.parts[4].output?.includes('Raw Materials Consumed'));
});

test('Block 131: B.Com Accounting Day 13: Profit & Loss Statement Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 13);
  assert.equal(lesson.day, 13);

  // Part 1: Multi-Step P&L
  assert.match(lesson.parts[0].title, /Multi-Step Income Statement Architecture/i);
  assert.ok(lesson.parts[0].code?.includes('generate_multi_step_income_statement'));
  assert.ok(lesson.parts[0].output?.includes('Gross Profit Brought Down'));

  // Part 2: Accrual & Prepayment Adjustments
  assert.match(lesson.parts[1].title, /Period-End Adjustments Architecture/i);
  assert.ok(lesson.parts[1].code?.includes('process_accruals_and_prepayments_adjustments'));
  assert.ok(lesson.parts[1].output?.includes('Adjusted Nominal P&L Expenses'));

  // Part 3: 4-Tier Debtors Provisions
  assert.match(lesson.parts[2].title, /Comprehensive Debtors Provisions/i);
  assert.ok(lesson.parts[2].code?.includes('calculate_comprehensive_debtors_provisions'));
  assert.ok(lesson.parts[2].output?.includes('Gross Debtors per Trial Balance'));

  // Part 4: Operating Ratios
  assert.match(lesson.parts[3].title, /Corporate Operating Ratios/i);
  assert.ok(lesson.parts[3].code?.includes('analyze_operating_ratios_and_margins'));
  assert.ok(lesson.parts[3].output?.includes('Gross Profit Ratio'));

  // Part 5: P&L to Balance Sheet Equity Bridge
  assert.match(lesson.parts[4].title, /Balance Sheet Capital Integration/i);
  assert.ok(lesson.parts[4].code?.includes('execute_pnl_to_balance_sheet_equity_integration'));
  assert.ok(lesson.parts[4].output?.includes('Opening Capital'));
});

test('Block 131: B.Com Accounting Day 14: Balance Sheet Marshalling & Working Capital Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 14);
  assert.equal(lesson.day, 14);

  // Part 1: Permanence vs Liquidity
  assert.match(lesson.parts[0].title, /Balance Sheet Marshalling Architecture/i);
  assert.ok(lesson.parts[0].code?.includes('marshal_balance_sheet'));
  assert.ok(lesson.parts[0].output?.includes('Permanence Order Balance Sheet'));

  // Part 2: Net Working Capital & Liquidity Ratios
  assert.match(lesson.parts[1].title, /Working Capital.*Liquidity Ratios/i);
  assert.ok(lesson.parts[1].code?.includes('calculate_working_capital_and_liquidity_ratios'));
  assert.ok(lesson.parts[1].output?.includes('Current Assets'));

  // Part 3: IAS 1 / Schedule III Classifications
  assert.match(lesson.parts[2].title, /Non-Current vs Current Classification/i);
  assert.ok(lesson.parts[2].code?.includes('categorize_balance_sheet_subsystems'));
  assert.ok(lesson.parts[2].output?.includes('Balance Sheet Anatomy Totals'));

  // Part 4: Capital Structure & Proprietary Ratios
  assert.match(lesson.parts[3].title, /Capital Structure & Long-Term Solvency/i);
  assert.ok(lesson.parts[3].code?.includes('calculate_capital_structure_and_solvency'));
  assert.ok(lesson.parts[3].output?.includes('Debt-to-Equity Ratio'));

  // Part 5: Trial Balance to Balance Sheet Mapping Pipeline
  assert.match(lesson.parts[4].title, /Trial Balance to Balance Sheet Mapping Pipeline/i);
  assert.ok(lesson.parts[4].code?.includes('verify_complete_trial_balance_to_balance_sheet_mapping'));
  assert.ok(lesson.parts[4].output?.includes('Total Adjusted Debits'));
});

test('Block 131: B.Com Accounting Day 15 Capstone: Year-End Closing Engine & Accreditation Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 15);
  assert.equal(lesson.day, 15);
  assert.equal(lesson.minutes, 50);

  // Part 1: Period-End Adjusting Journal Entries
  assert.match(lesson.parts[0].title, /Adjusting Journal Entries/i);
  assert.ok(lesson.parts[0].code?.includes('AdjustingEntry'));
  assert.ok(lesson.parts[0].output?.includes('Total Adjustment Debits'));

  // Part 2: Integrated Trading and P&L
  assert.match(lesson.parts[1].title, /Integrated Trading and Profit & Loss/i);
  assert.ok(lesson.parts[1].code?.includes('IncomeStatement'));
  assert.ok(lesson.parts[1].output?.includes('GROSS PROFIT CARRIED DOWN'));
  assert.ok(lesson.parts[1].output?.includes('NET PROFIT FOR THE YEAR'));

  // Part 3: Final Marshalled Balance Sheet
  assert.match(lesson.parts[2].title, /Final Marshalled Balance Sheet/i);
  assert.ok(lesson.parts[2].code?.includes('BalanceSheet'));
  assert.ok(lesson.parts[2].output?.includes('EQUATION EQUILIBRIUM VERIFIED : True'));

  // Part 4: Post-Closing Trial Balance
  assert.match(lesson.parts[3].title, /Post-Closing Trial Balance/i);
  assert.ok(lesson.parts[3].code?.includes('POST-CLOSING TRIAL BALANCE'));
  assert.ok(lesson.parts[3].output?.includes('Post-Closing Equilibrium Verified: True'));

  // Part 5: Financial Statement Dashboard & Controller Accreditation
  assert.match(lesson.parts[4].title, /Controller Accreditation/i);
  assert.ok(lesson.parts[4].code?.includes('FinancialDashboard'));
  assert.ok(lesson.parts[4].output?.includes('ACCREDITATION STATUS: MILESTONE 3 CAPSTONE COMPLETED SUCCESSFULLY'));
  assert.ok(lesson.parts[4].output?.includes('AUDIT OPINION       : UNQUALIFIED'));
});

test('Block 131: B.Com Accounting Days 11-15 Gate v2 Visual JSON Integrity Verification', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let d = 11; d <= 15; d++) {
    const pad = String(d).padStart(2, '0');
    const visPath = path.join(__dirname, `../src/lib/data/lessonVisuals/bcom-accounting/day-${pad}.json`);
    assert.ok(fs.existsSync(visPath), `Visual JSON must exist for Day ${d}`);

    const vis = JSON.parse(fs.readFileSync(visPath, 'utf8'));
    assert.equal(vis.prefix, 'bcom-accounting');
    assert.equal(vis.day, d);
    assert.equal(vis.entries.length, 5, `Day ${d} visual must contain exactly 5 entries`);

    const lesson = getLongLesson('bcom-accounting', d);
    for (let i = 0; i < 5; i++) {
      const entry = vis.entries[i];
      const part = lesson.parts[i];

      assert.equal(entry.spec.template, 'ledger-sheet', `Day ${d} Part ${i + 1} must use ledger-sheet template`);
      assert.ok(entry.spec.steps.length >= 3, `Day ${d} Part ${i + 1} visual must have >= 3 steps`);

      // Verify SHA-256 binding between code and visual entry
      const expectedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(entry.codeHash, expectedHash, `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
    }
  }
});


test('Block 132: B.Com Accounting Days 16-20: Resolution & Structure Invariants', () => {
  for (let d = 16; d <= 20; d++) {
    const lesson = getLongLesson('bcom-accounting', d);
    assert.ok(lesson, `bcom-accounting Day ${d} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom-accounting');
    assert.equal(lesson.day, d);
    assert.equal(lesson.parts.length, 5, `bcom-accounting Day ${d} must have exactly 5 parts`);
    assert.equal(getLongLessonLanguage('bcom-accounting'), 'python');

    const expectedMin = d === 20 ? 50 : 45;
    assert.equal(lesson.minutes, expectedMin, `Day ${d} minutes must be ${expectedMin}`);

    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 8, `Day ${d} spoken minutes (${spoken}) must be at least 8`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 15, `Day ${d} total lesson minutes (${total}) must be at least 15`);

    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${d} summary must have >= 4 bullets`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, `Day ${d} projectStep must have title and >= 4 steps`);

    for (let i = 0; i < lesson.parts.length; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${d} Part ${i + 1} must have a title`);

      const words = part.say.join(' ').split(/\s+/).length;
      assert.ok(words >= 580, `Day ${d} Part ${i + 1} word count (${words}) must be >= 580`);

      assert.ok(part.example && part.example.length > 0, `Day ${d} Part ${i + 1} must have an example`);
      assert.ok(part.code && part.code.trim().length > 0, `Day ${d} Part ${i + 1} code must not be empty`);
      assert.ok(part.output && part.output.trim().length > 0, `Day ${d} Part ${i + 1} must have expected output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${d} Part ${i + 1} must have tryIt instructions`);

      // Socratic Check Invariants
      const check = part.check as any;
      assert.ok(check.question.length > 10, `Day ${d} Part ${i + 1} check question must be descriptive`);
      assert.equal(check.options.length, 4, `Day ${d} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(typeof check.answer, 'number', `Day ${d} Part ${i + 1} answer must be number`);
      assert.equal(check.answer, 0, `Day ${d} Part ${i + 1} answer index must be 0`);
      assert.equal(check.answerIndex, 0, `Day ${d} Part ${i + 1} answerIndex must be 0`);
      assert.ok(check.why && check.why.length > 10, `Day ${d} Part ${i + 1} check must have why explanation`);
    }
  }
});

test('Block 132: B.Com Accounting Day 16: Tally Prime ERP Masters & Groups Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 16);
  assert.equal(lesson.day, 16);

  // Part 1: Company Master Creation
  assert.match(lesson.parts[0].title, /Company Master Creation/i);
  assert.ok(lesson.parts[0].code?.includes('TallyCompanyMaster'));
  assert.ok(lesson.parts[0].output?.includes('ACTIVE & INITIALIZED'));

  // Part 2: 28 Pre-Defined Groups
  assert.match(lesson.parts[1].title, /28 Pre-Defined Groups/i);
  assert.ok(lesson.parts[1].code?.includes('TallyGroupHierarchy'));
  assert.ok(lesson.parts[1].output?.includes('Total System Groups    : 28'));

  // Part 3: Ledger Master Creation & Group Mapping
  assert.match(lesson.parts[2].title, /Ledger Master Creation/i);
  assert.ok(lesson.parts[2].code?.includes('LedgerRegistry'));
  assert.ok(lesson.parts[2].output?.includes('PERFECTLY BALANCED (₹0.00 Diff)'));

  // Part 4: Cost Center & Cost Category
  assert.match(lesson.parts[3].title, /Cost Center & Cost Category/i);
  assert.ok(lesson.parts[3].code?.includes('CostAllocationEngine'));
  assert.ok(lesson.parts[3].output?.includes('Allocation Audit Status: PASSED'));

  // Part 5: Chart of Accounts Extraction & Audit
  assert.match(lesson.parts[4].title, /Chart of Accounts Extraction/i);
  assert.ok(lesson.parts[4].code?.includes('TallyChartOfAccountsAuditor'));
  assert.ok(lesson.parts[4].output?.includes('CHART OF ACCOUNTS STRUCTURE COMPLIANT'));
});

test('Block 132: B.Com Accounting Day 17: Tally Prime Vouchers & Daybook Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 17);
  assert.equal(lesson.day, 17);

  // Part 1: Voucher Keybindings F4-F9
  assert.match(lesson.parts[0].title, /Accounting Voucher Keybindings/i);
  assert.ok(lesson.parts[0].code?.includes('VoucherProcessingEngine'));
  assert.ok(lesson.parts[0].output?.includes('APPROVED_AND_POSTED'));

  // Part 2: Item Invoice Mode
  assert.match(lesson.parts[1].title, /Voucher Entry Modes/i);
  assert.ok(lesson.parts[1].code?.includes('ItemInvoiceProcessor'));
  assert.ok(lesson.parts[1].output?.includes('INVOICE GRAND TOTAL (INCL. TAXES)'));

  // Part 3: Bill-Wise Details & AR Aging
  assert.match(lesson.parts[2].title, /Bill-Wise Details/i);
  assert.ok(lesson.parts[2].code?.includes('BillWiseManager'));
  assert.ok(lesson.parts[2].output?.includes('TOTAL OUTSTANDING BALANCE'));

  // Part 4: Post-Dated Vouchers
  assert.match(lesson.parts[3].title, /Post-Dated.*Optional/i);
  assert.ok(lesson.parts[3].code?.includes('ProvisionalVoucherManager'));
  assert.ok(lesson.parts[3].output?.includes('Dormant Post-Dated Pipeline'));

  // Part 5: Daybook Extraction
  assert.match(lesson.parts[4].title, /General Ledger Posting.*Daybook/i);
  assert.ok(lesson.parts[4].code?.includes('TallyDaybookEngine'));
  assert.ok(lesson.parts[4].output?.includes('TALLY PRIME DAILY DAYBOOK REPORT'));
});

test('Block 132: B.Com Accounting Day 18: Dual GST Model & Tax Invoices Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 18);
  assert.equal(lesson.day, 18);

  // Part 1: Dual GST Architecture
  assert.match(lesson.parts[0].title, /Constitutional Framework.*Dual GST/i);
  assert.ok(lesson.parts[0].code?.includes('DualGstEngine'));
  assert.ok(lesson.parts[0].output?.includes('INTRA-STATE SUPPLY'));
  assert.ok(lesson.parts[0].output?.includes('INTER-STATE SUPPLY'));

  // Part 2: Place of Supply Rules
  assert.match(lesson.parts[1].title, /Place of Supply/i);
  assert.ok(lesson.parts[1].code?.includes('PlaceOfSupplyResolver'));
  assert.ok(lesson.parts[1].output?.includes('Bill-to Ship-to Computer Equipment'));

  // Part 3: HSN/SAC Classifications
  assert.match(lesson.parts[2].title, /HSN\/SAC Classifications/i);
  assert.ok(lesson.parts[2].code?.includes('GSTTariffEngine'));
  assert.ok(lesson.parts[2].output?.includes('GRAND TAX INVOICE AMOUNT'));

  // Part 4: Rule 46 Tax Invoice & Rule 48(4) e-Invoicing
  assert.match(lesson.parts[3].title, /Statutory Tax Invoice.*e-Invoicing/i);
  assert.ok(lesson.parts[3].code?.includes('StatutoryInvoiceValidator'));
  assert.ok(lesson.parts[3].output?.includes('e-Invoice IRN (SHA256)'));

  // Part 5: General Ledger Tax Accounting
  assert.match(lesson.parts[4].title, /General Ledger Tax Accounting/i);
  assert.ok(lesson.parts[4].code?.includes('GeneralLedgerTaxPipeline'));
  assert.ok(lesson.parts[4].output?.includes('Ledger Equilibrium Verified : True'));
});

test('Block 132: B.Com Accounting Day 19: GST ITC & Cross-Utilization Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 19);
  assert.equal(lesson.day, 19);

  // Part 1: Section 16 Eligibility
  assert.match(lesson.parts[0].title, /Section 16.*Eligibility/i);
  assert.ok(lesson.parts[0].code?.includes('Section16Validator'));
  assert.ok(lesson.parts[0].output?.includes('Status: ELIGIBLE'));
  assert.ok(lesson.parts[0].output?.includes('Status: DISALLOWED'));

  // Part 2: Section 17(5) Blocked Credits
  assert.match(lesson.parts[1].title, /Blocked Credits.*Section 17\(5\)/i);
  assert.ok(lesson.parts[1].code?.includes('BlockedCreditClassifier'));
  assert.ok(lesson.parts[1].output?.includes('Total Blocked ITC'));

  // Part 3: Section 49 Cross-Utilization
  assert.match(lesson.parts[2].title, /Cross-Utilization Set-Off Hierarchy/i);
  assert.ok(lesson.parts[2].code?.includes('GstSetOffOptimizer'));
  assert.ok(lesson.parts[2].output?.includes('STATUTORY GST ITC OPTIMAL SET-OFF SCHEDULE'));

  // Part 4: Rule 43 Capital Goods 60-Month Apportionment
  assert.match(lesson.parts[3].title, /Capital Goods ITC Apportionment.*60-Month/i);
  assert.ok(lesson.parts[3].code?.includes('Rule43CapitalGoodsApportioner'));
  assert.ok(lesson.parts[3].output?.includes('RULE 43 COMMON ITC MONTHLY REVERSAL AUDITED'));

  // Part 5: Electronic Ledger Balancing
  assert.match(lesson.parts[4].title, /Electronic Ledger Balancing/i);
  assert.ok(lesson.parts[4].code?.includes('GstTreasuryClearanceEngine'));
  assert.ok(lesson.parts[4].output?.includes('MONTHLY GST TREASURY CLEARANCE & CHALLAN REPORT'));
});

test('Block 132: B.Com Accounting Day 20 Capstone: GST Returns & Accreditation Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 20);
  assert.equal(lesson.day, 20);
  assert.equal(lesson.minutes, 50);

  // Part 1: GSTR-1 Outward Return
  assert.match(lesson.parts[0].title, /GSTR-1 Outward Supplies/i);
  assert.ok(lesson.parts[0].code?.includes('Gstr1AggregationEngine'));
  assert.ok(lesson.parts[0].output?.includes('GSTR-1 STATUTORY OUTWARD RETURN SUMMARY'));

  // Part 2: GSTR-2B Static Auto-Drafted Statement
  assert.match(lesson.parts[1].title, /GSTR-2B Auto-Drafted Statement/i);
  assert.ok(lesson.parts[1].code?.includes('Gstr2bProcessingEngine'));
  assert.ok(lesson.parts[1].output?.includes('GSTR-2B STATIC AUTO-DRAFTED ITC STATEMENT'));

  // Part 3: Purchase Register vs GSTR-2B Auto Reconciliation
  assert.match(lesson.parts[2].title, /Purchase Register vs GSTR-2B Automated 3-Way Reconciliation/i);
  assert.ok(lesson.parts[2].code?.includes('Gstr2bReconciler'));
  assert.ok(lesson.parts[2].output?.includes('PURCHASE REGISTER vs GSTR-2B AUTOMATED RECONCILIATION'));

  // Part 4: Form GSTR-3B Monthly Summary & Net Tax Settlement
  assert.match(lesson.parts[3].title, /Form GSTR-3B Monthly Summary/i);
  assert.ok(lesson.parts[3].code?.includes('Gstr3bSettlementEngine'));
  assert.ok(lesson.parts[3].output?.includes('FORM GSTR-3B STATUTORY SETTLEMENT SUMMARY'));

  // Part 5: Controller Accreditation Dashboard
  assert.match(lesson.parts[4].title, /Financial Controller GST Compliance Audit/i);
  assert.ok(lesson.parts[4].code?.includes('GstControllerComplianceDashboard'));
  assert.ok(lesson.parts[4].output?.includes('ACCREDITATION STATUS: MILESTONE 4 CAPSTONE COMPLETED SUCCESSFULLY'));
  assert.ok(lesson.parts[4].output?.includes('STATUTORY VERDICT   : CERTIFIED CORPORATE GST & ERP CONTROLLER'));
});

test('Block 132: B.Com Accounting Days 16-20 Gate v2 Visual JSON Integrity Verification', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let d = 16; d <= 20; d++) {
    const pad = String(d).padStart(2, '0');
    const visPath = path.join(__dirname, `../src/lib/data/lessonVisuals/bcom-accounting/day-${pad}.json`);
    assert.ok(fs.existsSync(visPath), `Visual JSON must exist for Day ${d}`);

    const vis = JSON.parse(fs.readFileSync(visPath, 'utf8'));
    assert.equal(vis.prefix, 'bcom-accounting');
    assert.equal(vis.day, d);
    assert.equal(vis.entries.length, 5, `Day ${d} visual must contain exactly 5 entries`);

    const lesson = getLongLesson('bcom-accounting', d);
    for (let i = 0; i < 5; i++) {
      const entry = vis.entries[i];
      const part = lesson.parts[i];

      assert.equal(entry.spec.template, 'ledger-sheet', `Day ${d} Part ${i + 1} must use ledger-sheet template`);
      assert.ok(entry.spec.steps.length >= 3, `Day ${d} Part ${i + 1} visual must have >= 3 steps`);

      // Verify SHA-256 binding between code and visual entry
      const expectedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(entry.codeHash, expectedHash, `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
    }
  }
});

// ============================================================================
// BLOCK 5 (DAYS 21-25: TASK-1374..1378) - DIRECT TAXATION, PAYROLL & SEC 115BAC
// ============================================================================

test('Block 133: B.Com Accounting Days 21-25: Resolution & Structure Invariants', () => {
  for (let d = 21; d <= 25; d++) {
    const lesson = getLongLesson('bcom-accounting', d);
    assert.ok(lesson, `bcom-accounting Day ${d} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom-accounting');
    assert.equal(lesson.day, d);
    assert.equal(lesson.parts.length, 5, `bcom-accounting Day ${d} must have exactly 5 parts`);
    assert.equal(getLongLessonLanguage('bcom-accounting'), 'python');

    const expectedMin = d === 25 ? 50 : 45;
    assert.equal(lesson.minutes, expectedMin, `Day ${d} minutes must be ${expectedMin}`);

    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 8, `Day ${d} spoken minutes (${spoken}) must be at least 8`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 15, `Day ${d} total lesson minutes (${total}) must be at least 15`);

    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${d} summary must have >= 4 bullets`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, `Day ${d} projectStep must have title and >= 4 steps`);

    for (let i = 0; i < lesson.parts.length; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${d} Part ${i + 1} must have a title`);

      const words = part.say.join(' ').split(/\s+/).length;
      assert.ok(words >= 580, `Day ${d} Part ${i + 1} word count (${words}) must be >= 580`);

      assert.ok(part.example && part.example.length > 0, `Day ${d} Part ${i + 1} must have an example`);
      assert.ok(part.code && part.code.includes('def '), `Day ${d} Part ${i + 1} code must contain Python functions`);
      assert.ok(part.output && part.output.length > 0, `Day ${d} Part ${i + 1} must have expected output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${d} Part ${i + 1} must have tryIt instructions`);

      // Socratic Check Invariants
      const check = part.check as any;
      assert.ok(check.question.length > 10, `Day ${d} Part ${i + 1} check question must be descriptive`);
      assert.equal(check.options.length, 4, `Day ${d} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(typeof check.answer, 'number', `Day ${d} Part ${i + 1} answer must be number`);
      assert.equal(check.answer, 0, `Day ${d} Part ${i + 1} answer index must be 0`);
      assert.ok(check.why && check.why.length > 15, `Day ${d} Part ${i + 1} why explanation must be rigorous`);
      assert.equal(check.answerIndex, 0);
      assert.equal(check.explanation, check.why);
    }
  }
});

test('Block 133: B.Com Accounting Day 21: Tally Prime Enterprise & GST Engine Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 21);
  assert.equal(lesson.day, 21);

  // Part 1: ERP Setup & GST Master Sync
  assert.match(lesson.parts[0].title, /ERP Setup & GST Master Synchronization/i);
  assert.ok(lesson.parts[0].code?.includes('EnterpriseMasterSyncEngine'));
  assert.ok(lesson.parts[0].output?.includes('MASTER SYNCHRONIZATION STATUS: 100% VERIFIED'));

  // Part 2: Automated Multi-Item Invoice Generation & GL Posting
  assert.match(lesson.parts[1].title, /Automated Multi-Item Invoice Generation/i);
  assert.ok(lesson.parts[1].code?.includes('EnterpriseInvoicingPipeline'));
  assert.ok(lesson.parts[1].output?.includes('ENTERPRISE MULTI-ITEM INVOICE & GL POSTING SUMMARY'));

  // Part 3: Automated Purchase Ingestion, Rule 36(4) Matching & ITC Lock
  assert.match(lesson.parts[2].title, /Rule 36\(4\) Matching & ITC Lock/i);
  assert.ok(lesson.parts[2].code?.includes('AutomatedItcReconciliationPipeline'));
  assert.ok(lesson.parts[2].output?.includes('AUTOMATED PURCHASE INGESTION & RULE 36(4) ITC LOCK AUDIT'));

  // Part 4: Dynamic Section 49 Tax Set-Off & Cash Ledger Optimization
  assert.match(lesson.parts[3].title, /Dynamic Section 49 Tax Set-Off/i);
  assert.ok(lesson.parts[3].code?.includes('EnterpriseGstOptimizer'));
  assert.ok(lesson.parts[3].output?.includes('ENTERPRISE DYNAMIC SECTION 49 CLEARANCE OPTIMIZATION'));

  // Part 5: Complete ERP to Return Pipeline & Controller Audit Dossier
  assert.match(lesson.parts[4].title, /Complete ERP to Statutory Tax Return Pipeline/i);
  assert.ok(lesson.parts[4].code?.includes('EnterpriseTaxAuditDossier'));
  assert.ok(lesson.parts[4].output?.includes('ENTERPRISE TALLY PRIME & GST STATUTORY AUDIT DOSSIER'));
});

test('Block 133: B.Com Accounting Day 22: RCM & E-Way Bill Logistics Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 22);
  assert.equal(lesson.day, 22);

  // Part 1: Reverse Charge Mechanism (RCM) Statutory Framework
  assert.match(lesson.parts[0].title, /Reverse Charge Mechanism \(RCM\) Statutory Framework/i);
  assert.ok(lesson.parts[0].code?.includes('ReverseChargeEngine'));
  assert.ok(lesson.parts[0].output?.includes('REVERSE CHARGE MECHANISM (RCM) AUDIT LOG'));

  // Part 2: RCM Accounting Entries & Self-Invoicing Architecture
  assert.match(lesson.parts[1].title, /RCM Accounting Entries & Self-Invoicing Architecture/i);
  assert.ok(lesson.parts[1].code?.includes('RcmLedgerPostingPipeline'));
  assert.ok(lesson.parts[1].output?.includes('RCM SELF-INVOICING (SEC 31(3)(f)) & GL POSTING AUDIT'));

  // Part 3: Electronic Way Bill Statutory Thresholds & Part-A/Part-B
  assert.match(lesson.parts[2].title, /Electronic Way Bill Statutory Thresholds & Part-A\/Part-B/i);
  assert.ok(lesson.parts[2].code?.includes('EWayBillEngine'));
  assert.ok(lesson.parts[2].output?.includes('E-Way Bill GENERATION & VALIDITY AUDIT'));

  // Part 4: E-Way Bill Validity Calculation & Transit Protocols
  assert.match(lesson.parts[3].title, /E-Way Bill Validity Calculation & Transit Protocols/i);
  assert.ok(lesson.parts[3].code?.includes('def '));
  assert.ok(lesson.parts[3].output?.length > 0);

  // Part 5: Logistics Compliance & Highway Inspection Audit Simulation
  assert.match(lesson.parts[4].title, /Logistics Compliance & Highway Inspection Audit Simulation/i);
  assert.ok(lesson.parts[4].code?.includes('def '));
  assert.ok(lesson.parts[4].output?.length > 0);
});

test('Block 133: B.Com Accounting Day 23: Corporate Payroll, EPF & ESI Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 23);
  assert.equal(lesson.day, 23);

  // Part 1: Salary Structure Components: Earnings, Allowances & CTC Decomposition
  assert.match(lesson.parts[0].title, /Salary Structure Components.*CTC Decomposition/i);
  assert.ok(lesson.parts[0].code?.includes('PayrollStructureEngine'));
  assert.ok(lesson.parts[0].output?.includes('ENTERPRISE PAYROLL CTC STRUCTURE DECOMPOSITION'));

  // Part 2: Employees' Provident Fund (EPF) Statutory Mechanics & EDLI
  assert.match(lesson.parts[1].title, /Employees' Provident Fund \(EPF\) Statutory Mechanics & EDLI/i);
  assert.ok(lesson.parts[1].code?.includes('EpfStatutoryEngine'));
  assert.ok(lesson.parts[1].output?.includes('EPF STATUTORY CONTRIBUTION SCHEDULE (1952 ACT)'));

  // Part 3: Employees' State Insurance (ESI) & State Professional Tax
  assert.match(lesson.parts[2].title, /Employees' State Insurance \(ESI\) & State Professional Tax/i);
  assert.ok(lesson.parts[2].code?.includes('EsiAndPtEngine'));
  assert.ok(lesson.parts[2].output?.includes('ESI & PROFESSIONAL TAX STATUTORY AUDIT'));

  // Part 4: Net Pay Calculation, Pay Slip Generation & TDS Integration
  assert.match(lesson.parts[3].title, /Net Pay Calculation, Pay Slip Generation & TDS Integration/i);
  assert.ok(lesson.parts[3].code?.includes('def '));
  assert.ok(lesson.parts[3].output?.length > 0);

  // Part 5: Enterprise Payroll Journal Posting & Statutory Remittance Accounting
  assert.match(lesson.parts[4].title, /Enterprise Payroll Journal Posting & Statutory Remittance Accounting/i);
  assert.ok(lesson.parts[4].code?.includes('def '));
  assert.ok(lesson.parts[4].output?.length > 0);
});

test('Block 133: B.Com Accounting Day 24: TDS Withholding & Form 26Q Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 24);
  assert.equal(lesson.day, 24);

  // Part 1: TDS Statutory Machinery & TAN/PAN Validation
  assert.match(lesson.parts[0].title, /TDS Statutory Machinery & TAN\/PAN Validation/i);
  assert.ok(lesson.parts[0].code?.includes('TdsMasterValidator'));
  assert.ok(lesson.parts[0].output?.includes('TDS STATUTORY DEDUCTOR MASTER AUDIT'));

  // Part 2: Core Withholding Sections: 194C, 194J, 194I Thresholds
  assert.match(lesson.parts[1].title, /Core Withholding Sections: 194C, 194J, 194I Thresholds/i);
  assert.ok(lesson.parts[1].code?.includes('B2BTdsWithholdingClassifier'));
  assert.ok(lesson.parts[1].output?.includes('B2B TDS STATUTORY WITHHOLDING AUDIT'));

  // Part 3: Section 206AA Penal Provisions & Non-PAN Higher Withholding
  assert.match(lesson.parts[2].title, /Section 206AA Penal Provisions & Non-PAN Higher Withholding/i);
  assert.ok(lesson.parts[2].code?.includes('Section206AAEnforcementEngine'));
  assert.ok(lesson.parts[2].output?.includes('SECTION 206AA PENAL NON-PAN WITHHOLDING AUDIT'));

  // Part 4: Quarterly Form 26Q Compilation, Challan 281 & Sec 201(1A) Interest
  assert.match(lesson.parts[3].title, /Quarterly Form 26Q Compilation/i);
  assert.ok(lesson.parts[3].code?.includes('def '));
  assert.ok(lesson.parts[3].output?.length > 0);

  // Part 5: Form 26AS / AIS Cross-Reconciliation & Controller Withholding Audit
  assert.match(lesson.parts[4].title, /Form 26AS \/ AIS Cross-Reconciliation/i);
  assert.ok(lesson.parts[4].code?.includes('def '));
  assert.ok(lesson.parts[4].output?.length > 0);
});

test('Block 133: B.Com Accounting Day 25 Capstone: Direct Income Tax & Section 115BAC Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 25);
  assert.equal(lesson.day, 25);
  assert.equal(lesson.minutes, 50);

  // Part 1: Section 115BAC New Concessional Tax Regime Architecture
  assert.match(lesson.parts[0].title, /Section 115BAC New Concessional Tax Regime Architecture/i);
  assert.ok(lesson.parts[0].code?.includes('Section115BACEngine'));
  assert.ok(lesson.parts[0].output?.includes('SECTION 115BAC NEW TAX REGIME COMPUTATION AUDIT'));

  // Part 2: Old Tax Regime Architecture: Chapter VI-A Deductions & Section 24(b)
  assert.match(lesson.parts[1].title, /Old Tax Regime Architecture: Chapter VI-A Deductions/i);
  assert.ok(lesson.parts[1].code?.includes('OldRegimeEngine'));
  assert.ok(lesson.parts[1].output?.includes('OLD TAX REGIME WITH CHAPTER VI-A DEDUCTIONS AUDIT'));

  // Part 3: Algorithmic Regime Comparison & Breakeven Indifference Point
  assert.match(lesson.parts[2].title, /Algorithmic Regime Comparison & Breakeven Indifference Point/i);
  assert.ok(lesson.parts[2].code?.includes('TaxRegimeComparator'));
  assert.ok(lesson.parts[2].output?.includes('DIRECT TAX DUAL REGIME COMPARATIVE OPTIMIZATION'));

  // Part 4: Section 192 Monthly Salary Withholding Schedule & Form 16
  assert.match(lesson.parts[3].title, /Section 192 Monthly Salary Withholding Schedule & Form 16/i);
  assert.ok(lesson.parts[3].code?.includes('Section192WithholdingEngine'));
  assert.ok(lesson.parts[3].output?.includes('SECTION 192 SALARY TDS WITHHOLDING & FORM 16 AUDIT'));

  // Part 5: Financial Controller Direct Tax Compliance Dashboard & Accreditation
  assert.match(lesson.parts[4].title, /Financial Controller Direct Tax Compliance Dashboard & Accreditation/i);
  assert.ok(lesson.parts[4].code?.includes('CorporateDirectTaxDashboard'));
  assert.ok(lesson.parts[4].output?.includes('EXECUTIVE CORPORATE DIRECT TAX CONTROL TOWER'));
  assert.ok(lesson.parts[4].output?.includes('ACCREDITATION STATUS: MILESTONE 5 CAPSTONE COMPLETED SUCCESSFULLY'));
  assert.ok(lesson.parts[4].output?.includes('STATUTORY VERDICT   : CERTIFIED CORPORATE CONTROLLER - DIRECT TAXATION'));
});

test('Block 133: B.Com Accounting Days 21-25 Gate v2 Visual JSON Integrity Verification', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let d = 21; d <= 25; d++) {
    const pad = String(d).padStart(2, '0');
    const visPath = path.join(__dirname, `../src/lib/data/lessonVisuals/bcom-accounting/day-${pad}.json`);
    assert.ok(fs.existsSync(visPath), `Visual JSON must exist for Day ${d}`);

    const vis = JSON.parse(fs.readFileSync(visPath, 'utf8'));
    assert.equal(vis.prefix, 'bcom-accounting');
    assert.equal(vis.day, d);
    assert.equal(vis.entries.length, 5, `Day ${d} visual must contain exactly 5 entries`);

    const lesson = getLongLesson('bcom-accounting', d);
    for (let i = 0; i < 5; i++) {
      const entry = vis.entries[i];
      const part = lesson.parts[i];

      assert.equal(entry.spec.template, 'ledger-sheet', `Day ${d} Part ${i + 1} must use ledger-sheet template`);
      assert.ok(entry.spec.steps.length >= 3, `Day ${d} Part ${i + 1} visual must have >= 3 steps`);

      // Verify SHA-256 binding between code and visual entry
      const expectedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(entry.codeHash, expectedHash, `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
    }
  }
});

// ============================================================================
// BLOCK 134: B.Com Accounting Days 26 to 30 (TASK-1379..1383)
// Milestone 6: Advanced Corporate Tax Audit, Financial Diagnostics & Grand Master Capstone Suite
// COURSE 22 100% COMPLETE (30/30 DAYS)
// ============================================================================

test('Block 134: B.Com Accounting Days 26-30 Structural & Invariant Verification', () => {
  assert.equal(BCOM_ACCOUNTING_LONG_LESSONS.length, 30, 'Course 22 must contain all 30 days');

  for (let d = 26; d <= 30; d++) {
    const lesson = getLongLesson('bcom-accounting', d);
    assert.ok(lesson, `bcom-accounting Day ${d} must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom-accounting');
    assert.equal(lesson.day, d);
    assert.equal(lesson.parts.length, 5, `Day ${d} must have exactly 5 parts`);

    const expectedMinutes = d === 30 ? 50 : 45;
    assert.equal(lesson.minutes, expectedMinutes, `Day ${d} minutes must be ${expectedMinutes}`);

    let totalWords = 0;
    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title && part.title.length > 0, `Day ${d} Part ${i + 1} title missing`);
      const words = part.say.reduce((acc: number, s: string) => acc + s.trim().split(/\s+/).length, 0);
      totalWords += words;
      assert.ok(words >= 580, `Day ${d} Part ${i + 1} must have >= 580 words, got ${words}`);

      assert.ok(part.example && part.example.length > 0, `Day ${d} Part ${i + 1} example missing`);
      assert.ok(part.code && part.code.length > 0, `Day ${d} Part ${i + 1} code missing`);
      assert.ok(part.output && part.output.length > 0, `Day ${d} Part ${i + 1} output missing`);

      const chk = part.check as any;
      assert.ok(chk && chk.question && chk.question.length > 10, `Day ${d} Part ${i + 1} check question missing`);
      assert.equal(chk.options.length, 4, `Day ${d} Part ${i + 1} check must have 4 options`);
      assert.equal(chk.answerIndex, 0, `Day ${d} Part ${i + 1} answerIndex must be 0`);
      assert.equal(chk.answer, 0, `Day ${d} Part ${i + 1} answer must be 0`);
      assert.ok(chk.explanation && chk.explanation.length > 10, `Day ${d} Part ${i + 1} explanation missing`);
    }

    assert.ok(totalWords >= 2950, `Day ${d} total words (${totalWords}) must be >= 2950`);
    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${d} summary must have >= 4 items`);
    assert.ok(lesson.projectStep && lesson.projectStep.steps && lesson.projectStep.steps.length >= 4, `Day ${d} projectStep must have >= 4 steps`);
  }
});

test('Block 134: B.Com Accounting Day 26: Capital Gains & Corporate Tax (Sec 115BAA)', () => {
  const lesson = getLongLesson('bcom-accounting', 26);
  assert.equal(lesson.day, 26);
  assert.match(lesson.title, /Capital Gains Taxation & Corporate Income Tax/i);

  // Part 1: Capital Asset Classification
  assert.match(lesson.parts[0].title, /Capital Asset Classification/i);
  assert.ok(lesson.parts[0].code?.includes('CapitalGainClassificationEngine'));

  // Part 2: Section 112A & 111A
  assert.match(lesson.parts[1].title, /Section 112A LTCG.*Section 111A STCG/i);
  assert.ok(lesson.parts[1].code?.includes('EquityCapitalGainsTaxEngine'));

  // Part 3: Section 115BAA
  assert.match(lesson.parts[2].title, /Corporate Income Tax under Section 115BAA/i);
  assert.ok(lesson.parts[2].code?.includes('Section115BAACorporateTaxEngine'));

  // Part 4: Advance Tax & 234B/234C
  assert.match(lesson.parts[3].title, /Advance Tax Schedules & Section 234B\/234C/i);
  assert.ok(lesson.parts[3].code?.includes('AdvanceTaxComplianceEngine'));

  // Part 5: Corporate Tax Dossier & ITR-6
  assert.match(lesson.parts[4].title, /Corporate Tax Audit Dossier & Form ITR-6/i);
  assert.ok(lesson.parts[4].code?.includes('CorporateTaxAuditDossier'));
  assert.ok(lesson.parts[2].output?.includes('SECTION 115BAA CORPORATE INCOME TAX COMPUTATION AUDIT'));
});

test('Block 134: B.Com Accounting Day 27: Financial Statement Diagnostics & Ratio Analysis', () => {
  const lesson = getLongLesson('bcom-accounting', 27);
  assert.equal(lesson.day, 27);
  assert.match(lesson.title, /Financial Statement Analysis.*Ratios/i);

  // Part 1: Liquidity Ratio Diagnostics
  assert.match(lesson.parts[0].title, /Liquidity Ratio Diagnostics.*Current Ratio.*Acid-Test/i);
  assert.ok(lesson.parts[0].code?.includes('LiquidityDiagnosticsEngine'));

  // Part 2: Solvency & Leverage Ratios
  assert.match(lesson.parts[1].title, /Solvency & Leverage Ratios.*Debt-to-Equity/i);
  assert.ok(lesson.parts[1].code?.includes('SolvencyLeverageEngine'));

  // Part 3: Profitability Ratios & DuPont ROE
  assert.match(lesson.parts[2].title, /Profitability Ratios & DuPont Return on Equity/i);
  assert.ok(lesson.parts[2].code?.includes('DuPontProfitabilityEngine'));

  // Part 4: Activity & Turnover Ratios
  assert.match(lesson.parts[3].title, /Activity & Turnover Ratios.*Inventory Velocity/i);
  assert.ok(lesson.parts[3].code?.includes('ActivityVelocityEngine'));

  // Part 5: Comprehensive Health Dashboard
  assert.match(lesson.parts[4].title, /Comprehensive Corporate Financial Health Diagnostic Dashboard/i);
  assert.ok(lesson.parts[4].code?.includes('FinancialHealthDashboard'));
  assert.ok(lesson.parts[2].output?.includes('3-STAGE DUPONT RETURN ON EQUITY (ROE) DECOMPOSITION AUDIT'));
});

test('Block 134: B.Com Accounting Day 28: AS-3 Cash Flow Statement Engineering', () => {
  const lesson = getLongLesson('bcom-accounting', 28);
  assert.equal(lesson.day, 28);
  assert.match(lesson.title, /Cash Flow Statement \(AS-3\)/i);

  // Part 1: AS-3 / Ind AS 7 Statutory Architecture
  assert.match(lesson.parts[0].title, /AS-3 \/ Ind AS 7 Statutory Architecture/i);
  assert.ok(lesson.parts[0].code?.includes('CashFlowClassificationEngine'));

  // Part 2: Operating Activities Indirect Method
  assert.match(lesson.parts[1].title, /Operating Cash Flows \(CFO\).*Non-Cash Addbacks/i);
  assert.ok(lesson.parts[1].code?.includes('CfoIndirectEngine'));

  // Part 3: Investing & Financing Activities
  assert.match(lesson.parts[2].title, /Investing \(CFI\) & Financing \(CFF\) Activities/i);
  assert.ok(lesson.parts[2].code?.includes('CfiCffReconstructionEngine'));

  // Part 4: Complete AS-3 Cash Reconciliation & FCF
  assert.match(lesson.parts[3].title, /Complete AS-3 Cash Reconciliation & Free Cash Flow/i);
  assert.ok(lesson.parts[3].code?.includes('FreeCashFlowEngine'));

  // Part 5: Executive Cash Flow Control Dossier
  assert.match(lesson.parts[4].title, /Executive Cash Flow Control Dossier/i);
  assert.ok(lesson.parts[4].code?.includes('CashFlowGovernanceDossier'));
  assert.ok(lesson.parts[3].output?.includes('COMPLETE AS-3 CASH RECONCILIATION & FREE CASH FLOW AUDIT'));
});

test('Block 134: B.Com Accounting Day 29: Cloud Accounting, AI OCR & Forensic Audit', () => {
  const lesson = getLongLesson('bcom-accounting', 29);
  assert.equal(lesson.day, 29);
  assert.match(lesson.title, /Cloud Accounting, AI Invoicing \(OCR\) & Forensic Fraud Detection/i);

  // Part 1: Cloud ERP Ingestion
  assert.match(lesson.parts[0].title, /Cloud Accounting Architectures & API-Driven Automated Ledger Ingestion/i);
  assert.ok(lesson.parts[0].code?.includes('CloudLedgerPipeline'));

  // Part 2: AI Invoice OCR
  assert.match(lesson.parts[1].title, /AI-Powered OCR Invoicing & Intelligent Field Extraction Algorithms/i);
  assert.ok(lesson.parts[1].code?.includes('InvoiceOCREngine'));

  // Part 3: 3-Way Matching
  assert.match(lesson.parts[2].title, /Automated 3-Way Reconciliation Matching Engine/i);
  assert.ok(lesson.parts[2].code?.includes('ThreeWayMatchingEngine'));

  // Part 4: Benford's Law
  assert.match(lesson.parts[3].title, /Forensic Accounting & Fraud Detection via Benford's Law/i);
  assert.ok(lesson.parts[3].code?.includes('BenfordsLawForensicAuditor'));
  assert.ok(lesson.parts[3].output?.includes('FORENSIC BENFORD\'S LAW DIGITAL ANALYSIS'));

  // Part 5: Red-Flag Diagnostics
  assert.match(lesson.parts[4].title, /Red-Flag Anomaly Diagnostics, Audit Trail Verification & Internal Control Testing/i);
  assert.ok(lesson.parts[4].code?.includes('ForensicRedFlagEngine'));
  assert.ok(lesson.parts[4].output?.includes('FORENSIC RED-FLAG ANOMALY AUDIT REPORT'));
});

test('Block 134: B.Com Accounting Day 30: FINAL GRAND CAPSTONE', () => {
  const lesson = getLongLesson('bcom-accounting', 30);
  assert.equal(lesson.day, 30);
  assert.match(lesson.title, /FINAL GRAND CAPSTONE/i);
  assert.equal(lesson.minutes, 50, 'Day 30 capstone must be 50 minutes');

  // Part 1: Capstone Phase 1
  assert.match(lesson.parts[0].title, /Capstone Phase 1: Chart of Accounts Architecture/i);
  assert.ok(lesson.parts[0].code?.includes('EnterpriseAccountingCore'));
  assert.ok(lesson.parts[0].output?.includes('CAPSTONE PHASE 1: OPENING TRIAL BALANCE AUDIT'));

  // Part 2: Capstone Phase 2
  assert.match(lesson.parts[1].title, /Capstone Phase 2: Dual GST Commercial Invoicing/i);
  assert.ok(lesson.parts[1].code?.includes('GSTCommercialSettlementEngine'));
  assert.ok(lesson.parts[1].output?.includes('CAPSTONE PHASE 2: GST COMMERCIAL SETTLEMENT'));

  // Part 3: Capstone Phase 3
  assert.match(lesson.parts[2].title, /Capstone Phase 3: Payroll Statutory Compliance/i);
  assert.ok(lesson.parts[2].code?.includes('StatutoryWithholdingEngine'));
  assert.ok(lesson.parts[2].output?.includes('CAPSTONE PHASE 3: PAYROLL & STATUTORY WITHHOLDING AUDIT'));

  // Part 4: Capstone Phase 4
  assert.match(lesson.parts[3].title, /Capstone Phase 4: Ind AS Balance Sheet/i);
  assert.ok(lesson.parts[3].code?.includes('IndASFinancialReportingEngine'));
  assert.ok(lesson.parts[3].output?.includes('CAPSTONE PHASE 4: Ind AS FINANCIAL STATEMENTS & AS-3 AUDIT'));

  // Part 5: Capstone Phase 5
  assert.match(lesson.parts[4].title, /Capstone Phase 5: Comprehensive Tax Audit/i);
  assert.ok(lesson.parts[4].code?.includes('TaxAuditAndHealthCertificationEngine'));
  assert.ok(lesson.parts[4].output?.includes('CAPSTONE PHASE 5: SECTION 44AB TAX AUDIT'));
  assert.ok(lesson.parts[4].output?.includes('GRAND MASTER CAPSTONE CONTROLLER CERTIFICATION ISSUED'));
  assert.ok(lesson.parts[4].output?.includes('Digital Corporate Financial Controller & Tax Auditor'));
});

test('Block 134: B.Com Accounting Days 26-30 Gate v2 Visual JSON Integrity Verification', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let d = 26; d <= 30; d++) {
    const pad = String(d).padStart(2, '0');
    const visPath = path.join(__dirname, `../src/lib/data/lessonVisuals/bcom-accounting/day-${pad}.json`);
    assert.ok(fs.existsSync(visPath), `Visual JSON must exist for Day ${d}`);

    const vis = JSON.parse(fs.readFileSync(visPath, 'utf8'));
    assert.equal(vis.prefix, 'bcom-accounting');
    assert.equal(vis.day, d);
    assert.equal(vis.entries.length, 5, `Day ${d} visual must contain exactly 5 entries`);

    const lesson = getLongLesson('bcom-accounting', d);
    for (let i = 0; i < 5; i++) {
      const entry = vis.entries[i];
      const part = lesson.parts[i];

      assert.equal(entry.spec.template, 'ledger-sheet', `Day ${d} Part ${i + 1} must use ledger-sheet template`);
      assert.ok(entry.spec.steps.length >= 3, `Day ${d} Part ${i + 1} visual must have >= 3 steps`);

      // Verify SHA-256 binding between code and visual entry
      const expectedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(entry.codeHash, expectedHash, `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
    }
  }
});


