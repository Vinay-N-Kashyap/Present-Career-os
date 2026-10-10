import type { BarsSpec, BarsVisual, BarsStep } from '@/lib/types/lessonVisual';
import type { FillRunContext } from './types';
import { applyEdit } from './applyEdit';

export async function fillBars(
  spec: BarsSpec,
  ctx: FillRunContext
): Promise<BarsVisual> {
  const steps: BarsStep[] = [];
  const baseCode = ctx.part.code ?? '';

  for (const stepSpec of spec.steps) {
    const runResult = await ctx.getRunForStep(stepSpec);

    const bars = stepSpec.bars.map((b) => {
      const resolved = ctx.resolveBinding(b.value, stepSpec, runResult);
      const parsedNum = Number(resolved);
      const value = !isNaN(parsedNum) && resolved.trim() !== '' ? parsedNum : resolved;

      return {
        label: b.label,
        value,
        ...(b.tone ? { tone: b.tone } : {}),
      };
    });

    const filledStep: BarsStep = {
      at: stepSpec.at,
      caption: stepSpec.caption,
      bars,
      ...(stepSpec.max !== undefined ? { max: stepSpec.max } : {}),
    };

    if (stepSpec.edit) {
      filledStep.whatIf = applyEdit(baseCode, stepSpec.edit);
    }

    steps.push(filledStep);
  }

  return {
    template: 'bars',
    title: spec.title,
    steps,
    showSpaces: spec.showSpaces,
  };
}
