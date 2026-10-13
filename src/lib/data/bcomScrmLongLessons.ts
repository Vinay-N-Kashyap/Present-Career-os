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
  },
  {
    coursePrefix: 'bcom_scrm',
    day: 3,
    title: 'Advanced Sales Operations: Pipeline Velocity, Lead Scoring & Multi-Touch Attribution',
    overview: 'Master the analytical and operational mechanics of enterprise sales operations (SalesOps) and revenue architecture. You will calculate sales pipeline velocity across funnel conversion stages, engineer predictive lead scoring algorithms with firmographic and behavioral signals, model multi-touch revenue attribution across first-touch, last-touch, linear, and W-shaped frameworks, design account executive capacity and quota ramp models, and deploy an integrated enterprise sales operations control tower.',
    parts: [
      {
        title: 'Sales Pipeline Velocity Equation & Funnel Stage Conversion Analysis',
        say: [
          'In modern B2B enterprise sales, revenue is not merely a static target but the dynamic output of a mathematical velocity equation. Sales Pipeline Velocity measures the dollar amount of revenue flowing through the sales pipeline each day, week, or month. The fundamental equation is expressed as V = (N * W * L) / T, where N represents the number of active qualified opportunities in the pipeline, W is the historical win rate percentage, L is the average deal size or annual contract value (ACV), and T represents the average sales cycle length in days from discovery qualification to contract execution.',
          'To optimize velocity, revenue operations leaders must dissect stage-by-stage conversion drop-offs rather than inspecting high-level aggregate pipeline numbers. A standard B2B enterprise sales cycle progresses through discrete stages: Discovery, Technical Demonstration, Business Proposal, Legal & Procurement, and Closed Won. Stage leakage occurs when prospects stall or disqualify between milestones; for instance, a 40% drop-off between Discovery and Technical Demo signals weak initial qualification criteria, while a 20% drop-off in Legal suggests onerous contract terms or procurement roadblocks.',
          'Small incremental improvements across velocity variables generate exponential compounding impacts on revenue run-rate. Decreasing the sales cycle length T by 15 days or increasing the win rate W by 5 percentage points can expand annual booked revenue by millions of dollars without hiring additional sales reps. By tracking pipeline velocity metrics in real time within the CRM, sales managers can dynamically adjust sales rep quotas, reallocate territory resources, and intervene on stalled enterprise opportunities before quarter-end.'
        ],
        example: 'A sales pipeline maintains 120 qualified opportunities with a 20.83% win rate (25 closed deals), an $85,000 average deal size, and a 75-day sales cycle. The pipeline generates $28,333.33 in daily velocity, translating to an $850,000 monthly velocity and a $10,341,667 annualized pipeline run-rate.',
        code: `def calculate_sales_pipeline_velocity():
    # Pipeline Velocity = (Num Qualified Deals * Win Rate * Avg Deal Size) / Sales Cycle Days
    stages = [
        {"stage": "Discovery", "count": 120, "dropoff_rate": 0.40},
        {"stage": "Technical Demo", "count": 72, "dropoff_rate": 0.35},
        {"stage": "Business Proposal", "count": 46, "dropoff_rate": 0.30},
        {"stage": "Legal & Procurement", "count": 32, "dropoff_rate": 0.20},
        {"stage": "Closed Won", "count": 25, "dropoff_rate": 0.0}
    ]
    num_opps = 120
    win_rate = 25 / 120 # 20.83% overall win rate
    avg_deal_size = 85000.0 # $85,000 ACV
    sales_cycle_days = 75.0 # 75 days

    daily_velocity = (num_opps * win_rate * avg_deal_size) / sales_cycle_days
    monthly_velocity = daily_velocity * 30.0
    annualized_pipeline_revenue = daily_velocity * 365.0

    print("Enterprise Sales Pipeline Velocity Analysis:")
    print(f"  Active Qualified Opportunities (N): {num_opps}")
    print(f"  End-to-End Win Rate (W): {win_rate*100:.2f}%")
    print("  Average Deal Size (L): " + "$" + f"{avg_deal_size:,.2f}")
    print(f"  Average Sales Cycle Length (T): {sales_cycle_days:.1f} days")
    print("  Daily Pipeline Velocity: " + "$" + f"{daily_velocity:,.2f}" + " / day")
    print("  Monthly Pipeline Velocity: " + "$" + f"{monthly_velocity:,.2f}" + " / month")
    print("  Annualized Pipeline Run-Rate: " + "$" + f"{annualized_pipeline_revenue:,.2f}")
    return {"win_rate": win_rate, "daily_velocity": daily_velocity, "annual_velocity": annualized_pipeline_revenue}

calculate_sales_pipeline_velocity()`,
        output: `Enterprise Sales Pipeline Velocity Analysis:
  Active Qualified Opportunities (N): 120
  End-to-End Win Rate (W): 20.83%
  Average Deal Size (L): $85,000.00
  Average Sales Cycle Length (T): 75.0 days
  Daily Pipeline Velocity: $28,333.33 / day
  Monthly Pipeline Velocity: $850,000.00 / month
  Annualized Pipeline Run-Rate: $10,341,666.67`,
        codeNotes: [
          'Calculates daily pipeline velocity using the standard formula V = (N * W * L) / T.',
          'Translates daily throughput into monthly ($850,000) and annualized ($10.34M) run-rate metrics.',
          'Demonstrates how sales cycle length in the denominator directly throttles pipeline revenue generation.'
        ],
        tryIt: 'Shorten the sales cycle length from 75 to 60 days to evaluate how sales execution velocity expands annualized bookings by over $2.5M.',
        check: {
          question: 'In the sales pipeline velocity equation V = (N * W * L) / T, which change will result in the highest percentage increase in velocity?',
          options: [
            'Decreasing average sales cycle length T by 20% while holding other variables constant',
            'Decreasing the number of qualified opportunities N by 20%',
            'Increasing sales rep travel entertainment expense budgets without changing win rates',
            'Extending customer contract terms from 12 months to 24 months without changing ACV'
          ],
          answer: 0,
          why: 'Because T is in the denominator, reducing sales cycle length T by 20% increases velocity by 25% (1 / 0.80 = 1.25), accelerating revenue generation through the funnel.',
          answerIndex: 0,
          explanation: 'Because T is in the denominator, reducing sales cycle length T by 20% increases velocity by 25% (1 / 0.80 = 1.25), accelerating revenue generation through the funnel.'
        }
      },
      {
        title: 'Predictive Lead Scoring & Algorithmic Routing Architecture',
        say: [
          'Not all inbound inquiries or marketing leads carry equal commercial value. If sales development representatives (SDRs) manually review every form submission without algorithmic prioritization, high-intent enterprise buyers will wait hours for follow-up while reps waste valuable time chasing low-intent student downloads or competitor researchers. Predictive lead scoring solves this operational bottleneck by synthesizing firmographic and behavioral intent signals into a standardized numerical rating between 0 and 100.',
          'Firmographic attributes evaluate organizational fit based on Ideal Customer Profile (ICP) criteria, including annual corporate revenue, employee headcount, industry vertical, and technology stack compatibility. Behavioral signals measure digital buying intent, such as frequency of visits to the product pricing page, downloads of technical whitepapers, attendance at live webinars, and requests for custom enterprise demonstrations. High-fit, high-intent prospects receive maximum score weightings.',
          'Based on final calculated scores, automated CRM routing rules segment leads into operational tiers with strict Service Level Agreement (SLA) response times. Tier A Enterprise Hot leads (scores >= 80) trigger instant Slack alerts and automated routing to dedicated Enterprise SDRs with a mandatory 2-hour response SLA. Tier B Mid-Market Warm leads (scores 50-79) are routed for 24-hour follow-up, while Tier C Nurture leads (scores < 50) enter automated marketing email drip cadences until further engagement signals materialize.'
        ],
        example: 'Acme Health generates a 100/100 score ($450M revenue, 2,800 employees, 4 whitepaper downloads, executive demo request) and routes to Tier A with a 2-hour SLA, while CloudForge Tech scores 20/100 and routes to Tier C marketing nurture with a 72-hour SLA.',
        code: `def score_predictive_leads_and_tier():
    leads = [
        {"company": "Acme Health", "rev_m": 450, "employees": 2800, "whitepaper_downloads": 4, "exec_demo": True, "industry": "Healthcare"},
        {"company": "Beacon Logistics", "rev_m": 85, "employees": 450, "whitepaper_downloads": 2, "exec_demo": False, "industry": "Transportation"},
        {"company": "CloudForge Tech", "rev_m": 12, "employees": 80, "whitepaper_downloads": 1, "exec_demo": False, "industry": "Software"}
    ]

    print("Predictive Lead Scoring Engine:")
    scored_leads = []
    for lead in leads:
        # Score calculation (Max 100 points)
        score = 0
        # Firmographic score (Max 40 pts)
        if lead["rev_m"] >= 100:
            score += 25
        elif lead["rev_m"] >= 50:
            score += 15
        else:
            score += 5

        if lead["employees"] >= 1000:
            score += 15
        elif lead["employees"] >= 200:
            score += 10
        else:
            score += 5

        # Behavioral score (Max 60 pts)
        score += min(lead["whitepaper_downloads"] * 10, 30)
        if lead["exec_demo"]:
            score += 30

        # Tiering
        if score >= 80:
            tier = "TIER_A_HOT_ENTERPRISE"
            sla_hours = 2
        elif score >= 50:
            tier = "TIER_B_WARM_MIDMARKET"
            sla_hours = 24
        else:
            tier = "TIER_C_NURTURE_SMB"
            sla_hours = 72

        scored_leads.append({"company": lead["company"], "score": score, "tier": tier, "sla": sla_hours})
        print(f"  {lead['company']}: Score={score}/100 | Tier={tier} | SDR Routing SLA={sla_hours}h")

    return scored_leads

score_predictive_leads_and_tier()`,
        output: `Predictive Lead Scoring Engine:
  Acme Health: Score=100/100 | Tier=TIER_A_HOT_ENTERPRISE | SDR Routing SLA=2h
  Beacon Logistics: Score=45/100 | Tier=TIER_C_NURTURE_SMB | SDR Routing SLA=72h
  CloudForge Tech: Score=20/100 | Tier=TIER_C_NURTURE_SMB | SDR Routing SLA=72h`,
        codeNotes: [
          'Evaluates firmographic fit (revenue and headcount) up to 40 points to enforce ICP alignment.',
          'Quantifies digital engagement intent (whitepapers and executive demo requests) up to 60 points.',
          'Automates tiering into Tier A, Tier B, and Tier C with enforced SDR response SLAs.'
        ],
        tryIt: 'Flag Beacon Logistics with an executive demo request to see its score rise to 75, elevating it to Tier B Warm Mid-Market status.',
        check: {
          question: 'What is the primary operational objective of establishing automated lead scoring tiers with response SLAs in a CRM?',
          options: [
            'To ensure high-intent enterprise buyers receive immediate dedicated SDR outreach while filtering low-fit leads into marketing nurture cadences',
            'To eliminate all sales development reps and replace the entire sales force with automated chatbots',
            'To charge customers higher software subscription prices based on how many whitepapers they download',
            'To delete accounts from the CRM database if they do not purchase within 48 hours'
          ],
          answer: 0,
          why: 'Automated lead scoring ensures fast, prioritized SDR engagement for high-fit enterprise prospects while conserving sales resources by routing lower-intent leads to automated marketing nurture.',
          answerIndex: 0,
          explanation: 'Automated lead scoring ensures fast, prioritized SDR engagement for high-fit enterprise prospects while conserving sales resources by routing lower-intent leads to automated marketing nurture.'
        }
      },
      {
        title: 'Multi-Touch Revenue Attribution Modeling (Linear vs W-Shaped Frameworks)',
        say: [
          'In modern B2B sales cycles spanning 6 to 12 months, enterprise buyers interact with dozens of marketing and sales touchpoints across multiple channels before signing a contract. Marketing teams often struggle to defend their budgets because simplistic single-touch attribution models distort reality. First-Touch attribution credits 100% of revenue to the initial awareness channel (e.g. SEO or blog posts), ignoring subsequent demo presentations. Conversely, Last-Touch attribution awards 100% of credit to the closing interaction (e.g. custom ROI calculator or demo), dismissing the brand marketing campaigns that generated the lead.',
          'To achieve fair cross-functional alignment between Marketing and Sales, revenue operations teams implement multi-touch attribution models. Linear attribution distributes credit equally across all touchpoints in the buyer journey. While straightforward, linear models undervalue pivotal transition moments, treating a routine email newsletter click with the same significance as an executive meeting.',
          'The industry standard for complex B2B enterprise attribution is the W-Shaped model. The W-Shaped framework assigns 30% of revenue credit to the First Touch (initial brand discovery), 30% to Lead Creation (when the prospect submits contact information), 30% to Opportunity Creation (when the SDR qualifies the deal into an active sales stage), and distributes the remaining 10% equally across intermediate nurture touchpoints. This balanced allocation ensures that demand generation, lead qualification, and deal closing teams all receive proportionate attribution for closed-won revenue.'
        ],
        example: 'On an enterprise $180,000 closed-won contract spanning 5 touchpoints, Linear attribution allocates $36,000 to each channel. Under W-Shaped attribution, Organic SEO (First Touch), Webinar (Lead Creation), and Executive Dinner (Opp Creation) each receive $54,000 (30%), while PPC Ad and Demo receive $9,000 (5%).',
        code: `def model_multi_touch_revenue_attribution():
    deal_value = 180000.0 # $180,000 closed-won contract
    touchpoints = [
        {"touch": 1, "channel": "Organic SEO Whitepaper", "stage": "First Touch"},
        {"touch": 2, "channel": "Google Search PPC Ad", "stage": "Nurture"},
        {"touch": 3, "channel": "Product Webinar Registration", "stage": "Lead Creation"},
        {"touch": 4, "channel": "Executive Field Dinner", "stage": "Opportunity Creation"},
        {"touch": 5, "channel": "Custom ROI Calculator & Demo", "stage": "Closing Touch"}
    ]
    n = len(touchpoints)

    # 1. First-Touch Attribution (100% to first)
    first_touch = {tp["channel"]: (deal_value if i == 0 else 0.0) for i, tp in enumerate(touchpoints)}

    # 2. Last-Touch Attribution (100% to last)
    last_touch = {tp["channel"]: (deal_value if i == n - 1 else 0.0) for i, tp in enumerate(touchpoints)}

    # 3. Linear Attribution (Equal split)
    linear_touch = {tp["channel"]: deal_value / n for tp in touchpoints}

    # 4. W-Shaped Attribution (30% First, 30% Lead Creation, 30% Opp Creation, 10% Middle/Closing)
    # Touch 1 (30%), Touch 2 (5%), Touch 3 (30%), Touch 4 (30%), Touch 5 (5%)
    w_weights = [0.30, 0.05, 0.30, 0.30, 0.05]
    w_shaped = {tp["channel"]: deal_value * w_weights[i] for i, tp in enumerate(touchpoints)}

    print("Multi-Touch Revenue Attribution Comparison ($180,000 Deal):")
    print(f"  {'Channel':<30} | {'First-Touch':<12} | {'Last-Touch':<12} | {'Linear':<12} | {'W-Shaped':<12}")
    print("  " + "-" * 88)
    for i, tp in enumerate(touchpoints):
        ch = tp["channel"]
        ft_val = "$" + f"{first_touch[ch]:,.0f}"
        lt_val = "$" + f"{last_touch[ch]:,.0f}"
        lin_val = "$" + f"{linear_touch[ch]:,.0f}"
        w_val = "$" + f"{w_shaped[ch]:,.0f}"
        print(f"  {ch:<30} | {ft_val:<12} | {lt_val:<12} | {lin_val:<12} | {w_val:<12}")

    return {"w_shaped": w_shaped, "linear": linear_touch}

model_multi_touch_revenue_attribution()`,
        output: `Multi-Touch Revenue Attribution Comparison ($180,000 Deal):
  Channel                        | First-Touch  | Last-Touch   | Linear       | W-Shaped    
  ----------------------------------------------------------------------------------------
  Organic SEO Whitepaper         | $180,000     | $0           | $36,000      | $54,000     
  Google Search PPC Ad           | $0           | $0           | $36,000      | $9,000      
  Product Webinar Registration   | $0           | $0           | $36,000      | $54,000     
  Executive Field Dinner         | $0           | $0           | $36,000      | $54,000     
  Custom ROI Calculator & Demo   | $0           | $180,000     | $36,000      | $9,000      `,
        codeNotes: [
          'First-Touch and Last-Touch oversimplify the customer journey by giving 100% of revenue to a single touchpoint.',
          'Linear attribution splits deal value evenly ($36,000 per channel across 5 touches).',
          'W-Shaped attribution prioritizes the 3 core funnel transitions (First Touch, Lead Creation, Opp Creation) at 30% each, sharing 10% across nurture.'
        ],
        tryIt: 'Modify the deal value to $250,000 to observe how marketing channel ROI budgets scale across attribution models.',
        check: {
          question: 'Why is the W-Shaped attribution model widely preferred over First-Touch or Last-Touch models in enterprise B2B sales?',
          options: [
            'Because it awards 90% of revenue credit to the three critical milestones (First Touch, Lead Creation, Opportunity Creation) while appropriately rewarding intermediate nurture touches',
            'Because it requires zero CRM integration and can be computed without tracking website activity',
            'Because it completely excludes the sales department from receiving any commission credit',
            'Because federal marketing disclosure laws require W-shaped tax filings for all digital advertising'
          ],
          answer: 0,
          why: 'The W-shaped model accurately captures enterprise buying dynamics by placing 30% weight on each of the 3 major conversion milestones (first touch, lead creation, opportunity creation) and distributing 10% across nurture channels.',
          answerIndex: 0,
          explanation: 'The W-shaped model accurately captures enterprise buying dynamics by placing 30% weight on each of the 3 major conversion milestones (first touch, lead creation, opportunity creation) and distributing 10% across nurture channels.'
        }
      },
      {
        title: 'Sales Capacity Planning, AE Quota Ramp & Pipeline Coverage Economics',
        say: [
          'A recurring mistake in high-growth companies is setting aggressive revenue targets without building an underlying sales capacity headcount model. Sales leaders cannot simply announce a $6M new bookings plan without calculating how many Account Executives (AEs) are required, how long it takes new hires to achieve full quota productivity, and how much qualified pipeline marketing and outbound SDRs must generate to support them.',
          'AE quota capacity planning begins with the fully ramped annual quota, typically set between $800,000 and $1,200,000 in enterprise software. New sales reps do not produce at 100% capacity on Day 1; they require a 3 to 6 month ramp period as they learn product capabilities, territory accounts, and competitive positioning. In Year 1, a newly hired AE with a 4-month ramp produces an effective quota contribution of roughly 75% to 80% of a fully ramped peer ($791,667 in a $1.0M quota environment). To achieve a $6.0M new bookings target, the organization must hire and deploy 8 full-time AEs.',
          'Crucially, quota capacity is meaningless without adequate pipeline coverage. Because enterprise win rates typically hover around 20% to 28%, each sales rep requires 3.5x to 4.0x in qualified pipeline coverage to reliably achieve their quota. For an enterprise target of $6,000,000 in bookings at 3.5x coverage, the combined marketing and SDR demand generation engine must produce $21,000,000 in qualified pipeline across the fiscal year. Synchronizing quota targets with pipeline coverage guarantees financial predictability and prevents territory starvation.'
        ],
        example: 'To achieve a $6,000,000 annual bookings target with $1,000,000 AE quotas and a 4-month ramp ($791,667 effective Year 1 quota), the company requires 7.6 reps (rounded to 8 AEs). At a 3.5x pipeline coverage ratio, marketing and SDRs must generate $21,000,000 in qualified pipeline.',
        code: `def plan_sales_capacity_and_quota_ramp():
    target_arr_plan = 6000000.0  # $6M new ARR target for the year
    ae_annual_quota = 1000000.0  # $1.0M quota per fully ramped AE
    pipeline_coverage_ratio = 3.5 # 3.5x pipeline coverage required
    ramp_months = 4
    ramp_productivity = [0.0, 0.25, 0.50, 0.75, 1.0] # Productivity % by month

    # Effective quota per new hire in Year 1: 4 months ramp (avg 37.5% of 4/12) + 8 months fully ramped (8/12)
    ramped_contribution = (4/12 * 0.375 + 8/12 * 1.0) * ae_annual_quota # ~$791,667
    aes_needed = target_arr_plan / ramped_contribution
    pipeline_required = target_arr_plan * pipeline_coverage_ratio

    print("Sales Capacity & AE Quota Ramp Planning:")
    print("  Annual Bookings Target: " + "$" + f"{target_arr_plan:,.2f}")
    print("  Fully Ramped AE Annual Quota: " + "$" + f"{ae_annual_quota:,.2f}")
    print(f"  Ramp Period: {ramp_months} months | Year 1 Weighted Quota: " + "$" + f"{ramped_contribution:,.2f}")
    print(f"  Ramped AEs Required to Hit Target: {aes_needed:.1f} reps (Round to 8 Full-Time AEs)")
    print(f"  Mandatory Pipeline Coverage: {pipeline_coverage_ratio}x")
    print("  Total Pipeline Generation Required: " + "$" + f"{pipeline_required:,.2f}")
    return {"aes_needed": aes_needed, "pipeline_required": pipeline_required}

plan_sales_capacity_and_quota_ramp()`,
        output: `Sales Capacity & AE Quota Ramp Planning:
  Annual Bookings Target: $6,000,000.00
  Fully Ramped AE Annual Quota: $1,000,000.00
  Ramp Period: 4 months | Year 1 Weighted Quota: $791,666.67
  Ramped AEs Required to Hit Target: 7.6 reps (Round to 8 Full-Time AEs)
  Mandatory Pipeline Coverage: 3.5x
  Total Pipeline Generation Required: $21,000,000.00`,
        codeNotes: [
          'Incorporates a 4-month AE ramp period, reducing Year 1 effective quota contribution from $1.0M to $791,667.',
          'Calculates that 8 full-time AEs are required to achieve the $6,000,000 new bookings plan.',
          'Multiplies target bookings by 3.5x coverage to establish an aggressive $21,000,000 demand generation goal.'
        ],
        tryIt: 'Increase the required pipeline coverage ratio to 4.0x to see pipeline generation requirements jump to $24,000,000.',
        check: {
          question: 'Why must sales capacity models account for AE ramp periods when planning annual hiring targets?',
          options: [
            'Because newly hired sales reps take several months to achieve full productivity, meaning 1 new hire cannot deliver 100% of an annual quota in their first year',
            'Because labor laws prohibit new employees from generating any sales revenue during their first 90 days',
            'Because marketing teams refuse to generate pipeline for any newly hired sales representative',
            'Because sales quotas automatically double during the second half of every fiscal year'
          ],
          answer: 0,
          why: 'Accounting for the learning curve and territory ramp period ensures realistic capacity expectations; new hires only produce a discounted fraction of full quota in Year 1.',
          answerIndex: 0,
          explanation: 'Accounting for the learning curve and territory ramp period ensures realistic capacity expectations; new hires only produce a discounted fraction of full quota in Year 1.'
        }
      },
      {
        title: 'Deploy the Enterprise Sales Operations Control Tower',
        say: [
          'Enterprise revenue architecture succeeds only when sales pipeline velocity, predictive lead routing, multi-touch attribution, and capacity planning operate as a unified system. When marketing generates high-fit leads, predictive scoring instantly routes them to ramped AEs with high velocity and high win rates, while multi-touch attribution models accurately credit every contributing channel to justify ongoing marketing investments.',
          'In this operational capstone module, you will execute the end-to-end Sales Operations Control Tower. You will synthesize pipeline velocity calculations across funnel drop-offs, verify automated predictive lead scoring and SLA routing, compare multi-touch attribution distribution tables, and validate headcount capacity requirements.',
          'Deploying this integrated control tower equips revenue leaders with the predictive analytics and operational rigor necessary to scale B2B organizations from early traction to predictable enterprise revenue.'
        ],
        example: 'The revenue operations team consolidates pipeline velocity ($10.34M run-rate), lead scoring (1 Tier A Hot lead), W-Shaped attribution (Organic SEO top channel at $54,000), and capacity planning ($21M pipeline generation target for 8 AEs).',
        code: `def run_enterprise_sales_operations_engine():
    print("=== PinIT Career OS Enterprise Sales Operations Control Tower ===")
    print("--- 1. Pipeline Velocity & Stage Conversions ---")
    pv = calculate_sales_pipeline_velocity()

    print("\n--- 2. Predictive Lead Scoring & SLA Routing ---")
    leads = score_predictive_leads_and_tier()

    print("\n--- 3. Multi-Touch Revenue Attribution Modeling ---")
    attr = model_multi_touch_revenue_attribution()

    print("\n--- 4. Sales Capacity & Quota Headcount Modeling ---")
    cap = plan_sales_capacity_and_quota_ramp()

    print("\n--- 5. Sales Operations Executive Synthesis ---")
    print("  Pipeline Velocity Run-Rate: " + "$" + f"{pv['annual_velocity']:,.2f}")
    print(f"  Tier A Enterprise Hot Leads: {sum(1 for l in leads if l['tier'] == 'TIER_A_HOT_ENTERPRISE')}")
    print("  W-Shaped Top Attributed Channel: Organic SEO (" + "$" + f"{attr['w_shaped']['Organic SEO Whitepaper']:,.2f}" + ")")
    print("  Total Pipeline Generation Target: " + "$" + f"{cap['pipeline_required']:,.2f}")
    print("Status: SALES OPERATIONS CONTROL TOWER SYNCHRONIZED ACROSS CRM, MARKETING & FINANCE.")

run_enterprise_sales_operations_engine()`,
        output: `=== PinIT Career OS Enterprise Sales Operations Control Tower ===
--- 1. Pipeline Velocity & Stage Conversions ---
Enterprise Sales Pipeline Velocity Analysis:
  Active Qualified Opportunities (N): 120
  End-to-End Win Rate (W): 20.83%
  Average Deal Size (L): $85,000.00
  Average Sales Cycle Length (T): 75.0 days
  Daily Pipeline Velocity: $28,333.33 / day
  Monthly Pipeline Velocity: $850,000.00 / month
  Annualized Pipeline Run-Rate: $10,341,666.67

--- 2. Predictive Lead Scoring & SLA Routing ---
Predictive Lead Scoring Engine:
  Acme Health: Score=100/100 | Tier=TIER_A_HOT_ENTERPRISE | SDR Routing SLA=2h
  Beacon Logistics: Score=45/100 | Tier=TIER_C_NURTURE_SMB | SDR Routing SLA=72h
  CloudForge Tech: Score=20/100 | Tier=TIER_C_NURTURE_SMB | SDR Routing SLA=72h

--- 3. Multi-Touch Revenue Attribution Modeling ---
Multi-Touch Revenue Attribution Comparison ($180,000 Deal):
  Channel                        | First-Touch  | Last-Touch   | Linear       | W-Shaped    
  ----------------------------------------------------------------------------------------
  Organic SEO Whitepaper         | $180,000     | $0           | $36,000      | $54,000     
  Google Search PPC Ad           | $0           | $0           | $36,000      | $9,000      
  Product Webinar Registration   | $0           | $0           | $36,000      | $54,000     
  Executive Field Dinner         | $0           | $0           | $36,000      | $54,000     
  Custom ROI Calculator & Demo   | $0           | $180,000     | $36,000      | $9,000      

--- 4. Sales Capacity & Quota Headcount Modeling ---
Sales Capacity & AE Quota Ramp Planning:
  Annual Bookings Target: $6,000,000.00
  Fully Ramped AE Annual Quota: $1,000,000.00
  Ramp Period: 4 months | Year 1 Weighted Quota: $791,666.67
  Ramped AEs Required to Hit Target: 7.6 reps (Round to 8 Full-Time AEs)
  Mandatory Pipeline Coverage: 3.5x
  Total Pipeline Generation Required: $21,000,000.00

--- 5. Sales Operations Executive Synthesis ---
  Pipeline Velocity Run-Rate: $10,341,666.67
  Tier A Enterprise Hot Leads: 1
  W-Shaped Top Attributed Channel: Organic SEO ($54,000.00)
  Total Pipeline Generation Target: $21,000,000.00
Status: SALES OPERATIONS CONTROL TOWER SYNCHRONIZED ACROSS CRM, MARKETING & FINANCE.`,
        codeNotes: [
          'Integrates pipeline throughput, predictive lead scoring, attribution models, and capacity headcount.',
          'Demonstrates how sales cycle length and win rates combine to drive an annualized $10.34M run-rate.',
          'Validates that 8 full-time AEs and $21.0M in pipeline coverage are necessary to hit the $6.0M target.'
        ],
        tryIt: 'Run the integrated control tower to observe the cross-functional handoffs between Marketing, SDRs, and AEs.',
        check: {
          question: 'How do pipeline velocity, lead scoring, attribution, and capacity planning reinforce one another in an enterprise sales organization?',
          options: [
            'Lead scoring prioritizes high-fit deals to improve win rates and shorten sales cycles, boosting pipeline velocity, while attribution justifies marketing spend and capacity models ensure sufficient rep headcount to close pipeline',
            'They operate completely independently with no shared data or organizational touchpoints',
            'They are used exclusively by human resources to calculate year-end employee health benefits',
            'They force all customers to pay cash upfront before receiving product demonstrations'
          ],
          answer: 0,
          why: 'All four components form an interconnected revenue engine: lead scoring feeds qualified opps to shorten cycles and lift win rates, driving velocity, while attribution optimizes marketing ROI and capacity planning balances headcount.',
          answerIndex: 0,
          explanation: 'All four components form an interconnected revenue engine: lead scoring feeds qualified opps to shorten cycles and lift win rates, driving velocity, while attribution optimizes marketing ROI and capacity planning balances headcount.'
        }
      }
    ],
    summary: [
      'Calculated sales pipeline velocity V = (N * W * L) / T ($28,333.33/day, $10.34M annualized run-rate), modeling stage conversion drop-offs across Discovery, Demo, Proposal, and Legal.',
      'Engineered a predictive lead scoring engine combining firmographic attributes (revenue, headcount) and behavioral engagement (downloads, demo requests) with automated SDR routing SLAs.',
      'Constructed a multi-touch revenue attribution comparison for a $180,000 deal, contrasting First-Touch and Last-Touch with Linear ($36k/touch) and W-Shaped models ($54k for First, Lead Creation, Opp Creation).',
      'Modeled AE sales capacity planning with a 4-month ramp period, calculating an effective Year 1 quota contribution of $791,667, requiring 8 full-time AEs and $21.0M in pipeline coverage at 3.5x ratio.',
      'Deployed the Enterprise Sales Operations Control Tower, establishing a unified analytical engine linking demand generation, lead routing, pipeline throughput, and quota attainment.'
    ],
    projectStep: {
      title: 'Deploy the Enterprise Sales Operations & Pipeline Velocity Engine',
      steps: [
        'Calculate sales pipeline velocity and model conversion leakage across each stage of the funnel.',
        'Implement predictive lead scoring algorithms with firmographic and behavioral weights to trigger automated SLA routing.',
        'Model multi-touch revenue attribution across First-Touch, Last-Touch, Linear, and W-Shaped frameworks.',
        'Plan sales capacity headcount, factoring in AE ramp curves and mandatory pipeline coverage ratios.'
      ]
    }
  }
];
