"""
Test and generate deterministic outputs for Course 07 Day 54 (Cross-Border Consumer Rights, Reverse Logistics & GDPR)
"""
import json
import math
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Tuple

print("=== PART 1: EU 14-DAY COOLING-OFF & CONSUMER RIGHTS ENGINE ===")
# Part 1 Code: Statutory right of withdrawal evaluator enforcing EU Consumer Rights Directive

@dataclass
class ReturnEligibilityRequest:
    order_id: str
    country_iso: str
    delivery_timestamp_sec: int
    return_request_timestamp_sec: int
    product_category: str
    is_unsealed_hygiene_item: bool

class StatutoryReturnPolicyEngine:
    def evaluate_withdrawal_right(self, req: ReturnEligibilityRequest) -> Tuple[bool, str]:
        days_since_delivery = (req.return_request_timestamp_sec - req.delivery_timestamp_sec) / 86400.0
        
        # EU / UK statutory 14-day cooling-off rule
        if req.country_iso in ["DE", "FR", "NL", "IT", "GB", "ES"]:
            if req.is_unsealed_hygiene_item:
                return False, "EXEMPT_HYGIENE_UNSEALED_NON_RETURNABLE"
            if req.product_category == "CUSTOM_PERSONALIZED_GOODS":
                return False, "EXEMPT_BESPOKE_MANUFACTURE_NON_RETURNABLE"
            if days_since_delivery <= 14.0:
                return True, "STATUTORY_14_DAY_COOLING_OFF_MANDATORY_REFUND"
            else:
                return False, "STATUTORY_COOLING_OFF_WINDOW_EXPIRED"
        return days_since_delivery <= 30.0, "COMMERCIAL_30_DAY_STANDARD_RETURN"

policy = StatutoryReturnPolicyEngine()
base_delivery = 1000000

# Day 8 return on standard apparel in Germany
req_de = ReturnEligibilityRequest("ORD-DE-881", "DE", base_delivery, base_delivery + (8 * 86400), "APPAREL", False)
# Day 5 return on unsealed cosmetics
req_cosmetics = ReturnEligibilityRequest("ORD-FR-112", "FR", base_delivery, base_delivery + (5 * 86400), "COSMETICS", True)

ok_de, msg_de = policy.evaluate_withdrawal_right(req_de)
ok_cos, msg_cos = policy.evaluate_withdrawal_right(req_cosmetics)

print(f"German Customer Return: Eligible={ok_de} | Statutory Verdict: [{msg_de}]")
print(f"French Cosmetic Return: Eligible={ok_cos} | Statutory Verdict: [{msg_cos}]")


print("\n=== PART 2: CROSS-BORDER REVERSE LOGISTICS & DUTY DRAWBACK ===")
# Part 2 Code: Reverse logistics customs drawback calculator recovering duties on returned goods

@dataclass
class ExportReturnRecord:
    return_rma: str
    original_customs_entry_id: str
    paid_duty_usd_cents: int
    paid_vat_usd_cents: int
    is_physically_re_exported: bool

class DutyDrawbackManager:
    def calculate_customs_drawback_recovery(self, record: ExportReturnRecord) -> Tuple[int, int, str]:
        # Under US CBP / EU customs drawback rules, up to 99% of import duties can be refunded upon re-export
        if not record.is_physically_re_exported:
            return 0, 0, "MERCHANDISE_NOT_RE_EXPORTED_DRAWBACK_INELIGIBLE"
        refundable_duty = int(round(record.paid_duty_usd_cents * 0.99))
        refundable_vat = record.paid_vat_usd_cents # 100% VAT reclaimable via statutory tax return
        return refundable_duty, refundable_vat, "CBP_FORM_7551_DRAWBACK_QUALIFIED"

drawback = DutyDrawbackManager()
rec = ExportReturnRecord("RMA-90214", "CBP-ENTRY-884210", 18500, 42000, True) # $185 duty, $420 VAT
ref_duty, ref_vat, status_draw = drawback.calculate_customs_drawback_recovery(rec)

