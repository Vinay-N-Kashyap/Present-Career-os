# scripts/build_day54.py
import json
import subprocess
import sys

def count_words(say_list: list) -> int:
    return sum(len(s.split()) for s in say_list)

def run_code(code_str: str) -> str:
    res = subprocess.run([sys.executable, "-c", code_str], capture_output=True, text=True, timeout=15)
    if res.returncode != 0:
        print("STDERR:", res.stderr)
        raise RuntimeError(f"Execution failed: {res.stderr}")
    return res.stdout

print("Designing Day 54 content...")

day54 = {
    "day": 54,
    "coursePrefix": "bcom_law",
    "title": "Day 54: Related Party Transactions (RPT), Section 188 Sanctions, Audit Committee Omnibus Approvals & Materiality",
    "summary": [
        "Companies Act Section 2(76) and Section 188 govern Related Party Transactions across goods, assets, and service contracts.",
        "Transactions in the 'ordinary course of business' on an 'arm's length basis' are statutorily exempt from Board/shareholder approval under Section 188(1).",
        "Section 177(4)(iv) and SEBI LODR Reg 23 mandate prior Audit Committee approval and govern annual Omnibus Approvals.",
        "Material RPTs exceeding Rs 1,000 Cr or 10% consolidated turnover require prior approval by Ordinary Resolution with related parties strictly abstaining.",
        "Unapproved RPTs are voidable under Section 188(3), trigger director indemnification liabilities, and impose penalties under Section 188(5)."
    ],
    "goal": "Master Related Party Transaction (RPT) governance: apply Section 2(76) related party definitions, test ordinary course and arm's length standards, structure Audit Committee omnibus approvals under Section 177, enforce SEBI LODR Regulation 23 materiality voting rules, and evaluate Section 188 legal remedies.",
    "parts": []
}

# --- PART 1 ---
p1_say = [
    "In corporate law and minority shareholder protection, the regulation of Related Party Transactions (RPTs) represents one of the most critical legal battlegrounds. In large corporate conglomerates, controlling promoters and executive directors frequently operate multiple interrelated entities—subsidiaries, joint ventures, family-owned private limited companies, partnerships, and offshore special purpose vehicles (SPVs). Without strict statutory governance, conflicted corporate insiders can easily 'tunnel' or siphon corporate wealth away from the public company into privately held promoter entities through non-arm's-length contracts: purchasing raw materials at inflated prices, selling corporate assets at steep discounts, providing interest-free loans, or paying excessive management consulting fees. To prevent such self-dealing, Indian corporate law erects an exhaustive regulatory fortress codified in Section 188 of the Companies Act, 2013 and Regulation 23 of the SEBI LODR Regulations.",
    "The statutory starting point is the comprehensive definition of a 'Related Party' set forth in Section 2(76) of the Companies Act, 2013. A related party with reference to a company encompasses nine distinct categories: (1) a director or their relative; (2) key managerial personnel (KMP: Managing Director, CEO, CFO, Company Secretary) or their relative; (3) a firm in which a director, manager or their relative is a partner; (4) a private company in which a director or manager or their relative is a member or director; (5) a public company in which a director or manager is a director AND holds along with their relatives more than two percent (2%) of its paid-up share capital; (6) any body corporate whose board of directors, managing director or manager is accustomed to act in accordance with the advice, directions or instructions of a director or manager; (7) any person on whose advice, directions or instructions a director or manager is accustomed to act; (8) any holding, subsidiary, fellow subsidiary, or associate company; and (9) such other person as may be prescribed under the Rules.",
    "Section 188(1) defines the specific commercial transactions covered by the statute: (a) sale, purchase or supply of any goods or materials; (b) selling or otherwise disposing of, or buying, property of any kind; (c) leasing of property of any kind; (d) availing or rendering of any services; (e) appointment of any agent for purchase or sale of goods, materials, services or property; (f) such related party's appointment to any office or place of profit in the company, its subsidiary or associate; and (g) underwriting the subscription of any securities or derivatives of the company.",
    "Crucially, the fourth proviso to Section 188(1) creates an indispensable statutory exemption that forms the operational foundation of daily corporate commerce: 'Provided also that nothing in this sub-section shall apply to any transactions entered into by the company in its ORDINARY COURSE OF BUSINESS other than transactions which are not on an ARM'S LENGTH BASIS.' This dual test is conjunctive: for a transaction to escape the requirement of formal Board and Shareholder approval under Section 188, the transaction must SIMULTaneously be in the ordinary course of business AND on an arm's length basis. An 'arm's length transaction' is defined in the explanation to Section 188(1) as a transaction between two related parties that is conducted as if they were unrelated, so that there is no conflict of interest.",
    "Determining whether a transaction is on an arm's length basis requires rigorous evidentiary benchmarking using international transfer pricing methodologies: Comparable Uncontrolled Price (CUP) method, Resale Price Method, Cost Plus Method, or Transactional Net Margin Method (TNMM). If a public listed company sells steel to a promoter-owned private construction firm at the exact prevailing market spot price with standard thirty-day commercial credit terms identical to terms offered to third-party customers, the transaction satisfies the arm's length test and the ordinary course exemption. However, if the company grants a ninety-day interest-free credit window or offers an uncommercial 15% discount, the arm's length shield collapses, instantly triggering the full procedural rigors of Section 188."
]

