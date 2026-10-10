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
    dayFileCache.set(cacheKey, null);
    return null;
  }

  // In browser, return from cache if present; otherwise return null without locking cache
  return dayFileCache.get(cacheKey) ?? null;
}

/**
 * Asynchronously fetch and cache a day file in browser/client environments,
 * or load synchronously in Node environments.
 */
export async function fetchAndCacheDayFile(
  prefix: string,
  day: number
): Promise<LessonVisualDayFile | null> {
  const cacheKey = `${prefix}:${day}`;
  if (dayFileCache.has(cacheKey) && dayFileCache.get(cacheKey) !== null) {
    return dayFileCache.get(cacheKey)!;
  }

  if (!isCourseVisualsEnabled(prefix)) {
    return null;
  }

  // Node environment
  if (typeof window === 'undefined') {
    return loadDayFile(prefix, day);
  }

  // Browser environment: fetch from API endpoint
  try {
    const res = await fetch(`/api/visuals?prefix=${encodeURIComponent(prefix)}&day=${day}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.entries)) {
        registerDayFile(data);
        return data;
      }
    }
  } catch {
    // Non-fatal network error
  }

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

  let visual: LessonVisual | null = null;
  if (entry.filled && typeof entry.filled === 'object') {
    if ('template' in entry.filled && typeof entry.filled.template === 'string') {
      visual = entry.filled as unknown as LessonVisual;
    } else if ('visual' in entry.filled && entry.filled.visual) {
      visual = entry.filled.visual as LessonVisual;
    } else {
      visual = entry.filled as unknown as LessonVisual;
    }
  } else if (entry.spec && typeof entry.spec === 'object' && 'template' in entry.spec && entry.spec.template !== 'none') {
    visual = entry.spec as unknown as LessonVisual;
  }

  if (!visual) {
    return null;
  }

  // Normalization for robust student rendering:
  // 1. Compare template: ensure leftLabel and rightLabel are defined
  if (visual.template === 'compare') {
    const cv = visual as any;
    if (!cv.leftLabel) {
      cv.leftLabel = cv.left?.title || cv.left?.label || 'Left';
    }
    if (!cv.rightLabel) {
      cv.rightLabel = cv.right?.title || cv.right?.label || 'Right';
    }
  }

  // 2. Bars template: ensure step.bars is populated if visual.bars or visual.items exists
  if (visual.template === 'bars') {
    const rawBars = Array.isArray((visual as any).bars)
      ? (visual as any).bars
      : Array.isArray((visual as any).items)
      ? (visual as any).items
      : [];
    if (rawBars.length > 0 && Array.isArray(visual.steps)) {
      for (const step of visual.steps) {
        const s = step as any;
        if (!Array.isArray(s.bars) || s.bars.length === 0) {
          const activeIdx = s.activeBarIndex ?? -1;
          const badge = s.statusBadge;
          s.bars = rawBars.map((b: any, bIdx: number) => ({
            label: b.label || `Item ${bIdx + 1}`,
            value: b.value ?? 0,
            tone: b.tone || (bIdx === activeIdx ? (badge === 'completed' ? 'ok' : 'data') : 'idle'),
          }));
        }
      }
    }
  }

  return visual;
}
