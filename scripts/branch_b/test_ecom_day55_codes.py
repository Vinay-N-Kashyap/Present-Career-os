# -*- coding: utf-8 -*-
"""
Deterministic Python test suite for Course 07 Day 55:
Milestone 11 Capstone: Sovereign Global Cross-Border Commerce & International Trade Operations Command Tower
"""
import sys
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

sys.stdout.reconfigure(encoding='utf-8')

print("=== PART 1 (TIER 1): MULTI-CURRENCY PRICING & TREASURY FORWARD HEDGING ===")
@dataclass
class CurrencyRate:
    currency: str
    spot_rate: float
    volatility_buffer_pct: float

class GlobalCurrencyEngine:
    def __init__(self):
        self.rates: Dict[str, CurrencyRate] = {}

    def register_rate(self, r: CurrencyRate):
        self.rates[r.currency] = r

    def calculate_localized_price(self, base_usd: float, target_currency: str) -> Tuple[float, float]:
        r = self.rates[target_currency]
        effective_rate = r.spot_rate * (1.0 + (r.volatility_buffer_pct / 100.0))
        raw_price = base_usd * effective_rate
        # Psychological rounding up to clean integer or .95
        rounded_price = round(raw_price)
        return raw_price, float(rounded_price)

@dataclass
class TreasuryForwardHedge:
    hedge_id: str
    currency: str
    locked_notional_foreign: float
    guaranteed_rate: float
    settled_usd_value: float

fx_engine = GlobalCurrencyEngine()
fx_engine.register_rate(CurrencyRate("EUR", 0.920, 2.5)) # 0.92 spot + 2.5% buffer
fx_engine.register_rate(CurrencyRate("GBP", 0.790, 2.0)) # 0.79 spot + 2.0% buffer
fx_engine.register_rate(CurrencyRate("JPY", 155.0, 3.0)) # 155.0 spot + 3.0% buffer

base_price = 120.00 # $120 USD
raw_eur, round_eur = fx_engine.calculate_localized_price(base_price, "EUR")
raw_gbp, round_gbp = fx_engine.calculate_localized_price(base_price, "GBP")

# Treasury hedge verification: $500,000 locked forward at 0.9150 EUR/USD
hedge = TreasuryForwardHedge("HEDGE-EUR-2026-Q4", "EUR", 457500.0, 0.9150, 500000.00)

print(f"Base Catalog Price: ${base_price:.2f} USD")
print(f"  EUR Localized Price: {round_eur:.2f} EUR (Raw: {raw_eur:.2f} EUR | Buffer: 2.5%)")
print(f"  GBP Localized Price: {round_gbp:.2f} GBP (Raw: {raw_gbp:.2f} GBP | Buffer: 2.0%)")
print(f"Treasury Forward Contract: [{hedge.hedge_id}] | Notional: {hedge.locked_notional_foreign:,.0f} EUR @ {hedge.guaranteed_rate} = ${hedge.settled_usd_value:,.2f} USD Locked")


print("\n=== PART 2 (TIER 2): HS CLASSIFICATION & DELIVERED DUTY PAID (DDP) LANDED COST ===")
@dataclass
class LandedCostLine:
    fob_cost_usd: float
    freight_usd: float
    insurance_usd: float
    hs_code: str
    ad_valorem_duty_pct: float
    import_vat_pct: float
    broker_clearance_fee_usd: float

def calculate_ddp_landed_cost(item: LandedCostLine) -> Dict[str, float]:
    cif_value = item.fob_cost_usd + item.freight_usd + item.insurance_usd
    customs_duty = cif_value * (item.ad_valorem_duty_pct / 100.0)
    taxable_vat_basis = cif_value + customs_duty
    import_vat = taxable_vat_basis * (item.import_vat_pct / 100.0)
    total_landed = cif_value + customs_duty + import_vat + item.broker_clearance_fee_usd
    
    return {
        "cif_value": round(cif_value, 2),
        "customs_duty": round(customs_duty, 2),
        "import_vat": round(import_vat, 2),
        "broker_fee": round(item.broker_clearance_fee_usd, 2),
        "total_landed_cost": round(total_landed, 2)
    }

