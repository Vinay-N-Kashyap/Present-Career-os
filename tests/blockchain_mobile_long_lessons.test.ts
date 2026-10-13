import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';

test('Blockchain & Mobile Long Lessons: Resolution & Language Invariants', () => {
  // 1. blockchain
  const blockchainLesson = getLongLesson('blockchain', 1);
  assert.ok(blockchainLesson, 'blockchain Day 1 long lesson must resolve');
  assert.equal(blockchainLesson.day, 1);
  assert.equal(blockchainLesson.parts.length, 5, 'blockchain Day 1 must contain exactly 5 parts');
  assert.ok(blockchainLesson.summary.length >= 4, 'blockchain Day 1 must contain comprehensive summary');
  assert.ok(blockchainLesson.projectStep, 'blockchain Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('blockchain'), 'typescript');

  const blockchainLesson2 = getLongLesson('blockchain', 2);
  assert.ok(blockchainLesson2, 'blockchain Day 2 long lesson must resolve');
  assert.equal(blockchainLesson2.day, 2);
  assert.equal(blockchainLesson2.parts.length, 5, 'blockchain Day 2 must contain exactly 5 parts');

  // 2. mobile
  const mobileLesson = getLongLesson('mobile', 1);
  assert.ok(mobileLesson, 'mobile Day 1 long lesson must resolve');
  assert.equal(mobileLesson.day, 1);
  assert.equal(mobileLesson.parts.length, 5, 'mobile Day 1 must contain exactly 5 parts');
  assert.ok(mobileLesson.summary.length >= 4, 'mobile Day 1 must contain comprehensive summary');
  assert.ok(mobileLesson.projectStep, 'mobile Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('mobile'), 'typescript');

  const mobileLesson2 = getLongLesson('mobile', 2);
  assert.ok(mobileLesson2, 'mobile Day 2 long lesson must resolve');
  assert.equal(mobileLesson2.day, 2);
  assert.equal(mobileLesson2.parts.length, 5, 'mobile Day 2 must contain exactly 5 parts');

  // 3. g3d and java-basics language mapping
  assert.equal(getLongLessonLanguage('g3d'), 'typescript');
  assert.equal(getLongLessonLanguage('java-basics'), 'javascript');
});

test('Blockchain Day 1: TypeScript Code Snippets & Socratic Checks Verification', () => {
  const blockchainLesson = getLongLesson('blockchain', 1);
  assert.ok(blockchainLesson);

  for (const part of blockchainLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable TypeScript code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);

    // Verify Socratic MCQ Check
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');

    // Structural code invariants
    assert.ok(part.code.includes('console.log('), `TypeScript code in '${part.title}' must print results`);
  }
});

test('Mobile Day 1: React Native Architecture Code Snippets & Socratic Checks Verification', () => {
  const mobileLesson = getLongLesson('mobile', 1);
  assert.ok(mobileLesson);

  for (const part of mobileLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable TypeScript code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);

    // Verify Socratic MCQ Check
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');

    // Structural code invariants
    assert.ok(part.code.includes('console.log('), `TypeScript code in '${part.title}' must print results`);
  }
});

