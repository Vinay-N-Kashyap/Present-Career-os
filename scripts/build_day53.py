# scripts/build_day53.py
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

print("Designing Day 53 content...")

day53 = {
    "day": 53,
    "coursePrefix": "bcom_law",
    "title": "Day 53: Whistleblower Protections, Vigil Mechanism under S.177 & SEBI PIT Informant Architecture",
    "summary": [
        "Companies Act Section 177(9) mandates a Vigil Mechanism for all listed companies and qualifying unlisted public entities.",
        "Section 177(10) requires robust safeguards against employee victimization and guarantees direct access to the Audit Committee Chair.",
        "SEBI (PIT) Regulations Chapter IIIA establishes the Informant Mechanism offering up to Rs 10 crore monetary reward for insider trading disclosures.",
        "Digital whistleblower portals deploy SHA-256 cryptographic identity hashing to preserve absolute informant anonymity.",
        "Audit Committees must enforce forensic triage protocols, prevent retaliatory dismissal, and report metrics in Annual Corporate Governance Reports."
    ],
    "goal": "Master whistleblower corporate governance and securities informant architecture: implement Section 177(9) vigil mechanisms, construct anti-retaliation legal shields, navigate SEBI PIT Chapter IIIA Voluntary Information Disclosure Forms (VIDF), and execute forensic intake triage.",
    "parts": []
}

# --- PART 1 ---
p1_say = [
    "In the corporate governance architecture of modern enterprise commerce, the Whistleblower Protection and Vigil Mechanism framework serves as the primary internal immune system against corporate fraud, systemic bribery, accounting manipulation, and securities malpractice. High-profile international corporate collapses—from Enron and WorldCom in the United States to Satyam Computer Services and IL&FS in India—demonstrated that external statutory auditors and independent directors are frequently shielded from operational realities by entrenched executive management. Real corporate fraud is almost invariably detected from within, by frontline employees, internal accountants, compliance officers, and junior managers who witness illicit transactions firsthand. Without robust statutory protection against professional retaliation, these potential informants remain silent out of fear of summary termination, blacklisting, and career destruction.",
    "The foundational statutory mandate governing vigil mechanisms in India is codified in Section 177(9) and Section 177(10) of the Companies Act, 2013, read with Rule 7 of the Companies (Meetings of Board and its Powers) Rules, 2014. Under Section 177(9), every listed company and every other class of companies prescribed by the Central Government is legally obligated to establish a comprehensive Vigil Mechanism for directors and employees to report genuine concerns. Under Rule 7, the prescribed classes of unlisted companies include: (a) companies that accept deposits from the public under Chapter V; and (b) companies that have borrowed money from banks and public financial institutions in excess of Rupees fifty (50) crore. If a company satisfies either of these thresholds, establishing a vigil mechanism is an absolute statutory mandate, regardless of its private or public corporate form.",
    "The governance of the vigil mechanism is placed directly under the supervisory authority of the Audit Committee. Section 177(9) provides that the vigil mechanism shall be overseen by the Audit Committee, or where a company is not required to constitute an audit committee, the Board of Directors shall nominate a director to play the role of the audit committee. The core statutory safeguard prescribed by Section 177(10) is the guarantee of 'Direct Access': the vigil mechanism MUST provide for adequate safeguards against victimization of persons who use such mechanism and make provision for direct access to the Chairperson of the Audit Committee in exceptional or urgent cases. If a complaint involves the Managing Director, Chief Executive Officer, or Chief Financial Officer, the whistleblower has the unassailable statutory right to bypass internal human resources and executive management entirely and deliver the protected disclosure directly to the Independent Chairperson of the Audit Committee.",
    "In parallel, Regulation 22 of the SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015 (SEBI LODR) reinforces this mandate for all listed entities. Regulation 22 stipulates that listed entities must formulate a detailed Whistle Blower Policy and that the details of the establishment of such mechanism must be prominently disclosed on the company's website and in the Board's report. The Audit Committee is required to review the functioning of the whistle blower mechanism on a periodic basis, ensuring that all reported incidents are investigated impartially, without executive interference, and resolved within documented statutory turnaround times.",
    "From an evidentiary and corporate liability standpoint, failing to establish or maintain a functional vigil mechanism is a severe non-compliance under the Companies Act. Under Section 178(8), any company that fails to comply with the provisions of Section 177 is punishable with a fine of not less than Rupees one lakh which may extend to Rupees five lakh, and every officer of the company who is in default is punishable with fine. Furthermore, proxy advisory firms and institutional governance auditors automatically flag the absence of an independent whistleblower channel as a severe red flag, resulting in negative ESG governance ratings and activist investor opposition during annual general meetings."
]

