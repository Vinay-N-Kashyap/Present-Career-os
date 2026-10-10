'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import type {
  FlowVisual,
  BoxesVisual,
  TableVisual,
  LettersVisual,
  CompareVisual,
  CellsVisual,
  StackQueueVisual,
  TreeGraphVisual,
  BarsVisual,
  SequenceVisual,
  StatesVisual,
} from '@/lib/types/lessonVisual';
import { FlowTemplate } from '@/app/quests/lesson/components/visuals/FlowTemplate';
import { BoxesTemplate } from '@/app/quests/lesson/components/visuals/BoxesTemplate';
import { TableTemplate } from '@/app/quests/lesson/components/visuals/TableTemplate';
import { LettersTemplate } from '@/app/quests/lesson/components/visuals/LettersTemplate';
import { CompareTemplate } from '@/app/quests/lesson/components/visuals/CompareTemplate';
import { CellsTemplate } from '@/app/quests/lesson/components/visuals/CellsTemplate';
import { StackQueueTemplate } from '@/app/quests/lesson/components/visuals/StackQueueTemplate';
import { TreeGraphTemplate } from '@/app/quests/lesson/components/visuals/TreeGraphTemplate';
import { BarsTemplate } from '@/app/quests/lesson/components/visuals/BarsTemplate';
import { SequenceTemplate } from '@/app/quests/lesson/components/visuals/SequenceTemplate';
import { StatesTemplate } from '@/app/quests/lesson/components/visuals/StatesTemplate';



const sampleFlow: FlowVisual = {
  template: 'flow',
  title: 'Data Processing Pipeline',
  nodes: [
    { id: 'input', label: 'Input' },
    { id: 'filter', label: 'Filter' },
    { id: 'output', label: 'Output' },
  ],
  steps: [
    {
      at: 'say1',
      caption: 'Raw data enters the pipeline.',
      values: { input: 'data', filter: '', output: '' },
      tones: { input: 'data', filter: 'idle', output: 'idle' },
      arrows: [],
    },
    {
      at: 'say2',
      caption: 'Filter cleans and normalizes records.',
      values: { input: 'data', filter: 'clean', output: '' },
      tones: { input: 'idle', filter: 'data', output: 'idle' },
      arrows: [['input', 'filter']],
    },
    {
      at: 'say3',
      caption: 'Output receives clean dataset.',
      values: { input: 'data', filter: 'clean', output: 'ready' },
      tones: { input: 'idle', filter: 'idle', output: 'ok' },
      arrows: [['filter', 'output']],
    },
  ],
};

const sampleBoxes: BoxesVisual = {
  template: 'boxes',
  title: 'Variable Memory Slots',
  boxes: [
    { id: 'tea', label: 'tea' },
    { id: 'snack', label: 'snack' },
    { id: 'total', label: 'total' },
  ],
  steps: [
    {
      at: 'say1',
      caption: 'tea variable is initialized to 20.',
      values: { tea: '20', snack: '', total: '' },
      tones: { tea: 'data', snack: 'idle', total: 'idle' },
    },
    {
      at: 'say2',
      caption: 'snack variable is set to 35.',
      values: { tea: '20', snack: '35', total: '' },
      tones: { tea: 'data', snack: 'data', total: 'idle' },
    },
    {
      at: 'say3',
      caption: 'total stores sum of both items: 55.',
      values: { tea: '20', snack: '35', total: '55' },
      tones: { tea: 'idle', snack: 'idle', total: 'ok' },
    },
  ],
};

const sampleTable: TableVisual = {
  template: 'table',
  title: 'Database Query Results',
  columns: ['ID', 'Product', 'Price'],
  steps: [
    {
      at: 'say1',
      caption: 'First row returned from database.',
      rows: [{ cells: ['1', 'Masala Chai', '20'], tone: 'ok' }],
    },
    {
      at: 'say2',
      caption: 'Second row added to results table.',
      rows: [
        { cells: ['1', 'Masala Chai', '20'], tone: 'ok' },
        { cells: ['2', 'Filter Coffee', '30'], tone: 'ok' },
      ],
    },
    {
      at: 'say3',
      caption: 'All three inventory rows displayed.',
      rows: [
        { cells: ['1', 'Masala Chai', '20'], tone: 'ok' },
        { cells: ['2', 'Filter Coffee', '30'], tone: 'ok' },
        { cells: ['3', 'Samosa', '15'], tone: 'ok' },
      ],
    },
  ],
};

