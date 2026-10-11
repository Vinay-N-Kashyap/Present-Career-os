// scripts/visuals/blockchain-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Blockchain, Web3 & Smart Contracts (course-blockchain-web3)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, EVM Architecture, Solidity 0.8.20+, Foundry, ERC Standards, DeFi AMMs, Layer 2 Rollups, Zero-Knowledge Proofs, and ERC-4337 Account Abstraction.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const BLOCKCHAIN_MONTH_1_SPECS: MasterclassDaySpec[] = [
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "Cryptographic Primitives: SHA-256, Keccak-256, Collision Resistance & Pre-Image Security",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Cryptographic Foundations (One-Way Hash Functions & Avalanche Physics)",
    "spokenGoal": "Welcome to the immutable world of distributed ledgers and trust-minimized computing. Before writing a single line of Solidity, you must understand the mathematical bedrock of blockchain security: Cryptographic Hash Functions. Analyze SHA-256 (the workhorse of Bitcoin) and Keccak-256 (the hashing standard of Ethereum). Deconstruct the three essential security guarantees: Pre-Image Resistance (one-way computation: given y, finding x such that H(x) = y requires O(2^256) brute force), Second Pre-Image Resistance, and Collision Resistance (finding any two distinct inputs producing the same digest requires O(2^128) via the Birthday Paradox). Inspect the Avalanche Effect: changing a single bit in a 1MB payload flips ~50% of the output bits chaotically.",
    "conceptInvariant": "One-Way Avalanche Invariant: A cryptographic hash function H(m) maps an arbitrary-length message to a fixed 256-bit digest such that finding any pre-image is computationally intractable, and any single-bit input alteration produces an entirely uncorrelated, uniformly distributed output digest.",
    "failureMode": "Using non-cryptographic hash algorithms (like CRC32 or MurmurHash) for block hashes or transaction identifiers; attackers easily engineer hash collisions in milliseconds, rewriting transaction histories without altering block digests.",
    "tryItFriction": "Implement SHA-256 compression rounds in TypeScript from scratch: initialize round constants K[0..63]; process 512-bit message chunks; evaluate message schedules, bitwise rotations (ROTR), shifts (SHR), and Ch/Maj functions; and prove the avalanche effect by flipping bit 0 of the input string.",
    "socraticHints": [
      "Why did Ethereum adopt Keccak-256 instead of the finalized NIST SHA-3 standard?",
      "Because Ethereum was developed when SHA-3 was still being standardized! NIST made minor padding alterations (0x06 vs 0x01) to Keccak before finalizing SHA-3. Ethereum kept the original Keccak-256 padding, which is why Solidity's 'keccak256()' produces different digests from standard SHA-3 libraries!",
      "Always use keccak256 when computing Ethereum transaction hashes and storage slots."
    ],
    "situationalPuzzle": {
      "scenario": "A smart contract developer attempts to generate random lottery winners on-chain using: 'uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)))'. In production, a miner / validator repeatedly wins the jackpot. How did the miner exploit this hash function?",
      "options": [
        "Keccak-256 has a known mathematical collision flaw.",
        "Predictable Pseudorandom Seed Manipulation: Hash functions are strictly deterministic! All three inputs (block.timestamp, prevrandao, msg.sender) are known or manipulable by the block validator before proposing the block. A validator can simulate the lottery hash locally; if they don't win, they discard the block or withhold the transaction, mining only winning blocks.",
        "The modulo operator inverted the hash.",
        "Solidity does not support 256-bit hashes."
      ],
      "answerIdx": 1,
      "debrief": "Deterministic cryptographic hashes cannot produce on-chain randomness from public blockchain state. Because validators control timestamp offsets and block inclusion order, they can pre-calculate hashes and censor losing blocks. Production randomness requires verifiable delay functions or cryptographic commit-reveal oracles like Chainlink VRF."
    },
    "quests": [
      {
        "id": "bc-m1-d01-q1",
        "name": "Cryptographic Hash Security & Birthday Paradox Mathematics",
        "type": "concept",
        "desc": "Derive the mathematical proof showing why 256-bit hash functions require 2^128 evaluations to find a collision via the Birthday Paradox."
      },
      {
        "id": "bc-m1-d01-q2",
        "name": "Avalanche Effect Bit-Flip Statistical Analyzer",
        "type": "detective",
        "desc": "Build a benchmarking script measuring the Hamming distance across 10,000 Keccak-256 digests following single-bit input mutations."
      },
      {
        "id": "bc-m1-d01-q3",
        "name": "Pure TypeScript SHA-256 & Keccak-256 Engine",
        "type": "mastery",
        "desc": "Implement a zero-dependency cryptographic hashing module in TypeScript verifying correct digests against official NIST and Ethereum test vectors."
      },
      {
        "id": "bc-m1-d01-q4",
        "name": "3 AM SRE: On-Chain Casino Drained by Hash Seed Exploitation",
        "type": "incident",
        "desc": "Triage a high-severity smart contract incident where an on-chain gaming protocol was drained of $2.4M due to block-variable hash seed manipulation."
      }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "Elliptic Curve Cryptography: Secp256k1, Public Key Derivation & ECDSA Signature Malleability",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Asymmetric Cryptography (Public-Private Key Math & Digital Signatures)",
    "spokenGoal": "Uncover how digital ownership and non-repudiation are enforced without central authorities: Elliptic Curve Cryptography (ECC). Examine the Koblitz curve Secp256k1 (y^2 = x^3 + 7 over finite field F_p). Trace how a 256-bit private key (random scalar k) derives an unforgeable public key point Q = k &times; G via elliptic curve point multiplication. Deep-dive into ECDSA (Elliptic Curve Digital Signature Algorithm): signing messages with ephemeral nonce r, producing signature tuple (r, s, v). Confront the notorious danger of Signature Malleability: why for any valid signature (r, s), the tuple (r, -s mod n) is also mathematically valid! Understand how Ethereum eliminates malleability via EIP-2 by requiring s &le; n/2.",
    "conceptInvariant": "Discrete Logarithm Hardness Invariant: Given curve generator point G and public key Q = k &times; G, computing private key k requires solving the Elliptic Curve Discrete Logarithm Problem (ECDLP), which requires O(sqrt(n)) &approx; 2^128 operations, rendering private key recovery computationally impossible.",
    "failureMode": "Reusing the same ephemeral nonce k across two distinct ECDSA signatures; any observer can compute the private key algebraically using simple modular arithmetic in 3 lines of code, completely compromising the wallet.",
    "tryItFriction": "Derive an Ethereum address from a raw private key in TypeScript: compute public key point Q via secp256k1 scalar multiplication; compute Keccak-256 of the uncompressed public key (excluding 0x04 prefix); extract the last 20 bytes; format as checksummed hex (EIP-55); and sign a message verifying ecrecover recovers the exact address.",
    "socraticHints": [
      "Why does Ethereum append the recovery parameter 'v' (27 or 28) to the signature (r, s)?",
      "Because on an elliptic curve, for a given x-coordinate 'r', there are two symmetric points (&plusmn;y) that could have generated it! The parameter 'v' encodes which of the two curve points was used, allowing 'ecrecover' to recover the exact public key without brute-forcing both possibilities!",
      "In modern EIP-155 transactions, 'v' also embeds the chainId to prevent cross-chain replay attacks."
    ],
    "situationalPuzzle": {
      "scenario": "A DeFi exchange tracks processed withdrawals using 'keccak256(signature)' to prevent duplicate payouts. An attacker intercepts a valid user withdrawal signature (r, s, v), computes (r, -s mod n, v ^ 1), and submits the altered signature. The exchange contract accepts the signature as valid and pays out a second withdrawal! What vulnerability did the exchange suffer from?",
      "options": [
        "The private key was leaked.",
        "Signature Malleability Exploitation: Because the curve is symmetric, both s and -s mod n are valid signatures for the exact same message! The malleable signature had a different hash, bypassing the duplicate hash filter! The contract must enforce EIP-2 (s &le; n/2) or use OpenZeppelin's ECDSA library, and track nonces or message hashes rather than signature byte hashes.",
        "The exchange ran out of gas.",
        "Secp256k1 does not support negative numbers."
      ],
      "answerIdx": 1,
      "debrief": "Signature malleability allows an attacker to alter the byte representation of a valid signature without invalidating its mathematical correctness. If a protocol uses signature hashes as unique request identifiers, an attacker can replay transactions under different signature hashes. Protocols must enforce lower-s bounds (s &le; n/2) and track signed nonces."
    },
    "quests": [
      {
        "id": "bc-m1-d02-q1",
        "name": "Secp256k1 Point Addition & Scalar Multiplication Algebra",
        "type": "concept",
        "desc": "Formulate the algebraic equations for point addition (P + Q) and point doubling (2P) over the finite field F_p for curve y^2 = x^3 + 7."
      },
      {
        "id": "bc-m1-d02-q2",
        "name": "ECDSA Nonce Reuse Private Key Extraction Tool",
        "type": "detective",
        "desc": "Build a script demonstrating private key extraction from two ECDSA signatures signed with an identical ephemeral nonce k."
      },
      {
        "id": "bc-m1-d02-q3",
        "name": "EIP-55 Checksum Address Generator & Signature Engine",
        "type": "mastery",
        "desc": "Implement a TypeScript module that derives public keys from private scalars, formats EIP-55 checksum addresses, and signs/recovers messages."
      },
      {
        "id": "bc-m1-d02-q4",
        "name": "3 AM SRE: Multi-Million Dollar Bridge Drain via Malleable Signatures",
        "type": "incident",
        "desc": "Triage and patch a production cross-chain bridge vulnerability where malleable ECDSA signatures enabled double-spending of deposit claims."
      }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "Merkle Trees & Cryptographic Proofs: Binary Trees, Inclusion Proofs & SPV Verification",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Data Integrity Architectures (Merkle Trees, Hashes & Proof Paths)",
    "spokenGoal": "Discover how light clients, Layer 2 rollups, and smart contracts verify membership across millions of records with minimal memory: Merkle Trees. Understand how a Merkle Tree organizes leaves (hashes of transactions, balances, or whitelist addresses) into a balanced binary tree, hashing child pairs (H(L . R)) up to a single 32-byte Merkle Root. Master Merkle Inclusion Proofs: prove that leaf X exists in a tree of 1,000,000 elements by providing only log2(N) &approx; 20 sibling hashes (an 'authentication path'). Understand how Simplified Payment Verification (SPV) clients in Bitcoin and airdrop distribution contracts in Ethereum verify cryptographic inclusion in O(log N) time and space.",
    "conceptInvariant": "Logarithmic Cryptographic Commitment Invariant: A Merkle root commits immutably to an ordered set of N elements; any single leaf alteration propagates up the tree to change the root, while proof of leaf inclusion requires exactly &lceil;log2(N)&rceil; 32-byte sibling hashes.",
    "failureMode": "Concatenating sibling nodes in arbitrary order when hashing (e.g. H(A . B) instead of sorting pairs H(min(A,B) . max(A,B))); an attacker presents proof with reversed sibling positions, causing verification to fail or enabling second pre-image attacks.",
    "tryItFriction": "Construct a Merkle Tree in TypeScript for a 10,000-address whitelist: generate leaf hashes using keccak256(abi.encodePacked(address, amount)); build binary layers with sorted sibling pairs; generate a 14-hash proof for an arbitrary leaf; and verify the proof in a mock Solidity contract using OpenZeppelin MerkleProof.verify().",
    "socraticHints": [
      "Why should leaf nodes in a Merkle tree be sorted pairwise before hashing (min(a, b) followed by max(a, b))?",
      "Because sorting ensures that the order of presentation in the proof doesn't matter! If pairs aren't sorted, the proof must encode an extra boolean flag for every sibling indicating whether it is on the left or right!",
      "Sorted pairs simplify on-chain verification and prevent ordering ambiguities."
    ],
    "situationalPuzzle": {
      "scenario": "A token project distributes an airdrop of 100,000 tokens using a Merkle tree. A user claims their tokens with a valid Merkle proof. Two minutes later, the exact same user calls 'claim()' again with the same proof and receives another 100,000 tokens! The contract verified the proof was valid, but lost its entire token reserve. What crucial invariant did the contract fail to enforce?",
      "options": [
        "The Merkle tree was corrupted.",
        "Missing On-Chain Nullifier / Claimed State Tracking: A Merkle proof only proves that an address was included in the original airdrop list; it has ZERO memory of whether that claim was already fulfilled! The smart contract must maintain a 'mapping(address => bool) public hasClaimed' or bitmask bitmap, checking that hasClaimed is false, setting it to true BEFORE transferring tokens, and reverting on duplicates.",
        "The Merkle root changed between blocks.",
        "OpenZeppelin MerkleProof has a double-claim bug."
      ],
      "answerIdx": 1,
      "debrief": "Cryptographic proofs are stateless assertions of historical inclusion. They do not maintain dynamic lifecycle state. In any airdrop, whitelist, or zero-knowledge nullifier system, the receiving smart contract must record an on-chain tombstone/bitmask to ensure each proof can only be consumed exactly once."
    },
    "quests": [
      {
        "id": "bc-m1-d03-q1",
        "name": "Merkle Tree Complexity & Second Pre-Image Resistance",
        "type": "concept",
        "desc": "Prove mathematically that verifying an inclusion proof in a balanced Merkle tree of N leaves requires exactly &lceil;log2(N)&rceil; hash operations."
      },
      {
        "id": "bc-m1-d03-q2",
        "name": "Merkle Tree Multi-Proof Optimizer & Sibling Collapser",
        "type": "detective",
        "desc": "Analyze proof sizes for batch claims: compare N individual proofs vs a single Merkle Multi-Proof that deduplicates shared intermediate branch hashes."
      },
      {
        "id": "bc-m1-d03-q3",
        "name": "High-Scale Merkle Airdrop Engine in TypeScript & Solidity",
        "type": "mastery",
        "desc": "Build an end-to-end token distributor: generate tree from 50,000 CSV accounts, output root, generate proofs, and verify with a gas-optimized contract."
      },
      {
        "id": "bc-m1-d03-q4",
        "name": "3 AM SRE: $10M Airdrop Drained by Missing Claim Nullifiers",
        "type": "incident",
        "desc": "Lead the emergency war room remediating a production airdrop contract drained by bots repeatedly submitting identical valid Merkle proofs."
      }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "Distributed Consensus Foundations: Byzantine Fault Tolerance, Proof-of-Work & 51% Attacks",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Distributed Consensus (BFT Physics, Nakamoto Consensus & Reorgs)",
    "spokenGoal": "Examine how decentralized, untrusted peer-to-peer networks agree on an identical state transition history without central coordination. Review the Byzantine Generals Problem: reaching consensus when up to f nodes in a network of 3f + 1 nodes may be malicious, deceptive, or offline. Contrast Classical BFT (PBFT, Raft) with Nakamoto Consensus (Proof-of-Work). Trace how Proof-of-Work converts economic resource expenditure (hash power) into sybil resistance: miners grind nonces to find H(block_header) < Target. Dissect the Longest-Chain Rule (heaviest cumulative difficulty), blockchain reorganizations (reorgs), selfish mining strategies, and the existential threat of 51% Double-Spend Attacks.",
    "conceptInvariant": "Nakamoto Heaviest-Chain Invariant: Nodes must always follow the valid chain with the greatest accumulated Proof-of-Work difficulty; probabilistic transaction finality deepens exponentially with block confirmations: P(reorg) &approx; (q/p)^z where q is adversary hash power and z is confirmation depth.",
    "failureMode": "Accepting a $500,000 crypto deposit after only 1 block confirmation on an exchange; an attacker mines a private 3-block fork, withdraws fiat, releases the longer private fork, triggering a 2-block reorg that erases the deposit.",
    "tryItFriction": "Construct a mini Proof-of-Work blockchain simulator in TypeScript: create Block headers (index, timestamp, previousHash, merklRoot, nonce, difficulty); implement mining loop adjusting difficulty dynamically every 5 blocks to maintain 1000ms block time; simulate a 51% attack by creating a racing fork; and observe honest nodes reorganizing to the heavier fork.",
    "socraticHints": [
      "Why can't a 51% attacker steal arbitrary private keys or alter past transactions belonging to other users?",
      "Because Proof-of-Work does not give the attacker the ability to forge digital signatures! Even with 99% of hash power, if the attacker creates a block with an invalid signature, honest nodes will reject the block as invalid immediately!",
      "A 51% attacker can only reorganize blocks to double-spend their own past transactions or censor incoming transactions."
    ],
    "situationalPuzzle": {
      "scenario": "A crypto exchange requires 12 confirmations before crediting Bitcoin deposits, but only 2 confirmations for Ethereum Classic (ETC). An attacker rents hash power on NiceHash, executes a double-spend deposit on ETC, and walks away with $1.5M after a 500-block reorganization. Why was ETC vulnerable to a massive reorg while Bitcoin remained secure?",
      "options": [
        "ETC uses a broken hashing algorithm.",
        "Hash Rate Asymmetry & Rental Vulnerability: ETC shared the Ethash mining algorithm with Ethereum (ETH), but possessed less than 3% of the global Ethash hash power! An attacker could rent a fraction of ETH's idle GPU hash power for a few hours, easily out-mining the entire ETC honest network by 300%, and privately forge a 500-block deeper chain.",
        "Proof-of-Work cannot support smart contracts.",
        "The exchange's node software was out of date."
      ],
      "answerIdx": 1,
      "debrief": "Minority-hashrate Proof-of-Work blockchains sharing an algorithm with a dominant coin are perpetually vulnerable to hash power rental attacks. An adversary needs only a tiny fraction of the dominant coin's mining hardware to overwhelm the minority network and execute devastating multi-hundred-block reorganizations."
    },
    "quests": [
      {
        "id": "bc-m1-d04-q1",
        "name": "PBFT vs Nakamoto Consensus Mathematical Comparison",
        "type": "concept",
        "desc": "Compare message complexity O(N^2) in PBFT vs O(N) gossip in Nakamoto consensus and prove the 3f+1 Byzantine quorum requirement."
      },
      {
        "id": "bc-m1-d04-q2",
        "name": "Nakamoto Double-Spend Gambler's Ruin Probability Simulator",
        "type": "detective",
        "desc": "Implement Satoshi Nakamoto's Poisson confirmation risk model in TypeScript, computing double-spend success probability across hashrate ratios."
      },
      {
        "id": "bc-m1-d04-q3",
        "name": "Multi-Node P2P Blockchain Network Simulator",
        "type": "mastery",
        "desc": "Build an in-memory P2P network in TypeScript with 5 mining nodes, mempool gossip, dynamic difficulty retargeting, and longest-chain reorgs."
      },
      {
        "id": "bc-m1-d04-q4",
        "name": "3 AM SRE: Deep Chain Reorganization Erasing Exchange Reserves",
        "type": "incident",
        "desc": "Mitigate a live production crisis where a 24-block chain reorganization caused an exchange backend to credit duplicate withdrawals."
      }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "Milestone 1: Zero-Dependency Blockchain Ledger & Merkle Proof Engine",
    "stageName": "Stage 1: Foundational Core",
    "stageNum": 1,
    "pedagogicalRole": "Block 1 Capstone Project & Architectural Gate",
    "spokenGoal": "Synthesize the complete foundational discipline of cryptographic hashing, elliptic curve digital signatures, Merkle trees, and Proof-of-Work consensus into an end-to-end, zero-dependency blockchain core: the Zero-Dependency Blockchain Ledger & Merkle Proof Engine. In this milestone, architect an autonomous ledger from scratch in pure TypeScript: generate secp256k1 keypairs and checksummed addresses; construct and cryptographically sign structured transactions; assemble transactions into blocks with Merkle tree roots; implement dynamic difficulty Proof-of-Work mining; execute peer-to-peer block gossip; and provide an SPV verification module that proves transaction inclusion using Merkle proofs.",
    "conceptInvariant": "Autonomous Ledger Invariant: A valid decentralized ledger must be self-verifying: any node receiving a genesis block and subsequent block headers can independently verify all digital signatures, state transitions, and proof-of-work difficulty without trusting any central authority.",
    "failureMode": "Failing the milestone gate when mining difficulty fails to adjust during hashrate spikes, or when an invalid signature or corrupted Merkle root is accepted into the blockchain history.",
    "tryItFriction": "Construct and deliver the complete TypeScript milestone engine: instantiate 3 simulated peer nodes; generate 100 signed transactions between 10 wallets; mine 5 sequential blocks with dynamic difficulty; generate a Merkle inclusion proof for transaction #42; verify the proof against block #2's Merkle root; simulate an adversary attempting a double-spend reorg; and verify honest fork rejection.",
    "socraticHints": [
      "What is the single most critical invariant when validating an incoming block from an untrusted peer?",
      "Verify previousBlockHash matches your tip, blockHeader hash satisfies the current difficulty target, all transactions have valid signatures and nonces, and the Merkle root of transactions matches the header root exactly!",
      "If even one transaction is invalid, the entire block must be discarded."
    ],
    "situationalPuzzle": {
      "scenario": "During your Milestone 1 defense, the examiner sends a block with 50 transactions. All 50 transactions have valid ECDSA signatures. However, transaction #1 and transaction #48 spend the exact same UTXO / transfer the exact same balance from the same wallet with the same nonce. Your node accepts the block. What critical validation pass was omitted?",
      "options": [
        "The block difficulty was too low.",
        "State Transition Double-Spend Validation: Valid cryptographic signatures only prove authorization; they do NOT prove solvency! The node must maintain an active World State / UTXO set. When executing a block, the node must evaluate transactions sequentially against current state: if an account does not have sufficient balance or a nonce is duplicated, the transaction is invalid and the entire block must be rejected.",
        "The node needed more RAM.",
        "TypeScript cannot validate transactions in parallel."
      ],
      "answerIdx": 1,
      "debrief": "Cryptographic correctness &ne; state validity. An attacker can sign 100 valid transactions spending the same 10 ETH to 100 different recipients. The consensus engine must maintain stateful ledger accounting, tracking nonces and balances to ensure an account cannot spend more than it holds within a single block."
    },
    "quests": [
      {
        "id": "bc-m1-d05-q1",
        "name": "Blockchain Ledger Architecture Specification",
        "type": "concept",
        "desc": "Produce the comprehensive engineering specification detailing block header layouts, transaction serialization, Merkle algorithms, and consensus rules."
      },
      {
        "id": "bc-m1-d05-q2",
        "name": "Ledger Invariant & State Double-Spend Test Suite",
        "type": "detective",
        "desc": "Build automated test suites asserting zero double-spends across 500 randomized transactions and verifying deterministic fork resolution."
      },
      {
        "id": "bc-m1-d05-q3",
        "name": "Zero-Dependency TypeScript Blockchain Engine Build",
        "type": "mastery",
        "desc": "Deploy and run the complete working blockchain ledger in TypeScript with Secp256k1 signing, Merkle proof generation, and PoW mining."
      },
      {
        "id": "bc-m1-d05-q4",
        "name": "Milestone 1 Viva Gate: Core Cryptographic Ledger Defense",
        "type": "incident",
        "desc": "Defend the ledger engine before the Senior Web3 Architecture Board, demonstrating live Merkle SPV verification and fork reorg recovery."
      }
    ]
  },
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "EVM Architecture Anatomy: Stack (1024 Depth, 256-Bit Words), Volatile Memory & Calldata",
    "stageName": "Stage 2: Core Engineering & Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Virtual Machine Internals (EVM Stack Machine, Memory Gas & Calldata)",
    "spokenGoal": "Transition from general distributed ledgers to the world's most widely adopted decentralized computer: The Ethereum Virtual Machine (EVM). Understand why the EVM is a Stack-Based Virtual Machine rather than a register-based machine (like x86 or ARM): all operations push and pop 256-bit words (32 bytes, matching Keccak-256 and Secp256k1 curve orders). Master the three transient data locations: 1) The Stack: maximum depth of 1024 items, with operations restricted to the top 16 slots (confronting the infamous 'Stack Too Deep' compiler error); 2) Volatile Memory: a linear byte-addressable array that expands dynamically during execution, subject to Quadratic Gas Expansion costs; and 3) Calldata: an immutable, read-only byte array containing transaction payload data.",
    "conceptInvariant": "Quadratic Memory Gas Invariant: The cost of expanding EVM volatile memory scales quadratically with word count: C_mem(a) = 3 &middot; a + &lfloor;a^2 / 512&rfloor; where a is the memory size in 32-byte words; allocating massive memory buffers rapidly exhausts the block gas limit.",
    "failureMode": "Allocating a 1MB dynamic memory array inside a Solidity loop in a single transaction; memory gas expansion scales quadratically, requiring over 15,000,000 gas and causing the transaction to revert with 'Out of Gas' on the node.",
    "tryItFriction": "Construct a Stack and Memory simulator in TypeScript: implement a 1024-word Stack with PUSH, POP, DUP (1-16), and SWAP (1-16) operations; implement byte-addressable Memory with MSTORE, MLOAD, and MSTORE8; calculate exact quadratic memory expansion gas fees; and reproduce the 'Stack Too Deep' error when accessing stack index 17.",
    "socraticHints": [
      "Why does accessing stack item 17 trigger a 'Stack Too Deep' error in Solidity?",
      "Because the EVM only has opcodes DUP1 through DUP16 and SWAP1 through SWAP16! The EVM instruction set physically lacks any opcode capable of copying or swapping items deeper than 16 slots from the top of the stack!",
      "Solidity developers solve this by grouping variables into structs or moving them into memory."
    ],
    "situationalPuzzle": {
      "scenario": "A smart contract function takes an array of 500 uint256 numbers as an argument. Marking the parameter as 'uint256[] memory numbers' consumes 145,000 gas. Changing the parameter declaration to 'uint256[] calldata numbers' slashes gas consumption to 28,000 gas. Why is calldata so much cheaper than memory for external function arguments?",
      "options": [
        "Calldata runs on Layer 2.",
        "Zero-Copy Calldata Physics: 'calldata' points directly to the raw transaction input bytes sent by the user over the wire! When declared as 'memory', the EVM executes an MSTORE loop that copies all 500 words from calldata into volatile memory, paying per-word copy gas PLUS quadratic memory expansion fees! Declaring as 'calldata' avoids all copying, reading directly from the input buffer via CALLDATALOAD.",
        "Memory variables are stored on disk permanently.",
        "Solidity does not charge gas for calldata."
      ],
      "answerIdx": 1,
      "debrief": "Calldata is read-only, non-modifiable input data. When an external function declares an argument as 'memory', the EVM is forced to allocate memory and copy every single byte from calldata into memory. For large arrays and strings, always declare external parameters as 'calldata' to achieve zero-copy gas efficiency."
    },
    "quests": [
      {
        "id": "bc-m1-d06-q1",
        "name": "EVM Stack Machine vs Register Machine Complexity Proof",
        "type": "concept",
        "desc": "Analyze instruction density and bytecode size comparing EVM stack execution with LLVM/eBPF register-based bytecode."
      },
      {
        "id": "bc-m1-d06-q2",
        "name": "EVM Quadratic Memory Expansion Gas Calculator",
        "type": "detective",
        "desc": "Model EVM memory expansion gas costs from 32 bytes to 1MB, plotting the quadratic transition point and gas exhaustion curves."
      },
      {
        "id": "bc-m1-d06-q3",
        "name": "EVM Stack & Linear Memory Simulator in TypeScript",
        "type": "mastery",
        "desc": "Build an execution module supporting 1024-depth 256-bit stack, MLOAD/MSTORE/MSTORE8 operations, and exact Yellow Paper gas tracking."
      },
      {
        "id": "bc-m1-d06-q4",
        "name": "3 AM SRE: Out-of-Gas Reverts from Memory Allocation Blowup",
        "type": "incident",
        "desc": "Resolve a high-priority production bug where an on-chain batch liquidation contract reverted due to quadratic memory allocation during large token sweeps."
      }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "EVM Persistent Storage Layout: 2^256 Slots, 32-Byte Slot Packing & Hash Slot Mathematics",
    "stageName": "Stage 2: Core Engineering & Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Storage Engineering (Slot Packing, Mapping Hashes & Collision Bounds)",
    "spokenGoal": "Deep-dive into the permanent, persistent state of Ethereum contracts: EVM Storage. Understand that contract storage is a massive virtual key-value store of 2^256 addressable slots, where each slot holds exactly 32 bytes (256 bits). Master Storage Packing Rules: contiguous state variables occupying less than 32 bytes (e.g. uint128, uint64, address (20 bytes), bool (1 byte)) are packed right-to-left into a single 32-byte slot, cutting SSTORE gas costs by up to 75%! Dissect dynamic storage mathematics: how dynamic arrays store length at slot p and elements at `keccak256(p) + index`, and how mappings store values at `keccak256(abi.encode(key, slot))`. Understand why mapping collisions are mathematically impossible in 2^256 space.",
    "conceptInvariant": "Storage Slot Packing Invariant: Multiple state variables smaller than 32 bytes are packed into a single 32-byte storage slot if they fit contiguously; accessing packed variables shares a single SLOAD/SSTORE, whereas suboptimal ordering wastes 20,000 gas per unnecessary slot.",
    "failureMode": "Declaring state variables as: uint128 a; uint256 b; uint128 c; this consumes THREE full 32-byte slots (96 bytes). Reordering to: uint128 a; uint128 c; uint256 b; packs a and c into slot 0 and b into slot 1, saving 20,000 gas permanently on deployment and execution.",
    "tryItFriction": "Implement an EVM Storage Slot Calculator in TypeScript: input a list of Solidity state variable types (address, uint8, uint256, mapping, dynamic array); compute exact slot offsets and byte offsets; calculate storage keys for a mapping using keccak256(abi.encode(key, slot)); and verify slot layout against forge inspect Storage.",
    "socraticHints": [
      "Why can't you iterate over the keys of a standard Solidity mapping?",
      "Because a mapping does NOT store its keys or a list of active elements! For any key, the value is stored at the pseudo-random hash slot keccak256(key . slot). The EVM has no index of which hash slots contain non-zero data!",
      "To iterate over a mapping, you must maintain a separate array of keys."
    ],
    "situationalPuzzle": {
      "scenario": "An engineer audits an uninitialized storage pointer vulnerability in an older Solidity contract. An internal function declares: 'User storage user;' without assigning it to an existing storage reference like 'users[msg.sender]'. When the function writes 'user.balance = 100', it accidentally overwrites the contract's 'owner' address! How did an unassigned storage pointer overwrite the owner?",
      "options": [
        "The compiler ran out of memory.",
        "Uninitialized Storage Pointer Defaulting to Slot 0: In older Solidity versions (pre-0.5.0), an uninitialized local storage variable defaulted to pointing to Storage Slot 0! Since the first declared state variable of the contract was 'address public owner' (which also resides at Slot 0), writing to the uninitialized pointer overwrote Slot 0, replacing the owner with the attacker's address!",
        "Storage pointers only work with public functions.",
        "The EVM has no concept of pointers."
      ],
      "answerIdx": 1,
      "debrief": "Uninitialized storage pointers were historically responsible for massive multi-million dollar hacks. In early Solidity, an unassigned storage reference defaulted to slot 0, overwriting critical administrative variables. Modern Solidity (0.5.0+) forbids uninitialized storage pointers at compile time, but understanding slot layout remains critical."
    },
    "quests": [
      {
        "id": "bc-m1-d07-q1",
        "name": "EVM Storage Slot Math & 2^256 Sparsity Formulation",
        "type": "concept",
        "desc": "Derive the mathematical storage addressing equations for multi-dimensional dynamic arrays and nested mappings in the EVM."
      },
      {
        "id": "bc-m1-d07-q2",
        "name": "Solidity Storage Slot Packing Optimizer & Linter",
        "type": "detective",
        "desc": "Build an algorithmic AST analyzer that inspects Solidity contracts, detects sub-optimal variable packing, and reorders slots for minimal gas."
      },
      {
        "id": "bc-m1-d07-q3",
        "name": "EVM Storage Layout Simulator in TypeScript",
        "type": "mastery",
        "desc": "Implement a full EVM storage emulator calculating slot numbers, byte shifts, mapping hashes, and dynamic array expansions."
      },
      {
        "id": "bc-m1-d07-q4",
        "name": "3 AM SRE: Corrupted Contract State from Storage Slot Collision",
        "type": "incident",
        "desc": "Triage and fix an emergency proxy upgrade incident where a newly added variable shifted storage slots, overwriting critical collateral balances."
      }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "EVM Opcodes, Bytecode Execution & Gas Metering: SSTORE/SLOAD, Warm vs Cold (EIP-2929)",
    "stageName": "Stage 2: Core Engineering & Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Instruction Set Architecture (Bytecode Execution & Gas Economics)",
    "spokenGoal": "Inspect the raw machine language of Ethereum: EVM Bytecode and Opcodes. Understand how high-level Solidity compiles down to a linear stream of hex bytes (e.g. 0x6080604052...). Deconstruct the core opcode families: Arithmetic (ADD, SUB, MUL, DIV), Comparison (LT, GT, EQ), Environment (CALLER, CALLVALUE, TIMESTAMP, NUMBER), Storage (SLOAD, SSTORE), and Flow Control (JUMP, JUMPI, JUMPDEST). Deep-dive into Gas Economics: the cost of computation. Analyze the impact of EIP-2929 (Berlin fork): Warm vs Cold access (accessing an address or storage slot for the first time in a transaction costs 2,600 gas for cold SLOAD, but only 100 gas for warm SLOAD). Master SSTORE gas refund mechanics and EIP-3529 gas refund limits.",
    "conceptInvariant": "Gas Halting Invariant: Every EVM opcode deducts a deterministic gas amount before execution; if remaining gas drops below the opcode's cost, the EVM immediately terminates execution with OutOfGas, atomically reverting all state changes while burning all consumed gas.",
    "failureMode": "Iterating over an unbounded array using SLOAD inside a loop; as the array grows to 5,000 items, executing 5,000 cold SLOAD operations exceeds the 30M block gas limit, permanently freezing the contract and locking all deposited funds forever.",
    "tryItFriction": "Construct a minimal EVM Bytecode Interpreter in TypeScript: parse raw hex bytecode; implement Program Counter (PC); execute PUSH1, ADD, MSTORE, and RETURN; meter gas for each opcode including base fees and memory expansion; and verify that an un-metered loop halts upon exhausting an allocated 100,000 gas budget.",
    "socraticHints": [
      "Why did Ethereum introduce EIP-2929 making cold storage reads (2,600 gas) significantly more expensive than warm reads (100 gas)?",
      "Because reading cold storage requires the physical node to perform an expensive random I/O disk seek on LevelDB/RocksDB! Once read into RAM cache, subsequent warm reads cost almost zero CPU time!",
      "EIP-2929 protects nodes against DoS attacks that forced thousands of random disk seeks per block."
    ],
    "situationalPuzzle": {
      "scenario": "An engineer writes a loop that reads a state variable 10 times: 'for(uint i=0; i<10; i++) { sum += stateVar; }'. In assembly, this executes 10 SLOAD opcodes. The first SLOAD costs 2,100 gas (cold), and the remaining 9 cost 100 gas each (warm), totaling 3,000 gas. How can the engineer reduce this gas cost by 90% in Solidity?",
      "options": [
        "Delete the loop.",
        "Cache Storage Variable into a Local Memory/Stack Variable: Read the state variable ONCE into a local memory variable before the loop: 'uint256 cached = stateVar; for(uint i=0; i<10; i++) { sum += cached; }'! This executes exactly 1 SLOAD (2,100 gas) and 10 DUP/stack reads (3 gas each = 30 gas), saving nearly 900 gas!",
        "Change the loop to a while loop.",
        "The EVM compiler automatically caches all storage reads."
      ],
      "answerIdx": 1,
      "debrief": "The Solidity compiler does NOT automatically cache storage reads across loop iterations if there are function calls or potential state modifications. SLOAD (even warm at 100 gas) is 33x more expensive than reading from the stack (DUP = 3 gas). Always cache storage variables into local stack variables before entering loops."
    },
    "quests": [
      {
        "id": "bc-m1-d08-q1",
        "name": "EVM Opcode Gas Schedule Mathematical Proof",
        "type": "concept",
        "desc": "Derive the computational and I/O cost models underpinning the EVM Yellow Paper gas schedule, analyzing SLOAD/SSTORE vs CPU opcodes."
      },
      {
        "id": "bc-m1-d08-q2",
        "name": "EIP-2929 Warm/Cold Access Gas Profiler",
        "type": "detective",
        "desc": "Trace transaction execution traces in Foundry, identifying every cold address/storage access and calculating gas savings from warm re-use."
      },
      {
        "id": "bc-m1-d08-q3",
        "name": "Minimal EVM Bytecode Execution Engine in TypeScript",
        "type": "mastery",
        "desc": "Build an execution engine supporting 20 core EVM opcodes, PC navigation, JUMPDEST validation, stack tracking, and gas metering."
      },
      {
        "id": "bc-m1-d08-q4",
        "name": "3 AM SRE: Denial of Service via Unbounded SLOAD Loop",
        "type": "incident",
        "desc": "Lead the emergency recovery of a locked governance contract where an unbounded proposal loop hit the 30M block gas limit."
      }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "The World State Trie: Modified Merkle Patricia Trie (MPT), Account States & State Roots",
    "stageName": "Stage 2: Core Engineering & Architecture",
    "stageNum": 2,
    "pedagogicalRole": "State Trie Architectures (Radix Trees, Patricia Tries & Ethereum World State)",
    "spokenGoal": "Master the global cryptographic data structure that holds all Ethereum balances, smart contract code, and storage: The Modified Merkle Patricia Trie (MPT). Contrast a standard Radix/Trie with Ethereum's optimized MPT: understand the 4 node types: 1) Null node (empty); 2) Leaf node (stores remaining path key and value); 3) Extension node (optimizes paths by collapsing shared prefixes into a single node); and 4) Branch node (a 17-item array with 16 hex nibble branches 0-f plus 1 value slot). Analyze the 4 State Tries in Ethereum: The World State Trie (maps address to Account State: Nonce, Balance, StorageRoot, CodeHash), Storage Trie (per-contract slot trie), Transaction Trie, and Receipt Trie. Understand how the 32-byte State Root in each block header cryptographically commits to the entire global state of Ethereum.",
    "conceptInvariant": "World State Merkle Root Invariant: Every Ethereum block header contains a 32-byte 'stateRoot' representing the cryptographic Merkle root of the global MPT; any balance transfer or storage mutation anywhere in the world alters this root deterministically.",
    "failureMode": "Attempting to prune historical state nodes without reference counting; an archive node inadvertently deletes shared intermediate MPT branch nodes, corrupting state lookups for thousands of unrelated smart contracts.",
    "tryItFriction": "Construct a Modified Merkle Patricia Trie in TypeScript: implement Hex-Prefix (HP) encoding for shared nibble paths; insert 10 Ethereum accounts with nonces, balances, and storage roots; compute RLP (Recursive Length Prefix) serializations; generate branch, extension, and leaf nodes; and compute the exact 32-byte Keccak-256 State Root.",
    "socraticHints": [
      "Why does Ethereum's Merkle Patricia Trie use 16 hex nibbles (4 bits each) instead of 256 byte branches?",
      "Because a 256-branch node would require a 257-item array at every level, wasting massive storage on empty pointers! A 16-nibble branch is compact (17 items) while keeping tree depth reasonable (&le; 64 nibble steps for a 32-byte address)!",
      "Extension nodes skip intermediate single-child paths, keeping the tree shallow."
    ],
    "situationalPuzzle": {
      "scenario": "An Ethereum light client wants to verify that Vitalik's wallet address holds 1,000 ETH without downloading the 1TB Ethereum state database. The light client only possesses the latest 32-byte 'stateRoot' from the block header. How does the light client cryptographically verify the balance?",
      "options": [
        "Ask a full node and trust its HTTP response.",
        "Merkle Patricia Trie Account Proof: The light client requests a Merkle Patricia Proof (eth_getProof). The full node returns the path of RLP-encoded MPT nodes (Root &rarr; Extension &rarr; Branch &rarr; Leaf) for keccak256(vitalik.eth). The light client hashes the root node, verifies it matches the trusted 'stateRoot' in the header, traverses the nibble path, decodes the leaf's RLP account tuple [nonce, balance, storageRoot, codeHash], and verifies the 1,000 ETH balance with 100% cryptographic certainty.",
        "Light clients cannot verify balances.",
        "Mine a new block to confirm the balance."
      ],
      "answerIdx": 1,
      "debrief": "This is the foundational superpower of Ethereum's MPT. Through 'eth_getProof', any light client or Layer 2 bridge can verify any account balance or contract storage slot by validating a cryptographic traversal path against the trusted 32-byte State Root, without needing the global database."
    },
    "quests": [
      {
        "id": "bc-m1-d09-q1",
        "name": "Modified Merkle Patricia Trie Mathematics & RLP Encoding",
        "type": "concept",
        "desc": "Derive the formal mathematical specification for Hex-Prefix (HP) nibble encoding and RLP serialization across all 4 MPT node types."
      },
      {
        "id": "bc-m1-d09-q2",
        "name": "eth_getProof Merkle Account Proof Verifier",
        "type": "detective",
        "desc": "Build an automated verification script taking JSON-RPC eth_getProof responses and validating MPT cryptographic paths against block state roots."
      },
      {
        "id": "bc-m1-d09-q3",
        "name": "Pure TypeScript Merkle Patricia Trie Engine",
        "type": "mastery",
        "desc": "Implement a full working MPT in TypeScript with insert, delete, get, branch splitting, extension path collapsing, and state root generation."
      },
      {
        "id": "bc-m1-d09-q4",
        "name": "3 AM SRE: Corrupted State Trie Root Halting Validator Sync",
        "type": "incident",
        "desc": "Diagnose an emergency node consensus failure where an off-by-one error in RLP leaf encoding caused client consensus divergence on state roots."
      }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "Milestone 2: Bytecode-Level EVM Interpreter & Merkle Patricia State Trie Engine",
    "stageName": "Stage 2: Core Engineering & Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Block 2 Capstone Project & Architectural Gate",
    "spokenGoal": "Synthesize the entire discipline of EVM stack machine mechanics, gas economics, storage slot math, and Merkle Patricia state tries into a standalone virtual machine: The Bytecode-Level EVM Interpreter & Merkle Patricia State Trie Engine. In this milestone, architect a complete mini-EVM runtime from scratch in TypeScript: parse raw hex bytecode; evaluate 30+ EVM opcodes (including arithmetic, stack, memory, SLOAD/SSTORE, and control flow); implement exact EIP-2929 warm/cold gas metering and quadratic memory expansion fees; connect execution to a persistent Merkle Patricia Trie storing world account states; and execute mock smart contract transactions updating balances and storage slots deterministically.",
    "conceptInvariant": "Deterministic State Transition Invariant: Given an initial state trie root &sigma;_0 and a transaction T with bytecode and gas budget, the EVM execution function &Upsilon;(&sigma;_0, T) must produce an identical state trie root &sigma;_1 and gas consumption receipt across all implementations without non-deterministic deviations.",
    "failureMode": "Failing the milestone gate when an arithmetic division by zero fails to revert properly, when warm storage accesses are charged cold gas fees, or when state trie roots diverge from official Ethereum test vectors.",
    "tryItFriction": "Construct and deliver the complete TypeScript milestone engine: feed a compiled ERC-20 'transfer(address,uint256)' bytecode payload into your EVM interpreter; trace stack, memory, and gas consumption step-by-step; verify that SLOAD reads caller balance and SSTORE updates recipient balance; compute the updated Merkle Patricia World State Root; and verify zero gas metering drift against Geth/Foundry execution traces.",
    "socraticHints": [
      "How do we handle contract revert operations in the state trie?",
      "By implementing State Checkpoints / Journaling! Before executing a transaction or sub-call, take a snapshot of the modified trie keys. If the execution opcodes encounter REVERT or OutOfGas, rollback all modifications in the journal, restoring the state trie to its exact pre-call root!",
      "Gas consumed up to the revert point is retained by the miner."
    ],
    "situationalPuzzle": {
      "scenario": "During your Milestone 2 defense, the examiner tests an EVM call that executes an infinite loop: '0x5b600056' (JUMPDEST, PUSH1 0x00, JUMP). The examiner provides a gas limit of 50,000. How does your interpreter handle this infinite loop without freezing the host process?",
      "options": [
        "The computer crashes.",
        "Gas Metering Execution Halting: Each execution step deducts gas: JUMPDEST costs 1 gas, PUSH1 costs 3 gas, JUMP costs 8 gas = 12 gas per iteration! In iteration 4,166, remaining gas drops below 12. The interpreter immediately halts execution, throws an OutOfGas exception, discards all pending state changes, and sets gasUsed = 50,000, terminating safely within 5 milliseconds.",
        "Set a 10-second JavaScript setTimeout.",
        "Infinite loops are illegal in Web3."
      ],
      "answerIdx": 1,
      "debrief": "This demonstrates why the Halting Problem is solved in the EVM via economic gas metering. Even an infinite loop cannot run indefinitely on an Ethereum node because every opcode burns gas. As soon as the transaction gas limit hits zero, execution abruptly terminates, protecting nodes from infinite loops."
    },
    "quests": [
      {
        "id": "bc-m1-d10-q1",
        "name": "EVM State Transition Formal Specification",
        "type": "concept",
        "desc": "Formulate the formal state transition mathematical tuple &Upsilon;(&sigma;, B, T) = &sigma;' conforming to the Ethereum Yellow Paper specification."
      },
      {
        "id": "bc-m1-d10-q2",
        "name": "Automated EVM Gas Schedule Compliance Test Suite",
        "type": "detective",
        "desc": "Execute official Ethereum Foundation test suites across 200 opcode sequences to verify exact gas compliance down to the single gas unit."
      },
      {
        "id": "bc-m1-d10-q3",
        "name": "Production EVM Interpreter & MPT Engine Build",
        "type": "mastery",
        "desc": "Build and run the complete TypeScript EVM interpreter featuring 30+ opcodes, journaling state rollbacks, and MPT world state persistence."
      },
      {
        "id": "bc-m1-d10-q4",
        "name": "Milestone 2 Viva Gate: EVM Architecture Defense",
        "type": "incident",
        "desc": "Defend the virtual machine architecture before the Senior Web3 Board, executing raw bytecode live and proving state trie integrity."
      }
    ]
  },
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Solidity Type System & Data Locations: Value Types, Structs & Memory vs Storage vs Calldata",
    "stageName": "Stage 2: Core Engineering & Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Language Fundamentals (Type Safety, Memory Semantics & Pointer Rules)",
    "spokenGoal": "Begin authoring high-level smart contracts with production Solidity (v0.8.20+). Dissect Solidity's strict static type system: Value Types (booleans, uint8-uint256, int8-int256, address, address payable, bytes1-bytes32) passed by value, versus Reference Types (arrays, structs, strings, bytes, mappings) passed by reference. Deep-dive into Data Locations: `storage` (persistent blockchain state, expensive SLOAD/SSTORE), `memory` (temporary heap during execution, cheap, mutable), and `calldata` (read-only input buffer, cheapest). Master Pointer Semantics: understand why assigning a `storage` struct to a local `storage` variable creates a reference pointer, while assigning a `storage` struct to a `memory` variable creates an expensive full clone.",
    "conceptInvariant": "Data Location Copy Invariant: Assignments between `storage` and `memory` always generate an independent copy of all elements; assignments from `storage` to local `storage` references create a pointer to the original storage slot.",
    "failureMode": "Modifying a local `memory` copy of a user struct believing it updates on-chain state: 'User memory u = users[msg.sender]; u.balance += 100;' The transaction succeeds, but on-chain balance never changes because only the temporary memory clone was updated, losing the user's funds.",
    "tryItFriction": "Write a Solidity 0.8.20 contract demonstrating data location mechanics: create a User struct; write functions updating state via `storage` pointer versus `memory` clone; demonstrate gas differences between `calldata` array inputs vs `memory` array inputs; and write Foundry tests verifying that memory updates do not alter on-chain storage.",
    "socraticHints": [
      "Why is 'address payable' a distinct type from 'address' in Solidity?",
      "Because safety-by-design requires explicit developer intention when sending Ether! A standard 'address' cannot receive funds via .transfer() or .send()! You must explicitly cast 'payable(addr)' to allow financial transfers, preventing accidental ether lockups!",
      "Explicit types prevent bugs before compilation."
    ],
    "situationalPuzzle": {
      "scenario": "A junior developer writes an on-chain registration function: 'function register(string memory name) public'. An auditor reviews the pull request and immediately demands changing the parameter to 'string calldata name'. If the function does not modify the 'name' string, what performance benefit justifies this change?",
      "options": [
        "Calldata encrypts the string.",
        "Elimination of Memory Allocation & Copying Fees: 'string memory' forces the EVM to allocate heap memory and copy the entire string from transaction calldata into memory via an MSTORE loop. Declaring 'string calldata' avoids all memory allocation, passing an immutable slice pointer directly into the function at near-zero gas cost.",
        "Memory strings are limited to 32 characters.",
        "Calldata makes the function private."
      ],
      "answerIdx": 1,
      "debrief": "In public/external functions, function arguments that are only read should always be typed as 'calldata'. Using 'memory' incurs unnecessary gas costs to allocate memory and copy bytes from the input buffer. Calldata delivers zero-copy gas efficiency."
    },
    "quests": [
      {
        "id": "bc-m1-d11-q1",
        "name": "Solidity Type System & Data Location Formal Model",
        "type": "concept",
        "desc": "Document the complete Solidity type hierarchy, mapping value types to EVM stack words and reference types to memory/storage layouts."
      },
      {
        "id": "bc-m1-d11-q2",
        "name": "Memory vs Storage Assignment Static Analyzer",
        "type": "detective",
        "desc": "Build a static analysis rule in TypeScript using Slither or AST parsers detecting unintended writes to memory copies of storage structs."
      },
      {
        "id": "bc-m1-d11-q3",
        "name": "Gas-Optimized Data Location Contract in Foundry",
        "type": "mastery",
        "desc": "Implement a Solidity contract demonstrating storage pointers, zero-copy calldata slicing, and write Foundry gas benchmarks."
      },
      {
        "id": "bc-m1-d11-q4",
        "name": "3 AM SRE: Phantom User Balance Update in Production Launch",
        "type": "incident",
        "desc": "Emergency fix a production smart contract where staking rewards were credited to a local memory struct instead of on-chain storage."
      }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "Control Flow, Visibility & Function Modifiers: external vs public & Custom Reentrancy Guards",
    "stageName": "Stage 2: Core Engineering & Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Contract Architecture (Visibility Specifiers, Modifiers & Reentrancy Defenses)",
    "spokenGoal": "Architect clean, gas-efficient, and secure Solidity contract entry points. Dissect Function Visibility: `external` (callable only from outside, receives calldata arguments, lowest gas), `public` (callable both externally and internally, copies calldata to memory), `internal` (callable only within contract and derived contracts, jumps via JUMP), and `private` (callable only within current contract). Master Function Modifiers: how `modifier onlyOwner()` executes pre-conditions and post-conditions wrapping the target function via `_;` merge points. Analyze the gas cost of modifiers: why duplicating modifier code across 20 functions bloats contract bytecode size, and how to optimize with internal helper functions. Build a custom, zero-cost Reentrancy Guard using transient storage or storage bitmasks.",
    "conceptInvariant": "Function Visibility Gas Invariant: Functions intended strictly for external consumption must be marked `external`; marking an external function as `public` forces calldata arguments to be copied to memory for hypothetical internal calls, wasting gas on every invocation.",
    "failureMode": "Creating a reentrancy guard using a uint256 variable that sets `status = 1` then `status = 2`; because it transitions storage from non-zero to non-zero, it costs 2,200 gas per invocation; failing to clear status leaves the contract locked if an external call reverts.",
    "tryItFriction": "Implement an enterprise Vault contract in Solidity: create custom modifiers for access control and a custom gas-efficient nonReentrant guard using uint256 (1 = NOT_ENTERED, 2 = ENTERED); benchmark bytecode size differences between inline modifier logic vs internal function calls; and prove that reentrant withdrawals revert.",
    "socraticHints": [
      "Why does OpenZeppelin's ReentrancyGuard use values 1 and 2 instead of booleans (false and true)?",
      "Because in the EVM, writing a non-zero value to a zero slot (0 &rarr; 1, false &rarr; true) costs 20,000 gas (cold SSTORE)! Writing non-zero to non-zero (1 &rarr; 2) costs only 2,900 gas (warm SSTORE)! Setting back to 1 costs 100 gas!",
      "Initializing the slot to 1 at deployment avoids the expensive 20,000 gas initialization on every user call!"
    ],
    "situationalPuzzle": {
      "scenario": "A protocol hits the maximum Ethereum contract bytecode size limit (EIP-170: 24,576 bytes). The developer notices that a heavy modifier 'modifier checkPermissions(address user, uint256 role)' is applied to 25 external functions. Why did applying this modifier cause the contract bytecode to explode past the limit?",
      "options": [
        "Modifiers are stored in external libraries.",
        "Modifier Inlining Bytecode Bloat: Solidity modifiers are literally copy-pasted inline by the compiler into every single function they decorate! A 300-byte modifier applied to 25 functions injects 7,500 bytes of duplicate bytecode! The fix: have the modifier call an 'internal' helper function: 'modifier checkPermissions(...) { _checkPermissions(...); _; }'. The logic is compiled once, saving 7KB of bytecode.",
        "EIP-170 only applies to ERC-20 tokens.",
        "Modifiers require extra memory slots."
      ],
      "answerIdx": 1,
      "debrief": "Solidity modifiers are inlined at every usage site. Decorating dozens of functions with complex modifier logic rapidly blows past Ethereum's 24KB bytecode size limit (EIP-170). The standard enterprise solution is Modifier Pattern Refactoring: delegate modifier execution to a shared internal function to keep bytecode lean."
    },
    "quests": [
      {
        "id": "bc-m1-d12-q1",
        "name": "EVM Function Selector & Dispatcher Table Architecture",
        "type": "concept",
        "desc": "Analyze how Solidity compiles function signatures into 4-byte selectors (keccak256) and routes calls via an assembly binary search dispatcher."
      },
      {
        "id": "bc-m1-d12-q2",
        "name": "EIP-170 Contract Bytecode Size & Modifier Profiler",
        "type": "detective",
        "desc": "Benchmark bytecode sizes across contracts comparing raw inlined modifiers vs internal function refactoring to prevent EIP-170 breaches."
      },
      {
        "id": "bc-m1-d12-q3",
        "name": "Gas-Optimized Access Control & Reentrancy Module",
        "type": "mastery",
        "desc": "Implement an audited access control module in Solidity with 2-step ownership transfer, role bitmasks, and an optimized reentrancy guard."
      },
      {
        "id": "bc-m1-d12-q4",
        "name": "3 AM SRE: Contract Deployment Rejection Under EIP-170 Limit",
        "type": "incident",
        "desc": "Resolve a high-severity deployment blocker where a critical protocol upgrade failed on mainnet due to exceeding the 24,576-byte size limit."
      }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "Contract Interoperability: call, delegatecall, staticcall & Context Preservation",
    "stageName": "Stage 2: Core Engineering & Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Low-Level Cross-Contract Calls (Call Opcodes, Contexts & Delegatecall Physics)",
    "spokenGoal": "Master low-level contract interactions: the foundation of proxy patterns, multi-sigs, and DeFi composability. Analyze the three EVM call opcodes: 1) `call` (executes code at target contract in the TARGET's context: target storage, target msg.sender = caller); 2) `delegatecall` (executes code at target contract in the CALLER'S context: caller's storage, caller's msg.sender, caller's msg.value preserved!); and 3) `staticcall` (read-only execution, reverts instantly if state modification opcodes like SSTORE or CREATE are attempted). Deconstruct Return Data Copying: capturing arbitrary return data with `returndatasize()` and `returndatacopy()`. Understand the extreme perils of uncontrolled `delegatecall` (the Parity Multi-Sig Hack).",
    "conceptInvariant": "Context Preservation Invariant: In a `delegatecall`, code is executed from the target address, but execution context (msg.sender, msg.value, and all storage mutations) belongs strictly to the calling contract; modifying storage in the target contract mutates the caller's storage slots.",
    "failureMode": "Executing a `delegatecall` to an untrusted contract address passed as a user parameter; the attacker points the call to a malicious contract that writes to storage slot 0, instantly seizing ownership of the caller contract and stealing all assets.",
    "tryItFriction": "Construct a minimal Proxy-Implementation architecture in Solidity using low-level assembly: write an Implementation contract with a state variable `uint256 count`; write a Proxy contract that uses `delegatecall` in its `fallback()` function to forward all calls; demonstrate that calling increment() on the proxy mutates the proxy's storage slot 0 while the implementation's slot 0 remains 0.",
    "socraticHints": [
      "What is the difference between 'msg.sender' in a standard call versus a delegatecall?",
      "In a standard CALL (A calls B, B calls C), when C reads msg.sender, it sees B! In a DELEGATECALL (A calls B, B delegatecalls C), when C reads msg.sender, it sees A! The original caller is preserved!",
      "This allows libraries and proxies to act on behalf of the original caller."
    ],
    "situationalPuzzle": {
      "scenario": "A DeFi contract executes a token transfer using: 'token.call(abi.encodeWithSignature(\"transfer(address,uint256)\", to, amount))'. The call returns 'bool success = true'. The developer assumes the transfer succeeded. In reality, the user had 0 tokens and no transfer occurred! How did 'success = true' mislead the contract?",
      "options": [
        "The EVM has an opcode bug.",
        "Ignoring Return Data vs Call Success: Low-level 'call' returns 'success = true' as long as the target contract did not revert! However, many tokens (like USDT) or non-existent contracts return true without reverting! Furthermore, ERC-20 tokens return a boolean (true/false) in the return data! The contract only checked that the EVM didn't revert, failing to check that the returned boolean was actually 'true'! The solution: use OpenZeppelin's SafeERC20 'safeTransfer()'.",
        "USDT does not support EVM calls.",
        "The gas limit was set to 0."
      ],
      "answerIdx": 1,
      "debrief": "Low-level .call() only indicates whether the EVM sub-context halted cleanly without a revert. It does NOT indicate that the underlying business logic returned true! In ERC-20 interactions, some tokens return false without reverting, and older tokens return no data at all. Never use raw .call() for token transfers; always use OpenZeppelin SafeERC20."
    },
    "quests": [
      {
        "id": "bc-m1-d13-q1",
        "name": "EVM Call Frame Context & Stack State Mathematical Proof",
        "type": "concept",
        "desc": "Map execution frames and environment variables across CALL, DELEGATECALL, and STATICCALL conforming to Yellow Paper rules."
      },
      {
        "id": "bc-m1-d13-q2",
        "name": "Historical Delegatecall Exploit Forensic Audit",
        "type": "detective",
        "desc": "Reconstruct the Parity Multi-Sig $30M wallet hack (2017) in Foundry, demonstrating how uninitialized delegatecall logic enabled wallet takeover."
      },
      {
        "id": "bc-m1-d13-q3",
        "name": "Assembly Delegatecall Proxy & Return Data Forwarder",
        "type": "mastery",
        "desc": "Build a universal forwarder proxy in Yul assembly that handles calldata forwarding, gas propagation, returndata copying, and error bubbling."
      },
      {
        "id": "bc-m1-d13-q4",
        "name": "3 AM SRE: Silent Token Transfer Failure in Lending Liquidation",
        "type": "incident",
        "desc": "Resolve a production liquidation outage where a protocol accepted false-positive token transfers from non-reverting legacy ERC-20 contracts."
      }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "Events, ABI Encoding & Bloom Filters: Topics, Indexed Parameters & Off-Chain Indexing",
    "stageName": "Stage 2: Core Engineering & Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Logging & Asynchronous Indexing (EVM Logs, Topics & Bloom Filters)",
    "spokenGoal": "Understand how smart contracts communicate with the outside world asynchronously: EVM Events and Logs. Contrast on-chain storage (expensive, accessible to smart contracts) with EVM Logs (cheap: 375 gas + 8 gas per byte, completely inaccessible to smart contracts, accessible only to off-chain applications). Dissect the structure of an Event: up to 3 `indexed` parameters (stored as 32-byte <code>topics</code>) plus non-indexed parameters (ABI-encoded in the log data payload). Topic 0 is reserved for the event signature hash: `keccak256(\"Transfer(address,address,uint256)\")`. Master Ethereum's 2048-bit (256-byte) Logs Bloom Filter in every block header, enabling sub-second log querying across millions of blocks.",
    "conceptInvariant": "Log Inaccessibility Invariant: EVM logs (LOG0 through LOG4 opcodes) write directly to the transaction receipt and are indexed in the block's Bloom filter; smart contracts cannot read past or present logs during execution\u2014they exist solely for off-chain indexing.",
    "failureMode": "Attempting to read past event logs inside a Solidity smart contract to verify a user's previous action; the code fails to compile because the EVM has zero opcodes capable of inspecting logs from within contract execution.",
    "tryItFriction": "Construct an off-chain Event Indexer in TypeScript: connect to a local Anvil/Hardhat node via Viem/Ethers; deploy an ERC-20 contract; execute 20 transfers; filter logs matching Topic 0 (Transfer event signature) and Topic 1 (sender address); decode ABI data payloads; and build an in-memory balance ledger from event logs alone.",
    "socraticHints": [
      "Why can an event have at most 3 indexed parameters in Solidity?",
      "Because the EVM only defines opcodes LOG0, LOG1, LOG2, LOG3, and LOG4! LOG4 supports at most 4 topics total! Since Topic 0 is permanently reserved for the event signature hash, only 3 topics remain for indexed parameters!",
      "If you declare 4 indexed parameters, Solidity rejects the contract with a compiler error."
    ],
    "situationalPuzzle": {
      "scenario": "An NFT marketplace emits an event: 'event OrderCreated(address indexed maker, string metadataUrl)'. A frontend developer queries the blockchain for orders by filtering on 'metadataUrl'. The query returns zero results or throws an RPC error. Why couldn't the developer filter logs by the string 'metadataUrl'?",
      "options": [
        "Strings are illegal in events.",
        "Unindexed vs Indexed String Topic Hashing: The parameter 'metadataUrl' was NOT marked as 'indexed', so it was packed into the unindexed data payload, which nodes cannot filter by! If it HAD been marked 'indexed', dynamic types (strings, bytes, arrays) are hashed with keccak256 before being stored as Topic! Filtering by the raw string still fails unless you query the keccak256 hash of the string!",
        "The blockchain deleted the logs.",
        "Logs can only be queried by block number."
      ],
      "answerIdx": 1,
      "debrief": "In EVM events, only 'indexed' parameters are searchable topics. Furthermore, if a dynamic type (string, bytes, or array) is marked 'indexed', the EVM does NOT store the raw string in the topic\u2014it stores 'keccak256(string)'. To search for an indexed string, off-chain indexers must filter by its 32-byte Keccak-256 hash."
    },
    "quests": [
      {
        "id": "bc-m1-d14-q1",
        "name": "EVM Log Opcodes & 2048-Bit Bloom Filter Mathematics",
        "type": "concept",
        "desc": "Derive the false-positive probability of Ethereum's 2048-bit block Bloom filter with 3 hash functions across N logged topics."
      },
      {
        "id": "bc-m1-d14-q2",
        "name": "ABI Encoding & Log Data Unpacking Linter",
        "type": "detective",
        "desc": "Build a parser decoding raw hex transaction receipt logs into structured JSON events using contract ABI definitions."
      },
      {
        "id": "bc-m1-d14-q3",
        "name": "Real-Time Web3 Event Indexing Engine in TypeScript",
        "type": "mastery",
        "desc": "Implement a real-time event listener in TypeScript tracking transfer logs, handling reorg rollbacks, and updating an in-memory SQL database."
      },
      {
        "id": "bc-m1-d14-q4",
        "name": "3 AM SRE: Missing Marketplace Events Crashing Web3 Frontend",
        "type": "incident",
        "desc": "Resolve a production outage where missing indexed log topics caused an NFT exchange frontend to fail to display incoming purchase orders."
      }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "Milestone 3: Gas-Optimized Decentralized Escrow & Multi-Sig Vault Contract",
    "stageName": "Stage 2: Core Engineering & Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Block 3 Capstone Project & Architectural Gate",
    "spokenGoal": "Synthesize the entire discipline of Solidity type safety, data locations, function visibility, low-level calls, and event logging into a production financial protocol: The Gas-Optimized Decentralized Escrow & Multi-Sig Vault Contract. In this milestone, architect an institutional-grade treasury contract: manage multi-party escrow deposits with milestone releases; implement an M-of-N Multi-Signature approval system; enforce 2-step ownership and role-based permissions; implement low-level reentrancy-safe ether and ERC-20 transfers; optimize storage layout to minimize SSTORE gas costs; and emit structured events for real-time off-chain indexing.",
    "conceptInvariant": "Solvent Treasury Invariant: The contract must maintain mathematical solvency at all times: total assets held in custody must strictly equal or exceed the sum of all active escrow liabilities (&sum; escrow_balances &le; contract_balance); zero funds can be withdrawn without verifiable cryptographic authorization.",
    "failureMode": "Failing the milestone gate when an attacker executes a reentrant call during escrow refund, drains funds via unchecked return data, or causes contract state corruption through un-packed storage variables.",
    "tryItFriction": "Construct and deliver the complete Solidity 0.8.20 + Foundry milestone contract: deploy a 2-of-3 Multi-Sig Escrow Vault; fund it with 10 ETH and 50,000 mock USDC; execute a multi-signature transaction proposal; gather 2 valid ECDSA off-chain signatures; execute the transaction via a low-level call; verify zero reentrancy vulnerabilities; and prove gas optimization via Forge gas snapshots.",
    "socraticHints": [
      "Why must multi-sig transaction hashes include the contract address and chainId?",
      "To prevent Signature Replay Attacks! Without the contract address and chainId embedded in the signed message hash, a valid multi-sig signature executed on Vault A could be copied and executed against Vault B on the same chain or across Ethereum, Polygon, and Arbitrum!",
      "Always follow EIP-712 structured typed data signing standards."
    ],
    "situationalPuzzle": {
      "scenario": "During your Milestone 3 review, an examiner submits an escrow release transaction where the recipient is a malicious contract that calls 'vault.releaseEscrow()' again inside its 'receive()' fallback function. How does your contract protect itself against this reentrancy attack?",
      "options": [
        "The vault crashes.",
        "Checks-Effects-Interactions (CEI) & Non-Reentrant Lock: The contract enforces CEI: 1) Checks: verify escrow is active and caller is authorized; 2) Effects: set 'escrow.status = RELEASED' and zero the balance in on-chain storage BEFORE touching external calls; 3) Interactions: transfer funds via low-level call. When the attacker's fallback function re-enters, the escrow status is already marked RELEASED, causing the second call to revert immediately.",
        "Reentrancy attacks are impossible in Solidity 0.8+.",
        "Set gas limit to 21,000."
      ],
      "answerIdx": 1,
      "debrief": "The Checks-Effects-Interactions (CEI) pattern is the golden rule of smart contract security. By updating internal accounting state and setting status flags BEFORE making external calls, any reentrant attempt encounters already-updated state and reverts cleanly."
    },
    "quests": [
      {
        "id": "bc-m1-d15-q1",
        "name": "Multi-Sig Escrow Formal Security Model",
        "type": "concept",
        "desc": "Produce the formal state machine and invariant proof detailing M-of-N signature quorum verification and escrow lifecycle transitions."
      },
      {
        "id": "bc-m1-d15-q2",
        "name": "Foundry Reentrancy Attack & Penetration Suite",
        "type": "detective",
        "desc": "Build a malicious attacker contract in Foundry attempting reentrancy and signature replay against the Multi-Sig Escrow Vault."
      },
      {
        "id": "bc-m1-d15-q3",
        "name": "Production Multi-Sig Escrow Vault Implementation",
        "type": "mastery",
        "desc": "Author and test the complete Solidity contract in Foundry with EIP-712 signature verification, SafeERC20 transfers, and CEI compliance."
      },
      {
        "id": "bc-m1-d15-q4",
        "name": "Milestone 3 Viva Gate: Treasury Architecture Defense",
        "type": "incident",
        "desc": "Defend the vault architecture before the Senior Web3 Architecture Board, demonstrating live exploit resistance and gas optimization proofs."
      }
    ]
  },
  {
    "day": 16,
    "month": 1,
    "blockNum": 4,
    "title": "ERC-20 Fungible Token Standard: Approvals, transferFrom & EIP-2612 Permit Signatures",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Tokenized Economics (Fungible Tokens, Approvals & Gasless Permits)",
    "spokenGoal": "Master the financial backbone of decentralized finance: The ERC-20 Fungible Token Standard. Dissect the 6 core methods: `totalSupply()`, `balanceOf()`, `transfer()`, `transferFrom()`, `approve()`, and `allowance()`. Confront the critical design flaw in classic ERC-20 approvals: the Allowance Front-Running attack (changing allowance from 100 to 50 allows an observant spender to front-run the transaction, spend 100, and then spend the new 50, taking 150 total). Solve this using `increaseAllowance` / `decreaseAllowance`. Master the modern standard for gasless user onboarding: EIP-2612 Permit, which uses EIP-712 off-chain cryptographic signatures to approve token spending in a single atomic transaction without requiring the user to hold native ETH for gas.",
    "conceptInvariant": "Conservation of Token Supply Invariant: The sum of all user balances must strictly equal total supply at all times: &sum; balanceOf(u) == totalSupply(); transfers must update sender and recipient balances atomically without creating or destroying tokens unless explicit mint/burn events occur.",
    "failureMode": "Calling 'token.approve(spender, newAmount)' without setting allowance to 0 first or using safeIncreaseAllowance; a malicious spender spots the transaction in the public mempool, front-runs with transferFrom(), and drains both the old and new allowances.",
    "tryItFriction": "Implement an ERC-20 token in Solidity 0.8.20 with EIP-2612 Permit: build EIP-712 domain separator; verify off-chain secp256k1 signatures (v, r, s) with deadline and replay-preventing nonces; write a Foundry test that signs a permit in TypeScript and executes a gasless deposit into a vault in one transaction.",
    "socraticHints": [
      "Why does EIP-2612 Permit require an account-specific 'nonce' in the signed hash?",
      "Because without an incremental nonce, the signed permit could be replayed over and over again until the deadline expires! An attacker could submit the exact same signature multiple times to reset the user's allowance!",
      "Incrementing 'nonces[owner]++' guarantees that every signature is consumed exactly once."
    ],
    "situationalPuzzle": {
      "scenario": "A DEX router attempts to transfer tokens on behalf of a user using: 'IERC20(token).transferFrom(user, address(this), amount)'. When interacting with USDT on Ethereum mainnet, the transaction reverts with no error message, even though the user has plenty of USDT and approved the router. Why does standard IERC20 fail with USDT?",
      "options": [
        "USDT is not an EVM token.",
        "Missing Return Value in Non-Standard ERC-20: The official ERC-20 specification defines 'transferFrom' as returning a boolean ('returns (bool)'). However, Tether (USDT) on mainnet was deployed before Solidity standardized this and returns VOID (no return data)! The Solidity compiler expects 32 bytes of return data; receiving 0 bytes causes the call to revert! The solution is to use OpenZeppelin's 'SafeERC20.safeTransferFrom()'.",
        "USDT requires a 10% fee on transfer.",
        "The router ran out of memory."
      ],
      "answerIdx": 1,
      "debrief": "Tether USD (USDT) and BNB are famous for violating the ERC-20 specification by not returning a boolean value from transfer/transferFrom/approve. Compiling against a standard interface expecting a bool causes the transaction to revert due to returndata size checks. OpenZeppelin's SafeERC20 inspects returndatasize to handle both standard and legacy tokens gracefully."
    },
    "quests": [
      {
        "id": "bc-m1-d16-q1",
        "name": "EIP-2612 & EIP-712 Domain Separator Cryptographic Specification",
        "type": "concept",
        "desc": "Derive the mathematical structure of EIP-712 typed data hashing and permit digest verification conforming to the Ethereum specification."
      },
      {
        "id": "bc-m1-d16-q2",
        "name": "ERC-20 Allowance Front-Running Mempool Simulator",
        "type": "detective",
        "desc": "Build an automated Foundry test reproducing the allowance front-running race condition and benchmark increaseAllowance mitigations."
      },
      {
        "id": "bc-m1-d16-q3",
        "name": "Gas-Optimized ERC-20 with EIP-2612 Permit in Foundry",
        "type": "mastery",
        "desc": "Author an enterprise ERC-20 token in Solidity featuring permit signatures, custom errors, and comprehensive Foundry unit tests."
      },
      {
        "id": "bc-m1-d16-q4",
        "name": "3 AM SRE: Stalled DEX Swaps from USDT Return Value Incompatibility",
        "type": "incident",
        "desc": "Lead the emergency remediation of a high-volume DEX pool frozen due to non-standard ERC-20 return values by deploying SafeERC20 wrappers."
      }
    ]
  },
  {
    "day": 17,
    "month": 1,
    "blockNum": 4,
    "title": "ERC-721 Non-Fungible Token (NFT) Standard: safeTransferFrom, Receiver Hooks & Metadata",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Unique Asset Economics (Non-Fungibles, Receiver Callbacks & Reentrancy)",
    "spokenGoal": "Explore unique digital ownership: The ERC-721 Non-Fungible Token Standard. Contrast fungible token accounting (balances mapped to amounts) with non-fungible asset tracking (each unique uint256 `tokenId` is owned by exactly one address). Understand `safeTransferFrom` versus `transferFrom`: why `safeTransferFrom` checks if the recipient is a smart contract, and if so, invokes `onERC721Received` on the recipient to ensure it can manage NFTs. Unpack the hidden danger of `safeTransferFrom`: invoking external contract callbacks introduces a Reentrancy Vector into token minting and marketplace transfers! Master ERC-721 Metadata: JSON schemas, `tokenURI()`, decentralized IPFS/Arweave storage, and on-chain SVG generation.",
    "conceptInvariant": "Bijective Token Ownership Invariant: Every minted ERC-721 tokenId must map to exactly one owner address; an address may own multiple tokenIds, but no tokenId can have more than one owner or exist without being minted.",
    "failureMode": "Using 'safeTransferFrom' inside an NFT minting loop without a reentrancy guard or updating state before the transfer; a malicious minting contract intercepts the 'onERC721Received' callback, re-entering 'mint()' to bypass max-per-wallet caps and drain the supply.",
    "tryItFriction": "Construct a fully on-chain generative SVG NFT contract in Solidity: generate dynamic SVG markup via string concatenation in assembly; encode metadata as Base64 JSON; implement ERC-721 with safeTransferFrom; write a malicious receiver contract attempting reentrancy; and prove that Checks-Effects-Interactions prevents the exploit.",
    "socraticHints": [
      "Why was 'safeTransferFrom' introduced in ERC-721 when ERC-20 only had 'transfer'?",
      "Because transferring an NFT to a smart contract that doesn't have withdrawal logic locks that unique NFT inside the contract forever! 'safeTransferFrom' calls 'onERC721Received' to confirm the receiving contract explicitly supports NFTs!",
      "However, that external callback creates a dangerous reentrancy vector that developers must guard."
    ],
    "situationalPuzzle": {
      "scenario": "An NFT project implements an allowlist mint with a strict limit: 'maximum 2 NFTs per wallet'. The contract checks 'balanceOf(msg.sender) < 2', then calls '_safeMint(msg.sender, tokenId)'. An attacker deploys a contract and mints 500 NFTs in a single transaction. How did the attacker bypass the 2-NFT limit?",
      "options": [
        "The attacker brute-forced the allowlist.",
        "Reentrancy via onERC721Received Callback: '_safeMint' calls 'onERC721Received' on the caller contract BEFORE the second iteration updates! Inside the callback, the attacker calls 'mint()' again. Because the first mint's balance check passed and the state hasn't finalized or reentrancy isn't blocked, the attacker recurses 500 times before returning! The fix: use a ReentrancyGuard and track minted counts in a dedicated mapping rather than relying on balanceOf().",
        "ERC-721 contracts cannot be called by contracts.",
        "The attacker increased the gas limit."
      ],
      "answerIdx": 1,
      "debrief": "Relying on 'balanceOf(msg.sender)' for mint limits while calling '_safeMint' is an infamous vulnerability. Because '_safeMint' issues an external callback to the receiver contract, an attacker can re-enter the mint function repeatedly before their balance increases. Always use a dedicated 'mapping(address => uint256) public hasMinted' and nonReentrant guards."
    },
    "quests": [
      {
        "id": "bc-m1-d17-q1",
        "name": "ERC-721 Interface & ERC-165 Type Introspection Math",
        "type": "concept",
        "desc": "Derive the mathematical XOR calculation for ERC-165 interface identifiers across all standard ERC-721 and metadata interfaces."
      },
      {
        "id": "bc-m1-d17-q2",
        "name": "_safeMint Reentrancy Penetration Harness",
        "type": "detective",
        "desc": "Build an attacker contract in Foundry exploiting onERC721Received callbacks to bypass per-wallet minting limits."
      },
      {
        "id": "bc-m1-d17-q3",
        "name": "On-Chain Generative SVG ERC-721 Contract",
        "type": "mastery",
        "desc": "Author an audited ERC-721 smart contract in Solidity generating dynamic on-chain SVG artwork and Base64 metadata data URIs."
      },
      {
        "id": "bc-m1-d17-q4",
        "name": "3 AM SRE: $4M NFT Drop Drained by Callback Reentrancy Attack",
        "type": "incident",
        "desc": "Lead the emergency post-mortem of an NFT project launch where bots bypassed mint limits using onERC721Received reentrancy."
      }
    ]
  },
  {
    "day": 18,
    "month": 1,
    "blockNum": 4,
    "title": "ERC-1155 Multi-Token Standard: Semi-Fungible Items, Batch Transfers & Gaming Inventories",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Multi-Token Systems (Semi-Fungibility, Batch Operations & Gas Optimization)",
    "spokenGoal": "Scale tokenized asset management to massive virtual economies and gaming inventories: The ERC-1155 Multi-Token Standard. Understand why deploying separate ERC-20 contracts for in-game gold and separate ERC-721 contracts for 1,000 game items is an architectural disaster: deploying 1,000 contracts consumes millions in gas and clutters the state trie. Enter ERC-1155: a single contract managing an infinite combination of Fungible tokens (currency: tokenId 1, balance 1,000,000), Non-Fungible tokens (legendary swords: tokenId 2, balance 1), and Semi-Fungible tokens (concert tickets that become memorabilia after the event). Master Batch Operations: `safeBatchTransferFrom` transferring 50 distinct token types in a single transaction, slashing gas costs by up to 85%.",
    "conceptInvariant": "Multi-Asset Matrix Invariant: ERC-1155 manages asset balances as a two-dimensional matrix: mapping(uint256 id => mapping(address account => uint256 balance)); a single contract simultaneously governs both fungible and non-fungible asset spaces.",
    "failureMode": "Using individual ERC-721 contracts to distribute 50 items in a game lootbox; transferring 50 items requires 50 separate transactions or 50 external calls, costing over 2,500,000 gas and bankrupting the game studio.",
    "tryItFriction": "Implement an ERC-1155 Game Economy contract in Solidity 0.8.20: define fungible gold (ID 0) and unique armor sets (IDs 1-5); implement safeBatchTransferFrom; write a batch receiver callback implementing IERC1155Receiver; and write a Foundry test measuring gas savings of a single batch transfer versus 5 separate transfers.",
    "socraticHints": [
      "How does ERC-1155 handle token metadata URLs with a single string?",
      "By using the '{id}' substitution string! ERC-1155 defines 'uri(uint256 id)' where clients replace '{id}' with the 64-character lowercase hex representation of the token ID! A single URI string points to an entire collection of thousands of items!",
      "This eliminates individual tokenURI storage slots, saving massive deployment gas."
    ],
    "situationalPuzzle": {
      "scenario": "A game developer allows players to trade items via a smart contract that accepts ERC-1155 tokens. The contract implements 'onERC1155Received' and 'onERC1155BatchReceived'. When a player sends items, the contract verifies the items arrived, but forgets to return the magic 4-byte selector 'IERC1155Receiver.onERC1155Received.selector'. What happens to the transaction?",
      "options": [
        "The items are lost permanently.",
        "Automatic Transaction Revert: The ERC-1155 standard mandates that if the recipient is a contract, it MUST return the exact 4-byte selector 'bytes4(keccak256(\"onERC1155Received(...)\"))'! If the recipient returns any other value or fails to return, the ERC-1155 contract intentionally reverts the transaction, preventing tokens from getting stuck in contracts that cannot handle them.",
        "The tokens convert into ETH.",
        "The gas fee is doubled."
      ],
      "answerIdx": 1,
      "debrief": "ERC-1155 enforces strict safety: receiving contracts must explicitly return the magic 4-byte selector '0xf23a6e61'. If a recipient contract omits this return statement, the sending contract's safeTransfer logic assumes the receiver cannot handle ERC-1155 tokens and reverts immediately, protecting user assets."
    },
    "quests": [
      {
        "id": "bc-m1-d18-q1",
        "name": "ERC-1155 vs ERC-721 Storage & Gas Economics Model",
        "type": "concept",
        "desc": "Calculate theoretical and practical gas consumption curves comparing 100 asset transfers in ERC-721 vs an ERC-1155 batch transfer."
      },
      {
        "id": "bc-m1-d18-q2",
        "name": "IERC1155Receiver Magic Selector Compliance Linter",
        "type": "detective",
        "desc": "Build an automated testing script verifying that contract receivers return exact ERC-1155 magic selectors across single and batch transfers."
      },
      {
        "id": "bc-m1-d18-q3",
        "name": "Production ERC-1155 Gaming Economy & Batch Vault",
        "type": "mastery",
        "desc": "Author and test a complete ERC-1155 multi-token smart contract in Foundry supporting fungible currencies, batch transfers, and metadata URIs."
      },
      {
        "id": "bc-m1-d18-q4",
        "name": "3 AM SRE: Stuck Game Items from Missing Magic Selector Return",
        "type": "incident",
        "desc": "Fix an urgent gaming platform bug where player deposits reverted due to an unhandled selector return in an escrow smart contract."
      }
    ]
  },
  {
    "day": 19,
    "month": 1,
    "blockNum": 4,
    "title": "ERC-4626 Tokenized Vault Standard: Yield Assets, Share Math & Rounding Direction Attacks",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "DeFi Composability (Yield-Bearing Vaults, Share Pricing & Rounding Exploits)",
    "spokenGoal": "Master the gold standard of modern DeFi composability: The ERC-4626 Tokenized Vault Standard. Understand the problem ERC-4626 solved: prior to 2022, every yield protocol (Yearn, Compound, Aave) used bespoke interfaces for deposits, shares, and redemptions, making multi-protocol yield aggregation a nightmare. Analyze the core ERC-4626 functions: `deposit()`, `mint()`, `withdraw()`, `redeem()`, `totalAssets()`, `convertToShares()`, and `convertToAssets()`. Deep-dive into Share Accounting Mathematics: assets / shares ratios. Confront the deadly Inflation Attack (First Depositor Rounding Exploit): how an attacker deposits 1 wei of assets, donates 10,000 tokens directly to the vault, inflates share price, and causes subsequent user deposits to round down to 0 shares, stealing their funds! Master virtual shares/assets mitigations.",
    "conceptInvariant": "Vault Rounding Direction Invariant: Conversions must round in favor of the vault, never the user: convertToShares (deposit) must round DOWN (floor); convertToAssets (withdraw) must round UP (ceiling); any violation allows attackers to extract free wei on every interaction.",
    "failureMode": "Rounding share calculation UP on deposits; an attacker deposits 1 wei, gets 1 share, redeems for 1 wei, but extracts fractional rounding profit repeatedly, draining the vault through automated micro-arbitrage.",
    "tryItFriction": "Implement an ERC-4626 Tokenized Vault in Solidity 0.8.20: write share-to-asset conversion formulas; implement virtual offset shares (OpenZeppelin ERC4626 virtual shares pattern: +1e3 offset) to neutralize first-depositor inflation attacks; and write a Foundry fuzz test proving that zero user funds are lost during extreme front-running donation attempts.",
    "socraticHints": [
      "Why does a donation of 10,000 tokens to an empty vault with 1 wei of shares break share math for the next user?",
      "Because the share price becomes: totalAssets / totalShares = 10,001 / 1! If the next user deposits 5,000 tokens, their shares minted = (5,000 * 1) / 10,001 = 0 (due to integer truncation)! The user receives 0 shares, but the vault keeps their 5,000 tokens!",
      "The attacker burns their 1 share and takes all 15,000 tokens!"
    ],
    "situationalPuzzle": {
      "scenario": "A new yield aggregator launches an ERC-4626 vault. The first user deposits 100 USDC and receives 100 shares. A yield farming reward of 50 USDC is sent to the vault, bringing totalAssets to 150 USDC. The user calls 'redeem(50 shares)'. How many USDC does the user receive, and why does the share price increase?",
      "options": [
        "The user receives 50 USDC.",
        "Proportional Share Value Accrual: The user receives 75 USDC! Since totalAssets = 150 and totalShares = 100, each share is now worth 1.5 USDC (150 / 100). Redeeming 50 shares returns 50 * 1.5 = 75 USDC! The vault's remaining 50 shares are now worth 75 USDC. Yield accrual passively increases the asset value of existing shares without changing share balances.",
        "The user receives 150 USDC.",
        "ERC-4626 vaults cannot accept external yield."
      ],
      "answerIdx": 1,
      "debrief": "In ERC-4626 vaults, yield is not distributed by minting new tokens to users. Instead, as the vault earns yield, 'totalAssets()' increases while 'totalShares()' remains constant. This passively drives up the exchange rate (assets per share), allowing shareholders to withdraw more underlying assets upon redemption."
    },
    "quests": [
      {
        "id": "bc-m1-d19-q1",
        "name": "ERC-4626 Share-to-Asset Exchange Rate Mathematical Proof",
        "type": "concept",
        "desc": "Formulate the exact exchange rate equations and prove why integer division rounding directions must strictly favor vault solvency."
      },
      {
        "id": "bc-m1-d19-q2",
        "name": "ERC-4626 First Depositor Inflation Attack Penetration Harness",
        "type": "detective",
        "desc": "Build an automated exploit in Foundry demonstrating the 1-wei deposit donation attack and benchmark virtual share offset mitigations."
      },
      {
        "id": "bc-m1-d19-q3",
        "name": "Production ERC-4626 Yield-Bearing Vault in Foundry",
        "type": "mastery",
        "desc": "Implement an audited ERC-4626 vault in Solidity supporting underlying ERC-20 assets, slippage limits, virtual shares, and yield simulation."
      },
      {
        "id": "bc-m1-d19-q4",
        "name": "3 AM SRE: $6M Stolen via Vault Inflation Attack on New Deployment",
        "type": "incident",
        "desc": "Triage a live mainnet incident where a newly deployed lending market was exploited by a first-depositor share inflation attack."
      }
    ]
  },
  {
    "day": 20,
    "month": 1,
    "blockNum": 4,
    "title": "Milestone 4: Enterprise ERC-20/721/4626 Yield-Bearing Liquidity Vault Protocol",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Block 4 Capstone Project & Architectural Gate",
    "spokenGoal": "Synthesize the complete discipline of token standards, gasless EIP-2612 permits, non-fungible receipt tokens, and ERC-4626 share accounting into an enterprise DeFi protocol: The Enterprise Yield-Bearing Liquidity Vault Protocol. In this milestone, architect an end-to-end liquidity management system: accept underlying ERC-20 deposits using gasless EIP-2612 signatures; issue ERC-4626 yield-bearing vault shares; mint dynamic ERC-721 Position NFTs representing lock-up tiers and yield boosts; implement virtual share offsets to eliminate inflation attacks; enforce strict rounding direction safety; and benchmark gas consumption across deposit, compound, and redeem lifecycles.",
    "conceptInvariant": "Composite Token Protocol Invariant: The protocol must maintain 100% solvency across composite asset tiers: underlying ERC-20 reserves must match ERC-4626 share liabilities, and every minted ERC-721 position NFT must correspond to an active, locked vault allocation.",
    "failureMode": "Failing the milestone gate when an inflation attack dilutes second depositors, when EIP-2612 permit signatures are vulnerable to replay, or when ERC-721 transfer callbacks allow reentrant share minting.",
    "tryItFriction": "Construct and deliver the complete Solidity 0.8.20 + Foundry milestone protocol: deploy underlying token, ERC-4626 vault, and ERC-721 position manager; execute an end-to-end deposit flow where a user signs an off-chain permit, deposits 1,000 tokens, receives vault shares, and claims an NFT receipt in one transaction; simulate 20% external yield; and prove that all shareholders can redeem full principal + yield without loss.",
    "socraticHints": [
      "How do we prevent rounding errors when dealing with tokens that have different decimal precisions (e.g. 6-decimal USDC vs 18-decimal shares)?",
      "By normalizing decimals! An ERC-4626 vault with 18-decimal shares wrapping a 6-decimal token like USDC must scale calculations by 10^(18 - 6) = 10^12! Failing to account for decimal differences causes 10^12x over-minting or under-minting of shares!",
      "Always override decimals() and test multi-decimal asset pairings."
    ],
    "situationalPuzzle": {
      "scenario": "During the milestone viva, the examiner attempts to drain the vault by executing a sandwich attack: 1) Sees a large 100,000 USDC deposit in the mempool; 2) Front-runs by depositing 50,000 USDC; 3) Lets the victim deposit; 4) Back-runs by immediately redeeming. If your vault has a 0.5% deposit fee and virtual shares, why does the attacker lose money?",
      "options": [
        "The blockchain froze the attacker's wallet.",
        "Deposit Fee & Slippage Protection Neutralizing Arbitrage: In a standard ERC-4626 vault, deposit and redeem prices are symmetric and determined strictly by totalAssets / totalShares! A user deposit does NOT alter the share price (both assets and shares increase proportionally)! The attacker gains zero price advantage, but pays a 0.5% deposit fee on entry, losing $250 immediately to the protocol treasury.",
        "Sandwich attacks only work on Uniswap.",
        "The examiner gets disqualified."
      ],
      "answerIdx": 1,
      "debrief": "Unlike AMM automated market makers where large trades move the spot price curve, standard ERC-4626 vault deposits mint shares at the exact current net asset value (NAV). A deposit does not inflate share prices for subsequent users. Incorporating entry/exit fees or lockup periods completely disincentivizes flash deposits."
    },
    "quests": [
      {
        "id": "bc-m1-d20-q1",
        "name": "Enterprise Tokenized Vault Architecture Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive multi-token system architecture detailing ERC-20 permit flows, ERC-4626 virtual share math, and ERC-721 position receipts."
      },
      {
        "id": "bc-m1-d20-q2",
        "name": "Foundry Comprehensive Multi-Token Fuzzing Suite",
        "type": "detective",
        "desc": "Execute 50,000 randomized fuzzing runs in Foundry asserting zero share inflation loss, decimal normalization, and permit replay resistance."
      },
      {
        "id": "bc-m1-d20-q3",
        "name": "Production ERC-20/721/4626 Vault Protocol Build",
        "type": "mastery",
        "desc": "Author and test the complete production protocol in Solidity and Foundry integrating gasless permits, yield vaults, and NFT position receipts."
      },
      {
        "id": "bc-m1-d20-q4",
        "name": "Milestone 4 Viva Gate: Token Standards & DeFi Architecture Defense",
        "type": "incident",
        "desc": "Defend the vault architecture before the Senior Web3 Architecture Board, demonstrating live inflation attack resistance and decimal scaling."
      }
    ]
  },
  {
    "day": 21,
    "month": 1,
    "blockNum": 5,
    "title": "Reentrancy Attacks & Mitigations: Classic Reentrancy (The DAO), Read-Only Reentrancy & CEI",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Smart Contract Security (Control Flow Hijacking, Reentrancy & CEI Physics)",
    "spokenGoal": "Study the most infamous vulnerability in blockchain history: Reentrancy. Dissect the 2016 DAO Hack ($60M stolen, leading to the Ethereum/Ethereum Classic hard fork): how an external call (`msg.sender.call{value: amount}(\"\")`) transfers control to an untrusted contract BEFORE internal state (`balances[msg.sender] -= amount`) is decremented, allowing the attacker to recursively drain funds. Expand beyond classic reentrancy to modern threat vectors: Cross-Function Reentrancy (re-entering a different function sharing state) and Read-Only Reentrancy (an external call in Protocol A temporarily leaves reserves out of balance; Protocol B reads Protocol A's view function during the call, computing a corrupted collateral price and borrowing unbacked funds!). Master the Checks-Effects-Interactions (CEI) pattern and ReentrancyGuard.",
    "conceptInvariant": "Checks-Effects-Interactions (CEI) Invariant: All conditions must be validated (Checks), and all internal state variables must be mutated (Effects) BEFORE making any external call or ether transfer (Interactions); external execution must never occur in the presence of stale state.",
    "failureMode": "Making an external call before updating on-chain balances: '(bool s, ) = msg.sender.call{value: bal}(\"\"); balances[msg.sender] = 0;' The attacker's fallback function re-enters the withdraw function repeatedly, draining the contract's entire ETH balance.",
    "tryItFriction": "Construct a complete Read-Only Reentrancy exploit in Foundry: create a Lending Pool that calculates LP share prices based on a Curve-style StableSwap pool; trigger a flash-loan remove_liquidity callback where the pool balance is temporarily drained; execute a read-only reentrant call from a lending contract that queries the pool's get_virtual_price(); borrow massive collateral at an inflated price; and verify how an on-chain reentrancy lock on view functions prevents the attack.",
    "socraticHints": [
      "Why doesn't a standard 'nonReentrant' modifier on the withdraw function prevent Read-Only Reentrancy?",
      "Because the vulnerable view function in Protocol A is a 'view' function, which doesn't use the nonReentrant modifier! Protocol B calls that view function from outside! The nonReentrant lock on withdraw only stops re-entering withdraw, NOT external contracts reading state during the call!",
      "Protocols solve this by adding a transient reentrancy guard or checking the lock in view functions."
    ],
    "situationalPuzzle": {
      "scenario": "A developer writes a token swap contract with a nonReentrant modifier on 'swap()'. An auditor reports a critical vulnerability: 'Cross-Contract Reentrancy in Liquidity Provisioning'. How can an attacker execute a reentrancy attack on a contract where every state-modifying function has a nonReentrant modifier?",
      "options": [
        "The compiler disabled the modifier.",
        "Shared State Across Separate Contracts: The protocol is split into two separate contracts: Pool.sol and Vault.sol, but they share the same underlying token balances! Pool.sol has its own nonReentrant lock, and Vault.sol has its own lock! When Pool makes an external call, the attacker cannot re-enter Pool, but CAN enter Vault.sol because Vault has an independent lock! To secure multi-contract systems, the protocol must use a shared global reentrancy lock or strictly adhere to CEI across all contracts.",
        "Reentrancy only works with ETH, not tokens.",
        "The attacker brute-forced the private key."
      ],
      "answerIdx": 1,
      "debrief": "Reentrancy guards only protect the specific contract instance that holds the lock. If a protocol uses multiple contracts that read or modify shared state, an attacker can re-enter a secondary contract that possesses a distinct mutex. This is Cross-Contract Reentrancy. True security requires atomic Checks-Effects-Interactions across the entire system."
    },
    "quests": [
      {
        "id": "bc-m1-d21-q1",
        "name": "Reentrancy Formal Verification & Execution Frame Mechanics",
        "type": "concept",
        "desc": "Model EVM call stack execution frames proving that external calls surrender control flow to arbitrary untrusted recipient code."
      },
      {
        "id": "bc-m1-d21-q2",
        "name": "Read-Only Reentrancy Lending Exploit Harness",
        "type": "detective",
        "desc": "Reproduce a real-world Read-Only Reentrancy attack in Foundry where a manipulated curve pool virtual price drained a lending vault."
      },
      {
        "id": "bc-m1-d21-q3",
        "name": "Audited Multi-Contract CEI Protocol in Solidity",
        "type": "mastery",
        "desc": "Build an escrow protocol in Foundry strictly adhering to Checks-Effects-Interactions with custom reentrancy locks and transient storage."
      },
      {
        "id": "bc-m1-d21-q4",
        "name": "3 AM SRE: $30M Flash Loan Read-Only Reentrancy Exploit",
        "type": "incident",
        "desc": "Lead the emergency war room pausing an on-chain lending protocol being drained by a cross-contract read-only reentrancy attack."
      }
    ]
  },
  {
    "day": 22,
    "month": 1,
    "blockNum": 5,
    "title": "Integer Overflows, Arithmetic Invariants & Underflows: Solidity 0.8+ Panics & unchecked Gas",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Arithmetic Security (Overflow/Underflow Physics, Panic Codes & Unchecked Math)",
    "spokenGoal": "Analyze the mathematics of integer representation in the EVM: 256-bit unsigned integers (uint256 range 0 to 2^256 - 1). Understand how pre-0.8.0 Solidity suffered from catastrophic silent overflows (e.g. 2^256 - 1 + 1 wrapped around to 0, and 0 - 1 underflowed to 2^256 - 1, causing the BeautyChain BEC $1B token hack). Examine Solidity 0.8.0+'s built-in overflow/underflow checks: how the compiler automatically injects EVM comparison opcodes and reverts with Panic code 0x11 upon overflow. Master the `unchecked { ... }` block: understand when it is mathematically provably safe to bypass overflow checks (e.g. loop index increments `unchecked { ++i; }`), saving 100-300 gas per loop iteration without compromising security.",
    "conceptInvariant": "Bounded Arithmetic Invariant: All mathematical operations must either produce mathematically exact results or revert with an on-chain panic; `unchecked` arithmetic must only be employed when inputs are provably bounded by preceding invariants.",
    "failureMode": "Wrapping user-controlled arithmetic inside 'unchecked': 'unchecked { balances[msg.sender] -= amount; balances[recipient] += amount; }' An attacker sends amount > balance, triggering an underflow that gives them 2^256 - 1 tokens instantly.",
    "tryItFriction": "Benchmark unchecked gas optimization in Foundry: write a function that sums an array of 1,000 numbers using standard arithmetic versus `unchecked { ++i; }` loop increments; verify identical execution results; measure 25% gas reduction; and write a test proving that user-facing arithmetic outside unchecked reverts properly on overflow.",
    "socraticHints": [
      "Why is it always mathematically safe to increment a loop counter with 'unchecked { ++i; }' when iterating over an array?",
      "Because the array length cannot physically exceed 2^256 - 1! In fact, due to block gas limits, an array in memory or storage can never exceed a few thousand items! It is physically impossible for the loop counter 'i' to ever reach 2^256 - 1 and overflow!",
      "Therefore, the compiler's overflow check on ++i is redundant and wastes gas."
    ],
    "situationalPuzzle": {
      "scenario": "A staking contract calculates rewards using: 'uint256 reward = (amount * rewardRate * timeElapsed) / 1e18'. In production, a user stakes a large amount ($50M in wei) for 30 days. The transaction reverts with Panic(0x11) (arithmetic overflow), even though the user's final reward is only $500! Why did the calculation overflow?",
      "options": [
        "The contract ran out of gas.",
        "Intermediate Precision Multiplication Overflow: Even though the final answer fits comfortably in a uint256, the intermediate numerator product (amount * rewardRate * timeElapsed) exceeded 2^256 - 1 before the division by 1e18 could scale it back down! In 256-bit arithmetic, intermediate products must not exceed 2^256 - 1. The solution: use FullMath (512-bit intermediate math) from Uniswap or reorder calculations safely.",
        "Solidity 0.8 does not support division.",
        "The user's wallet is invalid."
      ],
      "answerIdx": 1,
      "debrief": "Intermediate multiplication overflow is a classic DeFi pitfall. When calculating financial ratios with high-precision decimals (1e18), multiplying large values can easily exceed 2^256 - 1 during intermediate steps. Protocols solve this using Uniswap's 'FullMath.mulDiv()', which uses Yul assembly to compute 512-bit intermediate products with zero overflow."
    },
    "quests": [
      {
        "id": "bc-m1-d22-q1",
        "name": "Two's Complement & 256-Bit Modular Arithmetic Proof",
        "type": "concept",
        "desc": "Derive the modular arithmetic bounds for uint256 and int256 in the EVM and compare gas costs of compiler-injected panic guards."
      },
      {
        "id": "bc-m1-d22-q2",
        "name": "Historical BeautyChain BEC Overflow Forensic Audit",
        "type": "detective",
        "desc": "Reconstruct the 2018 BeautyChain batchTransfer overflow exploit in Foundry, demonstrating how uncheck arithmetic generated billions of tokens."
      },
      {
        "id": "bc-m1-d22-q3",
        "name": "FullMath 512-Bit Fixed-Point Math Engine in Yul",
        "type": "mastery",
        "desc": "Implement a FullMath mulDiv library in Solidity and Yul assembly capable of computing (a * b) / c with 512-bit precision without overflow."
      },
      {
        "id": "bc-m1-d22-q4",
        "name": "3 AM SRE: Staking Pool Frozen by Intermediate Multiplication Panic",
        "type": "incident",
        "desc": "Resolve a high-severity production outage where staking withdrawals locked due to intermediate overflow panics during high TVL periods."
      }
    ]
  },
  {
    "day": 23,
    "month": 1,
    "blockNum": 5,
    "title": "Access Control & Authorization Hazards: tx.origin Phishing, Ownable2Step & Role-Based Access",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Authorization Security (Caller Identity, Phishing Vectors & Multi-Role Governance)",
    "spokenGoal": "Architect unshakeable authorization boundaries in smart contracts. Uncover the deadly pitfall of `tx.origin`: why using `require(tx.origin == owner)` for access control exposes the contract to catastrophic Phishing Attacks (if the owner interacts with a malicious contract, that contract can call the victim contract, where tx.origin is still the owner!). Prove why authorization must strictly verify `msg.sender`. Master Secure Ownership Transitions: why single-step `transferOwnership(newOwner)` causes irreversible multi-million dollar losses if a typo is made in the address! Implement `Ownable2Step` (nominate pending owner &rarr; pending owner claims ownership). Construct Role-Based Access Control (RBAC) with fine-grained admin, pauser, and minter roles.",
    "conceptInvariant": "Direct Caller Authorization Invariant: Authorization checks must evaluate the immediate calling context (msg.sender), never the origin of the transaction tree (tx.origin); ownership transfers must enforce two-phase commit verification to prevent unrecoverable burn address transfers.",
    "failureMode": "Checking 'require(tx.origin == owner)' in a wallet contract; the owner interacts with an innocent-looking free NFT mint website, which internally executes 'wallet.transferAll(attacker)'\u2014the wallet checks tx.origin (the owner), authorizes the drain, and steals all funds.",
    "tryItFriction": "Build a tx.origin phishing exploit in Foundry: deploy a vulnerable Vault contract checking tx.origin; deploy a malicious PhishingTrap contract; simulate the owner calling PhishingTrap; observe the trap successfully draining the Vault; refactor Vault to msg.sender; and prove that the attack fails.",
    "socraticHints": [
      "Is there ever any legitimate use case for 'tx.origin' in modern smart contract engineering?",
      "Yes, exactly one: preventing contract calls to ensure the caller is an EOA (Externally Owned Account) via 'require(msg.sender == tx.origin)'! However, even this pattern is discouraged today because it breaks Account Abstraction (ERC-4337) and smart contract wallets like Safe!",
      "Never use tx.origin for authentication or authorization."
    ],
    "situationalPuzzle": {
      "scenario": "A protocol owner executes 'transferOwnership(0x000000000000000000000000000000000000dEaD)' by mistake due to a clipboard error. The contract uses OpenZeppelin's classic Ownable. The ownership is transferred instantly. The protocol needs to upgrade its proxy next week. Can the original owner recover ownership?",
      "options": [
        "Yes, by contacting Ethereum customer support.",
        "Irreversible Ownership Loss (Zero/Dead Address Lockup): No! In classic 1-step Ownable, ownership transfers immediately upon execution. Since nobody owns the private key for the dead address, the contract is permanently ownerless and can never be upgraded or managed again! This is why production enterprise contracts MUST use 'Ownable2Step', where ownership is only transferred when the proposed new owner calls 'acceptOwnership()'.",
        "Yes, by rolling back the transaction.",
        "The miners will return the ownership."
      ],
      "answerIdx": 1,
      "debrief": "Single-step ownership transfer is a critical operational hazard. A typo or clipboard hijacking sends admin control to an inaccessible address, permanently bricking governance. OpenZeppelin's Ownable2Step requires the nominated address to explicitly call acceptOwnership(), guaranteeing that the recipient exists and is operational before releasing control."
    },
    "quests": [
      {
        "id": "bc-m1-d23-q1",
        "name": "EVM Call Tree Topology: tx.origin vs msg.sender Formal Model",
        "type": "concept",
        "desc": "Map execution frames and cryptographic identity propagation from EOA initiation through nested inter-contract calls."
      },
      {
        "id": "bc-m1-d23-q2",
        "name": "Foundry tx.origin Phishing Attack Demonstration",
        "type": "detective",
        "desc": "Build an end-to-end exploit demonstration in Foundry proving how malicious intermediate contracts drain wallets checking tx.origin."
      },
      {
        "id": "bc-m1-d23-q3",
        "name": "Production Ownable2Step & RBAC Access Manager",
        "type": "mastery",
        "desc": "Author an enterprise access control contract in Solidity featuring 2-step ownership transfers, role bitmasks, and emergency pausing."
      },
      {
        "id": "bc-m1-d23-q4",
        "name": "3 AM SRE: Compromised Admin Key & Emergency Role Revocation",
        "type": "incident",
        "desc": "Execute an emergency security runbook revoking permissions from a compromised deployer key and transferring control to a cold multisig."
      }
    ]
  },
  {
    "day": 24,
    "month": 1,
    "blockNum": 5,
    "title": "Front-Running, Sandwich Attacks & Maximal Extractable Value (MEV): Mempool Sniping & Slippage",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Mempool Economics & Market Security (MEV Physics, Sandwich Bots & Slippage Bounds)",
    "spokenGoal": "Confront the dark forest of Ethereum: Maximal Extractable Value (MEV) and Mempool Exploitation. Understand how the public mempool functions: pending transactions are broadcast unencrypted to all nodes before inclusion. Analyze how searchers and MEV bots monitor pending transactions to execute Front-Running (paying higher gas or priority fee to execute ahead of a victim), Back-Running (executing immediately after a target transaction, such as liquidations or newly listed pools), and the notorious Sandwich Attack on AMM decentralized exchanges (buying before the victim to push price up, letting the victim buy at a worse price, then selling immediately after for guaranteed risk-free profit). Master defense mechanisms: tight Slippage Limits (`amountOutMin`), Deadlines, Private RPC relays (Flashbots Protect), and Commit-Reveal schemes.",
    "conceptInvariant": "Mempool Adversarial Invariant: Any transaction broadcast to the public mempool is visible to all participants; executing state-dependent financial operations without strict slippage bounds or cryptographic privacy guarantees enables deterministic value extraction by MEV searchers.",
    "failureMode": "Submitting an automated token swap with 'amountOutMin = 0' or setting slippage to 50%; an MEV bot sandwiches the transaction in the mempool, extracting 50% of the user's funds as pure arbitrage profit.",
    "tryItFriction": "Construct an MEV Sandwich Attack simulation in Foundry: create an AMM pair; simulate a victim submitting a 10 ETH buy order with 5% slippage; deploy an attacker contract that executes a front-run buy (paying higher priority gas) followed by a back-run sell; quantify the attacker's profit in ETH; and verify that setting slippage to 0.5% causes the sandwich attack to revert.",
    "socraticHints": [
      "Why does setting a transaction 'deadline' (e.g. block.timestamp + 300) protect users from MEV?",
      "Because if network gas prices spike, a user's transaction might sit pending in the mempool for hours! When gas prices drop, market conditions have drastically changed, allowing a searcher to execute the stale trade at a terrible price! A deadline ensures the transaction reverts if not mined promptly!",
      "Always set tight deadlines on AMM swaps."
    ],
    "situationalPuzzle": {
      "scenario": "A smart contract runs a public Dutch Auction where NFT prices drop linearly every minute. A buyer notices the price reached their target of 1 ETH. They send a transaction to buy. A bot sees the pending transaction in the public mempool, copies the calldata, bids a higher priority fee (gas bribe), and buys the NFT first. What type of MEV did the buyer suffer, and how can the contract prevent it?",
      "options": [
        "The blockchain had a reorg.",
        "Mempool Front-Running / Generalized Front-Running: The bot saw the profitable transaction and bribed the block builder to place its transaction ahead of the victim's! The contract can prevent public mempool sniping by: 1) Using a Commit-Reveal scheme (buyers commit hash(bid, salt) in block N, reveal in block N+5); 2) Or the user must route transactions via Flashbots Protect / private RPCs that bypass the public mempool entirely.",
        "The buyer forgot to approve tokens.",
        "EVM contracts cannot be front-run."
      ],
      "answerIdx": 1,
      "debrief": "Public mempools are adversarial battlegrounds. Automated generalized front-runners monitor the mempool, simulate incoming transactions, and replicate profitable calldata with higher gas fees. Protocols mitigate this using Commit-Reveal schemes or off-chain cryptographic matching, while end users utilize private MEV-protected RPC endpoints."
    },
    "quests": [
      {
        "id": "bc-m1-d24-q1",
        "name": "MEV Economics & Flashbots Auction Game Theory",
        "type": "concept",
        "desc": "Analyze the game theory of Priority Gas Auctions (PGA) vs Flashbots Builder-Proposer Separation (PBS) and MEV-Boost architectures."
      },
      {
        "id": "bc-m1-d24-q2",
        "name": "Foundry AMM Sandwich Attack Reproduction Harness",
        "type": "detective",
        "desc": "Build an automated testing harness in Foundry simulating a mempool sandwich attack and quantifying slippage tolerance thresholds."
      },
      {
        "id": "bc-m1-d24-q3",
        "name": "Commit-Reveal Cryptographic Auction Engine in Solidity",
        "type": "mastery",
        "desc": "Author an audited auction contract in Solidity using commit-reveal hashing to eliminate front-running and MEV mempool sniping."
      },
      {
        "id": "bc-m1-d24-q4",
        "name": "3 AM SRE: $1.2M Lost to Sandwich Bot on Misconfigured DEX Route",
        "type": "incident",
        "desc": "Resolve a high-severity production incident where an automated treasury rebalancing bot submitted a swap with amountOutMin set to 0."
      }
    ]
  },
  {
    "day": 25,
    "month": 1,
    "blockNum": 5,
    "title": "Milestone 5: Comprehensive Security Audit & Automated Exploit Penetration Engine",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Block 5 Capstone Project & Architectural Gate",
    "spokenGoal": "Synthesize the complete discipline of smart contract security, vulnerability exploitation, and defensive engineering into an automated security suite: The Comprehensive Security Audit & Automated Exploit Penetration Engine. In this milestone, act as an elite Smart Contract Security Auditor: audit an intentionally vulnerable multi-million dollar DeFi protocol containing reentrancy flaws, integer underflow hazards, tx.origin authorization bugs, and mempool front-running exposures; author automated exploit proof-of-concept (PoC) contracts in Foundry that execute live exploits against each vulnerability; refactor the protocol to patch 100% of the attack vectors; and run static analysis (Slither) and invariant fuzzing to verify bulletproof security.",
    "conceptInvariant": "Zero-Vulnerability Security Invariant: An audited smart contract protocol must maintain mathematical invariants under all adversarial attack vectors: zero unauthorized state transitions, zero reentrancy entry points, zero arithmetic panics, and zero reliance on malleable or predictable transaction parameters.",
    "failureMode": "Failing the milestone gate when an audit fails to identify a subtle read-only reentrancy vector, or when an implemented patch introduces an unhandled revert condition that freezes contract operations.",
    "tryItFriction": "Construct and deliver the complete Foundry security audit suite: write 5 distinct exploit contracts proving reentrancy, access control bypass, and front-running; execute the exploits and extract 100% of test funds; apply rigorous security patches (CEI, Ownable2Step, ReentrancyGuard, SafeERC20, tight slippage); re-run the exploit suite to prove 100% failure of all attacks; and generate a professional security audit report.",
    "socraticHints": [
      "What is the single most important mindset when conducting a professional smart contract audit?",
      "Never assume code works as intended! Trace every external call, question every storage variable mutation, verify that arithmetic cannot overflow or truncate to zero, and actively brainstorm how an economic adversary could profit by violating protocol assumptions!",
      "An auditor thinks like an attacker to defend like an architect."
    ],
    "situationalPuzzle": {
      "scenario": "During your security audit, you inspect a function: 'function withdraw() external { uint bal = balances[msg.sender]; balances[msg.sender] = 0; (bool s, ) = msg.sender.call{value: bal}(\"\"); require(s); }'. The code follows Checks-Effects-Interactions perfectly! However, the protocol also has a function 'function transfer(address to, uint amount) external' that does NOT use a reentrancy guard. Can an attacker exploit this?",
      "options": [
        "No, withdraw follows CEI.",
        "Cross-Function Reentrancy Hazard: Yes! When 'withdraw()' executes the external call to msg.sender, the attacker's fallback function can call 'transfer(victim, amount)'! If 'transfer()' relies on internal state that assumes the withdrawal was complete or uses outdated balance checks, the attacker can transfer funds that were supposed to be withdrawn, causing double-spending! True security requires ReentrancyGuard across ALL state-modifying functions.",
        "The compiler prevents cross-function calls.",
        "Transfers cannot occur during withdrawals."
      ],
      "answerIdx": 1,
      "debrief": "Following CEI inside a single function is not always enough if another related function can be invoked during the external call. In complex protocols with multiple state-modifying entry points (withdraw, transfer, liquidate), a global reentrancy mutex (ReentrancyGuard) must protect all external state-changing functions."
    },
    "quests": [
      {
        "id": "bc-m1-d25-q1",
        "name": "DeFi Vulnerability Taxonomy & Audit Methodology",
        "type": "concept",
        "desc": "Document the formal security audit methodology covering reentrancy, access control, oracle manipulation, arithmetic, and MEV attack classes."
      },
      {
        "id": "bc-m1-d25-q2",
        "name": "Automated Exploit Proof-of-Concept Suite in Foundry",
        "type": "detective",
        "desc": "Author 5 automated Foundry exploit tests executing live attacks against vulnerable contracts and documenting root causes."
      },
      {
        "id": "bc-m1-d25-q3",
        "name": "Comprehensive Protocol Security Remediation",
        "type": "mastery",
        "desc": "Refactor the vulnerable protocol in Solidity, implementing CEI, ReentrancyGuard, SafeERC20, and verifying zero findings with Slither."
      },
      {
        "id": "bc-m1-d25-q4",
        "name": "Milestone 5 Viva Gate: Lead Security Auditor Defense",
        "type": "incident",
        "desc": "Defend your security audit report before the Senior Web3 Security Board, demonstrating live PoC exploits and proving patch efficacy."
      }
    ]
  },
  {
    "day": 26,
    "month": 1,
    "blockNum": 6,
    "title": "Modern Web3 Tooling: Foundry (Forge, Cast, Anvil) vs Hardhat & Scripted Deployments",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Developer Tooling & Pipelines (Foundry Suite, Forge Testing & Cast CLI)",
    "spokenGoal": "Embrace the industry-standard developer toolchain for high-performance Ethereum engineering: The Foundry Suite (written in Rust by Paradigm). Contrast legacy JavaScript/TypeScript testing frameworks (Hardhat, Truffle) with Foundry: Foundry tests are written directly in Solidity, execute natively in an embedded EVM with zero JS context switching, and run 50x faster. Master the Foundry trifecta: 1) `forge` (compilation, testing, gas snapshots, and deployment scripting); 2) `cast` (CLI Swiss-Army knife for interacting with RPC nodes, decoding calldata, and querying contracts); and 3) `anvil` (blazing-fast local testnet node with instant state forking). Master Foundry Cheatcodes: `vm.prank`, `vm.deal`, `vm.warp`, `vm.roll`, `vm.expectRevert`, and `vm.recordLogs`.",
    "conceptInvariant": "Native Solidity Testing Invariant: Testing smart contracts in native Solidity eliminates type-marshaling errors, enables direct stack/storage inspection, and executes test suites at native Rust EVM speeds without Node.js serialization overhead.",
    "failureMode": "Testing smart contracts exclusively via JavaScript/Hardhat scripts that mock EVM state; subtle EVM opcode behaviors and gas edge cases pass locally but trigger catastrophic reverts when deployed to mainnet.",
    "tryItFriction": "Construct a complete Foundry project from scratch: initialize with `forge init`; write an Escrow contract; author comprehensive Forge unit tests using `vm.prank(alice)` and `vm.deal(alice, 100 ether)`; manipulate block time with `vm.warp()`; measure gas snapshots with `forge snapshot`; and deploy to a local Anvil node using a Solidity deployment script (`forge script`).",
    "socraticHints": [
      "What does 'vm.prank(address)' do in Foundry, and how is it different from 'vm.startPrank(address)'?",
      "'vm.prank(addr)' sets 'msg.sender' to the specified address for the VERY NEXT external call only! After that single call, msg.sender reverts back to the default test contract! 'vm.startPrank(addr)' sets msg.sender for all subsequent calls until 'vm.stopPrank()' is called!",
      "Use prank for isolated actions and startPrank for multi-step user sessions."
    ],
    "situationalPuzzle": {
      "scenario": "A developer runs a Foundry test that tests a timelock: 'vm.warp(block.timestamp + 7 days)'. The test passes on Foundry! However, when the developer runs a mainnet fork test against an Anvil node, the test fails with: 'Oracle stale price revert'. Why did advancing block time with vm.warp cause the fork test to fail?",
      "options": [
        "Anvil cannot fork mainnet.",
        "Oracle Timestamp Desynchronization: On a mainnet fork, external contracts (like Chainlink Price Feeds or Uniswap TWAP) verify that price updates occurred recently relative to 'block.timestamp'! When 'vm.warp' jumped forward 7 days, the external oracles on the forked chain became 7 days stale! Their internal checks saw 'block.timestamp - updatedAt > 3600' and reverted! On forks, developers must also mock or roll oracles when warping time.",
        "Timelocks are illegal on testnets.",
        "Foundry only supports warping 1 day."
      ],
      "answerIdx": 1,
      "debrief": "Manipulating block time via 'vm.warp' is essential for testing timelocks and vesting schedules. However, when running mainnet fork tests, warping time causes third-party DeFi dependencies (especially Chainlink price feeds) to become stale. Test authors must also mock oracle updates when advancing timestamps."
    },
    "quests": [
      {
        "id": "bc-m1-d26-q1",
        "name": "Foundry Rust EVM Architecture & Cheatcode Mechanics",
        "type": "concept",
        "desc": "Document how Foundry's revm executes Solidity tests in-memory and handles Vm cheatcode interception via reserved precompile 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D."
      },
      {
        "id": "bc-m1-d26-q2",
        "name": "Foundry vs Hardhat Performance & Gas Profiler",
        "type": "detective",
        "desc": "Benchmark test execution speeds and gas estimation accuracy across 100 complex DeFi unit tests in Foundry versus Hardhat."
      },
      {
        "id": "bc-m1-d26-q3",
        "name": "Automated Multi-Environment Deployment Pipeline in Forge",
        "type": "mastery",
        "desc": "Build an enterprise deployment script in Solidity using Forge Scripts deploying contracts, configuring roles, and verifying source on Etherscan."
      },
      {
        "id": "bc-m1-d26-q4",
        "name": "3 AM SRE: Broken CI/CD Pipeline on Mainnet Fork Desync",
        "type": "incident",
        "desc": "Triage and fix an urgent CI/CD failure where production deployment tests failed due to un-mocked Chainlink heartbeat timeouts during vm.warp."
      }
    ]
  },
  {
    "day": 27,
    "month": 1,
    "blockNum": 6,
    "title": "Advanced Fuzzing & Invariant Testing: Property-Based Fuzzing & Stateful Invariant Campaigns",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Advanced Verification (Property-Based Fuzzing & Stateful Invariants)",
    "spokenGoal": "Move beyond basic unit tests to the frontier of smart contract verification: Property-Based Fuzzing and Stateful Invariant Testing. Understand why unit tests with hardcoded values fail to catch 90% of real-world hacks: human developers test happy paths and obvious edge cases (0, max uint), but miss chaotic multi-step sequences. Contrast Stateless Fuzzing (passing thousands of randomized inputs into a single function to find reverting inputs) with Stateful Invariant Testing (generating thousands of random sequences of calls across multiple contracts while asserting that core protocol invariants NEVER break). Build invariant test suites in Foundry: define Handler contracts, target selectors, and assert global mathematical truths (e.g. `vault.totalAssets() == token.balanceOf(address(vault))`).",
    "conceptInvariant": "Stateful Invariant Inviolability: A protocol invariant is a mathematical assertion that must hold true before and after EVERY valid state transition; an invariant campaign executes tens of thousands of random multi-call sequences to mathematically prove that no sequence of operations can violate protocol solvency.",
    "failureMode": "Relying strictly on unit tests with 100% code coverage; an attacker executes a bizarre 4-step sequence (Deposit &rarr; Transfer &rarr; Partial Withdraw &rarr; Donate) that leaves the vault with 0 assets but 10 active shares, draining subsequent depositors.",
    "tryItFriction": "Construct a Stateful Invariant Testing Suite in Foundry for a Lending Vault: create a Handler contract restricting fuzz inputs to valid ranges (clamping deposit amounts and user addresses); define invariant `invariant_solvency()` asserting that total deposited collateral &ge; total borrowed debt; execute 10,000 random call sequences; and verify that Foundry proves zero invariant violations.",
    "socraticHints": [
      "Why do we need a 'Handler' contract in Foundry stateful invariant testing?",
      "Because raw fuzzer inputs are completely unconstrained! The fuzzer will pass 0x0 address, amount = 2^256-1, or call functions in nonsensical orders, causing 99% of calls to immediately revert! A Handler filters and clamps fuzzer inputs to realistic parameter spaces, forcing the fuzzer to explore deep, valid protocol states!",
      "Handlers make fuzzing millions of times more effective."
    ],
    "situationalPuzzle": {
      "scenario": "A developer runs a Foundry invariant test on an automated market maker. After 2,500 runs, Foundry outputs: '[FAIL. Invariant: invariant_constant_product()] Counterexample: run 1: swap(100), run 2: addLiquidity(50), run 3: removeLiquidity(49)'. The fuzzer discovered a 1-wei rounding leak that slowly drains pool reserves. How does the developer use Foundry's counterexample to fix the bug?",
      "options": [
        "Delete the invariant test.",
        "Replay & Precision Correction: Foundry provides the exact call sequence and parameters that broke the invariant! The developer copies the counterexample directly into a reproducible unit test, inspects the share math in removeLiquidity, identifies that the division was rounding down instead of rounding in favor of the pool, updates the rounding direction, and re-runs the invariant campaign to prove the leak is eliminated.",
        "Increase the gas limit.",
        "Fuzzing errors are always false positives."
      ],
      "answerIdx": 1,
      "debrief": "The greatest power of stateful fuzzing is automated counterexample generation. When Foundry breaks an invariant, it outputs the exact sequence of function calls and arguments that caused the failure. Developers turn the counterexample into a regression unit test, patch the underlying rounding error, and verify security."
    },
    "quests": [
      {
        "id": "bc-m1-d27-q1",
        "name": "Stateful Invariant Testing & Markov Chain State Exploration",
        "type": "concept",
        "desc": "Model the mathematical state space of smart contracts and analyze how stateful fuzzing algorithms navigate complex state transition graphs."
      },
      {
        "id": "bc-m1-d27-q2",
        "name": "Handler-Based Invariant Fuzzing Architecture",
        "type": "detective",
        "desc": "Design a Foundry Handler contract restricting random fuzzer inputs to valid action domains and eliminating bogus reverts."
      },
      {
        "id": "bc-m1-d27-q3",
        "name": "Enterprise Invariant Test Campaign for Lending Vault",
        "type": "mastery",
        "desc": "Build and execute a 25,000-run stateful invariant test campaign in Foundry proving total asset solvency across dynamic multi-user actions."
      },
      {
        "id": "bc-m1-d27-q4",
        "name": "3 AM SRE: Multi-Step Rounding Exploit Discovered by Fuzzer",
        "type": "incident",
        "desc": "Triage an emergency finding where automated invariant fuzzing uncovered a 3-step liquidation rounding exploit prior to mainnet launch."
      }
    ]
  },
  {
    "day": 28,
    "month": 1,
    "blockNum": 6,
    "title": "Gas Optimization Techniques: Custom Errors, Bitwise Packing & Yul Assembly Inlining",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Optimization (EVM Bytecode Tuning, Custom Errors & Yul Assembly)",
    "spokenGoal": "Elevate smart contracts into lean, hyper-optimized EVM bytecode. In high-frequency DeFi, every gas unit counts: saving 5,000 gas per swap saves users millions of dollars annually. Master the top enterprise gas optimization techniques: 1) Custom Errors (`error Unauthorized(); revert Unauthorized();`) replacing legacy `require(cond, \"Unauthorized\")`: custom errors use 4-byte selectors instead of storing 32+ bytes of ASCII string in bytecode, saving deployment cost and ~50 gas per revert; 2) Immutable & Constant Variables (baking values directly into bytecode, bypassing SLOAD entirely); 3) Bitwise Packing & Bitmasks (storing 8 booleans in a single uint8 using bitwise AND/OR); and 4) Yul Assembly Inlining: writing surgical inline assembly for zero-copy memory operations, efficient hashing, and custom revert bubbles.",
    "conceptInvariant": "Gas Optimization Invariant: Gas optimizations must never sacrifice security, code readability, or arithmetic safety; inline Yul assembly must be restricted to performance-critical bottlenecks and verified with exhaustive fuzzing tests.",
    "failureMode": "Writing raw Yul assembly to bypass Solidity memory safety: 'mstore(0x40, add(freeMem, 0x40))' without respecting the free memory pointer; overwriting Solidity's internal memory structures, causing subsequent arrays to corrupt and return scrambled data.",
    "tryItFriction": "Perform a comprehensive gas golf optimization on an ERC-20 token contract in Foundry: replace require strings with custom errors; mark name/symbol as immutable; pack user flags into bitmasks; optimize transfer() using inline Yul assembly; measure exact gas differences using `forge snapshot`; and verify 100% test pass rate with 35% lower gas costs.",
    "socraticHints": [
      "Where is the 'Free Memory Pointer' located in the EVM, and why must you update it when allocating memory in Yul?",
      "The Free Memory Pointer is permanently located at memory address 0x40! Solidity stores the address of the next free memory byte there! If your inline assembly writes data past the free memory pointer without updating the value at 0x40, Solidity's next memory allocation will overwrite your data!",
      "Always update 0x40 when allocating memory in assembly."
    ],
    "situationalPuzzle": {
      "scenario": "An engineer replaces a standard Solidity mapping lookup 'balances[msg.sender]' with custom inline Yul assembly to optimize gas. The assembly code executes 'mstore(0x00, caller())', 'mstore(0x20, slot)', 'return(keccak256(0x00, 0x40))'. The engineer notices that memory slots 0x00 and 0x20 were used without allocating memory. Is writing to memory addresses 0x00 to 0x3f safe in Solidity?",
      "options": [
        "No, it corrupts the EVM.",
        "Safe Use of EVM Scratch Space: Yes! The first 64 bytes of EVM memory (0x00 to 0x3f) are officially designated as 'Scratch Space' by Solidity! They can be used between statements for temporary hashing (like keccak256) without updating the free memory pointer (0x40)! Using scratch space for mapping hashes saves 24 gas by avoiding memory pointer updates.",
        "Scratch space is limited to 1 byte.",
        "Assembly cannot read memory below 0x80."
      ],
      "answerIdx": 1,
      "debrief": "Solidity reserves memory offsets 0x00 to 0x3f (64 bytes) specifically as scratch space for temporary operations, primarily hashing. Writing to scratch space does not disrupt the free memory pointer (located at 0x40), making it an ultra-efficient location for calculating storage slot hashes in Yul."
    },
    "quests": [
      {
        "id": "bc-m1-d28-q1",
        "name": "EVM Memory Layout & Scratch Space Specification",
        "type": "concept",
        "desc": "Document the complete Solidity memory allocation layout: scratch space (0x00-0x3f), free memory pointer (0x40-0x5f), and zero slot (0x60-0x7f)."
      },
      {
        "id": "bc-m1-d28-q2",
        "name": "Forge Gas Snapshot Profiler & Optimization Linter",
        "type": "detective",
        "desc": "Profile gas consumption across 10 common Solidity patterns comparing custom errors, unchecked arithmetic, and Yul inlining."
      },
      {
        "id": "bc-m1-d28-q3",
        "name": "Hyper-Optimized Yul-Powered ERC-20 Implementation",
        "type": "mastery",
        "desc": "Build an audited ERC-20 token in Solidity and Yul achieving top-tier gas efficiency while maintaining 100% interface compatibility."
      },
      {
        "id": "bc-m1-d28-q4",
        "name": "3 AM SRE: Corrupted Token Balances from Assembly Memory Overwrite",
        "type": "incident",
        "desc": "Debug an urgent production issue where un-allocated Yul memory writes clobbered the free memory pointer, scrambling contract return data."
      }
    ]
  },
  {
    "day": 29,
    "month": 1,
    "blockNum": 6,
    "title": "Web3 Client RPC Engineering: JSON-RPC Nodes, Viem vs Ethers.js & Nonce Management",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Client-Side Web3 Architecture (JSON-RPC Specs, Viem Pipelines & Nonce Queues)",
    "spokenGoal": "Connect off-chain applications and frontend web interfaces to decentralized blockchains: Web3 Client RPC Engineering. Deep-dive into the Ethereum JSON-RPC 2.0 specification: understand core RPC methods (`eth_blockNumber`, `eth_getBalance`, `eth_call` for gasless view functions, `eth_sendRawTransaction`, `eth_estimateGas`, `eth_getLogs`). Evaluate client libraries: compare legacy Ethers.js / Web3.js with modern TypeScript-first Viem: why Viem provides compile-time ABI type safety, tree-shakable modular architecture, and 10x smaller bundle sizes. Master Transaction Lifecycle & Nonce Management: handling transaction replacement (speed-up / cancel via higher gas fees), pending transaction queues, and recovering from out-of-order nonce rejections in high-throughput backend services.",
    "conceptInvariant": "Strict Nonce Monotonicity Invariant: Every Ethereum transaction from an account must have a strictly sequential, monotonic integer nonce starting from 0; broadcasting nonce N+1 before nonce N is mined causes the transaction to stall in the mempool indefinitely.",
    "failureMode": "Sending 50 concurrent transactions from a hot backend wallet using 'await wallet.getTransactionCount()' on every request; transactions retrieve the same pending nonce, colliding in the mempool and causing 49 transactions to fail with 'Nonce too low'.",
    "tryItFriction": "Construct a High-Throughput Web3 Transaction Relayer in TypeScript using Viem: implement an in-memory Mutex-locked Nonce Manager; broadcast 20 concurrent transactions to a local Anvil node without nonce collisions; listen for transaction confirmations using WebSocket subscriptions; and automatically replace a stalled transaction by broadcasting with a 20% higher priority fee.",
    "socraticHints": [
      "Why does 'eth_call' not consume any gas or require an Ethereum private key to execute?",
      "Because 'eth_call' executes code locally on the connected node's EVM in read-only mode! It does NOT broadcast a transaction to the network or alter on-chain state! Any node can simulate contract execution instantly for free!",
      "Use eth_call for view functions and pre-flight transaction simulations."
    ],
    "situationalPuzzle": {
      "scenario": "A high-volume automated bot sends transactions every second. During a sudden gas spike, transaction #42 gets stuck in the mempool because its gas price is too low. The bot continues sending transactions #43, #44, and #45. None of the subsequent transactions execute. The bot's operations are completely frozen. How does the bot unfreeze its transaction queue?",
      "options": [
        "Wait 24 hours.",
        "Transaction Replacement via Identical Nonce & Higher Gas: Because Ethereum strictly requires in-order nonce execution, transactions #43-45 cannot execute until #42 mines! To unfreeze, the bot must broadcast a 'Replacement Transaction' with the EXACT SAME nonce (nonce 42) and a 10-20% higher gas fee (EIP-1559 priority fee)! The replacement transaction can either be a zero-value transfer to self (canceling #42) or a speed-up of the original payload. Once #42 mines, #43-45 process immediately.",
        "Create a new wallet.",
        "Delete the transactions from the local database."
      ],
      "answerIdx": 1,
      "debrief": "Mempool nonce blocking is a frequent production headache for backend relayers. An account's transactions are executed strictly in sequential nonce order. If transaction N stalls, transactions N+1, N+2... will remain pending forever. Broadcasting a new transaction with nonce N and a higher gas fee replaces the stuck transaction, unblocking the entire queue."
    },
    "quests": [
      {
        "id": "bc-m1-d29-q1",
        "name": "Ethereum JSON-RPC 2.0 Protocol Formal Specification",
        "type": "concept",
        "desc": "Document the JSON-RPC wire protocol detailing request/response envelopes, batch requests, and EIP-1559 gas fee parameters."
      },
      {
        "id": "bc-m1-d29-q2",
        "name": "Viem vs Ethers.js TypeScript Typing & Bundle Benchmark",
        "type": "detective",
        "desc": "Compare compile-time ABI type inference, tree-shaking efficiency, and bundle sizes between Viem and Ethers.js v6."
      },
      {
        "id": "bc-m1-d29-q3",
        "name": "High-Throughput Concurrent Nonce Manager in Viem",
        "type": "mastery",
        "desc": "Build a robust backend transaction relayer in TypeScript managing local nonce state, speed-ups, cancellations, and WebSocket event streams."
      },
      {
        "id": "bc-m1-d29-q4",
        "name": "3 AM SRE: Frozen Custodial Relayer from Stalled Nonce Pipeline",
        "type": "incident",
        "desc": "Triage a live production incident where thousands of withdrawal transactions backed up due to a single underpriced transaction nonce."
      }
    ]
  },
  {
    "day": 30,
    "month": 1,
    "blockNum": 6,
    "title": "Capstone 1: ApexVault Institutional-Grade Multi-Sig Smart Contract & Security Defense Capstone Viva Gate",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Month 1 Master Capstone & Viva Voce (Institutional Vault Protocol Defense)",
    "spokenGoal": "The Month 1 Master Capstone and Comprehensive Viva Voce Gate: stand before the Senior Web3 Architecture & Smart Contract Security Board to present, demonstrate, and defend ApexVault. Demonstrate the complete synthesis of all 30 days of blockchain engineering: raw EVM bytecode mechanics, gas economics, storage packing, Solidity type systems, low-level delegatecall proxies, EIP-712 structured multi-signatures, ERC-20/721/4626 token architectures, custom nonReentrant guards, stateful invariant fuzzing, and Viem client relayers. Defend the contract against live adversarial exploits, prove mathematical solvency, and explain every architectural decision under intense panel cross-examination.",
    "conceptInvariant": "Master Smart Contract Solvency Invariant: An institutional treasury protocol must maintain provable mathematical solvency, enforce strict cryptographic multi-signature authorization, eliminate all known reentrancy/overflow/access vulnerabilities, and guarantee deterministic state transitions under all network conditions.",
    "failureMode": "Failing the viva defense when the panel injects a flash loan attack, submits a malleable signature, front-runs an execution, or identifies an un-packed storage slot that wastes gas.",
    "tryItFriction": "Deliver the live end-to-end demonstration and oral defense: deploy ApexVault to a local Anvil node; execute a 3-of-5 multi-signature treasury proposal using EIP-712 off-chain signatures; execute an ERC-4626 yield-bearing deposit; trigger simulated adversarial chaos (reentrancy, signature replay, front-running); demonstrate 100% exploit rejection; present Forge gas snapshots and invariant test proofs (50,000 runs); and defend your architecture before the board.",
    "socraticHints": [
      "What is the single most critical quality of a Principal Smart Contract Architect?",
      "Paranoid rigor! In Web3, code is law, state transitions are irreversible, and an exploit means permanent, irrecoverable financial loss! A true architect writes code that is mathematically verifiable, gas-efficient, and structurally defended against unseen adversaries!",
      "Simplicity, invariance, and exhaustive testing triumph over complex code."
    ],
    "situationalPuzzle": {
      "scenario": "During your Month 1 Capstone defense, the examiner panel executes three simultaneous attacks: 1) Submits a signature with s > n/2 to test malleability; 2) Initiates a reentrant callback during fund withdrawal; 3) Executes a 1-wei deposit to test vault inflation. How does ApexVault survive without losing funds or reverting valid transactions?",
      "options": [
        "The contract crashes and loses all funds.",
        "Comprehensive Layered Defense: 1) Signature verifier checks s &le; n/2 (EIP-2), rejecting the malleable signature; 2) The nonReentrant guard and CEI accounting catch the reentrant callback, reverting the sub-call immediately; 3) The ERC-4626 vault uses virtual offset shares (+1000 shares), neutralizing the 1-wei donation and preventing inflation dilution. The vault remains 100% solvent.",
        "The node software rejects the examiner.",
        "The candidate fails the examination."
      ],
      "answerIdx": 1,
      "debrief": "This represents the pinnacle of smart contract engineering. When cryptographic standards, strict reentrancy guards, virtual share offsets, and CEI accounting are built into the architecture from day one, the smart contract is impervious to both known and novel attack vectors."
    },
    "quests": [
      {
        "id": "bc-m1-d30-q1",
        "name": "ApexVault Master Protocol Architecture Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive multi-tier architecture specification detailing contract inheritance, EIP-712 hashing, storage layouts, and security invariants."
      },
      {
        "id": "bc-m1-d30-q2",
        "name": "Comprehensive Adversarial Penetration Audit",
        "type": "detective",
        "desc": "Execute automated penetration testing in Foundry simulating signature malleability, reentrancy, flash loan inflation, and front-running."
      },
      {
        "id": "bc-m1-d30-q3",
        "name": "ApexVault Production Smart Contract & Relayer Build",
        "type": "mastery",
        "desc": "Deploy and verify the complete working treasury protocol in Foundry and Viem featuring EIP-712 multi-sigs, ERC-4626 yield, and gasless permits."
      },
      {
        "id": "bc-m1-d30-q4",
        "name": "Month 1 Capstone Viva Voce & Live Security Defense",
        "type": "incident",
        "desc": "Defend the entire 30-day smart contract architecture before the Senior Web3 Security Board under live adversarial chaos and oral examination."
      }
    ]
  }
];

export const BLOCKCHAIN_MONTH_2_SPECS: MasterclassDaySpec[] = [
  {
    "day": 31,
    "month": 2,
    "blockNum": 7,
    "title": "Automated Market Makers (AMM): Constant Product Formula (x \u00b7 y = k), Slippage & Impermanent Loss",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "DeFi Market Mechanisms (Constant Product AMMs & Mathematical Slippage)",
    "spokenGoal": "Step into Decentralized Finance (DeFi). Understand why traditional order book exchanges fail on Layer 1 blockchains: placing, canceling, and matching limit orders requires thousands of on-chain transactions, consuming millions in gas. Enter the Automated Market Maker (AMM) pioneered by Uniswap v2: replacing order books with liquidity pools governed by the Constant Product Formula: x &middot; y = k (where x is reserve of Token A, y is reserve of Token B, and k is invariant). Derive the exact swap output formula with 0.3% protocol fee: &Delta;y = (y &middot; &Delta;x &middot; 0.997) / (x + &Delta;x &middot; 0.997). Master Slippage (how large trades shift the reserve ratio) and Impermanent Loss (the economic divergence loss incurred by liquidity providers compared to holding assets outside the pool).",
    "conceptInvariant": "Constant Product Invariant: A trade swapping &Delta;x for &Delta;y must maintain or increase the pool's constant product invariant after fees: (x + &Delta;x) &middot; (y - &Delta;y) &ge; k; liquidity provision mints LP shares proportionally to &radic;k.",
    "failureMode": "Implementing swap calculation without accounting for the 0.3% fee in the invariant check: 'require(newX * newY >= oldX * oldY);' An attacker repeatedly swaps back and forth, slowly bleeding liquidity provider reserves through fee-free micro-arbitrage.",
    "tryItFriction": "Construct a minimal Uniswap v2 AMM in Solidity 0.8.20: implement addLiquidity (minting LP tokens via geometric mean &radic;(x &middot; y)); implement swap() with 0.3% fee; calculate price impact; and write a Foundry test simulating an arbitrageur trading against an external price discrepancy until the pool price matches market equilibrium.",
    "socraticHints": [
      "Why does an AMM mint initial LP shares equal to &radic;(x &middot; y) - 1000, burning the first 1000 shares to address(0)?",
      "To permanently lock minimum liquidity and prevent the First Depositor Share Inflation Exploit! Burning 1000 wei of LP shares makes it economically impossible for an attacker to inflate the LP share price to drain future depositors!",
      "Uniswap v2 solved vault inflation back in 2020 using this exact mechanism."
    ],
    "situationalPuzzle": {
      "scenario": "A liquidity provider deposits 10 ETH and 20,000 USDC into an AMM pool (ETH price = $2,000). Over 6 months, ETH price doubles to $4,000 on external exchanges. Arbitrageurs trade against the pool until the pool price reflects $4,000. If the LP withdraws their liquidity, they receive ~7.07 ETH and ~28,284 USDC (worth $56,568). If they had simply held their initial 10 ETH and 20,000 USDC, they would have $60,000! What is this $3,432 difference called?",
      "options": [
        "Gas fee expenditure.",
        "Impermanent Loss (Divergence Loss): Because the AMM pricing curve forced the pool to sell the appreciating asset (ETH) for the depreciating asset (USDC) as arbitrageurs traded against it! At a 2x price shift, Impermanent Loss is exactly 5.72% of portfolio value! The loss is only offset if trading fees collected over the 6 months exceed $3,432.",
        "A smart contract hack.",
        "Slippage error."
      ],
      "answerIdx": 1,
      "debrief": "Impermanent loss occurs whenever the price ratio between deposited assets changes relative to when they were deposited. The constant product formula automatically rebalances the pool by selling the rallying asset and buying the declining asset. Liquidity providers profit only if accumulated trading fees outweigh this divergence loss."
    },
    "quests": [
      {
        "id": "bc-m2-d31-q1",
        "name": "Constant Product Swap Formula & Impermanent Loss Proof",
        "type": "concept",
        "desc": "Derive the mathematical formula for swap output with fees (&Delta;y) and the impermanent loss equation IL(r) = 2&radic;r / (1 + r) - 1."
      },
      {
        "id": "bc-m2-d31-q2",
        "name": "AMM Arbitrage & Price Equilibrium Simulator",
        "type": "detective",
        "desc": "Build an algorithmic simulation in TypeScript calculating optimal arbitrage trade sizes to restore AMM pool prices to external CEX prices."
      },
      {
        "id": "bc-m2-d31-q3",
        "name": "Minimalist Constant Product AMM in Foundry",
        "type": "mastery",
        "desc": "Author an audited Uniswap v2-style pair contract in Solidity with LP token minting, 0.3% fee swaps, and flash-swap capabilities."
      },
      {
        "id": "bc-m2-d31-q4",
        "name": "3 AM SRE: Broken AMM Pool from Zero-Liquidity Burn Exploit",
        "type": "incident",
        "desc": "Triage an incident where a newly deployed liquidity pair was locked due to an unhandled division by zero during initial LP burn."
      }
    ]
  },
  {
    "day": 32,
    "month": 2,
    "blockNum": 7,
    "title": "Concentrated Liquidity AMMs (Uniswap v3): Ticks, Price Ranges, Tick Math & Capital Efficiency",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Advanced Market Making (Concentrated Liquidity, Ticks & Virtual Reserves)",
    "spokenGoal": "Analyze the crowning mathematical achievement of decentralized exchanges: Concentrated Liquidity (Uniswap v3). Contrast Uniswap v2 (where capital is spread uniformly across all prices from 0 to infinity, meaning 99% of deposited capital sits idle and unused) with Uniswap v3 (where liquidity providers allocate capital within discrete custom Price Ranges [p_lower, p_upper]). Understand why this delivers up to 4,000x Capital Efficiency! Deconstruct the mathematical mechanics: Price is represented as square root price `sqrtPriceX96` (Q64.96 fixed-point number). Space is partitioned into discrete Ticks: `p(i) = 1.0001^i`. Master the virtual reserve curve: (x + L / &radic;p_b) &middot; (y + L &middot; &radic;p_a) = L^2. Analyze what happens when price crosses a tick boundary: liquidity L dynamically jumps as positions enter or exit the active range.",
    "conceptInvariant": "Tick Boundary Liquidity Conservation Invariant: When current price crosses tick boundary i, active in-range liquidity L must step by &Delta;L_net; all fee growth inside the tick range must be tracked via global and tick-level fee accumulator checkpoints.",
    "failureMode": "Attempting to compute Uniswap v3 tick math using floating-point operations; rounding errors corrupt the tick bitmap, causing price crossing logic to skip ticks and freeze swapping permanently.",
    "tryItFriction": "Construct a Concentrated Liquidity Tick Math library in Solidity 0.8.20: implement Q64.96 fixed-point square root price calculations; calculate token amounts &Delta;x and &Delta;y for a position given liquidity L and price range [p_a, p_b]; simulate price moving across a tick; and verify that capital efficiency is 20x higher than a v2 constant product pool for a &plusmn;5% range.",
    "socraticHints": [
      "Why does Uniswap v3 store price as sqrtPriceX96 (the square root of price multiplied by 2^96)?",
      "Because calculating swap math and token amounts involves &radic;p! Storing &radic;p directly eliminates expensive on-chain square root calculations during swaps! Multiplying by 2^96 stores the fractional value with 96 bits of binary fixed-point precision!",
      "Q64.96 avoids rounding errors without floating-point math."
    ],
    "situationalPuzzle": {
      "scenario": "A liquidity provider deposits 10 ETH and 20,000 USDC into a Uniswap v3 pool within the price range [$1,800, $2,200]. The market price of ETH surges to $2,500. The LP checks their position. What does the LP's position consist of when the price moves entirely above their upper tick?",
      "options": [
        "10 ETH and 20,000 USDC.",
        "100% USDC (0 ETH): As price rose through the range, the AMM continuously sold the LP's ETH for USDC! Once price crossed $2,200 (the upper bound), all ETH was completely sold out! The LP now holds 100% USDC and 0 ETH. Their liquidity is now inactive and earns ZERO fees until price falls back inside [$1,800, $2,200].",
        "100% ETH (0 USDC).",
        "The position was liquidated."
      ],
      "answerIdx": 1,
      "debrief": "In concentrated liquidity, if the market price exits an LP's active price range, their position converts 100% into the less valuable/depreciating asset. Above the range, the position is 100% token1 (USDC); below the range, it is 100% token0 (ETH). Furthermore, inactive out-of-range liquidity earns zero trading fees."
    },
    "quests": [
      {
        "id": "bc-m2-d32-q1",
        "name": "Uniswap v3 Concentrated Liquidity Mathematical Derivation",
        "type": "concept",
        "desc": "Derive the virtual reserve equations, tick price indexing p(i) = 1.0001^i, and liquidity amount formulas &Delta;x and &Delta;y."
      },
      {
        "id": "bc-m2-d32-q2",
        "name": "TickBitmap & Q64.96 Fixed-Point Math Profiler",
        "type": "detective",
        "desc": "Analyze the TickBitmap word-packing architecture in Uniswap v3, measuring gas efficiency of bitwise tick searches via nextInitializedTickWithinOneWord."
      },
      {
        "id": "bc-m2-d32-q3",
        "name": "Concentrated Liquidity Math Engine in Solidity",
        "type": "mastery",
        "desc": "Implement a concentrated liquidity calculation engine in Solidity and Foundry with Q64.96 math, fee growth tracking, and range minting."
      },
      {
        "id": "bc-m2-d32-q4",
        "name": "3 AM SRE: Stalled Swaps from Tick Boundary Rounding Error",
        "type": "incident",
        "desc": "Resolve a high-severity DEX incident where an unhandled tick boundary rounding off-by-one error caused swaps to revert on large trades."
      }
    ]
  },
  {
    "day": 33,
    "month": 2,
    "blockNum": 7,
    "title": "Decentralized Lending & Borrowing: Collateralization Ratios, Health Factors & Liquidation Cascades",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Credit & Money Markets (Over-Collateralization, Health Factors & Bad Debt)",
    "spokenGoal": "Deconstruct the engine of decentralized credit: Lending Protocols (Aave, Compound). Understand why crypto lending requires Over-Collateralization: without real-world identity or legal courts, borrowers must deposit more collateral than they borrow (e.g. 150% Loan-to-Value). Master core credit mechanics: Loan-to-Value (LTV), Liquidation Threshold (LT), and the Health Factor: H = (&sum; Collateral_i &middot; LT_i) / Total_Borrows. If H < 1.0, the position is under-collateralized and eligible for immediate Liquidation. Analyze Liquidation Economics: liquidators repay up to 50% of the borrower's debt in exchange for seized collateral plus a 5-10% Liquidation Bonus. Confront the catastrophic threat of Liquidation Cascades and Protocol Bad Debt during market crashes.",
    "conceptInvariant": "Solvency & Health Factor Invariant: A lending pool remains solvent as long as liquidated collateral value exceeds repaid debt; if collateral price crashes faster than liquidators can execute, Health Factor drops below 1.0 without liquidations, leaving the protocol with permanent Bad Debt.",
    "failureMode": "Failing to cap the maximum borrowable amount for illiquid tokens; an attacker deposits $10M of a low-cap token they control, borrows $7M in real USDC, and abandons the worthless collateral, leaving the protocol with $7M in unbacked bad debt.",
    "tryItFriction": "Construct a minimal Over-Collateralized Lending Pool in Solidity 0.8.20: deposit ETH collateral; borrow USDC up to 75% LTV; calculate Health Factor in real time using a mock oracle; simulate an ETH price crash dropping H to 0.92; implement liquidation function allowing an external liquidator to repay 50% debt and seize ETH collateral + 8% bonus; and verify that the borrower's health factor recovers above 1.1.",
    "socraticHints": [
      "Why do lending protocols enforce a 'Close Factor' (limiting liquidation to repaying at most 50% of the debt per transaction)?",
      "Because liquidating 100% of a borrower's position at once would seize all their collateral plus bonuses, punishing the user excessively for a minor price dip! Liquidating 50% reduces debt, pushes Health Factor back above 1.0, and protects the user's remaining collateral!",
      "It also limits market sell pressure during liquidations."
    ],
    "situationalPuzzle": {
      "scenario": "During a massive crypto market crash, Ethereum network gas prices spike to 500 gwei. An under-collateralized borrow position has $100 of debt and $102 of collateral. Liquidators ignore the position, and the protocol accumulates $20 of Bad Debt. Why did liquidators refuse to liquidate this position?",
      "options": [
        "The lending contract was paused.",
        "Dust Position Gas Economic Unprofitability: Liquidating the position yields a 5% bonus ($5 profit). However, executing the liquidation transaction at 500 gwei gas costs $65 in Ethereum network transaction fees! The liquidator would lose $60 executing the liquidation! Because the position was too small ('dust position'), it was economically unviable to liquidate, causing the protocol to swallow the bad debt.",
        "Liquidators are only allowed to liquidate once per day.",
        "The health factor was too high."
      ],
      "answerIdx": 1,
      "debrief": "Dust positions are a major threat to DeFi solvency. When transaction gas fees exceed the liquidation bonus profit, rational liquidators will not liquidate underwater loans. Protocols mitigate this by enforcing minimum borrow sizes (e.g. minimum $5,000 borrow) or utilizing Layer 2 rollups with negligible gas costs."
    },
    "quests": [
      {
        "id": "bc-m2-d33-q1",
        "name": "DeFi Health Factor & Liquidation Mathematics",
        "type": "concept",
        "desc": "Derive the mathematical formulation for multi-collateral Health Factor, liquidation incentive pricing, and post-liquidation health recovery."
      },
      {
        "id": "bc-m2-d33-q2",
        "name": "Liquidation Cascade & Bad Debt Simulator in TypeScript",
        "type": "detective",
        "desc": "Simulate sudden 40% market crashes in TypeScript across 1,000 simulated borrower positions, measuring bad debt accumulation under gas spikes."
      },
      {
        "id": "bc-m2-d33-q3",
        "name": "Minimal Over-Collateralized Lending Market in Foundry",
        "type": "mastery",
        "desc": "Implement an audited lending pool in Solidity supporting multi-token deposits, variable borrow rates, oracle pricing, and liquidations."
      },
      {
        "id": "bc-m2-d33-q4",
        "name": "3 AM SRE: $15M Bad Debt Accumulation During Market Crash",
        "type": "incident",
        "desc": "Lead the emergency recovery of a lending protocol where network congestion halted liquidations, accumulating $15M in unbacked bad debt."
      }
    ]
  },
  {
    "day": 34,
    "month": 2,
    "blockNum": 7,
    "title": "Flash Loans & Arbitrage: Single-Transaction Uncollateralized Borrowing & Pool Invariants",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Advanced DeFi Primitives (Flash Loans, Atomic Composability & Arbitrage)",
    "spokenGoal": "Explore the unique superpower of blockchain computing impossible in traditional finance: Flash Loans. Understand how uncollateralized lending works without counterparty credit risk: borrow $100,000,000 with ZERO collateral, execute arbitrary smart contract logic (arbitrage, collateral swaps, liquidations), and repay the borrowed capital PLUS fee within the EXACT SAME ATOMIC TRANSACTION! If the borrower fails to repay in full at the end of the transaction, the EVM reverts the entire transaction, rewinding history as if the loan never occurred! Dissect the EIP-3156 Flash Loan Standard (`maxFlashLoan`, `flashFee`, `onFlashLoan`). Build an automated arbitrage bot capitalizing on cross-pool price discrepancies.",
    "conceptInvariant": "Atomic Repayment Invariant: A flash loan provider must verify at the end of the callback execution that pool balance after loan &ge; pool balance before loan + flashFee; if balance check fails, the transaction must revert atomically.",
    "failureMode": "Transferring flash loan capital without checking return data or assuming the receiver contract will call 'repay()'; failing to verify the ending pool balance allows an attacker to borrow 10,000 ETH and simply walk away with the funds.",
    "tryItFriction": "Implement an EIP-3156 Flash Loan Provider in Solidity 0.8.20: deploy a liquidity pool; implement flashLoan(receiver, token, amount, data); execute receiver callback; assert ending balance &ge; initial balance + fee; write an Arbitrage Receiver contract that borrows 100 ETH, trades across two AMM pools with a 2% price discrepancy, repays the loan, and pockets 1.8 ETH profit in a single atomic transaction.",
    "socraticHints": [
      "Why can't an attacker steal flash-loaned funds by transferring them to an external wallet inside the callback?",
      "Because the entire sequence is a single atomic transaction! Even if the attacker transfers the funds to another contract or wallet, at the end of the transaction the lending pool checks its balance! Since the funds weren't returned, the pool executes REVERT, which completely undoes all transfers across all contracts!",
      "The attacker only loses the gas spent."
    ],
    "situationalPuzzle": {
      "scenario": "An arbitrageur builds a flash loan contract to exploit a 5% price gap between Uniswap and Sushiswap. In Foundry, the simulation yields $10,000 profit! When the arbitrageur broadcasts the transaction to the public Ethereum mainnet mempool, the transaction reverts with 'Slippage exceeded', and an MEV bot executes the exact same arbitrage trade 1 block earlier! What happened?",
      "options": [
        "The flash loan fee was increased.",
        "Mempool Generalized Front-Running / MEV Theft: The arbitrageur broadcasted their transaction to the public mempool! An MEV searcher bot saw the profitable transaction, simulated it, copied the exact DEX trade parameters, replaced the recipient address with the bot's address, paid a 90% gas bribe to the block builder, and front-ran the trade! When the victim's trade executed, the price gap was already closed, causing it to revert! Solution: broadcast via private RPC (Flashbots Protect).",
        "Flash loans are blocked on mainnet.",
        "Uniswap does not allow arbitrage."
      ],
      "answerIdx": 1,
      "debrief": "Broadcasting un-hedged arbitrage or liquidation transactions to the public mempool is guaranteed suicide in Web3. Generalized front-runners simulate pending mempool transactions, steal profitable arbitrage routes, and pay miners/builders to execute ahead of the victim. Production arbitrage bots exclusively route transactions through private MEV relays like Flashbots."
    },
    "quests": [
      {
        "id": "bc-m2-d34-q1",
        "name": "EIP-3156 Flash Loan Standard Formal Specification",
        "type": "concept",
        "desc": "Document the EIP-3156 interface mechanics, callback verification flows, and flash fee calculation models."
      },
      {
        "id": "bc-m2-d34-q2",
        "name": "Flash Loan Atomic Arbitrage Profitability Simulator",
        "type": "detective",
        "desc": "Model atomic arbitrage profitability across dual AMM pools accounting for gas fees, pool price impact, and 0.09% flash loan fees."
      },
      {
        "id": "bc-m2-d34-q3",
        "name": "Production EIP-3156 Flash Lender & Arbitrage Bot in Foundry",
        "type": "mastery",
        "desc": "Author an audited EIP-3156 flash lender in Solidity and a multi-DEX atomic arbitrage receiver contract in Foundry."
      },
      {
        "id": "bc-m2-d34-q4",
        "name": "3 AM SRE: $25M Flash Loan Oracle Manipulation Drain",
        "type": "incident",
        "desc": "Triage an emergency DeFi exploit where an attacker used a $50M flash loan to manipulate an AMM spot price oracle and drain collateral."
      }
    ]
  },
  {
    "day": 35,
    "month": 2,
    "blockNum": 7,
    "title": "Milestone 6: Production Concentrated Liquidity AMM & Flash Lending Engine",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Block 7 Capstone Project & Architectural Gate",
    "spokenGoal": "Synthesize the entire discipline of automated market making, concentrated liquidity math, over-collateralized credit, and atomic flash loans into an enterprise DeFi exchange: The Production Concentrated Liquidity AMM & Flash Lending Engine. In this milestone, architect an institutional-grade liquidity protocol: implement concentrated liquidity positions across discrete price ticks with Q64.96 fixed-point math; support real-time token swaps with dynamic fee tiers (0.05%, 0.30%, 1.00%); incorporate an EIP-3156 flash loan facility allowing uncollateralized pool borrowing; enforce tick crossing invariants and fee growth accumulators; and benchmark execution against Uniswap v3 test vectors.",
    "conceptInvariant": "DeFi Protocol Solvency & Conservation Invariant: Total token balances in the pool must strictly satisfy the concentrated liquidity virtual reserve curve and flash loan repayment invariant; all fee growth inside active tick ranges must be mathematically accounted for with zero cumulative precision loss.",
    "failureMode": "Failing the milestone gate when tick crossing math causes precision drift, when flash loan callbacks fail to revert on unpaid debt, or when extreme swaps divide by zero inside tick bitmap searches.",
    "tryItFriction": "Construct and deliver the complete Solidity 0.8.20 + Foundry milestone exchange: deploy a Concentrated Liquidity Pair; mint an in-range liquidity position across ticks [-200, +200]; execute 10 swaps of varying sizes that cross tick boundaries; borrow 1,000,000 tokens via EIP-3156 flash loan and verify repayment with fee; prove zero precision drift over 100 trades; and verify gas optimization.",
    "socraticHints": [
      "How do we prevent rounding errors from draining the pool during high-volume swaps?",
      "By rounding in favor of the pool on every single calculation! When calculating token amount in (&Delta;x), round UP! When calculating token amount out (&Delta;y), round DOWN! The pool must always take slightly more and give slightly less!",
      "Strict rounding direction guarantees pool reserves never deplete due to math truncation."
    ],
    "situationalPuzzle": {
      "scenario": "During your Milestone 6 defense, an examiner executes a massive swap that exceeds the total liquidity available in the current active tick range. How does your concentrated liquidity engine handle this multi-tick swap without reverting or under-delivering tokens?",
      "options": [
        "The swap reverts immediately.",
        "Iterative Multi-Tick Step-and-Cross Execution: The swap loop executes in steps: 1) Calculates how much token can be swapped within the current tick to reach the next initialized tick boundary; 2) If the swap amount exceeds this, it swaps to the boundary, updates current price to the tick, crosses the tick (updating active liquidity L by &Delta;L_net), and decrements the remaining swap amount; 3) Repeats across subsequent ticks until the entire trade is filled! The trade seamlessly crosses multiple tick ranges.",
        "The engine borrows tokens from another blockchain.",
        "The examiner fails the candidate."
      ],
      "answerIdx": 1,
      "debrief": "In concentrated liquidity AMMs, large swaps frequently consume all liquidity in the current tick range. The engine must execute an iterative while-loop, swapping up to the next initialized tick, crossing the tick to add/subtract liquidity, and repeating until the swap order is completely satisfied."
    },
    "quests": [
      {
        "id": "bc-m2-d35-q1",
        "name": "Concentrated Liquidity & Flash Loan Architecture Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive systems architecture detailing tick bitmaps, Q64.96 math, fee growth accumulators, and EIP-3156 interfaces."
      },
      {
        "id": "bc-m2-d35-q2",
        "name": "Multi-Tick Swap & Rounding Verification Suite",
        "type": "detective",
        "desc": "Build automated fuzzing suites in Foundry asserting 100% solvency across 20,000 randomized multi-tick trades and extreme liquidity distributions."
      },
      {
        "id": "bc-m2-d35-q3",
        "name": "Production Concentrated Liquidity AMM Implementation",
        "type": "mastery",
        "desc": "Author and test the complete concentrated liquidity exchange in Solidity and Foundry with tick math, range minting, and flash loans."
      },
      {
        "id": "bc-m2-d35-q4",
        "name": "Milestone 6 Viva Gate: Advanced DeFi Architecture Defense",
        "type": "incident",
        "desc": "Defend the AMM and flash lending architecture before the Senior Web3 Architecture Board, demonstrating live tick crossings and flash loan safety."
      }
    ]
  },
  {
    "day": 36,
    "month": 2,
    "blockNum": 8,
    "title": "Price Oracle Architectures: On-Chain TWAP vs Decentralized Off-Chain Oracles (Chainlink)",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Oracle Systems & Truth Feeds (On-Chain TWAP vs Off-Chain Consensus Oracles)",
    "spokenGoal": "Solve the fundamental challenge of smart contract computing: The Oracle Problem. Blockchains are isolated deterministic state machines; they cannot physically query HTTP APIs or know real-world asset prices. Contrast the two primary oracle paradigms: 1) On-Chain Time-Weighted Average Price (TWAP): pioneered by Uniswap v2/v3, accumulating price over time (`priceCumulative += price &middot; &Delta;t`) to prevent single-block manipulation; and 2) Decentralized Off-Chain Oracles (Chainlink): networks of independent nodes fetching off-chain price data from institutional APIs, aggregating with median consensus (Off-Chain Reporting - OCR), and writing authenticated updates on-chain. Dissect Chainlink's `AggregatorV3Interface`: `latestRoundData()` parameters (roundId, answer, startedAt, updatedAt, answeredInRound).",
    "conceptInvariant": "Oracle Authenticity & Freshness Invariant: An oracle price must be cryptographically authenticated, aggregate multiple independent data sources, and enforce strict freshness bounds: updatedAt &ge; block.timestamp - heartbeat_timeout and answer > 0; stale or unverified prices must revert immediately.",
    "failureMode": "Consuming Chainlink's latestRoundData() without checking freshness: 'int price = oracle.latestRoundData();' During a network congestion event, the oracle fails to update for 12 hours; the protocol executes liquidations based on a stale price, liquidating solvent users.",
    "tryItFriction": "Implement an audited Chainlink Price Feed Consumer in Solidity 0.8.20: read AggregatorV3Interface; validate that price > 0, roundId &ge; answeredInRound, and block.timestamp - updatedAt &le; 3600 (1 hour heartbeat); implement fallback to a 30-minute Uniswap v3 TWAP oracle if the primary Chainlink feed is stale; and write Foundry tests verifying that stale feeds revert.",
    "socraticHints": [
      "Why must you always check 'answeredInRound >= roundId' when consuming Chainlink price feeds?",
      "Because if answeredInRound < roundId, it indicates that the round timed out or did not reach consensus, meaning the price returned is incomplete or carried over from a previous round! Failing to check this can return outdated or invalid pricing!",
      "Always validate all 5 return values of latestRoundData()."
    ],
    "situationalPuzzle": {
      "scenario": "A DeFi lending market uses Uniswap v3 TWAP with a 10-second window to price collateral. A borrower executes a flash loan, swaps 5,000 ETH into the Uniswap pool, moves the TWAP price by 30%, borrows $10M against inflated collateral, and swaps back, all in a single block. Why did the TWAP oracle fail to prevent the attack?",
      "options": [
        "Uniswap v3 TWAP has a mathematical flaw.",
        "TWAP Window Too Short (Single-Block Susceptibility): A 10-second TWAP window is shorter than Ethereum's 12-second block time! In a single block, a 10-second window is identical to the instantaneous spot price! To be secure against flash loan manipulation, TWAP windows must be at least 15 to 30 minutes (covering dozens of consecutive blocks), forcing an attacker to hold their distorted position across multiple blocks and exposing them to massive arbitrage loss.",
        "The oracle was offline.",
        "Flash loans cannot interact with TWAP."
      ],
      "answerIdx": 1,
      "debrief": "TWAP oracles derive their security from time. The longer the TWAP window (e.g. 30 minutes), the more capital and block-by-block risk an attacker must incur to distort the average price. Short TWAP windows (< 60 seconds) can be manipulated within a few blocks or via multi-block builder manipulation."
    },
    "quests": [
      {
        "id": "bc-m2-d36-q1",
        "name": "Uniswap TWAP Accumulator vs Chainlink OCR Formal Model",
        "type": "concept",
        "desc": "Compare mathematical manipulation resistance between geometric/arithmetic TWAP accumulation and BFT median consensus in Chainlink OCR."
      },
      {
        "id": "bc-m2-d36-q2",
        "name": "Chainlink Stale Price & Heartbeat Validator",
        "type": "detective",
        "desc": "Build an automated testing harness in Foundry verifying that all 5 return values of latestRoundData are sanitized against heartbeat timeouts."
      },
      {
        "id": "bc-m2-d36-q3",
        "name": "Production Dual-Oracle Price Aggregator in Foundry",
        "type": "mastery",
        "desc": "Implement an enterprise price feed in Solidity combining Chainlink primary feeds with a Uniswap v3 TWAP secondary fallback and circuit breakers."
      },
      {
        "id": "bc-m2-d36-q4",
        "name": "3 AM SRE: Stale Oracle Prices Liquidating Solvent Accounts",
        "type": "incident",
        "desc": "Resolve a high-severity production incident where a frozen oracle feed caused an on-chain money market to liquidate $8M of solvent user collateral."
      }
    ]
  },
  {
    "day": 37,
    "month": 2,
    "blockNum": 8,
    "title": "Oracle Manipulation Attacks: Spot Price Flash Loan Distortions & Circuit Breaker Defenses",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Oracle Exploitation (Spot Price Manipulation, Flash Drains & Circuit Breakers)",
    "spokenGoal": "Analyze the number-one cause of DeFi multi-million dollar hacks: Oracle Manipulation. Understand why querying instantaneous spot prices from an AMM pool (`pool.balanceOf(tokenA) / pool.balanceOf(tokenB)` or `getReserves()`) is fatal: an attacker borrows $50,000,000 via a Flash Loan, executes a massive swap to drastically distort the AMM's spot reserves, interacts with the victim protocol that reads the distorted spot price (borrowing unbacked assets or minting undervalued tokens), swaps back on the AMM to repay the flash loan, and walks away with pure profit in a single transaction! Master defensive architectures: Liquidity-Weighted Oracles, Min/Max Deviation Bounds, and Volatility Circuit Breakers that freeze borrowing if price swings > 10% in a single block.",
    "conceptInvariant": "Independent Price Invariant: A smart contract must NEVER price collateral or evaluate protocol solvency using instantaneous spot reserves of a single liquidity pool; price feeds must be decoupled from instantaneous in-transaction liquidity states.",
    "failureMode": "Calculating collateral value using 'reservesToken0 / reservesToken1' from a Uniswap pair; an attacker flash loans 10,000 ETH, dumps it into the pair, crashes the spot price, liquidates all healthy borrowers on the platform, and profits $12M.",
    "tryItFriction": "Construct a Flash Loan Oracle Manipulation exploit in Foundry: deploy a vulnerable Lending Pool that calculates token prices via `pair.getReserves()`; deploy an Attacker contract that takes a 10,000 ETH flash loan, shifts the pool reserves by 80%, borrows the lending pool's entire stablecoin treasury against pennies of collateral, repays the flash loan, and extracts profit; refactor the pool to Chainlink + TWAP; and prove the exploit reverts.",
    "socraticHints": [
      "Why is 'getReserves()' from Uniswap v2 pairs vulnerable to manipulation while Chainlink feeds are not?",
      "Because getReserves() reflects the instantaneous balance of tokens in that specific contract right now, which a flash loan can alter for zero cost in milliseconds! Chainlink feeds aggregate volume-weighted prices across dozens of external centralized and decentralized exchanges, which cannot be moved by an on-chain flash loan!",
      "Never use spot pool reserves for valuation."
    ],
    "situationalPuzzle": {
      "scenario": "A protocol implements a Circuit Breaker that compares Chainlink price against Uniswap TWAP price. If they deviate by more than 5%, the circuit breaker triggers and pauses borrowing. During a major real-world market crash, the price of ETH drops 15% in 10 minutes on Binance. The circuit breaker triggers and halts the protocol for 24 hours, preventing liquidations. Did the circuit breaker work correctly, and what design flaw caused the freeze?",
      "options": [
        "The circuit breaker worked perfectly.",
        "Symmetric Deviation Threshold Flaw (Halting Legitimate Liquidations): The circuit breaker compared an instantaneous feed (Chainlink) against a lagging 30-minute TWAP! During rapid real-world crashes, a lagging TWAP naturally lags behind fast-moving spot prices by > 5%! The circuit breaker interpreted this legitimate market volatility as an attack, halting liquidations and generating massive Bad Debt! Circuit breakers must compare against external median feeds or price velocity, not lagging TWAPs.",
        "Chainlink was hacked.",
        "Foundry cannot simulate market crashes."
      ],
      "answerIdx": 1,
      "debrief": "Comparing a fast-updating price oracle against a slow lagging TWAP during genuine high-volatility market crashes causes false-positive circuit breaker trips. The TWAP naturally trails the live price, creating a persistent divergence that pauses the protocol exactly when liquidations are most urgently needed to prevent bad debt."
    },
    "quests": [
      {
        "id": "bc-m2-d37-q1",
        "name": "Spot Price Flash Loan Distortion Mathematical Proof",
        "type": "concept",
        "desc": "Derive the mathematical relationship between flash loan trade size &Delta;x, pool depth k, and the resulting spot price distortion ratio."
      },
      {
        "id": "bc-m2-d37-q2",
        "name": "Historical Mango Markets / bZx Oracle Exploit Audit",
        "type": "detective",
        "desc": "Reconstruct a historical $100M+ oracle manipulation attack in Foundry, identifying the exact spot-pricing vulnerability that enabled the drain."
      },
      {
        "id": "bc-m2-d37-q3",
        "name": "Volatility Circuit Breaker & Median Oracle Module",
        "type": "mastery",
        "desc": "Implement an audited price guard in Solidity that validates prices against bounded deviation thresholds, velocity limits, and emergency pauses."
      },
      {
        "id": "bc-m2-d37-q4",
        "name": "3 AM SRE: Flash Loan Oracle Attack Draining Treasury in 1 Block",
        "type": "incident",
        "desc": "Lead the emergency war room remediating a production protocol drained by an attacker using a $100M flash loan to manipulate an internal spot oracle."
      }
    ]
  },
  {
    "day": 38,
    "month": 2,
    "blockNum": 8,
    "title": "Cross-Chain Bridges: Lock-and-Mint vs Burn-and-Mint, Relayers & The Ronin Bridge Hack",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Cross-Chain Architecture (Bridge Topologies, Relayers & Custodial Vulnerabilities)",
    "spokenGoal": "Examine how assets and messages move across disparate blockchains: Cross-Chain Bridges. Analyze the two primary bridge architectures: 1) Lock-and-Mint / Burn-and-Redeem (lock original ETH on Chain A &rarr; mint wrapped WETH on Chain B; burn WETH on Chain B &rarr; unlock ETH on Chain A); and 2) Burn-and-Mint (native multi-chain tokens burned on source chain and re-minted on destination chain). Analyze validation topologies: Centralized Relayers, Multi-Sig Committees, and Trust-Minimized Light Client Bridges. Perform a deep forensic autopsy of the Ronin Bridge Hack ($624M stolen in 2022): how the Lazarus Group compromised 5 out of 9 validator private keys, forged withdrawal signatures, and drained the bridge reserves.",
    "conceptInvariant": "Bridge Custody Solvency Invariant: The total supply of wrapped tokens minted on destination chains must strictly equal the exact balance of native assets locked inside the source chain escrow contract; any desynchronization represents an immediate cross-chain insolvency crisis.",
    "failureMode": "Relying on a 3-of-5 multisig to authorize bridge withdrawals without on-chain rate limits or time locks; an attacker compromises 3 keys and drains the entire $500M bridge vault in a single transaction.",
    "tryItFriction": "Construct a minimal Cross-Chain Lock-and-Mint Bridge in Solidity and TypeScript: deploy EscrowVault on Chain A and WrappedToken on Chain B; implement off-chain Relayer in TypeScript that listens for Deposit events on Chain A, constructs signed attestations, and calls mint() on Chain B; implement daily withdrawal rate-limiting to prevent catastrophic drains; and test bridging in Foundry.",
    "socraticHints": [
      "Why are cross-chain bridges the single largest honeypot in the entire cryptocurrency ecosystem?",
      "Because bridges concentrate hundreds of millions of dollars of collateral from entire ecosystems into a SINGLE smart contract escrow on Ethereum! If an attacker finds a bug in that single contract or compromises the validator keys, they steal the liquidity of an entire network!",
      "Bridge security requires defense-in-depth: multisigs, timelocks, and daily volume caps."
    ],
    "situationalPuzzle": {
      "scenario": "A cross-chain bridge processes a deposit of 1,000 ETH on Ethereum. The relayer network submits a transaction to mint 1,000 Wrapped ETH on Polygon. The Polygon transaction executes. However, 1 minute later, Ethereum undergoes a 2-block chain reorganization that rolls back the original deposit! What is the financial state of the bridge?",
      "options": [
        "The bridge automatically rolls back on Polygon.",
        "Unbacked Phantom Token Insolvency: Ethereum has zero record of the 1,000 ETH deposit (it was erased by the reorg), but Polygon already minted 1,000 Wrapped ETH! The bridge is now insolvent by 1,000 ETH ($3M loss)! The attacker can sell or bridge back the unbacked Polygon tokens to extract free funds! To prevent this, bridges must wait for FINALITY (e.g. 64 Ethereum block confirmations / Epoch finalization) before relaying events.",
        "Polygon nodes will detect the Ethereum reorg.",
        "Transactions cannot be rolled back."
      ],
      "answerIdx": 1,
      "debrief": "Cross-chain bridges must respect the finality guarantees of the source chain. Relaying events prematurely before probabilistic or deterministic finality is achieved exposes the bridge to reorg double-spending: an attacker deposits, gets funds on the destination chain, and reorganizes the source chain to erase the deposit."
    },
    "quests": [
      {
        "id": "bc-m2-d38-q1",
        "name": "Cross-Chain Bridge Topologies & Security Trade-Off Analysis",
        "type": "concept",
        "desc": "Compare security, latency, and capital requirements across Centralized Multisig, Optimistic Relayers, and Zero-Knowledge Light Client bridges."
      },
      {
        "id": "bc-m2-d38-q2",
        "name": "Ronin $624M Bridge Exploit Forensic Investigation",
        "type": "detective",
        "desc": "Reconstruct the cryptographic signature verification and key compromise timeline of the Ronin Bridge hack in Foundry and TypeScript."
      },
      {
        "id": "bc-m2-d38-q3",
        "name": "Rate-Limited Lock-and-Mint Cross-Chain Bridge",
        "type": "mastery",
        "desc": "Author an audited cross-chain bridge in Solidity with EIP-712 multisig attestations, timelocks, and dynamic daily withdrawal rate limits."
      },
      {
        "id": "bc-m2-d38-q4",
        "name": "3 AM SRE: Cross-Chain Bridge Drain via Forged Relayer Signatures",
        "type": "incident",
        "desc": "Lead the emergency response team executing an immediate bridge pause after unauthorized withdrawal signatures drained $50M on destination chain."
      }
    ]
  },
  {
    "day": 39,
    "month": 2,
    "blockNum": 8,
    "title": "Cross-Chain Protocols: Chainlink CCIP & LayerZero (Generalized Messaging & Replay Defenses)",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Generalized Interoperability (Arbitrary Messaging, Nonces & Replay Defenses)",
    "spokenGoal": "Move beyond basic token wrapping to generalized cross-chain computing: Chainlink CCIP (Cross-Chain Interoperability Protocol) and LayerZero. Understand how generalized cross-chain messaging enables decentralized contracts on Arbitrum to trigger executions on Ethereum or Optimism seamlessly. Analyze the architecture: 1) Source Contract encodes arbitrary payload bytes; 2) Router / Endpoint emits message with unique messageId and source nonce; 3) Decentralized Oracle Network / Ultra-Light Node verifies and relays message; 4) Destination Contract executes `ccipReceive` or `lzReceive`. Solve the critical security challenge of cross-chain execution: Cross-Chain Replay Attacks (preventing a message executed on Polygon from being replayed on Avalanche or Arbitrum) and gas limit exhaustion on destination.",
    "conceptInvariant": "Cross-Chain Execution Idempotency Invariant: Every cross-chain message must carry a globally unique identifier (hash of sourceChain, sourceAddress, nonce, payload); destination contracts must record consumed message IDs in storage, ensuring every message executes at most once.",
    "failureMode": "Failing to verify the source chain and sender address in the destination contract's 'lzReceive' callback: 'require(msg.sender == endpoint);' An attacker sends a forged message from a testnet or unrelated contract, triggering privileged execution on the destination chain.",
    "tryItFriction": "Construct a Cross-Chain Governance Execution Engine using LayerZero/CCIP interfaces in Solidity 0.8.20: deploy a Governance contract on simulated Chain A that proposes a parameter change; encode the function call into payload bytes; simulate the cross-chain endpoint; receive the payload on Chain B; verify sourceChainId and sourceContract; assert messageId is unconsumed; execute the parameter change; and verify that replaying the message reverts.",
    "socraticHints": [
      "Why must destination callback functions enforce a strict gas limit on cross-chain message execution?",
      "Because if a destination callback runs out of gas, the message execution will revert, but the cross-chain relayer already paid gas to deliver it! If unhandled, the cross-chain message can become permanently stuck in an un-executable state!",
      "Protocols implement try/catch blocks or store failed messages for manual re-execution."
    ],
    "situationalPuzzle": {
      "scenario": "A cross-chain lending protocol allows users to deposit collateral on Arbitrum and borrow on Optimism. A user submits a borrow request. The message arrives on Optimism, but the user's callback function reverts due to a temporary slippage error. The user's collateral is locked on Arbitrum, but they received no funds on Optimism. How does modern cross-chain messaging recover from failed destination executions?",
      "options": [
        "The funds are lost forever.",
        "Stored Message Fallback & Retryable Execution: Modern protocols (CCIP / LayerZero) catch execution reverts in the endpoint! The failed message hash and payload are stored in an on-chain mapping ('failedMessages[messageId] = keccak256(payload)'). Once market conditions normalize or the user increases slippage, anyone can call 'retryPayload(messageId, payload)' to re-execute the message without re-submitting the cross-chain transaction!",
        "The user must re-mine the block.",
        "Cross-chain transactions cannot fail."
      ],
      "answerIdx": 1,
      "debrief": "In distributed cross-chain computing, destination transaction failures are inevitable. Protocols must never let failed messages drop into a black hole. Modern standards like LayerZero and CCIP store the failed payload hash on the destination chain, allowing users or automated keepers to retry the execution with updated parameters or higher gas."
    },
    "quests": [
      {
        "id": "bc-m2-d39-q1",
        "name": "Generalized Cross-Chain Messaging Formal Security Model",
        "type": "concept",
        "desc": "Formulate the cross-chain state transition verification model and prove replay attack resistance across heterogeneous consensus environments."
      },
      {
        "id": "bc-m2-d39-q2",
        "name": "Cross-Chain Message Delivery & Gas Profiler",
        "type": "detective",
        "desc": "Benchmark end-to-end latency, relayer gas overhead, and destination callback failure modes across LayerZero and Chainlink CCIP."
      },
      {
        "id": "bc-m2-d39-q3",
        "name": "Cross-Chain Governance Protocol in Foundry",
        "type": "mastery",
        "desc": "Build a multi-chain governance protocol in Solidity and Foundry with source authentication, payload encoding, and retryable execution buffers."
      },
      {
        "id": "bc-m2-d39-q4",
        "name": "3 AM SRE: Cross-Chain Token Drain via Unverified Sender Address",
        "type": "incident",
        "desc": "Resolve a high-severity cross-chain protocol vulnerability where destination contracts executed privileged mints without validating source senders."
      }
    ]
  },
  {
    "day": 40,
    "month": 2,
    "blockNum": 8,
    "title": "Milestone 7: Tamper-Proof Multi-Oracle Aggregator & Cross-Chain Bridge Engine",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Block 8 Capstone Project & Architectural Gate",
    "spokenGoal": "Synthesize the entire discipline of price oracles, manipulation defenses, cross-chain messaging, and multi-sig bridges into an enterprise protocol: The Tamper-Proof Multi-Oracle Aggregator & Cross-Chain Bridge Engine. In this milestone, architect an institutional-grade infrastructure suite: implement a resilient Price Oracle Aggregator combining primary Chainlink feeds with secondary Uniswap v3 TWAP fallbacks, deviation filters, and automated volatility circuit breakers; architect an audited Lock-and-Mint Cross-Chain Bridge with multi-sig attestation verification, source chain finality checking, daily volume rate limits, and replay-preventing message nonces; and prove exploit immunity under simulated flash loan attacks.",
    "conceptInvariant": "Oracle & Interoperability Invariant: The protocol must never execute state transitions on stale or manipulated prices, and must maintain 100% cross-chain solvency across bridge escrows with zero message replay vulnerabilities.",
    "failureMode": "Failing the milestone gate when an injected flash loan moves the oracle price by 20%, when a bridge withdrawal signature is replayed on another chain, or when a reorg on the source chain creates unbacked wrapped tokens.",
    "tryItFriction": "Construct and deliver the complete Solidity 0.8.20 + Foundry milestone protocol: deploy the Multi-Oracle Aggregator; simulate a flash loan attack that distorts spot prices and prove the circuit breaker rejects the manipulated feed; deploy the Cross-Chain Bridge; execute a 100 ETH bridge transfer; simulate an adversary attempting to replay the withdrawal signature; verify that replay reverts; and prove rate-limiting caps.",
    "socraticHints": [
      "Why must cross-chain bridge messages incorporate a target chainId in their signed digest?",
      "To prevent Cross-Chain Signature Replay! If Alice signs a message authorizing a withdrawal of 100 tokens on Polygon, an attacker could submit that exact same valid signature to the bridge contract on Avalanche or Arbitrum if the chainId was not embedded in the hash!",
      "Always include block.chainid in EIP-712 digests."
    ],
    "situationalPuzzle": {
      "scenario": "During your Milestone 7 defense, the examiner attempts two simultaneous exploits: 1) Dumps 20,000 ETH into a Uniswap pool to trigger a spot price crash; 2) Submits a forged bridge withdrawal with an invalid source chainId. How does your protocol reject both attacks?",
      "options": [
        "The node software crashes.",
        "Layered Validation & Domain Separation: 1) The Multi-Oracle Aggregator discards the spot price, checks the Chainlink median and 30-minute TWAP, detects the >10% deviation, triggers the circuit breaker, and falls back to safe pricing; 2) The Bridge contract verifies the EIP-712 digest containing 'block.chainid', sees that the signature does not match the local chain, and reverts with InvalidChainId(). Both attacks fail completely.",
        "The contracts require manual admin intervention.",
        "The examiner fails the candidate."
      ],
      "answerIdx": 1,
      "debrief": "This demonstrates enterprise-grade defense-in-depth. Decoupling oracle pricing from instantaneous spot pools eliminates flash loan attacks, while cryptographic domain separation (EIP-712 with chainId) renders cross-chain signature replay mathematically impossible."
    },
    "quests": [
      {
        "id": "bc-m2-d40-q1",
        "name": "Multi-Oracle & Cross-Chain Architecture Specification",
        "type": "concept",
        "desc": "Produce the formal engineering specification detailing oracle deviation mathematics, circuit breaker state machines, and cross-chain bridge schemas."
      },
      {
        "id": "bc-m2-d40-q2",
        "name": "Foundry Flash Loan & Cross-Chain Replay Attack Suite",
        "type": "detective",
        "desc": "Build an automated exploit testing harness in Foundry proving resilience against flash loan oracle distortions and cross-chain message replay."
      },
      {
        "id": "bc-m2-d40-q3",
        "name": "Production Multi-Oracle Aggregator & Bridge Build",
        "type": "mastery",
        "desc": "Author and test the complete production protocol in Solidity and Foundry with Chainlink/TWAP aggregators and rate-limited bridge vaults."
      },
      {
        "id": "bc-m2-d40-q4",
        "name": "Milestone 7 Viva Gate: Oracle & Interoperability Defense",
        "type": "incident",
        "desc": "Defend the oracle and bridge architecture before the Senior Web3 Board, demonstrating live flash loan attack rejection and bridge safety."
      }
    ]
  },
  {
    "day": 41,
    "month": 2,
    "blockNum": 9,
    "title": "Proxy Pattern Foundations: delegatecall, Storage Collision Hazards & The Implementation Split",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Upgradeability Engineering (Proxy Foundations & Storage Slot Collisions)",
    "spokenGoal": "Confront the fundamental dilemma of smart contract engineering: Immutability versus Upgradeability. Once deployed to the blockchain, a contract's bytecode is permanently immutable; it cannot be edited or patched. Enter the Proxy Pattern: splitting an application into two distinct contracts: 1) A Proxy Contract (holds all persistent state variables, balances, and funds; contains a fallback function that forwards all incoming calls via `delegatecall` to an implementation address); and 2) An Implementation / Logic Contract (contains the executable business logic, but holds ZERO state). Master the deadliest hazard of proxy patterns: Storage Layout Collisions (if the Implementation declares variables in slots that collide with the Proxy's internal variables, contract memory is corrupted and destroyed!).",
    "conceptInvariant": "Proxy Storage Decoupling Invariant: The Proxy and Implementation share the EXACT same storage space (the Proxy's storage); the Implementation's state variable declarations must align perfectly with the storage slots established in V1; state variables must NEVER be reordered, deleted, or inserted between existing variables.",
    "failureMode": "Adding a new state variable at the top of an upgraded Implementation contract: 'uint256 public newVar;' declared before existing variables shifts all subsequent variables down by 1 slot; reading 'balances[user]' now reads the wrong slot, corrupting all account balances.",
    "tryItFriction": "Construct a minimal Delegatecall Proxy from scratch in Solidity: deploy Proxy with an implementation address stored at custom EIP-1967 storage slot (`bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1)`); deploy ImplementationV1 with `uint256 public count`; call increment() through the proxy; deploy ImplementationV2 adding a decrement() function; upgrade the proxy; and verify that `count` preserves its value without storage collisions.",
    "socraticHints": [
      "Why does EIP-1967 store the implementation address at a pseudo-random hash slot instead of standard Slot 0?",
      "Because if the Proxy stored 'address implementation' at Slot 0, and the Implementation contract stored 'uint256 public count' at Slot 0, executing delegatecall would cause count to overwrite the implementation address, corrupting the proxy permanently! EIP-1967 uses a pseudo-random slot (0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc) that will never collide with standard variables!",
      "Standardized EIP-1967 slots protect proxy metadata."
    ],
    "situationalPuzzle": {
      "scenario": "A developer deploys an upgradeable contract behind a proxy. In the Implementation contract, the developer writes: 'constructor() { owner = msg.sender; }'. When interacting with the contract through the Proxy, calling an onlyOwner function reverts with 'Unauthorized', and owner is address(0). Why did the constructor fail to initialize the owner?",
      "options": [
        "Constructors are deprecated in Solidity.",
        "Constructor vs Initializer Execution Context: Constructors run ONCE during deployment in the context of the IMPLEMENTATION contract's storage! The Proxy's storage was never touched during constructor execution! When users interact through the Proxy, the Proxy's slot 0 (owner) remains 0x0! In upgradeable contracts, constructors must be replaced with an 'initialize()' function marked with OpenZeppelin's 'initializer' modifier, executed via delegatecall through the Proxy.",
        "The deployer had 0 ETH.",
        "The proxy address was invalid."
      ],
      "answerIdx": 1,
      "debrief": "Constructors never run in the context of a proxy. Code inside a constructor modifies only the implementation contract's storage at deployment time. Upgradeable contracts must use regular functions (typically named 'initialize()') guarded by the 'initializer' modifier, called explicitly through the proxy to write initial values to the proxy's storage."
    },
    "quests": [
      {
        "id": "bc-m1-d41-q1",
        "name": "EIP-1967 Storage Slot Specification & Collision Proof",
        "type": "concept",
        "desc": "Derive the mathematical storage slots for EIP-1967 implementation, admin, and beacon slots and prove 2^256 collision immunity."
      },
      {
        "id": "bc-m1-d41-q2",
        "name": "Storage Layout AST Mutation & Collision Linter",
        "type": "detective",
        "desc": "Build an automated Forge script using forge inspect storage comparing V1 and V2 storage layouts to detect illegal variable shifts or reorderings."
      },
      {
        "id": "bc-m1-d41-q3",
        "name": "EIP-1967 Compliant Proxy & Implementation V1/V2",
        "type": "mastery",
        "desc": "Implement a raw Yul-powered EIP-1967 proxy in Solidity supporting implementation upgrades, initialize functions, and fallback forwarding."
      },
      {
        "id": "bc-m1-d41-q4",
        "name": "3 AM SRE: $20M Frozen in Proxy After Storage Slot Collision",
        "type": "incident",
        "desc": "Triage and fix an emergency production proxy upgrade where an un-aligned storage variable shift overwrote the implementation address."
      }
    ]
  },
  {
    "day": 42,
    "month": 2,
    "blockNum": 9,
    "title": "Transparent Upgradeable Proxy (TUP): Admin Fallback Collisions & Function Selector Clashes",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Advanced Proxy Topologies (TUP, ProxyAdmin & Function Selector Clashes)",
    "spokenGoal": "Master the most battle-tested upgradeability pattern in Ethereum history: The Transparent Upgradeable Proxy (TUP). Confront the subtle and deadly hazard of Function Selector Clashing: in Solidity, function calls are identified by their first 4 bytes (`bytes4(keccak256(signature))`). An administrative function in the Proxy (e.g. `upgradeTo(address)`) might accidentally have the EXACT SAME 4-byte selector as a user function in the Implementation (e.g. `payout(address)`)! If a user calls `payout()`, the proxy intercepts it as `upgradeTo()`! Deconstruct how TUP solves this: The Transparent Rule (if msg.sender is the Admin, calls are handled by the proxy for administration and NEVER forwarded; if msg.sender is any other user, calls are ALWAYS forwarded via delegatecall). Understand why TUP uses a dedicated `ProxyAdmin` contract.",
    "conceptInvariant": "Transparent Proxy Disambiguation Invariant: The proxy must strictly bifurcate execution based on caller identity: admin calls are handled locally by the proxy without delegatecall; non-admin calls are transparently forwarded to the implementation; zero function selector ambiguity can exist.",
    "failureMode": "Admin attempting to interact with regular business logic through a Transparent Proxy; because the admin is recognized as Admin, the proxy does NOT forward the call, causing user functions to revert or behave unpredictably.",
    "tryItFriction": "Construct a Transparent Upgradeable Proxy with ProxyAdmin in Foundry: generate a 4-byte selector collision between proxy management functions and implementation functions; demonstrate how TUP separates admin vs user contexts; deploy ProxyAdmin; execute an upgrade from V1 to V2 through ProxyAdmin; and verify that regular users interact with business logic cleanly.",
    "socraticHints": [
      "Why must the ProxyAdmin contract be the admin of a Transparent Proxy rather than an individual EOA?",
      "Because if an individual developer's EOA is the admin, that developer can NEVER interact with the contract as a normal user! Any time they try to call transfer() or swap(), the proxy intercepts the call looking for administrative functions! A separate ProxyAdmin contract ensures the developer's EOA is treated as a normal user when interacting with the proxy!",
      "ProxyAdmin cleanly separates admin duties from user interactions."
    ],
    "situationalPuzzle": {
      "scenario": "An engineer deploys an Implementation contract for a Transparent Proxy. The contract includes an administrative function 'function setFee(uint256 fee) external onlyOwner'. The protocol admin calls 'proxy.setFee(50)' from their admin wallet. The transaction reverts with 'Transaction reverted: function does not exist'. The admin confirms 'setFee' exists in the implementation. Why did the call revert?",
      "options": [
        "The gas price was too low.",
        "Transparent Proxy Admin Interception: Because the caller was the Proxy Admin, the Transparent Proxy checked its OWN contract for a function named 'setFee'! Since 'setFee' is part of the implementation (not the proxy's administrative interface), and the transparent rule prevents admin calls from ever forwarding to the implementation, the call reverted! To call implementation functions, the admin must interact from a non-admin address, while administrative functions like 'upgradeTo' must be called via ProxyAdmin.",
        "Solidity does not support fees.",
        "The proxy was already upgraded."
      ],
      "answerIdx": 1,
      "debrief": "This is the exact reason Transparent Proxies require a ProxyAdmin contract. Under the transparent proxy rule, calls from the admin address are NEVER forwarded to the implementation. If the admin tries to invoke a standard contract function, the call fails. Routing upgrades through a dedicated ProxyAdmin contract solves this operational hazard."
    },
    "quests": [
      {
        "id": "bc-m1-d42-q1",
        "name": "Function Selector Hash Collision & Birthday Mathematics",
        "type": "concept",
        "desc": "Calculate the probability of generating a 4-byte selector collision between arbitrary function signatures across 2^32 possible selectors."
      },
      {
        "id": "bc-m1-d42-q2",
        "name": "Transparent Proxy Disambiguation Trace Analyzer",
        "type": "detective",
        "desc": "Trace EVM call frames in Foundry proving that admin calls are isolated from implementation delegation while user calls forward seamlessly."
      },
      {
        "id": "bc-m1-d42-q3",
        "name": "Production Transparent Upgradeable Proxy Suite",
        "type": "mastery",
        "desc": "Author an audited Transparent Upgradeable Proxy with ProxyAdmin, EIP-1967 storage slots, and V1-to-V2 upgrade tests in Foundry."
      },
      {
        "id": "bc-m1-d42-q4",
        "name": "3 AM SRE: Governance Deadlock from Admin Call Interception",
        "type": "incident",
        "desc": "Resolve a high-severity production outage where a multisig was locked out of protocol operations due to transparent proxy admin routing rules."
      }
    ]
  },
  {
    "day": 43,
    "month": 2,
    "blockNum": 9,
    "title": "Universal Upgradeable Proxy Standard (UUPS - EIP-1822): Implementation Upgrades & Self-Destruct Risks",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Modern Proxy Architectures (UUPS Economics, EIP-1822 & Selfdestruct Hazards)",
    "spokenGoal": "Upgrade to the modern, gas-efficient standard recommended by OpenZeppelin: The Universal Upgradeable Proxy Standard (UUPS - EIP-1822). Contrast UUPS with Transparent Proxies: In TUP, upgrade logic resides inside the Proxy (requiring expensive caller checks on EVERY single transaction, costing ~2,000 extra gas per call). In UUPS, upgrade logic (`upgradeToAndCall`) resides inside the IMPLEMENTATION contract! The proxy becomes a wafer-thin generic delegatecall forwarder. Analyze the benefits: drastically lower deployment gas, cheaper runtime calls, and the ability to eliminate upgradeability in future versions! Confront the existential threat of UUPS: If an upgraded implementation forgets to inherit `UUPSUpgradeable`, the contract can NEVER be upgraded again! Analyze historical selfdestruct vulnerabilities on uninitialized implementations (the Wormhole / OpenZeppelin vulnerability).",
    "conceptInvariant": "Implementation-Side Upgrade Invariant: In UUPS, the authorization and logic for upgrading reside strictly in the implementation contract; every deployed implementation MUST inherit UUPSUpgradeable and authorize upgrade permissions, or the proxy becomes permanently non-upgradeable.",
    "failureMode": "Deploying an uninitialized UUPS implementation contract on-chain without calling '_disableInitializers()'; an attacker calls 'initialize()' directly on the implementation contract, becomes owner, and executes 'selfdestruct', destroying the implementation bytecode and bricking all associated proxies permanently.",
    "tryItFriction": "Implement an audited UUPS Upgradeable Protocol in Foundry: deploy UUPS Proxy pointing to ImplementationV1 with `_disableInitializers()` in constructor; initialize state through the proxy; deploy ImplementationV2 adding new features and inheriting UUPSUpgradeable; execute upgrade through the proxy; and write a Foundry test proving that forgetting UUPSUpgradeable in V2 breaks future upgrades.",
    "socraticHints": [
      "Why must UUPS implementation contracts include '_disableInitializers()' in their constructors?",
      "Because an implementation contract sits deployed on the blockchain as an independent contract! If its constructor does not lock initialization, anyone can call 'initialize()' directly on the logic contract, seize ownership of it, and if it has a selfdestruct opcode, destroy the contract and brick all proxies!",
      "Always call _disableInitializers() in the logic constructor."
    ],
    "situationalPuzzle": {
      "scenario": "A development team upgrades their UUPS protocol to V2. The upgrade succeeds! However, next month, when attempting to deploy V3, calling 'upgradeTo(V3)' reverts with 'Function does not exist'. The team discovers that ImplementationV2 forgot to inherit 'UUPSUpgradeable'. Can the team recover the upgradeability of their proxy?",
      "options": [
        "Yes, by calling the ProxyAdmin.",
        "Permanent Upgradeability Forfeiture (Bricked Upgrade Logic): No! In UUPS, the proxy has ZERO upgrade logic of its own\u2014it strictly forwards calls to the implementation! Since ImplementationV2 lacks 'upgradeTo()', there is physically no code in the system capable of changing the implementation address at EIP-1967 slot! The proxy is permanently locked to ImplementationV2 forever. It has effectively become an immutable contract.",
        "Yes, by submitting a hard fork request.",
        "The proxy automatically reverts to V1."
      ],
      "answerIdx": 1,
      "debrief": "This is the primary operational risk of UUPS. In Transparent Proxies, upgrade logic lives in the proxy and can never be lost. In UUPS, upgrade logic lives in the implementation. If an implementation upgrade omits the upgrade function, the proxy permanently loses the ability to upgrade. OpenZeppelin's Upgrades Plugins catch this at deployment time."
    },
    "quests": [
      {
        "id": "bc-m1-d43-q1",
        "name": "UUPS vs Transparent Proxy Gas Economics & Bytecode Audit",
        "type": "concept",
        "desc": "Analyze execution gas savings (EIP-1822 vs EIP-1967 TUP) and calculate deployment cost reductions across 1,000 proxy deployments."
      },
      {
        "id": "bc-m1-d43-q2",
        "name": "UUPS Uninitialized Logic Selfdestruct Exploit Harness",
        "type": "detective",
        "desc": "Reproduce the historical OpenZeppelin UUPS uninitialized implementation exploit in Foundry and verify _disableInitializers() mitigation."
      },
      {
        "id": "bc-m1-d43-q3",
        "name": "Production UUPS Upgradeable Protocol in Foundry",
        "type": "mastery",
        "desc": "Author an audited UUPS contract in Solidity with Ownable2Step, initializers, storage gaps, and comprehensive multi-version upgrade tests."
      },
      {
        "id": "bc-m1-d43-q4",
        "name": "3 AM SRE: Permanent Upgrade Lockout from Missing UUPS Inheritance",
        "type": "incident",
        "desc": "Conduct a post-mortem and mitigation analysis for a protocol that accidentally locked its UUPS proxy by omitting upgrade functions in V2."
      }
    ]
  },
  {
    "day": 44,
    "month": 2,
    "blockNum": 9,
    "title": "The Diamond Standard (ERC-2535): Multi-Facet Proxies, Function Selectors & Diamond Loupe",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Modular Contract Architecture (The Diamond Standard ERC-2535 & Multi-Facet Routing)",
    "spokenGoal": "Shatter the 24KB contract bytecode limit (EIP-170) forever with modular multi-contract architectures: The Diamond Standard (ERC-2535 Multi-Facet Proxy). Understand the architectural leap of ERC-2535: instead of a proxy delegating to a single monolithic implementation contract, a 'Diamond' proxy delegates function calls to DOZENS of separate logic contracts called 'Facets'! The Diamond maintains a dynamic mapping: `mapping(bytes4 selector => FacetAddress)`. When an incoming function call arrives, the Diamond extracts the 4-byte selector from calldata, looks up the specific Facet address in storage, and forwards the call via `delegatecall`. Master the Diamond Loupe interface (inspecting active facets and selectors) and `diamondCut()` (atomically adding, replacing, or removing facets).",
    "conceptInvariant": "Modular Function Routing Invariant: In an ERC-2535 Diamond, every supported 4-byte function selector maps to exactly one active Facet contract; all facets share the Diamond's unified storage via structured AppStorage / DiamondStorage patterns without storage slot collisions.",
    "failureMode": "Adding two facets that implement identical 4-byte function selectors to a Diamond; diamondCut fails to enforce selector uniqueness, causing the routing table to overwrite existing selectors and breaking core functionality.",
    "tryItFriction": "Construct a working ERC-2535 Diamond Proxy in Solidity: implement DiamondCutFacet (adding/replacing/removing facets); implement DiamondLoupeFacet (inspecting facets); deploy TokenFacet and StakingFacet; route calls through the Diamond proxy; use DiamondStorage / AppStorage struct pointers; and verify that calls to token and staking methods share state seamlessly.",
    "socraticHints": [
      "How do multiple Facets share state variables in a Diamond without colliding storage slots?",
      "By using Diamond Storage (or AppStorage)! Instead of declaring standard state variables, facets declare a Struct containing all protocol state, stored at a specific pseudo-random hash slot (e.g. keccak256('diamond.storage.app'))! All facets access state by pointing a storage pointer to this exact slot, guaranteeing 100% collision-free shared state!",
      "AppStorage gives facets clean, unified access to global variables."
    ],
    "situationalPuzzle": {
      "scenario": "A massive DeFi protocol grows to 80,000 lines of Solidity code, exceeding the 24KB contract limit by 400%. The team splits the protocol into 8 Facets behind an ERC-2535 Diamond. During an upgrade, the team wants to replace the 'SwapFacet' without pausing the 'LendingFacet' or 'StakingFacet'. How does DiamondCut execute this hot-swap without downtime?",
      "options": [
        "Deploy a brand new Diamond proxy and migrate all funds.",
        "Granular Selector Hot-Swapping via diamondCut: The Diamond admin calls 'diamondCut()', specifying Action.Replace for the specific function selectors belonging to SwapFacet, pointing them to the newly deployed SwapFacetV2! The selectors for Lending and Staking remain completely untouched! The upgrade executes atomically in a single transaction with zero downtime, zero fund migration, and zero impact on other facets.",
        "Diamonds cannot be upgraded once deployed.",
        "Restart the Ethereum blockchain."
      ],
      "answerIdx": 1,
      "debrief": "This is the signature capability of the Diamond Standard. Unlike monolithic proxies that require replacing the entire contract implementation for a single bug fix, an ERC-2535 Diamond allows surgical, selector-level hot-swapping. You can replace a single function or facet while all other protocol modules remain fully operational."
    },
    "quests": [
      {
        "id": "bc-m1-d44-q1",
        "name": "ERC-2535 Diamond Routing Table & Dispatch Mathematics",
        "type": "concept",
        "desc": "Derive the mathematical complexity of mapping-based function selector dispatching vs binary search dispatch in monolithic bytecode."
      },
      {
        "id": "bc-m1-d44-q2",
        "name": "Diamond Loupe AST Inspector & Selector Uniqueness Linter",
        "type": "detective",
        "desc": "Build an automated verification script inspecting DiamondLoupe facets, detecting selector overlaps, and validating AppStorage alignment."
      },
      {
        "id": "bc-m1-d44-q3",
        "name": "Production ERC-2535 Diamond Multi-Facet System in Foundry",
        "type": "mastery",
        "desc": "Author a full working Diamond proxy in Solidity with DiamondCut, DiamondLoupe, ERC-20 facet, Staking facet, and AppStorage patterns."
      },
      {
        "id": "bc-m1-d44-q4",
        "name": "3 AM SRE: Selector Collision Overwrite in Production DiamondCut",
        "type": "incident",
        "desc": "Triage and fix an emergency incident where an improper diamondCut call accidentally overwrote the DiamondLoupe facet selectors."
      }
    ]
  },
  {
    "day": 45,
    "month": 2,
    "blockNum": 9,
    "title": "Milestone 8: Production ERC-2535 Diamond Multi-Facet Modular Upgrade Engine",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Block 9 Capstone Project & Architectural Gate",
    "spokenGoal": "Synthesize the entire discipline of smart contract upgradeability, storage collision prevention, Transparent proxies, UUPS economics, and Diamond multi-facet routing into an enterprise architecture: The Production ERC-2535 Diamond Multi-Facet Modular Upgrade Engine. In this milestone, architect an institutional-grade protocol scaling far beyond the 24KB limit: build an ERC-2535 Diamond proxy routing calls across 4 distinct facets (VaultFacet, GovernanceFacet, YieldFacet, DiamondLoupeFacet); implement DiamondStorage pointer isolation; execute surgical single-function upgrades using `diamondCut()`; enforce 2-step multi-sig governance approval for upgrades; and benchmark gas consumption against monolithic contracts.",
    "conceptInvariant": "Modular Diamond Integrity Invariant: All functions across all facets must execute within the Diamond proxy's shared storage context with zero storage slot overlap; selector routing must remain deterministic, and unauthorized diamondCut invocations must be mathematically impossible.",
    "failureMode": "Failing the milestone gate when an upgrade overwrites existing selector mappings, when facets access unaligned storage slots, or when unauthorized callers execute diamondCut.",
    "tryItFriction": "Construct and deliver the complete Solidity 0.8.20 + Foundry milestone system: deploy Diamond proxy with DiamondCut and DiamondLoupe; attach VaultFacet and YieldFacet; deposit 10,000 mock USDC through the proxy; execute a live `diamondCut` upgrade replacing YieldFacet with an optimized V2; prove that user balances in VaultFacet are 100% preserved; and verify that the DiamondLoupe correctly reports the new facet address.",
    "socraticHints": [
      "What is the gas overhead of an ERC-2535 Diamond call compared to a standard contract call?",
      "A standard contract call executes directly. A Diamond call executes: 1) Extract selector (calldata); 2) Storage SLOAD to find Facet address (~100-2,100 gas); 3) DELEGATECALL to Facet (~2,600 gas)! Total overhead is ~2,700 to 4,700 gas per call!",
      "The architectural trade-off is slightly higher gas per call in exchange for unlimited contract size and granular upgradeability."
    ],
    "situationalPuzzle": {
      "scenario": "During your Milestone 8 defense, the examiner attempts to execute a malicious diamondCut to replace the VaultFacet with a draining contract. The examiner provides a signature from the protocol owner. However, your Diamond requires a 48-hour Timelock and a 3-of-5 Multi-Sig approval before executing diamondCut. How does your architecture protect user funds from instant malicious upgrades?",
      "options": [
        "The node rejects the examiner.",
        "Timelocked Governance Upgrade Pipeline: In institutional protocols, diamondCut is NOT callable directly by any single EOA! The Diamond's owner is an audited TimelockController contract! Proposed facet upgrades must be queued on-chain with a 48-hour delay by a 3-of-5 multi-sig. Users and monitoring bots observe the pending upgrade in the event logs; if malicious, users have 48 hours to withdraw their funds before execution.",
        "Diamonds cannot be protected by timelocks.",
        "The examiner fails the candidate."
      ],
      "answerIdx": 1,
      "debrief": "Instantaneous admin upgrades are the #1 central point of failure in Web3 protocols (the 'rug pull' hazard). Institutional architectures place all proxy upgrades behind a decentralized Multi-Sig and a mandatory 48-to-72 hour Timelock contract. This guarantees transparency and gives users time to exit if an upgrade is contentious or compromised."
    },
    "quests": [
      {
        "id": "bc-m1-d45-q1",
        "name": "ERC-2535 Diamond Enterprise Architecture Blueprint",
        "type": "concept",
        "desc": "Produce the formal engineering design document detailing Diamond routing tables, AppStorage layouts, Timelock governance, and facet isolation."
      },
      {
        "id": "bc-m1-d45-q2",
        "name": "Diamond Storage Collision & Fuzzing Verification Suite",
        "type": "detective",
        "desc": "Build automated fuzzing tests in Foundry asserting 100% state preservation and zero storage collisions across 10 consecutive diamondCut upgrades."
      },
      {
        "id": "bc-m1-d45-q3",
        "name": "Production ERC-2535 Diamond Protocol Implementation",
        "type": "mastery",
        "desc": "Author and test the complete Diamond multi-facet protocol in Solidity and Foundry with Timelock governance and automated deployment scripts."
      },
      {
        "id": "bc-m1-d45-q4",
        "name": "Milestone 8 Viva Gate: Modular Upgradeability Defense",
        "type": "incident",
        "desc": "Defend the Diamond architecture before the Senior Web3 Board, demonstrating live facet hot-swapping and proving timelock defense integrity."
      }
    ]
  },
  {
    "day": 46,
    "month": 2,
    "blockNum": 10,
    "title": "Blockchain Scalability Trilemma & Layer 2 Taxonomy: State Channels, Sidechains vs Rollups",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Scalability Theory & Modular Architectures (The Trilemma, Execution vs Settlement)",
    "spokenGoal": "Confront the central engineering bottleneck of decentralized ledgers: The Blockchain Scalability Trilemma (Vitalik Buterin's theorem: a blockchain can achieve at most two of Decentralization, Security, and Scalability). Understand why monolithic Layer 1s (Bitcoin at 7 TPS, Ethereum at 15 TPS) cannot process thousands of global transactions without pricing out ordinary users or demanding massive validator hardware that destroys decentralization. Trace the evolution of Layer 2 solutions: State Channels (Bitcoin Lightning, off-chain peer-to-peer balance updates), Sidechains (Polygon PoS, separate consensus, separate security), and Rollups (executing transactions off-chain, compressing data, and settling cryptographic proofs + data availability back to Ethereum Layer 1).",
    "conceptInvariant": "Rollup Security Inheritance Invariant: A true Layer 2 Rollup must inherit the full censorship resistance and economic security of Ethereum Layer 1; even if all Layer 2 sequencers collude or vanish, users can trustlessly force transaction inclusion and exit their assets via Layer 1 contracts.",
    "failureMode": "Confusing a Sidechain with a Layer 2 Rollup; marketing a sidechain as an L2 when it relies on a small external validator set; if the sidechain validators collude, they can forge state roots and steal 100% of user bridge funds with zero Layer 1 protection.",
    "tryItFriction": "Construct a comparative analytical model in TypeScript: evaluate transaction throughput, latency, gas cost per transfer, and capital requirements across Ethereum L1, Lightning State Channels, Polygon PoS Sidechain, and Arbitrum Rollup; simulate a sequencer crash; and prove that only the Rollup allows trustless forced withdrawal on L1.",
    "socraticHints": [
      "What is the fundamental difference between a Sidechain and a Rollup?",
      "Data Availability and Settlement! A Sidechain has its own independent consensus mechanism and validator set; if those validators are compromised, user funds are lost! A Rollup posts its transaction data or cryptographic state proofs directly to Ethereum Layer 1, inheriting Ethereum's trillion-dollar validator security!",
      "Rollups derive security from L1; sidechains do not."
    ],
    "situationalPuzzle": {
      "scenario": "A centralized sequencer on an Optimistic Rollup decides to censor an activist's wallet, refusing to include their transactions in any L2 block. How does the user bypass the malicious sequencer and force their transaction onto the rollup?",
      "options": [
        "The user must sue the sequencer company.",
        "Forced Transaction Inclusion via Layer 1 Inbox Contract: The user calls the Rollup's 'Bridge / Delayed Inbox' contract directly on Ethereum Layer 1! The L1 contract accepts the transaction and timestamps it. If the sequencer does not include the transaction in an L2 batch within a mandatory grace period (e.g. 24 hours), the L1 contract automatically forces the transaction into the rollup state or allows anyone to propose the block, completely bypassing sequencer censorship!",
        "The user's funds are permanently lost.",
        "Layer 2 networks cannot be censored."
      ],
      "answerIdx": 1,
      "debrief": "Censorship resistance is the defining feature of true Layer 2 Rollups. Unlike centralized cloud databases, rollups maintain an 'Escape Hatch' / 'Forced Inbox' on Layer 1. If a sequencer attempts censorship, users can submit transactions directly to the L1 bridge contract, which forces execution on L2."
    },
    "quests": [
      {
        "id": "bc-m2-d46-q1",
        "name": "Scalability Trilemma & Modular Blockchain Mathematical Model",
        "type": "concept",
        "desc": "Formulate the modular blockchain decomposition separating Execution, Settlement, Consensus, and Data Availability (DA)."
      },
      {
        "id": "bc-m2-d46-q2",
        "name": "Rollup vs Sidechain Security & Failure Mode Benchmark",
        "type": "detective",
        "desc": "Benchmark economic attack costs required to steal funds from a 5-validator sidechain vs a true optimistic/ZK rollup settling to Ethereum."
      },
      {
        "id": "bc-m2-d46-q3",
        "name": "L1 Forced Transaction Inbox & Escape Hatch Simulator",
        "type": "mastery",
        "desc": "Build an L1-L2 bridge simulation in Solidity and TypeScript demonstrating sequencer censorship and forced L1 inbox transaction execution."
      },
      {
        "id": "bc-m2-d46-q4",
        "name": "3 AM SRE: Sequencer Outage Halting Millions in L2 Trading",
        "type": "incident",
        "desc": "Triage a live L2 incident where a primary sequencer crashed, initiating emergency failover to decentralized backup proposers."
      }
    ]
  },
  {
    "day": 47,
    "month": 2,
    "blockNum": 10,
    "title": "Optimistic Rollups: Fraud Proofs, 7-Day Challenge Window & Interactive Dispute Games",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Optimistic Scaling (Fraud Proofs, Bisection Games & Dispute Economics)",
    "spokenGoal": "Deep-dive into the architecture powering Arbitrum and Optimism: Optimistic Rollups. Understand the 'Optimistic' assumption: the sequencer batches thousands of transactions off-chain and posts the resulting State Root to Ethereum Layer 1, ASSUMING the state transition is valid without proving it upfront! If the state is assumed valid, how is security maintained? Enter Fault Proofs (Fraud Proofs) and the 7-Day Challenge Window: any honest verifier can challenge an invalid state root within 7 days. Deconstruct the Interactive Bisection Dispute Game (Arbitrum Nitro / Cannon): instead of re-executing an entire block on L1 (which exceeds block gas limits!), the challenger and defender play an on-chain binary search bisection game to narrow the disagreement down to a SINGLE EVM INSTRUCTION, executed on-chain via an EVM-in-EVM micro-interpreter (One-Step Prover)!",
    "conceptInvariant": "1-of-N Honesty Invariant: An Optimistic Rollup requires only a single honest observer in the entire world to monitor state roots and submit a fraud proof during the 7-day challenge window to reverse an invalid state transition and slash the malicious sequencer.",
    "failureMode": "Allowing immediate cross-chain withdrawals from an Optimistic Rollup to L1 without waiting for the 7-day challenge window; a malicious sequencer posts a fraudulent state root giving themselves $100M, withdraws immediately on L1, and absconds before challengers can submit a fraud proof.",
    "tryItFriction": "Construct an Interactive Bisection Dispute Game in TypeScript: simulate two parties disagreeing on the state after executing 1,024 EVM instructions; execute a log2(1024) = 10-step binary search bisection; pinpoint the exact instruction index where outputs diverge; execute a single-instruction One-Step Prover on-chain; and slash the dishonest party's deposit.",
    "socraticHints": [
      "Why is the challenge window on Optimistic Rollups set to exactly 7 days rather than 1 hour?",
      "To withstand Ethereum Layer 1 Denial-of-Service attacks! If an adversary spends millions of dollars congesting Ethereum gas prices or organizing 51% miner censorship, a 1-hour window could expire before a challenger's fraud proof is mined! A 7-day window guarantees sufficient time to defeat even massive multi-day censorship attacks!",
      "7 days guarantees safety under extreme network congestion."
    ],
    "situationalPuzzle": {
      "scenario": "A user on Arbitrum wants to withdraw 10 ETH to Ethereum Layer 1, but doesn't want to wait 7 days for the dispute window to close. They use an external 'Fast Bridge' (like Across or Hop Protocol). The bridge gives them 9.99 ETH on Layer 1 within 2 minutes. How does the fast bridge provide instant liquidity while taking on the 7-day delay?",
      "options": [
        "The bridge hacks the dispute window.",
        "Liquidity Provider Underwriting & Fraud Proof Elimination: The fast bridge runs its own private validating node! The bridge verifies off-chain that the user's L2 transaction is 100% valid! Because the bridge knows with mathematical certainty that no fraud proof can succeed against this transaction, the bridge's LPs front their own L1 capital immediately, charging a 0.1% convenience fee, and claim the user's L1 withdrawal themselves 7 days later.",
        "Arbitrum removed the 7-day window.",
        "Ethereum allows instant rollbacks."
      ],
      "answerIdx": 1,
      "debrief": "Fast bridges operate as optimistic liquidity underwriters. Because any node can run the rollup code locally and verify state validity instantly, private liquidity providers can verify that a withdrawal is mathematically guaranteed to succeed. They lend instant capital on L1 in exchange for a fee, absorbing the 7-day waiting period."
    },
    "quests": [
      {
        "id": "bc-m2-d47-q1",
        "name": "Interactive Bisection Dispute Game Formal Mathematics",
        "type": "concept",
        "desc": "Derive the logarithmic bisection step complexity O(log N) for multi-instruction disputes and formalize the One-Step Prover state transition."
      },
      {
        "id": "bc-m2-d47-q2",
        "name": "Interactive Dispute Bisection Simulator in TypeScript",
        "type": "detective",
        "desc": "Implement the interactive binary search game in TypeScript narrowing down a 65,536-instruction trace disagreement to a single failing opcode."
      },
      {
        "id": "bc-m2-d47-q3",
        "name": "One-Step Prover & Fraud Challenge Contract in Foundry",
        "type": "mastery",
        "desc": "Author a Solidity contract verifying a single-opcode state transition proof and slashing bonded sequencer stakes on invalid state roots."
      },
      {
        "id": "bc-m2-d47-q4",
        "name": "3 AM SRE: Fraud Proof Challenge Expiration Near 7-Day Deadline",
        "type": "incident",
        "desc": "Lead the emergency war room coordinating high-priority gas bidding to land a valid fraud proof transaction before a 7-day dispute window closes."
      }
    ]
  },
  {
    "day": 48,
    "month": 2,
    "blockNum": 10,
    "title": "Zero-Knowledge (ZK) Rollups: Validity Proofs, Immediate Finality & zkEVM Architectures",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Zero-Knowledge Scaling (Validity Proofs, Immediate Finality & zkEVMs)",
    "spokenGoal": "Explore the cryptographic holy grail of blockchain scalability: Zero-Knowledge (ZK) Rollups (Starknet, zkSync Era, Scroll, Polygon zkEVM). Contrast Optimistic Rollups (rely on game-theoretic dispute periods: wait 7 days) with ZK-Rollups (rely on pure mathematics: Validity Proofs). Understand how ZK-Rollups work: an off-chain prover generates a succinct cryptographic proof (ZK-SNARK or ZK-STARK) proving that 10,000 transactions were executed correctly conforming to EVM rules; an on-chain verifier smart contract verifies the proof on Layer 1 in milliseconds for ~250,000 gas! As soon as the proof is verified on L1, transactions achieve Immediate Mathematical Finality with ZERO 7-day delay. Analyze Vitalik's zkEVM Taxonomy: Type 1 (fully Ethereum-equivalent) to Type 4 (high-level language equivalent).",
    "conceptInvariant": "Cryptographic Validity Invariant: A ZK-Rollup state transition is verified strictly via cryptographic soundness; invalid state transitions are mathematically impossible to prove, eliminating dispute periods and delivering instant Layer 1 finality.",
    "failureMode": "Generating a ZK proof for a state transition but failing to publish transaction data or state diffs on-chain; the state is mathematically valid, but nobody knows who owns what balance (the Data Availability Problem), freezing the rollup.",
    "tryItFriction": "Construct a mock ZK-Rollup Verifier in Solidity 0.8.20: deploy an on-chain Verifier contract; generate a mock Groth16 cryptographic proof (points A, B, C) in TypeScript; submit a batch of 50 token transfers with an updated Merkle State Root; verify the proof on-chain in 200,000 gas; and verify immediate withdrawal finality on L1 without a challenge period.",
    "socraticHints": [
      "Why is a ZK-Rollup significantly more computationally expensive for the operator than an Optimistic Rollup?",
      "Because generating zero-knowledge validity proofs requires massive mathematical computations (evaluating complex polynomial arithmetic circuits across billions of constraints)! Proving requires high-end server clusters with specialized GPUs/FPGAs!",
      "However, verifying the proof on L1 is ultra-cheap and fast."
    ],
    "situationalPuzzle": {
      "scenario": "A financial institution compares Arbitrum (Optimistic) and zkSync (ZK-Rollup) for an institutional treasury payment rails. The institution requires that when funds are bridged back to L1, they must be settled and liquid within 1 hour to meet collateral margin deadlines. Why is a ZK-Rollup the only native architecture that satisfies this requirement?",
      "options": [
        "ZK-Rollups have lower fees.",
        "Validity Proof Immediate Finality: Optimistic Rollups natively enforce a 7-day challenge window before L1 bridge withdrawals unlock! ZK-Rollups post cryptographic Validity Proofs directly to L1 every few minutes or hours. Once the on-chain verifier contract confirms the ZK-SNARK/STARK proof on Ethereum L1, the withdrawal is finalized immediately with mathematical certainty, easily meeting the 1-hour liquidity requirement.",
        "Optimistic rollups are not decentralized.",
        "Institutions are prohibited from using Arbitrum."
      ],
      "answerIdx": 1,
      "debrief": "ZK-Rollups provide cryptographic validity proofs that settle instantaneously on Layer 1 as soon as the proof is verified by the L1 contract. There is no dispute window because invalid state transitions cannot produce a valid cryptographic proof. This makes ZK-rollups ideal for institutional settlements requiring rapid native finality."
    },
    "quests": [
      {
        "id": "bc-m2-d48-q1",
        "name": "zkEVM Type 1-4 Taxonomy & Arithmetic Circuit Formalization",
        "type": "concept",
        "desc": "Analyze the architectural trade-offs between EVM-equivalence (Type 1/2) and prover performance (Type 3/4) across zkEVM implementations."
      },
      {
        "id": "bc-m2-d48-q2",
        "name": "ZK-SNARK Verifier Gas Profiler & Pairing Precompile Audit",
        "type": "detective",
        "desc": "Profile on-chain gas costs of elliptic curve pairing checks (precompile 0x08) in Groth16 verifier contracts across varying batch sizes."
      },
      {
        "id": "bc-m2-d48-q3",
        "name": "Minimal ZK-Rollup Batch Verifier in Foundry",
        "type": "mastery",
        "desc": "Author a Solidity ZK-Rollup bridge contract verifying batch state roots, managing state diff commitments, and enabling instant L1 exits."
      },
      {
        "id": "bc-m2-d48-q4",
        "name": "3 AM SRE: ZK Prover Cluster Outage Causing L1 Settlement Backlog",
        "type": "incident",
        "desc": "Resolve a high-severity incident where GPU prover memory exhaustion halted proof generation, stalling L1 settlement batches."
      }
    ]
  },
  {
    "day": 49,
    "month": 2,
    "blockNum": 10,
    "title": "Data Availability (DA) Solutions: EIP-4844 Blobspace (Proto-Danksharding) & KZG Commitments",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Data Availability & Danksharding (EIP-4844 Blobs, KZG Polynomials & DA Layers)",
    "spokenGoal": "Tackle the true cost bottleneck of Layer 2 rollups: Data Availability (DA). Understand why rollups were historically expensive: prior to 2024, rollups had to post all compressed transaction data to Ethereum L1 as `calldata` (costing 16 gas per non-zero byte, consuming 90% of a rollup's total operating cost!). Master Ethereum's historic breakthrough: EIP-4844 (Proto-Danksharding, Dencun upgrade). Deconstruct Blob-Carrying Transactions: introducing temporary 128KB data 'Blobs' (up to 6 blobs per block) that persist on consensus nodes for only ~18 days before being pruned! Analyze KZG Polynomial Commitments: how L1 smart contracts verify that blob data matches the rollup state using cryptographic KZG commitments without loading the blob into EVM memory!",
    "conceptInvariant": "Ephemeral Data Availability Invariant: EIP-4844 blobs exist on consensus nodes only long enough (~18 days) to allow honest observers to construct fraud or validity proofs; blobs are never accessible to EVM execution opcodes, slashing rollup posting costs by 95%.",
    "failureMode": "Attempting to read blob bytes inside a smart contract using standard EVM opcodes; the code fails because blobs are invisible to the EVM; contracts can only inspect the 32-byte versioned KZG hash via the BLOBHASH opcode.",
    "tryItFriction": "Construct an EIP-4844 Blob Transaction in TypeScript using Viem: generate arbitrary rollup batch data; construct a 128KB blob buffer; compute the KZG polynomial commitment and proof; broadcast a blob transaction to an Anvil node with EIP-4844 support; and verify on-chain that `blobhash(0)` matches the expected versioned hash.",
    "socraticHints": [
      "Why are EIP-4844 blobs automatically pruned after 18 days?",
      "Because Ethereum nodes cannot store infinite gigabytes of rollup transaction data forever without disk exhaustion! 18 days is more than twice the 7-day fraud proof challenge window, providing ample time for anyone to verify the data! Long-term archiving is delegated to indexing services, not L1 nodes!",
      "Ephemeral storage prevents blockchain state bloat."
    ],
    "situationalPuzzle": {
      "scenario": "A rollup operator migrates their data posting from calldata to EIP-4844 blobs. Their L1 posting costs drop from $2,000 per day to $50 per day! However, during a sudden surge where multiple rollups post blobs simultaneously, blob gas prices spike from 1 wei to 2,000 gwei. How does the EIP-4844 independent blob fee market operate?",
      "options": [
        "Blob gas uses the exact same fee market as normal gas.",
        "Independent Multi-Dimensional EIP-1559 Fee Market: EIP-4844 created a completely separate fee market for blobs! Blobs have their own target (3 blobs per block) and max (6 blobs). If demand exceeds 3 blobs, blob base fee scales exponentially via EIP-1559 mechanics, INDEPENDENT of standard Ethereum execution gas! Normal ETH transfers can be cheap while blob gas is expensive, or vice versa.",
        "Blobs are always free.",
        "Rollups cannot compete for blob space."
      ],
      "answerIdx": 1,
      "debrief": "EIP-4844 implements multi-dimensional gas metering. Blob gas has its own independent EIP-1559 dynamic pricing algorithm that responds exclusively to blob demand. This isolates everyday Ethereum users from rollup data spikes, ensuring standard transaction fees remain stable even when rollups consume maximum blob capacity."
    },
    "quests": [
      {
        "id": "bc-m2-d49-q1",
        "name": "KZG Polynomial Commitment Mathematics & Trusted Setup",
        "type": "concept",
        "desc": "Derive the mathematical formulation of Kate-Zaverucha-Goldberg (KZG) polynomial commitments and opening proofs used in EIP-4844."
      },
      {
        "id": "bc-m2-d49-q2",
        "name": "EIP-4844 Blob Gas Market & Cost Reduction Analyzer",
        "type": "detective",
        "desc": "Quantify historical post-Dencun gas reductions across Arbitrum, Optimism, and Base comparing calldata vs blob posting costs."
      },
      {
        "id": "bc-m2-d49-q3",
        "name": "EIP-4844 Blob Pipeline & Point Evaluation in Foundry",
        "type": "mastery",
        "desc": "Build an end-to-end blob transaction pipeline in Viem and Foundry using the point evaluation precompile (0x0a) to verify KZG proofs."
      },
      {
        "id": "bc-m2-d49-q4",
        "name": "3 AM SRE: Stalled Rollup Ingestion from Blob Gas Spikes",
        "type": "incident",
        "desc": "Triage a production rollup incident where extreme blob gas spikes caused sequencer batch posting transactions to stall in the mempool."
      }
    ]
  },
  {
    "day": 50,
    "month": 2,
    "blockNum": 10,
    "title": "Milestone 9: Optimistic Fraud Proof Simulator & EIP-4844 Blob Data Ingestion Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Block 10 Capstone Project & Architectural Gate",
    "spokenGoal": "Synthesize the entire discipline of Layer 2 scaling, optimistic dispute games, and modular data availability into a functional rollup architecture: The Optimistic Fraud Proof Simulator & EIP-4844 Blob Ingestion Engine. In this milestone, architect a complete mini-rollup system: pack transaction batches into EIP-4844 compliant blobs; post versioned blob hashes to an L1 rollup bridge contract; implement a full interactive Bisection Dispute Game in Solidity that narrows multi-instruction state disagreements down to a single opcode; execute a One-Step Prover that executes the disputed instruction on-chain; slash dishonest sequencers; and prove trustless forced exits via an L1 Delayed Inbox.",
    "conceptInvariant": "Rollup L1 Verifiability Invariant: All rollup state transitions must be backed by verifiable data availability on L1; any fraudulent state root must be challengeable via logarithmic on-chain bisection and resolved decisively by an atomic One-Step Prover.",
    "failureMode": "Failing the milestone gate when an invalid state root cannot be challenged due to bisection game timeout bugs, or when blob commitments fail to verify against on-chain versioned hashes.",
    "tryItFriction": "Construct and deliver the complete Solidity 0.8.20 + Foundry milestone system: ingest 1,000 simulated transactions; post a 128KB blob with KZG commitment; simulate a dishonest sequencer posting an invalid state root; initiate a fraud challenge; execute a 10-step bisection dispute game; prove the invalid instruction using the One-Step Prover contract; slash the sequencer's 10 ETH bond; and verify that honest state is restored.",
    "socraticHints": [
      "How do we prevent a challenger from grieving a sequencer by starting infinite fake dispute games?",
      "By requiring a substantial Security Bond from both parties! The sequencer posts a bond when proposing a state root; the challenger must match that bond when opening a dispute! The losing party loses their bond, with 50% burned and 50% rewarded to the winner!",
      "Bonds make griefing attacks economically ruinous."
    ],
    "situationalPuzzle": {
      "scenario": "During your Milestone 9 defense, the examiner tests an edge case: the defender stops responding midway through the interactive bisection game (refuses to take their turn). How does your dispute contract prevent the game from being frozen indefinitely?",
      "options": [
        "The game waits forever.",
        "Turn-Based Timelock with Automated Default Forfeiture: The dispute contract enforces a strict Turn Clock (e.g. 24 hours per turn)! If the defender fails to submit their bisection step within the timelock window, the challenger calls 'timeout()'! The contract declares the non-responsive party forfeited by default, slashes their bond, discards the fraudulent state root, and resolves the game immediately.",
        "The challenger must pay more gas.",
        "The examiner fails the candidate."
      ],
      "answerIdx": 1,
      "debrief": "Interactive dispute games are asynchronous state machines. A malicious party could easily freeze the protocol by simply refusing to take their bisection turn. Turn clocks are mandatory: each player has a bounded time budget to respond. Exceeding the clock triggers immediate forfeiture, guaranteeing that disputes always resolve cleanly."
    },
    "quests": [
      {
        "id": "bc-m2-d50-q1",
        "name": "Layer 2 Rollup & Dispute Protocol Architecture Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive engineering specification detailing blob ingestion, bisection game state transitions, and One-Step Prover opcodes."
      },
      {
        "id": "bc-m2-d50-q2",
        "name": "Automated Dispute Game & Timeout Chaos Harness",
        "type": "detective",
        "desc": "Build an automated testing harness in Foundry verifying turn clock timeouts, bond slashing, and dispute resolution across 50 simulated games."
      },
      {
        "id": "bc-m2-d50-q3",
        "name": "Production Fraud Proof Simulator & Blob Engine Build",
        "type": "mastery",
        "desc": "Author and test the complete working dispute system in Solidity and Foundry with EIP-4844 blob verifiers and interactive bisection contracts."
      },
      {
        "id": "bc-m2-d50-q4",
        "name": "Milestone 9 Viva Gate: Layer 2 Scaling Architecture Defense",
        "type": "incident",
        "desc": "Defend the rollup scaling architecture before the Senior Web3 Board, demonstrating live bisection dispute resolution and blob verification."
      }
    ]
  },
  {
    "day": 51,
    "month": 2,
    "blockNum": 11,
    "title": "Zero-Knowledge Proofs: ZK-SNARKs & ZK-STARKs Foundations (Circuits, R1CS & Groth16)",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Cryptographic Primitives (Zero-Knowledge Mathematics, Circuits & SNARKs)",
    "spokenGoal": "Enter the pinnacle of modern applied cryptography: Zero-Knowledge Proofs (ZKPs). Understand the magic: proving knowledge of a secret (the 'witness' w) satisfying a computation C(x, w) = true WITHOUT revealing anything about the secret itself! Trace the mathematical transformation pipeline: 1) High-level computation &rarr; 2) Arithmetic Circuit (addition and multiplication gates over finite fields); 3) Rank-1 Constraint System (R1CS: equations of form (A &middot; s) &times; (B &middot; s) = (C &middot; s)); 4) Quadratic Arithmetic Programs (QAP: converting constraints to polynomial equations); and 5) Groth16 zk-SNARK pairing cryptography. Contrast SNARKs (succinct, constant 200-byte proof, requires trusted setup, vulnerable to quantum computing) with STARKs (transparent setup, quantum-resistant, larger 50-100KB proof sizes).",
    "conceptInvariant": "Zero-Knowledge & Soundness Invariant: A zero-knowledge proof guarantees Completeness (an honest prover always convinces the verifier), Soundness (a dishonest prover cannot forge a proof except with negligible probability &epsilon; &approx; 2^-128), and Zero-Knowledge (the proof leaks zero information beyond statement validity).",
    "failureMode": "Omitting a constraint in an R1CS arithmetic circuit (e.g. failing to constrain that a signal is a binary 0 or 1: 'b * (1 - b) === 0'); an attacker passes an arbitrary integer value (e.g. 5), satisfying the circuit while forging unauthorized proofs to drain privacy pools.",
    "tryItFriction": "Construct a minimal R1CS constraint system in TypeScript: represent the computation x^3 + x + 5 = 35; decompose into multiplication gates; generate vectors A, B, C; solve for witness vector s; verify (A &middot; s) &times; (B &middot; s) = (C &middot; s); and prove that any invalid witness fails constraint evaluation.",
    "socraticHints": [
      "Why must arithmetic circuits be constructed over large prime finite fields (like BN254 / Alt_bn128)?",
      "Because elliptic curve cryptography and pairings require coordinates to exist in a discrete algebraic field F_p! Finite fields prevent floating-point rounding errors and ensure mathematical equations wrap around modulo p, enabling cryptographic commitments!",
      "The BN254 scalar field is the native curve of Ethereum's pairing precompiles."
    ],
    "situationalPuzzle": {
      "scenario": "A privacy protocol allows users to withdraw funds by presenting a ZK-SNARK proving they deposited without revealing their address. A user generates a valid proof and withdraws 10 ETH. Two minutes later, the exact same user submits the exact same proof again and withdraws another 10 ETH! What cryptographic primitive was missing from the privacy circuit?",
      "options": [
        "The SNARK was not zero-knowledge.",
        "Missing Cryptographic Nullifier: ZK proofs are stateless! The circuit proved knowledge of a valid deposit, but did not reveal WHICH deposit was spent! To prevent double-spending in privacy systems (like Tornado Cash or Zcash), the circuit must output a deterministic 'Nullifier Hash' = hash(secret, leafIndex)! The on-chain contract marks the nullifier as spent. If a proof presents an already-spent nullifier, it reverts!",
        "The trusted setup was compromised.",
        "ZK circuits do not work on Ethereum."
      ],
      "answerIdx": 1,
      "debrief": "In zero-knowledge privacy systems, the protocol cannot track balances by account address (because addresses are hidden!). Double-spending is prevented via 'Nullifiers'. The circuit computes a unique deterministic nullifier hash derived from the secret key. The smart contract stores a list of spent nullifiers, permanently rejecting any proof attempting to reuse an existing nullifier."
    },
    "quests": [
      {
        "id": "bc-m2-d51-q1",
        "name": "R1CS to QAP Polynomial Reduction Mathematical Proof",
        "type": "concept",
        "desc": "Derive the mathematical reduction from Rank-1 Constraint Systems to Quadratic Arithmetic Programs using Lagrange interpolation."
      },
      {
        "id": "bc-m2-d51-q2",
        "name": "Under-Constrained ZK Circuit Vulnerability Analyzer",
        "type": "detective",
        "desc": "Audit an R1CS constraint system in TypeScript identifying missing boolean constraints and proving how attackers forge valid proofs."
      },
      {
        "id": "bc-m2-d51-q3",
        "name": "Pure TypeScript R1CS Constraint Engine",
        "type": "mastery",
        "desc": "Build an arithmetic circuit compiler and R1CS solver in TypeScript verifying witness satisfaction across arbitrary polynomial equations."
      },
      {
        "id": "bc-m2-d51-q4",
        "name": "3 AM SRE: Multi-Million Dollar Privacy Pool Drain via Missing Nullifier",
        "type": "incident",
        "desc": "Lead the emergency remediation of a privacy protocol where a missing nullifier constraint allowed attackers to repeatedly cash the same deposit."
      }
    ]
  },
  {
    "day": 52,
    "month": 2,
    "blockNum": 11,
    "title": "Circom & SnarkJS: Writing Arithmetic Circuits, Trusted Setup & On-Chain Verifiers",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production ZK Engineering (Circom Domain Language, Trusted Setup & Solidity Verifiers)",
    "spokenGoal": "Build practical, production-ready zero-knowledge applications: Circom and SnarkJS. Learn Circom (the industry-standard domain-specific language for authoring arithmetic circuits). Understand Circom concepts: `signal input`, `signal output`, intermediate signals, and the non-linear constraint operator `<==` (which simultaneously assigns a value and enforces an R1CS equality constraint). Master the SnarkJS workflow: 1) Compile circuit to R1CS and Wasm witness generator; 2) Powers of Tau ceremony (universal trusted setup); 3) Phase 2 circuit-specific setup; 4) Generate proving key (`.zkey`); 5) Generate proof off-chain in TypeScript; and 6) Export auto-generated Solidity Verifier contract (`Verifier.sol`) for on-chain verification in Foundry.",
    "conceptInvariant": "On-Chain Pairing Verification Invariant: A Groth16 on-chain verifier executes 4 elliptic curve pairing operations (e(A, B) = e(&alpha;, &beta;) &middot; e(x &middot; &gamma;, &delta;) &middot; e(C, &delta;)) using Ethereum's native alt_bn128 precompile (0x08), verifying mathematical truth in under 220,000 gas.",
    "failureMode": "Using the assignment operator '<--' instead of constraint assignment '<==' in Circom; the signal is assigned in the witness generator, but NO R1CS constraint is created, allowing an attacker to pass arbitrary false values that pass on-chain verification.",
    "tryItFriction": "Build an end-to-end ZK Proof of Age (over 18) application: author a Circom circuit proving `age >= 18` without revealing exact age; compile with circom; run local Powers of Tau ceremony in SnarkJS; generate a proof in TypeScript; export the Solidity Verifier contract; and write a Foundry test proving that valid proofs pass and under-age inputs fail.",
    "socraticHints": [
      "What is the difference between '<==' and '<--' in Circom?",
      "'<==' does two things: assigns the value to the signal AND adds an R1CS constraint ((A * s) * (B * s) = C * s)! '<--' ONLY assigns the value in the witness generator WITHOUT adding a constraint! If you use '<--', you MUST explicitly add a constraint on the next line using '==='!",
      "Forgetting constraints is the #1 vulnerability in Circom development."
    ],
    "situationalPuzzle": {
      "scenario": "A developer writes a Circom circuit to prove knowledge of a private key corresponding to a public key. The circuit compiles cleanly with zero warnings! However, an auditor discovers that ANY user can submit ANY random garbage input and the proof still verifies as valid on Ethereum! What catastrophic mistake did the developer make?",
      "options": [
        "Circom is not compatible with Ethereum.",
        "Under-Constrained Output Signal (Missing Constraint): The developer wrote 'out <-- poseidon.out;' instead of 'out <== poseidon.out;'! Because '<--' was used without an accompanying 'out === poseidon.out;' constraint, the R1CS system had ZERO constraints binding the output signal to the inputs! The verifier had no mathematical equations to check, allowing any arbitrary input to generate a mathematically 'valid' empty proof!",
        "The public key was formatted in hex.",
        "The gas limit was too low."
      ],
      "answerIdx": 1,
      "debrief": "This is the classic 'Under-Constrained Circuit' bug. In Circom, '<--' only computes the signal during witness generation; it does NOT generate a mathematical constraint for the verifier. Always use '<==' or follow '<--' immediately with '==='. Otherwise, the circuit is unconstrained and will accept fraudulent inputs."
    },
    "quests": [
      {
        "id": "bc-m2-d52-q1",
        "name": "Groth16 Pairing Mathematics & Alt_bn128 Precompiles",
        "type": "concept",
        "desc": "Derive the elliptic curve pairing equation verified by Ethereum precompile 0x08 for Groth16 3-point proofs (A &isin; G1, B &isin; G2, C &isin; G1)."
      },
      {
        "id": "bc-m2-d52-q2",
        "name": "Circom Constraint Linter & Static Under-Constraint Analyzer",
        "type": "detective",
        "desc": "Build a static analysis parser scanning Circom ASTs for unconstrained signals and naked assignment operators '<--'."
      },
      {
        "id": "bc-m2-d52-q3",
        "name": "Production Circom & SnarkJS Identity Verifier",
        "type": "mastery",
        "desc": "Author a complete ZK circuit, run SnarkJS ceremony, generate off-chain proofs in TypeScript, and verify via Solidity in Foundry."
      },
      {
        "id": "bc-m2-d52-q4",
        "name": "3 AM SRE: Circuit Under-Constraint Exploit in Live Mainnet Protocol",
        "type": "incident",
        "desc": "Triage a critical zero-knowledge protocol vulnerability where missing signal constraints allowed attackers to forge valid withdrawal proofs."
      }
    ]
  },
  {
    "day": 53,
    "month": 2,
    "blockNum": 11,
    "title": "Account Abstraction (ERC-4337): UserOperations, Bundlers, EntryPoint & Paymasters",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Smart Accounts & Next-Gen UX (Account Abstraction ERC-4337 Architecture)",
    "spokenGoal": "Revolutionize Web3 user experience: Account Abstraction (ERC-4337). Understand why classic Ethereum accounts (Externally Owned Accounts - EOAs) are terrible for mainstream adoption: seed phrases get lost, transactions require native ETH for gas, and multi-factor authentication is impossible. Dissect ERC-4337 (Account Abstraction without hard forks): 1) `UserOperation` (an off-chain pseudo-transaction struct specifying intent, gas limits, and signatures); 2) `Bundler` (specialized nodes that gather UserOperations from an alternative mempool and bundle them into a single L1 transaction); 3) `EntryPoint` contract (the single, audited singleton contract executing all operations); 4) Smart Contract Accounts (programmable wallets with session keys, recovery, and biometric passkeys); and 5) `Paymasters` (smart contracts that sponsor gas fees or accept ERC-20 tokens like USDC for gas!).",
    "conceptInvariant": "EntryPoint Singleton Invariant: All ERC-4337 UserOperations must route through the canonical EntryPoint contract; the EntryPoint enforces two-phase execution (Validation Phase &rarr; Execution Phase) and guarantees bundler gas reimbursement before executing user business logic.",
    "failureMode": "Writing a Paymaster contract that sponsors gas based on an off-chain promise without locking funds or validating balance in 'validatePaymasterUserOp'; the user's execution reverts or drains the paymaster's ETH deposit on the EntryPoint.",
    "tryItFriction": "Construct a minimal ERC-4337 Smart Account and Paymaster in Solidity 0.8.20: deploy canonical EntryPoint; implement a SmartAccount supporting `validateUserOp`; implement a Paymaster that sponsors gas for users holding an NFT; construct a UserOperation in TypeScript; bundle and execute through EntryPoint.handleOps(); and verify that the user pays 0 ETH while the transaction executes successfully.",
    "socraticHints": [
      "Why is ERC-4337 split strictly into a 'Validation Phase' and an 'Execution Phase'?",
      "To protect Bundlers from Denial-of-Service attacks! In the Validation Phase, the EntryPoint checks that the account/paymaster has enough funds to pay for gas! If validation fails, the bundler does NOT include the UserOp and pays zero gas! The bundler is guaranteed to get paid before the Execution Phase begins!",
      "Validation rules prohibit accessing dynamic environment opcodes like block.timestamp."
    ],
    "situationalPuzzle": {
      "scenario": "A mobile gaming studio deploys an ERC-4337 Paymaster to sponsor gas for new players. Within 2 hours, the Paymaster's 50 ETH deposit on the EntryPoint is completely drained, even though only 100 legitimate players signed up! An attacker wrote a bot that submitted 50,000 UserOperations through the bundler, all sponsored by the Paymaster. What critical verification check did the Paymaster omit?",
      "options": [
        "The EntryPoint was hacked.",
        "Missing Sybil Resistance & Off-Chain Signature Authorization in validatePaymasterUserOp: The Paymaster sponsored ANY transaction as long as it targeted the game contract, without verifying a backend signature, rate-limit, or user identity! The attacker simply submitted thousands of heavy dummy operations, burning the Paymaster's gas! Production Paymasters must verify an off-chain cryptographic signature from the backend server ('paymasterAndData' signature) or enforce strict daily per-user spend limits.",
        "ERC-4337 does not support games.",
        "The bundler stole the funds."
      ],
      "answerIdx": 1,
      "debrief": "Paymasters are public credit cards. If a Paymaster unconditionally sponsors transactions in 'validatePaymasterUserOp()', any bot in the world can route arbitrary transactions through it and drain its gas reserves on the EntryPoint. Production paymasters require an off-chain API signature from the sponsoring backend, or enforce strict rate limits per user."
    },
    "quests": [
      {
        "id": "bc-m2-d53-q1",
        "name": "ERC-4337 Account Abstraction Architecture Specification",
        "type": "concept",
        "desc": "Document the complete ERC-4337 flow detailing UserOperation fields, Alternative Mempool gossip, EntryPoint phases, and Paymaster rules."
      },
      {
        "id": "bc-m2-d53-q2",
        "name": "Paymaster Gas Draining Vulnerability Analyzer",
        "type": "detective",
        "desc": "Audit an ERC-4337 Paymaster contract in Foundry, demonstrating how unconstrained validation logic enables third-party gas exhaustion."
      },
      {
        "id": "bc-m2-d53-q3",
        "name": "Production ERC-4337 Smart Account & Paymaster in Foundry",
        "type": "mastery",
        "desc": "Author an audited smart contract wallet and sponsoring Paymaster in Solidity, executing UserOperations via EntryPoint.handleOps()."
      },
      {
        "id": "bc-m2-d53-q4",
        "name": "3 AM SRE: Catastrophic Paymaster Reserve Drain During Viral Web3 Drop",
        "type": "incident",
        "desc": "Resolve a high-severity production incident where an automated bot swarm drained a gaming Paymaster's 100 ETH EntryPoint gas pool."
      }
    ]
  },
  {
    "day": 54,
    "month": 2,
    "blockNum": 11,
    "title": "3 AM Web3 War Room & Incident Triage: Bridge Drains, Compromised Keys & Emergency Pausing",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Security & Emergency Incident Response (Web3 War Room Triage)",
    "spokenGoal": "Step into the intense, high-stakes 3 AM Web3 Emergency War Room of a multi-billion dollar protocol. In Web3, an active exploit is a ticking clock: every 12-second block, an attacker extracts another $1,000,000. Master the protocols of crisis management: 1) Incident Detection & Mempool Threat Monitoring (Forta bots, Tenderly alerts, detecting sudden TVL drops or unusual flash loan volume); 2) Emergency Pausing & Circuit Breakers (multisig emergency guardians executing `pause()` to halt state transitions); 3) White-Hat Rescue Operations (front-running the attacker using private MEV relays like Flashbots to sweep remaining vulnerable funds into a secure multisig vault); 4) On-Chain Negotiation & Hacker Communication (messaging the attacker via input data UTF-8 notes); and 5) Post-Mortem Root Cause Analysis.",
    "conceptInvariant": "Zero-Latency Containment Invariant: When an exploit is detected in progress, containment actions (emergency pause or white-hat fund sweeping) must execute via private transaction channels to prevent the attacker from front-running the defensive transaction.",
    "failureMode": "Broadcasting an emergency 'pause()' or fund rescue transaction to the public mempool; the attacker's bot sees the admin transaction, pays a 100 ETH bribe to front-run the pause, and drains the remaining $40M before the pause transaction can mine.",
    "tryItFriction": "Simulate a live 3 AM Web3 Emergency War Room in Foundry: deploy a vulnerable $10M protocol; simulate an attacker initiating a multi-step exploit; trigger an automated monitoring alert; execute a white-hat front-run rescue using Flashbots simulation (vm.prank / private routing); invoke an audited Pausable mechanism to halt all deposits and withdrawals; and author an institutional security post-mortem report.",
    "socraticHints": [
      "Why must emergency pause transactions NEVER be broadcast to the public mempool?",
      "Because the attacker is actively monitoring the public mempool! If the attacker sees an incoming 'pause()' transaction from the protocol admin, they know their attack is about to be shut down! The attacker will instantly submit an aggressive transaction with maximum priority fee to drain the rest of the protocol in the very same block!",
      "Always use private RPC relays (Flashbots Protect) for security responses."
    ],
    "situationalPuzzle": {
      "scenario": "A DeFi protocol is being actively drained by an unknown exploit. The core team assembles on a call. The protocol has an 'Emergency Guardian' multisig (2-of-3) that can call 'pause()'. However, 2 of the 3 key holders are asleep and their phones are off. The single active engineer has no authority to pause alone. How must an enterprise protocol architect its emergency pause mechanism?",
      "options": [
        "Wait for the other engineers to wake up.",
        "Role-Separated Single-Sig Emergency Pauser Role: The protocol must decouple PAUSING from UNPAUSING! A single designated on-chain Emergency SRE key (or automated monitoring bot) should have the authority to PAUSE the contract instantly in an emergency! However, UNPAUSING (resuming operations) must require the full 3-of-5 Timelocked Governance Multisig! Pausing is non-destructive (it only halts actions), whereas unpausing is sensitive.",
        "Contact the police.",
        "Shut down the Ethereum network."
      ],
      "answerIdx": 1,
      "debrief": "Security architecture must reflect operational reality. Requiring an M-of-N multisig to pause a protocol guarantees failure during middle-of-the-night incidents. The industry best practice is Asymmetric Emergency Permissions: allow a single designated emergency role or automated bot to PAUSE the contract immediately, but require the full governance multisig to UNPAUSE."
    },
    "quests": [
      {
        "id": "bc-m2-d54-q1",
        "name": "Web3 Emergency Incident Response Framework Specification",
        "type": "concept",
        "desc": "Document the end-to-end incident response runbook detailing threat detection, private relay execution, white-hat sweeping, and post-mortems."
      },
      {
        "id": "bc-m2-d54-q2",
        "name": "Live Exploit Simulation & White-Hat Rescue Harness",
        "type": "detective",
        "desc": "Simulate an active live drain in Foundry, executing a private white-hat rescue transaction that sweeps funds ahead of an adversarial transaction."
      },
      {
        "id": "bc-m2-d54-q3",
        "name": "Production Asymmetric Emergency Pausable Module",
        "type": "mastery",
        "desc": "Implement an audited Solidity pausable contract with single-key emergency halting, multisig-restricted unpausing, and event telemetry."
      },
      {
        "id": "bc-m2-d54-q4",
        "name": "3 AM SRE: $50M Multi-Chain Protocol Exploit Triage War Room",
        "type": "incident",
        "desc": "Lead the full simulated 3 AM war room response mitigating an active multi-chain liquidity drain, coordinating private pauses and post-mortems."
      }
    ]
  },
  {
    "day": 55,
    "month": 2,
    "blockNum": 11,
    "title": "Milestone 10: ERC-4337 Smart Account with Paymaster & ZK Proof Verifier Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Block 11 Capstone Project & Architectural Gate",
    "spokenGoal": "Synthesize the entire discipline of zero-knowledge proofs, arithmetic circuits, Circom verifiers, Account Abstraction (ERC-4337), and emergency incident response into a unified infrastructure engine: The ERC-4337 Smart Account with Paymaster & ZK Proof Verifier Engine. In this milestone, architect an institutional-grade Web3 onboarding platform: build an ERC-4337 Smart Contract Wallet with session keys and recovery; implement an audited Sponsoring Paymaster that sponsors gas fees for authorized users; integrate an on-chain Groth16 ZK Proof Verifier contract generated via Circom; execute gasless, private user transactions routed through the canonical EntryPoint; and wrap the system in an asymmetric Emergency Pausing watchdog.",
    "conceptInvariant": "Autonomous Account & ZK Verification Invariant: The platform must execute user operations with zero native gas friction, verify zero-knowledge validity proofs on-chain in under 250,000 gas, protect paymaster reserves from draining, and maintain instant emergency halting capabilities.",
    "failureMode": "Failing the milestone gate when an invalid ZK proof is accepted by the on-chain verifier, when an unauthorized user drains the Paymaster's EntryPoint deposit, or when UserOperation signature verification fails.",
    "tryItFriction": "Construct and deliver the complete Solidity 0.8.20 + Foundry + TypeScript milestone system: deploy EntryPoint, SmartAccount, Paymaster, and ZKVerifier; generate a valid ZK proof of membership in TypeScript using SnarkJS; pack the proof into a UserOperation; route through the Paymaster; execute via EntryPoint.handleOps(); verify that the user's operation executes with 0 native ETH; and prove that invalid ZK proofs revert cleanly.",
    "socraticHints": [
      "How do we prevent bundler gas exhaustion when executing UserOperations containing heavy ZK verifier calls?",
      "By configuring realistic 'callGasLimit' and 'verificationGasLimit' parameters in the UserOperation! Verifying a Groth16 proof costs ~220,000 gas! The UserOp must allocate at least 250,000 gas for verification; otherwise, the EntryPoint reverts for OutOfGas before reaching the pairing precompile!",
      "Always benchmark on-chain pairing gas in test suites."
    ],
    "situationalPuzzle": {
      "scenario": "During your Milestone 10 defense, the examiner submits a UserOperation containing a valid ZK proof, but the Paymaster signature is expired (validUntil < block.timestamp). The EntryPoint reverts during the validation phase. How does this protect the bundler from losing gas fees?",
      "options": [
        "The bundler pays for the failed transaction.",
        "Pre-Execution Validation Phase Rejection: Because the validation check failed in 'validatePaymasterUserOp()', the EntryPoint immediately halts BEFORE executing the user's expensive business logic or ZK verifier! The bundler discards the UserOp locally from its mempool and does NOT broadcast it to Layer 1, spending zero gas! The bundler is 100% protected against invalid or expired operations.",
        "The ZK proof was forged.",
        "The examiner fails the candidate."
      ],
      "answerIdx": 1,
      "debrief": "ERC-4337's two-phase execution is designed specifically to protect bundlers. During the local validation phase, bundlers simulate validateUserOp and validatePaymasterUserOp. If any signature, timestamp, or balance check fails, the operation is rejected off-chain, ensuring bundlers never broadcast transactions that will not reimburse them."
    },
    "quests": [
      {
        "id": "bc-m2-d55-q1",
        "name": "ERC-4337 & ZK-SNARK Hybrid Protocol Architecture Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive engineering specification detailing UserOperation execution pipelines, Paymaster authorization, and Groth16 verifiers."
      },
      {
        "id": "bc-m2-d55-q2",
        "name": "Paymaster Griefing & Invalid ZK Proof Attack Suite",
        "type": "detective",
        "desc": "Build automated tests in Foundry attempting paymaster gas draining, expired signature submission, and corrupted ZK proof verification."
      },
      {
        "id": "bc-m2-d55-q3",
        "name": "Production ERC-4337 Smart Account & ZK Engine Build",
        "type": "mastery",
        "desc": "Author and test the complete production protocol in Solidity, Foundry, and TypeScript with Smart Accounts, Paymasters, and Circom verifiers."
      },
      {
        "id": "bc-m2-d55-q4",
        "name": "Milestone 10 Viva Gate: Account Abstraction & ZK Defense",
        "type": "incident",
        "desc": "Defend the Account Abstraction and ZK architecture before the Senior Web3 Board, demonstrating gasless ZK verification and paymaster safety."
      }
    ]
  },
  {
    "day": 56,
    "month": 2,
    "blockNum": 12,
    "title": "Real-World Architecture Deep Dive: Uniswap v4 (Hooks Architecture, Transient Storage & Singleton)",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Architecture Case Study (Next-Gen AMM Hooks & Transient Storage)",
    "spokenGoal": "Deconstruct the next-generation architecture of decentralized exchanges: Uniswap v4. Contrast Uniswap v3 (where every liquidity pair is deployed as an independent contract, meaning multi-hop swaps transfer tokens between separate contracts, burning massive gas) with Uniswap v4: 1) The Singleton Architecture (ALL liquidity pools reside in a single smart contract: `PoolManager.sol`, enabling multi-hop swaps to execute with zero intermediate token transfers!); 2) Flash Accounting with Transient Storage (EIP-1153: `TSTORE` and `TLOAD`, clearing state at the end of the transaction for 100 gas per slot!); and 3) The Hooks Architecture: custom plugin contracts that execute logic before/after pool initialization, liquidity changes, and swaps (e.g. Dynamic Fees, On-Chain Limit Orders, TWAMM, and Volatility Oracles).",
    "conceptInvariant": "Flash Accounting Net-Zero Invariant: In Uniswap v4's PoolManager, operations modify internal transient balances; at the conclusion of the atomic transaction (lock acquired and released), all delta debts must net out to exactly zero (take/settle), or the entire transaction reverts.",
    "failureMode": "Deploying a custom Uniswap v4 Hook whose contract address does not have the correct bit flags matching its declared permissions; the PoolManager verifies hook address bitmask on initialization and reverts immediately.",
    "tryItFriction": "Construct a minimal Uniswap v4 Hook in Solidity 0.8.24 using Foundry: implement an On-Chain Dynamic Volatility Fee Hook; override `beforeSwap` and `afterSwap`; compute price impact and dynamically adjust swap fee from 0.05% to 1.00%; use transient storage (TSTORE/TLOAD) to cache trade volume; and write a Foundry test proving that multi-hop swaps execute with 40% less gas than v3.",
    "socraticHints": [
      "Why does Uniswap v4 encode hook permissions directly into the leading bits of the Hook's contract address?",
      "To save gas during execution! Instead of making an expensive storage read or external call to check if a hook supports 'beforeSwap' or 'afterSwap', the PoolManager inspects the Hook's address directly using bitwise AND! The leading bits of the address dictate which callbacks are active!",
      "Hook developers use CREATE2 address mining to deploy to addresses with the required bit flags."
    ],
    "situationalPuzzle": {
      "scenario": "A developer writes a custom Uniswap v4 hook that charges an extra fee on swaps. During testing, an attacker executes a swap, but the hook's 'beforeSwap' callback never gets executed, and the fee is not collected! The developer confirms 'beforeSwap' is implemented in the hook code. Why did the PoolManager skip the hook callback?",
      "options": [
        "Uniswap v4 disabled hooks.",
        "Hook Address Flag Bitmask Mismatch: The developer deployed the hook using a standard deployment without mining a specific address! In Uniswap v4, the PoolManager checks: 'if (uint160(hookAddress) & BEFORE_SWAP_FLAG != 0) call beforeSwap()'. Because the deployed address did not have the BEFORE_SWAP bit set to 1, the PoolManager assumed the hook does not implement beforeSwap and skipped it! Hooks must be deployed using CREATE2 salt mining tools (like cast create2) to ensure the address matches its declared permissions.",
        "Hooks can only be written in Yul.",
        "The swap amount was too small."
      ],
      "answerIdx": 1,
      "debrief": "Uniswap v4 uses address-based permission flags to achieve maximum gas efficiency. Each hook callback (beforeInitialize, afterInitialize, beforeSwap, afterSwap...) corresponds to a specific bit in the 160-bit contract address. Developers must use CREATE2 mining to find a salt that generates an address whose leading bits match their hook's required callback flags."
    },
    "quests": [
      {
        "id": "bc-m2-d56-q1",
        "name": "Uniswap v4 Singleton & EIP-1153 Transient Storage Mathematics",
        "type": "concept",
        "desc": "Analyze gas savings of Singleton multi-hop swaps and derive the operational economics of EIP-1153 TSTORE/TLOAD transient accounting."
      },
      {
        "id": "bc-m2-d56-q2",
        "name": "CREATE2 Hook Address Mining & Flag Bitmask Linter",
        "type": "detective",
        "desc": "Build an automated TypeScript tool mining CREATE2 salts to generate hook contract addresses matching arbitrary Uniswap v4 permission flags."
      },
      {
        "id": "bc-m2-d56-q3",
        "name": "Production Uniswap v4 Dynamic Fee Hook in Foundry",
        "type": "mastery",
        "desc": "Author an audited Uniswap v4 Hook contract in Solidity with dynamic fee adjustment, transient storage caching, and comprehensive Foundry swap tests."
      },
      {
        "id": "bc-m2-d56-q4",
        "name": "3 AM SRE: Flash Accounting Desynchronization in Singleton Pool",
        "type": "incident",
        "desc": "Triage a high-severity v4 protocol bug where an unhandled delta calculation in a custom hook prevented net-zero settlement, reverting all swaps."
      }
    ]
  },
  {
    "day": 57,
    "month": 2,
    "blockNum": 12,
    "title": "Real-World Architecture Deep Dive: Aave v3 (Isolation Mode, Siloed Borrowing & Portal Cross-Chain)",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Architecture Case Study (Enterprise Money Market Risk Architectures)",
    "spokenGoal": "Deconstruct the production architecture of the world's premier decentralized liquidity protocol: Aave v3. Analyze how Aave v3 manages over $10,000,000,000 in TVL with zero protocol insolvencies through advanced risk mitigation layers: 1) Isolation Mode (allowing new, volatile tokens to be listed as collateral with a strict debt ceiling, borrowable ONLY against stablecoins, preventing illiquid token contagion); 2) Siloed Borrowing (restricting highly volatile assets from being borrowed alongside other collateral); 3) Efficiency Mode (eMode: allowing up to 97% LTV when borrowing correlated assets, such as LSTs like stETH against ETH); and 4) Aave Portal (seamless cross-chain liquidity transfers using Connext/Hop bridges). Dissect Aave's interest rate mathematical models: Two-Ray variable and stable rate curves.",
    "conceptInvariant": "Contagion Isolation Invariant: An isolated asset listing in a lending protocol must be strictly partitioned from general protocol liquidity; an economic collapse of an isolated collateral asset must be mathematically bounded by its debt ceiling, preventing protocol-wide bad debt contagion.",
    "failureMode": "Listing a new volatile governance token with standard collateral status and no debt ceiling; an attacker pumps the token price 500% on a thin DEX, borrows $20M of stablecoins against it on Aave, dumps the token, leaving the protocol with $20M in unbacked bad debt.",
    "tryItFriction": "Construct an Aave v3 Risk Parameter Engine in Solidity 0.8.20: implement Isolation Mode with configurable Debt Ceilings; implement eMode category mapping allowing 95% LTV for correlated stablecoins; write a multi-asset Health Factor calculator; and write a Foundry test simulating an isolated token collapse and proving that total protocol losses cannot exceed the isolated debt ceiling.",
    "socraticHints": [
      "Why does Aave v3 eMode (Efficiency Mode) allow 97% LTV for stETH/ETH when standard ETH collateral is capped at 80%?",
      "Because stETH and ETH are highly correlated assets pegged 1:1! The price volatility between stETH and ETH is minimal compared to ETH/USDC! Higher LTV (97%) enables massive capital efficiency for leveraged staking loops with negligible liquidation risk!",
      "Correlated asset categories safely support higher leverage."
    ],
    "situationalPuzzle": {
      "scenario": "A whale deposits $50M in a new token marked as 'Isolated Collateral' on Aave v3. The token has an on-chain Debt Ceiling of $5,000,000. The whale borrows $5,000,000 in USDC. The whale then attempts to borrow an additional $500,000 in DAI. The transaction reverts with 'DebtCeilingExceeded'. The whale attempts to borrow $500,000 in wBTC. That also reverts. Why can't the whale borrow any more assets against their $50M collateral?",
      "options": [
        "Aave v3 ran out of liquidity.",
        "Strict Isolated Debt Ceiling & Asset Class Restrictions: 1) The total debt backed by this collateral hit its global $5M debt ceiling across all borrowers! 2) Furthermore, in Isolation Mode, borrowers can ONLY borrow designated stablecoins (USDC/USDT), NEVER volatile assets like wBTC! Both rules protected the protocol from exposure to the newly listed asset.",
        "The whale's wallet was blacklisted.",
        "Isolation Mode is deprecated."
      ],
      "answerIdx": 1,
      "debrief": "Isolation Mode is Aave v3's primary defense against listing risks. When an asset is marked isolated: 1) Total borrows across the entire protocol backed by that asset are hard-capped by a global Debt Ceiling (e.g. $5M); 2) Users using isolated collateral can only borrow designated stablecoins. Even if the collateral crashes to zero, the protocol's loss is strictly bounded by the ceiling."
    },
    "quests": [
      {
        "id": "bc-m2-d57-q1",
        "name": "Aave v3 Two-Ray Interest Rate & eMode Mathematical Model",
        "type": "concept",
        "desc": "Derive the mathematical formulas for the piecewise linear two-ray interest rate curve and correlated eMode liquidation thresholds."
      },
      {
        "id": "bc-m2-d57-q2",
        "name": "Isolation Mode Debt Ceiling Contagion Simulation",
        "type": "detective",
        "desc": "Simulate a 100% price collapse of an isolated collateral asset in Foundry, verifying that protocol bad debt is strictly bounded by the debt ceiling."
      },
      {
        "id": "bc-m2-d57-q3",
        "name": "Aave v3-Style Risk Engine & eMode Protocol in Foundry",
        "type": "mastery",
        "desc": "Author an audited money market risk module in Solidity featuring Isolation Mode, eMode categories, and variable interest rate accumulators."
      },
      {
        "id": "bc-m2-d57-q4",
        "name": "3 AM SRE: Exploit Attempt on Un-Capped Isolated Asset Listing",
        "type": "incident",
        "desc": "Resolve a high-severity governance misconfiguration where an un-capped collateral listing was exploited by a market-manipulating whale."
      }
    ]
  },
  {
    "day": 58,
    "month": 2,
    "blockNum": 12,
    "title": "Real-World Architecture Deep Dive: PinIT Career OS On-Chain Skill Credential & Soulbound Tokens",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Architecture Case Study (Decentralized Identity, EAS & Soulbound Tokens)",
    "spokenGoal": "Deconstruct the real-world production architecture of the PinIT Career OS Web3 Attestation Engine. Trace how student technical achievements, verified code milestones, and AI viva defenses are committed permanently on-chain: 1) Ethereum Attestation Service (EAS): creating cryptographic schema attestations (`bytes32 schemaId = keccak256(...)`) signed by PinIT's institutional authority key; 2) Soulbound Tokens (EIP-5192 Minimal Soulbound Tokens): non-transferable NFTs locked to the student's wallet address (`event Locked(uint256 tokenId)` and `function locked(uint256 tokenId) external view returns (bool)`); and 3) Decentralized Skill Graph & Verifiable Credentials (EIP-712 off-chain verifiable credentials convertible to on-chain attestations). Explore privacy-preserving ZK skill disclosures: proving a student passed Course 16 without revealing their wallet address or test scores.",
    "conceptInvariant": "Non-Transferable Credential Invariant: An educational or skill attestation must be irrevocably bound to the recipient identity; any call to transferFrom or safeTransferFrom on an EIP-5192 Soulbound Token must revert with ErrLocked(); skill achievements cannot be bought, sold, or transferred.",
    "failureMode": "Deploying student skill certificates as standard ERC-721 tokens without transfer locks; students immediately transfer or sell their certificates on OpenSea, completely undermining the integrity of PinIT's credential verification.",
    "tryItFriction": "Construct the PinIT Career OS Attestation Protocol in Solidity 0.8.20: implement EIP-5192 Minimal Soulbound Token standard; enforce transfer reverts; integrate with an EAS-compatible on-chain schema resolver; sign an attestation in TypeScript verifying that a student completed Course 16; mint the Soulbound Credential NFT; and write a Foundry test proving that OpenSea marketplace transfers fail.",
    "socraticHints": [
      "Why is EIP-5192 preferred over a custom non-transferable NFT interface?",
      "Because EIP-5192 is the recognized standard for Soulbound Tokens! Marketplaces like OpenSea and wallets like MetaMask inspect 'locked(tokenId)' and listen for the 'Locked' event! When locked is true, wallets and marketplaces automatically disable transfer buttons in their UIs, providing clean native UX!",
      "Standards ensure cross-ecosystem wallet compatibility."
    ],
    "situationalPuzzle": {
      "scenario": "A student loses the private key to their primary wallet address. Their PinIT Career OS Soulbound Tokens and verified skill attestations are locked inside the lost wallet. Since Soulbound Tokens cannot be transferred, are the student's career credentials lost forever?",
      "options": [
        "Yes, the student must retake all 37 courses.",
        "Social Recovery & Attestation Revocation-and-Reissue Pipeline: No! The PinIT Attestation contract implements an authorized Revocation and Re-Issuance mechanism! Upon verifying the student's identity via decentralized multi-party recovery (or PinIT institutional KYC), the authority contract calls 'revoke(attestationId)' on the lost token and issues a new EIP-5192 token to the student's new wallet, preserving their verified history seamlessly.",
        "The Ethereum miners will recover the wallet.",
        "Soulbound tokens automatically transfer after 30 days."
      ],
      "answerIdx": 1,
      "debrief": "Soulbound tokens must anticipate real-world identity recovery. Losing a private key should not erase a decade of professional credentials. Enterprise attestation systems incorporate revocation and re-issuance lifecycles, allowing authorized issuers to burn credentials from compromised addresses and reissue them to recovered wallets."
    },
    "quests": [
      {
        "id": "bc-m2-d58-q1",
        "name": "EIP-5192 Soulbound Token & EAS Attestation Specification",
        "type": "concept",
        "desc": "Document the EIP-5192 interface specification, transfer-lock revert requirements, and EAS cryptographic schema hashing standards."
      },
      {
        "id": "bc-m2-d58-q2",
        "name": "EAS Schema Resolver & Revocation Integrity Linter",
        "type": "detective",
        "desc": "Build an automated testing script verifying that revoked attestations immediately invalidate associated on-chain skill permissions."
      },
      {
        "id": "bc-m2-d58-q3",
        "name": "PinIT Career OS Soulbound Skill Attestation Engine",
        "type": "mastery",
        "desc": "Author and test the complete PinIT on-chain credential contract in Solidity and Foundry with EIP-5192 locks, EAS resolver, and EIP-712 signing."
      },
      {
        "id": "bc-m2-d58-q4",
        "name": "3 AM SRE: Stolen Identity Recovery & Attestation Re-Issuance",
        "type": "incident",
        "desc": "Execute an emergency identity recovery runbook revoking attestations from a compromised student wallet and re-issuing credentials safely."
      }
    ]
  },
  {
    "day": 59,
    "month": 2,
    "blockNum": 12,
    "title": "Principal Web3 Architect RFC: Monolithic L1 vs Modular Rollup Stack vs Appchain Trade-Off Analysis",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Principal Engineering Leadership (Trade-Off Analysis, RFC & Strategic Vision)",
    "spokenGoal": "Operate at the highest level of technical leadership: author a Principal Web3 Architect Request for Comments (RFC). Conduct an exhaustive, unvarnished comparative analysis across the modern blockchain architecture spectrum: 1) Monolithic Layer 1 (Ethereum, Solana: shared composability, massive global state, but high gas volatility and congestion); 2) Modular Rollup on Shared L1 (Arbitrum, Optimism, zkSync: inherits Ethereum L1 security, cheap transactions, but fragmented liquidity across L2s); 3) Application-Specific Rollups / Appchains (Arbitrum Orbit, OP Stack, Cosmos SDK, Hyperchains: dedicated throughput, customized gas tokens, sovereign governance, but isolated bridging friction); and 4) Alternative DA (Celestia, EigenDA vs EIP-4844 blobs). Author the definitive architectural RFC selecting and defending the multi-year Web3 infrastructure stack for PinIT Career OS.",
    "conceptInvariant": "Architecture Selection Invariant: Web3 architectural decisions must balance Security (L1 settlement vs validator quorums), Composability (atomic synchronous calls vs asynchronous cross-chain bridges), and User Friction (gas costs, latency, onboarding UX); no single architecture optimizes all dimensions.",
    "failureMode": "Choosing to launch a standalone Proof-of-Authority sidechain for an enterprise financial product; a small 7-node validator set is compromised by social engineering, resulting in a total loss of user funds and regulatory destruction.",
    "tryItFriction": "Author the complete Principal Web3 Architecture RFC document: formulate executive summary, business and technical constraints, deep quantitative benchmark matrix (TPS, finality time, gas cost per trade, bridging latency, security budget), and migration roadmap; defend the decision before an executive engineering panel; and resolve tough architectural challenges.",
    "socraticHints": [
      "Why is launching an Application-Specific Rollup (Appchain) often preferred for high-volume games and trading platforms over deploying on shared L2s?",
      "Because on a shared L2 (like Arbitrum One), a viral NFT drop or memecoin craze can spike gas fees for everyone on that chain! An Appchain gives the project dedicated gas capacity, predictable sub-cent fees, and the ability to subsidize gas or use their own native token for gas!",
      "Appchains isolate projects from global network congestion."
    ],
    "situationalPuzzle": {
      "scenario": "A venture-backed Web3 protocol is deciding where to deploy their flagship lending market. The VP of Product wants to deploy on a new high-speed Layer 1 that claims 50,000 TPS. The Lead Security Architect argues for an Ethereum L2 Optimistic Rollup (Arbitrum). As Principal Architect, how do you resolve this architectural disagreement?",
      "options": [
        "Flip a coin.",
        "Security-First Settlement with L2 Rollup Strategy: Recommend deploying on the Ethereum L2 (Arbitrum)! A lending market requires deep collateral liquidity and absolute settlement security! New high-speed L1s suffer from frequent network outages, thin liquidity, and centralized validator sets. An established L2 inherits Ethereum's multi-billion dollar economic security, has immediate access to billions in USDC/ETH liquidity, and provides sub-second transactions with low gas fees.",
        "Deploy on both simultaneously with no bridge.",
        "Quit the project."
      ],
      "answerIdx": 1,
      "debrief": "A Principal Architect understands that TPS is meaningless without liquidity and security. A lending market deployed on a 50,000 TPS ghost chain with no assets is worthless. Deploying on a battle-tested Ethereum Layer 2 provides the ideal equilibrium: low fees for users, vast existing liquidity pools, and the uncompromised security of Ethereum Layer 1."
    },
    "quests": [
      {
        "id": "bc-m2-d59-q1",
        "name": "Web3 Scaling Architectures Quantitative Benchmark Matrix",
        "type": "concept",
        "desc": "Produce the comprehensive evaluation matrix comparing Monolithic L1, Shared L2 Rollups, and Sovereign Appchains across 12 quantitative metrics."
      },
      {
        "id": "bc-m2-d59-q2",
        "name": "Cross-Chain Liquidity Fragmentation & Latency Audit",
        "type": "detective",
        "desc": "Analyze the economic cost of fragmented liquidity pools across 5 major L2 rollups and model bridge capital efficiency under stress."
      },
      {
        "id": "bc-m2-d59-q3",
        "name": "Principal Web3 Architect RFC Publication",
        "type": "mastery",
        "desc": "Author the comprehensive formal RFC establishing the multi-year smart contract, rollup scaling, and Account Abstraction architecture for PinIT Career OS."
      },
      {
        "id": "bc-m2-d59-q4",
        "name": "RFC Defense & Executive Architecture Review Board",
        "type": "incident",
        "desc": "Defend the Web3 RFC before the Executive Architecture Board, answering rigorous technical cross-examinations on rollup economics and security."
      }
    ]
  },
  {
    "day": 60,
    "month": 2,
    "blockNum": 12,
    "title": "Master Capstone: ApexDEX Institutional-Grade Cross-Chain Decentralized Exchange & ZK-Rollup Sovereign Protocol Master Capstone Viva Gate",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Month 2 Master Capstone & Comprehensive Viva Voce Gate",
    "spokenGoal": "The Ultimate 60-Day Master Capstone and Comprehensive Viva Voce Gate: stand before the Senior Board of Web3 Architects, Cryptographers, and Smart Contract Security Researchers to present, demonstrate, and defend ApexDEX. Demonstrate the complete synthesis of all 60 days of blockchain, smart contract, and cryptographic engineering: 1) Core EVM bytecode execution, gas optimization, and storage layout packing; 2) EIP-712 structured multi-signature governance and ERC-20/721/4626 token architectures; 3) Concentrated liquidity automated market making with Q64.96 tick math and EIP-3156 flash loans; 4) Multi-oracle aggregation with Chainlink feeds, Uniswap v3 TWAP, and volatility circuit breakers; 5) Rate-limited cross-chain bridging with EIP-712 attestations; 6) ERC-2535 Diamond multi-facet modular upgradeability with timelocks; 7) Layer 2 rollup scaling with EIP-4844 blob ingestion and interactive bisection fraud proof simulators; 8) Groth16 zero-knowledge proof verification via Circom and SnarkJS; 9) ERC-4337 Account Abstraction smart accounts with gas-sponsoring Paymasters; and 10) Autonomous 3 AM SRE incident triage and emergency pause watchdogs.",
    "conceptInvariant": "Master Web3 Protocol Synthesis Invariant: An institutional decentralized finance protocol must maintain 100% mathematical solvency, enforce zero-trust cryptographic authorization, eliminate all attack vectors (reentrancy, oracle manipulation, front-running, and storage collisions), and deliver seamless, gasless user execution across Layer 1 and Layer 2 ecosystems.",
    "failureMode": "Failing the 60-day capstone defense when the panel injects a flash loan attack, submits a malleable signature, forces a storage collision, trips a circuit breaker, or identifies an un-metered loop that bricks the protocol.",
    "tryItFriction": "Deliver the live end-to-end demonstration and oral defense: execute a gasless ERC-4337 trade sponsored by a Paymaster; route swaps through concentrated liquidity pools; trigger simulated adversarial chaos (flash loans, reentrancy, stale oracles, cross-chain replays); demonstrate 100% exploit rejection; submit and verify an on-chain Groth16 ZK proof; execute an emergency pause via the SRE watchdog; present 50,000-run Foundry invariant proofs; and defend every mathematical and architectural choice under rigorous oral examination.",
    "socraticHints": [
      "What distinguishes a World-Class Principal Web3 Architect from an ordinary Solidity developer?",
      "The master understands the entire cryptographic and economic vertical stack: from finite field polynomial arithmetic and EVM opcode gas schedules, to market maker curves, game-theoretic dispute games, and distributed consensus failure modes!",
      "They write smart contracts that are mathematically provable, economically solvent, and impervious to the most sophisticated adversarial attacks in the world."
    ],
    "situationalPuzzle": {
      "scenario": "During your final Master Capstone defense, the examination panel executes the ultimate multi-vector chaos test: 1) Takes a $100M flash loan to distort spot pool reserves; 2) Submits an invalid ZK proof to withdraw funds; 3) Injects simulated chain reorg on the cross-chain bridge; 4) Broadcasts an MEV sandwich attack in the mempool; 5) Attempts an uninitialized UUPS selfdestruct exploit. How does ApexDEX survive without losing a single dollar of user funds?",
      "options": [
        "The protocol crashes and loses all funds.",
        "Flawless Unified System Defense: 1) Multi-Oracle Aggregator detects the spot distortion, rejects the feed, and relies on Chainlink + TWAP; 2) The Groth16 on-chain verifier rejects the invalid pairing, reverting the ZK withdrawal; 3) The Bridge enforces 64-confirmation finality and daily rate limits, preventing reorg double-spending; 4) The router enforces strict amountOutMin slippage bounds and private RPC routing, rendering the sandwich attack unprofitable; 5) All logic contracts have _disableInitializers() in constructors, preventing selfdestruct takeover. ApexDEX remains 100% solvent.",
        "The node software rejects the examiner.",
        "The candidate fails the examination."
      ],
      "answerIdx": 1,
      "debrief": "This is the absolute zenith of smart contract and Web3 systems engineering. When cryptographic standards, strict reentrancy guards, virtual share offsets, multi-oracle aggregators, CEI accounting, and emergency circuit breakers are architected as a cohesive, unified system, the protocol stands impervious to any adversarial attack vector known to computer science."
    },
    "quests": [
      {
        "id": "bc-m2-d60-q1",
        "name": "ApexDEX Master Protocol Architecture Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive end-to-end system blueprint detailing concentrated AMM pools, ZK verifiers, ERC-4337 paymasters, and L2 scaling bridges."
      },
      {
        "id": "bc-m2-d60-q2",
        "name": "Full-Stack Web3 Chaos & Adversarial Penetration Audit",
        "type": "detective",
        "desc": "Execute automated chaos test suites in Foundry validating 100% solvency, zero reentrancy, oracle resilience, and 50,000-run invariant proofs."
      },
      {
        "id": "bc-m2-d60-q3",
        "name": "ApexDEX Production Decentralized Exchange & ZK Protocol Build",
        "type": "mastery",
        "desc": "Deploy and verify the complete working enterprise protocol in Solidity, Foundry, and TypeScript integrating concentrated liquidity, ZK proofs, and ERC-4337."
      },
      {
        "id": "bc-m2-d60-q4",
        "name": "Master Capstone Viva Voce & Live Security Defense",
        "type": "incident",
        "desc": "Defend the entire 60-day blockchain, smart contract, and cryptographic architecture before the Senior Web3 Board under live multi-vector attack testing."
      }
    ]
  }
];
