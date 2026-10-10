import { auditBlock } from './audit-block.mts';

export const TRACK_1_PYTHON_COURSES = [
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

export const TRACK_2_WEB_COURSES = [
  'react-basics',
  'node-web',
  'dsa-optim',
  'sql-mastery',
  'devops',
  'cloud',
  'dist',
  'cyber',
  'ai',
  'sre-web',
  'stream-web',
  'aideploy-web',
] as const;

export async function runFullMatrixAudit() {
  console.log('================================================================');
  console.log(' PIN-IT CAREER OS — 24 COURSES / 144 BLOCKS MASTER AUDIT');
  console.log('================================================================\n');

  let grandTotalBlocks = 0;
  let grandTotalBlocksPassed = 0;
  let grandTotalDays = 0;
  let grandTotalDaysPassed = 0;
  let grandTotalPictures = 0;
  let grandTotalNone = 0;
  let grandTotalErrors = 0;

  function auditTrack(trackName: string, courses: readonly string[], startBlockNum: number) {
    console.log(`\n>>> AUDITING TRACK: ${trackName} (${courses.length} Courses, 72 Blocks, 360 Days)`);
    let trackBlocksPassed = 0;
    let trackDaysPassed = 0;
    let trackPictures = 0;
    let trackNone = 0;
    let trackErrors = 0;

    let bCounter = startBlockNum;

    for (let cIdx = 0; cIdx < courses.length; cIdx++) {
      const course = courses[cIdx];
      let courseErrors = 0;
      let coursePictures = 0;
      let courseNone = 0;
      let courseBlocksPassed = 0;

      for (let block = 1; block <= 6; block++) {
        bCounter++;
        grandTotalBlocks++;
        const res = auditBlock(course, block);
        if (res.passed) {
          courseBlocksPassed++;
          trackBlocksPassed++;
          grandTotalBlocksPassed++;
        }
        courseErrors += res.totalErrors;
        coursePictures += res.totalPictures;
        courseNone += res.totalNone;

        trackPictures += res.totalPictures;
        trackNone += res.totalNone;
        trackErrors += res.totalErrors;

        for (const day of res.days) {
          grandTotalDays++;
          if (day.passed) {
            trackDaysPassed++;
            grandTotalDaysPassed++;
          } else {
            console.error(`  [FAIL] ${course} Block ${block} Day ${day.day}: ${day.gateErrors.concat(day.deepErrors).join('; ')}`);
          }
        }
      }

      grandTotalPictures += coursePictures;
      grandTotalNone += courseNone;
      grandTotalErrors += courseErrors;

      const statusStr = courseBlocksPassed === 6 ? '100% PASS' : 'FAIL';
      console.log(
        `  Course ${(cIdx + 1).toString().padStart(2, '0')}: [${statusStr}] ${course.padEnd(14)} | ${courseBlocksPassed}/6 blocks | ${coursePictures} pics | ${courseNone} none | ${courseErrors} errs`
      );
    }

    console.log(`\n  Track Summary: ${trackBlocksPassed}/72 blocks passed | ${trackDaysPassed}/360 days passed | ${trackPictures} pics | ${trackNone} none | ${trackErrors} errors`);
  }

  auditTrack('TRACK 1: PYTHON FULL-STACK CERTIFICATION', TRACK_1_PYTHON_COURSES, 0);
  auditTrack('TRACK 2: WEB FULL-STACK CERTIFICATION', TRACK_2_WEB_COURSES, 72);

  console.log('\n================================================================');
  console.log(' GRAND TOTAL CERTIFICATION AUDIT RESULTS');
  console.log('================================================================');
  console.log(`Total Courses Audited: 24 (12 Python + 12 Web)`);
  console.log(`Total 5-Day Blocks:    ${grandTotalBlocksPassed}/${grandTotalBlocks} passed (${((grandTotalBlocksPassed / grandTotalBlocks) * 100).toFixed(1)}%)`);
  console.log(`Total Days Audited:    ${grandTotalDaysPassed}/${grandTotalDays} passed (${((grandTotalDaysPassed / grandTotalDays) * 100).toFixed(1)}%)`);
  console.log(`Total Pictures Active: ${grandTotalPictures} interactive visual specs`);
  console.log(`Total Non-visual Days: ${grandTotalNone} text-focused lesson parts`);
  console.log(`Total Defect Count:    ${grandTotalErrors} errors`);
  console.log('================================================================\n');

  if (grandTotalErrors > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

if (process.argv[1]?.endsWith('audit-full-matrix.mts')) {
  runFullMatrixAudit().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
