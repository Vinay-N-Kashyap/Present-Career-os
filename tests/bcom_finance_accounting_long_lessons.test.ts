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






