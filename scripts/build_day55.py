# scripts/build_day55.py
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

print("Designing Day 55 Capstone content...")

day55 = {
    "day": 55,
    "coursePrefix": "bcom_law",
    "title": "Day 55: Milestone 11 Capstone: Enterprise ESG, Governance & Regulatory Compliance Simulator",
    "summary": [
        "Milestone 11 Capstone synthesizes the full spectrum of modern corporate governance, ESG regulation, and statutory compliance.",
        "Audits SEBI BRSR Core 9-KPI assurance metrics and eliminates greenwashing exposure under PFUTP Regulations.",
        "Reconciles Section 198 net profits, audits Schedule VII CSR projects, and funds Section 135(6) unspent escrow accounts.",
        "Deploys cryptographic identity hashing for Section 177 vigil mechanisms and neutralizes employee retaliation.",
        "Enforces Section 188 RPT arm's length CUP benchmarks and executes SEBI LODR Regulation 23 minority shareholder votes.",
        "Validates the complete autonomous simulation with the credential: ENTERPRISE_ESG_AND_COMPLIANCE_PASS."
    ],
    "goal": "Conquer the Milestone 11 Capstone: architect an enterprise-grade governance control tower for a multinational conglomerate, resolve concurrent SEBI/MCA regulatory investigations, audit BRSR Core metrics, enforce Section 135 CSR escrows, protect whistleblowers, gatekeep Section 188 RPTs, and secure the ENTERPRISE_ESG_AND_COMPLIANCE_PASS credential.",
    "parts": []
}

# --- PART 1 ---
p1_say = [
    "Welcome to the Milestone 11 Grand Capstone of the Corporate Law, IBC & Compliance Masterclass. In this milestone synthesis, we integrate the full spectrum of modern enterprise governance, securities regulation, and statutory compliance mastered across Days 51 through 54. In contemporary corporate practice, leading an enterprise is no longer confined to achieving quarterly financial targets. Modern corporate leaders, general counsels, and independent directors must manage an intricate web of non-financial regulatory mandates: environmental sustainability disclosures under SEBI BRSR Core, mandatory corporate social responsibility under Companies Act Section 135, internal whistleblower vigil protections under Section 177, and minority shareholder protections against related party self-dealing under Section 188.",
    "The central capstone scenario centers on 'Zenith Global Conglomerate Ltd' (ZGCL), a premier diversified Indian multinational corporation listed on the BSE and National Stock Exchange (NSE) with an equity market capitalization ranking it #45 in India. ZGCL reports an annual consolidated gross turnover of Rupees thirty-two thousand crore (Rs 32,000 crore) and operates across four core business verticals: thermal and renewable power generation, steel manufacturing, international logistics, and engineering procurement. The enterprise employs over 22,000 personnel and manages multi-hundred crore commercial contracts across dozens of domestic subsidiaries and offshore affiliates.",
    "The governance crisis strikes simultaneously across three regulatory fronts: Front 1 (ESG & Greenwashing Exposure): An international proxy advisory firm publishes an investigative report alleging that ZGCL's published BRSR Core disclosures contain severe discrepancies in Scope 1 direct carbon emissions and water recycling metrics, prompting SEBI to issue a formal show-cause notice under PFUTP Regulation 4(2)(k) for suspected greenwashing. Front 2 (Section 135 CSR Investigation): The Registrar of Companies (ROC) initiates an inquiry into ZGCL's Rs 45 crore CSR expenditure, alleging that Rs 12 crore was siphoned through an unverified promoter-linked educational trust lacking mandatory Form CSR-1 registration, triggering potential Section 135(7) penalties.",
    "Front 3 (Whistleblower Exposure on Related Party Self-Dealing): An internal senior financial controller files an encrypted whistleblower disclosure revealing that the Managing Director orchestrated an unapproved Rs 1,450 crore equipment procurement contract with an offshore Dubai supplier secretly owned by the MD's family trust. The transaction violates SEBI LODR Regulation 23 materiality caps and was entered into without prior Audit Committee or shareholder approval. When the whistleblower's identity is compromised internally, executive management attempts to issue a retaliatory suspension order.",
    "To resolve this multi-front crisis and preserve corporate solvency, the Board of Directors convenes an emergency meeting and appoints an elite Crisis Governance Taskforce led by the Independent Chairperson of the Audit Committee. Over the five parts of this milestone, you will formulate the legal strategy and execute the computational algorithms necessary to audit BRSR Core metrics, purge greenwashing claims, reconcile Section 198 CSR profits, neutralize employer retaliation under Section 177(10), enforce minority voting on the RPT under SEBI LODR Reg 23, and restore full statutory compliance."
]

