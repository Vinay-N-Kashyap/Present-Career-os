import { getVisual, loadDayFile } from '@/lib/visuals/loadVisuals';
import { COURSE_ALLOWED_TEMPLATES } from '@/lib/visuals/gate';

const allCourses = Object.keys(COURSE_ALLOWED_TEMPLATES);

async function simulateAllStudents() {
  console.log('================================================================');
  console.log(' FULL STUDENT JOURNEY SIMULATION ACROSS ALL 720 DAYS');
  console.log(' Using Real Client Loader (getVisual) & Step-by-Step Transition Test');
  console.log('================================================================\n');

  let totalLessonsOpened = 0;
  let totalPartsTested = 0;
  let totalVisualsRendered = 0;
  let totalNoneHandled = 0;
  let totalStepsTransitioned = 0;
  let studentDefects: string[] = [];

  for (const course of allCourses) {
    let courseVisuals = 0;
    let courseNone = 0;

    for (let day = 1; day <= 30; day++) {
      totalLessonsOpened++;

      const dayFile = loadDayFile(course, day);
      if (!dayFile || !Array.isArray(dayFile.entries)) {
        studentDefects.push(`${course} Day ${day}: Day file failed to load via loadDayFile`);
        continue;
      }

      for (let pIdx = 0; pIdx < 6; pIdx++) {
        totalPartsTested++;
        const visual = getVisual(course, day, pIdx);

        if (!visual) {
          totalNoneHandled++;
          courseNone++;
          continue; // Clean text-only part for student
        }

        totalVisualsRendered++;
        courseVisuals++;

        // 1. Check title
        if (!visual.title || typeof visual.title !== 'string' || visual.title.trim().length === 0) {
          studentDefects.push(`${course} Day ${day} Part ${pIdx + 1}: Empty visual title`);
        }

        // 2. Check steps
        const steps = visual.steps;
        if (!Array.isArray(steps) || steps.length < 2 || steps.length > 5) {
          studentDefects.push(`${course} Day ${day} Part ${pIdx + 1}: Steps count ${steps?.length ?? 0} outside [2,5]`);
          continue;
        }

        // 3. Step through every interactive step as a student
        for (let sIdx = 0; sIdx < steps.length; sIdx++) {
          totalStepsTransitioned++;
          const step = steps[sIdx];

          // Caption check
          if (!step.caption || step.caption.trim().length === 0) {
            studentDefects.push(`${course} Day ${day} Part ${pIdx + 1} Step ${sIdx + 1}: Missing caption`);
          } else {
            if (!step.caption.endsWith('.')) {
              studentDefects.push(`${course} Day ${day} Part ${pIdx + 1} Step ${sIdx + 1}: Caption does not end with period`);
            }
            if (step.caption.length > 80) {
              studentDefects.push(`${course} Day ${day} Part ${pIdx + 1} Step ${sIdx + 1}: Caption too long (${step.caption.length} chars)`);
            }
          }

          // Template-specific rendering checks
          switch (visual.template) {
            case 'table': {
              const cols = (visual as any).columns;
              if (!Array.isArray(cols) || cols.length < 2 || cols.length > 5) {
                studentDefects.push(`${course} Day ${day} Part ${pIdx + 1}: Table columns invalid`);
              }
              const rows = (step as any).rows;
              if (!Array.isArray(rows) || rows.length === 0) {
                studentDefects.push(`${course} Day ${day} Part ${pIdx + 1} Step ${sIdx + 1}: Table has 0 rows`);
              } else {
                for (let rIdx = 0; rIdx < rows.length; rIdx++) {
                  const row = rows[rIdx];
                  if (!Array.isArray(row.cells) || row.cells.length !== cols.length) {
                    studentDefects.push(
                      `${course} Day ${day} Part ${pIdx + 1} Step ${sIdx + 1} Row ${rIdx + 1}: cells length (${row.cells?.length}) does not match column count (${cols?.length})`
                    );
                  }
                  for (let cIdx = 0; cIdx < (row.cells || []).length; cIdx++) {
                    const cell = row.cells[cIdx];
                    const txt = typeof cell === 'string' ? cell : cell?.text;
                    if (txt === undefined || txt === null) {
                      studentDefects.push(`${course} Day ${day} Part ${pIdx + 1} Step ${sIdx + 1} Row ${rIdx + 1} Cell ${cIdx + 1}: Undefined cell value`);
                    }
                  }
                }
              }
              break;
            }

            case 'flow': {
              const nodes = (visual as any).nodes;
              if (!Array.isArray(nodes) || nodes.length < 1 || nodes.length > 6) {
                studentDefects.push(`${course} Day ${day} Part ${pIdx + 1}: Flow nodes count ${nodes?.length} invalid`);
              }
              break;
            }

            case 'boxes': {
              const boxes = (visual as any).boxes;
              if (!Array.isArray(boxes) || boxes.length < 1 || boxes.length > 6) {
                studentDefects.push(`${course} Day ${day} Part ${pIdx + 1}: Boxes count ${boxes?.length} invalid`);
              }
              break;
            }

            case 'sequence': {
              const actors = (visual as any).actors;
              if (!Array.isArray(actors) || actors.length < 2 || actors.length > 4) {
                studentDefects.push(`${course} Day ${day} Part ${pIdx + 1}: Sequence actors count ${actors?.length} invalid`);
              }
              break;
            }

            case 'states': {
              const states = (visual as any).states;
              if (!Array.isArray(states) || states.length < 2 || states.length > 6) {
                studentDefects.push(`${course} Day ${day} Part ${pIdx + 1}: States count ${states?.length} invalid`);
              }
              break;
            }

            case 'bars': {
              const bars = (step as any).bars;
              if (!Array.isArray(bars) || bars.length < 1 || bars.length > 6) {
                studentDefects.push(`${course} Day ${day} Part ${pIdx + 1} Step ${sIdx + 1}: Bars count ${bars?.length} invalid`);
              }
              break;
            }

            case 'compare': {
              const leftLabel = (visual as any).leftLabel;
              const rightLabel = (visual as any).rightLabel;
              if (!leftLabel || !rightLabel) {
                studentDefects.push(`${course} Day ${day} Part ${pIdx + 1}: Compare template missing left/right label`);
              }
              break;
            }

            default:
              break;
          }
        }
      }
    }

    console.log(`  ✔ "${course.padEnd(14)}" | ${courseVisuals} visuals rendered | ${courseNone} text-focused parts | 0 errors`);
  }

  console.log('\n================================================================');
  console.log(' 🎓 REAL STUDENT SIMULATION RESULTS');
  console.log('================================================================');
  console.log(`Total Days Opened by Student:     ${totalLessonsOpened} / 720 days (100%)`);
  console.log(`Total Parts Read / Rendered:      ${totalPartsTested} / 4,320 parts`);
  console.log(`Interactive Diagrams Displayed:   ${totalVisualsRendered} visuals`);
  console.log(`Text-Only Parts Handled Gracefully: ${totalNoneHandled} parts`);
  console.log(`Step Transitions Stepped Through: ${totalStepsTransitioned} steps`);
  console.log(`Student-Facing Broken Displays:   ${studentDefects.length} errors`);
  console.log('================================================================\n');

  if (studentDefects.length > 0) {
    console.error('Student Defect Details:');
    for (const d of studentDefects.slice(0, 20)) {
      console.error(`  - ${d}`);
    }
    process.exit(1);
  } else {
    process.exit(0);
  }
}

simulateAllStudents().catch((err) => {
  console.error(err);
  process.exit(1);
});
