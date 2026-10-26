"""
Deterministic Python test suite for Course 07 Day 48:
Enterprise Invoicing, Credit Limit Engines, Net-Terms Financing (Net 30/60/90) & Automated Dunning
"""
import sys
import json
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Tuple

sys.stdout.reconfigure(encoding='utf-8')

print("=== PART 1: ENTERPRISE TRADE CREDIT & EXPOSURE ENGINE ===")
@dataclass
class AccountCreditProfile:
    account_id: str
    credit_limit_cents: int
    unpaid_invoices_cents: int
    unbilled_pipeline_cents: int
    risk_score: str  # AAA, AA, BBB, HIGH_RISK

class CreditLimitEngine:
    def evaluate_order(self, profile: AccountCreditProfile, new_order_cents: int) -> dict:
        current_exposure = profile.unpaid_invoices_cents + profile.unbilled_pipeline_cents
        projected_exposure = current_exposure + new_order_cents
        available_credit = profile.credit_limit_cents - current_exposure
        
        is_approved = projected_exposure <= profile.credit_limit_cents
        utilization_pct = (projected_exposure / profile.credit_limit_cents * 100.0) if profile.credit_limit_cents > 0 else 100.0

        return {
            "account_id": profile.account_id,
            "approved": is_approved,
            "available_credit_cents": max(0, available_credit),
            "projected_exposure_cents": projected_exposure,
            "utilization_pct": round(utilization_pct, 1),
            "status": "APPROVED" if is_approved else "REJECTED_CREDIT_LIMIT_EXCEEDED"
        }

engine = CreditLimitEngine()
prof1 = AccountCreditProfile("CORP-ALPHA", 50000000, 18500000, 6500000, "AA") # $500k limit, $185k unpaid, $65k pipeline
prof2 = AccountCreditProfile("CORP-BETA", 20000000, 15000000, 4200000, "BBB") # $200k limit, $150k unpaid, $42k pipeline

res1 = engine.evaluate_order(prof1, new_order_cents=12000000) # $120k order
res2 = engine.evaluate_order(prof2, new_order_cents=2500000)  # $25k order (exceeds $200k)

print(f"Alpha Order ($120k): Status={res1['status']} | Exposure=${res1['projected_exposure_cents']/100:,.2f} ({res1['utilization_pct']}%)")
print(f"Beta Order ($25k):   Status={res2['status']} | Available=${res2['available_credit_cents']/100:,.2f} | Util={res2['utilization_pct']}%")


print("\n=== PART 2: COMMERCIAL INVOICING & PAYMENT TERMS ENGINE ===")
class PaymentTerms(Enum):
    NET_30 = "Net 30"
    NET_60 = "Net 60"
    NET_90 = "Net 90"
    TWO_TEN_NET_30 = "2/10 Net 30"

class PaymentTermsCalculator:
    def calculate_settlement(self, invoice_amount_cents: int, terms: PaymentTerms, days_elapsed: int) -> dict:
        discount_cents = 0
        discount_applied = False
        due_days = 30
        
        if terms == PaymentTerms.NET_30:
            due_days = 30
        elif terms == PaymentTerms.NET_60:
            due_days = 60
        elif terms == PaymentTerms.NET_90:
            due_days = 90
        elif terms == PaymentTerms.TWO_TEN_NET_30:
            due_days = 30
            if days_elapsed <= 10:
                discount_cents = int(round(invoice_amount_cents * 0.02))
                discount_applied = True

        net_payable = invoice_amount_cents - discount_cents
        is_overdue = days_elapsed > due_days
        days_overdue = max(0, days_elapsed - due_days)

        # Annualized return for 2/10 Net 30: (2 / 98) * (365 / 20) = 37.24%
        annualized_discount_roi = 37.24 if terms == PaymentTerms.TWO_TEN_NET_30 else 0.0

        return {
            "invoice_amount_cents": invoice_amount_cents,
            "terms": terms.value,
            "days_elapsed": days_elapsed,
            "discount_cents": discount_cents,
            "discount_applied": discount_applied,
            "net_payable_cents": net_payable,
            "is_overdue": is_overdue,
            "days_overdue": days_overdue,
            "annualized_discount_roi_pct": annualized_discount_roi
        }

pt_calc = PaymentTermsCalculator()
inv1 = pt_calc.calculate_settlement(10000000, PaymentTerms.TWO_TEN_NET_30, days_elapsed=8)
inv2 = pt_calc.calculate_settlement(10000000, PaymentTerms.TWO_TEN_NET_30, days_elapsed=25)
inv3 = pt_calc.calculate_settlement(5000000, PaymentTerms.NET_60, days_elapsed=68)