p1_code = """# Part 1: Section 177(9) Vigil Mechanism Mandate & Applicability Auditor
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class CorporateVigilProfile:
    company_name: str
    is_listed_on_stock_exchange: bool
    accepts_public_deposits: bool
    borrowings_from_banks_pfi_cr: float
    has_audit_committee: bool
    has_functional_vigil_mechanism: bool
    provides_direct_access_to_audit_chair: bool

class VigilMechanismAuditor:
    @staticmethod
    def audit_vigil_mandate(corp: CorporateVigilProfile) -> Tuple[bool, str, Dict]:
        # Section 177(9) & Rule 7 Applicability Tests
        is_listed = corp.is_listed_on_stock_exchange
        has_deposits = corp.accepts_public_deposits
        borrowings_exceed_50cr = corp.borrowings_from_banks_pfi_cr > 50.0
        
        is_mandated = is_listed or has_deposits or borrowings_exceed_50cr
        
        if not is_mandated:
            return False, "EXEMPT: Entity not listed, no public deposits, borrowings <= 50 Cr. Vigil mechanism voluntary.", {
                "mandated": False,
                "status": "VOLUNTARY_BEST_PRACTICE"
            }
            
        triggers = []
        if is_listed: triggers.append("Listed Entity (SEBI LODR Reg 22 & S.177(9))")
        if has_deposits: triggers.append("Public Deposits Accepted (Rule 7(a))")
        if borrowings_exceed_50cr: triggers.append(f"Bank Borrowings INR {corp.borrowings_from_banks_pfi_cr:.1f} Cr > 50 Cr (Rule 7(b))")
        
        # Audit compliance
        violations = []
        if not corp.has_functional_vigil_mechanism:
            violations.append("CRITICAL: Zero functional vigil mechanism established; violation of Section 177(9).")
        if not corp.provides_direct_access_to_audit_chair:
            violations.append("CRITICAL: Lacks direct access to Audit Committee Chairperson in exceptional cases (S.177(10)).")
            
        is_compliant = len(violations) == 0
        ruling = "FULLY_COMPLIANT_VIGIL_MECHANISM" if is_compliant else "STATUTORY_NON_COMPLIANCE_S177"
        
        details = {
            "mandated": True,
            "applicability_triggers": triggers,
            "compliance_status": ruling,
            "violations": violations,
            "penalties_applicable": not is_compliant
        }
        return is_compliant, ruling, details

c1 = CorporateVigilProfile("Apex Steel Ltd", is_listed_on_stock_exchange=True, accepts_public_deposits=False, 
                           borrowings_from_banks_pfi_cr=350.0, has_audit_committee=True, 
                           has_functional_vigil_mechanism=True, provides_direct_access_to_audit_chair=True)
c2 = CorporateVigilProfile("Metro Infrastructure Pvt Ltd", is_listed_on_stock_exchange=False, accepts_public_deposits=False, 
                           borrowings_from_banks_pfi_cr=85.0, has_audit_committee=False, 
                           has_functional_vigil_mechanism=False, provides_direct_access_to_audit_chair=False)

ok1, status1, det1 = VigilMechanismAuditor.audit_vigil_mandate(c1)
ok2, status2, det2 = VigilMechanismAuditor.audit_vigil_mandate(c2)

print(f"Company: {c1.company_name} | Compliance: {ok1} -> {status1}")
print(f"Company: {c2.company_name} | Compliance: {ok2} -> {status2}")
if not ok2:
    for v in det2["violations"]:
        print(f" - Violation: {v}")
"""

p1_codeNotes = [
    "Evaluates statutory vigil mechanism applicability under Section 177(9) and Rule 7 (Listed, Deposits, Borrowings > 50 Cr).",
    "Audits mandatory direct access to the Audit Committee Chairperson under Section 177(10).",
    "Identifies statutory non-compliance and penalty liabilities under Companies Act Section 178(8).",
    "Outputs structured governance profiles differentiating between listed enterprises and leveraged private companies."
]

# --- PART 2 ---
p2_say = [
    "The fundamental legal requirement that determines whether a corporate whistleblower mechanism succeeds or fails is the statutory 'Anti-Victimization and Retaliation Shield'. Section 177(10) of the Companies Act, 2013 explicitly commands that 'the vigil mechanism shall provide for adequate safeguards against victimization of persons who use such mechanism.' In employment law and corporate governance, victimization encompasses any adverse, discriminatory, or retaliatory action taken against an employee or director because they reported a genuine suspected violation of law, financial fraud, code of conduct breach, or safety hazard.",
    "Victimization in corporate practice rarely occurs through overt, written termination notices stating that the employee was fired for blowing the whistle. Instead, sophisticated corporate wrongdoers engage in 'Constructive Discharge' and subtle professional retaliation. Tactics include: abrupt negative performance appraisals following years of exemplary ratings; transfers to remote geographic locations without business justification; stripping the employee of managerial duties, passwords, or team reports; freezing variable bonuses and stock option vesting; launching pretextual disciplinary inquiries; or subjecting the whistleblower to workplace ostracization and harassment.",
    "To establish an effective legal shield, corporate Whistleblower Policies must incorporate enforceable anti-retaliation covenants. The policy must state unequivocally that any employee, manager, or director who retaliates against a whistleblower is guilty of gross misconduct punishable by immediate termination of employment, forfeiture of executive bonuses, and potential civil action for damages. The policy must also establish a 'Burden of Proof Inversion': if an employee is subjected to an adverse employment action (such as termination, demotion, or salary freeze) within twelve (12) months of filing a protected disclosure, a statutory presumption arises that the action was retaliatory. The burden shifts to executive management to prove by clear and convincing evidence that the employment action was taken exclusively on legitimate, documented commercial grounds entirely unrelated to the whistleblowing disclosure.",
    "Furthermore, the Audit Committee must be empowered to issue interim protective injunctions. If an internal whistleblower reports that their immediate supervisor is threatening their employment, the Audit Committee can direct the human resources department to execute an immediate administrative transfer of the reporting line, ensuring the whistleblower reports to an independent executive or directly to the Chief Compliance Officer pending the outcome of the forensic investigation.",
    "However, corporate law also guards against frivolous, malicious, or vexatious complaints. Under Rule 7(5) of the Companies (Meetings of Board and its Powers) Rules, 2014, in case of repeated frivolous complaints being filed by a director or an employee, the Audit Committee or the nominated director may take suitable action against the concerned person, including reprimand. This balance ensures that the vigil mechanism remains a sacred channel for exposing corporate wrongdoing rather than being weaponized as a tool for personal vendettas or workplace harassment."
]

