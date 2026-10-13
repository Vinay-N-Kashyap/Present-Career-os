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
  },
  {
    coursePrefix: 'bcom_ent',
    day: 2,
    title: 'Venture Debt, 409A Common Valuation, Secondary ROFR & Anti-Dilution Defense',
    goal: 'Master advanced venture capital financing and corporate governance: venture debt covenants and warrant coverage algebra, IRC Section 409A common stock fair market value option strike calculations, secondary liquidity Right of First Refusal (ROFR) transfer waterfalls, down-round anti-dilution algebra (broad-based weighted average vs full ratchet), and founder equity vesting with double-trigger acceleration.',
    minutes: 42,
    recap: 'Day 1 mastered lean customer discovery, SAFE conversions, and Series A cap table waterfalls. Day 2 tackles mid-to-late stage financing: non-dilutive venture debt structures, 409A option pricing, secondary share transfers, and down-round anti-dilution defense.',
    parts: [
      {
        title: 'Venture Debt Financing Mechanics & Warrant Coverage Algebra',
        say: [
          'Venture debt is a specialized loan product tailored for venture-backed startups with strong equity backing, provided by specialty banks (such as Silicon Valley Bank, Stifel, and Western Alliance) and dedicated venture debt funds (such as Runway Growth and Hercules Capital).',
          'Unlike traditional commercial bank loans that require existing profitability and hard collateral (real estate, machinery), venture debt underwrites against the startup\'s enterprise value, intellectual property, and likelihood of raising subsequent equity rounds.',
          'Founders use venture debt to extend their cash runway by 6 to 12 months between equity funding rounds, or as growth capital to achieve higher valuation milestones while minimizing dilution.',
          'Venture debt carries two distinct cost components: cash interest (priced at Prime Rate / SOFR plus a margin spread, typically with a 12-to-18-month interest-only period followed by amortization) and equity warrant coverage (typically 5% to 10% of the loan principal in warrants to purchase preferred stock at the most recent equity round price).',
          'Founders must rigorously monitor loan covenants: minimum cash liquidity covenants, trailing revenue minimums, and negative pledges on intellectual property. Breaching a covenant can trigger immediate loan acceleration and foreclosure.'
        ],
        example: 'A Series A SaaS company with $3,000,000 in cash borrows $2,000,000 of venture debt at 11.5% interest with 7.5% warrant coverage. During the 12-month interest-only period, monthly debt service is $19,166.67, and the lender receives warrants for 30,000 Series A shares at $5.00/share ($150,000 warrant value). The company gains 8 months of additional runway without selling 20% of the company.',
        code: `# Simulation: Venture Debt Structure & Warrant Coverage Calculator
from typing import Dict

def calculate_venture_debt_structure(
    loan_principal: float,
    annual_interest_rate_pct: float,
    warrant_coverage_pct: float,
    preferred_strike_price: float,
    interest_only_months: int = 12
) -> Dict:
    monthly_interest = (loan_principal * (annual_interest_rate_pct / 100.0)) / 12.0
    warrant_dollar_value = loan_principal * (warrant_coverage_pct / 100.0)
    warrant_shares_issued = int(warrant_dollar_value / preferred_strike_price)
    annual_interest_paid = monthly_interest * interest_only_months

    return {
        "Loan_Principal": loan_principal,
        "Monthly_IO_Payment": round(monthly_interest, 2),
        "Total_Annual_Interest": round(annual_interest_paid, 2),
        "Warrant_Coverage_Dollars": round(warrant_dollar_value, 2),
        "Warrant_Shares_Issued": warrant_shares_issued,
        "Warrant_Strike_Price": preferred_strike_price
    }

vd_res = calculate_venture_debt_structure(
    loan_principal=2000000.0,
    annual_interest_rate_pct=11.5,
    warrant_coverage_pct=7.5,
    preferred_strike_price=5.0
)
print(f"Loan: \${vd_res['Loan_Principal']} | Monthly IO: \${vd_res['Monthly_IO_Payment']}")
print(f"Warrants: \${vd_res['Warrant_Coverage_Dollars']} ({vd_res['Warrant_Shares_Issued']} shares at \${vd_res['Warrant_Strike_Price']})")`,
        output: `Loan: $2000000.0 | Monthly IO: $19166.67\nWarrants: $150000.0 (30000 shares at $5.0)`,
        tryIt: 'Change annual_interest_rate_pct to 9.5% and warrant_coverage_pct to 5.0% to observe the reduced monthly interest payment and lower warrant share issuance.',
        check: {
          question: 'Why do venture debt lenders require warrant coverage (an equity kicker) in addition to charging cash interest on loans to startups?',
          options: [
            '(Recommended) Because venture loans bear equity-like default risk, warrants allow the lender to participate in outsized startup upside if the company becomes a unicorn.',
            'Because federal law mandates that all corporate loans must issue voting common shares to commercial banks.',
            'Because warrant coverage legally relieves the borrower from having to make monthly cash interest payments.',
            'Because warrants allow the lender to replace the startup CEO if quarterly revenue drops by 2%.'
          ],
          answer: 0,
          why: 'Startup borrowers often fail or burn through capital with limited physical collateral; the warrant kicker provides equity upside on winners to compensate the lender for default losses across their venture loan portfolio.',
          answerIndex: 0,
          explanation: 'Startup borrowers often fail or burn through capital with limited physical collateral; the warrant kicker provides equity upside on winners to compensate the lender for default losses across their venture loan portfolio.'
        }
      },
      {
        title: 'IRC Section 409A Common Stock Valuation & Lack of Marketability Discount',
        say: [
          'Section 409A of the United States Internal Revenue Code regulates nonqualified deferred compensation, including employee stock option grants. Under Section 409A, stock options granted to employees must be priced at or above the Fair Market Value (FMV) of the underlying common stock on the grant date.',
          'If a private startup grants options at a strike price below FMV, the option recipient faces catastrophic tax consequences: immediate ordinary income tax on vesting plus a punitive 20% federal excise tax penalty and interest penalties.',
          'To establish safe harbor protection against IRS penalties, startups must obtain an independent third-party appraisal (a "409A valuation") at least once every 12 months, or whenever a material financing event (such as a new priced equity round) occurs.',
          'Common stock valuation is fundamentally different from preferred stock valuation: preferred stock carries seniority, liquidation preferences, redemption rights, and protective provisions, whereas common stock sits at the bottom of the liquidation waterfall and has no public liquidity.',
          'Independent appraisers use Option Pricing Models (OPM) or Backsolve methods to allocate total enterprise value across capital structure liquidation preference breakpoints, applying a Discount for Lack of Marketability (DLOM, typically 20% to 35%) to calculate the FMV option strike price for common stock.'
        ],
        example: 'A startup raises a Series A round selling preferred shares at $10.00/share with a $15,000,000 liquidation preference. If employee options had to be priced at $10.00, employees would receive very little upside. An independent 409A valuation factors in liquidation preference seniority and lack of marketability to determine common stock FMV is $6.00/share, creating a defensible IRS safe-harbor strike price.',
        code: `# Simulation: IRC Section 409A Common Stock FMV Strike Price Engine
from typing import Dict

def calculate_section_409a_valuation(
    latest_preferred_price: float,
    enterprise_value: float,
    preferred_liquidation_preference: float,
    lack_of_marketability_discount_pct: float = 25.0
) -> Dict:
    # Breakpoint equity value allocated to common stock
    common_equity_pool = max(0.0, enterprise_value - preferred_liquidation_preference)
    equity_coverage_ratio = common_equity_pool / enterprise_value if enterprise_value > 0 else 0.0

    # Synthetic OPM discount (seniority + lack of marketability DLOM)
    structural_seniority_discount_pct = (1.0 - equity_coverage_ratio) * 50.0
    total_409a_discount_pct = min(80.0, structural_seniority_discount_pct + lack_of_marketability_discount_pct)

    common_fmv_price = latest_preferred_price * (1.0 - total_409a_discount_pct / 100.0)

    return {
        "Preferred_Share_Price": latest_preferred_price,
        "Common_Equity_Pool": round(common_equity_pool, 2),
        "Total_409A_Discount_Pct": f"{round(total_409a_discount_pct, 1)}%",
        "Common_Stock_FMV_Strike": round(common_fmv_price, 2)
    }

valuation_409a = calculate_section_409a_valuation(
    latest_preferred_price=10.0,
    enterprise_value=50000000.0,
    preferred_liquidation_preference=15000000.0,
    lack_of_marketability_discount_pct=25.0
)
print(f"Preferred Price: \${valuation_409a['Preferred_Share_Price']} | 409A Discount: {valuation_409a['Total_409A_Discount_Pct']}")
print(f"Common Stock FMV Option Strike: \${valuation_409a['Common_Stock_FMV_Strike']}")`,
        output: `Preferred Price: $10.0 | 409A Discount: 40.0%\nCommon Stock FMV Option Strike: $6.0`,
        tryIt: 'Increase lack_of_marketability_discount_pct to 35.0% to observe how illiquidity discounts reduce the employee strike price, increasing employee upside potential.',
        check: {
          question: 'Why must common stock options granted to employees be priced at or above Fair Market Value (FMV) determined by an independent 409A valuation?',
          options: [
            '(Recommended) To comply with IRS safe harbor rules and protect employees from immediate taxable income and a punitive 20% federal excise tax penalty on unexercised options.',
            'Because corporate law requires common stock options to be priced higher than the latest preferred stock round.',
            'Because the SEC requires all private startup options to be registered on NASDAQ within 30 days of grant.',
            'Because lower option strike prices increase corporate income tax liabilities for the startup.'
          ],
          answer: 0,
          why: 'Under IRC Section 409A, issuing options below Fair Market Value constitutes deferred compensation without substantial risk of forfeiture, triggering immediate income recognition and a 20% excise tax penalty on the option recipient.',
          answerIndex: 0,
          explanation: 'Under IRC Section 409A, issuing options below Fair Market Value constitutes deferred compensation without substantial risk of forfeiture, triggering immediate income recognition and a 20% excise tax penalty on the option recipient.'
        }
      },
      {
        title: 'Secondary Share Liquidity, Company Bylaws & Right of First Refusal (ROFR)',
        say: [
          'As venture-backed companies remain private for a decade or longer prior to an initial public offering (IPO), early employees, advisors, and founders often face significant liquidity constraints while holding illiquid paper wealth.',
          'Secondary transactions involve existing shareholders selling vested common shares directly to third-party secondary buyers or institutional funds, contrasting with primary financing rounds where the company creates and sells new shares to fund operations.',
          'Startups strictly regulate private stock transfers in their Corporate Bylaws and Investors\' Rights Agreements (IRA) through Transfer Restrictions, Rights of First Refusal (ROFR), and Co-Sale (Tag-Along) agreements.',
          'Under a standard ROFR protocol, when a shareholder receives a bona fide offer to sell shares, the company possesses Primary ROFR to match the terms and repurchase the shares into treasury. If the company declines or waives its right, Secondary ROFR passes to major preferred investors pro-rata.',
          'If both the company and existing investors waive their rights, the transfer proceeds to the third-party buyer. ROFR mechanisms protect the startup from predatory outside funds, activist investors, or competitors acquiring cap table positions.'
        ],
        example: 'A founding engineer receives an offer from an outside fund to sell 20,000 shares at $4.50 ($90,000). The company lacks excess cash to buy them back, but the lead Series A VC exercises its secondary ROFR, purchasing the shares at $4.50 to increase its ownership stake without diluting other holders.',
        code: `# Simulation: Secondary Stock Transfer & Right of First Refusal (ROFR) Router
from typing import Dict

class SecondaryShareTransactionRouter:
    def __init__(self, company_cash_reserves: float, investor_rofr_participating: bool):
        self.company_cash = company_cash_reserves
        self.investor_rofr = investor_rofr_participating

    def evaluate_secondary_transfer(
        self,
        seller_name: str,
        shares_to_sell: int,
        proposed_share_price: float
    ) -> Dict:
        total_transfer_cost = shares_to_sell * proposed_share_price

        # Step 1: Company ROFR Check (Bylaws primary right to buy back)
        if self.company_cash >= total_transfer_cost * 2.0:
            buyer = "COMPANY_TREASURY_BUYBACK"
            status = "EXERCISED_COMPANY_PRIMARY_ROFR"
        elif self.investor_rofr:
            buyer = "EXISTING_SERIES_A_LEAD_VC"
            status = "EXERCISED_INVESTOR_SECONDARY_ROFR"
        else:
            buyer = "OUTSIDE_ACCREDITED_BUYER"
            status = "ROFR_WAIVED_TRANSFERRED_TO_THIRD_PARTY"

        return {
            "Seller": seller_name,
            "Shares": shares_to_sell,
            "Share_Price": proposed_share_price,
            "Total_Consideration": round(total_transfer_cost, 2),
            "Acquiring_Party": buyer,
            "ROFR_Status": status
        }

router = SecondaryShareTransactionRouter(company_cash_reserves=100000.0, investor_rofr_participating=True)
sec_res = router.evaluate_secondary_transfer("Founding_Engineer_1", 20000, 4.50)
print(f"Seller: {sec_res['Seller']} ({sec_res['Shares']} shares @ \${sec_res['Share_Price']})")
print(f"Consideration: \${sec_res['Total_Consideration']} -> {sec_res['ROFR_Status']} by {sec_res['Acquiring_Party']}")`,
        output: `Seller: Founding_Engineer_1 (20000 shares @ $4.5)\nConsideration: $90000.0 -> EXERCISED_INVESTOR_SECONDARY_ROFR by EXISTING_SERIES_A_LEAD_VC`,
        tryIt: 'Set company_cash_reserves=500000.0 and rerun to observe the company treasury exercising its primary ROFR to retire the shares into company treasury.',
        check: {
          question: 'What is the primary corporate governance objective of enforcing a Right of First Refusal (ROFR) on private company stock transfers?',
          options: [
            '(Recommended) To prevent competitor or hostile third parties from entering the cap table and allow existing insiders or the company to consolidate ownership.',
            'To guarantee that employees can never sell their shares under any circumstances prior to bankruptcy.',
            'To force all outside buyers to purchase shares at a mandatory 50% discount to fair market value.',
            'To automatically convert common stock into non-voting municipal bonds upon transfer.'
          ],
          answer: 0,
          why: 'ROFR ensures that private companies and lead venture investors maintain control over who owns their equity, preventing activist investors or commercial competitors from acquiring cap table access.',
          answerIndex: 0,
          explanation: 'ROFR ensures that private companies and lead venture investors maintain control over who owns their equity, preventing activist investors or commercial competitors from acquiring cap table access.'
        }
      },
      {
        title: 'Down-Round Anti-Dilution: Broad-Based Weighted Average vs Full Ratchet',
        say: [
          'In economic downturns or periods of missed milestones, startups may be forced to raise an equity round at a valuation lower than their prior financing round—an event known as a "Down-Round".',
          'Down-rounds trigger contractual anti-dilution protections negotiated by preferred stockholders in the Certificate of Incorporation, which protect investors against price-per-share devaluation by adjusting their conversion ratio into common stock.',
          'There are two main anti-dilution formulas: Full Ratchet and Broad-Based Weighted Average.',
          'Full Ratchet is extremely punitive to founders and employees: it retroactively reduces the investor\'s conversion price to the exact lower price per share paid in the new round, regardless of how small the new round is. This massively increases the investor\'s common share entitlement and severely dilutes common stockholders.',
          'Broad-Based Weighted Average is the established Silicon Valley market standard: it adjusts the conversion price downward using a weighted formula that accounts for both the lower price AND the amount of capital raised relative to the total fully diluted capitalization (CP2 = CP1 * (A + B) / (A + C)). It protects investor capital while preserving critical founder equity incentives.'
        ],
        example: 'A venture capital firm invests in Series A at $10.00/share. In a downturn, Series B raises $5,000,000 at $5.00/share against a 10,000,000 fully diluted cap table. Full ratchet reduces Series A conversion price to $5.00 (doubling their share count and crushing founders). Broad-based weighted average adjusts the conversion price to $9.55, proportionally balancing protection and founder retention.',
        code: `# Simulation: Down-Round Anti-Dilution Adjustment Calculator
from typing import Dict

def calculate_anti_dilution_adjustment(
    original_conversion_price: float,
    down_round_share_price: float,
    pre_round_fully_diluted_shares: int,
    new_capital_raised: float
) -> Dict:
    # 1. Full Ratchet: Conversion price immediately drops to new price
    full_ratchet_cp = down_round_share_price

    # 2. Broad-Based Weighted Average Formula:
    # CP2 = CP1 * (A + B) / (A + C)
    # A = Fully diluted shares before round
    # B = Shares that would have been purchased at old price (New Capital / CP1)
    # C = Shares actually issued in down round (New Capital / P2)
    a = float(pre_round_fully_diluted_shares)
    b = new_capital_raised / original_conversion_price
    c = new_capital_raised / down_round_share_price
    bb_weighted_avg_cp = original_conversion_price * ((a + b) / (a + c))

    return {
        "Original_Conversion_Price": original_conversion_price,
        "Down_Round_Price": down_round_share_price,
        "Full_Ratchet_Conversion_Price": round(full_ratchet_cp, 2),
        "Broad_Based_Weighted_Average_CP": round(bb_weighted_avg_cp, 2),
        "Full_Ratchet_Founder_Dilution_Impact": "CATASTROPHIC_FOUNDER_ERASURE",
        "Weighted_Average_Impact": "STANDARD_BALANCED_COMPROMISE"
    }

anti_dilution = calculate_anti_dilution_adjustment(
    original_conversion_price=10.0,
    down_round_share_price=5.0,
    pre_round_fully_diluted_shares=10000000,
    new_capital_raised=5000000.0
)
print(f"Original CP: \${anti_dilution['Original_Conversion_Price']} | Down-Round: \${anti_dilution['Down_Round_Price']}")
print(f"Full Ratchet CP: \${anti_dilution['Full_Ratchet_Conversion_Price']} vs Broad-Based CP: \${anti_dilution['Broad_Based_Weighted_Average_CP']}")`,
        output: `Original CP: $10.0 | Down-Round: $5.0\nFull Ratchet CP: $5.0 vs Broad-Based CP: $9.55`,
        tryIt: 'Increase new_capital_raised to $15,000,000 to see the broad-based conversion price adjust further downward to reflect the larger proportion of discounted equity.',
        check: {
          question: 'Why is Broad-Based Weighted Average anti-dilution considered far superior for company longevity compared to Full Ratchet anti-dilution?',
          options: [
            '(Recommended) Because it softens the dilution adjustment by factoring in the size of the round relative to total capitalization, preventing founder equity from being completely wiped out.',
            'Because full ratchet forces the startup to immediately repay all previous venture capital in cash.',
            'Because broad-based weighted average requires preferred investors to forfeit all board seats during a down-round.',
            'Because full ratchet is illegal under Delaware corporate law and cannot be enforced in court.'
          ],
          answer: 0,
          why: 'Broad-based weighted average accounts for the economic magnitude of the round (how much capital was actually raised at the lower price), preventing catastrophic dilution of founders and common employees that would otherwise destroy team incentives.',
          answerIndex: 0,
          explanation: 'Broad-based weighted average accounts for the economic magnitude of the round (how much capital was actually raised at the lower price), preventing catastrophic dilution of founders and common employees that would otherwise destroy team incentives.'
        }
      },
      {
        title: 'Founder Equity Vesting, 83(b) Tax Elections & Double-Trigger Acceleration',
        say: [
          'Founders must always issue their shares subject to reverse vesting agreements, typically over a 4-year period with a 1-year cliff (25% vesting after 12 months, followed by 1/48th monthly vesting). If a co-founder leaves prematurely without vesting, they would otherwise retain half the company while contributing nothing further.',
          'Crucially, upon incorporation founders must file an IRC Section 83(b) election with the IRS within 30 days of stock issuance. By electing to be taxed on the nominal fair market value upfront ($0.0001/share), founders pay negligible taxes now and convert future equity appreciation into long-term capital gains, avoiding devastating ordinary income tax liabilities as shares vest at multimillion-dollar valuations.',
          'During mergers and acquisitions (M&A), equity acceleration clauses determine what happens to unvested founder and executive equity.',
          'Single-Trigger Acceleration automatically vests 100% of unvested shares upon a Change of Control (acquisition). Acquirers dislike single-trigger clauses because founders can cash out and leave immediately post-closing.',
          'Double-Trigger Acceleration is the venture standard: it requires two distinct events: 1. A Change of Control occurs (the company is acquired), AND 2. The founder is terminated without cause (or resigns for "good reason" such as salary reduction or relocation) within 12 months post-acquisition. This aligns incentives: acquirers retain key leaders, while founders are shielded against being dismissed and deprived of their equity.'
        ],
        example: 'A founder with 4,000,000 shares is 2 years into a 4-year schedule (2,000,000 vested). The startup is acquired for $8.00/share and the new parent company eliminates the founder\'s role without cause. The double-trigger clause instantly accelerates the remaining 2,000,000 unvested shares, ensuring the founder receives the full $32,000,000 liquidity value.',
        code: `# Simulation: Founder Equity Reverse Vesting & Double-Trigger Acceleration Engine
from typing import Dict

def calculate_founder_vesting_and_acceleration(
    total_founder_shares: int,
    months_elapsed: int,
    company_acquired: bool,
    founder_terminated_without_cause: bool,
    exit_share_price: float
) -> Dict:
    # Standard 4-year monthly vesting with 1-year (12 month) cliff
    if months_elapsed < 12:
        vested_shares = 0
    else:
        vested_ratio = min(1.0, months_elapsed / 48.0)
        vested_shares = int(total_founder_shares * vested_ratio)

    unvested_shares = total_founder_shares - vested_shares

    # Double-Trigger Acceleration Evaluation
    # Trigger 1: Change of Control (Acquisition)
    # Trigger 2: Involuntary Termination without Cause within 12 months
    double_trigger_activated = company_acquired and founder_terminated_without_cause

    if double_trigger_activated:
        accelerated_shares = unvested_shares
        final_vested_shares = total_founder_shares
        acceleration_status = "DOUBLE_TRIGGER_EXECUTED_100_PCT_ACCELERATION"
    else:
        accelerated_shares = 0
        final_vested_shares = vested_shares
        acceleration_status = "STANDARD_MONTHLY_VESTING_PACING"

    liquidity_value = final_vested_shares * exit_share_price

    return {
        "Total_Founder_Shares": total_founder_shares,
        "Months_Elapsed": months_elapsed,
        "Base_Vested_Shares": vested_shares,
        "Double_Trigger_Activated": double_trigger_activated,
        "Accelerated_Shares": accelerated_shares,
        "Final_Payable_Shares": final_vested_shares,
        "Total_Proceeds_Dollars": round(liquidity_value, 2),
        "Acceleration_Status": acceleration_status
    }

vest_res = calculate_founder_vesting_and_acceleration(
    total_founder_shares=4000000,
    months_elapsed=24, # 50% vested base
    company_acquired=True,
    founder_terminated_without_cause=True,
    exit_share_price=8.0
)
print(f"Months: {vest_res['Months_Elapsed']} | Base Vested: {vest_res['Base_Vested_Shares']} shares")
print(f"Double-Trigger: {vest_res['Acceleration_Status']} -> Final: {vest_res['Final_Payable_Shares']} shares (\${vest_res['Total_Proceeds_Dollars']})")`,
        output: `Months: 24 | Base Vested: 2000000 shares\nDouble-Trigger: DOUBLE_TRIGGER_EXECUTED_100_PCT_ACCELERATION -> Final: 4000000 shares ($32000000.0)`,
        tryIt: 'Set founder_terminated_without_cause=False to observe standard vesting pacing without acceleration when the founder remains happily employed post-acquisition.',
        check: {
          question: 'Under what specific conditions does a standard Double-Trigger Equity Acceleration clause trigger 100% vesting of a founder or executive unvested stock?',
          options: [
            '(Recommended) Both a change of control (acquisition) occurs AND the founder is involuntarily terminated without cause (or constructive termination) within a defined post-closing window.',
            'Only when the company completes an initial public offering (IPO) on a major global stock exchange.',
            'Whenever the board of directors votes to replace the Chief Technology Officer during normal business operations.',
            'Immediately upon signing a non-binding term sheet with an interested prospective acquirer.'
          ],
          answer: 0,
          why: 'Double-trigger requires both Trigger 1 (Change of Control) and Trigger 2 (Involuntary termination without cause within 12-24 months), protecting the executive from being purged post-deal while reassuring acquirers that un-terminated executives will stay.',
          answerIndex: 0,
          explanation: 'Double-trigger requires both Trigger 1 (Change of Control) and Trigger 2 (Involuntary termination without cause within 12-24 months), protecting the executive from being purged post-deal while reassuring acquirers that un-terminated executives will stay.'
        }
      }
    ],
    summary: [
      'Venture debt provides non-dilutive runway extension structured as senior loans with interest-only periods and 5-10% warrant coverage.',
      'IRC Section 409A appraisals establish independent Fair Market Value strike prices for common stock options, shielding employees from 20% excise tax penalties.',
      'Secondary stock sales are governed by Rights of First Refusal (ROFR), enabling the company and primary VCs to preserve cap table control before shares transfer to third parties.',
      'Down-round anti-dilution adjusts conversion prices to protect early investors; Broad-Based Weighted Average cushions dilution while Full Ratchet severely erodes founder ownership.',
      'Founder vesting with Section 83(b) tax elections and double-trigger M&A acceleration protects both company equity stability and founder exit upside.'
    ],
    projectStep: {
      title: 'Advanced Venture Financing & Governance Engine',
      steps: [
        'Model venture debt amortizations and warrant coverage equity dilution tradeoffs.',
        'Calculate 409A option strike prices applying lack of marketability discounts against preferred stock breakpoints.',
        'Simulate secondary share transfer workflows through company and investor ROFR gates.',
        'Contrast broad-based weighted average versus full ratchet dilution impacts in severe down-rounds.'
      ]
    }
  },
  {
    coursePrefix: 'bcom_ent',
    day: 3,
    title: 'Venture Capital Term Sheets, Valuation Mechanics & Down-Round Anti-Dilution',
    overview: 'Master the legal and financial engineering of institutional venture capital term sheets. You will expose the true economics of the option pool shuffle, model liquidation preference waterfalls across non-participating and participating structures, calculate down-round anti-dilution adjustments contrasting Full Ratchet with Broad-Based Weighted Average formulas, audit NVCA protective provisions and board governance dynamics, and build an integrated term sheet negotiation control tower.',
    parts: [
      {
        title: 'Pre-Money vs Post-Money Valuation Mechanics & Option Pool Shuffle',
        say: [
          'In venture capital financing rounds, founders often focus exclusively on the headline pre-money valuation, celebrating high paper valuations without understanding the subtle contractual mechanics that quietly dilute their equity. The fundamental mathematical relationship is deceptively simple: Post-Money Valuation = Pre-Money Valuation + Investment Amount. For example, a $5,000,000 investment on a $20,000,000 pre-money valuation creates a $25,000,000 post-money valuation, indicating on paper that the incoming investor will own 20% while existing shareholders retain 80%.',
          'However, venture capital term sheets almost universally include a clause requiring the startup to create an unallocated Employee Stock Ownership Plan (ESOP) option pool prior to financing—typically 10% to 15% of post-money capitalization. In the notorious "Option Pool Shuffle," the term sheet specifies that this pool must be created out of the pre-money capitalization. Because the option pool is expanded entirely before the investor checks clear, 100% of the dilution required to create the pool is borne by the existing founders, while the investor\'s 20% ownership remains pristine.',
          'To calculate the real economic impact, the founder must compute the Effective Founder Pre-Money Valuation by subtracting the dollar value of the unallocated pool ($3,750,000 for a 15% pool) from the stated pre-money valuation ($20,000,000). The resulting effective pre-money valuation is only $16,250,000, diluting founders from an expected 80.0% down to 65.0% ownership. Astute founders negotiate to right-size the option pool based on an explicit 12-month hiring plan rather than accepting arbitrary 15% to 20% buffers, preserving millions in founder equity value.'
        ],
        example: 'On a $20,000,000 pre-money valuation with a $5,000,000 investment, a required 15% unallocated ESOP pool ($3,750,000) created in the pre-money reduces the founder\'s effective pre-money to $16,250,000, leaving founders with 65.0% post-round ownership instead of 80.0%.',
        code: `def calculate_option_pool_shuffle():
    stated_pre_money = 20000000.0  # $20,000,000 stated pre-money
    investment_amount = 5000000.0   # $5,000,000 Series A investment
    post_money = stated_pre_money + investment_amount # $25,000,000

    esop_target_pct = 0.15 # 15% post-money unallocated option pool demanded
    esop_dollar_val = post_money * esop_target_pct # $3,750,000

    # Under standard term sheet, the 15% pool is created in PRE-MONEY
    effective_founder_pre_money = stated_pre_money - esop_dollar_val # $16,250,000
    founder_pre_ownership = stated_pre_money / post_money # 80.0%
    founder_actual_ownership = effective_founder_pre_money / post_money # 65.0%
    investor_ownership = investment_amount / post_money # 20.0%

    print("Venture Capital Option Pool Shuffle Mechanics:")
    print("  Stated Pre-Money Valuation: " + "$" + f"{stated_pre_money:,.2f}")
    print("  Series A Investment: " + "$" + f"{investment_amount:,.2f}")
    print("  Post-Money Valuation: " + "$" + f"{post_money:,.2f}")
    print(f"  Unallocated ESOP Pool Required: {esop_target_pct*100:.1f}% (" + "$" + f"{esop_dollar_val:,.2f}" + ")")
    print("  Effective Founder Pre-Money Valuation: " + "$" + f"{effective_founder_pre_money:,.2f}")
    print(f"  Investor Ownership: {investor_ownership*100:.1f}%")
    print(f"  Unallocated Option Pool: {esop_target_pct*100:.1f}%")
    print(f"  Founder Effective Post-Round Ownership: {founder_actual_ownership*100:.1f}% (Diluted by {founder_pre_ownership*100 - founder_actual_ownership*100:.1f}%)")
    return {"effective_pre": effective_founder_pre_money, "founder_pct": founder_actual_ownership}

calculate_option_pool_shuffle()`,
        output: `Venture Capital Option Pool Shuffle Mechanics:
  Stated Pre-Money Valuation: $20,000,000.00
  Series A Investment: $5,000,000.00
  Post-Money Valuation: $25,000,000.00
  Unallocated ESOP Pool Required: 15.0% ($3,750,000.00)
  Effective Founder Pre-Money Valuation: $16,250,000.00
  Investor Ownership: 20.0%
  Unallocated Option Pool: 15.0%
  Founder Effective Post-Round Ownership: 65.0% (Diluted by 15.0%)`,
        codeNotes: [
          'Calculates the standard post-money valuation ($25.0M) from pre-money ($20.0M) and investment ($5.0M).',
          'Demonstrates how establishing a 15% unallocated option pool out of pre-money reduces effective founder valuation by $3.75M.',
          'Quantifies founder ownership compression from 80.0% down to 65.0% due to the pre-money option pool creation.'
        ],
        tryIt: 'Negotiate the option pool down from 15% to 10% to observe founder post-round ownership recover to 70.0% ($1.25M in founder equity preserved).',
        check: {
          question: 'What is the economic consequence of creating an unallocated employee option pool in the pre-money valuation rather than the post-money valuation?',
          options: [
            'Existing founders absorb 100% of the dilution required to create the pool, effectively reducing the true pre-money valuation paid by the new investor',
            'The incoming venture capital fund pays double the agreed share price to fund employee bonuses',
            'All existing company employees immediately forfeit their vested common stock',
            'The IRS imposes a 50% excise tax penalty on all stock option grants'
          ],
          answer: 0,
          why: 'Creating the option pool in the pre-money forces existing shareholders to bear the entire dilution burden, effectively discounting the price-per-share paid by the new investor.',
          answerIndex: 0,
          explanation: 'Creating the option pool in the pre-money forces existing shareholders to bear the entire dilution burden, effectively discounting the price-per-share paid by the new investor.'
        }
      },
      {
        title: 'Preferred Stock Liquidation Preferences & Participation Rights',
        say: [
          'Venture capitalists rarely purchase common stock alongside founders; instead, they purchase Preferred Stock structured with liquidation preferences to protect their downside capital. A liquidation preference dictates the order and magnitude of cash distributions when a startup undergoes a liquidity event, such as a merger, trade sale, or asset liquidation. Under the standard National Venture Capital Association (NVCA) model, a 1x Non-Participating Preferred stock grants the investor the right to receive either their original investment back OR convert their preferred shares into common stock to share pro-rata in exit proceeds, whichever is higher.',
          'In contrast, aggressive investor term sheets sometimes introduce Participating Preferred stock (derided by entrepreneurs as "double-dipping"). In a 1x Fully Participating Preferred structure, the investor receives their full 1x original investment back FIRST, and then participates alongside common stockholders in the remaining exit proceeds according to their pro-rata ownership percentage. In distressed or modest exit scenarios, participating preferred severely depresses founder payouts.',
          'For instance, on a $5,000,000 Series A investment for 20% ownership, if the company is sold for $12,000,000, a non-participating investor takes their $5,000,000 preference, leaving $7,000,000 for founders. However, under participating preferred, the investor takes $5,000,000 plus 20% of the remaining $7,000,000 ($1.4M), extracting $6,400,000 total and shrinking the founder payout to $5,600,000. In high-value unicorn exits (e.g. $100M), preferred shares automatically convert to common, aligning investor and founder incentives.'
        ],
        example: 'At a $12M exit on a $5M Series A (20% ownership), 1x Non-Participating yields $5.0M to the investor and $7.0M to founders. A 1x Fully Participating structure extracts $6.4M for the investor ($5M preference + 20% of $7M remaining), slashing founder proceeds to $5.6M.',
        code: `def evaluate_liquidation_preference_structures():
    # Series A invested $5,000,000 for 20% preferred stock
    invested_amount = 5000000.0
    ownership_pct = 0.20
    exit_valuations = [12000000.0, 30000000.0, 100000000.0]

    print("Liquidation Preference Waterfall Comparison (1x Non-Participating vs 1x Participating):")
    print(f"  {'Exit Value':<15} | {'1x Non-Participating (Preferred vs Common)':<42} | {'1x Fully Participating':<25}")
    print("  " + "-" * 88)

    results = []
    for exit_val in exit_valuations:
        # 1. 1x Non-Participating: Max of (1x Preference, As-Converted Share)
        as_converted_pref = exit_val * ownership_pct
        if as_converted_pref > invested_amount:
            non_part_pref = as_converted_pref
            non_part_founder = exit_val - non_part_pref
            choice = "CONVERTED"
        else:
            non_part_pref = min(invested_amount, exit_val)
            non_part_founder = max(0.0, exit_val - non_part_pref)
            choice = "PREFERENCE"

        # 2. 1x Fully Participating: 1x Preference + 20% of Remaining Proceeds
        part_pref = min(invested_amount, exit_val)
        remaining = max(0.0, exit_val - part_pref)
        part_pref += remaining * ownership_pct
        part_founder = exit_val - part_pref

        print(f"  " + "$" + f"{exit_val:<14,.0f} | Investor: " + "$" + f"{non_part_pref:,.0f}" + f" ({choice}) / Founder: " + "$" + f"{non_part_founder:,.0f} | Investor: " + "$" + f"{part_pref:,.0f}" + " / Founder: " + "$" + f"{part_founder:,.0f}")
        results.append({"exit": exit_val, "non_part_investor": non_part_pref, "part_investor": part_pref})

    return results

evaluate_liquidation_preference_structures()`,
        output: `Liquidation Preference Waterfall Comparison (1x Non-Participating vs 1x Participating):
  Exit Value      | 1x Non-Participating (Preferred vs Common) | 1x Fully Participating   
  ----------------------------------------------------------------------------------------
  $12,000,000     | Investor: $5,000,000 (PREFERENCE) / Founder: $7,000,000 | Investor: $6,400,000 / Founder: $5,600,000
  $30,000,000     | Investor: $6,000,000 (CONVERTED) / Founder: $24,000,000 | Investor: $10,000,000 / Founder: $20,000,000
  $100,000,000    | Investor: $20,000,000 (CONVERTED) / Founder: $80,000,000 | Investor: $24,000,000 / Founder: $76,000,000`,
        codeNotes: [
          'Models exit waterfalls across $12M, $30M, and $100M liquidity outcomes.',
          'Demonstrates that non-participating preferred chooses the higher of 1x preference or as-converted common share.',
          'Illustrates how participating preferred extracts an additional $1.4M to $4.0M in proceeds directly from founder equity.'
        ],
        tryIt: 'Examine a $6,000,000 downside fire sale exit to see non-participating preferred consume $5.0M (83.3% of proceeds), leaving only $1.0M for common holders.',
        check: {
          question: 'What happens to a 1x Non-Participating Preferred stock in an acquisition where the investor\'s as-converted common stock value exceeds their initial investment?',
          options: [
            'The investor automatically converts their preferred shares into common stock to receive their higher pro-rata percentage of exit proceeds',
            'The investor is legally required to return all initial invested capital back to the founders',
            'The investor receives both their 1x preference AND their full common stock percentage',
            'The preferred stock is cancelled by Delaware courts without any distribution'
          ],
          answer: 0,
          why: 'Under non-participating preferred, investors choose whichever payout is greater: their 1x liquidation preference or converting to common stock to share pro-rata.',
          answerIndex: 0,
          explanation: 'Under non-participating preferred, investors choose whichever payout is greater: their 1x liquidation preference or converting to common stock to share pro-rata.'
        }
      },
      {
        title: 'Down-Round Protection: Broad-Based Weighted Average vs Full Ratchet Anti-Dilution',
        say: [
          'When market valuations contract or a startup misses revenue milestones, it may be forced to raise capital at a lower valuation than its previous financing round—an event known in venture capital as a "Down-Round." To protect early investors from value destruction, preferred stock agreements include anti-dilution provisions that dynamically adjust the price at which preferred shares convert into common stock, issuing compensatory bonus shares to the investor.',
          'The two primary mechanisms for anti-dilution adjustments are Full Ratchet and Broad-Based Weighted Average. Full Ratchet is the most punitive clause in venture finance: it reprices the original investor\'s shares entirely to the new down-round price, regardless of how small the new round is. If Series A invested $5,000,000 at $10.00/share and Series B is priced at $5.00/share, Full Ratchet cuts the Series A conversion price directly to $5.00, instantly doubling the investor\'s share count from 500,000 to 1,000,000 shares and wiping out founder equity.',
          'The NVCA market standard is Broad-Based Weighted Average anti-dilution, which factors in both the price of the new round and the magnitude of capital raised relative to the company\'s fully diluted capitalization. The formula is expressed as CP2 = CP1 * (A + B) / (A + C), where A is pre-round fully diluted shares (2,500,000), B is shares that would have been purchased at the old price ($3M / $10 = 300,000), and C is actual new shares issued (600,000). This adjusts the conversion price moderately to $9.0323, granting Series A 553,571 shares (+53,571 shares or +10.7%) rather than doubling their ownership, protecting founders from wipeout dilution.'
        ],
        example: 'Series A holds 500,000 shares at $10.00 in a 2.5M share company. Raising $3.0M at $5.00 triggers Full Ratchet to double Series A to 1,000,000 shares (+100% dilution), whereas Broad-Based Weighted Average adjusts the price to $9.0323, granting 553,571 shares (+10.7% dilution).',
        code: `def calculate_down_round_anti_dilution():
    # Series A: Invested $5,000,000 at $10.00/share (500,000 shares)
    # Total pre-Series B capitalization: 2,500,000 fully diluted shares
    # Series B Down-Round: Raising $3,000,000 at $5.00/share (600,000 new shares)
    cp1 = 10.00  # Original Series A Conversion Price
    shares_a = 500000
    fully_diluted_pre = 2500000
    new_money = 3000000.0
    new_price = 5.00
    new_shares = new_money / new_price # 600,000 shares

    # 1. Full Ratchet: Conversion price immediately drops to new price
    full_ratchet_cp = new_price # $5.00
    full_ratchet_shares = (shares_a * cp1) / full_ratchet_cp # 1,000,000 shares (+500k shares)

    # 2. Broad-Based Weighted Average: CP2 = CP1 * (A + B) / (A + C)
    # A = Fully diluted shares before round = 2,500,000
    # B = Shares that would have been purchased at old price = $3,000,000 / $10.00 = 300,000
    # C = Actual shares purchased at new price = 600,000
    a = fully_diluted_pre
    b = new_money / cp1 # 300,000
    c = new_shares      # 600,000
    bb_cp = cp1 * ((a + b) / (a + c)) # $10.00 * (2.8M / 3.1M) = $9.0323
    bb_shares = (shares_a * cp1) / bb_cp # ~553,571 shares (+53,571 shares)

    print("Down-Round Anti-Dilution Adjustment Comparison:")
    print(f"  Original Series A: {shares_a:,} shares at " + "$" + f"{cp1:.2f} / share")
    print(f"  Series B Down-Round: Raised " + "$" + f"{new_money:,.0f} at " + "$" + f"{new_price:.2f} / share ({new_shares:,.0f} shares)")
    print(f"  1. Full Ratchet Protection:")
    print(f"     Adjusted Conversion Price: " + "$" + f"{full_ratchet_cp:.2f}")
    print(f"     Adjusted Series A Shares: {full_ratchet_shares:,.0f} (+{full_ratchet_shares - shares_a:,.0f} shares, +100.0% dilution protection)")
    print(f"  2. Broad-Based Weighted Average Protection:")
    print(f"     Adjusted Conversion Price: " + "$" + f"{bb_cp:.4f}")
    print(f"     Adjusted Series A Shares: {bb_shares:,.0f} (+{bb_shares - shares_a:,.0f} shares, +10.7% dilution protection)")
    return {"full_ratchet_cp": full_ratchet_cp, "broad_based_cp": bb_cp}

calculate_down_round_anti_dilution()`,
        output: `Down-Round Anti-Dilution Adjustment Comparison:
  Original Series A: 500,000 shares at $10.00 / share
  Series B Down-Round: Raised $3,000,000 at $5.00 / share (600,000 shares)
  1. Full Ratchet Protection:
     Adjusted Conversion Price: $5.00
     Adjusted Series A Shares: 1,000,000 (+500,000 shares, +100.0% dilution protection)
  2. Broad-Based Weighted Average Protection:
     Adjusted Conversion Price: $9.0323
     Adjusted Series A Shares: 553,571 (+53,571 shares, +10.7% dilution protection)`,
        codeNotes: [
          'Calculates Full Ratchet by setting conversion price directly equal to the new $5.00 round price, doubling investor shares.',
          'Applies the NVCA Broad-Based Weighted Average formula CP2 = CP1 * (A + B) / (A + C) to calculate $9.0323.',
          'Shows that Broad-Based Weighted Average limits Series A share expansion to +53,571 shares, mitigating catastrophic founder dilution.'
        ],
        tryIt: 'Raise the down-round price from $5.00 to $8.00 to see Broad-Based conversion price moderate to $9.6429 (+18,519 shares).',
        check: {
          question: 'Why is Broad-Based Weighted Average anti-dilution vastly preferred by founders over Full Ratchet anti-dilution?',
          options: [
            'Because Broad-Based accounts for the dollar amount raised and total capitalization, mitigating dilution, whereas Full Ratchet resets the price entirely regardless of round size',
            'Because Full Ratchet requires the founders to pay cash out of their personal bank accounts to the investors',
            'Because Broad-Based anti-dilution is only allowed for companies incorporated in Delaware',
            'Because Full Ratchet eliminates all preferred stock and forces venture capitalists to accept debt notes'
          ],
          answer: 0,
          why: 'Full Ratchet ignores the size of the round and resets the conversion price directly to the lowest issued price, creating severe dilution; Broad-Based cushions dilution proportionally.',
          answerIndex: 0,
          explanation: 'Full Ratchet ignores the size of the round and resets the conversion price directly to the lowest issued price, creating severe dilution; Broad-Based cushions dilution proportionally.'
        }
      },
      {
        title: 'Corporate Governance: Board Control, Protective Provisions & Drag-Along Rights',
        say: [
          'Economic terms determine who gets paid in an exit, but governance terms dictate who controls the company\'s destiny on a day-to-day basis. Founders often surrender corporate control without realizing it by agreeing to unbalanced board seats, sweeping veto rights, and predatory transfer clauses. In standard Series A financings, the Board of Directors typically expands to five members: two Founder seats, two Investor seats, and one mutually agreed Independent industry expert, establishing a balanced decision-making coalition.',
          'Venture investors protect their minority equity interests through Protective Provisions—contractual negative covenants requiring separate majority approval from preferred stockholders before the company can take significant corporate actions. Standard NVCA protective provisions restrict the startup from altering certificate of incorporation terms, creating or issuing senior equity, incurring debt exceeding agreed thresholds (e.g. >$500,000), repurchasing common shares, or declaring dividends.',
          'Crucially, term sheets govern exit liquidity through Drag-Along and Tag-Along rights. Drag-Along rights enable a designated majority (typically Board approval, a majority of Preferred, and a majority of Common) to force minority stockholders to vote in favor of a corporate sale or merger, preventing holdout shareholders from blocking an acquisition. Tag-Along (co-sale) rights protect minority investors by guaranteeing them the right to participate pro-rata if founders sell their personal shares on secondary markets.'
        ],
        example: 'Auditing an NVCA term sheet confirms a balanced 5-person board (2 Founder, 2 Investor, 1 Independent), standard Series A veto rights on M&A and debt >$500k, a founder-protected drag-along threshold (Common + Preferred majority), and standard major investor information rights.',
        code: `def audit_nvca_governance_scorecard():
    terms = [
        {"clause": "Board Composition", "nvca_standard": "2 Founder, 2 Investor, 1 Independent", "status": "APPROVED", "risk": "BALANCED"},
        {"clause": "Protective Provisions", "nvca_standard": "Series A majority approval for M&A, debt >$500k, senior stock", "status": "APPROVED", "risk": "STANDARD"},
        {"clause": "Drag-Along Threshold", "nvca_standard": "Board + Common Majority + Series A Majority required", "status": "APPROVED", "risk": "FOUNDER_PROTECTED"},
        {"clause": "Information Rights", "nvca_standard": "Major investors (>10% ownership) receive monthly financials & annual budget", "status": "APPROVED", "risk": "STANDARD"}
    ]

    print("NVCA Term Sheet Corporate Governance & Protective Provisions Audit:")
    for t in terms:
        print(f"  {t['clause']:<22} | Standard: {t['nvca_standard']:<40} | Status: {t['status']} ({t['risk']})")

    return {"total_clauses": len(terms), "status": "GOVERNANCE_COMPLIANT"}

audit_nvca_governance_scorecard()`,
        output: `NVCA Term Sheet Corporate Governance & Protective Provisions Audit:
  Board Composition      | Standard: 2 Founder, 2 Investor, 1 Independent     | Status: APPROVED (BALANCED)
  Protective Provisions  | Standard: Series A majority approval for M&A, debt >$500k, senior stock | Status: APPROVED (STANDARD)
  Drag-Along Threshold   | Standard: Board + Common Majority + Series A Majority required | Status: APPROVED (FOUNDER_PROTECTED)
  Information Rights     | Standard: Major investors (>10% ownership) receive monthly financials & annual budget | Status: APPROVED (STANDARD)`,
        codeNotes: [
          'Evaluates corporate board composition against the balanced 2-2-1 NVCA structure.',
          'Verifies standard preferred protective provisions limiting unapproved M&A and debt incurrence.',
          'Ensures drag-along clauses require common stockholder consent to prevent unilateral investor fire sales.'
        ],
        tryIt: 'Simulate an investor-favorable drag-along clause requiring only Preferred majority approval to analyze founder vulnerability.',
        check: {
          question: 'What is the function of a Drag-Along clause in a venture capital stockholders\' agreement?',
          options: [
            'It enables a specified majority of shareholders to force all other shareholders to vote in favor of and execute a board-approved company sale',
            'It allows founders to drag investors to court for failing to provide marketing referrals',
            'It prevents the company from hiring external legal counsel without state approval',
            'It forces sales representatives to attend every board meeting in person'
          ],
          answer: 0,
          why: 'Drag-along rights prevent a minority holdout from vetoing or blocking an acquisition that has been approved by the board and the specified majority of shareholders.',
          answerIndex: 0,
          explanation: 'Drag-along rights prevent a minority holdout from vetoing or blocking an acquisition that has been approved by the board and the specified majority of shareholders.'
        }
      },
      {
        title: 'Deploy the Venture Capital Term Sheet Control Tower',
        say: [
          'Venture capital negotiations are an exercise in multi-variable game theory. Evaluating a term sheet requires synthesizing valuation, option pool mechanics, downside liquidation preferences, anti-dilution protections, and board governance provisions into a single coherent capital strategy.',
          'In this operational capstone module, you will deploy the complete Venture Capital Term Sheet Control Tower. You will audit the option pool shuffle to uncover effective pre-money valuations, model liquidation preferences across exit horizons, simulate down-round anti-dilution dilution formulas, and audit corporate governance provisions.',
          'Deploying this control tower empowers entrepreneurs and venture finance leaders to negotiate term sheets from a position of analytical strength, safeguarding founder ownership and establishing sustainable boardroom partnerships.'
        ],
        example: 'The team analyzes a $20M pre-money term sheet ($16.25M effective founder valuation), confirms non-participating preferred protections across $12M to $100M exits, verifies Broad-Based anti-dilution at $9.0323, and audits 4 balanced NVCA governance clauses.',
        code: `def run_venture_capital_term_sheet_suite():
    print("=== PinIT Career OS Venture Capital Term Sheet Control Tower ===")
    print("--- 1. Pre/Post-Money & Option Pool Shuffle ---")
    shuf = calculate_option_pool_shuffle()

    print("\n--- 2. Liquidation Preference Structures ---")
    liq = evaluate_liquidation_preference_structures()

    print("\n--- 3. Down-Round Anti-Dilution Modeling ---")
    ad = calculate_down_round_anti_dilution()

    print("\n--- 4. NVCA Corporate Governance Scorecard ---")
    gov = audit_nvca_governance_scorecard()

    print("\n--- 5. VC Term Sheet Synthesis ---")
    print("  Effective Founder Pre-Money: " + "$" + f"{shuf['effective_pre']:,.2f}")
    print(f"  Broad-Based Weighted Average Conversion Price: " + "$" + f"{ad['broad_based_cp']:.4f}")
    print(f"  NVCA Governance Clauses Audited: {gov['total_clauses']} (All Compliant)")
    print("Status: TERM SHEET FINANCIAL & LEGAL GOVERNANCE READY FOR PARTNER VOTE.")

run_venture_capital_term_sheet_suite()`,
        output: `=== PinIT Career OS Venture Capital Term Sheet Control Tower ===
--- 1. Pre/Post-Money & Option Pool Shuffle ---
Venture Capital Option Pool Shuffle Mechanics:
  Stated Pre-Money Valuation: $20,000,000.00
  Series A Investment: $5,000,000.00
  Post-Money Valuation: $25,000,000.00
  Unallocated ESOP Pool Required: 15.0% ($3,750,000.00)
  Effective Founder Pre-Money Valuation: $16,250,000.00
  Investor Ownership: 20.0%
  Unallocated Option Pool: 15.0%
  Founder Effective Post-Round Ownership: 65.0% (Diluted by 15.0%)

--- 2. Liquidation Preference Structures ---
Liquidation Preference Waterfall Comparison (1x Non-Participating vs 1x Participating):
  Exit Value      | 1x Non-Participating (Preferred vs Common) | 1x Fully Participating   
  ----------------------------------------------------------------------------------------
  $12,000,000     | Investor: $5,000,000 (PREFERENCE) / Founder: $7,000,000 | Investor: $6,400,000 / Founder: $5,600,000
  $30,000,000     | Investor: $6,000,000 (CONVERTED) / Founder: $24,000,000 | Investor: $10,000,000 / Founder: $20,000,000
  $100,000,000    | Investor: $20,000,000 (CONVERTED) / Founder: $80,000,000 | Investor: $24,000,000 / Founder: $76,000,000

--- 3. Down-Round Anti-Dilution Modeling ---
Down-Round Anti-Dilution Adjustment Comparison:
  Original Series A: 500,000 shares at $10.00 / share
  Series B Down-Round: Raised $3,000,000 at $5.00 / share (600,000 shares)
  1. Full Ratchet Protection:
     Adjusted Conversion Price: $5.00
     Adjusted Series A Shares: 1,000,000 (+500,000 shares, +100.0% dilution protection)
  2. Broad-Based Weighted Average Protection:
     Adjusted Conversion Price: $9.0323
     Adjusted Series A Shares: 553,571 (+53,571 shares, +10.7% dilution protection)

--- 4. NVCA Corporate Governance Scorecard ---
NVCA Term Sheet Corporate Governance & Protective Provisions Audit:
  Board Composition      | Standard: 2 Founder, 2 Investor, 1 Independent     | Status: APPROVED (BALANCED)
  Protective Provisions  | Standard: Series A majority approval for M&A, debt >$500k, senior stock | Status: APPROVED (STANDARD)
  Drag-Along Threshold   | Standard: Board + Common Majority + Series A Majority required | Status: APPROVED (FOUNDER_PROTECTED)
  Information Rights     | Standard: Major investors (>10% ownership) receive monthly financials & annual budget | Status: APPROVED (STANDARD)

--- 5. VC Term Sheet Synthesis ---
  Effective Founder Pre-Money: $16,250,000.00
  Broad-Based Weighted Average Conversion Price: $9.0323
  NVCA Governance Clauses Audited: 4 (All Compliant)
Status: TERM SHEET FINANCIAL & LEGAL GOVERNANCE READY FOR PARTNER VOTE.`,
        codeNotes: [
          'Unifies option pool valuation impacts, liquidation waterfalls, down-round anti-dilution, and NVCA governance.',
          'Demonstrates how mathematical rigor in term sheet evaluation protects millions in founder capitalization.',
          'Prepares entrepreneurs for institutional venture capital partner presentations and legal term sheet execution.'
        ],
        tryIt: 'Run the integrated term sheet control tower to evaluate trade-offs between valuation, liquidation preference, and governance clauses.',
        check: {
          question: 'How do sophisticated startup founders evaluate competing venture capital term sheets beyond top-line valuation?',
          options: [
            'By analyzing option pool size and placement, liquidation preference participation rights, anti-dilution formulas, and board governance control thresholds',
            'By choosing whichever venture capitalist offers the highest discount on office snacks',
            'By refusing to sign any legal agreements and accepting only physical cash investments',
            'By granting all voting control to junior angel investors'
          ],
          answer: 0,
          why: 'True deal economics depend heavily on the option pool shuffle, liquidation preferences (participating vs non-participating), anti-dilution provisions, and board composition rather than stated valuation alone.',
          answerIndex: 0,
          explanation: 'True deal economics depend heavily on the option pool shuffle, liquidation preferences (participating vs non-participating), anti-dilution provisions, and board composition rather than stated valuation alone.'
        }
      }
    ],
    summary: [
      'Unmasked the mechanics of the VC Option Pool Shuffle, showing how a 15% pre-money unallocated ESOP pool reduces effective founder pre-money from $20.0M to $16.25M and founder ownership from 80% to 65%.',
      'Compared preferred liquidation preferences across $12M, $30M, and $100M exits, demonstrating that 1x Non-Participating Preferred protects downside while participating preferred extracts $1.4M to $4.0M in excess founder proceeds.',
      'Calculated down-round anti-dilution formulas, contrasting punitive Full Ratchet (doubling Series A to 1,000,000 shares) with NVCA standard Broad-Based Weighted Average (adjusting conversion price to $9.0323, +53,571 shares).',
      'Audited NVCA corporate governance standards, verifying balanced 2-2-1 board composition, protective provision vetoes on M&A and debt >$500k, and common-shareholder-protected drag-along thresholds.',
      'Deployed the Venture Capital Term Sheet Control Tower, providing an end-to-end analytical framework for evaluating, negotiating, and executing venture capital term sheets.'
    ],
    projectStep: {
      title: 'Deploy the Venture Capital Term Sheet Modeling & Negotiation Engine',
      steps: [
        'Calculate true effective founder pre-money valuations by modeling pre-money option pool expansion requirements.',
        'Build a multi-scenario liquidation preference waterfall comparing non-participating and participating preferred outcomes.',
        'Model down-round anti-dilution adjustments using Broad-Based Weighted Average and Full Ratchet formulas.',
        'Audit corporate governance terms, protective provisions, and drag-along thresholds against NVCA market standards.'
      ]
    }
  }
];