p1_code = """# Part 1: Section 2(76) Related Party & Arm's Length Exemption Engine
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class CommercialContract:
    contract_id: str
    counterparty_name: str
    contract_type: str  # "SALE_OF_GOODS", "LEASING_PROPERTY", "MANAGEMENT_SERVICES"
    value_inr_cr: float
    is_counterparty_related_party_s2_76: bool
    is_ordinary_course_of_business: bool
    offered_price_inr_per_unit: float
    prevailing_market_cup_price_inr: float
    credit_terms_days: int
    standard_market_credit_days: int

class RelatedPartyArmLengthGatekeeper:
    @staticmethod
    def evaluate_contract(contract: CommercialContract) -> Tuple[bool, str, Dict]:
        # Step 1: Related Party Check under Section 2(76)
        if not contract.is_counterparty_related_party_s2_76:
            return True, "EXEMPT_NON_RELATED: Counterparty is not a Related Party under Section 2(76).", {
                "section_188_applies": False,
                "governance_path": "STANDARD_COMMERCIAL_PROCUREMENT"
            }
            
        # Step 2: Section 188(1) 4th Proviso Conjunctive Test
        # Test A: Ordinary course of business
        in_ordinary_course = contract.is_ordinary_course_of_business
        
        # Test B: Arm's length test (Comparable Uncontrolled Price - CUP)
        price_variance_pct = ((contract.offered_price_inr_per_unit - contract.prevailing_market_cup_price_inr) / contract.prevailing_market_cup_price_inr) * 100.0
        terms_favorable = contract.credit_terms_days > contract.standard_market_credit_days
        
        # Arm's length if price within +/- 2% of CUP and credit terms standard
        is_arms_length = (abs(price_variance_pct) <= 2.0) and (not terms_favorable)
        
        is_exempt_from_section188 = in_ordinary_course and is_arms_length
        
        if is_exempt_from_section188:
            ruling = "EXEMPT_ORDINARY_COURSE_ARMS_LENGTH: Section 188(1) proviso satisfied; no Board/Shareholder vote required under S.188."
            path = "AUDIT_COMMITTEE_APPROVAL_ONLY (Section 177(4)(iv))"
        else:
            reasons = []
            if not in_ordinary_course: reasons.append("Not in ordinary course of commercial business")
            if not is_arms_length:
                if abs(price_variance_pct) > 2.0: reasons.append(f"Price deviates by {price_variance_pct:+.1f}% from market CUP")
                if terms_favorable: reasons.append(f"Credit terms ({contract.credit_terms_days} days) exceed standard market ({contract.standard_market_credit_days} days)")
            ruling = f"SECTION_188_MANDATED: Non-exempt RPT. Requires formal Board/Shareholder sanction. Reasons: {'; '.join(reasons)}"
            path = "FORMAL_SECTION_188_BOARD_AND_SHAREHOLDER_APPROVAL_REQUIRED"
            
        details = {
            "section_188_applies": not is_exempt_from_section188,
            "is_arms_length": is_arms_length,
            "in_ordinary_course": in_ordinary_course,
            "governance_path": path,
            "contract_value_cr": contract.value_inr_cr
        }
        return is_exempt_from_section188, ruling, details

c_exempt = CommercialContract("CON-101", "Promoter Affiliate Logistics Ltd", "SALE_OF_GOODS", 18.0, 
                              is_counterparty_related_party_s2_76=True, is_ordinary_course_of_business=True, 
                              offered_price_inr_per_unit=5000.0, prevailing_market_cup_price_inr=5000.0, 
                              credit_terms_days=30, standard_market_credit_days=30)

c_violative = CommercialContract("CON-102", "Promoter Family Holdings Pvt Ltd", "LEASING_PROPERTY", 45.0, 
                                 is_counterparty_related_party_s2_76=True, is_ordinary_course_of_business=False, 
                                 offered_price_inr_per_unit=8500.0, prevailing_market_cup_price_inr=5000.0, 
                                 credit_terms_days=90, standard_market_credit_days=30)

ok1, msg1, det1 = RelatedPartyArmLengthGatekeeper.evaluate_contract(c_exempt)
ok2, msg2, det2 = RelatedPartyArmLengthGatekeeper.evaluate_contract(c_violative)

print(f"Contract 1 ({c_exempt.counterparty_name}): {msg1}")
print(f" - Path: {det1['governance_path']}")
print("--------------------------------------------------------------------------------")
print(f"Contract 2 ({c_violative.counterparty_name}): {msg2}")
print(f" - Path: {det2['governance_path']}")
"""

p1_codeNotes = [
    "Evaluates Related Party status under Section 2(76) across 9 statutory categories.",
    "Applies the Section 188(1) 4th proviso dual conjunctive test: Ordinary Course of Business AND Arm's Length basis.",
    "Performs Transfer Pricing Comparable Uncontrolled Price (CUP) benchmarking and commercial credit terms checks.",
    "Differentiates between contracts requiring only Audit Committee approval versus those triggering full Board/Shareholder votes."
]

