# scripts/visuals/finance_investment_spec_m2_part2.py
# Days 46 to 60 Specification for Business Finance & Investment Management (course-finance-investment)
# Conforming strictly to Gate v2 semantic standard:
# 3-Tier Socratic Hint Ladders, Forward & Futures Pricing, Daily Marking-to-Market & Basis Risk,
# Option Contracts, Moneyness & Put-Call Parity Invariant Physics,
# Binomial Option Pricing & Risk-Neutral Tree Replication,
# Black-Scholes-Merton (BSM) Formulation, Analytical Greeks (Delta, Gamma, Theta, Vega, Rho) & Dynamic Hedging,
# Interest Rate & Currency Swaps (Comparative Advantage & Plain Vanilla Swaps),
# Alternative Investments (REITs, InvITs, Hedge Funds & Private Equity),
# Venture Capital Valuation, Cap Tables, Dilution & Liquidation Preferences,
# Leveraged Buyout (LBO) Debt Structuring, Cash Sweeps & Returns Waterfalls (IRR / MoIC),
# Mergers & Acquisitions (M&A) Synergies, Accretion/Dilution & Pro-Forma EPS Mechanics,
# Deal Structuring, Stock vs Cash Consideration & Hostile Takeover Defense Physics,
# Corporate Restructuring, Spin-offs, Carve-outs & Insolvency Bankruptcy Resolution,
# Enterprise Financial Risk Governance: Value at Risk (VaR), Expected Shortfall (CVaR) & Basel III,
# Wall Street Forensic Post-Mortems (Enron, LTCM, Lehman Brothers, SVB),
# Chief Investment Officer (CIO) Strategic Asset Allocation RFC,
# and Capstone 2: ApexInvest Global Multi-Asset Investment Management, Corporate Valuation, M&A & Sovereign Treasury Suite.

