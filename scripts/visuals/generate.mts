import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, type LongLesson, type LongLessonPart } from '@/lib/data/longLessons';
import { askForJson } from '@/lib/server/llmJson';
import { visualSpecSchema, type VisualSpec } from '@/lib/visuals/schema';
import { fill } from '@/lib/visuals/fill/fill';
import { checkDayFile, COURSE_ALLOWED_TEMPLATES } from '@/lib/visuals/gate';
import { runPythonTrace } from '@/lib/visuals/trace/runPythonTrace';
import { findUnstable } from '@/lib/visuals/trace/stability';
import { runSqlCapture } from '@/lib/visuals/trace/runSqlCapture';

export const COURSE_METADATA: Record<
  string,
  { name: string; allowed: string[]; hint: string }
> = {
  python: {
    name: 'Python Backend',
    allowed: ['flow', 'boxes', 'table', 'letters', 'compare', 'cells'],
    hint: 'show what each line does to variables and output, one line at a time',
  },
  'dsa-py': {
    name: 'DSA in Python',
    allowed: ['cells', 'stack-queue', 'tree-graph', 'table', 'boxes', 'bars', 'compare'],
    hint: 'show the data structure itself (array cells, stack, tree, graph) and the pointers or visited nodes moving step by step',
  },
  'sql-mastery': {
    name: 'Database Engineering (SQL)',
    allowed: ['table', 'flow', 'compare', 'bars'],
    hint: 'show the result table and how the query changes it (which rows are filtered, joined, grouped)',
  },
  'ai-py': {
    name: 'AI & ML in Python',
    allowed: ['flow', 'table', 'bars', 'sequence', 'compare', 'boxes'],
    hint: 'show the pipeline (prompt, retrieval, model, answer) and the scores or tokens that change',
  },
  'dist-py': {
    name: 'Distributed Python',
    allowed: ['sequence', 'flow', 'states', 'table', 'cells', 'compare'],
    hint: 'show messages between services over time, node states, and what happens when one fails',
  },
  'cloud-py': {
    name: 'Cloud & MLOps Python',
    allowed: ['flow', 'sequence', 'states', 'table', 'bars', 'compare'],
    hint: 'show the request path through cloud components and the states or costs that change',
  },
  'nlp-py': {
    name: 'NLP in Python',
    allowed: ['table', 'cells', 'bars', 'flow', 'compare'],
    hint: 'show tokens or words in cells, their counts or scores, and how the text is transformed',
  },
  'quant-py': {
    name: 'Quant Systems Python',
    allowed: ['table', 'bars', 'flow', 'sequence', 'compare', 'cells'],
    hint: 'show the order book or price table, and the numbers (prices, risk) that change',
  },
  'prompt-py': {
    name: 'AI Prompt Engineering',
    allowed: ['flow', 'table', 'compare', 'bars', 'sequence'],
    hint: 'show prompt in, answer out, and what changes when the prompt changes',
  },
  'train-py': {
    name: 'Model Training Python',
    allowed: ['bars', 'table', 'flow', 'cells', 'sequence', 'compare'],
    hint: 'show memory, loss or throughput numbers as bars, and how data or work is split across devices',
  },
  'vec-py': {
    name: 'Vector Search Python',
    allowed: ['table', 'bars', 'tree-graph', 'cells', 'flow', 'compare'],
    hint: 'show vectors or scores in cells and bars, ranked results, and index structure',
  },
  'safe-py': {
    name: 'AI Safety Python',
    allowed: ['flow', 'table', 'bars', 'compare', 'states'],
    hint: 'show the guardrail pipeline, what is blocked or allowed, and the scores that decide',
  },
};

export interface GeneratorConfig {
  model: string;
}

export interface DayFileEntryResult {
  partTitle: string;
  codeHash: string;
  spec: VisualSpec;
  filled: Record<string, unknown>;
}

export interface GeneratedDayFile {
  schemaVersion: 1;
  prefix: string;
  day: number;
  promptSha: string;
  model: string;
  status?: 'needs-review';
  entries: DayFileEntryResult[];
}

export interface GenerateOptions {
  configPath?: string;
  promptPath?: string;
  manifestPath?: string;
  dryRun?: boolean;
  skipKeyCheck?: boolean;
}