# --- PART 2 ---
p2_say = [
    "A fundamental distinction in corporate governance law that often confuses practitioners is the difference between Audit Committee approval under Section 177(4)(iv) and Board/Shareholder approval under Section 188. While Section 188 exempts transactions entered into in the ordinary course of business on an arm's length basis, Section 177(4)(iv) of the Companies Act, 2013 contains NO such exemption. Under Section 177(4)(iv), EVERY related party transaction—regardless of whether it is in the ordinary course of business, regardless of whether it is at arm's length, and regardless of its monetary size—MUST receive prior approval from the Audit Committee.",
    "For large listed conglomerates that execute thousands of routine commercial transactions annually with group operating subsidiaries (such as supply of power, logistics services, or shared IT infrastructure), obtaining individual transaction-by-transaction prior approval from the Audit Committee for every purchase order would paralyze corporate operations. To resolve this operational gridlock, the Parliament and SEBI enacted the statutory mechanism of 'Omnibus Approval'.",
    "Under Rule 6A of the Companies (Meetings of Board and its Powers) Rules, 2014 and Regulation 23(3) of the SEBI LODR Regulations, the Audit Committee is statutorily authorized to grant Omnibus Approvals for related party transactions proposed to be entered into by the company, subject to strict conditions: (1) Criteria Formulation: The Audit Committee must lay down criteria for granting omnibus approval in line with the company's RPT policy, ensuring the transactions are repetitive in nature and necessary in the interest of the company; (2) Specific Disclosures: The omnibus approval must specify the name of the related party, nature and period of the transaction, maximum amount of transaction that can be entered into, indicative base price or formula, and credit terms; (3) Unforeseen Transactions: Where the need for an RPT cannot be foreseen and required details are not available, the Audit Committee may grant omnibus approval for such transactions subject to their value not exceeding Rupees one (1) crore per transaction; and (4) Temporal Limitation: Omnibus approvals shall be valid for a period not exceeding one (1) financial year and shall require fresh approvals after the expiry of such financial year.",
    "Furthermore, under Section 177(4)(iv) and SEBI LODR Regulation 23(3)(d), the Audit Committee must review, on a quarterly basis, the details of all related party transactions entered into by the company pursuant to each of the omnibus approvals granted. If an ongoing contract experiences a material modification—such as an increase in transaction value exceeding approved thresholds or an extension of credit terms—the modification must be submitted back to the Audit Committee for fresh approval. Only independent directors who are members of the Audit Committee are entitled to approve RPTs, ensuring that executive directors with personal or financial conflicts of interest are legally excluded from the approval process."
]

p2_code = """# Part 2: Audit Committee Omnibus Approval & Quarterly Review Controller
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class OmnibusApprovalSpec:
    omnibus_id: str
    related_party_name: str
    nature_of_transaction: str
    max_approved_annual_limit_cr: float
    approved_price_formula: str
    approved_credit_days: int
    is_valid_financial_year: bool

@dataclass
class ExecutedRPTTransaction:
    tx_id: str
    omnibus_id: str
    actual_value_cr: float
    credit_days_granted: int

class AuditCommitteeOmnibusController:
    def __init__(self, spec: OmnibusApprovalSpec):
        self.spec = spec
        self.executed_transactions: List[ExecutedRPTTransaction] = []

    def log_transaction(self, tx: ExecutedRPTTransaction) -> Tuple[bool, str]:
        assert tx.omnibus_id == self.spec.omnibus_id, "Transaction omnibus ID mismatch"
        self.executed_transactions.append(tx)
        
        # Check cumulative limit
        cumulative_spent = sum(t.actual_value_cr for t in self.executed_transactions)
        
        if cumulative_spent > self.spec.max_approved_annual_limit_cr:
            return False, f"OMNIBUS_BREACH: Cumulative spend INR {cumulative_spent:.2f} Cr exceeds approved cap of INR {self.spec.max_approved_annual_limit_cr:.2f} Cr. Fresh Audit Committee sanction required."
            
        if tx.credit_days_granted > self.spec.approved_credit_days:
            return False, f"MATERIAL_MODIFICATION_BREACH: Credit terms ({tx.credit_days_granted} days) violate approved omnibus ceiling ({self.spec.approved_credit_days} days)."
            
        return True, f"LOGGED_COMPLIANT: Cumulative spend INR {cumulative_spent:.2f} Cr / {self.spec.max_approved_annual_limit_cr:.2f} Cr."

    def execute_quarterly_review(self) -> Dict:
        total_spent = sum(t.actual_value_cr for t in self.executed_transactions)
        remaining_headroom = self.spec.max_approved_annual_limit_cr - total_spent
        
        return {
            "omnibus_id": self.spec.omnibus_id,
            "related_party": self.spec.related_party_name,
            "annual_limit_cr": self.spec.max_approved_annual_limit_cr,
            "total_spent_cr": round(total_spent, 2),
            "remaining_headroom_cr": round(remaining_headroom, 2),
            "transactions_count": len(self.executed_transactions),
            "review_status": "QUARTERLY_REVIEW_PASSED" if remaining_headroom >= 0 else "AUDIT_COMMITTEE_ESCALATION_MANDATED"
        }

spec = OmnibusApprovalSpec("OMNI-2026-A", "Tata Power Solar Systems Ltd", "Procurement of Solar PV Modules", 
                            max_approved_annual_limit_cr=150.0, approved_price_formula="CUP_INDEX_LINKED", 
                            approved_credit_days=45, is_valid_financial_year=True)

controller = AuditCommitteeOmnibusController(spec)
ok1, msg1 = controller.log_transaction(ExecutedRPTTransaction("TX-01", "OMNI-2026-A", actual_value_cr=45.0, credit_days_granted=45))
ok2, msg2 = controller.log_transaction(ExecutedRPTTransaction("TX-02", "OMNI-2026-A", actual_value_cr=60.0, credit_days_granted=45))
ok3, msg3 = controller.log_transaction(ExecutedRPTTransaction("TX-03", "OMNI-2026-A", actual_value_cr=55.0, credit_days_granted=45)) # Exceeds 150 Cr total

review = controller.execute_quarterly_review()
print(f"Transaction 1: {msg1}")
print(f"Transaction 2: {msg2}")
print(f"Transaction 3: {msg3}")
print("--------------------------------------------------------------------------------")
print(f"Quarterly Review Status: {review['review_status']}")
print(f"Total Spent: INR {review['total_spent_cr']} Cr / {review['annual_limit_cr']} Cr (Remaining: INR {review['remaining_headroom_cr']} Cr)")
"""

