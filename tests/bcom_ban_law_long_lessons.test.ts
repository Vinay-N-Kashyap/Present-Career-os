import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';
import { BCOM_BAN_LONG_LESSONS } from '../src/lib/data/bcomBanLongLessons';
import { BCOM_LAW_LONG_LESSONS } from '../src/lib/data/bcomLawLongLessons';


test('B.Com Commercial Banking & Corporate Law Long Lessons: Resolution & Language Invariants', () => {
  // Commercial Banking (bcom_ban)
  const banLesson = getLongLesson('bcom_ban', 1);
  assert.ok(banLesson, 'bcom_ban Day 1 lesson must be defined');
  assert.equal(banLesson.coursePrefix, 'bcom_ban');
  assert.equal(banLesson.day, 1);
  assert.equal(banLesson.parts.length, 5, 'bcom_ban Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ban'), 'python', 'bcom_ban must use Python language runner');

  // Corporate Law (bcom_law)
  const lawLesson = getLongLesson('bcom_law', 1);
  assert.ok(lawLesson, 'bcom_law Day 1 lesson must be defined');
  assert.equal(lawLesson.coursePrefix, 'bcom_law');
  assert.equal(lawLesson.day, 1);
  assert.equal(lawLesson.parts.length, 5, 'bcom_law Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_law'), 'python', 'bcom_law must use Python language runner');
});

test('B.Com Commercial Banking Day 1: Money Multiplier, Duration Gap & Basel III Snippets Verification', () => {
  const lesson = BCOM_BAN_LONG_LESSONS[0];
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
  assert.ok(lesson.parts[0].code?.includes('FractionalReserveSystem'));
  assert.ok(lesson.parts[1].code?.includes('AssetLiabilityManager'));
  assert.ok(lesson.parts[2].code?.includes('BaselThreeCapitalEngine'));
  assert.ok(lesson.parts[3].code?.includes('LiquidityCoverageModel'));
  assert.ok(lesson.parts[4].code?.includes('CreditPortfolioRiskEngine'));
});

test('B.Com Corporate Law Day 1: Contracts, Veil Piercing, Fiduciary & Antitrust HHI Snippets Verification', () => {
  const lesson = BCOM_LAW_LONG_LESSONS[0];
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
  assert.ok(lesson.parts[0].code?.includes('ContractClauseValidator'));
  assert.ok(lesson.parts[1].code?.includes('CorporateVeilRiskModel'));
  assert.ok(lesson.parts[2].code?.includes('DirectorFiduciaryReview'));
  assert.ok(lesson.parts[3].code?.includes('InsiderTradingComplianceGate'));
  assert.ok(lesson.parts[4].code?.includes('AntitrustHHIAnalyzer'));
});

test('Block 34: B.Com Commercial Banking Day 2: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_ban', 2);
  assert.ok(lesson, 'bcom_ban Day 2 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_ban');
  assert.equal(lesson.day, 2);
  assert.equal(lesson.parts.length, 5, 'bcom_ban Day 2 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ban'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 9, `Spoken minutes (${spoken}) must be at least 9 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 34: B.Com Commercial Banking Day 2: Credit Underwriting, DSCR & NPL Workout Snippets Verification', () => {
  const lesson = BCOM_BAN_LONG_LESSONS[1];
  assert.ok(lesson, 'BCOM_BAN_LONG_LESSONS[1] must exist');
  assert.equal(lesson.day, 2);
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
    assert.ok(check.options.length >= 3, `Part ${i + 1} check must have >= 3 options`);
    assert.equal(typeof check.answer, 'number', `Part ${i + 1} answer must be numerical index`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be within options range`);
    assert.ok(check.why && check.why.length > 0, `Part ${i + 1} check why explanation must be non-empty`);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /5 Cs of Credit.*CFADS/i);
  assert.ok(lesson.parts[0].code?.includes('evaluate_debt_capacity'));
  assert.match(lesson.parts[1].title, /DSCR.*Stress Testing/i);
  assert.ok(lesson.parts[1].code?.includes('stress_test_dscr'));
  assert.match(lesson.parts[2].title, /Borrowing Base.*Haircuts/i);
  assert.ok(lesson.parts[2].code?.includes('calculate_borrowing_base'));
  assert.match(lesson.parts[3].title, /RAROC.*Pricing/i);
  assert.ok(lesson.parts[3].code?.includes('compute_raroc_and_credit_spread'));
  assert.match(lesson.parts[4].title, /IFRS 9.*Staging.*Workouts/i);
  assert.ok(lesson.parts[4].code?.includes('classify_ifrs9_staging_and_provision'));
});

test('Block 35: B.Com Corporate Law Day 2: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_law', 2);
  assert.ok(lesson, 'bcom_law Day 2 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_law');
  assert.equal(lesson.day, 2);
  assert.equal(lesson.parts.length, 5, 'bcom_law Day 2 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_law'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 9, `Spoken minutes (${spoken}) must be at least 9 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 35: B.Com Corporate Law Day 2: IP DTSA, SOX 404 & Poison Pill Snippets Verification', () => {
  const lesson = BCOM_LAW_LONG_LESSONS[1];
  assert.ok(lesson, 'BCOM_LAW_LONG_LESSONS[1] must exist');
  assert.equal(lesson.day, 2);
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
    assert.ok(check.options.length >= 3, `Part ${i + 1} check must have >= 3 options`);
    assert.equal(typeof check.answer, 'number', `Part ${i + 1} answer must be numerical index`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be within options range`);
    assert.ok(check.why && check.why.length > 0, `Part ${i + 1} check why explanation must be non-empty`);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /4 Pillars of Intellectual Property.*Trade Secret/i);
  assert.ok(lesson.parts[0].code?.includes('audit_ip_protection_hygiene'));
  assert.match(lesson.parts[1].title, /SOX.*Internal Controls.*Whistleblower/i);
  assert.ok(lesson.parts[1].code?.includes('evaluate_sox_internal_control_deficiency'));
  assert.match(lesson.parts[2].title, /ESG Governance.*Greenwashing/i);
  assert.ok(lesson.parts[2].code?.includes('evaluate_esg_governance_and_greenwashing_risk'));
  assert.match(lesson.parts[3].title, /Shareholder Lawsuits.*Direct.*Derivative/i);
  assert.ok(lesson.parts[3].code?.includes('route_shareholder_litigation'));
  assert.match(lesson.parts[4].title, /Hostile Takeovers.*Poison Pills.*Unocal/i);
  assert.ok(lesson.parts[4].code?.includes('simulate_shareholder_rights_plan_poison_pill'));
});

test('Block 112: B.Com Commercial Banking Day 3: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_ban', 3);
  assert.ok(lesson, 'bcom_ban Day 3 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_ban');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5, 'bcom_ban Day 3 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ban'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 112: B.Com Commercial Banking Day 3: Syndicated Lending, Trade LC & Treasury ALM Snippets Verification', () => {
  const lesson = BCOM_BAN_LONG_LESSONS[2];
  assert.ok(lesson, 'BCOM_BAN_LONG_LESSONS[2] must exist');
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
  assert.match(lesson.parts[0].title, /Syndicated Loan Facility Structuring/i);
  assert.ok(lesson.parts[0].code?.includes('structure_syndicated_facility'));
  assert.match(lesson.parts[1].title, /Structured Trade Finance.*Letters of Credit/i);
  assert.ok(lesson.parts[1].code?.includes('issue_and_discount_trade_lc'));
  assert.match(lesson.parts[2].title, /Treasury.*ALM.*Interest Rate Swap/i);
  assert.ok(lesson.parts[2].code?.includes('hedge_alm_interest_rate_swap'));
  assert.match(lesson.parts[3].title, /Basel III Liquidity.*LCR.*NSFR/i);
  assert.ok(lesson.parts[3].code?.includes('stress_test_lcr_and_nsfr'));
  assert.match(lesson.parts[4].title, /Counterparty Credit Risk.*CVA.*ISDA/i);
  assert.ok(lesson.parts[4].code?.includes('calculate_cva_and_netting'));
});

test('Block 113: B.Com Commercial Banking Day 4: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_ban', 4);
  assert.ok(lesson, 'bcom_ban Day 4 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_ban');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5, 'bcom_ban Day 4 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ban'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 113: B.Com Commercial Banking Day 4: Fintech, ISO 20022 & AML Graph Analytics Snippets Verification', () => {
  const lesson = BCOM_BAN_LONG_LESSONS[3];
  assert.ok(lesson, 'BCOM_BAN_LONG_LESSONS[3] must exist');
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
  assert.match(lesson.parts[0].title, /Open Banking.*PSD2.*Consent/i);
  assert.ok(lesson.parts[0].code?.includes('evaluate_open_banking_consent_and_api'));
  assert.match(lesson.parts[1].title, /ISO 20022.*pacs\.008.*Reconciliation/i);
  assert.ok(lesson.parts[1].code?.includes('generate_and_reconcile_iso20022_pacs008'));
  assert.match(lesson.parts[2].title, /Anti-Money Laundering.*Smurfing.*SAR/i);
  assert.ok(lesson.parts[2].code?.includes('evaluate_aml_transaction_rules'));
  assert.match(lesson.parts[3].title, /Benford.*Law.*First-Digit.*Anomaly/i);
  assert.ok(lesson.parts[3].code?.includes('audit_benford_law_first_digit_anomalies'));
  assert.match(lesson.parts[4].title, /Graph Fraud Analytics.*Mule Ring/i);
  assert.ok(lesson.parts[4].code?.includes('detect_money_laundering_graph_cycles_and_mules'));
});

