import json
import hashlib

def make_part(title, say_paragraphs, example, try_it, code, output, question, options, why):
    say_text = " ".join(say_paragraphs)
    words = len(say_text.strip().split())
    if words < 600:
        print(f"WARNING: Part '{title}' has only {words} words (target >= 600)")
    assert len(options) == 4, f"Part '{title}' must have exactly 4 options"
    assert len(why) >= 30, f"Part '{title}' why must be >= 30 chars"
    
    return {
        "title": title,
        "say": say_paragraphs,
        "example": example,
        "tryIt": try_it,
        "code": code,
        "output": output,
        "check": {
            "question": question,
            "options": options,
            "answer": 0,
            "answerIndex": 0,
            "why": why,
            "explanation": why
        }
    }

# PART 1: Third-Party Cookie Deprecation Mechanics & Google Chrome Privacy Sandbox Architecture
p1_title = "Third-Party Cookie Deprecation Mechanics & Google Chrome Privacy Sandbox Architecture"
p1_say = [
    "For over two decades, third-party cookies served as the universal connective tissue of commercial digital advertising. When a user visited news websites, blogs, or retail storefronts, third-party JavaScript tags embedded in those pages instructed the web browser to store unique alphanumeric identifiers under the domain names of external ad-tech intermediaries (e.g., adnxs.com, doubleclick.net, criteo.com). As the user browsed across the decentralized web, these third-party trackers continuously read and updated their cookie values, constructing detailed chronological dossiers of the user's browsing history, commercial affinities, health inquiries, and purchasing habits across thousands of unrelated websites. This persistent cross-site tracking occurred silently without explicit user comprehension, giving rise to pervasive surveillance advertising models and widespread consumer privacy concerns.",
    "Regulatory frameworks—including the European Union's General Data Protection Regulation (GDPR), the ePrivacy Directive, and the California Consumer Privacy Act (CCPA)—alongside browser-level interventions like Apple Safari's Intelligent Tracking Prevention (ITP) and Mozilla Firefox's Enhanced Tracking Protection (ETP), catalyzed the complete dismantling of third-party cookie infrastructure. Google Chrome, representing over sixty-five percent of global desktop and mobile browser market share, initiated its Privacy Sandbox initiative to develop privacy-preserving web standards that replace covert cross-site tracking with purposefully constrained, client-side browser APIs. The core architectural philosophy of the Privacy Sandbox is straightforward: user browsing data remains strictly local on the client device inside the browser sandbox, while advertisers receive only aggregated, anonymized, or noise-injected signals necessary to execute core marketing functions: interest targeting, remarketing, and conversion attribution.",
    "The Privacy Sandbox establishes a suite of distinct browser-native APIs that partition marketing functions into isolated operational boundaries. Rather than allowing a single third-party script to observe user behavior across multiple domains, the browser exposes specialized interfaces: the Topics API for top-of-funnel interest-based categorization; the Protected Audience API (formerly known as FLEDGE) for mid-funnel remarketing and on-device ad auctions; the Attribution Reporting API for bottom-of-funnel measurement; and the Private Aggregation API for cross-site noise-injected data querying. Each of these APIs incorporates cryptographic guarantees, differential privacy mathematics, and strict k-anonymity thresholds to guarantee that no individual user's browsing journey can be reconstructed by external observers.",
    "Transitioning an enterprise ad-tech stack from third-party cookies to the Privacy Sandbox requires fundamental changes in data engineering and media buying. Demand-Side Platforms (DSPs), Supply-Side Platforms (SSPs), and ad networks must re-architect their bidding engines to execute code inside sandboxed browser environments or within hardware-secured Trusted Execution Environments (TEEs) in public cloud infrastructure. Digital marketers can no longer rely on cross-site hyper-targeting; instead, media planning must pivot toward coarse contextual categories, verified first-party audience graphs, and statistical incrementality modeling. Embracing the Privacy Sandbox is not merely a technical compliance requirement; it represents the definitive modern standard for building sustainable, privacy-resilient digital marketing operations.",
    "From a technical compliance perspective, the Competition and Markets Authority (CMA) in the United Kingdom oversees Google's Privacy Sandbox commitments to ensure that the deprecation of third-party cookies does not unfairly entrench Google's own advertising monopoly. Consequently, the Privacy Sandbox APIs are designed as open web standards through the World Wide Web Consortium (W3C) Private Advertising Technology Community Group (PATCG). Independent ad-tech vendors, major publishers, and enterprise brands actively test and audit these APIs to verify that privacy protections are mathematically verifiable while maintaining publisher monetization liquidity and advertiser campaign performance across the open web."
]
p1_example = "A top tier digital publishing network generating $150M in annual programmatic ad revenue audited its programmatic inventory following third-party cookie blocking. Over forty percent of programmatic bids previously relied on Criteo and Trade Desk third-party cookies for audience matching. By implementing Privacy Sandbox API headers alongside publisher first-party user IDs, the publisher maintained its programmatic yield, successfully serving interest-targeted ad units via the Topics API and on-device auctions via Protected Audience API with zero cross-site cookie leaks."
p1_try_it = "Simulate a Privacy Sandbox feature detector that inspects browser capabilities and determines whether modern privacy APIs or legacy cookie fallbacks should be engaged."

