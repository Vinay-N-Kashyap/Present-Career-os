# scripts/visuals/business_analytics_spec_m1_rest.py
# Days 16 to 30 Specification for Business Analytics, Econometrics & Decision Dashboards (course-business-analytics)
# Conforming strictly to Gate v2 semantic standard:
# 3-Tier Socratic Hint Ladders, Time Series Decomposition (Additive vs Multiplicative),
# Stationarity Physics (ADF, KPSS Unit Root Tests & Differencing),
# Holt-Winters Triple Exponential Smoothing (Trend & Seasonal Multipliers),
# Box-Jenkins ARIMA & SARIMA (p, d, q) x (P, D, Q)s Mathematical Identification,
# Forecast Error Metrics (MAE, MAPE, RMSE, Tracking Signals),
# Vector Autoregression (VAR), Impulse Response Functions (IRF) & Granger Causality,
# Panel Data Econometrics (Fixed Effects vs Random Effects & Hausman Test),
# Instrumental Variables (IV), 2SLS & Endogeneity Resolution,
# Quasi-Experimental Causal Inference: Difference-in-Differences (DiD) & Synthetic Controls,
# Price Elasticity of Demand & Optimal Dynamic Revenue Management,
# Supply Chain Analytics: ABC-XYZ Inventory Volatility Matrices,
# Marketing Attribution Modeling: Shapley Value & Markov Chain Multi-Touch Attribution,
# Probabilistic Customer Lifetime Value: BG/NBD & Gamma-Gamma Spend Models,
# Prescriptive Decision Trees & Expected Value of Perfect Information (EVPI),
# and Capstone 1: ApexForecast Enterprise Demand Forecasting & Revenue Intelligence Engine.

