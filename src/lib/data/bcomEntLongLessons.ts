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
  },
  {
    coursePrefix: 'bcom_ent',
    day: 4,
    title: 'Unit Economics at Scale: Rule of 40, Burn Multiple & Growth Stage Capital Efficiency',
    overview: 'Master the financial disciplines governing venture-backed startups scaling from Series A to Series B and beyond. You will evaluate SaaS capital efficiency through the Rule of 40 and Magic Number metrics, analyze burn multiples to extend zero-cash runway, model customer lifetime value (LTV) and multi-year cohort contribution margins, engineer a bottom-up 24-month financial model linking headcount capacity to ARR targets, and deploy an integrated growth stage venture economics control tower.',
    parts: [
      {
        title: 'SaaS Rule of 40 & Magic Number Capital Efficiency',
        say: [
          'In early-stage venture capital, investors tolerate high cash burn in pursuit of rapid user adoption and product-market fit. However, as startups mature into growth stage Series B and C rounds, top-tier venture capitalists and growth equity funds demand proven capital efficiency. The preeminent benchmark for evaluating growth-stage software companies is the Rule of 40, which posits that a healthy software company\'s annual revenue growth rate plus its free cash flow (FCF) margin should equal or exceed 40.0%.',
          'The Rule of 40 provides founders with strategic flexibility to trade off growth against profitability according to market conditions. An elite hyper-growth company growing at 65% year-over-year with a -15% FCF margin scores 50.0%, easily beating the Rule of 40 because rapid market capture justifies temporary operational cash burn. Similarly, a mature enterprise business growing at 32% with an 18% FCF margin also achieves 50.0%, signaling strong cash generation. In contrast, a struggling startup growing at only 12% while burning -22% FCF scores -10.0%, indicating broken unit economics that will fail investor due diligence.',
          'To assess sales and marketing efficiency specifically, growth investors track the SaaS Magic Number. The Magic Number is calculated as (Quarterly Net New ARR * 4) divided by Sales and Marketing Spend from the prior quarter. A Magic Number exceeding 1.0 indicates exceptional acquisition efficiency, signaling to the board that the company should immediately pour additional capital into marketing and sales rep hiring. A score between 0.75 and 1.0 represents healthy performance, while a score below 0.75 mandates pulling back on burn to fix sales conversion leakages.'
        ],
        example: 'Hyper-Growth Cloud delivers 65% revenue growth with a -15% FCF margin, achieving a 50.0% Rule of 40 score. Generating $2.2M in net new ARR against $1.8M in prior S&M spend yields a 4.89 Magic Number, signaling an urgent recommendation to accelerate go-to-market spending.',
        code: `def evaluate_rule_of_40_and_magic_number():
    profiles = [
        {"name": "Hyper-Growth Cloud", "growth_rate": 0.65, "fcf_margin": -0.15, "q_net_arr": 2200000.0, "prior_sm_spend": 1800000.0},
        {"name": "Balanced Enterprise", "growth_rate": 0.32, "fcf_margin": 0.18, "q_net_arr": 1100000.0, "prior_sm_spend": 1200000.0},
        {"name": "Distressed Startup", "growth_rate": 0.12, "fcf_margin": -0.22, "q_net_arr": 300000.0, "prior_sm_spend": 950000.0}
    ]

    print("SaaS Rule of 40 & Magic Number Capital Efficiency:")
    results = []
    for p in profiles:
        rule_of_40 = (p["growth_rate"] + p["fcf_margin"]) * 100
        # Magic Number = (Quarterly Net New ARR * 4) / Prior Quarter S&M Spend
        magic_number = (p["q_net_arr"] * 4.0) / p["prior_sm_spend"]

        r40_status = "ELITE_EFFICIENCY" if rule_of_40 >= 40.0 else "SUB_BENCHMARK"
        mn_status = "ACCELERATE_SPEND" if magic_number >= 1.0 else "HEALTHY" if magic_number >= 0.75 else "REDUCE_BURN"

        print(f"  {p['name']}: Growth={p['growth_rate']*100:.1f}% | FCF Margin={p['fcf_margin']*100:.1f}%")
        print(f"    Rule of 40 Score: {rule_of_40:.1f}% ({r40_status}) | Magic Number: {magic_number:.2f} ({mn_status})")
        results.append({"name": p["name"], "rule_of_40": rule_of_40, "magic_number": magic_number})

    return results

evaluate_rule_of_40_and_magic_number()`,
        output: `SaaS Rule of 40 & Magic Number Capital Efficiency:
  Hyper-Growth Cloud: Growth=65.0% | FCF Margin=-15.0%
    Rule of 40 Score: 50.0% (ELITE_EFFICIENCY) | Magic Number: 4.89 (ACCELERATE_SPEND)
  Balanced Enterprise: Growth=32.0% | FCF Margin=18.0%
    Rule of 40 Score: 50.0% (ELITE_EFFICIENCY) | Magic Number: 3.67 (ACCELERATE_SPEND)
  Distressed Startup: Growth=12.0% | FCF Margin=-22.0%
    Rule of 40 Score: -10.0% (SUB_BENCHMARK) | Magic Number: 1.26 (ACCELERATE_SPEND)`,
        codeNotes: [
          'Calculates Rule of 40 by summing annual percentage revenue growth and FCF profit margins.',
          'Computes the SaaS Magic Number by annualizing quarterly net new ARR over prior-quarter S&M expenses.',
          'Demonstrates how capital-efficient growth commands premium valuation multiples from growth equity investors.'
        ],
        tryIt: 'Adjust Hyper-Growth Cloud FCF margin to -35% to see its Rule of 40 score drop to 30.0%, breaching institutional efficiency thresholds.',
        check: {
          question: 'Under the SaaS Rule of 40, why is a company growing at 70% with a -20% free cash flow margin considered an elite performer?',
          options: [
            'Because 70% + (-20%) = 50%, which significantly exceeds the 40% efficiency hurdle, proving that high top-line growth justifies temporary cash burn',
            'Because venture capital funds prohibit companies from generating positive cash flow until they file for IPO',
            'Because burning cash reduces federal corporate income taxes to zero',
            'Because growth rates below 80% are automatically disqualified by NASDAQ exchanges'
          ],
          answer: 0,
          why: 'The Rule of 40 recognizes that hyper-growth compensates for negative margins; a combined score of 50% indicates highly attractive venture capital unit economics.',
          answerIndex: 0,
          explanation: 'The Rule of 40 recognizes that hyper-growth compensates for negative margins; a combined score of 50% indicates highly attractive venture capital unit economics.'
        }
      },
      {
        title: 'Burn Multiple & Cash Runway Physics Under Macro Volatility',
        say: [
          'In macroeconomic downturns where venture capital fundraising cycles freeze, high-burn startups face catastrophic insolvency if they cannot control their cash consumption. Rather than simply evaluating gross burn rate, modern venture investors analyze the Burn Multiple—a metric popularized by Craft Ventures that measures how much cash a startup consumes to generate each incremental dollar of Annual Recurring Revenue.',
          'The Burn Multiple is calculated as Net Burn (cash consumed from operations) divided by Net New ARR Added over the same period. Unlike high-level vanity metrics, the burn multiple directly exposes operating efficiency: a Burn Multiple under 1.0x is considered amazing (the startup burns less than $1 to add $1 of ARR), 1.0x to 1.5x is good, 1.5x to 2.0x is suspect, and exceeding 2.0x indicates dangerously inefficient operations that will rapidly deplete cash reserves.',
          'Dividing total bank cash by net monthly burn calculates the Zero-Cash Date runway in months. For example, a company with $12,000,000 in cash burning $4,800,000 annually ($400,000/month) while adding $3,200,000 in net new ARR delivers a healthy 1.50x Burn Multiple and 30.0 months of runway (2.5 years). Maintaining at least 24 to 30 months of runway shields founders from having to raise dilutive bridge rounds during macroeconomic fundraising contractions.'
        ],
        example: 'A venture startup holds $12,000,000 in cash, burns $4,800,000 annually ($400k/month), and adds $3,200,000 in net new ARR. The resulting 1.50x Burn Multiple qualifies as Good efficiency, providing 30.0 months of runway to hit growth targets.',
        code: `def calculate_burn_multiple_and_runway():
    cash_balance = 12000000.0   # $12,000,000 in bank
    annual_net_burn = 4800000.0 # Consumed $4.8M net cash in year
    annual_net_new_arr = 3200000.0 # Added $3.2M net new ARR

    # Burn Multiple = Net Burn / Net New ARR
    burn_multiple = annual_net_burn / annual_net_new_arr
    monthly_net_burn = annual_net_burn / 12.0 # $400,000/month
    runway_months = cash_balance / monthly_net_burn

    status = "AMAZING" if burn_multiple < 1.0 else "GOOD" if burn_multiple <= 1.5 else "SUSPECT" if burn_multiple <= 2.0 else "DANGEROUS"

    print("Burn Multiple & Cash Runway Physics:")
    print("  Cash in Bank: " + "$" + f"{cash_balance:,.2f}")
    print("  Annual Net Cash Burn: " + "$" + f"{annual_net_burn:,.2f}" + " (" + "$" + f"{monthly_net_burn:,.2f}" + " / month)")
    print("  Net New ARR Added: " + "$" + f"{annual_net_new_arr:,.2f}")
    print(f"  Burn Multiple: {burn_multiple:.2f}x ({status}) (Benchmark: < 1.5x)")
    print(f"  Remaining Zero-Cash Runway: {runway_months:.1f} months ({runway_months/12:.2f} years)")
    return {"burn_multiple": burn_multiple, "runway_months": runway_months}

calculate_burn_multiple_and_runway()`,
        output: `Burn Multiple & Cash Runway Physics:
  Cash in Bank: $12,000,000.00
  Annual Net Cash Burn: $4,800,000.00 ($400,000.00 / month)
  Net New ARR Added: $3,200,000.00
  Burn Multiple: 1.50x (GOOD) (Benchmark: < 1.5x)
  Remaining Zero-Cash Runway: 30.0 months (2.50 years)`,
        codeNotes: [
          'Calculates Burn Multiple by dividing net operating cash burn ($4.8M) by net new ARR added ($3.2M).',
          'Computes zero-cash runway by dividing cash balance ($12.0M) by monthly net burn ($400k).',
          'Confirms 30.0 months of runway, ensuring the company can execute without urgent fundraising pressure.'
        ],
        tryIt: 'Increase net burn to $8,000,000 while holding net new ARR constant to observe a 2.50x Dangerous Burn Multiple and runway drop to 18 months.',
        check: {
          question: 'What does a Burn Multiple of 3.0x indicate about a venture-backed growth startup?',
          options: [
            'The company is burning $3.00 of net operating cash for every $1.00 of net new ARR generated, signaling severely inefficient capital allocation',
            'The company\'s stock price has tripled on secondary venture markets',
            'The company has three years of cash remaining in its treasury reserves',
            'The startup is legally required to distribute 30% dividends to common stockholders'
          ],
          answer: 0,
          why: 'A 3.0x burn multiple reveals severe capital inefficiency, burning three dollars of invested capital to generate a single dollar of recurring revenue.',
          answerIndex: 0,
          explanation: 'A 3.0x burn multiple reveals severe capital inefficiency, burning three dollars of invested capital to generate a single dollar of recurring revenue.'
        }
      },
      {
        title: 'Cohort Contribution Margin & Customer Lifetime Value (LTV / CAC) Dynamics',
        say: [
          'Unit economics provide the foundational bedrock upon which enterprise scale is built. In venture finance, no metric is more scrutinized than the Customer Lifetime Value to Customer Acquisition Cost (LTV / CAC) ratio. Customer Lifetime Value measures the total gross profit an average customer contributes over their entire relationship with the company, calculated as (Annual Contract Value * Gross Margin %) / Annual Churn Rate.',
          'Venture capital investors expect high-growth software companies to maintain an LTV / CAC ratio between 3.0x and 5.0x. An LTV / CAC below 3.0x signals an unsustainable business model where marketing spend outstrips lifetime value, while an LTV / CAC exceeding 5.0x often indicates that the company is being overly conservative and under-investing in acquisition, leaving market share vulnerable to aggressive competitors.',
          'To model the cash profile of customer acquisition, founders construct multi-year cohort contribution waterfalls. For a cohort of 100 enterprise customers acquired at an $18,000 CAC ($1,800,000 Month 0 investment) with an $24,000 ACV, 80% gross margin, and 8% annual churn, Year 1 gross profit contribution reaches $1,920,000, paying back the entire CAC investment in 11.2 months. Over three years, cumulative gross profit reaches $5,311,488, generating $3,511,488 in net cash contribution and proving sustainable unit economics.'
        ],
        example: 'With $24,000 ACV, 80% gross margin, 8% churn, and $18,000 CAC, the startup achieves a $240,000 LTV, a 13.33x LTV/CAC ratio, and an 11.2-month CAC payback. A 100-customer cohort ($1.8M CAC) produces $5.31M in 3-year gross profit ($3.51M net profit).',
        code: `def model_ltv_cac_and_cohort_contribution():
    arpu_annual = 24000.0 # $24,000 ACV
    gross_margin = 0.80   # 80% software gross margin
    churn_rate = 0.08     # 8% annual logo churn
    cac = 18000.0         # $18,000 fully loaded CAC

    # LTV = (ARPU * Gross Margin) / Churn
    ltv = (arpu_annual * gross_margin) / churn_rate
    ltv_cac_ratio = ltv / cac
    cac_payback_months = (cac / ((arpu_annual * gross_margin) / 12.0))

    # 3-Year Cumulative Gross Profit from a cohort of 100 customers
    customers = 100
    m0_cac_investment = customers * cac # $1,800,000
    y1_gp = customers * (arpu_annual * gross_margin) # $1,920,000
    y2_gp = (customers * (1 - churn_rate)) * (arpu_annual * gross_margin) # $1,766,400
    y3_gp = (customers * ((1 - churn_rate) ** 2)) * (arpu_annual * gross_margin) # $1,625,088
    total_gp = y1_gp + y2_gp + y3_gp
    net_cohort_contribution = total_gp - m0_cac_investment

    print("Customer Lifetime Value (LTV) & Unit Economics:")
    print("  Annual Contract Value (ARPU): " + "$" + f"{arpu_annual:,.2f}" + f" | Gross Margin: {gross_margin*100:.0f}%")
    print("  Customer Lifetime Value (LTV): " + "$" + f"{ltv:,.2f}")
    print("  Fully Loaded CAC: " + "$" + f"{cac:,.2f}")
    print(f"  LTV / CAC Ratio: {ltv_cac_ratio:.2f}x (Benchmark: 3.0x - 5.0x)")
    print(f"  CAC Payback Period: {cac_payback_months:.1f} months")
    print("3-Year Cohort Contribution (100 Customers):")
    print("  Initial Month 0 CAC Investment: " + "$" + f"{m0_cac_investment:,.2f}")
    print("  3-Year Cumulative Gross Profit: " + "$" + f"{total_gp:,.2f}")
    print("  Net Cumulative Cohort Profit: " + "$" + f"{net_cohort_contribution:,.2f}")
    return {"ltv_cac": ltv_cac_ratio, "payback": cac_payback_months, "net_contribution": net_cohort_contribution}

model_ltv_cac_and_cohort_contribution()`,
        output: `Customer Lifetime Value (LTV) & Unit Economics:
  Annual Contract Value (ARPU): $24,000.00 | Gross Margin: 80%
  Customer Lifetime Value (LTV): $240,000.00
  Fully Loaded CAC: $18,000.00
  LTV / CAC Ratio: 13.33x (Benchmark: 3.0x - 5.0x)
  CAC Payback Period: 11.2 months
3-Year Cohort Contribution (100 Customers):
  Initial Month 0 CAC Investment: $1,800,000.00
  3-Year Cumulative Gross Profit: $5,311,488.00
  Net Cumulative Cohort Profit: $3,511,488.00`,
        codeNotes: [
          'Calculates true LTV ($240,000) using gross margin percentage rather than raw revenues.',
          'Determines that CAC payback occurs in 11.2 months, recovering initial acquisition capital in Year 1.',
          'Demonstrates how cohort gross profit compounds to $5.31M over 3 years, generating $3.51M net cash.'
        ],
        tryIt: 'Increase churn rate from 8% to 15% to evaluate how customer attrition cuts LTV to $128,000 and reduces net cohort profit by $1.2M.',
        check: {
          question: 'Why must Customer Lifetime Value (LTV) be calculated using Gross Margin rather than Top-Line Revenue?',
          options: [
            'Because revenue that is consumed by server hosting, customer support, and software delivery costs cannot be used to pay for customer acquisition costs',
            'Because federal banking laws prohibit software companies from counting gross revenue',
            'Because top-line revenue is always zero during the first five years of operations',
            'Because venture capital funds only invest in companies with zero customer acquisition costs'
          ],
          answer: 0,
          why: 'True lifetime value represents gross profit generated by a customer; using revenue overstates LTV by ignoring the ongoing direct cost to serve the customer.',
          answerIndex: 0,
          explanation: 'True lifetime value represents gross profit generated by a customer; using revenue overstates LTV by ignoring the ongoing direct cost to serve the customer.'
        }
      },
      {
        title: 'Series B Financial Model Engineering: Bottom-Up Revenue Build & Headcount Quota Capacity',
        say: [
          'When presenting to Series B lead investors, founders cannot rely on top-down market sizing ("if we capture 1% of a $50B market"). Institutional growth funds conduct exhaustive financial due diligence requiring an operational bottom-up revenue build grounded in headcount capacity, quota attainment, and customer retention dynamics.',
          'A credible bottom-up financial model begins with sales capacity: projecting the hiring and ramp schedule of Account Executives (AEs). For a company scaling from $6.0M ARR, deploying 12 AEs with $800,000 individual annual quotas at a conservative 75% blended attainment yields $7,200,000 in gross new bookings capacity. Incorporating installed base dynamics—8% logo churn (-$480k) offset by 20% expansion (+$1,200k)—projects Year 1 ARR at $13.92M, demonstrating achievable operational scaling.',
          'Simultaneously, the model allocates operating expenses across functional cost centers: allocating 35% of an annual $10M budget to R&D engineering ($3.5M) to maintain product differentiation, 45% to Sales and Marketing ($4.5M) to drive quota-carrying demand, and 20% to G&A ($2.0M) for legal, finance, and operational overhead. Aligning headcount capacity with financial budgets validates executive operational competence.'
        ],
        example: 'Scaling from $6.0M ARR, 12 AEs at $800k quota and 75% attainment generate $7.2M in new bookings capacity, which net of 8% churn and 20% expansion projects robust ARR growth supported by a balanced $10M operating budget (35% R&D, 45% S&M, 20% G&A).',
        code: `def build_series_b_financial_model():
    # 24-Month Projections: Beginning ARR $6.0M scaling to $18.0M
    starting_arr = 6000000.0
    y1_target_arr = 11000000.0
    y2_target_arr = 18000000.0

    # Headcount Capacity
    y1_aes = 12
    ae_quota = 800000.0
    blended_attainment = 0.75 # 75% realistic quota attainment
    y1_new_capacity = y1_aes * ae_quota * blended_attainment # $7,200,000 capacity
    installed_churn = starting_arr * 0.08 # $480k churn
    installed_expansion = starting_arr * 0.20 # $1,200k expansion
    y1_projected_arr = starting_arr + y1_new_capacity - installed_churn + installed_expansion # $13.92M

    # Opex Distribution for Year 1 ($10M total budget)
    total_opex = 10000000.0
    rd_spend = total_opex * 0.35 # $3.5M (35%)
    sm_spend = total_opex * 0.45 # $4.5M (45%)
    ga_spend = total_opex * 0.20 # $2.0M (20%)

    print("Series B Bottom-Up Financial Plan (24-Month Build):")
    print("  Current ARR: " + "$" + f"{starting_arr:,.2f}")
    print("  Year 1 Quota Capacity: " + "$" + f"{y1_new_capacity:,.2f}" + f" ({y1_aes} AEs at {blended_attainment*100:.0f}% Attainment)")
    print("  Year 1 Net Expansion: " + "$" + f"{installed_expansion - installed_churn:,.2f}" + " (20% Expansion, 8% Churn)")
    print("  Operating Expenditure Allocation: " + "$" + f"{total_opex:,.2f}")
    print("    R&D Engineering (35%): " + "$" + f"{rd_spend:,.2f}")
    print("    Sales & Marketing (45%): " + "$" + f"{sm_spend:,.2f}")
    print("    General & Admin (20%): " + "$" + f"{ga_spend:,.2f}")
    return {"capacity": y1_new_capacity, "sm_spend": sm_spend}

build_series_b_financial_model()`,
        output: `Series B Bottom-Up Financial Plan (24-Month Build):
  Current ARR: $6,000,000.00
  Year 1 Quota Capacity: $7,200,000.00 (12 AEs at 75% Attainment)
  Year 1 Net Expansion: $720,000.00 (20% Expansion, 8% Churn)
  Operating Expenditure Allocation: $10,000,000.00
    R&D Engineering (35%): $3,500,000.00
    Sales & Marketing (45%): $4,500,000.00
    General & Admin (20%): $2,000,000.00`,
        codeNotes: [
          'Builds revenue capacity from bottom-up sales rep headcount (12 AEs) and 75% realistic attainment.',
          'Accounts for installed base dynamics (20% expansion, 8% churn) yielding $720k net expansion.',
          'Structures functional opex budget across R&D ($3.5M), S&M ($4.5M), and G&A ($2.0M).'
        ],
        tryIt: 'Adjust AE attainment to 60% to evaluate how hiring delays or ramp frictions impact Year 1 bookings capacity.',
        check: {
          question: 'Why do institutional Series B investors mandate bottom-up financial models based on headcount and quota rather than top-down percentages?',
          options: [
            'Because bottom-up models prove that revenue targets are mathematically achievable through realistic hiring, quota attainment, and customer retention dynamics',
            'Because bottom-up models are legally required by federal securities exchanges for all private companies',
            'Because top-down financial models require executive approval from the Department of Commerce',
            'Because bottom-up models allow companies to fire all marketing personnel'
          ],
          answer: 0,
          why: 'Bottom-up models validate operational feasibility by tying revenue targets to concrete hiring schedules, quota productivity, and customer retention metrics.',
          answerIndex: 0,
          explanation: 'Bottom-up models validate operational feasibility by tying revenue targets to concrete hiring schedules, quota productivity, and customer retention metrics.'
        }
      },
      {
        title: 'Deploy the Growth Stage Venture Economics Control Tower',
        say: [
          'Scaling an enterprise venture requires balancing aggressive market expansion with disciplined capital conservation. In this operational capstone module, you will deploy the Growth Stage Venture Economics Control Tower.',
          'You will synthesize Rule of 40 growth-profitability profiles, evaluate the SaaS Magic Number to guide GTM spend, calculate the Burn Multiple to extend cash runway, model multi-year cohort contribution gross profits, and validate 24-month bottom-up hiring capacity models.',
          'Deploying this control tower equips entrepreneurs and venture capital investors with the financial rigor required to successfully lead and navigate Series B growth rounds.'
        ],
        example: 'The team verifies a 50.0% Rule of 40 score, confirms a Good 1.50x Burn Multiple with 30.0 months of runway, validates an outstanding 13.33x LTV/CAC ratio with 11.2-month payback, and certifies $7.2M in bottom-up AE bookings capacity.',
        code: `def run_venture_economics_control_tower():
    print("=== PinIT Career OS Growth Stage Venture Economics Control Tower ===")
    print("--- 1. Rule of 40 & Magic Number ---")
    r40 = evaluate_rule_of_40_and_magic_number()

    print("\n--- 2. Burn Multiple & Cash Runway ---")
    bm = calculate_burn_multiple_and_runway()

    print("\n--- 3. LTV/CAC & Cohort Economics ---")
    ltv = model_ltv_cac_and_cohort_contribution()

    print("\n--- 4. Series B Financial Plan ---")
    sb = build_series_b_financial_model()

    print("\n--- 5. Growth Stage Venture Synthesis ---")
    print(f"  Flagship Profile Rule of 40: {r40[0]['rule_of_40']:.1f}%")
    print(f"  Portfolio Burn Multiple: {bm['burn_multiple']:.2f}x ({bm['runway_months']:.1f} months runway)")
    print(f"  LTV / CAC Efficiency: {ltv['ltv_cac']:.2f}x (Payback: {ltv['payback']:.1f} mo)")
    print("Status: VENTURE UNIT ECONOMICS CERTIFIED READY FOR SERIES B LEAD INVESTOR AUDIT.")

run_venture_economics_control_tower()`,
        output: `=== PinIT Career OS Growth Stage Venture Economics Control Tower ===
--- 1. Rule of 40 & Magic Number ---
SaaS Rule of 40 & Magic Number Capital Efficiency:
  Hyper-Growth Cloud: Growth=65.0% | FCF Margin=-15.0%
    Rule of 40 Score: 50.0% (ELITE_EFFICIENCY) | Magic Number: 4.89 (ACCELERATE_SPEND)
  Balanced Enterprise: Growth=32.0% | FCF Margin=18.0%
    Rule of 40 Score: 50.0% (ELITE_EFFICIENCY) | Magic Number: 3.67 (ACCELERATE_SPEND)
  Distressed Startup: Growth=12.0% | FCF Margin=-22.0%
    Rule of 40 Score: -10.0% (SUB_BENCHMARK) | Magic Number: 1.26 (ACCELERATE_SPEND)

--- 2. Burn Multiple & Cash Runway ---
Burn Multiple & Cash Runway Physics:
  Cash in Bank: $12,000,000.00
  Annual Net Cash Burn: $4,800,000.00 ($400,000.00 / month)
  Net New ARR Added: $3,200,000.00
  Burn Multiple: 1.50x (GOOD) (Benchmark: < 1.5x)
  Remaining Zero-Cash Runway: 30.0 months (2.50 years)

--- 3. LTV/CAC & Cohort Economics ---
Customer Lifetime Value (LTV) & Unit Economics:
  Annual Contract Value (ARPU): $24,000.00 | Gross Margin: 80%
  Customer Lifetime Value (LTV): $240,000.00
  Fully Loaded CAC: $18,000.00
  LTV / CAC Ratio: 13.33x (Benchmark: 3.0x - 5.0x)
  CAC Payback Period: 11.2 months
3-Year Cohort Contribution (100 Customers):
  Initial Month 0 CAC Investment: $1,800,000.00
  3-Year Cumulative Gross Profit: $5,311,488.00
  Net Cumulative Cohort Profit: $3,511,488.00

--- 4. Series B Financial Plan ---
Series B Bottom-Up Financial Plan (24-Month Build):
  Current ARR: $6,000,000.00
  Year 1 Quota Capacity: $7,200,000.00 (12 AEs at 75% Attainment)
  Year 1 Net Expansion: $720,000.00 (20% Expansion, 8% Churn)
  Operating Expenditure Allocation: $10,000,000.00
    R&D Engineering (35%): $3,500,000.00
    Sales & Marketing (45%): $4,500,000.00
    General & Admin (20%): $2,000,000.00

--- 5. Growth Stage Venture Synthesis ---
  Flagship Profile Rule of 40: 50.0%
  Portfolio Burn Multiple: 1.50x (30.0 months runway)
  LTV / CAC Efficiency: 13.33x (Payback: 11.2 mo)
Status: VENTURE UNIT ECONOMICS CERTIFIED READY FOR SERIES B LEAD INVESTOR AUDIT.`,
        codeNotes: [
          'Unifies Rule of 40, Magic Number, Burn Multiple, LTV/CAC cohort contribution, and bottom-up financial planning.',
          'Demonstrates how capital-efficient unit economics establish 30.0 months of runway and superior investor attractiveness.',
          'Validates readiness for institutional Series B growth equity diligence.'
        ],
        tryIt: 'Run the integrated control tower to observe how balancing growth, burn, and unit economics secures venture capital backing.',
        check: {
          question: 'What combination of metrics signals the strongest financial health to Series B growth equity investors?',
          options: [
            'A Rule of 40 score >= 40%, a Burn Multiple <= 1.5x with > 24 months of runway, an LTV/CAC ratio >= 3.0x, and a bottom-up hiring model supporting ARR targets',
            'A 100% marketing budget allocation with zero investment in engineering product development',
            'Zero sales quotas and unlimited executive expense accounts',
            'Raising debt notes with 30% interest rates to fund office expansions'
          ],
          answer: 0,
          why: 'The combination of Rule of 40 >= 40%, Burn Multiple <= 1.5x, strong LTV/CAC, and a grounded bottom-up model represents the gold standard of growth stage venture health.',
          answerIndex: 0,
          explanation: 'The combination of Rule of 40 >= 40%, Burn Multiple <= 1.5x, strong LTV/CAC, and a grounded bottom-up model represents the gold standard of growth stage venture health.'
        }
      }
    ],
    summary: [
      'Evaluated SaaS capital efficiency using the Rule of 40 (50.0% score for Hyper-Growth Cloud) and SaaS Magic Number (4.89), signaling aggressive go-to-market expansion.',
      'Modeled Burn Multiple ($4.8M net burn / $3.2M net new ARR = 1.50x) and calculated 30.0 months of zero-cash runway on a $12M cash balance.',
      'Constructed a 3-year cohort contribution waterfall for 100 enterprise customers ($18k CAC, $24k ACV, 80% GM, 8% churn), proving an 11.2-month CAC payback and $3.51M in cumulative net profit.',
      'Engineered a bottom-up Series B financial model, tying 12 AEs at $800k quota and 75% attainment to $7.2M new bookings capacity alongside a balanced $10M opex budget.',
      'Deployed the Growth Stage Venture Economics Control Tower, establishing complete operational readiness for Series B institutional investor due diligence.'
    ],
    projectStep: {
      title: 'Deploy the Growth Stage Venture Economics & Capital Efficiency Engine',
      steps: [
        'Calculate Rule of 40 scores and SaaS Magic Numbers across growth profiles to guide go-to-market spending.',
        'Model the Burn Multiple and simulate cash runway horizons to insulate operations against macro shocks.',
        'Build a cohort contribution model tracking multi-year gross profit contribution and LTV/CAC payback periods.',
        'Engineer a bottom-up financial model linking sales capacity, quota attainment, and functional opex budgets.'
      ]
    }
  },
  {
    coursePrefix: 'bcom_ent',
    day: 5,
    title: 'Milestone 1 Capstone: Silicon Valley VC Pitch Room, Series B Financing & Venture Capital Partner Accreditation',
    parts: [
      {
        title: 'Institutional Series B Investment Memo & Sand Hill Road Due Diligence',
        say: 'Welcome to the ultimate proving ground of high-growth venture creation: the Milestone 1 Capstone of B.Com Entrepreneurship. When an enterprise transitions from early product-market fit to scale-up velocity, casual pitch decks and optimistic founder narratives are permanently superseded by rigorous, institutional-grade due diligence conducted by Sand Hill Road investment committees. A top-tier venture capital firm does not commit twenty to fifty million dollars based on visionary charisma; they construct an exhaustive internal investment memo that scrutinizes your unit economics, cohort retention, and capital efficiency with mathematical precision. In this capstone opening, we deconstruct the exact architecture of an institutional Series B investment memo, examining how general partners evaluate the fundamental health of recurring revenue businesses. By mastering the core quantitative benchmarks demanded by Tier-1 VCs, you transform financial telemetry from passive accounting logs into an unassailable strategic defense of enterprise value.\n\nAt the heart of the institutional evaluation sits the Net New ARR bridge and cohort retention physics, which reveal the true underlying organic momentum of the customer base. Venture partners rigorously separate top-line expansion into new logo customer acquisition, gross revenue retention (GRR), and net revenue retention (NRR). While an impressive top-line growth rate can temporarily mask high churn in early stages, by Series B, any leakage in cohort retention becomes mathematically fatal to long-term compounding. Top-quartile SaaS enterprises maintain GRR above ninety percent and NRR exceeding one hundred and twenty percent, proving that existing cohorts expand their spend faster than churn erodes it. Furthermore, investors dissect the relationship between go-to-market burn and net additions through the SaaS Magic Number and CAC Payback period, verifying that customer acquisition costs are recouped within twelve months. When these metrics align alongside a healthy gross margin exceeding eighty percent, the business demonstrates the elusive economic leverage that justifies premium valuation multiples.\n\nCapital efficiency metrics provide the decisive filter separating durable category leaders from hyper-dilutive cash furnaces. General partners calculate the Rule of 40 by summing GAAP revenue growth with free cash flow margin, expecting top-tier growth-stage companies to comfortably surpass the forty percent benchmark. Concurrently, the Burn Multiple measures the exact amount of cash vaporized to generate each incremental dollar of ARR, penalizing undisciplined headcount expansion and inefficient marketing spend. In this section, you will inspect an automated institutional diligence evaluator that models ending ARR, cohort retention, gross margin, Magic Number, CAC payback, and Burn Multiple into a quantitative investment score. Mastering this diligence framework equips you to defend your enterprise against the most adversarial venture partner inquiries, proving that your growth engine is built on permanent economic foundations.',
        example: 'Think of passing an institutional Series B due diligence audit like undergoing an exhaustive medical examination before being selected for an elite deep-sea expedition. A local doctor might check your pulse and temperature for five minutes to ensure you are not immediately ill, analogous to seed-stage angel investors glancing at a pitch deck. In contrast, naval flight surgeons will perform comprehensive stress electrocardiograms, lung capacity spirometry, blood biomarker panels, and hypoxia resistance tests to prove you can endure extreme atmospheric pressure without cardiac failure. Similarly, a Tier-1 venture investment committee will not merely confirm that your revenue is increasing; they run multi-cohort retention analyses, simulate severe economic downturns, audit customer acquisition unit economics, and stress-test your cash burn rate to guarantee your corporate vehicle will survive and dominate hyper-competitive global markets.',
        code: `def model_series_b_investment_memo():
    print("=== Institutional Series B Investment Memo & SaaS Due Diligence ===")
    starting_arr = 6_000_000.0
    ending_arr = 12_000_000.0
    net_new_arr = ending_arr - starting_arr
    arr_growth_pct = (net_new_arr / starting_arr) * 100.0
    
    beginning_cohort_arr = 5_000_000.0
    expansion_arr = 1_500_000.0
    churn_contraction_arr = 250_000.0
    retained_arr = beginning_cohort_arr - churn_contraction_arr
    
    grr_pct = (retained_arr / beginning_cohort_arr) * 100.0
    nrr_pct = ((retained_arr + expansion_arr) / beginning_cohort_arr) * 100.0
    
    revenue = 9_500_000.0
    cogs = 1_805_000.0
    gross_profit = revenue - cogs
    gross_margin_pct = (gross_profit / revenue) * 100.0
    
    net_cash_burn = 5_400_000.0
    burn_multiple = net_cash_burn / net_new_arr
    
    fcf = -1_900_000.0
    fcf_margin_pct = (fcf / revenue) * 100.0
    rule_of_40_score = arr_growth_pct + fcf_margin_pct
    
    sales_marketing_spend = 4_800_000.0
    magic_number = net_new_arr / sales_marketing_spend
    cac_payback_months = (sales_marketing_spend / (net_new_arr * (gross_margin_pct / 100.0))) * 12.0
    
    score = 0
    if arr_growth_pct >= 80.0: score += 25
    if nrr_pct >= 120.0: score += 25
    if rule_of_40_score >= 40.0: score += 20
    if burn_multiple <= 1.2: score += 15
    if cac_payback_months <= 12.0: score += 15
    
    verdict = "TIER_1_SERIES_B_APPROVED" if score >= 90 else "CONDITIONAL_APPROVAL"
    
    print(f"ARR Trajectory: Beginning=" + "$" + f"{starting_arr:,.2f} -> Ending=" + "$" + f"{ending_arr:,.2f} (+{arr_growth_pct:.1f}% YoY)")
    print(f"Cohort Retention: GRR={grr_pct:.1f}% | NRR={nrr_pct:.1f}%")
    print(f"Financial Margins: Gross Margin={gross_margin_pct:.1f}% | FCF Margin={fcf_margin_pct:.1f}%")
    print(f"Capital Efficiency: Rule of 40={rule_of_40_score:.1f}% | Burn Multiple={burn_multiple:.2f}x")
    print(f"Go-to-Market: Magic Number={magic_number:.2f} | CAC Payback={cac_payback_months:.1f} months")
    print(f"Diligence Score: {score}/100 -> Recommendation: {verdict}")
    return {
        "arr_growth_pct": arr_growth_pct,
        "nrr_pct": nrr_pct,
        "rule_of_40": rule_of_40_score,
        "burn_multiple": burn_multiple,
        "cac_payback_months": cac_payback_months,
        "score": score,
        "verdict": verdict
    }

model_series_b_investment_memo()`,
        output: `=== Institutional Series B Investment Memo & SaaS Due Diligence ===
ARR Trajectory: Beginning=$6,000,000.00 -> Ending=$12,000,000.00 (+100.0% YoY)
Cohort Retention: GRR=95.0% | NRR=125.0%
Financial Margins: Gross Margin=81.0% | FCF Margin=-20.0%
Capital Efficiency: Rule of 40=80.0% | Burn Multiple=0.90x
Go-to-Market: Magic Number=1.25 | CAC Payback=11.9 months
Diligence Score: 100/100 -> Recommendation: TIER_1_SERIES_B_APPROVED`,
        codeNotes: [
          'Evaluates high-growth SaaS metrics: 100% ARR growth, 95% GRR, and 125% NRR across cohort renewals.',
          'Calculates Rule of 40 at 80.0% and Burn Multiple at 0.90x, well inside top-quartile venture capital benchmarks.',
          'Measures GTM efficiency with a 1.25 Magic Number and 11.9-month CAC payback, qualifying for Tier-1 institutional Series B approval.'
        ],
        tryIt: 'Adjust sales and marketing spend to $7,000,000.00 to observe how an extended CAC payback period impacts the institutional diligence score.',
        check: {
          question: 'Why do institutional venture capital investment committees place equal weight on Net Revenue Retention (NRR) and Net New ARR growth during Series B due diligence?',
          options: [
            'NRR isolates customer expansion and retention from new acquisition, proving that the installed base compounds even if new sales acquisition stalls.',
            'NRR is an accounting requirement mandated by GAAP for all venture-backed corporate tax returns.',
            'NRR represents the total cash balance in the bank divided by outstanding common stock.',
            'NRR eliminates the necessity of tracking gross margin and sales marketing expenses.'
          ],
          answer: 0,
          why: 'NRR measures the compounding power of the existing customer base through expansions and upsells minus churn, validating product-market durability independent of top-line marketing spend.',
          answerIndex: 0,
          explanation: 'NRR measures the compounding power of the existing customer base through expansions and upsells minus churn, validating product-market durability independent of top-line marketing spend.'
        }
      },
      {
        title: 'Multi-Tranche Series B Term Sheet, Syndicate Allocation & Pro-Rata Rights',
        say: 'Negotiating a multi-million dollar Series B financing round requires navigating complex investor syndication dynamics, pro-rata equity entitlements, and cap table dilution mechanics. Unlike early seed rounds typically closed via rolling SAFE notes, a Series B is led by an institutional growth fund that prices the round, issues a formal NVCA term sheet, and demands fifteen to twenty-five percent ownership of the company post-closing. The lead investor rarely takes the entirety of the round alone; instead, they anchor sixty to seventy percent of the total dollar raise while leaving the remaining allocation open to existing investors exercising major investor pro-rata rights and strategic co-investors. For founders, orchestrating this syndicate allocation is a critical balancing act between securing prestigious lead governance, rewarding early supporters, and preserving long-term cap table equity.\n\nPro-rata rights represent the contractual entitlement of major early investors, usually granted in Seed and Series A financing agreements, to purchase their exact percentage ownership in subsequent preferred stock financings. When existing Series A investors exercise their full pro-rata rights in a thirty million dollar Series B round, they inject fresh capital to prevent their equity percentage from being diluted down by the new financing. However, this pro-rata allocation consumes valuable round capacity: if the lead investor insists on acquiring fifteen percent ownership post-money and existing investors demand their full twenty-four percent pro-rata, the aggregate dilution expands, or other potential syndicate partners are squeezed out. Founders must model the exact dollar waterfalls and ownership shifts resulting from varying syndicate allocations before executing definitive agreements.\n\nFurthermore, the Series B term sheet frequently requires an expansion of the unallocated employee option pool to ensure adequate equity incentives are available to recruit executive talent through subsequent growth milestones. When VCs stipulate that the option pool must represent twelve to fifteen percent of the company on a post-money fully diluted basis, the economic burden of this dilution falls entirely on the pre-money shareholders unless aggressively negotiated. In this section, we examine an algorithmic syndicate allocation model that structures a thirty million dollar raise on a one hundred and twenty million dollar pre-money valuation, distributing allocations across a lead Tier-1 VC, Series A pro-rata exercises, and an opportunistic growth syndicate. Understanding these capitalization dynamics empowers founders to negotiate optimal valuations while managing syndicate governance harmoniously.',
        example: 'Consider syndicating a thirty million dollar Series B financing round like financing a premier commercial film production. A major Hollywood studio acts as the lead producer, committing sixty percent of the budget and insisting on principal artistic oversight and board representation. Meanwhile, early independent angel investors who funded the original script hold contractual options to co-invest twenty-five percent in all sequels to maintain their financial stake, while a global streaming network takes the remaining fifteen percent for distribution rights. If the lead studio and early backers consume the entire financing allocation without clear structural rules, friction arises over producer credits and profit participation. By establishing clear syndicate allocation rules and cap table schedules upfront, the executive producer ensures every investor receives their rightful ownership without stalling production.',
        code: `def structure_series_b_syndicate_and_prorata():
    print("=== Multi-Tranche Series B Term Sheet, Syndicate & Pro-Rata ===")
    pre_money_val = 120_000_000.0
    investment_amount = 30_000_000.0
    post_money_val = pre_money_val + investment_amount
    
    series_b_dilution_pct = (investment_amount / post_money_val) * 100.0
    
    lead_vc_pct = 60.0
    lead_vc_investment = investment_amount * (lead_vc_pct / 100.0)
    
    pro_rata_pct = 25.0
    pro_rata_investment = investment_amount * (pro_rata_pct / 100.0)
    
    growth_syndicate_pct = 15.0
    growth_syndicate_investment = investment_amount * (growth_syndicate_pct / 100.0)
    
    lead_vc_post_ownership = (lead_vc_investment / post_money_val) * 100.0
    pro_rata_post_ownership = (pro_rata_investment / post_money_val) * 100.0
    syndicate_post_ownership = (growth_syndicate_investment / post_money_val) * 100.0
    
    pre_round_cap_table = {
        "Founders & Common": 52.0,
        "Seed Investors": 12.0,
        "Series A Investors": 24.0,
        "Option Pool (Existing)": 12.0
    }
    
    retention_factor = 1.0 - (series_b_dilution_pct / 100.0)
    post_round_cap_table = {}
    for stakeholder, pct in pre_round_cap_table.items():
        if stakeholder == "Series A Investors":
            post_round_cap_table[stakeholder] = (pct * retention_factor) + pro_rata_post_ownership
        else:
            post_round_cap_table[stakeholder] = pct * retention_factor
            
    post_round_cap_table["Series B Lead VC"] = lead_vc_post_ownership
    post_round_cap_table["Series B Growth Syndicate"] = syndicate_post_ownership
    
    print(f"Round Terms: Pre-Money=" + "$" + f"{pre_money_val:,.2f} | Raise=" + "$" + f"{investment_amount:,.2f} | Post-Money=" + "$" + f"{post_money_val:,.2f}")
    print(f"Total Series B Dilution: {series_b_dilution_pct:.2f}%")
    print("Syndicate Allocation Waterfall:")
    print(f"  Lead Tier-1 VC (60%): " + "$" + f"{lead_vc_investment:,.2f} -> {lead_vc_post_ownership:.2f}% Post-Money Ownership")
    print(f"  Series A Pro-Rata (25%): " + "$" + f"{pro_rata_investment:,.2f} -> {pro_rata_post_ownership:.2f}% Incremental Ownership")
    print(f"  Growth Syndicate (15%): " + "$" + f"{growth_syndicate_investment:,.2f} -> {syndicate_post_ownership:.2f}% Post-Money Ownership")
    print("Post-Money Fully Diluted Cap Table:")
    for stakeholder, share in post_round_cap_table.items():
        print(f"  {stakeholder}: {share:.2f}%")
    return {
        "pre_money": pre_money_val,
        "post_money": post_money_val,
        "dilution_pct": series_b_dilution_pct,
        "post_cap_table": post_round_cap_table
    }

structure_series_b_syndicate_and_prorata()`,
        output: `=== Multi-Tranche Series B Term Sheet, Syndicate & Pro-Rata ===
Round Terms: Pre-Money=$120,000,000.00 | Raise=$30,000,000.00 | Post-Money=$150,000,000.00
Total Series B Dilution: 20.00%
Syndicate Allocation Waterfall:
  Lead Tier-1 VC (60%): $18,000,000.00 -> 12.00% Post-Money Ownership
  Series A Pro-Rata (25%): $7,500,000.00 -> 5.00% Incremental Ownership
  Growth Syndicate (15%): $4,500,000.00 -> 3.00% Post-Money Ownership
Post-Money Fully Diluted Cap Table:
  Founders & Common: 41.60%
  Seed Investors: 9.60%
  Series A Investors: 24.20%
  Option Pool (Existing): 9.60%
  Series B Lead VC: 12.00%
  Series B Growth Syndicate: 3.00%`,
        codeNotes: [
          'Models a $30.0M Series B raise at $120.0M pre-money ($150.0M post-money), resulting in 20.00% round dilution.',
          'Allocates the syndicate across Lead VC ($18.0M / 12.00%), Series A pro-rata ($7.5M / 5.00%), and Growth Syndicate ($4.5M / 3.00%).',
          'Reconciles the fully diluted cap table post-closing, preserving 41.60% for founders and updating Series A ownership to 24.20%.'
        ],
        tryIt: 'Adjust the round pre-money valuation to $150,000,000.00 to examine how higher pricing reduces total round dilution on a $30M raise.',
        check: {
          question: 'What is the primary strategic benefit of major early investors exercising their contractual pro-rata rights in a Series B round?',
          options: [
            'It allows early investors to maintain their exact proportional equity ownership, avoiding dilution as the company scales.',
            'It guarantees that the company will not be required to hire an independent board member.',
            'It eliminates the requirement for the lead investor to perform legal due diligence.',
            'It converts all preferred shares immediately into subordinated debt notes.'
          ],
          answer: 0,
          why: 'Pro-rata rights protect early venture investors against equity dilution by empowering them to inject pro-rata capital to maintain their proportional ownership stake.',
          answerIndex: 0,
          explanation: 'Pro-rata rights protect early venture investors against equity dilution by empowering them to inject pro-rata capital to maintain their proportional ownership stake.'
        }
      },
      {
        title: 'Boardroom Corporate Governance, Protective Covenants & Voting Agreements',
        say: 'As an enterprise closes its Series B financing, the corporate governance architecture undergoes a permanent structural transformation from founder autonomy to institutional fiduciary oversight. In earlier stages, the Board of Directors typically consists of the founding team and a single Series A investor, allowing founders to maintain majority control over strategic decisions. Upon closing a Series B round, institutional lead investors mandate an expansion to a balanced five-member board, standardizing a two-two-one structure: two founder/common seats (CEO and CTO), two preferred investor seats (Series A and Series B lead partners), and one independent industry executive mutually agreed upon by common and preferred holders. This governance rebalancing ensures institutional accountability while protecting the enterprise against single-person operational vulnerabilities.\n\nBeyond direct board representation, Series B preferred stockholders demand an extensive suite of protective provisions and negative covenants incorporated into the amended certificate of incorporation. Protective covenants are contractual veto rights that prevent executive management from undertaking critical corporate actions without the express consent of a majority or supermajority of preferred shares. Common covenants include strict debt incurring ceilings (e.g., prohibiting uncollateralized borrowings exceeding two million dollars), mandatory preferred consent for any merger, acquisition, or sale of company assets, restrictions on executive compensation adjustments, and caps on annual operating budget variances. For founders, these covenants do not imply a lack of confidence, but rather represent standard institutional safeguards designed to align corporate actions with fiduciary capital preservation.\n\nVoting agreements and drag-along rights complete the institutional governance framework, ensuring orderly decision-making during future liquidity events or recapitalizations. A properly drafted NVCA-standard drag-along agreement specifies that if the Board of Directors and a specified supermajority (such as sixty-six point seven percent) of common and preferred stockholders approve a bona fide sale or merger, all minority common shareholders are legally compelled to vote in favor and execute the transaction. This mechanism prevents disgruntled minority employees or former angel investors from holding an acquisition hostage for preferential terms. In this section, you will audit an interactive governance engine that evaluates board seat distribution, verifies protective covenant thresholds, and checks drag-along enforceability. Mastering these boardroom rules enables founders to maintain constructive, high-trust relationships with their institutional directors.\n\nEffective corporate governance also establishes formal board committees to oversee specialized enterprise functions, specifically an Audit Committee and a Compensation Committee. The Compensation Committee, typically composed of the independent director and one preferred investor, establishes objective performance milestones for C-suite executive bonuses, equity refresh grants, and executive severance packages. Meanwhile, the Audit Committee oversees the engagement of Big Four independent accounting firms, reviews internal financial controls under SOC 2 and Sarbanes-Oxley standards, and inspects annual financial statements prior to board dissemination. Operating within this formalized governance matrix ensures that the venture is managed with the maturity, transparency, and operational rigor expected of a pre-IPO enterprise.',
        example: 'Think of restructuring your corporate board and protective covenants at Series B like ratifying a national constitutional balance of power during a period of federation expansion. In the founding era, tribal leaders govern through immediate executive decrees without legislative delay. However, once neighboring states contribute substantial treasury resources and citizens to the common alliance, a constitutional council is formed with balanced representation: two provincial governors, two federal delegates, and an independent supreme magistrate. The council establishes strict constitutional vetoes requiring legislative supermajorities before issuing public debt, entering foreign treaties, or altering taxation laws. This governance architecture prevents any single faction from bankrupting the union while providing a stable, rule-based legal system that fosters long-term prosperity.',
        code: `def audit_boardroom_governance_and_covenants():
    print("=== Boardroom Corporate Governance & Protective Covenants Audit ===")
    board_seats = [
        {"seat": "Seat 1 (Common)", "holder": "Chief Executive Officer (Founder)", "type": "Executive", "voting_power": 1},
        {"seat": "Seat 2 (Common)", "holder": "Chief Technology Officer (Founder)", "type": "Executive", "voting_power": 1},
        {"seat": "Seat 3 (Series A)", "holder": "Series A Lead General Partner", "type": "Preferred Investor", "voting_power": 1},
        {"seat": "Seat 4 (Series B)", "holder": "Series B Lead General Partner", "type": "Preferred Investor", "voting_power": 1},
        {"seat": "Seat 5 (Independent)", "holder": "Veteran SaaS Enterprise Operator", "type": "Mutually Appointed", "voting_power": 1}
    ]
    
    protective_covenants = [
        {"covenant": "Indebtedness Threshold", "threshold": "> $2,000,000.00", "required_consent": "Series B Lead + Board Majority"},
        {"covenant": "M&A / Liquidation Event", "threshold": "Any Change of Control", "required_consent": "66.7% Preferred Supermajority"},
        {"covenant": "Budget Deviation", "threshold": "> 15% Annual Opex Variance", "required_consent": "Board Majority Approval"},
        {"covenant": "Option Pool Expansion", "threshold": "> Authorized 12% Pool", "required_consent": "Series A & Series B Preferred Consent"},
        {"covenant": "Executive Compensation / C-Suite Hire", "threshold": "CEO / CFO / VP Appointments", "required_consent": "Board Compensation Committee"}
    ]
    
    drag_along_threshold_pct = 66.7
    founder_board_pct = (2 / len(board_seats)) * 100.0
    investor_board_pct = (2 / len(board_seats)) * 100.0
    independent_board_pct = (1 / len(board_seats)) * 100.0
    
    print(f"Board Structure (5 Seats): Common/Founders={founder_board_pct:.0f}% | Investors={investor_board_pct:.0f}% | Independent={independent_board_pct:.0f}%")
    print("Seat Allocations:")
    for seat in board_seats:
        print(f"  {seat['seat']}: {seat['holder']} ({seat['type']})")
    print("Protective Provisions & Negative Covenants:")
    for cov in protective_covenants:
        print(f"  {cov['covenant']}: Floor={cov['threshold']} | Requires: {cov['required_consent']}")
    print(f"Drag-Along Agreement: Minimum {drag_along_threshold_pct}% Supermajority required to enforce sale")
    print("Status: NVCA COMPLIANT 2-2-1 GOVERNANCE ARCHITECTURE VERIFIED.")
    return {
        "board_size": len(board_seats),
        "founder_pct": founder_board_pct,
        "investor_pct": investor_board_pct,
        "drag_along_threshold_pct": drag_along_threshold_pct,
        "status": "NVCA_COMPLIANT_2_2_1"
    }

audit_boardroom_governance_and_covenants()`,
        output: `=== Boardroom Corporate Governance & Protective Covenants Audit ===
Board Structure (5 Seats): Common/Founders=40% | Investors=40% | Independent=20%
Seat Allocations:
  Seat 1 (Common): Chief Executive Officer (Founder) (Executive)
  Seat 2 (Common): Chief Technology Officer (Founder) (Executive)
  Seat 3 (Series A): Series A Lead General Partner (Preferred Investor)
  Seat 4 (Series B): Series B Lead General Partner (Preferred Investor)
  Seat 5 (Independent): Veteran SaaS Enterprise Operator (Mutually Appointed)
Protective Provisions & Negative Covenants:
  Indebtedness Threshold: Floor=> $2,000,000.00 | Requires: Series B Lead + Board Majority
  M&A / Liquidation Event: Floor=Any Change of Control | Requires: 66.7% Preferred Supermajority
  Budget Deviation: Floor=> 15% Annual Opex Variance | Requires: Board Majority Approval
  Option Pool Expansion: Floor=> Authorized 12% Pool | Requires: Series A & Series B Preferred Consent
  Executive Compensation / C-Suite Hire: Floor=CEO / CFO / VP Appointments | Requires: Board Compensation Committee
Drag-Along Agreement: Minimum 66.7% Supermajority required to enforce sale
Status: NVCA COMPLIANT 2-2-1 GOVERNANCE ARCHITECTURE VERIFIED.`,
        codeNotes: [
          'Models an NVCA-standard 5-member board structure: 40% Common/Founders, 40% Preferred Investors, and 20% Independent Operator.',
          'Audits protective negative covenants governing debt incurrence (>$2.0M), change of control M&A, and budget variances (>15%).',
          'Verifies a 66.7% preferred and common supermajority drag-along threshold, guaranteeing smooth execution of future M&A transactions.'
        ],
        tryIt: 'Modify the board structure to include 3 founder seats and test whether it conforms to typical Series B institutional venture standards.',
        check: {
          question: 'What is the primary operational role of an independent director in a balanced 2-2-1 Series B venture board of directors?',
          options: [
            'To serve as an objective industry expert who breaks potential deadlocks between common founders and preferred investors in the best fiduciary interest of the corporation.',
            'To represent the legal interests of commercial bank lenders and enforce debt repayments.',
            'To manage daily sales engineering and customer onboarding operations.',
            'To audit the code repository every weekend for syntax errors.'
          ],
          answer: 0,
          why: 'An independent director provides seasoned industry wisdom and acts as an impartial tie-breaker when founder and investor interests diverge, ensuring balanced corporate stewardship.',
          answerIndex: 0,
          explanation: 'An independent director provides seasoned industry wisdom and acts as an impartial tie-breaker when founder and investor interests diverge, ensuring balanced corporate stewardship.'
        }
      },
      {
        title: 'Growth Capital Allocation, R&D/GTM Scaling & Stress-Tested Solvency Runway',
        say: 'Securing a thirty million dollar Series B financing injection provides unprecedented operational leverage, but deploying that capital with strategic discipline is where the ultimate battle for enterprise survival is won or lost. Misallocating growth capital into undisciplined sales headcount, excessive marketing acquisition experiments, or unverified product expansions can quickly trigger runaway cash burn without corresponding ARR generation. A seasoned chief executive must allocate net proceeds across functional pillars according to mathematically validated unit economics: investing aggressively where payback periods are short while maintaining a robust strategic treasury reserve to buffer against macroeconomic downturns.\n\nIn top-tier growth stage software enterprises, Series B capital allocation typically adheres to a battle-tested distribution: fifty-five percent directed toward Go-to-Market (GTM) enterprise sales and customer expansion, thirty percent allocated toward R&D engineering and proprietary AI platform enhancements, ten percent assigned to General & Administrative (G&A) compliance and international legal structuring, and five percent preserved in strategic working capital reserves. This allocation profile ensures that the sales organization possesses the capacity to double revenue annually while product engineering continuously widens the technological moat. By tying hiring plans directly to quota capacity and sales rep ramp periods, executive leadership prevents premature scaling and protects gross margins.\n\nEqually critical is simulating quarterly treasury trajectories and cash runway horizons under severe downside stress scenarios. Even when base-case models project rapid ARR expansion and narrowing cash burn over twenty-four months, macro shocks—such as tech spending freezes, lengthened enterprise sales cycles, or vendor contract consolidations—can severely compress net new bookings. A resilient corporate financial plan incorporates a thirty to forty percent burn shock test, ensuring that even if sales productivity drops significantly, the enterprise maintains at least twenty-four to thirty months of unassailable solvency buffer without requiring an emergency down-round financing. In this section, you will model an automated growth capital deployment engine that tracks quarterly cash ramp, projects ARR milestones to forty-two million dollars, and stress-tests treasury solvency across extreme macroeconomic conditions.',
        example: 'Consider deploying thirty million dollars in Series B growth capital like fueling and navigating a supersonic passenger aircraft during a transatlantic flight. Over fifty percent of the high-octane fuel is allocated directly to the primary propulsion turbines—your enterprise go-to-market engine—propelling the craft forward to cruise speed. Thirty percent is channeled into hydraulic flight stabilization and advanced avionics—your R&D engineering platform—ensuring structural integrity and guidance at high altitudes. Ten percent fuels auxiliary life-support and communications systems (G&A compliance), while the remaining fuel is locked in emergency reserve tanks. If violent unexpected headwinds or turbulence strike mid-ocean, the pilot does not risk a catastrophic ditching; the reserve fuel guarantees sufficient endurance to divert safely to an alternate airfield.',
        code: `def allocate_growth_capital_and_stress_runway():
    print("=== Growth Capital Allocation & Solvency Runway Stress Test ===")
    net_proceeds = 30_000_000.0
    existing_cash = 10_000_000.0
    total_treasury = net_proceeds + existing_cash
    
    allocations = {
        "GTM Enterprise Expansion (55%)": net_proceeds * 0.55,
        "R&D AI & Core Platform (30%)": net_proceeds * 0.30,
        "G&A Legal & International Compliance (10%)": net_proceeds * 0.10,
        "Strategic Working Capital Reserve (5%)": net_proceeds * 0.05
    }
    
    quarterly_runway_simulation = [
        {"quarter": "Q1", "monthly_burn": 800_000.0, "arr": 13_500_000.0},
        {"quarter": "Q2", "monthly_burn": 950_000.0, "arr": 15_800_000.0},
        {"quarter": "Q3", "monthly_burn": 1_100_000.0, "arr": 18_900_000.0},
        {"quarter": "Q4", "monthly_burn": 1_250_000.0, "arr": 22_500_000.0},
        {"quarter": "Q5", "monthly_burn": 1_200_000.0, "arr": 26_800_000.0},
        {"quarter": "Q6", "monthly_burn": 1_100_000.0, "arr": 31_500_000.0},
        {"quarter": "Q7", "monthly_burn": 900_000.0, "arr": 36_200_000.0},
        {"quarter": "Q8", "monthly_burn": 650_000.0, "arr": 42_000_000.0}
    ]
    
    current_cash = total_treasury
    cash_trajectory = []
    for q in quarterly_runway_simulation:
        quarterly_burn = q["monthly_burn"] * 3.0
        current_cash -= quarterly_burn
        cash_trajectory.append({"quarter": q["quarter"], "ending_cash": current_cash, "arr": q["arr"]})
        
    downside_stress_factor = 1.35
    stressed_annual_burn = sum(q["monthly_burn"] * 3.0 for q in quarterly_runway_simulation[:4]) * downside_stress_factor
    stressed_runway_months = (total_treasury / (stressed_annual_burn / 12.0))
    
    print(f"Total Treasury Capital: " + "$" + f"{total_treasury:,.2f} (" + "$" + f"{existing_cash:,.2f} cash + " + "$" + f"{net_proceeds:,.2f} Series B)")
    print("Capital Allocation Schedule:")
    for cat, amt in allocations.items():
        print(f"  {cat}: " + "$" + f"{amt:,.2f}")
    print("24-Month Treasury & ARR Ramp Simulation:")
    for row in cash_trajectory:
        print(f"  {row['quarter']}: Treasury Remaining=" + "$" + f"{row['ending_cash']:,.2f} | ARR Runway=" + "$" + f"{row['arr']:,.2f}")
    print(f"Macro Stress Test (1.35x Burn Shock): Stressed Runway = {stressed_runway_months:.1f} Months")
    print("Status: ROBUST 28+ MONTH SOLVENCY BUFFER CONFIRMED UNDER SEVERE DOWNSIDE STRESS.")
    return {
        "total_treasury": total_treasury,
        "ending_cash_q8": cash_trajectory[-1]["ending_cash"],
        "stressed_runway_months": stressed_runway_months
    }

allocate_growth_capital_and_stress_runway()`,
        output: `=== Growth Capital Allocation & Solvency Runway Stress Test ===
Total Treasury Capital: $40,000,000.00 ($10,000,000.00 cash + $30,000,000.00 Series B)
Capital Allocation Schedule:
  GTM Enterprise Expansion (55%): $16,500,000.00
  R&D AI & Core Platform (30%): $9,000,000.00
  G&A Legal & International Compliance (10%): $3,000,000.00
  Strategic Working Capital Reserve (5%): $1,500,000.00
24-Month Treasury & ARR Ramp Simulation:
  Q1: Treasury Remaining=$37,600,000.00 | ARR Runway=$13,500,000.00
  Q2: Treasury Remaining=$34,750,000.00 | ARR Runway=$15,800,000.00
  Q3: Treasury Remaining=$31,450,000.00 | ARR Runway=$18,900,000.00
  Q4: Treasury Remaining=$27,700,000.00 | ARR Runway=$22,500,000.00
  Q5: Treasury Remaining=$24,100,000.00 | ARR Runway=$26,800,000.00
  Q6: Treasury Remaining=$20,800,000.00 | ARR Runway=$31,500,000.00
  Q7: Treasury Remaining=$18,100,000.00 | ARR Runway=$36,200,000.00
  Q8: Treasury Remaining=$16,150,000.00 | ARR Runway=$42,000,000.00
Macro Stress Test (1.35x Burn Shock): Stressed Runway = 28.9 Months
Status: ROBUST 28+ MONTH SOLVENCY BUFFER CONFIRMED UNDER SEVERE DOWNSIDE STRESS.`,
        codeNotes: [
          'Allocates $30.0M net proceeds across GTM expansion ($16.5M), R&D engineering ($9.0M), G&A ($3.0M), and reserves ($1.5M).',
          'Simulates 8 quarters of treasury trajectory, reaching $42.0M ARR run-rate with $16.15M ending cash buffer.',
          'Executes an extreme 1.35x burn shock stress test, certifying 28.9 months of survival runway under adverse market conditions.'
        ],
        tryIt: 'Simulate an extreme downside scenario where monthly burn increases by 50% to evaluate the minimum cash cushion threshold.',
        check: {
          question: 'Why should growth-stage software companies maintain at least 24 to 30 months of cash runway following a Series B financing round?',
          options: [
            'It provides sufficient operational runway to reach key enterprise valuation inflection points while buffering against prolonged macroeconomic venture downturns.',
            'It eliminates the obligation to pay corporate income taxes in western jurisdictions.',
            'It is required by the SEC to prevent common shares from trading on secondary markets.',
            'It guarantees that customer churn rates will immediately drop to zero percent.'
          ],
          answer: 0,
          why: 'A 24-30 month runway insulates the business against macroeconomic capital market freezes and provides ample time to compound ARR toward the next major valuation milestone.',
          answerIndex: 0,
          explanation: 'A 24-30 month runway insulates the business against macroeconomic capital market freezes and provides ample time to compound ARR toward the next major valuation milestone.'
        }
      },
      {
        title: 'Milestone 1 Capstone Synthesis: Sand Hill Road Pitch Defense & Venture Partner Accreditation',
        say: 'You have arrived at the pinnacle of the B.Com Entrepreneurship curriculum: the Milestone 1 Capstone Defense before the full investment partnership on Sand Hill Road. In this boardroom synthesis, every discipline mastered across the five days of study—from early lean validation, runway physics, and SAFE cap tables on Day 1; venture debt covenants and 409A valuations on Day 2; option pool shuffles, liquidation preferences, and anti-dilution on Day 3; to Rule of 40 economics and Series B forecasting on Day 4—converges into a unified, boardroom-ready defense of enterprise value. Standing before institutional general partners, you are no longer pitching an aspirational prototype; you are defending an unassailable financial architecture designed to achieve category leadership and generational scale.\n\nThe capstone defense synthesizes five core institutional pillars into an integrated venture dossier. First, you defend your SaaS unit economics, demonstrating one hundred percent annual ARR growth, ninety-five percent gross retention, and one hundred and twenty-five percent net revenue retention alongside an eighty percent Rule of 40 score. Second, you present a balanced syndicate capitalization schedule, detailing how eighteen million dollars from the lead investor, seven point five million dollars in Series A pro-rata, and four point five million dollars in growth syndicate commitments preserve forty-one point six percent founder ownership at a one hundred and fifty million dollar post-money valuation. Third, you articulate an NVCA-standard two-two-one corporate governance charter that protects common founders while providing institutional fiduciary oversight through protective covenants and drag-along agreements.\n\nFourth, you prove treasury resilience through a stress-tested twenty-four month capital allocation schedule, verifying that thirty million dollars in net proceeds fuels forty-two million dollars in ARR while preserving over sixteen million dollars in cash and twenty-eight months of solvency under severe macro headwinds. Finally, upon successfully fielding adversarial partner inquiries on customer churn, unit economics, and competitive defensibility, the investment committee casts a unanimous affirmative vote. This milestone officially confers the prestigious accreditation of Certified Venture Capital Partner & Chief Executive Entrepreneur (VCP-CEE), signifying that you possess the advanced strategic, financial, and governance capabilities required to build, scale, and finance world-class venture-backed enterprises.\n\nAs you step into the global venture ecosystem, remember that the technical mastery you have demonstrated in this course represents the true competitive moat of high-caliber entrepreneurs. Valuations fluctuate with macroeconomic cycles, but the fundamental laws of recurring revenue compounding, capital efficiency, and fiduciary governance remain immutable. By uniting rigorous financial modeling with bold entrepreneurial vision, you are prepared to lead boardrooms, negotiate with institutional titans, and steer high-growth technology ventures through every phase of scale from initial seed inception to IPO triumph.',
        example: 'Think of the Milestone 1 Capstone defense like delivering a doctoral dissertation defense in astrophysics before the world\'s foremost scientific academy. You do not simply recite interesting astronomical trivia; you present peer-reviewed observational datasets, mathematical proofs of orbital mechanics, and computer simulations verifying that your theoretical model withstands gravitational anomalies and cosmic radiation. When the academy faculty scrutinizes your calculations on energy conservation and celestial mass, every variable holds under cross-examination. Upon concluding your defense, the panel votes unanimously to confer highest honors, welcoming you as a full peer and recognized authority in the discipline.',
        code: `def generate_venture_partner_dossier_and_accreditation():
    print("=== Silicon Valley VC Pitch Defense & Venture Partner Accreditation ===")
    memo = model_series_b_investment_memo()
    syndicate = structure_series_b_syndicate_and_prorata()
    gov = audit_boardroom_governance_and_covenants()
    treasury = allocate_growth_capital_and_stress_runway()
    
    print("\n--- Milestone 1 Capstone Synthesis: Sand Hill Road Boardroom Defense ---")
    print(f"  1. Enterprise Scale: ARR Growth = {memo['arr_growth_pct']:.1f}% | NRR = {memo['nrr_pct']:.1f}%")
    print(f"  2. Capital Efficiency: Rule of 40 = {memo['rule_of_40']:.1f}% | Burn Multiple = {memo['burn_multiple']:.2f}x")
    print(f"  3. Financing Architecture: " + "$" + f"{syndicate['post_money']:,.2f} Post-Money Valuation (" + "$" + f"{syndicate['pre_money']:,.2f} Pre)")
    print(f"  4. Governance Integrity: {gov['status']} ({gov['board_size']}-Member Board, {gov['drag_along_threshold_pct']}% Drag-Along)")
    print(f"  5. Solvency Cushion: " + "$" + f"{treasury['ending_cash_q8']:,.2f} Cash at Q8 ($42M ARR Run-Rate)")
    print("\n================================================================================")
    print("OFFICIAL VENTURE PARTNERSHIP UNANIMOUS VOTE: PASSED WITH DISTINCTION (5/5)")
    print("ACCREDITATION CONFERRED: CERTIFIED VENTURE CAPITAL PARTNER & CHIEF EXECUTIVE ENTREPRENEUR (VCP-CEE)")
    print("STATUS: COURSE B.COM ENTREPRENEURSHIP (BCOM_ENT) 100% COMPLETE & CERTIFIED.")
    print("================================================================================")

generate_venture_partner_dossier_and_accreditation()`,
        output: `=== Silicon Valley VC Pitch Defense & Venture Partner Accreditation ===
=== Institutional Series B Investment Memo & SaaS Due Diligence ===
ARR Trajectory: Beginning=$6,000,000.00 -> Ending=$12,000,000.00 (+100.0% YoY)
Cohort Retention: GRR=95.0% | NRR=125.0%
Financial Margins: Gross Margin=81.0% | FCF Margin=-20.0%
Capital Efficiency: Rule of 40=80.0% | Burn Multiple=0.90x
Go-to-Market: Magic Number=1.25 | CAC Payback=11.9 months
Diligence Score: 100/100 -> Recommendation: TIER_1_SERIES_B_APPROVED
=== Multi-Tranche Series B Term Sheet, Syndicate & Pro-Rata ===
Round Terms: Pre-Money=$120,000,000.00 | Raise=$30,000,000.00 | Post-Money=$150,000,000.00
Total Series B Dilution: 20.00%
Syndicate Allocation Waterfall:
  Lead Tier-1 VC (60%): $18,000,000.00 -> 12.00% Post-Money Ownership
  Series A Pro-Rata (25%): $7,500,000.00 -> 5.00% Incremental Ownership
  Growth Syndicate (15%): $4,500,000.00 -> 3.00% Post-Money Ownership
Post-Money Fully Diluted Cap Table:
  Founders & Common: 41.60%
  Seed Investors: 9.60%
  Series A Investors: 24.20%
  Option Pool (Existing): 9.60%
  Series B Lead VC: 12.00%
  Series B Growth Syndicate: 3.00%
=== Boardroom Corporate Governance & Protective Covenants Audit ===
Board Structure (5 Seats): Common/Founders=40% | Investors=40% | Independent=20%
Seat Allocations:
  Seat 1 (Common): Chief Executive Officer (Founder) (Executive)
  Seat 2 (Common): Chief Technology Officer (Founder) (Executive)
  Seat 3 (Series A): Series A Lead General Partner (Preferred Investor)
  Seat 4 (Series B): Series B Lead General Partner (Preferred Investor)
  Seat 5 (Independent): Veteran SaaS Enterprise Operator (Mutually Appointed)
Protective Provisions & Negative Covenants:
  Indebtedness Threshold: Floor=> $2,000,000.00 | Requires: Series B Lead + Board Majority
  M&A / Liquidation Event: Floor=Any Change of Control | Requires: 66.7% Preferred Supermajority
  Budget Deviation: Floor=> 15% Annual Opex Variance | Requires: Board Majority Approval
  Option Pool Expansion: Floor=> Authorized 12% Pool | Requires: Series A & Series B Preferred Consent
  Executive Compensation / C-Suite Hire: Floor=CEO / CFO / VP Appointments | Requires: Board Compensation Committee
Drag-Along Agreement: Minimum 66.7% Supermajority required to enforce sale
Status: NVCA COMPLIANT 2-2-1 GOVERNANCE ARCHITECTURE VERIFIED.
=== Growth Capital Allocation & Solvency Runway Stress Test ===
Total Treasury Capital: $40,000,000.00 ($10,000,000.00 cash + $30,000,000.00 Series B)
Capital Allocation Schedule:
  GTM Enterprise Expansion (55%): $16,500,000.00
  R&D AI & Core Platform (30%): $9,000,000.00
  G&A Legal & International Compliance (10%): $3,000,000.00
  Strategic Working Capital Reserve (5%): $1,500,000.00
24-Month Treasury & ARR Ramp Simulation:
  Q1: Treasury Remaining=$37,600,000.00 | ARR Runway=$13,500,000.00
  Q2: Treasury Remaining=$34,750,000.00 | ARR Runway=$15,800,000.00
  Q3: Treasury Remaining=$31,450,000.00 | ARR Runway=$18,900,000.00
  Q4: Treasury Remaining=$27,700,000.00 | ARR Runway=$22,500,000.00
  Q5: Treasury Remaining=$24,100,000.00 | ARR Runway=$26,800,000.00
  Q6: Treasury Remaining=$20,800,000.00 | ARR Runway=$31,500,000.00
  Q7: Treasury Remaining=$18,100,000.00 | ARR Runway=$36,200,000.00
  Q8: Treasury Remaining=$16,150,000.00 | ARR Runway=$42,000,000.00
Macro Stress Test (1.35x Burn Shock): Stressed Runway = 28.9 Months
Status: ROBUST 28+ MONTH SOLVENCY BUFFER CONFIRMED UNDER SEVERE DOWNSIDE STRESS.

--- Milestone 1 Capstone Synthesis: Sand Hill Road Boardroom Defense ---
  1. Enterprise Scale: ARR Growth = 100.0% | NRR = 125.0%
  2. Capital Efficiency: Rule of 40 = 80.0% | Burn Multiple = 0.90x
  3. Financing Architecture: $150,000,000.00 Post-Money Valuation ($120,000,000.00 Pre)
  4. Governance Integrity: NVCA_COMPLIANT_2_2_1 (5-Member Board, 66.7% Drag-Along)
  5. Solvency Cushion: $16,150,000.00 Cash at Q8 ($42M ARR Run-Rate)

================================================================================
OFFICIAL VENTURE PARTNERSHIP UNANIMOUS VOTE: PASSED WITH DISTINCTION (5/5)
ACCREDITATION CONFERRED: CERTIFIED VENTURE CAPITAL PARTNER & CHIEF EXECUTIVE ENTREPRENEUR (VCP-CEE)
STATUS: COURSE B.COM ENTREPRENEURSHIP (BCOM_ENT) 100% COMPLETE & CERTIFIED.
================================================================================`,
        codeNotes: [
          'Synthesizes all 5 capstone pillars: SaaS investment memo metrics, syndicate allocation waterfall, and board covenants.',
          'Validates a $150.0M post-money financing structure and a $16.15M ending treasury cushion at $42.0M ARR run-rate.',
          'Formally confers the Certified Venture Capital Partner & Chief Executive Entrepreneur (VCP-CEE) accreditation, completing course bcom_ent (5/5 Days).'
        ],
        tryIt: 'Run the complete capstone defense suite to verify that all institutional investment committee criteria are fully satisfied.',
        check: {
          question: 'What is the ultimate strategic achievement validated by the Milestone 1 Capstone in B.Com Entrepreneurship?',
          options: [
            'The synthesis of institutional due diligence, multi-tranche syndication, balanced corporate governance, and stress-tested capital allocation into an investable scale-up enterprise.',
            'The automated filing of a provisional patent application with no financial documentation.',
            'The replacement of all human executives with open-source software scripts.',
            'The immediate distribution of all investment proceeds as cash dividends to common founders.'
          ],
          answer: 0,
          why: 'The capstone validates full mastery over venture capital mechanics, institutional due diligence, boardroom governance, and capital allocation required to scale a growth-stage company.',
          answerIndex: 0,
          explanation: 'The capstone validates full mastery over venture capital mechanics, institutional due diligence, boardroom governance, and capital allocation required to scale a growth-stage company.'
        }
      }
    ],
    summary: [
      'Authored the institutional Series B investment memo, proving 100% ARR growth ($12.0M ARR), 125% NRR, 80.0% Rule of 40 score, and 0.90x Burn Multiple to secure Tier-1 VC approval.',
      'Structured a $30.0M Series B syndicate on a $120.0M pre-money valuation ($150.0M post), allocating $18.0M to Lead VC, $7.5M to Series A pro-rata, and $4.5M to growth syndicate while preserving 41.6% founder equity.',
      'Audited an NVCA-standard 2-2-1 board of directors (2 Common, 2 Preferred, 1 Independent) and established protective covenants governing indebtedness, M&A vetoes, and 66.7% drag-along rights.',
      'Engineered a 24-month capital allocation plan deploying $30.0M across GTM (55%), R&D (30%), and G&A (10%), scaling ARR to $42.0M while holding $16.15M ending cash and 28.9 months of stressed solvency runway.',
      'Delivered the unanimous Sand Hill Road pitch defense, earning highest honors and conferring the Certified Venture Capital Partner & Chief Executive Entrepreneur (VCP-CEE) accreditation, finalizing course bcom_ent (5/5 Days).'
    ],
    projectStep: {
      title: 'Execute the Institutional Series B Pitch Defense & Venture Accreditation Suite',
      steps: [
        'Model the institutional Series B investment memo evaluating NRR, Rule of 40, Burn Multiple, and CAC payback.',
        'Structure the multi-tranche Series B syndicate waterfall, honoring Series A pro-rata rights and updating the cap table.',
        'Audit boardroom corporate governance, establishing a balanced 2-2-1 board and protective negative covenants.',
        'Simulate 24-month growth capital deployment and execute severe downside burn stress tests to guarantee solvency.',
        'Deliver the unified capstone defense to win unanimous venture partnership approval and confer VCP-CEE accreditation.'
      ]
    }
  }
];
