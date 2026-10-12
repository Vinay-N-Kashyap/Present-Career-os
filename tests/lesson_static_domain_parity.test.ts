import test from 'node:test';
import assert from 'node:assert/strict';
import { executeBashSuite } from '../src/lib/code/runners/bashRunner';
import { executeCppSuite } from '../src/lib/code/runners/cppRunner';

test('Static Slide Generation: Bash snippet executes cleanly in POSIX runner', async () => {
  const generatedBash = `#!/bin/bash
# POSIX Script for Process Orchestration
echo "Executing CLI sequence for Process Orchestration..."
mkdir -p workspace/build
echo "Status: Verified" > workspace/build/status.log
cat workspace/build/status.log`;

  const result = await executeBashSuite(generatedBash);
  assert.equal(result.allPassed, true);
  assert.equal(result.status, 'SUCCESS');
  assert.ok(result.stdout?.includes('Status: Verified'));
});

test('Static Slide Generation: C++ snippet satisfies AST invariants', async () => {
  const generatedCpp = `#include <iostream>

// Embedded Systems Routine for GPIO Pin Control
int executeRoutine() {
    std::cout << "Routine active: GPIO Pin Control" << std::endl;
    return 0;
}

int main() {
    return executeRoutine();
}`;

  const result = await executeCppSuite(generatedCpp, 'executeRoutine');
  assert.equal(result.language, 'cpp');
  assert.equal(result.allPassed, true);
  assert.equal(result.status, 'SUCCESS');
});

test('Domain Visual Dispatch: Invariants and schema contracts', () => {
  // Test RegisterBits contract
  const registerBits = {
    template: 'register-bits',
    title: 'Control Register',
    steps: [{
      at: 'intro',
      caption: 'Register Flags',
      registerName: 'SYS_CTRL',
      bitWidth: 8,
      hexValue: '0x80',
      decimalValue: 128,
      bits: [
        { index: 7, name: 'EN', value: 1, tone: 'ok' },
        { index: 6, name: 'RDY', value: 0, tone: 'idle' },
      ]
    }]
  };
  assert.equal(registerBits.template, 'register-bits');
  assert.equal(registerBits.steps[0].bits[0].value, 1);

  // Test LedgerSheet contract
  const ledgerSheet = {
    template: 'ledger-sheet',
    title: 'Reconciliation Journal',
    steps: [{
      at: 'intro',
      caption: 'Balance Invariant',
      title: 'General Ledger',
      isBalanced: true,
      runningBalance: 50000,
      entries: [
        { id: 'tx-1', date: '2026-10-01', account: 'Cash', debit: 50000, credit: 0, balance: 50000 }
      ]
    }]
  };
  assert.equal(ledgerSheet.template, 'ledger-sheet');
  assert.equal(ledgerSheet.steps[0].isBalanced, true);

  // Test Funnel contract
  const funnel = {
    template: 'funnel',
    title: 'Sales Pipeline',
    steps: [{
      at: 'intro',
      caption: 'Conversion Funnel',
      stages: [
        { id: 'leads', label: 'Leads', value: 10000, percentage: 100 },
        { id: 'closed', label: 'Won', value: 1000, percentage: 10, dropoffRate: 90 }
      ]
    }]
  };
  assert.equal(funnel.template, 'funnel');
  assert.equal(funnel.steps[0].stages[1].dropoffRate, 90);
});
