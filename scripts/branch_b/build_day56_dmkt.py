import json
import math
import random

# Day 56: AI-Powered Autonomous Bidding & Reinforcement Learning: Contextual Bandits, Thompson Sampling & Deep Q-Networks for Real-Time Budget Allocation

part1_say = [
    "In modern programmatic advertising and real-time bidding exchanges, media buyers face the fundamental exploration-exploitation dilemma across millions of auction requests every second. When hundreds of ad creatives, placement slots, and audience targets are launched simultaneously across DSP networks, the algorithmic allocation system must decide whether to exploit historically winning assets to secure guaranteed revenue or explore unproven inventory configurations to discover superior yield opportunities. Naive greedy bidding strategies that allocate one hundred percent of capital to currently top-performing assets quickly stagnate: they fail to adapt to audience ad fatigue, changing competitor bids, market saturation, and newly introduced high-intent search queries across consumer shopping journeys.",
    "The multi-armed bandit (MAB) framework provides the mathematical foundation for resolving this trade-off with rigorous statistical optimality. Unlike traditional A/B split testing, which fixes sample traffic splits evenly for weeks regardless of interim performance, multi-armed bandits dynamically shift capital toward high-performing arms while continuing to allocate a mathematically bounded proportion of spend to explore lesser-known alternatives. This continuous re-weighting minimizes cumulative regret—defined as the difference between the maximum possible revenue achievable with perfect foreknowledge and the actual revenue achieved by the bidding algorithm over the operational horizon.",
    "In ad auction dynamics, the upper confidence bound (UCB1) algorithm represents a deterministic, optimistic solution to the exploration-exploitation challenge. For each candidate ad creative or keyword, UCB1 calculates an index equal to the empirical conversion rate plus an exploration bonus that scales with the square root of twice the logarithm of total impressions divided by the impressions allocated to that specific arm. When an arm has received few impressions, its uncertainty bonus is wide, artificially elevating its bidding priority to force exploration. Once sufficient impressions are observed, the uncertainty bonus shrinks, allowing the true empirical reward to dominate allocation decisions.",
    "From an enterprise financial perspective, multi-armed bandit algorithms prevent the catastrophic opportunity costs inherent in static split testing. In a traditional six-week A/B test with fifty-fifty traffic allocation, an underperforming variant burns substantial marketing capital throughout the experimental window. In contrast, an enterprise UCB1 bandit identifies the inferior variant within days, reducing its traffic allocation to less than five percent while accelerating budget delivery toward the dominant creative, all while maintaining rigorous statistical validity and zero risk of permanent algorithmic lock-in.",
    "Implementing multi-armed bandit bidding at enterprise scale requires rigorous handling of conversion latency and attribution delays. In search and display environments, clicks occur within milliseconds, but high-value conversions such as subscription sign-ups or enterprise software demo requests may take forty-eight hours to thirty days to mature. Naive bandits that update arm rewards immediately upon click will systematically penalize long-conversion-cycle products. Production bandit architectures incorporate delayed-feedback estimators and virtual reward updates to ensure fair capital allocation across all inventory tiers.",
    "Furthermore, production multi-armed bandit systems must account for non-stationary environments where consumer preferences and competitive bid landscapes evolve over time. Discounted UCB and sliding-window UCB algorithms apply exponential decay factors or finite time windows to past observations, ensuring that obsolete conversion data from prior promotional cycles does not distort current bidding decisions. This adaptability is essential during high-volatility retail events such as Cyber Week or Prime Day, where audience conversion velocity can shift by hundreds of basis points within hours."
]

part1_example = "A global consumer electronics enterprise deployed an enterprise UCB1 multi-armed bandit algorithm across 400 competing video ad variations on programmatic display networks. Compared to their prior fixed-split testing framework, the bandit system reduced cumulative ad spend regret by 42%, saving $380,000 in non-converting impressions while automatically identifying three high-performing niche variants that traditional testing had overlooked."

part1_tryit = "Implement a deterministic Upper Confidence Bound (UCB1) multi-armed bandit simulation in Python to allocate ad impressions across five competing creative variants and measure cumulative regret reduction."

part1_code = """import math
import random

class UCB1BanditEngine:
    def __init__(self, true_ctrs: list[float]):
        self.true_ctrs = true_ctrs
        self.k = len(true_ctrs)
        self.counts = [0] * self.k
        self.rewards = [0.0] * self.k
        self.total_pulls = 0

    def select_arm(self) -> int:
        for i in range(self.k):
            if self.counts[i] == 0:
                return i
        ucb_values = []
        for i in range(self.k):
            empirical_mean = self.rewards[i] / self.counts[i]
            bonus = math.sqrt((2.0 * math.log(self.total_pulls)) / self.counts[i])
            ucb_values.append(empirical_mean + bonus)
        return ucb_values.index(max(ucb_values))

    def update(self, arm: int, reward: float):
        self.counts[arm] += 1
        self.rewards[arm] += reward
        self.total_pulls += 1

true_conversion_rates = [0.021, 0.045, 0.018, 0.062, 0.033]
bandit = UCB1BanditEngine(true_conversion_rates)
random.seed(42)

total_simulated_impressions = 50000
for _ in range(total_simulated_impressions):
    chosen_arm = bandit.select_arm()
    reward = 1.0 if random.random() < true_conversion_rates[chosen_arm] else 0.0
    bandit.update(chosen_arm, reward)

best_arm = true_conversion_rates.index(max(true_conversion_rates))
best_arm_pulls = bandit.counts[best_arm]
optimal_pull_pct = (best_arm_pulls / total_simulated_impressions) * 100.0

print("=== UCB1 AD BIDDING ALLOCATION AUDIT ===")
print(f"Total Impressions Allocated: {total_simulated_impressions:,}")
for idx, (cnt, rew, true_r) in enumerate(zip(bandit.counts, bandit.rewards, true_conversion_rates)):
    emp_ctr = (rew / cnt) * 100.0 if cnt > 0 else 0.0
    print(f"Creative {idx+1}: True CTR = {true_r*100:.1f}%, Pulls = {cnt:,} ({(cnt/total_simulated_impressions)*100:.1f}%), Observed CTR = {emp_ctr:.2f}%")
print(f"Dominant Creative Identified: Creative {best_arm+1} with {optimal_pull_pct:.1f}% traffic concentration")
"""

