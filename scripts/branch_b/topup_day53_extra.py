"""
Add extra sentences to Parts 2, 3, 4, 5 of Day 53.
"""
import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day53_ecom_data.json")

with open(data_file, "r", encoding="utf-8") as f:
    data = json.load(f)

p2_more = (
    " Furthermore, modern bonded warehouse management systems maintain real-time automated data integrations "
    "with national customs automated broker interfaces (ABI), generating digital electronic inventory manifests "
    "that track individual SKU serial numbers and customs entry lot numbers with absolute forensic precision."
)

p3_more = (
    " By standardizing on commercial direct air injection with pre-cleared electronic manifests, cross-border e-commerce "
    "platforms deliver delivery speeds and tracking transparency that rival domestic fulfillment networks, driving customer "
    "satisfaction, lowering support ticket volumes, and cementing long-term brand loyalty across international markets."
)

p4_more = (
    " In addition to lead time optimization, dynamic inventory allocation models continuously evaluate regional carbon emissions "
    "metrics, balancing rapid air freight against eco-friendly regional ocean warehousing to satisfy corporate sustainability mandates "
    "and European environmental disclosure requirements."
)

p5_more = (
    " Ultimately, maintaining continuous real-time synchronization between international line-haul flights, customs bonded facilities, "
    "and last-mile delivery networks establishes an enterprise-grade global supply chain foundation. The Global Logistics Command "
    "Tower empowers leadership to scale cross-border operations with unmatched delivery velocity, regulatory compliance, and margin certainty."
)

data["parts"][1]["say"].append(p2_more)
data["parts"][2]["say"].append(p3_more)
data["parts"][3]["say"].append(p4_more)
data["parts"][4]["say"].append(p5_more)

with open(data_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Added extra text to Day 53 parts 2, 3, 4, 5.")