print(f"Duty Drawback Recovery: RMA: {rec.return_rma} | Entry: {rec.original_customs_entry_id}")
print(f"  Refundable Customs Duty (99%): ${ref_duty/100:.2f} USD")
print(f"  Refundable Import VAT (100%):  ${ref_vat/100:.2f} USD")
print(f"  Total Recovered Tax Capital:   ${(ref_duty + ref_vat)/100:.2f} USD [{status_draw}]")


print("\n=== PART 3: GDPR / CCPA PRIVACY COMPLIANCE & CONSENT GATE ===")
# Part 3 Code: Regional privacy compliance validator managing cross-border data transfer safeguards

class PrivacyJurisdiction(Enum):
    GDPR_EU = "GDPR_EU"
    CCPA_CALIFORNIA = "CCPA_CALIFORNIA"
    PIPEDA_CANADA = "PIPEDA_CANADA"
    GENERAL_REST_OF_WORLD = "GENERAL_ROW"

@dataclass
class UserConsentContext:
    user_id: str
    country_iso: str
    opt_in_marketing: bool
    opt_in_analytics: bool
    accepted_scc_cross_border_transfer: bool

def validate_privacy_compliance(ctx: UserConsentContext) -> Tuple[bool, PrivacyJurisdiction, str]:
    if ctx.country_iso in ["DE", "FR", "NL", "IT", "GB", "ES"]:
        # GDPR requires explicit prior opt-in for analytics + valid Standard Contractual Clauses (SCC)
        if not ctx.accepted_scc_cross_border_transfer:
            return False, PrivacyJurisdiction.GDPR_EU, "VIOLATION_MISSING_STANDARD_CONTRACTUAL_CLAUSES"
        if not ctx.opt_in_analytics:
            return True, PrivacyJurisdiction.GDPR_EU, "COMPLIANT_STRICT_FUNCTIONAL_COOKIES_ONLY"
        return True, PrivacyJurisdiction.GDPR_EU, "COMPLIANT_FULL_CONSENT_GRANTED"
    elif ctx.country_iso == "US":
        return True, PrivacyJurisdiction.CCPA_CALIFORNIA, "COMPLIANT_OPT_OUT_MODEL_SUPPORTED"
    return True, PrivacyJurisdiction.GENERAL_REST_OF_WORLD, "COMPLIANT_DEFAULT_PRIVACY"

ctx_eu_valid = UserConsentContext("usr_berlin_9", "DE", False, True, True)
ctx_eu_invalid = UserConsentContext("usr_paris_4", "FR", False, True, False)

ok_eu, jur_eu, note_eu = validate_privacy_compliance(ctx_eu_valid)
ok_bad, jur_bad, note_bad = validate_privacy_compliance(ctx_eu_invalid)

print(f"EU User 1 Audit: Compliant={ok_eu} | Jurisdiction: {jur_eu.value} | Status: [{note_eu}]")
print(f"EU User 2 Audit: Compliant={ok_bad} | Jurisdiction: {jur_bad.value} | Status: [{note_bad}]")


print("\n=== PART 4: LOCALIZATION ENGINEERING: RTL & BIDIRECTIONAL TEXT ===")
# Part 4 Code: Locale-aware text formatter handling Arabic/Hebrew RTL and numeric formatting

@dataclass
class LocalizedFormattingRule:
    locale_code: str
    is_right_to_left: bool
    currency_symbol_position: str # PREFIX or SUFFIX
    decimal_separator: str
    thousands_separator: str

