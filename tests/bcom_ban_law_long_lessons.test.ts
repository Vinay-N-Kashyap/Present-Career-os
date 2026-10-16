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










