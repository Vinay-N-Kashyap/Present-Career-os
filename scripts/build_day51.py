# scripts/build_day51.py
import json
import subprocess
import sys
import hashlib

def count_words(say_list: list) -> int:
    return sum(len(s.split()) for s in say_list)

def run_code(code_str: str) -> str:
    res = subprocess.run([sys.executable, "-c", code_str], capture_output=True, text=True, timeout=15)
    if res.returncode != 0:
        print("STDERR:", res.stderr)
        raise RuntimeError(f"Execution failed: {res.stderr}")
    return res.stdout

print("Designing Day 51 content...")

day51 = {
    "day": 51,
    "coursePrefix": "bcom_law",
    "title": "Day 51: ESG Regulatory Architecture & SEBI Business Responsibility and Sustainability Reporting (BRSR Core)",
    "summary": [
        "SEBI LODR Regulation 34(2)(f) mandates Business Responsibility and Sustainability Reporting (BRSR) for top 1,000 listed entities.",
        "BRSR Core establishes an audited baseline of 9 Key Performance Indicators (KPIs) requiring mandatory reasonable assurance.",
        "National Guidelines on Responsible Business Conduct (NGRBC) prescribe 9 core principles governing ethical, environmental, and social operations.",
        "Greenwashing and fraudulent ESG disclosures trigger severe statutory penalties under SEBI PFUTP and Companies Act Sections 447/448.",
        "Board of Directors and Audit Committees bear affirmative fiduciary duties under Section 166(2) to govern ESG risk management."
    ],
    "goal": "Master ESG regulatory compliance: navigate SEBI LODR Regulation 34(2)(f), audit BRSR Core metrics under the 9 NGRBC principles, evaluate Scope 1/2/3 GHG emissions and water intensity, mitigate greenwashing liability, and implement Board-level ESG governance controls.",
    "parts": []
}

# --- PART 1 ---
p1_say = [
    "In contemporary corporate law and securities regulation, the transition from voluntary corporate philanthropy to legally enforceable Environmental, Social, and Governance (ESG) compliance represents a historic paradigm shift. Historically, corporate performance was evaluated almost exclusively through backward-looking financial statements—audited balance sheets, profit and loss statements, and cash flow reports prepared under the Companies Act and Indian Accounting Standards (Ind AS). However, systemic climate risks, global supply chain disruptions, resource depletion, and human capital challenges have demonstrated to institutional investors and sovereign regulators that non-financial ESG factors exert a direct, material impact on a corporation's long-term enterprise value and systemic financial stability.",
    "The statutory cornerstone of ESG regulation in India is codified in Regulation 34(2)(f) of the Securities and Exchange Board of India (Listing Obligations and Disclosure Requirements) Regulations, 2015 (SEBI LODR). Under this regulation, the top 1,000 listed entities by market capitalization on Indian stock exchanges (BSE and NSE) are legally mandated to submit a comprehensive Business Responsibility and Sustainability Report (BRSR) as an integral component of their annual report. This reporting regime is rooted in the National Guidelines on Responsible Business Conduct (NGRBC) formulated by the Ministry of Corporate Affairs (MCA). The NGRBC articulates nine foundational principles: Principle 1 (Ethical Governance, Transparency & Accountability); Principle 2 (Sustainable, Safe Goods & Lifecycle Responsibility); Principle 3 (Employee Well-being & Labor Rights); Principle 4 (Stakeholder Responsiveness); Principle 5 (Human Rights Protection); Principle 6 (Environmental Stewardship & Climate Action); Principle 7 (Responsible Public & Regulatory Policy Advocacy); Principle 8 (Inclusive Growth & Community Development); and Principle 9 (Customer Value & Consumer Protection).",
    "Under the BRSR framework, listed corporations must transition away from subjective qualitative narratives and provide rigorous, quantitative disclosures across both Essential Indicators (mandatory compliance metrics) and Leadership Indicators (aspirational best practices). For instance, under Principle 6 (Environment), companies must disclose exact energy consumption in gigajoules, water withdrawal by source (groundwater, municipal supply, surface water), percentage of water recycled, Scope 1 direct greenhouse gas emissions, Scope 2 indirect emissions from purchased electricity, and hazardous versus non-hazardous waste generation. These disclosures must be presented alongside historical comparisons with the immediately preceding financial year, enabling regulators, credit rating agencies, and global asset managers to track the enterprise's environmental trajectory.",
    "From an evidentiary and corporate governance perspective, compliance with Regulation 34(2)(f) is not a mere public relations exercise; it is an enforceable securities law obligation. Failure to submit an accurate, compliant BRSR report or filing misleading disclosures exposes the listed entity, its Managing Director, Chief Executive Officer, and Compliance Officer to formal regulatory enforcement actions by SEBI under Section 11 and Section 11B of the SEBI Act, 1992. Furthermore, proxy advisory firms and institutional investors (such as sovereign wealth funds and domestic mutual funds) actively vote against the reappointment of independent directors and remuneration proposals of executive boards that fail to meet statutory ESG disclosure thresholds.",
    "Comparative international jurisprudence underscores this regulatory convergence. In the European Union, the Corporate Sustainability Reporting Directive (CSRD) and Sustainable Finance Disclosure Regulation (SFDR) impose rigorous double-materiality standards, requiring companies to disclose both how sustainability risks impact financial performance and how corporate operations impact people and the environment. Similarly, the United States Securities and Exchange Commission (SEC) has finalized climate-related disclosure rules requiring mandatory Scope 1 and Scope 2 reporting. India's BRSR framework places Indian capital markets at the forefront of this global regulatory harmonisation, ensuring that Indian corporate champions attract premium global capital while maintaining sustainable, responsible operations."
]

