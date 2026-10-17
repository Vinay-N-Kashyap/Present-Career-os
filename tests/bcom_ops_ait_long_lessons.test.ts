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

test('B.Com AIT Day 3: Enterprise NLP, VADER Sentiment & Invoice IDP Snippets Verification', () => {
  const aitLesson3 = getLongLesson('bcom_ait', 3);
  assert.ok(aitLesson3, 'bcom_ait Day 3 long lesson must resolve');
  assert.equal(aitLesson3.day, 3);
  assert.equal(aitLesson3.parts.length, 5, 'bcom_ait Day 3 must contain exactly 5 parts');
  assert.ok(aitLesson3.summary.length >= 4, 'bcom_ait Day 3 must contain comprehensive summary');
  assert.ok(aitLesson3.projectStep, 'bcom_ait Day 3 must have a hands-on project step');

  for (let i = 0; i < aitLesson3.parts.length; i++) {
    const part = aitLesson3.parts[i];
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
  assert.ok(aitLesson3.parts[0].code?.includes('calculate_tfidf_matrix'));
  assert.ok(aitLesson3.parts[1].code?.includes('analyze_customer_sentiment'));
  assert.ok(aitLesson3.parts[2].code?.includes('extract_and_redact_entities'));
  assert.ok(aitLesson3.parts[3].code?.includes('extract_and_reconcile_invoice'));
  assert.ok(aitLesson3.parts[4].code?.includes('predict_customer_churn_risk'));
});

test('B.Com AIT Day 4: Personalization, Recommenders, MAB & NBA Decisioning Snippets Verification', () => {
  const aitLesson4 = getLongLesson('bcom_ait', 4);
  assert.ok(aitLesson4, 'bcom_ait Day 4 long lesson must resolve');
  assert.equal(aitLesson4.day, 4);
  assert.equal(aitLesson4.parts.length, 5, 'bcom_ait Day 4 must contain exactly 5 parts');
  assert.ok(aitLesson4.summary.length >= 4, 'bcom_ait Day 4 must contain comprehensive summary');
  assert.ok(aitLesson4.projectStep, 'bcom_ait Day 4 must have a hands-on project step');

  for (let i = 0; i < aitLesson4.parts.length; i++) {
    const part = aitLesson4.parts[i];
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
  assert.ok(aitLesson4.parts[0].code?.includes('recommend_content_based_items'));
  assert.ok(aitLesson4.parts[1].code?.includes('predict_user_collaborative_ratings'));
  assert.ok(aitLesson4.parts[2].code?.includes('simulate_matrix_factorization_als'));
  assert.ok(aitLesson4.parts[3].code?.includes('evaluate_ucb1_personalization_bandit'));
  assert.ok(aitLesson4.parts[4].code?.includes('evaluate_next_best_action_arbitration'));
});

test('B.Com AIT Day 5 Capstone: Autonomous AI Swarm, PSI Drift & Transformation Control Tower Snippets Verification', () => {
  const aitLesson5 = getLongLesson('bcom_ait', 5);
  assert.ok(aitLesson5, 'bcom_ait Day 5 Capstone long lesson must resolve');
  assert.equal(aitLesson5.day, 5);
  assert.equal(aitLesson5.parts.length, 5, 'bcom_ait Day 5 Capstone must contain exactly 5 parts');
  assert.ok(aitLesson5.summary.length >= 4, 'bcom_ait Day 5 Capstone must contain comprehensive summary');
  assert.ok(aitLesson5.projectStep, 'bcom_ait Day 5 Capstone must have a hands-on project step');

  for (let i = 0; i < aitLesson5.parts.length; i++) {
    const part = aitLesson5.parts[i];
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
  assert.ok(aitLesson5.parts[0].code?.includes('orchestrate_multi_agent_swarm'));
  assert.ok(aitLesson5.parts[1].code?.includes('process_multimodal_crosslingual_invoice'));
  assert.ok(aitLesson5.parts[2].code?.includes('detect_population_stability_drift'));
  assert.ok(aitLesson5.parts[3].code?.includes('route_human_in_the_loop_exceptions'));
  assert.ok(aitLesson5.parts[4].code?.includes('verify_enterprise_digital_transformation_control_tower'));
});

test('Block 217 (TASK-1132..1136): B.Com Operations Days 6–10 Resolution & Invariant Verification', () => {
  for (let day = 6; day <= 10; day++) {
    const lesson = getLongLesson('bcom_ops', day);
    assert.ok(lesson, `bcom_ops Day ${day} long lesson must resolve`);
    assert.equal(lesson.coursePrefix, 'bcom_ops');
    assert.equal(lesson.day, day);
    assert.equal(lesson.minutes, 45, `Day ${day} duration must be 45 minutes`);
    assert.equal(lesson.parts.length, 5, `Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.summary.length >= 5, `Day ${day} must have at least 5 summary bullet points`);
    assert.ok(lesson.projectStep, `Day ${day} must have a hands-on projectStep`);
    assert.ok(lesson.projectStep.steps.length >= 4, `Day ${day} projectStep must have at least 4 steps`);

    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const part = lesson.parts[partIdx];
      assert.ok(part.title.length > 0, `Day ${day} Part ${partIdx + 1} must have a non-empty title`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${partIdx + 1} must have at least 4 exposition paragraphs`);
      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${partIdx + 1} must have a real-world example`);
      assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Day ${day} Part ${partIdx + 1} code must contain Python functions/classes`);
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${partIdx + 1} must have deterministic expected output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${partIdx + 1} must have a tryIt experiment`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${partIdx + 1} must have at least 3 codeNotes`);

      const check = part.check as any;
      assert.ok(check.question.length > 10, `Day ${day} Part ${partIdx + 1} check question must be descriptive`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${partIdx + 1} check must have exactly 4 options`);
      assert.ok(check.answer >= 0 && check.answer < 4, `Day ${day} Part ${partIdx + 1} answer must be valid index`);
      assert.ok(check.why && check.why.length > 15, `Day ${day} Part ${partIdx + 1} why explanation must be rigorous`);
    }
  }
});

test('Block 217: B.Com Operations Days 6–10 Gate v2 Workflow Visuals & Cryptographic SHA-256 Bindings', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual } = await import('../src/lib/visuals/loadVisuals');

  for (let day = 6; day <= 10; day++) {
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ops/day-${String(day).padStart(2, '0')}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ops', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ops Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ops');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ops Day ${day}`);

    const lesson = getLongLesson('bcom_ops', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ops Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom_ops Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ops', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ops Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'workflow', `Expected template "workflow" for bcom_ops`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ops Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map((s: any) => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );
    }
  }
});

test('Block 217: Domain specifics & deterministic Python code verification across Days 6–10', () => {
  // Day 6: Aggregate Production Planning & MPS
  const d6 = getLongLesson('bcom_ops', 6)!;
  assert.ok(d6.parts[0].code?.includes('formulate_aggregate_planning_horizon'));
  assert.ok(d6.parts[1].code?.includes('compare_chase_vs_level_strategies'));
  assert.ok(d6.parts[2].code?.includes('optimize_hybrid_aggregate_plan'));
  assert.ok(d6.parts[3].code?.includes('calculate_master_production_schedule'));
  assert.ok(d6.parts[4].code?.includes('MasterScheduleGovernor'));

  // Day 7: MRP I & Bill of Materials Explosion
  const d7 = getLongLesson('bcom_ops', 7)!;
  assert.ok(d7.parts[0].code?.includes('calculate_dependent_component_demand'));
  assert.ok(d7.parts[1].code?.includes('BillOfMaterialsManager'));
  assert.ok(d7.parts[2].code?.includes('compute_mrp_grid'));
  assert.ok(d7.parts[3].code?.includes('evaluate_lot_sizing_policies'));
  assert.ok(d7.parts[4].code?.includes('ClosedLoopMRPEngine'));

  // Day 8: MRP II & Capacity Requirements Planning (CRP)
  const d8 = getLongLesson('bcom_ops', 8)!;
  assert.ok(d8.parts[0].code?.includes('simulate_mrp2_enterprise_impact'));
  assert.ok(d8.parts[1].code?.includes('OperationsRoutingEngine'));
  assert.ok(d8.parts[2].code?.includes('generate_infinite_load_profile'));
  assert.ok(d8.parts[3].code?.includes('level_work_center_overload'));
  assert.ok(d8.parts[4].code?.includes('evaluate_shop_floor_dispatching_rules'));

  // Day 9: Toyota Production System (TPS), SMED & Heijunka
  const d9 = getLongLesson('bcom_ops', 9)!;
  assert.ok(d9.parts[0].code?.includes('analyze_lean_value_stream'));
  assert.ok(d9.parts[1].code?.includes('simulate_smed_setup_reduction'));
  assert.ok(d9.parts[2].code?.includes('generate_heijunka_mixed_model_schedule'));
  assert.ok(d9.parts[3].code?.includes('JidokaWorkstation'));
  assert.ok(d9.parts[4].code?.includes('calculate_cellular_swip_and_flow'));

  // Day 10: Milestone 2 Capstone: Master Production Scheduling & Lean Factory Control Tower
  const d10 = getLongLesson('bcom_ops', 10)!;
  assert.ok(d10.parts[0].code?.includes('simulate_production_control_pyramid'));
  assert.ok(d10.parts[1].code?.includes('analyze_multi_stage_factory_bottlenecks'));
  assert.ok(d10.parts[2].code?.includes('LiveFactoryControlTower'));
  assert.ok(d10.parts[3].code?.includes('verify_master_production_control_tower'));
  assert.ok(d10.parts[4].code?.includes('EnterpriseOperationsScorecard'));
});

test('Block 218 (TASK-1137..1141): B.Com Operations Days 11–15 Resolution & Invariant Verification', () => {
  for (let day = 11; day <= 15; day++) {
    const lesson = getLongLesson('bcom_ops', day);
    assert.ok(lesson, `bcom_ops Day ${day} long lesson must resolve`);
    assert.equal(lesson.coursePrefix, 'bcom_ops');
    assert.equal(lesson.day, day);
    assert.equal(lesson.minutes, day === 15 ? 50 : 45, `Day ${day} duration mismatch`);
    assert.equal(lesson.parts.length, 5, `Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.summary.length >= 5, `Day ${day} must have at least 5 summary bullet points`);
    assert.ok(lesson.projectStep, `Day ${day} must have a hands-on projectStep`);
    assert.ok(lesson.projectStep.steps.length >= 4, `Day ${day} projectStep must have at least 4 steps`);

    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const part = lesson.parts[partIdx];
      assert.ok(part.title.length > 0, `Day ${day} Part ${partIdx + 1} must have a non-empty title`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${partIdx + 1} must have at least 4 exposition paragraphs`);
      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${partIdx + 1} must have a real-world example`);
      assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Day ${day} Part ${partIdx + 1} code must contain Python functions/classes`);
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${partIdx + 1} must have deterministic expected output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${partIdx + 1} must have a tryIt experiment`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${partIdx + 1} must have at least 3 codeNotes`);

      const check = part.check as any;
      assert.ok(check.question.length > 10, `Day ${day} Part ${partIdx + 1} check question must be descriptive`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${partIdx + 1} check must have exactly 4 options`);
      assert.ok(check.answer >= 0 && check.answer < 4, `Day ${day} Part ${partIdx + 1} answer must be valid index`);
      assert.ok(check.why && check.why.length > 15, `Day ${day} Part ${partIdx + 1} why explanation must be rigorous`);
    }
  }
});

test('Block 218: B.Com Operations Days 11–15 Gate v2 Workflow Visuals & Cryptographic SHA-256 Bindings', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual } = await import('../src/lib/visuals/loadVisuals');

  for (let day = 11; day <= 15; day++) {
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ops/day-${String(day).padStart(2, '0')}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ops', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ops Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ops');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ops Day ${day}`);

    const lesson = getLongLesson('bcom_ops', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ops Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom_ops Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ops', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ops Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'workflow', `Expected template "workflow" for bcom_ops`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ops Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map((s: any) => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );
    }
  }
});

