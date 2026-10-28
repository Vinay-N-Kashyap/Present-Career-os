import React from 'react';
import type { FunnelStep, FunnelStage, VisualTone } from '@/lib/types/lessonVisual';
import {
  getToneColor,
  getToneBg,
  getToneTextColor,
  RenderWithFaintSpaces,
} from './visualTokens';

interface FunnelTemplateProps {
  step: FunnelStep;
  highlightedLabel?: string | null;
  onShapeTap?: (label: string) => void;
  showSpaces?: boolean;
}

export function FunnelTemplate({
  step,
  highlightedLabel,
  onShapeTap,
  showSpaces,
}: FunnelTemplateProps): React.ReactElement {
  const defaultValues = [1000, 720, 480, 260, 140];
  const stages: FunnelStage[] = (step.stages || []).map((st: any, i: number) => ({
    ...st,
    id: st?.id || `stage-${i + 1}`,
    label: st?.label || st?.name || st?.title || `Stage ${i + 1}`,
    value: typeof st?.value === 'number' ? st.value : (typeof st?.count === 'number' ? st.count : (defaultValues[i] ?? Math.max(100, 1000 - i * 180))),
  }));
  const activeStageId = step.activeStageId;

  // Determine baseline value from the top stage or maximum
  const topValue = stages.length > 0 && stages[0].value > 0 ? stages[0].value : 1;

  return (
    <div
      className="visual-funnel-container"
      data-testid="visual-funnel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        padding: '12px 6px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .visual-funnel-container * {
          box-sizing: border-box;
        }
        .funnel-stage-item {
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        .funnel-stage-item:hover {
          transform: scale(1.015);
        }
      `}</style>

      {stages.map((stage, idx) => {
        const isFirst = idx === 0;
        const prevStage = !isFirst ? stages[idx - 1] : null;

        // Proportional width from top stage (clamped between 35% and 100%)
        const ratio = topValue > 0 ? Math.min(1, Math.max(0.1, stage.value / topValue)) : 1;
        const widthPercent = Math.max(38, Math.round(ratio * 100));

        // Calculate conversion rate and dropoff
        const conversionPct =
          stage.percentage !== undefined
            ? stage.percentage
            : Math.round((stage.value / topValue) * 100);

        const dropoffPct =
          stage.dropoffRate !== undefined
            ? stage.dropoffRate
            : prevStage && prevStage.value > 0
            ? Math.round(((prevStage.value - stage.value) / prevStage.value) * 100)
            : 0;

        const isStageActive =
          activeStageId === stage.id ||
          (highlightedLabel &&
            (highlightedLabel.toLowerCase() === stage.id.toLowerCase() ||
              highlightedLabel.toLowerCase() === stage.label.toLowerCase()));

        const tone: VisualTone = stage.tone || (isStageActive ? 'ok' : 'data');
        const stageColor = getToneColor(tone);

        return (
          <div
            key={stage.id || idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              gap: '4px',
            }}
          >
            {/* Dropoff connector indicator between stages */}
            {!isFirst && dropoffPct > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10px',
                  color: 'var(--danger, #ef4444)',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: 'rgba(var(--danger-rgb, 239, 68, 68), 0.08)',
                }}
              >
                <span>↓ -{dropoffPct}% drop-off</span>
              </div>
            )}

            {/* Funnel Stage Bar (tapered trapezoidal aesthetic) */}
            <button
              type="button"
              className="funnel-stage-item"
              data-testid={`funnel-stage-${stage.id || idx}`}
              onClick={() => onShapeTap && onShapeTap(stage.label)}
              style={{
                width: `${widthPercent}%`,
                minWidth: '220px',
                borderRadius: '10px',
                padding: '9px 14px',
                background: isStageActive
                  ? 'color-mix(in srgb, var(--accent) 22%, var(--bg2))'
                  : 'color-mix(in srgb, var(--brand-rgb) 6%, var(--bg2))',
                border: isStageActive ? '2px solid var(--accent)' : `1.5px solid ${stageColor}`,
                boxShadow: isStageActive ? '0 0 12px rgba(var(--brand-rgb), 0.25)' : 'none',
                cursor: onShapeTap ? 'pointer' : 'default',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 800,
                    color: isStageActive ? 'var(--accent)' : 'var(--t1)',
                  }}
                >
                  <RenderWithFaintSpaces text={stage.label} showSpaces={showSpaces} />
                </span>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontFamily: 'var(--font-mono, monospace)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {conversionPct}% of total
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono, monospace)',
                    color: 'var(--t1)',
                  }}
                >
                  {stage.value.toLocaleString()}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: getToneTextColor(tone),
                    background: getToneBg(tone),
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                >
                  Stage {idx + 1}
                </span>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