DAYS_46_TO_60 = [
  {
    "day": 46,
    "month": 2,
    "blockNum": 10,
    "title": "Derivative Foundations: Forward Contracts, Futures & Daily Marking-to-Market",
    "stageName": "Stage 4: Derivatives, Private Equity, Mergers & Corporate Restructuring",
    "stageNum": 4,
    "pedagogicalRole": "Linear Derivatives & Futures Mechanics Physics",
    "spokenGoal": "Derivatives are contracts whose value is derived from an underlying asset—stocks, bonds, commodities, or currencies. Today, we master Linear Derivatives: Forward Contracts versus Futures Contracts. While forward contracts are private, customized, over-the-counter agreements carrying counterparty credit risk, futures contracts are standardized, exchange-traded instruments cleared through a Central Counterparty (CCP) with Daily Marking-to-Market and margin accounts (Initial Margin and Maintenance Margin). We will derive the Spot-Futures Parity equation (Cost of Carry Model: F0 = S0 * e^(r*T)), understand Basis Risk, and execute corporate treasury commodity and FX hedging.",
    "conceptInvariant": "Cost of Carry Parity Invariant: Under no-arbitrage, the forward/futures price of an investment asset with zero storage costs and continuous risk-free rate r equals F0 = S0 * e^(r * T); any divergence allows risk-free cash-and-carry or reverse cash-and-carry arbitrage.",
    "failureMode": "A multinational airline fails to hedge jet fuel exposure; when oil spikes from $65 to $125/barrel, fuel expenses surge by $450M, obliterating operating profit; conversely, a rival airline that hedged fuel with futures locks in $70/barrel, preserving liquidity and driving the unhedged airline into bankruptcy.",
    "tryItFriction": "Build an Automated Futures Pricing & Marking-to-Market Engine in Python: take spot prices, risk-free interest rates, dividend yields, and storage costs; calculate theoretical futures prices; simulate 30 days of price volatility; track initial margin, variation margin calls, and maintenance margin breaches; demonstrate cash-and-carry arbitrage when market futures deviate from theoretical parity.",
    "socraticHints": [
      "What is 'Daily Marking-to-Market' in futures contracts?",
      "At the close of every trading day, the exchange credits profits to winning accounts and debits losses from losing accounts in cash.",
      "This daily settlement resets the contract value to zero and prevents counterparty default losses from accumulating over time."
    ],
    "situationalPuzzle": {
      "scenario": "A gold mining company holds 10,000 ounces of gold in storage (Spot price = $2,000/oz). Gold storage costs are zero. The 1-year risk-free interest rate is 5.0% (continuously compounded). The 1-year gold futures contract is trading on the exchange at $2,150/oz. Theoretical futures price is F0 = $2,000 * e^(0.05 * 1) = $2,102.54. How can an institutional trader execute a risk-free cash-and-carry arbitrage?",
      "options": [
        "Sell physical gold and buy futures contracts.",
        "Borrow $20M at 5.0%, buy 10,000 oz of physical gold at $2,000/oz today, sell 1-year futures contracts at $2,150/oz, deliver the gold at Year 1 to collect $21.50M, repay the loan ($21.025M), and lock in an instant risk-free arbitrage profit of $474,600!",
        "Do nothing because gold futures prices naturally fluctuate.",
        "Arbitrage is illegal on commodity exchanges."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. When market futures price ($2,150) exceeds theoretical fair value ($2,102.54), a Cash-and-Carry Arbitrage is executed: 1) Borrow $20,000,000 for 1 year at 5.0% continuous rate. 2) Buy 10,000 ounces of physical gold in spot market at $2,000/oz. 3) Sell (short) 10,000 ounces of 1-year gold futures at $2,150/oz. 4) Store the gold for 1 year. 5) At Year 1, deliver the 10,000 ounces into the futures contract, collecting a guaranteed $21,500,000. 6) Repay the bank loan: $20,000,000 * e^(0.05*1) = $21,025,400. 7) Net risk-free profit = $21,500,000 - $21,025,400 = $474,600! Such arbitrage selling drives the futures price down until F0 = S0 * e^(r*T)."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of the Cost of Carry Model & Convenience Yield",
        "type": "concept",
        "description": "Derive the Spot-Futures Parity equation for financial assets with dividend yields F0 = S0 * e^((r - q)*T) and commodities with storage costs and convenience yield F0 = S0 * e^((r + u - y)*T); define Contango (F0 > S0) vs Backwardation (F0 < S0) and explain Keynes' Normal Backwardation theory.",
        "rubric": "Step-by-step mathematical derivation of no-arbitrage bounds; define cash-and-carry vs reverse cash-and-carry conditions; explain convenience yield y as the economic benefit of holding physical inventory during shortages."
      },
      {
        "title": "The Metallgesellschaft Oil Hedging Stack-and-Roll Disaster Forensic Audit",
        "type": "detective",
        "description": "Audit the 1993 collapse of Metallgesellschaft (MG): analyze how MG committed to sell 10-year fixed-price heating oil contracts to customers and hedged using a 'Stack-and-Roll' strategy in short-term oil futures; when oil markets flipped from backwardation into contango, trace how daily marking-to-market margin calls drained $1.3B in cash, triggering liquidation.",
        "rubric": "Model the stack-and-roll futures hedge structure; quantify negative roll yield in a contango market; demonstrate why accounting liquidity mismatches can cause bankruptcy even when economic hedges are structurally sound."
      },
      {
        "title": "Institutional Futures Hedging & Margin Tracking Engine",
        "type": "mastery",
        "description": "Develop an automated commodity and FX futures hedging platform in Python: compute the Minimum Variance Hedge Ratio (h* = rho * (sigma_S / sigma_F)) and optimal number of futures contracts; simulate daily market price paths; track marking-to-market settlements, initial margin, and automated margin call alerts.",
        "rubric": "Implement OLS regression to compute empirical hedge ratio; simulate 60-day daily price paths; maintain institutional margin ledger tracking cash debits/credits; output basis risk tracking error statistics."
      },
      {
        "title": "The Negative Crude Oil Price Expiry Shock War Room",
        "type": "incident",
        "description": "Analyze the unprecedented April 20, 2020 WTI crude oil crash to -$37.63/barrel: trace how expiring May futures contracts facing physical delivery bottlenecks at Cushing, Oklahoma ran out of storage space; exchange systems were unprepared for negative prices; design the trading and risk limits required to handle negative commodity prices.",
        "rubric": "Explain physical delivery settlement mechanics vs cash settlement; model the cost of storage spike that forced physical traders to pay buyers to take delivery; formulate exchange clearinghouse margin safeguards for bounded-below zero assets."
      }
    ]
  },
  {
    "day": 47,
    "month": 2,
    "blockNum": 10,
    "title": "Option Contracts Architecture: Payoffs, Moneyness & Put-Call Parity Physics",
    "stageName": "Stage 4: Derivatives, Private Equity, Mergers & Corporate Restructuring",
    "stageNum": 4,
    "pedagogicalRole": "Non-Linear Derivatives & Put-Call Parity Physics",
    "spokenGoal": "Unlike futures which represent mandatory obligations, Option Contracts provide Rights without Obligations. A Call Option gives the buyer the right to buy an asset at strike price K; a Put Option gives the right to sell. This asymmetry creates non-linear, kinked payoff profiles: limited downside risk with explosive upside leverage. Today, we master Option Moneyness (In-the-Money, At-the-Money, Out-of-the-Money), intrinsic value vs time value, and corporate finance's most important arbitrage relationship: Put-Call Parity! Discovered by Hans Stoll in 1969, Put-Call Parity proves that a fiduciary call plus risk-free cash MUST equal a protective put plus underlying stock: C + K * e^(-r*T) = P + S!",
    "conceptInvariant": "Put-Call Parity Arbitrage Invariant: For European options on a non-dividend-paying stock with identical strike K and maturity T, the no-arbitrage identity C + K * e^(-r * T) = P + S must hold unconditionally; any pricing discrepancy creates a risk-free synthetic arbitrage.",
    "failureMode": "A quantitative trading desk observes a European call trading at $8.00 and a European put trading at $3.00 on a $50 stock (Strike $50, 1-year rate 5%); theoretical put-call parity dictates P = $8.00 + $50*e^(-0.05) - $50 = $5.56; the put is severely underpriced at $3.00; failing to execute conversion arbitrage forfeits $2.56/share in risk-free profit.",
    "tryItFriction": "Construct a Put-Call Parity Arbitrage Scanner in Python: take live option chain prices (Calls, Puts, Strikes, Expiries) and risk-free rates; test whether C + PV(K) == P + S; detect conversion (long stock, long put, short call) and reverse conversion mispricings; output net risk-free arbitrage profit matrices.",
    "socraticHints": [
      "What is the portfolio composition of a 'Fiduciary Call' and a 'Protective Put'?",
      "Fiduciary Call = One European Call Option + Zero-Coupon Bond with face value K (Cost = C + K*e^(-rT)).",
      "Protective Put = One Share of Stock + One European Put Option (Cost = S + P). At expiration, BOTH portfolios have an identical payoff: max(S_T, K); hence, their costs today must be identical!"
    ],
    "situationalPuzzle": {
      "scenario": "A non-dividend stock trades at S = $100. A 1-year European call with strike K = $100 trades at C = $12.00. The continuously compounded risk-free rate is 5.0% (PV(K) = $100 * e^(-0.05) = $95.12). A 1-year European put with strike K = $100 is trading on the exchange for $5.00. Is there an arbitrage opportunity, and what trade should be executed?",
      "options": [
        "No, because puts are always cheaper than calls.",
        "Yes! Put-Call Parity requires P = C + PV(K) - S = $12.00 + $95.12 - $100.00 = $7.12. The market put ($5.00) is underpriced by $2.12! Buy the cheap Put ($5), Buy Stock ($100), Sell Call ($12), and Borrow $95.12 at 5%; pocket $2.12 in risk-free cash today with zero net obligation at maturity!",
        "Sell the stock and buy the call.",
        "Put-Call Parity does not apply when strike equals current stock price."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us check Put-Call Parity: C + PV(K) = P + S => $12.00 + $95.12 = $107.12. Meanwhile, P + S = $5.00 + $100.00 = $105.00. The synthetic call/cash side is worth $107.12 while the physical stock/put side costs only $105.00! Execute a Conversion Arbitrage: 1) Buy the cheap side: Buy 1 Share ($100 outflow), Buy 1 Put ($5 outflow) = -$105.00. 2) Sell the expensive side: Sell 1 Call (+$12 inflow), Borrow PV of strike (+$95.12 inflow) = +$107.12. 3) Net cash today: +$107.12 - $105.00 = +$2.12 FREE ARBITRAGE CASH! 4) At maturity: If S_T >= $100, call is exercised: deliver stock, collect $100 strike, repay $100 loan (Net $0). If S_T < $100, exercise put: sell stock for $100 strike, repay $100 loan (Net $0). Perfect risk-free arbitrage."
    },
    "quests": [
      {
        "title": "Mathematical Proof of Put-Call Parity & American Option Early Exercise Boundaries",
        "type": "concept",
        "description": "Prove Put-Call Parity using state-contingent payoff dominance; extend parity to dividend-paying assets C + D + PV(K) = P + S; prove mathematically why American Call Options on non-dividend stocks should NEVER be exercised early prior to expiration: C_American = C_European.",
        "rubric": "Step-by-step payoff table proof; derive upper and lower bounds for American and European options; prove why exercising an American call early destroys time value and forfeits interest on the strike price."
      },
      {
        "title": "The Box Spread Free Lunch Arbitrage Forensic Audit",
        "type": "detective",
        "description": "Audit an options 'Box Spread' (Bull Call Spread + Bear Put Spread) execution: prove that a box spread creates a purely synthetic risk-free zero-coupon bond paying (K2 - K1); demonstrate how retail trader 'IronBeam / 1R0NYMAN' attempted an unhedged early-exercise box spread on Robinhood in 2019, turning a $5,000 account into a -$600,000 margin deficit.",
        "rubric": "Detail box spread payoff matrix; explain the catastrophic risk of American early assignment on short legs; calculate how early exercise breaks synthetic lending and triggers massive borrowing exposure."
      },
      {
        "title": "Interactive Option Strategy Payoff & Parity Engine",
        "type": "mastery",
        "description": "Build an enterprise option strategy payoff visualization engine in Python: model single options, Straddles, Strangles, Bull/Bear Spreads, Iron Condors, and Collars; calculate maximum gain, maximum loss, and break-even stock prices; scan option chains for Put-Call Parity violations and output actionable trade alerts.",
        "rubric": "Vectorized calculation of multi-leg option payoff arrays at expiration and pre-expiration; plot interactive matplotlib payoff diagrams with P&L zones; implement automated parity violation detector."
      },
      {
        "title": "The Corporate Convertible Bond Delta Hedging War Room",
        "type": "incident",
        "description": "Structure a corporate convertible debt financing: an enterprise issues $500M of 1.5% convertible bonds with a 25% conversion premium; institutional convertible arbitrage hedge funds buy the bonds and aggressively short the company's common stock to delta hedge; advise the CFO on how to structure a Call Spread Overlay (buying call options and selling warrants) to eliminate dilution up to a 75% stock price surge.",
        "rubric": "Decompose convertible debt into straight bond plus embedded call option; calculate hedge fund delta shorting volume; design the call spread overlay transaction to neutralize equity dilution for existing shareholders."
      }
    ]
  },
  {
    "day": 48,
    "month": 2,
    "blockNum": 10,
    "title": "Option Valuation I: Binomial Option Pricing Model & Risk-Neutral Physics",
    "stageName": "Stage 4: Derivatives, Private Equity, Mergers & Corporate Restructuring",
    "stageNum": 4,
    "pedagogicalRole": "Discrete-Time Option Valuation & Risk-Neutral Replication Physics",
    "spokenGoal": "How do you price an option when its payoff depends on future stock prices? In 1979, Cox, Ross, and Rubinstein developed the Binomial Option Pricing Model. The genius of the binomial model is that it does NOT require knowing the subjective probability of the stock going up or down, nor does it require knowing investors' risk aversion! Instead, we construct a Replicating Portfolio of the underlying stock and risk-free bonds that perfectly mirrors the option's payoff. Through the principle of No-Arbitrage, the option price MUST equal the cost of this replicating portfolio! This leads directly to Risk-Neutral Valuation, where options can be priced by discounting expected payoffs at the risk-free rate under risk-neutral probabilities.",
    "conceptInvariant": "Risk-Neutral Valuation Invariant: In any discrete binomial lattice, the option price equals the discounted expected payoff under unique risk-neutral probability p = (e^(r*dt) - d) / (u - d): C = e^(-r*dt) * [ p * C_u + (1 - p) * C_d ]; subjective real-world probabilities and risk premia are completely irrelevant to option prices.",
    "failureMode": "A financial analyst calculates an option's expected payoff using their personal subjective bullish belief that the stock has an 80% chance of rising; discounting this subjective expectation at a 15% cost of equity misprices the option by 65%; the trading desk takes the other side of the trade and extracts $450,000 from the analyst's fund.",
    "tryItFriction": "Construct a Multi-Step Recombining Binomial Option Pricing Engine in Python: take stock price S, strike K, volatility sigma, risk-free rate r, and time to maturity T; construct an N-step tree with Cox-Ross-Rubinstein parameters u = e^(sigma*sqrt(dt)) and d = 1/u; backward induct option values for European and American options; verify convergence to continuous pricing as N approaches 1,000.",
    "socraticHints": [
      "Why do subjective probabilities of stock price movements (e.g., 70% chance up vs 30% down) NOT appear in the binomial option pricing formula?",
      "Because the current stock price S already incorporates all market information and investors' subjective beliefs.",
      "Once the stock price is given, the option price is uniquely determined by the cost of replicating it using the stock and cash, leaving zero room for subjective probabilities."
    ],
    "situationalPuzzle": {
      "scenario": "A stock currently trades at S = $50. In one period, it can either rise to S_u = $60 (u = 1.20) or fall to S_d = $40 (d = 0.80). The risk-free rate is r = 5.0% (e^(r*dt) = 1.0513, or simple 5% => (1+r) = 1.05). Consider a European Call Option with strike K = $50. C_u = max(60 - 50, 0) = $10. C_d = max(40 - 50, 0) = $0. What is the risk-neutral probability p, the hedge ratio Delta, and the fair value of the call option?",
      "options": [
        "p = 0.50, Delta = 1.0, Call Value = $5.00.",
        "Delta = (10 - 0) / (60 - 40) = 0.50 shares. Risk-neutral probability p = (1.05 - 0.80) / (1.20 - 0.80) = 0.25 / 0.40 = 0.625. Call Value = [ 0.625 * $10 + 0.375 * $0 ] / 1.05 = $6.25 / 1.05 = $5.95!",
        "p = 0.75, Delta = 0.25, Call Value = $7.50.",
        "Binomial pricing cannot be solved without historical stock returns."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us solve using both replication and risk-neutral valuation: 1) Hedge Ratio (Delta): Delta = (C_u - C_d) / (S_u - S_d) = ($10 - $0) / ($60 - $40) = $10 / $20 = 0.50 shares. 2) Replicating Portfolio: Buy 0.5 shares @ $50 = $25 outlay. At t=1: If stock goes up to $60, 0.5 shares are worth $30. If stock goes down to $40, 0.5 shares are worth $20. Borrow B = $20 / 1.05 = $19.048 today. Net portfolio cost = $25.00 - $19.048 = $5.952! At t=1: If up, payoff = $30 - $20 = $10 (matches call). If down, payoff = $20 - $20 = $0 (matches call). Option value MUST be $5.952. 3) Risk-neutral probability: p = ((1+r) - d) / (u - d) = (1.05 - 0.80) / (1.20 - 0.80) = 0.25 / 0.40 = 0.625. Call Value = (p * C_u + (1-p) * C_d) / (1+r) = (0.625 * $10 + 0) / 1.05 = $6.25 / 1.05 = $5.952. Both methods yield identical pricing."
    },
    "quests": [
      {
        "title": "Mathematical Derivation of the Cox-Ross-Rubinstein Binomial Tree",
        "type": "concept",
        "description": "Derive the Cox-Ross-Rubinstein parameters u = e^(sigma * sqrt(dt)) and d = e^(-sigma * sqrt(dt)) = 1/u by matching the mean and variance of the binomial walk to geometric Brownian motion; derive the risk-neutral probability p = (e^(r*dt) - d)/(u - d); prove the central limit theorem convergence to Black-Scholes as dt -> 0.",
        "rubric": "Step-by-step moment matching derivation (E[S] and Var(S)); derive the backward induction algorithm; show that the binomial distribution converges to the log-normal distribution."
      },
      {
        "title": "American Early Exercise Option Boundary Forensic Audit",
        "type": "detective",
        "description": "Audit an American Put Option on a high-volatility stock: compare European Put vs American Put pricing on a 10-step binomial tree; identify the exact early exercise boundary nodes where intrinsic value (K - S) strictly exceeds continuation value; quantify the early exercise premium.",
        "rubric": "Implement backward induction with American early exercise check: max(K - S, e^(-r*dt)*(p*V_u + (1-p)*V_d)); highlight optimal exercise nodes; prove that deep in-the-money American puts are always exercised early."
      },
      {
        "title": "N-Step Vectorized Binomial Option Pricing Suite",
        "type": "mastery",
        "description": "Construct a high-performance N-step binomial option pricing engine in Python: support European and American Calls and Puts with discrete cash dividends; implement vectorized backward induction using numpy; price options across varying tree depths (N = 10, 50, 200, 1000); plot price convergence curves against Black-Scholes analytical values.",
        "rubric": "Vectorized numpy array tree implementation (no slow Python loops); handle ex-dividend dates by shifting tree nodes; benchmark execution speed (<0.5s for N=1000) and verify convergence within 0.01% of BSM."
      },
      {
        "title": "The Executive Stock Option Vesting & Forfeiture War Room",
        "type": "incident",
        "description": "Value executive stock options (ESOs) for corporate financial reporting under IFRS 2 / ASC 718: standard Black-Scholes is legally invalid because ESOs are non-transferable, subject to 4-year vesting schedules, and feature sub-optimal early exercise behavior by executives; build a customized binomial lattice incorporating employee departure hazard rates and suboptimal early exercise thresholds.",
        "rubric": "Model vesting restrictions and post-vesting employee turnover probabilities; implement Hull-White early exercise threshold (e.g., executives exercise when stock price reaches 2x strike); produce audited fair value expense figures."
      }
    ]
  },
  {
    "day": 49,
    "month": 2,
    "blockNum": 10,
    "title": "Option Valuation II: Black-Scholes-Merton (BSM) & The Analytical Greeks",
    "stageName": "Stage 4: Derivatives, Private Equity, Mergers & Corporate Restructuring",
    "stageNum": 4,
    "pedagogicalRole": "Continuous-Time Option Physics & Greeks Risk Management",
    "spokenGoal": "In 1973, Fischer Black, Myron Scholes, and Robert Merton solved one of the greatest problems in financial history: the continuous-time option pricing formula. By continuously adjusting a delta-hedged portfolio of stock and debt, all risk is dynamically eliminated, producing the Black-Scholes partial differential equation: dV/dt + 0.5 * sigma^2 * S^2 * d^2V/dS^2 + r * S * dV/dS - r * V = 0! Today, we master the closed-form BSM formula: C = S * N(d1) - K * e^(-r*T) * N(d2). Furthermore, we master the Analytical Greeks: Delta (hedge ratio), Gamma (curvature), Theta (time decay), Vega (volatility sensitivity), and Rho (interest rate sensitivity), and execute institutional dynamic delta hedging!",
    "conceptInvariant": "Black-Scholes-Merton Continuous Replication Invariant: In the Black-Scholes world, an option's return is driven strictly by underlying stock movement and time decay: Theta + 0.5 * Gamma * S^2 * sigma^2 + r * S * Delta = r * OptionPrice; a delta-neutral portfolio makes money via Gamma (realized volatility) if and only if realized volatility exceeds the implied volatility priced into the option.",
    "failureMode": "An options market maker delta-hedges a large short call position once a week instead of dynamically intraday; a sudden earnings announcement causes the stock to jump 30%; because the desk was short Gamma, the delta exploded from 0.40 to 0.95 without rebalancing, resulting in a devastating $8.5M gamma blow-up.",
    "tryItFriction": "Build an Institutional Black-Scholes-Merton & Analytical Greeks Engine in Python: take S, K, T, r, and sigma; compute closed-form Call and Put prices, d1, d2, Delta, Gamma, Theta, Vega, and Rho; implement a Newton-Raphson Implied Volatility (IV) solver; execute a 30-day dynamic delta-hedging simulation with daily rebalancing and transaction costs.",
    "socraticHints": [
      "What is the economic interpretation of N(d1) and N(d2) in the Black-Scholes formula?",
      "N(d1) represents the Delta of the call option—the number of shares needed to create a replicating portfolio.",
      "N(d2) represents the risk-neutral probability that the call option will expire in-the-money (S_T > K)!"
    ],
    "situationalPuzzle": {
      "scenario": "A market maker sells 1,000 call contracts (100,000 shares) on Stock X (S = $100, Strike = $100, T = 0.5 years, r = 5%, sigma = 30%). The call's Delta is Delta = 0.58, and Gamma is Gamma = 0.018. To make the position Delta-Neutral, the market maker buys 58,000 shares of stock. Next morning, the stock jumps from $100 to $105 (+ $5.00). What is the new Delta of the option, and what action must the market maker take to maintain delta neutrality?",
      "options": [
        "Delta remains 0.58; do nothing.",
        "New Delta increases by approx Gamma * Delta S = 0.018 * 5 = +0.09 to Delta = 0.67 (67,000 shares). The market maker is now under-hedged by 9,000 shares (67,000 - 58,000) and MUST BUY 9,000 MORE SHARES at $105 to re-hedge!",
        "Delta falls to 0.40; sell 18,000 shares.",
        "Gamma eliminates the need for dynamic rebalancing."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us trace dynamic gamma and delta mechanics: 1) Initial state: Short 100,000 calls * 0.58 delta = Short 58,000 deltas. Market maker buys 58,000 shares. Net Delta = 0 (Delta-Neutral). 2) Stock moves up: Delta S = +$5.00. Using Gamma = dDelta / dS: Delta increases by Gamma * Delta S = 0.018 * 5.00 = +0.09. The new option Delta is 0.58 + 0.09 = 0.67. 3) Re-hedging: The short call position now represents Short 67,000 deltas. But the market maker currently owns only 58,000 shares. To restore delta neutrality, the market maker must BUY 9,000 additional shares at the higher price of $105. This demonstrates why option sellers with negative gamma are forced to 'buy high and sell low' during dynamic hedging, which represents the cost of harvesting option premium (Theta)."
    },
    "quests": [
      {
        "title": "Mathematical Derivation of Black-Scholes PDE & Closed-Form Greeks",
        "type": "concept",
        "description": "Derive the Black-Scholes partial differential equation using Ito's Lemma on geometric Brownian motion dS = mu*S*dt + sigma*S*dz; construct the riskless hedged portfolio Pi = -V + Delta*S; derive analytical formulas for Delta, Gamma, Theta, Vega, and Rho; prove the BSM PDE identity relating Theta, Gamma, and Delta.",
        "rubric": "Step-by-step stochastic calculus derivation; apply Ito's lemma; eliminate Brownian Wiener process dz; solve the heat equation boundary conditions; write exact analytical formulas for all 5 Greeks."
      },
      {
        "title": "The Volatility Smile & Black-Scholes Breakdown Forensic Audit",
        "type": "detective",
        "description": "Audit the post-1987 Crash 'Volatility Smile' and 'Volatility Skew': prove why the Black-Scholes assumption of constant log-normal volatility fails empirically; extract implied volatilities across strikes from market option chains; demonstrate how out-of-the-money puts trade at massive implied volatility premiums due to crashophobia and fat-tailed asset returns.",
        "rubric": "Plot market implied volatility against strike price (volatility surface); explain fat tails (leptokurtosis) and negative skewness; demonstrate how the Black-Scholes model underprices deep out-of-the-money tail crash risk."
      },
      {
        "title": "High-Precision Black-Scholes Greeks & Implied Volatility Solver",
        "type": "mastery",
        "description": "Construct an institutional option analytics module in Python: compute BSM prices and all 5 Greeks with continuous dividend yields (Merton extension); implement a robust Newton-Raphson and Brent-method Implied Volatility solver from market option prices; simulate a 30-day dynamic delta-hedging backtest tracking daily P&L, transaction fees, and gamma slippage.",
        "rubric": "Vectorized calculation of prices and Greeks; root-finding IV solver with divergence guards; daily rebalancing simulation demonstrating the P&L trade-off between Theta decay and Gamma replication costs."
      },
      {
        "title": "The Rogue Trader Gamma Squeeze Blow-Up War Room",
        "type": "incident",
        "description": "Investigate a catastrophic investment banking derivatives desk blow-up (modeled after Nick Leeson / Jerome Kerviel): a rogue trader accumulates an unauthorized $2B short straddle position; market volatility explodes following a geopolitical crisis; the desk is severely short Gamma and Vega, facing $350M in daily mark-to-market losses; execute an emergency orderly unwinding and volatility hedge to prevent institutional insolvency.",
        "rubric": "Quantify portfolio Greeks (aggregate Vega and Gamma exposure); structure emergency hedges using index futures and exchange-traded VIX call options; execute phased order liquidation minimizing market impact."
      }
    ]
  },
  {
    "day": 50,
    "month": 2,
    "blockNum": 10,
    "title": "Interest Rate & Currency Swaps: Comparative Advantage & Hedging Physics",
    "stageName": "Stage 4: Derivatives, Private Equity, Mergers & Corporate Restructuring",
    "stageNum": 4,
    "pedagogicalRole": "Swap Architecture & Macro Hedging Physics",
    "spokenGoal": "In corporate treasury management, no derivative contract is more universally deployed than the Swap. Today, we master Interest Rate Swaps (Plain Vanilla Fixed-for-Floating) and Cross-Currency Swaps. We will dissect the classic Comparative Advantage argument: how two corporations with differing credit ratings can borrow in their respective preferred markets and swap obligations through a swap bank to lower borrowing costs for BOTH parties! We will learn how to price an interest rate swap as a portfolio of forward rate agreements (FRAs) or two bond positions, determine the no-arbitrage Swap Rate, and execute cross-border currency risk immunization.",
    "conceptInvariant": "Swap Parity Invariant: At inception, an interest rate swap has an initial value of exactly zero: V_swap = 0; the fixed swap rate R_swap is set such that the present value of all expected floating payments equals the present value of all fixed payments: R_swap = (1 - P_n) / sum_{i=1}^n P_i, where P_i are zero-coupon discount factors.",
    "failureMode": "A corporate treasury with $400M in floating-rate bank debt fails to swap into fixed rates; central banks hike benchmark rates from 1.0% to 5.5% over 18 months; annual interest expenses explode from $4M to $22M, breaching the debt-service coverage ratio and forcing emergency asset fire sales.",
    "tryItFriction": "Build an Institutional Swap Pricing & Valuation Engine in Python: take a yield curve / discount factors; compute the equilibrium par swap rate for tenors from 1 to 10 years; simulate an ongoing swap 2 years post-inception under an interest rate shift; compute the exact mark-to-market replacement value (V_swap) for both fixed and floating counterparties.",
    "socraticHints": [
      "Why is a plain vanilla floating-rate bond ALWAYS worth par ($1,000) immediately following a coupon reset date?",
      "Because the next coupon payment will adjust exactly to match the current market interest rate for that period.",
      "An asset whose future cash flows always adjust to the prevailing market discount rate has a present value equal to its face value on every reset date."
    ],
    "situationalPuzzle": {
      "scenario": "Company AAA can borrow Fixed at 6.0% or Floating at SOFR + 0.20%. Company BBB (lower credit rating) can borrow Fixed at 8.0% or Floating at SOFR + 1.20%. Company AAA wants floating-rate debt; Company BBB wants fixed-rate debt. What is the total comparative advantage arbitrage gain, and how should a swap bank structure the transaction so all three parties gain?",
      "options": [
        "There is no gain because BBB pays higher rates everywhere.",
        "The fixed spread difference is 2.0% (8% - 6%), while the floating spread difference is 1.0% (1.2% - 0.2%). The net comparative advantage spread is 2.0% - 1.0% = 1.00% (100 bps)! AAA borrows fixed at 6%, BBB borrows floating at SOFR+1.2%, and they swap cash flows so AAA saves 35 bps, BBB saves 35 bps, and the swap bank earns a 30 bps fee!",
        "Total gain is 3.0%.",
        "Swaps cannot be executed between parties with different credit ratings."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us analyze comparative advantage: Fixed spread: BBB pays 8.0% - 6.0% = 2.00% premium. Floating spread: BBB pays (SOFR + 1.2%) - (SOFR + 0.2%) = 1.00% premium. Company AAA has an absolute advantage in both markets, but a COMPARATIVE advantage in fixed borrowing (it pays 200 bps less in fixed, but only 100 bps less in floating). Company BBB has a comparative advantage in floating debt. Total potential system gain = 2.00% - 1.00% = 1.00% (100 bps). Structure: 1) AAA borrows fixed at 6.0%. 2) BBB borrows floating at SOFR + 1.20%. 3) They enter a swap with a bank: AAA pays floating SOFR - 0.15% (saving 35 bps vs borrowing floating at SOFR+0.20%). BBB pays fixed at 7.65% (saving 35 bps vs borrowing fixed at 8.0%). The swap bank collects fixed 7.65% from BBB, pays fixed 6.0% to AAA, and nets a riskless 30 bps intermediation spread. All parties win."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of Par Swap Rates & Swap Valuation",
        "type": "concept",
        "description": "Derive the par swap rate formula R_swap = (1 - P_n) / sum_{i=1}^n P_i from the no-arbitrage condition that a swap equals a portfolio of two bonds: V_swap = B_fixed - B_floating; prove that on reset dates B_floating = Par; derive mark-to-market swap valuation formulas between reset dates.",
        "rubric": "Step-by-step algebraic derivation of par swap rate; show how discount factors P_i are extracted from spot curves; formulate off-market swap valuation V_swap = sum(C_fixed * P_i) - B_floating."
      },
      {
        "title": "The Municipal Interest Rate Swap Predatory Mispricing Forensic Audit",
        "type": "detective",
        "description": "Audit municipal government and school district interest rate swaps executed before the 2008 crisis (e.g., Jefferson County, Alabama): analyze how investment banks sold complex swaptions and auction-rate security swaps with hidden mark-to-market termination fees; demonstrate how credit downgrades triggered multi-million-dollar collateral calls and municipal bankruptcy.",
        "rubric": "Decompose complex swaption structures; compute negative mark-to-market termination liabilities; prove that municipal treasurers entered asymmetrical, toxic derivatives without understanding duration risk."
      },
      {
        "title": "Multi-Currency Cross-Border Swap Valuation Suite",
        "type": "mastery",
        "description": "Build an enterprise swap pricing and risk engine in Python: accept multi-currency yield curves (USD SOFR, EUR EURIBOR, JPY TONAR); price plain vanilla fixed-for-floating interest rate swaps and cross-currency basis swaps with principal exchange; compute DV01, bucketed key-rate duration risk, and counterparty Credit Valuation Adjustment (CVA).",
        "rubric": "Clean object-oriented swap engine; support custom payment frequencies and day-count conventions; compute CVA based on counterparty default probabilities; output complete mark-to-market risk schedule."
      },
      {
        "title": "The Cross-Currency Basis Spread FX Crisis War Room",
        "type": "incident",
        "description": "Handle an international treasury funding crisis: an Asian multinational with $1B in USD debt sees the USD/JPY cross-currency basis spread blow out to -85 bps during a dollar shortage; rolling over short-term FX swaps becomes prohibitively expensive; structure a 5-year cross-currency swap to lock in synthetic JPY funding and insulate the balance sheet from FX volatility.",
        "rubric": "Explain the mechanics of the cross-currency basis spread (violation of Covered Interest Parity); model the synthetic funding arbitrage; structure the fixed-to-floating cross-currency swap eliminating exchange rate translation risk."
      }
    ]
  },
  {
    "day": 51,
    "month": 2,
    "blockNum": 11,
    "title": "Alternative Investments: Real Estate (REITs), InvITs & Hedge Fund Strategies",
    "stageName": "Stage 4: Derivatives, Private Equity, Mergers & Corporate Restructuring",
    "stageNum": 4,
    "pedagogicalRole": "Alternative Asset Classes & Absolute Return Physics",
    "spokenGoal": "In institutional asset allocation, equities and bonds are only the beginning. Large pension funds, endowments, and sovereign wealth funds allocate 30% to 50% of their capital to Alternative Investments: Real Estate Investment Trusts (REITs), Infrastructure Investment Trusts (InvITs), Commodities, and Hedge Funds. Today, we master the valuation of income-generating real assets using Net Operating Income (NOI), Capitalization Rates (Cap Rates = NOI / Property Value), and Funds From Operations (FFO). We will also dissect the primary Hedge Fund Strategies: Equity Long/Short, Market Neutral, Global Macro, and Event-Driven Merger Arbitrage.",
    "conceptInvariant": "Real Estate Cap Rate Invariant: In commercial real estate valuation, property value equals Net Operating Income divided by the Capitalization Rate: Value = NOI / Cap Rate; the Cap Rate represents the unlevered net initial yield and decomposes into Cap Rate = Risk-Free Rate + Property Risk Premium - Expected NOI Growth Rate.",
    "failureMode": "A commercial real estate fund acquires office towers at an aggressive 3.5% Cap Rate financed with 75% floating-rate debt; when central banks hike rates to 5.0%, borrowing costs exceed the property yield (Negative Leverage); property values decline by 35%, wiping out 100% of the fund's equity.",
    "tryItFriction": "Construct a Commercial Real Estate REIT Valuation Engine in Python: take property revenues, operating expenses, tenant vacancies, and capital reserves; compute Net Operating Income (NOI); value assets via Cap Rate capitalization; compute Funds From Operations (FFO) and Adjusted Funds From Operations (AFFO); model debt leverage debt-service coverage ratios (DSCR).",
    "socraticHints": [
      "Why is Funds From Operations (FFO) used instead of accounting Net Income to evaluate REITs?",
      "Because accounting rules force commercial real estate owners to deduct massive non-cash depreciation on buildings, even when real physical property values are appreciating.",
      "FFO adds back depreciation and excludes one-time gains on asset sales, providing a true measure of ongoing operating cash flow."
    ],
    "situationalPuzzle": {
      "scenario": "A commercial office building generates $12,000,000 in Gross Potential Rent, has a 10% vacancy and credit loss rate, and incurs $3,800,000 in annual property operating expenses (taxes, insurance, utilities, maintenance). The market capitalization rate for comparable prime office properties is 7.0%. What is the Net Operating Income (NOI) and the estimated property value?",
      "options": [
        "NOI = $12.0M, Property Value = $171.4M.",
        "Effective Gross Income = $12M * 0.90 = $10.8M. NOI = $10.8M - $3.8M = $7,000,000. Property Value = $7,000,000 / 0.07 = $100,000,000!",
        "NOI = $8.2M, Property Value = $117.1M.",
        "Property value cannot be determined without tenant credit ratings."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us calculate commercial real estate valuation metrics: 1) Gross Potential Rent = $12,000,000. 2) Less Vacancy & Credit Loss (10%) = -$1,200,000. 3) Effective Gross Income (EGI) = $10,800,000. 4) Less Operating Expenses = -$3,800,000. 5) Net Operating Income (NOI) = $7,000,000. 6) Property Capitalization Value = NOI / Cap Rate = $7,000,000 / 0.07 = $100,000,000. Notice that mortgage interest and depreciation are NOT subtracted when calculating NOI; NOI measures the pure unlevered operating earnings generated by the real estate asset."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of REIT Valuation, FFO & AFFO",
        "type": "concept",
        "description": "Formulate the complete real estate income waterfall: Gross Potential Rent -> EGI -> NOI; derive Funds From Operations FFO = Net Income + Real Estate Depreciation - Gains on Asset Sales; derive Adjusted Funds From Operations (AFFO = FFO - Normalized Maintenance Capex - Straight-Line Rent Adjustments); analyze InvIT concession structures.",
        "rubric": "Detail all line items in the real estate operating statement; derive Net Asset Value (NAV) method for REITs; contrast REIT yield mechanics with traditional dividend stocks."
      },
      {
        "title": "The Commercial Office Cap Rate Expansion Forensic Audit",
        "type": "detective",
        "description": "Audit the post-2022 commercial office real estate distress: analyze how rising interest rates and remote work expanded prime office Cap Rates from 4.0% to 7.5% while NOI fell by 15%; prove mathematically how this dual shock caused a 54.7% collapse in commercial property values, wiping out mezzanine lenders.",
        "rubric": "Calculate property valuation before and after shock; compute percentage loss = [ (NOI_new / Cap_new) - (NOI_old / Cap_old) ] / Value_old; show that debt service coverage ratios breached 1.0x, triggering widespread mortgage handbacks."
      },
      {
        "title": "Hedge Fund Strategy Simulation & Due Diligence Engine",
        "type": "mastery",
        "description": "Build an alternative investment strategy analytics engine in Python: model 4 core hedge fund strategies: Equity Long/Short (with beta hedging), Merger Arbitrage (spread tracking on pending M&A deals), Global Macro, and Multi-Strategy; compute alpha, beta, standard deviation, Sharpe, and maximum drawdown; enforce '2-and-20' fee structures with High-Water Marks and hurdle rates.",
        "rubric": "Implement Merger Arbitrage spread calculation with annualized rate of return; model performance fee waterfall with high-water mark catch-up; generate comparative risk-return charts across market cycles."
      },
      {
        "title": "The Merger Arbitrage Deal Break Risk War Room",
        "type": "incident",
        "description": "Manage an event-driven merger arbitrage crisis: an antitrust regulatory agency files a surprise lawsuit to block a $65B semiconductor acquisition; the target stock crashes from $92 (deal price $95) to $62 overnight; an event-driven fund holds a 12% portfolio position in the target; evaluate deal break probability, legal appeal precedents, and restructure the position to avert a fund liquidation.",
        "rubric": "Calculate market-implied deal completion probability P = (Price_market - Price_unaffected) / (Price_offer - Price_unaffected); evaluate antitrust legal risk and reverse termination break fees ($3B); structure an options collar to hedge remaining downside exposure."
      }
    ]
  },
  {
    "day": 52,
    "month": 2,
    "blockNum": 11,
    "title": "Venture Capital & Startup Valuation: Cap Tables, Dilution & Liquidation Preferences",
    "stageName": "Stage 4: Derivatives, Private Equity, Mergers & Corporate Restructuring",
    "stageNum": 4,
    "pedagogicalRole": "Early-Stage Equity Structuring & Cap Table Physics",
    "spokenGoal": "Valuing early-stage startups with zero revenues is completely different from valuing mature public companies. Traditional DCF fails because cash flows are deeply negative and failure rates exceed 80%. Today, we master Venture Capital (VC) Finance: Pre-Money versus Post-Money Valuation, Capitalization Tables (Cap Tables), and dilution mechanics across successive funding rounds (Seed, Series A, Series B). Crucially, we master Term Sheet Architecture: ESOP pools (unallocated option pool shuffle), Anti-Dilution provisions (Full Ratchet vs Broad-Based Weighted Average), and Liquidation Preferences (1x Non-Participating vs Participating Preferred with Caps)!",
    "conceptInvariant": "Post-Money Valuation Invariant: Post-Money Valuation equals Pre-Money Valuation plus New Capital Invested: Post-Money = Pre-Money + Investment; Investor Ownership Percentage strictly equals Investment / Post-Money; dilution is the mathematical reduction in existing percentage ownership when new shares are issued.",
    "failureMode": "A founder agrees to a $10M Series A investment at a '$40M Pre-Money valuation' without reading the fine print; the VC insisted on a 20% post-closing employee option pool created entirely out of the founder's Pre-Money equity ('The Option Pool Shuffle'); the effective Pre-Money valuation is dragged down from $40M to $30M, quietly diluting the founder by an extra 10% before a dime is invested.",
    "tryItFriction": "Construct a Comprehensive Cap Table & Dilution Engine in Python: model Founder shares, Seed round, Series A, Series B with unallocated option pools; compute share price, pre-money, post-money, and ownership percentages; simulate a down-round and apply Broad-Based Weighted Average anti-dilution adjustments.",
    "socraticHints": [
      "What is the difference between Participating Preferred Stock and Non-Participating Preferred Stock in a liquidation event?",
      "Non-Participating Preferred gets to choose: either take their 1x liquidation preference back OR convert to common stock and share pro-rata in proceeds.",
      "Participating Preferred gets to 'double dip': they collect their 1x liquidation preference first, AND THEN share pro-rata in all remaining proceeds with common shareholders!"
    ],
    "situationalPuzzle": {
      "scenario": "A startup raises a $5M Series A round at a $15M Pre-Money valuation from a VC who insists on 1x Participating Preferred Stock. Common shareholders own the remaining 75% equity. Three years later, the company is sold for $25M in a disappointing exit. How much do the Series A VC and the common shareholders (founders/employees) receive?",
      "options": [
        "VC receives 25% ($6.25M) and common shareholders receive 75% ($18.75M).",
        "The VC takes their $5M liquidation preference first, leaving $20M. Then the VC participates pro-rata in the remaining $20M (25% * $20M = $5M). The VC receives $5M + $5M = $10.0M total (40% of proceeds on a 25% stake)! Common shareholders receive only $15.0M!",
        "VC receives 100% of the proceeds ($25M).",
        "Participating preferred stock is illegal under corporate law."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is the brutal math of Participating Preferred Stock ('Double-Dipping'): 1) Initial proceeds = $25,000,000. 2) Step 1: The Series A investor collects their 1x Liquidation Preference off the top = $5,000,000. 3) Remaining proceeds to distribute = $25,000,000 - $5,000,000 = $20,000,000. 4) Step 2: The Series A investor participates pro-rata in the remaining $20M based on their 25% equity ownership ($5M / $20M post-money): 25% * $20,000,000 = $5,000,000. 5) Total VC Payout = $5,000,000 (pref) + $5,000,000 (participation) = $10,000,000! 6) Common shareholders receive the remaining $15,000,000. Despite owning 25% on paper, the participating preference enabled the VC to capture 40% of total exit value. Founders must fight for 1x Non-Participating Preferred."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of the VC Method & Cap Table Dilution",
        "type": "concept",
        "description": "Formulate the classic Venture Capital Valuation Method: Post-Money = Terminal Value / (1 + Target IRR)^t; derive required ownership fraction; formulate the Broad-Based Weighted Average Anti-Dilution formula CP2 = CP1 * [ (A + B) / (A + C) ] and contrast with Full-Ratchet anti-dilution.",
        "rubric": "Step-by-step mathematical derivation of the VC method; formulate the Broad-Based Weighted Average formula defining common stock equivalents A, B, and C; prove how Full Ratchet punishes founders during down-rounds."
      },
      {
        "title": "The Option Pool Shuffle & Founder Dilution Forensic Audit",
        "type": "detective",
        "description": "Audit a Series A term sheet: prove how a VC firm requiring a '20% post-money unallocated option pool created in the pre-money capitalization' lowered the effective pre-money valuation of a $20M round by $5M, silently reducing founder ownership from 60% to 45% prior to investment.",
        "rubric": "Reconstruct pre- and post-closing capitalization tables; compute the exact effective share price; expose the algebraic trick of forcing option pool dilution exclusively onto existing common shareholders."
      },
      {
        "title": "Institutional Multi-Round Cap Table & Waterfall Engine",
        "type": "mastery",
        "description": "Develop a production-grade Cap Table and Liquidation Waterfall simulator in Python: track Common, Seed SAFE notes with valuation caps and discounts, Series A, Series B, and unallocated ESOPs; execute complex liquidation waterfalls across varying exit valuations ($1M to $500M) incorporating seniority tranches, 1x/2x preferences, and participating vs non-participating conversions.",
        "rubric": "Full multi-round capitalization ledger; automated SAFE note conversion logic; waterfall payout solver determining optimal conversion points for preferred shares; generate publication-grade exit payout distribution charts."
      },
      {
        "title": "The Severe Down-Round Recapitalization War Room",
        "type": "incident",
        "description": "Manage a high-stakes startup financing crisis: a tech company that raised Series B at a $100M valuation faces cash insolvency; an investor offers a $10M Series C at a $25M valuation (a 75% down-round) demanding a 3x Participating Senior Liquidation Preference and Full-Ratchet repricing; quantify the wipeout of existing Series A and founder equity and negotiate a Broad-Based compromise with a management carve-out pool.",
        "rubric": "Model the full-ratchet anti-dilution explosion; calculate dilution to existing shareholders; structure a pay-to-play recapitalization and management retention pool ensuring key employees do not abandon the company."
      }
    ]
  },
  {
    "day": 53,
    "month": 2,
    "blockNum": 11,
    "title": "Leveraged Buyouts (LBO): Capital Tranches, Cash Sweeps & Returns Waterfalls",
    "stageName": "Stage 4: Derivatives, Private Equity, Mergers & Corporate Restructuring",
    "stageNum": 4,
    "pedagogicalRole": "Private Equity Financial Engineering Physics",
    "spokenGoal": "In private equity, the Leveraged Buyout (LBO) is the ultimate financial engineering weapon. A private equity sponsor acquires a mature, cash-generative company using a small sliver of equity (20%-30%) and a massive mountain of debt (70%-80%). Over a 5-year holding period, the company's operating cash flows are swept to pay down the debt. When the sponsor sells the company, they pocket massive equity returns! Today, we master the LBO Capital Structure: Senior Secured Term Loans (First Lien / Second Lien), Mezzanine Subordinated Debt, Sponsor Equity, 100% Cash Sweeps, and the three engines of LBO value creation: Deleveraging (paying down debt), EBITDA Growth (operational expansion), and Multiple Expansion!",
    "conceptInvariant": "LBO Returns Deleveraging Invariant: In an LBO, even if enterprise value remains completely unchanged between acquisition and exit (zero EBITDA growth and zero multiple expansion), equity value expands exponentially as operating cash flows pay down debt: Equity_Exit = Enterprise Value_Exit - Net Debt_Exit; reducing net debt directly transfers enterprise value into sponsor equity.",
    "failureMode": "A private equity associate models an LBO assuming 8.0x leverage on a cyclical manufacturing company with volatile cash flows; when a recession hits in Year 2, EBITDA falls 25%; the company cannot service its senior debt interest, triggering covenant default and handing the keys of the business to credit lenders (Sponsor Equity wiped out to $0).",
    "tryItFriction": "Construct an Institutional 5-Year LBO Model in Python: take purchase price, transaction fees, debt tranches (Revolver, Term Loan A, Term Loan B, Senior Notes), interest margins, and operational EBITDA forecasts; build a dynamic Debt Schedule with an automated 100% Cash Sweep; compute Sponsor IRR and Multiple on Invested Capital (MoIC) across exit multiples.",
    "socraticHints": [
      "What are the two primary metrics private equity sponsors use to evaluate an LBO investment?",
      "Internal Rate of Return (IRR), typically targeting 20% to 25% annualized return.",
      "Multiple on Invested Capital (MoIC), also known as Cash-on-Cash Return: Total Cash Returned / Initial Equity Invested, typically targeting 2.0x to 3.0x."
    ],
    "situationalPuzzle": {
      "scenario": "A PE sponsor acquires a company for $100M (10.0x EBITDA of $10M). The deal is funded with $70M Debt and $30M Sponsor Equity. Over 5 years, EBITDA grows to $15M (+50%). Due to strong cash generation, the company pays down $40M of debt, leaving $30M debt at exit. At Year 5, the sponsor exits at the same 10.0x EBITDA multiple (Exit EV = 10 * $15M = $150M). What is the exit equity value, MoIC, and approximate IRR?",
      "options": [
        "Exit Equity = $50M, MoIC = 1.67x, IRR = 10.8%.",
        "Exit Equity = $150M EV - $30M Remaining Debt = $120M! MoIC = $120M / $30M = 4.0x Cash-on-Cash! IRR = (4.0)^(1/5) - 1 = 31.95%! A 50% EBITDA growth generated a 300% equity return due to debt leverage and deleveraging!",
        "Exit Equity = $80M, MoIC = 2.67x, IRR = 21.7%.",
        "IRR cannot be calculated without intermediate dividends."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us trace the LBO return bridge: 1) Initial Entry: EV = $100M. Debt = $70M. Sponsor Equity = $30M. 2) Operational Performance: EBITDA grows from $10M to $15M. 3) Exit Valuation: EV = 10.0x * $15M EBITDA = $150M. 4) Balance Sheet at Exit: Remaining Debt = $70M initial - $40M paid down = $30M. 5) Exit Equity Value: Equity = Exit EV - Ending Debt = $150M - $30M = $120M! 6) Returns: Multiple on Invested Capital (MoIC) = $120M Exit Equity / $30M Initial Equity = 4.0x. Annualized IRR = (4.0)^(1/5) - 1 = 1.3195 - 1 = 31.95%. Look at the magic of financial engineering: while Enterprise Value grew by 50% ($100M to $150M), Sponsor Equity grew by 300% ($30M to $120M)! Deleveraging and growth compounded equity value."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of LBO Debt Cascades & Returns Decomposition",
        "type": "concept",
        "description": "Formulate the complete mathematical mechanics of an LBO debt waterfall: Senior Term Loans, Mezzanine PIK (Payment-in-Kind) interest, circular interest-cash sweep formulas, and the formal mathematical decomposition of equity return into Deleveraging, EBITDA Growth, Multiple Expansion, and Free Cash Flow Generation.",
        "rubric": "Detail the full LBO returns bridge equation; formulate circular reference resolution for cash sweep interest; prove mathematically how leverage magnifies equity IRR when asset return exceeds the after-tax cost of debt."
      },
      {
        "title": "The Toys 'R' Us Debt Overburden Liquidation Forensic Audit",
        "type": "detective",
        "description": "Audit the 2005 Bain Capital / KKR / Vornado $6.6B leveraged buyout of Toys 'R' Us: analyze how $5.3B in debt burden required $400M+ in annual interest payments, consuming 97% of operating cash flow; prove that the debt burden starved the company of the Capex needed to build an e-commerce platform to compete with Amazon, causing bankruptcy liquidation in 2017.",
        "rubric": "Reconstruct the Toys 'R' Us post-LBO balance sheet; compute interest coverage ratios and Capex starvation metrics; demonstrate how excessive debt leverage destroyed an iconic retail franchise."
      },
      {
        "title": "Full-Stack 5-Year LBO Modeling & Sensitivity Engine",
        "type": "mastery",
        "description": "Develop a comprehensive, institutional-grade LBO model in Python: support multi-tranche debt financing (Revolver with commitment fees, Term Loan B with 1% amortization, Mezzanine Debt with 4% PIK interest, Sponsor Equity); dynamic working capital and Capex schedules; automated 100% cash sweep; 2D sensitivity tables of IRR and MoIC across Exit Multiples (6x to 14x) and Leverage Ratios (3x to 7x).",
        "rubric": "Clean, object-oriented Python LBO architecture; dynamic debt repayment waterfall with seniority covenants; automated returns sensitivity matrices (heatmaps) for sponsor presentation."
      },
      {
        "title": "The Dividend Recapitalization High-Yield Bond War Room",
        "type": "incident",
        "description": "Structure a Private Equity Dividend Recapitalization: at Year 3 of an LBO, the portfolio company has performed strongly; rather than waiting for an exit, the sponsor proposes issuing $200M in new senior secured debt solely to pay a $200M cash dividend to the PE fund, returning 100% of initial equity capital and locking in an infinite downside-protected MoIC; evaluate credit rating impacts, debt covenant compliance, and fiduciary duty to other stakeholders.",
        "rubric": "Model the pro-forma balance sheet post-dividend recap; evaluate fraudulent conveyance legal risks (Insolvency test under corporate law); compute revised debt-to-EBITDA leverage and structure covenant compliance buffers."
      }
    ]
  },
  {
    "day": 54,
    "month": 2,
    "blockNum": 11,
    "title": "Mergers & Acquisitions (M&A) I: Synergies, Accretion/Dilution & Pro-Forma EPS",
    "stageName": "Stage 4: Derivatives, Private Equity, Mergers & Corporate Restructuring",
    "stageNum": 4,
    "pedagogicalRole": "Strategic M&A Architecture & Accretion/Dilution Physics",
    "spokenGoal": "Mergers and Acquisitions represent the largest capital deployment decisions in corporate history. Why do companies acquire other companies? The primary economic justification is Synergy: the classic '2 + 2 = 5' proposition where the combined entity generates higher cash flows than the sum of the two standalone firms. Today, we master M&A Architecture: categorizing Cost Synergies (headcount rationalization, supply chain consolidation) vs Revenue Synergies (cross-selling, pricing power). Crucially, we master Wall Street's primary merger evaluation tool: Accretion/Dilution Analysis. An acquisition is Accretive if pro-forma EPS exceeds the acquirer's standalone EPS, and Dilutive if pro-forma EPS falls!",
    "conceptInvariant": "M&A EPS Accretion Invariant (All-Stock Transaction): In an all-stock acquisition (zero synergies), the transaction is strictly Accretive to the acquirer's EPS if and only if the acquirer's Price-to-Earnings (P/E) multiple is higher than the target's effective acquisition P/E multiple: P/E_acquirer > P/E_target; if a high-P/E company acquires a low-P/E company with stock, EPS increases mechanically without any operational improvement.",
    "failureMode": "A CEO pursues an acquisition solely because it is 'highly accretive to EPS' (acquiring a declining, high-debt commodity firm trading at 6x P/E using the acquirer's 25x stock); post-merger, the market recognizes the deterioration in business quality and contracts the acquirer's P/E multiple from 25x to 12x, erasing $1.2B in shareholder wealth.",
    "tryItFriction": "Build an M&A Accretion/Dilution & Synergy Valuation Engine in Python: take Acquirer and Target income statements, purchase price, premium paid, synergies, transaction fees, and financing mix (cash, new debt, new stock); compute pro-forma combined net income, new share count, pro-forma EPS, and accretion/dilution percentage.",
    "socraticHints": [
      "Why are Cost Synergies given much higher credibility by Wall Street analysts than Revenue Synergies?",
      "Because cost synergies (e.g., closing redundant offices, consolidating IT systems) are directly under management's internal operational control.",
      "Revenue synergies depend on customer behavior (e.g., cross-selling), which is speculative, harder to execute, and frequently fails to materialize."
    ],
    "situationalPuzzle": {
      "scenario": "Acquirer A has 10,000,000 shares trading at $50/share (Market Cap = $500M) and Net Income of $25M (EPS = $2.50, P/E = 20.0x). Target T has Net Income of $10M. Acquirer A offers to acquire Target T for $150M (Acquisition P/E = 15.0x) funded 100% with newly issued Acquirer stock at $50/share (New shares issued = $150M / $50 = 3,000,000 shares). Zero synergies. Is the transaction accretive or dilutive, and what is the new pro-forma EPS?",
      "options": [
        "Dilutive because 3,000,000 new shares were issued.",
        "Accretive! Combined Net Income = $25M + $10M = $35M. Total combined shares = 10M + 3M = 13,000,000. New Pro-Forma EPS = $35M / 13M = $2.69 per share (+7.6% Accretion)! The deal is accretive because Acquirer P/E (20x) exceeds Target acquisition P/E (15x)!",
        "Breakeven; EPS remains $2.50.",
        "M&A transactions cannot be completed without debt financing."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us verify the all-stock P/E rule: Acquirer P/E is 20.0x ($50 / $2.50). Target acquisition P/E is $150M / $10M = 15.0x. Because Acquirer P/E (20x) > Target P/E (15x), the deal is mathematically guaranteed to be accretive! Let us verify with pro-forma math: Combined Net Income = $25,000,000 + $10,000,000 = $35,000,000. New shares issued = $150,000,000 purchase price / $50 share price = 3,000,000 shares. Total pro-forma shares = 10,000,000 existing + 3,000,000 new = 13,000,000 shares. Pro-Forma EPS = $35,000,000 / 13,000,000 = $2.6923 per share. Standalone EPS was $2.50. Accretion = ($2.6923 - $2.50) / $2.50 = +7.69% accretion! Buying a lower-multiple target with higher-multiple stock mechanically inflates EPS."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of M&A Accretion/Dilution & Cost of Capital",
        "type": "concept",
        "description": "Derive the mathematical conditions for EPS accretion across All-Stock, All-Cash, and All-Debt transactions; derive the Cost of Cash (After-tax forgone interest), Cost of Debt (After-tax interest), and Cost of Stock (Inverse of P/E = E/P); prove why comparing Target Earnings Yield (E_T / P_T) to the Cost of Acquisition Financing dictates accretion.",
        "rubric": "Step-by-step mathematical derivation of accretion boundaries; define the weighted cost of acquisition financing; prove that cash/debt deals are accretive whenever Target E/P > After-tax borrowing cost."
      },
      {
        "title": "The AOL Time Warner Megamerger Synergy Hallucination Forensic Audit",
        "type": "detective",
        "description": "Audit the 2000 $165B AOL Time Warner merger (the largest M&A disaster in corporate history): analyze how investment bankers projected $1B+ in immediate digital cross-media revenue synergies that completely failed to materialize; demonstrate how cultural clashes, dot-com ad collapses, and goodwill write-downs resulted in a historic $99B net loss in 2002.",
        "rubric": "Decompose projected synergies vs realized performance; analyze goodwill impairment mechanics under accounting rules; quantify the destruction of shareholder value."
      },
      {
        "title": "Comprehensive M&A Merger Model & Synergy Engine",
        "type": "mastery",
        "description": "Develop an institutional M&A financial model in Python: support variable purchase consideration (percentage cash, debt, stock); model pre-tax cost and revenue synergies with multi-year phase-in ramps and integration costs; account for transaction fees, write-up of tangible assets, and new goodwill creation; output full pro-forma combined income statement, balance sheet, and EPS accretion/dilution sensitivity table.",
        "rubric": "Full 3-statement pro-forma consolidation; balance sheet purchase price allocation (PPA) with goodwill calculation; generate 2D sensitivity matrix of EPS accretion across purchase premium and synergy realization."
      },
      {
        "title": "The Goodwill Impairment Audit Committee War Room",
        "type": "incident",
        "description": "Handle an executive accounting crisis: three years after an aggressive $5B cross-border acquisition, the target's operating performance has severely deteriorated; the external auditor informs the Audit Committee that a qualitative and quantitative goodwill impairment test under ASC 350 / Ind AS 36 requires a mandatory $1.8B non-cash goodwill write-down; evaluate the impact on reported net worth, debt covenants, and communicate the impairment to public markets.",
        "rubric": "Apply the 2-step goodwill impairment test; calculate implied fair value of reporting unit; determine covenant headroom (e.g., debt-to-tangible-net-worth covenants); draft an executive communication strategy reassuring credit rating agencies."
      }
    ]
  },
  {
    "day": 55,
    "month": 2,
    "blockNum": 11,
    "title": "Mergers & Acquisitions (M&A) II: Deal Structuring, Collars & Hostile Takeover Defense",
    "stageName": "Stage 4: Derivatives, Private Equity, Mergers & Corporate Restructuring",
    "stageNum": 4,
    "pedagogicalRole": "Deal Architecture & Corporate Takeover Warfare Physics",
    "spokenGoal": "How a deal is structured is just as important as the purchase price. Today, we master Advanced M&A Deal Structuring: Cash Consideration (immediate tax event for target shareholders, debt burden for acquirer) versus Stock Consideration (tax-free reorganization, sharing of post-merger risk). In stock transactions, what happens if the acquirer's stock price fluctuates wildly between deal signing and closing? We master Floating Exchange Ratios, Fixed Exchange Ratios, and Collars (Caps and Floors) that protect both parties. Finally, we step into the battlefield of Hostile Takeovers: mastering the Poison Pill (Shareholder Rights Plan), Staggered Boards, White Knights, Pac-Man Defenses, and Crown Jewel sales!",
    "conceptInvariant": "M&A Collar Risk Allocation Invariant: In a stock merger, a Fixed Exchange Ratio places stock price risk entirely on target shareholders (deal value fluctuates), while a Floating Exchange Ratio places dilution risk entirely on the acquirer (share issuance fluctuates); an Exchange Ratio Collar with caps and floors establishes a bounded risk-sharing corridor between both parties.",
    "failureMode": "An acquirer signs a fixed-value floating exchange ratio stock merger without a cap collar; between signing and closing, an unrelated scandal causes the acquirer's stock price to drop 50%; to deliver the promised dollar value, the acquirer is legally forced to issue double the expected shares, diluting existing shareholders by 45% and losing voting control of the company.",
    "tryItFriction": "Build an M&A Exchange Ratio Collar & Hostile Defense Simulator in Python: take Acquirer stock price paths; model Fixed Exchange Ratio, Floating Exchange Ratio, and Fixed-Value Collar with caps and floors; compute implied deal value and shares issued; simulate a hostile tender offer and trigger a 'Flip-In' Poison Pill dilution defense.",
    "socraticHints": [
      "How does a 'Flip-In' Poison Pill (Shareholder Rights Plan) stop a hostile acquirer?",
      "When a hostile bidder acquires more than a trigger threshold (e.g., 15% of shares), the rights become exercisable for all shareholders EXCEPT the hostile bidder.",
      "All other shareholders are permitted to buy newly issued company shares at a massive 50% discount, catastrophically diluting the hostile bidder's ownership percentage and making the takeover prohibitively expensive."
    ],
    "situationalPuzzle": {
      "scenario": "Acquirer A agrees to acquire Target T. At signing, Acquirer stock trades at $50/share. The merger agreement sets a Collar: Target shareholders receive $50 of value per share, provided Acquirer stock remains between $45 (Floor) and $55 (Cap). If Acquirer stock is within the collar, the exchange ratio floats to guarantee $50 value. If Acquirer stock rises above $55, exchange ratio fixes at 50/55 = 0.9091. If Acquirer stock drops below $45, exchange ratio fixes at 50/45 = 1.1111. At closing, Acquirer stock crashes to $35. How many shares does a Target shareholder receive, and what is the effective deal value received?",
      "options": [
        "Target shareholder receives 1.428 shares worth $50.00.",
        "The price fell below the $45 floor, so the exchange ratio locks at the floor ratio of 1.1111 shares! At $35/share, the target shareholder receives 1.1111 * $35 = $38.89 in effective value! The collar protected the acquirer from unlimited dilution while target shareholders bore downside below $45!",
        "Target shareholder receives 1.0 share worth $35.00.",
        "The merger is automatically canceled if stock drops below the floor."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is the exact mechanics of a Fixed-Value Collar with bounds [$45, $55]: 1) If Acquirer stock is between $45 and $55, the exchange ratio floats: Ratio = $50 / P_acquirer, guaranteeing exactly $50 in value. 2) If Acquirer stock falls below the floor of $45 (here, P = $35), the exchange ratio fixes at the floor limit: Ratio = $50 / $45 = 1.1111 shares. 3) Payout: Each target share receives 1.1111 Acquirer shares. At market price $35, the effective deal value is 1.1111 * $35 = $38.89. The acquirer's dilution is capped at 1.1111 shares per target share, preventing the catastrophic share count explosion that would have occurred without a collar ($50 / $35 = 1.4286 shares)."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of M&A Collars & Earnout Structures",
        "type": "concept",
        "description": "Formulate the payoff equations for Fixed Exchange Ratios, Floating Exchange Ratios, and Collars (Collars on Exchange Ratio vs Collars on Value); derive the Black-Scholes valuation of an M&A collar as a combination of options; formulate Earnout milestone contingent valuation rights (CVRs).",
        "rubric": "Graph exchange ratio and deal value profiles across acquirer stock price; show how a collar decomposes into a long put and short call; derive CVR expected present value under risk-neutral clinical/operational milestones."
      },
      {
        "title": "The Poison Pill Hostile Takeover Battle Forensic Audit",
        "type": "detective",
        "description": "Audit famous corporate takeover battles (e.g., Oracle vs PeopleSoft, Twitter vs Elon Musk): analyze how the board adopted a Shareholder Rights Plan with a 15% trigger; calculate the exact percentage dilution inflicted on the hostile bidder if the pill is triggered, proving why no hostile acquirer has ever triggered a poison pill in financial history.",
        "rubric": "Reconstruct the mathematical dilution of a Flip-In rights plan; compute post-trigger share counts and ownership collapse; explain the legal standards of board review (Unocal enhanced scrutiny and Revlon duties)."
      },
      {
        "title": "M&A Collar Structuring & Hostile Defense Simulation Engine",
        "type": "mastery",
        "description": "Build an enterprise deal structuring and defense platform in Python: model collar corridors with custom floors, caps, and walk-away termination rights; compute pro-forma ownership dilution under stochastic post-announcement price paths; simulate a hostile tender offer and model poison pill dilution matrices and Pac-Man counter-tenders.",
        "rubric": "Interactive Monte Carlo simulation of stock prices between signing and closing; automated collar settlement calculator; poison pill dilution table outputting bidder ownership before and after rights exercise."
      },
      {
        "title": "The MAC Clause Material Adverse Effect Litigation War Room",
        "type": "incident",
        "description": "Handle a broken M&A transaction dispute: following a severe macroeconomic shock between signing and closing, an acquirer attempts to walk away from a $12B merger citing the Material Adverse Change (MAC / MAE) clause; the target sues for specific performance in Delaware Chancery Court to force closing; evaluate legal precedents (Tyson Foods/IBP, Akorn/Fresenius) and negotiate an emergency price discount settlement.",
        "rubric": "Analyze Delaware legal standards for MAE (durationally significant impairment of target earning power not affecting the broader industry); evaluate litigation risk and specific performance probabilities; structure a renegotiated price compromise that preserves deal value."
      }
    ]
  },
  {
    "day": 56,
    "month": 2,
    "blockNum": 12,
    "title": "Corporate Restructuring: Spin-Offs, Carve-Outs & Insolvency Resolution (IBC / Ch. 11)",
    "stageName": "Stage 4: Derivatives, Private Equity, Mergers & Corporate Restructuring",
    "stageNum": 4,
    "pedagogicalRole": "Corporate Divestitures & Distress Reorganization Physics",
    "spokenGoal": "Sometimes corporations create more value by breaking apart than by staying together. Conglomerates frequently suffer a 'Conglomerate Discount' where the market values the diversified entity at 10% to 20% less than the sum of its individual standalone parts (Sum-of-the-Parts SOTP valuation). Today, we master Corporate Restructuring: Spin-offs (pro-rata distribution of subsidiary shares to existing shareholders, tax-free), Equity Carve-outs (IPO of a minority subsidiary stake to raise cash), Split-offs, and Tracking Stocks. On the distressed side, we master the mechanics of Corporate Insolvency: Chapter 11 in the US and the Insolvency and Bankruptcy Code (IBC 2016 / CIRP) in India—navigating Debtor-in-Possession (DIP) financing, automatic stays, and the Absolute Priority Rule!",
    "conceptInvariant": "Absolute Priority Rule Invariant: In bankruptcy reorganization and liquidation, senior claims must be paid 100% in full before any junior claimant receives a single dollar: Secured Creditors > DIP Lenders > Administrative Costs > Unsecured Creditors > Subordinated Debt > Preferred Equity > Common Equity; common equity is wiped out to zero unless all senior debt is fully satisfied.",
    "failureMode": "A conglomerate management team resists activist pressure to spin off its fast-growing cloud software subsidiary, keeping it shackled to a declining legacy hardware business; the combined entity trades at a 30% conglomerate discount; an activist wins a proxy contest, forces the tax-free spin-off, and unlocks $8.5B in market value on day one.",
    "tryItFriction": "Build a Sum-of-the-Parts (SOTP) & Bankruptcy Recovery Waterfall Engine in Python: take segmental financials of a diversified conglomerate; value each division using pure-play peer multiples; quantify the conglomerate discount; model a distressed liquidation and allocate asset recovery cash strictly following the Absolute Priority Rule.",
    "socraticHints": [
      "What is the key structural difference between a Spin-off and an Equity Carve-out?",
      "In a Spin-off, 100% of subsidiary shares are distributed to existing shareholders pro-rata; NO cash enters the corporate treasury.",
      "In an Equity Carve-out, the parent sells a minority stake (e.g., 20%) in the subsidiary to public investors via an IPO, raising hard cash for the parent company."
    ],
    "situationalPuzzle": {
      "scenario": "A distressed enterprise enters Chapter 11 bankruptcy liquidation with $120M in total liquidated asset proceeds. Outstanding claims are: 1) Secured Bank Debt = $80M; 2) Administrative & Legal Fees = $10M; 3) Senior Unsecured Bonds = $50M; 4) Subordinated Notes = $20M; 5) Common Equity = $50M book value. Under the Absolute Priority Rule, how are the $120M in proceeds distributed?",
      "options": [
        "All claimants receive an equal 40% pro-rata haircut on their claims.",
        "Secured Debt receives $80M (100% full recovery). Administrative Fees receive $10M (100% full recovery). Remaining proceeds = $30M. Senior Unsecured Bonds ($50M claim) receive the entire remaining $30M (60% recovery). Subordinated Notes receive $0.00 (0% recovery). Common Equity receives $0.00 (100% wipeout)!",
        "Common Equity receives $10M to ensure fair reorganization.",
        "Subordinated notes are paid before unsecured bonds."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. The Absolute Priority Rule governs bankruptcy waterfalls with absolute legal rigidity: 1) Total cash available = $120M. 2) Secured Debt has first lien on assets: receives $80M in full ($40M remaining). 3) Administrative & Bankruptcy Professional Fees have statutory priority: receive $10M in full ($30M remaining). 4) Senior Unsecured Bonds hold a $50M claim; since only $30M remains, they receive all $30M (a 60% recovery rate, taking a $20M haircut). 5) Because Senior Unsecured was not paid 100% in full, all junior classes receive EXACTLY ZERO: Subordinated Notes receive $0.00 (0% recovery) and Common Equity receives $0.00 (wiped out to zero). Junior claims cannot receive a penny until seniors are made whole."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of Sum-of-the-Parts (SOTP) Valuation & Divestitures",
        "type": "concept",
        "description": "Formulate Sum-of-the-Parts (SOTP) valuation: Enterprise Value = sum(Segment_EBITDA_i * Multiple_i) - Corporate Overhead PV; derive tax-free spin-off rules (IRC Section 355 / Indian IT Act Section 2(19AA) demerger conditions); contrast spin-offs, carve-outs, and split-offs.",
        "rubric": "Formulate SOTP bridge equations; detail tax-free demerger criteria (continuity of business, pro-rata share issuance); explain the economic causes of the conglomerate discount (asymmetric information, agency costs, inefficient internal capital markets)."
      },
      {
        "title": "The Indian Insolvency & Bankruptcy Code (IBC 2016) Forensic Audit",
        "type": "detective",
        "description": "Audit the landmark IBC CIRP resolution of Bhushan Steel / Essar Steel: trace how $8B+ in non-performing loans were resolved through the Committee of Creditors (CoC); analyze Section 29A disqualification of defaulting promoters; prove how ArcelorMittal's approved resolution plan distributed cash according to the waterfall, delivering an 82% recovery for financial creditors.",
        "rubric": "Detail the 330-day CIRP statutory timeline; analyze the voting thresholds of the Committee of Creditors (66% majority); explain how IBC eliminated the promoter holdout problem and restored credit discipline."
      },
      {
        "title": "Comprehensive Bankruptcy Liquidation Waterfall & Reorganization Engine",
        "type": "mastery",
        "description": "Build an enterprise insolvency waterfall simulator in Python: ingest multi-tier capital structures (DIP financing, First Lien, Second Lien, Unsecured Trade Creditors, Tax Claims, Subordinated Notes, Preferred Stock, Common Equity); execute recovery distributions under varying asset liquidation proceeds; compute recovery percentages, haircuts, and restructuring equity allocations.",
        "rubric": "Strict adherence to the Absolute Priority Rule waterfall; handle deficiency claims for under-secured creditors; output institutional recovery schedules with graphical waterfall bar charts."
      },
      {
        "title": "The Distressed Pre-Packaged Chapter 11 Reorganization War Room",
        "type": "incident",
        "description": "Lead the restructuring of an enterprise carrying $1.5B in unsustainable debt: operational EBITDA is positive ($120M), but interest expense is $180M; negotiate a Pre-Packaged Chapter 11 plan with 85% of bondholders: cancel $1B in unsecured debt in exchange for 90% of reorganized equity, provide a $150M DIP facility, and leave trade vendors unimpaired; preserve 10,000 corporate jobs and emergence from bankruptcy in 45 days.",
        "rubric": "Structure the restructuring support agreement (RSA); model pro-forma deleveraged balance sheet; draft the confirmation plan feasibility defense proving the company will not liquidate after emergence."
      }
    ]
  },
  {
    "day": 57,
    "month": 2,
    "blockNum": 12,
    "title": "Enterprise Financial Risk Governance: Value at Risk (VaR), CVaR & Basel III",
    "stageName": "Stage 4: Derivatives, Private Equity, Mergers & Corporate Restructuring",
    "stageNum": 4,
    "pedagogicalRole": "Enterprise Risk Governance & Extreme Tail Risk Physics",
    "spokenGoal": "How much can a financial institution lose on a terrible day? In the 1990s, JP Morgan Chairman Dennis Weatherstone demanded the famous '4:15 PM Report': a single sheet of paper summarizing the firm's total market risk across the entire world over the next 24 hours. This birthed Value at Risk (VaR). VaR measures the maximum expected loss over a specific time horizon at a given confidence level: P(Loss > VaR) = 1 - alpha. Today, we master the three primary methods of VaR: Parametric (Variance-Covariance), Historical Simulation, and Monte Carlo VaR. Crucially, we master Expected Shortfall (CVaR / Conditional VaR)—which measures the expected loss GIVEN that VaR has been breached, curing VaR's blind spot to catastrophic tail fatness!",
    "conceptInvariant": "Coherent Risk Measure Subadditivity Invariant: A risk measure rho is Coherent if it satisfies Monotonicity, Translation Invariance, Positive Homogeneity, and Subadditivity: rho(X + Y) <= rho(X) + rho(Y); Value at Risk fails subadditivity for non-normal fat-tailed distributions (merging portfolios can increase VaR!), while Expected Shortfall (CVaR) is mathematically proven to be a Coherent Risk Measure.",
    "failureMode": "A commercial bank uses a 99% 1-day Parametric Normal VaR of $25M; because it assumes a Gaussian bell curve, it assigns a near-zero probability to a 4-sigma market shock; during a liquidity crisis, a 5-sigma shock hits and the bank loses $180M in a single afternoon—more than 7 times its stated VaR limit—triggering regulatory sanction.",
    "tryItFriction": "Construct an Institutional Risk Governance & VaR Engine in Python: take a multi-asset portfolio of stocks and bonds; compute 1-day and 10-day VaR at 95% and 99% confidence using Parametric (Variance-Covariance), Historical Simulation, and Monte Carlo methods; compute Expected Shortfall (CVaR); backtest VaR against historical returns using Kupiec's POF test.",
    "socraticHints": [
      "Why is Value at Risk (VaR) criticized for being blind to tail risk?",
      "Because VaR tells you only the threshold loss that will be exceeded with probability 1 - alpha, but says NOTHING about how bad the loss will be once you breach that threshold.",
      "A portfolio with a $10M VaR could have a maximum tail loss of $11M or $500M; VaR cannot distinguish between the two. Expected Shortfall (CVaR) averages all losses in the tail beyond VaR."
    ],
    "situationalPuzzle": {
      "scenario": "A portfolio has a daily expected return of 0.0% and daily standard deviation of $2,000,000. Assuming a normal distribution (Z_0.95 = 1.645, Z_0.99 = 2.326): 1) What is the 1-day 95% Parametric VaR? 2) Using the Square Root of Time rule, what is the 10-day 99% regulatory Basel VaR for this portfolio?",
      "options": [
        "1-day VaR = $2.0M, 10-day VaR = $20.0M.",
        "1-day 95% VaR = 1.645 * $2.0M = $3,290,000. 1-day 99% VaR = 2.326 * $2.0M = $4,652,000. 10-day 99% Basel VaR = $4,652,000 * sqrt(10) = $4,652,000 * 3.1623 = $14,711,000!",
        "1-day VaR = $1.0M, 10-day VaR = $10.0M.",
        "VaR cannot be scaled across time using square root of time."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us calculate Parametric VaR step-by-step: 1) 1-Day 95% VaR: For a standard normal distribution, 95% confidence corresponds to Z = 1.645. VaR_95% = Z * sigma = 1.645 * $2,000,000 = $3,290,000. This means on 95 out of 100 trading days, the daily loss will not exceed $3.29M. 2) 1-Day 99% VaR: At 99% confidence, Z = 2.326. VaR_99% = 2.326 * $2,000,000 = $4,652,000. 3) 10-Day Basel Regulatory Scaling: Under the assumption of independent and identically distributed daily returns, risk scales with the square root of time: 10-Day VaR = 1-Day VaR * sqrt(10) = $4,652,000 * 3.16228 = $14,711,000. Basel III banking regulations mandate holding capital proportional to 10-day 99% VaR."
    },
    "quests": [
      {
        "title": "Mathematical Foundations of VaR, CVaR & Coherent Risk Measures",
        "type": "concept",
        "description": "Formulate Parametric VaR, Historical Simulation VaR, and Monte Carlo VaR; prove mathematically why VaR violates the subadditivity axiom of Artzner et al. (1999) Coherent Risk Measures; derive Expected Shortfall CVaR = (1 / (1 - alpha)) * int_{alpha}^1 VaR_u du and prove its coherence.",
        "rubric": "Detail mathematical definitions of all 3 VaR methodologies; construct numerical counterexample proving VaR(A + B) > VaR(A) + VaR(B) for digital options; derive CVaR as the conditional expectation E[Loss | Loss > VaR]."
      },
      {
        "title": "The London Whale J.P. Morgan VaR Model Tweak Forensic Audit",
        "type": "detective",
        "description": "Audit the 2012 J.P. Morgan 'London Whale' $6.2B trading loss: analyze how the Chief Investment Office switched to a new internal VaR model that artificially cut stated portfolio VaR in half by dividing by the sum of absolute returns rather than variance; trace how spreadsheet modeling errors masked massive credit derivative tail risks until the position exploded.",
        "rubric": "Analyze the flawed VaR model spreadsheet mechanics; evaluate the regulatory Senate investigation findings; demonstrate how model manipulation permitted traders to build an unhedged $150B synthetic credit default swap index position."
      },
      {
        "title": "Institutional Multi-Method VaR & CVaR Risk Governance Suite",
        "type": "mastery",
        "description": "Develop an enterprise market risk engine in Python: accept multi-asset portfolio holdings and historical prices; compute daily and multi-day Parametric VaR, Historical Simulation VaR with age-weighted decay factors (Boudoukh et al.), and Monte Carlo VaR with Student-t fat-tailed innovations; compute Expected Shortfall (CVaR); run automated Kupiec and Christoffersen backtests.",
        "rubric": "Implement all 3 VaR methods plus CVaR; incorporate non-normal fat-tailed distributions; code Kupiec Proportion of Failures likelihood ratio test checking for statistical model validity; output an executive risk dashboard."
      },
      {
        "title": "The Basel III Capital Adequacy Stress-Testing War Room",
        "type": "incident",
        "description": "Lead an annual Comprehensive Capital Analysis and Review (CCAR) / Basel III stress test for a commercial bank: regulators project a 'Severely Adverse' macroeconomic scenario (unemployment spikes to 10%, GDP contracts 6%, commercial real estate drops 35%); evaluate Risk-Weighted Assets (RWA), project credit losses and trading losses, and verify whether the bank's Common Equity Tier 1 (CET1) ratio remains above the mandatory 7.0% threshold.",
        "rubric": "Calculate RWA across credit, market, and operational risk; model loan loss provisioning under IFRS 9 / CECL; calculate post-stress CET1 ratio and formulate capital conservation measures (pausing buybacks and reducing dividends) to pass the regulatory stress test."
      }
    ]
  },
  {
    "day": 58,
    "month": 2,
    "blockNum": 12,
    "title": "Financial Forensic Post-Mortems: Enron, LTCM, Lehman Brothers & SVB",
    "stageName": "Stage 4: Derivatives, Private Equity, Mergers & Corporate Restructuring",
    "stageNum": 4,
    "pedagogicalRole": "Historical Catastrophe Forensics & Systemic Fragility Physics",
    "spokenGoal": "Those who cannot remember the past are condemned to repeat it on Wall Street. Today, we conduct deep forensic post-mortems on the four greatest financial catastrophes of modern times: 1) Enron (2001) — off-balance-sheet Special Purpose Entities (SPEs like Chewco and LJM) and abusive mark-to-market accounting on non-existent energy trades; 2) Long-Term Capital Management (LTCM 1998) — two Nobel laureates levered 250-to-1 in relative value arbitrage blown up by a Russian sovereign default; 3) Lehman Brothers (2008) — financing subprime illiquid assets with overnight repo and hiding $50B in debt via Repo 105 accounting trickery; and 4) Silicon Valley Bank (2023) — classic asset-liability duration mismatch hiding $15B in unrealized bond losses in Held-to-Maturity portfolios until a social-media-fueled bank run triggered collapse in 36 hours.",
    "conceptInvariant": "Systemic Financial Fragility Invariant: Financial crises do not occur from bad luck; they occur from the lethal confluence of three structural design flaws: 1) Extreme leverage masking low-margin arbitrage; 2) Asset-Liability duration and liquidity mismatch; and 3) Accounting opacity that conceals economic reality until confidence evaporates.",
    "failureMode": "A corporate treasury emulates Lehman Brothers' pre-crisis liquidity model, relying on short-term overnight commercial paper to fund 5-year equipment investments; when credit markets experience a brief 48-hour freeze, the commercial paper cannot be rolled over, forcing an otherwise profitable operating enterprise into emergency bankruptcy.",
    "tryItFriction": "Construct a Financial Forensic Fragility Detector in Python: take historical financial statement telemetry from Enron, Lehman Brothers, and SVB; compute the Beneish M-Score for earnings manipulation, the Altman Z-Score for distress, the Net Stable Funding Ratio (NSFR), and duration mismatch gaps; verify that the detector flags all three institutions as catastrophic risks prior to collapse.",
    "socraticHints": [
      "What was Lehman Brothers' infamous 'Repo 105' accounting maneuver?",
      "At quarter-end, Lehman transferred $50B in securities to European banks under short-term repurchase agreements, but booked them as 'sales' rather than secured loans.",
      "This temporarily removed $50B of debt from the balance sheet, lowering stated net leverage from 32x to 29x for the earnings release, only to unwind the trade days later."
    ],
    "situationalPuzzle": {
      "scenario": "A financial forensic team evaluates a trading fund that generated steady 2.5% monthly returns for 3 years with zero down months. Balance sheet shows: Total Assets = $10B, Equity = $40M (Leverage = 250x!). The fund's primary strategy is buying slightly undervalued off-the-run Treasury bonds and shorting on-the-run Treasuries to capture a 3 basis point spread. What is the fundamental vulnerability of this business model?",
      "options": [
        "The model is risk-free because US Treasuries carry zero default risk.",
        "Extreme leverage fragility (LTCM model)! With 250x leverage, a tiny adverse move of just 0.40% in bond spreads (1 / 250) completely WIPES OUT 100% OF EQUITY CAPITAL! The fund is picking up pennies in front of a steamroller!",
        "The fund will be closed by regulators for high profits.",
        "Treasury spreads can never diverge during macro shocks."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is the exact autopsy of Long-Term Capital Management (1998). LTCM had $4.7B in equity supporting $125B in balance sheet assets (plus over $1.25 Trillion in off-balance-sheet derivatives!). Because arbitrage spreads on relative-value trades are microscopic (e.g., 3 to 10 basis points), the fund had to lever up 30x to 250x to generate 20%+ equity returns. At 250x leverage: Equity / Assets = 1 / 250 = 0.40%. A microscopic asset price move of just 40 basis points consumes the entire equity cushion! When Russia defaulted on its ruble debt in August 1998, global investors panicked into liquid on-the-run Treasuries and dumped illiquid off-the-run bonds. Spreads widened instead of converging; LTCM lost $4B in weeks and required an emergency Federal Reserve-brokered Wall Street bailout."
    },
    "quests": [
      {
        "title": "Forensic Accounting Mechanics of Beneish M-Score & SPE De-Consolidation",
        "type": "concept",
        "description": "Formulate Messod Beneish's 8-variable M-Score model for forensic earnings manipulation detection; derive the mathematical mechanics of Special Purpose Entity (SPE) non-consolidation rules (the historical 3% independent equity rule abused by Enron); prove how mark-to-market accounting on illiquid contracts created phantom earnings.",
        "rubric": "Detail all 8 financial ratios in the Beneish M-Score (DSRI, GMI, AQI, SGI, DEPI, SGAI, LVGI, TATA); explain how M-Score > -1.78 flags earnings manipulation; dissect Enron's Fastow Chewco transactions."
      },
      {
        "title": "Lehman Brothers Repo 105 & Off-Balance-Sheet Deleveraging Forensic Audit",
        "type": "detective",
        "description": "Audit the Anton Valukas Examiner's Report on Lehman Brothers: analyze how Lehman utilized SFAS 140 accounting loopholes to treat standard 102% repo financings as 'true sales' (Repo 105 and Repo 108); trace how $50B in debt was systematically removed from balance sheets at Q1 2008 and Q2 2008 reporting dates and repurchased 48 hours later.",
        "rubric": "Reconstruct the journal entries of a Repo 105 transaction; calculate the synthetic leverage reduction; demonstrate how the maneuver concealed the firm's true commercial paper dependence from rating agencies."
      },
      {
        "title": "Automated Financial Forensic & Fragility Screening Engine",
        "type": "mastery",
        "description": "Build an enterprise forensic risk scoring system in Python: accept multi-year balance sheets, income statements, and cash flow statements; compute Beneish M-Score, Altman Z-Score, Sloan Accrual Anomaly Ratio, Cash-to-Income Divergence, and Duration Gap Mismatch; output an automated institutional forensic audit report with traffic-light fraud risk alerts.",
        "rubric": "Implement all 8 Beneish ratios, Altman Z-score, and Sloan accruals; compute statistical percentile rankings against historical forensic failure databases; generate a comprehensive diagnostic PDF/HTML report."
      },
      {
        "title": "The Run-on-the-Bank Social Media Liquidity War Room",
        "type": "incident",
        "description": "Analyze the real-time dynamics of the March 9-10, 2023 Silicon Valley Bank run: trace how $42B in deposits were withdrawn via digital banking apps in a single 10-hour business day after venture capitalists tweeted warnings; quantify the speed of modern digital bank runs compared to the 1930s; design the regulatory and treasury liquidity buffers (100% collateralized discount window access) required to survive 21st-century digital runs.",
        "rubric": "Model deposit outflow velocity and collateral encumbrance; contrast traditional sticky retail deposits with concentrated, uninsured venture deposits; formulate real-time liquidity contingency plans."
      }
    ]
  },
  {
    "day": 59,
    "month": 2,
    "blockNum": 12,
    "title": "Chief Investment Officer (CIO) / Treasury Director RFC: Strategic Asset Allocation",
    "stageName": "Stage 4: Derivatives, Private Equity, Mergers & Corporate Restructuring",
    "stageNum": 4,
    "pedagogicalRole": "Institutional CIO RFC & Enterprise Investment Policy Physics",
    "spokenGoal": "As a Chief Investment Officer (CIO) or Corporate Treasury Director, you do not just run individual models—you author the grand governing policies of the enterprise. Today, you author an institutional-grade Request for Comments (RFC): The Enterprise Strategic Asset Allocation & Dynamic Hedging Policy! You will establish the Investment Policy Statement (IPS) governing a multi-billion-dollar portfolio: defining return objectives, risk tolerance bounds, liquidity constraints, tax considerations, and regulatory mandates. You will structure a Liability-Driven Investment (LDI) framework, define rebalancing bandwidths, and establish the counterparty risk parameters that protect the institution for decades.",
    "conceptInvariant": "Investment Policy Governance Invariant: A sound institutional Investment Policy Statement (IPS) must explicitly define the strategic boundary conditions: Return Objective, Risk Tolerance (maximum drawdown), Time Horizon, Liquidity Constraints, Tax Considerations, and Legal/Regulatory Mandates; decisions made during market crises must adhere strictly to predetermined IPS rules to eliminate behavioral panic.",
    "failureMode": "An endowment CIO operates without a formal Investment Policy Statement (IPS) rebalancing mandate; during a 40% equity market crash, the CIO panics and liquidates equities at the market bottom to 'preserve cash'; the fund misses the entire multi-year recovery rally, permanently impairing the university's operating budget by $120M.",
    "tryItFriction": "Draft and Validate the Institutional CIO RFC: create a formal technical specification for an enterprise asset allocation policy; define target asset weights, tactical asset allocation (TAA) ranges, rebalancing triggers (calendar vs percentage-of-portfolio corridor rebalancing), interest rate hedging mandates, and stress-test governance protocols in an executable Python policy validator.",
    "socraticHints": [
      "What is the difference between Strategic Asset Allocation (SAA) and Tactical Asset Allocation (TAA)?",
      "Strategic Asset Allocation (SAA) is the long-term target asset mix designed to meet the investor's core objectives over decades.",
      "Tactical Asset Allocation (TAA) allows short-term deviations within strict pre-approved corridors to exploit temporary market mispricings without altering the fundamental risk profile."
    ],
    "situationalPuzzle": {
      "scenario": "An institutional pension fund with $5B in assets operates an SAA target of 60% Equities / 40% Bonds with a +/- 5% rebalancing corridor. Following a massive stock market rally, equities surge to 68% of the portfolio ($3.4B) and bonds fall to 32% ($1.6B). The equity market is in a bullish euphoria. What does institutional governance mandate the CIO to do?",
      "options": [
        "Let equities run to 80% because momentum is positive.",
        "The equity allocation (68%) breaches the maximum upper corridor (60% + 5% = 65%). Governance MANDATES disciplined rebalancing: sell $400M of equities and buy $400M of bonds to restore the portfolio to its 60/40 target, locking in equity gains and preserving risk governance!",
        "Sell all bonds and buy tech stocks.",
        "Corridor rebalancing rules should be suspended during bull markets."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Institutional Investment Policy Statements (IPS) enforce disciplined rebalancing corridors specifically to counteract human emotional biases (greed and fear). The target equity allocation is 60% with a +/- 5% corridor (acceptable range = 55% to 65%). When equities reached 68%, the upper band was breached. Strict governance mandates systematic rebalancing: the CIO must sell equity and purchase bonds to re-enter the policy corridor. This systematic discipline forces the institution to 'sell high' after rallies and 'buy low' after crashes, preserving long-term risk targets and preventing risk creep."
    },
    "quests": [
      {
        "title": "Architectural Design of an Institutional Investment Policy Statement (IPS)",
        "type": "concept",
        "description": "Formulate the comprehensive architectural components of an institutional IPS according to CFA Institute / GIPS standards: Return Objectives (Real vs Nominal), Risk Objectives (Willingness vs Ability to bear risk), Constraints (Liquidity, Time Horizon, Tax, Legal/Regulatory, Unique Circumstances), and Liability-Driven Investing (LDI) frameworks.",
        "rubric": "Detail all 7 core sections of the institutional IPS; formulate liability benchmark matching equations; derive corridor rebalancing threshold width formulas based on transaction costs and asset volatility."
      },
      {
        "title": "The UK LDI Pension Crisis & Margin Call Spiral Forensic Audit",
        "type": "detective",
        "description": "Audit the September 2022 UK Liability-Driven Investment (LDI) pension crisis: analyze how defined-benefit pension funds used interest rate swaps and leveraged gilt repo to match long-term liabilities; when UK government bond yields spiked by 150 bps in 48 hours following the 'mini-budget', trace the cascading margin calls that forced funds to dump gilts, nearly freezing the entire UK sovereign debt market.",
        "rubric": "Model the leveraged LDI swap structure; quantify the variation margin cash drain; explain the Bank of England's emergency gilt purchase intervention to prevent systemic pension insolvencies."
      },
      {
        "title": "Institutional CIO Strategic Asset Allocation RFC & Engine",
        "type": "mastery",
        "description": "Author the complete CIO RFC document and build an automated compliance engine in Python: define asset allocation targets, tactical corridors, and tracking error constraints; write an executable policy compliance validator that checks daily portfolio holdings against IPS mandates, detects corridor breaches, and automatically calculates required rebalancing trades.",
        "rubric": "Deliver comprehensive RFC markdown document; implement Python compliance class verifying asset limits, sector concentration, duration bounds, and ESG exclusions; output automated rebalancing order tickets."
      },
      {
        "title": "The Board of Trustees Allocation Defense War Room",
        "type": "incident",
        "description": "Defend the newly authored Strategic Asset Allocation RFC before the University Endowment Board of Trustees: trustees are split—one faction demands 100% allocation to illiquid private equity venture capital following a high-return year, while another demands 50% in risk-free cash; use Monte Carlo long-term horizon forecasting, liquidity stress tests, and spending policy simulations to establish unanimous board consensus.",
        "rubric": "Model university operating budget spending rules (e.g., 5% rolling average); run 30-year Monte Carlo simulations across both extreme proposals vs the balanced RFC allocation; prove that the balanced allocation preserves intergenerational equity and operational solvency."
      }
    ]
  },
  {
    "day": 60,
    "month": 2,
    "blockNum": 12,
    "title": "Capstone 2: ApexInvest Global Multi-Asset Investment Management, Corporate Valuation & Sovereign Treasury Suite",
    "stageName": "Stage 4: Derivatives, Private Equity, Mergers & Corporate Restructuring",
    "stageNum": 4,
    "pedagogicalRole": "Comprehensive Global Investment & Corporate Finance Master Capstone",
    "spokenGoal": "Welcome to the ultimate proving ground of Business Finance & Investment Management! Over the past 59 days, you have mastered the mathematics, governance, and institutional mechanics of corporate finance, capital markets, valuation, portfolio theory, and derivatives. Today, you synthesize everything into your crowning achievement: Capstone 2 — The ApexInvest Global Multi-Asset Investment Management, Corporate Valuation, M&A & Sovereign Treasury Suite! You will architect an integrated financial engine that values multi-billion-dollar global corporations, optimizes multi-asset investment portfolios, hedges macro risks using derivatives, structures an LBO/M&A transaction, and enforces enterprise risk governance. Today, you face the Master Capstone Viva Gate!",
    "conceptInvariant": "The Master Financial Synthesis Invariant: All financial assets and corporate claims are bound by the fundamental Law of One Price and Conservation of Value: intrinsic value equals the expected discounted present value of state-contingent cash flows; whether pricing a corporate project, a stock, a bond, a derivative, or a multi-asset portfolio, risk must be priced consistently and arbitrage eliminated across all capital markets.",
    "failureMode": "An investment management conglomerate operates disparate unintegrated software systems for DCF valuation, portfolio construction, M&A modeling, and derivatives hedging; inconsistent discount rates, unhedged factor risks, and contradictory capital assumptions trigger a $400M misallocation across global funds; the board orders the immediate replacement of legacy tools with a unified enterprise architecture.",
    "tryItFriction": "Architect and Execute Capstone 2: ApexInvest in Python/TypeScript: ingest multi-asset market feeds; build an integrated DCF and Trading Comps valuation model for an acquisition target; structure a 5-year LBO financing package; construct a maximum-Sharpe multi-asset portfolio with Fama-French factor tilts; execute a dynamic BSM delta-gamma hedge; run a full Basel III / VaR stress test; and defend the integrated platform against an aggressive senior evaluator panel.",
    "socraticHints": [
      "How does the Cost of Capital derived from corporate finance (WACC) link directly to modern asset pricing models in investment management (CAPM / Fama-French)?",
      "They are two sides of the exact same financial coin: the expected rate of return demanded by investors in asset pricing models is identically the cost of capital incurred by the firm raising funds.",
      "A company creates economic value for investors if and only if the internal rate of return on its real physical assets exceeds the equilibrium return required by capital markets."
    ],
    "situationalPuzzle": {
      "scenario": "As Global Chief Financial Officer and Head of Capital Allocation for ApexInvest Sovereign Holdings, you must execute an integrated $1B enterprise deployment: 1) Target Acquisition: Target Corp has $80M EBITDA; Trading Comps indicate 10.0x EV/EBITDA ($800M EV), DCF confirms $820M intrinsic value. 2) Transaction Structuring: Fund the $800M acquisition with $500M senior/subordinated debt (at 7% blended cost) and $300M sponsor equity. 3) Portfolio Management: Allocate $200M surplus liquidity across global equities and fixed income to achieve an 8.5% return with maximum Sharpe Ratio. 4) Risk Governance: Establish delta-gamma collars to hedge public equity holdings and enforce a strict 99% daily VaR limit of $15M. What integrated strategy satisfies all criteria?",
      "options": [
        "Deploy 100% of capital into high-yield speculative tech stocks.",
        "Execute the $800M LBO of Target Corp at 10x EBITDA using 62.5% debt / 37.5% equity, capturing $20M in cost synergies (pro-forma EV/EBITDA drops to 8.0x, driving an estimated 28% Sponsor IRR); deploy the remaining $200M into the optimal Markowitz Tangency portfolio with Value and Quality factor tilts; construct a BSM options collar hedging market downside; and enforce a 1-day 99% VaR limit of $12.4M! This integrated plan maximizes risk-adjusted shareholder wealth across corporate and market portfolios!",
        "Reject the acquisition and keep $1B in cash.",
        "Fund the acquisition with 100% equity to eliminate bankruptcy risk."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This represents the master synthesis of Business Finance & Investment Management: 1) Corporate Valuation & M&A: Target Corp is fairly priced at 10.0x EV ($800M). Incorporating $20M in verified cost synergies expands EBITDA to $100M, effectively lowering the entry multiple to 8.0x ($800M / $100M). 2) LBO Structuring: Financing with $500M debt and $300M equity deleverages rapidly over 5 years, delivering an exceptional 28% projected Sponsor IRR. 3) Portfolio Construction: The remaining $200M is allocated along the Capital Allocation Line into the maximum-Sharpe Tangency portfolio tilted toward Value and Quality factors. 4) Risk & Derivatives Governance: A cashless options collar truncates equity downside, and the portfolio's 99% 1-day VaR of $12.4M easily complies with the $15M enterprise risk budget. A masterclass in capital allocation."
    },
    "quests": [
      {
        "title": "ApexInvest Architecture: Unified Multi-Asset & Corporate Finance Specification",
        "type": "concept",
        "description": "Architect the end-to-end data schemas, mathematical equations, and operational workflows for the ApexInvest platform: specify data pipelines for financial statements, bond yield curves, option surfaces, covariance matrices, and risk telemetry; define integration boundaries between Corporate Valuation, Portfolio Construction, LBO Structuring, and Risk Governance.",
        "rubric": "Comprehensive architectural blueprint and data dictionary; mathematical formulations connecting DCF, WACC, MPT, BSM, and VaR into a unified enterprise framework."
      },
      {
        "title": "The Global Financial Conglomerate Forensic Audit",
        "type": "detective",
        "description": "Perform an exhaustive forensic audit on ApexInvest's legacy portfolio: unearth $140M in hidden risk leaks across unhedged floating-rate debt, miscalculated terminal values, closet-indexing fee drags, and un-monitored negative gamma exposures; prepare an institutional diagnostic audit report for the Sovereign Investment Council.",
        "rubric": "Audit across all 4 operational domains; quantify historical wealth destruction; prepare a comprehensive root-cause analysis and remediation roadmap."
      },
      {
        "title": "Capstone 2 Core: ApexInvest Full-Stack Enterprise Platform",
        "type": "mastery",
        "description": "Engineer Capstone 2 in Python: construct the full production-grade ApexInvest platform: 1) Multi-stage DCF & Trading Comps valuation engine; 2) 5-year LBO modeling engine with dynamic cash sweep; 3) Markowitz Mean-Variance & Fama-French multi-factor portfolio optimization module; 4) BSM options Greeks and dynamic delta-hedging simulator; 5) Basel III Parametric and Historical VaR/CVaR risk governance engine.",
        "rubric": "Clean, modular, object-oriented Python architecture; robust numerical solvers across all modules; comprehensive automated test suite verifying mathematical consistency; generation of an executive C-suite dashboard."
      },
      {
        "title": "Master Capstone 2 Viva Voce: Sovereign Investment Council Defense",
        "type": "incident",
        "description": "Defend the complete ApexInvest platform in a rigorous 60-minute simulated Sovereign Investment Council Viva Voce: withstand cross-examination from an institutional CIO, a Wall Street M&A investment banker, a derivatives quant, and a chief risk officer; justify every valuation assumption, capital allocation choice, and risk management protocol under relentless senior evaluator scrutiny.",
        "rubric": "Deliver an authoritative, unflappable boardroom defense; articulate mathematical proofs and empirical precedents for every financial decision; successfully complete the final Viva Gate with distinction."
      }
    ]
  }
]
