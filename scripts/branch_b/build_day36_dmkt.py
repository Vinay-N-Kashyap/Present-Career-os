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

# PART 1: Client-Side Tagging Vulnerabilities & Server-Side GTM Architecture
p1_title = "Client-Side Tagging Vulnerabilities & Server-Side GTM Architecture"
p1_say = [
    "In modern digital marketing infrastructure, client-side tag management systems like traditional Google Tag Manager or raw browser JavaScript snippets face catastrophic data degradation. Client-side execution relies entirely on the end-user's browser downloading, parsing, and running third-party JavaScript files that are fetched over public networks, parsed by client CPUs, and subject to browser resource constraints. The rise of sophisticated privacy controls—such as Apple's Intelligent Tracking Prevention (ITP) in Safari, Firefox Enhanced Tracking Protection (ETP), ad-blocking browser extensions (uBlock Origin, AdGuard), private DNS resolvers, and network firewalls—causes anywhere from twenty to thirty-five percent of client-side tracking beacons to be dropped, intercepted, or corrupted before ever reaching marketing endpoints. Furthermore, client-side tags expose sensitive customer personal information (PII) directly within the browser runtime environment, where compromised third-party scripts or malicious browser extensions can inspect JavaScript variables, DOM trees, and network payloads.",
    "Server-Side Tagging, typically orchestrated through Server-Side Google Tag Manager (sGTM) running on isolated container instances (such as Google Cloud Run or AWS Elastic Container Service), fundamentally shifts the data collection paradigm from a decentralized client broadcast to a centralized first-party proxy. Instead of loading dozens of vendor scripts (Meta Pixel, Google Ads, TikTok Pixel, LinkedIn Insight Tag, Pinterest Tag) directly into the user's browser, the client executes a single, lightweight first-party transport request. This request is sent directly to a custom first-party subdomain (such as data.enterprise.com or metrics.enterprise.com) hosted behind the brand's own SSL/TLS certificate. Because the endpoint resides on the identical top-level domain plus one (eTLD+1) as the website itself, the browser treats all network traffic and issued HTTP cookies as strictly first-party context, completely immune to third-party cookie blocking and cross-site tracking mitigation heuristics.",
    "Once the first-party HTTP payload hits the server container, the Server-Side GTM runtime unpacks the request into an internal unified event data model. Within this secure, sandboxed server environment, data governance teams can enforce strict zero-trust data privacy rules before any payload leaves the server. Sensitive fields such as customer tax identification numbers, unhashed email addresses, plaintext phone numbers, credit card tokens, or internal operational metadata can be stripped, obfuscated, transformed, or encrypted. The server container then acts as a sovereign dispatcher, translating the single incoming event into parallel, authenticated outbound server-to-server API calls to Meta Conversions API (CAPI), Google Ads Enhanced Conversions API, TikTok Events API, and enterprise data warehouses like Google BigQuery or Snowflake. This architecture slashes client browser CPU utilization, drastically improves page load performance and Core Web Vitals (Largest Contentful Paint, Interaction to Next Paint), and restores near-perfect event telemetry integrity.",
    "From an enterprise engineering standpoint, transitioning to server-side tagging requires resilient infrastructure provisioning. Production deployments typically utilize Google Cloud Run in an auto-scaling configuration with a minimum of three active container instances across multi-zone clusters to ensure zero cold-start latency and continuous high availability. The server container maps incoming HTTP headers (including Client-IP, User-Agent, and custom tracking headers) to downstream vendor payloads while ensuring that client IP addresses are anonymized or truncated where required by GDPR, CCPA, and statutory privacy mandates. Operating server-side tagging also enables deterministic request caching, rate limiting, and centralized error logging, transforming digital marketing analytics from an uncontrolled client-side free-for-all into an auditable, enterprise-grade data engineering pipeline.",
    "Moreover, server-side tagging redefines cookie security architecture. When client-side scripts set cookies via document.cookie, modern browsers restrict them to a short shelf-life of 24 hours to 7 days if the traffic arrived with URL query parameters such as gclid or fbclid. By contrast, when cookies are issued by a server container via the Set-Cookie HTTP response header with HttpOnly, Secure, and SameSite=Lax flags, the browser treats them as authentic first-party session state that endures for up to 400 days under strict ITP compliance guidelines. This preservation of persistent first-party identifiers guarantees that multi-month consideration cycles—typical in enterprise B2B sales, real estate, automotive, and high-ticket consumer electronics—can be accurately stitched together across disparate visits without signal disintegration."
]
p1_example = "An omnichannel luxury retailer operating on Magento previously observed a twenty-six percent discrepancy between Shopify checkout orders and Meta Ads reported conversions due to Safari ITP cookie expiration and browser ad blockers. By deploying a multi-region Server GTM container cluster on Google Cloud Run mapped to 'collect.luxurybrand.com', the engineering team migrated all marketing tags off the client browser. Conversion reporting fidelity increased by twenty-eight percent, page load latency decreased by four hundred milliseconds, and first-party session cookies retained a full twelve-month shelf life under strict HTTP-only security flags."
p1_try_it = "Simulate the architectural data transformation of an incoming client-side web request into an enriched, sanitized server-side event payload destined for downstream marketing APIs."

