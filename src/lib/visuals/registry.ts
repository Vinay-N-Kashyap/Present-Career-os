import type { ZodType } from 'zod';
import {
  flowSpecSchema,
  boxesSpecSchema,
  tableSpecSchema,
  lettersSpecSchema,
  compareSpecSchema,
  cellsSpecSchema,
  stackQueueSpecSchema,
  treeGraphSpecSchema,
  barsSpecSchema,
  sequenceSpecSchema,
} from './schema';
import type { FillRunContext } from './fill/types';
import { fillFlow } from './fill/flow';
import { fillBoxes } from './fill/boxes';
import { fillTable } from './fill/table';
import { fillLetters } from './fill/letters';
import { fillCompare } from './fill/compare';
import { fillCells } from './fill/cells';
import { fillStackQueue } from './fill/stack-queue';
import { fillTreeGraph } from './fill/tree-graph';
import { fillBars } from './fill/bars';
import { fillSequence } from './fill/sequence';

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
  name: string;
  description: string;
  specSchema: ZodType<unknown>;
  fill: (spec: any, context: FillRunContext) => Promise<any>;
}

export const TEMPLATE_REGISTRY: Record<string, TemplateRegistryEntry> = {
  flow: {
    name: 'flow',
    description: '2–5 boxes joined by arrows for pipelines and request paths',
    specSchema: flowSpecSchema,
    fill: fillFlow,
  },
  boxes: {
    name: 'boxes',
    description: 'Named boxes holding values for variables and state',
    specSchema: boxesSpecSchema,
    fill: fillBoxes,
  },
  table: {
    name: 'table',
    description: '2–5 columns and up to 6 rows filled step by step',
    specSchema: tableSpecSchema,
    fill: fillTable,
  },
  letters: {
    name: 'letters',
    description: 'Character cells with pointer and range for strings and slicing',
    specSchema: lettersSpecSchema,
    fill: fillLetters,
  },
  compare: {
    name: 'compare',
    description: 'Two panels side by side for before/after and wrong/right comparisons',
    specSchema: compareSpecSchema,
    fill: fillCompare,
  },
  cells: {
    name: 'cells',
    description: 'Array cells with indices and up to 3 pointers for lists, binary search, and two pointers',
    specSchema: cellsSpecSchema,
    fill: fillCells,
  },
  'stack-queue': {
    name: 'stack-queue',
    description: 'Items pushed and popped, stack vertical or queue horizontal',
    specSchema: stackQueueSpecSchema,
    fill: fillStackQueue,
  },
  'tree-graph': {
    name: 'tree-graph',
    description: 'Up to 6 nodes and their edges with active and visited node highlights',
    specSchema: treeGraphSpecSchema,
    fill: fillTreeGraph,
  },
  bars: {
    name: 'bars',
    description: 'Up to 6 labelled bars with their numbers for scores, latency, and metrics',
    specSchema: barsSpecSchema,
    fill: fillBars,
  },
  sequence: {
    name: 'sequence',
    description: '2–4 actors in columns, with messages going down for RPC, consensus, and retries',
    specSchema: sequenceSpecSchema,
    fill: fillSequence,
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
