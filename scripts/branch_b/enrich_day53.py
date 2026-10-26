import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
builder_path = os.path.join(commerce_dir, "scripts", "branch_b", "build_day53_dmkt.py")

new_p1_say = """p1_say = [
    "In digital retail media advertising, bid management is not an intuitive guessing game; it is an applied financial optimization problem governed by "
    "strict unit economics, profit margins, and inventory turnover velocities. When an enterprise brand bids on sponsored product keywords across retail "
    "marketplaces such as Amazon, Walmart, Target, or Instacart, every penny added to a Cost-Per-Click (CPC) bid directly impacts operating profit. "
    "To govern retail search campaigns with actuarial precision, enterprise growth architects master the mathematical trinity of retail media finance: "
    "Advertising Cost of Sales (ACOS), Return on Ad Spend (ROAS), and Total Advertising Cost of Sales (TACOS).",
    "Advertising Cost of Sales (ACOS) is the universal efficiency standard of retail marketplace advertising, defined as the ratio of direct advertising spend "
    "to direct attributed advertising revenue: ACOS = Ad Spend / Attributed Ad Revenue. Return on Ad Spend (ROAS) is simply the mathematical inverse of ACOS: "
    "ROAS = Attributed Ad Revenue / Ad Spend = 1 / ACOS. For example, if a campaign expends $2,500 on sponsored search ads to generate $10,000 in attributed "
    "sales, the ACOS is 25.0% and the corresponding ROAS is 4.0x. A lower ACOS indicates higher nominal advertising capital efficiency.",
    "However, managing campaigns purely to minimize ACOS creates a dangerous trap: bidding so conservatively that sales volume collapses, causing the brand "
    "to forfeit market share and organic ranking momentum. To determine the profit-maximizing bid boundary, the brand must calculate its Break-Even ACOS. "
    "The Break-Even ACOS is precisely equal to the product's Pre-Ad Gross Margin Percentage: Break-Even ACOS = (Selling Price - COGS - Retailer Fees) / Selling Price. "
    "If an enterprise product sells for $100.00, with $35.00 in Cost of Goods Sold (COGS) and $25.00 in retailer referral and fulfillment fees, the pre-advertising "
    "contribution margin is $40.00 (or 40.0%). Therefore, any campaign operating at an ACOS below 40.0% generates net operating profit on ad-driven sales, "
    "while an ACOS above 40.0% operates at a net cash loss.",
    "From this margin foundation, we derive the fundamental formula for Algorithmic Target ACOS Bidding: "
    "Max CPC = Target ACOS * Average Order Value (AOV) * Conversion Rate (CVR). "
    "For instance, if a brand establishes a Target ACOS of 20.0%, with an Average Order Value of $80.00 and an empirical search keyword conversion rate "
    "of 12.5%, the maximum economically viable CPC bid is: 0.20 * $80.00 * 0.125 = $2.00. If the conversion rate surges to 20.0%, the bid algorithm dynamically "
    "escalates the ceiling to $3.20 without compressing target profit margins.",
    "To balance paid ad efficiency against enterprise-wide brand growth, corporate leadership monitors Total Advertising Cost of Sales (TACOS). TACOS evaluates "
    "ad spend against Total Brand Revenue (combining both paid ad sales and organic marketplace sales): TACOS = Ad Spend / Total Brand Revenue. "
    "A healthy, expanding retail brand typically exhibits a declining or stable TACOS (e.g., between 8% and 12%) even as raw ad spend scales. This occurs because "
    "high advertising sales velocity elevates the product's organic sales rank (Best Seller Rank), driving a powerful wave of organic discovery that lifts total "
    "revenue faster than ad expenditure.",
    "In multi-product enterprise portfolios, bid managers construct Portfolio Margin Matrices that tier Target ACOS settings according to product life cycle "
    "stages. Flagship mature SKUs with high organic market share are governed with conservative Target ACOS thresholds (e.g., 15% to 18%) to maximize net cash "
    "flow generation. Conversely, newly launched breakthrough SKUs are governed with growth-oriented Break-Even Target ACOS thresholds (e.g., 35% to 40%) to "
    "aggressively acquire initial sales velocity and customer reviews, accepting zero immediate net profit to establish long-term marketplace dominance.",
    "Enterprise bid management engines continuously evaluate the elasticity between ACOS and TACOS. If an algorithm reduces ad bids to artificially compress "
    "ACOS, but total organic sales collapse—causing TACOS to spike—the engine detects the negative feedback loop and recalibrates bids to preserve overall "
    "catalog momentum and marketplace dominance."
]"""

