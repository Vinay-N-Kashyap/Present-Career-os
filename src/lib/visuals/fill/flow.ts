import type { FlowSpec, FlowVisual, FlowStep } from '@/lib/types/lessonVisual';
import type { FillRunContext } from './types';
import { applyEdit } from './applyEdit';

export async function fillFlow(spec: FlowSpec, ctx: FillRunContext): Promise<FlowVisual> {
  const steps: FlowStep[] = [];
  const baseCode = ctx.part.code ?? '';

  for (const stepSpec of spec.steps) {
    const runResult = await ctx.getRunForStep(stepSpec);
    const values: Record<string, string> = {};
    for (const [nodeId, binding] of Object.entries(stepSpec.values)) {
      values[nodeId] = ctx.resolveBinding(binding, stepSpec, runResult);
    }

    const filledStep: FlowStep = {
      at: stepSpec.at,
      caption: stepSpec.caption,
      values,
      tones: stepSpec.tones ?? {},
      arrows: stepSpec.arrows ?? [],
    };

    if (stepSpec.edit) {
      filledStep.whatIf = applyEdit(baseCode, stepSpec.edit);
    }

    steps.push(filledStep);
  }

  return {
    template: 'flow',
    title: spec.title,
    nodes: spec.nodes,
    steps,
    showSpaces: spec.showSpaces,
  };
}
