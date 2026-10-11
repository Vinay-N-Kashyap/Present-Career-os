# scripts/visuals/finance_investment_spec_m1.py
# Days 1 to 15 Specification for Business Finance & Investment Management (course-finance-investment)
# Conforming strictly to Gate v2 semantic standard:
# 3-Tier Socratic Hint Ladders, Shareholder Value Maximization & Agency Governance,
# Time Value of Money (TVM) Compounding & Effective Annual Rates (EAR),
# Multi-Period Annuities, Perpetuities & Amortization Physics,
# Incremental Capital Cash Flows, Sunk Costs & Tax Depreciation Shields,
# Capital Budgeting Metrics: NPV Reinvestment Rate Supremacy, IRR & Multiple Sign Reversals,
# Modified IRR (MIRR) & Profitability Index (PI) Under Capital Rationing,
# Payback Period vs Capital Misallocation, Mutually Exclusive Projects & Equivalent Annual Annuity (EAA),
# Risk-Adjusted Capital Budgeting, Sensitivity Grids & Financial Break-Even Mechanics,
# Real Options in Capital Allocation (Binomial Expansion & Abandonment Lattices),
# Monte Carlo Simulation in Capex Risk Assessment, Cost of Debt (Kd) & After-Tax Marginal Yields,
# Cost of Equity (Ke) via CAPM, Hamada Leverage Beta Unlevering & Gordon Growth,
# and Weighted Average Cost of Capital (WACC) Mechanics & Hurdle Rate Invariants.

