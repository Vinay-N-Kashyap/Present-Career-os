import test from 'node:test';
import assert from 'node:assert/strict';
import { loadPyodide, type PyodideInterface } from 'pyodide';

import { fill } from '../src/lib/visuals/fill';
import type {
  TableSpec,
  BoxesSpec,
  LettersSpec,
  FlowSpec,
  CompareSpec,
  CellsSpec,
  CellsVisual,
  StackQueueSpec,
  StackQueueVisual,
  TreeGraphSpec,
  TreeGraphVisual,
  BarsSpec,
  BarsVisual,
  SequenceSpec,
  SequenceVisual,
} from '../src/lib/types/lessonVisual';
import { PYTHON_LONG_LESSONS } from '../src/lib/data/pythonLongLessons';
import { DSA_PYTHON_LONG_LESSONS } from '../src/lib/data/dsaPythonLongLessons';
import { VECTOR_PYTHON_LONG_LESSONS } from '../src/lib/data/vectorPythonLongLessons';
import { DIST_PYTHON_LONG_LESSONS } from '../src/lib/data/distPythonLongLessons';
import { TEMPLATE_REGISTRY } from '../src/lib/visuals/registry';

let pyodide: PyodideInterface;

test.before(async () => {
  pyodide = await loadPyodide();
});

// Test 1: registry contains fill adapters for all 5 existing templates
test('1. registry contains fill adapters for all 5 existing templates', () => {
  assert.ok(TEMPLATE_REGISTRY.flow.fill, 'flow has fill adapter');
  assert.ok(TEMPLATE_REGISTRY.boxes.fill, 'boxes has fill adapter');
  assert.ok(TEMPLATE_REGISTRY.table.fill, 'table has fill adapter');
  assert.ok(TEMPLATE_REGISTRY.letters.fill, 'letters has fill adapter');
  assert.ok(TEMPLATE_REGISTRY.compare.fill, 'compare has fill adapter');
});

// Test 2: pilot 1.3: NameError from an edit
test('2. pilot 1.3: NameError from an edit', async () => {
  const day1 = PYTHON_LONG_LESSONS.find((l) => l.day === 1);
  assert.ok(day1);
  const part3 = day1.parts[2]; // Day 1 Part 3: line by line
  assert.ok(part3);

  const spec1_3: TableSpec = {
    template: 'table',
    title: 'Python reads top to bottom',
    columns: ['Line', 'What happens'],
    steps: [
      {
        at: 'say1',
        caption: 'Each line finishes before the next one starts.',
        rows: [
          { cells: [{ text: 'line 1' }, { out: 1 }], tone: 'ok' },
          { cells: [{ text: 'line 2' }, { out: 2 }], tone: 'ok' },
          { cells: [{ text: 'line 3' }, { out: 3 }], tone: 'ok' },
        ],
      },
      {
        at: 'say2',
        caption: 'A mistake while running stops Python; lines below never run.',
        edit: {
          replaceLine: { line: 2, text: 'prnt("Step 2: add an expense")' },
        },
        rows: [
          { cells: [{ text: 'print("Step 1: open the app")' }, { out: 1 }], tone: 'ok' },
          { cells: [{ text: 'prnt("Step 2: add an expense")' }, { error: true }], tone: 'error' },
          { cells: [{ text: 'print("Step 3: see the total")' }, { text: 'never ran' }], tone: 'idle' },
        ],
      },
      {
        at: 'say4',
        caption: 'A missing quote is a SyntaxError, so nothing runs at all.',
        edit: {
          replaceLine: { line: 2, text: 'print("Step 2: add an expense)' },
        },
        rows: [
          { cells: [{ text: 'line 1' }, { text: 'nothing printed' }], tone: 'idle' },
          { cells: [{ text: 'print("Step 2: add an expense)' }, { error: true }], tone: 'error' },
          { cells: [{ text: 'line 3' }, { text: 'nothing printed' }], tone: 'idle' },
        ],
      },
    ],
  };

  const filled = await fill(spec1_3, part3, { pyodide });
  assert.equal(filled.template, 'table');
  if (filled.template !== 'table') return;

  assert.equal(filled.steps.length, 3);
  // Step 1: real output lines
  assert.equal(filled.steps[0].rows[0].cells[1], 'Step 1: open the app');
  assert.equal(filled.steps[0].rows[1].cells[1], 'Step 2: add an expense');
  assert.equal(filled.steps[0].rows[2].cells[1], 'Step 3: see the total');

  // Step 2: NameError from edit
  assert.equal(filled.steps[1].rows[0].cells[1], 'Step 1: open the app');
  assert.equal(filled.steps[1].rows[1].cells[1], 'NameError');
  assert.equal(filled.steps[1].rows[2].cells[1], 'never ran');

  // Step 3: SyntaxError from edit
  assert.equal(filled.steps[2].rows[1].cells[1], 'SyntaxError');
});

