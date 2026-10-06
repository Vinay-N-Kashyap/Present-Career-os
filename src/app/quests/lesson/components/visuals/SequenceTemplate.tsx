import React from 'react';
import type { SequenceStep, VisualTone } from '@/lib/types/lessonVisual';
import {
  getToneColor,
  getToneBg,
  getToneTextColor,
  RenderWithFaintSpaces,
} from './visualTokens';

interface SequenceTemplateProps {
  actors: string[];
  step: SequenceStep;
  showSpaces?: boolean;
}

export function SequenceTemplate({
  actors,
  step,
  showSpaces,
}: SequenceTemplateProps): React.ReactElement {
  const actorList = actors && actors.length > 0 ? actors : ['Client', 'Server'];
  const messages = step.messages || [];
  const activeActor = step.activeActor;

  const width = 340;
  const msgRowHeight = 44;
  const topOffset = 50;
  const height = Math.max(160, topOffset + messages.length * msgRowHeight + 20);

  // Compute X position for each actor lifeline
  const actorXMap = new Map<string, number>();
  const actorSpacing = width / (actorList.length + 1);
  actorList.forEach((actor, idx) => {
    actorXMap.set(actor, (idx + 1) * actorSpacing);
  });

  return (
    <div
      className="visual-sequence-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        padding: '10px 4px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .visual-sequence-container * {
          box-sizing: border-box;
        }
        @media (prefers-reduced-motion: reduce) {
          .visual-seq-arrow,
          .visual-seq-actor {
            transition: none !important;
          }
        }
        .visual-seq-arrow {
          transition: all 0.3s ease;
        }
        .visual-seq-actor {
          transition: all 0.3s ease;
        }
      `}</style>

      {/* SVG Canvas for Lifelines and Messages */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          maxWidth: '380px',
          height: 'auto',
          display: 'block',
          overflow: 'visible',
        }}
        aria-label="sequence diagram"
      >
        <defs>
          <marker
            id="seq-arrow-data"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--accent)" />
          </marker>
          <marker
            id="seq-arrow-ok"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--success)" />
          </marker>
          <marker
            id="seq-arrow-error"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--coral)" />
          </marker>
          <marker
            id="seq-arrow-idle"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--border)" />
          </marker>
        </defs>

        {/* Lifelines and Actor Headers */}
        {actorList.map((actor) => {
          const x = actorXMap.get(actor) || 0;
          const isActive = actor === activeActor;

          return (
            <g key={actor} className="visual-seq-actor">
              {/* Vertical Lifeline */}
              <line
                x1={x}
                y1={36}
                x2={x}
                y2={height - 10}
                stroke={isActive ? 'var(--accent)' : 'var(--border)'}
                strokeWidth={isActive ? '2' : '1.5'}
                strokeDasharray="4 4"
              />

              {/* Actor Box */}
              <rect
                x={x - 42}
                y={6}
                width={84}
                height={28}
                rx={6}
                fill={
                  isActive
                    ? 'color-mix(in srgb, var(--accent) 15%, var(--bg1))'
                    : 'var(--bg2)'
                }
                stroke={isActive ? 'var(--accent)' : 'var(--border)'}
                strokeWidth={isActive ? '2' : '1.5'}
              />
              <text
                x={x}
                y={24}
                textAnchor="middle"
                fill={isActive ? 'var(--tone-data-text, var(--accent))' : 'var(--t1)'}
                fontFamily="var(--font-sans, system-ui)"
                fontSize="11.5"
                fontWeight="700"
              >
                {actor}
              </text>
            </g>
          );
        })}

        {/* Message Arrows */}
        {messages.map((msg, idx) => {
          const fromX = actorXMap.get(msg.from) || 0;
          const toX = actorXMap.get(msg.to) || 0;
          const y = topOffset + idx * msgRowHeight + 16;
          const tone: VisualTone = msg.tone || 'data';
          const strokeColor = getToneColor(tone);
          const markerId = `url(#seq-arrow-${tone})`;

          const isSelf = msg.from === msg.to;
          const midX = (fromX + toX) / 2;

          return (
            <g key={idx} className="visual-seq-arrow">
              {isSelf ? (
                /* Self-loopback arrow */
                <path
                  d={`M ${fromX} ${y - 8} C ${fromX + 28} ${y - 8}, ${fromX + 28} ${y + 12}, ${fromX + 4} ${y + 12}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2"
                  markerEnd={markerId}
                />
              ) : (
                /* Normal arrow from -> to */
                <line
                  x1={fromX}
                  y1={y}
                  x2={toX > fromX ? toX - 3 : toX + 3}
                  y2={y}
                  stroke={strokeColor}
                  strokeWidth="2"
                  markerEnd={markerId}
                />
              )}

              {/* Label Pill */}
              <g transform={`translate(${isSelf ? fromX + 34 : midX}, ${y - 10})`}>
                <text
                  x={0}
                  y={0}
                  textAnchor="middle"
                  fill={getToneTextColor(tone)}
                  fontFamily="var(--font-mono, monospace)"
                  fontSize="11"
                  fontWeight="600"
                >
                  {msg.label}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
