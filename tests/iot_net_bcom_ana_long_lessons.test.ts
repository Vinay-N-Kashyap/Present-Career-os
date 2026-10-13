import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';

test('IoT Net & B.Com Analytics Long Lessons: Resolution & Language Invariants', () => {
  // 1. iot_net
  const netLesson = getLongLesson('iot_net', 1);
  assert.ok(netLesson, 'iot_net Day 1 long lesson must resolve');
  assert.equal(netLesson.day, 1);
  assert.equal(netLesson.parts.length, 5, 'iot_net Day 1 must contain exactly 5 parts');
  assert.ok(netLesson.summary.length >= 4, 'iot_net Day 1 must contain comprehensive summary');
  assert.ok(netLesson.projectStep, 'iot_net Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('iot_net'), 'python');

  const netLesson2 = getLongLesson('iot_net', 2);
  assert.ok(netLesson2, 'iot_net Day 2 long lesson must resolve');
  assert.equal(netLesson2.day, 2);
  assert.equal(netLesson2.parts.length, 5, 'iot_net Day 2 must contain exactly 5 parts');

  const netLesson3 = getLongLesson('iot_net', 3);
  assert.ok(netLesson3, 'iot_net Day 3 long lesson must resolve');
  assert.equal(netLesson3.day, 3);
  assert.equal(netLesson3.parts.length, 5, 'iot_net Day 3 must contain exactly 5 parts');

  // 2. bcom_ana
  const anaLesson = getLongLesson('bcom_ana', 1);
  assert.ok(anaLesson, 'bcom_ana Day 1 long lesson must resolve');
  assert.equal(anaLesson.day, 1);
  assert.equal(anaLesson.parts.length, 5, 'bcom_ana Day 1 must contain exactly 5 parts');
  assert.ok(anaLesson.summary.length >= 4, 'bcom_ana Day 1 must contain comprehensive summary');
  assert.ok(anaLesson.projectStep, 'bcom_ana Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('bcom_ana'), 'python');

  const anaLesson2 = getLongLesson('bcom_ana', 2);
  assert.ok(anaLesson2, 'bcom_ana Day 2 long lesson must resolve');
  assert.equal(anaLesson2.day, 2);
  assert.equal(anaLesson2.parts.length, 5, 'bcom_ana Day 2 must contain exactly 5 parts');
});

test('IoT Net Day 1: 6LoWPAN & Link Budget Python Code Snippets & Socratic Checks Verification', () => {
  const netLesson = getLongLesson('iot_net', 1);
  assert.ok(netLesson);

  for (const part of netLesson.parts) {
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

test('B.Com Analytics Day 1: Linear Optimization & Monte Carlo Python Code Snippets & Socratic Checks Verification', () => {
  const anaLesson = getLongLesson('bcom_ana', 1);
  assert.ok(anaLesson);

  for (const part of anaLesson.parts) {
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

test('B.Com Analytics Day 2: Logistic Credit Scoring, RFM CLV, Seasonal Forecasting & A/B Power Snippets Verification', () => {
  const anaLesson2 = getLongLesson('bcom_ana', 2);
  assert.ok(anaLesson2, 'bcom_ana Day 2 must resolve');
  assert.equal(anaLesson2.day, 2);
  assert.equal(anaLesson2.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(anaLesson2);
  const totalMin = estimateLessonMinutes(anaLesson2);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < anaLesson2.parts.length; i++) {
    const part = anaLesson2.parts[i];
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
  assert.ok(anaLesson2.parts[0].code?.includes('calculate_credit_default_probability'));
  assert.ok(anaLesson2.parts[1].code?.includes('segment_rfm_customer_portfolio'));
  assert.ok(anaLesson2.parts[2].code?.includes('forecast_seasonal_demand'));
  assert.ok(anaLesson2.parts[3].code?.includes('calculate_ab_test_sample_size'));
  assert.ok(anaLesson2.parts[4].code?.includes('decompose_executive_revenue_metrics'));
});

test('IoT Net Day 2: LoRa Time-on-Air, Duty Cycle, BLE Mesh, NB-IoT & RPL Snippets Verification', () => {
  const netLesson2 = getLongLesson('iot_net', 2);
  assert.ok(netLesson2, 'iot_net Day 2 must resolve');
  assert.equal(netLesson2.day, 2);
  assert.equal(netLesson2.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(netLesson2);
  const totalMin = estimateLessonMinutes(netLesson2);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < netLesson2.parts.length; i++) {
    const part = netLesson2.parts[i];
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
  assert.ok(netLesson2.parts[0].code?.includes('calculate_lora_time_on_air'));
  assert.ok(netLesson2.parts[1].code?.includes('evaluate_lorawan_duty_cycle'));
  assert.ok(netLesson2.parts[2].code?.includes('simulate_ble_mesh_relay'));
  assert.ok(netLesson2.parts[3].code?.includes('calculate_cellular_iot_battery_life'));
  assert.ok(netLesson2.parts[4].code?.includes('evaluate_rpl_dodag_mesh_routing'));
});

test('IoT Net Day 3: Thread IPv6 Mesh, CoAP Blockwise & OSCORE Security Verification', () => {
  const netLesson3 = getLongLesson('iot_net', 3);
  assert.ok(netLesson3, 'iot_net Day 3 must resolve');
  assert.equal(netLesson3.day, 3);
  assert.equal(netLesson3.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(netLesson3);
  const totalMin = estimateLessonMinutes(netLesson3);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < netLesson3.parts.length; i++) {
    const part = netLesson3.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('def '), `Part ${i + 1} code must contain Python function definitions`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);
    assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Part ${i + 1} must have at least 3 code notes`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);
  }

  // Domain specifics
  assert.ok(netLesson3.parts[0].code?.includes('evaluate_thread_mesh_partition_and_leader'));
  assert.ok(netLesson3.parts[0].output?.includes('THREAD IPV6 MESH TOPOLOGY & LEADER ELECTION'));
  assert.ok(netLesson3.parts[1].code?.includes('simulate_coap_blockwise_transfer'));
  assert.ok(netLesson3.parts[1].output?.includes('COAP BLOCKWISE TRANSFER (RFC 7959)'));
  assert.ok(netLesson3.parts[2].code?.includes('simulate_oscore_packet_protection'));
  assert.ok(netLesson3.parts[2].output?.includes('OSCORE END-TO-END APPLICATION SECURITY (RFC 8613)'));
  assert.ok(netLesson3.parts[3].code?.includes('simulate_thread_border_router_prefix_dissemination'));
  assert.ok(netLesson3.parts[3].output?.includes('THREAD BORDER ROUTER PREFIX DISSEMINATION'));
  assert.ok(netLesson3.parts[4].code?.includes('simulate_thread_commissioning_handshake'));
  assert.ok(netLesson3.parts[4].output?.includes('THREAD COMMISSIONING & SECURE CREDENTIAL DELIVERY'));
});