p1_code = """# Part 1: SEBI BRSR Regulatory Scope & NGRBC Principle Auditor
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class ListedCorporateProfile:
    company_name: str
    bse_nse_market_cap_rank: int
    turnover_cr: float
    has_submitted_brsr: bool
    essential_indicators_disclosed_pct: float
    leadership_indicators_disclosed_pct: float

class BRSRMandateAuditor:
    @staticmethod
    def audit_brsr_applicability(corp: ListedCorporateProfile) -> Tuple[bool, str, Dict]:
        # Under SEBI LODR Reg 34(2)(f), mandatory for Top 1,000 listed entities
        is_mandated = corp.bse_nse_market_cap_rank <= 1000
        
        if not is_mandated:
            return False, "VOLUNTARY: Entity ranks outside Top 1,000 listed entities; BRSR recommended as best practice.", {
                "mandated": False,
                "compliance_status": "EXEMPT_FROM_MANDATORY_REG_34"
            }
            
        # If mandated, evaluate disclosure completeness
        if not corp.has_submitted_brsr:
            return True, "NON_COMPLIANT: Entity ranked in Top 1,000 failed to submit mandatory BRSR report.", {
                "mandated": True,
                "compliance_status": "STATUTORY_VIOLATION_SEBI_LODR_REG_34",
                "sebi_action": "Liable for penalty under SEBI Act Section 15HB"
            }
            
        if corp.essential_indicators_disclosed_pct < 100.0:
            return True, f"DEFECTIVE_FILING: Only {corp.essential_indicators_disclosed_pct:.1f}% Essential Indicators disclosed; 100% required.", {
                "mandated": True,
                "compliance_status": "INCOMPLETE_STATUTORY_DISCLOSURE",
                "remedy": "File revised BRSR addendum within 30 days"
            }
            
        return True, "FULLY_COMPLIANT: Mandated BRSR submitted with 100% Essential Indicators disclosed.", {
            "mandated": True,
            "compliance_status": "STATUTORY_REQUIREMENTS_SATISFIED",
            "leadership_grade": "EXCELLENT" if corp.leadership_indicators_disclosed_pct >= 75.0 else "STANDARD"
        }

corp_top50 = ListedCorporateProfile("Tata Steel Ltd", bse_nse_market_cap_rank=42, turnover_cr=140_000.0, 
                                   has_submitted_brsr=True, essential_indicators_disclosed_pct=100.0, leadership_indicators_disclosed_pct=82.5)
corp_mid = ListedCorporateProfile("Apex Logistics Ltd", bse_nse_market_cap_rank=650, turnover_cr=3_200.0, 
                                 has_submitted_brsr=True, essential_indicators_disclosed_pct=88.0, leadership_indicators_disclosed_pct=40.0)

res1, status1, details1 = BRSRMandateAuditor.audit_brsr_applicability(corp_top50)
res2, status2, details2 = BRSRMandateAuditor.audit_brsr_applicability(corp_mid)

print(f"Company: {corp_top50.company_name} | Rank: #{corp_top50.bse_nse_market_cap_rank}")
print(f"Status: {status1} -> {details1['compliance_status']}")
print("--------------------------------------------------------------------------------")
print(f"Company: {corp_mid.company_name} | Rank: #{corp_mid.bse_nse_market_cap_rank}")
print(f"Status: {status2} -> {details2['compliance_status']}")
"""

p1_codeNotes = [
    "Evaluates statutory BRSR reporting mandate under SEBI LODR Regulation 34(2)(f) based on market capitalization rank.",
    "Distinguishes between mandatory Essential Indicators (100% required) and aspirational Leadership Indicators.",
    "Identifies regulatory infractions under SEBI Act Section 15HB for missing or defective sustainability filings.",
    "Outputs compliance statuses and actionable rectification pathways for corporate governance teams."
]

