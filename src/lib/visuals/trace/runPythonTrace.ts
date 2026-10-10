import { loadPyodide, type PyodideInterface } from 'pyodide';
import { PYTHON_TRACER_SOURCE } from './pythonTracer';
export { PYTHON_TRACER_SOURCE };

export type TraceEvent = [
  line: number,
  hit: number,
  variables: Record<string, unknown>
];

export interface PythonTraceResult {
  events: TraceEvent[];
  output: string;
  error: string;
  truncated: boolean;
}

let sharedPyodidePromise: Promise<PyodideInterface> | null = null;

export function getSharedPyodide(): Promise<PyodideInterface> {
  if (!sharedPyodidePromise) {
    sharedPyodidePromise = loadPyodide();
  }
  return sharedPyodidePromise;
}

/**
 * Runs Python code under the reference tracer (py_cert_reference_tracer.py).
 * - tracer runs in its own dict (tg), lesson in a second fresh dict (g)
 * - returns {events, output, error, truncated}
 * - output is formatted like runLikeLessonPage in tests/python_long_lessons.test.ts
 */
export async function runPythonTrace(
  code: string,
  pyodideInstance?: PyodideInterface
): Promise<PythonTraceResult> {
  const pyodide = pyodideInstance || (await getSharedPyodide());
  const out: string[] = [];
  pyodide.setStdout({ batched: (line: string) => out.push(line) });
  pyodide.setStderr({ batched: (line: string) => out.push(line) });

  // 1. Tracer in its own fresh dict
  const tg = pyodide.globals.get('dict')();
  pyodide.runPython(PYTHON_TRACER_SOURCE, { globals: tg });

  // 2. Lesson in a second fresh dict
  const g = pyodide.globals.get('dict')();
  g.set('__name__', '__main__');

  let error = '';
  try {
    const runFn = tg.get('run');
    runFn(code, g);
  } catch (err) {
    const lines = String((err as Error).message).trim().split('\n');
    error = lines[lines.length - 1];
  }

  let events: TraceEvent[] = [];
  let truncated = false;

  try {
    const evPy = tg.get('EV');
    events = evPy.toJs({ dict_converter: Object.fromEntries }) as TraceEvent[];
    const statePy = tg.get('STATE');
    const stateJs = statePy.toJs({ dict_converter: Object.fromEntries }) as { trunc?: boolean };
    truncated = Boolean(stateJs.trunc);
  } finally {
    tg.destroy();
    g.destroy();
  }

  const output = [out.join('\n'), error ? `[Error] ${error}` : ''].filter(Boolean).join('\n');

  return {
    events,
    output,
    error,
    truncated,
  };
}