// Test 3: pilot 2.1: total 185, then 215 from an edit
test('3. pilot 2.1: total 185, then 215 from an edit', async () => {
  const day2 = PYTHON_LONG_LESSONS.find((l) => l.day === 2);
  assert.ok(day2);
  const part1 = day2.parts[0]; // Day 2 Part 1: What a variable is
  assert.ok(part1);

  const spec2_1: BoxesSpec = {
    template: 'boxes',
    title: 'A variable is a labelled box',
    boxes: [
      { id: 'tea', label: 'tea' },
      { id: 'bus_fare', label: 'bus_fare' },
      { id: 'lunch', label: 'lunch' },
      { id: 'total', label: 'total' },
    ],
    steps: [
      {
        at: 'say2',
        caption: 'tea = 20 stores 20 in the box named tea.',
        values: {
          tea: { var: 'tea', line: 1 },
          bus_fare: { text: '' },
          lunch: { text: '' },
          total: { text: '' },
        },
        tones: { tea: 'data', bus_fare: 'idle', lunch: 'idle', total: 'idle' },
      },
      {
        at: 'say3',
        caption: '= puts the value on the right into the name on the left.',
        values: {
          tea: { var: 'tea', line: 1 },
          bus_fare: { var: 'bus_fare', line: 2 },
          lunch: { var: 'lunch', line: 3 },
          total: { text: '' },
        },
        tones: { tea: 'data', bus_fare: 'data', lunch: 'data', total: 'idle' },
      },
      {
        at: 'example',
        caption: 'total uses the labels: 20 + 45 + 120 = 185.',
        values: {
          tea: { var: 'tea', line: 1 },
          bus_fare: { var: 'bus_fare', line: 2 },
          lunch: { var: 'lunch', line: 3 },
          total: { var: 'total', line: 4 },
        },
        tones: { tea: 'idle', bus_fare: 'idle', lunch: 'idle', total: 'ok' },
      },
      {
        at: 'tryIt',
        caption: 'Change one box and the total follows: 215.',
        edit: {
          replaceLine: { line: 3, text: 'lunch = 150' },
        },
        values: {
          tea: { var: 'tea', line: 1 },
          bus_fare: { var: 'bus_fare', line: 2 },
          lunch: { var: 'lunch', line: 3 },
          total: { var: 'total', line: 4 },
        },
        tones: { tea: 'idle', bus_fare: 'idle', lunch: 'data', total: 'ok' },
      },
    ],
  };

  const filled = await fill(spec2_1, part1, { pyodide });
  assert.equal(filled.template, 'boxes');
  if (filled.template !== 'boxes') return;

  assert.equal(filled.steps.length, 4);
  assert.equal(filled.steps[0].values.tea, '20');
  assert.equal(filled.steps[1].values.bus_fare, '45');
  assert.equal(filled.steps[1].values.lunch, '120');

  // Step 3 (example): total 185
  assert.equal(filled.steps[2].values.total, '185');

  // Step 4 (tryIt edit): lunch 150, total 215
  assert.equal(filled.steps[3].values.lunch, '150');
  assert.equal(filled.steps[3].values.total, '215');
});

