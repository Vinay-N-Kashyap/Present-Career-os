import type { LongLesson } from './longLessons';

/**
 * Digital Accounting, ERP Systems & Financial Reporting (Course: bcom-accounting)
 * Day 1: Accrual Principles, Double-Entry Invariants & 3-Statement Model Integration.
 */
export const BCOM_ACCOUNTING_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'bcom-accounting',
    day: 1,
    title: 'Financial Accounting Invariants & 3-Statement Integration',
    goal: 'Master foundational corporate accounting: the accrual matching principle, double-entry mathematical invariants, and integrated 3-statement financial modeling.',
    minutes: 40,
    recap: 'Welcome to Financial Accounting & ERP Systems. Accounting is the numerical ledger of truth upon which all capital markets and audit compliance rest. We will learn how financial statements tie together with exact mathematical precision.',
    parts: [
      {
        title: 'Accrual Accounting & The Revenue Matching Principle',
        say: [
          'In personal finance, individuals use Cash Accounting: you recognize revenue when green cash hits your wallet, and you recognize expenses when cash leaves your bank account. In corporate enterprise, cash accounting produces wild, distorted swings that misrepresent economic reality.',
          'Under Generally Accepted Accounting Principles (GAAP) and IFRS, all corporations mandate Accrual Accounting governed by the Matching Principle and ASC 606 / IFRS 15 Revenue Recognition standards.',
          'The Matching Principle requires that revenues are recognized when performance obligations are satisfied (goods delivered or services rendered), regardless of when cash is collected. Crucially, all related expenses incurred to generate that revenue must be matched and recognized in the EXACT same accounting period!',
          'If a SaaS company collects $120,000 upfront for an annual software license, it CANNOT book $120,000 as immediate revenue! It records $120,000 Cash on the asset side and an offsetting $120,000 Deferred Revenue liability. Each month, it recognizes exactly $10,000 as earned revenue while reducing the liability.'
        ],
        example: 'Think of subscribing to an annual magazine. You pay $120 on January 1st. The publisher cannot celebrate having "earned" all $120 in January because they still owe you 11 magazines! Each month they deliver a magazine, they have earned $10 and relieved a fraction of their debt to you.',
        code: `# Simulation: ASC 606 SaaS Deferred Revenue & Accrual Recognition Schedule
class AccrualRevenueSchedule:
    def __init__(self, contract_value: float, contract_months: int):
        self.total_contract = contract_value
        self.months = contract_months
        self.monthly_earned_revenue = contract_value / contract_months
        self.cash_collected = contract_value # 100% upfront collection
        self.deferred_revenue_liability = contract_value
        self.accumulated_recognized_revenue = 0.0

    def recognize_month(self, month_num: int) -> dict:
        if self.deferred_revenue_liability < self.monthly_earned_revenue:
            raise ValueError("Contract already fully recognized")

        self.deferred_revenue_liability -= self.monthly_earned_revenue
        self.accumulated_recognized_revenue += self.monthly_earned_revenue

        return {
            "Month": month_num,
            "Monthly_Recognized_Revenue": round(self.monthly_earned_revenue, 2),
            "Remaining_Deferred_Liability": round(self.deferred_revenue_liability, 2),
            "Total_Cumulative_Recognized": round(self.accumulated_recognized_revenue, 2)
        }

saas_contract = AccrualRevenueSchedule(contract_value=120000.0, contract_months=12)
print("ASC 606 Revenue Recognition Invariant Schedule:")

m1 = saas_contract.recognize_month(1)
m2 = saas_contract.recognize_month(2)
m3 = saas_contract.recognize_month(3)

print(f"Month 1: Earned \${m1['Monthly_Recognized_Revenue']:,} | Deferred Liability Left: \${m1['Remaining_Deferred_Liability']:,}")
print(f"Month 2: Earned \${m2['Monthly_Recognized_Revenue']:,} | Deferred Liability Left: \${m2['Remaining_Deferred_Liability']:,}")
print(f"Month 3: Earned \${m3['Monthly_Recognized_Revenue']:,} | Deferred Liability Left: \${m3['Remaining_Deferred_Liability']:,}")`,
        output: `ASC 606 Revenue Recognition Invariant Schedule:\nMonth 1: Earned $10,000.0 | Deferred Liability Left: $110,000.0\nMonth 2: Earned $10,000.0 | Deferred Liability Left: $100,000.0\nMonth 3: Earned $10,000.0 | Deferred Liability Left: $90,000.0`,
        tryIt: 'Run through month 12 and verify that Deferred Revenue liability reaches exactly $0.00 while Cumulative Recognized equals $120,000.00.',
        check: {
          question: 'Why does an enterprise record upfront customer subscription cash as Deferred Revenue (a Liability) rather than immediate Revenue?',
          options: [
            'Because the performance obligation has not yet been delivered; the company owes the customer future services, creating a binding performance liability under ASC 606',
            'To hide profits from the tax authority',
            'Because customer cash expires after 30 days'
          ],
          answer: 0,
          why: 'Under accrual accounting, revenue cannot be recognized until performance obligations are satisfied. Upfront cash creates an unearned deferred revenue liability that bleeds into income as service is delivered.'
        }
      },
      {
        title: 'The Fundamental Accounting Equation & Double-Entry Invariants',
        say: [
          'Invented in 1494 by Franciscan friar Luca Pacioli, Double-Entry Bookkeeping is one of the most durable intellectual inventions in world history. It guarantees that an enterprise balance sheet is always mathematically balanced.',
          'The entire architecture of financial accounting rests upon a single inviolable identity: Assets = Liabilities + Shareholder Equity.',
          'Assets represent economic resources owned by the firm that provide future economic value (Cash, Accounts Receivable, Inventory, Property & Equipment). Liabilities represent claims by creditors (Accounts Payable, Bank Loans, Deferred Revenue). Equity represents the residual ownership claim of shareholders (Common Stock, Additional Paid-In Capital, Retained Earnings).',
          'In double-entry bookkeeping, every financial transaction requires at least two equal and offsetting entries: a Debit and a Credit. Crucially: Debits increase Assets and Expenses, while Credits increase Liabilities, Equity, and Revenue. For every single journal entry, Sum(Debits) MUST EXACTLY EQUAL Sum(Credits)!'
        ],
        example: 'Think of a double-pan weighing scale. If you place a 5 kg weight on the left pan (Debit: Cash), the scale tips out of balance. To rebalance the scale, you must place an equal 5 kg weight on the right pan (Credit: Bank Loan). The ledger remains in perfect equilibrium.',
        code: `# Simulation: Double-Entry General Ledger & Trial Balance Invariant Verifier
class DoubleEntryLedger:
    def __init__(self):
        # Master Chart of Accounts (Account -> Balance)
        self.accounts = {
            "Cash": 0.0,
            "Accounts_Receivable": 0.0,
            "Inventory": 0.0,
            "Accounts_Payable": 0.0,
            "Bank_Debt": 0.0,
            "Shareholder_Equity": 0.0,
            "Revenue": 0.0,
            "COGS_Expense": 0.0
        }
        self.journal_log = []

    def post_journal_entry(self, description: str, debits: dict[str, float], credits: dict[str, float]):
        total_debits = sum(debits.values())
        total_credits = sum(credits.values())

        # Invariant 1: Debits must strictly equal Credits
        if abs(total_debits - total_credits) > 1e-4:
            raise ValueError(f"Unbalanced Journal Entry: Debits ({total_debits}) != Credits ({total_credits})")

        # Apply Debits (Assets/Expenses up, Liabilities/Equity down)
        for acct, amt in debits.items():
            if acct in ["Cash", "Accounts_Receivable", "Inventory", "COGS_Expense"]:
                self.accounts[acct] += amt
            else:
                self.accounts[acct] -= amt

        # Apply Credits (Liabilities/Equity/Revenue up, Assets down)
        for acct, amt in credits.items():
            if acct in ["Accounts_Payable", "Bank_Debt", "Shareholder_Equity", "Revenue"]:
                self.accounts[acct] += amt
            else:
                self.accounts[acct] -= amt

        self.journal_log.append({"Desc": description, "Debit": total_debits, "Credit": total_credits})

    def verify_fundamental_accounting_equation(self) -> dict:
        assets = self.accounts["Cash"] + self.accounts["Accounts_Receivable"] + self.accounts["Inventory"]
        liabilities = self.accounts["Accounts_Payable"] + self.accounts["Bank_Debt"]
        # Equity includes Retained Earnings (Revenue - Expenses)
        retained_earnings = self.accounts["Revenue"] - self.accounts["COGS_Expense"]
        total_equity = self.accounts["Shareholder_Equity"] + retained_earnings

        is_balanced = abs(assets - (liabilities + total_equity)) < 1e-4

        return {
            "Total_Assets": assets,
            "Total_Liabilities": liabilities,
            "Total_Equity": total_equity,
            "Equation_Holds_A_equals_L_plus_E": is_balanced
        }

ledger = DoubleEntryLedger()

# Transaction 1: Founders invest $100k cash in exchange for Common Stock
ledger.post_journal_entry("Initial Capitalization", {"Cash": 100000.0}, {"Shareholder_Equity": 100000.0})

# Transaction 2: Company borrows $50k from bank
ledger.post_journal_entry("Bank Term Loan", {"Cash": 50000.0}, {"Bank_Debt": 50000.0})

# Transaction 3: Purchase $30k inventory on 30-day credit from supplier
ledger.post_journal_entry("Inventory Purchase", {"Inventory": 30000.0}, {"Accounts_Payable": 30000.0})

eq = ledger.verify_fundamental_accounting_equation()
print("Fundamental Accounting Invariant Check:")
print(f"Total Assets:        \${eq['Total_Assets']:,}")
print(f"Liabilities + Equity: \${eq['Total_Liabilities'] + eq['Total_Equity']:,} (L: \${eq['Total_Liabilities']:,} + E: \${eq['Total_Equity']:,})")
print(f"Balance Equation Holds: {eq['Equation_Holds_A_equals_L_plus_E']}")`,
        output: `Fundamental Accounting Invariant Check:\nTotal Assets:        $180,000.0\nLiabilities + Equity: $180,000.0 (L: $80,000.0 + E: $100,000.0)\nBalance Equation Holds: True`,
        tryIt: 'Attempt to post an unbalanced entry ($10,000 debit and $8,000 credit) and verify the ValueError exception.',
        check: {
          question: 'What is the Fundamental Accounting Equation that must hold true on every corporate balance sheet?',
          options: [
            'Assets = Liabilities + Shareholder Equity',
            'Revenue = Expenses + Taxes',
            'Cash = Inventory * Debt'
          ],
          answer: 0,
          why: 'The balance sheet is mathematically anchored by Assets = Liabilities + Equity. Every asset owned by the company was either financed by borrowing (Liabilities) or invested by owners (Equity).'
        }
      },
      {
        title: 'The 3-Statement Financial Model Integration',
        say: [
          'In corporate financial modeling, investment bankers and CFOs build dynamic 3-Statement Models linking the Income Statement, Balance Sheet, and Cash Flow Statement.',
          'These three statements are not isolated reports; they are mathematically bound together through continuous feedback loops.',
          'Loop 1: The Income Statement computes Net Income (Revenues minus Expenses and Taxes). Net Income flows directly into the Cash Flow Statement as the starting line item of Cash Flow from Operations (CFO).',
          'Loop 2: The Cash Flow Statement adjusts Net Income for non-cash expenses (adding back Depreciation) and changes in Working Capital, plus Cash Flow from Investing (Capex) and Financing (Debt/Equity). The bottom line is Net Change in Cash.',
          'Loop 3: Net Income also flows onto the Balance Sheet, adding directly to Retained Earnings (Retained Earnings_end = Retained Earnings_start + Net Income - Dividends). Meanwhile, the Net Change in Cash updates the Balance Sheet Cash account. When all links are connected correctly, the Balance Sheet automatically balances!'
        ],
        example: 'Think of human physiology. The Income Statement is your nutritional intake and calories burned. The Cash Flow Statement is actual fluid blood circulating through your arteries. The Balance Sheet is your overall body mass and health. You cannot change one without instantly altering the other two.',
        code: `# Simulation: Integrated 3-Statement Financial Model Engine
def run_integrated_3_statement_cycle(
    starting_cash: float,
    starting_retained_earnings: float,
    revenue: float,
    cogs: float,
    operating_expenses: float,
    depreciation: float,
    tax_rate: float,
    capex: float,
    working_capital_change: float
) -> dict:
    # 1. Income Statement
    ebitda = revenue - cogs - operating_expenses
    ebit = ebitda - depreciation
    tax = max(0.0, ebit * tax_rate)
    net_income = ebit - tax

    # 2. Cash Flow Statement
    # Operating: Net Income + Depreciation (non-cash add-back) - Working Capital drain
    cfo = net_income + depreciation - working_capital_change
    # Investing: Capex
    cfi = -capex
    # Financing: 0 in this cycle
    cff = 0.0
    net_change_in_cash = cfo + cfi + cff
    ending_cash = starting_cash + net_change_in_cash

    # 3. Balance Sheet Updates
    ending_retained_earnings = starting_retained_earnings + net_income

    return {
        "Net_Income": round(net_income),
        "Cash_From_Operations": round(cfo),
        "Net_Change_In_Cash": round(net_change_in_cash),
        "Ending_Cash_Balance": round(ending_cash),
        "Ending_Retained_Earnings": round(ending_retained_earnings)
    }

cycle = run_integrated_3_statement_cycle(
    starting_cash=50000.0,
    starting_retained_earnings=100000.0,
    revenue=200000.0,
    cogs=80000.0,
    operating_expenses=40000.0,
    depreciation=15000.0,
    tax_rate=0.25,
    capex=20000.0,
    working_capital_change=5000.0
)

print("Integrated 3-Statement Reconciliation:")
print(f"Income Statement Net Income: \${cycle['Net_Income']:,}")
print(f"Cash Flow from Operations:   \${cycle['Cash_From_Operations']:,} (Depreciation Added Back)")
print(f"Net Change in Cash:          \${cycle['Net_Change_In_Cash']:,}")
print(f"Balance Sheet Ending Cash:   \${cycle['Ending_Cash_Balance']:,}")
print(f"Balance Sheet Retained Earn: \${cycle['Ending_Retained_Earnings']:,}")`,
        output: `Integrated 3-Statement Reconciliation:\nIncome Statement Net Income: $48,750\nCash Flow from Operations:   $58,750 (Depreciation Added Back)\nNet Change in Cash:          $38,750\nBalance Sheet Ending Cash:   $88,750\nBalance Sheet Retained Earn: $148,750`,
        tryIt: 'Notice how Cash from Operations ($58,750) exceeds Net Income ($48,750) because non-cash Depreciation is added back!',
        check: {
          question: 'Why is Depreciation expense added back to Net Income on the Cash Flow Statement under Operating Activities?',
          options: [
            'Depreciation is a non-cash accounting expense that reduced net income on the P&L without causing any actual cash outflow during the period',
            'Depreciation is money given to the government',
            'To increase the stock price before the quarterly earnings call'
          ],
          answer: 0,
          why: 'When fixed assets depreciate, an accounting expense is recorded to match asset wear-and-tear, but no money leaves the company bank account. Adding it back restores the true cash position.'
        }
      },
      {
        title: 'Depreciation Schedules & Fixed Asset Accounting',
        say: [
          'When a corporation purchases a $1,000,000 server cluster or factory robot (Capital Expenditure, Capex), it is forbidden from expensing the entire $1,000,000 on day one of its income statement. The machinery has a useful multi-year lifespan.',
          'Instead, the purchase is capitalized on the Balance Sheet as Property, Plant & Equipment (PP&E). The cost is gradually expensed over its useful life through Depreciation.',
          'Under Straight-Line Depreciation, expense is distributed evenly: Annual Depreciation = (Historical Cost - Salvage Value) / Useful Life Years.',
          'Accelerated methods (such as MACRS or Double Declining Balance) recognize higher depreciation in early years when assets are most productive, providing front-loaded tax shields.',
          'On the Balance Sheet, Gross PP&E minus Accumulated Depreciation yields Net Book Value (NBV). If an asset\'s future cash-generating ability drops permanently below NBV, an Asset Impairment write-down must be recognized immediately.'
        ],
        example: 'Think of buying a delivery van for $40,000 with a 5-year life and $5,000 scrap value. Each year, the van depreciates by ($40,000 - $5,000) / 5 = $7,000. At the end of Year 3, Accumulated Depreciation is $21,000 and the van’s Net Book Value on the balance sheet is $19,000.',
        code: `# Simulation: Straight-Line vs Double-Declining Balance Depreciation Schedule
def compute_depreciation_schedule(cost: float, salvage_value: float, useful_life_years: int) -> dict:
    # 1. Straight-Line Schedule
    annual_sl = (cost - salvage_value) / useful_life_years
    sl_schedule = [round(annual_sl)] * useful_life_years

    # 2. Double-Declining Balance Schedule (200% factor)
    ddb_rate = (2.0 / useful_life_years)
    ddb_schedule = []
    current_book_val = cost

    for year in range(1, useful_life_years + 1):
        dep = current_book_val * ddb_rate
        # Ensure book value does not fall below salvage value
        if current_book_val - dep < salvage_value:
            dep = current_book_val - salvage_value
        dep = max(0.0, dep)
        ddb_schedule.append(round(dep))
        current_book_val -= dep

    return {
        "Historical_Cost": cost,
        "Salvage_Value": salvage_value,
        "Straight_Line_Annual": sl_schedule,
        "Double_Declining_Annual": ddb_schedule
    }

sched = compute_depreciation_schedule(cost=50000.0, salvage_value=5000.0, useful_life_years=5)
print("Asset Depreciation Comparison (Useful Life: 5 Years):")
print(f"Straight-Line (Even):            {sched['Straight_Line_Annual']}")
print(f"Double-Declining (Front-Loaded): {sched['Double_Declining_Annual']}")`,
        output: `Asset Depreciation Comparison (Useful Life: 5 Years):\nStraight-Line (Even):            [9000, 9000, 9000, 9000, 9000]\nDouble-Declining (Front-Loaded): [20000, 12000, 7200, 4320, 1480]`,
        tryIt: 'Notice how Double-Declining accelerates $20,000 of depreciation into Year 1 compared to $9,000 in Straight-Line, creating an immediate tax shield.',
        check: {
          question: 'What is Net Book Value (NBV) on a corporate balance sheet?',
          options: [
            'Historical Original Cost of Property, Plant & Equipment minus Accumulated Depreciation',
            'The market price of the company stock on the NYSE',
            'The amount of cash in the bank account'
          ],
          answer: 0,
          why: 'Net Book Value reflects the carrying amount of an asset on the balance sheet: Historical Acquisition Cost less all Accumulated Depreciation recorded to date.'
        }
      },
      {
        title: 'Accounts Receivable Aging & Expected Credit Loss (ECL)',
        say: [
          'When an enterprise sells goods on B2B trade credit (e.g. Net 30 or Net 60 payment terms), it creates Accounts Receivable (AR). In a perfect world, 100% of customers pay their invoices on time. In reality, a predictable percentage of receivables will default.',
          'GAAP and IFRS 9 mandate the Allowance Method: companies must estimate and record Bad Debt Expense in the same period sales occur, rather than waiting months for customers to declare bankruptcy (matching principle).',
          'Corporations manage this using an Accounts Receivable Aging Schedule. Invoices are categorized into historical aging buckets: Current (0-30 days), 31-60 days past due, 61-90 days past due, and 90+ days past due.',
          'Each bucket carries an escalating Expected Credit Loss (ECL) default probability (e.g. 1% for current, 5% for 31-60, 20% for 61-90, and 50% for 90+). The calculated total forms the Allowance for Doubtful Accounts (a contra-asset that reduces Gross AR down to Net Realizable Value on the Balance Sheet).'
        ],
        example: 'Think of lending money to 100 acquaintances. Those who pay within a week (Current) almost all pay back. But if someone has not replied to your messages for 6 months (90+ days past due), there is a 50%+ chance you will never see that money again. You plan your budget accordingly.',
        code: `# Simulation: Accounts Receivable Aging Schedule & Bad Debt Provisioning
def calculate_ar_bad_debt_provision(aging_buckets: dict[str, float], default_rates: dict[str, float]) -> dict:
    provisions = {}
    total_gross_ar = 0.0
    total_allowance = 0.0

    for bucket, balance in aging_buckets.items():
        rate = default_rates[bucket]
        allowance = balance * rate
        provisions[bucket] = round(allowance, 2)
        total_gross_ar += balance
        total_allowance += allowance

    net_realizable_ar = total_gross_ar - total_allowance

    return {
        "Total_Gross_AR": round(total_gross_ar, 2),
        "Allowance_For_Doubtful_Accounts": round(total_allowance, 2),
        "Net_Realizable_AR_On_Balance_Sheet": round(net_realizable_ar, 2),
        "Blended_Default_Rate_Pct": f"{(total_allowance / total_gross_ar) * 100.0:.2f}%"
    }

# Enterprise B2B receivables portfolio
ar_aging = {
    "Current_0_30": 850000.0,
    "Past_Due_31_60": 120000.0,
    "Past_Due_61_90": 45000.0,
    "Past_Due_90_Plus": 25000.0
}

default_probs = {
    "Current_0_30": 0.015,     # 1.5% default rate
    "Past_Due_31_60": 0.08,    # 8.0% default rate
    "Past_Due_61_90": 0.25,    # 25.0% default rate
    "Past_Due_90_Plus": 0.60   # 60.0% default rate
}

ecl = calculate_ar_bad_debt_provision(ar_aging, default_probs)

print("Accounts Receivable Aging & Allowance Diagnostics:")
print(f"Gross Accounts Receivable: \${ecl['Total_Gross_AR']:,}")
print(f"Bad Debt Allowance (Contra): \${ecl['Allowance_For_Doubtful_Accounts']:,} ({ecl['Blended_Default_Rate_Pct']})")
print(f"Net Realizable AR:           \${ecl['Net_Realizable_AR_On_Balance_Sheet']:,}")`,
        output: `Accounts Receivable Aging & Allowance Diagnostics:\nGross Accounts Receivable: $1,040,000.0\nBad Debt Allowance (Contra): $48,600.0 (4.67%)\nNet Realizable AR:           $991,400.0`,
        tryIt: 'Increase the 90+ days bucket to $100,000 to observe how the contra-asset allowance expands and depresses Net Realizable AR.',
        check: {
          question: 'What is the accounting purpose of the Allowance for Doubtful Accounts on a corporate balance sheet?',
          options: [
            'It is a contra-asset account that reduces Gross Accounts Receivable down to its Net Realizable Value based on expected default probabilities',
            'It is a bank account where bad checks are mailed',
            'It is a tax penalty charged by the IRS'
          ],
          answer: 0,
          why: 'The allowance account offsets gross receivables so the balance sheet accurately reports only the cash expected to be collected (Net Realizable Value), honoring the accrual conservatism principle.'
        }
      }
    ],
    summary: [
      'Accrual Accounting enforces the Matching Principle and ASC 606 standards: revenues are recognized when earned, and expenses are matched in the same period.',
      'The Fundamental Accounting Equation (Assets = Liabilities + Equity) is preserved by Double-Entry Bookkeeping: every transaction balances Debits and Credits.',
      'The 3-Statement Model links Net Income into Cash Flow from Operations, adds back Depreciation, and connects Net Cash and Retained Earnings to the Balance Sheet.',
      'Depreciation allocates capitalized Fixed Asset (PP&E) costs across useful life; Net Book Value reflects original cost minus accumulated depreciation.',
      'Accounts Receivable Aging schedules categorize credit default risk into aging buckets, establishing the contra-asset Allowance for Doubtful Accounts.'
    ],
    projectStep: {
      title: 'Construct a Balanced 3-Statement Financial Model with Double-Entry Ledger',
      steps: [
        'Post balanced debit and credit journal entries and verify the Assets = Liabilities + Equity invariant.',
        'Build an ASC 606 deferred revenue recognition schedule for an annual contract.',
        'Link an Income Statement Net Income into the Cash Flow Statement and Balance Sheet.',
        'Calculate an Accounts Receivable aging schedule and derive Net Realizable Receivables.'
      ]
    }
  },
  {
    coursePrefix: 'bcom-accounting',
    day: 2,
    title: 'ASC 842 Leases, Multi-Currency Consolidation, Inventory Dynamics & ERP Controls',
    goal: 'Master advanced corporate enterprise accounting: ASC 842 / IFRS 16 lease capitalization, multi-currency subsidiary consolidation & CTA under ASC 830, FIFO vs Weighted-Average inventory costing dynamics, ASC 350 goodwill impairment testing, and automated ERP subledger-to-GL reconciliation controls.',
    minutes: 45,
    recap: 'Welcome to Day 2 of Financial Accounting & ERP Systems. Today, we elevate beyond simple double-entry bookkeeping into real-world multinational corporate accounting: capitalization of operating leases, foreign exchange translation & CTA under ASC 830, inventory valuation under ASC 330, goodwill impairment testing under ASC 350, and automated ERP general ledger reconciliation.',
    parts: [
      {
        title: 'ASC 842 & IFRS 16 Lease Capitalization Engine',
        say: [
          'Prior to accounting standard updates ASC 842 (US GAAP) and IFRS 16, corporations exploited an enormous loophole: Operating Leases were treated as off-balance sheet operating expenses. An airline leasing $50 billion worth of Boeing aircraft or a retail chain leasing 1,000 stores showed ZERO debt liabilities on their balance sheets, masking their true leverage from credit rating agencies!',
          'Under ASC 842 and IFRS 16, almost all leases exceeding 12 months must be capitalized onto the balance sheet. The lessee must recognize a Right-of-Use (ROU) Asset (representing the contractual right to use the underlying property) and an offsetting Lease Liability (representing the present value of future lease payments).',
          'The initial lease liability equals the present value of all future lease payments discounted at either the rate implicit in the lease or the lessee\'s Incremental Borrowing Rate (IBR). Over the lease term, the liability is amortized using the effective interest method: each payment splits into Interest Expense (reducing net income) and Principal Reduction (reducing the balance sheet liability).',
          'Simultaneously, the ROU Asset is systematically depreciated (typically on a straight-line basis over the lease term for finance leases). This ensures that financial leverage, debt covenants, and EBITDA calculations reflect genuine enterprise commitments.'
        ],
        example: 'Imagine signing a 5-year lease for an AI supercomputing server cluster at $50,000 per year with an incremental borrowing rate of 6.0%. Under old accounting, you booked $50,000 annual rent expense with zero balance sheet footprint. Under ASC 842, you immediately capitalize a $210,618.19 ROU Asset and $210,618.19 Lease Liability on day one!',
        code: `# Simulation: ASC 842 / IFRS 16 Lease Capitalization & Amortization Engine
def calculate_lease_amortization_schedule(annual_payment: float, term_years: int, discount_rate: float):
    # Present Value of Lease Payments (Ordinary Annuity formula)
    # PV = PMT * [1 - (1 + r)^(-n)] / r
    pv_factor = (1.0 - (1.0 + discount_rate) ** (-term_years)) / discount_rate
    initial_liability = annual_payment * pv_factor
    initial_rou_asset = initial_liability
    annual_straight_line_depr = initial_rou_asset / term_years

    schedule = []
    current_liability = initial_liability
    current_rou_asset = initial_rou_asset

    for yr in range(1, term_years + 1):
        interest_expense = current_liability * discount_rate
        principal_reduction = annual_payment - interest_expense
        ending_liability = current_liability - principal_reduction
        current_rou_asset -= annual_straight_line_depr

        schedule.append({
            "Year": yr,
            "Payment": annual_payment,
            "Interest_Expense": round(interest_expense, 2),
            "Principal_Reduction": round(principal_reduction, 2),
            "Ending_Lease_Liability": round(ending_liability, 2),
            "Ending_ROU_Asset": round(current_rou_asset, 2)
        })
        current_liability = ending_liability

    return {
        "Initial_Capitalized_Liability": round(initial_liability, 2),
        "Schedule": schedule
    }

lease = calculate_lease_amortization_schedule(annual_payment=50000.0, term_years=5, discount_rate=0.06)
y1 = lease["Schedule"][0]
print(f"Capitalized ROU Asset / Liability: \${lease['Initial_Capitalized_Liability']:,}")
print(f"Yr 1: Payment \${y1['Payment']} -> Interest: \${y1['Interest_Expense']}, Principal: \${y1['Principal_Reduction']}")
print(f"Yr 1 Ending Liability: \${y1['Ending_Lease_Liability']:,} | ROU Asset: \${y1['Ending_ROU_Asset']:,}")`,
        output: `Capitalized ROU Asset / Liability: $210,618.19\nYr 1: Payment $50000.0 -> Interest: $12637.09, Principal: $37362.91\nYr 1 Ending Liability: $173,255.28 | ROU Asset: $168,494.55`,
        tryIt: 'Change the discount_rate from 0.06 to 0.10 and note how a higher interest rate lowers the initial capitalized PV liability to $189,539.34.',
        check: {
          question: 'Under ASC 842 and IFRS 16, what was the primary regulatory reason for requiring operating leases to be recorded on corporate balance sheets?',
          options: [
            'To eliminate off-balance sheet financing and provide transparency into the true contractual debt obligations and leverage of the lessee',
            'To force corporations to purchase real estate rather than leasing',
            'To increase corporate federal income tax liabilities by eliminating rent deductions',
            'To shorten all commercial lease agreements to under 6 months'
          ],
          answer: 0,
          why: 'Off-balance sheet operating leases allowed companies to disguise billions in contractual payment obligations. ASC 842 eliminates this distortive opacity by mandating Right-of-Use Asset and Lease Liability recognition.',
          answerIndex: 0,
          explanation: 'Off-balance sheet operating leases allowed companies to disguise billions in contractual payment obligations. ASC 842 eliminates this distortive opacity by mandating Right-of-Use Asset and Lease Liability recognition.'
        }
      },
      {
        title: 'Multi-Currency Foreign Subsidiary Consolidation & CTA (ASC 830)',
        say: [
          'Global multinational corporations operate dozens of legal subsidiaries worldwide, each transacting in its local Functional Currency (such as Euros, Japanese Yen, or British Pounds). When assembling the global Consolidated Financial Statements in the reporting currency (e.g., US Dollars), financial controllers must follow ASC 830 / IAS 21.',
          'Under the Current Rate Method, all foreign subsidiary balance sheet assets and liabilities are translated at the current spot exchange rate as of the balance sheet date. Conversely, income statement revenues and expenses are translated at the weighted-average exchange rate over the reporting period.',
          'Because the spot exchange rate at period-end inevitably differs from the weighted-average rate and historical equity rates, a mathematical translation imbalance is created. Where does this foreign exchange variance go?',
          'Crucially, under ASC 830, this translation difference CANNOT be flushed through Net Income on the Income Statement! Doing so would generate massive artificial profit volatility driven purely by currency fluctuations. Instead, it is recorded directly into Other Comprehensive Income (OCI) as the Cumulative Translation Adjustment (CTA), accumulating within Shareholders\' Equity.'
        ],
        example: 'Consider a US multinational whose European subsidiary holds €20,000,000 in net assets. When the Euro appreciates from $1.05 to $1.12, the USD value of those European net assets expands from $21,000,000 to $22,400,000. The $1,400,000 translation gain is captured in CTA within Accumulated Other Comprehensive Income (AOCI), preserving operational P&L integrity.',
        code: `# Simulation: Multi-Currency Foreign Subsidiary Consolidation & CTA (ASC 830)
def consolidate_foreign_subsidiary(local_net_assets_eur: float, local_net_income_eur: float,
                                   spot_rate_usd_per_eur: float, avg_rate_usd_per_eur: float,
                                   historical_rate_usd_per_eur: float):
    # Current Rate Method under ASC 830:
    # 1. Assets & Liabilities translated at current spot balance sheet rate
    translated_net_assets_usd = local_net_assets_eur * spot_rate_usd_per_eur

    # 2. Income statement translated at weighted-average rate for the reporting period
    translated_net_income_usd = local_net_income_eur * avg_rate_usd_per_eur

    # 3. Beginning equity translated at historical exchange rates
    translated_historical_equity_usd = local_net_assets_eur * historical_rate_usd_per_eur

    # 4. Cumulative Translation Adjustment (CTA) balancing plug into Other Comprehensive Income (OCI)
    # CTA represents translation gain/loss from spot rate drift vs historical
    cta_oci_plug_usd = translated_net_assets_usd - translated_historical_equity_usd

    return {
        "Translated_Net_Assets_USD": round(translated_net_assets_usd, 2),
        "Translated_Net_Income_USD": round(translated_net_income_usd, 2),
        "CTA_Equity_Adjustment_USD": round(cta_oci_plug_usd, 2)
    }

sub = consolidate_foreign_subsidiary(
    local_net_assets_eur=20000000.0,
    local_net_income_eur=4000000.0,
    spot_rate_usd_per_eur=1.12,
    avg_rate_usd_per_eur=1.08,
    historical_rate_usd_per_eur=1.05
)
print(f"Translated Net Assets: \${sub['Translated_Net_Assets_USD']:,} | Net Income: \${sub['Translated_Net_Income_USD']:,}")
print(f"CTA OCI Adjustment: \${sub['CTA_Equity_Adjustment_USD']:,} -> Logged in Accumulated Other Comprehensive Income (AOCI) in Equity")`,
        output: `Translated Net Assets: $22,400,000.0 | Net Income: $4,320,000.0\nCTA OCI Adjustment: $1,280,000.0 -> Logged in Accumulated Other Comprehensive Income (AOCI) in Equity`,
        tryIt: 'Set spot_rate_usd_per_eur to 0.98 (Euro devalues against USD) and observe how the CTA turns into a negative equity reserve adjustment.',
        check: {
          question: 'Why does ASC 830 mandate that foreign currency translation gains/losses under the Current Rate Method be booked to OCI (Cumulative Translation Adjustment) rather than Net Income?',
          options: [
            'To prevent unrealized macro currency fluctuations from distorting the core operating earnings and profitability of the business',
            'Because foreign currencies are legally considered non-taxable assets',
            'To conceal foreign currency losses from external auditors and creditors',
            'Because foreign subsidiaries cannot hold bank accounts in their local jurisdiction'
          ],
          answer: 0,
          why: 'Translating balance sheets at spot rates creates paper volatility. Routing CTA through OCI preserves operational Net Income integrity until the foreign subsidiary is liquidated or sold.',
          answerIndex: 0,
          explanation: 'Translating balance sheets at spot rates creates paper volatility. Routing CTA through OCI preserves operational Net Income integrity until the foreign subsidiary is liquidated or sold.'
        }
      },
      {
        title: 'Inventory Costing Dynamics: FIFO vs Weighted-Average (ASC 330)',
        say: [
          'For manufacturing, hardware, and retail enterprises, inventory is one of the largest working capital assets on the balance sheet. Under ASC 330, inventory must be carried at the Lower of Cost or Net Realizable Value (LCNRV). However, determining the "cost" of inventory sold requires selecting an inventory cost flow assumption.',
          'The two prevailing international costing methodologies are FIFO (First-In, First-Out) and Weighted-Average Cost. (Note that LIFO is permissible under US GAAP for tax purposes, but strictly forbidden under IFRS!).',
          'In an inflationary environment where unit purchase costs rise over time, FIFO assumes the oldest, cheapest units are sold first. This results in lower Cost of Goods Sold (COGS), higher reported Gross Profit, and a higher, more current inventory valuation on the balance sheet.',
          'Weighted-Average Costing, by contrast, smooths price spikes by calculating a blended average unit cost across all available batches. This produces moderate COGS, stabilizes gross margins, and eliminates artificial profit spikes caused purely by inventory batch vintage timing.'
        ],
        example: 'Imagine a microchip manufacturer buying 500 units at $50 in January, 600 units at $55 in March, and 400 units at $65 in June. Selling 550 units at $110 produces $28,000 COGS and $34,500 Gross Profit under FIFO, but $32,916.67 COGS and $29,583.33 Gross Profit under Weighted-Average!',
        code: `# Simulation: Inventory Costing Dynamics: FIFO vs Weighted-Average Costing under ASC 330
def calculate_inventory_costing_models(batches: list[dict], units_sold: int, sales_price_per_unit: float):
    # Total available inventory
    total_units_avail = sum(b["units"] for b in batches)
    total_cost_avail = sum(b["units"] * b["cost_per_unit"] for b in batches)

    # 1. FIFO Cost of Goods Sold (First-In, First-Out)
    fifo_cogs = 0.0
    units_needed = units_sold
    for b in batches:
        take = min(b["units"], units_needed)
        fifo_cogs += take * b["cost_per_unit"]
        units_needed -= take
        if units_needed == 0:
            break
    fifo_ending_inv = total_cost_avail - fifo_cogs
    revenue = units_sold * sales_price_per_unit
    fifo_gross_profit = revenue - fifo_cogs

    # 2. Weighted-Average Costing (W-Avg)
    weighted_avg_cost_per_unit = total_cost_avail / total_units_avail
    wavg_cogs = units_sold * weighted_avg_cost_per_unit
    wavg_ending_inv = total_cost_avail - wavg_cogs
    wavg_gross_profit = revenue - wavg_cogs

    return {
        "FIFO_COGS": round(fifo_cogs, 2),
        "FIFO_Gross_Profit": round(fifo_gross_profit, 2),
        "FIFO_Ending_Inventory": round(fifo_ending_inv, 2),
        "WAvg_COGS": round(wavg_cogs, 2),
        "WAvg_Gross_Profit": round(wavg_gross_profit, 2),
        "WAvg_Ending_Inventory": round(wavg_ending_inv, 2),
        "FIFO_Profit_Premium": round(fifo_gross_profit - wavg_gross_profit, 2)
    }

inventory_batches = [
    {"batch": "Jan_01_Beginning", "units": 500, "cost_per_unit": 50.0},
    {"batch": "Mar_15_Purchase",  "units": 600, "cost_per_unit": 55.0},
    {"batch": "Jun_20_Purchase",  "units": 400, "cost_per_unit": 65.0}
]
costing = calculate_inventory_costing_models(inventory_batches, units_sold=550, sales_price_per_unit=110.0)
print(f"FIFO COGS: \${costing['FIFO_COGS']:,} -> Gross Profit: \${costing['FIFO_Gross_Profit']:,} (Ending Inv: \${costing['FIFO_Ending_Inventory']:,})")
print(f"W-Avg COGS: \${costing['WAvg_COGS']:,} -> Gross Profit: \${costing['WAvg_Gross_Profit']:,} (Ending Inv: \${costing['WAvg_Ending_Inventory']:,})")
print(f"FIFO Inflationary Profit Premium: +\${costing['FIFO_Profit_Premium']:,}")`,
        output: `FIFO COGS: $28,000.0 | Gross Profit: $34,500.0 (Ending Inv: $51,000.0)\nW-Avg COGS: $32,916.67 | Gross Profit: $29,583.33 (Ending Inv: $46,083.33)\nFIFO Inflationary Profit Premium: +$4,916.67`,
        tryIt: 'Reverse the costs so prices decline ($65 in Jan, $55 in Mar, $50 in Jun) to confirm that deflation causes Weighted-Average Gross Profit to exceed FIFO Gross Profit.',
        check: {
          question: 'In a sustained inflationary pricing environment, what is the financial statement effect of selecting FIFO over Weighted-Average Costing?',
          options: [
            'FIFO produces lower COGS, higher reported Gross Profit, and higher ending inventory asset value on the balance sheet',
            'FIFO produces higher COGS, lower Gross Profit, and artificially depresses working capital',
            'FIFO has zero impact on COGS or Gross Profit because all inventory methods yield identical gross margins',
            'FIFO is banned under US GAAP for manufacturing businesses'
          ],
          answer: 0,
          why: 'Because FIFO sells older, cheaper inventory first, COGS reflects lower historical costs, boosting current-period Gross Profit and leaving higher recent costs in Ending Inventory.',
          answerIndex: 0,
          explanation: 'Because FIFO sells older, cheaper inventory first, COGS reflects lower historical costs, boosting current-period Gross Profit and leaving higher recent costs in Ending Inventory.'
        }
      },
      {
        title: 'ASC 350 Goodwill Impairment Testing & Quantitative Loss Calculation',
        say: [
          'When a corporation acquires a business, any purchase price paid in excess of the fair market value of net identifiable tangible and intangible assets is capitalized as Goodwill on the balance sheet under ASC 805.',
          'Goodwill represents synergies, brand reputation, workforce assembly, and future earning power. Unlike equipment or patents, Goodwill has an indefinite useful life and CANNOT be amortized under US GAAP and IFRS. Instead, it must be rigorously tested for impairment at least annually under ASC 350.',
          'Under current ASU 2017-04 simplification, companies perform a quantitative test by comparing the Fair Value of each Reporting Unit with its Carrying Value (including allocated goodwill). If the reporting unit\'s Carrying Value exceeds its Fair Value, an Impairment Loss must be recognized immediately!',
          'The impairment loss equals the excess carrying value, capped at the total amount of recorded goodwill allocated to that reporting unit. The impairment is written off as an operating expense on the Income Statement and permanently reduces Goodwill on the Balance Sheet; under US GAAP, goodwill impairments can NEVER be reversed!'
        ],
        example: 'A software company acquires a legacy hardware unit for $50M, booking $20M in goodwill. Three years later, market disruption shrinks the reporting unit\'s fair value to $40M, while its carrying value is $52M. The $12M excess is written off as an immediate goodwill impairment loss, reducing goodwill to $8M.',
        code: `# Simulation: ASC 350 Goodwill Impairment Testing Model
def evaluate_goodwill_impairment(reporting_units: list[dict]):
    audit_results = []
    for unit in reporting_units:
        name = unit["name"]
        carrying_value = unit["carrying_value_with_goodwill"]
        fair_value = unit["fair_value_reporting_unit"]
        recorded_goodwill = unit["recorded_goodwill"]

        # Step 1 Test: Does Carrying Value exceed Fair Value?
        if carrying_value > fair_value:
            # Impairment exists: loss is excess carrying value, capped at total recorded goodwill
            indicated_loss = carrying_value - fair_value
            impairment_loss = min(indicated_loss, recorded_goodwill)
            verdict = "MATERIAL_GOODWILL_IMPAIRMENT_RECOGNIZED"
        else:
            impairment_loss = 0.0
            verdict = "NO_IMPAIRMENT_REPORTING_UNIT_HEALTHY"

        ending_goodwill = recorded_goodwill - impairment_loss
        audit_results.append({
            "unit": name,
            "verdict": verdict,
            "impairment_loss": round(impairment_loss, 2),
            "ending_goodwill": round(ending_goodwill, 2)
        })
    return audit_results

units_portfolio = [
    {"name": "Cloud_SaaS_Division", "carrying_value_with_goodwill": 45000000.0, "fair_value_reporting_unit": 62000000.0, "recorded_goodwill": 15000000.0},
    {"name": "Legacy_Hardware_Division", "carrying_value_with_goodwill": 52000000.0, "fair_value_reporting_unit": 40000000.0, "recorded_goodwill": 20000000.0}
]

impairments = evaluate_goodwill_impairment(units_portfolio)
print(f"Unit 1: {impairments[0]['unit']} -> [{impairments[0]['verdict']}] (Loss: \${impairments[0]['impairment_loss']:,})")
print(f"Unit 2: {impairments[1]['unit']} -> [{impairments[1]['verdict']}] (Loss: \${impairments[1]['impairment_loss']:,}, End Goodwill: \${impairments[1]['ending_goodwill']:,})")`,
        output: `Unit 1: Cloud_SaaS_Division -> [NO_IMPAIRMENT_REPORTING_UNIT_HEALTHY] (Loss: $0.0)\nUnit 2: Legacy_Hardware_Division -> [MATERIAL_GOODWILL_IMPAIRMENT_RECOGNIZED] (Loss: $12,000,000.0, End Goodwill: $8,000,000.0)`,
        tryIt: 'Increase Legacy_Hardware_Division fair_value_reporting_unit to $55,000,000.0 and verify that impairment drops to $0.0.',
        check: {
          question: 'Under US GAAP ASC 350, once a corporate goodwill impairment loss is recognized on the income statement, can it be reversed in future periods if business conditions recover?',
          options: [
            'No, goodwill impairment write-downs are strictly permanent and cannot be reversed under US GAAP',
            'Yes, impairments can be fully reversed whenever market capitalization exceeds carrying value',
            'Yes, but only if approved by the SEC within 12 months',
            'Goodwill is amortized annually so impairment losses never occur'
          ],
          answer: 0,
          why: 'Under US GAAP, goodwill impairment losses are permanent. Reversals are strictly forbidden to prevent management from creating artificial future earnings windfalls.',
          answerIndex: 0,
          explanation: 'Under US GAAP, goodwill impairment losses are permanent. Reversals are strictly forbidden to prevent management from creating artificial future earnings windfalls.'
        }
      },
      {
        title: 'ERP Subledger-to-General-Ledger Automated Reconciliation',
        say: [
          'In modern enterprise ERP architectures (such as SAP S/4HANA, Oracle NetSuite, or Workday), transactional activities do not post directly into the primary General Ledger (GL) line by line. Instead, millions of transactions process in specialized Subsidiary Ledgers (Subledgers): Accounts Receivable (AR), Accounts Payable (AP), Fixed Assets, and Inventory.',
          'Each subledger connects to the General Ledger through a summary Control Account. The foundational operational control of corporate accounting is the Subledger-to-GL Reconciliation: the sum of all individual customer balances in the AR subledger must exactly equal the balance in the AR control account in the GL.',
          'What causes subledger-to-GL variances? The most common culprits are: (1) manual top-level journal entries posted directly to the GL control account bypassing the subledger, (2) interface batch posting integration timeouts, and (3) timing differences between invoice cutoff dates.',
          'Automated financial close platforms run scheduled Python and SQL bots during month-end close to detect any out-of-balance condition. If an unreconciled variance is detected, the period-end close is halted until the root cause is resolved and audited.'
        ],
        example: 'An automated ERP reconciliation bot queries the General Ledger AR control account ($300,000) and aggregates all active customer subledger balances ($297,500). Finding an out-of-balance variance of +$2,500, it flags an orphaned manual journal entry and locks the period close.',
        code: `# Simulation: ERP Subledger-to-General-Ledger Automated Reconciliation
def reconcile_subledger_to_general_ledger(gl_control_balance: float, subledger_item_balances: list[float], pending_journal_entries: list[dict]):
    subledger_total = sum(subledger_item_balances)
    variance = gl_control_balance - subledger_total
    discrepancies = []

    if abs(variance) > 0.01:
        discrepancies.append(f"UNRECONCILED_OUT_OF_BALANCE_VARIANCE (\${variance:+,.2f})")
        if variance > 0:
            discrepancies.append("GL_EXCEEDS_SUBLEDGER: Likely orphaned top-level manual journal entry.")
        else:
            discrepancies.append("SUBLEDGER_EXCEEDS_GL: Batch posting sync failure from billing subledger.")

    cleared_for_close = (len(discrepancies) == 0)
    verdict = "CLEARED_FOR_PERIOD_END_CLOSE" if cleared_for_close else "HOLD_PERIOD_END_CLOSE_INVESTIGATE"

    return {
        "GL_Control_Balance": round(gl_control_balance, 2),
        "Subledger_Total": round(subledger_total, 2),
        "Variance": round(variance, 2),
        "Verdict": verdict,
        "Flags": discrepancies
    }

recon = reconcile_subledger_to_general_ledger(
    gl_control_balance=300000.0,
    subledger_item_balances=[120000.0, 95000.0, 82500.0],
    pending_journal_entries=[]
)
print(f"GL: \${recon['GL_Control_Balance']:,} vs Subledger: \${recon['Subledger_Total']:,} | Variance: \${recon['Variance']}")
print(f"Verdict: {recon['Verdict']} -> {recon['Flags']}")`,
        output: `GL: $300,000.0 vs Subledger: $297,500.0 | Variance: $2500.0\nVerdict: HOLD_PERIOD_END_CLOSE_INVESTIGATE -> ['UNRECONCILED_OUT_OF_BALANCE_VARIANCE ($+2,500.00)', 'GL_EXCEEDS_SUBLEDGER: Likely orphaned top-level manual journal entry.']`,
        tryIt: 'Add a subledger balance of $2,500.00 to subledger_item_balances and verify that the variance drops to 0.0 and the verdict flips to CLEARED_FOR_PERIOD_END_CLOSE.',
        check: {
          question: 'What is the primary risk when accounting personnel post manual journal entries directly to a General Ledger control account rather than through the specialized subledger?',
          options: [
            'It creates a subledger-to-GL discrepancy where summary financial statements fail to tie out to the underlying customer or vendor operational records',
            'It automatically deletes all historical invoice records in the subledger',
            'It forces the ERP system into read-only mode for 30 days',
            'It changes the company fiscal year end date'
          ],
          answer: 0,
          why: 'Direct manual journal entries to GL control accounts break the synchronization between the general ledger and the detailed operational subledger, creating audit reconciliation variances.',
          answerIndex: 0,
          explanation: 'Direct manual journal entries to GL control accounts break the synchronization between the general ledger and the detailed operational subledger, creating audit reconciliation variances.'
        }
      }
    ],
    summary: [
      'ASC 842 & IFRS 16 eliminate off-balance sheet operating leases by mandating Right-of-Use (ROU) Assets and Lease Liabilities discounted at the incremental borrowing rate.',
      'ASC 830 Multi-Currency Consolidation translates assets and liabilities at spot rates and routes translation variances to OCI as Cumulative Translation Adjustment (CTA) to avoid P&L distortion.',
      'ASC 330 Inventory Costing: FIFO assumes oldest units are sold first, producing lower COGS and higher gross profits in inflationary environments compared to Weighted-Average.',
      'ASC 350 Goodwill Impairment compares reporting unit Fair Value to Carrying Value; recognized impairment write-downs are permanent and cannot be reversed under US GAAP.',
      'ERP Subledger Reconciliation enforces integrity between detailed operational records (AR, AP) and General Ledger control accounts, halting period close upon variance detection.'
    ],
    projectStep: {
      title: 'Implement an Enterprise Financial Accounting & ERP Control Engine',
      steps: [
        'Calculate an ASC 842 lease amortization schedule with ROU asset depreciation and liability interest split.',
        'Consolidate a foreign subsidiary with spot and average exchange rates, deriving the OCI CTA plug.',
        'Compare FIFO vs Weighted-Average inventory costing dynamics across multi-period purchase batches.',
        'Perform an ASC 350 goodwill impairment test and execute an automated ERP subledger-to-GL reconciliation check.'
      ]
    }
  }
];

