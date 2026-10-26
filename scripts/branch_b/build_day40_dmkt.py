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

# PART 1: Architecture Review: Unified First-Party Tagging, Privacy Sandbox & Clean Room Topologies
p1_title = "Architecture Review: Unified First-Party Tagging, Privacy Sandbox & Clean Room Topologies"
p1_say = [
    "Welcome to the Milestone 8 Capstone War Room. As Chief Marketing Technologist and Enterprise Marketing Analytics Architect, you are summoned to defend and orchestrate the enterprise's mission-critical data architecture. Over the past four days, we engineered the technical pillars of modern privacy-safe performance marketing: First-Party Server-Side Tagging and Conversions API (CAPI) on Google Cloud Run; the Google Chrome Privacy Sandbox (Topics API, Protected Audience API, Attribution Reporting API, and Consent Mode v2); Customer Data Clean Rooms (Snowflake, AWS Clean Rooms, and SMPC cryptography); and advanced predictive Customer Lifetime Value modeling (BG/NBD and Gamma-Gamma spend estimation).",
    "In this comprehensive capstone simulation, you are tasked with unifying these disparate systems into a resilient, fault-tolerant marketing intelligence engine. Modern enterprise architecture rejects fragile, siloed point solutions. A single conversion event—such as a high-value omnichannel purchase—must simultaneously traverse multiple privacy-governed pathways: firing an authenticated, deduplicated server-to-server CAPI beacon to Meta and Google Ads; registering an aggregated trigger event within the browser's Attribution Reporting API ledger; streaming raw unaggregated JSON telemetry into an enterprise BigQuery data lake; updating the customer's real-time BG/NBD Recency-Frequency matrix; and synchronizing an encrypted cohort token into an AWS Retail Media Clean Room.",
    "The architectural challenge lies in managing the trade-offs between computational latency, deterministic accuracy, and statutory regulatory compliance. While Server-Side GTM delivers millisecond-level telemetry, it must enforce Consent Mode v2 gating at the edge to prevent illegal PII egress. While the Privacy Sandbox protects consumer anonymity, it introduces intentional differential privacy noise and delayed reporting windows that must be statistically reconciled against internal ledger truth. While Customer Data Clean Rooms unlock transformative retail partnerships, they demand strict query whitelisting and epsilon budget management to thwart linear reconstruction attacks.",
    "During this war room scenario, you will lead the cross-functional incident response team through three high-stakes enterprise crises: recovering from a catastrophic Safari ITP client-side signal blackout; resolving an adversarial query threat inside a multi-million-dollar retail clean room; and deploying live predictive CLV vectors to rescue an underperforming Value-Based Bidding campaign during peak commercial trading.",
    "Success in this capstone grants you the prestigious Chief Marketing Technologist & Privacy Engineering Accreditation (CMO-PEA v2). This certification affirms your technical mastery across modern cloud systems engineering, statistical econometrics, cryptographic data collaboration, and corporate privacy governance.",
    "Review your architectural blueprints, verify your cloud container configurations, and prepare to execute live command-and-control operations across the enterprise marketing stack."
]
p1_example = "An enterprise global retailer operating across 42 countries unified its Server GTM container fleet, Chrome Privacy Sandbox handlers, and Snowflake Clean Room connectors into an integrated Kubernetes control tower. During an executive board presentation, the architecture team demonstrated how a single checkout event flowed seamlessly across real-time CAPI deduplication, privacy-preserving aggregation, and automated BG/NBD predictive scoring, proving that 100% of media spend was governed by auditable first-party intelligence."
p1_try_it = "Simulate an enterprise marketing gateway status check that verifies container health, clean room connectivity, and predictive CLV pipeline readiness."

