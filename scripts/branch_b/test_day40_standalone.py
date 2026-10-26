# -*- coding: utf-8 -*-
"""
Standalone verified test script for Course 07 Day 40:
Milestone 8 Capstone: The Sovereign Global Composable Commerce & Checkout Infrastructure Command Tower
"""
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Part 1: Tier 1 - Multi-Gateway Smart Routing & Resilient Cascade
print("=== PART 1: TIER 1 - PAYMENT GATEWAY ORCHESTRATION ===")
class MultiGatewayRouter:
    def __init__(self):
        self.gateways = {
            "STRIPE": {"auth_rate": 0.94, "fee_pct": 0.029, "latency_ms": 180},
            "ADYEN": {"auth_rate": 0.96, "fee_pct": 0.024, "latency_ms": 140},
            "CHECKOUT": {"auth_rate": 0.93, "fee_pct": 0.026, "latency_ms": 160}
        }

    def route_transaction(self, amount: float, card_brand: str, currency: str) -> dict:
        # Route to Adyen for European/global lowest interchange and highest auth rate
        selected = "ADYEN" if currency in ["EUR", "GBP", "USD"] else "STRIPE"
        gw = self.gateways[selected]
        return {
            "tier": "TIER_1_PAYMENT_ORCHESTRATION",
            "primary_gateway": selected,
            "expected_auth_rate": gw["auth_rate"],
            "interchange_fee": round(amount * gw["fee_pct"], 2),
            "gateway_latency_ms": gw["latency_ms"],
            "status": "AUTHORIZATION_OPTIMAL"
        }

router = MultiGatewayRouter()
t1 = router.route_transaction(450.0, "VISA", "USD")
print(f"Tier 1 Gateway: {t1['primary_gateway']} | Auth Rate: {t1['expected_auth_rate']*100:.1f}% | Fee: ${t1['interchange_fee']} | Latency: {t1['gateway_latency_ms']}ms")

print("\n=== PART 2: TIER 2 - DISTRIBUTED SHOPPING CART & CRDT SYNC ===")
class DistributedCartCRDT:
    def __init__(self, cart_id: str):
        self.cart_id = cart_id
        self.adds = {}
        self.removes = {}

    def add_item(self, sku: str, qty: int):
        self.adds[sku] = self.adds.get(sku, 0) + qty

    def remove_item(self, sku: str, qty: int):
        self.removes[sku] = self.removes.get(sku, 0) + qty

    def get_effective_items(self) -> dict:
        cart = {}
        for sku, count in self.adds.items():
            net = count - self.removes.get(sku, 0)
            if net > 0:
                cart[sku] = net
        return cart

c1 = DistributedCartCRDT("cart_session_101")
c1.add_item("SKU_CHAIR_OAK", 3)
c1.remove_item("SKU_CHAIR_OAK", 1)
c1.add_item("SKU_LAMP_BRASS", 2)
active_cart = c1.get_effective_items()
print(f"Tier 2 CRDT Cart: {c1.cart_id} | Effective Items: {active_cart}")

print("\n=== PART 3: TIER 3 - COMPOSABLE PROMOTIONS & RETE WATERFALL ===")
class PromotionWaterfall:
    def __init__(self, gross: float):
        self.gross = gross

    def apply_promotions(self, volume_pct: float, coupon_fixed: float) -> dict:
        vol_discount = round(self.gross * volume_pct, 2)
        after_vol = self.gross - vol_discount
        coupon_discount = min(after_vol, coupon_fixed)
        net_after_promo = round(after_vol - coupon_discount, 2)
        total_savings = round(vol_discount + coupon_discount, 2)
        return {
            "gross_amount": self.gross,
            "volume_discount": vol_discount,
            "coupon_discount": coupon_discount,
            "total_savings": total_savings,
            "net_subtotal": net_after_promo
        }

p_waterfall = PromotionWaterfall(500.0)
promo_res = p_waterfall.apply_promotions(volume_pct=0.10, coupon_fixed=25.0)
print(f"Tier 3 Promo Waterfall: Gross: ${promo_res['gross_amount']} | Savings: -${promo_res['total_savings']} | Net: ${promo_res['net_subtotal']}")

