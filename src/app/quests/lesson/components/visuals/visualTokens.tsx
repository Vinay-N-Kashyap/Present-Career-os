import React from 'react';
import type { VisualTone } from '@/lib/types/lessonVisual';

export function getToneColor(tone: VisualTone): string {
  switch (tone) {
    case 'data':
      return 'var(--accent)';
    case 'ok':
      return 'var(--success)';
    case 'error':
      return 'var(--coral)';
    case 'idle':
    default:
      return 'var(--border)';
  }
}

export function getToneBg(tone: VisualTone): string {
  switch (tone) {
    case 'data':
      return 'color-mix(in srgb, var(--accent) 15%, transparent)';
    case 'ok':
      return 'color-mix(in srgb, var(--success) 15%, transparent)';
    case 'error':
      return 'color-mix(in srgb, var(--coral) 15%, transparent)';
    case 'idle':
    default:
      return 'transparent';
  }
}

export function getToneTextColor(tone: VisualTone): string {
  switch (tone) {
    case 'data':
      return 'var(--tone-data-text, var(--accent))';
    case 'ok':
      return 'var(--tone-ok-text, var(--success))';
    case 'error':
      return 'var(--tone-error-text, var(--coral))';
    case 'idle':
    default:
      return 'var(--text-muted)';
  }
}

export function RenderWithFaintSpaces({ text, showSpaces }: { text: any; showSpaces?: boolean }): React.ReactElement {
  if (text === null || text === undefined || text === '') return <React.Fragment />;
  const str =
    typeof text === 'string'
      ? text
      : typeof text === 'object'
      ? String(text.text ?? text.var ?? (text.out !== undefined ? `line ${text.out}` : JSON.stringify(text)))
      : String(text);
  if (!str) return <React.Fragment />;
  if (!showSpaces) {
    const cleanText = str.replace(/\u00b7/g, ' ');
    return <span>{cleanText}</span>;
  }
  const parts = str.split(/([\s\u00b7])/);
  return (
    <React.Fragment>
      {parts.map((part, i) => {
        if (part === '\u00b7' || part === ' ') {
          return (
            <span
              key={i}
              style={{
                opacity: 0.45,
                fontWeight: 700,
                display: 'inline-block',
                padding: '0 1px',
                userSelect: 'none',
              }}
              aria-label="space"
            >
              ·
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </React.Fragment>
  );
}
