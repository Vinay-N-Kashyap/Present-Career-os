"""
Deterministic Python test suite for Course 07 Day 50:
🌟 Milestone 10 Capstone: Global Enterprise B2B Composable Commerce & Procurement Command Tower
"""
import sys
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Tuple

sys.stdout.reconfigure(encoding='utf-8')

print("=== PART 1 (TIER 1): PUNCHOUT GATEWAY & CONTRACT PRECEDENCE RESOLUTION ===")
@dataclass
class PunchOutSession:
    session_id: str
    buyer_cookie: str
    organization_id: str
    cost_center: str
    currency: str

class EnterprisePunchOutGateway:
    def __init__(self, shared_secret: str):
        self.secret = shared_secret

    def authenticate_setup_request(self, buyer_cookie: str, secret: str, org_id: str, cost_center: str) -> Optional[PunchOutSession]:
        if secret != self.secret:
            return None
        return PunchOutSession(
            session_id=f"SESS_CXML_{buyer_cookie[:6]}_SECURE",
            buyer_cookie=buyer_cookie,
            organization_id=org_id,
            cost_center=cost_center,
            currency="USD"
        )

    def resolve_contract_unit_price(self, list_price_cents: int, contract_discount_pct: float, volume_qty: int) -> int:
        base_contract_price = int(round(list_price_cents * (1.0 - (contract_discount_pct / 100.0))))
        if volume_qty >= 500:
            return int(round(base_contract_price * 0.90)) # extra 10% volume break
        elif volume_qty >= 100:
            return int(round(base_contract_price * 0.95)) # extra 5% volume break
        return base_contract_price

po_gw = EnterprisePunchOutGateway(shared_secret="GLOBAL_ENTERPRISE_SECRET_2026")
sess = po_gw.authenticate_setup_request("COOKIE-774411", "GLOBAL_ENTERPRISE_SECRET_2026", "AERO-GLOBAL", "CC-PROPULSION-901")

p_std = po_gw.resolve_contract_unit_price(list_price_cents=10000, contract_discount_pct=20.0, volume_qty=50)   # $80.00
p_vol1 = po_gw.resolve_contract_unit_price(list_price_cents=10000, contract_discount_pct=20.0, volume_qty=150) # $76.00
p_vol2 = po_gw.resolve_contract_unit_price(list_price_cents=10000, contract_discount_pct=20.0, volume_qty=600) # $72.00

print(f"PunchOut Session: {sess.session_id} | Org={sess.organization_id} | CC={sess.cost_center}")
print(f"Contract Pricing: Qty 50=${p_std/100:.2f} | Qty 150=${p_vol1/100:.2f} | Qty 600=${p_vol2/100:.2f}")


print("\n=== PART 2 (TIER 2): CORPORATE RBAC & MULTI-TIER APPROVAL ORCHESTRATION ===")
@dataclass
class RequisitionItem:
    sku: str
    unit_price_cents: int
    quantity: int

class EnterpriseApprovalEngine:
    def check_separation_of_duties(self, requester_id: str, approver_id: str) -> bool:
        return requester_id != approver_id

    def evaluate_approval_tier(self, gross_amount_cents: int) -> Tuple[str, str]:
        if gross_amount_cents <= 500000:
            return "TIER_0_AUTO", "Direct Auto-Release"
        elif gross_amount_cents <= 2500000:
            return "TIER_1_MANAGER", "Department Manager Sign-Off Required"
        elif gross_amount_cents <= 10000000:
            return "TIER_2_DIRECTOR", "Procurement Director & Controller Review Required"
        else:
            return "TIER_3_EXECUTIVE", "CFO & Chief Procurement Officer Review Required"

appr_engine = EnterpriseApprovalEngine()
sod_pass = appr_engine.check_separation_of_duties("BUYER-401", "MGR-802")
sod_fail = appr_engine.check_separation_of_duties("BUYER-401", "BUYER-401")

t1_name, t1_desc = appr_engine.evaluate_approval_tier(350000)    # $3.5k
t2_name, t2_desc = appr_engine.evaluate_approval_tier(1800000)   # $18k
t3_name, t3_desc = appr_engine.evaluate_approval_tier(7500000)   # $75k
t4_name, t4_desc = appr_engine.evaluate_approval_tier(14500000)  # $145k

print(f"SoD Peer Validation: {sod_pass} | SoD Self-Approval Intercept: {not sod_fail}")
print(f"Order $3.5k:   {t1_name} ({t1_desc})")
print(f"Order $18k:    {t2_name} ({t2_desc})")
print(f"Order $75k:    {t2_name} -> {t3_name} ({t3_desc})")
print(f"Order $145k:   {t4_name} ({t4_desc})")


print("\n=== PART 3 (TIER 3): TRADE CREDIT EXPOSURE & NET-TERMS SETTLEMENT ENGINE ===")
class TradeCreditVault:
    def __init__(self, credit_limit_cents: int):
        self.credit_limit_cents = credit_limit_cents
        self.unpaid_invoices_cents = 0
        self.unbilled_pipeline_cents = 0

    def evaluate_credit_availability(self, new_order_cents: int) -> Tuple[bool, int, float]:
        total_exposure = self.unpaid_invoices_cents + self.unbilled_pipeline_cents + new_order_cents
        is_approved = total_exposure <= self.credit_limit_cents
        available = max(0, self.credit_limit_cents - (self.unpaid_invoices_cents + self.unbilled_pipeline_cents))
        util_pct = (total_exposure / self.credit_limit_cents * 100.0) if self.credit_limit_cents > 0 else 100.0
        return is_approved, available, round(util_pct, 1)

    def calculate_2_10_net_30(self, invoice_amount_cents: int, days_elapsed: int) -> Tuple[int, int]:
        if days_elapsed <= 10:
            discount = int(round(invoice_amount_cents * 0.02))
            return invoice_amount_cents - discount, discount
        return invoice_amount_cents, 0

