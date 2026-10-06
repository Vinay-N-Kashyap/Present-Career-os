import type { Binding, StepBaseSpec } from '@/lib/types/lessonVisual';
import type { RunResult } from './types';
import { formatValue } from '../trace/formatValue';

export function getPythonTypeName(val: unknown): string {
  if (val === null || val === undefined) return 'NoneType';
  if (typeof val === 'boolean') return 'bool';
  if (typeof val === 'number') {
    return Number.isInteger(val) ? 'int' : 'float';
  }
  if (typeof val === 'string') return 'str';
  if (Array.isArray(val)) return 'list';
  if (typeof val === 'object') {
    const obj = val as Record<string, unknown>;
    if ('__obj__' in obj) return String(obj.__obj__);
    if ('__set__' in obj) return 'set';
    if ('__tuple__' in obj) return 'tuple';
    if ('__dict__' in obj) return 'dict';
    return 'dict';
  }
  return typeof val;
}

export function extractErrorName(errorStr: string): string {
  const trimmed = errorStr.trim();
  const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*Error)/);
  if (match) return match[1];
  const colonIdx = trimmed.indexOf(':');
  if (colonIdx !== -1) {
    return trimmed.substring(0, colonIdx).trim();
  }
  return trimmed;
}

export function resolveBinding(
  binding: Binding,
  step: StepBaseSpec,
  runResult: RunResult
): string {
  if ('text' in binding) {
    return binding.text;
  }

  if ('error' in binding && binding.error === true) {
    if (!runResult.error) {
      throw new Error(
        `Cannot resolve binding {"error": true} at step "${step.at}": code ran without error`
      );
    }
    return extractErrorName(runResult.error);
  }

  if ('out' in binding) {
    const lines = runResult.output.split('\n');
    const lineIdx = binding.out - 1;
    if (lineIdx < 0 || lineIdx >= lines.length) {
      throw new Error(
        `Cannot resolve binding {"out": ${binding.out}} at step "${step.at}": output has only ${lines.length} lines`
      );
    }
    return lines[lineIdx];
  }

  if ('var' in binding) {
    if (!runResult.events || runResult.events.length === 0) {
      throw new Error(
        `Cannot resolve binding ${JSON.stringify(binding)} at step "${step.at}": no trace events recorded`
      );
    }
    const lineEvents = runResult.events.filter(([line]) => line === binding.line);
    const hit = binding.hit ?? 1;
    if (hit < 1 || hit > lineEvents.length) {
      throw new Error(
        `Cannot resolve binding ${JSON.stringify(binding)} at step "${step.at}": line ${binding.line} only ran ${lineEvents.length} time(s)`
      );
    }
    const event = lineEvents[hit - 1];
    const vars = event[2];
    if (!(binding.var in vars)) {
      throw new Error(
        `Cannot resolve binding ${JSON.stringify(binding)} at step "${step.at}": variable "${binding.var}" not found in variables`
      );
    }
    const val = vars[binding.var];
    if (binding.as === 'type') {
      return getPythonTypeName(val);
    }
    return formatValue(val);
  }

  if ('table' in binding) {
    if (!runResult.tables || runResult.tables.length === 0) {
      throw new Error(
        `Cannot resolve binding ${JSON.stringify(binding)} at step "${step.at}": no SQL tables captured`
      );
    }
    const tableIdx = binding.table - 1;
    if (tableIdx < 0 || tableIdx >= runResult.tables.length) {
      throw new Error(
        `Cannot resolve binding ${JSON.stringify(binding)} at step "${step.at}": table index ${binding.table} out of range (${runResult.tables.length} tables)`
      );
    }
    const tbl = runResult.tables[tableIdx];
    if (binding.row !== undefined && binding.col !== undefined) {
      const rowIdx = binding.row - 1;
      if (rowIdx < 0 || rowIdx >= tbl.rows.length) {
        throw new Error(
          `Cannot resolve binding ${JSON.stringify(binding)} at step "${step.at}": row ${binding.row} out of range (${tbl.rows.length} rows)`
        );
      }
      const row = tbl.rows[rowIdx];
      if (!(binding.col in row)) {
        throw new Error(
          `Cannot resolve binding ${JSON.stringify(binding)} at step "${step.at}": column "${binding.col}" not found in table ${binding.table}`
        );
      }
      return String(row[binding.col]);
    }
    return JSON.stringify(tbl);
  }

  throw new Error(
    `Cannot resolve unknown binding ${JSON.stringify(binding)} at step "${step.at}"`
  );
}