test('Block 218: Domain specifics & deterministic Python code verification across Days 11–15', () => {
  // Day 11: Warehouse Management Systems (WMS) & Facility Layout Design
  const d11 = getLongLesson('bcom_ops', 11)!;
  assert.ok(d11.parts[0].code?.includes('evaluate_inbound_shipment_putaway'));
  assert.ok(d11.parts[1].code?.includes('optimize_warehouse_slotting'));
  assert.ok(d11.parts[2].code?.includes('calculate_aisle_pick_travel'));
  assert.ok(d11.parts[3].code?.includes('execute_cycle_counting_audit'));
  assert.ok(d11.parts[4].code?.includes('evaluate_warehouse_shift_productivity'));

  // Day 12: Cold Chain Logistics & Temperature-Controlled Supply Chains
  const d12 = getLongLesson('bcom_ops', 12)!;
  assert.ok(d12.parts[0].code?.includes('evaluate_cold_chain_storage_regime'));
  assert.ok(d12.parts[1].code?.includes('calculate_mean_kinetic_temperature'));
  assert.ok(d12.parts[2].code?.includes('allocate_fefo_orders'));
  assert.ok(d12.parts[3].code?.includes('monitor_haccp_in_transit_ccp'));
  assert.ok(d12.parts[4].code?.includes('simulate_multi_zone_delivery_route'));

  // Day 13: Reverse Logistics, Circular Economy & Waste Minimization
  const d13 = getLongLesson('bcom_ops', 13)!;
  assert.ok(d13.parts[0].code?.includes('evaluate_customer_return_authorization'));
  assert.ok(d13.parts[1].code?.includes('execute_return_disposition_triage'));
  assert.ok(d13.parts[2].code?.includes('evaluate_remanufacturing_batch_economics'));
  assert.ok(d13.parts[3].code?.includes('reconcile_epr_statutory_obligations'));
  assert.ok(d13.parts[4].code?.includes('calculate_circular_economy_financial_ledger'));

  // Day 14: Legal, Regulatory & Compliance Frameworks in Supply Chain
  const d14 = getLongLesson('bcom_ops', 14)!;
  assert.ok(d14.parts[0].code?.includes('audit_procurement_transaction_icofr'));
  assert.ok(d14.parts[1].code?.includes('evaluate_related_party_procurement_contract'));
  assert.ok(d14.parts[2].code?.includes('audit_caro_2020_inventory_compliance'));
  assert.ok(d14.parts[3].code?.includes('evaluate_vendor_esg_due_diligence_audit'));
  assert.ok(d14.parts[4].code?.includes('audit_vendor_invoice_anti_corruption'));

  // Day 15: Milestone 3 Capstone: Omnichannel Logistics, Temperature-Controlled Networks & Closed-Loop Circular Operations Control Tower
  const d15 = getLongLesson('bcom_ops', 15)!;
  assert.ok(d15.parts[0].code?.includes('OperationsControlTower'));
  assert.ok(d15.parts[1].code?.includes('optimize_omnichannel_order_sourcing'));
  assert.ok(d15.parts[2].code?.includes('triage_in_transit_cold_chain_telemetry'));
  assert.ok(d15.parts[3].code?.includes('execute_closed_loop_reverse_operations'));
  assert.ok(d15.parts[4].code?.includes('run_milestone3_master_governance_verification'));
});

