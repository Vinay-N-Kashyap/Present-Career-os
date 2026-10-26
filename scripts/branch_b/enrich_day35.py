import json

with open("scripts/branch_b/day35_dmkt_data.json", "r", encoding="utf-8") as f:
    day35 = json.load(f)

# Part 1 enrichment: currently 512 words. Add ~120 words.
part1_extra = [
    "To operationalize this measurement triangulation within enterprise cloud environments, data engineering teams construct unified data meshes that harmonize disparate telemetry sources. Raw transaction logs, clickstream events, ad server impressions, and macro-economic indices are ingested into scalable data lakehouse tables where standardized identity resolution algorithms stitch cross-device touchpoints into probabilistic user journeys. Concurrently, automated feature stores aggregate weekly channel expenditures, pricing variations, and external market factors to feed Bayesian MMM pipelines.",
    "Crucially, the governance of this unified architecture demands continuous calibration against real-world incrementality experiments. Top-tier enterprises routinely execute geo-targeted lift tests and matched-market holdouts, intentionally turning off advertising across randomized geographic clusters to observe pure causal baseline revenue. These empirical incrementality coefficients are fed directly into the Bayesian MMM as informative prior distributions, anchoring the model in physical reality and insulating executive decision-makers against model overfitting and attribution bias."
]

# Part 2 enrichment: currently 488 words. Add ~140 words.
part2_extra = [
    "The mathematical synthesis of Hill response curves and Markov removal weights fundamentally transforms how marketing organizations interpret attribution reports. In a siloed attribution model, credit is awarded exclusively to touchpoints that were directly observed within an individual user's conversion path. However, when Markov transition matrices reveal that upper-funnel display impressions or streaming video ads consistently double the transition probability of prospects searching for branded keywords days later, the analytical model recognizes that branded search revenue is partially an indirect derivative of brand awareness investments.",
    "By formalizing this upstream facilitation mechanism into the marginal ROAS calculation, the unified engine protects vital brand-building investments from premature budget cuts. Marketing analysts can demonstrate to financial controllers that while a television sponsorship or programmatic video campaign may not generate immediate direct-click sales, its catalytic effect on middle- and lower-funnel velocity expands the enterprise's total revenue capacity, shifting the entire portfolio's Hill saturation ceiling to a permanently higher plane."
]

# Part 3 enrichment: currently 496 words. Add ~135 words.
part3_extra = [
    "In practical enterprise implementations, capital allocation algorithms must also incorporate operational liquidity buffers and campaign ramp-up latencies. When budget reallocations dictate massive capital shifts—such as reallocating $4 million from digital search to national television—media buying desks require operational lead times to negotiate inventory rates, review creative assets, and configure programmatic bidding algorithms. Sudden, unconstrained capital movements can trigger severe media buying inefficiencies and auction bidding spikes, temporarily eroding channel returns.",
    "To accommodate these real-world constraints, enterprise optimizers implement bounded step constraints and multi-period rolling horizon schedules. Rather than executing instantaneous budget shocks, the optimization engine generates a sequential 12-week glide path, incrementally reallocating funds in smooth tranches. This structured approach allows advertising algorithms on major ad networks to adapt their pacing and automated bid targets, ensuring that incremental capital deployed into expanding channels captures premium inventory without driving up unit acquisition costs."
]

# Part 4 enrichment: currently 497 words. Add ~135 words.
part4_extra = [
    "The architectural elegance of linking edge Thompson Sampling to macro budget optimization lies in creating an agile, self-correcting growth engine. In traditional corporate enterprises, marketing budget planning occurs annually or quarterly, locking tens of millions of dollars into fixed channel allocations that quickly become obsolete as market conditions, competitor tactics, and consumer behaviors evolve. When an edge conversion rate optimization test produces a breakthrough in customer onboarding efficiency, that competitive advantage often goes uncapitalized for months because budget governance is rigid and slow.",
    "By establishing automated telemetry pipelines between edge testing engines and centralized capital allocation solvers, modern enterprises achieve unprecedented market responsiveness. As soon as statistical confidence confirms that an experimental checkout design or localized landing page has permanently lifted conversion velocity, capital naturally flows toward the customer acquisition channels that feed that optimized touchpoint. Growth engineering and media buying teams operate as a unified, synchronized unit, continuously maximizing shareholder return through rapid scientific iteration."
]

# Part 5 enrichment: currently 389 words. Add ~250 words.
part5_extra = [
    "The operationalization of the CMO Command Center culminates in a transformative shift in board-level governance. Historically, Chief Marketing Officers struggled to defend their budgets during executive committee meetings, frequently clashing with Chief Financial Officers who viewed marketing expenditures as discretionary operational costs rather than strategic investments in intangible assets. By anchoring capital allocation in mathematically verified Karush-Kuhn-Tucker optimality and audited Customer Equity projections, the marketing organization establishes an unassailable financial foundation that speaks the language of corporate finance.",
    "Furthermore, the command center incorporates automated risk auditing and scenario planning engines. Executive leadership can stress-test the marketing portfolio against various macroeconomic scenarios—such as inflationary pressures, supply chain disruptions, or sudden increases in digital advertising auction costs. In each scenario, the convex optimization solver instantly recomputes optimal budget allocations, identifying which channels should be protected to safeguard customer equity and which discretionary programs can be trimmed with minimal impact on enterprise valuation.",
    "Ultimately, this unified analytical stack represents the pinnacle of modern commerce education. By mastering the full spectrum of quantitative disciplines—from hierarchical Bayesian econometrics and algorithmic multi-touch attribution to probabilistic lifetime value modeling, edge multi-armed bandits, and non-linear capital optimization—marketing science professionals evolve into indispensable architects of enterprise growth, equipped to lead multi-million-dollar marketing organizations with analytical rigor, strategic vision, and flawless financial accountability."
]

day35["parts"][0]["say"].extend(part1_extra)
day35["parts"][1]["say"].extend(part2_extra)
day35["parts"][2]["say"].extend(part3_extra)
day35["parts"][3]["say"].extend(part4_extra)
day35["parts"][4]["say"].extend(part5_extra)

# Re-audit word counts
total_words = 0
for p in day35["parts"]:
    words = len(" ".join(p["say"]).split())
    total_words += words
    print(f"Part {p['part']}: {words} words")
    assert words >= 600, f"Part {p['part']} is under 600 words: {words}"

print(f"Total Day 35 Words: {total_words}")
assert total_words >= 3000, f"Total Day 35 words under 3000: {total_words}"

with open("scripts/branch_b/day35_dmkt_data.json", "w", encoding="utf-8") as f:
    json.dump(day35, f, indent=2)

print("Enriched Day 35 saved successfully!")