p1_code = """# Part 1: Capstone Enterprise Architecture & Multi-Regulatory Crisis Registry
from dataclasses import dataclass
from typing import Dict, List

@dataclass
class EnterpriseGovernanceProfile:
    company_name: str
    market_cap_rank: int
    annual_turnover_cr: float
    reported_pbt_cr: float
    workforce_count: int
    active_regulatory_inquiries: List[str]

class CapstoneGovernanceRegistry:
    def __init__(self, profile: EnterpriseGovernanceProfile):
        self.profile = profile
        self.crisis_modules_active = [
            "SEBI_BRSR_CORE_GREENWASHING_INQUIRY",
            "MCA_SECTION_135_CSR_GRANT_INVESTIGATION",
            "SECTION_177_WHISTLEBLOWER_RETALIATION_DEFENSE",
            "SEBI_LODR_REG_23_MATERIAL_RPT_IRREGULARITY"
        ]

    def audit_initial_crisis_exposure(self) -> Dict:
        return {
            "entity": self.profile.company_name,
            "sebi_rank": f"#{self.profile.market_cap_rank} (Top 100 Mandated)",
            "turnover_cr": self.profile.annual_turnover_cr,
            "crises_count": len(self.crisis_modules_active),
            "active_crises": self.crisis_modules_active,
            "governance_status": "HIGH_ALERT_CRISIS_TASKFORCE_ACTIVATED"
        }

profile = EnterpriseGovernanceProfile(
    company_name="Zenith Global Conglomerate Ltd",
    market_cap_rank=45,
    annual_turnover_cr=32000.0,
    reported_pbt_cr=1850.0,
    workforce_count=22000,
    active_regulatory_inquiries=["SEBI_PFUTP_NOTICE", "MCA_ROC_INQUIRY", "PROXY_ADVISOR_RED_FLAG"]
)

registry = CapstoneGovernanceRegistry(profile)
exp = registry.audit_initial_crisis_exposure()
print(f"Enterprise: {exp['entity']} | Market Cap Rank: {exp['sebi_rank']}")
print(f"Annual Turnover: INR {exp['turnover_cr']:,.2f} Crores | Status: {exp['governance_status']}")
print("Active Regulatory Vectors:")
for c in exp["active_crises"]:
    print(f" [!] {c}")
"""

p1_codeNotes = [
    "Establishes the corporate profile and multi-regulatory exposure for the Milestone 11 Capstone conglomerate.",
    "Registers concurrent regulatory investigations across SEBI BRSR Core, MCA Section 135 CSR, and Section 188 RPTs.",
    "Initializes the emergency Crisis Governance Taskforce under the Independent Audit Committee Chairperson.",
    "Sets up the factual foundation for quantitative forensic recalculations and statutory remediation."
]

# --- PART 2 ---
p2_say = [
    "The first phase of remediation focuses on resolving the SEBI BRSR Core show-cause notice and eliminating greenwashing liabilities under PFUTP Regulation 4(2)(k). The forensic investigation initiated by the Crisis Taskforce reveals that the company's previous sustainability communications team had published aggressive carbon neutrality claims in the annual report, asserting that the steel division had achieved a '50% reduction in Scope 1 direct greenhouse gas emissions'. However, technical audits reveal that this reduction was an accounting illusion achieved by excluding an outsourced blast furnace operations facility and relying on unverified voluntary carbon credits purchased from an unregistered offshore entity.",
    "To purge this legal contamination, the Taskforce engages an accredited independent ESG assurance provider to conduct an exhaustive recalculation under the SEBI Master Circular on BRSR Core. The auditors recalculate direct Scope 1 emissions across all factory sites (incorporating the outsourced blast furnace), establish accurate Scope 2 emissions from grid electricity metering invoices, and compute the true GHG intensity normalized per rupee of turnover. The true Scope 1 direct emissions equal 420,000 metric tonnes of CO2 equivalent, and Scope 2 emissions equal 110,000 metric tonnes, yielding an actual GHG intensity of 16.56 metric tonnes per crore of turnover.",
    "Simultaneously, the auditors verify the water circularity index: total water consumption is audited at 2,400,000 kilolitres, with 720,000 kilolitres recycled through zero liquid discharge (ZLD) effluent plants, confirming an actual water recycling ratio of 30.0% (satisfying the 20% sustainable industrial threshold). The industrial workplace safety audit records three lost time injuries across 8.5 million man-hours, establishing an LTIFR of 0.35 per million hours (well within the safe industrial ceiling of 1.0).",
    "Armed with these audited figures, the company immediately withdraws the unsubstantiated '50% carbon reduction' marketing claims, removes the unregistered voluntary offsets, and submits a revised BRSR Core Addendum to the stock exchanges accompanied by an unqualified Reasonable Assurance Report signed by the independent assurance provider. By demonstrating prompt self-correction, voluntary disclosure, and complete evidentiary substantiation under ISAE 3000, ZGCL successfully settles the SEBI PFUTP inquiry without financial penalties or securities debarment."
]