p1_code = """class PrivacySandboxInspector:
    def __init__(self, browser_user_agent: str, client_sec_ch_ua: dict):
        self.ua = browser_user_agent
        self.hints = client_sec_ch_ua

    def evaluate_api_support(self) -> dict:
        is_chromium = "Google Chrome" in self.hints.get("brands", []) or "Chromium" in self.hints.get("brands", [])
        major_version = self.hints.get("major_version", 0)
        
        # Privacy Sandbox general availability launched in Chrome 115+
        sandbox_supported = is_chromium and major_version >= 115
        
        return {
            "browser_engine": "Blink" if is_chromium else "Gecko/WebKit",
            "privacy_sandbox_eligible": sandbox_supported,
            "supported_apis": {
                "topics_api": sandbox_supported,
                "protected_audience_api": sandbox_supported,
                "attribution_reporting_api": sandbox_supported,
                "private_aggregation_api": sandbox_supported
            },
            "recommended_strategy": "privacy_sandbox_first_party" if sandbox_supported else "first_party_capi_contextual"
        }

inspector = PrivacySandboxInspector(
    browser_user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    client_sec_ch_ua={"brands": ["Google Chrome", "Chromium"], "major_version": 124}
)

support = inspector.evaluate_api_support()
print("Engine:", support["browser_engine"])
print("Privacy Sandbox Eligible:", support["privacy_sandbox_eligible"])
print("Topics API Active:", support["supported_apis"]["topics_api"])
print("Attribution Reporting Active:", support["supported_apis"]["attribution_reporting_api"])
print("Strategy:", support["recommended_strategy"])
"""
p1_output = """Engine: Blink
Privacy Sandbox Eligible: True
Topics API Active: True
Attribution Reporting Active: True
Strategy: privacy_sandbox_first_party"""

p1_q = "What is the core architectural difference between legacy third-party cookie tracking and the Google Chrome Privacy Sandbox?"
p1_opts = [
    "Privacy Sandbox keeps raw browsing history strictly on the client device and exposes only noise-injected, aggregated, or interest-based APIs to ad-tech networks.",
    "Privacy Sandbox encrypts all third-party cookies using AES-256 and stores them in Google's cloud servers for real-time querying by ad networks.",
    "Privacy Sandbox eliminates all digital advertising on the web and replaces commercial ads with government-sponsored public service announcements.",
    "Privacy Sandbox requires all web users to purchase a monthly subscription to browse websites without being shown randomized banner advertisements."
]
p1_why = "Under Privacy Sandbox architecture, browsing history is kept locally on the user's client device. Instead of ad tech firms tracking cross-site user paths via cookies, the browser itself computes high-level interest categories or runs on-device auctions, sharing only privacy-safe, aggregated, or noise-injected signals with advertisers."