p1_code = """class ServerSideTagProxy:
    def __init__(self, first_party_domain: str):
        self.domain = first_party_domain
        self.allowed_keys = {'event_name', 'event_id', 'user_email_hash', 'value', 'currency', 'client_ip'}

    def process_incoming_beacon(self, raw_payload: dict, client_ip: str, user_agent: str) -> dict:
        # Sanitize and strip unapproved client fields
        sanitized = {k: v for k, v in raw_payload.items() if k in self.allowed_keys}
        
        # Enforce server-side enrichment
        sanitized['server_timestamp'] = 1718000000
        sanitized['routing_domain'] = self.domain
        sanitized['user_agent'] = user_agent
        
        # Anonymize client IP: mask last octet for privacy compliance
        ip_parts = client_ip.split('.')
        if len(ip_parts) == 4:
            sanitized['masked_ip'] = f"{ip_parts[0]}.{ip_parts[1]}.{ip_parts[2]}.0"
        else:
            sanitized['masked_ip'] = client_ip
            
        return sanitized

proxy = ServerSideTagProxy('data.enterprise.com')
raw_client_beacon = {
    'event_name': 'Purchase',
    'event_id': 'ORD-98412-X',
    'user_email_hash': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'value': 249.50,
    'currency': 'USD',
    'client_ssn': '000-12-3456',  # Prohibited leak
    'internal_margin': 0.42       # Sensitive business secret
}

server_event = proxy.process_incoming_beacon(raw_client_beacon, '198.51.100.45', 'Mozilla/5.0 Safari/605.1.15')
print("Sanitized Server Event Keys:", sorted(list(server_event.keys())))
print("Masked IP:", server_event['masked_ip'])
print("Leaked SSN Present:", 'client_ssn' in server_event)
print("Internal Margin Present:", 'internal_margin' in server_event)
"""
p1_output = """Sanitized Server Event Keys: ['currency', 'event_id', 'event_name', 'masked_ip', 'routing_domain', 'server_timestamp', 'user_agent', 'user_email_hash', 'value']
Masked IP: 198.51.100.0
Leaked SSN Present: False
Internal Margin Present: False"""

p1_q = "Why does routing marketing event data through a first-party Server-Side GTM endpoint circumvent Safari ITP cookie restrictions?"
p1_opts = [
    "Because the tracking endpoint shares the identical eTLD+1 domain and sets HTTP cookies via server Set-Cookie response headers rather than JavaScript document.cookie.",
    "Because Safari Intelligent Tracking Prevention automatically disables tracking protection when it detects any Google Cloud Run container IP address.",
    "Because server-side tagging converts all third-party cookies into client-side localStorage tokens that cannot be inspected by browser privacy engines.",
    "Because Server GTM bypasses browser networking altogether by tunneling directly into Apple iCloud Private Relay through encrypted DNS."
]
p1_why = "Under Safari ITP rules, cookies set via client-side JavaScript (document.cookie) are aggressively capped to a seven-day or twenty-four-hour lifespan when tracking query parameters are detected. However, HTTP-only cookies issued via server Set-Cookie response headers from the identical root domain (eTLD+1) are treated as authentic first-party session state and retain full persistence."

