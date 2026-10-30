/**
 * Client-side asynchronous loader for long-format lessons.
 *
 * Fetches the requested lesson on demand from the /api/lesson endpoint.
 * This completely decouples client-side pages and components from the
 * 131 MB curriculum corpus, keeping the client bundle lightweight and
 * preventing Webpack from compiling 53 massive data files.
 */

import type { LongLesson } from './longLessonTypes';

const lessonCache = new Map<string, Promise<LongLesson | null>>();

export function getLongLessonAsync(prefix: string, dayNum: number): Promise<LongLesson | null> {
  const key = `${prefix}:${dayNum}`;
  const cached = lessonCache.get(key);
  if (cached) return cached;

  const promise = (async () => {
    try {
      const res = await fetch(`/api/lesson?prefix=${encodeURIComponent(prefix)}&day=${dayNum}`);
      if (!res.ok) return null;
      return (await res.json()) as LongLesson;
    } catch {
      return null;
    }
  })();

  lessonCache.set(key, promise);
  return promise;
}