new_p2_say = """p2_say = [
    "In retail marketplace search, ad placements are not created equal. An ad impression displayed at the very top of page one search results generates "
    "radically different consumer engagement, click-through rates, and conversion velocities than an ad buried at the bottom of the page or relegated "
    "to a carousel on a competitor's product detail page. Modern retail media platforms—most notably Amazon Advertising and Walmart Connect—operationalize "
    "this reality through Placement Bidding Architecture, allowing advertisers to apply differential Placement Bid Multipliers across discrete digital real estate.",
    "The retail search results page is partitioned into three canonical placement environments: Top of Search (first page, positions 1 through 4), "
    "Rest of Search (middle and bottom of page one, and subsequent search pages), and Product Detail Pages (carousels situated beneath the Buy Box or "
    "within product description tabs on competing or complementary item pages). Empirical marketplace analytics show that Top of Search placements capture "
    "between sixty and seventy-five percent of all consumer clicks and exhibit conversion rates two to three times higher than secondary placements.",
    "Under placement bidding rules, an advertiser configures a Base CPC Bid alongside percentage-based Placement Multipliers, ranging from 0% up to 900%. "
    "When an impression opportunity arises, the ad server dynamically inflates the base bid: Effective Bid = Base Bid * (1 + Placement Multiplier / 100). "
    "For example, if a campaign establishes a Base Bid of $1.50 with a Top of Search Multiplier of 100% (+100%), the effective bid for Top of Search auctions "
    "escalates to $3.00, while competing for Rest of Search impressions at the baseline $1.50.",
    "In second-price auction environments, placement multipliers directly influence clearing price dynamics. A high Top of Search multiplier ensures that "
    "when a high-intent shopper executes a commercial query, the advertiser's bid comfortably clears the competitive reserve floor and defeats rival brand "
    "bids. However, because second-price auctions charge only one cent above the runner-up bidder's effective Ad Rank, an advertiser with superior product "
    "relevance and strong historical conversion velocity often clears Top of Search auctions at an actual CPC substantially lower than their maximum theoretical ceiling.",
    "Sophisticated bid optimization algorithms deploy Placement-Specific Unit Economics to determine optimal multipliers. Rather than applying uniform "
    "multipliers across all campaigns, the engine evaluates placement-level historical performance logs. If Top of Search generates a 20.0% conversion rate "
    "at an average order value of $80.00, while Product Pages convert at only 5.0% for the identical keyword, the algorithmic value of a Top of Search click "
    "is exactly four times higher than a Product Page click. The algorithm calibrates multipliers to ensure that both placements achieve the exact same Target ACOS.",
    "Furthermore, aggressive Top of Search bidding delivers a powerful Organic Flywheel Dividend. Marketplace ranking algorithms heavily weight recent "
    "sales velocity and keyword-specific conversion rates when calculating organic search rankings. By dominating Top of Search placements, a brand captures "
    "high-intent purchases that rapidly elevate the product's organic ranking to page one, effectively generating low-cost organic sales that compound the initial paid investment.",
    "However, unconstrained placement multipliers can trigger severe budget depletion if campaign budgets are exhausted during morning hours. Enterprise "
    "bidding engines continuously monitor hourly pacing and impression share metrics, dynamically tapering placement multipliers when auction clearing "
    "prices surge during hyper-competitive promotional events or seasonal retail peaks."
]"""

