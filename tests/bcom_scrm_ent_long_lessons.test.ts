import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';
import { BCOM_SCRM_LONG_LESSONS } from '../src/lib/data/bcomScrmLongLessons';
import { BCOM_ENT_LONG_LESSONS } from '../src/lib/data/bcomEntLongLessons';

test('B.Com SCRM & Entrepreneurship Long Lessons: Resolution & Language Invariants', () => {
  // SCRM (Sales, Customer Success & CRM)
  const scrmLesson = getLongLesson('bcom_scrm', 1);
  assert.ok(scrmLesson, 'bcom_scrm Day 1 lesson must be defined');
  assert.equal(scrmLesson.coursePrefix, 'bcom_scrm');
  assert.equal(scrmLesson.day, 1);
  assert.equal(scrmLesson.parts.length, 5, 'bcom_scrm Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_scrm'), 'python', 'bcom_scrm must use Python language runner');

  // Entrepreneurship & Venture Capital
  const entLesson = getLongLesson('bcom_ent', 1);
  assert.ok(entLesson, 'bcom_ent Day 1 lesson must be defined');
  assert.equal(entLesson.coursePrefix, 'bcom_ent');
  assert.equal(entLesson.day, 1);
  assert.equal(entLesson.parts.length, 5, 'bcom_ent Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ent'), 'python', 'bcom_ent must use Python language runner');
});

test('B.Com SCRM Day 1: Pipeline Velocity, LTV/CAC & NRR Python Snippets Verification', () => {
  const lesson = BCOM_SCRM_LONG_LESSONS[0];
  assert.equal(lesson.parts.length, 5);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('def ') || part.code?.includes('class '), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('CRMOpportunity'));
  assert.ok(lesson.parts[1].code?.includes('UnitEconomicsEngine'));
  assert.ok(lesson.parts[2].code?.includes('CohortRetentionEngine'));
  assert.ok(lesson.parts[3].code?.includes('CustomerHealthScorer'));
  assert.ok(lesson.parts[4].code?.includes('NetPromoterScoreEngine'));
});

test('B.Com SCRM Day 2: MEDDPICC Deal Qualification, Territory Gini & CPQ Guardrails Snippets Verification', () => {
  const lesson2 = BCOM_SCRM_LONG_LESSONS[1];
  assert.ok(lesson2, 'bcom_scrm Day 2 lesson must be defined');
  assert.equal(lesson2.coursePrefix, 'bcom_scrm');
  assert.equal(lesson2.day, 2);
  assert.equal(lesson2.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson2);
  const totalMin = estimateLessonMinutes(lesson2);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson2.parts.length; i++) {
    const part = lesson2.parts[i];
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
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.ok(lesson2.parts[0].code?.includes('MeddpiccScorecard'));
  assert.ok(lesson2.parts[0].code?.includes('score_meddpicc_deal'));
  assert.ok(lesson2.parts[1].code?.includes('calculate_territory_gini'));
  assert.ok(lesson2.parts[2].code?.includes('CpqDiscountEngine'));
  assert.ok(lesson2.parts[3].code?.includes('calculate_rep_commission_waterfall'));
  assert.ok(lesson2.parts[4].code?.includes('score_account_renewal_flight_risk'));
});


test('B.Com Entrepreneurship Day 1: Lean Validation, Runway Physics & SAFE Cap Table Snippets Verification', () => {
  const lesson = BCOM_ENT_LONG_LESSONS[0];
  assert.equal(lesson.parts.length, 5);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('LeanValidationEngine'));
  assert.ok(lesson.parts[1].code?.includes('StartupRunwaySimulator'));
  assert.ok(lesson.parts[2].code?.includes('SafeNoteInvestment'));
  assert.ok(lesson.parts[3].code?.includes('CapTableDilutionModel'));
  assert.ok(lesson.parts[4].code?.includes('LiquidationWaterfall'));
});

test('B.Com Entrepreneurship Day 2: Venture Debt, 409A Valuation & Anti-Dilution Snippets Verification', () => {
  const lesson2 = BCOM_ENT_LONG_LESSONS[1];
  assert.ok(lesson2, 'bcom_ent Day 2 lesson must be defined');
  assert.equal(lesson2.coursePrefix, 'bcom_ent');
  assert.equal(lesson2.day, 2);
  assert.equal(lesson2.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson2);
  const totalMin = estimateLessonMinutes(lesson2);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson2.parts.length; i++) {
    const part = lesson2.parts[i];
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
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.ok(lesson2.parts[0].code?.includes('calculate_venture_debt_structure'));
  assert.ok(lesson2.parts[1].code?.includes('calculate_section_409a_valuation'));
  assert.ok(lesson2.parts[2].code?.includes('SecondaryShareTransactionRouter'));
  assert.ok(lesson2.parts[3].code?.includes('calculate_anti_dilution_adjustment'));
  assert.ok(lesson2.parts[4].code?.includes('calculate_founder_vesting_and_acceleration'));
});

