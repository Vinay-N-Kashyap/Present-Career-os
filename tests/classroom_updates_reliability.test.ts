import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { LessonNavigationBar } from '@/app/quests/lesson/components/LessonNavigationBar';
import { TeacherVRoidPanel } from '@/app/quests/lesson/components/TeacherVRoidPanel';
import { refillVisualFromTrace } from '@/app/quests/lesson/hooks/useLessonEngine';
import type { LessonVisual } from '@/lib/types/lessonVisual';

describe('Classroom Navigation, Avatar, and Code Execution Reliability Suite', () => {
  it('groups Previous Slide, Next Slide, and Interactive Q&A in center, and removes cartoon avatar from bottom-left', () => {
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
        questData: { title: 'Day 1: Your First Python Program' }
      })
    );

    // Verify cartoon avatar is NOT present in bottom-left
    assert.doesNotMatch(html, /data-testid="teacher-avatar-dock"/, 'Cartoon avatar dock must be removed from bottom-left');

    // Verify clean classroom topic pill is rendered on the left
    assert.match(html, /data-testid="classroom-topic-pill"/);
    assert.match(html, /Day 1: Your First Python Program/);

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

  it('renders dedicated 3D VRoid Teacher Panel docked in bottom-right corner (~10% screen)', () => {
    const html = renderToString(
      React.createElement(TeacherVRoidPanel, {
        teacherId: 'kashyap',
        teacherName: 'Kashyap Sir',
        teacherRole: 'Staff Systems Architect',
        teacherAccent: '#3b82f6',
        isPlaying: true,
        isFullscreen: false,
      })
    );

    // Verify panel elements
    assert.match(html, /data-testid="teacher-vroid-panel"/);
    assert.match(html, /data-testid="vroid-teacher-name"/);
    assert.match(html, /Kashyap Sir/);
    assert.match(html, /data-testid="vroid-teacher-status"/);
    assert.match(html, /data-testid="vroid-teacher-role"/);
    assert.match(html, /Staff Systems Architect/);
    assert.match(html, /data-testid="vroid-avatar-viewport"/);
    assert.match(html, /data-testid="btn-toggle-vroid-panel"/);
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
          activeIds: ['instructions'],
        },
      ],
    };

    const refilled = refillVisualFromTrace(
      mockFlowVisual,
      mockFlowVisual,
      [],
      'Hi'
    );

    assert.equal(refilled.visual.template, 'flow');
    assert.equal(refilled.fallbackNote, null, 'Flow template visual must not carry fallback error notice');
    assert.equal(refilled.visual.nodes?.length, 3);
  });
});