# PART 2: Interest-Based Advertising without Cross-Site Tracking: The Topics API Taxonomy & Differential Privacy Noise
p2_title = "Interest-Based Advertising without Cross-Site Tracking: The Topics API Taxonomy & Differential Privacy Noise"
p2_say = [
    "The Topics API is the Privacy Sandbox standard designed to facilitate top-of-funnel, interest-based advertising without revealing the specific websites a consumer visits. Under the Topics protocol, the web browser locally observes the hostnames of sites a user visits that have integrated the API. A publicly available, machine learning classification model built into the browser maps each visited hostname to one or more predefined commercial topics from an open, human-curated taxonomy (comprising roughly 469 hierarchical categories, such as '/Arts & Entertainment/Humor', '/Computers & Electronics/Consumer Electronics', or '/Autos & Vehicles/Motorcycles'). The browser does not inspect URL query parameters, sub-paths, or sensitive page contents; it only classifies the root domain name.",
    "To protect user privacy across temporal boundaries, the browser calculates the user's top commercial topics on an epoch basis (typically one epoch equals seven calendar days). At the conclusion of each epoch, the browser analyzes the domains visited during that week and selects the top five topics based on visit frequency. Crucially, to satisfy rigorous differential privacy guarantees and prevent deterministic user fingerprinting, the browser applies an intentional noise injection mechanism: with a five percent probability, the browser randomly selects a topic uniformly at random from the entire 469-topic taxonomy, rather than selecting the user's actual top topic. This mathematical noise guarantees plausible deniability, ensuring an external observer can never be mathematically certain whether a reported topic represents genuine user behavior or synthetic noise.",
    "When a user navigates to a publisher website that calls document.browsingTopics(), the browser does not expose the user's complete topic profile to the requesting ad script. Instead, the browser enforces strict caller filtering: an ad-tech caller (e.g., an ad network script like adnxs.com or doubleclick.net) can only observe a topic if that specific caller was present on a website the user visited when that topic was originally learned. Furthermore, the browser returns exactly three topics to the caller—one topic from each of the three most recent completed epochs. This prevents sudden historical profiling while providing advertisers with fresh, temporally relevant interest signals to power contextual bidding and brand affinity targeting.",
    "Sensitive topics are categorically excluded from the Topics taxonomy. Categories involving medical diagnoses, sexual orientation, religious beliefs, political affiliations, racial or ethnic identities, and financial distress are permanently prohibited from the taxonomy. This architectural boundary eliminates the risk of predatory targeting or discriminatory ad delivery, providing advertisers with a brand-safe, regulatory-compliant channel to engage prospective buyers. By replacing invasive cross-site behavioral tracking with coarse, high-level interest topics, the Topics API harmonizes the commercial necessity of audience discovery with foundational consumer privacy rights.",
    "In enterprise media operations, digital marketers leverage Topics API signals as a valuable feature within their real-time programmatic bidding algorithms. A Demand-Side Platform receiving an OpenRTB bid request enriched with Topics data combines those signals with page-level contextual NLP embeddings, publisher domain reputation metrics, and geographic parameters. Because Topics signals reflect sustained multi-week interest rather than transient single-page visits, bid valuation models assign higher bid multipliers to impressions where Topics alignment indicates deep consumer affinity, generating higher click-through rates and superior customer acquisition efficiency."
]
p2_example = "An automotive manufacturer running a campaign for an electric vehicle integrated Topics API targeting across high-traffic lifestyle blogs. When prospective buyers browsed the publisher's site, the browser returned the topic '/Autos & Vehicles/Electric & Alternative Fuel Vehicles' (observed from visits to EV review blogs over the prior two weeks). The DSP algorithm bid aggressively for the impression, achieving a 42% higher click-to-lead rate compared to generic non-targeted contextual inventory, with zero third-party cookie tracking involved."
p2_try_it = "Simulate the Topics API epoch calculation, taxonomy classification, and five-percent differential privacy noise injection."

p2_code = """import random

class TopicsAPISimulator:
    def __init__(self, taxonomy: list[str], noise_probability: float = 0.05):
        self.taxonomy = taxonomy
        self.noise_prob = noise_probability

    def calculate_epoch_topics(self, domain_visits: dict[str, str], top_k: int = 5) -> list[str]:
        # Count frequency of mapped topics
        topic_counts = {}
        for domain, topic in domain_visits.items():
            topic_counts[topic] = topic_counts.get(topic, 0) + 1
            
        # Sort by frequency descending
        sorted_topics = [t for t, c in sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)]
        top_topics = sorted_topics[:top_k]
        return top_topics

    def get_topic_for_caller(self, top_topics: list[str], random_seed: int = 42) -> dict:
        random.seed(random_seed)
        # 5% chance of returning a completely random topic from taxonomy (differential privacy noise)
        is_noisy = random.random() < self.noise_prob
        if is_noisy:
            selected = random.choice(self.taxonomy)
            source = "differential_privacy_noise"
        else:
            selected = top_topics[0] if top_topics else "Unknown"
            source = "deterministic_browsing"
            
        return {"returned_topic": selected, "source": source, "plausible_deniability": is_noisy}

taxonomy = [
    "/Autos & Vehicles/Electric Vehicles",
    "/Computers & Electronics/Laptops",
    "/Sports/Running & Walking",
    "/Finance/Investing",
    "/Home & Garden/Gardening",
    "/Travel/Air Travel",
    "/Food & Drink/Cooking"
]

simulator = TopicsAPISimulator(taxonomy, noise_probability=0.05)

# User visited multiple sites in week 1
user_history = {
    "electrek.co": "/Autos & Vehicles/Electric Vehicles",
    "cleantechnica.com": "/Autos & Vehicles/Electric Vehicles",
    "insideevs.com": "/Autos & Vehicles/Electric Vehicles",
    "runnersworld.com": "/Sports/Running & Walking",
    "strava.com": "/Sports/Running & Walking",
    "investopedia.com": "/Finance/Investing"
}

top_5 = simulator.calculate_epoch_topics(user_history)
caller_topic = simulator.get_topic_for_caller(top_5, random_seed=10)

print("Calculated Top Topics for Epoch:", top_5)
print("Returned Topic to Caller:", caller_topic["returned_topic"])
print("Source Type:", caller_topic["source"])
print("Plausible Deniability Noise Injected:", caller_topic["plausible_deniability"])
"""
p2_output = """Calculated Top Topics for Epoch: ['/Autos & Vehicles/Electric Vehicles', '/Sports/Running & Walking', '/Finance/Investing']
Returned Topic to Caller: /Autos & Vehicles/Electric Vehicles
Source Type: deterministic_browsing
Plausible Deniability Noise Injected: False"""