// Test 4: pilot 2.2: balance 500, 480, 435, then 1435 from appendLines
test('4. pilot 2.2: balance 500, 480, 435, then 1435 from appendLines', async () => {
  const day2 = PYTHON_LONG_LESSONS.find((l) => l.day === 2);
  assert.ok(day2);
  const part2 = day2.parts[1]; // Day 2 Part 2: Changing a variable
  assert.ok(part2);

  const spec2_2: BoxesSpec = {
    template: 'boxes',
    title: 'A box keeps only its newest value',
    boxes: [{ id: 'balance', label: 'balance' }],
    steps: [
      {
        at: 'say1',
        caption: 'balance starts at 500.',
        values: { balance: { var: 'balance', line: 1 } },
        tones: { balance: 'data' },
      },
      {
        at: 'say2',
        caption: 'balance = balance - 20 stores 480; 500 is forgotten.',
        values: { balance: { var: 'balance', line: 3 } },
        tones: { balance: 'data' },
      },
      {
        at: 'say3',
        caption: 'balance -= 45 is the short form: now 435.',
        values: { balance: { var: 'balance', line: 5 } },
        tones: { balance: 'data' },
      },
      {
        at: 'tryIt',
        caption: 'balance += 1000 adds the salary: 1435.',
        edit: {
          appendLines: ['balance += 1000'],
        },
        values: { balance: { var: 'balance', line: 7 } },
        tones: { balance: 'ok' },
      },
    ],
  };

  const filled = await fill(spec2_2, part2, { pyodide });
  assert.equal(filled.template, 'boxes');
  if (filled.template !== 'boxes') return;

  assert.equal(filled.steps.length, 4);
  assert.equal(filled.steps[0].values.balance, '500');
  assert.equal(filled.steps[1].values.balance, '480');
  assert.equal(filled.steps[2].values.balance, '435');
  assert.equal(filled.steps[3].values.balance, '1435');
});

// Test 5: pilot 3.2: IndexError
test('5. pilot 3.2: IndexError', async () => {
  const day3 = PYTHON_LONG_LESSONS.find((l) => l.day === 3);
  assert.ok(day3);
  const part2 = day3.parts[1]; // Day 3 Part 2: Length and positions
  assert.ok(part2);

  const spec3_2: LettersSpec = {
    template: 'letters',
    title: 'Positions start at 0',
    text: 'Priya',
    steps: [
      {
        at: 'say1',
        caption: 'len() counts every character: 5.',
        range: [0, 5],
        result: { text: 'len(name) = 5' },
        tone: 'ok',
      },
      {
        at: 'say2',
        caption: 'The first character is at position 0, not 1.',
        pointer: 0,
        result: { text: 'name[0] = P' },
        tone: 'data',
      },
      {
        at: 'say3',
        caption: '-1 is always the last character.',
        pointer: -1,
        result: { text: 'name[-1] = a' },
        tone: 'data',
      },
      {
        at: 'say4',
        caption: 'There is nothing at position 10, so Python gives an IndexError.',
        pointer: 10,
        edit: {
          appendLines: ['print(name[10])'],
        },
        result: { error: true },
        tone: 'error',
      },
    ],
  };

  const filled = await fill(spec3_2, part2, { pyodide });
  assert.equal(filled.template, 'letters');
  if (filled.template !== 'letters') return;

  assert.equal(filled.steps.length, 4);
  assert.equal(filled.steps[0].result, 'len(name) = 5');
  assert.equal(filled.steps[1].result, 'name[0] = P');
  assert.equal(filled.steps[2].result, 'name[-1] = a');
  assert.equal(filled.steps[3].result, 'IndexError');
});