test('Block 114: B.Com Commercial Banking Day 5 Capstone: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_ban', 5);
  assert.ok(lesson, 'bcom_ban Day 5 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_ban');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5, 'bcom_ban Day 5 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ban'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 114: B.Com Commercial Banking Day 5 Capstone: CCAR Stress Testing & Capital Restoration Snippets Verification', () => {
  const lesson = BCOM_BAN_LONG_LESSONS[4];
  assert.ok(lesson, 'BCOM_BAN_LONG_LESSONS[4] must exist');
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
  assert.match(lesson.parts[0].title, /Multi-Asset Balance Sheet.*RWA Aggregation/i);
  assert.ok(lesson.parts[0].code?.includes('aggregate_commercial_bank_rwa_and_capital'));
  assert.match(lesson.parts[1].title, /CCAR Severely Adverse.*Credit Migration/i);
  assert.ok(lesson.parts[1].code?.includes('simulate_ccar_severely_adverse_credit_migration'));
  assert.match(lesson.parts[2].title, /Net Interest Income.*NII.*Deposit Beta/i);
  assert.ok(lesson.parts[2].code?.includes('simulate_nii_yield_curve_compression'));
  assert.match(lesson.parts[3].title, /Dynamic Capital Buffers.*CoCo Bond/i);
  assert.ok(lesson.parts[3].code?.includes('execute_capital_restoration_and_coco_conversion'));
  assert.match(lesson.parts[4].title, /Capstone Supervisory Defense.*CCAR Certification/i);
  assert.ok(lesson.parts[4].code?.includes('run_comprehensive_ccar_capital_stress_test'));
});

test('Block 115: B.Com Corporate Law Day 3: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_law', 3);
  assert.ok(lesson, 'bcom_law Day 3 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_law');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5, 'bcom_law Day 3 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_law'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 115: B.Com Corporate Law Day 3: M&A Due Diligence, Reps & Warranties, MAE & HHI Snippets Verification', () => {
  const lesson = BCOM_LAW_LONG_LESSONS[2];
  assert.ok(lesson, 'BCOM_LAW_LONG_LESSONS[2] must exist');
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
  assert.match(lesson.parts[0].title, /Due Diligence.*Risk Scoring/i);
  assert.ok(lesson.parts[0].code?.includes('evaluate_ma_due_diligence_risks'));
  assert.match(lesson.parts[1].title, /Representations & Warranties.*Indemnification.*RWI/i);
  assert.ok(lesson.parts[1].code?.includes('calculate_indemnification_and_rwi_payout'));
  assert.match(lesson.parts[2].title, /Material Adverse Effect.*MAE.*MAC/i);
  assert.ok(lesson.parts[2].code?.includes('evaluate_material_adverse_effect_mae'));
  assert.match(lesson.parts[3].title, /FTC.*DOJ Antitrust.*HHI Delta/i);
  assert.ok(lesson.parts[3].code?.includes('analyze_antitrust_merger_hhi'));
  assert.match(lesson.parts[4].title, /Breakup Fees.*Reverse Breakup.*Deal Protection/i);
  assert.ok(lesson.parts[4].code?.includes('evaluate_deal_protection_and_breakup_fees'));
});

test('Block 116: B.Com Corporate Law Day 4: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_law', 4);
  assert.ok(lesson, 'bcom_law Day 4 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_law');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5, 'bcom_law Day 4 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_law'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 116: B.Com Corporate Law Day 4: Caremark Oversight, Activism 13D, 10b5-1 & Upjohn Snippets Verification', () => {
  const lesson = BCOM_LAW_LONG_LESSONS[3];
  assert.ok(lesson, 'BCOM_LAW_LONG_LESSONS[3] must exist');
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
  assert.match(lesson.parts[0].title, /Board Oversight.*Caremark.*Marchand/i);
  assert.ok(lesson.parts[0].code?.includes('evaluate_caremark_oversight_liability'));
  assert.match(lesson.parts[1].title, /Shareholder Activism.*Schedule 13D.*Universal Proxy/i);
  assert.ok(lesson.parts[1].code?.includes('simulate_activist_schedule13d_and_proxy_vote'));
  assert.match(lesson.parts[2].title, /SEC Rule 10b5-1.*Cooling-Off/i);
  assert.ok(lesson.parts[2].code?.includes('validate_sec_rule_10b5_1_trading_plan'));
  assert.match(lesson.parts[3].title, /Regulation Fair Disclosure.*Reg FD/i);
  assert.ok(lesson.parts[3].code?.includes('audit_regulation_fd_compliance'));
  assert.match(lesson.parts[4].title, /Corporate Internal Investigations.*Upjohn/i);
  assert.ok(lesson.parts[4].code?.includes('evaluate_internal_investigation_upjohn_privilege'));
});

