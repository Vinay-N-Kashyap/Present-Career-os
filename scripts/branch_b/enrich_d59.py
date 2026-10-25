import json

with open("scripts/branch_b/day59_ban_data.json", "r", encoding="utf-8") as f:
    d = json.load(f)

# Enrich Part 1
extra_p1 = (
    " Delving deeper into the quantitative governance of NGFS scenarios, commercial banks must translate high-level macroeconomic "
    "projections into granular corporate microeconomic variables. The NGFS climate pathways provide macro variables—such as global "
    "temperature anomalies, regional precipitation shifts, carbon tax paths, energy commodity price paths, and sectoral GDP growth rates. "
    "Bank risk quantitative modeling desks employ 'Climate Satellite Models' that link these macro pathways directly to corporate financial "
    "statements. For example, in an agricultural lending portfolio, a chronic temperature anomaly of +2.5°C coupled with changing monsoon "
    "patterns reduces crop yields by 18%, depressing farmer net operating revenues and reducing debt service coverage. By embedding these "
    "satellite transfer functions into credit rating scorecards, banks can proactively identify climate-vulnerable lending segments "
    "years before physical and transition shocks materialize on loan performance ledgers."
)
d["parts"][0]["say"].append(extra_p1)

# Enrich Part 2
extra_p2 = (
    " Examining the operational complexity of PCAF compliance across diverse commercial asset classes, commercial banks must deploy "
    "tailored attribution equations for project finance, commercial mortgages, motor vehicle loans, and sovereign debt holdings. "
    "In project finance—such as financing a multi-billion-dollar liquefied natural gas (LNG) export terminal or an offshore wind farm—the "
    "PCAF attribution factor is calculated as the bank's funded debt exposure divided by the total project cost (equity plus debt). "
    "For residential real estate mortgages, where individual homeowners do not measure carbon emissions, banks utilize Energy Performance "
    "Certificate (EPC) rating databases, mapping property square footage and building energy intensity (kWh per square meter) to regional "
    "grid carbon factors. Furthermore, banks must navigate the 'double counting' challenge when multiple financial institutions participate "
    "in syndicated lending facilities. By adhering strictly to the PCAF balance-sheet attribution ratio, the banking system ensures that "
    "every ton of financed carbon is accounted for exactly once across the global financial system."
)
d["parts"][1]["say"].append(extra_p2)

# Enrich Part 3
extra_p3 = (
    " Delving further into the regulatory incentives surrounding sustainable finance, banking supervisory authorities are actively "
    "debating the introduction of macroprudential capital adjustments: the 'Green Supporting Factor' (GSF) and the 'Brown Penalizing Factor' "
    "(BPF). Proponents of the Green Supporting Factor argue that banks should be permitted to apply a regulatory capital discount (e.g., "
    "a 15% reduction in risk-weighted assets) on loans that finance certified EU Taxonomy-aligned green activities, thereby lowering the "
    "borrowing cost for clean technology investments. Conversely, advocates of the Brown Penalizing Factor argue that Pillar 1 capital "
    "must strictly reflect risk: high-carbon fossil fuel assets face accelerating transition and stranded asset risks, and should therefore "
    "attract a punitive risk-weight surcharge (e.g., increasing risk weights from 100% to 150%). While regulators debate these statutory "
    "capital adjustments, global rating agencies and ESG index providers already reward high-GAR institutions with superior credit ratings "
    "and lower wholesale bond spreads."
)
d["parts"][2]["say"].append(extra_p3)

# Enrich Part 4
extra_p4 = (
    " Delving deeper into the mechanics of corporate transition risk underwriting, commercial banks increasingly structure specialized "
    "'Transition Finance' credit facilities designed to fund the decarbonization journey of hard-to-abate industrial sectors (such as "
    "shipping, aviation, chemicals, and cement). In these carbon-intensive industries, outright divestment or refusing to lend is counterproductive "
    "to global net-zero goals, as these heavy industries require trillions of dollars in capital expenditure to retrofit factories with "
    "carbon capture, utilization, and storage (CCUS), switch to green hydrogen, and electrify thermal processes. In a Transition Finance facility, "
    "the bank provides multi-year capex financing bound by legally enforceable 'Decarbonization Milestone Covenants'. If the industrial "
    "borrower fails to achieve certified emissions reductions by agreed milestone dates, the loan interest margin automatically escalates, "
    "or the facility converts into an amortizing term loan with mandatory cash sweeps, rigorously safeguarding the bank's financed emissions trajectory."
)
d["parts"][3]["say"].append(extra_p4)

# Enrich Part 5
extra_p5 = (
    " Delving into the executive governance of the Sustainable Finance war room, commercial banks must establish seamless coordination "
    "between the Chief Sustainability Officer, the Chief Risk Officer, and the Chief Financial Officer. Climate financial risk can no longer "
    "be managed in an isolated sustainability silo. When the war room simulator reveals that an NGFS Disorderly scenario depletes 138 basis "
    "points of CET1 capital through climate-driven credit provisions, the bank's Asset-Liability Committee (ALCO) must incorporate these findings "
    "directly into its Internal Capital Adequacy Assessment Process (ICAAP) under Pillar 2. The bank must establish binding 'Sectoral Carbon "
    "Budgets' that cap financed emissions across power, oil and gas, and automotive lending, while expanding green credit origination quotas. "
    "Simultaneously, the treasury desk can leverage the bank's growing portfolio of taxonomy-aligned green assets to issue benchmark "
    "Sovereign or Corporate Green Bonds under ICMA principles, tapping deep pools of global ESG liquidity at premium valuations. This "
    "holistic synthesis of carbon accounting, climate scenario modeling, and sustainable capital market issuance represents the pinnacle "
    "of modern banking leadership."
)
d["parts"][4]["say"].append(extra_p5)

with open("scripts/branch_b/day59_ban_data.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Enriched Day 59 successfully!")
