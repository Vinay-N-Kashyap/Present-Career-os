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
// - 'ai-py': AI Engineering (Month 4) released via [task:L-ai-py]
// - 'dist-py': Distributed Systems in Python (Month 5) released via [task:L-dist-py]
// - 'cloud-py': Cloud Engineering in Python (Month 6) released via [task:L-cloud-py]
// - 'nlp-py': Natural Language Processing in Python (Month 7) released via [task:L-nlp-py]
// - 'quant-py': Quantitative & Financial Engineering in Python (Month 8) released via [task:L-quant-py]
export const ENABLED_COURSES: readonly string[] = ['python', 'dsa-py', 'sql-mastery', 'ai-py', 'dist-py', 'cloud-py', 'nlp-py', 'quant-py'];

export function isCourseVisualsEnabled(prefix: string): boolean {
  return ENABLED_COURSES.includes(prefix);
}