p1_code = """class EnterpriseMarketingGateway:
    def __init__(self):
        self.systems = {
            "server_gtm_cloud_run": {"status": "HEALTHY", "active_instances": 8, "p95_latency_ms": 24},
            "meta_capi_egress": {"status": "HEALTHY", "eqs_score": 9.3, "dedup_rate_pct": 99.4},
            "privacy_sandbox_ara": {"status": "HEALTHY", "active_epochs": 3, "tee_connected": True},
            "snowflake_clean_room": {"status": "HEALTHY", "epsilon_remaining": 4.25, "active_collaborations": 4},
            "btyd_pclv_engine": {"status": "HEALTHY", "calibrated_customers": 850000, "mae_holdout": 0.22}
        }

    def run_preflight_diagnostics(self) -> dict:
        all_healthy = all(sys["status"] == "HEALTHY" for sys in self.systems.values())
        return {
            "gateway_status": "READY_FOR_WAR_ROOM" if all_healthy else "DEGRADED",
            "active_systems_count": len(self.systems),
            "critical_kpis": {
                "eqs": self.systems["meta_capi_egress"]["eqs_score"],
                "clean_room_epsilon": self.systems["snowflake_clean_room"]["epsilon_remaining"],
                "clv_mae": self.systems["btyd_pclv_engine"]["mae_holdout"]
            }
        }

gateway = EnterpriseMarketingGateway()
diagnostics = gateway.run_preflight_diagnostics()

print("Gateway Master Status:", diagnostics["gateway_status"])
print("Active Systems Verified:", diagnostics["active_systems_count"])
print("Event Quality Score (EQS):", diagnostics["critical_kpis"]["eqs"])
print("Clean Room Epsilon Budget:", diagnostics["critical_kpis"]["clean_room_epsilon"])
print("Predictive CLV Model MAE:", diagnostics["critical_kpis"]["clv_mae"])
"""
p1_output = """Gateway Master Status: READY_FOR_WAR_ROOM
Active Systems Verified: 5
Event Quality Score (EQS): 9.3
Clean Room Epsilon Budget: 4.25
Predictive CLV Model MAE: 0.22"""

p1_q = "What is the primary architectural objective of an integrated Enterprise Marketing Data Gateway?"
p1_opts = [
    "To orchestrate client, server, clean room, and predictive machine learning pipelines into a unified, privacy-governed first-party intelligence engine.",
    "To replace all human marketing analysts with automated social media comment spam bots.",
    "To eliminate all paid media spending and rely exclusively on organic word-of-mouth referrals.",
    "To convert all relational database tables into unencrypted plaintext text files hosted on public FTP servers."
]
p1_why = "An integrated enterprise gateway unifies server-side CAPI event dispatching, client-side Privacy Sandbox processing, clean room cryptographic joins, and predictive CLV modeling into a cohesive, auditable first-party intelligence platform."

# PART 2: End-to-End Incident Simulation: Client Signal Degradation & Automated CAPI Recovery
p2_title = "End-to-End Incident Simulation: Client Signal Degradation & Automated CAPI Recovery"
p2_say = [
    "War Room Incident 1 has struck. At 08:30 EST, the performance marketing analytics team detects an alarming anomaly: reported conversions on Meta Ads and Google Ads have plummeted by thirty-eight percent over the preceding four hours, while the brand's core transactional databases (Shopify and NetSuite ERP) report steady, normal checkout volume. Media algorithms—interpreting this sudden signal drop as a collapse in campaign efficiency—have begun automatically suppressing bids on top-performing search and social ad sets, threatening millions of dollars in weekend revenue.",
    "You initiate immediate root-cause diagnostics. Inspecting real-time browser telemetry reveals the source of the failure: a popular web browser updated its content-blocking heuristics, resulting in an aggressive interception of client-side tracking scripts. Simultaneously, an unannounced frontend checkout release omitted the eventID parameter from the client-side fbq('track', 'Purchase') call, shattering event deduplication synchronization.",
    "Because the client-side pixel events lacked unique event IDs, the dual-tagging deduplication engine failed to correlate browser pings with backend CAPI payloads. Meta Events Manager flagged the incoming streams as discordant, dropping the Event Quality Score from 9.2 to 4.1 and discarding thousands of unattributed conversions. Furthermore, without client cookie headers, the server container struggled to forward valid _fbp and _fbc identifiers.",
    "As the architect, you execute the emergency failover protocol. First, you access the Server-Side GTM container configuration via Terraform and activate the Server Fallback Enrichment Filter. The server container inspects the incoming request URL, extracts the raw fbclid parameter directly from the landing page referrer string, and synthesizes the missing _fbc cookie via server response headers. Second, you inject a standardized transaction UUID generator into the server CAPI pipeline, binding the unique NetSuite order number as the canonical event_id.",
    "Third, you reprocess the last four hours of order records from the corporate dead-letter queue, dispatching retroactive CAPI payloads with normalized SHA-256 hashed emails, phone numbers, and physical billing addresses directly to Meta Graph API v19.0. Within twenty minutes, Meta Events Manager recognizes the retroactive server conversions, reconciles the attribution graph, and restores the Event Quality Score to 9.4. Smart Bidding algorithms absorb the recovered conversion volume, stabilizing campaign bid pacing and averting catastrophic revenue loss."
]
p2_example = "During a major Black Friday sale, a national retail brand suffered a front-end JavaScript runtime error that silenced client pixels for 45 minutes across 12,000 checkout orders. The marketing architecture team engaged the automated CAPI recovery protocol, streaming the orders directly from the Kafka order topic to Meta and Google Ads with 100% PII normalization. Every single conversion was recovered and attributed with an EQS of 9.5/10."
p2_try_it = "Simulate an automated CAPI incident recovery engine that ingests dropped transactions, reconstructs missing match keys, and retroactively dispatches verified payloads."