test('Blockchain Day 2: AMM Constant Product, TWAP, EIP-712 Permit & Rollup Proofs Verification', () => {
  const blockchainLesson2 = getLongLesson('blockchain', 2);
  assert.ok(blockchainLesson2, 'blockchain Day 2 must resolve');
  assert.equal(blockchainLesson2.day, 2);
  assert.equal(blockchainLesson2.parts.length, 5, 'blockchain Day 2 must contain exactly 5 parts');
  assert.ok(blockchainLesson2.summary.length >= 4, 'blockchain Day 2 must have comprehensive summary');
  assert.ok(blockchainLesson2.projectStep, 'blockchain Day 2 must have projectStep');
  assert.ok(blockchainLesson2.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(blockchainLesson2);
  const totalMin = estimateLessonMinutes(blockchainLesson2);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < blockchainLesson2.parts.length; i++) {
    const part = blockchainLesson2.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
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
  assert.ok(blockchainLesson2.parts[0].code?.includes('calculateAmmSwap'));
  assert.ok(blockchainLesson2.parts[0].output?.includes('UNISWAP V2 CONSTANT PRODUCT AMM SWAP ENGINE'));
  assert.ok(blockchainLesson2.parts[1].code?.includes('TwapOracle'));
  assert.ok(blockchainLesson2.parts[1].output?.includes('DECENTRALIZED TWAP ORACLE VS FLASH LOAN SKEW'));
  assert.ok(blockchainLesson2.parts[2].code?.includes('hashEip712Permit'));
  assert.ok(blockchainLesson2.parts[2].output?.includes('EIP-712 TYPED STRUCTURED PERMIT DIGEST'));
  assert.ok(blockchainLesson2.parts[3].code?.includes('processRollupBatch'));
  assert.ok(blockchainLesson2.parts[3].output?.includes('LAYER 2 ROLLUP BATCH STATE COMMITMENT ENGINE'));
  assert.ok(blockchainLesson2.parts[4].code?.includes('UpgradeableProxy'));
  assert.ok(blockchainLesson2.parts[4].output?.includes('ERC-1967 UPGRADEABLE PROXY STORAGE ARCHITECTURE'));
});

test('Mobile Day 2: Fabric Renderer, Reanimated Worklets, WatermelonDB & Biometrics Verification', () => {
  const mobileLesson2 = getLongLesson('mobile', 2);
  assert.ok(mobileLesson2, 'mobile Day 2 must resolve');
  assert.equal(mobileLesson2.day, 2);
  assert.equal(mobileLesson2.parts.length, 5, 'mobile Day 2 must contain exactly 5 parts');
  assert.ok(mobileLesson2.summary.length >= 4, 'mobile Day 2 must have comprehensive summary');
  assert.ok(mobileLesson2.projectStep, 'mobile Day 2 must have projectStep');
  assert.ok(mobileLesson2.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(mobileLesson2);
  const totalMin = estimateLessonMinutes(mobileLesson2);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < mobileLesson2.parts.length; i++) {
    const part = mobileLesson2.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
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
  assert.ok(mobileLesson2.parts[0].code?.includes('TurboModuleRegistry'));
  assert.ok(mobileLesson2.parts[0].output?.includes('REACT NATIVE NEW ARCHITECTURE: TURBOMODULES & JSI'));
  assert.ok(mobileLesson2.parts[1].code?.includes('simulateSpringStep'));
  assert.ok(mobileLesson2.parts[1].output?.includes('REANIMATED WORKLET SPRING PHYSICS'));
  assert.ok(mobileLesson2.parts[2].code?.includes('LazyRecord'));
  assert.ok(mobileLesson2.parts[2].output?.includes('WATERMELONDB LAZY RELATIONAL MOBILE STORAGE'));
  assert.ok(mobileLesson2.parts[3].code?.includes('matchUniversalLink'));
  assert.ok(mobileLesson2.parts[3].output?.includes('UNIVERSAL LINKS & DEEP LINK ROUTING ENGINE'));
  assert.ok(mobileLesson2.parts[4].code?.includes('SecureEnclaveVault'));
  assert.ok(mobileLesson2.parts[4].output?.includes('HARDWARE SECURE ENCLAVE & BIOMETRIC STORAGE'));
});

test('Mobile Day 3: Offline CRDTs, Push Notifications, JSI TurboModules & Enclave Verification', () => {
  const mobileLesson3 = getLongLesson('mobile', 3);
  assert.ok(mobileLesson3, 'mobile Day 3 must resolve');
  assert.equal(mobileLesson3.day, 3);
  assert.equal(mobileLesson3.parts.length, 5, 'mobile Day 3 must contain exactly 5 parts');
  assert.ok(mobileLesson3.summary.length >= 4, 'mobile Day 3 must have comprehensive summary');
  assert.ok(mobileLesson3.projectStep, 'mobile Day 3 must have projectStep');
  assert.ok(mobileLesson3.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  for (let i = 0; i < mobileLesson3.parts.length; i++) {
    const part = mobileLesson3.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 3, `Part ${i + 1} check must have >= 3 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);
  }

  // Domain specifics
  assert.ok(mobileLesson3.parts[0].code?.includes('LwwElementSetSimulator'));
  assert.ok(mobileLesson3.parts[0].output?.includes('CRDT LWW-ELEMENT-SET REPLICATION'));
  assert.ok(mobileLesson3.parts[1].code?.includes('PushNotificationRouter'));
  assert.ok(mobileLesson3.parts[1].output?.includes('PUSH NOTIFICATIONS: APNS & FCM ROUTING'));
  assert.ok(mobileLesson3.parts[2].code?.includes('JsiHostObjectSimulator'));
  assert.ok(mobileLesson3.parts[2].output?.includes('NATIVE C++ JSI TURBOMODULE ZERO-COPY INVOCATION'));
  assert.ok(mobileLesson3.parts[3].code?.includes('DeepLinkRouter'));
  assert.ok(mobileLesson3.parts[3].output?.includes('DEEP LINKING & NAVIGATION STACK STATE RESTORATION'));
  assert.ok(mobileLesson3.parts[4].code?.includes('SecureEnclaveAuthenticator'));
  assert.ok(mobileLesson3.parts[4].output?.includes('SECURE ENCLAVE HARDWARE BIOMETRIC AUTHENTICATION'));
});