new_p3_say = """p3_say = [
    "Consumer shopping behavior follows highly predictable, circadian biological and social cycles. On major retail marketplaces, the probability that "
    "a consumer clicks an ad and completes a purchase fluctuates dramatically depending on the hour of the day and day of the week. During late-night "
    "and early-morning hours (e.g., 2:00 AM to 5:00 AM), search traffic drops to a trickle, and the small fraction of users browsing exhibit low intent "
    "and abysmal conversion rates. Conversely, during prime evening hours (e.g., 7:00 PM to 10:00 PM), consumers sit on their couches actively completing "
    "shopping carts, driving conversion rates to daily peaks.",
    "In traditional retail media management, campaigns operate under Flat Daily Bidding: maintaining identical CPC bids 24 hours a day. Flat daily bidding "
    "triggers a catastrophic structural failure known as the Early Budget Exhaustion Trap. Because retail ad networks reset daily budgets at midnight "
    "Pacific Time, flat-bidding campaigns spend aggressively during the low-converting graveyard shift. By 2:00 PM, when high-intent consumers begin "
    "shopping in earnest, the campaign has completely exhausted its daily budget, missing the most lucrative conversion hours of the day.",
    "To solve this problem, enterprise growth engineering teams construct Circadian Bidding Automation and Hourly Dayparting Engines. Dayparting engines "
    "evaluate historical hourly conversion rate (CVR) and traffic velocity telemetry over multi-week rolling windows, computing a dynamic Hourly Bid Modifier "
    "for each hour of the day: Hourly Modifier = (Hourly CVR / Average Daily CVR) * Pacing Weight. "
    "During low-converting hours, bids are throttled down by thirty to fifty percent (e.g., 0.50x), conserving budget and preventing wasteful spend. "
    "During peak evening conversion windows, bids are escalated by twenty to forty percent (e.g., 1.35x), ensuring maximum auction win rates when "
    "consumers are most likely to buy.",
    "To eliminate statistical noise on lower-volume search keywords where individual hours may register zero clicks or orders, the dayparting engine applies "
    "Bayesian Empirical Smoothing. Rather than relying on raw hourly conversion rate ratios, the engine regularizes sparse hourly data toward the broader "
    "product category circadian distribution. This prevents the bidding engine from overreacting to single-click anomalies while accurately capturing macro "
    "consumer purchasing rhythms.",
    "Furthermore, dayparting algorithms must account for Time Zone Normalization across national retail networks. In continental markets spanning multiple "
    "time zones (such as the United States, spanning Eastern, Central, Mountain, and Pacific zones), prime shopping hours roll across the continent in "
    "a four-hour progressive cascade. Advanced bidding systems deploy Geographic Dayparting, scheduling localized bid adjustments that follow the solar wave "
    "as peak evening shopping travels from New York to Los Angeles.",
    "Operating dayparting at scale requires seamless integration with retail media APIs (such as the Amazon Ads API or Walmart Connect API). Because retail "
    "ad APIs impose strict rate limits and quota caps, enterprise software clusters batch bid updates into efficient micro-bursts, modifying thousands "
    "of keyword bids in parallel seconds before target hourly transitions.",
    "By eliminating budget waste during off-peak hours and concentrating capital firepower during peak conversion windows, circadian dayparting engines "
    "routinely expand total daily sales by fifteen to thirty percent while cutting blended ACOS by three to five percentage points."
]"""

new_p4_say = """p4_say = [
    "In retail media search campaigns, customer search queries are inherently dynamic and continuously evolving. Consumers search using colloquial terms, "
    "specific product feature combinations, emerging trend slang, and misspellings that brand managers could never anticipate manually. To systematically "
    "discover new high-converting search queries while pruning wasted ad spend, enterprise retail advertising platforms implement Automated Keyword "
    "Harvesting and Negative Keyword Gating Pipelines.",
    "The standard retail media campaign structure operates around a Dual-Engine Keyword Architecture: The Discovery Engine and The Performance Engine. "
    "The Discovery Engine consists of Auto-Targeting and Broad Match campaigns, where the marketplace ad server automatically matches product listings "
    "against related customer search terms. The Performance Engine consists of Exact Match campaigns, where the brand exercises absolute control over "
    "bids for proven, high-converting keyword terms.",
    "The Automated Keyword Harvester functions by continuously analyzing Customer Search Term Reports extracted via reporting APIs. The algorithm evaluates "
    "every search term queried by shoppers against strict Actuarial Promotion Criteria: "
    "First, Order Threshold (minimum 3 orders within a 14-day rolling window). "
    "Second, Efficiency Threshold (ACOS less than or equal to the Target ACOS). "
    "Third, Conversion Rate Threshold (CVR greater than or equal to 10.0%). "
    "When a search term satisfies all three criteria in a broad or auto campaign, the harvesting engine automatically executes two coordinated actions: "
    "it promotes the search term to an Exact Match keyword in the Performance Engine with an optimized target bid, and simultaneously injects the term "
    "as a Negative Exact Keyword into the Discovery Engine. This negative keyword gating eliminates internal auction cannibalization, ensuring the brand "
    "never bids against itself across multiple campaigns.",
    "To handle linguistic diversity, the harvesting pipeline integrates N-Gram Query Tokenization. The engine parses raw query strings into unigrams, "
    "bigrams, and trigrams, evaluating the aggregate conversion efficiency of multi-word phrases. When specific modifiers (such as 'gluten free' or 'sugar free') "
    "consistently demonstrate high conversion velocity across disparate search queries, the engine flags these attributes for inclusion in product listing "
    "copy and automated campaign expansions.",
    "Conversely, the engine executes Negative Keyword Gating to prune non-converting search queries ('ad spend bleeders'). If a search query accumulates "
    "more than twenty clicks without generating a single order or operates at an ACOS more than two times the break-even threshold, the engine automatically "
    "adds the query to the campaign's Negative Exact or Negative Phrase list. This permanently blocks ad impressions for that query, immediately halting budget waste.",
    "Furthermore, the harvesting engine incorporates Semantic Root Clustering to detect broad irrelevance. If multiple queries sharing the same stem "
    "(e.g., 'free', 'used', 'repair', 'manual', 'replacement parts') trigger clicks without converting, the engine flags the entire lexical root and "
    "adds it as a Campaign-Level Negative Phrase keyword, protecting the entire catalog from adjacent non-commercial intent.",
    "Automating this harvesting and gating cycle on a weekly or daily schedule transforms retail search advertising from a labor-intensive manual chore "
    "into an autonomous, self-optimizing discovery machine that systematically compounds revenue while ruthlessly eliminating media waste."
]"""