p2_q = "Under the Google Chrome Topics API, what mechanism ensures plausible deniability and prevents deterministic fingerprinting of a user's interests?"
p2_opts = [
    "A five percent probability that the browser returns a topic chosen completely at random from the entire taxonomy rather than the user's actual top topic.",
    "A mandatory browser requirement that all users clear their cache and browsing history every twenty-four hours.",
    "An automated system that converts all text on visited websites into encrypted hash digests before calculating topics.",
    "A rule that restricts the Topics API to operating only between the hours of 9:00 AM and 5:00 PM local time."
]
p2_why = "To satisfy formal differential privacy guarantees, the Topics API introduces 5% random noise: with a 5% probability, the browser picks a topic uniformly at random from the entire 469-topic taxonomy instead of returning the user's true calculated top topic. This mathematical noise ensures plausible deniability."

# PART 3: On-Device Remarketing & Real-Time Auctions: Protected Audience API (PAAPI / FLEDGE) & Key/Value Trusted Execution Environments (TEE)
p3_title = "On-Device Remarketing & Real-Time Auctions: Protected Audience API (PAAPI / FLEDGE) & Key/Value Trusted Execution Environments (TEE)"
p3_say = [
    "Remarketing—the practice of serving tailored advertising to consumers who previously interacted with specific products or abandoned carts on an advertiser's website—traditionally depended on cross-site third-party cookie synchronization. An e-commerce brand added the user's unique cookie ID to a DSP retargeting audience list, and whenever that cookie appeared in an ad auction on another website, the DSP bid to serve the abandoned product creative. The Protected Audience API (PAAPI, formerly known as FLEDGE) completely reinvents remarketing by shifting the entire auction and audience membership management from external ad-tech cloud servers directly into the user's local web browser runtime.",
    "Under PAAPI, when a shopper views a pair of hiking boots on an outdoor retailer's website, the retailer's script asks the browser to join an interest group by invoking navigator.joinAdInterestGroup(). The interest group payload specifies the group name (e.g., 'hiking-boots-viewed'), the DSP owner domain (e.g., 'dsp-bidder.com'), bidding logic URLs, and an array of ad creative candidates with product metadata. This interest group data is stored locally in the browser's encrypted private storage. The merchant, the DSP, and external trackers cannot inspect which other interest groups the user belongs to; all group memberships remain sealed inside the browser sandbox.",
    "When the user later navigates to an independent news publisher that sells advertising space, the publisher's SSP initiates an ad auction by calling navigator.runAdAuction(). Instead of transmitting the user's identity or browsing history over the network to hundreds of bidders, the browser itself executes the auction locally. The browser downloads the DSP's sandboxed JavaScript bidding function (generateBid()) and executes it in an isolated, network-restricted worker thread. The bidding script computes a bid price based on the local interest group data and real-time pricing signals fetched from a hardware-secured Key/Value service running in a Trusted Execution Environment (TEE). Concurrently, the seller's scoring function (scoreAd()) evaluates competing bids, selecting the winning creative based on publisher yield rules.",
    "To render the winning advertisement without leaking user identity to the host publisher page, PAAPI renders the winning creative inside a Fenced Frame. Unlike a traditional iframe—which can communicate with its parent window via postMessage, shared DOM state, or URL attributes—a Fenced Frame is an isolated browser context with strictly disabled cross-boundary communication. The publisher page cannot observe which ad rendered, and the ad creative inside the Fenced Frame cannot inspect the parent publisher URL or access storage APIs. Furthermore, to prevent micro-targeting or individual re-identification, PAAPI enforces a strict k-anonymity constraint: an ad creative can only be rendered if at least 'k' unique individuals (typically k=50 over a 30-day window) have been shown that identical ad.",
    "For enterprise programmatic marketing teams, PAAPI revolutionizes remarketing operations. Bidding algorithms must be adapted to run within strict CPU execution limits (typically under fifty milliseconds per auction) inside the client browser. Ad networks deploy Key/Value services inside confidential computing instances (such as Google Cloud Confidential VMs or AWS Nitro Enclaves) with cryptographically attested software stacks, ensuring that real-time budget pacing and inventory availability can be queried securely without exposing individual user identifiers. PAAPI proves that high-performance dynamic retargeting and uncompromising user privacy can be harmoniously achieved on the modern open web."
]
p3_example = "An international shoe retailer configured Protected Audience API on its e-commerce store. When shoppers abandoned sneakers in cart, they were assigned to the 'cart-abandoners-sneakers' interest group with an ad render URL pointing to a dynamic discount creative. When those users visited news sites, the browser executed an on-device auction via navigator.runAdAuction() in 34ms, rendering the discounted sneaker ad inside a privacy-isolated Fenced Frame without leaking browsing activity to the news publisher."
p3_try_it = "Simulate an on-device Protected Audience API auction where candidate interest groups submit bids, a publisher scoring function evaluates them, and a Fenced Frame config is generated."

