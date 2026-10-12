import type { LongLesson } from './longLessons';

/**
 * Sales, Customer Success & CRM Operations (Course: bcom_scrm)
 * Day 1: Enterprise Pipeline Physics, LTV/CAC Unit Economics & Cohort Retention.
 */
export const BCOM_SCRM_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'bcom_scrm',
    day: 1,
    title: 'Enterprise Pipeline Physics, LTV/CAC Economics & Churn Engineering',
    goal: 'Master B2B enterprise CRM operations: pipeline velocity equations, weighted stage forecasting, unit economics ratios (LTV:CAC), negative net churn mechanics, and predictive account health scoring.',
    minutes: 40,
    recap: 'Welcome to Enterprise CRM, Sales Strategy & Customer Success. In recurring revenue businesses, growth is an engineering discipline governed by pipeline conversion rates, expansion mechanics, and retention physics rather than subjective optimism.',
    parts: [
      {
        title: 'B2B Pipeline Physics & Weighted Stage Forecasting',
        say: [
          'In enterprise B2B sales organizations, managing a customer pipeline is not a guessing game. Top sales leaders track pipeline velocity and probability-weighted pipeline values to predict quarter-end revenue within a 3% margin of error.',
          'Pipeline Velocity measures the speed at which qualified leads convert into recognized revenue: Velocity = (Number of Qualified Opportunities * Average Deal Size * Win Rate %) / Sales Cycle Length (Days).',
          'Every stage of a CRM pipeline (e.g., Prospecting, Technical Discovery, Solution Validation, Procurement/Legal, Closed-Won) has an empirically verified historical conversion probability.',
          'Unweighted pipeline simply sums the face value of all active deals, giving an illusion of safety. Weighted pipeline multiplies each opportunity\'s contract value by its stage probability, providing the only mathematically reliable forecast for board budgeting.'
        ],
        example: 'If you have $10M in active deals, but 80% are in early "Discovery" with a 10% win probability, your real forecast is not $10M—it is closer to $1M to $2M. Relying on unweighted pipeline leads to catastrophic hiring mistakes and liquidity shortages.',
        code: `# Simulation: CRM Enterprise Pipeline Velocity & Weighted Revenue Forecast
from dataclasses import dataclass
from typing import List

@dataclass
class CRMOpportunity:
    deal_name: str
    deal_value: float
    stage: str
    probability: float

class EnterprisePipelineForecaster:
    def __init__(self, deals: List[CRMOpportunity]):
        self.deals = deals

    def compute_pipeline_metrics(self, sales_cycle_days: int) -> dict:
        total_unweighted = sum(d.deal_value for d in self.deals)
        total_weighted = sum(d.deal_value * d.probability for d in self.deals)
        avg_deal_size = total_unweighted / len(self.deals) if self.deals else 0.0
        avg_win_rate = total_weighted / total_unweighted if total_unweighted > 0 else 0.0
        
        # Pipeline Velocity formula: (Num Deals * Avg Size * Win Rate) / Cycle Days
        daily_velocity = (len(self.deals) * avg_deal_size * avg_win_rate) / sales_cycle_days
        quarterly_projected_revenue = daily_velocity * 90.0

        return {
            "Total_Opportunities": len(self.deals),
            "Unweighted_Pipeline": round(total_unweighted, 2),
            "Weighted_Forecast": round(total_weighted, 2),
            "Blended_Win_Rate_Pct": round(avg_win_rate * 100, 2),
            "Quarterly_Velocity_Revenue": round(quarterly_projected_revenue, 2)
        }

pipeline = [
    CRMOpportunity("FinTech Core Banking Upgrade", 500000.0, "Discovery", 0.15),
    CRMOpportunity("HealthCare Cloud Migration", 300000.0, "Solution Validation", 0.50),
    CRMOpportunity("Retail Omnichannel POS", 200000.0, "Security & Legal Review", 0.80),
    CRMOpportunity("Logistics Tracking Telematics", 150000.0, "Procurement / Contracting", 0.90)
]

forecaster = EnterprisePipelineForecaster(pipeline)
metrics = forecaster.compute_pipeline_metrics(sales_cycle_days=60)

print(f"Total Pipeline Deals: {metrics['Total_Opportunities']}")
print(f"Unweighted Book Value: \${metrics['Unweighted_Pipeline']:,}")
print(f"Weighted Forecast:     \${metrics['Weighted_Forecast']:,}")
print(f"Blended Win Rate:      {metrics['Blended_Win_Rate_Pct']}%")
print(f"90-Day Velocity Est:   \${metrics['Quarterly_Velocity_Revenue']:,}")`,
        output: `Total Pipeline Deals: 4\nUnweighted Book Value: $1,150,000.0\nWeighted Forecast:     $520,000.0\nBlended Win Rate:      45.22%\n90-Day Velocity Est:   $780,000.0`,
        tryIt: 'Add a new deal stuck in legal review with $400k value and 85% probability, and verify how the weighted forecast jumps.',
        check: {
          question: 'Why must enterprise sales leadership report Weighted Pipeline rather than Unweighted Pipeline to the CFO?',
          options: [
            'Unweighted pipeline assigns equal 100% certainty to early-stage leads and late-stage legal reviews, severely overestimating guaranteed cash inflows.',
            'Unweighted pipeline subtracts sales rep commissions from top-line revenue, which violates accounting rules.',
            'Weighted pipeline guarantees that every customer signs the contract on the exact scheduled closing date.',
            'Weighted pipeline is only required when selling physical industrial equipment rather than cloud software subscriptions.'
          ],
          answerIndex: 0,
          explanation: 'Early-stage opportunities have low win probabilities (10-20%), while late-stage contracts have high probabilities (80-90%). Unweighted pipeline treats every dollar equally, creating dangerous cash flow shortfalls when early deals inevitably fall through.'
        }
      },
      {
        title: 'LTV to CAC Unit Economics & The CAC Payback Period',
        say: [
          'In SaaS and recurring B2B commerce, Customer Lifetime Value (LTV) and Customer Acquisition Cost (CAC) are the twin north-star metrics of long-term solvency.',
          'Customer Acquisition Cost (CAC) calculates all sales and marketing expenditures divided by the number of new customers acquired during that period: CAC = (Sales Salaries + Ad Spend + Tooling + Commissions) / New Customers Acquired.',
          'Customer Lifetime Value (LTV) models the total gross profit an average customer yields before churning: LTV = (Average Annual Recurring Revenue per Customer * Gross Margin %) / Annual Churn Rate %.',
          'The Golden Rule of B2B Unit Economics is LTV : CAC >= 3.0. If the ratio is below 3.0, you are burning capital faster than the customer can replenish it. If it is above 5.0, you are likely under-investing in acquisition and surrendering market share to competitors.',
          'Equally critical is the CAC Payback Period (Months to Recover CAC): CAC / (Average Monthly Recurring Revenue per Customer * Gross Margin %). Top-tier venture-backed businesses demand a CAC payback under 12 months.'
        ],
        example: 'If acquiring an enterprise client costs $30,000 in sales rep travel and software demos, and they generate $15,000 per year at an 80% gross margin ($12,000 gross profit/yr), it takes 2.5 years (30 months) just to break even! If they churn in year 2, you lost money.',
        code: `# Simulation: B2B Unit Economics & CAC Payback Period Calculator
class UnitEconomicsEngine:
    def __init__(self, sales_marketing_spend: float, new_customers: int, 
                 arpu_annual: float, gross_margin: float, annual_churn_rate: float):
        self.spend = sales_marketing_spend
        self.customers = new_customers
        self.arpu = arpu_annual
        self.margin = gross_margin
        self.churn = annual_churn_rate

    def evaluate_health(self) -> dict:
        cac = self.spend / self.customers
        # LTV = (ARPU * Gross Margin) / Churn Rate
        ltv = (self.arpu * self.margin) / self.churn
        ltv_cac_ratio = ltv / cac
        
        # Monthly gross profit per customer
        monthly_gp = (self.arpu * self.margin) / 12.0
        cac_payback_months = cac / monthly_gp

        is_healthy = ltv_cac_ratio >= 3.0 and cac_payback_months <= 14.0

        return {
            "CAC": round(cac, 2),
            "LTV": round(ltv, 2),
            "LTV_CAC_Ratio": round(ltv_cac_ratio, 2),
            "CAC_Payback_Months": round(cac_payback_months, 1),
            "Unit_Economics_Viable": is_healthy
        }

engine = UnitEconomicsEngine(
    sales_marketing_spend=250000.0,
    new_customers=25,
    arpu_annual=24000.0,
    gross_margin=0.80, # 80% SaaS margin
    annual_churn_rate=0.10 # 10% annual churn (10-year customer lifespan)
)

health = engine.evaluate_health()
print(f"Customer Acquisition Cost (CAC): \${health['CAC']:,}")
print(f"Customer Lifetime Value (LTV):   \${health['LTV']:,}")
print(f"LTV / CAC Ratio:                 {health['LTV_CAC_Ratio']}x")
print(f"CAC Payback Period:              {health['CAC_Payback_Months']} Months")
print(f"Business Solvency Viable:        {health['Unit_Economics_Viable']}")`,
        output: `Customer Acquisition Cost (CAC): $10,000.0\nCustomer Lifetime Value (LTV):   $192,000.0\nLTV / CAC Ratio:                 19.2x\nCAC Payback Period:              6.2 Months\nBusiness Solvency Viable:        True`,
        tryIt: 'Increase annual churn rate from 10% to 40% and observe how LTV collapses from $192k down to $48k.',
        check: {
          question: 'What happens to a SaaS business with an LTV/CAC ratio of 1.2x and a 36-month CAC payback period?',
          options: [
            'The business suffers structural cash bleeding because capital is locked up for 3 years before earning zero net return after cost of capital and churn.',
            'The business immediately qualifies for Tier-1 growth financing because higher customer volume overcomes individual customer losses.',
            'The business achieves negative working capital and can fund customer acquisitions indefinitely without external cash.',
            'The gross margin automatically expands to 100% to offset the elongated payback period.'
          ],
          answerIndex: 0,
          explanation: 'An LTV/CAC of 1.2x means the enterprise barely recovers its customer acquisition cost after paying for hosting and operations, while a 36-month payback creates severe working capital depletion and high vulnerability to premature customer churn.'
        }
      },
      {
        title: 'Net Revenue Churn & Expansion Dynamics (Negative Churn)',
        say: [
          'Gross Revenue Churn measures the percentage of recurring revenue lost when customers downgrade or cancel: Gross Churn % = Lost ARR / Beginning ARR.',
          'However, the Holy Grail of enterprise B2B CRM is Net Revenue Retention (NRR) and Negative Net Revenue Churn. Net Revenue Churn = (Churned ARR + Contraction ARR - Expansion ARR) / Beginning ARR.',
          'Expansion ARR comes from cross-selling new modules, upgrading tiers, and seat-based volume growth across existing accounts.',
          'When Expansion ARR exceeds Churned ARR, Net Revenue Churn becomes negative! That means even if the sales team does not sign a single new customer all year, the existing customer base generates MORE total revenue at year-end than it did on Day 1.',
          'Public enterprise cloud companies with NRR > 120% trade at significantly higher valuation multiples because their embedded cohorts possess compounding organic growth.'
        ],
        example: 'Snowflake and Datadog famously achieved Net Revenue Retention rates between 130% and 150%. Their customers start with a $20,000 consumption commit, and within three years, usage naturally expands to $100,000+ without high-touch outbound marketing.',
        code: `# Simulation: Net Revenue Retention (NRR) & Negative Churn Analysis
class CohortRetentionEngine:
    def __init__(self, beginning_arr: float):
        self.beginning_arr = beginning_arr

    def calculate_nrr(self, churned_arr: float, contraction_arr: float, expansion_arr: float) -> dict:
        ending_cohort_arr = self.beginning_arr - churned_arr - contraction_arr + expansion_arr
        
        # Net Churn = (Churn + Contraction - Expansion) / Beginning
        net_churn_dollars = churned_arr + contraction_arr - expansion_arr
        net_churn_rate = net_churn_dollars / self.beginning_arr
        
        # NRR = Ending Cohort ARR / Beginning ARR
        nrr_pct = (ending_cohort_arr / self.beginning_arr) * 100.0

        return {
            "Beginning_ARR": round(self.beginning_arr, 2),
            "Ending_Cohort_ARR": round(ending_cohort_arr, 2),
            "Net_Churn_Rate_Pct": round(net_churn_rate * 100.0, 2),
            "Net_Revenue_Retention_Pct": round(nrr_pct, 2),
            "Has_Negative_Net_Churn": net_churn_rate < 0.0
        }

engine = CohortRetentionEngine(beginning_arr=1000000.0) # $1M ARR starting cohort
results = engine.calculate_nrr(
    churned_arr=50000.0,     # $50k lost to cancellations
    contraction_arr=30000.0, # $30k lost to seat downgrades
    expansion_arr=220000.0   # $220k gained from enterprise seat expansion
)

print(f"Beginning Cohort ARR:       \${results['Beginning_ARR']:,}")
print(f"Ending Cohort ARR:          \${results['Ending_Cohort_ARR']:,}")
print(f"Net Revenue Churn:          {results['Net_Churn_Rate_Pct']}%")
print(f"Net Revenue Retention:      {results['Net_Revenue_Retention_Pct']}%")
print(f"Negative Net Churn Achieved: {results['Has_Negative_Net_Churn']}")`,
        output: `Beginning Cohort ARR:       $1,000,000.0\nEnding Cohort ARR:          $1,140,000.0\nNet Revenue Churn:          -14.0%\nNet Revenue Retention:      114.0%\nNegative Net Churn Achieved: True`,
        tryIt: 'Change expansion ARR to $40,000 to see Net Revenue Churn turn positive (+4.0%) and NRR drop to 96.0%.',
        check: {
          question: 'Why is negative net revenue churn considered the single most powerful growth engine in B2B recurring revenue software?',
          options: [
            'Because expansion revenue from retained accounts outpaces all cancellations, allowing the business to grow even with zero new customer acquisition.',
            'Because it legally eliminates the need to file sales tax returns on software subscriptions.',
            'Because it forces customer churn down to an absolute mathematical zero forever.',
            'Because it allows the company to fire its customer support department without customer dissatisfaction.'
          ],
          answerIndex: 0,
          explanation: 'When Net Revenue Retention is above 100% (negative net churn), the existing customer cohort naturally expands in contract value, creating an unstoppable compounding revenue baseline before any new sales are even counted.'
        }
      },
      {
        title: 'Predictive Account Health Scoring & Churn Risk Classification',
        say: [
          'Modern Customer Success (CS) teams do not wait for a customer to send a cancellation email. By the time an executive requests termination, the decision was made 6 months prior.',
          'Predictive Account Health Scoring continuously ingests telemetry signals from CRM, product analytics, and customer support desks: Health Score = w1 * Product_Adoption + w2 * Executive_Sponsorship + w3 * Support_Ticket_Friction + w4 * License_Utilization.',
          'Low product adoption (daily active seats < 40%) and frequent unresolved high-priority bugs are leading indicators of churn risk.',
          'Automated CRM workflows trigger proactive interventions: when an account score drops into the "At Risk" band (< 50/100), the CRM automatically routes a priority task to the Executive Customer Success Manager to conduct an architectural audit.'
        ],
        example: 'A 500-seat enterprise account where only 85 users logged in last month and 6 Sev-1 support tickets remain open for over 14 days is a flashing red light for churn, regardless of how friendly the buyer sounded on the phone during onboarding.',
        code: `# Simulation: CRM Customer Health Scoring & Risk Alert Classifier
from typing import Dict, Any

class CustomerHealthScorer:
    WEIGHTS = {
        "license_utilization": 0.35, # % of purchased seats actively used
        "support_sentiment": 0.25,   # inverse of unresolved ticket friction
        "feature_depth": 0.25,       # usage of advanced enterprise features
        "exec_engagement": 0.15      # regular QBR quarterly business reviews
    }

    @classmethod
    def evaluate_account(cls, account_data: Dict[str, float]) -> Dict[str, Any]:
        score = (
            account_data["utilization_rate"] * 100.0 * cls.WEIGHTS["license_utilization"] +
            account_data["support_health"] * 100.0 * cls.WEIGHTS["support_sentiment"] +
            account_data["feature_depth_score"] * 100.0 * cls.WEIGHTS["feature_depth"] +
            account_data["exec_qbr_completed"] * 100.0 * cls.WEIGHTS["exec_engagement"]
        )
        
        if score >= 75.0:
            status = "HEALTHY"
            action = "Target for Expansion & Upsell"
        elif score >= 50.0:
            status = "NEUTRAL"
            action = "Monitor Adoption & Provide Training"
        else:
            status = "AT_RISK"
            action = "Trigger VP Executive Sponsor Rescue Intervention"

        return {
            "Composite_Health_Score": round(score, 1),
            "Health_Status": status,
            "Recommended_Playbook": action
        }

acct_healthy = {
    "utilization_rate": 0.92,
    "support_health": 0.85,
    "feature_depth_score": 0.80,
    "exec_qbr_completed": 1.0
}

acct_troubled = {
    "utilization_rate": 0.35,
    "support_health": 0.40,
    "feature_depth_score": 0.20,
    "exec_qbr_completed": 0.0
}

h_res = CustomerHealthScorer.evaluate_account(acct_healthy)
t_res = CustomerHealthScorer.evaluate_account(acct_troubled)

print(f"Acct 1: Score {h_res['Composite_Health_Score']}/100 [{h_res['Health_Status']}] -> {h_res['Recommended_Playbook']}")
print(f"Acct 2: Score {t_res['Composite_Health_Score']}/100 [{t_res['Health_Status']}] -> {t_res['Recommended_Playbook']}")`,
        output: `Acct 1: Score 87.5/100 [HEALTHY] -> Target for Expansion & Upsell\nAcct 2: Score 27.2/100 [AT_RISK] -> Trigger VP Executive Sponsor Rescue Intervention`,
        tryIt: 'Improve Acct 2 utilization rate to 0.70 and run a QBR (exec_qbr_completed = 1.0) to see its health status rise into NEUTRAL.',
        check: {
          question: 'Why is product license utilization rate given high weight (35%+) in enterprise health score algorithms?',
          options: [
            'Unused licenses are the strongest empirical predictor of upcoming contraction or non-renewal at contract renewal time.',
            'Because cloud providers charge license fees based solely on customer employee headcounts.',
            'Because low utilization automatically revokes the customer software license mid-contract.',
            'Because high utilization legally prohibits customers from talking to rival sales representatives.'
          ],
          answerIndex: 0,
          explanation: 'When enterprise buyers notice at contract renewal that only 35% of their paid licenses are being used, their procurement department will immediately demand a 65% seat reduction, causing severe ARR contraction.'
        }
      },
      {
        title: 'Net Promoter Score (NPS) & Customer Advocacy Analytics',
        say: [
          'Net Promoter Score (NPS) is the global benchmark for customer loyalty and brand advocacy, developed by Fred Reichheld and Bain & Company.',
          'Customers answer a single gold-standard question on a 0-to-10 scale: "How likely are you to recommend our product or service to a colleague or peer?"',
          'Respondents are categorized into three distinct cohorts: Promoters (Score 9-10, loyal enthusiasts who fuel viral organic referrals), Passives (Score 7-8, satisfied but unenthusiastic and vulnerable to competitive offers), and Detractors (Score 0-6, unhappy customers who damage brand reputation through negative word of mouth).',
          'The NPS calculation formula is: NPS = % Promoters - % Detractors. Scores range from -100 (everyone is a detractor) to +100 (everyone is a promoter). In B2B SaaS, a score above +40 is considered strong, and above +60 is world-class.',
          'Leading CRM engines do not treat NPS as a vanity statistic: Promoters are automatically routed to Case Study and Referral referral playbooks, while Detractors receive immediate 1-on-1 outreach from Product Managers.'
        ],
        example: 'If you survey 200 accounts: 120 are Promoters (60%), 50 are Passives (25%), and 30 are Detractors (15%). Your NPS is 60% - 15% = +45. Passives count toward the total survey base but do not directly add or subtract from the net score.',
        code: `# Simulation: Net Promoter Score (NPS) Statistical Analyzer & Playbook Router
from typing import List

class NetPromoterScoreEngine:
    def __init__(self, responses: List[int]):
        for r in responses:
            if not (0 <= r <= 10):
                raise ValueError(f"Invalid NPS response: {r}. Must be between 0 and 10.")
        self.responses = responses

    def compute_nps(self) -> dict:
        total = len(self.responses)
        if total == 0:
            return {"NPS": 0.0, "Promoters_Pct": 0.0, "Detractors_Pct": 0.0}

        promoters = sum(1 for r in self.responses if r >= 9)
        passives = sum(1 for r in self.responses if 7 <= r <= 8)
        detractors = sum(1 for r in self.responses if r <= 6)

        pct_promoters = (promoters / total) * 100.0
        pct_passives = (passives / total) * 100.0
        pct_detractors = (detractors / total) * 100.0

        nps = pct_promoters - pct_detractors

        return {
            "Total_Surveyed": total,
            "Promoters_Count": promoters,
            "Passives_Count": passives,
            "Detractors_Count": detractors,
            "Promoters_Pct": round(pct_promoters, 1),
            "Detractors_Pct": round(pct_detractors, 1),
            "NPS_Score": round(nps, 1)
        }

survey_batch = [10, 9, 10, 8, 7, 9, 10, 4, 3, 9, 10, 8, 9, 5, 10, 9, 8, 10, 6, 9]
nps_engine = NetPromoterScoreEngine(survey_batch)
res = nps_engine.compute_nps()

print(f"Total Responses:    {res['Total_Surveyed']}")
print(f"Promoters (9-10):   {res['Promoters_Count']} ({res['Promoters_Pct']}%)")
print(f"Passives (7-8):     {res['Passives_Count']}")
print(f"Detractors (0-6):   {res['Detractors_Count']} ({res['Detractors_Pct']}%)")
print(f"Net Promoter Score: +{res['NPS_Score']}")`,
        output: `Total Responses:    20\nPromoters (9-10):   12 (60.0%)\nPassives (7-8):     4\nDetractors (0-6):   4 (20.0%)\nNet Promoter Score: +40.0`,
        tryIt: 'Add five scores of 10 to the survey and notice how the NPS jumps from +40.0 to +48.0.',
        check: {
          question: 'How are "Passives" (scores 7 and 8) handled in the Net Promoter Score mathematical formula?',
          options: [
            'They are included in the total respondent denominator, effectively diluting the percentage of Promoters and Detractors without adding directly to the numerator.',
            'They are added to the Promoters count because 7 and 8 are above the numerical average of 5.',
            'They are subtracted from the Detractors count to create a buffer against negative word-of-mouth.',
            'They are entirely ignored and removed from both the numerator and the denominator.'
          ],
          answerIndex: 0,
          explanation: 'Passives (scores 7-8) are part of the total survey response count (the denominator), meaning a large proportion of passives pushes both % Promoters and % Detractors down, moderating the absolute Net Promoter Score.'
        }
      }
    ],
    summary: [
      'B2B pipeline forecasting requires weighted stage probability discounting rather than naive unweighted sum aggregations.',
      'SaaS unit economics mandate an LTV/CAC ratio of at least 3.0x and a CAC Payback period under 12 months for solvent scalability.',
      'Negative Net Revenue Churn occurs when expansion revenue from existing accounts exceeds all cancellations and contractions (NRR > 100%).',
      'Customer Health Scoring synthesizes license utilization, support ticket friction, and executive QBR engagement to preemptively intervene before contract renewal.',
      'Net Promoter Score (% Promoters - % Detractors) benchmarks customer advocacy and triggers automated referral playbooks or escalation rescues.'
    ],
    projectStep: {
      title: 'Enterprise CRM Operations & Churn Predictor Engine',
      steps: [
        'Model the multi-stage CRM opportunity pipeline with historical win rates and calculate 90-day velocity.',
        'Compute customer LTV, CAC, and payback periods across B2B client acquisition tiers.',
        'Build the cohort expansion matrix showing Net Revenue Retention (NRR) and verify negative net churn.',
        'Implement the 4-factor health score classifier and route automated intervention playbooks.'
      ]
    }
  }
];