p2_code = """# Part 2: Forensic BRSR Core Recalculation & Anti-Greenwashing Audit
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class AuditedBRSRMetrics:
    turnover_cr: float
    true_scope_1_mt: float
    true_scope_2_mt: float
    true_water_consumed_kl: float
    true_water_recycled_kl: float
    manhours_worked_millions: float
    lost_time_injuries: int
    unverified_offsets_purged: bool
    independent_reasonable_assurance_signed: bool

class CapstoneBRSREngine:
    @staticmethod
    def audit_and_reconcile_esg(metrics: AuditedBRSRMetrics) -> Tuple[bool, str, Dict]:
        # 1. Total GHG and Intensity
        total_ghg = metrics.true_scope_1_mt + metrics.true_scope_2_mt
        ghg_intensity = total_ghg / metrics.turnover_cr
        
        # 2. Water Recycling Ratio
        water_recycle_pct = (metrics.true_water_recycled_kl / metrics.true_water_consumed_kl) * 100.0
        
        # 3. LTIFR
        ltifr = metrics.lost_time_injuries / metrics.manhours_worked_millions
        
        # 4. Greenwashing & Assurance Checks
        if not metrics.unverified_offsets_purged:
            return False, "GREENWASHING_RISK: Unverified carbon offsets remain on corporate books.", {}
            
        if not metrics.independent_reasonable_assurance_signed:
            return False, "ASSURANCE_DEFICIT: Lacks independent third-party reasonable assurance certification.", {}
            
        summary = {
            "total_ghg_mt": total_ghg,
            "ghg_intensity_per_cr": round(ghg_intensity, 2),
            "water_recycle_pct": round(water_recycle_pct, 1),
            "ltifr_rate": round(ltifr, 2),
            "greenwashing_purged": True,
            "reasonable_assurance_certified": True,
            "sebi_pfutp_liability_neutralized": True
        }
        return True, "BRSR_CORE_AUDITED_AND_CLEARED_BY_ASSURANCE_PROVIDER", summary

audited_data = AuditedBRSRMetrics(
    turnover_cr=32000.0,
    true_scope_1_mt=420000.0,
    true_scope_2_mt=110000.0,
    true_water_consumed_kl=2400000.0,
    true_water_recycled_kl=720000.0,
    manhours_worked_millions=8.5,
    lost_time_injuries=3,
    unverified_offsets_purged=True,
    independent_reasonable_assurance_signed=True
)

ok, msg, res = CapstoneBRSREngine.audit_and_reconcile_esg(audited_data)
print(f"ESG Audit Status: {msg}")
print(f"Audited GHG Intensity: {res['ghg_intensity_per_cr']} MT/Cr | Water Circularity: {res['water_recycle_pct']}%")
print(f"Workplace Safety LTIFR: {res['ltifr_rate']} | SEBI PFUTP Liability Neutralized: {res['sebi_pfutp_liability_neutralized']}")
"""

p2_codeNotes = [
    "Recalculates comprehensive Scope 1 and Scope 2 GHG emissions and water recycling metrics.",
    "Purges unverified offshore carbon offsets, eliminating greenwashing liability under SEBI PFUTP Regulation 4(2)(k).",
    "Computes exact industrial safety LTIFR (0.35) and water circularity ratio (30.0%).",
    "Secures independent third-party reasonable assurance certification conforming to SEBI BRSR Core standards."
]

# --- PART 3 ---
p3_say = [
    "The second phase of the governance overhaul addresses the Ministry of Corporate Affairs (MCA) inquiry into ZGCL's Corporate Social Responsibility compliance under Section 135. The forensic accounting team audits the company's financial ledgers across the three immediately preceding financial years (FY 2023–24, FY 2024–25, and FY 2025–26). The reported Profit Before Tax was Rs 1,400 crore, Rs 1,650 crore, and Rs 1,850 crore respectively. However, in previous years, corporate finance had failed to perform the mandatory statutory adjustments prescribed by Section 198 of the Companies Act.",
    "The Taskforce executes the statutory Section 198 adjustments: deducting overseas branch profits from European logistics operations (Rs 120 Cr, Rs 150 Cr, Rs 180 Cr), deducting inter-corporate dividends from Indian companies complying with Section 135 (Rs 30 Cr, Rs 40 Cr, Rs 50 Cr), and excluding notional fair value revaluation gains (Rs 50 Cr, Rs 60 Cr, Rs 20 Cr). The resulting Section 198 adjusted net profits are: FY 2023–24 = Rs 1,200 crore; FY 2024–25 = Rs 1,400 crore; and FY 2025–26 = Rs 1,600 crore. The three-year arithmetic average adjusted net profit is exactly Rs 1,400.00 crore. Therefore, ZGCL's mandatory 2% CSR spend obligation for the current financial year is exactly Rupees twenty-eight crore (Rs 28.00 crore).",
    "The Taskforce then conducts a forensic eligibility audit of the Rs 45 crore in disbursed and budgeted CSR grants under Schedule VII. The audit uncovers that Rs 12 crore had been allocated to 'Zenith Educational Foundation', a private trust established by the promoter's family. A search of the MCA21 registry confirms that the trust had NEVER filed Form CSR-1 and lacked a valid CSR Registration Number. Furthermore, the trust operated private schools exclusively for children of senior corporate executives—a blatant violation of Rule 2(1)(d)(ii). The Taskforce immediately cancels this grant, claws back the disbursed funds, and disqualifies the expenditure.",
    "To deploy the remaining funds legally, the Taskforce approves three legitimate Schedule VII projects: (1) Rs 12 crore for rural drinking water and malnutrition clinics in Jharkhand (Schedule VII Item 1); (2) Rs 8 crore for vocational skills and technical training for tribal youth (Schedule VII Item 2); and (3) Rs 4 crore for ecological mangrove restoration in the Sundarbans (Schedule VII Item 4), totaling Rs 24.00 crore in verified expenditures. The remaining unspent balance of Rs 4.00 crore relates to a multi-year ongoing rural hospital construction project. Applying Section 135(6), the company transfers the entire Rs 4.00 crore into a dedicated 'Unspent CSR Account' in a scheduled commercial bank within eighteen days of fiscal year end, fully discharging the statutory obligation and achieving complete immunity from Section 135(7) penalties."
]

