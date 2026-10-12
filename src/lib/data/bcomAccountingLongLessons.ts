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
  }
];
