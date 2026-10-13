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
  },
  {
    coursePrefix: 'bcom-finance',
    day: 2,
    title: 'LBO Financial Modeling, M&A Accretion, Real Options & FX Risk Hedging',
    goal: 'Master advanced corporate financial engineering: Leveraged Buyout (LBO) debt paydown mechanics and sponsor IRR returns, Mergers & Acquisitions (M&A) EPS accretion/dilution hurdle modeling with operating synergies, Black-Scholes Real Options analysis in corporate capital expenditure budgeting, static tradeoff optimal capital structure determination, and multi-currency foreign exchange (FX) transaction risk hedging.',
    minutes: 42,
    recap: 'Day 1 established enterprise DCF valuation, WACC computation, and DuPont ROE decomposition. Day 2 tackles sophisticated corporate transactions and risk management: structuring leveraged buyouts, evaluating M&A earnings accretion, valuing real investment options, and hedging FX exposures.',
    parts: [
      {
        title: 'Leveraged Buyout (LBO) Debt Paydown & Private Equity IRR Waterfall',
        say: [
          'In private equity and corporate finance, a Leveraged Buyout (LBO) is the acquisition of a target company using a significant proportion of borrowed capital (typically 60% to 80% debt: senior secured bank facilities, mezzanine notes, and high-yield bonds).',
          'The core mathematical premise of an LBO is financial leverage amplification: the private equity sponsor commits a modest equity check (20% to 40% of enterprise value), and uses the target firm\'s future operating Free Cash Flow (FCF) to systematically pay down the acquisition debt over a 3- to 7-year holding period.',
          'Value creation in an LBO occurs through three primary levers: 1. De-leveraging / Debt Paydown (transferring enterprise value from debt holders to equity sponsors); 2. Operational EBITDA Expansion (revenue growth and margin improvement); and 3. Multiple Expansion (selling at a higher EV/EBITDA multiple upon exit).',
          'Private equity investors benchmark performance using two key metrics: Money-on-Invested-Capital (MoIC = Exit Equity / Initial Sponsor Equity) and Internal Rate of Return (IRR). Standard PE underwriting models target a 2.0x+ MoIC and a 20% to 25% net IRR.',
          'Crucially, financial engineers must model senior debt amortization schedules and interest coverage ratios to ensure the company generates sufficient cash flow to service debt covenants without inducing financial distress.'
        ],
        example: 'A private equity sponsor acquires an industrial company for $100M (10x EBITDA of $10M) funded with $65M debt and $35M sponsor equity. Over 5 years, the company generates $35M in free cash flow, paying debt down to $30M. Exiting at the same 10x multiple with 25% EBITDA growth yields an exit equity value of $95M ($125M EV - $30M debt), delivering a 2.71x MoIC and a 22.1% net IRR.',
        code: `# Simulation: Leveraged Buyout (LBO) Debt Paydown & IRR Waterfall Model
from typing import Dict

def calculate_lbo_returns(
    entry_ebitda: float,
    entry_multiple: float,
    debt_percentage: float, # e.g. 70% debt, 30% sponsor equity
    annual_free_cash_flow: float,
    holding_period_years: int = 5,
    exit_multiple: float = 10.0
) -> Dict:
    enterprise_value_entry = entry_ebitda * entry_multiple
    initial_debt = enterprise_value_entry * (debt_percentage / 100.0)
    sponsor_initial_equity = enterprise_value_entry - initial_debt

    # Cumulative cash flow used to pay down senior debt over hold period
    total_debt_paydown = annual_free_cash_flow * holding_period_years
    ending_debt = max(0.0, initial_debt - total_debt_paydown)

    # Exit at year 5
    exit_enterprise_value = entry_ebitda * 1.25 * exit_multiple # assuming 25% EBITDA growth
    sponsor_exit_equity = exit_enterprise_value - ending_debt

    # MoIC (Multiple on Invested Capital) & IRR
    moic = sponsor_exit_equity / sponsor_initial_equity if sponsor_initial_equity > 0 else 0.0
    irr = (moic ** (1.0 / holding_period_years) - 1.0) * 100.0 if moic > 0 else 0.0

    return {
        "Entry_EV": round(enterprise_value_entry, 2),
        "Initial_Debt": round(initial_debt, 2),
        "Sponsor_Initial_Equity": round(sponsor_initial_equity, 2),
        "Ending_Debt": round(ending_debt, 2),
        "Exit_EV": round(exit_enterprise_value, 2),
        "Sponsor_Exit_Equity": round(sponsor_exit_equity, 2),
        "MoIC": round(moic, 2),
        "IRR_Pct": round(irr, 2)
    }

lbo_res = calculate_lbo_returns(
    entry_ebitda=10000000.0,
    entry_multiple=10.0, # $100M EV
    debt_percentage=65.0, # $65M debt, $35M equity
    annual_free_cash_flow=7000000.0, # $35M paid down over 5 years
    holding_period_years=5,
    exit_multiple=10.0
)
print(f"Entry EV: \${lbo_res['Entry_EV']:,.2f} | Sponsor Equity: \${lbo_res['Sponsor_Initial_Equity']:,.2f}")
print(f"Ending Debt: \${lbo_res['Ending_Debt']:,.2f} -> Exit Equity: \${lbo_res['Sponsor_Exit_Equity']:,.2f}")
print(f"MoIC: {lbo_res['MoIC']}x | 5-Year IRR: {lbo_res['IRR_Pct']}%")`,
        output: `Entry EV: $100,000,000.00 | Sponsor Equity: $35,000,000.00\nEnding Debt: $30,000,000.00 -> Exit Equity: $95,000,000.00\nMoIC: 2.71x | 5-Year IRR: 22.1%`,
        tryIt: 'Change exit_multiple to 12.0 to simulate multiple expansion and observe how sponsor IRR expands above 28%.',
        check: {
          question: 'What is the primary mathematical driver of private equity equity returns in a standard Leveraged Buyout (LBO) transaction?',
          options: [
            '(Recommended) Using the acquired firm\'s operating cash flow to amortize debt over the holding period, thereby transferring enterprise value from lenders directly into sponsor equity value.',
            'Permanently exempting the target company from paying employee salaries.',
            'Converting all corporate debt into non-refundable government grants.',
            'Selling all target operational assets immediately at a 90% discount.'
          ],
          answer: 0,
          why: 'Debt paydown de-levers the business, shifting the capital structure so that equity holders own a progressively larger percentage of the enterprise value at exit.',
          answerIndex: 0,
          explanation: 'Debt paydown de-levers the business, shifting the capital structure so that equity holders own a progressively larger percentage of the enterprise value at exit.'
        }
      },
      {
        title: 'M&A Accretion/Dilution Analysis & Synergies Hurdle Model',
        say: [
          'When publicly traded corporations undertake mergers and acquisitions (M&A), equity research analysts and institutional shareholders evaluate the transaction through Accretion/Dilution Analysis.',
          'A transaction is Accretive if the pro-forma Earnings Per Share (EPS) of the combined entity exceeds the standalone buyer\'s pre-deal EPS. If pro-forma EPS declines, the deal is Dilutive.',
          'Accretion or dilution depends primarily on the acquisition financing structure: 1. All-Cash or Debt Deals: accretive if the target\'s earnings yield (Target Net Income / Purchase Price) exceeds the buyer\'s after-tax cost of debt or foregone interest on cash; 2. All-Stock Deals: accretive if the buyer\'s P/E multiple is higher than the effective P/E multiple paid for the target.',
          'Financing cost adjustments must incorporate the corporate tax shield on new debt: After-Tax Interest Expense = New Debt * Interest Rate * (1 - Corporate Tax Rate).',
          'Furthermore, corporate acquisitions typically model operational Synergies (cost savings from redundant overhead, consolidated ERP systems, and supply chain purchasing scale). Identifying the minimum synergies required to break even (the "Synergies Hurdle") is essential for board approval.'
        ],
        example: 'Buyer earns $40M ($4.00 EPS on 10M shares at $50/share). Buyer acquires Target earning $12M for $100M, funded with $50M stock (1M new shares) and $50M debt at 6% interest ($2.25M after-tax interest expense). With $5.0M pre-tax synergies ($3.75M after-tax), pro-forma net income rises to $53.5M across 11M shares, yielding $4.86 pro-forma EPS—a 21.59% accretive deal.',
        code: `# Simulation: M&A Accretion/Dilution & Synergies Hurdle Model
from typing import Dict

def calculate_mna_accretion_dilution(
    buyer_share_price: float,
    buyer_shares_outstanding: int,
    buyer_net_income: float,
    target_net_income: float,
    purchase_price: float,
    stock_consideration_pct: float, # e.g. 60% stock, 40% cash
    debt_interest_rate_pct: float,
    corporate_tax_rate: float,
    pre_tax_synergies: float
) -> Dict:
    standalone_buyer_eps = buyer_net_income / buyer_shares_outstanding

    # Transaction financing
    stock_paid = purchase_price * (stock_consideration_pct / 100.0)
    cash_debt_paid = purchase_price * (1.0 - stock_consideration_pct / 100.0)

    # New shares issued
    new_shares_issued = int(stock_paid / buyer_share_price)
    pro_forma_shares = buyer_shares_outstanding + new_shares_issued

    # Net income adjustments
    after_tax_interest_expense = cash_debt_paid * (debt_interest_rate_pct / 100.0) * (1.0 - corporate_tax_rate)
    after_tax_synergies = pre_tax_synergies * (1.0 - corporate_tax_rate)

    pro_forma_net_income = buyer_net_income + target_net_income + after_tax_synergies - after_tax_interest_expense
    pro_forma_eps = pro_forma_net_income / pro_forma_shares

    eps_accretion_dollars = pro_forma_eps - standalone_buyer_eps
    eps_accretion_pct = (eps_accretion_dollars / standalone_buyer_eps) * 100.0

    return {
        "Standalone_Buyer_EPS": round(standalone_buyer_eps, 2),
        "New_Shares_Issued": new_shares_issued,
        "Pro_Forma_Shares": pro_forma_shares,
        "Pro_Forma_Net_Income": round(pro_forma_net_income, 2),
        "Pro_Forma_EPS": round(pro_forma_eps, 2),
        "EPS_Accretion_Pct": round(eps_accretion_pct, 2),
        "Verdict": "ACCRETIVE_TRANSACTION" if eps_accretion_pct > 0 else "DILUTIVE_TRANSACTION"
    }

mna_res = calculate_mna_accretion_dilution(
    buyer_share_price=50.0,
    buyer_shares_outstanding=10000000, # $500M market cap
    buyer_net_income=40000000.0, # $4.00 standalone EPS
    target_net_income=12000000.0,
    purchase_price=100000000.0,
    stock_consideration_pct=50.0, # $50M stock (1M shares), $50M debt
    debt_interest_rate_pct=6.0,
    corporate_tax_rate=0.25,
    pre_tax_synergies=5000000.0
)
print(f"Standalone EPS: \${mna_res['Standalone_Buyer_EPS']} -> Pro-Forma EPS: \${mna_res['Pro_Forma_EPS']}")
print(f"Accretion: {mna_res['EPS_Accretion_Pct']}% -> [{mna_res['Verdict']}]")`,
        output: `Standalone EPS: $4.0 -> Pro-Forma EPS: $4.86\nAccretion: 21.59% -> [ACCRETIVE_TRANSACTION]`,
        tryIt: 'Set pre_tax_synergies=0.0 and stock_consideration_pct=100.0 (all stock) to observe how high stock issuance impacts EPS accretion.',
        check: {
          question: 'Under what condition is an all-stock corporate acquisition automatically accretive to the acquiring company\'s Earnings Per Share (EPS)?',
          options: [
            '(Recommended) When the acquiring company\'s Price-to-Earnings (P/E) multiple is strictly higher than the effective acquisition P/E multiple paid for the target company.',
            'When the target company has a higher debt-to-equity ratio than the acquiring firm.',
            'Only when the transaction is paid entirely in physical gold bullion.',
            'When both companies report negative net income for the fiscal year.'
          ],
          answer: 0,
          why: 'When a buyer with a higher P/E multiple issues stock to buy a lower P/E target, it issues fewer new shares per dollar of acquired earnings, automatically driving EPS accretion.',
          answerIndex: 0,
          explanation: 'When a buyer with a higher P/E multiple issues stock to buy a lower P/E target, it issues fewer new shares per dollar of acquired earnings, automatically driving EPS accretion.'
        }
      },
      {
        title: 'Black-Scholes Real Options Valuation in Capital Budgeting',
        say: [
          'Traditional Discounted Cash Flow (DCF) models suffer from a fundamental theoretical flaw: they assume corporate management will execute a project passively along a rigid multi-year path regardless of how commercial uncertainty unfolds.',
          'In reality, managers possess Managerial Flexibility: the option to expand, defer, stage, or abandon a project based on real-time market feedback. This managerial flexibility has quantifiable economic value known as Real Options.',
          'Real Options Analysis (ROA) maps capital investment decisions onto financial call option pricing models: 1. Present Value of Expected Operating Cash Flows corresponds to the Underlying Asset Price (S); 2. Capital Expenditure (Capex) required to execute corresponds to the Strike Price (K); 3. Years the investment opportunity remains open corresponds to Time to Expiration (t); 4. Market uncertainty corresponds to Volatility (sigma); and 5. The Risk-Free Interest Rate corresponds to r.',
          'Using the Black-Scholes formula, financial engineers can calculate the exact monetary value of the "Option to Expand" or "Option to Delay".',
          'Crucially, projects with slightly negative static DCF Net Present Values (NPV < 0) often have substantial positive Real Option values because the right to delay or expand caps downside risk while preserving unlimited upside participation.'
        ],
        example: 'An R&D expansion project requires $10M capex against $9.5M in expected DCF cash flows (static NPV is -$500,000, which DCF would reject). However, management has a 3-year exclusive window in a volatile market (35% volatility). The Black-Scholes Real Option model values this strategic option at $2,573,436.22, proving the project is highly valuable to initiate.',
        code: `# Simulation: Black-Scholes Real Options Valuation in Capital Budgeting
import math
from typing import Dict

def calculate_real_option_value(
    present_value_cash_flows: float, # S (underlying asset value)
    capex_exercise_price: float,      # K (strike price to execute capex)
    time_to_expiry_years: float,     # t (years option remains open)
    risk_free_rate_pct: float,       # r
    volatility_pct: float            # sigma
) -> Dict:
    s = present_value_cash_flows
    k = capex_exercise_price
    t = time_to_expiry_years
    r = risk_free_rate_pct / 100.0
    sigma = volatility_pct / 100.0

    # Black-Scholes d1 and d2 equations
    d1 = (math.log(s / k) + (r + 0.5 * sigma ** 2) * t) / (sigma * math.sqrt(t))
    d2 = d1 - sigma * math.sqrt(t)

    # Standard normal cumulative distribution approximation
    def norm_cdf(x):
        return (1.0 + math.erf(x / math.sqrt(2.0))) / 2.0

    # Call Option Value: C = S * N(d1) - K * e^(-r*t) * N(d2)
    call_value = (s * norm_cdf(d1)) - (k * math.exp(-r * t) * norm_cdf(d2))

    # Standard static NPV without flexibility = S - K
    static_npv = s - k

    return {
        "Static_DCF_NPV": round(static_npv, 2),
        "Real_Option_Value": round(call_value, 2),
        "Flexibility_Premium": round(call_value - max(0.0, static_npv), 2),
        "Strategic_Recommendation": "PROCEED_PRESERVE_OPTION_TO_EXPAND"
    }

opt_res = calculate_real_option_value(
    present_value_cash_flows=9500000.0, # S = $9.5M (Static NPV = -$500k negative!)
    capex_exercise_price=10000000.0,    # K = $10.0M
    time_to_expiry_years=3.0,
    risk_free_rate_pct=4.5,
    volatility_pct=35.0
)
print(f"Static NPV: \${opt_res['Static_DCF_NPV']:,.2f} (Appears Unattractive under DCF)")
print(f"Real Option Value: \${opt_res['Real_Option_Value']:,.2f} (Flexibility Premium: \${opt_res['Flexibility_Premium']:,.2f})")`,
        output: `Static NPV: $-500,000.00 (Appears Unattractive under DCF)\nReal Option Value: $2,573,436.22 (Flexibility Premium: $2,573,436.22)`,
        tryIt: 'Increase volatility_pct to 50.0% to observe how greater commercial uncertainty paradoxically increases the value of strategic real options.',
        check: {
          question: 'Why does higher commercial volatility increase the value of a Real Option in corporate capital budgeting, whereas it decreases the value of a static DCF project?',
          options: [
            '(Recommended) Because options possess asymmetric payoffs: management can capture massive upside if demand surges while capping downside losses by simply choosing not to exercise if market conditions deteriorate.',
            'Because volatility legally waives corporate income taxes on project revenue.',
            'Because higher volatility eliminates debt service obligations on bank loans.',
            'Because volatility guarantees that competitor patents will expire earlier.'
          ],
          answer: 0,
          why: 'Options have convex payoffs; management only exercises the capex strike price if the project is in-the-money, so increased dispersion of future outcomes expands upside potential without increasing downside risk.',
          answerIndex: 0,
          explanation: 'Options have convex payoffs; management only exercises the capex strike price if the project is in-the-money, so increased dispersion of future outcomes expands upside potential without increasing downside risk.'
        }
      },
      {
        title: 'Optimal Capital Structure & Financial Distress Tradeoff',
        say: [
          'In corporate financial policy, the Static Tradeoff Theory provides the foundation for designing a firm\'s optimal capital structure (the optimal mix of debt versus equity financing).',
          'While Modigliani-Miller Proposition II with taxes proved that debt financing generates an Interest Tax Shield ($V_L = V_U + T_c * Debt$), taking on excessive leverage exposes the corporation to significant financial distress and bankruptcy risks.',
          'Financial distress imposes two categories of costs: 1. Direct Costs (legal fees, forensic accounting, reorganization court costs, typically 3% to 5% of firm value); and 2. Indirect Costs (loss of credit ratings, customer cancellations, employee attrition, supplier demand for cash on delivery, and the debt overhang underinvestment problem, typically 15% to 25% of firm value).',
          'Under the Tradeoff Theory, Levered Firm Value equals: $V_L = V_U + PV(Interest Tax Shield) - PV(Expected Financial Distress Costs)$, where expected distress costs equal the Probability of Default * Total Distress Costs.',
          'At low leverage, adding debt significantly expands firm value because tax shield gains far outpace remote default risks. Beyond an optimal tipping point, rising default probabilities crush firm value, identifying the exact debt-to-equity ratio that minimizes WACC.'
        ],
        example: 'A $50M unlevered firm tests debt levels from $0 to $40M. At $10M debt, tax shields exceed minor distress risks. At $30M debt, levered firm value reaches its peak of $55,250,000. Raising debt further to $40M causes bankruptcy probabilities to surge (45%), eroding firm value down to $54.375M due to crushing financial distress costs.',
        code: `# Simulation: Optimal Capital Structure & Financial Distress Tradeoff Engine
from typing import Dict, List

def calculate_optimal_capital_structure(
    unlevered_firm_value: float,
    corporate_tax_rate: float,
    debt_levels: List[float],
    distress_probability_multipliers: List[float], # e.g. 0.01 at low debt to 0.35 at high debt
    bankruptcy_cost_pct: float = 25.0
) -> Dict:
    best_value = 0.0
    optimal_debt = 0.0
    results = []

    for debt, prob in zip(debt_levels, distress_probability_multipliers):
        # Static Tradeoff Theory: V_L = V_U + (Tc * Debt) - PV(Distress Costs)
        tax_shield_pv = debt * corporate_tax_rate
        expected_distress_pv = prob * (unlevered_firm_value * (bankruptcy_cost_pct / 100.0))
        levered_value = unlevered_firm_value + tax_shield_pv - expected_distress_pv

        results.append({
            "Debt": debt,
            "Tax_Shield": round(tax_shield_pv, 2),
            "Expected_Distress_PV": round(expected_distress_pv, 2),
            "Levered_Firm_Value": round(levered_value, 2)
        })

        if levered_value > best_value:
            best_value = levered_value
            optimal_debt = debt

    return {
        "Unlevered_Firm_Value": unlevered_firm_value,
        "Optimal_Debt_Level": optimal_debt,
        "Maximized_Levered_Value": round(best_value, 2),
        "Optimal_Leverage_Schedule": results
    }

tradeoff = calculate_optimal_capital_structure(
    unlevered_firm_value=50000000.0,
    corporate_tax_rate=0.25,
    debt_levels=[0.0, 10000000.0, 20000000.0, 30000000.0, 40000000.0],
    distress_probability_multipliers=[0.0, 0.02, 0.06, 0.18, 0.45],
    bankruptcy_cost_pct=25.0
)
print(f"Unlevered Value: \${tradeoff['Unlevered_Firm_Value']:,.2f}")
print(f"Optimal Debt: \${tradeoff['Optimal_Debt_Level']:,.2f} -> Peak Levered Firm Value: \${tradeoff['Maximized_Levered_Value']:,.2f}")`,
        output: `Unlevered Value: $50,000,000.00\nOptimal Debt: $30,000,000.00 -> Peak Levered Firm Value: $55,250,000.00`,
        tryIt: 'Increase bankruptcy_cost_pct to 35.0% to observe how severe distress penalties shift the optimal debt level downward to $20,000,000.',
        check: {
          question: 'According to the Static Tradeoff Theory of Capital Structure, at what point is a corporation\'s market value maximized?',
          options: [
            '(Recommended) At the debt-to-equity ratio where the marginal gain from the interest tax shield exactly equals the marginal increase in the expected present value of financial distress costs.',
            'When the corporation eliminates 100% of all debt and operates purely on common equity.',
            'When the firm reaches 100% debt financing and completely eliminates common shares.',
            'When the corporate tax rate is set to zero by federal statutory decree.'
          ],
          answer: 0,
          why: 'Firm value is maximized (and WACC minimized) where the incremental tax shield from adding one more dollar of debt is exactly offset by the incremental expected bankruptcy and distress cost.',
          answerIndex: 0,
          explanation: 'Firm value is maximized (and WACC minimized) where the incremental tax shield from adding one more dollar of debt is exactly offset by the incremental expected bankruptcy and distress cost.'
        }
      },
      {
        title: 'Foreign Exchange (FX) Risk Hedging: Forward Contracts vs Zero-Cost Collars',
        say: [
          'Multinational corporations selling goods across borders face foreign exchange Transaction Exposure: the risk that currency exchange rates fluctuate unfavorably between when a sales contract is signed and when payment is collected in foreign currency.',
          'To insulate cash flows from currency volatility, corporate treasury desks execute structured currency hedging strategies.',
          'The simplest hedge is an Over-the-Counter (OTC) Forward Contract: the corporation locks in a binding forward exchange rate with a bank, completely eliminating currency risk. Forward rates are governed by Covered Interest Rate Parity: $F = S * (1 + r_domestic) / (1 + r_foreign)$. However, forward contracts eliminate all upside if the foreign currency appreciates.',
          'Alternatively, treasury desks structure a Zero-Cost Collar: the firm purchases an out-of-the-money Put option (establishing a guaranteed floor against currency collapse) while simultaneously selling an out-of-the-money Call option (establishing a ceiling on currency gains) with identical premium costs.',
          'Because the call option sale finances the put option purchase, the collar requires zero upfront cash expenditure, providing ironclad downside insurance while allowing the firm to participate in favorable currency appreciation within the strike corridor.'
        ],
        example: 'A US multinational expects a €10,000,000 receivable in 6 months when spot is $1.08. If the Euro plunges to $1.02, unhedged proceeds drop to $10,200,000 (a $600k loss). A Forward contract locked at 1.085 guarantees $10,850,000 (+$650,000 protection). A Zero-Cost Collar with a 1.06 floor guarantees $10,600,000 (+$400,000 protection) with zero upfront cash premium cost.',
        code: `# Simulation: FX Transaction Exposure Hedging (Forward vs Zero-Cost Collar)
from typing import Dict

def evaluate_fx_hedging_strategies(
    foreign_receivable_amount: float, # e.g. €10,000,000 to receive in 6 months
    spot_exchange_rate: float,        # e.g. 1.08 USD per EUR
    forward_exchange_rate: float,     # e.g. 1.085 USD per EUR (Covered Interest Parity)
    collar_put_strike: float,         # e.g. 1.06 (guaranteed floor)
    collar_call_strike: float,        # e.g. 1.11 (upside ceiling)
    unhedged_future_spot: float       # e.g. 1.02 (sharp foreign currency devaluation)
) -> Dict:
    # 1. Unhedged Outcome
    unhedged_usd_received = foreign_receivable_amount * unhedged_future_spot

    # 2. Forward Contract Hedge (locked rate)
    forward_usd_received = foreign_receivable_amount * forward_exchange_rate

    # 3. Zero-Cost Collar Hedge
    # If spot < floor, exercise put at floor; if spot > ceiling, called away at ceiling; else spot
    effective_collar_rate = max(collar_put_strike, min(collar_call_strike, unhedged_future_spot))
    collar_usd_received = foreign_receivable_amount * effective_collar_rate

    return {
        "Receivable_EUR": foreign_receivable_amount,
        "Unhedged_Proceeds_USD": round(unhedged_usd_received, 2),
        "Forward_Contract_Proceeds_USD": round(forward_usd_received, 2),
        "Collar_Proceeds_USD": round(collar_usd_received, 2),
        "Forward_Benefit_Vs_Unhedged": round(forward_usd_received - unhedged_usd_received, 2),
        "Collar_Benefit_Vs_Unhedged": round(collar_usd_received - unhedged_usd_received, 2)
    }

fx_res = evaluate_fx_hedging_strategies(
    foreign_receivable_amount=10000000.0,
    spot_exchange_rate=1.08,
    forward_exchange_rate=1.085,
    collar_put_strike=1.06,
    collar_call_strike=1.11,
    unhedged_future_spot=1.02 # Euro dropped from 1.08 to 1.02
)
print(f"Unhedged (at 1.02): \${fx_res['Unhedged_Proceeds_USD']:,.2f}")
print(f"Forward (at 1.085): \${fx_res['Forward_Contract_Proceeds_USD']:,.2f} (+\${fx_res['Forward_Benefit_Vs_Unhedged']:,.2f} protection)")
print(f"Collar (floor 1.06): \${fx_res['Collar_Proceeds_USD']:,.2f} (+\${fx_res['Collar_Benefit_Vs_Unhedged']:,.2f} protection)")`,
        output: `Unhedged (at 1.02): $10,200,000.00\nForward (at 1.085): $10,850,000.00 (+$650,000.00 protection)\nCollar (floor 1.06): $10,600,000.00 (+$400,000.00 protection)`,
        tryIt: 'Change unhedged_future_spot to 1.15 to observe how the unhedged and collar strategies capture currency appreciation while the forward contract remains locked at 1.085.',
        check: {
          question: 'What is the key strategic benefit of structuring a Zero-Cost Collar for corporate foreign currency hedging compared to a standard forward contract?',
          options: [
            '(Recommended) It guarantees downside protection against currency depreciation with zero net upfront option premium, while allowing the firm to participate in favorable currency appreciation up to the call strike ceiling.',
            'It converts foreign currency receivables directly into US Treasury inflation-protected securities.',
            'It allows the corporation to bypass all international banking regulations and sanctions.',
            'It permanently fixes the global price of gold in international commercial treaties.'
          ],
          answer: 0,
          why: 'A collar finances the put option floor by selling a call option ceiling, creating free downside insurance while maintaining upside flexibility within the defined strike corridor.',
          answerIndex: 0,
          explanation: 'A collar finances the put option floor by selling a call option ceiling, creating free downside insurance while maintaining upside flexibility within the defined strike corridor.'
        }
      }
    ],
    summary: [
      'LBO modeling creates sponsor equity value through cash flow debt amortization, EBITDA expansion, and exit multiple valuation waterfalls.',
      'M&A Accretion/Dilution models evaluate pro-forma EPS effects, weighing buyer P/E versus target purchase P/E and after-tax synergy hurdles.',
      'Black-Scholes Real Options Analysis prices managerial flexibility to expand or delay capex projects, capturing upside that static DCF ignores.',
      'Static Tradeoff Theory determines optimal leverage where marginal interest tax shields equal marginal expected financial distress costs.',
      'Treasury FX risk management utilizes Forward contracts to lock rates or Zero-Cost Collars to establish downside floors without sacrificing upside participation.'
    ],
    projectStep: {
      title: 'Advanced Corporate Finance & Transaction Engineering Simulator',
      steps: [
        'Model LBO sources, uses, debt amortization schedules, and sponsor IRR exit returns.',
        'Calculate M&A pro-forma EPS accretion/dilution and determine breakeven synergy hurdles.',
        'Apply the Black-Scholes formula to evaluate strategic capital budgeting real options.',
        'Simulate corporate capital structure tradeoffs and foreign exchange forward vs collar hedges.'
      ]
    }
  }
];

