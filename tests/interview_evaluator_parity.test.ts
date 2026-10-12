import test from 'node:test';
import assert from 'node:assert/strict';
import { computeDeterministicEvaluation } from '../src/app/interview/interviewEvaluator';

test('Interview Evaluator: Enforces zero telemetry score penalty invariant (Golden Rule 3)', () => {
  const baseInput = {
    messages: [
      { role: 'user', content: 'We decouple our ingestion services using Kafka to handle 50k req/s.', timestamp: 1 },
      { role: 'assistant', content: 'How do you handle partition rebalancing?', timestamp: 2 },
      { role: 'user', content: 'We tune max.poll.interval.ms and use static membership to eliminate stop-the-world pauses.', timestamp: 3 },
    ],
    codeSubmitted: true,
    latestTopology: {
      nodes: [{ id: '1', type: 'Client App', label: 'Web' }, { id: '2', type: 'API Gateway', label: 'Kong' }],
      links: [{ fromType: 'Client App', toType: 'API Gateway', protocol: 'HTTPS' }],
      hasLoadBalancer: true,
      hasCachingLayer: true,
      hasDatabase: true,
      hasQueue: true,
      isFullyConnected: true
    },
    starStep: 3,
    eyeContactScore: 85,
    wpmScore: 135,
    activeTopicName: 'Backend & Distributed Systems',
    domainStream: 'tech' as const,
    archetype: 'Pattern Hunter' as const
  };

  const evalClean = computeDeterministicEvaluation({
    ...baseInput,
    fillerWordCount: 0
  });

  const evalWithFillers = computeDeterministicEvaluation({
    ...baseInput,
    fillerWordCount: 18
  });

  // Core hiring dimensions and overall score MUST be identical
  assert.equal(evalClean.score, evalWithFillers.score, 'Overall score must not be penalized by filler words');
  assert.equal(evalClean.radar.comms, evalWithFillers.radar.comms, 'Comms dimension must not be penalized by filler words');
  assert.equal(evalClean.verdict, evalWithFillers.verdict, 'Verdict must remain identical');

  // Telemetry signals DO record the diagnostic difference
  assert.equal(evalClean.telemetryDiagnostics.deliveryStatus !== 'Not Assessed', true);
  assert.equal(evalWithFillers.telemetryDiagnostics.deliveryStatus !== 'Not Assessed', true);
});

test('Interview Evaluator: Domain-aware technical badges for specialized roles', () => {
  // 1. Embedded Systems
  const iotEval = computeDeterministicEvaluation({
    messages: [{ role: 'user', content: 'Configuring STM32 GPIO MODER register via volatile pointer.', timestamp: 1 }],
    codeSubmitted: true,
    latestTopology: null,
    starStep: 2,
    fillerWordCount: 2,
    eyeContactScore: null,
    wpmScore: null,
    activeTopicName: 'Embedded Systems & IoT Engineering',
    domainStream: 'tech',
    archetype: 'Stabilizer'
  });
  assert.equal(iotEval.perRoundScores.round2.badge, 'MCU C++ Sandbox');
  assert.equal(iotEval.perRoundScores.round3.badge, 'Hardware / MMIO Architecture');
  assert.equal(iotEval.perRoundScores.round2.metric, 'Embedded register test suite verified');

  // 2. Quant / Low-Latency
  const quantEval = computeDeterministicEvaluation({
    messages: [{ role: 'user', content: 'LMAX Disruptor lock-free ring buffer for deterministic matching.', timestamp: 1 }],
    codeSubmitted: true,
    latestTopology: null,
    starStep: 2,
    fillerWordCount: 1,
    eyeContactScore: null,
    wpmScore: null,
    activeTopicName: 'Quantitative Systems & Algorithmic Trading',
    domainStream: 'tech',
    archetype: 'Pattern Hunter'
  });
  assert.equal(quantEval.perRoundScores.round2.badge, 'Low-Latency C++ Engine');
  assert.equal(quantEval.perRoundScores.round3.badge, 'LMAX / Exchange Topology');
  assert.equal(quantEval.perRoundScores.round2.metric, 'Order book test suite verified');

  // 3. AI / ML
  const aiEval = computeDeterministicEvaluation({
    messages: [{ role: 'user', content: 'HNSW vector index with pgvector and cosine distance threshold.', timestamp: 1 }],
    codeSubmitted: false,
    latestTopology: null,
    starStep: 1,
    fillerWordCount: 0,
    eyeContactScore: null,
    wpmScore: null,
    activeTopicName: 'AI, Machine Learning & LLM Systems',
    domainStream: 'tech',
    archetype: 'Explorer'
  });
  assert.equal(aiEval.perRoundScores.round2.badge, 'Python AI Sandbox');
  assert.equal(aiEval.perRoundScores.round3.badge, 'Vector RAG Architecture');

  // 4. Cybersecurity
  const cyberEval = computeDeterministicEvaluation({
    messages: [{ role: 'user', content: 'Zero trust RBAC with JWT public key signature validation.', timestamp: 1 }],
    codeSubmitted: false,
    latestTopology: null,
    starStep: 1,
    fillerWordCount: 0,
    eyeContactScore: null,
    wpmScore: null,
    activeTopicName: 'Cybersecurity & Secure Systems',
    domainStream: 'tech',
    archetype: 'Stabilizer'
  });
  assert.equal(cyberEval.perRoundScores.round2.badge, 'Secure Systems Sandbox');
  assert.equal(cyberEval.perRoundScores.round3.badge, 'Threat Boundary Architecture');
});

test('Interview Evaluator: Handles empty / unattempted session safely without throwing', () => {
  const emptyEval = computeDeterministicEvaluation({
    messages: [],
    codeSubmitted: false,
    latestTopology: null,
    starStep: 0,
    fillerWordCount: 0,
    eyeContactScore: null,
    wpmScore: null,
    activeTopicName: 'Software Engineering (SDE)',
    domainStream: 'tech',
    archetype: 'Pattern Hunter'
  });

  assert.ok(emptyEval.score >= 0 && emptyEval.score <= 100, 'Overall score must be bounded');
  assert.equal(emptyEval.verdict, 'Needs Practice');
  assert.ok(emptyEval.perRoundScores.round1, 'Round 1 defined');
  assert.ok(emptyEval.perRoundScores.round2, 'Round 2 defined');
  assert.ok(emptyEval.perRoundScores.round3, 'Round 3 defined');
  assert.ok(emptyEval.perRoundScores.round4, 'Round 4 defined');
  assert.equal(emptyEval.telemetryDiagnostics.deliveryStatus, 'Not Assessed');
});