p2_code = """class CAPIRecoveryEngine:
    def __init__(self):
        self.recovered_events = []

    def repair_and_dispatch_dropped_orders(self, dropped_orders: list[dict], default_currency: str = "USD") -> dict:
        recovered_count = 0
        total_recovered_revenue = 0.0

        for order in dropped_orders:
            # 1. Synthesize missing event_id from canonical order_number
            canonical_event_id = f"RECOVERED-{order['order_number']}"
            
            # 2. Normalize and hash email
            raw_email = order.get("email", "").strip().lower()
            email_hash = hashlib.sha256(raw_email.encode()).hexdigest() if raw_email else ""

            # 3. Reconstruct fbc if fbclid present in referrer
            fbc = f"fb.1.{order['timestamp']}.{order['fbclid']}" if order.get("fbclid") else "fb.1.1718000000.UNKNOWN"

            recovered_payload = {
                "event_name": "Purchase",
                "event_time": order["timestamp"],
                "event_id": canonical_event_id,
                "action_source": "system_generated",
                "user_data": {
                    "em": [email_hash],
                    "fbc": fbc
                },
                "custom_data": {
                    "currency": default_currency,
                    "value": order["amount"]
                },
                "recovery_status": "repaired_and_dispatched"
            }
            
            self.recovered_events.append(recovered_payload)
            recovered_count += 1
            total_recovered_revenue += order["amount"]

        return {
            "recovery_success": True,
            "orders_processed": recovered_count,
            "total_recovered_revenue": round(total_recovered_revenue, 2),
            "average_recovered_order_value": round(total_recovered_revenue / recovered_count, 2) if recovered_count else 0.0
        }

engine = CAPIRecoveryEngine()

# Dropped orders during client pixel outage
dropped_orders = [
    {"order_number": "ORD-991", "amount": 149.00, "email": "User1@domain.com", "fbclid": "IwAR3xx", "timestamp": 1718000100},
    {"order_number": "ORD-992", "amount": 289.50, "email": "User2@domain.com", "fbclid": "IwAR4yy", "timestamp": 1718000200},
    {"order_number": "ORD-993", "amount": 420.00, "email": "User3@domain.com", "fbclid": "IwAR5zz", "timestamp": 1718000300}
]

res = engine.repair_and_dispatch_dropped_orders(dropped_orders)
print("Recovery Status:", res["recovery_success"])
print("Total Orders Recovered:", res["orders_processed"])
print("Total Recovered Revenue ($):", res["total_recovered_revenue"])
print("Avg Order Value ($):", res["average_recovered_order_value"])
"""
p2_output = """Recovery Status: True
Total Orders Recovered: 3
Total Recovered Revenue ($): 858.5
Avg Order Value ($): 286.17"""

p2_q = "When client-side tracking pixels are blocked or suffer JavaScript exceptions, how does an enterprise CAPI pipeline recover lost conversion attribution?"
p2_opts = [
    "By dispatching server-to-server HTTP events directly from backend transaction databases with normalized customer PII and canonical order IDs.",
    "By filing a formal legal complaint with browser developers requesting that ad blockers be banned.",
    "By artificially inflating the transaction values of remaining client conversions by thirty-eight percent.",
    "By sending physical promotional postcards to every resident within a five-mile radius of corporate headquarters."
]
p2_why = "Because server-to-server CAPI runs in backend cloud infrastructure, it is completely immune to client-side browser crashes or ad blockers. Replaying transactions from backend order databases directly to the ad network restores 100% of conversion telemetry."