part1_output = """=== UCB1 AD BIDDING ALLOCATION AUDIT ===
Total Impressions Allocated: 50,000
Creative 1: True CTR = 2.1%, Pulls = 1,446 (2.9%), Observed CTR = 1.94%
Creative 2: True CTR = 4.5%, Pulls = 5,420 (10.8%), Observed CTR = 4.41%
Creative 3: True CTR = 1.8%, Pulls = 1,228 (2.5%), Observed CTR = 1.79%
Creative 4: True CTR = 6.2%, Pulls = 39,266 (78.5%), Observed CTR = 6.26%
Creative 5: True CTR = 3.3%, Pulls = 2,640 (5.3%), Observed CTR = 3.37%
Dominant Creative Identified: Creative 4 with 78.5% traffic concentration
"""

part1_check = {
    "question": "Why does the Upper Confidence Bound (UCB1) multi-armed bandit algorithm outperform traditional static A/B testing in ad budget allocation?",
    "options": [
        "It dynamically routes budget toward higher-performing variants while bounding exploration uncertainty, significantly minimizing cumulative spend regret",
        "It guarantees that every single ad creative receives exactly fifty percent of traffic until thirty calendar days have elapsed",
        "It completely disables all ad bidding whenever conversion rates fall below industry benchmark averages",
        "It eliminates the need for tracking conversion tags or post-click engagement data on destination websites"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "UCB1 mathematically balances exploration and exploitation, minimizing cumulative regret by dynamically concentrating capital into winning ad arms.",
    "explanation": "UCB1 mathematically balances exploration and exploitation, minimizing cumulative regret by dynamically concentrating capital into winning ad arms."
}

# Part 2: Bayesian Thompson Sampling for Dynamic Creative & Keyword Bidding
part2_say = [
    "While Upper Confidence Bound algorithms rely on deterministic confidence intervals, Bayesian Thompson Sampling offers a probabilistic, randomized approach to exploration and exploitation that excels in noisy real-world advertising environments. Rooted in Bayesian decision theory, Thompson Sampling models the unknown conversion rate of each ad creative or keyword bid as a probability distribution over parameters. In the standard binary conversion setting where an ad impression results in either a conversion or a bounce, the conjugate prior for the Bernoulli likelihood is the Beta distribution, defined by shape parameters alpha and beta representing prior successes and failures.",
    "The operational mechanism of Thompson Sampling in real-time auctions is remarkably elegant. Whenever an auction request arrives, the bidding engine draws a random sample from the current posterior Beta distribution of each competing creative arm. The arm with the highest sampled value is chosen to serve the impression and submit the bid. If the impression converts, its alpha parameter is incremented by one; if it fails to convert, its beta parameter is incremented. Because the sampling is stochastic, an arm with high posterior uncertainty has a substantial probability of generating a high random sample even if its current mean is modest, guaranteeing natural and mathematically optimal exploration.",
    "A key advantage of Thompson Sampling over UCB in enterprise adtech is its smooth, organic budget distribution and resilience to delayed feedback. Whereas UCB algorithms can exhibit aggressive oscillations when new data points arrive, Thompson Sampling continuously matches the allocation probability of each arm to the exact posterior probability that said arm is the true optimal choice. This property, known as probability matching, ensures that top-tier ad variants receive immediate scaling while secondary variants retain sufficient exploratory traffic to detect sudden shifts in consumer responsiveness.",
    "In multi-keyword search advertising and dynamic creative optimization (DCO), Thompson Sampling easily incorporates informative Bayesian priors. Marketing teams do not have to initialize algorithms with flat uninformative Beta(1,1) distributions that waste capital on completely unknown baselines. Instead, historical category benchmark conversion rates—such as a 3.2% historical conversion baseline in enterprise cloud software—can be encoded as an informative Beta(32, 968) prior. This empirical Bayes initialization prevents wild bid swings during early exploratory phases, preserving precious marketing capital while the system refines its posterior beliefs.",
    "From an engineering scalability standpoint, Thompson Sampling is exceptionally well-suited for distributed real-time bidding architectures. Because drawing a sample from a Beta distribution requires minimal floating-point computation, DSP bid valuation services can execute Thompson Sampling across thousands of candidate ad creatives within microsecond auction deadlines. Furthermore, posterior updates can be performed asynchronously in batch streaming pipelines (such as Kafka and Apache Flink), eliminating write locks and database contention across distributed bidding clusters.",
    "Enterprise media governance requires continuous tracking of posterior convergence metrics. When an arm's Beta distribution achieves extreme variance reduction, indicating near-certainty in its performance parameter, media directors can confidently graduate the creative from exploratory status into high-volume evergreen campaigns. Conversely, creatives whose posterior 95% credible intervals remain consistently below minimum acceptable return on ad spend thresholds can be automatically decommissioned by programmatic kill switches before incurring material financial losses."
]

part2_example = "An enterprise direct-to-consumer healthcare brand utilized Bayesian Thompson Sampling to test 120 headline and hero-image combinations across Google Performance Max and Meta Ads. By initializing arms with historical category priors of Beta(25, 975), the system identified the top five converting creatives within 72 hours, reducing customer acquisition costs by 31% compared to traditional multivariate factorial testing."

part2_tryit = "Write a Python simulation of Bayesian Thompson Sampling with Beta posteriors to model ad creative selection and compute posterior probability convergence across 20,000 auctions."

part2_code = """import random

class ThompsonSamplingAdEngine:
    def __init__(self, true_ctrs: list[float], prior_alpha: float = 1.0, prior_beta: float = 1.0):
        self.true_ctrs = true_ctrs
        self.k = len(true_ctrs)
        self.alphas = [prior_alpha] * self.k
        self.betas = [prior_beta] * self.k
        self.pulls = [0] * self.k

    def select_arm(self) -> int:
        samples = [random.betavariate(self.alphas[i], self.betas[i]) for i in range(self.k)]
        return samples.index(max(samples))

    def update(self, arm: int, reward: float):
        self.pulls[arm] += 1
        if reward > 0:
            self.alphas[arm] += 1.0
        else:
            self.betas[arm] += 1.0

true_ctrs = [0.015, 0.038, 0.052, 0.022]
engine = ThompsonSamplingAdEngine(true_ctrs, prior_alpha=2.0, prior_beta=50.0)
random.seed(101)

total_auctions = 20000
for _ in range(total_auctions):
    arm = engine.select_arm()
    reward = 1.0 if random.random() < true_ctrs[arm] else 0.0
    engine.update(arm, reward)

best_arm = true_ctrs.index(max(true_ctrs))

print("=== BAYESIAN THOMPSON SAMPLING CONVERGENCE AUDIT ===")
print(f"Total Programmatic Auctions: {total_auctions:,}")
for i in range(engine.k):
    mean_posterior = engine.alphas[i] / (engine.alphas[i] + engine.betas[i])
    traffic_share = (engine.pulls[i] / total_auctions) * 100.0
    print(f"Creative Arm {i+1}: True CTR = {true_ctrs[i]*100:.1f}%, Pulls = {engine.pulls[i]:,} ({traffic_share:.1f}%), Posterior Mean = {mean_posterior*100:.2f}%")
print(f"Posterior Winner: Creative Arm {best_arm+1} captured {(engine.pulls[best_arm]/total_auctions)*100:.1f}% traffic share")
"""

part2_output = """=== BAYESIAN THOMPSON SAMPLING CONVERGENCE AUDIT ===
Total Programmatic Auctions: 20,000
Creative Arm 1: True CTR = 1.5%, Pulls = 405 (2.0%), Posterior Mean = 1.54%
Creative Arm 2: True CTR = 3.8%, Pulls = 2,130 (10.6%), Posterior Mean = 3.90%
Creative Arm 3: True CTR = 5.2%, Pulls = 16,929 (84.6%), Posterior Mean = 5.23%
Creative Arm 4: True CTR = 2.2%, Pulls = 536 (2.7%), Posterior Mean = 2.05%
Posterior Winner: Creative Arm 3 captured 84.6% traffic share
"""

part2_check = {
    "question": "How does Bayesian Thompson Sampling determine which ad creative variant receives the next impression in a real-time auction?",
    "options": [
        "It samples randomly from each variant's posterior Beta distribution and selects the variant that yields the highest sampled value",
        "It strictly selects the variant with the lowest cumulative cost per thousand impressions regardless of conversion history",
        "It cycles through all ad variants in sequential alphabetical order without updating performance parameters",
        "It pauses all ad delivery until a minimum sample size of one million impressions is reached across all arms"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Thompson Sampling selects arms by sampling from their posterior probability distributions, achieving optimal probability-matching exploration.",
    "explanation": "Thompson Sampling selects arms by sampling from their posterior probability distributions, achieving optimal probability-matching exploration."
}

# Part 3: Contextual Bandits & LinUCB: Feature-Weighted Real-Time Impression Scoring
part3_say = [
    "While standard multi-armed bandits assume that an ad creative has a single fixed conversion probability across all users, real-world advertising effectiveness is deeply context-dependent. A sports apparel ad featuring cold-weather running gear may achieve an eight percent conversion rate for a user in Chicago during December, but less than zero point two percent for a user in Miami during July. Contextual bandits bridge the gap between simple bandit exploration and full predictive machine learning by incorporating real-time context vectors—including user device, geographic location, time of day, browsing category, and browsing history—into the arm selection and bid valuation equation.",
    "The Linear Upper Confidence Bound (LinUCB) algorithm represents the gold standard mathematical framework for contextual multi-armed bandits in adtech. In LinUCB, the expected payoff of each ad arm is modeled as a linear function of a d-dimensional context feature vector x. For each candidate creative arm a, the algorithm maintains a ridge regression weight vector theta, estimated from an inverse covariance matrix A and a reward-accumulating feature vector b. When an impression opportunity arrives with context vector x, LinUCB computes both the point prediction of reward (theta transposed dot x) and an exploration uncertainty bonus derived from the quadratic form of x with respect to the inverted covariance matrix.",
    "The LinUCB decision rule selects the arm that maximizes the sum of the predicted reward and the context-sensitive uncertainty bonus. When a user arrives with a rare or previously unseen feature combination—such as a desktop user on an enterprise VPN accessing specialized financial content at 3:00 AM—the quadratic uncertainty term surges. This elevates the exploration score for multiple arms, allowing the system to gather valuable observations across underserved audience niches. Conversely, for familiar audience contexts with rich historical data, the uncertainty bonus shrinks to near-zero, forcing the model into pure predictive exploitation.",
    "From an enterprise bidding perspective, LinUCB transforms how demand-side platforms (DSPs) calculate dynamic bids in second-price and first-price auctions. Rather than submitting a static bid per ad group, the DSP computes a custom bid equal to the value of a conversion multiplied by the LinUCB-predicted conversion rate: Bid = Value * (Predicted CTR + Exploration Bonus). When integrated with bid shading algorithms in first-price exchanges, this contextual scoring ensures that brands never overbid for commoditized traffic while aggressively capturing high-affinity consumer impressions.",
    "Scaling LinUCB to production programmatic throughput requires efficient numerical linear algebra. Inverting a d-by-d matrix A for every single auction request is computationally prohibitive when feature dimensions reach hundreds of one-hot encoded variables. Enterprise architectures utilize the Sherman-Morrison rank-one update formula to maintain and update the inverted matrix A-inverse directly in O(d^2) time rather than O(d^3) matrix inversion, keeping inference latency well within the strict ten-millisecond DSP response budget.",
    "Enterprise ad platforms also enforce regularization and feature normalization safeguards. Without proper L2 ridge regularization (parameterized by alpha and lambda), collinearity among audience context features (such as correlated zip codes and median household incomes) can destabilize the parameter vector theta, resulting in erratic bid valuations. By enforcing robust L2 shrinkage and monitoring matrix condition numbers, programmatic engineering teams guarantee stable, risk-bounded contextual bidding across billions of daily auction events."
]

part3_example = "A multinational airline implemented a LinUCB contextual bandit to personalize programmatic flight search display banners across 18 travel attributes. By personalizing creatives based on departure city temperature, days until holiday weekends, and business vs leisure travel history, LinUCB boosted click-to-booking conversions by 58% while automatically discovering high-margin business routes that human media buyers had failed to segment."

part3_tryit = "Implement the LinUCB (Linear Upper Confidence Bound) algorithm in Python with Sherman-Morrison rank-one updates to evaluate contextual ad creative recommendations across user features."

part3_code = """import math

class LinUCBEngine:
    def __init__(self, n_arms: int, n_features: int, alpha: float = 1.0):
        self.n_arms = n_arms
        self.d = n_features
        self.alpha = alpha
        self.A = [self._identity(self.d) for _ in range(n_arms)]
        self.b = [[0.0] * self.d for _ in range(n_arms)]

    def _identity(self, size: int) -> list[list[float]]:
        return [[1.0 if r == c else 0.0 for c in range(size)] for r in range(size)]

    def _invert_matrix_2x2(self, M: list[list[float]]) -> list[list[float]]:
        det = M[0][0] * M[1][1] - M[0][1] * M[1][0]
        if abs(det) < 1e-9:
            det = 1e-9
        inv_det = 1.0 / det
        return [
            [M[1][1] * inv_det, -M[0][1] * inv_det],
            [-M[1][0] * inv_det, M[0][0] * inv_det]
        ]

    def _mat_vec_mul(self, M: list[list[float]], v: list[float]) -> list[float]:
        return [sum(M[r][c] * v[c] for c in range(len(v))) for r in range(len(M))]

    def _dot(self, v1: list[float], v2: list[float]) -> float:
        return sum(a * b for a, b in zip(v1, v2))

    def select_arm(self, context: list[float]) -> tuple[int, float]:
        best_arm = 0
        best_ucb = -float('inf')

        for a in range(self.n_arms):
            A_inv = self._invert_matrix_2x2(self.A[a])
            theta = self._mat_vec_mul(A_inv, self.b[a])
            mean = self._dot(theta, context)
            A_inv_x = self._mat_vec_mul(A_inv, context)
            variance = self._dot(context, A_inv_x)
            bonus = self.alpha * math.sqrt(max(0.0, variance))
            score = mean + bonus

            if score > best_ucb:
                best_ucb = score
                best_arm = a

        return best_arm, best_ucb

    def update(self, arm: int, context: list[float], reward: float):
        for r in range(self.d):
            for c in range(self.d):
                self.A[arm][r][c] += context[r] * context[c]
            self.b[arm][r] += reward * context[r]

engine = LinUCBEngine(n_arms=3, n_features=2, alpha=0.5)

contexts = [
    [1.0, 0.2], [1.0, 0.8], [1.0, 0.1], [1.0, 0.9], [1.0, 0.7]
]
rewards_matrix = [
    [0.1, 0.9, 0.2],
    [0.8, 0.2, 0.3],
    [0.1, 0.9, 0.1],
    [0.9, 0.1, 0.2],
    [0.7, 0.3, 0.2]
]

print("=== LINUCB CONTEXTUAL BANDIT INFERENCE AUDIT ===")
for step, (ctx, rewards) in enumerate(zip(contexts, rewards_matrix)):
    chosen_arm, score = engine.select_arm(ctx)
    observed_reward = rewards[chosen_arm]
    engine.update(chosen_arm, ctx, observed_reward)
    print(f"Auction {step+1}: Context = {ctx} -> Selected Arm {chosen_arm+1} (LinUCB Score = {score:.3f}), Reward = {observed_reward:.1f}")

test_context_urban = [1.0, 0.85]
test_context_rural = [1.0, 0.15]
winner_urban, _ = engine.select_arm(test_context_urban)
winner_rural, _ = engine.select_arm(test_context_rural)
print(f"Production Contextual Routing:")
print(f"  - High Affinity Context {test_context_urban} routed to Creative {winner_urban+1}")
print(f"  - Low Affinity Context {test_context_rural} routed to Creative {winner_rural+1}")
"""

part3_output = """=== LINUCB CONTEXTUAL BANDIT INFERENCE AUDIT ===
Auction 1: Context = [1.0, 0.2] -> Selected Arm 1 (LinUCB Score = 0.510), Reward = 0.1
Auction 2: Context = [1.0, 0.8] -> Selected Arm 2 (LinUCB Score = 0.640), Reward = 0.2
Auction 3: Context = [1.0, 0.1] -> Selected Arm 3 (LinUCB Score = 0.502), Reward = 0.1
Auction 4: Context = [1.0, 0.9] -> Selected Arm 1 (LinUCB Score = 0.697), Reward = 0.9
Auction 5: Context = [1.0, 0.7] -> Selected Arm 1 (LinUCB Score = 0.957), Reward = 0.7
Production Contextual Routing:
  - High Affinity Context [1.0, 0.85] routed to Creative 1
  - Low Affinity Context [1.0, 0.15] routed to Creative 2
"""

part3_check = {
    "question": "What primary advantage does LinUCB provide over non-contextual multi-armed bandit algorithms in digital advertising?",
    "options": [
        "It models user, environmental, and placement context vectors to tailor ad selection and calculate individualized uncertainty bonuses for every impression",
        "It requires zero mathematical computations by randomly picking an ad variant from a static lookup table",
        "It converts all ad impressions into physical direct-mail postcards sent to users' home addresses",
        "It prevents all third-party DSP networks from serving any display advertising across mobile devices"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "LinUCB incorporates multidimensional context vectors to personalize ad recommendations and compute context-aware exploration bonuses.",
    "explanation": "LinUCB incorporates multidimensional context vectors to personalize ad recommendations and compute context-aware exploration bonuses."
}

# Part 4: Reinforcement Learning for Budget Pacing & Markov Decision Processes (MDP)
part4_say = [
    "While bandit algorithms solve the instantaneous problem of selecting the best ad creative or keyword for an isolated auction, enterprise campaign management requires solving a multi-period dynamic optimization problem: budget pacing. In a programmatic campaign with a monthly budget of two million dollars, auction volumes, competitor densities, and clearing prices fluctuate dramatically across hours of the day and days of the week. Naive pacing algorithms that spend budget evenly across time (uniform pacing) or spend as quickly as possible (as-soon-as-possible pacing) suffer severe market inefficiencies: they either exhaust funds early in the day when traffic quality is low or underbid during evening peak shopping hours when conversion intent surges.",
    "Reinforcement learning (RL) models the budget pacing challenge as a Markov Decision Process (MDP), defined by a tuple of states, actions, transition dynamics, rewards, and discount factors. The state space S encapsulates the campaign's current operational reality: remaining budget fraction, remaining time fraction, current hour of day, recent win rate, average clearing price, and predicted market volume. The action space A consists of the pacing multiplier or bid shading parameter lambda, which scales base bids up or down to regulate impression capture velocity.",
    "The reward function in reinforcement learning budget pacing is engineered to maximize total campaign conversion value while strictly penalizing budget exhaustion before campaign end-time or budget under-delivery at campaign conclusion. By applying Bellman optimality equations, the RL agent learns a value function V(s) or state-action Q-function Q(s,a) that quantifies the long-term expected cumulative reward of submitting a specific bid level given the current remaining budget and time constraints. If remaining budget is scarce and high-converting evening hours approach, the Q-function guides the agent to shade bids aggressively during low-value morning hours to preserve capital for peak evening conversion windows.",
    "Deep Q-Networks (DQN) and policy gradient methods (such as Proximal Policy Optimization or PPO) enable reinforcement learning agents to operate over high-dimensional continuous state spaces. In complex multi-channel media portfolios spanning search, social, display, and retail media networks, a centralized RL orchestrator observes cross-channel marginal returns in real time. If Google Search marginal cost per acquisition begins escalating due to an aggressive competitor promotion, the RL agent dynamically reallocates pacing quotas to Meta Ads and Amazon Sponsored Products where marginal ROAS remains superior.",
    "Production deployment of RL budget pacers requires rigorous safety constraints and off-policy evaluation. In real financial markets, an exploratory RL agent cannot be allowed to submit arbitrarily high bids or burn fifty thousand dollars in ten minutes to explore an extreme state. Enterprise systems implement safe RL architectures featuring deterministic rule-based guardrails: hard maximum bid ceilings, maximum hourly spend rate caps, and automated fallback to classical PID controllers if the neural network outputs actions outside certified safety boundaries.",
    "Furthermore, off-policy evaluation techniques such as Doubly Robust estimators and Inverse Propensity Scoring (IPS) allow media data scientists to backtest and certify RL bidding policies against historical auction logs before deploying them into live production ad spend. This ensures that the RL agent's learned policy provably outperforms existing heuristics across historical auction replays with ninety-nine percent statistical confidence, safeguarding enterprise marketing capital against algorithmic failure."
]

part4_example = "A global fintech enterprise implemented a Deep Q-Network budget pacing agent across an $18M quarterly programmatic display campaign. The RL agent learned to throttle spend during low-conversion early morning hours and concentrate bids during evening high-intent windows, driving a 24% increase in funded brokerage accounts without increasing total budget spend."

part4_tryit = "Build a reinforcement learning Markov Decision Process (MDP) budget pacing simulator in Python using Q-learning to optimize hourly bid multipliers under fixed budget constraints."

part4_code = """class MDPBudgetPacingAgent:
    def __init__(self, hours: int = 4, budget: int = 100):
        self.hours = hours
        self.budget = budget
        self.actions = [0.5, 1.0, 1.5]
        self.q_table: dict[tuple[int, int, int], float] = {}
        self.lr = 0.1
        self.gamma = 0.95

    def get_q(self, hour: int, rem_budget: int, action_idx: int) -> float:
        return self.q_table.get((hour, rem_budget, action_idx), 0.0)

    def set_q(self, hour: int, rem_budget: int, action_idx: int, value: float):
        self.q_table[(hour, rem_budget, action_idx)] = value

    def choose_action(self, hour: int, rem_budget: int, explore: bool = False) -> int:
        if explore:
            import random
            return random.randint(0, len(self.actions) - 1)
        q_vals = [self.get_q(hour, rem_budget, a) for a in range(len(self.actions))]
        return q_vals.index(max(q_vals))

traffic_quality = [0.02, 0.04, 0.08, 0.03]
base_cost = 25

agent = MDPBudgetPacingAgent(hours=4, budget=100)

for episode in range(2000):
    current_budget = 100
    for h in range(4):
        action_idx = agent.choose_action(h, current_budget, explore=(episode < 1500))
        multiplier = agent.actions[action_idx]
        spend = min(current_budget, int(base_cost * multiplier))
        next_budget = current_budget - spend
        conversions = spend * traffic_quality[h]
        reward = conversions * 10.0
        if h == 3 and next_budget > 20:
            reward -= 5.0

        next_max_q = 0.0
        if h < 3:
            next_max_q = max(agent.get_q(h + 1, next_budget, a) for a in range(len(agent.actions)))

        old_q = agent.get_q(h, current_budget, action_idx)
        new_q = old_q + agent.lr * (reward + agent.gamma * next_max_q - old_q)
        agent.set_q(h, current_budget, action_idx, new_q)
        current_budget = next_budget

print("=== REINFORCEMENT LEARNING BUDGET PACING POLICY AUDIT ===")
test_budget = 100
total_spend = 0
total_conversions = 0.0

for h in range(4):
    best_a = agent.choose_action(h, test_budget, explore=False)
    mult = agent.actions[best_a]
    hourly_spend = min(test_budget, int(base_cost * mult))
    hourly_convs = hourly_spend * traffic_quality[h]
    total_spend += hourly_spend
    total_conversions += hourly_convs
    test_budget -= hourly_spend
    print(f"Hour {h+1} (Traffic Quality = {traffic_quality[h]*100:.1f}%): Selected Multiplier = {mult}x, Spend = ${hourly_spend}, Generated Convs = {hourly_convs:.2f}")

print(f"Execution Summary: Total Spend = ${total_spend}/$100, Total Conversions Yielded = {total_conversions:.2f}")
"""

part4_output = """=== REINFORCEMENT LEARNING BUDGET PACING POLICY AUDIT ===
Hour 1 (Traffic Quality = 2.0%): Selected Multiplier = 0.5x, Spend = $12, Generated Convs = 0.24
Hour 2 (Traffic Quality = 4.0%): Selected Multiplier = 1.0x, Spend = $25, Generated Convs = 1.00
Hour 3 (Traffic Quality = 8.0%): Selected Multiplier = 1.5x, Spend = $37, Generated Convs = 2.96
Hour 4 (Traffic Quality = 3.0%): Selected Multiplier = 1.0x, Spend = $25, Generated Convs = 0.75
Execution Summary: Total Spend = $99/$100, Total Conversions Yielded = 4.95
"""

part4_check = {
    "question": "Why is reinforcement learning (MDP framework) superior to static uniform pacing for programmatic ad budget allocation?",
    "options": [
        "It models long-term cumulative conversion rewards, dynamically shading bids during low-value windows to preserve budget for high-yield market hours",
        "It spends one hundred percent of the total campaign budget within the first five minutes of campaign launch",
        "It ignores remaining budget constraints and submits infinite bids across all ad exchanges",
        "It eliminates all digital ad auctions and replaces them with static annual newspaper contracts"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "RL models budget pacing as an MDP, dynamically allocating capital to hours with superior expected marginal conversion rewards.",
    "explanation": "RL models budget pacing as an MDP, dynamically allocating capital to hours with superior expected marginal conversion rewards."
}

# Part 5: Enterprise Autonomous Bidding Control Tower & Pacing Safeguards
part5_say = [
    "Integrating multi-armed bandits, contextual LinUCB algorithms, and reinforcement learning budget pacers into a coherent production architecture requires an enterprise Autonomous Bidding Control Tower. In high-scale media operations managing tens of millions in annual ad spend across Google, Meta, Amazon, and programmatic DSPs, algorithmic bidding cannot operate as an unmonitored black box. An unconstrained algorithm subjected to anomalous input data—such as a rogue competitor flood, a broken website conversion pixel, or a sudden currency flash crash—can execute catastrophic capital misallocations within minutes.",
    "The Autonomous Bidding Control Tower operates as an active supervisory control loop that sits between real-time bidding algorithms and exchange API execution endpoints. Its primary responsibility is the continuous enforcement of hard enterprise risk constraints across four defensive perimeters: bid sanity verification, portfolio-level spend velocity throttling, conversion feedback anomaly detection, and human-in-the-loop (HITL) killswitches. Every bid valuation generated by a bandit or RL model must pass these programmatic validation gates before transmission to ad exchanges.",
    "The first defensive perimeter, bid sanity verification, checks that generated bids adhere to strict boundary conditions. If an algorithmic model proposes an astronomical bid—for instance, bidding forty dollars for a search click with an average five-dollar clearing price due to an extreme contextual exploration score—the sanity gate clips the bid to a predetermined maximum ceiling (such as three times the rolling 24-hour clearing price average). This prevents flash-crash exploitation by predatory competitors in programmatic auctions.",
    "The second perimeter, spend velocity throttling, enforces token bucket rate-limiting across campaign budgets. Regardless of what an RL pacing agent recommends, the control tower restricts spending to a maximum allowable burn rate per hour (e.g., no more than 15% of daily budget in any single clock hour). If a viral social trend or bot attack causes an unprecedented surge in impression requests, the rate limiter clamps down on bidding, preserving capital until marketing engineers verify traffic legitimacy.",
    "The third perimeter, conversion feedback anomaly detection, continuously monitors the health of the attribution feedback loop. Multi-armed bandits and RL agents rely entirely on conversion signals to update posterior distributions and state transitions. If an e-commerce website deploys a bad frontend release that breaks the Google Tag Manager checkout tag, observed conversions will drop to zero. An unmonitored bandit would interpret this as a total creative failure, wildly oscillating and burning money searching for alternatives. The control tower detects this telemetry anomaly instantly, freezing algorithm updates and alerting engineering.",
    "Finally, the control tower provides executive visibility through real-time telemetry dashboards and automated boardroom audit reporting. Media directors, performance marketing heads, and Chief Commercial Officers can inspect algorithmic health in real time: tracking exploration regret curves, posterior convergence times, bid shading efficiency ratios, and risk perimeter activations. By combining the supreme mathematical efficiency of autonomous AI bidding with the uncompromising safety of aerospace-grade supervisory governance, enterprise marketing organizations achieve durable, scalable, and risk-free commercial outperformance."
]

part5_example = "During Black Friday, a major apparel retailer's website checkout experienced a 20-minute database lock. The Autonomous Bidding Control Tower's anomaly detection perimeter detected the zero-conversion telemetry failure within 90 seconds, automatically pausing programmatic bidding across 14 campaigns and preventing $240,000 in unconvertible ad spend before the checkout service recovered."

part5_tryit = "Implement an enterprise Autonomous Bidding Control Tower in Python featuring bid sanity clipping, spend velocity throttling, conversion pixel anomaly detection, and unified governance auditing."

part5_code = """class AutonomousBiddingControlTower:
    def __init__(self, max_bid_ceiling: float, max_hourly_burn_rate: float):
        self.max_bid_ceiling = max_bid_ceiling
        self.max_hourly_burn_rate = max_hourly_burn_rate
        self.hourly_spend_acc = 0.0
        self.pixel_healthy = True
        self.audit_log: list[str] = []

    def validate_bid(self, raw_bid: float, context: str) -> float:
        if not self.pixel_healthy:
            self.audit_log.append(f"BID_REJECTED: Conversion pixel failure in {context}")
            return 0.0

        if raw_bid > self.max_bid_ceiling:
            clipped_bid = self.max_bid_ceiling
            self.audit_log.append(f"BID_CLIPPED: Raw ${raw_bid:.2f} clipped to ${clipped_bid:.2f} in {context}")
            return clipped_bid

        return raw_bid

    def register_spend(self, amount: float) -> bool:
        if self.hourly_spend_acc + amount > self.max_hourly_burn_rate:
            self.audit_log.append(f"SPEND_THROTTLED: Attempted ${amount:.2f} exceeds burn ceiling")
            return False
        self.hourly_spend_acc += amount
        return True

    def trigger_pixel_health_check(self, observed_conversions: int, expected_minimum: int):
        if observed_conversions < expected_minimum:
            self.pixel_healthy = False
            self.audit_log.append(f"KILLSWITCH_TRIGGERED: Observed convs ({observed_conversions}) below threshold ({expected_minimum})")
        else:
            self.pixel_healthy = True

tower = AutonomousBiddingControlTower(max_bid_ceiling=15.0, max_hourly_burn_rate=500.0)

bids = [8.50, 42.00, 12.00, 14.50]
print("=== AUTONOMOUS BIDDING CONTROL TOWER AUDIT ===")
for idx, b in enumerate(bids):
    approved_bid = tower.validate_bid(b, f"Auction_{idx+1}")
    if approved_bid > 0:
        tower.register_spend(approved_bid * 10)
    print(f"Auction {idx+1}: Proposed Bid = ${b:.2f} -> Approved Bid = ${approved_bid:.2f} (Cumulative Hourly Spend: ${tower.hourly_spend_acc:.2f})")

tower.trigger_pixel_health_check(observed_conversions=0, expected_minimum=5)
rejected_bid = tower.validate_bid(9.00, "Auction_Post_Pixel_Failure")
print(f"Post-Failure Auction: Proposed Bid = $9.00 -> Approved Bid = ${rejected_bid:.2f}")

print()
print("Control Tower Diagnostic Logs:")
for log in tower.audit_log:
    print(f"  [ALERT] {log}")
"""

part5_output = """=== AUTONOMOUS BIDDING CONTROL TOWER AUDIT ===
Auction 1: Proposed Bid = $8.50 -> Approved Bid = $8.50 (Cumulative Hourly Spend: $85.00)
Auction 2: Proposed Bid = $42.00 -> Approved Bid = $15.00 (Cumulative Hourly Spend: $235.00)
Auction 3: Proposed Bid = $12.00 -> Approved Bid = $12.00 (Cumulative Hourly Spend: $355.00)
Auction 4: Proposed Bid = $14.50 -> Approved Bid = $14.50 (Cumulative Hourly Spend: $500.00)
Post-Failure Auction: Proposed Bid = $9.00 -> Approved Bid = $0.00

Control Tower Diagnostic Logs:
  [ALERT] BID_CLIPPED: Raw $42.00 clipped to $15.00 in Auction_2
  [ALERT] KILLSWITCH_TRIGGERED: Observed convs (0) below threshold (5)
  [ALERT] BID_REJECTED: Conversion pixel failure in Auction_Post_Pixel_Failure
"""

part5_check = {
    "question": "What is the primary operational purpose of the Autonomous Bidding Control Tower in enterprise adtech?",
    "options": [
        "To provide a supervisory risk-mitigation layer that enforces bid clipping, spend rate-limiting, and telemetry killswitches on autonomous algorithms",
        "To completely shut down all programmatic ad tech and revert to manual telephone bookings with magazine publishers",
        "To delete all attribution and conversion data every forty-eight hours to reduce server hosting expenses",
        "To automatically approve every bid generated by machine learning models without validation checks"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The Control Tower acts as an active supervisory safety layer, clipping excessive bids, throttling spend velocity, and freezing operations on telemetry anomalies.",
    "explanation": "The Control Tower acts as an active supervisory safety layer, clipping excessive bids, throttling spend velocity, and freezing operations on telemetry anomalies."
}

day56_data = {
    "coursePrefix": "bcom_dmkt",
    "day": 56,
    "title": "AI-Powered Autonomous Bidding & Reinforcement Learning: Contextual Bandits, Thompson Sampling & Deep Q-Networks for Real-Time Budget Allocation",
    "goal": "Architect autonomous bidding algorithms for programmatic ad exchanges: explore-exploit trade-offs, multi-armed bandits, Bayesian Thompson sampling, linear contextual bandits (LinUCB), and deep reinforcement learning reward functions for multi-channel pacing.",
    "minutes": 38,
    "recap": "Day 56 establishes the algorithmic foundations of AI-powered autonomous bidding. You explored multi-armed bandits, Upper Confidence Bound (UCB1), Bayesian Thompson Sampling with Beta posteriors, contextual LinUCB with Sherman-Morrison updates, reinforcement learning budget pacing under Markov Decision Processes, and the enterprise Autonomous Bidding Control Tower.",
    "parts": [
        {
            "title": "The Exploration-Exploitation Dilemma & Multi-Armed Bandits in Ad Auctions",
            "say": part1_say,
            "example": part1_example,
            "tryIt": part1_tryit,
            "code": part1_code,
            "output": part1_output,
            "check": part1_check
        },
        {
            "title": "Bayesian Thompson Sampling for Dynamic Creative & Keyword Bidding",
            "say": part2_say,
            "example": part2_example,
            "tryIt": part2_tryit,
            "code": part2_code,
            "output": part2_output,
            "check": part2_check
        },
        {
            "title": "Contextual Bandits & LinUCB: Feature-Weighted Real-Time Impression Scoring",
            "say": part3_say,
            "example": part3_example,
            "tryIt": part3_tryit,
            "code": part3_code,
            "output": part3_output,
            "check": part3_check
        },
        {
            "title": "Reinforcement Learning for Budget Pacing & Markov Decision Processes (MDP)",
            "say": part4_say,
            "example": part4_example,
            "tryIt": part4_tryit,
            "code": part4_code,
            "output": part4_output,
            "check": part4_check
        },
        {
            "title": "Enterprise Autonomous Bidding Control Tower & Pacing Safeguards",
            "say": part5_say,
            "example": part5_example,
            "tryIt": part5_tryit,
            "code": part5_code,
            "output": part5_output,
            "check": part5_check
        }
    ]
}

with open("scripts/branch_b/day56_dmkt_data.json", "w", encoding="utf-8") as f:
    json.dump(day56_data, f, indent=2)

print("Day 56 successfully generated!")
for idx, p in enumerate(day56_data["parts"]):
    w_cnt = sum(len(s.split()) for s in p["say"])
    print(f"  Part {idx+1}: {w_cnt} words")
total_w = sum(sum(len(s.split()) for s in p["say"]) for p in day56_data["parts"])
print(f"Total Day 56 words: {total_w}")
