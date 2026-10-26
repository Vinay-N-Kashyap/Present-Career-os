"""
Generate Day 57 for Course 07 (bcom_ecom):
Title: Marketplace Multi-Party Split Payments, Platform Take Rates, Escrow & Automated Merchant Settlement
"""
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"

# Part 1 Code
p1_code = '''from dataclasses import dataclass
from typing import List, Dict

@dataclass
class CartItem:
    sku: str
    seller_id: str
    price_cents: int
    quantity: int

@dataclass
class SplitTransfer:
    seller_id: str
    subtotal_cents: int
    platform_fee_cents: int
    net_seller_transfer_cents: int

class MultiPartySplitPaymentEngine:
    def __init__(self, platform_take_rate_pct: float, processing_fee_pct: float, fixed_fee_cents: int):
        self.platform_take_rate_pct = platform_take_rate_pct
        self.processing_fee_pct = processing_fee_pct
        self.fixed_fee_cents = fixed_fee_cents

    def execute_split(self, items: List[CartItem]) -> Dict[str, any]:
        gross_cart_total = sum(i.price_cents * i.quantity for i in items)
        overall_processing_fee = int(gross_cart_total * (self.processing_fee_pct / 100.0)) + self.fixed_fee_cents

        seller_subtotals: Dict[str, int] = {}
        for item in items:
            seller_subtotals[item.seller_id] = seller_subtotals.get(item.seller_id, 0) + (item.price_cents * item.quantity)

        splits: List[SplitTransfer] = []
        total_platform_commission = 0
        total_seller_net = 0

        for s_id, subtotal in seller_subtotals.items():
            commission = int(subtotal * (self.platform_take_rate_pct / 100.0))
            net_transfer = subtotal - commission
            splits.append(SplitTransfer(
                seller_id=s_id,
                subtotal_cents=subtotal,
                platform_fee_cents=commission,
                net_seller_transfer_cents=net_transfer
            ))
            total_platform_commission += commission
            total_seller_net += net_transfer

        net_platform_margin = total_platform_commission - overall_processing_fee

        return {
            "gross_captured_cents": gross_cart_total,
            "overall_processing_fee_cents": overall_processing_fee,
            "total_seller_disbursement_cents": total_seller_net,
            "gross_platform_commission_cents": total_platform_commission,
            "net_platform_profit_cents": net_platform_margin,
            "transfers": splits
        }

engine = MultiPartySplitPaymentEngine(platform_take_rate_pct=12.0, processing_fee_pct=2.9, fixed_fee_cents=30)
cart = [
    CartItem("SKU-101", "SEL-ALPHA", 5000, 2),  # $100.00
    CartItem("SKU-202", "SEL-BETA", 3500, 1),   # $35.00
    CartItem("SKU-303", "SEL-GAMMA", 8000, 1),  # $80.00
]
res = engine.execute_split(cart)

print(f"Unified Checkout Capture: ${res['gross_captured_cents']/100:.2f}")
print(f"Total Platform Commission (12%): ${res['gross_platform_commission_cents']/100:.2f}")
print(f"Card Processing Surcharge:       ${res['overall_processing_fee_cents']/100:.2f}")
print(f"Net Platform Profit:             ${res['net_platform_profit_cents']/100:.2f}")
for t in res['transfers']:
    print(f"  -> Transfer {t.seller_id}: Subtotal=${t.subtotal_cents/100:.2f} | Net=${t.net_seller_transfer_cents/100:.2f}")'''

p1_output = '''Unified Checkout Capture: $215.00
Total Platform Commission (12%): $25.80
Card Processing Surcharge:       $6.53
Net Platform Profit:             $19.27
  -> Transfer SEL-ALPHA: Subtotal=$100.00 | Net=$88.00
  -> Transfer SEL-BETA: Subtotal=$35.00 | Net=$30.80
  -> Transfer SEL-GAMMA: Subtotal=$80.00 | Net=$70.40'''