# PART 3: Multi-Party Clean Room War Room: Retail Media Network Joint Audience Discovery & Overlap Attribution
p3_title = "Multi-Party Clean Room War Room: Retail Media Network Joint Audience Discovery & Overlap Attribution"
p3_say = [
    "War Room Incident 2 escalates in the enterprise's multi-million-dollar retail media partnership. The brand has co-invested fifteen million dollars with a nationwide retail conglomerate inside an AWS Clean Rooms collaboration. The objective of the collaboration is two-fold: execute joint audience overlap discovery to identify prospective buyers who purchase competing products at retail, and perform closed-loop attribution to verify the incremental in-store sales lift generated by the brand's connected TV (CTV) advertising campaign.",
    "Suddenly, the clean room automated security watchdog fires a high-priority alert: an external media agency analyst submitted a sequence of forty-eight tightly correlated SQL queries within a five-minute interval. The query logs indicate that the analyst was attempting a Differencing Reconstruction Attack: systematically querying customer transaction totals while incrementally altering postal code and demographic filters, attempting to isolate the specific purchasing records of high-net-worth VIP consumers.",
    "You take immediate command of clean room security operations. First, you invoke the clean room circuit breaker, temporarily freezing the analyst's query session. Second, you review the clean room's Differential Privacy telemetry in AWS Clean Rooms. The audit log confirms that the automated Laplace noise engine successfully perturbed each query output, ensuring that the subtracted differences yielded statistical entropy rather than isolated transaction data. Third, you inspect the cumulative privacy budget: the sequence of queries consumed 1.85 units of the allotted epsilon budget, leaving 2.40 units intact.",
    "To permanently eliminate the attack surface while preserving commercial collaboration, you replace ad-hoc SQL query permissions with Immutable Analysis Templates. Under the new governance policy, analysts can no longer submit raw SQL text; they can only invoke pre-compiled, cryptographically signed stored templates. You deploy the certified 'RMN_Closed_Loop_Attribution_Template' which joins CTV ad exposure timestamps with retail POS receipts, enforces a mandatory minimum cohort threshold of 250 entities, applies differential privacy noise, and outputs aggregated ROAS and incremental sales lift by market tier.",
    "The executive sponsor reviews the validated clean room output: the CTV media campaign drove $38.4M in verified in-store sales, achieving a 2.56x closed-loop ROAS and generating a 19% incremental lift over unexposed control cohorts. By pairing cryptographic privacy safeguards with certified analysis templates, you successfully thwart a sophisticated data breach while delivering the commercial proof required to unlock the next fiscal year's marketing budget."
]
p3_example = "A global food manufacturer and an international supermarket chain operated an AWS Clean Room. When an unauthorized user attempted to extract basket sizes of local celebrities via narrow SQL filters, the clean room's Tumult Analytics differential privacy engine masked the queries, while automated governance throttled the session. The certified joint attribution template subsequently confirmed a $12M net sales lift from the brand's retail media ads."
p3_try_it = "Simulate a clean room security monitor that detects correlated differencing attacks, calculates epsilon budget depletion, and locks down compromised sessions."

p3_code = """class CleanRoomSecurityMonitor:
    def __init__(self, total_epsilon_budget: float = 5.0, max_correlated_queries: int = 5):
        self.total_budget = total_epsilon_budget
        self.used_epsilon = 0.0
        self.max_correlated = max_correlated_queries

    def evaluate_query_stream(self, queries: list[dict]) -> dict:
        correlated_count = 0
        last_predicate = ""

        for q in queries:
            eps_cost = q.get("epsilon_cost", 0.1)
            predicate = q.get("where_clause", "")
            
            # Check for sequential predicate similarity (differencing attack heuristic)
            if last_predicate and len(predicate) > 10 and abs(len(predicate) - len(last_predicate)) < 15:
                correlated_count += 1
            last_predicate = predicate

            self.used_epsilon += eps_cost

            if correlated_count >= self.max_correlated:
                return {
                    "action": "CIRCUIT_BREAKER_TRIPPED",
                    "reason": "Differencing attack detected: excessive sequential correlated queries.",
                    "used_epsilon": round(self.used_epsilon, 2),
                    "remaining_budget": round(self.total_budget - self.used_epsilon, 2),
                    "session_locked": True
                }

            if self.used_epsilon >= self.total_budget:
                return {
                    "action": "BUDGET_EXHAUSTED",
                    "reason": "Differential privacy epsilon budget fully depleted.",
                    "used_epsilon": round(self.used_epsilon, 2),
                    "remaining_budget": 0.0,
                    "session_locked": True
                }

        return {
            "action": "APPROVED",
            "used_epsilon": round(self.used_epsilon, 2),
            "remaining_budget": round(self.total_budget - self.used_epsilon, 2),
            "session_locked": False
        }

monitor = CleanRoomSecurityMonitor(total_epsilon_budget=5.0, max_correlated_queries=3)

# Simulated attack: repeated queries with single-character predicate changes
suspicious_batch = [
    {"where_clause": "zip = '90210' AND age > 30", "epsilon_cost": 0.2},
    {"where_clause": "zip = '90210' AND age > 31", "epsilon_cost": 0.2},
    {"where_clause": "zip = '90210' AND age > 32", "epsilon_cost": 0.2},
    {"where_clause": "zip = '90210' AND age > 33", "epsilon_cost": 0.2}
]

status = monitor.evaluate_query_stream(suspicious_batch)
print("Security Action:", status["action"])
print("Reason:", status["reason"])
print("Used Epsilon:", status["used_epsilon"])
print("Remaining Privacy Budget:", status["remaining_budget"])
print("Session Locked:", status["session_locked"])
"""
p3_output = """Security Action: CIRCUIT_BREAKER_TRIPPED
Reason: Differencing attack detected: excessive sequential correlated queries.
Used Epsilon: 0.8
Remaining Privacy Budget: 4.2
Session Locked: True"""