# PART 2: Meta Conversions API (CAPI) & Google Enhanced Conversions Protocol
p2_title = "Meta Conversions API (CAPI) & Google Enhanced Conversions Protocol"
p2_say = [
    "The Meta Conversions API (CAPI) and Google Ads Enhanced Conversions API represent direct, authenticated server-to-server HTTP REST interfaces designed to transmit conversion events, behavioral actions, and customer attributes directly from corporate application servers to ad network ingestion clusters. Unlike traditional browser pixels that fire asynchronous GET or POST requests via client XMLHttpRequests or Image beacons, server-to-server APIs operate over authenticated TLS connections utilizing long-lived OAuth2 bearer tokens, API access tokens, or service account credentials. When an enterprise transaction occurs—such as an order completion in an ERP, a recurring subscription renewal in Stripe, a qualified lead status change in Salesforce CRM, or a physical store POS checkout—the backend server constructs a structured JSON payload conforming to vendor specifications and dispatches it securely.",
    "For Meta Conversions API, the payload structure requires a strictly defined data envelope comprising action_source (e.g., 'website', 'system_generated', 'physical_store'), event_time (Unix epoch timestamp in seconds), event_name (standardized events such as 'Purchase', 'Lead', 'AddPaymentInfo'), user_data, and custom_data (currency, value, contents array). The user_data object is the critical engine for deterministic audience matching and conversion attribution. It accepts hashed customer touchpoints including em (email address), ph (phone number), fn (first name), ln (last name), ct (city), zp (zip/postal code), country, external_id (enterprise CRM UUID), client_ip_address, client_user_agent, and first-party cookies fbc (Facebook click identifier) and fbp (Facebook browser identifier). Every piece of customer personal data must be rigorously normalized and encrypted client-side or server-side before transmission, ensuring that raw identifiable information never traverses the network unhashed.",
    "Google Ads Enhanced Conversions operates on a complementary architectural model. When a user converts on a digital property, first-party data captured in checkout forms is securely hashed using SHA-256 and sent either via Google Tag Manager Server-Side or directly through the Google Ads API v16+ ConversionUploadService. Google matches these cryptographic hashes against Google's authenticated user database (Gmail, YouTube, Google Account profiles) who clicked on Google Search, Shopping, Performance Max, or YouTube ads within the conversion lookback window. This closed-loop deterministic matching recovers signal lost due to browser cookie restrictions, cross-device switching, and multi-session conversion delays, unlocking significantly higher reported ROAS and enabling Google's smart bidding algorithms (Target CPA, Target ROAS) to optimize against verified business outcomes rather than noisy browser proxies.",
    "Integrating CAPI and Enhanced Conversions alongside traditional web pixels creates a resilient omni-channel tracking mesh. Crucially, CAPI is not restricted to real-time browser actions; it uniquely allows offline and delayed conversion ingestion. For example, if a customer submits an automotive test-drive lead online, and forty-five days later purchases an SUV at a regional dealership, the corporate dealership management system (DMS) can issue an offline CAPI Purchase event tied to the original lead external_id or hashed email. The ad platform reconciles the offline transaction with the historical ad exposure, allowing attribution models to credit the top-of-funnel campaign that originated the customer relationship months earlier.",
    "Furthermore, server-to-server API pipelines incorporate industrial retry policies and exponential backoff mechanisms. If an ad network endpoint experiences temporary rate-limiting (HTTP 429) or transient gateway downtime (HTTP 502/503), the enterprise event queue (such as Google Cloud Pub/Sub or Apache Kafka) retains the conversion payloads and replays them upon recovery. Meta CAPI explicitly permits events to be submitted up to seven days retroactively while maintaining full attribution validity. This decoupling of conversion logging from transient browser sessions ensures that zero transactional revenue is lost to network fluctuations."
]
p2_example = "A direct-to-consumer fitness equipment manufacturer implemented Meta CAPI alongside client Meta Pixel. During the peak holiday sale, client ad blockers blocked thirty-one percent of browser Purchase events. However, the backend Node.js order processing service dispatched every completed checkout directly to Meta Graph API v19.0 with hashed customer email, phone, fbp, and order ID. Meta's conversion reporting matched ninety-eight percent of all actual Shopify revenue back to campaign ad sets, preventing automated bidding algorithms from mistakenly suppressing winning creatives."
p2_try_it = "Construct an authenticated Meta Conversions API JSON payload with correctly formatted user_data, action_source, custom_data, and Unix event timestamp."

p2_code = """import json
import time

def build_meta_capi_payload(pixel_id: str, event_id: str, email_hash: str, fbp: str, fbc: str, 
                            amount: float, currency: str, ip: str, ua: str) -> dict:
    payload = {
        "data": [
            {
                "event_name": "Purchase",
                "event_time": int(time.time()),
                "event_id": event_id,
                "event_source_url": "https://www.enterprise.com/checkout/success",
                "action_source": "website",
                "user_data": {
                    "em": [email_hash],
                    "fbp": fbp,
                    "fbc": fbc,
                    "client_ip_address": ip,
                    "client_user_agent": ua
                },
                "custom_data": {
                    "currency": currency,
                    "value": amount,
                    "contents": [
                        {"id": "SKU-9921", "quantity": 1, "item_price": amount}
                    ]
                }
            }
        ],
        "test_event_code": "TEST78912"
    }
    return payload

payload = build_meta_capi_payload(
    pixel_id="1092837465",
    event_id="ORD-2026-8812",
    email_hash="4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
    fbp="fb.1.1718000000.123456789",
    fbc="fb.1.1718000000.IwAR2XxYyyyZzz",
    amount=389.00,
    currency="USD",
    ip="198.51.100.88",
    ua="Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
)

event_record = payload["data"][0]
print("Event Name:", event_record["event_name"])
print("Action Source:", event_record["action_source"])
print("Event ID:", event_record["event_id"])
print("Matched User Data Fields:", sorted(list(event_record["user_data"].keys())))
print("Purchase Value:", event_record["custom_data"]["value"], event_record["custom_data"]["currency"])
"""
p2_output = """Event Name: Purchase
Action Source: website
Event ID: ORD-2026-8812
Matched User Data Fields: ['client_ip_address', 'client_user_agent', 'em', 'fbc', 'fbp']
Purchase Value: 389.0 USD"""

