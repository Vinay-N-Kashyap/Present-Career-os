import { z } from 'zod';
import type { VisualAt, VisualTone } from '@/lib/types/lessonVisual';

// --- Bindings (Plan C2) ---
export const varBindingSchema = z.object({
  var: z.string().min(1),
  line: z.number().int().positive(),
  hit: z.number().int().positive().optional(),
  as: z.literal('type').optional(),
});

export const outBindingSchema = z.object({
  out: z.number().int().positive(),
});

export const tableBindingSchema = z.object({
  table: z.number().int().positive(),
  row: z.number().int().nonnegative().optional(),
  col: z.string().min(1).optional(),
});

export const errorBindingSchema = z.object({
  error: z.literal(true),
});

export const textBindingSchema = z.object({
  text: z.string(),
});

export const bindingSchema = z.union([
  varBindingSchema,
  outBindingSchema,
  tableBindingSchema,
  errorBindingSchema,
  textBindingSchema,
]);

// --- Changed Code ("what if" edits) ---
export const replaceLineEditSchema = z.object({
  replaceLine: z.object({
    line: z.number().int().positive(),
    text: z.string(),
  }),
});

export const appendLinesEditSchema = z.object({
  appendLines: z.array(z.string()).min(1),
});

export const stepEditSchema = z.union([
  replaceLineEditSchema,
  appendLinesEditSchema,
]);

// --- Spoken Line & Tone Schemas ---
export const visualAtSchema = z.custom<VisualAt>(
  (val) => {
    if (typeof val !== 'string') return false;
    if (val === 'intro' || val === 'example' || val === 'tryIt') return true;
    return /^say\d+$/.test(val);
  },
  {
    message: 'Expected "intro", "example", "tryIt", or "say<N>"',
  }
);

export const visualToneSchema = z.enum(['data', 'ok', 'error', 'idle']) as z.ZodType<VisualTone>;

// --- Step Base Schema ---
export const stepBaseSpecSchema = z.object({
  at: visualAtSchema,
  caption: z.string().max(80),
  edit: stepEditSchema.optional(),
});

export const nodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  tappable: z.boolean().optional(),
});

// --- Template 1: flow ---
export const flowStepSpecSchema = stepBaseSpecSchema.extend({
  values: z.record(z.string(), bindingSchema),
  tones: z.record(z.string(), visualToneSchema).optional(),
  arrows: z.array(z.tuple([z.string(), z.string()])).optional(),
});

export const flowSpecSchema = z.object({
  template: z.literal('flow'),
  title: z.string().min(1),
  nodes: z.array(nodeSchema).min(1).max(6),
  steps: z.array(flowStepSpecSchema).min(2).max(5),
  showSpaces: z.boolean().optional(),
});

// --- Template 2: boxes ---
export const boxesStepSpecSchema = stepBaseSpecSchema.extend({
  values: z.record(z.string(), bindingSchema),
  tones: z.record(z.string(), visualToneSchema).optional(),
  types: z.record(z.string(), z.union([bindingSchema, z.string()])).optional(),
});

export const boxesSpecSchema = z.object({
  template: z.literal('boxes'),
  title: z.string().min(1),
  boxes: z.array(nodeSchema).min(1).max(6),
  steps: z.array(boxesStepSpecSchema).min(2).max(5),
  showSpaces: z.boolean().optional(),
});

// --- Template 3: table ---
export const tableRowSpecSchema = z.object({
  cells: z.array(bindingSchema).min(2).max(5),
  tone: visualToneSchema.optional().default('idle'),
});

export const tableStepSpecSchema = stepBaseSpecSchema.extend({
  rows: z.array(tableRowSpecSchema).max(6),
});

export const tableSpecSchema = z.object({
  template: z.literal('table'),
  title: z.string().min(1),
  columns: z.array(z.string().min(1)).min(2).max(5),
  steps: z.array(tableStepSpecSchema).min(2).max(5),
  showSpaces: z.boolean().optional(),
});

// --- Template 4: letters ---
export const lettersStepSpecSchema = stepBaseSpecSchema.extend({
  pointer: z.number().int().optional(),
  range: z.tuple([z.number().int(), z.number().int()]).optional(),
  result: bindingSchema,
  tone: visualToneSchema.optional().default('idle'),
});

export const lettersSpecSchema = z.object({
  template: z.literal('letters'),
  title: z.string().min(1),
  text: z.string(),
  steps: z.array(lettersStepSpecSchema).min(2).max(5),
  showSpaces: z.boolean().optional(),
});

// --- Template 5: compare ---
export const comparePanelSpecSchema = z.object({
  code: z.string(),
  result: bindingSchema,
  tone: visualToneSchema.optional().default('idle'),
  checks: z.array(z.string()).optional(),
  whatIf: z.string().optional(),
});

export const compareStepSpecSchema = stepBaseSpecSchema.extend({
  left: comparePanelSpecSchema,
  right: comparePanelSpecSchema,
});

export const compareSpecSchema = z.object({
  template: z.literal('compare'),
  title: z.string().min(1),
  leftLabel: z.string(),
  rightLabel: z.string(),
  steps: z.array(compareStepSpecSchema).min(2).max(5),
  showSpaces: z.boolean().optional(),
});

