import type { LessonVisual, NoneVisual, VisualSpec } from '@/lib/types/lessonVisual';
import type { LongLessonPart } from '@/lib/data/longLessons';
import { getTemplateRegistryEntry } from '../registry';
import { createFillRunContext } from './runContext';
import type { FillOptions } from './types';

export async function fill(
  spec: VisualSpec,
  part: LongLessonPart,
  options?: FillOptions
): Promise<LessonVisual | NoneVisual> {
  if (spec.template === 'none') {
    return {
      template: 'none',
      reason: spec.reason,
    };
  }

  const entry = getTemplateRegistryEntry(spec.template);
  if (!entry || !entry.fill) {
    throw new Error(
      `Cannot fill visual: template "${spec.template}" is not registered or has no fill adapter`
    );
  }

  const ctx = await createFillRunContext(part, options);
  return entry.fill(spec, ctx);
}