# --- PART 2 ---
p2_say = [
    "To introduce rigorous reliability and prevent superficial corporate disclosures, SEBI issued a landmark Master Circular in July 2023 establishing the 'BRSR Core' framework. Prior to this intervention, corporate sustainability reporting suffered from a fundamental credibility deficit: while financial statements were rigorously audited by independent chartered accountants under statutory auditing standards, ESG reports were largely self-certified qualitative brochures without independent third-party verification. SEBI recognized that global institutional investors allocate capital based on sustainability metrics; therefore, ESG disclosures must be subjected to the same exacting standards of evidentiary assurance as statutory financial statements.",
    "The 'BRSR Core' is a specialized, objective subset of the wider BRSR framework, comprising nine quantifiable Key Performance Indicators (KPIs) that represent the critical pulse of an enterprise's ESG performance. These nine core parameters cover: (1) Green-House Gas (GHG) Footprint: Scope 1 direct emissions and Scope 2 indirect emissions calculated in metric tonnes of CO2 equivalent, alongside GHG intensity normalized per rupee of turnover; (2) Water Footprint: total water consumption, water withdrawal intensity per rupee of turnover, and percentage of water recycled; (3) Energy Footprint: total energy consumed, proportion of renewable energy in the energy mix, and energy intensity; (4) Waste Management: total hazardous and non-hazardous waste generated, recovery and recycling rates, and zero waste to landfill certification; (5) Employee Health and Safety: Lost Time Injury Frequency Rate (LTIFR) per million hours worked and fatalities; (6) Gender Diversity: percentage of women employees, female board representation, and the median wage ratio between male and female personnel; (7) Wage Fairness: gross wages paid to female employees as a percentage of total wages, and compliance with statutory minimum wages; (8) Well-being & Training: percentage of employees covered by health insurance and skill enhancement programs; and (9) Openness of Business: percentage of input materials sourced from local or MSME suppliers, and job creation in small towns.",
    "Under SEBI's phased roadmap, the top 150 listed entities by market capitalization were required to obtain mandatory 'Reasonable Assurance' over their BRSR Core KPIs starting in Financial Year 2023–24, expanding to the top 250 in FY 2024–25, the top 500 in FY 2025–26, and the top 1,000 in FY 2026–27. Crucially, the assurance provider cannot be an internal auditor; it must be an independent assurance entity possessing demonstrable competence in environmental accounting and sustainability standards. The assurance provider must certify that they have examined evidentiary records, metering devices, utility invoices, and payroll ledgers to verify the reported figures under international assurance standards (such as ISAE 3000 / AA1000AS).",
    "Perhaps the most revolutionary aspect of the BRSR Core regime is its extraterritorial expansion into the corporate Value Chain (Scope 3 emissions and supply chain ESG). Beginning in FY 2024–25 for the top 250 listed entities on a 'comply-or-explain' basis, corporations must extend BRSR Core disclosures to their top supply chain partners—accounting for at least 75% of their total purchases or sales by value. This value-chain mandate forces large conglomerates (such as automobile manufacturers and FMCG giants) to audit tier-1 vendors, micro-enterprises, and logistics suppliers for carbon intensity, child labor, and wage compliance. Small and medium enterprises (MSMEs) seeking to do business with India's largest corporations must therefore adopt carbon accounting and ESG hygiene to maintain their supplier contracts.",
    "Corporate legal counsels and compliance officers must structure contractual 'ESG Supplier Covenants' across all procurement master service agreements (MSAs). These clauses mandate that vendors maintain verifiable energy and water metering, submit to annual third-party sustainability audits, and grant audit inspection rights to the principal company. If a supplier falsifies its carbon intensity or violates workplace safety standards, the principal listed entity faces immediate contagion risk, potentially disqualifying its own BRSR Core assurance report and triggering investor divestment."
]

p2_code = """# Part 2: BRSR Core 9-KPI Assurance & Intensity Calculator
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class BRSRCoreInputMetrics:
    turnover_inr_crores: float
    scope_1_ghg_mt_co2e: float
    scope_2_ghg_mt_co2e: float
    water_consumed_kilolitres: float
    water_recycled_kilolitres: float
    total_energy_consumed_gj: float
    renewable_energy_gj: float
    lost_time_injuries_count: int
    total_manhours_worked_millions: float
    female_workforce_pct: float
    male_median_salary_lakhs: float
    female_median_salary_lakhs: float
    independent_assurance_obtained: bool

class BRSRCoreAuditor:
    @staticmethod
    def compute_and_audit_kpis(metrics: BRSRCoreInputMetrics) -> Tuple[bool, Dict, List[str]]:
        audit_flags = []
        
        # 1. GHG Intensity (MT CO2e per Crore of Turnover)
        total_ghg = metrics.scope_1_ghg_mt_co2e + metrics.scope_2_ghg_mt_co2e
        ghg_intensity = total_ghg / metrics.turnover_inr_crores
        
        # 2. Water Recycling Ratio
        water_recycle_pct = (metrics.water_recycled_kilolitres / metrics.water_consumed_kilolitres) * 100.0 if metrics.water_consumed_kilolitres > 0 else 0.0
        if water_recycle_pct < 20.0:
            audit_flags.append(f"FLAG: Water recycling rate ({water_recycle_pct:.1f}%) is below 20% sustainable benchmark.")
            
        # 3. Renewable Energy Share
        renewable_pct = (metrics.renewable_energy_gj / metrics.total_energy_consumed_gj) * 100.0 if metrics.total_energy_consumed_gj > 0 else 0.0
        
        # 4. Workplace Safety: LTIFR (Lost Time Injury Frequency Rate per million hours)
        ltifr = metrics.lost_time_injuries_count / metrics.total_manhours_worked_millions if metrics.total_manhours_worked_millions > 0 else 0.0
        if ltifr > 1.0:
            audit_flags.append(f"FLAG: LTIFR ({ltifr:.2f}) exceeds safe industrial threshold of 1.0 per million hours.")
            
        # 5. Gender Pay Equity Ratio (Female / Male Median Salary)
        gender_pay_equity_ratio = (metrics.female_median_salary_lakhs / metrics.male_median_salary_lakhs) if metrics.male_median_salary_lakhs > 0 else 1.0
        if gender_pay_equity_ratio < 0.80:
            audit_flags.append(f"FLAG: Gender pay equity ({gender_pay_equity_ratio:.2f}) indicates > 20% compensation disparity.")
            
        # 6. Assurance Verification
        if not metrics.independent_assurance_obtained:
            audit_flags.append("CRITICAL: Mandatory third-party reasonable assurance missing under SEBI Master Circular.")
            is_valid = False
        else:
            is_valid = len([f for f in audit_flags if "CRITICAL" in f]) == 0
            
        kpis = {
            "total_ghg_mt_co2e": total_ghg,
            "ghg_intensity_per_cr": round(ghg_intensity, 2),
            "water_recycle_pct": round(water_recycle_pct, 1),
            "renewable_energy_pct": round(renewable_pct, 1),
            "ltifr_rate": round(ltifr, 2),
            "gender_pay_equity": round(gender_pay_equity_ratio, 2),
            "assurance_certified": metrics.independent_assurance_obtained
        }
        
        return is_valid, kpis, audit_flags

data = BRSRCoreInputMetrics(
    turnover_inr_crores=5000.0,
    scope_1_ghg_mt_co2e=125000.0,
    scope_2_ghg_mt_co2e=45000.0,
    water_consumed_kilolitres=850000.0,
    water_recycled_kilolitres=320000.0,
    total_energy_consumed_gj=450000.0,
    renewable_energy_gj=180000.0,
    lost_time_injuries_count=2,
    total_manhours_worked_millions=4.5,
    female_workforce_pct=28.5,
    male_median_salary_lakhs=14.5,
    female_median_salary_lakhs=13.2,
    independent_assurance_obtained=True
)

valid, kpi_res, flags = BRSRCoreAuditor.compute_and_audit_kpis(data)
print(f"BRSR Core Audit Valid: {valid}")
print(f"GHG Intensity: {kpi_res['ghg_intensity_per_cr']} MT/Cr | Water Recycled: {kpi_res['water_recycle_pct']}%")
print(f"Renewable Share: {kpi_res['renewable_energy_pct']}% | LTIFR: {kpi_res['ltifr_rate']} | Pay Equity: {kpi_res['gender_pay_equity']}")
for fl in flags:
    print(f" [*] {fl}")
"""

