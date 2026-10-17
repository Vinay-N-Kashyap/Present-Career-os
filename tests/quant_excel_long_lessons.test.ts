import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';
import { inspectCppSource } from '../src/lib/code/runners/cppRunner';

test('Quant & Excel Long Lessons: Resolution & Structural Invariants', () => {
  // 1. quant-systems
  const quantLesson = getLongLesson('quant-systems', 1);
  assert.ok(quantLesson, 'quant-systems Day 1 long lesson must resolve');
  assert.equal(quantLesson.day, 1);
  assert.equal(quantLesson.parts.length, 5, 'quant-systems Day 1 must contain exactly 5 parts');
  assert.ok(quantLesson.summary.length >= 4, 'quant-systems Day 1 must contain comprehensive summary');
  assert.ok(quantLesson.projectStep, 'quant-systems Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('quant-systems'), 'cpp');

  const quantLesson2 = getLongLesson('quant-systems', 2);
  assert.ok(quantLesson2, 'quant-systems Day 2 long lesson must resolve');
  assert.equal(quantLesson2.day, 2);
  assert.equal(quantLesson2.parts.length, 5, 'quant-systems Day 2 must contain exactly 5 parts');

  const quantLesson3 = getLongLesson('quant-systems', 3);
  assert.ok(quantLesson3, 'quant-systems Day 3 long lesson must resolve');
  assert.equal(quantLesson3.day, 3);
  assert.equal(quantLesson3.parts.length, 5, 'quant-systems Day 3 must contain exactly 5 parts');

  const quantLesson4 = getLongLesson('quant-systems', 4);
  assert.ok(quantLesson4, 'quant-systems Day 4 long lesson must resolve');
  assert.equal(quantLesson4.day, 4);
  assert.equal(quantLesson4.parts.length, 5, 'quant-systems Day 4 must contain exactly 5 parts');

  const quantLesson5 = getLongLesson('quant-systems', 5);
  assert.ok(quantLesson5, 'quant-systems Day 5 long lesson must resolve');
  assert.equal(quantLesson5.day, 5);
  assert.equal(quantLesson5.parts.length, 5, 'quant-systems Day 5 must contain exactly 5 parts');

  for (let d = 6; d <= 30; d++) {
    const ql = getLongLesson('quant-systems', d);
    assert.ok(ql, `quant-systems Day ${d} long lesson must resolve`);
    assert.equal(ql.day, d);
    assert.equal(ql.parts.length, 5, `quant-systems Day ${d} must contain exactly 5 parts`);
    assert.ok(ql.summary.length >= 4, `quant-systems Day ${d} summary must be comprehensive`);
    assert.ok(ql.projectStep, `quant-systems Day ${d} must have a hands-on project step`);
  }


  // 2. excel_viz
  const excelLesson = getLongLesson('excel_viz', 1);
  assert.ok(excelLesson, 'excel_viz Day 1 long lesson must resolve');
  assert.equal(excelLesson.day, 1);
  assert.equal(excelLesson.parts.length, 5, 'excel_viz Day 1 must contain exactly 5 parts');
  assert.ok(excelLesson.summary.length >= 4, 'excel_viz Day 1 must contain comprehensive summary');
  assert.ok(excelLesson.projectStep, 'excel_viz Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('excel_viz'), 'python');

  const excelLesson4 = getLongLesson('excel_viz', 4);
  assert.ok(excelLesson4, 'excel_viz Day 4 long lesson must resolve');
  assert.equal(excelLesson4.day, 4);
  assert.equal(excelLesson4.parts.length, 5, 'excel_viz Day 4 must contain exactly 5 parts');

  const excelLesson5 = getLongLesson('excel_viz', 5);
  assert.ok(excelLesson5, 'excel_viz Day 5 long lesson must resolve');
  assert.equal(excelLesson5.day, 5);
  assert.equal(excelLesson5.parts.length, 5, 'excel_viz Day 5 must contain exactly 5 parts');

  for (let d = 6; d <= 60; d++) {
    const el = getLongLesson('excel_viz', d);
    assert.ok(el, `excel_viz Day ${d} long lesson must resolve`);
    assert.equal(el.day, d);
    assert.equal(el.parts.length, 5, `excel_viz Day ${d} must contain exactly 5 parts`);
    assert.ok(el.summary.length >= 4, `excel_viz Day ${d} must have comprehensive summary`);
    assert.ok(el.projectStep, `excel_viz Day ${d} must have projectStep`);
  }

  // 3. ai_prompt aliasing
  const promptLesson = getLongLesson('ai_prompt', 1);
  assert.ok(promptLesson, 'ai_prompt Day 1 long lesson must resolve via aliasing');
  assert.ok(promptLesson.parts.length >= 3, 'ai_prompt Day 1 must have multiple lesson parts');
  assert.equal(getLongLessonLanguage('ai_prompt'), 'python');
});

test('Quant Systems Day 1: C++ Code Snippets Satisfy AST Structural Invariants', () => {
  const quantLesson = getLongLesson('quant-systems', 1);
  assert.ok(quantLesson);

  for (const part of quantLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);

    // Verify Socratic MCQ Check
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');

    // Run structural AST inspection on C++ code
    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }
});

test('Excel Viz Day 1: Python Data Snippets & Socratic Checks Verification', () => {
  const excelLesson = getLongLesson('excel_viz', 1);
  assert.ok(excelLesson);

  for (const part of excelLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable Python code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);

    // Verify Socratic MCQ Check
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');

    // Verify code does not contain syntax-breaking blank statements
    assert.ok(part.code.includes('print('), `Python code in '${part.title}' must print results`);
  }
});

