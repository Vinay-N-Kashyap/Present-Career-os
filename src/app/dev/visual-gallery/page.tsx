import React from 'react';
import { notFound } from 'next/navigation';
import type {
  FlowVisual,
  BoxesVisual,
  TableVisual,
  LettersVisual,
  CompareVisual,
} from '@/lib/types/lessonVisual';
import { FlowTemplate } from '@/app/quests/lesson/components/visuals/FlowTemplate';
import { BoxesTemplate } from '@/app/quests/lesson/components/visuals/BoxesTemplate';
import { TableTemplate } from '@/app/quests/lesson/components/visuals/TableTemplate';
import { LettersTemplate } from '@/app/quests/lesson/components/visuals/LettersTemplate';
import { CompareTemplate } from '@/app/quests/lesson/components/visuals/CompareTemplate';

export const metadata = {
  title: 'Visual Template Gallery - PinIT Dev',
  robots: 'noindex, nofollow',
};

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
    </div>
  );
}
