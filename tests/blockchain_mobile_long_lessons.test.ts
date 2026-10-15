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

test('Blockchain Day 3: ERC Standards, Flash Loans, Gas Packing & Chainlink Oracles Verification', () => {
  const blockchainLesson3 = getLongLesson('blockchain', 3);
  assert.ok(blockchainLesson3, 'blockchain Day 3 must resolve');
  assert.equal(blockchainLesson3.day, 3);
  assert.equal(blockchainLesson3.parts.length, 5, 'blockchain Day 3 must contain exactly 5 parts');
  assert.ok(blockchainLesson3.summary.length >= 4, 'blockchain Day 3 must have comprehensive summary');
  assert.ok(blockchainLesson3.projectStep, 'blockchain Day 3 must have projectStep');
  assert.ok(blockchainLesson3.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  for (let i = 0; i < blockchainLesson3.parts.length; i++) {
    const part = blockchainLesson3.parts[i];
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
  assert.ok(blockchainLesson3.parts[0].code?.includes('Erc20TokenSimulator'));
  assert.ok(blockchainLesson3.parts[0].output?.includes('ERC-20 ALLOWANCE SAFETY & RACE CONDITION DEFENSE'));
  assert.ok(blockchainLesson3.parts[1].code?.includes('SecureBankWithGuard'));
  assert.ok(blockchainLesson3.parts[1].output?.includes('FLASH LOANS, REENTRANCY ATTACKS & REENTRANCYGUARD'));
  assert.ok(blockchainLesson3.parts[2].code?.includes('EvmStoragePacker'));
  assert.ok(blockchainLesson3.parts[2].output?.includes('EVM STORAGE PACKING & GAS OPTIMIZATION'));
  assert.ok(blockchainLesson3.parts[3].code?.includes('verifyMerkleProof'));
  assert.ok(blockchainLesson3.parts[3].output?.includes('MERKLE PROOF AIRDROP VERIFICATION'));
  assert.ok(blockchainLesson3.parts[4].code?.includes('OracleConsumerSimulator'));
  assert.ok(blockchainLesson3.parts[4].output?.includes('CHAINLINK ORACLE STALE PRICE PROTECTION'));
});

test('Mobile Day 4: Gesture Worklets, Fabric Shadow Nodes, C++ JSI & Live Activities Verification', () => {
  const mobileLesson4 = getLongLesson('mobile', 4);
  assert.ok(mobileLesson4, 'mobile Day 4 must resolve');
  assert.equal(mobileLesson4.day, 4);
  assert.equal(mobileLesson4.parts.length, 5, 'mobile Day 4 must contain exactly 5 parts');
  assert.ok(mobileLesson4.summary.length >= 4, 'mobile Day 4 must have comprehensive summary');
  assert.ok(mobileLesson4.projectStep, 'mobile Day 4 must have projectStep');
  assert.ok(mobileLesson4.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  for (let i = 0; i < mobileLesson4.parts.length; i++) {
    const part = mobileLesson4.parts[i];
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
  assert.ok(mobileLesson4.parts[0].code?.includes('WorkletSpringDriver'));
  assert.ok(mobileLesson4.parts[0].output?.includes('REANIMATED 3 UI THREAD WORKLET SIMULATOR'));
  assert.ok(mobileLesson4.parts[1].code?.includes('FabricShadowTree'));
  assert.ok(mobileLesson4.parts[1].output?.includes('FABRIC C++ SHADOW TREE MUTATION PIPELINE'));
  assert.ok(mobileLesson4.parts[2].code?.includes('CxxTurboModuleHostObject'));
  assert.ok(mobileLesson4.parts[2].output?.includes('CROSS-PLATFORM C++ TURBOMODULE (JSI)'));
  assert.ok(mobileLesson4.parts[3].code?.includes('HermesHeapProfiler'));
  assert.ok(mobileLesson4.parts[3].output?.includes('HERMES HEAP PROFILER & MEMORY LEAK AUDIT'));
  assert.ok(mobileLesson4.parts[4].code?.includes('ActivityKitManager'));
  assert.ok(mobileLesson4.parts[4].output?.includes('NATIVE EXTENSIONS: IOS LIVE ACTIVITIES & WORKMANAGER'));
});

test('Blockchain Day 4: Read-Only Reentrancy, Foundry Invariants, SMT & Governance Verification', () => {
  const blockchainLesson4 = getLongLesson('blockchain', 4);
  assert.ok(blockchainLesson4, 'blockchain Day 4 must resolve');
  assert.equal(blockchainLesson4.day, 4);
  assert.equal(blockchainLesson4.parts.length, 5, 'blockchain Day 4 must contain exactly 5 parts');
  assert.ok(blockchainLesson4.summary.length >= 4, 'blockchain Day 4 must have comprehensive summary');
  assert.ok(blockchainLesson4.projectStep, 'blockchain Day 4 must have projectStep');
  assert.ok(blockchainLesson4.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  for (let i = 0; i < blockchainLesson4.parts.length; i++) {
    const part = blockchainLesson4.parts[i];
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
  assert.ok(blockchainLesson4.parts[0].code?.includes('VulnerablePool'));
  assert.ok(blockchainLesson4.parts[0].output?.includes('READ-ONLY REENTRANCY & TRANSIENT LOCK PROTECTION'));
  assert.ok(blockchainLesson4.parts[1].code?.includes('InvariantVault'));
  assert.ok(blockchainLesson4.parts[1].output?.includes('FOUNDRY STATEFUL INVARIANT FUZZ TESTING'));
  assert.ok(blockchainLesson4.parts[2].code?.includes('SmtFormalVerifier'));
  assert.ok(blockchainLesson4.parts[2].output?.includes('FORMAL VERIFICATION & SMTCHECKER SOLVER'));
  assert.ok(blockchainLesson4.parts[3].code?.includes('MultiSigSafe'));
  assert.ok(blockchainLesson4.parts[3].output?.includes('GNOSIS MULTISIG SAFE THRESHOLD SIGNATURE PIPELINE'));
  assert.ok(blockchainLesson4.parts[4].code?.includes('TimelockController'));
  assert.ok(blockchainLesson4.parts[4].output?.includes('TIMELOCK CONTROLLER & GOVERNANCE SAFETY PIPELINE'));
});

test('Blockchain Day 5: Zero-Knowledge Groth16, ERC-4337, Rollups, GMP & MEV-Boost Verification', () => {
  const blockchainLesson5 = getLongLesson('blockchain', 5);
  assert.ok(blockchainLesson5, 'blockchain Day 5 must resolve');
  assert.equal(blockchainLesson5.day, 5);
  assert.equal(blockchainLesson5.parts.length, 5, 'blockchain Day 5 must contain exactly 5 parts');
  assert.ok(blockchainLesson5.summary.length >= 4, 'blockchain Day 5 must have comprehensive summary');
  assert.ok(blockchainLesson5.projectStep, 'blockchain Day 5 must have projectStep');
  assert.ok(blockchainLesson5.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(blockchainLesson5);
  const totalMin = estimateLessonMinutes(blockchainLesson5);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < blockchainLesson5.parts.length; i++) {
    const part = blockchainLesson5.parts[i];
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
  // Part 1: Groth16
  assert.ok(blockchainLesson5.parts[0].code?.includes('Groth16VerifierSimulator'));
  assert.ok(blockchainLesson5.parts[0].output?.includes('ZK_PROOF_VERIFIED_VALID'));
  assert.ok(blockchainLesson5.parts[0].output?.includes('alt_bn128 (BN254)'));
  assert.ok(blockchainLesson5.parts[0].output?.includes('198400 gas'));

  // Part 2: ERC-4337
  assert.ok(blockchainLesson5.parts[1].code?.includes('EntryPointSimulator'));
  assert.ok(blockchainLesson5.parts[1].output?.includes('ERC4337_USEROPS_EXECUTED_SUCCESSFULLY'));
  assert.ok(blockchainLesson5.parts[1].output?.includes('GAS_SPONSORED_BY_PAYMASTER'));

  // Part 3: Rollup Interactive Bisection
  assert.ok(blockchainLesson5.parts[2].code?.includes('RollupVerificationSimulator'));
  assert.ok(blockchainLesson5.parts[2].output?.includes('Interactive Bisection Rounds: 20 Rounds'));
  assert.ok(blockchainLesson5.parts[2].output?.includes('FRAUD_PROVEN_STATE_REVERTED_CHALLENGER_REWARDED'));
  assert.ok(blockchainLesson5.parts[2].output?.includes('OneStepProver'));

  // Part 4: Cross-Chain GMP
  assert.ok(blockchainLesson5.parts[3].code?.includes('CrossChainRouterSimulator'));
  assert.ok(blockchainLesson5.parts[3].output?.includes('SUCCESS_CROSS_CHAIN_PAYLOAD_DISPATCHED'));
  assert.ok(blockchainLesson5.parts[3].output?.includes('ERROR_REPLAY_ATTEMPT_REJECTED'));

  // Part 5: MEV-Boost
  assert.ok(blockchainLesson5.parts[4].code?.includes('MevBoostRelayAuction'));
  assert.ok(blockchainLesson5.parts[4].output?.includes('MEV_BOOST_AUCTION_SETTLED'));
  assert.ok(blockchainLesson5.parts[4].output?.includes('BeaverBuild_Alpha'));
  assert.ok(blockchainLesson5.parts[4].output?.includes('Validator MEV Reward: 0.68 ETH'));
});

test('Mobile Day 5: Cold Start TTID, OTA Compatibility, SQLite WAL & Fastlane CI/CD Verification', () => {
  const mobileLesson5 = getLongLesson('mobile', 5);
  assert.ok(mobileLesson5, 'mobile Day 5 must resolve');
  assert.equal(mobileLesson5.day, 5);
  assert.equal(mobileLesson5.parts.length, 5, 'mobile Day 5 must contain exactly 5 parts');
  assert.ok(mobileLesson5.summary.length >= 4, 'mobile Day 5 must have comprehensive summary');
  assert.ok(mobileLesson5.projectStep, 'mobile Day 5 must have projectStep');
  assert.ok(mobileLesson5.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(mobileLesson5);
  const totalMin = estimateLessonMinutes(mobileLesson5);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < mobileLesson5.parts.length; i++) {
    const part = mobileLesson5.parts[i];
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
  // Part 1: Cold Start Profiler
  assert.ok(mobileLesson5.parts[0].code?.includes('MobileColdStartProfiler'));
  assert.ok(mobileLesson5.parts[0].output?.includes('Time To Initial Display (TTID): 320 ms'));
  assert.ok(mobileLesson5.parts[0].output?.includes('TIER_1_OPTIMAL_COLD_START'));

  // Part 2: OTA Compatibility
  assert.ok(mobileLesson5.parts[1].code?.includes('OtaUpdateSafetyGuard'));
  assert.ok(mobileLesson5.parts[1].output?.includes('OTA_UPDATE_APPROVED_FOR_RELEASE'));
  assert.ok(mobileLesson5.parts[1].output?.includes('COMPATIBLE_BINARY_MATCH'));
  assert.ok(mobileLesson5.parts[1].output?.includes('ACTIVE_ARMED'));

  // Part 3: Offline SQLite WAL & Delta Sync
  assert.ok(mobileLesson5.parts[2].code?.includes('MobileOfflineSyncEngine'));
  assert.ok(mobileLesson5.parts[2].output?.includes('WRITE_AHEAD_LOGGING_ACTIVE'));
  assert.ok(mobileLesson5.parts[2].output?.includes('OFFLINE_DELTAS_MERGED_ATOMICALLY'));

  // Part 4: Mobile Security Armor
  assert.ok(mobileLesson5.parts[3].code?.includes('MobileSecurityAuditor'));
  assert.ok(mobileLesson5.parts[3].output?.includes('ZERO_TRUST_DEVICE_VERIFIED'));
  assert.ok(mobileLesson5.parts[3].output?.includes('ALL_CHECKS_PASSED'));

  // Part 5: Fastlane CI/CD & Phased Releases
  assert.ok(mobileLesson5.parts[4].code?.includes('FastlaneReleasePipeline'));
  assert.ok(mobileLesson5.parts[4].output?.includes('FASTLANE_AUTOMATED_DEPLOYMENT_COMPLETE'));
  assert.ok(mobileLesson5.parts[4].output?.includes('10% Active User Traffic'));
});

test('Mobile Day 6: Redux Toolkit, Zustand, MMKV & SQLite WAL Verification', () => {
  const mobileLesson6 = getLongLesson('mobile', 6);
  assert.ok(mobileLesson6, 'Mobile Day 6 long lesson must resolve');
  assert.equal(mobileLesson6.day, 6);
  assert.equal(mobileLesson6.parts.length, 5, 'Mobile Day 6 must contain exactly 5 parts');
  assert.ok(mobileLesson6.summary.length >= 4, 'Mobile Day 6 must contain summary points');
  assert.ok(mobileLesson6.projectStep, 'Mobile Day 6 must have projectStep');

  const spokenMin = estimateSpokenMinutes(mobileLesson6);
  const totalMin = estimateLessonMinutes(mobileLesson6);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < mobileLesson6.parts.length; i++) {
    const part = mobileLesson6.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);
  }

  // Domain specifics
  assert.ok(mobileLesson6.parts[0].code?.includes('MobileStoreManager'));
  assert.ok(mobileLesson6.parts[1].code?.includes('AtomicMicroStore'));
  assert.ok(mobileLesson6.parts[2].code?.includes('MockMMKVEngine'));
  assert.ok(mobileLesson6.parts[3].code?.includes('SQLiteConcurrencyEngine'));
  assert.ok(mobileLesson6.parts[4].code?.includes('OfflineReconciliationEngine'));
});

test('Mobile Day 7: Reanimated 3, Hermes Worklets & Pan Gestures Verification', () => {
  const mobileLesson7 = getLongLesson('mobile', 7);
  assert.ok(mobileLesson7, 'Mobile Day 7 long lesson must resolve');
  assert.equal(mobileLesson7.day, 7);
  assert.equal(mobileLesson7.parts.length, 5, 'Mobile Day 7 must contain exactly 5 parts');
  assert.ok(mobileLesson7.summary.length >= 4, 'Mobile Day 7 must contain summary points');
  assert.ok(mobileLesson7.projectStep, 'Mobile Day 7 must have projectStep');

  const spokenMin = estimateSpokenMinutes(mobileLesson7);
  const totalMin = estimateLessonMinutes(mobileLesson7);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < mobileLesson7.parts.length; i++) {
    const part = mobileLesson7.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);
  }

  // Domain specifics
  assert.ok(mobileLesson7.parts[0].code?.includes('HermesRuntimeManager'));
  assert.ok(mobileLesson7.parts[1].code?.includes('PanGestureStateMachine'));
  assert.ok(mobileLesson7.parts[2].code?.includes('SpringPhysicsEngine'));
  assert.ok(mobileLesson7.parts[3].code?.includes('InterpolationEngine'));
  assert.ok(mobileLesson7.parts[4].code?.includes('SharedElementTransitionEngine'));
});

test('Mobile Day 8: Native Modules, JSI TurboModules & Hardware Acceleration Verification', () => {
  const mobileLesson8 = getLongLesson('mobile', 8);
  assert.ok(mobileLesson8, 'Mobile Day 8 long lesson must resolve');
  assert.equal(mobileLesson8.day, 8);
  assert.equal(mobileLesson8.parts.length, 5, 'Mobile Day 8 must contain exactly 5 parts');
  assert.ok(mobileLesson8.summary.length >= 4, 'Mobile Day 8 must contain summary points');
  assert.ok(mobileLesson8.projectStep, 'Mobile Day 8 must have projectStep');

  const spokenMin = estimateSpokenMinutes(mobileLesson8);
  const totalMin = estimateLessonMinutes(mobileLesson8);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < mobileLesson8.parts.length; i++) {
    const part = mobileLesson8.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);
  }

  // Domain specifics
  assert.ok(mobileLesson8.parts[0].code?.includes('CppHostObjectSimulator'));
  assert.ok(mobileLesson8.parts[1].code?.includes('CodegenTypeSafetyEngine'));
  assert.ok(mobileLesson8.parts[2].code?.includes('IosTurboModuleSimulator'));
  assert.ok(mobileLesson8.parts[3].code?.includes('AndroidTurboModuleSimulator'));
  assert.ok(mobileLesson8.parts[4].code?.includes('HardwareAccelerationStreamer'));
});

test('Mobile Day 9: Memory Diagnostics, Leak Detection & Battery Pacing Verification', () => {
  const mobileLesson9 = getLongLesson('mobile', 9);
  assert.ok(mobileLesson9, 'Mobile Day 9 long lesson must resolve');
  assert.equal(mobileLesson9.day, 9);
  assert.equal(mobileLesson9.parts.length, 5, 'Mobile Day 9 must contain exactly 5 parts');
  assert.ok(mobileLesson9.summary.length >= 4, 'Mobile Day 9 must contain summary points');
  assert.ok(mobileLesson9.projectStep, 'Mobile Day 9 must have projectStep');

  const spokenMin = estimateSpokenMinutes(mobileLesson9);
  const totalMin = estimateLessonMinutes(mobileLesson9);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < mobileLesson9.parts.length; i++) {
    const part = mobileLesson9.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);
  }

  // Domain specifics
  assert.ok(mobileLesson9.parts[0].code?.includes('MobileMemorySupervisor'));
  assert.ok(mobileLesson9.parts[1].code?.includes('EventBusMemoryManager'));
  assert.ok(mobileLesson9.parts[2].code?.includes('ImageMemoryPipeline'));
  assert.ok(mobileLesson9.parts[3].code?.includes('CellularRadioPowerManager'));
  assert.ok(mobileLesson9.parts[4].code?.includes('MobileProfilerAuditor'));
});

