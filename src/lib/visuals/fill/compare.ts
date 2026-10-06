import type {
  CompareSpec,
  CompareVisual,
  CompareStep,
  ComparePanel,
  ComparePanelSpec,
  StepBaseSpec,
} from '@/lib/types/lessonVisual';
import type { FillRunContext } from './types';

async function fillPanel(
  panelSpec: ComparePanelSpec,
  stepSpec: StepBaseSpec,
  ctx: FillRunContext
): Promise<ComparePanel> {
  const panelRun = await ctx.runSnippet(panelSpec.code);
  const result = ctx.resolveBinding(panelSpec.result, stepSpec, panelRun);

  const panel: ComparePanel = {
    code: panelSpec.code,
    result,
    tone: panelSpec.tone ?? 'data',
    checks: panelSpec.checks ?? [result],
  };

  if (panelSpec.whatIf) {
    panel.whatIf = panelSpec.whatIf;
  }

  return panel;
}

export async function fillCompare(
  spec: CompareSpec,
  ctx: FillRunContext
): Promise<CompareVisual> {
  const steps: CompareStep[] = [];

  for (const stepSpec of spec.steps) {
    const left = await fillPanel(stepSpec.left, stepSpec, ctx);
    const right = await fillPanel(stepSpec.right, stepSpec, ctx);

    const filledStep: CompareStep = {
      at: stepSpec.at,
      caption: stepSpec.caption,
      left,
      right,
    };

    steps.push(filledStep);
  }

  return {
    template: 'compare',
    title: spec.title,
    leftLabel: spec.leftLabel,
    rightLabel: spec.rightLabel,
    steps,
    showSpaces: spec.showSpaces,
  };
}