// Test 6: flow adapter fills properly
test('6. flow adapter fills properly', async () => {
  const day2 = PYTHON_LONG_LESSONS.find((l) => l.day === 2);
  assert.ok(day2);
  const part5 = day2.parts[4]; // Day 2 Part 5: Converting between types
  assert.ok(part5);

  const flowSpec: FlowSpec = {
    template: 'flow',
    title: 'Changing a value type',
    nodes: [
      { id: 'value', label: 'value' },
      { id: 'tool', label: 'tool' },
      { id: 'result', label: 'result' },
    ],
    steps: [
      {
        at: 'say2',
        caption: 'str(20) makes the text "20".',
        values: {
          value: { text: '20' },
          tool: { text: 'str()' },
          result: { text: 'Tea costs 20' },
        },
        tones: { value: 'idle', tool: 'idle', result: 'ok' },
        arrows: [['value', 'tool'], ['tool', 'result']],
      },
    ],
  };

  const filled = await fill(flowSpec, part5, { pyodide });
  assert.equal(filled.template, 'flow');
  if (filled.template !== 'flow') return;

  assert.equal(filled.steps[0].values.value, '20');
  assert.equal(filled.steps[0].values.result, 'Tea costs 20');
});

// Test 7: compare adapter fills panels independently
test('7. compare adapter fills panels independently', async () => {
  const day1 = PYTHON_LONG_LESSONS.find((l) => l.day === 1);
  assert.ok(day1);
  const part4 = day1.parts[3]; // Day 1 Part 4: Capital letters matter
  assert.ok(part4);

  const compareSpec: CompareSpec = {
    template: 'compare',
    title: 'Small and capital letters are different',
    leftLabel: 'print',
    rightLabel: 'Print',
    steps: [
      {
        at: 'say1',
        caption: 'Python knows print, not Print.',
        left: {
          code: 'print("hello")',
          result: { out: 1 },
          tone: 'ok',
        },
        right: {
          code: 'Print("hello")',
          result: { error: true },
          tone: 'error',
        },
      },
    ],
  };

  const filled = await fill(compareSpec, part4, { pyodide });
  assert.equal(filled.template, 'compare');
  if (filled.template !== 'compare') return;

  assert.equal(filled.steps[0].left.result, 'hello');
  assert.equal(filled.steps[0].right.result, 'NameError');
});

// Test 8: throws clear error naming step and binding when value cannot be found
test('8. throws clear error naming step and binding when value cannot be found', async () => {
  const day2 = PYTHON_LONG_LESSONS.find((l) => l.day === 2);
  assert.ok(day2);
  const part1 = day2.parts[0];

  const badVarSpec: BoxesSpec = {
    template: 'boxes',
    title: 'Missing variable test',
    boxes: [{ id: 'missing', label: 'missing' }],
    steps: [
      {
        at: 'say2',
        caption: 'This variable does not exist.',
        values: {
          missing: { var: 'nonexistent_var', line: 1 },
        },
      },
    ],
  };

  await assert.rejects(
    async () => {
      await fill(badVarSpec, part1, { pyodide });
    },
    (err: Error) => {
      assert.ok(err.message.includes('say2'), `should name step: ${err.message}`);
      assert.ok(err.message.includes('nonexistent_var'), `should name binding: ${err.message}`);
      return true;
    }
  );

  const badOutSpec: BoxesSpec = {
    template: 'boxes',
    title: 'Missing output line test',
    boxes: [{ id: 'outBox', label: 'outBox' }],
    steps: [
      {
        at: 'say3',
        caption: 'This output line does not exist.',
        values: {
          outBox: { out: 999 },
        },
      },
    ],
  };

  await assert.rejects(
    async () => {
      await fill(badOutSpec, part1, { pyodide });
    },
    (err: Error) => {
      assert.ok(err.message.includes('say3'), `should name step: ${err.message}`);
      assert.ok(err.message.includes('999'), `should name binding: ${err.message}`);
      return true;
    }
  );
});

