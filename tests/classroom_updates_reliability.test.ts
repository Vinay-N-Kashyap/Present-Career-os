import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { LessonNavigationBar } from '@/app/quests/lesson/components/LessonNavigationBar';
import { TeacherAvatarFrame } from '@/app/quests/lesson/components/TeacherAvatarFrame';
import { refillVisualFromTrace } from '@/app/quests/lesson/hooks/useLessonEngine';
import type { LessonVisual } from '@/lib/types/lessonVisual';

describe('Classroom Navigation, Avatar, and Code Execution Reliability Suite', () => {
  it('groups Previous Slide, Next Slide, and Interactive Q&A buttons together in the center', () => {
    const html = renderToString(
      React.createElement(LessonNavigationBar, {
        currentSlide: 1,
        handlePrevSlide: () => {},
        handleNextSlide: () => {},
        stopSpeaking: () => {},
        setIsPlaying: () => {},
        isInteractive: false,
        setIsInteractive: () => {},
        teacher: { name: 'Kashyap Sir', avatar: '👩‍🎨', accent: 'var(--accent)', role: 'Staff Systems Architect' },
        isLastSlide: false,
        examPassed: false,
        finishLessonAndReturn: () => {},
        slidesLength: 6,
        understandingConfirmed: { 0: true },
      })
    );

    // Verify all 3 primary buttons are present
    assert.match(html, /data-testid="btn-prev-slide"/);
    assert.match(html, /data-testid="btn-next-slide"/);
    assert.match(html, /data-testid="btn-qa-toggle"/);

    // Verify ordering: btn-prev-slide precedes btn-next-slide, which precedes btn-qa-toggle
    const prevIdx = html.indexOf('data-testid="btn-prev-slide"');
    const nextIdx = html.indexOf('data-testid="btn-next-slide"');
    const qaIdx = html.indexOf('data-testid="btn-qa-toggle"');
    assert.ok(prevIdx !== -1 && nextIdx !== -1 && qaIdx !== -1);
    assert.ok(prevIdx < nextIdx, 'Previous button must appear before Next button in center');
    assert.ok(nextIdx < qaIdx, 'Next button must appear before QA toggle button in center');

    // Verify progress checks pill is also present
    assert.match(html, /data-testid="lesson-check-progress-pill"/);
  });

  it('renders dedicated TeacherAvatarFrame with animated AvatarDisplay portrait and role', () => {
    const html = renderToString(
      React.createElement(TeacherAvatarFrame, {
        userId: 'test-user',
        teacherId: 'kashyap',
        teacher: { name: 'Kashyap Sir', avatar: '👩‍🎨', accent: '#3b82f6', role: 'Staff Systems Architect' },
        isPlaying: true,
        speechText: 'Welcome to your first Python lecture.',
        questData: null,
      })
    );

    assert.match(html, /data-testid="teacher-avatar-dock"/);
    assert.match(html, /data-testid="teacher-avatar-name"/);
    assert.match(html, /Kashyap Sir/);
    assert.match(html, /data-speech-active="true"/);
    // Verify SVG avatar portrait is rendered inside
    assert.match(html, /<svg/);
  });

  it('refillVisualFromTrace returns default visual cleanly without fallback error for flow template', () => {
    const mockFlowVisual: LessonVisual = {
      template: 'flow',
      title: 'Instructions Pipeline',
      nodes: [
        { id: 'instructions', label: 'Instructions' },
        { id: 'python', label: 'Python' },
        { id: 'screen', label: 'Screen' },
      ],
      steps: [
        {
          at: 'say1',
          caption: 'You write exact instructions for the computer.',
          values: { instructions: 'print("Hi")', python: '', screen: '' },
          tones: { instructions: 'data', python: 'idle', screen: 'idle' },
          arrows: [],
        },
      ],
    };

    const mockSpec = {
      template: 'flow',
      title: 'Instructions Pipeline',
      nodes: mockFlowVisual.nodes,
      steps: mockFlowVisual.steps,
    };

    // Trace events without "instructions" variable (conceptual flow)
    const traceEvents: Array<[number, number, Record<string, unknown>]> = [
      [1, 1, { x: 42 }],
    ];

    const result = refillVisualFromTrace(mockSpec, mockFlowVisual, traceEvents, 'Hi\n');
    assert.equal(result.fallbackNote, null, 'Flow template should never show variable mismatch fallback note');
    assert.equal(result.visual.template, 'flow');
  });
});
