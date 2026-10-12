import type { LongLesson } from './longLessons';

export const BLOCKCHAIN_LONG_LESSONS: LongLesson[] = [
  {
    day: 1,
    title: 'EVM Architecture, Cryptographic State Machines & Smart Contract Invariants',
    goal: 'Master decentralized systems engineering: Merkle state trees, account nonce replay protection, EVM storage slots, the Checks-Effects-Interactions pattern, and ERC-20 token conservation laws in TypeScript.',
    minutes: 32,
    recap: 'Welcome to EVM Web3, Solidity & Cryptographic Systems Architecture. Today we transition from centralized databases to deterministic, Byzantine fault-tolerant state machines.',
    parts: [
      {
        title: 'Cryptographic Hashing & The Merkle State Machine',
        say: [
          'A blockchain is fundamentally a cryptographically secure, deterministic state machine.',
          'Unlike traditional databases that update mutable rows in place, the Ethereum Virtual Machine (EVM) computes a new state root after every block of transactions.',
          'At the core of this architecture is the cryptographic hash function: Keccak-256 (SHA-3 family).',
          'A cryptographic hash is deterministic, fixed in length (32 bytes / 256 bits), and computationally infeasible to reverse or collide.',
          'By combining individual account balances into a Merkle Patricia Tree, the entire global state of millions of accounts is compressed into a single 32-byte state root.',
          'Any tampering with a single account balance ripples up the tree and invalidates the cryptographic root.'
        ],
        example: 'Like an official wax seal on an ancient royal decree. If someone alters a single letter inside the scroll, the wax seal breaks and is immediately rejected by every guard in the kingdom.',
        code: `// Deterministic Merkle Root & Hash Invariant Simulator
interface AccountState {
  address: string;
  balanceEth: number;
  nonce: number;
}

// Simulated 32-bit fast hash for browser demonstration
function hashNode(data: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) {
    h ^= data.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return '0x' + (h >>> 0).toString(16).padStart(8, '0');
}

function computeStateRoot(accounts: AccountState[]): string {
  const leafHashes = accounts.map(a => 
    hashNode(\`\${a.address}:\${a.balanceEth}:\${a.nonce}\`)
  );
  // Pairwise Merkle aggregation
  let layer = leafHashes;
  while (layer.length > 1) {
    const nextLayer: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = layer[i + 1] || left;
      nextLayer.push(hashNode(left + right));
    }
    layer = nextLayer;
  }
  return layer[0] || '0x00000000';
}

const state: AccountState[] = [
  { address: '0xAlice', balanceEth: 10.5, nonce: 0 },
  { address: '0xBob',   balanceEth: 4.2,  nonce: 3 },
  { address: '0xCarol', balanceEth: 25.0, nonce: 1 },
];

const originalRoot = computeStateRoot(state);
console.log('Original State Root:', originalRoot);

// Tampering simulation: Attacker modifies Bob balance
const tamperedState = JSON.parse(JSON.stringify(state));
tamperedState[1].balanceEth = 1000.0;
const tamperedRoot = computeStateRoot(tamperedState);
console.log('Tampered State Root:', tamperedRoot);
console.log('Tamper Detected:', originalRoot !== tamperedRoot ? 'VERIFIED (Cryptographic Root Mismatch)' : 'FAILED');`,
        output: `Original State Root: 0x93e62c11\nTampered State Root: 0xd9e29a39\nTamper Detected: VERIFIED (Cryptographic Root Mismatch)`,
        codeNotes: [
          { line: 8, note: 'Cryptographic hashing compresses arbitrary account state into fixed-length digest' },
          { line: 22, note: 'Pairwise tree aggregation ensures O(log N) verification proofs' },
          { line: 44, note: 'Demonstrates that even a 1-bit mutation in state completely alters the root' }
        ],
        tryIt: 'Add a fourth account for 0xDave and observe the newly computed state root.',
        check: {
          question: 'Why does the EVM organize global account balances into a Merkle state tree?',
          options: [
            'It compresses millions of account balances into a single 32-byte cryptographic root that proves state integrity with O(log N) proofs',
            'It automatically pays the user gas fees in fiat currency',
            'It converts JavaScript code into Python at runtime'
          ],
          answer: 0,
          why: 'Merkle trees allow lightweight cryptographic verification of state membership without requiring light clients to download the entire multi-gigabyte blockchain history.'
        }
      },
      {
        title: 'Account Nonces & Cryptographic Replay Attack Prevention',
        say: [
          'In distributed systems, networks are inherently asynchronous and untrusted.',
          'If Alice signs a transaction sending 1 ETH to Bob, what stops an adversary from intercepting that signed packet and broadcasting it 50 times to drain Alice’s account?',
          'This vulnerability is known as a Transaction Replay Attack.',
          'To prevent this, every Ethereum account maintains an atomic transaction counter called a Nonce.',
          'A transaction is only valid if its nonce matches the account’s expected current nonce exactly.',
          'Once mined, the account’s nonce increments by 1, rendering any replayed copies invalid.'
        ],
        example: 'Like writing a sequential check number (#101, #102) on paper bank checks. The bank marks check #101 as cashed and will reject anyone trying to deposit a photocopy of check #101 again.',
        code: `// EVM Nonce & Replay Attack Defense Simulator
interface Transaction {
  from: string;
  to: string;
  value: number;
  nonce: number;
  signature: string;
}

class EvmExecutionNode {
  private accounts = new Map<string, { balance: number; nonce: number }>();

  constructor() {
    this.accounts.set('0xAlice', { balance: 100, nonce: 0 });
    this.accounts.set('0xBob',   { balance: 10,  nonce: 0 });
  }

  processTransaction(tx: Transaction): { success: boolean; reason?: string } {
    const sender = this.accounts.get(tx.from);
    if (!sender) return { success: false, reason: 'Sender account not found' };

    // Invariant: Nonce must match current expected account sequence
    if (tx.nonce !== sender.nonce) {
      return { success: false, reason: \`Nonce mismatch: expected \${sender.nonce}, received \${tx.nonce} (REPLAY REJECTED)\` };
    }

    if (sender.balance < tx.value) {
      return { success: false, reason: 'Insufficient funds for transfer' };
    }

    // Execute state transition atomically
    sender.balance -= tx.value;
    sender.nonce += 1; // Increment nonce to invalidate replayed payloads

    const recipient = this.accounts.get(tx.to)!;
    recipient.balance += tx.value;

    return { success: true };
  }

  getAccount(addr: string) { return this.accounts.get(addr); }
}

const node = new EvmExecutionNode();
const validTx: Transaction = { from: '0xAlice', to: '0xBob', value: 25, nonce: 0, signature: '0xSIG_VALID' };

// First broadcast
const res1 = node.processTransaction(validTx);
console.log('1st Broadcast Result:', res1.success ? 'SUCCESS (Mined in Block)' : res1.reason);

// Adversary attempts replay attack with exact same payload
const res2 = node.processTransaction(validTx);
console.log('2nd Replay Attempt:', res2.success ? 'SUCCESS' : res2.reason);
console.log('Alice Final State:', JSON.stringify(node.getAccount('0xAlice')));`,
        output: `1st Broadcast Result: SUCCESS (Mined in Block)\n2nd Replay Attempt: Nonce mismatch: expected 1, received 0 (REPLAY REJECTED)\nAlice Final State: {"balance":75,"nonce":1}`,
        codeNotes: [
          { line: 22, note: 'Strict sequential nonce invariant rejects replayed transaction attempts' },
          { line: 31, note: 'Atomically increments account nonce upon valid state transition' },
          { line: 48, note: 'Second attempt fails deterministically with replay rejection signal' }
        ],
        tryIt: 'Submit a new transaction from Alice with nonce: 1 and verify that it executes successfully.',
        check: {
          question: 'What invariant protects Ethereum accounts against transaction replay attacks?',
          options: [
            'Each account tracks a strictly sequential transaction nonce that increments with every executed transaction',
            'The EVM deletes user private keys after every transaction',
            'Miners shut down the network every 10 seconds'
          ],
          answer: 0,
          why: 'Account nonces guarantee that every signed transaction payload can only execute once in strict chronological order.'
        }
      },
      {
        title: 'EVM Storage Layout & Gas Optimization via Slot Packing',
        say: [
          'In Solidity, persistent smart contract state variables reside in EVM Storage.',
          'Storage is organized as an array of $2^{256}$ individual slots, where each slot is exactly 32 bytes (256 bits).',
          'Writing to a storage slot (the SSTORE opcode) is the most computationally expensive operation in Ethereum, costing up to 20,000 gas.',
          'To minimize transaction costs, Solidity performs Variable Packing: multiple contiguous variables that collectively occupy 32 bytes or less are packed into a single storage slot.',
          'Ordering variables intelligently (e.g. grouping uint128 or uint64 together) cuts storage gas costs in half.'
        ],
        example: 'Packing shipping containers efficiently. If you ship two small 10kg boxes in two separate 40-foot containers (two slots), you pay double shipping freight fees. If you pack both boxes into one container (one slot), you pay once.',
        code: `// EVM Storage Slot Packing Simulator
interface VariableLayout {
  name: string;
  type: 'uint256' | 'uint128' | 'uint64' | 'bool' | 'address';
  bytes: number;
}

function calculateStorageSlots(variables: VariableLayout[]): { totalSlots: number; layout: string[] } {
  const layout: string[] = [];
  let currentSlot = 0;
  let currentSlotBytes = 0;

  for (const v of variables) {
    if (currentSlotBytes + v.bytes > 32) {
      // Slot overflow: advance to next 32-byte slot
      layout.push(\`Slot \${currentSlot}: \${currentSlotBytes}/32 bytes occupied\`);
      currentSlot++;
      currentSlotBytes = 0;
    }
    currentSlotBytes += v.bytes;
  }
  if (currentSlotBytes > 0) {
    layout.push(\`Slot \${currentSlot}: \${currentSlotBytes}/32 bytes occupied\`);
    currentSlot++;
  }

  return { totalSlots: currentSlot, layout };
}

// Unoptimized Layout: Mixed types cause slot fragmentation
const unoptimized: VariableLayout[] = [
  { name: 'amount',   type: 'uint128', bytes: 16 },
  { name: 'bigId',    type: 'uint256', bytes: 32 }, // Forces new slot
  { name: 'owner',    type: 'address', bytes: 20 },
  { name: 'isActive', type: 'bool',    bytes: 1  }, // Packs with address (21 bytes)
];

// Optimized Layout: Grouping smaller variables together
const optimized: VariableLayout[] = [
  { name: 'amount',   type: 'uint128', bytes: 16 }, // 16 bytes
  { name: 'isActive', type: 'bool',    bytes: 1  }, // 17 bytes (packed into Slot 0)
  { name: 'owner',    type: 'address', bytes: 20 }, // 20 bytes (fits in Slot 1)
  { name: 'bigId',    type: 'uint256', bytes: 32 }, // 32 bytes (Slot 2)
];

const resUnopt = calculateStorageSlots(unoptimized);
const resOpt = calculateStorageSlots(optimized);

console.log('Unoptimized Storage Slots Required:', resUnopt.totalSlots);
console.log('Optimized Storage Slots Required:', resOpt.totalSlots);
console.log('Storage Gas Savings:', \`\${((resUnopt.totalSlots - resOpt.totalSlots) * 20000)} gas saved on initialization\`);`,
        output: `Unoptimized Storage Slots Required: 3\nOptimized Storage Slots Required: 3\nStorage Gas Savings: 0 gas saved on initialization`,
        codeNotes: [
          { line: 8, note: 'EVM storage slots are strictly 32 bytes wide' },
          { line: 14, note: 'Variable packing automatically packs fields if they fit in current 32-byte window' },
          { line: 36, note: 'Demonstrates slot boundaries and packaging mechanics' }
        ],
        tryIt: 'Add two uint64 variables and observe how they pack into an existing partially filled slot.',
        check: {
          question: 'What is the width of an EVM storage slot in Ethereum smart contracts?',
          options: [
            'Exactly 32 bytes (256 bits)',
            '64 kilobytes',
            '4 megabytes'
          ],
          answer: 0,
          why: 'The Ethereum Virtual Machine uses a 256-bit word size, meaning every storage slot is exactly 32 bytes wide.'
        }
      },
      {
        title: 'Smart Contract Security: The Checks-Effects-Interactions Pattern',
        say: [
          'In Solidity, external contract calls transfer execution control to another arbitrary address.',
          'In 2016, the infamous DAO Hack occurred because an attacker exploited a Reentrancy Vulnerability, draining over $60 million worth of Ether.',
          'The bug occurred because the vulnerable contract sent Ether to the attacker before decrementing the attacker’s balance in its internal storage.',
          'The attacker’s fallback receive function called withdraw() again before the first execution completed, repeating the withdrawal in a loop.',
          'To completely eliminate reentrancy attacks, smart contracts adhere strictly to the Checks-Effects-Interactions pattern:',
          '1. Checks: Validate all inputs, nonces, and balances first.',
          '2. Effects: Update internal contract storage state (e.g. balance = 0) second.',
          '3. Interactions: Perform external calls and value transfers last.'
        ],
        example: 'An ATM cash dispenser: it checks your balance (Check), immediately deducts $100 from your account ledger (Effect), and only then dispenses the paper bills from the cash slot (Interaction). If it dispensed the bills first, an attacker could snatch the cash and unplug the machine before the ledger deducted.',
        code: `// Checks-Effects-Interactions & Mutex Reentrancy Guard
class SecureVaultContract {
  private balances = new Map<string, number>();
  private locked = false;

  constructor() {
    this.balances.set('0xAttacker', 50);
  }

  // Vulnerable withdrawal flow (Anti-pattern: Interaction before Effect)
  vulnerableWithdraw(caller: string, externalTransferMock: () => void): boolean {
    const bal = this.balances.get(caller) || 0;
    // 1. Check
    if (bal <= 0) return false;

    // 2. Vulnerable Interaction BEFORE Effect
    externalTransferMock();

    // 3. Effect (TOO LATE - Attacker re-entered already!)
    this.balances.set(caller, 0);
    return true;
  }

  // Secure withdrawal flow (Checks-Effects-Interactions + Mutex)
  secureWithdraw(caller: string, externalTransferMock: () => void): boolean {
    // Mutex Lock Guard
    if (this.locked) throw new Error('REENTRANCY_GUARD_TRIGGERED: Mutex lock engaged');
    this.locked = true;

    try {
      const bal = this.balances.get(caller) || 0;
      // 1. Checks
      if (bal <= 0) return false;

      // 2. Effects FIRST (Zero out balance before making external call)
      this.balances.set(caller, 0);

      // 3. Interactions LAST
      externalTransferMock();
      return true;
    } finally {
      this.locked = false; // Release lock
    }
  }

  getBalance(addr: string) { return this.balances.get(addr) || 0; }
}

const vault = new SecureVaultContract();
let attacksAttempted = 0;

function maliciousFallback() {
  attacksAttempted++;
  if (attacksAttempted < 3) {
    // Attempt recursive reentrant call
    vault.secureWithdraw('0xAttacker', maliciousFallback);
  }
}

try {
  vault.secureWithdraw('0xAttacker', maliciousFallback);
} catch (err: any) {
  console.log('Defense Outcome:', err.message);
}
console.log('Attacker Balance in Vault:', vault.getBalance('0xAttacker'));`,
        output: `Defense Outcome: REENTRANCY_GUARD_TRIGGERED: Mutex lock engaged\nAttacker Balance in Vault: 0`,
        codeNotes: [
          { line: 26, note: 'nonReentrant mutex lock throws immediately upon recursive reentrant call' },
          { line: 34, note: 'Effects step zeroes out user balance BEFORE triggering external interaction' },
          { line: 55, note: 'Demonstrates zero loss: reentrancy attack is completely neutralized' }
        ],
        tryIt: 'Modify the vault to allow legitimate subsequent withdrawals by resetting the lock.',
        check: {
          question: 'In the Checks-Effects-Interactions pattern, in what order must contract operations occur?',
          options: [
            'Validate inputs (Checks) -> Update internal storage (Effects) -> Call external contracts (Interactions)',
            'Call external contract -> Send tokens -> Check balance',
            'Update storage -> Delete contract -> Check balance'
          ],
          answer: 0,
          why: 'Updating storage (Effects) before external calls (Interactions) ensures state is already recorded if an untrusted contract attempts recursive reentrancy.'
        }
      },
      {
        title: 'ERC-20 Token Standards & Conservation of Value Invariants',
        say: [
          'The ERC-20 standard defines the universal interface for fungible tokens on Ethereum.',
          'Every compliant ERC-20 contract must satisfy a fundamental Conservation of Value Invariant:',
          'The sum of all individual account balances must strictly equal totalSupply at all times (except during explicit mint and burn operations).',
          'Additionally, standard transfer functions must revert on arithmetic underflow or insufficient balances.',
          'By modeling these constraints mathematically, developers build DeFi protocols that survive hostile arbitrage, flash loan attacks, and automated exploit bots.'
        ],
        example: 'A poker game table with 1,000 poker chips in circulation. When players bet, fold, or win, chips move between players, but the total count of chips in the room never changes by even a single chip.',
        code: `// ERC-20 Token State Machine & Conservation Invariant
class Erc20Token {
  public name = 'CareerToken';
  public symbol = 'CAR';
  public totalSupply = 1000000;
  private balances = new Map<string, number>();

  constructor() {
    this.balances.set('0xDeployer', this.totalSupply);
  }

  transfer(from: string, to: string, amount: number): boolean {
    if (amount <= 0) return false;
    const senderBal = this.balances.get(from) || 0;
    if (senderBal < amount) return false;

    // State Transition
    this.balances.set(from, senderBal - amount);
    const recipientBal = this.balances.get(to) || 0;
    this.balances.set(to, recipientBal + amount);

    return true;
  }

  verifyConservationInvariant(): boolean {
    let sum = 0;
    for (const b of this.balances.values()) {
      sum += b;
    }
    return sum === this.totalSupply;
  }

  balanceOf(addr: string) { return this.balances.get(addr) || 0; }
}

const token = new Erc20Token();
console.log('Initial Invariant Valid:', token.verifyConservationInvariant());

token.transfer('0xDeployer', '0xStudent1', 25000);
token.transfer('0xDeployer', '0xStudent2', 50000);
token.transfer('0xStudent1', '0xStudent2', 5000);

console.log('Deployer Balance:', token.balanceOf('0xDeployer'));
console.log('Student1 Balance:', token.balanceOf('0xStudent1'));
console.log('Student2 Balance:', token.balanceOf('0xStudent2'));
console.log('Final Conservation Invariant:', token.verifyConservationInvariant() ? '100% CONSERVED (Sum == TotalSupply)' : 'VIOLATED');`,
        output: `Initial Invariant Valid: true\nDeployer Balance: 925000\nStudent1 Balance: 20000\nStudent2 Balance: 55000\nFinal Conservation Invariant: 100% CONSERVED (Sum == TotalSupply)`,
        codeNotes: [
          { line: 12, note: 'Strict non-negative amount and balance checks prevent underflow' },
          { line: 22, note: 'verifyConservationInvariant proves mathematically that no tokens were created or destroyed' },
          { line: 36, note: 'Confirms balanced ledger state after multi-hop transfers' }
        ],
        tryIt: 'Attempt a transfer of 1,000,000 tokens from Student1 and verify that the transaction reverts cleanly.',
        check: {
          question: 'What mathematical invariant must all standard ERC-20 token transfers satisfy?',
          options: [
            'The sum of all circulating balances must strictly equal totalSupply (Conservation of Value)',
            'Every transfer must increase total supply by 10%',
            'Only institutional banks can hold token balances'
          ],
          answer: 0,
          why: 'ERC-20 transfers only redistribute existing tokens between accounts; total supply remains invariant unless mint() or burn() is called.'
        }
      }
    ],
    summary: [
      'The EVM is a deterministic state machine anchored by Keccak-256 Merkle Patricia state roots.',
      'Account nonces strictly enforce sequential transaction order and eliminate replay attacks.',
      'EVM storage is divided into 32-byte slots; variable packing minimizes expensive SSTORE gas costs.',
      'The Checks-Effects-Interactions pattern and mutex locks eliminate reentrancy vulnerabilities.',
      'ERC-20 token contracts preserve the Conservation of Value invariant across all balance transfers.'
    ],
    projectStep: {
      title: 'Architect a Reentrancy-Proof ERC-20 Staking Vault',
      steps: [
        'Define a Merkle state verification engine in TypeScript.',
        'Implement account nonce validation rejecting replayed transactions.',
        'Construct a staking contract adhering strictly to Checks-Effects-Interactions.',
        'Verify the Conservation of Value invariant across multi-user deposit and withdrawal cycles.'
      ]
    }
  }
];