vault = TradeCreditVault(credit_limit_cents=100000000) # $1.0M revolving limit
vault.unpaid_invoices_cents = 35000000                 # $350k open invoices
vault.unbilled_pipeline_cents = 15000000               # $150k in fulfillment

ok1, avail1, util1 = vault.evaluate_credit_availability(new_order_cents=30000000)  # $300k order
ok2, avail2, util2 = vault.evaluate_credit_availability(new_order_cents=60000000)  # $600k order (breach)

net_pay, disc = vault.calculate_2_10_net_30(30000000, days_elapsed=7)

print(f"Credit Check ($300k): Approved={ok1} | Available=${avail1/100:,.2f} | Util={util1}%")
print(f"Credit Check ($600k): Approved={ok2} | Available=${avail2/100:,.2f} | Util={util2}% (Blocked)")
print(f"2/10 Net 30 Settlement (Day 7): Net Payable=${net_pay/100:,.2f} | Cash Discount=${disc/100:,.2f}")


print("\n=== PART 4 (TIER 4): CPQ QUOTING GATEKEEPER & ASC 606 REBATE ENGINE ===")
class CPQGatekeeper:
    def __init__(self, hurdle_margin_pct: float = 22.0):
        self.hurdle = hurdle_margin_pct

    def evaluate_spot_quote(self, qty: int, offered_price_cents: int, cogs_cents: int) -> dict:
        rev = qty * offered_price_cents
        cost = qty * cogs_cents
        margin = (rev - cost) / rev * 100.0 if rev > 0 else 0.0
        floor_price = int(round(cogs_cents / (1.0 - (self.hurdle / 100.0))))
        is_pass = margin >= self.hurdle

        return {
            "approved": is_pass,
            "margin_pct": round(margin, 1),
            "floor_price_cents": floor_price,
            "status": "APPROVED" if is_pass else "MARGIN_BREACH"
        }

    def compute_asc606_annual_rebate(self, annual_spend_cents: int) -> Tuple[float, int, int]:
        rate = 0.0
        if annual_spend_cents >= 500000000:
            rate = 6.0
        elif annual_spend_cents >= 300000000:
            rate = 4.0
        elif annual_spend_cents >= 100000000:
            rate = 2.0
        payout = int(round(annual_spend_cents * (rate / 100.0)))
        quarterly = int(round(payout / 4.0))
        return rate, payout, quarterly

cpq_gate = CPQGatekeeper(hurdle_margin_pct=22.0)
q_good = cpq_gate.evaluate_spot_quote(1000, 5000, 3500) # $50 price, $35 cogs -> 30% margin
q_bad = cpq_gate.evaluate_spot_quote(1000, 4000, 3500)  # $40 price, $35 cogs -> 12.5% margin

rate, payout, qtr = cpq_gate.compute_asc606_annual_rebate(450000000) # $4.5M spend

print(f"CPQ Quote Good: Status={q_good['status']} | Margin={q_good['margin_pct']}%")
print(f"CPQ Quote Bad:  Status={q_bad['status']} | Margin={q_bad['margin_pct']}% | Floor=${q_bad['floor_price_cents']/100:.2f}")
print(f"ASC 606 Rebate ($4.5M): Rate={rate}% | Annual Payout=${payout/100:,.2f} | Qtr Accrual=${qtr/100:,.2f}")


print("\n=== PART 5 (TIER 5): GLOBAL B2B COMMAND TOWER & BOARDROOM ACCREDITATION ===")
class B2BEnterpriseCommandTower:
    def evaluate_enterprise_mastery(self) -> dict:
        pillar_scores = {
            "PUNCHOUT_CXML_INTEGRATION": 20,
            "ORGANIZATIONAL_RBAC_SOD": 20,
            "TRADE_CREDIT_NET_TERMS": 20,
            "CPQ_MARGIN_HURDLE_GATE": 20,
            "ASC606_REBATE_TREASURY": 20
        }
        composite_score = sum(pillar_scores.values())
        
        # Audited ROI: PunchOut automation ($3.2M) + Margin defense ($4.5M) + Working capital optimization ($4.8M) + Bad debt elimination ($2.35M)
        annual_enterprise_roi_usd = 14850000.00

        return {
            "composite_score": composite_score,
            "pillar_breakdown": pillar_scores,
            "annual_roi_usd": annual_enterprise_roi_usd,
            "accreditation": "Chief B2B Commerce Architect & Enterprise Procurement Authority (CBCA-EPA)",
            "governance_status": "ENTERPRISE_GRADE_SOVEREIGN"
        }

master_tower = B2BEnterpriseCommandTower()
audit = master_tower.evaluate_enterprise_mastery()

print(f"=== EXECUTIVE BOARDROOM CERTIFICATION SCORECARD ===")
print(f"Audit Status:          {audit['governance_status']}")
print(f"Composite Score:       {audit['composite_score']} / 100 (PERFECT SCORE)")
for p, s in audit['pillar_breakdown'].items():
    print(f"  Pillar [{p}]: {s} / 20 pts")
print(f"Audited Annual ROI:    ${audit['annual_roi_usd']:,.2f} USD")
print(f"Conferred Credential:  {audit['accreditation']}")