p3_code = """# Part 3: Section 198 Net Profit Reconciliation & S.135(6) Escrow Controller
from dataclasses import dataclass
from typing import Dict, List, Tuple

class CapstoneCSRController:
    @staticmethod
    def calculate_three_year_average_csr(pbt_list: List[float], deductions_list: List[float]) -> Tuple[float, float]:
        adj_profits = [pbt - ded for pbt, ded in zip(pbt_list, deductions_list)]
        avg_profit = sum(adj_profits) / 3.0
        mandatory_2pct = avg_profit * 0.02
        return avg_profit, mandatory_2pct

    @staticmethod
    def audit_csr_allocations(mandatory_mandate_cr: float, approved_sched_vii_cr: float, 
                              disqualified_grants_cr: float, ongoing_escrow_cr: float, 
                              days_to_escrow: int) -> Tuple[bool, str, Dict]:
        # Section 135(6) rule: Ongoing project unspent funds must be deposited within 30 days
        if days_to_escrow > 30:
            return False, "SECTION_135(6)_BREACH: Ongoing funds not transferred within statutory 30-day window.", {}
            
        total_qualifying_discharge = approved_sched_vii_cr + ongoing_escrow_cr
        deficit = mandatory_mandate_cr - total_qualifying_discharge
        
        is_compliant = deficit <= 0.001
        
        summary = {
            "mandatory_obligation_cr": mandatory_mandate_cr,
            "approved_spend_cr": approved_sched_vii_cr,
            "ongoing_escrow_cr": ongoing_escrow_cr,
            "disqualified_siphoned_grant_clawed_back_cr": disqualified_grants_cr,
            "total_statutory_discharge_cr": total_qualifying_discharge,
            "section_135_7_penalties_incurred": not is_compliant,
            "status": "STATUTORY_CSR_MANDATE_100_PERCENT_DISCHARGED" if is_compliant else "STATUTORY_DEFICIT"
        }
        return is_compliant, summary["status"], summary

# 3-Year financials: Reported PBT = [1400, 1650, 1850], Deductions = [200, 250, 250] -> Adj = [1200, 1400, 1600]
avg_prof, mandate_2pct = CapstoneCSRController.calculate_three_year_average_csr([1400.0, 1650.0, 1850.0], [200.0, 250.0, 250.0])
ok, status_msg, csr_info = CapstoneCSRController.audit_csr_allocations(
    mandatory_mandate_cr=mandate_2pct, # 28.0 Cr
    approved_sched_vii_cr=24.0,
    disqualified_grants_cr=12.0,
    ongoing_escrow_cr=4.0,
    days_to_escrow=18
)

print(f"Section 198 3-Year Avg Profit: INR {avg_prof:.2f} Cr | Mandatory 2% Spend: INR {mandate_2pct:.2f} Cr")
print(f"CSR Status: {status_msg}")
print(f"Disqualified Grant Clawed Back: INR {csr_info['disqualified_siphoned_grant_clawed_back_cr']:.2f} Cr")
print(f"Ongoing Project Escrow (S.135(6)): INR {csr_info['ongoing_escrow_cr']:.2f} Cr | Penalties Incurred: {csr_info['section_135_7_penalties_incurred']}")
"""

p3_codeNotes = [
    "Reconciles 3-year historical financial ledgers under Section 198, establishing an adjusted average profit of Rs 1,400 Cr.",
    "Calculates the exact 2% statutory CSR obligation of Rs 28.00 crore.",
    "Claws back a disqualified Rs 12.00 crore grant given to an unverified promoter trust lacking Form CSR-1.",
    "Funds the Section 135(6) ongoing project escrow within 18 days, guaranteeing complete immunity from Section 135(7) penalties."
]

