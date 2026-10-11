import React from 'react';
import type { RegisterBitsStep, RegisterBit, VisualTone } from '@/lib/types/lessonVisual';
import {
  getToneColor,
  getToneBg,
  getToneTextColor,
  RenderWithFaintSpaces,
} from './visualTokens';

interface RegisterBitsTemplateProps {
  step: RegisterBitsStep;
  highlightedLabel?: string | null;
  onShapeTap?: (label: string) => void;
  showSpaces?: boolean;
}

export function RegisterBitsTemplate({
  step,
  highlightedLabel,
  onShapeTap,
  showSpaces,
}: RegisterBitsTemplateProps): React.ReactElement {
  const registerName = step.registerName || 'REGISTER';
  const bitWidth = step.bitWidth || 8;
  const rawBits = step.bits || [];

  // Pad or slice bits to match bitWidth (msb to lsb: bit 7 down to 0)
  const fullBits: RegisterBit[] = [];
  for (let i = bitWidth - 1; i >= 0; i--) {
    const existing = rawBits.find((b) => b.index === i);
    if (existing) {
      fullBits.push(existing);
    } else {
      fullBits.push({ index: i, value: 0, tone: 'idle' });
    }
  }

  // Calculate hex & dec if omitted
  const computedDec =
    step.decimalValue !== undefined
      ? step.decimalValue
      : fullBits.reduce((acc, b) => (acc << 1) | (b.value ? 1 : 0), 0);
  const computedHex =
    step.hexValue ||
    `0x${computedDec.toString(16).toUpperCase().padStart(bitWidth / 4, '0')}`;

  return (
    <div
      className="visual-register-bits-container"
      data-testid="visual-register-bits"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
        padding: '12px 8px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .visual-register-bits-container * {
          box-sizing: border-box;
        }
        .register-bit-cell {
          transition: transform 0.15s ease, background-color 0.2s ease, border-color 0.2s ease;
        }
        .register-bit-cell:hover {
          transform: translateY(-2px);
        }
      `}</style>

      {/* Register Header: Name, Hex, Dec, and Mask */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '10px',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--t1)' }}>
            📟 <RenderWithFaintSpaces text={registerName} showSpaces={showSpaces} />
          </span>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(var(--brand-rgb), 0.12)',
              color: 'var(--accent)',
            }}
          >
            {computedHex}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono, monospace)',
              color: 'var(--text-muted)',
            }}
          >
            Dec: <strong style={{ color: 'var(--t1)' }}>{computedDec}</strong>
          </span>
          {step.maskApplied && (
            <span
              style={{
                fontSize: '10.5px',
                fontFamily: 'var(--font-mono, monospace)',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(var(--warning-rgb, 245, 158, 11), 0.12)',
                color: 'var(--warning, #f59e0b)',
                fontWeight: 600,
              }}
            >
              Mask: {step.maskApplied}
            </span>
          )}
        </div>
      </div>

      {/* Bits Grid: MSB (left) to LSB (right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${bitWidth}, minmax(0, 1fr))`,
          gap: bitWidth > 16 ? '2px' : '4px',
          width: '100%',
        }}
      >
        {fullBits.map((bit) => {
          const isHighlighted =
            bit.highlighted ||
            (highlightedLabel &&
              (highlightedLabel.toLowerCase() === `bit ${bit.index}`.toLowerCase() ||
                (bit.name && highlightedLabel.toLowerCase() === bit.name.toLowerCase())));

          const tone: VisualTone = bit.tone || (bit.value === 1 ? 'ok' : 'idle');
          const bitBg = getToneBg(tone);
          const bitBorder = isHighlighted ? '2px solid var(--accent)' : `1px solid ${getToneColor(tone)}`;
          const bitTextColor = getToneTextColor(tone);

          return (
            <button
              key={bit.index}
              type="button"
              className="register-bit-cell"
              data-testid={`register-bit-${bit.index}`}
              onClick={() => onShapeTap && onShapeTap(bit.name || `Bit ${bit.index}`)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '6px 2px',
                borderRadius: '6px',
                background: isHighlighted ? 'color-mix(in srgb, var(--accent) 20%, var(--bg2))' : bitBg,
                border: bitBorder,
                cursor: onShapeTap ? 'pointer' : 'default',
                minWidth: 0,
              }}
              title={`Bit ${bit.index}${bit.name ? ` (${bit.name})` : ''}: ${bit.value}`}
            >
              {/* Bit Index */}
              <span
                style={{
                  fontSize: '9.5px',
                  fontFamily: 'var(--font-mono, monospace)',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  lineHeight: 1,
                  marginBottom: '4px',
                }}
              >
                {bit.index}
              </span>

              {/* Bit Value (0 or 1) */}
              <span
                style={{
                  fontSize: '15px',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontWeight: 900,
                  color: bitTextColor,
                  lineHeight: 1,
                }}
              >
                {bit.value}
              </span>

              {/* Bit Flag Name (if present) */}
              {bit.name && (
                <span
                  style={{
                    fontSize: '8.5px',
                    fontWeight: 700,
                    color: isHighlighted ? 'var(--accent)' : 'var(--t2)',
                    marginTop: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                  }}
                >
                  {bit.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bit labels footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono, monospace)',
          padding: '0 2px',
        }}
      >
        <span>MSB (Bit {bitWidth - 1})</span>
        <span>LSB (Bit 0)</span>
      </div>
    </div>
  );
}