p3_q = "How do enterprise Customer Data Clean Rooms mathematically defeat sequential differencing attacks attempted by malicious query analysts?"
p3_opts = [
    "By adding calibrated Differential Privacy noise to every aggregate output and replacing raw SQL access with parameterized analysis templates.",
    "By shutting down all cloud databases permanently and refunding all advertising budgets.",
    "By allowing only company founders to view data on paper printouts stored in physical bank vaults.",
    "By converting all numerical sales totals into random Latin poetry verses."
]
p3_why = "Differential privacy injects random noise to ensure outputs cannot reveal whether an individual was present or absent. Pairing DP noise with pre-approved analysis templates prevents adversaries from executing subtractive differencing attacks."

# PART 4: Algorithmic Value-Based Bidding Deployment: Live BG/NBD + Gamma-Gamma pCLV Vector Dispatch
p4_title = "Algorithmic Value-Based Bidding Deployment: Live BG/NBD + Gamma-Gamma pCLV Vector Dispatch"
p4_say = [
    "War Room Incident 3 strikes in the programmatic media execution domain. With forty-eight hours remaining in the fiscal quarter, the Chief Growth Officer observes that the enterprise customer acquisition pipeline is severely underperforming its EBITDA profitability target. While top-line customer volume is pacing on schedule, the average realized contribution margin of newly acquired cohorts has decayed by twenty-two percent. Acquisition teams have been bidding aggressively on high-volume search terms and broad social lookalike audiences using standard Target CPA bidding, inadvertently filling the customer acquisition funnel with bargain hunters, one-time discount code seekers, and high-churn accounts.",
    "You intervene to overhaul the enterprise bidding engine in real time, transitioning the paid media portfolio from Target CPA to Predictive Value-Based Bidding (VBB). First, you execute the production BG/NBD and Gamma-Gamma machine learning pipeline across the entire historical customer base of 1.2 million accounts. The BG/NBD model estimates each customer's transaction rate lambda and churn probability p, generating individual P(Alive) scores and forecasting 365-day transaction counts. Concurrently, the Gamma-Gamma submodel applies Bayesian shrinkage to calculate expected average spend E(M). Multiplying these distributions yields the predicted 1-year forward-looking Customer Lifetime Value (pCLV) for every customer.",
    "Second, you segment the customer population into empirical pCLV deciles. Decile 1 (the top ten percent) represents thirty-eight percent of total enterprise customer equity, boasting an average projected 1-year spend of $1,450 and a 94% retention probability. Conversely, Deciles 8 through 10 represent low-value cohorts with an average projected spend under $45 and an expected churn probability exceeding 80%.",
    "Third, you engineer a real-time Reverse-ETL sync that streams these pCLV decile vectors into Google Ads Enhanced Conversions and Meta Conversions API as value adjustments. Simultaneously, you recalibrate the Google Ads Smart Bidding portfolio: replacing Target CPA ($50/acquisition) with Target ROAS (380% target value return). For Meta Ads, you activate Maximize Value bidding paired with a custom high-pCLV lookalike audience seeded by Decile 1 customers.",
    "The results of the real-time VBB transition are instantaneous: within thirty-six hours, automated bidding algorithms reallocate media budgets away from low-margin discount seekers and toward high-equity customer profiles. While overall acquisition conversion volume decreases by 11%, the total predicted 1-year margin of acquired cohorts surges by 48%, successfully rescuing the quarterly EBITDA target and proving the immense financial power of algorithmic marketing science."
]
p4_example = "An omnichannel fashion group deployed an emergency VBB migration during end-of-season clearance. By uploading BG/NBD + Gamma-Gamma pCLV scores to Google Ads Smart Bidding, the algorithm shifted bids to high-value shoppers seeking premium seasonal collections rather than clearance bargain hunters. The campaign's 30-day realized gross profit increased by $1.8M with zero increase in total media spend."
p4_try_it = "Simulate an enterprise Value-Based Bidding decile allocator that maps customer pCLV predictions into dynamic ad auction bid multipliers."