p3_code = """class ProtectedAudienceAuctionSimulator:
    def __init__(self, k_anonymity_threshold: int = 50):
        self.k_threshold = k_anonymity_threshold
        # Simulating historical creative view counts across user population
        self.creative_k_counts = {
            "https://cdn.ad.com/sneakers-discount-300x250.html": 120,
            "https://cdn.ad.com/rare-boots-hypertarget-300x250.html": 12  # Fails k-anonymity
        }

    def run_on_device_auction(self, interest_groups: list[dict], publisher_floor: float) -> dict:
        bids = []
        for ig in interest_groups:
            # Simulate DSP generateBid() execution in sandboxed worker
            base_bid = ig.get("user_bid_value", 0.0)
            creative_url = ig.get("ad_creative_url", "")
            
            # Check k-anonymity constraint
            if self.creative_k_counts.get(creative_url, 0) < self.k_threshold:
                # Disqualified due to privacy threshold
                continue
                
            if base_bid >= publisher_floor:
                bids.append({
                    "buyer": ig["owner"],
                    "bid": base_bid,
                    "render_url": creative_url
                })

        if not bids:
            return {"auction_result": "no_eligible_bids", "fenced_frame_config": None}

        # Publisher scoreAd(): select highest net bid
        winning_bid = max(bids, key=lambda x: x["bid"])
        
        # In PAAPI, result is an opaque FencedFrameConfig (cannot be inspected by publisher JS)
        fenced_frame_config = f"urn:uuid:{hashlib.md5(winning_bid['render_url'].encode()).hexdigest()}"
        
        return {
            "auction_result": "success",
            "winner_buyer": winning_bid["buyer"],
            "winning_bid_cpm": winning_bid["bid"],
            "fenced_frame_config": fenced_frame_config
        }

simulator = ProtectedAudienceAuctionSimulator(k_anonymity_threshold=50)

# Local interest groups stored in browser
user_interest_groups = [
    {
        "name": "cart-abandon-sneakers",
        "owner": "retargeting-dsp.com",
        "user_bid_value": 4.50,
        "ad_creative_url": "https://cdn.ad.com/sneakers-discount-300x250.html"
    },
    {
        "name": "niche-hypertarget",
        "owner": "boutique-dsp.com",
        "user_bid_value": 8.00,
        "ad_creative_url": "https://cdn.ad.com/rare-boots-hypertarget-300x250.html"  # Disqualified: k=12 < 50
    }
]

result = simulator.run_on_device_auction(user_interest_groups, publisher_floor=2.00)
print("Auction Status:", result["auction_result"])
print("Winning Buyer:", result["winner_buyer"])
print("Winning Bid (CPM):", result["winning_bid_cpm"])
print("Opaque Fenced Frame Config:", result["fenced_frame_config"])
"""
p3_output = """Auction Status: success
Winning Buyer: retargeting-dsp.com
Winning Bid (CPM): 4.5
Opaque Fenced Frame Config: urn:uuid:c2b1e06d91da3a9dc7bc58260195ec60"""

p3_q = "In the Protected Audience API (PAAPI), why must winning advertisements be rendered inside a Fenced Frame rather than a standard iframe?"
p3_opts = [
    "To strictly block cross-boundary communication between the ad creative and the host publisher page, preventing user identity correlation.",
    "Because standard iframes cannot display images or video files formatted in high-definition WebP or AVIF formats.",
    "To automatically force the user's browser to execute payments without requiring interactive checkout confirmation.",
    "Because Fenced Frames allow the ad creative to directly inspect the user's personal browser bookmarks and saved passwords."
]
p3_why = "A Fenced Frame is an isolated browser element designed explicitly to prevent communication with its embedding page. This ensures the publisher cannot learn which ad was shown (and therefore which interest group the user belongs to), preventing cross-site user re-identification."

