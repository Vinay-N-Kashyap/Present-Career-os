import type { LessonVisual } from '@/lib/types/lessonVisual';
import { isCourseVisualsEnabled } from '@/lib/visuals/enabledCourses';

export interface DayFileEntry {
  partTitle: string;
  codeHash: string;
  spec: {
    template: string;
    [key: string]: unknown;
  };
  filled: Record<string, unknown>;
}

export interface LessonVisualDayFile {
  schemaVersion: number;
  prefix: string;
  day: number;
  promptSha: string;
  model: string;
  entries: DayFileEntry[];
}

// In-memory cache for loaded day files
const dayFileCache = new Map<string, LessonVisualDayFile | null>();

/**
 * Register a day file in the in-memory cache (useful for testing or pre-bundling).
 */
export function registerDayFile(dayFile: LessonVisualDayFile): void {
  const cacheKey = `${dayFile.prefix}:${dayFile.day}`;
  dayFileCache.set(cacheKey, dayFile);
}

/**
 * Clear the day file in-memory cache (useful for test isolation).
 */
export function clearDayFileCache(): void {
  dayFileCache.clear();
}

/**
 * Synchronously load a day file from disk (in Node / SSR / test environments)
 * or from cache. Returns null if not found or corrupted.
 */
export function loadDayFile(prefix: string, day: number): LessonVisualDayFile | null {
  const cacheKey = `${prefix}:${day}`;
  if (dayFileCache.has(cacheKey)) {
    return dayFileCache.get(cacheKey) ?? null;
  }

  // If running in an environment with Node.js fs (tests, build, server)
  if (typeof window === 'undefined') {
    try {
      // Use eval('require') so client bundlers do not try to bundle fs
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const req = typeof require !== 'undefined' ? require : eval('require');
      const fs = req('node:fs');
      const path = req('node:path');
      const dayPadded = String(day).padStart(2, '0');
      const filePath = path.resolve(
        process.cwd(),
        `src/lib/data/lessonVisuals/${prefix}/day-${dayPadded}.json`
      );

      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        dayFileCache.set(cacheKey, parsed);
        return parsed;
      }
    } catch {
      // Safe fallback on missing file or read/parse error
    }
  }

  dayFileCache.set(cacheKey, null);
  return null;
}

/**
 * Retrieve the visual for a specific lesson part.
 *
 * Rules (Plan E-15, E-21):
 * 1. Load day file only for prefixes listed in enabledCourses.ts.
 * 2. Disabled courses get no visuals (returns null).
 * 3. Missing files return null without crashing.
 */
export function getVisual(
  prefix: string,
  day: number,
  partIndex: number
): LessonVisual | null {
  // 1. Release switch: course must be enabled
  if (!isCourseVisualsEnabled(prefix)) {
    return null;
  }

  // 2. Load from day file
  const dayFile = loadDayFile(prefix, day);
  if (!dayFile || !Array.isArray(dayFile.entries)) {
    return null;
  }

  const entry = dayFile.entries[partIndex];
  if (!entry || !entry.spec) {
    return null;
  }

  if (entry.spec.template === 'none') {
    return null;
  }

  if (entry.filled && typeof entry.filled === 'object') {
    if ('template' in entry.filled && typeof entry.filled.template === 'string') {
      return entry.filled as unknown as LessonVisual;
    }
    if ('visual' in entry.filled && entry.filled.visual) {
      return entry.filled.visual as LessonVisual;
    }
    return entry.filled as unknown as LessonVisual;
  }

  return null;
}
