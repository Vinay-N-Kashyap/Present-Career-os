import type { WorkflowSpec, WorkflowVisual, WorkflowStep } from '@/lib/types/lessonVisual';
import type { FillRunContext } from './types';
import { applyEdit } from './applyEdit';

export async function fillWorkflow(
  spec: WorkflowSpec,
  ctx: FillRunContext
): Promise<WorkflowVisual> {
  const steps: WorkflowStep[] = [];
  const baseCode = ctx.part.code ?? '';

  for (const stepSpec of spec.steps) {
    const runResult = await ctx.getRunForStep(stepSpec);

    const statusBadge = stepSpec.statusBadge
      ? typeof stepSpec.statusBadge === 'string'
        ? stepSpec.statusBadge
        : ctx.resolveBinding(stepSpec.statusBadge, stepSpec, runResult)
      : undefined;

    const throughput = stepSpec.throughput
      ? typeof stepSpec.throughput === 'string'
        ? stepSpec.throughput
        : ctx.resolveBinding(stepSpec.throughput, stepSpec, runResult)
      : undefined;

    const filledStep: WorkflowStep = {
      at: stepSpec.at,
      caption: stepSpec.caption,
      activeStageId: stepSpec.activeStageId,
      statusBadge,
      throughput,
      tone: stepSpec.tone,
      stages: spec.stages,
    };

    if (stepSpec.edit) {
      filledStep.whatIf = applyEdit(baseCode, stepSpec.edit);
    }

    steps.push(filledStep);
  }

  return {
    template: 'workflow',
    title: spec.title,
    stages: spec.stages,
    steps,
    showSpaces: spec.showSpaces,
  };
}