const sampleLetters: LettersVisual = {
  template: 'letters',
  title: 'String Index & Slicing',
  text: 'PYTHON',
  steps: [
    {
      at: 'say1',
      caption: 'Index 0 points to first character P.',
      pointer: 0,
      result: 'P',
      tone: 'data',
    },
    {
      at: 'say2',
      caption: 'Negative index -1 points to last character N.',
      pointer: -1,
      result: 'N',
      tone: 'data',
    },
    {
      at: 'say3',
      caption: 'Slice [0:2] extracts substring PY.',
      range: [0, 2],
      result: 'PY',
      tone: 'ok',
    },
  ],
};

const sampleCompare: CompareVisual = {
  template: 'compare',
  title: 'Syntax Comparison',
  leftLabel: 'Correct Syntax',
  rightLabel: 'Common Error',
  steps: [
    {
      at: 'say1',
      caption: 'Function names are lowercase.',
      left: {
        code: 'print("hello")',
        result: 'hello',
        tone: 'ok',
        checks: ['hello'],
      },
      right: {
        code: 'Print("hello")',
        result: 'NameError',
        tone: 'error',
        checks: ['NameError'],
      },
    },
    {
      at: 'say2',
      caption: 'Index must exist within sequence.',
      left: {
        code: '"hi"[0]',
        result: 'h',
        tone: 'ok',
        checks: ['h'],
      },
      right: {
        code: '"hi"[10]',
        result: 'IndexError',
        tone: 'error',
        checks: ['IndexError'],
      },
    },
  ],
};

const sampleCells: CellsVisual = {
  template: 'cells',
  title: 'Two Pointers Search',
  steps: [
    {
      at: 'say1',
      caption: 'Two pointers start at opposite ends of the sorted array.',
      items: ['1', '3', '4', '6', '8', '11'],
      pointers: [
        { name: 'left', index: 0, tone: 'data' },
        { name: 'right', index: 5, tone: 'data' },
      ],
    },
    {
      at: 'say2',
      caption: 'Sum 1 + 11 = 12 > 10; right pointer moves inward.',
      items: ['1', '3', '4', '6', '8', '11'],
      pointers: [
        { name: 'left', index: 0, tone: 'data' },
        { name: 'right', index: 4, tone: 'data' },
      ],
    },
    {
      at: 'say3',
      caption: 'Target sum found: left at 2 (4) and right at 3 (6) equals 10.',
      items: ['1', '3', '4', '6', '8', '11'],
      pointers: [
        { name: 'left', index: 2, tone: 'ok' },
        { name: 'right', index: 3, tone: 'ok' },
      ],
      tones: { 2: 'ok', 3: 'ok' },
    },
  ],
};

const sampleStackQueue: StackQueueVisual = {
  template: 'stack-queue',
  title: 'Call Stack Execution',
  mode: 'stack',
  steps: [
    {
      at: 'say1',
      caption: 'Initial frames pushed: open file, then type hello.',
      items: ['open file', 'type hello'],
      action: 'push',
      actionItem: 'type hello',
      tones: ['idle', 'data'],
    },
    {
      at: 'say2',
      caption: 'make bold frame pushed to the top of the stack.',
      items: ['open file', 'type hello', 'make bold'],
      action: 'push',
      actionItem: 'make bold',
      tones: ['idle', 'idle', 'ok'],
    },
    {
      at: 'say3',
      caption: 'make bold finishes and is popped from the stack.',
      items: ['open file', 'type hello'],
      action: 'pop',
      actionItem: 'make bold',
      tones: ['idle', 'data'],
    },
  ],
};

