import type { TreeGraphSpec, TreeGraphVisual, TreeGraphStep } from '@/lib/types/lessonVisual';
import type { FillRunContext } from './types';
import { applyEdit } from './applyEdit';

export async function fillTreeGraph(
  spec: TreeGraphSpec,
  ctx: FillRunContext
): Promise<TreeGraphVisual> {
  const steps: TreeGraphStep[] = [];
  const baseCode = ctx.part.code ?? '';

  for (const stepSpec of spec.steps) {
    const filledStep: TreeGraphStep = {
      at: stepSpec.at,
      caption: stepSpec.caption,
      ...(stepSpec.activeNodeId ? { activeNodeId: stepSpec.activeNodeId } : {}),
      ...(stepSpec.visitedNodeIds ? { visitedNodeIds: stepSpec.visitedNodeIds } : {}),
      ...(stepSpec.activeEdge ? { activeEdge: stepSpec.activeEdge } : {}),
      ...(stepSpec.tones ? { tones: stepSpec.tones } : {}),
    };

    if (stepSpec.edit) {
      filledStep.whatIf = applyEdit(baseCode, stepSpec.edit);
    }

    steps.push(filledStep);
  }

  return {
    template: 'tree-graph',
    title: spec.title,
    nodes: spec.nodes,
    edges: spec.edges,
    steps,
    showSpaces: spec.showSpaces,
  };
}