# --- PART 4 ---
p4_say = [
    "The third and most complex phase of the capstone crisis centers on the whistleblower protected disclosure and the unapproved Rs 1,450 crore equipment procurement contract with Dubai-based 'Apex Turbine Engineering FZE'. The whistleblower intake system receives the disclosure through its SOC-2 encrypted cloud portal, generating an irreversible SHA-256 identity token (WB-TOKEN-E7B92A41C904). Because the disclosure directly implicates the Managing Director, the intake engine bypasses internal HR and escalates the dossier within twelve hours directly to the Independent Chairperson of the Audit Committee under Section 177(10).",
    "Forensic corporate intelligence reveals that the Dubai vendor is 100% owned by an offshore discretionary trust established by the Managing Director's brother. Under Section 2(76)(iv) and Section 2(76)(v) of the Companies Act, the vendor is undeniable Related Party. Furthermore, the contract value of Rs 1,450 crore exceeds the SEBI LODR Regulation 23(1) absolute materiality cap of Rs 1,000 crore (since 10% of ZGCL's Rs 32,000 crore turnover is Rs 3,200 crore; the Rs 1,000 crore hard cap applies). The contract is therefore a Material Related Party Transaction that legally required prior approval from the Audit Committee and shareholders by Ordinary Resolution.",
    "When executive management discovers that an internal financial controller was probing the Dubai contract, the Managing Director issues an illegal suspension order and freezes the controller's salary. The Audit Committee immediately intervenes under the Anti-Retaliation Shield Engine: invoking Section 177(10) and the 12-month presumption rule, the Audit Committee stays the suspension order, restores full salary and benefits, and transfers the financial controller's reporting line directly to the Chief Compliance Officer. Concurrently, the Board initiates disciplinary proceedings against the Managing Director for unlawful retaliation.",
    "To resolve the commercial contract without destroying operational power plant timelines, the Audit Committee commissions an independent transfer pricing appraisal under the Comparable Uncontrolled Price (CUP) method. The appraiser determines that the fair market value of the equipment is Rs 1,320 crore, meaning the original contract was inflated by Rs 130 crore. The Audit Committee renegotiates the contract price down to Rs 1,320 crore on standard commercial credit terms and submits the restructured Material RPT to an emergency extraordinary general meeting (EGM) of shareholders.",
    "Applying the mandatory Voting Exclusion Rule under SEBI LODR Regulation 23(4) and Section 188(1), the promoter group holding 58% of ZGCL's equity is legally barred from voting. The resolution is put exclusively to public minority shareholders. With institutional investors voting 84.5% in favor of the renegotiated contract, the Material RPT is formally approved. Concurrently, the financial controller files a Voluntary Information Disclosure Form (VIDF) with SEBI regarding illicit insider trading by the MD, and SEBI awards the informant a maximum statutory bounty of Rs 10.00 crore under Chapter IIIA of SEBI PIT. Full corporate integrity and regulatory harmony are successfully restored."
]

p4_code = """# Part 4: Whistleblower Retaliation Injunction & Minority Voting Engine
from dataclasses import dataclass
from typing import Dict, List, Tuple

class CapstoneGovernanceRemediationEngine:
    @staticmethod
    def evaluate_whistleblower_and_material_rpt(
        token_id: str,
        retaliation_attempted: bool,
        contract_value_cr: float,
        sebi_materiality_cap_cr: float,
        promoter_equity_pct: float,
        minority_favor_poll_pct: float
    ) -> Tuple[bool, str, Dict]:
        # 1. Neutralize Retaliation under Section 177(10)
        retaliation_neutralized = False
        if retaliation_attempted:
            retaliation_neutralized = True
            
        # 2. Material RPT Check under SEBI LODR Reg 23(1)
        is_material = contract_value_cr > sebi_materiality_cap_cr
        
        # 3. Shareholder Polling under Reg 23(4) (Promoters Excluded)
        passed_minority_vote = minority_favor_poll_pct > 50.0
        
        summary = {
            "whistleblower_token": token_id,
            "retaliation_stayed_by_audit_committee": retaliation_neutralized,
            "contract_value_cr": contract_value_cr,
            "sebi_cap_cr": sebi_materiality_cap_cr,
            "is_material_rpt": is_material,
            "promoter_shares_barred_pct": promoter_equity_pct,
            "minority_vote_in_favor_pct": minority_favor_poll_pct,
            "material_rpt_sanctioned": passed_minority_vote,
            "sebi_informant_reward_cr": 10.0 # Capped at statutory max
        }
        
        is_all_clean = retaliation_neutralized and passed_minority_vote
        status = "GOVERNANCE_AND_MINORITY_APPROVAL_CONFIRMED" if is_all_clean else "GOVERNANCE_DEFICIT"
        return is_all_clean, status, summary

clean, msg, data = CapstoneGovernanceRemediationEngine.evaluate_whistleblower_and_material_rpt(
    token_id="WB-TOKEN-E7B92A41C904",
    retaliation_attempted=True,
    contract_value_cr=1320.0,
    sebi_materiality_cap_cr=1000.0,
    promoter_equity_pct=58.0,
    minority_favor_poll_pct=84.5
)

print(f"Remediation Status: {msg}")
print(f"Whistleblower Protection: Retaliation Neutralized = {data['retaliation_stayed_by_audit_committee']}")
print(f"Material RPT Value: INR {data['contract_value_cr']} Cr vs Cap INR {data['sebi_cap_cr']} Cr")
print(f"Promoter Barred: {data['promoter_shares_barred_pct']}% | Minority Approval: {data['minority_vote_in_favor_pct']}% (Passed: {data['material_rpt_sanctioned']})")
print(f"SEBI PIT Informant Bounty Awarded: INR {data['sebi_informant_reward_cr']:.2f} Crores")
"""

p4_codeNotes = [
    "Deploys Section 177(10) anti-retaliation injunction, staying employer termination and restoring salary.",
    "Applies SEBI LODR Regulation 23(1) Rs 1,000 crore materiality cap to classify contract as Material RPT.",
    "Enforces mandatory voting exclusion barring promoter group (58%) from voting on the general meeting resolution.",
    "Confirms 84.5% minority shareholder approval and sanctions Rs 10.00 crore maximum SEBI PIT informant reward."
]

