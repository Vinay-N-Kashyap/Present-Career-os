import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createSemanticFallbackProblem,
  resolveDynamicCodingProblem,
  SQL_INTERVIEW_TEST_SUITE
} from '../src/app/interview/problemGenerator';
import {
  evaluateSystemTopology
} from '../src/lib/interview/systemDesignEvaluator';
import { runTestSuite } from '../src/lib/code/codeRunner';

test('5-Tier Boundary: createSemanticFallbackProblem yields complete 5-tier test battery', () => {
  const problem = createSemanticFallbackProblem('Distributed Telemetry');
  assert.ok(problem.testCases, 'testCases array must exist');
  assert.strictEqual(problem.testCases.length, 5, 'Must generate exactly 5 distinct boundary tiers');

  const tiers = problem.testCases.map(tc => tc.tier);
  assert.deepStrictEqual(tiers, ['standard', 'scale', 'zero_empty', 'edge_case', 'complexity'], 'Must map all 5 boundary tiers');

  for (const tc of problem.testCases) {
    assert.ok(tc.expectedOutput !== undefined && tc.expectedOutput !== '', 'Expected output must be strictly defined');
    assert.strictEqual(typeof tc.expectedOutput, 'string');
    assert.notStrictEqual(tc.expectedOutput.toLowerCase(), 'true', 'Must assert concrete values, never boolean true');
    assert.strictEqual((tc as any).verify, undefined, 'verify hack must not exist on test cases');
    assert.ok(tc.tierLabel && tc.tierLabel.startsWith('T'), 'tierLabel must have T1-T5 prefix');
  }
});

test('5-Tier Boundary: resolveDynamicCodingProblem produces 5-tier battery across all 5 domains', () => {
  const domains: Array<{ topic: string; stream: 'tech' | 'non_tech'; expectedFn: string; expectedTitle: string }> = [
    { topic: 'React UI Architecture', stream: 'tech', expectedFn: 'batch_state_updates', expectedTitle: 'State Batcher & Reducer' },
    { topic: 'Database Performance', stream: 'tech', expectedFn: 'analyze_department_salaries', expectedTitle: 'High-Throughput Aggregations' },
    { topic: 'Cloud Microservices', stream: 'tech', expectedFn: 'is_request_allowed', expectedTitle: 'Token Bucket Rate Limiter' },
    { topic: 'AI Search Engine', stream: 'tech', expectedFn: 'cosine_similarity', expectedTitle: 'Cosine Similarity & Vector Matching' },
    { topic: 'Core Operating Systems', stream: 'tech', expectedFn: 'max_throughput_window', expectedTitle: 'Longest Valid Throughput Window' }
  ];

  for (const d of domains) {
    const probPy = resolveDynamicCodingProblem(d.topic, d.stream, 'python');
    assert.ok(probPy.title.includes(d.expectedTitle), `Title must match domain: ${probPy.title}`);
    assert.strictEqual(probPy.functionName, d.expectedFn, `Python functionName must be ${d.expectedFn}`);
    assert.ok(probPy.testCases, `testCases must be present for ${d.topic}`);
    assert.strictEqual(probPy.testCases.length, 5, `Must have exactly 5 tiers for ${d.topic}`);

    const tiers = probPy.testCases.map(tc => tc.tier);
    assert.deepStrictEqual(tiers, ['standard', 'scale', 'zero_empty', 'edge_case', 'complexity']);

    // Check JavaScript camelCase adaptation
    const probJs = resolveDynamicCodingProblem(d.topic, d.stream, 'javascript');
    assert.ok(probJs.starterCode.length > 20, 'JavaScript starter code must be populated');
    assert.ok(!probJs.functionName?.includes('_') || probJs.functionName === d.expectedFn, 'JS functionName must be properly specified');
  }
});

test('5-Tier Boundary: SQL interview test suite enforces 5 strict assertions', () => {
  assert.ok(SQL_INTERVIEW_TEST_SUITE.includes('[T1: Standard]'), 'SQL suite must include T1 check');
  assert.ok(SQL_INTERVIEW_TEST_SUITE.includes('[T2: Scale]'), 'SQL suite must include T2 check');
  assert.ok(SQL_INTERVIEW_TEST_SUITE.includes('[T3: Zero/Empty]'), 'SQL suite must include T3 check');
  assert.ok(SQL_INTERVIEW_TEST_SUITE.includes('[T4: Edge/Negative]'), 'SQL suite must include T4 check');
  assert.ok(SQL_INTERVIEW_TEST_SUITE.includes('[T5: Complexity Bounds]'), 'SQL suite must include T5 check');
});