# Part 2 Code
p2_code = '''from dataclasses import dataclass
from typing import Dict

@dataclass
class CategoryCommissionRule:
    category_id: str
    base_take_rate_pct: float
    min_closing_fee_cents: int

class DynamicCommissionWaterfallEngine:
    def __init__(self):
        self.rules: Dict[str, CategoryCommissionRule] = {}
        self.volume_discounts = [
            (100_000_00, 2.0), # > $100k: 2% rebate
            (50_000_00, 1.0),  # > $50k: 1% rebate
            (0, 0.0)
        ]

    def add_category_rule(self, rule: CategoryCommissionRule):
        self.rules[rule.category_id] = rule

    def calculate_commission(self, category_id: str, line_total_cents: int, seller_prior_30d_gmv_cents: int) -> Dict[str, float]:
        rule = self.rules.get(category_id, CategoryCommissionRule("DEFAULT", 15.0, 50))
        
        # Determine volume discount
        discount_pct = 0.0
        for threshold, disc in self.volume_discounts:
            if seller_prior_30d_gmv_cents >= threshold:
                discount_pct = disc
                break

        effective_rate = max(rule.base_take_rate_pct - discount_pct, 1.0)
        raw_commission = int(line_total_cents * (effective_rate / 100.0))
        final_commission = max(raw_commission, rule.min_closing_fee_cents)

        return {
            "category": category_id,
            "line_total_cents": line_total_cents,
            "effective_rate_pct": effective_rate,
            "final_commission_cents": final_commission,
            "seller_retained_cents": line_total_cents - final_commission
        }

engine = DynamicCommissionWaterfallEngine()
engine.add_category_rule(CategoryCommissionRule("CONSUMER_ELECTRONICS", 8.0, 100))
engine.add_category_rule(CategoryCommissionRule("LUXURY_FASHION", 18.0, 250))

c1 = engine.calculate_commission("CONSUMER_ELECTRONICS", 120_000, 120_000_00)
c2 = engine.calculate_commission("LUXURY_FASHION", 50_000, 10_000_00)

print(f"Electronics ($1,200.00 @ Tier 1): Effective={c1['effective_rate_pct']}% | Comm=${c1['final_commission_cents']/100:.2f} | Seller=${c1['seller_retained_cents']/100:.2f}")
print(f"Fashion ($500.00 @ Standard):     Effective={c2['effective_rate_pct']}% | Comm=${c2['final_commission_cents']/100:.2f} | Seller=${c2['seller_retained_cents']/100:.2f}")'''

p2_output = '''Electronics ($1,200.00 @ Tier 1): Effective=6.0% | Comm=$72.00 | Seller=$1128.00
Fashion ($500.00 @ Standard):     Effective=18.0% | Comm=$90.00 | Seller=$410.00'''

# Part 3 Code
p3_code = '''from dataclasses import dataclass
from typing import List, Dict

@dataclass
class EscrowHoldbackPolicy:
    rolling_reserve_pct: float
    hold_period_days: int
    seller_risk_multiplier: float

class MarketplaceEscrowManager:
    def __init__(self):
        self.escrow_ledger: Dict[str, Dict[str, float]] = {}

    def process_payout_escrow(self, seller_id: str, gross_settlement_cents: int, policy: EscrowHoldbackPolicy) -> Dict[str, int]:
        effective_reserve_rate = min(policy.rolling_reserve_pct * policy.seller_risk_multiplier, 35.0)
        reserve_withheld_cents = int(gross_settlement_cents * (effective_reserve_rate / 100.0))
        immediate_disbursement_cents = gross_settlement_cents - reserve_withheld_cents

        seller_ledger = self.escrow_ledger.setdefault(seller_id, {"total_reserved": 0, "matured_released": 0})
        seller_ledger["total_reserved"] += reserve_withheld_cents

        return {
            "gross_settlement_cents": gross_settlement_cents,
            "reserve_rate_pct": effective_reserve_rate,
            "reserve_withheld_cents": reserve_withheld_cents,
            "immediate_disbursement_cents": immediate_disbursement_cents,
            "cumulative_escrow_cents": seller_ledger["total_reserved"]
        }

manager = MarketplaceEscrowManager()
policy_standard = EscrowHoldbackPolicy(10.0, 30, 1.0)
policy_probationary = EscrowHoldbackPolicy(10.0, 30, 2.5)

e1 = manager.process_payout_escrow("SEL-VET-01", 1_000_000, policy_standard)
e2 = manager.process_payout_escrow("SEL-NEW-99", 1_000_000, policy_probationary)

print(f"Veteran Seller Settlement:   Gross=${e1['gross_settlement_cents']/100:,.2f} | Disbursed=${e1['immediate_disbursement_cents']/100:,.2f} | Reserve=${e1['reserve_withheld_cents']/100:,.2f} ({e1['reserve_rate_pct']}%)")
print(f"Probation Seller Settlement: Gross=${e2['gross_settlement_cents']/100:,.2f} | Disbursed=${e2['immediate_disbursement_cents']/100:,.2f} | Reserve=${e2['reserve_withheld_cents']/100:,.2f} ({e2['reserve_rate_pct']}%)")'''

p3_output = '''Veteran Seller Settlement:   Gross=$10,000.00 | Disbursed=$9,000.00 | Reserve=$1,000.00 (10.0%)
Probation Seller Settlement: Gross=$10,000.00 | Disbursed=$7,500.00 | Reserve=$2,500.00 (25.0%)'''

