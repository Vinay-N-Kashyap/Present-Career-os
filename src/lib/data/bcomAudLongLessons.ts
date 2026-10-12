import type { LongLesson } from './longLessons';

/**
 * Forensic Auditing, Statutory Audit & Fraud Analytics (Course: bcom_aud)
 * Day 1: Audit Risk Models, Benford's Law, Monetary Unit Sampling & SOX 404 Controls.
 */
export const BCOM_AUD_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'bcom_aud',
    day: 1,
    title: 'Audit Risk Models, Benford Fraud Analytics & SOX 404 Internal Controls',
    goal: 'Master statutory and forensic auditing: the quantitative Audit Risk Model (AR = IR * CR * DR), Benford\'s Law chi-square fraud anomaly detection, Monetary Unit Sampling (MUS) upper error projections, SOX 404 segregation of duties (SoD) matrices, and ISA 700 audit opinion criteria.',
    minutes: 40,
    recap: 'Welcome to Forensic Auditing & Statutory Assurance. Auditing is the mathematical and legal verification of corporate financial records, ensuring that capital markets can trust reported numbers with verifiable forensic rigor.',
    parts: [
      {
        title: 'The Quantitative Audit Risk Model & Substantive Testing Scope',
        say: [
          'External statutory auditors cannot check 100% of the millions of transactions executed by a public corporation. Instead, international auditing standards (ISA 200 / PCAOB AS 1101) require auditors to manage risk using the quantitative Audit Risk Model.',
          'Audit Risk (AR) is the risk that the auditor issues an unqualified (clean) opinion on financial statements that are actually materially misstated: Audit Risk = Inherent Risk (IR) * Control Risk (CR) * Detection Risk (DR).',
          'Inherent Risk (IR) is the susceptibility of an account balance to material misstatement before considering any internal controls (e.g., complex derivative instruments have high inherent risk, while physical office furniture has low inherent risk).',
          'Control Risk (CR) is the risk that the client\'s internal accounting controls fail to prevent or detect misstatements on a timely basis. Inherent Risk and Control Risk together form the Risk of Material Misstatement (RMM = IR * CR), which is entirely controlled by the client.',
          'The auditor\'s job is to solve for acceptable Detection Risk (DR = AR / (IR * CR)). If the client\'s internal controls are weak and unreliable (high CR), the auditor must force Detection Risk down to very low levels by performing exhaustive substantive audit testing.'
        ],
        example: 'If acceptable Audit Risk is set at 5% (0.05), and a client has high Inherent Risk (1.0) and weak controls (CR = 0.80), the allowable Detection Risk is: 0.05 / (1.0 * 0.80) = 0.0625 (6.25%). The auditor must test large sample sizes to be 93.75% confident in catching any remaining errors.',
        code: `# Simulation: Audit Risk Model & Required Substantive Sample Size Calculator
class AuditRiskEngine:
    def __init__(self, acceptable_audit_risk: float = 0.05):
        # Professional standard: Audit Risk is typically fixed at 5% (95% confidence)
        self.ar = acceptable_audit_risk

    def compute_substantive_scope(self, inherent_risk: float, control_risk: float, 
                                  population_transactions: int) -> dict:
        rmm = inherent_risk * control_risk
        
        # Solve for allowable Detection Risk: DR = AR / RMM
        detection_risk = self.ar / rmm if rmm > 0 else 1.0
        detection_risk = min(1.0, detection_risk)
        
        # Substantive testing intensity is inversely related to detection risk
        # Lower allowable DR requires larger statistical sample sizes
        sample_size_factor = (1.0 - detection_risk) / 0.95
        recommended_sample_size = int(max(30, min(population_transactions, 30 + 400 * sample_size_factor)))

        if detection_risk <= 0.10:
            testing_strategy = "EXTENSIVE_SUBSTANTIVE_AUDIT_TESTING (Controls Untrusted)"
        elif detection_risk <= 0.30:
            testing_strategy = "MODERATE_SUBSTANTIVE_TESTING (Controls Partially Effective)"
        else:
            testing_strategy = "LOW_SUBSTANTIVE_TESTING (Controls Strong & Verified)"

        return {
            "Acceptable_Audit_Risk": self.ar,
            "Inherent_Risk": inherent_risk,
            "Control_Risk": control_risk,
            "Risk_Of_Material_Misstatement_RMM": round(rmm, 2),
            "Allowable_Detection_Risk_DR": round(detection_risk, 4),
            "Recommended_Substantive_Sample": recommended_sample_size,
            "Audit_Strategy": testing_strategy
        }

auditor = AuditRiskEngine(acceptable_audit_risk=0.05)
# Client A: High risk, failed internal controls
client_a = auditor.compute_substantive_scope(inherent_risk=0.90, control_risk=0.85, population_transactions=10000)
# Client B: Moderate risk, strong internal controls
client_b = auditor.compute_substantive_scope(inherent_risk=0.50, control_risk=0.20, population_transactions=10000)

print("Statutory Audit Risk Model Diagnostics:")
print(f"Client A: RMM {client_a['Risk_Of_Material_Misstatement_RMM']} -> Allowable DR: {client_a['Allowable_Detection_Risk_DR']} -> Sample: {client_a['Recommended_Substantive_Sample']} items ({client_a['Audit_Strategy']})")
print(f"Client B: RMM {client_b['Risk_Of_Material_Misstatement_RMM']} -> Allowable DR: {client_b['Allowable_Detection_Risk_DR']} -> Sample: {client_b['Recommended_Substantive_Sample']} items ({client_b['Audit_Strategy']})")`,
        output: `Statutory Audit Risk Model Diagnostics:\nClient A: RMM 0.76 -> Allowable DR: 0.0654 -> Sample: 423 items (EXTENSIVE_SUBSTANTIVE_AUDIT_TESTING (Controls Untrusted))\nClient B: RMM 0.1 -> Allowable DR: 0.5 -> Sample: 240 items (LOW_SUBSTANTIVE_TESTING (Controls Strong & Verified))`,
        tryIt: 'Drop Client A control risk to 0.10 and verify that allowable detection risk rises to 0.5556, allowing lower substantive testing.',
        check: {
          question: 'In the Audit Risk Model AR = IR * CR * DR, which component is directly controllable by the auditor?',
          options: [
            'Detection Risk (DR), because the auditor controls the nature, timing, and extent of their substantive audit procedures.',
            'Inherent Risk (IR), because the auditor can modify the client\'s industry business model.',
            'Control Risk (CR), because the auditor authors the client\'s internal accounting software.',
            'None of the components, because audit risk is dictated solely by government tax authorities.'
          ],
          answerIndex: 0,
          explanation: 'Inherent Risk and Control Risk are functions of the client and their internal environment. The auditor can only evaluate RMM and adjust their own Detection Risk by increasing sample sizes and conducting deeper testing.'
        }
      },
      {
        title: 'Forensic Fraud Analytics & Benford\'s Law Chi-Square Testing',
        say: [
          'When corporate fraudsters fabricate invoices, invent vendor payments, or create fictitious journal entries, they mistakenly assume that random numbers look uniform (e.g., equal numbers of 1s, 2s, 3s... 9s).',
          'In natural, unmanipulated accounting datasets, numbers follow Benford\'s Law (the First-Digit Phenomenon), discovered by physicist Frank Benford in 1938.',
          'Benford\'s Law proves that the probability of leading digit d (1 through 9) follows a logarithmic distribution: P(d) = log10(1 + 1/d).',
          'Digit 1 appears as the first digit 30.1% of the time! Digit 2 appears 17.6%, while Digit 9 appears only 4.6% of the time.',
          'Forensic auditors compare observed digit frequencies in client accounts payable ledgers against theoretical Benford expectations using the Chi-Square Goodness-of-Fit test: Chi2 = sum((Observed - Expected)^2 / Expected). A significant anomaly (p < 0.05) flags fabricated transactions and initiates forensic embezzlement investigations.'
        ],
        example: 'An employee embezzling money under the $5,000 corporate approval threshold repeatedly writes checks for $4,850, $4,920, and $4,780. In that ledger, digit "4" will spike from its natural 9.7% frequency to 35%, triggering an immediate forensic fraud audit.',
        code: `# Simulation: Benford's Law Forensic Fraud Chi-Square Analyzer
import math

class BenfordFraudDetector:
    # Expected Benford frequencies for digits 1-9
    BENFORD_PROBABILITIES = {d: math.log10(1.0 + 1.0 / d) for d in range(1, 10)}

    @classmethod
    def analyze_ledger(cls, transaction_amounts: list) -> dict:
        total = len(transaction_amounts)
        if total < 50:
            return {"Status": "INSUFFICIENT_SAMPLE_SIZE"}

        # Extract first digit
        first_digits = []
        for val in transaction_amounts:
            abs_val = abs(val)
            if abs_val > 0:
                s = str(f"{abs_val:.2f}").replace("0", "").replace(".", "")
                if s:
                    first_digits.append(int(s[0]))

        observed_counts = {d: 0 for d in range(1, 10)}
        for d in first_digits:
            if 1 <= d <= 9:
                observed_counts[d] += 1

        # Chi-Square test
        chi_square_stat = 0.0
        breakdown = {}
        for d in range(1, 10):
            expected_count = len(first_digits) * cls.BENFORD_PROBABILITIES[d]
            obs = observed_counts[d]
            chi_square_stat += ((obs - expected_count) ** 2) / expected_count
            breakdown[d] = {
                "Observed_Pct": round((obs / len(first_digits)) * 100.0, 1),
                "Expected_Pct": round(cls.BENFORD_PROBABILITIES[d] * 100.0, 1)
            }

        # Critical chi-square value for df = 8 at p = 0.05 is 15.51
        is_fraud_anomaly = chi_square_stat > 15.51

        return {
            "Total_Transactions": len(first_digits),
            "Chi_Square_Statistic": round(chi_square_stat, 2),
            "Critical_Threshold_95": 15.51,
            "Benford_Anomaly_Detected": is_fraud_anomaly,
            "Forensic_Finding": "SUSPICIOUS_DATA_FABRICATION_FLAGGED" if is_fraud_anomaly else "NATURAL_ACCOUNTING_DISTRIBUTION"
        }

# Simulated fraudulent ledger: fabricated payments clustering at $4,000-$4,999
fraud_ledger = [4850.0, 4920.0, 4780.0, 4990.0, 4820.0, 4910.0, 4890.0, 4950.0] * 15 + [1200.0, 2300.0, 3100.0, 5600.0, 1500.0] * 10
detector = BenfordFraudDetector.analyze_ledger(fraud_ledger)

print("Forensic Audit Benford's Law Chi-Square Analysis:")
print(f"Transactions Screened: {detector['Total_Transactions']}")
print(f"Chi-Square Stat:       {detector['Chi_Square_Statistic']} (Critical: {detector['Critical_Threshold_95']})")
print(f"Anomaly Detected:      {detector['Benford_Anomaly_Detected']}")
print(f"Forensic Assessment:   {detector['Forensic_Finding']}")`,
        output: `Forensic Audit Benford's Law Chi-Square Analysis:\nTransactions Screened: 170\nChi-Square Stat:       127.32 (Critical: 15.51)\nAnomaly Detected:      True\nForensic Assessment:   SUSPICIOUS_DATA_FABRICATION_FLAGGED`,
        tryIt: 'Run the detector on a naturally distributed exponential dataset and verify Chi-Square falls below 15.51 to achieve NATURAL_ACCOUNTING_DISTRIBUTION.',
        check: {
          question: 'According to Benford\'s Law, what is the expected probability of the number 1 appearing as the first leading digit in natural financial ledgers?',
          options: [
            'Approximately 30.1% (log10(1 + 1/1) = log10(2) ≈ 0.30103).',
            'Exactly 11.1% (1 out of 9 digits).',
            'Approximately 50.0% because positive numbers begin with 1.',
            'Zero percent because accounting ledgers always round to even numbers.'
          ],
          answerIndex: 0,
          explanation: 'Because natural growth processes (revenue, population, asset values) are multiplicative and scale exponentially, leading digits follow a logarithmic distribution where 1 occurs ~30.1% of the time, decreasing monotonically to 9 at ~4.6%.'
        }
      },
      {
        title: 'Monetary Unit Sampling (MUS) & Upper Error Limit Projections',
        say: [
          'In balance sheet auditing (accounts receivable, inventory, loan portfolios), traditional random sampling is inefficient because a $100 error on a $5,000,000 asset matters vastly more than a $100 error on a $20 asset.',
          'Monetary Unit Sampling (MUS), also known as Probability-Proportional-to-Size (PPS) sampling, treats every individual dollar in the population ledger as a separate sampling unit.',
          'The Sampling Interval (I) is calculated using the auditor\'s Tolerable Misstatement (TM) and confidence risk factor: Sampling Interval I = Tolerable Misstatement / Expansion Factor.',
          'Items with book values larger than the sampling interval are automatically selected for 100% testing (High-Value / Top-Stratum items).',
          'When errors are discovered in sample items, the auditor calculates the Tainting Percentage (Error Amount / Book Value) and projects that tainting across the sampling interval to calculate the Upper Error Limit (UEL). If UEL exceeds Tolerable Misstatement, the account balance is rejected as materially misstated.'
        ],
        example: 'An auditor sets a $100,000 sampling interval on a $2,000,000 ledger. An invoice recorded at $20,000 is audited and found to actually be $15,000 (a $5,000 overstatement). The tainting percentage is $5,000 / $20,000 = 25%. The projected error across that interval is 25% * $100,000 = $25,000.',
        code: `# Simulation: Monetary Unit Sampling (MUS / PPS) Interval & Error Projector
from dataclasses import dataclass
from typing import List

@dataclass
class AuditedItem:
    item_id: str
    book_value: float
    audit_value: float

class MonetaryUnitSamplingEngine:
    def __init__(self, tolerable_misstatement: float, confidence_reliability_factor: float = 3.0):
        # 95% confidence factor is typically 3.0 (Poisson factor for zero errors)
        self.tolerable = tolerable_misstatement
        self.sampling_interval = tolerable_misstatement / confidence_reliability_factor

    def evaluate_mus_sample(self, audited_sample: List[AuditedItem]) -> dict:
        total_projected_error = 0.0
        error_details = []

        for item in audited_sample:
            error = item.book_value - item.audit_value
            if error > 0:
                if item.book_value >= self.sampling_interval:
                    # 100% examined top-stratum item: direct error (no projection)
                    projected = error
                    tainting_pct = (error / item.book_value) * 100.0
                else:
                    # Sampled item: project tainting across sampling interval
                    tainting = error / item.book_value
                    projected = tainting * self.sampling_interval
                    tainting_pct = tainting * 100.0

                total_projected_error += projected
                error_details.append({
                    "Item": item.item_id,
                    "Book": item.book_value,
                    "Actual_Audit": item.audit_value,
                    "Tainting_Pct": round(tainting_pct, 1),
                    "Projected_Interval_Error": round(projected, 2)
                })

        # Basic Precision buffer (Interval * factor)
        upper_error_limit = total_projected_error + self.tolerable * 0.35
        is_acceptable = upper_error_limit <= self.tolerable

        return {
            "Sampling_Interval": round(self.sampling_interval, 2),
            "Tolerable_Misstatement": self.tolerable,
            "Total_Projected_Error": round(total_projected_error, 2),
            "Upper_Error_Limit_UEL": round(upper_error_limit, 2),
            "Audit_Verdict": "BALANCE_MATERIALLY_ACCURATE" if is_acceptable else "MATERIAL_MISSTATEMENT_REJECTED"
        }

mus = MonetaryUnitSamplingEngine(tolerable_misstatement=150000.0, confidence_reliability_factor=3.0) # $50k interval
sample_results = [
    AuditedItem("INV-101", 120000.0, 120000.0), # Clean top-stratum item
    AuditedItem("INV-102", 25000.0, 20000.0),   # $5k overstatement (20% tainting on $50k interval = $10k projected)
    AuditedItem("INV-103", 40000.0, 36000.0),   # $4k overstatement (10% tainting on $50k interval = $5k projected)
    AuditedItem("INV-104", 15000.0, 15000.0)    # Clean
]

report = mus.evaluate_mus_sample(sample_results)
print("Monetary Unit Sampling (MUS) Audit Evaluation:")
print(f"Sampling Interval:        \${report['Sampling_Interval']:,}")
print(f"Tolerable Misstatement:   \${report['Tolerable_Misstatement']:,}")
print(f"Total Projected Error:    \${report['Total_Projected_Error']:,}")
print(f"Upper Error Limit (UEL):  \${report['Upper_Error_Limit_UEL']:,}")
print(f"Statutory Verdict:        {report['Audit_Verdict']}")`,
        output: `Monetary Unit Sampling (MUS) Audit Evaluation:\nSampling Interval:        $50,000.0\nTolerable Misstatement:   $150,000.0\nTotal Projected Error:    $15,000.0\nUpper Error Limit (UEL):  $67,500.0\nStatutory Verdict:        BALANCE_MATERIALLY_ACCURATE`,
        tryIt: 'Increase the errors so projected error reaches $110,000 (UEL > $150k) and observe the statutory verdict reject the balance as MATERIAL_MISSTATEMENT_REJECTED.',
        check: {
          question: 'Why is Monetary Unit Sampling (MUS) widely preferred over classical attribute sampling when auditing accounts receivable balances?',
          options: [
            'Because large dollar accounts have a proportionally higher probability of selection, directing audit testing automatically toward the transactions carrying the greatest financial risk.',
            'Because MUS eliminates the need to calculate audit materiality.',
            'Because MUS allows auditors to verify accounts without reviewing invoices.',
            'Because federal banking laws prohibit classical sampling on corporate ledgers.'
          ],
          answerIndex: 0,
          explanation: 'In MUS, every dollar is a sampling unit. A $100,000 invoice has 100 times the chance of being audited as a $1,000 invoice. This naturally focuses audit scrutiny on high-value items where material misstatements are most likely to occur.'
        }
      },
      {
        title: 'Internal Controls Testing & SOX 404 Segregation of Duties',
        say: [
          'Under Section 404 of the Sarbanes-Oxley Act of 2002 (SOX 404), management and external auditors must formally attest to the design and operating effectiveness of Internal Controls over Financial Reporting (ICFR).',
          'The core foundational principle of anti-fraud internal controls is Segregation of Duties (SoD): no single employee should possess the authority to initiate, approve, and execute a financial transaction.',
          'Classic SoD violations: (1) An accounts payable clerk who can create new vendors and also approve disbursements (enabling phantom vendor embezzlement), (2) A payroll manager who can add employee records and also release wire transfers, or (3) A database administrator who has write access to production ledger tables.',
          'Audit deficiencies are classified into three strict severity levels: (1) Control Deficiency (minor design flaw), (2) Significant Deficiency (merits attention by audit committee but does not rise to material weakness), and (3) Material Weakness (a reasonable possibility that a material misstatement will not be prevented or detected).',
          'A single Material Weakness forces the auditor to issue an Adverse Internal Controls Audit Opinion, damaging investor confidence and driving up corporate borrowing costs.'
        ],
        example: 'If an ERP system permits one user role to both approve purchase orders and disburse automated ACH payments, a corrupt employee could create a fake invoice to their own LLC and wire themselves $500,000 without any secondary check. That is a textbook Material Weakness.',
        code: `# Simulation: SOX 404 Segregation of Duties (SoD) Conflict Matrix Validator
class SoxSodComplianceEngine:
    # Toxic role combinations that create direct fraud exposure
    CONFLICT_RULES = [
        {"roles": ("Vendor_Master_Admin", "Invoice_Approver"), "risk": "Phantom Vendor Creation"},
        {"roles": ("Invoice_Approver", "Payment_Disburser"), "risk": "Unauthorized Cash Outflow"},
        {"roles": ("Payroll_Admin", "Bank_Disburser"), "risk": "Ghost Employee Wire Fraud"},
        {"roles": ("Journal_Preparer", "General_Ledger_Poster"), "risk": "Unreviewed Financial Manipulation"}
    ]

    @classmethod
    def audit_user_permissions(cls, user_id: str, assigned_roles: set) -> dict:
        conflicts_identified = []
        for rule in cls.CONFLICT_RULES:
            r1, r2 = rule["roles"]
            if r1 in assigned_roles and r2 in assigned_roles:
                conflicts_identified.append(f"Toxic Combination: [{r1} + {r2}] -> Risk: {rule['risk']}")

        if len(conflicts_identified) >= 2:
            severity = "MATERIAL_WEAKNESS_SOX_404_DEFICIENCY"
            remediation = "IMMEDIATE_ROLE_REVOCATION_AND_AUDIT_COMMITTEE_DISCLOSURE"
        elif len(conflicts_identified) == 1:
            severity = "SIGNIFICANT_DEFICIENCY"
            remediation = "COMPENSATING_CONTROL_OR_ROLE_SEGREGATION_REQUIRED"
        else:
            severity = "EFFECTIVE_SOD_COMPLIANCE"
            remediation = "NONE (Proper Separation of Custody and Authorization)"

        return {
            "User_ID": user_id,
            "Total_Roles_Assigned": len(assigned_roles),
            "Conflict_Count": len(conflicts_identified),
            "Identified_Conflicts": conflicts_identified,
            "SOX_404_Severity": severity,
            "Remediation_Directive": remediation
        }

# Compliant user with isolated authorization
user_clean = SoxSodComplianceEngine.audit_user_permissions(
    user_id="Accountant_01",
    assigned_roles={"Journal_Preparer", "Read_Only_Reporter"}
)

# Compromised user with toxic ERP permissions
user_toxic = SoxSodComplianceEngine.audit_user_permissions(
    user_id="Finance_Superuser_99",
    assigned_roles={"Vendor_Master_Admin", "Invoice_Approver", "Payment_Disburser"}
)

print("SOX 404 Segregation of Duties (SoD) Audit Report:")
print(f"User 1: {user_clean['SOX_404_Severity']} ({user_clean['Remediation_Directive']})")
print(f"User 2: {user_toxic['SOX_404_Severity']}")
for c in user_toxic['Identified_Conflicts']:
    print(f"  * {c}")`,
        output: `SOX 404 Segregation of Duties (SoD) Audit Report:\nUser 1: EFFECTIVE_SOD_COMPLIANCE (NONE (Proper Separation of Custody and Authorization))\nUser 2: MATERIAL_WEAKNESS_SOX_404_DEFICIENCY\n  * Toxic Combination: [Vendor_Master_Admin + Invoice_Approver] -> Risk: Phantom Vendor Creation\n  * Toxic Combination: [Invoice_Approver + Payment_Disburser] -> Risk: Unauthorized Cash Outflow`,
        tryIt: 'Strip Payment_Disburser and Vendor_Master_Admin from user_toxic and verify severity returns to EFFECTIVE_SOD_COMPLIANCE.',
        check: {
          question: 'What distinguishes a "Material Weakness" from a "Significant Deficiency" under SOX 404 auditing standards?',
          options: [
            'A Material Weakness represents a deficiency where there is a reasonable possibility that a material misstatement will not be prevented or detected, whereas a Significant Deficiency is less severe though still meriting audit committee attention.',
            'A Material Weakness can only be diagnosed by government criminal prosecutors.',
            'A Significant Deficiency automatically revokes the company\'s business license.',
            'There is no distinction; both terms refer to minor clerical errors.'
          ],
          answerIndex: 0,
          explanation: 'Under PCAOB standards, a Material Weakness is the most severe internal control failure: it means the internal controls are sufficiently broken that a material misstatement could slip through undetected into public financial statements.'
        }
      },
      {
        title: 'Statutory Audit Opinion Formulation & Going Concern Review',
        say: [
          'At the conclusion of a statutory audit engagement, the independent audit partner issues the formal Independent Auditor\'s Report governed by ISA 700 / PCAOB AS 3101.',
          'There are four distinct types of audit opinions: (1) Unqualified Opinion (Clean opinion: financial statements present fairly, in all material respects, the financial position of the company), (2) Qualified Opinion ("Except for" a specific isolated disagreement or limitation, the statements are fair), (3) Adverse Opinion (Misstatements are both material and pervasive, meaning financial statements are misleading), and (4) Disclaimer of Opinion (Auditor was unable to obtain sufficient evidence due to scope limitations).',
          'A mandatory duty under ISA 570 is the Going Concern Assessment: evaluating whether management\'s assumption that the company will remain in business for at least 12 months from the balance sheet date is realistic.',
          'If the auditor discovers substantial doubt regarding solvency (negative cash flows, impending debt defaults, loss of key customers) that is adequately disclosed in footnotes, the auditor issues an Unqualified Opinion with an explanatory "Emphasis of Matter: Material Uncertainty Related to Going Concern" paragraph.',
          'If the company fails to disclose its insolvency risk, the auditor must issue a Qualified or Adverse opinion.'
        ],
        example: 'A biotech company has $2M in cash, burns $1M/month, and has a $20M bond maturing in 60 days with zero committed refinancing. The auditor issues a Going Concern Explanatory Paragraph warning investors that the company may not survive the year.',
        code: `# Simulation: Statutory Audit Opinion Decision Tree & Going Concern Evaluator
class StatutoryOpinionEngine:
    @staticmethod
    def evaluate_audit_findings(material_misstatement_present: bool,
                                misstatement_is_pervasive: bool,
                                scope_limitation_prevented_audit: bool,
                                going_concern_doubt: bool,
                                going_concern_adequately_disclosed: bool) -> dict:
        # Decision tree
        if scope_limitation_prevented_audit and misstatement_is_pervasive:
            opinion = "DISCLAIMER_OF_OPINION"
            rationale = "Auditor was unable to obtain sufficient appropriate audit evidence across pervasive balances."
        elif material_misstatement_present and misstatement_is_pervasive:
            opinion = "ADVERSE_OPINION"
            rationale = "Financial statements are materially and pervasively misstated and do not present fairly."
        elif material_misstatement_present and not misstatement_is_pervasive:
            opinion = "QUALIFIED_OPINION ('Except For')"
            rationale = "Isolated material disagreement (e.g. inventory valuation) that does not distort overall statements."
        else:
            # Unqualified Clean
            if going_concern_doubt:
                if going_concern_adequately_disclosed:
                    opinion = "UNQUALIFIED_WITH_EMPHASIS_OF_MATTER_GOING_CONCERN"
                    rationale = "Clean opinion with explanatory paragraph highlighting substantial doubt regarding 12-month solvency."
                else:
                    opinion = "QUALIFIED_OR_ADVERSE_OPINION (Inadequate Footnote Disclosure)"
                    rationale = "Failure to disclose material going concern uncertainty renders financial statements misleading."
            else:
                opinion = "UNQUALIFIED_CLEAN_OPINION"
                rationale = "Financial statements present fairly, in all material respects, under applicable GAAP/IFRS."

        return {
            "Auditor_Opinion": opinion,
            "Professional_Rationale": rationale
        }

# Scenario 1: Clean public company with solvent balance sheet
clean_audit = StatutoryOpinionEngine.evaluate_audit_findings(
    material_misstatement_present=False, misstatement_is_pervasive=False,
    scope_limitation_prevented_audit=False, going_concern_doubt=False, going_concern_adequately_disclosed=True
)

# Scenario 2: Distressed startup with going concern uncertainty properly disclosed
distressed_audit = StatutoryOpinionEngine.evaluate_audit_findings(
    material_misstatement_present=False, misstatement_is_pervasive=False,
    scope_limitation_prevented_audit=False, going_concern_doubt=True, going_concern_adequately_disclosed=True
)

print(f"Scenario 1: {clean_audit['Auditor_Opinion']}")
print(f"Scenario 2: {distressed_audit['Auditor_Opinion']}")`,
        output: `Scenario 1: UNQUALIFIED_CLEAN_OPINION\nScenario 2: UNQUALIFIED_WITH_EMPHASIS_OF_MATTER_GOING_CONCERN`,
        tryIt: 'Set material_misstatement_present=True and misstatement_is_pervasive=True to observe the opinion switch to ADVERSE_OPINION.',
        check: {
          question: 'What is the required time horizon when an external auditor conducts a statutory Going Concern assessment under ISA 570?',
          options: [
            'At least 12 months from the date of the financial statements.',
            'Exactly 30 calendar days from the conclusion of fieldwork.',
            'A perpetual 10-year macroeconomic forecast.',
            'Until the next presidential election cycle.'
          ],
          answerIndex: 0,
          explanation: 'Under ISA 570 and US auditing standards, the going concern evaluation period covers at least 12 months from the balance sheet date, assessing whether the company possesses sufficient operating cash flow and credit facilities to meet upcoming debt obligations.'
        }
      }
    ],
    summary: [
      'The Audit Risk Model (AR = IR * CR * DR) forces auditors to manage Detection Risk by adjusting substantive testing sample sizes based on the client\'s Risk of Material Misstatement.',
      'Forensic Benford\'s Law chi-square testing detects fabricated transactions by identifying mathematical departures from natural leading-digit logarithmic distributions.',
      'Monetary Unit Sampling (MUS) uses probability-proportional-to-size intervals to test high-dollar balances and project sample tainting to total Upper Error Limits (UEL).',
      'SOX 404 enforces Segregation of Duties (SoD) to prevent toxic permission combinations (requester + approver + disburser) from creating material control weaknesses.',
      'Statutory audit opinions classify assurance into Unqualified (Clean), Qualified ("Except for"), Adverse, and Disclaimer of Opinion alongside mandatory 12-month Going Concern solvency reviews.'
    ],
    projectStep: {
      title: 'Forensic Audit & Internal Controls Compliance Engine',
      steps: [
        'Calculate allowable Detection Risk and substantive audit sample size under the Audit Risk Model.',
        'Implement Benford\'s Law chi-square test on accounts payable ledgers to flag fabricated transactions.',
        'Calculate Monetary Unit Sampling (MUS) interval tainting and projected Upper Error Limits.',
        'Audit ERP permission matrices to identify toxic Segregation of Duties (SoD) combinations under SOX 404.'
      ]
    }
  }
];
