import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';

test('Feature 1: Access Control - completed previous classes are locked', () => {
  // 1. Verify QuestPathView blocks completed stages
  const questPathSource = fs.readFileSync(
    path.join(__dirname, '../src/app/quests/components/QuestPathView.tsx'),
    'utf-8'
  );
  assert.ok(questPathSource.includes('isStageCompleted'));
  assert.ok(questPathSource.includes('Previous classes cannot be re-accessed'));
  assert.ok(questPathSource.includes('Milestone Completed 🔒'));

  // 2. Verify useQuestProgression handleLaunchQuest blocks completed quests
  const progressionSource = fs.readFileSync(
    path.join(__dirname, '../src/app/quests/components/useQuestProgression.ts'),
    'utf-8'
  );
  assert.ok(progressionSource.includes('const isCompleted = completedQuests.includes(quest.id);'));
  assert.ok(progressionSource.includes('toast.warning(\'Class Already Completed 🔒\', \'You cannot access previous classes. Please continue with your next scheduled class.\');'));

  // 3. Verify LessonPageRouter guards completed quest access via URL
  const lessonPageSource = fs.readFileSync(
    path.join(__dirname, '../src/app/quests/lesson/page.tsx'),
    'utf-8'
  );
  assert.ok(lessonPageSource.includes('isClassAlreadyCompleted'));
  assert.ok(lessonPageSource.includes('quest-already-completed-locked'));
  assert.ok(lessonPageSource.includes('btn-completed-return'));
});

test('Feature 2: Fullscreen Gaming Mode (Shift + Space x2 & Shift + Esc)', () => {
  const lessonPageSource = fs.readFileSync(
    path.join(__dirname, '../src/app/quests/lesson/page.tsx'),
    'utf-8'
  );

  // 1. Double tap Space with Shift held within 500ms
  assert.ok(lessonPageSource.includes("e.shiftKey && (e.code === 'Space' || e.key === ' ')"));
  assert.ok(lessonPageSource.includes('now - lastShiftSpaceTime < 500'));
  assert.ok(lessonPageSource.includes('enterFullscreen()'));

  // 2. Input/textarea protection (prevents entering fullscreen while actively coding or typing)
  assert.ok(lessonPageSource.includes("target.tagName === 'INPUT'"));
  assert.ok(lessonPageSource.includes("target.tagName === 'TEXTAREA'"));
  assert.ok(lessonPageSource.includes("target.closest('.monaco-editor')"));

  // 3. Exit fullscreen with Shift+Esc or Esc
  assert.ok(lessonPageSource.includes("e.code === 'Escape' || e.key === 'Escape'"));
  assert.ok(lessonPageSource.includes('exitFullscreen()'));

  // 4. Fullscreen styling & HUD pill
  assert.ok(lessonPageSource.includes('.classroom-page-root.fullscreen-mode'));
  assert.ok(lessonPageSource.includes('fullscreen-mode-pill'));
  assert.ok(lessonPageSource.includes('Shift + Esc to exit'));

  // 5. LessonHeader toggle button
  const { LessonHeader } = require('../src/app/quests/lesson/components/LessonHeader');
  let toggled = false;
  const markup = renderToStaticMarkup(
    React.createElement(LessonHeader, {
      questTitle: 'Test Class',
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
      isFullscreen: false,
      toggleFullscreen: () => { toggled = true; },
    })
  );

  assert.ok(markup.includes('data-testid="btn-fullscreen-toggle"'));
  assert.ok(markup.includes('Shift + Space x2'));
});

test('Python Runner: Pyodide worker resilience & CDN fallback', () => {
  const workerSource = fs.readFileSync(
    path.join(__dirname, '../public/python-worker.js'),
    'utf-8'
  );

  // Ensure synchronous root-level importScripts does NOT exist to prevent instantiation crash
  const first10Lines = workerSource.split('\n').slice(0, 10).join('\n');
  assert.ok(!first10Lines.includes('importScripts('), 'Worker must not call importScripts at top-level');

  // Verify getPyodide has local-first and CDN fallback
  assert.ok(workerSource.includes("importScripts('/pyodide/pyodide.js')"));
  assert.ok(workerSource.includes("importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js')"));
  assert.ok(workerSource.includes("indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'"));

  // Verify pythonRunner.ts allows extended initialization timeout
  const runnerSource = fs.readFileSync(
    path.join(__dirname, '../src/lib/code/python/pythonRunner.ts'),
    'utf-8'
  );
  assert.ok(runnerSource.includes('Math.max(timeoutMs, 25000)'));
  assert.ok(runnerSource.includes('isInitialized'));
});
