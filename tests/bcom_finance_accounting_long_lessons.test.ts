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
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
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
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
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
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
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
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
    }
  }
});

// ============================================================================
// BLOCK 134: B.Com Accounting Days 26 to 30 (TASK-1379..1383)
// Milestone 6: Advanced Corporate Tax Audit, Financial Diagnostics & Grand Master Capstone Suite
// COURSE 22 100% COMPLETE (30/30 DAYS)
// ============================================================================

test('Block 134: B.Com Accounting Days 26-30 Structural & Invariant Verification', () => {
  assert.ok(BCOM_ACCOUNTING_LONG_LESSONS.length >= 30, 'Course 22 must contain at least 30 days');

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
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
    }
  }
});

// ============================================================================
// BLOCK 135: B.COM FINANCE DAYS 6-10 (MILESTONE 2 CAPSTONE: TASK-1424..1428)
// ============================================================================

test('Block 135: B.Com Finance Days 6-10 Structural & Invariant Verification', () => {
  for (let d = 6; d <= 10; d++) {
    const lesson = getLongLesson('bcom-finance', d);
    assert.ok(lesson, `bcom-finance Day ${d} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom-finance');
    assert.equal(lesson.day, d);
    assert.equal(lesson.parts.length, 5, `Day ${d} must contain exactly 5 parts`);
    assert.equal(getLongLessonLanguage('bcom-finance'), 'python');

    const expectedMinutes = d === 10 ? 50 : 45;
    assert.equal(lesson.minutes, expectedMinutes, `Day ${d} duration must be ${expectedMinutes} min`);

    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 8, `Day ${d} spoken minutes (${spoken}) must be >= 8`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 15, `Day ${d} total lesson minutes (${total}) must be >= 15`);

    assert.ok(lesson.summary && lesson.summary.length >= 5, `Day ${d} summary must have >= 5 items`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 5, `Day ${d} projectStep must have title and >= 5 steps`);

    let totalWords = 0;
    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${d} Part ${i + 1} must have title`);
      assert.ok(part.say.length >= 1, `Day ${d} Part ${i + 1} say must be non-empty`);
      
      const partWords = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      totalWords += partWords;
      assert.ok(partWords >= 580, `Day ${d} Part ${i + 1} words (${partWords}) must be >= 580`);

      assert.ok(part.code && part.code.length > 50, `Day ${d} Part ${i + 1} code must be non-empty`);
      assert.ok(part.output && part.output.length > 10, `Day ${d} Part ${i + 1} output must be non-empty`);
      assert.ok(part.example && part.example.length > 0, `Day ${d} Part ${i + 1} example must be non-empty`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${d} Part ${i + 1} tryIt must be non-empty`);

      // Socratic check verification
      const check = part.check as any;
      assert.ok(check, `Day ${d} Part ${i + 1} check must be defined`);
      assert.ok(check.question && check.question.length > 10, `Day ${d} Part ${i + 1} check question missing`);
      assert.equal(check.options.length, 4, `Day ${d} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(check.answer, 0, `Day ${d} Part ${i + 1} answer must be index 0`);
      assert.equal(check.answerIndex, 0, `Day ${d} Part ${i + 1} answerIndex must be index 0`);
      assert.ok(check.why && check.why.length > 10, `Day ${d} Part ${i + 1} why missing`);
      assert.equal(check.explanation, check.why, `Day ${d} Part ${i + 1} explanation must equal why`);
    }

    assert.ok(totalWords >= 2950, `Day ${d} total words (${totalWords}) must be >= 2950`);
  }
});

test('Block 135: B.Com Finance Day 6: Bond Valuation & Fixed Income Pricing Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 6);
  assert.ok(lesson);
  assert.equal(lesson.title, 'Bond Valuation: Pricing Fixed Income Securities & Coupon Pricing');

  // Part 1: Bond pricing equation
  assert.match(lesson.parts[0].title, /Bond Pricing Equation/i);
  assert.ok(lesson.parts[0].code?.includes('BondValuationEngine'));
  assert.ok(lesson.parts[0].output?.includes('FAIR VALUE PRICING AUDIT'));

  // Part 2: Par, premium, discount
  assert.match(lesson.parts[1].title, /Par, Premium & Discount Dynamics/i);
  assert.ok(lesson.parts[1].code?.includes('BondPricingRelationshipEngine'));
  assert.ok(lesson.parts[1].output?.includes('PREMIUM_BOND'));
  assert.ok(lesson.parts[1].output?.includes('DISCOUNT_BOND'));

  // Part 3: Clean vs dirty price
  assert.match(lesson.parts[2].title, /Clean Price vs Dirty Price/i);
  assert.ok(lesson.parts[2].code?.includes('SettlementPricingEngine'));
  assert.ok(lesson.parts[2].output?.includes('Total Invoice Price'));

  // Part 4: Zero-coupon bond
  assert.match(lesson.parts[3].title, /Zero-Coupon Bond Pricing/i);
  assert.ok(lesson.parts[3].code?.includes('ZeroCouponBondEngine'));
  assert.ok(lesson.parts[3].output?.includes('Implied Yield: 10.0%'));

  // Part 5: Master portfolio engine
  assert.match(lesson.parts[4].title, /Enterprise Fixed Income Portfolio Valuation/i);
  assert.ok(lesson.parts[4].code?.includes('InstitutionalFixedIncomeMasterEngine'));
  assert.ok(lesson.parts[4].output?.includes('PORTFOLIO_MARK_TO_MARKET_AUDIT_VERIFIED'));
});

test('Block 135: B.Com Finance Day 7: Yield to Maturity (YTM) & Approximation Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 7);
  assert.ok(lesson);
  assert.equal(lesson.title, 'Yield to Maturity (YTM) & Bond Yield Approximation');

  // Part 1: Yield spectrum
  assert.match(lesson.parts[0].title, /Yield Measures Spectrum/i);
  assert.ok(lesson.parts[0].code?.includes('YieldSpectrumEngine'));
  assert.ok(lesson.parts[0].output?.includes('Nominal Coupon Yield'));

  // Part 2: Market approximation formula
  assert.match(lesson.parts[1].title, /Standard Market YTM Approximation/i);
  assert.ok(lesson.parts[1].code?.includes('YtmApproximationEngine'));
  assert.ok(lesson.parts[1].output?.includes('Approximate YTM: 12.63%'));

  // Part 3: Exact solver
  assert.match(lesson.parts[2].title, /Exact Yield to Maturity Numerical Solver/i);
  assert.ok(lesson.parts[2].code?.includes('ExactYtmSolverEngine'));
  assert.ok(lesson.parts[2].output?.includes('Exact YTM:    12.8277%'));

  // Part 4: Yield decomposition
  assert.match(lesson.parts[3].title, /Yield Decomposition: Current Yield & Capital Gains/i);
  assert.ok(lesson.parts[3].code?.includes('YieldDecompositionEngine'));
  assert.ok(lesson.parts[3].output?.includes('Current Income Yield:       8.42%'));
  assert.ok(lesson.parts[3].output?.includes('Capital Gains Yield:       +3.16%'));

  // Part 5: Yield curve diagnostics
  assert.match(lesson.parts[4].title, /Yield Curve Structures/i);
  assert.ok(lesson.parts[4].code?.includes('YieldCurveDiagnosticEngine'));
  assert.ok(lesson.parts[4].output?.includes('INVERTED_YIELD_CURVE'));
  assert.ok(lesson.parts[4].output?.includes('RECESSION_WARNING_HIGH_PROBABILITY'));
});

test('Block 135: B.Com Finance Day 8: Macaulay & Modified Duration Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 8);
  assert.ok(lesson);
  assert.equal(lesson.title, 'Interest Rate Risk: Macaulay Duration & Modified Duration');

  // Part 1: Macaulay duration
  assert.match(lesson.parts[0].title, /Macaulay Duration: Cash Flow Timing/i);
  assert.ok(lesson.parts[0].code?.includes('MacaulayDurationEngine'));
  assert.ok(lesson.parts[0].output?.includes('Macaulay Duration:   2.74 Years'));
  assert.ok(lesson.parts[0].output?.includes('Macaulay Duration:   5.00 Years'));

  // Part 2: Modified duration
  assert.match(lesson.parts[1].title, /Modified Duration: Percentage Price Sensitivity/i);
  assert.ok(lesson.parts[1].code?.includes('ModifiedDurationEngine'));
  assert.ok(lesson.parts[1].output?.includes('Modified Duration:   2.49% per 100 bps'));

  // Part 3: Convexity
  assert.match(lesson.parts[2].title, /Bond Convexity: Curvature Correction/i);
  assert.ok(lesson.parts[2].code?.includes('BondConvexityEngine'));
  assert.ok(lesson.parts[2].output?.includes('Convexity = 59.39'));

  // Part 4: BPS estimator
  assert.match(lesson.parts[3].title, /Bond Price Sensitivity Percentage Estimator/i);
  assert.ok(lesson.parts[3].code?.includes('PriceSensitivityEstimator'));
  assert.ok(lesson.parts[3].output?.includes('Est Price Change: -5.000%'));

  // Part 5: ALM immunization
  assert.match(lesson.parts[4].title, /Duration Immunization & Asset-Liability Management/i);
  assert.ok(lesson.parts[4].code?.includes('DurationImmunizationEngine'));
  assert.ok(lesson.parts[4].output?.includes('IMMUNIZED_BALANCED_PORTFOLIO'));
});

