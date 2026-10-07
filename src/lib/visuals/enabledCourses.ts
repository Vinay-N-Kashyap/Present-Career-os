/**
 * Release switch (Plan C7 & Task E-15)
 * Lists the course prefixes whose pictures students can see.
 * A course is added only by its release task (L-...), after all its checkpoints are approved.
 * Until then, its pictures exist in the repo but are hidden.
 */
// Released courses:
// - 'python': Python Backend (Month 1) released via [task:L-python]
// - 'dsa-py': DSA in Python (Month 2) released via [task:L-dsa-py]
// - 'sql-mastery': SQL Mastery (Month 3) released via [task:L-sql-mastery]
export const ENABLED_COURSES: readonly string[] = ['python', 'dsa-py', 'sql-mastery'];

export function isCourseVisualsEnabled(prefix: string): boolean {
  return ENABLED_COURSES.includes(prefix);
}