# --- PART 5 ---
p5_say = [
    "You have arrived at the crowning achievement of the Milestone 11 Capstone and one of the highest summits of the Corporate Law, IBC & Compliance curriculum. In this final part, you will activate and verify the complete, autonomous Enterprise ESG, Governance & Regulatory Compliance Master Simulator. This production-grade computational software engine models the end-to-end governance lifecycle of a multi-billion dollar diversified corporate conglomerate under the Companies Act, 2013, SEBI LODR Regulations, 2015, SEBI PFUTP Regulations, and SEBI PIT Regulations.",
    "The simulator executes six comprehensive, interconnected verification checkpoints that test every facet of modern corporate legal engineering:",
    "Checkpoint 1: SEBI BRSR Core KPI & GHG Intensity Verification. The engine calculates Scope 1 direct and Scope 2 indirect carbon footprints, normalizes emissions to 16.56 MT/Cr turnover, audits water circularity at 30.0%, verifies an LTIFR safety index of 0.35, and confirms unqualified independent reasonable assurance.",
    "Checkpoint 2: Anti-Greenwashing & Securities Fraud Immunity. The engine screens all corporate public communications against CPCB and ISO primary documentary evidence, purging unverified voluntary carbon offsets and neutralizing criminal fraud liability under SEBI PFUTP Regulation 4(2)(k) and Companies Act Section 448.",
    "Checkpoint 3: Section 135 CSR & Section 198 Net Profit Allocation Audit. The engine performs Section 198 statutory adjustments across 3-year historical ledgers, establishing an adjusted average profit of Rs 1,400 crore, calculating the exact 2% CSR obligation of Rs 28.00 crore, and clawing back a disqualified Rs 12.00 crore promoter grant.",
    "Checkpoint 4: Section 135(6) Ongoing Project Escrow Funding. The engine models the statutory transfer of Rs 4.00 crore into a designated Unspent CSR Account in a scheduled commercial bank within 18 days of fiscal year end, fully discharging the obligation and achieving zero liability under Section 135(7).",
    "Checkpoint 5: Cryptographic Whistleblower Ingestion & Anti-Retaliation Injunction. The system generates an SHA-256 identity token, routes the high-level executive disclosure directly to the Independent Audit Committee Chairperson under Section 177(10), issues an administrative injunction blocking retaliatory employment termination, and prepares a SEBI PIT Chapter IIIA informant filing.",
    "Checkpoint 6: Section 188 Related Party Materiality & Minority Voting Gatekeeper. The engine applies the SEBI absolute cap of Rs 1,000 crore, enforces the mandatory voting exclusion barring interested promoters (58%), records an 84.5% affirmative minority vote, and sanctions a restructured arm's length CUP contract.",
    "Upon running this complete production simulation, the engine validates all statutory compliance invariants with mathematical precision and concludes with the prestigious certification code: ENTERPRISE_ESG_AND_COMPLIANCE_PASS. This milestone confirms that you possess masterclass capability in corporate governance, securities regulations, and enterprise compliance architecture."
]

