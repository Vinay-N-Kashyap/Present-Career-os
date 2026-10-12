import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  calculateLessonProgress,
  isSlideUnlocked,
  evaluateQuizPassing,
} from '../src/app/quests/lesson/hooks/useLessonState';
import {
  LessonQuizBlock,
  getExplanationText,
} from '../src/app/quests/lesson/components/LessonQuizBlock';
import { LessonCompletionModal } from '../src/app/quests/lesson/components/LessonCompletionModal';

describe('Lesson Quiz and State Helpers SSR Suite (Block 54 / TASK-342)', () => {
  test('getExplanationText correctly parses multiple explanation shapes and edge cases', () => {
    // String literal
    assert.equal(getExplanationText('Direct string invariant explanation'), 'Direct string invariant explanation');

    // Object with errorExplanation
    assert.equal(getExplanationText({ errorExplanation: 'High cache contention detected' }), 'High cache contention detected');

    // Object with recoveryPath.simplerExplanation
    assert.equal(
      getExplanationText({ recoveryPath: { simplerExplanation: 'Use O(1) indexed lookups' } }),
      'Use O(1) indexed lookups'
    );

    // Object with recoveryPath.guidedFixPrompt
    assert.equal(
      getExplanationText({ recoveryPath: { guidedFixPrompt: 'Refactor the loop into a hash map' } }),
      'Refactor the loop into a hash map'
    );

    // Object with generic explanation or message
    assert.equal(getExplanationText({ explanation: 'Generic fallback explanation' }), 'Generic fallback explanation');
    assert.equal(getExplanationText({ message: 'Error message description' }), 'Error message description');

    // Null and undefined fallbacks
    assert.equal(getExplanationText(null), '');
    assert.equal(getExplanationText(undefined), '');
  });

  test('calculateLessonProgress clamps percentages cleanly between 0% and 100%', () => {
    assert.equal(calculateLessonProgress(0, 5), 0);
    assert.equal(calculateLessonProgress(1, 5), 20);
    assert.equal(calculateLessonProgress(3, 5), 60);
    assert.equal(calculateLessonProgress(5, 5), 100);
    assert.equal(calculateLessonProgress(6, 5), 100); // Clamped to 100%
    assert.equal(calculateLessonProgress(-1, 5), 0);  // Clamped to 0%
    assert.equal(calculateLessonProgress(2, 0), 0);   // Safe on 0 total slides
  });

  test('isSlideUnlocked evaluates sequential unlocks and concept checks', () => {
    // Slide 0 is always unlocked (intro)
    assert.equal(isSlideUnlocked(0, 0), true);

    // Slide within maxUnlockedSlide
    assert.equal(isSlideUnlocked(2, 3), true);
    assert.equal(isSlideUnlocked(3, 3), true);

    // Slide beyond maxUnlockedSlide but confirmed by concept check
    assert.equal(isSlideUnlocked(4, 2, { 3: true }), true);

    // Slide beyond maxUnlockedSlide and not confirmed
    assert.equal(isSlideUnlocked(4, 2, { 3: false }), false);
    assert.equal(isSlideUnlocked(4, 2, {}), false);
    assert.equal(isSlideUnlocked(4, 2), false);
  });

  test('evaluateQuizPassing computes pass/fail status, percentage, and formatted text', () => {
    const passed = evaluateQuizPassing(4, 5, 0.7);
    assert.equal(passed.passed, true);
    assert.equal(passed.percentage, 80);
    assert.equal(passed.scoreText, '4 / 5 (80%)');

    const exactThreshold = evaluateQuizPassing(7, 10, 0.7);
    assert.equal(exactThreshold.passed, true);
    assert.equal(exactThreshold.percentage, 70);

    const failed = evaluateQuizPassing(3, 5, 0.7);
    assert.equal(failed.passed, false);
    assert.equal(failed.percentage, 60);
    assert.equal(failed.scoreText, '3 / 5 (60%)');

    const emptyQuiz = evaluateQuizPassing(0, 0, 0.7);
    assert.equal(emptyQuiz.passed, false);
  });

  test('LessonQuizBlock renders active question, options, progress bar, and score pill in SSR', () => {
    const html = renderToStaticMarkup(
      React.createElement(LessonQuizBlock, {
        teacherAccent: 'var(--accent)',
        examPassed: false,
        examFailed: false,
        setExamFailed: () => {},
        examCorrectCount: 1,
        setExamCorrectCount: () => {},
        onReviewLesson: () => {},
        examQuestionIndex: 0,
        setExamQuestionIndex: () => {},
        selectedMcqAnswer: null,
        setSelectedMcqAnswer: () => {},
        mcqChecked: false,
        setMcqChecked: () => {},
        mcqIsCorrect: false,
        setMcqIsCorrect: () => {},
        setExamPassed: () => {},
        playChime: () => {},
        launchConfetti: () => {},
        dynamicQuestions: [
          {
            question: 'What is the optimal lookup complexity in an indexed table?',
            options: ['O(N^2)', 'O(1) / O(log N)', 'O(N!)'],
            answerIndex: 1,
            explanation: 'B-Tree indexes provide O(log N) lookup complexity.',
          },
        ],
        questTitle: 'SQL Fundamentals',
      })
    );

    assert.ok(html.includes('data-testid="lesson-quiz-block"'));
    assert.ok(html.includes('data-testid="quiz-score-pill"'));
    assert.ok(html.includes('data-testid="quiz-progress-bar"'));
    assert.ok(html.includes('data-testid="quiz-question-text"'));
    assert.ok(html.includes('What is the optimal lookup complexity in an indexed table?'));
    assert.ok(html.includes('data-testid="mcq-option-0"'));
    assert.ok(html.includes('data-testid="mcq-option-1"'));
    assert.ok(html.includes('data-testid="mcq-option-2"'));
  });

  test('LessonQuizBlock renders passed, failed, explanation, and error states cleanly in SSR', () => {
    // 1. Passed banner
    const passedHtml = renderToStaticMarkup(
      React.createElement(LessonQuizBlock, {
        teacherAccent: 'var(--accent)',
        examPassed: true,
        examFailed: false,
        setExamFailed: () => {},
        examCorrectCount: 3,
        setExamCorrectCount: () => {},
        onReviewLesson: () => {},
        examQuestionIndex: 0,
        setExamQuestionIndex: () => {},
        selectedMcqAnswer: null,
        setSelectedMcqAnswer: () => {},
        mcqChecked: false,
        setMcqChecked: () => {},
        mcqIsCorrect: false,
        setMcqIsCorrect: () => {},
        setExamPassed: () => {},
        playChime: () => {},
        launchConfetti: () => {},
        dynamicQuestions: [{ question: 'Q1', options: ['A', 'B'], answerIndex: 0, explanation: 'OK' }],
        questTitle: 'Test',
      })
    );
    assert.ok(passedHtml.includes('data-testid="quiz-passed-banner"'));
    assert.ok(passedHtml.includes('Passed!'));

    // 2. Failed banner
    const failedHtml = renderToStaticMarkup(
      React.createElement(LessonQuizBlock, {
        teacherAccent: 'var(--accent)',
        examPassed: false,
        examFailed: true,
        setExamFailed: () => {},
        examCorrectCount: 0,
        setExamCorrectCount: () => {},
        onReviewLesson: () => {},
        examQuestionIndex: 0,
        setExamQuestionIndex: () => {},
        selectedMcqAnswer: null,
        setSelectedMcqAnswer: () => {},
        mcqChecked: false,
        setMcqChecked: () => {},
        mcqIsCorrect: false,
        setMcqIsCorrect: () => {},
        setExamPassed: () => {},
        playChime: () => {},
        launchConfetti: () => {},
        dynamicQuestions: [{ question: 'Q1', options: ['A', 'B'], answerIndex: 0, explanation: 'OK' }],
        questTitle: 'Test',
      })
    );
    assert.ok(failedHtml.includes('data-testid="quiz-failed-banner"'));
    assert.ok(failedHtml.includes('data-testid="btn-review-lesson"'));

    // 3. Checked with correct answer
    const correctCheckHtml = renderToStaticMarkup(
      React.createElement(LessonQuizBlock, {
        teacherAccent: 'var(--accent)',
        examPassed: false,
        examFailed: false,
        setExamFailed: () => {},
        examCorrectCount: 1,
        setExamCorrectCount: () => {},
        onReviewLesson: () => {},
        examQuestionIndex: 0,
        setExamQuestionIndex: () => {},
        selectedMcqAnswer: 0,
        setSelectedMcqAnswer: () => {},
        mcqChecked: true,
        mcqIsCorrect: true,
        setMcqIsCorrect: () => {},
        setExamPassed: () => {},
        playChime: () => {},
        launchConfetti: () => {},
        dynamicQuestions: [{ question: 'Q1', options: ['A', 'B'], answerIndex: 0, explanation: 'Verified' }],
        questTitle: 'Test',
      })
    );
    assert.ok(correctCheckHtml.includes('data-testid="quiz-explanation-box"'));
    assert.ok(correctCheckHtml.includes('data-testid="btn-next-question"'));

    // 4. Checked with incorrect answer
    const incorrectCheckHtml = renderToStaticMarkup(
      React.createElement(LessonQuizBlock, {
        teacherAccent: 'var(--accent)',
        examPassed: false,
        examFailed: false,
        setExamFailed: () => {},
        examCorrectCount: 0,
        setExamCorrectCount: () => {},
        onReviewLesson: () => {},
        examQuestionIndex: 0,
        setExamQuestionIndex: () => {},
        selectedMcqAnswer: 1,
        setSelectedMcqAnswer: () => {},
        mcqChecked: true,
        setMcqIsCorrect: false,
        setExamPassed: () => {},
        playChime: () => {},
        launchConfetti: () => {},
        dynamicQuestions: [{ question: 'Q1', options: ['A', 'B'], answerIndex: 0, explanation: 'Try again' }],
        questTitle: 'Test',
      })
    );
    assert.ok(incorrectCheckHtml.includes('data-testid="quiz-error-box"'));
  });

  test('LessonCompletionModal renders dialog accessibility attributes and gamified rewards in SSR', () => {
    const html = renderToStaticMarkup(
      React.createElement(LessonCompletionModal, {
        examPassed: true,
        confettiParticles: [{ id: 1, size: 8, color: '#10b981', transform: 'none', transition: 'none' }],
        finishLessonAndReturn: () => {},
        questId: 'sql-q1',
        xp: 150,
        pins: 10,
      })
    );

    assert.ok(html.includes('data-testid="lesson-completion-modal"'));
    assert.ok(html.includes('role="dialog"'));
    assert.ok(html.includes('aria-modal="true"'));
    assert.ok(html.includes('aria-label="Lesson Completion Modal"'));
    assert.ok(html.includes('data-testid="completion-xp-badge"'));
    assert.ok(html.includes('+150 XP'));
    assert.ok(html.includes('data-testid="completion-pins-badge"'));
    assert.ok(html.includes('+10 Pins'));
    assert.ok(html.includes('data-testid="btn-return-roadmap"'));
  });
});
