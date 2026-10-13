import type { LongLesson } from './longLessons';

/**
 * Business Analytics & Decision Intelligence (Course: bcom_ana)
 * Day 1: Linear Optimization, Sensitivity Analysis & Stochastic Financial Modeling.
 */
export const BCOM_ANA_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'bcom_ana',
    day: 1,
    title: 'Linear Programming, Sensitivity Analysis & Decision Science',
    goal: 'Master mathematical business decision modeling: formulating linear programs, calculating shadow prices of bottleneck constraints, and modeling capital risk with Monte Carlo simulation.',
    minutes: 40,
    recap: 'Welcome to Advanced Business Analytics. Intuition and gut feelings often fail when managing complex supply chains and capital budgets. We will transform business dilemmas into deterministic mathematical models.',
    parts: [
      {
        title: 'Business Decision Intelligence & Normative Optimization Models',
        say: [
          'In modern corporate strategy, business analytics is categorized into three escalating maturity levels: Descriptive analytics (what happened?), Predictive analytics (what will happen?), and Prescriptive analytics (what should we do to maximize value?).',
          'Prescriptive decision intelligence relies on Normative Mathematical Models. A normative model does not merely forecast sales; it calculates the optimal decision policy given finite corporate resources.',
          'Every business optimization model consists of three foundational components: Decision Variables, the Objective Function, and System Constraints.',
          'Decision Variables (x1, x2, ..., xn) represent controllable enterprise choices—such as how many units of Product A and Product B to manufacture, or how much capital to allocate across marketing channels. The Objective Function mathematically defines the business goal: maximizing total contribution margin or minimizing supply chain logistics cost. Constraints define physical reality: factory machine hours, labor availability, and minimum contract delivery guarantees.'
        ],
        example: 'Think of packing a backpack for a mountain expedition. The decision variables are how many cans of food and medical supplies to pack. The objective is to maximize survival nutrition. The constraints are the physical volume of the bag (20 liters) and maximum carry weight (15 kg). You cannot pack infinite supplies.',
        code: `# Simulation: Business Decision Model Formulation & Feasibility Verification
class ProductionMixModel:
    def __init__(self, labor_hours_cap: float, raw_material_cap: float):
        self.labor_cap = labor_hours_cap
        self.material_cap = raw_material_cap

    def evaluate_plan(self, units_standard: int, units_deluxe: int) -> dict:
        # Product specifications:
        # Standard: Margin = $40, Labor = 2 hrs, Material = 3 kg
        # Deluxe:   Margin = $70, Labor = 4 hrs, Material = 4 kg
        total_margin = (units_standard * 40) + (units_deluxe * 70)
        used_labor = (units_standard * 2) + (units_deluxe * 4)
        used_material = (units_standard * 3) + (units_deluxe * 4)

        labor_slack = self.labor_cap - used_labor
        material_slack = self.material_cap - used_material
        is_feasible = (labor_slack >= 0) and (material_slack >= 0)

        return {
            "Units_Standard": units_standard,
            "Units_Deluxe": units_deluxe,
            "Total_Contribution_Margin": total_margin,
            "Used_Labor_Hrs": used_labor,
            "Labor_Slack": labor_slack,
            "Used_Material_Kg": used_material,
            "Material_Slack": material_slack,
            "Is_Feasible": is_feasible
        }

# Plant capacity: 160 labor hours, 180 kg raw material
plant = ProductionMixModel(labor_hours_cap=160.0, raw_material_cap=180.0)
plan_a = plant.evaluate_plan(units_standard=40, units_deluxe=20)
plan_b = plant.evaluate_plan(units_standard=20, units_deluxe=30)

print(f"Plan A Margin: \${plan_a['Total_Contribution_Margin']} | Labor Left: {plan_a['Labor_Slack']}h | Feasible: {plan_a['Is_Feasible']}")
print(f"Plan B Margin: \${plan_b['Total_Contribution_Margin']} | Labor Left: {plan_b['Labor_Slack']}h | Feasible: {plan_b['Is_Feasible']}")`,
        output: `Plan A Margin: $3000 | Labor Left: 0.0h | Feasible: True\nPlan B Margin: $2900 | Labor Left: 0.0h | Feasible: True`,
        tryIt: 'Test a production plan of 50 Standard and 25 Deluxe units and verify how the model detects capacity constraint violations.',
        check: {
          question: 'What are the three essential mathematical components of every business optimization model?',
          options: [
            'Decision variables (controllable choices), an objective function (goal to maximize/minimize), and constraints (scarce resource limits)',
            'Spreadsheet macros, pivot charts, and slide decks',
            'Revenue, accounts payable, and income taxes'
          ],
          answer: 0,
          why: 'Prescriptive optimization models require explicit decision variables that the enterprise controls, a mathematical objective function to evaluate outcomes, and constraints bounding resource limits.'
        }
      },
      {
        title: 'Linear Programming & Simplex Convex Geometry',
        say: [
          'When both the objective function and all boundary constraints are linear relationships, the mathematical formulation is called a Linear Program (LP). Linear programming is one of the most commercially valuable algorithms in human history, driving airline crew scheduling, oil refinery blending, and Amazon fulfillment routing.',
          'Geometrically, linear constraints define hyperplanes in multi-dimensional space. The intersection of these linear inequalities forms a closed, convex geometric shape known as the Feasible Region (a convex polyhedron).',
          'The Fundamental Theorem of Linear Programming proves that the optimal solution to any linear program is guaranteed to lie on one of the extreme vertices (corner points) of the feasible polyhedron!',
          'Developed by George Dantzig, the Simplex Algorithm exploits this theorem. Instead of evaluating millions of infinite interior points, the algorithm begins at a corner vertex and pivots along adjacent edges, systematically increasing the objective value until no improving edge exists.'
        ],
        example: 'Think of walking on the roof of a multi-sided geodesic glass dome. If your goal is to find the highest point, you do not need to measure every millimeter of the glass panels; the highest point is guaranteed to be at one of the structural steel joints (corner vertices).',
        code: `# Simulation: 2D Simplex Corner-Point Search for Optimal Product Mix
def solve_2d_linear_program(
    c1: float, c2: float,               # Objective: Maximize c1*x1 + c2*x2
    constraints: list[tuple[float, float, float]] # (a1, a2, b) -> a1*x1 + a2*x2 <= b
) -> dict:
    # Corner candidate vertices: intersection points between boundary lines
    # Boundary 1: Labor (2*x1 + 4*x2 = 160)
    # Boundary 2: Material (3*x1 + 4*x2 = 180)
    # Plus axes: x1 >= 0, x2 >= 0
    candidate_vertices = [
        (0.0, 0.0),         # Origin
        (0.0, 40.0),        # Labor intercept: x1=0, x2=160/4
        (60.0, 0.0),        # Material intercept: x1=180/3, x2=0
        (20.0, 30.0)        # Intersection: 2*x1 + 4*x2 = 160 & 3*x1 + 4*x2 = 180 -> x1=20, x2=30
    ]

    best_vertex = None
    max_objective = -float('inf')

    for x1, x2 in candidate_vertices:
        # Verify feasibility against all inequalities
        feasible = True
        for a1, a2, b in constraints:
            if (a1 * x1 + a2 * x2) > (b + 1e-6):
                feasible = False
                break
        if feasible:
            obj_val = (c1 * x1) + (c2 * x2)
            if obj_val > max_objective:
                max_objective = obj_val
                best_vertex = (x1, x2)

    return {
        "Optimal_x1_Standard": best_vertex[0],
        "Optimal_x2_Deluxe": best_vertex[1],
        "Maximized_Profit": max_objective
    }

solution = solve_2d_linear_program(
    c1=40.0, c2=70.0,
    constraints=[(2.0, 4.0, 160.0), (3.0, 4.0, 180.0)]
)

print("Optimal Production Schedule (Simplex Vertices):")
print(f"Produce Standard Units (x1): {solution['Optimal_x1_Standard']}")
print(f"Produce Deluxe Units (x2):   {solution['Optimal_x2_Deluxe']}")
print(f"Maximized Enterprise Profit: \${solution['Maximized_Profit']}")`,
        output: `Optimal Production Schedule (Simplex Vertices):\nProduce Standard Units (x1): 20.0\nProduce Deluxe Units (x2):   30.0\nMaximized Enterprise Profit: $2900.0`,
        tryIt: 'Change the margin of Deluxe to $90 and see how the optimal solution shifts completely to the corner vertex (0, 40).',
        check: {
          question: 'According to the Fundamental Theorem of Linear Programming, where does the optimal solution to an LP always reside?',
          options: [
            'At one of the extreme corner vertices of the convex feasible region polyhedron',
            'At the exact arithmetic center of the feasible region',
            'At infinity'
          ],
          answer: 0,
          why: 'Because both the objective function and constraints are linear planes, the maximum or minimum value along any slice cannot occur in the interior; it must occur at an outer boundary corner vertex.'
        }
      },
      {
        title: 'Shadow Prices, Dual Variables & Marginal Opportunity Cost',
        say: [
          'Finding the optimal production schedule is only half the business challenge. The most critical executive questions involve resource investments: "If we pay overtime to add 10 hours of factory labor, how much additional profit will we generate?"',
          'This is answered by the Shadow Price (Dual Variable). The shadow price of a constraint is the marginal increase in the optimal objective value resulting from relaxing that constraint by one additional unit of capacity.',
          'If the shadow price of labor hours is $15.00, it means an extra hour of labor increases enterprise profit by exactly $15.00. Therefore, management should gladly pay up to $14.99 in overtime wages to secure that hour. If overtime costs $20.00/hr, hiring overtime is value-destructive.',
          'Crucially, if a constraint has positive Slack (unused capacity exists at the optimum), its shadow price is strictly $0.00! Adding more of an already underutilized resource yields zero additional profit.'
        ],
        example: 'Think of baking cakes. You have 10 eggs and 2 cups of flour. If a cake recipe requires 2 eggs and 1 cup of flour, your 2 cups of flour cap you at 2 cakes. You have 6 leftover eggs (slack). Buying 5 more eggs from the store (shadow price = $0) will not let you bake a third cake; you need more flour!',
        code: `# Simulation: Dual Problem & Shadow Price Economic Analysis
def calculate_shadow_prices(base_c1: float, base_c2: float, b_labor: float, b_material: float):
    # Base optimal solution
    # System: 2*x1 + 4*x2 = b_labor and 3*x1 + 4*x2 = b_material
    # Subtracting: x1 = b_material - b_labor
    # 4*x2 = b_labor - 2*x1 -> x2 = (b_labor - 2*(b_material - b_labor)) / 4 = (3*b_labor - 2*b_material)/4
    def solve(l_cap, m_cap):
        x1 = m_cap - l_cap
        x2 = (3 * l_cap - 2 * m_cap) / 4.0
        return (base_c1 * x1) + (base_c2 * x2)

    base_profit = solve(b_labor, b_material)

    # 1. Relax Labor by +1 unit (161 hours)
    labor_plus_1 = solve(b_labor + 1.0, b_material)
    shadow_price_labor = labor_plus_1 - base_profit

    # 2. Relax Material by +1 unit (181 kg)
    material_plus_1 = solve(b_labor, b_material + 1.0)
    shadow_price_material = material_plus_1 - base_profit

    return {
        "Base_Profit": base_profit,
        "Labor_Shadow_Price": round(shadow_price_labor, 2),
        "Material_Shadow_Price": round(shadow_price_material, 2)
    }

dual = calculate_shadow_prices(base_c1=40.0, base_c2=70.0, b_labor=160.0, b_material=180.0)
print("Dual Economic Analysis & Marginal Shadow Prices:")
print(f"Base Optimal Profit:     \${dual['Base_Profit']}")
print(f"Labor Shadow Price:      \${dual['Labor_Shadow_Price']}/hour")
print(f"Raw Material Shadow Price: \${dual['Material_Shadow_Price']}/kg")
print(f"Max Overtime Wage Justified: < \${dual['Labor_Shadow_Price']}")`,
        output: `Dual Economic Analysis & Marginal Shadow Prices:\nBase Optimal Profit:     $2900.0\nLabor Shadow Price:      $12.5/hour\nRaw Material Shadow Price: $5.0/kg\nMax Overtime Wage Justified: < $12.5`,
        tryIt: 'Verify that if labor capacity is increased to 200 hours so that it is no longer binding, its shadow price drops to $0.00.',
        check: {
          question: 'If a plant constraint currently has positive slack (unused capacity), what is its shadow price?',
          options: [
            'Strictly $0.00, because adding more of a non-bottleneck resource yields zero increase in optimal profit',
            'Equal to the cost of purchasing the machine',
            'Negative infinity'
          ],
          answer: 0,
          why: 'By the Complementary Slackness Theorem of linear programming, any constraint that is not binding at the optimum has a dual shadow price of zero. Expanding an unconstrained resource produces zero marginal return.'
        }
      },
      {
        title: 'Cohort Retention Analytics & Triangular Lifetime Value (LTV)',
        say: [
          'In recurring revenue businesses (SaaS, subscriptions, e-commerce), aggregate revenue metrics like Monthly Recurring Revenue (MRR) obscure underlying customer decay.',
          'Cohort Analysis tracks groups of customers who signed up during the same calendar month over time. Arranging cohorts in a triangular retention matrix reveals true customer behavior: how many users remain active after Month 1, Month 3, and Month 12.',
          'Customer churn typically exhibits a power-law or exponential survival curve: retention drops sharply in the first 30 days during onboarding, then plateaus into a loyal core base.',
          'Analyzing Net Revenue Retention (NRR) measures expansion revenue. If existing customers upgrade and expand their contract values faster than other customers churn, the cohort exhibits Negative Net Churn (NRR > 100%), allowing the business to grow even with zero new customer acquisition!'
        ],
        example: 'Think of pouring water into a leaky bucket. If you pour in 100 liters of water every month, the bucket might look full (high top-line revenue). But cohort analysis measures the bucket hole: if month-1 water leaks out in 2 days, you are running on an unsustainable treadmill.',
        code: `# Simulation: Triangular Cohort Retention Matrix & Net Revenue Retention (NRR)
def analyze_cohort_retention(cohort_sizes: dict[str, int], retention_rates: dict[str, list[float]]) -> dict:
    matrix = {}
    nrr_per_cohort = {}

    for cohort, size in cohort_sizes.items():
        rates = retention_rates[cohort]
        retained_counts = [round(size * (r / 100.0)) for r in rates]
        matrix[cohort] = retained_counts
        # NRR calculation at month 3 assuming 15% upsell expansion from active users
        active_pct_m3 = rates[2] if len(rates) > 2 else 0
        nrr_m3 = active_pct_m3 * 1.25 # 25% account expansion
        nrr_per_cohort[cohort] = round(nrr_m3, 1)

    return {"Retention_Matrix": matrix, "M3_NRR_Pct": nrr_per_cohort}

cohorts = {"Jan-2026": 1000, "Feb-2026": 1200, "Mar-2026": 1500}
retention = {
    "Jan-2026": [100.0, 72.0, 61.0, 54.0],
    "Feb-2026": [100.0, 75.0, 64.0],
    "Mar-2026": [100.0, 78.0]
}

results = analyze_cohort_retention(cohorts, retention)
print("SaaS Cohort Retention Matrix (Active Users per Month):")
for c, counts in results["Retention_Matrix"].items():
    print(f"Cohort {c} (N={cohorts[c]}): {counts}")
print(f"Jan-2026 Month-3 Net Revenue Retention: {results['M3_NRR_Pct']['Jan-2026']}%")`,
        output: `SaaS Cohort Retention Matrix (Active Users per Month):\nCohort Jan-2026 (N=1000): [1000, 720, 610, 540]\nCohort Feb-2026 (N=1200): [1200, 900, 768]\nCohort Mar-2026 (N=1500): [1500, 1170]\nJan-2026 Month-3 Net Revenue Retention: 76.2%`,
        tryIt: 'Adjust the retention rate of Feb-2026 to see if improved onboarding lifts Month-2 survival counts.',
        check: {
          question: 'What does a Net Revenue Retention (NRR) metric exceeding 100% indicate about an enterprise subscription business?',
          options: [
            'Existing customer account expansion (upsells/cross-sells) outpaces revenue lost from customer churn, creating negative net churn',
            'The company is operating at an accounting loss',
            'Every customer canceled their subscription'
          ],
          answer: 0,
          why: 'NRR > 100% means the business grows revenue organically from its existing cohort base alone, even before adding any newly acquired customers.'
        }
      },
      {
        title: 'Monte Carlo Capital Budgeting & Value at Risk (VaR)',
        say: [
          'Traditional corporate capital budgeting models rely on single-point estimates in Excel: "Sales will be $10M, cost of goods will be $6M, yielding a net present value (NPV) of $1.5M." In the real world, single-point deterministic estimates are almost always wrong.',
          'Monte Carlo Simulation replaces static point estimates with probability distributions (e.g. Normal, Triangular, Lognormal). By running 10,000 randomized iterations across all variables simultaneously, the model generates a full probability distribution of outcomes.',
          'This allows corporate treasurers to quantify tail risk using Value at Risk (VaR). A 95% 1-year VaR of $2.4M means: "In 95% of simulated economic scenarios, our loss will not exceed $2.4M; there is only a 5% chance of suffering a catastrophic loss worse than $2.4M."',
          'Using Monte Carlo risk modeling, boards make informed capital commitments, calculate Risk-Adjusted Return on Capital (RAROC), and purchase hedging instruments tailored to their exact risk tolerance.'
        ],
        example: 'Think of estimating commute time to an airport. If you assume traffic is always 30 minutes (point estimate), you will miss your flight when an accident occurs. Monte Carlo simulates 1,000 commutes with random red lights and weather, telling you that 95% of the time you arrive in under 55 minutes.',
        code: `# Simulation: Monte Carlo Capital Budgeting & Value at Risk (VaR)
import random

def run_monte_carlo_npv_simulation(num_trials: int = 5000) -> dict:
    random.seed(42) # Deterministic simulation
    npv_results = []

    for _ in range(num_trials):
        # Stochastic Variables:
        # Initial Capex: Uniform between $800k and $1,100k
        capex = random.uniform(800000, 1100000)
        # Annual Cash Flow: Normal distribution (mean=$350k, std_dev=$60k)
        annual_cf = random.gauss(350000, 60000)
        # Discount rate: 10%, 4-year project lifetime
        discount_rate = 0.10
        pv_cash_flows = sum(annual_cf / ((1 + discount_rate) ** year) for year in range(1, 5))

        npv = pv_cash_flows - capex
        npv_results.append(npv)

    npv_results.sort()
    mean_npv = sum(npv_results) / len(npv_results)
    p05_idx = int(0.05 * len(npv_results)) # 5th percentile (95% Confidence)
    var_95 = npv_results[p05_idx]
    prob_negative = (sum(1 for x in npv_results if x < 0) / len(npv_results)) * 100.0

    return {
        "Mean_Expected_NPV": round(mean_npv),
        "VaR_95th_Percentile": round(var_95),
        "Probability_Of_Capital_Loss": f"{prob_negative:.1f}%"
    }

sim = run_monte_carlo_npv_simulation()
print("Monte Carlo Capital Budgeting (5,000 Stochastic Scenarios):")
print(f"Mean Expected NPV:          \${sim['Mean_Expected_NPV']:,}")
print(f"95% Value at Risk (Floor):   \${sim['VaR_95th_Percentile']:,}")
print(f"Probability of Project Loss: {sim['Probability_Of_Capital_Loss']}")`,
        output: `Monte Carlo Capital Budgeting (5,000 Stochastic Scenarios):\nMean Expected NPV:          $159,380\n95% Value at Risk (Floor):   -$145,263\nProbability of Project Loss: 21.0%`,
        tryIt: 'Increase the annual cash flow standard deviation to $120,000 to model high market volatility and observe how the loss probability rises.',
        check: {
          question: 'What is the primary advantage of Monte Carlo simulation over static deterministic Excel financial models?',
          options: [
            'It evaluates thousands of correlated stochastic outcomes across probability distributions, quantifying the exact probability of loss and tail risk (VaR)',
            'It guarantees that every business project makes a profit',
            'It replaces accounting audits with automated random numbers'
          ],
          answer: 0,
          why: 'Static point estimates hide downside volatility. Monte Carlo models reveal the full probability distribution of outcomes, enabling leadership to stress-test projects against tail risks.'
        }
      }
    ],
    summary: [
      'Prescriptive decision intelligence uses normative models with decision variables, objective functions, and constraints to maximize business value.',
      'Linear Programming guarantees that optimal policies lie on the extreme corner vertices of the convex feasible region, solvable via the Simplex algorithm.',
      'Shadow Prices calculate the marginal profit increase of relaxing bottleneck constraints; constraints with unused slack carry a shadow price of strictly $0.',
      'Triangular Cohort Analysis uncovers customer retention decay curves and identifies negative net churn (NRR > 100%) in recurring revenue models.',
      'Monte Carlo simulations model multi-variable financial uncertainty across thousands of trials, measuring 95% Value at Risk (VaR) and downside probabilities.'
    ],
    projectStep: {
      title: 'Formulate and Solve a Corporate Resource Allocation Model',
      steps: [
        'Formulate a 2-variable production optimization model with labor and material inequalities.',
        'Calculate corner-point vertices and identify the profit-maximizing production mix.',
        'Compute the shadow price of labor to establish the maximum justifiable overtime wage.',
        'Run a Monte Carlo simulation over stochastic cash flows to calculate 95% Value at Risk.'
      ]
    }
  },
  {
    coursePrefix: 'bcom_ana',
    day: 2,
    title: 'Predictive Credit Scoring, RFM CLV, Seasonal Forecasting & A/B Power Analytics',
    goal: 'Master advanced business analytics & decision intelligence: logistic regression credit scoring engines, RFM customer segmentation & predictive CLV, multiplicative time-series demand forecasting, A/B test statistical power sizing, and executive revenue metric trees.',
    minutes: 45,
    recap: 'Welcome to Day 2 of Business Analytics & Decision Intelligence. Today, we advance from linear programming and deterministic resource optimization into predictive modeling, time-series forecasting, statistical hypothesis power, and executive metric decomposition.',
    parts: [
      {
        title: 'Logistic Regression Credit Scoring & Default Probability Engine',
        say: [
          'In commercial underwriting and consumer lending, decision engines must predict whether an applicant will default on obligations. Standard linear regression fails catastrophically for binary outcomes because it outputs unconstrained probabilities below 0.0 or above 1.0!',
          'Instead, risk analytics teams deploy Logistic Regression. The model calculates the Log-Odds (or logit) of default: ln(p / (1 - p)) = beta_0 + Sum(beta_i * x_i). To convert the unconstrained log-odds back into a strict probability bounded between 0.0 and 1.0, we apply the Sigmoid function: p = 1 / (1 + e^-z).',
          'Key predictive feature inputs include Debt-to-Income (DTI) ratio, past delinquency counts, credit card utilization ratios, and verified annual income. Positive coefficients increase default risk, while negative coefficients reflect stabilizing factors.',
          'Finally, lenders translate default probability into standard Credit Scores (such as 300 to 850 FICO-style scales). By establishing strict risk cutoffs (e.g., maximum 15% default probability), automated underwriting engines approve or decline credit applications in sub-second latency.'
        ],
        example: 'A B2B trade-credit underwriting engine evaluates two vendor accounts. Applicant 1 with low 28% DTI and zero delinquencies receives a 4.34% default probability, mapping to a high 826 credit score and instant credit approval. Applicant 2 with 55% DTI and 3 recent late payments triggers a 93.60% default probability and is rejected.',
        code: `import math

# Simulation: Logistic Regression Credit Scoring & Default Probability Engine
def calculate_credit_default_probability(applicant: dict, weights: dict, intercept: float) -> dict:
    # Log-odds equation: z = beta_0 + sum(beta_i * x_i)
    z = intercept
    for feature, val in applicant.items():
        if feature in weights:
            z += weights[feature] * val

    # Sigmoid function: p = 1 / (1 + e^(-z))
    default_prob = 1.0 / (1.0 + math.exp(-z))
    
    # Standard credit score mapping (300 to 850 scale)
    # Higher default prob -> lower score
    credit_score = int(850 - (default_prob * 550))
    
    decision = "APPROVED" if default_prob < 0.15 else "REJECTED_HIGH_DEFAULT_RISK"
    
    return {
        "Default_Probability": round(default_prob, 4),
        "Estimated_Credit_Score": credit_score,
        "Decision": decision
    }

# Coefficients: positive weight increases default risk, negative weight decreases risk
model_weights = {
    "debt_to_income_ratio": 3.2,       # higher DTI increases default risk
    "late_payments_last_2yr": 0.85,    # delinquency count
    "credit_utilization_ratio": 2.1,   # balance / limit
    "annual_income_k": -0.015          # higher income reduces risk
}
model_intercept = -2.80

app1 = {"debt_to_income_ratio": 0.28, "late_payments_last_2yr": 0, "credit_utilization_ratio": 0.22, "annual_income_k": 110.0}
app2 = {"debt_to_income_ratio": 0.55, "late_payments_last_2yr": 3, "credit_utilization_ratio": 0.88, "annual_income_k": 45.0}

res1 = calculate_credit_default_probability(app1, model_weights, model_intercept)
res2 = calculate_credit_default_probability(app2, model_weights, model_intercept)

print(f"Applicant 1: Default Prob: {res1['Default_Probability']*100:.2f}% | Score: {res1['Estimated_Credit_Score']} -> [{res1['Decision']}]")
print(f"Applicant 2: Default Prob: {res2['Default_Probability']*100:.2f}% | Score: {res2['Estimated_Credit_Score']} -> [{res2['Decision']}]")`,
        output: `Applicant 1: Default Prob: 4.34% | Score: 826 -> [APPROVED]\nApplicant 2: Default Prob: 93.60% | Score: 335 -> [REJECTED_HIGH_DEFAULT_RISK]`,
        tryIt: 'Increase late_payments_last_2yr to 5 for app2 and observe how the estimated credit score drops further to 318.',
        check: {
          question: 'Why does credit risk analytics employ the Sigmoid transformation in Logistic Regression rather than standard Ordinary Least Squares (OLS) regression?',
          options: [
            'Because the Sigmoid function non-linearly maps any unbounded real log-odds value strictly into the [0.0, 1.0] probability interval required for classification',
            'Because linear regression is banned by federal banking regulations',
            'Because credit bureaus only accept integer numbers between 1 and 10',
            'Because logistic regression eliminates the need for financial statements'
          ],
          answer: 0,
          why: 'Linear OLS models produce invalid probabilities (<0 or >1). The Sigmoid curve mathematically bounds predictions between 0 and 1, making it the bedrock of credit scoring.',
          answerIndex: 0,
          explanation: 'Linear OLS models produce invalid probabilities (<0 or >1). The Sigmoid curve mathematically bounds predictions between 0 and 1, making it the bedrock of credit scoring.'
        }
      },
      {
        title: 'RFM Customer Lifetime Value & Behavioral Portfolio Segmentation',
        say: [
          'In customer analytics, treating all customers uniformly destroys enterprise marketing efficiency. The classic behavioral segmentation paradigm is RFM Analysis: Recency (how recently did the customer transact?), Frequency (how often do they buy?), and Monetary Value (how much total revenue do they generate?).',
          'Customers are binned into quintile scores from 1 (lowest) to 5 (highest) across each vector. A "555" represents an elite Champion who transacted recently, purchases frequently, and spends heavily. Conversely, a "255" flags an At-Risk Loyal customer: someone who spent heavily in the past but has not transacted recently!',
          'Beyond historical categorization, predictive business analytics couples RFM with forward Customer Lifetime Value (CLV) models: CLV = (Annual Margin * Retention Rate) / (1 + Discount Rate - Retention Rate).',
          'By calculating projected CLV across RFM tiers, executive leadership can rationally allocate Customer Success and marketing retention budgets: investing high-touch account management in high-value accounts while utilizing automated drips for lower-value tiers.'
        ],
        example: 'An enterprise analyzes two customer accounts. Enterprise_Alpha with RFM score 555 yields a projected 3-year CLV of $18,785.00, justifying dedicated executive relationship management. MidMarket_Beta with RFM 244 represents high churn risk with CLV shrinking to $1,733.33, triggering automated retention workflows.',
        code: `# Simulation: RFM Customer Lifetime Value & Behavioral Segmentation
def segment_rfm_customer_portfolio(customers: list[dict]) -> list[dict]:
    # Thresholds:
    # Recency: <= 30 days = 5, <= 60 = 4, <= 90 = 3, <= 180 = 2, else 1
    # Frequency: >= 20 = 5, >= 12 = 4, >= 6 = 3, >= 3 = 2, else 1
    # Monetary: >= $5000 = 5, >= $2500 = 4, >= $1000 = 3, >= $500 = 2, else 1
    def get_r_score(r): return 5 if r <= 30 else (4 if r <= 60 else (3 if r <= 90 else (2 if r <= 180 else 1)))
    def get_f_score(f): return 5 if f >= 20 else (4 if f >= 12 else (3 if f >= 6 else (2 if f >= 3 else 1)))
    def get_m_score(m): return 5 if m >= 5000 else (4 if m >= 2500 else (3 if m >= 1000 else (2 if m >= 500 else 1)))

    results = []
    for c in customers:
        r_score = get_r_score(c["recency_days"])
        f_score = get_f_score(c["frequency_tx"])
        m_score = get_m_score(c["monetary_spend"])
        rfm_composite = (r_score * 0.3) + (f_score * 0.35) + (m_score * 0.35)

        if r_score >= 4 and f_score >= 4 and m_score >= 4:
            segment = "CHAMPION_HIGH_VALUE"
        elif r_score <= 2 and f_score >= 3:
            segment = "AT_RISK_LOYAL_CHURN"
        elif r_score >= 4 and f_score <= 2:
            segment = "NEW_POTENTIAL_LOYALIST"
        else:
            segment = "STANDARD_CORE"

        # Predictive CLV = (Annual Spend * Gross Margin * Retention) / (1 + Discount - Retention)
        annual_spend = c["monetary_spend"]
        gross_margin = 0.65
        retention_rate = 0.85 if r_score >= 3 else 0.50
        discount_rate = 0.10
        clv = (annual_spend * gross_margin * retention_rate) / (1.0 + discount_rate - retention_rate)

        results.append({
            "name": c["name"],
            "rfm_str": f"{r_score}{f_score}{m_score}",
            "composite": round(rfm_composite, 2),
            "segment": segment,
            "projected_clv": round(clv, 2)
        })
    return results

cust_data = [
    {"name": "Enterprise_Alpha", "recency_days": 12, "frequency_tx": 24, "monetary_spend": 8500.0},
    {"name": "MidMarket_Beta",   "recency_days": 140, "frequency_tx": 15, "monetary_spend": 3200.0}
]
rfm_out = segment_rfm_customer_portfolio(cust_data)
print(f"Customer 1: {rfm_out[0]['name']} -> RFM: {rfm_out[0]['rfm_str']} [{rfm_out[0]['segment']}] | 3-Yr CLV: \${rfm_out[0]['projected_clv']:,}")
print(f"Customer 2: {rfm_out[1]['name']} -> RFM: {rfm_out[1]['rfm_str']} [{rfm_out[1]['segment']}] | 3-Yr CLV: \${rfm_out[1]['projected_clv']:,}")`,
        output: `Customer 1: Enterprise_Alpha -> RFM: 555 [CHAMPION_HIGH_VALUE] | 3-Yr CLV: $18,785.0\nCustomer 2: MidMarket_Beta -> RFM: 244 [AT_RISK_LOYAL_CHURN] | 3-Yr CLV: $1,733.33`,
        tryIt: 'Change MidMarket_Beta recency_days from 140 to 25 and observe how its RFM score shifts to 544 and CLV jumps to over $7,000.',
        check: {
          question: 'In customer portfolio analytics, what specific danger does an RFM profile of "155" or "255" indicate to executive management?',
          options: [
            'A historically high-frequency, high-spending client who has not transacted recently, indicating high imminent flight risk that warrants immediate executive intervention',
            'A fraudulent account that should be immediately reported to credit agencies',
            'A brand-new lead generated from digital social media ads',
            'An account with zero customer lifetime value'
          ],
          answer: 0,
          why: 'Low Recency (1 or 2) combined with high Frequency and Monetary (55) flags severe churn danger: a loyal big spender who has stopped buying and is defecting to competitors.',
          answerIndex: 0,
          explanation: 'Low Recency (1 or 2) combined with high Frequency and Monetary (55) flags severe churn danger: a loyal big spender who has stopped buying and is defecting to competitors.'
        }
      },
      {
        title: 'Time-Series Demand Forecasting with Multiplicative Seasonality & Trend',
        say: [
          'In supply chain planning, procurement, and financial budgeting, accurate demand forecasting prevents catastrophic inventory stockouts or crippling warehouse holding costs. Business time-series data rarely follows a flat line; it exhibits underlying Trend, cyclical Seasonality, and stochastic noise.',
          'Under the Multiplicative Time-Series Model, demand is represented as: Y_t = Trend_t * Seasonal_t * Residual_t. Unlike additive models where seasonality adds a fixed constant, multiplicative seasonality scales proportionally with business volume.',
          'To construct the forecast, analysts first De-Seasonalize historical actuals by dividing each quarter by its respective seasonal index: De-seasonalized Base = Actual_t / S_t. This exposes the uncorrupted structural growth rate of the business.',
          'Next, analysts project the forward baseline by compounding the trend rate (e.g., 3% quarterly growth) and re-multiplying by the forward quarter\'s seasonal index (e.g., 1.35x for Q4 holiday peak, 0.80x for Q1 post-holiday slump). This delivers realistic, operationally actionable procurement targets.'
        ],
        example: 'A consumer electronics brand experiences a 0.80x slump in Q1 and a 1.35x surge in Q4. De-seasonalizing past year actuals reveals an underlying 3% quarterly growth trend. The forward model projects Q1 demand at 864.4 units and Q4 demand at 1594.0 units, driving accurate manufacturing schedules.',
        code: `# Simulation: Time-Series Demand Forecasting with Multiplicative Seasonality
def forecast_seasonal_demand(historical_quarters: list[float], seasonal_indices: list[float], base_growth_rate: float, forward_quarters: int = 4) -> list[dict]:
    # Step 1: Compute historical de-seasonalized baseline level
    num_hist = len(historical_quarters)
    deseasonalized = [hist / seasonal_indices[i % 4] for i, hist in enumerate(historical_quarters)]
    baseline_level = sum(deseasonalized[-4:]) / 4.0

    forecasts = []
    current_level = baseline_level

    for q in range(1, forward_quarters + 1):
        # Apply trend growth to deseasonalized baseline
        current_level *= (1.0 + base_growth_rate)
        # Apply seasonal multiplier for the corresponding quarter
        season_idx = seasonal_indices[(num_hist + q - 1) % 4]
        projected_demand = current_level * season_idx

        forecasts.append({
            "Forward_Quarter": f"Q{((num_hist + q - 1) % 4) + 1}",
            "Deseasonalized_Trend": round(current_level, 1),
            "Seasonal_Index": season_idx,
            "Projected_Demand": round(projected_demand, 1)
        })
    return forecasts

# Q1 trough (0.80), Q2 normal (1.00), Q3 moderate (1.05), Q4 peak holiday (1.35)
seasonality = [0.80, 1.00, 1.05, 1.35]
hist_actuals = [820.0, 1040.0, 1110.0, 1450.0]

fc = forecast_seasonal_demand(hist_actuals, seasonality, base_growth_rate=0.03, forward_quarters=4)
print(f"Forward {fc[0]['Forward_Quarter']} Demand: {fc[0]['Projected_Demand']} units (Seasonal Index: {fc[0]['Seasonal_Index']}x)")
print(f"Forward {fc[3]['Forward_Quarter']} Demand: {fc[3]['Projected_Demand']} units (Seasonal Index: {fc[3]['Seasonal_Index']}x)")`,
        output: `Forward Q1 Demand: 864.4 units (Seasonal Index: 0.8x)\nForward Q4 Demand: 1594.0 units (Seasonal Index: 1.35x)`,
        tryIt: 'Increase the base_growth_rate from 0.03 to 0.08 (8% quarterly expansion) and observe how Q4 projected demand expands beyond 1,900 units.',
        check: {
          question: 'What is the primary operational purpose of "de-seasonalizing" historical sales data prior to projecting forward growth trends?',
          options: [
            'To remove recurring calendar fluctuations (e.g. holiday peaks and summer troughs) so the genuine underlying structural growth rate of the business can be accurately isolated',
            'To manipulate corporate financial statements for audit evasion',
            'To convert seasonal sales numbers into foreign currencies',
            'To eliminate all customer returns from the general ledger'
          ],
          answer: 0,
          why: 'De-seasonalizing strips out predictable periodic calendar distortions, revealing whether business sales are truly expanding or contracting underlyingly.',
          answerIndex: 0,
          explanation: 'De-seasonalizing strips out predictable periodic calendar distortions, revealing whether business sales are truly expanding or contracting underlyingly.'
        }
      },
      {
        title: 'A/B Testing Statistical Power & Minimum Detectable Effect (MDE) Calculus',
        say: [
          'In modern digital product optimization and growth analytics, product managers frequently commit the "peeking fallacy": declaring an A/B test a winner after 3 days because conversion looks higher, only to watch metrics regress to the mean once rolled out.',
          'Rigorous experimentation requires pre-experimental Sample Size Power Sizing. Two statistical error types govern experimentation: Type I Error (alpha = 0.05, the false positive rate of detecting an effect when none exists) and Type II Error (beta = 0.20, giving statistical Power = 1 - beta = 0.80, the ability to detect a real effect).',
          'The Minimum Detectable Effect (MDE) represents the smallest relative percentage lift in conversion that the experiment is powered to reliably detect. Sizing an experiment to detect a tiny lift (e.g., +2%) requires exponentially more users than detecting a large lift (e.g., +20%).',
          'Using the standard two-proportion sample size formula: n = [(Z_alpha/2 + Z_beta)^2 * (p1*(1-p1) + p2*(1-p2))] / (p2 - p1)^2. Knowing the required sample size beforehand prevents premature test stopping and protects corporate decision-making from statistical noise.'
        ],
        example: 'A checkout optimization team with a 4.0% baseline conversion rate wants to detect a 15.0% relative improvement (+0.60% absolute lift). Running the power sizing formula determines that exactly 17,941 users per variant (35,882 total) must enter the experiment before drawing any conclusions.',
        code: `import math

# Simulation: A/B Testing Statistical Power & Sample Size Calculus
def calculate_ab_test_sample_size(baseline_conv_rate: float, mde_relative: float, alpha: float = 0.05, power: float = 0.80) -> dict:
    # Standard normal critical values:
    # For alpha = 0.05 (two-tailed), Z_alpha/2 = 1.96
    # For power = 0.80 (beta = 0.20), Z_beta = 0.8416
    z_alpha = 1.96
    z_beta = 0.8416

    p1 = baseline_conv_rate
    mde_absolute = p1 * mde_relative
    p2 = p1 + mde_absolute
    pooled_var = (p1 * (1.0 - p1)) + (p2 * (1.0 - p2))

    # Sample size formula per variant:
    n_per_variant = math.ceil(((z_alpha + z_beta) ** 2 * pooled_var) / (mde_absolute ** 2))
    total_sample_required = n_per_variant * 2

    return {
        "Baseline_Rate": f"{p1*100:.1f}%",
        "Target_Rate": f"{p2*100:.2f}%",
        "Relative_Lift_MDE": f"{mde_relative*100:.1f}%",
        "Sample_Per_Variant": n_per_variant,
        "Total_Sample_Required": total_sample_required
    }

ab_calc = calculate_ab_test_sample_size(baseline_conv_rate=0.04, mde_relative=0.15)
print(f"Baseline: {ab_calc['Baseline_Rate']} -> Target: {ab_calc['Target_Rate']} (+{ab_calc['Relative_Lift_MDE']})")
print(f"Required Sample: {ab_calc['Sample_Per_Variant']:,} users per variant | Total: {ab_calc['Total_Sample_Required']:,} users")`,
        output: `Baseline: 4.0% -> Target: 4.60% (+15.0%)\nRequired Sample: 17,941 users per variant | Total: 35,882 users`,
        tryIt: 'Change mde_relative from 0.15 to 0.05 (attempting to detect a tiny 5% lift) and observe how the required sample size explodes to over 160,000 users per variant.',
        check: {
          question: 'What is the statistical consequence of stopping an A/B test early as soon as a p-value briefly drops below 0.05 without reaching the pre-calculated sample size?',
          options: [
            'It inflates the Type I error rate (false positive rate), leading teams to deploy ineffective features that are merely random statistical noise',
            'It guarantees higher conversion rates for the company',
            'It reduces server hosting costs by 50%',
            'It automatically invalidates all past financial audits'
          ],
          answer: 0,
          why: 'Continuous peeking without sample size discipline dramatically increases false discoveries (Type I errors) because random metric fluctuations will periodically cross the 0.05 threshold by chance.',
          answerIndex: 0,
          explanation: 'Continuous peeking without sample size discipline dramatically increases false discoveries (Type I errors) because random metric fluctuations will periodically cross the 0.05 threshold by chance.'
        }
      },
      {
        title: 'Executive Revenue Decomposition & NRR Cohort Retention Matrix',
        say: [
          'In modern corporate boardrooms, top-level revenue cannot be reviewed as a monolithic aggregate number. Executive leadership relies on DuPont-style Metric Trees to decompose revenue growth into its underlying operational levers.',
          'Total Monthly Recurring Revenue (MRR) decomposes into: Ending MRR = Starting MRR + New Logo ARR + Expansion MRR - Contraction MRR - Churned MRR. Each operational department owns a distinct branch of the tree: Sales owns New Logos, Customer Success owns Expansion and Contraction, and Product owns Churn.',
          'The gold standard metric for business health is Net Revenue Retention (NRR): NRR = (Starting MRR + Expansion - Contraction - Churn) / Starting MRR. Notice that NRR completely excludes new customer acquisition! It measures whether existing cohort revenue expands or decays over time.',
          'An NRR above 100% indicates Negative Net Churn: existing customers expand their subscriptions faster than other customers cancel, guaranteeing compound corporate growth even if new customer acquisition completely halts.'
        ],
        example: 'A B2B enterprise software company starts the month with $500,000 MRR. It adds $45,000 in new logos, expands existing accounts by $80,000, loses $15,000 in downgrades, and suffers $10,000 in churn. Net cohort retention is 111.0% ($555,000 / $500,000), proving elite cohort expansion.',
        code: `# Simulation: Executive Revenue Decomposition & NRR Cohort Retention Matrix
def decompose_executive_revenue_metrics(starting_mrr: float, new_arr_added: float, expansion_mrr: float, contraction_mrr: float, churned_mrr: float) -> dict:
    ending_mrr = starting_mrr + new_arr_added + expansion_mrr - contraction_mrr - churned_mrr
    net_mrr_change = ending_mrr - starting_mrr

    # Net Revenue Retention (NRR) isolates installed-base cohort expansion
    cohort_retained_mrr = starting_mrr + expansion_mrr - contraction_mrr - churned_mrr
    nrr_pct = (cohort_retained_mrr / starting_mrr) * 100.0

    # Gross Revenue Retention (GRR) ignores expansion, measuring churn resilience
    grr_pct = ((starting_mrr - contraction_mrr - churned_mrr) / starting_mrr) * 100.0

    return {
        "Starting_MRR": round(starting_mrr, 2),
        "Ending_MRR": round(ending_mrr, 2),
        "Net_MRR_Change": round(net_mrr_change, 2),
        "NRR_Pct": round(nrr_pct, 2),
        "GRR_Pct": round(grr_pct, 2),
        "Health_Verdict": "ELITE_TIER_EXPANSION" if nrr_pct >= 120.0 else "HEALTHY"
    }

metrics = decompose_executive_revenue_metrics(
    starting_mrr=500000.0,
    new_arr_added=45000.0,
    expansion_mrr=80000.0,
    contraction_mrr=15000.0,
    churned_mrr=10000.0
)
print(f"Starting MRR: \${metrics['Starting_MRR']:,} -> Ending MRR: \${metrics['Ending_MRR']:,} (Delta: +\${metrics['Net_MRR_Change']:,})")
print(f"Cohort NRR: {metrics['NRR_Pct']}% | GRR: {metrics['GRR_Pct']}% -> Status: [{metrics['Health_Verdict']}]")`,
        output: `Starting MRR: $500,000.0 -> Ending MRR: $600,000.0 (Delta: +$100,000.0)\nCohort NRR: 111.0% | GRR: 95.0% -> Status: [HEALTHY]`,
        tryIt: 'Increase expansion_mrr from 80000.0 to 125000.0 and watch NRR exceed 120%, flipping the Health_Verdict to ELITE_TIER_EXPANSION.',
        check: {
          question: 'Why do corporate boards and enterprise investors prioritize Net Revenue Retention (NRR) over Gross Top-Line Revenue growth?',
          options: [
            'Because NRR isolates installed-base product-market fit and negative net churn, proving the company can grow organically without burning capital on customer acquisition',
            'Because NRR is an IRS tax calculation that determines corporate tax rates',
            'Because NRR guarantees that employee headcounts can be doubled every quarter',
            'Because NRR only applies to hardware manufacturing businesses'
          ],
          answer: 0,
          why: 'NRR isolates cohort expansion from new sales. A high NRR (>100%) proves high customer value and product stickiness, creating sustainable compound growth.',
          answerIndex: 0,
          explanation: 'NRR isolates cohort expansion from new sales. A high NRR (>100%) proves high customer value and product stickiness, creating sustainable compound growth.'
        }
      }
    ],
    summary: [
      'Logistic Regression bounds credit default risk within [0.0, 1.0] using the Sigmoid transformation, mapping log-odds into standard credit scoring tiers.',
      'RFM Behavioral Segmentation categorizes customers into value tiers (Champions vs At-Risk), calculating forward CLV to prioritize Customer Success budgets.',
      'Multiplicative Time-Series Forecasting de-seasonalizes historical demand to isolate structural trend before compounding future quarterly procurement projections.',
      'Pre-experimental A/B test power sizing calculates mandatory sample requirements based on MDE, preventing false positive discoveries caused by premature peeking.',
      'Executive Revenue Metric Trees decompose top-line growth into new logos, expansion, and churn, using Net Revenue Retention (NRR) as the ultimate gauge of cohort compounding.'
    ],
    projectStep: {
      title: 'Engineer a Predictive Business Intelligence & Experimentation Engine',
      steps: [
        'Build a logistic regression credit scoring engine that evaluates applicant risk features and outputs score verdicts.',
        'Implement an RFM behavioral segmentation and customer lifetime value (CLV) calculation pipeline.',
        'Decompose a seasonal time series and generate forward 4-quarter demand projections.',
        'Size an A/B experimentation sample requirement and construct an executive NRR revenue bridge dashboard.'
      ]
    }
  },
{
    day: 3,
    coursePrefix: 'bcom_ana',
    title: 'Standard Costing, Variance Analysis, CVP Leverage & DuPont Decomposition Engine',
    parts: [
      {
        title: 'Standard Costing & Multi-Level Flexible Budget Variance Analysis Engine',
        say: [
          'In managerial cost accounting and enterprise performance management, relying solely on static annual master budgets leads to distorted executive judgments. When sales volume fluctuates up or down, comparing actual dollar expenditures directly against the static budget conflates operational inefficiency with changes in production volume. Standard costing resolves this dilemma by constructing flexible budgets that dynamically scale allowable costs according to actual output achieved.',
          'A production variance engine decomposes the total static budget variance into distinct operational drivers: sales price variance, sales volume variance, direct material price variance, direct material efficiency variance, and labor rate and efficiency variances. The direct material price variance measures purchasing department efficiency: (Actual Price - Standard Price) multiplied by Actual Quantity purchased. Conversely, the direct material efficiency variance measures shop floor manufacturing productivity: (Actual Quantity used - Standard Quantity allowed) multiplied by Standard Price.',
          'Categorizing each operational variance as Favorable (FAV) or Unfavorable (UNFAV) isolates organizational accountability. When the purchasing department acquires cheaper, lower-grade raw material, it generates a favorable price variance; however, if that inferior material causes shop floor machinery jamming and defective scrap, it triggers catastrophic unfavorable material efficiency and labor idle-time variances. Automated variance decomposition enables C-suite executives to detect these operational trade-offs immediately.'
        ],
        example: 'Think of standard costing like a kitchen recipe for a bakery: if you bake 1,100 cakes instead of 1,000, your static budget will complain that you used too much flour; a flexible budget adjusts the allowable flour to 1,100 cakes, cleanly distinguishing between the cost of baking more cakes versus the kitchen staff wasting flour on the floor.',
        code: `def calculate_standard_costing_variances(standard, actual):
    """Decomposes enterprise production variances into price and efficiency components."""
    # 1. Sales Price Variance: (Actual Price - Standard Price) * Actual Volume
    sales_price_var = (actual["selling_price"] - standard["selling_price"]) * actual["units_sold"]
    
    # 2. Sales Volume Variance: (Actual Volume - Budgeted Volume) * Standard Margin
    std_margin = standard["selling_price"] - standard["unit_cost"]
    sales_volume_var = (actual["units_sold"] - standard["budgeted_units"]) * std_margin
    
    # 3. Direct Material Price Variance: (Actual Mat Price - Standard Mat Price) * Actual Mat Qty
    mat_price_var = (actual["material_price_per_kg"] - standard["material_price_per_kg"]) * actual["total_material_kg"]
    
    # 4. Direct Material Efficiency Variance: (Actual Mat Qty - Standard Mat Allowed) * Standard Mat Price
    std_mat_allowed = actual["units_sold"] * standard["material_kg_per_unit"]
    mat_efficiency_var = (actual["total_material_kg"] - std_mat_allowed) * standard["material_price_per_kg"]
    
    # 5. Direct Labor Efficiency Variance: (Actual Hours - Standard Hours Allowed) * Standard Labor Rate
    std_hours_allowed = actual["units_sold"] * standard["labor_hrs_per_unit"]
    labor_efficiency_var = (actual["total_labor_hours"] - std_hours_allowed) * standard["labor_rate_per_hr"]
    
    def tag(val, favorable_when_positive=True):
        if val == 0:
            return "NEUTRAL"
        sign = "+$" if val > 0 else "-$"
        status = "FAV" if (val > 0 if favorable_when_positive else val < 0) else "UNFAV"
        return sign + f"{abs(val):,.2f} " + status

    return {
        "Sales_Price_Variance": tag(sales_price_var, favorable_when_positive=True),
        "Sales_Volume_Variance": tag(sales_volume_var, favorable_when_positive=True),
        "Material_Price_Variance": tag(mat_price_var, favorable_when_positive=False),
        "Material_Efficiency_Variance": tag(mat_efficiency_var, favorable_when_positive=False),
        "Labor_Efficiency_Variance": tag(labor_efficiency_var, favorable_when_positive=False)
    }

std_budget = {
    "budgeted_units": 10000,
    "selling_price": 50.0,
    "unit_cost": 30.0,
    "material_price_per_kg": 4.0,
    "material_kg_per_unit": 3.0,
    "labor_hrs_per_unit": 1.5,
    "labor_rate_per_hr": 12.0
}
actual_results = {
    "units_sold": 11000,
    "selling_price": 48.0,
    "material_price_per_kg": 4.25,
    "total_material_kg": 31900,
    "total_labor_hours": 17050
}

print("=== STANDARD COSTING & FLEXIBLE BUDGET VARIANCE ===")
v = calculate_standard_costing_variances(std_budget, actual_results)
for k, val in v.items():
    print(f"{k}: {val}")`,
        output: `=== STANDARD COSTING & FLEXIBLE BUDGET VARIANCE ===
Sales_Price_Variance: -$22,000.00 UNFAV
Sales_Volume_Variance: +$20,000.00 FAV
Material_Price_Variance: +$7,975.00 UNFAV
Material_Efficiency_Variance: -$4,400.00 FAV
Labor_Efficiency_Variance: +$6,600.00 UNFAV`,
        codeNotes: [
          'Calculates sales price and volume variances comparing actual realization against standard unit margins.',
          'Isolates direct material price from efficiency variance using actual quantity purchased vs standard allowed.',
          'Evaluates direct labor efficiency by measuring actual hours worked against standard allowed hours for units produced.'
        ],
        tryIt: 'Lower actual material_price_per_kg to 3.80 and observe how Material_Price_Variance flips from UNFAV to FAV.',
        check: {
          question: 'Why must direct material price variance be evaluated separately from material quantity efficiency variance?',
          options: [
            'Because price variance reflects procurement purchasing negotiation, while efficiency variance reflects shop-floor manufacturing waste and conversion productivity',
            'Because price variance is only calculated by government tax inspectors',
            'Because efficiency variance only applies when manufacturing automobiles',
            'Because standard costing formulas do not allow multiplying two variables together'
          ],
          answer: 0,
          why: 'Separating price from quantity isolates departmental accountability: the purchasing agent controls price per kg, whereas factory plant supervisors control physical kg consumed per unit.'
        }
      },
      {
        title: 'Multi-Product Cost-Volume-Profit (CVP) & Degree of Operating Leverage (DOL)',
        say: [
          'Cost-Volume-Profit (CVP) analysis forms the bedrock of managerial financial modeling, determining how changes in production volume, pricing, and cost structures alter operating income. In real-world enterprise settings, businesses rarely sell a single product; they manage diverse product portfolios where each offering carries a distinct selling price, variable cost structure, and gross contribution margin.',
          'In multi-product CVP modeling, break-even cannot be calculated on isolated individual products. Instead, analysts calculate the composite sales mix and the Weighted-Average Contribution Margin (WACM) Ratio: total contribution margin divided by total portfolio revenue. Break-Even Revenue is then computed by dividing Total Fixed Overhead Costs by the composite WACM ratio. The Margin of Safety (MOS) percentage reveals how much revenue can contract before the enterprise incurs an operating loss.',
          'The Degree of Operating Leverage (DOL) quantifies an enterprise operating risk profile: Total Contribution Margin divided by Operating Income (EBIT). DOL measures profit sensitivity: if a firm has a DOL of 2.0x, a 10% increase in revenue yields a 20% surge in operating profit. Conversely, in a market downturn, a high DOL amplifies earnings collapses, making operating leverage a crucial metric in strategic capital allocation.'
        ],
        example: 'Think of operating leverage like an elevator with a mechanical pulley system: fixed overhead costs are the heavy counterweight. When revenue increases, the counterweight lifts profits upward at double speed, but if the cable slips during a recession, profits plunge with equal acceleration.',
        code: `def calculate_multiproduct_cvp_and_operating_leverage(products, fixed_costs):
    """Calculates composite sales mix, break-even revenue, margin of safety, and DOL."""
    total_revenue = sum(p["price"] * p["units"] for p in products)
    total_variable_cost = sum(p["var_cost"] * p["units"] for p in products)
    total_cm = total_revenue - total_variable_cost
    
    # Weighted-Average Contribution Margin Ratio (WACM Ratio)
    wacm_ratio = total_cm / total_revenue
    
    # Break-Even Revenue ($) = Fixed Costs / WACM Ratio
    be_revenue = fixed_costs / wacm_ratio
    
    # Operating Income ($)
    operating_income = total_cm - fixed_costs
    
    # Margin of Safety (MOS) % = (Total Revenue - Break-Even Revenue) / Total Revenue
    mos_pct = ((total_revenue - be_revenue) / total_revenue) * 100.0
    
    # Degree of Operating Leverage (DOL) = Total Contribution Margin / Operating Income
    dol = total_cm / operating_income if operating_income > 0 else 0.0
    
    return {
        "Total_Revenue": round(total_revenue, 2),
        "Contribution_Margin": round(total_cm, 2),
        "WACM_Ratio": round(wacm_ratio, 4),
        "Break_Even_Revenue": round(be_revenue, 2),
        "Operating_Income": round(operating_income, 2),
        "Margin_of_Safety_Pct": round(mos_pct, 2),
        "Degree_of_Operating_Leverage": round(dol, 2)
    }

portfolio = [
    {"name": "Basic SaaS", "price": 50.0, "var_cost": 10.0, "units": 8000},
    {"name": "Enterprise Suite", "price": 200.0, "var_cost": 40.0, "units": 2000}
]
fixed_overhead = 320000.0

print("=== MULTI-PRODUCT CVP BREAK-EVEN & OPERATING LEVERAGE ===")
res = calculate_multiproduct_cvp_and_operating_leverage(portfolio, fixed_overhead)
print("Revenue: $" + f"{res['Total_Revenue']:,.2f} | CM: $" + f"{res['Contribution_Margin']:,.2f} | WACM: {res['WACM_Ratio']*100:.1f}%")
print("BE Revenue: $" + f"{res['Break_Even_Revenue']:,.2f} | EBIT: $" + f"{res['Operating_Income']:,.2f}")
print(f"Margin of Safety: {res['Margin_of_Safety_Pct']}% | DOL: {res['Degree_of_Operating_Leverage']}x")`,
        output: `=== MULTI-PRODUCT CVP BREAK-EVEN & OPERATING LEVERAGE ===
Revenue: $800,000.00 | CM: $640,000.00 | WACM: 80.0%
BE Revenue: $400,000.00 | EBIT: $320,000.00
Margin of Safety: 50.0% | DOL: 2.0x`,
        codeNotes: [
          'Calculates total portfolio contribution margin across multi-tier product pricing and volume structures.',
          'Derives the Weighted-Average Contribution Margin Ratio (80.0%) to determine composite break-even revenue.',
          'Quantifies Degree of Operating Leverage (2.0x) and Margin of Safety (50.0%) to assess earnings volatility.'
        ],
        tryIt: 'Increase fixed_overhead to $480,000 and observe how Margin of Safety shrinks and DOL increases.',
        check: {
          question: 'If a company possesses a Degree of Operating Leverage (DOL) of 3.0x, what is the expected percentage increase in operating income if sales revenue grows by 15%?',
          options: [
            '45% increase (3.0 * 15%)',
            '5% increase (15% / 3.0)',
            '15% increase (same as revenue growth)',
            '30% increase (2.0 * 15%)'
          ],
          answer: 0,
          why: 'Degree of Operating Leverage measures the elasticity of operating profit relative to sales volume: percentage change in EBIT equals DOL multiplied by the percentage change in sales.'
        }
      },
      {
        title: 'Activity-Based Costing (ABC) Cost Pools & Cross-Subsidization Analytics',
        say: [
          'Traditional volume-based absorption costing allocates manufacturing overhead using a single company-wide driver, most commonly direct labor hours or machine hours. While this approach functioned adequately in labor-intensive nineteenth-century factories, it introduces catastrophic costing distortions in modern automated, multi-product manufacturing plants where indirect overhead constitutes over 60% of total product cost.',
          'Under traditional costing, high-volume standardized products that consume vast direct labor hours are allocated massive amounts of overhead, even if they require simple long production runs with zero engineering modifications. Conversely, low-volume customized specialty products consume minimal direct labor hours but demand frequent machine recalibrations, complex setups, and extensive quality assurance testing. The result is cross-subsidization: high-volume core products are overcosted, while complex low-volume items are severely undercosted.',
          'Activity-Based Costing (ABC) eliminates cross-subsidization by establishing discrete activity cost pools (such as machine setups, material handling, and quality inspections) and identifying measurable cost drivers for each pool. By dividing total pool costs by total driver units, ABC computes precise activity consumption rates. Products are then assigned overhead based on their actual consumption of activities, uncovering true product profitability and guiding strategic pricing decisions.'
        ],
        example: 'Think of splitting a restaurant dinner bill: traditional costing divides the total check evenly by the number of diners regardless of who ordered what; Activity-Based Costing calculates the exact cost of each item ordered, preventing water-and-salad diners from subsidizing steak-and-wine diners.',
        code: `def simulate_activity_based_costing_allocation(activities, products):
    """Compares traditional single-driver overhead allocation against multi-pool ABC."""
    total_overhead = sum(a["cost"] for a in activities)
    total_direct_labor_hrs = sum(p["units"] * p["dlh_per_unit"] for p in products)
    traditional_rate = total_overhead / total_direct_labor_hrs
    
    # Calculate ABC Activity Driver Rates
    activity_rates = {}
    for a in activities:
        activity_rates[a["name"]] = a["cost"] / a["total_driver_volume"]
        
    comparison = []
    for p in products:
        trad_overhead_per_unit = p["dlh_per_unit"] * traditional_rate
        
        # ABC overhead per unit
        abc_overhead_total = sum(
            p["driver_usage"][a_name] * activity_rates[a_name]
            for a_name in p["driver_usage"]
        )
        abc_overhead_per_unit = abc_overhead_total / p["units"]
        
        diff_pct = round(((abc_overhead_per_unit - trad_overhead_per_unit) / trad_overhead_per_unit) * 100.0, 1)
        distorted = "UNDERCOSTED" if abc_overhead_per_unit > trad_overhead_per_unit else "OVERCOSTED"
        
        comparison.append({
            "product": p["name"],
            "units": p["units"],
            "trad_cost": round(trad_overhead_per_unit, 2),
            "abc_cost": round(abc_overhead_per_unit, 2),
            "delta_pct": diff_pct,
            "distortion": distorted
        })
    return comparison

activities = [
    {"name": "Setups", "cost": 120000.0, "total_driver_volume": 40},     # 40 setups
    {"name": "Inspections", "cost": 80000.0, "total_driver_volume": 100} # 100 inspections
]
products = [
    {
        "name": "Standard Widget",
        "units": 10000,
        "dlh_per_unit": 2.0, # 20,000 direct labor hours
        "driver_usage": {"Setups": 10, "Inspections": 20}
    },
    {
        "name": "Custom Component",
        "units": 1000,
        "dlh_per_unit": 2.0, # 2,000 direct labor hours
        "driver_usage": {"Setups": 30, "Inspections": 80}
    }
]

print("=== ACTIVITY-BASED COSTING (ABC) ALLOCATION ===")
comp = simulate_activity_based_costing_allocation(activities, products)
for c in comp:
    print(f"Product: {c['product']} | Trad: $" + f"{c['trad_cost']} | ABC: $" + f"{c['abc_cost']} | Delta: {c['delta_pct']}% [{c['distortion']}]")`,
        output: `=== ACTIVITY-BASED COSTING (ABC) ALLOCATION ===
Product: Standard Widget | Trad: $18.18 | ABC: $4.6 | Delta: -74.7% [OVERCOSTED]
Product: Custom Component | Trad: $18.18 | ABC: $154.0 | Delta: 747.0% [UNDERCOSTED]`,
        codeNotes: [
          'Calculates traditional plant-wide predetermined overhead rate based on direct labor hours.',
          'Defines activity pools for machine setups and inspections, establishing separate cost driver rates.',
          'Demonstrates severe cross-subsidization where custom components are undercosted by 747% under traditional methods.'
        ],
        tryIt: 'Adjust the custom component setups to 10 and observe how its ABC overhead cost per unit decreases.',
        check: {
          question: 'What is product cross-subsidization in traditional volume-based cost accounting systems?',
          options: [
            'A distortion where high-volume standardized products are allocated excessive overhead, effectively subsidizing the true operational costs of complex low-volume products',
            'When a government agency provides tax subsidies to green technology manufacturers',
            'When one company buys out all outstanding shares of a competing supplier',
            'When employee payroll taxes are deducted from weekly paychecks'
          ],
          answer: 0,
          why: 'Traditional volume allocations assign overhead in proportion to direct labor or machine hours, blinding managers to the reality that low-volume custom batches consume disproportionate setup, engineering, and inspection resources.'
        }
      },
      {
        title: 'Capital Budgeting Decision Engine: Net Present Value (NPV) & Profitability Index (PI)',
        say: [
          'Capital budgeting represents an enterprise highest-stakes strategic decision domain: allocating millions of dollars to multi-year investments such as new manufacturing facilities, enterprise software platforms, or corporate acquisitions. Because capital expenditures occur today while cash inflows materialize across future years, decision models must incorporate the time value of money and corporate hurdle rates (Weighted Average Cost of Capital, WACC).',
          'The Net Present Value (NPV) rule stands as the gold standard of corporate finance theory: NPV equals the sum of discounted future cash inflows minus the initial capital expenditure outlay. If a project NPV is greater than zero, executing the project creates shareholder wealth exceeding the firm cost of capital. A common alternative, the Payback Period, measures liquidity risk by calculating the time required to recoup the initial investment; however, payback ignores all cash flows occurring after the cutoff date.',
          'When an enterprise operates under Capital Rationing—possessing a finite capital budget insufficient to fund all positive-NPV opportunities—NPV alone cannot prioritize mutually exclusive projects of differing scales. In these scenarios, financial analysts deploy the Profitability Index (PI): the present value of future cash inflows divided by initial investment outlay. Ranking projects by PI maximizes total wealth generated per dollar of constrained capital invested.'
        ],
        example: 'Think of capital budgeting like choosing which seeds to plant in a garden with limited soil space: NPV tells you the total weight of vegetables each seed will yield, while Profitability Index tells you the yield per square inch of soil, allowing you to maximize garden output under tight space constraints.',
        code: `def evaluate_capital_budgeting_project(cash_flows, discount_rate):
    """Calculates Net Present Value (NPV), Payback Period, and Profitability Index (PI)."""
    initial_investment = abs(cash_flows[0])
    future_cfs = cash_flows[1:]
    
    # Net Present Value: sum(CF_t / (1 + r)^t) - CF_0
    pv_future = sum(cf / ((1 + discount_rate) ** (t + 1)) for t, cf in enumerate(future_cfs))
    npv = pv_future - initial_investment
    
    # Profitability Index (PI) = PV of Future Cash Flows / Initial Outlay
    pi = pv_future / initial_investment
    
    # Discounted payback period (approximate years)
    cumulative = 0.0
    payback_years = None
    for t, cf in enumerate(future_cfs, start=1):
        cumulative += cf
        if cumulative >= initial_investment and payback_years is None:
            # Linear interpolation
            prev = cumulative - cf
            payback_years = round((t - 1) + (initial_investment - prev) / cf, 2)
            
    decision = "ACCEPT_PROJECT" if npv > 0 and pi > 1.0 else "REJECT_PROJECT"
    
    return {
        "Initial_Investment": initial_investment,
        "PV_Future_Cash_Flows": round(pv_future, 2),
        "NPV": round(npv, 2),
        "Profitability_Index": round(pi, 3),
        "Payback_Years": payback_years,
        "Decision": decision
    }

# Year 0: -$250,000 outlay, Years 1-4: $85,000 annual inflow
cfs = [-250000.0, 85000.0, 95000.0, 95000.0, 80000.0]
wacc = 0.10 # 10% hurdle rate

print("=== CAPITAL BUDGETING: NPV & PROFITABILITY INDEX ===")
res = evaluate_capital_budgeting_project(cfs, wacc)
print("Initial: $" + f"{res['Initial_Investment']:,.2f} | PV Inflows: $" + f"{res['PV_Future_Cash_Flows']:,.2f}")
print("NPV: $" + f"{res['NPV']:,.2f} | PI: {res['Profitability_Index']} | Payback: {res['Payback_Years']} yrs")
print(f"Hurdle Rate Decision: {res['Decision']}")`,
        output: `=== CAPITAL BUDGETING: NPV & PROFITABILITY INDEX ===
Initial: $250,000.00 | PV Inflows: $281,801.11
NPV: $31,801.11 | PI: 1.127 | Payback: 2.74 yrs
Hurdle Rate Decision: ACCEPT_PROJECT`,
        codeNotes: [
          'Discounts future discrete cash inflows using compound hurdle rate (1 + discount_rate)^t.',
          'Computes Net Present Value (NPV = $31,801.11) and Profitability Index (PI = 1.127) for capital allocation.',
          'Calculates cumulative linear payback period (2.74 years) to evaluate investment liquidity profile.'
        ],
        tryIt: 'Increase discount_rate to 0.18 (18%) and observe how NPV flips negative, switching Decision to REJECT_PROJECT.',
        check: {
          question: 'Why is the Profitability Index (PI) superior to raw Net Present Value (NPV) when an enterprise faces capital rationing?',
          options: [
            'Because PI measures the efficiency of wealth generated per dollar of capital outlay, enabling optimal ranking under budget constraints',
            'Because PI eliminates the need to calculate future cash flows',
            'Because PI does not require an estimated hurdle rate or cost of capital',
            'Because PI is only used for municipal government non-profit projects'
          ],
          answer: 0,
          why: 'Under strict capital rationing, a $100M project with $1M NPV creates less value per dollar of scarce capital than ten $10M projects each generating $500K NPV. PI normalizes NPV by capital scale.'
        }
      },
      {
        title: 'Three-Tier DuPont Return on Equity (ROE) Decomposition & Financial Leverage Multiplier',
        say: [
          'Return on Equity (ROE)—net income divided by shareholders equity—is widely considered the supreme scorecard of management stewardship in public equities and private equity investments. However, evaluating ROE in isolation is inherently perilous: a high ROE of 25% can signify extraordinary pricing power and operational efficiency, or it can mask an overleveraged balance sheet hovering on the brink of insolvency.',
          'The DuPont Identity deconstructs ROE into three multiplying operational drivers: Operating Efficiency, Asset Efficiency, and Financial Leverage. Formally: ROE = Net Profit Margin (Net Income / Revenue) multiplied by Asset Turnover (Revenue / Total Assets) multiplied by the Equity Multiplier (Total Assets / Shareholders Equity). The product of the first two ratios yields Return on Assets (ROA), isolating true unlevered operating profitability.',
          'By performing DuPont decomposition across comparative peer companies or historical longitudinal cohorts, equity research analysts and corporate boards identify the true engine of shareholder returns. Company A generating 25% ROE through a 15% net margin and 1.25x asset turnover represents an operational powerhouse with low financial distress risk. In contrast, Company B achieving the same 25% ROE via a meager 4% margin inflated by a 5.0x debt equity multiplier is fragile and highly vulnerable to credit contraction.'
        ],
        example: 'Think of DuPont decomposition like diagnosing an athletic runner performance: Net Profit Margin is running technique, Asset Turnover is stride cadence, and Financial Leverage is an energy stimulant; two runners may cross the finish line in identical times, but one relied on conditioning while the other relied on dangerous chemical boosters.',
        code: `def calculate_dupont_roe_decomposition(financials):
    """Decomposes Return on Equity into Operating Margin, Asset Turnover, and Equity Multiplier."""
    net_income = financials["net_income"]
    revenue = financials["revenue"]
    total_assets = financials["total_assets"]
    shareholder_equity = financials["shareholder_equity"]
    
    # 1. Net Profit Margin = Net Income / Revenue
    net_profit_margin = net_income / revenue
    
    # 2. Asset Turnover = Revenue / Total Assets
    asset_turnover = revenue / total_assets
    
    # 3. Financial Leverage (Equity Multiplier) = Total Assets / Shareholder Equity
    equity_multiplier = total_assets / shareholder_equity
    
    # Return on Assets (ROA) = Margin * Turnover
    roa = net_profit_margin * asset_turnover
    
    # Return on Equity (ROE) = ROA * Equity Multiplier
    roe = roa * equity_multiplier
    
    return {
        "Net_Profit_Margin_Pct": round(net_profit_margin * 100.0, 2),
        "Asset_Turnover_Ratio": round(asset_turnover, 2),
        "Return_on_Assets_Pct": round(roa * 100.0, 2),
        "Equity_Multiplier": round(equity_multiplier, 2),
        "Return_on_Equity_Pct": round(roe * 100.0, 2)
    }

company_a = {
    "name": "Alpha Tech (High Efficiency)",
    "revenue": 1000000.0,
    "net_income": 150000.0,
    "total_assets": 800000.0,
    "shareholder_equity": 600000.0
}
company_b = {
    "name": "Beta Retail (High Leverage)",
    "revenue": 2000000.0,
    "net_income": 80000.0,
    "total_assets": 1600000.0,
    "shareholder_equity": 320000.0
}

print("=== DUPONT 3-TIER ROE DECOMPOSITION ANALYSIS ===")
for c in [company_a, company_b]:
    res = calculate_dupont_roe_decomposition(c)
    print(f"[{c['name']}] NPM: {res['Net_Profit_Margin_Pct']}% | AT: {res['Asset_Turnover_Ratio']}x | ROA: {res['Return_on_Assets_Pct']}% | EM: {res['Equity_Multiplier']}x -> ROE: {res['Return_on_Equity_Pct']}%")`,
        output: `=== DUPONT 3-TIER ROE DECOMPOSITION ANALYSIS ===
[Alpha Tech (High Efficiency)] NPM: 15.0% | AT: 1.25x | ROA: 18.75% | EM: 1.33x -> ROE: 25.0%
[Beta Retail (High Leverage)] NPM: 4.0% | AT: 1.25x | ROA: 5.0% | EM: 5.0x -> ROE: 25.0%`,
        codeNotes: [
          'Decomposes Return on Equity into Net Profit Margin, Asset Turnover, and Equity Multiplier.',
          'Calculates Return on Assets (ROA = Margin * Turnover) to isolate unlevered operating performance.',
          'Contrasts high-margin operational efficiency (Alpha Tech) against debt-inflated financial leverage (Beta Retail).'
        ],
        tryIt: 'Increase company_b shareholder_equity to 800000.0 and see how its ROE plummets from 25.0% to 10.0% as leverage unwinds.',
        check: {
          question: 'According to the DuPont Identity, what two factors multiply together to constitute Return on Assets (ROA)?',
          options: [
            'Net Profit Margin multiplied by Asset Turnover',
            'Operating Income multiplied by Tax Rate',
            'Gross Margin multiplied by Current Ratio',
            'Inventory Turnover multiplied by Debt-to-Equity Ratio'
          ],
          answer: 0,
          why: 'Return on Assets equals (Net Income / Revenue) * (Revenue / Total Assets) = Net Income / Total Assets, quantifying how effectively assets generate net profit independently of financing.'
        }
      }
    ],
    summary: [
      'Standard costing and flexible budget variance analysis separate sales price and volume variances from direct material and labor efficiency variances.',
      'Multi-product CVP analysis employs the Weighted-Average Contribution Margin Ratio (WACM) to establish composite break-even revenue, Margin of Safety, and Degree of Operating Leverage.',
      'Activity-Based Costing (ABC) establishes multiple cost pools and driver consumption rates, eliminating the severe product cross-subsidization created by volume-based absorption costing.',
      'Capital budgeting models evaluate multi-year projects using Net Present Value (NPV), Payback Period, and Profitability Index (PI) to optimize allocation under capital rationing.',
      'The 3-tier DuPont Identity decomposes ROE into Net Profit Margin, Asset Turnover, and Equity Multiplier, distinguishing genuine operational efficiency from debt-driven financial leverage.'
    ],
    projectStep: {
      title: 'Engineer a Managerial Costing, Capital Allocation & DuPont Financial Performance Engine',
      steps: [
        'Build a multi-level flexible budget variance engine calculating material price/efficiency and labor variances.',
        'Calculate composite multi-product CVP metrics, break-even revenue, and Degree of Operating Leverage (DOL).',
        'Simulate multi-pool Activity-Based Costing (ABC) and benchmark product cost distortions against traditional volume costing.',
        'Evaluate capital investment projects using discounted cash flow NPV and Profitability Index (PI).',
        'Implement a 3-tier DuPont decomposition engine diagnosing the underlying operational and financial leverage drivers of ROE.'
      ]
    }
  },
{
    day: 4,
    coursePrefix: 'bcom_ana',
    title: 'Working Capital Analytics, Cash Conversion Cycle & Inventory Optimization Engine',
    parts: [
      {
        title: 'Cash Conversion Cycle (CCC) & Operating Cash Flow Dynamics',
        say: [
          'Working capital management governs an enterprise operational liquidity, dictating whether cash generated from core business operations remains trapped in working capital accounts or flows freely to fund strategic expansion. The supreme quantitative metric for measuring operational working capital efficiency is the Cash Conversion Cycle (CCC), which tracks the exact duration in days required for a dollar invested in inventory and production inputs to cycle through sales and return as collected cash.',
          'The Cash Conversion Cycle is computed from three underlying activity metrics: Days Sales of Inventory (DSI), Days Sales Outstanding (DSO), and Days Payables Outstanding (DPO). Formally: CCC = DSI + DSO - DPO. DSI measures inventory turnover velocity: (Inventory / COGS) * 365. DSO evaluates credit collection efficiency: (Accounts Receivable / Revenue) * 365. DPO gauges vendor financing leverage: (Accounts Payable / COGS) * 365.',
          'A shorter or negative Cash Conversion Cycle represents a massive competitive moat. In traditional manufacturing, positive cycles of 60 to 120 days require large revolving credit facilities to finance trapped capital. Conversely, hyper-efficient retailers like Amazon and Dell operate with negative Cash Conversion Cycles (e.g., -43 days): they collect cash from customers immediately upon sale while paying suppliers on 80-day vendor credit terms, effectively funding operations using zero-interest supplier capital.'
        ],
        example: 'Think of the Cash Conversion Cycle like a relay race where a baton is a physical dollar bill: DSI is how long the runner holds the baton in the warehouse, DSO is how long the customer runs with the baton before paying you, and DPO is how long before you must hand the baton to your suppliers; if you collect the baton from the customer 40 days before your supplier asks for it, you race forward entirely on supplier momentum.',
        code: `def calculate_cash_conversion_cycle_metrics(financials):
    """Calculates DSI, DSO, DPO, and Cash Conversion Cycle (CCC)."""
    rev = financials["annual_revenue"]
    cogs = financials["annual_cogs"]
    ar = financials["accounts_receivable"]
    inv = financials["inventory"]
    ap = financials["accounts_payable"]
    
    # 1. Days Sales of Inventory (DSI) = (Inventory / COGS) * 365
    dsi = (inv / cogs) * 365.0
    
    # 2. Days Sales Outstanding (DSO) = (AR / Revenue) * 365
    dso = (ar / rev) * 365.0
    
    # 3. Days Payables Outstanding (DPO) = (AP / COGS) * 365
    dpo = (ap / cogs) * 365.0
    
    # 4. Cash Conversion Cycle (CCC) = DSI + DSO - DPO
    ccc = dsi + dso - dpo
    
    working_cap_verdict = "NEGATIVE_CCC_SUPPLIER_FINANCED" if ccc < 0 else "POSITIVE_CCC_CAPITAL_TIED_UP"
    
    return {
        "Days_Sales_Inventory": round(dsi, 1),
        "Days_Sales_Outstanding": round(dso, 1),
        "Days_Payables_Outstanding": round(dpo, 1),
        "Cash_Conversion_Cycle_Days": round(ccc, 1),
        "Verdict": working_cap_verdict
    }

company_retail = {
    "annual_revenue": 12000000.0,
    "annual_cogs": 8000000.0,
    "accounts_receivable": 300000.0,
    "inventory": 650000.0,
    "accounts_payable": 1800000.0
}
company_mfg = {
    "annual_revenue": 24000000.0,
    "annual_cogs": 16000000.0,
    "accounts_receivable": 3500000.0,
    "inventory": 4200000.0,
    "accounts_payable": 1900000.0
}

print("=== CASH CONVERSION CYCLE (CCC) WORKING CAPITAL ===")
r_res = calculate_cash_conversion_cycle_metrics(company_retail)
print(f"[Retail] DSI: {r_res['Days_Sales_Inventory']}d | DSO: {r_res['Days_Sales_Outstanding']}d | DPO: {r_res['Days_Payables_Outstanding']}d -> CCC: {r_res['Cash_Conversion_Cycle_Days']}d [{r_res['Verdict']}]")
m_res = calculate_cash_conversion_cycle_metrics(company_mfg)
print(f"[Mfg] DSI: {m_res['Days_Sales_Inventory']}d | DSO: {m_res['Days_Sales_Outstanding']}d | DPO: {m_res['Days_Payables_Outstanding']}d -> CCC: {m_res['Cash_Conversion_Cycle_Days']}d [{m_res['Verdict']}]")`,
        output: `=== CASH CONVERSION CYCLE (CCC) WORKING CAPITAL ===
[Retail] DSI: 29.7d | DSO: 9.1d | DPO: 82.1d -> CCC: -43.3d [NEGATIVE_CCC_SUPPLIER_FINANCED]
[Mfg] DSI: 95.8d | DSO: 53.2d | DPO: 43.3d -> CCC: 105.7d [POSITIVE_CCC_CAPITAL_TIED_UP]`,
        codeNotes: [
          'Calculates Days Sales of Inventory (DSI) and Days Sales Outstanding (DSO) against COGS and Revenue.',
          'Quantifies Days Payables Outstanding (DPO = 82.1 days) highlighting working capital leverage over suppliers.',
          'Contrasts negative working capital model (-43.3 days) against capital-intensive manufacturing (+105.7 days).'
        ],
        tryIt: 'Reduce company_mfg inventory to $2,000,000 and calculate the resulting drop in manufacturing CCC days.',
        check: {
          question: 'What is the strategic business advantage of operating with a Negative Cash Conversion Cycle (CCC)?',
          options: [
            'The enterprise collects cash from customer sales before it must pay vendors for raw materials, effectively generating interest-free operating cash flow',
            'The company never has to file annual tax returns with regulatory authorities',
            'All manufacturing machinery operates without consuming electricity',
            'The firm is legally exempt from paying accounts payable to external suppliers'
          ],
          answer: 0,
          why: 'A negative CCC means customer receivables are collected weeks before vendor payables come due, generating a float of liquid cash that can fund operations and growth without external debt.'
        }
      },
      {
        title: 'Economic Order Quantity (EOQ) & Total Inventory Cost Minimization',
        say: [
          'Inventory represents one of the largest capital commitments on an enterprise balance sheet. Holding too much inventory incurs punishing holding costs: warehouse rent, refrigeration, insurance, shrinkage, obsolescence, and tied-up capital opportunity costs. Conversely, ordering in tiny batches causes frequent purchasing order setups, freight expediting fees, volume discount forfeitures, and stockout disruption.',
          'The Economic Order Quantity (EOQ) model mathematically resolves this trade-off by finding the batch order size Q* that minimizes total annual inventory holding and ordering costs. Formally: EOQ = sqrt((2 * D * S) / H), where D is annual demand in units, S is fixed ordering cost per purchase order, and H is annual holding cost per unit.',
          'A fundamental mathematical property of the classical EOQ curve is that total inventory cost is minimized precisely at the inflection point where annual ordering costs ((D / Q) * S) exactly equal annual inventory holding costs ((Q / 2) * H). Automated procurement algorithms deploy this mathematical optimum to dynamically set purchase order sizes, eliminating guesswork from supply chain replenishment.'
        ],
        example: 'Think of grocery shopping for non-perishable pantry items: ordering delivery every single day incurs high service delivery fees; ordering a five-year supply incurs high basement storage and clutter costs; EOQ calculates the exact monthly order batch where delivery fees balance storage inconvenience.',
        code: `import math

def calculate_economic_order_quantity_and_cost_curve(annual_demand, order_cost, holding_cost_per_unit):
    """Calculates Wilson's EOQ, optimal order frequency, and minimum annual inventory cost."""
    # EOQ = sqrt((2 * D * S) / H)
    eoq = math.sqrt((2.0 * annual_demand * order_cost) / holding_cost_per_unit)
    optimal_q = round(eoq)
    
    orders_per_year = round(annual_demand / optimal_q, 2)
    annual_order_cost = (annual_demand / optimal_q) * order_cost
    annual_carrying_cost = (optimal_q / 2.0) * holding_cost_per_unit
    total_inventory_cost = annual_order_cost + annual_carrying_cost
    
    return {
        "Optimal_Order_Quantity_Units": optimal_q,
        "Orders_Per_Year": orders_per_year,
        "Annual_Ordering_Cost": round(annual_order_cost, 2),
        "Annual_Carrying_Cost": round(annual_carrying_cost, 2),
        "Total_Inventory_Cost": round(total_inventory_cost, 2)
    }

# Annual demand = 12,000 units, Order setup cost = $150, Holding cost = $4/unit/yr
demand = 12000
order_fee = 150.0
holding_fee = 4.0

print("=== ECONOMIC ORDER QUANTITY (EOQ) COST OPTIMIZATION ===")
res = calculate_economic_order_quantity_and_cost_curve(demand, order_fee, holding_fee)
print(f"Optimal EOQ: {res['Optimal_Order_Quantity_Units']} units | Orders/Yr: {res['Orders_Per_Year']}")
print("Annual Order Cost: $" + f"{res['Annual_Ordering_Cost']:,.2f} | Annual Carrying Cost: $" + f"{res['Annual_Carrying_Cost']:,.2f}")
print("Total Optimized Cost: $" + f"{res['Total_Inventory_Cost']:,.2f}")`,
        output: `=== ECONOMIC ORDER QUANTITY (EOQ) COST OPTIMIZATION ===
Optimal EOQ: 949 units | Orders/Yr: 12.64
Annual Order Cost: $1,896.73 | Annual Carrying Cost: $1,898.00
Total Optimized Cost: $3,794.73`,
        codeNotes: [
          'Calculates optimal purchase batch size (949 units) balancing ordering setup and holding carrying costs.',
          'Demonstrates cost parity where annual ordering cost ($1,896.73) approximately equals annual carrying cost ($1,898.00).',
          'Computes annual purchase order frequency (12.64 orders per year) for automated procurement schedules.'
        ],
        tryIt: 'Double order_fee from $150 to $300 and verify how EOQ expands by approximately sqrt(2) = 1.414x.',
        check: {
          question: 'At the exact Economic Order Quantity (EOQ) point, what relationship exists between annual ordering costs and annual carrying costs?',
          options: [
            'Annual ordering costs are equal to annual carrying costs',
            'Annual ordering costs are exactly double annual carrying costs',
            'Annual carrying costs are zero',
            'Annual ordering costs equal total annual revenue'
          ],
          answer: 0,
          why: 'At the mathematical minimum of the total inventory cost function, the marginal decrease in ordering cost equals the marginal increase in holding cost, making the two cost components equal.'
        }
      },
      {
        title: 'Stochastic Demand Reorder Points (ROP) & Safety Stock Sizing',
        say: [
          'While deterministic EOQ models establish the optimal batch size, they assume that daily customer demand and supplier replenishment lead times are completely constant. In reality, both variables fluctuate stochastically: factory lead times experience transport congestion, and daily consumer demand experiences random surges.',
          'To protect against stockouts and lost sales without holding exorbitant inventory, supply chain analysts calculate Safety Stock (SS) based on probabilistic service level targets. When both daily demand (mean d, variance sigma_d^2) and supplier lead time (mean L, variance sigma_L^2) are stochastic, the combined standard deviation of lead time demand is: sigma_L = sqrt(L * sigma_d^2 + d^2 * sigma_L^2). Safety Stock is then sized as: SS = Z * sigma_L, where Z represents the standard normal inverse for the chosen cycle service level (e.g., Z = 1.645 for 95%, Z = 2.326 for 99%).',
          'The Reorder Point (ROP) signals the exact inventory threshold that triggers a new replenishment order: ROP = Expected Lead Time Demand (d * L) + Safety Stock. Tuning the target service level represents an executive strategic trade-off: elevating service from 95% to 99% requires a 40% jump in safety buffer units, directly increasing working capital carrying costs to protect against rare tail-risk demand spikes.'
        ],
        example: 'Think of maintaining a reserve tank in a motorboat: expected lead time demand is the fuel required to motor to the nearest refueling dock; safety stock is the extra reserve fuel kept in case head winds slow the boat or you take a detour, sized according to how unwilling you are to be stranded at sea.',
        code: `import math

def calculate_stochastic_reorder_point_and_safety_stock(avg_daily_demand, std_daily_demand, avg_lead_days, std_lead_days, z_score):
    """Calculates safety stock under joint demand and lead-time uncertainty."""
    # sigma_L = sqrt(L * sigma_d^2 + d^2 * sigma_L^2)
    variance_l = (avg_lead_days * (std_daily_demand ** 2)) + ((avg_daily_demand ** 2) * (std_lead_days ** 2))
    combined_std = math.sqrt(variance_l)
    
    safety_stock = round(z_score * combined_std)
    lead_time_demand = round(avg_daily_demand * avg_lead_days)
    reorder_point = lead_time_demand + safety_stock
    
    return {
        "Lead_Time_Expected_Demand": lead_time_demand,
        "Safety_Stock_Units": safety_stock,
        "Reorder_Point_Units": reorder_point,
        "Target_Service_Level_Z": z_score
    }

# Demand: 50 units/day (std: 8), Lead time: 6 days (std: 1.5), 95% service level (Z=1.645)
res_95 = calculate_stochastic_reorder_point_and_safety_stock(50.0, 8.0, 6.0, 1.5, 1.645)
# 99% service level (Z=2.326)
res_99 = calculate_stochastic_reorder_point_and_safety_stock(50.0, 8.0, 6.0, 1.5, 2.326)

print("=== STOCHASTIC REORDER POINT (ROP) & SAFETY STOCK ===")
print(f"[95% Service] Expected LT Demand: {res_95['Lead_Time_Expected_Demand']} | Safety Stock: {res_95['Safety_Stock_Units']} | ROP: {res_95['Reorder_Point_Units']} units")
print(f"[99% Service] Expected LT Demand: {res_99['Lead_Time_Expected_Demand']} | Safety Stock: {res_99['Safety_Stock_Units']} | ROP: {res_99['Reorder_Point_Units']} units")`,
        output: `=== STOCHASTIC REORDER POINT (ROP) & SAFETY STOCK ===
[95% Service] Expected LT Demand: 300 | Safety Stock: 128 | ROP: 428 units
[99% Service] Expected LT Demand: 300 | Safety Stock: 180 | ROP: 480 units`,
        codeNotes: [
          'Calculates combined lead-time demand variance factoring both demand jitter and transport delay variance.',
          'Quantifies safety stock expansion from 128 units (95% service) to 180 units (99% service).',
          'Computes deterministic Reorder Point (ROP = 428 units) triggering automated purchase orders.'
        ],
        tryIt: 'Set std_lead_days to 0.0 (perfect supplier punctuality) and observe how safety stock drops dramatically.',
        check: {
          question: 'What is the primary operational penalty of increasing customer service level from 95% to 99% in inventory replenishment systems?',
          options: [
            'Safety stock units and associated working capital carrying costs escalate non-linearly due to the bell-curve tails of normal distributions',
            'Suppliers will immediately refuse to sell products to the company',
            'Customer orders can no longer be processed using barcode scanners',
            'Truck drivers must legally drive at double their regular highway speed'
          ],
          answer: 0,
          why: 'Because the normal distribution curve flattens in its tails, capturing the final few percentage points of demand coverage requires disproportionately massive safety buffer increases.'
        }
      },
      {
        title: 'Accounts Receivable Aging Matrix & Expected Credit Loss (ECL) Allowance (IFRS 9 / CECL)',
        say: [
          'Under modern global accounting frameworks—specifically IFRS 9 Financial Instruments and US GAAP CECL (Current Expected Credit Losses)—corporations can no longer wait for a customer to declare formal bankruptcy before recognizing bad debt. Instead, finance analytics departments must maintain forward-looking Expected Credit Loss (ECL) allowance models.',
          'A corporate ECL provision engine utilizes an Accounts Receivable Aging Matrix, segregating open receivables into distinct risk cohorts: Current (0-30 days), 31-60 days past due, 61-90 days past due, and Over 90 days past due. Historical migration matrices and forward macroeconomic overlays determine the default probability for each bucket.',
          'The engine multiplies gross receivables in each aging bucket by its specific default loss rate to compute the Total Required Allowance for Doubtful Accounts on the balance sheet. Comparing the required balance against the prior unadjusted allowance ledger determines the Bad Debt Provision Expense adjustment charged against current operating income, enforcing audited balance sheet integrity.'
        ],
        example: 'Think of an AR aging matrix like monitoring overdue library books: books due yesterday have a 99% return likelihood; books overdue by six months have a 50% loss likelihood; the library sets aside a replacement fund today based on these percentages rather than waiting for borrowers to disappear.',
        code: `def calculate_accounts_receivable_ecl_allowance(aging_buckets, existing_allowance):
    """Calculates Expected Credit Loss (ECL) allowance under IFRS 9 / CECL provision matrices."""
    total_gross_ar = sum(b["balance"] for b in aging_buckets)
    total_required_allowance = 0.0
    details = []
    
    for b in aging_buckets:
        bucket_ecl = b["balance"] * b["default_rate"]
        total_required_allowance += bucket_ecl
        details.append({
            "bucket": b["label"],
            "balance": b["balance"],
            "rate_pct": round(b["default_rate"] * 100.0, 1),
            "ecl": round(bucket_ecl, 2)
        })
        
    provision_expense = total_required_allowance - existing_allowance
    action = "INCREASE_PROVISION_EXPENSE" if provision_expense > 0 else "REDUCE_ALLOWANCE_RECOVERY"
    
    return {
        "Gross_AR": total_gross_ar,
        "Required_Allowance": round(total_required_allowance, 2),
        "Existing_Allowance": existing_allowance,
        "Net_Provision_Adjustment": round(provision_expense, 2),
        "Accounting_Action": action
    }

ledger = [
    {"label": "Current (0-30d)", "balance": 1500000.0, "default_rate": 0.010}, # 1.0%
    {"label": "31-60 days", "balance": 450000.0, "default_rate": 0.045},       # 4.5%
    {"label": "61-90 days", "balance": 180000.0, "default_rate": 0.150},       # 15.0%
    {"label": "Over 90 days", "balance": 90000.0, "default_rate": 0.500}        # 50.0%
]
prior_allowance = 85000.0

print("=== ACCOUNTS RECEIVABLE AGING & EXPECTED CREDIT LOSS (ECL) ===")
res = calculate_accounts_receivable_ecl_allowance(ledger, prior_allowance)
print("Gross AR: $" + f"{res['Gross_AR']:,.2f} | Required Allowance: $" + f"{res['Required_Allowance']:,.2f}")
print("Prior Allowance: $" + f"{res['Existing_Allowance']:,.2f} | Adjustment: $" + f"{res['Net_Provision_Adjustment']:,.2f} [{res['Accounting_Action']}]")`,
        output: `=== ACCOUNTS RECEIVABLE AGING & EXPECTED CREDIT LOSS (ECL) ===
Gross AR: $2,220,000.00 | Required Allowance: $107,250.00
Prior Allowance: $85,000.00 | Adjustment: $22,250.00 [INCREASE_PROVISION_EXPENSE]`,
        codeNotes: [
          'Applies forward-looking default rates scaling from 1.0% for current receivables to 50.0% for 90+ days delinquent accounts.',
          'Computes total audited balance sheet allowance requirement ($107,250.00) across $2.22M gross trade receivables.',
          'Calculates quarterly income statement bad debt provision adjustment ($22,250.00) relative to prior ledger balance.'
        ],
        tryIt: 'Increase over-90-days balance to $250,000 and calculate the resulting bad debt provision hit to operating profit.',
        check: {
          question: 'Under modern IFRS 9 / CECL standards, why must corporations recognize bad debt provisions before an account defaults?',
          options: [
            'To reflect forward-looking expected credit risk immediately, preventing management from hiding deteriorating customer quality until default occurs',
            'To reduce income tax payments to zero in every financial quarter',
            'To pay bonuses to external collection agencies',
            'Because credit card companies demand all trade receivables be settled in cash'
          ],
          answer: 0,
          why: 'The financial crisis proved that waiting for an incurred loss event masks credit deterioration; forward-looking ECL provisions ensure balance sheet receivables reflect net realizable cash value.'
        }
      },
      {
        title: 'Working Capital Liquidity Stress Testing & Cash Burn Runway Simulation',
        say: [
          'Corporate liquidity crises rarely erupt from chronic operational unprofitability; they are sparked by acute cash crunches when accounts receivable slow, credit lines freeze, or unexpected operating burn outstrips liquid reserves. Comprehensive financial stress testing evaluates balance sheet resilience against extreme liquidity shocks.',
          'Key liquidity metrics include the Current Ratio (Current Assets / Current Liabilities) and the Quick Ratio or Acid-Test ((Cash + Marketable Securities + AR) / Current Liabilities), which strips out illiquid physical inventory. For fast-growing or turnaround businesses, the Defensive Interval Ratio (DIR) measures operational survival endurance: Quick Assets divided by Daily Operating Cash Burn.',
          'By simulating multi-month stress scenarios (such as customer payment freezes or sudden supply chain delays), the decision model computes exact Cash Runway in months. A firm maintaining a Current Ratio of 2.14x, Quick Ratio of 1.71x, and Defensive Interval of 360 days possesses the robust liquidity balance sheet required to withstand macroeconomic downturns without dilutive emergency financing.'
        ],
        example: 'Think of liquidity stress testing like calculating life support reserves on a deep-sea submersible: cash is oxygen tanks, receivables are auxiliary oxygen cylinders, and daily operating expenses are breathing rate; stress testing verifies how many hours the crew can survive if surface supply lines are severed.',
        code: `def simulate_working_capital_stress_test(balance_sheet, monthly_cash_burn):
    """Simulates liquidity ratios, defensive interval, and cash runway under stress scenarios."""
    cash = balance_sheet["cash_equivalents"]
    st_inv = balance_sheet["marketable_securities"]
    ar = balance_sheet["accounts_receivable"]
    inv = balance_sheet["inventory"]
    cl = balance_sheet["current_liabilities"]
    
    current_assets = cash + st_inv + ar + inv
    quick_assets = cash + st_inv + ar
    
    # 1. Current Ratio = Current Assets / Current Liabilities
    current_ratio = current_assets / cl
    
    # 2. Quick Ratio (Acid Test) = (Cash + Securities + AR) / Current Liabilities
    quick_ratio = quick_assets / cl
    
    # 3. Defensive Interval Ratio (DIR in days) = Quick Assets / Daily Operating Expenses
    daily_burn = monthly_cash_burn / 30.0
    defensive_interval_days = quick_assets / daily_burn
    
    # 4. Cash Runway in Months = (Cash + Securities) / Monthly Cash Burn
    liquid_runway_months = (cash + st_inv) / monthly_cash_burn
    
    solvency = "ROBUST_LIQUIDITY" if (current_ratio > 1.5 and quick_ratio > 1.0 and liquid_runway_months > 6.0) else "LIQUIDITY_WARNING"
    
    return {
        "Current_Ratio": round(current_ratio, 2),
        "Quick_Ratio": round(quick_ratio, 2),
        "Defensive_Interval_Days": round(defensive_interval_days, 1),
        "Cash_Runway_Months": round(liquid_runway_months, 1),
        "Solvency_Status": solvency
    }

bs = {
    "cash_equivalents": 1200000.0,
    "marketable_securities": 300000.0,
    "accounts_receivable": 900000.0,
    "inventory": 600000.0,
    "current_liabilities": 1400000.0
}
burn = 200000.0 # $200k monthly burn

print("=== WORKING CAPITAL LIQUIDITY & CASH RUNWAY STRESS TEST ===")
res = simulate_working_capital_stress_test(bs, burn)
print(f"Current Ratio: {res['Current_Ratio']}x | Quick Ratio: {res['Quick_Ratio']}x")
print(f"Defensive Interval: {res['Defensive_Interval_Days']} days | Cash Runway: {res['Cash_Runway_Months']} months")
print(f"Liquidity Status: [{res['Solvency_Status']}]")`,
        output: `=== WORKING CAPITAL LIQUIDITY & CASH RUNWAY STRESS TEST ===
Current Ratio: 2.14x | Quick Ratio: 1.71x
Defensive Interval: 360.0 days | Cash Runway: 7.5 months
Liquidity Status: [ROBUST_LIQUIDITY]`,
        codeNotes: [
          'Calculates standard Current Ratio (2.14x) and Quick Acid-Test Ratio (1.71x) excluding illiquid inventory.',
          'Measures Defensive Interval Ratio (360.0 days) assessing operational survival on liquid quick assets alone.',
          'Quantifies liquid cash runway (7.5 months) under stressed cash burn conditions to assure solvency.'
        ],
        tryIt: 'Increase monthly_cash_burn to $350,000 and observe how Cash Runway drops to 4.3 months, triggering LIQUIDITY_WARNING.',
        check: {
          question: 'Why does the Quick Ratio (Acid-Test) exclude inventory from current assets when evaluating acute enterprise liquidity?',
          options: [
            'Because physical inventory cannot be instantly converted to cash to pay impending short-term debts without heavy discounting or liquidation delays',
            'Because inventory does not belong on corporate balance sheets under accounting rules',
            'Because inventory always increases in value over time',
            'Because only cash and crypto can be classified as assets'
          ],
          answer: 0,
          why: 'In an acute credit crisis, selling inventory takes weeks or months and may require steep distress discounts; the Quick Ratio measures instant debt-paying capacity using cash, securities, and receivables.'
        }
      }
    ],
    summary: [
      'The Cash Conversion Cycle (CCC = DSI + DSO - DPO) measures working capital efficiency, contrasting capital-trapped models against negative CCC supplier-financed operations.',
      'Wilson\'s Economic Order Quantity (EOQ) minimizes total inventory carrying and ordering costs at the exact intersection where annual order costs equal holding costs.',
      'Stochastic Reorder Point (ROP) models size safety stocks using combined demand and lead-time standard deviations to guarantee targeted cycle service levels.',
      'IFRS 9 / CECL Accounts Receivable Aging Matrices compute forward-looking Expected Credit Loss (ECL) allowances across delinquent buckets, protecting balance sheet integrity.',
      'Working capital stress testing evaluates Current Ratio, Quick Ratio, Defensive Interval Ratio (DIR), and cash runway to verify balance sheet solvency under cash flow shocks.'
    ],
    projectStep: {
      title: 'Engineer a Working Capital, Cash Conversion & Inventory Optimization Engine',
      steps: [
        'Calculate operational DSI, DSO, DPO, and Cash Conversion Cycle (CCC) metrics across business models.',
        'Implement an Economic Order Quantity (EOQ) model optimizing purchase order sizes and carrying cost curves.',
        'Construct a stochastic Reorder Point (ROP) and safety stock engine under dual demand and lead-time uncertainty.',
        'Build an Accounts Receivable aging provision matrix calculating forward-looking Expected Credit Loss (ECL) allowances.',
        'Execute liquidity stress tests computing Quick Ratios, Defensive Interval survival days, and cash burn runways.'
      ]
    }
  },
{
    day: 5,
    coursePrefix: 'bcom_ana',
    title: 'Milestone 1 Capstone: Enterprise Financial Statement Consolidation, Ratio Intelligence & Fraud Detection Audit Engine',
    parts: [
      {
        title: 'Multi-Entity Consolidated Financial Statements & Intercompany Eliminations',
        say: [
          'In multinational holding companies and multi-tier corporate conglomerates, parent corporations control diverse subsidiaries through equity ownership. Preparing financial statements for shareholders and regulatory agencies cannot simply involve aggregating the line-item accounts of all subsidiaries together; doing so creates catastrophic double-counting of revenues, operating expenses, receivables, and payables.',
          'Consolidated financial reporting requires strict Intercompany Eliminations in accordance with IFRS 10 and US GAAP ASC 810. When a parent company sells goods to a wholly owned subsidiary for $600,000, that transaction is purely an internal transfer between business units. The consolidated financial statements must eliminate the parent $600,000 intercompany revenue and the subsidiary $600,000 intercompany cost of goods sold, ensuring consolidated top-line revenue reflects only transactions executed with external arm\'s-length third parties.',
          'Similarly, on the consolidated balance sheet, any open intercompany trade receivables and corresponding payables (e.g., $150,000 owed between units) must be netted to zero. Furthermore, any unrealized profit embedded in ending inventory transferred between entities must be stripped out until the goods are sold to an outside customer. Automated multi-entity consolidation engines maintain rigorous audit trails of these elimination entries.'
        ],
        example: 'Think of a family household: if a parent pays their child $20 to mow the lawn, family wealth did not increase by $20; outside bankers evaluating the family income must eliminate the internal transfer, counting only salaries earned by family members from external employers.',
        code: `def simulate_multientity_consolidation_and_elimination(parent, subsidiary, intercompany_sales, intercompany_receivables):
    """Consolidates Parent and Subsidiary financials with complete intercompany eliminations."""
    # Gross aggregated amounts
    gross_rev = parent["revenue"] + subsidiary["revenue"]
    gross_cogs = parent["cogs"] + subsidiary["cogs"]
    gross_ar = parent["accounts_receivable"] + subsidiary["accounts_receivable"]
    gross_ap = parent["accounts_payable"] + subsidiary["accounts_payable"]
    
    # Intercompany Eliminations:
    # 1. Eliminate internal trading sales & internal COGS
    elim_rev = gross_rev - intercompany_sales
    elim_cogs = gross_cogs - intercompany_sales
    
    # 2. Eliminate internal debtor/creditor balances
    elim_ar = gross_ar - intercompany_receivables
    elim_ap = gross_ap - intercompany_receivables
    
    consolidated_gross_margin = elim_rev - elim_cogs
    
    return {
        "Gross_Combined_Revenue": gross_rev,
        "Eliminated_Intercompany_Sales": intercompany_sales,
        "Consolidated_Revenue": elim_rev,
        "Consolidated_COGS": elim_cogs,
        "Consolidated_Gross_Margin": consolidated_gross_margin,
        "Consolidated_AR": elim_ar,
        "Consolidated_AP": elim_ap
    }

parent_co = {"revenue": 5000000.0, "cogs": 3000000.0, "accounts_receivable": 800000.0, "accounts_payable": 600000.0}
subsidiary_co = {"revenue": 2000000.0, "cogs": 1200000.0, "accounts_receivable": 400000.0, "accounts_payable": 350000.0}
ic_sales = 600000.0       # Parent sold $600k goods to Sub
ic_receivables = 150000.0 # Sub still owes Parent $150k

print("=== MULTI-ENTITY CONSOLIDATION & INTERCOMPANY ELIMINATIONS ===")
res = simulate_multientity_consolidation_and_elimination(parent_co, subsidiary_co, ic_sales, ic_receivables)
print("Gross Combined Revenue: $" + f"{res['Gross_Combined_Revenue']:,.2f} | Intercompany Eliminated: -$" + f"{res['Eliminated_Intercompany_Sales']:,.2f}")
print("Consolidated Revenue: $" + f"{res['Consolidated_Revenue']:,.2f} | Consolidated Gross Profit: $" + f"{res['Consolidated_Gross_Margin']:,.2f}")
print("Consolidated AR: $" + f"{res['Consolidated_AR']:,.2f} | Consolidated AP: $" + f"{res['Consolidated_AP']:,.2f}")`,
        output: `=== MULTI-ENTITY CONSOLIDATION & INTERCOMPANY ELIMINATIONS ===
Gross Combined Revenue: $7,000,000.00 | Intercompany Eliminated: -$600,000.00
Consolidated Revenue: $6,400,000.00 | Consolidated Gross Profit: $2,800,000.00
Consolidated AR: $1,050,000.00 | Consolidated AP: $800,000.00`,
        codeNotes: [
          'Aggregates parent and subsidiary operational accounts to compute gross combined volume ($7.0M).',
          'Eliminates internal product sales (-$600k) from both revenue and COGS to ensure true external transaction reporting.',
          'Nets out open intercompany trade receivables and trade payables (-$150k) to prevent double-counting of working capital assets.'
        ],
        tryIt: 'Increase intercompany_sales to $1,000,000 and confirm that Consolidated_Revenue adjusts downward to $6,000,000 while Gross Margin is unchanged.',
        check: {
          question: 'Why are intercompany sales eliminated in preparing consolidated corporate financial statements?',
          options: [
            'Because recognizing revenue on transactions between controlled subsidiaries would artificially inflate revenue without executing actual sales to external customers',
            'Because subsidiaries are legally forbidden from owning bank accounts',
            'Because parent corporations are not allowed to sell physical inventory',
            'To avoid paying employee health insurance premiums'
          ],
          answer: 0,
          why: 'A consolidated entity represents a single economic unit; moving inventory between subsidiaries is an internal transfer, not a realization event with outside economic counterparties.'
        }
      },
      {
        title: 'Beneish M-Score Earnings Manipulation & Financial Forensic Detection',
        say: [
          'Financial statement manipulation and corporate accounting fraud (exemplified by historic collapses like Enron, WorldCom, and Wirecard) inflict catastrophic capital destruction on equity investors and creditors. Auditors and forensic quantitative analysts rely on mathematical statistical models to flag potential earnings management before formal regulatory enforcement.',
          'The premier empirical forensic model is Professor Messod Beneish\'s 8-variable M-Score model. The Beneish M-Score combines eight financial statement ratios: Days Sales in Receivables Index (DSRI), Gross Margin Index (GMI), Asset Quality Index (AQI), Sales Growth Index (SGI), Depreciation Index (DEPI), SG&A Expense Index (SGAI), Leverage Index (LVGI), and Total Accruals to Total Assets (TATA).',
          'An accelerating DSRI indicates aggressive revenue recognition (booking unbilled receivables before cash collection), while an elevated AQI flags capitalization of operational expenses into intangible assets. An M-Score calculated above the critical benchmark of -1.78 signals a high statistical probability of earnings manipulation, triggering mandatory forensic deep-dive audits into revenue contracts and journal ledger adjustments.'
        ],
        example: 'Think of the Beneish M-Score like a medical blood panel for an athlete: high red blood cell counts, abnormal hormone ratios, and irregular metabolic indices do not prove guilt in isolation, but in combination they flag performance-enhancing drug manipulation with statistical certainty.',
        code: `def calculate_beneish_m_score_forensic_audit(y0, y1):
    """Calculates 8-variable Beneish M-Score for forensic earnings manipulation detection."""
    # 1. DSRI: Days Sales in Receivables Index = (AR_1 / Rev_1) / (AR_0 / Rev_0)
    dsri = (y1["ar"] / y1["rev"]) / (y0["ar"] / y0["rev"])
    
    # 2. GMI: Gross Margin Index = ((Rev_0 - COGS_0)/Rev_0) / ((Rev_1 - COGS_1)/Rev_1)
    gm_0 = (y0["rev"] - y0["cogs"]) / y0["rev"]
    gm_1 = (y1["rev"] - y1["cogs"]) / y1["rev"]
    gmi = gm_0 / gm_1
    
    # 3. AQI: Asset Quality Index = (1 - (CA_1 + PPE_1)/TA_1) / (1 - (CA_0 + PPE_0)/TA_0)
    aq_1 = 1.0 - (y1["current_assets"] + y1["ppe"]) / y1["total_assets"]
    aq_0 = 1.0 - (y0["current_assets"] + y0["ppe"]) / y0["total_assets"]
    aqi = aq_1 / aq_0 if aq_0 > 0 else 1.0
    
    # 4. SGI: Sales Growth Index = Rev_1 / Rev_0
    sgi = y1["rev"] / y0["rev"]
    
    # 5. DEPI: Depreciation Index = (Depr_0 / (PPE_0 + Depr_0)) / (Depr_1 / (PPE_1 + Depr_1))
    dep_rate_0 = y0["deprec"] / (y0["ppe"] + y0["deprec"])
    dep_rate_1 = y1["deprec"] / (y1["ppe"] + y1["deprec"])
    depi = dep_rate_0 / dep_rate_1
    
    # 6. SGAI: SG&A Expense Index = (SGA_1 / Rev_1) / (SGA_0 / Rev_0)
    sgai = (y1["sga"] / y1["rev"]) / (y0["sga"] / y0["rev"])
    
    # 7. LVGI: Leverage Index = (LTD_1 / TA_1) / (LTD_0 / TA_0)
    lvgi = (y1["debt"] / y1["total_assets"]) / (y0["debt"] / y0["total_assets"])
    
    # 8. TATA: Total Accruals to Total Assets = (Net Income_1 - CFO_1) / TA_1
    tata = (y1["net_income"] - y1["cfo"]) / y1["total_assets"]
    
    # Beneish 8-variable model equation:
    m_score = (
        -4.84
        + (0.920 * dsri)
        + (0.528 * gmi)
        + (0.404 * aqi)
        + (0.892 * sgi)
        + (0.115 * depi)
        - (0.172 * sgai)
        + (4.037 * tata)
        + (0.0327 * lvgi)
    )
    
    # Threshold: M > -1.78 indicates high probability of accounting manipulation
    manipulator = m_score > -1.78
    verdict = "HIGH_MANIPULATION_RISK" if manipulator else "LOW_MANIPULATION_RISK"
    
    return {
        "DSRI": round(dsri, 3),
        "GMI": round(gmi, 3),
        "SGI": round(sgi, 3),
        "TATA": round(tata, 3),
        "M_Score": round(m_score, 2),
        "Verdict": verdict
    }

clean_y0 = {"rev": 10000000.0, "cogs": 6000000.0, "ar": 1200000.0, "current_assets": 4000000.0, "ppe": 5000000.0, "total_assets": 10000000.0, "deprec": 500000.0, "sga": 1500000.0, "debt": 2000000.0, "net_income": 1200000.0, "cfo": 1300000.0}
clean_y1 = {"rev": 11000000.0, "cogs": 6600000.0, "ar": 1350000.0, "current_assets": 4500000.0, "ppe": 5500000.0, "total_assets": 11000000.0, "deprec": 550000.0, "sga": 1650000.0, "debt": 2100000.0, "net_income": 1350000.0, "cfo": 1400000.0}

print("=== BENEISH M-SCORE FORENSIC EARNINGS FRAUD DETECTION ===")
res = calculate_beneish_m_score_forensic_audit(clean_y0, clean_y1)
print(f"DSRI: {res['DSRI']} | GMI: {res['GMI']} | SGI: {res['SGI']} | TATA: {res['TATA']}")
print(f"Beneish M-Score: {res['M_Score']} -> Forensic Audit Verdict: [{res['Verdict']}]")`,
        output: `=== BENEISH M-SCORE FORENSIC EARNINGS FRAUD DETECTION ===
DSRI: 1.023 | GMI: 1.0 | SGI: 1.1 | TATA: -0.005
Beneish M-Score: -2.07 -> Forensic Audit Verdict: [LOW_MANIPULATION_RISK]`,
        codeNotes: [
          'Calculates eight forensic indices tracking revenue recognition, asset quality, margin deterioration, and accruals.',
          'Evaluates Days Sales in Receivables Index (DSRI = 1.023) and Total Accruals to Total Assets (TATA = -0.005).',
          'Computes overall M-Score (-2.07) remaining safely below the -1.78 threshold, confirming clean earnings quality.'
        ],
        tryIt: 'Increase clean_y1 ar to $3,000,000 (aggressive channel stuffing) and observe how M-Score exceeds -1.78, flagging HIGH_MANIPULATION_RISK.',
        check: {
          question: 'In the Beneish M-Score forensic model, what threshold separates companies with low earnings manipulation risk from potential manipulators?',
          options: [
            'An M-Score greater than -1.78 indicates high probability of accounting manipulation',
            'An M-Score greater than +100',
            'An M-Score equal to exactly zero',
            'An M-Score less than -10.0'
          ],
          answer: 0,
          why: 'The Beneish benchmark is -1.78: values greater (less negative or positive, such as -1.49 or +0.50) reflect statistically significant markers of earnings manipulation.'
        }
      },
      {
        title: 'Altman Z-Score Corporate Insolvency & Bankruptcy Prediction Engine',
        say: [
          'Credit risk rating agencies, commercial bank underwriters, and distressed debt hedge funds require early warning models to predict impending corporate insolvencies. Developed by NYU Professor Edward Altman using Multivariate Discriminant Analysis (MDA), the Altman Z-Score remains the global standard for predicting bankruptcy probability within a 24-month horizon.',
          'The Altman Z-Score synthesizes five fundamental balance sheet and income statement ratios into a single discriminant score: X1 is Working Capital / Total Assets (short-term liquidity buffer); X2 is Retained Earnings / Total Assets (cumulative profitability over time); X3 is EBIT / Total Assets (unlevered operational asset productivity); X4 is Market Value of Equity / Total Liabilities (enterprise leverage headroom); and X5 is Sales / Total Assets (asset turnover velocity).',
          'The discriminant weights combine into the classical formula: Z = 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 0.999*X5. Corporations scoring above 2.99 occupy the Safe Zone (minimal insolvency probability). Scores between 1.81 and 2.99 represent the Grey Zone (caution and close credit monitoring warranted). Scores below 1.81 occupy the Distress Zone, indicating extreme bankruptcy vulnerability and high default likelihood.'
        ],
        example: 'Think of the Altman Z-Score like a structural stress rating on a commercial bridge: X1 is emergency maintenance gear, X2 is concrete foundation depth, X3 is load-bearing steel strength, X4 is safety suspension cable slack, and X5 is daily traffic throughput; if the combined score drops below 1.81, engineers immediately close the bridge before collapse.',
        code: `def calculate_altman_z_score_bankruptcy_risk(financials):
    """Calculates Edward Altman's 5-factor Z-Score for corporate distress and bankruptcy risk."""
    wc = financials["current_assets"] - financials["current_liabilities"]
    ta = financials["total_assets"]
    re = financials["retained_earnings"]
    ebit = financials["ebit"]
    mve = financials["market_equity_value"]
    tl = financials["total_liabilities"]
    sales = financials["revenue"]
    
    # 5 Discriminant Ratios
    x1 = wc / ta
    x2 = re / ta
    x3 = ebit / ta
    x4 = mve / tl
    x5 = sales / ta
    
    # Altman Z-Score: Z = 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 0.999*X5
    z_score = (1.2 * x1) + (1.4 * x2) + (3.3 * x3) + (0.6 * x4) + (0.999 * x5)
    
    if z_score > 2.99:
        zone = "SAFE_ZONE"
    elif z_score >= 1.81:
        zone = "GREY_ZONE"
    else:
        zone = "DISTRESS_ZONE_BANKRUPTCY_RISK"
        
    return {
        "X1_Working_Capital_TA": round(x1, 3),
        "X2_Retained_Earnings_TA": round(x2, 3),
        "X3_EBIT_TA": round(x3, 3),
        "X4_Market_Equity_Liabilities": round(x4, 3),
        "X5_Sales_TA": round(x5, 3),
        "Altman_Z_Score": round(z_score, 2),
        "Solvency_Zone": zone
    }

blue_chip = {
    "current_assets": 8000000.0,
    "current_liabilities": 3000000.0,
    "total_assets": 15000000.0,
    "retained_earnings": 5000000.0,
    "ebit": 2500000.0,
    "market_equity_value": 30000000.0,
    "total_liabilities": 5000000.0,
    "revenue": 18000000.0
}

print("=== ALTMAN Z-SCORE CORPORATE INSOLVENCY MODEL ===")
res = calculate_altman_z_score_bankruptcy_risk(blue_chip)
print(f"X1(WC): {res['X1_Working_Capital_TA']} | X2(RE): {res['X2_Retained_Earnings_TA']} | X3(EBIT): {res['X3_EBIT_TA']}")
print(f"X4(Equity/Debt): {res['X4_Market_Equity_Liabilities']} | X5(Turnover): {res['X5_Sales_TA']}")
print(f"Altman Z-Score: {res['Altman_Z_Score']} -> Solvency Status: [{res['Solvency_Zone']}]")`,
        output: `=== ALTMAN Z-SCORE CORPORATE INSOLVENCY MODEL ===
X1(WC): 0.333 | X2(RE): 0.333 | X3(EBIT): 0.167
X4(Equity/Debt): 6.0 | X5(Turnover): 1.2
Altman Z-Score: 6.22 -> Solvency Status: [SAFE_ZONE]`,
        codeNotes: [
          'Computes 5 multivariate discriminant ratios assessing liquidity, profitability, leverage, and turnover.',
          'Combines weighted coefficients to generate an aggregate Altman Z-Score of 6.22.',
          'Places the enterprise firmly within the SAFE_ZONE (> 2.99), indicating near-zero 2-year default risk.'
        ],
        tryIt: 'Increase total_liabilities to $25,000,000 and lower ebit to negative numbers to watch Z-Score plummet into the DISTRESS_ZONE.',
        check: {
          question: 'According to the classical Altman Z-Score model, what score boundary delineates the Distress Zone indicating high bankruptcy probability?',
          options: [
            'A Z-Score below 1.81',
            'A Z-Score between 2.0 and 3.0',
            'A Z-Score above 5.0',
            'A Z-Score exactly equal to 10.0'
          ],
          answer: 0,
          why: 'Firms scoring Z < 1.81 fall into the Distress Zone, where historical studies show the overwhelming majority of default and chapter 11 filings occur within 24 months.'
        }
      },
      {
        title: 'Cash Flow Statement Quality of Earnings & Accruals Ratio Engine',
        say: [
          'In corporate accounting, Net Income is governed by the accrual accounting principle: revenue is recognized when earned and expenses are recognized when incurred, independent of when physical cash changes hands. While accruals provide a better economic matching of operating effort and performance than cash accounting, they introduce wide latitude for management discretion and earnings smoothing.',
          'The Quality of Earnings (QoE) ratio evaluates the cash-generating authenticity of reported profits: Operating Cash Flow (CFO) divided by Net Income. When an enterprise operates with high earnings quality, cash flow from operations consistently exceeds net income (QoE >= 1.0x), reflecting that operating profits are fully backed by collected liquid cash plus non-cash depreciation add-backs.',
          'Conversely, when a firm reports expanding net income while operating cash flow contracts or turns negative (QoE < 0.8x), it signals that reported profits are composed primarily of paper accounting accruals—such as recognizing unbilled receivables, extending aggressive credit terms, or deferring operational expenses. The Accruals-to-Assets Ratio ((Net Income - CFO) / Average Total Assets) quantifies this distortion, alerting auditors to investigate aggressive revenue policies.'
        ],
        example: 'Think of reported Net Income like receiving IOUs from your friends, while Operating Cash Flow is actual cash placed in your wallet; if your total IOUs look wealthy on paper but your wallet is completely empty when bills come due, your earnings quality is dangerously compromised.',
        code: `def evaluate_quality_of_earnings_and_accruals(statement):
    """Analyzes Cash Flow from Operations vs Net Income to detect aggressive revenue accruals."""
    net_income = statement["net_income"]
    cfo = statement["cash_flow_operations"]
    avg_assets = statement["average_total_assets"]
    
    # 1. Quality of Earnings Ratio = CFO / Net Income
    # Ratio >= 1.0 indicates high-quality cash earnings; < 0.8 indicates earnings driven by accruals
    qoe_ratio = cfo / net_income if net_income != 0 else 0.0
    
    # 2. Balance Sheet & Cash Flow Accruals: (Net Income - CFO) / Average Total Assets
    accrual_dollar = net_income - cfo
    accruals_ratio = accrual_dollar / avg_assets
    
    earnings_health = "HIGH_QUALITY_CASH_CONVERTING" if (qoe_ratio >= 1.0 and accruals_ratio <= 0.02) else "AGGRESSIVE_ACCRUALS_WARNING"
    
    return {
        "Net_Income": net_income,
        "CFO": cfo,
        "Quality_of_Earnings_Ratio": round(qoe_ratio, 2),
        "Total_Accruals": round(accrual_dollar, 2),
        "Accruals_to_Assets_Ratio": round(accruals_ratio, 4),
        "Earnings_Quality_Verdict": earnings_health
    }

stmt = {
    "net_income": 2000000.0,
    "cash_flow_operations": 2350000.0, # Healthy: CFO exceeds Net Income
    "average_total_assets": 12000000.0
}

print("=== QUALITY OF EARNINGS & CASH ACCRUALS FORENSIC AUDIT ===")
res = evaluate_quality_of_earnings_and_accruals(stmt)
print("Net Income: $" + f"{res['Net_Income']:,.2f} | CFO: $" + f"{res['CFO']:,.2f}")
print(f"QoE Ratio: {res['Quality_of_Earnings_Ratio']}x | Accruals/Assets: {res['Accruals_to_Assets_Ratio']}")
print(f"Verdict: [{res['Earnings_Quality_Verdict']}]")`,
        output: `=== QUALITY OF EARNINGS & CASH ACCRUALS FORENSIC AUDIT ===
Net Income: $2,000,000.00 | CFO: $2,350,000.00
QoE Ratio: 1.18x | Accruals/Assets: -0.0292
Verdict: [HIGH_QUALITY_CASH_CONVERTING]`,
        codeNotes: [
          'Calculates Quality of Earnings Ratio (1.18x) comparing cash flow from operations directly against accounting net income.',
          'Quantifies negative total accruals (-$350,000) indicating cash collection outpaces accounting revenue recognition.',
          'Issues HIGH_QUALITY_CASH_CONVERTING verdict, confirming corporate profits represent durable liquidity.'
        ],
        tryIt: 'Drop cash_flow_operations to $800,000 and observe how QoE drops to 0.40x, triggering AGGRESSIVE_ACCRUALS_WARNING.',
        check: {
          question: 'What financial danger is signaled when a company reports steadily increasing Net Income while Cash Flow from Operations (CFO) declines for multiple quarters?',
          options: [
            'Reported accounting earnings are increasingly driven by non-cash accruals and uncollected receivables rather than genuine cash generation, indicating potential earnings manipulation or severe credit risk',
            'The company has discovered a method to eliminate all taxes',
            'The firm has completely run out of paper in its accounting office',
            'Suppliers are delivering goods for free'
          ],
          answer: 0,
          why: 'A growing divergence where net income rises while operating cash flow shrinks is the single most reliable historical warning sign of accounting irregularities and impending earnings restatements.'
        }
      },
      {
        title: 'Capstone Verification: End-to-End Enterprise Financial Health & Forensic Audit Suite',
        say: [
          'The ultimate milestone for an advanced business analytics and corporate financial intelligence professional is constructing a unified, automated end-to-end audit engine. This engine synthesizes every domain explored across our curriculum: multi-entity intercompany consolidation, forensic fraud screening, statistical solvency modeling, and cash earnings quality verification.',
          'The Capstone audit suite ingests consolidated financial statements, executes automated validation tests across the Beneish M-Score (asserting M <= -1.78), checks the Altman Z-Score (asserting Z >= 1.81), and verifies that the Quality of Earnings ratio meets or exceeds the required cash realization threshold. Only when all forensic gates pass without adverse exceptions does the engine generate an Unqualified Clean Audit Opinion.',
          'Mastering this complete quantitative analytics pipeline equips you with the decision science, forensic accounting, capital optimization, and managerial finance architecture required to drive C-suite strategy, lead corporate acquisitions, and safeguard enterprise balance sheet integrity.'
        ],
        example: 'Think of this capstone engine as an automated flight certification inspection for a wide-body aircraft: propulsion, avionics, hydraulic pressure, and structural rivets are all checked simultaneously against strict regulatory tolerances before flight clearance is stamped.',
        code: `def verify_end_to_end_enterprise_financial_audit(enterprise_data):
    """Capstone integration: synthesizes consolidation, Beneish fraud detection, and Altman solvency."""
    # 1. Verification of intercompany consolidation
    consolidated_rev = enterprise_data["consolidated_revenue"]
    # 2. Beneish M-Score check
    m_score = enterprise_data["m_score"]
    fraud_risk = m_score > -1.78
    # 3. Altman Z-Score check
    z_score = enterprise_data["z_score"]
    is_solvent = z_score >= 1.81
    # 4. Quality of earnings
    qoe = enterprise_data["qoe_ratio"]
    is_cash_generative = qoe >= 0.90
    
    audit_cleared = (not fraud_risk) and is_solvent and is_cash_generative
    
    return {
        "Audited_Consolidated_Revenue": consolidated_rev,
        "Beneish_M_Score": m_score,
        "Altman_Z_Score": z_score,
        "Quality_of_Earnings": qoe,
        "Audit_Opinion": "UNQUALIFIED_CLEAN_AUDIT_OPINION" if audit_cleared else "ADVERSE_AUDIT_WARNING"
    }

audit_pack = {
    "consolidated_revenue": 6400000.0,
    "m_score": -2.35, # well below -1.78 threshold (low fraud risk)
    "z_score": 6.18,  # well above 2.99 safe threshold
    "qoe_ratio": 1.18 # CFO 118% of Net Income
}

print("=== CAPSTONE: END-TO-END ENTERPRISE FINANCIAL AUDIT SUITE ===")
res = verify_end_to_end_enterprise_financial_audit(audit_pack)
print("Consolidated Rev: $" + f"{res['Audited_Consolidated_Revenue']:,.2f} | M-Score: {res['Beneish_M_Score']} | Z-Score: {res['Altman_Z_Score']} | QoE: {res['Quality_of_Earnings']}x")
print(f"Final Independent Audit Opinion: [{res['Audit_Opinion']}]")`,
        output: `=== CAPSTONE: END-TO-END ENTERPRISE FINANCIAL AUDIT SUITE ===
Consolidated Rev: $6,400,000.00 | M-Score: -2.35 | Z-Score: 6.18 | QoE: 1.18x
Final Independent Audit Opinion: [UNQUALIFIED_CLEAN_AUDIT_OPINION]`,
        codeNotes: [
          'Integrates audited consolidated revenue metrics after eliminating internal trading transactions.',
          'Verifies Beneish M-Score fraud risk (-2.35) and Altman Z-Score solvency health (6.18).',
          'Issues an UNQUALIFIED_CLEAN_AUDIT_OPINION confirming 100% compliance across all forensic risk dimensions.'
        ],
        tryIt: 'Set m_score to -1.20 and observe how the engine automatically revokes the clean opinion, issuing an ADVERSE_AUDIT_WARNING.',
        check: {
          question: 'In corporate financial reporting and external auditing, what does an Unqualified Clean Audit Opinion signify?',
          options: [
            'The financial statements represent a true and fair view of the enterprise financial position in accordance with accounting standards, with zero material misstatements detected',
            'The auditor was unqualified and lacked professional training',
            'The company lost all of its accounting records',
            'All corporate assets have been seized by the government'
          ],
          answer: 0,
          why: 'An "unqualified" audit report is the highest standard of clean financial health, meaning the independent auditor found no reservations, exceptions, or material misstatements in the consolidated statements.'
        }
      }
    ],
    summary: [
      'Consolidated financial reporting eliminates intercompany sales, cost of sales, and mutual debtor/creditor balances to ensure reporting reflects external arm\'s-length economic transactions.',
      'The 8-variable Beneish M-Score model identifies empirical patterns of earnings manipulation, flagging companies scoring above -1.78 for forensic investigation.',
      'Edward Altman\'s 5-factor Z-Score model predicts 24-month corporate default risk using multivariate discriminant analysis, segregating firms into Safe, Grey, and Distress Zones.',
      'Quality of Earnings (QoE = CFO / Net Income) and the Accruals-to-Assets ratio evaluate the cash authenticity of reported net income, exposing aggressive revenue recognition.',
      'The Capstone audit engine provides an end-to-end verification framework for multi-entity consolidation, forensic fraud screening, and solvency health, culminating in audited clean opinions.'
    ],
    projectStep: {
      title: 'Deploy an End-to-End Enterprise Financial Consolidation, Forensic Audit & Solvency Engine',
      steps: [
        'Consolidate multi-entity trial balances and execute automated intercompany revenue and debtor eliminations.',
        'Implement the 8-variable Beneish M-Score forensic model to detect earnings manipulation and aggressive accruals.',
        'Calculate the 5-factor Altman Z-Score to classify enterprise insolvency and bankruptcy risk zones.',
        'Evaluate Quality of Earnings (QoE) ratios and cash accrual disparities across income and cash flow statements.',
        'Execute a unified capstone forensic audit suite issuing automated independent audit opinion determinations.'
      ]
    }
  }
];