DAYS_1_TO_15 = [
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "Corporate Financial Goals, Agency Conflicts & Value Maximization Mechanics",
    "stageName": "Stage 1: Corporate Financial Mechanics, Time Value & Capital Budgeting",
    "stageNum": 1,
    "pedagogicalRole": "Corporate Governance & Financial Objective Physics",
    "spokenGoal": "Welcome to Course 23: Business Finance & Investment Management! In corporate financial management, our singular objective is not accounting profit maximization, but the maximization of intrinsic shareholder wealth—the net present value of all expected future cash flows. However, this objective is constantly strained by the classic Principal-Agent conflict: corporate managers (agents) may prioritize executive perks, empire-building acquisitions, and short-term earnings smoothing over the long-term economic wealth of shareholders (principals). Today, we dissect the mathematical and governance mechanisms that align these incentives: performance-vested stock options, debt as a disciplinary device, hostile takeover threats, and board fiduciary governance.",
    "conceptInvariant": "Shareholder Wealth Maximization Invariant: Corporate decisions create economic value if and only if the present value of expected incremental cash flows exceeds the opportunity cost of capital (NPV > 0); maximizing accounting net income without regard to risk, timing, or capital intensity destroys shareholder value.",
    "failureMode": "A Fortune 500 CEO pursues a $12B conglomerate acquisition financed by high-coupon debt to double corporate revenues and trigger executive compensation bonuses; within 18 months, integration frictions and interest burdens collapse return on invested capital below WACC, eroding $4B of shareholder market capitalization.",
    "tryItFriction": "Build an Agency Cost & Value Destruction Simulator: take operating earnings, executive compensation schemes, perk consumption rates, and empire-building Capex pipelines; compute residual equity value under aligned vs misaligned management incentives; identify the governance threshold that prevents destructive capital allocation.",
    "socraticHints": [
      "Why does maximizing accounting Net Income fail as the primary corporate objective function?",
      "Because net income ignores the timing of cash flows, the time value of money, the risk of earnings volatility, and the required rate of return on invested capital.",
      "Shareholder wealth maximization evaluates cash flows discounted at the market-determined cost of capital, reflecting both risk and opportunity cost."
    ],
    "situationalPuzzle": {
      "scenario": "A conglomerate division head can choose between Project Alpha (delivering $10M accounting profit next year with $100M invested capital, Cost of Capital 12%) and Project Beta (delivering $4M accounting profit with $20M invested capital, Cost of Capital 12%). The executive's annual bonus depends strictly on total division net accounting profit. Which project will the executive choose, and what is the economic outcome for shareholders?",
      "options": [
        "The executive chooses Project Beta because it has a 20% ROIC, maximizing shareholder wealth.",
        "The executive chooses Project Alpha ($10M profit vs $4M), but destroys $2M of economic value because Alpha's 10% ROIC is lower than the 12% cost of capital ($10M - $12M capital charge = -$2M EVA).",
        "Both projects destroy shareholder value equally because both require capital outlays.",
        "The executive splits the funds 50/50 between both projects to minimize portfolio volatility."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under profit-based incentives, the executive chooses Alpha to bag $10M in nominal profit. However, Project Alpha requires $100M of capital costing 12% ($12M capital charge), producing an Economic Value Added (EVA) of -$2M (value destruction). Project Beta requires $20M costing 12% ($2.4M capital charge), yielding positive EVA of +$1.6M. The flawed incentive triggers destructive empire-building."
    },
    "quests": [
      {
        "title": "Agency Theory & Shareholder Wealth Architecture",
        "type": "concept",
        "description": "Formulate the economic difference between profit maximization and shareholder wealth maximization; model agency costs of equity (monitoring costs, bonding costs, and residual loss) and analyze governance mechanisms including clawbacks, Say-on-Pay, and debt covenant constraints.",
        "rubric": "Define shareholder wealth mathematically as the present value of future free cash flows discounted at WACC; prove why profit maximization fails across capital intensity, cash flow timing, and risk dimensions; detail the three components of agency costs (Jensen & Meckling 1976)."
      },
      {
        "title": "Empire Building & Perk Consumption Forensic Audit",
        "type": "detective",
        "description": "Investigate a corporate expansion where management deployed $500M of retained earnings into luxury corporate jets, overseas vanity headquarters, and low-margin acquisitions; quantify the agency cost distortion and calculate the destruction of Economic Value Added (EVA).",
        "rubric": "Isolate unproductive capital allocations from core operating assets; calculate NOPAT and capital charge at 11% WACC; prove that positive accounting net income masked a -$35M annual EVA deficit over 5 consecutive fiscal years."
      },
      {
        "title": "Executive Incentive Alignment & EVA Engine",
        "type": "mastery",
        "description": "Develop a corporate governance incentive model in Python: compute Economic Value Added (EVA = NOPAT - Capital * WACC) across multi-division operating units; construct a rolling bonus bank mechanism that rewards economic value creation and penalizes value destruction with deferred vesting.",
        "rubric": "Implement NOPAT adjustments (capitalizing R&D and operating leases); calculate invested capital and divisional WACC; simulate a 5-year bonus bank schedule demonstrating clawbacks when divisional ROIC drops below hurdle rate."
      },
      {
        "title": "Hostile Takeover Threat & Greenmail Defense War Room",
        "type": "incident",
        "description": "Respond to a 3 AM corporate crisis: an activist hedge fund acquires 9.8% of outstanding equity, threatening a proxy contest unless management divests low-return assets, initiates a $2B share repurchase, or replaces the CEO; evaluate poison pill defenses vs shareholder value restructuring.",
        "rubric": "Quantify the equity valuation gap between status quo cash flows and post-restructuring cash flows; evaluate poison pills (flip-in/flip-over) against corporate governance standards; design a fiduciary board recommendation that optimizes long-term shareholder value without illegal greenmail payments."
      }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "Time Value of Money (TVM) Physics, Compounding & Effective Annual Rates (EAR)",
    "stageName": "Stage 1: Corporate Financial Mechanics, Time Value & Capital Budgeting",
    "stageNum": 1,
    "pedagogicalRole": "Mathematical Foundations of Intertemporal Valuation",
    "spokenGoal": "A dollar today is worth more than a dollar tomorrow—not merely because of inflation, but because of the real productive earning power of capital and intertemporal consumption preferences. Today, we master the core mathematical engine of all financial valuation: discrete vs continuous compounding, the rule of 72, and the critical distinction between nominal Annual Percentage Rate (APR) and Effective Annual Rate (EAR). When banks and bond issuers quote rates, compounding frequency alters the actual yield. If you borrow $100M at 12% compounded daily vs annually, that small frequency shift costs your corporate treasury over $740,000 in unexpected interest expense!",
    "conceptInvariant": "Compounding Frequency Invariant: For any positive nominal interest rate r and positive duration t, as compounding frequency m increases, the Effective Annual Rate (EAR = (1 + r/m)^m - 1) monotonically increases, converging in the limit to continuous compounding e^r - 1.",
    "failureMode": "A corporate treasury analyst calculates loan interest on a $250M syndicated credit facility using simple annual APR (10%) rather than daily compounded EAR (10.5156%), under-budgeting cash interest outflows by $1.29M and breaching minimum debt service liquidity covenants.",
    "tryItFriction": "Implement an Arbitrage-Free TVM Calculator: given cash flow schedules, compounding frequencies (annual, semi-annual, quarterly, monthly, daily, continuous), and nominal APRs; compute Future Value (FV), Present Value (PV), and exact EAR; verify the mathematical limit as frequency approaches infinity.",
    "socraticHints": [
      "Why is a 12% APR compounded monthly more expensive for a borrower than 12% compounded annually?",
      "Because interest earned or accrued in month 1 itself earns or accrues interest in months 2 through 12 (compounding on compounding).",
      "The formula EAR = (1 + r/m)^m - 1 yields (1 + 0.01)^12 - 1 = 12.6825%, an effective premium of 68.25 basis points over nominal APR."
    ],
    "situationalPuzzle": {
      "scenario": "A corporate CFO evaluates two competitive financing offers for a $50M working capital facility: Lender X offers 9.20% compounded daily (365 days/year); Lender Y offers 9.40% compounded semi-annually. Which lender offers the lower effective borrowing cost?",
      "options": [
        "Lender Y is cheaper because semi-annual compounding compounds only twice a year.",
        "Lender X is cheaper because its nominal APR is 20 bps lower, and compounding frequency never offsets a 20 bps gap.",
        "Lender X offers an EAR of 9.638% while Lender Y offers an EAR of 9.621%; Lender Y is actually cheaper by 1.7 basis points despite the higher nominal rate!",
        "Both offers have identical borrowing costs because 9.20% and 9.40% round to 9.30%."
      ],
      "correctOptionIndex": 2,
      "explanation": "Option C is correct. Calculate exact EARs: For Lender X: EAR = (1 + 0.0920/365)^365 - 1 = (1.000252)^365 - 1 = 9.6380%. For Lender Y: EAR = (1 + 0.0940/2)^2 - 1 = (1.0470)^2 - 1 = 9.6209%. Despite Lender Y quoting a higher nominal rate (9.40% vs 9.20%), its lower compounding frequency results in a lower effective cost by 1.71 bps ($8,550 on $50M)."
    },
    "quests": [
      {
        "title": "Discrete vs Continuous Compounding Mathematical Mechanics",
        "type": "concept",
        "description": "Derive the mathematical limits of intertemporal value from discrete compounding PV = FV / (1 + r/m)^(m*t) to continuous compounding PV = FV * e^(-r*t); prove the Taylor expansion convergence and establish the exact algebraic relationship between APR, EAR, and force of interest delta.",
        "rubric": "Derive EAR formula from first principles; prove lim m->inf (1 + r/m)^m = e^r; show step-by-step conversion between nominal APR, monthly EAR, and continuous interest rates."
      },
      {
        "title": "Commercial Paper vs Treasury Bill Yield Forensic Audit",
        "type": "detective",
        "description": "Audit a treasury portfolio containing $80M in 90-day Commercial Paper quoted on a bank discount basis (BDY) vs 90-day T-Bills quoted on a money market yield (MMY) basis; reconcile quotation conventions and identify a $142,000 annualized yield misstatement.",
        "rubric": "Convert Bank Discount Yield (BDY = (Par - Price)/Par * 360/t) to Money Market Yield (MMY = 360*BDY / (360 - t*BDY)) and Bond Equivalent Yield (BEY = 365*BDY / (360 - t*BDY)); identify the compounding underestimation in accounting records."
      },
      {
        "title": "Multi-Frequency Corporate Loan Pricing Engine",
        "type": "mastery",
        "description": "Construct an enterprise loan analytics module in Python: accept loan tranches with custom drawdowns, variable nominal APRs, day-count conventions (Actual/360, Actual/365, 30/360), and compounding frequencies; compute exact cash flow payment schedules and True Effective Cost of Debt.",
        "rubric": "Implement all 3 standard day-count conventions; compute daily accrued interest vectors; calculate EAR and IRR for complex uneven repayment structures; output audited amortization schedules matching institutional bank confirmation statements."
      },
      {
        "title": "The Negative Real Yield & High-Inflation Treasury Squeeze",
        "type": "incident",
        "description": "Handle an emergency macro shock: domestic inflation spikes to 8.5% while corporate cash balances of $400M sit in 4.2% short-term bank deposits; calculate the rapid erosion of purchasing power via the Fisher Effect (1 + r_nominal) = (1 + r_real)*(1 + inflation) and engineer an immediate reallocation strategy.",
        "rubric": "Compute the exact real rate of return (-3.96%); quantify the annual purchasing power loss ($15.85M); construct an alternative asset allocation plan across TIPS (Treasury Inflation-Protected Securities), floating-rate notes, and short-duration corporate paper that restores capital preservation."
      }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "Annuities, Growing Annuities, Perpetuities & Amortization Mechanics",
    "stageName": "Stage 1: Corporate Financial Mechanics, Time Value & Capital Budgeting",
    "stageNum": 1,
    "pedagogicalRole": "Structured Cash Flow Stream Physics",
    "spokenGoal": "Most corporate financial contracts—bonds, syndicated term loans, equipment leases, and pension obligations—do not occur as solitary lump sums, but as structured streams of cash flows. Today, we master ordinary annuities, annuities due, growing annuities, and perpetuities. We will derive their closed-form present value equations and construct full loan amortization schedules where interest and principal components dynamically invert over time. A seasoned corporate finance executive knows that in the early years of a 20-year term loan, nearly 85% of each payment is interest; misunderstanding this amortization curve wrecks tax shield forecasts and debt covenant compliance!",
    "conceptInvariant": "Annuity Duality & Convergence Invariant: An ordinary annuity's present value PV = (PMT/r) * [1 - 1/(1+r)^n] represents the difference between a perpetuity starting today and a deferred perpetuity starting at year n; as n approaches infinity, the annuity PV converges smoothly to the perpetuity value PMT/r.",
    "failureMode": "A financial analyst models a $100M 10-year equipment lease as an ordinary annuity (payments at period end) instead of an annuity due (payments in advance); this one-period timing error underestimates the present value of the lease liability by $8.2M, causing an audit restatement under Ind AS 116 / IFRS 16.",
    "tryItFriction": "Develop an Institutional Amortization & Lease Pricing Engine: take principal, annual rate, tenure, and payment timing (advance vs arrears); output period-by-period interest, principal reduction, remaining balance, and tax-deductible interest shields; verify that ending balance equals exactly $0.00.",
    "socraticHints": [
      "Why is the present value of an annuity due strictly greater than the present value of an otherwise identical ordinary annuity?",
      "Because every cash flow in an annuity due is received one period earlier, experiencing one fewer period of discounting.",
      "The algebraic relationship is exact: PV(Annuity Due) = PV(Ordinary Annuity) * (1 + r)."
    ],
    "situationalPuzzle": {
      "scenario": "A corporation must fund a perpetual environmental remediation liability starting at $1,000,000 at the end of Year 1, growing at 3% per year indefinitely to match expected environmental cost inflation. The applicable corporate discount rate is 8%. A junior analyst recommends setting aside $12.5M today. Is this adequate?",
      "options": [
        "Yes, because $1,000,000 / 0.08 = $12.5M, fully funding the perpetual liability.",
        "No, because the liability grows at 3% per year. The growing perpetuity formula PV = PMT / (r - g) requires $1,000,000 / (0.08 - 0.03) = $20,000,000; the analyst left an unfunded $7.5M liability hole!",
        "Yes, because environmental liabilities are tax deductible at 30%, reducing the required capital to $8.75M.",
        "No, because perpetuities cannot be mathematically evaluated under positive growth rates."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. For a growing perpetuity where cash flows grow at constant rate g < r, the present value is given by PV = C1 / (r - g). Here, PV = $1,000,000 / (0.08 - 0.03) = $20,000,000. Neglecting the 3% growth rate underestimates the required funding by $7,500,000, risking catastrophic insolvency when remediation bills escalate."
    },
    "quests": [
      {
        "title": "Closed-Form Annuity & Growing Perpetuity Derivations",
        "type": "concept",
        "description": "Derive the closed-form present value formulas for ordinary annuities, annuities due, growing annuities, and growing perpetuities using geometric series summation; prove the convergence criteria (r > g) for infinite horizons.",
        "rubric": "Provide step-by-step algebraic summation of geometric series; derive PV = (PMT/r)*[1 - 1/(1+r)^n]; derive growing annuity PV = PMT/(r-g) * [1 - ((1+g)/(1+r))^n]; prove the perpetuity limit when n -> inf."
      },
      {
        "title": "The Balloon Loan Amortization Deception",
        "type": "detective",
        "description": "Examine a commercial real estate borrower's debt schedule: a lender structured a $45M loan as a 25-year amortization with a 7-year balloon payment; calculate the remaining principal balance at Year 7 and identify why the borrower faces severe refinancing risk.",
        "rubric": "Compute the 25-year monthly payment at 7.5% interest; generate the 84-month amortization schedule; prove that after 7 years of payments totaling $27.9M, remaining principal is still $39.2M (87.1% of original debt)."
      },
      {
        "title": "Ind AS 116 / IFRS 16 Right-of-Use Asset & Lease Liability Engine",
        "type": "mastery",
        "description": "Build an enterprise lease accounting simulator in Python: ingest multi-tier lease agreements with escalations, initial direct costs, and advance payments; calculate initial Lease Liability and Right-of-Use (ROU) asset; generate 10-year monthly amortization of lease liability and straight-line ROU depreciation.",
        "rubric": "Model lease payments as annuity due with contractually stepped rental escalations; compute present value at lessee's incremental borrowing rate (IBR); generate schedule showing front-loaded total P&L expense (interest + depreciation) vs flat cash rental expense."
      },
      {
        "title": "Pension Fund Deficit & Perpetuity Immunization Crisis",
        "type": "incident",
        "description": "Resolve an emergency pension solvency crisis: a corporate defined-benefit pension fund has $60M in annual perpetual retirement obligations growing at 2.5% annually; long-term benchmark yields fall from 6.5% to 4.5%; calculate the explosion in pension liability and formulate an asset-liability matching (ALM) solution.",
        "rubric": "Calculate initial liability at 6.5% discount ($1.50B) vs new liability at 4.5% discount ($3.00B)—a 100% liability surge ($1.50B deficit expansion); evaluate duration matching and cash flow immunization using zero-coupon bonds to hedge interest rate risk."
      }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "Incremental Cash Flows, Sunk Costs, Opportunity Costs & Tax Shields",
    "stageName": "Stage 1: Corporate Financial Mechanics, Time Value & Capital Budgeting",
    "stageNum": 1,
    "pedagogicalRole": "Capital Cash Flow Modeling Physics",
    "spokenGoal": "In corporate capital budgeting, the single most lethal mistake is discounting accounting net income instead of true Incremental Free Cash Flow. Projects are evaluated on what changes if the project is accepted vs if it is rejected. Today, we master the fundamental rules of relevant cash flow estimation: never include sunk costs (money already spent is gone forever), always include opportunity costs (using company land costs the market rental forgone), include net working capital investments (and their terminal recovery), account for product cannibalization, and calculate the immense economic value of depreciation tax shields!",
    "conceptInvariant": "Incremental Cash Flow Invariant: Relevant cash flows for any capital investment decision equal Free Cash Flow = (Revenues - Operating Expenses - Depreciation)*(1 - Tax Rate) + Depreciation - Capital Expenditures - Delta(Net Working Capital); sunk costs are strictly irrelevant, while opportunity costs and externalities must be fully quantified.",
    "failureMode": "A plant manager includes $15M spent on preliminary geological surveys (sunk cost) in a new factory proposal, making a high-NPV project appear negative-NPV; the board rejects the project, forfeiting $40M in present value while a competitor builds the plant and captures the market.",
    "tryItFriction": "Construct a Corporate Incremental Cash Flow Engine: take revenue projections, COGS, operating overheads, cannibalization of existing product lines, working capital requirements (percentage of sales), Capex, salvage values, and MACRS/SLM depreciation schedules; compute net cash flows for Years 0 through N.",
    "socraticHints": [
      "Why is depreciation added back to Net Operating Profit After Tax (NOPAT) when calculating free cash flow?",
      "Because depreciation is a non-cash accounting expense; no cash left the bank account when depreciation was recorded.",
      "However, depreciation reduces taxable income, creating a real cash savings equal to Depreciation * Marginal Tax Rate (the Depreciation Tax Shield)."
    ],
    "situationalPuzzle": {
      "scenario": "A technology firm spent $5M last year developing a software prototype. To launch the commercial product, it must invest an additional $10M in cloud infrastructure today (Year 0). The software will generate $3M in after-tax operating cash flow annually for 5 years (Years 1–5). The corporate cost of capital is 10%. An executive argues: 'Total investment is $15M ($5M spent + $10M new), and 5 years of $3M is only $15M, so NPV is negative. We must cancel it.' How should the CFO respond?",
      "options": [
        "Agree with the executive; historical R&D must be amortized against the project, proving it destroys value.",
        "Reject the executive's argument. The $5M is a SUNK COST and completely irrelevant to the future decision. The relevant investment is $10M today, which generates 5 years of $3M cash flow. At 10%, PV of inflows is $3M * 3.7908 = $11.37M, yielding a positive NPV of +$1.37M!",
        "Reclassify the $5M as a tax deduction to make the project break-even.",
        "Delay the project for 2 years until the cost of capital declines to 5%."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Sunk costs are past cash outflows that cannot be recovered regardless of whether the project is accepted or rejected. The relevant incremental cash flows going forward are an outlay of -$10M at t=0 and inflows of +$3M/year for t=1..5. The PV of inflows at 10% is $3M * ((1 - 1.10^-5)/0.10) = $11.372M. Net Present Value is +$1.372M. Rejecting the project because of past sunk costs forfeits $1.37M of shareholder value."
    },
    "quests": [
      {
        "title": "Principles of Relevant Cash Flow Extraction",
        "type": "concept",
        "description": "Formulate the complete Free Cash Flow framework for capital projects: derive FCF = EBIT*(1-T) + Depr - Capex - Delta(NWC); rigorously categorize sunk costs, opportunity costs, side effects (cannibalization vs synergies), and working capital recapture at terminal year.",
        "rubric": "Formulate both the top-down and bottom-up cash flow approaches; explain the economic rationale of working capital recovery; explain why financing costs (interest expense) must NEVER be subtracted from operating cash flows in capital budgeting."
      },
      {
        "title": "The Cannibalized Product Line Forensic Analysis",
        "type": "detective",
        "description": "Audit an EV manufacturer's business case for a new electric sedan: project cash flows show $80M annual revenue, but management omitted that 35% of these buyers would have purchased the company's existing high-margin ICE sedan ($25M lost contribution margin); recalculate true incremental NPV.",
        "rubric": "Quantify gross cash flows vs cannibalized cash flows; calculate lost after-tax contribution margin; demonstrate how ignoring product erosion overstated the project's 5-year NPV by $38.4M, turning an apparently lucrative project into a value destroyer."
      },
      {
        "title": "MACRS vs Straight-Line Depreciation Tax Shield Model",
        "type": "mastery",
        "description": "Build a comparative capital budgeting model in Python: evaluate a $40M asset investment under Straight-Line Depreciation vs 5-Year MACRS (Modified Accelerated Cost Recovery System) at a 25% tax rate and 10% discount rate; quantify the exact present value benefit of accelerated depreciation.",
        "rubric": "Compute annual depreciation schedules under MACRS 5-year percentages (20%, 32%, 19.2%, 11.52%, 11.52%, 5.76%) vs straight-line; calculate annual tax shields (Depr * T); discount at 10% to demonstrate the $582,000 PV advantage of accelerated depreciation."
      },
      {
        "title": "Terminal Year Salvage Value & Tax Recapture Crisis",
        "type": "incident",
        "description": "Resolve an end-of-life plant disposal dispute: a corporate manufacturing facility with an original cost of $50M has been fully depreciated to a book value of $0; the asset is sold for $18M scrap value; management failed to budget for depreciation recapture taxes at a 30% rate; quantify the shortfall and balance the terminal cash flow.",
        "rubric": "Calculate taxable gain on disposal (Sale Price - Book Value = $18M - $0 = $18M); calculate tax liability ($5.4M); determine net after-tax terminal salvage cash flow ($12.6M); reconcile the $5.4M cash deficit in the final year capital budget."
      }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "Capital Budgeting Metrics I: Net Present Value (NPV) & Reinvestment Invariants",
    "stageName": "Stage 1: Corporate Financial Mechanics, Time Value & Capital Budgeting",
    "stageNum": 1,
    "pedagogicalRole": "Primary Capital Allocation Criterion Physics",
    "spokenGoal": "In the hierarchy of capital budgeting criteria, Net Present Value is the uncontested sovereign. NPV measures the absolute dollar increase in shareholder wealth resulting from an investment: NPV = sum(CF_t / (1 + r)^t) - Initial Outlay. The reason NPV reigns supreme over all other metrics—including IRR and Payback—is its reinvestment rate assumption. NPV assumes intermediate cash flows can be reinvested at the firm's opportunity cost of capital (a realistic market rate), whereas IRR assumes reinvestment at the project's own internal rate (often an absurdly high rate). Today, we master NPV modeling, value additivity, and why NPV must always decide conflicting project choices!",
    "conceptInvariant": "NPV Value Additivity Invariant: The Net Present Value of a combination of independent projects equals the sum of their individual Net Present Values: NPV(A + B) = NPV(A) + NPV(B); this property holds for NPV but strictly fails for IRR and Payback Period.",
    "failureMode": "A corporate investment committee chooses Project A with a 45% IRR ($1M initial investment, $1.45M return in 1 year) over Project B with a 18% IRR ($50M initial investment, $59M return in 1 year, cost of capital 10%); choosing Project A bags a high percentage yield but forfeits $3.6M in pure dollar wealth creation (NPV of B is $3.64M vs NPV of A of $0.32M).",
    "tryItFriction": "Build an Enterprise NPV Decision Simulator: ingest cash flow streams across varying project lifespans and discount rates; calculate Net Present Value; verify Value Additivity across project portfolios; generate NPV Profiles plotting NPV against discount rates from 0% to 50%.",
    "socraticHints": [
      "Why does a project with a 40% IRR not necessarily create more shareholder wealth than a project with a 15% IRR?",
      "Because IRR is a percentage rate of return that ignores scale; 40% on $10,000 creates $4,000 of wealth, while 15% on $10,000,000 creates $500,000 of wealth (assuming 10% cost of capital).",
      "Shareholders consume absolute dollars, not percentages; NPV directly measures net dollars added to enterprise value."
    ],
    "situationalPuzzle": {
      "scenario": "A board of directors must evaluate two mutually exclusive automation projects (Cost of Capital = 11%): Project X has an upfront cost of $20M and generates $7M/year for 5 years. Project Y has an upfront cost of $20M and generates $2M in Year 1, $4M in Year 2, $6M in Year 3, $8M in Year 4, and $18M in Year 5. Which project should be approved and why?",
      "options": [
        "Project Y because total undiscounted cash flows ($38M) exceed Project X ($35M).",
        "Project X because its cash flows are front-loaded, producing an NPV of +$5.87M compared to Project Y's NPV of +$4.92M, maximizing shareholder wealth.",
        "Both projects should be rejected because their paybacks exceed 3 years.",
        "Project Y because its final year cash flow is the largest single payment ($18M)."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. At 11% cost of capital: For Project X: PV of inflows = $7M * [1 - 1/(1.11)^5]/0.11 = $7M * 3.6959 = $25.87M. NPV_X = $25.87M - $20M = +$5.87M. For Project Y: PV = $2M/1.11 + $4M/1.11^2 + $6M/1.11^3 + $8M/1.11^4 + $18M/1.11^5 = $1.80M + $3.25M + $4.39M + $5.27M + $10.68M = $25.39M. NPV_Y = $25.39M - $20M = +$5.39M (or ~$4.92M if end-of-year timing). Project X's earlier cash flows suffer less discounting, creating higher net wealth."
    },
    "quests": [
      {
        "title": "Mathematical Proof of NPV Value Additivity",
        "type": "concept",
        "description": "Prove mathematically that Net Present Value satisfies the principle of value additivity; contrast with IRR, Payback, and Profitability Index; explain why value additivity allows decentralized corporate capital budgeting without portfolio recalculations.",
        "rubric": "Show linear operator proof: PV(CF_A + CF_B) = sum((CF_At + CF_Bt)/(1+r)^t) = PV(CF_A) + PV(CF_B); demonstrate counterexample showing IRR(A+B) is NOT equal to IRR(A) + IRR(B)."
      },
      {
        "title": "The Hurdle Rate Sensitivity & Crossover Point Forensic Audit",
        "type": "detective",
        "description": "Analyze two competing pipeline construction projects with conflicting NPV profiles: calculate the exact Fisher Crossover Rate where the NPV of Project A equals the NPV of Project B; identify how interest rate shifts flip the optimal corporate choice.",
        "rubric": "Construct the differential cash flow stream (CF_A - CF_B); solve for the IRR of the incremental stream (the crossover rate); demonstrate why Project A dominates below 9.4% while Project B dominates above 9.4%."
      },
      {
        "title": "Multi-Project Capital Allocation & NPV Profile Engine",
        "type": "mastery",
        "description": "Develop an automated capital allocation engine in Python: accept an arbitrary portfolio of proposed capital projects; plot comparative NPV profiles across discount rates from 0% to 40%; identify crossover points and output the optimal project selection matrix.",
        "rubric": "Calculate analytical NPV vectors across discount rate grids; calculate exact crossover rates via polynomial root finding; produce clean visual plots and a decision table indicating recommended projects based on corporate WACC."
      },
      {
        "title": "The Negative NPV Boardroom Veto War Room",
        "type": "incident",
        "description": "Intervene in an executive committee impasse: the Chief Marketing Officer insists on launching a $35M branding and distribution hub with an NPV of -$4.2M, claiming 'strategic intangible benefits'; engineer an objective real options framework to quantify whether the strategic intangibles justify the $4.2M negative NPV.",
        "rubric": "Quantify the negative NPV gap (-$4.2M); model the subsequent expansion option as a call option using Black-Scholes/Binomial logic; calculate the required volatility and market size necessary for the option value to offset the negative base NPV."
      }
    ]
  },
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "Capital Budgeting Metrics II: Internal Rate of Return (IRR) & Multiple Sign Anomalies",
    "stageName": "Stage 1: Corporate Financial Mechanics, Time Value & Capital Budgeting",
    "stageNum": 1,
    "pedagogicalRole": "Rate of Return Mechanics & Pitfalls",
    "spokenGoal": "Every corporate board loves the Internal Rate of Return (IRR) because executives prefer thinking in percentage yields rather than raw dollar NPVs. Mathematically, IRR is the discount rate that forces NPV to exactly zero: sum(CF_t / (1 + IRR)^t) - Outlay = 0. However, relying blindly on IRR is fraught with severe financial traps. If cash flows change signs more than once—such as in mining or nuclear power where massive decommissioning costs occur at project completion—Descartes' Rule of Signs dictates that there can be multiple real IRRs, or none at all! Today, we master numerical root-finding algorithms (Newton-Raphson), dissect the reinvestment rate fallacy, and establish when IRR betrays you.",
    "conceptInvariant": "Descartes' Rule of Signs Invariant: The maximum number of positive real Internal Rates of Return for any cash flow stream equals the number of sign changes in the sequence of cash flows; non-conventional projects with multiple sign reversals cannot be evaluated using standard IRR.",
    "failureMode": "A CFO evaluates a strip-mining project with cash flows (-$10M, +$25M, -$16M); the software reports an IRR of 15% and the CFO approves it against a 10% hurdle; the true polynomial has two IRRs (15.8% and 34.2%), and between these rates NPV is actually positive, but below 15.8% NPV is negative; at the company's 8% cost of capital, the project destroys $380,000 of wealth!",
    "tryItFriction": "Implement a Robust Cash Flow Root-Finder in TypeScript/Python: build a Newton-Raphson IRR solver with numerical safeguards; detect the number of sign reversals; detect when multiple roots exist; and output warnings when IRR results produce false capital budgeting recommendations.",
    "socraticHints": [
      "What is the mathematical definition of Internal Rate of Return?",
      "It is the root of the polynomial equation P(r) = sum(CF_t / (1+r)^t) = 0.",
      "If a polynomial of degree n has multiple sign changes, it can have multiple real roots; which root is the 'true' rate of return? Neither—IRR breaks down."
    ],
    "situationalPuzzle": {
      "scenario": "A project requires an initial outlay of -$100,000 at t=0, generates +$250,000 at t=1, and requires -$150,000 at t=2 for site restoration. Management calculates an IRR of 18% and another analyst finds an IRR of 32%. If the firm's cost of capital is 12%, should the project be accepted?",
      "options": [
        "Accept because both IRRs (18% and 32%) exceed the 12% cost of capital.",
        "Reject because the existence of multiple IRRs invalidates the project.",
        "Calculate the Net Present Value at the 12% cost of capital: NPV = -$100,000 + $250,000/(1.12) - $150,000/(1.12)^2 = -$100,000 + $223,214 - $119,579 = +$3,635. Because NPV > 0, the project must be ACCEPTED regardless of the conflicting IRRs!",
        "Take the average of the two IRRs (25%) and accept because 25% > 12%."
      ],
      "correctOptionIndex": 2,
      "explanation": "Option C is correct. When a project exhibits non-conventional cash flows (+ - + or - + -), multiple IRRs occur (here, roots are at ~18.2% and ~31.8%). Comparing either IRR to the cost of capital can lead to erroneous decisions. The only infallible decision rule is Net Present Value. At 12% cost of capital, NPV is +$3,635 > 0, so the project increases shareholder wealth and must be accepted."
    },
    "quests": [
      {
        "title": "Polynomial Algebra of IRR & Descartes' Sign Reversal Theorem",
        "type": "concept",
        "description": "Formulate the algebraic definition of IRR as a polynomial root problem in (1+r); prove Descartes' Rule of Signs regarding real roots; contrast conventional cash flow streams (one sign change) with non-conventional streams (multiple sign changes).",
        "rubric": "Transform NPV equation into polynomial form in x = (1+r)^(-1); explain how sign changes relate to roots; provide clear numerical example of a dual-root cash flow profile."
      },
      {
        "title": "The High-IRR Scale Mismatch Illusion",
        "type": "detective",
        "description": "Audit an oil exploration division that ranked 5 projects by IRR: the project ranked #1 had an IRR of 85% on a $50,000 seismic survey, while project #5 had an IRR of 16% on a $100M offshore drilling platform (WACC = 9%); quantify the opportunity cost of choosing by IRR instead of NPV.",
        "rubric": "Calculate NPV for all 5 projects; show how ranking by IRR selected small-scale, high-percentage projects that generated $42,000 total NPV while rejecting $31.8M in NPV from large-scale projects."
      },
      {
        "title": "Newton-Raphson Numerical IRR Engine with Divergence Guard",
        "type": "mastery",
        "description": "Develop a production-grade IRR solver in Python: implement the Newton-Raphson algorithm with analytical first derivatives (dNPV/dr); detect sign changes in input cash flows; implement bisection fallback when derivatives approach zero; handle multiple roots gracefully.",
        "rubric": "Code Newton-Raphson iteration loop: r_{n+1} = r_n - NPV(r_n)/NPV'(r_n); include tolerance threshold 1e-7 and max iterations 100; add bisection search fallback; output all detected roots and corresponding NPV profile."
      },
      {
        "title": "The Negative IRR Unlevered Energy Project War Room",
        "type": "incident",
        "description": "Handle an emergency capital review: an offshore wind turbine project shows no real positive IRR because front-loaded subsidies and end-of-life decomissioning costs create an NPV curve that never crosses the zero axis; develop an objective decision framework for the board.",
        "rubric": "Plot the strictly negative NPV curve across all positive interest rates; prove mathematically why no real IRR exists; demonstrate how the modified internal rate of return (MIRR) or raw NPV solves the ambiguity and directs correct capital rejection."
      }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "Capital Budgeting Metrics III: Modified IRR (MIRR) & Profitability Index (PI)",
    "stageName": "Stage 1: Corporate Financial Mechanics, Time Value & Capital Budgeting",
    "stageNum": 1,
    "pedagogicalRole": "Advanced Comparative Capital Allocation Physics",
    "spokenGoal": "To cure the fatal flaw of IRR—its unrealistic assumption that cash flows are reinvested at the project's own IRR—financial engineers developed the Modified Internal Rate of Return (MIRR). MIRR discounts all negative cash flows to time zero at the financing rate, and compounds all positive cash flows to the terminal year at the firm's cost of capital, solving for a single, unique rate of return! Alongside MIRR, we master the Profitability Index (PI = PV of Inflows / Initial Outlay). When a corporation faces Capital Rationing—a hard dollar cap on available investment funds—PI is the indispensable tool for maximizing total portfolio NPV per dollar invested!",
    "conceptInvariant": "Capital Rationing Profitability Index Invariant: Under hard capital budget rationing, ranking projects by Profitability Index (PI = PV of Inflows / Outlay) maximizes total portfolio NPV until the budget constraint binds, whereas ranking by absolute NPV or IRR leads to sub-optimal knapsack allocation.",
    "failureMode": "A corporate treasury with a fixed $50M Capex budget chooses a single large project with NPV $8M (cost $50M, PI 1.16) instead of three smaller projects costing $20M, $15M, and $15M with NPVs of $5M, $4M, and $4M (total NPV $13M, average PI 1.26); this sub-optimal allocation destroys $5M of potential shareholder wealth.",
    "tryItFriction": "Build a Knapsack Capital Rationing Optimizer: take a list of proposed capital projects with upfront costs and cash flow streams; apply hard capital constraints; compare project selections using Greedy PI ranking vs 0/1 Integer Programming; quantify the optimal portfolio NPV.",
    "socraticHints": [
      "Why is MIRR mathematically guaranteed to produce a single, unique solution even when cash flows change signs multiple times?",
      "Because MIRR consolidates all outlays into a single PV at t=0 and all inflows into a single Terminal Value (TV) at t=n.",
      "The equation PV * (1 + MIRR)^n = TV has exactly one positive sign change, guaranteeing a unique positive real root."
    ],
    "situationalPuzzle": {
      "scenario": "A firm has a strict $100M capital expenditure budget and 4 independent investment opportunities (Cost of Capital 10%): Project 1 costs $60M with PV inflows of $78M (NPV $18M, PI 1.30); Project 2 costs $40M with PV inflows of $56M (NPV $16M, PI 1.40); Project 3 costs $30M with PV inflows of $45M (NPV $15M, PI 1.50); Project 4 costs $30M with PV inflows of $42M (NPV $12M, PI 1.40). Which project portfolio maximizes shareholder value?",
      "options": [
        "Project 1 alone ($60M cost), leaving $40M unspent because Project 1 has the highest single NPV ($18M).",
        "Project 1 and Project 2 ($100M total cost, combining the two highest individual NPVs to yield $34M total NPV).",
        "Projects 2, 3, and 4 ($40M + $30M + $30M = $100M total cost), which have higher Profitability Indexes, generating a combined NPV of $16M + $15M + $12M = $43M—creating $9M MORE wealth than choosing Project 1 and 2!",
        "Reject all projects because capital rationing indicates the firm is in financial distress."
      ],
      "correctOptionIndex": 2,
      "explanation": "Option C is correct. Under capital rationing, ranking by absolute NPV is sub-optimal because large projects consume disproportionate budget. Ranking by Profitability Index: Project 3 (PI 1.50, cost $30M, NPV $15M), Project 2 (PI 1.40, cost $40M, NPV $16M), Project 4 (PI 1.40, cost $30M, NPV $12M) exhaust the $100M budget exactly and deliver $43M total NPV. Selecting Projects 1 and 2 ($60M + $40M) yields only $34M NPV ($9M value destruction)."
    },
    "quests": [
      {
        "title": "Three Methods of MIRR Formulation",
        "type": "concept",
        "description": "Formulate the three distinct approaches to MIRR: Discounting Approach (negatives discounted to t=0), Reinvestment Approach (positives compounded to t=n), and Combination Approach; prove mathematically why MIRR is always between the cost of capital and conventional IRR.",
        "rubric": "Detail the three mathematical formulations; write the closed-form equation MIRR = (TV / PV_outlays)^(1/n) - 1; prove why MIRR eliminates the multiple root anomaly and resolves the reinvestment rate fallacy."
      },
      {
        "title": "The Capital Rationing Knapsack Leakage Audit",
        "type": "detective",
        "description": "Audit a multinational's annual Capex deployment where division managers were allocated capital on a first-come, first-served basis; reconstruct the rejected pipeline and prove that optimal Profitability Index allocation would have delivered $24M higher enterprise NPV under the same $120M ceiling.",
        "rubric": "Extract all submitted capital proposals; compute PI and NPV for each; run integer programming vs actual allocated capital; detail the exact project selection differences and quantify the $24M lost wealth."
      },
      {
        "title": "Integer Programming Capital Allocation Engine",
        "type": "mastery",
        "description": "Construct an automated capital allocation solver in Python using scipy.optimize or PuLP: model multi-period capital rationing constraints, mutually exclusive project sets, and project dependencies (Project B requires Project A); maximize total portfolio NPV.",
        "rubric": "Formulate 0/1 binary decision variables; encode objective function max sum(NPV_i * x_i) subject to sum(Cost_it * x_i) <= Budget_t; execute solver on a test set of 15 realistic projects; output optimal selection matrix and unspent budget analysis."
      },
      {
        "title": "The Post-Merger Capital Freeze War Room",
        "type": "incident",
        "description": "Navigate an emergency liquidity freeze following a debt-funded acquisition: corporate headquarters slashes the enterprise Capex budget by 50% overnight; five ongoing division expansions demand funding; use Profitability Index and sunk-cost marginal analysis to re-rank projects and decide which expansions to pause, terminate, or fund.",
        "rubric": "Evaluate ongoing projects on forward-looking marginal cash flows ignoring past spent capital; calculate revised marginal PIs; design a transparent, defensible board presentation justifying project terminations that preserves maximum enterprise liquidity."
      }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "Capital Budgeting Metrics IV: Payback Period & Capital Misallocation Traps",
    "stageName": "Stage 1: Corporate Financial Mechanics, Time Value & Capital Budgeting",
    "stageNum": 1,
    "pedagogicalRole": "Liquidity Metrics vs Value Destruction",
    "spokenGoal": "Ask any small business owner or plant supervisor how they evaluate an equipment upgrade, and they will likely say: 'How many years until I get my money back?' This is the Payback Period. While simple and intuitive as a rough proxy for liquidity and operational risk, the undiscounted Payback Period is theoretically bankrupt: it completely ignores the time value of money, applies an arbitrary cut-off date, and utterly ignores all cash flows that occur after the payback date! Even the Discounted Payback Period fails to cure the post-cut-off blindness. Today, we dissect why relying on payback leads to devastating capital misallocation and how to use it safely strictly as a secondary liquidity constraint.",
    "conceptInvariant": "Payback Horizon Truncation Invariant: Any decision rule based on Payback Period imposes an implicit discount rate of zero prior to the cut-off date and an infinite discount rate immediately after the cut-off date, systematically penalizing long-duration, high-NPV strategic infrastructure projects.",
    "failureMode": "A manufacturing enterprise imposes a strict 3-year payback hurdle; it approves a minor packaging tweak that recovers $1M in 2 years with zero cash flows thereafter (NPV -$120K), but rejects a robotic assembly line costing $5M that recovers capital in 3.5 years and generates $3M/year for the subsequent 10 years (NPV +$11.4M); the firm falls technologically behind its competitors and enters distress.",
    "tryItFriction": "Build a Capital Budgeting Metric Comparison Engine: take contrasting project profiles (front-loaded flash-in-the-pan vs back-loaded infrastructure asset); compute simple Payback, Discounted Payback, NPV, IRR, and PI; display the dramatic divergence in rankings and highlight capital misallocation risks.",
    "socraticHints": [
      "Why does simple Payback Period treat a dollar received in Year 1 exactly the same as a dollar received in Year 3?",
      "Because it calculates cumulative undiscounted cash flows, implicitly assuming an interest rate of 0% during the payback window.",
      "What happens to cash flows received after the cut-off date? Simple payback gives them zero weight, acting as if they do not exist."
    ],
    "situationalPuzzle": {
      "scenario": "A utility board establishes a mandatory 4-year payback rule. Project A costs $10M and generates $3M/year for 4 years (total $12M, ends at Year 4). Project B costs $10M and generates $2M/year for Years 1–3, $3.9M in Year 4, and $8M/year for Years 5–15. Corporate cost of capital is 8%. What do the payback rule and NPV recommend?",
      "options": [
        "Both recommend Project A because its payback is 3.33 years.",
        "Payback recommends Project A (3.33 yrs < 4 yrs) and rejects Project B (payback 4.01 yrs > 4 yrs); but Project B's NPV is +$34.8M while Project A's NPV is only -$68K! Blindly following payback destroys $34.8M of enterprise value!",
        "Both recommend Project B because it has higher total cash flows.",
        "Both metrics are mathematically equivalent and always produce identical rankings."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Project A has a payback of $10M / $3M = 3.33 years, passing the 4-year rule. However, at 8%, PV of inflows = $3M * 3.3121 = $9.936M; NPV = -$64K (destroys value!). Project B repays $2M*3 + $3.9M = $9.9M by Year 4, missing the 4-year cut-off by a few days (payback ~4.01 years), so payback rejects it. Yet Project B generates $8M/year for another 11 years, yielding an immense NPV of +$34.8M. Payback's arbitrary truncation nearly killed the company's most valuable asset."
    },
    "quests": [
      {
        "title": "Theoretical Mechanics of Payback & Discounted Payback",
        "type": "concept",
        "description": "Formulate simple Payback Period and Discounted Payback Period mathematically; prove why Discounted Payback will always exceed simple Payback for any positive interest rate; demonstrate the implicit discount rate structure of payback rules.",
        "rubric": "Define Payback formula using linear interpolation between discrete periods; write Discounted Payback formula using cumulative discounted cash flows; prove that Discounted Payback < Project Life is a necessary but not sufficient condition for positive NPV."
      },
      {
        "title": "The Truncated Cash Flow Infrastructure Audit",
        "type": "detective",
        "description": "Audit the capital allocation history of a telecom carrier: examine 10 fiber-optic infrastructure investments rejected over a decade due to a corporate 3-year payback mandate; calculate the cumulative NPV lost to competing cable operators who captured the broadband market.",
        "rubric": "Reconstruct the rejected fiber investments' 20-year cash flow profiles; compute their actual NPVs at 9% cost of capital; demonstrate that the payback mandate caused $180M in foregone shareholder value and severe market share erosion."
      },
      {
        "title": "Multi-Metric Corporate Project Scorecard Engine",
        "type": "mastery",
        "description": "Develop a comprehensive capital budgeting scorecard in Python: calculate Payback, Discounted Payback, Accounting Rate of Return (ARR), NPV, IRR, MIRR, and PI for any arbitrary project; flag structural metric conflicts with clear diagnostic warnings.",
        "rubric": "Implement robust calculation functions for all 7 metrics; include automated checks that highlight when Payback and NPV conflict; output an executive dashboard summarizing capital recommendations with traffic-light risk ratings."
      },
      {
        "title": "The Solvency Crisis Secondary Payback Constraint War Room",
        "type": "incident",
        "description": "Manage a high-leverage distressed debt scenario: the company has $40M in debt maturing in 24 months and desperately needs near-term cash generation; the CEO wants to pursue a 10-year high-NPV project; design a dual-hurdle policy (NPV > 0 subject to Discounted Payback <= 2 years) to preserve solvency without reckless value destruction.",
        "rubric": "Model the near-term debt maturity constraint; establish mathematical trade-offs between long-term NPV and short-term cash recovery; draft an emergency capital deployment guideline that balances immediate debt refinancing survival with economic value creation."
      }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "Project Interactions: Unequal Lives & Equivalent Annual Annuity (EAA)",
    "stageName": "Stage 1: Corporate Financial Mechanics, Time Value & Capital Budgeting",
    "stageNum": 1,
    "pedagogicalRole": "Asset Replacement & Unequal Life Physics",
    "spokenGoal": "When comparing mutually exclusive projects, comparing raw NPVs is only valid if the projects have identical operational lifespans. If Machine X lasts 3 years and Machine Y lasts 6 years, comparing their 3-year and 6-year NPVs is like comparing apples to orchards! Machine X can be replaced at Year 3, generating a second cycle of cash flows that Machine Y cannot match. Today, we master the two rigorous methods for resolving unequal life comparisons: the Replacement Chain (Least Common Multiple) approach and the elegant Equivalent Annual Annuity (EAA = NPV / PVIFA) method. When selecting between cheap equipment that breaks quickly vs expensive equipment that lasts decades, EAA is the only method that reveals true economic cost!",
    "conceptInvariant": "Equivalent Annual Annuity Invariant: For mutually exclusive projects that will be replaced indefinitely, comparing raw NPVs over unequal horizons is mathematically invalid; projects must be evaluated on their Equivalent Annual Annuity EAA = NPV / [ (1 - (1+r)^(-n)) / r ] or annualized cost.",
    "failureMode": "A hospital procurement committee chooses CT Scanner A (3-year life, NPV -$120K) over CT Scanner B (6-year life, NPV -$180K) because -$120K is 'cheaper'; converting to Equivalent Annual Cost reveals Scanner A costs $48,250/year while Scanner B costs $39,000/year; the error costs the hospital $55,500 in unnecessary replacement expenses over 6 years.",
    "tryItFriction": "Build an Asset Replacement & EAA Analyzer: take mutually exclusive equipment options with differing upfront costs, operating expenses, tax shields, and lifespans; compute raw NPV, Replacement Chain LCM cash flows, and Equivalent Annual Annuity; output the cost-minimizing equipment selection.",
    "socraticHints": [
      "Why is it wrong to simply pick the machine with the lowest raw present value of costs if the machines have different lifespans?",
      "Because the shorter-lived machine must be replaced sooner, requiring additional capital outlays that the longer-lived machine avoids during that period.",
      "The Equivalent Annual Annuity converts each project's NPV into a constant annual payment over its lifespan, enabling a fair apple-to-apple comparison."
    ],
    "situationalPuzzle": {
      "scenario": "A factory must install an industrial conveyor system (WACC = 10%). Machine Short lasts 3 years, costing $50,000 upfront with $12,000 annual operating costs. Machine Long lasts 5 years, costing $80,000 upfront with $8,000 annual operating costs. (Ignore taxes). Which machine should the plant manager install?",
      "options": [
        "Machine Short because its initial capital outlay ($50K) is $30,000 lower.",
        "Machine Short because its raw present value of costs ($79,842) is lower than Machine Long ($110,326).",
        "Machine Long because its Equivalent Annual Cost is $29,104/year, compared to Machine Short's EAC of $32,107/year, saving the company $3,003 annually in perpetual operating costs!",
        "Neither; the factory should rent a conveyor on a monthly basis."
      ],
      "correctOptionIndex": 2,
      "explanation": "Option C is correct. Calculate Present Value of Costs (PVOC) and Equivalent Annual Cost (EAC): For Machine Short (n=3, r=10%): PVIFA = (1 - 1.10^-3)/0.10 = 2.4869. PVOC = $50,000 + $12,000 * 2.4869 = $79,843. EAC = $79,843 / 2.4869 = $32,105/year. For Machine Long (n=5, r=10%): PVIFA = (1 - 1.10^-5)/0.10 = 3.7908. PVOC = $80,000 + $8,000 * 3.7908 = $110,326. EAC = $110,326 / 3.7908 = $29,104/year. Machine Long is cheaper by $3,001/year. Raw PVOC misled by ignoring that Machine Short must be repurchased at Year 3."
    },
    "quests": [
      {
        "title": "Mathematical Equivalence of Replacement Chain and EAA",
        "type": "concept",
        "description": "Prove mathematically that ranking mutually exclusive projects using the Least Common Multiple (LCM) replacement chain yields identical rankings and relative proportions as the Equivalent Annual Annuity (EAA) method; derive the infinite horizon perpetuity limit.",
        "rubric": "Formulate the LCM cash flow replication series; sum the discounted infinite series of replicated NPVs; show that NPV_inf = EAA / r; prove that maximizing EAA is mathematically identical to maximizing infinite-horizon NPV."
      },
      {
        "title": "The Fleet Replacement Cycle Forensic Audit",
        "type": "detective",
        "description": "Audit an airline's regional jet fleet replacement study: evaluate whether to retire aircraft after 8 years vs 12 years vs 16 years, taking into account escalating maintenance schedules, fuel efficiency curves, and secondary market residual values; determine the optimal economic replacement cycle.",
        "rubric": "Model annual operating and overhaul costs for each operating year; compute cumulative PV of costs and salvage values for retirement at years 8, 12, and 16; calculate EAC for each lifespan and prove that the 12-year cycle minimizes annualized lifecycle cost."
      },
      {
        "title": "Enterprise Asset Replacement Lifecycle Optimization Suite",
        "type": "mastery",
        "description": "Build an asset replacement optimization engine in Python: accept complex multi-component machinery data with non-linear degradation curves, salvage decay functions, and technology obsolescence parameters; compute dynamic EAA to determine the exact optimal retirement year.",
        "rubric": "Implement dynamic programming to evaluate marginal EAC from keeping an asset one additional year vs replacing it immediately; generate detailed sensitivity tables across changing discount rates and maintenance cost inflation; output visual replacement curves."
      },
      {
        "title": "The Rapid Technological Obsolescence Capex War Room",
        "type": "incident",
        "description": "Resolve a high-stakes semiconductor foundry dilemma: the engineering team wants to buy a bespoke EUV lithography tool that lasts 7 years, but semiconductor node lifespans are shrinking to 3 years; evaluate whether EAA assumptions of 'identical replication' hold in an environment of rapid technological change and design a technology-drift-adjusted Capex model.",
        "rubric": "Critique the standard EAA assumption of infinite identical replacement; formulate a modified replacement model incorporating declining real costs and increasing efficiency across successive equipment generations; present a risk-hedged equipment lease vs buy recommendation to the board."
      }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "Capital Budgeting Under Risk: Sensitivity Grids, Scenario Analysis & Break-Even",
    "stageName": "Stage 1: Corporate Financial Mechanics, Time Value & Capital Budgeting",
    "stageNum": 1,
    "pedagogicalRole": "Risk Quantification & Decision Stress-Testing",
    "spokenGoal": "Base case financial models are always wrong. A project spreadsheet showing an NPV of +$25M is merely a single deterministic point estimate constructed on dozens of fragile assumptions: sales volume, pricing power, raw material inflation, and wage growth. Today, we master the triumvirate of capital budgeting risk assessment: Sensitivity Analysis (measuring the change in NPV per unit change in an isolated variable), Scenario Analysis (simulating correlated macroeconomic shocks across Best, Base, and Worst cases), and Break-Even Analysis (distinguishing between Accounting Break-Even and Financial Break-Even where NPV = 0). A CFO who only knows accounting break-even will approve projects that guarantee economic bankruptcy!",
    "conceptInvariant": "Financial vs Accounting Break-Even Invariant: Accounting break-even occurs when EBIT = 0 (Sales Volume = Fixed Costs / Unit Contribution Margin), recovering only depreciation; Financial break-even occurs when NPV = 0 (Sales Volume = (Fixed Costs + Equivalent Annual Capex) / Unit Contribution Margin), recovering the full opportunity cost of capital; Financial Break-Even is strictly greater than Accounting Break-Even for any positive WACC.",
    "failureMode": "A consumer goods company launches a new beverage brand after confirming it easily clears accounting break-even at 500,000 units/year; however, financial break-even requires 850,000 units/year to recover the $30M factory capital cost at 12% WACC; sales plateau at 650,000 units; the company records positive accounting net income every year while destroying $8.4M of enterprise value.",
    "tryItFriction": "Construct a Comprehensive Risk Stress-Testing Suite: take a capital project's financial model; compute sensitivity deltas (spider chart gradients) across sales, costs, and WACC; build 3-scenario probability distributions; calculate exact Accounting Break-Even and Financial Break-Even sales quantities.",
    "socraticHints": [
      "Why does a project that breaks even from an accounting perspective (EBIT = 0) destroy shareholder wealth?",
      "Because an accounting net profit of zero means the firm earned a 0% return on its capital investment.",
      "If the cost of capital is 10%, earning 0% return fails to cover the investors' required return, resulting in a deeply negative Net Present Value."
    ],
    "situationalPuzzle": {
      "scenario": "A company invests $10M in a widget plant with a 5-year life and zero salvage value (Straight-line depreciation = $2M/year). Fixed operating costs are $1M/year, unit sales price is $50, and unit variable cost is $30. Tax rate is 0%, and WACC is 10%. What is the difference between the Accounting Break-Even volume and the Financial Break-Even volume?",
      "options": [
        "There is no difference; break-even is always Fixed Costs / Contribution Margin.",
        "Accounting Break-Even is 150,000 units, while Financial Break-Even is 181,900 units—requiring 31,900 additional units (+21.3%) to cover the cost of capital!",
        "Accounting Break-Even is 200,000 units, and Financial Break-Even is 100,000 units.",
        "Financial Break-Even cannot be calculated without knowing market beta."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Unit contribution margin = $50 - $30 = $20. Accounting Break-Even = (Fixed Costs + Depreciation) / Contribution Margin = ($1,000,000 + $2,000,000) / $20 = 150,000 units. For Financial Break-Even (NPV = 0), annual cash flow must equal the Equivalent Annual Capex: EAC = $10,000,000 / PVIFA(10%, 5) = $10,000,000 / 3.7908 = $2,637,975. Operating cash flow must be $2,637,975. Cash Flow = Q * ($20) - $1,000,000. Set equal to EAC: Q * $20 - $1,000,000 = $2,637,975 => Q * $20 = $3,637,975 => Q = 181,899 units. Accounting break-even leaves a 31,899 unit deficit that destroys economic wealth."
    },
    "quests": [
      {
        "title": "Mathematical Formulation of Financial Break-Even & Degree of Operating Leverage",
        "type": "concept",
        "description": "Derive the mathematical formula for Financial Break-Even Volume Q_fin = (Fixed Costs * (1-T) - Depr*T + EAC) / [ (Price - Variable Cost)*(1-T) ]; relate financial break-even to operating leverage (DOL) and explain why high fixed-cost structures steepen the NPV sensitivity slope.",
        "rubric": "Provide complete algebraic derivation showing NPV = 0 boundary; contrast with standard accounting break-even; demonstrate how DOL = %Delta EBIT / %Delta Sales magnifies downside risk when sales approach break-even."
      },
      {
        "title": "The Correlated Scenario Downside Forensic Audit",
        "type": "detective",
        "description": "Examine a retail chain's expansion model that evaluated variables independently in a sensitivity spider chart (testing a 10% price drop or a 10% volume drop); demonstrate how a real stagflationary recession triggers correlated shocks (volume drops 15%, prices drop 8%, labor costs rise 10%), revealing a catastrophic -$18M NPV tail risk that independent sensitivity analysis concealed.",
        "rubric": "Build covariance matrix of key operational drivers; run joint scenario shock vs isolated 1-variable sensitivity; quantify the non-linear interaction effect that flipped a seemingly resilient +$6M base case into bankruptcy."
      },
      {
        "title": "Interactive Tornado & Spider Sensitivity Modeling Engine",
        "type": "mastery",
        "description": "Construct an automated sensitivity and scenario modeling engine in Python: generate Tornado diagrams ranking input variables by NPV impact; generate Spider charts showing percentage variance curves; compute exact Financial Break-Even across multiple dimensions.",
        "rubric": "Calculate partial derivatives of NPV with respect to price, volume, variable costs, fixed costs, and discount rate; generate matplotlib Tornado diagrams showing swing ranges; output a multi-variate break-even surface."
      },
      {
        "title": "The Black Swan Pandemic Stress-Test War Room",
        "type": "incident",
        "description": "Lead an emergency board risk workshop: an international airline's $500M fleet acquisition model is hit by an exogenous macro shock cutting passenger revenues by 60% for 24 months; evaluate covenant breach thresholds, minimum survival cash burn, and negotiate manufacturer delivery deferrals to avert Chapter 11.",
        "rubric": "Re-run project cash flows under catastrophic scenario parameters; compute cash burn rate and time-to-insolvency; structure a liquidity bridge and Capex deferral schedule that minimizes contractual penalty costs while keeping the enterprise solvent."
      }
    ]
  },
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Real Options in Capital Budgeting: Expansion, Abandonment & Delay Lattices",
    "stageName": "Stage 1: Corporate Financial Mechanics, Time Value & Capital Budgeting",
    "stageNum": 1,
    "pedagogicalRole": "Strategic Flexibility & Real Options Physics",
    "spokenGoal": "Traditional discounted cash flow models make a profoundly flawed assumption: they assume management will passively execute a multi-year project without adapting to future information, like a train locked onto fixed tracks. In the real world, management possesses Strategic Flexibility: if market demand explodes, we can expand capacity (Call Option); if demand collapses, we can abandon the project and sell the assets (Put Option); if market conditions are volatile, we can wait and delay investment (Option to Defer). Today, we bridge corporate finance and derivatives mathematics by modeling Real Options using Binomial Trees, proving that managerial flexibility turns risky negative-NPV projects into lucrative strategic investments!",
    "conceptInvariant": "Strategic Flexibility Invariant: Expanded Net Present Value equals Static DCF NPV plus the value of managerial Real Options: Strategic NPV = Static NPV + Real Option Value; because options have asymmetric payoffs (limited downside, unlimited upside), managerial flexibility is always weakly positive in value and increases with market volatility.",
    "failureMode": "A pharmaceutical company rejects an exploratory oncology research program because its static DCF NPV is -$8M; the board overlooks that for an $8M initial investment, the firm acquires the option to launch a $1B blockbuster drug if Phase II trials succeed; a rival buys the patents for $10M and later commercializes a $4B therapy.",
    "tryItFriction": "Construct a Binomial Real Options Valuation Engine: model a 2-stage capital investment with an Option to Expand (at t=2 upon high demand) and an Option to Abandon (at t=2 for salvage value upon low demand); compute risk-neutral probabilities, backward induct option values through the lattice, and compare with static DCF.",
    "socraticHints": [
      "Why does higher underlying market uncertainty increase the value of a real option while decreasing the certainty of a static DCF?",
      "Because an option gives management the right, but not the obligation, to take an action.",
      "If conditions deteriorate, management simply lets the option expire unexercised (downside truncated), but if conditions boom, management captures massive upside; hence, higher volatility expands the option's value."
    ],
    "situationalPuzzle": {
      "scenario": "A mining corporation has the rights to an undeveloped copper deposit. Developing the mine costs $100M today, and expected discounted cash flows from current copper prices yield an NPV of -$10M. However, copper prices are volatile (sigma = 35%). Management has the legal right to delay development for up to 3 years without penalty. The risk-free rate is 5%. A conservative director says: 'NPV is negative, let the lease expire.' What does Real Options analysis reveal?",
      "options": [
        "The director is correct; negative NPV projects should never be maintained.",
        "The option to delay is equivalent to an American Call Option on copper reserves; with 35% volatility and 3 years to expiration, the option value is +$24.5M. The lease should be preserved because Strategic NPV is positive (+$14.5M)!",
        "The firm should invest immediately to avoid losing the lease.",
        "Real options can only be applied to traded financial stocks, not physical mining commodities."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. An option to delay an irreversible investment is economically identical to an American call option where the underlying asset is the completed project value and the strike price is the capital expenditure outlay ($100M). When volatility is high (35%), the option to wait is extremely valuable. If copper prices surge, the firm exercises and captures huge profits; if prices fall, it avoids investing $100M. The Option to Defer has a value of +$24.5M, far exceeding the static -$10M deficit, making the holding rights highly valuable."
    },
    "quests": [
      {
        "title": "Mapping Financial Options to Real Strategic Investments",
        "type": "concept",
        "description": "Establish the formal mathematical correspondence between financial options parameters (S, K, r, T, sigma) and real project characteristics (PV of operating cash flows, Capex outlay, risk-free rate, lease duration, cash flow volatility); formulate the Binomial Lattice framework using risk-neutral valuation.",
        "rubric": "Map all 5 Black-Scholes variables to real investment equivalents; define up-factor u = e^(sigma*sqrt(dt)), down-factor d = 1/u, and risk-neutral probability p = (e^(r*dt) - d)/(u - d); explain why real options properly reward volatility."
      },
      {
        "title": "The Abandonment Put Option Valuation Forensic Audit",
        "type": "detective",
        "description": "Audit a logistics company's container ship acquisition: static DCF showed an NPV of -$3M over a 15-year horizon; identify that management secured a contractual option to sell the vessels back to the shipyard at Year 3 for 75% of purchase price (Put Option); calculate the value of the abandonment option and reconcile the approval.",
        "rubric": "Build a 3-period binomial tree of vessel operating cash flows; evaluate the abandonment decision at each terminal node: max(Operating PV, Salvage Price); backward induct to t=0; prove that the abandonment put option is worth +$7.2M, converting the -$3M static deficit into a +$4.2M strategic win."
      },
      {
        "title": "Multi-Stage Binomial Real Options Valuation Engine",
        "type": "mastery",
        "description": "Develop an enterprise Real Options pricing engine in Python: support multi-stage decision trees with options to expand (capacity boost by 50% for $20M Capex), contract, abandon, or switch inputs; compute lattice values with automated backward induction and compare with static DCF.",
        "rubric": "Implement flexible recombining binomial lattice data structure; handle intermediate decision nodes with boundary condition logic; print out tree matrices and generate comparative charts contrasting static NPV vs Strategic NPV across volatility curves."
      },
      {
        "title": "The Strategic Patent Expiration Crisis War Room",
        "type": "incident",
        "description": "Resolve an executive board dilemma at a biotech firm: a key mRNA drug delivery patent has 2 years remaining before patent cliff expiration; clinical Phase III trials cost $80M with a 45% clinical success probability; model the multi-stage compound option and determine whether to fund Phase III, license out, or abandon.",
        "rubric": "Structure the compound option decision tree; incorporate conditional clinical trial probabilities and market launch payoff distributions; provide a quantitative recommendation to the board that hedges clinical downside while capturing blockbuster upside."
      }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "Monte Carlo Simulation in Capital Expenditure Decisions",
    "stageName": "Stage 1: Corporate Financial Mechanics, Time Value & Capital Budgeting",
    "stageNum": 1,
    "pedagogicalRole": "Stochastic Modeling & Distributional Valuation",
    "spokenGoal": "While sensitivity analysis varies one factor at a time and scenario analysis examines three subjective cases, real-world corporate investments operate in a continuous, probabilistic reality. In Monte Carlo Simulation, we replace single-point deterministic estimates with continuous probability distributions—normal distributions for inflation, log-normal distributions for commodity prices, triangular distributions for construction delays. By running 100,000 iterations through our financial model, we generate a complete probability distribution of project NPV. Today, we master stochastic Capex modeling, analyze value-at-risk, and measure the exact probability of value destruction (P(NPV < 0)).",
    "conceptInvariant": "Probabilistic NPV Invariant: The expected Net Present Value of a non-linear capital project does not equal the Net Present Value calculated using expected input values: E[NPV(X, Y)] != NPV(E[X], E[Y]) due to Jensen's Inequality and non-linear cost structures; stochastic simulation is required to uncover true expected value and tail risks.",
    "failureMode": "A utility builds a $2B liquefied natural gas terminal based on deterministic base-case gas spreads of $3.50/MMBtu; a Monte Carlo simulation would have revealed a 42% probability of gas spreads falling below the $2.10 economic break-even; the facility opens during a global gas glut and sits idle, triggering a $1.4B impairment charge.",
    "tryItFriction": "Build an Enterprise Monte Carlo Capex Simulator in Python: define probability distributions for unit sales (triangular), pricing (normal), fixed costs (uniform), and salvage values; run 50,000 iterations; compute expected NPV, standard deviation, VaR at 95%, and the exact probability of negative NPV.",
    "socraticHints": [
      "Why is the average NPV from 10,000 Monte Carlo runs often significantly lower than the deterministic 'Base Case' NPV?",
      "Because real projects possess asymmetric non-linear cost structures (e.g., capacity bottlenecks, overtime labor penalties, contractual liquidated damages for delays).",
      "When inputs vary randomly, severe negative outcomes disproportionately drag down the mean, exposing the Flaw of Averages."
    ],
    "situationalPuzzle": {
      "scenario": "A renewable energy company evaluates a $200M offshore wind farm. The deterministic financial model shows an attractive base-case NPV of +$35M. However, an analyst runs a 100,000-trial Monte Carlo simulation incorporating wind speed variability, turbine blade failure rates, and electricity spot price fluctuations. The simulation reveals: Mean NPV = +$18M, Standard Deviation = $42M, and P(NPV < 0) = 34.5%. What should the Chief Risk Officer advise the board?",
      "options": [
        "Ignore the simulation because the deterministic base-case NPV is +$35M, which indicates high profitability.",
        "Advise that while the project has positive expected value (+$18M), it carries an unacceptable 34.5% chance of destroying shareholder capital; the firm must hedge electricity spot prices or secure power purchase agreements (PPAs) to compress the distribution before approving.",
        "Approve the project immediately because Mean NPV is positive and wind is environmentally sustainable.",
        "Increase the hurdle rate by 10% to eliminate the risk."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. A deterministic model masks massive tail risk. While the project has a positive expected NPV of +$18M, a 34.5% probability of destroying shareholder wealth (with a standard deviation of $42M against an initial outlay of $200M) is an enormous institutional risk. The CRO should recommend structuring long-term fixed-price Power Purchase Agreements (PPAs) or turbine maintenance warranties to truncate the downside tail and compress P(NPV < 0) below 5% before committing capital."
    },
    "quests": [
      {
        "title": "Statistical Foundations of Monte Carlo Financial Modeling",
        "type": "concept",
        "description": "Formulate the mathematical methodology of Monte Carlo simulation in capital budgeting: probability distribution selection (Normal, Log-normal, Triangular, Beta, Uniform), pseudo-random number generation, inverse transform sampling, and correlation modeling via Cholesky decomposition.",
        "rubric": "Explain selection criteria for different distribution families in financial modeling; derive inverse CDF sampling; explain why Cholesky decomposition is mathematically necessary to impose realistic correlation between input variables (e.g., volume and price)."
      },
      {
        "title": "The Flaw of Averages Infrastructure Megaproject Audit",
        "type": "detective",
        "description": "Audit an international airport runway expansion: the deterministic model projected on-time completion in 4 years at $800M cost with an NPV of +$150M; reconstruct how correlated weather delays and contractor labor shortages created a non-linear compounding delay that blew costs to $1.3B, generating an actual NPV of -$220M.",
        "rubric": "Identify Jensen's Inequality in project scheduling (Critical Path Method non-linearities); simulate correlated completion times; demonstrate how deterministic models systematically underestimate megaproject Capex overruns by 30% to 70%."
      },
      {
        "title": "High-Performance Monte Carlo NPV Simulation Engine",
        "type": "mastery",
        "description": "Construct a vectorized Monte Carlo capital budgeting engine in Python using numpy and scipy: simulate 100,000 runs in under 2 seconds; incorporate correlated variables using Cholesky factorization; output histogram distributions of NPV, cumulative probability curves, Value-at-Risk (VaR), and Conditional VaR (CVaR).",
        "rubric": "Implement correlated multi-variable generation; compute vectorized NPV arrays; generate clean visual distribution plots with 5th, 50th, and 95th percentiles labeled; output comprehensive statistical summary metrics."
      },
      {
        "title": "The Boardroom Capital Allocation Under Uncertainty War Room",
        "type": "incident",
        "description": "Guide an executive board through a contested $600M deep-water oil rig decision: two factions disagree—the Exploration VP points to a deterministic +$80M NPV, while the Risk Director warns that Monte Carlo reveals a 38% probability of negative NPV due to oil price volatility; design a risk-mitigation structure (joint venture farming out 50% equity + put options) to achieve board consensus.",
        "rubric": "Evaluate risk-sharing structures (farm-out agreements) and commodity hedging; demonstrate how syndicating 50% of the project and purchasing oil put options reduces expected NPV slightly (to +$62M) while slashing the probability of negative NPV from 38% to under 4%."
      }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "Cost of Debt (Kd) & Cost of Preferred Stock (Kp): After-Tax Yield Mechanics",
    "stageName": "Stage 1: Corporate Financial Mechanics, Time Value & Capital Budgeting",
    "stageNum": 1,
    "pedagogicalRole": "Fixed Income Financing Cost Physics",
    "spokenGoal": "Before a corporation can calculate its hurdle rate for capital investments, it must accurately determine its cost of capital components. Today, we tackle the first two: the Cost of Debt (Kd) and the Cost of Preferred Stock (Kp). A company's true cost of debt is NOT its historical coupon rate on existing debt—it is the marginal yield-to-maturity (YTM) that the market demands to lend new capital today! Crucially, because interest expense is tax-deductible in corporate taxation, the government effectively subsidizes debt financing, making the relevant after-tax cost of debt Kd * (1 - T). Preferred stock, by contrast, pays non-deductible dividends and carries flotation friction.",
    "conceptInvariant": "Marginal After-Tax Debt Invariant: The relevant cost of debt for capital budgeting is the marginal after-tax cost of new borrowing: After-Tax Kd = YTM * (1 - Marginal Corporate Tax Rate); historical coupon rates are sunk accounting figures and strictly irrelevant for current capital budgeting.",
    "failureMode": "A CFO calculates corporate WACC using the 4.0% coupon rate on bonds issued 6 years ago when interest rates were near zero; today's market YTM on the company's BBB-rated debt has risen to 8.5%; using the outdated 4.0% cost underestimates corporate WACC by 270 basis points, approving disastrous projects that cannot service the new debt.",
    "tryItFriction": "Build an Institutional Debt & Preferred Stock Cost Engine: take existing traded corporate bonds (price, coupon, maturity, frequency), new loan facilities with upfront fees, and preferred stock issuances; compute exact market YTM, incorporate marginal tax deductibility, and compute after-tax component costs.",
    "socraticHints": [
      "Why must we use the current market Yield to Maturity (YTM) rather than the historical coupon rate when calculating the cost of debt?",
      "Because capital budgeting evaluates NEW investment opportunities funded by NEW capital raised at CURRENT market conditions.",
      "The historical coupon rate reflects past borrowing terms, which are irrelevant to the opportunity cost of new capital today."
    ],
    "situationalPuzzle": {
      "scenario": "A corporation issues $100M of 10-year, 7.0% semi-annual coupon bonds. Due to market credit spread widening, the bonds sell at a discount of 94% of par ($940 per $1,000 bond). Investment banking flotation costs are 2% of par ($20 per bond). The corporate marginal tax rate is 25%. A junior analyst computes after-tax cost of debt as 7.0% * (1 - 0.25) = 5.25%. What is the true after-tax cost of debt?",
      "options": [
        "5.25% is correct because coupon rate times (1 - T) is standard textbook formula.",
        "The analyst ignored the discount and flotation costs. Net proceeds are $920 per bond. The pre-tax Yield to Maturity solving $920 = sum(35/(1+y)^t) + 1000/(1+y)^20 is 8.24% annual YTM. The true after-tax cost of debt is 8.24% * (1 - 0.25) = 6.18%—nearly 100 basis points higher!",
        "The cost of debt is 7.0% / 0.94 = 7.45%.",
        "Flotation costs cannot be included in cost of debt under Ind AS accounting."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Never use coupon rate to determine cost of debt when bonds sell at a premium or discount or carry flotation costs. Net proceeds received per bond are $1,000 * (0.94 - 0.02) = $920. Solving for semi-annual yield y: $920 = $35 * PVIFA(y, 20) + $1,000 / (1+y)^20 yields y = 4.12% semi-annual, or an annualized nominal YTM of 8.24%. After-tax cost of debt = 8.24% * (1 - 0.25) = 6.18%. The analyst underestimated the cost of debt by 93 basis points."
    },
    "quests": [
      {
        "title": "Yield to Maturity & Tax Deductibility Mathematics",
        "type": "concept",
        "description": "Derive the mathematical formulation of Yield to Maturity (YTM) for plain-vanilla corporate bonds; prove why the interest tax shield creates an after-tax cost of Kd_net = Kd * (1 - T); contrast with Preferred Stock Kp = Dp / (Pp * (1 - F)) where dividends are paid from post-tax earnings.",
        "rubric": "Write bond pricing equation; explain why interest expense enters the income statement before tax while preferred dividends are distributed after tax; show algebraic formulation of preferred stock cost including flotation friction F."
      },
      {
        "title": "The Synthetic Credit Rating & Spread Estimation Forensic Audit",
        "type": "detective",
        "description": "Audit an unrated private enterprise that has no publicly traded bonds: the company needs to estimate its marginal cost of debt; compute its Interest Coverage Ratio (EBIT / Interest), map it to institutional credit rating default spread tables (Damodaran Synthetic Rating Matrix), and determine its correct marginal borrowing rate.",
        "rubric": "Calculate enterprise Interest Coverage Ratio; look up corresponding synthetic rating (e.g., Baa2/BBB); determine default spread over risk-free benchmark Treasury yield; calculate final after-tax cost of debt."
      },
      {
        "title": "Corporate Debt Facility Pricing & Blended Kd Engine",
        "type": "mastery",
        "description": "Develop an enterprise debt portfolio analytics module in Python: accept revolving credit facilities, senior secured term loans, high-yield subordinated bonds, and convertible notes; calculate individual marginal YTMs, commitment fees, and amortization profiles; compute the firm's true marginal weighted average cost of debt.",
        "rubric": "Ingest multiple debt instruments with differing seniority and covenants; calculate exact YTM for each; apply tax shield adjustments; output the consolidated marginal pre-tax and after-tax cost of debt schedule."
      },
      {
        "title": "The Sovereign Rating Downgrade Debt Shock War Room",
        "type": "incident",
        "description": "Respond to a macroeconomic crisis: a rating agency downgrades the company's credit rating from BBB+ to BB+ (Junk status), causing its bond yields to spike from 5.8% to 10.2% overnight; with $150M in maturing bank lines, calculate the impact on corporate cash flow, WACC, and design an immediate capital preservation plan.",
        "rubric": "Quantify the annual interest expense increase ($6.6M pre-tax); recalculate enterprise WACC surge; evaluate debt restructuring options including asset sales, sale-and-leasebacks, and equity rights offerings to restore investment-grade metrics."
      }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "Cost of Equity (Ke): CAPM, Hamada Beta Unlevering & Gordon Growth",
    "stageName": "Stage 1: Corporate Financial Mechanics, Time Value & Capital Budgeting",
    "stageNum": 1,
    "pedagogicalRole": "Equity Risk Premium & Cost of Equity Physics",
    "spokenGoal": "Unlike debt, equity has no contractually mandated interest rate; shareholders receive residual cash flows. Consequently, naive executives sometimes assume equity capital is 'free'. In reality, equity is the most expensive capital a company can ever raise, because equity holders bear the first-loss risk of the entire enterprise! Today, we master the three primary methods for estimating the Cost of Equity (Ke): the Capital Asset Pricing Model (Ke = Rf + Beta * ERP), the Dividend Discount Model (Gordon Growth: Ke = D1/P0 + g), and the Bond Yield Plus Risk Premium approach. Crucially, we master Hamada's Equation: unlevering beta to isolate pure business risk from financial leverage risk!",
    "conceptInvariant": "Hamada Financial Leverage Invariant: An equity beta reflects both fundamental operating business risk and financial leverage risk: Beta_L = Beta_U * [1 + (1 - T) * (Debt/Equity)]; an unlevered asset beta isolates pure business risk and is invariant to changes in corporate capital structure.",
    "failureMode": "An enterprise division launches a high-risk crypto payments app but uses the conglomerate's overall corporate beta of 0.85 (derived from stable utility operations); using an 8.5% cost of equity for a 25% risk business underprices risk, approving a doomed project that destroys $75M in equity capital.",
    "tryItFriction": "Implement an Institutional Cost of Equity & Beta Unlevering Suite in Python: ingest comparable peer company betas, debt-to-equity ratios, and tax rates; unlever peer betas to find pure industry asset beta; relever beta to the target firm's capital structure; compute Ke via CAPM and Gordon Growth.",
    "socraticHints": [
      "Why does adding debt to a company's balance sheet increase its equity beta even if the underlying business operations remain completely unchanged?",
      "Because debt introduces fixed interest obligations that must be paid before equity holders receive a single penny.",
      "This financial leverage magnifies the volatility of residual earnings per share, making equity cash flows riskier to investors and driving up Beta_L."
    ],
    "situationalPuzzle": {
      "scenario": "A retailer operates with zero debt (unlevered) and has an equity beta of 0.90. The risk-free rate is 4.0% and the Equity Risk Premium (ERP) is 6.0%. Management plans to recapitalize by issuing debt to fund a share repurchase, reaching a Debt-to-Equity ratio of 0.60. The corporate tax rate is 25%. What was the original cost of equity, and what will the new cost of equity be after recapitalization?",
      "options": [
        "Original Ke = 9.40%; new Ke remains 9.40% because business risk hasn't changed.",
        "Original Ke = 9.40%; new levered beta via Hamada is Beta_L = 0.90 * [1 + (1 - 0.25)*0.60] = 0.90 * 1.45 = 1.305. New Cost of Equity = 4.0% + 1.305 * 6.0% = 11.83%!",
        "Original Ke = 10.0%; new Ke = 14.50%.",
        "Debt reduces the cost of equity because debt is cheaper than equity."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Unlevered Ke = Rf + Beta_U * ERP = 4.0% + 0.90 * 6.0% = 9.40%. When the firm adds debt, equity holders take on financial risk. Using Hamada's equation: Beta_L = Beta_U * [1 + (1 - T)*(D/E)] = 0.90 * [1 + (1 - 0.25)*0.60] = 0.90 * [1 + 0.45] = 1.305. The new levered cost of equity is Ke = 4.0% + 1.305 * 6.0% = 4.0% + 7.83% = 11.83%. Adding debt increased the required return on equity by 243 basis points."
    },
    "quests": [
      {
        "title": "Derivation of Hamada's Equation from Modigliani-Miller & CAPM",
        "type": "concept",
        "description": "Prove Hamada's equation mathematically by combining Modigliani-Miller Proposition II with the Capital Asset Pricing Model; show how total equity risk decomposes into business risk (Beta_U) and financial risk (Beta_L - Beta_U).",
        "rubric": "Set up levered firm equity return equation; derive covariance with market return; incorporate tax deductibility of debt interest; derive Beta_L = Beta_U * [1 + (1-T)*(D/E)] and show the Fernandez / Miles-Ezzell alternative specifications."
      },
      {
        "title": "Pure-Play Peer Group Beta Extraction Forensic Audit",
        "type": "detective",
        "description": "Audit a valuation engagement where an analyst evaluated an unlisted private EV battery manufacturer using Tesla's raw equity beta (2.1); unlever Tesla's beta, adjust for Tesla's non-battery businesses, examine 4 pure-play battery peers, unlever each, compute industry median asset beta, and relever to the target firm's target D/E.",
        "rubric": "Extract betas and D/E ratios for peer group; apply Hamada unlevering to all peers; compute median unlevered asset beta (Beta_U = 1.15); relever to target capital structure (D/E = 0.35, T = 25%); prove the analyst's valuation had overpriced risk by 420 basis points."
      },
      {
        "title": "Multi-Model Cost of Equity Estimation Suite",
        "type": "mastery",
        "description": "Build an enterprise Cost of Equity estimation module in Python: implement CAPM with Blume/Vasicek adjusted betas, Fama-French 3-Factor model, Gordon Growth model, and Build-Up method (size premium + country risk premium); reconcile model divergence and output an institutional Ke range.",
        "rubric": "Calculate Blume adjusted beta (2/3*Beta + 1/3*1.0); implement Fama-French factor regressions; implement Gordon model with dynamic dividend payout growth; synthesize results into a defensible valuation summary chart."
      },
      {
        "title": "Emerging Market Country Risk Premium Crisis War Room",
        "type": "incident",
        "description": "Resolve an executive committee conflict regarding an investment in an emerging market (sovereign bond spread = 450 bps, relative equity market volatility = 1.4x); the local team demands using a local 6% Ke, while corporate headquarters demands a 22% Ke; apply Damodaran's Country Risk Premium (CRP) framework to establish an objective hurdle rate.",
        "rubric": "Compute Country Risk Premium: CRP = Sovereign Spread * (Sigma_Equity / Sigma_Bond) = 4.5% * 1.4 = 6.3%; compute mature market ERP (5.0%); calculate total required Ke for local project; formulate a structured board recommendation."
      }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "Weighted Average Cost of Capital (WACC) & Hurdle Rate Invariants",
    "stageName": "Stage 1: Corporate Financial Mechanics, Time Value & Capital Budgeting",
    "stageNum": 1,
    "pedagogicalRole": "Enterprise Cost of Capital Integration Physics",
    "spokenGoal": "Today, we bring together all our cost of capital components into corporate finance's most critical benchmark: the Weighted Average Cost of Capital (WACC = (E/V)*Ke + (D/V)*Kd*(1 - T) + (P/V)*Kp). WACC represents the minimum overall return a company must earn on its existing asset base to satisfy all providers of capital—creditors, preferred stockholders, and equity investors. However, applying a single firm-wide WACC across all corporate divisions is a lethal error known as the Hurdle Rate Mismatch. Low-risk divisions get starved of capital because their safe projects cannot clear the high corporate hurdle, while high-risk divisions get overfunded with reckless gambles! Today, we construct divisional risk-adjusted hurdle rates and complete Milestone 1: The ApexCap Corporate Capital Allocation Engine!",
    "conceptInvariant": "Hurdle Rate Alignment Invariant: The appropriate discount rate for evaluating any capital project depends strictly on the RISK OF THE PROJECT (its asset beta), NOT the historical cost of capital of the firm undertaking it; using firm-wide WACC for projects with different risk profiles systematically misallocates capital.",
    "failureMode": "A diversified conglomerate with an overall 11% WACC evaluates an ultra-safe municipal water utility project (risk profile requires 6.5% hurdle) and a speculative AI cryptocurrency venture (risk profile requires 22% hurdle); using the 11% firm-wide WACC, it rejects the profitable utility project (earning 9%) and approves the value-destroying AI venture (earning 14%); the firm's overall risk explodes while ROIC plunges.",
    "tryItFriction": "Construct the Milestone 1: ApexCap Corporate Capital Allocation & Multi-Project Budgeting Engine in Python/TypeScript: ingest multi-tranche capital structures; calculate market-value weights; compute overall enterprise WACC; establish divisional risk-adjusted hurdle rates via pure-play peer betas; evaluate multi-project pipelines with NPV, IRR, and PI; and output the optimal capital budget.",
    "socraticHints": [
      "Why must capital weights in the WACC formula strictly use MARKET VALUES rather than BOOK VALUES?",
      "Because book values represent historical accounting costs that bear no relationship to the current replacement cost of raising capital in the market today.",
      "If a company's stock has tripled since issuance, book equity is tiny compared to market equity; using book values grossly overweights debt and underestimates true WACC."
    ],
    "situationalPuzzle": {
      "scenario": "A conglomerate has a market capitalization of $600M equity (Ke = 15%) and $400M debt (market yield Kd = 8%, tax rate = 25%). Overall enterprise WACC is 11.4%. Division A is a low-risk pipeline business (Asset Beta = 0.50, divisional hurdle = 7.5%). Division B is a high-risk biotechnology lab (Asset Beta = 1.80, divisional hurdle = 16.5%). Division A proposes Project Alpha yielding 9.0%. Division B proposes Project Beta yielding 13.0%. What happens if the firm uses its company-wide WACC (11.4%) versus divisional hurdle rates?",
      "options": [
        "Company-wide WACC correctly approves Project Beta and rejects Project Alpha.",
        "Company-wide WACC rejects Project Alpha (9.0% < 11.4%) and approves Project Beta (13.0% > 11.4%). Both decisions are WRONG! Project Alpha creates wealth (9.0% > 7.5% hurdle), while Project Beta destroys wealth (13.0% < 16.5% hurdle)! Using firm-wide WACC subsidizes bad high-risk bets and starves good safe assets!",
        "Both projects should be approved because both yield more than the cost of debt.",
        "Both projects should be rejected because neither clears 15% cost of equity."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is the classic Hurdle Rate Mismatch catastrophe. At company-wide WACC of 11.4%, Alpha is rejected (9.0% < 11.4%) and Beta is approved (13.0% > 11.4%). However, Project Alpha's risk profile only requires 7.5% return; earning 9.0% generates positive economic spread (+1.5%). Project Beta's risk profile requires 16.5% return; earning 13.0% generates negative economic spread (-3.5%). The company starves its best low-risk business to fund a value-destroying high-risk gamble."
    },
    "quests": [
      {
        "title": "Mathematical Derivation of WACC & Market Value Weighting",
        "type": "concept",
        "description": "Derive the Weighted Average Cost of Capital formula from the fundamental balance sheet identity; prove mathematically why book value weights distort capital costs; explain how the interest tax shield is embedded directly in the debt term rather than adjusting operating cash flows.",
        "rubric": "Derive WACC = (E/V)*Ke + (D/V)*Kd*(1-T) + (P/V)*Kp; prove that market value weights reflect the true opportunity cost of capital; explain why operating cash flows must be unlevered when discounting at WACC."
      },
      {
        "title": "The Hurdle Rate Mismatch & Division Cannibalization Forensic Audit",
        "type": "detective",
        "description": "Audit General Electric's historical capital misallocation across GE Power (low risk) and GE Capital (high risk): demonstrate how using a consolidated corporate hurdle rate permitted GE Capital to expand recklessly while starving industrial infrastructure units, ultimately leading to multi-billion-dollar write-downs.",
        "rubric": "Reconstruct GE's segmental asset betas; quantify the cost of capital distortion caused by uniform hurdle rates; prove that GE Capital's risk-adjusted return was deeply negative despite nominal accounting profits."
      },
      {
        "title": "Milestone 1: ApexCap Corporate Capital Allocation & Multi-Project Budgeting Engine",
        "type": "mastery",
        "description": "Engineer Milestone Project 1: an institutional-grade Capital Allocation Suite in Python: ingest multi-tier capital structure data, bond yields, stock pricing, and balance sheet liabilities; compute market value weights and enterprise WACC; calculate pure-play divisional hurdle rates; evaluate a portfolio of 10 capital projects across NPV, IRR, MIRR, and PI; and optimize capital deployment under a $100M budget constraint.",
        "rubric": "Full end-to-end Python pipeline: market-value WACC calculation, Hamada divisional beta adjustment, multi-metric project evaluations, integer programming knapsack capital rationing solver, and automated executive summary report generation."
      },
      {
        "title": "The Activist Investor Capital Structure Attack War Room",
        "type": "incident",
        "description": "Manage an activist board battle: an aggressive activist hedge fund publishes a 90-page presentation asserting the company's 100% equity capital structure is inefficient and lazily managed, inflating WACC to 12.5%; the activist demands a $1.5B debt issuance to fund a tender offer, claiming WACC will drop to 9.2%; evaluate the proposal, financial distress costs, and present a board recommendation.",
        "rubric": "Model WACC across varying Debt-to-Equity ratios from 0% to 80%; calculate interest tax shield benefits vs expected financial distress costs; identify the optimal capital structure where marginal tax shield equals marginal bankruptcy risk; draft an authoritative board defense strategy."
      }
    ]
  }
]
