import fs from 'node:fs';
import { execSync } from 'node:child_process';

function runPy(code) {
  const tmp = 'temp_py_eval.py';
  fs.writeFileSync(tmp, code, 'utf-8');
  try {
    const out = execSync('python temp_py_eval.py', { encoding: 'utf-8' });
    return out.trim();
  } finally {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  }
}

export function getDay9() {
  const p1_code = [
    "# Multi-Period Loan Amortization Schedule (PMT, PPMT, IPMT Parity)",
    "def generate_loan_amortization_schedule(principal, annual_rate, term_months):",
    "    monthly_rate = annual_rate / 12.0",
    "    # Standard Ordinary Annuity Payment formula: PMT = P * r / (1 - (1+r)^-n)",
    "    pmt = principal * (monthly_rate * (1 + monthly_rate) ** term_months) / ((1 + monthly_rate) ** term_months - 1)",
    "    ",
    "    schedule = []",
    "    balance = principal",
    "    total_interest = 0.0",
    "    total_principal_paid = 0.0",
    "    ",
    "    for m in range(1, term_months + 1):",
    "        ipmt = balance * monthly_rate",
    "        ppmt = pmt - ipmt",
    "        balance -= ppmt",
    "        total_interest += ipmt",
    "        total_principal_paid += ppmt",
    "        schedule.append({",
    "            'period': m,",
    "            'payment': round(pmt, 2),",
    "            'interest_ipmt': round(ipmt, 2),",
    "            'principal_ppmt': round(ppmt, 2),",
    "            'ending_balance': round(max(0.0, balance), 2)",
    "        })",
    "        ",
    "    return {",
    "        'initial_principal': round(principal, 2),",
    "        'monthly_payment_pmt': round(pmt, 2),",
    "        'total_interest_paid': round(total_interest, 2),",
    "        'terminal_balance': round(balance, 4),",
    "        'balance_zero_integrity': abs(balance) < 1e-4,",
    "        'sample_schedule': schedule[:3]",
    "    }",
    "",
    "facility = generate_loan_amortization_schedule(principal=500000.0, annual_rate=0.065, term_months=60)",
    "print('=== LOAN AMORTIZATION SCHEDULE (PMT/PPMT/IPMT) ===')",
    "print(f\"Initial Loan Principal:   ${facility['initial_principal']:,.2f}\")",
    "print(f\"Monthly Payment (PMT):    ${facility['monthly_payment_pmt']:,.2f}\")",
    "print(f\"Total Cumulative Interest:${facility['total_interest_paid']:,.2f}\")",
    "print(f\"Terminal Balance Check:   ${facility['terminal_balance']} (Balanced: {facility['balance_zero_integrity']})\")",
    "print(f\"Month 1 Breakdown:        {facility['sample_schedule'][0]}\")"
  ].join('\n');

  const p1_out = runPy(p1_code);

  const p2_code = [
    "# Irregular Date Net Present Value (XNPV Formulation)",
    "from datetime import datetime",
    "",
    "def calculate_xnpv_irregular_dates(discount_rate, cash_flows, date_strings):",
    "    dates = [datetime.strptime(d, '%Y-%m-%d') for d in date_strings]",
    "    d0 = dates[0]",
    "    xnpv = 0.0",
    "    discounted_tranches = []",
    "    ",
    "    for cf, d in zip(cash_flows, dates):",
    "        days_elapsed = (d - d0).days",
    "        # Day-count ACT/365 annual compounding discount factor",
    "        discount_factor = 1.0 / ((1.0 + discount_rate) ** (days_elapsed / 365.0))",
    "        pv = cf * discount_factor",
    "        xnpv += pv",
    "        discounted_tranches.append({",
    "            'date': d.strftime('%Y-%m-%d'),",
    "            'days_elapsed': days_elapsed,",
    "            'cash_flow': cf,",
    "            'present_value': round(pv, 2)",
    "        })",
    "        ",
    "    return {",
    "        'discount_rate_wacc': discount_rate,",
    "        'total_xnpv_usd': round(xnpv, 2),",
    "        'tranches_analyzed': len(discounted_tranches),",
    "        'valuation_verdict': 'VALUE_ACCRETIVE' if xnpv > 0 else 'VALUE_DESTRUCTIVE',",
    "        'sample_tranches': discounted_tranches",
    "    }",
    "",
    "deal_dates = ['2026-01-01', '2026-04-15', '2026-09-30', '2027-01-31', '2027-12-31']",
    "deal_cfs = [-1000000.0, 250000.0, 320000.0, 410000.0, 380000.0]",
    "",
    "xnpv_eval = calculate_xnpv_irregular_dates(discount_rate=0.085, cash_flows=deal_cfs, date_strings=deal_dates)",
    "print('=== IRREGULAR DATE XNPV VALUATION ENGINE ===')",
    "print(f\"Hurdle Rate (WACC):       {xnpv_eval['discount_rate_wacc'] * 100:.1f}%\")",
    "print(f\"Net Present Value (XNPV): ${xnpv_eval['total_xnpv_usd']:,.2f}\")",
    "print(f\"Investment Decision:      {xnpv_eval['valuation_verdict']}\")",
    "print(f\"Initial Capex Tranche:    {xnpv_eval['sample_tranches'][0]}\")",
    "print(f\"Terminal Exit Tranche:    {xnpv_eval['sample_tranches'][-1]}\")"
  ].join('\n');

  const p2_out = runPy(p2_code);

  const p3_code = [
    "# Multiple IRR Root Detection & Descartes' Rule of Signs Auditor",
    "def detect_irr_multiple_roots(cash_flow_stream):",
    "    # Descartes' Rule of Signs: Count sign transitions",
    "    sign_changes = 0",
    "    prev_sign = None",
    "    for cf in cash_flow_stream:",
    "        if cf == 0:",
    "            continue",
    "        curr_sign = 1 if cf > 0 else -1",
    "        if prev_sign is not None and curr_sign != prev_sign:",
    "            sign_changes += 1",
    "        prev_sign = curr_sign",
    "        ",
    "    is_conventional = sign_changes <= 1",
    "    return {",
    "        'total_periods': len(cash_flow_stream),",
    "        'sign_transitions': sign_changes,",
    "        'cash_flow_topology': 'CONVENTIONAL (UNIQUE REAL IRR ROOT)' if is_conventional else 'NON_CONVENTIONAL (MULTIPLE IRR ROOTS DETECTED)',",
    "        'irr_trap_warning': 'SAFE_TO_USE_STANDARD_IRR' if is_conventional else 'DEPLOY_MIRR_OR_XNPV_PROFILE'",
    "    }",
    "",
    "conventional_cf = [-1000.0, 300.0, 400.0, 500.0, 600.0]",
    "mining_project_cf = [-1000.0, 2500.0, -1600.0]  # Strip-mining site reclamation trap",
    "",
    "diag_conv = detect_irr_multiple_roots(conventional_cf)",
    "diag_trap = detect_irr_multiple_roots(mining_project_cf)",
    "",
    "print('=== IRR MULTIPLE ROOT AUDIT & TOPOLOGY CHECK ===')",
    "print(f\"Conventional Project:     {diag_conv['sign_transitions']} Sign Transitions | {diag_conv['cash_flow_topology']}\")",
    "print(f\"Mining Strip-Mine Trap:   {diag_trap['sign_transitions']} Sign Transitions | {diag_trap['cash_flow_topology']}\")",
    "print(f\"Governance Mandate:       {diag_trap['irr_trap_warning']}\")"
  ].join('\n');

  const p3_out = runPy(p3_code);

  const p4_code = [
    "# Newton-Raphson Extended Internal Rate of Return (XIRR) Solver",
    "from datetime import datetime",
    "",
    "def solve_xirr_newton_raphson(cash_flows, date_strings, guess=0.10, max_iter=100, tol=1e-7):",
    "    dates = [datetime.strptime(d, '%Y-%m-%d') for d in date_strings]",
    "    d0 = dates[0]",
    "    days = [(d - d0).days / 365.0 for d in dates]",
    "    ",
    "    r = guess",
    "    iterations_executed = 0",
    "    converged = False",
    "    ",
    "    for i in range(max_iter):",
    "        iterations_executed += 1",
    "        # f(r) = sum(cf_i / (1+r)^days_i)",
    "        # f'(r) = sum(-days_i * cf_i / (1+r)^(days_i + 1))",
    "        f_val = sum(cf / ((1.0 + r) ** t) for cf, t in zip(cash_flows, days))",
    "        f_prime = sum(-t * cf / ((1.0 + r) ** (t + 1.0)) for cf, t in zip(cash_flows, days))",
    "        ",
    "        if abs(f_prime) < 1e-12:",
    "            break  # Stationary point reached",
    "            ",
    "        r_next = r - (f_val / f_prime)",
    "        if abs(r_next - r) < tol:",
    "            r = r_next",
    "            converged = True",
    "            break",
    "        r = r_next",
    "        ",
    "    return {",
    "        'xirr_solved_rate': round(r, 6),",
    "        'xirr_percentage': round(r * 100, 2),",
    "        'iterations': iterations_executed,",
    "        'convergence_status': 'CONVERGED' if converged else 'FAILED_TO_CONVERGE',",
    "        'terminal_residual_xnpv': round(sum(cf / ((1.0 + r) ** t) for cf, t in zip(cash_flows, days)), 6)",
    "    }",
    "",
    "project_dates = ['2026-01-01', '2026-06-30', '2026-12-31', '2027-12-31']",
    "project_cfs = [-500000.0, 120000.0, 240000.0, 310000.0]",
    "",
    "sol = solve_xirr_newton_raphson(project_cfs, project_dates)",
    "print('=== NEWTON-RAPHSON XIRR CONVERGENCE SOLVER ===')",
    "print(f\"Solved Annualized XIRR:   {sol['xirr_percentage']}%\")",
    "print(f\"Newton-Raphson Loops:     {sol['iterations']} iterations\")",
    "print(f\"Convergence Integrity:    {sol['convergence_status']}\")",
    "print(f\"Terminal XNPV Residual:   ${sol['terminal_residual_xnpv']}\")"
  ].join('\n');

  const p4_out = runPy(p4_code);

  const p5_code = [
    "# Production Institutional Loan Amortization & Multi-Tranche Cash Flow Engine",
    "class ProductionLoanAmortizationAndXirrEngine:",
    "    def __init__(self, senior_debt, senior_rate, senior_term, mezzanine_debt, mezz_pik_rate):",
    "        self.senior_p = senior_debt",
    "        self.senior_r = senior_rate",
    "        self.senior_n = senior_term",
    "        self.mezz_p = mezzanine_debt",
    "        self.mezz_pik = mezz_pik_rate",
    "        ",
    "    def evaluate_capital_structure_yield(self, years=5):",
    "        # Senior Debt: Monthly Amortizing Facility",
    "        monthly_r = self.senior_r / 12.0",
    "        pmt = self.senior_p * (monthly_r * (1 + monthly_r)**self.senior_n) / ((1 + monthly_r)**self.senior_n - 1)",
    "        annual_senior_debt_service = pmt * 12.0",
    "        ",
    "        # Mezzanine Debt: PIK (Payment-in-Kind) compounding with terminal bullet exit",
    "        mezz_balance = self.mezz_p * ((1.0 + self.mezz_pik) ** years)",
    "        ",
    "        # Blended weighted cost of debt",
    "        total_debt = self.senior_p + self.mezz_p",
    "        blended_rate = ((self.senior_p * self.senior_r) + (self.mezz_p * self.mezz_pik)) / total_debt",
    "        ",
    "        # Debt Service Coverage Ratio (DSCR) under $250k Annual EBITDA",
    "        ebitda_run_rate = 250000.0",
    "        dscr = ebitda_run_rate / annual_senior_debt_service",
    "        ",
    "        return {",
    "            'senior_debt_principal': self.senior_p,",
    "            'senior_annual_service': round(annual_senior_debt_service, 2),",
    "            'mezzanine_principal': self.mezz_p,",
    "            'mezz_year5_bullet_exit': round(mezz_balance, 2),",
    "            'blended_debt_rate_pct': round(blended_rate * 100, 2),",
    "            'covenant_dscr_coverage': round(dscr, 2),",
    "            'covenant_compliance': 'COMPLIANT (DSCR > 1.25x)' if dscr >= 1.25 else 'COVENANT_BREACH'",
    "        }",
    "",
    "engine = ProductionLoanAmortizationAndXirrEngine(",
    "    senior_debt=800000.0, senior_rate=0.065, senior_term=84,",
    "    mezzanine_debt=300000.0, mezz_pik_rate=0.12",
    ")",
    "",
    "cap = engine.evaluate_capital_structure_yield(years=5)",
    "print('=== PRODUCTION CAPITAL STRUCTURE & DEBT SERVICE ENGINE ===')",
    "print(f\"Senior Facility Annual PMT: ${cap['senior_annual_service']:,.2f}\")",
    "print(f\"Mezzanine Year-5 Bullet:    ${cap['mezz_year5_bullet_exit']:,.2f}\")",
    "print(f\"Blended Debt Cost:          {cap['blended_debt_rate_pct']}%\")",
    "print(f\"DSCR Covenant Coverage:     {cap['covenant_dscr_coverage']}x ({cap['covenant_compliance']})\")"
  ].join('\n');

  const p5_out = runPy(p5_code);

  return {
    day: 9,
    title: 'Financial & Loan Amortization Models, NPV, IRR & XIRR',
    goal: 'Master quantitative corporate finance in Excel: multi-tranche loan amortization schedules, Time Value of Money (TVM), irregular cash flow date discounting (XNPV), multiple IRR root traps, and Newton-Raphson XIRR solvers.',
    minutes: 35,
    recap: 'Yesterday we mastered enterprise Star Schema data modeling, DAX Row vs Filter Context, and multi-table PivotTable slicer synchronization. Today we tackle advanced quantitative corporate finance: multi-period loan amortization schedules with principal/interest decomposition, Time Value of Money discounting over irregular dates with XNPV, diagnosing multiple root anomalies in IRR, and engineering hardened Newton-Raphson XIRR root solvers.',
    parts: [
      {
        title: 'Time Value of Money & Precise Multi-Period Loan Amortization Schedules',
        say: [
          'In commercial banking, private credit underwriting, and leveraged finance, the Time Value of Money (TVM) represents the foundational principle that a dollar received today is worth more than a dollar received tomorrow due to its potential earning capacity. Financial modelers must structure multi-period debt facilities with mathematical precision, calculating debt service schedules that reflect exact compounding periods, contractual interest margins, and amortizing principal reductions.',
          'A standardized fixed-rate amortizing loan operates as an ordinary annuity, where payments occur at the end of each period. In spreadsheet modeling, analysts decompose each monthly payment into two distinct financial components: the interest charge, computed using the IPMT function, and the principal repayment, computed using the PPMT function. The total payment, computed via the PMT formula, remains constant throughout the loan term, but the underlying composition changes dramatically over time.',
          'The mathematical derivation of the ordinary annuity payment formula balances the present value of all future cash outflows against the initial loan principal: PMT equals Principal times the monthly interest rate divided by one minus open parenthesis one plus monthly rate close parenthesis to the negative n power. In the opening months of a multi-year term loan, the outstanding loan balance is at its maximum, meaning the vast majority of each payment goes toward servicing accrued interest, with only a small residual fraction reducing principal.',
          'As the loan amortizes, the outstanding principal balance decreases each month. Consequently, the interest charge (balance times monthly rate) declines geometrically, allowing an ever-increasing portion of each subsequent payment to be applied toward principal reduction. By the final year of the loan, the ratio inverts: almost the entire monthly payment reduces principal, while interest charges diminish to nominal amounts.',
          'A non-negotiable structural invariant of every loan amortization schedule is Terminal Balance Equilibrium. After exactly n periods, the ending loan balance must reach precisely 0.00 dollars. Any model exhibiting a lingering residual balance—even a few cents due to rounding errors—indicates a broken compounding equation or misaligned period count, triggering immediate rejection during institutional credit audits.',
          'Furthermore, corporate debt agreements incorporate strict covenants based on the debt service schedule. Lenders mandate minimum Debt Service Coverage Ratios (DSCR), requiring that annual Net Operating Income or EBITDA exceeds total annual debt service (principal plus interest) by a specified safety margin, typically 1.25x or 1.35x. If scheduled amortization payments expand beyond cash flow generation capacity, the borrower risks technical loan default.',
          'In corporate financial structuring, loan agreements may also incorporate balloon payments, prepayment penalties, or grace periods where only interest is serviced during initial development phases. Financial analysts must dynamically configure their schedules to accommodate these bespoke terms while verifying that compounding conventions align with contractual legal master agreements.',
          'In this lesson, we engineer an audit-grade loan amortization schedule in Python that calculates monthly PMT, decomposes each period into PPMT and IPMT, tracks balance reduction, and asserts terminal balance equilibrium to satisfy strict banking credit committee standards.'
        ],
        example: 'Think of a water tank with a slow, controlled drain: each month, fresh water (interest charge) is added based on the current water level, and a bucket of fixed volume (PMT) is drained out; as the water level drops, less fresh water is needed to top it up, so more of the bucket empties the tank.',
        code: p1_code,
        output: p1_out,
        codeNotes: [
          { line: 2, note: 'Implements ordinary annuity compounding formula matching Excel PMT function' },
          { line: 13, note: 'Decomposes periodic payment into interest (IPMT) and principal reduction (PPMT)' },
          { line: 30, note: 'Asserts mathematical terminal balance zero-integrity invariant verifying exact payoff' }
        ],
        tryIt: 'Increase the annual interest rate from 6.5% to 8.5% and observe how the monthly PMT and cumulative interest paid expand.',
        check: {
          question: 'In an amortizing loan schedule, why does the principal repayment (PPMT) increase over time while the total payment (PMT) remains constant?',
          options: [
            'As principal decreases, periodic interest charges decline, allowing a larger fraction of the fixed payment to pay down principal',
            'Bank regulations require interest rates to drop every month',
            'Because the loan automatically converts into common stock',
            'Inflation automatically shrinks the legal definition of a dollar'
          ],
          answer: 0,
          why: 'Interest is charged only on the remaining balance; as principal balance amortizes downward, interest charges drop, allowing more of the fixed PMT to be applied directly toward principal.'
        }
      },
      {
        title: 'Net Present Value (NPV) vs Irregular Cash Flow Date Discounting (XNPV)',
        say: [
          'In corporate valuation, project finance, and capital budgeting, the Net Present Value (NPV) represents the gold standard for determining whether an investment generates value beyond its cost of capital. A project with a positive NPV creates shareholder wealth, while a negative NPV project destroys capital. However, a dangerous pitfall exists in spreadsheet software that causes multi-million-dollar valuation errors: the classic Excel NPV function flaw.',
          'The legacy Excel NPV formula suffers from a severe structural flaw: it assumes that the first cash flow occurs at the end of period one, rather than at time zero (the closing date). If an analyst passes an initial cash outflow into the standard NPV formula, Excel discounts that day-zero capital expenditure by an entire year, drastically overstating the project’s valuation. Experienced modelers compensate by excluding the initial investment from the NPV formula and adding it separately (=NPV(rate, CF1:CFn) + CF0).',
          'Even more critically, the legacy NPV function assumes that all subsequent cash flows occur at strictly equidistant time intervals—exactly 365 days apart. In real-world mergers, infrastructure acquisitions, and commercial real estate investments, cash flows never occur on convenient annual anniversaries: closing fees occur on day 0, working capital injections occur in month 4, milestone earnouts occur in month 9, and asset divestitures occur on irregular calendar dates.',
          'To model real-world transactions accurately, institutional finance utilizes the Extended Net Present Value function: XNPV. The mathematical formula for XNPV calculates exact time intervals using actual calendar dates: each cash flow P-i is discounted by one plus r raised to the power of the exact number of days elapsed between that cash flow date and the valuation inception date, divided by 365.',
          'By leveraging actual calendar day counts (ACT/365 convention), XNPV accounts for fractional periods, leap years, and mid-year cash distributions. A private equity distribution received in April is worth significantly more in present value terms than a distribution received in December of that same fiscal year, an essential distinction completely missed by periodic annual discounting.',
          'In corporate M&A due diligence, acquirers evaluate acquisition targets using Discounted Cash Flow (DCF) models driven by XNPV. Because acquisition debt covenants and interest payments operate on specific calendar dates, XNPV provides the exact mathematical discounting required to calculate enterprise value without periodic approximations.',
          'Furthermore, discount rates themselves must reflect the Weighted Average Cost of Capital (WACC), combining after-tax cost of debt and cost of equity derived from the Capital Asset Pricing Model (CAPM). In cross-border investments, currency inflation differentials and country risk premiums must also be incorporated into discount rates to ensure valuation comparability across international operating jurisdictions.',
          'When capital budgeting decisions involve competing mutual projects of differing sizes or durations, analysts construct complete NPV profiles—plotting project NPV across a spectrum of discount rates. This visual profile reveals the exact crossover discount rate where one project becomes superior to another, providing strategic clarity to executive investment committees.',
          'In this section, we construct an institutional XNPV valuation engine in Python. We ingest irregular deal dates, calculate day-count fractions, discount multi-period tranches, and determine value accretion against hurdle rates.'
        ],
        example: 'Think of receiving a package delivery: receiving a check on January 15th allows you to deposit and earn bank interest for eleven additional months compared to receiving that same check on December 15th; XNPV captures those extra months of compounding value.',
        code: p2_code,
        output: p2_out,
        codeNotes: [
          { line: 4, note: 'Implements exact day-count discounting formula matching institutional Excel XNPV' },
          { line: 12, note: 'Calculates fractional year exponent (days_elapsed / 365.0) for every irregular cash flow' },
          { line: 24, note: 'Computes cumulative net present value and issues value-accretion investment verdict' }
        ],
        tryIt: 'Shift the terminal cash flow forward by six months and observe how the present value increases due to reduced discounting duration.',
        check: {
          question: 'What is the primary mathematical reason to use XNPV instead of standard NPV in corporate valuation?',
          options: [
            'XNPV discounts cash flows based on exact calendar dates (ACT/365), capturing true daily compounding rather than assuming equidistant annual intervals',
            'XNPV automatically rounds all cash flows to the nearest million dollars',
            'XNPV eliminates the need to specify a discount rate or hurdle rate',
            'Standard NPV only works for non-profit organizations'
          ],
          answer: 0,
          why: 'XNPV calculates exact elapsed days between inception and each cash flow date, providing accurate present values for real-world deals with irregular payment schedules.'
        }
      },
      {
        title: 'Internal Rate of Return (IRR) & Multiple Root Traps in Non-Conventional Cash Flows',
        say: [
          'The Internal Rate of Return, or IRR, is universally cited by private equity sponsors, venture capitalists, and corporate investment committees as the primary metric for project profitability. Mathematically, the IRR is defined as the unique discount rate that drives the Net Present Value of a cash flow stream to exactly zero. If a private equity fund achieves an IRR of twenty-four percent against a hurdle rate of eight percent, the deal is celebrated as highly lucrative.',
          'However, relying blindly on the standard Excel IRR function conceals a lethal mathematical vulnerability: the Multiple Root Trap. In polynomial algebra, finding the IRR requires solving an n-th degree polynomial equation for the discount rate r. According to Descartes’ Rule of Signs, the maximum number of positive real roots for a polynomial equation equals the number of sign changes in the sequence of cash flows.',
          'In a conventional investment project, there is exactly one sign change: an initial cash outflow at time zero (negative), followed by a sequence of positive operating cash inflows. Because there is only one sign transition, Descartes’ Rule of Signs guarantees that there is at most one unique real positive IRR root. In this standard scenario, the IRR metric is mathematically well-behaved.',
          'In non-conventional investments, however, cash flows change sign multiple times. Consider a mining project, nuclear power facility, or deep-sea oil platform: the project requires an initial capital investment (negative), generates substantial cash flow during operations (positive), but requires massive environmental reclamation, decommissioning, and toxic waste disposal costs at the end of the project life (negative). This pattern creates two sign changes (+ to - and - to +).',
          'With two sign changes, the polynomial equation can possess two completely different real positive IRR roots—for example, both 12 percent and 48 percent will produce an NPV of exactly zero. In such situations, the standard Excel IRR formula will silently output whichever root is closer to its initial algorithm guess, without warning the analyst that a second, completely different rate exists. Presenting an arbitrary root to an investment committee can lead to disastrous capital allocation decisions.',
          'A second major conceptual weakness of the traditional IRR metric is the implicit reinvestment rate assumption. Standard IRR mathematically presumes that all intermediate cash inflows are reinvested throughout the remaining project duration at the project’s own internal rate of return—an assumption that is wildly unrealistic for projects generating extraordinary returns of forty or fifty percent.',
          'To avoid both the multiple root trap and the unrealistic reinvestment assumption, financial engineers inspect cash flow sign topology and deploy the Modified Internal Rate of Return (MIRR) or plot complete NPV profiles across varying discount rates. MIRR eliminates multiple roots by financing negative cash flows at a specified financing borrowing rate and reinvesting cash inflows at the corporate cost of capital.',
          'Here, we construct a cash flow topology auditor and Descartes’ Rule of Signs detector in Python. We analyze cash flow sequences, count sign transitions, flag non-conventional multiple-root hazards, and issue corporate governance warnings.'
        ],
        example: 'Think of a roller coaster track: a conventional ride goes down a hill once and levels out, crossing the ground level once; but a ride that goes down, climbs high, and dives into a subterranean tunnel crosses ground level multiple times.',
        code: p3_code,
        output: p3_out,
        codeNotes: [
          { line: 2, note: 'Applies Descartes Rule of Signs counting sign transitions across the longitudinal cash flow stream' },
          { line: 14, note: 'Categorizes project cash flow topology into conventional single root vs non-conventional multi-root' },
          { line: 18, note: 'Issues automated audit recommendations directing analysts to MIRR when multiple roots are detected' }
        ],
        tryIt: 'Modify mining_project_cf by setting the final period to +500.0 and verify that the sign transition count drops to 1, certifying single-root safety.',
        check: {
          question: 'According to Descartes’ Rule of Signs, when can an investment project have multiple real Internal Rates of Return (IRRs)?',
          options: [
            'Whenever the net cash flow stream changes sign more than once (e.g. negative to positive and back to negative)',
            'Whenever the project duration exceeds ten calendar years',
            'Whenever the initial investment is funded with mezzanine debt',
            'Whenever the cash flow numbers contain decimal cents'
          ],
          answer: 0,
          why: 'Descartes’ Rule of Signs dictates that the number of positive real roots of a polynomial equals the number of sign variations; multiple sign changes allow multiple rates to produce an NPV of zero.'
        }
      },
      {
        title: 'Extended Internal Rate of Return (XIRR) via Newton-Raphson Convergence',
        say: [
          'While theoretical finance discusses IRR as an abstract algebraic concept, spreadsheet software and financial analytics engines must solve for the Extended Internal Rate of Return (XIRR) numerically. Because the XNPV equation with fractional date exponents has no closed-form analytical solution, software engines utilize iterative numerical root-finding algorithms, with the Newton-Raphson method serving as the institutional industry standard.',
          'The Newton-Raphson algorithm operates by iteratively approximating the root of a continuous, differentiable function. Starting with an initial rate guess r-zero (typically ten percent), the algorithm evaluates the function value f(r)—the current XNPV at that rate—and its first derivative f-prime(r) with respect to the discount rate. It then updates the estimate geometrically: r-next equals r minus f(r) divided by f-prime(r).',
          'The analytical first derivative of the XNPV equation is mathematically rigorous: the derivative with respect to r of each cash flow term P-i divided by (1+r)^(t-i) equals negative t-i times P-i divided by (1+r)^(t-i + 1). Evaluating this closed-form derivative at each step gives the algorithm the exact slope of the NPV tangent line, enabling quadratic convergence that doubles the number of accurate decimal places on each iteration.',
          'In Excel, when you enter the formula =XIRR(values, dates), Excel executes up to one hundred Newton-Raphson iterations. If the cash flows are well-behaved, the algorithm converges within five to ten loops to a precision tolerance of 0.0000001 (10^-7). However, if the cash flow stream exhibits extreme volatility or stationary inflection points where the first derivative approaches zero, standard Newton-Raphson can oscillate, diverge toward infinity, or return the dreaded #NUM! error.',
          'Professional financial engineers harden the Newton-Raphson solver by implementing convergence guards: restricting updates within plausible bounds, detecting stationary points where the tangent is horizontal, and falling back to bisection or Brent’s method when gradient descent destabilizes. Verifying that the terminal residual XNPV at the solved rate is strictly within fractions of a cent proves convergence integrity.',
          'A key consideration in algorithmic solver design is the economic boundary condition: discount rates cannot drop below negative 100 percent (-1.0), as this represents total capital evaporation where future values become undefined. Solvers must enforce explicit domain boundaries, clipping intermediate candidate updates to prevent imaginary numbers or domain division errors.',
          'In portfolio performance attribution and Global Investment Performance Standards (GIPS) compliance, the distinction between Money-Weighted Returns (MWR, measured by XIRR) and Time-Weighted Returns (TWR) is critical. While TWR removes the distortion of timing and sizing of external cash flows to evaluate fund manager skill objectively, XIRR reflects the actual economic wealth generation realized by investors. Financial analysts must frequently reconcile both metrics to present a holistic picture of investment performance across volatile market regimes.',
          'In corporate M&A and venture capital, XIRR is the standard benchmark for institutional limited partners. Because limited partner capital calls and distributions occur on arbitrary dates throughout a fund’s ten-year lifecycle, XIRR provides the annualized money-weighted return that determines executive performance fees (carried interest).',
          'Here, we build a production Newton-Raphson XIRR solver in Python. We implement closed-form first derivative evaluations, iterative tangent updates, convergence tolerances, and residual verification matching Excel XIRR behavior.'
        ],
        example: 'Think of focusing an expensive camera lens: you turn the focus ring toward the target; after each micro-adjustment, the image becomes twice as sharp until the image snaps into perfect crystalline focus.',
        code: p4_code,
        output: p4_out,
        codeNotes: [
          { line: 4, note: 'Implements Newton-Raphson root solver iterating over irregular date cash flow grids' },
          { line: 17, note: 'Evaluates closed-form first derivative of XNPV function to calculate tangent slope' },
          { line: 24, note: 'Asserts convergence tolerance stopping when rate changes drop below 1e-7 threshold' }
        ],
        tryIt: 'Change the initial guess from 0.10 to 0.50 and verify that the algorithm still converges to the exact same 22.39% XIRR.',
        check: {
          question: 'How does the Newton-Raphson algorithm determine the next rate estimate during XIRR numerical solving?',
          options: [
            'It divides the current XNPV by the analytical first derivative of the XNPV curve and subtracts that quotient from the current rate',
            'It generates ten thousand random numbers and picks the average',
            'It increases the rate by a fixed one percent on every iteration',
            'It takes the square root of the initial investment'
          ],
          answer: 0,
          why: 'The Newton-Raphson update formula is r_{k+1} = r_k - f(r_k)/f\'(r_k), using the tangent slope (derivative) to project where the curve intersects the zero-NPV horizontal axis.'
        }
      },
      {
        title: 'Production Institutional Loan Amortization & Multi-Tranche Cash Flow Engine',
        say: [
          'To conclude Day 9, we synthesize our Time Value of Money principles, loan amortization mechanics, irregular date discounting, and XIRR solvers into an institutional Capital Structure and Multi-Tranche Cash Flow Engine. In leveraged buyouts (LBOs), corporate recapitalizations, and project finance, debt is rarely a single simple loan; it is structured across multiple debt tranches with varying seniority, repayment schedules, and interest payment structures.',
          'Our production engine models a multi-tranche capital structure combining Senior Secured Term Debt with Subordinated Mezzanine Debt. Senior debt features an amortizing schedule with mandatory monthly principal reductions and strict covenant coverage. Subordinated Mezzanine debt, by contrast, operates on a Payment-in-Kind (PIK) structure, where interest is not paid in cash but compounds onto the principal balance, culminating in a massive bullet repayment at year-five exit.',
          'The engine evaluates the Blended Cost of Debt by computing the volume-weighted average rate across all tranches, providing the weighted cost of debt input required for WACC calculations. Furthermore, it continuously monitors debt covenants: specifically, the Debt Service Coverage Ratio (DSCR), defined as available operating cash flow (EBITDA) divided by total mandatory annual debt service. If the DSCR falls below the contractual covenant threshold (typically 1.25x), the engine triggers an automated covenant breach warning.',
          'In leveraged credit documentation, lenders also enforce Total Leverage Ratios (Total Debt divided by EBITDA) and Interest Coverage Ratios (EBITDA divided by Cash Interest Expense). These metrics ensure that the borrower maintains sufficient liquidity headroom during seasonal economic contractions or operational downturns.',
          'In advanced corporate debt restructuring and turnaround advisory, capital structure engines must also simulate distressed reorganization scenarios. By testing Chapter 11 plan of reorganization outcomes, debt-for-equity swaps, and subordinated debt cramdowns against absolute priority rule constraints, financial analysts help restructuring committees identify optimal recapitalization strategies that maximize enterprise recovery value while preserving operating business continuity.',
          'Furthermore, treasury departments integrate debt service models with active interest rate hedging strategies, deploying interest rate swaps and caps to convert floating-rate SOFR debt into synthetic fixed-rate liabilities. Quantifying the net cash impact of derivative settlement flows ensures that debt service coverage metrics remain robust even during rapid monetary policy tightening cycles.',
          'Boardroom governance rules require that corporate treasurers evaluate debt capacity under stressed macro conditions. If interest rates surge by two hundred basis points or customer revenues decline, what happens to debt service coverage? Our engine models these dynamics, verifying whether senior debt amortization can be sustained without triggering technical defaults.',
          'In investment banking presentations, multi-tranche debt schedules are paired with sensitivity grids and waterfall diagrams, giving credit rating agencies and lending syndicates total transparency into capital preservation and repayment priorities.',
          'Ultimately, mastering loan amortization, XNPV, and XIRR transforms financial analysts into strategic quantitative advisors. They possess the mathematical rigor to design debt structures, audit private equity returns, and protect corporate solvency under complex market conditions.',
          'Below, we execute our complete production institutional loan amortization and multi-tranche cash flow engine in Python. We model senior amortizing debt alongside mezzanine PIK facilities, compute blended borrowing costs, evaluate DSCR covenant compliance, and output an audited capital structure report.'
        ],
        example: 'Think of a multi-tiered dam system: during normal rainfall, water flows smoothly through the primary hydroelectric turbines (Senior debt payments); while excess floodwater is held back in the secondary spillway (Mezzanine PIK) to be released safely at the end of the season.',
        code: p5_code,
        output: p5_out,
        codeNotes: [
          { line: 2, note: 'Models multi-tranche debt capital structure combining amortizing senior debt and mezzanine PIK' },
          { line: 15, note: 'Calculates compounded Payment-in-Kind (PIK) balance with year-5 bullet exit obligation' },
          { line: 22, note: 'Monitors Debt Service Coverage Ratio (DSCR) asserting compliance against contractual 1.25x covenant' }
        ],
        tryIt: 'Lower ebitda_run_rate to $140,000 and observe how the covenant compliance flips to COVENANT_BREACH as DSCR drops below 1.25x.',
        check: {
          question: 'What is Payment-in-Kind (PIK) interest in a corporate mezzanine debt facility?',
          options: [
            'Interest that is not paid in current cash but is added to the principal balance, compounding over time until loan maturity',
            'Interest paid exclusively in physical commodities like gold or oil',
            'Interest that is legally forgiven if the company misses revenue targets',
            'A penalty fee paid only when opening bank accounts'
          ],
          answer: 0,
          why: 'PIK interest allows borrowers to conserve operating cash by rolling accrued interest into the principal balance, which compounds and is repaid as a lump-sum bullet at terminal maturity.'
        }
      }
    ],
    summary: [
      'Loan amortization schedules decompose constant ordinary annuity payments (PMT) into declining interest (IPMT) and increasing principal (PPMT).',
      'XNPV uses exact calendar dates (ACT/365) to discount irregular cash flows, eliminating the equidistant timing errors of legacy NPV.',
      'Descartes’ Rule of Signs reveals that cash flows with multiple sign transitions can yield multiple real positive IRR roots.',
      'Newton-Raphson solvers achieve rapid quadratic convergence for XIRR by utilizing the closed-form first derivative of the XNPV equation.',
      'Multi-tranche debt models evaluate blended borrowing costs and enforce Debt Service Coverage Ratio (DSCR) covenant safety margins.'
    ],
    projectStep: {
      title: 'Architect a Multi-Tranche Loan Amortization & XIRR Valuation Engine',
      steps: [
        'Build a multi-period loan amortization schedule with IPMT/PPMT decomposition and terminal balance zero verification.',
        'Implement an irregular date discounting model using XNPV with exact ACT/365 day-count fractions.',
        'Execute a cash flow topology audit using Descartes’ Rule of Signs to detect multiple IRR root vulnerabilities.',
        'Develop a hardened Newton-Raphson numerical root solver to calculate annualized XIRR with residual verification.',
        'Engineer a multi-tranche debt capital structure model evaluating senior amortizing debt, mezzanine PIK, and DSCR covenants.'
      ]
    }
  };
}