test('Block 130: B.Com SCRM Day 3: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_scrm', 3);
  assert.ok(lesson, 'bcom_scrm Day 3 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_scrm');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5, 'bcom_scrm Day 3 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_scrm'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 130: B.Com SCRM Day 3: Pipeline Velocity, Lead Scoring, Multi-Touch Attribution & Capacity Planning Verification', () => {
  const lesson = BCOM_SCRM_LONG_LESSONS[2];
  assert.ok(lesson, 'BCOM_SCRM_LONG_LESSONS[2] must exist');
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
  assert.match(lesson.parts[0].title, /Pipeline Velocity.*Conversion/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_sales_pipeline_velocity'));
  assert.match(lesson.parts[1].title, /Predictive Lead Scoring/i);
  assert.ok(lesson.parts[1].code?.includes('score_predictive_leads_and_tier'));
  assert.match(lesson.parts[2].title, /Multi-Touch.*Attribution/i);
  assert.ok(lesson.parts[2].code?.includes('model_multi_touch_revenue_attribution'));
  assert.match(lesson.parts[3].title, /Sales Capacity.*Quota Ramp/i);
  assert.ok(lesson.parts[3].code?.includes('plan_sales_capacity_and_quota_ramp'));
  assert.match(lesson.parts[4].title, /Sales Operations Control Tower/i);
  assert.ok(lesson.parts[4].code?.includes('run_enterprise_sales_operations_engine'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 131: B.Com SCRM Day 4: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_scrm', 4);
  assert.ok(lesson, 'bcom_scrm Day 4 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_scrm');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5, 'bcom_scrm Day 4 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_scrm'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 131: B.Com SCRM Day 4: ABM Penetration, NRR Expansion, Churn Hazard & CPQ Deal Desk Verification', () => {
  const lesson = BCOM_SCRM_LONG_LESSONS[3];
  assert.ok(lesson, 'BCOM_SCRM_LONG_LESSONS[3] must exist');
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
  assert.match(lesson.parts[0].title, /Account-Based Marketing.*Buying Center/i);
  assert.ok(lesson.parts[0].code?.includes('map_abm_tiering_and_buying_center'));
  assert.match(lesson.parts[1].title, /Net Revenue Retention.*NRR/i);
  assert.ok(lesson.parts[1].code?.includes('calculate_nrr_and_grr_retention'));
  assert.match(lesson.parts[2].title, /Customer Health.*Churn Hazard/i);
  assert.ok(lesson.parts[2].code?.includes('model_churn_hazard_and_early_warning'));
  assert.match(lesson.parts[3].title, /Deal Desk CPQ.*Discount/i);
  assert.ok(lesson.parts[3].code?.includes('evaluate_deal_desk_cpq_discount_matrix'));
  assert.match(lesson.parts[4].title, /Retention Architecture/i);
  assert.ok(lesson.parts[4].code?.includes('run_enterprise_abm_and_retention_suite'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 132: B.Com SCRM Day 5 Capstone: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_scrm', 5);
  assert.ok(lesson, 'bcom_scrm Day 5 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_scrm');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5, 'bcom_scrm Day 5 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_scrm'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 132: B.Com SCRM Day 5 Capstone: CRO Flywheel, CAC Payback, CS Tiering, Accelerators & CRO Accreditation Verification', () => {
  const lesson = BCOM_SCRM_LONG_LESSONS[4];
  assert.ok(lesson, 'BCOM_SCRM_LONG_LESSONS[4] must exist');
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
  assert.match(lesson.parts[0].title, /Unified CRO Growth Flywheel/i);
  assert.ok(lesson.parts[0].code?.includes('model_cro_unified_revenue_flywheel'));
  assert.match(lesson.parts[1].title, /CAC.*Payback Period/i);
  assert.ok(lesson.parts[1].code?.includes('calculate_multi_segment_cac_payback'));
  assert.match(lesson.parts[2].title, /Customer Success.*NRR Hedging/i);
  assert.ok(lesson.parts[2].code?.includes('hedge_enterprise_portfolio_nrr'));
  assert.match(lesson.parts[3].title, /Sales Compensation.*Accelerators/i);
  assert.ok(lesson.parts[3].code?.includes('model_sales_compensation_accelerators'));
  assert.match(lesson.parts[4].title, /CRO Boardroom.*Accreditation/i);
  assert.ok(lesson.parts[4].code?.includes('generate_cro_boardroom_revenue_dossier_and_accreditation'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});