print("\n=== PART 4: TIER 4 - GLOBAL TAXATION & LANDED COST ===")
class GlobalTaxLandedCostEngine:
    def __init__(self):
        self.rates = {"US_CA": 0.095, "DE": 0.19, "UK": 0.20}

    def compute_tax(self, jurisdiction: str, net_amount: float) -> dict:
        rate = self.rates.get(jurisdiction, 0.08)
        tax = round(net_amount * rate, 2)
        return {
            "jurisdiction": jurisdiction,
            "tax_rate_pct": round(rate * 100, 2),
            "tax_due": tax,
            "final_total": round(net_amount + tax, 2)
        }

tax_calc = GlobalTaxLandedCostEngine()
tx_res = tax_calc.compute_tax("US_CA", promo_res["net_subtotal"])
print(f"Tier 4 Tax Engine: Jurisdiction: {tx_res['jurisdiction']} | Tax Rate: {tx_res['tax_rate_pct']}% | Tax Due: ${tx_res['tax_due']} | Total Due: ${tx_res['final_total']}")

print("\n=== PART 5: TIER 5 - BOARDROOM ACCREDITATION SCORECARD ===")
class Milestone8GrandCapstoneAuditor:
    def __init__(self):
        self.accreditation_threshold = 95.0

    def evaluate_candidate(self, t1_metric: float, t2_metric: float, t3_metric: float, t4_metric: float) -> dict:
        total_score = t1_metric + t2_metric + t3_metric + t4_metric
        is_accredited = total_score >= self.accreditation_threshold
        return {
            "candidate_credential": "Chief Commerce Infrastructure Architect & Global Transaction Authority (CCIA-GTA)",
            "accreditation_status": "GOVERNANCE_ACCREDITED" if is_accredited else "RETRY_AUDIT",
            "composite_score": total_score,
            "pillar_breakdown": {
                "tier1_gateway_orchestration": t1_metric,
                "tier2_crdt_cart_engine": t2_metric,
                "tier3_rules_promotion_engine": t3_metric,
                "tier4_global_taxation_customs": t4_metric
            },
            "enterprise_impact": {
                "checkout_conversion_lift_pct": 14.8,
                "interchange_savings_annual_usd": 1250000.0,
                "cross_border_abandonment_reduction_pct": 42.5,
                "sub_second_p99_checkout_latency_ms": 320
            },
            "boardroom_approved": is_accredited
        }

auditor = Milestone8GrandCapstoneAuditor()
audit = auditor.evaluate_candidate(25.0, 25.0, 25.0, 25.0)

print("=" * 80)
print("  SOVEREIGN CORPORATE BOARDROOM DEFENSE: MILESTONE 8 GRAND CAPSTONE")
print("  ACCREDITATION: B.COM E-COMMERCE PLATFORM ARCHITECTURE (COURSE 07)")
print("=" * 80)
print(f"Professional Credential:         {audit['candidate_credential']}")
print(f"Boardroom Governance Status:     [{audit['accreditation_status']}] (Conferred: {audit['boardroom_approved']})")
print(f"Composite Score:                 {audit['composite_score']} / 100.00 pts")
print("Pillar Scorecard:")
for pillar, score in audit['pillar_breakdown'].items():
    print(f"  {pillar:<30}: {score:5.2f} / 25.00 pts")
print("Enterprise Value Realization:")
print(f"  Checkout Conversion Lift:      {audit['enterprise_impact']['checkout_conversion_lift_pct']}%")
print(f"  Annual Interchange Savings:    ${audit['enterprise_impact']['interchange_savings_annual_usd']:,.2f} USD")
print(f"  Cross-Border Drop Reduction:   {audit['enterprise_impact']['cross_border_abandonment_reduction_pct']}%")
print(f"  p99 Global Checkout Latency:   {audit['enterprise_impact']['sub_second_p99_checkout_latency_ms']} ms")
print("=" * 80)