test('Block 219: B.Com Operations Days 16–20 LongLesson Structural Invariants & Spoken Word Count (>= 2,950 words/day)', () => {
  for (let day = 16; day <= 20; day++) {
    const lesson = getLongLesson('bcom_ops', day);
    assert.ok(lesson, `bcom_ops Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.minutes, day === 20 ? 50 : 45, `Day ${day} minutes must be ${day === 20 ? 50 : 45}`);
    assert.equal(lesson.parts.length, 5, `Day ${day} must contain exactly 5 parts`);

    let totalSpokenWords = 0;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const part = lesson.parts[partIdx];
      const partWords = Array.isArray(part.say)
        ? part.say.reduce((acc, p) => acc + p.trim().split(/\s+/).filter(Boolean).length, 0)
        : part.say.trim().split(/\s+/).filter(Boolean).length;
      totalSpokenWords += partWords;
      assert.ok(partWords >= 580, `Day ${day} Part ${partIdx + 1} has ${partWords} words; expected >= 580 words`);
    }

    assert.ok(
      totalSpokenWords >= 2950,
      `Day ${day} total spoken words is ${totalSpokenWords}; expected >= 2,950 words (~20.0 min spoken duration)`
    );

    assert.ok(lesson.summary && lesson.summary.length >= 5, `Day ${day} must have at least 5 summary bullet points`);
    assert.ok(lesson.projectStep, `Day ${day} must have a hands-on projectStep`);
    assert.ok(lesson.projectStep.steps.length >= 4, `Day ${day} projectStep must have at least 4 steps`);

    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const part = lesson.parts[partIdx];
      assert.ok(part.title.length > 0, `Day ${day} Part ${partIdx + 1} must have a non-empty title`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${partIdx + 1} must have at least 4 exposition paragraphs`);
      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${partIdx + 1} must have a real-world example`);
      assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Day ${day} Part ${partIdx + 1} code must contain Python functions/classes`);
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${partIdx + 1} must have deterministic expected output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${partIdx + 1} must have a tryIt experiment`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${partIdx + 1} must have at least 3 codeNotes`);

      const check = part.check as any;
      assert.ok(check.question.length > 10, `Day ${day} Part ${partIdx + 1} check question must be descriptive`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${partIdx + 1} check must have exactly 4 options`);
      assert.ok(check.answer >= 0 && check.answer < 4, `Day ${day} Part ${partIdx + 1} answer must be valid index`);
      assert.ok(check.why && check.why.length > 15, `Day ${day} Part ${partIdx + 1} why explanation must be rigorous`);
    }
  }
});

test('Block 219: B.Com Operations Days 16–20 Gate v2 Workflow Visuals & Cryptographic SHA-256 Bindings', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual } = await import('../src/lib/visuals/loadVisuals');

  for (let day = 16; day <= 20; day++) {
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ops/day-${String(day).padStart(2, '0')}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ops', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ops Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ops');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ops Day ${day}`);

    const lesson = getLongLesson('bcom_ops', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ops Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom_ops Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ops', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ops Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'workflow', `Expected template "workflow" for bcom_ops`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ops Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map((s: any) => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );
    }
  }
});

