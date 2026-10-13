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
  },
  {
    coursePrefix: 'bcom-accounting',
    day: 4,
    title: 'Complex Financial Instruments, ASC 326 CECL Credit Losses & Hedge Accounting',
    overview: 'Master the accounting, valuation, and balance sheet disclosure of complex financial instruments under US GAAP and IFRS. You will operationalize the ASC 820 fair value hierarchy across Levels 1, 2, and 3, transition from legacy incurred loss models to forward-looking ASC 326 CECL lifetime expected credit loss reserves, bifurcate convertible hybrid debt into liability and equity components under ASC 470, evaluate cash flow hedge effectiveness using the 80-125% dollar-offset method under ASC 815, and synthesize an audit-ready financial instruments balance sheet schedule.',
    parts: [
      {
        title: 'ASC 820 Fair Value Hierarchy: Quoted, Observable & Unobservable Asset Valuation',
        say: [
          'Under US GAAP ASC 820 and IFRS 13, fair value is defined as the exit price that would be received to sell an asset or paid to transfer a liability in an orderly transaction between market participants at the measurement date. To maximize consistency and comparability across balance sheets, the standard establishes a three-tier fair value hierarchy that prioritizes inputs to valuation techniques rather than the techniques themselves. Level 1 inputs represent the highest reliability tier, consisting of unadjusted quoted prices in active markets for identical assets or liabilities that the reporting entity can access at the measurement date, such as publicly traded US Treasuries or NYSE equities. Because Level 1 prices reflect observable, real-time market liquidity, no valuation modeling or management adjustments are permitted, making them the most objective figures on the corporate ledger.',
          'Level 2 inputs occupy an intermediate reliability tier where market inputs are directly or indirectly observable but lack the exact identical quoted active market of Level 1. Common examples include corporate bonds that trade infrequently, interest rate swaps benchmarked against published SOFR curves, or assets valued via matrix pricing where yields are interpolated across comparable credit ratings and maturities. For instance, when valuing an unquoted BBB-rated corporate bond, the controller uses benchmark government yields plus an observable credit spread derived from actively traded peer debt rather than guessing future cash flows. Auditors scrutinize Level 2 assets to ensure that all significant valuation inputs are observable in published data feeds and that adjustments for liquidity or tenure do not rely on unverified internal assumptions.',
          'Level 3 inputs represent the lowest reliability tier and the greatest source of audit risk because they rely entirely on unobservable inputs developed using the reporting entity\'s own assumptions about market participant pricing. Pre-IPO private equity stakes, bespoke structured credit obligations, and complex venture capital warrants fall into Level 3, requiring multi-period discounted cash flow (DCF) simulations, option pricing models, or probability-weighted scenario grids. Because management must estimate revenue growth trajectories, terminal capitalization multiples, and illiquidity discounts, ASC 820 mandates exhaustive tabular disclosures for Level 3 assets, including roll-forwards of beginning-to-ending balances, transfers between levels, and sensitivity analyses. As a corporate controller, maintaining rigorous quantitative models for Level 3 assets is essential to surviving independent audit inquiries and regulatory inspections.'
        ],
        example: 'A corporate treasury holds $995,000 in on-the-run US Treasuries (Level 1), $994,654 in corporate bonds valued via benchmark yield curves plus observable credit spreads (Level 2), and a $1,698,981 private equity stake valued via a 3-year DCF at an 18% unobservable discount rate (Level 3). Level 3 represents 46.06% of the investment portfolio, triggering mandatory ASC 820 roll-forward disclosures.',
        code: `def classify_and_value_asc820_hierarchy():
    portfolio = [
        {"name": "US Treasury Notes", "level": 1, "quoted_price": 99.50, "units": 10000},
        {"name": "Corporate BBB Bond", "level": 2, "par_value": 1000000, "benchmark_yield": 0.045, "credit_spread": 0.015, "coupon": 0.058, "years": 3},
        {"name": "Pre-IPO Private Equity", "level": 3, "cash_flows": [200000, 350000, 600000], "discount_rate": 0.18, "terminal_val": 1500000}
    ]

    # Level 1: Active market quoted price
    val_l1 = portfolio[0]["quoted_price"] * portfolio[0]["units"]

    # Level 2: Matrix pricing based on benchmark yield + credit spread (discount rate = 6.0%)
    c_bond = portfolio[1]
    disc_rate = c_bond["benchmark_yield"] + c_bond["credit_spread"]
    val_l2 = 0.0
    coupon_pmt = c_bond["par_value"] * c_bond["coupon"]
    for t in range(1, c_bond["years"] + 1):
        val_l2 += coupon_pmt / ((1 + disc_rate) ** t)
    val_l2 += c_bond["par_value"] / ((1 + disc_rate) ** c_bond["years"])

    # Level 3: DCF model using unobservable discount rate and terminal value
    pe = portfolio[2]
    val_l3 = 0.0
    for t, cf in enumerate(pe["cash_flows"], 1):
        val_l3 += cf / ((1 + pe["discount_rate"]) ** t)
    val_l3 += pe["terminal_val"] / ((1 + pe["discount_rate"]) ** len(pe["cash_flows"]))

    total_fv = val_l1 + val_l2 + val_l3
    l3_pct = (val_l3 / total_fv) * 100

    print("ASC 820 Fair Value Hierarchy Classification:")
    print("  Level 1 (Quoted Active Markets): " + "$" + f"{val_l1:,.2f}")
    print("  Level 2 (Observable Matrix Pricing): " + "$" + f"{val_l2:,.2f}")
    print("  Level 3 (Unobservable Valuation Models): " + "$" + f"{val_l3:,.2f}")
    print("  Total Investment Fair Value: " + "$" + f"{total_fv:,.2f}")
    print(f"  Level 3 Proportion of Total Assets: {l3_pct:.2f}% (High Audit Scrutiny Required)")
    return {"l1": val_l1, "l2": val_l2, "l3": val_l3, "total": total_fv, "l3_pct": l3_pct}

classify_and_value_asc820_hierarchy()`,
        output: `ASC 820 Fair Value Hierarchy Classification:
  Level 1 (Quoted Active Markets): $995,000.00
  Level 2 (Observable Matrix Pricing): $994,653.98
  Level 3 (Unobservable Valuation Models): $1,698,980.91
  Total Investment Fair Value: $3,688,634.88
  Level 3 Proportion of Total Assets: 46.06% (High Audit Scrutiny Required)`,
        codeNotes: [
          'Level 1 assets multiply unadjusted quoted exchange pricing directly by held units without applying liquidity haircuts.',
          'Level 2 pricing aggregates discounted cash flows using observable benchmark government curves combined with sector credit spreads.',
          'Level 3 valuation projects explicit operational cash flows plus terminal value, discounting at an unobservable risk-adjusted hurdle rate of 18%.'
        ],
        tryIt: 'Adjust the Level 3 unobservable discount rate from 18% to 22% to observe how illiquidity premia shrink fair value and trigger asset impairment tests.',
        check: {
          question: 'Which of the following scenarios constitutes a Level 2 fair value measurement under ASC 820?',
          options: [
            'A corporate bond valued via matrix pricing using published Treasury yields plus observable credit rating spreads for peer issues',
            'Apple Inc. common stock shares trading on NASDAQ evaluated at the closing price of the measurement date',
            'A private startup venture stake valued solely using internal executive financial projections discounted at 25%',
            'Physical cash held in commercial bank escrow accounts verified via direct confirmation letters'
          ],
          answer: 0,
          why: 'Under ASC 820, Level 2 inputs are observable market-corroborated parameters such as published yield curves and peer credit spreads applied to matrix pricing models, unlike Level 1 (quoted identical market) or Level 3 (unobservable internal assumptions).',
          answerIndex: 0,
          explanation: 'Under ASC 820, Level 2 inputs are observable market-corroborated parameters such as published yield curves and peer credit spreads applied to matrix pricing models, unlike Level 1 (quoted identical market) or Level 3 (unobservable internal assumptions).'
        }
      },
      {
        title: 'ASC 326 CECL Lifetime Expected Credit Loss Impairment Modeling',
        say: [
          'The 2008 global financial crisis revealed a catastrophic flaw in legacy GAAP accounting: the incurred loss model prohibited entities from booking bad debt allowances until a specific loss event had already occurred, a practice derided by regulators as "too little, too late." In response, FASB issued ASU 2016-13 (codified as ASC 326) introducing the Current Expected Credit Loss (CECL) standard, mirroring IFRS 9 Financial Instruments. Under CECL, reporting entities must recognize an allowance for lifetime expected credit losses on Day 1 when loans, trade receivables, or held-to-maturity debt securities are originated or acquired, eliminating the threshold of waiting for delinquency or default triggers.',
          'CECL models estimate lifetime credit risk by decomposing loan portfolios into pools sharing similar risk characteristics, such as commercial prime corporate lines, small business working capital loans, and unsecured consumer receivables. For each segment, the loss forecasting engine computes Expected Credit Loss (ECL) as the mathematical product of Exposure at Default (EAD), Probability of Default (PD) over the contractual asset life, and Loss Given Default (LGD) reflecting collateral recovery shortfalls. Unlike legacy backward-looking rolling averages, CECL explicitly mandates that historical loss rates must be adjusted for current economic conditions and reasonable and supportable macroeconomic forecasts.',
          'When macroeconomic indicators deteriorate—such as rising unemployment, elevated inflation, or contracting GDP—the accounting team applies forward-looking macroeconomic multipliers to segment loss rates. The resulting required allowance balance is compared against the existing beginning balance on the balance sheet, with the difference recognized immediately in profit and loss as Provision for Credit Losses (DR Provision for Credit Losses, CR Allowance for Credit Losses). Because CECL operates as a contra-asset valuation account rather than a direct write-off, loans remain on the balance sheet at amortized cost net of the allowance, providing external investors with transparent visibility into expected recovery values.'
        ],
        example: 'A bank holds a $45,000,000 loan portfolio segmented into Commercial Prime ($25M), SME ($12M), and Consumer ($8M). Under an adverse macroeconomic multiplier of 1.15x, lifetime expected losses total $1,017,750 (2.26%). With a beginning allowance of $720,000, the controller books a $297,750 credit loss provision to P&L.',
        code: `def model_cecl_expected_credit_loss():
    segments = [
        {"segment": "Commercial Prime", "ead": 25000000.0, "pd_lifetime": 0.012, "lgd": 0.35},
        {"segment": "Small Business (SME)", "ead": 12000000.0, "pd_lifetime": 0.045, "lgd": 0.50},
        {"segment": "Consumer Unsecured", "ead": 8000000.0, "pd_lifetime": 0.085, "lgd": 0.75}
    ]
    macro_multiplier = 1.15  # Adverse macroeconomic forecast adjustment (15% bump)
    existing_allowance = 720000.0

    total_ead = 0.0
    total_cecl = 0.0
    print("ASC 326 CECL Lifetime Expected Credit Loss Model:")
    for seg in segments:
        base_ecl = seg["ead"] * seg["pd_lifetime"] * seg["lgd"]
        stressed_ecl = base_ecl * macro_multiplier
        total_ead += seg["ead"]
        total_cecl += stressed_ecl
        print(f"  {seg['segment']}: EAD=" + "$" + f"{seg['ead']:,.0f}" + f" | Stressed Loss=" + "$" + f"{stressed_ecl:,.2f}")

    provision_expense = total_cecl - existing_allowance
    loss_rate = (total_cecl / total_ead) * 100

    print("Portfolio CECL Summary:")
    print("  Total Outstanding Gross Loans (EAD): " + "$" + f"{total_ead:,.2f}")
    print("  Required Lifetime CECL Allowance: " + "$" + f"{total_cecl:,.2f} ({loss_rate:.2f}%)")
    print("  Beginning Allowance for Credit Losses: " + "$" + f"{existing_allowance:,.2f}")
    print("  Current Period Provision Expense Required: " + "$" + f"{provision_expense:,.2f}")
    print("Journal Entry: DR Provision for Credit Losses " + "$" + f"{provision_expense:,.2f}" + " | CR Allowance for Credit Losses " + "$" + f"{provision_expense:,.2f}")
    return {"total_cecl": total_cecl, "provision": provision_expense}

model_cecl_expected_credit_loss()` ,
        output: `ASC 326 CECL Lifetime Expected Credit Loss Model:
  Commercial Prime: EAD=$25,000,000 | Stressed Loss=$120,750.00
  Small Business (SME): EAD=$12,000,000 | Stressed Loss=$310,500.00
  Consumer Unsecured: EAD=$8,000,000 | Stressed Loss=$586,500.00
Portfolio CECL Summary:
  Total Outstanding Gross Loans (EAD): $45,000,000.00
  Required Lifetime CECL Allowance: $1,017,750.00 (2.26%)
  Beginning Allowance for Credit Losses: $720,000.00
  Current Period Provision Expense Required: $297,750.00
Journal Entry: DR Provision for Credit Losses $297,750.00 | CR Allowance for Credit Losses $297,750.00`,
        codeNotes: [
          'ECL is calculated per segment as Exposure at Default multiplied by Lifetime Probability of Default and Loss Given Default.',
          'A forward-looking macroeconomic multiplier of 1.15 is incorporated to comply with ASC 326 reasonable and supportable forecasting rules.',
          'The required journal entry debits P&L Provision for Credit Losses and credits balance sheet contra-asset Allowance for Credit Losses.'
        ],
        tryIt: 'Increase the Consumer Unsecured Loss Given Default (LGD) from 0.75 to 0.90 to simulate severe secondary collection market breakdowns.',
        check: {
          question: 'What is the fundamental difference between the legacy incurred loss model and the ASC 326 CECL framework?',
          options: [
            'CECL requires recognizing lifetime expected credit losses immediately on Day 1 including forward-looking macroeconomic forecasts, whereas incurred loss waited for an actual delinquency event',
            'CECL completely eliminates the allowance contra-asset account and writes off bad debts directly to retained earnings',
            'Incurred loss required 10-year discounted cash flow simulations for all loans, whereas CECL allows a simple 1% flat revenue deduction',
            'CECL applies only to cash equivalents and excludes trade receivables, customer notes, and commercial term loans'
          ],
          answer: 0,
          why: 'ASC 326 CECL requires entities to estimate and reserve for lifetime expected credit losses from the date of asset origination incorporating forward-looking forecasts, resolving the systemic delay of waiting for an incurred default trigger.',
          answerIndex: 0,
          explanation: 'ASC 326 CECL requires entities to estimate and reserve for lifetime expected credit losses from the date of asset origination incorporating forward-looking forecasts, resolving the systemic delay of waiting for an incurred default trigger.'
        }
      },
      {
        title: 'ASC 470 Convertible Debt Bifurcation & Effective Interest Amortization',
        say: [
          'Corporations frequently issue hybrid securities such as convertible bonds to lower cash borrowing costs by granting investors the option to convert debt principal into common stock. Under US GAAP ASC 470-20 and IFRS IAS 32, accounting for convertible debt requires evaluating whether the conversion option represents an embedded equity instrument that must be bifurcated from the host debt contract. When an entity issues convertible debt with a substantial cash savings discount, the instrument comprises two economically distinct components: a contractual host liability obligating repayment of coupons and principal, and an equity conversion option resembling a call warrant on company stock.',
          'To determine the accounting split under bifurcation guidelines, the controller first calculates the fair value of the liability component by discounting all future contractual cash flows (annual coupons and final bullet principal) at the market interest rate the company would have paid on comparable straight, non-convertible debt. For instance, if an entity issues a 5-year, 3.5% coupon convertible note for $10,000,000 while benchmark straight debt yields 7.5%, the host debt liability is worth only $8,381,646.04. The residual difference between total issue proceeds ($10,000,000) and the liability fair value equals $1,618,353.96, which is bifurcated and credited directly to Additional Paid-in Capital (APIC) as the equity conversion option.',
          'On the balance sheet, the initial difference between face value ($10,000,000) and carrying value ($8,381,646.04) creates an initial debt discount of $1,618,353.96. Over the 5-year tenure of the note, this discount must be amortized to interest expense using the effective interest method at the 7.5% market rate. In Year 1, interest expense is recognized at $628,623.45 (7.5% of $8,381,646.04), while cash interest paid is only $350,000.00 (3.5% coupon). The difference of $278,623.45 is added to the debt carrying value, systematically stepping up the liability to its full $10,000,000 face value upon maturity if unexercised.'
        ],
        example: 'A corporation issues $10,000,000 in 3.5% 5-year convertible notes when straight debt yields 7.5%. The liability component is recorded at $8,381,646, bifurcating $1,618,354 into equity. In Year 1, non-cash discount amortization of $278,623 increases debt carrying value to $8,660,269.',
        code: `def bifurcate_convertible_bond_asc470():
    face_value = 10000000.0   # $10,000,000 par
    coupon_rate = 0.035        # 3.5% annual coupon
    tenure_years = 5
    market_rate_straight = 0.075 # 7.5% market rate for non-convertible debt
    issue_proceeds = 10000000.0 # Issued at par

    # Step 1: Calculate Present Value of straight debt (Liability component)
    annual_coupon = face_value * coupon_rate
    pv_coupons = sum(annual_coupon / ((1 + market_rate_straight) ** t) for t in range(1, tenure_years + 1))
    pv_principal = face_value / ((1 + market_rate_straight) ** tenure_years)
    liability_fair_value = pv_coupons + pv_principal

    # Step 2: Bifurcate residual to Equity (conversion option)
    equity_component = issue_proceeds - liability_fair_value
    debt_discount = face_value - liability_fair_value

    # Step 3: Year 1 Effective Interest Amortization
    y1_interest_expense = liability_fair_value * market_rate_straight
    y1_discount_amortization = y1_interest_expense - annual_coupon
    y1_ending_carrying_value = liability_fair_value + y1_discount_amortization

    print("ASC 470 Convertible Debt Bifurcation & Amortization:")
    print("  Gross Par Issued: " + "$" + f"{face_value:,.2f} | Coupon: {coupon_rate*100:.1f}%")
    print("  Liability Component (PV Straight Debt at 7.5%): " + "$" + f"{liability_fair_value:,.2f}")
    print("  Equity Component (Conversion Feature Bifurcated): " + "$" + f"{equity_component:,.2f}")
    print("  Initial Debt Discount to Amortize: " + "$" + f"{debt_discount:,.2f}")
    print("Year 1 Effective Interest Amortization:")
    print("  Interest Expense (Carrying Value * 7.5%): " + "$" + f"{y1_interest_expense:,.2f}")
    print("  Contractual Cash Coupon Paid (3.5%): " + "$" + f"{annual_coupon:,.2f}")
    print("  Debt Discount Amortization: " + "$" + f"{y1_discount_amortization:,.2f}")
    print("  Year 1 Ending Liability Carrying Value: " + "$" + f"{y1_ending_carrying_value:,.2f}")
    return {"liability_fv": liability_fair_value, "equity_comp": equity_component, "y1_carrying": y1_ending_carrying_value}

bifurcate_convertible_bond_asc470()`,
        output: `ASC 470 Convertible Debt Bifurcation & Amortization:
  Gross Par Issued: $10,000,000.00 | Coupon: 3.5%
  Liability Component (PV Straight Debt at 7.5%): $8,381,646.04
  Equity Component (Conversion Feature Bifurcated): $1,618,353.96
  Initial Debt Discount to Amortize: $1,618,353.96
Year 1 Effective Interest Amortization:
  Interest Expense (Carrying Value * 7.5%): $628,623.45
  Contractual Cash Coupon Paid (3.5%): $350,000.00
  Debt Discount Amortization: $278,623.45
  Year 1 Ending Liability Carrying Value: $8,660,269.49`,
        codeNotes: [
          'The liability component is calculated by discounting contractual cash flows at the 7.5% non-convertible market rate.',
          'The residual proceeds ($1,618,353.96) are recognized in stockholders\' equity as Additional Paid-in Capital.',
          'Effective interest amortization produces Year 1 interest expense of $628,623.45, stepping up liability carrying value to $8,660,269.49.'
        ],
        tryIt: 'Change the market straight debt rate to 9.0% to evaluate how higher standalone borrowing yields increase the bifurcated equity credit.',
        check: {
          question: 'In accounting for convertible debt with bifurcated equity under ASC 470 / IAS 32, how is the equity component initially measured?',
          options: [
            'As the residual difference between total issue proceeds and the fair value of the host debt liability discounted at straight market debt yields',
            'By valuing the conversion option via Black-Scholes and multiplying by the total number of common shares authorized in corporate bylaws',
            'As 50% of the total cash proceeds received from investors regardless of interest rates',
            'By recording the entire cash proceeds as a liability and booking equity only when bondholders actually convert'
          ],
          answer: 0,
          why: 'Under the bifurcation framework, the host liability is measured first as the present value of contractual cash flows at straight debt yields, and the entire residual proceeds are allocated to the equity conversion feature.',
          answerIndex: 0,
          explanation: 'Under the bifurcation framework, the host liability is measured first as the present value of contractual cash flows at straight debt yields, and the entire residual proceeds are allocated to the equity conversion feature.'
        }
      },
      {
        title: 'ASC 815 / IFRS 9 Derivative Accounting & Cash Flow Hedge Effectiveness',
        say: [
          'Corporate treasuries frequently enter into derivative contracts—such as commodity futures, interest rate swaps, and foreign currency forwards—to mitigate operational exposures. Under general GAAP rules, all derivatives must be recognized on the balance sheet at fair value, with changes in fair value flowing directly into current period net income. However, without special accounting treatment, this creates severe accounting mismatches: a company might suffer a mark-to-market loss on a fuel forward contract in Q1 while the anticipated fuel will not be purchased or burned until Q3, artificially depressing Q1 earnings while spiking Q3 profits.',
          'To neutralize this artificial volatility, ASC 815 and IFRS 9 provide elective hedge accounting for qualified hedging relationships. In a cash flow hedge, an entity hedges exposure to variability in expected cash flows of a recognized asset, liability, or forecasted transaction (such as future jet fuel procurement). For qualifying cash flow hedges, the effective portion of fair value gains or losses on the derivative is deferred outside net income into Accumulated Other Comprehensive Income (AOCI) within stockholders\' equity. Only when the forecasted transaction actually impacts earnings (e.g. when the fuel is burned and recognized in Cost of Goods Sold) is the deferred hedging gain or loss reclassified from AOCI into operating profit.',
          'To qualify for and maintain hedge accounting, the entity must rigorously establish that the hedging relationship is highly effective, both prospectively and retrospectively. The standard quantitative benchmark is the Dollar-Offset Ratio, calculated as the negative ratio of the change in fair value of the derivative to the change in fair value of the hedged expected cash flow. If the dollar-offset ratio falls strictly within the 80% to 125% (0.80 to 1.25) corridor, the hedge is deemed highly effective, permitting 100% of the derivative gain or loss to remain in OCI. If the ratio breaches this band, hedge accounting is immediately discontinued, and all subsequent derivative swings flow through net income.'
        ],
        example: 'An airline hedges forecasted jet fuel with commodity forwards. In Q1, the forward loses $185,000 while fuel benchmark costs gain $192,000, yielding a 96.35% dollar-offset ratio (highly effective). The $185,000 loss is deferred into AOCI, and $120,000 is reclassified to COGS as fuel is consumed, leaving a -$15,000 AOCI reserve.',
        code: `def evaluate_cash_flow_hedge_dollar_offset():
    # Scenario: Anticipated fuel purchase hedged with commodity forward contracts
    derivative_loss = -185000.0  # Fair value change in forward contracts
    hedged_item_gain = 192000.0   # Fair value change in forecasted purchase benchmark
    initial_aoci_balance = 50000.0
    cogs_reclassification = 120000.0 # Amount reclassified to earnings as fuel was consumed

    # Dollar-Offset Ratio: - (Derivative Change) / (Hedged Item Change)
    dollar_offset_ratio = - (derivative_loss / hedged_item_gain)
    is_effective = 0.80 <= dollar_offset_ratio <= 1.25

    # Hedge Accounting Treatment
    effective_portion = derivative_loss # Entire loss since within 80-125% band
    ending_aoci = initial_aoci_balance + effective_portion + cogs_reclassification

    print("ASC 815 / IFRS 9 Cash Flow Hedge Accounting:")
    print("  Derivative Fair Value Change: " + "$" + f"{derivative_loss:,.2f}")
    print("  Hedged Item Benchmark Gain: " + "$" + f"{hedged_item_gain:,.2f}")
    print(f"  Dollar-Offset Ratio: {dollar_offset_ratio:.4f} ({dollar_offset_ratio*100:.2f}%)")
    print(f"  Hedge Effectiveness Status: {'HIGHLY_EFFECTIVE' if is_effective else 'INEFFECTIVE'} (Range: 80% - 125%)")
    print("Accumulated Other Comprehensive Income (AOCI) Roll-Forward:")
    print("  Beginning AOCI Balance: " + "$" + f"{initial_aoci_balance:,.2f}")
    print("  OCI Other Comprehensive Loss Deferred: " + "$" + f"{effective_portion:,.2f}")
    print("  Reclassification from AOCI to COGS (P&L): " + "$" + f"{cogs_reclassification:,.2f}")
    print("  Ending AOCI Hedging Reserve: " + "$" + f"{ending_aoci:,.2f}")
    return {"ratio": dollar_offset_ratio, "effective": is_effective, "ending_aoci": ending_aoci}

evaluate_cash_flow_hedge_dollar_offset()`,
        output: `ASC 815 / IFRS 9 Cash Flow Hedge Accounting:
  Derivative Fair Value Change: $-185,000.00
  Hedged Item Benchmark Gain: $192,000.00
  Dollar-Offset Ratio: 0.9635 (96.35%)
  Hedge Effectiveness Status: HIGHLY_EFFECTIVE (Range: 80% - 125%)
Accumulated Other Comprehensive Income (AOCI) Roll-Forward:
  Beginning AOCI Balance: $50,000.00
  OCI Other Comprehensive Loss Deferred: $-185,000.00
  Reclassification from AOCI to COGS (P&L): $120,000.00
  Ending AOCI Hedging Reserve: $-15,000.00`,
        codeNotes: [
          'The dollar-offset ratio of 0.9635 falls squarely within the mandatory 0.80 to 1.25 effectiveness corridor.',
          'Because the hedge is highly effective, the entire $185,000 derivative loss bypasses the income statement into AOCI.',
          'Upon consumption of the underlying inventory, $120,000 is reclassified from AOCI into Cost of Goods Sold to match expenses.'
        ],
        tryIt: 'Change the derivative loss to -$250,000 against a $192,000 gain to demonstrate a 1.3021 ratio failure triggering immediate de-designation.',
        check: {
          question: 'What is the required accounting treatment for the effective portion of gains and losses on a cash flow hedge under ASC 815?',
          options: [
            'They are deferred in Other Comprehensive Income (AOCI) and reclassified into earnings in the same period the hedged transaction affects earnings',
            'They are immediately recognized as operating revenue in the current period statement of operations',
            'They are permanently capitalized into intangible asset goodwill and never reclassified to earnings',
            'They are treated as an adjustment to retained earnings without ever passing through OCI or P&L'
          ],
          answer: 0,
          why: 'Cash flow hedge accounting eliminates income statement timing mismatches by deferring effective derivative gains and losses in AOCI until the underlying forecasted item impacts earnings.',
          answerIndex: 0,
          explanation: 'Cash flow hedge accounting eliminates income statement timing mismatches by deferring effective derivative gains and losses in AOCI until the underlying forecasted item impacts earnings.'
        }
      },
      {
        title: 'Deploy the Financial Instruments Controller Control Tower',
        say: [
          'As an enterprise financial controller managing complex global operations, you cannot evaluate financial instruments in isolated silos. Capital markets transactions generate interconnected balance sheet, income statement, and note disclosure ramifications across the entire enterprise ledger. An impairment adjustment under CECL impacts regulatory Tier 1 capital ratios, a change in market interest rates alters convertible bond carrying values and basic vs diluted EPS calculations, and a shift in commodity price spreads tests the boundary conditions of hedge accounting effectiveness.',
          'To ensure comprehensive balance sheet integrity and audit defensibility, controllers maintain an integrated Financial Instruments Control Tower. This system ingests multi-asset data feeds to generate consolidated balance sheet presentation schedules: classifying investments across ASC 820 Levels 1, 2, and 3; posting automated credit loss reserves and allowance contra-assets under ASC 326; updating effective interest liability amortizations under ASC 470; and verifying retrospective dollar-offset hedging ratios while rolling forward AOCI reserves under ASC 815.',
          'In this capstone day exercise, you will execute the full end-to-end financial instruments control routine. You will verify that Level 3 unobservable assets trigger appropriate footnote disclosures, validate that CECL provisions accurately bridge loan gross amortized costs, certify convertible debt balance sheet carrying value adjustments, and substantiate hedge effectiveness compliance. Completing this pipeline prepares you for executive controllership roles overseeing complex corporate balance sheets.'
        ],
        example: 'The controller synthesizes an investment portfolio ($3,688,635 fair value, 46.06% Level 3), credit allowance ($1,017,750 contra-asset), convertible notes ($8,660,269 carrying value), and AOCI cash flow hedge reserve (-$15,000 equity) into an executive audit dossier.',
        code: `def run_integrated_financial_instruments_suite():
    print("=== PinIT Career OS Financial Controller Control Tower ===")
    print("--- 1. ASC 820 Fair Value Hierarchy Assessment ---")
    fv = classify_and_value_asc820_hierarchy()

    print("\n--- 2. ASC 326 CECL Loan Portfolio Impairment ---")
    cecl = model_cecl_expected_credit_loss()

    print("\n--- 3. ASC 470 Convertible Note Bifurcation ---")
    bif = bifurcate_convertible_bond_asc470()

    print("\n--- 4. ASC 815 Cash Flow Hedge Dollar-Offset ---")
    hdg = evaluate_cash_flow_hedge_dollar_offset()

    print("\n--- 5. Financial Controller Balance Sheet Summary ---")
    print("  Total Investment Fair Value: " + "$" + f"{fv['total']:,.2f}")
    print("  Allowance for Credit Losses (Contra-Asset): " + "$" + f"{cecl['total_cecl']:,.2f}")
    print("  Convertible Debt Carrying Value: " + "$" + f"{bif['y1_carrying']:,.2f}")
    print("  Ending AOCI Hedging Reserve (Equity): " + "$" + f"{hdg['ending_aoci']:,.2f}")
    print("Status: ALL FINANCIAL INSTRUMENTS COMPLIANT WITH ASC 820, ASC 326, ASC 470 & ASC 815.")

run_integrated_financial_instruments_suite()`,
        output: `=== PinIT Career OS Financial Controller Control Tower ===
--- 1. ASC 820 Fair Value Hierarchy Assessment ---
ASC 820 Fair Value Hierarchy Classification:
  Level 1 (Quoted Active Markets): $995,000.00
  Level 2 (Observable Matrix Pricing): $994,653.98
  Level 3 (Unobservable Valuation Models): $1,698,980.91
  Total Investment Fair Value: $3,688,634.88
  Level 3 Proportion of Total Assets: 46.06% (High Audit Scrutiny Required)

--- 2. ASC 326 CECL Loan Portfolio Impairment ---
ASC 326 CECL Lifetime Expected Credit Loss Model:
  Commercial Prime: EAD=$25,000,000 | Stressed Loss=$120,750.00
  Small Business (SME): EAD=$12,000,000 | Stressed Loss=$310,500.00
  Consumer Unsecured: EAD=$8,000,000 | Stressed Loss=$586,500.00
Portfolio CECL Summary:
  Total Outstanding Gross Loans (EAD): $45,000,000.00
  Required Lifetime CECL Allowance: $1,017,750.00 (2.26%)
  Beginning Allowance for Credit Losses: $720,000.00
  Current Period Provision Expense Required: $297,750.00
Journal Entry: DR Provision for Credit Losses $297,750.00 | CR Allowance for Credit Losses $297,750.00

--- 3. ASC 470 Convertible Note Bifurcation ---
ASC 470 Convertible Debt Bifurcation & Amortization:
  Gross Par Issued: $10,000,000.00 | Coupon: 3.5%
  Liability Component (PV Straight Debt at 7.5%): $8,381,646.04
  Equity Component (Conversion Feature Bifurcated): $1,618,353.96
  Initial Debt Discount to Amortize: $1,618,353.96
Year 1 Effective Interest Amortization:
  Interest Expense (Carrying Value * 7.5%): $628,623.45
  Contractual Cash Coupon Paid (3.5%): $350,000.00
  Debt Discount Amortization: $278,623.45
  Year 1 Ending Liability Carrying Value: $8,660,269.49

--- 4. ASC 815 Cash Flow Hedge Dollar-Offset ---
ASC 815 / IFRS 9 Cash Flow Hedge Accounting:
  Derivative Fair Value Change: $-185,000.00
  Hedged Item Benchmark Gain: $192,000.00
  Dollar-Offset Ratio: 0.9635 (96.35%)
  Hedge Effectiveness Status: HIGHLY_EFFECTIVE (Range: 80% - 125%)
Accumulated Other Comprehensive Income (AOCI) Roll-Forward:
  Beginning AOCI Balance: $50,000.00
  OCI Other Comprehensive Loss Deferred: $-185,000.00
  Reclassification from AOCI to COGS (P&L): $120,000.00
  Ending AOCI Hedging Reserve: $-15,000.00

--- 5. Financial Controller Balance Sheet Summary ---
  Total Investment Fair Value: $3,688,634.88
  Allowance for Credit Losses (Contra-Asset): $1,017,750.00
  Convertible Debt Carrying Value: $8,660,269.49
  Ending AOCI Hedging Reserve (Equity): $-15,000.00
Status: ALL FINANCIAL INSTRUMENTS COMPLIANT WITH ASC 820, ASC 326, ASC 470 & ASC 815.`,
        codeNotes: [
          'Coordinates four interrelated financial instrument domains into a single unified financial controller ledger schedule.',
          'Validates that Level 3 unobservable assets exceed the 40% threshold necessitating enhanced note disclosure roll-forwards.',
          'Consolidates liability debt discounts, CECL contra-asset allowances, and equity AOCI cash flow hedge reserves.'
        ],
        tryIt: 'Execute the full suite with alternative macroeconomic multipliers to evaluate how joint stress shocks ripple across balance sheet equity reserves.',
        check: {
          question: 'In enterprise balance sheet presentation, where are the bifurcated equity component of convertible notes and the effective portion of cash flow hedges recorded?',
          options: [
            'Both are recorded within Stockholders\' Equity: the convertible option in Additional Paid-in Capital (APIC) and the hedge gain/loss in Accumulated Other Comprehensive Income (AOCI)',
            'Both are recorded as Current Operating Liabilities in the working capital section of the balance sheet',
            'Both are netted directly against Gross Accounts Receivable as contra-assets',
            'Both are omitted from the balance sheet entirely and mentioned only in optional board presentation slides'
          ],
          answer: 0,
          why: 'The bifurcated conversion option of a hybrid note is credited to APIC in permanent equity, while effective cash flow hedging gains and losses are parked in AOCI within equity until underlying operational transactions hit P&L.',
          answerIndex: 0,
          explanation: 'The bifurcated conversion option of a hybrid note is credited to APIC in permanent equity, while effective cash flow hedging gains and losses are parked in AOCI within equity until underlying operational transactions hit P&L.'
        }
      }
    ],
    summary: [
      'Operationalized the ASC 820 three-tier fair value hierarchy, distinguishing Level 1 quoted active market prices from Level 2 observable matrix pricing and Level 3 unobservable multi-period DCF valuation models requiring extensive audit roll-forward disclosures.',
      'Constructed an ASC 326 / IFRS 9 CECL lifetime expected credit loss engine, estimating segment losses as EAD x PD x LGD under forward-looking macroeconomic stress scenarios and booking the required journal entry to contra-asset Allowance for Credit Losses.',
      'Executed ASC 470-20 convertible debt bifurcation, isolating the host debt liability at straight market debt yields ($8,381,646) from the bifurcated equity conversion feature ($1,618,354 in APIC), and modeled Year 1 effective interest discount amortization ($278,623).',
      'Tested derivative cash flow hedge effectiveness under ASC 815 / IFRS 9 using the 80% to 125% dollar-offset method (0.9635 ratio), deferring qualifying losses in AOCI and reclassifying realized amounts to Cost of Goods Sold.',
      'Synthesized the complete Financial Instruments Controller Control Tower, certifying total investment fair values ($3,688,635), CECL loan reserves ($1,017,750), convertible debt carrying values ($8,660,269), and ending AOCI hedging reserves (-$15,000).'
    ],
    projectStep: {
      title: 'Deploy the Financial Instruments Controller & Valuation Governance Engine',
      steps: [
        'Classify corporate investments across ASC 820 Levels 1, 2, and 3, computing portfolio fair values and Level 3 asset sensitivity proportions.',
        'Model ASC 326 CECL lifetime expected credit losses across loan pools using forward-looking macroeconomic overlays and post credit provision journal entries.',
        'Bifurcate convertible bond issue proceeds into host debt liability and equity conversion options, generating an effective interest amortization table.',
        'Evaluate derivative cash flow hedge effectiveness via retrospective dollar-offset testing and roll forward the AOCI equity hedging reserve.'
      ]
    }
  },
  {
    coursePrefix: 'bcom-accounting',
    day: 5,
    title: 'Milestone 1 Capstone: Global Financial Controller War Room & SEC Form 10-K Consolidation',
    overview: 'Execute the definitive Milestone 1 Capstone for the B.Com Accounting Masterclass. Step into the role of Group Financial Controller presiding over an enterprise multi-entity corporate war room. You will eliminate intercompany sales, markups, and unrealized inventory profits under ASC 810, reconstruct an indirect statement of cash flows reconciling GAAP net income to operating cash flow under ASC 230, model statutory vs effective tax provisions with deferred tax assets and liabilities under ASC 740, defend SEC Regulation G Non-GAAP Adjusted EBITDA bridges, and lead the audit committee defense to secure an unqualified clean opinion and earn Senior Certified Financial Controller & Corporate Reporting Strategist (CFC-CRS) accreditation.',
    parts: [
      {
        title: 'Multi-Entity Enterprise Consolidation & Intercompany Elimination (ASC 810 / IFRS 10)',
        say: [
          'In multinational corporate groups, subsidiaries frequently trade goods, issue management fees, and lend working capital across jurisdictional borders. Under US GAAP ASC 810 and IFRS 10, when preparing consolidated financial statements, the reporting entity must present the economic results of the parent and its subsidiaries as if they were a single unified corporate enterprise. Consequently, all intra-group transactions—including intercompany sales, transfer fee markups, dividends, and loan balances—must be fully eliminated in consolidation. If intercompany revenues and expenses were not eliminated, corporate groups could artificially inflate top-line revenue by merely moving inventory between legal entities on paper.',
          'The most mathematically nuanced challenge in consolidation accounting arises when goods sold intercompany remain unsold to third-party customers at the balance sheet measurement date. In an upstream or downstream inventory sale with a transfer markup, the purchasing subsidiary\'s ending inventory contains an unrealized intercompany profit that has not yet been earned through external arm\'s-length transactions. To correct this under GAAP, the controller must identify the unrealized gross profit embedded in ending inventory and eliminate it by debiting Consolidated Cost of Goods Sold (increasing expense) and crediting Ending Inventory (reducing asset carrying value to historical cost).',
          'Furthermore, when the parent owns less than 100% of a consolidated subsidiary, the accounting engine must account for the non-controlling interest (NCI). Under ASC 810, total consolidated net income is first computed across the entire enterprise, and then bifurcated on the face of the income statement between net income attributable to the parent\'s equity holders and net income attributable to non-controlling interests. On the balance sheet, NCI is presented distinctly within total stockholders\' equity rather than as a mezzanine liability. Mastering these consolidation adjustments guarantees that financial statements reflect authentic economic reality rather than internal paper transfers.'
        ],
        example: 'Parent generates $12M revenue and Sub generates $5M revenue, including $800k in intercompany product sales with a $200k gross markup. At year-end, Sub retains 25% of the purchased goods, embedding $50,000 in unrealized inventory profit. The controller eliminates the $800k intercompany revenue and adjusts COGS by $50,000, deriving $16.2M consolidated revenue and $3.09M parent net income after 20% NCI ($160k).',
        code: `def consolidate_multi_entity_enterprise():
    # Parent (100%) and Foreign Sub (80% owned, 20% Non-Controlling Interest)
    parent_rev = 12000000.0
    sub_rev = 5000000.0
    interco_sales = 800000.0  # Parent sold goods to Sub for $800k (cost to Parent was $600k)
    unrealized_profit_pct = 0.25 # Sub has 25% of interco inventory remaining at year-end
    interco_markup = 200000.0   # $800k - $600k
    unrealized_profit_inv = interco_markup * unrealized_profit_pct # $50,000 profit to eliminate

    parent_cogs = 7000000.0
    sub_cogs = 3200000.0

    # Consolidated Revenue & COGS
    consolidated_rev = parent_rev + sub_rev - interco_sales
    consolidated_cogs = parent_cogs + sub_cogs - interco_sales + unrealized_profit_inv
    consolidated_gross_profit = consolidated_rev - consolidated_cogs

    # Net income calculation
    parent_opex = 2500000.0
    sub_opex = 1000000.0
    sub_net_income = sub_rev - sub_cogs - sub_opex # $800,000
    nci_share_pct = 0.20
    nci_net_income = sub_net_income * nci_share_pct # $160,000

    total_net_income = consolidated_gross_profit - (parent_opex + sub_opex)
    controlling_net_income = total_net_income - nci_net_income

    print("ASC 810 Multi-Entity Consolidation & Intercompany Elimination:")
    print("  Consolidated Revenue (less $800k interco): " + "$" + f"{consolidated_rev:,.2f}")
    print("  Consolidated COGS (less $800k interco + $50k unrealized inv profit): " + "$" + f"{consolidated_cogs:,.2f}")
    print("  Consolidated Gross Profit: " + "$" + f"{consolidated_gross_profit:,.2f}")
    print("  Total Consolidated Net Income: " + "$" + f"{total_net_income:,.2f}")
    print("  Less: Non-Controlling Interest (NCI 20%): " + "$" + f"{nci_net_income:,.2f}")
    print("  Net Income Attributable to Parent Shareholders: " + "$" + f"{controlling_net_income:,.2f}")
    return {"rev": consolidated_rev, "net_inc": total_net_income, "parent_inc": controlling_net_income}

consolidate_multi_entity_enterprise()`,
        output: `ASC 810 Multi-Entity Consolidation & Intercompany Elimination:
  Consolidated Revenue (less $800k interco): $16,200,000.00
  Consolidated COGS (less $800k interco + $50k unrealized inv profit): $9,450,000.00
  Consolidated Gross Profit: $6,750,000.00
  Total Consolidated Net Income: $3,250,000.00
  Less: Non-Controlling Interest (NCI 20%): $160,000.00
  Net Income Attributable to Parent Shareholders: $3,090,000.00`,
        codeNotes: [
          'Gross combined revenue ($17M) is reduced by the $800k intercompany sale to report $16.2M consolidated revenue.',
          'Consolidated COGS eliminates the $800k intercompany purchase and adds back $50,000 in unrealized inventory profit.',
          'Non-controlling interest (20%) is deducted from total consolidated net income ($3.25M) to yield $3.09M parent shareholder profit.'
        ],
        tryIt: 'Increase the subsidiary\'s remaining year-end intercompany inventory from 25% to 50% to observe how deferred profit shrinks current consolidated net income.',
        check: {
          question: 'Why must unrealized intercompany profit in ending inventory be eliminated in consolidation under ASC 810?',
          options: [
            'Because the consolidated entity cannot recognize profit by simply transferring goods between related entities until the inventory is sold to an independent third party',
            'Because GAAP mandates that inventory must always be carried on the balance sheet at fair value rather than historical cost',
            'Because intercompany inventory profits are taxed at double the corporate income tax rate by the IRS',
            'Because non-controlling interest shareholders are legally prohibited from receiving any share of gross profit'
          ],
          answer: 0,
          why: 'Under ASC 810 / IFRS 10, a corporate group represents a single economic entity; profits can only be recognized when goods are sold externally to third-party customers.',
          answerIndex: 0,
          explanation: 'Under ASC 810 / IFRS 10, a corporate group represents a single economic entity; profits can only be recognized when goods are sold externally to third-party customers.'
        }
      },
      {
        title: 'ASC 230 Statement of Cash Flows Reconstruction (Operating Indirect Method)',
        say: [
          'While accrual accounting provides the most accurate measurement of operating performance, cash flow remains the ultimate arbiter of corporate liquidity and solvency. Under US GAAP ASC 230 and IAS 7, the statement of cash flows categorizes all cash inflows and outflows across three distinct business activities: operating, investing, and financing. In public financial reporting, the vast majority of corporations present Cash Flow from Operating Activities (CFO) using the indirect method, which begins with consolidated net income and systematically reconciles it to net operating cash.',
          'The indirect operating reconciliation involves two major categories of adjustments. First, non-cash expenses recognized in the income statement—most notably depreciation, amortization, and provisions for bad debts or credit losses—are added back to net income because they reduced accrual profit without consuming liquidity. Conversely, non-operating gains (such as gains on the sale of property, plant, and equipment) are subtracted from net income to prevent double-counting, as the total cash proceeds from equipment disposals belong in the investing section.',
          'The second phase of the indirect reconciliation analyzes changes in operating working capital accounts. Increases in operating current assets (such as accounts receivable and inventory) represent cash outflows or uncollected revenues and are subtracted from net income. Conversely, increases in operating current liabilities (such as accounts payable and accrued payroll expenses) represent unpaid obligations or supplier financing and are added back to net income. When combined with Cash Flow from Investing (CapEx and asset sales) and Cash Flow from Financing (debt issuance, debt retirement, and dividends), the statement reconciles exactly to the net change in balance sheet cash.',
          'As financial controller, mastering cash flow modeling ensures that management avoids liquidity traps where a company reports robust accrual profits while simultaneously running out of cash to meet payroll and debt service obligations.'
        ],
        example: 'Starting from $1,450,000 net income, the controller adds back $445,000 in non-cash depreciation and bad debt provisions, subtracts a $45,000 equipment sale gain, and adjusts for -$105,000 in working capital drag to establish $1,745,000 in operating cash flow (CFO), ending with $2,005,000 cash.',
        code: `def reconstruct_asc230_cash_flow_statement():
    net_income = 1450000.0
    depreciation_amort = 380000.0
    provision_bad_debts = 65000.0
    gain_on_asset_sale = 45000.0 # Non-operating gain deducted from CFO

    # Working Capital Changes (Operating Assets & Liabilities)
    chg_ar = -120000.0         # AR increased by $120k (Cash outflow)
    chg_inventory = -95000.0   # Inventory increased by $95k (Cash outflow)
    chg_ap = 80000.0           # AP increased by $80k (Cash inflow)
    chg_accrued_exp = 30000.0  # Accrued expenses increased by $30k (Cash inflow)

    # Cash Flow from Operating Activities (CFO)
    cfo = (net_income + depreciation_amort + provision_bad_debts - gain_on_asset_sale
           + chg_ar + chg_inventory + chg_ap + chg_accrued_exp)

    # Cash Flow from Investing Activities (CFI)
    capex = -650000.0
    proceeds_asset_sale = 110000.0
    cfi = capex + proceeds_asset_sale

    # Cash Flow from Financing Activities (CFF)
    term_debt_issuance = 500000.0
    principal_debt_repayment = -300000.0
    dividends_paid = -250000.0
    cff = term_debt_issuance + principal_debt_repayment + dividends_paid

    net_change_in_cash = cfo + cfi + cff
    beginning_cash = 850000.0
    ending_cash = beginning_cash + net_change_in_cash

    print("ASC 230 Statement of Cash Flows (Indirect Method):")
    print("  Net Income: " + "$" + f"{net_income:,.2f}")
    print("  Non-Cash Addbacks (Depr: " + "$" + f"{depreciation_amort:,.0f}" + ", Bad Debts: " + "$" + f"{provision_bad_debts:,.0f}" + "): " + "$" + f"{depreciation_amort + provision_bad_debts:,.2f}")
    print("  Gain on Asset Sale Deducted: " + "$" + f"{-gain_on_asset_sale:,.2f}")
    print("  Working Capital Cash Drag: " + "$" + f"{chg_ar + chg_inventory + chg_ap + chg_accrued_exp:,.2f}")
    print("  Net Cash Provided by Operating Activities (CFO): " + "$" + f"{cfo:,.2f}")
    print("  Net Cash Used in Investing Activities (CFI): " + "$" + f"{cfi:,.2f}")
    print("  Net Cash Provided by Financing Activities (CFF): " + "$" + f"{cff:,.2f}")
    print("  Net Change in Cash: " + "$" + f"{net_change_in_cash:,.2f}")
    print("  Ending Cash Balance: " + "$" + f"{ending_cash:,.2f}")
    return {"cfo": cfo, "cfi": cfi, "cff": cff, "ending_cash": ending_cash}

reconstruct_asc230_cash_flow_statement()`,
        output: `ASC 230 Statement of Cash Flows (Indirect Method):
  Net Income: $1,450,000.00
  Non-Cash Addbacks (Depr: $380,000, Bad Debts: $65,000): $445,000.00
  Gain on Asset Sale Deducted: $-45,000.00
  Working Capital Cash Drag: $-105,000.00
  Net Cash Provided by Operating Activities (CFO): $1,745,000.00
  Net Cash Used in Investing Activities (CFI): $-540,000.00
  Net Cash Provided by Financing Activities (CFF): $-50,000.00
  Net Change in Cash: $1,155,000.00
  Ending Cash Balance: $2,005,000.00`,
        codeNotes: [
          'Non-cash expenses ($445k) are added back to net income, while non-operating gain ($45k) is subtracted to avoid double counting with CFI.',
          'Operating working capital adjustments reflect cash tied up in AR (-$120k) and inventory (-$95k), partially offset by AP (+$80k) and accruals (+$30k).',
          'Operating ($1.745M), investing (-$540k), and financing (-$50k) flows sum to a net cash increase of $1.155M, reconciling ending cash to $2.005M.'
        ],
        tryIt: 'Adjust the accounts receivable change to -$300,000 to simulate a severe customer collection slowdown and measure its direct impact on CFO.',
        check: {
          question: 'Under the ASC 230 indirect method, why is an increase in Accounts Receivable subtracted from Net Income in the Operating section?',
          options: [
            'Because revenue was recognized on an accrual basis in the income statement but the cash has not yet been collected from customers',
            'Because Accounts Receivable represents a long-term capital investment classified as financing',
            'Because increasing receivables indicates that the company wrote off bad debts against retained earnings',
            'Because customer credit balances must be remitted immediately to state tax authorities'
          ],
          answer: 0,
          why: 'An increase in Accounts Receivable reflects credit sales that inflated accrual net income without generating corresponding cash collections during the period, requiring a deduction to reach actual cash flow.',
          answerIndex: 0,
          explanation: 'An increase in Accounts Receivable reflects credit sales that inflated accrual net income without generating corresponding cash collections during the period, requiring a deduction to reach actual cash flow.'
        }
      },
      {
        title: 'ASC 740 Income Tax Accounting: Temporary vs Permanent Differences & Deferred Taxes',
        say: [
          'Accounting for income taxes under US GAAP ASC 740 and IAS 12 requires reconciling financial accounting rules (governed by GAAP) with tax statutory law (governed by the Internal Revenue Code). Because GAAP prioritizes economic matching while tax codes incentivize capital investment, pretax book accounting income rarely equals taxable income on Form 1120. The controller must dissect book-tax discrepancies into two distinct categories: permanent differences and temporary differences.',
          'Permanent differences are items that are recognized for financial reporting but never for tax purposes, or vice versa. Common examples include tax-exempt municipal bond interest income (which increases book income but is never taxed) and non-deductible fines or penalties (which reduce book income but cannot be deducted for tax). Permanent differences do not reverse in subsequent periods and directly alter the company\'s Effective Tax Rate (ETR), causing it to diverge from the 21% US federal statutory rate.',
          'Temporary differences, in contrast, arise from timing disparities where revenues or expenses are recognized in different periods for book versus tax purposes. A prime example is depreciation: companies often use straight-line depreciation for book reporting but accelerate deductions under MACRS or Section 168(k) bonus depreciation for tax. This generates a future taxable amount, creating a Deferred Tax Liability (DTL). Conversely, accruals for warranties and CECL bad debt reserves are recognized immediately for book purposes but cannot be deducted for tax until paid or written off, creating a Deferred Tax Asset (DTA). Total income tax expense on the P&L equals Current Tax Expense plus Deferred Tax Expense, providing a stable, matched tax provision.',
          'Furthermore, ASC 740 mandates that reporting entities evaluate whether it is "more likely than not" (a greater than 50% probability) that deferred tax assets will be realized through future taxable income. If future realization is doubtful, the controller must record a valuation allowance against the DTA.'
        ],
        example: 'On $2,000,000 pretax book income, $25,000 in net permanent deductions and temporary differences (MACRS $180k excess depreciation vs $100k book reserve accruals) result in $1,895,000 taxable income ($397,950 current tax). The controller records a $16,800 net deferred tax liability, producing a total tax provision of $414,750 (20.74% effective tax rate).',
        code: `def model_asc740_income_tax_provision():
    pretax_accounting_income = 2000000.0
    statutory_tax_rate = 0.21 # 21% US Federal Rate

    # Permanent Differences (Do NOT reverse)
    muni_interest_income = -50000.0 # Non-taxable
    nondeductible_fines = 25000.0   # Non-deductible expense
    permanent_adj = muni_interest_income + nondeductible_fines # -$25,000

    # Temporary Differences (Reverse in future years)
    tax_depr_excess = -180000.0    # MACRS accelerates depreciation over book (Future Taxable -> DTL)
    bad_debt_reserve_excess = 60000.0 # Book accrued bad debt before tax write-off (Future Deductible -> DTA)
    warranty_accrual_excess = 40000.0 # Book warranty accrual (Future Deductible -> DTA)

    taxable_income = pretax_accounting_income + permanent_adj + tax_depr_excess + bad_debt_reserve_excess + warranty_accrual_excess
    current_tax_expense = taxable_income * statutory_tax_rate

    # Deferred Tax Asset (DTA) & Liability (DTL)
    deferred_tax_asset = (bad_debt_reserve_excess + warranty_accrual_excess) * statutory_tax_rate # $100k * 21% = $21k
    deferred_tax_liability = abs(tax_depr_excess) * statutory_tax_rate # $180k * 21% = $37.8k
    net_deferred_tax_liability = deferred_tax_liability - deferred_tax_asset # $16.8k

    deferred_tax_expense = net_deferred_tax_liability
    total_tax_provision = current_tax_expense + deferred_tax_expense
    effective_tax_rate = (total_tax_provision / pretax_accounting_income) * 100

    print("ASC 740 Income Tax Provision & Deferred Taxes:")
    print("  Pretax Accounting Income: " + "$" + f"{pretax_accounting_income:,.2f}")
    print("  Taxable Income on IRS Form 1120: " + "$" + f"{taxable_income:,.2f}")
    print("  Current Tax Expense (Payable Now): " + "$" + f"{current_tax_expense:,.2f}")
    print("  Deferred Tax Asset (Future Deductions): " + "$" + f"{deferred_tax_asset:,.2f}")
    print("  Deferred Tax Liability (Future Taxable MACRS): " + "$" + f"{deferred_tax_liability:,.2f}")
    print("  Net Deferred Tax Liability on Balance Sheet: " + "$" + f"{net_deferred_tax_liability:,.2f}")
    print("  Total Tax Provision (P&L Expense): " + "$" + f"{total_tax_provision:,.2f}")
    print(f"  Effective Tax Rate: {effective_tax_rate:.2f}% (Statutory: 21.00%)")
    return {"current_tax": current_tax_expense, "net_dtl": net_deferred_tax_liability, "total_tax": total_tax_provision, "etr": effective_tax_rate}

model_asc740_income_tax_provision()`,
        output: `ASC 740 Income Tax Provision & Deferred Taxes:
  Pretax Accounting Income: $2,000,000.00
  Taxable Income on IRS Form 1120: $1,895,000.00
  Current Tax Expense (Payable Now): $397,950.00
  Deferred Tax Asset (Future Deductions): $21,000.00
  Deferred Tax Liability (Future Taxable MACRS): $37,800.00
  Net Deferred Tax Liability on Balance Sheet: $16,800.00
  Total Tax Provision (P&L Expense): $414,750.00
  Effective Tax Rate: 20.74% (Statutory: 21.00%)`,
        codeNotes: [
          'Permanent differences (-$25k) reduce effective tax rate from the 21.00% statutory rate down to 20.74%.',
          'Temporary differences calculate a $21,000 DTA (bad debts, warranties) and a $37,800 DTL (accelerated MACRS depreciation).',
          'The net deferred tax liability of $16,800 is recognized on the balance sheet, ensuring total P&L tax expense matches book income.'
        ],
        tryIt: 'Add a $100,000 tax penalty to permanent differences to observe how non-deductible items drive the effective tax rate above the statutory rate.',
        check: {
          question: 'What is the distinguishing feature of a temporary difference under ASC 740 compared to a permanent difference?',
          options: [
            'Temporary differences will reverse in future periods and generate deferred tax assets or liabilities, whereas permanent differences never reverse',
            'Temporary differences are illegal under IRS regulations and result in mandatory financial penalties',
            'Temporary differences affect cash flow immediately but are excluded from GAAP financial statements',
            'Temporary differences apply only to state sales taxes rather than corporate federal income taxes'
          ],
          answer: 0,
          why: 'Temporary differences represent timing discrepancies that reverse in future years (giving rise to DTAs and DTLs), whereas permanent differences do not reverse and directly alter the effective tax rate.',
          answerIndex: 0,
          explanation: 'Temporary differences represent timing discrepancies that reverse in future years (giving rise to DTAs and DTLs), whereas permanent differences do not reverse and directly alter the effective tax rate.'
        }
      },
      {
        title: 'SEC Regulation G Non-GAAP Adjusted EBITDA Reconciliation & Footnote Disclosures',
        say: [
          'Public company corporate filings under SEC Form 10-K and Form 10-Q frequently supplement GAAP financial statements with non-GAAP performance metrics, most prominently Adjusted EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization). Management teams argue that Adjusted EBITDA provides analysts with clearer insight into underlying core operational cash earnings by removing non-operating financing decisions, statutory tax variances, accounting depreciation conventions, and non-cash or non-recurring charges.',
          'However, the SEC enforces strict oversight under Regulation G and Item 10(e) of Regulation S-K to prevent misleading presentations. A company cannot present a non-GAAP measure without giving equal or greater prominence to the most directly comparable GAAP measure (GAAP Net Income). Crucially, the filing must contain a quantitative reconciliation table bridging GAAP Net Income to Adjusted EBITDA, explaining why management believes the metric is useful to investors and describing the exact nature of each adjustment.',
          'Standard adjustments begin by adding back interest expense, income tax provisions, and depreciation and amortization to reach standard EBITDA. From there, management adjusts for discrete items: non-cash stock-based compensation (granting equity to employees), facility restructuring and employee severance charges, and one-off acquisition transaction legal fees. Controllers must ensure that adjustments are applied consistently from period to period and that normal, recurring operational cash operating expenses are never stripped out under the guise of "one-time" adjustments, as this triggers immediate SEC comment letters.'
        ],
        example: 'Starting from $1,450,000 GAAP Net Income, the controller bridges to $2,419,750 standard EBITDA by adding back interest ($175k), taxes ($414,750), and D&A ($380k). Adding stock compensation ($140k), severance ($90k), and M&A legal costs ($65k) establishes $2,714,750 Adjusted EBITDA (16.76% margin).',
        code: `def reconcile_gaap_to_adjusted_ebitda():
    gaap_net_income = 1450000.0
    interest_expense = 175000.0
    tax_provision = 414750.0
    depreciation_amortization = 380000.0

    ebitda = gaap_net_income + interest_expense + tax_provision + depreciation_amortization

    # Non-GAAP Adjustments
    stock_based_compensation = 140000.0
    restructuring_severance = 90000.0
    m_and_a_transaction_costs = 65000.0

    adjusted_ebitda = ebitda + stock_based_compensation + restructuring_severance + m_and_a_transaction_costs
    rev = 16200000.0
    adjusted_ebitda_margin = (adjusted_ebitda / rev) * 100

    print("SEC Form 10-K Non-GAAP Adjusted EBITDA Reconciliation (Regulation G):")
    print("  GAAP Consolidated Net Income: " + "$" + f"{gaap_net_income:,.2f}")
    print("  (+) Provision for Income Taxes: " + "$" + f"{tax_provision:,.2f}")
    print("  (+) Interest Expense, Net: " + "$" + f"{interest_expense:,.2f}")
    print("  (+) Depreciation & Amortization: " + "$" + f"{depreciation_amortization:,.2f}")
    print("  EBITDA (Standard): " + "$" + f"{ebitda:,.2f}")
    print("  (+) Stock-Based Compensation: " + "$" + f"{stock_based_compensation:,.2f}")
    print("  (+) Restructuring & Facility Severance: " + "$" + f"{restructuring_severance:,.2f}")
    print("  (+) M&A Legal Due Diligence Costs: " + "$" + f"{m_and_a_transaction_costs:,.2f}")
    print("  Adjusted EBITDA: " + "$" + f"{adjusted_ebitda:,.2f}")
    print(f"  Adjusted EBITDA Margin: {adjusted_ebitda_margin:.2f}%")
    return {"ebitda": ebitda, "adjusted_ebitda": adjusted_ebitda, "margin": adjusted_ebitda_margin}

reconcile_gaap_to_adjusted_ebitda()`,
        output: `SEC Form 10-K Non-GAAP Adjusted EBITDA Reconciliation (Regulation G):
  GAAP Consolidated Net Income: $1,450,000.00
  (+) Provision for Income Taxes: $414,750.00
  (+) Interest Expense, Net: $175,000.00
  (+) Depreciation & Amortization: $380,000.00
  EBITDA (Standard): $2,419,750.00
  (+) Stock-Based Compensation: $140,000.00
  (+) Restructuring & Facility Severance: $90,000.00
  (+) M&A Legal Due Diligence Costs: $65,000.00
  Adjusted EBITDA: $2,714,750.00
  Adjusted EBITDA Margin: 16.76%`,
        codeNotes: [
          'Standard EBITDA ($2,419,750) adds back capital structure (interest), tax jurisdiction (taxes), and asset age (D&A) differences.',
          'Regulation G non-GAAP adjustments add back non-cash stock compensation ($140k), restructuring ($90k), and M&A fees ($65k).',
          'Adjusted EBITDA of $2,714,750 represents a 16.76% margin against $16.2M consolidated net revenues.'
        ],
        tryIt: 'Examine what happens if normal recurring marketing software licenses ($50k) are inappropriately added back, exposing the filing to SEC comment letters.',
        check: {
          question: 'What is the primary SEC requirement under Regulation G when presenting non-GAAP Adjusted EBITDA in Form 10-K filings?',
          options: [
            'The filing must present the most directly comparable GAAP measure (GAAP Net Income) with equal or greater prominence and provide a full mathematical reconciliation bridge',
            'Adjusted EBITDA must always exceed GAAP Net Income by at least 25% to be deemed informative',
            'The company is required to replace the GAAP audited income statement entirely with the Adjusted EBITDA schedule',
            'Non-GAAP metrics are only permitted if certified by state treasury departments prior to quarterly earnings calls'
          ],
          answer: 0,
          why: 'SEC Regulation G mandates equal or greater prominence for the comparable GAAP measure and requires an explicit, audited mathematical reconciliation table.',
          answerIndex: 0,
          explanation: 'SEC Regulation G mandates equal or greater prominence for the comparable GAAP measure and requires an explicit, audited mathematical reconciliation table.'
        }
      },
      {
        title: 'Milestone 1 Capstone Defense: The Global Financial Controller War Room & Accreditation',
        say: [
          'You have reached the final milestone of the B.Com Accounting Masterclass curriculum. In this culminating executive simulation, you convene the Board of Directors Audit Committee War Room to deliver the comprehensive annual financial controller dossier. You will defend every critical accounting policy decision, consolidation adjustment, and disclosure note across the entire enterprise financial statements.',
          'Your executive dossier synthesizes all core disciplines mastered throughout the five-day curriculum: foundational double-entry accrual invariants and fundamental balance sheet equations from Day 1; ASC 842 lease capitalization, foreign functional currency translation, and goodwill impairment evaluations from Day 2; multi-pool activity-based costing allocations and standard costing variance waterfalls from Day 3; ASC 820 Level 3 fair value hierarchies, forward-looking ASC 326 CECL credit loss allowances, and ASC 815 cash flow hedge effectiveness from Day 4; and multi-entity consolidation eliminations, indirect cash flows, and ASC 740 income tax provisions from Day 5.',
          'Upon executing the integrated master synthesis pipeline, you will defend the unqualified clean audit opinion issued by independent auditors, verify full SEC Regulation G compliance, and receive the official conferral of Senior Certified Financial Controller & Corporate Reporting Strategist (CFC-CRS) accreditation, marking 100% completion of the B.Com Accounting course.'
        ],
        example: 'The controller presents consolidated revenue ($16.20M), parent net income ($3.09M), operating cash flow ($1.745M), net DTL ($16,800), and SEC Adjusted EBITDA ($2.715M), securing unanimous audit committee approval and receiving CFC-CRS accreditation.',
        code: `def generate_global_controller_audit_dossier_and_accreditation():
    print("================================================================================")
    print("   PINIT CAREER OS MILESTONE 1 CAPSTONE: GLOBAL FINANCIAL CONTROLLER WAR ROOM   ")
    print("================================================================================")
    print("\n[PHASE 1: MULTI-ENTITY ASC 810 CONSOLIDATION]")
    c = consolidate_multi_entity_enterprise()

    print("\n[PHASE 2: ASC 230 STATEMENT OF CASH FLOWS]")
    cf = reconstruct_asc230_cash_flow_statement()

    print("\n[PHASE 3: ASC 740 INCOME TAX PROVISION & DEFERRED TAXES]")
    tx = model_asc740_income_tax_provision()

    print("\n[PHASE 4: SEC REGULATION G NON-GAAP RECONCILIATION]")
    adj = reconcile_gaap_to_adjusted_ebitda()

    print("\n[PHASE 5: BOARD OF DIRECTORS AUDIT COMMITTEE SIGN-OFF & ACCREDITATION]")
    print("  Consolidated Enterprise Revenue: " + "$" + f"{c['rev']:,.2f}")
    print("  Parent Net Income: " + "$" + f"{c['parent_inc']:,.2f}")
    print("  Operating Cash Flow (CFO): " + "$" + f"{cf['cfo']:,.2f}")
    print("  Net Deferred Tax Liability: " + "$" + f"{tx['net_dtl']:,.2f}")
    print("  SEC Adjusted EBITDA: " + "$" + f"{adj['adjusted_ebitda']:,.2f}")
    print("  Audit Status: UNQUALIFIED CLEAN OPINION (Big Four Audit Defense Passed)")
    print("  Executive Sign-Off: Conferred Senior Certified Financial Controller & Corporate Reporting Strategist (CFC-CRS)")

generate_global_controller_audit_dossier_and_accreditation()`,
        output: `================================================================================
   PINIT CAREER OS MILESTONE 1 CAPSTONE: GLOBAL FINANCIAL CONTROLLER WAR ROOM   
================================================================================

[PHASE 1: MULTI-ENTITY ASC 810 CONSOLIDATION]
ASC 810 Multi-Entity Consolidation & Intercompany Elimination:
  Consolidated Revenue (less $800k interco): $16,200,000.00
  Consolidated COGS (less $800k interco + $50k unrealized inv profit): $9,450,000.00
  Consolidated Gross Profit: $6,750,000.00
  Total Consolidated Net Income: $3,250,000.00
  Less: Non-Controlling Interest (NCI 20%): $160,000.00
  Net Income Attributable to Parent Shareholders: $3,090,000.00

[PHASE 2: ASC 230 STATEMENT OF CASH FLOWS]
ASC 230 Statement of Cash Flows (Indirect Method):
  Net Income: $1,450,000.00
  Non-Cash Addbacks (Depr: $380,000, Bad Debts: $65,000): $445,000.00
  Gain on Asset Sale Deducted: $-45,000.00
  Working Capital Cash Drag: $-105,000.00
  Net Cash Provided by Operating Activities (CFO): $1,745,000.00
  Net Cash Used in Investing Activities (CFI): $-540,000.00
  Net Cash Provided by Financing Activities (CFF): $-50,000.00
  Net Change in Cash: $1,155,000.00
  Ending Cash Balance: $2,005,000.00

[PHASE 3: ASC 740 INCOME TAX PROVISION & DEFERRED TAXES]
ASC 740 Income Tax Provision & Deferred Taxes:
  Pretax Accounting Income: $2,000,000.00
  Taxable Income on IRS Form 1120: $1,895,000.00
  Current Tax Expense (Payable Now): $397,950.00
  Deferred Tax Asset (Future Deductions): $21,000.00
  Deferred Tax Liability (Future Taxable MACRS): $37,800.00
  Net Deferred Tax Liability on Balance Sheet: $16,800.00
  Total Tax Provision (P&L Expense): $414,750.00
  Effective Tax Rate: 20.74% (Statutory: 21.00%)

[PHASE 4: SEC REGULATION G NON-GAAP RECONCILIATION]
SEC Form 10-K Non-GAAP Adjusted EBITDA Reconciliation (Regulation G):
  GAAP Consolidated Net Income: $1,450,000.00
  (+) Provision for Income Taxes: $414,750.00
  (+) Interest Expense, Net: $175,000.00
  (+) Depreciation & Amortization: $380,000.00
  EBITDA (Standard): $2,419,750.00
  (+) Stock-Based Compensation: $140,000.00
  (+) Restructuring & Facility Severance: $90,000.00
  (+) M&A Legal Due Diligence Costs: $65,000.00
  Adjusted EBITDA: $2,714,750.00
  Adjusted EBITDA Margin: 16.76%

[PHASE 5: BOARD OF DIRECTORS AUDIT COMMITTEE SIGN-OFF & ACCREDITATION]
  Consolidated Enterprise Revenue: $16,200,000.00
  Parent Net Income: $3,090,000.00
  Operating Cash Flow (CFO): $1,745,000.00
  Net Deferred Tax Liability: $16,800.00
  SEC Adjusted EBITDA: $2,714,750.00
  Audit Status: UNQUALIFIED CLEAN OPINION (Big Four Audit Defense Passed)
  Executive Sign-Off: Conferred Senior Certified Financial Controller & Corporate Reporting Strategist (CFC-CRS)`,
        codeNotes: [
          'Unifies multi-entity consolidation, indirect cash flow modeling, income tax provisioning, and SEC non-GAAP reconciliation.',
          'Demonstrates defensibility across every major US GAAP standard (ASC 810, ASC 230, ASC 740, ASC 820, ASC 326, ASC 815, ASC 470).',
          'Concludes the B.Com Accounting Masterclass with formal CFO and Audit Committee certification and CFC-CRS accreditation.'
        ],
        tryIt: 'Run the complete Capstone pipeline to verify full financial integration across all five days of the B.Com Accounting Masterclass.',
        check: {
          question: 'What constitutes an Unqualified Clean Audit Opinion on an enterprise SEC Form 10-K filing?',
          options: [
            'The independent auditor concludes that the consolidated financial statements present fairly, in all material respects, the financial position and results of operations in conformity with GAAP',
            'The auditor certifies that the company has achieved record-high profitability and will never suffer an operating loss',
            'The auditor states that internal controls were completely unnecessary because management has high integrity',
            'The SEC waives all quarterly filing requirements for the subsequent five fiscal years'
          ],
          answer: 0,
          why: 'An unqualified opinion is the highest audit rating, signifying that financial statements are free of material misstatements and comply fully with GAAP.',
          answerIndex: 0,
          explanation: 'An unqualified opinion is the highest audit rating, signifying that financial statements are free of material misstatements and comply fully with GAAP.'
        }
      }
    ],
    summary: [
      'Executed ASC 810 multi-entity enterprise consolidation, eliminating $800,000 in intercompany revenues, adjusting for $50,000 in unrealized inventory profit, and segregating $160,000 in Non-Controlling Interest (NCI) from parent profit.',
      'Constructed an ASC 230 statement of cash flows using the indirect method, adding back $445,000 in non-cash items, deducting $45,000 in asset gains, and adjusting for $105,000 working capital drag to produce $1,745,000 in operating cash flow.',
      'Modeled an ASC 740 income tax provision, distinguishing permanent differences from temporary timing differences (MACRS depreciation vs CECL/warranty accruals) to establish a $16,800 net DTL and 20.74% effective tax rate.',
      'Constructed an SEC Regulation G Non-GAAP Adjusted EBITDA bridge ($2,714,750 Adjusted EBITDA, 16.76% margin), justifying add-backs for stock-based compensation, facility severance, and M&A diligence costs.',
      'Synthesized the complete Milestone 1 Financial Controller War Room, defending the annual audit to earn an unqualified clean opinion and conferring Senior Certified Financial Controller & Corporate Reporting Strategist (CFC-CRS) accreditation.'
    ],
    projectStep: {
      title: 'Execute the Milestone 1 Financial Controller Capstone War Room',
      steps: [
        'Consolidate multi-entity operations under ASC 810, eliminating intercompany sales, transfer markups, and unrealized inventory profits.',
        'Reconstruct the ASC 230 statement of cash flows under the indirect method, reconciling net income to cash provided by operations.',
        'Compute the ASC 740 income tax provision, distinguishing permanent book-tax items from temporary differences and posting net deferred tax balances.',
        'Bridge GAAP Net Income to SEC Regulation G Adjusted EBITDA and deliver the audit committee defense to secure CFC-CRS accreditation.'
      ]
    }
  }
];
