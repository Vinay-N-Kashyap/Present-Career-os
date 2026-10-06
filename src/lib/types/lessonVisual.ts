export type VisualAt = 'intro' | `say${number}` | 'example' | 'tryIt';
export type VisualTone = 'data' | 'ok' | 'error' | 'idle';

// --- Bindings (Plan C2) ---
export type Binding =
  | { var: string; line: number; hit?: number; as?: 'type' }
  | { out: number }
  | { table: number; row?: number; col?: string }
  | { error: true }
  | { text: string };

// --- Changed Code ("what if" edits) ---
export type StepEdit =
  | { replaceLine: { line: number; text: string } }
  | { appendLines: string[] };

// --- Base Step Types ---
export interface StepBase {
  at: VisualAt; // which spoken piece starts this step
  caption: string; // one sentence, at most 80 characters
  checks?: string[]; // values that must appear in the real output (see C6, rule 6)
  whatIf?: string; // optional changed code; checks are then run against this code instead
  mustNotShow?: string[]; // values that must NOT appear in that output
  lastLine?: string; // the last output line must equal this
}

export interface StepBaseSpec {
  at: VisualAt;
  caption: string;
  edit?: StepEdit;
}

export interface Node {
  id: string;
  label: string;
  tappable?: boolean; // tappable defaults to true
}

// --- Template 1: flow ---
export interface FlowStep extends StepBase {
  values: Record<string, string>; // node id -> text shown in the box
  tones: Record<string, VisualTone>; // node id -> colour
  arrows: [string, string][]; // lit arrows, as [fromId, toId]
}

export interface FlowVisual {
  template: 'flow';
  title: string;
  nodes: Node[];
  steps: FlowStep[];
  showSpaces?: boolean;
}

export interface FlowStepSpec extends StepBaseSpec {
  values: Record<string, Binding>;
  tones?: Record<string, VisualTone>;
  arrows?: [string, string][];
}

export interface FlowSpec {
  template: 'flow';
  title: string;
  nodes: Node[];
  steps: FlowStepSpec[];
  showSpaces?: boolean;
}

// --- Template 2: boxes ---
export interface BoxesStep extends StepBase {
  values: Record<string, string>; // box id -> value ('' = empty)
  tones: Record<string, VisualTone>;
  types?: Record<string, string>; // optional small type tag: 'str', 'int', 'float', 'bool'
}

export interface BoxesVisual {
  template: 'boxes';
  title: string;
  boxes: Node[];
  steps: BoxesStep[];
  showSpaces?: boolean;
}

export interface BoxesStepSpec extends StepBaseSpec {
  values: Record<string, Binding>;
  tones?: Record<string, VisualTone>;
  types?: Record<string, Binding | string>;
}

export interface BoxesSpec {
  template: 'boxes';
  title: string;
  boxes: Node[];
  steps: BoxesStepSpec[];
  showSpaces?: boolean;
}

// --- Template 3: table (2-5 columns) ---
export interface TableStep extends StepBase {
  rows: { cells: string[]; tone: VisualTone }[];
}

export interface TableVisual {
  template: 'table';
  title: string;
  columns: string[];
  steps: TableStep[];
  showSpaces?: boolean;
}

export interface TableRowSpec {
  cells: Binding[];
  tone?: VisualTone;
}

export interface TableStepSpec extends StepBaseSpec {
  rows: TableRowSpec[];
}

export interface TableSpec {
  template: 'table';
  title: string;
  columns: string[];
  steps: TableStepSpec[];
  showSpaces?: boolean;
}

// --- Template 4: letters ---
export interface LettersStep extends StepBase {
  pointer?: number; // index; negative counts from the end; out of range = drawn after the last cell in red
  range?: [number, number]; // [start, stop): stop not included
  result: string; // shown under the cells
  tone: VisualTone;
}

export interface LettersVisual {
  template: 'letters';
  title: string;
  text: string;
  steps: LettersStep[];
  showSpaces?: boolean;
}

export interface LettersStepSpec extends StepBaseSpec {
  pointer?: number;
  range?: [number, number];
  result: Binding;
  tone?: VisualTone;
}

export interface LettersSpec {
  template: 'letters';
  title: string;
  text: string;
  steps: LettersStepSpec[];
  showSpaces?: boolean;
}

// --- Template 5: compare ---
export interface ComparePanel {
  code: string;
  result: string;
  tone: VisualTone;
  checks: string[];
  whatIf?: string;
}

export interface CompareStep extends Omit<StepBase, 'checks' | 'whatIf'> {
  left: ComparePanel; // each panel is checked on its own
  right: ComparePanel;
}

export interface CompareVisual {
  template: 'compare';
  title: string;
  leftLabel: string;
  rightLabel: string;
  steps: CompareStep[];
  showSpaces?: boolean;
}

export interface ComparePanelSpec {
  code: string;
  result: Binding;
  tone?: VisualTone;
  checks?: string[];
  whatIf?: string;
}

export interface CompareStepSpec extends StepBaseSpec {
  left: ComparePanelSpec;
  right: ComparePanelSpec;
}

export interface CompareSpec {
  template: 'compare';
  title: string;
  leftLabel: string;
  rightLabel: string;
  steps: CompareStepSpec[];
  showSpaces?: boolean;
}

// --- Template 6: cells (new) ---
export interface CellsStep extends StepBase {
  items: string[];
  pointers?: { name: string; index: number; tone?: VisualTone }[];
  highlightRange?: [number, number];
  tones?: Record<number, VisualTone>;
}

export interface CellsVisual {
  template: 'cells';
  title: string;
  steps: CellsStep[];
  showSpaces?: boolean;
}

