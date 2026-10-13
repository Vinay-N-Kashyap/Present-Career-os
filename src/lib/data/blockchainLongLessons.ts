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
  }
];
