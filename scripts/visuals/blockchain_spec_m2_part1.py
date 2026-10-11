# scripts/visuals/blockchain_spec_m2_part1.py
# Course 16: Blockchain, Web3 & Smart Contracts (course-blockchain-web3)
# Month 2: Days 31-45 (Blocks 7-9) - 60 Quests Total

BLOCKCHAIN_M2_PART1 = [
  # =========================================================================
  # BLOCK 7: DECENTRALIZED FINANCE (DEFI) PROTOCOLS & AMMS (Days 31-35)
  # =========================================================================
  {
    "day": 31,
    "month": 2,
    "blockNum": 7,
    "title": "Automated Market Makers (AMM): Constant Product Formula (x · y = k), Slippage & Impermanent Loss",
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

  # =========================================================================
  # BLOCK 8: ORACLES, CROSS-CHAIN BRIDGES & INTEROPERABILITY (Days 36-40)
  # =========================================================================
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

  # =========================================================================
  # BLOCK 9: UPGRADEABLE SMART CONTRACTS & PROXY ARCHITECTURES (Days 41-45)
  # =========================================================================
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
        "Permanent Upgradeability Forfeiture (Bricked Upgrade Logic): No! In UUPS, the proxy has ZERO upgrade logic of its own—it strictly forwards calls to the implementation! Since ImplementationV2 lacks 'upgradeTo()', there is physically no code in the system capable of changing the implementation address at EIP-1967 slot! The proxy is permanently locked to ImplementationV2 forever. It has effectively become an immutable contract.",
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
  }
]
