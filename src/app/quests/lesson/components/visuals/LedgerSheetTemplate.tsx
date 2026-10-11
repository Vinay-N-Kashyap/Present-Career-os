import React from 'react';
import type { LedgerSheetStep, LedgerEntry, VisualTone } from '@/lib/types/lessonVisual';
import {
  getToneColor,
  getToneBg,
  getToneTextColor,
  RenderWithFaintSpaces,
} from './visualTokens';

interface LedgerSheetTemplateProps {
  step: LedgerSheetStep;
  highlightedLabel?: string | null;
  onShapeTap?: (label: string) => void;
  showSpaces?: boolean;
}

export function LedgerSheetTemplate({
  step,
  highlightedLabel,
  onShapeTap,
  showSpaces,
}: LedgerSheetTemplateProps): React.ReactElement {
  const entries: LedgerEntry[] = step.entries || [];

  // Compute total debits and credits
  const computedTotalDebit =
    step.totalDebit !== undefined
      ? step.totalDebit
      : entries.reduce((sum, e) => sum + (e.debit || 0), 0);

  const computedTotalCredit =
    step.totalCredit !== undefined
      ? step.totalCredit
      : entries.reduce((sum, e) => sum + (e.credit || 0), 0);

  const isBalanced =
    step.isBalanced !== undefined
      ? step.isBalanced
      : Math.abs(computedTotalDebit - computedTotalCredit) < 0.001;

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return '-';
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div
      className="visual-ledger-sheet-container"
      data-testid="visual-ledger-sheet"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        maxWidth: '540px',
        margin: '0 auto',
        padding: '10px 6px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .visual-ledger-sheet-container * {
          box-sizing: border-box;
        }
        .ledger-row {
          transition: background-color 0.15s ease;
        }
        .ledger-row:hover {
          background-color: rgba(var(--brand-rgb), 0.04);
        }
      `}</style>

      {/* Header & Balance Status Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '10px',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--t1)' }}>
          📑 {step.title || 'General Ledger Sheet'}
        </span>

        <span
          data-testid="ledger-balance-badge"
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '6px',
            background: isBalanced ? 'rgba(var(--success-rgb), 0.12)' : 'rgba(var(--danger-rgb), 0.12)',
            color: isBalanced ? 'var(--success)' : 'var(--danger)',
            border: `1px solid ${isBalanced ? 'rgba(var(--success-rgb), 0.3)' : 'rgba(var(--danger-rgb), 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {isBalanced ? '✓ Balanced (Dr = Cr)' : '⚠️ Unbalanced Ledger'}
        </span>
      </div>

      {/* Ledger Table */}
      <div
        style={{
          borderRadius: '10px',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          background: 'var(--card, var(--bg2))',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '11.5px',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr
              style={{
                background: 'rgba(var(--brand-rgb), 0.05)',
                borderBottom: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontSize: '10.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <th style={{ padding: '8px 10px' }}>Ref / Date</th>
              <th style={{ padding: '8px 10px' }}>Account</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Debit (Dr)</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Credit (Cr)</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => {
              const isHighlighted =
                highlightedLabel &&
                (highlightedLabel.toLowerCase() === entry.account.toLowerCase() ||
                  highlightedLabel.toLowerCase() === entry.id.toLowerCase());

              const tone: VisualTone = entry.tone || 'idle';
              const rowBg = isHighlighted
                ? 'color-mix(in srgb, var(--accent) 15%, transparent)'
                : undefined;

              return (
                <tr
                  key={idx}
                  className="ledger-row"
                  onClick={() => onShapeTap && onShapeTap(entry.account)}
                  style={{
                    borderBottom: '1px solid var(--border-light, var(--border))',
                    cursor: onShapeTap ? 'pointer' : 'default',
                    background: rowBg,
                  }}
                >
                  <td
                    style={{
                      padding: '7px 10px',
                      fontFamily: 'var(--font-mono, monospace)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {entry.date || entry.id}
                  </td>
                  <td style={{ padding: '7px 10px', fontWeight: 600, color: 'var(--t1)' }}>
                    <RenderWithFaintSpaces text={entry.account} showSpaces={showSpaces} />
                    {entry.memo && (
                      <span
                        style={{
                          display: 'block',
                          fontSize: '9.5px',
                          color: 'var(--text-muted)',
                          fontWeight: 400,
                        }}
                      >
                        {entry.memo}
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: '7px 10px',
                      textAlign: 'right',
                      fontFamily: 'var(--font-mono, monospace)',
                      color: entry.debit ? 'var(--t1)' : 'var(--text-dim)',
                    }}
                  >
                    {formatCurrency(entry.debit)}
                  </td>
                  <td
                    style={{
                      padding: '7px 10px',
                      textAlign: 'right',
                      fontFamily: 'var(--font-mono, monospace)',
                      color: entry.credit ? 'var(--t1)' : 'var(--text-dim)',
                    }}
                  >
                    {formatCurrency(entry.credit)}
                  </td>
                  <td
                    style={{
                      padding: '7px 10px',
                      textAlign: 'right',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontWeight: 700,
                      color: getToneTextColor(tone),
                    }}
                  >
                    {formatCurrency(entry.balance)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr
              style={{
                background: 'rgba(var(--brand-rgb), 0.03)',
                borderTop: '2px solid var(--border)',
                fontWeight: 800,
                fontSize: '11.5px',
              }}
            >
              <td colSpan={2} style={{ padding: '8px 10px', color: 'var(--t1)' }}>
                Totals
              </td>
              <td
                style={{
                  padding: '8px 10px',
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono, monospace)',
                  color: 'var(--t1)',
                }}
              >
                {formatCurrency(computedTotalDebit)}
              </td>
              <td
                style={{
                  padding: '8px 10px',
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono, monospace)',
                  color: 'var(--t1)',
                }}
              >
                {formatCurrency(computedTotalCredit)}
              </td>
              <td
                style={{
                  padding: '8px 10px',
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono, monospace)',
                  color: isBalanced ? 'var(--success)' : 'var(--danger)',
                }}
              >
                {isBalanced ? '$0.00' : formatCurrency(Math.abs(computedTotalDebit - computedTotalCredit))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
