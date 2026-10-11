# scripts/visuals/business_analytics_spec_m1.py
# Days 1 to 15 Specification for Business Analytics, Econometrics & Decision Dashboards (course-business-analytics)
# Conforming strictly to Gate v2 semantic standard:
# 3-Tier Socratic Hint Ladders, Descriptive vs Predictive vs Prescriptive Analytics,
# Missing Data Imputation Physics (MCAR, MAR, MNAR) & Outlier Detection (Tukey IQR & Isolation Forests),
# Parametric & Heavy-Tailed Probability Distributions (Normal, Log-Normal, Poisson, Pareto),
# Statistical Hypothesis Testing & Neyman-Pearson Power Physics (Type I vs Type II Errors),
# Enterprise A/B Testing, Minimum Detectable Effect (MDE) & Peeking Problem Hazards,
# ANOVA & Multi-Arm Bandits (Thompson Sampling vs Epsilon-Greedy),
# Correlation vs Causal Directed Acyclic Graphs (DAGs) & Simpson's Paradox,
# Ordinary Least Squares (OLS) Regression & Gauss-Markov BLUE Proofs,
# Multicollinearity (VIF > 5) & Heteroskedasticity (Breusch-Pagan & White Errors),
# Non-Linear Model Misspecification & Ramsey RESET Diagnostics,
# Logistic Regression, Odds Ratios & ROC-AUC / Precision-Recall Curves,
# Customer Segmentation Analytics (RFM Scoring & K-Means Silhouette Optimality),
# Cohort Analysis, Customer Retention Curves & Net Retention Rate (NRR) Dynamics,
# Dimensionality Reduction via Principal Component Analysis (PCA) & Scree Plots,
# and Executive Dashboard Engineering (Tufte Data-Ink Ratio, Cognitive Load & Milestone 1).