p2_codeNotes = [
    "Computes SEBI BRSR Core Key Performance Indicators: GHG intensity, water recycling, renewable share, LTIFR, and pay equity.",
    "Normalizes emissions and resource consumption against gross turnover in Indian Rupees (Crores).",
    "Audits operational parameters against industrial safety and ESG benchmarks (LTIFR $\le 1.0$, water recycling $\ge 20\%$).",
    "Enforces mandatory third-party reasonable assurance certification under the SEBI July 2023 Master Circular."
]

# --- PART 3 ---
p3_say = [
    "As capital markets increasingly reward sustainable corporations with higher valuation multiples and lower borrowing costs, the corporate temptation to fabricate or exaggerate environmental credentials has created a severe securities law violation known as 'Greenwashing'. Greenwashing is defined as the practice of making false, misleading, unsubstantiated, or exaggerated claims regarding the environmental benefits, climate neutrality, sustainability practices, or ethical standards of a company's products, services, or overall business operations. In India's regulatory framework, greenwashing has transitioned from an ethical criticism into a high-risk statutory offense prosecuted vigorously by both the Securities and Exchange Board of India (SEBI) and the Ministry of Corporate Affairs (MCA).",
    "Under the SEBI (Prohibition of Fraudulent and Unfair Trade Practices relating to Securities Market) Regulations, 2003 (PFUTP Regulations), disseminating misleading information that induces investors to purchase, hold, or sell securities is classified as a fraudulent market practice. Regulation 4(2)(k) of PFUTP explicitly prohibits publishing any statement, promise, or forecast that is untrue or misleading. If a listed enterprise advertises in its annual report or investor presentations that it has achieved 'Net Zero Emissions' or '100% Water Positive Operations' when its underlying operations rely on undisclosed fossil-fuel generation or unverified carbon offsets, SEBI has the statutory power to initiate formal adjudication proceedings. Penalties under Section 15HA of the SEBI Act, 1992 can extend up to Rs 25 crore or three times the amount of profits made out of such fraudulent practices, accompanied by debarment of executive directors from accessing the securities market.",
    "Furthermore, Section 448 of the Companies Act, 2013 establishes severe criminal liability for misstatements in statutory reports. Section 448 provides: 'If in any return, report, certificate, financial statement, prospectus, statement or other document required by, or for, the purposes of any of the provisions of this Act or the rules made thereunder, any person makes a statement which is false in any material particulars, knowing it to be false, or which omits any material fact, knowing it to be material, he shall be liable under section 447.' Under Section 447, any person found guilty of corporate fraud faces mandatory non-bailable imprisonment for a term between six months and ten years, alongside a fine up to three times the amount involved in the fraud.",
    "To govern the independent evaluation of sustainability claims, SEBI introduced a comprehensive regulatory framework for ESG Rating Providers (ERPs) in 2023 by amending the SEBI (Credit Rating Agencies) Regulations, 1999. Under Chapter IV-A, no entity can act as an ESG rating provider in Indian securities markets without obtaining formal registration from SEBI. The regulations establish two tiers: Category I ERPs (full-scale rating providers requiring minimum net worth of Rs 10 crore) and Category II ERPs (specialized providers requiring Rs 5 crore). ERPs must formulate transparent rating methodologies, maintain strict conflict-of-interest walls between ESG ratings and ESG consulting services, and provide an explicit 'Core ESG Rating' based exclusively on verified BRSR Core data.",
    "From a risk mitigation standpoint, corporate legal teams must implement an internal 'ESG Substantiation and Verification Protocol'. Before any sustainability metric, carbon neutrality target, or green bond allocation is disclosed in regulatory filings or marketing brochures, the corporate legal department must review the primary documentary evidence. Every environmental claim must be backed by ISO 14064 greenhouse gas audits, Central Pollution Control Board (CPCB) consent orders, or verified third-party laboratory test reports. By establishing strict internal evidentiary gates, companies insulate themselves against devastating SEBI enforcement orders and catastrophic reputational damage."
]

