import json

# Enrich Day 56 Part 4
with open("scripts/branch_b/day56_ban_data.json", "r", encoding="utf-8") as f:
    d56 = json.load(f)

extra_d56_p4 = (
    " Delving deeper into structural lending frictions, commercial banks must also manage 'basis risk' within their floating loan books. "
    "When a commercial bank funds external benchmark-linked loans (priced against the central bank repo rate or 91-day treasury bills) "
    "using short-term wholesale bulk deposits or market certificates of deposit (priced against interbank MIBOR or SOFR), a divergence "
    "between money market interbank rates and the policy benchmark creates severe margin volatility. If money market rates rise faster "
    "than the central bank's policy rate due to tight interbank liquidity, the bank's cost of wholesale funding increases without any "
    "compensating increase in loan interest yields. Bank asset-liability committees (ALCO) must therefore implement basis swaps and "
    "interest rate corridors to hedge this divergence and protect bank net interest margins across unpredictable liquidity cycles."
)
d56["parts"][3]["say"].append(extra_d56_p4)

with open("scripts/branch_b/day56_ban_data.json", "w", encoding="utf-8") as f:
    json.dump(d56, f, indent=2)

# Enrich Day 57 Part 5
with open("scripts/branch_b/day57_ban_data.json", "r", encoding="utf-8") as f:
    d57 = json.load(f)

extra_d57_p5 = (
    " Furthermore, quantitative trading desks at premier Primary Dealers must rigorously evaluate the regulatory capital implications "
    "of carrying sovereign bond inventory under Basel III market risk frameworks. Under the Fundamental Review of the Trading Book (FRTB), "
    "sovereign debt held in the regulatory trading book attracts both General Interest Rate Risk (GIRR) capital charges and sovereign "
    "default risk charges. While domestic currency sovereign debt issued by the national government typically attracts a preferential 0% "
    "credit risk weight, market risk capital charges for duration and curvature risk remain fully binding. If a Primary Dealer holds an "
    "outsized inventory of long-duration 30-year government bonds resulting from auction devolvements, the bank's market risk-weighted "
    "assets (RWA) expand rapidly, consuming expensive Common Equity Tier 1 (CET1) capital. By stripping the bonds into zero-coupon "
    "STRIPS and executing private placement distribution to long-term institutional pension and annuity funds within hours of auction "
    "settlement, the Primary Dealer releases regulatory market risk capital, preserves its trading balance sheet liquidity, and earns "
    "an attractive return on equity without violating supervisory risk limits."
)
d57["parts"][4]["say"].append(extra_d57_p5)

with open("scripts/branch_b/day57_ban_data.json", "w", encoding="utf-8") as f:
    json.dump(d57, f, indent=2)

print("Enriched Day 56 Part 4 and Day 57 Part 5 successfully!")
