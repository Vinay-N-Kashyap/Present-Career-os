import json

with open("scripts/branch_b/day59_ban_data.json", "r", encoding="utf-8") as f:
    d = json.load(f)

extra_p5_2 = (
    " Furthermore, quantitative risk teams must account for the pricing differentials—often termed the 'greenium' (green premium)—when "
    "evaluating capital allocation strategies in the Sustainable Finance War Room. Institutional demand from ESG-dedicated investment funds, "
    "sovereign wealth vehicles, and pension schemes frequently outstrips the available supply of certified green and sustainability-linked "
    "assets. Consequently, issuers of certified green bonds can achieve lower coupon yields compared to identical conventional debt instruments. "
    "By systematically identifying and packaging taxonomy-aligned green loans into green asset-backed securities (ABS) or green covered bonds, "
    "the bank's treasury desk can lower its wholesale funding costs by ten to twenty-five basis points, directly boosting institutional "
    "net interest margin while demonstrating concrete progress toward global net-zero emissions targets."
)
d["parts"][4]["say"].append(extra_p5_2)

with open("scripts/branch_b/day59_ban_data.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Enriched Day 59 Part 5 successfully!")
