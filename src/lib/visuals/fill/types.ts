import type { PyodideInterface } from 'pyodide';
import type { SqlDatabase } from '@/lib/code/sql/sqlCore';
import type { TraceEvent } from '../trace/runPythonTrace';
import type { SqlCapturedTable } from '../trace/runSqlCapture';
import type { Binding, StepBaseSpec } from '@/lib/types/lessonVisual';
import type { LongLessonPart } from '@/lib/data/longLessons';

export interface RunResult {
  language: 'python' | 'sql';
  output: string;
  error: string;
  events?: TraceEvent[];
  tables?: SqlCapturedTable[];
}

export interface FillOptions {
  pyodide?: PyodideInterface;
  db?: SqlDatabase;
  language?: 'python' | 'sql';
}

export interface FillRunContext {
  part: LongLessonPart;
  options?: FillOptions;
  getBaseRun(): Promise<RunResult>;
  getRunForStep(step: StepBaseSpec): Promise<RunResult>;
  runSnippet(code: string): Promise<RunResult>;
  resolveBinding(binding: Binding, step: StepBaseSpec, runResult?: RunResult): string;
}
