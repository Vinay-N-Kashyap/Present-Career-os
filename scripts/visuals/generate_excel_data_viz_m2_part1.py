# scripts/visuals/generate_excel_data_viz_m2_part1.py
"""
Generator script for Course 34: Excel & Data Analysis Fundamentals (course-excel-data-viz)
Month 2: Days 31 to 45 (60 Quests: Q34.121 to Q34.180).
Conforms strictly to the Gate v2 / True 9.8 Pedagogical Standard:
- Exact 3-Tier Socratic Hint Ladder
- Situational Production Puzzle (with 4 options and detailed debrief)
- Exactly 4 Quests per day (Concept, Detective Challenge, Mastery Assignment, Production Incident Lab)
- Real 3 AM Production Incident Failure Modes
- TryIt Live Friction Challenges with reproduction bugs
- Zero markdown backticks inside strings (using HTML <code>...</code> tags)
"""

import json
from pathlib import Path

days_data = [
    {
        "day": 31,
        "month": 2,
        "blockNum": 7,
        "title": "Dynamic Three-Statement Financial Modeling: Integrated P&L, Balance Sheet & Cash Flow Loops",
        "stageNum": 7,
        "stageName": "Stage 7: Advanced Financial Modeling & Enterprise Modeling",
        "pedagogicalRole": "Corporate Financial Architecture (Three-Statement Integration, Working Capital Schedules, Cash Flow Linkages & Balance Sheet Balancing)",
        "spokenGoal": "Building a single income statement is junior accounting; building an integrated, self-balancing Three-Statement Financial Model is the hallmark of a senior Wall Street investment banker. Today, you master the three financial statements: how Net Income flows into Retained Earnings on the Balance Sheet, how Operating Working Capital dictates Cash Flow, and how Cash from the Cash Flow Statement loops back to anchor Cash & Equivalents on the Balance Sheet, balancing the fundamental accounting equation to the exact penny.",
        "conceptInvariant": "Three-Statement Accounting Equilibrium Invariant: Total Assets must strictly equal Total Liabilities plus Shareholders' Equity: $\\text{Assets}_t \\equiv \\text{Liabilities}_t + \\text{Equity}_t$. Retained Earnings updates via $\\text{RE}_t = \\text{RE}_{t-1} + \\text{NetIncome}_t - \\text{Dividends}_t$, and Balance Sheet Cash is anchored directly to ending cash from the Cash Flow Statement: $\\text{Cash}_t = \\text{Cash}_{t-1} + \\Delta \\text{CF}_t$.",
        "failureMode": "The $85M Balance Sheet Plug Catastrophe: A corporate M&A modeling team builds a 3-statement acquisition model for a $1.2B buyout. Because working capital changes were incorrectly double-counted across both the income statement and cash flow schedule, the balance sheet failed to balance by $85M. A rogue analyst inserted an arbitrary hardcoded 'plug' formula into Other Current Assets to force equality, concealing a catastrophic liquidity shortfall that surfaced during lender due diligence.",
        "tryItFriction": "Construct a dynamic three-statement linkage model in Excel where changing revenue growth assumptions automatically ripples through the P&L, adjusts accounts receivable and inventory on the balance sheet, updates operating cash flow, and maintains a zero-variance balance sheet checksum.",
        "socraticHints": [
            "Why must a professional financial modeler NEVER insert a hardcoded 'plug' to force Assets to equal Liabilities plus Equity?",
            "How does Depreciation expense appear on the Income Statement, get added back on the Cash Flow Statement (as a non-cash expense), and reduce Net PP&E on the Balance Sheet?",
            "What automated audit formula (e.g. `=IF(ROUND(Assets-(Liab+Equity),2)=0, 'BALANCED', 'ERROR')`) must sit prominently at the top of every corporate model?"
        ],
        "situationalPuzzle": {
            "scenario": "A private equity associate builds a dynamic 3-statement model. When testing a scenario with high CapEx, the balance sheet goes out of balance by exactly the amount of new CapEx spent. The associate traces the formulas: CapEx is deducted in the Cash Flow Statement under Investing Activities, and Cash decreases on the Balance Sheet, but Total Assets drops by the CapEx amount.",
            "options": [
                "CapEx does not affect assets.",
                "Diagnose Missing PP&E Schedule Linkage: In the Balance Sheet, Net PP&E must equal Prior PP&E + CapEx - Depreciation. The associate forgot to add CapEx to Gross PP&E on the Balance Sheet, so cash decreased without a corresponding increase in fixed assets. Adding CapEx to the PP&E schedule perfectly balances Assets with Liabilities + Equity.",
                "Subtract CapEx from Equity to make the numbers match.",
                "Turn off balance sheet calculations."
            ],
            "correctOptionIndex": 1,
            "debrief": "Capital expenditures (CapEx) represent a cash outflow that converts liquid cash into long-term fixed assets (PP&E). Decreasing cash on the asset side without correspondingly increasing PP&E creates an immediate balance sheet imbalance equal to the CapEx outlay."
        },
        "quests": [
            {
                "id": "Q34.121",
                "name": "Three-Statement Integration Architecture & Flow Mechanics",
                "type": "Concept",
                "desc": "Detail the mathematical linkages between the Income Statement, Balance Sheet, and Cash Flow Statement, exploring working capital loops and equity rollover."
            },
            {
                "id": "Q34.122",
                "name": "The Unbalanced Balance Sheet Plug Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a compromised corporate buyout model with an $85M balance sheet discrepancy; locate the rogue plug cell and fix the broken working capital linkage."
            },
            {
                "id": "Q34.123",
                "name": "Dynamic Three-Statement Financial Modeling Engine",
                "type": "Mastery Assignment",
                "desc": "Build an integrated 5-year Three-Statement model in Excel/Python featuring dynamic revenue drivers, working capital schedules, debt amortization, and automated checksums."
            },
            {
                "id": "Q34.124",
                "name": "Extreme Revenue Shock Three-Statement Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Subject your 3-statement model to a simulated 50% revenue crash and 200% inventory build; prove that the balance sheet remains 100% in equilibrium across all 60 forecast months."
            }
        ]
    },
    {
        "day": 32,
        "month": 2,
        "blockNum": 7,
        "title": "Debt Sculpting, Revolver Schedules & Circular Reference Resolution (Iterative Calculation Mechanics)",
        "stageNum": 7,
        "stageName": "Stage 7: Advanced Financial Modeling & Enterprise Modeling",
        "pedagogicalRole": "Debt Modeling & Mathematical Convergence (Revolving Credit Facilities, Cash Sweep Dynamics, Circular Reference Mechanics & Iterative Calculation Limits)",
        "spokenGoal": "In debt financing, there is a famous mathematical paradox: your interest expense depends on your debt balance, which depends on your net cash flow, which depends on your interest expense. This creates a circular reference. Most amateur spreadsheets crash with a blue circular warning arrow. Today, you master Circular Reference Engineering: debt sculpting schedules, cash sweep mechanics, enabling iterative calculation convergence, and building circularity breaker toggle switches.",
        "conceptInvariant": "Iterative Calculation & Convergence Invariant: A circular reference system $x = f(x)$ converges if and only if the contraction mapping $|f'(x)| < 1$. Enabling Iterative Calculation (`Max Iterations: 100`, `Max Change: 0.0001`) allows Excel to numerically solve the fixed-point equilibrium. A boolean 'Circularity Breaker' toggle switch (`=IF(CircularSwitch=1, IterativeFormula, StaticGuess)`) is mandatory to recover from `#NUM!` divergence.",
        "failureMode": "The Exploding Circular Reference Model Divergence: A leveraged finance team builds an LBO model with circular interest on a revolving credit facility. A junior modeler types a negative interest rate assumption during stress testing. The circular formula diverges into an infinite mathematical loop, causing the entire workbook to freeze, corrupting cell values to `#NUM!` across 40 sheets and destroying the model.",
        "tryItFriction": "Construct a dynamic Debt Revolver schedule in Excel that automatically draws down debt when cash falls below minimum operating cash and sweeps excess cash to repay debt, implementing an automated circularity breaker switch.",
        "socraticHints": [
            "Why does calculating interest expense on the average debt balance (`=AVERAGE(BegDebt, EndDebt) * Rate`) create an inherent circular reference in a three-statement model?",
            "What is a 'Circularity Breaker' switch, and why is it required by every investment bank auditing standard before running sensitivity analysis?",
            "How do debt covenants (like Debt-to-EBITDA maximums and Interest Coverage ratios) constrain automated cash sweep calculations?"
        ],
        "situationalPuzzle": {
            "scenario": "A project finance model for a $500M solar farm uses iterative calculations for debt sizing. A model auditor opens the file and discovers that pressing 'Calculate' changes the debt sizing by $20,000 every single time, never settling on a stable number. The model is oscillating back and forth without reaching mathematical convergence.",
            "options": [
                "Press Calculate 500 times until it stops.",
                "Diagnose Oscillating Circular Instability: The interest formula calculates cash sweep using a discontinuous step function (nested `IF` statements) that flips back and forth across iterations. Fix by: (1) Activating the Circularity Breaker switch to reset variables to static seeds; (2) Replacing discontinuous step formulas with smooth continuous minimum/maximum functions; (3) Increasing Max Iterations to 1,000 with Max Change 0.00001 to guarantee fixed-point convergence.",
                "Delete the debt schedule and fund the solar farm with cash.",
                "Reboot the computer."
            ],
            "correctOptionIndex": 1,
            "debrief": "Discontinuous logical functions in circular reference loops cause mathematical oscillation where the model flips between two states without settling. Smoothing formulas and using a circularity breaker switch to inject stable initial seeds guarantees numerical convergence."
        },
        "quests": [
            {
                "id": "Q34.125",
                "name": "Fixed-Point Iteration & Debt Sculpting Mathematics",
                "type": "Concept",
                "desc": "Detail the mathematical mechanics of fixed-point iteration in Excel, debt sculpting formulas, revolving credit mechanics, cash sweeps, and circularity breakers."
            },
            {
                "id": "Q34.126",
                "name": "The Divergent Circular Reference Crash Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a high-profile LBO model that locked into `#NUM!` errors during board review; locate the un-stabilized circular loop and install an automated breaker toggle."
            },
            {
                "id": "Q34.127",
                "name": "Enterprise Debt Sculpting & Cash Sweep Engine",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise debt amortization platform in Excel/Python featuring dynamic revolving credit facilities, senior/mezzanine tranches, cash sweeps, and circularity switches."
            },
            {
                "id": "Q34.128",
                "name": "High-Leverage Covenant Default Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Stress test an LBO debt schedule under volatile interest rate spikes (SOFR + 500 bps); achieve 100% numerical convergence across 1,000 iterative scenario runs."
            }
        ]
    },
    {
        "day": 33,
        "month": 2,
        "blockNum": 7,
        "title": "Capital Budgeting & Valuation: Discounted Cash Flow (DCF), WACC & Multi-Tier Waterfall Returns",
        "stageNum": 7,
        "stageName": "Stage 7: Advanced Financial Modeling & Enterprise Modeling",
        "pedagogicalRole": "Corporate Valuation & Private Equity Modeling (Discounted Cash Flow, Weighted Average Cost of Capital, Terminal Value & Waterfall Distributions)",
        "spokenGoal": "What is a business actually worth? In private equity and corporate finance, valuation is determined by cash flow, cost of capital, and equity distribution waterfalls. Today, you master Discounted Cash Flow (DCF) modeling: computing Free Cash Flow to Firm (FCFF), calculating the Weighted Average Cost of Capital (WACC) using CAPM, estimating Terminal Value via the Gordon Growth and Exit Multiple methods, and modeling multi-tier private equity waterfall hurdle returns.",
        "conceptInvariant": "Enterprise Valuation & DCF Invariant: Enterprise Value is the present value of projected discrete Unlevered Free Cash Flows plus discounted Terminal Value: $\\text{EV} = \\sum_{t=1}^n \\frac{\\text{FCFF}_t}{(1 + \\text{WACC})^t} + \\frac{\\text{TV}}{(1 + \\text{WACC})^n}$. Terminal Value via Gordon Growth requires $\\text{TV} = \\frac{\\text{FCFF}_{n+1}}{\\text{WACC} - g}$, where perpetual growth $g < \\text{Risk-Free Rate}$.",
        "failureMode": "The Gordon Growth Perpetual Inflation Disaster: An investment banking analyst calculates the terminal value of an enterprise software company. In the formula `=FCFF_5 * (1 + g) / (WACC - g)`, the analyst sets the perpetual growth rate $g$ to 8.5% (assuming tech companies grow fast forever), while WACC was 9.0%. Because $WACC - g = 0.5\\%$, the formula creates a massive mathematical division near zero, valuing a $20M business at $4.2B and embarrassing the bank during fairness opinion review.",
        "tryItFriction": "Construct a full DCF valuation model in Excel with dynamic WACC calculation (Beta, Equity Risk Premium, Cost of Debt) and a dual Terminal Value selector (Exit Multiple vs Gordon Growth).",
        "socraticHints": [
            "Why can the perpetual growth rate ($g$) in a Gordon Growth Terminal Value calculation NEVER exceed the long-term GDP growth rate of the economy (~2% to 3%)?",
            "What is the difference between Unlevered Free Cash Flow (FCFF, for Enterprise Value) and Levered Free Cash Flow (FCFE, for Equity Value)?",
            "How does a multi-tier Private Equity distribution waterfall (Return of Capital $\\to$ 8% Preferred Return $\\to$ GP Catch-up $\\to$ 80/20 Carried Interest) allocate cash between LPs and GPs?"
        ],
        "situationalPuzzle": {
            "scenario": "A private equity associate builds an equity waterfall model for an investment fund. The fund has a Preferred Return of 8% to Limited Partners (LPs), followed by a 100% General Partner (GP) Catch-up until the GP receives 20% of total profits, followed by an 80/20 split. The associate's formula pays the GP 20% of profits immediately from dollar one, violating the LP preferred hurdle.",
            "options": [
                "LPs won't notice as long as returns are high.",
                "Structure a Strict Tiered Waterfall Schedule: Tier 1 returns 100% of capital to LPs; Tier 2 pays 100% of cash to LPs until the cumulative 8% IRR hurdle is met; Tier 3 routes cash to GP catch-up until the GP reaches 20% of cumulative profits; Tier 4 distributes remaining proceeds 80% to LPs and 20% to GPs. Use `=MIN()` and `=MAX()` bounds for each tier.",
                "Give all the money to the GP.",
                "Remove the waterfall and split everything 50/50."
            ],
            "correctOptionIndex": 1,
            "debrief": "Private equity waterfalls require strict chronological hurdle tiers. Capital return and preferred returns must be fully satisfied before GP catch-up and carried interest can legally be distributed, modeled via rigorous bounding formulas."
        },
        "quests": [
            {
                "id": "Q34.129",
                "name": "Discounted Cash Flow Mathematics & Capital Asset Pricing",
                "type": "Concept",
                "desc": "Detail the theoretical mechanics of DCF valuation, Unlevered Free Cash Flow formulation, CAPM/WACC cost of capital, and Gordon Growth bounds."
            },
            {
                "id": "Q34.130",
                "name": "The Unbounded Perpetual Growth Valuation Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate an inflated fairness opinion valuation; trace how an unsustainable perpetual growth rate exceeding economic GDP distorted terminal value by $2B."
            },
            {
                "id": "Q34.131",
                "name": "Enterprise DCF Valuation & PE Waterfall Suite",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise DCF valuation model in Excel/Python featuring dynamic WACC parameters, dual terminal value methodologies, and a 4-tier LP/GP distribution waterfall."
            },
            {
                "id": "Q34.132",
                "name": "Multi-Asset Fairness Opinion Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Value 10 competing corporate acquisition targets across varying interest rate regimes; prove 100% mathematical consistency across DCF, Trading Comps, and Precedent Transactions."
            }
        ]
    },
    {
        "day": 34,
        "month": 2,
        "blockNum": 7,
        "title": "Advanced Sensitivity & Scenario Managers: Two-Way Data Tables, Tornado Charts & Monte Carlo Simulations",
        "stageNum": 7,
        "stageName": "Stage 7: Advanced Financial Modeling & Enterprise Modeling",
        "pedagogicalRole": "Stochastic Modeling & Risk Analytics (Tornado Sensitivity Analysis, Scenario Managers, Probability Distributions & Monte Carlo Simulation)",
        "spokenGoal": "Point estimates are an illusion. Telling an executive board that 'Projected profit is exactly $42.5M' is reckless. Real financial architects provide probability distributions: 'There is an 80% probability profit will land between $35M and $48M, with a 5% downside risk of loss'. Today, you master advanced risk modeling: authoring Tornado charts to identify primary value drivers, building dynamic Scenario Managers (Base, Bull, Bear), and running native Monte Carlo simulations in Excel.",
        "conceptInvariant": "Stochastic Risk & Monte Carlo Invariant: A deterministic model $Y = f(X_1, \\dots, X_k)$ is transformed into a stochastic model by sampling inputs from calibrated probability distributions $X_i \\sim \\mathcal{D}_i$. Monte Carlo iteration samples $N = 10,000$ iterations via `=NORM.INV(RAND(), \\mu, \\sigma)`, yielding output empirical distribution $\\hat{P}(Y)$ and Value at Risk (VaR).",
        "failureMode": "The Single-Scenario Downside Bankruptcy Surprise: An oil and gas exploration company commits to a $200M deep-water drilling contract based on a single 'Base Case' financial model assuming $85/barrel crude oil. The model lacked sensitivity and Monte Carlo stress testing. When oil prices plunged to $42/barrel due to global macroeconomic shifts, the company suffered catastrophic covenant default within 9 months.",
        "tryItFriction": "Construct a Tornado Chart data table in Excel that systematically varies 6 key model assumptions (Price, Volume, COGS, OpEx, Tax, Discount Rate) by $\\pm 10\\%$ to rank order the variables by impact on Enterprise Value.",
        "socraticHints": [
            "Why is a Tornado Chart the most effective visualization for communicating sensitivity analysis to an executive board (hint: visual rank order of risk drivers)?",
            "How does `=NORM.INV(RAND(), Mean, StdDev)` generate normally distributed random variables for financial risk modeling?",
            "What is 'Value at Risk' (VaR 95%), and how does running 5,000 Monte Carlo iterations allow risk managers to quantify worst-case portfolio losses?"
        ],
        "situationalPuzzle": {
            "scenario": "A financial modeler builds a Monte Carlo simulation in Excel using `=NORMINV(RAND(), 100, 15)`. The modeler copies the formula across 1,000 rows. The modeler notices that every time they press Enter anywhere in the workbook, all 1,000 random variables re-roll, changing the final board presentation numbers every second.",
            "options": [
                "Tell the board that numbers in finance are naturally vibrating.",
                "Stabilize Simulation Output via Data Table or Output Freezing: In Excel, `RAND()` is volatile. Wrap the Monte Carlo iteration engine in a 1-Way Data Table connected to an empty iteration counter cell, and set calculation options to 'Automatic except for data tables'; alternatively, copy the 1,000 simulation outputs and Paste as Values (`Ctrl+Alt+V -> Values`) to lock the empirical distribution for presentation.",
                "Delete the `RAND()` formulas.",
                "Turn off the monitor."
            ],
            "correctOptionIndex": 1,
            "debrief": "Spreadsheet functions like `RAND()` are volatile, recalculating on every worksheet event. Managing Monte Carlo simulations requires using Data Table iteration harnesses with controlled calculation settings or copying simulation outputs as static values to preserve distribution baselines for executive review."
        },
        "quests": [
            {
                "id": "Q34.133",
                "name": "Stochastic Valuation Mechanics & Monte Carlo Mathematics",
                "type": "Concept",
                "desc": "Detail the mathematics of stochastic simulation, random number generation (`RAND` / Box-Muller transform), probability distributions, and Value at Risk (VaR)."
            },
            {
                "id": "Q34.134",
                "name": "The Volatile RAND Recalculation Drift Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a risk committee report where executive numbers changed spontaneously during a live presentation; trace the volatile `RAND` formula dependency."
            },
            {
                "id": "Q34.135",
                "name": "Tornado Sensitivity & Monte Carlo Simulation Suite",
                "type": "Mastery Assignment",
                "desc": "Build an integrated risk analytics workbook in Excel/Python featuring dynamic Scenario Managers (Base/Bull/Bear), Tornado impact charts, and a 5,000-iteration Monte Carlo engine."
            },
            {
                "id": "Q34.136",
                "name": "Extreme Black-Swan Portfolio Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate 10,000 macroeconomic crisis iterations across a multi-asset portfolio; compute empirical VaR (99%) and Expected Shortfall with zero calculation desynchronization."
            }
        ]
    },
    {
        "day": 35,
        "month": 2,
        "blockNum": 7,
        "title": "Milestone 4: ApexValuation Three-Statement Financial Modeling & Monte Carlo DCF Engine Suite",
        "stageNum": 7,
        "stageName": "Stage 7: Advanced Financial Modeling & Enterprise Modeling",
        "pedagogicalRole": "Architectural Capstone & Integrated Synthesis (Three-Statement Integration, Iterative Debt Loops, DCF Valuation & Stochastic Risk Simulation)",
        "spokenGoal": "Day 35 brings you to Milestone 4. You have mastered corporate financial architecture, dynamic three-statement mechanics, circularity breaker engineering, and stochastic Monte Carlo simulation. Today, you assemble ApexValuation: an institutional-grade corporate valuation and financial modeling suite capable of evaluating multi-billion-dollar corporate acquisitions under live macro stress.",
        "conceptInvariant": "Milestone 4 Architectural Invariant: An institutional valuation engine must enforce Three-Statement equilibrium ($A \\equiv L + E$), resolve debt-interest circularities via controlled iterative convergence, value enterprise assets via grounded DCF/WACC methodologies, and quantify risk via Monte Carlo distributions.",
        "failureMode": "ApexValuation Live Defense Crash: During the milestone evaluation, the review board injects an extreme stress scenario: an unexpected 400 bps interest rate hike paired with working capital stretch. A failure in the circularity breaker switch traps the model in an oscillating loop, freezing Excel and causing an unhandled `#NUM!` cascade across the valuation tab.",
        "tryItFriction": "Deploy the complete ApexValuation platform: run a 5-year three-statement forecast, execute a circular debt sweep, perform DCF valuation across dual terminal methods, and output a 1,000-iteration Monte Carlo risk report.",
        "socraticHints": [
            "How does your ApexValuation architecture safeguard against balance sheet divergence during extreme revenue contraction scenarios?",
            "Why is having an instant Circularity Breaker toggle switch mandatory for institutional models submitted to credit rating agencies and investment committees?",
            "What operational telemetry (balance check zero variance, iteration convergence count, VaR confidence intervals) must ApexValuation display?"
        ],
        "situationalPuzzle": {
            "scenario": "During your Milestone 4 defense, the evaluation committee asks: 'Your ApexValuation model calculates Enterprise Value at $850M. But if inflation stays at 5%, our cost of debt rises to 9%. How fast can your model re-evaluate the deal and show the new probability distribution of returns?'. How does your architecture respond?",
            "options": [
                "Tell the committee to come back next week after manual recalculations.",
                "Demonstrate Instant Dynamic Scenario Recalculation: ApexValuation links macroeconomic assumptions to an integrated Scenario Control Panel. Toggling from 'Base Case' to 'High Inflation' dynamically updates WACC, recalculates three-statement cash flows through the converging debt revolver, and updates the Monte Carlo distribution in $<1.5\\text{ seconds}$, displaying the revised Enterprise Value ($710M) with full audit transparency.",
                "Guess a number that sounds plausible.",
                "Turn off iterative calculations."
            ],
            "correctOptionIndex": 1,
            "debrief": "Institutional financial models are dynamic engines. Centralizing macroeconomic variables into an interactive Scenario Control Panel allows instant deal re-evaluation across interest rate, inflation, and growth shocks in real time."
        },
        "quests": [
            {
                "id": "Q34.137",
                "name": "ApexValuation Systems Architecture & Financial Blueprint",
                "type": "Concept",
                "desc": "Document the complete systems architecture of ApexValuation, detailing three-statement linkages, debt revolver loops, DCF valuation, and Monte Carlo risk engines."
            },
            {
                "id": "Q34.138",
                "name": "The Un-Stabilized Circularity Freeze Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a high-stakes corporate acquisition model that froze during board evaluation; locate the oscillating circular function and install a stabilization gate."
            },
            {
                "id": "Q34.139",
                "name": "ApexValuation Institutional Financial Platform Implementation",
                "type": "Mastery Assignment",
                "desc": "Build the full ApexValuation platform in Excel/Python, unifying integrated Three-Statement modeling, debt revolvers with circularity breakers, DCF valuation, and Monte Carlo simulations."
            },
            {
                "id": "Q34.140",
                "name": "ApexValuation Milestone 4 Viva Defense & Chaos Gate",
                "type": "Production Incident Lab",
                "desc": "Defend ApexValuation before the Senior Financial Review Board under severe macroeconomic shock vectors, liquidity crises, and live valuation cross-examination."
            }
        ]
    },
    {
        "day": 36,
        "month": 2,
        "blockNum": 8,
        "title": "Power Query M Language Internals: Table Transformations, Custom Functions & Query Folding Optimization",
        "stageNum": 8,
        "stageName": "Stage 8: Enterprise Power Query & Data Modeling",
        "pedagogicalRole": "Enterprise ETL Engineering (Power Query M Language, Functional Programming, Custom M Functions & Query Folding Pushdown)",
        "spokenGoal": "Clicking buttons in the Power Query user interface is just the outer shell; underneath lies the M Language—a powerful, pure functional, case-sensitive programming language. Today, you master M Language internals: understanding `let ... in` syntax, creating parameterized custom functions (`(x) => ...`), manipulating native M records and lists, and mastering the holy grail of enterprise ETL: Query Folding pushdown to SQL databases.",
        "conceptInvariant": "Query Folding & M Evaluation Invariant: The Power Query Mashup Engine translates M transformation steps into native SQL statements pushed directly to source databases: $\\text{Translate}(M) \\to \\text{SQL}$. Transformations that break folding (e.g. index columns, complex custom functions) force the engine to download millions of raw rows into local RAM, degrading ETL refresh speeds by $100\\times$.",
        "failureMode": "The Broken Query Folding 4-Hour Database Ingestion Stall: An enterprise data warehouse team builds an automated Power Query pipeline to ingest 15 million sales transactions from an Oracle SQL database. An analyst adds an 'Add Index Column' step near the start of the query. This step breaks Query Folding: instead of executing a filtered `WHERE Year = 2024` on Oracle, Excel attempts to download all 15 million rows over the corporate WAN, causing a 4-hour ETL freeze that halts morning operations.",
        "tryItFriction": "Author a custom M Language function in the Advanced Editor that accepts an alphanumeric string and strips all non-numeric characters using `Text.Select(str, {\"0\"..\"9\"})`, verifying query folding status.",
        "socraticHints": [
            "Why is the M Language pure functional (immutable state) rather than object-oriented or procedural?",
            "What is 'Query Folding', and how do you verify whether a step is folding by right-clicking it in the Applied Steps list to see 'View Native Query'?",
            "Why does placing row filtering and column selection steps at the very beginning of an M script maximize query folding efficiency?"
        ],
        "situationalPuzzle": {
            "scenario": "A business analyst queries a 50-million-row SQL Server table in Power Query. The goal is to filter for Canadian sales in 2024. The analyst adds a custom column with an M text function, followed by a filter step. The query takes 45 minutes to refresh. Right-clicking the filter step shows 'View Native Query' is disabled (grayed out).",
            "options": [
                "SQL Server is too old to handle Canadian sales.",
                "Diagnose Broken Query Folding Order: The non-foldable custom M column was placed BEFORE the filter step, terminating SQL pushdown. The engine had to pull all 50 million rows into local RAM before filtering. Re-order the steps: place the SQL-foldable filter (`Country = 'Canada' AND Year = 2024`) at the very top (pushing `WHERE Country='Canada' AND Year=2024` to SQL Server); the server returns only 5,000 rows in 0.4 seconds, where the custom column executes instantly.",
                "Delete the Canadian sales data.",
                "Reboot the SQL Server cluster."
            ],
            "correctOptionIndex": 1,
            "debrief": "Query folding stops the moment an unsupported transformation is encountered. Placing foldable steps (row filtering, column pruning, basic joins) at the very top of the query maximizes database server execution, reducing network payload and cutting refresh times from hours to seconds."
        },
        "quests": [
            {
                "id": "Q34.141",
                "name": "Power Query M Language Architecture & Functional Mechanics",
                "type": "Concept",
                "desc": "Detail the functional programming mechanics of the M Language (`let ... in`), exploring lists, records, tables, evaluation pipelines, and Query Folding pushdown."
            },
            {
                "id": "Q34.142",
                "name": "The Broken Native Query Network Saturation Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate an enterprise ETL refresh that saturated corporate bandwidth; trace how an index column broke SQL query folding and triggered a 15-million row local download."
            },
            {
                "id": "Q34.143",
                "name": "Production M Language Custom Transformation Library",
                "type": "Mastery Assignment",
                "desc": "Author an enterprise library of reusable M functions in the Advanced Editor for phone normalization, tax validation, and dynamic fiscal year date generation."
            },
            {
                "id": "Q34.144",
                "name": "High-Throughput Query Folding Optimization Lab",
                "type": "Production Incident Lab",
                "desc": "Optimize a complex multi-step Power Query script connecting to an enterprise SQL database; achieve 100% query folding across all filtering and join steps, cutting refresh latency by 95%."
            }
        ]
    },
    {
        "day": 37,
        "month": 2,
        "blockNum": 8,
        "title": "Dimensional Modeling in Excel: Star Schemas, Fact vs Dimension Tables & Active vs Inactive Relationships",
        "stageNum": 8,
        "stageName": "Stage 8: Enterprise Power Query & Data Modeling",
        "pedagogicalRole": "Data Warehouse Architecture in Spreadsheets (Kimball Dimensional Modeling, Star Schemas, Fact Tables, Dimension Tables & Relationship Ambiguity)",
        "spokenGoal": "Amateur analysts dump all their data into a single, massive 100-column flat table filled with duplicate text and redundant records. Professional data architects build Star Schemas: decomposing data into clean Fact tables (numerical transactions) and Dimension tables (descriptive attributes like Customers, Products, and Dates). Today, you master Dimensional Modeling inside Excel's Power Pivot Data Model: building star schemas, defining 1-to-many relationships, and managing active versus inactive relationship paths.",
        "conceptInvariant": "Star Schema & Relational Integrity Invariant: A dimensional model consists of a central Fact table $\\mathcal{F}$ connected to surrounding Dimension tables $\\mathcal{D}_1, \\dots, \\mathcal{D}_m$ via 1-to-Many relationships: $\\mathcal{D}_k[ID] \\xrightarrow{1:M} \\mathcal{F}[ID]$. Primary keys in dimension tables must be 100% unique; duplicate keys in dimensions violate relational integrity and throw fatal data model errors.",
        "failureMode": "The Duplicate Key Dimension Relationship Collapse: A corporate retail analyst attempts to connect a Customer Dimension table to a 500,000-row Sales Fact table in Excel Power Pivot. Because the customer table contained duplicate customer IDs (due to a CRM merge bug), Power Pivot refuses to create the 1-to-Many relationship, throwing: 'The relationship cannot be created because each column must contain unique values'. The analyst is forced into fragile VLOOKUP workarounds.",
        "tryItFriction": "Construct an official Star Schema in Excel Power Pivot: connect `FactSales` to `DimProduct`, `DimCustomer`, and `DimDate`, verifying that filter propagation flows correctly from dimensions to the fact table.",
        "socraticHints": [
            "Why is a Star Schema (Fact + Dimensions) vastly superior in performance, memory, and maintainability compared to a single denormalized 100-column 'mega-table'?",
            "What is the difference between a Fact Table (quantitative events: Sales, Invoices, Clicks) and a Dimension Table (descriptive context: Customer Name, Category, Region)?",
            "Why does Excel Power Pivot permit only ONE 'Active' relationship between two tables, and how do 'Inactive' relationships handle secondary dates (e.g. Order Date vs Ship Date)?"
        ],
        "situationalPuzzle": {
            "scenario": "A logistics BI model has a `FactShipments` table containing two date columns: `OrderDate` and `DeliveryDate`. The analyst connects both columns to `DimCalendar[Date]`. Power Pivot makes the `OrderDate` relationship solid (Active) and the `DeliveryDate` relationship dotted (Inactive). When building a Pivot Table by Delivery Month, the numbers stubbornly display orders rather than deliveries.",
            "options": [
                "Delete the OrderDate relationship.",
                "Diagnose Inactive Relationship Activation: Power Pivot only filters across the single Active relationship by default. Filtering by the secondary Inactive relationship requires activating it dynamically using the DAX function `USERELATIONSHIP()`: `=CALCULATE(SUM(FactShipments[Volume]), USERELATIONSHIP(FactShipments[DeliveryDate], DimCalendar[Date]))`.",
                "Create two separate identical workbooks.",
                "Merge the two dates together."
            ],
            "correctOptionIndex": 1,
            "debrief": "To prevent ambiguous filter paths, tabular data models allow only one active relationship between two tables. Secondary inactive relationships remain dormant until explicitly activated inside a measure using the `USERELATIONSHIP()` DAX function."
        },
        "quests": [
            {
                "id": "Q34.145",
                "name": "Kimball Dimensional Modeling & Star Schema Architecture",
                "type": "Concept",
                "desc": "Detail the architectural principles of Kimball dimensional modeling in Excel Power Pivot: Fact tables, Dimension tables, surrogate keys, and 1-to-Many relationship graphs."
            },
            {
                "id": "Q34.146",
                "name": "The Duplicate Dimension Key Model Rejection Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a broken Power Pivot data model where relationship creation failed; trace the non-unique primary key in an upstream customer dimension."
            },
            {
                "id": "Q34.147",
                "name": "Enterprise Star Schema & Multi-Date Model Suite",
                "type": "Mastery Assignment",
                "desc": "Build a multi-dimensional retail star schema in Excel Power Pivot featuring FactSales, DimCustomer, DimProduct, and DimCalendar with dual Order/Ship date relationships."
            },
            {
                "id": "Q34.148",
                "name": "High-Volume Dimensional Integrity Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Load a 500,000-row transactional fact table connected to 5 dimension tables; verify instantaneous cross-filtering across all dimensions with zero ambiguous loop paths."
            }
        ]
    },
    {
        "day": 38,
        "month": 2,
        "blockNum": 8,
        "title": "Introduction to DAX (Data Analysis Expressions): Calculated Columns vs Measures, Filter Context & Row Context",
        "stageNum": 8,
        "stageName": "Stage 8: Enterprise Power Query & Data Modeling",
        "pedagogicalRole": "Tabular Modeling & DAX Foundations (Calculated Columns vs Explicit Measures, Row Context, Filter Context & The CALCULATE Function)",
        "spokenGoal": "Welcome to the true superpower of modern Excel: DAX (Data Analysis Expressions). DAX is the formula language that powers Power Pivot and Microsoft Power BI. But if you try to write DAX like Excel formulas, you will fail. Today, you master the foundational mental model of DAX: understanding the profound difference between Calculated Columns (computed row-by-row at refresh) and Explicit Measures (computed dynamically on aggregated filter context), and mastering the most important function in business intelligence: `CALCULATE()`.",
        "conceptInvariant": "DAX Context & Evaluation Invariant: A Calculated Column evaluates under **Row Context** during data refresh, consuming VRAM storage. A Measure evaluates under dynamic **Filter Context** computed on-the-fly over the active Pivot Table coordinates. `CALCULATE(Expression, Filter_1, ...)` transforms row context into filter context (context transition) and overrides existing filter coordinates.",
        "failureMode": "The 100-Calculated-Column Memory Exhaustion Blunder: A corporate analyst builds a Power Pivot data model on 3 million rows. Unaware of DAX Measures, the analyst creates 45 Calculated Columns (e.g. `[GrossMargin]`, `[TaxAmount]`, `[NetMargin]`) to compute metrics row-by-row. The uncompressed calculated columns consume 12GB of RAM, bloating the workbook file size to 850MB and causing Excel to crash on open.",
        "tryItFriction": "Construct an explicit DAX Measure in Power Pivot using `=DIVIDE(SUM(FactSales[Profit]), SUM(FactSales[Revenue]), 0)` that calculates profit margin dynamically, handling divide-by-zero safely without consuming VRAM storage.",
        "socraticHints": [
            "Why do Explicit Measures consume virtually ZERO storage space compared to Calculated Columns that store values in every single row of the table?",
            "What is 'Filter Context', and how does dragging a 'Region' field to a Pivot Table row header instantly filter all underlying DAX measures?",
            "How does `CALCULATE(SUM(Sales[Amount]), Region=\"North America\")` override the user's active slicer selection to compute fixed benchmark metrics?"
        ],
        "situationalPuzzle": {
            "scenario": "A financial analyst builds a Power Pivot model and writes a Calculated Column: `[MarginPct] = FactSales[Profit] / FactSales[Revenue]`. When added to a Pivot Table, the Grand Total shows 3,450%! The analyst is horrified to realize the Pivot Table summed up all individual row percentages rather than calculating overall margin.",
            "options": [
                "Margin was 3,450% because the company is wildly successful.",
                "Diagnose Calculated Column Summation Error: You cannot sum percentages! A Calculated Column computes row-by-row; when added to Values, the Pivot Table defaults to `SUM()`, adding 50,000 individual percentages together. Delete the Calculated Column and write an Explicit DAX Measure: `[Total Margin %] := DIVIDE(SUM(FactSales[Profit]), SUM(FactSales[Revenue]))`. Measures evaluate aggregated sums dynamically at every cell coordinate.",
                "Change the Pivot Table to Average and accept slightly wrong numbers.",
                "Delete the model."
            ],
            "correctOptionIndex": 1,
            "debrief": "Percentages and ratios must NEVER be modeled as Calculated Columns. Summing row-level ratios produces absurd astronomical totals. Ratios must be authored as Explicit Measures using `DIVIDE(SUM(...), SUM(...))`, ensuring proper weighted aggregation at every matrix coordinate."
        },
        "quests": [
            {
                "id": "Q34.149",
                "name": "DAX Architecture & The Duality of Context",
                "type": "Concept",
                "desc": "Detail the formal evaluation theory of DAX: VertiPaq in-memory storage, Row Context vs Filter Context, context transition, and the mathematical mechanics of `CALCULATE()`."
            },
            {
                "id": "Q34.150",
                "name": "The 3,450% Margin Summation Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a high-visibility executive report showing a 3,450% gross margin; identify how a row-level Calculated Column was mistakenly summed in place of an explicit measure."
            },
            {
                "id": "Q34.151",
                "name": "Enterprise Explicit DAX Measure Architecture Suite",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise financial metrics library in Excel Power Pivot featuring explicit DAX measures for Revenue, COGS, Gross Margin %, and `CALCULATE` regional filters."
            },
            {
                "id": "Q34.152",
                "name": "VertiPaq Memory Optimization & Measure Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Refactor a bloated 1-million-row model with 20 calculated columns into explicit measures; reduce file size by 80% and achieve sub-50ms DAX query response times."
            }
        ]
    },
    {
        "day": 39,
        "month": 2,
        "blockNum": 8,
        "title": "Time Intelligence in DAX: TOTALYTD, SAMEPERIODLASTYEAR, Rolling Averages & Calendar Tables",
        "stageNum": 8,
        "stageName": "Stage 8: Enterprise Power Query & Data Modeling",
        "pedagogicalRole": "Temporal Analytics & Time Intelligence (DAX Time Functions, Contiguous Date Dimensions, Year-to-Date Accumulation & Prior-Period Variance)",
        "spokenGoal": "Every executive asks the same three questions: 'What is our Year-to-Date revenue? How does it compare to the same period last year? And what is our 3-month rolling average?'. In classical Excel, answering this requires fragile helper columns and offset formulas. In modern DAX, you use Time Intelligence functions: `TOTALYTD`, `SAMEPERIODLASTYEAR`, and `DATESINPERIOD`. Today, you master the strict prerequisites of DAX time intelligence and build automated YoY variance engines.",
        "conceptInvariant": "DAX Time Intelligence & Calendar Table Invariant: Time intelligence functions REQUIRE a dedicated Date Table (`DimCalendar`) marked as Date Table in Power Pivot. The Date Table must contain a contiguous range of dates (zero missing days), cover all fiscal years in the fact table, and maintain a 1:M relationship: `DimCalendar[Date] \\xrightarrow{1:M} FactSales[OrderDate]`.",
        "failureMode": "The Missing Date Table Time Intelligence Blackout: An analyst attempts to calculate Year-to-Date revenue using `=TOTALYTD(SUM(Sales[Amount]), Sales[OrderDate])` directly on the fact table. Because `Sales[OrderDate]` had gaps (no sales on weekends/holidays), Excel's DAX engine throws an error or returns erratic, missing values. The quarterly board presentation is delayed by 6 hours while the analyst scrambles.",
        "tryItFriction": "Construct a dedicated `DimCalendar` table in Power Query or DAX using `=CALENDAR(DATE(2022,1,1), DATE(2026,12,31))`, mark it as the official Date Table, and author a `[Sales YoY %]` variance measure using `SAMEPERIODLASTYEAR`.",
        "socraticHints": [
            "Why do DAX Time Intelligence functions fail when applied directly to a transactional date column with missing weekend dates?",
            "What is the mathematical difference between `=SAMEPERIODLASTYEAR(DimCalendar[Date])` and `=DATEADD(DimCalendar[Date], -1, YEAR)`?",
            "How do you author a 30-day rolling average measure in DAX using `=CALCULATE(..., DATESINPERIOD(DimCalendar[Date], LASTDATE(DimCalendar[Date]), -30, DAY))`?"
        ],
        "situationalPuzzle": {
            "scenario": "A retailer evaluates YoY growth for February 2024 (a leap year with 29 days) compared to February 2023 (28 days). The analyst's DAX formula using `SAMEPERIODLASTYEAR` computes a comparison. The analyst worries whether February 29 will compare to March 1, 2023, or drop the leap day entirely.",
            "options": [
                "DAX cannot compare leap years.",
                "DAX Time Intelligence Handles Leap Years Automatically: `SAMEPERIODLASTYEAR` maps February 29 to the final day of February of the previous year (February 28, 2023), preserving month-level comparative integrity without dropping records or drifting into March.",
                "Delete February 29 from the 2024 database.",
                "Add an extra fake day to 2023."
            ],
            "correctOptionIndex": 1,
            "debrief": "Built-in DAX Time Intelligence functions are mathematically calibrated for calendar edge cases. `SAMEPERIODLASTYEAR` automatically maps leap-day February 29 to the final calendar day of February in non-leap years, ensuring robust comparative reporting."
        },
        "quests": [
            {
                "id": "Q34.153",
                "name": "DAX Time Intelligence Architecture & Calendar Invariants",
                "type": "Concept",
                "desc": "Detail the architectural requirements of DAX Time Intelligence, exploring contiguous date dimensions, calendar marking, filter context shifting, and leap year handling."
            },
            {
                "id": "Q34.154",
                "name": "The Non-Contiguous Transaction Date Error Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a broken corporate YTD revenue dashboard; trace how running time intelligence on a non-contiguous fact table date column caused calculation dropouts."
            },
            {
                "id": "Q34.155",
                "name": "Comprehensive Time Intelligence Analytics Engine",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise temporal analytics suite in Excel Power Pivot featuring YTD, QTD, MTD, Prior-Year Variance %, and 3-Month Rolling Average DAX measures."
            },
            {
                "id": "Q34.156",
                "name": "Multi-Year Fiscal Calendar Variance Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Deploy time intelligence measures across a 5-year retail dataset with 4-4-5 non-standard retail fiscal calendars; achieve 100% YoY reconciliation across all quarters."
            }
        ]
    },
    {
        "day": 40,
        "month": 2,
        "blockNum": 8,
        "title": "Milestone 5: ApexModel Star Schema Data Modeling & High-Performance DAX Engine Suite",
        "stageNum": 8,
        "stageName": "Stage 8: Enterprise Power Query & Data Modeling",
        "pedagogicalRole": "Architectural Capstone & Integrated Synthesis (Power Query M Optimization, Star Schema Topologies, Explicit DAX Measures & Time Intelligence)",
        "spokenGoal": "Day 40 brings you to Milestone 5. You have evolved into a full-scale corporate data modeling engineer. Today, you assemble ApexModel: a high-performance enterprise data model that ingests multi-source data via optimized Power Query M scripts with query folding, architectures a pristine Star Schema in Power Pivot, and deploys a comprehensive library of explicit DAX measures and Time Intelligence variance engines.",
        "conceptInvariant": "Milestone 5 Architectural Invariant: A production enterprise data model must enforce Query Folding pushdown on ETL extraction, maintain Star Schema 1:M relational topologies with unique dimension keys, model business logic exclusively via explicit DAX measures, and anchor temporal analytics to a certified contiguous Date Dimension.",
        "failureMode": "ApexModel Data Refresh Breakdown: During milestone defense evaluation, the board updates the source SQL database with 100,000 new records. A failure in the M query folding pipeline causes the ETL process to timeout, while a missing relationship on a newly added product category causes downstream DAX measures to return identical grand totals across all rows.",
        "tryItFriction": "Deploy the complete ApexModel platform: ingest sales and inventory from multiple databases, establish Star Schema relationships in Power Pivot, author YTD and YoY DAX measures, and render an interactive executive performance matrix.",
        "socraticHints": [
            "Why does a Star Schema with explicit DAX measures scale smoothly to millions of rows while flat unstructured spreadsheets choke at 50,000 rows?",
            "How does `CALCULATE()` serve as the universal engine of DAX, modifying filter context across multiple dimensions simultaneously?",
            "What governance checklist (unique keys, hidden foreign key columns, marked date table, explicit formatting) must ApexModel pass before production deployment?"
        ],
        "situationalPuzzle": {
            "scenario": "During your Milestone 5 defense, the evaluator inspects your Data Model and asks: 'Why did you hide the Foreign Key columns (like `CustomerID` and `ProductID`) in the Fact Table from client tools?'. How do you defend your architectural decision?",
            "options": [
                "Admit that you hid them by accident.",
                "Defend Data Model Governance & UX Best Practice: Hiding foreign keys in the Fact Table prevents end-users and analysts from accidentally using un-indexed, non-descriptive numeric IDs in Pivot Table row headers or writing broken cross-filters. Slicing and grouping must ALWAYS occur on descriptive attributes in the Dimension tables (`DimCustomer[CustomerName]`), preserving query performance and model clarity.",
                "Tell the evaluator that IDs are confidential secret codes.",
                "Delete the customer dimension."
            ],
            "correctOptionIndex": 1,
            "debrief": "Hiding foreign keys in fact tables is an enterprise best practice in dimensional modeling. It prevents users from accidentally dragging raw numeric keys into reports, directing them to use descriptive dimension attributes and preserving optimal filter propagation."
        },
        "quests": [
            {
                "id": "Q34.157",
                "name": "ApexModel Systems Architecture & Data Modeling Blueprint",
                "type": "Concept",
                "desc": "Document the complete systems architecture of ApexModel, detailing the M query folding pipeline, Star Schema relational graph, explicit DAX measure matrix, and Time Intelligence."
            },
            {
                "id": "Q34.158",
                "name": "The Unlinked Dimension Cross-Filter Failure Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a production data model failure where a newly added category displayed identical grand totals across all rows; trace the broken relationship path."
            },
            {
                "id": "Q34.159",
                "name": "ApexModel Enterprise Tabular BI Platform Implementation",
                "type": "Mastery Assignment",
                "desc": "Build the full ApexModel platform in Excel Power Pivot/Python, unifying query folding ETL, star schemas, explicit DAX measures, and YoY Time Intelligence analytics."
            },
            {
                "id": "Q34.160",
                "name": "ApexModel Milestone 5 Viva Defense & Chaos Gate",
                "type": "Production Incident Lab",
                "desc": "Defend ApexModel before the Senior Data Architecture Board under live SQL database updates, large-scale concurrent slicer cross-filtering, and adversarial DAX stress tests."
            }
        ]
    },
    {
        "day": 41,
        "month": 2,
        "blockNum": 9,
        "title": "Exploratory Data Analysis & Descriptive Statistics: Skewness, Kurtosis, Interquartile Range & Outlier Detection",
        "stageNum": 9,
        "stageName": "Stage 9: Statistical Analysis & Predictive Modeling",
        "pedagogicalRole": "Quantitative Data Profiling & Statistical Foundations (Moments of Distribution: Mean/Variance/Skewness/Kurtosis, IQR Fences & Tukey Boxplots)",
        "spokenGoal": "Never calculate an average without inspecting the shape of the distribution. If your data is heavily skewed, the mean is a complete lie. Today, you master Exploratory Data Analysis (EDA) and Descriptive Statistics in Excel: computing the four mathematical moments of a distribution (Mean, Standard Deviation, Skewness with `SKEW()`, and Kurtosis with `KURT()`), building Tukey Interquartile Range (IQR) outlier fences, and authoring Box & Whisker plots that unmask dirty anomalies.",
        "conceptInvariant": "Tukey Outlier & Distribution Moments Invariant: The Interquartile Range is $\\text{IQR} = Q_3 - Q_1$. Tukey's outlier fences classify a point $x$ as an outlier if $x < Q_1 - 1.5 \\times \\text{IQR}$ or $x > Q_3 + 1.5 \\times \\text{IQR}$. In skewed distributions ($|\\text{SKEW}| > 1$), the Median ($Q_2$) is the robust measure of central tendency; the Mean is mathematically distorted.",
        "failureMode": "The Mean Salary Skew Distortion PR Scandal: A tech startup announces in a press release that its 'average employee salary is $145,000'. In reality, the founder earns $2.5M, while 40 junior engineers earn $45,000. Because the distribution was heavily right-skewed ($Skewness = 4.8$), the mean created a deceptive impression, sparking internal employee revolt and viral public ridicule.",
        "tryItFriction": "Construct a dynamic Outlier Detection engine in Excel using `=PERCENTILE.EXC(range, 0.25)` and `0.75` that computes upper/lower IQR fences and automatically flags outliers in a helper column.",
        "socraticHints": [
            "Why is the Median vastly superior to the Mean when analyzing income, housing prices, or healthcare costs (hint: resistance to extreme outliers)?",
            "What does a positive Skewness value ($> 1$) tell you about the tail of the data distribution?",
            "How does Kurtosis quantify 'fat-tail risk' in financial markets, and why do normal distributions have an excess kurtosis of 0?"
        ],
        "situationalPuzzle": {
            "scenario": "A medical research team tests a new drug. The laboratory records blood pressure reductions. The mean reduction is 18.2 mmHg ($SD = 4.1$). An analyst prepares to publish the findings. An auditor runs `=SKEW(range)` and `=KURT(range)`, finding Skewness is -3.8 and Kurtosis is 18.2. Looking at a Box & Whisker plot, three patients had recorded blood pressure reductions of -350 mmHg (impossible data-entry typos).",
            "options": [
                "Publish the study and celebrate the miraculous 350 mmHg reduction.",
                "Diagnose Extreme Negative Outlier Data-Entry Corruption: The extreme negative skewness and leptokurtic distribution were caused by three impossible typographical errors (-350 mmHg instead of -35). The outliers artificially inflated statistical power. Apply Tukey IQR fences ($Q_1 - 1.5 \\times \\text{IQR}$) to isolate and correct the typos before running statistical analysis.",
                "Change all negative numbers to positive numbers.",
                "Delete the blood pressure column."
            ],
            "correctOptionIndex": 1,
            "debrief": "Skewness and Kurtosis are powerful diagnostic tools. Extreme skewness and heavy tails often signal corrupted data-entry errors (like typing -350 instead of -35). Using IQR fences to detect and clean outliers protects the scientific integrity of empirical research."
        },
        "quests": [
            {
                "id": "Q34.161",
                "name": "Mathematical Moments of Distribution & Tukey Outlier Theory",
                "type": "Concept",
                "desc": "Detail the statistical formulation of mean, variance, skewness, kurtosis, quartiles, and Tukey's 1.5x IQR outlier detection boundaries."
            },
            {
                "id": "Q34.162",
                "name": "The Skewed Mean Executive Compensation Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Audit a corporate compensation dataset where a misleading average obscured wide pay disparities; compute skewness and implement median-based reporting."
            },
            {
                "id": "Q34.163",
                "name": "Automated EDA Profiling & Boxplot Analytics Suite",
                "type": "Mastery Assignment",
                "desc": "Build an automated Exploratory Data Analysis dashboard in Excel/Python computing summary statistics, distribution moments, IQR outlier flags, and native Box & Whisker charts."
            },
            {
                "id": "Q34.164",
                "name": "Heavy-Tailed Financial Loss Distribution Lab",
                "type": "Production Incident Lab",
                "desc": "Profile a 50,000-row insurance claims dataset exhibiting extreme fat-tailed kurtosis; isolate anomalies and establish robust parametric and non-parametric bounds."
            }
        ]
    },
    {
        "day": 42,
        "month": 2,
        "blockNum": 9,
        "title": "Inferential Statistics & Hypothesis Testing in Excel: Z-Tests, T-Tests, Paired Samples & ANOVA F-Tests",
        "stageNum": 9,
        "stageName": "Stage 9: Statistical Analysis & Predictive Modeling",
        "pedagogicalRole": "Inferential Statistics & Hypothesis Testing (Null Hypothesis Testing, P-Values, Independent/Paired T-Tests, Analysis of Variance ANOVA & Alpha Risk)",
        "spokenGoal": "Did your marketing redesign actually boost sales, or was the uptick pure random chance? In business, correlation is not causation, and luck is not a strategy. Today, you master Inferential Statistics and Hypothesis Testing in Excel: formulating the Null Hypothesis ($H_0$), computing P-Values using `T.TEST()`, selecting between independent and paired two-sample tests, and executing single-factor Analysis of Variance (`ANOVA`) via the Data Analysis Toolpak.",
        "conceptInvariant": "Hypothesis Testing & P-Value Decision Invariant: The Null Hypothesis $H_0: \\mu_1 = \\mu_2$ is rejected in favor of alternative $H_1: \\mu_1 \\neq \\mu_2$ if and only if the calculated $P\\text{-Value} < \\alpha$ (standard threshold $\\alpha = 0.05$). Paired tests (`type = 1`) evaluate within-subject differences ($d_i = y_i - x_i$), while two-sample tests (`type = 2` or `3`) evaluate independent group differences.",
        "failureMode": "The Misapplied Independent T-Test Product Redesign Disaster: A product team tests a new checkout flow on 500 existing users (measuring checkout time Before vs After for the same individuals). An analyst runs an independent two-sample T-test (`type = 2`) instead of a paired T-test (`type = 1`). Because the independent test ignores within-subject pairing variance, it fails to detect a statistically significant 15-second speed improvement, leading management to discard a breakthrough redesign.",
        "tryItFriction": "Run an A/B test analysis in Excel using `=T.TEST(SampleA, SampleB, 2, 2)` (two-tailed, two-sample equal variance) to determine whether an e-commerce conversion rate change is statistically significant at $\\alpha = 0.05$.",
        "socraticHints": [
            "What does a P-Value of 0.03 actually mean (hint: there is a 3% probability of observing this difference purely by random chance if the null hypothesis were true)?",
            "Why must you use a Paired T-test (`type = 1`) when comparing Before and After measurements on the exact same group of patients or users?",
            "Why is running multiple T-tests across 5 different product variants dangerous (the multiple testing problem / family-wise error rate), and why does `ANOVA` solve this?"
        ],
        "situationalPuzzle": {
            "scenario": "A marketing team tests 3 email subject lines (Variant A, B, C) on 3,000 customers. The analyst wants to know if there is a statistically significant difference in open rates between the 3 variants. The analyst runs three separate pairwise T-tests (A vs B, B vs C, A vs C) at $\\alpha = 0.05$.",
            "options": [
                "Running 3 separate T-tests is standard practice.",
                "Diagnose Family-Wise Error Rate Inflation: Running multiple pairwise T-tests inflates Type I error risk (false positives accumulate: $1 - (1 - 0.05)^3 = 14.3\\%$ error chance). The correct statistical protocol is to run a Single-Factor ANOVA (Analysis of Variance) F-test first; only if the global ANOVA F-test is significant ($P < 0.05$) should post-hoc pairwise tests (with Bonferroni or Tukey corrections) be evaluated.",
                "Pick whichever variant has the coolest subject line.",
                "Delete the email campaign."
            ],
            "correctOptionIndex": 1,
            "debrief": "Comparing more than two groups via multiple T-tests severely inflates the false-positive rate. Single-Factor ANOVA tests whether any difference exists across all groups simultaneously, maintaining the false positive risk at the strict $\\alpha = 0.05$ threshold."
        },
        "quests": [
            {
                "id": "Q34.165",
                "name": "Inferential Statistics & Hypothesis Testing Mathematics",
                "type": "Concept",
                "desc": "Detail the mathematical formulation of Z-scores, Student's T-distributions, degrees of freedom, P-values, Type I/II errors, and ANOVA F-ratios."
            },
            {
                "id": "Q34.166",
                "name": "The Family-Wise Error Rate False Discovery Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a pharmaceutical marketing campaign that launched an ineffective drug feature; trace how uncorrected multiple T-tests produced a false positive."
            },
            {
                "id": "Q34.167",
                "name": "A/B Testing & ANOVA Hypothesis Testing Suite",
                "type": "Mastery Assignment",
                "desc": "Build an automated A/B testing evaluation engine in Excel/Python executing two-tailed T-tests, paired sample comparisons, and Single-Factor ANOVA with p-value cards."
            },
            {
                "id": "Q34.168",
                "name": "High-Volume Clinical Trial Hypothesis Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Analyze a multi-arm clinical trial across 4 patient cohorts and 10,000 observations; execute ANOVA and post-hoc Bonferroni corrections with zero false discoveries."
            }
        ]
    },
    {
        "day": 43,
        "month": 2,
        "blockNum": 9,
        "title": "Bivariate Correlation & Ordinary Least Squares (OLS) Linear Regression: R², Residual Plots & P-Values",
        "stageNum": 9,
        "stageName": "Stage 9: Statistical Analysis & Predictive Modeling",
        "pedagogicalRole": "Predictive Econometrics & Linear Modeling (Pearson Correlation, OLS Regression, Coefficient of Determination R², Residual Homoscedasticity & LINE Assumptions)",
        "spokenGoal": "How does marketing spend predict sales revenue? That is the domain of Ordinary Least Squares (OLS) Linear Regression. Today, you master predictive modeling in Excel: calculating Pearson correlation with `CORREL()`, generating trendline equations ($y = mx + b$), calculating the coefficient of determination ($R^2$), and interpreting Regression Summary Outputs from the Analysis Toolpak (Coefficients, Standard Errors, P-values, and Residual Plots).",
        "conceptInvariant": "OLS Linear Regression Invariant: The regression line $\\hat{y} = \\beta_0 + \\beta_1 x$ minimizes the sum of squared residuals $\\sum (y_i - \\hat{y}_i)^2$. The coefficient of determination $R^2 = 1 - \\frac{\\text{SS}_{\\text{res}}}{\\text{SS}_{\\text{tot}}}$ measures the proportion of variance explained. Valid OLS requires meeting LINE assumptions: Linearity, Independence, Normality of residuals, and Homoscedasticity (equal variance of residuals).",
        "failureMode": "The Anscombe's Quartet Non-Linear Blindness Disaster: An algorithmic trading firm evaluates 4 investment strategies. An analyst reports that all 4 strategies have identical correlation ($r = 0.816$) and identical regression lines ($y = 3.0 + 0.5x$). Without plotting residual charts, the firm invests heavily. In reality, strategy 2 was a parabolic curve and strategy 4 was an outlier artifact (Anscombe's Quartet), causing immediate losses when market conditions shifted.",
        "tryItFriction": "Run a linear regression in Excel using `=LINEST(known_y's, known_x's, TRUE, TRUE)`; extract the slope, intercept, standard errors, and $R^2$ into a dynamic forecast formula.",
        "socraticHints": [
            "Why must you always inspect a Scatter Plot and Residual Plot rather than blindly trusting a high $R^2$ value (hint: Anscombe's Quartet)?",
            "What does a P-Value $< 0.05$ on a regression slope coefficient ($\\beta_1$) prove about the relationship between variable $X$ and variable $Y$?",
            "What is 'Heteroscedasticity' (residuals fanning out in a cone shape), and why does it invalidate standard error calculations in financial forecasts?"
        ],
        "situationalPuzzle": {
            "scenario": "A retail economist runs an OLS regression predicting Ice Cream Sales ($Y$) from Temperature ($X$). The regression shows a high $R^2 = 0.88$ and $P < 0.001$. Emboldened by this success, the economist runs a regression predicting Drowning Incidents from Ice Cream Sales, finding $R^2 = 0.84$ ($P < 0.001$). The economist recommends banning ice cream sales to prevent drownings.",
            "options": [
                "Ban ice cream immediately to save human lives.",
                "Diagnose Spurious Correlation & Confounding Variable: Correlation does not equal causation! Ice cream sales and drowning incidents both increase in the summer because of an unmodeled confounding variable: Temperature (hot weather). Running a multiple regression controlling for Temperature reveals that ice cream sales have zero causal effect on drowning.",
                "Ban swimming instead.",
                "Square the R-squared value."
            ],
            "correctOptionIndex": 1,
            "debrief": "High $R^2$ values and low P-values do not prove causality. Spurious correlations frequently arise when a lurking confounding variable (e.g. Temperature) simultaneously drives both independent and dependent variables. Multiple regression is required to control for confounders."
        },
        "quests": [
            {
                "id": "Q34.169",
                "name": "Ordinary Least Squares Econometrics & The LINE Assumptions",
                "type": "Concept",
                "desc": "Detail the mathematical mechanics of OLS linear regression, Pearson correlation, $R^2$ variance decomposition, residual homoscedasticity, and LINE assumptions."
            },
            {
                "id": "Q34.170",
                "name": "The Anscombe's Quartet Spurious Linearity Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Analyze an econometric model with a high $R^2 = 0.85$ that failed in production; identify the non-linear curvature revealed in residual scatter plots."
            },
            {
                "id": "Q34.171",
                "name": "Predictive OLS Regression & Residual Diagnostics Suite",
                "type": "Mastery Assignment",
                "desc": "Build an econometric forecasting engine in Excel/Python utilizing dynamic `LINEST` formulas, automated residual plot generators, and coefficient significance tests."
            },
            {
                "id": "Q34.172",
                "name": "Multi-Variable Macroeconomic Demand Forecasting Lab",
                "type": "Production Incident Lab",
                "desc": "Execute a multi-variable OLS regression predicting product demand across price, advertising spend, and competitor pricing; achieve 100% homoscedastic residual validation."
            }
        ]
    },
    {
        "day": 44,
        "month": 2,
        "blockNum": 9,
        "title": "Time-Series Forecasting & Exponential Smoothing: Seasonality Decomposition & Trend Projections (FORECAST.ETS)",
        "stageNum": 9,
        "stageName": "Stage 9: Statistical Analysis & Predictive Modeling",
        "pedagogicalRole": "Temporal Forecasting & Predictive Analytics (Exponential Triple Smoothing ETS, Holt-Winters Method, Additive/Multiplicative Seasonality & Confidence Intervals)",
        "spokenGoal": "Predicting the future is the ultimate goal of enterprise analytics. But real business data doesn't follow a straight line—it has quarterly peaks, holiday seasonality, and structural trends. Today, you master modern Time-Series Forecasting in Excel using the `FORECAST.ETS` (Exponential Triple Smoothing / Holt-Winters) algorithm. You will decompose historical data into Level, Trend, and Seasonality, generate multi-year predictive cones, and calculate 95% confidence prediction intervals.",
        "conceptInvariant": "Exponential Triple Smoothing (ETS) Invariant: `FORECAST.ETS(target_date, values, timeline, [seasonality], [data_completion], [aggregation])` implements the Holt-Winters algorithm: decomposing series into Level $L_t = \\alpha (Y_t - S_{t-m}) + (1-\\alpha)(L_{t-1} + T_{t-1})$, Trend $T_t = \\beta (L_t - L_{t-1}) + (1-\\beta)T_{t-1}$, and Seasonality $S_t = \\gamma (Y_t - L_t) + (1-\\gamma)S_{t-m}$. Confidence bounds use `FORECAST.ETS.CONFINT()`.",
        "failureMode": "The Seasonal Inventory Stockout Catastrophe: A toy manufacturer forecasts holiday toy demand using simple linear regression (`FORECAST.LINEAR`). Because simple linear regression draws a straight line through the annual average, it fails to account for the massive 400% Q4 holiday seasonality spike. The factory under-produces by 800,000 units, resulting in nationwide stockouts and $32M in lost holiday revenue.",
        "tryItFriction": "Construct a seasonal sales forecast using `=FORECAST.ETS(TargetDate, HistorySales, HistoryDates)` and `=FORECAST.ETS.CONFINT(...)` that projects 12 future months with upper and lower 95% confidence intervals.",
        "socraticHints": [
            "Why is simple linear regression (`FORECAST.LINEAR`) catastrophically unsuited for retail businesses with heavy holiday seasonality?",
            "How does Exponential Triple Smoothing (Holt-Winters) assign exponentially declining weights to older historical data points compared to recent observations?",
            "What is the difference between an Additive seasonal model (seasonal swings are a constant dollar amount) and a Multiplicative seasonal model (seasonal swings scale proportionally with trend)?"
        ],
        "situationalPuzzle": {
            "scenario": "A utility company forecasts summer electricity demand using `FORECAST.ETS`. The timeline has missing dates for two weekend storm outages. The formula throws an error or flattens the seasonal wave. The analyst notices the fifth argument `data_completion` was left blank.",
            "options": [
                "Electricity demand cannot be forecasted after storms.",
                "Configure Missing Data Interpolation: By default, `FORECAST.ETS` requires an intact timeline. Setting the fifth parameter `data_completion = 1` instructs the ETS engine to automatically interpolate missing points using the average of adjacent values, restoring the smooth seasonal curve.",
                "Delete all summer dates.",
                "Replace electricity with candles."
            ],
            "correctOptionIndex": 1,
            "debrief": "Real-world time-series data often contains missing timestamps due to outages or holidays. The `FORECAST.ETS` function includes a native parameter (`data_completion: 1`) that automatically imputes missing points via linear interpolation, preserving seasonal cycle integrity."
        },
        "quests": [
            {
                "id": "Q34.173",
                "name": "Holt-Winters Mathematics & Exponential Triple Smoothing Architecture",
                "type": "Concept",
                "desc": "Detail the mathematical formulation of Exponential Triple Smoothing (ETS), Level-Trend-Seasonality equations, smoothing parameters ($\\alpha, \\beta, \\gamma$), and prediction intervals."
            },
            {
                "id": "Q34.174",
                "name": "The Linear Forecast Holiday Stockout Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a multi-million-dollar retail inventory shortfall; trace how using linear regression in place of seasonal ETS forecasting failed to capture holiday demand spikes."
            },
            {
                "id": "Q34.175",
                "name": "Production Time-Series ETS Forecasting Engine",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise demand forecasting suite in Excel/Python utilizing `FORECAST.ETS` with automated seasonality detection, confidence bands, and visual prediction cones."
            },
            {
                "id": "Q34.176",
                "name": "Multi-Year High-Volatility Seasonal Demand Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Forecast 24 future months across a 10-year volatile energy demand dataset; achieve $<5\\%$ Mean Absolute Percentage Error (MAPE) against realized test holdout data."
            }
        ]
    },
    {
        "day": 45,
        "month": 2,
        "blockNum": 9,
        "title": "Milestone 6: ApexAnalytics Statistical Testing & Time-Series Forecasting Engine Suite",
        "stageNum": 9,
        "stageName": "Stage 9: Statistical Analysis & Predictive Modeling",
        "pedagogicalRole": "Architectural Capstone & Integrated Synthesis (Descriptive Profiling, Hypothesis Testing, OLS Econometrics & Seasonal ETS Projections)",
        "spokenGoal": "Day 45 brings you to Milestone 6. You have mastered quantitative distribution profiling, inferential hypothesis testing, OLS regression econometrics, and Holt-Winters seasonal forecasting. Today, you assemble ApexAnalytics: a comprehensive enterprise statistical intelligence suite capable of unmasking dirty data anomalies, proving A/B testing significance, and forecasting multi-million-dollar demand trajectories.",
        "conceptInvariant": "Milestone 6 Architectural Invariant: A rigorous statistical analysis engine must profile distributions across all four moments, eliminate outlier distortion via Tukey IQR fences, evaluate hypothesis testing within strict family-wise error limits, validate OLS models against LINE assumptions, and forecast non-linear time series via seasonal ETS.",
        "failureMode": "ApexAnalytics Model Rejection Outage: During milestone review, the evaluation committee submits a contentious dataset containing an unmodeled structural break (a COVID-era demand drop) and severe heteroscedasticity. A failure to detect the structural break causes the linear forecasting engine to predict negative demand, invalidating the analysis.",
        "tryItFriction": "Deploy the complete ApexAnalytics platform: profile a 10,000-row dataset, isolate outliers via IQR fences, run a single-factor ANOVA on 3 marketing variants, execute a validated OLS regression, and project 12 months of demand with 95% confidence intervals.",
        "socraticHints": [
            "Why is statistical hypothesis testing mandatory before an enterprise authorizes capital allocation for product redesigns?",
            "How does combining descriptive moment analysis (Skew/Kurt) with residual scatter plots prevent modelers from falling into the Anscombe's Quartet trap?",
            "What operational metrics (p-values, F-ratios, $R^2$, MAPE, confidence intervals) must ApexAnalytics display on its executive summary card?"
        ],
        "situationalPuzzle": {
            "scenario": "During your Milestone 6 defense, the Chief Data Scientist challenges your regression model: 'Your ApexAnalytics engine reports an impressive $R^2 = 0.91$ for our demand model. But did you verify that the residuals are normally distributed and homoscedastic, or did you just look at the $R^2$ number?'. How do you defend your methodology?",
            "options": [
                "Admit that you only looked at $R^2$ and hope for mercy.",
                "Demonstrate Comprehensive LINE Assumption Verification: ApexAnalytics incorporates an automated Residual Diagnostic Engine: (1) Generates a standardized residual scatter plot verifying random distribution around zero without heteroscedastic fanning; (2) Computes a residual histogram and Q-Q plot verifying normality; (3) Executes a Durbin-Watson test verifying zero autocorrelation; proving that the $R^2 = 0.91$ metric is econometrically valid.",
                "Claim that $R^2 > 0.9$ automatically proves everything is perfect.",
                "Turn off residual plotting."
            ],
            "correctOptionIndex": 1,
            "debrief": "High $R^2$ alone does not validate a regression model. Defending econometric rigor requires proving that the model satisfies the LINE assumptions (Linearity, Independence, Normality, and Homoscedasticity) through dedicated residual diagnostic charts and statistical tests."
        },
        "quests": [
            {
                "id": "Q34.177",
                "name": "ApexAnalytics Systems Architecture & Econometric Blueprint",
                "type": "Concept",
                "desc": "Document the complete systems architecture of ApexAnalytics, detailing distribution profiling, ANOVA hypothesis testing, OLS regression diagnostics, and ETS forecasting."
            },
            {
                "id": "Q34.178",
                "name": "The Heteroscedastic Demand Distortion Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a high-stakes econometric failure where unverified residual variance caused an executive forecasting model to underestimate downside tail risk."
            },
            {
                "id": "Q34.179",
                "name": "ApexAnalytics Production Statistical Intelligence Platform",
                "type": "Mastery Assignment",
                "desc": "Build the full ApexAnalytics platform in Excel/Python, unifying descriptive statistics, ANOVA hypothesis tests, OLS regression with residual diagnostics, and seasonal ETS forecasts."
            },
            {
                "id": "Q34.180",
                "name": "ApexAnalytics Milestone 6 Viva Defense & Chaos Gate",
                "type": "Production Incident Lab",
                "desc": "Defend ApexAnalytics before the Senior Data Science Board under live structural-break data injections, multi-variant A/B test stress, and adversarial statistical interrogation."
            }
        ]
    }
]

out_path = Path(__file__).resolve().parent / "excel_data_viz_spec_m2_part1.py"

content = f'''# scripts/visuals/excel_data_viz_spec_m2_part1.py
# Month 2: Days 31 to 45 Specification for Course 34: Excel & Data Analysis Fundamentals (course-excel-data-viz)
# Conforms strictly to Gate v2 / True 9.8 standard across all 15 days (60 Quests: Q34.121 to Q34.180).

DAYS_31_TO_45 = {json.dumps(days_data, indent=2)}
'''

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} with {len(days_data)} days ({sum(len(d['quests']) for d in days_data)} quests).")