test('Quant Systems Day 2: Kernel Bypass, SIMD Vectorized VWAP, Micro-Price & FIX Protocol Verification', () => {
  const quantLesson2 = getLongLesson('quant-systems', 2);
  assert.ok(quantLesson2, 'quant-systems Day 2 must resolve');
  assert.equal(quantLesson2.day, 2);
  assert.equal(quantLesson2.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(quantLesson2);
  const totalMin = estimateLessonMinutes(quantLesson2);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < quantLesson2.parts.length; i++) {
    const part = quantLesson2.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    // Run structural AST inspection on C++ code
    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  // Domain specifics
  assert.ok(quantLesson2.parts[0].code?.includes('pollKernelBypassRing'));
  assert.ok(quantLesson2.parts[1].code?.includes('calculateVectorizedVwap'));
  assert.ok(quantLesson2.parts[2].code?.includes('calculateMicroPriceAndObi'));
  assert.ok(quantLesson2.parts[3].code?.includes('calculateAlmgrenChrissCost'));
  assert.ok(quantLesson2.parts[4].code?.includes('calculateFixChecksum'));
});

test('Excel Viz Day 2: Dynamic Array Spill, Monte Carlo, Power Pivot DAX & Sensitivity Bridges Verification', () => {
  const excelLesson2 = getLongLesson('excel_viz', 2);
  assert.ok(excelLesson2, 'excel_viz Day 2 must resolve');
  assert.equal(excelLesson2.day, 2);
  assert.equal(excelLesson2.parts.length, 5, 'excel_viz Day 2 must contain exactly 5 parts');
  assert.ok(excelLesson2.summary.length >= 4, 'excel_viz Day 2 must have comprehensive summary');
  assert.ok(excelLesson2.projectStep, 'excel_viz Day 2 must have projectStep');
  assert.ok(excelLesson2.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(excelLesson2);
  const totalMin = estimateLessonMinutes(excelLesson2);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < excelLesson2.parts.length; i++) {
    const part = excelLesson2.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('print('), `Part ${i + 1} code must print results`);
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
  assert.ok(excelLesson2.parts[0].code?.includes('simulate_dynamic_arrays'));
  assert.ok(excelLesson2.parts[0].output?.includes('MODERN EXCEL DYNAMIC ARRAY SPILL ENGINE'));
  assert.ok(excelLesson2.parts[1].code?.includes('simulate_monte_carlo'));
  assert.ok(excelLesson2.parts[1].output?.includes('MONTE CARLO PROBABILISTIC EBITDA RISK PROFILE'));
  assert.ok(excelLesson2.parts[2].code?.includes('evaluate_star_schema_dax'));
  assert.ok(excelLesson2.parts[2].output?.includes('POWER PIVOT STAR SCHEMA & DAX MEASURE ENGINE'));
  assert.ok(excelLesson2.parts[3].code?.includes('calculate_dcf_sensitivity'));
  assert.ok(excelLesson2.parts[3].output?.includes('TWO-WAY DCF VALUATION SENSITIVITY TABLE'));
  assert.ok(excelLesson2.parts[4].code?.includes('render_ebitda_waterfall'));
  assert.ok(excelLesson2.parts[4].output?.includes('EXECUTIVE FINANCIAL WATERFALL (EBITDA BRIDGE)'));
});

test('Excel Viz Day 3: Power Query M, LAMBDAs, 3-Statement Model, Scenario Switchboard & Executive Dashboards', () => {
  const excelLesson3 = getLongLesson('excel_viz', 3);
  assert.ok(excelLesson3, 'excel_viz Day 3 must resolve');
  assert.equal(excelLesson3.day, 3);
  assert.equal(excelLesson3.parts.length, 5, 'excel_viz Day 3 must contain exactly 5 parts');
  assert.ok(excelLesson3.summary.length >= 4, 'excel_viz Day 3 must have comprehensive summary');
  assert.ok(excelLesson3.projectStep, 'excel_viz Day 3 must have projectStep');
  assert.ok(excelLesson3.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(excelLesson3);
  const totalMin = estimateLessonMinutes(excelLesson3);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < excelLesson3.parts.length; i++) {
    const part = excelLesson3.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('print('), `Part ${i + 1} code must print results`);
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
  assert.ok(excelLesson3.parts[0].code?.includes('simulate_power_query_m_pipeline'));
  assert.ok(excelLesson3.parts[0].output?.includes('POWER QUERY DECLARATIVE M UNPIVOT PIPELINE'));
  assert.ok(excelLesson3.parts[1].code?.includes('evaluate_excel_lambda_compounding'));
  assert.ok(excelLesson3.parts[1].output?.includes('EXCEL LAMBDA SCAN & COMPOUNDING RECURSION'));
  assert.ok(excelLesson3.parts[2].code?.includes('simulate_three_statement_model'));
  assert.ok(excelLesson3.parts[2].output?.includes('INTEGRATED 3-STATEMENT FINANCIAL MODEL'));
  assert.ok(excelLesson3.parts[3].code?.includes('evaluate_financial_scenarios'));
  assert.ok(excelLesson3.parts[3].output?.includes('DYNAMIC SCENARIO SWITCHBOARD'));
  assert.ok(excelLesson3.parts[4].code?.includes('render_executive_kpi_dashboard'));
  assert.ok(excelLesson3.parts[4].output?.includes('C-SUITE EXECUTIVE PERFORMANCE DASHBOARD'));
});

test('Quant Systems Day 3: Limit Order Book, Avellaneda-Stoikov, OTR & PTP Verification', () => {
  const quantLesson3 = getLongLesson('quant-systems', 3);
  assert.ok(quantLesson3, 'quant-systems Day 3 must resolve');
  assert.equal(quantLesson3.day, 3);
  assert.equal(quantLesson3.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(quantLesson3);
  const totalMin = estimateLessonMinutes(quantLesson3);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < quantLesson3.parts.length; i++) {
    const part = quantLesson3.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    // Run structural AST inspection on C++ code
    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  // Domain specifics
  assert.ok(quantLesson3.parts[0].code?.includes('executePriceTimeMatch'));
  assert.ok(quantLesson3.parts[1].code?.includes('calculateAvellanedaStoikovQuotes'));
  assert.ok(quantLesson3.parts[2].code?.includes('calculateOrderToTradeRatio'));
  assert.ok(quantLesson3.parts[3].code?.includes('calculatePtpOneWayDelay'));
  assert.ok(quantLesson3.parts[4].code?.includes('calculateOrnsteinUhlenbeckZScore'));
});

test('Quant Systems Day 4: Kernel Bypass, PTP Clock, FPGA Risk & SPSC Ring Buffer Verification', () => {
  const quantLesson4 = getLongLesson('quant-systems', 4);
  assert.ok(quantLesson4, 'quant-systems Day 4 must resolve');
  assert.equal(quantLesson4.day, 4);
  assert.equal(quantLesson4.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(quantLesson4);
  const totalMin = estimateLessonMinutes(quantLesson4);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < quantLesson4.parts.length; i++) {
    const part = quantLesson4.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    // Run structural AST inspection on C++ code
    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  // Domain specifics
  assert.ok(quantLesson4.parts[0].code?.includes('evaluateKernelBypassLatency'));
  assert.ok(quantLesson4.parts[1].code?.includes('calculatePtpClockOffset'));
  assert.ok(quantLesson4.parts[2].code?.includes('evaluateFpgaPreTradeRisk'));
  assert.ok(quantLesson4.parts[3].code?.includes('pushSpscRingBuffer'));
  assert.ok(quantLesson4.parts[4].code?.includes('benchmarkHotPathLatency'));
});

test('Quant Systems Day 5: SOR, Cross-Venue Transit, Johansen VECM, Expected Shortfall & Kill Switch', () => {
  const quantLesson5 = getLongLesson('quant-systems', 5);
  assert.ok(quantLesson5, 'quant-systems Day 5 must resolve');
  assert.equal(quantLesson5.day, 5);
  assert.equal(quantLesson5.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(quantLesson5);
  const totalMin = estimateLessonMinutes(quantLesson5);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < quantLesson5.parts.length; i++) {
    const part = quantLesson5.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    // Run structural AST inspection on C++ code
    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  // Domain specifics
  assert.ok(quantLesson5.parts[0].code?.includes('allocateSmartOrderRoute'));
  assert.ok(quantLesson5.parts[1].code?.includes('calculateCrossVenueArrivalTime'));
  assert.ok(quantLesson5.parts[2].code?.includes('calculateVecmHalfLife'));
  assert.ok(quantLesson5.parts[3].code?.includes('calculateExpectedShortfall'));
  assert.ok(quantLesson5.parts[4].code?.includes('evaluateAlgorithmicKillSwitch'));
});

test('Excel Viz Day 4: DCF Valuation, WACC, LBO Debt Waterfall & M&A Accretion Verification', () => {
  const excelLesson4 = getLongLesson('excel_viz', 4);
  assert.ok(excelLesson4, 'excel_viz Day 4 must resolve');
  assert.equal(excelLesson4.day, 4);
  assert.equal(excelLesson4.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(excelLesson4);
  const totalMin = estimateLessonMinutes(excelLesson4);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < excelLesson4.parts.length; i++) {
    const part = excelLesson4.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('def '), `Part ${i + 1} code must define Python functions`);
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
  assert.ok(excelLesson4.parts[0].code?.includes('simulate_dcf_unlevered_fcf'));
  assert.ok(excelLesson4.parts[0].output?.includes('DCF VALUATION & UFCF MODEL'));
  assert.ok(excelLesson4.parts[1].code?.includes('calculate_wacc_capital_structure'));
  assert.ok(excelLesson4.parts[1].output?.includes('WACC CAPITAL STRUCTURE ANALYSIS'));
  assert.ok(excelLesson4.parts[2].code?.includes('simulate_lbo_debt_waterfall'));
  assert.ok(excelLesson4.parts[2].output?.includes('LBO RETURN WATERFALL & IRR ENGINE'));
  assert.ok(excelLesson4.parts[3].code?.includes('generate_two_way_sensitivity_surface'));
  assert.ok(excelLesson4.parts[3].output?.includes('DYNAMIC 2-WAY SENSITIVITY SURFACE'));
  assert.ok(excelLesson4.parts[4].code?.includes('evaluate_ma_accretion_dilution'));
  assert.ok(excelLesson4.parts[4].output?.includes('M&A ACCRETION / DILUTION & SYNERGIES MODEL'));
});

test('Excel Viz Day 5: Financial Modeling Audit, Circularity Breakers, Monte Carlo VaR & FAST Governance', () => {
  const excelLesson5 = getLongLesson('excel_viz', 5);
  assert.ok(excelLesson5, 'excel_viz Day 5 must resolve');
  assert.equal(excelLesson5.day, 5);
  assert.equal(excelLesson5.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(excelLesson5);
  const totalMin = estimateLessonMinutes(excelLesson5);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < excelLesson5.parts.length; i++) {
    const part = excelLesson5.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('def '), `Part ${i + 1} code must define Python functions`);
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
  assert.ok(excelLesson5.parts[0].code?.includes('evaluate_balance_sheet_integrity'));
  assert.ok(excelLesson5.parts[0].output?.includes('BALANCE SHEET INTEGRITY & CIRCULARITY AUDIT'));
  assert.ok(excelLesson5.parts[1].code?.includes('simulate_monte_carlo_portfolio_var'));
  assert.ok(excelLesson5.parts[1].output?.includes('MONTE CARLO VALUE-AT-RISK DISTRIBUTION'));
  assert.ok(excelLesson5.parts[2].code?.includes('generate_ebitda_cash_flow_bridge'));
  assert.ok(excelLesson5.parts[2].output?.includes('EBITDA-TO-FREE-CASH-FLOW WATERFALL BRIDGE'));
  assert.ok(excelLesson5.parts[3].code?.includes('generate_tornado_sensitivity_ranking'));
  assert.ok(excelLesson5.parts[3].output?.includes('TORNADO SENSITIVITY DRIVER RANKING'));
  assert.ok(excelLesson5.parts[4].code?.includes('validate_fast_standard_model_governance'));
  assert.ok(excelLesson5.parts[4].output?.includes('BOARDROOM FINANCIAL MODEL AUDIT GOVERNANCE'));
});

test('Quant Systems Day 6: Market Data Feeds, ITCH/OUCH Binary Protocols, MoldUDP64 & Zero-Copy Deserialization', () => {
  const lesson = getLongLesson('quant-systems', 6);
  assert.ok(lesson, 'quant-systems Day 6 must resolve');
  assert.equal(lesson.day, 6);
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
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  assert.ok(lesson.parts[0].code?.includes('MoldHeader'));
  assert.ok(lesson.parts[1].code?.includes('ItchAddOrderMsg'));
  assert.ok(lesson.parts[2].code?.includes('GapDetector'));
  assert.ok(lesson.parts[3].code?.includes('OuchEnterOrderMsg'));
  assert.ok(lesson.parts[4].code?.includes('FastFeedHandler'));
});

test('Quant Systems Day 7: Fast Limit Order Book (LOB) Architecture, O(1) Price Ladder & Intrusive Queues', () => {
  const lesson = getLongLesson('quant-systems', 7);
  assert.ok(lesson, 'quant-systems Day 7 must resolve');
  assert.equal(lesson.day, 7);
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
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  assert.ok(lesson.parts[0].code?.includes('FlatPriceLadder'));
  assert.ok(lesson.parts[1].code?.includes('IntrusiveOrderQueue'));
  assert.ok(lesson.parts[2].code?.includes('BitmaskPriceLadder'));
  assert.ok(lesson.parts[3].code?.includes('Level2DepthSnapshot'));
  assert.ok(lesson.parts[4].code?.includes('MiniMatchingEngine'));
});

test('Quant Systems Day 8: Advanced Microstructure Alpha & High-Frequency Feature Engineering', () => {
  const lesson = getLongLesson('quant-systems', 8);
  assert.ok(lesson, 'quant-systems Day 8 must resolve');
  assert.equal(lesson.day, 8);
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
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  assert.ok(lesson.parts[0].code?.includes('OfiCalculator'));
  assert.ok(lesson.parts[1].code?.includes('VpinEngine'));
  assert.ok(lesson.parts[2].code?.includes('RecursiveHawkesTracker'));
  assert.ok(lesson.parts[3].code?.includes('LeadLagCorrelator'));
  assert.ok(lesson.parts[4].code?.includes('MicrostructureAlphaEngine'));
});

test('Quant Systems Day 9: FPGA Acceleration & Hardware Offloading: PCIe DMA, Kernel Bypass & NIC Co-Processing', () => {
  const lesson = getLongLesson('quant-systems', 9);
  assert.ok(lesson, 'quant-systems Day 9 must resolve');
  assert.equal(lesson.day, 9);
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
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  assert.ok(lesson.parts[0].code?.includes('inspectHeterogeneousArchitectures'));
  assert.ok(lesson.parts[1].code?.includes('inspectPcieDmaRing'));
  assert.ok(lesson.parts[2].code?.includes('inspectAxiStreamPipeline'));
  assert.ok(lesson.parts[3].code?.includes('inspectHardwareRiskFilter'));
  assert.ok(lesson.parts[4].code?.includes('inspectHybridGateway'));
});

test('Quant Systems Day 10: ⭐ Milestone 2 Capstone: Sub-Microsecond Multi-Asset High-Frequency Matching & Market Making Engine', () => {
  const lesson = getLongLesson('quant-systems', 10);
  assert.ok(lesson, 'quant-systems Day 10 must resolve');
  assert.equal(lesson.day, 10);
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
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  assert.ok(lesson.parts[0].code?.includes('inspectTier1NetworkEngine'));
  assert.ok(lesson.parts[1].code?.includes('inspectTier2OrderBook'));
  assert.ok(lesson.parts[2].code?.includes('inspectTier3AlphaEngine'));
  assert.ok(lesson.parts[3].code?.includes('inspectTier4StrategyEngine'));
  assert.ok(lesson.parts[4].code?.includes('inspectGrandMasterDefenseMatrix'));
});

test('Quant Systems Day 11: Algorithmic Execution: Almgren-Chriss Optimal Execution & Market Impact Theory', () => {
  const lesson = getLongLesson('quant-systems', 11);
  assert.ok(lesson, 'quant-systems Day 11 must resolve');
  assert.equal(lesson.day, 11);
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
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  assert.ok(lesson.parts[0].code?.includes('MarketImpactParameters'));
  assert.ok(lesson.parts[1].code?.includes('AlmgrenChrissParameters'));
  assert.ok(lesson.parts[2].code?.includes('OptimalTrajectoryPoint'));
  assert.ok(lesson.parts[3].code?.includes('AdaptiveRegimeState'));
  assert.ok(lesson.parts[4].code?.includes('ParentOrder'));
});

test('Quant Systems Day 12: Smart Order Routing (SOR) & Venue Microstructure: Maker-Taker Economics, Queue Position & Adverse Selection', () => {
  const lesson = getLongLesson('quant-systems', 12);
  assert.ok(lesson, 'quant-systems Day 12 must resolve');
  assert.equal(lesson.day, 12);
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
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  assert.ok(lesson.parts[0].code?.includes('FeeStructure'));
  assert.ok(lesson.parts[1].code?.includes('QueueState'));
  assert.ok(lesson.parts[2].code?.includes('ExecutionEvent'));
  assert.ok(lesson.parts[3].code?.includes('VenueBookDepth'));
  assert.ok(lesson.parts[4].code?.includes('VenueQuoteSnapshot'));
});

test('Quant Systems Day 13: Statistical Arbitrage & High-Frequency Pairs Trading: Cointegration, Kalman Filtering & Ornstein-Uhlenbeck Dynamics', () => {
  const lesson = getLongLesson('quant-systems', 13);
  assert.ok(lesson, 'quant-systems Day 13 must resolve');
  assert.equal(lesson.day, 13);
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
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  assert.ok(lesson.parts[0].code?.includes('CointegrationResult'));
  assert.ok(lesson.parts[1].code?.includes('KalmanState'));
  assert.ok(lesson.parts[2].code?.includes('OUParameters'));
  assert.ok(lesson.parts[3].code?.includes('LegExecutionReport'));
  assert.ok(lesson.parts[4].code?.includes('StatArbSignalEvent'));
});

test('Quant Systems Day 14: Dark Liquidity, Crossing Networks & Hidden Order Detection', () => {
  const lesson = getLongLesson('quant-systems', 14);
  assert.ok(lesson, 'quant-systems Day 14 must resolve');
  assert.equal(lesson.day, 14);
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
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  assert.ok(lesson.parts[0].code?.includes('LitMarketNBBO'));
  assert.ok(lesson.parts[1].code?.includes('L2QuoteUpdate'));
  assert.ok(lesson.parts[2].code?.includes('CounterpartyTier'));
  assert.ok(lesson.parts[3].code?.includes('DarkVenueProbe'));
  assert.ok(lesson.parts[4].code?.includes('DarkPoolParticipant'));
});

test('Quant Systems Day 15: ⭐ Milestone 3 Capstone: Sub-Microsecond Multi-Venue Smart Order Router & Optimal Execution Engine', () => {
  const lesson = getLongLesson('quant-systems', 15);
  assert.ok(lesson, 'quant-systems Day 15 must resolve');
  assert.equal(lesson.day, 15);
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
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  assert.ok(lesson.parts[0].code?.includes('ConsolidatedVenueState'));
  assert.ok(lesson.parts[1].code?.includes('IntervalSlicePlan'));
  assert.ok(lesson.parts[2].code?.includes('VenueQuote'));
  assert.ok(lesson.parts[3].code?.includes('DarkPoolCandidate'));
  assert.ok(lesson.parts[4].code?.includes('CapstoneIntervalTelemetry'));
});

test('Quant Systems Day 16: Order Flow Toxicity, VPIN & Adverse Selection Modeling', () => {
  const lesson = getLongLesson('quant-systems', 16);
  assert.ok(lesson, 'quant-systems Day 16 must resolve');
  assert.equal(lesson.day, 16);
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
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  assert.ok(lesson.parts[0].code?.includes('VolumeClockEngine'));
  assert.ok(lesson.parts[1].code?.includes('BvcClassifier'));
  assert.ok(lesson.parts[2].code?.includes('VpinEngine'));
  assert.ok(lesson.parts[3].code?.includes('AdverseSelectionDefense'));
  assert.ok(lesson.parts[4].code?.includes('ProductionFlowToxicityShield'));
});

test('Quant Systems Day 17: Multivariate Cointegration, Vector Error Correction Models (VECM) & Multi-Asset Statistical Arbitrage', () => {
  const lesson = getLongLesson('quant-systems', 17);
  assert.ok(lesson, 'quant-systems Day 17 must resolve');
  assert.equal(lesson.day, 17);
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
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  assert.ok(lesson.parts[0].code?.includes('AdfTestEngine'));
  assert.ok(lesson.parts[1].code?.includes('JohansenEngine'));
  assert.ok(lesson.parts[2].code?.includes('VecmEngine'));
  assert.ok(lesson.parts[3].code?.includes('BasketAllocator'));
  assert.ok(lesson.parts[4].code?.includes('ProductionBasketArbEngine'));
});

test('Quant Systems Day 18: Multidimensional Kalman Filtering & Real-Time Dynamic Beta Hedging', () => {
  const lesson = getLongLesson('quant-systems', 18);
  assert.ok(lesson, 'quant-systems Day 18 must resolve');
  assert.equal(lesson.day, 18);
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
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  assert.ok(lesson.parts[0].code?.includes('StateSpaceModel'));
  assert.ok(lesson.parts[1].code?.includes('KalmanFilterPairs'));
  assert.ok(lesson.parts[2].code?.includes('AdaptiveKalmanTuner'));
  assert.ok(lesson.parts[3].code?.includes('MultiFactorBetaHedger'));
  assert.ok(lesson.parts[4].code?.includes('ProductionKalmanEngine'));
});

test('Quant Systems Day 19: Tick-Level FIFO Queue Position Estimation & Cancellation Hazard Models', () => {
  const lesson = getLongLesson('quant-systems', 19);
  assert.ok(lesson, 'quant-systems Day 19 must resolve');
  assert.equal(lesson.day, 19);
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
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  assert.ok(lesson.parts[0].code?.includes('FIFOQueueModelL2'));
  assert.ok(lesson.parts[1].code?.includes('QueueAdvancementTracker'));
  assert.ok(lesson.parts[2].code?.includes('QueueSurvivalEngine'));
  assert.ok(lesson.parts[3].code?.includes('QuoteRepostingEngine'));
  assert.ok(lesson.parts[4].code?.includes('ProductionQueueTracker'));
});

test('Quant Systems Day 20: ⭐ Milestone 4 Capstone: Real-Time High-Frequency Alpha Signal & Dynamic Hedging Engine', () => {
  const lesson = getLongLesson('quant-systems', 20);
  assert.ok(lesson, 'quant-systems Day 20 must resolve');
  assert.equal(lesson.day, 20);
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
    assert.ok(part.code && part.code.includes('#include'), `Part ${i + 1} code must contain valid C++ headers`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 0, `Part ${i + 1} check explanation must be non-empty`);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true, `C++ code in '${part.title}' must have valid signature`);
    assert.equal(inspection.hasHeaders, true, `C++ code in '${part.title}' must include standard headers`);
    assert.equal(inspection.hasReturn, true, `C++ code in '${part.title}' must include explicit return statement`);
    assert.equal(inspection.syntaxViolations.length, 0, `C++ code in '${part.title}' must have zero syntax violations`);
  }

  assert.ok(lesson.parts[0].code?.includes('Milestone4PlatformConfig'));
  assert.ok(lesson.parts[1].code?.includes('RealTimeVPINFilter'));
  assert.ok(lesson.parts[2].code?.includes('OnlineCointegrationTracker'));
  assert.ok(lesson.parts[3].code?.includes('SubMicrosecondKalmanHedger'));
  assert.ok(lesson.parts[4].code?.includes('GrandMasterMilestone4Engine'));
});
test('Quant Systems Day 21: Quantitative Derivatives Pricing: Black-Scholes-Merton & Implied Volatility', () => {
  const lesson = getLongLesson('quant-systems', 21);
  assert.ok(lesson, 'quant-systems Day 21 must resolve');
  assert.equal(lesson.day, 21);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('#include'));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 0);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 0);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true);
    assert.equal(inspection.hasHeaders, true);
    assert.equal(inspection.hasReturn, true);
    assert.equal(inspection.syntaxViolations.length, 0);
  }

  assert.ok(lesson.parts[0].code?.includes('BsmPdeEngine'));
  assert.ok(lesson.parts[1].code?.includes('BsmGreeksDeltaVega'));
  assert.ok(lesson.parts[2].code?.includes('BsmGreeksGammaCross'));
  assert.ok(lesson.parts[3].code?.includes('NewtonRaphsonIvSolver'));
  assert.ok(lesson.parts[4].code?.includes('ProductionDerivativesPricer'));
});

