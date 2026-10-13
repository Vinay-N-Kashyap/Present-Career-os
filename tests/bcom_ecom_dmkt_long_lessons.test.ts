import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';
import { BCOM_ECOM_LONG_LESSONS } from '../src/lib/data/bcomEcomLongLessons';
import { BCOM_DMKT_LONG_LESSONS } from '../src/lib/data/bcomDmktLongLessons';


test('B.Com E-Commerce & Digital Marketing Long Lessons: Resolution & Language Invariants', () => {
  // E-Commerce (bcom_ecom)
  const ecomLesson = getLongLesson('bcom_ecom', 1);
  assert.ok(ecomLesson, 'bcom_ecom Day 1 lesson must be defined');
  assert.equal(ecomLesson.coursePrefix, 'bcom_ecom');
  assert.equal(ecomLesson.day, 1);
  assert.equal(ecomLesson.parts.length, 5, 'bcom_ecom Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ecom'), 'python', 'bcom_ecom must use Python language runner');

  // Digital Marketing (bcom_dmkt)
  const dmktLesson = getLongLesson('bcom_dmkt', 1);
  assert.ok(dmktLesson, 'bcom_dmkt Day 1 lesson must be defined');
  assert.equal(dmktLesson.coursePrefix, 'bcom_dmkt');
  assert.equal(dmktLesson.day, 1);
  assert.equal(dmktLesson.parts.length, 5, 'bcom_dmkt Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_dmkt'), 'python', 'bcom_dmkt must use Python language runner');

  // Marketing Alias (bcom-marketing)
  const mktAliasLesson = getLongLesson('bcom-marketing', 1);
  assert.ok(mktAliasLesson, 'bcom-marketing Day 1 lesson alias must be defined');
  assert.equal(getLongLessonLanguage('bcom-marketing'), 'python');
});

test('B.Com E-Commerce Day 1: Marketplace GMV, Dynamic Pricing & Fulfillment Snippets Verification', () => {
  const lesson = BCOM_ECOM_LONG_LESSONS[0];
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
  assert.ok(lesson.parts[0].code?.includes('MarketplaceEconomicsEngine'));
  assert.ok(lesson.parts[1].code?.includes('DynamicPricingEngine'));
  assert.ok(lesson.parts[2].code?.includes('EcomFunnelAnalyzer'));
  assert.ok(lesson.parts[3].code?.includes('FulfillmentRouter'));
  assert.ok(lesson.parts[4].code?.includes('ReverseLogisticsModel'));
});

test('B.Com E-Commerce Day 2: Inventory Velocity, Bullwhip & Fraud Screening Snippets Verification', () => {
  const lesson = BCOM_ECOM_LONG_LESSONS[1];
  assert.ok(lesson, 'bcom_ecom Day 2 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_ecom');
  assert.equal(lesson.day, 2);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

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
  assert.ok(lesson.parts[0].code?.includes('analyze_inventory_velocity'));
  assert.ok(lesson.parts[1].code?.includes('simulate_bullwhip_effect'));
  assert.ok(lesson.parts[2].code?.includes('compute_dtc_contribution_waterfall'));
  assert.ok(lesson.parts[3].code?.includes('route_distributed_order'));
  assert.ok(lesson.parts[4].code?.includes('score_ecommerce_fraud_risk'));
});

test('B.Com Digital Marketing Day 1: GSP Ad Auction, Multi-Touch & A/B Z-Test Snippets Verification', () => {
  const lesson = BCOM_DMKT_LONG_LESSONS[0];
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
  assert.ok(lesson.parts[0].code?.includes('GspAdAuction'));
  assert.ok(lesson.parts[1].code?.includes('AttributionModeler'));
  assert.ok(lesson.parts[2].code?.includes('PerformanceMediaEconomics'));
  assert.ok(lesson.parts[3].code?.includes('SplitTestAnalyzer'));
  assert.ok(lesson.parts[4].code?.includes('PageRankSimulator'));
});

test('B.Com Digital Marketing Day 2: MMM Adstock, CAC Payback & Bayesian Uplift Snippets Verification', () => {
  const lesson = BCOM_DMKT_LONG_LESSONS[1];
  assert.ok(lesson, 'bcom_dmkt Day 2 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_dmkt');
  assert.equal(lesson.day, 2);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

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
  assert.ok(lesson.parts[0].code?.includes('compute_adstock'));
  assert.ok(lesson.parts[0].code?.includes('hill_saturation'));
  assert.ok(lesson.parts[1].code?.includes('calculate_cac_payback_cohort'));
  assert.ok(lesson.parts[2].code?.includes('CrawlBudgetAuditor'));
  assert.ok(lesson.parts[3].code?.includes('optimize_retargeting_audiences'));
  assert.ok(lesson.parts[4].code?.includes('BayesianAbTest'));
});