test('Mobile Day 10: Milestone 2 Cryptographic Mobile Wallet Capstone Verification', () => {
  const mobileLesson10 = getLongLesson('mobile', 10);
  assert.ok(mobileLesson10, 'Mobile Day 10 long lesson must resolve');
  assert.equal(mobileLesson10.day, 10);
  assert.equal(mobileLesson10.parts.length, 5, 'Mobile Day 10 must contain exactly 5 parts');
  assert.ok(mobileLesson10.summary.length >= 4, 'Mobile Day 10 must contain summary points');
  assert.ok(mobileLesson10.projectStep, 'Mobile Day 10 must have projectStep');

  const spokenMin = estimateSpokenMinutes(mobileLesson10);
  const totalMin = estimateLessonMinutes(mobileLesson10);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < mobileLesson10.parts.length; i++) {
    const part = mobileLesson10.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);
  }

  // Domain specifics
  assert.ok(mobileLesson10.parts[0].code?.includes('MobileCryptographicVault'));
  assert.ok(mobileLesson10.parts[1].code?.includes('OfflineWalletLedger'));
  assert.ok(mobileLesson10.parts[2].code?.includes('BiometricVaultAnimationEngine'));
  assert.ok(mobileLesson10.parts[3].code?.includes('CppJsiCryptoTurboModule'));
  assert.ok(mobileLesson10.parts[4].code?.includes('MobileSystemsBenchmarkSuite'));
});



