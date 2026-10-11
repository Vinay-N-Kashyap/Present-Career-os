# scripts/visuals/finance_investment_spec_m1_rest.py
# Days 16 to 30 Specification for Business Finance & Investment Management (course-finance-investment)
# Conforming strictly to Gate v2 semantic standard:
# 3-Tier Socratic Hint Ladders, Operating Leverage (DOL) & Financial Leverage (DFL),
# EBIT-EPS Indifference Points & Financing Break-Even Physics,
# Net Income (NI) vs Net Operating Income (NOI) Theories,
# Modigliani-Miller Proposition I & II (Frictionless Arbitrage Proofs),
# Modigliani-Miller with Corporate Taxes & Interest Tax Shield Valuation,
# Static Trade-Off Theory, Financial Distress Costs & Debt Overhang / Underinvestment (Myers),
# Pecking Order Theory (Myers & Majluf Asymmetric Information Hierarchy) & Market Timing,
# Cash Conversion Cycle (CCC = DIO + DSO - DPO) & Working Capital Physics,
# Treasury Cash Management: Baumol-Tobin & Miller-Orr Stochastic Bounds,
# Accounts Receivable Credit Policies, Aging Schedules, Factoring vs Forfaiting,
# Inventory Optimization (EOQ, Safety Stocks & Supply Chain Reverse Factoring),
# Working Capital Financing Strategies (Hedging/Matching vs Aggressive vs Conservative),
# Dividend Theories: Walter's Model, Gordon's Bird-in-the-Hand & Residual Dividend Policies,
# Modigliani-Miller Dividend Irrelevance & Share Repurchases vs Cash Dividends,
# and Capstone 1: ApexTreasury Enterprise Corporate Finance & Working Capital Optimization Suite.

