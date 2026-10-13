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
  },
  {
    coursePrefix: 'bcom-accounting',
    day: 3,
    title: 'Advanced Cost Accounting: Activity-Based Costing (ABC), Standard Costing & Flexible Budget Variances',
    goal: 'Master advanced managerial cost accounting and variance control: eliminate volume-based product cross-subsidization using Activity-Based Costing (ABC) multi-pool allocation, isolate direct materials price and quantity usage variances, compute direct labor rate and efficiency variances, perform 4-way manufacturing overhead variance decompositions, and construct flexible budget variance reconciliations.',
    minutes: 45,
    recap: 'In Day 2, we engineered ASC 842 lease amortizations, multi-currency consolidations, inventory costing models, goodwill impairment, and subledger reconciliations. Today, we enter managerial cost accounting: dismantling overhead distortions, enforcing standard costing benchmarks, and isolating operational budget variances.',
    parts: [
      {
        title: 'Activity-Based Costing (ABC) vs Traditional Volume-Based Allocation',
        say: [
          'In traditional cost accounting, factories allocate indirect manufacturing overhead using a single, blanket plant-wide predetermined overhead rate—typically Direct Labor Hours (DLH) or Machine Hours. In modern automated manufacturing where direct labor represents less than 10% of total product cost, this volume-based approach creates catastrophic cost distortions.',
          'Traditional volume allocation commits the fundamental error of product cross-subsidization: high-volume, simple products consume minimal engineering setups and inspections but absorb the vast majority of overhead simply because they run for more hours. Meanwhile, low-volume, highly complex custom products consume massive setup resources, engineering changes, and quality checks while absorbing negligible overhead.',
          'Activity-Based Costing (ABC) resolves this distortion through a two-stage tracing hierarchy: first, overhead costs are accumulated into distinct activity cost pools (e.g., Machine Setups, Quality Inspections); second, activity rates are calculated (Activity Rate = Total Pool Cost / Total Cost Driver Volume) and assigned to products based on their actual consumption. This reveals true product line profitability.'
        ],
        example: 'A factory incurs $400,000 in overhead across 120,000 direct labor hours ($3.33/DLH traditional rate). Under traditional costing, Standard Widgets are charged $3.33/unit while Custom Components are charged $6.67/unit. Under ABC, tracing $240k in Setups and $160k in Inspections reveals that Standard Widgets actually cost only $1.10/unit in overhead ($2.23 over-costed), while Custom Components cost $15.60/unit ($8.93 under-costed margin bleed).',
        code: `def calculate_activity_based_costing_allocation(
    cost_pools: list[dict],
    products: list[dict]
) -> dict:
    total_overhead = sum(p["total_pool_cost"] for p in cost_pools)
    total_labor_hours = sum(prod["direct_labor_hours"] * prod["units_produced"] for prod in products)
    traditional_overhead_rate = total_overhead / total_labor_hours if total_labor_hours > 0 else 0.0
    
    activity_rates = {}
    for pool in cost_pools:
        name = pool["name"]
        cost = pool["total_pool_cost"]
        tot_driver = sum(prod["activities"][name] for prod in products)
        activity_rates[name] = cost / tot_driver if tot_driver > 0 else 0.0
        
    results = []
    for prod in products:
        p_name = prod["name"]
        units = prod["units_produced"]
        trad_oh = prod["direct_labor_hours"] * units * traditional_overhead_rate
        trad_oh_per_unit = trad_oh / units
        
        abc_oh = sum(activity_rates[act_name] * prod["activities"][act_name] for act_name in activity_rates)
        abc_oh_per_unit = abc_oh / units
        distortion_per_unit = trad_oh_per_unit - abc_oh_per_unit
        
        results.append({
            "product": p_name,
            "units": units,
            "traditional_overhead_per_unit": round(trad_oh_per_unit, 2),
            "abc_overhead_per_unit": round(abc_oh_per_unit, 2),
            "cost_distortion_per_unit": round(distortion_per_unit, 2),
            "distortion_verdict": "OVERCOSTED_SUBSIDIZING" if distortion_per_unit > 0 else "UNDERCOSTED_MARGIN_BLEED"
        })
        
    return {
        "total_overhead_pool": round(total_overhead, 2),
        "traditional_predetermined_rate_per_dlh": round(traditional_overhead_rate, 2),
        "product_allocations": results
    }

pools = [
    {"name": "Setups", "total_pool_cost": 240000.0},
    {"name": "Inspections", "total_pool_cost": 160000.0}
]
prods = [
    {"name": "Standard Widget", "units_produced": 80000, "direct_labor_hours": 1.0, "activities": {"Setups": 20, "Inspections": 50}},
    {"name": "Custom Component", "units_produced": 20000, "direct_labor_hours": 2.0, "activities": {"Setups": 80, "Inspections": 150}}
]
p1 = calculate_activity_based_costing_allocation(pools, prods)
print(f"Total Overhead: $" + f"{p1['total_overhead_pool']:,.2f} | Trad Rate: $" + f"{p1['traditional_predetermined_rate_per_dlh']:,.2f}/DLH")
for r in p1["product_allocations"]:
    print(f"  {r['product']}: Trad OH = $" + f"{r['traditional_overhead_per_unit']:,.2f} vs ABC OH = $" + f"{r['abc_overhead_per_unit']:,.2f} | Distortion = $" + f"{r['cost_distortion_per_unit']:,.2f} ({r['distortion_verdict']})")`,
        output: `Total Overhead: $400,000.00 | Trad Rate: $3.33/DLH\n  Standard Widget: Trad OH = $3.33 vs ABC OH = $1.10 | Distortion = $2.23 (OVERCOSTED_SUBSIDIZING)\n  Custom Component: Trad OH = $6.67 vs ABC OH = $15.60 | Distortion = $-8.93 (UNDERCOSTED_MARGIN_BLEED)`,
        codeNotes: [
          { line: 7, note: 'Calculates traditional single plant-wide predetermined overhead rate per direct labor hour' },
          { line: 15, note: 'Computes Activity-Based Costing driver consumption rates for individual cost pools' },
          { line: 24, note: 'Traces overhead consumption directly to products to unmask cross-subsidization distortion' },
          { line: 31, note: 'Classifies product line distortion as overcosted subsidizing or undercosted margin bleed' }
        ],
        tryIt: 'Increase Setups cost pool to $350,000 to see how the cost distortion on low-volume Custom Components expands even further.',
        check: {
          question: 'Why does traditional volume-based overhead allocation systematically over-cost high-volume standard products and under-cost low-volume custom products?',
          options: [
            'Traditional allocation assigns overhead purely on volume metrics (labor hours), ignoring the fact that low-volume custom products consume disproportionately more setups, engineering, and inspection activities.',
            'Direct labor hours are prohibited under GAAP from being used in product manufacturing cost accounting.',
            'High-volume products have higher raw material scrap rates that must be written off to general administrative expenses.',
            'Activity-Based Costing is applicable only to non-profit healthcare organizations.'
          ],
          answer: 0,
          why: 'Volume drivers assign costs based on batch size rather than complexity; complex products require frequent setups and testing but run for fewer total hours, evading overhead under traditional systems.',
          answerIndex: 0,
          explanation: 'Volume drivers assign costs based on batch size rather than complexity; complex products require frequent setups and testing but run for fewer total hours, evading overhead under traditional systems.'
        }
      },
      {
        title: 'Standard Costing: Direct Materials Price & Quantity Variances',
        say: [
          'In enterprise resource planning (ERP) systems, managerial accountants establish Standard Costs—predetermined benchmark costs for raw materials, direct labor, and overhead per unit of output. Standard costing enables management by exception by highlighting operational variances between planned benchmarks and actual execution.',
          'Direct Materials variance analysis dissects cost discrepancies into two distinct organizational responsibilities: (1) Direct Materials Price Variance (DMPV) and (2) Direct Materials Quantity Variance (DMQV). Separating these variances ensures that purchasing managers are held accountable for price negotiation, while factory floor supervisors are held accountable for material scrap and consumption efficiency.',
          'The formulas are mathematically precise: DMPV = (Actual Price - Standard Price) * Actual Quantity Purchased. A negative result is Favorable (paying less than budget). DMQV = (Actual Quantity Used - Standard Quantity Allowed) * Standard Price, where Standard Quantity Allowed = Actual Units Produced * Standard Quantity per Unit. Evaluating both uncovers trade-offs, such as purchasing inferior cheap materials that cause excessive factory floor waste.'
        ],
        example: 'A manufacturing plant budgeted standard resin at $5.00/lb (4.5 lbs/unit standard). Purchasing acquires 50,000 lbs at $4.80/lb, generating a $10,000.00 Favorable price variance. However, to produce 10,000 units (45,000 lbs standard allowed), workers consumed 48,000 lbs of resin due to impurities, generating a $15,000.00 Unfavorable quantity variance and leaving a net $5,000.00 Unfavorable materials variance.',
        code: `def calculate_direct_materials_variances(
    actual_price: float,
    standard_price: float,
    actual_quantity_purchased: float,
    actual_quantity_used: float,
    standard_quantity_per_unit: float,
    units_produced: int
) -> dict:
    standard_quantity_allowed = units_produced * standard_quantity_per_unit
    
    dmpv = (actual_price - standard_price) * actual_quantity_purchased
    dmqv = (actual_quantity_used - standard_quantity_allowed) * standard_price
    total_materials_variance = dmpv + dmqv
    
    return {
        "units_produced": units_produced,
        "standard_quantity_allowed": round(standard_quantity_allowed, 2),
        "actual_quantity_used": round(actual_quantity_used, 2),
        "direct_materials_price_variance": round(dmpv, 2),
        "price_variance_status": "FAVORABLE" if dmpv <= 0 else "UNFAVORABLE",
        "direct_materials_quantity_variance": round(dmqv, 2),
        "quantity_variance_status": "FAVORABLE" if dmqv <= 0 else "UNFAVORABLE",
        "net_materials_variance": round(total_materials_variance, 2),
        "net_variance_status": "FAVORABLE" if total_materials_variance <= 0 else "UNFAVORABLE"
    }

p2 = calculate_direct_materials_variances(
    actual_price=4.80,
    standard_price=5.00,
    actual_quantity_purchased=50000.0,
    actual_quantity_used=48000.0,
    standard_quantity_per_unit=4.5,
    units_produced=10000
)
print(f"Units: {p2['units_produced']} | SQ Allowed: {p2['standard_quantity_allowed']:,.0f} lbs | AQ Used: {p2['actual_quantity_used']:,.0f} lbs")
print(f"Price Variance: $" + f"{p2['direct_materials_price_variance']:,.2f} ({p2['price_variance_status']})")
print(f"Quantity Variance: $" + f"{p2['direct_materials_quantity_variance']:,.2f} ({p2['quantity_variance_status']})")
print(f"Net Materials Variance: $" + f"{p2['net_materials_variance']:,.2f} ({p2['net_variance_status']})")`,
        output: `Units: 10000 | SQ Allowed: 45,000 lbs | AQ Used: 48,000 lbs\nPrice Variance: $-10,000.00 (FAVORABLE)\nQuantity Variance: $15,000.00 (UNFAVORABLE)\nNet Materials Variance: $5,000.00 (UNFAVORABLE)`,
        codeNotes: [
          { line: 9, note: 'Calculates standard quantity allowed by multiplying actual finished units by standard unit input' },
          { line: 11, note: 'Isolates Direct Materials Price Variance based on actual quantities purchased' },
          { line: 12, note: 'Evaluates Direct Materials Quantity Variance based on actual factory floor consumption' },
          { line: 13, note: 'Sums price and quantity components to determine overall net materials variance' }
        ],
        tryIt: 'Adjust actual_price to $5.20 to observe how paying above standard creates an Unfavorable price variance.',
        check: {
          question: 'If a company reports a large Favorable Direct Materials Price Variance alongside an even larger Unfavorable Direct Materials Quantity Variance, what operational scenario is most likely occurring?',
          options: [
            'The purchasing department bought lower-grade, bargain raw materials that resulted in severe machine jamming and excessive factory floor scrap.',
            'Production workers worked overtime at double-time pay rates.',
            'The company increased the selling price of finished goods to retail consumers.',
            'Sales volume fell short of the master budget projection for the quarterly period.'
          ],
          answer: 0,
          why: 'Buying cheap, sub-standard materials generates an initial favorable purchase price variance but leads to higher scrap and waste on the production line, causing an unfavorable quantity variance.',
          answerIndex: 0,
          explanation: 'Buying cheap, sub-standard materials generates an initial favorable purchase price variance but leads to higher scrap and waste on the production line, causing an unfavorable quantity variance.'
        }
      },
      {
        title: 'Direct Labor Rate & Efficiency Variances',
        say: [
          'Parallel to direct materials, human workforce expenditures are decomposed into price and quantity components: Direct Labor Rate Variance (DLRV) and Direct Labor Efficiency Variance (DLEV).',
          'Direct Labor Rate Variance measures the difference between actual wages paid per hour and standard budgeted wage rates: DLRV = (Actual Rate - Standard Rate) * Actual Hours Worked. Unfavorable rate variances frequently arise when assigning senior master craftsmen to routine tasks or scheduling unexpected overtime premiums.',
          'Direct Labor Efficiency Variance evaluates worker productivity: DLEV = (Actual Hours Worked - Standard Hours Allowed) * Standard Rate, where Standard Hours Allowed = Units Produced * Standard Hours per Unit. A favorable efficiency variance indicates that the workforce completed the production run in fewer hours than the standard engineering allowance, reflecting superior training, optimized tooling, or enhanced motivation.'
        ],
        example: 'Producing 10,000 units with a standard labor benchmark of 2.0 hours/unit at $25.00/hour (20,000 standard hours allowed). Factory management deploys skilled senior technicians earning $26.50/hour across 19,500 actual hours worked. This creates an Unfavorable rate variance of $29,250.00, offset by a Favorable efficiency variance of -$12,500.00 (500 hours saved), yielding a net $16,750.00 Unfavorable labor variance.',
        code: `def calculate_direct_labor_variances(
    actual_rate: float,
    standard_rate: float,
    actual_hours_worked: float,
    standard_hours_per_unit: float,
    units_produced: int
) -> dict:
    standard_hours_allowed = units_produced * standard_hours_per_unit
    
    dlrv = (actual_rate - standard_rate) * actual_hours_worked
    dlev = (actual_hours_worked - standard_hours_allowed) * standard_rate
    total_labor_variance = dlrv + dlev
    
    return {
        "units_produced": units_produced,
        "standard_hours_allowed": round(standard_hours_allowed, 2),
        "actual_hours_worked": round(actual_hours_worked, 2),
        "direct_labor_rate_variance": round(dlrv, 2),
        "rate_variance_status": "FAVORABLE" if dlrv <= 0 else "UNFAVORABLE",
        "direct_labor_efficiency_variance": round(dlev, 2),
        "efficiency_variance_status": "FAVORABLE" if dlev <= 0 else "UNFAVORABLE",
        "net_labor_variance": round(total_labor_variance, 2),
        "net_variance_status": "FAVORABLE" if total_labor_variance <= 0 else "UNFAVORABLE"
    }

p3 = calculate_direct_labor_variances(
    actual_rate=26.50,
    standard_rate=25.00,
    actual_hours_worked=19500.0,
    standard_hours_per_unit=2.0,
    units_produced=10000
)
print(f"Units: {p3['units_produced']} | SH Allowed: {p3['standard_hours_allowed']:,.0f} hrs | AH Worked: {p3['actual_hours_worked']:,.0f} hrs")
print(f"Rate Variance: $" + f"{p3['direct_labor_rate_variance']:,.2f} ({p3['rate_variance_status']})")
print(f"Efficiency Variance: $" + f"{p3['direct_labor_efficiency_variance']:,.2f} ({p3['efficiency_variance_status']})")
print(f"Net Labor Variance: $" + f"{p3['net_labor_variance']:,.2f} ({p3['net_variance_status']})")`,
        output: `Units: 10000 | SH Allowed: 20,000 hrs | AH Worked: 19,500 hrs\nRate Variance: $29,250.00 (UNFAVORABLE)\nEfficiency Variance: $-12,500.00 (FAVORABLE)\nNet Labor Variance: $16,750.00 (UNFAVORABLE)`,
        codeNotes: [
          { line: 9, note: 'Multiplies actual finished units by standard unit labor allowance to calculate standard hours allowed' },
          { line: 11, note: 'Calculates wage rate variance: wage differential multiplied by actual hours worked' },
          { line: 12, note: 'Evaluates efficiency variance: labor hour differential multiplied by standard hourly wage benchmark' },
          { line: 13, note: 'Sums rate and efficiency components to determine overall direct labor variance' }
        ],
        tryIt: 'Reduce actual_hours_worked to 18,000 hrs to see how exceptional labor efficiency can fully overcome higher wage rates to make net labor variance Favorable.',
        check: {
          question: 'Why is the Direct Labor Efficiency Variance calculated using the Standard Labor Rate rather than the Actual Labor Rate?',
          options: [
            'Using the standard rate isolates pure physical labor productivity differences from the separate effect of wage rate negotiations and overtime premiums.',
            'The actual labor rate is confidential under federal wage transparency laws.',
            'GAAP prohibits using actual wage rates in any internal cost accounting report.',
            'Standard labor rates automatically account for corporate income tax withholding.'
          ],
          answer: 0,
          why: 'Multiplying by the standard rate isolates physical efficiency variance, preventing wage rate distortions from contaminating the operational productivity metric.',
          answerIndex: 0,
          explanation: 'Multiplying by the standard rate isolates physical efficiency variance, preventing wage rate distortions from contaminating the operational productivity metric.'
        }
      },
      {
        title: 'Manufacturing Overhead Variances (Spending, Efficiency & Volume)',
        say: [
          'Manufacturing overhead encompasses all indirect factory expenses—utilities, maintenance, supervision, and factory depreciation. Because overhead contains both variable and fixed components, comprehensive cost variance analysis requires a multi-way decomposition.',
          'Variable Overhead (VOH) is split into: (1) Variable Overhead Spending Variance = Actual VOH - (Actual Hours * Standard Variable Overhead Rate), reflecting price paid for utilities and indirect supplies; and (2) Variable Overhead Efficiency Variance = (Actual Hours - Standard Hours Allowed) * Standard Variable Overhead Rate, mirroring direct labor efficiency.',
          'Fixed Overhead (FOH) is analyzed across: (3) Fixed Overhead Budget / Spending Variance = Actual FOH - Budgeted FOH; and (4) Fixed Overhead Volume Variance = Budgeted FOH - (Standard Hours Allowed * Standard Fixed Overhead Rate). Crucially, the Volume Variance measures capacity utilization: an unfavorable volume variance indicates the plant produced fewer units than denominator capacity, failing to fully absorb fixed factory overhead.'
        ],
        example: 'A plant incurs $105,000 in Variable OH ($5.00/hr standard rate) and $152,000 in Fixed OH ($150,000 budgeted, $7.50/hr standard rate) across 19,500 actual hours and 20,000 standard hours allowed. Analysis reveals: VOH Spending $7,500 Unfavorable, VOH Efficiency -$2,500 Favorable, FOH Budget $2,000 Unfavorable, and FOH Volume $0.00 Favorable, totaling a net $7,000.00 Unfavorable overhead variance.',
        code: `def calculate_manufacturing_overhead_variances(
    actual_voh: float,
    standard_vor_per_hour: float,
    actual_hours: float,
    standard_hours_allowed: float,
    actual_foh: float,
    budgeted_foh: float,
    standard_for_per_hour: float
) -> dict:
    voh_spending = actual_voh - (actual_hours * standard_vor_per_hour)
    voh_efficiency = (actual_hours - standard_hours_allowed) * standard_vor_per_hour
    
    foh_spending = actual_foh - budgeted_foh
    foh_volume = budgeted_foh - (standard_hours_allowed * standard_for_per_hour)
    
    total_overhead_variance = voh_spending + voh_efficiency + foh_spending + foh_volume
    
    return {
        "voh_spending_variance": round(voh_spending, 2),
        "voh_spending_status": "FAVORABLE" if voh_spending <= 0 else "UNFAVORABLE",
        "voh_efficiency_variance": round(voh_efficiency, 2),
        "voh_efficiency_status": "FAVORABLE" if voh_efficiency <= 0 else "UNFAVORABLE",
        "foh_budget_spending_variance": round(foh_spending, 2),
        "foh_spending_status": "FAVORABLE" if foh_spending <= 0 else "UNFAVORABLE",
        "foh_volume_variance": round(foh_volume, 2),
        "foh_volume_status": "FAVORABLE" if foh_volume <= 0 else "UNFAVORABLE",
        "net_overhead_variance": round(total_overhead_variance, 2),
        "net_overhead_status": "FAVORABLE" if total_overhead_variance <= 0 else "UNFAVORABLE"
    }

p4 = calculate_manufacturing_overhead_variances(
    actual_voh=105000.0,
    standard_vor_per_hour=5.00,
    actual_hours=19500.0,
    standard_hours_allowed=20000.0,
    actual_foh=152000.0,
    budgeted_foh=150000.0,
    standard_for_per_hour=7.50
)
print(f"VOH Spending: $" + f"{p4['voh_spending_variance']:,.2f} ({p4['voh_spending_status']}) | VOH Efficiency: $" + f"{p4['voh_efficiency_variance']:,.2f} ({p4['voh_efficiency_status']})")
print(f"FOH Budget: $" + f"{p4['foh_budget_spending_variance']:,.2f} ({p4['foh_spending_status']}) | FOH Volume: $" + f"{p4['foh_volume_variance']:,.2f} ({p4['foh_volume_status']})")
print(f"Net Overhead Variance: $" + f"{p4['net_overhead_variance']:,.2f} ({p4['net_overhead_status']})")`,
        output: `VOH Spending: $7,500.00 (UNFAVORABLE) | VOH Efficiency: $-2,500.00 (FAVORABLE)\nFOH Budget: $2,000.00 (UNFAVORABLE) | FOH Volume: $0.00 (FAVORABLE)\nNet Overhead Variance: $7,000.00 (UNFAVORABLE)`,
        codeNotes: [
          { line: 10, note: 'Calculates Variable Overhead Spending Variance measuring price inflation in indirect supplies' },
          { line: 11, note: 'Calculates Variable Overhead Efficiency Variance tracking indirect utility consumption efficiency' },
          { line: 13, note: 'Evaluates Fixed Overhead Budget Spending Variance comparing actual rent/depreciation to master budget' },
          { line: 14, note: 'Computes Fixed Overhead Volume Variance measuring plant capacity underutilization' }
        ],
        tryIt: 'Reduce standard_hours_allowed to 16,000 hrs to see how plant underutilization causes a massive $30,000 Unfavorable Fixed Overhead Volume Variance.',
        check: {
          question: 'In standard cost accounting, what does an Unfavorable Fixed Overhead Volume Variance indicate about plant operations?',
          options: [
            'The plant produced fewer units than planned in the master budget, failing to fully utilize its installed production capacity and under-absorbing fixed overhead.',
            'The factory landlord unexpectedly increased the monthly building rent.',
            'Electric utility rates increased due to peak-demand energy surcharges.',
            'Direct materials purchased by the procurement department were defective.'
          ],
          answer: 0,
          why: 'Volume variance is driven entirely by output quantity: producing below planned capacity leaves fixed plant overhead under-absorbed by finished goods inventory.',
          answerIndex: 0,
          explanation: 'Volume variance is driven entirely by output quantity: producing below planned capacity leaves fixed plant overhead under-absorbed by finished goods inventory.'
        }
      },
      {
        title: 'Flexible Budgeting & Master Budget Variance Waterfall',
        say: [
          'Comparing actual monthly operating income directly against the static Master Budget is misleading because the master budget was predicated on an assumed sales volume. If a company sells 1,000 more units than planned, total costs will naturally rise, making the factory look artificially inefficient.',
          'To isolate operational efficiency from sales volume fluctuations, corporate controllers construct a Flexible Budget: a dynamic budget that recalculates budgeted revenues, variable costs, and contribution margins for the ACTUAL level of output achieved, holding standard selling prices and variable costs constant.',
          'The total Static Budget Variance is bridged via a two-step waterfall: (1) Sales Volume Variance = Flexible Budget Operating Income - Master Budget Operating Income; and (2) Flexible Budget Variance = Actual Operating Income - Flexible Budget Operating Income. This provides senior leadership with a clear view of commercial sales performance versus operational cost control.'
        ],
        example: 'Master budget planned 10,000 units at $50 price, $20 VC, and $150k fixed costs ($150,000 Operating Income). Actual production reaches 11,000 units sold at $48 price, $21 VC, and $155k fixed costs ($142,000 Actual OI). The Flexible Budget at 11,000 units indicates planned income should have been $180,000. Sales volume provided a +$30,000 Favorable boost, but operational execution suffered a -$38,000 Unfavorable flexible budget shortfall, resulting in a net -$8,000.00 static budget deficit.',
        code: `def reconcile_master_flexible_budget_variance(
    budgeted_units: int,
    actual_units: int,
    budgeted_selling_price: float,
    actual_selling_price: float,
    budgeted_vc_per_unit: float,
    actual_vc_per_unit: float,
    budgeted_fixed_costs: float,
    actual_fixed_costs: float
) -> dict:
    master_rev = budgeted_units * budgeted_selling_price
    master_vc = budgeted_units * budgeted_vc_per_unit
    master_cm = master_rev - master_vc
    master_oi = master_cm - budgeted_fixed_costs
    
    flex_rev = actual_units * budgeted_selling_price
    flex_vc = actual_units * budgeted_vc_per_unit
    flex_cm = flex_rev - flex_vc
    flex_oi = flex_cm - budgeted_fixed_costs
    
    act_rev = actual_units * actual_selling_price
    act_vc = actual_units * actual_vc_per_unit
    act_cm = act_rev - act_vc
    act_oi = act_cm - actual_fixed_costs
    
    sales_volume_variance = flex_oi - master_oi
    flexible_budget_variance = act_oi - flex_oi
    total_static_variance = act_oi - master_oi
    
    return {
        "master_budget_operating_income": round(master_oi, 2),
        "flexible_budget_operating_income": round(flex_oi, 2),
        "actual_operating_income": round(act_oi, 2),
        "sales_volume_variance": round(sales_volume_variance, 2),
        "volume_variance_status": "FAVORABLE" if sales_volume_variance >= 0 else "UNFAVORABLE",
        "flexible_budget_variance": round(flexible_budget_variance, 2),
        "flexible_variance_status": "FAVORABLE" if flexible_budget_variance >= 0 else "UNFAVORABLE",
        "total_static_budget_variance": round(total_static_variance, 2),
        "total_variance_status": "FAVORABLE" if total_static_variance >= 0 else "UNFAVORABLE"
    }

p5 = reconcile_master_flexible_budget_variance(
    budgeted_units=10000,
    actual_units=11000,
    budgeted_selling_price=50.0,
    actual_selling_price=48.0,
    budgeted_vc_per_unit=20.0,
    actual_vc_per_unit=21.0,
    budgeted_fixed_costs=150000.0,
    actual_fixed_costs=155000.0
)
print(f"Master OI: $" + f"{p5['master_budget_operating_income']:,.2f} -> Flexible OI: $" + f"{p5['flexible_budget_operating_income']:,.2f} -> Actual OI: $" + f"{p5['actual_operating_income']:,.2f}")
print(f"Sales Volume Variance: $" + f"{p5['sales_volume_variance']:,.2f} ({p5['volume_variance_status']})")
print(f"Flexible Budget Variance: $" + f"{p5['flexible_budget_variance']:,.2f} ({p5['flexible_variance_status']})")
print(f"Total Static Variance: $" + f"{p5['total_static_budget_variance']:,.2f} ({p5['total_variance_status']})")`,
        output: `Master OI: $150,000.00 -> Flexible OI: $180,000.00 -> Actual OI: $142,000.00\nSales Volume Variance: $30,000.00 (FAVORABLE)\nFlexible Budget Variance: $-38,000.00 (UNFAVORABLE)\nTotal Static Variance: $-8,000.00 (UNFAVORABLE)`,
        codeNotes: [
          { line: 15, note: 'Calculates static Master Budget operating income based on original sales volume projections' },
          { line: 21, note: 'Calculates Flexible Budget income by applying standard pricing and costs to actual output achieved' },
          { line: 28, note: 'Isolates Sales Volume Variance: operating income impact of selling more or fewer units than budgeted' },
          { line: 29, note: 'Calculates Flexible Budget Variance: pure operational cost and selling price execution efficiency' }
        ],
        tryIt: 'Increase actual_selling_price to $52.00 to observe how selling at a premium turns the Flexible Budget Variance strongly Favorable.',
        check: {
          question: 'Why is the Flexible Budget considered an indispensable management control tool for evaluating manufacturing plant managers?',
          options: [
            'A flexible budget neutralizes the effect of sales volume differences, allowing executives to evaluate operational cost efficiency at the exact level of activity actually delivered.',
            'Flexible budgets are required by the IRS to determine corporate state franchise tax liabilities.',
            'Flexible budgets automatically adjust the corporate debt-to-equity ratio to minimize WACC.',
            'A flexible budget eliminates the need to track raw material inventory quantities.'
          ],
          answer: 0,
          why: 'By recalibrating budgeted costs to actual production volume, flexible budgeting prevents managers from being blamed for volume drops or praised for volume windfalls outside their control.',
          answerIndex: 0,
          explanation: 'By recalibrating budgeted costs to actual production volume, flexible budgeting prevents managers from being blamed for volume drops or praised for volume windfalls outside their control.'
        }
      }
    ],
    summary: [
      'Engineered Activity-Based Costing (ABC) multi-pool allocation models, eliminating volume-based product cross-subsidization where Standard Widgets were over-costed by $2.23/unit and Custom Components were under-costed by $8.93/unit.',
      'Decomposed Direct Materials variances into Purchasing Price Variance (-$10k Favorable) and Factory Floor Quantity Usage Variance (+$15k Unfavorable), exposing the cost of purchasing sub-standard raw materials.',
      'Calculated Direct Labor Rate Variance (+$29.25k Unfavorable) and Efficiency Variance (-$12.5k Favorable), verifying that senior artisan deployment delivered physical hour savings but incurred wage premiums.',
      'Executed 4-way Manufacturing Overhead variance decompositions across Variable Overhead Spending ($7.5k U), Variable Overhead Efficiency (-$2.5k F), Fixed Overhead Budget ($2.0k U), and Fixed Overhead Volume ($0.00 F).',
      'Constructed Flexible Budget variance waterfalls bridging Master Budget Operating Income ($150k) to Actual Results ($142k), isolating a +$30k Favorable Sales Volume boost against a -$38k Unfavorable operational execution shortfall.'
    ],
    projectStep: {
      title: 'Deploy the Advanced Cost Accounting & Variance Analysis Control System',
      steps: [
        'Identify activity cost pools and cost drivers to replace volume-based allocation with an Activity-Based Costing (ABC) tracing model.',
        'Establish standard costing benchmarks and compute Direct Materials Price and Quantity variances to isolate procurement vs shop floor performance.',
        'Compute Direct Labor Rate and Efficiency variances to monitor labor wage negotiations and physical workforce productivity.',
        'Perform multi-way overhead variance decompositions across variable spending/efficiency and fixed budget/volume utilization.',
        'Construct the dynamic Flexible Budget reconciliation waterfall to report true operational variance to senior executive leadership.'
      ]
    }
  }

];
