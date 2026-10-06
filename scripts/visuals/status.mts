import fs from 'node:fs';
import path from 'node:path';

export const COURSES = [
  'python',
  'dsa-py',
  'sql-mastery',
  'ai-py',
  'dist-py',
  'cloud-py',
  'nlp-py',
  'quant-py',
  'prompt-py',
  'train-py',
  'vec-py',
  'safe-py',
] as const;

export interface CourseStatusCounts {
  passed: number;
  none: number;
  needsReview: number;
  todo: number;
  pilot: number;
  total: number;
}

export function computeVisualsStatus(manifestPath?: string): Record<string, CourseStatusCounts> {
  const file = manifestPath || path.resolve(process.cwd(), 'docs/visuals/py_cert_manifest.json');
  const raw = fs.readFileSync(file, 'utf-8');
  const manifest = JSON.parse(raw);

  const result: Record<string, CourseStatusCounts> = {};
  for (const c of COURSES) {
    result[c] = { passed: 0, none: 0, needsReview: 0, todo: 0, pilot: 0, total: 0 };
  }

  for (const [key, item] of Object.entries<any>(manifest.keys || {})) {
    const [prefix] = key.split(':');
    if (!result[prefix]) {
      result[prefix] = { passed: 0, none: 0, needsReview: 0, todo: 0, pilot: 0, total: 0 };
    }
    const counts = result[prefix];
    counts.total++;
    const st = item.status;
    if (st === 'passed') counts.passed++;
    else if (st === 'none') counts.none++;
    else if (st === 'needs-review') counts.needsReview++;
    else if (st === 'pilot') counts.pilot++;
    else counts.todo++;
  }

  return result;
}

export function renderStatusOutput(statusByCourse: Record<string, CourseStatusCounts>): {
  lines: string[];
  markdown: string;
} {
  const lines: string[] = [];
  let tableRows = '';
  let totPassed = 0;
  let totNone = 0;
  let totNeedsReview = 0;
  let totTodo = 0;
  let totPilot = 0;
  let grandTotal = 0;

  for (const course of COURSES) {
    const c = statusByCourse[course] || {
      passed: 0,
      none: 0,
      needsReview: 0,
      todo: 0,
      pilot: 0,
      total: 0,
    };
    totPassed += c.passed;
    totNone += c.none;
    totNeedsReview += c.needsReview;
    totTodo += c.todo;
    totPilot += c.pilot;
    grandTotal += c.total;

    const line = `${course.padEnd(14)} ${c.passed} passed / ${c.none} none / ${c.needsReview} needs-review / ${c.todo} todo${c.pilot > 0 ? ` (${c.pilot} pilot)` : ''}`;
    lines.push(line);

    tableRows += `| \`${course}\` | ${c.passed} | ${c.none} | ${c.needsReview} | ${c.todo} | ${c.pilot} | ${c.total} |\n`;
  }

  const markdown = `### 📊 Lesson Visuals Progress Status

| Course | Passed | None | Needs Review | Todo | Pilot | Total |
|:---|---:|---:|---:|---:|---:|---:|
${tableRows}| **Total** | **${totPassed}** | **${totNone}** | **${totNeedsReview}** | **${totTodo}** | **${totPilot}** | **${grandTotal}** |
`;

  return { lines, markdown };
}

function main() {
  const status = computeVisualsStatus();
  const { lines, markdown } = renderStatusOutput(status);

  for (const line of lines) {
    console.log(line);
  }

  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown + '\n');
    } catch (err) {
      console.error('Failed to append to GITHUB_STEP_SUMMARY:', err);
    }
  }
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/visuals/status.mts')) {
  main();
}