p2_code = """# Part 2: Whistleblower Anti-Retaliation Legal Shield & Burden-Shift Auditor
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class WhistleblowerIncidentReport:
    whistleblower_id: str
    disclosure_filed_date_months_ago: int
    adverse_employment_action: str  # e.g., "TERMINATION", "DEMOTION", "SALARY_FREEZE", "NONE"
    employer_provided_documented_pretext: bool
    unrelated_performance_documentation_exists: bool
    whistleblower_complaint_was_malicious_frivolous: bool

class AntiRetaliationShieldEngine:
    @staticmethod
    def audit_retaliation_liability(inc: WhistleblowerIncidentReport) -> Tuple[bool, str, Dict]:
        # Rule 7(5): If complaint was frivolous/malicious, disciplinary action against complainant permitted
        if inc.whistleblower_complaint_was_malicious_frivolous:
            return False, "COMPLAINANT_DISCIPLINARY_ACTION_PERMITTED: Repeated frivolous/malicious filing under Rule 7(5).", {
                "protection_active": False,
                "action": "Reprimand or disciplinary inquiry against bad-faith complainant"
            }
            
        if inc.adverse_employment_action == "NONE":
            return True, "SAFE_NO_RETALIATION: Zero adverse employment action detected.", {
                "protection_active": True,
                "status": "EMPLOYEE_PROTECTED"
            }
            
        # Rebuttable presumption: If adverse action occurred within 12 months of disclosure, presumed retaliatory
        is_within_twilight_window = inc.disclosure_filed_date_months_ago <= 12
        
        if is_within_twilight_window:
            # Burden of proof inverted: Employer must present prior, documented performance evidence
            if not inc.unrelated_performance_documentation_exists:
                return False, "ILLEGAL_VICTIMIZATION_CONFIRMED: Adverse action within 12 months without prior documented cause.", {
                    "protection_active": True,
                    "statutory_violation": "Section 177(10) Victimization Prohibition",
                    "remedies": [
                        "Mandatory reinstatement with full back-pay",
                        "Immediate restoration of reporting lines by Audit Committee",
                        "Disciplinary termination of retaliating supervisor"
                    ]
                }
            else:
                return True, "ACTION_REBUTTED: Employer established independent, documented performance rationale.", {
                    "protection_active": True,
                    "status": "Legitimate managerial action substantiated by pre-existing records"
                }
                
        return True, "EXPIRED_PRESUMPTION: Adverse action occurred outside 12-month presumption window.", {"protection_active": True}

inc_retaliation = WhistleblowerIncidentReport("WB-801", disclosure_filed_date_months_ago=3, adverse_employment_action="TERMINATION", 
                                              employer_provided_documented_pretext=True, unrelated_performance_documentation_exists=False, 
                                              whistleblower_complaint_was_malicious_frivolous=False)
inc_frivolous = WhistleblowerIncidentReport("WB-802", disclosure_filed_date_months_ago=1, adverse_employment_action="WARNING", 
                                            employer_provided_documented_pretext=True, unrelated_performance_documentation_exists=True, 
                                            whistleblower_complaint_was_malicious_frivolous=True)

ok1, msg1, det1 = AntiRetaliationShieldEngine.audit_retaliation_liability(inc_retaliation)
ok2, msg2, det2 = AntiRetaliationShieldEngine.audit_retaliation_liability(inc_frivolous)

print(f"Incident 1 [{inc_retaliation.whistleblower_id}]: {msg1}")
if not ok1 and "remedies" in det1:
    print(f" - Enforced Remedy: {det1['remedies'][0]}")
print("--------------------------------------------------------------------------------")
print(f"Incident 2 [{inc_frivolous.whistleblower_id}]: {msg2}")
"""

p2_codeNotes = [
    "Codifies Section 177(10) anti-victimization protections and inverted burden-of-proof mechanics.",
    "Applies 12-month presumption window: presumes adverse employment action is retaliatory unless prior documented proof exists.",
    "Enforces mandatory reinstatement, back-pay, and disciplinary sanctions against retaliating executive managers.",
    "Balances whistleblower rights against Rule 7(5) remedies for addressing malicious or frivolous complaints."
]

