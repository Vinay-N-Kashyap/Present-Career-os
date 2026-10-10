import fs from 'node:fs';
import path from 'node:path';

export function createPrng(seedStr: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619) >>> 0;
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0;
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function findPictureKeysForRange(
  course: string,
  fromDay: number,
  toDay: number,
  options?: { manifestPath?: string }
): string[] {
  const keysWithPictures: string[] = [];

  for (let d = fromDay; d <= toDay; d++) {
    const dayPadded = String(d).padStart(2, '0');
    const dayFilePath = path.resolve(
      process.cwd(),
      `src/lib/data/lessonVisuals/${course}/day-${dayPadded}.json`
    );

    if (fs.existsSync(dayFilePath)) {
      try {
        const raw = fs.readFileSync(dayFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.entries)) {
          parsed.entries.forEach((entry: any, i: number) => {
            if (entry?.spec?.template && entry.spec.template !== 'none') {
              keysWithPictures.push(`${course}:${d}:${i}`);
            }
          });
        }
      } catch {
        // ignore parse error and fallback
      }
    } else {
      // Check manifest
      const manifestPath =
        options?.manifestPath ||
        path.resolve(process.cwd(), 'docs/visuals/py_cert_manifest.json');
      if (fs.existsSync(manifestPath)) {
        try {
          const raw = fs.readFileSync(manifestPath, 'utf-8');
          const manifest = JSON.parse(raw);
          for (let i = 0; i < 6; i++) {
            const key = `${course}:${d}:${i}`;
            const item = manifest?.keys?.[key];
            if (item && (item.status === 'pilot' || item.status === 'passed')) {
              keysWithPictures.push(key);
            }
          }
        } catch {
          // ignore
        }
      }
    }
  }

  // Deduplicate and sort alphabetically
  return Array.from(new Set(keysWithPictures)).sort();
}

export function pickKeys(
  course: string,
  fromDay: number,
  toDay: number,
  maxCount: number = 6,
  options?: { manifestPath?: string }
): string[] {
  const allKeys = findPictureKeysForRange(course, fromDay, toDay, options);
  if (allKeys.length <= maxCount) {
    return allKeys;
  }

  const seed = `${course}:${fromDay}-${toDay}`;
  const prng = createPrng(seed);

  // Fisher-Yates shuffle
  const shuffled = [...allKeys];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, maxCount).sort();
}

export async function main() {
  const args = process.argv.slice(2);
  let course = '';
  let daysStr = '';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--course' && i + 1 < args.length) {
      course = args[++i];
    } else if (arg.startsWith('--course=')) {
      course = arg.slice('--course='.length);
    } else if (arg === '--days' && i + 1 < args.length) {
      daysStr = args[++i];
    } else if (arg.startsWith('--days=')) {
      daysStr = arg.slice('--days='.length);
    }
  }

  if (!course || !daysStr) {
    console.error('Usage: npm run visuals:pick -- --course <prefix> --days <a>-<b>');
    process.exit(1);
  }

  const parts = daysStr.split('-');
  const fromDay = parseInt(parts[0], 10);
  const toDay = parseInt(parts[1], 10);

  if (isNaN(fromDay) || isNaN(toDay) || fromDay > toDay) {
    console.error(`Invalid days range: ${daysStr}`);
    process.exit(1);
  }

  const chosen = pickKeys(course, fromDay, toDay, 6);
  const outPath = path.resolve(process.cwd(), 'docs/visuals/shot_keys.txt');

  fs.writeFileSync(outPath, chosen.join('\n') + (chosen.length ? '\n' : ''), 'utf-8');
  console.log(`Picked ${chosen.length} keys for ${course} days ${fromDay}-${toDay}:`);
  for (const k of chosen) {
    console.log(`  ${k}`);
  }
  console.log(`Written to ${outPath}`);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/visuals/pick.mts')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