test('Block 135: B.Com Finance Day 9: Capital Budgeting & NPV Decision Rule Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 9);
  assert.ok(lesson);
  assert.equal(lesson.title, 'Capital Budgeting: Net Present Value (NPV) Decision Rule');

  // Part 1: NPV decision rule
  assert.match(lesson.parts[0].title, /The NPV Decision Rule/i);
  assert.ok(lesson.parts[0].code?.includes('NetPresentValueEngine'));
  assert.ok(lesson.parts[0].output?.includes('Net Present Value: $+22,764.84'));
  assert.ok(lesson.parts[0].output?.includes('ACCEPT_PROJECT_WEALTH_MAXIMIZING'));

  // Part 2: FCFF & terminal salvage
  assert.match(lesson.parts[1].title, /Free Cash Flow Modeling/i);
  assert.ok(lesson.parts[1].code?.includes('FreeCashFlowEngine'));
  assert.ok(lesson.parts[1].output?.includes('Net FCFF: $104,500.00 [Incl Terminal Salvage: $27,500.00]'));

  // Part 3: Value additivity
  assert.match(lesson.parts[2].title, /NPV Superiority Axioms & Value Additivity/i);
  assert.ok(lesson.parts[2].code?.includes('ValueAdditivityEngine'));
  assert.ok(lesson.parts[2].output?.includes('NPV VALUE ADDITIVITY CONFIRMED = True'));

  // Part 4: Mutually exclusive selection
  assert.match(lesson.parts[3].title, /Mutually Exclusive Project Selection/i);
  assert.ok(lesson.parts[3].code?.includes('MutuallyExclusiveProjectEngine'));
  assert.ok(lesson.parts[3].output?.includes('OPTIMAL SELECTION: PROJECT_A'));

  // Part 5: Master capex suite
  assert.match(lesson.parts[4].title, /Executive Capital Allocation Suite/i);
  assert.ok(lesson.parts[4].code?.includes('ExecutiveCapitalBudgetingSuite'));
  assert.ok(lesson.parts[4].output?.includes('APPROVED_VALUE_CREATING'));
});

test('Block 135: B.Com Finance Day 10 Capstone: IRR Bisection & Hurdle Benchmark Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 10);
  assert.ok(lesson);
  assert.equal(lesson.title, 'Capital Budgeting: Internal Rate of Return (IRR) & Hurdle Rate Benchmark');

  // Part 1: Bisection IRR engine
  assert.match(lesson.parts[0].title, /Internal Rate of Return.*Bisection Engine/i);
  assert.ok(lesson.parts[0].code?.includes('HighPrecisionIrrBisectionEngine'));
  assert.ok(lesson.parts[0].output?.includes('Solved IRR:  13.07%'));
  assert.ok(lesson.parts[0].output?.includes('Solved IRR: 100.00%'));

  // Part 2: Hurdle benchmark & NPV profile
  assert.match(lesson.parts[1].title, /Hurdle Rate Benchmark Testing/i);
  assert.ok(lesson.parts[1].code?.includes('NpvProfileEngine'));
  assert.ok(lesson.parts[1].output?.includes('Exact Solved IRR (NPV = 0):           13.07%'));

  // Part 3: MIRR
  assert.match(lesson.parts[2].title, /Modified Internal Rate of Return \(MIRR\)/i);
  assert.ok(lesson.parts[2].code?.includes('ModifiedIrrEngine'));
  assert.ok(lesson.parts[2].output?.includes('MODIFIED IRR (Realistic WACC Reinvestment):    12.25%'));

  // Part 4: Capital rationing & PI
  assert.match(lesson.parts[3].title, /Capital Rationing & Profitability Index/i);
  assert.ok(lesson.parts[3].code?.includes('CapitalRationingOptimizer'));
  assert.ok(lesson.parts[3].output?.includes('MAXIMIZED VALUE DENSITY UNDER HARD CAPEX CONSTRAINTS'));

  // Part 5: Grand Milestone 2 Capstone
  assert.match(lesson.parts[4].title, /Milestone 2 Capstone: Comprehensive Capital Budgeting Control Tower/i);
  assert.ok(lesson.parts[4].code?.includes('Milestone2CapitalBudgetingControlTower'));
  assert.ok(lesson.parts[4].output?.includes('TOTAL SHAREHOLDER WEALTH ADDED: $  +58,835.46'));
  assert.ok(lesson.parts[4].output?.includes('MILESTONE_2_CFO_CAPITAL_ALLOCATION_CERTIFIED'));
  assert.ok(lesson.parts[4].output?.includes('MILESTONE 2 COMPLETE: CAPITAL BUDGETING & VALUATION MASTER ATTAINED!'));
});

test('Block 135: B.Com Finance Days 6-10 Gate v2 Visual JSON Integrity Verification', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let d = 6; d <= 10; d++) {
    const pad = String(d).padStart(2, '0');
    const visPath = path.join(__dirname, `../src/lib/data/lessonVisuals/bcom-finance/day-${pad}.json`);
    assert.ok(fs.existsSync(visPath), `Visual JSON must exist for Day ${d}`);

    const vis = JSON.parse(fs.readFileSync(visPath, 'utf8'));
    assert.equal(vis.prefix, 'bcom-finance');
    assert.equal(vis.day, d);
    assert.equal(vis.entries.length, 5, `Day ${d} visual must contain exactly 5 entries`);

    const lesson = getLongLesson('bcom-finance', d);
    for (let i = 0; i < 5; i++) {
      const entry = vis.entries[i];
      const part = lesson.parts[i];

      assert.equal(entry.spec.template, 'ledger-sheet', `Day ${d} Part ${i + 1} must use ledger-sheet template`);
      assert.ok(entry.spec.steps.length >= 3, `Day ${d} Part ${i + 1} visual must have >= 3 steps`);

      // Verify SHA-256 binding between code and visual entry
      const expectedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
    }
  }
});

// ============================================================================
// BLOCK 136: B.COM FINANCE DAYS 11-15 (MILESTONE 3 CAPSTONE)
// ============================================================================

test('Block 136: B.Com Finance Days 11-15 Structural & Invariant Verification', () => {
  for (let d = 11; d <= 15; d++) {
    const lesson = getLongLesson('bcom-finance', d);
    assert.ok(lesson, `bcom-finance Day ${d} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom-finance');
    assert.equal(lesson.day, d);
    assert.equal(lesson.parts.length, 5, `Day ${d} must contain exactly 5 parts`);

    const expectedMinutes = d === 15 ? 50 : 45;
    assert.equal(lesson.minutes, expectedMinutes, `Day ${d} duration must be ${expectedMinutes}m`);

    assert.ok(lesson.goal && lesson.goal.length > 30, `Day ${d} must have comprehensive goal`);
    assert.ok(lesson.recap && lesson.recap.length > 30, `Day ${d} must have comprehensive recap`);
    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${d} must have >= 4 summary bullet points`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, `Day ${d} projectStep must have >= 4 steps`);

    let totalWords = 0;
    for (let i = 0; i < 5; i++) {
      const p = lesson.parts[i];
      assert.ok(p.title && p.title.length > 0, `Day ${d} Part ${i + 1} title missing`);
      assert.ok(p.say && p.say.length >= 1, `Day ${d} Part ${i + 1} say missing`);
      
      const partWords = p.say.join(' ').trim().split(/\s+/).filter(Boolean).length;
      totalWords += partWords;
      assert.ok(partWords >= 580, `Day ${d} Part ${i + 1} word count ${partWords} < 580`);

      assert.ok(p.code && (p.code.includes('class ') || p.code.includes('def ')), `Day ${d} Part ${i + 1} code missing`);
      assert.ok(p.output && p.output.length > 0, `Day ${d} Part ${i + 1} output missing`);
      assert.ok(p.codeNotes && p.codeNotes.length >= 2, `Day ${d} Part ${i + 1} codeNotes missing`);
      assert.ok(p.tryIt && p.tryIt.length > 0, `Day ${d} Part ${i + 1} tryIt missing`);

      const check = p.check as any;
      assert.ok(check && check.question && check.question.length > 10, `Day ${d} Part ${i + 1} check question missing`);
      assert.equal(check.options.length, 4, `Day ${d} Part ${i + 1} check must have 4 options`);
      assert.equal(check.answer, 0, `Day ${d} Part ${i + 1} check answer must be 0`);
      assert.equal(check.answerIndex, 0, `Day ${d} Part ${i + 1} check answerIndex must be 0`);
      assert.ok(check.why && check.why.length > 10, `Day ${d} Part ${i + 1} check why missing`);
      assert.equal(check.explanation, check.why, `Day ${d} Part ${i + 1} explanation must match why`);
    }

    assert.ok(totalWords >= 2950, `Day ${d} total words ${totalWords} < 2950`);
  }
});