# --- PART 3 ---
p3_say = [
    "While the Companies Act establishes internal company-level vigil mechanisms, the Securities and Exchange Board of India (SEBI) has instituted a formidable external statutory bounty and informant framework under Chapter IIIA of the SEBI (Prohibition of Insider Trading) Regulations, 2015 (SEBI PIT Regulations). Inserted to combat sophisticated insider trading cartels, front-running, and unpublished price sensitive information (UPSI) leaks, the SEBI Informant Mechanism directly incentivizes corporate insiders to blow the whistle on securities fraud by providing massive financial rewards and absolute regulatory confidentiality.",
    "Under Regulation 7B of SEBI PIT, an individual who possesses original information relating to an act of insider trading that has occurred, is occurring, or is about to occur may voluntarily submit such information to SEBI. The disclosure must be submitted using the standardized 'Voluntary Information Disclosure Form' (VIDF) directly to the Office of Informant Assistance (OIA), a specialized, ring-fenced regulatory division established by SEBI. 'Original Information' is legally defined as information that is: (a) derived from the independent knowledge or analysis of the informant; (b) not already known to SEBI from any other source; and (c) not exclusively derived from an allegation made in a judicial or administrative hearing or government report, unless the informant is the original source.",
    "To incentivize high-level corporate officers, compliance personnel, and investment bankers who might otherwise hesitate to jeopardize lucrative careers, SEBI introduced an extraordinary monetary reward system under Regulation 7D. Under current amended regulations, the informant is entitled to receive a monetary reward of up to ten percent (10%) of the total monies collected by SEBI through disgorgement orders, penalties, or settlement amounts, subject to a statutory maximum ceiling of Rupees ten (10) crore. This financial bounty represents the highest individual whistleblower incentive offered by any regulatory authority in Indian history.",
    "Crucially, the SEBI Informant regime provides absolute confidentiality and legal immunity. Under Regulation 7H, the identity of an informant is completely exempt from disclosure under the Right to Information Act, 2005 (RTI). SEBI is legally prohibited from disclosing the name, address, or identifying details of the informant in any public order, press release, or court proceeding. Informants have the legal right to submit the VIDF anonymously through an empaneled legal practitioner, who acts as the sole communication conduit between the informant and the Office of Informant Assistance until the formal reward disbursement.",
    "Furthermore, Regulation 7I creates a statutory bar against employer retaliation for SEBI disclosures. Any employee who files a VIDF or cooperates with SEBI is protected against discharge, demotion, suspension, threats, harassment, or discrimination by their employer. If an employer incorporates a clause in an employment agreement, non-disclosure agreement (NDA), or severance agreement attempting to prevent an employee from reporting insider trading to SEBI, such contractual clause is declared void ab initio under Regulation 7J, and the employer is liable for prosecution under the SEBI Act."
]

p3_code = """# Part 3: SEBI PIT Informant Bounty & Original Information Evaluator
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class SEBIInformantFiling:
    filing_id: str
    is_original_information: bool
    derived_from_independent_knowledge: bool
    already_known_to_sebi: bool
    submitted_via_legal_counsel_anonymously: bool
    total_monies_disgorged_by_sebi_inr_cr: float

class SEBIPITInformantController:
    MAX_REWARD_CAP_INR_CR = 10.0  # Rs 10 Crore maximum statutory cap under amended SEBI PIT rules

    @classmethod
    def evaluate_informant_reward(cls, filing: SEBIInformantFiling) -> Tuple[bool, str, Dict]:
        # Qualification test under Regulation 7B
        if not filing.derived_from_independent_knowledge:
            return False, "DISQUALIFIED: Information not derived from independent knowledge or analysis.", {}
            
        if filing.already_known_to_sebi:
            return False, "DISQUALIFIED: Information was already in SEBI's possession prior to filing.", {}
            
        if not filing.is_original_information:
            return False, "DISQUALIFIED: Lacks original information character under Regulation 7A.", {}
            
        # Calculation of Monetary Reward under Regulation 7D:
        # Up to 10% of monies disgorged/collected, capped at Rs 10 Crore
        gross_10pct_reward = filing.total_monies_disgorged_by_sebi_inr_cr * 0.10
        final_reward_cr = min(gross_10pct_reward, cls.MAX_REWARD_CAP_INR_CR)
        
        details = {
            "filing_id": filing.filing_id,
            "status": "APPROVED_FOR_INFORMANT_BOUNTY",
            "total_disgorgement_cr": filing.total_monies_disgorged_by_sebi_inr_cr,
            "calculated_10pct_reward_cr": round(gross_10pct_reward, 4),
            "final_reward_awarded_cr": round(final_reward_cr, 4),
            "final_reward_awarded_inr_lakhs": round(final_reward_cr * 100, 2),
            "anonymity_preserved": filing.submitted_via_legal_counsel_anonymously,
            "rti_exemption_guaranteed": True
        }
        return True, "SEBI_PIT_INFORMANT_REWARD_SANCTIONED", details

f1 = SEBIInformantFiling("VIDF-2026-901", is_original_information=True, derived_from_independent_knowledge=True, 
                         already_known_to_sebi=False, submitted_via_legal_counsel_anonymously=True, 
                         total_monies_disgorged_by_sebi_inr_cr=145.0)

approved, status_msg, reward_data = SEBIPITInformantController.evaluate_informant_reward(f1)
print(f"Filing Status: {status_msg}")
print(f"Total Disgorgement Collected: INR {reward_data['total_disgorgement_cr']:.2f} Crores")
print(f"Calculated 10% Reward: INR {reward_data['calculated_10pct_reward_cr']:.2f} Crores")
print(f"Statutory Capped Reward Awarded: INR {reward_data['final_reward_awarded_cr']:.2f} Crores (INR {reward_data['final_reward_awarded_inr_lakhs']:.1f} Lakhs)")
print(f"Anonymity Preserved via Legal Counsel: {reward_data['anonymity_preserved']}")
"""