// Test 9: cells adapter fills real dsa-py Day 8 two-pointers part
test('9. cells adapter fills real dsa-py Day 8 two-pointers part', async () => {
  assert.ok(TEMPLATE_REGISTRY.cells?.fill, 'cells template is registered with fill adapter');

  const day8 = DSA_PYTHON_LONG_LESSONS.find((l) => l.day === 8);
  assert.ok(day8, 'dsa-py Day 8 must exist');
  const part0 = day8.parts[0];
  assert.ok(part0, 'Day 8 Part 0 must exist');

  const spec: CellsSpec = {
    template: 'cells',
    title: 'Two pointers pair with sum',
    steps: [
      {
        at: 'say1',
        caption: 'Two pointers start at opposite ends of sorted array.',
        items: { var: 'sorted_nums', line: 4, hit: 1 },
        pointers: [
          { name: 'left', index: 0, tone: 'data' },
          { name: 'right', index: 5, tone: 'data' },
        ],
        tones: { 0: 'data', 5: 'data' },
      },
      {
        at: 'say2',
        caption: 'Pointers meet at index 2 and 3 summing to 10.',
        items: { var: 'sorted_nums', line: 4, hit: 5 },
        pointers: [
          { name: 'left', index: 2, tone: 'ok' },
          { name: 'right', index: 3, tone: 'ok' },
        ],
        tones: { 2: 'ok', 3: 'ok' },
      },
    ],
  };

  const filled = (await fill(spec, part0, { pyodide })) as CellsVisual;

  assert.equal(filled.template, 'cells');
  assert.equal(filled.title, 'Two pointers pair with sum');
  assert.equal(filled.steps.length, 2);

  // Step 1 assertions
  assert.deepEqual(filled.steps[0].items, ['1', '3', '4', '6', '8', '11']);
  assert.equal(filled.steps[0].pointers?.length, 2);
  assert.equal(filled.steps[0].pointers?.[0].name, 'left');
  assert.equal(filled.steps[0].pointers?.[0].index, 0);
  assert.equal(filled.steps[0].pointers?.[1].name, 'right');
  assert.equal(filled.steps[0].pointers?.[1].index, 5);

  // Step 2 assertions
  assert.deepEqual(filled.steps[1].items, ['1', '3', '4', '6', '8', '11']);
  assert.equal(filled.steps[1].pointers?.[0].index, 2);
  assert.equal(filled.steps[1].pointers?.[1].index, 3);
});

// Test 10: stack-queue adapter fills real dsa-py Day 4 LIFO stack part
test('10. stack-queue adapter fills real dsa-py Day 4 LIFO stack part', async () => {
  assert.ok(TEMPLATE_REGISTRY['stack-queue']?.fill, 'stack-queue template is registered with fill adapter');

  const day4 = DSA_PYTHON_LONG_LESSONS.find((l) => l.day === 4);
  assert.ok(day4, 'dsa-py Day 4 must exist');
  const part0 = day4.parts[0];
  assert.ok(part0, 'Day 4 Part 0 must exist');

  const spec: StackQueueSpec = {
    template: 'stack-queue',
    title: 'LIFO editor undo stack',
    mode: 'stack',
    steps: [
      {
        at: 'say1',
        caption: 'Two actions appended to stack.',
        items: { var: 'stack', line: 3 },
        action: 'push',
        actionItem: { text: 'type hello' },
      },
      {
        at: 'say2',
        caption: 'Third action pushed onto the top.',
        items: { var: 'stack', line: 4 },
        action: 'push',
        actionItem: { text: 'make bold' },
      },
      {
        at: 'say3',
        caption: 'Undo pops make bold off the top.',
        items: { var: 'stack', line: 6 },
        action: 'pop',
        actionItem: { text: 'make bold' },
      },
    ],
  };

  const filled = (await fill(spec, part0, { pyodide })) as StackQueueVisual;

  assert.equal(filled.template, 'stack-queue');
  assert.equal(filled.title, 'LIFO editor undo stack');
  assert.equal(filled.mode, 'stack');
  assert.equal(filled.steps.length, 3);

  // Step 1: ['open file', 'type hello']
  assert.deepEqual(filled.steps[0].items, ["'open file'", "'type hello'"]);
  assert.equal(filled.steps[0].action, 'push');
  assert.equal(filled.steps[0].actionItem, 'type hello');

  // Step 2: ['open file', 'type hello', 'make bold']
  assert.deepEqual(filled.steps[1].items, ["'open file'", "'type hello'", "'make bold'"]);
  assert.equal(filled.steps[1].action, 'push');

  // Step 3: ['open file', 'type hello'] after pop
  assert.deepEqual(filled.steps[2].items, ["'open file'", "'type hello'"]);
  assert.equal(filled.steps[2].action, 'pop');
});

