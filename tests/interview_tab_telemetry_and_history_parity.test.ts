import test from 'node:test';
import assert from 'node:assert/strict';
import { generateTelemetryDiagnostics } from '../src/lib/interview/scoringMatrix';
import {
  computeDeterministicEvaluation,
  generateInterviewTranscriptMarkdown
} from '../src/app/interview/interviewEvaluator';
import { formatHistorySessionMarkdown } from '../src/app/interview/components/InterviewHistoryModal';
import { InterviewSessionRecord, ActiveInterviewDraft } from '../src/app/interview/interviewTypes';

test('Block 58: generateTelemetryDiagnostics produces diagnostic tab focus continuity signals', () => {
  // Case 1: 0 tab switches (uninterrupted focus)
  const diag0 = generateTelemetryDiagnostics({ tabSwitches: 0 });
  assert.equal(diag0.deliveryStatus, 'Optimal');
  const signal0 = diag0.signals.find(s => s.metric === 'Tab Focus & Window Continuity');
  assert.ok(signal0, 'Signal for 0 tab switches must exist');
  assert.equal(signal0.status, 'good');
  assert.match(signal0.value, /0 pauses/i);
  assert.match(signal0.diagnostic, /zero tab switches detected/i);

  // Case 2: 1 tab switch (singular 'pause')
  const diag1 = generateTelemetryDiagnostics({ tabSwitches: 1 });
  assert.equal(diag1.deliveryStatus, 'Optimal');
  const signal1 = diag1.signals.find(s => s.metric === 'Tab Focus & Window Continuity');
  assert.ok(signal1, 'Signal for 1 tab switch must exist');
  assert.equal(signal1.status, 'info');
  assert.equal(signal1.value, '1 pause');

  // Case 3: Multiple tab switches (plural 'pauses', status 'info')
  const diagMultiple = generateTelemetryDiagnostics({ tabSwitches: 5 });
  assert.equal(diagMultiple.deliveryStatus, 'Optimal');
  const signalMulti = diagMultiple.signals.find(s => s.metric === 'Tab Focus & Window Continuity');
  assert.ok(signalMulti, 'Signal for multiple tab switches must exist');
  assert.equal(signalMulti.status, 'info');
  assert.equal(signalMulti.value, '5 pauses');
  assert.match(signalMulti.diagnostic, /safely paused/i);
});

test('Block 58: Golden Rule 3 Invariant - tab switches do NOT penalize candidate hiring score or communication metrics', () => {
  const baseInput = {
    messages: [
      { role: 'user' as const, content: 'I designed a distributed cache using Redis and Raft consensus.' },
      { role: 'assistant' as const, content: 'Excellent explanation.' }
    ],
    codeSubmitted: true,
    latestTopology: { nodes: [{ id: 'redis', type: 'redis' }] },
    starStep: 3,
    fillerWordCount: 2,
    eyeContactScore: 85,
    wpmScore: 135,
    activeTopicName: 'Distributed Systems',
    domainStream: 'tech' as const,
    archetype: 'Systems Architect' as const
  };

  const evalClean = computeDeterministicEvaluation({
    ...baseInput,
    tabSwitchCount: 0
  });

  const evalWithSwitches = computeDeterministicEvaluation({
    ...baseInput,
    tabSwitchCount: 12
  });

  // Strict score equality: tab switches must never dock points
  assert.equal(evalClean.score, evalWithSwitches.score, 'Overall score must be completely unaffected by tab switches');
  assert.equal(evalClean.radar.comms, evalWithSwitches.radar.comms, 'Communication radar score must be identical');
  assert.equal(evalClean.radar.logic, evalWithSwitches.radar.logic, 'Logic radar score must be identical');
  assert.equal(evalClean.radar.solving, evalWithSwitches.radar.solving, 'Problem solving radar score must be identical');
  assert.equal(evalClean.verdict, evalWithSwitches.verdict, 'Hiring verdict must be identical');

  // Verify diagnostic signal is included in telemetryDiagnostics
  const switchSignal = evalWithSwitches.telemetryDiagnostics?.signals?.find(
    s => s.metric === 'Tab Focus & Window Continuity'
  );
  assert.ok(switchSignal, 'Telemetry diagnostics must contain tab continuity signal');
  assert.equal(switchSignal.value, '12 pauses');
});