p2_q = "In the Meta Conversions API (CAPI) specification, what is the functional role of the 'action_source' parameter?"
p2_opts = [
    "It specifies the physical or digital environment where the conversion occurred, distinguishing website, app, physical_store, or system_generated events.",
    "It designates the specific cloud server provider (AWS, GCP, or Azure) that generated the outbound HTTP webhook.",
    "It dictates whether the event will be billed as an auction impression or a cost-per-click engagement fee.",
    "It forces Meta to decrypt client IP addresses using automated public key infrastructure before running audience matching."
]
p2_why = "The 'action_source' parameter in Meta CAPI tells Meta's ingestion pipeline where the transaction occurred (e.g., 'website', 'physical_store', 'app', or 'system_generated'). This ensures appropriate attribution windows and matching heuristics are applied across digital, offline, and omnichannel customer touchpoints."

# PART 3: Dual-Tagging Architecture & Event Deduplication (event_id & event_name)
p3_title = "Dual-Tagging Architecture & Event Deduplication (event_id & event_name)"
p3_say = [
    "To maximize data capture resilience, enterprise tracking strategies mandate a 'dual-tagging' (redundant) architecture where conversion events are broadcast simultaneously from both the user's browser (client-side Meta Pixel / Google Tag) and the server container (Server GTM / backend CAPI). In an ideal scenario, the browser fires the event in real-time, capturing immediate client-side contextual state, while the server fires the identical event over a secure HTTP POST backchannel. However, if both events arrive at the ad platform's ingestion pipeline without explicit coordination, the ad network will register two separate conversions for the same transaction. This catastrophic double-counting inflates reported conversions by up to two hundred percent, severely distorts return on ad spend (ROAS) metrics, and triggers machine learning bidding algorithms to overbid on low-value traffic.",
    "The engineering mechanism that resolves this hazard is deterministic Event Deduplication. In Meta's ad ecosystem, deduplication is governed by two mandatory matching keys: event_name and event_id. When a user triggers an action (such as clicking the 'Place Order' button), the client application or tag manager generates a globally unique identifier (UUIDv4 or enterprise transaction ID, such as 'ORD-88391-A9') and attaches it to the client-side pixel call: fbq('track', 'Purchase', {value: 120.00, currency: 'USD'}, {eventID: 'ORD-88391-A9'}). Concurrently, the backend web server or Server GTM container receives the checkout confirmation and dispatches the CAPI payload with the identical event_name ('Purchase') and the identical event_id ('ORD-88391-A9').",
    "When Meta's event processing pipeline ingests incoming events, it evaluates them against a sliding deduplication time window (typically forty-eight hours). If Meta receives the browser event first, it immediately attributes the conversion and records the event_id in a distributed cache. When the server event carrying the identical event_id arrives milliseconds or seconds later, Meta recognizes the duplicate identifier. Instead of creating a second conversion record, Meta's pipeline deduplicates the event and executes 'Data Enrichment': it merges the rich user_data attributes from the server event (such as hashed email, phone number, and physical billing address) with the client-side browser context (such as cookie IDs and screen resolution). This gives the brand the best of both worlds—zero double-counting combined with maximum attribution match quality.",
    "If the client-side browser event is completely blocked by an ad-blocker, browser crash, or network disconnect, the server event arrives at Meta alone. Because Meta sees no corresponding browser event within the deduplication window, the server event is recognized as the sole record of truth and processed as a single, valid conversion. Conversely, if a backend network glitch drops the CAPI payload, the browser pixel event preserves baseline reporting. To verify deduplication health, marketing engineers continuously audit the Event Deduplication Rate in Meta Events Manager, where healthy enterprise implementations maintain a deduplication success rate between ninety-five and one hundred percent for core conversion actions.",
    "In cross-platform ecosystems encompassing both Google Ads and Meta, event deduplication principles extend to transaction_id in Google Tag Manager. By binding the identical transaction_id across Google Ads conversion tags, GA4 purchase events, and Meta CAPI payloads, enterprise data teams establish global consistency across all reporting suites. This guarantees that multi-channel dashboards in Looker Studio or Power BI reflect the exact same single-source-of-truth order count as the backend transactional database, eliminating cross-channel reporting discrepancies."
]
p3_example = "An e-commerce marketplace processing ten thousand daily transactions deployed dual-tagging for its Purchase event. In testing, the web analytics team verified that both the browser fbq('track', 'Purchase') and backend Python CAPI webhook shared the exact order UUID 'UUID-4921-998'. Meta Events Manager showed a 99.4% deduplication rate, with zero duplicate conversions recorded and a 14% uplift in overall attributed revenue from transactions where client ad blockers had suppressed browser pixels."
p3_try_it = "Simulate an event deduplication engine that ingests a stream of interleaved client and server marketing beacons, merges metadata, and suppresses duplicate conversions."

