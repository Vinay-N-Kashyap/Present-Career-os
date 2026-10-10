import type { WireframeSpec, WireframeVisual, WireframeStep } from '@/lib/types/lessonVisual';
import type { FillRunContext } from './types';
import { applyEdit } from './applyEdit';

export async function fillWireframe(
  spec: WireframeSpec,
  ctx: FillRunContext
): Promise<WireframeVisual> {
  const steps: WireframeStep[] = [];
  const baseCode = ctx.part.code ?? '';

  for (const stepSpec of spec.steps) {
    const filledStep: WireframeStep = {
      at: stepSpec.at,
      caption: stepSpec.caption,
      layoutMode: stepSpec.layoutMode,
      justifyContent: stepSpec.justifyContent,
      alignItems: stepSpec.alignItems,
      activeBoxId: stepSpec.activeBoxId,
      tone: stepSpec.tone,
      boxes: spec.boxes,
    };

    if (stepSpec.edit) {
      filledStep.whatIf = applyEdit(baseCode, stepSpec.edit);
    }

    steps.push(filledStep);
  }

  return {
    template: 'wireframe',
    title: spec.title,
    boxes: spec.boxes,
    steps,
    showSpaces: spec.showSpaces,
  };
}
