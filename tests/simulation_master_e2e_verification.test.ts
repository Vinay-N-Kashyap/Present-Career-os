import test from 'node:test';
import assert from 'node:assert/strict';

import {
  setSoundscapeDucking,
  getUserSoundscapeVolume,
  setUserSoundscapeVolume
} from '../src/lib/audio/soundscapes';
import {
  getAvatarVoiceVolume,
  setAvatarVoiceVolume
} from '../src/lib/audio/streamingAudioQueue';
import { computeDeterministicEvaluation } from '../src/app/interview/interviewEvaluator';
import {
  acquireGdTurnLock,
  releaseGdTurnLock,
  createInitialGdTurnLock,
  resolveGdHostId,
  GD_MAX_SPEAK_MS
} from '../src/lib/group-discussion/gdTurnEngine';
import { resolveInternshipState } from '../src/app/quests/components/internship/useInternshipData';
import { newInternshipCertificateId } from '../src/lib/certificates/internshipCertificate';

// Minimal localStorage and window shim for Node.js test environment
const mockStorage: Record<string, string> = {};
if (typeof (global as any).window === 'undefined') {
  (global as any).window = {};
}
(global as any).window.dispatchEvent = () => true;
(global as any).window.CustomEvent = class CustomEvent {};
(global as any).window.localStorage = {
  getItem: (k: string) => mockStorage[k] ?? null,
  setItem: (k: string, v: string) => { mockStorage[k] = String(v); },
  removeItem: (k: string) => { delete mockStorage[k]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};
(global as any).localStorage = (global as any).window.localStorage;

test('Simulation E2E: Soundscape ducking and avatar voice volume controls', () => {
  setUserSoundscapeVolume(60);
  assert.equal(getUserSoundscapeVolume(), 60);

  // setSoundscapeDucking should execute cleanly without audio context exceptions
  setSoundscapeDucking(true);
  setSoundscapeDucking(false);

  // Avatar voice volume bounds clamping
  setAvatarVoiceVolume(0.8);
  assert.equal(getAvatarVoiceVolume(), 0.8);
  setAvatarVoiceVolume(1.5);
  assert.equal(getAvatarVoiceVolume(), 1.0);
  setAvatarVoiceVolume(-0.5);
  assert.equal(getAvatarVoiceVolume(), 0.0);
});

test('Simulation E2E: STAR Evaluator zero telemetry penalty & specialized domain badges', () => {
  // Session with heavy filler words (20) and tab switches (5)
  const evalWithTelemetry = computeDeterministicEvaluation({
    messages: [
      { role: 'user', content: 'We built a high-throughput microservices architecture with Redis caching.' },
      { role: 'assistant', content: 'How did you handle cache invalidation?' },
      { role: 'user', content: 'We used event-driven cache invalidation using RabbitMQ consumer groups.' }
    ],
    codeSubmitted: true,
    latestTopology: { nodes: [{ id: 'n1', type: 'service' }, { id: 'n2', type: 'redis' }] },
    starStep: 3,
    fillerWordCount: 20,
    eyeContactScore: 72,
    wpmScore: 125,
    activeTopicName: 'Low-Latency C++ & Order Book',
    domainStream: 'tech',
    archetype: 'Pattern Hunter',
    tabSwitchCount: 5
  });

  // Identical session with zero filler words and zero tab switches
  const evalClean = computeDeterministicEvaluation({
    messages: [
      { role: 'user', content: 'We built a high-throughput microservices architecture with Redis caching.' },
      { role: 'assistant', content: 'How did you handle cache invalidation?' },
      { role: 'user', content: 'We used event-driven cache invalidation using RabbitMQ consumer groups.' }
    ],
    codeSubmitted: true,
    latestTopology: { nodes: [{ id: 'n1', type: 'service' }, { id: 'n2', type: 'redis' }] },
    starStep: 3,
    fillerWordCount: 0,
    eyeContactScore: 72,
    wpmScore: 125,
    activeTopicName: 'Low-Latency C++ & Order Book',
    domainStream: 'tech',
    archetype: 'Pattern Hunter',
    tabSwitchCount: 0
  });

  // Golden Rule 3: comms score must be identical regardless of filler word telemetry
  assert.equal(evalWithTelemetry.radar.comms, evalClean.radar.comms, 'Comms score must not be penalized by filler words');
  assert.equal(evalWithTelemetry.score, evalClean.score, 'Overall score must match');

  // Specialized badge checks
  assert.equal(evalWithTelemetry.perRoundScores.round2.badge, 'Low-Latency C++ Engine');
  assert.equal(evalWithTelemetry.perRoundScores.round3.badge, 'LMAX / Exchange Topology');
});

test('Simulation E2E: Group Discussion turn lock collision prevention and deadlock expiry', () => {
  let lock = createInitialGdTurnLock();
  assert.equal(lock.isSpeaking, false);

  const t0 = 100000;
  // Speaker A acquires lock
  const resA = acquireGdTurnLock(lock, 'aisha', t0);
  assert.equal(resA.acquired, true);
  assert.equal(resA.state.activeSpeaker, 'aisha');
  assert.equal(resA.state.isSpeaking, true);
  lock = resA.state;

  // Speaker B attempts to interrupt while A is speaking -> REJECTED
  const resB = acquireGdTurnLock(lock, 'rohan', t0 + 2000);
  assert.equal(resB.acquired, false, 'Simultaneous speaker must be blocked from interrupting');
  assert.equal(resB.state.activeSpeaker, 'aisha');

  // After GD_MAX_SPEAK_MS (14s), auto-expiry permits new speaker to acquire lock without deadlock
  const resBExpired = acquireGdTurnLock(lock, 'rohan', t0 + GD_MAX_SPEAK_MS + 100);
  assert.equal(resBExpired.acquired, true, 'Lock must auto-expire after max duration to prevent deadlocks');
  assert.equal(resBExpired.state.activeSpeaker, 'rohan');

  // Clean release
  lock = releaseGdTurnLock(resBExpired.state);
  assert.equal(lock.isSpeaking, false);
  assert.equal(lock.activeSpeaker, null);

  // Host resolution parity
  assert.equal(resolveGdHostId('priya'), 'anish');
  assert.equal(resolveGdHostId('anish'), 'priya');
});

test('Simulation E2E: Virtual Internship desk eligibility and tamper-proof certificate generation', () => {
  // Capstone completed on python_ai track
  const stateApproved = resolveInternshipState(false, null, {
    enrollmentId: 'crash-enr-101',
    userId: 'u-1',
    courseId: 'python-ai',
    track: 'python_ai',
    tier: '3m_full',
    status: 'active',
    enrolledAt: '2026-01-01',
    currentWeek: 4,
    currentDay: 28,
    progressPercentage: 100,
    dailyProgress: {},
    milestoneProgress: {
      sprint1Approved: true,
      sprint2Approved: true,
      sprint3RepoUrl: 'https://github.com/test/repo',
      sprint4DefenseScore: 85
    },
    weeklyMilestones: [],
    certificatesIssued: { capstone: true }
  });

  assert.equal(stateApproved.state, 'ready_to_start', 'Completed capstone must qualify for ready_to_start');

  // Incomplete capstone
  const stateIncomplete = resolveInternshipState(false, null, {
    enrollmentId: 'crash-enr-102',
    userId: 'u-2',
    courseId: 'python-ai',
    track: 'python_ai',
    tier: '3m_full',
    status: 'active',
    enrolledAt: '2026-01-01',
    currentWeek: 2,
    currentDay: 14,
    progressPercentage: 50,
    dailyProgress: {},
    milestoneProgress: {},
    weeklyMilestones: [],
    certificatesIssued: {}
  });

  assert.equal(stateIncomplete.state, 'not_eligible');
  assert.match(stateIncomplete.reason, /Capstone Project Desk must be completed/);

  // Tamper-proof certificate format
  const certId = newInternshipCertificateId();
  assert.match(certId, /^PIN-IN-[A-F0-9]{12}$/);
});