test('Block 219: Domain specifics & deterministic Python code verification across Days 16–20', () => {
  // Day 16: Strategic Sourcing, Supplier Selection & The Kraljic Portfolio Matrix
  const d16 = getLongLesson('bcom_ops', 16)!;
  assert.ok(d16.parts[0].code?.includes('classify_kraljic_quadrant'));
  assert.ok(d16.parts[1].code?.includes('compute_supplier_tco'));
  assert.ok(d16.parts[2].code?.includes('compute_ahp_supplier_scores'));
  assert.ok(d16.parts[3].code?.includes('evaluate_sourcing_resilience_strategy'));
  assert.ok(d16.parts[4].code?.includes('execute_strategic_sourcing_governance'));

  // Day 17: Incoterms 2020, International Freight Contracts & Total Landed Cost (TLC) Calculus
  const d17 = getLongLesson('bcom_ops', 17)!;
  assert.ok(d17.parts[0].code?.includes('evaluate_incoterm_responsibilities'));
  assert.ok(d17.parts[1].code?.includes('audit_ucp600_letter_of_credit_documents'));
  assert.ok(d17.parts[2].code?.includes('calculate_customs_duties_and_import_taxes'));
  assert.ok(d17.parts[3].code?.includes('evaluate_maritime_risk_and_demurrage'));
  assert.ok(d17.parts[4].code?.includes('compute_comprehensive_total_landed_cost'));

  // Day 18: Spend Analytics, Supplier Performance Scorecards & Value Engineering (VA/VE)
  const d18 = getLongLesson('bcom_ops', 18)!;
  assert.ok(d18.parts[0].code?.includes('build_spend_cube_analysis'));
  assert.ok(d18.parts[1].code?.includes('evaluate_supplier_operational_performance'));
  assert.ok(d18.parts[2].code?.includes('evaluate_balanced_supplier_scorecard'));
  assert.ok(d18.parts[3].code?.includes('evaluate_vave_reengineering_proposal'));
  assert.ok(d18.parts[4].code?.includes('execute_supplier_governance_control_tower'));

  // Day 19: Contract Negotiation, Supplier Relationship Management (SRM) & Risk Mitigation
  const d19 = getLongLesson('bcom_ops', 19)!;
  assert.ok(d19.parts[0].code?.includes('audit_contractual_delivery_performance'));
  assert.ok(d19.parts[1].code?.includes('evaluate_negotiation_frontier'));
  assert.ok(d19.parts[2].code?.includes('calculate_altman_z_score_health'));
  assert.ok(d19.parts[3].code?.includes('simulate_supply_chain_disruption_failover'));
  assert.ok(d19.parts[4].code?.includes('run_integrated_supplier_risk_sentinel'));

  // Day 20: Milestone 4 Capstone: Global Strategic Sourcing, Supplier Performance & Trade Compliance Control Tower
  const d20 = getLongLesson('bcom_ops', 20)!;
  assert.ok(d20.parts[0].code?.includes('GlobalSourcingControlTower'));
  assert.ok(d20.parts[1].code?.includes('evaluate_spend_cube_and_ahp_selection'));
  assert.ok(d20.parts[2].code?.includes('compute_comprehensive_total_landed_cost'));
  assert.ok(d20.parts[3].code?.includes('audit_supplier_performance_and_solvency'));
  assert.ok(d20.parts[4].code?.includes('MasterSourcingVerificationEngine'));
});

