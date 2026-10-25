import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
d41_path = os.path.join(commerce_dir, "scripts", "branch_b", "day41_dmkt_data.json")

with open(d41_path, "r", encoding="utf-8") as f:
    d41 = json.load(f)

# Part 1 extra paragraphs: Network Socket Engineering & Multiplexing
part1_extra = [
    "At the network transport layer, managing millisecond latency budgets requires relentless TCP connection optimization. Establishing a "
    "fresh TCP connection over public internet routing incurs a three-way handshake (SYN, SYN-ACK, ACK), while negotiating TLS 1.3 adds another "
    "one or two round-trip times (RTTs). In a high-frequency RTB environment where auctions resolve in eighty milliseconds, dedicating thirty "
    "milliseconds to connection setup is completely unviable. To eliminate this overhead, DSPs and SSPs maintain persistent, long-lived HTTP/2 "
    "and HTTP/1.1 TCP keep-alive connection pools across dedicated cross-connect fiber links. Thousands of concurrent bid requests and responses "
    "stream over pre-warmed sockets without re-negotiating handshakes, slashing protocol overhead to near zero.",
    "Furthermore, modern bidding engines deploy Linux kernel tuning parameters specifically engineered for high-concurrency socket queues. "
    "Network engineers increase the maximum socket listen backlog (somaxconn), tune TCP receive and send buffers (tcp_rmem and tcp_wmem), and "
    "disable TCP slow start after idle. By pairing kernel-level socket optimizations with thread-per-core asynchronous runtimes (such as "
    "Rust with Tokio or C++ with Seastar), DSP bidding engines achieve deterministic sub-millisecond packet processing, ensuring that internal "
    "compute latency remains consistently below ten milliseconds even under multi-million QPS volumetric loads."
]

# Part 2 extra paragraphs: PMP Private Marketplaces & AdCOM Deep-Dive
part2_extra = [
    "A vital commercial subsystem within the OpenRTB specification is the Private Marketplace (PMP) object model. In addition to open "
    "exchange auctions, publishers and advertisers negotiate direct, privileged trading arrangements codified via the 'pmp' object inside "
    "the impression specification. A PMP object contains an array of 'deals' objects, each carrying a unique alphanumeric deal ID ('dealid'), "
    "a guaranteed or private floor price, an auction type (such as at=3 for fixed-price private deals or at=1 for first-price private auctions), "
    "and a list of allowed buyer seats (wseat). When a DSP bid request carries an eligible dealid, the bidding engine bypasses open auction "
    "filters and applies dedicated campaign budget lines, guaranteeing preferential access to premium publisher inventory.",
    "In OpenRTB 3.0, the AdCOM (Advertising Communication Object Model) revolutionizes how creative assets are defined and validated. Rather "
    "than embedding raw, unvetted HTML or JavaScript strings into adm parameters—which creates immense ad-quality and security risks—AdCOM "
    "decomposes creatives into structured, typed data objects. For native advertising, AdCOM defines explicit asset objects for headlines, "
    "body copy, call-to-action text, brand logos, and main images with strict aspect ratios and character constraints. This structured "
    "decoupling allows publishers to render native ads seamlessly matching their publication's unique typographic aesthetic while enabling "
    "DSPs to audit creative safety, malvertising risk, and rendering performance with automated static analysis."
]

# Part 3 extra paragraphs: Bid Shading Calculus & Clearance eCDFs
part3_extra = [
    "The mathematical formulation of Bid Shading in First-Price programmatic auctions represents one of the most sophisticated optimization "
    "challenges in computational advertising. When a DSP bids on an impression, it estimates the customer's true economic value V (the unshaded "
    "valuation). In a first-price auction, submitting bid B = V yields zero buyer surplus if won. The DSP's objective is to solve an expected "
    "surplus maximization problem: maximize E[Surplus] = (V - B) * P(Win | B), where P(Win | B) represents the probability of winning the "
    "auction at bid price B. If the DSP shades too aggressively (setting B very low), P(Win | B) drops to zero, and the DSP wins no inventory. "
    "If the DSP shades too conservatively (setting B close to V), it wins inventory but surrenders all economic surplus.",
    "To estimate the win probability function P(Win | B), DSP data science teams fit empirical Cumulative Distribution Functions (eCDFs) and "
    "survival regression models over historical auction clearing prices. Features such as publisher domain, placement position, device type, "
    "hour of day, and user segment are fed into gradient boosted decision trees or neural networks to predict the second-highest competing bid. "
    "The optimal shaded bid B* is computed in real time at the point where the marginal increase in win probability equals the marginal loss "
    "in surplus. Operating continuous, closed-loop bid shading algorithms enables modern media buyers to lower effective CPMs by thirty to "
    "fifty percent while preserving overall impression acquisition volume."
]

