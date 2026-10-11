# scripts/visuals/blockchain_spec_m1.py
# Course 16: Blockchain, Web3 & Smart Contracts (course-blockchain-web3)
# Month 1: Days 1-15 (Blocks 1-3) - 60 Quests Total

BLOCKCHAIN_M1_PART1 = [
  # =========================================================================
  # BLOCK 1: CRYPTOGRAPHIC FOUNDATIONS & DISTRIBUTED LEDGERS (Days 1-5)
  # =========================================================================
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

  # =========================================================================
  # BLOCK 2: THE EVM ARCHITECTURE & MEMORY LAYOUT (Days 6-10)
  # =========================================================================
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

  # =========================================================================
  # BLOCK 3: SOLIDITY FUNDAMENTALS & SECURE CONTRACT ARCHITECTURE (Days 11-15)
  # =========================================================================
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
    "conceptInvariant": "Log Inaccessibility Invariant: EVM logs (LOG0 through LOG4 opcodes) write directly to the transaction receipt and are indexed in the block's Bloom filter; smart contracts cannot read past or present logs during execution—they exist solely for off-chain indexing.",
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
      "debrief": "In EVM events, only 'indexed' parameters are searchable topics. Furthermore, if a dynamic type (string, bytes, or array) is marked 'indexed', the EVM does NOT store the raw string in the topic—it stores 'keccak256(string)'. To search for an indexed string, off-chain indexers must filter by its 32-byte Keccak-256 hash."
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
  }
]
