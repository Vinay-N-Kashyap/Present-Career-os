import React from 'react';
import type { VisualTone } from '@/lib/types/lessonVisual';
import {
  getToneColor,
  getToneBg,
  getToneTextColor,
  RenderWithFaintSpaces,
} from './visualTokens';

export interface WorkflowStageNode {
  id: string;
  name: string;
  subtext?: string;
  tone?: VisualTone;
  badge?: string;
}

export interface WorkflowStep {
  at?: string;
  caption: string;
  activeStageId?: string;
  statusBadge?: string;
  throughput?: string;
  tone?: VisualTone;
  stages?: WorkflowStageNode[];
}

export interface WorkflowTemplateProps {
  stages?: WorkflowStageNode[];
  step: WorkflowStep;
  highlightedLabel?: string | null;
  onShapeTap?: (label: string) => void;
  showSpaces?: boolean;
}

export function WorkflowTemplate({
  stages = [],
  step,
  highlightedLabel,
  onShapeTap,
  showSpaces,
}: WorkflowTemplateProps): React.ReactElement {
  const fallbackStages: WorkflowStageNode[] = [
    { id: 'client', name: 'Browser Client', subtext: 'HTTP / WS', tone: 'idle' },
    { id: 'ingress', name: 'API Gateway', subtext: 'Reverse Proxy', tone: 'data' },
    { id: 'service', name: 'App Service', subtext: 'Worker Pods', tone: 'ok' },
    { id: 'db', name: 'Database', subtext: 'Postgres / Redis', tone: 'idle' },
  ];
  const effectiveStages: WorkflowStageNode[] = (step.stages && step.stages.length > 0) ? step.stages : (stages.length > 0 ? stages : fallbackStages);

  const activeId = step.activeStageId || effectiveStages[1]?.id;

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
        viewBox="0 0 480 200"
        style={{
          width: '100%',
          maxHeight: '200px',
          overflow: 'visible',
        }}
      >
        <defs>
          <marker
            id="workflow-arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--border)" />
          </marker>
          <marker
            id="workflow-arrow-active"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--accent)" />
          </marker>
        </defs>

        {/* Directed Arrows connecting Stages */}
        {effectiveStages.map((_, idx) => {
          if (idx === effectiveStages.length - 1) return null;
          const x1 = 45 + idx * 115 + 85;
          const x2 = 45 + (idx + 1) * 115;
          const y = 95;
          const isNextActive = effectiveStages[idx + 1]?.id === activeId;

          return (
            <line
              key={idx}
              x1={x1}
              y1={y}
              x2={x2 - 5}
              y2={y}
              stroke={isNextActive ? 'var(--accent)' : 'var(--border)'}
              strokeWidth={isNextActive ? '2' : '1.5'}
              strokeDasharray={isNextActive ? '4 2' : undefined}
              markerEnd={isNextActive ? 'url(#workflow-arrow-active)' : 'url(#workflow-arrow)'}
            />
          );
        })}

        {/* Workflow Stages */}
        {effectiveStages.map((st, idx) => {
          const x = 30 + idx * 115;
          const y = 60;
          const isActive = st.id === activeId;
          const tone: VisualTone = isActive ? (step.tone || st.tone || 'data') : (st.tone || 'idle');
          const strokeColor = getToneColor(tone);
          const bgColor = getToneBg(tone);
          const textColor = getToneTextColor(tone);
          const isHighlighted = highlightedLabel && st.name.includes(highlightedLabel);

          return (
            <g
              key={st.id}
              onClick={() => onShapeTap && onShapeTap(st.name)}
              style={{ cursor: onShapeTap ? 'pointer' : 'default' }}
            >
              {/* Outer Card */}
              <rect
                x={x}
                y={y}
                width="85"
                height="70"
                rx="8"
                fill={isActive ? bgColor : 'var(--bg2)'}
                stroke={isHighlighted ? 'var(--accent)' : strokeColor}
                strokeWidth={isActive || isHighlighted ? '2' : '1.2'}
              />

              {/* Stage Step Number Badge */}
              <circle
                cx={x + 12}
                cy={y + 12}
                r="7"
                fill={isActive ? strokeColor : 'var(--border)'}
              />
              <text
                x={x + 12}
                y={y + 15}
                textAnchor="middle"
                fontSize="8"
                fontWeight="800"
                fill="#ffffff"
              >
                {idx + 1}
              </text>

              {/* Stage Name */}
              <text
                x={x + 42}
                y={y + 36}
                textAnchor="middle"
                fontSize="10"
                fontFamily="var(--font-mono, monospace)"
                fontWeight={isActive ? '700' : '600'}
                fill={isActive ? textColor : 'var(--t1)'}
              >
                {st.name}
              </text>

              {/* Subtext */}
              {st.subtext && (
                <text
                  x={x + 42}
                  y={y + 52}
                  textAnchor="middle"
                  fontSize="8"
                  fill="var(--text-muted)"
                >
                  {st.subtext}
                </text>
              )}

              {/* Active Pulse Pill */}
              {isActive && (step.statusBadge || st.badge) && (
                <g>
                  <rect
                    x={x + 8}
                    y={y + 75}
                    width="70"
                    height="16"
                    rx="4"
                    fill="var(--bg3)"
                    stroke={strokeColor}
                    strokeWidth="1"
                  />
                  <text
                    x={x + 43}
                    y={y + 86}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="700"
                    fill={textColor}
                  >
                    {step.statusBadge || st.badge}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