test('Architecture Defense: systemDesignEvaluator identifies and evaluates iot_embedded_edge archetype', () => {
  const snapshot = {
    nodes: [
      { id: 'dev1', type: 'device', label: 'IoT Sensor Node' },
      { id: 'gw1', type: 'gateway', label: 'Edge MQTT Gateway' },
      { id: 'buf1', type: 'cache', label: 'Local Flash Buffer' },
      { id: 'bus1', type: 'queue', label: 'Kafka Telemetry Stream' },
      { id: 'ts1', type: 'database', label: 'TimescaleDB Timeseries Storage' }
    ],
    links: [
      { from: 'dev1', to: 'gw1' },
      { from: 'gw1', to: 'buf1' },
      { from: 'gw1', to: 'bus1' },
      { from: 'bus1', to: 'ts1' }
    ],
    isFullyConnected: true,
    hasCachingLayer: true,
    hasQueue: true,
    hasDatabase: true,
    hasLoadBalancer: true
  };

  const evalResult = evaluateSystemTopology(snapshot as any, 'IoT Embedded Sensor Network', 'tech');
  assert.ok(evalResult.score >= 75, `IoT topology should achieve high score, got ${evalResult.score}`);
  assert.ok(evalResult.grade === 'A' || evalResult.grade === 'A+', `Expected grade A or A+, got ${evalResult.grade}`);
  assert.ok(evalResult.strengths.some(s => s.toLowerCase().includes('edge gateway') || s.toLowerCase().includes('iot')), 'Identifies IoT Edge Gateway requirement');
  assert.ok(evalResult.scalabilityRating > 60, 'High scalability rating for decoupled IoT edge');
});

test('Architecture Defense: systemDesignEvaluator identifies and evaluates commerce_double_entry_ledger archetype', () => {
  const snapshot = {
    nodes: [
      { id: 'client', type: 'client', label: 'Checkout Web App' },
      { id: 'gw', type: 'gateway', label: 'API Gateway' },
      { id: 'srv', type: 'microservice', label: 'Ledger Engine Service' },
      { id: 'idemp', type: 'cache', label: 'Redis Idempotency Lock' },
      { id: 'ledger_db', type: 'database', label: 'PostgreSQL Double-Entry Ledger' },
      { id: 'recon_worker', type: 'worker', label: 'Reconciliation Worker Job' },
      { id: 'audit_s3', type: 'storage', label: 'Immutable S3 Audit Archive' }
    ],
    links: [
      { from: 'client', to: 'gw' },
      { from: 'gw', to: 'srv' },
      { from: 'srv', to: 'idemp' },
      { from: 'srv', to: 'ledger_db' },
      { from: 'srv', to: 'recon_worker' },
      { from: 'recon_worker', to: 'audit_s3' }
    ],
    isFullyConnected: true,
    hasCachingLayer: true,
    hasQueue: true,
    hasDatabase: true,
    hasLoadBalancer: true
  };

  const evalResult = evaluateSystemTopology(snapshot as any, 'Double-Entry Accounting & Ledger Reconciliation', 'tech');
  assert.ok(evalResult.score >= 80, `Double-entry ledger topology should achieve high score, got ${evalResult.score}`);
  assert.ok(evalResult.grade === 'A' || evalResult.grade === 'A+', `Expected grade A or A+, got ${evalResult.grade}`);
  assert.ok(evalResult.strengths.some(s => s.toLowerCase().includes('double-entry') || s.toLowerCase().includes('ledger')), 'Identifies double-entry ledger requirement');
  assert.ok(evalResult.reliabilityRating > 60, 'High reliability rating for ACID double-entry ledger');
});

test('Runtime Execution: 5-Tier suite verifies in-browser test runner with 100% pass', async () => {
  const systemsProblem = resolveDynamicCodingProblem('Systems Architecture', 'tech', 'javascript');
  assert.ok(systemsProblem.testCases && systemsProblem.testCases.length === 5);

  // Implement the optimal maxThroughputWindow solution
  const jsSolution = `
function maxThroughputWindow(metrics, minSla) {
  let maxLen = 0;
  let currentLen = 0;
  for (let i = 0; i < metrics.length; i++) {
    if (metrics[i] >= minSla) {
      currentLen++;
      if (currentLen > maxLen) maxLen = currentLen;
    } else {
      currentLen = 0;
    }
  }
  return maxLen;
}
`;

  const suiteResult = await runTestSuite(jsSolution, 'javascript', {
    functionName: systemsProblem.functionName,
    testCases: systemsProblem.testCases.map(tc => ({
      ...tc,
      output: tc.expectedOutput
    }))
  });

  assert.strictEqual(suiteResult.totalTests, 5, 'Must run all 5 tiers');
  assert.strictEqual(suiteResult.passedTests, 5, 'All 5 tiers must pass');
  assert.strictEqual(suiteResult.allPassed, true, 'allPassed must be true');
});
