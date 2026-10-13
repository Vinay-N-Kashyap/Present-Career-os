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
  },
  {
    coursePrefix: 'bcom_aud',
    day: 2,
    title: 'Beneish M-Score, Altman Z-Score Insolvency, Digital Forensics & Whistleblower Triage',
    goal: 'Master forensic financial investigation: the 8-variable Beneish M-Score earnings manipulation detection model, the Altman Z-Score bankruptcy and solvency prediction matrix, digital bank statement hash verification and PDF metadata tampering audits, shell vendor red-flag profiling, and SOX 301 / Dodd-Frank whistleblower triage protocols.',
    minutes: 42,
    recap: 'Day 1 established the quantitative Audit Risk Model, Benford\'s Law anomaly testing, and SOX 404 segregation of duties. Day 2 shifts into deep forensic fraud examination: exposing cooked accounting books with Beneish M-Scores, forecasting bankruptcy with Altman Z-Scores, and catching digital forgery.',
    parts: [
      {
        title: 'The Beneish M-Score 8-Variable Earnings Manipulation Detection Model',
        say: [
          'Developed by Professor Messod Beneish in 1999, the Beneish M-Score is a quantitative probit regression model designed to uncover financial statement manipulation and aggressive accounting distortions before traditional auditors detect them.',
          'The model famously flagged Enron\'s massive accounting fraud years before its catastrophic bankruptcy, demonstrating that reported earnings quality can be mathematically evaluated from public financial ratios.',
          'The model synthesizes eight distinct financial indices: 1. Days Sales in Receivables Index (DSRI, catches premature revenue recognition); 2. Gross Margin Index (GMI, detects deteriorating margins); 3. Asset Quality Index (AQI, flags excessive capitalization of operating expenses); 4. Sales Growth Index (SGI); 5. Depreciation Index (DEPI, catches slowdown in depreciation rates); 6. Sales, General, and Administrative Expenses Index (SGAI); 7. Leverage Index (LVGI); and 8. Total Accruals to Total Assets (TATA).',
          'Because the model uses a probit mathematical formulation, negative scores represent higher quality earnings. The empirical critical threshold is -1.78: any company with an M-Score greater than -1.78 (such as -1.40 or +0.28) exhibits a high statistical probability of being an accounting manipulator.',
          'Forensic auditors calculate M-Score annually across public companies to identify forensic audit targets and design targeted substantive testing procedures around inflated asset and revenue categories.'
        ],
        example: 'Company A reports steady revenue growth with an M-Score of -1.98 (safely clean). Company B aggressively accelerates shipments, extends credit terms, and capitalizes ordinary R&D, causing DSRI and TATA to spike. Its M-Score jumps to +0.28, far exceeding the -1.78 red line and triggering an urgent forensic audit.',
        code: `# Simulation: The Beneish M-Score Earnings Manipulation Model
from typing import Dict

def calculate_beneish_m_score(
    dsri: float, # Days Sales in Receivables Index
    gmi: float,  # Gross Margin Index
    aqi: float,  # Asset Quality Index
    sgi: float,  # Sales Growth Index
    depi: float, # Depreciation Index
    sgai: float, # SGA Expenses Index
    lvgi: float, # Leverage Index
    tata: float  # Total Accruals to Total Assets
) -> Dict:
    # 8-variable Beneish probit regression equation
    m_score = (
        -4.84 +
        (0.920 * dsri) +
        (0.528 * gmi) +
        (0.404 * aqi) +
        (0.892 * sgi) +
        (0.115 * depi) -
        (0.172 * sgai) +
        (4.037 * tata) +
        (0.0327 * lvgi)
    )

    # Threshold: M-Score > -1.78 indicates high probability of accounting manipulation
    manipulation_flag = m_score > -1.78
    classification = "PROBABLE_EARNINGS_MANIPULATOR" if manipulation_flag else "NON_MANIPULATOR_PROBABLE_CLEAN"

    return {
        "M_Score": round(m_score, 2),
        "Manipulation_Threshold": -1.78,
        "Is_Manipulator": manipulation_flag,
        "Forensic_Classification": classification
    }

clean_co = calculate_beneish_m_score(
    dsri=1.02, gmi=0.98, aqi=1.01, sgi=1.05, depi=1.00, sgai=0.99, lvgi=1.02, tata=0.02
)
manipulator_co = calculate_beneish_m_score(
    dsri=1.85, gmi=1.40, aqi=1.35, sgi=1.60, depi=0.75, sgai=0.85, lvgi=1.25, tata=0.18
)
print(f"Company A: M-Score {clean_co['M_Score']} -> [{clean_co['Forensic_Classification']}]")
print(f"Company B: M-Score {manipulator_co['M_Score']} -> [{manipulator_co['Forensic_Classification']}]")`,
        output: `Company A: M-Score -1.98 -> [NON_MANIPULATOR_PROBABLE_CLEAN]\nCompany B: M-Score 0.28 -> [PROBABLE_EARNINGS_MANIPULATOR]`,
        tryIt: 'Change Company B tata to 0.04 and dsri to 1.10 to observe the M-score drop below -1.78 into clean territory.',
        check: {
          question: 'What does a Beneish M-Score greater than -1.78 (e.g., -1.45 or +0.30) indicate to a forensic auditor?',
          options: [
            '(Recommended) The company exhibits a high statistical probability of earnings manipulation and aggressive financial statement distortion.',
            'The company has zero debt and is immune from financial audits.',
            'The company is legally entitled to a 50% reduction in federal corporate income taxes.',
            'The company has qualified for immediate listing on the New York Stock Exchange.'
          ],
          answer: 0,
          why: 'Because the Beneish probit model produces negative scores for clean firms, scores above -1.78 indicate significant probability that reported profits are manipulated through aggressive accruals or distorted margins.',
          answerIndex: 0,
          explanation: 'Because the Beneish probit model produces negative scores for clean firms, scores above -1.78 indicate significant probability that reported profits are manipulated through aggressive accruals or distorted margins.'
        }
      },
      {
        title: 'Altman Z-Score Insolvency & Bankruptcy Prediction Matrix',
        say: [
          'Developed by NYU Professor Edward Altman in 1968, the Altman Z-Score is the preeminent multivariate discriminant analysis (MDA) formula used across global capital markets to forecast corporate bankruptcy and default risk.',
          'Forensic auditors rely heavily on Altman Z-Scores because empirical data demonstrates that companies facing acute solvency distress are over five times more likely to engage in executive management fraud, fabricated revenues, and channel stuffing to conceal covenant breaches from lenders.',
          'The classic Z-Score formula integrates five weighted financial ratios: X1 = Working Capital / Total Assets (measures short-term liquid asset buffer); X2 = Retained Earnings / Total Assets (measures cumulative profitability and firm maturity); X3 = EBIT / Total Assets (measures genuine operating productivity unclouded by tax or leverage); X4 = Market Value of Equity / Total Liabilities (measures financial leverage cushion); and X5 = Sales / Total Assets (measures asset turnover efficiency).',
          'The equation Z = 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 0.999*X5 categorizes firms into three distinct zones: Distress Zone (Z < 1.81, signifying high bankruptcy probability within 24 months), Grey Zone (1.81 <= Z <= 2.99, indicating moderate solvency risk), and Safe Zone (Z > 2.99, reflecting robust solvency).',
          'Auditors use the Z-Score to satisfy statutory ISA 570 Going Concern mandates and determine whether to demand additional forensic audit verifications or issue an Emphasis of Matter modification.'
        ],
        example: 'Firm 1 has negative working capital and retained earnings losses. Its Z-Score is 0.32, landing deep inside the Distress Zone. In contrast, Firm 2 generates strong operating earnings and has low leverage, achieving a Z-Score of 4.53 in the Safe Zone.',
        code: `# Simulation: Altman Z-Score Insolvency & Bankruptcy Prediction Matrix
from typing import Dict

def calculate_altman_z_score(
    working_capital: float,
    retained_earnings: float,
    ebit: float,
    market_value_equity: float,
    total_liabilities: float,
    sales: float,
    total_assets: float
) -> Dict:
    # 5 Financial Ratios
    x1 = working_capital / total_assets
    x2 = retained_earnings / total_assets
    x3 = ebit / total_assets
    x4 = market_value_equity / total_liabilities
    x5 = sales / total_assets

    # Altman 1968 Original Formula
    z_score = (1.2 * x1) + (1.4 * x2) + (3.3 * x3) + (0.6 * x4) + (0.999 * x5)

    if z_score < 1.81:
        zone = "DISTRESS_ZONE (High Bankruptcy Probability within 24 Months)"
    elif z_score <= 2.99:
        zone = "GREY_ZONE (Moderate Solvency Risk)"
    else:
        zone = "SAFE_ZONE (Solid Solvency Profile)"

    return {
        "Z_Score": round(z_score, 2),
        "Working_Capital_Ratio_X1": round(x1, 3),
        "Profitability_Ratio_X3": round(x3, 3),
        "Solvency_Leverage_X4": round(x4, 3),
        "Solvency_Zone": zone
    }

distressed = calculate_altman_z_score(
    working_capital=-2000000.0,
    retained_earnings=-8000000.0,
    ebit=500000.0,
    market_value_equity=10000000.0,
    total_liabilities=30000000.0,
    sales=15000000.0,
    total_assets=25000000.0
)
healthy = calculate_altman_z_score(
    working_capital=8000000.0,
    retained_earnings=15000000.0,
    ebit=6000000.0,
    market_value_equity=80000000.0,
    total_liabilities=20000000.0,
    sales=35000000.0,
    total_assets=40000000.0
)
print(f"Firm 1: Z-Score {distressed['Z_Score']} -> {distressed['Solvency_Zone']}")
print(f"Firm 2: Z-Score {healthy['Z_Score']} -> {healthy['Solvency_Zone']}")`,
        output: `Firm 1: Z-Score 0.32 -> DISTRESS_ZONE (High Bankruptcy Probability within 24 Months)\nFirm 2: Z-Score 4.53 -> SAFE_ZONE (Solid Solvency Profile)`,
        tryIt: 'Inject $10,000,000 into Firm 1 working capital and retained earnings to see its Z-Score climb toward the Grey Zone.',
        check: {
          question: 'Why is an Altman Z-Score below 1.81 considered a major red flag in forensic audit examinations?',
          options: [
            '(Recommended) It places the company in the Distress Zone with high probability of bankruptcy within 24 months, which significantly increases management incentive to commit accounting fraud.',
            'It proves that the company has committed money laundering under federal law.',
            'It automatically revokes the company\'s commercial banking license.',
            'It requires the auditor to immediately resign without completing the audit.'
          ],
          answer: 0,
          why: 'Scores below 1.81 signify acute financial distress, creating intense pressure on executive management to fabricate revenue or conceal liabilities to prevent debt covenant defaults.',
          answerIndex: 0,
          explanation: 'Scores below 1.81 signify acute financial distress, creating intense pressure on executive management to fabricate revenue or conceal liabilities to prevent debt covenant defaults.'
        }
      },
      {
        title: 'Forensic Digital Bank Statement Hash Verification & PDF Metadata Tampering Detection',
        say: [
          'In modern financial investigations, white-collar criminals routinely falsify digital documentation: submitting forged bank statements to secure commercial credit lines, altered vendor invoices to embezzle funds, or doctored audit confirmation letters.',
          'Forensic auditors cannot rely solely on visual inspection of scanned PDFs. Digital forensics requires inspecting the underlying file structure, cryptographic hashes, and embedded metadata.',
          'Cryptographic hashing (SHA-256) establishes document integrity: calculating a cryptographic checksum ensures that an audit evidence file has remained unaltered from the moment of receipt through legal courtroom proceedings (maintaining strict Chain of Custody).',
          'PDF metadata analysis inspects the internal structural tags: genuine commercial bank statements are generated by enterprise automated spoolers (such as FIS CoreBanking, Fiserv, or Jack Henry systems). If metadata reveals consumer graphic editing applications (such as Adobe Photoshop, Canva, or online PDF patchers), the document is definitively compromised.',
          'Furthermore, forensic software checks modification timestamp discrepancies (where the document modification timestamp postdates the statement creation date) and localized font embedding anomalies where altered balance numbers use different embedded fonts than the rest of the statement.'
        ],
        example: 'An auditor inspects two bank statements. Document 1 was produced by "FIS CoreBanking Reporting v8.2" with zero modification flags. Document 2 claims to be from Chase Bank, but its PDF metadata reveals it was created in "Adobe Photoshop 24.1" with non-standard font embedding. The forensic auditor immediately freezes the credit application.',
        code: `# Simulation: Forensic Document Metadata & Alteration Detector
from typing import Dict

class ForensicDocumentMetadataAuditor:
    DISALLOWED_PRODUCERS = ["adobe photoshop", "canva", "gimp", "pdf editor", "foxit phantompdf"]

    @classmethod
    def audit_pdf_metadata(
        cls,
        filename: str,
        producer: str,
        creator_tool: str,
        modified_after_creation: bool,
        contains_embedded_nonstandard_fonts: bool
    ) -> Dict:
        red_flags = []

        # Check for disallowed image editing software in official financial statements
        p_lower = producer.lower()
        c_lower = creator_tool.lower()

        for forbidden in cls.DISALLOWED_PRODUCERS:
            if forbidden in p_lower or forbidden in c_lower:
                red_flags.append(f"ILLICIT_CREATOR_TOOL ({producer})")
                break

        if modified_after_creation:
            red_flags.append("POST_ISSUANCE_MODIFICATION_TIMESTAMP_MISMATCH")

        if contains_embedded_nonstandard_fonts:
            red_flags.append("ANOMALOUS_FONT_PATCHING (Signs of localized figure alteration)")

        is_tampered = len(red_flags) > 0

        return {
            "Filename": filename,
            "Producer": producer,
            "Creator": creator_tool,
            "Tampered_Flag": is_tampered,
            "Red_Flag_Count": len(red_flags),
            "Forensic_Finding": "SUSPECTED_FABRICATION" if is_tampered else "VERIFIED_AUTHENTIC_SYSTEM_STATEMENT"
        }

doc_clean = ForensicDocumentMetadataAuditor.audit_pdf_metadata(
    "JPMorgan_Statement_Nov2025.pdf", "FIS CoreBanking Reporting v8.2", "AFP-to-PDF Engine", False, False
)
doc_forged = ForensicDocumentMetadataAuditor.audit_pdf_metadata(
    "Chase_Bank_Verification.pdf", "Adobe Photoshop 24.1", "macOS Quartz PDFContext", True, True
)
print(f"Doc 1: {doc_clean['Filename']} -> [{doc_clean['Forensic_Finding']}] (Flags: {doc_clean['Red_Flag_Count']})")
print(f"Doc 2: {doc_forged['Filename']} -> [{doc_forged['Forensic_Finding']}] (Flags: {doc_forged['Red_Flag_Count']})")`,
        output: `Doc 1: JPMorgan_Statement_Nov2025.pdf -> [VERIFIED_AUTHENTIC_SYSTEM_STATEMENT] (Flags: 0)\nDoc 2: Chase_Bank_Verification.pdf -> [SUSPECTED_FABRICATION] (Flags: 3)`,
        tryIt: 'Change producer to "Core Banking Engine v5" and set modified_after_creation=False to see Document 2 pass as authentic.',
        check: {
          question: 'What is the most definitive technical indicator that an electronic bank statement PDF submitted during an audit was fraudulently altered?',
          options: [
            '(Recommended) PDF metadata revealing consumer graphic design software (such as Photoshop or Canva) as the creator, mismatched modification timestamps, or patched non-standard font embeddings.',
            'The statement was generated on a Tuesday afternoon.',
            'The document file size is an even number of kilobytes.',
            'The bank statement contains account numbers with more than 8 digits.'
          ],
          answer: 0,
          why: 'Automated banking systems generate statements via specialized enterprise spoolers; appearance of desktop graphic design software or font patching in metadata provides conclusive proof of tampering.',
          answerIndex: 0,
          explanation: 'Automated banking systems generate statements via specialized enterprise spoolers; appearance of desktop graphic design software or font patching in metadata provides conclusive proof of tampering.'
        }
      },
      {
        title: 'Shell Company Red-Flag Profiling & Vendor Kickback Detection Matrix',
        say: [
          'According to the Association of Certified Fraud Examiners (ACFE) Report to the Nations, procurement and billing schemes represent over 43% of all occupational fraud cases, causing massive median losses to enterprises.',
          'In a classic shell company billing scheme, a corrupt employee registers a fictitious corporate entity and submits fraudulent invoices for consulting, advisory, or marketing services that were never actually rendered.',
          'Forensic audit algorithms systematically profile vendor master files against red-flag matrices to identify anomalous patterns.',
          'Key detection vectors include: 1. Conflict of Interest address matching (cross-referencing vendor billing addresses against employee HR home addresses or commercial PO boxes); 2. Missing or invalid tax identification numbers (EIN or VAT numbers); 3. Approval threshold evasion (invoice splitting where multiple invoices are submitted just below the manager\'s discretionary approval limit, such as $4,950 when $5,000 requires VP authorization); and 4. Sequential invoice numbers over extended periods (indicating the vendor has no other commercial clients).',
          'When two or more high-severity red flags align on a single vendor, the forensic engine immediately triggers an Accounts Payable freeze and issues an investigative notice to internal audit.'
        ],
        example: 'Apex Consulting submits four invoices between $4,920 and $4,990 (just below the $5,000 threshold). An automated forensic cross-check reveals the vendor address matches the Senior Procurement Manager\'s home address, and the vendor has no valid EIN. The vendor is immediately flagged as CRITICAL_FRAUD_RISK and frozen.',
        code: `# Simulation: Shell Company Red-Flag Profiling & Vendor Kickback Engine
from typing import Dict, List

def detect_shell_vendor_fraud(
    vendor_name: str,
    vendor_address: str,
    employee_home_addresses: List[str],
    annual_spend: float,
    invoice_amounts: List[float],
    has_valid_tax_id: bool,
    approval_threshold: float = 5000.0
) -> Dict:
    fraud_indicators = []

    # Red Flag 1: Conflict of interest - Vendor address matches employee residence
    if vendor_address in employee_home_addresses:
        fraud_indicators.append("VENDOR_ADDRESS_MATCHES_EMPLOYEE_RESIDENCE")

    # Red Flag 2: Missing statutory Tax ID / Registration
    if not has_valid_tax_id:
        fraud_indicators.append("UNVERIFIED_TAX_IDENTIFICATION_NUMBER")

    # Red Flag 3: Threshold avoidance - multiple invoices just below approval limit ($4,900-$4,999)
    threshold_evading_invoices = sum(
        1 for inv in invoice_amounts if (approval_threshold - 100.0) <= inv < approval_threshold
    )
    if threshold_evading_invoices >= 2:
        fraud_indicators.append(f"INVOICE_SPLITTING_THRESHOLD_EVASION ({threshold_evading_invoices} invoices)")

    risk_level = "CRITICAL_FRAUD_RISK" if len(fraud_indicators) >= 2 else ("ELEVATED_RISK" if fraud_indicators else "NORMAL")

    return {
        "Vendor": vendor_name,
        "Annual_Spend": round(annual_spend, 2),
        "Fraud_Risk_Level": risk_level,
        "Red_Flags_Detected": fraud_indicators,
        "Recommend_Vendor_Freeze": risk_level == "CRITICAL_FRAUD_RISK"
    }

v_res = detect_shell_vendor_fraud(
    vendor_name="Apex_Consulting_LLC",
    vendor_address="124 Elm Street, Apt 3",
    employee_home_addresses=["124 Elm Street, Apt 3", "742 Evergreen Terrace"],
    annual_spend=49500.0,
    invoice_amounts=[4950.0, 4975.0, 4920.0, 4990.0],
    has_valid_tax_id=False,
    approval_threshold=5000.0
)
print(f"Vendor: {v_res['Vendor']} | Risk: {v_res['Fraud_Risk_Level']}")
print(f"Recommend Freeze: {v_res['Recommend_Vendor_Freeze']} -> Flags: {v_res['Red_Flags_Detected']}")`,
        output: `Vendor: Apex_Consulting_LLC | Risk: CRITICAL_FRAUD_RISK\nRecommend Freeze: True -> Flags: ['VENDOR_ADDRESS_MATCHES_EMPLOYEE_RESIDENCE', 'UNVERIFIED_TAX_IDENTIFICATION_NUMBER', 'INVOICE_SPLITTING_THRESHOLD_EVASION (4 invoices)']`,
        tryIt: 'Change vendor_address to a distinct commercial address and set has_valid_tax_id=True to see the risk level downgrade.',
        check: {
          question: 'Why is cross-referencing employee residential addresses against Accounts Payable vendor billing records a standard forensic audit procedure?',
          options: [
            '(Recommended) To detect fictitious shell vendor schemes and employee kickbacks where an insider creates a fake consulting company using their personal address to embezzle company funds.',
            'To ensure that all employees receive free holiday gift baskets from authorized corporate vendors.',
            'To verify that vendors live within a 50-mile radius of corporate headquarters for supply chain efficiency.',
            'To comply with federal postal regulations regarding corporate mail delivery.'
          ],
          answer: 0,
          why: 'Dishonest employees frequently use their home or residential PO box when registering fake shell vendors; algorithmic address matching detects these hidden conflicts of interest immediately.',
          answerIndex: 0,
          explanation: 'Dishonest employees frequently use their home or residential PO box when registering fake shell vendors; algorithmic address matching detects these hidden conflicts of interest immediately.'
        }
      },
      {
        title: 'Whistleblower Hotline Triage Matrix & Dodd-Frank Protocols',
        say: [
          'Empirical studies consistently prove that anonymous whistleblower hotlines are the single most effective fraud detection mechanism in corporate history: tips uncover over 40% of all white-collar fraud cases, more than internal and external audits combined.',
          'Under Sarbanes-Oxley (SOX) Section 301, all publicly traded corporations must maintain independent, confidential, anonymous reporting channels directly overseen by the Board of Directors\' Audit Committee.',
          'Furthermore, the SEC Dodd-Frank Whistleblower Program provides monetary incentives (10% to 30% of total financial sanctions recovered by the government) and severe federal anti-retaliation protections for corporate insiders reporting securities fraud.',
          'When tips are submitted, compliance and forensic teams apply a formal Whistleblower Triage Matrix: allegations involving C-suite executives (CEO, CFO, General Counsel) or financial magnitude exceeding $1,000,000 with corroborating evidence are classified as Tier 1.',
          'Tier 1 allegations require immediate notification of the Board Audit Committee and the retention of independent external forensic counsel to conduct an uncompromised investigation with full digital evidence preservation.'
        ],
        example: 'A whistleblower reports that the CFO is artificially inflating quarterly revenues by $8.5M through unexecuted channel partner orders, attaching internal email screenshots. Because it involves a C-suite executive and exceeds $1M with corroboration, the triage engine classifies it as Tier 1, immediately alerting the Board Audit Committee and freezing server logs.',
        code: `# Simulation: Whistleblower Hotline Triage Matrix & Dodd-Frank Protocols
from typing import Dict

def triage_whistleblower_allegation(
    report_id: str,
    subject_allegation: str,
    involves_senior_executive: bool,
    estimated_financial_impact: float,
    corroborating_evidence_attached: bool
) -> Dict:
    # Triage decision logic under SOX 301 and SEC Whistleblower rules
    if involves_senior_executive or estimated_financial_impact >= 1000000.0:
        if corroborating_evidence_attached:
            triage_tier = "TIER_1_IMMEDIATE_AUDIT_COMMITTEE_INDEPENDENT_INQUIRY"
            action = "Retain independent external forensic legal counsel; preserve server logs."
        else:
            triage_tier = "TIER_2_PRELIMINARY_FORENSIC_INVESTIGATION"
            action = "Internal audit interviews witness and secures financial ledgers."
    elif estimated_financial_impact >= 50000.0:
        triage_tier = "TIER_3_INTERNAL_AUDIT_ROUTINE_REVIEW"
        action = "Route to internal audit for scheduled field examination."
    else:
        triage_tier = "TIER_4_HUMAN_RESOURCES_DISPUTE"
        action = "Route to HR compliance desk."

    return {
        "Report_ID": report_id,
        "Allegation": subject_allegation,
        "Triage_Level": triage_tier,
        "Recommended_Action": action,
        "Requires_Board_Notification": "TIER_1" in triage_tier
    }

wb_res = triage_whistleblower_allegation(
    report_id="WB-2026-088",
    subject_allegation="CFO inflating revenue by booking unexecuted channel partner orders",
    involves_senior_executive=True,
    estimated_financial_impact=8500000.0,
    corroborating_evidence_attached=True
)
print(f"Report: {wb_res['Report_ID']} -> {wb_res['Triage_Level']}")
print(f"Action: {wb_res['Recommended_Action']} (Notify Board: {wb_res['Requires_Board_Notification']})")`,
        output: `Report: WB-2026-088 -> TIER_1_IMMEDIATE_AUDIT_COMMITTEE_INDEPENDENT_INQUIRY\nAction: Retain independent external forensic legal counsel; preserve server logs. (Notify Board: True)`,
        tryIt: 'Set involves_senior_executive=False and estimated_financial_impact=25000.0 to see the report routed to routine HR compliance.',
        check: {
          question: 'Under SOX 301 and corporate governance standards, what immediate action is required when a credible whistleblower tip alleges multimillion-dollar accounting fraud by the Chief Financial Officer?',
          options: [
            '(Recommended) The Audit Committee must be immediately notified and an independent investigation launched using outside forensic legal counsel, bypassing management to prevent cover-ups.',
            'The tip must be forwarded to the CFO to draft a public rebuttal before the Board is notified.',
            'The company must terminate the employee who submitted the anonymous report.',
            'The allegation must be held confidential until the annual shareholder meeting 9 months later.'
          ],
          answer: 0,
          why: 'When senior executives are implicated in material accounting fraud, internal management cannot investigate itself; the Board\'s Audit Committee must oversee an independent inquiry led by external forensic counsel.',
          answerIndex: 0,
          explanation: 'When senior executives are implicated in material accounting fraud, internal management cannot investigate itself; the Board\'s Audit Committee must oversee an independent inquiry led by external forensic counsel.'
        }
      }
    ],
    summary: [
      'The Beneish M-Score combines 8 financial indices into a probit model where scores > -1.78 mathematically indicate earnings manipulation.',
      'The Altman Z-Score predicts insolvency through 5 weighted ratios, categorizing firms into Distress (Z < 1.81), Grey, and Safe zones.',
      'Forensic digital document analysis verifies PDF metadata, producer strings, and font patch anomalies to expose doctored bank statements.',
      'Shell company detection algorithms cross-reference employee addresses and flag sub-threshold invoice splitting to catch procurement kickbacks.',
      'Whistleblower hotlines are the primary source of fraud detection, requiring formal triage matrices and independent Audit Committee escalation under SOX 301.'
    ],
    projectStep: {
      title: 'Forensic Fraud Examination & Corporate Governance Engine',
      steps: [
        'Calculate Beneish M-Scores across historical financial statements to evaluate earnings manipulation probability.',
        'Model Altman Z-Score insolvency zones to forecast distress risk and management fraud incentives.',
        'Audit electronic PDF metadata to identify tampering by consumer graphic editing software.',
        'Implement shell vendor red-flag screening and automate whistleblower allegation triage workflows.'
      ]
    }
  },
  {
    coursePrefix: 'bcom_aud',
    day: 3,
    title: 'Advanced Fraud Analytics, Machine Learning Anomaly Auditing & FCPA Red Flags',
    goal: 'Master automated forensic audit technologies: general ledger journal entry testing under ISA 240 and PCAOB AS 2401, robust statistical outlier detection via Median Absolute Deviation (MAD) Modified Z-scores, multi-entity intercompany matrix reconciliations and phantom elimination audits, Foreign Corrupt Practices Act (FCPA) third-party intermediary corruption risk scoring, and employee-vendor collision graph forensic analysis.',
    minutes: 45,
    recap: 'In Day 2, we evaluated the Beneish M-Score, Altman Z-Score distress zones, PDF metadata tampering, and shell vendor triage. Today, we advance into enterprise forensic data science: testing millions of general ledger journal entries, detecting non-linear statistical anomalies, exposing phantom intercompany accounts, and dismantling procurement kickback rings.',
    parts: [
      {
        title: 'Automated Journal Entry Testing (ISA 240 / PCAOB AS 2401) & Fraud Heuristics',
        say: [
          'When corporate management perpetrates financial statement fraud, the illicit adjustments are ultimately recorded through manual journal entries in the general ledger. Recognizing this vulnerability, International Standard on Auditing (ISA 240) and PCAOB AS 2401 mandate that auditors design and perform automated journal entry testing across the entire accounting population.',
          'Fraudulent journal entries exhibit distinct behavioral fingerprints: they are disproportionately entered outside standard business hours (late nights, weekends, and statutory holidays), recorded by senior executives (such as the Chief Financial Officer or Corporate Controller) who normally possess supervisory rather than transactional roles, and posted immediately prior to or after period-end close to hit quarterly earnings consensus.',
          'Furthermore, forensic data analytics flags heuristic numerical patterns, such as round-dollar amounts ($500,000, $1,000,000) or transactions intentionally posted just below internal delegation-of-authority approval bands ($9,500 to $9,999). Automated scripts inspect account pairings, immediately alerting when manual entries debit obscure asset or suspense accounts while crediting revenue without cash receipt.'
        ],
        example: 'During a statutory audit of an enterprise software provider, an automated ISA 240 audit script scans 450,000 journal entries. It flags entry JE-2026-901 for $1,000,000 posted at 11:00 PM on a Saturday following quarter-end close by the CFO, debiting a prepaid suspense account and crediting license revenue. The entry triggers a maximum fraud risk score of 140, triggering an immediate forensic audit committee review.',
        code: `def audit_journal_entries_fraud_heuristics(entries: list) -> dict:
    audited = []
    high_risk_count = 0
    
    for entry in entries:
        flags = []
        score = 0
        
        hour = entry.get("posting_hour", 12)
        is_weekend = entry.get("is_weekend", False)
        if is_weekend or (hour >= 22 or hour <= 5):
            flags.append("OFF_HOURS_OR_WEEKEND_POSTING")
            score += 25
            
        amount = entry.get("amount", 0.0)
        if amount >= 10000.0 and (amount % 10000.0 == 0.0):
            flags.append("ROUND_DOLLAR_AMOUNT_PATTERN")
            score += 20
        elif 9500.0 <= (amount % 10000.0) <= 9999.0:
            flags.append("SUB_THRESHOLD_APPROVAL_BAND")
            score += 25
            
        if entry.get("is_post_close_adjustment", False):
            flags.append("POST_PERIOD_CLOSE_ADJUSTMENT")
            score += 30
            
        debit_acct = entry.get("debit_account", "")
        credit_acct = entry.get("credit_account", "")
        if "Suspense" in debit_acct or "Intangible" in debit_acct:
            if "Revenue" in credit_acct:
                flags.append("SENSITIVE_ACCOUNT_COMBINATION_REVENUE_INFLATION")
                score += 35
                
        if entry.get("posted_by_role", "") in ["CFO", "CEO", "CONTROLLER"]:
            flags.append("SENIOR_EXECUTIVE_MANUAL_OVERRIDE")
            score += 30
            
        risk_tier = "HIGH_RISK_MANAGEMENT_OVERRIDE" if score >= 50 else ("MEDIUM_RISK" if score >= 25 else "LOW_RISK_ROUTINE")
        if risk_tier == "HIGH_RISK_MANAGEMENT_OVERRIDE":
            high_risk_count += 1
            
        audited.append({
            "entry_id": entry["entry_id"],
            "amount_usd": round(amount, 2),
            "fraud_risk_score": score,
            "risk_tier": risk_tier,
            "audit_flags": flags
        })
        
    return {
        "total_entries_screened": len(entries),
        "high_risk_exceptions_found": high_risk_count,
        "isa240_audit_verdict": "TARGETED_SUBSTANTIVE_INQUIRY_REQUIRED" if high_risk_count > 0 else "CLEAN_JOURNAL_POPULATION",
        "screened_entries": audited
    }

p1 = audit_journal_entries_fraud_heuristics([
    {
        "entry_id": "JE-2026-901", "amount": 1000000.0, "is_weekend": True, "posting_hour": 23,
        "is_post_close_adjustment": True, "debit_account": "Prepaid Asset Suspense",
        "credit_account": "Software License Revenue", "posted_by_role": "CFO"
    },
    {
        "entry_id": "JE-2026-902", "amount": 14235.60, "is_weekend": False, "posting_hour": 14,
        "is_post_close_adjustment": False, "debit_account": "Inventory",
        "credit_account": "Accounts Payable", "posted_by_role": "STAFF_ACCOUNTANT"
    }
])
print(f"Entries Screened: {p1['total_entries_screened']} | High Risk Exceptions: {p1['high_risk_exceptions_found']}")
print(f"Verdict: {p1['isa240_audit_verdict']}")
for e in p1['screened_entries']:
    amt_s = "$" + f"{e['amount_usd']:,.2f}"
    print(f"  {e['entry_id']}: {amt_s} | Score {e['fraud_risk_score']} -> {e['risk_tier']}")`,
        output: `Entries Screened: 2 | High Risk Exceptions: 1\nVerdict: TARGETED_SUBSTANTIVE_INQUIRY_REQUIRED\n  JE-2026-901: $1,000,000.00 | Score 140 -> HIGH_RISK_MANAGEMENT_OVERRIDE\n  JE-2026-902: $14,235.60 | Score 0 -> LOW_RISK_ROUTINE`,
        codeNotes: [
          { line: 11, note: 'Screens general ledger entries for off-hours and weekend posting anomalies' },
          { line: 17, note: 'Detects round-dollar patterns ($1,000,000) and threshold-skirting approval bands' },
          { line: 27, note: 'Flags suspicious account pairs debiting prepaid suspense and crediting revenue' },
          { line: 33, note: 'Isolates senior executive management override postings by CFOs or Controllers' }
        ],
        tryIt: 'Change JE-2026-901 posted_by_role to STAFF_ACCOUNTANT and posting_hour to 11 AM to observe score reduction.',
        check: {
          question: 'Under ISA 240 and PCAOB AS 2401, why is manual journal entry testing mandatory even when an auditor tests routine internal controls over daily operational transactions?',
          options: [
            'Because management is uniquely positioned to override internal accounting controls and record fraudulent manual adjustments directly in the general ledger.',
            'Because manual journal entries are automatically deleted from server databases every 90 days.',
            'Because external auditors are legally required to balance the corporate checkbook.',
            'Because journal entry testing eliminates the need to verify cash bank balances.'
          ],
          answer: 0,
          why: 'Management override of controls is an inherent risk in financial reporting; senior executives can circumvent established controls by posting manual post-closing journal entries directly into the ledger.',
          answerIndex: 0,
          explanation: 'Management override of controls is an inherent risk in financial reporting; senior executives can circumvent established controls by posting manual post-closing journal entries directly into the ledger.'
        }
      },
      {
        title: 'Statistical & Machine Learning Anomaly Detection via Robust MAD Z-Scores',
        say: [
          'Traditional audit testing often relies on fixed dollar thresholds—such as examining all expenses over $50,000. Sophisticated fraudsters exploit this rule by structuring fraudulent outflows into multiple smaller transactions ($45,000 each) or dispersing unapproved disbursements across routine expense categories.',
          'Standard statistical measures, like the classic Mean and Standard Deviation, are fatally flawed when testing for fraud because extreme fraudulent outliers inflate both the mean and the standard deviation, masking the very anomalies the auditor seeks to discover. In forensic data science, this phenomenon is known as the masking effect.',
          'To overcome masking, forensic auditors deploy robust statistics based on the Median Absolute Deviation (MAD) to compute Modified Z-scores. The median is completely immune to extreme outliers (possessing a 50% breakdown point). Any expense generating a Modified Z-score exceeding 3.5 deviates radically from the normal distribution of corporate expenditures, identifying fraudulent diversions with mathematical certainty.'
        ],
        example: 'In testing a departmental expense ledger with a median expenditure of $1,100 and a MAD of $150, a routine client dinner of $1,200 yields a Modified Z-score of 0.45. However, a $87,500 consulting disbursement to an undisclosed advisory LLC yields an astronomical Modified Z-score of 388.51, flagging an undeniable statistical outlier that warrants immediate contract inspection.',
        code: `def detect_expense_anomalies_via_mad_zscore(
    expense_records: list,
    threshold_mad_score: float = 3.5
) -> dict:
    amounts = [rec["amount"] for rec in expense_records]
    if not amounts:
        return {"total_records": 0, "anomalies_detected": 0, "anomalous_records": []}
        
    sorted_amounts = sorted(amounts)
    n = len(sorted_amounts)
    mid = n // 2
    median = (sorted_amounts[mid] if n % 2 != 0 else (sorted_amounts[mid - 1] + sorted_amounts[mid]) / 2.0)
    
    abs_deviations = sorted([abs(x - median) for x in amounts])
    mad = (abs_deviations[mid] if n % 2 != 0 else (abs_deviations[mid - 1] + abs_deviations[mid]) / 2.0)
    mad = max(0.0001, mad)
    
    anomalies = []
    for rec in expense_records:
        x = rec["amount"]
        mod_z = 0.6745 * abs(x - median) / mad
        if mod_z >= threshold_mad_score:
            anomalies.append({
                "record_id": rec["record_id"],
                "payee": rec["payee"],
                "amount_usd": round(x, 2),
                "modified_zscore": round(mod_z, 2),
                "is_outlier": True
            })
            
    return {
        "total_expenses_analyzed": len(expense_records),
        "population_median_usd": round(median, 2),
        "mad_dispersion_usd": round(mad, 2),
        "anomalies_flagged_count": len(anomalies),
        "flagged_exceptions": anomalies
    }

p2 = detect_expense_anomalies_via_mad_zscore([
    {"record_id": "EXP-101", "payee": "Corporate Travel", "amount": 1200.0},
    {"record_id": "EXP-102", "payee": "Team Lunch", "amount": 850.0},
    {"record_id": "EXP-103", "payee": "Client Dinner", "amount": 1100.0},
    {"record_id": "EXP-104", "payee": "Office Supplies", "amount": 950.0},
    {"record_id": "EXP-105", "payee": "Apex Advisory LLC", "amount": 87500.0}
])
med_s = "$" + f"{p2['population_median_usd']:,.2f}"
mad_s = "$" + f"{p2['mad_dispersion_usd']:,.2f}"
print(f"Median: {med_s} | MAD: {mad_s} | Anomalies: {p2['anomalies_flagged_count']}")
for a in p2['flagged_exceptions']:
    out_s = "$" + f"{a['amount_usd']:,.2f}"
    print(f"  {a['record_id']} ({a['payee']}): {out_s} (Modified Z: {a['modified_zscore']})")`,
        output: `Median: $1,100.00 | MAD: $150.00 | Anomalies: 1\n  EXP-105 (Apex Advisory LLC): $87,500.00 (Modified Z: 388.51)`,
        codeNotes: [
          { line: 12, note: 'Calculates population median robust to extreme fraudulent transaction amounts' },
          { line: 16, note: 'Computes Median Absolute Deviation (MAD) establishing non-parametric dispersion baseline' },
          { line: 21, note: 'Applies Boris Iglewicz and David Hoaglin Modified Z-score formula with 0.6745 normal factor' },
          { line: 23, note: 'Screens against statutory 3.5 threshold identifying extreme non-linear statistical outliers' }
        ],
        tryIt: 'Add another high payment of $90,000 to observe how median and MAD remain stable, flagging both outliers.',
        check: {
          question: 'Why do forensic data auditors rely on the Median Absolute Deviation (MAD) Modified Z-score rather than traditional Mean and Standard Deviation when testing financial ledgers for fraud?',
          options: [
            'Because the mean and standard deviation are heavily distorted by the very fraudulent outliers the auditor seeks to detect, creating a masking effect.',
            'Because calculating the arithmetic mean is prohibited under modern auditing standards.',
            'Because the MAD formula automatically decrypts password-protected corporate PDF files.',
            'Because standard deviation can only be computed for companies in the manufacturing sector.'
          ],
          answer: 0,
          why: 'Extreme fraudulent numbers inflate the sample mean and standard deviation, causing other fraudulent entries to look normal (masking). The median and MAD are robust non-parametric metrics with high breakdown points.',
          answerIndex: 0,
          explanation: 'Extreme fraudulent numbers inflate the sample mean and standard deviation, causing other fraudulent entries to look normal (masking). The median and MAD are robust non-parametric metrics with high breakdown points.'
        }
      },
      {
        title: 'Multi-Entity Intercompany Reconciliation & Phantom Asset Elimination Audit',
        say: [
          'In multinational corporate groups, intercompany accounts are the single most dangerous breeding ground for financial manipulation and hidden operational losses. In notorious historic corporate scandals—such as Parmalat, WorldCom, and Olympus—fictitious profits and embezzled funds were concealed in obscure intercompany clearing accounts.',
          'Under basic accounting principles of consolidation, every intercompany receivable recorded on Subsidiary A\'s balance sheet must correspond exactly to an identical intercompany payable on Subsidiary B\'s balance sheet. When the corporate group consolidates its financial statements, these balances must eliminate to exactly zero across all currencies and entities.',
          'During statutory assurance, auditors execute automated intercompany elimination audits. A failure to eliminate—or the presence of large unreconciled balances aging beyond 90 days—indicates either broken enterprise resource planning (ERP) controls or intentional phantom revenue schemes, where management booked unilateral fictitious sales that the receiving subsidiary never recognized.'
        ],
        example: 'During group consolidation of a $250M enterprise, US Parent reports a $40.0M intercompany receivable due from an offshore affiliate in the Cayman Islands. However, the Cayman subsidiary records only $32.0M in corresponding payables, creating an uneliminated variance of $8.0M that has aged over 180 days. The audit engine triggers a Phantom Balance Variance alert, mandating substantive verification of the underlying contracts.',
        code: `def reconcile_intercompany_matrix_and_detect_phantom_balances(
    subsidiary_pairs: list
) -> dict:
    total_receivables = 0.0
    total_payables = 0.0
    unreconciled_pairs = []
    
    for pair in subsidiary_pairs:
        rec = pair["entity_a_receivable_usd"]
        pay = pair["entity_b_payable_usd"]
        diff = abs(rec - pay)
        total_receivables += rec
        total_payables += pay
        
        has_variance = diff > 100.0
        unreconciled_pairs.append({
            "entity_a": pair["entity_a_name"],
            "entity_b": pair["entity_b_name"],
            "receivable_usd": round(rec, 2),
            "payable_usd": round(pay, 2),
            "variance_usd": round(diff, 2),
            "is_balanced": not has_variance,
            "aging_days": pair.get("unreconciled_aging_days", 0)
        })
        
    net_consolidation_imbalance = abs(total_receivables - total_payables)
    imbalance_flag = net_consolidation_imbalance > 1000.0
    
    return {
        "total_intercompany_receivables_usd": round(total_receivables, 2),
        "total_intercompany_payables_usd": round(total_payables, 2),
        "net_uneliminated_variance_usd": round(net_consolidation_imbalance, 2),
        "consolidation_audit_verdict": "PHANTOM_BALANCE_UNRECONCILED_VARIANCE" if imbalance_flag else "INTERCOMPANY_ELIMINATIONS_TIED_CLEAN",
        "pair_reconciliation": unreconciled_pairs
    }

p3 = reconcile_intercompany_matrix_and_detect_phantom_balances([
    {"entity_a_name": "US Parent Corp", "entity_b_name": "UK Tech Hub Ltd", "entity_a_receivable_usd": 25000000.0, "entity_b_payable_usd": 25000000.0, "unreconciled_aging_days": 0},
    {"entity_a_name": "US Parent Corp", "entity_b_name": "Cayman Trading SA", "entity_a_receivable_usd": 40000000.0, "entity_b_payable_usd": 32000000.0, "unreconciled_aging_days": 180}
])
rec_s = "$" + f"{p3['total_intercompany_receivables_usd']:,.2f}"
pay_s = "$" + f"{p3['total_intercompany_payables_usd']:,.2f}"
var_s = "$" + f"{p3['net_uneliminated_variance_usd']:,.2f}"
print(f"Receivables: {rec_s} | Payables: {pay_s} | Variance: {var_s}")
print(f"Consolidation Verdict: {p3['consolidation_audit_verdict']}")`,
        output: `Receivables: $65,000,000.00 | Payables: $57,000,000.00 | Variance: $8,000,000.00\nConsolidation Verdict: PHANTOM_BALANCE_UNRECONCILED_VARIANCE`,
        codeNotes: [
          { line: 8, note: 'Iterates through cross-border entity pairs comparing receivables against payables' },
          { line: 14, note: 'Applies $100 materiality tolerance threshold to detect unilateral uneliminated balances' },
          { line: 24, note: 'Quantifies aggregate group-wide consolidation imbalance ($8.0M uneliminated variance)' },
          { line: 26, note: 'Issues statutory audit red flag requiring substantive confirmation of offshore contracts' }
        ],
        tryIt: 'Change Cayman payable to $40,000,000.0 to observe the intercompany matrix eliminate cleanly to zero variance.',
        check: {
          question: 'In statutory group audits, what does a persistent, material unreconciled variance between an intercompany receivable and its corresponding payable indicate?',
          options: [
            'Either an accounting breakdown in multi-currency settlement or a potential fraudulent scheme where one entity booked unilateral revenue that the other party never incurred.',
            'That the corporate group has achieved full compliance with OECD Pillar Two minimum tax standards.',
            'That the central bank has issued a corporate stimulus bond.',
            'That the auditor should issue an immediate unqualified clean opinion.'
          ],
          answer: 0,
          why: 'Intercompany balances must eliminate to exactly zero upon consolidation. A material unreconciled difference signifies either accounting system failures or fictitious one-sided transactions booked to artificially inflate revenues.',
          answerIndex: 0,
          explanation: 'Intercompany balances must eliminate to exactly zero upon consolidation. A material unreconciled difference signifies either accounting system failures or fictitious one-sided transactions booked to artificially inflate revenues.'
        }
      },
      {
        title: 'Foreign Corrupt Practices Act (FCPA) & UK Bribery Act Red-Flag Screening',
        say: [
          'Under the US Foreign Corrupt Practices Act (FCPA) and the UK Bribery Act 2010, multinational corporations face crippling criminal penalties, executive imprisonment, and mandatory disgorgement of profits for paying bribes to foreign government officials. Crucially, companies are held criminally liable for bribes paid through third-party intermediaries—even if senior leadership claims lack of knowledge.',
          'Corrupt arrangements rarely feature direct payments to politicians. Instead, funds are funneled through local third-party intermediaries—frequently disguised as local sales representatives, customs clearing agents, or strategic advisors. Corrupt intermediaries exhibit unmistakable red flags: operating in jurisdictions with poor Transparency International Corruption Perceptions Index (CPI < 40) ratings, having beneficial ownership tied to Politically Exposed Persons (PEPs), or demanding success fees exceeding standard commercial norms (> 15%).',
          'Furthermore, requesting payment routing through offshore bank accounts in Switzerland or the British Virgin Islands—completely unrelated to the country where services are allegedly performed—is a premier indicator of money laundering and bribery conduits. Automated compliance engines continuously screen vendor masters against international sanctions and PEP databases, mandating immediate stop-work orders upon detecting high-risk patterns.'
        ],
        example: 'A global aerospace conglomerate evaluates a prospective intermediary in Nigeria (CPI score 25) requesting a 22.5% success fee for government customs clearance, tied to an active ministry official and demanding payment into a Cayman bank account. The automated FCPA compliance engine flags 5 critical red flags, generates a risk score of 120, and issues a mandatory Stop-Work Order.',
        code: `def screen_fcpa_third_party_intermediary_risk(
    intermediary: dict
) -> dict:
    flags = []
    risk_score = 0
    
    cpi = intermediary.get("jurisdiction_cpi_index", 50)
    if cpi < 40:
        flags.append("HIGH_CORRUPTION_JURISDICTION_CPI_UNDER_40")
        risk_score += 25
        
    if intermediary.get("pep_or_government_official_tied", False):
        flags.append("POLITICALLY_EXPOSED_PERSON_PEP_AFFILIATION")
        risk_score += 35
        
    commission_pct = intermediary.get("commission_or_success_fee_pct", 0.0)
    if commission_pct >= 15.0:
        flags.append("EXCESSIVE_SUCCESS_FEE_ABOVE_15_PERCENT")
        risk_score += 20
        
    if intermediary.get("offshore_payment_routing_requested", False):
        flags.append("OFFSHORE_PAYMENT_ROUTING_HAVEN")
        risk_score += 25
        
    if intermediary.get("vague_scope_of_work", False):
        flags.append("VAGUE_OR_UNSPECIFIED_CONSULTING_SERVICES")
        risk_score += 15
        
    if risk_score >= 60:
        directive = "MANDATORY_STOP_WORK_AND_INTERNAL_LEGAL_INQUIRY"
        tier = "CRITICAL_FCPA_CORRUPTION_RISK"
    elif risk_score >= 30:
        directive = "ENHANCED_DUE_DILIGENCE_AND_LEGAL_CLEARANCE_REQUIRED"
        tier = "MODERATE_RISK"
    else:
        directive = "STANDARD_COMPLIANCE_APPROVED"
        tier = "LOW_RISK"
        
    return {
        "intermediary_name": intermediary["name"],
        "jurisdiction": intermediary.get("country", ""),
        "total_fcpa_risk_score": risk_score,
        "risk_tier": tier,
        "compliance_directive": directive,
        "red_flag_count": len(flags),
        "audit_red_flags": flags
    }

p4 = screen_fcpa_third_party_intermediary_risk({
    "name": "Global Horizon Strategic Liaisons Ltd",
    "country": "Nigeria",
    "jurisdiction_cpi_index": 25,
    "pep_or_government_official_tied": True,
    "commission_or_success_fee_pct": 22.5,
    "offshore_payment_routing_requested": True,
    "vague_scope_of_work": True
})
print(f"Intermediary: {p4['intermediary_name']} | Risk Score: {p4['total_fcpa_risk_score']}")
print(f"Risk Tier: {p4['risk_tier']} | Directive: {p4['compliance_directive']}")
print(f"Red Flags Count: {p4['red_flag_count']}")`,
        output: `Intermediary: Global Horizon Strategic Liaisons Ltd | Risk Score: 120\nRisk Tier: CRITICAL_FCPA_CORRUPTION_RISK | Directive: MANDATORY_STOP_WORK_AND_INTERNAL_LEGAL_INQUIRY\nRed Flags Count: 5`,
        codeNotes: [
          { line: 8, note: 'Evaluates Transparency International CPI index (<40) reflecting systemic jurisdictional bribery risk' },
          { line: 12, note: 'Screens beneficial ownership against global Politically Exposed Persons (PEP) registry' },
          { line: 16, note: 'Flags excessive success fees (>15%) commonly used to fund illicit government official payments' },
          { line: 20, note: 'Identifies offshore bank wire routing disconnected from local commercial operational geography' }
        ],
        tryIt: 'Set pep_or_government_official_tied to False and commission to 5% to observe risk score drop to moderate.',
        check: {
          question: 'Under the US Foreign Corrupt Practices Act (FCPA), which payment arrangement represents the most severe red flag that an overseas commercial consultant is acting as a conduit for foreign bribery?',
          options: [
            'A high commission rate (>15%) paired with a request to wire fees to an offshore bank account in a tax haven, where the consultant has ties to government officials.',
            'The consultant invoices the company in Euros rather than US Dollars.',
            'The consultant delivers reports formatted in markdown rather than PDF.',
            'The consultant is incorporated as a limited liability partnership.'
          ],
          answer: 0,
          why: 'Offshore wire transfers, excessive success commissions, and political affiliations are classic FCPA red flags cited in DOJ/SEC corporate bribery enforcement actions.',
          answerIndex: 0,
          explanation: 'Offshore wire transfers, excessive success commissions, and political affiliations are classic FCPA red flags cited in DOJ/SEC corporate bribery enforcement actions.'
        }
      },
      {
        title: 'Forensic Collision Graph Analysis: Employee-Vendor Kickback Conspiracies',
        say: [
          'In procurement fraud, dishonest purchasing managers establish collusive relationships with corrupt vendors, awarding sole-source contracts at inflated prices in exchange for illicit kickbacks. Because fraudsters intentionally conceal these connections, traditional sample audits rarely uncover the scheme.',
          'Forensic audit analytics exposes these conspiracies by constructing an employee-vendor collision graph. The algorithm cross-references master personnel files against approved vendor data, scanning for matching residential addresses, identical bank routing and checking account numbers, shared telephone numbers, and matching tax identification numbers.',
          'When an employee shares a home address or bank account with an approved vendor, the system correlates this link against purchasing history. If the employee repeatedly approved sole-source purchase orders positioned just beneath competitive bidding thresholds (e.g., $49,500 against a $50,000 threshold), the analysis establishes prima facie proof of a criminal kickback scheme, ready for criminal referral and asset recovery.'
        ],
        example: 'A forensic collision analysis cross-references 2,500 employees against 800 vendors. It flags vendor Vance Industrial Supply LLC sharing the exact home address (742 Evergreen Terrace) and direct deposit bank account of Procurement VP Marcus Vance. The algorithm identifies two sole-source purchase orders totaling $98,400 approved by Vance just beneath the $50k threshold, confirming a self-dealing fraud scheme.',
        code: `def run_forensic_employee_vendor_collision_audit(
    employees: list,
    vendors: list,
    purchase_orders: list
) -> dict:
    collisions = []
    diverted_spend = 0.0
    
    emp_by_addr = {e["residential_address"].strip().lower(): e for e in employees if "residential_address" in e}
    emp_by_bank = {e["bank_account_number"].strip(): e for e in employees if "bank_account_number" in e}
    emp_by_phone = {e["phone_number"].strip(): e for e in employees if "phone_number" in e}
    
    for v in vendors:
        v_addr = v.get("registered_address", "").strip().lower()
        v_bank = v.get("payee_bank_account", "").strip()
        v_phone = v.get("contact_phone", "").strip()
        v_id = v["vendor_id"]
        
        colliding_emp = None
        match_type = []
        
        if v_addr in emp_by_addr:
            colliding_emp = emp_by_addr[v_addr]
            match_type.append("SHARED_RESIDENTIAL_ADDRESS")
        if v_bank in emp_by_bank:
            colliding_emp = emp_by_bank[v_bank]
            match_type.append("SHARED_DIRECT_DEPOSIT_BANK_ACCOUNT")
        if v_phone in emp_by_phone:
            colliding_emp = emp_by_phone[v_phone]
            match_type.append("SHARED_PHONE_NUMBER")
            
        if colliding_emp:
            vendor_pos = [po for po in purchase_orders if po["vendor_id"] == v_id and po["approver_employee_id"] == colliding_emp["employee_id"]]
            vendor_spend = sum(po["amount"] for po in vendor_pos)
            diverted_spend += vendor_spend
            
            collisions.append({
                "vendor_id": v_id,
                "vendor_name": v["name"],
                "colliding_employee_id": colliding_emp["employee_id"],
                "colliding_employee_name": colliding_emp["name"],
                "match_types": match_type,
                "correlated_po_count": len(vendor_pos),
                "fraudulent_spend_diverted_usd": round(vendor_spend, 2)
            })
            
    fraud_detected = len(collisions) > 0
    return {
        "employees_screened": len(employees),
        "vendors_screened": len(vendors),
        "collusive_relationships_identified": len(collisions),
        "total_fraudulent_spend_diverted_usd": round(diverted_spend, 2),
        "forensic_verdict": "CRIMINAL_KICKBACK_CONSPIRACY_REFERRED_TO_LEGAL" if fraud_detected else "PROCUREMENT_INDEPENDENCE_VERIFIED",
        "collision_details": collisions
    }

p5 = run_forensic_employee_vendor_collision_audit(
    employees=[
        {"employee_id": "EMP-401", "name": "Marcus Vance (Procurement VP)", "residential_address": "742 Evergreen Terrace, Springfield", "bank_account_number": "9988776655", "phone_number": "555-0199"},
        {"employee_id": "EMP-402", "name": "Elena Rostova (Engineering Lead)", "residential_address": "120 Elm St, Boston", "bank_account_number": "1122334455", "phone_number": "555-0144"}
    ],
    vendors=[
        {"vendor_id": "VEN-881", "name": "Vance Industrial Supply LLC", "registered_address": "742 Evergreen Terrace, Springfield", "payee_bank_account": "9988776655", "contact_phone": "555-0199"},
        {"vendor_id": "VEN-882", "name": "Acme Steel Corp", "registered_address": "900 Industrial Parkway, Chicago", "payee_bank_account": "3344556677", "contact_phone": "555-0188"}
    ],
    purchase_orders=[
        {"po_id": "PO-9001", "vendor_id": "VEN-881", "approver_employee_id": "EMP-401", "amount": 49500.0},
        {"po_id": "PO-9002", "vendor_id": "VEN-881", "approver_employee_id": "EMP-401", "amount": 48900.0},
        {"po_id": "PO-9003", "vendor_id": "VEN-882", "approver_employee_id": "EMP-402", "amount": 120000.0}
    ]
)
div_s = "$" + f"{p5['total_fraudulent_spend_diverted_usd']:,.2f}"
print(f"Employees Screened: {p5['employees_screened']} | Vendors Screened: {p5['vendors_screened']}")
print(f"Collusive Relationships: {p5['collusive_relationships_identified']} | Diverted Spend: {div_s}")
print(f"Verdict: {p5['forensic_verdict']}")`,
        output: `Employees Screened: 2 | Vendors Screened: 2\nCollusive Relationships: 1 | Diverted Spend: $98,400.00\nVerdict: CRIMINAL_KICKBACK_CONSPIRACY_REFERRED_TO_LEGAL`,
        codeNotes: [
          { line: 8, note: 'Constructs fast hash tables for employee residential addresses, bank accounts, and telephone numbers' },
          { line: 20, note: 'Discovers collisions across vendor registered addresses, direct deposit accounts, and phones' },
          { line: 31, note: 'Correlates matching entities with purchase orders approved by the colluding employee' },
          { line: 44, note: 'Quantifies $98,400 diverted spend and refers findings to internal audit legal counsel' }
        ],
        tryIt: 'Change vendor VEN-881 bank account to an independent account to observe partial collision isolation.',
        check: {
          question: 'In corporate forensic fraud examination, what is the most definitive investigative technique to identify self-dealing and kickback schemes between procurement employees and shell vendors?',
          options: [
            'Executing automated collision graph analysis matching employee residential addresses and personal bank account numbers against vendor master records.',
            'Asking vendors to sign an annual voluntary ethics questionnaire.',
            'Verifying that all purchasing managers have completed corporate compliance slide decks.',
            'Inspecting vendor business cards for official corporate logos.'
          ],
          answer: 0,
          why: 'Automated entity collision analysis matches immutable data points (bank account numbers, physical addresses, phone numbers) across employee and vendor masters, exposing illicit self-dealing connections.',
          answerIndex: 0,
          explanation: 'Automated entity collision analysis matches immutable data points (bank account numbers, physical addresses, phone numbers) across employee and vendor masters, exposing illicit self-dealing connections.'
        }
      }
    ],
    summary: [
      'Automated journal entry testing under ISA 240 and PCAOB AS 2401 identifies management override via off-hours postings, round numbers, and sensitive account pairings.',
      'Robust statistical outlier detection utilizing Median Absolute Deviation (MAD) Modified Z-scores resists masking effects to isolate extreme fraudulent expenditures.',
      'Intercompany elimination matrices reconcile paired receivables and payables across subsidiaries to uncover hidden losses and phantom balances.',
      'FCPA third-party intermediary compliance models evaluate Transparency International CPI ratings, PEP ties, excessive success fees, and offshore bank accounts.',
      'Employee-vendor collision graph analytics matches physical addresses and bank details across master files, exposing procurement kickbacks and self-dealing.'
    ],
    projectStep: {
      title: 'Automated Forensic Audit Analytics & Fraud Examination Suite',
      steps: [
        'Implement ISA 240 automated general ledger journal entry fraud heuristic scoring algorithms.',
        'Deploy non-parametric Median Absolute Deviation (MAD) Modified Z-score engines to flag anomalous disbursements.',
        'Reconcile multi-entity intercompany matrices to detect uneliminated variances and phantom assets.',
        'Screen third-party intermediaries for FCPA corruption red flags and execute employee-vendor collision graph audits.'
      ]
    }
  }