p4_code = """class ValueDecileBidAllocator:
    def __init__(self, base_cpc: float = 3.00):
        self.base_cpc = base_cpc

    def allocate_bids_by_p_clv(self, customer_profiles: list[dict]) -> list[dict]:
        # Sort customers by predicted 1yr pCLV descending
        sorted_custs = sorted(customer_profiles, key=lambda x: x["predicted_1yr_pclv"], reverse=True)
        n = len(sorted_custs)
        
        results = []
        for rank, c in enumerate(sorted_custs):
            percentile = (rank / n) * 100.0
            
            # Decile assignment (1 to 10)
            decile = int(percentile // 10) + 1
            if decile > 10:
                decile = 10
                
            # Dynamic multiplier curve: Decile 1 gets 3.5x, Decile 10 gets 0.25x
            if decile == 1:
                multiplier = 3.5
                strategy = "AGGRESSIVE_EXPANSION"
            elif decile <= 3:
                multiplier = 2.0
                strategy = "CORE_GROWTH"
            elif decile <= 7:
                multiplier = 1.0
                strategy = "MAINTAIN_STANDARD"
            else:
                multiplier = 0.25
                strategy = "SUPPRESS_BID"

            cpc_bid = round(self.base_cpc * multiplier, 2)
            results.append({
                "customer_id": c["customer_id"],
                "predicted_pclv": c["predicted_1yr_pclv"],
                "decile": decile,
                "strategy": strategy,
                "bid_multiplier": multiplier,
                "final_cpc_bid": cpc_bid
            })
            
        return results

allocator = ValueDecileBidAllocator(base_cpc=3.00)

sample_cohort = [
    {"customer_id": "C-101", "predicted_1yr_pclv": 1450.0},
    {"customer_id": "C-102", "predicted_1yr_pclv": 820.0},
    {"customer_id": "C-103", "predicted_1yr_pclv": 310.0},
    {"customer_id": "C-104", "predicted_1yr_pclv": 120.0},
    {"customer_id": "C-105", "predicted_1yr_pclv": 35.0}
]

allocated = allocator.allocate_bids_by_p_clv(sample_cohort)
for c in allocated:
    print(f"Customer {c['customer_id']} (pCLV: ${c['predicted_pclv']}) -> Decile {c['decile']}, Multiplier: {c['bid_multiplier']}x, Bid: ${c['final_cpc_bid']} [{c['strategy']}]")
"""
p4_output = """Customer C-101 (pCLV: $1450.0) -> Decile 1, Multiplier: 3.5x, Bid: $10.5 [AGGRESSIVE_EXPANSION]
Customer C-102 (pCLV: $820.0) -> Decile 3, Multiplier: 2.0x, Bid: $6.0 [CORE_GROWTH]
Customer C-103 (pCLV: $310.0) -> Decile 5, Multiplier: 1.0x, Bid: $3.0 [MAINTAIN_STANDARD]
Customer C-104 (pCLV: $120.0) -> Decile 7, Multiplier: 1.0x, Bid: $3.0 [MAINTAIN_STANDARD]
Customer C-105 (pCLV: $35.0) -> Decile 9, Multiplier: 0.25x, Bid: $0.75 [SUPPRESS_BID]"""

p4_q = "How does segmenting customer populations by predicted 1-year pCLV deciles empower automated ad bidding systems?"
p4_opts = [
    "It allows bidding algorithms to place aggressive bids on top-decile prospects while drastically suppressing bids on low-value cohorts, maximizing portfolio ROI.",
    "It requires human media buyers to manually approve every banner impression shown on mobile devices.",
    "It forces marketing departments to fire all creative copywriters and replace them with database administrators.",
    "It converts all digital marketing ad units into thirty-second radio broadcasts."
]
p4_why = "pCLV decile segmentation enables algorithmic bidding engines to bid aggressively (up to 3.5x or higher) to acquire prospective customers resembling top-decile VIPs while suppressing bids on lower deciles prone to high churn and negative margins."

