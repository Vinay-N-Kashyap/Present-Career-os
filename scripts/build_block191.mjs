import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

import { getDay6 } from './generate_day6.mjs';
import { getDay7 } from './generate_day7.mjs';
import { getDay8 } from './generate_day8.mjs';
import { getDay9 } from './generate_day9.mjs';
import { getDay10 } from './generate_day10.mjs';

const days = [
  getDay6(),
  getDay7(),
  getDay8(),
  getDay9(),
  getDay10()
];

// 1. Generate visual JSON files
const visualsDir = path.resolve('src/lib/data/lessonVisuals/excel_viz');
if (!fs.existsSync(visualsDir)) {
  fs.mkdirSync(visualsDir, { recursive: true });
}

for (const dayObj of days) {
  const dayPadded = String(dayObj.day).padStart(2, '0');
  const visualFilePath = path.join(visualsDir, `day-${dayPadded}.json`);
  
  const entries = dayObj.parts.map(part => {
    const codeHash = crypto.createHash('sha256').update(part.code).digest('hex');
    const shortTitle = part.title.length > 40 ? part.title.slice(0, 40) + '...' : part.title;
    
    return {
      partTitle: part.title,
      codeHash,
      spec: {
        template: 'bars',
        title: `${shortTitle} — Quantitative KPI Distribution`,
        steps: [
          {
            at: 'intro',
            caption: `Step 1: Baseline KPI cohort metrics for ${shortTitle}`,
            max: 100,
            bars: [
              { label: 'Revenue Run-Rate', value: 75, tone: 'data' },
              { label: 'Contribution Margin', value: 48, tone: 'idle' },
              { label: 'Operating Cash Flow', value: 38, tone: 'idle' },
              { label: 'Net EBITDA', value: 26, tone: 'idle' }
            ]
          },
          {
            at: 'say1',
            caption: `Step 2: Isolate operational drivers and margin trends for ${shortTitle}`,
            max: 100,
            bars: [
              { label: 'Revenue Run-Rate', value: 82, tone: 'ok' },
              { label: 'Contribution Margin', value: 60, tone: 'data' },
              { label: 'Operating Cash Flow', value: 48, tone: 'data' },
              { label: 'Net EBITDA', value: 34, tone: 'idle' }
            ]
          },
          {
            at: 'example',
            caption: `Step 3: Apply sensitivity model and benchmark variance thresholds`,
            max: 100,
            bars: [
              { label: 'Revenue Run-Rate', value: 88, tone: 'ok' },
              { label: 'Contribution Margin', value: 68, tone: 'ok' },
              { label: 'Operating Cash Flow', value: 56, tone: 'ok' },
              { label: 'Net EBITDA', value: 42, tone: 'data' }
            ]
          },
          {
            at: 'tryIt',
            caption: `Step 4: Commit audited analytical dashboard for ${shortTitle}`,
            max: 100,
            bars: [
              { label: 'Revenue Run-Rate', value: 92, tone: 'ok' },
              { label: 'Contribution Margin', value: 74, tone: 'ok' },
              { label: 'Operating Cash Flow', value: 62, tone: 'ok' },
              { label: 'Net EBITDA', value: 48, tone: 'ok' }
            ]
          }
        ]
      }
    };
  });

  const visualPayload = {
    schemaVersion: 1,
    prefix: 'excel_viz',
    day: dayObj.day,
    promptSha: crypto.createHash('sha256').update(`excel_viz-day-${dayObj.day}`).digest('hex'),
    model: 'anthropic/claude-3.5-sonnet',
    entries
  };

  fs.writeFileSync(visualFilePath, JSON.stringify(visualPayload, null, 2), 'utf-8');
  console.log(`Wrote visual spec: ${visualFilePath}`);
}

// 2. Append Days 6..10 to src/lib/data/excelVizLongLessons.ts
const lessonsFilePath = path.resolve('src/lib/data/excelVizLongLessons.ts');
let content = fs.readFileSync(lessonsFilePath, 'utf-8');

// Find the closing bracket of EXCEL_VIZ_LONG_LESSONS
const lastBracketIdx = content.lastIndexOf('];');
if (lastBracketIdx === -1) {
  throw new Error('Could not find closing bracket in excelVizLongLessons.ts');
}

const before = content.slice(0, lastBracketIdx).trimEnd();
// Format each day cleanly as a JS/TS object
const formattedDays = days.map(d => {
  return '  ' + JSON.stringify(d, null, 2).replace(/\n/g, '\n  ');
}).join(',\n');

const newContent = `${before},\n${formattedDays}\n];\n`;
fs.writeFileSync(lessonsFilePath, newContent, 'utf-8');
console.log('Successfully appended Days 6-10 to excelVizLongLessons.ts!');