// Test 11: tree-graph adapter fills real dsa-py Day 16 binary tree part
test('11. tree-graph adapter fills real dsa-py Day 16 binary tree part', async () => {
  assert.ok(TEMPLATE_REGISTRY['tree-graph']?.fill, 'tree-graph template is registered with fill adapter');

  const day16 = DSA_PYTHON_LONG_LESSONS.find((l) => l.day === 16);
  assert.ok(day16, 'dsa-py Day 16 must exist');
  const part0 = day16.parts[0];
  assert.ok(part0, 'Day 16 Part 0 must exist');

  const spec: TreeGraphSpec = {
    template: 'tree-graph',
    title: 'Binary tree 5 nodes',
    nodes: [
      { id: '1', label: '1' },
      { id: '2', label: '2' },
      { id: '3', label: '3' },
      { id: '4', label: '4' },
      { id: '5', label: '5' },
    ],
    edges: [
      ['1', '2'],
      ['1', '3'],
      ['2', '4'],
      ['2', '5'],
    ],
    steps: [
      {
        at: 'say1',
        caption: 'Root node 1 visited.',
        activeNodeId: '1',
        visitedNodeIds: ['1'],
      },
      {
        at: 'say2',
        caption: 'Left subtree root 2 visited.',
        activeNodeId: '2',
        activeEdge: ['1', '2'],
        visitedNodeIds: ['1', '2'],
      },
      {
        at: 'say3',
        caption: 'Leaf node 4 visited.',
        activeNodeId: '4',
        activeEdge: ['2', '4'],
        visitedNodeIds: ['1', '2', '4'],
      },
    ],
  };

  const filled = (await fill(spec, part0, { pyodide })) as TreeGraphVisual;

  assert.equal(filled.template, 'tree-graph');
  assert.equal(filled.title, 'Binary tree 5 nodes');
  assert.equal(filled.nodes.length, 5);
  assert.equal(filled.edges.length, 4);
  assert.equal(filled.steps.length, 3);

  // Step 1 assertions
  assert.equal(filled.steps[0].activeNodeId, '1');
  assert.deepEqual(filled.steps[0].visitedNodeIds, ['1']);

  // Step 2 assertions
  assert.equal(filled.steps[1].activeNodeId, '2');
  assert.deepEqual(filled.steps[1].activeEdge, ['1', '2']);
  assert.deepEqual(filled.steps[1].visitedNodeIds, ['1', '2']);

  // Step 3 assertions
  assert.equal(filled.steps[2].activeNodeId, '4');
  assert.deepEqual(filled.steps[2].activeEdge, ['2', '4']);
  assert.deepEqual(filled.steps[2].visitedNodeIds, ['1', '2', '4']);
});

