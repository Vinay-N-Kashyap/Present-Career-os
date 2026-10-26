"""
Test Python Code Snippets for Day 59 (bcom_ecom)
"""
import sys
import io

sys.stdout.reconfigure(encoding='utf-8')

# Part 1 Code
p1_code = '''from dataclasses import dataclass
from typing import Dict

@dataclass
class ListingRiskSignals:
    listing_id: str
    brand_name: str
    msrp_cents: int
    seller_price_cents: int
    seller_account_age_days: int
    is_high_risk_shipping_corridor: bool
    seller_historical_counterfeit_flags: int

class CounterfeitRiskScoringEngine:
    def evaluate_risk(self, s: ListingRiskSignals) -> Dict[str, any]:
        price_discount_pct = (1.0 - (s.seller_price_cents / s.msrp_cents)) * 100.0
        risk_score = 0.0

        # Extreme discount on premium brands
        if price_discount_pct >= 70.0:
            risk_score += 45.0
        elif price_discount_pct >= 50.0:
            risk_score += 25.0

        # Account age risk
        if s.seller_account_age_days <= 14:
            risk_score += 30.0
        elif s.seller_account_age_days <= 60:
            risk_score += 15.0

        # Shipping origin corridor
        if s.is_high_risk_shipping_corridor:
            risk_score += 15.0

        # Prior violations
        risk_score += s.seller_historical_counterfeit_flags * 20.0

        risk_score = min(risk_score, 100.0)

        decision = "AUTO_QUARANTINE_COUNTERFEIT_INTERCEPTION" if risk_score >= 65.0 else (
            "MANUAL_AUTHENTICATION_INSPECTION_HOLD" if risk_score >= 40.0 else "APPROVED_ACTIVE_LISTING"
        )

        return {
            "listing_id": s.listing_id,
            "risk_score": round(risk_score, 1),
            "discount_pct": round(price_discount_pct, 1),
            "decision": decision
        }

engine = CounterfeitRiskScoringEngine()
s1 = ListingRiskSignals("LST-9901", "LuxuryTime", 500_000, 480_000, 365, False, 0)
s2 = ListingRiskSignals("LST-9902", "LuxuryTime", 500_000, 95_000, 5, True, 1)

r1 = engine.evaluate_risk(s1)
r2 = engine.evaluate_risk(s2)

print(f"Listing 1 (Legitimate): Risk={r1['risk_score']} | Decision: [{r1['decision']}]")
print(f"Listing 2 (Suspicious): Risk={r2['risk_score']} | Decision: [{r2['decision']}]")'''

p1_output = '''Listing 1 (Legitimate): Risk=0.0 | Decision: [APPROVED_ACTIVE_LISTING]
Listing 2 (Suspicious): Risk=100.0 | Decision: [AUTO_QUARANTINE_COUNTERFEIT_INTERCEPTION]'''

# Part 2 Code
p2_code = '''from dataclasses import dataclass
from typing import List, Dict

@dataclass
class ProductReviewEvent:
    review_id: str
    reviewer_account_id: str
    star_rating: int
    is_verified_purchase: bool
    review_text: str
    submission_age_minutes: int

class ReviewFraudDetectionEngine:
    def analyze_review_cluster(self, reviews: List[ProductReviewEvent]) -> Dict[str, any]:
        total_reviews = len(reviews)
        unverified_count = sum(1 for r in reviews if not r.is_verified_purchase)
        unverified_ratio = (unverified_count / total_reviews) if total_reviews else 0.0

        # Burst velocity: reviews submitted within 60 minutes
        recent_burst_count = sum(1 for r in reviews if r.submission_age_minutes <= 60)
        burst_ratio = (recent_burst_count / total_reviews) if total_reviews else 0.0

        # Repetitive template text detection
        texts = [r.review_text.strip().lower() for r in reviews]
        unique_texts = set(texts)
        text_duplication_rate = 1.0 - (len(unique_texts) / total_reviews) if total_reviews else 0.0

        is_brushing_detected = (unverified_ratio >= 0.5 and burst_ratio >= 0.6) or (text_duplication_rate >= 0.4)

        return {
            "total_reviews": total_reviews,
            "unverified_ratio_pct": round(unverified_ratio * 100.0, 1),
            "burst_ratio_pct": round(burst_ratio * 100.0, 1),
            "text_duplication_pct": round(text_duplication_rate * 100.0, 1),
            "fraud_verdict": "BRUSHING_SYNDICATE_CONFIRMED" if is_brushing_detected else "ORGANIC_REVIEW_PROFILE"
        }

engine = ReviewFraudDetectionEngine()
cluster_bad = [
    ProductReviewEvent("REV-1", "USR-A", 5, False, "Great product amazing quality!", 15),
    ProductReviewEvent("REV-2", "USR-B", 5, False, "Great product amazing quality!", 20),
    ProductReviewEvent("REV-3", "USR-C", 5, False, "Great product amazing quality!", 25),
    ProductReviewEvent("REV-4", "USR-D", 5, True, "Satisfied with purchase", 30),
]
res = engine.analyze_review_cluster(cluster_bad)

print(f"Review Cluster Audit:")
print(f"  Unverified Purchases: {res['unverified_ratio_pct']}%")
print(f"  Burst Velocity:       {res['burst_ratio_pct']}%")
print(f"  Text Duplication:     {res['text_duplication_pct']}%")
print(f"  Fraud Verdict:        [{res['fraud_verdict']}]")'''