p3_codeNotes = [
    "Models the SEBI Prohibition of Insider Trading (PIT) Chapter IIIA Informant Mechanism.",
    "Audits Original Information criteria: independent knowledge, novelty, and absence of prior regulatory awareness.",
    "Calculates the statutory monetary reward (10% of disgorgement) subject to the maximum Rs 10 crore ceiling.",
    "Verifies procedural confidentiality: anonymous filing through legal counsel and absolute exemption under RTI Act, 2005."
]

# --- PART 4 ---
p4_say = [
    "In operational enterprise compliance, the technical and forensic architecture of the whistleblower intake mechanism determines whether employees trust the system. If employees believe that whistleblower reports are intercepted by internal IT administrators, routed through corporate email servers, or monitored by human resources, no employee will report high-level corporate fraud. To overcome this credibility barrier, modern listed corporations deploy independent, third-party managed digital whistleblower platforms combined with cryptographic anonymity hashing.",
    "A state-of-the-art whistleblower intake portal incorporates four architectural pillars: (1) Third-Party Hosting: The portal is hosted entirely on independent, SOC 2 Type II certified cloud infrastructure completely segregated from the company's internal intranet and Active Directory networks; (2) Zero-Knowledge Cryptography: When an informant submits a disclosure, the system generates an irreversible SHA-256 cryptographic hash of the informant's identity, providing the user with a randomized 16-character alphanumeric tracking token. All follow-up communications between the investigator and the whistleblower occur through this encrypted token without revealing the user's IP address, device metadata, or email; (3) Multi-Channel Ingress: Providing 24/7 toll-free multilingual voice hotlines, secure mobile web forms, and physical postal channels directly to the Audit Committee; and (4) Immutable Audit Trail: Every timestamp, document upload, investigator note, and status change is logged into an immutable ledger to prevent post-facto tampering or deletion.",
    "Once a protected disclosure enters the intake portal, it must be processed through a standardized Forensic Triage Protocol. The protocol establishes four progressive stages: Stage 1 (Initial Screening): Within 48 hours of receipt, the Chief Compliance Officer or Ombudsman conducts a preliminary check to determine whether the complaint involves a genuine protected concern (e.g. financial fraud, corruption, sexual harassment under POSH, safety violation) or a routine individual HR grievance. Stage 2 (Conflict of Interest Check): The intake officer checks whether any member of executive management or the investigation team is named in the complaint. If an executive director is implicated, the case is immediately escalated directly to the Chairperson of the Audit Committee. Stage 3 (Preliminary Inquiry): If prima facie evidence exists, an independent forensic investigation team is appointed to preserve electronic evidence, analyze banking transactions, and interview relevant witnesses. Stage 4 (Reporting and Remediation): The final forensic report is submitted to the Audit Committee for determining corrective disciplinary action, regulatory reporting, and legal remediation.",
    "Furthermore, corporate transparency mandates that statistics regarding the whistleblower mechanism be publicly disclosed. Under the Business Responsibility and Sustainability Report (BRSR) Principle 1 and the Annual Corporate Governance Report mandated by SEBI LODR Schedule V, listed entities must disclose: the number of whistleblower complaints received during the financial year, the number of complaints investigated and disposed of, the number of complaints pending, and the nature of corrective actions taken. This mandatory public reporting holds corporate boards accountable to shareholders and regulatory authorities."
]

