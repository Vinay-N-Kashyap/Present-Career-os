import type { StepEdit } from '@/lib/types/lessonVisual';

/**
 * Applies an edit to base code:
 * - replaceLine: replaces 1-indexed line `line` with `text`.
 * - appendLines: appends new lines to the end of the code.
 */
export function applyEdit(baseCode: string, edit?: StepEdit): string {
  if (!edit) return baseCode;

  if ('replaceLine' in edit) {
    const lines = baseCode.split('\n');
    const targetIdx = edit.replaceLine.line - 1;
    if (targetIdx >= 0 && targetIdx < lines.length) {
      lines[targetIdx] = edit.replaceLine.text;
    } else {
      while (lines.length < targetIdx) {
        lines.push('');
      }
      lines[targetIdx] = edit.replaceLine.text;
    }
    return lines.join('\n');
  }

  if ('appendLines' in edit) {
    if (!baseCode.trim()) {
      return edit.appendLines.join('\n');
    }
    return baseCode + '\n' + edit.appendLines.join('\n');
  }

  return baseCode;
}