test('Block 117: B.Com Corporate Law Day 5 Capstone: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_law', 5);
  assert.ok(lesson, 'bcom_law Day 5 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_law');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5, 'bcom_law Day 5 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_law'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 117: B.Com Corporate Law Day 5 Capstone: Chapter 11 Reorganization & Corporate Restructuring Control Tower Verification', () => {
  const lesson = BCOM_LAW_LONG_LESSONS[4];
  assert.ok(lesson, 'BCOM_LAW_LONG_LESSONS[4] must exist');
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
  assert.match(lesson.parts[0].title, /Chapter 11 Petition.*Automatic Stay.*DIP/i);
  assert.ok(lesson.parts[0].code?.includes('structure_dip_financing_and_automatic_stay'));
  assert.match(lesson.parts[1].title, /Section 363 Asset Sales/i);
  assert.ok(lesson.parts[1].code?.includes('evaluate_section363_stalking_horse_auction'));
  assert.match(lesson.parts[2].title, /Confirmation Plan.*Absolute Priority Rule Cramdown/i);
  assert.ok(lesson.parts[2].code?.includes('simulate_chapter11_plan_cramdown_and_absolute_priority'));
  assert.match(lesson.parts[3].title, /Zone of Insolvency.*Fraudulent Conveyances/i);
  assert.ok(lesson.parts[3].code?.includes('audit_zone_of_insolvency_and_fraudulent_conveyance'));
  assert.match(lesson.parts[4].title, /Capstone Boardroom Defense.*General Counsel Restructuring Certification/i);
  assert.ok(lesson.parts[4].code?.includes('run_comprehensive_corporate_restructuring_capstone'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 197 (TASK-776..780): bcom_ban Days 6–10 resolve with strict 5-part LongLesson invariants and >= 20.0 spoken minutes', () => {
  for (let day = 6; day <= 10; day++) {
    const lesson = getLongLesson('bcom_ban', day);
    assert.ok(lesson, `bcom_ban Day ${day} must resolve`);
    assert.equal(lesson.coursePrefix, 'bcom_ban');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.equal(getLongLessonLanguage('bcom_ban'), 'python');

    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20.0, `Day ${day} spoken minutes (${spoken}) must be >= 20.0 min`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 35.0, `Day ${day} total minutes (${total}) must be >= 35.0 min`);

    let dayTotalWords = 0;
    lesson.parts.forEach((part, idx) => {
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(Array.isArray(part.say) && part.say.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 say paragraphs`);

      const partWordCount = (part.say as string[]).reduce((sum, p) => sum + p.split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWordCount >= 580, `Day ${day} Part ${idx + 1} word count (${partWordCount}) must be >= 580 words`);
      dayTotalWords += partWordCount;

      assert.ok(part.example, `Day ${day} Part ${idx + 1} must include a real-world example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must include executable Python code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must include expected console output`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must include a tryIt experiment`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 codeNotes`);

      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question text`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < 4, `Day ${day} Part ${idx + 1} answer must be in [0..3]`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });

    assert.ok(dayTotalWords >= 2950, `Day ${day} total words (${dayTotalWords}) must be >= 2950 words`);
    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${day} summary must have >= 4 bullet points`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 3, `Day ${day} projectStep must have title and >= 3 steps`);
  }
});

test('Block 197 (TASK-776..780): bcom_ban Days 6–10 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & ledger-sheet template', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');
  const { getTappableLabelsForVisual } = await import('../src/lib/visuals/visualRules');

  clearDayFileCache();

  for (let day = 6; day <= 10; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ban/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ban', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ban Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ban');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ban Day ${day}`);

    const lesson = getLongLesson('bcom_ban', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ban Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom_ban Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ban', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ban Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'ledger-sheet', `Expected template "ledger-sheet" for bcom_ban`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ban Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      // Verify balanced double-entry ledger bookkeeping
      visual.steps.forEach((step: any, stepIdx: number) => {
        assert.equal(step.isBalanced, true, `Step ${stepIdx} in Day ${day} Part ${partIdx} must be balanced`);
        assert.equal(step.totalDebit, step.totalCredit, `Step ${stepIdx} debits must equal credits`);
      });

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for bcom_ban Day ${day} Part ${partIdx}`);
    }
  }
});

test('Block 197 (TASK-776..780): Domain specifics & deterministic Python code verification across Days 6–10', () => {
  // Day 6: Loan Syndication & MLA Governance
  const d6 = getLongLesson('bcom_ban', 6)!;
  assert.ok(d6.parts[0].code?.includes('model_loan_syndication_allocation'));
  assert.ok(d6.parts[1].code?.includes('evaluate_syndication_structure_tradeoffs'));
  assert.ok(d6.parts[2].code?.includes('calculate_syndicate_fee_waterfall'));
  assert.ok(d6.parts[3].code?.includes('audit_covenant_compliance_and_voting'));
  assert.ok(d6.parts[4].code?.includes('audit_wholesale_agency_operation_invariants'));

  // Day 7: International Trade Finance & LC Compliance
  const d7 = getLongLesson('bcom_ban', 7)!;
  assert.ok(d7.parts[0].code?.includes('calculate_letter_of_credit_economics'));
  assert.ok(d7.parts[1].code?.includes('audit_ucp600_documentary_presentation'));
  assert.ok(d7.parts[2].code?.includes('calculate_bankers_acceptance_discounting'));
  assert.ok(d7.parts[3].code?.includes('audit_bank_guarantee_exposure_and_calling'));
  assert.ok(d7.parts[4].code?.includes('audit_trade_finance_operations_compliance'));

  // Day 8: Bank Treasury Operations & Repo Markets
  const d8 = getLongLesson('bcom_ban', 8)!;
  assert.ok(d8.parts[0].code?.includes('evaluate_daily_treasury_liquidity_position'));
  assert.ok(d8.parts[1].code?.includes('model_repo_transaction_and_margin_call'));
  assert.ok(d8.parts[2].code?.includes('calculate_compounded_sofr_in_arrears'));
  assert.ok(d8.parts[3].code?.includes('model_treasury_liquidity_maturity_ladder'));
  assert.ok(d8.parts[4].code?.includes('audit_bank_alm_duration_and_liquidity_run'));

  // Day 9: Retail Banking Operations & Mortgages
  const d9 = getLongLesson('bcom_ban', 9)!;
  assert.ok(d9.parts[0].code?.includes('evaluate_retail_mortgage_underwriting'));
  assert.ok(d9.parts[1].code?.includes('calculate_mortgage_amortization_and_prepayment'));
  assert.ok(d9.parts[2].code?.includes('calculate_retail_credit_score_and_pnd'));
  assert.ok(d9.parts[3].code?.includes('model_credit_card_delinquency_waterfall'));
  assert.ok(d9.parts[4].code?.includes('audit_retail_credit_governance_invariants'));

  // Day 10: ⭐ Milestone 2 Capstone: Autonomous Bank Operations Engine
  const d10 = getLongLesson('bcom_ban', 10)!;
  assert.ok(d10.parts[0].code?.includes('model_integrated_bank_balance_sheet'));
  assert.ok(d10.parts[1].code?.includes('verify_5tier_banking_architecture_integrity'));
  assert.ok(d10.parts[2].code?.includes('audit_commercial_banking_quantitative_invariants'));
  assert.ok(d10.parts[3].code?.includes('run_autonomous_commercial_banking_command_engine'));
  assert.ok(d10.parts[4].code?.includes('verify_milestone2_banking_masterclass_certification'));
});

test('Block 198 (TASK-781..785): bcom_ban Days 11–15 5-part pedagogical structure, word counts & duration invariants', () => {
  for (let day = 11; day <= 15; day++) {
    const lesson = getLongLesson('bcom_ban', day);
    assert.ok(lesson, `bcom_ban Day ${day} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom_ban');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);

    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20.0, `Day ${day} spoken minutes (${spoken}) must be >= 20.0 min`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 35.0, `Day ${day} total lesson minutes (${total}) must be >= 35.0 min`);

    let dayTotalWords = 0;
    lesson.parts.forEach((part, idx) => {
      const partWords = (part.say as string[]).reduce((sum, p) => sum + p.split(/\s+/).filter(Boolean).length, 0);
      dayTotalWords += partWords;
      assert.ok(partWords >= 580, `Day ${day} Part ${idx + 1} words (${partWords}) must be >= 580 words`);
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(part.say.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 spoken paragraphs`);
      assert.ok(part.example, `Day ${day} Part ${idx + 1} must include a real-world banking example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must include executable Python code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must include expected console output`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must include a tryIt experiment`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 codeNotes`);

      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question text`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < 4, `Day ${day} Part ${idx + 1} answer must be in [0..3]`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });

    assert.ok(dayTotalWords >= 2950, `Day ${day} total words (${dayTotalWords}) must be >= 2950 words`);
    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${day} summary must have >= 4 bullet points`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 3, `Day ${day} projectStep must have title and >= 3 steps`);
  }
});

test('Block 198 (TASK-781..785): bcom_ban Days 11–15 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & ledger-sheet template', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');
  const { getTappableLabelsForVisual } = await import('../src/lib/visuals/visualRules');

  clearDayFileCache();

  for (let day = 11; day <= 15; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ban/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ban', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ban Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ban');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ban Day ${day}`);

    const lesson = getLongLesson('bcom_ban', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ban Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom_ban Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ban', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ban Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'ledger-sheet', `Expected template "ledger-sheet" for bcom_ban`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ban Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      // Verify balanced double-entry ledger bookkeeping
      visual.steps.forEach((step: any, stepIdx: number) => {
        assert.equal(step.isBalanced, true, `Step ${stepIdx} in Day ${day} Part ${partIdx} must be balanced`);
        assert.equal(step.totalDebit, step.totalCredit, `Step ${stepIdx} debits must equal credits`);
      });

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for bcom_ban Day ${day} Part ${partIdx}`);
    }
  }
});

test('Block 198 (TASK-781..785): Domain specifics & deterministic Python code verification across Days 11–15', () => {
  // Day 11: Equity Capital Markets & IPO Bookbuilding (TASK-781)
  const d11 = getLongLesson('bcom_ban', 11)!;
  assert.ok(d11.parts[0].code?.includes('model_ipo_underwriting_syndicate_spread'));
  assert.ok(d11.parts[1].code?.includes('model_ipo_bookbuilding_orderbook_clearing'));
  assert.ok(d11.parts[2].code?.includes('evaluate_ipo_underpricing_and_money_left_on_table'));
  assert.ok(d11.parts[3].code?.includes('simulate_greenshoe_syndicate_stabilization_engine'));
  assert.ok(d11.parts[4].code?.includes('audit_ecm_regulatory_governance_invariants'));

  // Day 12: Debt Capital Markets & Corporate Bonds (TASK-782)
  const d12 = getLongLesson('bcom_ban', 12)!;
  assert.ok(d12.parts[0].code?.includes('model_dcm_bond_issuance_economics'));
  assert.ok(d12.parts[1].code?.includes('calculate_corporate_bond_yield_spreads'));
  assert.ok(d12.parts[2].code?.includes('model_bond_duration_and_convexity_risk'));
  assert.ok(d12.parts[3].code?.includes('evaluate_dcm_cross_border_placement_tranches'));
  assert.ok(d12.parts[4].code?.includes('audit_dcm_underwriting_and_covenant_governance'));

  // Day 13: M&A Advisory & Fairness Opinions (TASK-783)
  const d13 = getLongLesson('bcom_ban', 13)!;
  assert.ok(d13.parts[0].code?.includes('model_ma_advisory_mandate_and_success_fees'));
  assert.ok(d13.parts[1].code?.includes('calculate_ma_valuation_football_field'));
  assert.ok(d13.parts[2].code?.includes('evaluate_ma_eps_accretion_dilution_and_synergies'));
  assert.ok(d13.parts[3].code?.includes('simulate_ma_deal_protection_and_breakup_fees'));
  assert.ok(d13.parts[4].code?.includes('audit_ma_fairness_opinion_governance_invariants'));

  // Day 14: Structured Credit & Securitization Waterfalls (TASK-784)
  const d14 = getLongLesson('bcom_ban', 14)!;
  assert.ok(d14.parts[0].code?.includes('model_spv_true_sale_and_capital_relief'));
  assert.ok(d14.parts[1].code?.includes('calculate_structured_credit_tranche_subordination'));
  assert.ok(d14.parts[2].code?.includes('simulate_securitization_cash_flow_waterfall'));
  assert.ok(d14.parts[3].code?.includes('evaluate_dodd_frank_risk_retention_compliance'));
  assert.ok(d14.parts[4].code?.includes('audit_structured_credit_rating_and_governance'));

  // Day 15: ⭐ Milestone 3 Capstone: Enterprise Investment Banking Command Platform (TASK-785)
  const d15 = getLongLesson('bcom_ban', 15)!;
  assert.ok(d15.parts[0].code?.includes('model_enterprise_investment_banking_division'));
  assert.ok(d15.parts[1].code?.includes('verify_5tier_investment_banking_architecture'));
  assert.ok(d15.parts[2].code?.includes('audit_investment_banking_quantitative_invariants'));
  assert.ok(d15.parts[3].code?.includes('run_autonomous_investment_banking_command_engine'));
  assert.ok(d15.parts[4].code?.includes('verify_milestone3_investment_banking_masterclass_certification'));
});

test('Block 199 (TASK-786..790): bcom_ban Days 16–20 Resolution & Pedagogical Structure Invariants', () => {
  for (let day = 16; day <= 20; day++) {
    const lesson = getLongLesson('bcom_ban', day);
    assert.ok(lesson, `bcom_ban Day ${day} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom_ban');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_ban Day ${day} must have exactly 5 parts`);
    assert.equal(getLongLessonLanguage('bcom_ban'), 'python');

    let totalSpokenWords = 0;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const part = lesson.parts[partIdx];
      assert.ok(part.title.length > 0, `Day ${day} Part ${partIdx + 1} must have a non-empty title`);
      assert.ok(part.say.length >= 3, `Day ${day} Part ${partIdx + 1} must have at least 3 explanation paragraphs`);
      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${partIdx + 1} must have a real-world example`);
      assert.ok(part.code && part.code.includes('def '), `Day ${day} Part ${partIdx + 1} code must contain Python functions`);
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${partIdx + 1} must have deterministic expected output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${partIdx + 1} must have a tryIt experiment`);

      const partWords = part.say.reduce((acc, p) => acc + p.split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWords >= 580, `Day ${day} Part ${partIdx + 1} word count (${partWords}) must be >= 580 words`);
      totalSpokenWords += partWords;

      // Socratic Check validation
      const check = part.check as any;
      assert.ok(check.question.length > 0, `Day ${day} Part ${partIdx + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${partIdx + 1} check must have exactly 4 options`);
      assert.ok(
        (typeof check.answer === 'number' && check.answer >= 0 && check.answer < 4) ||
        (typeof check.answerIndex === 'number' && check.answerIndex >= 0 && check.answerIndex < 4),
        `Day ${day} Part ${partIdx + 1} answer must be a valid option index (0..3)`
      );
      assert.ok(
        (check.why && check.why.length > 0) || (check.explanation && check.explanation.length > 0),
        `Day ${day} Part ${partIdx + 1} check must have a non-empty explanation`
      );
    }

    assert.ok(totalSpokenWords >= 2950, `Day ${day} total spoken words (${totalSpokenWords}) must be >= 2,950 words`);
    const spokenMinutes = estimateSpokenMinutes(lesson);
    assert.ok(spokenMinutes >= 20.0, `Day ${day} spoken minutes (${spokenMinutes}) must be >= 20.0 minutes`);
  }
});

