"""
Deterministic Python test suite for Course 07 Day 49:
Contract Pricing Engines, Complex Tiered Volume Rebates & Dynamic B2B Quoting Workflows (CPQ)
"""
import sys
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Tuple

sys.stdout.reconfigure(encoding='utf-8')

print("=== PART 1: MULTI-DIMENSIONAL CONTRACT PRICING ENGINE ===")
@dataclass
class PriceTier:
    min_qty: int
    unit_price_cents: int

@dataclass
class ContractAgreement:
    contract_id: str
    account_id: str
    sku: str
    special_unit_price_cents: Optional[int]
    tiers: List[PriceTier]

class ContractPricingEngine:
    def __init__(self, global_list_price_cents: int):
        self.global_list_price_cents = global_list_price_cents

    def resolve_price(self, agreement: Optional[ContractAgreement], quantity: int) -> Tuple[int, str]:
        # Precedence 1: Contract-specific negotiated single price
        if agreement and agreement.special_unit_price_cents is not None:
            return agreement.special_unit_price_cents, f"CONTRACT_SPECIAL ({agreement.contract_id})"
        
        # Precedence 2: Contract-specific volume tier
        if agreement and agreement.tiers:
            applicable_tier = None
            for t in sorted(agreement.tiers, key=lambda x: x.min_qty, reverse=True):
                if quantity >= t.min_qty:
                    applicable_tier = t
                    break
            if applicable_tier:
                return applicable_tier.unit_price_cents, f"CONTRACT_VOLUME_TIER ({applicable_tier.min_qty}+ units)"

        # Precedence 3: Global Base List Price
        return self.global_list_price_cents, "GLOBAL_LIST_PRICE"

pricing_engine = ContractPricingEngine(global_list_price_cents=6500) # $65.00 list

agr_aerospace = ContractAgreement(
    contract_id="AGR-AERO-2026",
    account_id="CORP-BOEING",
    sku="SKU-HYD-PUMP",
    special_unit_price_cents=None,
    tiers=[
        PriceTier(1, 4800),    # $48.00 for 1-99
        PriceTier(100, 4200),  # $42.00 for 100-499
        PriceTier(500, 3750)   # $37.50 for 500+
    ]
)

p1, rule1 = pricing_engine.resolve_price(agr_aerospace, quantity=25)
p2, rule2 = pricing_engine.resolve_price(agr_aerospace, quantity=150)
p3, rule3 = pricing_engine.resolve_price(agr_aerospace, quantity=600)
p_anon, rule_anon = pricing_engine.resolve_price(None, quantity=150)

print(f"Boeing (25 units):  Price=${p1/100:.2f} | Rule={rule1}")
print(f"Boeing (150 units): Price=${p2/100:.2f} | Rule={rule2}")
print(f"Boeing (600 units): Price=${p3/100:.2f} | Rule={rule3}")
print(f"Standard Anon Qty 150: Price=${p_anon/100:.2f} | Rule={rule_anon}")


print("\n=== PART 2: STEPPED VS MARGINAL BRACKET PRICING CALCULATOR ===")
@dataclass
class VolumeBracket:
    start_qty: int
    end_qty: int # inclusive, float('inf') for top
    unit_price_cents: int

class VolumeBracketCalculator:
    def __init__(self, brackets: List[VolumeBracket]):
        self.brackets = sorted(brackets, key=lambda b: b.start_qty)

    def compute_stepped_pricing(self, quantity: int) -> Tuple[int, int]:
        # Stepped: Achieved tier price applies to ALL units
        chosen_price = self.brackets[0].unit_price_cents
        for b in self.brackets:
            if quantity >= b.start_qty:
                chosen_price = b.unit_price_cents
        total_cost = chosen_price * quantity
        return total_cost, chosen_price

    def compute_marginal_pricing(self, quantity: int) -> Tuple[int, float]:
        # Marginal: Units within each bracket pay that bracket's price
        total_cost = 0
        rem = quantity
        for b in self.brackets:
            if rem <= 0:
                break
            bracket_capacity = (b.end_qty - b.start_qty + 1)
            units_in_bracket = min(rem, bracket_capacity)
            total_cost += units_in_bracket * b.unit_price_cents
            rem -= units_in_bracket
            
        effective_unit_price = total_cost / quantity if quantity > 0 else 0.0
        return total_cost, round(effective_unit_price, 2)