# PART 4: Privacy-Safe Conversion Measurement: Attribution Reporting API (ARA), Event-Level Reports & Aggregatable Summary Reports
p4_title = "Privacy-Safe Conversion Measurement: Attribution Reporting API (ARA), Event-Level Reports & Aggregatable Summary Reports"
p4_say = [
    "Conversion measurement without third-party cookies poses a profound mathematical challenge: how can an advertiser verify whether an ad click or impression on Publisher A caused a purchase on Retailer B, without allowing either entity to observe the user's cross-site browsing activity? The Attribution Reporting API (ARA) solves this puzzle by embedding an authoritative attribution engine directly inside the browser. When an ad is displayed or clicked, the browser records a source event (attributionsrc). When the user subsequently completes a conversion action on the advertiser's website, the browser records a trigger event. The browser then deterministically matches trigger events to source events locally within its encrypted client-side ledger.",
    "The Attribution Reporting API produces two distinct, complementary output formats to serve different marketing needs: Event-Level Reports and Aggregatable Summary Reports. Event-Level Reports are designed for coarse optimization and ad bidding feedback. In an event-level report, the browser ties a specific ad click ID (a 64-bit source identifier) to a very coarse conversion value (constrained to 3 bits of data for click conversions, allowing only eight distinct values, such as 0 to 7). To defeat temporal re-identification attacks, the browser does not transmit the report immediately; instead, reports are dispatched with randomized delays ranging from several hours up to thirty days across designated reporting windows.",
    "Aggregatable Summary Reports, by contrast, are designed for high-precision conversion value reporting, cross-channel multi-touch analysis, and comprehensive revenue accounting. Unlike event-level reports, aggregatable reports are not constrained to coarse bit depths; they can transmit rich, granular conversion values (such as exact transaction revenue, SKU counts, or margin contributions). However, to prevent anyone from reading individual transaction data, the browser splits each aggregatable payload into encrypted contributions and transmits them to a hardware-secured Aggregation Service running in a Trusted Execution Environment (TEE) on Google Cloud or AWS.",
    "Inside the TEE Aggregation Service, the decryption keys are held by independent Key Management Services (operated by cloud providers and privacy auditors). The service decrypts contributions in memory, aggregates conversion values across thousands of users who converted within the same campaign cohort, and injects mathematically calibrated Laplacian or Gaussian noise to enforce strict Differential Privacy (epsilon privacy budgets). The resulting output is a Summary Report that provides precise aggregate revenue figures for the campaign, while offering a formal mathematical guarantee that no individual consumer's purchase history can be reverse-engineered from the report.",
    "In enterprise marketing data pipelines, digital marketing analysts query the Aggregation Service via batch jobs, streaming the resulting summary reports directly into Google BigQuery or Snowflake data warehouses. Because differential privacy noise is zero-mean symmetric noise, aggregating reports across larger cohorts yields exceptional accuracy (with statistical error rates typically below two percent for high-volume campaigns), while smaller, hyper-granular segments exhibit higher relative noise. This mathematically incentivizes advertisers to measure broad, meaningful customer cohorts rather than engaging in invasive micro-surveillance, firmly establishing a sustainable measurement foundation for the post-cookie era."
]
p4_example = "A national retail bank ran a $5M programmatic deposit acquisition campaign using the Attribution Reporting API. The performance team utilized Event-Level reports to feed coarse 3-bit conversion signals back to Google Ads for real-time bid adjustments, while weekly Aggregatable Summary Reports processed via AWS TEE Aggregation Service delivered exact funded deposit totals with a 95% confidence interval and an empirical error rate of just 1.1% against internal ledger balances."
p4_try_it = "Simulate an Attribution Reporting API event-level coarse bit quantization and delayed reporting window scheduler."

p4_code = """class AttributionReportingSimulator:
    def __init__(self):
        # 3-bit coarse quantization for click-through event-level reports (values 0-7)
        self.coarse_buckets = [0, 25, 50, 100, 250, 500, 1000, 2500]

    def quantize_conversion_value(self, revenue: float) -> int:
        for idx in range(len(self.coarse_buckets) - 1, -1, -1):
            if revenue >= self.coarse_buckets[idx]:
                return idx
        return 0

    def generate_event_level_report(self, click_id: str, revenue: float, event_time_epoch: int) -> dict:
        # Quantize revenue to 3-bit value (0-7)
        quantized_val = self.quantize_conversion_value(revenue)
        
        # Enforce randomized delay window (e.g. 2 days or next reporting window)
        # Prevents temporal timing attacks
        scheduled_report_time = event_time_epoch + 172800  # 48 hour delay
        
        return {
            "report_type": "event_level",
            "source_event_id": click_id,
            "trigger_data_3bit": quantized_val,
            "mapped_bracket": f">=${self.coarse_buckets[quantized_val]}",
            "scheduled_dispatch_epoch": scheduled_report_time,
            "temporal_delay_hours": 48
        }

ara = AttributionReportingSimulator()

# Customer clicked ad, then bought $349.50 worth of merchandise
report = ara.generate_event_level_report("CLICK-99482-ADX", 349.50, 1718000000)

print("Report Type:", report["report_type"])
print("Source Event ID:", report["source_event_id"])
print("Quantized 3-Bit Value:", report["trigger_data_3bit"])
print("Revenue Bracket:", report["mapped_bracket"])
print("Delayed Dispatch Epoch:", report["scheduled_dispatch_epoch"])
print("Enforced Delay (Hours):", report["temporal_delay_hours"])
"""
p4_output = """Report Type: event_level
Source Event ID: CLICK-99482-ADX
Quantized 3-Bit Value: 4
Revenue Bracket: >=$250
Delayed Dispatch Epoch: 1718172800
Enforced Delay (Hours): 48"""