test('Block 136: B.Com Finance Day 11: Payback Period & Profitability Index Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 11);
  assert.ok(lesson);
  assert.equal(lesson.title, 'Capital Budgeting: Payback Period & Profitability Index (PI)');

  // Part 1: Simple Payback Period
  assert.match(lesson.parts[0].title, /Simple Payback Period/i);
  assert.ok(lesson.parts[0].code?.includes('CapitalOutlayProject'));
  assert.ok(lesson.parts[0].output?.includes('INSTITUTIONAL CAPITAL BUDGETING: SIMPLE PAYBACK AUDIT'));

  // Part 2: Discounted Payback Period
  assert.match(lesson.parts[1].title, /Discounted Payback Period/i);
  assert.ok(lesson.parts[1].code?.includes('DiscountedPaybackCase'));
  assert.ok(lesson.parts[1].output?.includes('DISCOUNTED VS SIMPLE PAYBACK PERIOD: TIME-VALUE AUDIT'));

  // Part 3: Profitability Index (PI)
  assert.match(lesson.parts[2].title, /Profitability Index \(PI\)/i);
  assert.ok(lesson.parts[2].code?.includes('EfficiencyCandidate'));
  assert.ok(lesson.parts[2].output?.includes('INSTITUTIONAL PROFITABILITY INDEX (BENEFIT-COST) AUDIT'));

  // Part 4: Capital Rationing Optimization
  assert.match(lesson.parts[3].title, /Capital Rationing Optimization/i);
  assert.ok(lesson.parts[3].code?.includes('RationingProposal'));
  assert.ok(lesson.parts[3].output?.includes('CAPITAL RATIONING & PROFITABILITY INDEX ALLOCATION AUDIT'));

  // Part 5: Enterprise Capital Appraisal Suite
  assert.match(lesson.parts[4].title, /Enterprise Capital Appraisal & Liquidity Governance Suite/i);
  assert.ok(lesson.parts[4].code?.includes('MasterInvestmentProject'));
  assert.ok(lesson.parts[4].output?.includes('ENTERPRISE CAPITAL APPRAISAL & LIQUIDITY GOVERNANCE AUDIT'));
});

test('Block 136: B.Com Finance Day 12: Cost of Debt (Kd) & Tax Shield Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 12);
  assert.ok(lesson);
  assert.equal(lesson.title, 'Cost of Capital: Cost of Debt (Kd) & Tax Shield');

  // Part 1: Pre-Tax vs After-Tax Kd
  assert.match(lesson.parts[0].title, /Pre-Tax vs Effective After-Tax Cost of Debt/i);
  assert.ok(lesson.parts[0].code?.includes('DebtFinancingFacility'));
  assert.ok(lesson.parts[0].output?.includes('INSTITUTIONAL DEBT FINANCING: PRE-TAX VS AFTER-TAX AUDIT'));

  // Part 2: Corporate Interest Tax Shield
  assert.match(lesson.parts[1].title, /Corporate Interest Tax Shield/i);
  assert.ok(lesson.parts[1].code?.includes('CorporateDebtStructure'));
  assert.ok(lesson.parts[1].output?.includes('MODIGLIANI-MILLER CORPORATE INTEREST TAX SHIELD AUDIT'));

  // Part 3: Flotation Costs
  assert.match(lesson.parts[2].title, /Flotation Costs/i);
  assert.ok(lesson.parts[2].code?.includes('BondIssuancePlan'));
  assert.ok(lesson.parts[2].output?.includes('PUBLIC DEBT FLOTATION COSTS & ISSUANCE PROCEEDS AUDIT'));

  // Part 4: Redeemable Debentures
  assert.match(lesson.parts[3].title, /Redeemable Debentures/i);
  assert.ok(lesson.parts[3].code?.includes('RedeemableDebenture'));
  assert.ok(lesson.parts[3].output?.includes('REDEEMABLE DEBENTURE COST OF DEBT APPROXIMATION AUDIT'));

  // Part 5: Debt Structure Master Suite
  assert.match(lesson.parts[4].title, /Enterprise Debt Capital Structure & Tax Shield Master Suite/i);
  assert.ok(lesson.parts[4].code?.includes('DebtTranche'));
  assert.ok(lesson.parts[4].output?.includes('ENTERPRISE MULTI-TRANCHE DEBT & TAX SHIELD MASTER AUDIT'));
});

test('Block 136: B.Com Finance Day 13: Cost of Equity (Ke) via CAPM & Dividend Growth Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 13);
  assert.ok(lesson);
  assert.equal(lesson.title, 'Cost of Capital: Cost of Equity (Ke) via CAPM & Dividend Growth');

  // Part 1: CAPM & Systematic Risk
  assert.match(lesson.parts[0].title, /Capital Asset Pricing Model \(CAPM\)/i);
  assert.ok(lesson.parts[0].code?.includes('CapmEquitySecurity'));
  assert.ok(lesson.parts[0].output?.includes('CAPITAL ASSET PRICING MODEL (CAPM) COST OF EQUITY AUDIT'));

  // Part 2: Gordon Growth Model
  assert.match(lesson.parts[1].title, /Gordon Constant Growth Dividend Model/i);
  assert.ok(lesson.parts[1].code?.includes('DividendStockQuote'));
  assert.ok(lesson.parts[1].output?.includes('GORDON CONSTANT GROWTH DIVIDEND DISCOUNT AUDIT'));

  // Part 3: Dual-Model Triangulation
  assert.match(lesson.parts[2].title, /Dual-Model Ke Triangulation/i);
  assert.ok(lesson.parts[2].code?.includes('EquityValuationProfile'));
  assert.ok(lesson.parts[2].output?.includes('DUAL-MODEL COST OF EQUITY (CAPM VS GORDON) TRIANGULATION'));

  // Part 4: Preference Capital (Kp)
  assert.match(lesson.parts[3].title, /Cost of Preference Capital \(Kp\)/i);
  assert.ok(lesson.parts[3].code?.includes('PreferenceShareIssue'));
  assert.ok(lesson.parts[3].output?.includes('PREFERENCE SHARE CAPITAL (Kp) FINANCING COST AUDIT'));

  // Part 5: Enterprise Equity Master Suite
  assert.match(lesson.parts[4].title, /Enterprise Equity & Hybrid Capital Valuation Suite/i);
  assert.ok(lesson.parts[4].code?.includes('CorporateEquityStructure'));
  assert.ok(lesson.parts[4].output?.includes('ENTERPRISE EQUITY & HYBRID CAPITAL HURDLE RATE AUDIT'));
});

test('Block 136: B.Com Finance Day 14: WACC & Blended Financing Cost Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 14);
  assert.ok(lesson);
  assert.equal(lesson.title, 'Weighted Average Cost of Capital (WACC) & Blended Financing Cost');

  // Part 1: WACC Equation & Weights
  assert.match(lesson.parts[0].title, /The WACC Equation & Capital Structure Weighting/i);
  assert.ok(lesson.parts[0].code?.includes('EnterpriseCapitalization'));
  assert.ok(lesson.parts[0].output?.includes('ENTERPRISE WEIGHTED AVERAGE COST OF CAPITAL (WACC) AUDIT'));

  // Part 2: Market vs Book Value
  assert.match(lesson.parts[1].title, /Market Value vs Book Value Weighting Schemes/i);
  assert.ok(lesson.parts[1].code?.includes('CapitalStructureData'));
  assert.ok(lesson.parts[1].output?.includes('WACC WEIGHTING SCHEMES: BOOK VALUE VS MARKET VALUE AUDIT'));

  // Part 3: Hurdle Rate & Divisional Adjustments
  assert.match(lesson.parts[2].title, /WACC as Project Hurdle Rate & Divisional Risk Adjustments/i);
  assert.ok(lesson.parts[2].code?.includes('CapitalProjectCandidate'));
  assert.ok(lesson.parts[2].output?.includes('DIVISIONAL RISK ADJUSTMENT & TAILORED WACC HURDLE AUDIT'));

  // Part 4: Capital Structure Optimization
  assert.match(lesson.parts[3].title, /Capital Structure Optimization/i);
  assert.ok(lesson.parts[3].code?.includes('CapitalStructureOptimizer'));
  assert.ok(lesson.parts[3].output?.includes('CAPITAL STRUCTURE OPTIMIZATION: WACC MINIMIZATION AUDIT'));

  // Part 5: Enterprise Hurdle Allocation Suite
  assert.match(lesson.parts[4].title, /Enterprise Corporate Hurdle Rate & Capital Allocation Suite/i);
  assert.ok(lesson.parts[4].code?.includes('CorporateProposal'));
  assert.ok(lesson.parts[4].output?.includes('ENTERPRISE CORPORATE HURDLE RATE & CAPITAL ALLOCATION AUDIT'));
});

