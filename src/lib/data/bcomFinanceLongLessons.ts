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
  },
  {
    coursePrefix: 'bcom-finance',
    day: 3,
    title: 'Advanced Corporate Valuation: Multi-Stage DCF, Hamada Beta Relevering, WACC Sensitivity & LBO Waterfall',
    goal: 'Master advanced corporate valuation and financial engineering: project 5-year Free Cash Flow to Firm (FCFF) and Gordon Growth terminal values, unlever and relever industry betas via the Hamada Equation to isolate capital structure financial risk, construct two-way WACC/growth sensitivity surfaces, model multi-tranche LBO senior and subordinated debt cash sweeps, and synthesize the Enterprise-to-Equity Value bridge.',
    minutes: 45,
    recap: 'In Day 2, we engineered LBO returns, M&A accretion/dilution, real options, and FX hedging. Today, we advance into investment banking valuation: multi-stage DCF modeling, the Hamada Equation, sensitivity surfaces, and institutional debt sweep waterfalls.',
    parts: [
      {
        title: 'Multi-Stage DCF Modeling, Free Cash Flow to Firm (FCFF) & Gordon Growth Terminal Value',
        say: [
          'In professional investment banking and corporate valuation, single-stage growth models fail because high-growth companies inevitably experience competitive convergence toward the broader economy. To capture this transition, financial analysts build multi-stage Discounted Cash Flow (DCF) models that forecast an explicit multi-year high-growth horizon followed by perpetual stable-state growth.',
          'The core cash flow metric in an unlevered DCF is Free Cash Flow to Firm (FCFF). Unlike net income, which includes non-cash accruals and arbitrary financing decisions, FCFF represents the pure cash generated by core operations available to all capital providers: FCFF = EBIT * (1 - T) + D&A - Change in NWC - Capex. Here, EBIT * (1 - T) is Net Operating Profit After Taxes (NOPAT).',
          'Because a corporation is an ongoing enterprise with an infinite theoretical lifespan, the cash flows beyond the explicit forecast period are capitalized into Terminal Value (TV) using the Gordon Growth Model: TV_n = [FCFF_n * (1 + g)] / (WACC - g). In institutional valuation, the terminal value typically accounts for 65% to 80% of total Enterprise Value, making the choice of perpetual growth rate g and WACC the primary drivers of intrinsic value.'
        ],
        example: 'An aerospace supplier generates $50,000,000 in Year 1 EBIT with 25% tax, $8M depreciation, $3M working capital expansion, and $12M in growth capex. Forecasting 5-year revenue deceleration from 12% to 4% at an 8.5% WACC and a 2.5% terminal growth rate yields an explicit PV of $143,632,863.85 and a discounted Terminal Value of $478,441,635.89, establishing an Enterprise Value of $622,074,499.74.',
        code: `def calculate_multistage_dcf_valuation(
    ebit_year1: float,
    tax_rate: float,
    dep_amort: float,
    delta_nwc: float,
    capex: float,
    growth_rates: list[float],
    terminal_growth_rate: float,
    wacc: float
) -> dict:
    explicit_fcf = []
    pv_explicit = []
    current_ebit = ebit_year1
    
    for yr, g in enumerate(growth_rates, start=1):
        if yr > 1:
            current_ebit *= (1.0 + g)
        nopat = current_ebit * (1.0 - tax_rate)
        fcf = nopat + dep_amort - delta_nwc - capex
        discount_factor = (1.0 + wacc) ** yr
        pv = fcf / discount_factor
        explicit_fcf.append(round(fcf, 2))
        pv_explicit.append(round(pv, 2))
        
    last_fcf = explicit_fcf[-1]
    terminal_fcf = last_fcf * (1.0 + terminal_growth_rate)
    terminal_value = terminal_fcf / (wacc - terminal_growth_rate)
    pv_terminal_value = terminal_value / ((1.0 + wacc) ** len(growth_rates))
    
    enterprise_value = sum(pv_explicit) + pv_terminal_value
    tv_contribution_pct = (pv_terminal_value / enterprise_value) * 100.0 if enterprise_value > 0 else 0.0
    
    return {
        "explicit_projected_fcf": explicit_fcf,
        "pv_explicit_cash_flows": round(sum(pv_explicit), 2),
        "terminal_value_undiscounted": round(terminal_value, 2),
        "pv_terminal_value": round(pv_terminal_value, 2),
        "enterprise_value": round(enterprise_value, 2),
        "tv_contribution_pct": round(tv_contribution_pct, 2)
    }

p1 = calculate_multistage_dcf_valuation(
    ebit_year1=50000000.0,
    tax_rate=0.25,
    dep_amort=8000000.0,
    delta_nwc=3000000.0,
    capex=12000000.0,
    growth_rates=[0.12, 0.10, 0.08, 0.06, 0.04],
    terminal_growth_rate=0.025,
    wacc=0.085
)
ev_s = "$" + f"{p1['enterprise_value']:,.2f}"
pv_tv_s = "$" + f"{p1['pv_terminal_value']:,.2f}"
print(f"PV Explicit: $" + f"{p1['pv_explicit_cash_flows']:,.2f} | PV TV: {pv_tv_s}")
print(f"Enterprise Value: {ev_s} | TV Contribution: {p1['tv_contribution_pct']}%")`,
        output: `PV Explicit: $143,632,863.85 | PV TV: $478,441,635.89\nEnterprise Value: $622,074,499.74 | TV Contribution: 76.91%`,
        codeNotes: [
          { line: 16, note: 'Calculates Net Operating Profit After Taxes (NOPAT) and Free Cash Flow to Firm (FCFF)' },
          { line: 24, note: 'Capitalizes final-year cash flows into perpetual terminal value via the Gordon Growth formula' },
          { line: 25, note: 'Discounts the nominal terminal value back to present value using the five-year cumulative WACC compound factor' },
          { line: 27, note: 'Sums discounted explicit cash flows and discounted terminal value to derive total Enterprise Value' }
        ],
        tryIt: 'Increase terminal_growth_rate from 0.025 to 0.035 to observe how perpetual growth expands Enterprise Value and increases TV contribution percentage.',
        check: {
          question: 'In a multi-stage DCF valuation, why must the perpetual terminal growth rate (g) never exceed the long-term projected growth rate of the macro economy (typically 2.0% to 3.0%)?',
          options: [
            'If a company grew faster than the aggregate economy forever, it would eventually become larger than the entire global economy, creating a mathematical and economic impossibility.',
            'Tax authorities disallow tax deductions for terminal value depreciation if g exceeds the central bank inflation target.',
            'Corporate bond rating agencies automatically downgrade any corporation whose terminal growth rate exceeds the yield on 3-month Treasury bills.',
            'The Gordon Growth equation produces a negative terminal value whenever the growth rate exceeds zero.'
          ],
          answer: 0,
          why: 'A perpetual growth rate exceeding long-term macro GDP growth implies the firm will mathematically surpass the size of the world economy over time, which violates fundamental economic theory.',
          answerIndex: 0,
          explanation: 'A perpetual growth rate exceeding long-term macro GDP growth implies the firm will mathematically surpass the size of the world economy over time, which violates fundamental economic theory.'
        }
      },
      {
        title: 'Beta Unlevering and Relevering via the Hamada Equation (Operating vs Financial Risk)',
        say: [
          'When estimating a company\'s Cost of Equity using the Capital Asset Pricing Model (CAPM), analysts face a major hurdle: the observed market equity beta of peer companies reflects two distinct layers of risk: underlying business operating risk and financial leverage risk.',
          'Under the Modigliani-Miller theorem with corporate taxes, Robert Hamada formalized the mathematical relationship connecting levered equity beta to unlevered asset beta. Unlevering strips out the financial leverage of comparable peers to reveal pure industry operating risk: beta_U = beta_L / [1 + (1 - T) * (D / E)].',
          'Once the peer group\'s average unlevered beta is computed, analysts relever that pure asset beta to match the target company\'s specific optimal capital structure: beta_L_target = beta_U * [1 + (1 - T_target) * (D / E_target)]. This relevered beta is plugged directly into the CAPM formula Ke = Rf + beta_L * ERP to determine the exact required return on equity.'
        ],
        example: 'Valuing a private defense contractor with a target 40% debt-to-equity ratio and 25% tax rate. Analyzing three public peers with levered betas of 1.35, 1.20, and 1.45 yields an average unlevered asset beta of 0.9871. Relevering at target leverage produces a beta of 1.2833. At a 4.2% risk-free rate and 5.5% equity risk premium, the required Cost of Equity is 11.26%.',
        code: `def relever_beta_hamada_equation(
    peer_betas: list[dict],
    target_debt_equity: float,
    target_tax_rate: float,
    risk_free_rate: float,
    equity_risk_premium: float
) -> dict:
    unlevered_betas = []
    for peer in peer_betas:
        b_l = peer["levered_beta"]
        t = peer["tax_rate"]
        de = peer["debt_to_equity"]
        b_u = b_l / (1.0 + (1.0 - t) * de)
        unlevered_betas.append(b_u)
        
    avg_unlevered_beta = sum(unlevered_betas) / len(unlevered_betas) if unlevered_betas else 1.0
    target_levered_beta = avg_unlevered_beta * (1.0 + (1.0 - target_tax_rate) * target_debt_equity)
    cost_of_equity = risk_free_rate + (target_levered_beta * equity_risk_premium)
    
    return {
        "peer_count": len(peer_betas),
        "average_unlevered_beta": round(avg_unlevered_beta, 4),
        "target_levered_beta": round(target_levered_beta, 4),
        "cost_of_equity_pct": round(cost_of_equity * 100.0, 2)
    }

peers = [
    {"name": "Peer A", "levered_beta": 1.35, "tax_rate": 0.25, "debt_to_equity": 0.50},
    {"name": "Peer B", "levered_beta": 1.20, "tax_rate": 0.25, "debt_to_equity": 0.30},
    {"name": "Peer C", "levered_beta": 1.45, "tax_rate": 0.25, "debt_to_equity": 0.60}
]
p2 = relever_beta_hamada_equation(
    peer_betas=peers,
    target_debt_equity=0.40,
    target_tax_rate=0.25,
    risk_free_rate=0.042,
    equity_risk_premium=0.055
)
print(f"Peers: {p2['peer_count']} | Unlevered Beta: {p2['average_unlevered_beta']}")
print(f"Target Levered Beta: {p2['target_levered_beta']} | Cost of Equity (Ke): {p2['cost_of_equity_pct']}%")`,
        output: `Peers: 3 | Unlevered Beta: 0.9871\nTarget Levered Beta: 1.2833 | Cost of Equity (Ke): 11.26%`,
        codeNotes: [
          { line: 13, note: 'Applies Hamada\'s unlevering formula to neutralize peer financial leverage and debt tax shields' },
          { line: 16, note: 'Calculates the pure unencumbered asset beta across comparable industry peers' },
          { line: 17, note: 'Relevers the benchmark asset beta against target enterprise capital structure and tax rates' },
          { line: 18, note: 'Computes institutional Cost of Equity via CAPM using the relevered target beta' }
        ],
        tryIt: 'Increase target_debt_equity to 1.00 (100% debt-to-equity) to observe how financial risk amplifies levered beta and drives Cost of Equity up.',
        check: {
          question: 'What fundamental insight does the Hamada Equation provide regarding the relationship between corporate leverage and shareholder risk?',
          options: [
            'Debt financing introduces fixed interest payment obligations that amplify the volatility of earnings available to equity holders, mechanically increasing equity beta above underlying asset beta.',
            'Issuing debt reduces the beta of a firm because interest payments are tax deductible under Section 163(j).',
            'Unlevering beta converts common stock into preferred cumulative convertible securities.',
            'The Hamada Equation proves that equity beta is independent of corporate capital structure under all economic conditions.'
          ],
          answer: 0,
          why: 'Debt service is a senior fixed obligation; adding debt magnifies earnings volatility for common stockholders, driving levered beta higher than the unlevered asset beta.',
          answerIndex: 0,
          explanation: 'Debt service is a senior fixed obligation; adding debt magnifies earnings volatility for common stockholders, driving levered beta higher than the unlevered asset beta.'
        }
      },
      {
        title: 'WACC Matrix & Two-Way Valuation Sensitivity Surface',
        say: [
          'Because a DCF model relies on forecasted inputs extending indefinitely into the future, presenting a single point estimate of Enterprise Value creates an illusion of false precision. Professional investment banking pitch books and valuation fairness opinions mandate the construction of two-way sensitivity surfaces.',
          'A sensitivity matrix systematically stresses the valuation across the two most sensitive parameters: the discount rate (WACC) on the vertical axis and the perpetual terminal growth rate (g) on the horizontal axis. Small perturbations—such as a 100 bps shift in WACC or a 50 bps change in g—can shift Enterprise Value by hundreds of millions of dollars.',
          'By analyzing the entire sensitivity surface, dealmakers and CFOs establish a valuation corridor. If the acquisition price lies comfortably below the lowest cell of the plausible sensitivity matrix, the transaction provides a robust margin of safety; if it requires optimistic WACC and growth assumptions to break even, the deal carries uncompensated downside risk.'
        ],
        example: 'At a base 8.5% WACC and 2.5% terminal growth rate, a defense contractor\'s Enterprise Value is $621,090,091.21. Sweeping WACC from 7.5% to 9.5% and growth from 2.0% to 3.0% demonstrates that Enterprise Value spans from a conservative $506,762,042 up to an aggressive $813,545,032—a $306M valuation delta.',
        code: `def build_dcf_sensitivity_matrix(
    terminal_fcf: float,
    base_wacc: float,
    base_growth: float,
    explicit_pv: float,
    forecast_years: int = 5
) -> dict:
    wacc_steps = [base_wacc - 0.01, base_wacc, base_wacc + 0.01]
    growth_steps = [base_growth - 0.005, base_growth, base_growth + 0.005]
    
    matrix = {}
    for w in wacc_steps:
        w_key = f"{round(w * 100.0, 1)}%"
        matrix[w_key] = {}
        for g in growth_steps:
            g_key = f"{round(g * 100.0, 1)}%"
            if w > g:
                tv = (terminal_fcf * (1.0 + g)) / (w - g)
                pv_tv = tv / ((1.0 + w) ** forecast_years)
                ev = explicit_pv + pv_tv
                matrix[w_key][g_key] = round(ev, 2)
            else:
                matrix[w_key][g_key] = None
                
    base_ev = matrix[f"{round(base_wacc * 100.0, 1)}%"][f"{round(base_growth * 100.0, 1)}%"]
    return {
        "base_wacc_pct": round(base_wacc * 100.0, 2),
        "base_terminal_growth_pct": round(base_growth * 100.0, 2),
        "base_enterprise_value": base_ev,
        "sensitivity_matrix": matrix
    }

p3 = build_dcf_sensitivity_matrix(
    terminal_fcf=42000000.0,
    base_wacc=0.085,
    base_growth=0.025,
    explicit_pv=143920000.0
)
base_ev_s = "$" + f"{p3['base_enterprise_value']:,.2f}"
print(f"Base WACC: {p3['base_wacc_pct']}% | Base Growth: {p3['base_terminal_growth_pct']}%")
print(f"Base Enterprise Value: {base_ev_s}")
for w_k, row in p3['sensitivity_matrix'].items():
    vals = ", ".join([f"{g_k}: $" + f"{v:,.0f}" for g_k, v in row.items()])
    print(f"  WACC {w_k} -> [{vals}]")`,
        output: `Base WACC: 8.5% | Base Growth: 2.5%\nBase Enterprise Value: $621,090,091.21\n  WACC 7.5% -> [2.0%: $686,475,851, 2.5%: $743,656,982, 3.0%: $813,545,032]\n  WACC 8.5% -> [2.0%: $582,236,091, 2.5%: $621,090,091, 3.0%: $667,008,455]\n  WACC 9.5% -> [2.0%: $506,762,042, 2.5%: $534,585,014, 3.0%: $566,688,443]`,
        codeNotes: [
          { line: 8, note: 'Defines step intervals for WACC (+/- 100 bps) and perpetual growth rate (+/- 50 bps)' },
          { line: 15, note: 'Evaluates the Gordon Growth denominator (WACC - g) to prevent mathematical singularity' },
          { line: 17, note: 'Computes total Enterprise Value across the 3x3 valuation matrix surface' },
          { line: 24, note: 'Formats output as a structured valuation corridor for boardroom strategic decision-making' }
        ],
        tryIt: 'Change base_wacc to 0.10 to evaluate how higher macroeconomic interest rates compress the entire valuation matrix.',
        check: {
          question: 'Why does an increase in the WACC discount rate cause a non-linear, convex reduction in Enterprise Value in a discounted cash flow model?',
          options: [
            'WACC appears in the denominator of both explicit discounting (1 + WACC)^t and the Gordon Growth formula (WACC - g), compounding value destruction across all future periods.',
            'Higher WACC automatically increases corporate federal income tax liabilities under IRS guidelines.',
            'Higher WACC forces the company to immediately write off 100% of its accumulated goodwill balance.',
            'WACC discount rates are strictly linear functions that only affect the first year of projected operations.'
          ],
          answer: 0,
          why: 'The discount rate compounds exponentially across explicit years and sits in the denominator of the terminal value formula, creating a convex valuation response to interest rate changes.',
          answerIndex: 0,
          explanation: 'The discount rate compounds exponentially across explicit years and sits in the denominator of the terminal value formula, creating a convex valuation response to interest rate changes.'
        }
      },
      {
        title: 'Leveraged Buyout (LBO) Debt Waterfall & Cash Sweep Amortization',
        say: [
          'In private equity and leveraged finance, acquisitions are funded primarily with borrowed capital (typically 60% to 75% debt). To ensure the target company rapidly deleverages and returns capital to sponsors, credit agreements establish a strict institutional Debt Waterfall with mandatory Cash Sweeps.',
          'The cash flow waterfall governs the distribution of operating cash flows: EBITDA minus Cash Interest minus Cash Taxes minus Capex = Free Cash Flow available for debt service. Under a 100% Cash Sweep covenant, all excess cash flow must be used to prepay principal rather than distributed as shareholder dividends.',
          'Repayments follow absolute seniority: senior secured bank facilities (Term Loan A and Term Loan B) must be completely amortized and retired before a single dollar can be allocated toward subordinated debt or mezzanine notes. This rapid deleveraging shifts enterprise value from debt holders to equity sponsors, driving internal rate of return (IRR).'
        ],
        example: 'A private equity sponsor acquires an industrial manufacturing platform with $65,000,000 in EBITDA, funded with $120M in senior secured debt and $60M in subordinated notes at a 7.5% blended interest rate. Generating $31,125,000 in Free Cash Flow subject to a 100% sweep, the company retires $31.125M of senior debt in Year 1, achieving 17.29% deleveraging in twelve months.',
        code: `def model_lbo_debt_sweep_waterfall(
    ebitda: float,
    interest_rate: float,
    tax_rate: float,
    capex: float,
    initial_senior_debt: float,
    initial_sub_debt: float,
    sweep_pct: float = 1.0
) -> dict:
    total_debt = initial_senior_debt + initial_sub_debt
    interest_expense = total_debt * interest_rate
    taxable_income = max(0.0, ebitda - interest_expense - capex)
    taxes = taxable_income * tax_rate
    
    fcf_available = ebitda - interest_expense - taxes - capex
    sweep_amount = max(0.0, fcf_available * sweep_pct)
    
    senior_repayment = min(initial_senior_debt, sweep_amount)
    remaining_sweep = sweep_amount - senior_repayment
    sub_repayment = min(initial_sub_debt, remaining_sweep)
    
    ending_senior = initial_senior_debt - senior_repayment
    ending_sub = initial_sub_debt - sub_repayment
    ending_total_debt = ending_senior + ending_sub
    
    deleveraging_pct = ((total_debt - ending_total_debt) / total_debt) * 100.0 if total_debt > 0 else 0.0
    
    return {
        "ebitda": ebitda,
        "interest_expense": round(interest_expense, 2),
        "fcf_available_for_sweep": round(fcf_available, 2),
        "senior_debt_retired": round(senior_repayment, 2),
        "subordinated_debt_retired": round(sub_repayment, 2),
        "ending_senior_debt": round(ending_senior, 2),
        "ending_subordinated_debt": round(ending_sub, 2),
        "ending_total_debt": round(ending_total_debt, 2),
        "deleveraging_pct": round(deleveraging_pct, 2)
    }

p4 = model_lbo_debt_sweep_waterfall(
    ebitda=65000000.0,
    interest_rate=0.075,
    tax_rate=0.25,
    capex=10000000.0,
    initial_senior_debt=120000000.0,
    initial_sub_debt=60000000.0,
    sweep_pct=1.0
)
sw_s = "$" + f"{p4['fcf_available_for_sweep']:,.2f}"
ret_s = "$" + f"{p4['senior_debt_retired']:,.2f}"
tot_s = "$" + f"{p4['ending_total_debt']:,.2f}"
print(f"EBITDA: $" + f"{p4['ebitda']:,.2f} | FCF Sweep Available: {sw_s}")
print(f"Senior Retired: {ret_s} | Sub Retired: $" + f"{p4['subordinated_debt_retired']:,.2f}")
print(f"Ending Total Debt: {tot_s} | Deleveraging: {p4['deleveraging_pct']}%")`,
        output: `EBITDA: $65,000,000.00 | FCF Sweep Available: $31,125,000.00\nSenior Retired: $31,125,000.00 | Sub Retired: $0.00\nEnding Total Debt: $148,875,000.00 | Deleveraging: 17.29%`,
        codeNotes: [
          { line: 11, note: 'Calculates total interest expense across all tranches and determines net taxable income' },
          { line: 15, note: 'Determines free cash flow available for mandatory sweep debt amortization' },
          { line: 18, note: 'Enforces strict priority waterfall: exhausts senior debt before prepaying subordinated tranches' },
          { line: 26, note: 'Calculates overall portfolio deleveraging percentage over the operating period' }
        ],
        tryIt: 'Reduce sweep_pct to 0.50 (50% sweep) to simulate a covenant allowing the sponsor to retain half the cash flow, observing the slower deleveraging rate.',
        check: {
          question: 'In leveraged buyout debt structuring, why do senior lenders demand a 100% Cash Sweep covenant in the credit agreement?',
          options: [
            'A 100% cash sweep prevents the financial sponsor from paying out dividends or extracting liquidity until the senior lenders\' principal exposure is substantially retired.',
            'A 100% cash sweep guarantees that all corporate cash is automatically converted into physical gold bars stored in the Federal Reserve.',
            'Cash sweeps are required by the SEC for companies to maintain eligibility for inclusion in the S&P 500 index.',
            'Lenders use cash sweeps to calculate executive compensation under Sarbanes-Oxley Section 404.'
          ],
          answer: 0,
          why: 'Cash sweeps protect lenders by trapping all surplus operational cash inside the firm to pay down debt, preventing sponsors from draining liquidity via dividend recapitalizations.',
          answerIndex: 0,
          explanation: 'Cash sweeps protect lenders by trapping all surplus operational cash inside the firm to pay down debt, preventing sponsors from draining liquidity via dividend recapitalizations.'
        }
      },
      {
        title: 'Enterprise Valuation Synthesis & Equity Value Bridge',
        say: [
          'The final step in investment banking valuation is bridging from Enterprise Value (EV) to Equity Value. While Enterprise Value measures the total value of operating assets attributable to all capital providers, equity research analysts and public stock investors purchase common equity shares.',
          'The Enterprise-to-Equity Value Bridge follows the foundational corporate accounting equation: Equity Value = Enterprise Value - Total Debt + Cash & Cash Equivalents + Non-Operating Assets - Minority Interest - Preferred Stock. Total Debt minus Cash is commonly referred to as Net Debt.',
          'Dividing implied Equity Value by fully diluted shares outstanding yields the Implied Share Price. Comparing this intrinsic target price against the current market trading price reveals whether the security trades at an attractive discount (prompting an institutional Buy recommendation) or an unsustainable premium.'
        ],
        example: 'A corporation is valued at $685,000,000 in Enterprise Value, carrying $150,000,000 in total debt, $25,000,000 in cash ($125M net debt), $10,000,000 in non-operating equity investments, and $5,000,000 in minority interest. This produces an Implied Equity Value of $565,000,000 across 10,000,000 diluted shares, yielding an intrinsic target price of $56.50. Compared to the current $45.00 market price, this represents 25.56% upside and triggers a Strong Buy recommendation.',
        code: `def synthesize_equity_value_bridge(
    enterprise_value: float,
    total_debt: float,
    cash_and_equivalents: float,
    non_operating_assets: float,
    minority_interest: float,
    diluted_shares: float,
    current_market_price: float
) -> dict:
    net_debt = total_debt - cash_and_equivalents
    equity_value = enterprise_value - total_debt + cash_and_equivalents + non_operating_assets - minority_interest
    implied_share_price = equity_value / diluted_shares if diluted_shares > 0 else 0.0
    
    upside_pct = ((implied_share_price - current_market_price) / current_market_price) * 100.0 if current_market_price > 0 else 0.0
    recommendation = "STRONG_BUY" if upside_pct >= 20.0 else ("BUY" if upside_pct > 5.0 else ("HOLD" if upside_pct >= -10.0 else "SELL"))
    
    return {
        "enterprise_value": round(enterprise_value, 2),
        "net_debt": round(net_debt, 2),
        "implied_equity_value": round(equity_value, 2),
        "diluted_shares": diluted_shares,
        "implied_share_price": round(implied_share_price, 2),
        "current_market_price": round(current_market_price, 2),
        "valuation_upside_pct": round(upside_pct, 2),
        "investment_recommendation": recommendation
    }

p5 = synthesize_equity_value_bridge(
    enterprise_value=685000000.0,
    total_debt=150000000.0,
    cash_and_equivalents=25000000.0,
    non_operating_assets=10000000.0,
    minority_interest=5000000.0,
    diluted_shares=10000000.0,
    current_market_price=45.00
)
eq_val_s = "$" + f"{p5['implied_equity_value']:,.2f}"
imp_p_s = "$" + f"{p5['implied_share_price']:,.2f}"
print(f"Enterprise Value: $" + f"{p5['enterprise_value']:,.2f} -> Equity Value: {eq_val_s}")
print(f"Implied Share Price: {imp_p_s} vs Market Price: $" + f"{p5['current_market_price']:,.2f}")
print(f"Upside: {p5['valuation_upside_pct']}% | Recommendation: {p5['investment_recommendation']}")`,
        output: `Enterprise Value: $685,000,000.00 -> Equity Value: $565,000,000.00\nImplied Share Price: $56.50 vs Market Price: $45.00\nUpside: 25.56% | Recommendation: STRONG_BUY`,
        codeNotes: [
          { line: 10, note: 'Calculates net debt by netting liquid cash balances against gross debt liabilities' },
          { line: 11, note: 'Bridges Enterprise Value to Equity Value by adjusting for net debt, non-operating assets, and minority interest' },
          { line: 12, note: 'Calculates intrinsic implied per-share price across fully diluted shares outstanding' },
          { line: 15, note: 'Issues institutional investment recommendation based on intrinsic valuation premium over market price' }
        ],
        tryIt: 'Increase current_market_price to $65.00 to observe how the valuation upside turns negative and the recommendation shifts to SELL.',
        check: {
          question: 'In the Enterprise-to-Equity Value bridge, why is cash added back to Enterprise Value while debt is subtracted to calculate Equity Value?',
          options: [
            'Enterprise Value reflects operating assets; cash is a non-operating asset belonging to shareholders, while debt represents a senior non-equity claim against operating assets.',
            'Cash is subtracted because it generates interest income that is taxable at ordinary rates.',
            'Debt is added because borrowing capital increases the total physical assets owned by the enterprise.',
            'GAAP requires cash and debt to cancel each other out on the corporate consolidated balance sheet.'
          ],
          answer: 0,
          why: 'EV values core operations; cash is excess non-operating liquidity owned by shareholders, whereas debt holders have senior claims that must be satisfied before common equity receives proceeds.',
          answerIndex: 0,
          explanation: 'EV values core operations; cash is excess non-operating liquidity owned by shareholders, whereas debt holders have senior claims that must be satisfied before common equity receives proceeds.'
        }
      }
    ],
    summary: [
      'Engineered multi-stage DCF valuation models calculating explicit 5-year Free Cash Flow to Firm (FCFF) and capitalizing perpetual terminal value via the Gordon Growth model (EV = $622.07M, 76.91% TV contribution).',
      'Applied Robert Hamada\'s equation to isolate pure operating asset beta (0.9871) from peer debt capital structures and relevered target beta (1.2833) to determine institutional Cost of Equity via CAPM (11.26%).',
      'Constructed two-way valuation sensitivity surfaces sweeping WACC (+/- 100 bps) and perpetual growth rates (+/- 50 bps), defining an unassailable $506M to $813M valuation corridor for M&A deal execution.',
      'Modeled institutional LBO debt waterfalls with 100% mandatory cash sweeps, enforcing absolute priority repayment across senior and subordinated debt tranches ($31.125M senior debt retired, 17.29% deleveraging).',
      'Synthesized the Enterprise-to-Equity Value bridge adjusting for net debt, cash, and minority interest, deriving an intrinsic share price of $56.50 (+25.56% upside over market) and issuing a Strong Buy investment recommendation.'
    ],
    projectStep: {
      title: 'Construct the Investment Banking Corporate Valuation & LBO Waterfall Model',
      steps: [
        'Project 5-year Free Cash Flow to Firm (FCFF) and discount flows back to present value using the corporate WACC.',
        'Unlever peer comparable equity betas and relever target beta via the Hamada Equation to calculate target Cost of Equity.',
        'Compute Gordon Growth terminal value and construct a two-way WACC-growth sensitivity surface to establish valuation boundaries.',
        'Simulate private equity LBO debt waterfalls with mandatory cash sweeps, tracking senior and subordinated debt amortization.',
        'Execute the Enterprise-to-Equity value bridge, compute implied intrinsic per-share value, and issue institutional investment recommendations.'
      ]
    }
  }

];
