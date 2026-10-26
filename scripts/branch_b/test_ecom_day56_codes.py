"""
Test and verify Python code blocks for Course 07 Day 56:
Marketplace Seller Governance, Seller Scorecards, SLA Enforcement & Buy Box Algorithms
"""
import math
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

print("=== PART 1: SELLER KYB ONBOARDING & SANCTIONS VERIFICATION ===")
@dataclass
class SellerKYBVerificationRequest:
    seller_id: str
    legal_entity_name: str
    tax_id: str
    jurisdiction_country: str
    has_valid_beneficial_ownership_registry: bool
    is_sanctions_list_cleared: bool
    bank_account_verified: bool

class MarketplaceSellerOnboardingGate:
    def evaluate_kyb_eligibility(self, req: SellerKYBVerificationRequest) -> Tuple[bool, str]:
        if not req.is_sanctions_list_cleared:
            return False, "REJECTED_OFAC_SANCTIONS_MATCH"
        if not req.bank_account_verified:
            return False, "HOLD_PENDING_BANK_ACCOUNT_VERIFICATION"
        if not req.has_valid_beneficial_ownership_registry:
            return False, "HOLD_MISSING_ULTIMATE_BENEFICIAL_OWNER_FILING"
        return True, "APPROVED_SELLER_KYB_CLEARED"

onboarding = MarketplaceSellerOnboardingGate()
seller_good = SellerKYBVerificationRequest("SEL-8812", "Apex Retailers LLC", "US-9918231", "US", True, True, True)
seller_bad = SellerKYBVerificationRequest("SEL-9904", "Global Cargo Ltd", "RU-110293", "CY", True, False, True)

ok_good, msg_good = onboarding.evaluate_kyb_eligibility(seller_good)
ok_bad, msg_bad = onboarding.evaluate_kyb_eligibility(seller_bad)

print(f"Seller 1 ({seller_good.legal_entity_name}): Approved={ok_good} | Status: [{msg_good}]")
print(f"Seller 2 ({seller_bad.legal_entity_name}): Approved={ok_bad} | Status: [{msg_bad}]")


print("\n=== PART 2: SELLER PERFORMANCE SCORECARDS & SLA MONITORING ===")
@dataclass
class SellerPerformanceMetrics:
    seller_id: str
    total_orders_90d: int
    cancelled_by_seller_orders: int
    late_dispatch_orders: int
    negative_feedback_orders: int
    a_to_z_guarantee_claims: int

class SellerHealthAuditEngine:
    def calculate_health_metrics(self, m: SellerPerformanceMetrics) -> Dict[str, float]:
        odr_pct = round(((m.negative_feedback_orders + m.a_to_z_guarantee_claims) / m.total_orders_90d) * 100, 2)
        cancellation_rate_pct = round((m.cancelled_by_seller_orders / m.total_orders_90d) * 100, 2)
        late_dispatch_rate_pct = round((m.late_dispatch_orders / m.total_orders_90d) * 100, 2)
        
        # Marketplace SLA benchmarks: ODR < 1.0%, Cancellation < 2.5%, Late Dispatch < 4.0%
        is_healthy = odr_pct < 1.0 and cancellation_rate_pct < 2.5 and late_dispatch_rate_pct < 4.0
        
        return {
            "order_defect_rate_pct": odr_pct,
            "cancellation_rate_pct": cancellation_rate_pct,
            "late_dispatch_rate_pct": late_dispatch_rate_pct,
            "is_sla_compliant": 1.0 if is_healthy else 0.0
        }

audit_eng = SellerHealthAuditEngine()
metrics_prime = SellerPerformanceMetrics("SEL-8812", 10000, 15, 30, 8, 2)
metrics_flagged = SellerPerformanceMetrics("SEL-3310", 2000, 95, 120, 28, 6)

res_prime = audit_eng.calculate_health_metrics(metrics_prime)
res_flagged = audit_eng.calculate_health_metrics(metrics_flagged)

print(f"Seller Prime Audit: ODR={res_prime['order_defect_rate_pct']}% | Late={res_prime['late_dispatch_rate_pct']}% | SLA_Compliant={bool(res_prime['is_sla_compliant'])}")
print(f"Seller Flagged Audit: ODR={res_flagged['order_defect_rate_pct']}% | Late={res_flagged['late_dispatch_rate_pct']}% | SLA_Compliant={bool(res_flagged['is_sla_compliant'])}")


print("\n=== PART 3: ALGORITHMIC BUY BOX RANKING & DYNAMIC ALLOCATION ===")
@dataclass
class SellerOffer:
    seller_id: str
    total_landed_price_usd: float
    shipping_speed_hours: int
    seller_feedback_score: float # 0.0 to 5.0
    is_fba_or_managed_fulfillment: bool

