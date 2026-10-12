import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateInterviewTranscriptMarkdown,
  computeDeterministicEvaluation
} from '../src/app/interview/interviewEvaluator';

test('Transcript Export: Markdown generation formats C++ code fence and specialized badges', () => {
  const evalResult = computeDeterministicEvaluation({
    messages: [
      { role: 'user', content: 'Implemented low-latency order book in C++.' }
    ],
    codeSubmitted: true,
    latestTopology: { nodes: [{ id: '1', label: 'Matching Engine' }] },
    starStep: 4,
    fillerWordCount: 1,
    wpmScore: 140,
    eyeContactScore: 92,
    activeTopicName: 'High Frequency Quant Trading',
    domainStream: 'tech',
    roleKey: 'quant_systems',
    difficulty: 'hard'
  });

  const markdown = generateInterviewTranscriptMarkdown({
    activeTopicName: 'High Frequency Quant Trading',
    domainStream: 'tech',
    teacherName: 'Alex Vance',
    evaluationResult: evalResult,
    eyeContactScore: 92,
    wpmScore: 140,
    fillerWordCount: 1,
    codeContent: '#include <vector>\nint matchLimitOrders() { return 0; }',
    selectedLang: 'cpp',
    messages: [
      { role: 'user', content: 'Implemented low-latency order book in C++.' },
      { role: 'assistant', content: 'How did you handle cache alignment?' }
    ]
  });

  assert.ok(markdown.includes('# Pinit Career OS — Technical Interview Report'), 'Must have title');
  assert.ok(markdown.includes('**Topic:** High Frequency Quant Trading'), 'Must have topic');
  assert.ok(markdown.includes('**Readiness:**'), 'Must include readiness level');
  assert.ok(markdown.includes('```cpp'), 'Must format with cpp language fence');
  assert.ok(markdown.includes('#include <vector>'), 'Must include submitted C++ code');
  assert.ok(markdown.includes('Low-Latency C++ Engine'), 'Must include Round 2 quant badge in per-round breakdown');
  assert.ok(markdown.includes('LMAX / Exchange Topology'), 'Must include Round 3 exchange topology badge');
  assert.ok(markdown.includes('**Candidate:** Implemented low-latency order book in C++.'), 'Must format candidate dialogue');
  assert.ok(markdown.includes('**Alex Vance:** How did you handle cache alignment?'), 'Must format interviewer dialogue');
});

test('Transcript Export: Markdown generation formats Python submissions and non-tech tracks', () => {
  const evalResult = computeDeterministicEvaluation({
    messages: [],
    codeSubmitted: true,
    latestTopology: null,
    starStep: 3,
    fillerWordCount: 0,
    wpmScore: 125,
    eyeContactScore: 85,
    activeTopicName: 'Corporate Accounting & Audit',
    domainStream: 'non_tech',
    roleKey: 'general_swe',
    difficulty: 'normal'
  });

  const markdown = generateInterviewTranscriptMarkdown({
    activeTopicName: 'Corporate Accounting & Audit',
    domainStream: 'non_tech',
    teacherName: 'Sarah Jenkins',
    evaluationResult: evalResult,
    eyeContactScore: 85,
    wpmScore: 125,
    fillerWordCount: 0,
    codeContent: 'def audit_trial_balance(entries):\n    return 0.0',
    selectedLang: 'python',
    messages: []
  });

  assert.ok(markdown.includes('**Track:** Non-Technical / Product'));
  assert.ok(markdown.includes('```python'));
  assert.ok(markdown.includes('audit_trial_balance'));
  assert.ok(markdown.includes('125 Words Per Minute'));
});

test('Architecture Defense: Evaluator output provides strengths for Round 3 visualization', () => {
  const evalResult = computeDeterministicEvaluation({
    messages: [
      { role: 'user', content: 'Our architecture uses an edge MQTT broker decoupled from the central Kafka event spine.' }
    ],
    codeSubmitted: true,
    latestTopology: {
      nodes: [
        { id: 'gw', type: 'gateway', label: 'IoT Gateway' },
        { id: 'db', type: 'database', label: 'TimescaleDB' }
      ]
    },
    starStep: 4,
    fillerWordCount: 0,
    wpmScore: 130,
    eyeContactScore: 90,
    activeTopicName: 'IoT Sensor Mesh',
    domainStream: 'tech',
    roleKey: 'iot_embedded',
    difficulty: 'hard'
  });

  assert.ok(Array.isArray(evalResult.strengths), 'Must supply strengths array');
  assert.ok(evalResult.strengths.length > 0, 'Must have at least one recognized strength');
  assert.ok(evalResult.perRoundScores.round3.badge === 'Hardware / MMIO Architecture');
});