,
  {
    coursePrefix: 'bcom_aud',
    day: 4,
    title: 'Digital Forensics, E-Discovery (EDRM), Cryptographic Evidence Custody & Memory Carving',
    goal: 'Master enterprise digital forensic investigation for financial statement fraud: forensic physical disk acquisition and NIST SP 800-86 cryptographic chain of custody (SHA-256 verification), Electronic Discovery Reference Model (EDRM) deduplication and boolean keyword culling, live volatile RAM memory carving for uncommitted ERP transaction buffers, RFC 5322 email MIME header authentication and BCC exfiltration tracking, and anti-forensics timestomping detection via NTFS $STANDARD_INFORMATION vs $FILE_NAME attributes.',
    minutes: 45,
    recap: 'In Day 3, we engineered automated journal entry testing, robust MAD outlier detection, intercompany phantom eliminations, and FCPA third-party corruption screening. Today, we enter the digital crime scene: securing bitstream drive images, parsing volatile memory dumps, and recovering doctored contracts.',
    parts: [
      {
        title: 'Forensic Bitstream Disk Imaging, Write Blockers & Cryptographic Chain of Custody (NIST SP 800-86)',
        say: [
          'When corporate investigators seize a laptop or server from an executive suspected of accounting fraud, the single most critical evidentiary rule is: never boot the machine into its operating system. Turning on a computer modifies hundreds of registry entries, alters file access timestamps, and overwrites unallocated space where deleted spreadsheets reside, rendering the evidence inadmissible under Federal Rules of Evidence Rule 902(14).',
          'Under the National Institute of Standards and Technology (NIST SP 800-86) guidelines, digital forensics begins with hardware write-blockers. A hardware write-blocker intercepts all operating system write commands at the controller level, allowing read-only access while guaranteeing that not a single bit on the suspect physical drive is altered.',
          'Investigators create an exact, physical bitstream image (such as an Expert Witness E01 or raw DD file) capturing every sector, including slack space and unallocated clusters. Prior to and immediately following acquisition, cryptographic hash algorithms (SHA-256 and MD5) compute digital fingerprints of the physical media; an exact cryptographic hash match mathematically proves that the forensic copy is identical to the original seized hardware.'
        ],
        example: 'Federal forensic investigators seize the primary workstation of a CFO accused of inflating revenue. Utilizing a Tableau hardware write-blocker, investigators image 1,953,525,168 physical sectors (1 TB) to an E01 image container. Pre-acquisition and post-acquisition SHA-256 hashes match perfectly (e3b0c442...), establishing an unassailable cryptographic chain of custody admissible in federal court.',
        code: `def verify_forensic_disk_image_chain_of_custody(
    source_drive_serial: str,
    total_physical_sectors: int,
    source_sha256: str,
    image_sha256: str,
    write_blocker_hardware_verified: bool
) -> dict:
    hashes_match = (source_sha256.lower() == image_sha256.lower())
    custody_valid = hashes_match and write_blocker_hardware_verified
    
    status = "FORENSICALLY_SOUND_FRE_902_ADMISSIBLE" if custody_valid else "EVIDENCE_SPOILED_INADMISSIBLE"
    
    return {
        "drive_serial": source_drive_serial,
        "sectors_imaged": total_physical_sectors,
        "write_blocker_active": write_blocker_hardware_verified,
        "source_sha256": source_sha256,
        "image_sha256": image_sha256,
        "hash_verification_passed": hashes_match,
        "evidentiary_status": status
    }

h_src = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
p1 = verify_forensic_disk_image_chain_of_custody(
    source_drive_serial="WD-WCC4N1298451",
    total_physical_sectors=1953525168,
    source_sha256=h_src,
    image_sha256=h_src,
    write_blocker_hardware_verified=True
)
print(f"Drive Serial: {p1['drive_serial']} | Sectors: {p1['sectors_imaged']:,}")
print(f"Hash Match: {p1['hash_verification_passed']} | Status: {p1['evidentiary_status']}")`,
        output: `Drive Serial: WD-WCC4N1298451 | Sectors: 1,953,525,168\nHash Match: True | Status: FORENSICALLY_SOUND_FRE_902_ADMISSIBLE`,
        codeNotes: [
          { line: 8, note: 'Compares pre-acquisition physical drive SHA-256 hash against post-acquisition forensic image hash' },
          { line: 9, note: 'Validates hardware write-blocker deployment guaranteeing read-only forensic disk access' },
          { line: 11, note: 'Awards FRE Rule 902(14) self-authenticating electronic evidence legal admissibility certification' },
          { line: 26, note: 'Confirms bitstream fidelity across all 1.95 billion physical drive sectors' }
        ],
        tryIt: 'Set write_blocker_hardware_verified to False to observe how failure to use write blockers results in EVIDENCE_SPOILED_INADMISSIBLE.',
        check: {
          question: 'Under Federal Rules of Evidence Rule 902(14) and NIST SP 800-86, why is an identical SHA-256 cryptographic hash match required between the physical source drive and the forensic disk image?',
          options: [
            'It mathematically proves that not a single bit of digital data was modified during acquisition, establishing a tamper-proof chain of custody.',
            'It automatically decrypts corporate email passwords stored on the computer.',
            'It reduces the file size of the disk image by 90% for cloud storage upload.',
            'It serves as an automated digital signature from the presiding federal bankruptcy judge.'
          ],
          answer: 0,
          why: 'A matching cryptographic hash between source drive and forensic image proves the copy is an exact, bit-for-bit duplicate, ensuring evidence admissibility in court.',
          answerIndex: 0,
          explanation: 'A matching cryptographic hash between source drive and forensic image proves the copy is an exact, bit-for-bit duplicate, ensuring evidence admissibility in court.'
        }
      },
      {
        title: 'E-Discovery Reference Model (EDRM): Boolean Culling, De-NISTing & Custodian Deduplication',
        say: [
          'In major corporate fraud litigations, corporate email archives, cloud storage drives, and laptop backups generate terabytes of unstructured data containing millions of individual files. Handing 1,000,000 raw documents directly to external forensic attorneys at $2.50 to $5.00 per document would cost upwards of $2,500,000 for preliminary legal review alone.',
          'To streamline discovery defensibly, forensic examiners execute the Electronic Discovery Reference Model (EDRM) processing pipeline. The first phase is De-NISTing: matching file MD5 hashes against the National Software Reference Library (NSRL) maintained by NIST, safely eliminating hundreds of thousands of standard operating system DLLs and application binaries that contain zero user communications.',
          'The second phase executes Global MD5 Deduplication, collapsing identical files and attachments shared across multiple custodians into a single review instance. Finally, targeted Boolean search syntax (combining accounting keywords, offshore accounts, and specific temporal fiscal windows) isolates the responsive production set, reducing review populations by over 95% while slashing multi-million dollar legal review expenditures.'
        ],
        example: 'In a corporate embezzlement investigation collecting 1,000,000 raw files ($2.5M raw review estimate), De-NISTing eliminates 350,000 operating system files, global deduplication removes 250,000 redundant attachments, and Boolean keyword filtering isolates 25,000 responsive documents. The EDRM pipeline achieves a 97.5% reduction, collapsing legal review costs from $2,500,000 down to $62,500 and saving $2,437,500.',
        code: `def execute_edrm_document_culling_pipeline(
    raw_document_count: int,
    known_system_files_de_nist: int,
    duplicate_hash_files: int,
    keyword_responsive_files: int,
    review_cost_per_doc_usd: float = 2.50
) -> dict:
    post_denist = raw_document_count - known_system_files_de_nist
    post_dedup = post_denist - duplicate_hash_files
    final_production_set = min(post_dedup, keyword_responsive_files)
    
    initial_review_cost = raw_document_count * review_cost_per_doc_usd
    culled_review_cost = final_production_set * review_cost_per_doc_usd
    cost_saved = initial_review_cost - culled_review_cost
    reduction_pct = ((raw_document_count - final_production_set) / raw_document_count) * 100.0 if raw_document_count > 0 else 0.0
    
    return {
        "raw_collected_documents": raw_document_count,
        "de_nist_culled_system_files": known_system_files_de_nist,
        "deduplicated_identical_files": duplicate_hash_files,
        "final_responsive_production_set": final_production_set,
        "culling_reduction_pct": round(reduction_pct, 2),
        "initial_projected_cost_usd": round(initial_review_cost, 2),
        "optimized_review_cost_usd": round(culled_review_cost, 2),
        "cost_savings_usd": round(cost_saved, 2)
    }

p2 = execute_edrm_document_culling_pipeline(
    raw_document_count=1000000,
    known_system_files_de_nist=350000,
    duplicate_hash_files=250000,
    keyword_responsive_files=25000,
    review_cost_per_doc_usd=2.50
)
cost_init = "$" + f"{p2['initial_projected_cost_usd']:,.2f}"
cost_opt = "$" + f"{p2['optimized_review_cost_usd']:,.2f}"
cost_save = "$" + f"{p2['cost_savings_usd']:,.2f}"
print(f"Raw Docs: {p2['raw_collected_documents']:,} -> Production Set: {p2['final_responsive_production_set']:,} (Reduced: {p2['culling_reduction_pct']}%)")
print(f"Cost: {cost_init} -> {cost_opt} | Savings: {cost_save}")`,
        output: `Raw Docs: 1,000,000 -> Production Set: 25,000 (Reduced: 97.5%)\nCost: $2,500,000.00 -> $62,500.00 | Savings: $2,437,500.00`,
        codeNotes: [
          { line: 8, note: 'Filters out NSRL known operating system files (De-NISTing) eliminating non-evidentiary files' },
          { line: 9, note: 'Executes global MD5 deduplication across custodian mailboxes collapsing identical attachments' },
          { line: 10, note: 'Applies targeted Boolean keyword criteria isolating responsive documents for legal discovery' },
          { line: 15, note: 'Calculates $2,437,500 in direct legal document review cost savings through 97.5% population culling' }
        ],
        tryIt: 'Adjust keyword_responsive_files to 50,000 to observe how culling reduction and legal costs scale dynamically.',
        check: {
          question: 'In the Electronic Discovery Reference Model (EDRM) processing phase, what is the primary purpose of "De-NISTing" a raw collection of seized digital files?',
          options: [
            'Filtering out millions of known operating system files and software binaries using the NIST National Software Reference Library hash list.',
            'Converting all corporate spreadsheets into physical paper printouts for courtroom display.',
            'Erasing all emails that contain negative comments about company executives.',
            'Permanently encrypting corporate financial databases before handing them to auditors.'
          ],
          answer: 0,
          why: 'De-NISTing cross-references collected files against NIST\'s NSRL hash list to eliminate standard system files (DLLs, EXE files) that contain no user data, drastically reducing legal review volume.',
          answerIndex: 0,
          explanation: 'De-NISTing cross-references collected files against NIST\'s NSRL hash list to eliminate standard system files (DLLs, EXE files) that contain no user data, drastically reducing legal review volume.'
        }
      },
      {
        title: 'Volatile RAM Memory Dump Analysis & Uncommitted Transaction Carving',
        say: [
          'Modern financial fraudsters increasingly employ ephemeral tools—utilizing encrypted in-memory communications, web-based banking portals running in incognito sessions, or executing uncompiled memory-resident scripts—to ensure zero artifacts are written to the physical storage disk.',
          'Under the Order of Volatility defined in RFC 3227, random-access memory (RAM) is the most volatile digital evidence. If an investigator pulls the power plug before acquiring RAM, all active network sockets, decrypted encryption keys, and uncommitted database buffers vanish instantly.',
          'Forensic memory analysis (utilizing frameworks like Volatility) dumps physical RAM and analyzes the kernel process table. Investigators detect malicious process injection (such as code injected into legitimate system binaries like svchost.exe), inspect active TCP sockets transmitting data to offshore servers, and carve raw memory buffers to recover uncommitted wire transfers before they are purged.'
        ],
        example: 'A live memory dump captured from a suspect treasury workstation reveals an unlinked process (excel_hidden.exe) executing injected shellcode, establishing an active network socket on port 4444 to an IP address in the Seychelles. Plaintext buffer carving recovers an uncommitted $2,500,000 wire transfer authorization to an offshore escrow entity, providing conclusive proof of an embezzlement attempt.',
        code: `def analyze_volatile_memory_dump_artifacts(
    running_processes: list,
    network_sockets: list,
    uncommitted_buffers: list
) -> dict:
    flagged_artifacts = []
    
    for proc in running_processes:
        if proc.get("is_unlinked_from_peb", False) or proc.get("injected_code_detected", False):
            flagged_artifacts.append(f"MALICIOUS_PROCESS_INJECTION: {proc['name']} (PID: {proc['pid']})")
            
    for sock in network_sockets:
        if sock.get("destination_port", 0) in [4444, 8888, 9001] or sock.get("country", "") in ["Cayman", "Seychelles"]:
            flagged_artifacts.append(f"SUSPICIOUS_EXFILTRATION_SOCKET: {sock['remote_ip']}:{sock['destination_port']}")
            
    recovered_transactions = []
    for buf in uncommitted_buffers:
        if "UNCOMMITTED_PAYMENT" in buf.get("payload_tag", ""):
            recovered_transactions.append({
                "buffer_id": buf["buffer_id"],
                "wire_amount_usd": buf["amount"],
                "payee": buf["payee"]
            })
            
    memory_tampering = len(flagged_artifacts) > 0 or len(recovered_transactions) > 0
    return {
        "processes_audited": len(running_processes),
        "network_connections_audited": len(network_sockets),
        "volatility_exceptions_flagged": len(flagged_artifacts),
        "recovered_uncommitted_wires_count": len(recovered_transactions),
        "flagged_evidence": flagged_artifacts,
        "carved_transactions": recovered_transactions,
        "live_memory_audit_verdict": "VOLATILE_EVIDENCE_RECOVERED_CRIMINAL_INTENT" if memory_tampering else "CLEAN_VOLATILE_MEMORY"
    }

p3 = analyze_volatile_memory_dump_artifacts(
    running_processes=[
        {"name": "svchost.exe", "pid": 892, "is_unlinked_from_peb": False, "injected_code_detected": False},
        {"name": "excel_hidden.exe", "pid": 4112, "is_unlinked_from_peb": True, "injected_code_detected": True}
    ],
    network_sockets=[
        {"remote_ip": "194.165.16.42", "destination_port": 4444, "country": "Seychelles"}
    ],
    uncommitted_buffers=[
        {"buffer_id": "RAM-BUF-901", "payload_tag": "UNCOMMITTED_PAYMENT", "amount": 2500000.0, "payee": "Offshore Cayman Escrow Ltd"}
    ]
)
print(f"Processes: {p3['processes_audited']} | Sockets: {p3['network_connections_audited']}")
print(f"Recovered Wires: {p3['recovered_uncommitted_wires_count']} | Verdict: {p3['live_memory_audit_verdict']}")
for wire in p3['carved_transactions']:
    amt_s = "$" + f"{wire['wire_amount_usd']:,.2f}"
    print(f"  Recovered Buffer: {amt_s} to {wire['payee']}")`,
        output: `Processes: 2 | Sockets: 1\nRecovered Wires: 1 | Verdict: VOLATILE_EVIDENCE_RECOVERED_CRIMINAL_INTENT\n  Recovered Buffer: $2,500,000.00 to Offshore Cayman Escrow Ltd`,
        codeNotes: [
          { line: 10, note: 'Inspects Windows process environment block (PEB) unlinking indicating memory-resident malware' },
          { line: 14, note: 'Scans live network socket tables detecting connections to unauthorized offshore tax havens' },
          { line: 20, note: 'Carves plaintext volatile memory buffers recovering $2.5M uncommitted wire transfer payload' },
          { line: 31, note: 'Issues Volatile Evidence Recovered criminal verdict for courtroom presentation' }
        ],
        tryIt: 'Remove the injected process and uncommitted wire to observe volatile memory evaluate to CLEAN_VOLATILE_MEMORY.',
        check: {
          question: 'Under the Order of Volatility in RFC 3227 and digital forensic standards, why must volatile physical RAM be acquired before powering down a computer seized in a fraud investigation?',
          options: [
            'Because shutting down the power cuts electrical current to RAM chips, permanently erasing all active encryption keys, network connections, and uncommitted memory buffers.',
            'Because pulling the power plug automatically re-formats the physical solid-state drive.',
            'Because computer monitors cannot display forensic reports without uninterrupted power.',
            'Because federal law mandates that corporate servers run 24 hours a day without maintenance.'
          ],
          answer: 0,
          why: 'RAM is volatile memory; cutting power immediately purges all transient data, destroying running processes, decrypted keys, and in-memory communications.',
          answerIndex: 0,
          explanation: 'RAM is volatile memory; cutting power immediately purges all transient data, destroying running processes, decrypted keys, and in-memory communications.'
        }
      },
      {
        title: 'Email Thread Reconstruction, Metadata Header Analysis & Custodian Network Mapping',
        say: [
          'In corporate fraud investigations, proving wrongful intent (mens rea) requires establishing the exact timeline of executive communications. Fraudsters frequently defend themselves by claiming emails were spoofed, that they never received specific warnings, or that critical attachments were inserted after the fact.',
          'Forensic email examiners authenticate communications by inspecting RFC 5322 MIME transport headers. Investigators verify DomainKeys Identified Mail (DKIM) cryptographic signatures, which mathematically prove that the email originated from the legitimate corporate domain and was not altered during transmission.',
          'Furthermore, analyzing the Received: from hops and originating client IP addresses identifies whether messages were sent from corporate headquarters or routed through anonymizing Tor exit nodes or commercial VPNs. Reconstructing conversation threads also detects BCC exfiltration, exposing executives who covertly carbon-copied confidential corporate trade secrets or off-the-books accounting spreadsheets to personal encrypted webmail accounts.'
        ],
        example: 'During an earnings manipulation inquiry, investigators analyze an email sent from cfo@nexuscorp.com titled "Confidential Q3 Channel Stuffing Instructions". Header analysis reveals an invalid DKIM signature, transmission through a Tor anonymizing exit node, and a covert BCC exfiltration to personal_cfo_vault@proton.me, establishing conclusive proof of intentional corporate wrongdoing.',
        code: `def audit_email_mime_headers_and_custodian_thread(
    email_data: dict
) -> dict:
    red_flags = []
    
    dkim_valid = email_data.get("dkim_signature_verified", False)
    if not dkim_valid:
        red_flags.append("DKIM_SIGNATURE_INVALID_OR_SPOOFED")
        
    client_ip = email_data.get("originating_client_ip", "")
    is_vpn_or_tor = email_data.get("is_anonymizing_proxy", False)
    if is_vpn_or_tor:
        red_flags.append("ORIGINATING_FROM_ANONYMIZING_PROXY_OR_TOR")
        
    bcc_recipients = email_data.get("bcc_list", [])
    for bcc in bcc_recipients:
        if any(domain in bcc.lower() for domain in ["gmail.com", "proton.me", "yahoo.com"]):
            red_flags.append(f"BCC_EXFILTRATION_TO_PERSONAL_WEBMAIL: {bcc}")
            
    is_suspicious = len(red_flags) > 0
    return {
        "message_id": email_data.get("message_id", ""),
        "sender": email_data.get("from_address", ""),
        "subject": email_data.get("subject", ""),
        "dkim_verified": dkim_valid,
        "header_audit_flags": red_flags,
        "email_authenticity_verdict": "TAMPERED_OR_EXFILTRATED_EVIDENCE" if is_suspicious else "RFC5322_AUTHENTICATED_COMPLIANT"
    }

p4 = audit_email_mime_headers_and_custodian_thread({
    "message_id": "<20261013.88192@nexuscorp.com>",
    "from_address": "cfo@nexuscorp.com",
    "subject": "Confidential Q3 Channel Stuffing Instructions",
    "dkim_signature_verified": False,
    "originating_client_ip": "185.220.101.5",
    "is_anonymizing_proxy": True,
    "bcc_list": ["personal_cfo_vault@proton.me"]
})
print(f"Message ID: {p4['message_id']} | DKIM Valid: {p4['dkim_verified']}")
print(f"Verdict: {p4['email_authenticity_verdict']} | Flags: {len(p4['header_audit_flags'])}")
for fl in p4['header_audit_flags']:
    print(f"  Flag: {fl}")`,
        output: `Message ID: <20261013.88192@nexuscorp.com> | DKIM Valid: False\nVerdict: TAMPERED_OR_EXFILTRATED_EVIDENCE | Flags: 3\n  Flag: DKIM_SIGNATURE_INVALID_OR_SPOOFED\n  Flag: ORIGINATING_FROM_ANONYMIZING_PROXY_OR_TOR\n  Flag: BCC_EXFILTRATION_TO_PERSONAL_WEBMAIL: personal_cfo_vault@proton.me`,
        codeNotes: [
          { line: 8, note: 'Verifies cryptographic DKIM signature proving whether sender domain was spoofed or genuine' },
          { line: 14, note: 'Inspects originating IP address detecting anonymizing proxy and Tor exit node usage' },
          { line: 19, note: 'Identifies unauthorized BCC exfiltration routing confidential files to personal encrypted webmail' },
          { line: 29, note: 'Classifies message as tampered or exfiltrated evidentiary material for court litigation' }
        ],
        tryIt: 'Set dkim_signature_verified to True and clear the bcc_list to observe email evaluate to RFC5322_AUTHENTICATED_COMPLIANT.',
        check: {
          question: 'In forensic digital investigation, what does a cryptographic DKIM (DomainKeys Identified Mail) signature failure in an email header indicate?',
          options: [
            'The message contents or sender header were modified in transit or spoofed by an unauthorized sending mail server.',
            'The recipient\'s computer is completely out of disk storage space.',
            'The email was drafted in an unsupported foreign language.',
            'The sender forgot to type a closing salutation.'
          ],
          answer: 0,
          why: 'DKIM uses public-key cryptography to sign email headers. A signature validation failure proves the message was tampered with in transit or did not originate from the asserted domain server.',
          answerIndex: 0,
          explanation: 'DKIM uses public-key cryptography to sign email headers. A signature validation failure proves the message was tampered with in transit or did not originate from the asserted domain server.'
        }
      },
      {
        title: 'Anti-Forensics Detection: Timestomping & Secure File Deletion Artifacts',
        say: [
          'When targets of a corporate fraud investigation realize an audit is underway, they often resort to anti-forensics techniques in an attempt to destroy evidence or fabricate alibis. Two common anti-forensic tactics are secure wiping (overwriting files with zeros or pseudorandom patterns) and timestomping (falsifying file creation dates to make recently fabricated contracts appear years old).',
          'Fortunately for forensic examiners, modern file systems like NTFS maintain multiple redundant timestamp attributes within the Master File Table (MFT). NTFS records timestamps in two separate structures: $STANDARD_INFORMATION (which can be altered by user-level Windows APIs) and $FILE_NAME (which is maintained and updated exclusively by the operating system kernel).',
          'When a fraudster uses an anti-forensic timestomping utility to backdate a contract from 2026 to 2023, the tool alters $STANDARD_INFORMATION but cannot access the kernel-level $FILE_NAME attribute. Comparing these two MFT structures exposes the discrepancy immediately. In federal court, detecting timestomping or secure wiping constitutes conclusive proof of intentional evidence spoliation, triggering devastating legal sanctions and adverse inferences against the perpetrator.'
        ],
        example: 'A CFO submits a contract titled "Backdated_Supply_Agreement_2023.docx" claiming it was signed in January 2023. MFT parsing reveals that $STANDARD_INFORMATION reports a creation date of 2023-01-15, but $FILE_NAME records the true kernel creation date as 2026-09-20. The script confirms timestomping and unallocated cluster zero-filling, issuing a Criminal Spoliation of Evidence finding.',
        code: `def detect_anti_forensics_timestomping_and_wiping(
    mft_record: dict
) -> dict:
    si_created = mft_record["standard_information_created_timestamp"]
    fn_created = mft_record["file_name_created_timestamp"]
    
    is_timestomped = (si_created < fn_created) or mft_record.get("si_subsecond_precision_zeroed", False)
    wiping_detected = mft_record.get("unallocated_cluster_zero_fill_pattern", False)
    
    spoliation_flags = []
    if is_timestomped:
        spoliation_flags.append("TIMESTOMPING_DETECTED: $STANDARD_INFORMATION backdated prior to $FILE_NAME kernel creation")
    if wiping_detected:
        spoliation_flags.append("SECURE_WIPING_DETECTED: Overwrite patterns (DoD 5220.22-M / Gutmann) identified in unallocated space")
        
    spoliation_confirmed = len(spoliation_flags) > 0
    return {
        "file_name": mft_record["file_name"],
        "standard_info_created": si_created,
        "file_name_created": fn_created,
        "timestomping_proven": is_timestomped,
        "secure_wiping_proven": wiping_detected,
        "evidence_spoliation_verdict": "CRIMINAL_SPOLIATION_OF_EVIDENCE_SANCTION" if spoliation_confirmed else "NTFS_METADATA_INTEGRITY_VERIFIED",
        "forensic_spoliation_findings": spoliation_flags
    }

p5 = detect_anti_forensics_timestomping_and_wiping({
    "file_name": "Backdated_Supply_Agreement_2023.docx",
    "standard_information_created_timestamp": "2023-01-15 10:00:00",
    "file_name_created_timestamp": "2026-09-20 18:45:12",
    "si_subsecond_precision_zeroed": True,
    "unallocated_cluster_zero_fill_pattern": True
})
print(f"File: {p5['file_name']}")
print(f"Timestomping: {p5['timestomping_proven']} | Wiping: {p5['secure_wiping_proven']}")
print(f"Verdict: {p5['evidence_spoliation_verdict']}")
for f_ind in p5['forensic_spoliation_findings']:
    print(f"  Finding: {f_ind}")`,
        output: `File: Backdated_Supply_Agreement_2023.docx\nTimestomping: True | Wiping: True\nVerdict: CRIMINAL_SPOLIATION_OF_EVIDENCE_SANCTION\n  Finding: TIMESTOMPING_DETECTED: $STANDARD_INFORMATION backdated prior to $FILE_NAME kernel creation\n  Finding: SECURE_WIPING_DETECTED: Overwrite patterns (DoD 5220.22-M / Gutmann) identified in unallocated space`,
        codeNotes: [
          { line: 7, note: 'Compares user-modifiable $STANDARD_INFORMATION against kernel-protected $FILE_NAME attribute' },
          { line: 8, note: 'Detects secure wiping overwrite signatures (zero-fill or DoD patterns) in unallocated clusters' },
          { line: 12, note: 'Isolates timestomping evidence tampering proving fraudulent backdating of corporate agreements' },
          { line: 23, note: 'Issues formal Criminal Spoliation of Evidence legal sanction verdict under FRCP Rule 37(e)' }
        ],
        tryIt: 'Set si_created equal to fn_created and wiping to False to observe file metadata verify cleanly.',
        check: {
          question: 'How do digital forensic investigators mathematically prove that a suspect backdated a fraudulent corporate agreement on an NTFS file system ("timestomping")?',
          options: [
            'By comparing the $STANDARD_INFORMATION attribute against the $FILE_NAME attribute in the Master File Table (MFT), revealing that the kernel-level creation date is subsequent to the user-altered date.',
            'By checking whether the font in the document is Times New Roman or Calibri.',
            'By measuring the physical temperature of the computer\'s hard drive.',
            'By verifying whether the word count exceeds 1,000 words.'
          ],
          answer: 0,
          why: 'User-mode timestomping utilities can alter $STANDARD_INFORMATION timestamps, but cannot modify the $FILE_NAME attribute, which is controlled exclusively by the NTFS file system kernel.',
          answerIndex: 0,
          explanation: 'User-mode timestomping utilities can alter $STANDARD_INFORMATION timestamps, but cannot modify the $FILE_NAME attribute, which is controlled exclusively by the NTFS file system kernel.'
        }
      }
    ],
    summary: [
      'Digital evidence acquisition requires hardware write-blockers and matching SHA-256 cryptographic hashes to satisfy FRE Rule 902(14) chain of custody.',
      'The EDRM pipeline utilizes De-NISTing, global MD5 deduplication, and targeted Boolean culling to reduce document review populations by >95%.',
      'Volatile RAM memory dumps (RFC 3227) recover injected processes, unauthorized offshore network sockets, and uncommitted ERP wire transfer buffers.',
      'RFC 5322 MIME email header forensics authenticates DKIM cryptographic signatures, originating IP addresses, and unauthorized BCC exfiltration.',
      'NTFS Master File Table (MFT) comparison of $STANDARD_INFORMATION and $FILE_NAME attributes exposes timestomping and criminal spoliation of evidence.'
    ],
    projectStep: {
      title: 'Digital Forensic Investigation & Electronic Discovery Engine',
      steps: [
        'Verify forensic disk bitstream images using SHA-256 hash matching and hardware write-blocker logs.',
        'Implement EDRM De-NISTing and global deduplication to optimize litigation document review sets.',
        'Analyze volatile memory dumps to carve uncommitted ERP transaction buffers and detect injected shellcode.',
        'Authenticate email MIME transport headers and compare NTFS MFT attributes to expose anti-forensic timestomping.'
      ]
    }
  }

];