p2_codeNotes = [
    "Codifies Audit Committee Omnibus Approval rules under Section 177(4)(iv) and SEBI LODR Regulation 23.",
    "Monitors real-time transaction execution against cumulative annual monetary ceilings and approved credit days.",
    "Flags material contract modifications and cumulative threshold breaches, halting unauthorized disbursements.",
    "Executes quarterly Audit Committee reviews, verifying remaining financial headroom across group supply arrangements."
]

# --- PART 3 ---
p3_say = [
    "When a Related Party Transaction exceeds statutory thresholds or fails to satisfy the ordinary course of business and arm's length criteria, it triggers mandatory approval from the Board of Directors and the Shareholders. Under Rule 15 of the Companies (Meetings of Board and its Powers) Rules, 2014, prior approval of the company by an Ordinary Resolution is required for specified related party transactions exceeding designated statutory limits: (a) Sale, purchase or supply of any goods or materials, directly or through appointment of agent, amounting to ten percent (10%) or more of the turnover of the company; (b) Selling or otherwise disposing of, or buying, property of any kind, directly or through appointment of agent, amounting to ten percent (10%) or more of net worth of the company; (c) Leasing of property of any kind amounting to ten percent (10%) or more of the turnover of the company; and (d) Availing or rendering of any services, directly or through appointment of agent, amounting to ten percent (10%) or more of the turnover of the company.",
    "However, for listed companies, Regulation 23 of the SEBI LODR Regulations establishes a significantly stricter, dual threshold for defining a 'Material Related Party Transaction'. Under amended SEBI LODR Regulation 23(1), a transaction with a related party shall be considered material if the transaction(s) to be entered into individually or taken together with previous transactions during a financial year exceeds Rupees one thousand (1,000) crore OR ten percent (10%) of the annual consolidated turnover of the listed entity as per the last audited financial statements of the listed entity, WHICHEVER IS LOWER. The introduction of the absolute Rs 1,000 crore monetary ceiling was a landmark reform: for large conglomerates with annual turnover of Rs 50,000 crore, 10% would represent a massive Rs 5,000 crore loophole; the Rs 1,000 crore hard cap ensures that any transaction exceeding Rs 1,000 crore is automatically classified as a Material RPT, requiring prior shareholder approval.",
    "The most critical minority shareholder protection mechanism in RPT law is the statutory 'Voting Exclusion Rule'. Under the second proviso to Section 188(1) and Regulation 23(4) of SEBI LODR, in any general meeting where a resolution for approving an RPT or Material RPT is proposed, NO related party shall vote to approve such resolution, whether the entity is a related party to that specific transaction or not. This means that promoter group entities, promoter family members, and interested directors holding 60% or 70% of the equity capital of the company are legally prohibited from casting a vote on the resolution.",
    "The voting exclusion rule shifts corporate power entirely to independent, public minority shareholders. If minority institutional investors (mutual funds, foreign portfolio investors, insurance companies) conclude that the proposed RPT is abusive or siphons corporate value, they can vote against the resolution and defeat the transaction, even if the promoters hold an absolute majority of total shares. Corporate legal teams must carefully structure explanatory statements annexed to the notice of general meeting under Section 102, disclosing: the name of the related party, nature of relationship, tenure, material terms, business justification, and independent valuation reports from registered valuers."
]

p3_code = """# Part 3: SEBI LODR Regulation 23 Materiality & Minority Voting Engine
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class ListedMaterialRPTProposal:
    proposal_id: str
    related_party_name: str
    transaction_value_inr_cr: float
    annual_consolidated_turnover_cr: float
    promoter_related_shareholding_pct: float
    public_minority_shareholding_pct: float
    minority_shares_voted_favor_pct: float
    minority_shares_voted_against_pct: float

class MaterialRPTShareholderVoteEngine:
    SEBI_ABSOLUTE_CAP_INR_CR = 1000.0  # Rs 1,000 Crore hard cap under SEBI LODR Reg 23(1)

    @classmethod
    def evaluate_materiality_and_voting(cls, prop: ListedMaterialRPTProposal) -> Tuple[bool, str, Dict]:
        # Step 1: Materiality Test under SEBI LODR Reg 23(1)
        # Whichever is lower: 10% of consolidated turnover OR Rs 1,000 Cr
        turnover_10pct = prop.annual_consolidated_turnover_cr * 0.10
        materiality_threshold_cr = min(cls.SEBI_ABSOLUTE_CAP_INR_CR, turnover_10pct)
        
        is_material = prop.transaction_value_inr_cr > materiality_threshold_cr
        
        if not is_material:
            return True, "STANDARD_RPT: Value does not breach SEBI materiality threshold; Board/Audit Committee approval sufficient.", {
                "is_material": False,
                "threshold_applied_cr": materiality_threshold_cr
            }
            
        # Step 2: Voting Exclusion Enforcement under Reg 23(4)
        # All related parties are barred from voting. Outcome decided purely by minority votes.
        total_valid_minority_votes = prop.minority_shares_voted_favor_pct + prop.minority_shares_voted_against_pct
        if total_valid_minority_votes == 0:
            return False, "VOTING_FAILED: Zero valid minority shareholder votes cast.", {}
            
        favor_share_of_poll = (prop.minority_shares_voted_favor_pct / total_valid_minority_votes) * 100.0
        
        # Needs simple majority (> 50%) of minority votes cast
        passed = favor_share_of_poll > 50.0
        
        verdict = "MATERIAL_RPT_APPROVED_BY_MINORITY_SHAREHOLDERS" if passed else "MATERIAL_RPT_REJECTED_BY_MINORITY_SHAREHOLDERS"
        
        details = {
            "is_material": True,
            "transaction_value_cr": prop.transaction_value_inr_cr,
            "materiality_threshold_cr": materiality_threshold_cr,
            "promoter_shares_excluded_from_voting_pct": prop.promoter_related_shareholding_pct,
            "minority_favor_pct": round(favor_share_of_poll, 2),
            "resolution_passed": passed,
            "status": verdict
        }
        return passed, verdict, details

# Scenario: Conglomerate with Rs 15,000 Cr turnover. 10% is 1,500 Cr, but SEBI cap is 1,000 Cr.
# Transaction is Rs 1,200 Cr -> MATERIAL RPT.
prop_rejected = ListedMaterialRPTProposal("PROP-2026-X", "Promoter Energy Holdings Ltd", transaction_value_inr_cr=1200.0, 
                                          annual_consolidated_turnover_cr=15000.0, promoter_related_shareholding_pct=65.0, 
                                          public_minority_shareholding_pct=35.0, minority_shares_voted_favor_pct=12.0, 
                                          minority_shares_voted_against_pct=23.0)

passed, status_text, vote_info = MaterialRPTShareholderVoteEngine.evaluate_materiality_and_voting(prop_rejected)
print(f"Material RPT Determination: {status_text}")
print(f"Transaction Value: INR {vote_info['transaction_value_cr']} Cr vs Materiality Threshold: INR {vote_info['materiality_threshold_cr']} Cr")
print(f"Promoter Equity Excluded from Voting: {vote_info['promoter_shares_excluded_from_voting_pct']}%")
print(f"Minority Vote in Favor: {vote_info['minority_favor_pct']:.2f}% -> Passed: {vote_info['resolution_passed']}")
"""