p5_code = """# Part 5: Complete Industrial-Grade Enterprise ESG, Governance & Regulatory Compliance Simulator
import hashlib
from typing import Dict, List, Tuple

class EnterpriseGovernanceMasterSimulator:
    def __init__(self, enterprise_name: str, turnover_cr: float):
        self.enterprise_name = enterprise_name
        self.turnover_cr = turnover_cr
        self.esg_kpis: Dict[str, float] = {}
        self.csr_metrics: Dict[str, float] = {}
        self.whistleblower_cases: List[Dict] = []
        self.rpt_approvals: List[Dict] = []
        self.audit_log: List[str] = []

    def verify_brsr_core_esg(self, scope1_mt: float, scope2_mt: float, water_consumed_kl: float, 
                             water_recycled_kl: float, ltifr: float, assurance_certified: bool):
        total_ghg = scope1_mt + scope2_mt
        intensity = total_ghg / self.turnover_cr
        recycle_rate = (water_recycled_kl / water_consumed_kl) * 100.0
        
        assert assurance_certified, "Must possess third-party reasonable assurance"
        assert ltifr <= 1.0, "LTIFR must conform to safe industrial ceiling"
        assert recycle_rate >= 20.0, "Water circularity must meet 20% sustainable threshold"
        
        self.esg_kpis = {
            "total_ghg_mt": total_ghg,
            "ghg_intensity_per_cr": intensity,
            "water_recycle_pct": recycle_rate,
            "ltifr": ltifr,
            "assurance": 1.0
        }
        self.audit_log.append(f"BRSR Core Verified: GHG Intensity {intensity:.2f} MT/Cr | Water Recycle {recycle_rate:.1f}% | LTIFR {ltifr:.2f} | Assurance Certified")

    def execute_section135_csr_audit(self, three_yr_avg_profit_cr: float, approved_spend_cr: float, 
                                    ongoing_escrow_cr: float, days_to_escrow: int):
        mandate_2pct = three_yr_avg_profit_cr * 0.02
        assert days_to_escrow <= 30, "Ongoing project funds must be transferred within 30 days under Section 135(6)"
        total_discharge = approved_spend_cr + ongoing_escrow_cr
        assert abs(total_discharge - mandate_2pct) < 0.001, "Must satisfy 100% of 2% CSR mandate"
        
        self.csr_metrics = {
            "avg_profit_cr": three_yr_avg_profit_cr,
            "mandate_2pct_cr": mandate_2pct,
            "approved_spend_cr": approved_spend_cr,
            "ongoing_escrow_cr": ongoing_escrow_cr
        }
        self.audit_log.append(f"Section 135 CSR Audited: Mandate INR {mandate_2pct:.2f} Cr fully discharged (Spend: {approved_spend_cr:.2f} Cr, Escrow: {ongoing_escrow_cr:.2f} Cr)")

    def process_whistleblower_case(self, token_id: str, allegation: str, retaliation_blocked: bool):
        assert retaliation_blocked, "Audit Committee must stay retaliatory employment action"
        case = {
            "token": token_id,
            "allegation": allegation,
            "retaliation_blocked": True,
            "status": "PROTECTED_DISCLOSURE_RESOLVED"
        }
        self.whistleblower_cases.append(case)
        self.audit_log.append(f"Whistleblower Case [{token_id}]: {allegation} | Retaliation Injoined by Audit Committee")

    def approve_material_rpt_minority_vote(self, contract_id: str, value_cr: float, minority_favor_pct: float):
        assert value_cr > 1000.0, "Must breach SEBI LODR Reg 23 materiality hard cap"
        assert minority_favor_pct > 50.0, "Must achieve simple majority of non-related minority shareholders"
        rpt = {
            "contract_id": contract_id,
            "value_cr": value_cr,
            "minority_favor_pct": minority_favor_pct,
            "status": "MATERIAL_RPT_SANCTIONED_BY_MINORITY_POLL"
        }
        self.rpt_approvals.append(rpt)
        self.audit_log.append(f"Material RPT Approved [{contract_id}] INR {value_cr:.2f} Cr: Passed with {minority_favor_pct:.1f}% minority vote (Promoters Barred)")

    def run_masterclass_grand_capstone_audit(self) -> bool:
        print("================================================================================")
        print("   ENTERPRISE ESG, GOVERNANCE & REGULATORY COMPLIANCE MASTER SIMULATOR          ")
        print("================================================================================")
        print(f"Conglomerate: {self.enterprise_name} | Consolidated Turnover: INR {self.turnover_cr:,.2f} Cr")
        print("--------------------------------------------------------------------------------")
        for log in self.audit_log:
            print(f"[*] {log}")
            
        print("--------------------------------------------------------------------------------")
        print("ENTERPRISE STATUTORY COMPLIANCE AUDIT METRICS:")
        print(f" - BRSR Core GHG Footprint: {self.esg_kpis['total_ghg_mt']:,.2f} MT CO2e (Intensity: {self.esg_kpis['ghg_intensity_per_cr']:.2f} MT/Cr)")
        print(f" - Water Circularity: {self.esg_kpis['water_recycle_pct']:.1f}% | Workplace Safety LTIFR: {self.esg_kpis['ltifr']:.2f}")
        print(f" - Section 135 CSR Statutory Spend: INR {self.csr_metrics['mandate_2pct_cr']:.2f} Cr (100% Discharged)")
        print(f" - Active Whistleblower Protections: {len(self.whistleblower_cases)} Injunctions Active")
        print(f" - Material RPTs Sanctioned by Minority Shareholders: {len(self.rpt_approvals)} Contracts")
        print("================================================================================")
        
        # Verify strict statutory invariants
        assert self.esg_kpis["assurance"] == 1.0, "BRSR Core must possess reasonable assurance"
        assert self.csr_metrics["mandate_2pct_cr"] == 28.0, "CSR obligation must equal Rs 28.00 Cr"
        assert len(self.whistleblower_cases) == 1, "Must maintain active whistleblower protection"
        assert len(self.rpt_approvals) == 1, "Must sanction material RPT under SEBI voting rules"
        assert self.rpt_approvals[0]["minority_favor_pct"] == 84.5, "Minority vote must match recorded poll outcome"
        
        print("[PASS] ENTERPRISE_ESG_AND_COMPLIANCE_PASS")
        return True

engine = EnterpriseGovernanceMasterSimulator("Zenith Global Conglomerate Ltd", turnover_cr=32000.0)
engine.verify_brsr_core_esg(scope1_mt=420000.0, scope2_mt=110000.0, water_consumed_kl=2400000.0, water_recycled_kl=720000.0, ltifr=0.35, assurance_certified=True)
engine.execute_section135_csr_audit(three_yr_avg_profit_cr=1400.0, approved_spend_cr=24.0, ongoing_escrow_cr=4.0, days_to_escrow=18)
engine.process_whistleblower_case("WB-TOKEN-E7B92A41C904", "MD Equipment Procurement Fraud", retaliation_blocked=True)
engine.approve_material_rpt_minority_vote("CON-RPT-2026-X", value_cr=1320.0, minority_favor_pct=84.5)

engine.run_masterclass_grand_capstone_audit()
"""

p5_codeNotes = [
    "Industrial-grade Milestone 11 Capstone Engine: unifies ESG, BRSR Core, CSR, Whistleblower, and RPT governance.",
    "Verifies Scope 1/2 GHG intensity, water circularity, and LTIFR metrics under SEBI BRSR Core reasonable assurance.",
    "Audits Section 135 CSR 2% spend obligation (Rs 28 Cr) and funds Section 135(6) unspent ongoing project escrows.",
    "Enforces Section 177(10) anti-retaliation injunctions protecting whistleblowers from constructive dismissal.",
    "Applies SEBI LODR Regulation 23(1) materiality cap and validates 84.5% non-related minority shareholder approval.",
    "Validates all statutory invariants with zero discrepancies and awards: `ENTERPRISE_ESG_AND_COMPLIANCE_PASS`."
]

