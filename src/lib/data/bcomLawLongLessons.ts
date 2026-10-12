import type { LongLesson } from './longLessons';

/**
 * Corporate & Commercial Law, Contracts & Governance (Course: bcom_law)
 * Day 1: Contracts, Corporate Veil, Director Fiduciaries, Insider Trading & M&A Antitrust.
 */
export const BCOM_LAW_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'bcom_law',
    day: 1,
    title: 'Commercial Contracts, Veil Piercing, Director Fiduciaries & Antitrust HHI',
    goal: 'Master foundational commercial and corporate jurisprudence: contract formation and liquidated damages validity, the Salomon corporate veil piercing doctrine, director fiduciary duties under the Business Judgment Rule, Rule 10b-5 insider trading compliance, and M&A antitrust Herfindahl-Hirschman Index (HHI) concentration modeling.',
    minutes: 40,
    recap: 'Welcome to Corporate & Commercial Law. In enterprise commerce, law is the foundational architecture of enforceable property rights, liability boundaries, and corporate governance that enables large-scale capital formation.',
    parts: [
      {
        title: 'Commercial Contract Invariants & Liquidated Damages Validity',
        say: [
          'A commercial contract is an agreement enforceable at law. To form a binding contract, five invariants must be satisfied simultaneously: Offer, Acceptance, Lawful Consideration (bargained-for exchange of value), Legal Capacity of parties, and Mutual Assent (meeting of the minds).',
          'When a party breaches a commercial contract, the standard common-law remedy is Expectation Damages: placing the non-breaching party in the financial position they would have occupied had the contract been fully performed.',
          'Enterprise contracts routinely include Liquidated Damages clauses stipulating an agreed monetary payment if a breach occurs (e.g., $5,000 per day of delay in software deployment).',
          'However, contract law strictly prohibits "Penalty Clauses"! For a liquidated damages provision to be legally enforceable, it must satisfy a two-prong legal test: (1) Anticipated damages must have been difficult to estimate accurately at the time of contract execution, and (2) The stipulated amount must represent a reasonable forecast of actual expected harm.',
          'If a court determines that the clause was designed to punish the breaching party rather than compensate the injured party, the clause is struck down as an illegal penalty.'
        ],
        example: 'If an IT vendor misses a launch date by 10 days, and the contract specifies $5,000/day in liquidated damages ($50,000 total) to cover lost retail transactions and overtime wages, the clause is upheld. But if the contract specifies a $10,000,000 penalty for a 1-day delay on a $100,000 contract, the court voids it as an unenforceable penalty.',
        code: `# Simulation: Commercial Contract Clause Evaluator & Liquidated Damages Validator
class ContractClauseValidator:
    @staticmethod
    def evaluate_liquidated_damages(daily_stipulated_damage: float, 
                                    expected_daily_economic_loss: float,
                                    difficulty_of_estimation_score: int) -> dict:
        # difficulty_of_estimation_score: 1 (easy/trivial) to 5 (highly complex)
        ratio = daily_stipulated_damage / expected_daily_economic_loss if expected_daily_economic_loss > 0 else 999.0
        
        # Legal test:
        # 1. Estimation must be non-trivial (score >= 2)
        # 2. Stipulated amount must not be disproportionately punitive (ratio <= 1.5x)
        is_difficult = difficulty_of_estimation_score >= 2
        is_reasonable_forecast = 0.8 <= ratio <= 1.5
        
        if is_reasonable_forecast and is_difficult:
            verdict = "ENFORCEABLE_LIQUIDATED_DAMAGES"
            rationale = "Represents a reasonable pre-estimate of harm under difficult estimation conditions."
        elif ratio > 1.5:
            verdict = "UNENFORCEABLE_PENALTY_CLAUSE"
            rationale = f"Stipulated amount is {ratio:.1f}x higher than plausible loss; struck down as punitive in terrorem."
        else:
            verdict = "INSUFFICIENT_COMPENSATION"
            rationale = "Stipulated damages under-compensate foreseeable expectation interest."

        return {
            "Stipulated_Daily_Fee": daily_stipulated_damage,
            "Expected_Daily_Harm": expected_daily_economic_loss,
            "Disparity_Ratio": round(ratio, 2),
            "Legal_Verdict": verdict,
            "Judicial_Rationale": rationale
        }

# Scenario 1: Balanced enterprise SLA clause
sla_clause = ContractClauseValidator.evaluate_liquidated_damages(
    daily_stipulated_damage=5000.0,
    expected_daily_economic_loss=4500.0,
    difficulty_of_estimation_score=4
)

# Scenario 2: Punitive penalty clause
punitive_clause = ContractClauseValidator.evaluate_liquidated_damages(
    daily_stipulated_damage=50000.0,
    expected_daily_economic_loss=4500.0,
    difficulty_of_estimation_score=4
)

print(f"Clause 1: {sla_clause['Legal_Verdict']} (Ratio: {sla_clause['Disparity_Ratio']}x)")
print(f"Clause 2: {punitive_clause['Legal_Verdict']} (Ratio: {punitive_clause['Disparity_Ratio']}x)")`,
        output: `Clause 1: ENFORCEABLE_LIQUIDATED_DAMAGES (Ratio: 1.11x)\nClause 2: UNENFORCEABLE_PENALTY_CLAUSE (Ratio: 11.11x)`,
        tryIt: 'Adjust Clause 2 stipulated fee down to $6,000 to bring the disparity ratio to 1.33x and achieve ENFORCEABLE status.',
        check: {
          question: 'Under common law contract principles, what distinguishes an enforceable liquidated damages clause from an unenforceable penalty clause?',
          options: [
            'Enforceable liquidated damages represent a reasonable advance forecast of actual damages that were difficult to ascertain, whereas penalty clauses stipulate punitive sums designed to coerce performance.',
            'Liquidated damages clauses must be witnessed by a federal judge prior to signing.',
            'Penalty clauses are only enforceable if the contract is denominated in foreign currency.',
            'Liquidated damages can only be applied to consumer credit contracts, never corporate contracts.'
          ],
          answerIndex: 0,
          explanation: 'Courts uphold liquidated damages when parties make a good-faith pre-estimate of anticipated damages that would be difficult to prove. When the amount is disproportionately punitive, courts strike it down as an unenforceable penalty that violates public policy.'
        }
      },
      {
        title: 'Corporate Legal Personality & Piercing the Corporate Veil',
        say: [
          'The defining innovation of modern corporate law is Separate Legal Personality and Limited Liability, established in the landmark 1897 English House of Lords case Salomon v A Salomon & Co Ltd.',
          'A corporation is a distinct legal "person" separate from its shareholders, directors, and officers. Shareholders risk only the capital they invested to purchase shares; their personal homes, bank accounts, and private assets are shielded from corporate creditors.',
          'However, the corporate veil is not absolute. In cases of egregious misconduct, equity courts will "Pierce the Corporate Veil", stripping away limited liability and holding shareholders personally liable for corporate debts.',
          'Courts apply the Alter-Ego / Instrumentality Doctrine, evaluating four key factors: (1) Commingling of personal and corporate funds (using company credit cards for private vacations), (2) Severe undercapitalization (deliberately launching a hazardous business with zero capital or insurance), (3) Failure to observe corporate formalities (no board meetings, no stock certificates, no written minutes), and (4) Use of the corporate form to perpetrate an active fraud or injustice.'
        ],
        example: 'If an entrepreneur incorporates a trucking company, deposits only $500, pays his personal mortgage directly out of the trucking account, holds no annual meetings, and causes an accident without liability insurance, the court will pierce the veil and seize his personal house to pay the injured victim.',
        code: `# Simulation: Corporate Veil Alter-Ego Risk & Judicial Liability Analyzer
class CorporateVeilRiskModel:
    FACTORS = {
        "commingling_funds": 0.35,      # Using company accounts as personal piggy bank
        "undercapitalization": 0.30,   # Insolvency from inception relative to operational risks
        "lack_of_formalities": 0.20,   # Failure to maintain bylaws, minutes, or board resolutions
        "fraudulent_intent": 0.15      # Siphoning assets to evade known legal creditors
    }

    @classmethod
    def evaluate_veil_integrity(cls, scores: dict) -> dict:
        # Each factor scored 0.0 (perfect compliance) to 1.0 (egregious violation)
        total_risk_score = (
            scores["commingling"] * cls.FACTORS["commingling_funds"] +
            scores["undercapitalized"] * cls.FACTORS["undercapitalization"] +
            scores["no_formalities"] * cls.FACTORS["lack_of_formalities"] +
            scores["creditor_evasion"] * cls.FACTORS["fraudulent_intent"]
        ) * 100.0

        if total_risk_score >= 60.0:
            judicial_ruling = "PIERCE_THE_VEIL_PERSONAL_LIABILITY"
            shield_status = "SHIELD_COLLAPSED"
        elif total_risk_score >= 35.0:
            judicial_ruling = "HIGH_LITIGATION_RISK_REMEDIATION_REQUIRED"
            shield_status = "SHIELD_VULNERABLE"
        else:
            judicial_ruling = "UPHOLD_LIMITED_LIABILITY_SALOMON_DOCTRINE"
            shield_status = "SHIELD_INTACT"

        return {
            "Veil_Risk_Index": round(total_risk_score, 1),
            "Corporate_Shield": shield_status,
            "Judicial_Outcome": judicial_ruling
        }

proper_corporate_governance = {
    "commingling": 0.0,
    "undercapitalized": 0.1,
    "no_formalities": 0.05,
    "creditor_evasion": 0.0
}

alter_ego_shell_company = {
    "commingling": 0.95,
    "undercapitalized": 0.90,
    "no_formalities": 0.85,
    "creditor_evasion": 0.70
}

good_res = CorporateVeilRiskModel.evaluate_veil_integrity(proper_corporate_governance)
bad_res = CorporateVeilRiskModel.evaluate_veil_integrity(alter_ego_shell_company)

print(f"Company A: Risk {good_res['Veil_Risk_Index']}/100 -> {good_res['Corporate_Shield']} ({good_res['Judicial_Outcome']})")
print(f"Company B: Risk {bad_res['Veil_Risk_Index']}/100 -> {bad_res['Corporate_Shield']} ({bad_res['Judicial_Outcome']})")`,
        output: `Company A: Risk 4.0/100 -> SHIELD_INTACT (UPHOLD_LIMITED_LIABILITY_SALOMON_DOCTRINE)\nCompany B: Risk 87.8/100 -> SHIELD_COLLAPSED (PIERCE_THE_VEIL_PERSONAL_LIABILITY)`,
        tryIt: 'Clean up Company B commingling and undercapitalization to 0.1 each and observe the corporate shield restore to SHIELD_INTACT.',
        check: {
          question: 'What was the foundational principle established in Salomon v A Salomon & Co Ltd (1897)?',
          options: [
            'A duly incorporated company has a legal personality completely distinct from its members, so shareholders are not personally liable for the company\'s debts beyond their share capital.',
            'Sole proprietors cannot legally own more than 49% of their company\'s voting stock.',
            'Creditors of a bankrupt company can automatically seize the personal assets of the largest shareholder.',
            'Corporate charters must be renewed every 12 months by an act of parliament.'
          ],
          answerIndex: 0,
          explanation: 'Salomon v Salomon established the core bedrock of modern corporate law: that a corporation is an independent legal entity. Even if one individual owns 99.9% of shares, the business debts belong to the corporate person, not the individual human shareholder.'
        }
      },
      {
        title: 'Director Fiduciary Duties & The Business Judgment Rule',
        say: [
          'Corporate directors and officers manage billions of dollars in other people\'s money. Because shareholders cannot supervise daily decisions, the law imposes strict Fiduciary Duties upon directors.',
          'The two core fiduciary duties are the Duty of Care and the Duty of Loyalty.',
          'The Duty of Care requires directors to act on an informed basis, with the degree of care that an ordinarily prudent person would use under similar circumstances. Directors must review financial reports, seek expert counsel, and deliberate diligently before voting.',
          'The Duty of Loyalty mandates that directors act solely in the best interests of the corporation and its shareholders, prohibiting self-dealing, taking corporate opportunities for private gain, or participating in transactions with undisclosed conflicts of interest.',
          'Under Delaware corporate law (DGCL Section 141), the Business Judgment Rule (BJR) is a powerful legal presumption that courts will not second-guess honest business decisions—even catastrophic mistakes—provided the directors acted on an informed basis, in good faith, and without personal conflicts of interest.'
        ],
        example: 'If a board conducts 6 months of diligence and acquires a tech startup for $500M, and the product completely fails 2 years later, shareholders cannot successfully sue the directors for damages! The Business Judgment Rule protects the board from hindsight judicial second-guessing.',
        code: `# Simulation: Delaware Corporate Fiduciary Review & Business Judgment Rule Presumption
class DirectorFiduciaryReview:
    @staticmethod
    def evaluate_board_decision(informed_process_documented: bool,
                                independent_legal_financial_advice: bool,
                                director_financial_conflict_present: bool,
                                acted_in_good_faith: bool) -> dict:
        # Business Judgment Rule requires:
        # 1. No conflict of interest (Duty of Loyalty)
        # 2. Informed deliberative process (Duty of Care)
        # 3. Good faith intent
        
        has_loyalty_breach = director_financial_conflict_present
        has_care_breach = not (informed_process_documented and independent_legal_financial_advice)
        has_bad_faith = not acted_in_good_faith

        if has_loyalty_breach:
            judicial_standard = "ENTIRE_FAIRNESS_REVIEW"
            presumption_applied = False
            burden_of_proof = "DEFENDANT_DIRECTORS_MUST_PROVE_FAIR_PRICE_AND_FAIR_DEALING"
        elif has_care_breach or has_bad_faith:
            judicial_standard = "GROSS_NEGLIGENCE_REVIEW"
            presumption_applied = False
            burden_of_proof = "PLAINTIFF_SHAREHOLDERS_MUST_PROVE_GROSS_NEGLIGENCE"
        else:
            judicial_standard = "BUSINESS_JUDGMENT_RULE_PRESUMPTION"
            presumption_applied = True
            burden_of_proof = "CASE_DISMISSED_COURTS_DO_NOT_SECOND_GUESS_HONEST_BUSINESS_FAILURES"

        return {
            "Review_Standard": judicial_standard,
            "BJR_Presumption_Intact": presumption_applied,
            "Burden_Of_Proof": burden_of_proof
        }

# Case A: Honest investment that failed after extensive diligence
case_a = DirectorFiduciaryReview.evaluate_board_decision(
    informed_process_documented=True,
    independent_legal_financial_advice=True,
    director_financial_conflict_present=False,
    acted_in_good_faith=True
)

# Case B: Board approved CEO's private real estate sale to company without independent appraisal
case_b = DirectorFiduciaryReview.evaluate_board_decision(
    informed_process_documented=True,
    independent_legal_financial_advice=False,
    director_financial_conflict_present=True,
    acted_in_good_faith=True
)

print(f"Case A: {case_a['Review_Standard']} (BJR Intact: {case_a['BJR_Presumption_Intact']})")
print(f"Case B: {case_b['Review_Standard']} (BJR Intact: {case_b['BJR_Presumption_Intact']})")`,
        output: `Case A: BUSINESS_JUDGMENT_RULE_PRESUMPTION (BJR Intact: True)\nCase B: ENTIRE_FAIRNESS_REVIEW (BJR Intact: False)`,
        tryIt: 'Flip director_financial_conflict_present in Case B to False and add independent advice to restore the BJR presumption.',
        check: {
          question: 'What triggers Delaware courts to abandon the Business Judgment Rule and apply the onerous "Entire Fairness" standard of review?',
          options: [
            'Evidence that directors suffered from a self-dealing conflict of interest (breaching the Duty of Loyalty), requiring the board to prove both fair dealing and fair price.',
            'Any corporate merger that fails to generate a profit within 90 days of closing.',
            'When a company incurs more than $10 million in debt.',
            'Whenever minority shareholders vote against a board compensation package.'
          ],
          answerIndex: 0,
          explanation: 'The Business Judgment Rule presumption evaporates the moment a plaintiff proves a director had a personal financial conflict of interest (a breach of loyalty). Under Entire Fairness review, the burden flips to the directors to prove the transaction was objectively fair to shareholders.'
        }
      },
      {
        title: 'Securities Law & Rule 10b-5 Insider Trading Compliance',
        say: [
          'Under the Securities Exchange Act of 1934 and SEC Rule 10b-5, trading securities on the basis of Material Non-Public Information (MNPI) in breach of a duty of trust or confidence is a federal felony.',
          'Information is "Material" if there is a substantial likelihood that a reasonable investor would view it as significantly altering the "total mix" of available information (TSC Industries v Northway). Examples include unannounced quarterly earnings, FDA trial verdicts, or pending M&A mergers.',
          'Information is "Non-Public" until it has been broadly disseminated to the public market (via an SEC Form 8-K or wire press release) and the market has had sufficient time (typically 24 to 48 hours) to absorb the information.',
          'The law covers both the Classical Theory (corporate insiders trading their own company shares) and the Misappropriation Theory (outsiders trading on confidential information stolen from the source, established in United States v O\'Hagan).',
          'To prevent unlawful trades while allowing executives to diversify their wealth, the SEC established Rule 10b5-1 Trading Plans: binding, pre-scheduled execution schedules enacted during open trading windows with mandatory cooling-off periods.'
        ],
        example: 'If an engineer learns that their company is acquiring a competitor for a 50% premium and buys call options before the announcement, they violate Rule 10b-5. Even if they tell their brother who buys the options, both the tipper and the tippee face federal prison.',
        code: `# Simulation: SEC Rule 10b-5 Trading Window & Materiality Compliance Gate
from datetime import datetime, date

class InsiderTradingComplianceGate:
    def __init__(self, blackout_start: date, blackout_end: date, active_mnpi_items: list):
        self.blackout_start = blackout_start
        self.blackout_end = blackout_end
        self.active_mnpi = active_mnpi_items

    def evaluate_trade_request(self, trade_date: date, has_pre_cleared_10b5_1_plan: bool) -> dict:
        # Rule: 10b5-1 plans provide an affirmative defense even during blackout windows
        if has_pre_cleared_10b5_1_plan:
            return {
                "Trading_Permitted": True,
                "Compliance_Status": "APPROVED_PRE_SCHEDULED_10B5_1_SAFE_HARBOR",
                "Legal_Risk": "Zero (Valid affirmative defense)"
            }

        # Check blackout window (e.g. 2 weeks before quarter-end through earnings release)
        in_blackout = self.blackout_start <= trade_date <= self.blackout_end
        has_mnpi = len(self.active_mnpi) > 0

        if in_blackout or has_mnpi:
            reasons = []
            if in_blackout:
                reasons.append("Quarterly Earnings Blackout Window Active")
            if has_mnpi:
                reasons.append(f"Unpublished MNPI: {', '.join(self.active_mnpi)}")
            return {
                "Trading_Permitted": False,
                "Compliance_Status": "TRADE_REJECTED_INSIDER_TRADING_VIOLATION_RISK",
                "Violation_Grounds": "; ".join(reasons)
            }

        return {
            "Trading_Permitted": True,
            "Compliance_Status": "OPEN_WINDOW_TRADE_AUTHORIZED",
            "Legal_Risk": "Low"
        }

gate = InsiderTradingComplianceGate(
    blackout_start=date(2026, 9, 15),
    blackout_end=date(2026, 10, 25),
    active_mnpi_items=["Pending $2B Semiconductor Acquisition"]
)

# Trade A: Discretionary trade during blackout
t1 = gate.evaluate_trade_request(date(2026, 10, 1), has_pre_cleared_10b5_1_plan=False)
# Trade B: Pre-scheduled 10b5-1 plan trade during blackout
t2 = gate.evaluate_trade_request(date(2026, 10, 1), has_pre_cleared_10b5_1_plan=True)

print(f"Trade A (Discretionary): {t1['Compliance_Status']}")
print(f"Trade B (10b5-1 Plan):    {t2['Compliance_Status']}")`,
        output: `Trade A (Discretionary): TRADE_REJECTED_INSIDER_TRADING_VIOLATION_RISK\nTrade B (10b5-1 Plan):    APPROVED_PRE_SCHEDULED_10B5_1_SAFE_HARBOR`,
        tryIt: 'Clear the MNPI list and set trade date to November 1 (outside blackout) to observe discretionary trades authorize cleanly.',
        check: {
          question: 'What is the legal definition of Material Non-Public Information (MNPI) under SEC Rule 10b-5 jurisprudence?',
          options: [
            'Information for which there is a substantial likelihood that a reasonable investor would consider it important in deciding whether to buy, sell, or hold securities.',
            'Information that has been viewed by at least 1,000 retail traders on public message boards.',
            'Any information discussed in an email that contains more than 500 words.',
            'Information that causes a stock price to move by exactly 10% in one trading session.'
          ],
          answerIndex: 0,
          explanation: 'Under TSC Industries and Basic Inc v Levinson, information is material if a reasonable investor would view it as significantly altering the total mix of available information, and non-public until broadly disseminated to the investing public.'
        }
      },
      {
        title: 'M&A Deal Governance & Antitrust Concentration (HHI Index)',
        say: [
          'In Mergers and Acquisitions (M&A), buying an enterprise involves complex legal agreements: Representations & Warranties (R&Ws), Indemnification Escrow Baskets (deductible vs dollar-one), and Material Adverse Effect (MAE) closing conditions.',
          'Equally critical is regulatory antitrust clearance: under the Hart-Scott-Rodino (HSR) Act, large mergers cannot close until approved by the Department of Justice (DOJ) and Federal Trade Commission (FTC).',
          'Antitrust regulators evaluate market power and monopoly concentration using the Herfindahl-Hirschman Index (HHI): HHI = sum(Market_Share_i^2) across all market participants (where shares are expressed as whole percentage numbers).',
          'A market with HHI < 1,500 is Unconcentrated; between 1,500 and 2,500 is Moderately Concentrated; and above 2,500 is Highly Concentrated.',
          'In a highly concentrated market, any merger that increases the HHI by more than 100 to 200 points (Delta HHI = 2 * Share_A * Share_B) is presumptively anti-competitive and routinely challenged or blocked by regulators.'
        ],
        example: 'In a market with five 20% firms: HHI = 5 * (20^2) = 2,000 (Moderately Concentrated). If two 20% firms merge, the post-merger firm has 40%: HHI = 40^2 + 3*(20^2) = 1,600 + 1,200 = 2,800. The Delta HHI is 2 * 20 * 20 = 800! Regulators will immediately challenge the deal.',
        code: `# Simulation: Antitrust Merger Review & Herfindahl-Hirschman Index (HHI) Analyzer
class AntitrustHHIAnalyzer:
    @staticmethod
    def evaluate_merger(market_shares: dict, firm_a: str, firm_b: str) -> dict:
        # Pre-merger HHI
        pre_hhi = sum(share ** 2 for share in market_shares.values())
        
        # Combined post-merger share
        share_a = market_shares[firm_a]
        share_b = market_shares[firm_b]
        delta_hhi = 2.0 * share_a * share_b
        post_hhi = pre_hhi + delta_hhi

        # Regulatory Classification (DOJ / FTC Guidelines)
        if post_hhi < 1500:
            market_type = "UNCONCENTRATED"
            challenge_risk = "NO_CHALLENGE (Low Concentration)"
        elif 1500 <= post_hhi <= 2500:
            market_type = "MODERATELY_CONCENTRATED"
            challenge_risk = "SCRUTINY_IF_DELTA_EXCEEDS_100" if delta_hhi > 100 else "LOW_RISK"
        else:
            market_type = "HIGHLY_CONCENTRATED"
            challenge_risk = "PRESUMED_ANTICOMPETITIVE_CHALLENGE" if delta_hhi > 100 else "SCRUTINY"

        return {
            "Pre_Merger_HHI": round(pre_hhi, 1),
            "Delta_HHI": round(delta_hhi, 1),
            "Post_Merger_HHI": round(post_hhi, 1),
            "Market_Classification": market_type,
            "Antitrust_Enforcement_Risk": challenge_risk
        }

telecom_market = {
    "Verizon": 32.0,
    "ATT": 30.0,
    "T-Mobile": 25.0,
    "Dish_Wireless": 8.0,
    "MVNO_Others": 5.0
}

# Test hypothetical merger between T-Mobile (25%) and Dish (8%)
analysis = AntitrustHHIAnalyzer.evaluate_merger(telecom_market, "T-Mobile", "Dish_Wireless")

print("DOJ / FTC Antitrust Merger Concentration Review:")
print(f"Pre-Merger HHI:     {analysis['Pre_Merger_HHI']}")
print(f"Delta HHI Increase: +{analysis['Delta_HHI']}")
print(f"Post-Merger HHI:    {analysis['Post_Merger_HHI']}")
print(f"Market Structure:   {analysis['Market_Classification']}")
print(f"Antitrust Verdict:  {analysis['Antitrust_Enforcement_Risk']}")`,
        output: `DOJ / FTC Antitrust Merger Concentration Review:\nPre-Merger HHI:     2638.0\nDelta HHI Increase: +400.0\nPost-Merger HHI:    3038.0\nMarket Structure:   HIGHLY_CONCENTRATED\nAntitrust Verdict:  PRESUMED_ANTICOMPETITIVE_CHALLENGE`,
        tryIt: 'Merge Dish (8%) and MVNO_Others (5%) instead (Delta HHI = 80) and observe the regulatory risk ease.',
        check: {
          question: 'Why do antitrust authorities calculate the Herfindahl-Hirschman Index (HHI) by squaring market shares rather than simply adding the top 4 firms\' shares (CR4)?',
          options: [
            'Squaring gives disproportionate mathematical weight to dominant firms with large market shares, directly measuring monopoly pricing power and market distortion.',
            'Because squaring shares simplifies the calculations on older mainframe computers.',
            'Because international tax treaties require quadratic mathematical formulas.',
            'Because squaring shares reduces the total sum of the index below 100.'
          ],
          answerIndex: 0,
          explanation: 'Squaring market shares heavily penalizes high market concentration: two 20% firms yield 400 + 400 = 800, whereas one 40% firm yields 1,600. This captures the disproportionate economic pricing power exerted by a single dominant market player.'
        }
      }
    ],
    summary: [
      'Commercial contracts require offer, acceptance, consideration, capacity, and mutual assent; liquidated damages are enforceable only if they represent a reasonable pre-estimate of harm rather than an illegal punitive penalty.',
      'Separate legal personality (Salomon v Salomon) shields shareholders from corporate debts unless courts pierce the corporate veil due to alter-ego commingling, undercapitalization, or fraud.',
      'Directors owe Fiduciary Duties of Care and Loyalty; the Business Judgment Rule presumes honest, unconflicted board decisions are protected from hindsight judicial liability.',
      'Securities Rule 10b-5 criminalizes trading on Material Non-Public Information (MNPI); pre-cleared Rule 10b5-1 plans provide a valid affirmative defense during blackout windows.',
      'Antitrust merger review evaluates market power using the Herfindahl-Hirschman Index (HHI); mergers creating post-HHI > 2500 with Delta > 100 are presumptively challenged as anti-competitive.'
    ],
    projectStep: {
      title: 'Corporate Legal Governance & Antitrust Simulator',
      steps: [
        'Validate commercial contract liquidated damages clauses against common-law penalty doctrine rules.',
        'Evaluate alter-ego commingling risk to determine whether limited liability corporate veils withstand judicial scrutiny.',
        'Review director conflict of interest disclosures to determine Business Judgment Rule versus Entire Fairness standard.',
        'Compute the Herfindahl-Hirschman Index (HHI) market concentration shift to evaluate M&A antitrust regulatory clearance.'
      ]
    }
  }
];