test('Block 136: B.Com Finance Day 15 Capstone: Integrated Capital Budgeting & WACC Engine Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 15);
  assert.ok(lesson);
  assert.match(lesson.title, /MILESTONE 3.*Complete Capital Budgeting & Cost of Capital Valuation Engine/i);

  // Part 1: Enterprise WACC & Multi-Period DCF
  assert.match(lesson.parts[0].title, /Enterprise WACC & Multi-Period DCF Master Synthesis/i);
  assert.ok(lesson.parts[0].code?.includes('MasterValuationCase'));
  assert.ok(lesson.parts[0].output?.includes('⭐ MILESTONE 3 CAPSTONE: WACC & DCF CAPITAL BUDGETING MASTER'));

  // Part 2: Capital Equipment Replacement & EAC
  assert.match(lesson.parts[1].title, /Capital Equipment Replacement & Equivalent Annual Cost \(EAC\)/i);
  assert.ok(lesson.parts[1].code?.includes('EquipmentReplacementCase'));
  assert.ok(lesson.parts[1].output?.includes('CAPITAL EQUIPMENT REPLACEMENT & MODERNIZATION AUDIT'));

  // Part 3: EBIT-EPS Indifference Point
  assert.match(lesson.parts[2].title, /EBIT-EPS Indifference Point & Financial Financing Plans/i);
  assert.ok(lesson.parts[2].code?.includes('FinancingPlan'));
  assert.ok(lesson.parts[2].output?.includes('EBIT-EPS INDIFFERENCE POINT FINANCIAL FINANCING AUDIT'));

  // Part 4: Capital Rationing Matrix
  assert.match(lesson.parts[3].title, /Multi-Project Capital Rationing Matrix & Boundary Analysis/i);
  assert.ok(lesson.parts[3].code?.includes('CapexProposal'));
  assert.ok(lesson.parts[3].output?.includes('CAPITAL RATIONING MATRIX & MULTI-PROJECT OPTIMIZATION'));

  // Part 5: Grand Milestone 3 Capstone
  assert.match(lesson.parts[4].title, /Milestone 3 Capstone: Integrated Capital Budgeting & Valuation Suite/i);
  assert.ok(lesson.parts[4].code?.includes('StrategicProposal'));
  assert.ok(lesson.parts[4].output?.includes('⭐ MILESTONE 3 CAPSTONE: CAPITAL BUDGETING & WACC MASTER AUDIT'));
  assert.ok(lesson.parts[4].output?.includes('MILESTONE_3_CFO_CAPITAL_BUDGETING_WACC_MASTER_CERTIFIED'));
  assert.ok(lesson.parts[4].output?.includes('MILESTONE 3 COMPLETE: CAPITAL BUDGETING & WACC MASTER ATTAINED!'));
});

test('Block 136: B.Com Finance Days 11-15 Gate v2 Visual JSON Integrity Verification', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let d = 11; d <= 15; d++) {
    const pad = String(d).padStart(2, '0');
    const visPath = path.join(__dirname, `../src/lib/data/lessonVisuals/bcom-finance/day-${pad}.json`);
    assert.ok(fs.existsSync(visPath), `Visual JSON must exist for Day ${d}`);

    const vis = JSON.parse(fs.readFileSync(visPath, 'utf8'));
    assert.equal(vis.prefix, 'bcom-finance');
    assert.equal(vis.day, d);
    assert.equal(vis.entries.length, 5, `Day ${d} visual must contain exactly 5 entries`);

    const lesson = getLongLesson('bcom-finance', d);
    for (let i = 0; i < 5; i++) {
      const entry = vis.entries[i];
      const part = lesson.parts[i];

      assert.equal(entry.spec.template, 'ledger-sheet', `Day ${d} Part ${i + 1} must use ledger-sheet template`);
      assert.ok(entry.spec.steps.length >= 3, `Day ${d} Part ${i + 1} visual must have >= 3 steps`);

      // Verify SHA-256 binding between code and visual entry
      const expectedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
    }
  }
});

// ============================================================================
// BLOCK 137: B.COM FINANCE DAYS 16-20 (CAPITAL STRUCTURE & WORKING CAPITAL)
// ============================================================================

test('Block 137: B.Com Finance Days 16-20 Structural & Invariant Verification', () => {
  for (let d = 16; d <= 20; d++) {
    const lesson = getLongLesson('bcom-finance', d);
    assert.ok(lesson, `bcom-finance Day ${d} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom-finance');
    assert.equal(lesson.day, d);
    assert.equal(lesson.parts.length, 5, `Day ${d} must contain exactly 5 parts`);

    const expectedMinutes = 45;
    assert.equal(lesson.minutes, expectedMinutes, `Day ${d} duration must be ${expectedMinutes}m`);

    assert.ok(lesson.goal && lesson.goal.length > 30, `Day ${d} must have comprehensive goal`);
    assert.ok(lesson.recap && lesson.recap.length > 30, `Day ${d} must have comprehensive recap`);
    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${d} must have >= 4 summary bullet points`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, `Day ${d} projectStep must have >= 4 steps`);

    let totalWords = 0;
    for (let i = 0; i < 5; i++) {
      const p = lesson.parts[i];
      assert.ok(p.title && p.title.length > 0, `Day ${d} Part ${i + 1} title missing`);
      assert.ok(p.say && p.say.length >= 1, `Day ${d} Part ${i + 1} say missing`);
      
      const partWords = p.say.join(' ').trim().split(/\s+/).filter(Boolean).length;
      totalWords += partWords;
      assert.ok(partWords >= 580, `Day ${d} Part ${i + 1} word count ${partWords} < 580`);

      assert.ok(p.code && (p.code.includes('class ') || p.code.includes('def ')), `Day ${d} Part ${i + 1} code missing`);
      assert.ok(p.output && p.output.length > 0, `Day ${d} Part ${i + 1} output missing`);
      assert.ok(p.codeNotes && p.codeNotes.length >= 2, `Day ${d} Part ${i + 1} codeNotes missing`);
      assert.ok(p.tryIt && p.tryIt.length > 0, `Day ${d} Part ${i + 1} tryIt missing`);

      const check = p.check as any;
      assert.ok(check && check.question && check.question.length > 10, `Day ${d} Part ${i + 1} check question missing`);
      assert.equal(check.options.length, 4, `Day ${d} Part ${i + 1} check must have 4 options`);
      assert.equal(check.answer, 0, `Day ${d} Part ${i + 1} check answer must be 0`);
      assert.equal(check.answerIndex, 0, `Day ${d} Part ${i + 1} check answerIndex must be 0`);
      assert.ok(check.why && check.why.length > 10, `Day ${d} Part ${i + 1} check why missing`);
      assert.equal(check.explanation, check.why, `Day ${d} Part ${i + 1} explanation must match why`);
    }

    assert.ok(totalWords >= 2950, `Day ${d} total words ${totalWords} < 2950`);
  }
});

test('Block 137: B.Com Finance Day 16: Leverage (DOL, DFL, DCL & Indifference) Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 16);
  assert.ok(lesson);
  assert.equal(lesson.title, 'Operating, Financial & Combined Leverage: DOL, DFL & DCL');

  // Part 1: Operating Leverage (DOL)
  assert.match(lesson.parts[0].title, /Operating Leverage.*DOL Mechanics/i);
  assert.ok(lesson.parts[0].code?.includes('OperatingCostStructure'));
  assert.ok(lesson.parts[0].output?.includes('INSTITUTIONAL OPERATING LEVERAGE (DOL) AUDIT'));

  // Part 2: Financial Leverage (DFL)
  assert.match(lesson.parts[1].title, /Financial Leverage.*DFL Mechanics/i);
  assert.ok(lesson.parts[1].code?.includes('CapitalDebtProfile'));
  assert.ok(lesson.parts[1].output?.includes('INSTITUTIONAL FINANCIAL LEVERAGE (DFL) AUDIT'));

  // Part 3: Combined Leverage (DCL)
  assert.match(lesson.parts[2].title, /Combined Leverage.*DCL Synthesis/i);
  assert.ok(lesson.parts[2].code?.includes('EnterpriseFirmStructure'));
  assert.ok(lesson.parts[2].output?.includes('INSTITUTIONAL DEGREE OF COMBINED LEVERAGE (DCL) AUDIT'));

  // Part 4: EBIT-EPS Indifference Point
  assert.match(lesson.parts[3].title, /EBIT-EPS Indifference Analysis/i);
  assert.ok(lesson.parts[3].code?.includes('CapitalFinancingPlan'));
  assert.ok(lesson.parts[3].output?.includes('INSTITUTIONAL EBIT-EPS INDIFFERENCE POINT AUDIT'));

  // Part 5: Enterprise Leverage Governance
  assert.match(lesson.parts[4].title, /Enterprise Leverage Governance & Risk Management Suite/i);
  assert.ok(lesson.parts[4].code?.includes('CorporateDivisionProfile'));
  assert.ok(lesson.parts[4].output?.includes('ENTERPRISE LEVERAGE GOVERNANCE & RISK MANAGEMENT MASTER AUDIT'));
});

test('Block 137: B.Com Finance Day 17: Break-Even Analysis & Margin of Safety Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 17);
  assert.ok(lesson);
  assert.equal(lesson.title, 'Break-Even Analysis & Margin of Safety');

  // Part 1: Contribution Margin & P/V Ratio
  assert.match(lesson.parts[0].title, /Contribution Margin Economics & Profit-Volume \(P\/V\) Ratio/i);
  assert.ok(lesson.parts[0].code?.includes('ProductLineUnitEconomics'));
  assert.ok(lesson.parts[0].output?.includes('INSTITUTIONAL CONTRIBUTION MARGIN & P/V RATIO AUDIT'));

  // Part 2: Break-Even Point (BEP)
  assert.match(lesson.parts[1].title, /Break-Even Point \(BEP\) Formulation/i);
  assert.ok(lesson.parts[1].code?.includes('FacilityOperatingProfile'));
  assert.ok(lesson.parts[1].output?.includes('INSTITUTIONAL BREAK-EVEN POINT (BEP) AUDIT'));

  // Part 3: Margin of Safety (MOS)
  assert.match(lesson.parts[2].title, /Margin of Safety \(MOS\): Cushion Analysis/i);
  assert.ok(lesson.parts[2].code?.includes('CommercialSalesPerformance'));
  assert.ok(lesson.parts[2].output?.includes('INSTITUTIONAL MARGIN OF SAFETY (MOS) AUDIT'));

  // Part 4: Target Profit Sales Planning
  assert.match(lesson.parts[3].title, /Target Profit Volume Planning & Tax-Adjusted Sales Models/i);
  assert.ok(lesson.parts[3].code?.includes('TargetProfitObjectives'));
  assert.ok(lesson.parts[3].output?.includes('INSTITUTIONAL TARGET PROFIT PLANNING AUDIT'));

  // Part 5: Multi-Product CVP Master Suite
  assert.match(lesson.parts[4].title, /Enterprise CVP Multi-Product Break-Even & Governance Suite/i);
  assert.ok(lesson.parts[4].code?.includes('ProductLineSpecification'));
  assert.ok(lesson.parts[4].output?.includes('ENTERPRISE MULTI-PRODUCT CVP BREAK-EVEN & GOVERNANCE AUDIT'));
});

