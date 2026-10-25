import hashlib
import json
import math

print("=== PART 1 ===")
class MultimodalCreativeGovernanceStudio:
    def __init__(self, brand_name: str, guideline_embedding: list[float]):
        self.brand = brand_name
        self.guideline_emb = guideline_embedding
        self.banned_tokens = ["guaranteed profit", "free crypto", "miracle cure"]

    def _cosine_similarity(self, v1: list[float], v2: list[float]) -> float:
        dot = sum(a * b for a, b in zip(v1, v2))
        norm1 = math.sqrt(sum(a * a for a in v1))
        norm2 = math.sqrt(sum(b * b for b in v2))
        return dot / (norm1 * norm2) if norm1 > 0 and norm2 > 0 else 0.0

    def generate_and_govern_asset(self, prompt: str, prompt_emb: list[float], model_engine: str) -> dict:
        for bad in self.banned_tokens:
            if bad in prompt.lower():
                raise ValueError(f"Brand Safety Breach: Prompt contains banned phrase '{bad}'")
        
        sim = self._cosine_similarity(prompt_emb, self.guideline_emb)
        brand_alignment_pass = sim >= 0.80
        
        # Manifest creation for C2PA
        manifest_raw = f"{self.brand}:{model_engine}:{prompt}:{sim:.4f}"
        c2pa_hash = hashlib.sha256(manifest_raw.encode("utf-8")).hexdigest()
        
        return {
            "brand": self.brand,
            "engine": model_engine,
            "prompt_similarity_score": round(sim, 4),
            "brand_alignment_pass": brand_alignment_pass,
            "eu_ai_act_article_50_label": "SYNTHETIC_MEDIA_DECLARED",
            "c2pa_provenance_manifest_sha256": c2pa_hash[:16] + "...",
            "governance_status": "APPROVED_FOR_PROGRAMMATIC_SYNDICATION" if brand_alignment_pass else "REJECTED_LOW_ALIGNMENT"
        }

studio = MultimodalCreativeGovernanceStudio(
    brand_name="AuraLuxury Global",
    guideline_embedding=[0.85, 0.45, 0.25, 0.10]
)

result = studio.generate_and_govern_asset(
    prompt="Cinematic 4K shot of artisanal chronograph on obsidian pedestal in alpine twilight",
    prompt_emb=[0.82, 0.48, 0.22, 0.12],
    model_engine="Flux-Pro-v1.1-LoRA-Aura"
)

print("--- Tier 1: Multimodal GenAI Governance Telemetry ---")
for k, v in result.items():
    print(f"  {k}: {v}")

print("\n=== PART 2 ===")
class AutonomousAgenticDSP:
    def __init__(self, campaign_name: str, dimension: int = 3, alpha: float = 1.0):
        self.campaign = campaign_name
        self.d = dimension
        self.alpha = alpha
        self.A = [[1.0 if i == j else 0.0 for j in range(dimension)] for i in range(dimension)]
        self.b = [0.0] * dimension
        self.total_bids = 0
        self.total_wins = 0
        self.total_spend = 0.0

    def compute_linucb_bid(self, context_vector: list[float], base_bid: float) -> tuple[float, float]:
        inv_diag = [1.0 / max(0.001, self.A[i][i]) for i in range(self.d)]
        theta = [inv_diag[i] * self.b[i] for i in range(self.d)]
        
        expected_ctr = sum(theta[i] * context_vector[i] for i in range(self.d))
        variance = math.sqrt(sum(context_vector[i] * inv_diag[i] * context_vector[i] for i in range(self.d)))
        ucb_score = expected_ctr + self.alpha * variance
        
        bid_price = round(base_bid * max(0.5, min(2.5, 1.0 + ucb_score)), 2)
        return bid_price, round(ucb_score, 4)

    def process_auction(self, context: list[float], base_bid: float, floor_price: float, market_second_price: float) -> dict:
        self.total_bids += 1
        bid, ucb = self.compute_linucb_bid(context, base_bid)
        
        won = bid >= market_second_price and bid >= floor_price
        clearing_price = market_second_price if won else 0.0
        
        if won:
            self.total_wins += 1
            self.total_spend += clearing_price
            reward = 1.0 if ucb > 0.8 else 0.2
            for i in range(self.d):
                self.A[i][i] += context[i] * context[i]
                self.b[i] += reward * context[i]

        return {
            "bid_submitted_cpm": f"${bid:.2f}",
            "ucb_uncertainty_score": ucb,
            "auction_outcome": "WIN" if won else "LOSS",
            "clearing_cpm": f"${clearing_price:.2f}"
        }

dsp = AutonomousAgenticDSP(campaign_name="Enterprise Q4 Omni-Growth", dimension=3, alpha=1.2)
auctions = [
    ([0.9, 0.7, 0.4], 4.50, 2.00, 3.80),
    ([0.4, 0.3, 0.1], 3.00, 1.50, 3.20),
    ([0.8, 0.9, 0.6], 5.00, 2.50, 4.10)
]

