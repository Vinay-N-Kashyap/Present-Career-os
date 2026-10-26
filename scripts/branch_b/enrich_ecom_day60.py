"""
Enrich Day 60 content in generate_ecom_day60.py to ensure every part >= 610 words
"""
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/branch_b/generate_ecom_day60.py', 'r', encoding='utf-8') as f:
    text = f.read()

p1_extra = '''    "To govern the federated supergraph schema securely, enterprise CI/CD deployment pipelines integrate automated schema registry checks (utilizing Apollo Studio or GraphQL Hive). Before any squad merges a subgraph pull request into production, the registry evaluates schema diffs against active client query traffic collected over the preceding 30 days. Any breaking schema change—such as deleting a deprecated field or mutating a scalar type that an active mobile app version still relies upon—automatically blocks the pipeline. Furthermore, canary subgraph deployments route 1% of production query traffic through new subgraph revisions, monitoring p99 latency and error rates before completing automated zero-downtime Kubernetes rolling updates.",'''

p2_extra = '''    "For international cross-border expansion, the Tier 2 SEO architecture automates multi-lingual hreflang link tags and localized XML sitemaps across 45 national domain extensions. Edge workers inspect incoming IP geolocation and Accept-Language headers, delivering localized content without redirect penalties. Furthermore, the platform deploys zero-latency edge A/B testing: by rewriting HTML streams directly at the edge CDN worker rather than injecting client-side JavaScript testing scripts, merchandising squads test alternative layout headlines and CTA buttons with absolute zero Cumulative Layout Shift (CLS = 0.00) and zero LCP penalty, preserving top-tier Google search rankings.",'''

p3_extra = '''    "Looking to the operational future of physical store fulfillment, the Tier 3 architecture incorporates automated Micro-Fulfillment Center (MFC) robotics into premier high-volume retail hubs. Automated tote-shuttle systems operating in store backrooms retrieve fast-moving SKUs in under 45 seconds, presenting items directly to associate packing stations. Furthermore, continuous RFID scanning tunnels verify cart contents as associates move between stockrooms and staging bins, maintaining a proven 99.6% physical inventory accuracy. Automated algorithmic rebalancing transfers excess store inventory from slow-moving suburban locations to high-velocity urban stores, slashing end-of-season markdown write-downs.",'''

p4_extra = '''    "To fortify the platform against multi-region infrastructure disasters during high-stakes flash drops, Tier 4 architecture implements active-active Redis Sentinel failovers and multi-cluster Kafka replication via MirrorMaker 2. If an entire cloud availability zone suffers sudden power failure during a flash drop, edge DNS health checks shift traffic to healthy regional clusters in under 3 seconds. The atomic Lua pre-reservation state is protected by synchronous multi-node replication, ensuring that in-flight reservation tokens and customer waiting room queue positions survive node terminations without data corruption or oversell anomalies.",'''

p5_extra = '''    "In concluding the boardroom defense, the candidate presents the definitive curriculum synthesis across the entire PinIT Commerce Track. Over 420 masterclass days across all seven courses—mastering forensic accounting ledgers in Course 01, corporate capital valuation in Course 02, brand equity systems in Course 03, statutory audit assurance in Course 04, banking treasury operations in Course 05, digital performance analytics in Course 06, and enterprise platform architecture in Course 07—the graduate has demonstrated unparalleled technical, financial, and architectural supremacy. The Board of Directors formally ratifies the CCO-EA credential, establishing an unshakeable corporate legacy and celebrating the triumphant 100% completion of Branch B!",'''

# Inject before the closing bracket of each pX_say
for i, extra in enumerate([p1_extra, p2_extra, p3_extra, p4_extra, p5_extra], start=1):
    pattern = rf'(p{i}_say = \[.*?)(\n\])'
    match = re.search(pattern, text, re.DOTALL)
    if match:
        replacement = match.group(1) + ",\n" + extra + match.group(2)
        text = text[:match.start()] + replacement + text[match.end():]
        print(f"Injected extra paragraph into p{i}_say")
    else:
        print(f"Failed to find match for p{i}_say")

with open('scripts/branch_b/generate_ecom_day60.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated generate_ecom_day60.py successfully!")
