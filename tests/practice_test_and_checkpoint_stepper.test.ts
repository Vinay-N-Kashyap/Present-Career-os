import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PracticeTestQuizRunner, { getQuestions } from '../src/app/quests/components/PracticeTestQuizRunner';
import { PracticeTestReportModal } from '../src/app/quests/components/PracticeTestReportModal';
import { VerticalCheckpointStepper } from '../src/app/quests/components/VerticalCheckpointStepper';
import { InternshipTimelineTracker } from '../src/app/quests/components/InternshipTimelineTracker';

test('getQuestions returns 12 well-formed questions with 4 options and 1 correct answer for both tracks', () => {
  for (const track of ['web_fullstack', 'python_ai'] as const) {
    const questions = getQuestions(track);
    assert.equal(questions.length, 12, `Expected 12 questions for ${track}`);
    for (const q of questions) {
      assert.ok(q.id && q.topic && q.question, `Missing fields on question ${q.id}`);
      assert.equal(q.options.length, 4, `Expected 4 options on question ${q.id}`);
      const correctCount = q.options.filter(o => o.isCorrect).length;
      assert.equal(correctCount, 1, `Expected 1 correct option on question ${q.id}`);
    }
  }
});

test('PracticeTestQuizRunner and PracticeTestReportModal render deterministic testids', () => {
  const runnerHtml = renderToStaticMarkup(
    React.createElement(PracticeTestQuizRunner, {
      testTitle: 'Weekly Milestone Diagnostic Assessment',
      track: 'python_ai',
      planTier: '6m',
      onClose: () => {},
      onCompleteTest: () => {},
    })
  );

  assert.ok(runnerHtml.includes('data-testid="practice-test-runner"'));
  assert.ok(runnerHtml.includes('data-testid="practice-test-timer"'));
  assert.ok(runnerHtml.includes('data-testid="practice-test-progress-bar"'));
  assert.ok(runnerHtml.includes('data-testid="practice-test-question-card"'));
  assert.ok(runnerHtml.includes('data-testid="practice-test-option-p1a"'));
  assert.ok(runnerHtml.includes('data-testid="practice-test-nav-pill-0"'));
  assert.ok(runnerHtml.includes('data-testid="btn-practice-prev"'));
  assert.ok(runnerHtml.includes('data-testid="btn-practice-next"'));

  const reportHtml = renderToStaticMarkup(
    React.createElement(PracticeTestReportModal, {
      isOpen: true,
      onClose: () => {},
      testTitle: 'Weekly Milestone Diagnostic Assessment',
      result: {
        score: 10,
        totalQuestions: 12,
        accuracyPercent: 83,
        timeTakenSeconds: 410,
        topicBreakdown: { AsyncIO: { correct: 3, total: 3 }, DSA: { correct: 3, total: 4 } },
        skillGaps: ['DB (1/3)'],
      },
    })
  );

  assert.ok(reportHtml.includes('data-testid="practice-report-modal"'));
  assert.ok(reportHtml.includes('data-testid="practice-report-close"'));
  assert.ok(reportHtml.includes('data-testid="practice-report-score"'));
  assert.ok(reportHtml.includes('10 / 12'));
  assert.ok(reportHtml.includes('data-testid="practice-report-accuracy"'));
  assert.ok(reportHtml.includes('83%'));
  assert.ok(reportHtml.includes('data-testid="practice-report-time"'));
  assert.ok(reportHtml.includes('data-testid="practice-report-readiness"'));
  assert.ok(reportHtml.includes('Placement Ready'));
  assert.ok(reportHtml.includes('data-testid="practice-report-skill-gaps"'));
  assert.ok(reportHtml.includes('data-testid="btn-practice-report-continue"'));
});

test('VerticalCheckpointStepper and InternshipTimelineTracker render deterministic milestone testids', () => {
  const stepperHtml = renderToStaticMarkup(
    React.createElement(VerticalCheckpointStepper, {
      planId: 'plan-6m-pro',
      activeTrack: 'web_fullstack',
      progress: {
        completed: 15,
        total: 30,
        percent: 50,
        next: { id: 'react-d2-l1', title: 'React Hooks', courseId: 'course-react' } as any,
        phases: {
          training: 'active',
          capstone: 'locked',
          internship: 'locked',
          graduation: 'locked',
        },
      },
      onOpenPracticeTest: () => {},
      onOpenCapstoneDesk: () => {},
      onOpenQrModal: () => {},
      onOpenPreviewCredentials: () => {},
    })
  );

  assert.ok(stepperHtml.includes('data-testid="vertical-checkpoint-stepper"'));
  assert.ok(stepperHtml.includes('data-testid="checkpoint-step-training"'));
  assert.ok(stepperHtml.includes('data-testid="checkpoint-node-training"'));
  assert.ok(stepperHtml.includes('data-testid="checkpoint-status-training"'));
  assert.ok(stepperHtml.includes('data-testid="btn-checkpoint-primary-training"'));
  assert.ok(stepperHtml.includes('data-testid="btn-checkpoint-secondary-training"'));
  assert.ok(stepperHtml.includes('data-testid="checkpoint-step-capstone"'));
  assert.ok(stepperHtml.includes('data-testid="checkpoint-step-graduation"'));

  const timelineHtml = renderToStaticMarkup(
    React.createElement(InternshipTimelineTracker, {
      planId: 'plan-3m-accelerator',
      completedQuestsCount: 18,
      onOpenPracticeTest: () => {},
    })
  );

  assert.ok(timelineHtml.includes('data-testid="internship-timeline-tracker"'));
  assert.ok(timelineHtml.includes('data-testid="timeline-current-status"'));
  assert.ok(timelineHtml.includes('data-testid="timeline-phase-1"'));
  assert.ok(timelineHtml.includes('data-testid="btn-timeline-practice-test"'));
  assert.ok(timelineHtml.includes('data-testid="timeline-phase-2"'));
  assert.ok(timelineHtml.includes('data-testid="timeline-phase-3"'));
  assert.ok(timelineHtml.includes('data-testid="timeline-phase-4"'));
});