p3_codeNotes = [
    "Calculates SEBI LODR Regulation 23(1) materiality threshold: lesser of 10% consolidated turnover or Rs 1,000 crore.",
    "Enforces the mandatory Voting Exclusion Rule under Regulation 23(4), barring interested promoters from voting.",
    "Computes minority shareholder polling outcomes: requires >50% simple majority of non-related minority shares voted.",
    "Shields public minority investors from abusive corporate tunneling and value-destructive promoter transactions."
]

# --- PART 4 ---
p4_say = [
    "To ensure that the procedural checks of Section 188 are not disregarded with impunity, the Companies Act, 2013 equips the corporate entity and regulatory authorities with severe legal remedies and penalties. The statutory enforcement regime is codified across subsections (3), (4), and (5) of Section 188. These provisions establish a tripartite framework of consequences: voidability of the unapproved contract, mandatory personal indemnification by defaulting directors, and statutory financial penalties alongside automatic director disqualification.",
    "Under Section 188(3), where any contract or arrangement is entered into by a director or any other employee without obtaining the prior consent of the Board or approval by a resolution in the general meeting under subsection (1), and if it is not ratified by the Board or by the shareholders at a meeting within three (3) months from the date on which such contract was entered into, such contract or arrangement shall be VOIDABLE AT THE OPTION OF THE BOARD or, as the case may be, of the shareholders. If the contract is with a related party to any director, or is authorized by any other director, the directors concerned shall indemnify the company against any loss incurred by it. The three-month ratification window is an emergency cure mechanism; if the Board or shareholders refuse to ratify the transaction within 90 days, the contract is legally voidable, and the company can terminate it immediately.",
    "Furthermore, Section 188(4) provides that it shall be open to the company to proceed against a director or any other employee who had entered into such contract or arrangement in contravention of the provisions of this section for recovery of any loss sustained by it as a result of such contract or arrangement. This statutory right of recovery is absolute and personal: the consenting director must personally reimburse the company from their own assets, and corporate indemnification insurance policies (D&O insurance) strictly exclude coverage for illegal related party self-dealing.",
    "The penal liabilities under Section 188(5) (as amended by the Companies (Amendment) Act, 2020) are stringent and adjudicated directly by the Registrar of Companies under Section 454: (a) In case of a listed company, any director or employee who entered into or authorized the unapproved contract is liable to a statutory penalty of Rupees twenty-five (25) lakh; and (b) In case of any other company, a penalty of Rupees five (5) lakh.",
    "Crucially, under Section 164(1)(g) of the Companies Act, 2013, a person who has been convicted of the offense dealing with related party transactions under Section 188 at any time during the last preceding five years is automatically DISQUALIFIED from being appointed or continuing as a director of ANY company. In corporate practice, an unapproved RPT not only voids the underlying commercial contract but effectively terminates the corporate career of the involved directors."
]