brackets = [
    VolumeBracket(1, 99, 5000),      # $50.00
    VolumeBracket(100, 499, 4200),   # $42.00
    VolumeBracket(500, 100000, 3600) # $36.00
]
calc = VolumeBracketCalculator(brackets)

q = 250
stepped_total, stepped_unit = calc.compute_stepped_pricing(q)
marginal_total, marginal_unit = calc.compute_marginal_pricing(q)

print(f"Quantity: {q} Units Pricing Comparison:")
print(f"  Stepped (All-in): Total=${stepped_total/100:,.2f} | Unit Price=${stepped_unit/100:.2f}")
print(f"  Marginal/Bracket: Total=${marginal_total/100:,.2f} | Effective Unit=${marginal_unit/100:.2f}")
print(f"  Margin Difference: ${(stepped_total - marginal_total)/100:,.2f}")


print("\n=== PART 3: RETROSPECTIVE ANNUAL VOLUME REBATES & ASC 606 ACCRUALS ===")
@dataclass
class RebateTier:
    annual_spend_threshold_cents: int
    rebate_pct: float

class AnnualRebateEngine:
    REBATE_SCHEDULE = [
        RebateTier(100000000, 2.0), # $1M spend -> 2% rebate
        RebateTier(300000000, 4.0), # $3M spend -> 4% rebate
        RebateTier(500000000, 6.0)  # $5M spend -> 6% rebate
    ]

    def evaluate_annual_rebate(self, cumulative_annual_spend_cents: int) -> dict:
        eligible_tier = None
        for t in sorted(self.REBATE_SCHEDULE, key=lambda x: x.annual_spend_threshold_cents, reverse=True):
            if cumulative_annual_spend_cents >= t.annual_spend_threshold_cents:
                eligible_tier = t
                break

        rebate_pct = eligible_tier.rebate_pct if eligible_tier else 0.0
        rebate_payable_cents = int(round(cumulative_annual_spend_cents * (rebate_pct / 100.0)))
        
        # ASC 606 Quarterly Accrual Reserve (25% per quarter)
        quarterly_accrual_cents = int(round(rebate_payable_cents / 4.0))

        return {
            "cumulative_annual_spend_cents": cumulative_annual_spend_cents,
            "achieved_rebate_pct": rebate_pct,
            "annual_rebate_payable_cents": rebate_payable_cents,
            "quarterly_asc606_accrual_cents": quarterly_accrual_cents
        }

rebate_engine = AnnualRebateEngine()
reb1 = rebate_engine.evaluate_annual_rebate(75000000)   # $750k (under $1M)
reb2 = rebate_engine.evaluate_annual_rebate(220000000)  # $2.2M (2% tier)
reb3 = rebate_engine.evaluate_annual_rebate(410000000)  # $4.1M (4% tier)
reb4 = rebate_engine.evaluate_annual_rebate(650000000)  # $6.5M (6% tier)

print(f"$750k Spend: Rebate={reb1['achieved_rebate_pct']}% | Payout=${reb1['annual_rebate_payable_cents']/100:,.2f}")
print(f"$2.2M Spend: Rebate={reb2['achieved_rebate_pct']}% | Payout=${reb2['annual_rebate_payable_cents']/100:,.2f} [Qtr Accrual=${reb2['quarterly_asc606_accrual_cents']/100:,.2f}]")
print(f"$4.1M Spend: Rebate={reb3['achieved_rebate_pct']}% | Payout=${reb3['annual_rebate_payable_cents']/100:,.2f} [Qtr Accrual=${reb3['quarterly_asc606_accrual_cents']/100:,.2f}]")
print(f"$6.5M Spend: Rebate={reb4['achieved_rebate_pct']}% | Payout=${reb4['annual_rebate_payable_cents']/100:,.2f} [Qtr Accrual=${reb4['quarterly_asc606_accrual_cents']/100:,.2f}]")


print("\n=== PART 4: CPQ QUOTING ENGINE & MARGIN HURDLE GOVERNANCE ===")
@dataclass
class QuoteRequest:
    quote_id: str
    account_id: str
    sku: str
    requested_qty: int
    target_unit_price_cents: int
    unit_cogs_cents: int