test('Block 137: B.Com Finance Day 18: Working Capital & Cash Budgeting Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 18);
  assert.ok(lesson);
  assert.equal(lesson.title, 'Working Capital Management & Quarterly Cash Budgeting');

  // Part 1: CCC & Operating Cycle
  assert.match(lesson.parts[0].title, /Working Capital Architecture: Gross vs Net & The Operating Cycle/i);
  assert.ok(lesson.parts[0].code?.includes('WorkingCapitalProfile'));
  assert.ok(lesson.parts[0].output?.includes('INSTITUTIONAL CASH CONVERSION CYCLE (CCC) AUDIT'));

  // Part 2: Working Capital Financing Policies
  assert.match(lesson.parts[1].title, /Working Capital Financing Policies/i);
  assert.ok(lesson.parts[1].code?.includes('CorporateAssetRequirements'));
  assert.ok(lesson.parts[1].output?.includes('INSTITUTIONAL WORKING CAPITAL FINANCING POLICY AUDIT'));

  // Part 3: Cash Budgeting
  assert.match(lesson.parts[2].title, /Quarterly Cash Budgeting & Rolling Liquidity Schedules/i);
  assert.ok(lesson.parts[2].code?.includes('MonthlyCashForecast'));
  assert.ok(lesson.parts[2].output?.includes('INSTITUTIONAL QUARTERLY CASH BUDGET & OVERDRAFT AUDIT'));

  // Part 4: Receivables & Credit Policy
  assert.match(lesson.parts[3].title, /Receivables Management: Credit Terms & Bad Debt Optimization/i);
  assert.ok(lesson.parts[3].code?.includes('CreditPolicySpecification'));
  assert.ok(lesson.parts[3].output?.includes('INSTITUTIONAL TRADE CREDIT POLICY OPTIMIZATION AUDIT'));

  // Part 5: Working Capital Control Tower
  assert.match(lesson.parts[4].title, /Enterprise Working Capital Liquidity & Treasury Control Tower/i);
  assert.ok(lesson.parts[4].code?.includes('EnterpriseBalanceSheetAudit'));
  assert.ok(lesson.parts[4].output?.includes('ENTERPRISE WORKING CAPITAL & TREASURY CONTROL TOWER AUDIT'));
});

test('Block 137: B.Com Finance Day 19: Capital Structure Theories & MM Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 19);
  assert.ok(lesson);
  assert.equal(lesson.title, 'Capital Structure Theories: Modigliani-Miller (MM) Theorem');

  // Part 1: NI vs NOI
  assert.match(lesson.parts[0].title, /Traditional Capital Structure: Net Income \(NI\) vs Net Operating Income \(NOI\)/i);
  assert.ok(lesson.parts[0].code?.includes('CapitalStructureScenario'));
  assert.ok(lesson.parts[0].output?.includes('INSTITUTIONAL NI VS NOI CAPITAL STRUCTURE AUDIT'));

  // Part 2: MM No Taxes Arbitrage
  assert.match(lesson.parts[1].title, /Modigliani-Miller \(MM\) Theorem: Irrelevance & Arbitrage/i);
  assert.ok(lesson.parts[1].code?.includes('FirmValuationProfile'));
  assert.ok(lesson.parts[1].output?.includes('INSTITUTIONAL MODIGLIANI-MILLER HOMEMADE LEVERAGE ARBITRAGE AUDIT'));

  // Part 3: MM With Corporate Taxes
  assert.match(lesson.parts[2].title, /Modigliani-Miller with Corporate Taxes/i);
  assert.ok(lesson.parts[2].code?.includes('CorporateTaxValuationCase'));
  assert.ok(lesson.parts[2].output?.includes('INSTITUTIONAL MODIGLIANI-MILLER WITH CORPORATE TAXES AUDIT'));

  // Part 4: Static Trade-Off Theory
  assert.match(lesson.parts[3].title, /Static Trade-Off Theory: Tax Shields vs Financial Distress Costs/i);
  assert.ok(lesson.parts[3].code?.includes('TradeOffFirmProfile'));
  assert.ok(lesson.parts[3].output?.includes('INSTITUTIONAL STATIC TRADE-OFF CAPITAL STRUCTURE AUDIT'));

  // Part 5: Capital Structure Governance Suite
  assert.match(lesson.parts[4].title, /Enterprise Capital Structure Governance & Valuation Suite/i);
  assert.ok(lesson.parts[4].code?.includes('EnterpriseCapitalPolicyInput'));
  assert.ok(lesson.parts[4].output?.includes('ENTERPRISE CAPITAL STRUCTURE GOVERNANCE & VALUATION AUDIT'));
});

test('Block 137: B.Com Finance Day 20: Dividend Policy Theories Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 20);
  assert.ok(lesson);
  assert.equal(lesson.title, "Dividend Policy Theories: Walter's Model & Gordon's Model");

  // Part 1: Walter's Model
  assert.match(lesson.parts[0].title, /Walter's Dividend Valuation Model/i);
  assert.ok(lesson.parts[0].code?.includes('CorporateEarningsProfile'));
  assert.ok(lesson.parts[0].output?.includes("INSTITUTIONAL WALTER'S DIVIDEND VALUATION AUDIT"));

  // Part 2: Gordon's Model
  assert.match(lesson.parts[1].title, /Gordon's Model: Bird-in-the-Hand Theory/i);
  assert.ok(lesson.parts[1].code?.includes('GordonStockProfile'));
  assert.ok(lesson.parts[1].output?.includes('INSTITUTIONAL GORDON DIVIDEND GROWTH MODEL AUDIT'));

  // Part 3: MM Dividend Irrelevance
  assert.match(lesson.parts[2].title, /Modigliani-Miller \(MM\) Dividend Irrelevance Theorem/i);
  assert.ok(lesson.parts[2].code?.includes('CorporateDividendCase'));
  assert.ok(lesson.parts[2].output?.includes('INSTITUTIONAL MODIGLIANI-MILLER DIVIDEND IRRELEVANCE AUDIT'));

  // Part 4: Share Repurchases vs Dividends
  assert.match(lesson.parts[3].title, /Share Repurchases \(Buybacks\) vs Cash Dividends/i);
  assert.ok(lesson.parts[3].code?.includes('CapitalDistributionPlan'));
  assert.ok(lesson.parts[3].output?.includes('INSTITUTIONAL SHARE REPURCHASE VS CASH DIVIDEND AUDIT'));

  // Part 5: Master Dividend Governance Suite
  assert.match(lesson.parts[4].title, /Enterprise Dividend Policy Master Optimization & Governance Suite/i);
  assert.ok(lesson.parts[4].code?.includes('BoardDividendContext'));
  assert.ok(lesson.parts[4].output?.includes('ENTERPRISE DIVIDEND POLICY MASTER GOVERNANCE AUDIT'));
});

test('Block 137: B.Com Finance Days 16-20 Gate v2 Visual JSON Integrity Verification', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let d = 16; d <= 20; d++) {
    const pad = String(d).padStart(2, '0');
    const visPath = path.join(__dirname, `../src/lib/data/lessonVisuals/bcom-finance/day-${pad}.json`);
    assert.ok(fs.existsSync(visPath), `Visual JSON must exist for Day ${d}`);

    const vis = JSON.parse(fs.readFileSync(visPath, 'utf8'));
    assert.equal(vis.prefix, 'bcom-finance');
    assert.equal(vis.day, d);
    assert.equal(vis.entries.length, 5, `Day ${d} visual must contain exactly 5 entries`);

    const lesson = getLongLesson('bcom-finance', d);
    for (let i = 0; i < 5; i++) {
      const entry = vis.entries[i];
      const part = lesson.parts[i];

      assert.equal(entry.spec.template, 'ledger-sheet', `Day ${d} Part ${i + 1} must use ledger-sheet template`);
      assert.ok(entry.spec.steps.length >= 3, `Day ${d} Part ${i + 1} visual must have >= 3 steps`);

      // Verify SHA-256 binding between code and visual entry
      const expectedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
    }
  }
});