test('Block 220: B.Com Operations Days 21–25 LongLesson Structural Invariants & Spoken Word Count (>= 2,950 words/day)', () => {
  for (let day = 21; day <= 25; day++) {
    const lesson = getLongLesson('bcom_ops', day);
    assert.ok(lesson, `bcom_ops Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.minutes, day === 25 ? 50 : 45, `Day ${day} minutes must be ${day === 25 ? 50 : 45}`);
    assert.equal(lesson.parts.length, 5, `Day ${day} must contain exactly 5 parts`);

    let totalSpokenWords = 0;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const part = lesson.parts[partIdx];
      const partWords = Array.isArray(part.say)
        ? part.say.reduce((acc, p) => acc + p.trim().split(/\s+/).filter(Boolean).length, 0)
        : part.say.trim().split(/\s+/).filter(Boolean).length;
      totalSpokenWords += partWords;
      assert.ok(partWords >= 580, `Day ${day} Part ${partIdx + 1} has ${partWords} words; expected >= 580 words`);
    }

    assert.ok(
      totalSpokenWords >= 2950,
      `Day ${day} total spoken words is ${totalSpokenWords}; expected >= 2,950 words (~20.0 min spoken duration)`
    );

    assert.ok(lesson.summary && lesson.summary.length >= 5, `Day ${day} must have at least 5 summary bullet points`);
    assert.ok(lesson.projectStep, `Day ${day} must have a hands-on projectStep`);
    assert.ok(lesson.projectStep.steps.length >= 4, `Day ${day} projectStep must have at least 4 steps`);

    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const part = lesson.parts[partIdx];
      assert.ok(part.title.length > 0, `Day ${day} Part ${partIdx + 1} must have a non-empty title`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${partIdx + 1} must have at least 4 exposition paragraphs`);
      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${partIdx + 1} must have a real-world example`);
      assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Day ${day} Part ${partIdx + 1} code must contain Python functions/classes`);
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${partIdx + 1} must have deterministic expected output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${partIdx + 1} must have a tryIt experiment`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${partIdx + 1} must have at least 3 codeNotes`);

      const check = part.check as any;
      assert.ok(check.question.length > 10, `Day ${day} Part ${partIdx + 1} check question must be descriptive`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${partIdx + 1} check must have exactly 4 options`);
      assert.ok(check.answer >= 0 && check.answer < 4, `Day ${day} Part ${partIdx + 1} answer must be valid index`);
      assert.ok(check.why && check.why.length > 15, `Day ${day} Part ${partIdx + 1} why explanation must be rigorous`);
    }
  }
});

test('Block 220: B.Com Operations Days 21–25 Gate v2 Workflow Visuals & Cryptographic SHA-256 Bindings', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual } = await import('../src/lib/visuals/loadVisuals');

  for (let day = 21; day <= 25; day++) {
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ops/day-${String(day).padStart(2, '0')}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ops', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ops Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ops');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ops Day ${day}`);

    const lesson = getLongLesson('bcom_ops', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ops Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom_ops Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ops', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ops Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'workflow', `Expected template "workflow" for bcom_ops`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ops Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map((s: any) => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );
    }
  }
});