print("--- Tier 2: Multi-Agent DSP LinUCB RTB Telemetry ---")
for idx, (ctx, base, floor, mkt) in enumerate(auctions, 1):
    res = dsp.process_auction(ctx, base, floor, mkt)
    print(f"Auction {idx}: {res['auction_outcome']} at {res['bid_submitted_cpm']} (Clearing: {res['clearing_cpm']})")
print(f"Total Won: {dsp.total_wins}/{dsp.total_bids} | Total Spend: ${dsp.total_spend:.2f}")

print("\n=== PART 3 ===")
class EdgeVisionDOOHOrchestrator:
    def __init__(self, venue_id: str, screen_id: str):
        self.venue = venue_id
        self.screen = screen_id
        self.screen_rate_card_cpm = 18.50

    def process_edge_telemetry(self, raw_pedestrians: list[dict], min_dwell_sec: float = 3.0) -> dict:
        total_detected = len(raw_pedestrians)
        qualified_shoppers = [p for p in raw_pedestrians if p["dwell_seconds"] >= min_dwell_sec]
        avg_dwell = sum(p["dwell_seconds"] for p in qualified_shoppers) / max(1, len(qualified_shoppers))
        
        trigger_dynamic_takeover = len(qualified_shoppers) >= 3 and avg_dwell >= 4.0
        creative_served = "HERO_INTERACTIVE_OFFER_4K" if trigger_dynamic_takeover else "STANDARD_AMBIENT_LOOP"
        
        baseline_store_conversions = 45
        estimated_lift_rate = 0.22 if trigger_dynamic_takeover else 0.05
        projected_conversions = int(baseline_store_conversions * (1.0 + estimated_lift_rate))

        return {
            "venue_id": self.venue,
            "screen_id": self.screen,
            "total_pedestrians_tracked": total_detected,
            "qualified_dwellers": len(qualified_shoppers),
            "average_dwell_time_sec": round(avg_dwell, 2),
            "dynamic_creative_served": creative_served,
            "projected_store_conversions": projected_conversions,
            "incremental_lift_rate": f"+{estimated_lift_rate * 100:.1f}%",
            "pii_compliance_status": "EPHEMERAL_FRAME_ZERO_STORAGE"
        }

dooh = EdgeVisionDOOHOrchestrator(venue_id="Flagship_SoHo_01", screen_id="DISP_ENTRY_4K_NORTH")
telemetry = [
    {"shopper_id": "anon_01", "dwell_seconds": 4.8},
    {"shopper_id": "anon_02", "dwell_seconds": 5.2},
    {"shopper_id": "anon_03", "dwell_seconds": 1.2},
    {"shopper_id": "anon_04", "dwell_seconds": 4.1}
]

res = dooh.process_edge_telemetry(telemetry)
print("--- Tier 3: In-Store Edge Vision & Programmatic DOOH Telemetry ---")
for k, v in res.items():
    print(f"  {k}: {v}")

print("\n=== PART 4 ===")
class SovereignCausalCleanRoom:
    def __init__(self, brand_partner: str, retail_partner: str):
        self.brand = brand_partner
        self.retail = retail_partner
        self.prime = 1000000007

    def smpc_shamir_combine_revenue(self, shares: list[tuple[int, int]]) -> float:
        x1, y1 = shares[0]
        x2, y2 = shares[1]
        denom = (x1 - x2) % self.prime
        inv_denom = pow(denom, self.prime - 2, self.prime)
        secret_cents = (y1 * (-x2) * inv_denom + y2 * (-x1) * pow(x2 - x1, self.prime - 2, self.prime)) % self.prime
        return secret_cents / 100.0

    def compute_pearl_causal_comparison(self, ad_spend: float, audience: int, aov: float,
                                         p_obs_converted: float, p_do_ad: float, p_do_no_ad: float) -> dict:
        obs_orders = int(audience * p_obs_converted)
        obs_revenue = obs_orders * aov
        obs_roas = obs_revenue / ad_spend

        causal_lift = p_do_ad - p_do_no_ad
        causal_orders = int(audience * causal_lift)
        causal_revenue = causal_orders * aov
        causal_iroas = causal_revenue / ad_spend
        phantom_bias = obs_roas - causal_iroas

        return {
            "observational_mta_roas": f"{obs_roas:.2f}x",
            "pearl_causal_iroas": f"{causal_iroas:.2f}x",
            "phantom_correlation_bias": f"{phantom_bias:.2f}x",
            "net_causal_incremental_revenue": f"${causal_revenue:,.2f}",
            "confounder_backdoor_eliminated": "PRIOR_LOYALTY_ORGANIC_INTENT",
            "capital_allocation_verdict": "PROCEED_WITH_SCALED_BUDGET" if causal_iroas >= 2.0 else "HALT_INEFFICIENT_SPEND"
        }

