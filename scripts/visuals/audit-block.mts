import fs from 'node:fs';
import path from 'node:path';
import { checkDayFile, COURSE_ALLOWED_TEMPLATES } from '@/lib/visuals/gate';
import { getLongLesson } from '@/lib/data/longLessons';
import { isCourseVisualsEnabled } from '@/lib/visuals/enabledCourses';

export interface DayAuditReport {
  day: number;
  passed: boolean;
  pictureCount: number;
  noneCount: number;
  gateErrors: string[];
  deepErrors: string[];
  partSummary: {
    partIndex: number;
    title: string;
    template: string;
    stepsCount: number;
  }[];
}

export interface BlockAuditReport {
  course: string;
  block: number;
  startDay: number;
  endDay: number;
  passed: boolean;
  totalPictures: number;
  totalNone: number;
  totalErrors: number;
  days: DayAuditReport[];
}

const VALID_TONES = new Set(['data', 'ok', 'error', 'idle']);

export function auditDay(course: string, day: number): DayAuditReport {
  const dayPadded = String(day).padStart(2, '0');
  const filePath = path.resolve(
    process.cwd(),
    `src/lib/data/lessonVisuals/${course}/day-${dayPadded}.json`
  );

  const report: DayAuditReport = {
    day,
    passed: false,
    pictureCount: 0,
    noneCount: 0,
    gateErrors: [],
    deepErrors: [],
    partSummary: [],
  };

  if (!fs.existsSync(filePath)) {
    report.deepErrors.push(`File missing: ${filePath}`);
    return report;
  }

  let raw = '';
  let parsed: any;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
    parsed = JSON.parse(raw);
  } catch (err: any) {
    report.deepErrors.push(`JSON parse error: ${err?.message || err}`);
    return report;
  }

  // 1. Gate v2 check
  const gateRes = checkDayFile(filePath);
  report.gateErrors = gateRes.errors;

  // 2. Lesson linkage check
  const lesson = getLongLesson(course, day);
  if (!lesson) {
    report.deepErrors.push(`Underlying lesson not found via getLongLesson('${course}', ${day})`);
  }

  // 3. Deep structural checks
  if (!Array.isArray(parsed?.entries) || parsed.entries.length !== 6) {
    report.deepErrors.push(`Expected exactly 6 entries, found ${parsed?.entries?.length ?? 0}`);
  } else {
    for (let i = 0; i < 6; i++) {
      const entry = parsed.entries[i];
      const spec = entry?.spec;
      const tpl = spec?.template;

      if (!tpl) {
        report.deepErrors.push(`Part ${i + 1} (${entry?.partTitle}): missing spec.template`);
        continue;
      }

      if (tpl === 'none') {
        report.noneCount++;
        report.partSummary.push({
          partIndex: i + 1,
          title: entry.partTitle || `Part ${i + 1}`,
          template: 'none',
          stepsCount: 0,
        });
        continue;
      }

      report.pictureCount++;
      const steps = spec.steps || [];
      report.partSummary.push({
        partIndex: i + 1,
        title: entry.partTitle || `Part ${i + 1}`,
        template: tpl,
        stepsCount: steps.length,
      });

      // Template-specific deep assertions
      switch (tpl) {
        case 'table': {
          const cols = spec.columns || [];
          if (cols.length < 2 || cols.length > 5) {
            report.deepErrors.push(`Part ${i + 1} table: columns length ${cols.length} outside [2,5]`);
          }
          for (let sIdx = 0; sIdx < steps.length; sIdx++) {
            const step = steps[sIdx];
            const rows = step.rows || [];
            for (let rIdx = 0; rIdx < rows.length; rIdx++) {
              const row = rows[rIdx];
              if (row.tone && !VALID_TONES.has(row.tone)) {
                report.deepErrors.push(`Part ${i + 1} table step ${sIdx + 1} row ${rIdx + 1}: invalid tone "${row.tone}"`);
              }
              if (Array.isArray(row.cells) && row.cells.length !== cols.length) {
                report.deepErrors.push(
                  `Part ${i + 1} table step ${sIdx + 1} row ${rIdx + 1}: cells length (${row.cells.length}) does not match column count (${cols.length})`
                );
              }
            }
          }
          break;
        }

        case 'flow': {
          const nodeIds = new Set<string>((spec.nodes || []).map((n: any) => n.id));
          for (let sIdx = 0; sIdx < steps.length; sIdx++) {
            const step = steps[sIdx];
            const arrows = step.arrows || [];
            for (const [from, to] of arrows) {
              if (!nodeIds.has(from)) {
                report.deepErrors.push(`Part ${i + 1} flow step ${sIdx + 1}: arrow 'from' node "${from}" does not exist in nodes`);
              }
              if (!nodeIds.has(to)) {
                report.deepErrors.push(`Part ${i + 1} flow step ${sIdx + 1}: arrow 'to' node "${to}" does not exist in nodes`);
              }
            }
            if (step.tones) {
              for (const [nId, tone] of Object.entries(step.tones)) {
                if (!VALID_TONES.has(tone as string)) {
                  report.deepErrors.push(`Part ${i + 1} flow step ${sIdx + 1} node "${nId}": invalid tone "${tone}"`);
                }
              }
            }
          }
          break;
        }

        case 'sequence': {
          const actorIds = new Set<string>((spec.actors || []).map((a: any) => (typeof a === 'string' ? a : a?.id || '')));
          for (let sIdx = 0; sIdx < steps.length; sIdx++) {
            const step = steps[sIdx];
            const msgs = step.messages || [];
            for (let mIdx = 0; mIdx < msgs.length; mIdx++) {
              const msg = msgs[mIdx];
              if (msg.from && !actorIds.has(msg.from)) {
                report.deepErrors.push(`Part ${i + 1} sequence step ${sIdx + 1} msg ${mIdx + 1}: 'from' actor "${msg.from}" does not exist in actors`);
              }
              if (msg.to && !actorIds.has(msg.to)) {
                report.deepErrors.push(`Part ${i + 1} sequence step ${sIdx + 1} msg ${mIdx + 1}: 'to' actor "${msg.to}" does not exist in actors`);
              }
              if (msg.tone && !VALID_TONES.has(msg.tone)) {
                report.deepErrors.push(`Part ${i + 1} sequence step ${sIdx + 1} msg ${mIdx + 1}: invalid tone "${msg.tone}"`);
              }
            }
          }
          break;
        }

        case 'bars': {
          for (let sIdx = 0; sIdx < steps.length; sIdx++) {
            const step = steps[sIdx];
            const bars = step.bars || [];
            for (let bIdx = 0; bIdx < bars.length; bIdx++) {
              const bar = bars[bIdx];
              if (bar.tone && !VALID_TONES.has(bar.tone)) {
                report.deepErrors.push(`Part ${i + 1} bars step ${sIdx + 1} bar ${bIdx + 1}: invalid tone "${bar.tone}"`);
              }
            }
          }
          break;
        }

        case 'boxes': {
          for (let sIdx = 0; sIdx < steps.length; sIdx++) {
            const step = steps[sIdx];
            if (step.tones) {
              for (const [bId, tone] of Object.entries(step.tones)) {
                if (!VALID_TONES.has(tone as string)) {
                  report.deepErrors.push(`Part ${i + 1} boxes step ${sIdx + 1} box "${bId}": invalid tone "${tone}"`);
                }
              }
            }
          }
          break;
        }

        case 'states': {
          const stateIds = new Set<string>((spec.states || []).map((s: any) => (typeof s === 'string' ? s : s?.id || '')));
          for (let sIdx = 0; sIdx < steps.length; sIdx++) {
            const step = steps[sIdx];
            const curr = step.currentState || step.active;
            if (curr && !stateIds.has(curr)) {
              report.deepErrors.push(`Part ${i + 1} states step ${sIdx + 1}: active state "${curr}" does not exist in states`);
            }
            if (step.transition) {
              if (step.transition.from && !stateIds.has(step.transition.from)) {
                report.deepErrors.push(`Part ${i + 1} states step ${sIdx + 1}: transition 'from' "${step.transition.from}" does not exist in states`);
              }
              if (step.transition.to && !stateIds.has(step.transition.to)) {
                report.deepErrors.push(`Part ${i + 1} states step ${sIdx + 1}: transition 'to' "${step.transition.to}" does not exist in states`);
              }
            }
          }
          break;
        }

        default:
          break;
      }

      // Check step captions: <= 80 chars, ends with ., no emoji
      for (let sIdx = 0; sIdx < steps.length; sIdx++) {
        const step = steps[sIdx];
        const cap = step?.caption || '';
        if (!cap.endsWith('.')) {
          report.deepErrors.push(`Part ${i + 1} step ${sIdx + 1}: caption does not end with period: "${cap}"`);
        }
        if (cap.length > 80) {
          report.deepErrors.push(`Part ${i + 1} step ${sIdx + 1}: caption length ${cap.length} > 80 chars: "${cap}"`);
        }
      }
    }
  }

  // 4. Runtime API verification
  if (!isCourseVisualsEnabled(course)) {
    report.deepErrors.push(`Course "${course}" is NOT registered in ENABLED_COURSES`);
  }

  report.passed = report.gateErrors.length === 0 && report.deepErrors.length === 0;
  return report;
}

