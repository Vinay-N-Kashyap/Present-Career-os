import json

with open("scripts/branch_b/day53_ban_data.json", "r", encoding="utf-8") as f:
    d = json.load(f)

# Enrich Part 4
extra_p4 = (
    " Delving deeper into the mechanics of overcollateralization (OC) test failures, when the test breaches its contractual "
    "trigger, the indenture mandates an immediate redirection of cash flows known as an 'OC cash sweep' or 'deleveraging turbo'. "
    "Specifically, any available interest collections that would ordinarily flow downstream to pay junior mezzanine noteholders "
    "or equity distributions are trapped at the top of the waterfall. These trapped funds are diverted to amortize the most senior "
    "AAA tranche on a dollar-for-dollar basis. As senior principal is retired, the total outstanding balance of senior debt decreases "
    "while the numerator—the collateral par amount—remains stable (or decreases at a slower pace). Consequently, the ratio of collateral "
    "assets to senior debt mechanically rises until the OC ratio is restored above the contractual minimum threshold. "
    "Conversely, interest coverage (IC) tests assess the ratio of gross interest proceeds received from the loan collateral against the "
    "periodic interest coupon payments due to a specific debt tranche. If interest collections fall short—due to borrower payment holidays, "
    "PIK (Payment-in-Kind) elections by distressed corporate borrowers, or elevated non-performing loan volumes—the IC test fails. "
    "Just as with an OC failure, the IC breach triggers a mandatory cash diversion, prioritizing the senior debt service and curing "
    "the structural shortfall before junior tranches or equity holders can extract a single cent of capital return."
)
d["parts"][3]["say"].append(extra_p4)

# Enrich Part 5
extra_p5 = (
    " Furthermore, quantitative CLO desk analysts must master the stress-testing dynamics of the equity IRR under combined "
    "credit rating transition matrices and macroeconomic default clustering. When corporate defaults cluster simultaneously during "
    "a severe economic downturn, recovery values on defaulted syndicated loans plunge from the historical norm of seventy cents on "
    "the dollar down to thirty or forty cents. Simultaneously, as rating agencies downgrade a wave of collateral assets into the "
    "CCC category, the CCC haircut rule forces the collateral manager to write down the carrying value of any CCC assets exceeding "
    "the standard seven point five percent bucket allowance to prevailing market bid prices. This market-value haircut immediately "
    "depresses the par value numerator in both the junior and senior OC test calculations, accelerating the onset of a cash diversion "
    "event. In such a stressed scenario, the equity tranche distributions are completely turned off for multiple consecutive payment "
    "periods. Understanding how these feedback loops operate between rating agency criteria, cash flow diversion waterfalls, and "
    "secondary market pricing is indispensable for institutional structured credit portfolio managers seeking to optimize Sharpe "
    "ratios while preserving structural safety."
)
d["parts"][4]["say"].append(extra_p5)

with open("scripts/branch_b/day53_ban_data.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Enriched Day 53 successfully!")
for i, p in enumerate(d["parts"]):
    say_text = " ".join(p["say"]) if isinstance(p["say"], list) else p["say"]
    print(f"Part {i+1}: {len(say_text.split())} words")