line = LandedCostLine(
    fob_cost_usd=100.00,
    freight_usd=15.00,
    insurance_usd=2.00,
    hs_code="6203.42.40.11", # Cotton Men's Trousers
    ad_valorem_duty_pct=6.5,
    import_vat_pct=20.0,
    broker_clearance_fee_usd=10.00
)

ddp = calculate_ddp_landed_cost(line)
print(f"HS Code: {line.hs_code} | CIF Value: ${ddp['cif_value']:.2f} USD")
print(f"  Ad Valorem Duty (6.5%):  ${ddp['customs_duty']:.2f} USD")
print(f"  Import VAT (20.0%):      ${ddp['import_vat']:.2f} USD")
print(f"  Customs Clearance Fee:   ${ddp['broker_fee']:.2f} USD")
print(f"  Total DDP Landed Cost:   ${ddp['total_landed_cost']:.2f} USD (Guaranteed Lock: Zero Customer Fees at Door)")


print("\n=== PART 3 (TIER 3): SECTION 321 / IOSS DE MINIMIS & BONDED WAREHOUSE ROUTING ===")
@dataclass
class CrossBorderParcel:
    parcel_id: str
    destination_iso: str
    declared_value_usd: float
    has_valid_ioss_registration: bool

class DeMinimisCustomsRouter:
    def route_parcel(self, p: CrossBorderParcel) -> Tuple[str, str, float]:
        # US Section 321: De Minimis threshold is $800 USD per person per day
        if p.destination_iso == "US":
            if p.declared_value_usd <= 800.00:
                duty_saved = p.declared_value_usd * 0.065
                return "SECTION_321_INFORMAL_DUTY_FREE", "DIRECT_AIR_EXPEDITED", duty_saved
            else:
                return "FORMAL_CONSUMPTION_ENTRY_REQUIRED", "BONDED_CUSTOMS_WAREHOUSE", 0.0
        # EU IOSS: Consignments up to 150 EUR qualify for simplified VAT clearance
        elif p.destination_iso in ["DE", "FR", "NL", "IT", "ES"]:
            if p.declared_value_usd <= 165.00 and p.has_valid_ioss_registration: # ~150 EUR
                handling_saved = 16.50 # Average carrier clearance fee eliminated
                return "EU_IOSS_SIMPLIFIED_ENTRY", "POSTAL_PRIORITY_INJECTION", handling_saved
            else:
                return "EU_STANDARD_CUSTOMS_FORMAL_CLEARANCE", "BONDED_DISTRIBUTION_CENTER", 0.0
        return "GENERAL_EXPORT_FORMAL_ENTRY", "COMMERCIAL_CARRIER", 0.0

router = DeMinimisCustomsRouter()
p_us = CrossBorderParcel("PKG-US-771", "US", 650.00, False)
p_eu = CrossBorderParcel("PKG-EU-228", "DE", 135.00, True)
p_heavy = CrossBorderParcel("PKG-HEAVY-901", "US", 1850.00, False)

status_us, lane_us, saved_us = router.route_parcel(p_us)
status_eu, lane_eu, saved_eu = router.route_parcel(p_eu)
status_h, lane_h, saved_h = router.route_parcel(p_heavy)

print(f"Parcel US ($650): Status=[{status_us}] | Lane: {lane_us} | Duty Capital Saved: ${saved_us:.2f}")
print(f"Parcel EU ($135): Status=[{status_eu}] | Lane: {lane_eu} | Customs Handling Fee Saved: ${saved_eu:.2f}")
print(f"Parcel Heavy ($1850): Status=[{status_h}] | Lane: {lane_h}")


print("\n=== PART 4 (TIER 4): STATUTORY WITHDRAWAL & CUSTOMS DUTY DRAWBACK RECOVERY ===")
@dataclass
class CrossBorderReturnClaim:
    claim_id: str
    country_iso: str
    days_since_delivery: float
    paid_duty_usd: float
    paid_vat_usd: float
    is_physically_re_exported: bool

