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
  },
  {
    coursePrefix: 'bcom_tax',
    day: 2,
    title: 'OECD Pillar Two 15% Minimum Tax, R&D Credits, GILTI & Section 382 M&A Architecture',
    goal: 'Master advanced multinational corporate tax strategy: OECD BEPS Pillar 2 Global Anti-Base Erosion (GloBE) 15% minimum tax and top-up tax calculations with substance carve-outs, IRC Section 41 Alternative Simplified Credit (ASC) R&D calculations, TCJA GILTI inclusion and Section 250 deductions, Section 382 ownership change NOL limitation caps, and Section 338(h)(10) M&A asset basis step-up structuring.',
    minutes: 42,
    recap: 'Day 1 established deferred taxes (DTA/DTL), interest tax shields, and transfer pricing. Day 2 tackles multinational and transactional taxation: OECD Pillar 2 global minimum tax rules, R&D tax credits, cross-border GILTI planning, and M&A tax step-ups.',
    parts: [
      {
        title: 'OECD BEPS Pillar Two & Global Anti-Base Erosion (GloBE) 15% Minimum Tax',
        say: [
          'Under the OECD/G20 Inclusive Framework on Base Erosion and Profit Shifting (BEPS), over 140 countries agreed to Pillar Two, establishing a historic 15% Global Minimum Corporate Tax on multinational enterprise (MNE) groups with annual consolidated revenues of €750 million or more.',
          'Pillar Two introduces the Global Anti-Base Erosion (GloBE) rules to prevent a "race to the bottom" where multinational tech and pharmaceutical giants shift mobile profits into zero-tax or low-tax jurisdictions.',
          'Under the GloBE rules, the multinational calculates the Effective Tax Rate (ETR) on a jurisdictional basis: ETR = Adjusted Covered Taxes / GloBE Net Income. If the jurisdictional ETR falls below 15.0%, a Top-Up Tax percentage is calculated as: Top-Up Rate = 15.0% - ETR.',
          'Before applying the Top-Up Tax, the rules allow a Substance-Based Income Exclusion (SBIE) carve-out: a formulaic deduction based on eligible payroll costs and carrying value of eligible tangible assets located in that jurisdiction, recognizing genuine economic substance.',
          'The resulting Top-Up Tax is collected by the ultimate parent entity\'s jurisdiction via the Income Inclusion Rule (IIR) or source countries via the Undertaxed Profits Rule (UTPR), effectively neutralizing artificial offshore tax haven strategies.'
        ],
        example: 'An MNE has a subsidiary in a low-tax jurisdiction earning $50,000,000 with only $2,500,000 paid in local taxes (a 5.0% ETR). The jurisdiction has $20,000,000 in tangible server assets and $10,000,000 in local payroll, generating a $1,500,000 substance carve-out. The remaining $48,500,000 excess profit is subjected to a 10.0% Top-Up Tax ($4,850,000), payable to the parent jurisdiction to reach the 15% minimum floor.',
        code: `# Simulation: OECD BEPS Pillar Two GloBE Top-Up Tax Calculator
from typing import Dict

def calculate_pillar_two_top_up_tax(
    jurisdiction_name: str,
    accounting_net_income: float,
    covered_taxes_paid: float,
    tangible_asset_carrying_value: float,
    eligible_payroll_costs: float
) -> Dict:
    # Substance-Based Income Exclusion (SBIE): 5% carve-out for payroll and tangible assets
    sbie_payroll = eligible_payroll_costs * 0.05
    sbie_assets = tangible_asset_carrying_value * 0.05
    substance_carveout = sbie_payroll + sbie_assets

    excess_profit = max(0.0, accounting_net_income - substance_carveout)

    # Effective Tax Rate (ETR)
    effective_tax_rate = (covered_taxes_paid / accounting_net_income) * 100.0 if accounting_net_income > 0 else 0.0

    # GloBE Minimum Rate is 15.0%
    top_up_tax_percentage = max(0.0, 15.0 - effective_tax_rate)
    top_up_tax_payable = excess_profit * (top_up_tax_percentage / 100.0)

    return {
        "Jurisdiction": jurisdiction_name,
        "Accounting_Profit": round(accounting_net_income, 2),
        "Local_ETR_Pct": round(effective_tax_rate, 2),
        "Substance_Carveout": round(substance_carveout, 2),
        "Excess_Taxable_Profit": round(excess_profit, 2),
        "Top_Up_Tax_Rate_Pct": round(top_up_tax_percentage, 2),
        "Top_Up_Tax_Payable": round(top_up_tax_payable, 2)
    }

p2_res = calculate_pillar_two_top_up_tax(
    jurisdiction_name="Cayman_Subsidiary",
    accounting_net_income=50000000.0,
    covered_taxes_paid=2500000.0, # 5% local ETR
    tangible_asset_carrying_value=20000000.0,
    eligible_payroll_costs=10000000.0
)
print(f"Jurisdiction: {p2_res['Jurisdiction']} | Local ETR: {p2_res['Local_ETR_Pct']}%")
print(f"Top-Up Tax Rate: {p2_res['Top_Up_Tax_Rate_Pct']}% -> Tax Due to Parent State: \${p2_res['Top_Up_Tax_Payable']:,.2f}")`,
        output: `Jurisdiction: Cayman_Subsidiary | Local ETR: 5.0%\nTop-Up Tax Rate: 10.0% -> Tax Due to Parent State: $4,850,000.00`,
        tryIt: 'Increase eligible_payroll_costs to $30,000,000 and tangible_asset_carrying_value to $40,000,000 to observe how higher real local substance expands the SBIE carveout and lowers the Top-Up Tax liability.',
        check: {
          question: 'What is the primary operational effect of the OECD BEPS Pillar 2 Top-Up Tax mechanism on multinational tax havens?',
          options: [
            '(Recommended) If a low-tax jurisdiction charges an effective tax rate below 15%, the parent company country or source countries collect a Top-Up Tax on excess profits, effectively neutralizing the incentive to artificially shift profits to tax havens.',
            'It automatically dissolves any foreign subsidiary that operates outside the European Union.',
            'It forces multinational enterprises to pay 100% of their worldwide revenue directly to the United Nations.',
            'It eliminates corporate income tax entirely and replaces it with a global digital transaction fee.'
          ],
          answer: 0,
          why: 'Pillar Two ensures that if an affiliate pays less than 15% ETR locally, the parent company jurisdiction collects the shortfall through the Income Inclusion Rule (IIR), nullifying zero-tax haven advantages.',
          answerIndex: 0,
          explanation: 'Pillar Two ensures that if an affiliate pays less than 15% ETR locally, the parent company jurisdiction collects the shortfall through the Income Inclusion Rule (IIR), nullifying zero-tax haven advantages.'
        }
      },
      {
        title: 'IRC Section 41 Research & Development (R&D) Tax Credit Mechanics',
        say: [
          'Corporate tax planning distinguishes between tax deductions and tax credits: while a deduction reduces taxable income (saving cash equal to deduction * corporate tax rate), a tax credit provides a direct, dollar-for-dollar reduction of the company\'s tax liability.',
          'Under Section 41 of the Internal Revenue Code, US corporations investing in domestic research, software engineering, and scientific development can claim the Credit for Increasing Research Activities (the R&D Tax Credit).',
          'To qualify as a Qualified Research Expense (QRE), expenses must pass the 4-part IRS test: 1. Permitted Purpose (developing new or improved functionality, performance, or quality under Section 174); 2. Technological in Nature (relying on computer science, engineering, or physical/biological science); 3. Elimination of Uncertainty (technical feasibility was uncertain at project outset); 4. Process of Experimentation (systematically testing alternatives via prototyping or simulation).',
          'Eligible expenses include US employee wages directly engaged in or supervising qualified research, engineering supplies, and 65% of third-party contractor research costs.',
          'Under the Alternative Simplified Credit (ASC) method, the credit equals 14% of current-year QREs that exceed a base amount defined as 50% of the average QREs over the preceding three taxable years.'
        ],
        example: 'A technology company incurs $8,000,000 in software engineering QREs this year, compared to a prior 3-year average of $5,500,000. Under the ASC method, the 50% base threshold is $2,750,000. The incremental $5,250,000 produces an immediate $735,000 dollar-for-dollar reduction in corporate income taxes.',
        code: `# Simulation: IRC Section 41 R&D Alternative Simplified Credit (ASC) Calculator
from typing import Dict, List

def calculate_rd_tax_credit(
    current_year_qre: float,
    prior_year_qres: List[float] # 3 preceding taxable years
) -> Dict:
    # Alternative Simplified Credit (ASC) Formula:
    # Credit = 14% * (Current QRE - 50% * Average Prior 3-Year QRE)
    prior_3yr_avg = sum(prior_year_qres) / len(prior_year_qres) if prior_year_qres else 0.0
    base_amount = 0.50 * prior_3yr_avg
    incremental_qre = max(0.0, current_year_qre - base_amount)
    federal_rd_credit = incremental_qre * 0.14

    return {
        "Current_Year_QRE": round(current_year_qre, 2),
        "Prior_3Yr_Average_QRE": round(prior_3yr_avg, 2),
        "Base_Amount_Threshold": round(base_amount, 2),
        "Incremental_QRE": round(incremental_qre, 2),
        "Federal_RD_Tax_Credit": round(federal_rd_credit, 2)
    }

rd_res = calculate_rd_tax_credit(
    current_year_qre=8000000.0,
    prior_year_qres=[5000000.0, 5500000.0, 6000000.0] # Avg = $5.5M, Base = $2.75M
)
print(f"Current QRE: \${rd_res['Current_Year_QRE']:,.2f} | Base Threshold: \${rd_res['Base_Amount_Threshold']:,.2f}")
print(f"Incremental QRE: \${rd_res['Incremental_QRE']:,.2f} -> Dollar-for-Dollar Credit: \${rd_res['Federal_RD_Tax_Credit']:,.2f}")`,
        output: `Current QRE: $8,000,000.00 | Base Threshold: $2,750,000.00\nIncremental QRE: $5,250,000.00 -> Dollar-for-Dollar Credit: $735,000.00`,
        tryIt: 'Change current_year_qre to $10,000,000 to observe how accelerated engineering investment expands the federal credit to $1,015,000.',
        check: {
          question: 'Why is an IRC Section 41 R&D tax credit economically more valuable to an enterprise than an ordinary business expense tax deduction?',
          options: [
            '(Recommended) A tax credit reduces final tax liability dollar-for-dollar, whereas a tax deduction only saves cash equal to the deduction multiplied by the corporate tax rate (e.g., $1.00 credit saves $1.00, while $1.00 deduction at 21% saves $0.21).',
            'Because tax credits can be converted into physical gold coins issued by the US Mint.',
            'Because deductions are subject to mandatory 50% interest penalties under the Internal Revenue Code.',
            'Because R&D tax credits permanently exempt the company from filing quarterly IRS returns.'
          ],
          answer: 0,
          why: 'Credits directly offset tax liabilities dollar-for-dollar, providing nearly 5x the cash value of a deduction at a 21% corporate tax rate.',
          answerIndex: 0,
          explanation: 'Credits directly offset tax liabilities dollar-for-dollar, providing nearly 5x the cash value of a deduction at a 21% corporate tax rate.'
        }
      },
      {
        title: 'GILTI Foreign Intangible Income & Section 250 Deduction Architecture',
        say: [
          'Enacted under the Tax Cuts and Jobs Act (TCJA) of 2017, the Global Intangible Low-Taxed Income (GILTI) regime fundamentally changed how US multinational corporations tax earnings of Controlled Foreign Corporations (CFCs).',
          'Before GILTI, US companies could avoid domestic taxation indefinitely by shifting valuable IP (patents, software algorithms) into foreign subsidiaries and deferring dividend repatriations.',
          'The GILTI regime assumes that tangible physical assets naturally yield a routine return: Deemed Tangible Income Return (DTIR = 10% * Qualified Business Asset Investment [QBAI]). QBAI is the quarterly average depreciable tax basis of tangible business property.',
          'Any foreign subsidiary net tested income earned above that 10% routine tangible return is classified as Net Deemed Intangible Income (GILTI) and taxed currently in the US regardless of whether it is repatriated.',
          'To keep US MNEs globally competitive, Section 250 grants a 50% deduction against GILTI, resulting in an effective federal corporate tax rate of 10.5% (prior to 2026), and allows an 80% foreign tax credit (FTC) offset for foreign taxes paid.'
        ],
        example: 'A US tech company\'s Irish subsidiary earns $12M with $20M in physical servers/data centers (QBAI). The 10% routine return is $2M, leaving $10M of GILTI deemed intangible income. With a 50% Section 250 deduction, only $5M is taxed at 21% ($1,050,000 tentative US tax). After an 80% FTC credit ($480,000 on $600k foreign tax paid), net US tax is $570,000.',
        code: `# Simulation: TCJA GILTI Inclusion, Section 250 Deduction & FTC Engine
from typing import Dict

def calculate_gilti_inclusion_and_tax(
    cfc_tested_income: float,
    qbai_tangible_assets: float,
    foreign_taxes_paid: float,
    us_statutory_tax_rate: float = 0.21,
    section_250_deduction_pct: float = 50.0
) -> Dict:
    # Deemed Tangible Income Return (DTIR) = 10% of QBAI
    dtir = qbai_tangible_assets * 0.10
    net_deemed_intangible_income = max(0.0, cfc_tested_income - dtir)

    # Section 250 allows 50% deduction against GILTI inclusion
    gilti_taxable_base = net_deemed_intangible_income * (1.0 - section_250_deduction_pct / 100.0)
    tentative_us_tax = gilti_taxable_base * us_statutory_tax_rate

    # Foreign Tax Credit (FTC) haircut: 80% of foreign taxes allocable to GILTI
    ftc_allowable = min(tentative_us_tax, foreign_taxes_paid * 0.80)
    net_us_tax_due = max(0.0, tentative_us_tax - ftc_allowable)

    return {
        "CFC_Tested_Income": round(cfc_tested_income, 2),
        "DTIR_Routine_Return": round(dtir, 2),
        "Net_GILTI_Inclusion": round(net_deemed_intangible_income, 2),
        "Taxable_Base_Post_Sec250": round(gilti_taxable_base, 2),
        "Tentative_US_Tax": round(tentative_us_tax, 2),
        "Foreign_Tax_Credit_Offset": round(ftc_allowable, 2),
        "Net_US_GILTI_Tax_Due": round(net_us_tax_due, 2)
    }

gilti_res = calculate_gilti_inclusion_and_tax(
    cfc_tested_income=12000000.0,
    qbai_tangible_assets=20000000.0, # DTIR = $2M -> GILTI = $10M
    foreign_taxes_paid=600000.0,
    us_statutory_tax_rate=0.21,
    section_250_deduction_pct=50.0
)
print(f"CFC Income: \${gilti_res['CFC_Tested_Income']:,.2f} | DTIR Routine Return: \${gilti_res['DTIR_Routine_Return']:,.2f}")
print(f"GILTI Inclusion: \${gilti_res['Net_GILTI_Inclusion']:,.2f} -> Net US Tax Due: \${gilti_res['Net_US_GILTI_Tax_Due']:,.2f}")`,
        output: `CFC Income: $12,000,000.00 | DTIR Routine Return: $2,000,000.00\nGILTI Inclusion: $10,000,000.00 -> Net US Tax Due: $570,000.00`,
        tryIt: 'Increase foreign_taxes_paid to $1,500,000 to observe how foreign tax credits completely eliminate residual US GILTI tax liability.',
        check: {
          question: 'What is the role of Qualified Business Asset Investment (QBAI) in the US GILTI corporate tax calculation?',
          options: [
            '(Recommended) A routine 10% return on tangible depreciable assets (QBAI) is exempt from GILTI, so only foreign earnings exceeding that 10% threshold are taxed as low-taxed intangible income.',
            'QBAI determines the minimum hourly wage that must be paid to overseas factory workers.',
            'QBAI converts all foreign debt into equity capital for US tax accounting purposes.',
            'QBAI is a penalty fee levied on US companies that purchase foreign real estate.'
          ],
          answer: 0,
          why: 'The GILTI regime assumes tangible assets naturally earn a routine 10% return; only earnings beyond that routine return (DTIR) are treated as mobile intangible profits subject to GILTI.',
          answerIndex: 0,
          explanation: 'The GILTI regime assumes tangible assets naturally earn a routine 10% return; only earnings beyond that routine return (DTIR) are treated as mobile intangible profits subject to GILTI.'
        }
      },
      {
        title: 'Section 382 Ownership Change & NOL Annual Utilization Cap Mechanics',
        say: [
          'Net Operating Losses (NOLs) are valuable corporate tax shields generated when tax-deductible expenses exceed taxable revenues. Historically, profitable companies routinely acquired bankrupt "loss shell" companies merely to buy their accumulated NOLs and eliminate corporate tax bills.',
          'To prevent the trafficking of tax losses, Congress enacted Section 382 of the Internal Revenue Code. Section 382 imposes a strict statutory annual dollar cap on the utilization of pre-change NOLs whenever an "Ownership Change" occurs.',
          'An Ownership Change occurs if the percentage of stock owned by one or more 5-percent shareholders increases by more than 50 percentage points over the lowest percentage owned by those shareholders during a rolling 3-year testing period (common during venture equity rounds, secondary transactions, and acquisitions).',
          'Once triggered, the annual deduction limit is calculated as: Annual Section 382 Limit = Fair Market Value of Old Loss Corporation Immediately Before Change * Federal Long-Term Tax-Exempt Rate published monthly by the IRS.',
          'Furthermore, under TCJA rules, post-2017 NOLs can only offset up to 80% of taxable income in any given year. Any portion of the annual Section 382 limitation not utilized in a year rolls over to increase the limitation in subsequent years.'
        ],
        example: 'An enterprise acquires a startup with $15,000,000 in accumulated NOLs for $25,000,000 equity value when the long-term tax-exempt rate is 3.45%. Even though the acquiring company earns $10,000,000 this year, Section 382 strictly caps annual NOL usage to $862,500 ($25M * 3.45%). The remaining $14,137,500 of NOLs carries forward to future years.',
        code: `# Simulation: IRC Section 382 Ownership Change & NOL Annual Cap Engine
from typing import Dict

def calculate_section_382_nol_limitation(
    loss_corporation_equity_value: float,
    long_term_tax_exempt_rate_pct: float,
    accumulated_nol_pool: float,
    annual_taxable_income: float
) -> Dict:
    # Annual Section 382 Base Limitation = Value of Old Loss Corporation * Federal Long-Term Tax-Exempt Rate
    annual_nol_cap = loss_corporation_equity_value * (long_term_tax_exempt_rate_pct / 100.0)

    # NOL utilized cannot exceed 80% of taxable income under TCJA, nor the Section 382 annual cap
    tcja_income_ceiling = annual_taxable_income * 0.80
    nol_utilized_this_year = min(annual_nol_cap, tcja_income_ceiling, accumulated_nol_pool)
    remaining_nol_pool = accumulated_nol_pool - nol_utilized_this_year
    net_taxable_income_post_nol = annual_taxable_income - nol_utilized_this_year

    return {
        "Loss_Co_Equity_Value": round(loss_corporation_equity_value, 2),
        "Long_Term_Tax_Exempt_Rate": f"{long_term_tax_exempt_rate_pct}%",
        "Annual_Section_382_Limit": round(annual_nol_cap, 2),
        "Annual_Taxable_Income": round(annual_taxable_income, 2),
        "NOL_Utilized": round(nol_utilized_this_year, 2),
        "Net_Taxable_Income": round(net_taxable_income_post_nol, 2),
        "Remaining_NOL_Pool": round(remaining_nol_pool, 2)
    }

sec382_res = calculate_section_382_nol_limitation(
    loss_corporation_equity_value=25000000.0,
    long_term_tax_exempt_rate_pct=3.45, # $25M * 3.45% = $862,500/year cap
    accumulated_nol_pool=15000000.0,
    annual_taxable_income=10000000.0
)
print(f"Old Value: \${sec382_res['Loss_Co_Equity_Value']:,.2f} @ {sec382_res['Long_Term_Tax_Exempt_Rate']}")
print(f"Annual 382 Limit: \${sec382_res['Annual_Section_382_Limit']:,.2f} -> NOL Utilized: \${sec382_res['NOL_Utilized']:,.2f} (Remaining: \${sec382_res['Remaining_NOL_Pool']:,.2f})")`,
        output: `Old Value: $25,000,000.00 @ 3.45%\nAnnual 382 Limit: $862,500.00 -> NOL Utilized: $862,500.00 (Remaining: $14,137,500.00)`,
        tryIt: 'Change loss_corporation_equity_value to $50,000,000 to observe how higher acquisition valuation expands the annual 382 deduction limit to $1,725,000.',
        check: {
          question: 'What triggers an IRC Section 382 limitation on a corporation\'s ability to utilize accumulated Net Operating Loss (NOL) carryforwards?',
          options: [
            '(Recommended) A cumulative ownership change of more than 50 percentage points by 5-percent shareholders over a rolling three-year testing period.',
            'Whenever the corporation experiences two consecutive quarters of negative operating margin.',
            'When the corporation changes its primary corporate bank or auditing firm.',
            'Whenever the company issues options to more than 10 new software engineering hires.'
          ],
          answer: 0,
          why: 'Section 382 is triggered specifically by a greater than 50 percentage point shift in ownership among 5% shareholders over a 3-year period, imposing an annual dollar cap based on pre-change equity value.',
          answerIndex: 0,
          explanation: 'Section 382 is triggered specifically by a greater than 50 percentage point shift in ownership among 5% shareholders over a 3-year period, imposing an annual dollar cap based on pre-change equity value.'
        }
      },
      {
        title: 'M&A Section 338(h)(10) Stock-as-Asset Sale Basis Step-Up Structuring',
        say: [
          'In corporate mergers and acquisitions (M&A), a fundamental structural conflict exists between buyers and sellers regarding tax treatment.',
          'Buyers strongly prefer an Asset Purchase: acquiring assets directly steps up their tax basis from historical cost to the purchase price, enabling enormous future tax deductions via depreciation and Section 197 15-year intangible amortization. Sellers strongly resist asset sales because target corporations face double taxation (corporate tax on asset gain, then personal tax on liquidation).',
          'Sellers prefer a Stock Sale: shareholders recognize only single-layer capital gains tax. However, the buyer inherits the target\'s historical low asset tax basis ("carryover basis"), sacrificing millions in potential tax depreciation.',
          'To resolve this impasse, IRC Section 338(h)(10) allows an acquiring corporation and the target\'s shareholders (in eligible S corporations or corporate subsidiary sales) to make a joint election to treat a qualified stock purchase as a deemed asset purchase for federal income tax purposes.',
          'Under Section 338(h)(10), the transaction is legally a clean stock sale with no operational contract assignment friction, but for tax purposes the buyer achieves a full Fair Market Value basis step-up, creating a massive lifetime cash tax shield.'
        ],
        example: 'A buyer acquires a corporate subsidiary for $40,000,000 whose historical tax basis in assets is only $10,000,000. Making a Section 338(h)(10) election creates a $30,000,000 basis step-up. Amortized over 15 years ($2M/year deduction) at a 25% tax rate, the buyer realizes $500,000 in cash tax savings every year, generating a $7,500,000 lifetime tax shield.',
        code: `# Simulation: M&A IRC Section 338(h)(10) Asset Basis Step-Up Tax Shield Model
from typing import Dict

def calculate_section_338h10_basis_step_up(
    purchase_price: float,
    current_tax_basis_of_assets: float,
    combined_corporate_tax_rate: float,
    annual_asset_depreciation_years: int = 15
) -> Dict:
    # Basis Step-Up Amount
    basis_step_up = max(0.0, purchase_price - current_tax_basis_of_assets)

    # Future Tax Shield = Step-Up * Tax Rate
    total_lifetime_tax_shield = basis_step_up * combined_corporate_tax_rate
    annual_tax_amortization_deduction = basis_step_up / annual_asset_depreciation_years
    annual_cash_tax_savings = annual_tax_amortization_deduction * combined_corporate_tax_rate

    return {
        "Purchase_Price": round(purchase_price, 2),
        "Historical_Tax_Basis": round(current_tax_basis_of_assets, 2),
        "Basis_Step_Up_Created": round(basis_step_up, 2),
        "Annual_Amortization_Deduction": round(annual_tax_amortization_deduction, 2),
        "Annual_Cash_Tax_Savings": round(annual_cash_tax_savings, 2),
        "Total_Lifetime_Tax_Shield": round(total_lifetime_tax_shield, 2)
    }

stepup_res = calculate_section_338h10_basis_step_up(
    purchase_price=40000000.0,
    current_tax_basis_of_assets=10000000.0, # $30M Step-up
    combined_corporate_tax_rate=0.25, # 25% tax rate
    annual_asset_depreciation_years=15 # 15-year Section 197 intangible amortization
)
print(f"Acquisition: \${stepup_res['Purchase_Price']:,.2f} | Basis Step-Up: \${stepup_res['Basis_Step_Up_Created']:,.2f}")
print(f"Annual Tax Savings: \${stepup_res['Annual_Cash_Tax_Savings']:,.2f}/yr -> Lifetime Tax Shield: \${stepup_res['Total_Lifetime_Tax_Shield']:,.2f}")`,
        output: `Acquisition: $40,000,000.00 | Basis Step-Up: $30,000,000.00\nAnnual Tax Savings: $500,000.00/yr -> Lifetime Tax Shield: $7,500,000.00`,
        tryIt: 'Change purchase_price to $50,000,000 to observe how higher purchase premiums expand the basis step-up and lifetime cash tax shield to $10,000,000.',
        check: {
          question: 'What is the primary tax benefit to an acquiring corporation of executing a joint IRC Section 338(h)(10) election in a stock purchase transaction?',
          options: [
            '(Recommended) The buyer is permitted to step up the tax basis of the target company\'s acquired assets to the purchase price, generating substantial future depreciation and amortization tax deductions.',
            'The buyer is completely exempt from paying federal payroll taxes for the next 10 fiscal years.',
            'The seller receives an immediate cash subsidy directly from the US Department of the Treasury.',
            'The target company automatically becomes a non-profit entity immune from corporate audits.'
          ],
          answer: 0,
          why: 'Section 338(h)(10) allows a stock acquisition to be treated as an asset sale for tax purposes, stepping up target asset basis to market value and generating millions in future depreciation tax shields.',
          answerIndex: 0,
          explanation: 'Section 338(h)(10) allows a stock acquisition to be treated as an asset sale for tax purposes, stepping up target asset basis to market value and generating millions in future depreciation tax shields.'
        }
      }
    ],
    summary: [
      'OECD BEPS Pillar Two enforces a global 15% minimum corporate tax on MNEs, applying Top-Up Taxes to low-taxed foreign income exceeding substance carve-outs.',
      'IRC Section 41 Alternative Simplified Credit (ASC) rewards incremental R&D investments with direct dollar-for-dollar tax liability offsets.',
      'TCJA GILTI taxes foreign CFC intangible earnings above a 10% routine tangible asset return (DTIR), softened by Section 250 deductions and foreign tax credits.',
      'Section 382 caps annual NOL deductions following a >50% ownership change to the old equity value multiplied by the federal long-term tax-exempt rate.',
      'Joint Section 338(h)(10) M&A elections allow stock purchases to achieve asset basis step-up, unlocking substantial future depreciation and amortization tax shields.'
    ],
    projectStep: {
      title: 'Multinational Corporate Tax & M&A Structuring Simulator',
      steps: [
        'Calculate OECD Pillar Two Top-Up Tax exposure factoring in payroll and tangible asset substance exclusions.',
        'Model Section 41 R&D tax credit yields using the Alternative Simplified Credit 3-year trailing average formula.',
        'Simulate GILTI foreign income inclusions and Section 250 tax liability mitigations.',
        'Structure Section 382 NOL utilization schedules and Section 338(h)(10) basis step-up cash tax savings.'
      ]
    }
  },
  {
    coursePrefix: 'bcom_tax',
    day: 3,
    title: 'Advanced Transfer Pricing (DEMPE), Advance Pricing Agreements (APA) & CbCR Risk Analytics',
    goal: 'Master global transfer pricing compliance under OECD BEPS Action 8-10 and Action 13: intangible profit allocation via the DEMPE framework, Residual Profit Split Method (RPSM) vs TNMM, Bilateral APAs and Mutual Agreement Procedures (MAP), thin capitalization caps under IRC Section 163(j), and Country-by-Country Reporting (CbCR) audit risk analytics.',
    minutes: 45,
    recap: 'In Day 2, we evaluated global minimum taxes under OECD Pillar Two and strategic Section 382/338 M&A tax shields. Today, we confront the single largest battleground in multinational corporate tax: transfer pricing, intercompany profit attribution, and cross-border audit defense.',
    parts: [
      {
        title: 'OECD BEPS DEMPE Framework for Intangibles & Value Creation Allocation',
        say: [
          'For decades, multinational enterprises used aggressive base erosion structures to assign valuable patents and software copyrights to zero-tax offshore shell companies that had zero employees or physical offices. Under historic formalistic tax rules, whoever held legal paper title to an intangible asset was assumed to own all residual economic profits generated by that asset worldwide.',
          'The OECD BEPS Actions 8-10 shattered this artificial construct by introducing the revolutionary DEMPE framework: Development, Enhancement, Maintenance, Protection, and Exploitation. Under modern international tax standards, profits generated by intangible property must be allocated to the corporate entities that actually perform the operational functions and exercise active control over commercial risks.',
          'If a Caribbean holding company simply wires cash to fund research but employs no scientists, software engineers, or IP licensing managers capable of controlling development risks, it is categorized as a mere passive funding vehicle. International tax law restricts such cash boxes to a risk-free routine return on capital, reallocating all residual super-profits to the operational hubs that actually designed, maintained, and commercialized the technology.'
        ],
        example: 'A global fintech entity legally registers its core neural network algorithm in Bermuda with $50M of initial funding capital. However, all AI architecture (Development) and daily cloud maintenance (Maintenance) occur in Silicon Valley, while EU marketing and client onboarding (Exploitation) occur in London. Under DEMPE, Bermuda is restricted to a 3% risk-free financing yield ($1.5M), while the remaining $98.5M of residual profit is apportioned between the US engineering and UK commercialization hubs.',
        code: `def evaluate_dempe_intangible_profit_allocation(
    total_ip_residual_profit: float,
    entities: list,
    weights: dict = None
) -> dict:
    if weights is None:
        weights = {
            "development": 0.30,
            "enhancement": 0.20,
            "maintenance": 0.15,
            "protection": 0.15,
            "exploitation": 0.20
        }
    
    total_substance_score = 0.0
    scored_entities = []
    
    for entity in entities:
        has_substance = entity.get("has_operational_personnel", False)
        
        if not has_substance:
            routine_return = entity.get("funding_capital", 0.0) * entity.get("risk_free_rate", 0.03)
            scored_entities.append({
                "entity_name": entity["name"],
                "role": "PASSIVE_FUNDING_ENTITY",
                "dempe_score": 0.0,
                "profit_allocated": round(routine_return, 2),
                "is_residual_eligible": False
            })
        else:
            scores = entity.get("scores", {})
            weighted_score = sum(scores.get(k, 0.0) * weights[k] for k in weights)
            total_substance_score += weighted_score
            scored_entities.append({
                "entity_name": entity["name"],
                "role": "DEMPE_OPERATIONAL_HUB",
                "dempe_score": round(weighted_score, 4),
                "profit_allocated": 0.0,
                "is_residual_eligible": True
            })
            
    routine_deducted = sum(e["profit_allocated"] for e in scored_entities if not e["is_residual_eligible"])
    distributable_residual = max(0.0, total_ip_residual_profit - routine_deducted)
    
    for e in scored_entities:
        if e["is_residual_eligible"]:
            share = (e["dempe_score"] / total_substance_score) if total_substance_score > 0 else 0.0
            alloc = distributable_residual * share
            e["profit_allocated"] = round(alloc, 2)
            e["allocation_pct"] = round(share * 100.0, 2)
        else:
            e["allocation_pct"] = round((e["profit_allocated"] / total_ip_residual_profit) * 100.0, 2)
            
    return {
        "total_residual_profit_usd": round(total_ip_residual_profit, 2),
        "routine_funding_deductions_usd": round(routine_deducted, 2),
        "distributable_dempe_residual_usd": round(distributable_residual, 2),
        "allocations": scored_entities
    }

p1 = evaluate_dempe_intangible_profit_allocation(
    total_ip_residual_profit=100000000.0,
    entities=[
        {"name": "Bermuda IP HoldCo", "has_operational_personnel": False, "funding_capital": 50000000.0, "risk_free_rate": 0.03},
        {"name": "US R&D Center", "has_operational_personnel": True, "scores": {"development": 9.0, "enhancement": 8.0, "maintenance": 7.0, "protection": 6.0, "exploitation": 5.0}},
        {"name": "UK Commercialization Ltd", "has_operational_personnel": True, "scores": {"development": 2.0, "enhancement": 4.0, "maintenance": 6.0, "protection": 5.0, "exploitation": 9.0}}
    ]
)
alloc_s = "$" + f"{p1['distributable_dempe_residual_usd']:,.2f}"
print(f"Distributable DEMPE Residual: {alloc_s} | Entities: {len(p1['allocations'])}")
for a in p1['allocations']:
    p_val = "$" + f"{a['profit_allocated']:,.2f}"
    print(f"  {a['entity_name']}: {p_val} ({a['allocation_pct']}%) -> {a['role']}")`,
        output: `Distributable DEMPE Residual: $98,500,000.00 | Entities: 3\n  Bermuda IP HoldCo: $1,500,000.00 (1.5%) -> PASSIVE_FUNDING_ENTITY\n  US R&D Center: $59,018,595.04 (59.92%) -> DEMPE_OPERATIONAL_HUB\n  UK Commercialization Ltd: $39,481,404.96 (40.08%) -> DEMPE_OPERATIONAL_HUB`,
        codeNotes: [
          { line: 5, note: 'Applies weighted DEMPE scoring across development, enhancement, maintenance, protection, and exploitation' },
          { line: 17, note: 'Restricts passive funding entities lacking operational personnel to a 3% risk-free routine return' },
          { line: 36, note: 'Reallocates $98.5M residual profit pool strictly across operational hubs based on economic substance' },
          { line: 45, note: 'Computes jurisdictional percentage allocations compliant with OECD BEPS Action 8 transfer pricing rules' }
        ],
        tryIt: 'Flip has_operational_personnel to True for Bermuda with modest scores to observe how substance shifts residual profits offshore.',
        check: {
          question: 'Under OECD BEPS Action 8-10 DEMPE guidelines, what return is an offshore holding company entitled to if it legally owns a proprietary software patent and funds its development, but employs no staff capable of actively managing technical or commercial risk?',
          options: [
            'Only a routine, risk-free financing return on its invested capital, with all residual IP profits allocated to active operating entities.',
            '100% of all global gross licensing royalties free of local tax withholding.',
            'A mandatory 50% split of all profits before interest, taxes, depreciation, and amortization.',
            'Complete immunity from tax audit adjustments under the WTO Safe Harbor Convention.'
          ],
          answer: 0,
          why: 'BEPS Action 8-10 explicitly establishes that legal ownership without operational substance and risk control entitles the funding entity solely to a routine risk-free return, reallocating residual profits to entities managing DEMPE functions.',
          answerIndex: 0,
          explanation: 'BEPS Action 8-10 explicitly establishes that legal ownership without operational substance and risk control entitles the funding entity solely to a routine risk-free return, reallocating residual profits to entities managing DEMPE functions.'
        }
      },
      {
        title: 'Residual Profit Split Method (RPSM) vs Transactional Net Margin Method (TNMM)',
        say: [
          'Selecting the most appropriate transfer pricing methodology is the cornerstone of defending intercompany transactions against multi-million dollar audit assessments. When an intercompany transaction is one-sided—such as a routine distributor or contract manufacturer—the Transactional Net Margin Method (TNMM) benchmarks the tested party against comparable independent companies using net cost-plus or operating margins.',
          'However, when both related entities contribute unique, highly valuable non-routine intangibles or engage in deeply integrated cross-border operations, one-sided methods like TNMM fail catastrophically. In these complex corporate ecosystems, the OECD guidelines mandate the two-step Residual Profit Split Method (RPSM).',
          'In Step 1 of RPSM, each participating entity is allocated a routine arm\'s length return based on their tangible operating asset base and market benchmarks. In Step 2, the combined remaining profit—the non-routine residual—is split between the entities according to relative capitalized R&D expenditures, patent generation, or brand equity contributions.'
        ],
        example: 'A German precision engineering unit manufactures customized autonomous turbines using specialized robotics ($50M operating assets), while a Swiss affiliate develops proprietary algorithmic control firmware ($40M operating assets). Total system revenue is $150M against $90M operating costs, generating $60M combined operating profit. Routine asset returns absorb $6.4M ($4.0M to Germany at 8%, $2.4M to Switzerland at 6%), leaving $53.6M of residual profit split 35% / 65% based on relative patent valuation.',
        code: `def compute_residual_profit_split_method(
    system_revenue: float,
    system_cogs_and_opex: float,
    entities: list,
    residual_split_weights: dict
) -> dict:
    combined_operating_profit = system_revenue - system_cogs_and_opex
    
    routine_allocations = []
    total_routine_return = 0.0
    
    for ent in entities:
        routine_ret = ent["operating_assets"] * ent["benchmark_return_rate"]
        total_routine_return += routine_ret
        routine_allocations.append({
            "name": ent["name"],
            "operating_assets": ent["operating_assets"],
            "benchmark_rate_pct": round(ent["benchmark_return_rate"] * 100, 2),
            "routine_profit": round(routine_ret, 2)
        })
        
    residual_profit = combined_operating_profit - total_routine_return
    total_residual_weight = sum(residual_split_weights.values())
    final_results = []
    
    for r in routine_allocations:
        weight = residual_split_weights.get(r["name"], 0.0)
        share_pct = weight / total_residual_weight if total_residual_weight > 0 else 0.0
        ent_residual = residual_profit * share_pct
        total_profit = r["routine_profit"] + ent_residual
        final_results.append({
            "entity": r["name"],
            "routine_profit_usd": r["routine_profit"],
            "residual_share_pct": round(share_pct * 100, 2),
            "residual_profit_usd": round(ent_residual, 2),
            "total_allocated_profit_usd": round(total_profit, 2)
        })
        
    return {
        "system_revenue": round(system_revenue, 2),
        "combined_operating_profit": round(combined_operating_profit, 2),
        "total_routine_profit": round(total_routine_return, 2),
        "residual_system_profit": round(residual_profit, 2),
        "entity_breakdown": final_results
    }

p2 = compute_residual_profit_split_method(
    system_revenue=150000000.0,
    system_cogs_and_opex=90000000.0,
    entities=[
        {"name": "German Manufacturing GmbH", "operating_assets": 50000000.0, "benchmark_return_rate": 0.08},
        {"name": "Swiss Technology Hub SA", "operating_assets": 40000000.0, "benchmark_return_rate": 0.06}
    ],
    residual_split_weights={"German Manufacturing GmbH": 0.35, "Swiss Technology Hub SA": 0.65}
)
comb_p = "$" + f"{p2['combined_operating_profit']:,.2f}"
res_p = "$" + f"{p2['residual_system_profit']:,.2f}"
print(f"Combined Operating Profit: {comb_p} | Residual: {res_p}")
for eb in p2['entity_breakdown']:
    tot_s = "$" + f"{eb['total_allocated_profit_usd']:,.2f}"
    print(f"  {eb['entity']}: Total Profit {tot_s} (Residual Share: {eb['residual_share_pct']}%)")`,
        output: `Combined Operating Profit: $60,000,000.00 | Residual: $53,600,000.00\n  German Manufacturing GmbH: Total Profit $22,760,000.00 (Residual Share: 35.0%)\n  Swiss Technology Hub SA: Total Profit $37,240,000.00 (Residual Share: 65.0%)`,
        codeNotes: [
          { line: 7, note: 'Calculates combined operating income across the integrated cross-border value chain' },
          { line: 13, note: 'Executes Step 1 routine return allocations based on entity operating assets and market hurdle rates' },
          { line: 23, note: 'Determines residual profit pool ($53.6M) remaining after routine capital compensation' },
          { line: 31, note: 'Executes Step 2 profit split distributing non-routine profits according to verified R&D intangible weights' }
        ],
        tryIt: 'Adjust Swiss residual split weight to 0.80 to observe how higher software IP weighting alters intercompany tax distributions.',
        check: {
          question: 'Why does the OECD recommend the Residual Profit Split Method (RPSM) over one-sided methods like TNMM for highly integrated multinational operations?',
          options: [
            'Because when both cross-border entities contribute unique, non-routine intangibles, no reliable external comparables exist for either side, requiring a two-step routine and residual allocation.',
            'Because RPSM completely exempts both corporations from filing annual audited tax returns.',
            'Because TNMM is illegal under the European Union Common Corporate Consolidated Tax Base directive.',
            'Because RPSM automatically converts all corporate taxable profits into capital gains.'
          ],
          answer: 0,
          why: 'One-sided methods require benchmarking a simple routine party. When both entities contribute valuable proprietary intellectual property, RPSM is mandatory because neither entity can be treated as a routine benchmark.',
          answerIndex: 0,
          explanation: 'One-sided methods require benchmarking a simple routine party. When both entities contribute valuable proprietary intellectual property, RPSM is mandatory because neither entity can be treated as a routine benchmark.'
        }
      },
      {
        title: 'Advance Pricing Agreements (APAs) & Mutual Agreement Procedures (MAP)',
        say: [
          'Cross-border transfer pricing audits present existential financial risks to multinational companies. When a tax authority in Country A audits an intercompany transaction and disallows a $50M royalty deduction, the company faces immediate double taxation unless Country B agrees to reduce its corresponding taxable income by the exact same amount.',
          'To eliminate audit exposure and achieve multi-year legal certainty, sophisticated corporations negotiate Advance Pricing Agreements (APAs) with sovereign tax administrations. While a Unilateral APA binds only one tax authority, a Bilateral APA engages two tax authorities simultaneously under the Mutual Agreement Procedure (MAP) governed by Article 25 of the OECD Model Tax Convention.',
          'Under a Bilateral APA, the competent authorities of both nations negotiate a binding transfer pricing methodology for 3 to 5 future tax years, often rolling back terms to settle open audit cycles. When an audit dispute arises, MAP negotiations secure correlative downward adjustments under Article 9(2), shielding the corporate group from double taxation and multimillion-dollar nondeductible interest penalties.'
        ],
        example: 'The IRS audits a US tech firm and proposes a $20M adjustment disallowing UK royalty deductions, creating a potential double tax exposure across US (25%) and UK (15%) tax rates. Through Bilateral MAP proceedings, the competent authorities agree on a 50% compromise ($10M adjustment). The US collects $2.5M in incremental tax, but the UK grants an immediate $1.5M correlative tax refund under treaty Article 9(2), eliminating double taxation.',
        code: `def model_bilateral_apa_and_map_double_tax_relief(
    intercompany_royalty_paid: float,
    proposed_audit_adjustment: float,
    source_country_tax_rate: float,
    recipient_country_tax_rate: float,
    competent_authority_settlement_pct: float
) -> dict:
    disallowed_expense = proposed_audit_adjustment
    initial_double_tax_exposure = disallowed_expense * (source_country_tax_rate + recipient_country_tax_rate)
    
    agreed_adjustment = proposed_audit_adjustment * competent_authority_settlement_pct
    source_additional_tax = agreed_adjustment * source_country_tax_rate
    recipient_tax_refund_or_credit = agreed_adjustment * recipient_country_tax_rate
    
    net_tax_delta = source_additional_tax - recipient_tax_refund_or_credit
    double_taxation_relieved = initial_double_tax_exposure - (disallowed_expense - agreed_adjustment) * recipient_country_tax_rate
    
    return {
        "original_intercompany_payment_usd": round(intercompany_royalty_paid, 2),
        "proposed_audit_adjustment_usd": round(proposed_audit_adjustment, 2),
        "agreed_map_settlement_adjustment_usd": round(agreed_adjustment, 2),
        "source_additional_tax_paid_usd": round(source_additional_tax, 2),
        "recipient_correlative_relief_usd": round(recipient_tax_refund_or_credit, 2),
        "net_unrelieved_tax_cost_usd": round(net_tax_delta, 2),
        "apa_status": "BILATERAL_MAP_TREATY_RELIEF_SECURED",
        "double_taxation_prevented": True
    }

p3 = model_bilateral_apa_and_map_double_tax_relief(
    intercompany_royalty_paid=50000000.0,
    proposed_audit_adjustment=20000000.0,
    source_country_tax_rate=0.25,
    recipient_country_tax_rate=0.15,
    competent_authority_settlement_pct=0.50
)
adj_s = "$" + f"{p3['agreed_map_settlement_adjustment_usd']:,.2f}"
rel_s = "$" + f"{p3['recipient_correlative_relief_usd']:,.2f}"
print(f"Bilateral MAP Adjustment: {adj_s} | Treaty Relief: {rel_s}")
print(f"Status: {p3['apa_status']} | Double Tax Prevented: {p3['double_taxation_prevented']}")`,
        output: `Bilateral MAP Adjustment: $10,000,000.00 | Treaty Relief: $1,500,000.00\nStatus: BILATERAL_MAP_TREATY_RELIEF_SECURED | Double Tax Prevented: True`,
        codeNotes: [
          { line: 8, note: 'Quantifies raw economic double taxation exposure across source and recipient jurisdictions' },
          { line: 12, note: 'Models competent authority MAP compromise splitting audit exposure at 50% settlement rate' },
          { line: 16, note: 'Enforces Article 9(2) correlative downward adjustment securing $1.5M foreign tax credit refund' },
          { line: 24, note: 'Confirms Bilateral APA status eliminating multi-year audit uncertainty and penalties' }
        ],
        tryIt: 'Increase proposed audit adjustment to $40M to observe how treaty relief scales linearly to protect against double taxation.',
        check: {
          question: 'What is the primary advantage of negotiating a Bilateral Advance Pricing Agreement (APA) rather than a Unilateral APA with only a single tax authority?',
          options: [
            'A Bilateral APA binds the competent authorities of both treaty nations, preventing double taxation through agreed correlative adjustments.',
            'A Bilateral APA eliminates all requirements to file corporate tax returns in either country.',
            'A Bilateral APA allows the corporation to set intercompany interest rates at negative yields.',
            'A Bilateral APA shields company executives from ever testifying before antitrust regulators.'
          ],
          answer: 0,
          why: 'Unilateral APAs bind only one country, leaving the taxpayer exposed to audits and double taxation from the other treaty partner. Bilateral APAs bind both nations simultaneously under OECD Article 25.',
          answerIndex: 0,
          explanation: 'Unilateral APAs bind only one country, leaving the taxpayer exposed to audits and double taxation from the other treaty partner. Bilateral APAs bind both nations simultaneously under OECD Article 25.'
        }
      },
      {
        title: 'Thin Capitalization Rules & Interest Deductibility Caps (IRC Section 163(j))',
        say: [
          'Historically, multinational groups extracted profits from high-tax subsidiaries through aggressive internal leverage, loading operating companies with debt so that tax-deductible interest payments stripped taxable income offshore into low-tax treasury entities. In corporate tax strategy, this practice is known as earnings stripping or thin capitalization.',
          'To eradicate this erosion channel, the OECD enacted BEPS Action 4, and the United States drastically broadened IRC Section 163(j) under the Tax Cuts and Jobs Act. Under modern 163(j) rules, the net business interest expense deduction is capped at 30% of Adjusted Taxable Income (ATI), benchmarked to EBITDA (or EBIT in later statutory phases).',
          'Any business interest expense exceeding this statutory 30% ceiling is disallowed in the current fiscal year and must be carried forward indefinitely. For leveraged buyouts and capital-intensive multinational enterprises, failing to model Section 163(j) limitations results in unexpected cash tax payments, destroying projected deal IRRs and debt service coverage ratios.'
        ],
        example: 'A corporation generates $100M EBITDA (Adjusted Taxable Income) and $5M business interest income, incurring $45M in total debt interest expense. The Section 163(j) statutory ceiling is $5M + (30% of $100M) = $35M. The company can only deduct $35M, disallowing $10M of interest expense. At a 25% corporate tax rate, this disallowance creates an immediate $2.5M cash tax drag today, with the $10M carried forward to future years.',
        code: `def calculate_section_163j_interest_limitation(
    ebitda: float,
    business_interest_income: float,
    floor_plan_interest: float,
    total_business_interest_expense: float,
    statutory_cap_rate: float = 0.30,
    corporate_tax_rate: float = 0.25
) -> dict:
    adjusted_taxable_income = max(0.0, ebitda)
    allowable_cap = business_interest_income + (statutory_cap_rate * adjusted_taxable_income) + floor_plan_interest
    
    if total_business_interest_expense <= allowable_cap:
        deductible_interest = total_business_interest_expense
        disallowed_interest = 0.0
        limitation_triggered = False
    else:
        deductible_interest = allowable_cap
        disallowed_interest = total_business_interest_expense - allowable_cap
        limitation_triggered = True
        
    cash_tax_increase = disallowed_interest * corporate_tax_rate
    
    return {
        "adjusted_taxable_income_ati_usd": round(adjusted_taxable_income, 2),
        "statutory_163j_cap_usd": round(allowable_cap, 2),
        "total_interest_expense_usd": round(total_business_interest_expense, 2),
        "deductible_interest_usd": round(deductible_interest, 2),
        "disallowed_interest_carryforward_usd": round(disallowed_interest, 2),
        "current_cash_tax_drag_usd": round(cash_tax_increase, 2),
        "limitation_triggered": limitation_triggered
    }

p4 = calculate_section_163j_interest_limitation(
    ebitda=100000000.0,
    business_interest_income=5000000.0,
    floor_plan_interest=0.0,
    total_business_interest_expense=45000000.0,
    statutory_cap_rate=0.30,
    corporate_tax_rate=0.25
)
cap_s = "$" + f"{p4['statutory_163j_cap_usd']:,.2f}"
dis_s = "$" + f"{p4['disallowed_interest_carryforward_usd']:,.2f}"
drag_s = "$" + f"{p4['current_cash_tax_drag_usd']:,.2f}"
print(f"163(j) Cap: {cap_s} | Disallowed Carryforward: {dis_s}")
print(f"Cash Tax Drag: {drag_s} | Limitation Triggered: {p4['limitation_triggered']}")`,
        output: `163(j) Cap: $35,000,000.00 | Disallowed Carryforward: $10,000,000.00\nCash Tax Drag: $2,500,000.00 | Limitation Triggered: True`,
        codeNotes: [
          { line: 9, note: 'Calculates statutory limitation base incorporating 30% ATI cap plus interest income' },
          { line: 15, note: 'Disallows $10M excess interest expense above the $35M statutory deduction boundary' },
          { line: 20, note: 'Quantifies $2.5M immediate cash tax drag resulting from lost interest tax shield deductions' },
          { line: 26, note: 'Tracks indefinite carryforward reserve available for utilization in future higher-EBITDA fiscal years' }
        ],
        tryIt: 'Increase business_interest_income to $15M to observe how higher interest earnings expand the allowable interest deduction cap.',
        check: {
          question: 'Under US IRC Section 163(j) and OECD BEPS Action 4 thin capitalization rules, what happens to business interest expense that exceeds the 30% Adjusted Taxable Income cap?',
          options: [
            'It is disallowed as a current deduction and carried forward indefinitely to offset future taxable income subject to annual caps.',
            'It is permanently forfeited and immediately converted into a criminal tax evasion penalty.',
            'The borrowing company must immediately issue common stock to repay the lender within 30 days.',
            'The excess interest is reclassified as a charitable donation deductible on Form 990.'
          ],
          answer: 0,
          why: 'Section 163(j) disallows current deductions for interest exceeding the 30% ATI threshold, but preserves the tax attribute by permitting an indefinite carryforward into subsequent tax years.',
          answerIndex: 0,
          explanation: 'Section 163(j) disallows current deductions for interest exceeding the 30% ATI threshold, but preserves the tax attribute by permitting an indefinite carryforward into subsequent tax years.'
        }
      },
      {
        title: 'OECD BEPS Action 13 Country-by-Country Reporting (CbCR) & Audit Risk Engine',
        say: [
          'Under OECD BEPS Action 13, all multinational enterprise (MNE) groups with consolidated global revenue of €750 million or more ($850 million) must file an annual Country-by-Country Report (CbCR). This statutory filing requires disclosing financial metrics across every tax jurisdiction where the group operates, including Profit Before Tax (PBT), Cash Taxes Paid, Headcount, and Tangible Assets.',
          'Revenue authorities worldwide (including the IRS, HMRC, and the Australian Taxation Office) automatically ingest CbCR data into algorithmic risk assessment engines. These neural and rules-based systems analyze global footprints to identify statistical anomalies that indicate artificial profit shifting or base erosion.',
          'A classic red flag occurs when an entity accounts for 40% of the multinational group\'s global profits but reports only 5 employees, negligible tangible assets, and an effective tax rate under 5%. Tax authorities flag these substance mismatches instantly, issuing automated audit inquiries and transfer pricing summonses that trigger aggressive statutory adjustments.'
        ],
        example: 'A global tech conglomerate generates $180M consolidated PBT across the US ($80M PBT, 21% ETR, 1,200 staff), Germany ($30M PBT, 28% ETR, 650 staff), and the Cayman Islands ($70M PBT, 0% ETR, 5 staff). The CbCR automated audit engine flags Cayman Islands with 3 severe anomalies (sub-15% Pillar Two ETR, extreme profit per employee of $14M, and severe substance mismatch), mandating an automated high-risk tax audit inquiry.',
        code: `def audit_cbcr_jurisdictional_risk_profile(jurisdictions: list) -> dict:
    total_global_pbt = sum(j["profit_before_tax"] for j in jurisdictions)
    total_global_headcount = sum(j["headcount"] for j in jurisdictions)
    total_global_assets = sum(j["tangible_assets"] for j in jurisdictions)
    
    audited_entities = []
    high_risk_flags = 0
    
    for j in jurisdictions:
        pbt = j["profit_before_tax"]
        taxes_paid = j["cash_tax_paid"]
        hc = j["headcount"]
        assets = j["tangible_assets"]
        
        etr = (taxes_paid / pbt) if pbt > 0 else 0.0
        profit_share = (pbt / total_global_pbt) if total_global_pbt > 0 else 0.0
        hc_share = (hc / total_global_headcount) if total_global_headcount > 0 else 0.0
        assets_share = (assets / total_global_assets) if total_global_assets > 0 else 0.0
        
        flags = []
        if etr < 0.15:
            flags.append("SUB_15_PCT_ETR_PILLAR_TWO_RISK")
        if profit_share > 0.20 and (hc_share < 0.03 or assets_share < 0.03):
            flags.append("SUBSTANCE_MISMATCH_CASH_BOX_SHELL")
        if pbt > 0 and hc > 0 and (pbt / hc) > 1000000.0:
            flags.append("SUPER_PROFIT_PER_EMPLOYEE_ANOMALY")
            
        risk_level = "HIGH" if len(flags) >= 2 else ("MEDIUM" if len(flags) == 1 else "LOW")
        if risk_level == "HIGH":
            high_risk_flags += 1
            
        audited_entities.append({
            "country": j["country"],
            "pbt_usd": round(pbt, 2),
            "effective_tax_rate_pct": round(etr * 100.0, 2),
            "profit_share_pct": round(profit_share * 100.0, 2),
            "substance_headcount_share_pct": round(hc_share * 100.0, 2),
            "risk_tier": risk_level,
            "audit_flags": flags
        })
        
    return {
        "global_pbt_usd": round(total_global_pbt, 2),
        "jurisdictions_evaluated": len(jurisdictions),
        "high_risk_jurisdictions_count": high_risk_flags,
        "global_risk_verdict": "AUTOMATED_TAX_AUDIT_INQUIRY_MANDATED" if high_risk_flags > 0 else "OECD_CBCR_COMPLIANT_CLEAN",
        "jurisdiction_audit_table": audited_entities
    }

p5 = audit_cbcr_jurisdictional_risk_profile([
    {"country": "United States", "profit_before_tax": 80000000.0, "cash_tax_paid": 16800000.0, "headcount": 1200, "tangible_assets": 150000000.0},
    {"country": "Cayman Islands", "profit_before_tax": 70000000.0, "cash_tax_paid": 0.0, "headcount": 5, "tangible_assets": 2000000.0},
    {"country": "Germany", "profit_before_tax": 30000000.0, "cash_tax_paid": 8400000.0, "headcount": 650, "tangible_assets": 80000000.0}
])
pbt_s = "$" + f"{p5['global_pbt_usd']:,.2f}"
print(f"Global PBT: {pbt_s} | High Risk Jurisdictions: {p5['high_risk_jurisdictions_count']}")
print(f"Verdict: {p5['global_risk_verdict']}")
for tab in p5['jurisdiction_audit_table']:
    print(f"  {tab['country']}: ETR {tab['effective_tax_rate_pct']}% | Risk: {tab['risk_tier']} | Flags: {len(tab['audit_flags'])}")`,
        output: `Global PBT: $180,000,000.00 | High Risk Jurisdictions: 1\nVerdict: AUTOMATED_TAX_AUDIT_INQUIRY_MANDATED\n  United States: ETR 21.0% | Risk: LOW | Flags: 0\n  Cayman Islands: ETR 0.0% | Risk: HIGH | Flags: 3\n  Germany: ETR 28.0% | Risk: LOW | Flags: 0`,
        codeNotes: [
          { line: 11, note: 'Computes jurisdictional effective tax rate (ETR) and compares against Pillar Two 15% threshold' },
          { line: 20, note: 'Detects substance mismatches where disproportionate profits are booked with negligible headcount' },
          { line: 25, note: 'Assigns HIGH risk tier to shell cash box entities triggering automated tax audit inquiries' },
          { line: 36, note: 'Aggregates group-wide BEPS Action 13 compliance metrics across all reporting jurisdictions' }
        ],
        tryIt: 'Increase Cayman Islands headcount to 500 and tax paid to $11M to observe how economic substance eliminates audit red flags.',
        check: {
          question: 'What is the primary indicator that causes automated tax authority CbCR screening algorithms to classify a foreign subsidiary as high-risk for profit shifting?',
          options: [
            'A low effective tax rate (<15%) paired with a high share of global profits but negligible headcount and tangible asset substance.',
            'The subsidiary files its corporate reports using open-source spreadsheet software.',
            'The subsidiary employs more than 1,000 local manufacturing workers.',
            'The subsidiary pays higher dividends than its parent company.'
          ],
          answer: 0,
          why: 'Tax authorities flag substance mismatches where significant residual profits are reported in low-tax jurisdictions without corresponding physical headcount or operational capital assets.',
          answerIndex: 0,
          explanation: 'Tax authorities flag substance mismatches where significant residual profits are reported in low-tax jurisdictions without corresponding physical headcount or operational capital assets.'
        }
      }
    ],
    summary: [
      'OECD BEPS Action 8-10 DEMPE guidelines allocate intangible super-profits strictly to entities managing development, enhancement, maintenance, protection, and exploitation.',
      'The Residual Profit Split Method (RPSM) allocates baseline routine returns to asset holders before splitting non-routine residual profits by economic intangible contributions.',
      'Bilateral APAs and Mutual Agreement Procedures (MAP) under OECD Article 25 secure binding cross-border certainty, preventing double taxation through correlative adjustments.',
      'IRC Section 163(j) caps net business interest deductions at 30% of Adjusted Taxable Income, disallowing excess interest and carrying it forward indefinitely.',
      'OECD BEPS Action 13 Country-by-Country Reporting (CbCR) feeds tax authority risk engines to detect substance mismatches and low-ETR offshore cash box structures.'
    ],
    projectStep: {
      title: 'Global Transfer Pricing & Cross-Border Audit Defense Engine',
      steps: [
        'Model DEMPE operational substance scoring and reallocate residual IP profits away from passive funding cash boxes.',
        'Implement two-step Residual Profit Split Method (RPSM) routines for deeply integrated manufacturing and technology hubs.',
        'Simulate Bilateral APA and MAP competent authority settlement negotiations with Article 9(2) correlative relief.',
        'Calculate IRC Section 163(j) thin capitalization caps and execute automated CbCR jurisdictional risk assessment audits.'
      ]
    }
  }