test('Block 199 (TASK-786..790): bcom_ban Days 16–20 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & ledger-sheet template', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');
  const { getTappableLabelsForVisual } = await import('../src/lib/visuals/visualRules');

  clearDayFileCache();

  for (let day = 16; day <= 20; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ban/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ban', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ban Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ban');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ban Day ${day}`);

    const lesson = getLongLesson('bcom_ban', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ban Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom_ban Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ban', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ban Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'ledger-sheet', `Expected template "ledger-sheet" for bcom_ban`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ban Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      // Verify balanced double-entry ledger bookkeeping
      visual.steps.forEach((step: any, stepIdx: number) => {
        assert.equal(step.isBalanced, true, `Step ${stepIdx} in Day ${day} Part ${partIdx} must be balanced`);
        assert.equal(step.totalDebit, step.totalCredit, `Step ${stepIdx} debits must equal credits`);
      });

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for bcom_ban Day ${day} Part ${partIdx}`);
    }
  }
});

test('Block 199 (TASK-786..790): Domain specifics & deterministic Python code verification across Days 16–20', () => {
  // Day 16: Wealth Management & Private Banking (TASK-786)
  const d16 = getLongLesson('bcom_ban', 16)!;
  assert.ok(d16.parts[0].code?.includes('model_family_office_asset_allocation'));
  assert.ok(d16.parts[1].code?.includes('calculate_markowitz_portfolio_metrics'));
  assert.ok(d16.parts[2].code?.includes('evaluate_dynasty_trust_tax_shield'));
  assert.ok(d16.parts[3].code?.includes('simulate_wealth_preservation_monte_carlo'));
  assert.ok(d16.parts[4].code?.includes('audit_wealth_management_regulatory_compliance'));

  // Day 17: Derivatives Trading & Hedging (TASK-787)
  const d17 = getLongLesson('bcom_ban', 17)!;
  assert.ok(d17.parts[0].code?.includes('model_interest_rate_swap_valuation'));
  assert.ok(d17.parts[1].code?.includes('calculate_black_scholes_and_greeks'));
  assert.ok(d17.parts[2].code?.includes('model_cross_currency_basis_swap'));
  assert.ok(d17.parts[3].code?.includes('simulate_structured_note_payoff_engine'));
  assert.ok(d17.parts[4].code?.includes('audit_isda_csa_variation_margin_compliance'));

  // Day 18: Risk Management & Basel Framework (TASK-788)
  const d18 = getLongLesson('bcom_ban', 18)!;
  assert.ok(d18.parts[0].code?.includes('calculate_basel_expected_credit_loss'));
  assert.ok(d18.parts[1].code?.includes('calculate_var_and_expected_shortfall'));
  assert.ok(d18.parts[2].code?.includes('calculate_basel_capital_adequacy_ratios'));
  assert.ok(d18.parts[3].code?.includes('simulate_ccar_severely_adverse_stress_engine'));
  assert.ok(d18.parts[4].code?.includes('audit_enterprise_risk_governance_invariants'));

  // Day 19: Digital Banking & Open Banking APIs (TASK-789)
  const d19 = getLongLesson('bcom_ban', 19)!;
  assert.ok(d19.parts[0].code?.includes('model_cloud_native_core_banking_ledger'));
  assert.ok(d19.parts[1].code?.includes('generate_iso20022_pacs008_message'));
  assert.ok(d19.parts[2].code?.includes('model_open_banking_aisp_pisp_api_gateway'));
  assert.ok(d19.parts[3].code?.includes('simulate_instant_payment_rail_engine'));
  assert.ok(d19.parts[4].code?.includes('audit_digital_banking_cyber_and_fraud_invariants'));

  // Day 20: ⭐ Milestone 4 Capstone: Autonomous Global Banking & Financial Services Control Tower (TASK-790)
  const d20 = getLongLesson('bcom_ban', 20)!;
  assert.ok(d20.parts[0].code?.includes('model_global_private_wealth_orchestrator'));
  assert.ok(d20.parts[1].code?.includes('verify_tier2_institutional_derivatives_engine'));
  assert.ok(d20.parts[2].code?.includes('audit_tier3_basel_capital_and_ccar_invariants'));
  assert.ok(d20.parts[3].code?.includes('run_tier4_digital_banking_payment_rail_engine'));
  assert.ok(d20.parts[4].code?.includes('verify_milestone4_global_banking_masterclass_certification'));
});

