import React from 'react';
import type { TableStep, VisualTone } from '@/lib/types/lessonVisual';
import { getToneColor, getToneBg, getToneTextColor, RenderWithFaintSpaces } from './visualTokens';

interface TableTemplateProps {
  columns: string[];
  step: TableStep;
  showSpaces?: boolean;
}

export function TableTemplate({ columns, step, showSpaces }: TableTemplateProps): React.ReactElement {
  const colCount = Math.max(2, Math.min(5, columns.length || 2));
  const gridColumnsStyle =
    colCount === 2 ? 'minmax(0, 1.1fr) minmax(0, 1fr)' : `repeat(${colCount}, minmax(0, 1fr))`;

  return (
    <div
      className="visual-table-container"
      style={{
        width: '100%',
        maxWidth: colCount > 2 ? '620px' : '560px',
        margin: '0 auto',
        padding: '8px 4px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <style>{`
        .visual-table-header {
          display: grid;
          gap: 10px;
          padding: 8px 12px;
          border-bottom: 1.5px solid var(--border);
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .visual-table-row {
          display: grid;
          gap: 10px;
          padding: 8px 12px;
        }
        .visual-table-cell {
          font-family: var(--font-mono, monospace);
          font-size: 13px;
          overflow-wrap: break-word;
          word-break: normal;
          white-space: normal;
          line-height: 1.35;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 60px;
        }
        .visual-table-cell-label {
          display: none;
          font-size: 10px;
          font-family: var(--font-sans, system-ui);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 2px;
        }
        @media (max-width: 479px) {
          .visual-table-header {
            display: none !important;
          }
          .visual-table-row {
            display: flex !important;
            flex-direction: column !important;
            gap: 6px !important;
            padding: 8px 10px !important;
          }
          .visual-table-cell {
            width: 100% !important;
            font-size: 12px !important;
          }
          .visual-table-cell-label {
            display: block !important;
          }
        }
      `}</style>

      {/* Table Header for >= 480px */}
      <div className="visual-table-header" style={{ gridTemplateColumns: gridColumnsStyle }}>
        {columns.map((col, idx) => (
          <div key={idx} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {col}
          </div>
        ))}
      </div>

      {/* Table Rows (Cards under 480px) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {step.rows.map((row: { cells: string[]; tone: VisualTone }, idx: number) => {
          const tone = row.tone || 'idle';
          const isIdle = tone === 'idle';

          return (
            <div
              key={idx}
              className="visual-table-row"
              style={{
                gridTemplateColumns: gridColumnsStyle,
                borderRadius: '8px',
                border: `1.5px solid ${getToneColor(tone)}`,
                background: getToneBg(tone),
                transition: 'background 300ms ease, border-color 300ms ease',
                opacity: 1,
              }}
            >
              {row.cells.map((cellText: string, cellIdx: number) => {
                const isLast = cellIdx === row.cells.length - 1;
                const isHighlighted = (tone === 'ok' || tone === 'data') && isLast;
                const colName = columns[cellIdx] ?? `Col ${cellIdx + 1}`;

                return (
                  <div
                    key={cellIdx}
                    className="visual-table-cell"
                    style={{
                      color: isHighlighted ? getToneTextColor(tone) : isIdle ? 'var(--t2)' : 'var(--t1)',
                      fontWeight: isHighlighted ? 600 : 400,
                    }}
                  >
                    <span className="visual-table-cell-label">{colName}</span>
                    <div>
                      <RenderWithFaintSpaces text={cellText} showSpaces={showSpaces} />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