p4_q = "Why does the Attribution Reporting API intentionally introduce randomized multi-day delays before dispatching Event-Level conversion reports?"
p4_opts = [
    "To prevent advertisers from correlating the exact minute of a conversion with external web server click logs, defeating temporal re-identification attacks.",
    "Because Google Chrome cloud servers can only process conversion data on the first calendar day of each month.",
    "To allow consumer banks sufficient time to process credit card disputes before ad commissions are finalized.",
    "Because browser encryption algorithms require forty-eight hours of continuous mathematical computation to generate SHA-256 digests."
]
p4_why = "If event-level reports were transmitted instantly upon conversion, an advertiser could match the timestamp of the conversion report with their server's exact timestamp of the user's visit, deanonymizing the cross-site user path. Introducing randomized time delays eliminates this temporal correlation attack vector."

# PART 5: European Regulatory Compliance: Google Consent Mode v2 (Advanced vs Basic), TCF v2.2 & Server-Side Consent Gating
p5_title = "European Regulatory Compliance: Google Consent Mode v2 (Advanced vs Basic), TCF v2.2 & Server-Side Consent Gating"
p5_say = [
    "Under the enforcement of the European Union's Digital Markets Act (DMA), General Data Protection Regulation (GDPR), and the IAB Europe Transparency and Consent Framework (TCF v2.2), digital advertising across the European Economic Area (EEA) requires strict, verifiable user consent prior to collecting personal data or accessing device storage. Designating major tech platforms as 'gatekeepers', the European Commission mandates that ad platforms like Google cannot utilize personal data from core platform services for ad targeting without affirmative, freely given, specific, and informed user consent. To enforce compliance across the global advertising ecosystem, Google made Consent Mode v2 mandatory for all advertisers bidding on Google Ads or tracking via Google Analytics 4.",
    "Consent Mode v2 introduces two new mandatory consent signals alongside legacy parameters: ad_user_data (controlling whether personal user data can be sent to Google for advertising purposes) and ad_personalization (controlling whether remarketing and personalized ad delivery can be enabled), complementing the existing analytics_storage and ad_storage flags. When an EU visitor encounters a certified Consent Management Platform (CMP) banner (e.g., OneTrust, Cookiebot, Didomi) and selects their privacy preferences, the CMP translates the user's choices into standardized Consent Mode v2 state flags that are passed to Google tags.",
    "Enterprise implementations must choose between two distinct deployment architectures: Basic Consent Mode and Advanced Consent Mode. In Basic Consent Mode, if a user rejects cookies or denies consent, marketing tags are completely blocked from executing. Zero network pings leave the browser, and no data is transmitted to ad platforms. While legally conservative, Basic Consent Mode creates complete data blindness, eliminating conversion visibility for thirty to sixty percent of European traffic. By contrast, in Advanced Consent Mode, tags load regardless of consent state, but their operational behavior dynamically adapts: if consent is denied, tags do not read or write cookies, and they transmit cookieless, state-free 'pings' stripped of identifiers to Google. Google's machine learning models then use these cookieless pings to model unconsented conversions mathematically, recovering over seventy percent of lost conversion volume while remaining strictly compliant with privacy regulations.",
    "On the server side, Server GTM and Conversions API infrastructure must enforce rigorous consent gating. When an incoming event beacon arrives at the server container, the server extracts the user's consent parameters (such as the TCF v2.2 TC string or Google consent flags). In an enterprise server-side setup, server variables dynamically inspect these consent states before dispatching downstream API calls. If ad_user_data is 'denied', the server script strips all hashed email, phone, and IP addresses from the outbound Meta CAPI and Google Ads payloads, or halts the outbound request entirely. This guarantees that corporate compliance policies are deterministically enforced at the cloud network edge, eliminating the risk of regulatory enforcement penalties that can reach up to four percent of global annual turnover under GDPR.",
    "Auditability is the cornerstone of regulatory resilience. Compliance engineering teams maintain immutable consent audit logs in BigQuery, recording the consent timestamp, CMP version, TC string, and applied consent states for every user session. During regulatory inquiries by European Data Protection Authorities (such as CNIL in France or the Irish DPC), the enterprise can prove with cryptographic certainty that every conversion signal utilized for ad optimization was preceded by valid, un-coerced user authorization, establishing an unbreachable shield of statutory compliance."
]
p5_example = "A multinational European airline operating across 27 EU member states upgraded to Google Consent Mode v2 Advanced across its web booking engines. Prior to the upgrade, forty-two percent of visitors rejected ad cookies, creating a massive conversion reporting deficit that caused Google Smart Bidding algorithms to reduce bids on key European flight routes. With Advanced Consent Mode and automated server-side consent gating, Google's conversion modeling recovered 78% of unconsented conversions without violating ePrivacy directives, stabilizing international campaign ROAS."
p5_try_it = "Simulate an enterprise consent gating engine that inspects Consent Mode v2 flags and sanitizes outbound server-side ad network payloads."