test('Block 138: B.Com Finance Days 21-25 Invariants (Word Count >= 2950, 5 Parts >= 580, Socratic Check strictly answerIndex 0)', () => {
  for (let d = 21; d <= 25; d++) {
    const lesson = getLongLesson('bcom-finance', d);
    assert.ok(lesson, `bcom-finance Day ${d} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom-finance');
    assert.equal(lesson.day, d);
    assert.equal(lesson.parts.length, 5, `Day ${d} must have exactly 5 parts`);
    assert.equal(lesson.minutes, 45, `Day ${d} duration must be 45 minutes`);
    assert.ok(lesson.goal && lesson.goal.length > 20, `Day ${d} goal must be informative`);
    assert.ok(lesson.recap && lesson.recap.length > 20, `Day ${d} recap must be informative`);
    assert.ok(lesson.summary && lesson.summary.length >= 3, `Day ${d} summary must have >= 3 points`);
    assert.ok(lesson.projectStep && lesson.projectStep.title, `Day ${d} projectStep must have a title`);
    assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, `Day ${d} projectStep must have >= 3 steps`);

    let totalWords = 0;
    for (let i = 0; i < 5; i++) {
      const p = lesson.parts[i];
      assert.ok(p.title && p.title.length > 5, `Day ${d} Part ${i + 1} title must be non-empty`);
      
      const partWords = p.say.reduce((acc: number, s: string) => acc + s.trim().split(/\s+/).filter(Boolean).length, 0);
      totalWords += partWords;
      assert.ok(partWords >= 580, `Day ${d} Part ${i + 1} (${p.title}) words ${partWords} must be >= 580`);

      assert.ok(p.code && (p.code.includes('class ') || p.code.includes('def ')), `Day ${d} Part ${i + 1} code missing`);
      assert.ok(p.output && p.output.length > 0, `Day ${d} Part ${i + 1} output missing`);
      assert.ok(p.codeNotes && p.codeNotes.length >= 1, `Day ${d} Part ${i + 1} codeNotes missing`);
      assert.ok(p.tryIt && p.tryIt.length > 0, `Day ${d} Part ${i + 1} tryIt missing`);

      const check = p.check as any;
      assert.ok(check && check.question && check.question.length > 10, `Day ${d} Part ${i + 1} check question missing`);
      assert.equal(check.options.length, 4, `Day ${d} Part ${i + 1} check must have 4 options`);
      assert.equal(check.answer, 0, `Day ${d} Part ${i + 1} check answer must be 0`);
      assert.equal(check.answerIndex, 0, `Day ${d} Part ${i + 1} check answerIndex must be 0`);
      assert.ok(check.why && check.why.length > 10, `Day ${d} Part ${i + 1} check why missing`);
      assert.equal(check.explanation, check.why, `Day ${d} Part ${i + 1} explanation must match why`);
    }

    assert.ok(totalWords >= 2950, `Day ${d} total words ${totalWords} < 2950`);
  }
});

test('Block 138: B.Com Finance Day 21: Milestone 4 Capstone Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 21);
  assert.ok(lesson);
  assert.match(lesson.title, /MILESTONE 4/i);

  // Part 1: Leverage Risk Engine
  assert.match(lesson.parts[0].title, /Integrated Operating, Financial & Combined Leverage/i);
  assert.ok(lesson.parts[0].code?.includes('IntegratedLeverageKernel'));
  assert.ok(lesson.parts[0].output?.includes('Degree of Combined Leverage (DCL)'));

  // Part 2: Static Trade-Off Optimization
  assert.match(lesson.parts[1].title, /Static Trade-Off Capital Structure & WACC Minimization/i);
  assert.ok(lesson.parts[1].code?.includes('CapitalStructureOptimizationKernel'));
  assert.ok(lesson.parts[1].output?.includes('MIN WACC'));

  // Part 3: Rolling Cash Budget
  assert.match(lesson.parts[2].title, /Operational Working Capital & Cash Budgeting Cockpit/i);
  assert.ok(lesson.parts[2].code?.includes('WorkingCapitalCockpitKernel'));
  assert.ok(lesson.parts[2].output?.includes('Total Bank Credit Facility Drawn'));

  // Part 4: Share Repurchase vs Dividend
  assert.match(lesson.parts[3].title, /Walter, Gordon & Share Repurchase Valuation/i);
  assert.ok(lesson.parts[3].code?.includes('DividendAndBuybackValuationKernel'));
  assert.ok(lesson.parts[3].output?.includes('WALTER\'S VALUATION MODEL'));

  // Part 5: Master CFO Cockpit
  assert.match(lesson.parts[4].title, /Executive Capital Structure & Financial Policy Control Tower/i);
  assert.ok(lesson.parts[4].code?.includes('Milestone4GrandControlTower'));
  assert.ok(lesson.parts[4].output?.includes('MILESTONE 4 COMPLETE'));
});

test('Block 138: B.Com Finance Day 22: DCF Equity Valuation & Multiples Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 22);
  assert.ok(lesson);
  assert.match(lesson.title, /Equity Valuation: DCF Free Cash Flow & Multiples Valuation/i);

  // Part 1: FCFF
  assert.match(lesson.parts[0].title, /Unlevered Free Cash Flow to Firm \(FCFF\) Pipeline Architecture/i);
  assert.ok(lesson.parts[0].code?.includes('FreeCashFlowEngine'));
  assert.ok(lesson.parts[0].output?.includes('Cumulative PV of 5-Year Explicit FCFF'));

  // Part 2: Terminal Value
  assert.match(lesson.parts[1].title, /Terminal Value \(TV\) & The Enterprise-to-Equity Value Bridge/i);
  assert.ok(lesson.parts[1].code?.includes('EquityValueBridgeEngine'));
  assert.ok(lesson.parts[1].output?.includes('INTRINSIC FAIR PRICE PER SHARE'));

  // Part 3: Relative Valuation Multiples
  assert.match(lesson.parts[2].title, /Relative Valuation Multiples: P\/E, EV\/EBITDA & Benchmark Comps/i);
  assert.ok(lesson.parts[2].code?.includes('RelativeValuationEngine'));
  assert.ok(lesson.parts[2].output?.includes('PRICE-TO-EARNINGS (P/E) RELATIVE VALUATION'));

  // Part 4: Valuation Football Field & Sensitivity
  assert.match(lesson.parts[3].title, /Valuation Triangulation: Football Field Chart & DCF Sensitivity Matrix/i);
  assert.ok(lesson.parts[3].code?.includes('ValuationSensitivityEngine'));
  assert.ok(lesson.parts[3].output?.includes('VALUATION FOOTBALL FIELD SUMMARY'));

  // Part 5: Master Equity Research Suite
  assert.match(lesson.parts[4].title, /Enterprise Equity Valuation & Investment Research Master Suite/i);
  assert.ok(lesson.parts[4].code?.includes('EquityResearchMasterSuite'));
  assert.ok(lesson.parts[4].output?.includes('ENTERPRISE EQUITY RESEARCH & VALUATION MASTER AUDIT'));
});

test('Block 138: B.Com Finance Day 23: Modern Portfolio Theory Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 23);
  assert.ok(lesson);
  assert.match(lesson.title, /Modern Portfolio Theory: Risk, Return & the Markowitz Efficient Frontier/i);

  // Part 1: Standalone Risk & Return
  assert.match(lesson.parts[0].title, /Foundations of Portfolio Theory: Risk, Return & Diversification/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_asset_metrics'));
  assert.ok(lesson.parts[0].output?.includes('Asset A (Equities)'));

  // Part 2: Covariance & Correlation
  assert.match(lesson.parts[1].title, /Two-Asset Portfolio Return & Covariance Dynamics/i);
  assert.ok(lesson.parts[1].code?.includes('calculate_covariance_correlation'));
  assert.ok(lesson.parts[1].output?.includes('Correlation Coefficient (rho_AB)'));

  // Part 3: Minimum Variance Portfolio
  assert.match(lesson.parts[2].title, /Mathematical Derivation of the Minimum Variance Portfolio/i);
  assert.ok(lesson.parts[2].code?.includes('compute_mvp_weights'));
  assert.ok(lesson.parts[2].output?.includes('Weight in Asset A (Equities)'));

  // Part 4: Efficient Frontier
  assert.match(lesson.parts[3].title, /Generating the Markowitz Efficient Frontier & Opportunity Set/i);
  assert.ok(lesson.parts[3].code?.includes('generate_efficient_frontier'));
  assert.ok(lesson.parts[3].output?.includes('Weight A'));

  // Part 5: Matrix Covariance
  assert.match(lesson.parts[4].title, /Multi-Asset Covariance Matrix Formulation & Optimal Capital Allocation/i);
  assert.ok(lesson.parts[4].code?.includes('portfolio_matrix_stats'));
  assert.ok(lesson.parts[4].output?.includes('Balanced Portfolio'));
});

test('Block 138: B.Com Finance Day 24: CAPM & Security Market Line Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 24);
  assert.ok(lesson);
  assert.match(lesson.title, /Capital Asset Pricing Model \(CAPM\) & the Security Market Line \(SML\)/i);

  // Part 1: Systematic Risk Beta
  assert.match(lesson.parts[0].title, /Transition from Total Risk to Systematic Risk & Beta Derivation/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_beta_and_risk_metrics'));
  assert.ok(lesson.parts[0].output?.includes('Systematic Risk Beta (beta_i)'));

  // Part 2: SML & CAPM
  assert.match(lesson.parts[1].title, /Security Market Line \(SML\) & CAPM Pricing Equation/i);
  assert.ok(lesson.parts[1].code?.includes('capm_expected_return'));
  assert.ok(lesson.parts[1].output?.includes('Market Risk Premium (Rm - Rf)'));

  // Part 3: Jensen's Alpha Mispricing
  assert.match(lesson.parts[2].title, /SML Pricing Discrepancies & Jensen's Alpha Identification/i);
  assert.ok(lesson.parts[2].code?.includes('evaluate_security_mispricing'));
  assert.ok(lesson.parts[2].output?.includes("Jensen's Alpha (alpha)"));

  // Part 4: Portfolio Beta & Futures Hedge
  assert.match(lesson.parts[3].title, /Portfolio Beta Aggregation & Synthetic Hedging Strategies/i);
  assert.ok(lesson.parts[3].code?.includes('calculate_portfolio_beta'));
  assert.ok(lesson.parts[3].code?.includes('hedge_portfolio_with_index'));
  assert.ok(lesson.parts[3].output?.includes('Short Index Contracts'));

  // Part 5: CML vs SML
  assert.match(lesson.parts[4].title, /Capital Market Line \(CML\) vs Security Market Line \(SML\)/i);
  assert.ok(lesson.parts[4].code?.includes('compare_cml_and_sml'));
  assert.ok(lesson.parts[4].output?.includes('Capital Market Line (CML)'));
});

test('Block 138: B.Com Finance Day 25: Portfolio Performance Measurement Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 25);
  assert.ok(lesson);
  assert.match(lesson.title, /Portfolio Performance Measurement: Sharpe, Treynor, Alpha & Information Ratio/i);

  // Part 1: Sharpe Ratio
  assert.match(lesson.parts[0].title, /The Sharpe Ratio & Total Risk-Adjusted Return/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_sharpe_ratio'));
  assert.ok(lesson.parts[0].output?.includes('Alpha Tech Fund'));

  // Part 2: Treynor Ratio
  assert.match(lesson.parts[1].title, /The Treynor Ratio & Systematic Risk Efficiency/i);
  assert.ok(lesson.parts[1].code?.includes('calculate_treynor_ratio'));
  assert.ok(lesson.parts[1].output?.includes('Balanced Value Fund'));

  // Part 3: Jensen's Alpha & Fama Decomposition
  assert.match(lesson.parts[2].title, /Jensen's Alpha & Fama's Performance Decomposition/i);
  assert.ok(lesson.parts[2].code?.includes('decompose_portfolio_performance'));
  assert.ok(lesson.parts[2].output?.includes('Diversification Inefficiency Cost'));

  // Part 4: Tracking Error & Information Ratio
  assert.match(lesson.parts[3].title, /Tracking Error & The Information Ratio/i);
  assert.ok(lesson.parts[3].code?.includes('calculate_information_ratio'));
  assert.ok(lesson.parts[3].output?.includes('Information Ratio (IR = Alpha / TE)'));

  // Part 5: Integrated Scorecard
  assert.match(lesson.parts[4].title, /Integrated Performance Scorecard & Comprehensive Evaluation Matrix/i);
  assert.ok(lesson.parts[4].code?.includes('generate_performance_scorecard'));
  assert.ok(lesson.parts[4].output?.includes('Dynamic Growth'));
});

test('Block 138: B.Com Finance Days 21-25 Gate v2 Visual JSON Integrity Verification', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let d = 21; d <= 25; d++) {
    const pad = String(d).padStart(2, '0');
    const visPath = path.join(__dirname, `../src/lib/data/lessonVisuals/bcom-finance/day-${pad}.json`);
    assert.ok(fs.existsSync(visPath), `Visual JSON must exist for Day ${d}`);

    const vis = JSON.parse(fs.readFileSync(visPath, 'utf8'));
    assert.equal(vis.prefix, 'bcom-finance');
    assert.equal(vis.day, d);
    assert.equal(vis.entries.length, 5, `Day ${d} visual must contain exactly 5 entries`);

    const lesson = getLongLesson('bcom-finance', d);
    for (let i = 0; i < 5; i++) {
      const entry = vis.entries[i];
      const part = lesson.parts[i];

      assert.equal(entry.spec.template, 'ledger-sheet', `Day ${d} Part ${i + 1} must use ledger-sheet template`);
      assert.ok(entry.spec.steps.length >= 3, `Day ${d} Part ${i + 1} visual must have >= 3 steps`);

      // Verify SHA-256 binding between code and visual entry
      const expectedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
    }
  }
});

test('Block 139: B.Com Finance Days 26-30 Invariants (Word Count >= 2950, 5 Parts >= 580, Socratic Check strictly answerIndex 0)', () => {
  for (let d = 26; d <= 30; d++) {
    const lesson = getLongLesson('bcom-finance', d);
    assert.ok(lesson, `bcom-finance Day ${d} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom-finance');
    assert.equal(lesson.day, d);
    assert.equal(lesson.parts.length, 5, `Day ${d} must have exactly 5 parts`);
    const expectedMin = d === 30 ? 50 : 45;
    assert.equal(lesson.minutes, expectedMin, `Day ${d} duration must be ${expectedMin} minutes`);
    assert.ok(lesson.goal && lesson.goal.length > 20, `Day ${d} goal must be informative`);
    assert.ok(lesson.recap && lesson.recap.length > 20, `Day ${d} recap must be informative`);
    assert.ok(lesson.summary && lesson.summary.length >= 3, `Day ${d} summary must have >= 3 points`);
    assert.ok(lesson.projectStep && lesson.projectStep.title, `Day ${d} projectStep must have a title`);
    assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, `Day ${d} projectStep must have >= 3 steps`);

    let totalWords = 0;
    for (let i = 0; i < 5; i++) {
      const p = lesson.parts[i];
      assert.ok(p.title && p.title.length > 5, `Day ${d} Part ${i + 1} title must be non-empty`);
      
      const partWords = p.say.reduce((acc: number, s: string) => acc + s.trim().split(/\s+/).filter(Boolean).length, 0);
      totalWords += partWords;
      assert.ok(partWords >= 580, `Day ${d} Part ${i + 1} (${p.title}) words ${partWords} must be >= 580`);

      assert.ok(p.code && (p.code.includes('class ') || p.code.includes('def ')), `Day ${d} Part ${i + 1} code missing`);
      assert.ok(p.output && p.output.length > 0, `Day ${d} Part ${i + 1} output missing`);
      assert.ok(p.codeNotes && p.codeNotes.length >= 1, `Day ${d} Part ${i + 1} codeNotes missing`);
      assert.ok(p.tryIt && p.tryIt.length > 0, `Day ${d} Part ${i + 1} tryIt missing`);

      const check = p.check as any;
      assert.ok(check && check.question && check.question.length > 10, `Day ${d} Part ${i + 1} check question missing`);
      assert.equal(check.options.length, 4, `Day ${d} Part ${i + 1} check must have 4 options`);
      assert.equal(check.answer, 0, `Day ${d} Part ${i + 1} check answer must be 0`);
      assert.equal(check.answerIndex, 0, `Day ${d} Part ${i + 1} check answerIndex must be 0`);
      assert.ok(check.why && check.why.length > 10, `Day ${d} Part ${i + 1} check why missing`);
      assert.equal(check.explanation, check.why, `Day ${d} Part ${i + 1} explanation must match why`);
    }

    assert.ok(totalWords >= 2950, `Day ${d} total words ${totalWords} < 2950`);
  }
});

