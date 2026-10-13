import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';

test('IoT Edge & IoT Sec Long Lessons: Resolution & Language Invariants', () => {
  // 1. iot_edge
  const edgeLesson = getLongLesson('iot_edge', 1);
  assert.ok(edgeLesson, 'iot_edge Day 1 long lesson must resolve');
  assert.equal(edgeLesson.day, 1);
  assert.equal(edgeLesson.parts.length, 5, 'iot_edge Day 1 must contain exactly 5 parts');
  assert.ok(edgeLesson.summary.length >= 4, 'iot_edge Day 1 must contain comprehensive summary');
  assert.ok(edgeLesson.projectStep, 'iot_edge Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('iot_edge'), 'python');

  const edgeLesson2 = getLongLesson('iot_edge', 2);
  assert.ok(edgeLesson2, 'iot_edge Day 2 long lesson must resolve');
  assert.equal(edgeLesson2.day, 2);
  assert.equal(edgeLesson2.parts.length, 5, 'iot_edge Day 2 must contain exactly 5 parts');

  const edgeLesson3 = getLongLesson('iot_edge', 3);
  assert.ok(edgeLesson3, 'iot_edge Day 3 long lesson must resolve');
  assert.equal(edgeLesson3.day, 3);
  assert.equal(edgeLesson3.parts.length, 5, 'iot_edge Day 3 must contain exactly 5 parts');

  const edgeLesson4 = getLongLesson('iot_edge', 4);
  assert.ok(edgeLesson4, 'iot_edge Day 4 long lesson must resolve');
  assert.equal(edgeLesson4.day, 4);
  assert.equal(edgeLesson4.parts.length, 5, 'iot_edge Day 4 must contain exactly 5 parts');

  const edgeLesson5 = getLongLesson('iot_edge', 5);
  assert.ok(edgeLesson5, 'iot_edge Day 5 long lesson must resolve');
  assert.equal(edgeLesson5.day, 5);
  assert.equal(edgeLesson5.parts.length, 5, 'iot_edge Day 5 must contain exactly 5 parts');

  // 2. iot_sec
  const secLesson = getLongLesson('iot_sec', 1);
  assert.ok(secLesson, 'iot_sec Day 1 long lesson must resolve');
  assert.equal(secLesson.day, 1);
  assert.equal(secLesson.parts.length, 5, 'iot_sec Day 1 must contain exactly 5 parts');
  assert.ok(secLesson.summary.length >= 4, 'iot_sec Day 1 must contain comprehensive summary');
  assert.ok(secLesson.projectStep, 'iot_sec Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('iot_sec'), 'python');

  const secLesson2 = getLongLesson('iot_sec', 2);
  assert.ok(secLesson2, 'iot_sec Day 2 long lesson must resolve');
  assert.equal(secLesson2.day, 2);
  assert.equal(secLesson2.parts.length, 5, 'iot_sec Day 2 must contain exactly 5 parts');

  const secLesson3 = getLongLesson('iot_sec', 3);
  assert.ok(secLesson3, 'iot_sec Day 3 long lesson must resolve');
  assert.equal(secLesson3.day, 3);
  assert.equal(secLesson3.parts.length, 5, 'iot_sec Day 3 must contain exactly 5 parts');
});

test('IoT Edge Day 1: Edge AI & INT8 Quantization Python Code Snippets & Socratic Checks Verification', () => {
  const edgeLesson = getLongLesson('iot_edge', 1);
  assert.ok(edgeLesson);

  for (const part of edgeLesson.parts) {
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

test('IoT Sec Day 1: Hardware Root of Trust & Secure Boot Python Code Snippets & Socratic Checks Verification', () => {
  const secLesson = getLongLesson('iot_sec', 1);
  assert.ok(secLesson);

  for (const part of secLesson.parts) {
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

test('IoT Edge Day 2: Depthwise Convolutions, Autoencoders, Pruning, MCUNet & Log-Mel Snippets Verification', () => {
  const edgeLesson2 = getLongLesson('iot_edge', 2);
  assert.ok(edgeLesson2, 'iot_edge Day 2 must resolve');
  assert.equal(edgeLesson2.day, 2);
  assert.equal(edgeLesson2.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(edgeLesson2);
  const totalMin = estimateLessonMinutes(edgeLesson2);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < edgeLesson2.parts.length; i++) {
    const part = edgeLesson2.parts[i];
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
  assert.ok(edgeLesson2.parts[0].code?.includes('calculate_depthwise_separable_macs'));
  assert.ok(edgeLesson2.parts[1].code?.includes('evaluate_autoencoder_reconstruction_anomaly'));
  assert.ok(edgeLesson2.parts[2].code?.includes('simulate_structured_weight_pruning'));
  assert.ok(edgeLesson2.parts[3].code?.includes('calculate_peak_sram_activation_footprint'));
  assert.ok(edgeLesson2.parts[4].code?.includes('compute_log_mel_spectrogram_features'));
});

test('IoT Sec Day 2: HKDF Key Derivation, AES-GCM AEAD, DPA Masking, Tamper Zeroization & Anti-Replay Snippets Verification', () => {
  const secLesson2 = getLongLesson('iot_sec', 2);
  assert.ok(secLesson2, 'iot_sec Day 2 must resolve');
  assert.equal(secLesson2.day, 2);
  assert.equal(secLesson2.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(secLesson2);
  const totalMin = estimateLessonMinutes(secLesson2);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < secLesson2.parts.length; i++) {
    const part = secLesson2.parts[i];
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
  assert.ok(secLesson2.parts[0].code?.includes('derive_hkdf_domain_keys'));
  assert.ok(secLesson2.parts[1].code?.includes('simulate_aes_gcm_aead_pipeline'));
  assert.ok(secLesson2.parts[2].code?.includes('simulate_dpa_boolean_masking'));
  assert.ok(secLesson2.parts[3].code?.includes('evaluate_hardware_tamper_and_zeroization'));
  assert.ok(secLesson2.parts[4].code?.includes('AntiReplaySlidingWindow'));
});

test('IoT Edge Day 3: TFLM FlatBuffers, Zero-Allocation, Static Tensor Arena & Op Resolvers Verification', () => {
  const edgeLesson3 = getLongLesson('iot_edge', 3);
  assert.ok(edgeLesson3, 'iot_edge Day 3 must resolve');
  assert.equal(edgeLesson3.day, 3);
  assert.equal(edgeLesson3.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(edgeLesson3);
  const totalMin = estimateLessonMinutes(edgeLesson3);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < edgeLesson3.parts.length; i++) {
    const part = edgeLesson3.parts[i];
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
  assert.ok(edgeLesson3.parts[0].code?.includes('simulate_tflite_flatbuffer_metadata'));
  assert.ok(edgeLesson3.parts[0].output?.includes('TFLM FLATBUFFERS SCHEMA METADATA'));
  assert.ok(edgeLesson3.parts[1].code?.includes('evaluate_zero_heap_interpreter_safety'));
  assert.ok(edgeLesson3.parts[1].output?.includes('ZERO DYNAMIC ALLOCATION SAFETY AUDIT'));
  assert.ok(edgeLesson3.parts[2].code?.includes('allocate_static_tensor_arena'));
  assert.ok(edgeLesson3.parts[2].output?.includes('STATIC TENSOR ARENA ALLOCATION PLAN'));
  assert.ok(edgeLesson3.parts[3].code?.includes('calculate_op_resolver_flash_savings'));
  assert.ok(edgeLesson3.parts[3].output?.includes('MICROMUTABLEOPRESOLVER FLASH FOOTPRINT'));
  assert.ok(edgeLesson3.parts[4].code?.includes('plan_activation_ping_pong_offsets'));
  assert.ok(edgeLesson3.parts[4].output?.includes('ACTIVATION PING-PONG MEMORY REUSE PLAN'));
});

test('IoT Edge Day 4: Post-Training Quantization, Affine Mapping, Scales, Zero-Points & Per-Channel Verification', () => {
  const edgeLesson4 = getLongLesson('iot_edge', 4);
  assert.ok(edgeLesson4, 'iot_edge Day 4 must resolve');
  assert.equal(edgeLesson4.day, 4);
  assert.equal(edgeLesson4.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(edgeLesson4);
  const totalMin = estimateLessonMinutes(edgeLesson4);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < edgeLesson4.parts.length; i++) {
    const part = edgeLesson4.parts[i];
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
  assert.ok(edgeLesson4.parts[0].code?.includes('quantize_affine_float32_to_int8'));
  assert.ok(edgeLesson4.parts[0].output?.includes('UNIFORM AFFINE INT8 QUANTIZATION ENGINE'));
  assert.ok(edgeLesson4.parts[1].code?.includes('compare_symmetric_vs_asymmetric_quantization'));
  assert.ok(edgeLesson4.parts[1].output?.includes('SYMMETRIC VS ASYMMETRIC QUANTIZATION'));
  assert.ok(edgeLesson4.parts[2].code?.includes('calibrate_quantization_parameters'));
  assert.ok(edgeLesson4.parts[2].output?.includes('REPRESENTATIVE CALIBRATION DATASET AUDIT'));
  assert.ok(edgeLesson4.parts[3].code?.includes('evaluate_per_channel_quantization_error'));
  assert.ok(edgeLesson4.parts[3].output?.includes('PER-TENSOR VS PER-CHANNEL QUANTIZATION'));
  assert.ok(edgeLesson4.parts[4].code?.includes('simulate_fixed_point_integer_mac'));
  assert.ok(edgeLesson4.parts[4].output?.includes('FIXED-POINT INTEGER MAC EXECUTION'));
});

test('IoT Edge Day 5 Capstone: Production INT8 Inference Kernel, Fused ReLU & Softmax Decision Verification', () => {
  const edgeLesson5 = getLongLesson('iot_edge', 5);
  assert.ok(edgeLesson5, 'iot_edge Day 5 must resolve');
  assert.equal(edgeLesson5.day, 5);
  assert.equal(edgeLesson5.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(edgeLesson5);
  const totalMin = estimateLessonMinutes(edgeLesson5);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < edgeLesson5.parts.length; i++) {
    const part = edgeLesson5.parts[i];
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
  assert.ok(edgeLesson5.parts[0].code?.includes('ingest_flatbuffer_model_and_bind_arena'));
  assert.ok(edgeLesson5.parts[0].output?.includes('TFLM ENGINE MODEL INGESTION & ARENA BINDING'));
  assert.ok(edgeLesson5.parts[1].code?.includes('execute_int8_matrix_multiply_kernel'));
  assert.ok(edgeLesson5.parts[1].output?.includes('INT8 SYMMETRIC WEIGHT MAC INNER CORE'));
  assert.ok(edgeLesson5.parts[2].code?.includes('rescale_and_clamp_layer_activations'));
  assert.ok(edgeLesson5.parts[2].output?.includes('FIXED-POINT RESCALING & CLAMPED ACTIVATIONS'));
  assert.ok(edgeLesson5.parts[3].code?.includes('execute_integer_softmax_decision'));
  assert.ok(edgeLesson5.parts[3].output?.includes('INTEGER SOFTMAX DECISION ENGINE'));
  assert.ok(edgeLesson5.parts[4].code?.includes('benchmark_end_to_end_edge_inference'));
  assert.ok(edgeLesson5.parts[4].output?.includes('TINYML INFERENCE CYCLE BENCHMARK'));
});

test('IoT Sec Day 3: Hardware Crypto Engines, ChaCha20 ARX, Constant-Time & Glitch Protection Verification', () => {
  const secLesson3 = getLongLesson('iot_sec', 3);
  assert.ok(secLesson3, 'iot_sec Day 3 must resolve');
  assert.equal(secLesson3.day, 3);
  assert.equal(secLesson3.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(secLesson3);
  const totalMin = estimateLessonMinutes(secLesson3);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < secLesson3.parts.length; i++) {
    const part = secLesson3.parts[i];
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
  assert.ok(secLesson3.parts[0].code?.includes('evaluate_hardware_crypto_engine_throughput'));
  assert.ok(secLesson3.parts[0].output?.includes('HARDWARE CRYPTO ENGINE VS SOFTWARE EMULATION'));
  assert.ok(secLesson3.parts[1].code?.includes('simulate_chacha20_quarter_round'));
  assert.ok(secLesson3.parts[1].output?.includes('CHACHA20 ARX QUARTER-ROUND KERNEL'));
  assert.ok(secLesson3.parts[2].code?.includes('constant_time_memcmp_audit'));
  assert.ok(secLesson3.parts[2].output?.includes('CONSTANT-TIME TIMING ATTACK MITIGATION'));
  assert.ok(secLesson3.parts[3].code?.includes('evaluate_voltage_clock_glitch_detector'));
  assert.ok(secLesson3.parts[3].output?.includes('HARDWARE FAULT INJECTION GLITCH DETECTOR'));
  assert.ok(secLesson3.parts[4].code?.includes('validate_redundant_control_flow_integrity'));
  assert.ok(secLesson3.parts[4].output?.includes('CONTROL FLOW INTEGRITY (CFI) DUAL-TOKEN AUDIT'));
});





