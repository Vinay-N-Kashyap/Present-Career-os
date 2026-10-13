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


  // 2. excel_viz
  const excelLesson = getLongLesson('excel_viz', 1);
  assert.ok(excelLesson, 'excel_viz Day 1 long lesson must resolve');
  assert.equal(excelLesson.day, 1);
  assert.equal(excelLesson.parts.length, 5, 'excel_viz Day 1 must contain exactly 5 parts');
  assert.ok(excelLesson.summary.length >= 4, 'excel_viz Day 1 must contain comprehensive summary');
  assert.ok(excelLesson.projectStep, 'excel_viz Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('excel_viz'), 'python');

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

