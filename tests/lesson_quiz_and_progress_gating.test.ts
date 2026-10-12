import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { LessonHeader } from '../src/app/quests/lesson/components/LessonHeader';
import { LessonNavigationBar } from '../src/app/quests/lesson/components/LessonNavigationBar';
import { LessonQuizBlock } from '../src/app/quests/lesson/components/LessonQuizBlock';
import { LessonCompletionModal } from '../src/app/quests/lesson/components/LessonCompletionModal';

test('LessonHeader renders slide counter and progress pills with lock state', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(LessonHeader, {
      questTitle: 'Python Day 1: Variables',
      isFocusMusicEnabled: false,
      setIsFocusMusicEnabled: () => {},
      soundscapeVol: 50,
      setSoundscapeVol: () => {},
      isAudioUnlocked: true,
      setIsAudioUnlocked: () => {},
      playSpeech: () => {},
      stopSpeaking: () => {},
      setIsPlaying: () => {},
      setIsInteractive: () => {},
      currentSlide: 1,
      setCurrentSlide: () => {},
      totalSlides: 5,
      isInteractive: false,
      examPassed: false,
      maxUnlockedSlide: 2,
      understandingConfirmed: { 0: false },
    })
  );

  assert.ok(html.includes('data-testid="lesson-header-root"'));
  assert.ok(html.includes('data-testid="lesson-slide-counter"'));
  assert.ok(html.includes('Slide 2 / 5'));
  assert.ok(html.includes('data-testid="lesson-progress-pill-0"'));
  assert.ok(html.includes('data-testid="lesson-progress-pill-4"'));
  assert.ok(html.includes('Exam Locked (Complete earlier slides)'));
});

test('LessonNavigationBar gates Next Slide until concept check is confirmed and unlocks when confirmed', () => {
  const lockedHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(LessonNavigationBar, {
      currentSlide: 1,
      handlePrevSlide: () => {},
      handleNextSlide: () => {},
      stopSpeaking: () => {},
      setIsPlaying: () => {},
      isInteractive: false,
      setIsInteractive: () => {},
      teacher: { name: 'Kashyap', accent: '#10b981' },
      isLastSlide: false,
      examPassed: false,
      finishLessonAndReturn: () => {},
      slidesLength: 3,
      understandingConfirmed: { 0: false },
    })
  );

  assert.ok(lockedHtml.includes('data-testid="lesson-nav-bar"'));
  assert.ok(lockedHtml.includes('data-testid="btn-next-slide"'));
  assert.ok(lockedHtml.includes('Answer Check 🔒'));

  const unlockedHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(LessonNavigationBar, {
      currentSlide: 1,
      handlePrevSlide: () => {},
      handleNextSlide: () => {},
      stopSpeaking: () => {},
      setIsPlaying: () => {},
      isInteractive: false,
      setIsInteractive: () => {},
      teacher: { name: 'Kashyap', accent: '#10b981' },
      isLastSlide: false,
      examPassed: false,
      finishLessonAndReturn: () => {},
      slidesLength: 3,
      understandingConfirmed: { 0: true },
    })
  );

  assert.ok(unlockedHtml.includes('Next Slide ▶'));
});

test('LessonQuizBlock renders active quiz with score pill & progress bar, plus Passed and Failed banners', () => {
  const sampleQuestions = [
    {
      question: 'What does len([1, 2, 3]) return?',
      options: ['2', '3', '4'],
      answerIndex: 1,
      explanation: 'There are 3 items in the list.',
    },
    {
      question: 'Which keyword defines a function in Python?',
      options: ['func', 'def', 'fn'],
      answerIndex: 1,
      explanation: 'Python uses def.',
    },
  ];

  const activeHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(LessonQuizBlock, {
      teacherAccent: '#10b981',
      examPassed: false,
      examFailed: false,
      setExamFailed: () => {},
      examCorrectCount: 1,
      setExamCorrectCount: () => {},
      onReviewLesson: () => {},
      examQuestionIndex: 1,
      setExamQuestionIndex: () => {},
      selectedMcqAnswer: 1,
      setSelectedMcqAnswer: () => {},
      mcqChecked: true,
      setMcqChecked: () => {},
      mcqIsCorrect: true,
      setMcqIsCorrect: () => {},
      setExamPassed: () => {},
      playChime: () => {},
      launchConfetti: () => {},
      dynamicQuestions: sampleQuestions,
      questTitle: 'Python Day 1',
      quizTitle: 'Quick check',
    })
  );

  assert.ok(activeHtml.includes('data-testid="lesson-quiz-block"'));
  assert.ok(activeHtml.includes('data-testid="quiz-score-pill"'));
  assert.ok(activeHtml.includes('Score: 1/1'));
  assert.ok(activeHtml.includes('data-testid="quiz-progress-bar"'));

  const passedHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(LessonQuizBlock, {
      teacherAccent: '#10b981',
      examPassed: true,
      examFailed: false,
      setExamFailed: () => {},
      examCorrectCount: 2,
      setExamCorrectCount: () => {},
      onReviewLesson: () => {},
      examQuestionIndex: 1,
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
      dynamicQuestions: sampleQuestions,
      questTitle: 'Python Day 1',
    })
  );

  assert.ok(passedHtml.includes('data-testid="quiz-passed-banner"'));
  assert.ok(passedHtml.includes('Verified Knowledge Invariant Achieved'));

  const failedHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(LessonQuizBlock, {
      teacherAccent: '#10b981',
      examPassed: false,
      examFailed: true,
      setExamFailed: () => {},
      examCorrectCount: 0,
      setExamCorrectCount: () => {},
      onReviewLesson: () => {},
      examQuestionIndex: 1,
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
      dynamicQuestions: sampleQuestions,
      questTitle: 'Python Day 1',
    })
  );

  assert.ok(failedHtml.includes('data-testid="quiz-failed-banner"'));
  assert.ok(failedHtml.includes('data-testid="btn-review-lesson"'));
});

test('LessonCompletionModal renders XP/Pins rewards and server failure retry state', () => {
  const passedModalHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(LessonCompletionModal, {
      examPassed: true,
      confettiParticles: [],
      finishLessonAndReturn: () => {},
      xp: 200,
      pins: 10,
      testRecord: null,
    })
  );

  assert.ok(passedModalHtml.includes('data-testid="lesson-completion-modal"'));
  assert.ok(passedModalHtml.includes('data-testid="completion-xp-badge"'));
  assert.ok(passedModalHtml.includes('+200 XP'));
  assert.ok(passedModalHtml.includes('data-testid="completion-pins-badge"'));
  assert.ok(passedModalHtml.includes('+10 Pins'));
  assert.ok(passedModalHtml.includes('data-testid="btn-return-roadmap"'));

  const failedRecordHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(LessonCompletionModal, {
      examPassed: true,
      confettiParticles: [],
      finishLessonAndReturn: () => {},
      testRecord: { state: 'failed', message: 'Connection lost during grading.' },
      onRetryTest: () => {},
    })
  );

  assert.ok(failedRecordHtml.includes('data-testid="completion-retry-banner"'));
  assert.ok(failedRecordHtml.includes('Connection lost during grading.'));
});