test('Quant Systems Day 22: Multi-Asset Portfolio Risk: Parametric VaR, Historical Simulation & Expected Shortfall', () => {
  const lesson = getLongLesson('quant-systems', 22);
  assert.ok(lesson, 'quant-systems Day 22 must resolve');
  assert.equal(lesson.day, 22);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8);
  assert.ok(totalMin >= 15);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('#include'));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 0);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 0);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true);
    assert.equal(inspection.hasHeaders, true);
    assert.equal(inspection.hasReturn, true);
    assert.equal(inspection.syntaxViolations.length, 0);
  }

  assert.ok(lesson.parts[0].code?.includes('ParametricVarEngine'));
  assert.ok(lesson.parts[1].code?.includes('HistoricalVarEngine'));
  assert.ok(lesson.parts[2].code?.includes('ExpectedShortfallEngine'));
  assert.ok(lesson.parts[3].code?.includes('EvtPeaksOverThreshold'));
  assert.ok(lesson.parts[4].code?.includes('ProductionMultiAssetRiskEngine'));
});

test('Quant Systems Day 23: Extreme Tail Risk Stress Testing: Basel III / FRTB & Correlated Monte Carlo', () => {
  const lesson = getLongLesson('quant-systems', 23);
  assert.ok(lesson, 'quant-systems Day 23 must resolve');
  assert.equal(lesson.day, 23);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8);
  assert.ok(totalMin >= 15);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('#include'));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 0);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 0);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true);
    assert.equal(inspection.hasHeaders, true);
    assert.equal(inspection.hasReturn, true);
    assert.equal(inspection.syntaxViolations.length, 0);
  }

  assert.ok(lesson.parts[0].code?.includes('FrtbCapitalEngine'));
  assert.ok(lesson.parts[1].code?.includes('CornishFisherEngine'));
  assert.ok(lesson.parts[2].code?.includes('CholeskyMonteCarloEngine'));
  assert.ok(lesson.parts[3].code?.includes('LiquidityAdjustedVarEngine'));
  assert.ok(lesson.parts[4].code?.includes('ProductionStressTestEngine'));
});

