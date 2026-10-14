import React from 'react';
import type { Node, FlowStep, VisualTone } from '@/lib/types/lessonVisual';
import { getToneColor, getToneBg, getToneTextColor, RenderWithFaintSpaces } from './visualTokens';

interface FlowTemplateProps {
  nodes: Node[];
  step: FlowStep;
  highlightedLabel: string | null;
  onShapeTap?: (label: string) => void;
  showSpaces?: boolean;
}

export function FlowTemplate({
  nodes,
  step,
  highlightedLabel,
  onShapeTap,
  showSpaces,
}: FlowTemplateProps): React.ReactElement {
  const isLitArrow = (fromId: string, toId: string): boolean => {
    return (step.arrows || []).some(([from, to]: [string, string]) => from === fromId && to === toId);
  };

  // Check if this is the convergent 2-row layout of 3.6
  const isConvergent =
    nodes.length === 5 &&
    nodes.map((n) => n.id).join(',') === 'item,clean_item,category,clean_category,label';

  const getNodeIcon = (nodeId: string): string => {
    const id = nodeId.toLowerCase();
    if (id.includes('instruction') || id.includes('code')) return '📝';
    if (id.includes('python') || id.includes('engine') || id.includes('interp')) return '⚡';
    if (id.includes('screen') || id.includes('out') || id.includes('term')) return '🖥️';
    if (id.includes('clean')) return '✨';
    if (id.includes('item') || id.includes('cat')) return '🏷️';
    return '📦';
  };

  const getStatusBadge = (nodeId: string, tone: VisualTone, value: string): { label: string; color: string } | null => {
    const id = nodeId.toLowerCase();
    if (tone === 'data') {
      if (id.includes('instruction')) return { label: 'Code Ready', color: 'var(--accent)' };
      if (id.includes('python')) return { label: 'Executing...', color: 'var(--accent)' };
      return { label: 'Active', color: 'var(--accent)' };
    }
    if (tone === 'ok') {
      if (id.includes('screen')) return { label: 'Output Ready', color: 'var(--success)' };
      return { label: 'Success', color: 'var(--success)' };
    }
    if (tone === 'error') {
      return { label: 'Error', color: 'var(--coral)' };
    }
    if (value) {
      return { label: 'Ready', color: 'var(--text-muted)' };
    }
    return null;
  };

  const renderNodeBox = (node: Node) => {
    const isHighlighted =
      highlightedLabel !== null &&
      highlightedLabel.trim().toLowerCase() === node.label.trim().toLowerCase();

    const rawTone: VisualTone = step.tones?.[node.id] || 'idle';
    const effectiveTone: VisualTone = isHighlighted ? 'data' : rawTone;
    const isTappable = node.tappable !== false;
    const value = step.values?.[node.id] || '';
    const isActive = effectiveTone !== 'idle' || isHighlighted;
    const icon = getNodeIcon(node.id);
    const badge = getStatusBadge(node.id, effectiveTone, value);
    const isTerminalScreen = node.id.toLowerCase().includes('screen');
    const isInstructionCode = node.id.toLowerCase().includes('instruction');

    return (
      <div
        key={node.id}
        onClick={isTappable ? () => onShapeTap?.(node.label) : undefined}
        role={isTappable ? 'button' : undefined}
        tabIndex={isTappable ? 0 : undefined}
        onKeyDown={
          isTappable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onShapeTap?.(node.label);
                }
              }
            : undefined
        }
        aria-label={`${node.label}: ${value || 'empty'}`}
        style={{
          border: `2px solid ${getToneColor(effectiveTone)}`,
          background: isActive
            ? `linear-gradient(145deg, ${getToneBg(effectiveTone)}, var(--bg2))`
            : 'var(--bg2)',
          borderRadius: '14px',
          padding: '12px 14px',
          minWidth: '125px',
          maxWidth: '220px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          cursor: isTappable ? 'pointer' : 'default',
          transition: 'all 280ms cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isActive ? 'translateY(-3px)' : 'none',
          boxShadow: isActive
            ? `0 0 20px color-mix(in srgb, ${getToneColor(effectiveTone)} 32%, transparent), 0 4px 12px rgba(0, 0, 0, 0.2)`
            : '0 2px 6px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
        {/* Top Header Row with Icon, Node Label, and Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '14px', lineHeight: 1 }} aria-hidden="true">{icon}</span>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: getToneTextColor(effectiveTone),
              }}
            >
              {node.label}
            </span>
          </div>

          {badge && (
            <span
              style={{
                fontSize: '9.5px',
                fontWeight: 800,
                padding: '1.5px 6px',
                borderRadius: '6px',
                background: `color-mix(in srgb, ${badge.color} 18%, transparent)`,
                color: badge.color,
                border: `1px solid color-mix(in srgb, ${badge.color} 35%, transparent)`,
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
              }}
            >
              {badge.label}
            </span>
          )}
        </div>

        {/* Node Content / Value Display */}
        <div
          style={{
            width: '100%',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--t1)',
            textAlign: isTerminalScreen || isInstructionCode ? 'left' : 'center',
            wordBreak: 'break-word',
            minHeight: '26px',
            background: isTerminalScreen
              ? 'rgba(0, 0, 0, 0.35)'
              : isInstructionCode
              ? 'var(--bg1)'
              : 'transparent',
            padding: (isTerminalScreen || isInstructionCode) && value ? '6px 8px' : '2px 4px',
            borderRadius: '8px',
            border: (isTerminalScreen || isInstructionCode) && value ? '1px solid var(--border)' : 'none',
          }}
        >
          {value ? (
            isTerminalScreen ? (
              <span style={{ color: 'var(--success-bright, var(--success))', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                <span style={{ opacity: 0.6, userSelect: 'none' }}>&gt;</span>
                <RenderWithFaintSpaces text={value} showSpaces={showSpaces} />
              </span>
            ) : (
              <RenderWithFaintSpaces text={value} showSpaces={showSpaces} />
            )
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '11.5px', fontStyle: 'italic' }}>
              {effectiveTone === 'data' && node.id.toLowerCase().includes('python')
                ? 'Processing instructions...'
                : '(waiting...)'}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderArrow = (lit: boolean, key: string) => (
    <div
      key={key}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 4px',
      }}
      aria-hidden="true"
    >
      <svg width="32" height="20" viewBox="0 0 32 20" style={{ flexShrink: 0, overflow: 'visible' }}>
        <path
          d="M 3 10 L 25 10 M 19 4 L 25 10 L 19 16"
          fill="none"
          stroke={lit ? 'var(--accent)' : 'var(--border)'}
          strokeWidth={lit ? '2.8' : '1.8'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={lit ? '6 4' : 'none'}
          style={{
            transition: 'stroke 300ms ease, stroke-width 300ms ease',
            animation: lit ? 'laserDash 0.9s linear infinite' : 'none',
            filter: lit ? 'drop-shadow(0 0 4px var(--accent))' : 'none',
          }}
        />
        {lit && (
          <circle cx="14" cy="10" r="2.5" fill="var(--accent)" filter="drop-shadow(0 0 4px var(--accent))" />
        )}
      </svg>
    </div>
  );

  if (isConvergent) {
    // 3.6 convergent pipeline
    const itemNode = nodes[0];
    const cleanItemNode = nodes[1];
    const catNode = nodes[2];
    const cleanCatNode = nodes[3];
    const labelNode = nodes[4];

    const arrowItem = isLitArrow('item', 'clean_item');
    const arrowCat = isLitArrow('category', 'clean_category');
    const arrowToLabel =
      isLitArrow('clean_item', 'label') || isLitArrow('clean_category', 'label');

    return (
      <div
        data-testid="flow-template-root"
        data-flow-layout="convergent"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          width: '100%',
          padding: '16px 8px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {renderNodeBox(itemNode)}
            {renderArrow(arrowItem, 'a1')}
            {renderNodeBox(cleanItemNode)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {renderNodeBox(catNode)}
            {renderArrow(arrowCat, 'a2')}
            {renderNodeBox(cleanCatNode)}
          </div>
        </div>

        {renderArrow(arrowToLabel, 'a3')}
        {renderNodeBox(labelNode)}
      </div>
    );
  }

  // Linear flow
  return (
    <div
      data-testid="flow-template-root"
      data-flow-layout="linear"
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        padding: '16px 8px',
      }}
    >
      <style>{`
        @keyframes laserDash {
          from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
      {nodes.map((node, i) => {
        const nextNode = nodes[i + 1];
        const lit = nextNode ? isLitArrow(node.id, nextNode.id) : false;

        return (
          <React.Fragment key={node.id}>
            {renderNodeBox(node)}
            {nextNode && renderArrow(lit, `arrow-${node.id}-${nextNode.id}`)}
          </React.Fragment>
        );
      })}
    </div>
  );
}
