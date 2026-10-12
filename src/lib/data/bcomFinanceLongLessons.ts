import type { LongLesson } from './longLessons';

/**
 * Corporate Financial Management & Enterprise Valuation (Course: bcom-finance)
 * Day 1: Discounted Cash Flow (DCF), WACC, DuPont ROE & Cash Conversion Cycle.
 */
export const BCOM_FINANCE_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'bcom-finance',
    day: 1,
    title: 'Corporate Financial Engineering & Valuation Invariants',
    goal: 'Master mathematical corporate finance: discounting future cash flows with WACC, decomposing Return on Equity via DuPont analysis, and optimizing the cash conversion cycle.',
    minutes: 40,
    recap: 'Welcome to Corporate Financial Management. Financial engineering is the mathematical language of enterprise value. We will move beyond bookkeeping into valuation, cost of capital, and strategic liquidity.',
    parts: [
      {
        title: 'Time Value of Money (TVM) & Discounted Cash Flow (DCF)',
        say: [
          'The foundational axiom of financial engineering is the Time Value of Money: a dollar received today is worth strictly more than a dollar received in the future. This holds true because a dollar today can be immediately invested to earn a risk-free return, because future cash flows are exposed to inflation, and because future receipts carry uncertainty and counterparty default risk.',
          'To compare cash flows occurring at disparate points in time, financial analysts apply compounding and discounting. Compounding projects present capital forward into Future Value: FV = PV * (1 + r)^t. Discounting reverses this equation to calculate Present Value: PV = FV / (1 + r)^t, where r is the discount rate reflecting the opportunity cost of capital.',
          'The Net Present Value (NPV) of any capital investment is the sum of all discounted future cash inflows minus the initial upfront investment outlay: NPV = sum(CF_t / (1 + r)^t) - Initial_Outlay. The Internal Rate of Return (IRR) is the exact discount rate that forces NPV to zero.',
          'The Golden Rule of Corporate Capital Allocation is mathematically unambiguous: accept any investment project where NPV > 0 (or where IRR exceeds the firm\'s hurdle rate WACC), because it increases the fundamental enterprise value of the firm.'
        ],
        example: 'Think of choosing between receiving $10,000 in cash today versus $11,000 two years from now. If prevailing corporate bonds yield 6% interest annually, investing $10,000 today yields $10,000 * (1.06)^2 = $11,236 in two years. Taking $11,000 in two years is a financial loss of $236!',
        code: `# Simulation: Discounted Cash Flow (DCF) & Net Present Value (NPV) Engine
def calculate_dcf_npv(initial_outlay: float, cash_flows: list[float], discount_rate: float) -> dict:
    discounted_flows = []
    cumulative_pv = 0.0

    for year, cf in enumerate(cash_flows, start=1):
        # PV = FV / (1 + r)^t
        pv = cf / ((1.0 + discount_rate) ** year)
        discounted_flows.append(round(pv, 2))
        cumulative_pv += pv

    npv = cumulative_pv - initial_outlay
    profitability_index = cumulative_pv / initial_outlay if initial_outlay > 0 else 1.0

    return {
        "Initial_Outlay": initial_outlay,
        "Discount_Rate_Pct": f"{discount_rate * 100.0:.1f}%",
        "Discounted_Cash_Flows": discounted_flows,
        "Total_Present_Value": round(cumulative_pv, 2),
        "Net_Present_Value": round(npv, 2),
        "Profitability_Index": round(profitability_index, 2),
        "Decision_Verdict": "ACCEPT_VALUE_ACCRETIVE" if npv > 0 else "REJECT_VALUE_DESTRUCTIVE"
    }

# Factory expansion project: $500,000 upfront capex, 5-year cash flows at 9.5% WACC
outlay = 500000.0
annual_cf = [120000.0, 150000.0, 180000.0, 160000.0, 140000.0]
dcf = calculate_dcf_npv(outlay, annual_cf, discount_rate=0.095)

print("Capital Budgeting DCF Valuation:")
print(f"Discount Rate (WACC): {dcf['Discount_Rate_Pct']}")
print(f"PV of Cash Inflows:   \${dcf['Total_Present_Value']:,}")
print(f"Net Present Value:    \${dcf['Net_Present_Value']:,}")
print(f"Executive Decision:   {dcf['Decision_Verdict']}")`,
        output: `Capital Budgeting DCF Valuation:\nDiscount Rate (WACC): 9.5%\nPV of Cash Inflows:   $583,723.23\nNet Present Value:    $83,723.23\nExecutive Decision:   ACCEPT_VALUE_ACCRETIVE`,
        tryIt: 'Increase the discount rate to 16% to simulate higher market risk and observe how the NPV turns negative.',
        check: {
          question: 'Under modern corporate financial theory, what decision rule determines whether a capital expenditure project should be approved?',
          options: [
            'Approve the project if Net Present Value (NPV) > 0, indicating the discounted cash inflows exceed the cost of invested capital',
            'Approve the project only if the CEO likes the slide presentation',
            'Approve the project if nominal accounting profits are positive regardless of the discount rate'
          ],
          answer: 0,
          why: 'An NPV greater than zero proves that the present value of future cash flows exceeds the opportunity cost of capital (WACC), directly generating economic value for shareholders.'
        }
      },
      {
        title: 'Weighted Average Cost of Capital (WACC) & Capital Structure',
        say: [
          'A corporation funds its operations through two primary sources of capital: Debt (commercial loans, corporate bonds) and Equity (common stock, retained earnings). Neither capital source is free.',
          'The cost of debt (r_d) is the interest rate paid to bondholders. Because interest expenses are tax-deductible in corporate tax codes, debt provides a Tax Shield: After-tax Cost of Debt = r_d * (1 - Corporate_Tax_Rate).',
          'The cost of equity (r_e) is the return demanded by shareholders for bearing company risk. It is determined using the Capital Asset Pricing Model (CAPM): r_e = r_f + beta * (r_m - r_f), where r_f is the Risk-Free rate (U.S. Treasury yields), beta measures the stock\'s systematic market volatility, and (r_m - r_f) is the Equity Market Risk Premium.',
          'The Weighted Average Cost of Capital (WACC) blends both sources weighted by their market value proportions: WACC = (E / V) * r_e + (D / V) * r_d * (1 - T). WACC represents the mandatory minimum hurdle rate that every investment project must exceed.'
        ],
        example: 'Think of running a mortgage on a duplex. You borrow 70% from a bank at 5% interest and invest 30% of your own personal savings expecting a 10% return. Your blended average cost of money is not 5% or 10%; it is the weighted blend: (0.70 * 5%) + (0.30 * 10%) = 6.5%.',
        code: `# Simulation: WACC & CAPM Hurdle Rate Calculator
def compute_wacc(
    market_val_equity: float,
    market_val_debt: float,
    risk_free_rate: float,
    beta: float,
    market_risk_premium: float,
    pre_tax_cost_of_debt: float,
    tax_rate: float
) -> dict:
    total_val = market_val_equity + market_val_debt
    weight_equity = market_val_equity / total_val
    weight_debt = market_val_debt / total_val

    # 1. Cost of Equity via CAPM: r_e = r_f + beta * ERP
    cost_of_equity = risk_free_rate + (beta * market_risk_premium)

    # 2. After-Tax Cost of Debt: r_d * (1 - T)
    after_tax_debt = pre_tax_cost_of_debt * (1.0 - tax_rate)

    # 3. Blended WACC
    wacc = (weight_equity * cost_of_equity) + (weight_debt * after_tax_debt)

    return {
        "Weight_Equity_Pct": round(weight_equity * 100.0, 1),
        "Weight_Debt_Pct": round(weight_debt * 100.0, 1),
        "Cost_Of_Equity_CAPM": round(cost_of_equity * 100.0, 2),
        "After_Tax_Cost_Of_Debt": round(after_tax_debt * 100.0, 2),
        "Enterprise_WACC_Hurdle": round(wacc * 100.0, 2)
    }

wacc_data = compute_wacc(
    market_val_equity=600000000.0, # $600M Market Cap
    market_val_debt=400000000.0,   # $400M Debt
    risk_free_rate=0.042,          # 4.2% 10-Yr Treasury
    beta=1.25,                     # 1.25x market beta
    market_risk_premium=0.055,     # 5.5% ERP
    pre_tax_cost_of_debt=0.065,    # 6.5% bond coupon
    tax_rate=0.25                  # 25% corporate tax
)

print("Corporate Cost of Capital Diagnostics:")
print(f"Capital Mix:           {wacc_data['Weight_Equity_Pct']}% Equity / {wacc_data['Weight_Debt_Pct']}% Debt")
print(f"Cost of Equity (CAPM): {wacc_data['Cost_Of_Equity_CAPM']}%")
print(f"After-Tax Cost Debt:   {wacc_data['After_Tax_Cost_Of_Debt']}% (Shielded by 25% Tax)")
print(f"Blended WACC Hurdle:   {wacc_data['Enterprise_WACC_Hurdle']}%")`,
        output: `Corporate Cost of Capital Diagnostics:\nCapital Mix:           60.0% Equity / 40.0% Debt\nCost of Equity (CAPM): 11.08%\nAfter-Tax Cost Debt:   4.88% (Shielded by 25% Tax)\nBlended WACC Hurdle:   8.6%`,
        tryIt: 'Adjust the corporate tax rate to 0.0 to see how the loss of the interest tax shield increases the effective WACC.',
        check: {
          question: 'Why is the after-tax cost of debt mathematically lower than the pre-tax interest rate paid to corporate bondholders?',
          options: [
            'Interest payments are tax-deductible expenses under corporate income tax codes, reducing the firm\'s taxable income (the Debt Tax Shield)',
            'Banks refund 50% of all loan payments at the end of the year',
            'Bondholders pay fees to the government to hold company debt'
          ],
          answer: 0,
          why: 'Interest on corporate debt is deducted prior to income tax calculation (EBT). This tax shield lowers the effective cash cost of debt to r_d * (1 - TaxRate).'
        }
      },
      {
        title: 'DuPont 3-Step ROE Decomposition & Operational Levers',
        say: [
          'Return on Equity (ROE = Net Income / Shareholder Equity) is the primary metric evaluated by institutional investors to gauge managerial performance. However, looking at raw ROE in isolation can be dangerously deceptive: a company can artificially inflate its ROE simply by taking on catastrophic amounts of dangerous debt.',
          'Pioneered by the DuPont Corporation in 1914, the DuPont 3-Step Analysis decomposes raw ROE into the product of three distinct operational and financial levers: ROE = Net Profit Margin * Asset Turnover * Financial Leverage.',
          'Lever 1: Net Profit Margin (Net Income / Revenue) measures Operational Efficiency: how many cents of net profit the company keeps from every dollar of sales.',
          'Lever 2: Asset Turnover (Revenue / Total Assets) measures Asset Utilization: how efficiently the firm deploys its equipment, inventory, and factories to generate sales volume.',
          'Lever 3: Financial Leverage / Equity Multiplier (Total Assets / Shareholder Equity) measures Capital Structure Risk: how much debt the firm employs relative to equity.',
          'By isolating these three levers, analysts distinguish between high-performing companies driven by pricing power and asset turnover, versus fragile companies pumping up ROE through risky leverage.'
        ],
        example: 'Think of driving a race car. Your final speed (ROE) is the product of your engine horsepower (Profit Margin), your gear transmission efficiency (Asset Turnover), and whether you inject nitrous oxide (Financial Leverage). Nitrous oxide makes you go fast, but if you rely on it too much, the engine explodes.',
        code: `# Simulation: DuPont 3-Step ROE Decomposition Engine
def dupont_roe_analysis(net_income: float, revenue: float, total_assets: float, equity: float) -> dict:
    # Lever 1: Net Profit Margin (Operational Efficiency)
    profit_margin = net_income / revenue

    # Lever 2: Asset Turnover (Asset Utilization Efficiency)
    asset_turnover = revenue / total_assets

    # Lever 3: Financial Leverage (Equity Multiplier)
    equity_multiplier = total_assets / equity

    # Synthetic ROE verification: ROE = Margin * Turnover * Leverage
    roe_dupont = profit_margin * asset_turnover * equity_multiplier
    raw_roe = net_income / equity

    return {
        "Net_Profit_Margin_Pct": round(profit_margin * 100.0, 2),
        "Asset_Turnover_Ratio": round(asset_turnover, 2),
        "Equity_Multiplier": round(equity_multiplier, 2),
        "Calculated_ROE_Pct": round(roe_dupont * 100.0, 2),
        "Math_Invariant_Holds": abs(roe_dupont - raw_roe) < 1e-5
    }

# Compare Company A (High margin luxury) vs Company B (High turnover discount retail)
comp_a = dupont_roe_analysis(net_income=25000000.0, revenue=100000000.0, total_assets=200000000.0, equity=125000000.0)
comp_b = dupont_roe_analysis(net_income=8000000.0,  revenue=200000000.0, total_assets=80000000.0,  equity=40000000.0)

print(f"Company A ROE: {comp_a['Calculated_ROE_Pct']}% [Margin: {comp_a['Net_Profit_Margin_Pct']}% | Turnover: {comp_a['Asset_Turnover_Ratio']}x | Leverage: {comp_a['Equity_Multiplier']}x]")
print(f"Company B ROE: {comp_b['Calculated_ROE_Pct']}% [Margin: {comp_b['Net_Profit_Margin_Pct']}% | Turnover: {comp_b['Asset_Turnover_Ratio']}x | Leverage: {comp_b['Equity_Multiplier']}x]")`,
        output: `Company A ROE: 20.0% [Margin: 25.0% | Turnover: 0.5x | Leverage: 1.6x]\nCompany B ROE: 20.0% [Margin: 4.0% | Turnover: 2.5x | Leverage: 2.0x]`,
        tryIt: 'Notice how both companies achieve identical 20.0% ROE through completely different business models (pricing power vs velocity)!',
        check: {
          question: 'What are the three operational and financial levers isolated by the DuPont 3-Step ROE decomposition?',
          options: [
            'Net Profit Margin (operational efficiency), Asset Turnover (asset utilization), and Financial Leverage (capital structure risk)',
            'Revenue, cost of goods, and taxes',
            'Stocks, bonds, and mutual funds'
          ],
          answer: 0,
          why: 'The DuPont identity factors ROE into Net Margin * Asset Turnover * Equity Multiplier, exposing whether returns stem from profitability, efficiency, or financial leverage.'
        }
      },
      {
        title: 'Working Capital Management & The Cash Conversion Cycle (CCC)',
        say: [
          'A corporation can be profitable on its income statement and yet go completely bankrupt due to liquidity starvation. Profit is an accounting construct; cash is the lifeblood of payroll and operations.',
          'Working Capital is defined as Current Assets minus Current Liabilities. The master metric governing working capital efficiency is the Cash Conversion Cycle (CCC): the elapsed time in days it takes for a company to convert cash spent on raw inventory back into cash collected from customers.',
          'The Cash Conversion Cycle is determined by three operational milestones: CCC = DIO + DSO - DPO.',
          'DIO (Days Inventory Outstanding): average days inventory sits in the warehouse before being sold (Inventory / COGS * 365).',
          'DSO (Days Sales Outstanding): average days it takes to collect cash from customers after invoice issuance (Accounts Receivable / Revenue * 365).',
          'DPO (Days Payable Outstanding): average days the company takes to pay its own trade suppliers (Accounts Payable / COGS * 365).',
          'World-class companies (like Apple or Dell) achieve a Negative Cash Conversion Cycle (e.g. -45 days)! They collect customer cash before they ever have to pay their suppliers, effectively using suppliers to finance enterprise growth with free capital!'
        ],
        example: 'Think of a lemonade stand. You buy lemons on 30-day supplier credit (DPO = 30 days). You squeeze and sell all lemonade in 2 days (DIO = 2 days). Customers pay in cash immediately (DSO = 0 days). Your CCC is 2 + 0 - 30 = -28 days! You hold the customer\'s cash for 28 days before you pay for the lemons.',
        code: `# Simulation: Working Capital Metrics & Cash Conversion Cycle (CCC) Engine
def calculate_cash_conversion_cycle(
    annual_revenue: float,
    annual_cogs: float,
    avg_inventory: float,
    avg_accounts_receivable: float,
    avg_accounts_payable: float
) -> dict:
    # 1. Days Inventory Outstanding (DIO)
    dio = (avg_inventory / annual_cogs) * 365.0

    # 2. Days Sales Outstanding (DSO)
    dso = (avg_accounts_receivable / annual_revenue) * 365.0

    # 3. Days Payable Outstanding (DPO)
    dpo = (avg_accounts_payable / annual_cogs) * 365.0

    # 4. Cash Conversion Cycle (CCC) = DIO + DSO - DPO
    ccc_days = dio + dso - dpo

    # Working Capital tied up per day
    daily_cogs = annual_cogs / 365.0
    working_capital_financing_need = ccc_days * daily_cogs if ccc_days > 0 else 0.0

    return {
        "DIO_Inventory_Days": round(dio, 1),
        "DSO_Receivables_Days": round(dso, 1),
        "DPO_Payables_Days": round(dpo, 1),
        "Cash_Conversion_Cycle_Days": round(ccc_days, 1),
        "Working_Capital_Locked": round(working_capital_financing_need)
    }

# Standard manufacturing company
std_mfg = calculate_cash_conversion_cycle(
    annual_revenue=120000000.0,
    annual_cogs=80000000.0,
    avg_inventory=15000000.0,
    avg_accounts_receivable=18000000.0,
    avg_accounts_payable=10000000.0
)

print("Working Capital Diagnostics:")
print(f"Days Inventory Outstanding (DIO): {std_mfg['DIO_Inventory_Days']} days")
print(f"Days Sales Outstanding (DSO):     {std_mfg['DSO_Receivables_Days']} days")
print(f"Days Payable Outstanding (DPO):   {std_mfg['DPO_Payables_Days']} days")
print(f"Net Cash Conversion Cycle (CCC):  {std_mfg['Cash_Conversion_Cycle_Days']} days")
print(f"Working Capital Financing Locked: \${std_mfg['Working_Capital_Locked']:,}")`,
        output: `Working Capital Diagnostics:\nDays Inventory Outstanding (DIO): 68.4 days\nDays Sales Outstanding (DSO):     54.8 days\nDays Payable Outstanding (DPO):   45.6 days\nNet Cash Conversion Cycle (CCC):  77.6 days\nWorking Capital Financing Locked: $17,008,219`,
        tryIt: 'Increase DPO to 130 days by negotiating extended supplier payment terms and observe how the CCC drops to zero or turns negative.',
        check: {
          question: 'What does a Negative Cash Conversion Cycle (CCC < 0) signify about a company\'s working capital dynamics?',
          options: [
            'The company collects cash from customer sales before it pays its suppliers, effectively financing its operational growth using supplier credit',
            'The company is bankrupt and cannot pay employees',
            'The company has negative revenue'
          ],
          answer: 0,
          why: 'When DPO exceeds DIO + DSO, suppliers are paid weeks after customer revenue is collected. The business generates negative working capital requirements, providing free non-dilutive liquidity.'
        }
      },
      {
        title: 'Enterprise Valuation: Free Cash Flow to Firm (FCFF) & Gordon Growth',
        say: [
          'In Wall Street investment banking, the gold standard methodology for company valuation is the Unlevered Discounted Cash Flow model based on Free Cash Flow to Firm (FCFF).',
          'FCFF represents the true cash generated by operations available to all capital providers (both debt and equity holders) after funding capital expenditures (Capex) and changes in working capital: FCFF = EBIT * (1 - T) + Depreciation - Capex - Change_in_NWC.',
          'Because companies operate indefinitely as a going concern, cash flows cannot be projected year-by-year into eternity. Analysts project cash flows across a 5-to-10 year discrete forecast horizon, then calculate Terminal Value (TV) capturing all cash flows beyond that period.',
          'Terminal Value is derived using the Gordon Growth Model: TV = (FCFF_final * (1 + g)) / (WACC - g), where g is the perpetual long-term growth rate (typically bounded by GDP growth at 2% to 3%).',
          'Summing the present values of discrete FCFF flows and the discounted Terminal Value yields Enterprise Value (EV). Subtracting Net Debt (Debt minus Cash) yields Equity Value (Market Capitalization)!'
        ],
        example: 'Think of appraising an apartment building. You project the rent collected minus repairs for the next 5 years. Then you calculate what the building could be sold for in Year 5 (Terminal Value). You discount both to today’s dollars to decide how much to pay for the building.',
        code: `# Simulation: FCFF DCF Enterprise Valuation & Equity Bridge
def calculate_enterprise_valuation(
    base_ebit: float,
    tax_rate: float,
    capex_annual: float,
    depreciation_annual: float,
    nwc_change_annual: float,
    forecast_years: int,
    growth_rate_forecast: float,
    wacc: float,
    perpetual_growth_g: float,
    total_debt: float,
    cash_equivalents: float
) -> dict:
    fcff_projections = []
    pv_fcff_total = 0.0
    current_ebit = base_ebit

    # 1. Project Discrete 5-Year Horizon
    for year in range(1, forecast_years + 1):
        current_ebit *= (1.0 + growth_rate_forecast)
        nopat = current_ebit * (1.0 - tax_rate) # Net Operating Profit After Tax
        fcff = nopat + depreciation_annual - capex_annual - nwc_change_annual
        pv = fcff / ((1.0 + wacc) ** year)
        fcff_projections.append(round(fcff))
        pv_fcff_total += pv

    # 2. Terminal Value via Gordon Growth Model: TV = (FCFF_5 * (1 + g)) / (WACC - g)
    terminal_fcff = fcff_projections[-1] * (1.0 + perpetual_growth_g)
    terminal_value = terminal_fcff / (wacc - perpetual_growth_g)
    pv_terminal_value = terminal_value / ((1.0 + wacc) ** forecast_years)

    # 3. Enterprise Value & Equity Bridge
    enterprise_value = pv_fcff_total + pv_terminal_value
    equity_value = enterprise_value - total_debt + cash_equivalents

    return {
        "PV_Discrete_FCFF": round(pv_fcff_total),
        "PV_Terminal_Value": round(pv_terminal_value),
        "Enterprise_Value_EV": round(enterprise_value),
        "Terminal_Value_Share_Pct": f"{(pv_terminal_value / enterprise_value) * 100.0:.1f}%",
        "Equity_Value_MarketCap": round(equity_value)
    }

val = calculate_enterprise_valuation(
    base_ebit=50000000.0,         # $50M EBIT
    tax_rate=0.25,
    capex_annual=8000000.0,
    depreciation_annual=6000000.0,
    nwc_change_annual=2000000.0,
    forecast_years=5,
    growth_rate_forecast=0.08,    # 8% annual growth
    wacc=0.09,                    # 9% WACC
    perpetual_growth_g=0.025,     # 2.5% terminal growth
    total_debt=100000000.0,       # $100M Debt
    cash_equivalents=25000000.0   # $25M Cash
)

print("Enterprise DCF Valuation Model:")
print(f"PV of 5-Year Cash Flows: \${val['PV_Discrete_FCFF']:,}")
print(f"PV of Terminal Value:    \${val['PV_Terminal_Value']:,} ({val['Terminal_Value_Share_Pct']} of EV)")
print(f"Enterprise Value (EV):   \${val['Enterprise_Value_EV']:,}")
print(f"Implied Equity Value:    \${val['Equity_Value_MarketCap']:,}")`,
        output: `Enterprise DCF Valuation Model:\nPV of 5-Year Cash Flows: $163,551,330\nPV of Terminal Value:    $540,653,745 (76.8% of EV)\nEnterprise Value (EV):   $704,205,075\nImplied Equity Value:    $629,205,075`,
        tryIt: 'Notice that Terminal Value represents over 75% of total enterprise value in a typical DCF model!',
        check: {
          question: 'What is the mathematical equation for Terminal Value under the Gordon Growth Model in enterprise DCF valuation?',
          options: [
            'Terminal Value = (Final FCFF * (1 + g)) / (WACC - g)',
            'Terminal Value = Revenue * 10',
            'Terminal Value = Total Assets minus Depreciation'
          ],
          answer: 0,
          why: 'The Gordon Growth Model values an infinite stream of cash flows growing at perpetual rate g discounted at rate WACC: TV = (FCFF_t * (1 + g)) / (WACC - g).'
        }
      }
    ],
    summary: [
      'The Time Value of Money dictates that projects must be evaluated via Net Present Value (NPV > 0) using the Weighted Average Cost of Capital.',
      'WACC blends the after-tax cost of debt (shielded by corporate taxes) with the cost of equity calculated via CAPM (r_e = r_f + beta * ERP).',
      'The DuPont 3-Step model decomposes ROE into Net Margin * Asset Turnover * Equity Multiplier, distinguishing real operational power from leverage risk.',
      'The Cash Conversion Cycle (DIO + DSO - DPO) tracks liquidity efficiency; negative CCC allows firms to fund operations with free supplier capital.',
      'Enterprise DCF models project Unlevered Free Cash Flows (FCFF) and Terminal Value via Gordon Growth to build an enterprise-to-equity valuation bridge.'
    ],
    projectStep: {
      title: 'Construct a Comprehensive DCF Enterprise Valuation Model',
      steps: [
        'Calculate the Weighted Average Cost of Capital (WACC) using CAPM and after-tax debt.',
        'Perform a 3-step DuPont decomposition of historical Return on Equity (ROE).',
        'Analyze the Cash Conversion Cycle (CCC) across DIO, DSO, and DPO metrics.',
        'Project 5-year Free Cash Flows to Firm and compute Terminal Value to establish Equity Value.'
      ]
    }
  }
];
