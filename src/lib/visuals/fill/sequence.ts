import type { SequenceSpec, SequenceVisual, SequenceStep } from '@/lib/types/lessonVisual';
import type { FillRunContext } from './types';
import { applyEdit } from './applyEdit';

export async function fillSequence(
  spec: SequenceSpec,
  ctx: FillRunContext
): Promise<SequenceVisual> {
  const steps: SequenceStep[] = [];
  const baseCode = ctx.part.code ?? '';

  for (const stepSpec of spec.steps) {
    const runResult = await ctx.getRunForStep(stepSpec);

    const messages = stepSpec.messages.map((m) => {
      const label =
        typeof m.label === 'string'
          ? m.label
          : ctx.resolveBinding(m.label, stepSpec, runResult);

      return {
        from: m.from,
        to: m.to,
        label,
        ...(m.tone ? { tone: m.tone } : {}),
      };
    });

    const filledStep: SequenceStep = {
      at: stepSpec.at,
      caption: stepSpec.caption,
      messages,
      ...(stepSpec.activeActor ? { activeActor: stepSpec.activeActor } : {}),
    };

    if (stepSpec.edit) {
      filledStep.whatIf = applyEdit(baseCode, stepSpec.edit);
    }

    steps.push(filledStep);
  }

  return {
    template: 'sequence',
    title: spec.title,
    actors: spec.actors,
    steps,
    showSpaces: spec.showSpaces,
  };
}