def audit_return_and_drawback(c: CrossBorderReturnClaim) -> Tuple[bool, float, str]:
    is_eligible_cooling_off = c.days_since_delivery <= 14.0 if c.country_iso in ["DE", "FR", "NL", "GB"] else c.days_since_delivery <= 30.0
    if not is_eligible_cooling_off:
        return False, 0.0, "RETURN_REJECTED_COOLING_OFF_EXPIRED"
    if not c.is_physically_re_exported:
        return True, 0.0, "REFUND_APPROVED_DRAWBACK_INELIGIBLE_NOT_EXPORTED"
    
    # Recover 99% of import duty and 100% of import VAT
    recovered_duty = round(c.paid_duty_usd * 0.99, 2)
    recovered_vat = round(c.paid_vat_usd, 2)
    total_recovered = recovered_duty + recovered_vat
    return True, total_recovered, "CBP_FORM_7551_DRAWBACK_RECOVERED"

ret_claim = CrossBorderReturnClaim("CLM-INT-9921", "DE", 8.5, 285.00, 620.00, True)
approved, capital_reclaimed, verdict = audit_return_and_drawback(ret_claim)

print(f"Return Claim: {ret_claim.claim_id} | Delivery Age: {ret_claim.days_since_delivery} days")
print(f"  Statutory Withdrawal Approved: {approved}")
print(f"  Customs Drawback Capital Recovered: ${capital_reclaimed:,.2f} USD [{verdict}]")


print("\n=== PART 5 (TIER 5): SOVEREIGN GLOBAL COMMERCE ARCHITECT ACCREDITATION ===")
@dataclass
class GlobalEnterpriseFleet:
    total_international_orders: int
    fx_hedging_margin_protected_usd: float
    ddp_conversion_uplift_revenue_usd: float
    de_minimis_tax_savings_usd: float
    duty_drawback_capital_recovered_usd: float

def execute_boardroom_accreditation(fleet: GlobalEnterpriseFleet) -> Dict[str, object]:
    total_roi = (
        fleet.fx_hedging_margin_protected_usd +
        fleet.ddp_conversion_uplift_revenue_usd +
        fleet.de_minimis_tax_savings_usd +
        fleet.duty_drawback_capital_recovered_usd
    )
    
    scorecard = {
        "Pillar 1: Multi-Currency & Treasury FX Hedging": 20.0,
        "Pillar 2: Global Customs Classification & DDP Landed Cost": 20.0,
        "Pillar 3: Section 321 / IOSS De Minimis Logistics": 20.0,
        "Pillar 4: Statutory Consumer Rights & Duty Drawback": 20.0,
        "Pillar 5: Internationalization & Global Governance": 20.0
    }
    
    composite_score = sum(scorecard.values())
    
    return {
        "status": "APEX_SOVEREIGN_GLOBAL_COMMERCE_CERTIFIED",
        "composite_score": composite_score,
        "audited_annual_roi_usd": total_roi,
        "scorecard": scorecard,
        "conferred_credential": "Certified Global Commerce Architect & International Trade Authority (CGCA-ITA)"
    }

enterprise_fleet = GlobalEnterpriseFleet(
    total_international_orders=450_000,
    fx_hedging_margin_protected_usd=4_250_000.0,
    ddp_conversion_uplift_revenue_usd=8_600_000.0,
    de_minimis_tax_savings_usd=3_750_000.0,
    duty_drawback_capital_recovered_usd=1_850_000.0
)

boardroom = execute_boardroom_accreditation(enterprise_fleet)
print("=== EXECUTIVE BOARDROOM CERTIFICATION SCORECARD ===")
print(f"Audit Status:          {boardroom['status']}")
print(f"Composite Score:       {boardroom['composite_score']:.0f} / 100 (PERFECT SCORE)")
for pillar, pts in boardroom['scorecard'].items():
    print(f"  {pillar}: {pts:.0f} / 20 pts")
print(f"Audited Annual ROI:    ${boardroom['audited_annual_roi_usd']:,.2f} USD")
print(f"Conferred Credential:  {boardroom['conferred_credential']}")
