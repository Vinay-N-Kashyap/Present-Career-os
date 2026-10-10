import React from 'react';
import type { BarsStep, VisualTone } from '@/lib/types/lessonVisual';
import {
  getToneColor,
  getToneBg,
  getToneTextColor,
  RenderWithFaintSpaces,
} from './visualTokens';

interface BarsTemplateProps {
  step: BarsStep;
  showSpaces?: boolean;
}

export function BarsTemplate({ step, showSpaces }: BarsTemplateProps): React.ReactElement {
  const bars = step.bars || [];

  // Determine maximum value for scaling
  const numericValues = bars
    .map((b) => (typeof b.value === 'number' ? b.value : parseFloat(String(b.value))))
    .filter((n) => !isNaN(n));

  const highestNum = numericValues.length > 0 ? Math.max(...numericValues) : 1;
  const maxVal = step.max !== undefined && step.max > 0 ? step.max : highestNum <= 1 ? 1 : highestNum;

  return (
    <div
      className="visual-bars-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        padding: '12px 6px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .visual-bars-container * {
          box-sizing: border-box;
        }
        @media (prefers-reduced-motion: reduce) {
          .visual-bar-fill {
            transition: none !important;
          }
        }
        .visual-bar-fill {
          transition: width 0.3s ease, background-color 0.3s ease;
        }
      `}</style>

      {bars.map((bar, idx) => {
        const rawNum = typeof bar.value === 'number' ? bar.value : parseFloat(String(bar.value));
        const numVal = isNaN(rawNum) ? 0 : rawNum;
        const pct = maxVal > 0 ? Math.min(100, Math.max(0, (numVal / maxVal) * 100)) : 0;
        const tone: VisualTone = bar.tone || (numVal === 0 ? 'error' : 'data');

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              width: '100%',
            }}
          >
            {/* Header: Label and Value */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                fontSize: '12.5px',
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  color: 'var(--t1)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '75%',
                }}
              >
                <RenderWithFaintSpaces text={bar.label} showSpaces={showSpaces} />
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontWeight: 700,
                  fontSize: '12px',
                  color: getToneTextColor(tone),
                }}
              >
                {String(bar.value)}
              </span>
            </div>

            {/* Track and Fill */}
            <div
              style={{
                width: '100%',
                height: '18px',
                borderRadius: '6px',
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                className="visual-bar-fill"
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  borderRadius: '5px',
                  background: getToneColor(tone),
                  opacity: 0.9,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
