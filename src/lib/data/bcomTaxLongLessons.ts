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
  }
];

