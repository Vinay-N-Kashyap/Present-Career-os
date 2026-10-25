import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
d43_path = os.path.join(commerce_dir, "scripts", "branch_b", "day43_dmkt_data.json")

with open(d43_path, "r", encoding="utf-8") as f:
    d43 = json.load(f)

# Part 1 extra paragraphs: OpenPath, Green Media Products & Carbon Reduction in SPO
part1_extra = [
    "A transformative structural shift in modern Supply Path Optimization is the disintermediation of intermediary exchanges through technologies "
    "like The Trade Desk's OpenPath. Historically, DSPs only connected to SSPs, which in turn connected to publishers. With OpenPath, the DSP integrates "
    "directly into the publisher's Prebid wrapper, bypassing intermediary ad exchanges entirely. This direct connection provides the DSP with unfiltered, "
    "direct access to publisher inventory, eliminating exchange take-rates and reducing network latency to the absolute minimum theoretical limit.",
    "However, direct integrations create operational trade-offs between publishers and specialized SSPs. Traditional SSPs offer essential publisher services: "
    "automated malvertising scanning, creative rendering optimization, dynamic floor pricing, and credit risk underwriting (guaranteeing publisher "
    "payment even if an individual advertiser defaults). Enterprise media buyers evaluate these trade-offs mathematically: balancing the fee savings "
    "of ultra-direct paths against the inventory quality guarantees and specialized publisher yield tools provided by premium tier-one SSP partners.",
    "Furthermore, modern enterprise SPO increasingly incorporates environmental sustainability via Green Media Products and Scope 3 programmatic emissions "
    "accounting. Every redundant bid request transmitted across dozens of SSPs consumes electrical power in data centers and telecommunication networks. "
    "By pruning duplicate reseller pathways and reducing queries per second (QPS) by up to fifty percent, SPO delivers a dramatic reduction in digital "
    "carbon footprints while concentrating media dollars into high-performing, verified publishers with transparent supply chains."
]

# Part 2 extra paragraphs: ANA Programmatic Benchmark Study, MFA Eradication & Log-Level Fee Reconciliation
part2_extra = [
    "The financial imperative for aggressive supply path fee compression was starkly validated by the Association of National Advertisers (ANA) "
    "Programmatic Benchmark Study. Analyzing billions of real-world programmatic impressions, the ANA uncovered that billions of marketing dollars "
    "were wasted on low-quality 'Made-For-Advertising' (MFA) websites. MFA sites are designed solely to capture programmatic ad revenue: featuring "
    "twenty to thirty auto-refreshing display banners per page, low-quality syndicated clickbait articles, and artificial pop-under traffic. Because "
    "reseller ad networks arbitrage MFA inventory at cheap CPMs, un-optimized DSP algorithms routed massive budgets into these digital sinkholes.",
    "Supply Path Optimization serves as the primary technical mechanism to eliminate MFA waste. By cross-referencing log-level seller data with "
    "independent ad verification registries (such as Jounce Media and DeepSee), SPO engines automatically flag and blacklist MFA publishing domains. "
    "Advertisers re-channel media budgets away from low-signal arbitrage traps and into high-engagement journalism and premium content publishers, "
    "restoring campaign effectiveness and ensuring that programmatic media dollars drive authentic, measurable consumer attention.",
    "In addition to filtering low-quality sites, enterprise SPO mandates rigorous Log-Level Fee Reconciliation. By joining impression-level win logs "
    "from the DSP with seller log data from SSPs, auditors measure the precise take-rate extracted at each intermediary hop. Hidden tech fees, "
    "unauthorized revenue shares, and discrepancy margins are quantified down to individual millicents. This forensic visibility gives procurement "
    "teams decisive leverage to renegotiate contractual master service agreements with programmatic vendors.",
    "Crucially, progressive enterprises establish strict Supplier Tiering Frameworks. Tier One consists of verified direct SSP connections operating "
    "under contractual fee caps (typically under twelve percent take-rate) with guaranteed SLAs on bid token delivery and zero ad arbitrage. "
    "Tier Two accommodates specialized vertical SSPs providing differentiated audience or contextual signals under negotiated margins. All unauthorized "
    "Tier Three reseller networks are permanently blocked at the DSP pre-bid level, structurally eliminating un-audited intermediary tolls."
]

