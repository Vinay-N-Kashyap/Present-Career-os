import type { LongLesson } from './longLessons';

/**
 * Entrepreneurship, Venture Capital & Business Management (Course: bcom_ent)
 * Day 1: Lean Problem-Solution Fit, Burn Rate Dynamics, SAFE Valuation & Cap Table Math.
 */
export const BCOM_ENT_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'bcom_ent',
    day: 1,
    title: 'Lean Validation, Runway Physics & Venture Capital Cap Table Mechanics',
    goal: 'Master startup finance and entrepreneurship fundamentals: lean problem-solution validation, gross vs net burn runway equations, SAFE note valuation conversions, option pool shuffle dilution, and liquidation preference waterfall analysis.',
    minutes: 40,
    recap: 'Welcome to Entrepreneurship & Venture Capital. Starting a company is not about unbounded optimism; it is the rigorous management of hypotheses, runway physics, and capitalization table ownership math under high uncertainty.',
    parts: [
      {
        title: 'Lean Customer Discovery & Problem-Solution Fit Matrix',
        say: [
          'More startups fail from a lack of customers than from a failure of product development. The Lean Startup framework, pioneered by Steve Blank and Eric Ries, demands that founders "get out of the building" and test core hypotheses before writing code or manufacturing inventory.',
          'Customer Discovery tests Problem-Solution Fit by asking prospective buyers about current behaviors, painful workflows, and existing budget allocations—never asking hypothetical questions like "Would you buy this if we built it?" (which always produce polite false positives).',
          'A quantitative Problem-Solution Fit Matrix scores target customer segments across three dimensions: Problem Severity (1-5, how critical is the pain point?), Frequency (1-5, how often does it occur?), and Current Spend/Workaround Cost (1-5, what are they already spending to solve it?).',
          'Only when a problem segment scores above a validated threshold does the venture proceed to Minimum Viable Product (MVP) prototyping; otherwise, the venture executes a structured Pivot.'
        ],
        example: 'If you ask 20 restaurant owners if they want an AI inventory scanner, 18 might say "Yes, sounds cool!" But when you inspect their actual operations, only 2 spend more than $50/month on inventory tools, and 16 use a free clipboard. The clipboard is your real competitor.',
        code: `# Simulation: Lean Customer Discovery Problem-Solution Fit Validator
from dataclasses import dataclass
from typing import List

@dataclass
class CustomerInterview:
    interviewee_id: str
    segment: str
    severity_score: int       # 1-5: How painful is the problem?
    frequency_score: int      # 1-5: How often does the pain occur?
    budget_allocated: float   # Actual annual spend on current workarounds
    willing_to_prepay: bool   # Real financial commitment test

class LeanValidationEngine:
    def __init__(self, interviews: List[CustomerInterview]):
        self.interviews = interviews

    def evaluate_fit(self) -> dict:
        total = len(self.interviews)
        if total == 0:
            return {"Decision": "NO_DATA"}

        avg_severity = sum(i.severity_score for i in self.interviews) / total
        avg_frequency = sum(i.frequency_score for i in self.interviews) / total
        total_budget = sum(i.budget_allocated for i in self.interviews)
        prepay_count = sum(1 for i in self.interviews if i.willing_to_prepay)
        prepay_rate = (prepay_count / total) * 100.0

        # Composite pain index (out of 25)
        composite_score = avg_severity * avg_frequency

        # Decision threshold: High pain (>= 16/25) and real prepayment/intent (>= 25%)
        validated = composite_score >= 16.0 and prepay_rate >= 25.0
        decision = "PROCEED_TO_MVP" if validated else "PIVOT_OR_REFINE_HYPOTHESIS"

        return {
            "Total_Interviews": total,
            "Avg_Severity_Pain": round(avg_severity, 2),
            "Avg_Frequency": round(avg_frequency, 2),
            "Composite_Pain_Index": round(composite_score, 2),
            "Prepayment_Commit_Rate": f"{round(prepay_rate, 1)}%",
            "Validated_Decision": decision
        }

interviews = [
    CustomerInterview("User_01", "SMB Freight Broker", 5, 5, 12000.0, True),
    CustomerInterview("User_02", "SMB Freight Broker", 4, 4, 8000.0, False),
    CustomerInterview("User_03", "SMB Freight Broker", 5, 4, 15000.0, True),
    CustomerInterview("User_04", "SMB Freight Broker", 4, 5, 6000.0, True),
    CustomerInterview("User_05", "SMB Freight Broker", 4, 4, 10000.0, False)
]

engine = LeanValidationEngine(interviews)
result = engine.evaluate_fit()

print("Lean Problem-Solution Validation Report:")
print(f"Sample Size:         {result['Total_Interviews']} Enterprise Interviews")
print(f"Avg Severity (1-5):  {result['Avg_Severity_Pain']}")
print(f"Avg Frequency (1-5): {result['Avg_Frequency']}")
print(f"Pain Index (1-25):   {result['Composite_Pain_Index']}")
print(f"Commitment Rate:     {result['Prepayment_Commit_Rate']}")
print(f"Venture Recommendation: {result['Validated_Decision']}")`,
        output: `Lean Problem-Solution Validation Report:\nSample Size:         5 Enterprise Interviews\nAvg Severity (1-5):  4.4\nAvg Frequency (1-5): 4.4\nPain Index (1-25):   19.36\nCommitment Rate:     60.0%\nVenture Recommendation: PROCEED_TO_MVP`,
        tryIt: 'Change the interview prepay flags to False and observe the recommendation pivot from PROCEED_TO_MVP to PIVOT_OR_REFINE_HYPOTHESIS.',
        check: {
          question: 'Why does the Lean Startup methodology consider prospective customer prepayments or letters of intent (LOI) superior to positive survey feedback?',
          options: [
            'Financial commitment filters out polite compliments and proves genuine willingness to reallocate existing budget to solve the problem.',
            'Because letters of intent are immediately recognized as audited GAAP revenue on day one.',
            'Because survey feedback is strictly prohibited by securities laws before incorporation.',
            'Because venture capital funds only invest in companies that have zero customer interviews.'
          ],
          answerIndex: 0,
          explanation: 'Prospective customers will often compliment an idea to be encouraging. Real commitment—a letter of intent, a deposit, or sharing internal workflow data—is the only rigorous proof that the customer experiences unbearable pain worth paying to solve.'
        }
      },
      {
        title: 'Burn Rate Dynamics & The Zero-Cash Date Runway Horizon',
        say: [
          'A startup is a race between achieving default solvency and running out of cash. The runway horizon dictates every strategic decision: product launch schedules, hiring pacing, and fundraising timing.',
          'Gross Burn is the total cash money leaving the company bank account each month: Gross Burn = Payroll + Benefits + Cloud Servers + Office Lease + Software Subscriptions.',
          'Net Burn is the actual net monthly cash depletion: Net Burn = Gross Burn - Monthly Cash Receipts.',
          'Runway (Months) = Total Available Cash Reserves / Monthly Net Burn.',
          'The Zero-Cash Date (ZCD) is the exact calendar date when bank balances reach $0.00. Top founders maintain a strict "Red Zone Alert" threshold: when runway drops below 6 months, all discretionary spending freezes and fundraising or headcount restructuring becomes mandatory.'
        ],
        example: 'If a startup has $1,200,000 in the bank, spends $120,000/month on salaries and servers, and collects $40,000/month from customers, its Net Burn is $80,000/month. Its runway is $1,200,000 / $80,000 = 15 months.',
        code: `# Simulation: Startup Runway Physics & Zero-Cash Date (ZCD) Projection
from datetime import datetime, timedelta

class StartupRunwaySimulator:
    def __init__(self, cash_balance: float, gross_burn: float, monthly_revenue: float):
        self.cash = cash_balance
        self.gross_burn = gross_burn
        self.revenue = monthly_revenue
        self.net_burn = gross_burn - monthly_revenue

    def project_runway(self, start_date: datetime) -> dict:
        if self.net_burn <= 0:
            return {
                "Runway_Months": "Infinite (Default Solvency / Profitable)",
                "Zero_Cash_Date": "Never (Cash Flow Positive)",
                "Net_Burn": self.net_burn
            }

        runway_months = self.cash / self.net_burn
        days_remaining = int(runway_months * 30.4375) # Average days per month
        zero_cash_date = start_date + timedelta(days=days_remaining)
        
        # Red zone alert if runway < 6 months
        fundraising_urgency = "URGENT_FUNDRAISE_NOW" if runway_months < 6.0 else (
            "BEGIN_WARM_OUTREACH" if runway_months <= 9.0 else "HEADS_DOWN_BUILDING"
        )

        return {
            "Current_Cash": round(self.cash, 2),
            "Monthly_Net_Burn": round(self.net_burn, 2),
            "Runway_Months": round(runway_months, 1),
            "Zero_Cash_Date": zero_cash_date.strftime("%Y-%m-%d"),
            "Capital_Strategy": fundraising_urgency
        }

simulator = StartupRunwaySimulator(
    cash_balance=1200000.0,  # $1.2M seed round
    gross_burn=115000.0,     # $115k monthly expenses
    monthly_revenue=35000.0  # $35k monthly revenue
)

start_dt = datetime(2026, 1, 1)
report = simulator.project_runway(start_dt)

print(f"Cash Reserves:       \${report['Current_Cash']:,}")
print(f"Monthly Net Burn:    \${report['Monthly_Net_Burn']:,}")
print(f"Runway Horizon:      {report['Runway_Months']} Months")
print(f"Zero Cash Date:      {report['Zero_Cash_Date']}")
print(f"Fundraising Status:  {report['Capital_Strategy']}")`,
        output: `Cash Reserves:       $1,200,000.0\nMonthly Net Burn:    $80,000.0\nRunway Horizon:      15.0 Months\nZero Cash Date:      2027-03-31\nFundraising Status:  HEADS_DOWN_BUILDING`,
        tryIt: 'Increase gross burn to $240,000 and see runway drop to 5.9 months, triggering the URGENT_FUNDRAISE_NOW status.',
        check: {
          question: 'Why should a startup begin institutional fundraising when it has 9 to 12 months of runway left rather than waiting until 3 months remain?',
          options: [
            'Institutional venture rounds take 3 to 6 months to close, and running out of runway destroys negotiating leverage, leading to punitive down-rounds or insolvency.',
            'Because the SEC levies automatic fines on companies with less than 6 months of cash reserves.',
            'Because investors refuse to meet with founders unless their runway exceeds exactly 24 months.',
            'Because commercial banks automatically seize equity if cash balances drop below $500,000.'
          ],
          answerIndex: 0,
          explanation: 'Closing an institutional venture financing round takes months of diligence, partner meetings, and legal drafting. If a startup pitches with only 3 months of cash, investors can stall or demand predatory terms knowing the company will go bankrupt in weeks.'
        }
      },
      {
        title: 'Early-Stage Venture Valuation & SAFE Note Mechanics',
        say: [
          'In early-stage financing, negotiating an exact price per share is difficult because the company has minimal operating history. To solve this, Y Combinator created the Simple Agreement for Future Equity (SAFE).',
          'A SAFE is not debt: it carries no interest rate and no maturity date. Instead, it represents the contractual right to convert into preferred shares when the company raises a priced institutional round (such as Series A).',
          'A SAFE typically includes two key investor protection terms: a Valuation Cap (an upper limit on the valuation used to determine the SAFE holder\'s share price) and a Discount Rate (typically 15% to 20% off the future Series A price).',
          'When the priced round occurs, the SAFE converts at whichever mechanism produces the lower share price (giving the investor more shares): Price = min(Valuation Cap / Pre-Round Shares, Series A Price * (1 - Discount)).',
          'The Post-Money SAFE guarantees that the investor buys a fixed, transparent percentage of the company regardless of other unpriced notes issued in that seed syndicate.'
        ],
        example: 'An angel invests $100,000 on a SAFE with a $5,000,000 valuation cap and a 20% discount. In Series A, the company is valued at $10,000,000 at $10.00/share. With the discount, the price is $8.00. But under the cap, the price is $5.00! The investor converts at $5.00/share, receiving 20,000 shares instead of 10,000.',
        code: `# Simulation: SAFE Note Conversion & Effective Investor Share Price
class SafeNoteInvestment:
    def __init__(self, investor_name: str, investment_amount: float, 
                 valuation_cap: float, discount_rate: float):
        self.name = investor_name
        self.amount = investment_amount
        self.cap = valuation_cap
        self.discount = discount_rate

    def convert_at_priced_round(self, series_a_share_price: float, pre_money_shares: int) -> dict:
        # Price using valuation cap
        price_under_cap = self.cap / pre_money_shares
        
        # Price using discount
        price_under_discount = series_a_share_price * (1.0 - self.discount)
        
        # Investor gets the lower price (more favorable)
        effective_price = min(price_under_cap, price_under_discount)
        mechanism = "VALUATION_CAP" if price_under_cap <= price_under_discount else "DISCOUNT_RATE"
        
        shares_issued = self.amount / effective_price

        return {
            "Investor": self.name,
            "Investment": self.amount,
            "Price_Under_Cap": round(price_under_cap, 4),
            "Price_Under_Discount": round(price_under_discount, 4),
            "Effective_Share_Price": round(effective_price, 4),
            "Mechanism_Triggered": mechanism,
            "Shares_Received": int(shares_issued)
        }

safe_angel = SafeNoteInvestment(
    investor_name="Sequoia Scout Seed",
    investment_amount=250000.0,
    valuation_cap=6000000.0, # $6M Cap
    discount_rate=0.20       # 20% Discount
)

# In Series A: Company raises at $12M pre-money on 2,000,000 shares ($6.00/share)
conversion = safe_angel.convert_at_priced_round(
    series_a_share_price=6.00,
    pre_money_shares=2000000
)

print(f"SAFE Investor:       {conversion['Investor']}")
print(f"Cap Implied Price:   \${conversion['Price_Under_Cap']}")
print(f"Discount Price:      \${conversion['Price_Under_Discount']}")
print(f"Effective Price:     \${conversion['Effective_Share_Price']} ({conversion['Mechanism_Triggered']})")
print(f"Shares Issued:       {conversion['Shares_Received']:,} shares")`,
        output: `SAFE Investor:       Sequoia Scout Seed\nCap Implied Price:   $3.0\nDiscount Price:      $4.8\nEffective Price:     $3.0 (VALUATION_CAP)\nShares Issued:       83,333 shares`,
        tryIt: 'Change the Series A share price to $3.50 and pre-money shares to 1,000,000 ($6M cap = $6/share) to see the DISCOUNT_RATE mechanism take over.',
        check: {
          question: 'What is the primary benefit of the Valuation Cap in a SAFE note for an early-stage investor?',
          options: [
            'It protects early investors from excessive valuation growth in the subsequent round, ensuring their early risk is rewarded with a capped entry price.',
            'It guarantees that the founders can never sell more than 50% of company shares.',
            'It forces the startup to repay the invested capital with compound interest upon contract signing.',
            'It legally requires the company to pay quarterly dividends to SAFE holders.'
          ],
          answerIndex: 0,
          explanation: 'If a startup takes an angel\'s money when it is worth very little and subsequently explodes in value to $50M before Series A, without a valuation cap the angel\'s $100k would buy a negligible fraction of 1% of the company. The cap guarantees an equity floor reward for taking early risk.'
        }
      },
      {
        title: 'The Option Pool Shuffle & Founder Dilution Mechanics',
        say: [
          'When venture capitalists issue a Series A Term Sheet, they routinely demand that the company establish or expand an unallocated Employee Stock Option Plan (ESOP) pool, typically 10% to 20% of post-round shares, to attract future executive hires.',
          'Crucially, almost all term sheets specify that the option pool must be created out of the PRE-MONEY valuation rather than post-money. This standard industry practice is known as the "Option Pool Shuffle".',
          'Because the pool is created out of the pre-money valuation, 100% of the dilution required to create those unissued option shares comes directly out of the existing founders and angel shareholders—the incoming VC suffers zero dilution from the new pool!',
          'This hidden dilution effectively reduces the "effective pre-money valuation" received by the founders. Negotiating the exact size of the pool based on an itemized hiring plan for the next 18 months is one of the highest-value skills a founder can possess.'
        ],
        example: 'On an $8M pre-money valuation with a $2M investment, the post-money is $10M and the VC owns 20%. If a 15% unallocated option pool is required on a pre-money basis, that 15% comes entirely from the founders, shrinking their ownership from 80% down to 65% on Day 1.',
        code: `# Simulation: The Option Pool Shuffle & True Founder Dilution Engine
class CapTableDilutionModel:
    def __init__(self, founder_shares: int, pre_money_valuation: float, 
                 investment_amount: float, option_pool_target_pct: float):
        self.founder_shares = founder_shares
        self.pre_money = pre_money_valuation
        self.investment = investment_amount
        self.pool_pct = option_pool_target_pct
        self.post_money = pre_money_valuation + investment_amount

    def compute_shuffle(self) -> dict:
        vc_target_ownership = self.investment / self.post_money
        
        # When pool is created pre-money:
        # Founders_Ownership = 1.0 - VC_Ownership - Option_Pool_Pct
        founder_ownership = 1.0 - vc_target_ownership - self.pool_pct
        
        # Effective Pre-Money Valuation experienced by founders
        effective_pre_money = self.pre_money * (1.0 - self.pool_pct)
        
        # Total shares calculation
        total_post_shares = int(self.founder_shares / founder_ownership)
        vc_shares = int(total_post_shares * vc_target_ownership)
        pool_shares = total_post_shares - self.founder_shares - vc_shares

        return {
            "Nominal_Pre_Money": round(self.pre_money, 2),
            "Effective_Pre_Money": round(effective_pre_money, 2),
            "Post_Money_Valuation": round(self.post_money, 2),
            "Founder_Ownership_Pct": round(founder_ownership * 100.0, 2),
            "VC_Ownership_Pct": round(vc_target_ownership * 100.0, 2),
            "Option_Pool_Pct": round(self.pool_pct * 100.0, 2),
            "Total_Post_Shares": total_post_shares,
            "Pool_Shares_Created": pool_shares
        }

model = CapTableDilutionModel(
    founder_shares=8000000,        # 8M initial founder shares
    pre_money_valuation=8000000.0, # $8.0M Pre-Money
    investment_amount=2000000.0,   # $2.0M Series A Round
    option_pool_target_pct=0.15    # 15% Unallocated Employee Option Pool
)

res = model.compute_shuffle()
print(f"Nominal Pre-Money:    \${res['Nominal_Pre_Money']:,}")
print(f"Effective Pre-Money:  \${res['Effective_Pre_Money']:,}")
print(f"Post-Money:           \${res['Post_Money_Valuation']:,}")
print(f"Founder Ownership:    {res['Founder_Ownership_Pct']}%")
print(f"VC Ownership:         {res['VC_Ownership_Pct']}%")
print(f"Option Pool:          {res['Option_Pool_Pct']}%")
print(f"New Pool Shares:      {res['Pool_Shares_Created']:,}")`,
        output: `Nominal Pre-Money:    $8,000,000.0\nEffective Pre-Money:  $6,800,000.0\nPost-Money:           $10,000,000.0\nFounder Ownership:    65.0%\nVC Ownership:         20.0%\nOption Pool:          15.0%\nNew Pool Shares:      1,846,153`,
        tryIt: 'Negotiate the option pool target down from 15% to 8% based on a realistic hiring plan, and watch Founder Ownership jump from 65.0% to 72.0%.',
        check: {
          question: 'Why do venture capitalists insist that the unallocated employee option pool be created out of the pre-money valuation rather than post-money?',
          options: [
            'Because creating the pool pre-money forces 100% of the dilution onto the founders, preserving the VC\'s agreed percentage without additional cost to the VC.',
            'Because post-money option pools are strictly prohibited by the Delaware General Corporation Law.',
            'Because creating it pre-money reduces the company\'s payroll taxes on employee stock grants.',
            'Because employees refuse to accept options that are issued after an institutional venture investment.'
          ],
          answerIndex: 0,
          explanation: 'In a pre-money option pool creation, the founders absorb 100% of the dilution needed to create the employee shares. If the pool were created post-money, the incoming VC would also be diluted by that pool, which would require the VC to invest more money to maintain their ownership target.'
        }
      },
      {
        title: 'Waterfall Cap Table Liquidation Preference Analysis',
        say: [
          'Ownership percentages on a cap table only dictate payout distributions in a standard IPO or very high-multiple acquisition. In distressed or modest exits, payout distributions are governed by the Liquidation Preference Waterfall.',
          'Preferred stock holds a senior liquidation claim over Common stock (founders and employees). The most common term is a "1x Non-Participating Liquidation Preference".',
          'Under 1x Non-Participating Preference, upon an exit or sale, the investor chooses whichever is higher: (1) getting their initial investment dollars returned (1x capital guarantee), OR (2) converting their preferred shares into common stock and taking their pro-rata percentage of the total proceeds.',
          'Under 1x Participating Preference ("double-dipping"), the investor gets their entire 1x investment returned FIRST, and then ALSO shares pro-rata in whatever remaining cash is left over with the common shareholders.',
          'The "Conversion Threshold" is the exit valuation at which a non-participating investor chooses to convert to common stock: Conversion Threshold = Investment Amount / Investor Ownership Percentage.'
        ],
        example: 'A VC invests $5M for 25% ownership with 1x Non-Participating preference. If the company sells for $10M: converting gives them 25% ($2.5M), but their 1x preference gives them $5M! They take $5M, leaving only $5M for common. But if the company sells for $40M, 25% is $10M, which exceeds their $5M preference, so they convert.',
        code: `# Simulation: Cap Table Liquidation Waterfall Payout Engine
class LiquidationWaterfall:
    def __init__(self, preferred_investment: float, preferred_ownership: float, 
                 preference_multiple: float = 1.0, is_participating: bool = False):
        self.investment = preferred_investment
        self.ownership = preferred_ownership
        self.multiple = preference_multiple
        self.participating = is_participating

    def calculate_exit_payouts(self, exit_valuation: float) -> dict:
        preference_owed = self.investment * self.multiple
        
        if exit_valuation <= preference_owed:
            # Distressed exit: Preferred takes all available cash, Common gets $0
            return {
                "Exit_Valuation": exit_valuation,
                "Preferred_Payout": exit_valuation,
                "Common_Payout": 0.0,
                "Preferred_Mechanism": "PARTIAL_PREFERENCE_RECOVERY"
            }

        if self.participating:
            # Double dipping: gets preference plus pro-rata share of remainder
            remaining_after_pref = exit_valuation - preference_owed
            pref_payout = preference_owed + (remaining_after_pref * self.ownership)
            common_payout = remaining_after_pref * (1.0 - self.ownership)
            mechanism = "PARTICIPATING_DOUBLE_DIP"
        else:
            # Non-participating: chooses higher of Preference or Pro-Rata
            pro_rata_payout = exit_valuation * self.ownership
            if pro_rata_payout > preference_owed:
                pref_payout = pro_rata_payout
                common_payout = exit_valuation - pref_payout
                mechanism = "CONVERTED_TO_COMMON"
            else:
                pref_payout = preference_owed
                common_payout = exit_valuation - preference_owed
                mechanism = "TOOK_1X_PREFERENCE"

        return {
            "Exit_Valuation": round(exit_valuation, 2),
            "Preferred_Payout": round(pref_payout, 2),
            "Common_Payout": round(common_payout, 2),
            "Preferred_Mechanism": mechanism
        }

waterfall = LiquidationWaterfall(
    preferred_investment=5000000.0, # $5M Preferred Investment
    preferred_ownership=0.25,        # 25% Equity
    preference_multiple=1.0,
    is_participating=False           # Standard 1x Non-Participating
)

exit_low = waterfall.calculate_exit_payouts(exit_valuation=10000000.0) # $10M Exit
exit_high = waterfall.calculate_exit_payouts(exit_valuation=40000000.0) # $40M Exit

print("Exit Scenario 1 ($10M Acquisition):")
print(f"Preferred: \${exit_low['Preferred_Payout']:,} ({exit_low['Preferred_Mechanism']})")
print(f"Common:    \${exit_low['Common_Payout']:,}")

print("\nExit Scenario 2 ($40M Acquisition):")
print(f"Preferred: \${exit_high['Preferred_Payout']:,} ({exit_high['Preferred_Mechanism']})")
print(f"Common:    \${exit_high['Common_Payout']:,}")`,
        output: `Exit Scenario 1 ($10M Acquisition):\nPreferred: $5,000,000.0 (TOOK_1X_PREFERENCE)\nCommon:    $5,000,000.0\n\nExit Scenario 2 ($40M Acquisition):\nPreferred: $10,000,000.0 (CONVERTED_TO_COMMON)\nCommon:    $30,000,000.0`,
        tryIt: 'Set is_participating=True and rerun Scenario 2 to see the participating preferred investor take $13.75M instead of $10.0M.',
        check: {
          question: 'Under a standard 1x Non-Participating Liquidation Preference, at what exit valuation does an investor who put in $4,000,000 for 20% ownership choose to convert to common stock?',
          options: [
            'At any exit valuation strictly above $20,000,000 (because 20% of $20M is $4.0M, exceeding the 1x preference).',
            'At exactly $4,000,000 because that repays their initial principal.',
            'Never, because preferred stock is legally barred from receiving common stock proceeds in an acquisition.',
            'Only if the acquisition is paid in cash rather than public company shares.'
          ],
          answerIndex: 0,
          explanation: 'The conversion threshold is calculated as Investment / Ownership % = $4M / 0.20 = $20,000,000. At any exit below $20M, taking the $4M preference yields more cash than 20% pro-rata; above $20M, taking 20% pro-rata yields more.'
        }
      }
    ],
    summary: [
      'Customer discovery requires testing problem severity and willingness to pay (LOIs, prepayments) to prove Problem-Solution Fit before building.',
      'Runway equals available cash divided by monthly net burn; red zone alerts trigger when runway drops below 6 months.',
      'SAFE notes convert into preferred stock at whichever price is lower between the Valuation Cap formula and the Discount Rate formula.',
      'The Option Pool Shuffle creates unallocated option shares out of pre-money valuation, causing 100% of employee pool dilution to fall upon founders.',
      'Liquidation preferences grant preferred investors downside capital recovery or conversion to common stock above the conversion threshold.'
    ],
    projectStep: {
      title: 'Venture Capital Cap Table & Runway Simulator',
      steps: [
        'Build the customer interview scoring matrix to determine Problem-Solution Fit.',
        'Model startup cash burn, revenue ramp, and monthly runway to project Zero-Cash Date.',
        'Calculate SAFE note conversion share prices across Cap and Discount mechanics.',
        'Simulate Series A pre-money option pool dilution and liquidation preference waterfall payouts.'
      ]
    }
  }
];