test('Block 220: Domain specifics & deterministic Python code verification across Days 21–25', () => {
  // Day 21: IoT Sensor Networks, RFID / BLE Asset Tracking & Cold Chain Telematics
  const d21 = getLongLesson('bcom_ops', 21)!;
  assert.ok(d21.parts[0].code?.includes('evaluate_iot_edge_telemetry'));
  assert.ok(d21.parts[1].code?.includes('calculate_rfid_ble_signal_triangulation'));
  assert.ok(d21.parts[2].code?.includes('audit_cold_chain_telematics_geofence'));
  assert.ok(d21.parts[3].code?.includes('analyze_vibration_telemetry_fft'));
  assert.ok(d21.parts[4].code?.includes('execute_iot_telematics_control_gateway'));

  // Day 22: Blockchain in SCM, Smart Contracts & Provenance Tracking (Track & Trace)
  const d22 = getLongLesson('bcom_ops', 22)!;
  assert.ok(d22.parts[0].code?.includes('generate_cryptographic_provenance_block'));
  assert.ok(d22.parts[1].code?.includes('execute_smart_contract_escrow_settlement'));
  assert.ok(d22.parts[2].code?.includes('verify_gs1_digital_link_serialization'));
  assert.ok(d22.parts[3].code?.includes('audit_electronic_bill_of_lading_transfer'));
  assert.ok(d22.parts[4].code?.includes('execute_blockchain_traceability_gateway'));

  // Day 23: Autonomous Mobile Robots (AMRs), Automated Guided Vehicles (AGVs) & AS/RS Robotics
  const d23 = getLongLesson('bcom_ops', 23)!;
  assert.ok(d23.parts[0].code?.includes('evaluate_warehouse_robotics_fleet'));
  assert.ok(d23.parts[1].code?.includes('calculate_asrs_throughput_and_roi'));
  assert.ok(d23.parts[2].code?.includes('compute_amr_conflict_free_pathfinding'));
  assert.ok(d23.parts[3].code?.includes('optimize_goods_to_person_picking'));
  assert.ok(d23.parts[4].code?.includes('orchestrate_autonomous_robotic_fulfillment'));

  // Day 24: Digital Twins in Logistics, Simulation & Discrete Event Modeling
  const d24 = getLongLesson('bcom_ops', 24)!;
  assert.ok(d24.parts[0].code?.includes('synchronize_digital_twin_telemetry'));
  assert.ok(d24.parts[1].code?.includes('run_discrete_event_simulation'));
  assert.ok(d24.parts[2].code?.includes('simulate_supply_chain_stress_test'));
  assert.ok(d24.parts[3].code?.includes('detect_digital_twin_anomaly_divergence'));
  assert.ok(d24.parts[4].code?.includes('execute_digital_twin_command_gateway'));

  // Day 25: Milestone 5 Grand Capstone: Autonomous Smart Factory & Digital Twin Supply Chain Control Tower
  const d25 = getLongLesson('bcom_ops', 25)!;
  assert.ok(d25.parts[0].code?.includes('AutonomousSmartFactoryControlTower'));
  assert.ok(d25.parts[1].code?.includes('evaluate_iot_telematics_and_blockchain_escrow'));
  assert.ok(d25.parts[2].code?.includes('audit_robotic_fleet_and_asrs_operations'));
  assert.ok(d25.parts[3].code?.includes('execute_digital_twin_simulation_and_stress_test'));
  assert.ok(d25.parts[4].code?.includes('MasterAutonomousOperationsVerificationEngine'));
});