p5_code = """class ConsentModeV2GatingEngine:
    def sanitize_payload_for_egress(self, raw_event: dict, consent_state: dict) -> dict:
        egress_payload = raw_event.copy()
        
        # 1. Check ad_storage consent
        if consent_state.get("ad_storage") != "granted":
            # Strip cookie identifiers
            egress_payload.pop("fbp", None)
            egress_payload.pop("fbc", None)
            egress_payload.pop("gclid", None)
            egress_payload["cookies_allowed"] = False
        else:
            egress_payload["cookies_allowed"] = True

        # 2. Check ad_user_data consent
        if consent_state.get("ad_user_data") != "granted":
            # Strip all hashed customer PII
            egress_payload.pop("email_hash", None)
            egress_payload.pop("phone_hash", None)
            egress_payload.pop("client_ip", None)
            egress_payload["pii_forwarded"] = False
        else:
            egress_payload["pii_forwarded"] = True

        # 3. Check ad_personalization consent
        if consent_state.get("ad_personalization") != "granted":
            egress_payload["non_personalized_ads_only"] = True
        else:
            egress_payload["non_personalized_ads_only"] = False
            
        return egress_payload

engine = ConsentModeV2GatingEngine()

raw_conversion = {
    "event_name": "Purchase",
    "value": 189.00,
    "currency": "EUR",
    "email_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "fbp": "fb.1.1718000000.88412",
    "client_ip": "198.51.100.22"
}

# User clicked "Deny All" on EU Cookie Banner
eu_denied_consent = {
    "analytics_storage": "denied",
    "ad_storage": "denied",
    "ad_user_data": "denied",
    "ad_personalization": "denied"
}

sanitized_event = engine.sanitize_payload_for_egress(raw_conversion, eu_denied_consent)

print("Original Payload Keys:", sorted(list(raw_conversion.keys())))
print("Sanitized Egress Keys:", sorted(list(sanitized_event.keys())))
print("PII Forwarded:", sanitized_event["pii_forwarded"])
print("Cookies Allowed:", sanitized_event["cookies_allowed"])
print("Non-Personalized Ads Only:", sanitized_event["non_personalized_ads_only"])
"""
p5_output = """Original Payload Keys: ['client_ip', 'currency', 'email_hash', 'event_name', 'fbp', 'value']
Sanitized Egress Keys: ['cookies_allowed', 'currency', 'event_name', 'non_personalized_ads_only', 'pii_forwarded', 'value']
PII Forwarded: False
Cookies Allowed: False
Non-Personalized Ads Only: True"""

p5_q = "What are the two new mandatory consent signals introduced by Google Consent Mode v2 to comply with the European Digital Markets Act (DMA)?"
p5_opts = [
    "ad_user_data and ad_personalization.",
    "user_tracking_allowed and cross_site_fingerprint.",
    "device_identifier_access and session_recording_optin.",
    "cookie_expiration_override and browser_storage_unrestricted."
]
p5_why = "Google Consent Mode v2 introduced two specific new parameters required for DMA compliance: ad_user_data (governing whether personal data can be sent to Google for ads) and ad_personalization (governing whether user data can be used for remarketing and audience targeting)."

# Assemble Day 37
parts = [
    make_part(p1_title, p1_say, p1_example, p1_try_it, p1_code, p1_output, p1_q, p1_opts, p1_why),
    make_part(p2_title, p2_say, p2_example, p2_try_it, p2_code, p2_output, p2_q, p2_opts, p2_why),
    make_part(p3_title, p3_say, p3_example, p3_try_it, p3_code, p3_output, p3_q, p3_opts, p3_why),
    make_part(p4_title, p4_say, p4_example, p4_try_it, p4_code, p4_output, p4_q, p4_opts, p4_why),
    make_part(p5_title, p5_say, p5_example, p5_try_it, p5_code, p5_output, p5_q, p5_opts, p5_why)
]

day37_data = {
    "day": 37,
    "coursePrefix": "bcom_dmkt",
    "title": "Privacy-Preserving Ad Tech & The Privacy Sandbox: Topics API, Protected Audience API (PAAPI), Attribution Reporting API & Consent Mode v2",
    "goal": "Master Google Chrome Privacy Sandbox architecture, implement interest-based advertising via the Topics API, execute on-device remarketing auctions via Protected Audience API, capture differential-privacy conversion telemetry via Attribution Reporting API, and enforce Google Consent Mode v2 compliance.",
    "recap": "Yesterday we established first-party server-side tagging and direct Conversions API pipelines. Today we master the client-side browser standards that replace third-party cookies across modern web platforms, combining machine-learning topic classification, on-device auctions, and cryptographically verified privacy measurement.",
    "minutes": 38,
    "parts": parts
}

out_path = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\day37_dmkt_data.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(day37_data, f, indent=2)

print(f"Successfully generated Day 37 data at {out_path}!")
total_words = sum(len(" ".join(p["say"]).split()) for p in parts)
print(f"Day 37 Total Words: {total_words}")
for i, p in enumerate(parts):
    words = len(" ".join(p["say"]).split())
    print(f"  Part {i+1} ({p['title']}): {words} words")
