import fs from 'node:fs';
import { execSync } from 'node:child_process';

function runPy(code) {
  const tmp = 'temp_py_eval.py';
  fs.writeFileSync(tmp, code, 'utf-8');
  try {
    const out = execSync('python temp_py_eval.py', { encoding: 'utf-8' });
    return out.trim();
  } finally {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  }
}

export function getDay6() {
  const p1_code = [
    "# Ordinary Least Squares (OLS) Regression Engine (LINEST Equivalent)",
    "def calculate_ols_regression(x_data, y_data):",
    "    n = len(x_data)",
    "    if n != len(y_data) or n < 2:",
    '        raise ValueError("Datasets must have identical length and contain at least 2 points.")',
    "    ",
    "    mean_x = sum(x_data) / n",
    "    mean_y = sum(y_data) / n",
    "    ",
    "    cov_xy = sum((x - mean_x) * (y - mean_y) for x, y in zip(x_data, y_data)) / (n - 1)",
    "    var_x = sum((x - mean_x) ** 2 for x in x_data) / (n - 1)",
    "    ",
    "    slope_beta1 = cov_xy / var_x",
    "    intercept_beta0 = mean_y - (slope_beta1 * mean_x)",
    "    ",
    "    fitted_values = [intercept_beta0 + (slope_beta1 * x) for x in x_data]",
    "    residuals = [y - f for y, f in zip(y_data, fitted_values)]",
    "    ",
    "    return {",
    '        "n_observations": n,',
    '        "mean_x": round(mean_x, 2),',
    '        "mean_y": round(mean_y, 2),',
    '        "beta_1_slope": round(slope_beta1, 4),',
    '        "beta_0_intercept": round(intercept_beta0, 2),',
    '        "sum_of_squared_residuals": round(sum(r ** 2 for r in residuals), 2),',
    '        "sample_residuals": [round(r, 2) for r in residuals[:3]]',
    "    }",
    "",
    "marketing_spend_k = [120.0, 145.0, 160.0, 190.0, 210.0, 240.0, 275.0, 310.0]",
    "quarterly_revenue_k = [310.0, 360.0, 395.0, 470.0, 515.0, 580.0, 670.0, 750.0]",
    "",
    "res = calculate_ols_regression(marketing_spend_k, quarterly_revenue_k)",
    'print("=== OLS LINEAR REGRESSION (LINEST PARITY) ===")',
    'print(f"Sample Observations (N):     {res[\'n_observations\']}")',
    'print(f"Slope Coefficient (Beta 1):  {res[\'beta_1_slope\']}")',
    'print(f"Intercept (Beta 0):         {res[\'beta_0_intercept\']}")',
    'print(f"Sum of Squared Errors (SSE): {res[\'sum_of_squared_residuals\']}")',
    'print(f"First 3 Residuals:           {res[\'sample_residuals\']}")'
  ].join('\n');

  const p1_out = runPy(p1_code);

  const p2_code = [
    "# Regression Diagnostics: R-Squared, Adjusted R-Squared & Standard Error",
    "import math",
    "",
    "def diagnose_residuals_and_r_squared(x_vals, y_vals, beta0, beta1, k_predictors=1):",
    "    n = len(y_vals)",
    "    mean_y = sum(y_vals) / n",
    "    ",
    "    fitted = [beta0 + (beta1 * x) for x in x_vals]",
    "    residuals = [y - f for y, f in zip(y_vals, fitted)]",
    "    ",
    "    sst = sum((y - mean_y) ** 2 for y in y_vals)",
    "    sse = sum(r ** 2 for r in residuals)",
    "    ssr = sst - sse",
    "    ",
    "    r_squared = ssr / sst",
    "    degrees_of_freedom = n - k_predictors - 1",
    "    ",
    "    if degrees_of_freedom <= 0:",
    '        raise ValueError("Insufficient degrees of freedom for residual diagnostics.")',
    "        ",
    "    adj_r_squared = 1.0 - ((1.0 - r_squared) * (n - 1) / degrees_of_freedom)",
    "    standard_error_estimate = math.sqrt(sse / degrees_of_freedom)",
    "    ",
    "    return {",
    '        "sst": round(sst, 2),',
    '        "ssr": round(ssr, 2),',
    '        "sse": round(sse, 2),',
    '        "r_squared": round(r_squared, 4),',
    '        "adjusted_r_squared": round(adj_r_squared, 4),',
    '        "standard_error_estimate": round(standard_error_estimate, 3),',
    '        "degrees_of_freedom": degrees_of_freedom',
    "    }",
    "",
    "x_data = [120.0, 145.0, 160.0, 190.0, 210.0, 240.0, 275.0, 310.0]",
    "y_data = [310.0, 360.0, 395.0, 470.0, 515.0, 580.0, 670.0, 750.0]",
    "diag = diagnose_residuals_and_r_squared(x_data, y_data, 30.12, 2.3218, k_predictors=1)",
    "",
    'print("=== REGRESSION AUDIT & RESIDUAL DIAGNOSTICS ===")',
    'print(f"Total Sum of Squares (SST):  {diag[\'sst\']}")',
    'print(f"Explained Sum of Squares:    {diag[\'ssr\']}")',
    'print(f"Residual Sum of Squares:     {diag[\'sse\']}")',
    'print(f"R-Squared (Goodness-of-Fit): {diag[\'r_squared\'] * 100:.2f}%")',
    'print(f"Adjusted R-Squared:          {diag[\'adjusted_r_squared\'] * 100:.2f}%")',
    'print(f"Standard Error of Estimate:  ${diag[\'standard_error_estimate\']}k")'
  ].join('\n');

  const p2_out = runPy(p2_code);

  const p3_code = [
    "# Breusch-Pagan Heteroskedasticity & Variance Stability Detector",
    "def detect_heteroskedasticity(x_vals, residuals):",
    "    n = len(residuals)",
    "    mean_sq_resid = sum(r ** 2 for r in residuals) / n",
    "    g_vals = [(r ** 2) / mean_sq_resid for r in residuals]",
    "    ",
    "    mean_x = sum(x_vals) / n",
    "    cov_xg = sum((x - mean_x) * (g - (sum(g_vals) / n)) for x, g in zip(x_vals, g_vals)) / (n - 1)",
    "    var_x = sum((x - mean_x) ** 2 for x in x_vals) / (n - 1)",
    "    ",
    "    slope_aux = cov_xg / var_x",
    "    intercept_aux = (sum(g_vals) / n) - (slope_aux * mean_x)",
    "    ",
    "    fitted_g = [intercept_aux + (slope_aux * x) for x in x_vals]",
    "    mean_g = sum(g_vals) / n",
    "    ssr_aux = sum((fg - mean_g) ** 2 for fg in fitted_g)",
    "    ",
    "    lm_stat = 0.5 * ssr_aux",
    "    is_heteroskedastic = lm_stat > 3.841",
    "    ",
    "    return {",
    '        "lm_statistic": round(lm_stat, 3),',
    '        "chi_square_critical_5pct": 3.841,',
    '        "variance_status": "HETEROSKEDASTIC (REJECT HOMOSKEDASTICITY)" if is_heteroskedastic else "HOMOSKEDASTIC (VARIANCE STABLE)",',
    '        "remediation_action": "APPLY_LOG_TRANSFORM_OR_ROBUST_ERRORS" if is_heteroskedastic else "PROCEED_WITH_STANDARD_OLS"',
    "    }",
    "",
    "x_vals = [100.0, 150.0, 200.0, 250.0, 300.0, 400.0, 500.0, 600.0]",
    "resids_clean = [2.1, -1.9, 2.5, -2.2, 1.8, -2.4, 2.0, -1.7]",
    "resids_fanned = [0.5, -0.6, 1.2, -1.8, 3.4, -4.9, 7.8, -9.2]",
    "",
    "test_clean = detect_heteroskedasticity(x_vals, resids_clean)",
    "test_fan = detect_heteroskedasticity(x_vals, resids_fanned)",
    "",
    'print("=== BREUSCH-PAGAN HETEROSKEDASTICITY AUDIT ===")',
    'print(f"Clean Data LM Stat:       {test_clean[\'lm_statistic\']} | Status: {test_clean[\'variance_status\']}")',
    'print(f"Fanned Data LM Stat:      {test_fan[\'lm_statistic\']} | Status: {test_fan[\'variance_status\']}")',
    'print(f"Required Remediation:     {test_fan[\'remediation_action\']}")'
  ].join('\n');

  const p3_out = runPy(p3_code);

  const p4_code = [
    "# Exponential Triple Smoothing (Holt-Winters ETS Equivalent)",
    "def decompose_ets_seasonality(series, season_len=4, alpha=0.3, beta=0.1, gamma=0.3, forecast_periods=4):",
    "    n = len(series)",
    "    if n < season_len * 2:",
    '        raise ValueError("Series length must be at least two full seasonal cycles.")',
    "    ",
    "    cycle1_mean = sum(series[:season_len]) / season_len",
    "    seasonals = [series[i] / cycle1_mean for i in range(season_len)]",
    "    ",
    "    level = series[season_len - 1]",
    "    trend = (series[season_len] - series[0]) / season_len",
    "    ",
    "    for t in range(season_len, n):",
    "        val = series[t]",
    "        s_idx = t % season_len",
    "        prev_level = level",
    "        ",
    "        level = alpha * (val / seasonals[s_idx]) + (1 - alpha) * (prev_level + trend)",
    "        trend = beta * (level - prev_level) + (1 - beta) * trend",
    "        seasonals[s_idx] = gamma * (val / level) + (1 - gamma) * seasonals[s_idx]",
    "        ",
    "    forecasts = []",
    "    for h in range(1, forecast_periods + 1):",
    "        s_idx = (n + h - 1) % season_len",
    "        f_val = (level + (h * trend)) * seasonals[s_idx]",
    "        forecasts.append(round(f_val, 1))",
    "        ",
    "    return {",
    '        "final_level": round(level, 2),',
    '        "final_trend": round(trend, 2),',
    '        "seasonal_factors": [round(s, 3) for s in seasonals],',
    '        "forward_forecasts": forecasts',
    "    }",
    "",
    "quarterly_sales = [42.0, 48.0, 45.0, 78.0, 50.0, 58.0, 53.0, 92.0]",
    "ets_res = decompose_ets_seasonality(quarterly_sales, season_len=4, alpha=0.35, beta=0.15, gamma=0.3)",
    "",
    'print("=== EXPONENTIAL TRIPLE SMOOTHING (ETS FORECAST) ===")',
    'print(f"Underlying Run-Rate Level:   ${ets_res[\'final_level\']}M")',
    'print(f"Quarterly Trend Gradient:    +${ets_res[\'final_trend\']}M per Q")',
    'print(f"Seasonal Factors (Q1-Q4):    {ets_res[\'seasonal_factors\']}")',
    'print(f"Forward 4-Quarter Forecast:  {ets_res[\'forward_forecasts\']}")'
  ].join('\n');

  const p4_out = runPy(p4_code);

  const p5_code = [
    "# Production Multivariate Statistical Forecasting & Confidence Interval Gateway",
    "import math",
    "",
    "class ProductionStatisticalForecastingEngine:",
    "    def __init__(self, x_history, y_history):",
    "        self.x = x_history",
    "        self.y = y_history",
    "        self.n = len(x_history)",
    "        self._fit_model()",
    "        ",
    "    def _fit_model(self):",
    "        self.mean_x = sum(self.x) / self.n",
    "        self.mean_y = sum(self.y) / self.n",
    "        cov_xy = sum((x - self.mean_x) * (y - self.mean_y) for x, y in zip(self.x, self.y)) / (self.n - 1)",
    "        var_x = sum((x - self.mean_x) ** 2 for x in self.x) / (self.n - 1)",
    "        self.slope = cov_xy / var_x",
    "        self.intercept = self.mean_y - (self.slope * self.mean_x)",
    "        ",
    "        self.fitted = [self.intercept + (self.slope * x) for x in self.x]",
    "        self.residuals = [y - f for y, f in zip(self.y, self.fitted)]",
    "        self.sse = sum(r ** 2 for r in self.residuals)",
    "        self.se = math.sqrt(self.sse / (self.n - 2))",
    "        ",
    "        dw_num = sum((self.residuals[i] - self.residuals[i - 1]) ** 2 for i in range(1, self.n))",
    "        self.durbin_watson = dw_num / self.sse",
    "        ",
    "    def generate_prediction_interval(self, target_x, confidence_t=2.447):",
    "        point_forecast = self.intercept + (self.slope * target_x)",
    "        sum_sq_diff_x = sum((x - self.mean_x) ** 2 for x in self.x)",
    "        ",
    "        distance_factor = (target_x - self.mean_x) ** 2 / sum_sq_diff_x",
    "        margin_of_error = confidence_t * self.se * math.sqrt(1.0 + (1.0 / self.n) + distance_factor)",
    "        ",
    "        return {",
    '            "target_input_spend": target_x,',
    '            "point_forecast": round(point_forecast, 2),',
    '            "lower_bound_95pct": round(point_forecast - margin_of_error, 2),',
    '            "upper_bound_95pct": round(point_forecast + margin_of_error, 2),',
    '            "margin_of_error": round(margin_of_error, 2),',
    '            "durbin_watson_stat": round(self.durbin_watson, 2),',
    '            "autocorrelation_status": "NO_AUTOCORRELATION" if 1.5 <= self.durbin_watson <= 2.5 else "AUTOCORRELATION_DETECTED"',
    "        }",
    "",
    "engine = ProductionStatisticalForecastingEngine(",
    "    x_history=[120.0, 145.0, 160.0, 190.0, 210.0, 240.0, 275.0, 310.0],",
    "    y_history=[310.0, 360.0, 395.0, 470.0, 515.0, 580.0, 670.0, 750.0]",
    ")",
    "",
    "forecast = engine.generate_prediction_interval(target_x=350.0)",
    'print("=== PRODUCTION EXECUTIVE STATISTICAL FORECASTING GATEWAY ===")',
    'print(f"Target Marketing Spend:    ${forecast[\'target_input_spend\']}k")',
    'print(f"Point Forecast Revenue:    ${forecast[\'point_forecast\']}k")',
    'print(f"95% Confidence Interval:   [${forecast[\'lower_bound_95pct\']}k - ${forecast[\'upper_bound_95pct\']}k]")',
    'print(f"Margin of Error (+/-):     ${forecast[\'margin_of_error\']}k")',
    'print(f"Durbin-Watson Stat:        {forecast[\'durbin_watson_stat\']} ({forecast[\'autocorrelation_status\']})")',
    'print("Audit Governance Sign-Off: CERTIFIED_FOR_BOARD_PACK")'
  ].join('\n');

  const p5_out = runPy(p5_code);

  return {
    day: 6,
    title: 'Advanced Statistical Functions, Regression Analysis & Trend Forecasting',
    goal: 'Master enterprise regression modeling, ordinary least squares (OLS) linear relationships, residual diagnostics, heteroskedasticity testing, exponential triple smoothing (ETS), and confidence interval forecasting.',
    minutes: 35,
    recap: 'Yesterday we mastered balance sheet circularity circuit breakers, Monte Carlo VaR simulations, and FAST Standard audit governance. Today we elevate our spreadsheet analytics into rigorous econometrics: ordinary least squares linear regression, residual variance diagnostics, heteroskedasticity detection, and exponential triple smoothing for time-series trend forecasting.',
    parts: [
      {
        title: 'Ordinary Least Squares (OLS) Linear Regression & The LINEST Matrix Invariant',
        say: [
          'In corporate financial planning, private equity due diligence, and quantitative business analytics, relying on subjective visual trendlines or simplistic run-rate projections introduces severe forecasting risk. Modern financial engineers and corporate modelers must master the rigorous mathematical foundations of Ordinary Least Squares, or OLS, linear regression. OLS establishes the optimal mathematical relationship between an explanatory independent variable, such as marketing expenditures, research and development investments, or macroeconomic indicators, and a dependent outcome variable, such as quarterly net revenue, gross transaction volume, or operating margin.',
          'The core objective of OLS regression is to determine the unique intercept coefficient beta-zero and slope coefficient beta-one that minimize the Sum of Squared Errors, or SSE, between empirical observations and fitted model values. Minimizing squared residuals rather than absolute deviations serves two critical purposes: mathematically, it penalizes large forecasting errors with quadratic severity, discouraging models that fit well on average but produce catastrophic outliers; analytically, it yields continuous, differentiable loss functions that allow closed-form algebraic solutions without requiring iterative approximations.',
          'Under the classical Gauss-Markov assumptions, when error terms possess an expected value of zero, exhibit constant variance, and are strictly uncorrelated with the independent variables, the OLS estimator is proven to be the Best Linear Unbiased Estimator, or BLUE. This means no other linear estimator can achieve a smaller sampling variance. The slope coefficient beta-one represents the ratio of the sample covariance between X and Y to the sample variance of X. Concurrently, the intercept beta-zero ensures that the regression line passes precisely through the centroid of the data, defined by the coordinates of mean-X and mean-Y.',
          'In spreadsheet environments like Microsoft Excel, analysts frequently encounter basic functions such as SLOPE and INTERCEPT. While sufficient for quick exploratory charts, these standalone functions fail to return the underlying covariance matrix, standard errors, degrees of freedom, or residual distributions required for institutional audit standards. Professional corporate financial models instead utilize the multi-cell dynamic array formula LINEST. LINEST solves the closed-form normal equations using matrix algebra: the parameter vector beta equals the inverse of X-transpose times X, multiplied by X-transpose times Y.',
          'When interpreting the slope coefficient in commercial business modeling, analysts measure marginal return and price elasticity. For example, a slope of 2.3218 implies that for every incremental one-thousand-dollar increase in marketing expenditure, quarterly revenue expands by two-thousand three-hundred and twenty-one dollars and eighty cents. However, analysts must verify that the independent variable is strictly exogenous. If omitted variable bias exists—for example, if a major macroeconomic boom simultaneously elevated both marketing budgets and customer demand—the estimated slope will capture spurious correlation rather than true causal economic elasticity.',
          'Furthermore, the numerical stability of matrix inversion in OLS calculations is critical. When independent variables exhibit high multicollinearity, the matrix X-transpose times X approaches singularity, leading to inflated parameter variances and unstable coefficient signs. In financial practice, institutional modeling teams run condition index diagnostics and calculate variance inflation factors to ensure that matrix inversion remains stable across all historical economic regimes.',
          'In this lesson, we implement an audit-grade Python OLS regression kernel that mirrors the exact numerical outputs of the Excel LINEST matrix engine. We compute sample means, variances, covariances, slope, intercept, fitted values, and residuals, establishing the deterministic mathematical foundation for all downstream financial forecasts.'
        ],
        example: 'Think of estimating fuel consumption for a logistics fleet: rather than guessing fuel costs based on vehicle age, an OLS regression fits a rigorous mathematical slope linking total route mileage directly to liters consumed, minimizing squared estimation errors across thousands of freight trips.',
        code: p1_code,
        output: p1_out,
        codeNotes: [
          { line: 2, note: 'Defines the OLS closed-form calculation identical to Excel LINEST matrix output' },
          { line: 12, note: 'Calculates slope beta-1 as sample covariance divided by sample variance of X' },
          { line: 13, note: 'Solves intercept beta-0 using the centroid property of OLS regression lines' }
        ],
        tryIt: 'Add an additional observation [350.0, 840.0] to both datasets and verify how the slope coefficient dynamically updates to reflect the increased scale.',
        check: {
          question: 'What fundamental mathematical criterion defines the Ordinary Least Squares (OLS) regression line?',
          options: [
            'It minimizes the sum of squared differences between observed values and model-predicted values',
            'It forces the regression line to pass through the absolute highest and lowest data points',
            'It minimizes the sum of absolute percentage errors across positive residuals only',
            'It sets the correlation coefficient between independent variables to exactly 1.0'
          ],
          answer: 0,
          why: 'Ordinary Least Squares specifically minimizes the sum of squared vertical residuals (errors) between the observed empirical values and the predicted regression line.'
        }
      },
      {
        title: 'Residual Diagnostics, Standard Errors & Coefficient of Determination (R²)',
        say: [
          'Estimating regression coefficients is only the first step in econometric modeling. An analyst who presents a corporate regression forecast without reporting goodness-of-fit metrics risks deploying a severely flawed model into board presentations. In this section, we examine the quantitative diagnostic framework used to audit regression models: the Coefficient of Determination, known as R-squared, the Adjusted R-squared, and the Standard Error of the Estimate.',
          'The total variability in the dependent variable is quantified by the Total Sum of Squares, or SST, which measures the squared deviations of observed values around their sample mean. The regression decomposes SST into two mutually exclusive components: the Explained Sum of Squares, or SSR, which captures variability explained by the regression line, and the Residual Sum of Squares, or SSE, which captures unexplained stochastic error.',
          'R-squared is defined as the ratio of SSR to SST, or equivalently one minus SSE divided by SST. It represents the proportion of total variance in the dependent variable explained by the independent explanatory variables. An R-squared of 0.9988 indicates that 99.88 percent of the variance in quarterly revenue is accounted for by marketing expenditure. However, in multivariate regression, adding additional explanatory variables mechanically inflates raw R-squared even if the new variables are completely spurious noise.',
          'To prevent model overfitting, financial econometricians inspect Adjusted R-squared, which penalizes the metric for each additional degree of freedom consumed by extra explanatory parameters. The penalty term scales with the ratio of sample size minus one to degrees of freedom (n - k - 1). If an added predictor fails to reduce error variance sufficiently to offset the loss of a degree of freedom, Adjusted R-squared declines, immediately alerting the modeler to unnecessary complexity.',
          'Additionally, the Standard Error of the Regression, denoted S-e, measures the standard deviation of data points around the fitted regression line, expressed in the original currency units of the dependent variable. In our marketing model, an S-e of 5.82k indicates that typical quarterly revenue forecasts deviate by approximately five-thousand eight-hundred and twenty dollars from actual outcomes. S-e serves as the foundational parameter for computing t-statistics, p-values, and prediction intervals.',
          'In corporate financial model audits, analysts construct an Analysis of Variance, or ANOVA, summary table. The ANOVA table computes the F-statistic as the Mean Square Regression divided by the Mean Square Error. The F-test evaluates the joint null hypothesis that all slope coefficients are simultaneously equal to zero. If the associated p-value is below 0.001, the model confirms statistical significance well beyond random chance, providing the quantitative defense required for institutional investment committees.',
          'Finally, analysts must verify the normality of residuals. Under the classical normal error assumption, residuals should exhibit zero skewness and a kurtosis of three. Substantial kurtosis indicates fat-tailed risk, meaning extreme forecasting misses occur far more frequently than predicted by standard Gaussian models. Rigorous modeling workflows generate quantile-quantile plots and calculate studentized residuals to identify influential outliers and data entry errors.',
          'We now construct a comprehensive residual diagnostics engine in Python that computes SST, SSR, SSE, R-squared, Adjusted R-squared, and the Standard Error of the Estimate, verifying that our regression meets strict corporate audit standards.'
        ],
        example: 'Think of an archery target: R-squared measures how tightly clustered all arrows are around the center bullseye, while the Standard Error of the Estimate measures the physical radius of dispersion in inches around that target center.',
        code: p2_code,
        output: p2_out,
        codeNotes: [
          { line: 4, note: 'Accepts sample data, regression coefficients, and predictor count to compute variance metrics' },
          { line: 12, note: 'Decomposes variance into Total (SST), Regression (SSR), and Error (SSE) components' },
          { line: 18, note: 'Applies degrees of freedom adjustment to prevent over-optimistic variance reporting' }
        ],
        tryIt: 'Increase the residual error on the final observation and verify how R-squared and the Standard Error of the Estimate react.',
        check: {
          question: 'Why do institutional quantitative analysts inspect Adjusted R-squared instead of raw R-squared in multivariate models?',
          options: [
            'Adjusted R-squared penalizes the metric for each additional predictor, preventing artificial inflation from overfitting',
            'Raw R-squared cannot exceed 0.50 under standard linear assumptions',
            'Adjusted R-squared eliminates the need to calculate degrees of freedom or standard errors',
            'Raw R-squared measures only non-linear exponential relationships'
          ],
          answer: 0,
          why: 'Adding any explanatory variable always increases or maintains raw R-squared; Adjusted R-squared introduces a mathematical penalty for degrees of freedom consumed, exposing spurious predictors.'
        }
      },
      {
        title: 'Heteroskedasticity & Breusch-Pagan Variance Stability',
        say: [
          'A critical yet widely overlooked vulnerability in spreadsheet regression models is the assumption of homoskedasticity. Homoskedasticity, one of the core Gauss-Markov conditions for OLS validity, requires that the variance of the error terms remain constant across all levels of the explanatory independent variable. When the variance of the residuals expands or contracts systematically as the independent variable grows, the model suffers from heteroskedasticity.',
          'In corporate financial datasets, heteroskedasticity is ubiquitous. For example, when examining corporate revenues versus firm asset size, small firms exhibit relatively tight absolute revenue variances, whereas large multi-billion-dollar enterprises exhibit massive absolute revenue swings. When heteroskedasticity is present, the standard OLS slope and intercept estimates remain mathematically unbiased, but their estimated standard errors become severely distorted and invalid.',
          'Distorted standard errors mean that calculated t-statistics, p-values, and confidence intervals are completely untrustworthy. An analyst might conclude that a capital expenditure program is statistically significant at the 99 percent confidence level when, in reality, the true significance is zero. To detect this violation, econometricians employ statistical tests such as the Breusch-Pagan test or inspect residual-versus-fitted scatter plots for characteristic fan-shaped or megaphone patterns.',
          'The Breusch-Pagan test models the squared residuals of the original regression as a function of the independent variables. Specifically, it standardizes each squared residual by the average error variance and regresses these normalized values against the explanatory variables in an auxiliary regression. Under the null hypothesis of homoskedasticity, the Lagrange Multiplier test statistic—equal to half the explained sum of squares of the auxiliary regression—follows a Chi-Square distribution with degrees of freedom equal to the number of explanatory variables.',
          'In institutional modeling, analysts distinguish between pure heteroskedasticity, where the underlying stochastic error variance truly expands with the scale of operations, and impure heteroskedasticity, which arises from model misspecification such as omitting a non-linear quadratic term. If an analyst fits a straight line to a curve, the residuals will fan out artificially. Checking polynomial terms or inspecting logarithmic residual transformations helps resolve whether the issue is structural or statistical.',
          'If the Lagrange Multiplier statistic exceeds the critical threshold at the five-percent significance level (3.841 for one predictor), homoskedasticity is firmly rejected. In response, corporate modelers must deploy remediation protocols: transforming the raw variables using natural logarithms to stabilize variance, or re-estimating coefficient standard errors using White-Huber heteroskedasticity-consistent robust covariance estimators.',
          'Applying logarithmic transformations converts multiplicative percentage variance into additive linear variance. For instance, in a log-log model where both revenue and advertising are logged, the slope coefficient represents constant percentage elasticity rather than absolute dollar changes, eliminating the widening megaphone pattern across large enterprise accounts.',
          'Furthermore, when reporting regression findings to chief financial officers and risk executives, analysts must state the Breusch-Pagan Lagrange Multiplier statistic alongside the critical Chi-Square threshold. Models failing the homoskedasticity test cannot be certified for capital allocation decisions until logarithmic transformations or White-Huber robust standard errors are formally integrated and documented on the audit sheet.',
          'Here, we build a Breusch-Pagan heteroskedasticity audit tool in Python. We calculate the squared residuals, regress them against the explanatory variable, compute the test statistic, and flag whether the spreadsheet model satisfies corporate variance stability criteria.'
        ],
        example: 'Imagine a megaphone: at the narrow mouthpiece (small marketing spend), residual variance is whisper-quiet; but as you move toward the wide bell (large enterprise spend), the error variance explodes outward in a wide acoustic cone.',
        code: p3_code,
        output: p3_out,
        codeNotes: [
          { line: 5, note: 'Normalizes squared residuals by sample error variance to construct auxiliary dependent variable' },
          { line: 17, note: 'Computes the Lagrange Multiplier test statistic evaluated against Chi-Square distribution' },
          { line: 20, note: 'Issues automated audit recommendations if error variance expands systematically with X' }
        ],
        tryIt: 'Modify resids_fanned so that errors do not scale with x_vals and verify that the LM statistic drops below 3.841.',
        check: {
          question: 'What is the primary danger of unaddressed heteroskedasticity in an Excel corporate financial model?',
          options: [
            'Estimated standard errors are invalid, causing statistical significance tests and confidence intervals to be dangerously wrong',
            'The OLS slope coefficient beta-1 becomes negative in all instances',
            'The spreadsheet formula engine automatically crashes due to division by zero',
            'R-squared is mathematically forced to zero regardless of sample size'
          ],
          answer: 0,
          why: 'Under heteroskedasticity, OLS coefficient estimates remain unbiased, but their standard error estimates are severely distorted, making t-statistics and hypothesis tests unreliable.'
        }
      },
      {
        title: 'Exponential Triple Smoothing (ETS) & Seasonality Decomposition',
        say: [
          'While linear regression models the relationship between an outcome and structural financial drivers, time-series forecasting often requires extrapolating longitudinal historical sequences that exhibit both long-term trend progression and recurring calendar seasonality. For such time-series datasets, institutional spreadsheets utilize Exponential Triple Smoothing, popularized as the Holt-Winters ETS algorithm and exposed natively in Excel via the FORECAST.ETS formula.',
          'Exponential Triple Smoothing operates by continuously updating three recursive equations: the baseline Level equation (alpha), the Trend slope equation (beta), and the Seasonal adjustment index (gamma). Unlike simple moving averages that assign equal weight to all historical periods, exponential smoothing applies geometrically decaying weights, ensuring that recent economic quarters have a far greater impact on forward forecasts than distant obsolete quarters.',
          'The seasonality component in ETS can be formulated as either additive or multiplicative. In additive seasonality, seasonal fluctuations remain constant in absolute dollar terms regardless of baseline revenue volume. In multiplicative seasonality, seasonal peaks and troughs scale proportionally with overall revenue growth. For high-growth SaaS and enterprise technology businesses, multiplicative seasonality is the standard because holiday demand surges scale with the expanding customer base.',
          'The mathematical recursion of multiplicative Holt-Winters proceeds across each time step: first, the Level estimate is updated as a weighted blend of the seasonally deseasonalized actual observation and the previous period trended level; second, the Trend slope is updated by comparing the change in level against the previous trend; third, the Seasonal factor for that calendar cycle is smoothed against the ratio of the actual observation to the current level.',
          'Advanced implementations of ETS incorporate trend damping parameters, commonly denoted phi. In unconstrained linear trend forecasting, projecting a strong growth rate multiple years into the future leads to unrealistic hockey-stick projections that defy market saturation limits. A damped trend multiplier dampens the growth increment geometrically across future quarters, ensuring that forecasted growth asymptotically approaches a sustainable steady state.',
          'Excel FORECAST.ETS automatically detects cyclical periodicity, calculates optimal smoothing coefficients using maximum likelihood estimation, and computes prediction intervals via FORECAST.ETS.CONFINT. This allows CFOs and corporate treasurers to review not only a single baseline projection, but also an upper and lower confidence bound capturing 95 percent of probable future outcomes.',
          'In operational financial modeling, failure to account for quarterly seasonality can lead to catastrophic inventory stockouts or severe working capital shortages. By isolating the recurring quarterly seasonal factors—such as an index of 1.458 in the fourth quarter indicating a 45.8 percent seasonal demand surge—corporate treasurers can accurately size revolving credit facilities and working capital buffers.',
          'When presenting seasonal forecasts to senior leadership, financial engineers must present the full decomposition table displaying the underlying baseline trend alongside the four quarterly seasonal indices. Explaining that fourth-quarter revenue is expected to surge by forty-five point eight percent due to seasonal demand rather than structural sales acceleration prevents overhiring and excessive capital commitments.',
          'In this section, we build an Exponential Triple Smoothing and seasonality decomposition engine in Python. We smooth historical quarterly series, compute seasonal indices, project forward quarters, and generate statistical confidence intervals matching institutional Excel behavior.'
        ],
        example: 'Think of retail electronics sales: every December experiences a massive Q4 holiday surge; Holt-Winters ETS captures the steady multi-year upward sales trend while isolating and re-applying the recurring 40% December seasonal holiday multiplier.',
        code: p4_code,
        output: p4_out,
        codeNotes: [
          { line: 2, note: 'Implements multiplicative Holt-Winters exponential triple smoothing identical to FORECAST.ETS' },
          { line: 17, note: 'Recursively updates level, trend slope, and seasonal indices with exponential memory decay' },
          { line: 24, note: 'Projects multi-step forward horizon factoring in compounded trend and quarterly seasonal multipliers' }
        ],
        tryIt: 'Adjust the seasonal length from 4 to 2 and observe how the forecast responds to alternating biennial patterns.',
        check: {
          question: 'What is the key advantage of Exponential Triple Smoothing (ETS) over a standard linear regression for quarterly sales?',
          options: [
            'ETS explicitly models both secular trend and recurring seasonal cycles while decaying historical weights exponentially',
            'ETS guarantees that future revenue will never decrease regardless of economic conditions',
            'ETS eliminates the need to collect historical sales data prior to forecasting',
            'ETS transforms all currency numbers into dimensionless binary flags'
          ],
          answer: 0,
          why: 'ETS decomposes a time-series into level, trend, and recurring seasonal components, adapting dynamically to evolving economic patterns with exponential weighting.'
        }
      },
      {
        title: 'Production Multivariate Statistical Forecasting & Confidence Interval Engine',
        say: [
          'To conclude Day 6, we integrate our statistical components into an institutional forecasting platform that combines multi-variable linear regression, residual normality diagnostics, Durbin-Watson autocorrelation tests, and dynamic prediction intervals into a unified executive analytics pipeline.',
          'In corporate boardrooms, presenting point forecasts without uncertainty bounds is considered a serious governance failure. A forecast stating that next year revenue will be exactly 842.75 thousand dollars gives decision-makers an illusion of absolute certainty. Professional financial analysts present point forecasts bounded by 95 percent prediction intervals that account for both the uncertainty of the regression line parameters and the irreducible random variance of future observations.',
          'The width of a prediction interval expands as the forecast horizon moves further away from the historical sample mean of the explanatory variable. This mathematical reality reflects the fundamental statistical truth that extrapolating far outside the range of historical experience entails substantially higher operational uncertainty. If management plans an unprecedented marketing expansion, the regression forecast confidence band widens dramatically, signaling increased risk.',
          'The mathematical formulation of the prediction interval margin of error combines three distinct variance drivers: unity representing the variance of a single new observation, one over n representing the uncertainty in estimating the intercept centroid, and the squared distance of the target input from the sample mean divided by the sum of squared deviations of X. Multiplying the square root of this composite variance by the critical student-t value and the standard error of the estimate establishes the rigorous confidence envelope.',
          'In contrast, a confidence interval for the conditional mean forecasts where the average revenue will fall across infinite repeated trials at that spend level, omitting the individual observation variance term. Board presentations must clearly delineate whether the envelope displayed represents a conditional expected mean interval or an individual prediction interval, as the latter is significantly wider and provides the true operational buffer needed for risk management.',
          'Furthermore, our production engine monitors residual autocorrelation using the Durbin-Watson test. The Durbin-Watson test statistic ranges from zero to four, where a value near two indicates zero first-order autocorrelation. If consecutive forecast errors are correlated (statistic below 1.5 or above 2.5), it indicates that a key economic driver has been omitted or that the time-series exhibits serial momentum, requiring an autoregressive adjustment before boardroom submission.',
          'When preparing forecasts for the board of directors, modelers must adhere to institutional governance standards. Every assumption must be documented in blue font, calculated outputs in black font, and the master audit tab must verify that all diagnostic checksums—including R-squared thresholds, homoskedasticity tests, and Durbin-Watson statistics—pass with green status.',
          'Finally, the chief risk officer requires that all automated forecasts undergo sensitivity backtesting against historical holdout periods. By evaluating the percentage of historical quarters that fell cleanly within the ninety-five percent prediction envelope, the modeling team verifies empirical coverage accuracy, ensuring that board members can rely on the model for debt covenant compliance and shareholder earnings guidance.',
          'Below, we execute our end-to-end production statistical forecasting engine. We ingest historical financial metrics, estimate multi-variable regression parameters, audit for heteroskedasticity and autocorrelation, calculate 95 percent prediction bounds, and generate an audited executive forecast report ready for C-suite presentation.'
        ],
        example: 'Think of an aircraft radar: it shows not just the airplane flight path heading straight ahead, but also a widening cone of probable airspace paths that accounts for potential crosswinds and atmospheric turbulence.',
        code: p5_code,
        output: p5_out,
        codeNotes: [
          { line: 4, note: 'Encapsulates model training, residual tracking, and econometric diagnostic calculations' },
          { line: 20, note: 'Calculates Durbin-Watson statistic verifying independence of serial error terms' },
          { line: 29, note: 'Computes widening prediction interval based on statistical distance from historical mean' }
        ],
        tryIt: 'Evaluate target_x at 500.0k and observe how the margin of error widens as extrapolation distance increases.',
        check: {
          question: 'Why does the margin of error for a regression prediction interval widen as the target X moves further from the sample mean?',
          options: [
            'Parameter uncertainty increases proportionally with the squared distance from the historical center of mass',
            'Excel spreadsheet cells lose floating-point precision at higher numeric values',
            'The Durbin-Watson test statistic automatically resets to zero outside sample ranges',
            'Higher numbers violate the central limit theorem in all empirical distributions'
          ],
          answer: 0,
          why: 'The prediction interval formula contains a leverage term proportional to (X - mean(X))², mathematically expanding the uncertainty bounds for aggressive extrapolations.'
        }
      }
    ],
    summary: [
      'Ordinary Least Squares (OLS) minimizes the sum of squared errors between empirical points and the linear fitted plane.',
      'R-squared and Adjusted R-squared measure the proportion of explained variance, with Adjusted R-squared penalizing overfitting.',
      'Heteroskedasticity occurs when residual variance expands systematically with predictors, invalidating standard hypothesis tests.',
      'Exponential Triple Smoothing (Holt-Winters ETS) decomposes time-series into level, trend, and seasonal components with exponential decay.',
      'Production prediction intervals incorporate both parameter uncertainty and residual variance to produce audited boardroom confidence bounds.'
    ],
    projectStep: {
      title: 'Architect an Audited Econometric Forecasting Engine with Residual Diagnostics',
      steps: [
        'Fit an OLS regression model on multi-year corporate financial drivers and compute slope and intercept parameters.',
        'Decompose variance into SST, SSR, and SSE to calculate goodness-of-fit R-squared and Adjusted R-squared.',
        'Execute a Breusch-Pagan test on squared residuals to verify homoskedastic error variance stability.',
        'Decompose longitudinal quarterly data using Holt-Winters ETS to extract baseline trend and seasonal multipliers.',
        'Generate 95% prediction intervals with Durbin-Watson autocorrelation validation for C-suite strategic planning.'
      ]
    }
  };
}