// --- Template 6: cells ---
export const cellsPointerSchema = z.object({
  name: z.string().min(1),
  index: z.number().int().nonnegative(),
  tone: visualToneSchema.optional(),
});

export const cellsStepSpecSchema = stepBaseSpecSchema.extend({
  items: z.union([bindingSchema, z.array(bindingSchema)]),
  pointers: z.array(cellsPointerSchema).max(3).optional(),
  highlightRange: z.tuple([z.number().int(), z.number().int()]).optional(),
  tones: z.record(z.string(), visualToneSchema).optional(),
});

export const cellsSpecSchema = z.object({
  template: z.literal('cells'),
  title: z.string().min(1),
  steps: z.array(cellsStepSpecSchema).min(2).max(5),
  showSpaces: z.boolean().optional(),
});

// --- Template 7: stack-queue ---
export const stackQueueStepSpecSchema = stepBaseSpecSchema.extend({
  mode: z.enum(['stack', 'queue']).optional(),
  items: z.union([bindingSchema, z.array(bindingSchema)]),
  action: z.enum(['push', 'pop', 'enqueue', 'dequeue', 'idle']).optional(),
  actionItem: bindingSchema.optional(),
  tones: z.array(visualToneSchema).optional(),
});

export const stackQueueSpecSchema = z.object({
  template: z.literal('stack-queue'),
  title: z.string().min(1),
  mode: z.enum(['stack', 'queue']).optional().default('stack'),
  steps: z.array(stackQueueStepSpecSchema).min(2).max(5),
  showSpaces: z.boolean().optional(),
});

// --- Template 8: tree-graph ---
export const treeGraphNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  tone: visualToneSchema.optional(),
});

export const treeGraphStepSpecSchema = stepBaseSpecSchema.extend({
  activeNodeId: z.string().optional(),
  visitedNodeIds: z.array(z.string()).optional(),
  activeEdge: z.tuple([z.string(), z.string()]).optional(),
  tones: z.record(z.string(), visualToneSchema).optional(),
});

export const treeGraphSpecSchema = z.object({
  template: z.literal('tree-graph'),
  title: z.string().min(1),
  nodes: z.array(treeGraphNodeSchema).max(6),
  edges: z.array(z.tuple([z.string(), z.string()])),
  steps: z.array(treeGraphStepSpecSchema).min(2).max(5),
  showSpaces: z.boolean().optional(),
});

// --- Template 9: bars ---
export const barsItemSpecSchema = z.object({
  label: z.string().min(1),
  value: bindingSchema,
  tone: visualToneSchema.optional(),
});

export const barsStepSpecSchema = stepBaseSpecSchema.extend({
  bars: z.array(barsItemSpecSchema).max(6),
  max: z.number().optional(),
});

export const barsSpecSchema = z.object({
  template: z.literal('bars'),
  title: z.string().min(1),
  steps: z.array(barsStepSpecSchema).min(2).max(5),
  showSpaces: z.boolean().optional(),
});

// --- Template 10: sequence ---
export const sequenceMessageSpecSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  label: z.union([bindingSchema, z.string()]),
  tone: visualToneSchema.optional(),
});

export const sequenceStepSpecSchema = stepBaseSpecSchema.extend({
  messages: z.array(sequenceMessageSpecSchema),
  activeActor: z.string().optional(),
});

export const sequenceSpecSchema = z.object({
  template: z.literal('sequence'),
  title: z.string().min(1),
  actors: z.array(z.string().min(1)).min(2).max(4),
  steps: z.array(sequenceStepSpecSchema).min(2).max(5),
  showSpaces: z.boolean().optional(),
});

// --- Template 11: states ---
export const stateNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

export const statesStepSpecSchema = stepBaseSpecSchema.extend({
  currentState: z.string().min(1),
  transition: z
    .object({
      from: z.string().min(1),
      to: z.string().min(1),
      label: z.union([bindingSchema, z.string()]).optional(),
    })
    .optional(),
  tone: visualToneSchema.optional(),
});

export const statesSpecSchema = z.object({
  template: z.literal('states'),
  title: z.string().min(1),
  states: z.array(stateNodeSchema).min(2).max(5),
  steps: z.array(statesStepSpecSchema).min(2).max(5),
  showSpaces: z.boolean().optional(),
});

// --- None Template ---
export const noneSpecSchema = z.object({
  template: z.literal('none'),
  reason: z.string().min(1),
});

// --- Combined Discriminated Union ---
export const visualSpecSchema = z.discriminatedUnion('template', [
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
  statesSpecSchema,
  noneSpecSchema,
]);

// --- Day-File Schema (Plan C3 & C5 R1) ---
export const dayFileEntrySchema = z.object({
  partTitle: z.string().min(1),
  codeHash: z.string().min(1),
  spec: visualSpecSchema,
  filled: z.record(z.string(), z.unknown()),
});

export const lessonVisualDayFileSchema = z.object({
  schemaVersion: z.literal(1),
  prefix: z.string().min(1),
  day: z.number().int().positive(),
  promptSha: z.string().min(1),
  model: z.string().min(1),
  entries: z.array(dayFileEntrySchema).length(6),
});
