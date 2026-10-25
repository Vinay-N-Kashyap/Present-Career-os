import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
d42_path = os.path.join(commerce_dir, "scripts", "branch_b", "day42_dmkt_data.json")

with open(d42_path, "r", encoding="utf-8") as f:
    d42 = json.load(f)

# Part 1 extra paragraphs: Dynamic Allocation & Historical Monopoly Tension
part1_extra = [
    "To fully understand the waterfall's collapse, engineers must examine Google Ad Manager's proprietary Dynamic Allocation mechanism. "
    "In a traditional waterfall, while external ad networks were locked into rigid priority tiers, Google's own ad exchange (AdX) enjoyed "
    "an asymmetric privilege: AdX was permitted to peek at the historical tier price and submit a real-time bid to steal the impression if it "
    "could beat that historical estimate by one cent. External exchanges never had real-time access; only Google AdX did. This structural "
    "monopoly advantage channeled the vast majority of high-CPM programmatic impressions into Google's ecosystem, suppressing publisher yield.",
    "Header Bidding shattered this structural advantage through client-side code injection. By executing JavaScript in the browser header "
    "before the Google Publisher Tag (GPT) initialized, independent SSPs received the impression parameters first. If AppNexus, Rubicon, "
    "or PubMatic had a high-intent buyer willing to pay $12.00 CPM, that bid was passed directly into GAM as a targeting key-value. Dynamic "
    "Allocation was forced to compete against authentic, verified external bids rather than artificially depressed historical averages. "
    "This democratization of inventory access restored competitive auction equilibrium, transferring pricing power back to digital publishers."
]

# Part 2 extra paragraphs: Prebid Module Ecosystem: User ID & Currency Engines
part2_extra = [
    "The power of Prebid.js extends far beyond basic auction orchestration; it lies in its extensible Module Ecosystem. Two of the most "
    "critical production modules are the Currency Module and the User ID Module. Because global programmatic trading operates across "
    "multinational boundaries, a European DSP might bid in Euros (EUR) while a British SSP returns bids in Pounds (GBP). The Prebid Currency "
    "Module connects to daily exchange rate feeds (such as the European Central Bank API), converting all incoming foreign bids into the "
    "publisher's canonical ad server currency (e.g. USD) with zero round-trip latency, ensuring accurate price comparison across diverse partners.",
    "Concurrently, the Prebid User ID Module addresses identity fragmentation in the post-third-party-cookie era. Rather than each adapter "
    "loading separate user syncing scripts, the User ID Module centralizes identity resolution. It coordinates dozens of universal identifier "
    "submodules—including Unified ID 2.0 (UID2), ID5, LiveRamp RampID, SharedID, and Criteo ID. The module retrieves and stores consented "
    "identity tokens in first-party local storage, attaching unified identity vectors to outgoing OpenRTB bid requests across all participating "
    "adapters. This centralized identity layer lifts addressability and CPM monetization while slashing redundant network calls.",
    "Furthermore, Prebid.js supports dynamic bidder throttling and adaptive timeout management. By monitoring adapter latency percentiles over "
    "rolling time windows, the wrapper can dynamically lower timeouts for consistently fast partners while temporarily suppressing chronic "
    "offenders that degrade page speed. This active performance tuning ensures that client-side auctions never compromise user engagement."
]

# Part 3 extra paragraphs: Cloud Economics & Managed Prebid Server Infrastructure
part3_extra = [
    "From a DevOps and infrastructure engineering perspective, operating Prebid Server (PBS) requires careful cost-benefit modeling. A high-traffic "
    "digital publishing network generating one billion monthly page views can easily produce thirty billion outbound server-to-server bid "
    "requests across thirty demand partners. Deploying self-hosted Prebid Server instances (compiled from the official Go codebase, prebid-server) "
    "on Kubernetes clusters in AWS (EKS) or Google Cloud (GKE) introduces compute, memory, and egress networking costs that must be amortized "
    "against incremental programmatic revenue lift.",
    "Enterprise publishers balance these operational trade-offs by choosing between self-hosted cloud clusters and managed PBS solutions "
    "(such as Magnite Demand Manager, Xandr Yieldex, or PubMatic OpenWrap). Managed solutions handle cloud scaling, adapter updates, and "
    "24/7 reliability monitoring in exchange for a modest revenue share (typically one to two percent of cleared programmatic spend). Large "
    "publishing conglomerates with dedicated data engineering teams favor self-hosted deployments, tuning Go runtime garbage collection and "
    "network buffers to achieve maximum computational independence and full programmatic fee transparency.",
    "Additionally, Prebid Server supports server-side cookie syncing modules that run in background worker pools. By synchronizing user "
    "identifiers across major SSP endpoints during low-priority network windows, PBS maintains match rates comparable to client-side setups "
    "without incurring mobile browser connection penalties, unlocking peak demand liquidity across both mobile web and desktop formats.",
    "Moreover, hybrid orchestration enables publishers to route high-latency adapters to Prebid Server while retaining ultra-fast local bidders "
    "in client-side Prebid.js. This split-plane architecture delivers the best of both worlds: maximizing competitive demand diversity while "
    "protecting mobile browser performance and satisfying strict Core Web Vitals performance benchmarks."
]

