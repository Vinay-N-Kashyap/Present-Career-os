# -*- coding: utf-8 -*-
"""
Deterministic Python test suite for Course 07: bcom_ecom Day 38
Composable Digital Promotions & Rules Engines
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

print("=== PART 1: DISCOUNT WATERFALL ENGINE ===")
class DiscountWaterfallEngine:
    def __init__(self, base_price: float, qty: int):
        self.base_price = base_price
        self.qty = qty
        self.gross_subtotal = base_price * qty

    def apply_waterfall(self, volume_pct: float, category_fixed: float, coupon_pct: float) -> dict:
        step0_gross = self.gross_subtotal
        
        # Step 1: Volume Tier Discount
        vol_discount = round(step0_gross * volume_pct, 2)
        step1_subtotal = step0_gross - vol_discount
        
        # Step 2: Category Promotion Discount (capped at remaining)
        cat_discount = min(step1_subtotal, category_fixed)
        step2_subtotal = step1_subtotal - cat_discount
        
        # Step 3: Order Coupon Discount
        coupon_discount = round(step2_subtotal * coupon_pct, 2)
        final_total = max(0.0, step2_subtotal - coupon_discount)
        
        total_discount = vol_discount + cat_discount + coupon_discount
        effective_discount_pct = round((total_discount / step0_gross) * 100, 2)
        
        return {
            "gross_subtotal": step0_gross,
            "volume_discount": vol_discount,
            "category_discount": cat_discount,
            "coupon_discount": coupon_discount,
            "total_savings": round(total_discount, 2),
            "final_net_price": round(final_total, 2),
            "effective_discount_pct": effective_discount_pct
        }

engine = DiscountWaterfallEngine(base_price=100.0, qty=3)
res = engine.apply_waterfall(volume_pct=0.10, category_fixed=20.0, coupon_pct=0.15)
print(f"Gross:    ${res['gross_subtotal']:.2f}")
print(f"Savings:  ${res['total_savings']:.2f} (Effective: {res['effective_discount_pct']}%)")
print(f"Net Due:  ${res['final_net_price']:.2f}")


print("\n=== PART 2: RETE PATTERN-MATCHING PROMOTION ENGINE ===")
class SimpleRETEPromotionEngine:
    def __init__(self):
        # Alpha nodes: condition filters on single attributes
        # Beta nodes: cross-attribute joins (e.g. cart subtotal >= 200 AND category == 'ELECTRONICS')
        self.rules = [
            {"id": "RULE_TECH_BUNDLE", "min_spend": 200.0, "category": "ELECTRONICS", "discount": 25.0},
            {"id": "RULE_VIP_CART", "min_spend": 500.0, "category": "ALL", "discount": 60.0}
        ]

    def evaluate_cart(self, subtotal: float, category: str) -> list[dict]:
        triggered_rules = []
        for rule in self.rules:
            # Alpha node match: spend condition
            spend_match = subtotal >= rule["min_spend"]
            # Alpha node match: category condition
            cat_match = rule["category"] == "ALL" or rule["category"] == category
            
            # Beta node join: both conditions satisfied
            if spend_match and cat_match:
                triggered_rules.append({
                    "rule_id": rule["id"],
                    "discount_applied": rule["discount"],
                    "match_type": "RETE_BETA_ACTIVATION"
                })
        return triggered_rules

rete = SimpleRETEPromotionEngine()
activations = rete.evaluate_cart(subtotal=250.0, category="ELECTRONICS")
print(f"Triggered Rules: {len(activations)}")
for act in activations:
    print(f"  {act['rule_id']}: -${act['discount_applied']} ({act['match_type']})")


print("\n=== PART 3: COUPON STACKING VALIDATOR ===")
class CouponStackingValidator:
    def __init__(self):
        # Compatibility rules: True if stackable with others
        self.coupon_registry = {
            "SAVE10": {"type": "PERCENT", "value": 0.10, "stackable": True, "category": "GENERAL"},
            "FREESHIP": {"type": "SHIPPING", "value": 15.0, "stackable": True, "category": "SHIPPING"},
            "BLACKFRIDAY50": {"type": "PERCENT", "value": 0.50, "stackable": False, "category": "FLASH_SALE"}
        }

    def validate_coupon_stack(self, coupon_codes: list[str]) -> dict:
        applied = []
        has_exclusive = False
        
        for code in coupon_codes:
            meta = self.coupon_registry.get(code)
            if not meta:
                continue
            
            if not meta["stackable"]:
                if applied:
                    return {"status": "REJECTED", "reason": f"Exclusive coupon {code} cannot be combined"}
                has_exclusive = True
            elif has_exclusive:
                return {"status": "REJECTED", "reason": f"Cannot add stackable coupon with exclusive active"}
                
            applied.append(code)
            
        return {
            "status": "APPROVED",
            "applied_coupons": applied,
            "stack_depth": len(applied)
        }

validator = CouponStackingValidator()
test1 = validator.validate_coupon_stack(["SAVE10", "FREESHIP"])
test2 = validator.validate_coupon_stack(["BLACKFRIDAY50", "SAVE10"])

print(f"Stack 1 (SAVE10 + FREESHIP):       {test1['status']} | Count: {test1.get('stack_depth')}")
print(f"Stack 2 (BLACKFRIDAY50 + SAVE10):  {test2['status']} | Reason: {test2.get('reason')}")


print("\n=== PART 4: PROMOTIONAL ABUSE DETECTOR ===")
class PromoAbuseDetector:
    def __init__(self):
        self.device_history = {} # device_id: referral_count

    def inspect_referral_attempt(self, referrer_id: str, new_user_device: str, email: str) -> dict:
        # Check 1: Self-referral via device fingerprint
        if new_user_device == f"dev-{referrer_id}":
            return {"verdict": "ABUSE_BLOCKED", "reason": "SELF_REFERRAL_SAME_DEVICE", "action": "REVOKE_PROMO"}
        
        # Check 2: Disposable email domain
        disposable_domains = ["mailinator.com", "tempmail.com", "10minutemail.com"]
        domain = email.split("@")[-1] if "@" in email else ""
        if domain in disposable_domains:
            return {"verdict": "ABUSE_BLOCKED", "reason": "DISPOSABLE_EMAIL_DETECTED", "action": "REQUIRE_OTP"}
            
        # Check 3: Device referral velocity
        self.device_history[new_user_device] = self.device_history.get(new_user_device, 0) + 1
        if self.device_history[new_user_device] > 2:
            return {"verdict": "ABUSE_BLOCKED", "reason": "DEVICE_VELOCITY_EXCEEDED", "action": "BLOCK_DEVICE"}
            
        return {"verdict": "LEGITIMATE", "reason": "PASSED_FRAUD_HEURISTICS", "action": "GRANT_DISCOUNT"}

detector = PromoAbuseDetector()
a1 = detector.inspect_referral_attempt("user101", "dev-user101", "user101_alt@gmail.com")
a2 = detector.inspect_referral_attempt("user101", "dev-device99", "shoppertest@tempmail.com")
a3 = detector.inspect_referral_attempt("user101", "dev-device99", "realuser@enterprise.com")

print(f"Attempt 1: {a1['verdict']} | {a1['reason']}")
print(f"Attempt 2: {a2['verdict']} | {a2['reason']}")
print(f"Attempt 3: {a3['verdict']} | {a3['reason']}")


print("\n=== PART 5: ENTERPRISE PROMOTION ENGINE ===")
class EnterprisePromotionEngine:
    def __init__(self):
        self.waterfall = DiscountWaterfallEngine(base_price=200.0, qty=2)
        self.validator = CouponStackingValidator()
        self.detector = PromoAbuseDetector()

    def process_promotions(self, user_id: str, device_id: str, email: str, coupons: list[str]) -> dict:
        # Step 1: Abuse check
        abuse_check = self.detector.inspect_referral_attempt(user_id, device_id, email)
        if abuse_check["verdict"] != "LEGITIMATE":
            return {"status": "ABUSE_REJECTED", "details": abuse_check}
            
        # Step 2: Coupon stack validation
        stack_check = self.validator.validate_coupon_stack(coupons)
        if stack_check["status"] != "APPROVED":
            return {"status": "COUPON_CONFLICT", "details": stack_check}
            
        # Step 3: Discount calculation
        calc = self.waterfall.apply_waterfall(volume_pct=0.05, category_fixed=15.0, coupon_pct=0.10)
        
        return {
            "status": "PROMOTIONS_APPLIED",
            "eligible_coupons": stack_check["applied_coupons"],
            "gross_amount": calc["gross_subtotal"],
            "total_discount": calc["total_savings"],
            "final_subtotal": calc["final_net_price"]
        }

engine = EnterprisePromotionEngine()
promo_result = engine.process_promotions(
    user_id="VIP-550",
    device_id="dev-phone-441",
    email="customer@legitimate.org",
    coupons=["SAVE10", "FREESHIP"]
)
print(f"Promotion Status:  {promo_result['status']}")
print(f"Coupons Applied:   {promo_result['eligible_coupons']}")
print(f"Gross Subtotal:    ${promo_result['gross_amount']:.2f}")
print(f"Discount Granted:  ${promo_result['total_discount']:.2f}")
print(f"Final Cart Due:    ${promo_result['final_subtotal']:.2f}")