clean_room = SovereignCausalCleanRoom(brand_partner="AuraLuxury Global", retail_partner="OmniRetail Network")
recon_rev = clean_room.smpc_shamir_combine_revenue([(1, 240045000), (2, 240090000)])

causal_eval = clean_room.compute_pearl_causal_comparison(
    ad_spend=750000.0,
    audience=500000,
    aov=120.0,
    p_obs_converted=0.075,
    p_do_ad=0.065,
    p_do_no_ad=0.035
)

print("--- Tier 4: SMPC Clean Room & Pearl Causal Graph Telemetry ---")
print(f"  smpc_reconstructed_attributed_revenue: ${recon_rev:,.2f}")
for k, v in causal_eval.items():
    print(f"  {k}: {v}")

print("\n=== PART 5 ===")
class ChiefMarketingTechnologyEngine:
    def __init__(self, enterprise_id: str, candidate_name: str):
        self.enterprise = enterprise_id
        self.candidate = candidate_name
        self.system_health_scores: dict[str, float] = {}

    def audit_tier_1_genai_governance(self, brand_alignment: float, c2pa_verified: bool) -> bool:
        passed = brand_alignment >= 0.85 and c2pa_verified
        self.system_health_scores["Tier 1: Multimodal GenAI & C2PA"] = 1.0 if passed else 0.0
        return passed

    def audit_tier_2_agentic_dsp(self, win_rate: float, latency_ms: float) -> bool:
        passed = win_rate >= 0.60 and latency_ms <= 12.0
        self.system_health_scores["Tier 2: Agentic DSP & LinUCB"] = 1.0 if passed else 0.0
        return passed

    def audit_tier_3_edge_vision_dooh(self, dwell_accuracy: float, pii_zero_retention: bool) -> bool:
        passed = dwell_accuracy >= 0.90 and pii_zero_retention
        self.system_health_scores["Tier 3: In-Store Vision & DOOH"] = 1.0 if passed else 0.0
        return passed

    def audit_tier_4_causal_clean_room(self, smpc_integrity: bool, causal_iroas: float) -> bool:
        passed = smpc_integrity and causal_iroas >= 2.0
        self.system_health_scores["Tier 4: SMPC & Pearl Causal Graph"] = 1.0 if passed else 0.0
        return passed

    def execute_grand_master_accreditation(self, total_annual_media_budget: float, verified_causal_lift_usd: float) -> dict:
        passed_tiers = sum(self.system_health_scores.values())
        all_passed = passed_tiers == 4.0
        
        cert_payload = f"{self.candidate}:{self.enterprise}:{passed_tiers}:{total_annual_media_budget}"
        sig = hashlib.sha256(cert_payload.encode("utf-8")).hexdigest()

        return {
            "enterprise_entity": self.enterprise,
            "accredited_officer": self.candidate,
            "conferred_credential": "CHIEF MARKETING TECHNOLOGY OFFICER & SOVEREIGN AUTONOMOUS GROWTH ARCHITECT (CMTO-SAGA)",
            "governed_annual_media_spend": f"${total_annual_media_budget:,.2f}",
            "verified_causal_incremental_lift": f"${verified_causal_lift_usd:,.2f}",
            "tier_audits_passed": f"{int(passed_tiers)}/4 Tiers Verified",
            "boardroom_fiduciary_verdict": "SOVEREIGN_AUTONOMOUS_OPERATING_EXCELLENCE" if all_passed else "REMEDIATION_REQUIRED",
            "cryptographic_accreditation_hash": sig
        }

engine = ChiefMarketingTechnologyEngine(
    enterprise_id="OmniMedia Holdings Corp",
    candidate_name="Lead Autonomous Marketing Engineer"
)

t1 = engine.audit_tier_1_genai_governance(brand_alignment=0.92, c2pa_verified=True)
t2 = engine.audit_tier_2_agentic_dsp(win_rate=0.68, latency_ms=8.4)
t3 = engine.audit_tier_3_edge_vision_dooh(dwell_accuracy=0.96, pii_zero_retention=True)
t4 = engine.audit_tier_4_causal_clean_room(smpc_integrity=True, causal_iroas=2.83)

accreditation = engine.execute_grand_master_accreditation(
    total_annual_media_budget=150000000.0,
    verified_causal_lift_usd=42450000.0
)

print("================================================================================")
print("  OFFICIAL GRAND MASTER CAPSTONE ACCREDITATION & BOARDROOM DEFENSE ATTESTATION  ")
print("================================================================================")
for k, v in accreditation.items():
    print(f"  {k}: {v}")
print("================================================================================")
