import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateSystemTopology } from '../src/lib/interview/systemDesignEvaluator';
import type { SystemTopologySnapshot } from '../src/components/interview/SystemDesignWhiteboard';

test('System Design Evaluator: Identifies cybersecurity_zero_trust_mesh archetype and flags missing security controls', () => {
  const incompleteSecuritySnapshot: SystemTopologySnapshot = {
    nodeCount: 3,
    linkCount: 2,
    nodes: [
      { id: '1', type: 'Client App', label: 'External Client', category: 'client' },
      { id: '2', type: 'Microservice', label: 'Payment Microservice', category: 'compute' },
      { id: '3', type: 'Postgres DB', label: 'User Database', category: 'storage' }
    ],
    links: [
      { fromType: 'Client App', toType: 'Microservice', protocol: 'HTTPS' },
      { fromType: 'Microservice', toType: 'Postgres DB', protocol: 'PostgreSQL' }
    ],
    hasLoadBalancer: false,
    hasCachingLayer: false,
    hasDatabase: true,
    hasQueue: false,
    hasVectorStore: false,
    hasMatchingEngine: false,
    hasSecurityShield: false,
    hasMediaServer: false,
    isFullyConnected: true
  };

  const evalResult = evaluateSystemTopology(
    incompleteSecuritySnapshot,
    'Design a Zero-Trust API Defense and Identity Vault Mesh',
    'tech'
  );

  assert.ok(evalResult.bottlenecks.some(b => b.includes('WAF') || b.includes('Unshielded edge')), 'Must flag unshielded edge perimeter');
  assert.ok(evalResult.bottlenecks.some(b => b.includes('identity') || b.includes('Identity Provider') || b.includes('secrets')), 'Must flag missing identity plane or secrets vault');
  assert.ok(evalResult.recommendations.some(r => r.includes('WAF') || r.includes('Vault')), 'Must recommend edge WAF and Vault');
});

test('System Design Evaluator: Scores complete zero-trust security mesh topology with high grade', () => {
  const completeSecuritySnapshot: SystemTopologySnapshot = {
    nodeCount: 6,
    linkCount: 5,
    nodes: [
      { id: 'sec_1', type: 'Client App', label: 'External Client App', category: 'client' },
      { id: 'sec_2', type: 'WAF / API Shield', label: 'Cloudflare WAF / API Shield', category: 'gateway' },
      { id: 'sec_3', type: 'API Gateway', label: 'OIDC Ingress Auth Gateway', category: 'gateway' },
      { id: 'sec_4', type: 'Microservice', label: 'Protected Core Microservice', category: 'compute' },
      { id: 'sec_5', type: 'Auth & KMS Vault (OIDC / Vault)', label: 'HashiCorp Vault / KMS', category: 'storage' },
      { id: 'sec_6', type: 'Kafka / Queue', label: 'SIEM Audit Stream', category: 'queue' }
    ],
    links: [
      { fromType: 'Client App', toType: 'WAF / API Shield', protocol: 'HTTPS/TLS 1.3' },
      { fromType: 'WAF / API Shield', toType: 'API Gateway', protocol: 'Filtered Traffic' },
      { fromType: 'API Gateway', toType: 'Microservice', protocol: 'mTLS JWT Token' },
      { fromType: 'Microservice', toType: 'Auth & KMS Vault (OIDC / Vault)', protocol: 'Vault Envelope Key' },
      { fromType: 'Microservice', toType: 'Kafka / Queue', protocol: 'Audit Pub/Sub' }
    ],
    hasLoadBalancer: true,
    hasCachingLayer: false,
    hasDatabase: true,
    hasQueue: true,
    hasVectorStore: false,
    hasMatchingEngine: false,
    hasSecurityShield: true,
    hasMediaServer: false,
    isFullyConnected: true
  };

  const evalResult = evaluateSystemTopology(
    completeSecuritySnapshot,
    'Design a Zero-Trust API Defense and Identity Vault Mesh',
    'tech'
  );

  assert.ok(evalResult.score >= 80, `Expected score >= 80 for complete security mesh, got ${evalResult.score}`);
  assert.ok(['A+', 'A', 'B'].includes(evalResult.grade), `Expected passing grade, got ${evalResult.grade}`);
  assert.ok(evalResult.strengths.length >= 3, 'Must identify multiple architectural strengths');
});

test('System Design Evaluator: Identifies video_streaming_webrtc archetype and evaluates SFU media pipeline', () => {
  const completeWebRtcSnapshot: SystemTopologySnapshot = {
    nodeCount: 5,
    linkCount: 4,
    nodes: [
      { id: 'rtc_1', type: 'Client App', label: 'WebRTC Video Participant', category: 'client' },
      { id: 'rtc_2', type: 'Load Balancer', label: 'STUN / TURN Edge Relay', category: 'gateway' },
      { id: 'rtc_3', type: 'Media Server (WebRTC / SFU)', label: 'LiveKit SFU Media Server', category: 'compute' },
      { id: 'rtc_4', type: 'Redis Cache', label: 'Redis Room Signaling Cache', category: 'storage' },
      { id: 'rtc_5', type: 'Blob Storage (S3)', label: 'S3 Composite Recording Bucket', category: 'storage' }
    ],
    links: [
      { fromType: 'Client App', toType: 'Load Balancer', protocol: 'UDP NAT Traversal' },
      { fromType: 'Load Balancer', toType: 'Media Server (WebRTC / SFU)', protocol: 'RTP Media Stream' },
      { fromType: 'Media Server (WebRTC / SFU)', toType: 'Redis Cache', protocol: 'SDP Signaling Sync' },
      { fromType: 'Media Server (WebRTC / SFU)', toType: 'Blob Storage (S3)', protocol: 'HLS Archive Store' }
    ],
    hasLoadBalancer: true,
    hasCachingLayer: true,
    hasDatabase: false,
    hasQueue: false,
    hasVectorStore: false,
    hasMatchingEngine: false,
    hasSecurityShield: false,
    hasMediaServer: true,
    isFullyConnected: true
  };

  const evalResult = evaluateSystemTopology(
    completeWebRtcSnapshot,
    'Design a Global Video Conferencing Platform with WebRTC and Live Streaming',
    'tech'
  );

  assert.ok(evalResult.score >= 80, `Expected score >= 80 for WebRTC media pipeline, got ${evalResult.score}`);
  assert.ok(['A+', 'A', 'B'].includes(evalResult.grade), `Expected passing grade, got ${evalResult.grade}`);
  assert.ok(evalResult.reliabilityRating >= 80, 'Must have high reliability rating for TURN/SFU architecture');
});
