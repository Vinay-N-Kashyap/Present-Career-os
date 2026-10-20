import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';

import { NODE_WEB_LONG_LESSONS } from '../src/lib/data/nodeWebLongLessons';
import { NODE_WEB_30_DAYS_CONFIGS } from '../src/lib/data/nodeWeb30DayData';
import { getLongLesson } from '../src/lib/data/longLessons';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { formatLogArgs } from '../src/lib/code/sandbox/logFormat';

function runLikeSandbox(code: string): string {
  const out: string[] = [];
  const sandbox = {
    console: {
      log: (...args: unknown[]) => out.push(formatLogArgs(args))
    },
    URLSearchParams,
    Set,
    Map,
    Date,
    Math,
    Number,
    String,
    Boolean,
    Array,
    Object,
    JSON,
    Buffer
  };
  vm.runInNewContext(code, sandbox, { timeout: 2000 });
  return out.join('\n');
}

test('Block 12 (Days 56–60) Node.js Expansion: Invariants, Word Counts & Pedagogical Depth', () => {
  for (let day = 56; day <= 60; day++) {
    const lesson = NODE_WEB_LONG_LESSONS.find((l) => l.day === day);
    assert.ok(lesson, `Day ${day} must exist in NODE_WEB_LONG_LESSONS`);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    if (day === 60) {
      assert.equal(lesson.minutes, 45, `Day 60 Milestone 10 Capstone must be declared at 45 minutes`);
    } else {
      assert.equal(lesson.minutes, 38, `Day ${day} must be declared at 38 minutes`);
    }
    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${day} summary must have at least 4 points`);
    assert.ok(lesson.projectStep, `Day ${day} projectStep must exist`);
    assert.ok(!('desc' in (lesson.projectStep as unknown as Record<string, unknown>)), `Day ${day} projectStep must NOT have desc property`);
    assert.equal((lesson.projectStep as { steps: string[] }).steps.length, 5, `Day ${day} projectStep must have 5 steps`);

    const unifiedLesson = getLongLesson('node-web', day);
    assert.ok(unifiedLesson, `getLongLesson('node-web', ${day}) must resolve`);
    assert.equal(unifiedLesson.day, day, `Day mismatch in getLongLesson`);

    let totalWords = 0;
    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      const partWords = part.say.reduce((acc, p) => acc + p.trim().split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWords >= 580, `Day ${day} Part ${i + 1} (${part.title}) has ${partWords} words, expected >= 580`);
      totalWords += partWords;

      assert.ok(part.code, `Day ${day} Part ${i + 1} must have code sample`);
      assert.ok(part.output, `Day ${day} Part ${i + 1} must have stated output`);

      // Verify exact deterministic execution matching
      const actualOutput = runLikeSandbox(part.code);
      assert.equal(actualOutput, part.output, `Day ${day} Part ${i + 1} code output mismatch!`);

      // Check answer invariant: option 0 must be correct
      if (part.check) {
        assert.equal(part.check.answer, 0, `Day ${day} Part ${i + 1} check answer must be 0`);
        assert.ok(part.check.options.length >= 2, `Day ${day} Part ${i + 1} check options must be >= 2`);
      }
    }

    assert.ok(totalWords >= 2900, `Day ${day} total words (${totalWords}) must be >= 2900`);
  }
});

test('Block 12 (Days 56–60) Node.js Expansion: On-Disk Visuals and Gate Contracts', () => {
  assert.equal(isCourseVisualsEnabled('node-web'), true, 'node-web visuals must be enabled');
  clearDayFileCache();

  for (let day = 56; day <= 60; day++) {
    const filePath = path.join(process.cwd(), 'src/lib/data/lessonVisuals/node-web', `day-${day}.json`);
    assert.ok(fs.existsSync(filePath), `day-${day}.json must exist on disk`);

    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    assert.equal(fileContent.schemaVersion, 2, `Day ${day} schemaVersion must be 2`);
    assert.equal(fileContent.prefix, 'node-web', `Day ${day} prefix must be 'node-web'`);
    assert.equal(fileContent.day, day, `Day ${day} day must be ${day}`);
    assert.equal(fileContent.entries.length, 5, `Day ${day} must contain exactly 5 visual entries`);

    const dayFile = loadDayFile('node-web', day);
    assert.ok(dayFile, `loadDayFile must successfully load Day ${day}`);

    const lesson = NODE_WEB_LONG_LESSONS.find((l) => l.day === day);
    assert.ok(lesson);

    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      const entry = fileContent.entries[i];
      assert.equal(entry.partTitle, part.title, `Part title mismatch at Day ${day} Part ${i + 1}`);

      const computedHash = crypto.createHash('sha256').update(part.code, 'utf-8').digest('hex');
      assert.equal(entry.codeHash, computedHash, `SHA-256 codeHash mismatch at Day ${day} Part ${i + 1}`);

      const visual = getVisual('node-web', day, i);
      assert.ok(visual, `getVisual must resolve for Day ${day} Part ${i + 1}`);
      assert.ok(['component-tree', 'wireframe', 'flow', 'boxes', 'compare', 'states'].includes(visual.template), `Template "${visual.template}" must be allowed`);
      assert.equal(visual.steps.length, 4, `Day ${day} Part ${i + 1} visual must have 4 steps`);
    }
  }
});

function buildRunnable(starter: string, hint: string): string {
  const lastBrace = starter.lastIndexOf('}');
  const head = starter.substring(0, lastBrace);
  const cleaned = head.replace(/return\s*[^;]*;\s*$/, '');
  return `${cleaned}\n  ${hint}\n}\n`;
}

test('Block 12 (Days 56–60) Node.js Expansion: 30DayData Practice & Exercises Execution', () => {
  for (let day = 56; day <= 60; day++) {
    const configIndex = day - 1;
    const config = NODE_WEB_30_DAYS_CONFIGS[configIndex];
    assert.ok(config, `Day ${day} config must exist in NODE_WEB_30_DAYS_CONFIGS`);
    assert.ok(config.syllabus && config.syllabus.length === 4, `Day ${day} syllabus must have strictly 4 items`);

    assert.ok(config.eTitle, `Day ${day} eTitle must exist`);
    assert.ok(config.eStarter, `Day ${day} eStarter must exist`);
    assert.ok(config.eTest, `Day ${day} eTest must exist`);

    assert.ok(config.aTitle, `Day ${day} aTitle must exist`);
    assert.ok(config.aStarter, `Day ${day} aStarter must exist`);
    assert.ok(config.aTest, `Day ${day} aTest must exist`);

    // Run exercise solution (hint) with test
    if (config.eHint) {
      const eCode = `${buildRunnable(config.eStarter, config.eHint)}\n${config.eTest}`;
      assert.doesNotThrow(() => {
        runLikeSandbox(eCode);
      }, `Day ${day} exercise hint must pass eTest`);
    }

    // Run assignment solution (hint) with test
    if (config.aHint) {
      const aCode = `${buildRunnable(config.aStarter, config.aHint)}\n${config.aTest}`;
      assert.doesNotThrow(() => {
        runLikeSandbox(aCode);
      }, `Day ${day} assignment hint must pass aTest`);
    }
  }
});
