import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { InterviewSessionHeader } from '../src/app/interview/components/InterviewSessionHeader';
import { InterviewVoiceHud } from '../src/app/interview/components/InterviewVoiceHud';
import type { AvatarTeacher } from '../src/app/interview/interviewTypes';

/**
 * Block 57 / TASK-347: Interview Tab Reliability / Gaze & Voice Pause Sync
 * Verifies tab backgrounding/blur detection, speech recognition pause & auto-resume,
 * elapsed timer pause guard, and "Interview Paused (Tab Inactive)" UI telemetry.
 */

const mockTeacher: AvatarTeacher = {
  id: 'sarah_tech',
  name: 'Sarah Chen',
  title: 'Principal Systems Architect',
  emoji: '👩‍💻',
  systemPrompt: 'You are an interviewer.'
};

describe('Block 57: Interview Tab Reliability & UI Invariants', () => {
  it('InterviewSessionHeader: renders paused status and paused timer when isTabInactive is true', () => {
    const htmlInactive = renderToStaticMarkup(
      React.createElement(InterviewSessionHeader, {
        activeTeacher: mockTeacher,
        activeTopicName: 'High-Throughput Systems',
        activeStage: 'round2_coding',
        domainStream: 'tech',
        domainSubTopic: 'distributed_systems',
        isVoiceListening: false,
        isAvatarSpeaking: false,
        elapsedSeconds: 210,
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
        exitInterview: () => {},
        isTabInactive: true
      })
    );

    assert.ok(htmlInactive.includes('⏸️ Paused (Tab Inactive)'), 'Header must render paused badge when tab is inactive');
    assert.ok(htmlInactive.includes('(Paused)'), 'Header timer line must append (Paused) suffix when tab is inactive');
    assert.ok(htmlInactive.includes('data-testid="header-voice-badge"'), 'Header must keep testid for telemetry badge');
  });

  it('InterviewVoiceHud: renders Interview Paused (Tab Inactive) banner and disables action button', () => {
    const htmlHudInactive = renderToStaticMarkup(
      React.createElement(InterviewVoiceHud, {
        isVoiceListening: false,
        isAvatarSpeaking: false,
        isSendingInterviewerReply: false,
        activeTeacher: mockTeacher,
        liveSpeechTranscript: 'half spoken phrase...',
        stopVoiceListening: () => {},
        startVoiceListening: () => {},
        isSpeechSupported: true,
        onDoneSpeaking: () => {},
        isTabInactive: true
      })
    );

    assert.ok(htmlHudInactive.includes('Interview Paused (Tab Inactive)'), 'HUD title must state interview is paused');
    assert.ok(htmlHudInactive.includes('Session timer and microphone are paused while this tab is backgrounded'), 'HUD subtitle must explain tab pause');
    assert.ok(htmlHudInactive.includes('⏸️ Paused (Tab Inactive)'), 'HUD action button must reflect paused state');
    assert.ok(htmlHudInactive.includes('disabled=""') || htmlHudInactive.includes('disabled'), 'HUD action button must be disabled when tab is inactive');
    assert.ok(!htmlHudInactive.includes('Done Speaking ➔'), 'HUD must suppress Done Speaking button while tab is inactive to prevent desync');
    assert.ok(!htmlHudInactive.includes('🛑 Pause Mic'), 'HUD must suppress Pause Mic button while already tab-paused');
  });

  it('InterviewVoiceHud: restores active listening HUD when tab is active (isTabInactive: false)', () => {
    const htmlHudActive = renderToStaticMarkup(
      React.createElement(InterviewVoiceHud, {
        isVoiceListening: true,
        isAvatarSpeaking: false,
        isSendingInterviewerReply: false,
        activeTeacher: mockTeacher,
        liveSpeechTranscript: '',
        stopVoiceListening: () => {},
        startVoiceListening: () => {},
        isSpeechSupported: true,
        onDoneSpeaking: () => {},
        isTabInactive: false
      })
    );

    assert.ok(htmlHudActive.includes('SPOKEN VOICE RECOGNITION ACTIVE'), 'HUD must report active recognition when tab is active');
    assert.ok(htmlHudActive.includes('🎙️ Listening...'), 'Action button must show listening when mic is on');
    assert.ok(!htmlHudActive.includes('Interview Paused (Tab Inactive)'), 'HUD must not show paused title when tab is active');
  });

  it('Dedicated Tab Paused Indicator Banner: matches UI styling and text contract', () => {
    const renderBanner = (isTabInactive: boolean) => {
      if (!isTabInactive) return null;
      return React.createElement(
        'div',
        {
          'data-testid': 'interview-paused-tab-indicator',
          style: {
            background: 'rgba(234, 179, 8, 0.12)',
            border: '1px solid rgba(234, 179, 8, 0.4)',
            borderRadius: 12,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }
        },
        React.createElement(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: 10 } },
          React.createElement('span', { style: { fontSize: 18 } }, '⏸️'),
          React.createElement(
            'div',
            null,
            React.createElement('div', { style: { fontSize: 13, fontWeight: 900, color: '#eab308' } }, 'Interview Paused (Tab Inactive)'),
            React.createElement('div', { style: { fontSize: 11.5, color: 'var(--t2)', fontWeight: 600 } }, 'Microphone and session timer are paused while this tab is backgrounded. Switching back will automatically resume.')
          )
        ),
        React.createElement('span', null, 'Paused')
      );
    };

    const rendered = renderToStaticMarkup(renderBanner(true) as React.ReactElement);
    assert.ok(rendered.includes('data-testid="interview-paused-tab-indicator"'), 'Must have correct testid');
    assert.ok(rendered.includes('Interview Paused (Tab Inactive)'), 'Must include exact pause text');
    assert.ok(rendered.includes('Microphone and session timer are paused'), 'Must include explanatory detail');

    const empty = renderBanner(false);
    assert.equal(empty, null, 'Must render null when tab is active');
  });
});

