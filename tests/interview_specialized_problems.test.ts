import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveDynamicCodingProblem,
  TestCaseItem
} from '../src/app/interview/problemGenerator';

test('Specialized Archetype: Quant & Low-Latency Limit Order Book Matcher', () => {
  const probPy = resolveDynamicCodingProblem('HFT Order Matching Engine', 'tech', 'python');
  assert.ok(probPy.title.includes('Limit Order Book Matcher'), `Title should match: ${probPy.title}`);
  assert.strictEqual(probPy.functionName, 'match_limit_orders');
  assert.ok(probPy.starterCode.includes('def match_limit_orders'));
  assert.ok(probPy.testCases && probPy.testCases.length === 5, 'Must generate exactly 5 tiers');

  const tiers = probPy.testCases.map(tc => tc.tier);
  assert.deepStrictEqual(tiers, ['standard', 'scale', 'zero_empty', 'edge_case', 'complexity']);

  for (const tc of probPy.testCases) {
    assert.ok(tc.expectedOutput !== undefined && tc.expectedOutput !== '');
    assert.ok(tc.tierLabel.startsWith('T'));
  }

  // Check JavaScript variant
  const probJs = resolveDynamicCodingProblem('Quant Trading Systems', 'tech', 'javascript');
  assert.strictEqual(probJs.functionName, 'matchLimitOrders');
  assert.ok(probJs.starterCode.includes('function matchLimitOrders'));

  // Check C++ variant
  const probCpp = resolveDynamicCodingProblem('Exchange Matching Engine', 'tech', 'cpp');
  assert.ok(probCpp.starterCode.includes('int matchLimitOrders'));
  assert.ok(probCpp.starterCode.includes('#include <vector>'));
});

test('Specialized Archetype: IoT & Embedded Hardware Telemetry Packet Decoder', () => {
  const probPy = resolveDynamicCodingProblem('IoT Sensor Telemetry', 'tech', 'python');
  assert.ok(probPy.title.includes('Hardware Telemetry Packet Decoder'), `Title should match: ${probPy.title}`);
  assert.strictEqual(probPy.functionName, 'decode_sensor_packet');
  assert.ok(probPy.starterCode.includes('def decode_sensor_packet'));
  assert.ok(probPy.testCases && probPy.testCases.length === 5, 'Must generate exactly 5 tiers');

  const tiers = probPy.testCases.map(tc => tc.tier);
  assert.deepStrictEqual(tiers, ['standard', 'scale', 'zero_empty', 'edge_case', 'complexity']);

  // Check JavaScript variant
  const probJs = resolveDynamicCodingProblem('Embedded Firmware MCU', 'tech', 'javascript');
  assert.strictEqual(probJs.functionName, 'decodeSensorPacket');
  assert.ok(probJs.starterCode.includes('function decodeSensorPacket'));

  // Check C++ variant
  const probCpp = resolveDynamicCodingProblem('Bare-Metal Hardware Controller', 'tech', 'cpp');
  assert.ok(probCpp.starterCode.includes('int decodeSensorPacket'));
  assert.ok(probCpp.starterCode.includes('uint8_t'));
});

test('Specialized Archetype: Cybersecurity & Zero-Trust Merkle Audit Proof Validator', () => {
  const probPy = resolveDynamicCodingProblem('Zero Trust Cryptographic Chain', 'tech', 'python');
  assert.ok(probPy.title.includes('Merkle Audit Proof Validator'), `Title should match: ${probPy.title}`);
  assert.strictEqual(probPy.functionName, 'verify_merkle_proof');
  assert.ok(probPy.starterCode.includes('def verify_merkle_proof'));
  assert.ok(probPy.testCases && probPy.testCases.length === 5, 'Must generate exactly 5 tiers');

  const tiers = probPy.testCases.map(tc => tc.tier);
  assert.deepStrictEqual(tiers, ['standard', 'scale', 'zero_empty', 'edge_case', 'complexity']);

  // Check JavaScript variant
  const probJs = resolveDynamicCodingProblem('Cybersecurity Threat Defense', 'tech', 'javascript');
  assert.strictEqual(probJs.functionName, 'verifyMerkleProof');
  assert.ok(probJs.starterCode.includes('function verifyMerkleProof'));

  // Check C++ variant
  const probCpp = resolveDynamicCodingProblem('Crypto Security Audit', 'tech', 'cpp');
  assert.ok(probCpp.starterCode.includes('int verifyMerkleProof'));
  assert.ok(probCpp.starterCode.includes('std::pair'));
});

test('Specialized Archetype: Financial Engineering & ERP Double-Entry Ledger Auditor', () => {
  const probPy = resolveDynamicCodingProblem('Corporate Financial Auditing', 'non_tech', 'python');
  assert.ok(probPy.title.includes('Double-Entry Ledger Trial Balance Auditor'), `Title should match: ${probPy.title}`);
  assert.strictEqual(probPy.functionName, 'audit_trial_balance');
  assert.ok(probPy.starterCode.includes('def audit_trial_balance'));
  assert.ok(probPy.testCases && probPy.testCases.length === 5, 'Must generate exactly 5 tiers');

  const tiers = probPy.testCases.map(tc => tc.tier);
  assert.deepStrictEqual(tiers, ['standard', 'scale', 'zero_empty', 'edge_case', 'complexity']);

  // Check JavaScript variant
  const probJs = resolveDynamicCodingProblem('Banking & Accounting Systems', 'non_tech', 'javascript');
  assert.strictEqual(probJs.functionName, 'auditTrialBalance');
  assert.ok(probJs.starterCode.includes('function auditTrialBalance'));

  // Check C++ variant
  const probCpp = resolveDynamicCodingProblem('Tax Statutory Audit Ledger', 'non_tech', 'cpp');
  assert.ok(probCpp.starterCode.includes('double auditTrialBalance'));
  assert.ok(probCpp.starterCode.includes('JournalEntry'));
});

test('Specialized Archetype: Preservation of Core 5 Domains Invariants', () => {
  const baselineDomains = [
    { topic: 'React UI Architecture', stream: 'tech' as const, expectedFn: 'batch_state_updates', expectedTitle: 'State Batcher & Reducer' },
    { topic: 'Database Performance', stream: 'tech' as const, expectedFn: 'analyze_department_salaries', expectedTitle: 'High-Throughput Aggregations' },
    { topic: 'Cloud Microservices', stream: 'tech' as const, expectedFn: 'is_request_allowed', expectedTitle: 'Token Bucket Rate Limiter' },
    { topic: 'AI Search Engine', stream: 'tech' as const, expectedFn: 'cosine_similarity', expectedTitle: 'Cosine Similarity & Vector Matching' },
    { topic: 'Core Operating Systems', stream: 'tech' as const, expectedFn: 'max_throughput_window', expectedTitle: 'Longest Valid Throughput Window' }
  ];

  for (const d of baselineDomains) {
    const probPy = resolveDynamicCodingProblem(d.topic, d.stream, 'python');
    assert.ok(probPy.title.includes(d.expectedTitle), `Title must match domain: ${probPy.title}`);
    assert.strictEqual(probPy.functionName, d.expectedFn, `Python functionName must be ${d.expectedFn}`);
    assert.ok(probPy.testCases && probPy.testCases.length === 5);
  }
});