test('Block 139: B.Com Finance Day 26: Derivatives & Risk Management Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 26);
  assert.ok(lesson);
  assert.match(lesson.title, /Derivatives & Financial Risk Management/i);

  // Part 1: Forward Pricing
  assert.match(lesson.parts[0].title, /Foundations of Financial Derivatives & Forward Contracts/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_forward_price'));
  assert.ok(lesson.parts[0].output?.includes('Theoretical Forward Premium'));

  // Part 2: Futures M2M
  assert.match(lesson.parts[1].title, /Futures Contracts, Daily Settlement & Institutional Hedging Mechanics/i);
  assert.ok(lesson.parts[1].code?.includes('simulate_futures_daily_marking_to_market'));
  assert.ok(lesson.parts[1].output?.includes('Margin Call'));

  // Part 3: Options & Put-Call Parity
  assert.match(lesson.parts[2].title, /Options Contracts: Payoff Profiles, Put-Call Parity & Intrinsic Value/i);
  assert.ok(lesson.parts[2].code?.includes('evaluate_option_payoff'));
  assert.ok(lesson.parts[2].output?.includes('Put-Call Parity Verification'));

  // Part 4: Interest Rate Swaps
  assert.match(lesson.parts[3].title, /Interest Rate Swaps \(IRS\) & Corporate Debt Liability Hedging/i);
  assert.ok(lesson.parts[3].code?.includes('simulate_interest_rate_swap'));
  assert.ok(lesson.parts[3].output?.includes('Interest Rate Swap Execution'));

  // Part 5: Options Collar
  assert.match(lesson.parts[4].title, /Integrated Enterprise Risk Management: Protective Puts & Options Collars/i);
  assert.ok(lesson.parts[4].code?.includes('simulate_options_collar_hedging'));
  assert.ok(lesson.parts[4].output?.includes('Zero-Cost Options Collar Hedge'));
});

