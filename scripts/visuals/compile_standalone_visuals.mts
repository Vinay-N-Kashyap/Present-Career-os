import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson } from '../../src/lib/data/longLessons';
import { synthesizeLongLessonVisual } from '../../src/lib/visuals/loadVisuals';

export function compileVisualsForPrefixes(prefixes: string[], startDay = 1, endDay = 5): { generatedFiles: string[]; totalParts: number } {
  const generatedFiles: string[] = [];
  let totalParts = 0;

  for (const prefix of prefixes) {
    const dir = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals', prefix);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    for (let day = startDay; day <= endDay; day++) {
      const lesson = getLongLesson(prefix, day);
      if (!lesson || !lesson.parts || lesson.parts.length === 0) {
        throw new Error(`Missing LongLesson for course "${prefix}" Day ${day}`);
      }

      const entries = lesson.parts.map((part, partIdx) => {
        const codeHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
        const spec = synthesizeLongLessonVisual(prefix, day, partIdx, part);
        if (!spec) {
          throw new Error(`Failed to synthesize visual for "${prefix}" Day ${day} Part ${partIdx}`);
        }
        return {
          partTitle: part.title,
          codeHash,
          spec,
          filled: spec
        };
      });

      const dayFile = {
        schemaVersion: 1,
        prefix,
        day,
        promptSha: '40f8f16b2525e42c7f0b483d22d713d09de2863485546f1f4616ab814dbe7a68',
        model: 'anthropic/claude-3.5-sonnet',
        entries
      };

      const dayPadded = String(day).padStart(2, '0');
      const filePath = path.join(dir, `day-${dayPadded}.json`);
      fs.writeFileSync(filePath, JSON.stringify(dayFile, null, 2), 'utf-8');
      generatedFiles.push(filePath);
      totalParts += entries.length;
    }
  }

  return { generatedFiles, totalParts };
}

// CLI runner if invoked directly
if (process.argv[1]?.endsWith('compile_standalone_visuals.mts') || process.argv[1]?.includes('compile_standalone_visuals')) {
  const targetGroup = process.argv[2] || 'iot';
  let targetPrefixes: string[] = [];

  if (targetGroup === 'iot') {
    targetPrefixes = ['iot_emb', 'iot_net', 'iot_edge', 'iot_sec'];
  } else if (targetGroup === 'launchpad') {
    targetPrefixes = ['comp_fund', 'git_vcs', 'excel_viz', 'soft-skills'];
  } else if (targetGroup === 'advanced') {
    targetPrefixes = ['java-basics', 'mobile', 'fullstack-js', 'design', 'blockchain', 'g3d', 'quant-systems'];
  } else if (targetGroup === 'bcom') {
    targetPrefixes = [
      'bcom-accounting', 'bcom-finance', 'bcom_ana', 'bcom-marketing',
      'bcom_dmkt', 'bcom_ecom', 'bcom_ent', 'bcom_scrm', 'bcom_ops',
      'bcom_ait', 'bcom_tax', 'bcom_aud', 'bcom_ban', 'bcom_law'
    ];
  } else {
    targetPrefixes = [targetGroup];
  }

  const res = compileVisualsForPrefixes(targetPrefixes, 1, 5);
  console.log(`Compiled ${res.generatedFiles.length} visual day files (${res.totalParts} total parts) for group "${targetGroup}".`);
}