export interface CellsStepSpec extends StepBaseSpec {
  items: Binding | Binding[];
  pointers?: { name: string; index: number; tone?: VisualTone }[];
  highlightRange?: [number, number];
  tones?: Record<number, VisualTone>;
}

export interface CellsSpec {
  template: 'cells';
  title: string;
  steps: CellsStepSpec[];
  showSpaces?: boolean;
}

// --- Template 7: stack-queue (new) ---
export interface StackQueueStep extends StepBase {
  mode?: 'stack' | 'queue';
  items: string[];
  action?: 'push' | 'pop' | 'enqueue' | 'dequeue' | 'idle';
  actionItem?: string;
  tones?: VisualTone[];
}

export interface StackQueueVisual {
  template: 'stack-queue';
  title: string;
  mode?: 'stack' | 'queue';
  steps: StackQueueStep[];
  showSpaces?: boolean;
}

export interface StackQueueStepSpec extends StepBaseSpec {
  mode?: 'stack' | 'queue';
  items: Binding | Binding[];
  action?: 'push' | 'pop' | 'enqueue' | 'dequeue' | 'idle';
  actionItem?: Binding;
  tones?: VisualTone[];
}

export interface StackQueueSpec {
  template: 'stack-queue';
  title: string;
  mode?: 'stack' | 'queue';
  steps: StackQueueStepSpec[];
  showSpaces?: boolean;
}

// --- Template 8: tree-graph (new) ---
export interface TreeGraphStep extends StepBase {
  activeNodeId?: string;
  visitedNodeIds?: string[];
  activeEdge?: [string, string];
  tones?: Record<string, VisualTone>;
}

export interface TreeGraphVisual {
  template: 'tree-graph';
  title: string;
  nodes: { id: string; label: string; tone?: VisualTone }[];
  edges: [string, string][];
  steps: TreeGraphStep[];
  showSpaces?: boolean;
}

export interface TreeGraphStepSpec extends StepBaseSpec {
  activeNodeId?: string;
  visitedNodeIds?: string[];
  activeEdge?: [string, string];
  tones?: Record<string, VisualTone>;
}

export interface TreeGraphSpec {
  template: 'tree-graph';
  title: string;
  nodes: { id: string; label: string; tone?: VisualTone }[];
  edges: [string, string][];
  steps: TreeGraphStepSpec[];
  showSpaces?: boolean;
}

// --- Template 9: bars (new) ---
export interface BarsStep extends StepBase {
  bars: { label: string; value: number | string; tone?: VisualTone }[];
  max?: number;
}

export interface BarsVisual {
  template: 'bars';
  title: string;
  steps: BarsStep[];
  showSpaces?: boolean;
}

export interface BarsStepSpec extends StepBaseSpec {
  bars: { label: string; value: Binding; tone?: VisualTone }[];
  max?: number;
}

export interface BarsSpec {
  template: 'bars';
  title: string;
  steps: BarsStepSpec[];
  showSpaces?: boolean;
}

// --- Template 10: sequence (new) ---
export interface SequenceStep extends StepBase {
  messages: { from: string; to: string; label: string; tone?: VisualTone }[];
  activeActor?: string;
}

export interface SequenceVisual {
  template: 'sequence';
  title: string;
  actors: string[];
  steps: SequenceStep[];
  showSpaces?: boolean;
}

export interface SequenceStepSpec extends StepBaseSpec {
  messages: { from: string; to: string; label: Binding | string; tone?: VisualTone }[];
  activeActor?: string;
}

export interface SequenceSpec {
  template: 'sequence';
  title: string;
  actors: string[];
  steps: SequenceStepSpec[];
  showSpaces?: boolean;
}

// --- Template 11: states (new) ---
export interface StatesStep extends StepBase {
  currentState: string;
  transition?: { from: string; to: string; label?: string };
  tone?: VisualTone;
}

export interface StatesVisual {
  template: 'states';
  title: string;
  states: { id: string; label: string }[];
  steps: StatesStep[];
  showSpaces?: boolean;
}

export interface StatesStepSpec extends StepBaseSpec {
  currentState: string;
  transition?: { from: string; to: string; label?: Binding | string };
  tone?: VisualTone;
}

export interface StatesSpec {
  template: 'states';
  title: string;
  states: { id: string; label: string }[];
  steps: StatesStepSpec[];
  showSpaces?: boolean;
}

// --- None template ---
export interface NoneVisual {
  template: 'none';
  reason: string;
}

export interface NoneSpec {
  template: 'none';
  reason: string;
}

// --- Filled LessonVisual (Union of all 11 filled visual templates) ---
export type LessonVisual =
  | FlowVisual
  | BoxesVisual
  | TableVisual
  | LettersVisual
  | CompareVisual
  | CellsVisual
  | StackQueueVisual
  | TreeGraphVisual
  | BarsVisual
  | SequenceVisual
  | StatesVisual;

// --- VisualSpec (Union of all specs with bindings) ---
export type VisualSpec =
  | FlowSpec
  | BoxesSpec
  | TableSpec
  | LettersSpec
  | CompareSpec
  | CellsSpec
  | StackQueueSpec
  | TreeGraphSpec
  | BarsSpec
  | SequenceSpec
  | StatesSpec
  | NoneSpec;

// --- Day-File Type (Plan C3) ---
export interface LessonVisualDayFile {
  schemaVersion: 1;
  prefix: string;
  day: number;
  promptSha: string;
  model: string;
  entries: {
    partTitle: string;
    codeHash: string;
    spec: VisualSpec;
    filled: LessonVisual | NoneVisual;
  }[];
}
