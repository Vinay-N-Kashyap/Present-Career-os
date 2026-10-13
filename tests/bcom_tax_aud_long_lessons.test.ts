import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';
import { BCOM_TAX_LONG_LESSONS } from '../src/lib/data/bcomTaxLongLessons';
import { BCOM_AUD_LONG_LESSONS } from '../src/lib/data/bcomAudLongLessons';

test('B.Com Corporate Tax & Forensic Audit Long Lessons: Resolution & Language Invariants', () => {
  // Corporate Tax (bcom_tax)
  const taxLesson = getLongLesson('bcom_tax', 1);
  assert.ok(taxLesson, 'bcom_tax Day 1 lesson must be defined');
  assert.equal(taxLesson.coursePrefix, 'bcom_tax');
  assert.equal(taxLesson.day, 1);
  assert.equal(taxLesson.parts.length, 5, 'bcom_tax Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_tax'), 'python', 'bcom_tax must use Python language runner');

  // Forensic Audit (bcom_aud)
  const audLesson = getLongLesson('bcom_aud', 1);
  assert.ok(audLesson, 'bcom_aud Day 1 lesson must be defined');
  assert.equal(audLesson.coursePrefix, 'bcom_aud');
  assert.equal(audLesson.day, 1);
  assert.equal(audLesson.parts.length, 5, 'bcom_aud Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_aud'), 'python', 'bcom_aud must use Python language runner');
});

test('B.Com Corporate Tax Day 1: DTL Reversal, Debt Shield & OECD Transfer Pricing Snippets Verification', () => {
  const lesson = BCOM_TAX_LONG_LESSONS[0];
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
  assert.ok(lesson.parts[0].code?.includes('DeferredTaxSchedule'));
  assert.ok(lesson.parts[1].code?.includes('DebtTaxShieldEngine'));
  assert.ok(lesson.parts[2].code?.includes('TransferPricingTNMM'));
  assert.ok(lesson.parts[3].code?.includes('NolTaxShieldSimulator'));
  assert.ok(lesson.parts[4].code?.includes('VatSupplyChainNode'));
});

test('B.Com Corporate Tax Day 2: OECD Pillar Two, R&D Credits & Section 382 Snippets Verification', () => {
  const lesson2 = BCOM_TAX_LONG_LESSONS[1];
  assert.ok(lesson2, 'bcom_tax Day 2 lesson must be defined');
  assert.equal(lesson2.coursePrefix, 'bcom_tax');
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
  assert.ok(lesson2.parts[0].code?.includes('calculate_pillar_two_top_up_tax'));
  assert.ok(lesson2.parts[1].code?.includes('calculate_rd_tax_credit'));
  assert.ok(lesson2.parts[2].code?.includes('calculate_gilti_inclusion_and_tax'));
  assert.ok(lesson2.parts[3].code?.includes('calculate_section_382_nol_limitation'));
  assert.ok(lesson2.parts[4].code?.includes('calculate_section_338h10_basis_step_up'));
});

test('B.Com Forensic Audit Day 1: Audit Risk Model, Benford Chi-Square & MUS Snippets Verification', () => {
  const lesson = BCOM_AUD_LONG_LESSONS[0];
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
  assert.ok(lesson.parts[0].code?.includes('AuditRiskEngine'));
  assert.ok(lesson.parts[1].code?.includes('BenfordFraudDetector'));
  assert.ok(lesson.parts[2].code?.includes('MonetaryUnitSamplingEngine'));
  assert.ok(lesson.parts[3].code?.includes('SoxSodComplianceEngine'));
  assert.ok(lesson.parts[4].code?.includes('StatutoryOpinionEngine'));
});

test('B.Com Forensic Audit Day 2: Beneish M-Score, Altman Z-Score & Digital Forensics Snippets Verification', () => {
  const lesson2 = BCOM_AUD_LONG_LESSONS[1];
  assert.ok(lesson2, 'bcom_aud Day 2 lesson must be defined');
  assert.equal(lesson2.coursePrefix, 'bcom_aud');
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
  assert.ok(lesson2.parts[0].code?.includes('calculate_beneish_m_score'));
  assert.ok(lesson2.parts[1].code?.includes('calculate_altman_z_score'));
  assert.ok(lesson2.parts[2].code?.includes('ForensicDocumentMetadataAuditor'));
  assert.ok(lesson2.parts[3].code?.includes('detect_shell_vendor_fraud'));
  assert.ok(lesson2.parts[4].code?.includes('triage_whistleblower_allegation'));
});