export function loadConfig(configPath?: string): GeneratorConfig {
  const filePath =
    configPath || path.resolve(process.cwd(), 'scripts/visuals/config.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Config file not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export function loadPrompt(promptPath?: string): { text: string; sha: string } {
  const filePath =
    promptPath ||
    path.resolve(process.cwd(), 'docs/visuals/py_cert_generator_prompt.md');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Prompt file not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  const normalized = raw.replace(/\r\n/g, '\n');
  const sha = crypto.createHash('sha256').update(normalized, 'utf-8').digest('hex');
  return { text: normalized, sha };
}

/**
 * Builds trace summary hiding variable values, showing modified vars and hit counts,
 * and flagging unstable variables (Plan C4 Step 1).
 */
export function buildTraceSummary(
  events: [number, number, Record<string, unknown>][],
  unstableVars: string[]
): Array<{ line: number; hits: number; modifiedVariables: string[]; unstableVariables: string[] }> {
  const lineMap = new Map<
    number,
    { hits: number; vars: Set<string>; unstable: Set<string> }
  >();

  for (const [line, hit, vars] of events) {
    if (!lineMap.has(line)) {
      lineMap.set(line, { hits: 0, vars: new Set(), unstable: new Set() });
    }
    const entry = lineMap.get(line)!;
    entry.hits = Math.max(entry.hits, hit);
    for (const vName of Object.keys(vars)) {
      if (unstableVars.includes(vName)) {
        entry.unstable.add(vName);
      } else {
        entry.vars.add(vName);
      }
    }
  }

  return Array.from(lineMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([line, info]) => ({
      line,
      hits: info.hits,
      modifiedVariables: Array.from(info.vars).sort(),
      unstableVariables: Array.from(info.unstable).sort(),
    }));
}

/**
 * Generates and validates visual spec for a single lesson part.
 * Up to 3 attempts, retrying with gate errors.
 */
export async function generatePart(
  prefix: string,
  day: number,
  partIndex: number,
  options?: GenerateOptions
): Promise<{
  entry: DayFileEntryResult;
  status: 'passed' | 'none' | 'needs-review';
  attempts: number;
}> {
  const lesson = getLongLesson(prefix, day);
  if (!lesson) {
    throw new Error(`Lesson not found for course "${prefix}" day ${day}`);
  }
  const part = lesson.parts[partIndex];
  if (!part) {
    throw new Error(`Part [${partIndex}] not found in course "${prefix}" day ${day}`);
  }

  const courseMeta = COURSE_METADATA[prefix] || {
    name: prefix,
    allowed: COURSE_ALLOWED_TEMPLATES[prefix] || [],
    hint: 'create clear diagrams illustrating core concepts step by step',
  };

  const config = loadConfig(options?.configPath);
  const promptInfo = loadPrompt(options?.promptPath);

  // 1. Trace twice
  let runA: any = null;
  let unstableVars: string[] = [];
  let traceSummary: any = null;
  let tablesSummary: any = null;

  if (prefix === 'sql-mastery') {
    const sqlRunA = await runSqlCapture(part.code || '');
    const sqlRunB = await runSqlCapture(part.code || '');
    runA = sqlRunA;
    tablesSummary = sqlRunA.tables.map((t, idx) => ({
      tableIndex: idx + 1,
      columns: t.columns,
    }));
  } else {
    const pyRunA = await runPythonTrace(part.code || '');
    const pyRunB = await runPythonTrace(part.code || '');
    runA = pyRunA;
    unstableVars = findUnstable(pyRunA.events, pyRunB.events);
    traceSummary = buildTraceSummary(pyRunA.events, unstableVars);
  }

  const codeHash = crypto
    .createHash('sha256')
    .update(part.code || '')
    .digest('hex');

  // Say lines mapping
  const sayObj: Record<string, string> = {};
  part.say.forEach((s, idx) => {
    sayObj[`say${idx + 1}`] = s;
  });

  const partPayload = {
    title: part.title,
    say: sayObj,
    example: part.example || '',
    tryIt: part.tryIt || '',
    code: (part.code || '')
      .split('\n')
      .map((l, i) => `${i + 1}: ${l}`)
      .join('\n'),
    output: (runA?.output || part.output || '')
      .split('\n')
      .map((l, i) => `${i + 1}: ${l}`)
      .join('\n'),
  };

  let chosenEntry: DayFileEntryResult | null = null;
  let lastGateError = '';
  let attemptsCount = 0;

  for (let attempt = 1; attempt <= 3; attempt++) {
    attemptsCount = attempt;
    console.log(`Part ${partIndex + 1} (${part.title}): Attempt ${attempt}/3...`);

    const userPayload: any = {
      course: {
        prefix,
        name: courseMeta.name,
        teachingHint: courseMeta.hint,
      },
      allowed: courseMeta.allowed,
      part: partPayload,
      trace: traceSummary,
      tables: tablesSummary,
    };

    if (attempt > 1 && lastGateError) {
      userPayload.previousFailure = `Previous attempt failed gate check: ${lastGateError}. Please fix the issue and return a valid JSON visual spec matching the schema.`;
    }

    const aiRes = await askForJson({
      system: promptInfo.text,
      user: JSON.stringify(userPayload, null, 2),
      schema: visualSpecSchema,
      maxTokens: 4096,
      model: config.model,
    });

    if (!aiRes.ok) {
      lastGateError = aiRes.reason;
      console.log(`  Part ${partIndex + 1} Attempt ${attempt}: AI call rejected: ${lastGateError}`);
      continue;
    }

    const spec = aiRes.data;
    console.log(`  Part ${partIndex + 1} Attempt ${attempt}: chosen template: ${spec.template}`);

    // Fill spec
    let filledData: any = {};
    if (spec.template !== 'none') {
      try {
        filledData = await fill(spec, part, { runResult: runA });
      } catch (fillErr: any) {
        lastGateError = `Fill error: ${fillErr?.message || fillErr}`;
        console.log(`  Part ${partIndex + 1} Attempt ${attempt}: fill error: ${lastGateError}`);
        continue;
      }
    }

    const candidateEntry: DayFileEntryResult = {
      partTitle: part.title,
      codeHash,
      spec,
      filled: filledData,
    };

    // Run gate check
    const testEntries = lesson.parts.map((p, idx) => {
      if (idx === partIndex) return candidateEntry;
      return {
        partTitle: p.title,
        codeHash: crypto.createHash('sha256').update(p.code || '').digest('hex'),
        spec: { template: 'none' as const, reason: 'placeholder' },
        filled: {},
      };
    });

    const tempDayFile = {
      schemaVersion: 1,
      prefix,
      day,
      status: 'needs-review', // bypass R10 while testing individual part
      promptSha: promptInfo.sha,
      model: config.model,
      entries: testEntries,
    };

    const tempManifest = {
      keys: {
        [`${prefix}:${day}:${partIndex}`]: {
          partTitle: part.title,
          status: spec.template === 'none' ? 'none' : 'passed',
        },
      },
    };

    const gateRes = checkDayFile(tempDayFile, {
      manifest: tempManifest,
      unstableVars,
    });

    const partErrors = gateRes.errors.filter((err) => {
      if (err.includes(`Entry [${partIndex}]`)) return true;
      const otherMatch = err.match(/Entry \[(\d+)\]/);
      if (otherMatch && Number(otherMatch[1]) !== partIndex) return false;
      return true;
    });

    if (partErrors.length > 0) {
      lastGateError = partErrors.join('; ');
      console.log(`  Part ${partIndex + 1} Attempt ${attempt} gate check FAIL: ${lastGateError}`);
      continue;
    }

    console.log(`  Part ${partIndex + 1} Attempt ${attempt} gate check PASS`);
    chosenEntry = candidateEntry;
    break;
  }

  if (!chosenEntry) {
    console.log(
      `  Part ${partIndex + 1}: 3 attempts exhausted. Setting template none, status needs-review.`
    );
    chosenEntry = {
      partTitle: part.title,
      codeHash,
      spec: {
        template: 'none',
        reason: `generator: ${lastGateError || 'exceeded 3 attempts'}`,
      },
      filled: {},
    };
    return {
      entry: chosenEntry,
      status: 'needs-review',
      attempts: attemptsCount,
    };
  }

  const status = chosenEntry.spec.template === 'none' ? 'none' : 'passed';
  return {
    entry: chosenEntry,
    status,
    attempts: attemptsCount,
  };
}

/**
 * Generates visuals for all 6 parts of a day, writes day file, and updates manifest.
 */
export async function generateDay(
  prefix: string,
  day: number,
  options?: GenerateOptions
): Promise<{
  dayFile: GeneratedDayFile;
  partStatuses: ('passed' | 'none' | 'needs-review')[];
  pictureCount: number;
}> {
  if (!process.env.OPENROUTER_API_KEY && !options?.skipKeyCheck) {
    throw new Error('OPENROUTER_API_KEY is not set');
  }

  const lesson = getLongLesson(prefix, day);
  if (!lesson) {
    throw new Error(`Lesson not found for course "${prefix}" day ${day}`);
  }

  const config = loadConfig(options?.configPath);
  const promptInfo = loadPrompt(options?.promptPath);

  const finalEntries: DayFileEntryResult[] = [];
  const partStatuses: ('passed' | 'none' | 'needs-review')[] = [];

  for (let i = 0; i < 6; i++) {
    const res = await generatePart(prefix, day, i, options);
    finalEntries.push(res.entry);
    partStatuses.push(res.status);
  }

  const pictureCount = finalEntries.filter((e) => e.spec.template !== 'none').length;
  const dayStatus = pictureCount < 3 ? 'needs-review' : undefined;

  const dayFile: GeneratedDayFile = {
    schemaVersion: 1,
    prefix,
    day,
    promptSha: promptInfo.sha,
    model: config.model,
    ...(dayStatus ? { status: dayStatus } : {}),
    entries: finalEntries,
  };

  if (!options?.dryRun) {
    const dayPadded = String(day).padStart(2, '0');
    const dayDir = path.resolve(
      process.cwd(),
      `src/lib/data/lessonVisuals/${prefix}`
    );
    if (!fs.existsSync(dayDir)) {
      fs.mkdirSync(dayDir, { recursive: true });
    }
    const dayFilePath = path.join(dayDir, `day-${dayPadded}.json`);
    fs.writeFileSync(dayFilePath, JSON.stringify(dayFile, null, 2) + '\n', 'utf-8');
    console.log(`Wrote day file: ${dayFilePath}`);

    // Update manifest
    const manifestPath =
      options?.manifestPath ||
      path.resolve(process.cwd(), 'docs/visuals/py_cert_manifest.json');
    if (fs.existsSync(manifestPath)) {
      const rawManifest = fs.readFileSync(manifestPath, 'utf-8');
      const manifest = JSON.parse(rawManifest);
      if (!manifest.keys) manifest.keys = {};

      for (let i = 0; i < 6; i++) {
        const key = `${prefix}:${day}:${i}`;
        manifest.keys[key] = {
          partTitle: lesson.parts[i].title,
          status: partStatuses[i],
        };
      }
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
      console.log(`Updated manifest keys for ${prefix} day ${day}`);
    }
  }

  return {
    dayFile,
    partStatuses,
    pictureCount,
  };
}

export async function main() {
  const args = process.argv.slice(2);
  let course = '';
  let day = 0;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--course' && i + 1 < args.length) {
      course = args[++i];
    } else if (arg.startsWith('--course=')) {
      course = arg.slice('--course='.length);
    } else if (arg === '--day' && i + 1 < args.length) {
      day = parseInt(args[++i], 10);
    } else if (arg.startsWith('--day=')) {
      day = parseInt(arg.slice('--day='.length), 10);
    }
  }

  if (!course || !day) {
    console.error('Usage: npm run visuals:generate -- --course <prefix> --day <N>');
    process.exit(1);
  }

  if (!process.env.OPENROUTER_API_KEY) {
    console.error('OPENROUTER_API_KEY is not set');
    process.exit(1);
  }

  try {
    const res = await generateDay(course, day);
    console.log(
      `Generated visuals for ${course} day ${day}: ${res.pictureCount}/6 pictures.`
    );
    console.log(`Statuses: ${res.partStatuses.join(', ')}`);
  } catch (err: any) {
    console.error(`Generation failed: ${err?.message || err}`);
    process.exit(1);
  }
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/visuals/generate.mts')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