test('Block 200 (TASK-791..795): bcom_ban Days 21–25 5-part architecture, >= 580 words per part, >= 2,950 total words & >= 20.0 minutes spoken audio', () => {
  for (let day = 21; day <= 25; day++) {
    const lesson = getLongLesson('bcom_ban', day);
    assert.ok(lesson, `bcom_ban Day ${day} must be defined in registry`);
    assert.equal(lesson.coursePrefix, 'bcom_ban');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_ban Day ${day} must have exactly 5 parts`);
    assert.equal(getLongLessonLanguage('bcom_ban'), 'python');

    let totalSpokenWords = 0;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const part = lesson.parts[partIdx];
      assert.ok(part.title.length > 0, `Day ${day} Part ${partIdx + 1} must have a non-empty title`);
      assert.ok(part.say.length >= 3, `Day ${day} Part ${partIdx + 1} must have at least 3 explanation paragraphs`);
      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${partIdx + 1} must have a real-world example`);
      assert.ok(part.code && part.code.includes('def '), `Day ${day} Part ${partIdx + 1} code must contain Python functions`);
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${partIdx + 1} must have deterministic expected output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${partIdx + 1} must have a tryIt experiment`);

      const partWords = part.say.reduce((acc, p) => acc + p.split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWords >= 580, `Day ${day} Part ${partIdx + 1} word count (${partWords}) must be >= 580 words`);
      totalSpokenWords += partWords;

      // Socratic Check validation
      const check = part.check as any;
      assert.ok(check.question.length > 0, `Day ${day} Part ${partIdx + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${partIdx + 1} check must have exactly 4 options`);
      assert.ok(
        (typeof check.answer === 'number' && check.answer >= 0 && check.answer < 4) ||
        (typeof check.answerIndex === 'number' && check.answerIndex >= 0 && check.answerIndex < 4),
        `Day ${day} Part ${partIdx + 1} answer must be a valid option index (0..3)`
      );
      assert.ok(
        (check.why && check.why.length > 0) || (check.explanation && check.explanation.length > 0),
        `Day ${day} Part ${partIdx + 1} check must have a non-empty explanation`
      );
    }

    assert.ok(totalSpokenWords >= 2950, `Day ${day} total spoken words (${totalSpokenWords}) must be >= 2,950 words`);
    const spokenMinutes = estimateSpokenMinutes(lesson);
    assert.ok(spokenMinutes >= 20.0, `Day ${day} spoken minutes (${spokenMinutes}) must be >= 20.0 minutes`);
  }
});

test('Block 200 (TASK-791..795): bcom_ban Days 21–25 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & ledger-sheet template', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');
  const { getTappableLabelsForVisual } = await import('../src/lib/visuals/visualRules');

  clearDayFileCache();

  for (let day = 21; day <= 25; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ban/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ban', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ban Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ban');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ban Day ${day}`);

    const lesson = getLongLesson('bcom_ban', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ban Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom_ban Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ban', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ban Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'ledger-sheet', `Expected template "ledger-sheet" for bcom_ban`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ban Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      visual.steps.forEach((step: any, stepIdx: number) => {
        assert.equal(step.isBalanced, true, `Step ${stepIdx} in Day ${day} Part ${partIdx} must be balanced`);
        assert.equal(step.totalDebit, step.totalCredit, `Step ${stepIdx} debits must equal credits`);
      });

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for bcom_ban Day ${day} Part ${partIdx}`);
    }
  }
});

test('Block 200 (TASK-791..795): Domain specifics & deterministic Python code verification across Days 21–25', () => {
  // Day 21: Microfinance & Financial Inclusion (TASK-791)
  const d21 = getLongLesson('bcom_ban', 21)!;
  assert.ok(d21.parts[0].code?.includes('model_joint_liability_group_microfinance'));
  assert.ok(d21.parts[1].code?.includes('calculate_priority_sector_lending_compliance'));
  assert.ok(d21.parts[2].code?.includes('model_digital_ekyc_and_video_kyc_verification'));
  assert.ok(d21.parts[3].code?.includes('simulate_cash_flow_micro_underwriting'));
  assert.ok(d21.parts[4].code?.includes('audit_fair_microfinance_lending_governance'));

  // Day 22: Sustainable Finance & ESG Banking (TASK-792)
  const d22 = getLongLesson('bcom_ban', 22)!;
  assert.ok(d22.parts[0].code?.includes('model_green_bond_issuance_and_greenium'));
  assert.ok(d22.parts[1].code?.includes('model_equator_principles_assessment'));
  assert.ok(d22.parts[2].code?.includes('model_pcaf_financed_emissions'));
  assert.ok(d22.parts[3].code?.includes('model_climate_stress_testing_ngfs'));
  assert.ok(d22.parts[4].code?.includes('model_sustainability_linked_loan'));

  // Day 23: Islamic Banking & Shariah Finance (TASK-793)
  const d23 = getLongLesson('bcom_ban', 23)!;
  assert.ok(d23.parts[0].code?.includes('model_riba_vs_murabaha_comparison'));
  assert.ok(d23.parts[1].code?.includes('model_commodity_murabaha_tawarruq'));
  assert.ok(d23.parts[2].code?.includes('model_diminishing_musharakah'));
  assert.ok(d23.parts[3].code?.includes('model_sukuk_al_ijara_issuance'));
  assert.ok(d23.parts[4].code?.includes('model_mudarabah_profit_sharing'));

  // Day 24: Central Bank Digital Currencies (CBDCs) (TASK-794)
  const d24 = getLongLesson('bcom_ban', 24)!;
  assert.ok(d24.parts[0].code?.includes('model_two_tier_cbdc_issuance'));
  assert.ok(d24.parts[1].code?.includes('model_mbridge_cross_border_settlement'));
  assert.ok(d24.parts[2].code?.includes('model_programmable_smart_contract_cbdc'));
  assert.ok(d24.parts[3].code?.includes('model_offline_dual_cash_protocol'));
  assert.ok(d24.parts[4].code?.includes('model_disintermediation_guardrail_caps'));

  // Day 25: ⭐ Milestone 5 Capstone: Autonomous Future of Banking Control Tower (TASK-795)
  const d25 = getLongLesson('bcom_ban', 25)!;
  assert.ok(d25.parts[0].code?.includes('verify_tier1_microfinance_inclusion'));
  assert.ok(d25.parts[1].code?.includes('verify_tier2_sustainable_esg_banking'));
  assert.ok(d25.parts[2].code?.includes('verify_tier3_islamic_shariah_finance'));
  assert.ok(d25.parts[3].code?.includes('verify_tier4_cbdc_cross_border_rails'));
  assert.ok(d25.parts[4].code?.includes('verify_tier5_milestone5_grand_master'));
});

test('Block 201 (TASK-796..800): bcom_ban Days 26–30 5-part architecture, >= 580 words per part, >= 2,950 total words & >= 20.0 minutes spoken audio', () => {
  for (let day = 26; day <= 30; day++) {
    const lesson = getLongLesson('bcom_ban', day);
    assert.ok(lesson, `bcom_ban Day ${day} must be defined in registry`);
    assert.equal(lesson.coursePrefix, 'bcom_ban');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_ban Day ${day} must have exactly 5 parts`);
    assert.equal(getLongLessonLanguage('bcom_ban'), 'python');

    let totalSpokenWords = 0;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const part = lesson.parts[partIdx];
      assert.ok(part.title.length > 0, `Day ${day} Part ${partIdx + 1} must have a non-empty title`);
      assert.ok(part.say.length >= 3, `Day ${day} Part ${partIdx + 1} must have at least 3 explanation paragraphs`);
      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${partIdx + 1} must have a real-world example`);
      assert.ok(part.code && part.code.includes('def '), `Day ${day} Part ${partIdx + 1} code must contain Python functions`);
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${partIdx + 1} must have deterministic expected output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${partIdx + 1} must have a tryIt experiment`);

      const partWords = part.say.reduce((acc, p) => acc + p.split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWords >= 580, `Day ${day} Part ${partIdx + 1} word count (${partWords}) must be >= 580 words`);
      totalSpokenWords += partWords;

      // Socratic Check validation
      const check = part.check as any;
      assert.ok(check.question.length > 0, `Day ${day} Part ${partIdx + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${partIdx + 1} check must have exactly 4 options`);
      assert.ok(
        (typeof check.answer === 'number' && check.answer >= 0 && check.answer < 4) ||
        (typeof check.answerIndex === 'number' && check.answerIndex >= 0 && check.answerIndex < 4),
        `Day ${day} Part ${partIdx + 1} answer must be a valid option index (0..3)`
      );
      assert.ok(
        (check.why && check.why.length > 0) || (check.explanation && check.explanation.length > 0),
        `Day ${day} Part ${partIdx + 1} check must have a non-empty explanation`
      );
    }

    assert.ok(totalSpokenWords >= 2950, `Day ${day} total spoken words (${totalSpokenWords}) must be >= 2,950 words`);
    const spokenMinutes = estimateSpokenMinutes(lesson);
    assert.ok(spokenMinutes >= 20.0, `Day ${day} spoken minutes (${spokenMinutes}) must be >= 20.0 minutes`);
  }
});

test('Block 201 (TASK-796..800): bcom_ban Days 26–30 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & ledger-sheet template', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');
  const { getTappableLabelsForVisual } = await import('../src/lib/visuals/visualRules');

  clearDayFileCache();

  for (let day = 26; day <= 30; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ban/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ban', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ban Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ban');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ban Day ${day}`);

    const lesson = getLongLesson('bcom_ban', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ban Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom_ban Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ban', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ban Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'ledger-sheet', `Expected template "ledger-sheet" for bcom_ban`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ban Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      visual.steps.forEach((step: any, stepIdx: number) => {
        assert.equal(step.isBalanced, true, `Step ${stepIdx} in Day ${day} Part ${partIdx} must be balanced`);
        assert.equal(step.totalDebit, step.totalCredit, `Step ${stepIdx} debits must equal credits`);
      });

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for bcom_ban Day ${day} Part ${partIdx}`);
    }
  }
});

