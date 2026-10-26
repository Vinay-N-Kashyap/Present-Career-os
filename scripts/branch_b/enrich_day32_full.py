import json
from build_day32_dmkt import day32

# Part 1 enrichment: currently 551 words. Add ~90 words.
part1_extra = [
    "To resolve selection bias at institutional scale, econometricians deploy randomized holdout experiments and Ghost Ad methodologies within programmatic bidding pipelines. When a conversion lift study is initiated, the ad server randomly splits eligible impressions into an ad-exposed group and a control group served with public service announcements or un-rendered ghost bids. By comparing conversion rates strictly between users who were equally likely to be exposed to an impression, the potential outcomes framework neutralizes endogenous intent, isolating the genuine treatment effect of the advertising stimulus with mathematical certitude."
]

# Part 2 enrichment: currently 520 words. Add ~110 words.
part2_extra = [
    "Furthermore, statistical power in matched-market experimentation requires careful calibration of the Minimum Detectable Lift (MDL). Because geographic aggregated sales series inherently exhibit higher variance than individual user clickstreams, small percentage lifts can be easily obscured by background economic noise. Data science teams execute pre-experiment power simulations using historical sales variance and intra-cluster correlation coefficients, establishing the exact duration (typically 8 to 12 weeks) and geographic coverage required to achieve 80% statistical power at a 5% false-positive rate, ensuring that executive leadership does not misinterpret inconclusive noise as an advertising failure."
]

# Part 3 enrichment: currently 540 words. Add ~95 words.
part3_extra = [
    "To validate the parallel trends assumption with forensic rigor, practitioners estimate dynamic event-study regression models across the pre-treatment baseline. By interacting the treatment indicator with time dummies for every historical week prior to the campaign launch, the econometrician explicitly tests whether the pre-intervention treatment coefficients are statistically indistinguishable from zero. If pre-period coefficients show a statistically significant positive or negative slope, the parallel trends assumption is violated, signaling that unobserved regional shocks are contaminating the comparison and requiring synthetic control adjustments."
]

# Part 4 enrichment: currently 530 words. Add ~100 words.
part4_extra = [
    "The optimization of synthetic control weights incorporates out-of-sample cross-validation to prevent overfitting on pre-treatment noise. Econometricians partition the pre-intervention timeline into a training period and a validation holdout period, tuning the regularization parameters and donor weights to minimize mean squared prediction error on the holdout. Additionally, to quantify statistical uncertainty without relying on traditional large-sample asymptotic assumptions, analysts execute 'In-Place Placebo Tests' and 'In-Time Placebo Tests', re-running the synthetic control algorithm across every untreated donor market to construct empirical p-values for the observed treatment effect."
]

# Part 5 enrichment: currently 509 words. Add ~120 words.
part5_extra = [
    "Finally, enterprise marketing governance institutionalizes causal incrementality into annual capital allocation covenants. Chief Marketing Officers establish statutory hurdle rates, mandating that paid advertising channels maintain a minimum verified incremental ROAS (iROAS >= 1.50x) audited via quarterly geo-experiments. Performance marketing agencies and internal media buying teams are compensated based on causal incremental margin rather than vanity platform-reported metrics, completely realigning marketing operations with corporate finance, cash flow generation, and long-term shareholder equity creation.",
    "By bridging econometric theory with corporate capital governance, causal incrementality transforms marketing from an unaccountable cost center into an audited, value-creating growth engine. Enterprise leaders gain the mathematical certainty required to scale high-performing campaigns aggressively while shutting down waste, ensuring that every dollar of marketing expenditure produces verified economic lift for the business."
]

extras = [part1_extra, part2_extra, part3_extra, part4_extra, part5_extra]

total_words = 0
for idx, p in enumerate(day32["parts"]):
    p["part"] = idx + 1
    p["say"].extend(extras[idx])
    
    # Fix check
    chk = p["check"]
    chk["answer"] = 0
    chk["answerIndex"] = 0
    assert len(chk["options"]) == 4
    assert len(chk["why"]) >= 20
    
    words = len(" ".join(p["say"]).split())
    total_words += words
    print(f"Part {p['part']}: {words} words")
    assert words >= 600, f"Part {p['part']} is under 600 words: {words}"

print(f"Total Day 32 Words: {total_words}")
assert total_words >= 3000, f"Total Day 32 words under 3000: {total_words}"

with open("scripts/branch_b/day32_dmkt_data.json", "w", encoding="utf-8") as f:
    json.dump(day32, f, indent=2)

print("Enriched Day 32 saved successfully!")
