import json

d47_path = 'scripts/branch_b/day47_ecom_data.json'
with open(d47_path, 'r', encoding='utf-8') as f:
    d47 = json.load(f)
d47['goal'] = "Architect enterprise B2B corporate account hierarchies and governance: modeling recursive organization trees and cost center lineages, implementing Role-Based Access Control (RBAC) with statutory Separation of Duties (SOX 404), constructing multi-tier Delegation of Authority approval routing engines with budget enforcement, and deploying executive B2B governance cockpits."
with open(d47_path, 'w', encoding='utf-8') as f:
    json.dump(d47, f, indent=2, ensure_ascii=False)

d48_path = 'scripts/branch_b/day48_ecom_data.json'
with open(d48_path, 'r', encoding='utf-8') as f:
    d48 = json.load(f)
d48['goal'] = "Engineer enterprise B2B trade credit and settlement infrastructure: designing revolving credit underwriting engines with real-time exposure monitoring, generating commercial tax invoices under Net 30/60/90 and 2/10 Net 30 early payment terms, computing Accounts Receivable aging ledgers with CECL expected loss allowances, and orchestrating automated multi-stage dunning state machines with credit hold safeguards."
with open(d48_path, 'w', encoding='utf-8') as f:
    json.dump(d48, f, indent=2, ensure_ascii=False)

print("Updated Day 47 and Day 48 goals with domain-accurate text!")
