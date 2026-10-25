import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
builder_path = os.path.join(commerce_dir, "scripts", "branch_b", "build_day52_dmkt.py")

with open(builder_path, "r", encoding="utf-8") as f:
    text = f.read()

# Part 1 addition
p1_add = '''    "To facilitate deterministic identity resolution without leaking sensitive customer records, retailers partner with enterprise data onboarding "
    "platforms such as LiveRamp and Unified ID 2.0 (UID2). When a retailer shares a high-value customer cohort with a DSP, raw customer emails and phone "
    "numbers are processed through irreversible cryptographic salt hashes before transmission. At the demand-side platform layer, incoming real-time bid "
    "requests from digital publishers are matched against these tokenized identifiers within sub-millisecond execution windows. This ensures that the "
    "retailer's core proprietary data asset remains completely secure while providing programmatic DSP algorithms with the exact audience signals required "
    "to win high-converting impressions on the open programmatic exchange.",
'''

# Part 2 addition
p2_add = '''    "Within the Amazon Marketing Cloud SQL environment, media analysts leverage advanced SQL analytical constructs—such as window functions "
    "(`ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_time)`), common table expressions (CTEs), and temporal difference operators (`DATEDIFF`)—to "
    "map complex multi-touch customer trajectories. Analysts can calculate the median duration between a consumer's first video impression and their "
    "eventual product purchase, evaluate the impact of ad exposure frequency on conversion probability, and isolate optimal lookback windows. This granular "
    "temporal clarity empowers brands to adjust programmatic bidding cadences, dynamically throttling bids when a consumer enters the optimal consideration "
    "window.",
'''

# Part 3 addition
p3_add = '''    "Additionally, closed-loop attribution frameworks model In-Store Geographic Proximity Effects. By ingesting store geolocation coordinates "
    "and matching them against mobile device lat-long ad interaction telemetry, the attribution engine determines whether local ad density drives localized "
    "foot traffic spikes. If a digital programmatic campaign concentrates ad impressions within a three-mile radius of specific supermarket locations, "
    "the engine evaluates the localized physical store sales lift relative to control stores in neighboring zip codes. This spatial econometric modeling "
    "enables regional sales directors and retail merchandisers to coordinate hyper-local digital advertising with physical store product inventory levels.",
'''

# Part 4 addition
p4_add = '''    "Managing the Differential Privacy Loss Budget ($\\epsilon$) across continuous daily clean room queries requires rigorous mathematical governance. "
    "Every time an analyst executes a query that queries user records, a fraction of the cumulative privacy budget is consumed ($$\\sum \\epsilon_i \\le \\epsilon_{\\text{total}}$$). "
    "If an organization exhausts its privacy budget within a quarterly reporting period, the clean room automatically locks further exploratory queries "
    "to prevent potential reconstruction attacks. Advanced clean rooms employ Rényi Differential Privacy (RDP) and Zero-Concentrated Differential Privacy "
    "(zCDP) frameworks to provide tighter bounds on privacy loss under composition, enabling analysts to execute hundreds of complex multi-touch queries "
    "while maintaining provable, airtight privacy guarantees.",
    "Furthermore, cross-device household identity resolution must account for Identity Churn. Mobile advertising IDs are frequently reset by consumers, "
    "and household IP addresses dynamically change across broadband providers. Retail identity graphs solve this through machine-learning graph clustering "
    "algorithms that continuously evaluate edge weights between observed device tokens. When a consumer logs into their retail e-commerce app on a new device, "
    "the identity graph immediately binds the new hardware token to the historical household cluster, ensuring that New-to-Brand attribution calculations "
    "remain accurate even across multi-device consumer hardware upgrades.",
'''

# Part 5 addition
p5_add = '''    "In addition to real-time closed-loop reconciliation, the control tower provides an Automated Media Mix Optimization Engine. Traditional retail "
    "marketers often fall into the trap of over-investing in brand search ads—which capture high nominal ROAS but low incremental lift—while neglecting "
    "off-site upper-funnel display and streaming video. The control tower continuously calculates the Marginal Return on Ad Spend (mROAS) across all "
    "active media tactics by fitting non-linear diminishing returns curves (such as the Hill function) against clean room attribution logs. When the marginal "
    "revenue of on-site search drops below the marginal revenue of off-site CTV video, the engine issues programmatic API webhooks that rebalance budget "
    "allocations across DSP seats.",
    "Finally, the platform enforces Enterprise Data Governance and Regulatory Compliance Auditing. With global data protection frameworks such as GDPR, "
    "CCPA/CPRA, and state-level consumer privacy laws imposing strict guidelines on retail data commercialization, the control tower maintains an immutable "
    "audit ledger of every clean room query, audience hash, and data export. Corporate legal officers, data protection directors, and Chief Commercial "
    "Officers can inspect verifiable cryptographic proofs confirming that no consumer personally identifiable information (PII) was exposed, transferred, "
    "or compromised during any stage of retail media activation or closed-loop measurement.",
'''

# Insert additions before closing brackets of each say array
# Find p1_say ending
m1 = text.find('p1_example =')
text = text[:m1].rstrip()
# Find last ] before m1
idx1 = text.rfind(']')
text = text[:idx1] + p1_add + text[idx1:]

# Find p2_say ending
m2 = text.find('p2_example =')
idx2 = text[:m2].rstrip().rfind(']')
text = text[:idx2] + p2_add + text[idx2:]

# Find p3_say ending
m3 = text.find('p3_example =')
idx3 = text[:m3].rstrip().rfind(']')
text = text[:idx3] + p3_add + text[idx3:]

# Find p4_say ending
m4 = text.find('p4_example =')
idx4 = text[:m4].rstrip().rfind(']')
text = text[:idx4] + p4_add + text[idx4:]

# Find p5_say ending
m5 = text.find('p5_example =')
idx5 = text[:m5].rstrip().rfind(']')
text = text[:idx5] + p5_add + text[idx5:]

with open(builder_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Successfully enriched build_day52_dmkt.py!")