# Part 4 extra paragraphs: Programmatic GAM API Provisioning & Creative Sandboxing
part4_extra = [
    "Trafficking Prebid line items manually in Google Ad Manager is an impossible operational task: supporting multiple ad sizes across "
    "dense price granularity requires provisioning over two thousand discrete line items and creative associations. Enterprise programmatic "
    "operations automate this entire workflow using the Google Ad Manager API v202402 (or specialized CLI tools like prebid-cli). Automated "
    "scripts generate the complete line item hierarchy, setting inventory targeting, applying custom key-value targeting rules (e.g., "
    "hb_pb = '4.80' AND hb_bidder = 'rubicon'), and associating the Prebid Universal Creative (PUC) template programmatically.",
    "The Prebid Universal Creative (PUC) acts as an intelligent client-side rendering sandbox. When GAM selects a Prebid Price Priority "
    "line item, the PUC script renders inside a safeframe. The script extracts the matching ad ID (hb_adid) from the ad server context and "
    "calls the Prebid wrapper: pbjs.renderAd(document, adId). Prebid retrieves the cached ad markup (HTML, JavaScript, or VAST XML) from "
    "browser memory and injects it into the frame. This architecture eliminates creative trafficking discrepancies and prevents advertisers "
    "from executing unauthorized cross-domain tracking scripts inside the host publisher DOM.",
    "Furthermore, advanced publishers implement creative auditing rules within the PUC sandbox. By scanning incoming creative markup for "
    "malicious redirection scripts, heavy video auto-play files, or unapproved tracking pixels, the wrapper blocks defective ads before they "
    "impact the user, ensuring that programmatic monetization never compromises reader safety or brand reputation.",
    "Finally, continuous automated validation scripts query the GAM API daily to verify that line item rate cards, delivery pacing, and "
    "targeting expressions remain synchronized with current Prebid price granularity definitions, eliminating silent revenue misconfigurations."
]

# Part 5 extra paragraphs: Dynamic Price Flooring & Machine Learning Yield
part5_extra = [
    "The bleeding edge of publisher yield management is the deployment of Dynamic Price Floor (DPF) algorithms within the Prebid wrapper. "
    "Historically, publishers set static price floors (e.g., $2.00 CPM) across entire websites. However, static floors surrender immense "
    "value: high-intent users visiting premium financial articles command ten-dollar valuations, while low-intent remnant traffic fails to "
    "clear. Prebid Price Floors module allows publishers to define dynamic multi-dimensional floor matrices conditioned on device type, "
    "geographic country, domain sub-path, ad size, and user visit frequency.",
    "Advanced publishers train machine learning floor price models that predict the clearing price distribution for every individual "
    "impression in real time. If the model determines that competition for a specific user is intense, it elevates the floor price to "
    "compel DSPs to submit higher bids. Conversely, if competition is sparse, the floor dynamically relaxes to prevent the impression from "
    "going unsold. Incorporating dynamic price floors into Prebid wrappers elevates overall publisher programmatic yield by ten to twenty-five "
    "percent, ensuring that high-value digital content is perpetually monetized at its true economic worth.",
    "Finally, continuous A/B split testing of floor price models against static control groups guarantees that floor optimization produces "
    "statistically verified incremental revenue lift. By balancing higher clearing CPMs against potential fill rate reductions, yield directors "
    "maximize total revenue per thousand page views (RPM), establishing an optimized, automated digital publisher revenue engine.",
    "To support this continuous optimization, enterprise publishers deploy real-time telemetry streaming pipelines using Kafka and Apache Iceberg. "
    "Every individual auction bid, latency measurement, and render signal is captured in an append-only lakehouse format. Automated anomaly "
    "detection models continuously monitor partner bid rates; if a partner's win rate suddenly drops by more than twenty percent, automated "
    "alerts notify ad operations to inspect adapter configurations, ensuring zero silent revenue loss."
]

d42["parts"][0]["say"].extend(part1_extra)
d42["parts"][1]["say"].extend(part2_extra)
d42["parts"][2]["say"].extend(part3_extra)
d42["parts"][3]["say"].extend(part4_extra)
d42["parts"][4]["say"].extend(part5_extra)

# Re-audit word counts
total_words = 0
for idx, p in enumerate(d42["parts"]):
    words = len(" ".join(p["say"]).split())
    total_words += words
    print(f"Part {idx+1} ({p['title']}): {words} words")
    assert words >= 600, f"Part {idx+1} is under 600 words: {words}"

print(f"Total Day 42 Words: {total_words}")
assert total_words >= 3000, f"Total Day 42 words under 3000: {total_words}"

with open(d42_path, "w", encoding="utf-8") as f:
    json.dump(d42, f, indent=2)

print("Enriched Day 42 saved successfully!")