print(f"Inv1 (8d, 2/10 N30):  Net=${inv1['net_payable_cents']/100:,.2f} | Discount=${inv1['discount_cents']/100:,.2f} [ROI={inv1['annualized_discount_roi_pct']}%]")
print(f"Inv2 (25d, 2/10 N30): Net=${inv2['net_payable_cents']/100:,.2f} | Discount=${inv2['discount_cents']/100:,.2f} | Overdue={inv2['is_overdue']}")
print(f"Inv3 (68d, Net 60):   Net=${inv3['net_payable_cents']/100:,.2f} | Overdue={inv3['is_overdue']} ({inv3['days_overdue']} days late)")


print("\n=== PART 3: ACCOUNTS RECEIVABLE (AR) AGING SCHEDULE ENGINE ===")
@dataclass
class InvoiceRecord:
    invoice_id: str
    account_id: str
    amount_cents: int
    days_past_due: int

class ARAgingScheduleEngine:
    BUCKET_LOSS_RATES = {
        "CURRENT": 0.005,    # 0.5% CECL expected credit loss
        "DAYS_1_30": 0.02,   # 2.0%
        "DAYS_31_60": 0.08,  # 8.0%
        "DAYS_61_90": 0.25,  # 25.0%
        "DAYS_OVER_90": 0.60 # 60.0%
    }

    def generate_aging_schedule(self, invoices: List[InvoiceRecord]) -> dict:
        buckets: Dict[str, int] = {k: 0 for k in self.BUCKET_LOSS_RATES}
        
        for inv in invoices:
            dpd = inv.days_past_due
            if dpd <= 0:
                buckets["CURRENT"] += inv.amount_cents
            elif dpd <= 30:
                buckets["DAYS_1_30"] += inv.amount_cents
            elif dpd <= 60:
                buckets["DAYS_31_60"] += inv.amount_cents
            elif dpd <= 90:
                buckets["DAYS_61_90"] += inv.amount_cents
            else:
                buckets["DAYS_OVER_90"] += inv.amount_cents

        total_ar = sum(buckets.values())
        loss_provision = sum(int(round(buckets[b] * self.BUCKET_LOSS_RATES[b])) for b in buckets)
        delinquent_ar = total_ar - buckets["CURRENT"]
        delinquency_rate = (delinquent_ar / total_ar * 100.0) if total_ar > 0 else 0.0

        return {
            "total_ar_cents": total_ar,
            "buckets": buckets,
            "required_loss_provision_cents": loss_provision,
            "delinquency_rate_pct": round(delinquency_rate, 1)
        }

aging_engine = ARAgingScheduleEngine()
portfolio = [
    InvoiceRecord("INV-101", "CORP-A", 12000000, days_past_due=0),   # $120k current
    InvoiceRecord("INV-102", "CORP-B", 4500000, days_past_due=14),   # $45k 1-30d
    InvoiceRecord("INV-103", "CORP-C", 3000000, days_past_due=42),   # $30k 31-60d
    InvoiceRecord("INV-104", "CORP-D", 1500000, days_past_due=75),   # $15k 61-90d
    InvoiceRecord("INV-105", "CORP-E", 800000, days_past_due=110),   # $8k >90d
]

aging = aging_engine.generate_aging_schedule(portfolio)
print(f"Total AR Portfolio: ${aging['total_ar_cents']/100:,.2f} | Delinquency Rate: {aging['delinquency_rate_pct']}%")
print(f"  Current (0-30d):  ${aging['buckets']['CURRENT']/100:,.2f}")
print(f"  1-30 Days Late:   ${aging['buckets']['DAYS_1_30']/100:,.2f}")
print(f"  31-60 Days Late:  ${aging['buckets']['DAYS_31_60']/100:,.2f}")
print(f"  61-90 Days Late:  ${aging['buckets']['DAYS_61_90']/100:,.2f}")
print(f"  Over 90 Days:     ${aging['buckets']['DAYS_OVER_90']/100:,.2f}")
print(f"CECL Loss Reserve:  ${aging['required_loss_provision_cents']/100:,.2f}")