new_p5_say = """p5_say = [
    "To synthesize target ACOS unit economics, placement multipliers, circadian dayparting, and automated keyword harvesting into an industrial software "
    "system, we engineer the Production Algorithmic Bidding & Search Term Harvester Engine in Python. In high-velocity retail media operations, managing "
    "thousands of SKUs across multiple national marketplaces manually is impossible. This production engine provides autonomous, closed-loop bid execution, "
    "adjusting bids dynamically every hour while harvesting high-converting consumer search terms at wire speed.",
    "The software architecture comprises four core operational services: Service 1 is the Target ACOS Math Engine, continuously calculating baseline "
    "economic bids based on product margin profiles, current conversion rates, and catalog inventory levels. Service 2 is the Placement Multiplier "
    "Synthesizer, computing placement-level conversion rate ratios to dynamically adjust Top of Search and Product Page multipliers. Service 3 is the "
    "Circadian Dayparting Controller, modulating effective bids throughout the day to prevent early morning budget exhaustion and concentrate capital "
    "during high-converting evening hours. Service 4 is the Search Term Harvester & Negation Engine, mining query logs, promoting winning terms, and "
    "suppressing non-converting bleeders.",
    "To operate safely in mission-critical retail environments, the platform implements Asynchronous Task Orchestration and Rate-Limited API Dispatchers. "
    "Bid adjustments are queued into in-memory Redis task queues, processed by distributed worker pools that throttle API calls according to the strict "
    "token bucket rate limits imposed by retail marketplace gateways (e.g., Amazon Ads API 10 requests per second). Exponential backoff with randomized jitter "
    "handles transient network timeouts or HTTP 429 rate-limiting responses, ensuring zero dropped bid adjustments during critical promotional trading windows.",
    "The engine enforces strict Operational Guardrails and Safeguards: Bid Floors (e.g., minimum bid $0.20 to maintain baseline search visibility), "
    "Bid Ceilings (e.g., maximum bid $6.00 to prevent runaway algorithms from burning budgets during auction spikes), and Maximum Daily Step Velocity "
    "(capping bid adjustments to +/-25% per update to prevent wild auction volatility). Furthermore, the engine checks real-time inventory levels: "
    "if Buy Box ownership is lost or inventory drops below safety thresholds, the engine immediately pauses advertising for that specific SKU.",
    "Additionally, the engine maintains an Immutable Audit Ledger that logs every bid adjustment, placement modifier shift, and keyword harvesting action "
    "alongside exact timestamps, prior values, new values, and mathematical justification codes. This auditable telemetry ensures that enterprise media "
    "traders, brand managers, and financial controllers maintain complete transparency over algorithmic execution, enabling forensic performance analysis "
    "and rapid troubleshooting in the event of unexpected marketplace shifts.",
    "The output of this unified platform is a deterministic, auditable bidding manifest detailing every bid adjustment, placement multiplier, and "
    "harvested keyword directive, ready for seamless deployment via automated REST APIs to Amazon Advertising, Walmart Connect, and Criteo ad servers.",
    "By mastering the algorithmic mathematics of target ACOS bidding, placement economics, circadian dayparting, and autonomous keyword harvesting, "
    "you establish an unshakeable operational edge in digital retail media, maximizing e-commerce market share while safeguarding corporate profit margins."
]"""

with open(builder_path, "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(r"p1_say = \[.*?\]\np1_example", new_p1_say + "\np1_example", content, flags=re.DOTALL)
content = re.sub(r"p2_say = \[.*?\]\np2_example", new_p2_say + "\np2_example", content, flags=re.DOTALL)
content = re.sub(r"p3_say = \[.*?\]\np3_example", new_p3_say + "\np3_example", content, flags=re.DOTALL)
content = re.sub(r"p4_say = \[.*?\]\np4_example", new_p4_say + "\np4_example", content, flags=re.DOTALL)
content = re.sub(r"p5_say = \[.*?\]\np5_example", new_p5_say + "\np5_example", content, flags=re.DOTALL)

with open(builder_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully enriched build_day53_dmkt.py!")
