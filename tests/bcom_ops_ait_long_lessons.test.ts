import test from 'node:test';
import assert from 'node:assert/strict';
import { getLongLesson, getLongLessonLanguage } from '../src/lib/data/longLessons';

test('B.Com Ops & AI Digital Transformation Long Lessons: Resolution & Language Invariants', () => {
  // 1. bcom_ops
  const opsLesson = getLongLesson('bcom_ops', 1);
  assert.ok(opsLesson, 'bcom_ops Day 1 long lesson must resolve');
  assert.equal(opsLesson.day, 1);
  assert.equal(opsLesson.parts.length, 5, 'bcom_ops Day 1 must contain exactly 5 parts');
  assert.ok(opsLesson.summary.length >= 4, 'bcom_ops Day 1 must contain comprehensive summary');
  assert.ok(opsLesson.projectStep, 'bcom_ops Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('bcom_ops'), 'python');

  // 2. bcom_ait
  const aitLesson = getLongLesson('bcom_ait', 1);
  assert.ok(aitLesson, 'bcom_ait Day 1 long lesson must resolve');
  assert.equal(aitLesson.day, 1);
  assert.equal(aitLesson.parts.length, 5, 'bcom_ait Day 1 must contain exactly 5 parts');
  assert.ok(aitLesson.summary.length >= 4, 'bcom_ait Day 1 must contain comprehensive summary');
  assert.ok(aitLesson.projectStep, 'bcom_ait Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('bcom_ait'), 'python');
});

test('B.Com Ops Day 1: Little\'s Law, EOQ & Six Sigma Python Code Snippets & Socratic Checks Verification', () => {
  const opsLesson = getLongLesson('bcom_ops', 1);
  assert.ok(opsLesson);

  for (const part of opsLesson.parts) {
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

test('B.Com AIT Day 1: IDP OCR, Process Mining & Circuit Breaker Python Code Snippets & Socratic Checks Verification', () => {
  const aitLesson = getLongLesson('bcom_ait', 1);
  assert.ok(aitLesson);

  for (const part of aitLesson.parts) {
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

test('B.Com Ops Day 2: TOC Bottleneck, Drum-Buffer-Rope & Kanban Sizing Snippets Verification', () => {
  const opsLesson2 = getLongLesson('bcom_ops', 2);
  assert.ok(opsLesson2, 'bcom_ops Day 2 long lesson must resolve');
  assert.equal(opsLesson2.day, 2);
  assert.equal(opsLesson2.parts.length, 5, 'bcom_ops Day 2 must contain exactly 5 parts');
  assert.ok(opsLesson2.summary.length >= 4, 'bcom_ops Day 2 must contain comprehensive summary');
  assert.ok(opsLesson2.projectStep, 'bcom_ops Day 2 must have a hands-on project step');

  for (let i = 0; i < opsLesson2.parts.length; i++) {
    const part = opsLesson2.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
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
  assert.ok(opsLesson2.parts[0].code?.includes('evaluate_theory_of_constraints'));
  assert.ok(opsLesson2.parts[1].code?.includes('drum_buffer_rope_scheduler'));
  assert.ok(opsLesson2.parts[2].code?.includes('calculate_oee'));
  assert.ok(opsLesson2.parts[3].code?.includes('calculate_kanban_cards'));
  assert.ok(opsLesson2.parts[4].code?.includes('MonteCarloLeadTimeForecaster'));
});

test('B.Com AIT Day 2: Vector Search RAG, Guardrails & Model Risk Governance Snippets Verification', () => {
  const aitLesson2 = getLongLesson('bcom_ait', 2);
  assert.ok(aitLesson2, 'bcom_ait Day 2 long lesson must resolve');
  assert.equal(aitLesson2.day, 2);
  assert.equal(aitLesson2.parts.length, 5, 'bcom_ait Day 2 must contain exactly 5 parts');
  assert.ok(aitLesson2.summary.length >= 4, 'bcom_ait Day 2 must contain comprehensive summary');
  assert.ok(aitLesson2.projectStep, 'bcom_ait Day 2 must have a hands-on project step');

  for (let i = 0; i < aitLesson2.parts.length; i++) {
    const part = aitLesson2.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
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
  assert.ok(aitLesson2.parts[0].code?.includes('retrieve_rag_chunks'));
  assert.ok(aitLesson2.parts[0].code?.includes('cosine_similarity'));
  assert.ok(aitLesson2.parts[1].code?.includes('EnterpriseGuardrailEngine'));
  assert.ok(aitLesson2.parts[2].code?.includes('evaluate_rag_triad'));
  assert.ok(aitLesson2.parts[3].code?.includes('AiAgentCanaryRouter'));
  assert.ok(aitLesson2.parts[4].code?.includes('AiRegulatoryComplianceClassifier'));
});

test('B.Com Ops Day 3: Lean Six Sigma DMAIC, Process Capability & SPC Control Charts Snippets Verification', () => {
  const opsLesson3 = getLongLesson('bcom_ops', 3);
  assert.ok(opsLesson3, 'bcom_ops Day 3 long lesson must resolve');
  assert.equal(opsLesson3.day, 3);
  assert.equal(opsLesson3.parts.length, 5, 'bcom_ops Day 3 must contain exactly 5 parts');
  assert.ok(opsLesson3.summary.length >= 4, 'bcom_ops Day 3 must contain comprehensive summary');
  assert.ok(opsLesson3.projectStep, 'bcom_ops Day 3 must have a hands-on project step');

  for (let i = 0; i < opsLesson3.parts.length; i++) {
    const part = opsLesson3.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('def '), `Part ${i + 1} code must contain Python functions`);
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
  assert.ok(opsLesson3.parts[0].code?.includes('calculate_process_capability'));
  assert.ok(opsLesson3.parts[1].code?.includes('shewhart_xbar_r_chart'));
  assert.ok(opsLesson3.parts[2].code?.includes('evaluate_p_chart_and_nelson_rules'));
  assert.ok(opsLesson3.parts[3].code?.includes('calculate_gage_rr'));
  assert.ok(opsLesson3.parts[4].code?.includes('analyze_cost_of_quality'));
});

test('B.Com Ops Day 4: Queuing Theory, Erlang C & Capacity Economics Snippets Verification', () => {
  const opsLesson4 = getLongLesson('bcom_ops', 4);
  assert.ok(opsLesson4, 'bcom_ops Day 4 long lesson must resolve');
  assert.equal(opsLesson4.day, 4);
  assert.equal(opsLesson4.parts.length, 5, 'bcom_ops Day 4 must contain exactly 5 parts');
  assert.ok(opsLesson4.summary.length >= 4, 'bcom_ops Day 4 must contain comprehensive summary');
  assert.ok(opsLesson4.projectStep, 'bcom_ops Day 4 must have a hands-on project step');

  for (let i = 0; i < opsLesson4.parts.length; i++) {
    const part = opsLesson4.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('def '), `Part ${i + 1} code must contain Python functions`);
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
  assert.ok(opsLesson4.parts[0].code?.includes('evaluate_mm1_queue'));
  assert.ok(opsLesson4.parts[1].code?.includes('evaluate_mmc_queue'));
  assert.ok(opsLesson4.parts[2].code?.includes('erlang_c_staffing_optimizer'));
  assert.ok(opsLesson4.parts[3].code?.includes('optimize_queuing_economics'));
  assert.ok(opsLesson4.parts[4].code?.includes('simulate_dynamic_shift_queue'));
});

test('B.Com Ops Day 5 Capstone: Global Supply Chain Optimization & Resilient Control Tower Snippets Verification', () => {
  const opsLesson5 = getLongLesson('bcom_ops', 5);
  assert.ok(opsLesson5, 'bcom_ops Day 5 Capstone long lesson must resolve');
  assert.equal(opsLesson5.day, 5);
  assert.equal(opsLesson5.parts.length, 5, 'bcom_ops Day 5 Capstone must contain exactly 5 parts');
  assert.ok(opsLesson5.summary.length >= 4, 'bcom_ops Day 5 Capstone must contain comprehensive summary');
  assert.ok(opsLesson5.projectStep, 'bcom_ops Day 5 Capstone must have a hands-on project step');

  for (let i = 0; i < opsLesson5.parts.length; i++) {
    const part = opsLesson5.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('def '), `Part ${i + 1} code must contain Python functions`);
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
  assert.ok(opsLesson5.parts[0].code?.includes('optimize_transportation_network'));
  assert.ok(opsLesson5.parts[1].code?.includes('evaluate_facility_location_cog'));
  assert.ok(opsLesson5.parts[2].code?.includes('simulate_bullwhip_multi_echelon'));
  assert.ok(opsLesson5.parts[3].code?.includes('evaluate_inventory_risk_pooling'));
  assert.ok(opsLesson5.parts[4].code?.includes('verify_resilient_supply_chain_control_tower'));
});