# Part 3 extra paragraphs: Quantile Regression, Pinball Loss Optimization & Asymmetric Surplus Capture
part3_extra = [
    "At the mathematical frontier of bid shading lies Quantile Regression. Standard linear or polynomial regressions estimate the conditional "
    "mean of historical clearing prices; however, in programmatic first-price auctions, the distribution of competing bids is heavily skewed and "
    "heteroskedastic. Shading bids based purely on average clearance leads to severe underbidding on competitive inventory and overbidding on "
    "sparse inventory. Quantile regression models solve this by estimating specific conditional percentiles (e.g., the 60th or 75th percentile "
    "of the clearance distribution) using the asymmetric Pinball Loss Function.",
    "The pinball loss function penalizes underestimation (bidding below the true clearance price and losing the impression) by a factor of tau, "
    "while penalizing overestimation (bidding above clearance and overpaying) by a factor of 1 - tau. By tuning tau dynamically based on campaign "
    "budget pacing requirements, the DSP can operate in an aggressive value-capture mode (low tau, deep shading) during over-pacing periods, "
    "or in a high-delivery win-maximization mode (high tau, conservative shading) when campaigns need to pace rapidly. This asymmetric statistical "
    "control guarantees that algorithmic bid shading adapts dynamically to shifting commercial objectives.",
    "Machine learning bid shaders also model publisher price elasticity across granular dimensions: domain, ad slot, time of day, device type, "
    "and user geographic tier. By projecting the win probability curve as a function of shade depth, the shading engine calculates the exact "
    "bid that maximizes Expected Surplus (defined as the win probability multiplied by the difference between private valuation and shaded bid). "
    "This game-theoretic optimization extracts millions in working media surplus across high-volume programmatic media portfolios."
]

# Part 4 extra paragraphs: Multi-Tenant Rotating Buyer Seats, Floor Elasticity & Economic Game Theory
part4_extra = [
    "To counter publisher dynamic floors targeted at specific buyer accounts, advanced enterprise trading desks implement Multi-Tenant "
    "Rotating Demand Seats. In OpenRTB protocols, when an exchange applies dynamic floor pricing, it frequently conditions the floor on the "
    "incoming seat identifier (e.g. elevating floors for 'Seat-AutoCorp' because historical data proves AutoCorp has high willingness to pay). "
    "To prevent floor price discrimination, enterprise DSPs distribute bidding volume across multiple diversified seat identifiers and agency "
    "bidding IDs, cycling requests through randomized accounts to prevent exchange algorithms from profiling individual buyer demand curves.",
    "Simultaneously, data science teams track the publisher's Floor Elasticity Curve: calculating the marginal trade-off between floor price "
    "elevation and fill rate collapse. If an exchange elevates its floor by 40% but experiences a 60% collapse in buyer fill rate, total "
    "publisher revenue declines. Savvy DSPs leverage this economic reality in programmatic negotiations: sharing log-level bid distribution "
    "telemetry with publishers to prove that lowering artificial price floors will dramatically expand overall buyer spend, aligning publisher "
    "yield with buyer surplus in a cooperative economic equilibrium.",
    "Furthermore, sophisticated buyers monitor the prevalence of 'Soft Floors' versus 'Hard Floors'. Soft floors allow bids below the floor "
    "to enter a secondary auction tier or be evaluated under second-price fallback rules. By analyzing historical win rates at prices adjacent "
    "to stated floor thresholds, buyers calibrate their shading boundaries to exploit soft floor leniency without triggering hard rejections."
]

