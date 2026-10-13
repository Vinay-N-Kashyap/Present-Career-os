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

