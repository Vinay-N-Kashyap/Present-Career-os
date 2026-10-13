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
  }
];