test('Block 118: B.Com Corporate Tax Day 3: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_tax', 3);
  assert.ok(lesson, 'bcom_tax Day 3 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_tax');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5, 'bcom_tax Day 3 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_tax'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 118: B.Com Corporate Tax Day 3: DEMPE, RPSM, Bilateral APA, 163(j) & CbCR Verification', () => {
  const lesson = BCOM_TAX_LONG_LESSONS[2];
  assert.ok(lesson, 'BCOM_TAX_LONG_LESSONS[2] must exist');
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
  assert.match(lesson.parts[0].title, /DEMPE Framework.*Intangibles/i);
  assert.ok(lesson.parts[0].code?.includes('evaluate_dempe_intangible_profit_allocation'));
  assert.match(lesson.parts[1].title, /Residual Profit Split Method.*RPSM/i);
  assert.ok(lesson.parts[1].code?.includes('compute_residual_profit_split_method'));
  assert.match(lesson.parts[2].title, /Advance Pricing Agreements.*APA.*MAP/i);
  assert.ok(lesson.parts[2].code?.includes('model_bilateral_apa_and_map_double_tax_relief'));
  assert.match(lesson.parts[3].title, /Thin Capitalization.*163\(j\)/i);
  assert.ok(lesson.parts[3].code?.includes('calculate_section_163j_interest_limitation'));
  assert.match(lesson.parts[4].title, /Country-by-Country Reporting.*CbCR/i);
  assert.ok(lesson.parts[4].code?.includes('audit_cbcr_jurisdictional_risk_profile'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 119: B.Com Corporate Tax Day 4: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_tax', 4);
  assert.ok(lesson, 'bcom_tax Day 4 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_tax');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5, 'bcom_tax Day 4 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_tax'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 119: B.Com Corporate Tax Day 4: Cross-Border VAT RCM, Customs, PE & DST Verification', () => {
  const lesson = BCOM_TAX_LONG_LESSONS[3];
  assert.ok(lesson, 'BCOM_TAX_LONG_LESSONS[3] must exist');
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
  assert.match(lesson.parts[0].title, /Destination Principle.*Reverse Charge Mechanism/i);
  assert.ok(lesson.parts[0].code?.includes('evaluate_cross_border_vat_and_reverse_charge'));
  assert.match(lesson.parts[1].title, /Customs Valuation.*WTO Valuation Agreement/i);
  assert.ok(lesson.parts[1].code?.includes('harmonize_customs_valuation_and_transfer_pricing'));
  assert.match(lesson.parts[2].title, /Incoterms 2020.*Permanent Establishment.*Wayfair/i);
  assert.ok(lesson.parts[2].code?.includes('evaluate_incoterm_pe_risk_and_economic_nexus'));
  assert.match(lesson.parts[3].title, /Digital Services Taxes.*DST.*Pillar One Amount A/i);
  assert.ok(lesson.parts[3].code?.includes('model_unilateral_dst_vs_pillar_one_amount_a'));
  assert.match(lesson.parts[4].title, /Milestone 1 Synthesis.*Supply Chain Indirect Tax/i);
  assert.ok(lesson.parts[4].code?.includes('run_global_supply_chain_indirect_tax_optimizer'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 120: B.Com Corporate Tax Day 5 Capstone: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_tax', 5);
  assert.ok(lesson, 'bcom_tax Day 5 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_tax');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5, 'bcom_tax Day 5 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_tax'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 120: B.Com Corporate Tax Day 5 Capstone: Global Tax Optimization Control Tower Verification', () => {
  const lesson = BCOM_TAX_LONG_LESSONS[4];
  assert.ok(lesson, 'BCOM_TAX_LONG_LESSONS[4] must exist');
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
  assert.match(lesson.parts[0].title, /Multi-Jurisdictional Tax Footprint.*Effective Tax Rate/i);
  assert.ok(lesson.parts[0].code?.includes('reconcile_global_multinational_tax_footprint'));
  assert.match(lesson.parts[1].title, /OECD Pillar Two.*Substance-Based Carve-Out/i);
  assert.ok(lesson.parts[1].code?.includes('calculate_pillar_two_sbco_and_top_up_tax'));
  assert.match(lesson.parts[2].title, /Transfer Pricing RPSM.*Section 163\(j\)/i);
  assert.ok(lesson.parts[2].code?.includes('orchestrate_transfer_pricing_and_debt_shield'));
  assert.match(lesson.parts[3].title, /Supply Chain Indirect Tax.*WTO Customs Harmonization/i);
  assert.ok(lesson.parts[3].code?.includes('execute_multinational_indirect_tax_and_customs_clearance'));
  assert.match(lesson.parts[4].title, /Capstone Boardroom Defense.*Chief Tax Officer/i);
  assert.ok(lesson.parts[4].code?.includes('run_comprehensive_corporate_tax_capstone'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});




