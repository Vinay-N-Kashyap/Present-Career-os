# scripts/visuals/blockchain_spec_m1_rest.py
# Course 16: Blockchain, Web3 & Smart Contracts (course-blockchain-web3)
# Month 1: Days 16-30 (Blocks 4-6) - 60 Quests Total

BLOCKCHAIN_M1_PART2 = [
  # =========================================================================
  # BLOCK 4: TOKEN STANDARDS & FINANCIAL PRIMITIVES (Days 16-20)
  # =========================================================================
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

  # =========================================================================
  # BLOCK 5: SMART CONTRACT VULNERABILITIES & SECURITY AUDITING (Days 21-25)
  # =========================================================================
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
    "failureMode": "Checking 'require(tx.origin == owner)' in a wallet contract; the owner interacts with an innocent-looking free NFT mint website, which internally executes 'wallet.transferAll(attacker)'—the wallet checks tx.origin (the owner), authorizes the drain, and steals all funds.",
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

  # =========================================================================
  # BLOCK 6: DEVELOPMENT TOOLING, TESTING & MONTH 1 CAPSTONE (Days 26-30)
  # =========================================================================
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
]