test('Block 201 (TASK-796..800): Domain specifics & deterministic Python code verification across Days 26–30', () => {
  // Day 26: Cross-Border Corporate Treasury & International Liquidity Management (TASK-796)
  const d26 = getLongLesson('bcom_ban', 26)!;
  assert.ok(d26.parts[0].code?.includes('model_cash_concentration_and_pooling'));
  assert.ok(d26.parts[1].code?.includes('model_cross_border_notional_pooling'));
  assert.ok(d26.parts[2].code?.includes('model_multicurrency_fx_forward_hedging'));
  assert.ok(d26.parts[3].code?.includes('model_in_house_banking_multilateral_netting'));
  assert.ok(d26.parts[4].code?.includes('model_treasury_cash_visibility_camt053'));

  // Day 27: Quantitative Credit Portfolio Management & Credit Default Swaps (TASK-797)
  const d27 = getLongLesson('bcom_ban', 27)!;
  assert.ok(d27.parts[0].code?.includes('model_cds_pricing_and_payout'));
  assert.ok(d27.parts[1].code?.includes('model_cdx_index_tranche_loss_absorption'));
  assert.ok(d27.parts[2].code?.includes('model_gaussian_copula_portfolio_default'));
  assert.ok(d27.parts[3].code?.includes('model_credit_valuation_adjustment_cva'));
  assert.ok(d27.parts[4].code?.includes('model_active_credit_portfolio_srt'));

  // Day 28: Banking AI & Autonomous Algorithmic Underwriting Systems (TASK-798)
  const d28 = getLongLesson('bcom_ban', 28)!;
  assert.ok(d28.parts[0].code?.includes('model_ml_algorithmic_underwriting_comparison'));
  assert.ok(d28.parts[1].code?.includes('model_alternative_data_credit_scoring'));
  assert.ok(d28.parts[2].code?.includes('model_shap_explainable_ai_adverse_action'));
  assert.ok(d28.parts[3].code?.includes('model_algorithmic_fair_lending_audit'));
  assert.ok(d28.parts[4].code?.includes('model_gnn_transaction_graph_fraud_surveillance'));

  // Day 29: Crisis Management, Resolution Regimes & Living Wills (TASK-799)
  const d29 = getLongLesson('bcom_ban', 29)!;
  assert.ok(d29.parts[0].code?.includes('model_liquidity_run_and_central_bank_lolr'));
  assert.ok(d29.parts[1].code?.includes('model_spoe_living_will_resolution'));
  assert.ok(d29.parts[2].code?.includes('model_tlac_bail_in_waterfall'));
  assert.ok(d29.parts[3].code?.includes('model_fdic_purchase_and_assumption_resolution'));
  assert.ok(d29.parts[4].code?.includes('model_cross_border_resolution_coordination'));

  // Day 30: ⭐ Milestone 6 Grand Final Capstone: Autonomous Global Banking Master Operating System (TASK-800)
  const d30 = getLongLesson('bcom_ban', 30)!;
  assert.ok(d30.parts[0].code?.includes('verify_tier1_commercial_wholesale_command'));
  assert.ok(d30.parts[1].code?.includes('verify_tier2_investment_banking_command'));
  assert.ok(d30.parts[2].code?.includes('verify_tier3_enterprise_risk_command'));
  assert.ok(d30.parts[3].code?.includes('verify_tier4_fintech_esg_digital_rails'));
  assert.ok(d30.parts[4].code?.includes('model_grand_master_milestone6_final_certification'));
});

test('COURSE 26 GRAND MASTER COMPLETION: bcom_ban Days 1–30 Full Curriculum Invariant', () => {
  assert.equal(BCOM_BAN_LONG_LESSONS.length, 30, 'Course 26 (bcom_ban) must contain exactly 30 days');
  for (let day = 1; day <= 30; day++) {
    const lesson = getLongLesson('bcom_ban', day);
    assert.ok(lesson, `bcom_ban Day ${day} must be registered and retrievable`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have 5 parts`);
  }
});

test('Block 212 (TASK-1096..1100): bcom_law Days 6–10 resolve with strict 5-part LongLesson invariants and >= 20.0 spoken minutes', () => {
  for (let day = 6; day <= 10; day++) {
    const lesson = getLongLesson('bcom_law', day);
    assert.ok(lesson, `bcom_law Day ${day} must resolve`);
    assert.equal(lesson.coursePrefix, 'bcom_law');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.equal(getLongLessonLanguage('bcom_law'), 'python');

    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20.0, `Day ${day} spoken minutes (${spoken}) must be >= 20.0 min`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 35.0, `Day ${day} total minutes (${total}) must be >= 35.0 min`);

    let dayTotalWords = 0;
    lesson.parts.forEach((part, idx) => {
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(Array.isArray(part.say) && part.say.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 say paragraphs`);

      const partWordCount = (part.say as string[]).reduce((sum, p) => sum + p.split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWordCount >= 580, `Day ${day} Part ${idx + 1} word count (${partWordCount}) must be >= 580 words`);
      dayTotalWords += partWordCount;

      assert.ok(part.example, `Day ${day} Part ${idx + 1} must include a real-world example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must include executable Python code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must include expected console output`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must include a tryIt experiment`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 codeNotes`);

      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question text`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < 4, `Day ${day} Part ${idx + 1} answer must be in [0..3]`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });

    assert.ok(dayTotalWords >= 2950, `Day ${day} total words (${dayTotalWords}) must be >= 2950 words`);
    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${day} summary must have >= 4 bullet points`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 3, `Day ${day} projectStep must have title and >= 3 steps`);
  }
});

test('Block 212 (TASK-1096..1100): bcom_law Days 6–10 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & ledger-sheet template', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');
  const { getTappableLabelsForVisual } = await import('../src/lib/visuals/visualRules');

  clearDayFileCache();

  for (let day = 6; day <= 10; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_law/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_law', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_law Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_law');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_law Day ${day}`);

    const lesson = getLongLesson('bcom_law', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_law Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom_law Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_law', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_law Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'ledger-sheet', `Expected template "ledger-sheet" for bcom_law`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_law Day ${day} Part ${partIdx}`);

      assert.deepEqual(
        visual.steps.map((s: any) => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      visual.steps.forEach((step: any, stepIdx: number) => {
        assert.equal(step.isBalanced, true, `Step ${stepIdx} in Day ${day} Part ${partIdx} must be balanced`);
        assert.equal(step.totalDebit, step.totalCredit, `Step ${stepIdx} debits must equal credits`);
      });

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for bcom_law Day ${day} Part ${partIdx}`);
    }
  }
});

test('Block 212 (TASK-1096..1100): Domain specifics & deterministic Python code verification across Days 6–10', () => {
  // Day 6: Patent Law & Patentability Invariants (TASK-1096)
  const d6 = getLongLesson('bcom_law', 6)!;
  assert.ok(d6.parts[0].code?.includes('evaluate_alice_mayo_patentability'));
  assert.ok(d6.parts[1].code?.includes('evaluate_section_102_novelty'));
  assert.ok(d6.parts[2].code?.includes('evaluate_section_103_patentability'));
  assert.ok(d6.parts[3].code?.includes('audit_commercial_product_fto'));
  assert.ok(d6.parts[4].code?.includes('calculate_litigation_damages_exposure'));

  // Day 7: Trademark Law, Trade Dress & Global Brand Protection (TASK-1097)
  const d7 = getLongLesson('bcom_law', 7)!;
  assert.ok(d7.parts[0].code?.includes('evaluate_mark'));
  assert.ok(d7.parts[1].code?.includes('calculate_confusion_risk'));
  assert.ok(d7.parts[2].code?.includes('evaluate_dilution_exposure'));
  assert.ok(d7.parts[3].code?.includes('structure_madrid_filing'));
  assert.ok(d7.parts[4].code?.includes('evaluate_trade_dress_protectability'));

  // Day 8: Trade Secret Governance & Defend Trade Secrets Act (DTSA) (TASK-1098)
  const d8 = getLongLesson('bcom_law', 8)!;
  assert.ok(d8.parts[0].code?.includes('audit_trade_secret_status'));
  assert.ok(d8.parts[1].code?.includes('evaluate_liability_and_whistleblower_shield'));
  assert.ok(d8.parts[2].code?.includes('evaluate_covenant_and_mobility'));
  assert.ok(d8.parts[3].code?.includes('evaluate_ex_parte_seizure_qualifiers'));
  assert.ok(d8.parts[4].code?.includes('audit_criminal_trade_secret_exposure'));

  // Day 9: Copyright Law, Software Licensing & Digital Millennium Copyright Act (DMCA) (TASK-1099)
  const d9 = getLongLesson('bcom_law', 9)!;
  assert.ok(d9.parts[0].code?.includes('execute_afc_test'));
  assert.ok(d9.parts[1].code?.includes('audit_software_ip_ownership'));
  assert.ok(d9.parts[2].code?.includes('audit_platform_safe_harbor_eligibility'));
  assert.ok(d9.parts[3].code?.includes('audit_oss_linkage'));
  assert.ok(d9.parts[4].code?.includes('calculate_infringement_damages'));

  // Day 10: ⭐ Milestone 2 Capstone: Intellectual Property & Technology Licensing Architecture (TASK-1100)
  const d10 = getLongLesson('bcom_law', 10)!;
  assert.ok(d10.parts[0].code?.includes('calculate_frand_apportioned_royalty'));
  assert.ok(d10.parts[1].code?.includes('evaluate_ipr_defense_strategy'));
  assert.ok(d10.parts[2].code?.includes('calculate_relief_from_royalty_fair_value'));
  assert.ok(d10.parts[3].code?.includes('audit_reverse_payment_settlement'));
  assert.ok(d10.parts[4].code?.includes('execute_milestone2_capstone_defense'));
});

test('Block 213 (TASK-1101..1105): bcom_law Days 11–15 resolve with strict 5-part LongLesson invariants and >= 20.0 spoken minutes', () => {
  for (let day = 11; day <= 15; day++) {
    const lesson = getLongLesson('bcom_law', day);
    assert.ok(lesson, `bcom_law Day ${day} must resolve`);
    assert.equal(lesson.coursePrefix, 'bcom_law');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.equal(getLongLessonLanguage('bcom_law'), 'python');

    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20.0, `Day ${day} spoken minutes (${spoken}) must be >= 20.0 min`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 35.0, `Day ${day} total minutes (${total}) must be >= 35.0 min`);

    let dayTotalWords = 0;
    lesson.parts.forEach((part, idx) => {
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(Array.isArray(part.say) && part.say.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 say paragraphs`);

      const partWordCount = (part.say as string[]).reduce((sum, p) => sum + p.split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWordCount >= 580, `Day ${day} Part ${idx + 1} word count (${partWordCount}) must be >= 580 words`);
      dayTotalWords += partWordCount;

      assert.ok(part.example, `Day ${day} Part ${idx + 1} must include a real-world example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must include executable Python code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must include expected console output`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must include a tryIt experiment`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 codeNotes`);

      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question text`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < 4, `Day ${day} Part ${idx + 1} answer must be in [0..3]`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });

    assert.ok(dayTotalWords >= 2950, `Day ${day} total words (${dayTotalWords}) must be >= 2950 words`);
    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${day} summary must have >= 4 bullet points`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 3, `Day ${day} projectStep must have title and >= 3 steps`);
  }
});