,
  {
    coursePrefix: 'bcom_tax',
    day: 4,
    title: 'Cross-Border Indirect Tax, Global VAT/GST Destination Principles & Customs Valuation',
    goal: 'Master cross-border indirect tax and global trade compliance: the OECD Destination Principle and B2B Reverse Charge Mechanism (RCM), WTO Customs Valuation harmonization with transfer pricing, Incoterms 2020 Permanent Establishment (PE) and US Wayfair economic sales tax nexus, Unilateral Digital Services Taxes (DST) vs OECD Pillar One Amount A, and multinational supply chain indirect tax optimization.',
    minutes: 45,
    recap: 'In Day 3, we mastered OECD BEPS DEMPE intangibles profit attribution, bilateral APAs, thin capitalization interest limits, and CbCR forensic risk profiling. Today, we conquer global indirect taxes: VAT/GST destination rules, customs import tariffs, Incoterm nexus exposures, and digital advertising levies.',
    parts: [
      {
        title: 'Global VAT/GST Destination Principle & Reverse Charge Mechanism (RCM)',
        say: [
          'In cross-border trade, value-added taxes (VAT) and goods and services taxes (GST) represent over 30% of government revenue worldwide. The core foundation governing international trade in services and digital goods is the OECD Destination Principle, codified throughout the European Union under Directive 2006/112/EC and adopted across over 160 nations.',
          'Under the Destination Principle, cross-border commercial transactions are taxed in the jurisdiction where consumption occurs, rather than where the service provider is physically domiciled. For international business-to-consumer (B2C) sales, foreign sellers must register locally or utilize simplified regimes like the EU One-Stop Shop (OSS) to collect destination VAT at the customer\'s local rate.',
          'However, for business-to-business (B2B) cross-border services, forcing thousands of foreign suppliers to register in every customer country would create catastrophic economic friction. Instead, international tax law utilizes the Reverse Charge Mechanism (RCM): the foreign supplier invoices €0 VAT with a mandatory statutory directive citation, and the domestic business purchaser self-assesses both output VAT and a simultaneous input tax deduction on its local return, preserving corporate liquidity without tax leakage.'
        ],
        example: 'An Irish cloud infrastructure subsidiary invoices a French enterprise €500,000 for server hosting. Under the EU B2B Reverse Charge Mechanism, Ireland zero-rates the export invoice. The French corporate client self-assesses 20% French VAT (€100,000) on its local declaration while simultaneously claiming an identical €100,000 input tax credit, achieving zero net cash tax drag and eliminating cross-border tax registration friction.',
        code: `def evaluate_cross_border_vat_and_reverse_charge(
    transaction_type: str,
    supplier_country: str,
    customer_country: str,
    invoice_amount_eur: float,
    customer_vat_registered: bool,
    destination_standard_vat_rate: float = 0.20
) -> dict:
    is_cross_border = supplier_country != customer_country
    
    if not is_cross_border:
        vat_rate_applied = destination_standard_vat_rate
        vat_amount_invoiced = invoice_amount_eur * vat_rate_applied
        mechanism = "DOMESTIC_VAT_COLLECTION"
        invoice_annotation = f"Standard domestic VAT {destination_standard_vat_rate*100:.0f}% charged"
        customer_self_assesses_rcm = False
        net_cash_vat_liability = vat_amount_invoiced
    elif transaction_type == "B2B_SERVICE" and customer_vat_registered:
        vat_rate_applied = 0.0
        vat_amount_invoiced = 0.0
        mechanism = "REVERSE_CHARGE_MECHANISM_RCM"
        invoice_annotation = "Reverse Charge: Customer self-assesses VAT under Art. 196 EU VAT Directive"
        customer_self_assesses_rcm = True
        net_cash_vat_liability = 0.0
    else:
        vat_rate_applied = destination_standard_vat_rate
        vat_amount_invoiced = invoice_amount_eur * vat_rate_applied
        mechanism = "ONE_STOP_SHOP_DESTINATION_VAT"
        invoice_annotation = f"Destination VAT {destination_standard_vat_rate*100:.0f}% collected via OSS"
        customer_self_assesses_rcm = False
        net_cash_vat_liability = vat_amount_invoiced
        
    return {
        "invoice_subtotal_eur": round(invoice_amount_eur, 2),
        "vat_rate_applied_pct": round(vat_rate_applied * 100.0, 2),
        "vat_invoiced_eur": round(vat_amount_invoiced, 2),
        "total_invoice_due_eur": round(invoice_amount_eur + vat_amount_invoiced, 2),
        "tax_mechanism": mechanism,
        "invoice_legal_annotation": invoice_annotation,
        "customer_rcm_self_assessment": customer_self_assesses_rcm,
        "net_cash_tax_drag_eur": round(net_cash_vat_liability, 2)
    }

p1 = evaluate_cross_border_vat_and_reverse_charge(
    transaction_type="B2B_SERVICE",
    supplier_country="IE",
    customer_country="FR",
    invoice_amount_eur=500000.0,
    customer_vat_registered=True,
    destination_standard_vat_rate=0.20
)
inv_vat_s = f"EUR {p1['vat_invoiced_eur']:,.2f}"
drag_s = f"EUR {p1['net_cash_tax_drag_eur']:,.2f}"
print(f"Mechanism: {p1['tax_mechanism']} | Invoiced VAT: {inv_vat_s}")
print(f"RCM Self Assessment: {p1['customer_rcm_self_assessment']} | Net Drag: {drag_s}")`,
        output: `Mechanism: REVERSE_CHARGE_MECHANISM_RCM | Invoiced VAT: EUR 0.00\nRCM Self Assessment: True | Net Drag: EUR 0.00`,
        codeNotes: [
          { line: 12, note: 'Validates cross-border B2B eligibility based on verified customer VAT registration status' },
          { line: 20, note: 'Zeros out invoiced VAT and inserts mandatory statutory Article 196 reverse charge legal notice' },
          { line: 22, note: 'Shifts VAT accounting to the buyer, enabling simultaneous output declaration and input credit recovery' },
          { line: 36, note: 'Confirms zero net cash tax drag, preserving working capital liquidity across the corporate group' }
        ],
        tryIt: 'Change transaction_type to B2C_SERVICE to observe how One-Stop Shop (OSS) destination VAT forces €100,000 collection.',
        check: {
          question: 'In cross-border business-to-business (B2B) services within the European Union, what is the primary operational effect of the Reverse Charge Mechanism (RCM)?',
          options: [
            'The seller issues an invoice with zero VAT, and the buyer self-assesses both output VAT and an offsetting input VAT deduction on their domestic tax return.',
            'The seller must establish a full legal corporate branch and register for local payroll in the customer\'s jurisdiction.',
            'The customer is completely exempted from paying any corporate income taxes on gross revenues.',
            'The tax liability is permanently forgiven under the European Central Bank liquidity rebate program.'
          ],
          answer: 0,
          why: 'Under RCM, the place of supply is the customer jurisdiction, but the administrative burden of calculating and remitting VAT shifts to the customer, who self-assesses output VAT and claims an offsetting input deduction.',
          answerIndex: 0,
          explanation: 'Under RCM, the place of supply is the customer jurisdiction, but the administrative burden of calculating and remitting VAT shifts to the customer, who self-assesses output VAT and claims an offsetting input deduction.'
        }
      },
      {
        title: 'Customs Valuation (WTO Valuation Agreement) & Transfer Pricing Harmonization',
        say: [
          'When physical inventory crosses international borders between related corporate entities, a deep structural tension emerges between customs revenue authorities and corporate income tax auditors. Customs agencies (such as US Customs and Border Protection or the World Customs Organization) seek the highest possible transaction value to maximize import tariff collections.',
          'Conversely, corporate income tax authorities (such as the IRS or HMRC) demand the lowest defensible intercompany import price to prevent inflated cost of goods sold (COGS) from stripping domestic taxable income. Reconciling this conflict requires rigorous alignment with the WTO Customs Valuation Agreement and WCO Transfer Pricing guidelines.',
          'Under WTO Article 1 Transaction Value, the customs base begins with the CIF price (Cost, Insurance, and Freight). However, customs law mandates statutory additions for dutiable "assists" (tools, dies, engineering designs provided free by the buyer) and license royalties paid as a condition of sale. Corporate tax directors must harmonize transfer pricing studies with customs valuation declarations to prevent costly tariff audits and transfer pricing penalties.'
        ],
        example: 'A US entity imports specialized precision components from an offshore subsidiary at $4.0M FOB plus $200k freight/insurance. The US buyer supplied $300k in manufacturing tooling assists and paid $500k in software license royalties as a condition of sale. Under WTO rules, customs dutiable value is $5.0M. At a 7.5% tariff rate, the company pays $375,000 in import duties, which generates a $93,750 corporate income tax shield at a 25% tax rate.',
        code: `def harmonize_customs_valuation_and_transfer_pricing(
    fob_invoice_price_usd: float,
    freight_and_insurance_usd: float,
    dutiable_production_assists_usd: float,
    license_royalties_condition_of_sale_usd: float,
    ad_valorem_tariff_rate: float = 0.075,
    corporate_income_tax_rate: float = 0.25
) -> dict:
    cif_base = fob_invoice_price_usd + freight_and_insurance_usd
    customs_dutiable_value = cif_base + dutiable_production_assists_usd + license_royalties_condition_of_sale_usd
    
    customs_tariff_duty = customs_dutiable_value * ad_valorem_tariff_rate
    tax_shield_from_duty = customs_tariff_duty * corporate_income_tax_rate
    net_economic_duty_cost = customs_tariff_duty - tax_shield_from_duty
    
    return {
        "cif_invoice_base_usd": round(cif_base, 2),
        "customs_dutiable_value_usd": round(customs_dutiable_value, 2),
        "customs_tariff_rate_pct": round(ad_valorem_tariff_rate * 100.0, 2),
        "customs_duty_payable_usd": round(customs_tariff_duty, 2),
        "income_tax_shield_usd": round(tax_shield_from_duty, 2),
        "net_effective_customs_cost_usd": round(net_economic_duty_cost, 2),
        "valuation_verdict": "WTO_TRANSACTION_VALUE_COMPLIANT"
    }

p2 = harmonize_customs_valuation_and_transfer_pricing(
    fob_invoice_price_usd=4000000.0,
    freight_and_insurance_usd=200000.0,
    dutiable_production_assists_usd=300000.0,
    license_royalties_condition_of_sale_usd=500000.0,
    ad_valorem_tariff_rate=0.075,
    corporate_income_tax_rate=0.25
)
dut_s = "$" + f"{p2['customs_dutiable_value_usd']:,.2f}"
tax_s = "$" + f"{p2['customs_duty_payable_usd']:,.2f}"
net_duty_s = "$" + f"{p2['net_effective_customs_cost_usd']:,.2f}"
print(f"Dutiable Value: {dut_s} | Duty Payable: {tax_s}")
print(f"Net Duty Cost (after tax shield): {net_duty_s} -> {p2['valuation_verdict']}")`,
        output: `Dutiable Value: $5,000,000.00 | Duty Payable: $375,000.00\nNet Duty Cost (after tax shield): $281,250.00 -> WTO_TRANSACTION_VALUE_COMPLIANT`,
        codeNotes: [
          { line: 9, note: 'Constructs CIF import base by combining FOB purchase invoice with ocean freight and marine insurance' },
          { line: 11, note: 'Capitalizes dutiable assists ($300k) and condition-of-sale license royalties ($500k) into customs value' },
          { line: 14, note: 'Calculates ad valorem customs duty ($375k) under statutory WTO Article 1 Transaction Value principles' },
          { line: 16, note: 'Quantifies income tax shield ($93.75k) since capitalized customs duties reduce taxable corporate income' }
        ],
        tryIt: 'Set license royalties to $0 to observe how unbundled software licenses reduce customs dutiable value to $4.5M.',
        check: {
          question: 'Why do customs authorities and corporate income tax auditors frequently take opposing positions on the valuation of imported cross-border goods between related parties?',
          options: [
            'Customs authorities maximize revenue with higher import values, while income tax auditors maximize domestic taxable income by demanding lower import prices.',
            'Customs authorities are prohibited by international treaty from reviewing corporate balance sheets.',
            'Income tax auditors only inspect domestic payroll taxes and never audit cost of goods sold.',
            'Customs tariffs are completely refunded by the World Bank at the end of every fiscal quarter.'
          ],
          answer: 0,
          why: 'Higher import prices increase customs duty collections but decrease domestic taxable income by inflating COGS. Lower import prices increase domestic taxable income but decrease customs duty collections.',
          answerIndex: 0,
          explanation: 'Higher import prices increase customs duty collections but decrease domestic taxable income by inflating COGS. Lower import prices increase domestic taxable income but decrease customs duty collections.'
        }
      },
      {
        title: 'Incoterms 2020, Permanent Establishment (PE) Risk & US Wayfair Sales Tax Nexus',
        say: [
          'Selecting international commercial terms (Incoterms 2020) is frequently treated as an operational logistics decision, but in international tax law, it directly dictates corporate tax nexus and Permanent Establishment (PE) exposure under OECD Article 5. Choosing DDP (Delivered Duty Paid) designates the foreign selling entity as the official Importer of Record.',
          'When a foreign company sells DDP and maintains consignment inventory in local third-party logistics warehouses, it crosses statutory thresholds. Under OECD and UN Model Tax Conventions, maintaining domestic stock for delivery and handling local customs clearance can inadvertently establish a fixed place of business Permanent Establishment, subjecting global corporate profits to local corporate tax filing mandates.',
          'Simultaneously, within the United States, physical presence is no longer required to trigger sales tax obligations following the landmark Supreme Court decision in South Dakota v. Wayfair (2018). Under economic nexus statutes across all 45 sales tax states, exceeding economic thresholds—typically $100,000 in annual gross sales or 200 distinct transactions—triggers mandatory state sales tax registration, collection, and remittance.'
        ],
        example: 'A European equipment manufacturer sells $1.5M of machinery across 350 transactions into the US under DDP terms while leasing space in a New Jersey consignment warehouse. The company triggers both a US corporate Permanent Establishment audit exposure and mandatory multi-state sales tax nexus under Wayfair. Shifting contracts from DDP to DAP (Delivered at Place) places the importer-of-record burden on the US buyer, neutralizing the corporate PE hazard.',
        code: `def evaluate_incoterm_pe_risk_and_economic_nexus(
    incoterm: str,
    destination_country: str,
    annual_sales_volume_usd: float,
    annual_transactions_count: int,
    maintains_local_consignment_stock: bool
) -> dict:
    is_importer_of_record = (incoterm == "DDP")
    
    pe_triggered = False
    pe_risk_reason = "No physical presence or domestic importer status."
    
    if is_importer_of_record and maintains_local_consignment_stock:
        pe_triggered = True
        pe_risk_reason = "DDP delivery combined with local warehouse inventory establishes a fixed place of business PE under OECD Art. 5."
    elif is_importer_of_record:
        pe_risk_reason = "DDP makes seller Importer of Record; elevated audit scrutiny regarding local VAT and customs nexus."
        
    wayfair_nexus = False
    if destination_country == "US":
        if annual_sales_volume_usd >= 100000.0 or annual_transactions_count >= 200:
            wayfair_nexus = True
            
    recommended_term = "DAP" if pe_triggered else incoterm
    
    return {
        "incoterm_evaluated": incoterm,
        "importer_of_record_status": "SELLER" if is_importer_of_record else "BUYER",
        "permanent_establishment_risk": "HIGH_PE_EXPOSURE" if pe_triggered else "LOW_PE_RISK",
        "pe_audit_rationale": pe_risk_reason,
        "us_wayfair_sales_tax_nexus": wayfair_nexus,
        "contractual_mitigation_term": recommended_term
    }

p3 = evaluate_incoterm_pe_risk_and_economic_nexus(
    incoterm="DDP",
    destination_country="US",
    annual_sales_volume_usd=1500000.0,
    annual_transactions_count=350,
    maintains_local_consignment_stock=True
)
print(f"Incoterm: {p3['incoterm_evaluated']} | PE Risk: {p3['permanent_establishment_risk']}")
print(f"Wayfair Nexus: {p3['us_wayfair_sales_tax_nexus']} | Recommended Mitigation: {p3['contractual_mitigation_term']}")`,
        output: `Incoterm: DDP | PE Risk: HIGH_PE_EXPOSURE\nWayfair Nexus: True | Recommended Mitigation: DAP`,
        codeNotes: [
          { line: 8, note: 'Identifies DDP terms as assigning the foreign seller the high-risk legal role of Importer of Record' },
          { line: 14, note: 'Detects dangerous combination of DDP delivery and local consignment warehousing triggering OECD Article 5 PE' },
          { line: 20, note: 'Applies post-Wayfair economic nexus thresholds ($100k revenue or 200 transactions) for US sales tax mandates' },
          { line: 27, note: 'Recommends contractual restructuring to DAP (Delivered at Place) shifting importer obligations to the buyer' }
        ],
        tryIt: 'Set maintains_local_consignment_stock to False to see PE risk diminish while Wayfair economic nexus remains active.',
        check: {
          question: 'Following the landmark US Supreme Court decision in South Dakota v. Wayfair (2018), what triggers an out-of-state corporation\'s legal obligation to collect state sales tax?',
          options: [
            'Exceeding statutory economic activity thresholds (such as $100,000 in sales or 200 transactions), even with zero physical offices or employees in the state.',
            'Maintaining a physical corporate headquarters within the state boundaries.',
            'Registering a motor vehicle with the state Department of Transportation.',
            'Publishing marketing advertisements in local newspapers.'
          ],
          answer: 0,
          why: 'Wayfair overturned the physical presence rule, establishing that substantial economic nexus—meeting sales volume or transaction count thresholds—mandates sales tax collection.',
          answerIndex: 0,
          explanation: 'Wayfair overturned the physical presence rule, establishing that substantial economic nexus—meeting sales volume or transaction count thresholds—mandates sales tax collection.'
        }
      },
      {
        title: 'Digital Services Taxes (DST) vs OECD Pillar One Amount A Allocation',
        say: [
          'The explosive growth of the digital economy exposed historic tax treaties that required physical presence before a nation could tax business profits. In response, dozens of market jurisdictions enacted unilateral Digital Services Taxes (DSTs)—such as France\'s 3% tax, the UK\'s 2% DST, and India\'s 2% Equalisation Levy—targeting gross revenues derived from online advertising, marketplace intermediation, and user data monetization.',
          'Unilateral DSTs inflict severe economic friction on global tech companies because they tax gross revenue rather than net income. Crucially, gross revenue DSTs are not eligible for Foreign Tax Credits (FTCs) under bilateral income tax treaties, resulting in unmitigated double taxation and sparking retaliatory trade tariffs under Section 301 of the US Trade Act.',
          'To replace chaotic unilateral DSTs, the OECD Inclusive Framework designed BEPS 2.0 Pillar One (Amount A). For the largest global multinational enterprises (revenues >€20 billion and profit margins >10%), Amount A reallocates 25% of residual profits above a 10% routine margin directly to market jurisdictions based on local user and revenue share, accompanied by statutory double taxation relief mechanisms.'
        ],
        example: 'A global digital conglomerate generates $25.0B in global revenue and $5.0B in profit before tax (20% margin). In a market jurisdiction where it generates $100M of local digital revenue, a unilateral 3% DST extracts $3.0M in uncreditable gross cash taxes. Under OECD Pillar One Amount A, 25% of the group\'s $2.5B residual super-profit ($625M pool) is reallocated across market countries, generating a $6.25M tax liability fully shielded by home country double tax credits.',
        code: `def model_unilateral_dst_vs_pillar_one_amount_a(
    global_revenue_usd: float,
    global_pbt_usd: float,
    market_country_digital_revenue_usd: float,
    market_user_allocation_pct: float,
    unilateral_dst_rate: float = 0.03,
    corporate_tax_rate: float = 0.25
) -> dict:
    dst_tax_payable = market_country_digital_revenue_usd * unilateral_dst_rate
    dst_effective_cash_cost = dst_tax_payable
    
    profit_margin = global_pbt_usd / global_revenue_usd if global_revenue_usd > 0 else 0.0
    pillar_one_in_scope = (global_revenue_usd >= 20000000000.0) and (profit_margin > 0.10)
    
    if profit_margin > 0.10:
        routine_profit_10pct = global_revenue_usd * 0.10
        residual_super_profit = max(0.0, global_pbt_usd - routine_profit_10pct)
        amount_a_pool = residual_super_profit * 0.25
        market_reallocated_profit = amount_a_pool * market_user_allocation_pct
        pillar_one_tax = market_reallocated_profit * corporate_tax_rate
    else:
        residual_super_profit = 0.0
        market_reallocated_profit = 0.0
        pillar_one_tax = 0.0
        
    return {
        "market_country_digital_revenue_usd": round(market_country_digital_revenue_usd, 2),
        "unilateral_dst_gross_tax_usd": round(dst_tax_payable, 2),
        "pillar_one_in_scope": pillar_one_in_scope,
        "global_profit_margin_pct": round(profit_margin * 100.0, 2),
        "reallocated_amount_a_profit_usd": round(market_reallocated_profit, 2),
        "pillar_one_tax_payable_usd": round(pillar_one_tax, 2),
        "dst_double_tax_friction_usd": round(dst_effective_cash_cost, 2),
        "policy_status": "PILLAR_ONE_ELIMINATES_DST_TRADE_RETALIATION" if pillar_one_in_scope else "SUBJECT_TO_UNILATERAL_DST"
    }

p4 = model_unilateral_dst_vs_pillar_one_amount_a(
    global_revenue_usd=25000000000.0,
    global_pbt_usd=5000000000.0,
    market_country_digital_revenue_usd=100000000.0,
    market_user_allocation_pct=0.04,
    unilateral_dst_rate=0.03,
    corporate_tax_rate=0.25
)
dst_s = "$" + f"{p4['unilateral_dst_gross_tax_usd']:,.2f}"
p1_s = "$" + f"{p4['pillar_one_tax_payable_usd']:,.2f}"
print(f"Digital Revenue: $100,000,000.00 | Unilateral DST: {dst_s}")
print(f"Pillar One Amount A Tax: {p1_s} | Status: {p4['policy_status']}")`,
        output: `Digital Revenue: $100,000,000.00 | Unilateral DST: $3,000,000.00\nPillar One Amount A Tax: $6,250,000.00 | Status: PILLAR_ONE_ELIMINATES_DST_TRADE_RETALIATION`,
        codeNotes: [
          { line: 8, note: 'Calculates uncreditable 3% unilateral DST on local digital gross revenues creating pure cash tax drag' },
          { line: 12, note: 'Validates Pillar One thresholds: global revenues exceeding €20B and profit margins exceeding 10%' },
          { line: 16, note: 'Isolates residual super-profit pool above 10% routine margin and carves out 25% Amount A allocable pool' },
          { line: 20, note: 'Apportions Amount A profits to market jurisdictions with full double taxation treaty credit relief' }
        ],
        tryIt: 'Reduce global revenue to $10B to observe how falling below Pillar One thresholds leaves the firm subject to unilateral DSTs.',
        check: {
          question: 'Why do multinational tech corporations strongly favor OECD Pillar One Amount A multilateral rules over national unilateral Digital Services Taxes (DSTs)?',
          options: [
            'Because unilateral DSTs tax gross revenues and cannot be credited against corporate income tax treaties, creating unmitigated double taxation and trade war retaliation.',
            'Because unilateral DSTs require digital companies to shut down their cloud servers for 60 days every year.',
            'Because Pillar One eliminates all requirements to file corporate tax returns anywhere in the world.',
            'Because Pillar One provides direct cash grants to technology company shareholders.'
          ],
          answer: 0,
          why: 'DSTs tax gross turnover without regard to profitability and are non-creditable foreign taxes under bilateral tax treaties, producing catastrophic double taxation.',
          answerIndex: 0,
          explanation: 'DSTs tax gross turnover without regard to profitability and are non-creditable foreign taxes under bilateral tax treaties, producing catastrophic double taxation.'
        }
      },
      {
        title: 'Milestone 1 Synthesis: Global Supply Chain Indirect Tax & Customs Optimizer',
        say: [
          'Mastering international corporate taxation requires synthesizing cross-border VAT/GST, customs tariff classification, Incoterms liability, and digital taxation into a single enterprise optimization architecture. A modern supply chain cannot operate with fragmented tax silos; an oversight in customs valuation can trigger a catastrophic transfer pricing audit.',
          'In this capstone synthesis, the corporate tax director designs a resilient cross-border operational blueprint. We implement the EU Reverse Charge Mechanism for services to preserve €100,000 of working capital liquidity, harmonize WTO Article 1 Transaction Value by capitalizing production assists and condition-of-sale software royalties into customs valuation, and eliminate Permanent Establishment risk by restructuring contracts from DDP to DAP.',
          'Simultaneously, we evaluate global digital platform exposures under OECD Pillar One Amount A, replacing fragmented unilateral DSTs with treaty-creditable profit reallocations. This end-to-end orchestration delivers frictionless supply chain logistics, minimizes effective trade tariff drag, and secures Certified International Indirect Tax & Customs Specialist accreditation.'
        ],
        example: 'Novartis Digital Devices Global orchestrates a multi-jurisdictional network: €500,000 cross-border cloud architecture under RCM saving €100,000 in immediate cash tax drag, $4.0M hardware imports harmonized to $5.0M dutiable customs value ($375,000 duty paid, reduced by a $93,750 income tax shield), DDP contract restructured to DAP to eliminate US Permanent Establishment exposure, and digital operations aligned with OECD Pillar One, securing complete supply chain tax efficiency.',
        code: `def run_global_supply_chain_indirect_tax_optimizer(
    company_name: str,
    services_deal: dict,
    hardware_deal: dict,
    digital_platform_deal: dict
) -> dict:
    vat_res = evaluate_cross_border_vat_and_reverse_charge(
        services_deal["transaction_type"],
        services_deal["supplier_country"],
        services_deal["customer_country"],
        services_deal["amount_eur"],
        services_deal["customer_vat_registered"],
        services_deal["standard_rate"]
    )
    
    customs_res = harmonize_customs_valuation_and_transfer_pricing(
        hardware_deal["fob_price"],
        hardware_deal["freight"],
        hardware_deal["assists"],
        hardware_deal["royalties"],
        hardware_deal["tariff_rate"],
        hardware_deal["income_tax_rate"]
    )
    
    pe_res = evaluate_incoterm_pe_risk_and_economic_nexus(
        hardware_deal["incoterm"],
        hardware_deal["destination_country"],
        hardware_deal["annual_volume"],
        hardware_deal["transactions_count"],
        hardware_deal["consignment_stock"]
    )
    
    dst_res = model_unilateral_dst_vs_pillar_one_amount_a(
        digital_platform_deal["global_revenue"],
        digital_platform_deal["global_pbt"],
        digital_platform_deal["market_revenue"],
        digital_platform_deal["market_share_pct"]
    )
    
    total_customs_paid = customs_res["customs_duty_payable_usd"]
    total_dst_paid = dst_res["unilateral_dst_gross_tax_usd"]
    cash_liquidity_saved_via_rcm = services_deal["amount_eur"] * services_deal["standard_rate"]
    
    optimization_success = (vat_res["customer_rcm_self_assessment"] is True) and (pe_res["contractual_mitigation_term"] == "DAP")
    
    return {
        "company_name": company_name,
        "vat_mechanism_deployed": vat_res["tax_mechanism"],
        "rcm_cash_liquidity_preserved_eur": round(cash_liquidity_saved_via_rcm, 2),
        "customs_duty_liability_usd": round(total_customs_paid, 2),
        "incoterm_risk_mitigated_to": pe_res["contractual_mitigation_term"],
        "unilateral_dst_exposure_usd": round(total_dst_paid, 2),
        "supply_chain_tax_efficiency_achieved": optimization_success,
        "accreditation": "Certified International Indirect Tax & Customs Specialist" if optimization_success else "SUPPLY_CHAIN_TAX_AUDIT_RISK"
    }

p5 = run_global_supply_chain_indirect_tax_optimizer(
    "Novartis Digital Devices Global",
    {
        "transaction_type": "B2B_SERVICE",
        "supplier_country": "IE", "customer_country": "FR",
        "amount_eur": 500000.0, "customer_vat_registered": True,
        "standard_rate": 0.20
    },
    {
        "fob_price": 4000000.0, "freight": 200000.0,
        "assists": 300000.0, "royalties": 500000.0,
        "tariff_rate": 0.075, "income_tax_rate": 0.25,
        "incoterm": "DDP", "destination_country": "US",
        "annual_volume": 1500000.0, "transactions_count": 350,
        "consignment_stock": True
    },
    {
        "global_revenue": 25000000000.0, "global_pbt": 5000000000.0,
        "market_revenue": 100000000.0, "market_share_pct": 0.04
    }
)
rcm_s = f"EUR {p5['rcm_cash_liquidity_preserved_eur']:,.2f}"
duty_s = "$" + f"{p5['customs_duty_liability_usd']:,.2f}"
print(f"Company: {p5['company_name']}")
print(f"RCM Saved: {rcm_s} | Duty Paid: {duty_s}")
print(f"Incoterm Mitigated To: {p5['incoterm_risk_mitigated_to']} | Success: {p5['supply_chain_tax_efficiency_achieved']}")
print(f"Accreditation: {p5['accreditation']}")`,
        output: `Company: Novartis Digital Devices Global\nRCM Saved: EUR 100,000.00 | Duty Paid: $375,000.00\nIncoterm Mitigated To: DAP | Success: True\nAccreditation: Certified International Indirect Tax & Customs Specialist`,
        codeNotes: [
          { line: 6, note: 'Executes B2B Reverse Charge Mechanism netting out €100k VAT to preserve cash working capital' },
          { line: 15, note: 'Capitalizes production assists and royalties into WTO customs valuation yielding $375k duty payable' },
          { line: 24, note: 'Restructures high-risk DDP terms to DAP eliminating permanent establishment exposure in destination' },
          { line: 42, note: 'Validates overall supply chain tax efficiency and awards International Indirect Tax Specialist accreditation' }
        ],
        tryIt: 'Change consignment_stock to False under DAP terms to observe complete elimination of overseas tax nexus.',
        check: {
          question: 'What holistic contractual adjustment successfully eliminates corporate Permanent Establishment (PE) exposure for an overseas seller distributing tangible goods into foreign customer markets?',
          options: [
            'Transitioning sales contracts from DDP to DAP (Delivered at Place), making the domestic buyer the official Importer of Record.',
            'Refusing to issue commercial invoices and requesting payment exclusively in digital tokens.',
            'Registering a local subsidiary but claiming it only operates during weekends.',
            'Paying double customs tariffs directly to the local port authority.'
          ],
          answer: 0,
          why: 'Selling DDP makes the foreign seller the Importer of Record. Shifting to DAP transfers customs clearance and import liability to the domestic buyer, neutralizing fixed place of business PE risks.',
          answerIndex: 0,
          explanation: 'Selling DDP makes the foreign seller the Importer of Record. Shifting to DAP transfers customs clearance and import liability to the domestic buyer, neutralizing fixed place of business PE risks.'
        }
      }
    ],
    summary: [
      'The OECD Destination Principle taxes cross-border consumption locally, utilizing the B2B Reverse Charge Mechanism (RCM) to eliminate cash tax leakage.',
      'WTO Article 1 Transaction Value customs valuation harmonizes with transfer pricing by capitalizing production assists and condition-of-sale license royalties.',
      'Incoterms 2020 DDP delivery paired with local consignment warehousing creates severe Permanent Establishment (PE) exposure, mitigated by shifting to DAP.',
      'US South Dakota v. Wayfair (2018) enforces economic sales tax nexus thresholds ($100k revenue or 200 transactions) without physical presence.',
      'OECD BEPS 2.0 Pillar One Amount A reallocates 25% of residual profits above a 10% margin to market countries, replacing uncreditable unilateral DSTs.'
    ],
    projectStep: {
      title: 'Global Indirect Tax, Customs & Supply Chain Compliance Control Tower',
      steps: [
        'Automate B2B cross-border VAT zero-rating and customer reverse charge self-assessment routines under EU Directive 2006/112/EC.',
        'Harmonize WTO customs dutiable transaction values by incorporating engineering assists and intellectual property royalties.',
        'Audit Incoterms 2020 shipping agreements to eliminate OECD Article 5 Permanent Establishment risks and monitor US Wayfair nexus.',
        'Model OECD Pillar One Amount A profit reallocations to decommission unilateral gross Digital Services Taxes.'
      ]
    }
  }

];