p4_code = """# Part 4: Cryptographic Anonymity Hashing & Forensic Intake Triage Engine
import hashlib
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class WhistleblowerSubmission:
    raw_informant_name: str
    contact_email: str
    allegation_category: str  # "FINANCIAL_FRAUD", "INSIDER_TRADING", "BRIBERY", "HR_GRIEVANCE"
    implicated_party_designation: str  # e.g., "MANAGING_DIRECTOR", "PLANT_MANAGER"
    supporting_evidence_attached: bool

class WhistleblowerForensicTriage:
    @staticmethod
    def process_intake(sub: WhistleblowerSubmission) -> Tuple[str, Dict]:
        # 1. Cryptographic Identity Anonymization (SHA-256 tokenization)
        identity_seed = f"{sub.raw_informant_name}|{sub.contact_email}|SALT_SECURE_2026"
        token_hash = hashlib.sha256(identity_seed.encode("utf-8")).hexdigest()[:16].upper()
        token_id = f"WB-TOKEN-{token_hash}"
        
        # 2. Triage & Escalation Path
        is_protected_concern = sub.allegation_category in {"FINANCIAL_FRAUD", "INSIDER_TRADING", "BRIBERY"}
        is_senior_executive_implicated = sub.implicated_party_designation in {"MANAGING_DIRECTOR", "CEO", "CFO", "BOARD_DIRECTOR"}
        
        if not is_protected_concern:
            escalation_channel = "HUMAN_RESOURCES_STANDARD_GRIEVANCE"
            urgency = "LOW"
            action = "Re-route to internal HR portal; not covered by Section 177 vigil mechanism."
        elif is_senior_executive_implicated:
            escalation_channel = "DIRECT_TO_AUDIT_COMMITTEE_CHAIR"
            urgency = "CRITICAL_IMMEDIATE"
            action = "Bypass all executive management; notify Independent Audit Committee Chairperson within 24 hours."
        else:
            escalation_channel = "INTERNAL_OMBUDSMAN_INVESTIGATION"
            urgency = "HIGH"
            action = "Assign independent forensic team; conduct 30-day evidentiary inquiry."
            
        triage_report = {
            "tracking_token": token_id,
            "allegation": sub.allegation_category,
            "escalation_channel": escalation_channel,
            "urgency_level": urgency,
            "recommended_action": action,
            "anonymity_status": "CRYPTOGRAPHICALLY_PROTECTED",
            "evidence_attached": sub.supporting_evidence_attached
        }
        return token_id, triage_report

sub_md = WhistleblowerSubmission("Vikram Sharma", "v.sharma@internal-corp.in", "FINANCIAL_FRAUD", "MANAGING_DIRECTOR", True)
sub_hr = WhistleblowerSubmission("Anita Roy", "a.roy@internal-corp.in", "HR_GRIEVANCE", "SENIOR_MANAGER", False)

tok1, rep1 = WhistleblowerForensicTriage.process_intake(sub_md)
tok2, rep2 = WhistleblowerForensicTriage.process_intake(sub_hr)

print(f"Submission 1 Tracking Token: {tok1}")
print(f" - Category: {rep1['allegation']} | Urgency: {rep1['urgency_level']}")
print(f" - Escalation: {rep1['escalation_channel']}")
print(f" - Action: {rep1['recommended_action']}")
print("--------------------------------------------------------------------------------")
print(f"Submission 2 Tracking Token: {tok2}")
print(f" - Category: {rep2['allegation']} | Escalation: {rep2['escalation_channel']}")
"""

p4_codeNotes = [
    "Generates SHA-256 cryptographic identity tokens preserving 100% informant anonymity.",
    "Performs automated forensic triage: segregates genuine protected concerns from routine HR grievances.",
    "Enforces Section 177(10) direct escalation to the Audit Committee Chairperson when senior executive management is implicated.",
    "Outputs structured, audit-proof intake reports for inclusion in statutory annual corporate governance filings."
]

# --- PART 5 ---
p5_say = [
    "To achieve complete mastery over corporate vigil mechanisms and whistleblower jurisprudence, corporate legal counsels, compliance officers, and audit committees must assemble Section 177 statutory mandates, anti-retaliation legal shields, SEBI PIT informant protocols, and cryptographic intake architectures into an integrated enterprise system. In complex corporate conglomerates, an uncompromised whistleblower mechanism is the ultimate shield protecting the board of directors from catastrophic corporate fraud and multi-million rupee regulatory penalties.",
    "The industrial-grade Python engine developed in this masterclass encapsulates the complete whistleblower and vigil mechanism architecture for 'Apex Global Conglomerate Ltd', a leading listed diversified enterprise with Rs 22,000 crore in turnover. The simulator models the receipt of an explosive protected disclosure: an internal senior financial controller uncovers that the Managing Director and Chief Financial Officer have orchestrated an undisclosed Rs 85 crore related party invoice round-tripping scheme to inflate quarterly EBITDA. Concurrently, the informant reports illicit insider trading executed prior to quarterly financial results.",
    "The engine sequentially executes five advanced compliance modules: First, it generates an irreversible SHA-256 cryptographic anonymity token, shielding the informant's identity from internal IT and HR networks. Second, it executes automated forensic triage, identifying high-level executive implication and activating the statutory direct escalation protocol to the Audit Committee Chairperson under Section 177(10). Third, it evaluates the insider trading disclosure against SEBI PIT Chapter IIIA criteria, preparing a compliant Voluntary Information Disclosure Form (VIDF) and calculating a Rs 8.50 crore statutory informant bounty on a Rs 85 crore disgorgement.",
    "Fourth, it deploys the Anti-Retaliation Shield Engine: when executive management attempts to retaliate against the financial controller with a retaliatory suspension, the engine invokes the 12-month presumption rule, invalidates the suspension order, mandates immediate administrative transfer to the Audit Committee, and initiates disciplinary termination of the retaliating executives. Fifth, it compiles the statutory Annual Corporate Governance Disclosures required under SEBI LODR Schedule V. Upon executing all five compliance modules with zero errors, the engine outputs the definitive masterclass certification code: VIGIL_MECHANISM_AND_WHISTLEBLOWER_SHIELD_PASS."
]

