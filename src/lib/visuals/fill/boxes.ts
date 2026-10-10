import type { BoxesSpec, BoxesVisual, BoxesStep } from '@/lib/types/lessonVisual';
import type { FillRunContext } from './types';
import { applyEdit } from './applyEdit';

export async function fillBoxes(spec: BoxesSpec, ctx: FillRunContext): Promise<BoxesVisual> {
  const steps: BoxesStep[] = [];
  const baseCode = ctx.part.code ?? '';

  for (const stepSpec of spec.steps) {
    const runResult = await ctx.getRunForStep(stepSpec);
    const values: Record<string, string> = {};
    for (const [boxId, binding] of Object.entries(stepSpec.values)) {
      values[boxId] = ctx.resolveBinding(binding, stepSpec, runResult);
    }

    let types: Record<string, string> | undefined = undefined;
    if (stepSpec.types) {
      types = {};
      for (const [boxId, bOrStr] of Object.entries(stepSpec.types)) {
        if (typeof bOrStr === 'string') {
          types[boxId] = bOrStr;
        } else {
          types[boxId] = ctx.resolveBinding(bOrStr, stepSpec, runResult);
        }
      }
    }

    const filledStep: BoxesStep = {
      at: stepSpec.at,
      caption: stepSpec.caption,
      values,
      tones: stepSpec.tones ?? {},
      ...(types ? { types } : {}),
    };

    if (stepSpec.edit) {
      filledStep.whatIf = applyEdit(baseCode, stepSpec.edit);
    }

    steps.push(filledStep);
  }

  return {
    template: 'boxes',
    title: spec.title,
    boxes: spec.boxes,
    steps,
    showSpaces: spec.showSpaces,
  };
}