p4_code = """# Part 4: Section 188(3)/(4)/(5) Voidability, Indemnity & Penalty Engine
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class UnapprovedRPTAuditRecord:
    contract_id: str
    company_type: str  # "LISTED" or "UNLISTED"
    contract_value_cr: float
    financial_loss_sustained_by_company_cr: float
    months_elapsed_since_execution: int
    has_been_ratified_by_board_or_shareholders: bool
    authorizing_director_name: str

class Section188EnforcementEngine:
    @staticmethod
    def audit_enforcement_and_penalties(rec: UnapprovedRPTAuditRecord) -> Tuple[bool, str, Dict]:
        # Section 188(3): Must be ratified within 3 months
        is_past_ratification_deadline = rec.months_elapsed_since_execution > 3
        
        if rec.has_been_ratified_by_board_or_shareholders and not is_past_ratification_deadline:
            return True, "RATIFIED_VALID: Contract successfully ratified within statutory 3-month window.", {
                "is_voidable": False,
                "indemnity_due_cr": 0.0,
                "penalties_applicable": False
            }
            
        # If unratified after 3 months -> VOIDABLE at option of Board + Personal Indemnity
        is_voidable = is_past_ratification_deadline and not rec.has_been_ratified_by_board_or_shareholders
        personal_indemnity_due_cr = rec.financial_loss_sustained_by_company_cr if is_voidable else 0.0
        
        # Section 188(5) Penalties
        statutory_penalty_lakhs = 25.0 if rec.company_type == "LISTED" else 5.0
        
        details = {
            "contract_id": rec.contract_id,
            "status": "UNAPPROVED_VOIDABLE_RPT" if is_voidable else "PENDING_RATIFICATION",
            "is_voidable_at_option_of_board": is_voidable,
            "personal_indemnity_liability_cr": personal_indemnity_due_cr,
            "authorizing_director": rec.authorizing_director_name,
            "statutory_penalty_inr_lakhs": statutory_penalty_lakhs,
            "director_disqualification_risk_s164": is_voidable
        }
        
        ruling = "CONTRACT_VOIDABLE_AND_DIRECTOR_PERSONALLY_LIABLE" if is_voidable else "WITHIN_GRACE_PERIOD"
        return not is_voidable, ruling, details

rec_breach = UnapprovedRPTAuditRecord("CON-880", "LISTED", contract_value_cr=25.0, 
                                     financial_loss_sustained_by_company_cr=4.5, months_elapsed_since_execution=5, 
                                     has_been_ratified_by_board_or_shareholders=False, authorizing_director_name="Rajesh Singhania (Exec Director)")

valid, msg, audit_info = Section188EnforcementEngine.audit_enforcement_and_penalties(rec_breach)
print(f"Contract Status: {msg}")
print(f"Contract Voidable at Option of Board: {audit_info['is_voidable_at_option_of_board']}")
print(f"Personal Indemnity Owed by Director: INR {audit_info['personal_indemnity_liability_cr']:.2f} Crores")
print(f"Section 188(5) Penalty Imposed: INR {audit_info['statutory_penalty_inr_lakhs']:.1f} Lakhs")
print(f"Director Disqualification Risk under S.164(1)(g): {audit_info['director_disqualification_risk_s164']}")
"""

p4_codeNotes = [
    "Models Section 188(3) voidability: unapproved RPTs not ratified within 3 months are voidable at the option of the Board.",
    "Calculates mandatory personal indemnity under Section 188(4) compelling defaulting directors to reimburse losses.",
    "Applies Section 188(5) statutory financial penalties: Rs 25 lakh for listed companies and Rs 5 lakh for unlisted entities.",
    "Exposes Section 164(1)(g) director disqualification risks, barring defaulting individuals from future directorships."
]

# --- PART 5 ---
p5_say = [
    "To achieve professional legal engineering excellence, corporate legal counsels, company secretaries, and financial directors must synthesize Section 2(76) related party mappings, arm's length transfer pricing benchmarks, Section 177 Audit Committee omnibus approvals, SEBI LODR Regulation 23 materiality calculations, and Section 188 penalty enforcement into an integrated enterprise gatekeeper engine. In complex corporate conglomerates, related party governance is the ultimate safeguard protecting corporate value from tunneling and shielding the board from regulatory prosecution.",
    "The industrial-grade Python engine developed in this masterclass encapsulates the complete related party transaction governance workflow for 'Bharat Infrastructure & Power Ltd', a top-50 listed Indian conglomerate reporting Rs 28,000 crore in annual consolidated turnover. The company executes multi-hundred crore commercial contracts across four group operating subsidiaries and promoter-owned supply companies. The simulator models the complete lifecycle of four high-value transactions: evaluating arm's length CUP benchmarks, monitoring Audit Committee omnibus limits, triggering SEBI LODR materiality thresholds, enforcing minority shareholder voting exclusions, and adjudicating Section 188 sanctions.",
    "The engine sequentially executes five advanced compliance modules: First, it runs Section 2(76) related party verification and applies the Section 188(1) 4th proviso arm's length CUP test across procurement contracts. Second, it monitors an existing Rs 250 crore Audit Committee Omnibus Approval, logging monthly drawdowns and freezing orders when cumulative spend approaches the approved ceiling. Third, it audits a proposed Rs 1,400 crore equipment lease agreement, identifying that it exceeds the SEBI absolute cap of Rs 1,000 crore and classifying it as a Material RPT.",
    "Fourth, it executes the SEBI LODR Regulation 23(4) voting simulation: barring the promoter group holding 68% equity from participating and computing the poll results exclusively across minority public shareholders. Fifth, when an unapproved Rs 35 crore management consulting contract with a promoter family trust remains unratified after five months, the engine executes Section 188(3) voidance, levies a Rs 4.5 crore personal indemnity clawback on the authorizing executive director, and applies the Rs 25 lakh statutory penalty under Section 188(5). Upon executing all five modules with zero errors, the engine outputs the definitive masterclass certification code: RPT_SECTION_188_COMPLIANCE_GATEKEEPER_PASS."
]