p5_code = """# Part 5: Production Vigil Mechanism, Cryptographic Anonymity & Anti-Retaliation Master Engine
import hashlib
from dataclasses import dataclass
from typing import Dict, List, Tuple

class WhistleblowerMasterEngine:
    def __init__(self, enterprise_name: str, is_listed: bool):
        self.enterprise_name = enterprise_name
        self.is_listed = is_listed
        self.disclosures: Dict[str, Dict] = {}
        self.retaliation_blocks: List[Dict] = []
        self.sebi_bounties: List[Dict] = []
        self.audit_log: List[str] = []

    def ingest_protected_disclosure(self, informant_raw_id: str, allegation: str, 
                                   implicated_exec: str, evidence_verified: bool) -> str:
        token = f"WB-CRYPT-{hashlib.sha256((informant_raw_id + 'SALT_2026').encode()).hexdigest()[:12].upper()}"
        
        # Section 177(10) Direct Escalation Check
        direct_to_audit_chair = implicated_exec in {"MANAGING_DIRECTOR", "CFO", "CEO"}
        
        rec = {
            "token": token,
            "allegation": allegation,
            "implicated": implicated_exec,
            "direct_to_audit_chair": direct_to_audit_chair,
            "evidence_verified": evidence_verified,
            "status": "ESCALATED_TO_AUDIT_COMMITTEE_CHAIR" if direct_to_audit_chair else "INTERNAL_INQUIRY"
        }
        self.disclosures[token] = rec
        self.audit_log.append(f"Disclosure Ingested [{token}]: {allegation} against {implicated_exec} -> {rec['status']}")
        return token

    def block_retaliatory_adverse_action(self, token: str, adverse_action_attempted: str, 
                                        months_since_filing: int) -> bool:
        assert token in self.disclosures, "Invalid tracking token"
        assert months_since_filing <= 12, "Within statutory 12-month protection window"
        
        block_order = {
            "token": token,
            "action_blocked": adverse_action_attempted,
            "remedy": "INJUNCTION_ISSUED_BY_AUDIT_COMMITTEE",
            "status": "RETALIATION_NEUTRALIZED"
        }
        self.retaliation_blocks.append(block_order)
        self.audit_log.append(f"Retaliation Shield Triggered [{token}]: Blocked {adverse_action_attempted}; protected under Section 177(10)")
        return True

    def calculate_sebi_pit_bounty(self, token: str, disgorgement_inr_cr: float) -> float:
        reward = min(disgorgement_inr_cr * 0.10, 10.0) # 10% capped at Rs 10 Cr
        bounty_data = {
            "token": token,
            "disgorgement_cr": disgorgement_inr_cr,
            "reward_awarded_cr": reward
        }
        self.sebi_bounties.append(bounty_data)
        self.audit_log.append(f"SEBI PIT Bounty Sanctioned [{token}]: INR {reward:.2f} Cr (Disgorgement: INR {disgorgement_inr_cr:.2f} Cr)")
        return reward

    def run_masterclass_grand_audit(self) -> bool:
        print("================================================================================")
        print("   CORPORATE VIGIL MECHANISM & SEBI PIT WHISTLEBLOWER SHIELD ENGINE             ")
        print("================================================================================")
        print(f"Listed Enterprise: {self.enterprise_name} | SEBI LODR Reg 22 & S.177 Mandate Active")
        print("--------------------------------------------------------------------------------")
        for log in self.audit_log:
            print(f"[*] {log}")
            
        print("--------------------------------------------------------------------------------")
        print(f"Total Protected Disclosures Managed: {len(self.disclosures)}")
        print(f"Retaliatory Actions Blocked & Injoined: {len(self.retaliation_blocks)}")
        print(f"SEBI PIT Bounties Calculated: {len(self.sebi_bounties)}")
        print("================================================================================")
        
        # Verify strict statutory invariants
        assert self.is_listed, "Entity must be listed under SEBI LODR"
        assert len(self.disclosures) == 1, "Must register protected disclosure"
        assert list(self.disclosures.values())[0]["direct_to_audit_chair"], "Must escalate directly to Audit Committee Chair"
        assert len(self.retaliation_blocks) == 1, "Must neutralize retaliatory adverse employment actions"
        assert self.sebi_bounties[0]["reward_awarded_cr"] == 8.50, "Bounty must equal exactly 10% of Rs 85 Cr (INR 8.50 Cr)"
        
        print("[PASS] VIGIL_MECHANISM_AND_WHISTLEBLOWER_SHIELD_PASS")
        return True

engine = WhistleblowerMasterEngine("Apex Global Conglomerate Ltd", is_listed=True)
tok = engine.ingest_protected_disclosure("EMP-7712", "EBITDA Fraud & Insider Trading", "MANAGING_DIRECTOR", True)
engine.block_retaliatory_adverse_action(tok, "RETALIATORY_SUSPENSION_AND_TRANSFER", months_since_filing=2)
engine.calculate_sebi_pit_bounty(tok, disgorgement_inr_cr=85.0)

engine.run_masterclass_grand_audit()
"""

p5_codeNotes = [
    "Production-grade corporate vigil mechanism engine integrating Companies Act Section 177 and SEBI LODR Regulation 22.",
    "Generates SHA-256 cryptographic tokens ensuring irreversible informant anonymity.",
    "Enforces Section 177(10) direct escalation to the Independent Audit Committee Chairperson.",
    "Neutralizes retaliatory suspension orders and applies 12-month statutory burden-of-proof inversion.",
    "Computes SEBI PIT Chapter IIIA monetary informant bounties and confirms: `VIGIL_MECHANISM_AND_WHISTLEBLOWER_SHIELD_PASS`."
]