p3_code = """class EventDeduplicator:
    def __init__(self, time_window_seconds: int = 172800):
        self.time_window = time_window_seconds
        # In-memory store: (event_name, event_id) -> record
        self.seen_events = {}

    def process_event(self, source: str, event_name: str, event_id: str, timestamp: int, payload: dict) -> dict:
        key = (event_name, event_id)
        if key in self.seen_events:
            existing = self.seen_events[key]
            # Deduplicate and enrich
            existing["sources"].append(source)
            existing["payload"].update(payload)
            existing["status"] = "deduplicated_and_enriched"
            return {"action": "deduplicated", "event_id": event_id, "primary_source": existing["sources"][0]}
        else:
            self.seen_events[key] = {
                "event_name": event_name,
                "event_id": event_id,
                "timestamp": timestamp,
                "sources": [source],
                "payload": payload.copy(),
                "status": "initial_registered"
            }
            return {"action": "registered", "event_id": event_id, "source": source}

dedup = EventDeduplicator()

# 1. Browser pixel arrives first
r1 = dedup.process_event("browser_pixel", "Purchase", "ORD-5541", 1718000001, {"fbp": "fb.1.1", "value": 150.0})
# 2. Server CAPI arrives second with identical event_id and enriched user data
r2 = dedup.process_event("server_capi", "Purchase", "ORD-5541", 1718000003, {"email_hash": "a94f6c...", "phone_hash": "c83b1..."})
# 3. Independent transaction where browser pixel was blocked by uBlock Origin (server only)
r3 = dedup.process_event("server_capi", "Purchase", "ORD-5542", 1718000010, {"email_hash": "f29da...", "value": 310.0})

print("Event 1 (Browser):", r1)
print("Event 2 (Server - Duplicated):", r2)
print("Event 3 (Server - Blocked Client):", r3)
print("Total Unique Conversions Recorded:", len(dedup.seen_events))
print("ORD-5541 Enriched Sources:", dedup.seen_events[("Purchase", "ORD-5541")]["sources"])
print("ORD-5541 Status:", dedup.seen_events[("Purchase", "ORD-5541")]["status"])
"""
p3_output = """Event 1 (Browser): {'action': 'registered', 'event_id': 'ORD-5541', 'source': 'browser_pixel'}
Event 2 (Server - Duplicated): {'action': 'deduplicated', 'event_id': 'ORD-5541', 'primary_source': 'browser_pixel'}
Event 3 (Server - Blocked Client): {'action': 'registered', 'event_id': 'ORD-5542', 'source': 'server_capi'}
Total Unique Conversions Recorded: 2
ORD-5541 Enriched Sources: ['browser_pixel', 'server_capi']
ORD-5541 Status: deduplicated_and_enriched"""

p3_q = "What occurs when Meta's ingestion pipeline receives both a client-side pixel event and a server-side CAPI event with identical event_name and event_id within the 48-hour window?"
p3_opts = [
    "Meta deduplicates the event into a single conversion count and merges the user_data attributes from both payloads to maximize match quality.",
    "Meta discards the server CAPI event entirely and relies exclusively on the browser pixel payload for attribution.",
    "Meta logs two distinct conversions and applies an automated 0.5 weighting factor to each transaction value.",
    "Meta rejects both events as suspicious bot activity and permanently penalizes the ad account Quality Score."
]
p3_why = "When both browser and server events share the exact same event_name and event_id, Meta's deduplication algorithm recognizes them as representations of the same user transaction, keeps a single conversion count, and combines user attributes from both payloads for optimal attribution."