p3_code = """# Part 3: Anti-Greenwashing & Regulatory Fraud Penalty Auditor
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class ESGClaimVerification:
    claim_id: str
    claim_text: str
    is_publicly_advertised: bool
    has_substantiated_evidence: bool
    uses_unverified_unregistered_offsets: bool
    estimated_greenwashing_premium_inr_cr: float

class GreenwashingProsecutionAuditor:
    @staticmethod
    def audit_claim_integrity(claims: List[ESGClaimVerification]) -> Tuple[bool, str, List[Dict]]:
        violations = []
        is_clean = True
        
        for c in claims:
            # Test 1: Unsubstantiated claims violate PFUTP Reg 4(2)(k)
            if not c.has_substantiated_evidence:
                violations.append({
                    "claim_id": c.claim_id,
                    "text": c.claim_text,
                    "statute": "SEBI PFUTP Regulation 4(2)(k) & Companies Act Section 448",
                    "severity": "CRIMINAL_FRAUD",
                    "penalty_exposure_inr_cr": max(25.0, c.estimated_greenwashing_premium_inr_cr * 3.0),
                    "reason": "Unsubstantiated environmental claim in statutory filing; false representation to investors."
                })
                is_clean = False
                
            # Test 2: Unverified offsets
            elif c.uses_unverified_unregistered_offsets:
                violations.append({
                    "claim_id": c.claim_id,
                    "text": c.claim_text,
                    "statute": "SEBI Master Circular on BRSR Core & ESG Rating Rules",
                    "severity": "REGULATORY_NON_COMPLIANCE",
                    "penalty_exposure_inr_cr": 5.0,
                    "reason": "Net-Zero claim relies on unverified offshore carbon credits lacking Article 6 Paris Agreement validation."
                })
                is_clean = False
                
        status = "COMPLIANT_ZERO_GREENWASHING" if is_clean else "GREENWASHING_FRAUD_DETECTED"
        return is_clean, status, violations

c1 = ESGClaimVerification("CLM-01", "100% Water Positive Operations in Rajasthan Facility", True, True, False, 0.0)
c2 = ESGClaimVerification("CLM-02", "Certified Carbon Neutral Product Line Across All Retail Stores", True, False, True, 12.0)

clean, verdict, audit_findings = GreenwashingProsecutionAuditor.audit_claim_integrity([c1, c2])
print(f"Overall Corporate ESG Integrity: {verdict}")
for f in audit_findings:
    print(f"Violation [{f['claim_id']}]: {f['statute']}")
    print(f" - Severity: {f['severity']} | Maximum Penalty: INR {f['penalty_exposure_inr_cr']:.1f} Crores")
    print(f" - Detail: {f['reason']}")
"""

p3_codeNotes = [
    "Evaluates corporate sustainability claims against SEBI PFUTP Regulations and Companies Act Section 447/448 fraud standards.",
    "Exposes greenwashing tactics: unverified net-zero assertions and unregistered offshore carbon offsets.",
    "Calculates statutory penalty exposure under SEBI Act Section 15HA (up to Rs 25 crore or 3x fraudulent gains).",
    "Generates itemized prosecution alerts, protecting listed issuers from criminal liability and securities debarment."
]

# --- PART 4 ---
p4_say = [
    "The implementation of ESG regulatory compliance fundamentally reshapes the fiduciary duties and corporate governance architecture of the Board of Directors. Under Section 166 of the Companies Act, 2013, Indian corporate law established a modern, enlightened shareholder value model that codified directors' duties toward broader society. Specifically, Section 166(2) provides: 'A director of a company shall act in good faith in order to promote the objects of the company for the benefit of its members as a whole, and in the best interests of the company, its employees, the shareholders, the community and for the protection of environment.' This statutory provision is historic: environmental protection is not a mere discretionary guideline; it is a personal, statutory duty imposed directly on every individual director.",
    "Directors who treat environmental regulations with indifference or who fail to exercise reasonable care and due diligence face personal liability under Section 166(7), which prescribes fines up to Rs 5 lakh alongside potential civil damages in tort for environmental destruction. Furthermore, under Regulation 17(9) of the SEBI LODR Regulations, the Board of Directors is legally responsible for framing, implementing, and monitoring the company's risk management plan. In contemporary enterprise governance, climate transition risks, carbon border taxes (such as the EU Carbon Border Adjustment Mechanism - CBAM), and water scarcity are recognized as existential strategic risks. A board that fails to evaluate the impact of CBAM on its export revenues breaches its oversight duties under Regulation 17(9).",
    "To institutionalize this oversight, elite listed enterprises establish specialized Board-level committees: the 'ESG and Sustainability Committee'. Typically chaired by an Independent Director and comprising the Managing Director and Chief Financial Officer, this committee is tasked with: (1) reviewing quarterly BRSR Core progress reports; (2) approving capital expenditure for renewable energy and effluent treatment plants; (3) vetting the independence and credentials of external assurance providers; and (4) aligning executive compensation with sustainability milestones. Under modern executive compensation structures, up to 20% to 30% of Executive Directors' annual variable pay and Long-Term Incentive Plans (LTIPs) are tethered directly to achieving verified ESG targets, such as reductions in Scope 1 GHG emissions and improvements in the LTIFR workplace safety index.",
    "In parallel, the Audit Committee exercises an indispensable statutory check under Section 177 of the Companies Act and Regulation 18 of SEBI LODR. The Audit Committee must review the internal financial and non-financial controls governing sustainability data collection. Because BRSR Core metrics must be assured by third-party auditors, the Audit Committee is responsible for recommending the appointment, remuneration, and terms of engagement of the ESG assurance provider, ensuring there are no conflicts of interest with the company's statutory financial auditors.",
    "The emerging frontier of corporate litigation involves shareholder climate activism and derivative lawsuits. Institutional investors holding minority stakes in listed carbon-heavy companies are increasingly utilizing general meetings to table shareholder resolutions demanding science-based climate targets (SBTi). If directors fail to act in accordance with Section 166(2), institutional shareholders have the legal standing to petition the National Company Law Tribunal (NCLT) under Section 241 of the Companies Act for 'oppression and mismanagement', arguing that environmental negligence is prejudicial to the public interest and the long-term solvency of the company."
]

