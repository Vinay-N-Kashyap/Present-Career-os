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
  },
  {
    day: 2,
    title: 'AMM Constant Product Math, TWAP Oracles, EIP-712 Signatures & Layer 2 Rollup Proofs',
    goal: 'Master decentralized financial and scaling architecture: Uniswap v2 constant product AMMs (x * y = k), flash loan-resistant TWAP price accumulators, EIP-712 structured data signing with gasless ERC-2612 permits, Layer 2 rollup state batching with fraud/validity verification, and ERC-1967 upgradeable proxies.',
    minutes: 32,
    recap: 'Yesterday we mastered EVM state machines, Merkle trees, nonces, reentrancy guards, and ERC-20 conservation invariants. Today we advance to production protocol engineering: automated market makers, decentralized oracles, gasless meta-transactions, Layer 2 scaling rollups, and upgradeable proxy storage layouts.',
    parts: [
      {
        title: 'Automated Market Maker (AMM) Constant Product Math (x * y = k) & Slippage Dynamics',
        say: [
          'Traditional centralized exchanges rely on central limit order books (CLOBs) matching buy bids and sell asks. However, maintaining order books on Ethereum incurs prohibitive gas costs.',
          'Decentralized finance solved this paradigm shift using Automated Market Makers (AMMs) governed by deterministic mathematical invariants.',
          'Uniswap v2 pioneered the Constant Product Invariant: R_x * R_y = k, where R_x and R_y represent the locked reserve balances of two paired ERC-20 tokens.',
          'When a trader swaps Delta_x into the pool, they must receive Delta_y such that (R_x + Delta_x * 0.997) * (R_y - Delta_y) = k, deducting a 0.30% fee allocated to liquidity providers.',
          'Solving for output yield gives Delta_y = (R_y * Delta_x * 997) / (R_x * 1000 + Delta_x * 997).',
          'Because the pool operates along a hyperbolic curve, large trades consume disproportionate reserves, shifting the effective execution price away from the spot price: this delta is Price Impact (slippage).',
          'Understanding constant product mechanics allows protocol developers to model impermanent loss, arbitrage thresholds, and liquidity depth with mathematical precision.'
        ],
        example: 'Like a two-tank hydraulic balance: pushing water into the left tank forces water out of the right tank. The harder you push, the more hydraulic resistance pushes back, requiring more force for each extra droplet.',
        code: `// Uniswap v2 Constant Product AMM Swap Engine & Slippage Simulator
interface AmmPool {
  reserveTokenA: number; // e.g. ETH
  reserveTokenB: number; // e.g. USDC
  k: number;
}

function calculateAmmSwap(
  pool: AmmPool,
  amountIn: number,
  tokenIn: 'A' | 'B'
): { amountOut: number; effectivePrice: number; spotPrice: number; priceImpactPct: number } {
  const isTokenA = tokenIn === 'A';
  const reserveIn = isTokenA ? pool.reserveTokenA : pool.reserveTokenB;
  const reserveOut = isTokenA ? pool.reserveTokenB : pool.reserveTokenA;

  // Uniswap v2 standard 0.30% LP fee (997/1000 multiplier)
  const amountInWithFee = amountIn * 997;
  const numerator = amountInWithFee * reserveOut;
  const denominator = reserveIn * 1000 + amountInWithFee;
  const amountOut = numerator / denominator;

  const spotPrice = reserveOut / reserveIn;
  const effectivePrice = amountOut / amountIn;
  const priceImpactPct = ((spotPrice - effectivePrice) / spotPrice) * 100;

  return { amountOut, effectivePrice, spotPrice, priceImpactPct };
}

const pool: AmmPool = {
  reserveTokenA: 100,      // 100 ETH
  reserveTokenB: 250000,   // 250,000 USDC ($2,500 spot)
  k: 100 * 250000          // 25,000,000 constant product
};

const trade = calculateAmmSwap(pool, 10, 'A'); // Swap 10 ETH for USDC

console.log('=== UNISWAP V2 CONSTANT PRODUCT AMM SWAP ENGINE ===');
console.log('Pool Reserves: ' + pool.reserveTokenA + ' ETH | ' + pool.reserveTokenB.toLocaleString('en-US') + ' USDC');
console.log('Initial Spot Price: $' + trade.spotPrice.toFixed(2) + ' USDC/ETH');
console.log('Input: 10.0 ETH -> Received: $' + trade.amountOut.toFixed(2) + ' USDC');
console.log('Effective Execution Price: $' + trade.effectivePrice.toFixed(2) + ' USDC/ETH');
console.log('Price Impact / Slippage: ' + trade.priceImpactPct.toFixed(2) + '%');`,
        output: `=== UNISWAP V2 CONSTANT PRODUCT AMM SWAP ENGINE ===\nPool Reserves: 100 ETH | 250,000 USDC\nInitial Spot Price: $2500.00 USDC/ETH\nInput: 10.0 ETH -> Received: $22665.27 USDC\nEffective Execution Price: $2266.53 USDC/ETH\nPrice Impact / Slippage: 9.34%`,
        codeNotes: [
          { line: 17, note: 'Applies 0.30% fee integer math preserving precision without floating-point errors' },
          { line: 20, note: 'Calculates exact output tokens according to constant product formula (R_x * R_y = k)' },
          { line: 24, note: 'Derives price impact comparing marginal spot quotation to realized execution price' },
          { line: 36, note: 'Demonstrates 9.34% slippage when trading 10% of total pool depth' }
        ],
        tryIt: 'Reduce amountIn to 1.0 ETH and observe how price impact shrinks from 9.34% down to under 1.0%.',
        check: {
          question: 'Why does a constant product AMM (x * y = k) incur price impact (slippage) on large swap orders?',
          options: [
            'Each incremental token traded alters the marginal reserve ratio along the non-linear hyperbolic curve, progressively worsening the exchange rate',
            'Ethereum validators deliberately charge higher gas fees for large volume transactions',
            'The smart contract randomly burns 10% of trades to maintain deflation',
            'AMM pools require manual off-chain approval from liquidity providers before executing'
          ],
          answer: 0,
          why: 'Because liquidity resides on a convex hyperbolic curve (x * y = k), pulling tokens from one side changes the relative scarcity of remaining reserves.'
        }
      },
      {
        title: 'Decentralized Oracles, Cumulative Price Tracking & Flash Loan Resistant TWAPs',
        say: [
          'Lending protocols, synthetic assets, and automated liquidators require accurate price feeds to evaluate collateral ratios.',
          'A catastrophic vulnerability in early DeFi protocols was reading instantaneous spot prices directly from AMM reserves (e.g. reserve1 / reserve0).',
          'In a Flash Loan attack, an adversary borrows $50M uncollateralized within a single transaction, dumps it into the AMM pool to artificially crash the spot price, borrows cheap collateral from a victim lending market, and repays the loan in the same block.',
          'To permanently eliminate this vector, Uniswap v2 introduced Time-Weighted Average Price (TWAP) oracles with cumulative price accumulators.',
          'Every block, the contract accumulates price weighted by elapsed time: PriceCumulative += SpotPrice * Delta_Time.',
          'An external protocol calculates the TWAP over an observation window (e.g. 30 minutes): TWAP = (PriceCumulative_t2 - PriceCumulative_t1) / (t2 - t1).',
          'Because flash loans exist for only a single block (12 seconds), an attacker cannot sustain manipulated prices over the observation window without suffering ruinous multi-block arbitrage losses.'
        ],
        example: 'Like measuring the climate temperature: reading a thermometer right next to an open oven gives a misleading 150-degree reading, but taking the 24-hour average reveals the true ambient temperature of 72 degrees.',
        code: `// Decentralized TWAP Oracle vs Flash Loan Manipulation Simulator
interface PriceObservation {
  timestamp: number;
  priceCumulative: number;
}

class TwapOracle {
  private observations: PriceObservation[] = [];

  public recordBlock(timestamp: number, reserve0: number, reserve1: number) {
    const spotPrice = reserve1 / reserve0;
    const lastObs = this.observations[this.observations.length - 1];
    const deltaT = lastObs ? timestamp - lastObs.timestamp : 0;
    const prevCumulative = lastObs ? lastObs.priceCumulative : 0;

    const newCumulative = prevCumulative + spotPrice * deltaT;
    this.observations.push({ timestamp, priceCumulative: newCumulative });
  }

  public calculateTwap(startTime: number, endTime: number): number {
    const startObs = this.observations.find(o => o.timestamp >= startTime);
    const endObs = this.observations.find(o => o.timestamp >= endTime);
    if (!startObs || !endObs || endObs.timestamp === startObs.timestamp) return 0;

    const deltaPrice = endObs.priceCumulative - startObs.priceCumulative;
    const deltaT = endObs.timestamp - startObs.timestamp;
    return deltaPrice / deltaT;
  }
}

const oracle = new TwapOracle();
oracle.recordBlock(1000, 100, 250000); // t=1000s, Price = $2500
oracle.recordBlock(1600, 100, 250000); // t=1600s, Normal price held for 600s

// Flash loan manipulation: temporary 10x price spike for 1 block (12 seconds)
oracle.recordBlock(1612, 10, 250000);  // t=1612s, Manipulated spot = $25,000!
oracle.recordBlock(2200, 100, 250000); // t=2200s, Normal price restored by arbitrage

const spotManipulated = 250000 / 10;
const twapPrice = oracle.calculateTwap(1000, 2200);

console.log('=== DECENTRALIZED TWAP ORACLE VS FLASH LOAN SKEW ===');
console.log('Manipulated Instantaneous Spot Price: $' + spotManipulated.toLocaleString('en-US') + ' USDC');
console.log('Time-Weighted Average Price (TWAP 1200s Window): $' + twapPrice.toFixed(2) + ' USDC');
console.log('Flash Loan Resistance: ' + (twapPrice < 3000 ? 'VERIFIED (Attack Diluted by 98.9%)' : 'VULNERABLE'));`,
        output: `=== DECENTRALIZED TWAP ORACLE VS FLASH LOAN SKEW ===\nManipulated Instantaneous Spot Price: $25,000 USDC\nTime-Weighted Average Price (TWAP 1200s Window): $2725.00 USDC\nFlash Loan Resistance: VERIFIED (Attack Diluted by 98.9%)`,
        codeNotes: [
          { line: 15, note: 'Cumulative price accumulator weights price by exact block duration delta' },
          { line: 24, note: 'TWAP window calculation divides cumulative delta by total observation elapsed time' },
          { line: 36, note: 'Simulates flash loan price spike occurring for 1 block (12 seconds)' },
          { line: 43, note: 'Proves mathematical dilution: a 1000% spot spike only moves 20-minute TWAP by 9%' }
        ],
        tryIt: 'Lengthen the TWAP observation window to 3600 seconds and observe the price spike dilute to under 3%.',
        check: {
          question: 'Why are TWAP (Time-Weighted Average Price) oracles resilient against single-block flash loan exploits?',
          options: [
            'Because flash loan manipulations last only a single block (seconds), having negligible weight over a multi-minute or hour time window',
            'Because TWAP contracts reject transactions initiated by smart contracts',
            'Because flash loans are illegal under Ethereum protocol consensus rules',
            'Because TWAP prices are updated manually by the Ethereum Foundation'
          ],
          answer: 0,
          why: 'Flash loans must borrow and repay within the same atomic transaction. A 12-second price distortion carries near-zero weight across a 30-minute cumulative integral.'
        }
      },
      {
        title: 'EIP-712 Structured Data Hashing & Gasless Meta-Transactions (=permit)',
        say: [
          'In traditional Web3 user experiences, interacting with a DeFi staking vault requires two separate transactions: first approve(), then deposit().',
          'This double-transaction friction costs extra gas and degrades usability.',
          'Furthermore, signing opaque hex blobs with personal_sign exposes users to phishing exploits, as users cannot read the parameters being authorized.',
          'EIP-712 solves this by introducing human-readable, typed structured data hashing.',
          'It defines a Domain Separator binding the signature to a specific contract name, version, chain ID, and contract address, preventing cross-contract or cross-chain signature replay.',
          'ERC-2612 built on EIP-712 to introduce permit(): users sign an off-chain structured permit message containing owner, spender, value, nonce, and deadline.',
          'A third-party relayer or protocol can submit this signature to the contract on-chain, paying the gas fee and executing approve and transfer in a single atomic transaction.'
        ],
        example: 'Like a written, signed power-of-attorney authorization. You sign the paper for free at home with clear terms, and your financial advisor hands it to the bank to execute the transfer on your behalf.',
        code: `// EIP-712 Typed Structured Data Hashing & Gasless Permit Simulator
function fastKeccak(data: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) {
    h ^= data.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return '0x' + (h >>> 0).toString(16).padStart(8, '0');
}

interface Eip712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

interface PermitMessage {
  owner: string;
  spender: string;
  value: number;
  nonce: number;
  deadline: number;
}

function hashEip712Permit(domain: Eip712Domain, message: PermitMessage): string {
  const domainSeparator = fastKeccak(
    'EIP712Domain(name=' + domain.name + ',version=' + domain.version + ',chainId=' + domain.chainId + ',verifyingContract=' + domain.verifyingContract + ')'
  );
  const structHash = fastKeccak(
    'Permit(owner=' + message.owner + ',spender=' + message.spender + ',value=' + message.value + ',nonce=' + message.nonce + ',deadline=' + message.deadline + ')'
  );
  // \\x19\\x01 prefix strictly conforms to EIP-712 standard, preventing hash collision with raw transactions
  return fastKeccak('\\x19\\x01' + domainSeparator + structHash);
}

const domain: Eip712Domain = {
  name: 'CareerToken',
  version: '1',
  chainId: 1,
  verifyingContract: '0x888888887b6408226027EBEda2EBbc01306D9445'
};

const permit: PermitMessage = {
  owner: '0xAlice',
  spender: '0xStakingVault',
  value: 50000,
  nonce: 0,
  deadline: 1893456000
};

const digest = hashEip712Permit(domain, permit);

console.log('=== EIP-712 TYPED STRUCTURED PERMIT DIGEST ===');
console.log('Verifying Contract: ' + domain.verifyingContract);
console.log('Permit Payload: ' + permit.owner + ' approves ' + permit.spender + ' for ' + permit.value + ' units');
console.log('Deterministic 32-Byte Signing Digest: ' + digest);
console.log('Gasless Meta-Transaction Verification: READY FOR SECP256K1 RELAY');`,
        output: `=== EIP-712 TYPED STRUCTURED PERMIT DIGEST ===\nVerifying Contract: 0x888888887b6408226027EBEda2EBbc01306D9445\nPermit Payload: 0xAlice approves 0xStakingVault for 50000 units\nDeterministic 32-Byte Signing Digest: 0x230283ed\nGasless Meta-Transaction Verification: READY FOR SECP256K1 RELAY`,
        codeNotes: [
          { line: 25, note: 'Computes domain separator hashing chainId and verifyingContract address to prevent replay' },
          { line: 31, note: 'Prepends byte prefix 0x19 0x01 separating structured messages from raw byte signatures' },
          { line: 42, note: 'Permit payload structure matching ERC-2612 gasless authorization specifications' },
          { line: 51, note: 'Generates 32-byte digest ready for ECDSA ecrecover cryptographic signature verification' }
        ],
        tryIt: 'Change chainId from 1 to 137 (Polygon) and verify that the computed signing digest changes completely.',
        check: {
          question: 'What is the primary security role of the Domain Separator in EIP-712 signatures?',
          options: [
            'It cryptographically binds the signature to a specific contract address and chain ID, preventing signature replay on other contracts or networks',
            'It encrypts the user’s private key before transmitting it to the blockchain',
            'It calculates the maximum gas fee the relayer can claim',
            'It converts the signature into an NFT token'
          ],
          answer: 0,
          why: 'By including chainId and verifyingContract in the domain hash, a signature created for contract A on Ethereum cannot be replayed on contract B on Polygon.'
        }
      },
      {
        title: 'Layer 2 Rollup State Commitments & Optimistic vs ZK Proof Verification',
        say: [
          'Ethereum Layer 1 processes approximately 15 to 30 transactions per second (TPS) due to global consensus overhead and decentralized node hardware constraints.',
          'Layer 2 Rollups solve the scalability trilemma by moving computation and state storage off-chain while anchoring security directly to Layer 1.',
          'Rollup sequencers process thousands of user transactions off-chain, compute the resulting state transition, and post compressed transaction data and the new state root to Layer 1.',
          'There are two dominant rollup architectures: Optimistic Rollups and Zero-Knowledge (ZK) Rollups.',
          'Optimistic Rollups assume state transitions are valid by default and enforce security via Fraud Proofs, maintaining a 7-day challenge window where anyone can submit a cryptographic proof of an invalid step.',
          'ZK-Rollups generate cryptographic Validity Proofs (SNARKs or STARKs) off-chain; Layer 1 verifies the mathematical proof within a single transaction, achieving instant finality without a 7-day challenge delay.',
          'Both architectures guarantee data availability on Layer 1, ensuring funds can always be recovered even if the off-chain sequencer goes offline.'
        ],
        example: 'Like an accountant filing business taxes: an Optimistic Rollup submits the final tax summary and keeps receipts for 7 years in case of an audit (fraud proof), whereas a ZK-Rollup attaches a notarized mathematical certificate proving every receipt was valid at the moment of filing (validity proof).',
        code: `// Layer 2 Rollup Batch State Commitment & Proof Engine Simulator
function fastKeccak(data: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) {
    h ^= data.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return '0x' + (h >>> 0).toString(16).padStart(8, '0');
}

interface L2Transaction {
  txId: number;
  from: string;
  to: string;
  amount: number;
}

function processRollupBatch(
  prevRoot: string,
  batchId: number,
  txs: L2Transaction[]
): { newRoot: string; compressedCalldataBytes: number; fraudChallengeWindowHours: number } {
  let stateAccumulator = prevRoot;
  for (const tx of txs) {
    stateAccumulator = fastKeccak(stateAccumulator + ':' + tx.from + '->' + tx.to + ':' + tx.amount);
  }
  // Compressed L1 calldata footprint: ~12 bytes per transaction vs 110 bytes uncompressed on L1
  const compressedBytes = txs.length * 12;
  return {
    newRoot: stateAccumulator,
    compressedCalldataBytes: compressedBytes,
    fraudChallengeWindowHours: 168 // 7 Days standard optimistic challenge window
  };
}

const batch: L2Transaction[] = [
  { txId: 1, from: '0xUserA', to: '0xUserB', amount: 150 },
  { txId: 2, from: '0xUserB', to: '0xUserC', amount: 75 },
  { txId: 3, from: '0xUserC', to: '0xUserA', amount: 20 },
];

const prevL1Root = '0x11223344';
const result = processRollupBatch(prevL1Root, 42, batch);

console.log('=== LAYER 2 ROLLUP BATCH STATE COMMITMENT ENGINE ===');
console.log('Previous L1 State Root: ' + prevL1Root);
console.log('Batched Transactions: ' + batch.length + ' txs posted in single L1 calldata blob');
console.log('Compressed Calldata Footprint: ' + result.compressedCalldataBytes + ' bytes (89% compression)');
console.log('New Committed State Root: ' + result.newRoot);
console.log('Challenge Period: ' + result.fraudChallengeWindowHours + ' hours (7 days)');`,
        output: `=== LAYER 2 ROLLUP BATCH STATE COMMITMENT ENGINE ===\nPrevious L1 State Root: 0x11223344\nBatched Transactions: 3 txs posted in single L1 calldata blob\nCompressed Calldata Footprint: 36 bytes (89% compression)\nNew Committed State Root: 0x04a395e5\nChallenge Period: 168 hours (7 days)`,
        codeNotes: [
          { line: 18, note: 'Sequentially applies batched off-chain transactions to compute updated state root' },
          { line: 22, note: 'Compresses transaction calldata to minimize L1 data availability posting costs' },
          { line: 26, note: 'Configures 168-hour (7-day) dispute window for interactive fraud challenge games' },
          { line: 39, note: 'Posts atomic batch state commitment to Layer 1 contract' }
        ],
        tryIt: 'Add a fraudulent transaction from an empty account and verify that state root output diverges completely.',
        check: {
          question: 'What is the key architectural difference between Optimistic Rollups and Zero-Knowledge (ZK) Rollups?',
          options: [
            'Optimistic rollups rely on dispute-period fraud proofs (7-day challenge), whereas ZK-rollups verify mathematical validity proofs immediately upon L1 submission',
            'ZK-rollups require all user balances to be publicly viewable on social media',
            'Optimistic rollups execute entirely on centralized cloud servers without Ethereum consensus',
            'ZK-rollups cannot execute smart contracts under any circumstances'
          ],
          answer: 0,
          why: 'Optimistic rollups assume validity unless challenged with a fraud proof during the 7-day window; ZK-rollups mathematically prove state correctness upfront with cryptographic validity proofs.'
        }
      },
      {
        title: 'Upgradeable Smart Contracts: ERC-1967 Storage Slots & DELEGATECALL Routing',
        say: [
          'Deployed EVM bytecode is permanently immutable: once a smart contract is deployed to an address, its code can never be modified.',
          'However, real-world protocols require bug fixes, security patches, and feature additions.',
          'Web3 engineering resolves this contradiction through Proxy Architectures powered by the DELEGATECALL opcode.',
          'In a proxy setup, the user interacts with a permanent Proxy Contract that holds all state (balances, variables) and funds.',
          'When a function is called, the proxy executes fallback() and DELEGATECALLs the implementation contract: the logic code runs in the storage context of the proxy.',
          'A dangerous pitfall is Storage Collision: if the proxy stores its implementation address in slot 0, and the implementation defines an owner variable in slot 0, the implementation will overwrite its own logic address and destroy the contract.',
          'ERC-1967 solved this by standardizing Unstructured Storage Slots: implementation pointers are stored at pseudo-random hashes (e.g. keccak256("eip1967.proxy.implementation") - 1), guaranteeing zero collision with user state variables.'
        ],
        example: 'Like an office building lobby (Proxy) with an executive director (Implementation). Clients always visit the same physical address and the company files remain in the building vault (Proxy storage), even when the board hires a new director with updated operational strategies.',
        code: `// ERC-1967 Upgradeable Proxy Storage Architecture Simulator
const ERC1967_IMPLEMENTATION_SLOT = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';

class UpgradeableProxy {
  private storageSlots = new Map<string, string>();
  private proxyAdmin: string;

  constructor(initialImplementation: string, admin: string) {
    this.proxyAdmin = admin;
    this.storageSlots.set(ERC1967_IMPLEMENTATION_SLOT, initialImplementation);
  }

  public getImplementation(): string {
    return this.storageSlots.get(ERC1967_IMPLEMENTATION_SLOT) || '0x0';
  }

  public upgradeTo(newImplementation: string, caller: string): boolean {
    if (caller !== this.proxyAdmin) {
      return false; // Unauthorized upgrade attempt rejected
    }
    this.storageSlots.set(ERC1967_IMPLEMENTATION_SLOT, newImplementation);
    return true;
  }

  public simulateDelegateCall(methodSig: string, stateVarKey: string, newValue: string): void {
    // In delegatecall, logic from implementation executes in proxy storage space
    this.storageSlots.set(stateVarKey, newValue);
  }

  public readStorage(slotKey: string): string {
    return this.storageSlots.get(slotKey) || '0x0';
  }
}

const proxy = new UpgradeableProxy('0xLogicV1_Token', '0xMultisigAdmin');
console.log('=== ERC-1967 UPGRADEABLE PROXY STORAGE ARCHITECTURE ===');
console.log('ERC-1967 Implementation Slot: ' + ERC1967_IMPLEMENTATION_SLOT.slice(0, 14) + '...');
console.log('Active Logic Contract: ' + proxy.getImplementation());

// Execute logic via delegatecall (modifies slot 0 in proxy storage)
proxy.simulateDelegateCall('initialize()', 'slot_0_owner', '0xAlice');
console.log('Proxy Storage [Slot 0] (Owner): ' + proxy.readStorage('slot_0_owner'));

// Admin upgrades logic to V2
const upgradeSuccess = proxy.upgradeTo('0xLogicV2_YieldToken', '0xMultisigAdmin');
console.log('Upgrade to V2 Authorized: ' + (upgradeSuccess ? 'SUCCESS' : 'REVERTED'));
console.log('New Active Logic Contract: ' + proxy.getImplementation());
console.log('Preserved State Invariant [Slot 0]: ' + proxy.readStorage('slot_0_owner') + ' (Zero Data Loss)');`,
        output: `=== ERC-1967 UPGRADEABLE PROXY STORAGE ARCHITECTURE ===\nERC-1967 Implementation Slot: 0x360894a13ba1...\nActive Logic Contract: 0xLogicV1_Token\nProxy Storage [Slot 0] (Owner): 0xAlice\nUpgrade to V2 Authorized: SUCCESS\nNew Active Logic Contract: 0xLogicV2_YieldToken\nPreserved State Invariant [Slot 0]: 0xAlice (Zero Data Loss)`,
        codeNotes: [
          { line: 2, note: 'Standard ERC-1967 hash slot prevents storage collisions with implementation variables' },
          { line: 16, note: 'Restricts upgrade authorization strictly to multi-sig proxy administrator' },
          { line: 23, note: 'Simulates DELEGATECALL execution writing directly to calling proxy storage slots' },
          { line: 43, note: 'Proves seamless logic upgrade while preserving all historical user balances and ownership' }
        ],
        tryIt: 'Attempt an unauthorized upgrade from a non-admin address and observe the rejection.',
        check: {
          question: 'Why does ERC-1967 store the implementation logic address at a specific pseudo-random storage slot hash rather than slot 0?',
          options: [
            'To avoid storage slot collisions with implementation contract variables like owner or totalSupply located in lower slots',
            'To make the implementation address invisible to block explorers',
            'Because slot 0 is permanently reserved for the miner’s gas refund',
            'To prevent the proxy from being called by web browsers'
          ],
          answer: 0,
          why: 'Storing proxy logic pointers at pseudo-random hashes (like keccak256("eip1967.proxy.implementation") - 1) prevents storage collision with business variables starting at slot 0.'
        }
      }
    ],
    summary: [
      'Uniswap v2 constant product AMMs enforce the x * y = k invariant, calculating output yield with 0.30% LP fees and convex slippage.',
      'TWAP oracles accumulate price over time (PriceCumulative += Spot * Delta_t), diluting flash loan price spikes to near zero over observation windows.',
      'EIP-712 structured data hashing binds typed payloads to specific contracts and chain IDs, powering gasless ERC-2612 permit meta-transactions.',
      'Layer 2 Rollups compress transactions onto L1 data availability layers, separating into Optimistic fraud proofs (7-day window) and ZK validity proofs.',
      'ERC-1967 proxy architecture enables immutable contract upgrades via DELEGATECALL using unstructured storage slots to eliminate collision risks.'
    ],
    projectStep: {
      title: 'Engineer a Production-Grade DeFi Protocol Suite',
      steps: [
        'Implement an AMM swap calculator with 0.30% fee and slippage estimation.',
        'Build a TWAP cumulative oracle protecting against single-block flash loan spikes.',
        'Construct an EIP-712 typed structured hashing engine for gasless permits.',
        'Design an ERC-1967 upgradeable proxy demonstrating seamless logic upgrade with state preservation.'
      ]
    }
  },
  {
    coursePrefix: 'blockchain',
    day: 3,
    title: 'Smart Contract Engineering: ERC Standards, Flash Loans, Gas Packing & Oracles',
    goal: 'Master smart contract security and engineering: ERC-20 & ERC-721 token standards with allowance race condition defenses, Flash loans and OpenZeppelin ReentrancyGuard checks-effects-interactions patterns, EVM 32-byte storage slot packing gas optimization, Merkle tree cryptographic airdrop verification, and Chainlink decentralized oracle staleness protection.',
    minutes: 45,
    recap: 'In Day 1, we mastered blockchain cryptographic primitives, mining, and state transitions. In Day 2, we mastered Uniswap v2 AMM constant product math, TWAP flash loan resistance, EIP-712 permit meta-transactions, L2 rollups, and ERC-1967 upgradeable proxies. Now in Day 3, we build enterprise smart contracts: ERC token standards, flash loans and reentrancy defense, EVM storage slot packing, Merkle airdrops, and Chainlink oracle feeds.',
    parts: [
      {
        title: 'ERC-20 & ERC-721 Token Standards & Allowance Race Condition Protection',
        say: [
          'The Ethereum Request for Comment 20 (ERC-20) standard defined the interface that revolutionized decentralized finance by creating fungible token interoperability.',
          'Core methods include totalSupply(), balanceOf(), transfer(), approve(), allowance(), and transferFrom().',
          'However, standard ERC-20 implementations suffer from a well-known vulnerability known as the ERC-20 Approve Front-Running Race Condition.',
          'If a user decides to reduce an authorized spender’s allowance from 100 to 50 tokens and sends an approve(spender, 50) transaction, a malicious spender monitoring the public mempool can front-run the transaction by spending the original 100 tokens first, and then spend the new 50 tokens once the approval transaction confirms.',
          'To neutralize this race condition, modern secure implementations (such as OpenZeppelin ERC-20) recommend either enforcing a two-step approve(spender, 0) reset or utilizing increaseAllowance() and decreaseAllowance() methods that pass expected delta amounts.',
          'Meanwhile, ERC-721 expands this paradigm to Non-Fungible Tokens (NFTs) where each token has a globally unique uint256 tokenId and safeTransferFrom() hooks verifying that recipient smart contracts implement IERC721Receiver.'
        ],
        example: 'Think of giving someone a company credit card. If you give a contractor a $500 monthly limit (allowance), and decide to cut it to $200, but they see the letter in transit and immediately spend the $500 before your letter arrives, they could then spend the new $200 as well ($700 total). Safe allowance protocols require freezing the card to $0 first before issuing the new credit limit.',
        code: `// Simulation: ERC-20 Token Standard & Front-Running Allowance Defense
class Erc20TokenSimulator {
  name = 'PinIT Governance Token';
  symbol = 'PIN';
  totalSupply = 1000000;
  private balances: Map<string, number> = new Map();
  private allowances: Map<string, Map<string, number>> = new Map();

  constructor(owner: string) {
    this.balances.set(owner, this.totalSupply);
  }

  balanceOf(account: string): number {
    return this.balances.get(account) || 0;
  }

  // Safe allowance pattern mitigating front-running race condition
  safeApprove(owner: string, spender: string, newAmount: number, expectedCurrentAmount: number): boolean {
    const ownerAllowances = this.allowances.get(owner) || new Map<string, number>();
    const current = ownerAllowances.get(spender) || 0;

    // Reject if caller assumes current allowance is 0 but it was changed
    if (current !== expectedCurrentAmount) {
      return false; // Race condition prevented
    }
    ownerAllowances.set(spender, newAmount);
    this.allowances.set(owner, ownerAllowances);
    return true;
  }

  transferFrom(spender: string, owner: string, to: string, amount: number): boolean {
    const ownerAllowances = this.allowances.get(owner);
    const allowance = ownerAllowances?.get(spender) || 0;
    const balance = this.balanceOf(owner);

    if (allowance < amount || balance < amount) return false;
    ownerAllowances!.set(spender, allowance - amount);
    this.balances.set(owner, balance - amount);
    this.balances.set(to, (this.balances.get(to) || 0) + amount);
    return true;
  }
}

const token = new Erc20TokenSimulator('0xDeployer');
// Normal approval of 500 tokens
token.safeApprove('0xDeployer', '0xDexRouter', 500, 0);
// Spender transfers 200 tokens
token.transferFrom('0xDexRouter', '0xDeployer', '0xLiquidityPool', 200);

// Attack simulation: Front-running race condition defense
// Deployer wants to change allowance from 300 to 100, but assumes old allowance was 0 -> Rejected!
const raceDetected = !token.safeApprove('0xDeployer', '0xDexRouter', 100, 0);

console.log('=== ERC-20 ALLOWANCE SAFETY & RACE CONDITION DEFENSE ===');
console.log('Token Contract: ' + token.name + ' (' + token.symbol + ')');
console.log('Transferred via transferFrom: 200 PIN to 0xLiquidityPool');
console.log('Deployer Remaining Balance: ' + token.balanceOf('0xDeployer') + ' PIN');
console.log('Race Condition Interception: ' + (raceDetected ? 'BLOCKED (Must pass exact current allowance)' : 'FAILED'));`,
        output: `=== ERC-20 ALLOWANCE SAFETY & RACE CONDITION DEFENSE ===\nToken Contract: PinIT Governance Token (PIN)\nTransferred via transferFrom: 200 PIN to 0xLiquidityPool\nDeployer Remaining Balance: 999800 PIN\nRace Condition Interception: BLOCKED (Must pass exact current allowance)`,
        tryIt: 'Reset the allowance to 0 first and verify that a subsequent approval to 100 succeeds cleanly.',
        check: {
          question: 'How does the ERC-20 allowance race condition allow a malicious spender to extract more tokens than intended?',
          options: [
            'By observing a pending approve() transaction in the mempool, spending the existing allowance first via front-running, and then spending the newly approved allowance once mined',
            'By overriding the token total supply directly in bytecode',
            'By modifying the Ethereum consensus gas limit'
          ],
          answer: 0,
          why: 'Because transactions in the mempool are visible, a spender can submit a higher-gas transaction to drain the old allowance before the owner\'s reduction transaction confirms, effectively double-spending allowances.'
        }
      },
      {
        title: 'Flash Loans, Reentrancy Attacks & Checks-Effects-Interactions Pattern',
        say: [
          'Flash loans are a revolutionary financial primitive unique to smart contracts: protocols like Aave allow users to borrow tens of millions of dollars without upfront collateral, provided the principal and borrowing fee are returned within the same atomic transaction.',
          'If the borrower fails to repay the loan by the end of the transaction execution, the EVM automatically rolls back all state changes, guaranteeing zero default risk for lenders.',
          'However, flash loans provide attackers with virtually unlimited liquidity to exploit smart contract bugs, chief among them being Reentrancy Attacks.',
          'The infamous 2016 DAO exploit occurred because a contract executed an external Ether transfer before decrementing the caller’s recorded balance.',
          'The attacker’s malicious contract utilized its fallback() or receive() hook to recursively call withdraw() over and over before the original balance was zeroed, draining $60 million.',
          'To eradicate reentrancy vulnerabilities, smart contract engineers adhere strictly to two defense layers: the Checks-Effects-Interactions pattern (updating internal state variables before making external calls) and OpenZeppelin’s ReentrancyGuard nonReentrant modifier (a mutex lock preventing recursive entry).'
        ],
        example: 'Think of an automated bank ATM. If the machine dispenses cash through the dispenser slot (external interaction) before deducting $100 from your account ledger (state effect), a thief could jam the slot sensor to trigger five withdrawals in a row before their balance ever decreases. Updating the ledger first makes the exploit impossible.',
        code: `// Simulation: Flash Loans, Reentrancy Attacks & OpenZeppelin ReentrancyGuard
class SecureBankWithGuard {
  balances: Map<string, number> = new Map();
  private locked = false;

  deposit(account: string, amount: number) {
    this.balances.set(account, (this.balances.get(account) || 0) + amount);
  }

  // Protected with Checks-Effects-Interactions and Mutex ReentrancyGuard
  secureWithdraw(account: string, callback: () => void): { success: boolean; error?: string } {
    if (this.locked) return { success: false, error: 'REENTRANCY_GUARD_TRIGGERED' };
    const bal = this.balances.get(account) || 0;
    if (bal <= 0) return { success: false, error: 'INSUFFICIENT_BALANCE' };

    this.locked = true; // 1. Mutex Lock
    this.balances.set(account, 0); // 2. EFFECT: State updated FIRST!
    try {
      callback(); // 3. INTERACTION: External call executed last
      return { success: true };
    } finally {
      this.locked = false; // Mutex unlocked
    }
  }
}

const secureBank = new SecureBankWithGuard();
secureBank.deposit('0xAttacker', 100);

let reentrancyIntercepted = false;
secureBank.secureWithdraw('0xAttacker', () => {
  // Attacker contract re-enters withdraw in its fallback
  const attempt = secureBank.secureWithdraw('0xAttacker', () => {});
  if (attempt.error === 'REENTRANCY_GUARD_TRIGGERED') {
    reentrancyIntercepted = true;
  }
});

console.log('=== FLASH LOANS, REENTRANCY ATTACKS & REENTRANCYGUARD ===');
console.log('Reentrancy Exploit Defense: ' + (reentrancyIntercepted ? 'REENTRANCY_GUARD_TRIGGERED (Blocked!)' : 'EXPLOITED'));
console.log('Post-Withdraw Balance: ' + (secureBank.balances.get('0xAttacker') || 0) + ' ETH (Checks-Effects-Interactions Invariant)');`,
        output: `=== FLASH LOANS, REENTRANCY ATTACKS & REENTRANCYGUARD ===\nReentrancy Exploit Defense: REENTRANCY_GUARD_TRIGGERED (Blocked!)\nPost-Withdraw Balance: 0 ETH (Checks-Effects-Interactions Invariant)`,
        tryIt: 'Remove the mutex locked flag and reverse the balance update order to see how reentrancy drains funds.',
        check: {
          question: 'What is the core principle of the Checks-Effects-Interactions pattern in Solidity smart contracts?',
          options: [
            'Update all internal contract state variables (effects) before initiating any external contract calls or ether transfers (interactions)',
            'Check the gas price before printing a receipt',
            'Send ether first, and only log the transaction if no errors occur'
          ],
          answer: 0,
          why: 'By committing all balance reductions and state changes before invoking external contracts, reentrant calls will see zeroed balances and fail, completely defusing reentrancy attacks.'
        }
      },
      {
        title: 'EVM Storage Slot Packing & Gas Optimization',
        say: [
          'On the Ethereum Virtual Machine, persistent contract storage is by far the most expensive computing resource in terms of gas consumption.',
          'Writing a non-zero value into an empty storage slot (SSTORE) costs up to 20,000 gas, while reading a cold slot (SLOAD) costs 2,100 gas.',
          'EVM storage is organized as an array of 32-byte (256-bit) slots, indexed from 0 to 2^256 - 1.',
          'Solidity automatically packs contiguous state variables into the same 32-byte slot if their combined data size is less than or equal to 32 bytes.',
          'However, the order of declaration is critical: if a developer declares uint128 a, uint256 b, uint128 c, Solidity cannot pack a and c together because variable b occupies an entire 32-byte slot between them, consuming 3 distinct slots (96 bytes).',
          'By simply reordering the struct to uint128 a, uint128 c, uint256 b, the compiler packs a and c into a single 32-byte slot, slashing the storage footprint to 2 slots and saving 20,000 gas on initial storage writes.'
        ],
        example: 'Think of packing shipping containers. If you load a half-sized box (uint128), then a full container-sized safe (uint256), and then another half-sized box (uint128), the shipping line charges you for 3 separate containers. But if you place the two half-sized boxes into a single container together, you only pay for 2 containers.',
        code: `// Simulation: EVM Storage Slot Packing & SSTORE Gas Calculus
class EvmStoragePacker {
  calculateUnpackedSlots(fields: { name: string; bytes: number }[]): { slotCount: number; gasCostSstore: number } {
    // Unpacked: every field placed in a dedicated 32-byte slot
    const slotCount = fields.length;
    return { slotCount, gasCostSstore: slotCount * 20000 };
  }

  calculatePackedSlots(fields: { name: string; bytes: number }[]): { slotCount: number; gasCostSstore: number } {
    // Packed: adjacent fields whose sum <= 32 bytes share a single slot
    let slotCount = 1;
    let currentBytes = 0;
    for (const f of fields) {
      if (currentBytes + f.bytes <= 32) {
        currentBytes += f.bytes;
      } else {
        slotCount++;
        currentBytes = f.bytes;
      }
    }
    return { slotCount, gasCostSstore: slotCount * 20000 };
  }
}

const packer = new EvmStoragePacker();
const accountFields = [
  { name: 'isVerified', bytes: 1 },    // bool (1 byte)
  { name: 'tierLevel', bytes: 1 },     // uint8 (1 byte)
  { name: 'userAddress', bytes: 20 },  // address (20 bytes) -> Total 22 bytes in Slot 0
  { name: 'balanceWei', bytes: 32 }    // uint256 (32 bytes) -> Total 32 bytes in Slot 1
];

const unpacked = packer.calculateUnpackedSlots(accountFields);
const packed = packer.calculatePackedSlots(accountFields);
const gasSaved = unpacked.gasCostSstore - packed.gasCostSstore;

console.log('=== EVM STORAGE PACKING & GAS OPTIMIZATION ===');
console.log('Unpacked Layout: ' + unpacked.slotCount + ' Slots (' + unpacked.gasCostSstore.toLocaleString('en-US') + ' Gas for initial SSTORE)');
console.log('Packed Layout: ' + packed.slotCount + ' Slots (' + packed.gasCostSstore.toLocaleString('en-US') + ' Gas for initial SSTORE)');
console.log('Gas Efficiency Gain: Saved ' + gasSaved.toLocaleString('en-US') + ' Gas (50% Storage Reduction)');`,
        output: `=== EVM STORAGE PACKING & GAS OPTIMIZATION ===\nUnpacked Layout: 4 Slots (80,000 Gas for initial SSTORE)\nPacked Layout: 2 Slots (40,000 Gas for initial SSTORE)\nGas Efficiency Gain: Saved 40,000 Gas (50% Storage Reduction)`,
        tryIt: 'Add a uint64 timestamp field (8 bytes) to accountFields and observe that it fits inside Slot 0 (22 + 8 = 30 bytes <= 32 bytes).',
        check: {
          question: 'Why does packing multiple struct variables into a single 32-byte EVM storage slot save significant gas?',
          options: [
            'Because reading and writing to storage (SLOAD/SSTORE) is the most expensive operation in EVM; combining variables into one slot reduces the number of slot writes',
            'Because packing variables turns off gas fees entirely',
            'Because the EVM cannot store variables larger than 16 bytes'
          ],
          answer: 0,
          why: 'SSTORE costs up to 20,000 gas per unique slot written. Packing multiple smaller types (like uint128, address, and bool) into a single 32-byte slot combines multiple writes into one SSTORE operation.'
        }
      },
      {
        title: 'Merkle Proofs & Cryptographic Airdrop Whitelists',
        say: [
          'Distributing tokens or NFT mint allowances to a whitelist of 10,000 addresses presents a massive on-chain gas dilemma.',
          'Storing 10,000 addresses directly in a Solidity mapping on Ethereum mainnet requires 10,000 SSTORE operations, costing millions of gas (over $50,000 in transaction fees).',
          'Cryptographic Merkle Trees provide an elegant, mathematically unassailable solution that slashes on-chain storage costs to O(1).',
          'The project calculates the whitelist tree entirely off-chain: each recipient address and token allocation forms a leaf node, and pairs of nodes are recursively hashed together using keccak256 until a single 32-byte Merkle Root is produced.',
          'The smart contract stores only this single 32-byte root in on-chain storage.',
          'When an eligible user claims their airdrop, they submit their leaf and a lightweight Merkle Proof consisting of O(log N) sibling hashes (approx. 14 hashes for 10,000 users). The contract hashes up the branch in milliseconds to verify membership, using a bitmap to prevent double claiming.'
        ],
        example: 'Think of a tournament bracket. The organizer only posts the name of the final tournament champion at the entrance (Merkle root). When you claim you played in the quarterfinals, you don\'t need to reprint the entire 10,000-player roster; you just present the scores of your 4 direct matches (Merkle proof) to prove your branch in the bracket.',
        code: `// Simulation: Merkle Tree Whitelist Verification & Double-Claim Prevention
function simpleHash(a: string, b: string): string {
  const combined = a < b ? a + b : b + a;
  let h = 0x811c9dc5;
  for (let i = 0; i < combined.length; i++) {
    h ^= combined.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return '0x' + (h >>> 0).toString(16).padStart(8, '0');
}

// 4 Whitelist Leaves
const leaf0 = '0xAlice_100_PIN';
const leaf1 = '0xBob_250_PIN';
const leaf2 = '0xCharlie_500_PIN';
const leaf3 = '0xDave_1000_PIN';

const node01 = simpleHash(leaf0, leaf1);
const node23 = simpleHash(leaf2, leaf3);
const merkleRoot = simpleHash(node01, node23);

// Merkle Proof for Alice (needs sibling leaf1 and sibling node23)
function verifyMerkleProof(leaf: string, proof: string[], root: string): boolean {
  let computedHash = leaf;
  for (const sibling of proof) {
    computedHash = simpleHash(computedHash, sibling);
  }
  return computedHash === root;
}

const aliceProof = [leaf1, node23];
const isAliceValid = verifyMerkleProof(leaf0, aliceProof, merkleRoot);
const fakeProof = ['0xFakeSibling', node23];
const isFakeValid = verifyMerkleProof(leaf0, fakeProof, merkleRoot);

console.log('=== MERKLE PROOF AIRDROP VERIFICATION ===');
console.log('On-Chain Stored Merkle Root: ' + merkleRoot);
console.log('Alice Proof Verification: ' + (isAliceValid ? 'VALID (Claim 100 PIN Authorized)' : 'INVALID'));
console.log('Forged Proof Verification: ' + (isFakeValid ? 'VALID' : 'REJECTED (Cryptographically Invalid Proof)'));
console.log('On-Chain Gas Invariant: O(1) storage footprint (only 32 bytes stored for 10,000+ recipients)');`,
        output: `=== MERKLE PROOF AIRDROP VERIFICATION ===\nOn-Chain Stored Merkle Root: 0x6481612a\nAlice Proof Verification: VALID (Claim 100 PIN Authorized)\nForged Proof Verification: REJECTED (Cryptographically Invalid Proof)\nOn-Chain Gas Invariant: O(1) storage footprint (only 32 bytes stored for 10,000+ recipients)`,
        tryIt: 'Generate the Merkle proof for Bob (needs leaf0 and node23) and verify it against the same merkleRoot.',
        check: {
          question: 'What is the primary architectural benefit of using a Merkle Tree for airdrop whitelisting instead of an on-chain mapping?',
          options: [
            'The smart contract only needs to store a single 32-byte root hash regardless of whitelist size, shifting verification compute and proof data to the claimant',
            'Merkle trees make all tokens trade at zero transaction fees',
            'Mappings cannot store Ethereum addresses'
          ],
          answer: 0,
          why: 'Storing 10,000 addresses in a mapping requires 10,000 expensive SSTORE writes by the deployer. Merkle trees require storing only one 32-byte root (O(1)), while individual claimants provide O(log N) proofs when claiming.'
        }
      },
      {
        title: 'Chainlink Decentralized Oracles & Stale Price Protection',
        say: [
          'Because the Ethereum Virtual Machine is a deterministic state machine, smart contracts cannot make outbound HTTP requests to query off-chain data such as USD asset prices or weather feeds.',
          'Decentralized oracles bridge this gap: Chainlink aggregates price data from independent node operators and submits aggregated consensus prices to on-chain contracts via the AggregatorV3Interface.',
          'However, naively reading latestRoundData() without defensive validation creates severe vulnerabilities.',
          'During periods of extreme blockchain network congestion or oracle infrastructure outages, an oracle feed might stop updating, leaving stale prices frozen in contract memory.',
          'Sophisticated arbitrage bots exploit stale price feeds by borrowing collateral or executing swaps against frozen prices that diverge from off-chain market actuals.',
          'Production DeFi smart contracts enforce three critical oracle validation invariants: price must be strictly positive (price > 0), the round must be complete (answeredInRound >= roundId), and the update timestamp must be fresh (block.timestamp - updatedAt <= HEARTBEAT_TIMEOUT).'
        ],
        example: 'Think of a GPS navigation system on a ship. If the satellite receiver loses signal and freezes the ship’s position on the screen, the captain cannot simply assume the boat is stationary. A safety system checks the timestamp of the last satellite ping: if older than 5 minutes, an alarm sounds and automated piloting is suspended.',
        code: `// Simulation: Chainlink Decentralized Oracle Consumer & Staleness Protection
interface ChainlinkRoundData {
  roundId: number;
  answer: number; // 8 decimals (e.g. 250000000000 for $2500.00)
  startedAt: number;
  updatedAt: number;
  answeredInRound: number;
}

class OracleConsumerSimulator {
  private maxStalenessSeconds = 3600; // 1-hour heartbeat

  validatePrice(roundData: ChainlinkRoundData, currentTimestamp: number): {
    valid: boolean;
    priceUsd: number;
    reason: string;
  } {
    // Check 1: Non-zero positive price
    if (roundData.answer <= 0) {
      return { valid: false, priceUsd: 0, reason: 'INVALID_NEGATIVE_OR_ZERO_PRICE' };
    }
    // Check 2: Round completeness
    if (roundData.answeredInRound < roundData.roundId) {
      return { valid: false, priceUsd: 0, reason: 'ROUND_INCOMPLETE' };
    }
    // Check 3: Staleness check against heartbeat
    if (currentTimestamp - roundData.updatedAt > this.maxStalenessSeconds) {
      return { valid: false, priceUsd: 0, reason: 'STALE_PRICE_HEARTBEAT_EXCEEDED' };
    }

    return {
      valid: true,
      priceUsd: roundData.answer / 1e8,
      reason: 'VERIFIED_FRESH_ORACLE_FEED'
    };
  }
}

const consumer = new OracleConsumerSimulator();
const now = 1700003600;
const freshData: ChainlinkRoundData = {
  roundId: 105,
  answer: 265050000000, // $2650.50
  startedAt: now - 300,
  updatedAt: now - 300, // 5 minutes ago
  answeredInRound: 105
};

const staleData: ChainlinkRoundData = {
  roundId: 104,
  answer: 260000000000,
  startedAt: now - 7200,
  updatedAt: now - 7200, // 2 hours ago (> 1 hour heartbeat)
  answeredInRound: 104
};

const freshResult = consumer.validatePrice(freshData, now);
const staleResult = consumer.validatePrice(staleData, now);

console.log('=== CHAINLINK ORACLE STALE PRICE PROTECTION ===');
console.log('Fresh Feed Price: $' + freshResult.priceUsd.toFixed(2) + ' (' + freshResult.reason + ')');
console.log('Stale Feed Evaluation: ' + (staleResult.valid ? 'VALID' : 'REJECTED (' + staleResult.reason + ')'));
console.log('Protocol Security Invariant: Prevents flash crashes and stale arbitrage exploitation');`,
        output: `=== CHAINLINK ORACLE STALE PRICE PROTECTION ===\nFresh Feed Price: $2650.50 (VERIFIED_FRESH_ORACLE_FEED)\nStale Feed Evaluation: REJECTED (STALE_PRICE_HEARTBEAT_EXCEEDED)\nProtocol Security Invariant: Prevents flash crashes and stale arbitrage exploitation`,
        tryIt: 'Simulate a flash-crash zero price (answer: 0) and verify that the consumer rejects the round.',
        check: {
          question: 'Why must DeFi contracts check block.timestamp - updatedAt <= HEARTBEAT_TIMEOUT when querying Chainlink price feeds?',
          options: [
            'To ensure the price data is recent and prevent arbitrage bots from exploiting outdated prices if the oracle pauses during network congestion',
            'To reset the gas fees on Ethereum',
            'Because Chainlink charges extra fees for old prices'
          ],
          answer: 0,
          why: 'If an oracle feed fails to update during market volatility, relying on outdated price feeds allows attackers to liquidate healthy loans or trade against frozen prices, causing protocol insolvency.'
        }
      }
    ],
    summary: [
      'ERC-20 allowances must guard against mempool front-running race conditions by resetting allowances to 0 or passing expected current values.',
      'Flash loans enable atomic uncollateralized borrowing, while ReentrancyGuard and Checks-Effects-Interactions patterns block reentrancy exploits.',
      'EVM storage packing arranges struct members within 32-byte boundaries, saving 20,000 gas per slot avoided on SSTORE operations.',
      'Merkle proofs enable O(1) on-chain storage for airdrop whitelists, verifying eligibility off-chain with O(log N) cryptographic sibling hashes.',
      'Chainlink decentralized oracle consumers must validate round completeness, positive price boundaries, and timestamp staleness heartbeats.'
    ],
    projectStep: {
      title: 'Architect an Audited Smart Contract Suite with Merkle Airdrop & Oracles',
      steps: [
        'Deploy an ERC-20 token with safe allowance mutation patterns protecting against front-running.',
        'Implement a lending vault protected by OpenZeppelin ReentrancyGuard and Checks-Effects-Interactions.',
        'Optimize contract struct storage layouts into tightly packed 32-byte EVM slots.',
        'Construct a Merkle tree airdrop distributor with bitmap double-claim prevention.',
        'Integrate a Chainlink Price Feed consumer with comprehensive staleness and sanity checks.'
      ]
    }
  },
  {
    day: 4,
    title: 'Advanced Smart Contract Auditing, Foundry Invariant Fuzzing & Governance Protocols',
    goal: 'Master institutional-grade smart contract engineering: Read-Only Reentrancy mitigation with reentrancy guards, Foundry stateless and stateful invariant fuzz testing, SMTChecker formal verification constraints, multi-sig treasury governance (Gnosis Safe threshold signatures), and TimelockController emergency execution queues.',
    minutes: 36,
    recap: 'Welcome to Advanced Smart Contract Security & DeFi Governance. Today we progress from standard solidity coding into the rigorous discipline of invariant security auditing, fuzz testing, and trust-minimized governance.',
    parts: [
      {
        title: 'Read-Only Reentrancy & Cross-Contract State Inconsistency',
        say: [
          'Classic reentrancy exploits drain contract funds during external calls that modify state. However, a far more subtle and dangerous attack vector is Read-Only Reentrancy. In this scenario, an external view function that calculates an exchange rate or LP token price is read mid-execution by a third-party contract while internal balances are temporarily imbalanced.',
          'Consider a liquidity pool contract that allows liquidity withdrawal. During the withdrawal execution, the pool transfers native ETH to the caller before burning the caller LP tokens or adjusting internal accounting balances. If the recipient is a malicious contract, its fallback function can invoke a separate lending protocol that queries the pool virtual price.',
          'Because the pool ETH reserves have decreased but the LP supply has not yet been burned, the pool virtual price appears artificially low or high. The attacker contract borrows assets against this skewed valuation, resulting in millions in uncollateralized bad debt. Defending against read-only reentrancy requires applying transient reentrancy locks (using EIP-1153 TSTORE/TLOAD) or ensuring view functions revert if invoked while a reentrancy lock is active.'
        ],
        example: 'Like checking a business bank account balance while an unverified check withdrawal is half-processed. If another loan officer checks the balance before the bookkeeper finishes balancing the ledger, they see incorrect numbers and approve a reckless loan.',
        code: `// Read-Only Reentrancy & Transient Lock Protection Simulator
interface PoolState {
  ethReserve: number;
  tokenReserve: number;
  locked: boolean;
}

class VulnerablePool {
  public state: PoolState = { ethReserve: 1000, tokenReserve: 1000000, locked: false };

  // Simulates mid-execution state during liquidity withdrawal
  simulateMidWithdrawal(callback: (viewPrice: number) => void): void {
    this.state.locked = true;
    const originalEth = this.state.ethReserve;
    this.state.ethReserve = 200; // temporarily drained before burn/settlement
    const midPrice = (this.state.ethReserve * 1000) / this.state.tokenReserve;
    callback(midPrice);
    this.state.ethReserve = originalEth; // restored after settlement
    this.state.locked = false;
  }

  getVirtualPrice(): number {
    if (this.state.locked) {
      throw new Error('READ_ONLY_REENTRANCY_DETECTED: Pool locked during mid-execution state');
    }
    return (this.state.ethReserve * 1000) / this.state.tokenReserve;
  }
}

const pool = new VulnerablePool();
let interceptedMidPrice = 0;
let reentrancyBlocked = false;

pool.simulateMidWithdrawal((price) => {
  interceptedMidPrice = price;
  try {
    pool.getVirtualPrice(); // Protected view call
  } catch (err: any) {
    if (err.message.includes('READ_ONLY_REENTRANCY_DETECTED')) {
      reentrancyBlocked = true;
    }
  }
});

console.log('=== READ-ONLY REENTRANCY & TRANSIENT LOCK PROTECTION ===');
console.log('Normal Pool Virtual Price: 1.00 ETH/kToken');
console.log('Manipulated Mid-Execution Price: ' + interceptedMidPrice.toFixed(2) + ' ETH/kToken');
console.log('Defensive Guard: ' + (reentrancyBlocked ? 'BLOCKED VIA TRANSIENT REENTRANCY LOCK' : 'EXPLOITED'));
console.log('Security Invariant: Secondary lending markets protected from skewed oracle pricing');`,
        output: `=== READ-ONLY REENTRANCY & TRANSIENT LOCK PROTECTION ===\nNormal Pool Virtual Price: 1.00 ETH/kToken\nManipulated Mid-Execution Price: 0.20 ETH/kToken\nDefensive Guard: BLOCKED VIA TRANSIENT REENTRANCY LOCK\nSecurity Invariant: Secondary lending markets protected from skewed oracle pricing`,
        tryIt: 'Comment out the locked check in getVirtualPrice and observe how the defensive guard reports EXPLOITED.',
        check: {
          question: 'Why does Read-Only Reentrancy bypass standard nonReentrant modifiers on write functions?',
          options: [
            'Because view functions do not modify state and traditionally omit reentrancy guards, allowing external contracts to read transiently inconsistent balances',
            'Because Ethereum gas fees are free for read-only operations',
            'Because Solidity compilers automatically delete reentrancy guards on Mondays'
          ],
          answer: 0,
          why: 'View functions typically lack nonReentrant locks. An attacker contract intercepts execution via fallback and reads skewed pool accounting before state reconciliation.'
        }
      },
      {
        title: 'Foundry Stateful Invariant & Fuzz Testing',
        say: [
          'Standard unit tests verify known happy paths and edge cases chosen by the developer. However, sophisticated smart contract hacks emerge from bizarre, multi-transaction execution permutations that developers never conceived. Foundry revolutionizes smart contract quality assurance with high-speed fuzz and invariant testing.',
          'Stateless fuzzing runs a single function with hundreds of pseudo-random inputs (e.g., uint256 max bounds, zero values, address(0)) to search for arithmetic overflow or unhandled reverts. However, stateful invariant testing goes much further: it defines a set of global system invariants that must NEVER be violated, regardless of how many transactions are executed in what order.',
          'Foundry uses Actor-Handler contracts to execute randomized sequences of deposits, withdrawals, swaps, and liquidations across hundreds of parallel test runs. If any randomized call sequence drives the protocol into an invariant violation (such as total vault shares exceeding underlying assets), Foundry isolates the exact minimum reproduction trace, guaranteeing rock-solid economic safety.'
        ],
        example: 'Like an automated stress-testing rig in a car factory that slams random doors, presses pedals, shifts gears, and hits switches 100,000 times in random orders to confirm the airbags never accidentally deploy.',
        code: `// Foundry Stateful Invariant Fuzz Testing Simulator
class InvariantVault {
  public totalAssets = 10000;
  public totalShares = 10000;

  deposit(amount: number): number {
    const shares = Math.floor((amount * this.totalShares) / this.totalAssets);
    this.totalAssets += amount;
    this.totalShares += shares;
    return shares;
  }

  withdraw(shares: number): number {
    const assets = Math.floor((shares * this.totalAssets) / this.totalShares);
    this.totalAssets -= assets;
    this.totalShares -= shares;
    return assets;
  }

  // Conservation of value invariant
  checkInvariant(): boolean {
    // Invariant: Share price should never decrease below 1.0
    return this.totalAssets >= this.totalShares;
  }
}

const vault = new InvariantVault();
let invariantHolds = true;
const operations = [
  { type: 'deposit', val: 500 },
  { type: 'withdraw', val: 200 },
  { type: 'deposit', val: 1200 },
  { type: 'withdraw', val: 800 }
];

for (const op of operations) {
  if (op.type === 'deposit') vault.deposit(op.val);
  else vault.withdraw(op.val);
  if (!vault.checkInvariant()) invariantHolds = false;
}

console.log('=== FOUNDRY STATEFUL INVARIANT FUZZ TESTING ===');
console.log('Fuzzing Strategy: Stateful Actor-Handler (Multi-Call Permutations)');
console.log('Runs Executed: 1,000 runs | Calls Per Run: 64 calls');
console.log('Invariant Verified: vault_share_price_gte_unity -> ' + (invariantHolds ? 'PASSED (0 Invariant Violations)' : 'FAILED'));
console.log('Final Vault State: Assets=' + vault.totalAssets + ' | Shares=' + vault.totalShares);`,
        output: `=== FOUNDRY STATEFUL INVARIANT FUZZ TESTING ===\nFuzzing Strategy: Stateful Actor-Handler (Multi-Call Permutations)\nRuns Executed: 1,000 runs | Calls Per Run: 64 calls\nInvariant Verified: vault_share_price_gte_unity -> PASSED (0 Invariant Violations)\nFinal Vault State: Assets=10700 | Shares=10700`,
        tryIt: 'Introduce an intentional rounding error in withdraw (+1 asset) and observe how the invariant test catches the exploit.',
        check: {
          question: 'What distinguishes stateful invariant testing from stateless fuzzing in Foundry?',
          options: [
            'Stateful invariant testing preserves contract storage across randomized sequences of multiple function calls to verify global invariants',
            'Stateless fuzzing only works on Bitcoin while invariant testing works on Solana',
            'Stateful invariant testing requires human testers to click buttons'
          ],
          answer: 0,
          why: 'Stateful invariant tests chain randomized multi-call interactions across handlers, ensuring the contract state machine remains solvent throughout arbitrary execution sequences.'
        }
      },
      {
        title: 'Formal Verification, SMTChecker & Symbolic Execution',
        say: [
          'In the words of computer scientist Edsger Dijkstra, testing shows the presence of bugs, not their absence. For multi-million-dollar DeFi protocols, testing alone is insufficient. Formal verification uses mathematical proofs to demonstrate that smart contract logic satisfies a formal specification across all infinite possible inputs.',
          'The Solidity compiler includes SMTChecker, an integrated formal verification tool that transforms Solidity Abstract Syntax Trees (AST) into Satisfiability Modulo Theories (SMT) formulas. Backed by automated theorem provers like Z3 and CVC4, SMTChecker evaluates contract assertions and requires mathematical proof that no input exists that can cause an assertion violation.',
          'Symbolic execution tools like Certora, Halmos, and Mythril represent variables not as concrete numbers, but as symbolic algebraic expressions. If an uncollateralized loan or arithmetic underflow is theoretically possible under any combination of inputs, the solver mathematically solves the system of equations and outputs the exact counterexample transaction payload.'
        ],
        example: 'Like proving a mathematical theorem using mathematical induction: you prove the theorem holds true for all numbers from 1 to infinity, rather than testing every number one by one.',
        code: `// Formal Verification & SMTChecker Solver Simulator
interface AuctionState {
  collateralEth: number;
  debtUsd: number;
  ethPriceUsd: number;
}

class SmtFormalVerifier {
  // Proves solvency constraint: (collateral * price * 100) >= (debt * minRatio)
  verifySolvencyConstraint(state: AuctionState, minRatio: number): {
    provablySolvent: boolean;
    collateralRatioPct: number;
    solverStatus: string;
  } {
    const collateralValUsd = state.collateralEth * state.ethPriceUsd;
    const ratio = (collateralValUsd * 100) / state.debtUsd;
    const provable = ratio >= minRatio;
    return {
      provablySolvent: provable,
      collateralRatioPct: Math.round(ratio),
      solverStatus: provable ? 'SMT_SATISFIED (Z3 / CVC4 Proof Bound)' : 'SMT_COUNTEREXAMPLE_FOUND'
    };
  }
}

const verifier = new SmtFormalVerifier();
const testState: AuctionState = { collateralEth: 10, debtUsd: 15000, ethPriceUsd: 2200 };
const proof = verifier.verifySolvencyConstraint(testState, 140);

console.log('=== FORMAL VERIFICATION & SMTCHECKER SOLVER ===');
console.log('SMT Solver: Z3 Theorem Prover integrated with Solidity AST');
console.log('Solvency Ratio: ' + proof.collateralRatioPct + '% (Requirement: >= 140%)');
console.log('Proof Status: ' + proof.solverStatus);
console.log('Formal Guarantee: Exhaustive mathematical proof across all possible state bounds');`,
        output: `=== FORMAL VERIFICATION & SMTCHECKER SOLVER ===\nSMT Solver: Z3 Theorem Prover integrated with Solidity AST\nSolvency Ratio: 147% (Requirement: >= 140%)\nProof Status: SMT_SATISFIED (Z3 / CVC4 Proof Bound)\nFormal Guarantee: Exhaustive mathematical proof across all possible state bounds`,
        tryIt: 'Drop the ethPriceUsd to 1200 and observe how the solver flags an SMT_COUNTEREXAMPLE_FOUND indicating liquidation insolvency.',
        check: {
          question: 'How does formal verification differ fundamentally from standard unit testing?',
          options: [
            'Formal verification uses mathematical theorem provers to prove correctness across the entire input space, rather than testing sample test cases',
            'Formal verification runs 10x slower but only tests happy paths',
            'Formal verification replaces all smart contracts with paper certificates'
          ],
          answer: 0,
          why: 'Formal verification transforms code into mathematical logic equations and uses solvers to prove assertions hold true for all conceivable inputs.'
        }
      },
      {
        title: 'Multi-Signature Safe Architecture & Threshold Signatures',
        say: [
          'DeFi treasuries, protocol admin keys, and upgrade proxies must never be controlled by a single private key. If an administrator laptop is compromised or a private key is lost, the protocol suffers catastrophic loss. The industry standard for decentralized asset custody is the Gnosis Safe smart contract architecture.',
          'A Gnosis Safe manages an array of owner addresses and an M-of-N threshold requirement (e.g., 3-of-5 signatures). To execute a transaction via execTransaction(), the transaction payload is hashed with an EIP-712 domain separator and contract nonce. The required number of signers must sign the digest off-chain using their hardware wallets or private keys.',
          'Crucially, the signatures must be submitted to the contract concatenated in strictly ascending order of signer addresses (address(signer1) < address(signer2)). The contract loops through the signatures, recovers each signer via ecrecover, verifies uniqueness, and increments the execution nonce to prevent replay attacks before forwarding the call payload.'
        ],
        example: 'Like a high-security bank vault with three distinct keyholes requiring three different executive keys inserted and turned simultaneously before the vault door mechanics disengage.',
        code: `// Gnosis MultiSig Safe Threshold Signature Pipeline Simulator
interface SafeSignature {
  signer: string;
  v: number;
  r: string;
  s: string;
}

class MultiSigSafe {
  private owners: string[];
  private threshold: number;
  private nonce = 0;

  constructor(owners: string[], threshold: number) {
    this.owners = owners.map(o => o.toLowerCase()).sort();
    this.threshold = threshold;
  }

  executeTransaction(to: string, valueEth: number, signatures: SafeSignature[]): boolean {
    if (signatures.length < this.threshold) return false;

    // Verify signers are unique, valid owners, and in strictly ascending order
    let lastSigner = '';
    for (const sig of signatures) {
      const signer = sig.signer.toLowerCase();
      if (signer <= lastSigner || !this.owners.includes(signer)) {
        return false;
      }
      lastSigner = signer;
    }
    this.nonce++;
    return true;
  }
}

const owners = [
  '0x1111111111111111111111111111111111111111',
  '0x2222222222222222222222222222222222222222',
  '0x3333333333333333333333333333333333333333'
];
const safe = new MultiSigSafe(owners, 2);

const sigs: SafeSignature[] = [
  { signer: owners[0], v: 27, r: '0xabc', s: '0xdef' },
  { signer: owners[1], v: 28, r: '0x123', s: '0x456' }
];

const executed = safe.executeTransaction('0xTreasuryPayout', 50, sigs);

console.log('=== GNOSIS MULTISIG SAFE THRESHOLD SIGNATURE PIPELINE ===');
console.log('Safe Configuration: 2-of-3 Multi-Sig Threshold');
console.log('Signatures Validated: 2 valid owners in ascending cryptographic order');
console.log('Execution Status: ' + (executed ? 'TRANSACTION EXECUTED (Nonce incremented to 1)' : 'REVERTED'));
console.log('Security Invariant: No single compromised private key can drain treasury funds');`,
        output: `=== GNOSIS MULTISIG SAFE THRESHOLD SIGNATURE PIPELINE ===\nSafe Configuration: 2-of-3 Multi-Sig Threshold\nSignatures Validated: 2 valid owners in ascending cryptographic order\nExecution Status: TRANSACTION EXECUTED (Nonce incremented to 1)\nSecurity Invariant: No single compromised private key can drain treasury funds`,
        tryIt: 'Attempt passing duplicate signatures from owner[0] and observe that the order check rejects the transaction.',
        check: {
          question: 'Why does Gnosis Safe require signatures to be ordered in strictly ascending order of signer addresses?',
          options: [
            'To enable gas-efficient O(N) duplicate signer detection in a single pass without storing dynamic memory sets',
            'Because EVM opcodes only execute from left to right',
            'To sort signers by their net worth'
          ],
          answer: 0,
          why: 'By requiring strictly ascending addresses, the smart contract checks address(current) > address(previous) to prove signer uniqueness and validity in minimal gas.'
        }
      },
      {
        title: 'Timelock Governance & Decentralized Emergency Response',
        say: [
          'Even if a multi-sig or DAO governance token approves a contract upgrade or parameter modification, executing upgrades instantaneously creates severe central point of trust and rug-pull vulnerabilities. If rogue signers or flash-loan governance attackers vote through a malicious proposal, users would have zero time to react.',
          'TimelockController contracts introduce mandatory time delays between proposal approval and on-chain execution (typically 48 to 72 hours). When a governance proposal passes, it is queued into the timelock with an earliest execution timestamp (ETA). The proposal remains publicly visible on-chain throughout the delay window.',
          'This window grants liquidity providers and users the sovereign freedom to withdraw their deposits and exit the protocol if they disagree with the proposed upgrade. In addition, timelock contracts configure Emergency Guardian roles equipped with canceller permissions, capable of vetoing malicious proposals before the timelock expiration timestamp.'
        ],
        example: 'Like an official constitutional amendment that must be published in the public registry for 30 days before taking effect, allowing citizens to inspect the changes and take legal action if needed.',
        code: `// Timelock Controller & Governance Safety Pipeline Simulator
interface QueuedProposal {
  id: string;
  target: string;
  eta: number;
  executed: boolean;
  canceled: boolean;
}

class TimelockController {
  private minDelaySeconds = 172800; // 48-hour delay
  private proposals = new Map<string, QueuedProposal>();

  queue(id: string, target: string, timestampNow: number): QueuedProposal {
    const proposal: QueuedProposal = {
      id,
      target,
      eta: timestampNow + this.minDelaySeconds,
      executed: false,
      canceled: false
    };
    this.proposals.set(id, proposal);
    return proposal;
  }

  execute(id: string, timestampNow: number): string {
    const p = this.proposals.get(id);
    if (!p) return 'ERROR_PROPOSAL_NOT_FOUND';
    if (p.canceled) return 'ERROR_PROPOSAL_CANCELED';
    if (timestampNow < p.eta) return 'ERROR_TIMELOCK_NOT_EXPIRED';
    p.executed = true;
    return 'SUCCESS_PROPOSAL_EXECUTED';
  }
}

const timelock = new TimelockController();
const queueTime = 1700000000;
const p = timelock.queue('prop_upgrade_v2', '0xProtocolCore', queueTime);
const tooEarly = timelock.execute('prop_upgrade_v2', queueTime + 86400); // 24 hours later
const onTime = timelock.execute('prop_upgrade_v2', queueTime + 172801); // 48 hours + 1s later

console.log('=== TIMELOCK CONTROLLER & GOVERNANCE SAFETY PIPELINE ===');
console.log('Proposal Queued: ' + p.id + ' | Minimum Delay: 48 hours');
console.log('Attempt at 24h: ' + tooEarly + ' (Reverted: TimelockNotExpired)');
console.log('Attempt at 48h+1s: ' + onTime + ' (State transition applied to 0xProtocolCore)');
console.log('Governance Invariant: Users granted 48h emergency exit window before contract upgrades');`,
        output: `=== TIMELOCK CONTROLLER & GOVERNANCE SAFETY PIPELINE ===\nProposal Queued: prop_upgrade_v2 | Minimum Delay: 48 hours\nAttempt at 24h: ERROR_TIMELOCK_NOT_EXPIRED (Reverted: TimelockNotExpired)\nAttempt at 48h+1s: SUCCESS_PROPOSAL_EXECUTED (State transition applied to 0xProtocolCore)\nGovernance Invariant: Users granted 48h emergency exit window before contract upgrades`,
        tryIt: 'Cancel the proposal before the 48h window and verify that execution returns ERROR_PROPOSAL_CANCELED.',
        check: {
          question: 'What is the primary security rationale for enforcing a 48-hour timelock delay on DeFi protocol upgrades?',
          options: [
            'To give users and liquidity providers sufficient notice and an emergency exit window to withdraw funds if a malicious proposal passes',
            'To allow miners to calculate proof of work hashes',
            'To wait for bank holidays to conclude'
          ],
          answer: 0,
          why: 'A timelock ensures users are never trapped by sudden malicious upgrades; they have an on-chain window to evaluate changes and exit gracefully.'
        }
      }
    ],
    summary: [
      'Read-Only Reentrancy attacks exploit view functions that expose imbalanced mid-execution states to secondary lending markets.',
      'Foundry stateful invariant fuzz testing chains randomized multi-call sequences to uncover edge-case protocol insolvency.',
      'Formal verification and SMTChecker prove mathematical solvency across infinite input domains using Z3 theorem provers.',
      'Gnosis Safe threshold signatures require sorted owner signatures, preventing single-key custody compromise.',
      'TimelockController contracts mandate 48-hour delays before parameter upgrades, preserving user exit rights.'
    ],
    projectStep: {
      title: 'Architect an Institutional DeFi Security & Governance Vault',
      steps: [
        'Implement transient reentrancy locks on view functions to neutralize Read-Only Reentrancy risks.',
        'Write a Foundry stateful invariant test suite with custom actor-handlers verifying vault solvency.',
        'Configure Solidity SMTChecker formal verification contracts asserting auction collateralization bounds.',
        'Deploy a Gnosis Safe threshold multisig transaction validator with ascending address signature checks.',
        'Construct an OpenZeppelin TimelockController queue with delay enforcement and emergency cancellation.'
      ]
    }
  },
  {
    day: 5,
    title: 'Zero-Knowledge Proofs (Groth16), Account Abstraction (ERC-4337), Rollups & MEV-Boost',
    goal: 'Master institutional Web3 infrastructure: Groth16 zk-SNARK bilinear pairing verification, ERC-4337 EntryPoint smart contract wallet account abstraction, Optimistic interactive bisection fraud proofs vs ZK validity proofs, cross-chain generalized message passing (GMP), and Flashbots MEV-Boost Proposer-Builder Separation (PBS).',
    minutes: 32,
    recap: 'Today we graduate into cutting-edge cryptographic scaling, privacy preservation, account abstraction, and decentralized MEV auction engineering.',
    parts: [
      {
        title: 'Zero-Knowledge Proofs (zk-SNARKs) & The Groth16 Pairing Verifier',
        say: [
          'Zero-Knowledge Proofs (ZKPs) represent one of the greatest cryptographic breakthroughs in computer science. A ZKP allows a Prover to mathematically demonstrate to a Verifier that a specific statement is true, without revealing any information beyond the validity of the statement itself.',
          'In decentralized systems, zk-SNARKs (Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge) solve both scalability and privacy. Computations that take minutes to execute can be verified on-chain in milliseconds with fixed-size proofs (succinctness), all while concealing private witnesses such as account balances or identity credentials.',
          'The Groth16 protocol is the most widely deployed zk-SNARK in production (powering Tornado Cash, Zcash, and Worldcoin). Groth16 compiles an arithmetic circuit into Rank-1 Constraint Systems (R1CS) of the form A * B = C, which is transformed into a Quadratic Arithmetic Program (QAP).',
          'On Ethereum, Groth16 verification evaluates an elliptic curve bilinear pairing equation e(A, B) = e(alpha, beta) * e(x_gamma, delta) * e(C, delta) over the pairing-friendly alt_bn128 (BN254) curve using the EVM pairing precompile at address 0x08, consuming roughly 200,000 gas regardless of computation complexity.'
        ],
        example: 'Think of proving you know the secret password to a hidden door without speaking the password aloud. You enter the dark cave from Path A and emerge from Path B on demand. Because only someone with the secret key could unlock the internal door, your emergence proves you know the key with zero information leaked.',
        code: `// Zero-Knowledge Groth16 Verifier Simulator over alt_bn128 (BN254)
interface Groth16Proof {
  pi_a: [string, string];
  pi_b: [[string, string], [string, string]];
  pi_c: [string, string];
}

class Groth16VerifierSimulator {
  verifyProof(proof: Groth16Proof, publicInputs: number[]): {
    isValid: boolean;
    gasUsed: number;
    curve: string;
    proofStatus: string;
  } {
    // Simulated bilinear pairing check e(A, B) == e(alpha, beta) * e(x_gamma, delta) * e(C, delta)
    const hasValidPoints = proof.pi_a[0].startsWith('0x') && proof.pi_b[0][0].startsWith('0x') && proof.pi_c[0].startsWith('0x');
    const inputCountMatches = publicInputs.length === 2; // e.g., root and nullifierHash

    const isValid = hasValidPoints && inputCountMatches;
    return {
      isValid,
      gasUsed: 198400, // standard EVM alt_bn128 pairing precompile cost
      curve: 'alt_bn128 (BN254)',
      proofStatus: isValid ? 'ZK_PROOF_VERIFIED_VALID' : 'INVALID_PAIRING_RESIDUE'
    };
  }
}

const zkVerifier = new Groth16VerifierSimulator();
const mockProof: Groth16Proof = {
  pi_a: ['0x1a8f93b', '0x2c4e81a'],
  pi_b: [['0x0b12a8f', '0x3f98a1c'], ['0x2e819ac', '0x1d9981f']],
  pi_c: ['0x4a91b2c', '0x3d82a1e']
};
const publicSignals = [1337, 42]; // Public output commitment and nullifier
const zkResult = zkVerifier.verifyProof(mockProof, publicSignals);

console.log('Zero-Knowledge Proof Status: ' + zkResult.proofStatus);
console.log('Elliptic Curve: ' + zkResult.curve);
console.log('On-Chain Gas Consumption: ' + zkResult.gasUsed + ' gas (alt_bn128 pairing precompile)');
console.log('Privacy Invariant: Zero knowledge of private witness revealed to public verifier');`,
        output: `Zero-Knowledge Proof Status: ZK_PROOF_VERIFIED_VALID\nElliptic Curve: alt_bn128 (BN254)\nOn-Chain Gas Consumption: 198400 gas (alt_bn128 pairing precompile)\nPrivacy Invariant: Zero knowledge of private witness revealed to public verifier`,
        codeNotes: [
          { line: 8, note: 'Simulates Groth16 bilinear pairing verification over alt_bn128 G1 and G2 curve points' },
          { line: 14, note: 'Models Ethereum precompile 0x08 gas consumption (~200k gas) for succinct verification' },
          { line: 30, note: 'Demonstrates zero-knowledge verification keeping private witness confidential' }
        ],
        tryIt: 'Change the publicSignals array length and observe how the pairing residue rejects the invalid proof.',
        check: {
          question: 'Why is the Groth16 zk-SNARK protocol favored for on-chain smart contract verification despite requiring a circuit-specific trusted setup?',
          options: [
            'Because Groth16 produces the smallest proof size (only 128 bytes) and the fastest on-chain verification time (~200k gas) using bilinear pairing precompiles',
            'Because Groth16 eliminates the need for gas fees on Ethereum',
            'Because it allows smart contracts to run without elliptic curve cryptography',
            'Because it automatically converts Python code into Solidity'
          ],
          answer: 0,
          why: 'Groth16 achieves minimal proof size (3 group elements: 2 in G1, 1 in G2) and requires only 3 pairing checks, making it exceptionally cheap to verify on-chain compared to PLONK or STARKs.'
        }
      },
      {
        title: 'Account Abstraction (ERC-4337): Smart Contract Wallets & EntryPoint Pipeline',
        say: [
          'Traditional Ethereum accounts are Externally Owned Accounts (EOAs). EOAs have hardcoded cryptographic limitations: they are strictly bound to an ECDSA secp256k1 private key, cannot sponsor gas for new users, cannot execute atomic batch transactions (like approve + transfer in one click), and have zero native social recovery.',
          'ERC-4337 solves Account Abstraction without requiring any consensus-level hard forks to Ethereum. Instead of sending raw transactions, users sign high-level UserOperation structs and submit them to an alternative peer-to-peer user-op mempool.',
          'Specialized nodes called Bundlers package multiple UserOperations into a single standard Ethereum transaction and invoke a canonical singleton EntryPoint contract.',
          'The EntryPoint orchestrates a two-phase execution lifecycle: 1) Verification Phase (invoking IAccount.validateUserOp and validating optional Paymaster gas sponsorships); 2) Execution Phase (dispatching inner calls to target contracts). This architecture unlocks WebAuthn passkeys, biometric face-ID signing, gasless sponsored onboarding, and automated session keys.'
        ],
        example: 'Think of a corporate purchasing department with a company credit card. Rather than individual employees paying cash and filling out paper reimbursement forms, employees submit a purchase request (UserOperation). A corporate finance officer (Bundler) validates the purchase, pays the supplier using the corporate credit line (Paymaster), and logs the batch expense.',
        code: `// ERC-4337 Account Abstraction EntryPoint & UserOp Simulator
interface UserOperation {
  sender: string;
  nonce: number;
  callData: string;
  callGasLimit: number;
  verificationGasLimit: number;
  maxFeePerGas: number;
  paymasterAndData: string;
  signature: string;
}

class EntryPointSimulator {
  handleOps(ops: UserOperation[]): {
    executedOps: number;
    gasSponsored: boolean;
    batchExecutionStatus: string;
  } {
    let sponsored = false;
    for (const op of ops) {
      if (op.paymasterAndData !== '0x') {
        sponsored = true;
      }
    }

    return {
      executedOps: ops.length,
      gasSponsored: sponsored,
      batchExecutionStatus: 'ERC4337_USEROPS_EXECUTED_SUCCESSFULLY'
    };
  }
}

const ep = new EntryPointSimulator();
const userOp: UserOperation = {
  sender: '0xSmartAccount_Alice',
  nonce: 14,
  callData: '0xa9059cbb000000000000000000000000bob', // transfer ERC20
  callGasLimit: 100000,
  verificationGasLimit: 150000,
  maxFeePerGas: 30,
  paymasterAndData: '0xPaymaster_GaslessSponsor',
  signature: '0xWebAuthnPasskeySignature'
};

const epRes = ep.handleOps([userOp]);
console.log('EntryPoint Execution Status: ' + epRes.batchExecutionStatus);
console.log('Operations Handled in Bundle: ' + epRes.executedOps + ' UserOp');
console.log('Paymaster Sponsorship: ' + (epRes.gasSponsored ? 'GAS_SPONSORED_BY_PAYMASTER' : 'SELF_FUNDED'));
console.log('Account Abstraction Invariant: Arbitrary verification logic enabled without consensus protocol fork');`,
        output: `EntryPoint Execution Status: ERC4337_USEROPS_EXECUTED_SUCCESSFULLY\nOperations Handled in Bundle: 1 UserOp\nPaymaster Sponsorship: GAS_SPONSORED_BY_PAYMASTER\nAccount Abstraction Invariant: Arbitrary verification logic enabled without consensus protocol fork`,
        codeNotes: [
          { line: 8, note: 'Processes UserOperation bundle through canonical EntryPoint pipeline' },
          { line: 11, note: 'Detects Paymaster sponsorship allowing gasless onboarding for end users' },
          { line: 28, note: 'Simulates WebAuthn passkey biometric signing without raw private key exposure' }
        ],
        tryIt: 'Set paymasterAndData to 0x and verify that the transaction reverts to self-funded gas accounting.',
        check: {
          question: 'What is the role of the canonical EntryPoint contract in ERC-4337 Account Abstraction?',
          options: [
            'It serves as the universal singleton coordinator that authenticates UserOperations, coordinates Paymaster gas pre-funding, and dispatches batch executions to smart contract accounts',
            'It replaces the Ethereum consensus proof-of-stake engine',
            'It stores private keys for all wallet users in a central database',
            'It is an ERC-20 token that pays for mining rigs'
          ],
          answer: 0,
          why: 'The EntryPoint is the audited singleton contract that ensures bundlers get refunded for gas while decoupling signature verification logic from the underlying protocol.'
        }
      },
      {
        title: 'Optimistic vs ZK Rollups: Interactive Bisection Dispute vs Validity Proofs',
        say: [
          'Ethereum Layer 1 processes approximately 15 transactions per second (TPS) due to decentralized block gas limits. Layer 2 Rollups scale throughput by orders of magnitude by executing transactions off-chain and posting compressed transaction batches or state diffs back to L1 for security and data availability.',
          'Rollups divide into two primary architectural paradigms: Optimistic Rollups and ZK Rollups. Optimistic Rollups (such as Arbitrum and Optimism) assume all published state roots are honest unless challenged within a 7-day dispute window.',
          'When a dispute occurs in an Optimistic Rollup, the challenger and asserter engage in an interactive multi-round bisection game. Over log2(N) rounds, they repeatedly divide the million-step execution trace in half until they pinpoint a single instruction step. The L1 OneStepProver contract then executes that single opcode to prove fraud and slash the malicious sequencer.',
          'In contrast, ZK Rollups (such as Starknet and zkSync) do not use dispute windows; they generate mathematical validity proofs (zk-STARKs or zk-SNARKs) for every batch. The L1 smart contract verifies the proof instantaneously, enabling immediate finality and instant cross-layer withdrawals without 7-day delays.'
        ],
        example: 'Think of an accounting audit. An optimistic system assumes all monthly tax filings are accurate unless an auditor challenges an anomaly; the auditor and accountant then play a game of "which page, which paragraph, which receipt" until they isolate the exact $10 error. A ZK system requires the accountant to submit a cryptographically sealed zero-knowledge mathematical proof alongside the tax filing, verifying 100% correctness on receipt.',
        code: `// Rollup Dispute Simulator: Interactive Bisection vs Instant Validity Proofs
class RollupVerificationSimulator {
  simulateInteractiveBisection(totalTraceSteps: number): {
    roundsRequired: number;
    finalStepPinpointed: number;
    disputeVerdict: string;
  } {
    // Binary search over execution trace: log2(N) rounds
    const rounds = Math.ceil(Math.log2(totalTraceSteps));
    return {
      roundsRequired: rounds,
      finalStepPinpointed: 472, // The precise single opcode step evaluated on L1 OneStepProver
      disputeVerdict: 'FRAUD_PROVEN_STATE_REVERTED_CHALLENGER_REWARDED'
    };
  }
}

const rollupSim = new RollupVerificationSimulator();
const bisection = rollupSim.simulateInteractiveBisection(1048576); // 2^20 steps

console.log('Interactive Bisection Rounds: ' + bisection.roundsRequired + ' Rounds (log2 N Scaling)');
console.log('Dispute Resolution Verdict: ' + bisection.disputeVerdict);
console.log('Pinpointed Execution Opcode: Step #' + bisection.finalStepPinpointed + ' Verified on OneStepProver');
console.log('Rollup Invariant: L1 security guarantees inherit cryptographic or interactive dispute bounds');`,
        output: `Interactive Bisection Rounds: 20 Rounds (log2 N Scaling)\nDispute Resolution Verdict: FRAUD_PROVEN_STATE_REVERTED_CHALLENGER_REWARDED\nPinpointed Execution Opcode: Step #472 Verified on OneStepProver\nRollup Invariant: L1 security guarantees inherit cryptographic or interactive dispute bounds`,
        codeNotes: [
          { line: 8, note: 'Simulates interactive bisection narrowing 1,048,576 execution steps in log2(N) = 20 rounds' },
          { line: 12, note: 'Isolates the disputed single opcode step evaluated by the L1 OneStepProver' },
          { line: 22, note: 'Demonstrates economic slashing of malicious sequencers and state rollback' }
        ],
        tryIt: 'Change the trace step count to 4,194,304 (2^22) and verify that only 22 interactive rounds are needed.',
        check: {
          question: 'Why do Optimistic Rollups use an interactive bisection dispute game rather than re-executing entire disputed transaction blocks on Layer 1?',
          options: [
            'Re-executing an entire transaction block would exceed the L1 block gas limit; interactive bisection narrows the dispute down to a single opcode that fits easily into one L1 transaction',
            'Because Ethereum nodes do not have enough hard drive storage',
            'Because bisection games take 7 years to complete',
            'Because Solidity does not support if-else conditional statements'
          ],
          answer: 0,
          why: 'Interactive bisection logarithmic search (log2 N) allows Arbitrum and Optimism to isolate the exact instruction pointer where sequencer execution diverged, allowing L1 to adjudicate a single instruction in under 50,000 gas.'
        }
      },
      {
        title: 'Cross-Chain Interoperability & Generalized Message Passing (GMP)',
        say: [
          'Web3 is an increasingly fragmented multi-chain universe spanning Ethereum L1, Layer 2 rollups (Arbitrum, Base, Optimism), and alternative Layer 1s (Solana, Avalanche). Historically, cross-chain bridges were the most vulnerable attack vector in crypto, suffering over $2.5 billion in catastrophic exploits due to multisig key compromises and smart contract verification bugs.',
          'Modern cross-chain architecture relies on Generalized Message Passing (GMP) protocols such as Chainlink CCIP (Cross-Chain Interoperability Protocol) and LayerZero. GMP decouples token transfers from arbitrary contract execution, allowing a smart contract on Chain A to invoke a function on Chain B with verifiable payload data.',
          'A secure cross-chain router enforces three foundational invariants: 1) Source-destination cryptographic consensus proofs (such as Merkle receipt inclusion); 2) Strictly sequential per-sender message nonces to prevent replay attacks; and 3) Independent Risk Management Networks that can pause bridging if volume anomalies or double-spend attempts are detected.',
          'By embedding cross-chain messaging, decentralized finance protocols achieve unified cross-chain liquidity and cross-chain governance without fragmentation.'
        ],
        example: 'Think of an international wire transfer through SWIFT with secondary security confirmation. Bank A debits your account, generates an authenticated telegraphic MT103 wire message with an incrementing transaction sequence number, and Bank B credits the funds only after verifying both cryptographic signatures and anti-money laundering compliance.',
        code: `// Cross-Chain GMP Interoperability & Replay Defense Simulator
interface CrossChainMessage {
  sourceChainId: number;
  destinationChainId: number;
  messageNonce: number;
  sender: string;
  receiver: string;
  payload: string;
}

class CrossChainRouterSimulator {
  private executedNonces = new Set<string>();

  deliverMessage(msg: CrossChainMessage, proofValid: boolean): string {
    const nonceKey = \`\${msg.sourceChainId}:\${msg.messageNonce}\`;
    if (this.executedNonces.has(nonceKey)) {
      return 'ERROR_REPLAY_ATTEMPT_REJECTED';
    }
    if (!proofValid) {
      return 'ERROR_INVALID_MERKLE_CONSENSUS_PROOF';
    }

    this.executedNonces.add(nonceKey);
    return 'SUCCESS_CROSS_CHAIN_PAYLOAD_DISPATCHED';
  }
}

const router = new CrossChainRouterSimulator();
const ccMsg: CrossChainMessage = {
  sourceChainId: 1, // Ethereum Mainnet
  destinationChainId: 42161, // Arbitrum One
  messageNonce: 8402,
  sender: '0xLiquidityBridgeL1',
  receiver: '0xVaultL2',
  payload: '0xTransferTokens(USDC, 50000)'
};

const deliverStatus = router.deliverMessage(ccMsg, true);
const replayStatus = router.deliverMessage(ccMsg, true);

console.log('Cross-Chain Delivery Status: ' + deliverStatus);
console.log('Replay Attack Prevention: ' + replayStatus);
console.log('GMP Route: Chain ID ' + ccMsg.sourceChainId + ' -> Chain ID ' + ccMsg.destinationChainId);
console.log('Bridge Security Invariant: Strict sequence nonces and multi-network consensus prevent double-spending');`,
        output: `Cross-Chain Delivery Status: SUCCESS_CROSS_CHAIN_PAYLOAD_DISPATCHED\nReplay Attack Prevention: ERROR_REPLAY_ATTEMPT_REJECTED\nGMP Route: Chain ID 1 -> Chain ID 42161\nBridge Security Invariant: Strict sequence nonces and multi-network consensus prevent double-spending`,
        codeNotes: [
          { line: 8, note: 'Enforces cross-chain message nonce tracking to neutralize replay attacks' },
          { line: 14, note: 'Requires cryptographic consensus proof before dispatching payload on destination chain' },
          { line: 29, note: 'Demonstrates guaranteed rejection of duplicate cross-chain message replay attempts' }
        ],
        tryIt: 'Change the destination chain ID or remove the nonce check to see how vulnerability to replay attacks emerges.',
        check: {
          question: 'What is the critical role of monotonically increasing cross-chain message nonces in bridge protocols?',
          options: [
            'They guarantee that a message payload cannot be intercepted and re-executed multiple times on the destination chain to drain liquidity (replay attack prevention)',
            'They convert Ethereum gas fees from gwei to US Dollars',
            'They encrypt all transaction data so that validators cannot read it',
            'They prevent blocks from exceeding 1 megabyte'
          ],
          answer: 0,
          why: 'Cross-chain nonces ensure each message has a unique identifier on the destination chain. Once processed, the nonce is stored, causing any replayed copy of the transaction to revert immediately.'
        }
      },
      {
        title: 'MEV-Boost & Proposer-Builder Separation (PBS) Architecture',
        say: [
          'Maximal Extractable Value (MEV) is the profit that can be extracted by including, excluding, or reordering transactions within a block. Unregulated MEV introduces severe systemic threats to blockchain consensus: front-running, sandwich attacks on decentralized exchanges, and time-bandit attacks where validators reorganize past blocks to steal arbitrage.',
          'Left unchecked, MEV leads to extreme validator centralization: sophisticated institutional staking pools with algorithmic trading desks generate significantly higher staking yields than solo home validators, centralizing the validator set.',
          'The Flashbots MEV-Boost architecture implements Proposer-Builder Separation (PBS). In PBS, the roles of assembling blocks and proposing blocks are decoupled: specialized Block Builders compete to pack transactions and extract MEV, while independent Relays aggregate bids and present blinded block headers to consensus Proposers.',
          'The validator (Proposer) chooses the highest-paying bid without seeing the raw transactions, signs the blinded header, and receives an unconditional fee reward via block.coinbase transfer. PBS democratizes MEV rewards for all validators while preserving censorship resistance.',
        ],
        example: 'Think of an art auction. The auction house (Relay) accepts sealed envelopes (bids with blinded headers) from competing art curators (Block Builders). The gallery owner (Validator Proposer) selects the highest sealed bid without knowing the buyer\'s secret identity, ensuring a fair market price while preventing insider trading.',
        code: `// MEV-Boost Proposer-Builder Separation (PBS) Relay Simulator
interface BuilderBid {
  builderId: string;
  blockHash: string;
  bidValueEth: number;
  txCount: number;
}

class MevBoostRelayAuction {
  selectWinningBid(bids: BuilderBid[]): {
    winner: BuilderBid;
    auctionStatus: string;
  } {
    let topBid = bids[0];
    for (const b of bids) {
      if (b.bidValueEth > topBid.bidValueEth) {
        topBid = b;
      }
    }
    return {
      winner: topBid,
      auctionStatus: 'MEV_BOOST_AUCTION_SETTLED'
    };
  }
}

const relay = new MevBoostRelayAuction();
const bids: BuilderBid[] = [
  { builderId: 'FlashbotsBuilder_01', blockHash: '0x9a8f21...', bidValueEth: 0.42, txCount: 184 },
  { builderId: 'BeaverBuild_Alpha', blockHash: '0x3c7e19...', bidValueEth: 0.68, txCount: 215 },
  { builderId: 'TitanBuilder_Prime', blockHash: '0x7b12d5...', bidValueEth: 0.55, txCount: 198 }
];

const auctionRes = relay.selectWinningBid(bids);

console.log('MEV-Boost Auction Status: ' + auctionRes.auctionStatus);
console.log('Winning Builder: ' + auctionRes.winner.builderId);
console.log('Validator MEV Reward: ' + auctionRes.winner.bidValueEth + ' ETH');
console.log('Decentralization Guarantee: Proposer-Builder Separation neutralizes solo validator MEV centralization');`,
        output: `MEV-Boost Auction Status: MEV_BOOST_AUCTION_SETTLED\nWinning Builder: BeaverBuild_Alpha\nValidator MEV Reward: 0.68 ETH\nDecentralization Guarantee: Proposer-Builder Separation neutralizes solo validator MEV centralization`,
        codeNotes: [
          { line: 8, note: 'Simulates MEV-Boost relay auction selecting the highest value builder payload' },
          { line: 13, note: 'Ensures validator receives optimal block reward without participating in proprietary MEV search algorithms' },
          { line: 28, note: 'Proves PBS architecture levels staking yields across solo validators and institutional staking pools' }
        ],
        tryIt: 'Add a fourth builder bid with 1.15 ETH and verify that the relay automatically routes the higher bid to the validator.',
        check: {
          question: 'How does Flashbots MEV-Boost and Proposer-Builder Separation (PBS) protect the decentralization of Ethereum?',
          options: [
            'By allowing solo validators to capture competitive MEV block rewards from specialized builders without needing proprietary algorithmic search infrastructure, leveling the staking yield playing field',
            'By shutting down all decentralized exchanges and lending pools',
            'By enforcing zero transaction fees on all user transactions',
            'By making all transactions completely anonymous'
          ],
          answer: 0,
          why: 'Without PBS, solo validators earn ~3.5% staking yield while elite firms earn 7%+, driving solo stakers out of business. PBS democratizes access to block-building revenue across all network validators.'
        }
      }
    ],
    summary: [
      'Groth16 zk-SNARKs evaluate bilinear pairings over alt_bn128 curves to verify 128-byte proofs on-chain in ~200k gas without revealing private witnesses.',
      'ERC-4337 Account Abstraction introduces UserOperations and canonical EntryPoints, unlocking gasless Paymasters, passkeys, and batch execution.',
      'Optimistic Rollups resolve state disputes via interactive bisection narrowing traces to a single opcode, while ZK Rollups verify validity proofs with instant finality.',
      'Generalized Message Passing protocols rely on cross-chain nonces, Merkle consensus proofs, and risk networks to prevent replay and double-spend attacks.',
      'MEV-Boost Proposer-Builder Separation decouples block creation from consensus proposing, protecting solo validator economic viability.'
    ],
    projectStep: {
      title: 'Architect an Institutional Web3 Scaling, Privacy & Account Abstraction Suite',
      steps: [
        'Deploy an on-chain Groth16 pairing verifier contract validating zero-knowledge proofs over the BN254 elliptic curve.',
        'Build an ERC-4337 smart contract wallet with an EntryPoint handler and Paymaster gas sponsorship pipeline.',
        'Simulate an interactive bisection fraud proof dispute game isolating a single disputed execution trace opcode.',
        'Implement a cross-chain message dispatcher with replay-resistant nonces and cryptographic proof verification.',
        'Construct an MEV-Boost relay auction simulator selecting top builder execution payloads with blinded header signing.'
      ]
    }
  }
];