test('Block 58: generateInterviewTranscriptMarkdown exports tab switches without error', () => {
  const mdWithPauses = generateInterviewTranscriptMarkdown({
    activeTopicName: 'Frontend Architecture',
    domainStream: 'tech',
    teacherName: 'Mr. Rohan',
    evaluationResult: {
      verdict: 'Strong Hire',
      score: 92,
      summary: 'Demonstrated mastery of microfrontends and React reconciliation.',
      radar: { logic: 90, systems: 95, comms: 90, solving: 92, star: 88 }
    },
    eyeContactScore: 88,
    wpmScore: 140,
    fillerWordCount: 3,
    codeContent: 'const Component = () => <div>Hello</div>;',
    selectedLang: 'javascript',
    messages: [{ role: 'user', content: 'Here is my implementation.' }],
    tabSwitchCount: 4
  });

  assert.match(mdWithPauses, /- \*\*Tab Switches \/ Pauses:\*\* 4/);

  // Default when tabSwitchCount is omitted
  const mdDefault = generateInterviewTranscriptMarkdown({
    activeTopicName: 'Frontend Architecture',
    domainStream: 'tech',
    teacherName: 'Mr. Rohan',
    evaluationResult: {
      verdict: 'Hire',
      score: 85,
      summary: 'Solid performance.',
      radar: { logic: 80, systems: 85, comms: 85, solving: 85, star: 80 }
    },
    eyeContactScore: 80,
    wpmScore: 125,
    fillerWordCount: 1,
    codeContent: '',
    selectedLang: 'python',
    messages: []
  });

  assert.match(mdDefault, /- \*\*Tab Switches \/ Pauses:\*\* 0/);
});

test('Block 58: formatHistorySessionMarkdown renders tab pauses in past session exports', () => {
  const session: InterviewSessionRecord = {
    id: 'test-session-123',
    date: 'Oct 12, 2026',
    timestamp: '2026-10-12T10:00:00.000Z',
    type: 'Tech: Cloud Infrastructure',
    domainStream: 'tech',
    domainSubTopic: 'Cloud Infrastructure',
    difficulty: 'hard',
    verdict: 'Strong Hire',
    score: 95,
    radar: { logic: 95, systems: 95, comms: 90, solving: 95, star: 90 },
    telemetry: {
      eyeContact: 92,
      wpm: 130,
      fillerWords: 1,
      tabSwitches: 3
    },
    messages: [
      { role: 'assistant', content: 'How do you structure VPC peering?' },
      { role: 'user', content: 'I isolate CIDR blocks and route via transit gateways.' }
    ],
    summary: 'Masterful systems architecture breakdown.',
    strengths: ['Network partitioning', 'Zero-trust egress'],
    improvements: 'Continue practicing fast telemetry responses.'
  };

  const md = formatHistorySessionMarkdown(session);
  assert.match(md, /## Delivery Diagnostics/);
  assert.match(md, /- \*\*Tab Pauses:\*\* 3/);
  assert.match(md, /- \*\*Eye Contact:\*\* 92%/);
  assert.match(md, /- \*\*Speaking Pace:\*\* 130 WPM/);
});

test('Block 58: ActiveInterviewDraft supports tabSwitchCount preservation', () => {
  const draft: ActiveInterviewDraft = {
    activeTopicName: 'System Architecture',
    domainStream: 'tech',
    activeStage: 'round2_coding',
    difficulty: 'normal',
    starStep: 1,
    messages: [{ role: 'user', content: 'Working on algorithm.' }],
    codeContent: 'def solve(): pass',
    selectedLang: 'python',
    elapsedSeconds: 420,
    fillerWordCount: 3,
    activeTeacherId: 'rohan',
    tabSwitchCount: 2,
    timestamp: Date.now()
  };

  assert.equal(draft.tabSwitchCount, 2);
  const serialized = JSON.stringify(draft);
  const deserialized: ActiveInterviewDraft = JSON.parse(serialized);
  assert.equal(deserialized.tabSwitchCount, 2);
});
