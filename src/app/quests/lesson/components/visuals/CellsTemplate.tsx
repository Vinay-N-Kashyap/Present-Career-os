import React from 'react';
import type { CellsStep, VisualTone } from '@/lib/types/lessonVisual';
import {
  getToneColor,
  getToneBg,
  getToneTextColor,
  RenderWithFaintSpaces,
} from './visualTokens';

interface CellsTemplateProps {
  step: CellsStep;
  showSpaces?: boolean;
}

export function CellsTemplate({ step, showSpaces }: CellsTemplateProps): React.ReactElement {
  const items = step.items || [];
  const pointers = step.pointers || [];
  const highlightRange = step.highlightRange;

  const isInRange = (i: number): boolean => {
    if (!highlightRange) return false;
    const [start, end] = highlightRange;
    return i >= start && i <= end;
  };

  // Group pointers by index
  const pointersByIndex = new Map<
    number,
    Array<{ name: string; index: number; tone?: VisualTone }>
  >();
  for (const ptr of pointers) {
    const list = pointersByIndex.get(ptr.index) || [];
    list.push(ptr);
    pointersByIndex.set(ptr.index, list);
  }

  return (
    <div
      className="visual-cells-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        width: '100%',
        padding: '12px 6px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .visual-cells-container * {
          box-sizing: border-box;
        }
        @media (prefers-reduced-motion: reduce) {
          .visual-cells-box,
          .visual-cells-ptr {
            transition: none !important;
          }
        }
        .visual-cells-box {
          transition: border-color 0.3s ease, background-color 0.3s ease, transform 0.3s ease;
        }
        .visual-cells-ptr {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
      `}</style>

      {/* Row of cells with pointers above and indices below */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '8px',
          overflowX: 'auto',
          maxWidth: '100%',
          padding: '6px 4px 12px 4px',
        }}
      >
        {items.map((val, idx) => {
          const ptList = pointersByIndex.get(idx) || [];
          const hasPointers = ptList.length > 0;
          const inRange = isInRange(idx);

          // Determine tone
          let tone: VisualTone = 'idle';
          if (step.tones && (step.tones[idx] || (step.tones as Record<string, VisualTone>)[String(idx)])) {
            tone = step.tones[idx] || (step.tones as Record<string, VisualTone>)[String(idx)];
          } else if (hasPointers) {
            tone = ptList[0].tone || 'data';
          } else if (inRange) {
            tone = 'data';
          }

          const primaryPtrTone = hasPointers ? ptList[0].tone || 'data' : 'data';

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                minWidth: '42px',
                flexShrink: 0,
              }}
            >
              {/* Pointer indicator above cell */}
              <div
                className="visual-cells-ptr"
                style={{
                  minHeight: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                {hasPointers ? (
                  <React.Fragment>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '2px',
                        marginBottom: '2px',
                      }}
                    >
                      {ptList.map((p, pIdx) => (
                        <span
                          key={pIdx}
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: '4px',
                            background: getToneBg(p.tone || 'data'),
                            color: getToneTextColor(p.tone || 'data'),
                            border: `1px solid ${getToneColor(p.tone || 'data')}`,
                            letterSpacing: '0.02em',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                    <svg width="12" height="10" viewBox="0 0 12 10" aria-label="pointer arrow">
                      <path
                        d="M 6 0 L 6 8 M 2 4 L 6 8 L 10 4"
                        fill="none"
                        stroke={getToneColor(primaryPtrTone)}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </React.Fragment>
                ) : (
                  <div style={{ height: '10px' }} />
                )}
              </div>

              {/* Cell Box */}
              <div
                className="visual-cells-box"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  border: inRange
                    ? `2px solid var(--accent)`
                    : `1.5px solid ${getToneColor(tone)}`,
                  background: inRange
                    ? 'color-mix(in srgb, var(--accent) 18%, var(--bg1))'
                    : tone === 'idle'
                    ? 'var(--bg2)'
                    : getToneBg(tone),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: tone === 'idle' && !inRange ? 'var(--t1)' : getToneTextColor(tone),
                  boxShadow: inRange
                    ? '0 0 0 2px color-mix(in srgb, var(--accent) 25%, transparent)'
                    : 'none',
                }}
              >
                <RenderWithFaintSpaces text={String(val)} showSpaces={showSpaces} />
              </div>

              {/* Index Number */}
              <div
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontWeight: 500,
                  color: hasPointers ? getToneColor(primaryPtrTone) : 'var(--text-muted)',
                }}
              >
                {idx}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
