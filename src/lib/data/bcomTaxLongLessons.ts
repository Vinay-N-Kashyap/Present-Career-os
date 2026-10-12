import type { LongLesson } from './longLessons';

/**
 * Corporate Taxation, Direct Taxes & Tax Shield Strategy (Course: bcom_tax)
 * Day 1: Deferred Taxes, Debt Tax Shields, Transfer Pricing & Input Tax Credits.
 */
export const BCOM_TAX_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'bcom_tax',
    day: 1,
    title: 'Corporate Tax Optimization, Deferred Taxes & Transfer Pricing Strategy',
    goal: 'Master enterprise taxation strategy: permanent versus temporary timing differences (DTA/DTL under ASC 740), Modigliani-Miller interest tax shield valuation, OECD arm\'s length transfer pricing (TNMM), net operating loss (NOL) carryforward mechanics, and VAT/GST input tax credit chains.',
    minutes: 40,
    recap: 'Welcome to Corporate Taxation & Tax Strategy. In enterprise management, tax planning is not about illicit evasion; it is the strategic optimization of capital structures, depreciation timing, and intercompany pricing within statutory legal frameworks.',
    parts: [
      {
        title: 'Effective Tax Rate & Deferred Tax Invariants (DTA / DTL)',
        say: [
          'A corporation\'s financial accounting profit reported to shareholders on the P&L (Book Income under GAAP/IFRS) rarely matches its Taxable Income reported to government tax authorities (IRS/HMRC).',
          'This discrepancy arises from two categories of differences: Permanent Differences (items that are recognized for book but never for tax, like municipal bond interest or executive entertainment penalties) and Temporary Timing Differences (items recognized in both, but in different accounting periods).',
          'Under ASC 740 and IAS 12, temporary differences generate Deferred Tax Assets (DTA) or Deferred Tax Liabilities (DTL).',
          'A Deferred Tax Liability (DTL) occurs when Book Income exceeds Taxable Income in the current period (e.g., using accelerated MACRS depreciation for tax returns while using straight-line for financial statements). The company pays less cash tax today, creating an inevitable obligation to pay higher tax in future years.',
          'A Deferred Tax Asset (DTA) represents prepaid tax or future deductible amounts (e.g., warranty reserves or deferred revenue). If it is more likely than not (>50% probability) that the company will not generate enough future taxable income to realize the DTA, GAAP mandates a Valuation Allowance reserve.'
        ],
        example: 'A company buys a $100,000 server. Book depreciation is $20,000/year (5-year straight line). Tax rules permit 100% bonus depreciation in Year 1 ($100,000 deduction). In Year 1, taxable income is $80,000 lower than book income! At a 25% tax rate, the company defers $20,000 in cash taxes today, recording a $20,000 Deferred Tax Liability on its balance sheet.',
        code: `# Simulation: ASC 740 Book vs Tax Reconciliation & DTL Depreciation Schedule
class DeferredTaxSchedule:
    def __init__(self, asset_cost: float, useful_life_years: int, tax_rate: float):
        self.cost = asset_cost
        self.life = useful_life_years
        self.tax_rate = tax_rate

    def generate_5yr_schedule(self, pre_depreciation_book_ebit: float) -> list:
        # Book: Straight Line ($cost / life)
        # Tax: Accelerated 100% Year 1 bonus depreciation
        book_deprec = self.cost / self.life
        schedule = []
        accumulated_dtl = 0.0

        for yr in range(1, self.life + 1):
            tax_deprec = self.cost if yr == 1 else 0.0
            book_income = pre_depreciation_book_ebit - book_deprec
            taxable_income = pre_depreciation_book_ebit - tax_deprec

            book_tax_expense = book_income * self.tax_rate
            actual_cash_tax_paid = max(0.0, taxable_income * self.tax_rate)
            
            # Change in DTL = Book Tax Expense - Actual Cash Tax Paid
            dtl_movement = book_tax_expense - actual_cash_tax_paid
            accumulated_dtl += dtl_movement

            schedule.append({
                "Year": yr,
                "Book_Income": round(book_income, 2),
                "Taxable_Income": round(taxable_income, 2),
                "Book_Tax_Expense": round(book_tax_expense, 2),
                "Cash_Tax_Paid": round(actual_cash_tax_paid, 2),
                "Ending_DTL_Liability": round(accumulated_dtl, 2)
            })

        return schedule

dt_engine = DeferredTaxSchedule(asset_cost=100000.0, useful_life_years=5, tax_rate=0.25) # 25% corporate tax
schedule = dt_engine.generate_5yr_schedule(pre_depreciation_book_ebit=150000.0)

print("ASC 740 Deferred Tax Liability (DTL) 5-Year Reversal Schedule:")
for s in schedule:
    print(f"Yr {s['Year']}: Book Inc \${s['Book_Income']:,} | Taxable \${s['Taxable_Income']:,} | Cash Tax \${s['Cash_Tax_Paid']:,} | Balance Sheet DTL: \${s['Ending_DTL_Liability']:,}")`,
        output: `ASC 740 Deferred Tax Liability (DTL) 5-Year Reversal Schedule:\nYr 1: Book Inc $130,000.0 | Taxable $50,000.0 | Cash Tax $12,500.0 | Balance Sheet DTL: $20,000.0\nYr 2: Book Inc $130,000.0 | Taxable $150,000.0 | Cash Tax $37,500.0 | Balance Sheet DTL: $15,000.0\nYr 3: Book Inc $130,000.0 | Taxable $150,000.0 | Cash Tax $37,500.0 | Balance Sheet DTL: $10,000.0\nYr 4: Book Inc $130,000.0 | Taxable $150,000.0 | Cash Tax $37,500.0 | Balance Sheet DTL: $5,000.0\nYr 5: Book Inc $130,000.0 | Taxable $150,000.0 | Cash Tax $37,500.0 | Balance Sheet DTL: $0.0`,
        tryIt: 'Observe Year 5: verify that the accumulated DTL liability exactly unwinds and reverses back to $0.00 as book depreciation catches up.',
        check: {
          question: 'Why does accelerated MACRS tax depreciation create a Deferred Tax Liability (DTL) rather than a permanent tax reduction?',
          options: [
            'Because the total lifetime depreciation deduction is identical under both systems; accelerated tax depreciation merely defers cash payments into future years, creating an unavoidable future tax liability.',
            'Because the government charges compound interest on accelerated depreciation deductions.',
            'Because tax depreciation is permanently banned under international IFRS standards.',
            'Because corporations are required to return all tax savings to shareholders as special dividends.'
          ],
          answerIndex: 0,
          explanation: 'The asset only costs $100,000 total. Taking 100% of the deduction in Year 1 leaves $0 of tax deductions in Years 2-5, meaning taxable income in later years will exceed book income. A DTL captures this timing liability on the balance sheet.'
        }
      },
      {
        title: 'Debt Tax Shield & Modigliani-Miller Value Creation',
        say: [
          'In corporate finance, the tax code creates a profound asymmetry between equity and debt: dividends paid to common shareholders are paid out of after-tax profits and are NOT tax-deductible, whereas interest paid to debt lenders is a tax-deductible operating expense.',
          'Under the Modigliani-Miller Theorem with Corporate Taxes, adding debt creates an Interest Tax Shield: Annual Tax Shield = Interest Expense * Corporate Tax Rate = Debt * Cost_of_Debt * Tax_Rate.',
          'For permanent debt, the capitalized present value of this perpetual tax shield equals: PV(Tax Shield) = Corporate_Tax_Rate * Total_Debt.',
          'Therefore, a levered firm is worth more than an identical unlevered firm: Value_Levered = Value_Unlevered + (Tax_Rate * Debt).',
          'However, tax codes enforce guardrails against excessive leverage: under US Section 163(j) and OECD rules, net business interest deductions are capped at 30% of adjusted taxable income (EBITDA), preventing tax-driven over-leveraging.'
        ],
        example: 'A corporation with $10,000,000 in EBIT faces a 25% tax rate. If unlevered, it pays $2,500,000 in taxes, leaving $7,500,000 for equity. If it carries $40,000,000 of 5% debt ($2M annual interest), taxable income drops to $8M. It pays $2M in tax, saving $500,000 every single year in tax shields.',
        code: `# Simulation: Modigliani-Miller Interest Tax Shield & Section 163(j) Cap Analyzer
class DebtTaxShieldEngine:
    def __init__(self, corporate_tax_rate: float, ebitda: float):
        self.tax_rate = corporate_tax_rate
        self.ebitda = ebitda
        # Section 163(j) limitation: max interest deduction = 30% of EBITDA
        self.max_allowable_interest_deduction = ebitda * 0.30

    def evaluate_capital_structure(self, total_debt: float, cost_of_debt: float) -> dict:
        annual_interest = total_debt * cost_of_debt
        
        # Apply 163(j) cap
        deductible_interest = min(annual_interest, self.max_allowable_interest_deduction)
        disallowed_interest = max(0.0, annual_interest - self.max_allowable_interest_deduction)

        annual_tax_shield = deductible_interest * self.tax_rate
        
        # Perpetual capitalized value of tax shield
        capitalized_pv_shield = total_debt * self.tax_rate if disallowed_interest == 0 else (annual_tax_shield / cost_of_debt)

        return {
            "Total_Debt": total_debt,
            "Annual_Interest_Obligation": annual_interest,
            "Allowable_Deduction_163j": deductible_interest,
            "Disallowed_Interest": disallowed_interest,
            "Annual_Cash_Tax_Savings": round(annual_tax_shield, 2),
            "Capitalized_Firm_Value_Added": round(capitalized_pv_shield, 2)
        }

tax_shield = DebtTaxShieldEngine(corporate_tax_rate=0.25, ebitda=10000000.0) # $10M EBITDA, 25% tax
# Case 1: Conservative debt ($20M debt at 6% = $1.2M interest, well under 30% cap of $3M)
c1 = tax_shield.evaluate_capital_structure(total_debt=20000000.0, cost_of_debt=0.06)
# Case 2: Highly levered LBO ($60M debt at 6% = $3.6M interest, exceeds $3.0M cap!)
c2 = tax_shield.evaluate_capital_structure(total_debt=60000000.0, cost_of_debt=0.06)

print(f"Case 1 (Conservative): Tax Savings \${c1['Annual_Cash_Tax_Savings']:,}/yr | Value Added: \${c1['Capitalized_Firm_Value_Added']:,}")
print(f"Case 2 (Overlevered):  Tax Savings \${c2['Annual_Cash_Tax_Savings']:,}/yr | Disallowed: \${c2['Disallowed_Interest']:,}")`,
        output: `Case 1 (Conservative): Tax Savings $300,000.0/yr | Value Added: $5,000,000.0\nCase 2 (Overlevered):  Tax Savings $750,000.0/yr | Disallowed: $600,000.0`,
        tryIt: 'Notice Case 2: $600,000 of interest is disallowed under Section 163(j), preventing further tax shield value creation.',
        check: {
          question: 'Why does adding debt increase the total enterprise value of a corporation in a world with corporate taxes?',
          options: [
            'Interest payments reduce taxable income, shielding cash flow from the government and increasing the aggregate cash available to debt and equity investors combined.',
            'Because debt holders are not permitted to vote on board resolutions.',
            'Because commercial banks are required by law to reinvest interest payments back into the borrower\'s stock.',
            'Because corporate debt is legally insured by the Federal Reserve.'
          ],
          answerIndex: 0,
          explanation: 'In an unlevered firm, the government takes a percentage of all operating profit. By issuing debt, the tax deduction diverts cash that would have gone to the IRS into debt service payments, expanding the net pie of value belonging to investors.'
        }
      },
      {
        title: 'Transfer Pricing & OECD Arm\'s Length Standard (TNMM)',
        say: [
          'Multinational enterprises (MNEs) operate subsidiaries across dozens of sovereign tax jurisdictions with widely divergent corporate tax rates (e.g., 25% in the US, 12.5% in Ireland, 9% in Dubai).',
          'When one subsidiary sells goods, intellectual property (IP), or services to a sister subsidiary, it must set an Intercompany Transfer Price.',
          'Under OECD guidelines and IRS Section 482, all cross-border intercompany transactions must satisfy the Arm\'s Length Principle: transfer prices must reflect what independent, unrelated commercial parties would have agreed to under comparable economic conditions.',
          'The Transactional Net Margin Method (TNMM) is the most widely applied transfer pricing method: it benchmarks the operating margin (Operating Profit / Revenue or Cost-Plus Markup) of the tested subsidiary against comparable independent distributors in that geographic market.',
          'Under the OECD Base Erosion and Profit Shifting (BEPS) Pillar Two framework, a global minimum tax rate of 15% eliminates aggressive zero-tax shell entity tax havens.'
        ],
        example: 'A US tech company develops AI software. Its Irish subsidiary handles European sales. If the US entity charges Ireland a 1% royalty, Ireland keeps 99% of profits taxed at 12.5% while the US parent books almost nothing. The IRS will audit and reallocate profits under the arm\'s length standard, imposing massive back-tax penalties.',
        code: `# Simulation: OECD Transfer Pricing TNMM Arm's Length Intercompany Benchmark
class TransferPricingTNMM:
    def __init__(self, benchmark_interquartile_range: tuple):
        # (Lower Quartile Q1, Median, Upper Quartile Q3) operating margins of independent peers
        self.q1, self.median, self.q3 = benchmark_interquartile_range

    def audit_subsidiary(self, intercompany_revenue: float, operating_expenses: float,
                         transfer_price_cogs: float) -> dict:
        operating_profit = intercompany_revenue - transfer_price_cogs - operating_expenses
        tested_operating_margin = (operating_profit / intercompany_revenue) * 100.0
        
        # Arm's Length Test: Operating margin must fall within the interquartile range [Q1, Q3]
        if self.q1 <= tested_operating_margin <= self.q3:
            audit_status = "ARM_LENGTH_COMPLIANT"
            recommended_adjustment = 0.0
        elif tested_operating_margin < self.q1:
            audit_status = "TRANSFER_PRICE_TOO_HIGH (Profit artificially suppressed in subsidiary)"
            # Adjust to median
            target_profit = intercompany_revenue * (self.median / 100.0)
            recommended_adjustment = target_profit - operating_profit
        else:
            audit_status = "TRANSFER_PRICE_TOO_LOW (Excess profit dumped in low-tax subsidiary)"
            target_profit = intercompany_revenue * (self.median / 100.0)
            recommended_adjustment = target_profit - operating_profit

        return {
            "Subsidiary_Revenue": intercompany_revenue,
            "Tested_Operating_Margin": round(tested_operating_margin, 2),
            "Benchmark_Range": f"[{self.q1}%, {self.q3}%] (Median {self.median}%)",
            "Audit_Verdict": audit_status,
            "Tax_Audit_Income_Adjustment": round(recommended_adjustment, 2)
        }

# Independent distributor peers earn between 4.0% and 8.0% operating margin (Median 6.0%)
tnmm_auditor = TransferPricingTNMM(benchmark_interquartile_range=(4.0, 6.0, 8.0))

# Tested European distributor: $100M revenue, $20M opex, charged $78M intercompany cost -> margin = 2.0% (Under Q1!)
subsidiary_audit = tnmm_auditor.audit_subsidiary(
    intercompany_revenue=100000000.0,
    operating_expenses=20000000.0,
    transfer_price_cogs=78000000.0 # Operating profit = $2M (2.0%)
)

print("OECD Transfer Pricing TNMM Audit Review:")
print(f"Tested Margin:      {subsidiary_audit['Tested_Operating_Margin']}%")
print(f"Comparable Peers:   {subsidiary_audit['Benchmark_Range']}")
print(f"Audit Status:       {subsidiary_audit['Audit_Verdict']}")
print(f"Profit Adjustment:  \${subsidiary_audit['Tax_Audit_Income_Adjustment']:,} reallocated to parent")`,
        output: `OECD Transfer Pricing TNMM Audit Review:\nTested Margin:      2.0%\nComparable Peers:   [4.0%, 8.0%] (Median 6.0%)\nAudit Status:       TRANSFER_PRICE_TOO_HIGH (Profit artificially suppressed in subsidiary)\nProfit Adjustment:  $4,000,000.0 reallocated to parent`,
        tryIt: 'Lower transfer price COGS to $74M (raising operating margin to 6.0%) to achieve ARM_LENGTH_COMPLIANT status.',
        check: {
          question: 'What is the "Arm\'s Length Principle" in international transfer pricing regulation?',
          options: [
            'Intercompany transactions between related entities must be priced as if they were conducted between unrelated independent parties bargaining under identical market conditions.',
            'Parent companies must physically separate their international offices by at least 1,000 miles.',
            'Multinational companies must donate 10% of international profits to charitable foundations.',
            'Corporate directors cannot shake hands with foreign tax inspectors.'
          ],
          answerIndex: 0,
          explanation: 'The arm\'s length standard ensures multinational corporations do not shift profits artificially into zero-tax havens by charging inflated royalties or transfer prices to their high-tax operating entities.'
        }
      },
      {
        title: 'Net Operating Loss (NOL) Carryforwards & Section 382 Limitations',
        say: [
          'High-growth tech startups often generate significant operating losses during their early research and development years. When a company incurs negative taxable income, it establishes a Net Operating Loss (NOL).',
          'Under modern corporate tax law (post-Tax Cuts and Jobs Act TCJA), NOLs can be carried forward indefinitely to shield future taxable profits. However, annual utilization is capped: NOL carryforwards can offset up to a maximum of 80% of taxable income in any single tax year.',
          'Crucially, early-stage startups that raise multiple venture capital rounds must navigate IRC Section 382: the "Ownership Change" restriction.',
          'If greater than 50% of the company\'s equity ownership changes hands over a rolling three-year period (typical when closing Series A or Series B institutional equity rounds), Section 382 severely restricts annual NOL utilization: Annual Section 382 Limitation = Fair Market Value of Firm immediately before change * Long-Term Tax-Exempt Rate.',
          'Failing to monitor Section 382 ownership thresholds can permanently trap millions of dollars in valuable accumulated tax shields.'
        ],
        example: 'A startup accumulates $10,000,000 in NOLs. In year 4, it turns profitable, earning $5,000,000. Without Section 382 restrictions, it can offset 80% ($4,000,000), paying taxes on only $1,000,000. It retains $6,000,000 of NOLs to offset future years.',
        code: `# Simulation: Net Operating Loss (NOL) Carryforward & Section 382 Cap Model
class NolTaxShieldSimulator:
    def __init__(self, accumulated_nol: float, section_382_annual_cap: float = None):
        self.nol_balance = accumulated_nol
        self.cap_382 = section_382_annual_cap

    def process_taxable_year(self, taxable_income: float, corporate_tax_rate: float = 0.25) -> dict:
        if taxable_income <= 0:
            return {"Tax_Paid": 0.0, "NOL_Used": 0.0, "Remaining_NOL": self.nol_balance}

        # 80% of taxable income statutory cap
        max_80pct_limit = taxable_income * 0.80
        
        # If Section 382 change occurred, apply annual limitation cap
        effective_utilization_cap = max_80pct_limit
        if self.cap_382 is not None:
            effective_utilization_cap = min(effective_utilization_cap, self.cap_382)

        nol_used = min(self.nol_balance, effective_utilization_cap)
        self.nol_balance -= nol_used
        
        adjusted_taxable_income = taxable_income - nol_used
        tax_paid = adjusted_taxable_income * corporate_tax_rate

        return {
            "Gross_Taxable_Income": taxable_income,
            "NOL_Shield_Utilized": round(nol_used, 2),
            "Taxable_Income_After_NOL": round(adjusted_taxable_income, 2),
            "Cash_Tax_Paid": round(tax_paid, 2),
            "Remaining_NOL_Bank": round(self.nol_balance, 2)
        }

# Startup with $10M NOL, subject to a $1.5M Section 382 annual cap following Series B
nol_engine = NolTaxShieldSimulator(accumulated_nol=10000000.0, section_382_annual_cap=1500000.0)

yr1 = nol_engine.process_taxable_year(taxable_income=4000000.0) # $4M profit (80% = $3.2M, but Section 382 caps at $1.5M!)
yr2 = nol_engine.process_taxable_year(taxable_income=6000000.0) # $6M profit

print("NOL Carryforward & Section 382 Limitation Schedule:")
print(f"Year 1: Profit \${yr1['Gross_Taxable_Income']:,} | NOL Shielded: \${yr1['NOL_Shield_Utilized']:,} | Tax Paid: \${yr1['Cash_Tax_Paid']:,} | Left: \${yr1['Remaining_NOL_Bank']:,}")
print(f"Year 2: Profit \${yr2['Gross_Taxable_Income']:,} | NOL Shielded: \${yr2['NOL_Shield_Utilized']:,} | Tax Paid: \${yr2['Cash_Tax_Paid']:,} | Left: \${yr2['Remaining_NOL_Bank']:,}")`,
        output: `NOL Carryforward & Section 382 Limitation Schedule:\nYear 1: Profit $4,000,000.0 | NOL Shielded: $1,500,000.0 | Tax Paid: $625,000.0 | Left: $8,500,000.0\nYear 2: Profit $6,000,000.0 | NOL Shielded: $1,500,000.0 | Tax Paid: $1,125,000.0 | Left: $7,000,000.0`,
        tryIt: 'Remove the Section 382 cap (set to None) and observe Year 1 shield $3,200,000 instead of $1,500,000.',
        check: {
          question: 'What is the purpose of IRC Section 382 in corporate taxation?',
          options: [
            'To prevent profitable corporations from buying bankrupt shell companies solely to traffic in their accumulated tax losses and wipe out their own tax liabilities.',
            'To mandate that all venture capital funding rounds pay a 50% federal excise tax.',
            'To force startups to convert debt into common stock upon reaching profitability.',
            'To require corporate tax returns to be audited by three separate accounting firms.'
          ],
          answerIndex: 0,
          explanation: 'Before Section 382, profitable companies would buy distressed bankrupt companies with huge accumulated NOLs simply to use their tax losses to shield unrelated earnings. Section 382 limits annual loss utilization following an ownership change (>50%).'
        }
      },
      {
        title: 'Value-Added Tax (VAT) / GST & Input Tax Credit (ITC) Chains',
        say: [
          'Unlike retail sales taxes (which are levied once at the point of consumer purchase), Value-Added Tax (VAT) and Goods and Services Tax (GST) are multi-stage indirect consumption taxes collected at every point of the economic supply chain.',
          'The core mathematical invariant of VAT/GST is the Input Tax Credit (ITC) mechanism: Tax Remitted to Government = Output Tax Collected on Sales - Input Tax Paid on Purchases.',
          'By providing an immediate credit for taxes paid on inputs, VAT completely eliminates the "cascading tax effect" (tax on tax) that historically plagued gross turnover taxes.',
          'If a business exports goods or supplies zero-rated items, its input tax credits exceed its output tax liabilities, creating an enforceable Tax Refund claim against the sovereign treasury.',
          'Auditors verify ITC matching: if a supplier fails to report an invoice or remit tax on their end, tax authorities automatically disallow the buyer\'s Input Tax Credit claim under electronic invoice matching portals.'
        ],
        example: 'A lumber mill sells wood to a furniture maker for $100 + $20 VAT (20%). The mill remits $20. The furniture maker builds a table and sells it to a consumer for $250 + $50 VAT. The furniture maker does NOT remit $50! They subtract their $20 ITC, remitting only $30. The government receives $20 + $30 = $50 total, exactly 20% of the final $250 consumer purchase.',
        code: `# Simulation: VAT / GST Multi-Stage Supply Chain Input Tax Credit (ITC) Validator
class VatSupplyChainNode:
    def __init__(self, stage_name: str, purchases: float, vat_rate: float = 0.20):
        self.stage = stage_name
        self.purchases = purchases
        self.vat_rate = vat_rate
        self.input_tax_credit = purchases * vat_rate

    def calculate_sales_tax(self, sales_price: float) -> dict:
        output_tax_collected = sales_price * self.vat_rate
        net_tax_remitted = output_tax_collected - self.input_tax_credit
        value_added = sales_price - self.purchases

        return {
            "Stage": self.stage,
            "Purchases": round(self.purchases, 2),
            "Sales_Price": round(sales_price, 2),
            "Value_Added": round(value_added, 2),
            "Output_Tax": round(output_tax_collected, 2),
            "Input_Tax_Credit": round(self.input_tax_credit, 2),
            "Net_Tax_Remitted_To_State": round(net_tax_remitted, 2)
        }

# Supply Chain: Raw Material Producer -> Manufacturer -> Retailer
producer = VatSupplyChainNode("Raw Timber Mill", purchases=0.0)
manufacturer = VatSupplyChainNode("Furniture Maker", purchases=100.0)
retailer = VatSupplyChainNode("Retail Showroom", purchases=250.0)

s1 = producer.calculate_sales_tax(sales_price=100.0)
s2 = manufacturer.calculate_sales_tax(sales_price=250.0)
s3 = retailer.calculate_sales_tax(sales_price=400.0)

chain = [s1, s2, s3]
total_tax_collected_by_treasury = sum(s["Net_Tax_Remitted_To_State"] for s in chain)

print("VAT / GST Multi-Stage Supply Chain Reconciliation:")
for step in chain:
    print(f"[{step['Stage']:<16}] Sales \${step['Sales_Price']:>5} | Output \${step['Output_Tax']:>4} - ITC \${step['Input_Tax_Credit']:>4} = Remitted \${step['Net_Tax_Remitted_To_State']:>4}")
print(f"\nTotal VAT Received by Treasury: \${total_tax_collected_by_treasury:.2f} (Exactly 20% of \$400 final retail price!)")`,
        output: `VAT / GST Multi-Stage Supply Chain Reconciliation:\n[Raw Timber Mill ] Sales $100.0 | Output  $20.0 - ITC   $0.0 = Remitted  $20.0\n[Furniture Maker ] Sales $250.0 | Output  $50.0 - ITC  $20.0 = Remitted  $30.0\n[Retail Showroom ] Sales $400.0 | Output  $80.0 - ITC  $50.0 = Remitted  $30.0\n\nTotal VAT Received by Treasury: $80.00 (Exactly 20% of $400 final retail price!)`,
        tryIt: 'Change retail price to $500 and verify total VAT received expands to exactly $100.00 (20% of $500).',
        check: {
          question: 'How does the Input Tax Credit (ITC) mechanism in VAT/GST prevent the "cascading tax" (tax on tax) problem of older sales tax systems?',
          options: [
            'By allowing intermediate businesses to deduct the tax they paid on inputs from the tax they collect on sales, ensuring tax is levied only on the net value added at each stage.',
            'By exempting all wholesale transactions from corporate income tax.',
            'By requiring consumers to pay taxes directly to the federal reserve via wire transfer.',
            'By issuing government bonds in lieu of cash tax refunds.'
          ],
          answerIndex: 0,
          explanation: 'In older cascade systems, tax was charged on the full gross value at every step, meaning the tax on raw materials was taxed again at manufacturing and again at retail. ITC offsets input tax, ensuring each business remits tax solely on its genuine incremental value added.'
        }
      }
    ],
    summary: [
      'Accelerated tax depreciation creates temporary timing differences resulting in Deferred Tax Liabilities (DTL) that systematically reverse over the asset\'s useful life.',
      'Corporate debt generates an interest tax shield ($Tax\_Rate \times Debt$), creating firm value under Modigliani-Miller until Section 163(j) 30% EBITDA caps bind.',
      'OECD transfer pricing rules mandate the Arm\'s Length Principle, using Transactional Net Margin Methods (TNMM) to ensure cross-border intercompany profits match independent peer benchmarks.',
      'Net Operating Loss (NOL) carryforwards shield future profits up to 80% of taxable income, but Section 382 ownership shifts (>50%) impose annual dollar utilization caps.',
      'VAT/GST Input Tax Credit (ITC) mechanisms eliminate cascading taxes by ensuring businesses remit only the net difference between output tax collected and input tax paid.'
    ],
    projectStep: {
      title: 'Corporate Tax Strategy & DTL Reconciliation Simulator',
      steps: [
        'Model book vs tax depreciation timing schedules to generate balance sheet DTL reversal curves.',
        'Calculate Modigliani-Miller capitalized tax shield value under Section 163(j) EBITDA deduction caps.',
        'Benchmark intercompany subsidiary profit margins against OECD arm\'s length TNMM interquartile ranges.',
        'Simulate multi-stage VAT supply chains and verify exact Input Tax Credit (ITC) mathematical balance.'
      ]
    }
  }
];