test('Block 221: B.Com Operations Days 26–30 LongLesson Structural Invariants & Spoken Word Count (>= 2,950 words/day)', () => {
  for (let day = 26; day <= 30; day++) {
    const lesson = getLongLesson('bcom_ops', day);
    assert.ok(lesson, `bcom_ops Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.minutes, day === 30 ? 50 : 45, `Day ${day} minutes must be ${day === 30 ? 50 : 45}`);
    assert.equal(lesson.parts.length, 5, `Day ${day} must contain exactly 5 parts`);

    let totalSpokenWords = 0;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const part = lesson.parts[partIdx];
      const partWords = Array.isArray(part.say)
        ? part.say.reduce((acc, p) => acc + p.trim().split(/\s+/).filter(Boolean).length, 0)
        : part.say.trim().split(/\s+/).filter(Boolean).length;
      totalSpokenWords += partWords;
      assert.ok(partWords >= 580, `Day ${day} Part ${partIdx + 1} has ${partWords} words; expected >= 580 words`);
    }

    assert.ok(
      totalSpokenWords >= 2950,
      `Day ${day} total spoken words is ${totalSpokenWords}; expected >= 2,950 words (~20.0 min spoken duration)`
    );

    assert.ok(lesson.summary && lesson.summary.length >= 5, `Day ${day} must have at least 5 summary bullet points`);
    assert.ok(lesson.projectStep, `Day ${day} must have a hands-on projectStep`);
    assert.ok(lesson.projectStep.steps.length >= 4, `Day ${day} projectStep must have at least 4 steps`);

    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const part = lesson.parts[partIdx];
      assert.ok(part.title.length > 0, `Day ${day} Part ${partIdx + 1} must have a non-empty title`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${partIdx + 1} must have at least 4 exposition paragraphs`);
      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${partIdx + 1} must have a real-world example`);
      assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Day ${day} Part ${partIdx + 1} code must contain Python functions/classes`);
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${partIdx + 1} must have deterministic expected output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${partIdx + 1} must have a tryIt experiment`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${partIdx + 1} must have at least 3 codeNotes`);

      const check = part.check as any;
      assert.ok(check.question.length > 10, `Day ${day} Part ${partIdx + 1} check question must be descriptive`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${partIdx + 1} check must have exactly 4 options`);
      assert.ok(check.answer >= 0 && check.answer < 4, `Day ${day} Part ${partIdx + 1} answer must be valid index`);
      assert.ok(check.why && check.why.length > 15, `Day ${day} Part ${partIdx + 1} why explanation must be rigorous`);
    }
  }
});

test('Block 221: B.Com Operations Days 26–30 Gate v2 Workflow Visuals & Cryptographic SHA-256 Bindings', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual } = await import('../src/lib/visuals/loadVisuals');

  for (let day = 26; day <= 30; day++) {
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ops/day-${String(day).padStart(2, '0')}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ops', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ops Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ops');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ops Day ${day}`);

    const lesson = getLongLesson('bcom_ops', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ops Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom_ops Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ops', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ops Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'workflow', `Expected template "workflow" for bcom_ops`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ops Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map((s: any) => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );
    }
  }
});