class BuyBoxRankingEngine:
    def rank_offers_for_buy_box(self, offers: List[SellerOffer]) -> List[Tuple[str, float]]:
        scores = []
        min_price = min(o.total_landed_price_usd for o in offers)
        
        for o in offers:
            # Multi-variable Buy Box weighting algorithm:
            # 50% Price Competitiveness + 25% Fulfillment Speed + 15% Feedback + 10% Managed Prime Fulfillment
            price_score = (min_price / o.total_landed_price_usd) * 50.0
            speed_score = max(0.0, (72.0 - min(72.0, float(o.shipping_speed_hours))) / 72.0) * 25.0
            feedback_score = (o.seller_feedback_score / 5.0) * 15.0
            fulfillment_score = 10.0 if o.is_fba_or_managed_fulfillment else 0.0
            
            total_rank = round(price_score + speed_score + feedback_score + fulfillment_score, 2)
            scores.append((o.seller_id, total_rank))
            
        scores.sort(key=lambda x: x[1], reverse=True)
        return scores

ranking_engine = BuyBoxRankingEngine()
offers = [
    SellerOffer("SEL-A_DIRECT", 49.99, 48, 4.9, True),
    SellerOffer("SEL-B_DISCOUNT", 46.50, 120, 4.4, False),
    SellerOffer("SEL-C_SLOW", 52.00, 24, 4.8, True)
]

ranked = ranking_engine.rank_offers_for_buy_box(offers)
print("Buy Box Allocation Results:")
for rank_idx, (s_id, sc) in enumerate(ranked, start=1):
    status = "[BUY_BOX_WINNER]" if rank_idx == 1 else "[STANDARD_OFFER]"
    print(f"  Rank {rank_idx}: Seller: {s_id:<14} | Score: {sc:5.2f} pts {status}")


print("\n=== PART 4: SELLER SUSPENSION & AUTOMATED REMEDIATION (POA) ===")
@dataclass
class SellerRemediationPlan:
    seller_id: str
    root_cause_analysis_submitted: bool
    corrective_actions_implemented: bool
    preventive_measures_established: bool
    has_escrow_deposit_funded: bool

def evaluate_remediation_appeal(plan: SellerRemediationPlan) -> Tuple[bool, str]:
    if not (plan.root_cause_analysis_submitted and plan.corrective_actions_implemented):
        return False, "REJECTED_DEFICIENT_PLAN_OF_ACTION"
    if not plan.preventive_measures_established:
        return False, "HOLD_INSUFFICIENT_PREVENTIVE_CONTROLS"
    if not plan.has_escrow_deposit_funded:
        return True, "CONDITIONAL_REINSTATEMENT_ZERO_ESCROW"
    return True, "FULL_REINSTATEMENT_AUTHORIZED"

appeal_good = SellerRemediationPlan("SEL-3310", True, True, True, True)
appeal_bad = SellerRemediationPlan("SEL-9901", True, False, False, False)

ok_app_good, msg_app_good = evaluate_remediation_appeal(appeal_good)
ok_app_bad, msg_app_bad = evaluate_remediation_appeal(appeal_bad)

print(f"Remediation Appeal 1: Approved={ok_app_good} | Verdict: [{msg_app_good}]")
print(f"Remediation Appeal 2: Approved={ok_app_bad} | Verdict: [{msg_app_bad}]")


print("\n=== PART 5: MARKETPLACE SELLER GOVERNANCE COMMAND TOWER ===")
@dataclass
class MarketplaceGovernanceOverview:
    active_sellers: int
    total_gmv_audited_usd: float
    platform_avg_odr_pct: float
    buy_box_coverage_healthy_pct: float
    appeals_turnaround_time_hours: float

def audit_seller_governance_tower(gov: MarketplaceGovernanceOverview) -> Dict[str, float]:
    score = 0.0
    score += 30.0 if gov.platform_avg_odr_pct <= 0.8 else 15.0
    score += 40.0 if gov.buy_box_coverage_healthy_pct >= 95.0 else 20.0
    score += 30.0 if gov.appeals_turnaround_time_hours <= 24.0 else 15.0
    
    return {
        "active_sellers": float(gov.active_sellers),
        "total_gmv_audited": gov.total_gmv_audited_usd,
        "platform_odr": gov.platform_avg_odr_pct,
        "buy_box_health": gov.buy_box_coverage_healthy_pct,
        "appeals_sla": gov.appeals_turnaround_time_hours,
        "composite_score": round(score, 1),
        "status": "APEX_MARKETPLACE_GOVERNANCE_CERTIFIED" if score == 100.0 else "SUBOPTIMAL"
    }

tower_metrics = MarketplaceGovernanceOverview(
    active_sellers=14500,
    total_gmv_audited_usd=450_000_000.0,
    platform_avg_odr_pct=0.42,
    buy_box_coverage_healthy_pct=98.7,
    appeals_turnaround_time_hours=14.2
)

tower_audit = audit_seller_governance_tower(tower_metrics)
print(f"Marketplace Seller Governance Command Tower:")
print(f"  Active Sellers Managed:      {tower_audit['active_sellers']:,.0f}")
print(f"  Audited Marketplace GMV:     ${tower_audit['total_gmv_audited']:,.2f} USD")
print(f"  Platform Fleet ODR:          {tower_audit['platform_odr']}% (Target <= 0.80%)")
print(f"  Buy Box Availability Health: {tower_audit['buy_box_health']}% (Target >= 95.0%)")
print(f"  Appeals Review Turnaround:   {tower_audit['appeals_sla']} hrs (Target <= 24.0h)")
print(f"  Composite Governance Score:  {tower_audit['composite_score']}/100.0 pts")
print(f"  Accreditation Status:        [{tower_audit['status']}]")