# Part 4 extra paragraphs: PID Budget Pacing & Token Bucket Throttling
part4_extra = [
    "To prevent campaign budgets from exhausting prematurely, enterprise DSPs integrate PID (Proportional-Integral-Derivative) controllers "
    "into their dynamic QPS and bid management engines. In digital advertising, consumer web traffic follows strong diurnal cycles: traffic "
    "peaks during midday and evening hours while dropping significantly during early morning hours. If a bidding algorithm operates without "
    "dynamic pacing, it may spend its entire daily campaign budget within the first four hours of the morning, missing high-converting evening "
    "audiences entirely. A PID controller continuously monitors actual spend against ideal pacing trajectories, dynamically adjusting the "
    "bidding multiplier and QPS intake to smooth budget deployment evenly across twenty-four hours.",
    "At the network layer, token bucket and leaky bucket rate limiters regulate traffic across multi-region clusters. Implemented inside "
    "distributed in-memory data grids (such as Redis or Hazelcast), token buckets maintain real-time QPS quotas allocated to specific SSP "
    "endpoints. If a partner exchange suddenly experiences a volumetric traffic spike, the token bucket enforces local throttling, shedding "
    "excess requests with HTTP 429 or HTTP 204 responses before the influx can saturate internal network switches. This distributed pacing "
    "architecture protects infrastructure stability while ensuring smooth, predictable media delivery for corporate marketing campaigns."
]

# Part 5 extra paragraphs: Win Notices (nurl), Loss Notices (lurl) & Billing Reconciliation
part5_extra = [
    "The operational loop of Real-Time Bidding does not terminate when the DSP emits its BidResponse; it extends into post-auction settlement "
    "and verification. OpenRTB specifications define two vital notification URLs embedded within the bid object: the Win Notice URL (nurl) and "
    "the Loss Notice URL (lurl). When the publisher's ad server resolves the auction and selects the winning creative, the SSP fires an "
    "asynchronous HTTP GET request to the DSP's nurl endpoint. The nurl payload includes encrypted dynamic auction macros—such as ${AUCTION_PRICE}—which "
    "the exchange populates with the exact clearing CPM price. The DSP's billing engine decrypts the clearing price macro, records the financial "
    "liability in the transactional accounting ledger, and increments campaign spend in real time.",
    "Conversely, if the DSP's bid fails to clear the auction, participating exchanges support Loss Notices via the lurl callback. The exchange "
    "populates the ${AUCTION_LOSS} macro with standardized OpenRTB loss reason codes: for example, Code 100 indicates the bid was lost to a "
    "higher competing bid; Code 102 indicates the bid failed to meet the publisher's reserve floor; and Code 103 indicates the creative was "
    "rejected by publisher category restrictions. The DSP streams these loss signals into its machine learning feature stores, continuously "
    "recalibrating its bid shading models and floor price predictors. By uniting real-time bidding, dynamic shading, and closed-loop loss "
    "telemetry, the modern programmatic trader establishes an automated, highly profitable media buying engine.",
    "Finally, financial reconciliation systems continuously audit discrepancy rates between DSP win notices and publisher billing invoices. "
    "In global programmatic trading, discrepancies of two to five percent are common due to user navigation drop-offs (where an auction clears "
    "but the user navigates away before the creative finishes rendering), ad-blocking browser extensions, or network dropouts. Enterprise "
    "accounting engines ingest monthly reconciliation statements from SSPs, running automated delta analysis to detect anomalous invoice "
    "variances. If a publisher exchange exhibits an impression discrepancy exceeding eight percent, automated alerts trigger technical audits "
    "to inspect creative load times, CDN latency, and ad verification tags, protecting marketing capital from delivery leakage."
]

d41["parts"][0]["say"].extend(part1_extra)
d41["parts"][1]["say"].extend(part2_extra)
d41["parts"][2]["say"].extend(part3_extra)
d41["parts"][3]["say"].extend(part4_extra)
d41["parts"][4]["say"].extend(part5_extra)

# Re-audit word counts
total_words = 0
for idx, p in enumerate(d41["parts"]):
    words = len(" ".join(p["say"]).split())
    total_words += words
    print(f"Part {idx+1} ({p['title']}): {words} words")
    assert words >= 600, f"Part {idx+1} is under 600 words: {words}"

print(f"Total Day 41 Words: {total_words}")
assert total_words >= 3000, f"Total Day 41 words under 3000: {total_words}"

with open(d41_path, "w", encoding="utf-8") as f:
    json.dump(d41, f, indent=2)

print("Enriched Day 41 saved successfully!")
