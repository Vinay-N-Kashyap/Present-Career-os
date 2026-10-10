import type { TableSpec, TableVisual, TableStep } from '@/lib/types/lessonVisual';
import type { FillRunContext } from './types';
import { applyEdit } from './applyEdit';

export async function fillTable(spec: TableSpec, ctx: FillRunContext): Promise<TableVisual> {
  const steps: TableStep[] = [];
  const baseCode = ctx.part.code ?? '';

  for (const stepSpec of spec.steps) {
    const runResult = await ctx.getRunForStep(stepSpec);
    const rows = stepSpec.rows.map((rowSpec) => ({
      cells: rowSpec.cells.map((binding) => ctx.resolveBinding(binding, stepSpec, runResult)),
      tone: rowSpec.tone ?? 'data',
    }));

    const filledStep: TableStep = {
      at: stepSpec.at,
      caption: stepSpec.caption,
      rows,
    };

    if (stepSpec.edit) {
      filledStep.whatIf = applyEdit(baseCode, stepSpec.edit);
    }

    steps.push(filledStep);
  }

  return {
    template: 'table',
    title: spec.title,
    columns: spec.columns,
    steps,
    showSpaces: spec.showSpaces,
  };
}
