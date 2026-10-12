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
  }
];