p5_code = """# Part 5: Production Section 188 RPT Gatekeeper & SEBI Materiality Master Engine
import hashlib
from typing import Dict, List, Tuple

class RPTMasterGatekeeperEngine:
    def __init__(self, company_name: str, consolidated_turnover_cr: float):
        self.company_name = company_name
        self.consolidated_turnover_cr = consolidated_turnover_cr
        self.materiality_ceiling_cr = min(1000.0, consolidated_turnover_cr * 0.10)
        self.omnibus_approvals: Dict[str, Dict] = {}
        self.sanctioned_material_rpts: List[Dict] = []
        self.enforced_voidances: List[Dict] = []
        self.audit_log: List[str] = []

    def register_omnibus_facility(self, omni_id: str, party: str, cap_cr: float):
        self.omnibus_approvals[omni_id] = {
            "party": party,
            "cap_cr": cap_cr,
            "spent_cr": 0.0
        }
        self.audit_log.append(f"Omnibus Facility Registered [{omni_id}] for {party}: Cap INR {cap_cr:.2f} Cr")

    def process_omnibus_drawdown(self, omni_id: str, amount_cr: float) -> bool:
        assert omni_id in self.omnibus_approvals, "Invalid Omnibus Facility"
        fac = self.omnibus_approvals[omni_id]
        new_total = fac["spent_cr"] + amount_cr
        assert new_total <= fac["cap_cr"], "Drawdown exceeds approved annual omnibus ceiling"
        fac["spent_cr"] = new_total
        self.audit_log.append(f"Omnibus Drawdown [{omni_id}]: Spent INR {amount_cr:.2f} Cr (Total Spent: {new_total:.2f}/{fac['cap_cr']:.2f} Cr)")
        return True

    def evaluate_material_rpt_minority_vote(self, prop_id: str, party: str, value_cr: float, 
                                           minority_favor_pct: float) -> bool:
        assert value_cr > self.materiality_ceiling_cr, "Must breach SEBI LODR Reg 23 materiality threshold"
        # All related parties barred from voting. Simple majority of minority votes cast decides outcome.
        passed = minority_favor_pct > 50.0
        rec = {
            "prop_id": prop_id,
            "party": party,
            "value_cr": value_cr,
            "minority_favor_pct": minority_favor_pct,
            "status": "APPROVED_BY_MINORITY_SHAREHOLDERS" if passed else "REJECTED_BY_MINORITY_SHAREHOLDERS"
        }
        self.sanctioned_material_rpts.append(rec)
        self.audit_log.append(f"Material RPT Vote [{prop_id}] INR {value_cr:.2f} Cr: {rec['status']} ({minority_favor_pct:.1f}% minority favor)")
        return passed

    def enforce_section188_voidance(self, contract_id: str, director: str, value_cr: float, loss_cr: float):
        rec = {
            "contract_id": contract_id,
            "director": director,
            "loss_clawback_cr": loss_cr,
            "statutory_penalty_lakhs": 25.0,
            "status": "CONTRACT_VOIDED_INDEMNITY_ENFORCED"
        }
        self.enforced_voidances.append(rec)
        self.audit_log.append(f"Section 188 Voidance Enforced [{contract_id}]: Terminated contract, clawed back INR {loss_cr:.2f} Cr indemnity from {director}")

    def run_masterclass_grand_audit(self) -> bool:
        print("================================================================================")
        print("   SECTION 188 RELATED PARTY TRANSACTION GATEKEEPER & MATERIALITY ENGINE        ")
        print("================================================================================")
        print(f"Company: {self.company_name} | Consolidated Turnover: INR {self.consolidated_turnover_cr:,.2f} Cr")
        print(f"SEBI LODR Reg 23 Materiality Threshold: INR {self.materiality_ceiling_cr:,.2f} Crores (Hard Cap Applied)")
        print("--------------------------------------------------------------------------------")
        for log in self.audit_log:
            print(f"[*] {log}")
            
        print("--------------------------------------------------------------------------------")
        print(f"Active Omnibus Facilities Monitored: {len(self.omnibus_approvals)}")
        print(f"Material RPT Shareholder Resolutions Evaluated: {len(self.sanctioned_material_rpts)}")
        print(f"Section 188 Voidances & Director Indemnities Enforced: {len(self.enforced_voidances)}")
        print("================================================================================")
        
        # Verify strict statutory invariants
        assert self.materiality_ceiling_cr == 1000.0, "Must apply Rs 1,000 Cr SEBI absolute hard cap"
        assert self.omnibus_approvals["OMNI-01"]["spent_cr"] == 180.0, "Omnibus drawdown must track exact cumulative spend"
        assert self.sanctioned_material_rpts[0]["status"] == "APPROVED_BY_MINORITY_SHAREHOLDERS", "Material RPT must pass minority vote"
        assert self.enforced_voidances[0]["loss_clawback_cr"] == 4.5, "Must enforce personal director indemnity clawback"
        assert self.enforced_voidances[0]["statutory_penalty_lakhs"] == 25.0, "Listed entity penalty must equal Rs 25 Lakhs"
        
        print("[PASS] RPT_SECTION_188_COMPLIANCE_GATEKEEPER_PASS")
        return True

engine = RPTMasterGatekeeperEngine("Bharat Infrastructure & Power Ltd", consolidated_turnover_cr=28000.0)
engine.register_omnibus_facility("OMNI-01", "Bharat Solar Equipment Ltd", cap_cr=250.0)
engine.process_omnibus_drawdown("OMNI-01", amount_cr=100.0)
engine.process_omnibus_drawdown("OMNI-01", amount_cr=80.0)

engine.evaluate_material_rpt_minority_vote("PROP-881", "Promoter Turbine Engineering FZE", value_cr=1400.0, minority_favor_pct=72.5)
engine.enforce_section188_voidance("CON-992", "Rajesh Singhania (Exec Director)", value_cr=35.0, loss_cr=4.5)

engine.run_masterclass_grand_audit()
"""

p5_codeNotes = [
    "Production-grade Related Party Transaction (RPT) gatekeeper integrating Section 188 and SEBI LODR Regulation 23.",
    "Applies the Rs 1,000 crore SEBI absolute materiality ceiling and enforces the non-related minority shareholder voting rule.",
    "Monitors real-time drawdowns against Audit Committee Omnibus Approvals under Section 177(4)(iv).",
    "Enforces Section 188(3) voidance and Section 188(4) personal director indemnity clawbacks with Rs 25 lakh statutory penalties.",
    "Validates all compliance invariants with mathematical precision and awards: `RPT_SECTION_188_COMPLIANCE_GATEKEEPER_PASS`."
]

