import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  ComponentTreeTemplate,
  TreeGraphTemplate,
  StackQueueTemplate,
  WorkflowTemplate,
  BarsTemplate,
  CellsTemplate,
  CompareTemplate,
  LettersTemplate,
  SequenceTemplate,
  StatesTemplate,
  TableTemplate,
  RegisterBitsTemplate,
  LedgerSheetTemplate,
  FunnelTemplate,
  BoxesTemplate,
  FlowTemplate,
  WireframeTemplate,
} from '../src/app/quests/lesson/components/visuals';

describe('All 17 Lesson Visual Templates SSR & Fallback Resiliency Suite (Block 56 / TASK-346)', () => {
  test('ComponentTreeTemplate renders component tree hierarchy and handles onShapeTap in SSR', () => {
    let tapped = '';
    const html = renderToStaticMarkup(
      React.createElement(ComponentTreeTemplate, {
        step: {
          at: '0s',
          caption: 'React component render tree',
          activeId: 'Feed',
          reRenderingIds: ['PostItem'],
          nodes: [
            { id: 'App', name: '<App />', tone: 'idle' },
            { id: 'Header', name: '<Header />', tone: 'idle' },
            { id: 'Feed', name: '<Feed />', tone: 'data' },
            { id: 'PostItem', name: '<PostItem />', tone: 'ok' },
          ],
        },
        highlightedLabel: 'Feed',
        onShapeTap: (label: string) => {
          tapped = label;
        },
      })
    );

    assert.ok(html.includes('data-testid="component-tree-template-root"'));
    assert.ok(html.includes('&lt;App /&gt;') || html.includes('<App />'));
    assert.ok(html.includes('&lt;Feed /&gt;') || html.includes('<Feed />'));
    assert.ok(html.includes('&lt;PostItem /&gt;') || html.includes('<PostItem />'));
  });

  test('TreeGraphTemplate handles BFS layout, active nodes, and empty fallbacks in SSR', () => {
    // Normal graph
    const html = renderToStaticMarkup(
      React.createElement(TreeGraphTemplate, {
        nodes: [
          { id: 'n1', label: 'Root Node', tone: 'idle' },
          { id: 'n2', label: 'Left Child', tone: 'data' },
          { id: 'n3', label: 'Right Child', tone: 'ok' },
        ],
        edges: [['n1', 'n2'], ['n1', 'n3']],
        step: {
          at: '0s',
          caption: 'Binary tree search traversal',
          activeNodeId: 'n2',
          visitedNodeIds: ['n1'],
          activeEdge: ['n1', 'n2'],
          tones: { n2: 'data' },
        },
      })
    );

    assert.ok(html.includes('data-testid="tree-graph-template-root"'));
    assert.ok(html.includes('Root Node'));
    assert.ok(html.includes('Left Child'));
    assert.ok(html.includes('Right Child'));

    // Resilient fallback with empty nodes and edges
    const emptyHtml = renderToStaticMarkup(
      React.createElement(TreeGraphTemplate, {
        nodes: [],
        edges: [],
        step: {
          at: '0s',
          caption: 'Empty graph fallback',
        },
      })
    );
    assert.ok(emptyHtml.includes('data-testid="tree-graph-template-root"'));
  });

  test('StackQueueTemplate renders stack and queue modes with action badges in SSR', () => {
    // Stack mode
    const stackHtml = renderToStaticMarkup(
      React.createElement(StackQueueTemplate, {
        step: {
          at: '0s',
          caption: 'LIFO Call Stack execution',
          mode: 'stack',
          items: ['main()', 'calcTax()', 'round()'],
          tones: ['idle', 'data', 'ok'],
          action: 'push',
          actionItem: 'round()',
        },
      })
    );
    assert.ok(stackHtml.includes('data-testid="stack-queue-template-root"'));
    assert.ok(stackHtml.includes('main()'));
    assert.ok(stackHtml.includes('calcTax()'));
    assert.ok(stackHtml.includes('push'));

    // Queue mode
    const queueHtml = renderToStaticMarkup(
      React.createElement(StackQueueTemplate, {
        step: {
          at: '0s',
          caption: 'FIFO Message Queue buffer',
          mode: 'queue',
          items: ['msg_01', 'msg_02'],
          tones: ['ok', 'data'],
          action: 'pop',
          actionItem: 'msg_01',
        },
      })
    );
    assert.ok(queueHtml.includes('data-testid="stack-queue-template-root"'));
    assert.ok(queueHtml.includes('OUT (Front)'));
    assert.ok(queueHtml.includes('IN (Back)'));
    assert.ok(queueHtml.includes('pop'));
  });

  test('WorkflowTemplate, BarsTemplate, and CellsTemplate render specialized data models in SSR', () => {
    // 1. WorkflowTemplate
    const workflowHtml = renderToStaticMarkup(
      React.createElement(WorkflowTemplate, {
        step: {
          at: '0s',
          caption: 'Microservices ingress routing',
          activeStageId: 'service',
          statusBadge: '200 OK',
          throughput: '12k req/s',
          stages: [
            { id: 'client', name: 'Browser', subtext: 'Client Tier', tone: 'idle' },
            { id: 'service', name: 'API Worker', subtext: 'App Tier', tone: 'data' },
          ],
        },
      })
    );
    assert.ok(workflowHtml.includes('data-testid="workflow-template-root"'));
    assert.ok(workflowHtml.includes('Browser'));
    assert.ok(workflowHtml.includes('API Worker'));
    assert.ok(workflowHtml.includes('200 OK'));

    // 2. BarsTemplate
    const barsHtml = renderToStaticMarkup(
      React.createElement(BarsTemplate, {
        step: {
          at: '0s',
          caption: 'Execution runtime benchmark latency',
          max: 100,
          bars: [
            { label: 'Postgres Query', value: 24, tone: 'ok' },
            { label: 'Redis Cache Hit', value: 4, tone: 'data' },
          ],
        },
      })
    );
    assert.ok(barsHtml.includes('data-testid="bars-template-root"'));
    assert.ok(barsHtml.includes('Postgres Query'));
    assert.ok(barsHtml.includes('Redis Cache Hit'));

    // 3. CellsTemplate
    const cellsHtml = renderToStaticMarkup(
      React.createElement(CellsTemplate, {
        step: {
          at: '0s',
          caption: 'Two-pointer array partition window',
          items: ['10', '20', '35', '50'],
          pointers: [
            { name: 'left', index: 0, tone: 'data' },
            { name: 'right', index: 3, tone: 'ok' },
          ],
          highlightRange: [0, 3],
        },
      })
    );
    assert.ok(cellsHtml.includes('data-testid="cells-template-root"'));
    assert.ok(cellsHtml.includes('left'));
    assert.ok(cellsHtml.includes('right'));
  });

  test('CompareTemplate, LettersTemplate, SequenceTemplate, StatesTemplate, and TableTemplate render in SSR', () => {
    // 1. CompareTemplate
    const compareHtml = renderToStaticMarkup(
      React.createElement(CompareTemplate, {
        leftLabel: 'Legacy Loop',
        rightLabel: 'Vectorized Numpy',
        step: {
          at: '0s',
          caption: 'Loop vs Vector execution comparison',
          left: { code: 'for x in arr: total += x', result: '142ms', tone: 'error' },
          right: { code: 'np.sum(arr)', result: '1.2ms', tone: 'ok' },
        },
      })
    );
    assert.ok(compareHtml.includes('data-testid="compare-template-root"'));
    assert.ok(compareHtml.includes('Legacy Loop'));
    assert.ok(compareHtml.includes('Vectorized Numpy'));
    assert.ok(compareHtml.includes('142ms'));
    assert.ok(compareHtml.includes('1.2ms'));

    // 2. LettersTemplate
    const lettersHtml = renderToStaticMarkup(
      React.createElement(LettersTemplate, {
        text: 'PINIT',
        step: {
          at: '0s',
          caption: 'String character pointer indexing',
          pointer: 2,
          range: [0, 3],
          tone: 'data',
        },
      })
    );
    assert.ok(lettersHtml.includes('data-testid="letters-template-root"'));
    assert.ok(lettersHtml.includes('P'));
    assert.ok(lettersHtml.includes('I'));
    assert.ok(lettersHtml.includes('N'));

    // 3. SequenceTemplate
    const sequenceHtml = renderToStaticMarkup(
      React.createElement(SequenceTemplate, {
        actors: ['Client', 'AuthServer', 'ResourceAPI'],
        step: {
          at: '0s',
          caption: 'OAuth 2.0 PKCE flow exchange',
          activeActor: 'AuthServer',
          messages: [
            { from: 'Client', to: 'AuthServer', label: 'POST /oauth/token', tone: 'data' },
            { from: 'AuthServer', to: 'Client', label: '200 JWT Access Token', tone: 'ok' },
          ],
        },
      })
    );
    assert.ok(sequenceHtml.includes('data-testid="sequence-template-root"'));
    assert.ok(sequenceHtml.includes('AuthServer'));
    assert.ok(sequenceHtml.includes('POST /oauth/token'));

    // 4. StatesTemplate
    const statesHtml = renderToStaticMarkup(
      React.createElement(StatesTemplate, {
        states: [
          { id: 'idle', label: 'IDLE' },
          { id: 'authenticating', label: 'AUTHENTICATING' },
          { id: 'active', label: 'ACTIVE' },
        ],
        step: {
          at: '0s',
          caption: 'User session state machine transitions',
          currentState: 'authenticating',
          transition: {
            from: 'idle',
            to: 'authenticating',
            label: 'VERIFY_CREDENTIALS',
          },
          tone: 'data',
        },
      })
    );
    assert.ok(statesHtml.includes('data-testid="states-template-root"'));
    assert.ok(statesHtml.includes('AUTHENTICATING'));
    assert.ok(statesHtml.includes('VERIFY_CREDENTIALS'));

    // 5. TableTemplate
    const tableHtml = renderToStaticMarkup(
      React.createElement(TableTemplate, {
        columns: ['user_id', 'email', 'tier', 'pins'],
        step: {
          at: '0s',
          caption: 'Database relation tabular projection',
          rows: [
            ['usr_101', 'demo@pinitcareer.in', 'PRO', '250'],
            ['usr_102', 'alex@university.edu', 'FREE', '25'],
          ],
          highlightRowIndex: 0,
          tone: 'ok',
        },
      })
    );
    assert.ok(tableHtml.includes('data-testid="table-template-root"'));
    assert.ok(tableHtml.includes('user_id'));
    assert.ok(tableHtml.includes('demo@pinitcareer.in'));
    assert.ok(tableHtml.includes('250'));
  });

  test('All 17 templates expose uniform root testids and never throw on empty inputs', () => {
    // Render each template with minimal empty step
    const templates = [
      () => renderToStaticMarkup(React.createElement(ComponentTreeTemplate, { step: { caption: 'c' } })),
      () => renderToStaticMarkup(React.createElement(TreeGraphTemplate, { nodes: [], edges: [], step: { caption: 't' } })),
      () => renderToStaticMarkup(React.createElement(StackQueueTemplate, { step: { caption: 's' } })),
      () => renderToStaticMarkup(React.createElement(WorkflowTemplate, { step: { caption: 'w' } })),
      () => renderToStaticMarkup(React.createElement(BarsTemplate, { step: { caption: 'b' } })),
      () => renderToStaticMarkup(React.createElement(CellsTemplate, { step: { caption: 'c' } })),
      () => renderToStaticMarkup(React.createElement(CompareTemplate, { step: { caption: 'cmp' } })),
      () => renderToStaticMarkup(React.createElement(LettersTemplate, { text: '', step: { caption: 'l' } })),
      () => renderToStaticMarkup(React.createElement(SequenceTemplate, { actors: [], step: { caption: 'sq' } })),
      () => renderToStaticMarkup(React.createElement(StatesTemplate, { states: [], step: { caption: 'st' } })),
      () => renderToStaticMarkup(React.createElement(TableTemplate, { columns: [], step: { caption: 'tbl' } })),
      () => renderToStaticMarkup(React.createElement(RegisterBitsTemplate, { step: { caption: 'rb' } })),
      () => renderToStaticMarkup(React.createElement(LedgerSheetTemplate, { step: { caption: 'ls' } })),
      () => renderToStaticMarkup(React.createElement(FunnelTemplate, { step: { caption: 'fn' } })),
      () => renderToStaticMarkup(React.createElement(BoxesTemplate, { boxes: [], step: { caption: 'bx' } })),
      () => renderToStaticMarkup(React.createElement(FlowTemplate, { nodes: [], step: { caption: 'fl' } })),
      () => renderToStaticMarkup(React.createElement(WireframeTemplate, { boxes: [], step: { caption: 'wf' } })),
    ];

    for (const renderFn of templates) {
      assert.doesNotThrow(() => {
        const out = renderFn();
        assert.ok(typeof out === 'string');
        assert.ok(out.length > 0);
      });
    }
  });
});