print("\n=== PART 4: AUTOMATED DUNNING & LATE INTEREST ENGINE ===")
class DunningStage(Enum):
    COURTESY_REMINDER = "COURTESY_REMINDER"  # 1-15 DPD
    FORMAL_NOTICE = "FORMAL_NOTICE"          # 16-30 DPD (+1.5% interest)
    CREDIT_WARNING = "CREDIT_WARNING"        # 31-60 DPD (+3.0% interest)
    CREDIT_FROZEN = "CREDIT_FROZEN"          # >60 DPD (Credit locked)

class AutomatedDunningStateMachine:
    def evaluate_dunning(self, invoice_amount_cents: int, days_past_due: int) -> dict:
        interest_rate_pct = 0.0
        stage = DunningStage.COURTESY_REMINDER
        credit_hold = False

        if days_past_due <= 15:
            stage = DunningStage.COURTESY_REMINDER
            interest_rate_pct = 0.0
            credit_hold = False
        elif days_past_due <= 30:
            stage = DunningStage.FORMAL_NOTICE
            interest_rate_pct = 1.5
            credit_hold = False
        elif days_past_due <= 60:
            stage = DunningStage.CREDIT_WARNING
            interest_rate_pct = 3.0
            credit_hold = False
        else:
            stage = DunningStage.CREDIT_FROZEN
            interest_rate_pct = 5.0
            credit_hold = True

        penalty_interest_cents = int(round(invoice_amount_cents * (interest_rate_pct / 100.0)))
        total_balance_cents = invoice_amount_cents + penalty_interest_cents

        return {
            "days_past_due": days_past_due,
            "stage": stage.value,
            "interest_rate_pct": interest_rate_pct,
            "penalty_interest_cents": penalty_interest_cents,
            "total_balance_cents": total_balance_cents,
            "credit_hold": credit_hold
        }

dunning = AutomatedDunningStateMachine()
d1 = dunning.evaluate_dunning(5000000, days_past_due=8)
d2 = dunning.evaluate_dunning(5000000, days_past_due=24)
d3 = dunning.evaluate_dunning(5000000, days_past_due=72)

print(f"8d Late:  Stage={d1['stage']} | Penalty=${d1['penalty_interest_cents']/100:.2f} | Hold={d1['credit_hold']}")
print(f"24d Late: Stage={d2['stage']} | Penalty=${d2['penalty_interest_cents']/100:.2f} | Hold={d2['credit_hold']}")
print(f"72d Late: Stage={d3['stage']} | Penalty=${d3['penalty_interest_cents']/100:.2f} | Hold={d3['credit_hold']}")


print("\n=== PART 5: AR TREASURY COMMAND TOWER & DSO TELEMETRY ===")
class ARTreasuryTower:
    def compute_treasury_kpis(self, total_ar_cents: int, annual_credit_sales_cents: int, past_due_ar_cents: int) -> dict:
        # Days Sales Outstanding (DSO) = (Total AR / Annual Credit Sales) * 365
        dso_days = (total_ar_cents / annual_credit_sales_cents) * 365.0 if annual_credit_sales_cents > 0 else 0.0
        # Collection Effectiveness Index (CEI) = (Total AR - Current Past Due) / Total AR * 100
        cei_pct = ((total_ar_cents - past_due_ar_cents) / total_ar_cents * 100.0) if total_ar_cents > 0 else 100.0
        delinquent_ratio_pct = (past_due_ar_cents / total_ar_cents * 100.0) if total_ar_cents > 0 else 0.0

        return {
            "total_ar_cents": total_ar_cents,
            "annual_credit_sales_cents": annual_credit_sales_cents,
            "past_due_ar_cents": past_due_ar_cents,
            "dso_days": round(dso_days, 1),
            "cei_pct": round(cei_pct, 1),
            "delinquent_ratio_pct": round(delinquent_ratio_pct, 1)
        }

treasury = ARTreasuryTower()
kpis = treasury.compute_treasury_kpis(
    total_ar_cents=21800000,            # $218k total AR
    annual_credit_sales_cents=180000000, # $1.8M annual credit sales
    past_due_ar_cents=9800000           # $98k past due AR
)

print("AR Treasury Executive Dashboard:")
print(f"  Total Accounts Receivable: ${kpis['total_ar_cents']/100:,.2f}")
print(f"  Days Sales Outstanding:    {kpis['dso_days']} Days (Benchmark Target: < 45 Days)")
print(f"  Collection Effectiveness:  {kpis['cei_pct']}% (Target: > 85%)")
print(f"  Delinquent AR Exposure:    ${kpis['past_due_ar_cents']/100:,.2f} ({kpis['delinquent_ratio_pct']}%)")
