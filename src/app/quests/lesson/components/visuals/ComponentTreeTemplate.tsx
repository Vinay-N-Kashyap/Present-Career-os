import React from 'react';
import type { VisualTone } from '@/lib/types/lessonVisual';
import {
  getToneColor,
  getToneBg,
  getToneTextColor,
  RenderWithFaintSpaces,
} from './visualTokens';

export interface ComponentTreeNode {
  id: string;
  name: string;
  props?: Record<string, string>;
  state?: Record<string, string>;
  children?: string[];
  tone?: VisualTone;
}

export interface ComponentTreeStep {
  at?: string;
  caption: string;
  activeId?: string;
  reRenderingIds?: string[];
  propsPassed?: { from: string; to: string; propName: string; value: string };
  eventFired?: { from: string; to: string; eventName: string };
  tone?: VisualTone;
  nodes?: ComponentTreeNode[];
}

export interface ComponentTreeTemplateProps {
  nodes?: ComponentTreeNode[];
  step: ComponentTreeStep;
  highlightedLabel?: string | null;
  onShapeTap?: (label: string) => void;
  showSpaces?: boolean;
}

export function ComponentTreeTemplate({
  nodes = [],
  step,
  highlightedLabel,
  onShapeTap,
  showSpaces,
}: ComponentTreeTemplateProps): React.ReactElement {
  const effectiveNodes = (step.nodes && step.nodes.length > 0) ? step.nodes : (nodes.length > 0 ? nodes : [
    { id: 'App', name: '<App />', tone: 'idle' },
    { id: 'Header', name: '<Header />', tone: 'idle' },
    { id: 'Feed', name: '<Feed />', tone: 'data' },
    { id: 'PostItem', name: '<PostItem />', tone: 'ok' },
  ]);

  const activeId = step.activeId || effectiveNodes[0]?.id;
  const reRendering = new Set(step.reRenderingIds || []);

  // Compute node hierarchy coordinates
  // Root at top center, level 1, level 2
  const levelMap = new Map<string, number>();
  effectiveNodes.forEach((n, idx) => {
    if (idx === 0) levelMap.set(n.id, 0);
    else if (idx <= 2) levelMap.set(n.id, 1);
    else levelMap.set(n.id, 2);
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        position: 'relative',
      }}
    >
      <svg
        viewBox="0 0 460 220"
        style={{
          width: '100%',
          maxHeight: '220px',
          overflow: 'visible',
        }}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Tree Connection Edges */}
        {effectiveNodes.length >= 2 && (
          <path
            d="M 230 45 L 140 105"
            stroke="var(--border)"
            strokeWidth="1.5"
            strokeDasharray={step.propsPassed?.to === effectiveNodes[1]?.id ? '3 3' : undefined}
          />
        )}
        {effectiveNodes.length >= 3 && (
          <path
            d="M 230 45 L 320 105"
            stroke="var(--border)"
            strokeWidth="1.5"
            strokeDasharray={step.propsPassed?.to === effectiveNodes[2]?.id ? '3 3' : undefined}
          />
        )}
        {effectiveNodes.length >= 4 && (
          <path
            d="M 320 135 L 320 175"
            stroke="var(--border)"
            strokeWidth="1.5"
          />
        )}

        {/* Render Nodes */}
        {effectiveNodes.slice(0, 4).map((node, idx) => {
          let cx = 230;
          let cy = 35;
          if (idx === 1) { cx = 140; cy = 115; }
          if (idx === 2) { cx = 320; cy = 115; }
          if (idx === 3) { cx = 320; cy = 185; }

          const isActive = node.id === activeId;
          const isReRendering = reRendering.has(node.id);
          const tone: VisualTone = isReRendering
            ? 'ok'
            : isActive
            ? (step.tone || node.tone || 'data')
            : (node.tone || 'idle');

          const strokeColor = getToneColor(tone);
          const bgColor = getToneBg(tone);
          const textColor = getToneTextColor(tone);
          const isHighlighted = highlightedLabel && node.name.includes(highlightedLabel);

          return (
            <g
              key={node.id}
              onClick={() => onShapeTap && onShapeTap(node.name)}
              style={{ cursor: onShapeTap ? 'pointer' : 'default' }}
            >
              {/* Outer Glow on Active / Re-render */}
              {(isActive || isReRendering) && (
                <rect
                  x={cx - 58}
                  y={cy - 18}
                  width="116"
                  height="36"
                  rx="8"
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="3"
                  opacity="0.4"
                  filter="url(#glow)"
                />
              )}

              {/* Component Card */}
              <rect
                x={cx - 55}
                y={cy - 16}
                width="110"
                height="32"
                rx="6"
                fill={isActive ? bgColor : 'var(--bg2)'}
                stroke={isHighlighted ? 'var(--accent)' : strokeColor}
                strokeWidth={isActive || isHighlighted ? '2' : '1.2'}
              />

              {/* Component Name */}
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontSize="11.5"
                fontFamily="var(--font-mono, monospace)"
                fontWeight={isActive ? '700' : '600'}
                fill={isActive ? textColor : 'var(--t1)'}
              >
                {node.name}
              </text>

              {/* Re-rendering badge */}
              {isReRendering && (
                <g>
                  <rect
                    x={cx + 35}
                    y={cy - 24}
                    width="26"
                    height="14"
                    rx="3"
                    fill="var(--success)"
                  />
                  <text
                    x={cx + 48}
                    y={cy - 14}
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="800"
                    fill="#ffffff"
                  >
                    DIFF
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Props Pulse Animation Badge */}
        {step.propsPassed && (
          <g>
            <rect
              x="250"
              y="70"
              width="75"
              height="18"
              rx="4"
              fill="var(--bg3)"
              stroke="var(--accent)"
              strokeWidth="1"
            />
            <text
              x="287"
              y="82"
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-mono, monospace)"
              fill="var(--accent)"
              fontWeight="600"
            >
              props: {step.propsPassed.propName}
            </text>
          </g>
        )}

        {/* Event Callback Badge */}
        {step.eventFired && (
          <g>
            <rect
              x="160"
              y="70"
              width="75"
              height="18"
              rx="4"
              fill="var(--bg3)"
              stroke="var(--coral)"
              strokeWidth="1"
            />
            <text
              x="197"
              y="82"
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-mono, monospace)"
              fill="var(--coral)"
              fontWeight="600"
            >
              on{step.eventFired.eventName}()
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
