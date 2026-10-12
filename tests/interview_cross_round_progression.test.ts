import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Round1Behavioral } from '../src/app/interview/components/Round1Behavioral';
import { Round2Coding } from '../src/app/interview/components/Round2Coding';
import { Round3SystemDesign } from '../src/app/interview/components/Round3SystemDesign';

test('Block 36: Round1Behavioral renders response counter progression and vocal cadence classification', () => {
  const teacher = { id: 'priya', name: 'Ms. Priya', emoji: '👩‍💼', title: 'HR Director' };

  const htmlStep1 = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round1Behavioral, {
      activeTeacher: teacher,
      animState: 'idle',
      showCameraPreview: true,
      videoPreviewRef: { current: null },
      eyeContactScore: 78,
      wpmScore: 140,
      isAvatarSpeaking: false,
      isVoiceListening: false,
      lastInterviewerSpeech: 'Tell me about yourself.',
      onProceed: () => {},
      canProceed: false,
      fillerWordCount: 2,
      messages: [
        { role: 'assistant', content: 'Welcome!' },
        { role: 'user', content: 'I am a systems engineer.' }
      ],
      messagesEndRef: { current: null },
      manualTextInput: '',
      setManualTextInput: () => {},
      onSendMessage: () => {}
    })
  );

  assert.match(htmlStep1, /data-testid="round1-progress-pill"/);
  assert.match(htmlStep1, /Progress: 1\/3 responses completed — answer 2 more topic-specific questions/);
  assert.match(htmlStep1, /140 WPM \(Optimal\)/);

  const htmlStep3 = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round1Behavioral, {
      activeTeacher: teacher,
      animState: 'idle',
      showCameraPreview: true,
      videoPreviewRef: { current: null },
      eyeContactScore: 82,
      wpmScore: 175,
      isAvatarSpeaking: false,
      isVoiceListening: false,
      lastInterviewerSpeech: 'Great!',
      onProceed: () => {},
      canProceed: true,
      fillerWordCount: 0,
      messages: [
        { role: 'user', content: 'R1' },
        { role: 'user', content: 'R2' },
        { role: 'user', content: 'R3' }
      ],
      messagesEndRef: { current: null },
      manualTextInput: '',
      setManualTextInput: () => {},
      onSendMessage: () => {}
    })
  );

  assert.match(htmlStep3, /3\/3 Behavioral responses complete — Ready for Round 2 Coding!/);
  assert.match(htmlStep3, /175 WPM \(Fast\)/);
});

test('Block 36: Round2Coding renders 2-step code & review defense progression banner across states', () => {
  const teacher = { id: 'rohan', name: 'Mr. Rohan', emoji: '👨‍💻', title: 'Technical Evaluator' };
  const baseProps = {
    domainStream: 'tech' as const,
    currentCodingProb: {
      title: 'Sliding Window Rate Limiter',
      description: 'Implement a rate limiter.',
      starterCode: 'def solve(): pass'
    },
    onProceed: () => {},
    onReviewSolution: () => {},
    onRetryChallenge: () => {},
    canProceed: false,
    codeSubmitted: false,
    codeRunFailed: false,
    codeReviewStarted: false,
    codeReviewQuestionReady: false,
    isSendingInterviewMessage: false,
    lastInterviewerSpeech: 'Solve the problem.',
    manualTextInput: '',
    setManualTextInput: () => {},
    onSendMessage: () => {},
    selectedLang: 'python' as const,
    setSelectedLang: () => {},
    runCodeAndTests: () => {},
    isRunning: false,
    codeContent: 'def solve(): pass',
    setCodeContent: () => {},
    codeModifiedRef: { current: false },
    activeTeacher: teacher,
    animState: 'idle' as const,
    terminalLogs: [],
    setTerminalLogs: () => {}
  };

  const htmlInitial = ReactDOMServer.renderToStaticMarkup(React.createElement(Round2Coding, baseProps));
  assert.match(htmlInitial, /data-testid="round2-progress-banner"/);
  assert.match(htmlInitial, /Step 1 of 2: Implement your solution and pass all 5 boundary test tiers/);

  const htmlTestsPassed = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round2Coding, { ...baseProps, codeSubmitted: true })
  );
  assert.match(htmlTestsPassed, /Step 1 of 2 Complete: All 5 boundary tiers passed!/);

  const htmlReviewReady = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round2Coding, { ...baseProps, codeSubmitted: true, codeReviewStarted: true, codeReviewQuestionReady: true })
  );
  assert.match(htmlReviewReady, /Step 2 of 2: Answer Mr\. Rohan&#x27;s code review question/);

  const htmlVerified = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round2Coding, { ...baseProps, codeSubmitted: true, canProceed: true })
  );
  assert.match(htmlVerified, /Code &amp; Review Defense Verified/);
});

test('Block 36: Round3SystemDesign renders 2-step topology evaluation & trade-off defense progression banner', () => {
  const teacher = { id: 'vikram', name: 'Mr. Vikram', emoji: '👨‍⚖️', title: 'Systems Evaluator' };
  const baseProps = {
    domainStream: 'tech' as const,
    activeTopicName: 'Cloud & Distributed Systems',
    onProceed: () => {},
    canProceed: false,
    setLatestTopology: () => {},
    analyzeSystemArchitecture: () => {},
    isAnalyzingArchitecture: false,
    activeTeacher: teacher,
    animState: 'idle' as const,
    lastInterviewerSpeech: 'Design the system.'
  };

  const htmlStep1 = ReactDOMServer.renderToStaticMarkup(React.createElement(Round3SystemDesign, baseProps));
  assert.match(htmlStep1, /data-testid="round3-progress-banner"/);
  assert.match(htmlStep1, /Step 1 of 2: Place components on the canvas/);

  const htmlLowScore = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round3SystemDesign, {
      ...baseProps,
      architectureEvaluation: { score: 45, verdict: 'C', summary: 'Missing cache' }
    })
  );
  assert.match(htmlLowScore, /Topology score \(45\/100\) is below the 60\/100 threshold/);

  const htmlStep2 = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round3SystemDesign, {
      ...baseProps,
      architectureEvaluation: { score: 82, verdict: 'A', summary: 'Solid topology' }
    })
  );
  assert.match(htmlStep2, /Step 2 of 2: Answer Mr\. Vikram&#x27;s architectural trade-off question/);

  const htmlVerified = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Round3SystemDesign, {
      ...baseProps,
      canProceed: true,
      architectureEvaluation: { score: 88, verdict: 'A', summary: 'Solid topology' }
    })
  );
  assert.match(htmlVerified, /Architecture &amp; Trade-Off Defense Verified — Ready for Round 4 STAR Defense!/);
});