DAYS_16_TO_30 = [
  {
    "day": 16,
    "month": 1,
    "blockNum": 4,
    "title": "Time Series Foundations: Trend, Seasonality & Classical Decomposition",
    "stageName": "Stage 2: Econometric Time Series, Demand Forecasting & Operations Analytics",
    "stageNum": 2,
    "pedagogicalRole": "Temporal Data Decomposition & Autocorrelation Physics",
    "spokenGoal": "Demand for ice cream spikes every July; retail revenue explodes every Black Friday; electricity consumption peaks every evening. Business time series are not random walks—they are composed of systematic components: Trend (long-term trajectory), Seasonality (fixed, recurring periodic oscillations), Cyclicality (macroeconomic business cycles), and Irregular Noise. Today, we master Time Series Decomposition: choosing between Additive models (Y_t = T_t + S_t + I_t, where seasonal swings are constant) and Multiplicative models (Y_t = T_t * S_t * I_t, where seasonal swings expand proportionally with the trend). We will derive the Autocorrelation Function (ACF) and Partial Autocorrelation Function (PACF) to reveal the temporal memory of business processes.",
    "conceptInvariant": "Decomposition Model Selection Invariant: If seasonal oscillations remain constant in absolute magnitude as the underlying trend grows, an Additive decomposition is mathematically valid; if seasonal swings grow in proportion to the trend level (percentage variance), a Multiplicative decomposition (or logarithmic additive transformation ln(Y_t) = ln(T_t) + ln(S_t) + ln(I_t)) is strictly required.",
    "failureMode": "A supply chain manager uses an Additive time series model for a retail business growing at 40% annually; the model predicts a fixed $50,000 seasonal December sales bump; because sales tripled over 3 years, the true December seasonal surge was $450,000; the warehouse runs out of stock on December 4th, losing $400,000 in prime holiday revenue.",
    "tryItFriction": "Build an Automated Time Series Decomposition Engine in Python: ingest multi-year monthly retail sales; calculate moving averages to extract trend; de-trend data to extract seasonal indices; choose between Additive vs Multiplicative via residual homoskedasticity testing; compute and plot ACF and PACF correlograms up to lag 36.",
    "socraticHints": [
      "What is the mathematical difference between the Autocorrelation Function (ACF) and the Partial Autocorrelation Function (PACF)?",
      "ACF at lag k measures the total linear correlation between Y_t and Y_{t-k}, including the indirect influence of all intermediate lags (t-1, t-2, ...).",
      "PACF at lag k measures the pure direct correlation between Y_t and Y_{t-k}, after mathematically controlling for and removing the linear effects of all intermediate lags."
    ],
    "situationalPuzzle": {
      "scenario": "An analyst inspects the ACF and PACF plots for a weekly retail sales series: The ACF shows a sharp cutoff after lag 1 (ACF at lag 1 is 0.65, and lags 2, 3, 4 are all statistically zero). The PACF shows an exponential decay toward zero. What classic stochastic process generated this time series?",
      "options": [
        "Autoregressive process of order 1 (AR(1)).",
        "Moving Average process of order 1 (MA(1))! In time series theory, an MA(q) process has an ACF that cuts off abruptly after lag q, and a PACF that decays geometrically toward zero!",
        "A random walk with no structure.",
        "Seasonal SARIMA with period 52."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is the foundational Box-Jenkins identification rule: 1) For an Autoregressive AR(p) process: PACF cuts off sharply after lag p, while ACF decays exponentially or as a damped sine wave. 2) For a Moving Average MA(q) process: ACF cuts off sharply after lag q, while PACF decays exponentially toward zero. Here, the ACF cuts off after lag 1 while the PACF decays, proving definitively that the process is a pure Moving Average MA(1) model: Y_t = mu + epsilon_t + theta_1 * epsilon_{t-1}."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of Additive vs Multiplicative Classical Decomposition",
        "type": "concept",
        "description": "Formulate classical time series decomposition using centered moving averages (CMA); derive the formulas for seasonal indices in additive vs multiplicative models; formulate the Autocorrelation Function rho_k = Cov(Y_t, Y_{t-k}) / Var(Y_t) and derive the Durbin-Levinson recursion for PACF.",
        "rubric": "Step-by-step mathematical formulation of CMA; prove that seasonal indices sum to 0 (additive) or average to 1.0 (multiplicative); derive the Yule-Walker equations for PACF."
      },
      {
        "title": "The Holiday Inventory Stockout Seasonality Distortion Forensic Audit",
        "type": "detective",
        "description": "Audit an e-commerce company's demand planning: analyze how an additive forecasting model applied to a hyper-growth brand underestimated Q4 inventory by 65%; prove how taking logarithms transformed multiplicative growth into additive linearity, producing an accurate seasonal forecast that would have prevented a $3.2M stockout.",
        "rubric": "Reconstruct historical sales time series; fit both additive and multiplicative decompositions; demonstrate the variance explosion in additive residuals as trend expands; prove the mathematical superiority of log-additive transformation."
      },
      {
        "title": "Automated Time Series Decomposition & Correlogram Suite",
        "type": "mastery",
        "description": "Build an enterprise time series diagnostics platform in Python using statsmodels: automatically decompose series using STL (Seasonal-Trend decomposition using LOESS) and classical decomposition; compute sample ACF and PACF with 95% Bartlett confidence intervals; output publication-grade 4-panel diagnostic charts (Observed, Trend, Seasonal, Residual).",
        "rubric": "Clean implementation using statsmodels.tsa.seasonal.STL; robust handling of missing dates and irregular time frequencies; generate visual correlograms displaying significant lag spikes."
      },
      {
        "title": "The Calendar Anomaly & Leap Year Demand Shift War Room",
        "type": "incident",
        "description": "Handle an executive inventory panic: a retail grocery chain reports a shocking 3.5% February sales surge, and executives prepare to increase ongoing annual procurement contracts by $25M; prove that the surge was pure calendar noise: February had 29 days (Leap Year) and 5 full weekends instead of 4; normalize sales by trading days and working days to prevent a massive inventory glut.",
        "rubric": "Formulate trading-day and calendar adjustment algorithms; adjust monthly sales by day-of-week composition weights; demonstrate that on a trading-day-adjusted basis, February sales were actually flat (-0.1%), averting a $25M inventory over-purchase."
      }
    ]
  },
  {
    "day": 17,
    "month": 1,
    "blockNum": 4,
    "title": "Stationarity Physics: Unit Roots, ADF Tests & Variance Stabilization",
    "stageName": "Stage 2: Econometric Time Series, Demand Forecasting & Operations Analytics",
    "stageNum": 2,
    "pedagogicalRole": "Stochastic Stationarity & Unit Root Econometric Physics",
    "spokenGoal": "Before you can fit an ARIMA model, run a regression on time series, or forecast demand, you must confront the fundamental condition of time series econometrics: Stationarity. A time series is Weakly Stationary if its Mean and Variance are constant over time, and its Autocovariance depends only on the lag distance between points, not on the specific time t. Most economic series are non-stationary—they exhibit trending means or exploding variances. If you model non-stationary series directly, standard statistical tests collapse into Spurious Regressions! Today, we master Unit Root testing: the Augmented Dickey-Fuller (ADF) test, the KPSS test, first-differencing (Delta Y_t = Y_t - Y_{t-1}), and Box-Cox variance stabilization.",
    "conceptInvariant": "Unit Root Non-Stationarity Invariant: If a time series process contains a unit root (rho = 1 in Y_t = rho * Y_{t-1} + epsilon_t), shocks have infinite permanent memory, variance grows linearly with time Var(Y_t) = t * sigma^2, and standard central limit theorems fail; the series must be differenced d times until it is integrated of order zero I(0) before statistical modeling.",
    "failureMode": "An econometrician regresses US GDP on global average temperatures without testing for stationarity; both series exhibit strong upward trends; the regression reports an R-squared of 0.96 and a t-statistic of 24.0; the analyst claims 'temperature drives 96% of GDP growth'; both series are non-stationary random walks, and the regression is 100% spurious nonsense.",
    "tryItFriction": "Construct a Stationarity Testing & Differencing Pipeline in Python: ingest non-stationary financial asset prices; execute the Augmented Dickey-Fuller (ADF) test (null = unit root) and KPSS test (null = stationary); detect trend vs difference stationarity; apply first differencing and Box-Cox power transformations; verify that transformed series achieve strict I(0) covariance stationarity.",
    "socraticHints": [
      "Why do both the ADF test and KPSS test provide complementary information when run together?",
      "Because the ADF test has a Null Hypothesis of NON-STATIONARITY (unit root present), while the KPSS test has a Null Hypothesis of STATIONARITY.",
      "Running both tests protects you against low statistical power: if ADF rejects and KPSS fails to reject, the series is conclusively stationary; if ADF fails to reject and KPSS rejects, it is conclusively non-stationary."
    ],
    "situationalPuzzle": {
      "scenario": "An analyst tests a daily commodity price series. Raw series: ADF p-value = 0.78, KPSS p-value = 0.01. First-differenced series (Delta Price): ADF p-value = 0.0001, KPSS p-value = 0.45. What is the order of integration of this commodity price series?",
      "options": [
        "The series is integrated of order zero I(0).",
        "The series is integrated of order one I(1)! The raw series contains a unit root (ADF fails to reject H0, KPSS rejects H0), while taking first differences makes it stationary (ADF rejects H0, KPSS fails to reject H0).",
        "The series is integrated of order two I(2).",
        "The series cannot be modeled because tests disagree."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In econometric time series: A series is Integrated of Order d, denoted I(d), if it must be differenced d times to become stationary I(0). Here, the raw series fails the stationarity test: ADF p = 0.78 fails to reject the unit root null, and KPSS p = 0.01 rejects the stationary null. After taking first differences (d = 1), the ADF test strongly rejects the unit root (p = 0.0001) and the KPSS test fails to reject stationarity (p = 0.45). This confirms conclusively that the raw price series is non-stationary I(1), while its first differences (returns) are stationary I(0)."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of the Dickey-Fuller Unit Root Test",
        "type": "concept",
        "description": "Formulate the Dickey-Fuller regression Delta Y_t = alpha + beta*t + gamma*Y_{t-1} + sum delta_i*Delta Y_{t-i} + e_t; derive why the test statistic does not follow a Student-t distribution under H0: gamma = 0, but follows the non-standard Dickey-Fuller tau distribution; explain the Box-Cox transformation y(lambda) = (y^lambda - 1) / lambda.",
        "rubric": "Step-by-step mathematical formulation of DF and ADF regressions; explain why OLS t-ratios are negatively skewed under non-stationarity; write Box-Cox transformation and derivative limit as lambda -> 0 yielding ln(y)."
      },
      {
        "title": "The Spurious Cointegration Energy Trading Forensic Audit",
        "type": "detective",
        "description": "Audit an algorithmic statistical arbitrage pair-trading desk: the desk traded natural gas futures against electricity spot prices based on a high historical correlation (0.88); demonstrate how failing to test for cointegration (Engle-Granger test) allowed non-stationary drift to decouple the two assets, causing a $14M margin call liquidation.",
        "rubric": "Test both individual series for I(1) integration; test regression residuals for stationarity; demonstrate that non-cointegrated I(1) assets drift infinitely far apart over time, destroying mean-reversion trading strategies."
      },
      {
        "title": "Automated Unit Root Diagnostic & Stationarity Transformer Suite",
        "type": "mastery",
        "description": "Build an enterprise stationarity transformation pipeline in Python: ingest multi-variable economic time series; run joint ADF and KPSS tests; automatically determine optimal differencing order d and seasonal differencing D; implement automated Box-Cox lambda parameter estimation; output verified stationary I(0) feature matrices.",
        "rubric": "Clean implementation using scipy.stats.boxcox and statsmodels.tsa.stattools; automated diagnostic decision tree classifying series as I(0), I(1), or Trend-Stationary; generate visual before-and-after stationarity comparison plots."
      },
      {
        "title": "The Hyper-Inflationary Currency Devaluation Forecasting War Room",
        "type": "incident",
        "description": "Manage an international corporate treasury crisis: a foreign subsidiary operates in a country where annual inflation surges from 8% to 140%; monthly sales series exhibit explosive exponential variance; standard linear time series models fail completely; design a dual-stage variance-stabilizing transformation (Log-Differencing + Hodrick-Prescott trend filtering) to restore forecasting capability.",
        "rubric": "Apply logarithmic differencing to convert explosive nominal series into percentage growth rates; tune Hodrick-Prescott filter smoothing parameter lambda (lambda = 14400 for monthly data); construct inflation-adjusted real revenue forecasting intervals."
      }
    ]
  },
  {
    "day": 18,
    "month": 1,
    "blockNum": 4,
    "title": "Classical Forecasting: Moving Averages & Holt-Winters Triple Smoothing",
    "stageName": "Stage 2: Econometric Time Series, Demand Forecasting & Operations Analytics",
    "stageNum": 2,
    "pedagogicalRole": "Exponential Smoothing & Adaptive Forecasting Physics",
    "spokenGoal": "While econometric models can be complex, operational demand planning in enterprise ERPs (SAP, Oracle, Blue Yonder) relies heavily on Exponential Smoothing. Today, we master Charles Holt and Peter Winters' brilliant forecasting hierarchy: Simple Exponential Smoothing (SES for stationary level: L_t = alpha * Y_t + (1 - alpha) * L_{t-1}), Holt's Linear Trend Model (adding trend tracking b_t with smoothing parameter beta), and Holt-Winters Triple Exponential Smoothing (adding seasonal multipliers s_t with smoothing parameter gamma). We will derive the closed-form recurrence relations, optimize smoothing parameters (alpha, beta, gamma) via numerical sum of squared errors minimization, and handle seasonal dampening.",
    "conceptInvariant": "Exponential Smoothing Memory Decay Invariant: In simple exponential smoothing, the forecast is an exponentially weighted moving average of all past historical observations: Y_hat_{t+1} = sum_{i=0}^{inf} alpha * (1 - alpha)^i * Y_{t-i}; past data points decay geometrically at rate (1 - alpha), with higher alpha assigning greater weight to recent demand shocks.",
    "failureMode": "A consumer packaged goods company sets alpha = 0.95 in its inventory forecasting system; a brief 2-day promotional spike causes the model to dramatically over-forecast ongoing demand; the factory overproduces 500,000 units of yogurt that expire on warehouse shelves, causing a $1.8M inventory write-off.",
    "tryItFriction": "Build an Institutional Holt-Winters Triple Exponential Smoothing Engine in Python: take seasonal monthly demand series; implement Additive and Multiplicative Holt-Winters recurrence equations; optimize parameters (alpha, beta, gamma) using scipy.optimize.minimize to minimize Root Mean Squared Error (RMSE); generate 12-month forward forecasts with 95% prediction intervals.",
    "socraticHints": [
      "What is the physical meaning of the three smoothing parameters (alpha, beta, gamma) in Holt-Winters?",
      "alpha controls adaptation to changes in the base LEVEL; beta controls the TREND slope; gamma controls the SEASONAL cycle.",
      "Values close to 1.0 make the model react violently to recent fluctuations; values close to 0.0 make the model ignore noise and hold steady."
    ],
    "situationalPuzzle": {
      "scenario": "An enterprise demand planner notices that a 12-month forward forecast generated by Holt's Linear Trend model continues climbing into the stratosphere forever, predicting that sales will double in 3 years even though market capacity is limited. How should the planner modify the Holt-Winters equations to prevent unrealistic explosive trend forecasts?",
      "options": [
        "Set alpha = 1.0 to eliminate the trend.",
        "Introduce a Damped Trend parameter phi (0 < phi < 1)! Gardner and McKenzie's damped trend model dampens the trend component: Level = alpha*Y_t + (1-alpha)*(L_{t-1} + phi*b_{t-1}), causing the long-term forecast to smoothly level off into an asymptotic saturation ceiling!",
        "Delete the historical trend data.",
        "Damped trends are not supported by exponential smoothing."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Standard Holt's linear trend assumes the slope b_t persists indefinitely into the future: Forecast(h) = L_t + h * b_t. For long horizons (h > 6), this linear projection creates absurdly high forecasts. Everette Gardner and Ed McKenzie introduced the Damped Trend model: multiplying the trend by damping parameter phi (typically 0.85 to 0.98). The h-step forecast becomes Forecast(h) = L_t + (sum_{i=1}^h phi^i) * b_t. As h approaches infinity, the sum converges to phi / (1 - phi), causing the forecast curve to naturally flatten into a realistic market saturation plateau."
    },
    "quests": [
      {
        "title": "Mathematical Derivations of Holt-Winters Multiplicative Smoothing Equations",
        "type": "concept",
        "description": "Formulate the three updating equations of the Multiplicative Holt-Winters model: Level L_t = alpha * (Y_t / s_{t-m}) + (1 - alpha) * (L_{t-1} + b_{t-1}); Trend b_t = beta * (L_t - L_{t-1}) + (1 - beta) * b_{t-1}; Seasonal s_t = gamma * (Y_t / L_t) + (1 - gamma) * s_{t-m}; derive the h-step forecast formula Y_hat_{t+h} = (L_t + h * b_t) * s_{t-m+h_m}.",
        "rubric": "Detail all mathematical updating equations; derive the equivalent State Space formulation (ETS(M,A,M)); prove that simple exponential smoothing is an ARIMA(0,1,1) model."
      },
      {
        "title": "The Over-Smoothing Bullwhip Inventory Forensic Audit",
        "type": "detective",
        "description": "Audit an industrial equipment supplier's forecasting engine: trace how setting smoothing parameter alpha too low (alpha = 0.05) caused the model to lag behind a sudden 30% macroeconomic demand surge for 6 months; demonstrate how the delayed response caused severe backorders, followed by an over-correction that doubled safety stocks right as demand peaked.",
        "rubric": "Simulate low-alpha vs optimal-alpha demand tracking; quantify the phase lag delay in exponential smoothing; demonstrate how phase lags amplify the bullwhip effect in multi-echelon supply chains."
      },
      {
        "title": "Automated Holt-Winters & Damped Trend Optimization Suite",
        "type": "mastery",
        "description": "Build an enterprise forecasting engine in Python using statsmodels: implement ExponentialSmoothing with automated grid search and L-BFGS-B parameter optimization for alpha, beta, gamma, and damping parameter phi; compute in-sample AIC, BIC, and out-of-sample RMSE; generate 24-month forecasts with calibrated simulation prediction intervals.",
        "rubric": "Clean implementation using statsmodels.tsa.holtwinters; support both Additive and Multiplicative seasonal structures; generate publication-grade matplotlib forecasting charts with shaded 80% and 95% confidence bands."
      },
      {
        "title": "The Exogenous Promotion Shock Demand Calibration War Room",
        "type": "incident",
        "description": "Resolve an operations forecasting emergency: a major marketing campaign creates a massive 300% single-week sales spike for a beverage brand; traditional Holt-Winters models absorb this spike into the seasonal indices and trend, threatening to permanently distort future demand forecasts; implement outlier clipping and exogenous holiday indicator adjustments to clean the baseline before smoothing.",
        "rubric": "Implement promotional demand de-biasing algorithms; isolate baseline structural demand from promotional lift; restructure the smoothing updating loop to prevent one-time promotional anomalies from corrupting recurring seasonal multipliers."
      }
    ]
  },
  {
    "day": 19,
    "month": 1,
    "blockNum": 4,
    "title": "ARIMA & SARIMA Modeling: Box-Jenkins Methodology & Information Criteria",
    "stageName": "Stage 2: Econometric Time Series, Demand Forecasting & Operations Analytics",
    "stageNum": 2,
    "pedagogicalRole": "Box-Jenkins Autoregressive Integrated Moving Average Physics",
    "spokenGoal": "In 1970, George Box and Gwilym Jenkins revolutionized time series analysis with the Box-Jenkins Methodology: a systematic, iterative process for modeling stationary and non-stationary processes using ARIMA(p, d, q). An Autoregressive component AR(p) models the dependence on past values; the Integrated component I(d) differences the series to achieve stationarity; the Moving Average component MA(q) models the dependence on past unobserved forecast errors! When seasonality is present, we expand to Seasonal ARIMA: SARIMA(p, d, q) x (P, D, Q)_s. Today, we master the 3-stage Box-Jenkins cycle: 1) Identification (ACF/PACF inspection); 2) Estimation (Maximum Likelihood); and 3) Diagnostic Checking (Ljung-Box white noise residual tests).",
    "conceptInvariant": "Box-Jenkins White Noise Residual Invariant: An ARIMA model is adequate if and only if its residuals epsilon_t = Y_t - Y_hat_t are strictly uncorrelated White Noise: the Ljung-Box Q-test Q = n*(n+2)*sum_{k=1}^m (r_k^2 / (n-k)) must fail to reject the null hypothesis of no autocorrelation; any remaining autocorrelation in residuals indicates unextracted predictive signal.",
    "failureMode": "An analytics team selects an ARIMA(1,0,0) model for quarterly inventory based on high R-squared, ignoring that the residuals have a massive spike at lag 4 (seasonal autocorrelation); the Ljung-Box test p-value is 0.00001 (residuals are NOT white noise); the model fails to predict seasonal winter surges, costing $1.4M in stockout penalties.",
    "tryItFriction": "Construct an Automated Box-Jenkins SARIMA Engine in Python: take stationary differenced retail sales data; inspect ACF and PACF to propose candidate (p, d, q) and (P, D, Q)_s parameters; execute a grid search over candidate models; rank models using Akaike Information Criterion (AIC); execute the Ljung-Box Q-test on residuals; verify that model residuals are pure Gaussian white noise.",
    "socraticHints": [
      "What is the purpose of the Ljung-Box Q-test in ARIMA diagnostic checking?",
      "The Ljung-Box test tests the null hypothesis that an entire group of autocorrelation lags in the residuals are simultaneously equal to zero (White Noise).",
      "If the Ljung-Box p-value is less than 0.05, the residuals still contain systematic patterns that your model failed to capture, requiring you to add additional AR or MA terms."
    ],
    "situationalPuzzle": {
      "scenario": "An analyst evaluates three candidate SARIMA models for monthly electricity consumption. Model A: SARIMA(1,1,1)(1,1,1)12, AIC = 1,420, Ljung-Box p-value = 0.45. Model B: SARIMA(2,1,2)(2,1,2)12, AIC = 1,412, Ljung-Box p-value = 0.52. Model C: SARIMA(0,1,1)(0,1,1)12, AIC = 1,460, Ljung-Box p-value = 0.002. Which model should be selected for production deployment?",
      "options": [
        "Model C because it has the fewest parameters.",
        "Model B because it has the lowest AIC (1,412) AND its residuals pass the Ljung-Box white noise test (p = 0.52 > 0.05, confirming no autocorrelation remains)! Model C must be rejected because its residuals fail white noise (p = 0.002).",
        "Model A because simple models always beat complex models regardless of AIC.",
        "ARIMA models cannot be compared using AIC."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Model selection in Box-Jenkins follows two strict rules: 1) Diagnostic adequacy: Residuals MUST be white noise. Model C has a Ljung-Box p-value of 0.002 < 0.05, meaning its residuals still contain significant autocorrelated signal; Model C is statistically inadequate and must be disqualified. 2) Parsimony and Information Criteria: Among diagnostically adequate models (Models A and B, both with Ljung-Box p > 0.05), Model B achieves an AIC of 1,412 compared to Model A's 1,420 (a difference of 8 points in AIC provides strong statistical evidence in favor of Model B). Model B achieves optimal balance between predictive accuracy and parameter parsimony."
    },
    "quests": [
      {
        "title": "Mathematical Formulation of SARIMA (p, d, q) x (P, D, Q)_s",
        "type": "concept",
        "description": "Formulate the general SARIMA equation using the lag operator B: Phi_P(B^s) * phi_p(B) * (1 - B)^d * (1 - B^s)^D * Y_t = Theta_Q(B^s) * theta_q(B) * epsilon_t; derive stationarity and invertibility conditions for AR and MA polynomials; formulate the Ljung-Box Q-statistic.",
        "rubric": "Write complete polynomial lag operator representation; define characteristic roots and prove that all roots of phi(z) and Phi(z) must lie strictly outside the unit circle for stationarity; derive the degrees of freedom adjustment for Ljung-Box test on ARIMA residuals (df = m - p - q)."
      },
      {
        "title": "The Over-Differenced Negative MA Unit Root Forensic Audit",
        "type": "detective",
        "description": "Audit an econometrician who accidentally differenced an already-stationary series twice (over-differencing, d=2): analyze how over-differencing introduced an artificial moving average unit root (theta_1 = -1.0) into the residuals; demonstrate how this inflated forecast error variance and destroyed long-term prediction intervals.",
        "rubric": "Prove algebraically that differencing white noise epsilon_t creates an MA(1) process with theta_1 = -1.0; show why over-differencing eliminates genuine mean-reverting signal; formulate diagnostic checks to detect over-differencing."
      },
      {
        "title": "Automated Box-Jenkins SARIMA Grid Search & Diagnostic Suite",
        "type": "mastery",
        "description": "Develop an automated SARIMA modeling engine in Python (emulating pmdarima.auto_arima from scratch): perform stepwise heuristic search over (p, d, q) and (P, D, Q)_s parameter spaces; optimize parameters via exact Maximum Likelihood; rank models by AICc and BIC; run automated Ljung-Box and Jarque-Bera residual diagnostic checks; output production forecasts.",
        "rubric": "Clean implementation using statsmodels.tsa.statespace.sarimax.SARIMAX; automated candidate pruning based on AICc; generate publication-grade 4-panel diagnostic plot (Standardized Residuals, Histogram/KDE, Normal Q-Q, Correlogram)."
      },
      {
        "title": "The High-Volatility Energy Grid Load Forecasting War Room",
        "type": "incident",
        "description": "Manage an electric utility grid forecasting emergency: extreme summer heatwaves cause electricity demand to exhibit severe intraday (24-hour) and weekly (168-hour) dual seasonality; standard single-seasonal SARIMA fails due to matrix memory limits; implement a Multi-Seasonal Double-SARIMA or TBATS / Prophet model to forecast grid megawatts and prevent rolling blackouts.",
        "rubric": "Model complex dual seasonal cycles (hourly and daily); formulate Trigonometric seasonality with Box-Cox transformation, ARMA errors, Trend, and Seasonal components (TBATS); generate 48-hour forward hourly load forecasts with emergency peak reserve alerts."
      }
    ]
  },
  {
    "day": 20,
    "month": 1,
    "blockNum": 4,
    "title": "Forecast Evaluation & Error Metrics: MAE, MAPE, RMSE & Tracking Signals",
    "stageName": "Stage 2: Econometric Time Series, Demand Forecasting & Operations Analytics",
    "stageNum": 2,
    "pedagogicalRole": "Forecast Verification & Operational Error Physics",
    "spokenGoal": "How do you know if your forecast is any good? If you measure forecast error using the wrong metric, your supply chain will optimize for the wrong behavior. Today, we master the mathematics of Forecast Evaluation: Mean Absolute Error (MAE), Mean Absolute Percentage Error (MAPE), Root Mean Squared Error (RMSE), and Weighted MAPE (WMAPE). We will dissect the critical differences: RMSE heavily penalizes large outlier errors because errors are squared; MAPE is scale-independent and intuitive to executives, but mathematically explodes or divides by zero when sales are zero, and systematically favors forecasts that under-predict! Crucially, we master the Tracking Signal—a real-time statistical tripwire that detects persistent forecast bias before warehouse shelves empty.",
    "conceptInvariant": "MAPE Asymmetry & Zero-Division Invariant: Mean Absolute Percentage Error MAPE = (1/n) * sum |(Y_t - Y_hat_t) / Y_t| * 100 is undefined when actual sales Y_t = 0; furthermore, because the denominator is the actual value, MAPE penalizes over-forecasts (Y_hat > Y) far more heavily than under-forecasts (Y_hat < Y), creating an inherent algorithmic bias toward conservative under-forecasting.",
    "failureMode": "A retailer evaluates inventory forecasts using MAPE on slow-moving spare parts; for items with 0 sales in a month, MAPE divides by zero and crashes the pipeline; for items with 1 sale, an error of 2 units produces a 200% MAPE; the procurement team switches to Weighted MAPE (WMAPE) and Mean Absolute Scaled Error (MASE), restoring operational clarity.",
    "tryItFriction": "Build an Institutional Forecast Verification & Error Tracking Suite in Python: ingest historical forecasts and actual realization streams; compute MAE, MAPE, WMAPE, RMSE, and Mean Directional Accuracy (MDA); compute the running Tracking Signal = Cumulative Forecast Error / MAD; trigger automated alerts when the tracking signal breaches +/- 4.0 MAD bounds.",
    "socraticHints": [
      "What is the mathematical definition of a 'Tracking Signal' in demand planning?",
      "Tracking Signal = Cumulative Sum of Forecast Errors (CFE) / Mean Absolute Deviation (MAD), where an unbiased forecast hovers near zero.",
      "If the tracking signal breaches +/- 4.0 MAD bounds, the model is persistently biased (consistently under-predicting or over-predicting), requiring immediate recalibration."
    ],
    "situationalPuzzle": {
      "scenario": "A demand planner evaluates two competing forecasting algorithms for high-value surgical medical devices: Algorithm 1 has MAE = 5 units, RMSE = 6 units. Algorithm 2 has MAE = 4 units, RMSE = 18 units. If each device costs $50,000 and running out of stock carries a severe $200,000 regulatory penalty, which algorithm is safer for the business?",
      "options": [
        "Algorithm 2 because its MAE is lower (4 units vs 5 units).",
        "Algorithm 1 is vastly superior! Even though its MAE is slightly higher, its RMSE is only 6 (vs 18 for Algorithm 2). Algorithm 2's huge RMSE indicates it suffers from catastrophic large outlier forecasting errors, which would trigger fatal stockouts and massive penalties in surgical device supply chains!",
        "Both algorithms are identical because they both predict units.",
        "RMSE and MAE must always be equal."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In supply chain risk management, Root Mean Squared Error (RMSE) squares errors before averaging, making it extremely sensitive to large outlier forecasting failures. Algorithm 2 has an MAE of 4 but an RMSE of 18; this enormous divergence proves that while Algorithm 2 makes small errors on average, it occasionally produces catastrophic, massive forecasting misses (e.g., an error of 45 units!). In high-stakes medical supply chains where stockouts carry regulatory penalties and human health risks, large tail errors are disastrous. Algorithm 1's tight RMSE of 6 guarantees consistent, bounded errors without catastrophic tail blow-ups."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of Forecast Error Metrics & MASE",
        "type": "concept",
        "description": "Formulate MAE, MSE, RMSE, MAPE, WMAPE = sum |Y - Y_hat| / sum Y, and Rob Hyndman's Mean Absolute Scaled Error (MASE = MAE / MAE_naive); prove why MASE is scale-independent, symmetric, and robust to zero values; derive the mathematical properties of the Tracking Signal.",
        "rubric": "Detail mathematical expressions for all 6 error metrics; prove why MAPE penalizes over-forecasting more than under-forecasting; derive the properties of MASE showing that MASE < 1 indicates a model superior to the naive one-step persistence forecast."
      },
      {
        "title": "The Structural Bias Tracking Signal Drift Forensic Audit",
        "type": "detective",
        "description": "Audit an automotive parts distributor's inventory model: trace how an unnoticed shift in consumer driving habits caused monthly forecast errors to become persistently positive (+80 units every month for 8 months); calculate the Cumulative Forecast Error and Tracking Signal; prove that the tracking signal reached +6.2 MAD, blowing past the control threshold and trapping $4.5M in excess dead inventory.",
        "rubric": "Calculate running CFE, MAD, and Tracking Signal month by month; plot the control chart; demonstrate how an automated tracking signal tripwire would have flagged the bias in Month 3, preventing $3.8M of the inventory glut."
      },
      {
        "title": "Enterprise Forecast Verification & Backtesting Engine",
        "type": "mastery",
        "description": "Build an institutional forecast evaluation platform in Python: execute rolling-origin cross-validation (time-series backtesting) on competing forecasting models (Naive, Exponential Smoothing, SARIMA); compute MAE, RMSE, MAPE, WMAPE, MASE, and Mean Directional Accuracy (MDA); generate statistical Diebold-Mariano tests comparing whether predictive accuracy differences are statistically significant.",
        "rubric": "Implement rolling-origin cross-validation; implement the Diebold-Mariano test with Harvey-Leybourne-Newbold small sample correction; output an executive model leaderboard ranking candidate algorithms across multiple error metrics."
      },
      {
        "title": "The Supply Chain Asymmetric Loss Penalty War Room",
        "type": "incident",
        "description": "Resolve an executive inventory dispute: the CFO complains that the demand planning team 'over-forecasts inventory by 15% on average'; the VP of Operations proves that the profit loss from an under-forecast stockout ($500 per lost customer) is ten times worse than the carrying cost of an over-forecast ($50 holding cost); construct an Asymmetric Linear Loss (Lin-Lin) optimization model proving that the optimal forecast MUST be biased upward to maximize enterprise expected profit.",
        "rubric": "Formulate the Newsvendor problem as an asymmetric loss function; calculate the Critical Fractile P(Demand <= Q*) = C_u / (C_u + C_o) = 500 / 550 = 0.909; demonstrate to the CFO why an optimal operational forecast must target the 91st percentile rather than the mean."
      }
    ]
  },
  {
    "day": 21,
    "month": 1,
    "blockNum": 5,
    "title": "Vector Autoregression (VAR), Impulse Responses & Granger Causality",
    "stageName": "Stage 2: Econometric Time Series, Demand Forecasting & Operations Analytics",
    "stageNum": 2,
    "pedagogicalRole": "Multi-Variate Dynamic Econometrics Physics",
    "spokenGoal": "In macroeconomics and business strategy, variables do not exist in isolation. If a central bank hikes interest rates, how does that ripple through consumer spending, corporate investment, and currency exchange rates over the next 24 months? To model simultaneous, endogenous multi-variate interactions, Christopher Sims developed Vector Autoregression (VAR)—earning the Nobel Prize in 2011. In a VAR model, every variable is modeled as a linear function of past lags of itself AND past lags of all other variables in the system! Today, we master VAR lag order selection (AIC/BIC), Clive Granger's Granger Causality test (does variable X contain information that helps forecast Y?), Impulse Response Functions (tracing the shock wave of a 1-unit shock through the economy), and Forecast Error Variance Decomposition (FEVD).",
    "conceptInvariant": "Granger Causality Invariant: Variable X Granger-causes variable Y if and only if historical information from X provides a statistically significant improvement in forecasting Y compared to using historical information from Y alone: MSE(Y_t | Y_{<t}, X_{<t}) < MSE(Y_t | Y_{<t}); Granger causality establishes predictive precedence, not philosophical causation.",
    "failureMode": "A retail bank models loan defaults using only internal bank transaction data, ignoring macro interest rate interactions; a VAR model would have revealed that central bank rate hikes Granger-cause mortgage defaults with an 18-month transmission lag; the bank fails to tighten credit standards, absorbing a $48M credit loss during the hiking cycle.",
    "tryItFriction": "Build an Institutional Vector Autoregression (VAR) Analytics Engine in Python: take multi-variable macroeconomic series (Interest Rates, Inflation, Retail Sales); test for stationarity; select optimal lag order p via AIC/BIC; fit the VAR(p) model; execute Granger Causality F-tests across all variable pairs; compute and plot Orthogonalized Impulse Response Functions (OIRF) using Cholesky decomposition.",
    "socraticHints": [
      "What is an Impulse Response Function (IRF) in a VAR model?",
      "An IRF traces the dynamic path of an endogenous variable over future periods in response to a sudden one-standard-deviation exogenous shock to another variable in the system.",
      "For example, it answers: 'If oil prices spike by $10 today, exactly how much will corporate freight costs rise in Month 1, Month 3, and Month 12?'"
    ],
    "situationalPuzzle": {
      "scenario": "An enterprise analytics team fits a bivariate VAR on Digital Marketing Ad Spend (X) and In-Store Retail Revenue (Y). An F-test for Granger Causality yields: 1) H0: 'Ad Spend does not Granger-cause Revenue' has p-value = 0.001 (rejection of null). 2) H0: 'Revenue does not Granger-cause Ad Spend' has p-value = 0.42 (failure to reject). What is the econometric conclusion?",
      "options": [
        "Revenue causes ad spend, but ad spend does not cause revenue.",
        "There is strong unidirectional Granger causality from Ad Spend to Revenue! Historical advertising spend contains statistically significant predictive information about future retail revenue, confirming that marketing precedes sales and is not simply reactive budgeting!",
        "Both variables are independent.",
        "Granger causality proves that advertising physically forces customers to buy."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In Granger causality testing: The test checks whether lagged values of variable X significantly predict variable Y in a joint autoregressive equation. Here: 1) Past Ad Spend significantly predicts future Revenue (p = 0.001 < 0.05), rejecting the null of non-causality. 2) Past Revenue does NOT predict future Ad Spend (p = 0.42 > 0.05), failing to reject the null. This proves unidirectional Granger causality: advertising precedes and forecasts sales. Crucially, it rules out reverse causality (e.g., companies merely spending money when revenue is already high), providing empirical justification for marketing capital allocation."
    },
    "quests": [
      {
        "title": "Mathematical Derivations of Vector Autoregression & Cholesky IRF",
        "type": "concept",
        "description": "Formulate the multi-variate VAR(p) matrix equation Y_t = c + sum_{i=1}^p A_i * Y_{t-i} + e_t, where e_t ~ N(0, Sigma); derive the stability condition det(I - sum A_i * z^i) != 0 for |z| <= 1; derive the Orthogonalized Impulse Response Function using Cholesky factorization Sigma = P * P^T; formulate Forecast Error Variance Decomposition (FEVD).",
        "rubric": "Step-by-step matrix formulation of VAR; prove how moving average representation Y_t = sum Psi_i * e_{t-i} is transformed by P to eliminate contemporaneous correlation across innovations; formulate FEVD percentages."
      },
      {
        "title": "The WTI Crude Oil Macroeconomic Transmission Forensic Audit",
        "type": "detective",
        "description": "Audit an airline's corporate hedging strategy during an oil price shock: build a 3-variable VAR on Crude Oil, Jet Fuel Spreads, and Airline Operating Margin; trace the Impulse Response Function to prove that an oil shock hits fuel costs in 14 days but takes 120 days to pass through into ticket pricing; quantify the $22M cash burn during the 4-month transmission gap.",
        "rubric": "Estimate 3-variable VAR model; compute Cholesky orthogonalized impulse responses; analyze variance decomposition showing oil explains 78% of operating margin variance; design a cash flow bridge hedging the 120-day pass-through gap."
      },
      {
        "title": "Institutional VAR Modeling & Granger Causality Engine",
        "type": "mastery",
        "description": "Construct an enterprise dynamic econometric platform in Python using statsmodels: accept N stationary time series; select optimal lag order using AIC, BIC, and HQIC; fit VAR model; run pairwise and block Granger causality tests; compute orthogonalized IRFs with bootstrap confidence bands; generate FEVD stacked bar charts showing variance attribution.",
        "rubric": "Clean implementation using statsmodels.tsa.api.VAR; automated identification of optimal lag order; generate publication-grade multi-panel IRF charts displaying dynamic response trajectories over 24 periods."
      },
      {
        "title": "The Supply Chain Disruption Dynamic Contagion War Room",
        "type": "incident",
        "description": "Lead an executive supply chain risk simulation: following a semiconductor factory fire, the enterprise faces component supply constraints; model a 4-variable VAR on Semiconductor Lead Times, Factory Production Output, Dealer Inventory, and Lost Sales; trace the dynamic impulse response wave over 18 months to identify the exact month when dealer inventory will hit zero, structuring an emergency air-freight buffer.",
        "rubric": "Simulate a 3-sigma shock to component lead times; calculate the trough in downstream dealer inventory via IRF; present a data-driven contingency timeline to the Chief Supply Chain Officer preventing dealership stockouts."
      }
    ]
  },
  {
    "day": 22,
    "month": 1,
    "blockNum": 5,
    "title": "Econometric Panel Data: Pooled OLS, Fixed Effects vs Random Effects & Hausman Test",
    "stageName": "Stage 2: Econometric Time Series, Demand Forecasting & Operations Analytics",
    "stageNum": 2,
    "pedagogicalRole": "Longitudinal Panel Econometrics & Unobserved Heterogeneity Physics",
    "spokenGoal": "In business analytics, we rarely observe a single time series or a pure cross-section; we observe Panel Data (Longitudinal Data): tracking 500 retail stores over 48 months, or tracking 10,000 customers over 5 years! Panel data gives us immense econometric power, but only if we handle Unobserved Heterogeneity. What if Store #14 has an extraordinary store manager, or Store #22 has prime real estate foot traffic that you failed to measure? If unobserved store-specific traits correlate with your predictors, Pooled OLS is hopelessly biased! Today, we master Panel Econometrics: the Fixed Effects (Within Estimator) model (which completely washes away all time-invariant unobserved traits!), the Random Effects model (GLS), and the definitive Jerry Hausman Specification Test.",
    "conceptInvariant": "Fixed Effects De-Meaning Invariant: In the Fixed Effects model y_{it} = alpha_i + beta * x_{it} + u_{it}, de-meaning every variable by subtracting its entity-specific time average (y_{it} - y_bar_i) = beta * (x_{it} - x_bar_i) + (u_{it} - u_bar_i) completely eliminates the unobserved entity-specific fixed effect alpha_i, guaranteeing unbiased beta estimates even if alpha_i is highly correlated with x_{it}.",
    "failureMode": "An analytics team evaluates the impact of store remodeling on sales using Pooled OLS across 200 stores; because management selectively remodeled only the highest-performing, prime-location stores, Pooled OLS attributes the prime location premium to the paint job; the model overstates remodeling ROI by 300%; switching to Fixed Effects washes away the location effect, revealing remodeling barely breaks even.",
    "tryItFriction": "Build an Econometric Panel Data Analytics Suite in Python: ingest a multi-entity longitudinal dataset (stores over time); fit Pooled OLS, Fixed Effects (Entity De-meaning), and Random Effects (GLS); execute the Hausman Specification Test to test H0: Random Effects is consistent; interpret whether unobserved entity traits correlate with predictors.",
    "socraticHints": [
      "What is the core economic distinction between the Fixed Effects model and the Random Effects model?",
      "Fixed Effects assumes that unobserved entity-specific characteristics (alpha_i) MAY correlate with the explanatory variables (x_{it}); it controls for all time-invariant traits by wiping them out.",
      "Random Effects assumes that unobserved entity characteristics (alpha_i) are completely UNCORRELATED with all explanatory variables; if this assumption is violated, Random Effects is inconsistent and biased."
    ],
    "situationalPuzzle": {
      "scenario": "An economist evaluates a corporate employee training program across 5,000 employees over 4 years. Random Effects estimates a training wage boost of +14.2%. Fixed Effects estimates a training wage boost of +3.1%. The Hausman Specification Test comparing the two models yields a test statistic of Chi-Square = 48.5 with a p-value = 0.000001. Which model should the Chief Human Resources Officer believe?",
      "options": [
        "Believe Random Effects because 14.2% indicates higher training impact.",
        "Believe Fixed Effects (+3.1%)! The Hausman test strongly rejects the null hypothesis (p < 0.0001), proving that unobserved employee characteristics (such as ambition, drive, and innate ability) correlate with who volunteers for training. Random Effects is biased by selection; Fixed Effects isolates the true causal 3.1% effect!",
        "Take the average of the two models (8.65%).",
        "Panel data models cannot be compared statistically."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. The Hausman Specification Test tests the null hypothesis H0: 'The Random Effects estimator is consistent and efficient' against H1: 'Random Effects is inconsistent (alpha_i correlates with x_{it}), and only Fixed Effects is consistent'. A tiny p-value (p = 0.000001) overwhelmingly rejects the null hypothesis! This proves that ambitious, high-ability employees systematically volunteered for training; Random Effects conflated innate ability with training impact (+14.2%). Fixed Effects de-means the data, comparing each employee only to themselves over time, removing the unobserved ability bias and revealing the true causal training impact of +3.1%."
    },
    "quests": [
      {
        "title": "Mathematical Derivation of Within-Estimator Fixed Effects & The Hausman Test",
        "type": "concept",
        "description": "Formulate the panel data model y_{it} = X_{it}*beta + alpha_i + u_{it}; derive the Within-Estimator by subtracting entity-specific means; prove why time-invariant variables (e.g., gender, race, founding year) cannot be estimated in Fixed Effects; derive the Hausman test statistic H = (beta_FE - beta_RE)^T * [Var(beta_FE) - Var(beta_RE)]^(-1) * (beta_FE - beta_RE) ~ Chi^2(k).",
        "rubric": "Step-by-step matrix derivation of the within transformation; prove orthogonality of projection matrix Q; derive the asymptotic variance matrix difference in the Hausman statistic; explain First-Difference estimator as an alternative."
      },
      {
        "title": "The Retail Store Remodeling Selection Bias Forensic Audit",
        "type": "detective",
        "description": "Audit a supermarket chain's $100M store remodeling ROI study: demonstrate how Pooled OLS and Random Effects reported a +18% remodeling revenue lift; apply Fixed Effects to prove that unobserved store foot-traffic advantages accounted for 14% of the gain, leaving a true causal remodeling impact of only +4% (below the corporate cost of capital); rescue the company from a disastrous $200M debt-funded rollout.",
        "rubric": "Fit Pooled OLS, Random Effects, and Fixed Effects on the supermarket panel; execute Hausman test; prove how selection bias inflated capital return metrics; draft an executive memo to the Board of Directors."
      },
      {
        "title": "Institutional Panel Data Econometric Suite in Python",
        "type": "mastery",
        "description": "Build an enterprise panel econometrics module in Python using linearmodels: support MultiIndex (Entity, Time) data structures; fit Pooled OLS, Fixed Effects (with entity and two-way time fixed effects), and Random Effects; compute clustered robust standard errors (clustering by Entity to handle serial correlation); execute automated Hausman test; format results into professional econometric tables.",
        "rubric": "Clean implementation using linearmodels.panel; support two-way fixed effects (Entity + Time); handle clustered standard errors; generate publication-grade summary comparison tables."
      },
      {
        "title": "The Dynamic Firm Leverage Capital Structure Panel War Room",
        "type": "incident",
        "description": "Investigate an academic corporate finance controversy: empirical studies disagree on whether high profitability causes firms to lower debt (Pecking Order) or raise debt (Trade-Off); fit two-way fixed effects panel models across 2,000 public firms over 20 years; evaluate whether time-invariant firm culture (conservative vs aggressive management) created spurious Pooled OLS conclusions.",
        "rubric": "Structure the panel regression with firm fixed effects and macroeconomic year fixed effects; analyze the reversal of profitability coefficients between Pooled OLS and Fixed Effects; present a definitive capital structure findings brief."
      }
    ]
  },
  {
    "day": 23,
    "month": 1,
    "blockNum": 5,
    "title": "Instrumental Variables (IV), Two-Stage Least Squares (2SLS) & Endogeneity",
    "stageName": "Stage 2: Econometric Time Series, Demand Forecasting & Operations Analytics",
    "stageNum": 2,
    "pedagogicalRole": "Causal Identification & Endogeneity Resolution Physics",
    "spokenGoal": "What do you do when your primary explanatory variable is hopelessly corrupted by Endogeneity (correlated with the error term: Cov(X, u) != 0)? This happens constantly in business analytics due to Simultaneous Causality (Price affects Demand, but Demand also affects Price!) and Omitted Variable Bias. Standard OLS is biased and inconsistent. To extract the true causal effect, econometricians use Instrumental Variables (IV) and Two-Stage Least Squares (2SLS). An Instrument (Z) is a variable that is 1) Relevant: strongly correlates with the endogenous predictor X (First-Stage F-statistic > 10); and 2) Exogenous: affects outcome Y ONLY through its effect on X (Cov(Z, u) = 0). Today, we master the mathematics of 2SLS, weak instrument diagnostics, and the Sargan-Hansen test!",
    "conceptInvariant": "Instrumental Variable Identification Invariant: An instrument Z identifies the causal effect of endogenous variable X on outcome Y if and only if: 1) Instrument Relevance: Cov(Z, X) != 0 (First-stage F > 10); and 2) Exclusion Restriction: Cov(Z, u) = 0 (Z has no direct effect on Y except through X); the IV estimator beta_IV = Cov(Z, Y) / Cov(Z, X) recovers the clean local average treatment effect (LATE).",
    "failureMode": "An econometrician attempts to estimate price elasticity using rainfall in London as an instrument for ice cream sales in New York; the instrument has zero relevance (First-stage F = 0.8 < 10); using a Weak Instrument causes 2SLS standard errors to explode by 1,000% and biases coefficient estimates far worse than raw OLS, producing meaningless junk.",
    "tryItFriction": "Construct a Two-Stage Least Squares (2SLS) Regression Engine from Scratch in Python using pure numpy: simulate an endogenous system with omitted variable bias; generate a valid exogenous instrument Z; execute Stage 1: regress endogenous X on Z to get fitted X_hat; execute Stage 2: regress Y on fitted X_hat; compute correct 2SLS standard errors (using original X for residual variance s^2); verify recovery of true causal beta.",
    "socraticHints": [
      "Why can you NOT simply use the standard errors from the second-stage OLS regression when doing 2SLS manually?",
      "Because the second-stage regression uses the predicted values X_hat to compute residuals, underestimating the true error variance.",
      "The true residuals must be calculated using the ACTUAL observed endogenous X values: e = Y - X * beta_2SLS; using X_hat produces falsely narrow standard errors."
    ],
    "situationalPuzzle": {
      "scenario": "A ride-hailing company wants to estimate the true price elasticity of passenger demand. A simple OLS regression of Ride Volume (Y) on Surge Price (X) yields a POSITIVE coefficient (+0.35, implying higher prices increase rides!). The team recognizes simultaneous causality: bad weather causes both high demand and triggers surge pricing! The team proposes using 'Local Wholesale Gasoline Refinery Disruptions' as an instrument Z for price. Is this instrument valid?",
      "options": [
        "No, because gasoline has no relationship to transportation.",
        "Yes! Instrument Relevance: Refinery disruptions increase fuel costs, which directly drive up driver ride prices (Cov(Z, X) != 0). Exclusion Restriction: Wholesale refinery maintenance has no direct impact on a passenger's desire to take a ride other than through the price charged (Cov(Z, u) = 0)! 2SLS will eliminate the weather endogeneity and recover the true negative price elasticity!",
        "No, instruments must always be customer demographics.",
        "OLS positive elasticity is correct and passengers prefer paying more."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In supply-demand econometrics, raw OLS estimates of price elasticity are notoriously biased upward (often positive!) due to simultaneous causality: high demand shocks trigger algorithmic surge pricing. To identify true demand elasticity, we need a Supply-Side Cost Shifter as an instrument. Wholesale refinery disruptions or gas tax changes shift the supply cost curve (driving prices up) without directly shifting passenger demand preferences (satisfying the exclusion restriction). In 2SLS, isolating price variation driven purely by supply shocks washes away the demand-side weather confounding, successfully recovering the true negative price elasticity."
    },
    "quests": [
      {
        "title": "Mathematical Derivations of Instrumental Variables & 2SLS",
        "type": "concept",
        "description": "Derive the simple IV estimator beta_IV = (Z^T * X)^(-1) * Z^T * y and prove its consistency plim(beta_IV) = beta when Cov(Z, u) = 0; derive the general Two-Stage Least Squares (2SLS) matrix estimator beta_2SLS = [ X^T * Z * (Z^T * Z)^(-1) * Z^T * X ]^(-1) * X^T * Z * (Z^T * Z)^(-1) * Z^T * y; explain the Stock-Yogo weak instrument critical values (F > 10 rule).",
        "rubric": "Step-by-step matrix derivation of 2SLS; show that 2SLS replaces X with its projection onto the instrument column space P_Z * X; formulate the correct asymptotic variance-covariance matrix; derive the Sargan-Hansen test for overidentifying restrictions."
      },
      {
        "title": "The Weak Instrument Asymptotic Breakdown Forensic Audit",
        "type": "detective",
        "description": "Audit an econometric study estimating the impact of advertising on sales using a weak instrument (First-stage F = 2.4): prove mathematically that when instruments are weak, the 2SLS estimator is biased toward the OLS estimator and its t-statistics are completely invalid; demonstrate how using the Anderson-Rubin robust confidence interval exposes that the true confidence interval is infinitely wide.",
        "rubric": "Simulate weak instrument data generation; demonstrate the bimodality of 2SLS finite-sample distributions under weak instruments; compute Anderson-Rubin test statistics robust to weak identification."
      },
      {
        "title": "Two-Stage Least Squares (2SLS) Econometric Engine in Python",
        "type": "mastery",
        "description": "Build an enterprise IV / 2SLS modeling platform in Python using linearmodels.iv: support multiple endogenous variables and multiple instruments; compute First-Stage regression diagnostics (F-statistic, partial R^2); estimate second-stage 2SLS coefficients; execute the Wu-Hausman test for endogeneity; execute the Sargan-Hansen J-test for instrument exogeneity; format results into econometric tables.",
        "rubric": "Clean implementation using linearmodels.iv.IV2SLS; automated reporting of first-stage F-statistic against Stock-Yogo thresholds; execute Wu-Hausman endogeneity test comparing OLS vs 2SLS."
      },
      {
        "title": "The Digital Ad Platform Endogeneity & Auction War Room",
        "type": "incident",
        "description": "Advise a major corporate advertiser: the marketing agency reports that higher ad bids correlate with higher customer conversion rates, claiming bids directly cause conversion quality; prove endogeneity (competitive keyword auctions: high-intent keywords naturally command higher bids); construct an instrumental variable based on competitor auction bidding outages to identify the true causal return on ad spend (ROAS).",
        "rubric": "Formulate the endogeneity mechanism in second-price ad auctions; design the natural experiment instrument; execute 2SLS estimation to establish the true unconfounded marginal return on ad spend."
      }
    ]
  },
  {
    "day": 24,
    "month": 1,
    "blockNum": 5,
    "title": "Quasi-Experimental Causal Inference: Difference-in-Differences & Synthetic Controls",
    "stageName": "Stage 2: Econometric Time Series, Demand Forecasting & Operations Analytics",
    "stageNum": 2,
    "pedagogicalRole": "Quasi-Experimental Program Evaluation & Policy Impact Physics",
    "spokenGoal": "What happens when you cannot run a randomized A/B test? You cannot randomly assign minimum wage hikes to some workers and not others, or randomly impose new tax laws on half your retail stores. When true experiments are impossible, we use Quasi-Experimental Econometrics! Today, we master David Card's Nobel-prize-winning Difference-in-Differences (DiD) framework: comparing the change in outcomes over time between a Treatment Group and an untreated Control Group: DiD = (Y_treat,post - Y_treat,pre) - (Y_ctrl,post - Y_ctrl,pre). Crucially, we test the sacred Parallel Trends Assumption! We also master Alberto Abadie's revolutionary Synthetic Control Method: constructing a convex combination of untreated units to create an artificial 'twin' for a single treated entity (e.g., California's Proposition 99 tobacco tax).",
    "conceptInvariant": "Difference-in-Differences Parallel Trends Invariant: The DiD estimator beta_3 in Y_{it} = beta_0 + beta_1*Treat_i + beta_2*Post_t + beta_3*(Treat_i * Post_t) + u_{it} identifies the true causal average treatment effect on the treated (ATT) if and only if the Parallel Trends Assumption holds: in the absence of treatment, the treatment group and control group would have followed parallel trajectory slopes over time.",
    "failureMode": "A retail chain launches an in-store loyalty program in its 20 fastest-growing urban stores and uses 20 rural stores as controls; sales grow 12% faster in urban stores; the team claims the loyalty program caused the 12% lift; testing pre-treatment trends reveals urban stores were ALREADY growing 12% faster prior to the program (Parallel Trends violated); the loyalty program had a true causal effect of exactly zero.",
    "tryItFriction": "Construct a Difference-in-Differences & Synthetic Control Engine in Python: take state-level policy adoption data (treatment in Period T); test pre-treatment parallel trends via dynamic event-study regression; estimate the interaction coefficient beta_3; build a Synthetic Control optimizer solving min ||X_1 - X_0 * W|| subject to sum(w) = 1 and w >= 0; plot the classic synthetic control gap chart.",
    "socraticHints": [
      "Why does Difference-in-Differences subtract the control group's change from the treatment group's change?",
      "Because external macroeconomic events (e.g., a recession or inflation) affect both groups simultaneously over time.",
      "Subtracting the control group's pre-post change washes away the shared macroeconomic time trend, leaving only the idiosyncratic causal effect of the treatment."
    ],
    "situationalPuzzle": {
      "scenario": "A retailer introduces a new customer service training program in Region A, using untreated Region B as control. Region A sales were $100M before training and $130M after training (+$30M change). Region B sales were $80M before and $95M after (+$15M change). What is the Difference-in-Differences (DiD) causal estimate of the training program on Region A sales?",
      "options": [
        "The causal effect is +$30M (the increase in Region A).",
        "The causal effect is +$15M! (+$30M change in Treatment Region A minus the +$15M macroeconomic baseline growth observed in Control Region B = +$15M true causal incremental impact)!",
        "The causal effect is +$45M (sum of both changes).",
        "DiD cannot be calculated with only two regions."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us apply the fundamental Difference-in-Differences formula: 1) First Difference (Treatment Group change): Delta Y_treat = $130M - $100M = +$30M. 2) Second Difference (Control Group change): Delta Y_control = $95M - $80M = +$15M. 3) Difference-in-Differences: DiD = Delta Y_treat - Delta Y_control = $30M - $15M = +$15M. Control Region B grew by $15M purely due to broader market momentum. Subtracting that baseline growth reveals that exactly $15M of Region A's $30M growth was caused by the training program, while the other $15M was passive macro trend."
    },
    "quests": [
      {
        "title": "Mathematical Derivations of Difference-in-Differences & Dynamic Event-Study",
        "type": "concept",
        "description": "Formulate the 2x2 DiD regression model Y_{it} = beta_0 + beta_1*Treat_i + beta_2*Post_t + beta_3*(Treat_i * Post_t) + u_{it}; prove algebraically that beta_3 = (Y_bar_1,1 - Y_bar_1,0) - (Y_bar_0,1 - Y_bar_0,0); formulate the Dynamic Event-Study regression with lead and lag indicators to test pre-treatment parallel trends.",
        "rubric": "Step-by-step algebraic proof showing beta_3 equals the double difference of conditional expectations; formulate the event-study specification sum_{k != -1} gamma_k * (Treat_i * D_t^k); prove that gamma_k = 0 for all k < 0 verifies parallel trends."
      },
      {
        "title": "The Card & Krueger Minimum Wage Landmark Forensic Audit",
        "type": "detective",
        "description": "Audit David Card and Alan Krueger's historic 1994 New Jersey / Pennsylvania minimum wage study: analyze how New Jersey raised the minimum wage from $4.25 to $5.05 while neighboring eastern Pennsylvania kept it at $4.25; demonstrate how DiD comparing fast-food employment before and after proved that modest minimum wage increases did NOT reduce employment, revolutionizing labor economics.",
        "rubric": "Reconstruct the Card-Krueger 2x2 data matrix; compute DiD estimates and standard errors; evaluate threats to validity (telephone survey data quality, boundary spillover effects)."
      },
      {
        "title": "Synthetic Control Method Optimization Engine in Python",
        "type": "mastery",
        "description": "Build an enterprise Synthetic Control platform in Python: formulate the constrained optimization problem minimizing predictor distance ||X_1 - X_0 * W||_V subject to non-negative weights summing to 1; construct a synthetic twin for a treated business entity using a donor pool of 20 control entities; execute in-space and in-time placebo permutation tests to compute exact p-values.",
        "rubric": "Implement constrained quadratic programming using scipy.optimize; generate Abadie-style trajectory comparison plot showing treated vs synthetic control; run placebo permutations across all donor pool units to generate the ratio of post-intervention to pre-intervention MSPE."
      },
      {
        "title": "The Corporate Tax Reform Policy Evaluation War Room",
        "type": "incident",
        "description": "Evaluate an enterprise state-level tax policy shock: a major state cuts corporate taxes from 9% to 5%; management considers investing $50M in a new regional distribution center; use Difference-in-Differences across neighboring non-cutting states and Synthetic Control methods to quantify the true causal economic boost in corporate capital investment vs passive national trends.",
        "rubric": "Execute synthetic control matching across donor states; verify pre-treatment fit; calculate the post-reform capital investment treatment effect; present an objective investment recommendation to the Board of Directors."
      }
    ]
  },
  {
    "day": 25,
    "month": 1,
    "blockNum": 5,
    "title": "Price Elasticity of Demand & Dynamic Revenue Optimization",
    "stageName": "Stage 2: Econometric Time Series, Demand Forecasting & Operations Analytics",
    "stageNum": 2,
    "pedagogicalRole": "Microeconomic Pricing Physics & Revenue Management",
    "spokenGoal": "Price is the single most powerful lever of business profitability: a 1% improvement in price optimization creates an average 11% improvement in operating profit—far higher than cutting costs or boosting volume! Today, we master the econometric physics of Pricing: Own-Price Elasticity of Demand (E_d = (% Delta Q) / (% Delta P)), Cross-Price Elasticity (substitutes vs complements), and the fundamental Amoroso-Robinson Revenue Maximization Condition: Optimal Price P* = Marginal Cost / (1 - 1 / |E_d|). We will model customer Willingness-to-Pay (WTP), segment customers by price sensitivity, and build real-time dynamic pricing algorithms used by airlines, hotels, and ride-hailing platforms.",
    "conceptInvariant": "Amoroso-Robinson Optimal Pricing Invariant: For any profit-maximizing enterprise with market power facing price elasticity E_d (where |E_d| > 1), optimal price P* satisfies Marginal Revenue = Marginal Cost, yielding the Lerner Index markup rule: (P* - MC) / P* = 1 / |E_d|; operating in the inelastic portion of the demand curve (|E_d| < 1) guarantees that raising price will simultaneously increase revenue AND reduce production costs.",
    "failureMode": "A SaaS company with an elasticity of demand |E_d| = 0.40 (inelastic demand) cuts prices by 20% to 'gain market share'; because customers are insensitive to price, sales volume rises by only 8%; total revenue drops by 13.6% and profit collapses by 42%; cutting prices in an inelastic market is corporate suicide.",
    "tryItFriction": "Build an Automated Price Elasticity & Revenue Optimization Engine in Python: ingest historical price and unit sales transaction logs; fit Log-Log demand functions to estimate empirical price elasticity E_d; compute the profit-maximizing price P* given marginal production costs; simulate revenue surfaces across price points; demonstrate how dynamic surge pricing optimizes load factors under capacity constraints.",
    "socraticHints": [
      "Why should a profit-maximizing firm NEVER operate on the inelastic portion of its demand curve (|E_d| < 1)?",
      "Because if demand is inelastic (|E_d| < 1), raising prices causes demand to fall by a smaller percentage than the price increase, resulting in HIGHER total revenue.",
      "At the same time, producing fewer units lowers total operating costs; higher revenue plus lower costs means higher profit; thus, a firm should always raise prices until it reaches the elastic region (|E_d| > 1)."
    ],
    "situationalPuzzle": {
      "scenario": "A manufacturer produces an industrial chemical with a constant Marginal Cost MC = $60 per unit. An econometric study reveals that the price elasticity of demand is constant at E_d = -2.5. Using the Lerner Index markup rule (P* - MC) / P* = 1 / |E_d|, what is the profit-maximizing optimal price P*?",
      "options": [
        "Optimal price is $60 (sell at marginal cost).",
        "Optimal price is $100! (P* = MC / (1 - 1/|E_d|) = $60 / (1 - 1/2.5) = $60 / (1 - 0.40) = $60 / 0.60 = $100.00 per unit)!",
        "Optimal price is $150.",
        "Optimal price cannot be calculated without fixed overhead costs."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us apply the classic Amoroso-Robinson optimal pricing condition: Set Marginal Revenue = Marginal Cost. MR = P * (1 - 1/|E_d|) = MC. Solving for optimal price: P* = MC / [ 1 - 1/|E_d| ]. Given MC = $60 and |E_d| = 2.5: 1) 1 / |E_d| = 1 / 2.5 = 0.40. 2) Denominator = 1 - 0.40 = 0.60. 3) P* = $60 / 0.60 = $100.00. Notice that Fixed Costs are completely irrelevant to optimal marginal pricing! The optimal markup is (100 - 60) / 100 = 40% = 1 / 2.5. Pricing at $100 maximizes enterprise operating profit."
    },
    "quests": [
      {
        "title": "Mathematical Derivations of the Lerner Index & Amoroso-Robinson Relation",
        "type": "concept",
        "description": "Derive the Amoroso-Robinson formula MR = P * (1 + 1/E_d) from the total revenue derivative d(P*Q)/dQ; derive the Lerner Index (P - MC)/P = -1/E_d; formulate the Multi-Product pricing equation with cross-price elasticities E_ij for complementary and substitute product lines.",
        "rubric": "Step-by-step calculus derivation of MR; prove that MR > 0 if and only if |E_d| > 1; derive the multi-product first-order conditions showing how cannibalization shifts optimal markups."
      },
      {
        "title": "The Inelastic Price Cut Profit Destruction Forensic Audit",
        "type": "detective",
        "description": "Audit an enterprise software vendor that engaged in a price war: the CEO slashed annual enterprise contract pricing from $50,000 to $35,000 (-30%); prove that demand elasticity was only -0.65; calculate how volume increased by only 19.5%, resulting in a net revenue contraction of 16.3% and wiping out $28M in EBITDA.",
        "rubric": "Reconstruct pre- and post-discount sales data; compute empirical price elasticity; prove that the price cut violated the Amoroso-Robinson condition, resulting in severe corporate value destruction."
      },
      {
        "title": "Dynamic Revenue Management & Surge Pricing Simulation Engine",
        "type": "mastery",
        "description": "Build an institutional dynamic pricing and revenue management simulator in Python: model real-time demand across 24 hourly periods with price-sensitive customer segments (business vs leisure); solve optimal prices subject to hard capacity constraints (Littlewood's Rule / Expected Marginal Seat Revenue EMSRb for airline/hotel seats); generate revenue surface heatmaps.",
        "rubric": "Clean implementation of EMSRb algorithm; dynamic simulation of booking curves over 30 days prior to departure; output comparative charts demonstrating how dynamic pricing boosts load factors and total yield by 18% over fixed pricing."
      },
      {
        "title": "The Algorithmic Collusion Antitrust War Room",
        "type": "incident",
        "description": "Respond to a major regulatory antitrust investigation: competition authorities allege that two competing online travel platforms used dynamic pricing algorithms that tacitly colluded to fix hotel prices at inflated levels without human communication; conduct an econometric price leadership and variance decomposition audit to prove the algorithms were responding independently to common marginal cost shocks.",
        "rubric": "Model algorithmic price reaction functions; analyze whether price synchronicity was driven by common cost shocks (high hotel occupancy) vs anti-competitive algorithmic signaling; draft an authoritative econometric defense brief for regulatory authorities."
      }
    ]
  },
  {
    "day": 26,
    "month": 1,
    "blockNum": 6,
    "title": "Supply Chain Analytics: ABC-XYZ Inventory Classification & Safety Stocks",
    "stageName": "Stage 2: Econometric Time Series, Demand Forecasting & Operations Analytics",
    "stageNum": 2,
    "pedagogicalRole": "Operations Analytics & Stochastic Inventory Matrix Physics",
    "spokenGoal": "A large enterprise warehouse manages 50,000 distinct Stock Keeping Units (SKUs). If you manage all 50,000 SKUs with the same forecasting model and safety stock policy, you will either run out of critical items or drown in holding costs. Today, we master Supply Chain Analytics: ABC-XYZ Classification. ABC analysis segments items by Revenue Contribution (Pareto 80/20: Category A = top 80% revenue, Category B = next 15%, Category C = bottom 5%). XYZ analysis segments items by Demand Predictability / Volatility (Coefficient of Variation CV = sigma / mu: X = highly predictable CV < 0.5, Y = moderate volatility, Z = erratic lumpy demand CV > 1.0). Crossing both yields a 9-box operational matrix that dictates automated procurement rules!",
    "conceptInvariant": "Stochastic Lead-Time Safety Stock Invariant: When both daily customer demand and supplier replenishment lead times are independent random variables, the required safety stock to achieve service level Z_alpha equals: SS = Z_alpha * sqrt( L_bar * sigma_D^2 + D_bar^2 * sigma_L^2 ); lead-time variance compounds demand variance non-linearly.",
    "failureMode": "A supply chain manager sizes safety stock assuming supplier delivery lead time is perfectly constant (ignoring lead-time variance); when global shipping congestion introduces lead-time variance (sigma_L = 8 days), stockouts surge by 400%, shutting down an assembly plant for 12 days and costing $6M in downtime penalties.",
    "tryItFriction": "Construct an Enterprise ABC-XYZ Inventory Matrix & Safety Stock Suite in Python: ingest multi-SKU transaction logs; compute cumulative revenue shares for ABC categorization; compute Coefficient of Variation (CV) for XYZ classification; calculate dynamic safety stocks across all 9 cells using dual-stochastic demand and lead-time variance equations; generate visual 9-box matrix heatmaps.",
    "socraticHints": [
      "What is the operational strategy for an 'AX' item versus a 'CZ' item in the ABC-XYZ matrix?",
      "AX items (High Revenue, High Predictability): Automate completely with Just-In-Time (JIT) replenishment and low safety stocks.",
      "CZ items (Low Revenue, Erratic Lumpy Demand): Keep zero safety stock and order strictly on-demand (make-to-order), or eliminate them entirely from the catalog."
    ],
    "situationalPuzzle": {
      "scenario": "A component has average daily demand D_bar = 100 units with standard deviation sigma_D = 20 units. Average supplier lead time is L_bar = 9 days with standard deviation sigma_L = 2 days. The target service level is 95% (Z = 1.645). What is the required Safety Stock when considering demand variance alone versus when considering BOTH demand and lead-time variance?",
      "options": [
        "Safety stock is 100 units in both cases.",
        "Demand variance alone requires SS = 1.645 * sqrt(9 * 20^2) = 1.645 * 60 = 98.7 units (~99 units). Considering BOTH demand and lead-time variance: SS = 1.645 * sqrt(9 * 20^2 + 100^2 * 2^2) = 1.645 * sqrt(3,600 + 40,000) = 1.645 * sqrt(43,600) = 1.645 * 208.8 = 343.5 units (~344 units)! Lead-time uncertainty increases required safety stock by 248%!",
        "Safety stock is 500 units.",
        "Lead time variance does not impact inventory buffers."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us do the full mathematical comparison: 1) Demand variance only (assuming fixed lead time L=9): SS = Z * sqrt(L * sigma_D^2) = 1.645 * sqrt(9 * 400) = 1.645 * 60 = 98.7 units. 2) Both demand and lead-time variance: SS = Z * sqrt(L_bar * sigma_D^2 + D_bar^2 * sigma_L^2). Here, D_bar^2 * sigma_L^2 = (100)^2 * (2)^2 = 10,000 * 4 = 40,000. Total variance term = 3,600 + 40,000 = 43,600. sqrt(43,600) = 208.81 units. SS = 1.645 * 208.81 = 343.49 units (~344 units). Notice that lead-time variance term (40,000) completely dwarfs the demand variance term (3,600)! A small lead-time fluctuation (sigma_L = 2 days) multiplies average demand (100^2), demanding 245 additional safety stock units to avoid stockouts."
    },
    "quests": [
      {
        "title": "Mathematical Derivations of ABC-XYZ Matrices & Dual-Stochastic Safety Stocks",
        "type": "concept",
        "description": "Formulate Pareto cumulative revenue sorting for ABC tiers (80/15/5); formulate Coefficient of Variation CV = sigma / mu for XYZ classification; derive the complete dual-stochastic variance equation Var(Lead_Time_Demand) = E[L]*Var(D) + (E[D])^2 * Var(L) using the Law of Total Variance; prove the Reorder Point formula ROP = (D_bar * L_bar) + SS.",
        "rubric": "Step-by-step mathematical derivation using the Law of Total Variance Var(Y) = E[Var(Y|X)] + Var(E[Y|X]); prove how safety stock formulas collapse when sigma_L = 0; detail the procurement policies for all 9 cells of the ABC-XYZ matrix."
      },
      {
        "title": "The Lumpy Intermittent Demand Inventory Starvation Forensic Audit",
        "type": "detective",
        "description": "Audit an aerospace defense supplier's aircraft spare parts inventory: demonstrate how applying standard Gaussian safety stock formulas to 'CZ' items with lumpy, intermittent demand (Croston's method regime) caused $8M of dead stock in slow parts while critical jet engine turbine seals stocked out; apply Syntetos-Boylan Croston's forecasting to rescue the parts supply chain.",
        "rubric": "Calculate Inter-Demand Interval (ADI) and squared coefficient of variation (CV^2); classify items into Croston's four demand quadrants (Smooth, Intermittent, Erratic, Lumpy); demonstrate why Croston's decomposition prevents inventory bloat."
      },
      {
        "title": "Enterprise ABC-XYZ Classification & Dynamic Inventory Matrix Engine",
        "type": "mastery",
        "description": "Build a production-grade inventory analytics suite in Python: ingest multi-thousand SKU warehouse datasets; automatically compute ABC revenue cumulative shares and XYZ volatility scores; classify SKUs into the 9-box operational matrix; compute optimal dynamic safety stocks and Reorder Points (ROP) across target service levels (90%, 95%, 99%); output 9-box matrix heatmap visualizations.",
        "rubric": "Clean, vectorized data processing with pandas; automated calculation of dual-stochastic safety stocks; generate publication-grade 9-box matplotlib heatmap displaying SKU counts, total inventory value, and recommended replenishment policies."
      },
      {
        "title": "The Global Maritime Port Strike Supply Chain Disruption War Room",
        "type": "incident",
        "description": "Manage an international supply chain emergency: an unexpected dockworker port strike extends overseas container shipping lead times from 21 days to 65 days and triples lead-time variance (sigma_L explodes from 3 to 14 days); 45% of critical 'AX' and 'AY' assembly components will stock out within 7 days; design an emergency priority air-freight triage allocation that preserves factory assembly line continuity while minimizing premium freight costs.",
        "rubric": "Re-dimension safety stocks under crisis parameters; prioritize air-freight capacity strictly for high-contribution 'A' items with imminent stockout dates; negotiate domestic supplier second-sourcing to bridge the maritime shutdown."
      }
    ]
  },
  {
    "day": 27,
    "month": 1,
    "blockNum": 6,
    "title": "Marketing Attribution Modeling: Heuristics, Shapley Values & Markov Chains",
    "stageName": "Stage 2: Econometric Time Series, Demand Forecasting & Operations Analytics",
    "stageNum": 2,
    "pedagogicalRole": "Multi-Touch Marketing Attribution & Cooperative Game Theory Physics",
    "spokenGoal": "John Wanamaker famously quipped: 'Half the money I spend on advertising is wasted; the trouble is I don't know which half.' Today, we solve Wanamaker's dilemma with modern Multi-Touch Attribution (MTA)! In complex customer journeys, a user sees a Facebook ad on Monday, searches on Google on Wednesday, clicks an email on Friday, and buys on Sunday. Who gets credit for the sale? We dissect naive rule-based heuristics: First-Touch (favors brand discovery), Last-Touch (favors search conversion), Linear, and Time-Decay. Furthermore, we advance to algorithmic attribution: Lloyd Shapley's Nobel-prize-winning Game Theory Shapley Value (measuring marginal contribution across all coalition subsets) and First-Order Markov Chain Transition Models with the Removal Effect!",
    "conceptInvariant": "Shapley Value Efficiency & Fairness Invariant: The Shapley Value is the UNIQUE attribution method satisfying Efficiency (sum of channel credits equals total revenue), Symmetry (equal contributors receive equal credit), Dummy Player (channels adding zero marginal value receive zero credit), and Additivity: phi_i = sum_{S subseteq N \\ {i}} [ |S|! * (|N| - |S| - 1)! / |N|! ] * [ v(S union {i}) - v(S) ].",
    "failureMode": "A retailer uses a naive Last-Touch attribution model; the model awards 92% of all revenue credit to Google Branded Search (the final click); the CMO slashes top-of-funnel YouTube and Social video budgets by 80%; within 3 months, total branded search volume collapses by 65% because nobody is discovering the brand anymore; the naive attribution model nearly destroyed the business.",
    "tryItFriction": "Build an Algorithmic Multi-Touch Attribution Engine in Python: ingest multi-touch user conversion paths (e.g., Social > Search > Email > Conversion); compute revenue attribution under First-Touch, Last-Touch, Linear, and Time-Decay heuristics; compute cooperative Game Theory Shapley Values across all channel coalitions; compute Markov Chain Removal Effects; compare budget reallocation recommendations.",
    "socraticHints": [
      "Why is Last-Touch attribution inherently biased toward search engines and retargeting ads?",
      "Because users who are already intending to buy often click the search ad or retargeting banner as the final mechanical step to navigate to the website.",
      "Last-Touch gives 100% of the credit to the final click, completely ignoring the social media, display, and video ads that introduced the brand and generated the intent in the first place."
    ],
    "situationalPuzzle": {
      "scenario": "A customer journey analysis evaluates three marketing channels: Social (S), Display (D), and Search (P). When Social operates alone, conversions are 10. When Display operates alone, conversions are 10. When both operate together (S + D), conversions are 30 (a positive synergy of +10). When Search is added (S + D + P), conversions surge to 60. Using cooperative game theory, what is Search's marginal contribution to the coalition {S, D}?",
      "options": [
        "Search's marginal contribution is 10 conversions.",
        "Search's marginal contribution to {S, D} is v({S, D, P}) - v({S, D}) = 60 - 30 = +30 conversions! Search unlocked an incremental 30 conversions on top of the Social and Display base!",
        "Search receives 100% of the credit because it was the last channel.",
        "Synergistic conversions cannot be measured mathematically."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In cooperative game theory, the marginal contribution of player i to a coalition subset S is defined as v(S union {i}) - v(S). Here, the coalition {Social, Display} produces 30 conversions. When Search joins to form {Social, Display, Search}, total conversions reach 60. Search's marginal contribution to this specific coalition is exactly 60 - 30 = +30 conversions. The Shapley Value averages these marginal contributions across ALL possible coalition entry permutations, guaranteeing mathematically fair credit attribution that accounts for channel synergies."
    },
    "quests": [
      {
        "title": "Mathematical Mechanics of the Shapley Value & Markov Chain Removal Effect",
        "type": "concept",
        "description": "Formulate the axiomatic proof of the Shapley Value in cooperative game theory; derive the state transition probability matrix P in a first-order Markov Chain model; derive the Removal Effect RE(i) = (Total_Conv - Conv_without_i) / Total_Conv by setting channel i to an absorbing state; prove why Removal Effect shares sum to normalized attribution weights.",
        "rubric": "Detail all four Shapley axioms; derive Shapley combinatorial weight formula; formulate Markov transition matrix with Start, Channels, Conversion, and Null states; prove how the fundamental matrix (I - Q)^(-1) computes absorption probabilities."
      },
      {
        "title": "The Last-Touch Attribution Budget Misallocation Forensic Audit",
        "type": "detective",
        "description": "Audit a direct-to-consumer brand that allocated $20M purely on Last-Touch metrics: prove how Last-Touch overvalued Branded Search by 450% while undervaluing Top-of-Funnel TikTok and Podcast sponsorships by 85%; demonstrate how shifting to a Markov Chain attribution model re-allocated $8M into discovery channels, driving a 34% increase in net new customer acquisitions.",
        "rubric": "Analyze multi-touch customer path logs; compare attribution credit distributions across Last-Touch vs Shapley vs Markov; quantify the incremental revenue gain from eliminating attribution distortion."
      },
      {
        "title": "Full-Scale Markov Chain & Shapley Multi-Touch Attribution Engine",
        "type": "mastery",
        "description": "Build an enterprise marketing attribution platform in Python: ingest raw path logs (sequences of touchpoints ending in Conversion or Drop-off); implement First-Touch, Last-Touch, Linear, and Time-Decay models; calculate exact Shapley Values across all channel subsets; construct the Markov Chain transition matrix and compute Removal Effects; generate visual comparison bar charts and budget optimization schedules.",
        "rubric": "Clean, object-oriented Python architecture; efficient combinatorial Shapley computation; Markov chain absorption probability calculation; output comparative visualization displaying credit allocation across all 6 models."
      },
      {
        "title": "The Cookie Deprecation & Walled Garden Attribution Crisis War Room",
        "type": "incident",
        "description": "Navigate a modern advertising attribution crisis: Apple's App Tracking Transparency (ATT) and third-party browser cookie deprecation break multi-touch user tracking paths; deterministic cross-channel path data collapses by 70%; design and deploy an Econometric Marketing Mix Model (MMM) using Bayesian structural time-series (Meta Robyn / Google Meridian approach) to estimate macro-level channel ad elasticity without relying on individual user cookies.",
        "rubric": "Formulate Marketing Mix Modeling (MMM) equations with Adstock decay and diminishing returns Hill transformations; combine macro MMM with micro geo-lift randomized holdouts; deliver an unshakeable, privacy-safe media allocation framework to the CMO."
      }
    ]
  },
  {
    "day": 28,
    "month": 1,
    "blockNum": 6,
    "title": "Customer Lifetime Value (CLV): Probabilistic BG/NBD & Gamma-Gamma Spend Models",
    "stageName": "Stage 2: Econometric Time Series, Demand Forecasting & Operations Analytics",
    "stageNum": 2,
    "pedagogicalRole": "Probabilistic Customer Valuation & Buy-Till-You-Die (BTYD) Physics",
    "spokenGoal": "How much is a customer worth over their entire future relationship with your company? Naive analysts multiply average order value by historical purchase frequency, assuming customers live forever. In non-contractual business settings (Amazon, retail, food delivery), customers never formally cancel—they just silently 'die' (drift away). To model this, Peter Fader and Bruce Hardie developed the famous Buy-Till-You-Die (BTYD) probabilistic models: the Beta-Geometric / Negative Binomial Distribution (BG/NBD) model for transaction frequency and churn dropout, paired with the Gamma-Gamma model for monetary spend. Today, we master the mathematics of BTYD modeling, predicting P(Alive) for every individual customer, and computing true forward-looking Customer Lifetime Value (CLV).",
    "conceptInvariant": "Buy-Till-You-Die Separation Invariant: In non-contractual customer analytics, Customer Lifetime Value decomposes into two independent stochastic processes: 1) The Purchase & Churn Process modeled via BG/NBD (Poisson transaction rate lambda ~ Gamma, dropout probability p ~ Beta); and 2) The Monetary Value Process modeled via Gamma-Gamma; transaction frequency is statistically independent of monetary spend per transaction.",
    "failureMode": "A retailer computes CLV using historical averages: CLV = Average Spend * (1 / Churn) = $150 * 5 years = $750; management spends $300 in CAC to acquire customers who on average make only 1.2 transactions and silently churn; the company burns $18M in marketing acquisition capital because it relied on naive deterministic CLV instead of probabilistic BTYD modeling.",
    "tryItFriction": "Construct a Full BG/NBD & Gamma-Gamma CLV Engine in Python: take raw transaction data; compute customer RFM metrics (Recency, Frequency, Tenure T, Average Monetary Value); fit the BG/NBD model via Maximum Likelihood Estimation; predict P(Alive) and expected future transactions over the next 12 months; fit the Gamma-Gamma spend model; compute 1-year and 3-year discounted Customer Lifetime Value.",
    "socraticHints": [
      "What does P(Alive) represent in the BG/NBD model?",
      "P(Alive) is the conditional probability that a customer is still active and has not permanently dropped out, given their observed purchase recency and frequency.",
      "A customer who purchased 20 times in their first month and has not purchased in 6 months has a very LOW P(Alive); a customer who purchased once every 6 months and last purchased 5 months ago has a HIGH P(Alive)."
    ],
    "situationalPuzzle": {
      "scenario": "Customer A purchased 10 times over their first 60 days, but has made ZERO purchases in the last 300 days (Recency = 60 days, Tenure T = 360 days). Customer B purchased 2 times over 360 days, with their last purchase occurring 180 days ago (Recency = 180 days, Tenure T = 360 days). According to the BG/NBD model, which customer has a higher probability of being active P(Alive)?",
      "options": [
        "Customer A because they bought 10 times (higher frequency).",
        "Customer B has a vastly higher P(Alive)! Customer A had a high expected transaction rate, so 300 days of complete silence is an overwhelming statistical signal that they dropped out (died). Customer B's natural transaction pace is slow (every 180 days), so 180 days since the last purchase is completely normal for them!",
        "Both have identical P(Alive) because both have Tenure = 360 days.",
        "Probabilities cannot be calculated without contract subscription data."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is the core intuition of Peter Fader's BG/NBD model. In non-contractual settings, dropout is inferred from the discrepancy between a customer's personal transaction rate lambda and their observed recency. Customer A had an intense purchase velocity (10 orders in 60 days = one order every 6 days). Going 300 days without an order represents 50 expected transaction cycles missed! The BG/NBD model concludes that Customer A has almost certainly dropped out: P(Alive) is near 0. Customer B buys only once every 180 days; being 180 days since their last order is right on schedule, so Customer B's P(Alive) remains high (~0.75). Frequency without recency context is misleading."
    },
    "quests": [
      {
        "title": "Mathematical Derivations of BG/NBD & Gamma-Gamma Likelihood Functions",
        "type": "concept",
        "description": "Formulate the 5 assumptions of the BG/NBD model; derive the conditional likelihood function L(r, alpha, a, b | x, t_x, T); derive the closed-form conditional expectation E[Y(t) | x, t_x, T] of future transactions; formulate the Gamma-Gamma conjugate model for monetary value E[M | p, q, gamma, x, m_x].",
        "rubric": "Step-by-step mathematical formulation of BG/NBD likelihood; derive the formula for P(Alive | x, t_x, T); derive the Gamma-Gamma conditional spend formula; prove why independence of spend and frequency simplifies joint likelihood estimation."
      },
      {
        "title": "The Overvalued Churned Whales Acquisition Forensic Audit",
        "type": "detective",
        "description": "Audit a luxury retail acquisition valuation: the buyer valued the customer base at $80M based on historic spending averages; execute the BG/NBD model to reveal that 68% of the 'top 1,000 spenders' had a P(Alive) < 0.05 (they were completely dead accounts); prove that true forward-looking 3-year CLV was only $26M, preventing a catastrophic $54M acquisition overpayment.",
        "rubric": "Fit BG/NBD and Gamma-Gamma models to the customer transaction log; compute individual P(Alive) and forward expected cash flows; demonstrate the valuation gap between historical average spend and probabilistic forward CLV."
      },
      {
        "title": "Institutional BG/NBD & Gamma-Gamma Lifetime Value Engine",
        "type": "mastery",
        "description": "Build an enterprise CLV prediction suite in Python using lifetimes / scikit-learn: ingest raw customer transaction logs; compute RFM summary data (frequency, recency, T, monetary_value); fit BG/NBD parameters (r, alpha, a, b) and Gamma-Gamma parameters (p, q, v) via MLE; compute individual P(Alive), 12-month transaction forecasts, and discounted 3-year CLV; generate customer value segmentation decile charts.",
        "rubric": "Clean implementation with lifetimes; automated validation verifying model fit against holdout period; output customer-level predictions table with top 5% whale identification and churn risk scores."
      },
      {
        "title": "The Customer Acquisition Cost (CAC) Allocation War Room",
        "type": "incident",
        "description": "Lead an executive growth capital allocation meeting: the marketing team wants to spend $250 CAC across all channels to drive user acquisition; use the BG/NBD and Gamma-Gamma engine to disaggregate predicted CLV by acquisition channel: prove that Channel Alpha delivers a 3-year CLV of $850 (LTV/CAC = 3.4x), while Channel Beta delivers a CLV of only $110 (LTV/CAC = 0.44x, losing $140 per user!); reallocate marketing capital to maximize enterprise enterprise value.",
        "rubric": "Segment customer cohorts by acquisition channel; fit channel-specific BTYD parameters; compute channel-level LTV/CAC ratios and payback periods; deliver a definitive marketing capital reallocation mandate to the CEO."
      }
    ]
  },
  {
    "day": 29,
    "month": 1,
    "blockNum": 6,
    "title": "Prescriptive Analytics & Decision Trees: EMV, Sensitivity & Value of Information",
    "stageName": "Stage 2: Econometric Time Series, Demand Forecasting & Operations Analytics",
    "stageNum": 2,
    "pedagogicalRole": "Prescriptive Decision Theory & Information Economics Physics",
    "spokenGoal": "Predictive analytics tells you what is likely to happen; Prescriptive analytics tells you what you should DO about it. Today, we master the mathematics of Prescriptive Decision Theory: Decision Trees under Uncertainty. We represent sequential business choices using Decision Nodes (squares), Chance Nodes (circles with probabilities), and Terminal Payoffs. We will solve decision trees using Backward Induction (Rollback Method) by computing Expected Monetary Value (EMV). Crucially, we master Information Economics: calculating the Expected Value of Perfect Information (EVPI = Expected Value with Perfect Information - EMV without information) and Expected Value of Sample Information (EVSI)—establishing the exact maximum dollar price a business should ever pay for market research or data consulting!",
    "conceptInvariant": "Expected Value of Perfect Information (EVPI) Upper Bound Invariant: The Expected Value of Perfect Information EVPI = sum_j P(s_j) * max_i [ Payoff(a_i, s_j) ] - max_i [ sum_j P(s_j) * Payoff(a_i, s_j) ] represents the absolute upper mathematical bound on what an enterprise should spend on any analytics model, market research study, or consulting report; imperfect sample information (EVSI) is strictly bounded: 0 <= EVSI <= EVPI.",
    "failureMode": "An oil exploration company spends $15M on a seismic geological survey for an oil field where the theoretical EVPI is only $4.2M; paying $15M for information that could at most save $4.2M in bad drilling decisions guarantees a net $10.8M destruction of shareholder capital before drilling even begins.",
    "tryItFriction": "Build an Automated Decision Tree & EVPI Solver in Python: model a multi-stage corporate capital decision (e.g., Build Large Plant vs Build Small Plant vs Do Nothing) across economic states (Boom, Normal, Recession); calculate EMV for each branch via backward induction; compute EVPI; incorporate a market research test with Bayes' Theorem likelihood updates; compute EVSI and determine the maximum price to pay for the test.",
    "socraticHints": [
      "What is the intuitive meaning of the Expected Value of Perfect Information (EVPI)?",
      "EVPI is the expected gain from eliminating all uncertainty before making a decision.",
      "It equals the difference between what you would make if an all-knowing oracle told you the future in advance and what you would make making the best decision under existing uncertainty."
    ],
    "situationalPuzzle": {
      "scenario": "A pharmaceutical firm must decide whether to launch a new drug. If demand is High (60% prob), launching yields $100M profit. If demand is Low (40% prob), launching results in a -$50M loss. If the firm does not launch, profit is $0. 1) What is the EMV without additional information? 2) What is the Expected Value of Perfect Information (EVPI)?",
      "options": [
        "EMV = $50M, EVPI = $50M.",
        "EMV(Launch) = 0.60 * $100M + 0.40 * (-$50M) = $60M - $20M = $40M (Do Not Launch = $0, so Best EMV = $40M). With Perfect Information: If High, launch ($100M); if Low, do not launch ($0). Expected Value with Oracle = 0.60 * $100M + 0.40 * $0 = $60M. EVPI = $60M - $40M = $20,000,000! The firm should pay at most $20M for any market research!",
        "EMV = $25M, EVPI = $10M.",
        "EVPI cannot be calculated for binary launch decisions."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Let us do the full decision tree math: 1) Decision without information: Action 1 (Launch): EMV = 0.60 * $100M + 0.40 * (-$50M) = $60M - $20M = $40M. Action 2 (Do Not Launch): EMV = $0. Optimal choice is Launch (EMV = $40M). 2) Expected Value with Perfect Information (EVWPI): If the oracle says 'Demand is High', you launch and make $100M. If the oracle says 'Demand is Low', you wisely cancel the launch and lose $0 (avoiding the -$50M disaster!). EVWPI = 0.60 * $100M + 0.40 * $0 = $60M. 3) EVPI: EVPI = EVWPI - Best EMV = $60M - $40M = $20,000,000. Perfect information saves the company from the $50M loss 40% of the time, adding exactly $20M in expected value. Any research firm charging more than $20M is ripping the company off."
    },
    "quests": [
      {
        "title": "Mathematical Derivations of Decision Trees, Bayes' Theorem & EVSI",
        "type": "concept",
        "description": "Formulate decision trees with decision nodes, chance nodes, and terminal utilities; derive the Rollback Backward Induction algorithm; incorporate imperfect test signals via Bayes' Theorem P(s_j | I_k) = P(I_k | s_j)*P(s_j) / P(I_k); derive the Expected Value of Sample Information EVSI = EMV_with_test - EMV_without_test; prove that EVSI <= EVPI.",
        "rubric": "Step-by-step mathematical formulation of backward induction; write Bayes' theorem posterior probability matrix; derive EVSI and Expected Net Gain from Sampling (ENGS = EVSI - Cost_of_test); prove EVSI converges to EVPI as test accuracy approaches 100%."
      },
      {
        "title": "The Over-Priced Market Research Feasibility Study Forensic Audit",
        "type": "detective",
        "description": "Audit a corporate Capex feasibility engagement: a consultancy charged $8M to conduct an imperfect market survey (accuracy = 75%) for a retail expansion project; calculate the true EVSI ($2.1M); demonstrate that paying $8M for sample information with an economic value of $2.1M destroyed $5.9M in shareholder value before the expansion was even approved.",
        "rubric": "Build the Bayesian decision tree incorporating survey accuracy matrices; compute pre-posterior probabilities and EVSI; quantify the net loss from buying over-priced advisory information."
      },
      {
        "title": "Enterprise Prescriptive Decision Tree & Sensitivity Engine",
        "type": "mastery",
        "description": "Build an automated prescriptive decision analysis platform in Python: accept complex multi-stage decision trees with probabilistic branch outcomes; implement backward induction rollback solver; compute EMV, EVPI, and EVSI; execute 1-way and 2-way sensitivity analysis on prior probabilities and payoff outcomes; output graphical decision tree diagrams with optimal policy paths highlighted.",
        "rubric": "Clean object-oriented tree data structure; automated Bayesian posterior probability calculator; generate publication-grade visual decision tree diagrams with highlighted optimal decision paths and threshold sensitivity plots."
      },
      {
        "title": "The High-Stakes Litigate vs Settle Legal Dispute War Room",
        "type": "incident",
        "description": "Advise the Board of Directors on a $200M patent infringement lawsuit: the plaintiff offers to settle for $60M; if the firm goes to trial, litigation costs are $10M with legal outcome probabilities: 40% win ($0 liability), 35% partial loss ($80M liability), and 25% catastrophic loss ($200M liability); construct the decision tree, compute EMV, incorporate risk aversion via utility theory (Exponential Utility U(w) = -e^(-a*w)), and deliver a definitive settle vs litigate recommendation.",
        "rubric": "Calculate risk-neutral EMV of going to trial ($88M expected loss) vs $60M settlement; incorporate corporate risk aversion parameter a; prove mathematically that even if EMV favored trial, risk-averse utility mandates accepting the $60M settlement to eliminate the 25% catastrophic ruin risk."
      }
    ]
  },
  {
    "day": 30,
    "month": 1,
    "blockNum": 6,
    "title": "Capstone 1: ApexForecast Enterprise Demand Forecasting & Revenue Intelligence Engine",
    "stageName": "Stage 2: Econometric Time Series, Demand Forecasting & Operations Analytics",
    "stageNum": 2,
    "pedagogicalRole": "Comprehensive Econometric Demand & Revenue Intelligence Architecture Capstone",
    "spokenGoal": "Congratulations on completing Month 1 of Business Analytics, Econometrics & Decision Dashboards! Today, you synthesize every single principle mastered across Days 1 through 29 into our first comprehensive masterwork: Capstone 1 — ApexForecast Enterprise Demand Forecasting & Revenue Intelligence Engine! You will architect a production-grade forecasting and decision platform: ingesting multi-echelon business transactions, testing unit root stationarity, fitting SARIMA and Holt-Winters models, estimating price elasticity via 2SLS, executing multi-touch attribution, and solving prescriptive inventory decisions under uncertainty. Today, you face the Master Capstone Viva Gate!",
    "conceptInvariant": "Holistic Revenue Intelligence Invariant: Enterprise decision intelligence is an integrated closed-loop system: statistical telemetry cleans real-world data, econometric time series models forecast baseline demand, causal inference isolates price elasticity and marketing attribution, and prescriptive decision theory optimizes pricing and inventory buffers; sub-optimizing any single layer propagates fatal errors across the entire supply chain.",
    "failureMode": "An enterprise operates demand forecasting in isolation from price elasticity and marketing attribution; the marketing team ramps up a paid campaign that inflates demand right as pricing raises prices and procurement cuts inventory based on naive moving averages; the contradictory decisions trigger a catastrophic $15M stockout followed by a $10M excess inventory write-off.",
    "tryItFriction": "Architect and Execute Capstone 1: ApexForecast in Python/TypeScript: ingest multi-year retail transactions; execute automated stationarity and seasonal decomposition; fit SARIMA and Holt-Winters models selecting the lowest-AICc model; compute price elasticity using 2SLS with supply cost instruments; run Markov Chain multi-touch attribution; optimize safety stocks and pricing; and defend your boardroom revenue strategy before an aggressive senior evaluator panel.",
    "socraticHints": [
      "How does combining causal price elasticity with time series forecasting prevent the classic 'static forecasting fallacy'?",
      "Traditional time series models assume future demand depends only on past calendar time, ignoring management's own upcoming price changes.",
      "Integrating causal price elasticity allows the forecasting engine to dynamically update demand projections when marketing changes prices or launches promotions."
    ],
    "situationalPuzzle": {
      "scenario": "As Head of Business Analytics for ApexRetail Global, you face an executive crisis: Q4 holiday demand is approaching. 1) Time series models forecast baseline demand of 500,000 units. 2) Marketing plans a 10% price promotion ($90 vs $100 normal price), and 2SLS econometrics proves price elasticity is -2.2. 3) Supplier lead time is 30 days with a standard deviation of 5 days. 4) The CFO wants to keep procurement at 500,000 units to save working capital. What is your integrated econometric recommendation?",
      "options": [
        "Procure 500,000 units as requested by the CFO.",
        "The 10% price cut will surge unit demand by -2.2 * (-10%) = +22%, driving expected demand from 500,000 to 610,000 units! Furthermore, supplier lead-time variance requires an additional 42,000 units in safety stock. Procuring only 500,000 units guarantees a 110,000-unit stockout, costing $9.9M in lost revenue! Procure 652,000 units to maximize enterprise holiday revenue!",
        "Double prices to $200 to eliminate the need for inventory.",
        "Forecasting and pricing should never be combined in retail."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. This is the master synthesis of Month 1 Business Analytics: 1) Causal Elasticity Integration: Baseline demand is 500,000 units. With price elasticity E_d = -2.2, a 10% price reduction expands demand by -2.2 * (-10%) = +22.0%! Expected mean demand is 500,000 * 1.22 = 610,000 units. 2) Supply Chain Safety Stock: Factoring in lead-time variance (sigma_L = 5 days) and daily demand variance requires an additional 42,000 units in buffer stock to maintain a 95% service level. 3) Executive Impact: Following the CFO's naive 500,000-unit cap would result in running out of stock when demand hits 610,000 units, forfeiting 110,000 sales ($9.9M in gross revenue). Integrating causal econometrics with operational inventory buffers rescues holiday revenue and maximizes enterprise value."
    },
    "quests": [
      {
        "title": "ApexForecast Architecture: Enterprise Forecasting & Econometric Pipeline Specification",
        "type": "concept",
        "description": "Design the end-to-end data architecture and mathematical specifications for the ApexForecast platform: specify schemas for multi-store transaction telemetry, stationarity transformers, SARIMA state-space models, 2SLS causal elasticity engines, and prescriptive decision tree optimizers.",
        "rubric": "Deliver comprehensive architectural blueprint and mathematical specifications connecting time series, causal econometrics, and prescriptive decision theory into a unified enterprise framework."
      },
      {
        "title": "The Enterprise Supply Chain Forecasting Disconnect Forensic Audit",
        "type": "detective",
        "description": "Perform an exhaustive forensic audit on ApexRetail's historical 3-year forecasting performance: unearth $32M in lost revenue and inventory write-offs caused by disconnected silos (marketing price promotions uncoordinated with supply chain procurement, additive models applied to multiplicative trends, and naive Last-Touch attribution); prepare an institutional root-cause report for the Board.",
        "rubric": "Audit historical forecast error metrics (MAPE, tracking signals); quantify the dollar impact of siloed decision-making; prepare an authoritative diagnostic presentation for the CEO."
      },
      {
        "title": "Capstone 1 Core: ApexForecast Full-Stack Execution Engine",
        "type": "mastery",
        "description": "Engineer Capstone 1 in Python: build the complete integrated ApexForecast engine: 1) Automated time series stationarity, SARIMA, and Holt-Winters forecasting module; 2) Causal 2SLS price elasticity estimator; 3) Multi-touch attribution module with Markov Chain removal effects; 4) Dynamic safety stock and Newsvendor revenue optimizer; 5) Executive dashboard generator outputting clean Tufte-standard visual reports.",
        "rubric": "Clean, object-oriented Python architecture; robust numerical solvers across all modules; comprehensive automated test suite verifying mathematical consistency; generation of an executive C-suite dashboard."
      },
      {
        "title": "Master Capstone 1 Viva Voce: Boardroom Revenue Strategy Defense",
        "type": "incident",
        "description": "Defend the complete ApexForecast platform in a rigorous 60-minute simulated Board of Directors Viva Voce: withstand cross-examination from the Chief Financial Officer (challenging inventory working capital), the Chief Commercial Officer (demanding aggressive price promotions), and a skeptical lead data scientist; justify every econometric specification, elasticity assumption, and safety stock calculation under intense senior evaluator scrutiny.",
        "rubric": "Deliver an authoritative, unflappable boardroom defense; articulate mathematical proofs and empirical precedents for every analytical decision; successfully complete the final Viva Gate with distinction."
      }
    ]
  }
]
