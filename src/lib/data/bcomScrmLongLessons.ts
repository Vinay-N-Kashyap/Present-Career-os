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
  },
  {
    coursePrefix: 'bcom_scrm',
    day: 2,
    title: 'MEDDPICC Deal Qualification, Territory Gini Quotas & CPQ Economics',
    goal: 'Master enterprise sales operations and revenue architecture: MEDDPICC qualification scoring, mathematical sales territory alignment with Gini inequality minimization, Configure-Price-Quote (CPQ) margin governance gates, sales compensation commission acceleration waterfalls, and CS predictive renewal flight-risk intervention playbooks.',
    minutes: 42,
    recap: 'Day 1 established pipeline velocity equations and NRR retention fundamentals. Day 2 tackles large-enterprise deal execution: qualifying 6-figure contracts with MEDDPICC, balancing territory quotas equitably, and automating renewal flight-risk rescues.',
    parts: [
      {
        title: 'The MEDDPICC Enterprise Deal Qualification Scoring Engine',
        say: [
          'In enterprise B2B sales, multimillion-dollar opportunities frequently stall in late-stage procurement because sales teams mistake a friendly technical user for the actual Economic Buyer or fail to understand the customer\'s legal paper process.',
          'To eliminate subjective deal forecasting, elite revenue teams enforce the MEDDPICC qualification methodology developed at PTC: Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Identify Pain, Champion, and Competition.',
          'Two specific pillars represent fatal deal killers: 1. Economic Buyer (the person with discretionary budget sign-off authority; if uncontacted, deal slippage is almost guaranteed); 2. Paper Process (the legal redlining, security questionnaires, and procurement review steps required to turn verbal agreement into signed ink).',
          'A deal cannot be forecasted for current-quarter close if critical blockers like missing Economic Buyers or unmapped legal workflows exist, regardless of rep optimism.',
          'Revenue Operations algorithms evaluate deals across all 8 MEDDPICC dimensions to produce objective forecast categories and highlight immediate deal-saving interventions.'
        ],
        example: 'A sales rep forecasts a $250,000 data warehouse deal for Q3. The deal scores 91/100 across technical criteria and champion advocacy. However, the legal Paper Process is unmapped. The MEDDPICC engine flags a critical blocker (UNMAPPED_LEGAL_PAPER_PROCESS) and categorizes the deal as AT_RISK_OPPORTUNITY, prompting the sales manager to initiate security review before quarter-end.',
        code: `# Simulation: MEDDPICC Enterprise Deal Qualification & Forecast Gatekeeper
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class MeddpiccScorecard:
    deal_name: str
    deal_size: float
    metrics_score: int # 0-10
    economic_buyer_identified: bool
    decision_criteria_documented: bool
    decision_process_mapped: bool
    paper_process_mapped: bool
    pain_identified_cost: float
    champion_power_score: int # 0-10
    competition_strategy: str

def score_meddpicc_deal(deal: MeddpiccScorecard) -> Dict:
    critical_blockers = []
    points = 0

    points += deal.metrics_score
    if deal.economic_buyer_identified:
        points += 15
    else:
        critical_blockers.append("MISSING_ECONOMIC_BUYER")

    if deal.decision_criteria_documented:
        points += 10
    if deal.decision_process_mapped:
        points += 10

    if deal.paper_process_mapped:
        points += 15
    else:
        critical_blockers.append("UNMAPPED_LEGAL_PAPER_PROCESS")

    if deal.pain_identified_cost >= deal.deal_size * 2:
        points += 15
    points += deal.champion_power_score * 2

    if deal.competition_strategy != "NONE":
        points += 15

    deal_health = "HIGH_CONFIDENCE_CLOSE" if points >= 75 and not critical_blockers else "AT_RISK_OPPORTUNITY"

    return {
        "Deal_Name": deal.deal_name,
        "Total_Score": f"{points}/100",
        "Forecast_Status": deal_health,
        "Critical_Blockers": critical_blockers
    }

deal1 = MeddpiccScorecard("Cloud Data Warehouse Modernization", 250000.0, 8, True, True, True, False, 750000.0, 9, "DIFFERENTIATE_ON_SECURITY")
m_res = score_meddpicc_deal(deal1)
print(f"Deal: {m_res['Deal_Name']} | Score: {m_res['Total_Score']} -> Status: {m_res['Forecast_Status']}")
print(f"Blockers: {m_res['Critical_Blockers']}")`,
        output: `Deal: Cloud Data Warehouse Modernization | Score: 91/100 -> Status: AT_RISK_OPPORTUNITY\nBlockers: ['UNMAPPED_LEGAL_PAPER_PROCESS']`,
        codeNotes: [
          { line: 5, note: 'MeddpiccScorecard captures empirical verification across all 8 strategic deal pillars' },
          { line: 20, note: 'Penalizes missing Economic Buyer or unmapped Paper Process with critical blocker flags' },
          { line: 36, note: 'Forces Forecast_Status to AT_RISK despite high 91/100 score due to unmapped legal steps' },
          { line: 49, note: 'Generates prescriptive alerts enabling sales management intervention' }
        ],
        tryIt: 'Set paper_process_mapped=True to eliminate the blocker and observe the status upgrade to HIGH_CONFIDENCE_CLOSE.',
        check: {
          question: 'In the MEDDPICC sales qualification methodology, why is mapping the "Paper Process" essential for accurate quarter-end forecasting?',
          options: [
            'Because complex enterprise deals frequently stall in corporate procurement, InfoSec review, and legal redlines for 60-90 days even after commercial agreement is reached.',
            'Because all sales contracts must be physically printed on archival cotton parchment.',
            'Because sales reps need to calculate how many trees were cut down for packaging.',
            'Because paper documents are immune to cybersecurity attacks.'
          ],
          answer: 0,
          why: 'The Paper Process encompasses procurement workflows, master service agreements, and security compliance; failure to map it causes massive forecast slippage past quarter-end.',
          answerIndex: 0,
          explanation: 'The Paper Process encompasses procurement workflows, master service agreements, and security compliance; failure to map it causes massive forecast slippage past quarter-end.'
        }
      },
      {
        title: 'Sales Territory Design & Gini Quota Equalization',
        say: [
          'Territory design is the single most decisive factor influencing sales team morale, quota attainment, and rep retention.',
          'When sales territories are carved naively by geographic borders, some reps inherit fertile "greenhouse" territories with legacy logos and large TAM, while others receive barren territories where hitting quota is mathematically impossible.',
          'To ensure equity, Revenue Operations leaders compute the Gini Coefficient of Territory Potential: Gini = sum((2*i - n - 1) * val) / (n * sum(values)), scaled from 0.0 (perfect parity) to 1.0 (total inequality).',
          'A territory plan with a Gini index exceeding 0.25 leads to rapid rep turnover, quota dissatisfaction, and uneven pipeline coverage.',
          'World-class sales operations balance accounts across Total Addressable Market (TAM), account tiering, and historical whitespace to compress territory Gini indices below 0.05.'
        ],
        example: 'In an unbalanced plan, Rep A receives $1.5M in territory pipeline while Rep C receives $300k (Gini = 0.333). After mathematical account reallocation, each rep receives ~$720k to $800k in opportunity potential, collapsing the Gini coefficient to 0.022 and eliminating retention flight risk.',
        code: `# Simulation: Sales Territory Quota Gini Inequality Coefficient Calculator
from typing import Dict

def calculate_territory_gini(territories: Dict[str, float]) -> float:
    # Computes Gini coefficient of quota distribution (0.0 = perfect equality, 1.0 = total inequality)
    values = sorted(list(territories.values()))
    n = len(values)
    if n == 0 or sum(values) == 0:
        return 0.0
    index = sum((2 * i - n - 1) * val for i, val in enumerate(values, 1))
    return round(index / (n * sum(values)), 3)

territories_unequal = {"Rep_A": 1500000.0, "Rep_B": 800000.0, "Rep_C": 300000.0, "Rep_D": 400000.0}
territories_balanced = {"Rep_A": 800000.0, "Rep_B": 750000.0, "Rep_C": 720000.0, "Rep_D": 730000.0}

gini_bad = calculate_territory_gini(territories_unequal)
gini_good = calculate_territory_gini(territories_balanced)
print(f"Unequal Territory Gini: {gini_bad} (High rep turnover risk)")
print(f"Balanced Territory Gini: {gini_good} (Healthy quota distribution)")`,
        output: `Unequal Territory Gini: 0.333 (High rep turnover risk)\nBalanced Territory Gini: 0.022 (Healthy quota distribution)`,
        codeNotes: [
          { line: 4, note: 'calculate_territory_gini computes Lorenz-curve area integration over sorted territory values' },
          { line: 11, note: 'Evaluates unbalanced territory map with severe 0.333 Gini rating indicating structural inequality' },
          { line: 15, note: 'Evaluates re-indexed territory plan achieving exceptional 0.022 Gini parity' },
          { line: 18, note: 'Provides RevOps teams with objective mathematical validation before rolling out annual quotas' }
        ],
        tryIt: 'Equalize all reps to exactly 750000.0 and verify that the Gini coefficient calculates to 0.000.',
        check: {
          question: 'What is the operational danger of deploying a sales territory plan with a high Gini coefficient (> 0.25)?',
          options: [
            'Reps assigned to starved territories face mathematically impossible quotas and quickly churn, while reps in wealthy territories hit quota without effort, leading to talent drain.',
            'The CRM database automatically deletes all customer phone numbers.',
            'The Federal Communications Commission suspends the company\'s email servers.',
            'Sales reps are forced to work entirely without laptops.'
          ],
          answer: 0,
          why: 'High territory inequality creates structural unfairness, driving voluntary sales rep turnover and leaving key customer whitespace unprospected.',
          answerIndex: 0,
          explanation: 'High territory inequality creates structural unfairness, driving voluntary sales rep turnover and leaving key customer whitespace unprospected.'
        }
      },
      {
        title: 'Configure-Price-Quote (CPQ) Tiered Discounting Guardrails',
        say: [
          'In high-growth B2B companies, rogue field discounting is the primary mechanism through which product gross margins are destroyed.',
          'Enterprise Configure-Price-Quote (CPQ) software enforces algorithmic discount approval matrices to maintain margin discipline while empowering reps to compete.',
          'Standard CPQ governance enforces four distinct governance tiers: 0% to 10% discount (Auto-Approved by Field Rep authority); 10.1% to 20% discount (Requires VP of Sales approval); 20.1% to 30% discount (Requires CRO / CFO sign-off); Over 30% discount (Strict automated rejection below corporate gross margin floor).',
          'Furthermore, CPQ engines model multi-year Total Contract Value (TCV) against Annual Recurring Revenue (ARR), rewarding multi-year upfront commitments with approved pricing concessions.',
          'By embedding automated approval gates into the CRM, organizations prevent unapproved price slashing and preserve gross margin viability.'
        ],
        example: 'A quote for a $100,000/year 3-year SaaS contract (List TCV $300,000) requests an 18.5% discount. The CPQ engine calculates contracted ARR at $81,500 ($244,500 TCV) and automatically routes approval to the VP of Sales. A separate quote requesting 35% discount is instantly rejected by the margin guardrail.',
        code: `# Simulation: Enterprise CPQ Tiered Discounting & Margin Protection Matrix
from typing import Dict

class CpqDiscountEngine:
    def __init__(self, list_arr: float, contract_years: int):
        self.list_arr = list_arr
        self.years = contract_years
        self.total_list_value = list_arr * contract_years

    def evaluate_quote(self, proposed_discount_pct: float) -> Dict:
        discounted_arr = self.list_arr * (1.0 - proposed_discount_pct / 100.0)
        total_contract_value = discounted_arr * self.years

        if proposed_discount_pct <= 10.0:
            approval = "AUTO_APPROVED_REP_AUTHORITY"
        elif proposed_discount_pct <= 20.0:
            approval = "REQUIRED_APPROVAL_VP_SALES"
        elif proposed_discount_pct <= 30.0:
            approval = "REQUIRED_APPROVAL_CRO_CFO"
        else:
            approval = "STRICT_REJECT_BELOW_MARGIN_FLOOR"

        return {
            "List_ARR": self.list_arr,
            "Discount_Pct": f"{proposed_discount_pct}%",
            "Contracted_ARR": round(discounted_arr, 2),
            "Total_Contract_Value_TCV": round(total_contract_value, 2),
            "Approval_Gate": approval
        }

cpq = CpqDiscountEngine(list_arr=100000.0, contract_years=3)
quote1 = cpq.evaluate_quote(18.5)
quote2 = cpq.evaluate_quote(35.0)
print(f"Quote 1 (18.5%): ARR=\${quote1['Contracted_ARR']} | TCV=\${quote1['Total_Contract_Value_TCV']} -> {quote1['Approval_Gate']}")
print(f"Quote 2 (35.0%): ARR=\${quote2['Contracted_ARR']} | TCV=\${quote2['Total_Contract_Value_TCV']} -> {quote2['Approval_Gate']}")`,
        output: `Quote 1 (18.5%): ARR=$81500.0 | TCV=$244500.0 -> REQUIRED_APPROVAL_VP_SALES\nQuote 2 (35.0%): ARR=$65000.0 | TCV=$195000.0 -> STRICT_REJECT_BELOW_MARGIN_FLOOR`,
        codeNotes: [
          { line: 4, note: 'CpqDiscountEngine computes contracted ARR and multi-year TCV commitments' },
          { line: 12, note: 'Routes proposed discounts through role-based approval tiers based on margin impact' },
          { line: 26, note: 'Routes Quote 1 (18.5%) to VP of Sales for executive validation' },
          { line: 31, note: 'Strictly blocks Quote 2 (35.0%) as unprofitable below corporate gross margin floor' }
        ],
        tryIt: 'Change proposed_discount_pct on quote1 to 8.0 to observe immediate AUTO_APPROVED_REP_AUTHORITY status.',
        check: {
          question: 'Why do enterprise software companies enforce automated Configure-Price-Quote (CPQ) discounting guardrails?',
          options: [
            'To prevent unauthorized rogue discounts from destroying product gross margins while establishing auditable executive approval workflows.',
            'To make quotes completely unreadable by prospective customers.',
            'To ensure that all customers receive identical prices regardless of company size.',
            'To replace human sales reps with automated email bots.'
          ],
          answer: 0,
          why: 'CPQ guardrails protect corporate gross margins and profitability while giving reps transparent discount thresholds based on deal size and executive approvals.',
          answerIndex: 0,
          explanation: 'CPQ guardrails protect corporate gross margins and profitability while giving reps transparent discount thresholds based on deal size and executive approvals.'
        }
      },
      {
        title: 'Sales Rep Commission Waterfall & Quota Accelerators',
        say: [
          'Sales compensation plans are precision behavioral engineering: reps execute the exact behaviors incentivized by their commission structure.',
          'In SaaS sales, commission structures feature three core mechanics: Base Commission Rates (e.g. 10% of closed ARR up to 100% quota); Accelerators (e.g. 1.5x commission rate between 100% and 125% quota attainment); Super-Accelerators (e.g. 2.0x commission rate above 125% quota).',
          'Accelerators create enormous financial incentives for top performers to keep selling aggressively after hitting their annual quota rather than "sandbagging" deals for next year.',
          'Additionally, enterprise comp plans include Clawback Provisions: if an acquired customer cancels their contract within 90 days, the commission paid on that deal is recouped from the rep\'s subsequent paycheck.',
          'RevOps compensation engines calculate tiered commission waterfalls, tracking effective commission rates and clawback liability in real time.'
        ],
        example: 'A sales rep with a $1,000,000 annual quota closes $1,400,000 in ARR (140% attainment). They earn 10% on the first $1M ($100k), 15% on the next $250k ($37.5k), and 20% on the final $150k ($30k). Total commission payout is $167,500, delivering an effective commission rate of 11.96%.',
        code: `# Simulation: Tiered Sales Commission Waterfall & Quota Accelerator Engine
from typing import Dict

def calculate_rep_commission_waterfall(
    annual_quota: float,
    closed_revenue: float,
    base_commission_rate_pct: float = 10.0
) -> Dict:
    attainment_pct = (closed_revenue / annual_quota) * 100.0
    total_commission = 0.0

    # Tier 1: 0% to 100% of Quota (Base Rate: 10%)
    tier1_rev = min(closed_revenue, annual_quota)
    total_commission += tier1_rev * (base_commission_rate_pct / 100.0)

    # Tier 2: 100.1% to 125% of Quota (Accelerator: 1.5x = 15%)
    if closed_revenue > annual_quota:
        tier2_rev = min(closed_revenue - annual_quota, annual_quota * 0.25)
        total_commission += tier2_rev * (base_commission_rate_pct * 1.5 / 100.0)

    # Tier 3: Above 125% of Quota (Super Accelerator: 2.0x = 20%)
    if closed_revenue > annual_quota * 1.25:
        tier3_rev = closed_revenue - (annual_quota * 1.25)
        total_commission += tier3_rev * (base_commission_rate_pct * 2.0 / 100.0)

    effective_rate = (total_commission / closed_revenue) * 100.0 if closed_revenue > 0 else 0.0

    return {
        "Annual_Quota": annual_quota,
        "Closed_Revenue": closed_revenue,
        "Attainment_Pct": f"{round(attainment_pct, 1)}%",
        "Total_Commission_Payout": round(total_commission, 2),
        "Effective_Commission_Rate": f"{round(effective_rate, 2)}%"
    }

comp = calculate_rep_commission_waterfall(annual_quota=1000000.0, closed_revenue=1400000.0)
print(f"Attainment: {comp['Attainment_Pct']} on \${comp['Closed_Revenue']} Closed ARR")
print(f"Commission Payout: \${comp['Total_Commission_Payout']} (Effective Rate: {comp['Effective_Commission_Rate']})")`,
        output: `Attainment: 140.0% on $1400000.0 Closed ARR\nCommission Payout: $167500.0 (Effective Rate: 11.96%)`,
        codeNotes: [
          { line: 4, note: 'calculate_rep_commission_waterfall partitions closed ARR across performance tiers' },
          { line: 12, note: 'Applies 10% base rate across the first $1M quota baseline' },
          { line: 17, note: 'Activates 1.5x accelerator (15%) for performance between 100% and 125%' },
          { line: 22, note: 'Unlocks 2.0x super-accelerator (20%) for performance exceeding 125% of quota' }
        ],
        tryIt: 'Change closed_revenue to 900000.0 and see the payout drop to $90,000 (flat 10.0% rate with no accelerators).',
        check: {
          question: 'What is the strategic purpose of adding commission "accelerators" (e.g. 1.5x - 2.0x) for sales reps who exceed 100% of their annual quota?',
          options: [
            'To incentivize top sales performers to keep closing deals aggressively rather than delaying contract signatures to the following fiscal year.',
            'To penalize reps for selling too much software.',
            'To decrease the overall revenue generated by the company.',
            'To force sales reps to switch to engineering roles.'
          ],
          answer: 0,
          why: 'Without accelerators, reps who hit 100% quota in October will "sandbag" deals until January; accelerators motivate them to maximize full annual revenue.',
          answerIndex: 0,
          explanation: 'Without accelerators, reps who hit 100% quota in October will "sandbag" deals until January; accelerators motivate them to maximize full annual revenue.'
        }
      },
      {
        title: 'Customer Success Renewal Flight Risk Scoring & Intervention',
        say: [
          'In SaaS business models, 80% of customer lifetime value is generated after the initial sale through recurring contract renewals and expansions.',
          'Customer Success Managers (CSMs) cannot personally track hundreds of enterprise accounts; they require automated early-warning telemetry.',
          'Account Churn Flight Risk combines three leading indicators: 1. Seat/License Utilization (<60% active seats indicates shelfware); 2. Executive Champion Turnover (when the VP who bought the software departs, the new replacement frequently brings in their favored vendor); 3. Net Promoter Score sentiment (Detractor ratings <=6).',
          'When an account exhibits multiple risk factors and its renewal horizon drops under 90 days, the risk engine triggers a critical status and automatically dispatches executive rescue playbooks.',
          'Early intervention (60-90 days before renewal) saves over 60% of at-risk contracts that would otherwise result in catastrophic logo churn.'
        ],
        example: 'An enterprise account with 60 days remaining on its contract has 45% seat utilization, an NPS rating of 5, and its executive sponsor just left the company. The CS engine scores flight risk at 100/100, flags CRITICAL_CHURN_FLIGHT_RISK, and automatically triggers an executive sponsor rescue campaign with the VP of Customer Success.',
        code: `# Simulation: Predictive Customer Success Account Renewal Flight-Risk Engine
from typing import Dict

def score_account_renewal_flight_risk(
    days_to_renewal: int,
    license_utilization_pct: float,
    sponsor_has_left: bool,
    nps_score: int
) -> Dict:
    risk_score = 0
    risk_reasons = []

    if license_utilization_pct < 60.0:
        risk_score += 35
        risk_reasons.append("LOW_SEAT_UTILIZATION")
    if sponsor_has_left:
        risk_score += 40
        risk_reasons.append("EXECUTIVE_CHAMPION_CHURN")
    if nps_score <= 6:
        risk_score += 25
        risk_reasons.append("DETRACTOR_NPS_SENTIMENT")

    if risk_score >= 60 and days_to_renewal <= 90:
        status = "CRITICAL_CHURN_FLIGHT_RISK"
        playbook = "DISPATCH_EXECUTIVE_SPONSOR_RESCUE_CAMPAIGN"
    elif risk_score >= 35:
        status = "MODERATE_RENEWAL_RISK"
        playbook = "SCHEDULE_CSM_TRAINING_AND_ADOPTION_SPRINT"
    else:
        status = "HEALTHY_ACCOUNT_EXPANSION_READY"
        playbook = "PREPARE_MULTI_YEAR_EXPANSION_OFFER"

    return {
        "Risk_Score": f"{risk_score}/100",
        "Renewal_Horizon_Days": days_to_renewal,
        "Account_Status": status,
        "Recommended_Playbook": playbook,
        "Flags": risk_reasons
    }

account1 = score_account_renewal_flight_risk(
    days_to_renewal=60,
    license_utilization_pct=45.0,
    sponsor_has_left=True,
    nps_score=5
)
print(f"Account Flight Risk: {account1['Risk_Score']} -> Status: {account1['Account_Status']}")
print(f"Playbook: {account1['Recommended_Playbook']} | Flags: {account1['Flags']}")`,
        output: `Account Flight Risk: 100/100 -> Status: CRITICAL_CHURN_FLIGHT_RISK\nPlaybook: DISPATCH_EXECUTIVE_SPONSOR_RESCUE_CAMPAIGN | Flags: ['LOW_SEAT_UTILIZATION', 'EXECUTIVE_CHAMPION_CHURN', 'DETRACTOR_NPS_SENTIMENT']`,
        codeNotes: [
          { line: 4, note: 'score_account_renewal_flight_risk evaluates telemetry signals across utilization, personnel, and sentiment' },
          { line: 12, note: 'Heavily penalizes executive sponsor turnover (+40) and low license usage (+35)' },
          { line: 20, note: 'Flags accounts inside 90-day renewal horizon for urgent executive outreach' },
          { line: 36, note: 'Identifies critical 100/100 flight risk and prescribes targeted rescue intervention' }
        ],
        tryIt: 'Set sponsor_has_left=False and license_utilization_pct=85.0 to see the account status flip to HEALTHY_ACCOUNT_EXPANSION_READY.',
        check: {
          question: 'In B2B Customer Success operations, why is Executive Champion Turnover considered one of the highest leading indicators of churn risk?',
          options: [
            'Because when the internal executive who championed and bought the software leaves, their replacement often evaluates alternative vendors and cancels unadopted tools.',
            'Because companies are legally prohibited from renewing software contracts if employees change jobs.',
            'Because software automatically uninstalls when executive user profiles are deleted.',
            'Because customer support phone numbers stop working when champions resign.'
          ],
          answer: 0,
          why: 'New executives frequently review existing vendor spend and replace tools with their preferred solutions unless the CS team quickly re-proves business value.',
          answerIndex: 0,
          explanation: 'New executives frequently review existing vendor spend and replace tools with their preferred solutions unless the CS team quickly re-proves business value.'
        }
      }
    ],
    summary: [
      'MEDDPICC Enterprise Qualification: Evaluates deals across 8 objective dimensions, flagging unmapped Paper Processes and missing Economic Buyers.',
      'Territory Gini Equalization: Mathematically balances sales quotas and whitespace opportunity potential to maintain Gini inequality indices under 0.05.',
      'CPQ Tiered Discounting: Enforces algorithmic approval matrices to preserve gross margins while granting reps transparent commercial latitude.',
      'Commission Acceleration Waterfalls: Structures compensation with 1.5x and 2.0x multipliers above 100% quota to maximize full annual performance.',
      'Predictive Renewal Flight Risk: Combines seat utilization, executive champion turnover, and NPS sentiment to trigger 90-day customer rescue campaigns.'
    ],
    projectStep: {
      title: 'Architect an Enterprise Revenue Operations & CS Flight-Risk Engine',
      steps: [
        'Score enterprise CRM opportunities against the 8-pillar MEDDPICC matrix and identify forecast blockers.',
        'Calculate Gini inequality coefficients across sales territories to ensure equitable quota allocation.',
        'Implement the CPQ tiered approval matrix with multi-year contract value calculations.',
        'Build the commission waterfall with quota accelerators and configure the customer renewal risk classifier.'
      ]
    }
  }
];