const sampleTreeGraph: TreeGraphVisual = {
  template: 'tree-graph',
  title: 'Binary Tree Traversal',
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
      caption: 'Traversal starts at root node 1.',
      activeNodeId: '1',
      visitedNodeIds: ['1'],
    },
    {
      at: 'say2',
      caption: 'Preorder moves to left child 2.',
      activeNodeId: '2',
      activeEdge: ['1', '2'],
      visitedNodeIds: ['1', '2'],
    },
    {
      at: 'say3',
      caption: 'Visit leaf node 4.',
      activeNodeId: '4',
      activeEdge: ['2', '4'],
      visitedNodeIds: ['1', '2', '4'],
    },
  ],
};

const sampleBars: BarsVisual = {
  template: 'bars',
  title: 'Retrieval Recall by Query',
  steps: [
    {
      at: 'say1',
      caption: 'Initial retrieval recall across query categories.',
      bars: [
        { label: 'refund policy', value: 1.0, tone: 'ok' },
        { label: 'track my order', value: 0.5, tone: 'data' },
        { label: 'store hours', value: 1.0, tone: 'ok' },
        { label: 'warranty claim', value: 0.0, tone: 'error' },
      ],
      max: 1.0,
    },
    {
      at: 'say2',
      caption: 'Retraining improves warranty claim recall to 0.75.',
      bars: [
        { label: 'refund policy', value: 1.0, tone: 'ok' },
        { label: 'track my order', value: 0.8, tone: 'ok' },
        { label: 'store hours', value: 1.0, tone: 'ok' },
        { label: 'warranty claim', value: 0.75, tone: 'data' },
      ],
      max: 1.0,
    },
  ],
};

const sampleSequence: SequenceVisual = {
  template: 'sequence',
  title: 'Client Server RPC Call',
  actors: ['Client', 'Server'],
  steps: [
    {
      at: 'say1',
      caption: 'Client sends get_stock RPC request across the wire.',
      messages: [
        { from: 'Client', to: 'Server', label: 'get_stock("sku-42")', tone: 'data' },
      ],
      activeActor: 'Client',
    },
    {
      at: 'say2',
      caption: 'Server processes request and inspects local inventory.',
      messages: [
        { from: 'Client', to: 'Server', label: 'get_stock("sku-42")', tone: 'data' },
        { from: 'Server', to: 'Server', label: 'inventory lookup', tone: 'idle' },
      ],
      activeActor: 'Server',
    },
    {
      at: 'say3',
      caption: 'Server replies with result payload: stock is 7.',
      messages: [
        { from: 'Client', to: 'Server', label: 'get_stock("sku-42")', tone: 'data' },
        { from: 'Server', to: 'Server', label: 'inventory lookup', tone: 'idle' },
        { from: 'Server', to: 'Client', label: 'result: 7', tone: 'ok' },
      ],
      activeActor: 'Client',
    },
  ],
};

const sampleStates: StatesVisual = {
  template: 'states',
  title: 'Circuit Breaker Lifecycle',
  states: [
    { id: 'CLOSED', label: 'CLOSED' },
    { id: 'OPEN', label: 'OPEN' },
    { id: 'HALF_OPEN', label: 'HALF_OPEN' },
  ],
  steps: [
    {
      at: 'say1',
      caption: 'Circuit is CLOSED under normal operating conditions.',
      currentState: 'CLOSED',
      tone: 'ok',
    },
    {
      at: 'say2',
      caption: 'Consecutive failures exceed threshold: circuit trips OPEN.',
      currentState: 'OPEN',
      transition: {
        from: 'CLOSED',
        to: 'OPEN',
        label: 'failures >= 3',
      },
      tone: 'error',
    },
    {
      at: 'say3',
      caption: 'Reset timeout expires: circuit enters HALF_OPEN trial state.',
      currentState: 'HALF_OPEN',
      transition: {
        from: 'OPEN',
        to: 'HALF_OPEN',
        label: 'reset timeout',
      },
      tone: 'data',
    },
  ],
};

