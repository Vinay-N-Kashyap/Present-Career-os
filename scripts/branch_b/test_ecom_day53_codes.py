"""
Test and generate deterministic outputs for Course 07 Day 53 (Cross-Border Logistics, De Minimis & Bonded Warehousing)
"""
import json
import math
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Tuple

print("=== PART 1: DE MINIMIS VALUATION & IOSS CLEARANCE ENGINE ===")
# Part 1 Code: De Minimis threshold router and EU IOSS / UK VAT evaluator

@dataclass
class DeMinimisRule:
    country_iso: str
    duty_de_minimis_local: float
    tax_de_minimis_local: float
    currency: str
    requires_ioss_registration: bool

class DeMinimisRulesEngine:
    def __init__(self):
        self.rules: Dict[str, DeMinimisRule] = {}

    def register_rule(self, rule: DeMinimisRule):
        self.rules[rule.country_iso] = rule

    def evaluate_consignment_taxability(self, country_iso: str, parcel_value_local: float) -> Tuple[bool, bool, str]:
        rule = self.rules[country_iso]
        # In US: Section 321 exempts duty & tax under $800
        # In EU: Duty exempt under 150 EUR, but VAT is mandatory on all parcels (IOSS regime)
        # In UK: Duty exempt under 135 GBP, but VAT is mandatory on all parcels
        is_duty_exempt = parcel_value_local <= rule.duty_de_minimis_local
        is_tax_exempt = parcel_value_local <= rule.tax_de_minimis_local
        
        regime = "SECTION_321_DUTY_AND_TAX_FREE" if (is_duty_exempt and is_tax_exempt) else \
                 "IOSS_EU_VAT_COLLECTED_DUTY_EXEMPT" if (is_duty_exempt and not is_tax_exempt and rule.requires_ioss_registration) else \
                 "FORMAL_ENTRY_DUTY_AND_TAX_PAYABLE"
        return is_duty_exempt, is_tax_exempt, regime

engine = DeMinimisRulesEngine()
engine.register_rule(DeMinimisRule("US", 800.0, 800.0, "USD", False))
engine.register_rule(DeMinimisRule("EU", 150.0, 0.0, "EUR", True)) # 0.0 tax de minimis under 2021 VAT package
engine.register_rule(DeMinimisRule("GB", 135.0, 0.0, "GBP", False))

us_duty_free, us_tax_free, us_regime = engine.evaluate_consignment_taxability("US", 350.0)
eu_duty_free, eu_tax_free, eu_regime = engine.evaluate_consignment_taxability("EU", 85.0)

print(f"US Consignment ($350.00 USD): Duty-Free: {us_duty_free} | Tax-Free: {us_tax_free} -> Regime: [{us_regime}]")
print(f"EU Consignment (EUR 85.00):   Duty-Free: {eu_duty_free} | Tax-Free: {eu_tax_free} -> Regime: [{eu_regime}]")


print("\n=== PART 2: FOREIGN TRADE ZONE (FTZ) & BONDED WAREHOUSE INVENTORY ===")
# Part 2 Code: Bonded warehouse inventory manager tracking duty deferral and inverted tariff savings

@dataclass
class BondedInventoryLot:
    lot_id: str
    sku: str
    units: int
    unit_cif_usd: float
    raw_component_duty_rate_pct: float
    assembled_finished_good_duty_pct: float

class ForeignTradeZoneManager:
    def evaluate_inverted_tariff_savings(self, lot: BondedInventoryLot) -> Tuple[float, float, float]:
        # Duty Inversion: If assembled finished good has lower tariff than raw components
        raw_duty_cents = (lot.units * lot.unit_cif_usd) * (lot.raw_component_duty_rate_pct / 100.0)
        assembled_duty_cents = (lot.units * lot.unit_cif_usd) * (lot.assembled_finished_good_duty_pct / 100.0)
        duty_savings = raw_duty_cents - assembled_duty_cents
        deferred_working_capital = raw_duty_cents # Deferred until entry into domestic commerce
        return round(deferred_working_capital, 2), round(assembled_duty_cents, 2), round(duty_savings, 2)

ftz = ForeignTradeZoneManager()
# Electric bike components (6.5% raw duty) vs assembled e-bike (0.0% duty under tariff line)
lot = BondedInventoryLot("LOT-FTZ-991", "E_BIKE_FRAME_KIT", 2500, 320.0, 6.5, 0.0)
deferred, paid_entry, savings = ftz.evaluate_inverted_tariff_savings(lot)

print(f"Bonded Warehouse Lot: {lot.lot_id} ({lot.units} units of {lot.sku})")
print(f"  Working Capital Duty Deferred: ${deferred:,.2f} USD")
print(f"  Final Customs Duty upon Entry: ${paid_entry:,.2f} USD")
print(f"  Inverted Tariff Net Savings:   ${savings:,.2f} USD (Duty Reduction: 100%)")


print("\n=== PART 3: POSTAL (UPU) VS DIRECT INJECTION (COMMERCIAL CARRIER) ===")
# Part 3 Code: Line-haul direct injection vs universal postal routing trade-off analyzer

@dataclass
class LogisticsRouteOption:
    carrier_mode: str # UPU_POSTAL or DIRECT_INJECTION_AIR
    transit_time_days: int
    freight_cost_per_parcel_usd: float
    tracking_milestone_coverage_pct: float
    customs_delay_risk_score: float # 0.0 to 1.0

