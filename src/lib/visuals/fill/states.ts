import type { StatesSpec, StatesVisual, StatesStep } from '@/lib/types/lessonVisual';
import type { FillRunContext } from './types';
import { applyEdit } from './applyEdit';

export async function fillStates(
  spec: StatesSpec,
  ctx: FillRunContext
): Promise<StatesVisual> {
  const steps: StatesStep[] = [];
  const baseCode = ctx.part.code ?? '';

  for (const stepSpec of spec.steps) {
    const runResult = await ctx.getRunForStep(stepSpec);

    let transition: { from: string; to: string; label?: string } | undefined = undefined;
    if (stepSpec.transition) {
      const label =
        stepSpec.transition.label !== undefined
          ? typeof stepSpec.transition.label === 'string'
            ? stepSpec.transition.label
            : ctx.resolveBinding(stepSpec.transition.label, stepSpec, runResult)
          : undefined;

      transition = {
        from: stepSpec.transition.from,
        to: stepSpec.transition.to,
        ...(label !== undefined ? { label } : {}),
      };
    }

    const filledStep: StatesStep = {
      at: stepSpec.at,
      caption: stepSpec.caption,
      currentState: stepSpec.currentState,
      ...(transition ? { transition } : {}),
      ...(stepSpec.tone ? { tone: stepSpec.tone } : {}),
    };

    if (stepSpec.edit) {
      filledStep.whatIf = applyEdit(baseCode, stepSpec.edit);
    }

    steps.push(filledStep);
  }

  return {
    template: 'states',
    title: spec.title,
    states: spec.states,
    steps,
    showSpaces: spec.showSpaces,
  };
}