// Test 12: bars adapter fills real vec-py Day 5 metrics part
test('12. bars adapter fills real vec-py Day 5 metrics part', async () => {
  assert.ok(TEMPLATE_REGISTRY.bars?.fill, 'bars template is registered with fill adapter');

  const day5 = VECTOR_PYTHON_LONG_LESSONS.find((l) => l.day === 5);
  assert.ok(day5, 'vec-py Day 5 must exist');
  const part4 = day5.parts[4];
  assert.ok(part4, 'Day 5 Part 4 must exist');

  const spec: BarsSpec = {
    template: 'bars',
    title: 'Query retrieval recall scores',
    steps: [
      {
        at: 'say1',
        caption: 'Recall scores per query category.',
        bars: [
          { label: 'refund policy', value: { text: '1.0' }, tone: 'ok' },
          { label: 'track my order', value: { text: '0.5' }, tone: 'data' },
          { label: 'store hours', value: { text: '1.0' }, tone: 'ok' },
          { label: 'warranty claim', value: { text: '0.0' }, tone: 'error' },
        ],
        max: 1.0,
      },
      {
        at: 'say2',
        caption: 'Mean recall across queries.',
        bars: [
          { label: 'mean recall', value: { var: 'mean', line: 2 }, tone: 'data' },
        ],
        max: 1.0,
      },
    ],
  };

  const filled = (await fill(spec, part4, { pyodide })) as BarsVisual;

  assert.equal(filled.template, 'bars');
  assert.equal(filled.title, 'Query retrieval recall scores');
  assert.equal(filled.steps.length, 2);

  // Step 1: 4 bars
  assert.equal(filled.steps[0].bars.length, 4);
  assert.equal(filled.steps[0].bars[0].label, 'refund policy');
  assert.equal(filled.steps[0].bars[0].value, 1.0);
  assert.equal(filled.steps[0].bars[0].tone, 'ok');
  assert.equal(filled.steps[0].bars[3].value, 0.0);
  assert.equal(filled.steps[0].bars[3].tone, 'error');

  // Step 2: mean recall 0.625
  assert.equal(filled.steps[1].bars.length, 1);
  assert.equal(filled.steps[1].bars[0].label, 'mean recall');
  assert.equal(filled.steps[1].bars[0].value, 0.625);
  assert.equal(filled.steps[1].bars[0].tone, 'data');
});

// Test 13: sequence adapter fills real dist-py Day 3 RPC part
test('13. sequence adapter fills real dist-py Day 3 RPC part', async () => {
  assert.ok(TEMPLATE_REGISTRY.sequence?.fill, 'sequence template is registered with fill adapter');

  const day3 = DIST_PYTHON_LONG_LESSONS.find((l) => l.day === 3);
  assert.ok(day3, 'dist-py Day 3 must exist');
  const part0 = day3.parts[0];
  assert.ok(part0, 'Day 3 Part 0 must exist');

  const spec: SequenceSpec = {
    template: 'sequence',
    title: 'Client Server RPC Call',
    actors: ['Client', 'Server'],
    steps: [
      {
        at: 'say1',
        caption: 'Client sends request message on the wire.',
        messages: [
          { from: 'Client', to: 'Server', label: { text: 'get_stock("sku-42")' }, tone: 'data' },
        ],
        activeActor: 'Client',
      },
      {
        at: 'say2',
        caption: 'Server handles request and responds with stock value 7.',
        messages: [
          { from: 'Client', to: 'Server', label: { text: 'get_stock("sku-42")' }, tone: 'data' },
          { from: 'Server', to: 'Client', label: { text: 'stock: 7' }, tone: 'ok' },
        ],
        activeActor: 'Server',
      },
    ],
  };

  const filled = (await fill(spec, part0, { pyodide })) as SequenceVisual;

  assert.equal(filled.template, 'sequence');
  assert.equal(filled.title, 'Client Server RPC Call');
  assert.deepEqual(filled.actors, ['Client', 'Server']);
  assert.equal(filled.steps.length, 2);

  // Step 1: 1 message
  assert.equal(filled.steps[0].messages.length, 1);
  assert.equal(filled.steps[0].messages[0].from, 'Client');
  assert.equal(filled.steps[0].messages[0].to, 'Server');
  assert.equal(filled.steps[0].messages[0].label, 'get_stock("sku-42")');
  assert.equal(filled.steps[0].activeActor, 'Client');

  // Step 2: 2 messages
  assert.equal(filled.steps[1].messages.length, 2);
  assert.equal(filled.steps[1].messages[1].from, 'Server');
  assert.equal(filled.steps[1].messages[1].to, 'Client');
  assert.equal(filled.steps[1].messages[1].label, 'stock: 7');
  assert.equal(filled.steps[1].activeActor, 'Server');
});