def evaluate_cross_border_shipping_mode(parcel_weight_kg: float, parcel_value_usd: float) -> LogisticsRouteOption:
    # High-value / time-sensitive orders route via direct injection
    if parcel_value_usd > 100.0 or parcel_weight_kg > 1.5:
        return LogisticsRouteOption("DIRECT_INJECTION_AIR", 4, 14.50, 99.8, 0.05)
    else:
        return LogisticsRouteOption("UPU_POSTAL_PACKET", 14, 6.20, 72.0, 0.35)

route_high = evaluate_cross_border_shipping_mode(1.8, 180.0)
route_low = evaluate_cross_border_shipping_mode(0.4, 45.0)

print(f"High-Value Consignment ($180 USD, 1.8kg): Mode: {route_high.carrier_mode:20} | Transit: {route_high.transit_time_days}d | Cost: ${route_high.freight_cost_per_parcel_usd:.2f} | Tracking: {route_high.tracking_milestone_coverage_pct}%")
print(f"Low-Value Consignment ($45 USD, 0.4kg):   Mode: {route_low.carrier_mode:20} | Transit: {route_low.transit_time_days}d | Cost: ${route_low.freight_cost_per_parcel_usd:.2f} | Tracking: {route_low.tracking_milestone_coverage_pct}%")


print("\n=== PART 4: DYNAMIC SOURCING: DIRECT AIR VS REGIONAL HUB ===")
# Part 4 Code: Dynamic fulfillment allocator balancing air freight vs forward-deployed inventory

@dataclass
class RegionalFulfillmentOption:
    strategy_name: str
    shipping_cost_usd: float
    lead_time_days: int
    holding_cost_usd: float
    carbon_footprint_kg: float

def allocate_fulfillment_node(sku_velocity_tier: str) -> RegionalFulfillmentOption:
    if sku_velocity_tier == "FAST_MOVER_TOP_20_PCT": # Forward deployed in local regional 3PL hub
        return RegionalFulfillmentOption("REGIONAL_DOMESTIC_HUB", 5.50, 2, 1.20, 0.45)
    else: # Long-tail slow mover: centralized warehouse with direct cross-border air injection
        return RegionalFulfillmentOption("DIRECT_AIR_INJECTION", 16.80, 5, 0.00, 2.85)

opt_fast = allocate_fulfillment_node("FAST_MOVER_TOP_20_PCT")
opt_slow = allocate_fulfillment_node("SLOW_MOVER_LONG_TAIL")

print(f"Fast-Mover Sourcing Strategy: {opt_fast.strategy_name:22} | Lead Time: {opt_fast.lead_time_days}d | Total Cost: ${opt_fast.shipping_cost_usd + opt_fast.holding_cost_usd:.2f}")
print(f"Slow-Mover Sourcing Strategy: {opt_slow.strategy_name:22} | Lead Time: {opt_slow.lead_time_days}d | Total Cost: ${opt_slow.shipping_cost_usd + opt_slow.holding_cost_usd:.2f}")


print("\n=== PART 5: ENTERPRISE GLOBAL LOGISTICS COMMAND TOWER ===")
# Part 5 Code: Global logistics command tower auditing Section 321 de minimis yield and customs velocity

@dataclass
class GlobalLogisticsMetrics:
    total_cross_border_parcels: int
    section_321_duty_free_parcels: int
    ioss_vat_cleared_parcels: int
    average_customs_transit_hours: float
    duty_savings_realized_usd: float

def audit_global_logistics_tower(m: GlobalLogisticsMetrics) -> Dict[str, float]:
    de_minimis_utilization_pct = (m.section_321_duty_free_parcels / m.total_cross_border_parcels) * 100.0
    transit_hours_score = max(0.0, min(35.0, (48.0 - m.average_customs_transit_hours) / 24.0 * 35.0))
    
    score = 0.0
    score += min(35.0, (de_minimis_utilization_pct / 75.0) * 35.0)
    score += transit_hours_score
    score += min(30.0, (m.duty_savings_realized_usd / 2_000_000.0) * 30.0)
    
    return {
        "total_parcels": float(m.total_cross_border_parcels),
        "de_minimis_utilization_pct": round(de_minimis_utilization_pct, 2),
        "avg_customs_transit_hours": m.average_customs_transit_hours,
        "duty_savings_usd": m.duty_savings_realized_usd,
        "composite_score": round(score, 2),
        "status": "APEX_GLOBAL_LOGISTICS_CERTIFIED" if score >= 90.0 else "SUBOPTIMAL"
    }

fleet = GlobalLogisticsMetrics(
    total_cross_border_parcels=350_000,
    section_321_duty_free_parcels=280_000, # 80% Section 321 utilization
    ioss_vat_cleared_parcels=70_000,
    average_customs_transit_hours=18.5,
    duty_savings_realized_usd=2_450_000.0
)

audit = audit_global_logistics_tower(fleet)
print(f"Global Logistics Fleet Audited: Total Volume: {audit['total_parcels']:,.0f} parcels")
print(f"De Minimis Utilization:         {audit['de_minimis_utilization_pct']}% of consignments")
print(f"Average Customs Transit Time:   {audit['avg_customs_transit_hours']} hours (Target < 24.0h)")
print(f"Duty Savings Realized:          ${audit['duty_savings_usd']:,.2f}")
print(f"Composite Architecture Score:   {audit['composite_score']}/100.0 pts")
print(f"Accreditation Status:           [{audit['status']}]")
