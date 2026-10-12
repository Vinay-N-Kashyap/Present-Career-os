import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { LessonCodeEditor, resolveLessonCodeMeta } from '../src/app/quests/lesson/components/LessonCodeEditor';
import { LessonContentRenderer } from '../src/app/quests/lesson/components/LessonContentRenderer';
import { TeacherAvatarFrame } from '../src/app/quests/lesson/components/TeacherAvatarFrame';
import { LessonNavigationBar } from '../src/app/quests/lesson/components/LessonNavigationBar';
import { synthesizeLongLessonVisual } from '../src/lib/visuals/loadVisuals';

function htmlEscape(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

test('resolveLessonCodeMeta resolves filenames, prompts, and language badges across all tracks', () => {
  const py = resolveLessonCodeMeta('python-d1-q1');
  assert.equal(py.fileName, 'main.py');
  assert.equal(py.commandPrompt, '$ python3 main.py');
  assert.equal(py.languageLabel, 'Python 3');

  const sql = resolveLessonCodeMeta('sql-mastery-d1-q1');
  assert.equal(sql.fileName, 'query.sql');
  assert.equal(sql.commandPrompt, '$ psql -f query.sql');
  assert.equal(sql.languageLabel, 'PostgreSQL');

  const cpp = resolveLessonCodeMeta('iot_emb-d1-q1');
  assert.equal(cpp.fileName, 'main.cpp');
  assert.equal(cpp.commandPrompt, '$ g++ -O2 main.cpp && ./a.out');
  assert.equal(cpp.languageLabel, 'C++20');

  const bash = resolveLessonCodeMeta('git_vcs-d1-q1');
  assert.equal(bash.fileName, 'script.sh');
  assert.equal(bash.commandPrompt, '$ bash script.sh');
  assert.equal(bash.languageLabel, 'POSIX Bash');

  const ts = resolveLessonCodeMeta('ts-basics-d1-q1');
  assert.equal(ts.fileName, 'main.ts');
  assert.equal(ts.commandPrompt, '$ npx tsx main.ts');
  assert.equal(ts.languageLabel, 'TypeScript');

  const java = resolveLessonCodeMeta('java-basics-d1-q1');
  assert.equal(java.fileName, 'Solution.java');
  assert.equal(java.commandPrompt, '$ javac Solution.java && java Solution');
  assert.equal(java.languageLabel, 'Java');
});

test('LessonCodeEditor renders copy button, language badge, normal output and error output status', () => {
  const okHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(LessonCodeEditor, {
      questId: 'iot_emb-d1-q1',
      slideIdx: 0,
      codeExample: 'int main() { return 0; }',
      codeRunning: false,
      codeOutput: 'C++ syntax and structural invariants verified.',
      onRunCode: () => {},
    })
  );

  assert.ok(okHtml.includes('data-testid="lesson-code-editor"'));
  assert.ok(okHtml.includes('data-testid="lesson-code-filename"'));
  assert.ok(okHtml.includes('main.cpp'));
  assert.ok(okHtml.includes('data-testid="lesson-code-lang-badge"'));
  assert.ok(okHtml.includes('C++20'));
  assert.ok(okHtml.includes('data-testid="btn-copy-code"'));
  assert.ok(okHtml.includes('data-testid="btn-run-code"'));
  assert.ok(okHtml.includes('data-output-status="ok"'));
  assert.ok(okHtml.includes(htmlEscape('$ g++ -O2 main.cpp && ./a.out')));

  const errHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(LessonCodeEditor, {
      questId: 'python-d1-q1',
      slideIdx: 0,
      codeExample: 'print(x)',
      codeRunning: false,
      codeOutput: '[Error] NameError: name "x" is not defined',
      onRunCode: () => {},
    })
  );

  assert.ok(errHtml.includes('data-output-status="error"'));
  assert.ok(errHtml.includes('Error Output'));
});

