import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateSystemTopology } from '../src/lib/interview/systemDesignEvaluator';
import type { SystemTopologySnapshot } from '../src/components/interview/SystemDesignWhiteboard';

test('System Design Evaluator: Identifies vector_search_rag archetype and flags missing vector DB', () => {
  const incompleteSnapshot: SystemTopologySnapshot = {
    nodeCount: 3,
    linkCount: 2,
    nodes: [
      { id: '1', type: 'Client App', label: 'Web User', category: 'client' },
      { id: '2', type: 'API Gateway', label: 'Kong Ingress', category: 'gateway' },
      { id: '3', type: 'Postgres DB', label: 'Relational DB', category: 'storage' }
    ],
    links: [
      { fromType: 'Client App', toType: 'API Gateway', protocol: 'HTTPS' },
      { fromType: 'API Gateway', toType: 'Postgres DB', protocol: 'PostgreSQL' }
    ],
    hasLoadBalancer: false,
    hasCachingLayer: false,
    hasDatabase: true,
    hasQueue: false,
    hasVectorStore: false,
    hasMatchingEngine: false,
    isFullyConnected: true
  };

  const evalResult = evaluateSystemTopology(
    incompleteSnapshot,
    'Design an Enterprise Document Search with Vector RAG & LLMs',
    'tech'
  );

  assert.ok(evalResult.bottlenecks.some(b => b.includes('Vector Database')), 'Must flag missing vector database');
  assert.ok(evalResult.recommendations.some(r => r.includes('pgvector') || r.includes('Vector Database')), 'Must recommend vector store');
});

test('System Design Evaluator: Scores complete vector_search_rag topology with high grade', () => {
  const completeRagSnapshot: SystemTopologySnapshot = {
    nodeCount: 6,
    linkCount: 5,
    nodes: [
      { id: '1', type: 'Client App', label: 'Client App', category: 'client' },
      { id: '2', type: 'API Gateway', label: 'LLM Guardrail Ingress', category: 'gateway' },
      { id: '3', type: 'Worker / Cron', label: 'Embedding & Chunking Worker', category: 'compute' },
      { id: '4', type: 'Vector DB (pgvector / Pinecone)', label: 'Vector DB (ANN Index)', category: 'storage' },
      { id: '5', type: 'Blob Storage (S3)', label: 'S3 Raw Document Chunks', category: 'storage' },
      { id: '6', type: 'Postgres DB', label: 'User Metadata DB', category: 'storage' }
    ],
    links: [
      { fromType: 'Client App', toType: 'API Gateway', protocol: 'HTTPS' },
      { fromType: 'API Gateway', toType: 'Worker / Cron', protocol: 'REST' },
      { fromType: 'Worker / Cron', toType: 'Vector DB (pgvector / Pinecone)', protocol: 'ANN' },
      { fromType: 'Worker / Cron', toType: 'Blob Storage (S3)', protocol: 'S3' },
      { fromType: 'API Gateway', toType: 'Postgres DB', protocol: 'SQL' }
    ],
    hasLoadBalancer: true,
    hasCachingLayer: false,
    hasDatabase: true,
    hasQueue: false,
    hasVectorStore: true,
    hasMatchingEngine: false,
    isFullyConnected: true
  };

  const evalResult = evaluateSystemTopology(
    completeRagSnapshot,
    'Design an Enterprise Document Search with Vector RAG & LLMs',
    'tech'
  );

  assert.ok(evalResult.score >= 80, `Expected score >= 80, got ${evalResult.score}`);
  assert.ok(evalResult.grade === 'A+' || evalResult.grade === 'A', `Expected A or A+, got ${evalResult.grade}`);
  assert.ok(evalResult.strengths.some(s => s.includes('Vector Database')), 'Must record vector database strength');
});

test('System Design Evaluator: Identifies low_latency_matching_exchange archetype', () => {
  const quantSnapshot: SystemTopologySnapshot = {
    nodeCount: 5,
    linkCount: 4,
    nodes: [
      { id: '1', type: 'API Gateway', label: 'FIX Ingress Gateway', category: 'gateway' },
      { id: '2', type: 'Matching Engine (LMAX / Disruptor)', label: 'Order Matching Core', category: 'compute' },
      { id: '3', type: 'Kafka / Queue', label: 'Memory Ring Buffer Journal', category: 'queue' },
      { id: '4', type: 'Microservice', label: 'UDP Market Data Feed', category: 'compute' },
      { id: '5', type: 'Postgres DB', label: 'Post-Trade Settlement DB', category: 'storage' }
    ],
    links: [
      { fromType: 'API Gateway', toType: 'Matching Engine (LMAX / Disruptor)', protocol: 'TCP/FIX' },
      { fromType: 'Matching Engine (LMAX / Disruptor)', toType: 'Kafka / Queue', protocol: 'RingBuffer' },
      { fromType: 'Kafka / Queue', toType: 'Microservice', protocol: 'Multicast' },
      { fromType: 'Kafka / Queue', toType: 'Postgres DB', protocol: 'Async' }
    ],
    hasLoadBalancer: true,
    hasCachingLayer: false,
    hasDatabase: true,
    hasQueue: true,
    hasVectorStore: false,
    hasMatchingEngine: true,
    isFullyConnected: true
  };

  const evalResult = evaluateSystemTopology(
    quantSnapshot,
    'Design a High-Frequency Crypto Exchange with Order Matching Engine and LMAX Disruptor',
    'tech'
  );

  assert.ok(evalResult.score >= 80, `Expected score >= 80, got ${evalResult.score}`);
  assert.ok(evalResult.grade === 'A+' || evalResult.grade === 'A', `Expected A or A+, got ${evalResult.grade}`);
  assert.ok(evalResult.strengths.some(s => s.includes('Matching Engine')), 'Must record matching engine strength');
});
