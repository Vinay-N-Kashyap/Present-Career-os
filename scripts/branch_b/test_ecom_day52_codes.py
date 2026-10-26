"""
Test and generate deterministic outputs for Course 07 Day 52 (International Trade Compliance & Landed Cost Engine)
"""
import json
import math
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

print("=== PART 1: TOTAL LANDED COST CALCULATION ENGINE ===")
# Part 1 Code: Total Landed Cost calculation engine incorporating CIF valuation and compound import taxes

@dataclass
class LineItemValuation:
    sku: str
    hs_code: str
    item_price_usd_cents: int
    quantity: int
    weight_kg: float
    duty_rate_pct: float
    import_vat_pct: float

@dataclass
class LandedCostBreakdown:
    subtotal_cents: int
    allocated_freight_cents: int
    insurance_cents: int
    cif_value_cents: int
    customs_duty_cents: int
    import_vat_cents: int
    brokerage_disbursement_cents: int
    total_landed_cost_cents: int

class LandedCostEngine:
    def calculate_item_landed_cost(
        self, 
        item: LineItemValuation, 
        freight_per_kg_cents: int = 450, 
        insurance_rate_pct: float = 0.50,
        flat_brokerage_cents: int = 1500
    ) -> LandedCostBreakdown:
        subtotal = item.item_price_usd_cents * item.quantity
        freight = int(round(item.weight_kg * item.quantity * freight_per_kg_cents))
        insurance = int(round(subtotal * (insurance_rate_pct / 100.0)))
        # CIF = Cost, Insurance, and Freight (standard WTO valuation basis)
        cif_value = subtotal + freight + insurance
        
        # Duty calculated on CIF
        duty = int(round(cif_value * (item.duty_rate_pct / 100.0)))
        # Import VAT calculated on (CIF + Duty)
        taxable_base = cif_value + duty
        vat = int(round(taxable_base * (item.import_vat_pct / 100.0)))
        
        total = subtotal + freight + insurance + duty + vat + flat_brokerage_cents
        return LandedCostBreakdown(subtotal, freight, insurance, cif_value, duty, vat, flat_brokerage_cents, total)

engine = LandedCostEngine()
item = LineItemValuation("LEATHER_BOOTS", "6403.91.00", 18000, 1, 1.8, 8.0, 20.0) # $180, 8% duty, 20% UK VAT
cost = engine.calculate_item_landed_cost(item)

print(f"Landed Cost Analysis: SKU: {item.sku} (HS: {item.hs_code})")
print(f"  Merchandise Subtotal:    ${cost.subtotal_cents/100:.2f} USD")
print(f"  Freight & Insurance:     ${(cost.allocated_freight_cents + cost.insurance_cents)/100:.2f} USD")
print(f"  CIF Valuation:           ${cost.cif_value_cents/100:.2f} USD")
print(f"  Customs Duty (8.0%):     ${cost.customs_duty_cents/100:.2f} USD")
print(f"  Import VAT (20.0%):      ${cost.import_vat_cents/100:.2f} USD")
print(f"  Carrier Brokerage Fee:   ${cost.brokerage_disbursement_cents/100:.2f} USD")
print(f"  Total Fully Landed Cost: ${cost.total_landed_cost_cents/100:.2f} USD")


print("\n=== PART 2: HARMONIZED TARIFF SCHEDULE (HTS) CLASSIFIER ===")
# Part 2 Code: Multi-tier HS code resolver mapping 6-digit WCO codes to 10-digit national tariff lines

@dataclass
class NationalTariffLine:
    full_hts_code: str
    country_iso: str
    description: str
    general_duty_rate_pct: float
    preferential_trade_agreement: Optional[str]
    preferential_duty_rate_pct: Optional[float]

