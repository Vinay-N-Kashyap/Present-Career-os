import React from 'react';
import type { TreeGraphStep, VisualTone } from '@/lib/types/lessonVisual';
import {
  getToneColor,
  getToneBg,
  getToneTextColor,
  RenderWithFaintSpaces,
} from './visualTokens';

interface TreeGraphTemplateProps {
  nodes: { id: string; label: string; tone?: VisualTone }[];
  edges: [string, string][];
  step: TreeGraphStep;
  showSpaces?: boolean;
}

interface NodePos {
  x: number;
  y: number;
}

export function TreeGraphTemplate({
  nodes,
  edges,
  step,
  showSpaces,
}: TreeGraphTemplateProps): React.ReactElement {
  const activeNodeId = step.activeNodeId;
  const visitedNodeIds = new Set(step.visitedNodeIds || []);
  const activeEdge = step.activeEdge;

  // Compute node layout (320 x 200 viewport)
  // Determine root/levels using in-degrees
  const inDegree = new Map<string, number>();
  const childrenMap = new Map<string, string[]>();
  for (const n of nodes) {
    inDegree.set(n.id, 0);
    childrenMap.set(n.id, []);
  }
  for (const [from, to] of edges) {
    if (inDegree.has(to)) {
      inDegree.set(to, (inDegree.get(to) || 0) + 1);
    }
    if (childrenMap.has(from)) {
      childrenMap.get(from)!.push(to);
    }
  }

  // Find root nodes (inDegree === 0)
  const roots = nodes.filter((n) => (inDegree.get(n.id) || 0) === 0);
  const startRoots = roots.length > 0 ? roots : [nodes[0]];

  // Assign levels via BFS
  const levels = new Map<string, number>();
  const queue: Array<{ id: string; lvl: number }> = [];
  for (const r of startRoots) {
    if (r) {
      levels.set(r.id, 0);
      queue.push({ id: r.id, lvl: 0 });
    }
  }

  const visitedBfs = new Set<string>();
  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (visitedBfs.has(curr.id)) continue;
    visitedBfs.add(curr.id);

    const children = childrenMap.get(curr.id) || [];
    for (const childId of children) {
      if (!levels.has(childId) || levels.get(childId)! < curr.lvl + 1) {
        levels.set(childId, curr.lvl + 1);
        queue.push({ id: childId, lvl: curr.lvl + 1 });
      }
    }
  }

  // For any unvisited nodes, assign to last level
  for (const n of nodes) {
    if (!levels.has(n.id)) {
      levels.set(n.id, 1);
    }
  }

  // Group by level
  const levelGroups = new Map<number, string[]>();
  for (const [id, lvl] of levels.entries()) {
    const list = levelGroups.get(lvl) || [];
    list.push(id);
    levelGroups.set(lvl, list);
  }

  const sortedLevels = Array.from(levelGroups.keys()).sort((a, b) => a - b);
  const totalLevels = Math.max(1, sortedLevels.length);

  const nodePositions = new Map<string, NodePos>();
  sortedLevels.forEach((lvl, lvlIdx) => {
    const ids = levelGroups.get(lvl)!;
    const y = totalLevels === 1 ? 100 : 36 + (lvlIdx * (148 / (totalLevels - 1)));
    ids.forEach((id, idx) => {
      const x = 320 * ((idx + 1) / (ids.length + 1));
      nodePositions.set(id, { x, y });
    });
  });

  return (
    <div
      className="visual-tree-graph-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        padding: '8px 4px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .visual-tree-graph-container * {
          box-sizing: border-box;
        }
        @media (prefers-reduced-motion: reduce) {
          .visual-tg-node,
          .visual-tg-edge {
            transition: none !important;
          }
        }
        .visual-tg-node {
          transition: all 0.3s ease;
        }
        .visual-tg-edge {
          transition: stroke 0.3s ease, stroke-width 0.3s ease;
        }
      `}</style>

      {/* SVG Canvas for Tree/Graph */}
      <svg
        viewBox="0 0 320 200"
        style={{
          width: '100%',
          maxWidth: '360px',
          height: 'auto',
          display: 'block',
          overflow: 'visible',
        }}
        aria-label="tree graph visualization"
      >
        {/* Draw Edges */}
        {edges.map(([fromId, toId], idx) => {
          const fromPos = nodePositions.get(fromId);
          const toPos = nodePositions.get(toId);
          if (!fromPos || !toPos) return null;

          const isEdgeActive =
            activeEdge && activeEdge[0] === fromId && activeEdge[1] === toId;

          return (
            <line
              key={idx}
              className="visual-tg-edge"
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke={isEdgeActive ? 'var(--accent)' : 'var(--border)'}
              strokeWidth={isEdgeActive ? '2.5' : '1.5'}
              strokeDasharray={isEdgeActive ? '4 2' : 'none'}
              strokeLinecap="round"
            />
          );
        })}

        {/* Draw Nodes */}
        {nodes.map((node) => {
          const pos = nodePositions.get(node.id);
          if (!pos) return null;

          const isActive = node.id === activeNodeId;
          const isVisited = visitedNodeIds.has(node.id);

          let tone: VisualTone = 'idle';
          if (step.tones && step.tones[node.id]) {
            tone = step.tones[node.id];
          } else if (isActive) {
            tone = 'data';
          } else if (isVisited) {
            tone = 'ok';
          } else if (node.tone) {
            tone = node.tone;
          }

          const fillBg = isActive
            ? getToneBg(tone)
            : isVisited
            ? 'color-mix(in srgb, var(--success) 15%, var(--bg1))'
            : 'var(--bg1)';

          const strokeColor = isActive
            ? getToneColor(tone)
            : isVisited
            ? 'var(--success)'
            : 'var(--border)';

          return (
            <g key={node.id} className="visual-tg-node">
              {/* Outer circle ring if active */}
              {isActive && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="23"
                  fill="none"
                  stroke={getToneColor(tone)}
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />
              )}

              {/* Node Circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="18"
                fill={fillBg}
                stroke={strokeColor}
                strokeWidth={isActive ? '2.5' : '1.5'}
              />

              {/* Node text */}
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                fill={isActive ? getToneTextColor(tone) : isVisited ? 'var(--tone-ok-text, var(--success))' : 'var(--t1)'}
                fontFamily="var(--font-mono, monospace)"
                fontSize="12"
                fontWeight="700"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Visited & Active Footer Pills */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}
      >
        {activeNodeId && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'color-mix(in srgb, var(--accent) 15%, transparent)',
              border: '1px solid var(--accent)',
              color: 'var(--tone-data-text, var(--accent))',
              fontWeight: 600,
            }}
          >
            Active: {activeNodeId}
          </span>
        )}
        {visitedNodeIds.size > 0 && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'color-mix(in srgb, var(--success) 12%, transparent)',
              border: '1px solid var(--success)',
              color: 'var(--tone-ok-text, var(--success))',
              fontWeight: 600,
            }}
          >
            Visited: {Array.from(visitedNodeIds).join(', ')}
          </span>
        )}
      </div>
    </div>
  );
}