parts_spec = [
    ("Part 1: Section 177(9) Vigil Mechanism Mandate & Governance Architecture", p1_say, p1_code, p1_codeNotes,
     "Assess statutory applicability under Section 177(9) and evaluate Audit Committee oversight under SEBI LODR Regulation 22.",
     "Which categories of companies are statutorily required to establish a Vigil Mechanism under Companies Act Section 177(9)?",
     ["Every listed company, companies that accept public deposits, and companies with bank/PFI borrowings exceeding Rs 50 crore",
      "Only foreign airlines operating charter flights to India",
      "Only agricultural cooperatives registered under state society laws",
      "Private startups with fewer than ten employees"],
     "Section 177(9) read with Rule 7 mandates vigil mechanisms for all listed companies, deposit-accepting companies, and companies with borrowings > Rs 50 crore."),

    ("Part 2: Whistleblower Anti-Victimization Shield & Burden Inversion", p2_say, p2_code, p2_codeNotes,
     "Deploy Section 177(10) anti-victimization protections and apply 12-month burden-of-proof inversion against employer retaliation.",
     "Under Section 177(10), what critical statutory safeguard must be guaranteed to an employee filing a protected disclosure?",
     ["Adequate safeguards against victimization and direct access to the Chairperson of the Audit Committee in exceptional cases",
      "Immediate doubling of the employee's salary and lifetime tenure",
      "Automatic transfer of the company's patent portfolio to the employee",
      "Exemption from all federal and state tax liabilities"],
     "Section 177(10) mandates adequate safeguards against victimization and ensures direct access to the Audit Committee Chairperson."),

    ("Part 3: SEBI PIT Chapter IIIA Informant Mechanism & Monetary Bounties", p3_say, p3_code, p3_codeNotes,
     "Evaluate Voluntary Information Disclosure Forms (VIDF) and calculate informant bounties up to the Rs 10 crore statutory cap.",
     "What maximum monetary reward can an informant receive from SEBI under Chapter IIIA of the SEBI PIT Regulations?",
     ["Up to 10% of monies disgorged or collected, subject to a statutory maximum ceiling of Rupees 10 crore",
      "A flat reward of exactly Rs 1,000 regardless of the fraud amount",
      "Fifty percent of the market capitalization of the target company",
      "Zero monetary reward; informants receive only a certificate of appreciation"],
     "Regulation 7D of SEBI PIT establishes an informant reward of up to 10% of monies collected, capped at Rs 10 crore."),

    ("Part 4: Digital Whistleblower Architecture & Cryptographic Triage Protocols", p4_say, p4_code, p4_codeNotes,
     "Implement SHA-256 identity hashing and execute 4-stage forensic triage for protected whistleblower disclosures.",
     "Why do modern corporate compliance systems deploy SHA-256 cryptographic hashing for whistleblower intake?",
     ["To preserve 100% informant anonymity by generating an untraceable tracking token while enabling bi-directional secure communication",
      "To automatically delete all company emails after 24 hours",
      "To prevent external regulatory agencies from accessing court orders",
      "To convert financial statement ledgers into unregulated cryptocurrencies"],
     "Cryptographic identity hashing ensures total informant anonymity and shields whistleblowers from internal IT and HR surveillance."),

    ("Part 5: Production Vigil Mechanism & Anti-Retaliation Master Engine", p5_say, p5_code, p5_codeNotes,
     "Run the integrated vigil mechanism, cryptographic intake, anti-retaliation injunction, and SEBI bounty engine.",
     "What key milestone certification is awarded upon running the Day 53 production whistleblower simulator?",
     ["VIGIL_MECHANISM_AND_WHISTLEBLOWER_SHIELD_PASS validating Section 177 vigil mechanisms, anti-retaliation shields, and SEBI PIT bounties",
      "UNCONDITIONAL_EMPLOYMENT_TERMINATION_PASS allowing summary firing of employees without investigation",
      "CONFIDENTIAL_INSIDER_TRADING_PASS exempting executive directors from securities disclosure rules",
      "CORPORATE_SECRECY_ARBITRAGE_PASS permitting non-disclosure of financial fraud to statutory auditors"],
     "The engine validates Section 177 compliance, direct Audit Committee escalation, anti-retaliation injunctions, and SEBI bounties, issuing VIGIL_MECHANISM_AND_WHISTLEBLOWER_SHIELD_PASS.")
]

for idx, (title, say, code, notes, try_it, q, opts, expl) in enumerate(parts_spec, 1):
    print(f"Executing Day 53 Part {idx} code...")
    stdout = run_code(code)
    wc = count_words(say)
    print(f"Part {idx}: {wc} words in say. Code execution successful.")
    
    part_dict = {
        "title": title,
        "say": say,
        "example": f"Real-world operational scenario for {title}.",
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
    day53["parts"].append(part_dict)

total_day_words = sum(count_words(p["say"]) for p in day53["parts"])
print(f"=== DAY 53 TOTAL WORDS: {total_day_words} ===")

with open("scripts/bcom_law_day53.json", "w", encoding="utf-8") as f:
    json.dump(day53, f, indent=2)

print("Saved scripts/bcom_law_day53.json successfully!")