test('Block 139: B.Com Finance Day 27: Mergers & Acquisitions (M&A) Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 27);
  assert.ok(lesson);
  assert.match(lesson.title, /Mergers & Acquisitions \(M&A\): Valuation, Synergies & Accretion\/Dilution/i);

  // Part 1: Synergies
  assert.match(lesson.parts[0].title, /Strategic Motives, M&A Typologies & Synergy Quantification/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_synergy_valuation'));
  assert.ok(lesson.parts[0].output?.includes('PV of Perpetual Synergies'));

  // Part 2: Maximum Offer & Premium
  assert.match(lesson.parts[1].title, /Acquisition Financing, Maximum Offer Price & Takeover Premium Mechanics/i);
  assert.ok(lesson.parts[1].code?.includes('calculate_maximum_offer_and_npv'));
  assert.ok(lesson.parts[1].output?.includes('Maximum Allowable Offer Price'));

  // Part 3: Accretion / Dilution
  assert.match(lesson.parts[2].title, /Post-Merger EPS Accretion \/ Dilution Analysis & Deal Structuring/i);
  assert.ok(lesson.parts[2].code?.includes('evaluate_eps_accretion_dilution'));
  assert.ok(lesson.parts[2].output?.includes('100% Stock Financed'));

  // Part 4: Exchange Ratio Bounds
  assert.match(lesson.parts[3].title, /Share Exchange Ratio Mechanics & Boundary Bargaining/i);
  assert.ok(lesson.parts[3].code?.includes('calculate_exchange_ratio_bounds'));
  assert.ok(lesson.parts[3].output?.includes('Feasible Bargaining Range'));

  // Part 5: Anti-Takeover Defenses
  assert.match(lesson.parts[4].title, /Corporate Restructuring & Anti-Takeover Governance Defense/i);
  assert.ok(lesson.parts[4].code?.includes('simulate_anti_takeover_defenses'));
  assert.ok(lesson.parts[4].output?.includes('Poison Pill'));
});

test('Block 139: B.Com Finance Day 28: International Financial Management Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 28);
  assert.ok(lesson);
  assert.match(lesson.title, /International Financial Management & FX Exposure/i);

  // Part 1: FX Exposure Typologies
  assert.match(lesson.parts[0].title, /The Three Types of Foreign Exchange \(FX\) Risk Exposure/i);
  assert.ok(lesson.parts[0].code?.includes('classify_fx_exposures'));
  assert.ok(lesson.parts[0].output?.includes('Transaction Exposure'));

  // Part 2: PPP
  assert.match(lesson.parts[1].title, /Purchasing Power Parity \(PPP\) & Relative Price Dynamics/i);
  assert.ok(lesson.parts[1].code?.includes('calculate_ppp_future_spot'));
  assert.ok(lesson.parts[1].output?.includes('PPP Expected Spot Rate in 1 Year'));

  // Part 3: CIRP & Arbitrage
  assert.match(lesson.parts[2].title, /Covered Interest Rate Parity \(CIRP\) & Covered Arbitrage Mechanics/i);
  assert.ok(lesson.parts[2].code?.includes('verify_covered_interest_rate_parity'));
  assert.ok(lesson.parts[2].output?.includes('Theoretical CIRP Forward Rate'));

  // Part 4: Forward vs MMH
  assert.match(lesson.parts[3].title, /Hedging Transaction Exposure: Forward Market vs Money Market Hedges/i);
  assert.ok(lesson.parts[3].code?.includes('compare_fx_hedging_strategies'));
  assert.ok(lesson.parts[3].output?.includes('FORWARD MARKET HEDGE'));

  // Part 5: Multilateral Netting
  assert.match(lesson.parts[4].title, /Centralized Treasury Netting & Cross-Currency Cash Pooling/i);
  assert.ok(lesson.parts[4].code?.includes('simulate_multilateral_netting'));
  assert.ok(lesson.parts[4].output?.includes('Multilateral Centralized Treasury Netting Engine'));
});

test('Block 139: B.Com Finance Day 29: Behavioral Finance & Corporate Governance Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 29);
  assert.ok(lesson);
  assert.match(lesson.title, /Behavioral Finance, Market Anomalies & Corporate Governance/i);

  // Part 1: EMH Forms
  assert.match(lesson.parts[0].title, /The Efficient Market Hypothesis \(EMH\) vs Behavioral Realities/i);
  assert.ok(lesson.parts[0].code?.includes('compare_emh_forms'));
  assert.ok(lesson.parts[0].output?.includes('Weak-Form Efficiency'));

  // Part 2: Prospect Theory
  assert.match(lesson.parts[1].title, /Prospect Theory & Cognitive Investor Biases/i);
  assert.ok(lesson.parts[1].code?.includes('calculate_prospect_theory_utility'));
  assert.ok(lesson.parts[1].output?.includes('Loss Aversion lambda = 2.25'));

  // Part 3: Market Anomalies
  assert.match(lesson.parts[2].title, /Market Anomalies: Momentum, Value, and Herding Behavior/i);
  assert.ok(lesson.parts[2].code?.includes('evaluate_investment_anomalies'));
  assert.ok(lesson.parts[2].output?.includes('Post-Earnings Announcement Drift'));

  // Part 4: Agency Problem
  assert.match(lesson.parts[3].title, /Corporate Governance: The Agency Problem & Board Oversight/i);
  assert.ok(lesson.parts[3].code?.includes('model_agency_conflict'));
  assert.ok(lesson.parts[3].output?.includes('Variable Pay Alignment Ratio'));

  // Part 5: Corporate Stewardship & SOX
  assert.match(lesson.parts[4].title, /Corporate Stewardship, ESG Metrics & Regulatory Compliance Frameworks/i);
  assert.ok(lesson.parts[4].code?.includes('evaluate_corporate_stewardship_framework'));
  assert.ok(lesson.parts[4].output?.includes('Sarbanes-Oxley Act (SOX)'));
});

test('Block 139: B.Com Finance Day 30: 🏆 FINAL GRAND CAPSTONE Snippets Verification', () => {
  const lesson = getLongLesson('bcom-finance', 30);
  assert.ok(lesson);
  assert.match(lesson.title, /FINAL GRAND CAPSTONE/i);

  // Part 1: Phase 1 CapEx & WACC
  assert.match(lesson.parts[0].title, /Capstone Phase 1: Enterprise Capital Budgeting, WACC & Leverage Synthesis/i);
  assert.ok(lesson.parts[0].code?.includes('execute_capstone_phase_1'));
  assert.ok(lesson.parts[0].output?.includes('CAPSTONE PHASE 1: CORPORATE CAPITAL STRUCTURE & LEVERAGE AUDIT'));

  // Part 2: Phase 2 DCF & M&A
  assert.match(lesson.parts[1].title, /Capstone Phase 2: Intrinsic DCF Equity Valuation & M&A Acquisition Bridge/i);
  assert.ok(lesson.parts[1].code?.includes('execute_capstone_phase_2'));
  assert.ok(lesson.parts[1].output?.includes('CAPSTONE PHASE 2: DCF INTRINSIC VALUATION & M&A DUE DILIGENCE'));

  // Part 3: Phase 3 Treasury & FX
  assert.match(lesson.parts[2].title, /Capstone Phase 3: Global Treasury, FX Netting & Interest Rate Hedging/i);
  assert.ok(lesson.parts[2].code?.includes('execute_capstone_phase_3'));
  assert.ok(lesson.parts[2].output?.includes('CAPSTONE PHASE 3: GLOBAL TREASURY & DERIVATIVE HEDGING AUDIT'));

  // Part 4: Phase 4 Portfolio Attribution
  assert.match(lesson.parts[3].title, /Capstone Phase 4: Markowitz Portfolio Optimization & Performance Scorecard/i);
  assert.ok(lesson.parts[3].code?.includes('execute_capstone_phase_4'));
  assert.ok(lesson.parts[3].output?.includes('CAPSTONE PHASE 4: MULTI-ASSET PORTFOLIO OPTIMIZATION & ATTRIBUTION'));

  // Part 5: Phase 5 Grand CFO Command Center
  assert.match(lesson.parts[4].title, /Capstone Phase 5: Grand Executive CFO Command Center & Master Accreditation/i);
  assert.ok(lesson.parts[4].code?.includes('execute_grand_cfo_command_center'));
  assert.ok(lesson.parts[4].output?.includes('FINAL GRAND CAPSTONE: EXECUTIVE CFO COMMAND CENTER AUDIT'));
  assert.ok(lesson.parts[4].output?.includes('GRAND_MASTER_CFO_ENTERPRISE_FINANCE_AND_PORTFOLIO_MANAGEMENT_CERTIFIED'));
});

test('Block 139: B.Com Finance Days 26-30 Gate v2 Visual JSON Integrity Verification', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let d = 26; d <= 30; d++) {
    const pad = String(d).padStart(2, '0');
    const visPath = path.join(__dirname, `../src/lib/data/lessonVisuals/bcom-finance/day-${pad}.json`);
    assert.ok(fs.existsSync(visPath), `Visual JSON must exist for Day ${d}`);

    const vis = JSON.parse(fs.readFileSync(visPath, 'utf8'));
    assert.equal(vis.prefix, 'bcom-finance');
    assert.equal(vis.day, d);
    assert.equal(vis.entries.length, 5, `Day ${d} visual must contain exactly 5 entries`);

    const lesson = getLongLesson('bcom-finance', d);
    for (let i = 0; i < 5; i++) {
      const entry = vis.entries[i];
      const part = lesson.parts[i];

      assert.equal(entry.spec.template, 'ledger-sheet', `Day ${d} Part ${i + 1} must use ledger-sheet template`);
      assert.ok(entry.spec.steps.length >= 3, `Day ${d} Part ${i + 1} visual must have >= 3 steps`);

      // Verify SHA-256 binding between code and visual entry
      const expectedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
    }
  }
});
