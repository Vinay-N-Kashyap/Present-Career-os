import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
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

test('Block 133: B.Com Entrepreneurship Day 3: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_ent', 3);
  assert.ok(lesson, 'bcom_ent Day 3 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_ent');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5, 'bcom_ent Day 3 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ent'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 133: B.Com Entrepreneurship Day 3: Option Pool, Liquidation Preference, Anti-Dilution & NVCA Governance Verification', () => {
  const lesson = BCOM_ENT_LONG_LESSONS[2];
  assert.ok(lesson, 'BCOM_ENT_LONG_LESSONS[2] must exist');
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
  assert.match(lesson.parts[0].title, /Option Pool Shuffle/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_option_pool_shuffle'));
  assert.match(lesson.parts[1].title, /Liquidation Preference/i);
  assert.ok(lesson.parts[1].code?.includes('evaluate_liquidation_preference_structures'));
  assert.match(lesson.parts[2].title, /Down-Round.*Anti-Dilution/i);
  assert.ok(lesson.parts[2].code?.includes('calculate_down_round_anti_dilution'));
  assert.match(lesson.parts[3].title, /Corporate Governance.*Protective Provisions/i);
  assert.ok(lesson.parts[3].code?.includes('audit_nvca_governance_scorecard'));
  assert.match(lesson.parts[4].title, /Term Sheet.*Control Tower/i);
  assert.ok(lesson.parts[4].code?.includes('run_venture_capital_term_sheet_suite'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 134: B.Com Entrepreneurship Day 4: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_ent', 4);
  assert.ok(lesson, 'bcom_ent Day 4 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_ent');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5, 'bcom_ent Day 4 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ent'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 134: B.Com Entrepreneurship Day 4: Rule of 40, Burn Multiple, LTV/CAC & Series B Model Verification', () => {
  const lesson = BCOM_ENT_LONG_LESSONS[3];
  assert.ok(lesson, 'BCOM_ENT_LONG_LESSONS[3] must exist');
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
  assert.match(lesson.parts[0].title, /Rule of 40.*Magic Number/i);
  assert.ok(lesson.parts[0].code?.includes('evaluate_rule_of_40_and_magic_number'));
  assert.match(lesson.parts[1].title, /Burn Multiple.*Runway/i);
  assert.ok(lesson.parts[1].code?.includes('calculate_burn_multiple_and_runway'));
  assert.match(lesson.parts[2].title, /Cohort.*LTV.*CAC|LTV.*CAC.*Cohort/i);
  assert.ok(lesson.parts[2].code?.includes('model_ltv_cac_and_cohort_contribution'));
  assert.match(lesson.parts[3].title, /Series B.*Financial Model/i);
  assert.ok(lesson.parts[3].code?.includes('build_series_b_financial_model'));
  assert.match(lesson.parts[4].title, /Growth Stage Venture Economics/i);
  assert.ok(lesson.parts[4].code?.includes('run_venture_economics_control_tower'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 135: B.Com Entrepreneurship Day 5 Capstone: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_ent', 5);
  assert.ok(lesson, 'bcom_ent Day 5 Capstone lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_ent');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5, 'bcom_ent Day 5 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ent'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 135: B.Com Entrepreneurship Day 5 Capstone: Investment Memo, Syndicate, Board Governance, Capital Allocation & VCP-CEE Accreditation Verification', () => {
  const lesson = BCOM_ENT_LONG_LESSONS[4];
  assert.ok(lesson, 'BCOM_ENT_LONG_LESSONS[4] must exist');
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
  assert.match(lesson.parts[0].title, /Investment Memo.*Due Diligence/i);
  assert.ok(lesson.parts[0].code?.includes('model_series_b_investment_memo'));
  assert.match(lesson.parts[1].title, /Syndicate Allocation.*Pro-Rata/i);
  assert.ok(lesson.parts[1].code?.includes('structure_series_b_syndicate_and_prorata'));
  assert.match(lesson.parts[2].title, /Boardroom Corporate Governance.*Protective Covenants/i);
  assert.ok(lesson.parts[2].code?.includes('audit_boardroom_governance_and_covenants'));
  assert.match(lesson.parts[3].title, /Growth Capital Allocation.*Solvency Runway/i);
  assert.ok(lesson.parts[3].code?.includes('allocate_growth_capital_and_stress_runway'));
  assert.match(lesson.parts[4].title, /Pitch Defense.*Venture Partner Accreditation/i);
  assert.ok(lesson.parts[4].code?.includes('generate_venture_partner_dossier_and_accreditation'));

  // Capstone Accreditation Assertions
  assert.ok(lesson.parts[4].output?.includes('VCP-CEE'), 'Must confer VCP-CEE accreditation');
  assert.ok(lesson.parts[4].output?.includes('TIER_1_SERIES_B_APPROVED'), 'Must achieve Tier-1 Series B approval');
  assert.ok(lesson.parts[4].output?.includes('NVCA COMPLIANT 2-2-1 GOVERNANCE'), 'Must verify 2-2-1 board governance');

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Course bcom_ent 100% Complete: All 5 Days Verified', () => {
  for (let day = 1; day <= 5; day++) {
    const lesson = getLongLesson('bcom_ent', day);
    assert.ok(lesson, `bcom_ent Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_ent Day ${day} must have 5 parts`);
  }
});

test('B.Com SCRM Milestone 2 (Days 6-10): Invariants, Spoken Word Counts & Day 10 Minutes Verification', () => {
  for (let day = 6; day <= 10; day++) {
    const lesson = getLongLesson('bcom_scrm', day);
    assert.ok(lesson, `bcom_scrm Day ${day} must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom_scrm');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);

    if (day === 10) {
      assert.equal(lesson.minutes, 50, 'Day 10 Capstone minutes must be exactly 50');
    } else {
      assert.equal(lesson.minutes, 45, `Day ${day} minutes must be 45`);
    }

    let totalWords = 0;
    for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
      const part = lesson.parts[pIdx];
      assert.ok(part.title.length > 0, `Day ${day} Part ${pIdx + 1} title must be non-empty`);
      assert.ok(part.say.length >= 3, `Day ${day} Part ${pIdx + 1} say array must have >= 3 paragraphs`);

      const partWords = part.say.join(' ').trim().split(/\s+/).length;
      totalWords += partWords;
      assert.ok(
        partWords >= 580,
        `Day ${day} Part ${pIdx + 1} word count (${partWords}) must be >= 580 words`
      );

      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${pIdx + 1} must have a real-world example`);
      assert.ok(
        part.code && (part.code.includes('def ') || part.code.includes('class ')),
        `Day ${day} Part ${pIdx + 1} code must contain Python functions/classes`
      );
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${pIdx + 1} must have deterministic expected output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${pIdx + 1} must have a tryIt experiment`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${pIdx + 1} must have >= 3 codeNotes`);

      // Socratic Check validation
      const check = part.check as any;
      assert.ok(check.question && check.question.length > 0, `Day ${day} Part ${pIdx + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${pIdx + 1} check must have exactly 4 options`);
      assert.equal(typeof check.answer, 'number', `Day ${day} Part ${pIdx + 1} answer must be a number`);
      assert.ok(check.answer >= 0 && check.answer < 4, `Day ${day} Part ${pIdx + 1} answer must be in [0..3]`);
      assert.ok(check.why && check.why.length > 0, `Day ${day} Part ${pIdx + 1} check why explanation must be non-empty`);
      assert.equal(check.answerIndex, check.answer);
      assert.equal(check.explanation, check.why);
    }

    assert.ok(
      totalWords >= 2950,
      `Day ${day} total spoken words (${totalWords}) must be >= 2,950 words`
    );

    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${day} summary must have >= 4 bullet points`);
    assert.ok(
      lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4,
      `Day ${day} projectStep must have a title and >= 4 steps`
    );

    const spokenMinutes = estimateSpokenMinutes(lesson);
    assert.ok(
      spokenMinutes >= 19.0,
      `Day ${day} spoken minutes (${spokenMinutes}) must be >= 19.0`
    );
  }
});

test('B.Com SCRM Milestone 2 (Days 6-10): Domain Specifics & Mathematical Functions Verification', () => {
  // Day 6: Inbound Speed-to-Lead, Scoring & SLAs
  const d6 = getLongLesson('bcom_scrm', 6)!;
  assert.ok(d6.parts[0].code?.includes('calculate_inbound_lead_decay_and_qualification'));
  assert.ok(d6.parts[1].code?.includes('evaluate_two_tier_lead_score'));
  assert.ok(d6.parts[2].code?.includes('route_inbound_lead'));
  assert.ok(d6.parts[3].code?.includes('audit_marketing_sales_sla_compliance'));
  assert.ok(d6.parts[4].code?.includes('audit_inbound_pipeline_and_sla'));
  assert.ok(d6.parts[4].code?.includes('MasterInboundRevOpsOrchestrator'));
  assert.ok(d6.parts[4].output?.includes('INBOUND_SLA_REVENUE_PIPELINE_CERTIFIED_NOMINAL'));

  // Day 7: Outbound Cadences, Deliverability & Cold Calling
  const d7 = getLongLesson('bcom_scrm', 7)!;
  assert.ok(d7.parts[0].code?.includes('simulate_outbound_cadence_performance'));
  assert.ok(d7.parts[1].code?.includes('audit_email_deliverability_infrastructure'));
  assert.ok(d7.parts[2].code?.includes('score_cold_email_copy'));
  assert.ok(d7.parts[3].code?.includes('simulate_cold_call_conversion_funnel'));
  assert.ok(d7.parts[4].code?.includes('audit_outbound_prospecting_engine'));
  assert.ok(d7.parts[4].code?.includes('MasterOutboundSdrOrchestrator'));
  assert.ok(d7.parts[4].output?.includes('OUTBOUND_CADENCE_ENGINE_CERTIFIED_NOMINAL'));

  // Day 8: SPICED Discovery, NBI & Critical Events
  const d8 = getLongLesson('bcom_scrm', 8)!;
  assert.ok(d8.parts[0].code?.includes('score_discovery_agenda_and_contract'));
  assert.ok(d8.parts[1].code?.includes('score_spiced_pain_diagnosis'));
  assert.ok(d8.parts[2].code?.includes('quantify_negative_business_impact'));
  assert.ok(d8.parts[3].code?.includes('evaluate_critical_event_timeline'));
  assert.ok(d8.parts[4].code?.includes('audit_discovery_mastery_and_qualification'));
  assert.ok(d8.parts[4].code?.includes('MasterDiscoveryOperationsOrchestrator'));
  assert.ok(d8.parts[4].output?.includes('SPICED_DISCOVERY_CERTIFIED_NOMINAL'));

  // Day 9: Tell-Show-Tell Demos, POC Charters & LAER Objections
  const d9 = getLongLesson('bcom_scrm', 9)!;
  assert.ok(d9.parts[0].code?.includes('score_tailored_demo_execution'));
  assert.ok(d9.parts[1].code?.includes('audit_poc_success_charter_criteria'));
  assert.ok(d9.parts[2].code?.includes('evaluate_competitive_depositioning'));
  assert.ok(d9.parts[3].code?.includes('resolve_laer_objection_framework'));
  assert.ok(d9.parts[4].code?.includes('audit_poc_and_demo_governance'));
  assert.ok(d9.parts[4].code?.includes('MasterDemoAndPocOrchestrator'));
  assert.ok(d9.parts[4].output?.includes('DEMO_AND_POC_GOVERNANCE_CERTIFIED_NOMINAL'));

  // Day 10: Milestone 2 Capstone: Pipeline Velocity Control Tower & CESDDS
  const d10 = getLongLesson('bcom_scrm', 10)!;
  assert.ok(d10.parts[0].code?.includes('calculate_sales_pipeline_velocity'));
  assert.ok(d10.parts[1].code?.includes('audit_stage_by_stage_conversion_funnel'));
  assert.ok(d10.parts[2].code?.includes('audit_rep_quota_capacity_attainment'));
  assert.ok(d10.parts[3].code?.includes('orchestrate_deal_velocity_suite'));
  assert.ok(d10.parts[4].code?.includes('audit_deal_velocity_master_cert'));
  assert.ok(d10.parts[4].code?.includes('MasterDealVelocityVerificationEngine'));
  assert.ok(d10.parts[4].output?.includes('CESDDS_CREDENTIAL_CERTIFIED_NOMINAL'));
  assert.ok(d10.parts[4].output?.includes('Certified Enterprise Sales Development & Deal Strategist'));
});

test('B.Com SCRM Milestone 2 (Days 6-10): Gate v2 Funnel Visuals & Cryptographic SHA-256 Bindings Verification', () => {
  const visualsDir = path.resolve(__dirname, '../src/lib/data/lessonVisuals/bcom_scrm');
  
  for (let day = 6; day <= 10; day++) {
    const fileName = `day-${day.toString().padStart(2, '0')}.json`;
    const filePath = path.join(visualsDir, fileName);
    assert.ok(fs.existsSync(filePath), `Visual file ${fileName} must exist on disk`);

    const raw = fs.readFileSync(filePath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, 1);
    assert.equal(visual.prefix, 'bcom_scrm');
    assert.equal(visual.day, day);
    assert.ok(visual.promptSha && visual.promptSha.length === 64, 'promptSha must be valid 64-char sha256');
    assert.equal(visual.entries.length, 5, `Visual ${fileName} must have exactly 5 entries`);

    const lesson = getLongLesson('bcom_scrm', day)!;
    for (let eIdx = 0; eIdx < visual.entries.length; eIdx++) {
      const entry = visual.entries[eIdx];
      const part = lesson.parts[eIdx];

      assert.equal(entry.partTitle, part.title, `Entry ${eIdx} partTitle must match lesson part title`);

      // Verify cryptographic SHA-256 code hash binding
      const expectedHash = crypto.createHash('sha256').update(part.code.trim()).digest('hex');
      assert.equal(
        entry.codeHash,
        expectedHash,
        `Day ${day} Part ${eIdx + 1} codeHash must strictly match SHA-256 of part.code.trim()`
      );

      // Verify Funnel template structure
      assert.equal(entry.spec.template, 'funnel', 'Visual template must be funnel');
      assert.equal(entry.spec.steps.length, 4, 'Visual spec must have exactly 4 steps');
      const stepAts = entry.spec.steps.map((s: any) => s.at);
      assert.deepEqual(stepAts, ['intro', 'say1', 'example', 'tryIt'], 'Steps must match [intro, say1, example, tryIt]');

      for (const step of entry.spec.steps) {
        assert.ok(step.caption.length > 0, 'Step caption must be non-empty');
        assert.ok(['top', 'qual', 'target', 'final'].includes(step.activeStageId));
        assert.equal(step.stages.length, 4, 'Funnel must have 4 stages');
      }

      assert.deepEqual(entry.filled, entry.spec, 'filled must match spec');
    }
  }
});

test('B.Com SCRM Milestone 3 (Days 11-15): Invariants & Spoken Time Floor Verification', () => {
  for (let day = 11; day <= 15; day++) {
    const lesson = getLongLesson('bcom_scrm', day);
    assert.ok(lesson, `bcom_scrm Day ${day} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom_scrm');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);

    // Day 15 Capstone minutes = 50, Days 11-14 minutes = 45
    if (day === 15) {
      assert.equal(lesson.minutes, 50, 'Day 15 Capstone minutes must be 50');
    } else {
      assert.equal(lesson.minutes, 45, `Day ${day} minutes must be 45`);
    }

    const spokenMin = estimateSpokenMinutes(lesson);
    assert.ok(
      spokenMin >= 19.5,
      `Day ${day} spoken minutes must be >= 19.5 min for ~2,950 words floor (got ${spokenMin.toFixed(2)} min)`
    );

    for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
      const part = lesson.parts[pIdx];
      assert.ok(part.title.length > 0, `Day ${day} Part ${pIdx + 1} must have a non-empty title`);
      assert.ok(part.say.length >= 3, `Day ${day} Part ${pIdx + 1} must have >= 3 paragraphs`);
      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${pIdx + 1} must have an example`);
      assert.ok(
        part.code && (part.code.includes('def ') || part.code.includes('class ')),
        `Day ${day} Part ${pIdx + 1} code must contain Python functions/classes`
      );
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${pIdx + 1} must have expected output`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${pIdx + 1} must have >= 3 codeNotes`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${pIdx + 1} must have tryIt experiment`);

      const check = part.check as any;
      assert.ok(check.question.length > 0, `Day ${day} Part ${pIdx + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${pIdx + 1} check options must be exactly 4`);
      assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Day ${day} Part ${pIdx + 1} answerIndex must be valid`);
      assert.ok(check.explanation.length > 0, `Day ${day} Part ${pIdx + 1} explanation must be non-empty`);
    }
  }
});

test('B.Com SCRM Milestone 3 (Days 11-15): Python Domain Code & Accreditation Verification', () => {
  // Day 11: Customer Health Scoring & CHS
  const d11 = getLongLesson('bcom_scrm', 11)!;
  assert.ok(d11.parts[0].code?.includes('score_multidimensional_telemetry'));
  assert.ok(d11.parts[1].code?.includes('analyze_support_ticket_sentiment_and_velocity'));
  assert.ok(d11.parts[4].code?.includes('MasterCustomerHealthScoreEngine'));
  assert.ok(d11.parts[4].output?.includes('CUSTOMER_HEALTH_SCORING_CERTIFIED_NOMINAL'));

  // Day 12: Customer Retention & NRR >= 120%
  const d12 = getLongLesson('bcom_scrm', 12)!;
  assert.ok(d12.parts[0].code?.includes('calculate_grr_and_nrr_metrics'));
  assert.ok(d12.parts[1].code?.includes('model_cohort_retention_waterfall'));
  assert.ok(d12.parts[4].code?.includes('MasterNetRevenueRetentionEngine'));
  assert.ok(d12.parts[4].output?.includes('NET_REVENUE_RETENTION_CERTIFIED_NOMINAL'));

  // Day 13: Voice of Customer NPS, CSAT & CES
  const d13 = getLongLesson('bcom_scrm', 13)!;
  assert.ok(d13.parts[0].code?.includes('triangulate_voc_sentiment_metrics'));
  assert.ok(d13.parts[1].code?.includes('calculate_nps_and_statistical_confidence'));
  assert.ok(d13.parts[4].code?.includes('MasterVoiceOfCustomerEngine'));
  assert.ok(d13.parts[4].output?.includes('VOICE_OF_CUSTOMER_CERTIFIED_NOMINAL'));

  // Day 14: CS Ops & Portfolio Capacity
  const d14 = getLongLesson('bcom_scrm', 14)!;
  assert.ok(d14.parts[0].code?.includes('audit_cs_ops_tech_stack_maturity'));
  assert.ok(d14.parts[1].code?.includes('model_csm_portfolio_capacity_and_headcount'));
  assert.ok(d14.parts[2].code?.includes('analyze_account_whitespace_and_cross_sell'));
  assert.ok(d14.parts[3].code?.includes('audit_joint_success_plan_and_qbr_cadence'));
  assert.ok(d14.parts[4].code?.includes('MasterCustomerSuccessOperationsEngine'));
  assert.ok(d14.parts[4].output?.includes('CUSTOMER_SUCCESS_OPERATIONS_CERTIFIED_NOMINAL'));

  // Day 15: Milestone 3 Grand Capstone & CESRD Credential
  const d15 = getLongLesson('bcom_scrm', 15)!;
  assert.ok(d15.parts[0].code?.includes('audit_milestone3_cs_architecture'));
  assert.ok(d15.parts[1].code?.includes('simulate_enterprise_customer_portfolio_dynamics'));
  assert.ok(d15.parts[2].code?.includes('execute_crisis_account_churn_rescue_protocol'));
  assert.ok(d15.parts[3].code?.includes('evaluate_boardroom_retention_and_valuation_impact'));
  assert.ok(d15.parts[4].code?.includes('MasterEnterpriseCustomerSuccessOperatingEngine'));
  assert.ok(d15.parts[4].output?.includes('CESRD_CREDENTIAL_CERTIFIED_NOMINAL'));
  assert.ok(d15.parts[4].output?.includes('Certified Enterprise Customer Success & Retention Director'));
});

test('B.Com SCRM Milestone 3 (Days 11-15): Gate v2 Funnel Visuals & Cryptographic SHA-256 Bindings Verification', () => {
  const visualsDir = path.resolve(__dirname, '../src/lib/data/lessonVisuals/bcom_scrm');
  
  for (let day = 11; day <= 15; day++) {
    const fileName = `day-${day.toString().padStart(2, '0')}.json`;
    const filePath = path.join(visualsDir, fileName);
    assert.ok(fs.existsSync(filePath), `Visual file ${fileName} must exist on disk`);

    const raw = fs.readFileSync(filePath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, 1);
    assert.equal(visual.prefix, 'bcom_scrm');
    assert.equal(visual.day, day);
    assert.ok(visual.promptSha && visual.promptSha.length === 64, 'promptSha must be valid 64-char sha256');
    assert.equal(visual.entries.length, 5, `Visual ${fileName} must have exactly 5 entries`);

    const lesson = getLongLesson('bcom_scrm', day)!;
    for (let eIdx = 0; eIdx < visual.entries.length; eIdx++) {
      const entry = visual.entries[eIdx];
      const part = lesson.parts[eIdx];

      assert.equal(entry.partTitle, part.title, `Entry ${eIdx} partTitle must match lesson part title`);

      // Verify cryptographic SHA-256 code hash binding
      const expectedHash = crypto.createHash('sha256').update(part.code.trim()).digest('hex');
      assert.equal(
        entry.codeHash,
        expectedHash,
        `Day ${day} Part ${eIdx + 1} codeHash must strictly match SHA-256 of part.code.trim()`
      );

      // Verify Funnel template structure
      assert.equal(entry.spec.template, 'funnel', 'Visual template must be funnel');
      assert.equal(entry.spec.steps.length, 4, 'Visual spec must have exactly 4 steps');
      const stepAts = entry.spec.steps.map((s: any) => s.at);
      assert.deepEqual(stepAts, ['intro', 'say1', 'example', 'tryIt'], 'Steps must match [intro, say1, example, tryIt]');

      for (const step of entry.spec.steps) {
        assert.ok(step.caption.length > 0, 'Step caption must be non-empty');
        assert.ok(['top', 'qual', 'target', 'final'].includes(step.activeStageId));
        assert.equal(step.stages.length, 4, 'Funnel must have 4 stages');
      }

      assert.deepEqual(entry.filled, entry.spec, 'filled must match spec');
    }
  }
});

test('B.Com SCRM Milestone 4 (Days 16-20): Invariants & Spoken Time Floor Verification', () => {
  for (let day = 16; day <= 20; day++) {
    const lesson = getLongLesson('bcom_scrm', day);
    assert.ok(lesson, `bcom_scrm Day ${day} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom_scrm');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);

    // Day 20 Capstone minutes = 50, Days 16-19 minutes = 45
    if (day === 20) {
      assert.equal(lesson.minutes, 50, 'Day 20 Capstone minutes must be 50');
    } else {
      assert.equal(lesson.minutes, 45, `Day ${day} minutes must be 45`);
    }

    const spokenMin = estimateSpokenMinutes(lesson);
    assert.ok(
      spokenMin >= 19.5,
      `Day ${day} spoken minutes must be >= 19.5 min for ~2,950 words floor (got ${spokenMin.toFixed(2)} min)`
    );

    for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
      const part = lesson.parts[pIdx];
      assert.ok(part.title.length > 0, `Day ${day} Part ${pIdx + 1} must have a non-empty title`);
      assert.ok(part.say.length >= 3, `Day ${day} Part ${pIdx + 1} must have >= 3 paragraphs`);
      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${pIdx + 1} must have an example`);
      assert.ok(
        part.code && (part.code.includes('def ') || part.code.includes('class ')),
        `Day ${day} Part ${pIdx + 1} code must contain Python functions/classes`
      );
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${pIdx + 1} must have expected output`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${pIdx + 1} must have >= 3 codeNotes`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${pIdx + 1} must have tryIt experiment`);

      const check = part.check as any;
      assert.ok(check.question.length > 0, `Day ${day} Part ${pIdx + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${pIdx + 1} check options must be exactly 4`);
      assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Day ${day} Part ${pIdx + 1} answerIndex must be valid`);
      assert.ok(check.explanation.length > 0, `Day ${day} Part ${pIdx + 1} explanation must be non-empty`);
    }
  }
});

test('B.Com SCRM Milestone 4 (Days 16-20): Python Domain Code & Accreditation Verification', () => {
  // Day 16: CRM Database Architecture & Data Hygiene
  const d16 = getLongLesson('bcom_scrm', 16)!;
  assert.ok(d16.parts[0].code?.includes('audit_crm_schema_relational_integrity'));
  assert.ok(d16.parts[1].code?.includes('deduplicate_and_merge_crm_leads'));
  assert.ok(d16.parts[2].code?.includes('evaluate_stage_gate_validation_rules'));
  assert.ok(d16.parts[3].code?.includes('score_crm_data_freshness_and_decay'));
  assert.ok(d16.parts[4].code?.includes('MasterCrmDataHygieneOrchestrator'));

  // Day 17: CRM Workflow Automation & Lead Routing
  const d17 = getLongLesson('bcom_scrm', 17)!;
  assert.ok(d17.parts[0].code?.includes('score_inbound_lead_composite'));
  assert.ok(d17.parts[1].code?.includes('route_lead_round_robin_with_capacity'));
  assert.ok(d17.parts[2].code?.includes('monitor_speed_to_lead_sla_and_escalate'));
  assert.ok(d17.parts[3].code?.includes('process_crm_event_triggers_and_webhooks'));
  assert.ok(d17.parts[4].code?.includes('MasterLeadRoutingAutomationEngine'));

  // Day 18: Sales Enablement & Competitive Battlecards
  const d18 = getLongLesson('bcom_scrm', 18)!;
  assert.ok(d18.parts[0].code?.includes('generate_competitive_battlecard_matrix'));
  assert.ok(d18.parts[1].code?.includes('score_and_deploy_discovery_landmines'));
  assert.ok(d18.parts[2].code?.includes('resolve_enterprise_objection_laer'));
  assert.ok(d18.parts[3].code?.includes('evaluate_sales_rep_enablement_certification'));
  assert.ok(d18.parts[4].code?.includes('MasterSalesEnablementEngine'));

  // Day 19: Sales Compensation: OTE (50/50 Split), Quota Sizing & Commission Accelerators
  const d19 = getLongLesson('bcom_scrm', 19)!;
  assert.ok(d19.parts[0].code?.includes('calculate_ote_and_quota_capacity'));
  assert.ok(d19.parts[1].code?.includes('calculate_marginal_accelerated_compensation'));
  assert.ok(d19.parts[2].code?.includes('reconcile_sales_ramp_draw_schedule'));
  assert.ok(d19.parts[3].code?.includes('evaluate_clawbacks_and_spiff_incentives'));
  assert.ok(d19.parts[4].code?.includes('MasterEnterpriseSalesCompEngine'));

  // Day 20: Milestone 4 Capstone: Sales Coaching, Conversational Intelligence & RevOps Infrastructure Control Tower
  const d20 = getLongLesson('bcom_scrm', 20)!;
  assert.ok(d20.parts[0].code?.includes('calculate_gong_conversational_talk_ratio'));
  assert.ok(d20.parts[1].code?.includes('evaluate_monologue_and_pacing'));
  assert.ok(d20.parts[2].code?.includes('inspect_deal_health_and_map'));
  assert.ok(d20.parts[3].code?.includes('evaluate_boardroom_gtm_efficiency'));
  assert.ok(d20.parts[4].code?.includes('MasterMilestone4RevOpsGrandCapstone'));
  assert.ok(d20.parts[4].output?.includes('CESRD_CREDENTIAL_CERTIFIED_NOMINAL'));
  assert.ok(d20.parts[4].output?.includes('Certified Enterprise Sales Operations & RevOps Director'));
});

test('B.Com SCRM Milestone 4 (Days 16-20): Gate v2 Funnel Visuals & Cryptographic SHA-256 Bindings Verification', () => {
  const visualsDir = path.resolve(__dirname, '../src/lib/data/lessonVisuals/bcom_scrm');
  
  for (let day = 16; day <= 20; day++) {
    const fileName = `day-${day.toString().padStart(2, '0')}.json`;
    const filePath = path.join(visualsDir, fileName);
    assert.ok(fs.existsSync(filePath), `Visual file ${fileName} must exist on disk`);

    const raw = fs.readFileSync(filePath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, 1);
    assert.equal(visual.prefix, 'bcom_scrm');
    assert.equal(visual.day, day);
    assert.ok(visual.promptSha && visual.promptSha.length === 64, 'promptSha must be valid 64-char sha256');
    assert.equal(visual.entries.length, 5, `Visual ${fileName} must have exactly 5 entries`);

    const lesson = getLongLesson('bcom_scrm', day)!;
    for (let eIdx = 0; eIdx < visual.entries.length; eIdx++) {
      const entry = visual.entries[eIdx];
      const part = lesson.parts[eIdx];

      assert.equal(entry.partTitle, part.title, `Entry ${eIdx} partTitle must match lesson part title`);

      // Verify cryptographic SHA-256 code hash binding
      const expectedHash = crypto.createHash('sha256').update(part.code.trim()).digest('hex');
      assert.equal(
        entry.codeHash,
        expectedHash,
        `Day ${day} Part ${eIdx + 1} codeHash must strictly match SHA-256 of part.code.trim()`
      );

      // Verify Funnel template structure
      assert.equal(entry.spec.template, 'funnel', 'Visual template must be funnel');
      assert.equal(entry.spec.steps.length, 4, 'Visual spec must have exactly 4 steps');
      const stepAts = entry.spec.steps.map((s: any) => s.at);
      assert.deepEqual(stepAts, ['intro', 'say1', 'example', 'tryIt'], 'Steps must match [intro, say1, example, tryIt]');

      for (const step of entry.spec.steps) {
        assert.ok(step.caption.length > 0, 'Step caption must be non-empty');
        assert.ok(['top', 'qual', 'target', 'final'].includes(step.activeStageId));
        assert.equal(step.stages.length, 4, 'Funnel must have 4 stages');
      }

      assert.deepEqual(entry.filled, entry.spec, 'filled must match spec');
    }
  }
});







