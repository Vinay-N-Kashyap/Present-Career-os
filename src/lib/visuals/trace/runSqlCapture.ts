import { PGlite } from '@electric-sql/pglite';
import {
  formatTable,
  resetDatabase,
  splitSqlStatements,
  SQL_TEXT_PARSERS,
  type SqlDatabase,
  type SqlResult,
} from '@/lib/code/sql/sqlCore';

export interface SqlCapturedTable {
  columns: string[];
  rows: Record<string, unknown>[];
}

export interface SqlCaptureResult {
  tables: SqlCapturedTable[];
  error: string;
  output: string;
}

let sharedDbPromise: Promise<SqlDatabase> | null = null;

export function getSharedSqlDb(): Promise<SqlDatabase> {
  if (!sharedDbPromise) {
    sharedDbPromise = PGlite.create({ parsers: SQL_TEXT_PARSERS }) as Promise<SqlDatabase>;
  }
  return sharedDbPromise;
}

/**
 * Runs a SQL lesson's code exactly like runSqlLesson in src/lib/code/sql/sqlCore.ts.
 * Reuses splitSqlStatements and resetDatabase from sqlCore.ts.
 * Returns { tables: [{ columns, rows }], error, output }
 */
export async function runSqlCapture(
  code: string,
  dbInstance?: SqlDatabase
): Promise<SqlCaptureResult> {
  const db = dbInstance || (await getSharedSqlDb());
  await resetDatabase(db);

  const tables: SqlCapturedTable[] = [];
  const shown: string[] = [];
  let capturedError = '';

  for (const statement of splitSqlStatements(code)) {
    try {
      const results: SqlResult[] = await db.exec(statement);
      for (const r of results) {
        if (r.fields.length > 0) {
          shown.push(formatTable(r));
          tables.push({
            columns: r.fields.map((f) => f.name),
            rows: r.rows,
          });
        }
      }
    } catch (err) {
      capturedError = String((err as Error)?.message ?? err).trim();
      shown.push(`[Error] ${capturedError}`);
      break;
    }
  }

  const output = shown.length ? shown.join('\n\n') : 'Done. Nothing to show: add a SELECT to see rows.';

  return {
    tables,
    error: capturedError,
    output,
  };
}
