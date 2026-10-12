import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { InterviewSessionHeader } from '../src/app/interview/components/InterviewSessionHeader';
import { InterviewVoiceHud } from '../src/app/interview/components/InterviewVoiceHud';
import type { AvatarTeacher } from '../src/app/interview/interviewTypes';

const mockTeacher: AvatarTeacher = {
  id: 'sarah_tech',
  name: 'Sarah Chen',
  title: 'Principal Systems Architect',
  emoji: '👩‍💻',
  systemPrompt: 'You are an interviewer.'
};

test('InterviewSessionHeader: renders track badge and synchronized voice telemetry', () => {
  // Test 1: Active voice listening with track badge
  const htmlListening = renderToStaticMarkup(
    React.createElement(InterviewSessionHeader, {
      activeTeacher: mockTeacher,
      activeTopicName: 'High-Throughput Distributed Systems',
      activeStage: 'round2_coding',
      domainStream: 'tech',
      domainSubTopic: 'distributed_systems',
      isVoiceListening: true,
      isAvatarSpeaking: false,
      elapsedSeconds: 145,
      formatElapsed: (s: number) => `${Math.floor(s / 60)}:${s % 60}`,
      isScoredStage: true,
      isAssistModeActive: false,
      setIsAssistModeActive: () => {},
      messages: [],
      fetchAssistScript: () => {},
      avatarVolume: 80,
      handleVolumeChange: () => {},
      showCameraPreview: false,
      toggleCameraPreview: () => {},
      interruptSpeech: () => {},
      exitInterview: () => {}
    })
  );

  assert.ok(htmlListening.includes('Sarah Chen'), 'Must display interviewer name');
  assert.ok(htmlListening.includes('🎯 distributed systems'), 'Must render track badge chip');
  assert.ok(htmlListening.includes('🎙️ Mic Live'), 'Must display live microphone telemetry badge');
  assert.ok(htmlListening.includes('Round 2 of 4 · Challenge'), 'Must identify active round');

  // Test 2: Avatar speaking state
  const htmlSpeaking = renderToStaticMarkup(
    React.createElement(InterviewSessionHeader, {
      activeTeacher: mockTeacher,
      activeTopicName: 'Quantitative Order Book',
      activeStage: 'round3_systems',
      domainStream: 'tech',
      domainSubTopic: 'quant_systems',
      isVoiceListening: false,
      isAvatarSpeaking: true,
      elapsedSeconds: 320,
      formatElapsed: (s: number) => `${Math.floor(s / 60)}:${s % 60}`,
      isScoredStage: true,
      isAssistModeActive: false,
      setIsAssistModeActive: () => {},
      messages: [],
      fetchAssistScript: () => {},
      avatarVolume: 80,
      handleVolumeChange: () => {},
      showCameraPreview: false,
      toggleCameraPreview: () => {},
      interruptSpeech: () => {},
      exitInterview: () => {}
    })
  );

  assert.ok(htmlSpeaking.includes('🗣️ Speaking'), 'Must display speaking status badge');
  assert.ok(htmlSpeaking.includes('✋ Interrupt &amp; Speak') || htmlSpeaking.includes('Interrupt'), 'Must offer speech interrupt button');
  assert.ok(htmlSpeaking.includes('🎯 quant systems'), 'Must render quant track badge');

  // Test 3: Standby state
  const htmlStandby = renderToStaticMarkup(
    React.createElement(InterviewSessionHeader, {
      activeTeacher: mockTeacher,
      activeTopicName: 'Statutory Audit & Tax',
      activeStage: 'round1_behavioral',
      domainStream: 'non_tech',
      domainSubTopic: 'accounting_audit',
      isVoiceListening: false,
      isAvatarSpeaking: false,
      elapsedSeconds: 45,
      formatElapsed: (s: number) => `${Math.floor(s / 60)}:${s % 60}`,
      isScoredStage: true,
      isAssistModeActive: false,
      setIsAssistModeActive: () => {},
      messages: [],
      fetchAssistScript: () => {},
      avatarVolume: 80,
      handleVolumeChange: () => {},
      showCameraPreview: false,
      toggleCameraPreview: () => {},
      interruptSpeech: () => {},
      exitInterview: () => {}
    })
  );

  assert.ok(htmlStandby.includes('💤 Mic Standby'), 'Must display standby status badge');
  assert.ok(htmlStandby.includes('🎯 accounting audit'), 'Must format non-tech track badge');
});

test('InterviewVoiceHud: telemetry states match header telemetry invariants', () => {
  // Listening state
  const htmlHudListening = renderToStaticMarkup(
    React.createElement(InterviewVoiceHud, {
      isVoiceListening: true,
      isAvatarSpeaking: false,
      isSendingInterviewerReply: false,
      activeTeacher: mockTeacher,
      liveSpeechTranscript: '',
      stopVoiceListening: () => {},
      startVoiceListening: () => {},
      isSpeechSupported: true
    })
  );
  assert.ok(htmlHudListening.includes('SPOKEN VOICE RECOGNITION ACTIVE'), 'HUD must report active recognition');
  assert.ok(htmlHudListening.includes('🎙️ Listening...'), 'HUD button must indicate listening');

  // Speaking state
  const htmlHudSpeaking = renderToStaticMarkup(
    React.createElement(InterviewVoiceHud, {
      isVoiceListening: false,
      isAvatarSpeaking: true,
      isSendingInterviewerReply: false,
      activeTeacher: mockTeacher,
      liveSpeechTranscript: '',
      stopVoiceListening: () => {},
      startVoiceListening: () => {},
      isSpeechSupported: true
    })
  );
  assert.ok(htmlHudSpeaking.includes('Sarah Chen is Speaking...'), 'HUD must announce teacher is speaking');

  // Standby state
  const htmlHudStandby = renderToStaticMarkup(
    React.createElement(InterviewVoiceHud, {
      isVoiceListening: false,
      isAvatarSpeaking: false,
      isSendingInterviewerReply: false,
      activeTeacher: mockTeacher,
      liveSpeechTranscript: '',
      stopVoiceListening: () => {},
      startVoiceListening: () => {},
      isSpeechSupported: true
    })
  );
  assert.ok(htmlHudStandby.includes('Voice Mode Standby'), 'HUD must report standby mode');
});