# Part 5 extra paragraphs: Real-Time SPO Pipelines, Streaming Lakehouse Architectures & Edge Deployment
part5_extra = [
    "In enterprise technology deployments, the Supply Path Optimization engine is built on real-time streaming lakehouse architectures. High-throughput "
    "message queues (Kafka) capture log-level impression, bid, win, and conversion streams, piping terabytes of data daily into Delta Lake or "
    "Apache Iceberg tables managed by Databricks or Snowflake. Automated dbt transformation models aggregate path-level metrics on an hourly "
    "basis: computing effective CPMs, viewability rates, invalid traffic (IVT) percentages, and conversion attribution deltas.",
    "Every midnight, an automated machine learning scoring pipeline processes the aggregated path features, recalculating composite SPO scores "
    "for every active exchange pathway. If an exchange pathway's latency spikes, if its take-rate drifts, or if its conversion attribution rate "
    "drops below statistical control thresholds, the SPO engine automatically pushes updated routing rules directly into the DSP via REST APIs. "
    "Inefficient paths are down-weighted or blacklisted, while high-performing direct paths receive expanded budget shares. This continuous, "
    "self-healing optimization ensures that enterprise programmatic media operations perpetually run at peak capital efficiency.",
    "At operational run-time, these routing decisions and bid shading models must execute within strict latency constraints (under five milliseconds). "
    "Trained neural network or tree-based shading models are compiled into lightweight C++ or Rust binaries, or exported to ONNX runtimes deployed "
    "directly onto edge bidding nodes in global data centers (Ashburn, Frankfurt, Tokyo, Singapore). This edge inference ensures that rich statistical "
    "optimization never compromises the tight 100ms OpenRTB auction deadline.",
    "Finally, governance dashboards display real-time Supply Path Health Telemetry to agency trading leads and corporate procurement officers. "
    "KPI monitors visualize real-time working media percentages, intermediary take-rate distributions, and win-rate degradation curves across "
    "all connected SSP endpoints. Automated alerting triggers immediate escalations when an SSP or publisher deviates from agreed take-rate SLAs, "
    "enforcing continuous contractual compliance and institutional accountability across the programmatic ecosystem.",
    "Looking forward, algorithmic SPO is converging with privacy-enhancing technologies (PETs) and clean room data federations. As third-party cookies "
    "deprecate, high-value supply paths are those capable of resolving first-party identity graph tokens (such as Unified ID 2.0 or RampID) with "
    "zero data leakage. DSPs favor supply partners who provide cryptographically secure, deterministic match signals inside privacy clean rooms, "
    "ensuring that the supply path of tomorrow is not merely cost-efficient and low-latency, but fully resilient against regulatory and browser privacy shifts."
]

# Reload pristine base from build_day43_dmkt if needed, or check current d43
# Let's rebuild d43 cleanly from build_day43_dmkt so we don't double append
import subprocess
print("Re-running build_day43_dmkt.py to get clean base...")
subprocess.run(["python", os.path.join(commerce_dir, "scripts", "branch_b", "build_day43_dmkt.py")], check=True)

with open(d43_path, "r", encoding="utf-8") as f:
    d43 = json.load(f)

d43["parts"][0]["say"].extend(part1_extra)
d43["parts"][1]["say"].extend(part2_extra)
d43["parts"][2]["say"].extend(part3_extra)
d43["parts"][3]["say"].extend(part4_extra)
d43["parts"][4]["say"].extend(part5_extra)

# Re-audit word counts
total_words = 0
for idx, p in enumerate(d43["parts"]):
    words = len(" ".join(p["say"]).split())
    total_words += words
    print(f"Part {idx+1} ({p['title']}): {words} words")
    assert words >= 600, f"Part {idx+1} is under 600 words: {words}"

print(f"Total Day 43 Words: {total_words}")
assert total_words >= 3000, f"Total Day 43 words under 3000: {total_words}"

with open(d43_path, "w", encoding="utf-8") as f:
    json.dump(d43, f, indent=2)

print("Enriched Day 43 saved successfully!")