test('Block 213 (TASK-1101..1105): bcom_law Days 11–15 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & ledger-sheet template', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');
  const { getTappableLabelsForVisual } = await import('../src/lib/visuals/visualRules');

  clearDayFileCache();

  for (let day = 11; day <= 15; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_law/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_law', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_law Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_law');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_law Day ${day}`);

    const lesson = getLongLesson('bcom_law', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_law Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom_law Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_law', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_law Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'ledger-sheet', `Expected template "ledger-sheet" for bcom_law`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_law Day ${day} Part ${partIdx}`);

      assert.deepEqual(
        visual.steps.map((s: any) => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      visual.steps.forEach((step: any, stepIdx: number) => {
        assert.equal(step.isBalanced, true, `Step ${stepIdx} in Day ${day} Part ${partIdx} must be balanced`);
        assert.equal(step.totalDebit, step.totalCredit, `Step ${stepIdx} debits must equal credits`);
      });

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for bcom_law Day ${day} Part ${partIdx}`);
    }
  }
});

test('Block 213 (TASK-1101..1105): Domain specifics & deterministic Python code verification across Days 11–15', () => {
  // Day 11: Securities Act of 1933: The Howey Test & Section 5 Gun-Jumping Invariants (TASK-1101)
  const d11 = getLongLesson('bcom_law', 11)!;
  assert.ok(d11.parts[0].code?.includes('evaluate_howey_test'));
  assert.ok(d11.parts[1].code?.includes('evaluate_section_5_compliance'));
  assert.ok(d11.parts[2].code?.includes('evaluate_gun_jumping_safe_harbor'));
  assert.ok(d11.parts[3].code?.includes('classify_securities_exemption'));
  assert.ok(d11.parts[4].code?.includes('calculate_section_11_damages_exposure'));

  // Day 12: Private Placements, Regulation D (Rule 506) & Accredited Investor Invariants (TASK-1102)
  const d12 = getLongLesson('bcom_law', 12)!;
  assert.ok(d12.parts[0].code?.includes('evaluate_ralston_purina_exemption'));
  assert.ok(d12.parts[1].code?.includes('evaluate_reg_d_offering_compliance'));
  assert.ok(d12.parts[2].code?.includes('audit_accredited_investor_status'));
  assert.ok(d12.parts[3].code?.includes('evaluate_rule_144_resale'));
  assert.ok(d12.parts[4].code?.includes('evaluate_reg_s_compliance'));

  // Day 13: Public Offerings & Underwriting Law: S-1 Registration, Syndicates & Green Shoe Options (TASK-1103)
  const d13 = getLongLesson('bcom_law', 13)!;
  assert.ok(d13.parts[0].code?.includes('audit_s1_registration_statement'));
  assert.ok(d13.parts[1].code?.includes('model_underwriting_structure'));
  assert.ok(d13.parts[2].code?.includes('audit_underwriting_agreement_closing'));
  assert.ok(d13.parts[3].code?.includes('execute_green_shoe_stabilization'));
  assert.ok(d13.parts[4].code?.includes('audit_underwriter_due_diligence_program'));

  // Day 14: Securities Litigation Defense: PSLRA Safe Harbor, Basic v. Levinson & Loss Causation (TASK-1104)
  const d14 = getLongLesson('bcom_law', 14)!;
  assert.ok(d14.parts[0].code?.includes('evaluate_10b5_complaint_viability'));
  assert.ok(d14.parts[1].code?.includes('evaluate_class_certification_price_impact'));
  assert.ok(d14.parts[2].code?.includes('evaluate_tellabs_scienter_pleading'));
  assert.ok(d14.parts[3].code?.includes('evaluate_pslra_safe_harbor'));
  assert.ok(d14.parts[4].code?.includes('evaluate_loss_causation_econometrics'));

  // Day 15: ⭐ Milestone 3 Capstone: Capital Markets Syndicate & Securities Enforcement Control Tower (TASK-1105)
  const d15 = getLongLesson('bcom_law', 15)!;
  assert.ok(d15.parts[0].code?.includes('audit_tier1_capital_formation'));
  assert.ok(d15.parts[1].code?.includes('execute_tier2_ipo_syndicate_command'));
  assert.ok(d15.parts[2].code?.includes('audit_tier3_barchris_due_diligence_clearance'));
  assert.ok(d15.parts[3].code?.includes('execute_tier4_securities_defense_command'));
  assert.ok(d15.parts[4].code?.includes('execute_milestone3_master_boardroom_certification'));
});

test('Block 214 (TASK-1106..1110): bcom_law Days 16–20 resolve with strict 5-part LongLesson invariants and >= 20.0 spoken minutes', () => {
  for (let day = 16; day <= 20; day++) {
    const lesson = getLongLesson('bcom_law', day);
    assert.ok(lesson, `bcom_law Day ${day} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom_law');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.equal(getLongLessonLanguage('bcom_law'), 'python');

    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20.0, `Day ${day} spoken minutes (${spoken}) must be >= 20.0 min`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 35.0, `Day ${day} total minutes (${total}) must be >= 35.0 min`);

    let dayTotalWords = 0;
    lesson.parts.forEach((part, idx) => {
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(Array.isArray(part.say) && part.say.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 say paragraphs`);

      const partWordCount = (part.say as string[]).reduce((sum, p) => sum + p.split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWordCount >= 580, `Day ${day} Part ${idx + 1} word count (${partWordCount}) must be >= 580 words`);
      dayTotalWords += partWordCount;

      assert.ok(part.example, `Day ${day} Part ${idx + 1} must include a real-world example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must include executable Python code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must include expected console output`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must include a tryIt experiment`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 codeNotes`);

      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question text`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < 4, `Day ${day} Part ${idx + 1} answer must be in [0..3]`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });

    assert.ok(dayTotalWords >= 2950, `Day ${day} total words (${dayTotalWords}) must be >= 2950 words`);
    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${day} summary must have >= 4 bullet points`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 3, `Day ${day} projectStep must have title and >= 3 steps`);
  }
});

test('Block 214 (TASK-1106..1110): bcom_law Days 16–20 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & ledger-sheet template', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');
  const { getTappableLabelsForVisual } = await import('../src/lib/visuals/visualRules');

  clearDayFileCache();

  for (let day = 16; day <= 20; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_law/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_law', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_law Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_law');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_law Day ${day}`);

    const lesson = getLongLesson('bcom_law', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_law Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom_law Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_law', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_law Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'ledger-sheet', `Expected template "ledger-sheet" for bcom_law`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_law Day ${day} Part ${partIdx}`);

      assert.deepEqual(
        visual.steps.map((s: any) => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      visual.steps.forEach((step: any, stepIdx: number) => {
        assert.equal(step.isBalanced, true, `Step ${stepIdx} in Day ${day} Part ${partIdx} must be balanced`);
        assert.equal(step.totalDebit, step.totalCredit, `Step ${stepIdx} debits must equal credits`);
      });

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for bcom_law Day ${day} Part ${partIdx}`);
    }
  }
});

test('Block 214 (TASK-1106..1110): Domain specifics & deterministic Python code verification across Days 16–20', () => {
  // Day 16: Board Governance: Duty of Care, Duty of Loyalty & In re Caremark Oversight (TASK-1106)
  const d16 = getLongLesson('bcom_law', 16)!;
  assert.ok(d16.parts[0].code?.includes('evaluate_director_fiduciary_conduct'));
  assert.ok(d16.parts[1].code?.includes('evaluate_business_judgment_rule_presumption'));
  assert.ok(d16.parts[2].code?.includes('evaluate_section_102b7_exculpation_shield'));
  assert.ok(d16.parts[3].code?.includes('evaluate_caremark_board_oversight_liability'));
  assert.ok(d16.parts[4].code?.includes('calculate_executive_indemnification_and_insurance_payout'));

  // Day 17: Corporate Opportunities Doctrine, Interested Director Transactions & DGCL § 144 Safe Harbors (TASK-1107)
  const d17 = getLongLesson('bcom_law', 17)!;
  assert.ok(d17.parts[0].code?.includes('evaluate_corporate_opportunity_appropriation'));
  assert.ok(d17.parts[1].code?.includes('evaluate_interested_director_transaction'));
  assert.ok(d17.parts[2].code?.includes('evaluate_dgcl_144_safe_harbor_cleansing'));
  assert.ok(d17.parts[3].code?.includes('simulate_special_committee_deliberation'));
  assert.ok(d17.parts[4].code?.includes('calculate_fiduciary_breach_remedies'));

  // Day 18: Shareholder Derivative Litigation: Demand Futility (Aronson / Zuckerberg) & Special Litigation Committees (TASK-1108)
  const d18 = getLongLesson('bcom_law', 18)!;
  assert.ok(d18.parts[0].code?.includes('evaluate_direct_vs_derivative_claim'));
  assert.ok(d18.parts[1].code?.includes('evaluate_pre_suit_demand_posture'));
  assert.ok(d18.parts[2].code?.includes('evaluate_zuckerberg_demand_futility'));
  assert.ok(d18.parts[3].code?.includes('evaluate_zapata_slc_dismissal'));
  assert.ok(d18.parts[4].code?.includes('calculate_sugarland_derivative_attorney_fees'));

  // Day 19: Shareholder Voting, Proxy Contests & Schedule 14A: Activism & Universal Proxies (TASK-1109)
  const d19 = getLongLesson('bcom_law', 19)!;
  assert.ok(d19.parts[0].code?.includes('evaluate_statutory_shareholder_vote_threshold'));
  assert.ok(d19.parts[1].code?.includes('audit_schedule_14a_proxy_statement'));
  assert.ok(d19.parts[2].code?.includes('evaluate_rule_14a8_proposal_exclusion'));
  assert.ok(d19.parts[3].code?.includes('model_universal_proxy_contest_election'));
  assert.ok(d19.parts[4].code?.includes('evaluate_blasius_board_franchise_interference'));

  // Day 20: ⭐ Milestone 4 Capstone: Enterprise Corporate Governance, Fiduciary Risk & Shareholder Democracy Control Tower (TASK-1110)
  const d20 = getLongLesson('bcom_law', 20)!;
  assert.ok(d20.parts[0].code?.includes('audit_tier1_board_fiduciary_governance'));
  assert.ok(d20.parts[1].code?.includes('audit_tier2_conflict_cleansing_and_safe_harbors'));
  assert.ok(d20.parts[2].code?.includes('audit_tier3_derivative_litigation_defense'));
  assert.ok(d20.parts[3].code?.includes('audit_tier4_shareholder_democracy_and_proxy_command'));
  assert.ok(d20.parts[4].code?.includes('execute_milestone4_master_boardroom_certification'));
});

test('Block 215 (TASK-1111..1115): bcom_law Days 21–25 resolve with strict 5-part LongLesson invariants and >= 20.0 spoken minutes', () => {
  for (let day = 21; day <= 25; day++) {
    const lesson = getLongLesson('bcom_law', day);
    assert.ok(lesson, `bcom_law Day ${day} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom_law');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.equal(getLongLessonLanguage('bcom_law'), 'python');

    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20.0, `Day ${day} spoken minutes (${spoken}) must be >= 20.0 min`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 35.0, `Day ${day} total minutes (${total}) must be >= 35.0 min`);

    let dayTotalWords = 0;
    lesson.parts.forEach((part, idx) => {
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(Array.isArray(part.say) && part.say.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 say paragraphs`);

      const partWordCount = (part.say as string[]).reduce((sum, p) => sum + p.split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWordCount >= 580, `Day ${day} Part ${idx + 1} word count (${partWordCount}) must be >= 580 words`);
      dayTotalWords += partWordCount;

      assert.ok(part.example, `Day ${day} Part ${idx + 1} must include a real-world example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must include executable Python code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must include expected console output`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must include a tryIt experiment`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 codeNotes`);

      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question text`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < 4, `Day ${day} Part ${idx + 1} answer must be in [0..3]`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });

    assert.ok(dayTotalWords >= 2950, `Day ${day} total words (${dayTotalWords}) must be >= 2950 words`);
    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${day} summary must have >= 4 bullet points`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 3, `Day ${day} projectStep must have title and >= 3 steps`);
  }
});

test('Block 215 (TASK-1111..1115): bcom_law Days 21–25 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & ledger-sheet template', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');
  const { getTappableLabelsForVisual } = await import('../src/lib/visuals/visualRules');

  clearDayFileCache();

  for (let day = 21; day <= 25; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_law/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_law', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_law Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_law');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_law Day ${day}`);

    const lesson = getLongLesson('bcom_law', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_law Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom_law Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_law', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_law Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'ledger-sheet', `Expected template "ledger-sheet" for bcom_law`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_law Day ${day} Part ${partIdx}`);

      assert.deepEqual(
        visual.steps.map((s: any) => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      visual.steps.forEach((step: any, stepIdx: number) => {
        assert.equal(step.isBalanced, true, `Step ${stepIdx} in Day ${day} Part ${partIdx} must be balanced`);
        assert.equal(step.totalDebit, step.totalCredit, `Step ${stepIdx} debits must equal credits`);
      });

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for bcom_law Day ${day} Part ${partIdx}`);
    }
  }
});

test('Block 215 (TASK-1111..1115): Domain specifics & deterministic Python code verification across Days 21–25', () => {
  // Day 21: Delaware Takeover Defense: The Unocal Proportionality Standard & Poison Pills (TASK-1111)
  const d21 = getLongLesson('bcom_law', 21)!;
  assert.ok(d21.parts[0].code?.includes('evaluate_takeover_threat_and_bid_structure'));
  assert.ok(d21.parts[1].code?.includes('evaluate_unocal_proportionality_defense'));
  assert.ok(d21.parts[2].code?.includes('simulate_poison_pill_flip_in_dilution'));
  assert.ok(d21.parts[3].code?.includes('model_airgas_staggered_board_pill_defense'));
  assert.ok(d21.parts[4].code?.includes('audit_advance_notice_bylaw_enforceability'));

  // Day 22: M&A Deal Protections: Breakup Fees, No-Shops, Match Rights & Revlon Duties (TASK-1112)
  const d22 = getLongLesson('bcom_law', 22)!;
  assert.ok(d22.parts[0].code?.includes('evaluate_revlon_trigger_and_auction_mandate'));
  assert.ok(d22.parts[1].code?.includes('audit_deal_protection_covenants'));
  assert.ok(d22.parts[2].code?.includes('calculate_breakup_fee_reasonableness'));
  assert.ok(d22.parts[3].code?.includes('model_match_right_and_force_the_vote_dynamics'));
  assert.ok(d22.parts[4].code?.includes('evaluate_corwin_post_closing_cleansing'));

  // Day 23: Controlling Shareholder Buyouts & Freeze-Out Mergers: MFW Framework & Entire Fairness (TASK-1113)
  const d23 = getLongLesson('bcom_law', 23)!;
  assert.ok(d23.parts[0].code?.includes('evaluate_controlling_shareholder_status_and_scrutiny'));
  assert.ok(d23.parts[1].code?.includes('compare_historical_freeze_out_pathways'));
  assert.ok(d23.parts[2].code?.includes('evaluate_mfw_dual_cleansing_compliance'));
  assert.ok(d23.parts[3].code?.includes('evaluate_match_group_conflicted_controller_transaction'));
  assert.ok(d23.parts[4].code?.includes('calculate_dgcl_262_appraisal_fair_value'));

  // Day 24: Regulatory Merger Clearance: Hart-Scott-Rodino (HSR) Antitrust & CFIUS National Security (TASK-1114)
  const d24 = getLongLesson('bcom_law', 24)!;
  assert.ok(d24.parts[0].code?.includes('evaluate_hsr_premerger_filing_thresholds'));
  assert.ok(d24.parts[1].code?.includes('simulate_hsr_review_timeline_and_gun_jumping'));
  assert.ok(d24.parts[2].code?.includes('evaluate_clayton_section7_antitrust_concentration'));
  assert.ok(d24.parts[3].code?.includes('audit_cfius_national_security_clearance'));
  assert.ok(d24.parts[4].code?.includes('model_contractual_regulatory_risk_allocation'));

  // Day 25: ⭐ Milestone 5 Capstone: Sovereign M&A Transaction, Antitrust Clearance & Takeover Defense Control Tower (TASK-1115)
  const d25 = getLongLesson('bcom_law', 25)!;
  assert.ok(d25.parts[0].code?.includes('audit_tier1_hostile_takeover_defense'));
  assert.ok(d25.parts[1].code?.includes('audit_tier2_negotiated_deal_protections_and_revlon'));
  assert.ok(d25.parts[2].code?.includes('audit_tier3_controlling_shareholder_mfw_cleansing'));
  assert.ok(d25.parts[3].code?.includes('audit_tier4_regulatory_antitrust_and_cfius_clearance'));
  assert.ok(d25.parts[4].code?.includes('execute_milestone5_master_transactional_certification'));
});