test('Block 221: Domain specifics & deterministic Python code verification across Days 26–30', () => {
  // Day 26: ISO 9001:2015 QMS, Annex SL, PDCA & 8D CAPA
  const d26 = getLongLesson('bcom_ops', 26)!;
  assert.ok(d26.parts[0].code?.includes('evaluate_qms_annex_sl_readiness'));
  assert.ok(d26.parts[1].code?.includes('audit_pdca_continuous_improvement_cycle'));
  assert.ok(d26.parts[2].code?.includes('evaluate_stage1_stage2_audit_pipeline'));
  assert.ok(d26.parts[3].code?.includes('AuditNonConformanceManager'));
  assert.ok(d26.parts[4].code?.includes('audit_iso_non_conformance_closure'));
  assert.ok(d26.parts[4].code?.includes('MasterIso9001CertificationEngine'));

  // Day 27: Supply Chain Resilience, Dual Sourcing & Geopolitical Risk Mitigation
  const d27 = getLongLesson('bcom_ops', 27)!;
  assert.ok(d27.parts[0].code?.includes('analyze_single_source_vulnerability'));
  assert.ok(d27.parts[1].code?.includes('model_china_plus_one_dual_sourcing'));
  assert.ok(d27.parts[2].code?.includes('evaluate_nearshoring_tco_and_logistics'));
  assert.ok(d27.parts[3].code?.includes('audit_tts_vs_ttr_buffer_resilience'));
  assert.ok(d27.parts[4].code?.includes('calculate_supply_chain_resilience_index'));
  assert.ok(d27.parts[4].code?.includes('MasterSupplyChainResilienceOrchestrator'));

  // Day 28: Sustainable Supply Chains, ESG & Green Logistics (Scope 3, EUDR, 3TG)
  const d28 = getLongLesson('bcom_ops', 28)!;
  assert.ok(d28.parts[0].code?.includes('audit_scope3_value_chain_emissions'));
  assert.ok(d28.parts[1].code?.includes('verify_eudr_gps_geolocation_compliance'));
  assert.ok(d28.parts[2].code?.includes('audit_conflict_minerals_cmrt'));
  assert.ok(d28.parts[3].code?.includes('evaluate_supplier_fair_labor_scorecard'));
  assert.ok(d28.parts[4].code?.includes('audit_sustainable_procurement'));
  assert.ok(d28.parts[4].code?.includes('MasterSustainableProcurementOrchestrator'));

  // Day 29: AI & Autonomous Operations in Modern SCM (Computer Vision, Predictive Maintenance & RPA)
  const d29 = getLongLesson('bcom_ops', 29)!;
  assert.ok(d29.parts[0].code?.includes('inspect_surface_defects_computer_vision'));
  assert.ok(d29.parts[1].code?.includes('predict_equipment_failure_lead_days'));
  assert.ok(d29.parts[2].code?.includes('simulate_rpa_procurement_automation'));
  assert.ok(d29.parts[3].code?.includes('optimize_autonomous_logistics_dispatch'));
  assert.ok(d29.parts[4].code?.includes('evaluate_autonomous_ops'));
  assert.ok(d29.parts[4].code?.includes('MasterAutonomousOperationsOrchestrator'));

  // Day 30: Course 30 Milestone 6 Grand Final Capstone: Enterprise Operations, Supply Chain & Compliance Master Suite (50 mins)
  const d30 = getLongLesson('bcom_ops', 30)!;
  assert.ok(d30.parts[0].code?.includes('audit_module1_process_and_inventory_planning'));
  assert.ok(d30.parts[1].code?.includes('audit_module2_manufacturing_and_quality'));
  assert.ok(d30.parts[2].code?.includes('audit_module3_compliance_and_risk_governance'));
  assert.ok(d30.parts[3].code?.includes('audit_module4_operational_execution'));
  assert.ok(d30.parts[4].code?.includes('orchestrate_ops_suite'));
  assert.ok(d30.parts[4].code?.includes('audit_ops_master_cert'));
  assert.ok(d30.parts[4].code?.includes('MasterOperationsVerificationEngine'));
});