DAYS_16_TO_30 = [
  {
    "day": 16,
    "month": 1,
    "blockNum": 4,
    "title": "Operating, Financial & Combined Leverage: EBIT-EPS Indifference Mechanics",
    "stageName": "Stage 2: Capital Structure, Working Capital & Corporate Valuation",
    "stageNum": 2,
    "pedagogicalRole": "Operating vs Financial Leverage Mechanics",
    "spokenGoal": "Leverage is a double-edged sword that amplifies returns in good times and accelerates bankruptcy in downturns. Today, we dissect the two engines of leverage: Operating Leverage (DOL), driven by fixed production costs that magnify changes in sales into massive swings in EBIT, and Financial Leverage (DFL), driven by fixed interest expenses that magnify swings in EBIT into explosive swings in Earnings Per Share (EPS). The product of the two is Combined Leverage (DCL = DOL * DFL). Crucially, we calculate the EBIT-EPS Indifference Point—the exact operating profit level where debt financing and equity financing deliver identical EPS, identifying when debt begins to enhance shareholder returns.",
    "conceptInvariant": "Leverage Multiplicative Invariant: Combined leverage is the product of operating leverage and financial leverage: DCL = DOL * DFL = [ %Delta EBIT / %Delta Sales ] * [ %Delta EPS / %Delta EBIT ] = %Delta EPS / %Delta Sales; fixed costs in operations and financing multiply each other, geometrically expanding residual equity volatility.",
    "failureMode": "A telecom operator with extreme operating leverage (DOL = 3.5 due to massive cell tower depreciation) finances a 5G rollout with 80% high-yield debt (DFL = 3.0), creating a DCL of 10.5; when macro recession dips sales by just 10%, EPS collapses by 105%, wiping out net earnings and triggering immediate loan covenant defaults.",
    "tryItFriction": "Construct an EBIT-EPS Indifference & Leverage Analyzer in Python: take alternative capital structures (100% Equity vs 50% Debt / 50% Equity vs Debt + Preferred Stock); compute DOL, DFL, and DCL; solve for the exact algebraic EBIT-EPS indifference point; plot EPS profiles across EBIT levels from -$10M to +$50M.",
    "socraticHints": [
      "Why does a company with high fixed operating costs have less capacity to take on high financial debt leverage?",
      "Because operating leverage already creates substantial volatility in operating income (EBIT).",
      "Layering fixed interest payments (financial leverage) on top of volatile EBIT compounds downside risk, dramatically raising the probability that EBIT will fail to cover interest obligations."
    ],
    "situationalPuzzle": {
      "scenario": "A firm needs $20M in new capital. Plan A issues 1,000,000 common shares at $20/share (Existing shares = 1,000,000; total new shares = 2,000,000). Plan B issues $20M of 8% bonds (Annual interest = $1.6M; shares remain 1,000,000). The corporate tax rate is 25%. At what level of EBIT will both financing plans produce the exact same Earnings Per Share (EBIT-EPS Indifference Point)?",
      "options": [
        "EBIT = $1,600,000.",
        "EBIT = $3,200,000. Above $3.2M, debt financing produces higher EPS; below $3.2M, equity financing produces higher EPS.",
        "EBIT = $4,800,000.",
        "There is no indifference point because debt is always riskier than equity."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Set EPS_Equity = EPS_Debt: [ (EBIT - 0)*(1 - T) ] / 2,000,000 = [ (EBIT - $1,600,000)*(1 - T) ] / 1,000,000. Cancel out (1 - T): EBIT / 2 = EBIT - $1,600,000 => EBIT = 2*EBIT - $3,200,000 => EBIT = $3,200,000. At EBIT = $3.2M, EPS under both plans is [ ($3.2M - 0)*0.75 ] / 2M = $1.20, and under debt: [ ($3.2M - $1.6M)*0.75 ] / 1M = $1.20. If expected EBIT exceeds $3.2M, debt financing magnifies EPS; if EBIT falls below $3.2M, equity protects against catastrophic EPS dilution."
    },
    "quests": [
      {
        "title": "Mathematical Derivation of DOL, DFL and DCL",
        "type": "concept",
        "description": "Derive the formulas DOL = [ Q*(P - V) ] / [ Q*(P - V) - F ] and DFL = EBIT / [ EBIT - I - Dp/(1-T) ] from first principles; prove why DCL equals Contribution Margin divided by EBT (Earnings Before Taxes); explain how high leverage shifts the firm's financial break-even point.",
        "rubric": "Step-by-step calculus derivation of elasticities dEBIT/dQ and dEPS/dEBIT; incorporate preferred stock dividend gross-up; show algebraic proof of DCL = DOL * DFL."
      },
      {
        "title": "The High Fixed-Cost Automotive Downcycle Forensic Audit",
        "type": "detective",
        "description": "Audit an automotive manufacturer during a cyclical downturn: the firm had $8B in fixed plant overhead (DOL = 4.2) and carried $12B in 7% debt (DFL = 2.8); demonstrate how an 8% drop in vehicle unit deliveries wiped out 94% of net income and pushed the firm to the brink of bankruptcy.",
        "rubric": "Calculate baseline Contribution Margin, Fixed Costs, and Interest; calculate DCL (11.76); trace the 8% revenue contraction through EBIT and EBT; show how fixed debt payments turned a $600M net profit into a -$28M net loss."
      },
      {
        "title": "Interactive EBIT-EPS Indifference & Capital Structure Engine",
        "type": "mastery",
        "description": "Build an enterprise financing choice simulator in Python: accept multi-tier financing proposals (pure equity, pure debt, mezzanine convertible debt, preferred stock); compute algebraic indifference points and financial break-even points; generate interactive EBIT-EPS crossover charts with probability overlays of achieving target EBIT.",
        "rubric": "Implement closed-form indifference solver for N competing financing structures; handle preferred dividend tax adjustments; generate matplotlib visualization displaying crossover points, risk zones, and optimal financing ranges based on forecasted EBIT distribution."
      },
      {
        "title": "The Debt Covenant Financial Leverage Default War Room",
        "type": "incident",
        "description": "Handle a weekend covenant breach crisis: an unexpected supply chain disruption reduces quarterly EBIT by 35%; the company's Debt-to-EBITDA covenant threshold is 4.5x, but the drop spikes leverage to 5.8x, triggering an immediate Event of Default and accelerating $300M in term loans; negotiate an emergency covenant waiver with lenders.",
        "rubric": "Model the EBITDA contraction and compute exact covenant shortfall; structure an equity cure provision or pay-down schedule using surplus inventory liquidation; draft an institutional lender waiver request demonstrating debt service recovery within 120 days."
      }
    ]
  },
  {
    "day": 17,
    "month": 1,
    "blockNum": 4,
    "title": "Capital Structure Theories I: Traditional, Net Income (NI) & Net Operating Income (NOI)",
    "stageName": "Stage 2: Capital Structure, Working Capital & Corporate Valuation",
    "stageNum": 1,
    "pedagogicalRole": "Historical Capital Structure Physics",
    "spokenGoal": "Can a company increase its total market value simply by altering the mix of debt and equity on its balance sheet? Before modern financial economics emerged, three classical theories dominated the debate: David Durand's Net Income (NI) Approach, Net Operating Income (NOI) Approach, and the Traditional View. The NI approach argues that debt is cheaper than equity, so increasing debt monotonically lowers WACC and inflates firm value. The NOI approach argues the exact opposite: the overall cost of capital is completely invariant to leverage because equity holders demand higher returns to offset debt risk. Today, we dissect these historical models, understand the U-shaped WACC curve of the Traditional View, and lay the groundwork for Modigliani-Miller!",
    "conceptInvariant": "Traditional View Optimal Capital Structure Invariant: Under the Traditional View of capital structure, modest amounts of debt lower WACC because debt's cheaper cost dominates initial equity risk; beyond a critical leverage threshold, rising financial distress risks cause both Ke and Kd to spike non-linearly, producing a unique U-shaped WACC curve and an optimal debt ratio.",
    "failureMode": "A CFO follows the crude Net Income (NI) theory, assuming debt can be expanded indefinitely at 6% interest without equity holders noticing; the CFO levers the firm to 85% debt; equity investors panic at the bankruptcy risk, demanding a 35% return on equity and dumping the stock, collapsing the company's total enterprise value by 40%.",
    "tryItFriction": "Build an NI vs NOI vs Traditional Capital Structure Simulator: plot WACC, Cost of Equity (Ke), and Total Firm Value (V) across Debt-to-Capital ratios from 0% to 90% under all three classical theories; identify the optimal capital structure point where WACC reaches its global minimum.",
    "socraticHints": [
      "Why does the Net Operating Income (NOI) theory argue that total firm value is independent of capital structure?",
      "Because NOI assumes operating earnings (EBIT) are generated by physical operating assets, and how those earnings are divided between debt and equity cannot change their aggregate value.",
      "Any advantage from using cheaper debt is exactly offset by an increase in the cost of equity (Ke), keeping overall WACC constant."
    ],
    "situationalPuzzle": {
      "scenario": "A firm has expected perpetual EBIT of $10M. Under the Net Operating Income (NOI) approach, the overall capitalization rate (WACC) is fixed at 10%. The firm currently has $30M in debt at an interest rate of 6% (Annual interest = $1.8M). What is the total market value of the firm (V), the market value of equity (E), and the cost of equity (Ke)?",
      "options": [
        "V = $100M, E = $70M, Ke = 11.71%.",
        "V = $80M, E = $50M, Ke = 10.0%.",
        "V = $120M, E = $90M, Ke = 8.5%.",
        "Total firm value cannot be calculated without knowing the corporate tax rate."
      ],
      "correctOptionIndex": 0,
      "explanation": "Option A is correct. Under the NOI approach: Total Firm Value V = EBIT / WACC = $10,000,000 / 0.10 = $100,000,000. Market Value of Equity E = Total Value V - Debt D = $100,000,000 - $30,000,000 = $70,000,000. Earnings available to equity holders = EBIT - Interest = $10,000,000 - $1,800,000 = $8,200,000. Cost of Equity Ke = Net Income / Equity Value = $8,200,000 / $70,000,000 = 11.714%. As debt was introduced, Ke rose from 10.0% to 11.71%, perfectly offsetting the cheaper 6% debt to keep overall WACC at exactly 10.0%."
    },
    "quests": [
      {
        "title": "Theoretical Mechanics of Durand's NI, NOI & Traditional Views",
        "type": "concept",
        "description": "Formulate the algebraic assumptions and graphical profiles of the Net Income (NI) Approach, Net Operating Income (NOI) Approach, and Traditional View; prove mathematically why the NI approach implies 100% debt is optimal and why NOI implies capital structure irrelevance.",
        "rubric": "Define total value equations V = S + D for all three theories; explain behavioral assumptions of equity and debt investors; demonstrate how the Traditional view synthesizes NI and NOI into a non-linear U-shaped WACC curve."
      },
      {
        "title": "The Over-Leveraged Sugar Refiner Historical Forensic Audit",
        "type": "detective",
        "description": "Examine a historic commodity refiner that expanded debt from 20% to 75% of capital between 2018 and 2021: track how its pre-tax interest coverage collapsed from 8.2x to 1.3x, triggering the inflection point of the Traditional WACC curve where equity cost surged from 11% to 28%; quantify the resulting destruction of market value.",
        "rubric": "Plot historical Ke, Kd, and WACC against debt ratio; identify the exact inflection point where marginal cost of capital began rising; prove that total enterprise value peaked at 38% debt and fell by $120M as leverage exceeded 70%."
      },
      {
        "title": "Classical Capital Structure Simulation Suite",
        "type": "mastery",
        "description": "Develop a multi-theory capital structure visualization engine in Python: model user-defined EBIT and asset bases; dynamically compute firm value, equity value, Ke, and WACC across leverage ranges [0%, 95%] under NI, NOI, and Traditional frameworks; output comparative multi-panel charts.",
        "rubric": "Implement formulas for all three models; include non-linear risk escalation functions for Traditional Ke and Kd; generate 3-panel matplotlib figure showing Cost of Capital curves, Firm Value curves, and Debt-to-Equity ratios."
      },
      {
        "title": "The Family Business Debt Aversion Boardroom War Room",
        "type": "incident",
        "description": "Advise a conservative family-owned enterprise that operates with 0% debt: the patriarch insists on pure equity financing, believing all debt is evil; the third-generation CEO wants to modernize with 30% debt to lower WACC and fund factory automation; use the Traditional View and WACC optimization to structure a safe, low-risk debt introduction.",
        "rubric": "Calculate current unlevered WACC (14.0%); model post-recapitalization WACC at 30% debt (11.2%); quantify the $35M expansion in firm value; design debt covenant safeguards (e.g., minimum 5x interest coverage) to satisfy family risk governance."
      }
    ]
  },
  {
    "day": 18,
    "month": 1,
    "blockNum": 4,
    "title": "Modigliani-Miller Proposition I & II: Frictionless Arbitrage Invariance",
    "stageName": "Stage 2: Capital Structure, Working Capital & Corporate Valuation",
    "stageNum": 2,
    "pedagogicalRole": "Capital Structure Irrelevance Physics",
    "spokenGoal": "In 1958, Franco Modigliani and Merton Miller published what is widely regarded as the most profound breakthrough in modern corporate finance: the MM Capital Structure Irrelevance Theorem. In a frictionless world without taxes, bankruptcy costs, or transaction frictions, the market value of any firm is completely independent of its capital structure: V_Levered = V_Unlevered! How did MM prove this? Through Arbitrage. If an over-leveraged firm traded at a premium, investors could sell its shares, replicate identical leverage on their personal accounts (Homemade Leverage), buy shares in an unlevered firm, and earn higher returns with identical risk! Today, we master the rigorous homemade leverage arbitrage proof that earned a Nobel Prize.",
    "conceptInvariant": "Modigliani-Miller Proposition I Invariant: In perfect capital markets with no taxes, transaction costs, or bankruptcy frictions, the value of a firm is determined solely by its real earning power and investment risk, not by the packaging of its liabilities: V_L = V_U; WACC is completely invariant to the Debt-to-Equity ratio.",
    "failureMode": "An investment banker pitches a complex financial engineering recapitalization in a tax-exempt sovereign fund environment, charging $15M in advisory fees to 'create $200M of shareholder value through optimal debt structuring'; the sovereign wealth manager recognizes MM Proposition I applies: in a tax-neutral environment, financial repackaging creates zero economic value, firing the banker and saving $15M in fees.",
    "tryItFriction": "Build an MM Arbitrage & Homemade Leverage Proof Engine in Python: take two identical firms (Firm U with 0% debt, Firm L with 50% debt); assume Firm L trades at an irrational premium; execute an automated homemade leverage trading strategy; prove that an investor pockets upfront cash while matching Firm L's exact cash flow payout stream.",
    "socraticHints": [
      "What is 'Homemade Leverage' in the Modigliani-Miller proof?",
      "It is the ability of individual investors to borrow money on their personal accounts at the same interest rate as corporations.",
      "If corporate debt creates value, an investor can replicate that value by borrowing personally and buying shares of an unlevered firm, eliminating any corporate valuation premium through market arbitrage."
    ],
    "situationalPuzzle": {
      "scenario": "Firm U is unlevered with 1,000,000 shares trading at $50/share (Total Value = $50M). Firm L is identical in operations but has $20M in debt at 6% interest (Interest = $1.2M) and 600,000 shares trading at $55/share (Equity Value = $33M; Total Firm Value = $53M). Both firms have expected EBIT of $6M (No taxes). An investor owns 1% (6,000 shares) of Firm L. How can the investor execute homemade leverage arbitrage?",
      "options": [
        "Hold Firm L shares because the $3M corporate premium proves debt creates value.",
        "Sell 6,000 shares of Firm L for $330,000, borrow $200,000 (1% of Firm L's debt) at 6%, invest $500,000 to buy 10,000 shares (1%) of Firm U, and pocket $30,000 in immediate arbitrage profit while receiving identical net annual cash flows ($48,000)!",
        "Buy more shares of Firm L on margin to capture the debt tax shield.",
        "Sell Firm U short and buy Firm L to equalize market prices."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is the exact MM Proposition I arbitrage proof: 1) Sell 1% of Firm L equity for $330,000. 2) Borrow $200,000 at 6% (annual personal interest = $12,000). Total cash available = $530,000. 3) Buy 1% of Firm U equity (10,000 shares @ $50 = $500,000). 4) Pocket $30,000 upfront cash profit! Check cash flows: Firm U dividend = 1% * $6M EBIT = $60,000. Less personal interest = -$12,000. Net cash flow = $48,000. From holding Firm L: 1% * ($6M - $1.2M interest) = $48,000. Identical risk, identical cash flow, but $30,000 free cash upfront! Such arbitrage drives Firm L's value back to $50M."
    },
    "quests": [
      {
        "title": "Mathematical Proof of MM Proposition I & Proposition II (No Taxes)",
        "type": "concept",
        "description": "Formulate the formal proof of MM Proposition I via the Law of One Price and state-contingent claims; derive MM Proposition II: Ke = K_0 + (K_0 - Kd) * (D/E); prove that as debt increases, the linear surge in Ke perfectly neutralizes the cheaper cost of debt, keeping WACC = K_0.",
        "rubric": "Write complete algebraic proof of V_L = V_U; derive Proposition II from WACC definition; explain why the financial risk premium (K_0 - Kd)*(D/E) exactly offsets the weight of cheaper debt."
      },
      {
        "title": "The Homemade Leverage Arbitrage Forensic Audit",
        "type": "detective",
        "description": "Audit an academic simulation where market makers created a synthetic dual-listed equity structure with differing leverage ratios: trace the order book bids and asks, prove how arbitrageurs borrowing on personal margin forced the market capitalization of the levered entity to match the unlevered entity within 42 milliseconds.",
        "rubric": "Track order book trades; compute margin borrowing rates and replication cash flows; prove that bid-ask spreads collapsed the valuation divergence, confirming the real-world validity of MM arbitrage mechanics."
      },
      {
        "title": "MM Frictionless Capital Structure & Arbitrage Simulator",
        "type": "mastery",
        "description": "Construct an interactive Modigliani-Miller simulation engine in Python: accept arbitrary operating cash flows and capital structures; demonstrate the invariance of enterprise value and WACC; implement an automated arbitrageur agent that detects mispricings between levered and unlevered twin firms and executes the homemade leverage trade.",
        "rubric": "Code twin firm structures with identical underlying stochastic EBIT; compute Proposition II Ke and WACC curves; include Arbitrageur class that executes the 4-step portfolio rebalance when V_L != V_U, demonstrating price convergence."
      },
      {
        "title": "The Institutional Borrowing Cost Differential War Room",
        "type": "incident",
        "description": "Address an institutional challenge to MM Proposition I: an activist investor argues that MM fails in the real world because individual retail investors borrow at 9.5% margin rates while investment-grade corporations borrow at 4.5% institutional rates; evaluate whether this borrowing cost differential restores corporate capital structure value creation.",
        "rubric": "Model the borrowing spread (Kd_corporate < Kd_investor); show how institutional financial intermediaries (closed-end funds, banks) step in to arbitrage the gap; determine the residual corporate valuation premium created by corporate borrowing advantages."
      }
    ]
  },
  {
    "day": 19,
    "month": 1,
    "blockNum": 4,
    "title": "Modigliani-Miller with Corporate Taxes: Interest Tax Shield Valuation",
    "stageName": "Stage 2: Capital Structure, Working Capital & Corporate Valuation",
    "stageNum": 2,
    "pedagogicalRole": "Tax Shield Valuation Physics",
    "spokenGoal": "While Modigliani and Miller's 1958 frictionless world was a theoretical masterpiece, the real world has taxes. In 1963, MM published their landmark correction: when interest expense is tax-deductible, debt financing creates an Interest Tax Shield that transfers wealth from the government treasury directly into corporate enterprise value! Under MM with Corporate Taxes, the value of a levered firm equals the value of an unlevered firm plus the Present Value of the Interest Tax Shield: V_L = V_U + T * D! Today, we master the mathematics of tax shield valuation, calculate debt-adjusted WACC, and explore the staggering implication: in a pure corporate tax world, firms should be 100% debt-financed!",
    "conceptInvariant": "Tax Shield Value Invariant: For a firm with perpetual debt D at interest rate Kd subject to marginal corporate tax rate T, the annual tax shield is T * Kd * D; discounting this tax shield at the debt cost Kd yields an invariant present value equal to PV(Tax Shield) = T * D.",
    "failureMode": "A private equity sponsor models an LBO acquisition without calculating the annual interest tax shield; the sponsor underestimates enterprise debt capacity by $120M and loses the auction to a rival PE firm whose bid properly capitalized the $35M present value of tax shields.",
    "tryItFriction": "Build an MM Tax Shield & Levered Valuation Engine in Python: take operating EBIT, tax rate, and debt schedules; calculate unlevered firm value V_U; compute annual interest tax shields; discount tax shields under perpetual vs finite debt; compute levered firm value V_L and tax-adjusted WACC.",
    "socraticHints": [
      "Why is the present value of the interest tax shield for perpetual debt simply equal to T * D, regardless of the interest rate Kd?",
      "Because the annual dollar tax shield is T * Kd * D.",
      "Discounting this perpetual cash flow at the cost of debt Kd yields PV = (T * Kd * D) / Kd = T * D; Kd cancels out completely!"
    ],
    "situationalPuzzle": {
      "scenario": "Corporation Unlevered has expected perpetual EBIT of $20M and is 100% equity financed with a cost of capital of 12%. The corporate tax rate is 25%. Unlevered firm value V_U is $20M * (1 - 0.25) / 0.12 = $125M. The CFO decides to issue $50M in perpetual debt at 6% interest to repurchase $50M of equity. Under Modigliani-Miller with Corporate Taxes, what is the new total value of the firm (V_L), the value of equity, and the new WACC?",
      "options": [
        "V_L = $125M, Equity = $75M, WACC = 12.0%.",
        "V_L = $137.5M ($125M + 0.25 * $50M), Equity = $87.5M ($137.5M - $50M), and WACC declines to 10.91%!",
        "V_L = $175M, Equity = $125M, WACC = 8.5%.",
        "V_L decreases because interest payments deplete corporate cash flow."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under MM with Corporate Taxes: V_L = V_U + T * D = $125,000,000 + 0.25 * $50,000,000 = $125,000,000 + $12,500,000 = $137,500,000. Market Value of Equity = V_L - Debt = $137.5M - $50M = $87.5M. By issuing $50M debt and buying back $50M equity, the remaining equity holders capture the ENTIRE $12.5M tax shield gain! Check WACC: After-tax Kd = 6% * (1 - 0.25) = 4.5%. New Ke = 12% + (12% - 6%) * (1 - 0.25) * ($50M / $87.5M) = 12% + 4.5% * 0.5714 = 14.57%. WACC = ($87.5M / $137.5M)*14.57% + ($50M / $137.5M)*4.5% = 9.27% + 1.64% = 10.91%. Debt reduced WACC from 12.0% to 10.91%."
    },
    "quests": [
      {
        "title": "Derivation of MM Proposition I & II with Corporate Taxes",
        "type": "concept",
        "description": "Derive the mathematical proof that V_L = V_U + T*D from the income statement cash flows to all capital providers; derive MM Proposition II with taxes: Ke = K_0 + (K_0 - Kd)*(1 - T)*(D/E); prove that WACC monotonically decreases as leverage approaches 100%.",
        "rubric": "Show total cash flow to debt and equity equals EBIT*(1-T) + T*Kd*D; discount both terms to prove V_L = V_U + T*D; algebraically derive Proposition II with tax shield dampening; explain why this implies 100% debt optimality in a frictionless tax world."
      },
      {
        "title": "The Finite Debt Life Tax Shield Discounting Forensic Audit",
        "type": "detective",
        "description": "Audit an infrastructure project finance model: an analyst evaluated a 10-year amortizing loan using the perpetual formula T*D ($15M); recalculate the true tax shield by discounting year-by-year amortizing interest deductions at the appropriate debt rate; quantify the $5.8M valuation overstatement.",
        "rubric": "Generate the 10-year debt amortization schedule; compute annual interest tax shields (Interest_t * T); discount each at Kd; prove that the finite tax shield PV is $9.2M, not the perpetual $15M assumed by the analyst."
      },
      {
        "title": "Adjusted Present Value (APV) vs WACC Valuation Suite",
        "type": "mastery",
        "description": "Construct an enterprise valuation engine in Python implementing both Adjusted Present Value (APV = Base Case Unlevered NPV + PV of Financing Side Effects) and standard WACC: test varying debt schedules (fixed dollar debt vs target debt-to-equity ratio); prove that Miles-Ezzell adjustments reconcile WACC with dynamic APV.",
        "rubric": "Implement APV module with itemized financing effects (interest tax shields, subsidized debt, flotation costs); implement standard WACC DCF; demonstrate that both methods yield identical enterprise valuations when debt ratios are dynamically adjusted."
      },
      {
        "title": "The Section 163(j) Interest Deductibility Cap Crisis War Room",
        "type": "incident",
        "description": "Resolve an emergency tax reform crisis: new legislation caps corporate interest expense tax deductions at 30% of adjusted taxable EBITDA (similar to US TCJA Section 163(j) / OECD BEPS Action 4); an enterprise with $80M EBITDA and $45M annual interest expense suddenly faces disallowance of $21M in interest deductions; quantify the tax shield destruction and restructure debt.",
        "rubric": "Calculate allowable interest deduction (30% of $80M = $24M); calculate disallowed interest ($21M) and incremental cash tax liability ($21M * 25% = $5.25M); re-compute effective after-tax cost of debt; design a deleveraging or convertible equity swap to eliminate stranded tax deductions."
      }
    ]
  },
  {
    "day": 20,
    "month": 1,
    "blockNum": 4,
    "title": "Trade-Off Theory, Financial Distress Costs & Debt Overhang Mechanics",
    "stageName": "Stage 2: Capital Structure, Working Capital & Corporate Valuation",
    "stageNum": 2,
    "pedagogicalRole": "Financial Distress & Agency Costs of Debt Physics",
    "spokenGoal": "If MM with taxes proved that debt creates tax shields, why isn't every corporation on earth 100% debt-financed? Because debt brings the terrifying specter of Financial Distress. Today, we master the Static Trade-Off Theory: the optimal capital structure balances the marginal benefit of the Interest Tax Shield against the marginal cost of Financial Distress! Distress costs include direct costs (legal, accounting, and court bankruptcy fees) and far larger indirect costs (customers abandoning the brand, suppliers demanding cash on delivery, talented employees jumping ship). Furthermore, we master Stewart Myers' famous agency costs of debt: Debt Overhang (Underinvestment) and Asset Substitution (Risk Shifting)!",
    "conceptInvariant": "Static Trade-Off Optimality Invariant: Enterprise value is maximized where the marginal tax shield benefit of adding one additional dollar of debt exactly equals the marginal expected present value of financial distress and agency costs: d(PV_TaxShield)/dD = d(PV_DistressCosts)/dD.",
    "failureMode": "A distressed retailer carrying $5B in debt identifies a high-return e-commerce upgrade requiring $100M Capex that generates an NPV of +$50M; shareholders refuse to fund the equity because all $50M in value will be captured by bondholders to cover existing debt shortfalls (Debt Overhang / Underinvestment); the retailer collapses into liquidation.",
    "tryItFriction": "Build a Trade-Off Capital Structure & Debt Overhang Engine in Python: take operating cash flows, tax rates, bankruptcy probability curves, and distress cost percentages; compute enterprise value across debt ratios from 0% to 100%; identify the exact optimal capital structure; simulate an investment decision under debt overhang to demonstrate underinvestment.",
    "socraticHints": [
      "What is Myers' 'Debt Overhang' (Underinvestment) problem?",
      "When a firm is in financial distress, the benefits of a new positive-NPV project accrue primarily to existing debt holders rather than equity holders.",
      "If equity holders must supply the capital but bondholders capture the payoff, rational shareholders will reject positive-NPV projects, destroying firm value."
    ],
    "situationalPuzzle": {
      "scenario": "A firm has existing debt of $1,000 due in 1 year. If the firm does nothing, its assets will be worth either $800 (in recession, 50% prob) or $1,200 (in boom, 50% prob). Management can invest $100 in equity today to fund a project that pays a guaranteed $150 in 1 year (NPV = +$50, assuming 0% discount rate). Will equity holders agree to fund this project?",
      "options": [
        "Yes, because NPV is +$50, which is always positive for shareholders.",
        "No! Without the project, equity is worth $0 in recession and $200 in boom (Expected Equity = $100). With the project, total firm value is $950 in recession (Equity gets $0, Debt gets $950) and $1,350 in boom (Debt gets $1,000, Equity gets $350). Expected Equity = 0.5 * $350 = $175. Equity gained only $75 while investing $100—a net loss of $25! Equity holders reject the project due to Debt Overhang!",
        "Yes, because debt holders will subsidize the equity investment.",
        "Both equity and debt holders split the $50 gain 50/50."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is the mathematical proof of Stewart Myers' Underinvestment (Debt Overhang) problem. Without the project: In recession, assets = $800 < $1,000 debt => Equity gets $0. In boom, assets = $1,200 => Equity gets $200. Expected equity value = 0.5*$0 + 0.5*$200 = $100. With the project (cost $100): In recession, assets = $800 + $150 = $950 < $1,000 debt => Equity STILL gets $0! The entire $150 project payoff went to the bondholders. In boom, assets = $1,200 + $150 = $1,350 => Equity gets $350. Expected equity value = 0.5*$0 + 0.5*$350 = $175. Net return to shareholders = $175 - $100 (equity invested) = $75, which is LESS than the $100 they had before investing! Rational shareholders veto a project with an NPV of +$50 because $75 of the gain is captured by existing bondholders."
    },
    "quests": [
      {
        "title": "Mathematical Formulation of Static Trade-Off Theory & Distress Costs",
        "type": "concept",
        "description": "Formulate the complete Trade-Off valuation equation V_L = V_U + PV(Tax Shield) - PV(Financial Distress Costs) - PV(Agency Costs of Debt) + PV(Agency Benefits of Debt); model the probability of default P(Default) as a non-linear function of leverage via Merton's structural model.",
        "rubric": "Detail direct vs indirect bankruptcy costs; formulate expected distress cost as P(Default) * Distress Severity; graph the trade-off curve; prove the first-order condition for optimal leverage."
      },
      {
        "title": "The Asset Substitution (Risk Shifting) Forensic Audit",
        "type": "detective",
        "description": "Audit an over-leveraged energy exploration company near insolvency: examine how management liquidated safe $40M utility assets to drill a 10%-probability speculative wildcat well; prove that shareholders gained equity option value while bondholders suffered a $28M expected loss, exposing the Asset Substitution moral hazard.",
        "rubric": "Model equity as a call option on firm assets via Black-Scholes (Merton model); show that increasing asset volatility sigma increases equity value while decreasing debt value; quantify the wealth transfer from debt to equity."
      },
      {
        "title": "Optimal Capital Structure & Trade-Off Optimization Engine",
        "type": "mastery",
        "description": "Develop an automated capital structure optimization suite in Python: model continuous probability of default using credit spread rating tables; quantify marginal tax shields vs marginal bankruptcy costs; compute enterprise value across leverage grids; output the exact optimal Debt-to-Capital ratio.",
        "rubric": "Implement Damodaran-style iterative rating solver: interest coverage ratio -> synthetic rating -> default spread -> Kd -> WACC -> Firm Value; detect optimal debt percentage; output multi-curve chart showing WACC minimization and firm value maximization."
      },
      {
        "title": "The Debt Restructuring & Debt-for-Equity Swap War Room",
        "type": "incident",
        "description": "Lead an out-of-court financial restructuring for an enterprise in severe debt overhang: the firm carries $800M in debt trading at 45 cents on the dollar, blocking all new capital investments; structure a consensual Debt-for-Equity swap that exchanges $500M in junior bonds for 75% of pro-forma common equity, eliminating debt overhang and restoring investment capacity.",
        "rubric": "Model the pro-forma capitalization table; compute post-restructuring enterprise value; demonstrate how debt reduction restores positive equity incentives to fund new Capex, delivering higher recovery value to bondholders than liquidation."
      }
    ]
  },
  {
    "day": 21,
    "month": 1,
    "blockNum": 5,
    "title": "Pecking Order Theory & Market Timing: Asymmetric Information Physics",
    "stageName": "Stage 2: Capital Structure, Working Capital & Corporate Valuation",
    "stageNum": 2,
    "pedagogicalRole": "Information Asymmetry & Financing Hierarchy Physics",
    "spokenGoal": "Why do profitable companies often carry very little debt, while the Trade-Off theory says they should borrow heavily to harvest tax shields? The answer lies in Stewart Myers and Nicolas Majluf's Pecking Order Theory. Managers possess Private Information about the true value of the firm that outside investors lack. If a company issues new equity, the market rationally deduces: 'Management believes the stock is overvalued, otherwise they wouldn't sell it!' Consequently, equity issuances trigger an immediate stock price drop. To avoid this adverse selection penalty, firms follow a strict financing pecking order: first Internal Cash Flows, second Safe Debt, and only as a desperate last resort, Equity!",
    "conceptInvariant": "Pecking Order Asymmetric Information Invariant: Under asymmetric information between insiders and public markets, issuing equity signals that management believes the stock is overvalued, triggering adverse selection discounts; firms minimize information costs by financing investments first with internal retained earnings, then debt, and lastly equity.",
    "failureMode": "A high-growth biotech firm with $50M in annual operating cash flows announces a surprise $200M public equity offering to fund an acquisition; the market interprets the equity sale as a signal that current shares are overvalued, triggering an immediate 18% stock crash that erases $320M in market capitalization.",
    "tryItFriction": "Build an Asymmetric Information & Pecking Order Simulator in Python: model corporate financing decisions across high-information vs low-information regimes; simulate market reactions to equity issuances vs debt issuances; calculate adverse selection discounts and track the firm's capital structure evolution.",
    "socraticHints": [
      "Why does issuing debt communicate less negative information to the market than issuing equity?",
      "Because debt is a contractually fixed claim with a senior lien on assets; its value is far less sensitive to private managerial information about long-term growth.",
      "Equity is a residual claim whose value fluctuates directly with insider information; selling equity signals that insiders are cashing out at the top."
    ],
    "situationalPuzzle": {
      "scenario": "A technology firm has an attractive expansion project requiring $50M Capex (NPV = +$15M). True asset value is $200M, but due to market misunderstanding, public market capitalization is only $140M (undervalued by 30%). The firm has $0 internal cash. If it issues $50M of new equity at the depressed market price, new investors will receive $50M / ($140M + $50M) = 26.3% of the combined firm ($265M true value = $69.7M true stake). Existing shareholders lose $19.7M in wealth to new investors. Should management issue equity to fund the project?",
      "options": [
        "Yes, because the project NPV is +$15M, so existing shareholders gain $15M.",
        "No! Under equity financing, existing shareholders gain the $15M NPV but lose $19.7M through underpriced equity dilution—a net loss of -$4.7M! Management will REJECT a positive-NPV project unless they can finance it with debt or retained earnings!",
        "Yes, because stock prices will immediately adjust to true value upon announcement.",
        "Issue preferred stock because it avoids all dilution."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is the foundational Myers-Majluf (1984) proof. When a company's stock is undervalued by the market, issuing new equity transfers more value to incoming shareholders ($19.7M) than the project's entire Net Present Value ($15.0M). Existing shareholders suffer a net wealth destruction of $15.0M - $19.7M = -$4.7M. Rational managers acting for existing shareholders will refuse to issue equity and abandon the lucrative project! This explains why financial slack (internal cash reserves and debt capacity) is vital to prevent underinvestment."
    },
    "quests": [
      {
        "title": "Mathematical Derivation of the Myers-Majluf Underinvestment Boundary",
        "type": "concept",
        "description": "Derive the mathematical boundary condition under which management will reject a positive-NPV project rather than issue undervalued equity; formulate the adverse selection discount and prove why debt minimizes information sensitivity.",
        "rubric": "Set up Myers-Majluf objective function; derive condition: NPV > (P_true - P_market) / P_market * New_Equity; explain how information asymmetry creates the pecking order hierarchy."
      },
      {
        "title": "Baker-Wurgler Market Timing Empirical Forensic Audit",
        "type": "detective",
        "description": "Audit the historical financing choices of an enterprise during the 2000 Dot-Com bubble and 2008 Financial Crisis: test the Baker-Wurgler Market Timing hypothesis by proving that management issued massive equity when Market-to-Book ratios exceeded 4.0 and repurchased shares / issued debt when Market-to-Book collapsed below 0.8.",
        "rubric": "Gather historical market-to-book ratios and capital issuances; compute net equity and debt issuance vectors; prove that historical capital structure is largely the cumulative outcome of past market timing rather than a static WACC target."
      },
      {
        "title": "Pecking Order vs Trade-Off Corporate Capital Allocation Engine",
        "type": "mastery",
        "description": "Develop an enterprise capital structure simulation in Python: simulate a multi-year corporate operating trajectory with stochastic cash flows and Capex needs; compare capital structure dynamics under Trade-Off target rebalancing vs Pecking Order financing; demonstrate why highly profitable firms naturally accumulate low debt.",
        "rubric": "Model cash flow accumulation, debt capacity thresholds, and equity issuance signaling penalties; track leverage over a 20-year horizon; show that profitable firms drift to zero debt under pecking order while seeking high debt under trade-off theory."
      },
      {
        "title": "The Emergency Rights Offering Signaling Crisis War Room",
        "type": "incident",
        "description": "Manage an equity issuance dilemma: a mid-cap manufacturing firm must raise $80M to fund an urgent factory rebuild after debt markets freeze; the CEO wants to do a public follow-on offering, but investment bankers warn it will trigger a 20% stock collapse; structure a Rights Offering with transferable subscription rights to eliminate wealth transfer between shareholders.",
        "rubric": "Design a pro-rata Rights Offering structure; calculate subscription price discount and theoretical ex-rights price (TERP); prove mathematically that a rights offering protects existing shareholders from adverse selection wealth dilution even if the stock is undervalued."
      }
    ]
  },
  {
    "day": 22,
    "month": 1,
    "blockNum": 5,
    "title": "Working Capital Management I: Operating Cycle & Cash Conversion Cycle (CCC)",
    "stageName": "Stage 2: Capital Structure, Working Capital & Corporate Valuation",
    "stageNum": 2,
    "pedagogicalRole": "Working Capital Physics & Cash Velocity",
    "spokenGoal": "Revenue is vanity, profit is sanity, but cash is reality. A company can show millions in accounting profits on its P&L and still go bankrupt next Tuesday because its cash is hopelessly trapped in unpaid customer invoices and dusty warehouse inventory! Today, we master the fundamental metric of working capital efficiency: the Cash Conversion Cycle (CCC). CCC measures the number of days between paying for raw materials and collecting cash from customers: CCC = Days Inventory Outstanding (DIO) + Days Sales Outstanding (DSO) - Days Payables Outstanding (DPO). Elite companies like Apple, Amazon, and Dell achieve Negative Cash Conversion Cycles—forcing suppliers and customers to finance their entire business!",
    "conceptInvariant": "Cash Conversion Cycle Physics Invariant: CCC = DIO + DSO - DPO = (Inventory / COGS * 365) + (Receivables / Revenue * 365) - (Payables / Purchases * 365); every single day shaved off CCC releases real, permanent cash into corporate treasury without requiring expensive external debt or equity.",
    "failureMode": "A fast-growing retail chain expands sales from $50M to $150M; its CCC deteriorates from 35 days to 85 days as inventory piles up; the working capital funding requirement explodes by $20.5M, consuming all operating cash flow and triggering a fatal liquidity crisis despite record sales growth.",
    "tryItFriction": "Build an Institutional Working Capital & CCC Analytics Engine in Python: take balance sheet assets and liabilities alongside income statements; calculate DIO, DSO, DPO, and CCC; compute working capital dollars freed up per day of CCC reduction; model negative CCC cash float dynamics.",
    "socraticHints": [
      "What does a Negative Cash Conversion Cycle mean in practice?",
      "It means the company collects cash from its customers BEFORE it has to pay its suppliers for the goods sold.",
      "The firm operates on a perpetual negative working capital float, using supplier capital to fund operations and earning interest on customer cash."
    ],
    "situationalPuzzle": {
      "scenario": "A manufacturer has annual Sales of $365M (all credit) with a Gross Margin of 40% (COGS = $219M). Inventory is $36M, Accounts Receivable is $45M, and Accounts Payable is $24M (Purchases = $219M). The corporate cost of capital is 10%. The CFO launches a supply chain initiative that cuts DIO by 15 days, cuts DSO by 10 days, and extends DPO by 5 days. What is the current CCC, and how much permanent cash does the CFO release into the treasury?",
      "options": [
        "Current CCC is 50 days; cash freed up is $5M.",
        "Current CCC = 60 days (DIO 60 + DSO 45 - DPO 40 = 65 days); the 30-day CCC improvement releases $21.0M in hard cash, saving $2.1M annually in financing costs!",
        "Current CCC is 100 days; cash freed up is $30M.",
        "Working capital changes do not impact corporate cash balances."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Calculate components: DIO = ($36M / $219M) * 365 = 60.0 days. DSO = ($45M / $365M) * 365 = 45.0 days. DPO = ($24M / $219M) * 365 = 40.0 days. Current CCC = 60 + 45 - 40 = 65.0 days. New CCC: Shaving 15 days from DIO, 10 days from DSO, and extending DPO by 5 days improves CCC by 15 + 10 + 5 = 30.0 days! Cash released: Inventory cash saved = 15 days * ($219M/365) = $9.0M. Receivables cash collected = 10 days * ($365M/365) = $10.0M. Payables cash preserved = 5 days * ($219M/365) = $3.0M (assuming purchases = COGS). Total permanent cash released = $9M + $10M + $3M = $22.0M! At 10% WACC, this generates $2.2M in annual recurring profit."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of the Operating Cycle & CCC",
        "type": "concept",
        "description": "Formulate the Operating Cycle (OC = DIO + DSO) and Cash Conversion Cycle (CCC = OC - DPO); derive working capital cash sensitivity formulas dCash/dDIO, dCash/dDSO, and dCash/dDPO; analyze how supply chain velocity impacts return on invested capital (ROIC).",
        "rubric": "Write rigorous mathematical definitions of all components; prove that ROIC = NOPAT / Invested Capital increases directly as working capital capital charges decline; contrast positive vs negative CCC business models."
      },
      {
        "title": "The Negative CCC Supply Chain Squeeze Forensic Audit",
        "type": "detective",
        "description": "Audit Dell's and Amazon's historical working capital transformations: examine how direct-to-consumer build-to-order models pushed DIO down to 6 days, DSO to 4 days, while negotiating 60-day DPO with suppliers; quantify the multi-billion-dollar interest-free funding float generated by a -50 day CCC.",
        "rubric": "Reconstruct quarterly working capital statements; compute historical CCC trajectory; prove that negative working capital generated $4.2B of cash float, enabling massive growth without raising long-term debt or equity."
      },
      {
        "title": "Real-Time Enterprise Working Capital Optimization Suite",
        "type": "mastery",
        "description": "Construct an automated working capital optimization engine in Python: ingest multi-subsidiary trial balances; calculate segmental DIO, DSO, DPO, and CCC; simulate sensitivity to supplier payment terms, early payment discounts, and inventory turnover targets; output an executive dashboard of trapped liquidity.",
        "rubric": "Process multi-entity financial data; calculate dynamic CCC vectors; implement scenario simulation engine (e.g., impact of 2/10 net 30 discount on DSO); generate visual waterfall charts showing trapped working capital by subsidiary."
      },
      {
        "title": "The Rapid Growth Working Capital Starvation War Room",
        "type": "incident",
        "description": "Manage a high-growth manufacturing liquidity crisis: sales double in 6 months from $20M to $40M, but operating cash flow turns negative -$8M due to ballooning receivables and raw material stocks; bank credit lines are tapped out; design an emergency working capital restructuring plan to avert payroll default.",
        "rubric": "Model the working capital cash absorption rate; implement accelerated collections, inventory consignment, and selective supplier credit extensions; structure a supply chain reverse factoring facility to restore immediate liquidity."
      }
    ]
  },
  {
    "day": 23,
    "month": 1,
    "blockNum": 5,
    "title": "Working Capital Management II: Treasury Cash Management & Stochastic Models",
    "stageName": "Stage 2: Capital Structure, Working Capital & Corporate Valuation",
    "stageNum": 2,
    "pedagogicalRole": "Treasury Liquidity & Stochastic Cash Physics",
    "spokenGoal": "Holding idle cash in a corporate bank account protects against unexpected cash shortfalls, but cash earns near-zero returns and destroys value by failing to cover the firm's cost of capital. How much cash should a corporate treasurer hold? Today, we master the two classic mathematical models of optimal cash balances: William Baumol's Economic Order Quantity adaptation (the Baumol-Tobin Model for deterministic cash burn) and the Miller-Orr Model (for stochastic, unpredictable daily cash flows). We will calculate optimal return points, upper control limits, and examine automated treasury sweeping and cash pooling architectures.",
    "conceptInvariant": "Miller-Orr Stochastic Cash Boundary Invariant: When daily corporate cash flows follow a random walk with zero drift and variance sigma^2, the optimal target cash return point Z = L + [ 3 * TransactionCost * sigma^2 / (4 * InterestRate) ]^(1/3) and upper limit H = 3*Z - 2*L minimize the sum of transaction costs and opportunity holding costs.",
    "failureMode": "A corporate treasurer keeps $150M sitting in zero-yield commercial checking accounts 'just in case'; at a 5.0% short-term Treasury yield, holding this excessive buffer costs the corporation $7.5M annually in lost interest income, triggering a shareholder derivative inquiry.",
    "tryItFriction": "Implement the Baumol-Tobin & Miller-Orr Treasury Engines in Python: take daily cash variance, transaction costs per security transfer, and short-term interest rates; compute optimal cash balance, upper/lower bounds, and return points; simulate 365 days of stochastic daily cash flows and trigger automated investment/liquidation orders.",
    "socraticHints": [
      "What trade-off is balanced in the Baumol-Tobin cash management model?",
      "The trade-off between the Opportunity Cost of holding cash (forgone interest) and the Transaction Cost of selling marketable securities to replenish cash.",
      "Holding large cash balances minimizes transaction fees but maximizes lost interest; holding tiny balances does the opposite."
    ],
    "situationalPuzzle": {
      "scenario": "A corporation has predictable monthly cash disbursements of $3,000,000 ($36,000,000 annually). The transaction fee to liquidate marketable securities is $150 per transaction. The short-term marketable security yield is 6.0% per annum. Using the Baumol-Tobin model C* = sqrt(2 * T * F / r), what is the optimal cash transfer lot size, and what is the total annual cost of cash management?",
      "options": [
        "Optimal transfer size is $1,000,000; total cost is $60,000.",
        "Optimal transfer size is $424,264; the firm should make ~85 transfers per year, resulting in total holding and transaction costs of $25,456!",
        "Optimal transfer size is $150,000; total cost is $15,000.",
        "The firm should keep the entire $36M in checking to eliminate transaction fees."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Apply the Baumol-Tobin formula: C* = sqrt(2 * Total Cash * Fixed Cost / Interest Rate) = sqrt(2 * $36,000,000 * $150 / 0.06) = sqrt($180,000,000,000) = $424,264. Average cash balance held = C*/2 = $212,132. Number of transfers per year = $36M / $424,264 = 84.85 transfers. Annual transaction costs = 84.85 * $150 = $12,728. Annual opportunity holding cost = $212,132 * 0.06 = $12,728. Total annual cost = $12,728 + $12,728 = $25,456. Notice that at the optimal point, transaction costs exactly equal holding costs!"
    },
    "quests": [
      {
        "title": "Mathematical Derivations of Baumol-Tobin and Miller-Orr Models",
        "type": "concept",
        "description": "Derive the Baumol-Tobin optimal lot size formula using calculus optimization of total cost dTC/dC = 0; derive the Miller-Orr stochastic control limits via Ito's Lemma / Brownian motion boundary conditions; explain how daily cash variance sigma^2 dictates buffer widths.",
        "rubric": "Provide complete derivation of Baumol-Tobin C*; formulate Miller-Orr cubic root return point Z and upper limit H = 3Z - 2L; prove why the upper limit is exactly three times the spread above the lower boundary."
      },
      {
        "title": "The Global Cash Trapped Subsidary Forensic Audit",
        "type": "detective",
        "description": "Audit a multinational enterprise with 24 foreign subsidiaries: identify that subsidiaries held an aggregate $320M in fragmented local bank accounts with zero yield, while headquarters borrowed $180M at 7% to fund domestic operations; quantify the $12.6M interest drag caused by the absence of a global cash pooling mechanism.",
        "rubric": "Map cash balances across all 24 entities; model physical vs notional pooling architectures; compute net interest savings from netting intercompany obligations and centralizing treasury sweep liquidity."
      },
      {
        "title": "Stochastic Miller-Orr Treasury Simulation Engine",
        "type": "mastery",
        "description": "Construct a stochastic treasury operations simulator in Python: simulate 252 business days of random cash inflows and outflows using geometric Brownian motion; enforce Miller-Orr lower limit L, return point Z, and upper limit H; trigger automated transfers to/from marketable securities; output daily cash charts and performance logs.",
        "rubric": "Generate stochastic cash flow paths with user-defined volatility; execute boundary-crossing rebalancing logic; track cumulative transaction fees and earned interest yield; generate visual plots displaying cash trajectory bouncing within control bands."
      },
      {
        "title": "The Banking Panic Liquidity Drain War Room",
        "type": "incident",
        "description": "Respond to a systemic banking contagion: the corporation's primary commercial bank faces credit rating downgrades and deposit runs; the company holds $90M in uninsured deposits exceeding the statutory guarantee limit; design an immediate 48-hour treasury evacuation plan into Treasury Bills, repo markets, and Tier-1 custodial banks.",
        "rubric": "Assess counterparty credit risk and uninsured deposit exposure; execute emergency sweep transactions into sovereign repo and money market mutual funds; formulate a multi-bank diversification policy setting counterparty concentration limits."
      }
    ]
  },
  {
    "day": 24,
    "month": 1,
    "blockNum": 5,
    "title": "Working Capital Management III: Accounts Receivable Optimization & Credit Policy",
    "stageName": "Stage 2: Capital Structure, Working Capital & Corporate Valuation",
    "stageNum": 2,
    "pedagogicalRole": "Trade Credit, Aging Schedules & Factoring Physics",
    "spokenGoal": "Offering trade credit is a powerful sales tool, but every credit sale is an unsecured loan from your corporate treasury to your customer. If credit standards are too loose, bad debt defaults will wipe out profits; if credit standards are too strict, customers will abandon you for competitors who offer flexible payment terms. Today, we master the financial mechanics of Credit Policy: evaluating changes in credit terms (e.g., shifting from Net 30 to 2/10 Net 45), conducting marginal profit vs carrying cost analysis, building dynamic Aging Schedules, and comparing Accounts Receivable Factoring (with or without recourse) against Forfaiting in international trade.",
    "conceptInvariant": "Credit Policy Marginal Profitability Invariant: A loosening of corporate credit terms creates shareholder value if and only if the marginal gross contribution margin from increased sales strictly exceeds the sum of marginal opportunity carrying costs of receivables and expected incremental bad debt losses.",
    "failureMode": "A solar panel distributor relaxes credit terms from Net 30 to Net 90 to boost revenues by 40%; customers take advantage of the free financing while defaults spike to 12%; receivables swell by $35M, funding costs surge, and uncollectible debts wipe out three years of accumulated corporate earnings.",
    "tryItFriction": "Build an Accounts Receivable Credit Policy Optimization Simulator: take baseline sales, proposed credit term extensions, early discount percentages, bad debt default curves, and corporate cost of capital; compute marginal contribution margin, incremental carrying costs, and net change in enterprise profit.",
    "socraticHints": [
      "What are the three components of cost incurred when a company extends trade credit to customers?",
      "1) Opportunity cost of capital tied up in receivables; 2) Administrative and collection costs; 3) Bad debt default losses.",
      "Any proposed credit liberalization must generate enough incremental gross margin to overpower all three costs combined."
    ],
    "situationalPuzzle": {
      "scenario": "A software distributor has current annual credit sales of $12,000,000 with Days Sales Outstanding (DSO) of 30 days. Variable costs are 70% of sales (Contribution Margin = 30%). Bad debts are 1% of sales. The VP of Sales proposes relaxing credit terms to Net 60: sales will increase by $2,400,000 (+20%), DSO will rise to 60 days on ALL sales, and bad debts will rise to 3% on incremental sales (existing sales remain at 1%). The cost of capital is 12%. Should the CFO approve the new credit policy?",
      "options": [
        "Reject because bad debts and DSO both increased.",
        "Approve! Incremental Contribution Margin = $720,000. Incremental Bad Debts = $72,000. Incremental Receivables carrying cost = $130,560. Net annual corporate profit increases by +$517,440!",
        "Approve only if customers pay in cash within 5 days.",
        "Reject because carrying costs always exceed gross margins."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us calculate marginal components: 1) Incremental Sales = $2,400,000. Marginal Contribution Margin (30%) = +$720,000. 2) Incremental Bad Debt = 3% on $2.4M = -$72,000. 3) Receivables carrying cost: Old Receivables = ($12M / 365) * 30 = $986,301. Old variable cost tied up = 70% * $986,301 = $690,411. New Receivables = ($14.4M / 365) * 60 = $2,367,123. New variable cost tied up = 70% * $2,367,123 = $1,656,986. Increase in capital tied up = $1,656,986 - $690,411 = $966,575. Annual carrying cost at 12% = $966,575 * 0.12 = -$115,989 (or ~$130K if based on full sales value). Net Annual Benefit = $720,000 - $72,000 - $115,989 = +$532,011. The substantial contribution margin easily justifies the higher working capital carrying cost."
    },
    "quests": [
      {
        "title": "Marginal Analysis of Trade Credit Policy Terms",
        "type": "concept",
        "description": "Formulate the mathematical model for evaluating credit policy modifications (credit period extension, cash discount offering 2/10 Net 30, and credit standards); derive the exact formulas for receivables carrying costs based on variable production costs vs full sales price.",
        "rubric": "Detail the algebraic equations for delta(Profit) = delta(Contribution Margin) - delta(Carrying Cost) - delta(Bad Debt) - delta(Discounts Taken); explain why carrying costs should be computed on variable cost of goods rather than selling price."
      },
      {
        "title": "The Aging Schedule & Hidden Non-Performing Invoices Forensic Audit",
        "type": "detective",
        "description": "Audit an enterprise software firm's receivables portfolio: the sales team reported an average DSO of 42 days, masking that 30% of invoices were over 120 days overdue in disputed contracts; reconstruct the true Aging Schedule (Current, 1-30, 31-60, 61-90, 90+ days), calculate required Expected Credit Loss (ECL) provisions under Ind AS 109, and reveal a $4.8M profit overstatement.",
        "rubric": "Disaggregate receivables into aging buckets; apply historic loss rate migration matrices; compute required bad debt reserves; demonstrate how aggregate DSO masked severe portfolio deterioration."
      },
      {
        "title": "Receivables Factoring vs In-House Credit Facility Engine",
        "type": "mastery",
        "description": "Build an enterprise credit and factoring evaluation tool in Python: model in-house credit administration costs, bad debt loss distributions, and working capital interest; compare against non-recourse and with-recourse factoring quotes (factoring commission, reserve holdback, and advance interest rates); determine the cost-minimizing strategy.",
        "rubric": "Compute effective annual financing rate for factoring facilities; model cash advance mechanics (e.g., 85% advance at SOFR + 200 bps, 1.5% fee); generate comparative cost schedules recommending when to retain vs factor receivables."
      },
      {
        "title": "The Customer Bankruptcy Default Contagion War Room",
        "type": "incident",
        "description": "Manage a credit crisis: the company's largest corporate client (representing 28% of outstanding receivables, $22M) files for Chapter 11 bankruptcy overnight; with immediate cash flow threatened, determine whether the receivables are secured or unsecured, calculate expected recovery rate, and negotiate debtor-in-possession (DIP) trade credit terms.",
        "rubric": "Evaluate bankruptcy priority claims (503(b)(9) administrative expense reclamation for goods received within 20 days); compute expected cents-on-the-dollar recovery; restructure ongoing supply agreements to require cash-in-advance or critical vendor status."
      }
    ]
  },
  {
    "day": 25,
    "month": 1,
    "blockNum": 5,
    "title": "Working Capital Management IV: Inventory Models & Supply Chain Finance",
    "stageName": "Stage 2: Capital Structure, Working Capital & Corporate Valuation",
    "stageNum": 2,
    "pedagogicalRole": "Inventory Optimization & Reverse Factoring Physics",
    "spokenGoal": "Inventory is often the largest, least liquid asset on a company's balance sheet. Holding too much inventory ties up expensive capital, incurs warehouse storage and insurance fees, and risks obsolescence; holding too little inventory causes stockouts, halts production lines, and alienates customers. Today, we master the mathematics of Inventory Management: Ford Whitman Harris's Economic Order Quantity (EOQ = sqrt(2*D*S / H)), safety stock sizing under stochastic lead-time demand, reorder point (ROP) calculation, and modern Supply Chain Financing (Reverse Factoring / Dynamic Discounting) that optimizes working capital across the entire supply ecosystem.",
    "conceptInvariant": "Economic Order Quantity Duality Invariant: In the classic EOQ model, the total annual inventory cost curve reaches its absolute minimum at the exact order quantity Q* where total annual ordering costs equal total annual holding costs: (D/Q)*S = (Q/2)*H.",
    "failureMode": "An industrial distributor orders components in massive batches to get a 2% bulk supplier discount; the large orders overwhelm warehouses, ballooning holding costs (carrying cost = 28% of inventory) and causing component obsolescence that destroys $4.2M—wiping out the 2% discount twelve times over.",
    "tryItFriction": "Construct an EOQ, Safety Stock & Supply Chain Finance Engine in Python: take annual demand, ordering costs, holding costs, lead-time demand standard deviations, and service level targets (Z-scores); compute EOQ, safety stock buffer, reorder points, and evaluate a dynamic supplier discounting program.",
    "socraticHints": [
      "Why does total annual inventory cost minimize at the exact point where annual holding costs equal annual ordering costs in the EOQ model?",
      "Because holding cost is linear in order quantity (Q/2 * H) while ordering cost is inversely proportional (D/Q * S).",
      "Taking the derivative of total cost with respect to Q and setting it to zero yields H/2 - D*S/Q^2 = 0 => Q* = sqrt(2DS/H), where the two costs are mathematically identical."
    ],
    "situationalPuzzle": {
      "scenario": "A manufacturer uses 50,000 units of a raw material annually. Each order costs $200 to process. Annual inventory carrying cost is $5.00 per unit. The supplier offers a 1% price discount on the $50 purchase price ($0.50 discount per unit) if the manufacturer orders in minimum batch sizes of 10,000 units. Baseline EOQ is 2,000 units. Should the manufacturer accept the quantity discount?",
      "options": [
        "Yes, because saving 1% on 50,000 units saves $25,000, which is always positive.",
        "No! At EOQ (2,000 units), annual order + holding cost is $10,000. Ordering 10,000 units cuts ordering costs to $1,000 but spikes holding costs to (10,000/2) * $4.95 = $24,750 (total $25,750). The incremental inventory cost ($15,750) partially offsets the $25,000 savings, yielding a net gain of $9,250—so the manufacturer SHOULD accept the discount!",
        "No, because batch sizes must never exceed EOQ under any circumstances.",
        "Quantity discounts are illegal under corporate procurement guidelines."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us do the full math: 1) Baseline EOQ = sqrt(2 * 50,000 * 200 / 5.00) = sqrt(4,000,000) = 2,000 units. Baseline annual inventory cost = (50,000/2,000)*$200 + (2,000/2)*$5 = $5,000 + $5,000 = $10,000. Total cost = 50,000 * $50 + $10,000 = $2,510,000. 2) Discount Option: Price = $49.50. Carrying cost H = 10% * $49.50 = $4.95 (or flat $5). Annual ordering cost = (50,000/10,000)*$200 = $1,000. Annual holding cost = (10,000/2)*$4.95 = $24,750. Total inventory cost = $25,750. Inventory cost INCREASED by $15,750. BUT purchase cost savings = 50,000 * $0.50 = $25,000! Net annual savings = $25,000 - $15,750 = +$9,250. The discount creates value because purchase price savings overpower the higher holding cost."
    },
    "quests": [
      {
        "title": "Mathematical Derivation of EOQ, Safety Stock & Reorder Points",
        "type": "concept",
        "description": "Derive the Economic Order Quantity from the total cost function TC = D*P + (D/Q)*S + (Q/2)*H; formulate the Safety Stock equation SS = Z * sigma_L under normal lead-time demand; define Reorder Point ROP = (d_bar * L) + SS and explain service level trade-offs.",
        "rubric": "Provide complete first-order and second-order calculus derivations; show how stockout probability relates to normal Z-score; derive the total cost equation incorporating safety stock holding costs."
      },
      {
        "title": "The Bullwhip Effect & Supply Chain Bloat Forensic Audit",
        "type": "detective",
        "description": "Audit an electronics manufacturer during a consumer electronics demand shift: trace how a 5% retail demand dip magnified into a 15% distributor order cut and a 45% component supplier cancellation (the Bullwhip Effect); calculate how batch ordering and price speculation trapped $85M of excess inventory in factory warehouses.",
        "rubric": "Model the multi-echelon supply chain variance amplification (Forrester effect); compute variance of orders vs variance of demand; demonstrate how implementing vendor-managed inventory (VMI) dampens the bullwhip oscillation."
      },
      {
        "title": "Enterprise Inventory Optimization & Reverse Factoring Engine",
        "type": "mastery",
        "description": "Construct an institutional inventory and supply chain financing tool in Python: calculate dynamic EOQ and safety stock matrices across 1,000 SKU profiles; model a Reverse Factoring program where investment-grade buyers allow SME suppliers to factor invoices at the buyer's low borrowing rate; compute cash flow gains for both buyer and supplier.",
        "rubric": "Vectorized calculation of SKU optimal order sizes and reorder thresholds; implement reverse factoring cash model showing extended buyer DPO (e.g., from 45 to 90 days) alongside early supplier liquidity at discounted interest rates."
      },
      {
        "title": "The Just-In-Time Supply Chain Disruption War Room",
        "type": "incident",
        "description": "Navigate a global supply chain emergency: geopolitical conflict shuts down a maritime canal, extending component shipping lead times from 14 days to 45 days and tripling lead-time variance; safety stocks will deplete in 96 hours, threatening a complete automotive factory shutdown costing $2M/day; design an emergency freight and buffer stock strategy.",
        "rubric": "Calculate immediate stockout risk; evaluate emergency air-freight costs vs plant shutdown penalties ($2M/day); re-dimension post-crisis safety stocks and negotiate dual-sourcing contracts to eliminate single-point-of-failure vulnerabilities."
      }
    ]
  },
  {
    "day": 26,
    "month": 1,
    "blockNum": 6,
    "title": "Short-Term Financing Strategies, Working Capital Policies & Trade Credit Cost",
    "stageName": "Stage 2: Capital Structure, Working Capital & Corporate Valuation",
    "stageNum": 2,
    "pedagogicalRole": "Working Capital Financing Strategies & Trade Credit Physics",
    "spokenGoal": "How should a corporation finance its current assets? Permanent current assets—the minimum baseline inventory and receivables needed to keep the doors open—behave economically like long-term fixed assets. Today, we master the three fundamental Working Capital Financing Strategies: the Maturity Matching (Hedging) Approach (financing permanent assets with long-term capital and seasonal assets with short-term debt), the Aggressive Approach (financing permanent assets with cheap short-term debt, accepting high rollover and interest rate risk), and the Conservative Approach. We also derive the costly Trade Credit equation: failing to take an early payment discount like '2/10 Net 30' costs a shocking 44.6% annualized interest!",
    "conceptInvariant": "Cost of Trade Credit Invariant: Forgoing a cash discount with terms 'd / t_discount Net t_net' carries an annualized effective cost of Nominal Cost = [ d / (1 - d) ] * [ 365 / (t_net - t_discount) ], with an Effective Annual Rate EAR = (1 + d / (1 - d))^(365 / (t_net - t_discount)) - 1; trade credit is among the most expensive financing sources in corporate finance.",
    "failureMode": "A cash-strapped restaurant chain routinely skips early payment discounts on '2/10 Net 30' supplier invoices, paying on day 30 instead; the controller thinks: 'It's just a 2% fee'; in reality, the company is borrowing money at an astronomical 44.6% effective annual interest rate, bleeding $850,000 annually in disguised financing costs.",
    "tryItFriction": "Build a Working Capital Financing Strategy & Trade Credit Engine in Python: take seasonal vs permanent asset schedules; model Conservative vs Aggressive vs Matching financing mix; compute total interest expense under interest rate shifts; compute exact nominal and EAR costs of trade credit terms.",
    "socraticHints": [
      "Why is the true cost of passing up '2/10 Net 30' equal to over 44% per year, even though the discount is only 2%?",
      "Because you are paying a 2% fee for borrowing money for just 20 days (from day 10 to day 30).",
      "There are approximately 18.25 twenty-day periods in a 365-day year; compounding 2.04% over 18.25 periods yields an effective annual rate of (1.0204)^18.25 - 1 = 44.59%!"
    ],
    "situationalPuzzle": {
      "scenario": "A retailer has an invoice for $100,000 with terms '3/15 Net 45'. The retailer has an unused revolving bank credit line available at an interest rate of 9.0% per annum. The controller is considering skipping the discount and paying on Day 45 to preserve cash. What should the CFO order?",
      "options": [
        "Skip the discount because paying on Day 45 keeps $100,000 in the bank for an extra 30 days.",
        "Borrow from the bank line at 9.0% on Day 15 to take the discount ($97,000 paid)! Forgoing the discount carries an effective annual cost of 44.86%; borrowing at 9% to save 44.86% generates $2,282 in net profit on this single invoice!",
        "Wait until Day 60 to pay so the effective cost declines.",
        "Pay on Day 1 to get a 6% discount."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us calculate the true cost of trade credit: Nominal cost = [ 0.03 / (1 - 0.03) ] * [ 365 / (45 - 15) ] = (0.03 / 0.97) * (365 / 30) = 0.03093 * 12.167 = 37.63%. Effective Annual Rate EAR = (1 + 0.03093)^12.167 - 1 = 44.86%! If the firm borrows $97,000 from its bank line at 9.0% for 30 days, interest paid to the bank is $97,000 * 0.09 * (30/365) = $717.53. Cash saved by taking the discount = $3,000. Net profit from borrowing to take the discount = $3,000 - $717.53 = $2,282.47! Passing up discounts when bank credit is available at 9% is financial negligence."
    },
    "quests": [
      {
        "title": "Mathematical Derivation of Nominal & Effective Trade Credit Cost",
        "type": "concept",
        "description": "Derive the nominal APR and compounding EAR formulas for trade credit terms d / t_d Net t_n; prove how compounding frequency amplifies borrowing costs; analyze the risk-return trade-offs of Aggressive, Conservative, and Hedging working capital financing strategies.",
        "rubric": "Derive both nominal and EAR equations from first principles; construct graphical profiles comparing the three financing strategies across changing yield curve environments (normal vs inverted yield curves)."
      },
      {
        "title": "The Commercial Paper Rollover Freeze Forensic Audit",
        "type": "detective",
        "description": "Audit an investment bank / corporate issuer during the 2008 Lehman collapse: analyze how relying on an Aggressive working capital strategy (financing 3-year subprime mortgages with 30-day asset-backed commercial paper) triggered instant insolvency when the CP market froze overnight and paper could not be rolled over.",
        "rubric": "Track asset-liability duration mismatch; compute daily rollover refinancing requirements; prove that a maturity mismatch turned an asset solvency issue into an acute liquidity collapse within 72 hours."
      },
      {
        "title": "Working Capital Financing Policy Simulator",
        "type": "mastery",
        "description": "Build an enterprise working capital policy simulation suite in Python: model seasonal operating asset cycles with peaks and troughs; allocate funding across short-term bank debt, long-term bonds, and equity under Conservative, Matching, and Aggressive policies; simulate interest rate shocks and quantify portfolio profitability and default risk.",
        "rubric": "Implement dynamic asset modeling over 12 months; calculate monthly interest expense across varying short-term and long-term borrowing rates; output comparative cost and liquidity risk metrics for all three financing approaches."
      },
      {
        "title": "The Supplier Credit Extension & Relationship Breach War Room",
        "type": "incident",
        "description": "Handle an executive cash preservation directive: the CEO unilaterally orders the treasury to stretch trade payables from Net 30 to Net 75 without notifying vendors; three critical tier-1 suppliers halt component shipments, halting assembly plants; negotiate an emergency supply resumption structure using supply chain finance guarantees.",
        "rubric": "Quantify supplier relationship friction and lost production penalties; evaluate supply chain reverse factoring where suppliers receive immediate bank payment at 4% while the buyer repays on Day 75; structure a win-win compromise that preserves cash without plant shutdowns."
      }
    ]
  },
  {
    "day": 27,
    "month": 1,
    "blockNum": 6,
    "title": "Dividend Policy I: Walter's Model, Gordon's Model & Residual Dividend Mechanics",
    "stageName": "Stage 2: Capital Structure, Working Capital & Corporate Valuation",
    "stageNum": 2,
    "pedagogicalRole": "Dividend Valuation Models & Growth Physics",
    "spokenGoal": "How much cash should a company pay out to its shareholders as dividends, and how much should it retain to fund future growth? Today, we dissect the classic Dividend Valuation Models: James Walter's Model, Myron Gordon's 'Bird-in-the-Hand' Model, and the Residual Dividend Policy. Walter's model proves an elegant mathematical truth: if the firm's internal rate of return on reinvestment (r) exceeds the shareholders' required return (Ke), the firm should retain 100% of earnings (payout ratio = 0%); if r < Ke, the firm should pay out 100% of earnings! We will also master the Residual Dividend policy used by major industrial firms to fund all positive-NPV projects before paying a dime in dividends.",
    "conceptInvariant": "Walter's Reinvestment Rate Optimality Invariant: In Walter's model P = [ D + (r / Ke) * (E - D) ] / Ke, the optimal dividend payout ratio is 0% when r > Ke (growth firm), 100% when r < Ke (declining firm), and completely irrelevant when r = Ke (normal firm).",
    "failureMode": "A mature coal mining company with an internal return on capital of 4% (r < Ke of 11%) retains 80% of its earnings to build speculative diversified businesses; Walter's model proves this reinvestment destroys value; the stock trades at a 45% discount to book value until an activist forces a 100% dividend payout.",
    "tryItFriction": "Build a Walter's & Gordon's Dividend Model Analyzer in Python: take EPS, cost of equity Ke, internal rate of return r, and dividend payout ratios from 0% to 100%; compute share prices under Walter's model and Gordon's growth model; identify the optimal dividend payout ratio across growth, normal, and declining firm regimes.",
    "socraticHints": [
      "Why should a growth company with r > Ke pay zero dividends according to Walter's model?",
      "Because every dollar retained inside the company generates a return r that is higher than what shareholders could earn on their own (Ke).",
      "Retaining earnings compounds wealth faster inside the company than in the shareholders' personal portfolios."
    ],
    "situationalPuzzle": {
      "scenario": "A company has Earnings Per Share (EPS) of $10. Its cost of equity (Ke) is 10%. Case 1: Growth firm with r = 15%. Case 2: Declining firm with r = 8%. Using Walter's formula P = [ D + (r / Ke) * (E - D) ] / Ke, what are the share prices under a 0% payout (D = $0) vs a 100% payout (D = $10) for both cases?",
      "options": [
        "Share price is $100 in all cases because earnings are $10.",
        "Case 1 (r=15%): P(0% payout) = $150, P(100% payout) = $100 => Payout 0% maximizes value! Case 2 (r=8%): P(0% payout) = $80, P(100% payout) = $100 => Payout 100% maximizes value!",
        "Case 1 share price is $200; Case 2 is $50.",
        "Walter's model is invalid for dividend payouts above 50%."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us apply Walter's formula: P = [ D + (r / Ke)*(E - D) ] / Ke. For Case 1 (r = 15%, Ke = 10%): At 0% payout (D = 0): P = [ 0 + (0.15/0.10)*(10 - 0) ] / 0.10 = [ 1.5 * 10 ] / 0.10 = $15 / 0.10 = $150! At 100% payout (D = 10): P = [ 10 + 1.5*(10 - 10) ] / 0.10 = $10 / 0.10 = $100. Retaining all earnings adds $50/share in value! For Case 2 (r = 8%, Ke = 10%): At 0% payout (D = 0): P = [ 0 + (0.08/0.10)*(10) ] / 0.10 = [ 0.8 * 10 ] / 0.10 = $8 / 0.10 = $80. At 100% payout (D = 10): P = [ 10 + 0 ] / 0.10 = $100. Paying out all earnings avoids value destruction, increasing share price from $80 to $100."
    },
    "quests": [
      {
        "title": "Mathematical Derivations of Walter's and Gordon's Dividend Models",
        "type": "concept",
        "description": "Derive Walter's formula from capitalized dividend and retained earnings streams; derive Gordon's model P0 = D1 / (Ke - g) where g = b * r (retention ratio times return on equity); explain Myron Gordon's 'Bird-in-the-Hand' argument regarding the risk discount of future capital gains.",
        "rubric": "Step-by-step mathematical proof of Walter's model; prove that dP/dD > 0 if r < Ke, dP/dD < 0 if r > Ke, and dP/dD = 0 if r = Ke; derive Gordon's growth equation and explain why investors may prefer certain dividends today over uncertain future capital gains."
      },
      {
        "title": "The Residual Dividend Capital Budgeting Forensic Audit",
        "type": "detective",
        "description": "Audit an oil major's 5-year capital deployment: total earnings were $12B, capital budget required $10B with a target debt-to-equity ratio of 40% (equity needed = $6.0B); compute the residual dividend ($12B - $6B = $6B); demonstrate how deviating from residual policy by paying $8B in dividends forced the company to borrow expensive debt, destroying WACC efficiency.",
        "rubric": "Reconstruct equity financing requirements for capital budget; calculate exact residual dividend; prove that paying above residual dividend diluted equity value through unnecessary debt issuance."
      },
      {
        "title": "Enterprise Dividend Policy & Valuation Simulation Suite",
        "type": "mastery",
        "description": "Develop a multi-model dividend policy analytics tool in Python: simulate corporate earnings across 10 years; compute optimal dividend trajectories under Walter's Model, Gordon's Model, Constant Payout Ratio, Stable Dollar Dividend with Growth, and Residual Dividend Policy; plot comparative shareholder return curves.",
        "rubric": "Implement all 5 dividend policies; calculate dynamic share price and dividend yields; output comparative visual charts showing earnings retention, dividend stability, and stock price volatility under cyclical economic shocks."
      },
      {
        "title": "The Dividend Cut Wall Street Backlash War Room",
        "type": "incident",
        "description": "Manage a high-stakes corporate communication crisis: a utility company facing massive green-energy grid Capex cuts its 40-year historic quarterly dividend by 50% to fund the infrastructure; retail investors dump the stock, causing a 22% single-day crash; design an institutional investor presentation demonstrating that the cut funds high-ROIC projects that maximize long-term shareholder wealth.",
        "rubric": "Analyze the dividend signaling effect and retail clientele disruption; structure a transparent capital allocation bridge showing incremental project IRR (14%) vs Ke (8%); formulate a phased restoration dividend guidance to stabilize market valuation."
      }
    ]
  },
  {
    "day": 28,
    "month": 1,
    "blockNum": 6,
    "title": "Dividend Policy II: Modigliani-Miller Dividend Irrelevance & Signaling Physics",
    "stageName": "Stage 2: Capital Structure, Working Capital & Corporate Valuation",
    "stageNum": 2,
    "pedagogicalRole": "Dividend Irrelevance & Signaling Theory Physics",
    "spokenGoal": "In 1961, Franco Modigliani and Merton Miller struck again with another Nobel-prize-winning bombshell: the Dividend Irrelevance Theorem. In a frictionless world without taxes or transaction costs, a company's dividend policy has ZERO impact on its share price or shareholder wealth! If a company pays no dividend, an investor who wants cash can simply sell a fraction of their shares ('Homemade Dividends'). Conversely, if a company pays an unwanted dividend, the investor can reinvest it. What determines firm value is real investment policy and operating cash flows, not the dividend payout! Today, we master the MM proof, dissect Homemade Dividends, and understand why dividends matter in the real world: Information Signaling and Tax Clienteles.",
    "conceptInvariant": "MM Dividend Irrelevance Invariant: In perfect capital markets, the value of a firm is determined entirely by its basic earning power and investment policy; dividend policy merely alters the division of total shareholder return between cash dividends and capital gains, leaving total shareholder wealth strictly unchanged.",
    "failureMode": "A board of directors rejects an outstanding $50M factory expansion (NPV +$20M) because funding it would require pausing the company's dividend for two quarters; prioritizing dividend continuity over positive-NPV investments forfeits $20M in shareholder wealth, violating the core principle of corporate finance.",
    "tryItFriction": "Build an MM Dividend Irrelevance & Homemade Dividend Engine in Python: take a firm that pays zero dividends vs a firm that pays 10% dividends; model an investor desiring 5% annual cash flow; simulate homemade dividend creation via share sales; prove that the investor's total wealth (cash + remaining stock) is mathematically identical in both cases.",
    "socraticHints": [
      "What happens to a company's stock price on the ex-dividend date in a frictionless market?",
      "The stock price drops by exactly the dollar amount of the dividend per share.",
      "Cash has left the company's balance sheet and entered the shareholder's pocket; the shareholder has $D in cash and $P_0 - D in stock, leaving total wealth identical to P_0."
    ],
    "situationalPuzzle": {
      "scenario": "An investor owns 100 shares of TechCorp trading at $100/share (Total wealth = $10,000). TechCorp declares a $10/share dividend. On the ex-dividend date, the stock drops to $90/share. The investor receives $1,000 in cash and holds 100 shares worth $9,000 (Total wealth = $10,000). If TechCorp had paid ZERO dividend, how could the investor have created an identical financial outcome?",
      "options": [
        "Borrow $1,000 from a commercial bank at 10% interest.",
        "Sell 10 shares of TechCorp at $100/share! The investor receives $1,000 in cash and holds 90 shares worth $100/share = $9,000, achieving the exact same $1,000 cash and $9,000 stock portfolio (Total wealth = $10,000)!",
        "The investor cannot replicate the dividend without corporate approval.",
        "Short sell 10 shares of a competitor."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is the exact Modigliani-Miller Homemade Dividend proof. By selling 10 shares of stock at $100, the investor generates $1,000 in cash and retains 90 shares valued at $100/share = $9,000. In both cases, the investor ends up with exactly $1,000 cash and $9,000 of stock. The corporate dividend decision created zero unique economic value. If transaction costs and taxes are zero, investors can tailor their own cash flow streams regardless of corporate dividend policy."
    },
    "quests": [
      {
        "title": "Mathematical Proof of MM Dividend Irrelevance Theorem",
        "type": "concept",
        "description": "Prove MM's Dividend Irrelevance Theorem algebraically: show that if a firm pays dividends while maintaining its investment budget, it must issue new equity to replace the distributed cash; prove that the dilution from new shares exactly offsets the cash received by existing shareholders.",
        "rubric": "Step-by-step algebraic proof showing P_0 = [ D_1 + P_1 ] / (1 + Ke); express new share issuance m * P_1 = I - (E - D); substitute to prove total firm value n * P_0 is independent of D_1."
      },
      {
        "title": "Bhattacharya & John-Williams Dividend Signaling Forensic Audit",
        "type": "detective",
        "description": "Audit an unexpected 25% dividend hike by a banking corporation: analyze the market reaction (+7.5% stock surge); model the cash burn and dissipative signaling cost (paying cash taxes and forgoing internal liquidity) that made the dividend hike a credible, un-fakeable signal of future earnings quality.",
        "rubric": "Apply Bhattacharya signaling model; quantify the deadweight cost of paying taxable dividends; prove why low-quality firms cannot mimic the signal without triggering catastrophic liquidity failure."
      },
      {
        "title": "Dividend Clientele & Ex-Day Price Drop Simulation Engine",
        "type": "mastery",
        "description": "Construct an ex-dividend trading and tax clientele simulation in Python: model the Elton-Gruber ex-day price drop ratio (P_cum - P_ex) / D = (1 - T_div) / (1 - T_cg); simulate stock price behavior across varying tax regimes (zero dividend tax vs high dividend tax); demonstrate how tax clienteles sort into high-dividend vs low-dividend stocks.",
        "rubric": "Implement Elton-Gruber ex-day price drop equation; test historical ex-dividend price movements; demonstrate how tax differentials between dividends and capital gains prevent the stock price from dropping by 100% of the dividend in taxable markets."
      },
      {
        "title": "The Activist Special Dividend vs Capex Battle War Room",
        "type": "incident",
        "description": "Lead a boardroom defense against an activist fund demanding an immediate $1.2B special cash dividend from corporate treasury reserves; management has planned a multi-year battery gigafactory with an estimated NPV of +$450M; synthesize MM irrelevance, tax drag, and strategic reinvestment to defend the capital allocation plan.",
        "rubric": "Quantify the tax leakage of a $1.2B cash distribution to shareholders; compare the return from internal reinvestment (18% ROIC) against external redeployment; structure a compromised multi-year dividend growth plus opportunistic share buyback policy that preserves factory Capex."
      }
    ]
  },
  {
    "day": 29,
    "month": 1,
    "blockNum": 6,
    "title": "Share Repurchases vs Cash Dividends: Dilution, Tax Arbitrage & EPS Fallacies",
    "stageName": "Stage 2: Capital Structure, Working Capital & Corporate Valuation",
    "stageNum": 2,
    "pedagogicalRole": "Capital Return Mechanisms & Buyback Physics",
    "spokenGoal": "Over the past three decades, share repurchases (buybacks) have eclipsed traditional cash dividends as the primary vehicle for returning capital to shareholders. Today, we dissect the financial mechanics of share repurchases across open-market buybacks, tender offers, and Dutch auctions. We will debunk Wall Street's most pervasive myth: that 'buybacks always create value because they reduce share count and increase EPS!' In truth, buybacks only create value if shares are repurchased below intrinsic value! Crucially, we analyze the tax timing advantages of buybacks over dividends and how buybacks offset executive stock option dilution.",
    "conceptInvariant": "Share Repurchase Value Invariant: Repurchasing shares at intrinsic value is a zero-NPV transaction that leaves intrinsic value per remaining share completely unchanged; buybacks create shareholder wealth for remaining investors if and only if shares are repurchased at a market price below intrinsic value (P_market < P_intrinsic).",
    "failureMode": "A CEO executes a $2B share repurchase program at the cyclical peak of the market when the stock trades at 45x earnings to boost EPS and trigger executive compensation vesting; within 18 months, the industry downcycles and the stock drops 65%; the company squandered $2B of cash buying overvalued equity, leaving it dangerously levered during the recession.",
    "tryItFriction": "Build an Institutional Share Buyback vs Dividend Modeling Suite in Python: model an enterprise distributing $100M via cash dividend vs share repurchase; calculate post-transaction share price, share count, EPS, and P/E ratio; prove mathematically that intrinsic value per share is identical under fair market pricing.",
    "socraticHints": [
      "Why does an increase in Earnings Per Share (EPS) resulting from a share buyback NOT automatically mean the stock price will rise?",
      "Because when a company uses cash to buy back shares, it reduces its cash balance or adds debt, making the firm riskier or reducing interest income.",
      "The price-to-earnings (P/E) multiple must mathematically contract to reflect the lost cash or higher debt risk, leaving share price unchanged if shares were fairly priced."
    ],
    "situationalPuzzle": {
      "scenario": "A firm has 1,000,000 shares trading at $100/share (Market Cap = $100M). Excess cash is $20M and annual net income is $10M (EPS = $10, P/E = 10x). The firm uses the entire $20M in cash to repurchase 200,000 shares at $100/share. Remaining shares = 800,000. Cash earns 0% interest. Post-buyback net income remains $10M. New EPS = $10M / 800,000 = $12.50 (+25% increase). What is the post-buyback stock price?",
      "options": [
        "The stock price surges by 25% to $125/share because EPS increased by 25%.",
        "The stock price remains EXACTLY $100/share! Enterprise equity value is now $100M - $20M cash spent = $80M. Dividing by 800,000 remaining shares yields $80M / 800,000 = $100.00 per share! The EPS surge was accompanied by a P/E multiple contraction from 10.0x to 8.0x ($100 / $12.50 = 8.0x)!",
        "The stock price drops to $80/share because cash left the company.",
        "Share repurchases cannot be executed when P/E equals 10x."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is the definitive mathematical proof that EPS accretion from buybacks is an optical illusion that does NOT automatically create wealth. Prior to buyback: Total Equity = $100M across 1,000,000 shares = $100/share. When the firm spends $20M in cash to buy back shares at $100, remaining equity is $80M across 800,000 shares = $80M / 800,000 = $100/share. EPS indeed rose from $10.00 to $12.50, but the P/E ratio fell from 10.0x to 8.0x ($100 / $12.50). The shareholders' wealth per share did not change by a single penny. Wealth is only created if the company buys back shares at a discount to intrinsic value."
    },
    "quests": [
      {
        "title": "Mathematical Proof of Buyback Neutrality & Intrinsic Value Thresholds",
        "type": "concept",
        "description": "Prove that repurchasing shares at intrinsic value leaves per-share intrinsic value invariant; derive the condition under which buybacks transfer wealth from selling shareholders to continuing shareholders (P_repurchase < P_intrinsic); debunk the EPS accretion fallacy.",
        "rubric": "Formulate pre- and post-buyback equity value equations; derive P_post = (V_0 - Cash) / (N_0 - Cash/P_rep); prove that P_post > P_0 if and only if P_rep < P_0."
      },
      {
        "title": "The Peak-Cycle Buyback Destruction Forensic Audit",
        "type": "detective",
        "description": "Audit General Electric's or Boeing's multi-billion-dollar share repurchase programs executed between 2014 and 2018: calculate the average repurchase price vs post-crisis intrinsic value; prove that spending $35B on repurchases depleted liquidity buffers and destroyed over $18B in shareholder capital when the companies later had to issue dilutive emergency equity at bottom-cycle prices.",
        "rubric": "Extract historical buyback volumes and average purchase prices; compare against subsequent cyclical trough share prices; calculate the net value destruction and trace the resulting credit rating downgrade."
      },
      {
        "title": "Dutch Auction & Tender Offer Valuation Suite",
        "type": "mastery",
        "description": "Build an enterprise share repurchase execution simulator in Python: model open market share repurchases subject to SEC Rule 10b-18 volume limits (25% ADTV) vs fixed-price tender offers vs Dutch Auction tender offers; calculate clearing prices, shareholder participation curves, and post-buyback capital structures.",
        "rubric": "Implement Dutch auction clearing algorithm across an array of shareholder tender bids; compute clearing price that satisfies the buyback budget; output post-execution share count, EPS, and tax incidence for participating vs non-participating shareholders."
      },
      {
        "title": "The Dilution Offset & Executive Compensation War Room",
        "type": "incident",
        "description": "Investigate a governance controversy: an activist investor reveals that the company spent $600M on share buybacks over 3 years, but outstanding share count never decreased because buybacks merely soaked up massive executive stock option exercises; evaluate whether corporate cash was misused to enrich insiders and design an anti-dilution governance mandate.",
        "rubric": "Reconstruct stock option grants, exercises, and buyback share retirements; quantify the net cash transferred to executives vs public shareholders; establish a strict clawback and capital return governance policy requiring net share count reduction."
      }
    ]
  },
  {
    "day": 30,
    "month": 1,
    "blockNum": 6,
    "title": "Capstone 1: ApexTreasury Enterprise Corporate Finance & Working Capital Optimization Suite",
    "stageName": "Stage 2: Capital Structure, Working Capital & Corporate Valuation",
    "stageNum": 2,
    "pedagogicalRole": "Comprehensive Corporate Financial Architecture Capstone",
    "spokenGoal": "Congratulations on completing Month 1 of Business Finance & Investment Management! Today, you synthesize every single principle mastered across Days 1 through 29 into our first comprehensive masterwork: Capstone 1 — ApexTreasury Enterprise Corporate Finance & Working Capital Optimization Suite! You will architect an institutional-grade corporate treasury platform that integrates Capital Budgeting (multi-project NPV/IRR/PI under capital rationing), WACC Optimization (Hamada unlevering, debt capacity, and marginal tax shields), Cash Conversion Cycle Analytics (automated DIO/DSO/DPO tracking), and Capital Return Decisioning (Dividends vs Share Repurchases). Today, you face the Master Capstone Viva Gate!",
    "conceptInvariant": "Holistic Corporate Finance Invariant: Enterprise financial health is an interconnected thermodynamic system: operational working capital velocity feeds free cash flow, capital budgeting allocates free cash flow to positive-NPV assets, capital structure optimizes the financing hurdle rate (WACC), and payout policy distributes residual wealth; sub-optimizing any single component degrades total enterprise value.",
    "failureMode": "A corporate conglomerate operates capital budgeting, treasury cash management, and capital structure in isolated silos; the treasury borrows high-cost short-term debt to fund receivables while the Capex committee approves low-return projects using an outdated firm-wide hurdle rate and the board pays debt-funded dividends; the fragmented governance destroys $300M in enterprise value before an activist forces a total management overhaul.",
    "tryItFriction": "Architect and Execute Capstone 1: ApexTreasury in Python/TypeScript: ingest multi-subsidiary financials; compute divisional risk-adjusted WACCs; solve a 0/1 knapsack multi-period capital rationing problem for a $150M Capex pipeline; optimize working capital to liberate $25M in trapped liquidity; formulate an optimal dividend vs buyback policy; and defend your boardroom allocation strategy against an aggressive senior evaluator panel.",
    "socraticHints": [
      "How does optimizing the Cash Conversion Cycle directly lower the company's Weighted Average Cost of Capital (WACC)?",
      "By releasing permanent working capital cash, the firm reduces its requirement for expensive external debt and equity financing.",
      "A leaner balance sheet lowers financial leverage risk, compresses credit spreads, and reduces equity beta, driving down the overall corporate hurdle rate."
    ],
    "situationalPuzzle": {
      "scenario": "As newly appointed Group CFO of ApexGlobal Enterprises, you face a board dilemma: The firm has $100M in operating cash flow. 1) Division A has a $60M project yielding 14% (Divisional Hurdle = 10%). 2) Division B has a $40M project yielding 11% (Divisional Hurdle = 13%). 3) Working capital is bloated with a CCC of 85 days (Industry benchmark = 45 days, trapping $30M). 4) Debt-to-Equity is 1.2x (Investment grade requires <= 0.6x). 5) Shareholders demand a $40M dividend. What integrated strategy maximizes shareholder wealth?",
      "options": [
        "Pay the $40M dividend immediately, borrow $100M from banks, and fund both projects equally.",
        "Fund Division A ($60M, +4% spread), REJECT Division B (11% < 13% hurdle, avoids -$800K EVA destruction), optimize CCC to liberate $30M from working capital, use surplus cash to retire $30M in high-coupon debt to restore investment-grade rating, and pay a $20M residual dividend! This integrated plan creates $18.4M in net shareholder value!",
        "Reject all projects and use 100% of cash flow to pay a special dividend.",
        "Sell Division A to private equity and double down on Division B."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This represents the synthesis of Month 1 corporate financial mastery: 1) Capital Budgeting: Division A creates economic value (+4% spread on $60M = +$2.4M annual EVA). Division B destroys value (11% return on 13% hurdle = -$800K annual EVA) and must be rejected. 2) Working Capital: Shaving 40 days from CCC unlocks $30M in permanent non-debt cash. 3) Capital Structure: Deploying liberated cash to pay down debt reduces leverage toward the target 0.6x D/E, preserving credit rating and lowering WACC. 4) Payout Policy: Total cash available = $100M OCF + $30M WC liberation - $60M Project A = $70M. Allocating $50M to debt paydown and $20M to residual dividend maximizes long-term shareholder wealth while satisfying governance discipline."
    },
    "quests": [
      {
        "title": "ApexTreasury Architecture: Enterprise Corporate Finance Data Specification",
        "type": "concept",
        "description": "Design the end-to-end data architecture and mathematical specifications for the ApexTreasury platform: specify the schema for multi-entity capital structures, divisional beta adjustments, stochastic cash flow pipelines, and working capital telemetry feeds.",
        "rubric": "Deliver comprehensive architectural schema and mathematical formulas covering WACC engine, knapsack capital budgeting, Miller-Orr stochastic bounds, and residual payout distribution logic."
      },
      {
        "title": "The Conglomerate Capital Misallocation Forensic Audit",
        "type": "detective",
        "description": "Perform an exhaustive forensic audit on ApexGlobal's historical 5-year capital deployment: unearth $85M in misallocated capital across unadjusted hurdle rates, delayed receivables collections, and debt-funded share repurchases; quantify the exact erosion of Economic Value Added (EVA).",
        "rubric": "Audit project portfolios, CCC metrics, and debt schedules; calculate the multi-year EVA destruction; prepare a comprehensive root-cause analysis report for the Board of Directors."
      },
      {
        "title": "Capstone 1 Core: ApexTreasury Full-Stack Execution Engine",
        "type": "mastery",
        "description": "Engineer Capstone 1 in Python: build the complete integrated ApexTreasury engine: 1) Multi-project capital allocator with integer programming budget optimization; 2) Dynamic WACC & Hamada levering module; 3) Working capital CCC optimizer with supplier discounting; 4) Payout optimizer balancing debt paydown vs share buybacks vs dividends.",
        "rubric": "Clean, modular Python implementation executing all four core modules; automated validation tests verifying mathematical convergence across all modules; production of an executive PDF/HTML dashboard summarizing enterprise recommendations."
      },
      {
        "title": "Master Capstone 1 Viva Voce: Boardroom Capital Allocation Defense",
        "type": "incident",
        "description": "Defend the ApexTreasury capital allocation architecture in a live simulated Board of Directors Viva Voce: withstand cross-examination from an activist investor, the Audit Committee Chair, and a conservative patriarch demanding higher dividends; justify every capital expenditure, hurdle rate, and working capital optimization with mathematical proofs and stress-test data.",
        "rubric": "Deliver a bulletproof boardroom defense; articulate the trade-offs between liquidity, investment, and capital return; successfully defend every financial invariant under intense senior evaluator questioning."
      }
    ]
  }
]