test('LessonContentRenderer renders intro card, content slide with visual & tappable words, and Socratic chat panel', () => {
  const baseProps: any = {
    userId: 'u1',
    teacherId: 'kashyap',
    teacher: { name: 'Kashyap', avatar: '👨‍🏫', accent: '#10b981' },
    questId: 'bcom_ana-d1-q1',
    questData: { title: 'Business Analytics Day 1', desc: 'Master decision intelligence.' },
    currentSlide: 0,
    slides: [],
    slidesLoading: false,
    syllabus: ['Part 1: Revenue Run-Rate', 'Part 2: Margin Optimization'],
    isPlaying: false,
    setIsPlaying: () => {},
    latestAIResponse: '',
    getSpeakerText: () => 'Welcome to Business Analytics.',
    isInteractive: false,
    setIsInteractive: () => {},
    chatMessages: [],
    setChatMessages: () => {},
    chatLoading: false,
    chatInput: '',
    setChatInput: () => {},
    chatBottomRef: { current: null },
    isRecording: false,
    startVoiceInput: () => {},
    sendInteractiveMessage: async () => {},
    understandingConfirmed: {},
    setUnderstandingConfirmed: () => {},
    handleNextSlide: () => {},
    codeRunning: {},
    codeOutputs: {},
    simulateCodeRun: () => {},
    isLastSlide: false,
    examPassed: false,
    examFailed: false,
    setExamFailed: () => {},
    examCorrectCount: 0,
    setExamCorrectCount: () => {},
    setExamAnswers: () => {},
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
  };

  const introHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(LessonContentRenderer, baseProps)
  );
  assert.ok(introHtml.includes('data-testid="lesson-intro-card"'));
  assert.ok(introHtml.includes('Business Analytics Day 1'));

  const visual = synthesizeLongLessonVisual('bcom_ana', 1, 0, { title: 'Revenue Run-Rate Modeling' });
  const slideHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(LessonContentRenderer, {
      ...baseProps,
      currentSlide: 1,
      slides: [
        {
          title: 'Revenue Run-Rate Modeling',
          explain: ['Track Revenue Run-Rate and Net EBITDA across cohorts.'],
          example: 'A SaaS dashboard comparing Revenue Run-Rate to Contribution Margin.',
          codeExample: 'print("ARR:", 120000)',
          codeNotes: [{ line: 1, note: 'Prints the annual Revenue Run-Rate.' }],
          tryIt: 'Change the ARR value and re-run.',
          visualKey: 'bcom_ana:1:0',
          visual,
          mcq: {
            question: 'Which metric tracks annualized top-line performance?',
            options: ['Revenue Run-Rate', 'Depreciation', 'Tax Shield'],
            answerIndex: 0,
            explanation: 'Revenue Run-Rate projects current revenue over 12 months.',
          },
        },
      ],
    })
  );

  assert.ok(slideHtml.includes('data-testid="visual-stage-root"'));
  assert.ok(slideHtml.includes('data-testid="lesson-slide-title"'));
  assert.ok(slideHtml.includes('data-testid="btn-read-slide"'));
  assert.ok(slideHtml.includes('data-testid="tappable-word-revenue run-rate"'));
  assert.ok(slideHtml.includes('data-testid="lesson-everyday-example"'));
  assert.ok(slideHtml.includes('data-testid="lesson-code-notes"'));
  assert.ok(slideHtml.includes('data-testid="lesson-try-it"'));
  assert.ok(slideHtml.includes('data-testid="inline-socratic-check"'));

  const chatHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(LessonContentRenderer, {
      ...baseProps,
      currentSlide: 1,
      isInteractive: true,
      chatMessages: [{ role: 'assistant', content: 'How can I help clarify this concept?' }],
    })
  );

  assert.ok(chatHtml.includes('data-testid="socratic-chat-panel"'));
  assert.ok(chatHtml.includes('data-testid="socratic-chat-msg-0"'));
  assert.ok(chatHtml.includes('data-testid="socratic-suggestion-0"'));
  assert.ok(chatHtml.includes('data-testid="socratic-chat-input"'));
  assert.ok(chatHtml.includes('data-testid="socratic-chat-send"'));
});

test('TeacherAvatarFrame and LessonNavigationBar render speech status and check progress pill', () => {
  const frameHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(TeacherAvatarFrame, {
      userId: 'u1',
      teacherId: 'kashyap',
      teacher: { name: 'Kashyap', avatar: '👨‍🏫', accent: '#10b981' },
      isPlaying: true,
      speechText: 'Welcome to the classroom lesson on distributed systems.',
      questData: { title: 'Distributed Systems' },
    })
  );

  assert.ok(frameHtml.includes('data-testid="teacher-avatar-dock"'));
  assert.ok(frameHtml.includes('data-speech-active="true"'));
  assert.ok(frameHtml.includes('data-testid="teacher-avatar-name"'));
  assert.ok(frameHtml.includes('data-testid="teacher-avatar-status"'));
  assert.ok(frameHtml.includes('Speaking...'));

  const navHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(LessonNavigationBar, {
      currentSlide: 2,
      handlePrevSlide: () => {},
      handleNextSlide: () => {},
      stopSpeaking: () => {},
      setIsPlaying: () => {},
      isInteractive: false,
      setIsInteractive: () => {},
      teacher: { name: 'Kashyap', avatar: '👨‍🏫', accent: '#10b981' },
      isLastSlide: false,
      examPassed: false,
      finishLessonAndReturn: () => {},
      slidesLength: 5,
      understandingConfirmed: { 0: true, 1: true },
    })
  );

  assert.ok(navHtml.includes('data-testid="lesson-check-progress-pill"'));
  assert.ok(navHtml.includes('✓ 2/5 Checks'));
});
