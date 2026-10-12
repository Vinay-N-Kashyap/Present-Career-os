import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { computeDeterministicEvaluation } from '../src/app/interview/interviewEvaluator';
import { InterviewResultsView } from '../src/app/interview/components/InterviewResultsView';
import { InterviewHistoryModal, formatHistorySessionMarkdown } from '../src/app/interview/components/InterviewHistoryModal';
import { InterviewSessionRecord } from '../src/app/interview/interviewTypes';

test('Block 35: computeDeterministicEvaluation returns starMetrics and InterviewResultsView renders star-metrics-card', () => {
  const evalOut = computeDeterministicEvaluation({
    messages: [
      { role: 'assistant', content: 'Welcome to Round 4.' },
      { role: 'user', content: 'Situation: high latency.' },
      { role: 'user', content: 'Task: reduce p99 under 50ms.' },
      { role: 'user', content: 'Action: implemented Redis write-through cache.' },
      { role: 'user', content: 'Result: p99 dropped to 18ms.' }
    ],
    codeSubmitted: true,
    latestTopology: { nodes: [{ id: 'n1', label: 'API Gateway' }, { id: 'n2', label: 'Redis Cache' }], edges: [] },
    starStep: 4,
    fillerWordCount: 1,
    eyeContactScore: 84,
    wpmScore: 138,
    activeTopicName: 'Distributed Systems',
    domainStream: 'tech',
    archetype: 'Systems Architect'
  });

  assert.ok(evalOut.starMetrics, 'Expected starMetrics in computeDeterministicEvaluation output');
  assert.equal(evalOut.starMetrics.stepsCompleted, 4);
  assert.equal(evalOut.starMetrics.badge, 'STAR Master (4/4)');

  const html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewResultsView, {
      evaluationResult: evalOut,
      activeTopicName: 'Distributed Systems',
      codeSubmitted: true,
      latestTopology: { nodes: [{ id: 'n1', label: 'API Gateway' }] },
      starStep: 4,
      wpmScore: 138,
      fillerWordCount: 1,
      eyeContactScore: 84,
      startInterview: () => {},
      exportInterviewTranscript: () => {},
      exitInterview: () => {}
    })
  );

  assert.match(html, /data-testid="star-metrics-card"/);
  assert.match(html, /STAR Master \(4\/4\)/);
  assert.match(html, /data-testid="improvements-card"/);
});

test('Block 35: InterviewHistoryModal renders difficulty badge, strengths, improvements, and telemetry diagnostics', () => {
  const sampleSession: InterviewSessionRecord = {
    id: 'sess-hist-001',
    date: 'Oct 12, 2026',
    timestamp: '2026-10-12T19:00:00.000Z',
    type: 'Tech: Embedded Systems & IoT Engineering',
    domainStream: 'tech',
    domainSubTopic: 'Embedded Systems & IoT Engineering',
    difficulty: 'hard',
    verdict: 'Hire',
    score: 88,
    radar: { logic: 90, systems: 86, comms: 84, solving: 90, star: 85 },
    telemetry: {
      eyeContact: 82,
      wpm: 135,
      fillerWords: 2
    },
    messages: [
      { role: 'assistant', content: 'Explain volatile in ISR handlers.' },
      { role: 'user', content: 'It prevents compiler register caching of MMIO status flags.' }
    ],
    summary: 'Strong embedded firmware defense.',
    strengths: ['Deterministic ISR safety', 'Clean bitwise register manipulation'],
    improvements: 'Quantify bus contention latency under burst interrupts.',
    topology: {
      nodes: [{ id: 'mcu', label: 'STM32 Cortex-M4' }, { id: 'can', label: 'CAN Bus Transceiver' }]
    }
  };

  const html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(InterviewHistoryModal, {
      selectedHistorySession: sampleSession,
      onClose: () => {}
    })
  );

  assert.match(html, /data-testid="history-difficulty-badge"/);
  assert.match(html, /hard/i);
  assert.match(html, /data-testid="history-strengths-card"/);
  assert.match(html, /Deterministic ISR safety/);
  assert.match(html, /data-testid="history-improvements-card"/);
  assert.match(html, /Quantify bus contention latency/);
  assert.match(html, /data-testid="history-telemetry-card"/);
  assert.match(html, /82%/);
  assert.match(html, /135 WPM/);

  const md = formatHistorySessionMarkdown(sampleSession);
  assert.match(md, /\*\*Difficulty:\*\* HARD/);
  assert.match(md, /## Demonstrated Strengths/);
  assert.match(md, /- Deterministic ISR safety/);
  assert.match(md, /## Areas for Improvement/);
  assert.match(md, /## Delivery Diagnostics/);
  assert.match(md, /- \*\*Eye Contact:\*\* 82%/);
  assert.match(md, /- \*\*Speaking Pace:\*\* 135 WPM/);
});
