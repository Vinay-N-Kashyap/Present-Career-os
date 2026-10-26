# -*- coding: utf-8 -*-
"""
Patch build_day51_ban.py to ensure >= 640 words per part.
"""

with open("scripts/branch_b/build_day51_ban.py", "r", encoding="utf-8") as f:
    text = f.read()

# Part 1 Extra
p1_extra = (
    "Beyond single-name contracts, the credit derivatives architecture encompasses Standardized Credit Default Swap Indices—most prominently the CDX family in North America (CDX NA IG and CDX NA HY) and the iTraxx family in Europe and Asia (iTraxx Europe and iTraxx Crossover). These indices represent equally-weighted baskets of 125 liquid reference entities, rolling over semi-annually in March and September. Structured credit desks at global banks actively trade the 'Index-Constituent Basis'—arbitraging differences between the market spread of the benchmark index and the intrinsic, weighted-average spread of its 125 underlying single-name components. Furthermore, correlation trading desks utilize single-name CDS contracts to calibrate Gaussian Copula and base correlation skews across synthetic collateralized debt obligations (CDOs), enabling the precise tranche pricing of first-loss equity and mezzanine risk layers."
)

# Part 2 Extra
p2_extra = (
    "A vital theoretical and practical insight in reduced-form modeling is the profound divergence between Risk-Neutral Default Probabilities Q(t) and Historical Physical Default Probabilities P(t). Risk-neutral default probabilities inferred from market CDS spreads are systematically higher than the actual, empirical default frequencies recorded by rating agencies like Moody's and Standard & Poor's. This divergence is quantified through the Credit Risk Premium Ratio (Q/P), which typically ranges between two and four times physical default rates. Investors demand this substantial premium not merely to cover actuarial expected losses, but to compensate for systemic jump-to-default risk, market illiquidity during financial panics, and the severe negative correlation between corporate defaults and broader macroeconomic wealth."
)

# Part 3 Extra
p3_extra = (
    "In the post-2008 financial landscape, the persistence of the negative CDS-bond basis has been heavily reinforced by post-crisis regulatory capital constraints, particularly the Basel III Leverage Ratio and the Supplementary Leverage Ratio (SLR). Under leverage ratio rules, dealer banks must maintain Tier 1 capital against total gross assets without risk-weighting; because purchasing a cash corporate bond expands the bank's balance sheet while entering an unfunded CDS does not, cash bond arbitrage consumes valuable leverage capacity. When dealer balance sheets become constrained near quarter-end reporting dates, banks widen their repo financing spreads, causing the negative basis to widen further. Non-bank institutional investors and sovereign wealth funds that operate without leverage ratio restrictions exploit these structural regulatory frictions, earning persistent, multi-year excess returns by financing negative basis trades."
)

# Part 4 Extra
p4_extra = (
    "In addition to credit event determinations, the ISDA Determinations Committee oversees the complex adjudication of Succession Events. When a corporate reference entity undergoes a corporate spin-off, cross-border merger, divisional demerger, or debt assumption, the ISDA DC determines how existing CDS contracts follow the corporate liabilities. Under standardized ISDA Succession Rules, if a single successor entity assumes more than 75 percent of the relevant bonds and loans, it becomes the sole successor reference entity; however, if multiple entities each assume between 25 percent and 75 percent of the debt, the original CDS contract is bifurcated into multiple distinct CDS contracts. The Determinations Committee publishes formal succession lists, ensuring continuous contractual continuity and preventing legal ambiguity when multinational corporate conglomerates restructure."
)

# Part 5 Extra
p5_extra1 = (
    "At an enterprise balance sheet level, the master single-name CDS simulator connects directly to the bank's centralized Credit Valuation Adjustment (CVA) trading desk. Under Basel III market risk frameworks, commercial banks must hold explicit regulatory capital against the risk of mark-to-market losses resulting from counterparty credit rating deterioration on OTC interest rate, commodity, and foreign exchange derivative portfolios. The CVA trading desk uses the simulator's hazard rate curves to price bilateral counterparty credit risk and buys single-name CDS protection on derivative counterparties, dynamically immunizing the bank's multi-billion-dollar trading book against counterparty default contagion."
)
p5_extra2 = (
    "Furthermore, the simulator's quantitative algorithms operate under rigorous Model Risk Management (MRM) governance adhering to Federal Reserve SR 11-7 and European Banking Authority model validation guidelines. Quantitative validation teams perform continuous backtesting of the calibrated Poisson intensity curves, stress-testing recovery rate assumptions between 10% and 50%, and verifying that upfront point calculations match DTCC clearinghouse settlement files. Demonstrating robust model governance and basis risk monitoring ensures that enterprise credit hedging programs satisfy the highest supervisory standards while optimizing institutional regulatory capital."
)

text = text.replace(
    'p1_say = [',
    f'p1_say = [\n    """{p1_extra}""",\n'
)

text = text.replace(
    'p2_say = [',
    f'p2_say = [\n    """{p2_extra}""",\n'
)

text = text.replace(
    'p3_say = [',
    f'p3_say = [\n    """{p3_extra}""",\n'
)

text = text.replace(
    'p4_say = [',
    f'p4_say = [\n    """{p4_extra}""",\n'
)

text = text.replace(
    'p5_say = [',
    f'p5_say = [\n    """{p5_extra1}""",\n    """{p5_extra2}""",\n'
)

with open("scripts/branch_b/build_day51_ban.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated build_day51_ban.py successfully!")