class HTSClassificationRegistry:
    def __init__(self):
        self.tariffs: Dict[Tuple[str, str], NationalTariffLine] = {}

    def register_tariff(self, line: NationalTariffLine):
        self.tariffs[(line.country_iso, line.full_hts_code)] = line

    def resolve_applicable_duty(self, country_iso: str, hts_code: str, origin_country_iso: str) -> Tuple[float, str]:
        line = self.tariffs.get((country_iso, hts_code))
        if not line:
            return 10.0, "DEFAULT_STATUTORY_TARIFF"
        # Check preferential free trade agreement (e.g. USMCA / EU-UK TCA)
        if line.preferential_trade_agreement and origin_country_iso == "MX" and country_iso == "US":
            return line.preferential_duty_rate_pct, f"QUALIFIED_PREFERENTIAL_{line.preferential_trade_agreement}"
        return line.general_duty_rate_pct, "GENERAL_MFN_DUTY_RATE"

registry = HTSClassificationRegistry()
registry.register_tariff(NationalTariffLine("6109.10.00.12", "US", "Cotton T-Shirts, Men's Knitted", 16.5, "USMCA", 0.0))
registry.register_tariff(NationalTariffLine("8517.13.00.00", "US", "Smartphones & Cellular Transceivers", 0.0, "ITA_AGREEMENT", 0.0))

duty_mfn, regime_mfn = registry.resolve_applicable_duty("US", "6109.10.00.12", "VN") # Vietnam -> MFN
duty_usmca, regime_usmca = registry.resolve_applicable_duty("US", "6109.10.00.12", "MX") # Mexico -> USMCA

print(f"HTS: 6109.10.00.12 (Vietnam Origin): Duty: {duty_mfn}% | Regime: [{regime_mfn}]")
print(f"HTS: 6109.10.00.12 (Mexico Origin):  Duty: {duty_usmca}% | Regime: [{regime_usmca}]")


print("\n=== PART 3: INCOTERMS 2020: DDP VS DDU (DAP) DECISION ROUTER ===")
# Part 3 Code: Incoterms checkout decision engine ensuring seamless DDP customs clearance

@dataclass
class IncotermQuote:
    shipping_incoterm: str # DDP or DAP (DDU)
    upfront_collected_duties_cents: int
    upfront_collected_taxes_cents: int
    doorstep_delivery_surprise_fee_cents: int
    customer_experience_risk: str

def evaluate_incoterm_strategy(allow_dap: bool, landed_cost: LandedCostBreakdown) -> IncotermQuote:
    if not allow_dap: # Enforce Delivered Duty Paid (DDP)
        return IncotermQuote(
            shipping_incoterm="DDP",
            upfront_collected_duties_cents=landed_cost.customs_duty_cents,
            upfront_collected_taxes_cents=landed_cost.import_vat_cents,
            doorstep_delivery_surprise_fee_cents=0,
            customer_experience_risk="ZERO_DOORSTEP_FRICTION"
        )
    else: # Delivered at Place (DAP / DDU)
        # In DAP, duties/taxes collected by carrier upon arrival + carrier disbursement surcharge
        return IncotermQuote(
            shipping_incoterm="DAP",
            upfront_collected_duties_cents=0,
            upfront_collected_taxes_cents=0,
            doorstep_delivery_surprise_fee_cents=landed_cost.customs_duty_cents + landed_cost.import_vat_cents + 1500,
            customer_experience_risk="HIGH_RETURN_REFUSAL_RISK"
        )

quote_ddp = evaluate_incoterm_strategy(False, cost)
quote_dap = evaluate_incoterm_strategy(True, cost)

print(f"Strategy DDP (Recommended): Upfront Duty/Tax: ${(quote_ddp.upfront_collected_duties_cents + quote_ddp.upfront_collected_taxes_cents)/100:.2f} | Doorstep Surprise: ${quote_ddp.doorstep_delivery_surprise_fee_cents/100:.2f} [{quote_ddp.customer_experience_risk}]")
print(f"Strategy DAP (Legacy DDU):  Upfront Duty/Tax: ${(quote_dap.upfront_collected_duties_cents + quote_dap.upfront_collected_taxes_cents)/100:.2f} | Doorstep Surprise: ${quote_dap.doorstep_delivery_surprise_fee_cents/100:.2f} [{quote_dap.customer_experience_risk}]")


