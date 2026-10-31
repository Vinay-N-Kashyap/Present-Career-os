/**
 * Server-only on-demand reader for precompiled LongLesson archives.
 *
 * Reads compressed per-course archives from src/generated/longLessons/<key>.json.gz
 * so Next.js/Webpack never parses or bundles the 131 MB TypeScript curriculum corpus.
 * Caches up to 8 active courses in an LRU Map to keep server memory bounded (<15 MB).
 */

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import type { LongLesson } from './longLessonTypes';

interface LongLessonsManifest {
  schemaVersion: number;
  prefixes: Record<string, string>;
}

const MAX_CACHED_COURSES = 8;
const ARCHIVE_DIR = path.join(process.cwd(), 'src', 'generated', 'longLessons');
const MANIFEST_FILE = path.join(ARCHIVE_DIR, '_manifest.json');

let cachedManifest: LongLessonsManifest | null | undefined = undefined;
const courseCache = new Map<string, ReadonlyArray<LongLesson>>();

function loadManifest(): LongLessonsManifest | null {
  if (cachedManifest !== undefined) return cachedManifest;
  try {
    if (!fs.existsSync(MANIFEST_FILE)) {
      cachedManifest = null;
      return null;
    }
    cachedManifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8')) as LongLessonsManifest;
    return cachedManifest;
  } catch {
    cachedManifest = null;
    return null;
  }
}

function loadCourseArchive(fileKey: string): ReadonlyArray<LongLesson> | null {
  const hit = courseCache.get(fileKey);
  if (hit) {
    // Refresh LRU order
    courseCache.delete(fileKey);
    courseCache.set(fileKey, hit);
    return hit;
  }

  const archivePath = path.join(ARCHIVE_DIR, `${fileKey}.json.gz`);
  if (!fs.existsSync(archivePath)) return null;

  const compressed = fs.readFileSync(archivePath);
  const jsonText = zlib.gunzipSync(compressed).toString('utf8');
  const parsed = JSON.parse(jsonText) as ReadonlyArray<LongLesson>;

  if (courseCache.size >= MAX_CACHED_COURSES) {
    const oldestKey = courseCache.keys().next().value;
    if (oldestKey) courseCache.delete(oldestKey);
  }
  courseCache.set(fileKey, parsed);
  return parsed;
}

export function getLongLessonServer(prefix: string, dayNum: number): LongLesson | null {
  const manifest = loadManifest();
  if (manifest) {
    const fileKey = manifest.prefixes[prefix];
    if (!fileKey) return null;
    const days = loadCourseArchive(fileKey);
    if (!days) return null;
    return days.find((d) => d.day === dayNum) ?? null;
  }

  // Fallback for direct CLI/tsx test invocations when prebuild/pretest was skipped.
  // Opaque to Webpack so Next.js never traces ./longLessons.ts.
  if (typeof (globalThis as Record<string, unknown>).__webpack_require__ === 'undefined') {
    try {
      const dynamicRequire = eval('require') as NodeRequire;
      const barrel = dynamicRequire('./longLessons') as {
        getLongLesson: (p: string, d: number) => LongLesson | null;
      };
      return barrel.getLongLesson(prefix, dayNum);
    } catch {
      return null;
    }
  }

  return null;
}