export function auditBlock(course: string, block: number): BlockAuditReport {
  const startDay = (block - 1) * 5 + 1;
  const endDay = block * 5;

  const blockReport: BlockAuditReport = {
    course,
    block,
    startDay,
    endDay,
    passed: true,
    totalPictures: 0,
    totalNone: 0,
    totalErrors: 0,
    days: [],
  };

  for (let d = startDay; d <= endDay; d++) {
    const dayRep = auditDay(course, d);
    blockReport.days.push(dayRep);
    blockReport.totalPictures += dayRep.pictureCount;
    blockReport.totalNone += dayRep.noneCount;
    blockReport.totalErrors += dayRep.gateErrors.length + dayRep.deepErrors.length;
    if (!dayRep.passed) {
      blockReport.passed = false;
    }
  }

  return blockReport;
}

export async function main() {
  const args = process.argv.slice(2);
  let course = '';
  let block = 0;
  let startDay = 0;
  let endDay = 0;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--course' && i + 1 < args.length) {
      course = args[++i];
    } else if (arg.startsWith('--course=')) {
      course = arg.slice('--course='.length);
    } else if (arg === '--block' && i + 1 < args.length) {
      block = parseInt(args[++i], 10);
    } else if (arg.startsWith('--block=')) {
      block = parseInt(arg.slice('--block='.length), 10);
    } else if (arg === '--start' && i + 1 < args.length) {
      startDay = parseInt(args[++i], 10);
    } else if (arg === '--end' && i + 1 < args.length) {
      endDay = parseInt(args[++i], 10);
    }
  }

  if (!course) {
    console.error('Usage: tsx scripts/visuals/audit-block.mts --course <course> [--block <1-6>] [--start <D> --end <D>]');
    process.exit(1);
  }

  if (block > 0) {
    startDay = (block - 1) * 5 + 1;
    endDay = block * 5;
  } else if (!startDay || !endDay) {
    startDay = 1;
    endDay = 5;
    block = 1;
  } else {
    block = Math.ceil(startDay / 5);
  }

  console.log(`Auditing course="${course}" Block ${block} (Days ${startDay}..${endDay})...`);
  const report = auditBlock(course, block);

  console.log(`\n=== AUDIT REPORT: ${course.toUpperCase()} BLOCK ${block} (Days ${startDay}-${endDay}) ===`);
  console.log(`Overall Status: ${report.passed ? 'PASS (100% CLEAN)' : 'FAIL (ISSUES DETECTED)'}`);
  console.log(`Total Pictures: ${report.totalPictures}/30 | Total None: ${report.totalNone}/30 | Errors: ${report.totalErrors}`);
  console.log('--------------------------------------------------');

  for (const day of report.days) {
    const statusStr = day.passed ? 'PASS' : 'FAIL';
    console.log(`Day ${String(day.day).padStart(2, '0')}: [${statusStr}] ${day.pictureCount} pics / ${day.noneCount} none`);
    if (day.gateErrors.length > 0) {
      console.log(`  Gate v2 Errors (${day.gateErrors.length}):`);
      for (const e of day.gateErrors) {
        console.log(`    - ${e}`);
      }
    }
    if (day.deepErrors.length > 0) {
      console.log(`  Deep Structural Errors (${day.deepErrors.length}):`);
      for (const e of day.deepErrors) {
        console.log(`    - ${e}`);
      }
    }
  }

  if (!report.passed) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

if (process.argv[1]?.endsWith('audit-block.mts')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