print("\n=== PART 4: AUTOMATED COMMERCIAL INVOICE & EEI FILING GENERATOR ===")
# Part 4 Code: Automated commercial invoice manifest and AES Direct Electronic Export Information (EEI) generator

@dataclass
class CommercialInvoiceManifest:
    invoice_number: str
    export_country: str
    import_country: str
    incoterm: str
    currency: str
    total_customs_declared_value_usd: float
    requires_eei_filing: bool

def generate_customs_documentation(order_id: str, dest_country: str, total_usd: float) -> CommercialInvoiceManifest:
    # Under US Census Bureau / CBP rules, shipments with commodity value > $2,500 require mandatory EEI filing
    requires_eei = (total_usd > 2500.0) and (dest_country != "CA") # Canada exempt under USMCA except licensable goods
    inv_num = f"CI-{order_id}-EXP"
    return CommercialInvoiceManifest(inv_num, "US", dest_country, "DDP", "USD", total_usd, requires_eei)

inv1 = generate_customs_documentation("ORD-1092", "GB", 450.0)
inv2 = generate_customs_documentation("ORD-9942", "DE", 3400.0)

print(f"Customs Doc {inv1.invoice_number}: Dest: {inv1.import_country} | Declared: ${inv1.total_customs_declared_value_usd:.2f} | AES EEI Required: {inv1.requires_eei_filing}")
print(f"Customs Doc {inv2.invoice_number}: Dest: {inv2.import_country} | Declared: ${inv2.total_customs_declared_value_usd:.2f} | AES EEI Required: {inv2.requires_eei_filing}")


print("\n=== PART 5: ENTERPRISE TRADE COMPLIANCE COMMAND TOWER ===")
# Part 5 Code: Trade compliance audit tracking denied party screening and landed cost precision

@dataclass
class TradeComplianceMetrics:
    total_international_consignments: int
    denied_party_hits_blocked: int
    landed_cost_variance_rate_bps: float # Variance between quoted and actual customs billing (Target < 25 bps)
    ddp_clearance_success_pct: float
    customs_hold_rate_pct: float

def audit_trade_compliance_tower(m: TradeComplianceMetrics) -> Dict[str, float]:
    score = 0.0
    score += min(35.0, (m.ddp_clearance_success_pct / 99.0) * 35.0)
    score += 35.0 if m.landed_cost_variance_rate_bps <= 20.0 else 20.0
    score += 30.0 if m.customs_hold_rate_pct <= 0.50 else 15.0
    
    return {
        "consignments": float(m.total_international_consignments),
        "blocked_screenings": float(m.denied_party_hits_blocked),
        "ddp_success_pct": m.ddp_clearance_success_pct,
        "variance_bps": m.landed_cost_variance_rate_bps,
        "customs_hold_pct": m.customs_hold_rate_pct,
        "composite_score": round(score, 2),
        "status": "APEX_TRADE_COMPLIANCE_CERTIFIED" if score >= 90.0 else "SUBOPTIMAL"
    }

fleet = TradeComplianceMetrics(
    total_international_consignments=185_000,
    denied_party_hits_blocked=42,
    landed_cost_variance_rate_bps=12.5,
    ddp_clearance_success_pct=99.6,
    customs_hold_rate_pct=0.18
)

audit = audit_trade_compliance_tower(fleet)
print(f"Trade Fleet Audited: Consignments: {audit['consignments']:,.0f} shipments")
print(f"Denied Parties Neutralized:        {audit['blocked_screenings']:,.0f} hits (OFAC / BIS lists)")
print(f"DDP Customs Clearance Rate:        {audit['ddp_success_pct']}% (Target >= 99.0%)")
print(f"Landed Cost Quote Variance:        {audit['variance_bps']} bps (Target <= 20.0 bps)")
print(f"Customs Regulatory Hold Rate:      {audit['customs_hold_pct']}% (Target <= 0.50%)")
print(f"Composite Architecture Score:      {audit['composite_score']}/100.0 pts")
print(f"Accreditation Status:              [{audit['status']}]")
