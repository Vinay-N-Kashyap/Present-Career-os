import { test } from 'node:test';
import assert from 'node:assert';
import {
  getStepIndexForPieceAt,
  getVisualAtOrder,
} from '../src/app/quests/lesson/hooks/useLessonEngine';
import type { LessonVisual } from '../src/lib/types/lessonVisual';
import {
  visualSpecSchema,
  tableSpecSchema,
  boxesSpecSchema,
  flowSpecSchema,
  bindingSchema,
  lessonVisualDayFileSchema,
} from '../src/lib/visuals/schema';
import {
  TEMPLATE_REGISTRY,
  getTemplateRegistryEntry,
  isRegisteredTemplate,
} from '../src/lib/visuals/registry';

test('getStepIndexForPieceAt returns the right step for say9 in a part with 12 say lines', () => {
  const visual: LessonVisual = {
    template: 'table',
    title: 'Loop trace with 12 say lines',
    columns: ['Step', 'Value'],
    steps: [
      { at: 'say1', caption: 'Step 1 at line 1.', rows: [{ cells: ['1', 'init'], tone: 'idle' }] },
      { at: 'say5', caption: 'Step 2 at line 5.', rows: [{ cells: ['5', 'loop'], tone: 'idle' }] },
      { at: 'say9', caption: 'Step 3 at line 9.', rows: [{ cells: ['9', 'accum'], tone: 'data' }] },
      { at: 'say12', caption: 'Step 4 at line 12.', rows: [{ cells: ['12', 'final'], tone: 'ok' }] },
    ],
  };

  // Before say1: returns step 0
  assert.strictEqual(getStepIndexForPieceAt(visual, 'intro'), 0);
  // At say1: returns step 0
  assert.strictEqual(getStepIndexForPieceAt(visual, 'say1'), 0);
  // At say3: returns step 0 (say1 is last matching step)
  assert.strictEqual(getStepIndexForPieceAt(visual, 'say3'), 0);
  // At say5: returns step 1
  assert.strictEqual(getStepIndexForPieceAt(visual, 'say5'), 1);
  // At say8: returns step 1
  assert.strictEqual(getStepIndexForPieceAt(visual, 'say8'), 1);
  // At say9: MUST return step 2 (not jumping to 0!)
  assert.strictEqual(getStepIndexForPieceAt(visual, 'say9'), 2);
  // At say10: returns step 2
  assert.strictEqual(getStepIndexForPieceAt(visual, 'say10'), 2);
  // At say12: returns step 3
  assert.strictEqual(getStepIndexForPieceAt(visual, 'say12'), 3);
  // At example: returns step 3
  assert.strictEqual(getStepIndexForPieceAt(visual, 'example'), 3);
  // At tryIt: returns step 3
  assert.strictEqual(getStepIndexForPieceAt(visual, 'tryIt'), 3);
});

test('getVisualAtOrder orders spoken pieces monotonically', () => {
  assert.strictEqual(getVisualAtOrder('intro'), 0);
  assert.strictEqual(getVisualAtOrder('say1'), 1);
  assert.strictEqual(getVisualAtOrder('say2'), 2);
  assert.strictEqual(getVisualAtOrder('say6'), 6);
  assert.strictEqual(getVisualAtOrder('say7'), 7);
  assert.strictEqual(getVisualAtOrder('say9'), 9);
  assert.strictEqual(getVisualAtOrder('say14'), 14);
  assert.strictEqual(getVisualAtOrder('example'), 1000);
  assert.strictEqual(getVisualAtOrder('tryIt'), 1001);
  assert.strictEqual(getVisualAtOrder('unknown'), 0);
});

test('a 5-column table spec passes the schema', () => {
  const spec5Col = {
    template: 'table',
    title: 'Five Column Matrix',
    columns: ['index', 'item', 'count', 'price', 'total'],
    steps: [
      {
        at: 'say1',
        caption: 'Initial inventory table.',
        rows: [
          {
            cells: [
              { text: '0' },
              { var: 'item', line: 1 },
              { var: 'count', line: 1 },
              { var: 'price', line: 1 },
              { var: 'total', line: 1 },
            ],
            tone: 'idle',
          },
        ],
      },
      {
        at: 'say5',
        caption: 'First item computed.',
        rows: [
          {
            cells: [
              { text: '1' },
              { var: 'item', line: 4, hit: 1 },
              { var: 'count', line: 4, hit: 1 },
              { var: 'price', line: 4, hit: 1 },
              { var: 'total', line: 4, hit: 1 },
            ],
            tone: 'data',
          },
        ],
      },
    ],
  };

  const parsed = visualSpecSchema.safeParse(spec5Col);
  assert.strictEqual(parsed.success, true);

  const parsedTable = tableSpecSchema.safeParse(spec5Col);
  assert.strictEqual(parsedTable.success, true);
});