class CPQQuotingEngine:
    MINIMUM_MARGIN_HURDLE_PCT = 22.0

    def evaluate_quote(self, req: QuoteRequest) -> dict:
        total_revenue = req.requested_qty * req.target_unit_price_cents
        total_cogs = req.requested_qty * req.unit_cogs_cents
        gross_profit = total_revenue - total_cogs
        margin_pct = (gross_profit / total_revenue * 100.0) if total_revenue > 0 else 0.0

        is_approved = margin_pct >= self.MINIMUM_MARGIN_HURDLE_PCT
        
        # Calculate floor unit price to achieve exactly 22% margin: COGS / (1 - 0.22)
        floor_unit_price = int(round(req.unit_cogs_cents / (1.0 - (self.MINIMUM_MARGIN_HURDLE_PCT / 100.0))))

        return {
            "quote_id": req.quote_id,
            "requested_qty": req.requested_qty,
            "target_unit_price_cents": req.target_unit_price_cents,
            "gross_profit_cents": gross_profit,
            "margin_pct": round(margin_pct, 1),
            "approved": is_approved,
            "status": "APPROVED_DELIVERED" if is_approved else "REJECTED_BELOW_MARGIN_HURDLE",
            "floor_unit_price_cents": floor_unit_price
        }

cpq = CPQQuotingEngine()
q1 = cpq.evaluate_quote(QuoteRequest("QT-101", "CORP-A", "SKU-VALVE", 1000, target_unit_price_cents=4500, unit_cogs_cents=3100)) # $45 price, $31 cogs -> 31.1% margin
q2 = cpq.evaluate_quote(QuoteRequest("QT-102", "CORP-B", "SKU-VALVE", 5000, target_unit_price_cents=3600, unit_cogs_cents=3100)) # $36 price, $31 cogs -> 13.9% margin (<22%)

print(f"Quote 1 ($45.00): Status={q1['status']} | Margin={q1['margin_pct']}% | Profit=${q1['gross_profit_cents']/100:,.2f}")
print(f"Quote 2 ($36.00): Status={q2['status']} | Margin={q2['margin_pct']}% | Minimum Floor=${q2['floor_unit_price_cents']/100:.2f}")


print("\n=== PART 5: PRICING WATERFALL & MARGIN GOVERNANCE TOWER ===")
class PricingWaterfallTower:
    def analyze_waterfall(self, list_price_cents: int, contract_discount_cents: int, volume_rebate_cents: int, prompt_discount_cents: int, cogs_cents: int) -> dict:
        contract_invoice_price = list_price_cents - contract_discount_cents
        net_pocket_price = contract_invoice_price - volume_rebate_cents - prompt_discount_cents
        pocket_margin = net_pocket_price - cogs_cents
        pocket_margin_pct = (pocket_margin / net_pocket_price * 100.0) if net_pocket_price > 0 else 0.0

        return {
            "list_price_cents": list_price_cents,
            "contract_discount_cents": contract_discount_cents,
            "contract_invoice_price_cents": contract_invoice_price,
            "volume_rebate_cents": volume_rebate_cents,
            "prompt_discount_cents": prompt_discount_cents,
            "net_pocket_price_cents": net_pocket_price,
            "cogs_cents": cogs_cents,
            "pocket_margin_cents": pocket_margin,
            "pocket_margin_pct": round(pocket_margin_pct, 1)
        }

tower = PricingWaterfallTower()
wf = tower.analyze_waterfall(
    list_price_cents=10000,          # $100.00 List
    contract_discount_cents=2200,    # -$22.00 Base Contract Discount
    volume_rebate_cents=400,         # -$4.00 Retrospective Rebate Accrual
    prompt_discount_cents=150,       # -$1.50 Prompt Cash Discount
    cogs_cents=5200                  # $52.00 COGS
)

print("Pricing Waterfall Leakage Analysis:")
print(f"  Gross List Price:           ${wf['list_price_cents']/100:.2f}")
print(f"  - Contract Negotiation:     -${wf['contract_discount_cents']/100:.2f}")
print(f"  = Invoice Price:            ${wf['contract_invoice_price_cents']/100:.2f}")
print(f"  - Retrospective Rebates:    -${wf['volume_rebate_cents']/100:.2f}")
print(f"  - Early Settlement Terms:   -${wf['prompt_discount_cents']/100:.2f}")
print(f"  = Net Realized Pocket Price:${wf['net_pocket_price_cents']/100:.2f}")
print(f"  - Cost of Goods Sold (COGS):-${wf['cogs_cents']/100:.2f}")
print(f"  = Realized Pocket Margin:   ${wf['pocket_margin_cents']/100:.2f} ({wf['pocket_margin_pct']}%)")