class InternationalizationEngine:
    def __init__(self):
        self.rules: Dict[str, LocalizedFormattingRule] = {}

    def register_rule(self, rule: LocalizedFormattingRule):
        self.rules[rule.locale_code] = rule

    def format_localized_currency(self, amount_float: float, currency_symbol: str, locale: str) -> str:
        r = self.rules.get(locale, LocalizedFormattingRule(locale, False, "PREFIX", ".", ","))
        int_part = int(math.floor(amount_float))
        dec_part = int(round((amount_float - int_part) * 100))
        
        # Format integer with thousands separator
        formatted_int = f"{int_part:,}".replace(",", r.thousands_separator)
        formatted_num = f"{formatted_int}{r.decimal_separator}{dec_part:02d}"
        
        if r.currency_symbol_position == "PREFIX":
            out = f"{currency_symbol}{formatted_num}"
        else:
            out = f"{formatted_num} {currency_symbol}"
            
        if r.is_right_to_left:
            out = f"[RTL_ISOLATE]{out}[/RTL_ISOLATE]"
        return out

i18n = InternationalizationEngine()
i18n.register_rule(LocalizedFormattingRule("en-US", False, "PREFIX", ".", ","))
i18n.register_rule(LocalizedFormattingRule("de-DE", False, "SUFFIX", ",", "."))
i18n.register_rule(LocalizedFormattingRule("ar-AE", True, "SUFFIX", ".", ","))

val = 14250.75
print(f"US Formatted:     {i18n.format_localized_currency(val, '$', 'en-US')}")
print(f"German Formatted: {i18n.format_localized_currency(val, 'EUR', 'de-DE')}")
print(f"Arabic Formatted: {i18n.format_localized_currency(val, 'AED', 'ar-AE')}")


print("\n=== PART 5: ENTERPRISE GLOBAL GOVERNANCE COMMAND TOWER ===")
# Part 5 Code: Global governance command tower auditing privacy consent, returns recovery, and localized CSAT

@dataclass
class GlobalGovernanceMetrics:
    total_cross_border_orders: int
    gdpr_consent_audit_compliance_pct: float
    duty_drawback_capital_recovered_usd: float
    localized_checkout_csat_score: float # 0.0 to 5.0 scale
    cross_border_return_processing_days: float

def audit_global_governance_tower(m: GlobalGovernanceMetrics) -> Dict[str, float]:
    score = 0.0
    score += 35.0 if m.gdpr_consent_audit_compliance_pct >= 99.5 else 20.0
    score += min(35.0, (m.duty_drawback_capital_recovered_usd / 800_000.0) * 35.0)
    score += min(30.0, (m.localized_checkout_csat_score / 4.8) * 30.0)
    
    return {
        "orders_audited": float(m.total_cross_border_orders),
        "gdpr_compliance_pct": m.gdpr_consent_audit_compliance_pct,
        "drawback_recovered_usd": m.duty_drawback_capital_recovered_usd,
        "csat_score": m.localized_checkout_csat_score,
        "return_cycle_days": m.cross_border_return_processing_days,
        "composite_score": round(score, 2),
        "status": "APEX_GLOBAL_GOVERNANCE_CERTIFIED" if score >= 90.0 else "SUBOPTIMAL"
    }

fleet = GlobalGovernanceMetrics(
    total_cross_border_orders=220_000,
    gdpr_consent_audit_compliance_pct=99.9,
    duty_drawback_capital_recovered_usd=845_000.0,
    localized_checkout_csat_score=4.88,
    cross_border_return_processing_days=3.4
)

audit = audit_global_governance_tower(fleet)
print(f"Global Governance Fleet Audited: Orders: {audit['orders_audited']:,.0f}")
print(f"GDPR / CCPA Consent Compliance:  {audit['gdpr_compliance_pct']}% (Target >= 99.5%)")
print(f"Duty Drawback Capital Reclaimed: ${audit['drawback_recovered_usd']:,.2f}")
print(f"Localized Customer CSAT Score:   {audit['csat_score']}/5.00 (Target >= 4.80)")
print(f"Reverse Return Turnaround Time:  {audit['return_cycle_days']} days (Target < 5.0d)")
print(f"Composite Governance Score:      {audit['composite_score']}/100.0 pts")
print(f"Accreditation Status:            [{audit['status']}]")
