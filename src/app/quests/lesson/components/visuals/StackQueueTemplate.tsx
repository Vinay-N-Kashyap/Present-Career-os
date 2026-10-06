import React from 'react';
import type { StackQueueStep, VisualTone } from '@/lib/types/lessonVisual';
import {
  getToneColor,
  getToneBg,
  getToneTextColor,
  RenderWithFaintSpaces,
} from './visualTokens';

interface StackQueueTemplateProps {
  step: StackQueueStep;
  mode?: 'stack' | 'queue';
  showSpaces?: boolean;
}

export function StackQueueTemplate({
  step,
  mode: visualMode,
  showSpaces,
}: StackQueueTemplateProps): React.ReactElement {
  const currentMode = step.mode || visualMode || 'stack';
  const items = step.items || [];
  const tones = step.tones || [];
  const action = step.action;
  const actionItem = step.actionItem;

  const isStack = currentMode === 'stack';

  return (
    <div
      className="visual-stack-queue-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        padding: '12px 8px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .visual-stack-queue-container * {
          box-sizing: border-box;
        }
        @media (prefers-reduced-motion: reduce) {
          .visual-sq-item,
          .visual-sq-action {
            transition: none !important;
          }
        }
        .visual-sq-item {
          transition: all 0.3s ease;
        }
        .visual-sq-action {
          transition: all 0.3s ease;
        }
      `}</style>

      {/* Action banner / pill if an action is taking place */}
      {action && action !== 'idle' && (
        <div
          className="visual-sq-action"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '999px',
            background:
              action === 'pop' || action === 'dequeue'
                ? 'color-mix(in srgb, var(--coral) 15%, transparent)'
                : 'color-mix(in srgb, var(--success) 15%, transparent)',
            border: `1px solid ${
              action === 'pop' || action === 'dequeue' ? 'var(--coral)' : 'var(--success)'
            }`,
            fontSize: '12px',
            fontWeight: 600,
            color:
              action === 'pop' || action === 'dequeue'
                ? 'var(--tone-error-text, var(--coral))'
                : 'var(--tone-ok-text, var(--success))',
          }}
        >
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '11px' }}>
            {action}
          </span>
          {actionItem && (
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                background: 'var(--bg1)',
                padding: '1px 6px',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                color: 'var(--t1)',
              }}
            >
              <RenderWithFaintSpaces text={actionItem} showSpaces={showSpaces} />
            </span>
          )}
        </div>
      )}

      {isStack ? (
        /* Vertical Stack Container (open at top) */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '240px',
          }}
        >
          {/* Top Indicator */}
          <div
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 600,
              color: 'var(--accent)',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>TOP</span>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-label="top indicator">
              <path
                d="M 5 1 L 5 9 M 2 6 L 5 9 L 8 6"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Stack Body: open top, bordered left, right, bottom */}
          <div
            style={{
              width: '100%',
              minHeight: '140px',
              borderLeft: '2.5px solid var(--border)',
              borderRight: '2.5px solid var(--border)',
              borderBottom: '3px solid var(--border)',
              borderRadius: '0 0 14px 14px',
              padding: '8px 10px',
              display: 'flex',
              flexDirection: 'column-reverse', // bottom-up: items[0] at bottom
              gap: '6px',
              background: 'var(--bg2)',
            }}
          >
            {items.length === 0 ? (
              <div
                style={{
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  fontStyle: 'italic',
                }}
              >
                (empty stack)
              </div>
            ) : (
              items.map((val, idx) => {
                const tone: VisualTone = tones[idx] || (idx === items.length - 1 ? 'data' : 'idle');
                const isTop = idx === items.length - 1;

                return (
                  <div
                    key={idx}
                    className="visual-sq-item"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: isTop ? `2px solid ${getToneColor(tone)}` : `1px solid ${getToneColor(tone)}`,
                      background: isTop ? getToneBg(tone) : 'var(--bg1)',
                      color: isTop ? getToneTextColor(tone) : 'var(--t1)',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: isTop ? 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))' : 'none',
                    }}
                  >
                    <span>
                      <RenderWithFaintSpaces text={String(val)} showSpaces={showSpaces} />
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        color: 'var(--text-muted)',
                        fontWeight: 400,
                      }}
                    >
                      {idx}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              marginTop: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Stack Base
          </div>
        </div>
      ) : (
        /* Horizontal Queue Container (open at both ends) */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '380px',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '4px',
              padding: '0 8px',
            }}
          >
            <span>IN (Back)</span>
            <span>OUT (Front)</span>
          </div>

          {/* Queue Pipe: bordered top and bottom */}
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              minHeight: '60px',
              borderTop: '2.5px solid var(--border)',
              borderBottom: '2.5px solid var(--border)',
              padding: '8px 6px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              background: 'var(--bg2)',
            }}
          >
            {items.length === 0 ? (
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  fontStyle: 'italic',
                }}
              >
                (empty queue)
              </div>
            ) : (
              items.map((val, idx) => {
                const tone: VisualTone = tones[idx] || (idx === 0 ? 'data' : 'idle');
                const isFront = idx === 0;

                return (
                  <div
                    key={idx}
                    className="visual-sq-item"
                    style={{
                      minWidth: '54px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: isFront ? `2px solid ${getToneColor(tone)}` : `1px solid ${getToneColor(tone)}`,
                      background: isFront ? getToneBg(tone) : 'var(--bg1)',
                      color: isFront ? getToneTextColor(tone) : 'var(--t1)',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '13px',
                      fontWeight: 600,
                      textAlign: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <RenderWithFaintSpaces text={String(val)} showSpaces={showSpaces} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