# PART 4: Event Quality Score (EQS), Advanced Matching & Deterministic PII Normalization (SHA-256)
p4_title = "Event Quality Score (EQS), Advanced Matching & Deterministic PII Normalization (SHA-256)"
p4_say = [
    "In modern server-side conversion tracking, transmitting an event is only half the battle; the event must be matched back to an authenticated user profile within the ad platform's social graph or identity graph. Meta quantifies this capability through the Event Quality Score (EQS)—a real-time rating scale ranging from 0.0 to 10.0 displayed in Meta Events Manager. An EQS below 6.0 indicates poor attribution fidelity, leading to untracked conversions, degraded ad delivery optimization, and higher customer acquisition costs. Conversely, an EQS of 8.0 or above unlocks high-precision deterministic attribution, allowing ad algorithms to accurately identify which campaign, ad set, and creative drove the conversion.",
    "Achieving an elite EQS requires rigorous Advanced Matching implementation. Advanced Matching relies on capturing multiple high-entropy customer identity parameters at checkout or form submission and formatting them according to strict normalization standards prior to cryptographic hashing. Raw personal data cannot simply be hashed directly; inconsistent whitespace, casing, or formatting will produce completely different cryptographic hashes for the exact same person. For example, ' Jane.Doe@Example.COM ' and 'janedoe@example.com' are identical in human reality, but unnormalized SHA-256 hashing yields two completely disparate 64-character hexadecimal digests, entirely breaking user matching.",
    "The deterministic normalization rules for marketing PII parameters are mathematically strict and standardized across major ad platforms: For email addresses, the string must be stripped of all leading and trailing whitespace, converted entirely to lowercase, and verified to contain valid domain formatting. For phone numbers, all non-digit characters (parentheses, hyphens, spaces, plus signs) must be removed, and the country calling code must be explicitly prepended (e.g., '+1 (555) 019-2834' becomes '15550192834'). For names, strings are trimmed, converted to lowercase, and stripped of punctuation. For postal codes, all spaces and dashes must be removed and lowercase applied. Only after applying these normalization rules is the UTF-8 encoded string passed to the SHA-256 (Secure Hash Algorithm 256-bit) one-way cryptographic hashing function.",
    "Beyond hashed PII, the most powerful parameters for maximizing EQS are first-party cookie identifiers: the Facebook Click ID (_fbc) and Facebook Browser ID (_fbp). When an ad is clicked on Instagram or Facebook, Meta appends a unique query parameter (fbclid) to the destination URL. A properly configured server-side or client tag reads this parameter and stores it in a first-party cookie named _fbc with format 'fb.1.{timestamp}.{fbclid}'. Simultaneously, the persistent browser visitor ID is stored in _fbp as 'fb.1.{timestamp}.{random_integer}'. When a conversion event payload includes both _fbp and _fbc alongside normalized hashed email and phone, the match probability approaches ninety-nine percent, yielding an Event Quality Score exceeding 9.2 out of 10.0.",
    "In addition to individual match keys, multi-key saturation represents an essential tactical lever. Submitting an event payload with only an email hash achieves an average match rate of sixty-five percent because users frequently shop with professional or secondary email addresses that differ from their personal Facebook accounts. However, when an enterprise sends a combination of hashed email, normalized phone number, billing postal code, client IP, user agent, and both _fbp and _fbc, the probability that Meta finds at least one deterministic graph link exceeds ninety-five percent. This multi-attribute redundancy protects campaign performance against identity fragmentation."
]
p4_example = "A global subscription SaaS company was struggling with a Meta Event Quality Score of 4.2/10, resulting in under-reported enterprise demo bookings. An audit revealed the marketing team was hashing uppercase email strings without trimming spaces, omitting country codes from phone numbers, and failing to forward the _fbc cookie from the URL. After implementing automated server-side PII normalization and cookie forwarding, their EQS surged to 9.4/10, attributed conversions increased by 34%, and algorithm target CPA dropped by 19%."
p4_try_it = "Implement a production-grade PII normalization and SHA-256 hashing pipeline that processes raw customer records into ad-network compliant match parameters."

p4_code = """import hashlib
import re

class PIINormalizer:
    @staticmethod
    def hash_sha256(val: str) -> str:
        return hashlib.sha256(val.encode('utf-8')).hexdigest()

    @classmethod
    def normalize_email(cls, email: str) -> str:
        if not email or '@' not in email:
            return ""
        # 1. Strip whitespace, 2. Lowercase
        cleaned = email.strip().lower()
        return cls.hash_sha256(cleaned)

    @classmethod
    def normalize_phone(cls, phone: str, default_country_code: str = "1") -> str:
        if not phone:
            return ""
        # 1. Strip all non-digit characters
        digits = re.sub(r'\\D', '', phone)
        # 2. Prepend country code if missing (assuming 10-digit US/CA number)
        if len(digits) == 10:
            digits = default_country_code + digits
        return cls.hash_sha256(digits)

    @classmethod
    def normalize_zip(cls, zip_code: str) -> str:
        if not zip_code:
            return ""
        # Lowercase and strip whitespace/hyphens
        cleaned = re.sub(r'\\s+|-', '', zip_code.strip().lower())
        return cls.hash_sha256(cleaned)

normalizer = PIINormalizer()

raw_user = {
    "email": "  Alex.Hamilton@Treasury.GOV  ",
    "phone": "+1 (555) 234-5678",
    "zip": " 10005-0001 "
}

hashed_user = {
    "em": normalizer.normalize_email(raw_user["email"]),
    "ph": normalizer.normalize_phone(raw_user["phone"]),
    "zp": normalizer.normalize_zip(raw_user["zip"])
}

print("Raw Email:", repr(raw_user["email"]))
print("Hashed Email (SHA-256):", hashed_user["em"])
print("Hashed Phone (SHA-256):", hashed_user["ph"])
print("Hashed Zip (SHA-256):", hashed_user["zp"])
print("Hash Length (chars):", len(hashed_user["em"]))
"""
p4_output = """Raw Email: '  Alex.Hamilton@Treasury.GOV  '
Hashed Email (SHA-256): 91d573f054ceb84ae18ca12cb40ff6323b7a54955b27a3c3328ebcc4ee98bc5e
Hashed Phone (SHA-256): 840ce364bb226871a4fca53a5c7eb3aa7ffef9b4f971c26b6fa48dbb407a5ea7
Hashed Zip (SHA-256): f8380e227915570fbbf3a4fc2cb11f2a321cfca64eb0f04c63284ff0d04b6b66
Hash Length (chars): 64"""

