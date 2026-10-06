import type { ZodType } from 'zod';
import {
  flowSpecSchema,
  boxesSpecSchema,
  tableSpecSchema,
  lettersSpecSchema,
  compareSpecSchema,
} from './schema';

export type ExistingTemplateName = 'flow' | 'boxes' | 'table' | 'letters' | 'compare';

export type AllTemplateName =
  | ExistingTemplateName
  | 'cells'
  | 'stack-queue'
  | 'tree-graph'
  | 'bars'
  | 'sequence'
  | 'states';

export interface TemplateRegistryEntry {
  name: ExistingTemplateName;
  description: string;
  specSchema: ZodType<unknown>;
}

export const TEMPLATE_REGISTRY: Record<ExistingTemplateName, TemplateRegistryEntry> = {
  flow: {
    name: 'flow',
    description: '2–5 boxes joined by arrows for pipelines and request paths',
    specSchema: flowSpecSchema,
  },
  boxes: {
    name: 'boxes',
    description: 'Named boxes holding values for variables and state',
    specSchema: boxesSpecSchema,
  },
  table: {
    name: 'table',
    description: '2–5 columns and up to 6 rows filled step by step',
    specSchema: tableSpecSchema,
  },
  letters: {
    name: 'letters',
    description: 'Character cells with pointer and range for strings and slicing',
    specSchema: lettersSpecSchema,
  },
  compare: {
    name: 'compare',
    description: 'Two panels side by side for before/after and wrong/right comparisons',
    specSchema: compareSpecSchema,
  },
};

export function getTemplateRegistryEntry(name: string): TemplateRegistryEntry | undefined {
  if (name in TEMPLATE_REGISTRY) {
    return TEMPLATE_REGISTRY[name as ExistingTemplateName];
  }
  return undefined;
}

export function isRegisteredTemplate(name: string): boolean {
  return name in TEMPLATE_REGISTRY;
}
