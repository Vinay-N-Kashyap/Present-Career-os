import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day56_ecom_data.json")

with open(data_file, "r", encoding="utf-8") as f:
    data = json.load(f)

p4_extra_3 = (
    "In addition to escrow protection, the appeals engine implements immutable cryptographic audit logging for every enforcement action. "
    "Under P2B Article 11, marketplace operators must participate in certified independent mediation bodies if an account dispute cannot be "
    "resolved through internal mechanisms. The platform automatically packages all telemetry—including timestamped API logs, carrier tracking "
    "webhooks, customer communication histories, and submitted Plan of Action documents—into a tamper-evident digital evidentiary dossier. "
    "This deterministic evidentiary record withstands judicial review in civil court and arbitration tribunals, ensuring that platform "
    "enforcement decisions remain legally defensible, ethically transparent, and fully insulated against arbitrary merchant litigation."
)

p5_extra_3 = (
    "From a technical infrastructure perspective, the command tower is built upon an event-driven streaming architecture leveraging Apache Kafka "
    "and Apache Flink. Millions of high-frequency events—such as inventory count changes, price adjustments, carrier scan events, and customer review "
    "submissions—flow through stateful streaming pipelines that compute rolling 90-day defect windows, Buy Box win rates, and seller reliability "
    "scores in near real time. By pre-aggregating metrics at the stream processing layer, executive dashboards and algorithmic routing engines "
    "query operational state with sub-millisecond latency, eliminating database contention on primary transactional order databases."
)
p5_extra_4 = (
    "Ultimately, the Marketplace Seller Operations Command Tower bridges the gap between low-level technical execution and executive enterprise "
    "governance. By unifying automated seller verification, performance scorecards, algorithmic Buy Box distribution, and transparent dispute "
    "resolution into an unbroken operational continuum, the platform provides institutional stakeholders and global regulatory authorities "
    "with total operational confidence. This continuous architectural rigor guarantees that as the marketplace scales to hundreds of thousands of "
    "merchants and billions in gross merchandise value, platform integrity, customer trust, and corporate enterprise value remain unassailable."
)

data["parts"][3]["say"].append(p4_extra_3)
data["parts"][4]["say"].extend([p5_extra_3, p5_extra_4])

with open(data_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

total = 0
for i, p in enumerate(data["parts"]):
    w = sum(len(para.split()) for para in p["say"])
    total += w
    print(f"Part {i+1}: {w} words")
print(f"Total Day 56 Words: {total}")