test('a spec with a typed number in a value slot fails the schema', () => {
  // Table with raw number in cells slot
  const specWithNumber = {
    template: 'table',
    title: 'Invalid table with raw number',
    columns: ['col1', 'col2'],
    steps: [
      {
        at: 'say1',
        caption: 'Row with raw number.',
        rows: [
          {
            cells: [
              { text: 'label' },
              42, // Typed number in value slot! Must fail schema!
            ],
            tone: 'idle',
          },
        ],
      },
      {
        at: 'say2',
        caption: 'Second step.',
        rows: [
          {
            cells: [{ text: 'y' }, { text: 'z' }],
            tone: 'ok',
          },
        ],
      },
    ],
  };

  const parsedTable = visualSpecSchema.safeParse(specWithNumber);
  assert.strictEqual(parsedTable.success, false);

  // Boxes with raw number in values slot
  const boxesWithNumber = {
    template: 'boxes',
    title: 'Boxes with number',
    boxes: [{ id: 'b1', label: 'counter' }],
    steps: [
      {
        at: 'say1',
        caption: 'First step.',
        values: { b1: 100 }, // Raw number in value slot!
      },
      {
        at: 'say2',
        caption: 'Second step.',
        values: { b1: { var: 'x', line: 2 } },
      },
    ],
  };

  const parsedBoxes = visualSpecSchema.safeParse(boxesWithNumber);
  assert.strictEqual(parsedBoxes.success, false);
});

test('table spec validates column bounds (2-5 columns)', () => {
  // 1 column should fail (min 2)
  const oneColSpec = {
    template: 'table',
    title: 'One column',
    columns: ['single'],
    steps: [
      {
        at: 'say1',
        caption: 'Step 1.',
        rows: [{ cells: [{ text: 'a' }, { text: 'b' }] }],
      },
      {
        at: 'say2',
        caption: 'Step 2.',
        rows: [{ cells: [{ text: 'c' }, { text: 'd' }] }],
      },
    ],
  };
  assert.strictEqual(visualSpecSchema.safeParse(oneColSpec).success, false);

  // 6 columns should fail (max 5)
  const sixColSpec = {
    template: 'table',
    title: 'Six columns',
    columns: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'],
    steps: [
      {
        at: 'say1',
        caption: 'Step 1.',
        rows: [{ cells: [{ text: 'a' }, { text: 'b' }] }],
      },
      {
        at: 'say2',
        caption: 'Step 2.',
        rows: [{ cells: [{ text: 'c' }, { text: 'd' }] }],
      },
    ],
  };
  assert.strictEqual(visualSpecSchema.safeParse(sixColSpec).success, false);
});

test('bindingSchema validates all 5 binding types from Plan C2', () => {
  // 1. var binding
  assert.strictEqual(bindingSchema.safeParse({ var: 'x', line: 3 }).success, true);
  assert.strictEqual(bindingSchema.safeParse({ var: 'x', line: 3, hit: 2 }).success, true);
  assert.strictEqual(bindingSchema.safeParse({ var: 'x', line: 3, as: 'type' }).success, true);

  // 2. out binding
  assert.strictEqual(bindingSchema.safeParse({ out: 2 }).success, true);

  // 3. table binding
  assert.strictEqual(bindingSchema.safeParse({ table: 1 }).success, true);
  assert.strictEqual(bindingSchema.safeParse({ table: 1, row: 0, col: 'price' }).success, true);

  // 4. error binding
  assert.strictEqual(bindingSchema.safeParse({ error: true }).success, true);

  // 5. text binding
  assert.strictEqual(bindingSchema.safeParse({ text: 'balance -= 45' }).success, true);

  // Raw primitive values must fail
  assert.strictEqual(bindingSchema.safeParse(123).success, false);
  assert.strictEqual(bindingSchema.safeParse('hello').success, false);
  assert.strictEqual(bindingSchema.safeParse(true).success, false);
});

test('registry maps all 5 existing templates', () => {
  const existing = ['flow', 'boxes', 'table', 'letters', 'compare'] as const;
  for (const name of existing) {
    assert.ok(isRegisteredTemplate(name), `${name} should be registered`);
    const entry = getTemplateRegistryEntry(name);
    assert.ok(entry, `Entry for ${name} should exist`);
    assert.strictEqual(entry.name, name);
    assert.ok(entry.specSchema, `Schema for ${name} should exist`);
  }

  assert.strictEqual(isRegisteredTemplate('non-existent'), false);
  assert.strictEqual(getTemplateRegistryEntry('non-existent'), undefined);
  assert.strictEqual(Object.keys(TEMPLATE_REGISTRY).length, 5);
});