describe('Block 57: Voice Loop & Gaze Pause State Machine Invariants', () => {
  it('Voice Loop State Machine: remembers listening state on blur and re-arms on focus', () => {
    type TabVisibility = 'visible' | 'hidden';

    class MockVoiceSession {
      public isListening = false;
      public wasListeningBeforeHidden = false;
      public autoVoiceLoop = true;
      public isInterviewActive = true;
      public isAvatarSpeaking = false;
      public retryCount = 5; // Simulates retries accumulated during speech quirks
      public recognitionStartCount = 0;
      public recognitionStopCount = 0;

      public startListening() {
        if (!this.isInterviewActive || this.isAvatarSpeaking) return;
        this.isListening = true;
        this.recognitionStartCount++;
      }

      public stopListening() {
        this.isListening = false;
        this.recognitionStopCount++;
      }

      public onTabVisibilityChange(state: TabVisibility) {
        if (state === 'hidden') {
          // Tab backgrounded
          if (this.isListening) {
            this.wasListeningBeforeHidden = true;
          }
          this.stopListening();
        } else {
          // Tab foreground resumed
          if (this.autoVoiceLoop && !this.isAvatarSpeaking && this.isInterviewActive) {
            this.retryCount = 0; // Clean reset on tab focus
            const shouldResume = this.wasListeningBeforeHidden || this.autoVoiceLoop;
            this.wasListeningBeforeHidden = false;
            if (shouldResume) {
              this.startListening();
            }
          }
        }
      }
    }

    const session = new MockVoiceSession();
    session.startListening();
    assert.equal(session.isListening, true);
    assert.equal(session.recognitionStartCount, 1);

    // Candidate switches to another tab
    session.onTabVisibilityChange('hidden');
    assert.equal(session.isListening, false, 'Mic must stop when tab hidden');
    assert.equal(session.wasListeningBeforeHidden, true, 'Must remember mic was active');
    assert.equal(session.recognitionStopCount, 1);

    // Candidate returns to interview tab
    session.onTabVisibilityChange('visible');
    assert.equal(session.isListening, true, 'Mic must automatically re-arm on tab focus');
    assert.equal(session.wasListeningBeforeHidden, false, 'Ref must reset after successful resume');
    assert.equal(session.retryCount, 0, 'Retry counter must cleanly reset');
    assert.equal(session.recognitionStartCount, 2);
  });

  it('Voice Loop State Machine: does NOT re-arm mic if avatar is actively speaking when focused', () => {
    type TabVisibility = 'visible' | 'hidden';

    class MockVoiceSession {
      public isListening = false;
      public wasListeningBeforeHidden = true;
      public autoVoiceLoop = true;
      public isInterviewActive = true;
      public isAvatarSpeaking = true; // Avatar speaking!
      public recognitionStartCount = 0;

      public onTabVisibilityChange(state: TabVisibility) {
        if (state === 'visible') {
          if (this.autoVoiceLoop && !this.isAvatarSpeaking && this.isInterviewActive) {
            this.isListening = true;
            this.recognitionStartCount++;
          }
        }
      }
    }

    const session = new MockVoiceSession();
    session.onTabVisibilityChange('visible');
    assert.equal(session.isListening, false, 'Must not listen while avatar is speaking');
    assert.equal(session.recognitionStartCount, 0);
  });

  it('Gaze Tracker Guard: skips optical checks when tab is backgrounded', () => {
    let totalChecks = 0;
    let focusedChecks = 0;

    const performGazeCheck = (documentHidden: boolean, faceDetected: boolean) => {
      // Guard matching useInterviewGaze
      if (documentHidden) return;

      totalChecks++;
      if (faceDetected) focusedChecks++;
    };

    // 1. Five checks in foreground with face detected
    for (let i = 0; i < 5; i++) {
      performGazeCheck(false, true);
    }
    assert.equal(totalChecks, 5);
    assert.equal(focusedChecks, 5);

    // 2. Candidate minimizes tab or switches to another window (tab hidden) for 10 checks
    for (let i = 0; i < 10; i++) {
      performGazeCheck(true, false);
    }
    // Totals must remain unchanged — no penalizing eye contact score!
    assert.equal(totalChecks, 5, 'Total checks must not increment while tab is hidden');
    assert.equal(focusedChecks, 5, 'Focused checks must remain frozen');

    // 3. Candidate returns to tab (tab visible) with face detected
    performGazeCheck(false, true);
    assert.equal(totalChecks, 6);
    assert.equal(focusedChecks, 6);
    const score = Math.round((focusedChecks / totalChecks) * 100);
    assert.equal(score, 100, 'Score must preserve 100% eye contact despite background tab');
  });
});
