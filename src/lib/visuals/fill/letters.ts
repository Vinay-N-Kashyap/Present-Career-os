import type { LettersSpec, LettersVisual, LettersStep } from '@/lib/types/lessonVisual';
import type { FillRunContext } from './types';
import { applyEdit } from './applyEdit';

export async function fillLetters(spec: LettersSpec, ctx: FillRunContext): Promise<LettersVisual> {
  const steps: LettersStep[] = [];
  const baseCode = ctx.part.code ?? '';

  for (const stepSpec of spec.steps) {
    const runResult = await ctx.getRunForStep(stepSpec);
    const result = ctx.resolveBinding(stepSpec.result, stepSpec, runResult);

    const filledStep: LettersStep = {
      at: stepSpec.at,
      caption: stepSpec.caption,
      result,
      tone: stepSpec.tone ?? 'data',
      ...(stepSpec.pointer !== undefined ? { pointer: stepSpec.pointer } : {}),
      ...(stepSpec.range !== undefined ? { range: stepSpec.range } : {}),
    };

    if (stepSpec.edit) {
      filledStep.whatIf = applyEdit(baseCode, stepSpec.edit);
    }

    steps.push(filledStep);
  }

  return {
    template: 'letters',
    title: spec.title,
    text: spec.text,
    steps,
    showSpaces: spec.showSpaces,
  };
}