p4_code = """# Part 4: Board ESG Governance & Director Section 166(2) Compliance Engine
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class BoardESGStructure:
    has_dedicated_esg_committee: bool
    esg_committee_chaired_by_independent_dir: bool
    quarterly_brsr_review_conducted: bool
    executive_comp_linked_to_esg_targets_pct: float
    cbam_climate_risk_assessed: bool
    internal_controls_audited_by_audit_comm: bool

class BoardGovernanceAuditor:
    @staticmethod
    def audit_board_fiduciary_esg_controls(gov: BoardESGStructure) -> Tuple[bool, float, List[str]]:
        findings = []
        score = 0.0
        
        # Test 1: Committee Governance
        if gov.has_dedicated_esg_committee and gov.esg_committee_chaired_by_independent_dir:
            score += 25.0
            findings.append("PASSED: Dedicated Board ESG Committee established with Independent Director leadership.")
        else:
            findings.append("DEFICIENT: Missing Board ESG Committee or lacks Independent Director chair.")
            
        # Test 2: Regular Oversight & Section 166(2) Compliance
        if gov.quarterly_brsr_review_conducted:
            score += 20.0
            findings.append("PASSED: Quarterly BRSR Core data review conducted at Board level.")
        else:
            findings.append("DEFICIENT: No quarterly Board-level oversight; risk of personal liability under S.166(2).")
            
        # Test 3: Executive Remuneration Alignment
        if gov.executive_comp_linked_to_esg_targets_pct >= 15.0:
            score += 20.0
            findings.append(f"PASSED: Executive compensation tied to ESG ({gov.executive_comp_linked_to_esg_targets_pct}% variable weight).")
        else:
            findings.append("DEFICIENT: Inadequate executive incentive alignment (<15% ESG linkage).")
            
        # Test 4: Strategic Climate Risk Management (CBAM)
        if gov.cbam_climate_risk_assessed:
            score += 15.0
            findings.append("PASSED: Climate transition and EU CBAM export risks assessed under SEBI LODR Reg 17(9).")
        else:
            findings.append("DEFICIENT: Failure to model CBAM financial impact on international revenues.")
            
        # Test 5: Audit Committee Assurance Control
        if gov.internal_controls_audited_by_audit_comm:
            score += 20.0
            findings.append("PASSED: Audit Committee reviewed internal controls for non-financial ESG data collection.")
        else:
            findings.append("DEFICIENT: Audit Committee omitted review of ESG internal data controls.")
            
        is_compliant = score >= 80.0
        return is_compliant, score, findings

gov_strong = BoardESGStructure(
    has_dedicated_esg_committee=True,
    esg_committee_chaired_by_independent_dir=True,
    quarterly_brsr_review_conducted=True,
    executive_comp_linked_to_esg_targets_pct=25.0,
    cbam_climate_risk_assessed=True,
    internal_controls_audited_by_audit_comm=True
)

is_comp, gov_score, notes = BoardGovernanceAuditor.audit_board_fiduciary_esg_controls(gov_strong)
print(f"Board Governance Compliance: {is_comp} | Overall Score: {gov_score:.1f} / 100.0")
for n in notes:
    print(f" [*] {n}")
"""

p4_codeNotes = [
    "Evaluates Board of Directors oversight against Companies Act Section 166(2) statutory environmental duties.",
    "Audits the constitution and independence of specialized Board ESG and Sustainability Committees.",
    "Assesses executive compensation linkage: verifies whether 20-25% of variable pay is tethered to verified ESG goals.",
    "Examines climate risk modeling under SEBI LODR Regulation 17(9) for cross-border carbon border adjustment mechanisms."
]

# --- PART 5 ---
p5_say = [
    "To achieve mastery over corporate environmental and regulatory compliance, legal counsels, company secretaries, and financial directors must assemble NGRBC principles, BRSR Core quantitative calculations, anti-greenwashing verification, and Board governance controls into a unified production architecture. In large listed enterprise groups, sustainability compliance is no longer a peripheral public relations task; it is a high-stakes corporate legal function that directly dictates market access, capital cost, and regulatory standing.",
    "The industrial-grade Python engine developed in this masterclass models the complete ESG regulatory architecture for 'Bharat Industrial Infrastructure Ltd', a top-100 listed Indian conglomerate with operations across manufacturing, thermal energy, logistics, and supply chain hubs. The company reports annual gross turnover of Rs 18,500 crore and employs over 14,000 personnel. The simulator executes an exhaustive forensic audit across all nine NGRBC principles, tracking Scope 1 and Scope 2 carbon emissions, water recycling intensities, LTIFR workplace incident rates, gender wage equity ratios, and supplier value-chain compliance.",
    "The engine sequentially executes five advanced compliance modules: First, it computes gross and normalized GHG intensity, evaluating Scope 1 and Scope 2 emissions against statutory industrial benchmarks. Second, it calculates the water recycling ratio and workplace safety LTIFR index, confirming compliance with zero-fatality standards. Third, it audits corporate sustainability advertising claims under SEBI PFUTP Regulation 4(2)(k) and Companies Act Section 448, screening for unverified carbon offsets and eliminating greenwashing penalty exposure.",
    "Fourth, it evaluates the Board of Directors' governance structure, auditing the ESG Committee's independent leadership, executive compensation alignment, and Audit Committee assurance controls under Section 166(2) and Section 177. Fifth, it verifies the independent third-party reasonable assurance report mandated under the SEBI Master Circular. Upon running all five validation suites and verifying zero statutory discrepancies, the engine outputs the definitive masterclass certification code: SEBI_BRSR_CORE_COMPLIANCE_PASS."
]

