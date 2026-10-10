import type { TraceEvent } from './runPythonTrace';

/**
 * Compares trace events from two independent runs of the same code.
 * Returns the names of all variables whose values differ between the two runs.
 * Variables that change across runs (e.g. random numbers, set iterations)
 * are marked unstable and must not be bound in visual specs (Rule R14).
 */
export function findUnstable(eventsA: TraceEvent[], eventsB: TraceEvent[]): string[] {
  const unstable = new Set<string>();

  const minLen = Math.min(eventsA.length, eventsB.length);
  for (let i = 0; i < minLen; i++) {
    const [lineA, hitA, varsA] = eventsA[i];
    const [lineB, hitB, varsB] = eventsB[i];

    if (lineA !== lineB || hitA !== hitB) {
      continue;
    }

    const allKeys = new Set([...Object.keys(varsA), ...Object.keys(varsB)]);
    for (const key of allKeys) {
      const valA = JSON.stringify(varsA[key]);
      const valB = JSON.stringify(varsB[key]);
      if (valA !== valB) {
        unstable.add(key);
      }
    }
  }

  return Array.from(unstable).sort();
}
