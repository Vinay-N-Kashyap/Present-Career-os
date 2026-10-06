import type { CellsSpec, CellsVisual, CellsStep } from '@/lib/types/lessonVisual';
import type { FillRunContext } from './types';
import { applyEdit } from './applyEdit';
import { formatValue } from '../trace/formatValue';

export async function fillCells(spec: CellsSpec, ctx: FillRunContext): Promise<CellsVisual> {
  const steps: CellsStep[] = [];
  const baseCode = ctx.part.code ?? '';

  for (const stepSpec of spec.steps) {
    const runResult = await ctx.getRunForStep(stepSpec);
    let items: string[] = [];

    if (Array.isArray(stepSpec.items)) {
      items = stepSpec.items.map((b) => ctx.resolveBinding(b, stepSpec, runResult));
    } else {
      const binding = stepSpec.items;
      if ('var' in binding && runResult.events && runResult.events.length > 0) {
        const lineEvents = runResult.events.filter(([l]) => l === binding.line);
        const hit = binding.hit ?? 1;
        let rawVal: unknown = undefined;
        if (hit >= 1 && hit <= lineEvents.length) {
          rawVal = lineEvents[hit - 1][2][binding.var];
        }

        if (Array.isArray(rawVal)) {
          items = rawVal.map((x) => formatValue(x));
        } else {
          const resolvedStr = ctx.resolveBinding(binding, stepSpec, runResult);
          try {
            const parsed = JSON.parse(resolvedStr);
            if (Array.isArray(parsed)) {
              items = parsed.map((x) => formatValue(x));
            } else {
              items = [resolvedStr];
            }
          } catch {
            items = [resolvedStr];
          }
        }
      } else {
        const resolvedStr = ctx.resolveBinding(binding, stepSpec, runResult);
        try {
          const parsed = JSON.parse(resolvedStr);
          if (Array.isArray(parsed)) {
            items = parsed.map((x) => formatValue(x));
          } else {
            items = [resolvedStr];
          }
        } catch {
          items = [resolvedStr];
        }
      }
    }

    const filledStep: CellsStep = {
      at: stepSpec.at,
      caption: stepSpec.caption,
      items,
      ...(stepSpec.pointers ? { pointers: stepSpec.pointers } : {}),
      ...(stepSpec.highlightRange ? { highlightRange: stepSpec.highlightRange } : {}),
      ...(stepSpec.tones ? { tones: stepSpec.tones } : {}),
    };

    if (stepSpec.edit) {
      filledStep.whatIf = applyEdit(baseCode, stepSpec.edit);
    }

    steps.push(filledStep);
  }

  return {
    template: 'cells',
    title: spec.title,
    steps,
    showSpaces: spec.showSpaces,
  };
}
