import json

with open("scripts/branch_b/day59_ban_data.json", "r", encoding="utf-8") as f:
    d = json.load(f)

extra_p3 = (
    " Furthermore, quantitative carbon accounting teams must navigate the data challenges of Scope 3 reporting across private equity "
    "and SME portfolios. Under PCAF guidelines, when corporate borrowers lack audited carbon disclosures, banks apply physical activity "
    "proxies and economic input-output models to estimate financed emissions, ensuring complete portfolio coverage while transparently "
    "disclosing the weighted data quality score to supervisory authorities."
)
d["parts"][2]["say"].append(extra_p3)

extra_p5 = (
    " Furthermore, quantitative risk teams must account for the pricing differentials—often termed the 'greenium' (green premium)—when "
    "evaluating capital allocation strategies in the Sustainable Finance War Room. Institutional demand from ESG-dedicated investment funds, "
    "sovereign wealth vehicles, and pension schemes frequently outstrips the available supply of certified green and sustainability-linked "
    "assets. Consequently, issuers of certified green bonds can achieve lower coupon yields compared to identical conventional debt instruments. "
    "By systematically identifying and packaging taxonomy-aligned green loans into green asset-backed securities (ABS) or green covered bonds, "
    "the bank's treasury desk can lower its wholesale funding costs by ten to twenty-five basis points, directly boosting institutional "
    "net interest margin while demonstrating concrete progress toward global net-zero emissions targets."
)
d["parts"][4]["say"].append(extra_p5)

with open("scripts/branch_b/day59_ban_data.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Enriched Day 59 cleanly!")
for i, p in enumerate(d["parts"]):
    say_text = " ".join(p["say"]) if isinstance(p["say"], list) else p["say"]
    print(f"Part {i+1}: {len(say_text.split())} words")