# PART 5: Executive Defense & Enterprise Marketing Analytics War Room Certification (CMO-PEA v2)
p5_title = "Executive Defense & Enterprise Marketing Analytics War Room Certification (CMO-PEA v2)"
p5_say = [
    "The War Room enters its final phase: the Executive Defense. You stand before the Board of Directors, the Chief Executive Officer, the Chief Financial Officer, and General Counsel to present the completed Month 2 Block 8 architectural defense. The enterprise's commercial future in an increasingly regulated, privacy-first digital landscape depends on your ability to articulate how this integrated stack delivers sustainable enterprise value.",
    "You summarize the accomplishments of this mission: First, we eradicated the catastrophic vulnerability of client-side tag decay by deploying a resilient Server-Side Google Tag Manager cluster on Google Cloud Run. We established direct, authenticated server-to-server pipelines to Meta Conversions API and Google Ads Enhanced Conversions, implementing SHA-256 PII normalization and deterministic event deduplication (event_id) that achieved an Event Quality Score exceeding 9.3 out of 10.0.",
    "Second, we future-proofed client-side web interactions by integrating the Google Chrome Privacy Sandbox standards. We harnessed the Topics API for interest discovery without cross-site tracking, implemented on-device remarketing auctions via the Protected Audience API with hardware-isolated Key/Value TEEs, captured differential-privacy conversion telemetry via the Attribution Reporting API, and enforced strict European regulatory compliance through automated Google Consent Mode v2 gating.",
    "Third, we unlocked collaborative multi-party commercial intelligence by deploying Customer Data Clean Rooms across Snowflake and AWS Clean Rooms. We safeguarded proprietary customer equity using Private Set Intersection, Secure Multiparty Computation, and Differential Privacy epsilon accounting, thwarting differencing reconstruction attacks and delivering closed-loop retail media attribution with verified statistical lift.",
    "Fourth, we transformed marketing economics by mastering non-contractual silent churn calculus. By calibrating the Beta-Geometric/Negative Binomial Distribution (BG/NBD) model for transaction frequency and the Gamma-Gamma submodel for monetary spend, we predicted 1-year customer lifetime value (pCLV) with surgical precision. We operationalized Value-Based Bidding, dynamically multiplying acquisition bids for high-equity cohorts while suppressing low-margin discount seekers.",
    "The Board is unanimous in its commendation. Your leadership has not only shielded the enterprise from regulatory penalties and signal loss but has also built an enduring, compounding competitive moat. You are hereby awarded the Chief Marketing Technologist & Privacy Engineering Accreditation (CMO-PEA v2). Course 06 has achieved 40 out of 60 certified days (66.7% completion). Congratulations on mastering the absolute frontier of modern digital marketing analytics and performance architecture."
]
p5_example = "The Chief Marketing Technologist presented the final CMO-PEA v2 defense to the Board of Directors. The board ratified a 40% increase in the enterprise data engineering budget, citing verified results: a 28% increase in tracked conversions via Server CAPI, $38M in verified retail clean room sales, and a 3.8x pCLV-to-CAC expansion powered by Value-Based Bidding."
p5_try_it = "Generate the official Chief Marketing Technologist & Privacy Engineering Accreditation (CMO-PEA v2) credential verification record."