DAYS_1_TO_15 = [
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "Business Analytics Foundations & The Data-Driven Decision Invariant",
    "stageName": "Stage 1: Statistical Foundations, Data Wrangling & Exploratory Business Analytics",
    "stageNum": 1,
    "pedagogicalRole": "Analytics Taxonomy & Decision Intelligence Physics",
    "spokenGoal": "Welcome to Course 24: Business Analytics, Econometrics & Decision Dashboards! In modern corporate strategy, 'intuition' and 'gut feel' are relics of the past. Today, every boardroom decision—from multi-million-dollar inventory commitments to marketing budgets—is governed by empirical data. We establish the analytics taxonomy: Descriptive (What happened?), Diagnostic (Why did it happen?), Predictive (What will happen?), and Prescriptive (What should we do?). Crucially, we architect the hierarchy of business metrics: separating vanity metrics (total app downloads) from North Star Metrics and One Metric That Matters (OMTM) that drive sustainable economic enterprise value.",
    "conceptInvariant": "Decision Intelligence Invariant: Analytics creates enterprise value if and only if the expected monetary gain from an information-guided decision exceeds the total cost of collecting, cleaning, and modeling the data: E[Gain | Analytics] - Cost(Data Pipeline) > E[Gain | Default Action]; data without decision impact is expensive organizational clutter.",
    "failureMode": "A retail tech company builds a $1.2M real-time clickstream dashboard tracking 450 distinct user event metrics; the executive team experiences cognitive overload and analysis paralysis, missing a 25% drop in primary conversion checkout rates for three weeks.",
    "tryItFriction": "Build an Executive Metric Architecture Validator in Python: ingest raw business events; separate leading indicators from lagging indicators; calculate Customer Acquisition Cost (CAC), Lifetime Value (LTV), and LTV/CAC ratio; detect vanity metric divergence where user counts surge while Net Revenue Retention (NRR) deteriorates.",
    "socraticHints": [
      "Why is 'Total Registered Users' considered a vanity metric in business analytics?",
      "Because registered users do not necessarily generate revenue, remain active, or contribute to enterprise profitability.",
      "A company can gain 1,000,000 registered users while bleeding cash and losing active customers, masking operational insolvency."
    ],
    "situationalPuzzle": {
      "scenario": "A subscription software enterprise presents its quarterly metrics: Registered Users grew by 45%, Website Traffic grew by 60%, but Monthly Recurring Revenue (MRR) grew by only 2% and Gross Revenue Churn increased from 1.5% to 4.2% monthly. The marketing team claims the quarter was a triumph. What is the Chief Analytics Officer's verdict?",
      "options": [
        "The quarter was a major success because top-of-funnel user acquisition grew by 45%.",
        "The quarter was a failure masked by vanity metrics. Top-of-funnel traffic brought low-intent, non-paying users, while the core business suffered a lethal acceleration in customer churn (4.2% monthly = 40% annualized churn!), threatening enterprise solvency.",
        "Both user growth and revenue churn are irrelevant if cash is in the bank.",
        "Marketing budgets should be doubled immediately to compensate for churn."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In business analytics, top-of-funnel user counts and page views are classic vanity metrics. A 4.2% monthly gross revenue churn translates to an annualized revenue loss of 1 - (1 - 0.042)^12 = 40.4%! Even with massive user growth, if 40% of paying customers leave every year, the business is pouring water into a leaky bucket, burning capital on acquiring low-quality leads who never convert."
    },
    "quests": [
      {
        "title": "Business Analytics Taxonomy & Information Value Formulation",
        "type": "concept",
        "description": "Formulate the formal mathematical framework of Expected Value of Sample Information (EVSI) in decision theory; detail the four stages of business analytics (Descriptive, Diagnostic, Predictive, Prescriptive); map leading vs lagging indicators to corporate cash flow generation.",
        "rubric": "Formulate EVSI mathematically; derive decision tree boundaries where collecting additional analytics data transitions from positive to negative ROI; detail North Star Metric selection criteria."
      },
      {
        "title": "The Vanity Metric Funding Fraud Forensic Audit",
        "type": "detective",
        "description": "Audit a venture-backed D2C startup's pitch deck that raised $40M based on '10x User Sign-Up Growth': unearth how 75% of new accounts were bot sign-ups generated by cash-back promotions; demonstrate how true CAC was $180 while LTV was only $22, uncovering a fatal $30M capital destruction scheme.",
        "rubric": "Audit cohort telemetry logs; isolate paid vs organic user engagement; compute true cohorts and unit economics (LTV/CAC = 0.12x); prove that management's vanity metrics masked structural insolvencies."
      },
      {
        "title": "Enterprise KPI & Metric Hierarchy Engine",
        "type": "mastery",
        "description": "Develop a production-grade KPI analytics module in Python: ingest multi-source business transaction logs; calculate North Star Metrics (ARR, MRR, Gross Margin, Net Retention Rate NRR, Quick Ratio = (New ARR + Expansion ARR) / (Churn + Contraction ARR)); flag toxic divergences between leading and lagging indicators.",
        "rubric": "Implement automated ingestion of subscription data; calculate SaaS Quick Ratio and Magic Number; output an automated executive scorecard with statistical anomaly alerts."
      },
      {
        "title": "The Boardroom Vanity Metric Deflation War Room",
        "type": "incident",
        "description": "Intervene in an executive committee crisis: the VP of Growth demands a $10M marketing expansion based on achieving 5M registered app downloads; prove to the Board of Directors that the downloads generate zero incremental gross contribution margin, re-allocating capital to customer success retention programs.",
        "rubric": "Decompose download metrics into activation, retention, and monetization funnels; present a rigorous unit-economics bridge proving that retention investments deliver a 4.5x higher ROIC than acquiring churn-prone top-of-funnel traffic."
      }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "Data Wrangling & Quality Physics: Missing Data Imputation & Outlier Detection",
    "stageName": "Stage 1: Statistical Foundations, Data Wrangling & Exploratory Business Analytics",
    "stageNum": 1,
    "pedagogicalRole": "Data Quality, Imputation Physics & Anomaly Detection",
    "spokenGoal": "Garbage in, garbage out. If your underlying business data is corrupted, your multi-million-dollar econometric models will produce catastrophic hallucinations. Today, we master the mathematics of Data Quality: Donald Rubin's classic taxonomy of missing data: Missing Completely at Random (MCAR), Missing at Random (MAR), and Missing Not at Random (MNAR). Dropping rows with missing values (listwise deletion) introduces severe selection bias when data is MAR or MNAR! We will implement iterative multivariate imputation (MICE) and master robust Outlier Detection: Tukey's Interquartile Range (IQR = Q3 - Q1), Z-Scores, and multi-dimensional Isolation Forests.",
    "conceptInvariant": "Missing Data Mechanism Invariant: If missingness is non-ignorable (MNAR)—where the probability of a missing value depends on the unobserved value itself (e.g., high-income earners refusing to disclose salary)—mean imputation and listwise deletion introduce severe structural bias; imputation must be conditioned on joint observed covariate distributions.",
    "failureMode": "A credit scoring model drops all applicants with missing income fields (assuming MCAR); in reality, low-income applicants with high default risk deliberately omit income (MNAR); dropping these records artificially inflates model approval rates, causing an unexpected $24M wave of loan defaults.",
    "tryItFriction": "Construct a Robust Data Hygiene & Imputation Pipeline in Python: ingest messy enterprise transaction data containing nulls, negative quantities, and extreme anomalies; conduct Little's MCAR statistical test; execute MICE (Multivariate Imputation by Chained Equations); detect multi-variate outliers via Isolation Forests; output audited clean datasets.",
    "socraticHints": [
      "Why is simple Mean Imputation dangerous for financial and business analytics?",
      "Because filling missing entries with the mean artificially shrinks the variance of the variable and distorts correlation with all other variables.",
      "This leads to underestimated standard errors, artificially narrow confidence intervals, and false positive statistical conclusions."
    ],
    "situationalPuzzle": {
      "scenario": "A luxury e-commerce platform analyzes customer survey data on household annual income. Customers with household income exceeding $250,000 refused to answer the income question 65% of the time, while middle-income customers answered 95% of the time. An analyst suggests replacing all missing income values with the sample mean ($85,000). What is the consequence?",
      "options": [
        "Mean imputation is appropriate because it preserves the overall sample size.",
        "Severe downward bias (MNAR violation)! Because the wealthiest customers systematically omitted income, the sample mean ($85,000) severely underestimates true income; imputing $85,000 drags down the entire distribution and misclassifies ultra-high-net-worth customers as mass-market buyers!",
        "The missing data should be filled with zeros.",
        "Missing data in surveys can never be modeled statistically."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is a classic Missing Not at Random (MNAR) condition: the probability of missingness depends directly on the value of the missing variable itself (wealthy people hiding wealth). Imputing the observed sample mean ($85,000) severely biases the dataset downward, flattening customer purchasing power estimates and corrupting pricing tier algorithms. Analysts must use pattern-mixture models, Heckman selection corrections, or proxy indicators (zip code real estate value, browsing device tier) to avoid fatal classification errors."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of Rubin's Missing Data Taxonomy & MICE",
        "type": "concept",
        "description": "Formulate the mathematical definitions of MCAR P(M | Y_obs, Y_mis) = P(M), MAR P(M | Y_obs, Y_mis) = P(M | Y_obs), and MNAR; derive the iterative chained equations algorithm in MICE (Multivariate Imputation by Chained Equations); prove why listwise deletion produces unbiased estimates ONLY under strict MCAR.",
        "rubric": "Formulate joint and conditional probability distributions of missingness indicator M; explain why MICE preserves covariance structures across variables; contrast single vs multiple imputation (Rubin's pooling rules)."
      },
      {
        "title": "The Truncated Outlier Algorithmic Pricing Collapse Forensic Audit",
        "type": "detective",
        "description": "Audit an airline dynamic pricing algorithm: trace how an automated pipeline clipped ticket prices above $1,200 as 'outliers' using a standard 3-sigma rule; demonstrate how this truncation blinded the algorithm to inelastic corporate holiday demand, causing the airline to sell out peak transatlantic flights at $1,200 instead of $4,500, losing $18M in profit.",
        "rubric": "Analyze price truncation distribution skew; prove that legitimate Pareto right-tail demand was falsely treated as Gaussian noise; formulate power-law outlier identification protocols."
      },
      {
        "title": "Enterprise Data Hygiene & Isolation Forest Anomaly Suite",
        "type": "mastery",
        "description": "Develop an automated data quality and anomaly detection pipeline in Python: implement Little's MCAR test; build a MICE imputer with predictive mean matching; implement multi-variate outlier detection combining Tukey's IQR and scikit-learn Isolation Forests; output a comprehensive Data Quality Scorecard.",
        "rubric": "Clean, modular Python pipeline; robust handling of categorical and numerical features; automated generation of outlier anomaly score distributions and clean output data frames."
      },
      {
        "title": "The Corrupted ERP Migration Data Freeze War Room",
        "type": "incident",
        "description": "Manage an enterprise data migration emergency: during a legacy ERP to cloud data warehouse transition, 18% of customer transaction records are corrupted with null shipping addresses and negative invoice values, halting downstream automated credit billing; design an immediate programmatic reconciliation and fallback imputation framework to restore billing within 6 hours.",
        "rubric": "Develop automated regex parsing and historical profile matching; isolate true data corruption from legitimate credit notes; establish data validation gates (Great Expectations / schema enforcement) that prevent corrupted batch ingestion."
      }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "Probability Distributions in Business: Normal, Log-Normal, Poisson & Pareto",
    "stageName": "Stage 1: Statistical Foundations, Data Wrangling & Exploratory Business Analytics",
    "stageNum": 1,
    "pedagogicalRole": "Empirical Distribution Physics & Heavy-Tail Mechanics",
    "spokenGoal": "Most beginners assume all business data follows a standard Gaussian bell curve. In real business analytics, assuming a normal distribution will bankrupt your company! Human income, customer spend, software bug frequencies, and product sales are wildly non-normal. Today, we master the fundamental probability distributions of business: the Normal distribution (manufacturing tolerances), the Log-Normal distribution (customer transaction values and wages, where variables are bounded at zero and exhibit positive skew), the Poisson distribution (customer arrivals and call center volume per hour), the Binomial distribution (conversion rates), and the Power Law / Pareto Distribution (where 80% of sales come from 20% of customers, and extreme fat-tail outliers dominate total revenue).",
    "conceptInvariant": "Scale-Free Pareto Invariant: In a Power Law distribution P(X > x) = (x / x_min)^(-alpha), if alpha <= 2, the theoretical variance is infinite, and if alpha <= 1, the theoretical mean is infinite; standard sample means and standard deviations fail to converge, rendering conventional Gaussian statistical models mathematically invalid.",
    "failureMode": "A hospital emergency room models patient arrivals using a uniform distribution; in reality, arrivals follow a non-homogeneous Poisson process with peak-hour surges; understaffing during peak Poisson arrival spikes causes 4-hour wait times, regulatory penalties, and patient departures.",
    "tryItFriction": "Build an Empirical Distribution Fitting & Q-Q Plot Suite in Python: ingest empirical business datasets (customer spend, web traffic arrivals, conversion events); fit Normal, Log-Normal, Poisson, and Pareto distributions; execute Kolmogorov-Smirnov goodness-of-fit tests; generate visual Quantile-Quantile (Q-Q) plots highlighting fat-tail deviations.",
    "socraticHints": [
      "Why does customer lifetime value (LTV) almost always follow a Log-Normal or Pareto distribution rather than a Normal distribution?",
      "Because customer spend cannot be negative (bounded at zero on the left) and has no fixed upper bound on the right.",
      "A small number of 'whales' spend thousands of times more than the average customer, creating a heavy right-hand tail that pulls the mean far above the median."
    ],
    "situationalPuzzle": {
      "scenario": "A mobile gaming analytics team evaluates in-game purchase data across 1,000,000 players. The median spend is $0.00. The mean spend is $4.50 with a standard deviation of $35.00. An analyst builds a 95% confidence interval using Normal distribution theory: $4.50 +/- 1.96 * $35 = [-$64.10, +$73.10]. What is fundamentally wrong with this analysis?",
      "options": [
        "Sample size is too large for a 95% confidence interval.",
        "The distribution is heavily right-skewed (Pareto/Power-law with 90% non-spenders and top 0.1% 'whales' driving all revenue). Applying a symmetric normal bell curve predicts negative spending (-$64.10, impossible!) and severely underestimates the likelihood of extreme high-value transactions!",
        "Confidence intervals should always use a 99% Z-score.",
        "Mobile game spending is strictly deterministic."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In freemium digital economies, spend follows an extreme power-law / Pareto distribution: over 90% of players spend $0 (point mass at zero), while a fraction of 1% (whales) spend thousands of dollars. Applying a symmetric Gaussian model produces nonsense negative values and completely fails to capture the heavy-tailed revenue physics. Analysts must use Zero-Inflated Log-Normal or Pareto distributions with bootstrap confidence intervals."
    },
    "quests": [
      {
        "title": "Mathematical Formulations of Business Probability Distributions",
        "type": "concept",
        "description": "Formulate the probability density functions (PDF) and cumulative distribution functions (CDF) for Normal, Log-Normal (ln(X) ~ N(mu, sigma^2)), Poisson (P(k) = lambda^k * e^(-lambda) / k!), and Pareto distributions; derive the relationship between Pareto parameter alpha and the 80/20 rule.",
        "rubric": "Detail mathematical expressions for all 4 distributions; prove that if alpha = log_4(5) approx 1.161, exactly 80% of the total wealth/sales is held by 20% of the population; explain why Poisson variance equals its mean (lambda)."
      },
      {
        "title": "The Gaussian Risk Management Value-at-Risk Meltdown Forensic Audit",
        "type": "detective",
        "description": "Audit an algorithmic trading desk that modeled daily asset returns using a Gaussian normal distribution: calculate the theoretical probability of a 5-sigma daily event under a normal curve (1 in 3.5 million days, or once every 14,000 years); demonstrate how empirical financial fat tails (Student-t / Pareto) experience 5-sigma events once every few years, resulting in a sudden $65M blow-up.",
        "rubric": "Compare Gaussian tail probabilities against empirical heavy-tailed distributions; compute excess kurtosis; demonstrate how fat-tail underestimation destroys capital reserves."
      },
      {
        "title": "Automated Distribution Fitter & Goodness-of-Fit Engine",
        "type": "mastery",
        "description": "Construct an empirical distribution diagnostic platform in Python using scipy.stats: ingest arbitrary business datasets; fit multiple candidate distributions via Maximum Likelihood Estimation (MLE); compute Akaike Information Criterion (AIC), Bayesian Information Criterion (BIC), and Kolmogorov-Smirnov test statistics; output Q-Q plots and selection recommendations.",
        "rubric": "Implement MLE fitting across Normal, Log-Normal, Exponential, Weibull, and Pareto distributions; rank distributions by AIC/BIC; generate multi-panel visual Q-Q plots and diagnostic summary tables."
      },
      {
        "title": "The Peak Call Center Queuing Meltdown War Room",
        "type": "incident",
        "description": "Resolve an operational queuing emergency: a fintech company's customer support center collapses under incoming call volumes following a banking outage; management staffed the center using the daily average arrival rate; model the non-homogeneous Poisson arrival rate lambda(t) and queuing theory (M/M/s Erlang-C model) to re-dimension staffing and eliminate dropped calls.",
        "rubric": "Formulate Erlang-C waiting probability formula; calculate minimum agent capacity s required to maintain an 80/20 service level (80% answered within 20 seconds); structure dynamic shift scheduling that matches diurnal arrival intensity."
      }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "Hypothesis Testing in Business: Type I/II Errors, Statistical Power & Non-Parametrics",
    "stageName": "Stage 1: Statistical Foundations, Data Wrangling & Exploratory Business Analytics",
    "stageNum": 1,
    "pedagogicalRole": "Neyman-Pearson Decision Framework & Hypothesis Testing Physics",
    "spokenGoal": "Every business decision is made under uncertainty: Did the new checkout button increase sales, or was it random noise? Should we launch the premium tier or kill it? In the Neyman-Pearson statistical framework, we set up the Null Hypothesis (H0: No effect) against the Alternative Hypothesis (H1: Real effect). Today, we master the mathematics of decision errors: Type I Error (Alpha, False Positive: launching a useless feature that has no real impact) and Type II Error (Beta, False Negative: killing a brilliant feature because our test was too weak to detect it!). Statistical Power (1 - Beta) measures our ability to detect real effects. We also master Two-Sample t-tests and non-parametric Mann-Whitney U tests when normality fails.",
    "conceptInvariant": "Neyman-Pearson Trade-Off Invariant: For a fixed sample size N, decreasing the probability of a Type I error (lowering alpha from 0.05 to 0.01) mathematically forces the probability of a Type II error (beta) to increase, reducing statistical power; the only way to simultaneously decrease both error rates is to increase the sample size N.",
    "failureMode": "A product team runs a 5-day test on a new website redesign with only 400 visitors; the t-test p-value is 0.18, so the team concludes 'the redesign does not work' and scraps it; in reality, the redesign boosted conversions by 15%, but the tiny sample size had only 18% statistical power, blinding the team to a major revenue win (Type II error).",
    "tryItFriction": "Build an Interactive Hypothesis Testing & Statistical Power Engine in Python: take sample conversion data; execute Student's t-test, Welch's t-test (unequal variances), and Mann-Whitney U non-parametric test; compute effect size (Cohen's d); calculate analytical statistical power (1 - Beta); plot power curves as a function of sample size and effect size.",
    "socraticHints": [
      "What is the p-value in a statistical hypothesis test?",
      "The p-value is the probability of observing test results at least as extreme as the actual observed data, assuming the Null Hypothesis (H0) is completely true.",
      "A p-value is NOT the probability that H0 is true, nor is it the probability that the decision was correct."
    ],
    "situationalPuzzle": {
      "scenario": "A financial fraud analytics team must configure an automated anti-money laundering (AML) transaction blocking filter. What represents a Type I error versus a Type II error, and which error is far more dangerous if the regulator imposes a $50M fine for letting illicit transactions pass?",
      "options": [
        "Type I = letting illicit transactions pass; Type II = blocking legitimate customers.",
        "Type I Error (False Positive) = blocking an innocent legitimate customer. Type II Error (False Negative) = failing to detect an illicit money laundering transaction! To avoid the $50M regulatory fine, the team must prioritize minimizing Type II errors (maximizing Power / Recall), even if it raises Type I false alarm friction!",
        "Both errors carry identical legal penalties.",
        "Statistical tests cannot evaluate binary fraud classification."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In fraud and compliance testing: Null Hypothesis H0 = 'Transaction is Legitimate'. Alternative H1 = 'Transaction is Fraudulent'. Type I Error (False Positive) rejects H0 when true: flagging an innocent customer (customer annoyance). Type II Error (False Negative) fails to reject H0 when false: letting a criminal transaction pass unnoticed! When regulators impose a $50M penalty for missed laundering, a Type II error is catastrophic. The analytics team must tune decision thresholds to maximize statistical power and sensitivity (minimizing Type II errors), accepting higher false alarm review rates."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of the Neyman-Pearson Lemma & Power Formulation",
        "type": "concept",
        "description": "Formulate the Neyman-Pearson Lemma proving that the likelihood ratio test is the uniformly most powerful test for a given significance level alpha; derive the formula for statistical sample size N = 2 * (Z_alpha/2 + Z_beta)^2 * sigma^2 / delta^2; explain effect size via Cohen's d.",
        "rubric": "Step-by-step mathematical derivation of sample size requirement; derive statistical power as a function of non-centrality parameter; contrast parametric Welch's t-test with non-parametric Wilcoxon-Mann-Whitney rank-sum test."
      },
      {
        "title": "The False Positive P-Hacking Scientific Crisis Forensic Audit",
        "type": "detective",
        "description": "Audit an internal marketing science team that tested 40 different discount coupon variations and proudly published the single test with a p-value of 0.03: prove mathematically that testing 40 independent true-null variations yields an 87.1% probability of observing at least one false positive (alpha inflation: 1 - (1 - 0.05)^40); apply Bonferroni and Benjamini-Hochberg False Discovery Rate (FDR) corrections to expose the illusion.",
        "rubric": "Calculate family-wise error rate (FWER); apply Bonferroni adjustment (alpha/m = 0.05/40 = 0.00125); prove that the 'winning' coupon was pure random noise that failed replication."
      },
      {
        "title": "Hypothesis Testing & Power Optimization Suite",
        "type": "mastery",
        "description": "Develop a comprehensive hypothesis testing toolkit in Python: implement two-sample t-tests, Welch's t-tests, paired t-tests, and Mann-Whitney U tests; calculate Cohen's d, Glass's delta, and Hedges' g effect sizes; compute exact statistical power curves across varying sample sizes; output publication-ready test reports.",
        "rubric": "Clean modular implementation using scipy and statsmodels; automated normality checks (Shapiro-Wilk) routing data to parametric vs non-parametric tests; generate power vs sample size visualization."
      },
      {
        "title": "The Regulatory Drug Efficacy Compliance War Room",
        "type": "incident",
        "description": "Lead the statistical defense of a clinical analytics engagement: an enterprise digital health client's Phase II trial shows a p-value of 0.06 (just missing the standard 0.05 regulatory cutoff); analyze post-hoc power, evaluate whether unequal group variances distorted the Student's t-test, and execute a pre-specified non-parametric permutation test demonstrating statistical significance at p = 0.038.",
        "rubric": "Evaluate Monte Carlo permutation test mechanics; demonstrate how outlier skewness in the treatment arm inflated standard error in traditional t-tests; prepare an authoritative regulatory submission defendable before the FDA."
      }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "A/B Testing & Controlled Experiments: Minimum Detectable Effect & Peeking Traps",
    "stageName": "Stage 1: Statistical Foundations, Data Wrangling & Exploratory Business Analytics",
    "stageNum": 1,
    "pedagogicalRole": "Randomized Controlled Trials & Experimentation Physics",
    "spokenGoal": "At tech giants like Google, Amazon, and Netflix, thousands of A/B tests run concurrently every single day. A/B testing is the gold standard of causal business analytics: randomly assigning users to Control (A) versus Variant (B) ensures all unobserved confounding factors are balanced. Today, we master Enterprise A/B Testing: sizing experiments using Minimum Detectable Effect (MDE), setting power (80%) and significance (5%), and avoiding the deadly 'Peeking Problem'. If you peek at your test results every morning and stop the experiment the moment p < 0.05, your false positive rate does not stay at 5%—it explodes past 30%! We will implement fixed-horizon testing and modern Sequential Probability Ratio Tests (SPRT).",
    "conceptInvariant": "Optional Stopping Alpha Inflation Invariant: Continuously monitoring an ongoing A/B test and terminating the experiment upon reaching statistical significance (p < alpha) violates fixed-horizon sampling theory, driving the true Type I error rate asymptotically to 100% as the monitoring duration approaches infinity; continuous monitoring requires sequential alpha-spending boundaries (Pocock, O'Brien-Fleming) or mSPRT.",
    "failureMode": "A growth hacking team peeks at an A/B test dashboard 5 times a day for two weeks; on Day 4, variant B crosses p = 0.042; the team immediately stops the test and rolls out Variant B to 100% of users; conversion rates actually drop by 3% over the subsequent month; the team rolled out pure noise due to the optional stopping peeking trap.",
    "tryItFriction": "Build an Enterprise A/B Testing & Sequential Analysis Simulator in Python: calculate sample size required for a 2% baseline conversion rate and 5% relative MDE; simulate 10,000 A/B tests with ZERO true treatment effect (A/A test); demonstrate how daily peeking inflates false positive rates from 5% to 32%; implement Robbins-Lai-Wald Mixture Sequential Probability Ratio Test (mSPRT) to enable valid always-valid peeking.",
    "socraticHints": [
      "Why does checking an A/B test daily and stopping when p < 0.05 inflate the false positive rate?",
      "Because p-values fluctuate randomly over time like a Brownian random walk.",
      "Even if there is zero true effect, the random walk will eventually cross the 0.05 threshold at some random point in time; stopping at that instant captures a temporary random fluctuation as if it were a permanent truth."
    ],
    "situationalPuzzle": {
      "scenario": "An e-commerce website has a baseline checkout conversion rate of 3.0%. The VP of Product wants to detect a relative lift of 10% (new conversion rate = 3.3%, absolute MDE = 0.3%) with 80% statistical power (Z_beta = 0.84) and 5% significance level (two-tailed Z_alpha/2 = 1.96). What is the approximate sample size required PER VARIANT?",
      "options": [
        "500 visitors per variant.",
        "Approximately 50,800 visitors per variant (over 101,600 total visitors)! Trying to detect a small 10% relative lift on a 3% baseline requires massive sample sizes!",
        "5,000 visitors per variant.",
        "Sample size cannot be calculated for conversion rates."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us apply the two-sample proportion sample size formula: N = [ (Z_alpha/2 * sqrt(2*p_bar*(1-p_bar)) + Z_beta * sqrt(p1*(1-p1) + p2*(1-p2))) / (p2 - p1) ]^2. Here: p1 = 0.03, p2 = 0.033, delta = 0.003, p_bar = 0.0315. Approximating: N approx 2 * (1.96 + 0.84)^2 * p * (1 - p) / delta^2 = 2 * (2.80)^2 * (0.03 * 0.97) / (0.003)^2 = 2 * 7.84 * 0.0291 / 0.000009 = 0.4563 / 0.000009 = 50,700 visitors per variant! Total experiment requires ~101,400 visitors. Product managers who attempt to run this test with 2,000 visitors have virtually zero statistical power and are merely flipping coins."
    },
    "quests": [
      {
        "title": "Mathematical Derivation of Proportions Sample Sizing & Wald's Sequential Test",
        "type": "concept",
        "description": "Derive the sample size formula for difference of proportions from the normal approximation to the binomial distribution; derive Abraham Wald's Sequential Probability Ratio Test (SPRT) with stopping boundaries A and B; prove how sequential testing allows early stopping for efficacy or futility without alpha inflation.",
        "rubric": "Step-by-step mathematical proof of sample size; formulate SPRT log-likelihood ratio Lambda_n; derive boundaries A = (1 - beta)/alpha and B = beta/(1 - alpha); explain the O'Brien-Fleming alpha-spending function."
      },
      {
        "title": "The Sample Ratio Mismatch (SRM) Data Integrity Forensic Audit",
        "type": "detective",
        "description": "Audit an A/B test where traffic allocation was set to 50/50, but actual observed traffic was 51,200 Control vs 48,800 Variant (Chi-Square test p-value = 0.00001): prove that this Sample Ratio Mismatch (SRM) invalidates the entire experiment; unearth how a redirect latency bug in Variant caused mobile users on slow connections to bounce before tracking fired.",
        "rubric": "Formulate goodness-of-fit Chi-Square test for SRM; trace the causal mechanism of differential attrition; prove that analyzing conversion rates under SRM introduces catastrophic survivorship bias."
      },
      {
        "title": "Enterprise A/B Experimentation & mSPRT Always-Valid Inference Engine",
        "type": "mastery",
        "description": "Construct an institutional A/B experimentation platform in Python: implement automated sample size sizing with MDE grids; build an automated SRM detector; implement the Mixture Sequential Probability Ratio Test (mSPRT) providing always-valid p-values that permit real-time daily peeking without false positive inflation; generate executive experiment reports.",
        "rubric": "Vectorized simulation of user conversions; implementation of Johari et al. mSPRT algorithm with normal mixing distribution; generate visualization displaying fixed-horizon vs sequential boundary crossings."
      },
      {
        "title": "The Network Spillover Interference Experimentation War Room",
        "type": "incident",
        "description": "Manage an A/B testing crisis at a two-sided ride-hailing / marketplace platform: standard user-level randomization fails because treatment drivers accept rides faster, cannibalizing ride demand from control drivers (Stable Unit Treatment Value Assumption SUTVA violation); design a Cluster-Randomized or Switchback Experimentation framework (alternating 2-hour geographic time slices) to eliminate network interference.",
        "rubric": "Formulate SUTVA violation mechanics in two-sided marketplaces; design the switchback time-slot randomization protocol; calculate cluster-adjusted standard errors and intra-cluster correlation (ICC) to establish true causal treatment effects."
      }
    ]
  },
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "ANOVA, Multi-Arm Bandits & Dynamic Exploration: Beyond Static A/B Testing",
    "stageName": "Stage 1: Statistical Foundations, Data Wrangling & Exploratory Business Analytics",
    "stageNum": 1,
    "pedagogicalRole": "Multi-Group Hypothesis Testing & Adaptive Experimentation Physics",
    "spokenGoal": "What happens when you have more than two variants to test? If marketing wants to test 5 different homepage headlines, running ten separate t-tests across all pairs inflates your error rate into statistical oblivion! Today, we master Analysis of Variance (ANOVA): partitioning total sum of squares into Between-Group Variance and Within-Group Variance, computing the F-statistic, and conducting Tukey's Honest Significant Difference (HSD) post-hoc tests. Furthermore, we advance to Adaptive Experimentation: Multi-Arm Bandits (MAB). In static A/B testing, you waste 50% of your traffic on inferior variants for weeks; Multi-Arm Bandits (Thompson Sampling and Upper Confidence Bound UCB) dynamically route traffic to winning variants in real time, minimizing Cumulative Regret!",
    "conceptInvariant": "Lai-Robbins Asymptotic Regret Bound Invariant: In the multi-armed bandit problem, the cumulative regret of any consistent policy must grow at least logarithmically with time: lim inf_{T -> inf} Regret(T) / ln(T) >= sum_{i: Delta_i > 0} (Delta_i / KL(p_i, p*)); Thompson Sampling and UCB achieve this theoretical lower bound, maximizing business revenue during the experiment.",
    "failureMode": "An e-commerce firm runs a traditional 6-week fixed-horizon A/B/C/D test on holiday checkout offers; Variant C is an obvious disaster (converting at 0.5% vs 3.0%), but the firm keeps sending 25% of all holiday traffic to Variant C for 42 days to 'complete the test'; the rigid design burns $480,000 in lost holiday sales.",
    "tryItFriction": "Build a Multi-Arm Bandit vs Static A/B Test Simulator in Python: simulate 4 competing product offers with unknown true conversion rates; implement Epsilon-Greedy, Upper Confidence Bound (UCB1), and Bayesian Thompson Sampling; track cumulative conversions and Cumulative Regret over 50,000 user impressions; prove that Thompson Sampling reduces lost revenue by 75% compared to static A/B testing.",
    "socraticHints": [
      "What is the fundamental difference between the objective of an A/B test and a Multi-Arm Bandit?",
      "An A/B test is designed for Pure Statistical Inference: identifying the single best variant with maximum statistical confidence.",
      "A Multi-Arm Bandit is designed for Profit Maximization: minimizing regret by routing traffic to the best currently known variant while continuing to explore."
    ],
    "situationalPuzzle": {
      "scenario": "A media streaming company runs a One-Way ANOVA across 4 different recommendation algorithms (Algorithms A, B, C, D) tested on 1,000 users each. The ANOVA F-statistic has a p-value of 0.002, successfully rejecting the null hypothesis that all 4 algorithms are equal. The product manager says: 'The test proves Algorithm D is significantly better than Algorithm A.' Is the product manager correct?",
      "options": [
        "Yes, because p = 0.002 is far below 0.05.",
        "No! A significant ANOVA F-test only proves that AT LEAST ONE pair of algorithms is different; it does NOT tell you WHICH pair differs. The manager MUST run a post-hoc test with family-wise error control (such as Tukey's HSD) to prove whether D is significantly superior to A!",
        "Yes, because Algorithm D had the highest sample mean.",
        "ANOVA cannot be used on sample sizes larger than 500."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. An omnibus ANOVA test tests the global null hypothesis H0: mu_A = mu_B = mu_C = mu_D. A statistically significant F-test (p = 0.002) only allows you to conclude that the four group means are not all identical. It does not pinpoint which specific pair has a statistically significant difference. Claiming D is better than A without running post-hoc pairwise tests (e.g., Tukey's Honest Significant Difference, Scheffe, or Bonferroni-corrected t-tests) is a major statistical fallacy that leads to unverified feature deployments."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of One-Way ANOVA & F-Distribution",
        "type": "concept",
        "description": "Derive the partitioning of Total Sum of Squares SST = SSB + SSW; derive degrees of freedom, Mean Squares (MSB, MSW), and the F-statistic F = MSB / MSW; formulate Tukey's Studentized Range q-statistic for post-hoc pairwise comparisons.",
        "rubric": "Step-by-step algebraic proof of sum of squares decomposition; prove that under H0, the expected value of MSB equals MSW = sigma^2; derive the Tukey HSD critical difference formula."
      },
      {
        "title": "The Exploration-Exploitation Regret Collapse Forensic Audit",
        "type": "detective",
        "description": "Audit an algorithmic headline optimization system that deployed an aggressive Epsilon-Greedy bandit (epsilon = 0.01) with insufficient initial exploration: demonstrate how an inferior headline that got lucky on its first 10 impressions was locked in as the 'exploit' choice, starving a superior headline that started slowly; quantify the $120,000 in lost click revenue.",
        "rubric": "Model the probability of premature lock-in under small epsilon; demonstrate how Thompson Sampling's Bayesian posterior beta distribution naturally prevents premature lock-in by maintaining exploration entropy."
      },
      {
        "title": "Thompson Sampling & Adaptive Experimentation Engine",
        "type": "mastery",
        "description": "Construct an institutional adaptive experimentation suite in Python: implement One-Way ANOVA with automated Tukey HSD post-hoc reporting; implement a Bayesian Thompson Sampling bandit using Beta-Binomial conjugate priors; simulate real-time traffic routing across 5 variants; generate visual charts comparing cumulative regret curves of Static A/B vs UCB1 vs Thompson Sampling.",
        "rubric": "Clean implementation of ANOVA and Tukey HSD using statsmodels; vectorized implementation of Thompson Sampling sampling from Beta(alpha, beta) posteriors; generate publication-grade regret comparison plots."
      },
      {
        "title": "The Flash-Sale Black Friday Bandit Deployment War Room",
        "type": "incident",
        "description": "Manage a high-stakes Black Friday e-commerce crisis: the retail platform has 12 competing promotional banner designs for a 24-hour flash sale; a static A/B test would take 2 weeks to reach significance, completely missing the sale window; design and deploy a Contextual Bandit algorithm that segments users by geographic region and dynamically serves the revenue-maximizing banner.",
        "rubric": "Structure the contextual bandit framework using LinUCB or Logistic Thompson Sampling; model revenue-per-impression reward functions; establish fallback safeguards to prevent serving broken or out-of-stock promotions."
      }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "Correlation vs Causation: Confounding, Simpson's Paradox & Causal DAGs",
    "stageName": "Stage 1: Statistical Foundations, Data Wrangling & Exploratory Business Analytics",
    "stageNum": 1,
    "pedagogicalRole": "Causal Inference & Structural Equation Physics",
    "spokenGoal": "Correlation does not equal causation—this is the most famous axiom in statistics, yet corporations violate it every single day. A company observes that customers who download their mobile app spend 40% more than web users; management concludes: 'The app causes people to spend more, let us spend $5M forcing everyone to download the app!' In reality, the high spenders were already your most loyal brand advocates before they downloaded the app (Selection Bias)! Today, we master Judea Pearl's Causal Revolution: Directed Acyclic Graphs (DAGs), Confounders, Colliders, Mediators, and the mind-bending phenomenon of Simpson's Paradox—where a trend present in every individual demographic subgroup completely reverses when the groups are combined!",
    "conceptInvariant": "Simpson's Paradox & Backdoor Criterion Invariant: Association does not equal causation when a backdoor path X <- Z -> Y exists via a confounding variable Z; conditioning on a confounder blocks the spurious correlation, whereas conditioning on a collider X -> C <- Y creates a false spurious association where none originally existed.",
    "failureMode": "A hospital analytics team analyzes two treatments for kidney stones; Treatment A has a higher success rate than Treatment B for small stones (93% vs 87%) AND a higher success rate for large stones (73% vs 69%); yet in aggregate, Treatment B has a higher overall success rate (83% vs 78%); the hospital promotes Treatment B, killing an optimal treatment due to Simpson's Paradox.",
    "tryItFriction": "Construct a Causal DAG & Simpson's Paradox Simulator in Python: generate synthetic patient/customer data with severe confounding (stone size / customer loyalty); compute aggregate vs subgroup correlations; visualize Simpson's reversal; construct a graphical DAG using networkx; apply Pearl's Backdoor Criterion to identify the exact adjustment set needed to isolate true causal effects.",
    "socraticHints": [
      "How can Treatment A be superior to Treatment B in every single subgroup, yet appear inferior in the overall aggregate data?",
      "Because doctors assigned the difficult, severe cases disproportionately to Treatment A, and easy cases to Treatment B.",
      "The underlying stone size (the confounding variable) dominates overall survival; failing to control for stone size allows the unbalanced case severity to flip the apparent aggregate success rate."
    ],
    "situationalPuzzle": {
      "scenario": "A university faces a sex bias lawsuit: aggregate data shows male applicants had a 44% admission rate, while female applicants had a 35% admission rate (p < 0.001). However, when department-level admissions were analyzed across all 6 departments, female applicants had an equal or higher admission rate in 4 of the 6 departments, and no department showed male bias. What explains this famous real-world paradox (UC Berkeley 1973)?",
      "options": [
        "The department-level data was corrupted and should be discarded.",
        "Simpson's Paradox caused by Confounding! Female candidates applied disproportionately to highly competitive departments with low overall admission rates (e.g., English, 10% admission), while male candidates applied to engineering departments with large quotas and high admission rates (75% admission). Controlling for department choice eliminates the gender bias!",
        "The university systematically favored male applicants in secret.",
        "Aggregating data always produces the most accurate causal conclusions."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is the historic UC Berkeley admissions case (Bickel et al., 1973). The apparent aggregate gender bias was entirely driven by a confounding variable: Choice of Department. Women applied in heavy numbers to humanities departments with very low acceptance rates, while men applied in heavy numbers to engineering departments with high acceptance rates. Within individual departments, women were admitted at equal or slightly higher rates than men. Evaluating aggregate data without conditioning on the confounding variable produced an entirely false causal conclusion."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of Judea Pearl's Causal DAGs & The Backdoor Criterion",
        "type": "concept",
        "description": "Formulate the mathematics of structural causal models (SCM); define d-separation in Directed Acyclic Graphs; derive Pearl's Backdoor Criterion: an adjustment set Z blocks all backdoor paths between treatment X and outcome Y without containing any descendants of X; explain collider stratification bias.",
        "rubric": "Draw and explain Fork (X <- Z -> Y), Chain (X -> M -> Y), and Inverted Fork / Collider (X -> C <- Y) structures; prove why conditioning on a collider induces Berkson's bias; write the formal do-calculus adjustment formula P(Y | do(X))."
      },
      {
        "title": "The Marketing Ad Attribution Selection Bias Forensic Audit",
        "type": "detective",
        "description": "Audit an enterprise brand's paid search retargeting campaign: the agency claimed a staggering 18x ROAS (Return on Ad Spend) for users who clicked branded search ads; prove that 96% of these users were already navigating to the company website to buy (Intent was the confounder); demonstrate that true causal incremental ROAS was only 1.1x, saving the company $12M in wasted ad spend.",
        "rubric": "Model the causal DAG: Brand Search Ad -> Purchase, with User Purchase Intent as the parent confounder; calculate the difference between correlational ROAS and causal incremental ROAS; design a randomized geo-holdout experiment."
      },
      {
        "title": "Causal Graph Inference & Simpson's Paradox Engine",
        "type": "mastery",
        "description": "Develop a causal inference analytics module in Python: generate multi-variable datasets demonstrating Simpson's Paradox; use networkx to construct causal DAGs; implement automated d-separation checks to identify valid covariate adjustment sets; compute propensity scores and Inverse Probability Weighting (IPW) to recover true causal treatment effects.",
        "rubric": "Clean implementation of causal DAG validation; calculation of unadjusted vs backdoor-adjusted effect estimates; generate visual DAG plots with highlighted backdoor paths."
      },
      {
        "title": "The Human Resources Gender Pay Equity Boardroom War Room",
        "type": "incident",
        "description": "Lead an enterprise compensation equity review: an employee union presents an aggregate dataset showing male executives earn 22% higher average base salary than female executives, threatening litigation; conduct an objective econometric mediation analysis controlling for job level, tenure, geographic location, and performance rating; separate legitimate structural wage gaps from potential career progression promotion discrimination.",
        "rubric": "Formulate the wage decomposition model (Oaxaca-Blinder decomposition); distinguish between within-grade pay parity and between-grade promotional velocity disparities; deliver an authoritative, transparent board remediation plan."
      }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "Ordinary Least Squares (OLS) Regression & Gauss-Markov BLUE Physics",
    "stageName": "Stage 1: Statistical Foundations, Data Wrangling & Exploratory Business Analytics",
    "stageNum": 1,
    "pedagogicalRole": "Econometric Foundations & Classical Linear Model Physics",
    "spokenGoal": "Regression analysis is the workhorse of business econometrics. Whether predicting sales from advertising spend or estimating price elasticity, Ordinary Least Squares (OLS) finds the unique line that minimizes the sum of squared residuals: min sum(y_i - y_hat_i)^2. But why is OLS the universal benchmark? Because of the monumental Gauss-Markov Theorem! If the classical assumptions hold (linearity, random sampling, zero conditional mean of errors E[u|X]=0, no multicollinearity, and homoskedasticity), OLS is the Best Linear Unbiased Estimator (BLUE)—no other linear estimator has smaller variance! Today, we master closed-form matrix OLS: beta = (X^T * X)^(-1) * X^T * y, residual diagnostics, and R-squared vs Adjusted R-squared.",
    "conceptInvariant": "Gauss-Markov BLUE Invariant: Under the classical assumptions of the linear regression model, the Ordinary Least Squares estimator beta_hat = (X^T * X)^(-1) * X^T * y is the Best Linear Unbiased Estimator (BLUE); its sampling variance is strictly smaller than that of any other linear unbiased estimator.",
    "failureMode": "An analytics manager adds 45 irrelevant variables into a sales regression model; the raw R-squared artificially climbs from 0.65 to 0.88; the manager brags about 'superior model fit'; in reality, Adjusted R-squared collapsed, standard errors exploded, and the model catastrophically overfits, failing completely on out-of-sample sales forecasts.",
    "tryItFriction": "Implement an OLS Matrix Regression Engine from Scratch in Python using pure numpy: compute beta = (X^T * X)^(-1) * X^T * y; calculate the variance-covariance matrix of estimators Var(beta) = s^2 * (X^T * X)^(-1); extract standard errors, t-statistics, p-values, R-squared, and Adjusted R-squared; verify that numpy results match statsmodels to 8 decimal places.",
    "socraticHints": [
      "Why does raw R-squared always increase (or stay constant) whenever you add another explanatory variable, even if the variable is completely useless random noise?",
      "Because OLS mathematically minimizes the sum of squared residuals; adding a variable gives the optimizer an additional degree of freedom to fit the sample noise.",
      "Adjusted R-squared imposes a mathematical penalty for every additional parameter k: Adj_R^2 = 1 - [ (1 - R^2)*(n - 1)/(n - k - 1) ]; it only increases if the new variable improves the model by more than what would be expected by random chance."
    ],
    "situationalPuzzle": {
      "scenario": "A retailer regresses monthly store revenue (Y, in $1000s) on local digital ad spend (X, in $1000s). The estimated model is: Revenue = 50 + 4.2 * Ad_Spend. R-squared = 0.72. Standard error of the slope coefficient is SE(beta_1) = 0.60. Sample size N = 62. What is the interpretation of the slope, the t-statistic, and does advertising spend have a statistically significant effect on revenue at the 5% level?",
      "options": [
        "Slope means $1 of ad spend generates $50 of revenue; t = 4.2; not significant.",
        "Slope means every $1,000 increase in ad spend increases revenue by $4,200. The t-statistic is t = 4.2 / 0.60 = 7.00. Because 7.00 >> 1.96 (critical t for df=60), ad spend is MASSIVELY statistically significant (p < 0.0001)!",
        "Slope means ad spend has a 4.2% return on investment.",
        "R-squared of 0.72 means the model is invalid."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In linear regression Y = beta_0 + beta_1 * X: 1) The slope beta_1 = 4.2 indicates that for every unit increase in X ($1,000 in ad spend), expected revenue Y increases by 4.2 units ($4,200 in revenue). 2) The t-statistic tests the null hypothesis H0: beta_1 = 0: t = (beta_1 - 0) / SE(beta_1) = 4.2 / 0.60 = 7.00. 3) For a two-tailed test at alpha = 0.05 with df = 62 - 2 = 60, the critical t-value is approximately 2.00. A t-statistic of 7.00 corresponds to a p-value of less than 0.0000001, providing overwhelming statistical evidence that digital advertising drives retail store revenue."
    },
    "quests": [
      {
        "title": "Mathematical Proof of the Gauss-Markov Theorem & OLS Matrix Derivation",
        "type": "concept",
        "description": "Derive the normal equations and the closed-form matrix OLS estimator beta = (X^T * X)^(-1) * X^T * y by minimizing the sum of squared errors e^T * e; prove that beta is unbiased (E[beta] = beta); prove the Gauss-Markov theorem showing Var(beta_tilde) - Var(beta_OLS) is positive semi-definite for any other linear unbiased estimator.",
        "rubric": "Step-by-step matrix calculus derivation; prove unbiasedness using E[u|X] = 0; derive the covariance matrix Var(beta); provide complete algebraic proof of Gauss-Markov minimum variance property."
      },
      {
        "title": "The Omitted Variable Bias (OVB) Econometric Forensic Audit",
        "type": "detective",
        "description": "Audit an econometric study estimating the return to college education: the researcher regressed Wage on Years of Education and estimated an 11% return per year; prove that omitting 'Innate Ability' (which correlates positively with both education and wage) created severe Omitted Variable Bias: Bias = beta_ability * Cov(Education, Ability) / Var(Education); calculate the true unbiased return (7%).",
        "rubric": "Formulate the OVB algebraic equation; demonstrate the direction of bias based on covariance signs; show how omitted variable bias destroys the causal validity of OLS coefficients."
      },
      {
        "title": "Scratch Matrix OLS Regression & Diagnostic Suite",
        "type": "mastery",
        "description": "Build a complete OLS econometric regression engine from scratch in Python using pure numpy: support multiple independent variables and constant terms; compute beta vector, residual vector, residual variance s^2, coefficient standard errors, t-statistics, p-values via Student-t CDF, F-statistic, R^2, and Adjusted R^2; format output into professional econometric summary tables.",
        "rubric": "Pure numpy implementation (no statsmodels or sklearn shortcuts); exact numerical precision matching institutional software; automated generation of ANOVA regression table and residual diagnostic plots."
      },
      {
        "title": "The Spurious Correlation Macaroni & Drowning War Room",
        "type": "incident",
        "description": "Intervene in an executive committee disaster: an analyst discovers an R-squared of 0.94 between company quarterly software revenue and national cheese consumption; the analyst presents this as evidence of an economic leading indicator; execute Granger causality tests and cointegration tests (Engle-Granger) to prove the relationship is pure non-stationary spurious drift, protecting the board from making bizarre commercial bets.",
        "rubric": "Demonstrate the spurious regression phenomenon (Yule 1926); show how non-stationary trending series produce high t-stats and high R^2 with low Durbin-Watson statistics; demonstrate differencing to eliminate spurious correlation."
      }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "Multiple Regression Diagnostics: Multicollinearity (VIF) & Heteroskedasticity",
    "stageName": "Stage 1: Statistical Foundations, Data Wrangling & Exploratory Business Analytics",
    "stageNum": 1,
    "pedagogicalRole": "Econometric Diagnostic Physics & Robust Standard Errors",
    "spokenGoal": "A regression model can report a high R-squared and statistically significant F-statistic, while every single individual coefficient is completely corrupted. Welcome to the diagnostic reality of econometrics! Today, we master the two most common afflictions of real-world business data: Multicollinearity and Heteroskedasticity. When explanatory variables are highly correlated (e.g., ad spend on Google vs Meta), Multicollinearity inflates standard errors, causing Variance Inflation Factors (VIF) to spike above 5 or 10. When residual variance is non-constant across observations (Heteroskedasticity), OLS standard errors are biased, causing false statistical significance. We master the Breusch-Pagan test and Halbert White's Robust Standard Errors (HC1/HC3) to restore econometric integrity!",
    "conceptInvariant": "White's Heteroskedasticity-Consistent Invariant: In the presence of heteroskedasticity (Var(u_i | X_i) = sigma_i^2 != constant), OLS coefficient estimates remain unbiased and consistent, but standard OLS standard errors are invalid; White's Heteroskedasticity-Consistent Covariance Estimator (X^T * X)^(-1) * (X^T * Omega * X) * (X^T * X)^(-1) provides asymptotically valid standard errors without requiring knowledge of the specific heteroskedastic functional form.",
    "failureMode": "A banking analyst models mortgage defaults using loan size; residual variance explodes for large loans (heteroskedasticity); using conventional OLS standard errors, the analyst reports a key risk factor as 'statistically insignificant' (p = 0.08); recalculating with White robust standard errors reveals true p = 0.003; the bank misses a massive lending risk.",
    "tryItFriction": "Construct a Comprehensive Econometric Diagnostic Suite in Python: ingest multi-variable financial data; compute Variance Inflation Factors (VIF) for all predictors; execute the Breusch-Pagan and White tests for heteroskedasticity; compute White Robust Standard Errors (HC3); plot residual vs fitted scatter charts to visually diagnose heteroskedastic funnels.",
    "socraticHints": [
      "What is the mathematical definition of Variance Inflation Factor (VIF)?",
      "For variable j, VIF_j = 1 / (1 - R_j^2), where R_j^2 is the R-squared from regressing variable j on all other independent variables in the model.",
      "If other variables explain 90% of variable j's variance (R_j^2 = 0.90), VIF_j = 1 / (1 - 0.90) = 10; its variance is inflated by 10x, making it nearly impossible to determine its individual impact."
    ],
    "situationalPuzzle": {
      "scenario": "A retailer regresses sales on three marketing channels: Facebook Spend, Instagram Spend, and Google Search Spend. The model has an overall R-squared of 0.85 and an F-statistic p-value of 0.0001 (the model is highly predictive). However, the individual t-tests for Facebook (p = 0.42) and Instagram (p = 0.38) are both completely insignificant! The CMO says: 'Neither Facebook nor Instagram works, cancel both.' What is the true diagnosis?",
      "options": [
        "The CMO is correct; both channels should be shut down.",
        "Classic Severe Multicollinearity! Facebook Spend and Instagram Spend are almost perfectly correlated (rho = 0.94), because the agency scaled both budgets simultaneously. Their VIFs exceed 12.0! The model knows social media drives sales, but cannot separate which dollar came from which app. Dropping both would destroy company revenue!",
        "The model is invalid due to heteroskedasticity.",
        "R-squared of 0.85 indicates data fraud."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is the textbook signature of severe multicollinearity: a high overall model R-squared and statistically significant F-test, accompanied by statistically insignificant individual t-tests for collinear variables. Facebook and Instagram budgets were scaled together, causing high mutual correlation. The OLS algorithm cannot cleanly attribute which portion of sales belongs to Facebook versus Instagram, blowing up their standard errors and driving t-statistics to zero. The CMO should combine them into a single 'Total Meta Spend' variable or use Ridge regression rather than foolishly canceling working marketing channels."
    },
    "quests": [
      {
        "title": "Mathematical Derivation of VIF & White's Heteroskedasticity Covariance Estimator",
        "type": "concept",
        "description": "Derive the Variance Inflation Factor formula VIF_j = 1 / (1 - R_j^2); prove that Var(beta_j) = (sigma^2 / SST_j) * VIF_j; derive White's Heteroskedasticity-Consistent Covariance Estimator ('Sandwich Estimator') Var_HC = (X^T * X)^(-1) * (sum e_i^2 * x_i * x_i^T) * (X^T * X)^(-1); explain the Breusch-Pagan Lagrange Multiplier test.",
        "rubric": "Detail the full mathematical derivation of VIF; prove why collinearity inflates standard errors; derive the sandwich estimator showing how the middle matrix Omega captures non-constant residual variances."
      },
      {
        "title": "The Funnel Residual Heteroskedastic Wealth Inequity Forensic Audit",
        "type": "detective",
        "description": "Audit an econometric study estimating executive compensation across firm sizes: analyze how residual variance expands dramatically for mega-cap firms (the classic funnel shape); prove how unadjusted OLS underestimated standard errors for CEO performance pay coefficients by 45%, leading to false public claims of incentive alignment.",
        "rubric": "Execute Breusch-Pagan test regressing squared residuals on firm size; calculate LM test statistic (n * R^2); re-estimate standard errors using White HC3; demonstrate the reversal of statistical significance."
      },
      {
        "title": "Automated Econometric Diagnostic & Robust Estimation Suite",
        "type": "mastery",
        "description": "Build an enterprise regression diagnostic platform in Python using statsmodels: automatically compute VIF for all features; execute Durbin-Watson autocorrelation test, Breusch-Pagan heteroskedasticity test, and Jarque-Bera residual normality test; re-estimate model coefficients using OLS with HC3 robust standard errors and Feasible Generalized Least Squares (FGLS); generate diagnostic visual dashboards.",
        "rubric": "Clean, automated pipeline outputting a complete econometric diagnostic report; automated flags for VIF > 5 and BP p-value < 0.05; multi-panel visual plots of residuals vs fitted values and scale-location plots."
      },
      {
        "title": "The High-Collinearity Ad Attribution Boardroom War Room",
        "type": "incident",
        "description": "Resolve an executive committee conflict: the Head of Search and Head of Social accuse each other of wasting marketing capital because a collinear regression model showed zero significance for both departments; implement Ridge Regression (L2 regularization) and Principal Component Regression to stabilize coefficient estimates and establish fair revenue attribution across both channels.",
        "rubric": "Formulate Ridge penalty (beta = (X^T * X + lambda * I)^(-1) * X^T * y); demonstrate how adding small lambda diagonal bias shrinks variance and eliminates multicollinearity instability; present a unified marketing attribution compromise to the CEO."
      }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "Non-Linear Modeling & Specification Diagnostics: Elasticities & Ramsey RESET",
    "stageName": "Stage 1: Statistical Foundations, Data Wrangling & Exploratory Business Analytics",
    "stageNum": 1,
    "pedagogicalRole": "Non-Linear Econometrics & Functional Form Physics",
    "spokenGoal": "The real business world is rarely a straight line. Diminishing marginal returns, network effect compounding, and price sensitivity are inherently non-linear. Today, we master Functional Form Specification in econometrics: Polynomial Regression (modeling quadratic inverted-U curves like employee performance vs stress), Interaction Terms (how the impact of price depends on brand equity), and Logarithmic Transformations! Crucially, we master Econometric Elasticities: in a Log-Log model (ln(Y) = beta_0 + beta_1 * ln(X)), beta_1 directly represents the Constant Elasticity—the percentage change in Y for a 1% change in X! We also master the Ramsey RESET test to detect model misspecification.",
    "conceptInvariant": "Constant Elasticity Log-Log Invariant: In the double-logarithmic regression model ln(Y) = beta_0 + beta_1 * ln(X) + u, the coefficient beta_1 is scale-invariant and represents the exact economic elasticity: beta_1 = (dY / Y) / (dX / X) = %Delta Y / %Delta X; a 1% change in X produces a beta_1% change in Y across all levels of the variable.",
    "failureMode": "An airline pricing analyst fits a simple linear model to ticket demand: Sales = 1,000 - 0.5 * Price; the model predicts demand drops by 0.5 tickets per dollar regardless of whether the price is $50 or $5,000; at $5,000, demand is wildly miscalculated; switching to a Log-Log constant elasticity model reveals an elasticity of -1.8, rescuing route pricing.",
    "tryItFriction": "Build an Econometric Elasticity & Specification Engine in Python: take price and sales transaction data; fit Linear (Level-Level), Semi-Log (Log-Level, Level-Log), and Log-Log models; compute marginal effects and price elasticities; execute the Ramsey RESET test (testing powers of fitted values y_hat^2, y_hat^3); output model specification recommendations.",
    "socraticHints": [
      "How do you interpret the coefficient beta_1 in a Semi-Log (Log-Level) model: ln(Y) = beta_0 + beta_1 * X?",
      "In a Log-Level model, a one-unit change in X leads to an approximate (beta_1 * 100)% percentage change in Y.",
      "For exact percentage change: %Delta Y = (e^beta_1 - 1) * 100; this is standard for modeling wage growth over years of experience or compound sales growth over time."
    ],
    "situationalPuzzle": {
      "scenario": "A ride-hailing company models monthly driver rides (Y) as a function of driver incentive bonus (X, in dollars). An analyst estimates a quadratic model: Rides = 20 + 0.80 * Bonus - 0.002 * Bonus^2. At what bonus level does the marginal return of additional incentives become negative (the optimal tipping point)?",
      "options": [
        "Bonus = $80.",
        "Take the derivative d(Rides)/d(Bonus) = 0.80 - 0.004 * Bonus = 0 => 0.004 * Bonus = 0.80 => Bonus = $200! Below $200, bonuses increase rides; above $200, driver fatigue causes diminishing returns and ride counts decline!",
        "Bonus = $400.",
        "Quadratic regressions cannot identify economic tipping points."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In polynomial quadratic regression Y = beta_0 + beta_1 * X + beta_2 * X^2: The marginal effect is dY/dX = beta_1 + 2 * beta_2 * X. Setting the marginal effect to zero finds the inflection point: 0.80 - 2 * 0.002 * Bonus = 0 => 0.80 - 0.004 * Bonus = 0 => Bonus = 0.80 / 0.004 = $200.00. Because beta_2 is negative (-0.002), the curve is an inverted-U parabola. Up to a $200 bonus, higher incentives increase driver engagement; beyond $200, driver fatigue sets in or drivers hit income targets early and stop driving. Paying bonuses above $200 wastes money and destroys operational efficiency."
    },
    "quests": [
      {
        "title": "Mathematical Derivations of Four Logarithmic Regression Models & Ramsey RESET",
        "type": "concept",
        "description": "Derive the mathematical interpretation of coefficients across all four regression functional forms: Level-Level (dy/dx = beta), Level-Log (dy/d(ln x) = beta/100), Log-Level (%dy/dx = 100*beta), and Log-Log (%dy/%dx = beta); formulate the Ramsey Regression Equation Specification Error Test (RESET) using auxiliary regressions on y_hat^2 and y_hat^3.",
        "rubric": "Detail calculus derivatives for all four models; show exact vs approximate percentage change formulas; formulate the RESET F-test testing H0: gamma_1 = gamma_2 = 0 in y = X*beta + gamma_1*y_hat^2 + gamma_2*y_hat^3 + u."
      },
      {
        "title": "The Price Elasticity Revenue Optimization Forensic Audit",
        "type": "detective",
        "description": "Audit a streaming media subscription price hike: the company raised prices from $10 to $13 (+30%) assuming inelastic demand (elasticity = -0.4); unearth that the analyst fitted an unconstrained linear model; demonstrate that a Log-Log model with interaction terms reveals demand was actually highly elastic (-1.6) in international emerging markets, causing a $45M revenue collapse.",
        "rubric": "Extract subscription cancellation telemetry; fit Log-Log price demand curve; compute revenue marginal condition dRev/dP = Q * (1 + E_d); prove that raising prices on elastic goods mathematically destroys gross revenue."
      },
      {
        "title": "Non-Linear Econometric Modeling & Elasticity Engine",
        "type": "mastery",
        "description": "Build an enterprise non-linear econometric modeling platform in Python: fit polynomial models, interaction models, and all four log-transformed models; compute point and arc price elasticities; implement automated Ramsey RESET test; generate marginal effect plots displaying non-linear inflection points.",
        "rubric": "Implement all functional forms in statsmodels; automated execution of Ramsey RESET test with F-test p-value reporting; generate publication-grade matplotlib curves showing non-linear marginal effects and 95% confidence bands."
      },
      {
        "title": "The Diminishing Returns Marketing Budget Allocation War Room",
        "type": "incident",
        "description": "Optimize an enterprise $50M marketing budget across 4 global regions: digital ad performance exhibits extreme diminishing marginal returns (modeled via Cobb-Douglas production function / log-transformed channels); the board demands the exact mathematical capital allocation that maximizes global incremental revenue; formulate the Lagrange multiplier optimization allocating funds where marginal revenue per dollar is equalized across all regions.",
        "rubric": "Formulate the optimization problem max sum(alpha_i * ln(Spend_i)) subject to sum(Spend_i) = $50M; solve using Lagrange multipliers; prove that equalizing marginal return per dollar generates $8.4M higher revenue than proportional budget splits."
      }
    ]
  },
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Categorical Modeling & Logistic Regression: Odds Ratios, ROC-AUC & Precision-Recall",
    "stageName": "Stage 1: Statistical Foundations, Data Wrangling & Exploratory Business Analytics",
    "stageNum": 1,
    "pedagogicalRole": "Binary Classification Econometrics & Maximum Likelihood Physics",
    "spokenGoal": "In business analytics, our outcome variable is frequently binary: Will the customer churn (1 or 0)? Will the borrower default (1 or 0)? Will the prospect buy (1 or 0)? If you fit a linear regression (Linear Probability Model) to binary data, you get predictions below 0% and above 100%—a mathematical absurdity! Today, we master Logistic Regression: using the Logit link function to map any linear combination of predictors into a bounded probability interval [0, 1]: p = 1 / (1 + e^(-z)). We will derive Odds Ratios, solve coefficients via Maximum Likelihood Estimation (MLE), and master institutional evaluation metrics: Confusion Matrices, ROC-AUC (Area Under the Receiver Operating Characteristic Curve), and Precision-Recall curves under severe class imbalance.",
    "conceptInvariant": "Logit Transformation Odds Ratio Invariant: In logistic regression ln(p / (1 - p)) = beta_0 + beta_1 * X, the exponentiated coefficient e^(beta_1) represents the exact Odds Ratio: for every 1-unit increase in X, the odds of the event occurring (p / (1 - p)) are multiplied by e^(beta_1); odds ratios are strictly non-linear in probability space.",
    "failureMode": "A bank uses accuracy (99.2%) to evaluate a credit card fraud detection model; because real fraud occurs in only 0.8% of transactions, a useless dummy model that predicts 'NO FRAUD' for every single transaction achieves 99.2% accuracy; the model misses 100% of actual fraud cases, allowing $35M in criminal transactions to clear.",
    "tryItFriction": "Construct a Production-Grade Logistic Regression & ROC Engine in Python: ingest customer churn transaction data; fit logistic regression via Maximum Likelihood Estimation; compute odds ratios and 95% confidence intervals; generate ROC curves and calculate ROC-AUC; generate Precision-Recall curves; tune the classification threshold to maximize business profit under asymmetric error costs.",
    "socraticHints": [
      "What is the difference between Probability and Odds?",
      "Probability is the ratio of favorable outcomes to all outcomes: p = Successes / Total.",
      "Odds is the ratio of favorable outcomes to unfavorable outcomes: Odds = p / (1 - p); if probability is 80% (0.80), odds are 0.80 / 0.20 = 4 to 1 (4.0)."
    ],
    "situationalPuzzle": {
      "scenario": "A telecom company estimates customer churn using logistic regression. For the variable 'Customer Service Calls Last Month' (X), the estimated coefficient is beta_1 = +0.693. What is the Odds Ratio associated with each additional customer service call, and how does each call impact customer churn?",
      "options": [
        "Each call increases churn probability by 69.3%.",
        "The Odds Ratio is e^(0.693) = 2.00! For every additional call to customer service, the ODDS of the customer churning EXACTLY DOUBLE (+100% increase in odds)!",
        "Each call reduces churn because the customer received help.",
        "Odds ratios cannot be calculated from logistic regression coefficients."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In logistic regression, the coefficient beta represents the change in the log-odds for a one-unit increase in the predictor. To interpret the economic impact, we exponentiate the coefficient: Odds Ratio = e^(beta_1) = e^(0.69315) = 2.00. This means each additional customer service call multiplies the odds of customer churn by 2.00 (doubling the churn odds). If a customer's baseline churn odds were 1 to 4 (20% probability), making one support call increases their odds to 2 to 4 (33.3% probability), and two calls increases odds to 4 to 4 (50% probability). A powerful diagnostic for churn prediction."
    },
    "quests": [
      {
        "title": "Mathematical Derivations of Logistic Regression, MLE & Odds Ratios",
        "type": "concept",
        "description": "Derive the logit link function from the logistic sigmoid distribution p(z) = 1 / (1 + e^(-z)); formulate the Likelihood and Log-Likelihood functions for Bernoulli binary outcomes; prove that the gradient of the log-likelihood equals X^T * (y - p); derive the Newton-Raphson Iteratively Reweighted Least Squares (IRLS) optimization algorithm.",
        "rubric": "Step-by-step mathematical derivation of log-likelihood; derive first derivative score vector and second derivative Hessian matrix; prove that the Hessian is negative semi-definite (guaranteeing a unique global maximum); derive the exact odds ratio formula."
      },
      {
        "title": "The Imbalanced Class Accuracy Paradox Fraud Forensic Audit",
        "type": "detective",
        "description": "Audit an algorithmic transaction monitoring system: the vendor claimed '99.9% model accuracy'; demonstrate how the 99.9% metric was driven entirely by the massive 99.9% non-fraud majority class (the Accuracy Paradox); calculate true Precision (12%) and Recall (45%); quantify the $8.2M fraud leakage caused by evaluating an imbalanced model on raw accuracy.",
        "rubric": "Construct the complete confusion matrix; compute Precision, Recall, F1-Score, and Specificity; demonstrate why the Precision-Recall Area Under Curve (PR-AUC) is the only valid metric for severe class imbalance."
      },
      {
        "title": "Full-Stack Logistic Regression & Asymmetric Cost Optimization Suite",
        "type": "mastery",
        "description": "Build an enterprise customer propensity and churn scoring suite in Python: fit logistic regression with statsmodels and scikit-learn; compute Odds Ratios, Wald test p-values, and Pseudo R^2 (McFadden's R^2); generate ROC-AUC and Precision-Recall curves; implement an optimal probability threshold tuner that minimizes total business cost given user-defined False Positive and False Negative dollar costs.",
        "rubric": "Clean object-oriented implementation; calculation of McFadden pseudo-R^2; automated threshold optimization curve finding the cost-minimizing decision threshold; generate visual ROC and PR curves with highlighted operating points."
      },
      {
        "title": "The High-Stakes Loan Approval Disparate Impact War Room",
        "type": "incident",
        "description": "Manage an algorithmic lending compliance audit: an automated credit card approval logistic regression model approves 75% of majority applicants but only 45% of minority applicants, violating the US EEOC / CFPB 'Four-Fifths Rule' (Disparate Impact ratio = 45/75 = 0.60 < 0.80); evaluate model features for proxy discrimination (e.g., zip codes, education tier) and retrain a fair lending model that eliminates disparate impact while maintaining risk separation.",
        "rubric": "Formulate the Four-Fifths disparate impact compliance metric; identify proxy variables correlating with protected attributes; implement fair lending threshold adjustments (Equalized Odds / Demographic Parity) satisfying regulatory scrutiny."
      }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "Customer Segmentation Analytics: RFM Modeling, K-Means Clustering & Silhouette Scores",
    "stageName": "Stage 1: Statistical Foundations, Data Wrangling & Exploratory Business Analytics",
    "stageNum": 1,
    "pedagogicalRole": "Unsupervised Learning & Behavioral Segmentation Physics",
    "spokenGoal": "Treating all customers the same is a guaranteed way to waste marketing capital. A VIP customer who spent $10,000 last week requires an entirely different relationship than a customer who spent $15 three years ago and never returned. Today, we master Customer Segmentation Analytics: Arthur Hughes' classic RFM Framework (Recency: How recently did they buy? Frequency: How often do they buy? Monetary: How much did they spend?). Furthermore, we elevate from manual heuristic RFM rules to modern Machine Learning: Unsupervised K-Means Clustering! We will standardize features, solve the optimal number of clusters K using the Elbow Method and Silhouette Analysis, and translate mathematical clusters into actionable commercial strategies (Champions, Loyal Customers, At-Risk, Lost).",
    "conceptInvariant": "Silhouette Clustering Optimality Invariant: For any clustered observation i, the silhouette coefficient s(i) = (b(i) - a(i)) / max(a(i), b(i)) measures how well i is matched to its own cluster (intra-cluster distance a(i)) versus the nearest neighboring cluster (b(i)); a global average silhouette score approaching +1.0 indicates tight, well-separated natural business segments, while negative scores reveal misclustered overlap.",
    "failureMode": "A marketing team runs K-Means clustering on raw unstandardized customer data containing Customer Age (range 18–80) and Annual Spend (range $100–$50,000); because Euclidean distance is dominated by variables with massive numerical scales, the algorithm clusters customers ENTIRELY by Annual Spend and completely ignores age; the resulting 'segments' are useless for targeted marketing.",
    "tryItFriction": "Build an Enterprise RFM & K-Means Segmentation Engine in Python: take raw retail transaction logs; calculate Recency (days since last purchase), Frequency (order count), and Monetary value (total spend) per customer; apply StandardScaler / RobustScaler; execute K-Means clustering across K = 2 to 10; compute Silhouette Scores and Elbow SSE curves; map mathematical clusters into executive marketing personas.",
    "socraticHints": [
      "Why MUST numerical features always be standardized (e.g., Z-score standardization) before applying K-Means clustering?",
      "Because K-Means uses Euclidean distance: d(p, q) = sqrt(sum (p_i - q_i)^2).",
      "If one variable is measured in thousands of dollars ($1,000 to $100,000) and another is measured in units (1 to 5), the dollar variable will mathematically dominate the distance calculation by 10,000 to 1, rendering the other variable completely invisible."
    ],
    "situationalPuzzle": {
      "scenario": "A retailer segments 50,000 customers into RFM tiers. Segment Alpha has Recency = 4 days, Frequency = 28 orders/year, Monetary = $3,500. Segment Beta has Recency = 280 days, Frequency = 22 orders/year, Monetary = $4,200. What are the marketing personas of Segment Alpha versus Segment Beta, and what is the optimal commercial strategy for each?",
      "options": [
        "Both segments are identical high-value customers and should receive the same catalog.",
        "Segment Alpha is 'Champions / Loyal Active' (high frequency, high spend, active right now); nurture with VIP rewards. Segment Beta is 'At-Risk / Churning High-Value Customers' (used to buy frequently and spend heavily, but hasn't bought in 9 months!); launch an urgent win-back campaign with high-incentive personalized offers before they are lost forever!",
        "Segment Beta is dead; delete them from the database to save email costs.",
        "RFM scores cannot identify churning customers."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This highlights the immense power of RFM behavioral analytics. Segment Alpha represents active loyal champions: they bought 4 days ago, shop frequently, and spend heavily. Segment Beta represents the most dangerous, high-value problem in retail: 'At-Risk Whales'. They were historically major spenders (22 orders, $4,200), but have not made a single purchase in 280 days! They are actively defecting to a competitor or churning. Sending them a generic promotional catalog is useless; corporate marketing must deploy aggressive, personalized win-back offers (dedicated account manager outreach, high-value incentives) immediately."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of K-Means Optimization & Silhouette Coefficients",
        "type": "concept",
        "description": "Formulate the K-Means clustering objective function: minimize Within-Cluster Sum of Squares (WCSS) J = sum_{k=1}^K sum_{i in S_k} ||x_i - mu_k||^2; prove Lloyd's algorithm convergence; derive the mathematical formulation of the Silhouette coefficient s(i) = (b(i) - a(i)) / max(a(i), b(i)) and explain its geometric interpretation.",
        "rubric": "Step-by-step mathematical formulation of Lloyd's algorithm (Assignment and Update steps); prove that K-Means converges to a local minimum; derive Silhouette coefficient equations and explain why K-Means assumes spherical clusters."
      },
      {
        "title": "The Unscaled Variable Segmentation Distortion Forensic Audit",
        "type": "detective",
        "description": "Audit an enterprise SaaS company's automated customer tiering pipeline: identify how failing to scale feature inputs caused K-Means to cluster customers solely on 'Total API Calls' (millions) while completely ignoring 'Support Tickets' (single digits) and 'Contract Value'; demonstrate how a $250,000 enterprise client with high tickets was classified as 'Low Priority', resulting in contract cancellation.",
        "rubric": "Analyze Euclidean distance calculations across unstandardized scales; demonstrate mathematically how scale variance distorts cluster centroid assignments; formulate automated Z-score standardization checks in data pipelines."
      },
      {
        "title": "Enterprise RFM & K-Means Segmentation Engine",
        "type": "mastery",
        "description": "Build an end-to-end customer segmentation platform in Python: ingest raw transaction data; compute RFM metrics with quantile scoring (1-5); implement K-Means clustering with K-Means++ initialization; calculate inertia across K=2..10 to generate the Elbow curve; compute average Silhouette scores across all K; generate 3D scatter visualizations and an executive cluster persona profiling matrix.",
        "rubric": "Clean, vectorized data processing with pandas and scikit-learn; automated generation of Elbow plot and Silhouette plot; output actionable marketing segment summaries (Champions, Potential Loyalists, At Risk, Hibernating)."
      },
      {
        "title": "The Dynamic Customer Segment Migration War Room",
        "type": "incident",
        "description": "Manage an executive retention emergency: a retail conglomerate notices that its 'Champion' customer tier contracted by 18% over two consecutive quarters; build a Markov Chain Segment Migration Matrix tracking the quarter-over-quarter transition probabilities P(Segment_t+1 | Segment_t); identify which intermediate segment customers are leaking into and design an automated algorithmic early-warning intervention.",
        "rubric": "Formulate customer state transition probability matrices; compute steady-state long-term segment distributions; identify leading-indicator drop-off thresholds (e.g., Recency exceeding 45 days) that trigger automated CRM retention workflows."
      }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "Cohort Analysis, Churn Modeling & Net Retention Rate (NRR) Dynamics",
    "stageName": "Stage 1: Statistical Foundations, Data Wrangling & Exploratory Business Analytics",
    "stageNum": 1,
    "pedagogicalRole": "Longitudinal Customer Retention & SaaS Unit Economics Physics",
    "spokenGoal": "In recurring revenue businesses (SaaS, subscription consumer apps, telecom), the single most important determinant of enterprise valuation is Customer Retention. If you look only at aggregate monthly active users, new customer acquisition will mask a crumbling core. Today, we master Cohort Analysis: grouping customers by acquisition month and tracking their retention behavior across successive months (Month 0, Month 1, Month 2, ...). We will construct iconic Cohort Retention Heatmaps, derive Customer Lifetime (1 / Churn Rate), and master the holy grail of enterprise SaaS economics: Net Retention Rate (NRR = (Starting ARR + Expansion - Contraction - Churn) / Starting ARR). When NRR exceeds 100%, the business grows automatically even without acquiring a single new customer!",
    "conceptInvariant": "Net Retention Rate Compounding Invariant: When an enterprise achieves a Net Retention Rate (NRR) strictly greater than 100% (Negative Net Churn), revenue from existing customer cohorts expands over time through upgrades and cross-selling faster than customer cancellations erode it: Revenue_Cohort(t) = Revenue_0 * (NRR)^t; the business possesses self-sustaining exponential revenue expansion.",
    "failureMode": "A venture-backed SaaS company boasts a high 92% Annual Logo Retention rate (only 8% of customers cancel); an investor unearths that the 8% who canceled were the company's largest enterprise clients, while remaining clients downgraded contracts; true Net Retention Rate (NRR) was only 78%; the business was bleeding 22% of its revenue base every year, leading to a down-round valuation crash.",
    "tryItFriction": "Construct an Institutional Cohort Analysis & Retention Heatmap Engine in Python: ingest multi-year customer subscription invoice logs; assign acquisition cohort months; calculate monthly retention matrices for Logo Retention, Gross Revenue Retention (GRR), and Net Retention Rate (NRR); generate publication-grade triangular cohort heatmaps with seaborn.",
    "socraticHints": [
      "What is the difference between Logo Retention and Net Revenue Retention (NRR)?",
      "Logo Retention measures the percentage of customer ACCOUNTS retained: Retained Accounts / Starting Accounts.",
      "Net Revenue Retention measures the percentage of REVENUE retained from those accounts, including upsells, seat expansions, and downgrades; a company can lose logos while NRR expands if remaining customers spend more."
    ],
    "situationalPuzzle": {
      "scenario": "A B2B cloud software company starts Year 1 with $10,000,000 in Annual Recurring Revenue (ARR) across 100 enterprise customers. Over the year: 1) 10 customers cancel entirely ($1,000,000 churned ARR); 2) 15 customers downgrade ($500,000 contraction ARR); 3) 40 customers upgrade and buy more seats ($2,500,000 expansion ARR). Zero new customers are added. What is the company's Logo Retention Rate, Gross Revenue Retention (GRR), and Net Retention Rate (NRR)?",
      "options": [
        "Logo Retention = 90%, GRR = 90%, NRR = 100%.",
        "Logo Retention = 90% (90/100). Gross Revenue Retention GRR = ($10M - $1M - $0.5M) / $10M = 85.0%. Net Retention Rate NRR = ($10M + $2.5M - $0.5M - $1.0M) / $10M = $11.0M / $10.0M = 110.0%! The business expanded revenue by 10% from existing customers alone!",
        "Logo Retention = 80%, GRR = 75%, NRR = 120%.",
        "NRR cannot be calculated without new customer acquisition."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us calculate all three unit economics metrics: 1) Logo Retention = (100 - 10 canceled) / 100 = 90.0%. 2) Gross Revenue Retention (GRR): GRR measures retained revenue EXCLUDING expansion: GRR = (Starting ARR - Churn - Contraction) / Starting ARR = ($10M - $1M - $0.5M) / $10M = $8.5M / $10M = 85.0% (GRR can never exceed 100%). 3) Net Retention Rate (NRR): NRR includes expansions: NRR = (Starting ARR + Expansion - Contraction - Churn) / Starting ARR = ($10.0M + $2.5M - $0.5M - $1.0M) / $10.0M = $11.0M / $10.0M = 110.0%. An NRR of 110% represents negative net churn—the gold standard of SaaS valuation. Public SaaS companies with NRR > 120% trade at massive valuation multiple premiums."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of Cohort Retention Curves & Steady-State LTV",
        "type": "concept",
        "description": "Formulate the mathematical modeling of cohort retention decay curves: Exponential Decay R(t) = e^(-lambda * t) vs Power-Law Decay R(t) = (1 + t)^(-alpha); derive Customer Lifetime CLT = int_0^inf R(t) dt; prove why Power-Law retention yields dramatically higher Customer Lifetime Value than Exponential decay under flattening long-term cohorts.",
        "rubric": "Step-by-step calculus integration of retention curves; prove CLT = 1 / lambda for exponential decay; explain why empirical SaaS cohorts flatten into asymptotic plateaus, rendering simple 1/churn formulas inaccurate."
      },
      {
        "title": "The Leaky Bucket SaaS Valuation Illusion Forensic Audit",
        "type": "detective",
        "description": "Audit an enterprise software firm pitching an IPO: top-line revenue grew from $20M to $50M (+150%) over two years; construct the underlying cohort retention heatmap to expose that historic cohorts suffered a 65% NRR (bleeding 35% revenue annually); prove that the growth was an unsustainable 'leaky bucket' fueled by unsustainable venture-funded sales subsidies that burned $40M cash.",
        "rubric": "Reconstruct historical cohort revenue tables; calculate cohort-level GRR and NRR degradation; demonstrate how top-line ARR growth masked fundamental product-market fit failure."
      },
      {
        "title": "Enterprise Cohort Analytics & Heatmap Visualization Suite",
        "type": "mastery",
        "description": "Build an automated cohort analytics platform in Python: ingest raw subscription billing logs; compute monthly cohort retention matrices for user counts, gross revenue, and expansion revenue; calculate month-over-month retention decay parameters; generate publication-grade triangular cohort heatmaps with color gradients and percentage labels.",
        "rubric": "Vectorized cohort matrix transformation with pandas (pivot tables and index offsets); automated calculation of Logo Retention, GRR, and NRR; generate styled seaborn heatmap with formatted percentage text."
      },
      {
        "title": "The Post-Price Increase Cohort Churn Shock War Room",
        "type": "incident",
        "description": "Handle an executive subscription crisis: after a 20% across-the-board price increase, Month 1 churn spikes by 300% in legacy cohorts; the board threatens to roll back the price increase; model cohort elasticity and long-term NRR: prove that if churn stabilizes after the initial one-time shock, the higher pricing yields higher long-term cohort cash flow; formulate customer success interventions to preserve net ARR.",
        "rubric": "Model immediate price shock churn vs steady-state retention; calculate the break-even churn threshold: Churn_new <= Churn_old + Price_Increase / (1 + Price_Increase); present an executive cohort stabilization strategy to the board."
      }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "Dimensionality Reduction: Principal Component Analysis (PCA) & Factor Analytics",
    "stageName": "Stage 1: Statistical Foundations, Data Wrangling & Exploratory Business Analytics",
    "stageNum": 1,
    "pedagogicalRole": "Unsupervised Feature Extraction & Eigen-Decomposition Physics",
    "spokenGoal": "In modern business analytics, datasets are overwhelmed by the Curse of Dimensionality: hundreds of customer survey questions, macroeconomic indicators, and website engagement metrics that are hopelessly correlated with each other. If you throw 100 correlated variables into a regression, multicollinearity destroys your model. Today, we master Principal Component Analysis (PCA): an unsupervised mathematical transformation that projects high-dimensional data onto orthogonal, uncorrelated axes that capture the maximum possible variance! We will derive Eigenvalues and Eigenvectors of the covariance matrix, construct Scree Plots, apply Kaiser's Criterion (Eigenvalue > 1.0), and analyze Customer Perception Factor Biplots.",
    "conceptInvariant": "Spectral Decomposition Maximum Variance Invariant: In Principal Component Analysis, the first principal component PC1 = X * v_1 is the linear combination of standardized features that maximizes variance subject to ||v_1|| = 1; the eigenvector v_1 corresponds to the largest eigenvalue lambda_1 of the covariance matrix Sigma, and all successive principal components are strictly orthogonal: Cov(PC_i, PC_j) = 0 for all i != j.",
    "failureMode": "A customer experience team runs a 60-question customer satisfaction survey; they attempt to build a linear churn model using all 60 questions; extreme collinearity between questions (e.g., 'helpful staff' vs 'friendly staff') makes coefficients uninterpretable and erratic; using PCA reduces the 60 questions to 3 clear orthogonal factors (Product Quality, Customer Support, Pricing Fairness), creating an accurate, interpretable model.",
    "tryItFriction": "Build a Principal Component Analysis Engine from Scratch in Python using pure numpy: standardize a multi-variable business dataset; compute the sample covariance matrix; execute eigen-decomposition (np.linalg.eig); sort eigenvalues and eigenvectors in descending order; compute Explained Variance Ratio; generate Scree Plots and 2D customer biplots.",
    "socraticHints": [
      "What does an Eigenvalue represent in Principal Component Analysis?",
      "An eigenvalue lambda_k represents the total amount of variance captured by the k-th principal component.",
      "The sum of all eigenvalues equals the total variance of the dataset; the Explained Variance Ratio for component k is simply lambda_k / sum(lambda)."
    ],
    "situationalPuzzle": {
      "scenario": "A marketing research team conducts PCA on 10 correlated customer perception survey questions. The covariance matrix has a total trace (sum of eigenvalues) of 10.0. The first three eigenvalues are: lambda_1 = 5.2, lambda_2 = 2.1, and lambda_3 = 1.2. The remaining 7 eigenvalues are all less than 0.4. How many principal components should the team retain, and what percentage of total survey variance do they explain?",
      "options": [
        "Retain all 10 components to avoid losing any data.",
        "Retain 3 components (all have Eigenvalues > 1.0 by Kaiser's Criterion). Together, they capture (5.2 + 2.1 + 1.2) / 10.0 = 8.5 / 10.0 = 85.0% of the total variance across all 10 survey questions, reducing dimensionality by 70% while preserving 85% of information!",
        "Retain 1 component because 5.2 is over 50%.",
        "PCA cannot be used on survey Likert scales."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. By Kaiser's Criterion (a standard rule in factor analysis), researchers retain components with eigenvalues greater than 1.0 (meaning the component captures more variance than an individual original standardized variable). Here, components 1, 2, and 3 have eigenvalues 5.2, 2.1, and 1.2, all exceeding 1.0. Together, they explain (5.2 + 2.1 + 1.2) / 10.0 = 85.0% of the total dataset variance. The team can collapse 10 noisy survey questions into 3 clean, orthogonal composite indices (e.g., Brand Perception, Usability, Service Quality) without sacrificing meaningful statistical signal."
    },
    "quests": [
      {
        "title": "Mathematical Derivation of PCA via Constrained Optimization",
        "type": "concept",
        "description": "Formulate PCA as a constrained optimization problem: maximize Var(X * v) = v^T * Sigma * v subject to v^T * v = 1 using the Lagrange multiplier method; derive the characteristic equation (Sigma - lambda * I) * v = 0; prove that the eigenvectors of Sigma form the orthogonal principal directions.",
        "rubric": "Step-by-step Lagrangian derivation dL/dv = 2*Sigma*v - 2*lambda*v = 0; prove that the maximized variance equals the eigenvalue lambda; prove orthogonality of eigenvectors for symmetric real covariance matrices."
      },
      {
        "title": "The Unscaled PCA Variance Domination Forensic Audit",
        "type": "detective",
        "description": "Audit an econometric dimensionality reduction pipeline: trace how an analyst performed PCA on raw macroeconomic data containing 'National GDP' (in trillions) and 'Unemployment Rate' (percentage); demonstrate that PC1 captured 99.98% of variance solely from GDP's gigantic numerical scale; prove that failing to use the correlation matrix completely blinded the model to unemployment dynamics.",
        "rubric": "Calculate eigenvalues on covariance matrix vs correlation matrix; demonstrate mathematically how scale variance distorts spectral decomposition; formulate mandatory Z-score standardization checks."
      },
      {
        "title": "Institutional PCA & Factor Biplot Analytics Suite",
        "type": "mastery",
        "description": "Construct an enterprise PCA and factor analytics tool in Python: standardize input data; compute eigen-decomposition and Singular Value Decomposition (SVD); calculate cumulative explained variance ratios; generate automated Scree plots with Kaiser threshold lines; generate 2D PCA Biplots showing both observation scores and feature loading vectors.",
        "rubric": "Pure numpy and scikit-learn implementation; automated generation of Scree plot and 2D loading biplot; output transformed orthogonal feature matrices for downstream regression and clustering."
      },
      {
        "title": "The High-Dimensional Macroeconomic Factor Stress-Testing War Room",
        "type": "incident",
        "description": "Advise a corporate risk committee facing macroeconomic uncertainty: the enterprise tracks 85 global macroeconomic indicators (interest rates, commodity prices, FX rates, PMI indices); feeding 85 collinear series into cash flow forecasting creates unstable models; use PCA to compress the 85 series into 4 fundamental macroeconomic factors (Growth, Inflation, Liquidity, Geopolitical Risk) and stress-test corporate solvency.",
        "rubric": "Perform PCA on 85 macroeconomic series; interpret factor loadings across economic drivers; formulate a 4-factor macroeconomic stress test projecting balance sheet cash burn under simultaneous stagflation shocks."
      }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "Executive Dashboard Engineering & Cognitive Visual Design (Milestone 1)",
    "stageName": "Stage 1: Statistical Foundations, Data Wrangling & Exploratory Business Analytics",
    "stageNum": 1,
    "pedagogicalRole": "Data Visualization Physics, Cognitive Load & Milestone 1 Integration",
    "spokenGoal": "An extraordinary data model is completely worthless if the CEO cannot understand it in 30 seconds. In executive decision-making, visual architecture is not decoration—it is cognitive engineering. Today, we master Edward Tufte's principles of data visualization: maximizing the Data-Ink Ratio (Data-Ink / Total Ink), eliminating 'Chartjunk' (distracting 3D effects, garish gridlines, unnecessary moiré patterns), and calculating the Lie Factor (Size of Effect in Graphic / Size of Effect in Data). We will design responsive executive dashboards that obey cognitive visual hierarchy: placing North Star KPIs at the top, trend sparklines in the middle, and multi-dimensional drill-downs at the bottom, completing Milestone 1: The ApexMetrics Business Intelligence & KPI Ingestion Engine!",
    "conceptInvariant": "Tufte Data-Ink & Lie Factor Invariant: An executive visualization must maximize the Data-Ink Ratio by stripping away all non-data ornamentation; furthermore, the Lie Factor = (Percentage Change in Graphic) / (Percentage Change in Data) must strictly equal 1.00 +/- 0.05; truncating axes or scaling areas non-linearly to exaggerate trends constitutes analytical malpractice.",
    "failureMode": "A BI developer creates an executive bar chart showing sales grew from $98M to $102M (+4.0%), but truncates the Y-axis to start at $95M; visually, the $102M bar looks 2.5 times taller than the $98M bar (Lie Factor = 37.5!); the board is deceived into believing sales surged by 250%, approving massive unearned bonuses before the distortion is discovered.",
    "tryItFriction": "Construct Milestone 1: ApexMetrics Enterprise Business Intelligence & KPI Ingestion Engine in Python/TypeScript: ingest multi-source raw business transactions; execute automated data cleaning, outlier filtering, and RFM segmentation; compute North Star KPIs (ARR, NRR, Churn, CAC); generate clean, high-data-ink executive dashboards adhering to Tufte principles with zero truncated axes and verified Lie Factor = 1.00.",
    "socraticHints": [
      "What is Edward Tufte's 'Lie Factor' in data visualization?",
      "Lie Factor = (Size of effect shown in graphic) / (Size of effect in data).",
      "If sales increase by 10% in the raw data, but a truncated bar chart makes the visual bar grow by 100%, the Lie Factor is 100% / 10% = 10.0; any Lie Factor significantly different from 1.0 misleads decision-makers."
    ],
    "situationalPuzzle": {
      "scenario": "A corporate dashboard shows a graphic comparing Company Revenue ($100M) vs Rival Revenue ($200M). The designer draws a dollar bill icon for the Rival that is twice as tall AND twice as wide as the Company icon. What is the Lie Factor of this graphic?",
      "options": [
        "Lie Factor = 1.0 because the height doubled.",
        "Lie Factor = 3.0! While actual revenue doubled (+100%), the physical area of the 2D graphic quadrupled (+300%, because Area = 2 * 2 = 4x). The visual effect is 300% / 100% = 3.0, visually exaggerating the competitor's size by 300%!",
        "Lie Factor = 0.5.",
        "Icons do not have lie factors."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is the classic 2D area scaling violation identified by Edward Tufte. When scaling two-dimensional icons or bubbles, designers frequently double both the height and the width. Because area scales with the square of the linear dimension (Area = Height * Width = 2 * 2 = 4x), doubling dimensions quadruples the visual surface area (+300% increase), while the underlying data only doubled (+100% increase). Lie Factor = 300% / 100% = 3.0. The human eye perceives the area, deceiving viewers into thinking the rival is four times larger."
    },
    "quests": [
      {
        "title": "Mathematical Foundations of Data-Ink Ratios & Gestalt Visual Perception",
        "type": "concept",
        "description": "Formulate Edward Tufte's Data-Ink Ratio Data-Ink / Total-Ink; derive the mathematical formulation of the Lie Factor; apply Gestalt Principles of visual perception (Proximity, Similarity, Continuity, Closure, Figure-Ground) to executive dashboard layout engineering.",
        "rubric": "Detail mathematical definitions of Data-Ink Ratio and Lie Factor; explain pre-attentive visual processing attributes (color hue, position, length, orientation); formulate rules for ethical axis scaling and color palettes."
      },
      {
        "title": "The Truncated Y-Axis Misleading Dashboard Forensic Audit",
        "type": "detective",
        "description": "Audit famous misleading corporate and media visualizations (e.g., truncated Y-axis stock charts, 3D pie charts that distort perspective): calculate the exact Lie Factor for 5 real-world corporate graphics; prove how 3D perspective distortion exaggerates foreground slices by up to 40%; demonstrate the ethical redesign adhering strictly to Tufte standards.",
        "rubric": "Calculate Lie Factor for each graphic; demonstrate perspective distortion trigonometry in 3D pie charts; provide before-and-after redesigns maximizing data-ink ratio."
      },
      {
        "title": "Milestone 1: ApexMetrics Business Intelligence & KPI Ingestion Engine",
        "type": "mastery",
        "description": "Engineer Milestone Project 1: a full-stack Business Intelligence & KPI Analytics Suite in Python: 1) Multi-source raw transaction ingestion with automated missing data imputation (MICE) and outlier filtering; 2) KPI calculation engine computing ARR, NRR, Logo Retention, and RFM scores; 3) Production-grade executive dashboard generator creating high-data-ink visual HTML/PDF reports with zero chartjunk, interactive sparklines, and verified Lie Factor = 1.00.",
        "rubric": "Clean, modular Python implementation; robust automated validation verifying data cleanliness; automated generation of a publication-grade C-suite dashboard summarizing organizational health."
      },
      {
        "title": "The Boardroom Dashboard Redesign Under Pressure War Room",
        "type": "incident",
        "description": "Lead an emergency C-suite presentation overhaul: the Chief Revenue Officer prepared a 45-slide, chartjunk-heavy presentation filled with 3D pie charts, truncated axes, and vanity user counts for an emergency Board meeting; within 4 hours, strip away all chartjunk, rebuild the presentation into a unified 1-page executive dashboard with verified North Star metrics, and defend the data-driven narrative before the Board of Directors.",
        "rubric": "Execute rapid data-ink optimization; reconstruct the corporate performance narrative around unit economics and cohort retention; successfully guide the Board to an informed, objective capital allocation decision."
      }
    ]
  }
]
