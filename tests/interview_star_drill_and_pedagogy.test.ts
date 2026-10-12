import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Round4StarDrill } from '../src/app/interview/components/Round4StarDrill';
import {
  computeDeterministicEvaluation,
  generateInterviewTranscriptMarkdown
} from '../src/app/interview/interviewEvaluator';
import { formatStageLabel } from '../src/app/interview/interviewTypes';

const mockTeacher = {
  id: 'alex_quant',
  name: 'Alex Vance',
  emoji: '⚡',
  title: 'Head of Quantitative Systems'
};

test('Round4StarDrill: STAR progression stepper and guidance pills render correctly across steps', () => {
  // Step 0: Situation active
  const htmlStep0 = renderToStaticMarkup(
    React.createElement(Round4StarDrill, {
      activeTeacher: mockTeacher,
      animState: 'talking',
      showCameraPreview: false,
      videoPreviewRef: { current: null },
      eyeContactScore: null,
      wpmScore: null,
      lastInterviewerSpeech: 'Describe a situation where latency spiked unexpectedly.',
      onSendMessage: () => {},
      isSendingInterviewMessage: false,
      starStep: 0,
      finishInterview: () => {},
      canFinishInterview: false,
      messages: [],
      messagesEndRef: { current: null },
      manualTextInput: '',
      setManualTextInput: () => {}
    })
  );

  assert.ok(htmlStep0.includes('👉 S — Situation'), 'Step 0 must mark Situation as active');
  assert.ok(!htmlStep0.includes('✅ S — Situation'), 'Step 0 must not mark Situation as completed');
  assert.ok(htmlStep0.includes('Set the business &amp; technical context') || htmlStep0.includes('Set the business & technical context'), 'Must provide Situation coaching guidance');

  // Step 2: Action active (Situation and Task completed)
  const htmlStep2 = renderToStaticMarkup(
    React.createElement(Round4StarDrill, {
      activeTeacher: mockTeacher,
      animState: 'idle',
      showCameraPreview: false,
      videoPreviewRef: { current: null },
      eyeContactScore: null,
      wpmScore: 130,
      lastInterviewerSpeech: 'What actions did you take to mitigate the GC pauses?',
      onSendMessage: () => {},
      isSendingInterviewMessage: false,
      starStep: 2,
      finishInterview: () => {},
      canFinishInterview: false,
      messages: [],
      messagesEndRef: { current: null },
      manualTextInput: '',
      setManualTextInput: () => {}
    })
  );

  assert.ok(htmlStep2.includes('✅ S — Situation'), 'Step 2 must mark Situation completed');
  assert.ok(htmlStep2.includes('✅ T — Task'), 'Step 2 must mark Task completed');
  assert.ok(htmlStep2.includes('👉 A — Action'), 'Step 2 must mark Action as active');
  assert.ok(htmlStep2.includes('Explain the concrete technical actions'), 'Must provide Action coaching guidance');

  // Step 4: All 4 quadrants completed
  const htmlStep4 = renderToStaticMarkup(
    React.createElement(Round4StarDrill, {
      activeTeacher: mockTeacher,
      animState: 'idle',
      showCameraPreview: false,
      videoPreviewRef: { current: null },
      eyeContactScore: 90,
      wpmScore: 140,
      lastInterviewerSpeech: 'Excellent breakdown.',
      onSendMessage: () => {},
      isSendingInterviewMessage: false,
      starStep: 4,
      finishInterview: () => {},
      canFinishInterview: true,
      messages: [],
      messagesEndRef: { current: null },
      manualTextInput: '',
      setManualTextInput: () => {}
    })
  );

  assert.ok(htmlStep4.includes('✅ S — Situation'), 'Step 4 must mark Situation completed');
  assert.ok(htmlStep4.includes('✅ T — Task'), 'Step 4 must mark Task completed');
  assert.ok(htmlStep4.includes('✅ A — Action'), 'Step 4 must mark Action completed');
  assert.ok(htmlStep4.includes('✅ R — Result'), 'Step 4 must mark Result completed');
  assert.ok(!htmlStep4.includes('👉'), 'Step 4 must have zero remaining active pointers');
  assert.ok(htmlStep4.includes('All 4 STAR quadrants completed'), 'Must show full completion celebration');
});

test('Interview Evaluator: Resolves granular STAR badges and exports coverage markdown', () => {
  // 1. STAR Master
  const masterEval = computeDeterministicEvaluation({
    messages: [{ role: 'user', content: 'Our latency fell from 45ms to 1.2ms.' }],
    codeSubmitted: true,
    latestTopology: null,
    starStep: 4,
    fillerWordCount: 0,
    wpmScore: 135,
    eyeContactScore: 90,
    activeTopicName: 'High-Frequency Systems',
    domainStream: 'tech'
  });
  assert.equal(masterEval.perRoundScores.round4.badge, 'STAR Master (4/4)');

  // 2. STAR Articulated
  const articulatedEval = computeDeterministicEvaluation({
    messages: [{ role: 'user', content: 'I optimized ring buffer pointers.' }],
    codeSubmitted: true,
    latestTopology: null,
    starStep: 2,
    fillerWordCount: 0,
    wpmScore: 120,
    eyeContactScore: 80,
    activeTopicName: 'High-Frequency Systems',
    domainStream: 'tech'
  });
  assert.equal(articulatedEval.perRoundScores.round4.badge, 'STAR Articulated');

  // 3. Markdown transcript includes STAR Framework Coverage
  const md = generateInterviewTranscriptMarkdown({
    activeTopicName: 'High-Frequency Systems',
    domainStream: 'tech',
    teacherName: 'Alex Vance',
    evaluationResult: masterEval,
    eyeContactScore: 90,
    wpmScore: 135,
    fillerWordCount: 0,
    codeContent: '// submitted',
    selectedLang: 'cpp',
    messages: []
  });

  assert.ok(md.includes('**STAR Framework Coverage:**'), 'Markdown must include STAR coverage');
  assert.ok(md.includes('STAR Master (4/4)'), 'Markdown must embed STAR Master badge');
});

test('Interview Types: formatStageLabel formats stages accurately for session recovery', () => {
  assert.equal(formatStageLabel('round1_behavioral'), 'Round 1: Behavioral & Introductions');
  assert.equal(formatStageLabel('round2_coding'), 'Round 2: Technical & Coding Sandbox');
  assert.equal(formatStageLabel('round3_systems'), 'Round 3: System Architecture Canvas');
  assert.equal(formatStageLabel('round4_star'), 'Round 4: Situational STAR Defense');
  assert.equal(formatStageLabel('results'), 'Final Evaluation');
});
