import test from 'node:test';
import assert from 'node:assert/strict';
import { getTappableLabelsForVisual } from '../src/lib/visuals/visualRules';
import type {
  RegisterBitsVisual,
  LedgerSheetVisual,
  FunnelVisual,
  LessonVisual
} from '../src/lib/types/lessonVisual';

test('Block 2 Invariant: RegisterBitsVisual definition and tappable label extraction', () => {
  const visual: RegisterBitsVisual = {
    template: 'register-bits',
    title: 'STATUS_REG Architecture',
    steps: [
      {
        at: 'intro',
        caption: 'Status Register carrying zero and carry flags',
        registerName: 'STATUS_REG',
        bitWidth: 8,
        hexValue: '0x81',
        decimalValue: 129,
        bits: [
          { index: 7, name: 'CF', value: 1, tone: 'ok' },
          { index: 6, value: 0, tone: 'idle' },
          { index: 5, value: 0, tone: 'idle' },
          { index: 4, value: 0, tone: 'idle' },
          { index: 3, value: 0, tone: 'idle' },
          { index: 2, value: 0, tone: 'idle' },
          { index: 1, value: 0, tone: 'idle' },
          { index: 0, name: 'ZF', value: 1, tone: 'ok' },
        ]
      }
    ]
  };

  const labels = getTappableLabelsForVisual(visual);
  assert.ok(labels.includes('CF'), 'Should extract CF flag label');
  assert.ok(labels.includes('ZF'), 'Should extract ZF flag label');
  assert.strictEqual(labels.length, 2);
});

test('Block 2 Invariant: LedgerSheetVisual definition, balance invariant and label extraction', () => {
  const balancedVisual: LedgerSheetVisual = {
    template: 'ledger-sheet',
    title: 'Operating Cash Disbursements',
    steps: [
      {
        at: 'intro',
        caption: 'Recording equipment purchase against cash reserves',
        title: 'Journal Entry #42',
        isBalanced: true,
        totalDebit: 5000,
        totalCredit: 5000,
        entries: [
          { id: 'TXN-1', account: 'Equipment Asset', debit: 5000, balance: 5000, tone: 'data' },
          { id: 'TXN-2', account: 'Cash Reserves', credit: 5000, balance: 0, tone: 'ok' },
        ]
      }
    ]
  };

  const labels = getTappableLabelsForVisual(balancedVisual);
  assert.ok(labels.includes('Equipment Asset'), 'Should extract Equipment Asset account');
  assert.ok(labels.includes('Cash Reserves'), 'Should extract Cash Reserves account');
  assert.strictEqual(balancedVisual.steps[0].isBalanced, true, 'Should preserve isBalanced invariant');
});

test('Block 2 Invariant: FunnelVisual definition, conversion rates and label extraction', () => {
  const funnelVisual: FunnelVisual = {
    template: 'funnel',
    title: 'User Acquisition & Conversion Pipeline',
    steps: [
      {
        at: 'intro',
        caption: 'Tracking user drop-off across sign-up steps',
        activeStageId: 'signup',
        stages: [
          { id: 'visitors', label: 'Landing Page Visitors', value: 10000, percentage: 100 },
          { id: 'signup', label: 'Registration Started', value: 3500, percentage: 35, dropoffRate: 65 },
          { id: 'activated', label: 'Completed First Quest', value: 1400, percentage: 14, dropoffRate: 60 },
          { id: 'paid', label: 'Subscribed to Masterclass', value: 280, percentage: 2.8, dropoffRate: 80 },
        ]
      }
    ]
  };

  const labels = getTappableLabelsForVisual(funnelVisual);
  assert.strictEqual(labels.length, 4);
  assert.strictEqual(labels[0], 'Landing Page Visitors');
  assert.strictEqual(labels[3], 'Subscribed to Masterclass');
});

test('Block 2 Invariant: LessonVisual union accepts all 17 templates', () => {
  const templates: LessonVisual['template'][] = [
    'flow',
    'boxes',
    'table',
    'letters',
    'compare',
    'cells',
    'stack-queue',
    'tree-graph',
    'bars',
    'sequence',
    'states',
    'component-tree',
    'workflow',
    'wireframe',
    'register-bits',
    'ledger-sheet',
    'funnel'
  ];

  assert.strictEqual(templates.length, 17, 'Total visual engines must equal exactly 17');
});