test('Quant Systems Day 24: Exchange Colocation, Direct Market Access & Network Hardware Physics', () => {
  const lesson = getLongLesson('quant-systems', 24);
  assert.ok(lesson, 'quant-systems Day 24 must resolve');
  assert.equal(lesson.day, 24);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8);
  assert.ok(totalMin >= 15);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('#include'));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 0);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 0);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true);
    assert.equal(inspection.hasHeaders, true);
    assert.equal(inspection.hasReturn, true);
    assert.equal(inspection.syntaxViolations.length, 0);
  }

  assert.ok(lesson.parts[0].code?.includes('ExchangeColocationTopology'));
  assert.ok(lesson.parts[1].code?.includes('FiberVsMicrowavePhysics'));
  assert.ok(lesson.parts[2].code?.includes('CutThroughSwitchEngine'));
  assert.ok(lesson.parts[3].code?.includes('DmaKernelBypassEngine'));
  assert.ok(lesson.parts[4].code?.includes('ProductionColocationLatencyDirector'));
});

test('Quant Systems Day 25: ⭐ Milestone 5 Capstone: Enterprise Real-Time Quantitative Risk Management & Stress Testing Platform', () => {
  const lesson = getLongLesson('quant-systems', 25);
  assert.ok(lesson, 'quant-systems Day 25 must resolve');
  assert.equal(lesson.day, 25);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8);
  assert.ok(totalMin >= 15);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('#include'));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 0);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 0);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true);
    assert.equal(inspection.hasHeaders, true);
    assert.equal(inspection.hasReturn, true);
    assert.equal(inspection.syntaxViolations.length, 0);
  }

  assert.ok(lesson.parts[0].code?.includes('Milestone5RiskConfig'));
  assert.ok(lesson.parts[1].code?.includes('MultiAssetVarCvarEngine'));
  assert.ok(lesson.parts[2].code?.includes('CorrelatedStressEngine'));
  assert.ok(lesson.parts[3].code?.includes('LiquidityRiskGateEngine'));
  assert.ok(lesson.parts[4].code?.includes('GrandMasterMilestone5RiskEngine'));
});

test('Quant Systems Day 26: Pre-Trade Risk Controls & Fat-Finger Circuit Breakers: SEC Rule 15c3-5, Dynamic Price Collars & Sub-Millisecond Kill Switches', () => {
  const lesson = getLongLesson('quant-systems', 26);
  assert.ok(lesson, 'quant-systems Day 26 must resolve');
  assert.equal(lesson.day, 26);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8);
  assert.ok(totalMin >= 15);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('#include'));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 0);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 0);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true);
    assert.equal(inspection.hasHeaders, true);
    assert.equal(inspection.hasReturn, true);
    assert.equal(inspection.syntaxViolations.length, 0);
  }

  assert.ok(lesson.parts[0].code?.includes('MarketAccessRuleEngine'));
  assert.ok(lesson.parts[1].code?.includes('FatFingerLimitFilter'));
  assert.ok(lesson.parts[2].code?.includes('DynamicPriceCollarEngine'));
  assert.ok(lesson.parts[3].code?.includes('EmergencyKillSwitchEngine'));
  assert.ok(lesson.parts[4].code?.includes('ProductionPreTradeRiskGateway'));
});

test('Quant Systems Day 27: Backtesting Pitfalls, Point-in-Time Data & Overfitting Elimination', () => {
  const lesson = getLongLesson('quant-systems', 27);
  assert.ok(lesson, 'quant-systems Day 27 must resolve');
  assert.equal(lesson.day, 27);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8);
  assert.ok(totalMin >= 15);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('#include'));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 0);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 0);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true);
    assert.equal(inspection.hasHeaders, true);
    assert.equal(inspection.hasReturn, true);
    assert.equal(inspection.syntaxViolations.length, 0);
  }

  assert.ok(lesson.parts[0].code?.includes('PointInTimeBacktestAuditor'));
  assert.ok(lesson.parts[1].code?.includes('SurvivorshipBiasEngine'));
  assert.ok(lesson.parts[2].code?.includes('DeflatedSharpeEngine'));
  assert.ok(lesson.parts[3].code?.includes('WalkForwardValidator'));
  assert.ok(lesson.parts[4].code?.includes('ProductionBacktestPipeline'));
});

test('Quant Systems Day 28: Crypto Derivatives: Perpetual Swaps, Funding Rate Arbitrage & Liquidation Engine Mechanics', () => {
  const lesson = getLongLesson('quant-systems', 28);
  assert.ok(lesson, 'quant-systems Day 28 must resolve');
  assert.equal(lesson.day, 28);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8);
  assert.ok(totalMin >= 15);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('#include'));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 0);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 0);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true);
    assert.equal(inspection.hasHeaders, true);
    assert.equal(inspection.hasReturn, true);
    assert.equal(inspection.syntaxViolations.length, 0);
  }

  assert.ok(lesson.parts[0].code?.includes('PerpetualSwapEngine'));
  assert.ok(lesson.parts[1].code?.includes('FundingRateArbitrageur'));
  assert.ok(lesson.parts[2].code?.includes('LiquidationCascadeSimulator'));
  assert.ok(lesson.parts[3].code?.includes('AutoDeleveragingEngine'));
  assert.ok(lesson.parts[4].code?.includes('ProductionCryptoDerivativesEngine'));
});

test('Quant Systems Day 29: High-Frequency Trading Infrastructure: FPGA Acceleration & Silicon Offloading', () => {
  const lesson = getLongLesson('quant-systems', 29);
  assert.ok(lesson, 'quant-systems Day 29 must resolve');
  assert.equal(lesson.day, 29);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8);
  assert.ok(totalMin >= 15);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('#include'));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 0);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 0);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true);
    assert.equal(inspection.hasHeaders, true);
    assert.equal(inspection.hasReturn, true);
    assert.equal(inspection.syntaxViolations.length, 0);
  }

  assert.ok(lesson.parts[0].code?.includes('FpgaEthernetMacParser'));
  assert.ok(lesson.parts[1].code?.includes('PcieDmaRingBuffer'));
  assert.ok(lesson.parts[2].code?.includes('SiliconRiskFilter15c35'));
  assert.ok(lesson.parts[3].code?.includes('Axi4StreamPipeline'));
  assert.ok(lesson.parts[4].code?.includes('HybridFpgaCpuGateway'));
});

test('Quant Systems Day 30: 🏆 Final Capstone: Sovereign Ultra-Low-Latency Quantitative Trading & Market Making System', () => {
  const lesson = getLongLesson('quant-systems', 30);
  assert.ok(lesson, 'quant-systems Day 30 must resolve');
  assert.equal(lesson.day, 30);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8);
  assert.ok(totalMin >= 15);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('#include'));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 0);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 0);

    const inspection = inspectCppSource(part.code, 'main');
    assert.equal(inspection.hasValidSignature, true);
    assert.equal(inspection.hasHeaders, true);
    assert.equal(inspection.hasReturn, true);
    assert.equal(inspection.syntaxViolations.length, 0);
  }

  assert.ok(lesson.parts[0].code?.includes('Milestone6SovereignConfig'));
  assert.ok(lesson.parts[1].code?.includes('LockFreeSpscEngine'));
  assert.ok(lesson.parts[2].code?.includes('DeterministicMatchingKernel'));
  assert.ok(lesson.parts[3].code?.includes('SubMicrosecondHftStrategy'));
  assert.ok(lesson.parts[4].code?.includes('GrandMasterFinalCapstoneEngine'));
});