p2_output = '''Review Cluster Audit:
  Unverified Purchases: 75.0%
  Burst Velocity:       100.0%
  Text Duplication:     50.0%
  Fraud Verdict:        [BRUSHING_SYNDICATE_CONFIRMED]'''

# Part 3 Code
p3_code = '''from dataclasses import dataclass
from typing import Dict, Tuple

@dataclass
class TakedownNotice:
    notice_id: str
    ip_owner_entity: str
    target_listing_id: str
    trademark_registration_number: str
    sworn_infringement_declaration: bool

class NoticeAndTakedownComplianceGate:
    def process_takedown_notice(self, notice: TakedownNotice) -> Dict[str, any]:
        if not notice.sworn_infringement_declaration or not notice.trademark_registration_number:
            return {"status": "REJECTED_DEFICIENT_NOTICE", "action_taken": "NONE"}

        return {
            "notice_id": notice.notice_id,
            "target_listing_id": notice.target_listing_id,
            "status": "APPROVED_EXPEDITED_TAKEDOWN",
            "action_taken": "LISTING_SUSPENDED_AND_COUNTER_NOTICE_WINDOW_OPENED",
            "statutory_counter_notice_days": 14,
            "safe_harbor_preserved": True
        }

gate = NoticeAndTakedownComplianceGate()
notice = TakedownNotice("NTD-2026-001", "Global Brand Protection Corp", "LST-FAKEOFFER-88", "USPTO-778899", True)
res = gate.process_takedown_notice(notice)

print(f"Takedown Notice Processing: Status: [{res['status']}]")
print(f"  Action Executed:    [{res['action_taken']}]")
print(f"  Counter-Notice Window: {res['statutory_counter_notice_days']} days | Safe Harbor: {res['safe_harbor_preserved']}")'''

p3_output = '''Takedown Notice Processing: Status: [APPROVED_EXPEDITED_TAKEDOWN]
  Action Executed:    [LISTING_SUSPENDED_AND_COUNTER_NOTICE_WINDOW_OPENED]
  Counter-Notice Window: 14 days | Safe Harbor: True'''

# Part 4 Code
p4_code = '''import hmac
import hashlib
from dataclasses import dataclass
from typing import Dict

@dataclass
class DigitalProductPassport:
    serial_number: str
    brand_id: str
    manufacturing_timestamp: str
    cryptographic_signature: str

class CryptographicProvenanceVerifier:
    def __init__(self, brand_master_key: str):
        self.brand_master_key = brand_master_key.encode('utf-8')

    def generate_authentic_signature(self, serial: str, brand: str, timestamp: str) -> str:
        payload = f"{serial}|{brand}|{timestamp}".encode('utf-8')
        return hmac.new(self.brand_master_key, payload, hashlib.sha256).hexdigest()

    def verify_authenticity_certificate(self, passport: DigitalProductPassport) -> Dict[str, any]:
        expected_sig = self.generate_authentic_signature(
            passport.serial_number, passport.brand_id, passport.manufacturing_timestamp
        )
        is_authentic = hmac.compare_digest(expected_sig, passport.cryptographic_signature)
        return {
            "serial_number": passport.serial_number,
            "brand": passport.brand_id,
            "is_authentic": is_authentic,
            "provenance_status": "AUTHENTIC_OEM_VERIFIED" if is_authentic else "FRAUDULENT_COUNTERFEIT_CERTIFICATE"
        }

verifier = CryptographicProvenanceVerifier("MASTER_SECRET_BRAND_KEY_2026")
valid_sig = verifier.generate_authentic_signature("SER-LUX-99881", "SWISS_TIME", "2026-10-01T08:00:00Z")

p_real = DigitalProductPassport("SER-LUX-99881", "SWISS_TIME", "2026-10-01T08:00:00Z", valid_sig)
p_fake = DigitalProductPassport("SER-LUX-99881", "SWISS_TIME", "2026-10-01T08:00:00Z", "deadbeef12345678")

v_real = verifier.verify_authenticity_certificate(p_real)
v_fake = verifier.verify_authenticity_certificate(p_fake)

print(f"Passport 1 (Real): Authentic={v_real['is_authentic']} | Status: [{v_real['provenance_status']}]")
print(f"Passport 2 (Fake): Authentic={v_fake['is_authentic']} | Status: [{v_fake['provenance_status']}]")'''