p4_q = "Before applying SHA-256 cryptographic hashing to customer email addresses for Meta CAPI Advanced Matching, what normalization steps are strictly mandatory?"
p4_opts = [
    "Strip all leading and trailing whitespace characters, and convert all alphabetical characters to lowercase.",
    "Remove all vowels and encrypt the domain name using AES-128 public key infrastructure.",
    "Base64-encode the string and reverse the character order to prevent collision attacks.",
    "Truncate the email string to sixteen characters and prepend the user's primary billing zip code."
]
p4_why = "Meta and Google require that email addresses be stripped of leading and trailing whitespace and converted entirely to lowercase prior to computing the SHA-256 hash. If this is not done, minor differences in casing or space will produce divergent hashes that fail to match."

# PART 5: Enterprise Infrastructure Provisioning: Google Cloud Run, Custom Load Balancing & Monitoring
p5_title = "Enterprise Infrastructure Provisioning: Google Cloud Run, Custom Load Balancing & Monitoring"
p5_say = [
    "Deploying Server-Side Google Tag Manager and Conversions API at enterprise scale requires rigorous cloud systems engineering. While small websites can deploy single-instance App Engine setups, mission-critical e-commerce platforms handling millions of monthly visits mandate containerized deployment on Google Cloud Run or AWS Elastic Container Service (ECS) fronted by a global HTTP(S) Load Balancer. Cloud Run provides fully managed serverless container execution that scales automatically from zero to thousands of concurrent container instances in response to incoming HTTP traffic bursts, ensuring sub-fifty-millisecond response times even during viral marketing flash sales, Black Friday spikes, or Super Bowl ad broadcasts.",
    "The architectural topology begins with a custom first-party domain configuration. Digital marketing engineers configure a DNS A/AAAA record pointing a subdomain such as collect.brand.com to a Google Cloud Global External Application Load Balancer. The load balancer terminates incoming SSL/TLS connections using Google-managed certificates, offloading cryptographic overhead from application containers. Behind the load balancer, Cloud Run server containers execute Google's official sGTM Docker image (gcr.io/cloud-tagging-10302018/gtm-cloud-image:stable). To eliminate cold starts—which can add hundreds of milliseconds of latency to tracking requests—production environments configure a minimum instance count of at least three to five warm instances distributed across multiple availability zones.",
    "Operational reliability demands continuous observability and automated failover. The server container environment exposes dedicated health check endpoints (/healthz) that the load balancer probes every five seconds. If a container instance becomes unresponsive or crashes due to memory pressure, the load balancer instantly shifts traffic to healthy instances without dropping customer tracking beacons. Cloud Run integrates natively with Google Cloud Monitoring and Cloud Logging, allowing engineering teams to configure real-time alerting on key operational metrics: 5xx server error rates, HTTP request latency percentiles (p50, p95, p99), container CPU utilization, and container memory saturation.",
    "Finally, enterprise data architecture leverages sGTM's native capability to write raw event streams directly to Google BigQuery in real time. As the server container processes incoming beacons and dispatches API calls to Meta and Google Ads, it can simultaneously stream the complete, unaggregated, first-party event JSON into a partitioned BigQuery dataset. This establishes an immutable, auditable first-party data lake that serves as the single source of truth for downstream marketing mix modeling, customer lifetime value prediction, and regulatory compliance audits under GDPR Article 30 record-keeping requirements.",
    "Cost engineering for server-side tagging is governed by container concurrency tuning and memory sizing. By default, sGTM containers operate efficiently with 1 vCPU and 0.5 GiB of RAM, handling up to 80 concurrent HTTP requests per container. At an average load of 100 requests per second, a three-instance warm cluster incurs less than sixty dollars per month in Cloud Run compute costs, yet protects hundreds of thousands of dollars in ad spend from signal degradation. Establishing budget alerts, autoscaling limits (e.g., max 50 instances), and Cloud Armor rate-limiting rules protects the infrastructure against denial-of-service surges while maintaining flawless conversion delivery."
]
p5_example = "A top-tier airline handling 40 million annual bookings deployed Server GTM on Google Cloud Run across us-east1 and us-west1 regions fronted by Cloud CDN and Cloud Armor WAF. The setup was provisioned with a minimum of 10 warm container instances and auto-scaled to 85 instances during a 48-hour fare promotion. The system processed 1.2 billion tracking requests with an average latency of 22 milliseconds, zero dropped conversions, and automatic streaming of all telemetry to a BigQuery customer analytics warehouse."
p5_try_it = "Simulate an auto-scaling load balancer telemetry monitor that calculates p95 latency, 5xx error rates, and autoscaling instance recommendations based on incoming traffic volume."

