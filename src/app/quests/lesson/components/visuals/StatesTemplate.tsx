import React from 'react';
import type { StatesStep, VisualTone } from '@/lib/types/lessonVisual';
import {
  getToneColor,
  getToneBg,
  getToneTextColor,
  RenderWithFaintSpaces,
} from './visualTokens';

interface StatesTemplateProps {
  states: { id: string; label: string }[];
  step: StatesStep;
  showSpaces?: boolean;
}

export function StatesTemplate({
  states,
  step,
  showSpaces,
}: StatesTemplateProps): React.ReactElement {
  const stateList = states && states.length > 0 ? states : [];
  const currentStateId = step.currentState;
  const transition = step.transition;
  const currentTone: VisualTone = step.tone || 'data';

  return (
    <div
      className="visual-states-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        padding: '16px 8px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .visual-states-container * {
          box-sizing: border-box;
        }
        @media (prefers-reduced-motion: reduce) {
          .visual-state-node,
          .visual-state-transition {
            transition: none !important;
          }
        }
        .visual-state-node {
          transition: all 0.3s ease;
        }
        .visual-state-transition {
          transition: all 0.3s ease;
        }
      `}</style>

      {/* Row of State Nodes */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          width: '100%',
        }}
      >
        {stateList.map((st) => {
          const isCurrent = st.id === currentStateId;
          const tone = isCurrent ? currentTone : 'idle';

          return (
            <div
              key={st.id}
              className="visual-state-node"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '12px',
                border: isCurrent
                  ? `2px solid ${getToneColor(tone)}`
                  : '1.5px solid var(--border)',
                background: isCurrent ? getToneBg(tone) : 'var(--bg2)',
                color: isCurrent ? getToneTextColor(tone) : 'var(--text-muted)',
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 700,
                fontSize: '13px',
                minWidth: '90px',
                textAlign: 'center',
                boxShadow: isCurrent
                  ? `0 0 0 3px color-mix(in srgb, ${getToneColor(tone)} 20%, transparent)`
                  : 'none',
              }}
            >
              <span>
                <RenderWithFaintSpaces text={st.label} showSpaces={showSpaces} />
              </span>
              {isCurrent && (
                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: getToneTextColor(tone),
                    background: 'color-mix(in srgb, var(--bg1) 80%, transparent)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    border: `1px solid ${getToneColor(tone)}`,
                  }}
                >
                  CURRENT
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Transition Banner (if transitioning) */}
      {transition && (
        <div
          className="visual-state-transition"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '8px',
            background: 'var(--bg1)',
            border: '1px solid var(--border)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--t1)',
            maxWidth: '100%',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono, monospace)' }}>
            {transition.from}
          </span>
          <svg width="16" height="12" viewBox="0 0 16 12" aria-label="transition arrow">
            <path
              d="M 1 6 L 15 6 M 10 1 L 15 6 L 10 11"
              fill="none"
              stroke={getToneColor(currentTone)}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono, monospace)' }}>
            {transition.to}
          </span>
          {transition.label && (
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '11px',
                marginLeft: '4px',
              }}
            >
              ({transition.label})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