p4_output = '''Passport 1 (Real): Authentic=True | Status: [AUTHENTIC_OEM_VERIFIED]
Passport 2 (Fake): Authentic=False | Status: [FRAUDULENT_COUNTERFEIT_CERTIFICATE]'''

# Part 5 Code
p5_code = '''from dataclasses import dataclass
from typing import Dict

@dataclass
class TrustAndSafetyFleetMetrics:
    total_screened_listings: int
    quarantined_counterfeit_attempts: int
    brushing_rings_neutralized: int
    notice_takedown_avg_resolution_hours: float
    consumer_fraud_dispute_rate_pct: float

class TrustAndSafetyObservatoryAuditor:
    def audit_ecosystem_trust(self, m: TrustAndSafetyFleetMetrics) -> Dict[str, any]:
        score = 0.0
        score += 35.0 if m.consumer_fraud_dispute_rate_pct <= 0.15 else 15.0
        score += 35.0 if m.notice_takedown_avg_resolution_hours <= 4.0 else 15.0
        score += 30.0 if m.brushing_rings_neutralized >= 50 else 10.0

        return {
            "screened_listings": m.total_screened_listings,
            "counterfeits_blocked": m.quarantined_counterfeit_attempts,
            "brushing_rings_neutralized": m.brushing_rings_neutralized,
            "takedown_resolution_hours": m.notice_takedown_avg_resolution_hours,
            "fraud_dispute_rate_pct": m.consumer_fraud_dispute_rate_pct,
            "trust_score": round(score, 1),
            "status": "APEX_TRUSTED_MARKETPLACE_ACCREDITED" if score == 100.0 else "TRUST_REMEDIATION_REQUIRED"
        }

auditor = TrustAndSafetyObservatoryAuditor()
audit = auditor.audit_ecosystem_trust(TrustAndSafetyFleetMetrics(
    total_screened_listings=1_250_000,
    quarantined_counterfeit_attempts=14_200,
    brushing_rings_neutralized=85,
    notice_takedown_avg_resolution_hours=2.4,
    consumer_fraud_dispute_rate_pct=0.08
))

print(f"Enterprise Trust & Safety Observatory Audit:")
print(f"  Screened Listings:       {audit['screened_listings']:,}")
print(f"  Counterfeits Blocked:    {audit['counterfeits_blocked']:,}")
print(f"  Brushing Rings Busted:   {audit['brushing_rings_neutralized']}")
print(f"  Takedown Resolution:     {audit['takedown_resolution_hours']} hours")
print(f"  Consumer Fraud Disputes: {audit['fraud_dispute_rate_pct']}%")
print(f"  Ecosystem Trust Score:   {audit['trust_score']}/100.0")
print(f"  Accreditation Status:    [{audit['status']}]")'''

p5_output = '''Enterprise Trust & Safety Observatory Audit:
  Screened Listings:       1,250,000
  Counterfeits Blocked:    14,200
  Brushing Rings Busted:   85
  Takedown Resolution:     2.4 hours
  Consumer Fraud Disputes: 0.08%
  Ecosystem Trust Score:   100.0/100.0
  Accreditation Status:    [APEX_TRUSTED_MARKETPLACE_ACCREDITED]'''

print("Day 59 Python Code Snippets Setup Complete.")