parts_spec = [
    ("Part 1: Capstone System Architecture: The Multi-Pronged Corporate Governance Crisis", p1_say, p1_code, p1_codeNotes,
     "Assess enterprise corporate profiles and evaluate concurrent regulatory exposures across SEBI, MCA, and proxy advisors.",
     "What multi-front regulatory exposures confront Zenith Global Conglomerate in the Milestone 11 Capstone?",
     ["Concurrent regulatory inquiries across BRSR Core greenwashing, Section 135 promoter CSR grants, and whistleblower RPT fraud",
      "Automatic conversion of all corporate debt into international climate bonds",
      "Immediate military seizure of all corporate manufacturing facilities",
      "Mandatory distribution of 100% of corporate turnover to retail shareholders"],
     "The capstone scenario tests resolution of concurrent inquiries across SEBI BRSR Core, Section 135 CSR, and Section 188 RPTs."),

    ("Part 2: Forensic BRSR Core Recalculation & Anti-Greenwashing Audit", p2_say, p2_code, p2_codeNotes,
     "Recalculate Scope 1/2 GHG intensity, water recycling, and LTIFR metrics to eliminate greenwashing liability under SEBI PFUTP.",
     "How does the enterprise eliminate securities fraud liability under SEBI PFUTP Regulation 4(2)(k)?",
     ["By recalculating true Scope 1/2 emissions, purging unverified voluntary carbon offsets, and obtaining third-party reasonable assurance",
      "By deleting all historical environmental records from company archives",
      "By paying an informal cash settlement to the stock exchange registrar",
      "By rebranding all fossil-fuel power plants as solar farms without changing operations"],
     "SEBI PFUTP liability is purged by recalculating verified emissions, removing unverified offsets, and securing reasonable assurance."),

    ("Part 3: Section 198 Net Profit Reconciliation & S.135(6) Ongoing Escrow Execution", p3_say, p3_code, p3_codeNotes,
     "Reconcile Section 198 net profits, claw back disqualified promoter grants, and fund Section 135(6) ongoing project escrows.",
     "What statutory action is required under Section 135(6) for unspent funds relating to an ongoing CSR project?",
     ["Transfer the funds into a dedicated 'Unspent CSR Account' in a scheduled commercial bank within 30 days of fiscal year end",
      "Distribute the funds as a discretionary bonus to the Board of Directors",
      "Transfer the funds to an offshore bank account in the Cayman Islands",
      "Write off the unspent funds as a bad debt in the profit and loss statement"],
     "Section 135(6) requires ongoing project funds to be transferred to the Unspent CSR Account within 30 days from fiscal year end."),

    ("Part 4: Whistleblower Retaliation Injunction & Minority Shareholder RPT Polling", p4_say, p4_code, p4_codeNotes,
     "Enforce Section 177(10) anti-retaliation injunctions and execute SEBI LODR Regulation 23 minority shareholder polling.",
     "Why was the promoter group holding 58% equity barred from voting on the Rs 1,320 crore equipment contract?",
     ["Under SEBI LODR Regulation 23(4) and Section 188(1), all related parties are statutorily barred from voting on RPT resolutions",
      "Because the promoter directors were attending an international conference abroad",
      "Because promoter equity shares carry zero voting rights under the Companies Act",
      "Because the stock exchange suspended all promoter trading accounts permanently"],
     "Regulation 23(4) mandates that no related party shall vote to approve an RPT, ensuring minority shareholders decide the outcome."),

    ("Part 5: Milestone 11 Capstone: Enterprise ESG, Governance & Compliance Simulator", p5_say, p5_code, p5_codeNotes,
     "Run the complete autonomous Enterprise ESG, Governance & Regulatory Compliance production engine.",
     "What supreme legal engineering credential is confirmed upon successfully completing the Milestone 11 Grand Capstone?",
     ["ENTERPRISE_ESG_AND_COMPLIANCE_PASS certifying comprehensive mastery of enterprise governance and securities compliance",
      "TOTAL_CORPORATE_LIQUIDATION_PASS mandating distress auction of all company assets",
      "VOLUNTARY_DELISTING_PASS removing the company from Indian stock exchanges",
      "UNCONDITIONAL_TAX_EXEMPTION_PASS shielding the company from income tax assessments"],
     "Running the capstone engine validates all 6 compliance checkpoints and certifies ENTERPRISE_ESG_AND_COMPLIANCE_PASS.")
]

for idx, (title, say, code, notes, try_it, q, opts, expl) in enumerate(parts_spec, 1):
    print(f"Executing Day 55 Part {idx} code...")
    stdout = run_code(code)
    wc = count_words(say)
    print(f"Part {idx}: {wc} words in say. Code execution successful.")
    
    part_dict = {
        "title": title,
        "say": say,
        "example": f"Capstone operational scenario for {title}.",
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
    day55["parts"].append(part_dict)

total_day_words = sum(count_words(p["say"]) for p in day55["parts"])
print(f"=== DAY 55 TOTAL WORDS: {total_day_words} ===")

with open("scripts/bcom_law_day55.json", "w", encoding="utf-8") as f:
    json.dump(day55, f, indent=2)

print("Saved scripts/bcom_law_day55.json successfully!")
