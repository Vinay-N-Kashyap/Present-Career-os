import type { ComponentTreeSpec, ComponentTreeVisual, ComponentTreeStep } from '@/lib/types/lessonVisual';
import type { FillRunContext } from './types';
import { applyEdit } from './applyEdit';

export async function fillComponentTree(
  spec: ComponentTreeSpec,
  ctx: FillRunContext
): Promise<ComponentTreeVisual> {
  const steps: ComponentTreeStep[] = [];
  const baseCode = ctx.part.code ?? '';

  for (const stepSpec of spec.steps) {
    const runResult = await ctx.getRunForStep(stepSpec);

    let propsPassed: { from: string; to: string; propName: string; value: string } | undefined;
    if (stepSpec.propsPassed) {
      const val =
        typeof stepSpec.propsPassed.value === 'string'
          ? stepSpec.propsPassed.value
          : ctx.resolveBinding(stepSpec.propsPassed.value, stepSpec, runResult);
      propsPassed = {
        from: stepSpec.propsPassed.from,
        to: stepSpec.propsPassed.to,
        propName: stepSpec.propsPassed.propName,
        value: val,
      };
    }

    const filledStep: ComponentTreeStep = {
      at: stepSpec.at,
      caption: stepSpec.caption,
      activeId: stepSpec.activeId,
      reRenderingIds: stepSpec.reRenderingIds,
      propsPassed,
      eventFired: stepSpec.eventFired,
      tone: stepSpec.tone,
      nodes: spec.nodes,
    };

    if (stepSpec.edit) {
      filledStep.whatIf = applyEdit(baseCode, stepSpec.edit);
    }

    steps.push(filledStep);
  }

  return {
    template: 'component-tree',
    title: spec.title,
    nodes: spec.nodes,
    steps,
    showSpaces: spec.showSpaces,
  };
}