test('Excel Viz Day 6: Advanced Statistical Functions, Regression Analysis & Trend Forecasting', () => {
  const lesson = getLongLesson('excel_viz', 6);
  assert.ok(lesson, 'excel_viz Day 6 must resolve');
  assert.equal(lesson.day, 6);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have an example`);
    assert.ok(part.code && part.code.includes('def '), `Part ${i + 1} code must define Python functions`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have tryIt`);

    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} question must be descriptive`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have 4 options`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} why must be descriptive`);
  }

  assert.ok(lesson.parts[0].code?.includes('calculate_ols_regression'));
  assert.ok(lesson.parts[1].code?.includes('diagnose_residuals_and_r_squared'));
  assert.ok(lesson.parts[2].code?.includes('detect_heteroskedasticity'));
  assert.ok(lesson.parts[3].code?.includes('decompose_ets_seasonality'));
  assert.ok(lesson.parts[4].code?.includes('ProductionStatisticalForecastingEngine'));
});

test('Excel Viz Day 7: Power Query ETL Pipeline, Data Cleansing & Fuzzy Matching', () => {
  const lesson = getLongLesson('excel_viz', 7);
  assert.ok(lesson, 'excel_viz Day 7 must resolve');
  assert.equal(lesson.day, 7);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('def '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('simulate_m_query_ast_pipeline'));
  assert.ok(lesson.parts[1].code?.includes('execute_dynamic_unpivot'));
  assert.ok(lesson.parts[2].code?.includes('audit_schema_drift_and_coercion'));
  assert.ok(lesson.parts[3].code?.includes('execute_fuzzy_string_matching'));
  assert.ok(lesson.parts[4].code?.includes('ProductionPowerQueryEtlEngine'));
});

test('Excel Viz Day 8: Advanced PivotTables, Slicers & Dynamic Relational Data Models', () => {
  const lesson = getLongLesson('excel_viz', 8);
  assert.ok(lesson, 'excel_viz Day 8 must resolve');
  assert.equal(lesson.day, 8);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('build_star_schema_relationship_graph'));
  assert.ok(lesson.parts[1].code?.includes('evaluate_dax_filter_context'));
  assert.ok(lesson.parts[2].code?.includes('activate_userelationship_path'));
  assert.ok(lesson.parts[3].code?.includes('synchronize_slicer_cache'));
  assert.ok(lesson.parts[4].code?.includes('ProductionEnterpriseDataModelEngine'));
});

test('Excel Viz Day 9: Financial & Loan Amortization Models, NPV, IRR & XIRR', () => {
  const lesson = getLongLesson('excel_viz', 9);
  assert.ok(lesson, 'excel_viz Day 9 must resolve');
  assert.equal(lesson.day, 9);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('generate_loan_amortization_schedule'));
  assert.ok(lesson.parts[1].code?.includes('calculate_xnpv_irregular_dates'));
  assert.ok(lesson.parts[2].code?.includes('detect_irr_multiple_roots'));
  assert.ok(lesson.parts[3].code?.includes('solve_xirr_newton_raphson'));
  assert.ok(lesson.parts[4].code?.includes('ProductionLoanAmortizationAndXirrEngine'));
});

test('Excel Viz Day 10: ⭐ Milestone 2 Capstone: Enterprise Financial & Operational Analytics Dashboard', () => {
  const lesson = getLongLesson('excel_viz', 10);
  assert.ok(lesson, 'excel_viz Day 10 must resolve');
  assert.equal(lesson.day, 10);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('Milestone2DataModelConfig'));
  assert.ok(lesson.parts[1].code?.includes('AutomatedEtlQualityGate'));
  assert.ok(lesson.parts[2].code?.includes('DynamicDaxTimeIntelligenceEngine'));
  assert.ok(lesson.parts[3].code?.includes('InteractiveScenarioSwitchboard'));
  assert.ok(lesson.parts[4].code?.includes('GrandMasterMilestone2CapstoneEngine'));
});

test('Excel Viz Day 11: Dynamic Financial Modeling, Working Capital Cycles & Cash Flow Forecasting', () => {
  const lesson = getLongLesson('excel_viz', 11);
  assert.ok(lesson, 'excel_viz Day 11 must resolve');
  assert.equal(lesson.day, 11);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('ThreeStatementModel'));
  assert.ok(lesson.parts[1].code?.includes('WorkingCapitalAnalyzer'));
  assert.ok(lesson.parts[2].code?.includes('CashConversionCycleModel'));
  assert.ok(lesson.parts[3].code?.includes('DynamicCashForecastEngine'));
  assert.ok(lesson.parts[4].code?.includes('TreasuryLiquidityDashboard'));
});

test('Excel Viz Day 12: Capital Budgeting, Sensitivity Grids, Data Tables & Tornado Charts', () => {
  const lesson = getLongLesson('excel_viz', 12);
  assert.ok(lesson, 'excel_viz Day 12 must resolve');
  assert.equal(lesson.day, 12);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('CapitalBudgetingEngine'));
  assert.ok(lesson.parts[1].code?.includes('SensitivityGridEngine'));
  assert.ok(lesson.parts[2].code?.includes('TornadoValuationEngine'));
  assert.ok(lesson.parts[3].code?.includes('BreakEvenEngine'));
  assert.ok(lesson.parts[4].code?.includes('InvestmentCommitteeScoringEngine'));
});

test('Excel Viz Day 13: Advanced Corporate Valuation: Multi-Stage DCF, Terminal Value & WACC Sensitivity', () => {
  const lesson = getLongLesson('excel_viz', 13);
  assert.ok(lesson, 'excel_viz Day 13 must resolve');
  assert.equal(lesson.day, 13);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('UnleveredFreeCashFlowEngine'));
  assert.ok(lesson.parts[1].code?.includes('WaccValuationEngine'));
  assert.ok(lesson.parts[2].code?.includes('TerminalValueEngine'));
  assert.ok(lesson.parts[3].code?.includes('EnterpriseToEquityBridgeEngine'));
  assert.ok(lesson.parts[4].code?.includes('InstitutionalDcfValuationPlatform'));
});

test('Excel Viz Day 14: Leveraged Buyout (LBO) Debt Schedule, Returns Waterfall & Carried Interest Modeling', () => {
  const lesson = getLongLesson('excel_viz', 14);
  assert.ok(lesson, 'excel_viz Day 14 must resolve');
  assert.equal(lesson.day, 14);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('LboSourcesAndUsesEngine'));
  assert.ok(lesson.parts[1].code?.includes('MultiTrancheDebtScheduleEngine'));
  assert.ok(lesson.parts[2].code?.includes('CashFlowSweepAndDeleveragingEngine'));
  assert.ok(lesson.parts[3].code?.includes('PrivateEquityReturnsEngine'));
  assert.ok(lesson.parts[4].code?.includes('InstitutionalLboWaterfallPlatform'));
});

test('Excel Viz Day 15: ⭐ Milestone 3 Capstone: Enterprise Strategic M&A, Accretion/Dilution & Synergy Valuation Model', () => {
  const lesson = getLongLesson('excel_viz', 15);
  assert.ok(lesson, 'excel_viz Day 15 must resolve');
  assert.equal(lesson.day, 15);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('StrategicMergerFinancingEngine'));
  assert.ok(lesson.parts[1].code?.includes('PurchasePriceAllocationEngine'));
  assert.ok(lesson.parts[2].code?.includes('SynergyValuationAndPhasingEngine'));
  assert.ok(lesson.parts[3].code?.includes('EpsAccretionDilutionEngine'));
  assert.ok(lesson.parts[4].code?.includes('GrandMasterMilestone3CapstoneEngine'));
});

test('Excel Viz Day 16: Dynamic Financial Dashboards, KPI Cards, Form Controls & Conditional Formatting Architecture', () => {
  const lesson = getLongLesson('excel_viz', 16);
  assert.ok(lesson, 'excel_viz Day 16 must resolve');
  assert.equal(lesson.day, 16);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('DashboardVisualHierarchyEngine'));
  assert.ok(lesson.parts[1].code?.includes('KpiCardAndBulletGraphEngine'));
  assert.ok(lesson.parts[2].code?.includes('FormControlSwitchboardEngine'));
  assert.ok(lesson.parts[3].code?.includes('ConditionalFormattingHeatmapEngine'));
  assert.ok(lesson.parts[4].code?.includes('ExecutiveFinancialCommandCenterEngine'));
});

test('Excel Viz Day 17: Scenario Manager, Goal Seek & Complex Constrained Optimization with Excel Solver', () => {
  const lesson = getLongLesson('excel_viz', 17);
  assert.ok(lesson, 'excel_viz Day 17 must resolve');
  assert.equal(lesson.day, 17);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('ScenarioManagerSwitchboardEngine'));
  assert.ok(lesson.parts[1].code?.includes('GoalSeekNumericalRootEngine'));
  assert.ok(lesson.parts[2].code?.includes('LinearProgrammingSolverEngine'));
  assert.ok(lesson.parts[3].code?.includes('NonLinearOptimizationAlgorithmEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseCapitalStructureOptimizerPlatform'));
});

test('Excel Viz Day 18: Monte Carlo Simulation & Stochastic Risk Modeling in Excel', () => {
  const lesson = getLongLesson('excel_viz', 18);
  assert.ok(lesson, 'excel_viz Day 18 must resolve');
  assert.equal(lesson.day, 18);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('StochasticDistributionModelingEngine'));
  assert.ok(lesson.parts[1].code?.includes('MonteCarloIterationEngine'));
  assert.ok(lesson.parts[2].code?.includes('ValueAtRiskAndTailRiskEngine'));
  assert.ok(lesson.parts[3].code?.includes('CorrelatedCholeskyDecompositionEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseMonteCarloCapitalBudgetingPlatform'));
});

test('Excel Viz Day 19: Financial Modeling Audit, Error Trapping & Circularity Breakers', () => {
  const lesson = getLongLesson('excel_viz', 19);
  assert.ok(lesson, 'excel_viz Day 19 must resolve');
  assert.equal(lesson.day, 19);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('FastStandardAuditEngine'));
  assert.ok(lesson.parts[1].code?.includes('DebtTaxShieldCircularityLoopEngine'));
  assert.ok(lesson.parts[2].code?.includes('CircularityBreakerSwitchboardEngine'));
  assert.ok(lesson.parts[3].code?.includes('FinancialModelErrorTrappingEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseModelAuditIntegrityGateway'));
});

test('Excel Viz Day 20: ⭐ Milestone 4 Capstone: Enterprise Monte Carlo Risk & Corporate Treasury Optimizer', () => {
  const lesson = getLongLesson('excel_viz', 20);
  assert.ok(lesson, 'excel_viz Day 20 must resolve');
  assert.equal(lesson.day, 20);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('Milestone4MacroScenarioRouter'));
  assert.ok(lesson.parts[1].code?.includes('Milestone4TreasuryOptimizerEngine'));
  assert.ok(lesson.parts[2].code?.includes('Milestone4MonteCarloCashSimulationEngine'));
  assert.ok(lesson.parts[3].code?.includes('Milestone4FastBalanceSheetEngine'));
  assert.ok(lesson.parts[4].code?.includes('GrandMasterMilestone4CapstoneEngine'));
});

test('Excel Viz Day 21: Advanced Budgeting & Variance Analysis: Price-Volume-Mix (PVM) Decomposition & Flexible Budgets', () => {
  const lesson = getLongLesson('excel_viz', 21);
  assert.ok(lesson, 'excel_viz Day 21 must resolve');
  assert.equal(lesson.day, 21);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('StaticVsFlexibleBudgetEngine'));
  assert.ok(lesson.parts[1].code?.includes('PriceVolumeMixDecompositionEngine'));
  assert.ok(lesson.parts[2].code?.includes('ManufacturingCostVarianceEngine'));
  assert.ok(lesson.parts[3].code?.includes('EbitdaVarianceWaterfallBridgeEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseFpaMonthlyOperatingReviewGateway'));
});

test('Excel Viz Day 22: Revenue Recognition & Deferred Revenue Waterfall Modeling under ASC 606 / IFRS 15', () => {
  const lesson = getLongLesson('excel_viz', 22);
  assert.ok(lesson, 'excel_viz Day 22 must resolve');
  assert.equal(lesson.day, 22);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('Asc606RevenueContractEngine'));
  assert.ok(lesson.parts[1].code?.includes('MultiElementSspAllocationEngine'));
  assert.ok(lesson.parts[2].code?.includes('DeferredRevenueWaterfallScheduleEngine'));
  assert.ok(lesson.parts[3].code?.includes('ContractModificationAccountingEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseAsc606RevenueGovernanceGateway'));
});

test('Excel Viz Day 23: Rolling 13-Week Cash Flow Forecasting (TWCF) & Direct Method Working Capital Telemetry', () => {
  const lesson = getLongLesson('excel_viz', 23);
  assert.ok(lesson, 'excel_viz Day 23 must resolve');
  assert.equal(lesson.day, 23);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('ThirteenWeekCashFlowArchitectureEngine'));
  assert.ok(lesson.parts[1].code?.includes('DirectCashReceiptsAgingEngine'));
  assert.ok(lesson.parts[2].code?.includes('DirectCashDisbursementsStratificationEngine'));
  assert.ok(lesson.parts[3].code?.includes('LiquidityRevolverBorrowingBaseEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseThirteenWeekCashFlowCommandGateway'));
});

test('Excel Viz Day 24: Enterprise Capital Allocation, Hurdle Rates, Economic Value Added (EVA) & ROIC vs WACC Bridges', () => {
  const lesson = getLongLesson('excel_viz', 24);
  assert.ok(lesson, 'excel_viz Day 24 must resolve');
  assert.equal(lesson.day, 24);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('CapitalAllocationHurdleRateEngine'));
  assert.ok(lesson.parts[1].code?.includes('RoicWaccSpreadValueCreationEngine'));
  assert.ok(lesson.parts[2].code?.includes('SternStewartEvaAccountingAdjustmentEngine'));
  assert.ok(lesson.parts[3].code?.includes('MultiDivisionRoicPortfolioEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseCapitalAllocationStrategyGateway'));
});

test('Excel Viz Day 25: ⭐ Milestone 5 Capstone: Enterprise Corporate FP&A Planning, Variance Analysis & Capital Allocation Platform', () => {
  const lesson = getLongLesson('excel_viz', 25);
  assert.ok(lesson, 'excel_viz Day 25 must resolve');
  assert.equal(lesson.day, 25);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('Milestone5CorporateScenarioRouter'));
  assert.ok(lesson.parts[1].code?.includes('Milestone5CommercialPvmAsc606Engine'));
  assert.ok(lesson.parts[2].code?.includes('Milestone5OperationalCostTwcfTreasuryEngine'));
  assert.ok(lesson.parts[3].code?.includes('Milestone5CapitalAllocationEvaEngine'));
  assert.ok(lesson.parts[4].code?.includes('GrandMasterMilestone5CapstoneEngine'));
});

test('Excel Viz Day 26: Advanced Excel Automation: Dynamic Office Scripts, TypeScript & REST API Integrations', () => {
  const lesson = getLongLesson('excel_viz', 26);
  assert.ok(lesson, 'excel_viz Day 26 must resolve');
  assert.equal(lesson.day, 26);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('OfficeScriptsExecutionEngine'));
  assert.ok(lesson.parts[1].code?.includes('RestApiIngestionSyncEngine'));
  assert.ok(lesson.parts[2].code?.includes('AsyncBatchDataTransformEngine'));
  assert.ok(lesson.parts[3].code?.includes('PowerAutomateWebhookRouter'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseOfficeScriptAutomationGateway'));
});

test('Excel Viz Day 27: Enterprise VBA Architecture & Modernization', () => {
  const lesson = getLongLesson('excel_viz', 27);
  assert.ok(lesson, 'excel_viz Day 27 must resolve');
  assert.equal(lesson.day, 27);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('PowerQueryAdvancedMEngine'));
  assert.ok(lesson.parts[1].code?.includes('WebScrapingHtmlExtractorEngine'));
  assert.ok(lesson.parts[2].code?.includes('FuzzyMatchingEntityResolutionEngine'));
  assert.ok(lesson.parts[3].code?.includes('MultiSourceReconciliationEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseBigDataPowerQueryGateway'));
});

test('Excel Viz Day 28: Multi-Entity Financial Consolidation & Global Currency Translation', () => {
  const lesson = getLongLesson('excel_viz', 28);
  assert.ok(lesson, 'excel_viz Day 28 must resolve');
  assert.equal(lesson.day, 28);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('FinancialStatementConsolidationEngine'));
  assert.ok(lesson.parts[1].code?.includes('MultiCurrencyTranslationEngine'));
  assert.ok(lesson.parts[2].code?.includes('IntercompanyEliminationEngine'));
  assert.ok(lesson.parts[3].code?.includes('SegmentReportingNciEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseGlobalConsolidationGateway'));
});

test('Excel Viz Day 29: Real-Time Financial Telemetry & Executive Cockpits', () => {
  const lesson = getLongLesson('excel_viz', 29);
  assert.ok(lesson, 'excel_viz Day 29 must resolve');
  assert.equal(lesson.day, 29);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('ExecutiveKpiTelemetryEngine'));
  assert.ok(lesson.parts[1].code?.includes('DynamicSlicerScenarioEngine'));
  assert.ok(lesson.parts[2].code?.includes('PriceVolumeMixWaterfallEngine'));
  assert.ok(lesson.parts[3].code?.includes('CognitiveVisualArchitectureEngine'));
  assert.ok(lesson.parts[4].code?.includes('MasterCSuiteTelemetryCockpit'));
});

test('Excel Viz Day 30: Grand Final Milestone 6 Capstone Sovereign Financial OS', () => {
  const lesson = getLongLesson('excel_viz', 30);
  assert.ok(lesson, 'excel_viz Day 30 must resolve');
  assert.equal(lesson.day, 30);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('MasterChartOfAccountsHarmonizer'));
  assert.ok(lesson.parts[1].code?.includes('AutonomousStatutoryConsolidationEngine'));
  assert.ok(lesson.parts[2].code?.includes('AutonomousTreasuryEngine'));
  assert.ok(lesson.parts[3].code?.includes('EnterpriseValuationDcfEngine'));
  assert.ok(lesson.parts[4].code?.includes('SovereignEnterpriseFinancialOS'));
});

test('Excel Viz Day 31: Dynamic Three-Statement Financial Modeling', () => {
  const lesson = getLongLesson('excel_viz', 31);
  assert.ok(lesson, 'excel_viz Day 31 must resolve');
  assert.equal(lesson.day, 31);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('ThreeStatementLedgerInvariants'));
  assert.ok(lesson.parts[1].code?.includes('WorkingCapitalCashFlowBridge'));
  assert.ok(lesson.parts[2].code?.includes('FixedAssetPpeSchedule'));
  assert.ok(lesson.parts[3].code?.includes('RetainedEarningsEquityLinker'));
  assert.ok(lesson.parts[4].code?.includes('MasterThreeStatementForecastEngine'));
});

test('Excel Viz Day 32: Debt Sculpting, Revolver Schedules & Circularity Breakers', () => {
  const lesson = getLongLesson('excel_viz', 32);
  assert.ok(lesson, 'excel_viz Day 32 must resolve');
  assert.equal(lesson.day, 32);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('RevolverBorrowingSweepEngine'));
  assert.ok(lesson.parts[1].code?.includes('CircularityBreakerToggle'));
  assert.ok(lesson.parts[2].code?.includes('DebtSculptingDscrOptimizer'));
  assert.ok(lesson.parts[3].code?.includes('CreditRatingCovenantAuditor'));
  assert.ok(lesson.parts[4].code?.includes('MasterDebtAndCircularityEngine'));
});

test('Excel Viz Day 33: Capital Budgeting & Valuation: DCF, WACC & Multi-Tier Waterfalls', () => {
  const lesson = getLongLesson('excel_viz', 33);
  assert.ok(lesson, 'excel_viz Day 33 must resolve');
  assert.equal(lesson.day, 33);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('UnleveredFreeCashFlowEngine'));
  assert.ok(lesson.parts[1].code?.includes('WaccCapitalStructureCalculator'));
  assert.ok(lesson.parts[2].code?.includes('TerminalValueSensitivityCalculator'));
  assert.ok(lesson.parts[3].code?.includes('PrivateEquityWaterfallDistributions'));
  assert.ok(lesson.parts[4].code?.includes('MasterCorporateValuationEngine'));
});

test('Excel Viz Day 34: Advanced Sensitivity & Scenario Managers: Data Tables & Monte Carlo', () => {
  const lesson = getLongLesson('excel_viz', 34);
  assert.ok(lesson, 'excel_viz Day 34 must resolve');
  assert.equal(lesson.day, 34);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('TwoWayDataTableEngine'));
  assert.ok(lesson.parts[1].code?.includes('TornadoSensitivityRanker'));
  assert.ok(lesson.parts[2].code?.includes('ScenarioManagerSwitchboard'));
  assert.ok(lesson.parts[3].code?.includes('CorrelatedMonteCarloEngine'));
  assert.ok(lesson.parts[4].code?.includes('MasterFinancialRiskSensitivitySuite'));
});

test('Excel Viz Day 35: Milestone 4: ApexValuation Three-Statement Financial Modeling & Monte Carlo DCF Engine Suite', () => {
  const lesson = getLongLesson('excel_viz', 35);
  assert.ok(lesson, 'excel_viz Day 35 must resolve');
  assert.equal(lesson.day, 35);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('Milestone4ValuationAuditor'));
  assert.ok(lesson.parts[1].code?.includes('EnterpriseLboAcquisitionSimulator'));
  assert.ok(lesson.parts[2].code?.includes('DistressScenarioStressTester'));
  assert.ok(lesson.parts[3].code?.includes('BoardroomValuationPitchGateway'));
  assert.ok(lesson.parts[4].code?.includes('MasterApexValuationEngine'));
});

test('Excel Viz Day 36: Power Query M Language Internals: Table Transformations, Custom Functions & Query Folding Optimization', () => {
  const lesson = getLongLesson('excel_viz', 36);
  assert.ok(lesson, 'excel_viz Day 36 must resolve');
  assert.equal(lesson.day, 36);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('MFunctionalEvaluationEngine'));
  assert.ok(lesson.parts[1].code?.includes('MCustomFunctionCompiler'));
  assert.ok(lesson.parts[2].code?.includes('QueryFoldingTranslator'));
  assert.ok(lesson.parts[3].code?.includes('QueryFoldingBreakerDiagnostic'));
  assert.ok(lesson.parts[4].code?.includes('MasterPowerQueryEtlGateway'));
});

test('Excel Viz Day 37: Dimensional Modeling in Excel: Star Schemas, Fact vs Dimension Tables & Active vs Inactive Relationships', () => {
  const lesson = getLongLesson('excel_viz', 37);
  assert.ok(lesson, 'excel_viz Day 37 must resolve');
  assert.equal(lesson.day, 37);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('StarSchemaTopologyEngine'));
  assert.ok(lesson.parts[1].code?.includes('VertiPaqCompressionSimulator'));
  assert.ok(lesson.parts[2].code?.includes('SurrogateKeyIntegrityAuditor'));
  assert.ok(lesson.parts[3].code?.includes('RolePlayingDimensionManager'));
  assert.ok(lesson.parts[4].code?.includes('MasterEnterpriseStarSchemaGateway'));
});

test('Excel Viz Day 38: Introduction to DAX (Data Analysis Expressions): Calculated Columns vs Measures, Filter Context & Row Context', () => {
  const lesson = getLongLesson('excel_viz', 38);
  assert.ok(lesson, 'excel_viz Day 38 must resolve');
  assert.equal(lesson.day, 38);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('EvaluationContextEngine'));
  assert.ok(lesson.parts[1].code?.includes('CalculatedColumnMemoryAuditor'));
  assert.ok(lesson.parts[2].code?.includes('CalculateContextTransitionEngine'));
  assert.ok(lesson.parts[3].code?.includes('IterativeXAggregatorEngine'));
  assert.ok(lesson.parts[4].code?.includes('MasterDaxEvaluationGateway'));
});

test('Excel Viz Day 39: Time Intelligence in DAX: TOTALYTD, SAMEPERIODLASTYEAR, Rolling Averages & Calendar Tables', () => {
  const lesson = getLongLesson('excel_viz', 39);
  assert.ok(lesson, 'excel_viz Day 39 must resolve');
  assert.equal(lesson.day, 39);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('ContiguousCalendarAuditor'));
  assert.ok(lesson.parts[1].code?.includes('TotalYtdVarianceEngine'));
  assert.ok(lesson.parts[2].code?.includes('SamePeriodLastYearEngine'));
  assert.ok(lesson.parts[3].code?.includes('RollingPeriodDaxEngine'));
  assert.ok(lesson.parts[4].code?.includes('MasterTimeIntelligenceGateway'));
});

test('Excel Viz Day 40: Milestone 5: ApexModel Star Schema Data Modeling & High-Performance DAX Engine Suite', () => {
  const lesson = getLongLesson('excel_viz', 40);
  assert.ok(lesson, 'excel_viz Day 40 must resolve');
  assert.equal(lesson.day, 40);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('Milestone5ModelAuditor'));
  assert.ok(lesson.parts[1].code?.includes('MultiSourceQueryFoldingPipeline'));
  assert.ok(lesson.parts[2].code?.includes('VertiPaqPerformanceProfiler'));
  assert.ok(lesson.parts[3].code?.includes('ExecutiveDaxMetricEngine'));
  assert.ok(lesson.parts[4].code?.includes('MasterApexModelPlatform'));
});

test('Excel Viz Day 41: Exploratory Data Analysis & Descriptive Statistics: Skewness, Kurtosis, Interquartile Range & Outlier Detection', () => {
  const lesson = getLongLesson('excel_viz', 41);
  assert.ok(lesson, 'excel_viz Day 41 must resolve');
  assert.equal(lesson.day, 41);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('MathematicalMomentsCalculator'));
  assert.ok(lesson.parts[1].code?.includes('TukeyIqrOutlierDetector'));
  assert.ok(lesson.parts[2].code?.includes('DistributionShapeProfiler'));
  assert.ok(lesson.parts[3].code?.includes('AutomatedEdaAnalyticsEngine'));
  assert.ok(lesson.parts[4].code?.includes('MasterExploratoryDataAnalysisGateway'));
});

test('Excel Viz Day 42: Inferential Statistics & Hypothesis Testing in Excel: Z-Tests, T-Tests, Paired Samples & ANOVA F-Tests', () => {
  const lesson = getLongLesson('excel_viz', 42);
  assert.ok(lesson, 'excel_viz Day 42 must resolve');
  assert.equal(lesson.day, 42);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('StudentTTestHypothesisEngine'));
  assert.ok(lesson.parts[1].code?.includes('PairedSampleTTestEngine'));
  assert.ok(lesson.parts[2].code?.includes('SingleFactorAnovaEngine'));
  assert.ok(lesson.parts[3].code?.includes('FamilyWiseErrorCorrector'));
  assert.ok(lesson.parts[4].code?.includes('MasterHypothesisTestingGateway'));
});

test('Excel Viz Day 43: Bivariate Correlation & Ordinary Least Squares (OLS) Linear Regression: R², Residual Plots & P-Values', () => {
  const lesson = getLongLesson('excel_viz', 43);
  assert.ok(lesson, 'excel_viz Day 43 must resolve');
  assert.equal(lesson.day, 43);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('PearsonCorrelationMatrixEngine'));
  assert.ok(lesson.parts[1].code?.includes('OlsLinearRegressionEngine'));
  assert.ok(lesson.parts[2].code?.includes('LineAssumptionsDiagnosticEngine'));
  assert.ok(lesson.parts[3].code?.includes('RegressionInferenceAuditor'));
  assert.ok(lesson.parts[4].code?.includes('MasterOlsEconometricGateway'));
});

test('Excel Viz Day 44: Time-Series Forecasting & Exponential Smoothing: Seasonality Decomposition & Trend Projections (FORECAST.ETS)', () => {
  const lesson = getLongLesson('excel_viz', 44);
  assert.ok(lesson, 'excel_viz Day 44 must resolve');
  assert.equal(lesson.day, 44);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('ClassicalDecompositionEngine'));
  assert.ok(lesson.parts[1].code?.includes('HoltWintersEtsEngine'));
  assert.ok(lesson.parts[2].code?.includes('ForecastAccuracyProfiler'));
  assert.ok(lesson.parts[3].code?.includes('ForecastConfidenceIntervalCalculator'));
  assert.ok(lesson.parts[4].code?.includes('MasterTimeSeriesEtsGateway'));
});

test('Excel Viz Day 45: ⭐ Milestone 6: ApexAnalytics Statistical Testing & Time-Series Forecasting Engine Suite', () => {
  const lesson = getLongLesson('excel_viz', 45);
  assert.ok(lesson, 'excel_viz Day 45 must resolve');
  assert.equal(lesson.day, 45);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('Milestone6StatisticalAuditor'));
  assert.ok(lesson.parts[1].code?.includes('MultiVariantAbTestingSuite'));
  assert.ok(lesson.parts[2].code?.includes('ValidatedOlsEconometricSuite'));
  assert.ok(lesson.parts[3].code?.includes('ExecutiveTimeSeriesForecastSuite'));
  assert.ok(lesson.parts[4].code?.includes('MasterApexAnalyticsPlatform'));
});

test('Excel Viz Day 46: VBA Architecture & COM Object Model: Application, Workbook, Worksheet & Range DOM Hierarchy', () => {
  const lesson = getLongLesson('excel_viz', 46);
  assert.ok(lesson, 'excel_viz Day 46 must resolve');
  assert.equal(lesson.day, 46);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('ComHierarchyNavigator'));
  assert.ok(lesson.parts[1].code?.includes('MemoryArrayBatchProcessor'));
  assert.ok(lesson.parts[2].code?.includes('ExcelExecutionStateController'));
  assert.ok(lesson.parts[3].code?.includes('MultiSheetLedgerConsolidator'));
  assert.ok(lesson.parts[4].code?.includes('MasterVbaComAutomationGateway'));
});

test('Excel Viz Day 47: Robust VBA Error Handling & Event-Driven Automation: On Error GoTo, ScreenUpdating & Sheet Events', () => {
  const lesson = getLongLesson('excel_viz', 47);
  assert.ok(lesson, 'excel_viz Day 47 must resolve');
  assert.equal(lesson.day, 47);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('StructuredErrorHandlerEngine'));
  assert.ok(lesson.parts[1].code?.includes('ApplicationStateRestorationManager'));
  assert.ok(lesson.parts[2].code?.includes('WorksheetChangeEventInterceptor'));
  assert.ok(lesson.parts[3].code?.includes('SoxAuditTrailLogger'));
  assert.ok(lesson.parts[4].code?.includes('MasterEventDrivenAutomationGateway'));
});

test('Excel Viz Day 48: Modern Automation with TypeScript Office Scripts: Excel JavaScript API, Power Automate & Async Cloud Flows', () => {
  const lesson = getLongLesson('excel_viz', 48);
  assert.ok(lesson, 'excel_viz Day 48 must resolve');
  assert.equal(lesson.day, 48);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('OfficeScriptsSandboxArchitecture'));
  assert.ok(lesson.parts[1].code?.includes('TypeScriptBatchMatrixEngine'));
  assert.ok(lesson.parts[2].code?.includes('PowerAutomateJsonPayloadBridge'));
  assert.ok(lesson.parts[3].code?.includes('AsyncCloudFlowPipeline'));
  assert.ok(lesson.parts[4].code?.includes('MasterTypeScriptOfficeScriptsGateway'));
});

test('Excel Viz Day 49: Custom User-Defined Functions (UDFs) & Modern Lambda Helper Functions: LAMBDA Recursion, MAP, SCAN, REDUCE & BYROW', () => {
  const lesson = getLongLesson('excel_viz', 49);
  assert.ok(lesson, 'excel_viz Day 49 must resolve');
  assert.equal(lesson.day, 49);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('PureLambdaEvaluationEngine'));
  assert.ok(lesson.parts[1].code?.includes('TailRecursiveAmortizationEngine'));
  assert.ok(lesson.parts[2].code?.includes('HigherOrderArrayTransformEngine'));
  assert.ok(lesson.parts[3].code?.includes('ScanReduceAccumulatorEngine'));
  assert.ok(lesson.parts[4].code?.includes('MasterFunctionalLambdaGateway'));
});

test('Excel Viz Day 50: ⭐ Milestone 7: ApexAutomate Enterprise VBA & TypeScript Office Scripts Automation Suite', () => {
  const lesson = getLongLesson('excel_viz', 50);
  assert.ok(lesson, 'excel_viz Day 50 must resolve');
  assert.equal(lesson.day, 50);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('Milestone7AutomationAuditor'));
  assert.ok(lesson.parts[1].code?.includes('ProductionVbaBatchEngine'));
  assert.ok(lesson.parts[2].code?.includes('CloudOfficeScriptBatchEngine'));
  assert.ok(lesson.parts[3].code?.includes('EnterpriseLambdaFinancialLibrary'));
  assert.ok(lesson.parts[4].code?.includes('MasterApexAutomatePlatform'));
});

test('Excel Viz Day 51: EuSpRIG Standards & Model Audit Methodology: Cell Dependency Mapping, Circularity Auditing & Trace Precedents', () => {
  const lesson = getLongLesson('excel_viz', 51);
  assert.ok(lesson, 'excel_viz Day 51 must resolve');
  assert.equal(lesson.day, 51);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('EuSprigArchitectureAuditor'));
  assert.ok(lesson.parts[1].code?.includes('FormulaDriftDetector'));
  assert.ok(lesson.parts[2].code?.includes('CellDependencyDagMapper'));
  assert.ok(lesson.parts[3].code?.includes('ModelRiskScorecardEngine'));
  assert.ok(lesson.parts[4].code?.includes('MasterEuSprigAuditGateway'));
});

test('Excel Viz Day 52: Native Python in Excel (=PY()): Anaconda Runtime, Pandas DataFrames, Seaborn Visualizations & Cloud Sandbox Limits', () => {
  const lesson = getLongLesson('excel_viz', 52);
  assert.ok(lesson, 'excel_viz Day 52 must resolve');
  assert.equal(lesson.day, 52);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('PythonExcelSandboxArchitecture'));
  assert.ok(lesson.parts[1].code?.includes('DataFrameGridMarshaller'));
  assert.ok(lesson.parts[2].code?.includes('MachineLearningGridScorer'));
  assert.ok(lesson.parts[3].code?.includes('StatisticalVisualizerRenderer'));
  assert.ok(lesson.parts[4].code?.includes('MasterPythonExcelGateway'));
});

test('Excel Viz Day 53: High-Density Executive Financial Dashboards: Sparklines, Bullet Graphs, Form Controls & Information Radiators', () => {
  const lesson = getLongLesson('excel_viz', 53);
  assert.ok(lesson, 'excel_viz Day 53 must resolve');
  assert.equal(lesson.day, 53);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('TufteDataInkRatioOptimizer'));
  assert.ok(lesson.parts[1].code?.includes('StephenFewBulletGraphEngine'));
  assert.ok(lesson.parts[2].code?.includes('MicroSparklineTrendProfiler'));
  assert.ok(lesson.parts[3].code?.includes('InteractiveFormControlDashboard'));
  assert.ok(lesson.parts[4].code?.includes('MasterExecutiveDashboardGateway'));
});

test('Excel Viz Day 54: Calculation Chain Internals & Performance Tuning: Volatile Functions, Multi-Threaded Calc & Binary Formats (.xlsb)', () => {
  const lesson = getLongLesson('excel_viz', 54);
  assert.ok(lesson, 'excel_viz Day 54 must resolve');
  assert.equal(lesson.day, 54);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('CalculationChainDagProfiler'));
  assert.ok(lesson.parts[1].code?.includes('VolatileFunctionEliminator'));
  assert.ok(lesson.parts[2].code?.includes('MultiThreadedCalculationOptimizer'));
  assert.ok(lesson.parts[3].code?.includes('BinaryWorkbookCompressor'));
  assert.ok(lesson.parts[4].code?.includes('MasterPerformanceTuningGateway'));
});

test('Excel Viz Day 55: Enterprise Spreadsheet Governance, Role-Based Access Control, IRM & Compliance Validation', () => {
  const lesson = getLongLesson('excel_viz', 55);
  assert.ok(lesson, 'excel_viz Day 55 must resolve');
  assert.equal(lesson.day, 55);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('DefenseInDepthSecurityModel'));
  assert.ok(lesson.parts[1].code?.includes('RoleBasedAccessControlEngine'));
  assert.ok(lesson.parts[2].code?.includes('InformationRightsManagementPolicy'));
  assert.ok(lesson.parts[3].code?.includes('SoxComplianceAuditLedger'));
  assert.ok(lesson.parts[4].code?.includes('MasterEnterpriseGovernanceGateway'));
});

test('Excel Viz Day 56: Historic Catastrophe Post-Mortem 1: The $6.2 Billion JPMorgan London Whale VaR Formula Disaster', () => {
  const lesson = getLongLesson('excel_viz', 56);
  assert.ok(lesson, 'excel_viz Day 56 must resolve');
  assert.equal(lesson.day, 56);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('LondonWhalePortfolioModel'));
  assert.ok(lesson.parts[1].code?.includes('VarDivisionErrorDetector'));
  assert.ok(lesson.parts[2].code?.includes('SpreadsheetGovernanceTracker'));
  assert.ok(lesson.parts[3].code?.includes('DualEngineVarValidator'));
  assert.ok(lesson.parts[4].code?.includes('MasterLondonWhaleForensicGateway'));
});

test('Excel Viz Day 57: Historic Catastrophe Post-Mortem 2: The Reinhart-Rogoff $200B Austerity Omission (=AVERAGE(A1:A15) Range Error)', () => {
  const lesson = getLongLesson('excel_viz', 57);
  assert.ok(lesson, 'excel_viz Day 57 must resolve');
  assert.equal(lesson.day, 57);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('ReinhartRogoffGrowthModel'));
  assert.ok(lesson.parts[1].code?.includes('TruncatedRangeDetector'));
  assert.ok(lesson.parts[2].code?.includes('CountryWeightingAuditEngine'));
  assert.ok(lesson.parts[3].code?.includes('AutoExpandingStructuredTable'));
  assert.ok(lesson.parts[4].code?.includes('MasterReinhartRogoffForensicGateway'));
});

test('Excel Viz Day 58: Historic Catastrophe Post-Mortem 3: Fannie Mae $1.3B Restatement & MI5 Wiretap Phone Truncation', () => {
  const lesson = getLongLesson('excel_viz', 58);
  assert.ok(lesson, 'excel_viz Day 58 must resolve');
  assert.equal(lesson.day, 58);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('Ieee754PrecisionProfiler'));
  assert.ok(lesson.parts[1].code?.includes('TelephonyLeadingZeroRestorer'));
  assert.ok(lesson.parts[2].code?.includes('TextTypeCoercionGuardian'));
  assert.ok(lesson.parts[3].code?.includes('PowerQueryTypeSafePipeline'));
  assert.ok(lesson.parts[4].code?.includes('MasterPrecisionTypeSafetyGateway'));
});

test('Excel Viz Day 59: Principal Financial Systems Architect Modernization RFC: Transitioning Monolithic Workbooks to Governed Lakehouses', () => {
  const lesson = getLongLesson('excel_viz', 59);
  assert.ok(lesson, 'excel_viz Day 59 must resolve');
  assert.equal(lesson.day, 59);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('ShadowItSprawlProfiler'));
  assert.ok(lesson.parts[1].code?.includes('ModernizationRoiCalculator'));
  assert.ok(lesson.parts[2].code?.includes('LakehouseCoexistenceEngine'));
  assert.ok(lesson.parts[3].code?.includes('EnterpriseModernizationRfcBuilder'));
  assert.ok(lesson.parts[4].code?.includes('MasterArchitectureReviewBoardGateway'));
});

test('Excel Viz Day 60: 🏆 Capstone 2: ApexEnterpriseAnalytics Full-Scale Financial Engineering & Enterprise Data Modeling Master Capstone Viva Gate', () => {
  const lesson = getLongLesson('excel_viz', 60);
  assert.ok(lesson, 'excel_viz Day 60 must resolve');
  assert.equal(lesson.day, 60);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of lesson.parts) {
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 3);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('class '));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.equal(check.options.length, 4);
    assert.ok(check.answer >= 0 && check.answer < 4);
    assert.ok(check.why.length > 15);
  }

  assert.ok(lesson.parts[0].code?.includes('ApexEnterpriseBlueprintAuditor'));
  assert.ok(lesson.parts[1].code?.includes('ModelChaosStressSimulator'));
  assert.ok(lesson.parts[2].code?.includes('InGridMlAndCloudAutomator'));
  assert.ok(lesson.parts[3].code?.includes('ProductionFinancialEngineSuite'));
  assert.ok(lesson.parts[4].code?.includes('MasterApexEnterpriseAnalyticsPlatform'));
});