# Part 4 Code
p4_code = '''from dataclasses import dataclass
from typing import List, Dict

@dataclass
class SellerBillingLineItem:
    seller_id: str
    item_type: str
    amount_cents: int  # positive = credit to seller, negative = debit

class MerchantSettlementBatchPipeline:
    def __init__(self, payout_rail: str):
        self.payout_rail = payout_rail

    def compile_settlement_batch(self, lines: List[SellerBillingLineItem]) -> Dict[str, Dict[str, int]]:
        settlements: Dict[str, Dict[str, int]] = {}

        for line in lines:
            acc = settlements.setdefault(line.seller_id, {
                "sales_credit_cents": 0,
                "refund_debits_cents": 0,
                "fee_debits_cents": 0,
                "net_payout_cents": 0
            })
            if line.item_type == "SALE":
                acc["sales_credit_cents"] += line.amount_cents
            elif line.item_type == "REFUND":
                acc["refund_debits_cents"] += abs(line.amount_cents)
            elif line.item_type == "SUBSCRIPTION_FEE":
                acc["fee_debits_cents"] += abs(line.amount_cents)

        for s_id, acc in settlements.items():
            net = acc["sales_credit_cents"] - acc["refund_debits_cents"] - acc["fee_debits_cents"]
            acc["net_payout_cents"] = max(net, 0)
            acc["is_payable"] = 1 if net > 2500 else 0  # $25.00 min threshold

        return settlements

pipeline = MerchantSettlementBatchPipeline("NACHA_ACH_CREDIT")
batch_data = [
    SellerBillingLineItem("SEL-100", "SALE", 450_000),
    SellerBillingLineItem("SEL-100", "REFUND", -30_000),
    SellerBillingLineItem("SEL-100", "SUBSCRIPTION_FEE", -3_999),
    SellerBillingLineItem("SEL-200", "SALE", 2_000),
    SellerBillingLineItem("SEL-200", "SUBSCRIPTION_FEE", -3_999),
]

summary = pipeline.compile_settlement_batch(batch_data)
s1 = summary["SEL-100"]
s2 = summary["SEL-200"]

print(f"Seller SEL-100 Settlement: Credits=${s1['sales_credit_cents']/100:.2f} | Refunds=${s1['refund_debits_cents']/100:.2f} | Fees=${s1['fee_debits_cents']/100:.2f} | Net=${s1['net_payout_cents']/100:.2f} | Payable={s1['is_payable']}")
print(f"Seller SEL-200 Settlement: Credits=${s2['sales_credit_cents']/100:.2f} | Refunds=${s2['refund_debits_cents']/100:.2f} | Fees=${s2['fee_debits_cents']/100:.2f} | Net=${s2['net_payout_cents']/100:.2f} | Payable={s2['is_payable']}")'''

p4_output = '''Seller SEL-100 Settlement: Credits=$4500.00 | Refunds=$300.00 | Fees=$39.99 | Net=$4160.01 | Payable=1
Seller SEL-200 Settlement: Credits=$20.00 | Refunds=$0.00 | Fees=$39.99 | Net=$0.00 | Payable=0'''

# Part 5 Code
p5_code = '''from dataclasses import dataclass
from typing import Dict

@dataclass
class MarketplaceTreasuryMetrics:
    total_gmv_cents: int
    platform_take_rate_revenue_cents: int
    rolling_escrow_reserves_cents: int
    pending_merchant_disbursements_cents: int
    unmatched_clearing_variance_cents: int

class MarketplaceTreasuryAuditor:
    def audit_treasury_solvency(self, m: MarketplaceTreasuryMetrics) -> Dict[str, any]:
        total_custodial_liability = m.rolling_escrow_reserves_cents + m.pending_merchant_disbursements_cents
        reconciliation_error_pct = (abs(m.unmatched_clearing_variance_cents) / m.total_gmv_cents) * 100.0
        is_fully_reconciled = reconciliation_error_pct <= 0.01

        score = 100.0
        if not is_fully_reconciled:
            score -= 40.0
        if m.platform_take_rate_revenue_cents < int(m.total_gmv_cents * 0.05):
            score -= 20.0

        return {
            "gmv_usd": m.total_gmv_cents / 100.0,
            "platform_revenue_usd": m.platform_take_rate_revenue_cents / 100.0,
            "custodial_liability_usd": total_custodial_liability / 100.0,
            "reconciliation_variance_pct": round(reconciliation_error_pct, 4),
            "solvency_status": "EXEMPLARY_CUSTODIAL_INTEGRITY" if score == 100.0 else "AUDIT_REMEDIATION_REQUIRED",
            "audit_score": score
        }

auditor = MarketplaceTreasuryAuditor()
audit = auditor.audit_treasury_solvency(MarketplaceTreasuryMetrics(
    total_gmv_cents=50_000_000_00,
    platform_take_rate_revenue_cents=6_250_000_00,
    rolling_escrow_reserves_cents=3_500_000_00,
    pending_merchant_disbursements_cents=40_250_000_00,
    unmatched_clearing_variance_cents=120_00
))

print(f"Marketplace Treasury Solvency Audit:")
print(f"  Processed GMV:         ${audit['gmv_usd']:,.2f}")
print(f"  Platform Revenue:      ${audit['platform_revenue_usd']:,.2f}")
print(f"  Custodial Liabilities: ${audit['custodial_liability_usd']:,.2f}")
print(f"  Variance Error Rate:   {audit['reconciliation_variance_pct']}%")
print(f"  Solvency Status:       [{audit['solvency_status']}] (Score: {audit['audit_score']}/100.0)")'''

p5_output = '''Marketplace Treasury Solvency Audit:
  Processed GMV:         $50,000,000.00
  Platform Revenue:      $6,250,000.00
  Custodial Liabilities: $43,750,000.00
  Variance Error Rate:   0.0002%
  Solvency Status:       [EXEMPLARY_CUSTODIAL_INTEGRITY] (Score: 100.0/100.0)'''

print("Code and output templates for Day 57 ready.")