p5_code = """# Part 5: Production SEBI BRSR Core Compliance & ESG Assurance Master Engine
import hashlib
from typing import Dict, List, Tuple

class SEBIBRSRMasterEngine:
    def __init__(self, company_name: str, market_cap_rank: int, turnover_inr_cr: float):
        self.company_name = company_name
        self.market_cap_rank = market_cap_rank
        self.turnover_inr_cr = turnover_inr_cr
        self.kpi_data: Dict[str, float] = {}
        self.verified_claims: List[str] = []
        self.audit_log: List[str] = []

    def set_environmental_kpis(self, scope_1_mt: float, scope_2_mt: float, 
                              water_consumed_kl: float, water_recycled_kl: float, 
                              renewable_energy_share_pct: float):
        total_ghg = scope_1_mt + scope_2_mt
        ghg_intensity = total_ghg / self.turnover_inr_cr
        water_recycle_rate = (water_recycled_kl / water_consumed_kl) * 100.0 if water_consumed_kl > 0 else 0.0
        
        self.kpi_data["total_ghg_mt"] = total_ghg
        self.kpi_data["ghg_intensity_per_cr"] = ghg_intensity
        self.kpi_data["water_recycle_rate_pct"] = water_recycle_rate
        self.kpi_data["renewable_energy_pct"] = renewable_energy_share_pct
        self.audit_log.append(f"Environmental KPIs: GHG Intensity={ghg_intensity:.2f} MT/Cr | Water Recycled={water_recycle_rate:.1f}% | Renewable={renewable_energy_share_pct:.1f}%")

    def set_social_and_governance_kpis(self, ltifr: float, gender_pay_equity: float, 
                                       independent_esg_committee: bool, 
                                       audit_comm_assurance_signed: bool):
        self.kpi_data["ltifr"] = ltifr
        self.kpi_data["gender_pay_equity"] = gender_pay_equity
        self.kpi_data["independent_esg_comm"] = 1.0 if independent_esg_committee else 0.0
        self.kpi_data["audit_comm_signed"] = 1.0 if audit_comm_assurance_signed else 0.0
        self.audit_log.append(f"Social/Gov KPIs: LTIFR={ltifr:.2f} | Gender Pay Equity={gender_pay_equity:.2f} | Assurance Signed={audit_comm_assurance_signed}")

    def verify_greenwashing_hygiene(self, claims: List[Tuple[str, bool]]):
        for text, has_proof in claims:
            assert has_proof, f"Greenwashing violation detected on claim: {text}"
            self.verified_claims.append(text)
        self.audit_log.append(f"Anti-Greenwashing Audit Passed: {len(self.verified_claims)} claims verified against ISO/CPCB evidence.")

    def run_statutory_masterclass_audit(self) -> bool:
        print("================================================================================")
        print("     SEBI BRSR CORE & CORPORATE ESG REGULATORY ASSURANCE ENGINE                 ")
        print("================================================================================")
        print(f"Listed Enterprise: {self.company_name} | BSE/NSE Market Cap Rank: #{self.market_cap_rank}")
        print(f"Gross Turnover: INR {self.turnover_inr_cr:,.2f} Crores | Mandatory Scope: SEBI LODR Reg 34(2)(f)")
        print("--------------------------------------------------------------------------------")
        for log in self.audit_log:
            print(f"[*] {log}")
            
        print("--------------------------------------------------------------------------------")
        print("BRSR CORE KEY PERFORMANCE INDICATOR (KPI) SUMMARY:")
        print(f" - Gross GHG Footprint (Scope 1 + 2): {self.kpi_data['total_ghg_mt']:,.2f} MT CO2e")
        print(f" - Normalized GHG Intensity: {self.kpi_data['ghg_intensity_per_cr']:.2f} MT / INR Crore")
        print(f" - Water Circularity Recycle Ratio: {self.kpi_data['water_recycle_rate_pct']:.1f}%")
        print(f" - Industrial Safety LTIFR: {self.kpi_data['ltifr']:.2f} per million man-hours")
        print(f" - Gender Compensation Equity: {self.kpi_data['gender_pay_equity']:.2f}")
        print("================================================================================")
        
        # Invariant validations
        assert self.market_cap_rank <= 1000, "Must fall within mandatory Top 1,000 threshold"
        assert self.kpi_data["water_recycle_rate_pct"] >= 25.0, "Must satisfy water circularity threshold"
        assert self.kpi_data["ltifr"] <= 1.0, "LTIFR must conform to industrial safety standards"
        assert self.kpi_data["audit_comm_signed"] == 1.0, "Audit Committee must sign off on independent assurance"
        assert len(self.verified_claims) >= 2, "Must verify all published environmental claims"
        
        print("[PASS] SEBI_BRSR_CORE_COMPLIANCE_PASS")
        return True

engine = SEBIBRSRMasterEngine("Bharat Industrial Infrastructure Ltd", market_cap_rank=74, turnover_inr_cr=18500.0)
engine.set_environmental_kpis(scope_1_mt=280000.0, scope_2_mt=95000.0, water_consumed_kl=1200000.0, water_recycled_kl=420000.0, renewable_energy_share_pct=34.5)
engine.set_social_and_governance_kpis(ltifr=0.42, gender_pay_equity=0.92, independent_esg_committee=True, audit_comm_assurance_signed=True)
engine.verify_greenwashing_hygiene([
    ("Zero Untreated Effluent Discharge across all 12 Plants", True),
    ("34.5% Renewable Energy Mix verified by State Electricity Boards", True)
])

engine.run_statutory_masterclass_audit()
"""

