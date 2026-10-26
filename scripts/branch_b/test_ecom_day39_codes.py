# -*- coding: utf-8 -*-
"""
Deterministic Python test suite for Course 07: bcom_ecom Day 39
Global Taxation, Customs & Landed Cost Calculation Engines
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

print("=== PART 1: US SALES TAX ECONOMIC NEXUS ENGINE ===")
class SalesTaxNexusEngine:
    def __init__(self):
        self.nexus_thresholds = {
            "CA": (500000.0, 0),
            "NY": (500000.0, 100),
            "TX": (500000.0, 0),
            "IL": (100000.0, 200)
        }
        self.jurisdiction_rates = {
            "CA_90210": {"state": 0.060, "county": 0.0125, "city": 0.0225}, # 9.50% total
            "TX_75001": {"state": 0.0625, "county": 0.010, "city": 0.010}   # 8.25% total
        }

    def evaluate_tax(self, state: str, zip_code: str, taxable_amount: float, merchant_state_revenue: float) -> dict:
        threshold_rev, threshold_tx = self.nexus_thresholds.get(state, (100000.0, 200))
        has_nexus = merchant_state_revenue >= threshold_rev
        
        if not has_nexus:
            return {"nexus_established": False, "tax_due": 0.0, "status": "NO_ECONOMIC_NEXUS"}
            
        rate_key = f"{state}_{zip_code}"
        rates = self.jurisdiction_rates.get(rate_key, {"state": 0.05, "county": 0.01, "city": 0.01})
        total_rate = sum(rates.values())
        tax_due = round(taxable_amount * total_rate, 2)
        
        return {
            "nexus_established": True,
            "state": state,
            "zip_code": zip_code,
            "effective_tax_rate": round(total_rate * 100, 2),
            "jurisdiction_breakdown": {k: round(taxable_amount * r, 2) for k, r in rates.items()},
            "tax_due": tax_due,
            "status": "TAX_CALCULATED"
        }

nexus_engine = SalesTaxNexusEngine()
r1 = nexus_engine.evaluate_tax("CA", "90210", taxable_amount=250.0, merchant_state_revenue=650000.0)
r2 = nexus_engine.evaluate_tax("IL", "60601", taxable_amount=250.0, merchant_state_revenue=45000.0)

print(f"CA 90210: {r1['status']} | Rate: {r1.get('effective_tax_rate')}% | Tax Due: ${r1['tax_due']}")
print(f"IL 60601: {r2['status']} | Tax Due: ${r2['tax_due']}")


print("\n=== PART 2: EU VAT OSS & REVERSE CHARGE ENGINE ===")
class EUVatOSSEngine:
    def __init__(self):
        self.vat_rates = {"DE": 0.19, "FR": 0.20, "IT": 0.22, "ES": 0.21}

    def calculate_eu_vat(self, country_code: str, amount_eur: float, is_b2b: bool, valid_vat_id: bool) -> dict:
        if is_b2b and valid_vat_id:
            return {
                "destination_country": country_code,
                "vat_rate_pct": 0.0,
                "vat_due_eur": 0.0,
                "scheme": "B2B_REVERSE_CHARGE_ARTICLE_194",
                "status": "VAT_EXEMPT_REVERSE_CHARGE"
            }
            
        rate = self.vat_rates.get(country_code, 0.20)
        vat_amount = round(amount_eur * rate, 2)
        total_with_vat = round(amount_eur + vat_amount, 2)
        ioss_eligible = amount_eur <= 150.0
        
        return {
            "destination_country": country_code,
            "vat_rate_pct": round(rate * 100, 1),
            "net_amount_eur": amount_eur,
            "vat_due_eur": vat_amount,
            "gross_amount_eur": total_with_vat,
            "scheme": "EU_ONE_STOP_SHOP_OSS" if not ioss_eligible else "IMPORT_ONE_STOP_SHOP_IOSS",
            "status": "VAT_APPLIED"
        }

vat_engine = EUVatOSSEngine()
v1 = vat_engine.calculate_eu_vat("DE", amount_eur=100.0, is_b2b=False, valid_vat_id=False)
v2 = vat_engine.calculate_eu_vat("FR", amount_eur=500.0, is_b2b=True, valid_vat_id=True)

print(f"DE B2C: {v1['scheme']} | Rate: {v1['vat_rate_pct']}% | VAT: €{v1['vat_due_eur']} | Gross: €{v1['gross_amount_eur']}")
print(f"FR B2B: {v2['status']} | Scheme: {v2['scheme']} | VAT: €{v2['vat_due_eur']}")


print("\n=== PART 3: HS TARIFF & LANDED COST CALCULATOR ===")
class CustomsDutyCalculator:
    def __init__(self):
        self.hs_tariffs = {
            "6403.99": {"desc": "Leather Footwear", "duty_rate": 0.085},
            "6109.10": {"desc": "Cotton T-Shirts", "duty_rate": 0.165},
            "8517.13": {"desc": "Smartphones", "duty_rate": 0.000}
        }

    def calculate_landed_cost(self, hs_code: str, item_value_usd: float, freight_cost: float, insurance_cost: float) -> dict:
        if item_value_usd <= 800.0:
            return {
                "hs_code": hs_code,
                "cif_value": item_value_usd + freight_cost + insurance_cost,
                "customs_duty": 0.0,
                "clearance_fee": 0.0,
                "total_landed_cost": item_value_usd + freight_cost + insurance_cost,
                "status": "DE_MINIMIS_DUTY_EXEMPT"
            }
            
        cif_value = round(item_value_usd + freight_cost + insurance_cost, 2)
        tariff_meta = self.hs_tariffs.get(hs_code, {"desc": "General Goods", "duty_rate": 0.05})
        duty_amount = round(cif_value * tariff_meta["duty_rate"], 2)
        customs_clearance_fee = 25.0
        total_landed = round(cif_value + duty_amount + customs_clearance_fee, 2)
        
        return {
            "hs_code": hs_code,
            "description": tariff_meta["desc"],
            "cif_value": cif_value,
            "duty_rate_pct": round(tariff_meta["duty_rate"] * 100, 1),
            "customs_duty": duty_amount,
            "clearance_fee": customs_clearance_fee,
            "total_landed_cost": total_landed,
            "status": "DUTY_APPLIED_DDP"
        }

duty_calc = CustomsDutyCalculator()
d1 = duty_calc.calculate_landed_cost("6403.99", item_value_usd=1200.0, freight_cost=60.0, insurance_cost=15.0)
d2 = duty_calc.calculate_landed_cost("6109.10", item_value_usd=250.0, freight_cost=30.0, insurance_cost=5.0)

print(f"Import 1 ($1200 Footwear): Duty: ${d1['customs_duty']} ({d1.get('duty_rate_pct')}%) | Total Landed: ${d1['total_landed_cost']}")
print(f"Import 2 ($250 T-Shirt):   {d2['status']} | Total Landed: ${d2['total_landed_cost']}")


print("\n=== PART 4: TAX ENGINE GATEWAY WITH CACHING ===")
class TaxEngineGatewayWithCache:
    def __init__(self):
        self.cache = {}
        self.api_call_count = 0

    def get_tax_rate(self, postal_code: str) -> float:
        if postal_code in self.cache:
            return self.cache[postal_code]
            
        self.api_call_count += 1
        rate = 0.0825 if postal_code.startswith("75") else 0.0750
        self.cache[postal_code] = rate
        return rate

gateway = TaxEngineGatewayWithCache()
r1 = gateway.get_tax_rate("75001")
print(f"Lookup 1 (75001): Rate {r1*100:.2f}% | API Calls: {gateway.api_call_count}")

r2 = gateway.get_tax_rate("75001")
print(f"Lookup 2 (75001): Rate {r2*100:.2f}% | API Calls: {gateway.api_call_count} (Cache Hit!)")

r3 = gateway.get_tax_rate("90210")
print(f"Lookup 3 (90210): Rate {r3*100:.2f}% | API Calls: {gateway.api_call_count}")


print("\n=== PART 5: COMPLETE GLOBAL TAX & LANDED COST ENGINE ===")
class EnterpriseGlobalTaxEngine:
    def __init__(self):
        self.nexus = SalesTaxNexusEngine()
        self.vat = EUVatOSSEngine()
        self.duty = CustomsDutyCalculator()
        self.gateway = TaxEngineGatewayWithCache()

    def calculate_order_tax_and_duties(self, country: str, region_code: str, item_value: float, hs_code: str) -> dict:
        if country == "US":
            tax_res = self.nexus.evaluate_tax("CA", region_code, item_value, merchant_state_revenue=600000.0)
            return {
                "tax_system": "US_SALES_TAX",
                "tax_due": tax_res["tax_due"],
                "customs_duty": 0.0,
                "total_order_charges": round(item_value + tax_res["tax_due"], 2)
            }
        elif country in ["DE", "FR", "IT", "ES"]:
            vat_res = self.vat.calculate_eu_vat(country, item_value, is_b2b=False, valid_vat_id=False)
            return {
                "tax_system": "EU_VAT_OSS",
                "tax_due": vat_res["vat_due_eur"],
                "customs_duty": 0.0,
                "total_order_charges": vat_res["gross_amount_eur"]
            }
        else:
            duty_res = self.duty.calculate_landed_cost(hs_code, item_value, freight_cost=50.0, insurance_cost=10.0)
            return {
                "tax_system": "CROSS_BORDER_CUSTOMS_DDP",
                "tax_due": 0.0,
                "customs_duty": duty_res["customs_duty"],
                "total_order_charges": duty_res["total_landed_cost"]
            }

global_tax = EnterpriseGlobalTaxEngine()
us_order = global_tax.calculate_order_tax_and_duties("US", "90210", 300.0, "6403.99")
eu_order = global_tax.calculate_order_tax_and_duties("DE", "10115", 300.0, "6403.99")

print(f"US Order: Tax System: {us_order['tax_system']} | Tax: ${us_order['tax_due']} | Total: ${us_order['total_order_charges']}")
print(f"EU Order: Tax System: {eu_order['tax_system']} | VAT: €{eu_order['tax_due']} | Total: €{eu_order['total_order_charges']}")