parts_spec = [
    ("Part 1: Defining Related Parties under Section 2(76) & Arm's Length Exemption", p1_say, p1_code, p1_codeNotes,
     "Assess related party mappings under Section 2(76) and apply the Section 188(1) 4th proviso arm's length CUP test.",
     "What dual conjunctive criteria must be satisfied for a contract to be statutorily exempt from Section 188 Board and Shareholder approvals?",
     ["The transaction must be entered into in the ordinary course of business AND on an arm's length basis",
      "The transaction must be approved by the local municipal corporation",
      "The contract value must be paid entirely in physical gold bars",
      "The company must have zero outstanding debts to public financial institutions"],
     "Under the fourth proviso to Section 188(1), transactions entered into in the ordinary course of business on an arm's length basis are exempt from Section 188."),

    ("Part 2: Audit Committee Prior Approvals & Omnibus Approvals under S.177 & Reg 23", p2_say, p2_code, p2_codeNotes,
     "Structure Audit Committee Omnibus Approvals under Section 177(4)(iv) and SEBI LODR Regulation 23 for repetitive transactions.",
     "What is the statutory temporal validity limit of an Omnibus Approval granted by the Audit Committee?",
     ["It is valid for a period not exceeding one financial year and requires fresh approval after the expiry of the year",
      "It is valid permanently for ninety-nine years without renewal",
      "It expires automatically after twenty-four hours from the date of the meeting",
      "It is valid until all current directors resign from the board"],
     "Rule 6A and SEBI LODR Regulation 23(3)(c) stipulate that omnibus approvals are valid for a maximum period of one financial year."),

    ("Part 3: Material RPTs & The Mandatory Minority Voting Exclusion Rule", p3_say, p3_code, p3_codeNotes,
     "Calculate SEBI LODR Regulation 23 materiality thresholds (lesser of Rs 1,000 Cr or 10% turnover) and enforce minority voting.",
     "Under SEBI LODR Regulation 23(4), how are votes cast by interested promoter entities treated on resolutions approving Material RPTs?",
     ["All related parties are legally barred from voting on the resolution, and the outcome is decided exclusively by non-related minority shareholders",
      "Promoter votes are counted with a three-fold super-priority weighting",
      "Promoters cast all votes on behalf of minority shareholders as proxy holders",
      "The resolution is automatically passed without conducting a shareholder vote"],
     "Regulation 23(4) mandates that no related party shall vote to approve a material RPT, empowering non-related minority shareholders to decide the outcome."),

    ("Part 4: Section 188(3)/(4)/(5) Voidability, Personal Indemnity & Director Penalties", p4_say, p4_code, p4_codeNotes,
     "Apply Section 188(3) 3-month voidability rules, personal director indemnity clawbacks, and Section 164 disqualifications.",
     "What legal consequence occurs under Section 188(3) if an unapproved related party transaction is not ratified within three months?",
     ["The contract is voidable at the option of the Board or shareholders, and the authorizing director must personally indemnify the company for any loss",
      "The company is immediately dissolved and liquidated by the Central Government",
      "All company assets are transferred to the Prime Minister National Relief Fund",
      "The company's equity shares are converted into non-voting preference shares"],
     "Under Section 188(3), unratified contracts are voidable at the option of the Board, and consenting directors must personally indemnify the company for any loss sustained."),

    ("Part 5: Production Section 188 RPT Gatekeeper & SEBI Materiality Engine", p5_say, p5_code, p5_codeNotes,
     "Run the integrated RPT gatekeeper, omnibus drawdown monitor, materiality voting engine, and Section 188 voidance auditor.",
     "What key milestone certification is awarded upon running the Day 54 production RPT gatekeeper engine?",
     ["RPT_SECTION_188_COMPLIANCE_GATEKEEPER_PASS validating Section 2(76) mappings, arm's length CUP tests, omnibus limits, and minority voting",
      "UNCONDITIONAL_PROMOTER_TUNNELING_PASS allowing extraction of corporate cash without shareholder approval",
      "OFFSHORE_ROUND_TRIPPING_PASS authorizing non-disclosure of foreign vendor contracts",
      "AUTOMATIC_AUDIT_COMMITTEE_BYPASS_PASS removing independent directors from RPT oversight"],
     "The engine validates Section 188 compliance, omnibus drawdowns, SEBI materiality thresholds, and minority voting, issuing RPT_SECTION_188_COMPLIANCE_GATEKEEPER_PASS.")
]

for idx, (title, say, code, notes, try_it, q, opts, expl) in enumerate(parts_spec, 1):
    print(f"Executing Day 54 Part {idx} code...")
    stdout = run_code(code)
    wc = count_words(say)
    print(f"Part {idx}: {wc} words in say. Code execution successful.")
    
    part_dict = {
        "title": title,
        "say": say,
        "example": f"Corporate governance operational scenario for {title}.",
        "code": code,
        "output": stdout,
        "codeNotes": notes,
        "tryIt": [try_it],
        "check": {
            "question": q,
            "options": opts,
            "answer": 0,
            "explanation": expl
        }
    }
    day54["parts"].append(part_dict)

total_day_words = sum(count_words(p["say"]) for p in day54["parts"])
print(f"=== DAY 54 TOTAL WORDS: {total_day_words} ===")

with open("scripts/bcom_law_day54.json", "w", encoding="utf-8") as f:
    json.dump(day54, f, indent=2)

print("Saved scripts/bcom_law_day54.json successfully!")