p5_code = """class MasterAccreditationRegistry:
    @staticmethod
    def issue_accreditation(candidate_name: str, course_code: str, days_completed: int) -> dict:
        cert_data = f"{candidate_name}:{course_code}:{days_completed}:CMO-PEA-v2"
        cert_hash = hashlib.sha256(cert_data.encode()).hexdigest()
        
        return {
            "credential_name": "Chief Marketing Technologist & Privacy Engineering Accreditation (CMO-PEA v2)",
            "candidate": candidate_name,
            "course": course_code,
            "certified_days": f"{days_completed}/60 Days (66.7% Complete)",
            "accreditation_hash": cert_hash,
            "mastery_domains": [
                "Server-Side Tagging & Meta CAPI / Google Enhanced Conversions",
                "Google Chrome Privacy Sandbox (Topics, PAAPI, ARA, Consent Mode v2)",
                "Customer Data Clean Rooms (Snowflake, AWS, SMPC, Differential Privacy)",
                "Predictive CLV (BTYD, BG/NBD & Gamma-Gamma Value-Based Bidding)"
            ],
            "board_ratification": "UNANIMOUS_PASS"
        }

registry = MasterAccreditationRegistry()
cert = registry.issue_accreditation("Lead Marketing Architect", "bcom_dmkt", 40)

print("Credential Issued:", cert["credential_name"])
print("Candidate:", cert["candidate"])
print("Course Progress:", cert["certified_days"])
print("Cryptographic Verification Hash:", cert["accreditation_hash"])
print("Board Ratification Status:", cert["board_ratification"])
print("Mastery Domains:")
for domain in cert["mastery_domains"]:
    print(f"  * {domain}")
"""
p5_output = """Credential Issued: Chief Marketing Technologist & Privacy Engineering Accreditation (CMO-PEA v2)
Candidate: Lead Marketing Architect
Course Progress: 40/60 Days (66.7% Complete)
Cryptographic Verification Hash: 928374ba27a6f059cb2cf3b088e2c050bc78d5916ca118849bca7f79471131c2
Board Ratification Status: UNANIMOUS_PASS
Mastery Domains:
  * Server-Side Tagging & Meta CAPI / Google Enhanced Conversions
  * Google Chrome Privacy Sandbox (Topics, PAAPI, ARA, Consent Mode v2)
  * Customer Data Clean Rooms (Snowflake, AWS, SMPC, Differential Privacy)
  * Predictive CLV (BTYD, BG/NBD & Gamma-Gamma Value-Based Bidding)"""

p5_q = "What core architectural transformation distinguishes an enterprise holding CMO-PEA v2 accreditation from legacy digital marketing organizations?"
p5_opts = [
    "Unifying first-party server-side tagging, privacy sandbox standards, clean room cryptographic collaboration, and predictive CLV into an auditable intelligence engine.",
    "Relying entirely on third-party cookie trackers and unencrypted client-side JavaScript tags.",
    "Outsourcing all corporate advertising decisions to external influencer agencies without measurement.",
    "Banning all digital computers and returning to paper filing cabinets for customer relationship management."
]
p5_why = "CMO-PEA v2 accreditation recognizes mastery of modern privacy engineering and marketing science: integrating server-side CAPI pipelines, client Privacy Sandbox standards, clean rooms with differential privacy, and probabilistic BTYD predictive lifetime value modeling."

# Assemble Day 40
parts = [
    make_part(p1_title, p1_say, p1_example, p1_try_it, p1_code, p1_output, p1_q, p1_opts, p1_why),
    make_part(p2_title, p2_say, p2_example, p2_try_it, p2_code, p2_output, p2_q, p2_opts, p2_why),
    make_part(p3_title, p3_say, p3_example, p3_try_it, p3_code, p3_output, p3_q, p3_opts, p3_why),
    make_part(p4_title, p4_say, p4_example, p4_try_it, p4_code, p4_output, p4_q, p4_opts, p4_why),
    make_part(p5_title, p5_say, p5_example, p5_try_it, p5_code, p5_output, p5_q, p5_opts, p5_why)
]

day40_data = {
    "day": 40,
    "coursePrefix": "bcom_dmkt",
    "title": "Milestone 8 Capstone: Enterprise Privacy-Safe Ad Architecture, Clean Room Collaboration & Predictive Lifetime Value War Room",
    "goal": "Defend and orchestrate an integrated enterprise marketing technology war room, recovering from client signal drop via server CAPI, defeating clean room differencing attacks, deploying BG/NBD + Gamma-Gamma Value-Based Bidding, and earning the CMO-PEA v2 certification.",
    "recap": "In Block 8 we engineered Server-Side Tagging and CAPI, client-side Privacy Sandbox standards, Customer Data Clean Rooms with differential privacy, and predictive Customer Lifetime Value models. Today we execute the Milestone 8 Capstone War Room, synthesizing these disciplines into an unassailable enterprise growth architecture.",
    "minutes": 60,
    "parts": parts
}

out_path = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\day40_dmkt_data.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(day40_data, f, indent=2)

print(f"Successfully generated Day 40 data at {out_path}!")
total_words = sum(len(" ".join(p["say"]).split()) for p in parts)
print(f"Day 40 Total Words: {total_words}")
for i, p in enumerate(parts):
    words = len(" ".join(p["say"]).split())
    print(f"  Part {i+1} ({p['title']}): {words} words")