p5_code = """class CloudRunMetricsAnalyzer:
    def __init__(self, target_concurrency: int = 80):
        self.target_concurrency = target_concurrency

    def analyze_traffic_batch(self, request_latencies_ms: list[int], status_codes: list[int]) -> dict:
        total_requests = len(request_latencies_ms)
        if total_requests == 0:
            return {}

        # 1. Calculate P95 latency
        sorted_latencies = sorted(request_latencies_ms)
        p95_idx = int(0.95 * total_requests)
        p95_latency = sorted_latencies[min(p95_idx, total_requests - 1)]

        # 2. Calculate 5xx error rate
        error_count = sum(1 for code in status_codes if code >= 500)
        error_rate_pct = (error_count / total_requests) * 100.0

        # 3. Calculate recommended instance count for concurrent load
        # Assume batch represents a 1-second interval
        recommended_instances = max(3, (total_requests + self.target_concurrency - 1) // self.target_concurrency)

        return {
            "total_requests": total_requests,
            "p95_latency_ms": p95_latency,
            "error_rate_pct": round(error_rate_pct, 2),
            "healthy_sla": error_rate_pct < 0.1 and p95_latency < 100,
            "recommended_instances": recommended_instances
        }

analyzer = CloudRunMetricsAnalyzer(target_concurrency=80)

# Simulate 200 requests during a marketing burst
import random
random.seed(42)
latencies = [random.randint(15, 45) for _ in range(190)] + [random.randint(50, 85) for _ in range(10)]
statuses = [200] * 199 + [500]  # 1 server error

metrics = analyzer.analyze_traffic_batch(latencies, statuses)
print("Total Processed Requests:", metrics["total_requests"])
print("P95 Latency (ms):", metrics["p95_latency_ms"])
print("5xx Error Rate (%):", metrics["error_rate_pct"])
print("SLA Compliance Status:", metrics["healthy_sla"])
print("Recommended Active Containers:", metrics["recommended_instances"])
"""
p5_output = """Total Processed Requests: 200
P95 Latency (ms): 63
5xx Error Rate (%): 0.5
SLA Compliance Status: False
Recommended Active Containers: 3"""

p5_q = "Why is setting a minimum instance count (e.g., minimum 3 instances) a critical architectural best practice when deploying Server GTM on Google Cloud Run?"
p5_opts = [
    "To eliminate container cold-start latency spikes that can cause incoming tracking beacons and checkout webhooks to time out.",
    "Because Google Cloud Run automatically deletes container images if zero instances are active for more than ten minutes.",
    "Because Meta CAPI and Google Ads APIs will permanently blacklist IP addresses that experience container restarts.",
    "To prevent Google Cloud Load Balancer from converting HTTPS tracking payloads into unencrypted plaintext HTTP."
]
p5_why = "Serverless containers that scale to zero incur 'cold start' delays when new requests arrive, taking hundreds or thousands of milliseconds to initialize container runtimes. Setting a minimum instance count ensures warm containers are always available to process real-time tracking beacons with sub-fifty-millisecond latency."

# Assemble Day 36
parts = [
    make_part(p1_title, p1_say, p1_example, p1_try_it, p1_code, p1_output, p1_q, p1_opts, p1_why),
    make_part(p2_title, p2_say, p2_example, p2_try_it, p2_code, p2_output, p2_q, p2_opts, p2_why),
    make_part(p3_title, p3_say, p3_example, p3_try_it, p3_code, p3_output, p3_q, p3_opts, p3_why),
    make_part(p4_title, p4_say, p4_example, p4_try_it, p4_code, p4_output, p4_q, p4_opts, p4_why),
    make_part(p5_title, p5_say, p5_example, p5_try_it, p5_code, p5_output, p5_q, p5_opts, p5_why)
]

day36_data = {
    "day": 36,
    "coursePrefix": "bcom_dmkt",
    "title": "Server-Side Tagging & Conversions API (CAPI): Server GTM, Cloud Run, Event Deduplication & Event Quality Score (EQS)",
    "goal": "Master enterprise server-side tracking architecture, deploy Server GTM on Google Cloud Run, execute dual-tagging deduplication, normalize PII for maximum Event Quality Score, and configure Meta CAPI and Google Enhanced Conversions.",
    "recap": "In Block 7 we engineered econometric marketing mix models, synthetic control matched markets, algorithmic Shapley and Markov multi-touch attribution, and customer data platform identity resolution. Today we establish the foundational server-side data pipeline that captures high-fidelity conversion signals in a privacy-safe, ad-blocker-resilient paradigm.",
    "minutes": 38,
    "parts": parts
}

out_path = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\day36_dmkt_data.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(day36_data, f, indent=2)

print(f"Successfully generated Day 36 data at {out_path}!")
total_words = sum(len(" ".join(p["say"]).split()) for p in parts)
print(f"Day 36 Total Words: {total_words}")
for i, p in enumerate(parts):
    words = len(" ".join(p["say"]).split())
    print(f"  Part {i+1} ({p['title']}): {words} words")
