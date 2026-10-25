import json

with open("scripts/branch_b/day54_ban_data.json", "r", encoding="utf-8") as f:
    d = json.load(f)

# Enrich Part 4
extra_p4 = (
    " Delving deeper into the mechanics of the Basel Output Floor introduced under Basel III endgame / Basel IV reforms, "
    "banks utilizing the SEC-IRBA approach face an additional structural boundary. Under the Basel IV output floor, the total "
    "risk-weighted assets calculated using internal models cannot fall below 72.5% of the RWAs calculated strictly under the "
    "standardized approach (SEC-SA). In an SRT transaction, if the underlying loan portfolio exhibits an SEC-SA standardized "
    "risk weight of 100%, the effective post-floor RWA constraint requires the bank to verify that the combined risk-weighted "
    "exposure of the retained senior tranche does not breach this aggregate floor constraint. Moreover, portfolio credit desks "
    "must account for the regulatory treatment of 'proportional loss sharing' and 'unrated retained tranches'. If an originating "
    "bank retains a 5% vertical slice across all tranches to satisfy European risk retention rules (the mandatory 5% 'skin-in-the-game' "
    "requirement under Securitization Regulation (EU) 2017/2402), the retained vertical slice of the first-loss tranche attracts "
    "a punitive 1,250% risk weight, which must be factored directly into the net capital relief calculation. Consequently, lead "
    "structurers employ sophisticated linear programming algorithms to solve for the exact tranche detachment boundary that "
    "simultaneously minimizes the gross cost of investor coupon protection while maximizing the net CET1 capital deduction benefit."
)
d["parts"][3]["say"].append(extra_p4)

# Enrich Part 5
extra_p5 = (
    " Furthermore, quantitative risk teams executing the SRT War Room simulator must stress test the velocity of collateral "
    "impairment under non-linear jump-to-default dynamics and credit rating downgrade cascades. In a macroeconomic crisis where "
    "macroeconomic recession triggers widespread covenant breaches, corporate borrowers may experience simultaneous credit "
    "downgrades from BB to CCC. Under European Central Bank (ECB) supervisory review guidelines, any reference asset that defaults "
    "triggers a rigorous workout process overseen by the bank's internal Special Assets Management (SAM) division. During this "
    "recovery workout period—which can span twelve to thirty-six months—the bank issues formal Loss Verification Notices to the "
    "independent calculation agent. Only when an audited Final Loss Determination is reached does the bank permanently write down "
    "the principal of the funded Credit-Linked Notes. In the interim, the transaction structure may enforce 'interim loss provisioning', "
    "temporarily withholding investor coupon payments or freezing collateral distributions in escrow. Mastering these legal, "
    "accounting, and quantitative interfaces ensures that the originating institution maintains ironclad operational resilience "
    "and flawless regulatory compliance throughout the multi-year life of the credit risk transfer transaction."
)
d["parts"][4]["say"].append(extra_p5)

with open("scripts/branch_b/day54_ban_data.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Enriched Day 54 successfully!")
for i, p in enumerate(d["parts"]):
    say_text = " ".join(p["say"]) if isinstance(p["say"], list) else p["say"]
    print(f"Part {i+1}: {len(say_text.split())} words")
