import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  WorkspaceAIHint,
  generateLocalSocraticHint,
  buildOfflineDebugTutorHint,
} from '../src/components/quests/workspace/WorkspaceAIHint';
import { TodayCourseCard } from '../src/app/quests/components/TodayCourseCard';
import { ActiveEnrollmentBanner } from '../src/app/quests/components/ActiveEnrollmentBanner';
import { RoadmapCompleteBanner } from '../src/app/quests/components/RoadmapCompleteBanner';

test('generateLocalSocraticHint and buildOfflineDebugTutorHint cover all 8 languages deterministically', () => {
  const pyHint = generateLocalSocraticHint('def solve(arr):\n    print(arr)', 'python', 'AssertionError', 'Kashyap Sir', '👩‍🎨', 'Two Sum');
  assert.ok(pyHint.includes('return'));

  const sqlHint = generateLocalSocraticHint('UPDATE users SET active = 1', 'sql', 'Query error', 'Ms. Maya', '👩‍💼', 'Active Users');
  assert.ok(sqlHint.includes('SELECT'));

  const cppHint = generateLocalSocraticHint('int main() { return 0; }', 'cpp', 'missing header', 'Kashyap Sir', '👩‍🎨', 'GPIO Bitmask');
  assert.ok(cppHint.includes('#include'));

  const bashHint = generateLocalSocraticHint('foo_cmd --bar', 'bash', 'command not found: foo_cmd', 'Kashyap Sir', '👩‍🎨', 'Log Pipeline');
  assert.ok(bashHint.includes('POSIX utilities'));

  const tsHint = generateLocalSocraticHint('function f(x: number): string { return x as any; }', 'typescript', 'Type number is not assignable to string', 'Ms. Divya', '👨‍💼', 'Typed API');
  assert.ok(tsHint.includes('TypeScript type mismatch'));

  const tsxHint = generateLocalSocraticHint('export const App = () => <div><span></div>', 'tsx', 'JSX element has no corresponding closing tag', 'Ms. Divya', '👨‍💼', 'Card UI');
  assert.ok(tsxHint.includes('JSX syntax error'));

  const jsHint = generateLocalSocraticHint('const f = (x) => x.foo;', 'javascript', 'Cannot read properties of undefined', 'Ms. Divya', '👨‍💼', 'DOM Handler');
  assert.ok(jsHint.includes('optional chaining'));

  const javaHint = buildOfflineDebugTutorHint({
    code: 'public class Solution {}',
    language: 'java',
    errorMsg: 'ArrayIndexOutOfBoundsException: Index 5 out of bounds',
    teacherName: 'Karthic Sir',
    teacherEmoji: '👨‍🏫',
    questTitle: 'Binary Search',
  });
  assert.ok(javaHint.includes('array.length'));
});

test('WorkspaceAIHint renders modal testids, Listen button, and offline fallback when hint is null', () => {
  const html = renderToStaticMarkup(
    React.createElement(WorkspaceAIHint, {
      showAiTutorModal: true,
      setShowAiTutorModal: () => {},
      loadingAiTutor: false,
      aiTutorHint: null,
    })
  );

  assert.ok(html.includes('data-testid="workspace-ai-hint-modal"'));
  assert.ok(html.includes('data-testid="btn-listen-ai-hint"'));
  assert.ok(html.includes('data-testid="workspace-ai-hint-close"'));
  assert.ok(html.includes('data-testid="workspace-ai-hint-body"'));
  assert.ok(html.includes('Socratic Debug Hint'));
  assert.ok(html.includes('data-testid="workspace-ai-hint-return"'));
});

test('TodayCourseCard renders day badge, progress label, next test card, and final project action', () => {
  const html = renderToStaticMarkup(
    React.createElement(TodayCourseCard, {
      planTitle: '6-Month Pro Accelerator',
      summary: {
        next: { id: 'py-d2-l1', title: 'Control Flow & Loops', kind: 'Lesson', courseId: 'course-python-basics' },
        day: 2,
        totalDays: 30,
        tasksDone: 4,
        tasksTotal: 20,
        percent: 20,
        nextTest: { id: 'py-d5-exam', title: 'Week 1 Checkpoint Exam', tasksBefore: 2 },
        project: 'ready',
        tasksLeftBeforeProject: 0,
      },
      onStart: () => {},
      onOpenProject: () => {},
    })
  );

  assert.ok(html.includes('data-testid="today-course-card"'));
  assert.ok(html.includes('data-testid="today-day-badge"'));
  assert.ok(html.includes('Day 2 of 30'));
  assert.ok(html.includes('data-testid="btn-today-start"'));
  assert.ok(html.includes('data-testid="today-progress-label"'));
  assert.ok(html.includes('data-testid="today-next-test-card"'));
  assert.ok(html.includes('data-testid="today-final-project-card"'));
  assert.ok(html.includes('data-testid="btn-today-open-project"'));
});

test('ActiveEnrollmentBanner and RoadmapCompleteBanner render deterministic testids', () => {
  const enrollHtml = renderToStaticMarkup(
    React.createElement(ActiveEnrollmentBanner, {
      enrollment: {
        enrollmentId: 'enr-12345678',
        userId: 'user-1',
        planId: 'plan-6m-pro',
        track: 'python_ai',
        enrolledAt: new Date().toISOString(),
        currentSprint: 2,
        completedSprints: [1],
        practiceTestsPassed: 1,
        capstoneSubmitted: false,
      } as any,
      onOpenTimeline: () => {},
      onOpenCapstonePortal: () => {},
    })
  );

  assert.ok(enrollHtml.includes('data-testid="active-enrollment-banner"'));
  assert.ok(enrollHtml.includes('data-testid="enrollment-track-badge"'));
  assert.ok(enrollHtml.includes('data-testid="enrollment-plan-title"'));
  assert.ok(enrollHtml.includes('data-testid="enrollment-current-sprint"'));
  assert.ok(enrollHtml.includes('data-testid="btn-enrollment-timeline"'));
  assert.ok(enrollHtml.includes('data-testid="btn-enrollment-capstone"'));

  const completeHtml = renderToStaticMarkup(
    React.createElement(RoadmapCompleteBanner, {
      progress: { completed: 12, total: 12, percent: 100, isComplete: true },
      onStartProject: () => {},
    })
  );
  assert.ok(completeHtml.includes('data-testid="roadmap-complete-banner"'));
  assert.ok(completeHtml.includes('data-testid="btn-start-roadmap-project"'));
});
