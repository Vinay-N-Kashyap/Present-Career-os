"""
Add extra sentences to Parts 4 and 5 of Day 47.
"""
import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day47_ecom_data.json")

with open(data_file, "r", encoding="utf-8") as f:
    data = json.load(f)

p4_more = (
    " Furthermore, modern payment platforms maintain real-time automated ledger synchronization "
    "with internal accounting engines such as NetSuite, SAP, or Workday. By streaming payout events "
    "over distributed Kafka topics with guaranteed at-least-once delivery semantics, enterprise financial "
    "controllers maintain continuous end-to-end visibility into every transfer batch across all global merchant partners."
)

p5_more = (
    " In addition to annual tax filing preparation, the Command Tower generates real-time predictive "
    "treasury cash-flow projections that forecast future seller payout liabilities against incoming settled "
    "consumer receipts, guaranteeing that platform treasury reserves never fall below statutory liquidity ratios."
)

data["parts"][3]["say"].append(p4_more)
data["parts"][4]["say"].append(p5_more)

with open(data_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Added extra text to Day 47 parts 4 & 5.")
