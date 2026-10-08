import React from 'react';
import type { VisualTone } from '@/lib/types/lessonVisual';
import {
  getToneColor,
  getToneBg,
  getToneTextColor,
  RenderWithFaintSpaces,
} from './visualTokens';

export interface WireframeBox {
  id: string;
  label: string;
  width?: string;
  height?: string;
  flex?: string;
  tone?: VisualTone;
}

export interface WireframeStep {
  at?: string;
  caption: string;
  layoutMode?: 'flex-row' | 'flex-col' | 'box-model' | 'grid';
  justifyContent?: string;
  alignItems?: string;
  activeBoxId?: string;
  tone?: VisualTone;
  boxes?: WireframeBox[];
}

export interface WireframeTemplateProps {
  boxes?: WireframeBox[];
  step: WireframeStep;
  highlightedLabel?: string | null;
  onShapeTap?: (label: string) => void;
  showSpaces?: boolean;
}

export function WireframeTemplate({
  boxes = [],
  step,
  highlightedLabel,
  onShapeTap,
  showSpaces,
}: WireframeTemplateProps): React.ReactElement {
  const effectiveBoxes = (step.boxes && step.boxes.length > 0) ? step.boxes : (boxes.length > 0 ? boxes : [
    { id: 'header', label: '<header>', flex: '1', tone: 'idle' },
    { id: 'sidebar', label: '<aside>', flex: '1', tone: 'data' },
    { id: 'content', label: '<main>', flex: '2', tone: 'ok' },
  ]);

  const activeId = step.activeBoxId || effectiveBoxes[1]?.id;
  const isBoxModel = step.layoutMode === 'box-model';
  const isCol = step.layoutMode === 'flex-col';

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
        viewBox="0 0 440 200"
        style={{
          width: '100%',
          maxHeight: '200px',
          overflow: 'visible',
        }}
      >
        {isBoxModel ? (
          /* CSS Box Model Visualizer: Margin -> Border -> Padding -> Content */
          <g>
            {/* Margin (Orange) */}
            <rect
              x="30"
              y="20"
              width="380"
              height="160"
              rx="6"
              fill="color-mix(in srgb, #f97316 12%, transparent)"
              stroke="#f97316"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <text x="40" y="36" fontSize="9" fontWeight="700" fill="#ea580c">
              margin
            </text>

            {/* Border (Amber) */}
            <rect
              x="65"
              y="45"
              width="310"
              height="110"
              rx="5"
              fill="color-mix(in srgb, #eab308 12%, transparent)"
              stroke="#eab308"
              strokeWidth="1.5"
            />
            <text x="75" y="60" fontSize="9" fontWeight="700" fill="#ca8a04">
              border
            </text>

            {/* Padding (Green) */}
            <rect
              x="100"
              y="70"
              width="240"
              height="60"
              rx="4"
              fill="color-mix(in srgb, var(--success) 14%, transparent)"
              stroke="var(--success)"
              strokeWidth="1.5"
            />
            <text x="110" y="85" fontSize="9" fontWeight="700" fill="var(--success)">
              padding
            </text>

            {/* Content (Blue/Accent) */}
            <rect
              x="145"
              y="90"
              width="150"
              height="26"
              rx="3"
              fill="var(--accent)"
            />
            <text
              x="220"
              y="106"
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="#ffffff"
            >
              content 150 &times; 26
            </text>
          </g>
        ) : (
          /* Flexbox / Grid Container Visualizer */
          <g>
            {/* Outer Container */}
            <rect
              x="20"
              y="20"
              width="400"
              height="150"
              rx="8"
              fill="var(--bg2)"
              stroke="var(--border)"
              strokeWidth="1.5"
            />

            {/* Container Label */}
            <text
              x="32"
              y="38"
              fontSize="9.5"
              fontWeight="700"
              fontFamily="var(--font-mono, monospace)"
              fill="var(--text-muted)"
            >
              display: {step.layoutMode || 'flex'}; {step.justifyContent ? `justify-content: ${step.justifyContent}` : ''}
            </text>

            {/* Render Inner Boxes */}
            {effectiveBoxes.map((bx, idx) => {
              const total = effectiveBoxes.length;
              let bxW = isCol ? 360 : (360 - (total - 1) * 12) / total;
              let bxH = isCol ? (110 - (total - 1) * 8) / total : 95;
              let bxX = isCol ? 40 : 40 + idx * (bxW + 12);
              let bxY = isCol ? 48 + idx * (bxH + 8) : 55;

              const isActive = bx.id === activeId;
              const tone: VisualTone = isActive ? (step.tone || bx.tone || 'ok') : (bx.tone || 'idle');
              const strokeColor = getToneColor(tone);
              const bgColor = getToneBg(tone);
              const textColor = getToneTextColor(tone);
              const isHighlighted = highlightedLabel && bx.label.includes(highlightedLabel);

              return (
                <g
                  key={bx.id}
                  onClick={() => onShapeTap && onShapeTap(bx.label)}
                  style={{ cursor: onShapeTap ? 'pointer' : 'default' }}
                >
                  <rect
                    x={bxX}
                    y={bxY}
                    width={bxW}
                    height={bxH}
                    rx="6"
                    fill={isActive ? bgColor : 'var(--bg1)'}
                    stroke={isHighlighted ? 'var(--accent)' : strokeColor}
                    strokeWidth={isActive || isHighlighted ? '2' : '1.2'}
                  />
                  <text
                    x={bxX + bxW / 2}
                    y={bxY + bxH / 2 + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="var(--font-mono, monospace)"
                    fontWeight={isActive ? '700' : '600'}
                    fill={isActive ? textColor : 'var(--t1)'}
                  >
                    {bx.label}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
