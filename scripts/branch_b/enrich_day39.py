import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
d39_path = os.path.join(commerce_dir, "scripts", "branch_b", "day39_dmkt_data.json")

with open(d39_path, "r", encoding="utf-8") as f:
    d39 = json.load(f)

# Part 1 extra paragraph
part1_extra = [
    "From a survival analysis standpoint, non-contractual transaction data exhibits profound Right-Censoring. When an analyst extracts "
    "customer history up to the current date T, we observe all transactions that occurred up to T, but the true lifetime of the customer "
    "relationship remains unobserved (censored) into the future. Classical regression models (such as Ordinary Least Squares or Random Forests "
    "trained on historical revenue) fail catastrophically because they treat censored future time as zero, systematically underestimating "
    "customer lifetime equity. The probabilistic BTYD formulation explicitly models the hazard rate h(t) and survivor function S(t), treating "
    "future dormancy as a stochastic probability rather than an empirical zero. This rigorous handling of right-censored data ensures that "
    "marketing projections remain statistically unbiased across both newly acquired and mature customer cohorts."
]

# Part 2 extra paragraphs
part2_extra = [
    "At the optimization level, estimating the four BG/NBD hyperparameters (r, alpha, a, b) requires maximizing the log-likelihood function "
    "across all N observed customers. Because likelihood surfaces can exhibit flat plateaus or saddle points when customer frequency is highly "
    "skewed, numerical optimizers (such as L-BFGS-B or Nelder-Mead with bound constraints) are initialized with heuristic starting values. "
    "Data scientists implement regularized likelihood estimation, penalizing extreme values of alpha and b to prevent parameter explosion. "
    "Once convergence is verified via gradient norm thresholds, the Hessian matrix is inverted to compute standard errors and construct 95% "
    "confidence intervals for each hyperparameter, confirming that customer heterogeneity has been modeled with high statistical significance.",
    "Furthermore, the BG/NBD model exhibits remarkable stability across varying transaction volume regimes. Because the underlying Poisson "
    "and Gamma compounding yields a closed-form Negative Binomial Distribution, the model naturally handles long-tailed retail distributions "
    "where eighty percent of shoppers make zero repeat purchases while a tiny two percent fraction generates fifty percent of repeat orders. "
    "This robust handling of Pareto-type skew ensures that enterprise marketing algorithms do not distort acquisition bids when encountering "
    "extreme transactional outliers, maintaining disciplined capital allocation across all customer deciles."
]

# Part 3 extra paragraphs
part3_extra = [
    "A vital statistical property of the Gamma-Gamma model is its conjugacy with the Gamma transaction distribution. Because the prior "
    "distribution of customer average spend is Gamma(q, gamma) and the conditional distribution of individual transaction values is "
    "Gamma(p, nu), the posterior distribution of customer spend is analytically conjugate, yielding a closed-form posterior expectation without "
    "requiring computationally intensive Markov Chain Monte Carlo (MCMC) simulations. This algebraic tractability allows enterprise data "
    "pipelines to score millions of customers in seconds. Furthermore, econometricians perform monotonicity checks: verifying that expected "
    "future order value monotonically approaches the customer's observed mean as repeat transaction frequency x increases, confirming that "
    "the Bayesian shrinkage dampens appropriately as empirical evidence accumulates.",
    "Additionally, enterprise data science teams conduct sensitivity analyses on the independence assumption. If high-frequency buyers "
    "consistently purchase smaller basket sizes (e.g. daily coffee refills vs occasional bulk bean orders), models are stratified into "
    "distinct product tier segments. This stratification preserves the mathematical validity of the Gamma-Gamma distribution within each "
    "homogenous sub-population, preventing spend distortion across divergent product lines."
]

# Part 4 extra paragraphs
part4_extra = [
    "In sophisticated enterprise financial planning, Value-Based Bidding incorporates dynamic category gross margin and customer return rates. "
    "Raw transaction revenue does not equal realized gross margin: apparel orders may experience a thirty percent return rate, while digital "
    "services experience near-zero returns. Advanced pCLV pipelines compute Contribution Margin 3 (CM3): subtracting cost of goods sold, outbound "
    "shipping, payment processing, expected category return costs, and customer service overhead from projected spend. Bidding engines optimize "
    "against Predicted Lifetime CM3, guaranteeing that ad algorithms allocate capital to customers who generate authentic cash profits rather "
    "than unviable, high-return revenue vanity metrics.",
    "Furthermore, media teams establish dynamic bid ceilings to prevent algorithmic runaway during competitive holiday bidding surges. "
    "While high-pCLV accounts justify aggressive bid multipliers, capping maximum bids prevents the algorithm from exhausting campaign "
    "budgets on a handful of hyper-competitive auctions. This disciplined pacing balances aggressive value capture with healthy portfolio "
    "diversification across the broader addressable market."
]

# Part 5 extra paragraphs
part5_extra = [
    "In enterprise MLOps architectures, production pCLV pipelines incorporate automated model monitoring and data quality gates. Production "
    "monitoring tools (such as Evidently AI, Great Expectations, or Databricks Lakehouse Monitoring) continuously track Kolmogorov-Smirnov "
    "test statistics on incoming transaction distributions. If promotional flash sales or holiday shopping surges introduce abrupt distribution "
    "shifts that degrade model accuracy, automated retrain triggers execute scheduled containerized retraining pipelines. Refreshed model weights "
    "are benchmarked against historical baseline models in shadow mode before being promoted to production, guaranteeing that automated "
    "programmatic bidding systems never execute ad spend against corrupted or drifted predictive signals.",
    "Finally, continuous feature store integration powers real-time inference at the edge. By maintaining pre-computed BG/NBD and Gamma-Gamma "
    "vectors in low-latency key-value stores (such as Redis or Amazon DynamoDB), marketing platforms can serve sub-five-millisecond pCLV lookups "
    "during live web sessions. When an identified user visits the storefront, personalized promotion engines instantly evaluate whether to "
    "offer an aggressive loyalty incentive, a standard cross-sell recommendation, or no discount whatsoever, orchestrating precision economic "
    "personalization at enterprise scale.",
    "Ultimately, productionizing predictive Customer Lifetime Value bridges the historic divide between marketing acquisition and corporate "
    "finance. By translating stochastic behavioral calculus into real-time programmatic bidding vectors, the modern enterprise transforms "
    "customer acquisition from an uncertain expense into an auditable, compounding capital investment."
]

d39["parts"][0]["say"].extend(part1_extra)
d39["parts"][1]["say"].extend(part2_extra)
d39["parts"][2]["say"].extend(part3_extra)
d39["parts"][3]["say"].extend(part4_extra)
d39["parts"][4]["say"].extend(part5_extra)

# Re-audit word counts
total_words = 0
for idx, p in enumerate(d39["parts"]):
    words = len(" ".join(p["say"]).split())
    total_words += words
    print(f"Part {idx+1} ({p['title']}): {words} words")
    assert words >= 600, f"Part {idx+1} is under 600 words: {words}"

print(f"Total Day 39 Words: {total_words}")
assert total_words >= 3000, f"Total Day 39 words under 3000: {total_words}"

with open(d39_path, "w", encoding="utf-8") as f:
    json.dump(d39, f, indent=2)

print("Enriched Day 39 saved successfully!")