export default function VisualGalleryPage(): React.ReactElement {
  // Gated strictly: visible only when NEXT_PUBLIC_E2E_TEST_MODE === '1'; otherwise returns 404
  if (process.env.NEXT_PUBLIC_E2E_TEST_MODE !== '1') {
    notFound();
  }

  return (
    <div
      className="visual-gallery-root"
      data-testid="visual-gallery-root"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '24px 16px',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        color: 'var(--t1)',
        background: 'var(--bg0, transparent)',
      }}
    >
      <header style={{ marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--t1)' }}>
          Template Visual Gallery
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--t2)' }}>
          All templates rendered across every step for automated testing and inspection.
        </p>
      </header>

      {/* 1. Flow Template */}
      <section
        data-testid="gallery-section-flow"
        style={{ marginBottom: '40px' }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--t1)' }}>
          Flow Template: {sampleFlow.title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {sampleFlow.steps.map((step, idx) => (
            <div
              key={idx}
              data-testid={`gallery-step-flow-${idx}`}
              className="gallery-step-card"
              style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
                background: 'var(--bg1)',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t2)', marginBottom: '8px' }}>
                Step {idx + 1}: {step.caption}
              </div>
              <FlowTemplate
                nodes={sampleFlow.nodes}
                step={step}
                highlightedLabel={null}
                showSpaces={sampleFlow.showSpaces}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 2. Boxes Template */}
      <section
        data-testid="gallery-section-boxes"
        style={{ marginBottom: '40px' }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--t1)' }}>
          Boxes Template: {sampleBoxes.title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {sampleBoxes.steps.map((step, idx) => (
            <div
              key={idx}
              data-testid={`gallery-step-boxes-${idx}`}
              className="gallery-step-card"
              style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
                background: 'var(--bg1)',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t2)', marginBottom: '8px' }}>
                Step {idx + 1}: {step.caption}
              </div>
              <BoxesTemplate
                boxes={sampleBoxes.boxes}
                step={step}
                highlightedLabel={null}
                showSpaces={sampleBoxes.showSpaces}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Table Template */}
      <section
        data-testid="gallery-section-table"
        style={{ marginBottom: '40px' }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--t1)' }}>
          Table Template: {sampleTable.title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {sampleTable.steps.map((step, idx) => (
            <div
              key={idx}
              data-testid={`gallery-step-table-${idx}`}
              className="gallery-step-card"
              style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
                background: 'var(--bg1)',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t2)', marginBottom: '8px' }}>
                Step {idx + 1}: {step.caption}
              </div>
              <TableTemplate
                columns={sampleTable.columns}
                step={step}
                showSpaces={sampleTable.showSpaces}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Letters Template */}
      <section
        data-testid="gallery-section-letters"
        style={{ marginBottom: '40px' }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--t1)' }}>
          Letters Template: {sampleLetters.title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {sampleLetters.steps.map((step, idx) => (
            <div
              key={idx}
              data-testid={`gallery-step-letters-${idx}`}
              className="gallery-step-card"
              style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
                background: 'var(--bg1)',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t2)', marginBottom: '8px' }}>
                Step {idx + 1}: {step.caption}
              </div>
              <LettersTemplate
                text={sampleLetters.text}
                step={step}
                showSpaces={sampleLetters.showSpaces}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Compare Template */}
      <section
        data-testid="gallery-section-compare"
        style={{ marginBottom: '40px' }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--t1)' }}>
          Compare Template: {sampleCompare.title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {sampleCompare.steps.map((step, idx) => (
            <div
              key={idx}
              data-testid={`gallery-step-compare-${idx}`}
              className="gallery-step-card"
              style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
                background: 'var(--bg1)',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t2)', marginBottom: '8px' }}>
                Step {idx + 1}: {step.caption}
              </div>
              <CompareTemplate
                leftLabel={sampleCompare.leftLabel}
                rightLabel={sampleCompare.rightLabel}
                step={step}
                showSpaces={sampleCompare.showSpaces}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 6. Cells Template */}
      <section
        data-testid="gallery-section-cells"
        style={{ marginBottom: '40px' }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--t1)' }}>
          Cells Template: {sampleCells.title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {sampleCells.steps.map((step, idx) => (
            <div
              key={idx}
              data-testid={`gallery-step-cells-${idx}`}
              className="gallery-step-card"
              style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
                background: 'var(--bg1)',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t2)', marginBottom: '8px' }}>
                Step {idx + 1}: {step.caption}
              </div>
              <CellsTemplate
                step={step}
                showSpaces={sampleCells.showSpaces}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 7. StackQueue Template */}
      <section
        data-testid="gallery-section-stack-queue"
        style={{ marginBottom: '40px' }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--t1)' }}>
          Stack-Queue Template: {sampleStackQueue.title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {sampleStackQueue.steps.map((step, idx) => (
            <div
              key={idx}
              data-testid={`gallery-step-stack-queue-${idx}`}
              className="gallery-step-card"
              style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
                background: 'var(--bg1)',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t2)', marginBottom: '8px' }}>
                Step {idx + 1}: {step.caption}
              </div>
              <StackQueueTemplate
                step={step}
                mode={sampleStackQueue.mode}
                showSpaces={sampleStackQueue.showSpaces}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 8. TreeGraph Template */}
      <section
        data-testid="gallery-section-tree-graph"
        style={{ marginBottom: '40px' }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--t1)' }}>
          Tree-Graph Template: {sampleTreeGraph.title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {sampleTreeGraph.steps.map((step, idx) => (
            <div
              key={idx}
              data-testid={`gallery-step-tree-graph-${idx}`}
              className="gallery-step-card"
              style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
                background: 'var(--bg1)',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t2)', marginBottom: '8px' }}>
                Step {idx + 1}: {step.caption}
              </div>
              <TreeGraphTemplate
                nodes={sampleTreeGraph.nodes}
                edges={sampleTreeGraph.edges}
                step={step}
                showSpaces={sampleTreeGraph.showSpaces}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 9. Bars Template */}
      <section
        data-testid="gallery-section-bars"
        style={{ marginBottom: '40px' }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--t1)' }}>
          Bars Template: {sampleBars.title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {sampleBars.steps.map((step, idx) => (
            <div
              key={idx}
              data-testid={`gallery-step-bars-${idx}`}
              className="gallery-step-card"
              style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
                background: 'var(--bg1)',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t2)', marginBottom: '8px' }}>
                Step {idx + 1}: {step.caption}
              </div>
              <BarsTemplate
                step={step}
                showSpaces={sampleBars.showSpaces}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 10. Sequence Template */}
      <section
        data-testid="gallery-section-sequence"
        style={{ marginBottom: '40px' }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--t1)' }}>
          Sequence Template: {sampleSequence.title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {sampleSequence.steps.map((step, idx) => (
            <div
              key={idx}
              data-testid={`gallery-step-sequence-${idx}`}
              className="gallery-step-card"
              style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
                background: 'var(--bg1)',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t2)', marginBottom: '8px' }}>
                Step {idx + 1}: {step.caption}
              </div>
              <SequenceTemplate
                actors={sampleSequence.actors}
                step={step}
                showSpaces={sampleSequence.showSpaces}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 11. States Template */}
      <section
        data-testid="gallery-section-states"
        style={{ marginBottom: '40px' }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--t1)' }}>
          States Template: {sampleStates.title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {sampleStates.steps.map((step, idx) => (
            <div
              key={idx}
              data-testid={`gallery-step-states-${idx}`}
              className="gallery-step-card"
              style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
                background: 'var(--bg1)',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t2)', marginBottom: '8px' }}>
                Step {idx + 1}: {step.caption}
              </div>
              <StatesTemplate
                states={sampleStates.states}
                step={step}
                showSpaces={sampleStates.showSpaces}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