test('Block 136: B.Com E-Commerce Day 3: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_ecom', 3);
  assert.ok(lesson, 'bcom_ecom Day 3 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_ecom');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5, 'bcom_ecom Day 3 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ecom'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 136: B.Com E-Commerce Day 3: CM1/CM2/CM3 Waterfall, Cohort LTV, Cart Abandonment & MER Verification', () => {
  const lesson = BCOM_ECOM_LONG_LESSONS[2];
  assert.ok(lesson, 'BCOM_ECOM_LONG_LESSONS[2] must exist');
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
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /Unit Economics.*CM1.*CM2.*CM3/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_dtc_unit_economics_waterfall'));
  assert.match(lesson.parts[1].title, /Cohort.*LTV|Repurchase Curves/i);
  assert.ok(lesson.parts[1].code?.includes('model_ecommerce_ltv_cohort_waterfall'));
  assert.match(lesson.parts[2].title, /Checkout Funnel.*Cart Abandonment/i);
  assert.ok(lesson.parts[2].code?.includes('simulate_cart_abandonment_recovery_engine'));
  assert.match(lesson.parts[3].title, /Media Mix.*ROAS.*MER/i);
  assert.ok(lesson.parts[3].code?.includes('audit_roas_vs_mer_channel_efficiency'));
  assert.match(lesson.parts[4].title, /E-Commerce Growth Control Tower/i);
  assert.ok(lesson.parts[4].code?.includes('run_ecommerce_growth_control_tower'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 137: B.Com E-Commerce Day 4: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_ecom', 4);
  assert.ok(lesson, 'bcom_ecom Day 4 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_ecom');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5, 'bcom_ecom Day 4 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ecom'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 137: B.Com E-Commerce Day 4: FBA vs FBM, Dropshipping SLAs, GMROI & Cross-Border Landed Cost Verification', () => {
  const lesson = BCOM_ECOM_LONG_LESSONS[3];
  assert.ok(lesson, 'BCOM_ECOM_LONG_LESSONS[3] must exist');
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
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /Amazon 3P Marketplace.*FBA vs FBM/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_marketplace_fba_vs_fbm_economics'));
  assert.match(lesson.parts[1].title, /Drop-Shipping.*SLA/i);
  assert.ok(lesson.parts[1].code?.includes('model_dropshipping_virtual_supply_chain'));
  assert.match(lesson.parts[2].title, /GMROI.*Stockout/i);
  assert.ok(lesson.parts[2].code?.includes('calculate_gmroi_and_stockout_penalty'));
  assert.match(lesson.parts[3].title, /Cross-Border.*Customs Tariffs.*De Minimis/i);
  assert.ok(lesson.parts[3].code?.includes('model_cross_border_landed_cost_and_tariffs'));
  assert.match(lesson.parts[4].title, /Global Marketplace & Supply Chain.*Control Tower/i);
  assert.ok(lesson.parts[4].code?.includes('run_marketplace_supply_chain_control_tower'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 138: B.Com E-Commerce Day 5 Capstone: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_ecom', 5);
  assert.ok(lesson, 'bcom_ecom Day 5 Capstone lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_ecom');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5, 'bcom_ecom Day 5 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ecom'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 138: B.Com E-Commerce Day 5 Capstone: GMV Flywheel, 3PL Nodes, Consolidated P&L, Payment Routing & CCO-SES Accreditation Verification', () => {
  const lesson = BCOM_ECOM_LONG_LESSONS[4];
  assert.ok(lesson, 'BCOM_ECOM_LONG_LESSONS[4] must exist');
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
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /Omnichannel GMV Flywheel/i);
  assert.ok(lesson.parts[0].code?.includes('model_omnichannel_gmv_flywheel'));
  assert.match(lesson.parts[1].title, /Distributed 3PL Nodes.*Shipping SLA/i);
  assert.ok(lesson.parts[1].code?.includes('optimize_distributed_3pl_nodes_and_shipping'));
  assert.match(lesson.parts[2].title, /Omnichannel P&L.*Contribution Margin/i);
  assert.ok(lesson.parts[2].code?.includes('consolidate_omnichannel_ecommerce_pl'));
  assert.match(lesson.parts[3].title, /Payment Gateway.*3DS2 Fraud Defense/i);
  assert.ok(lesson.parts[3].code?.includes('architect_payment_gateway_and_fraud_defense'));
  assert.match(lesson.parts[4].title, /Boardroom Defense.*Chief Commerce Officer Accreditation/i);
  assert.ok(lesson.parts[4].code?.includes('generate_chief_commerce_officer_dossier_and_accreditation'));

  // Capstone Accreditation Assertions
  assert.ok(lesson.parts[4].output?.includes('CCO-SES'), 'Must confer CCO-SES accreditation');
  assert.ok(lesson.parts[4].output?.includes('15,000,000.00'), 'Must model $15M GMV flywheel');
  assert.ok(lesson.parts[4].output?.includes('1,201,250.00'), 'Must generate $1.2M operating profit');

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Course bcom_ecom 100% Complete: All 5 Days Verified', () => {
  for (let day = 1; day <= 5; day++) {
    const lesson = getLongLesson('bcom_ecom', day);
    assert.ok(lesson, `bcom_ecom Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_ecom Day ${day} must have 5 parts`);
  }
});

test('Block 139: B.Com Digital Marketing Day 3: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_dmkt', 3);
  assert.ok(lesson, 'bcom_dmkt Day 3 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_dmkt');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5, 'bcom_dmkt Day 3 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_dmkt'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 139: B.Com Digital Marketing Day 3: OpenRTB, SPO, MRC Viewability, Ad Fraud & DSP Control Tower Verification', () => {
  const lesson = BCOM_DMKT_LONG_LESSONS[2];
  assert.ok(lesson, 'BCOM_DMKT_LONG_LESSONS[2] must exist');
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
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /OpenRTB.*Bid Stream/i);
  assert.ok(lesson.parts[0].code?.includes('simulate_openrtb_auction'));
  assert.ok(lesson.parts[0].output?.includes('AmazonDSP'));
  assert.ok(lesson.parts[0].output?.includes('$4.60'));

  assert.match(lesson.parts[1].title, /First-Price.*Supply-Path Optimization/i);
  assert.ok(lesson.parts[1].code?.includes('optimize_supply_path_and_bid_shading'));
  assert.ok(lesson.parts[1].output?.includes('Direct_Prebid_SSP'));

  assert.match(lesson.parts[2].title, /MRC Viewability.*vCPM/i);
  assert.ok(lesson.parts[2].code?.includes('calculate_viewability_and_vcpm'));
  assert.ok(lesson.parts[2].output?.includes('$7.03'));

  assert.match(lesson.parts[3].title, /Ad Fraud Detection.*Bot Traffic/i);
  assert.ok(lesson.parts[3].code?.includes('audit_programmatic_fraud_and_adstxt'));
  assert.ok(lesson.parts[3].output?.includes('$0.0300'));

  assert.match(lesson.parts[4].title, /Programmatic.*Control Tower/i);
  assert.ok(lesson.parts[4].code?.includes('run_programmatic_dsp_control_tower'));
  assert.ok(lesson.parts[4].output?.includes('OPTIMAL_HIGH_YIELD'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 140: B.Com Digital Marketing Day 4: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_dmkt', 4);
  assert.ok(lesson, 'bcom_dmkt Day 4 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_dmkt');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5, 'bcom_dmkt Day 4 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_dmkt'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 140: B.Com Digital Marketing Day 4: Geo-Lift iROAS, Marginal ROAS, CDP Identity Graph, ABM Intent & Control Tower Verification', () => {
  const lesson = BCOM_DMKT_LONG_LESSONS[3];
  assert.ok(lesson, 'BCOM_DMKT_LONG_LESSONS[3] must exist');
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
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /Geo-Lift.*Incrementality/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_geolift_incrementality'));
  assert.ok(lesson.parts[0].output?.includes('iROAS: 2.20x'));
  assert.ok(lesson.parts[0].output?.includes('STATISTICALLY_SIGNIFICANT_CONFIRMED'));

  assert.match(lesson.parts[1].title, /Non-Linear Media Saturation.*Marginal ROAS/i);
  assert.ok(lesson.parts[1].code?.includes('optimize_marginal_roas_allocation'));
  assert.ok(lesson.parts[1].output?.includes('EXPAND_BUDGET'));
  assert.ok(lesson.parts[1].output?.includes('SATURATED_REALLOCATE'));

  assert.match(lesson.parts[2].title, /Customer Data Platform.*Identity Graph/i);
  assert.ok(lesson.parts[2].code?.includes('stitch_identity_graph_records'));
  assert.ok(lesson.parts[2].output?.includes('Golden Customers: 2'));
  assert.ok(lesson.parts[2].output?.includes('Stitch Rate: 60.0%'));

  assert.match(lesson.parts[3].title, /High-ACV Account-Based Marketing.*Intent/i);
  assert.ok(lesson.parts[3].code?.includes('score_abm_account_intent_and_surge'));
  assert.ok(lesson.parts[3].output?.includes('DIRECT_ENTERPRISE_SDR_ESCALATION'));
  assert.ok(lesson.parts[3].output?.includes('cloudhealthcorp.com'));

  assert.match(lesson.parts[4].title, /Omni-Channel Incrementality.*Control Tower/i);
  assert.ok(lesson.parts[4].code?.includes('run_omnichannel_incrementality_control_tower'));
  assert.ok(lesson.parts[4].output?.includes('Over_Attribution_Gap: $51,400.00'));
  assert.ok(lesson.parts[4].output?.includes('HIGH_EFFICIENCY_EXPANSION'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 141: B.Com Digital Marketing Day 5 Capstone: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_dmkt', 5);
  assert.ok(lesson, 'bcom_dmkt Day 5 Capstone lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_dmkt');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5, 'bcom_dmkt Day 5 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_dmkt'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 141: B.Com Digital Marketing Day 5 Capstone: CMO Growth Engine, MMM Calibration, CLV Payback, Brand Equity & CMO-PEA Accreditation Verification', () => {
  const lesson = BCOM_DMKT_LONG_LESSONS[4];
  assert.ok(lesson, 'BCOM_DMKT_LONG_LESSONS[4] must exist');
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
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /CMO Global Omni-Channel Growth Engine/i);
  assert.ok(lesson.parts[0].code?.includes('model_cmo_global_growth_engine'));
  assert.ok(lesson.parts[0].output?.includes('Incremental Rev: $24,500,000.00'));
  assert.ok(lesson.parts[0].output?.includes('Blended iROAS: 2.45x'));

  assert.match(lesson.parts[1].title, /Unified MMM & Incrementality.*Calibration/i);
  assert.ok(lesson.parts[1].code?.includes('calibrate_mmm_with_incrementality_experiments'));
  assert.ok(lesson.parts[1].output?.includes('Calibrated: $24,486,000.00'));
  assert.ok(lesson.parts[1].output?.includes('GOLD_STANDARD_TRIANGULATED'));

  assert.match(lesson.parts[2].title, /Enterprise Customer Lifetime Value.*CLV.*CAC Payback/i);
  assert.ok(lesson.parts[2].code?.includes('model_enterprise_clv_and_cac_payback'));
  assert.ok(lesson.parts[2].output?.includes('CAC: $185.00'));
  assert.ok(lesson.parts[2].output?.includes('Payback: 8.3 Months'));

  assert.match(lesson.parts[3].title, /Brand Equity Valuation.*NPS Elasticity/i);
  assert.ok(lesson.parts[3].code?.includes('calculate_brand_equity_and_governance'));
  assert.ok(lesson.parts[3].output?.includes('Brand Equity: $34,255,000.00'));
  assert.ok(lesson.parts[3].output?.includes('NPS: +52'));

  assert.match(lesson.parts[4].title, /Boardroom Defense.*Chief Marketing Officer Accreditation/i);
  assert.ok(lesson.parts[4].code?.includes('generate_cmo_boardroom_dossier_and_accreditation'));
  assert.ok(lesson.parts[4].output?.includes('100%_UNANIMOUS_APPROVAL'));
  assert.ok(lesson.parts[4].output?.includes('CMO-PEA'));
  assert.ok(lesson.parts[4].output?.includes('FIRST_CLASS_DISTINCTION'));

  // Capstone Accreditation Assertions
  assert.ok(lesson.parts[4].output?.includes('CMO-PEA'), 'Must confer CMO-PEA accreditation');

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Course bcom_dmkt 100% Complete: All 5 Days Verified', () => {
  for (let day = 1; day <= 5; day++) {
    const lesson = getLongLesson('bcom_dmkt', day);
    assert.ok(lesson, `bcom_dmkt Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_dmkt Day ${day} must have 5 parts`);
  }
});

test('All 14 B.Com & Business Specializations 100% Complete: Milestone 1 Certified', () => {
  const bcomCourses = [
    'bcom-accounting',
    'bcom-finance',
    'bcom_aud',
    'bcom_tax',
    'bcom_law',
    'bcom_ban',
    'bcom_ops',
    'bcom_ait',
    'bcom_ana',
    'bcom-marketing',
    'bcom_scrm',
    'bcom_ent',
    'bcom_ecom',
    'bcom_dmkt'
  ];

  for (const course of bcomCourses) {
    for (let day = 1; day <= 5; day++) {
      const lesson = getLongLesson(course, day);
      assert.ok(lesson, `Course ${course} Day ${day} must be defined`);
      assert.equal(lesson.day, day);
      assert.equal(lesson.parts.length, 5, `Course ${course} Day ${day} must have 5 parts`);
    }
  }
});