p5_codeNotes = [
    "Industrial-grade SEBI BRSR Core masterclass simulator modeling enterprise ESG governance.",
    "Calculates Scope 1/2 GHG intensity, water circularity ratios, and LTIFR safety indicators.",
    "Enforces strict anti-greenwashing controls under SEBI PFUTP and Companies Act Section 448.",
    "Audits Board ESG committee independence and Audit Committee reasonable assurance sign-offs.",
    "Validates all statutory compliance invariants and confirms: `SEBI_BRSR_CORE_COMPLIANCE_PASS`."
]

parts_spec = [
    ("Part 1: ESG Jurisprudence & SEBI LODR Regulation 34(2)(f) Mandate", p1_say, p1_code, p1_codeNotes,
     "Assess listed company market capitalization thresholds and evaluate mandatory BRSR applicability under SEBI LODR Regulation 34(2)(f).",
     "Under Regulation 34(2)(f) of the SEBI LODR Regulations, which entities are legally mandated to submit a Business Responsibility and Sustainability Report (BRSR)?",
     ["The top 1,000 listed entities on Indian stock exchanges by market capitalization",
      "Only public sector banking institutions holding sovereign government guarantees",
      "All private limited companies incorporated within the last twelve months",
      "Foreign non-governmental organizations operating charitable trusts in India"],
     "Regulation 34(2)(f) makes BRSR mandatory for the top 1,000 listed entities by market capitalization."),

    ("Part 2: The BRSR Core 9-KPI Reasonable Assurance Framework", p2_say, p2_code, p2_codeNotes,
     "Compute BRSR Core Key Performance Indicators across GHG emissions, water circularity, LTIFR, and gender pay equity.",
     "What distinguishes 'BRSR Core' from the broader BRSR disclosure framework under the SEBI Master Circular of July 2023?",
     ["BRSR Core comprises a critical subset of 9 quantifiable KPIs that require mandatory reasonable assurance from an independent third-party assurance provider",
      "BRSR Core applies exclusively to software startups without physical office locations",
      "BRSR Core eliminates all environmental reporting requirements in favor of executive tax returns",
      "BRSR Core allows corporations to self-certify sustainability without presenting documentary evidence"],
     "BRSR Core specifies 9 key ESG performance indicators that require mandatory third-party reasonable assurance."),

    ("Part 3: Greenwashing Liability & Anti-Fraud Securities Regulations", p3_say, p3_code, p3_codeNotes,
     "Audit corporate sustainability claims under SEBI PFUTP Regulations and Companies Act Section 448 fraud standards.",
     "What statutory liability arises if a listed enterprise publishes false or misleading 'Net Zero' claims in its annual report?",
     ["Prosecution under SEBI PFUTP Regulation 4(2)(k) and criminal fraud liability under Companies Act Sections 447 and 448 with potential imprisonment up to 10 years",
      "A modest administrative warning with zero financial penalties or public disclosure",
      "Immediate exemption from corporate income tax for the subsequent financial year",
      "Automatic transfer of corporate equity shares to the United Nations Development Programme"],
     "Disseminating false sustainability statements is classified as securities fraud under PFUTP and corporate fraud under Companies Act Sections 447/448."),

    ("Part 4: Board Fiduciary Duties & Director Environmental Responsibility under Section 166(2)", p4_say, p4_code, p4_codeNotes,
     "Examine personal director liabilities under Section 166(2) and structure Board-level ESG committees and executive compensation linkage.",
     "How does Section 166(2) of the Companies Act, 2013 formally define a director's statutory environmental responsibility?",
     ["A director is legally mandated to act in good faith to promote company objects, protect employees and community, and act 'for the protection of environment'",
      "A director is legally forbidden from considering environmental issues during boardroom meetings",
      "A director must allocate 100% of annual company revenues to international carbon credit brokers",
      "A director is personally exempt from all environmental liabilities if corporate shares are held in demat form"],
     "Section 166(2) codifies the explicit statutory duty of directors to act for the protection of the environment."),

    ("Part 5: Production SEBI BRSR Core Compliance & ESG Assurance Engine", p5_say, p5_code, p5_codeNotes,
     "Run the integrated BRSR Core KPI calculator, anti-greenwashing auditor, and Board governance verification engine.",
     "What key milestone certification is awarded upon executing the Day 51 production ESG engine?",
     ["SEBI_BRSR_CORE_COMPLIANCE_PASS verifying GHG intensity, water circularity, anti-greenwashing hygiene, and Board ESG governance",
      "VOLUNTARY_CARBON_ARBITRAGE_PASS allowing trading of uncertified carbon offsets without regulatory oversight",
      "AUTOMATIC_POLLUTION_EXEMPTION_PASS shielding industrial factories from state pollution board inspections",
      "UNCONDITIONAL_MARKET_CAPITALIZATION_PASS exempting listed issuers from SEBI LODR disclosures"],
     "The engine validates BRSR Core KPIs, anti-greenwashing hygiene, and Board governance, issuing SEBI_BRSR_CORE_COMPLIANCE_PASS.")
]

for idx, (title, say, code, notes, try_it, q, opts, expl) in enumerate(parts_spec, 1):
    print(f"Executing Day 51 Part {idx} code...")
    stdout = run_code(code)
    wc = count_words(say)
    print(f"Part {idx}: {wc} words in say. Code execution successful.")
    
    part_dict = {
        "title": title,
        "say": say,
        "example": f"Real-world ESG compliance scenario for {title}.",
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
    day51["parts"].append(part_dict)

total_day_words = sum(count_words(p["say"]) for p in day51["parts"])
print(f"=== DAY 51 TOTAL WORDS: {total_day_words} ===")

with open("scripts/bcom_law_day51.json", "w", encoding="utf-8") as f:
    json.dump(day51, f, indent=2)

print("Saved scripts/bcom_law_day51.json successfully!")
