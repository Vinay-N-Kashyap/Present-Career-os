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



