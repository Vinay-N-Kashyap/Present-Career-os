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
  },
  {
    coursePrefix: 'bcom_law',
    day: 2,
    title: 'Intellectual Property Protection, ESG Governance & Shareholder Activism Defense',
    goal: 'Master corporate intellectual property strategy, board ESG governance compliance, and shareholder rights defense: registering and auditing IP portfolios (Patents, Trademarks, Copyrights, Trade Secrets) under Defend Trade Secrets Act (DTSA) standards, enforcing Whistleblower protection and Sarbanes-Oxley (SOX) Section 404 internal audit controls, calculating ESG Corporate Governance compliance indices, and architecting poison pill (Shareholder Rights Plan) defenses against hostile takeovers under the Unocal / Revlon intermediate scrutiny standards.',
    minutes: 44,
    recap: 'On Day 1 we mastered commercial contract formation, Salomon corporate veil piercing, director fiduciary duties under the Business Judgment Rule, and antitrust HHI market concentration. Today we expand corporate jurisprudence into intangible asset protection, ESG compliance frameworks, and hostile takeover defense mechanisms.',
    parts: [
      {
        title: 'The 4 Pillars of Intellectual Property & Trade Secret DTSA Protocols',
        say: [
          'In the modern knowledge economy, intangible intellectual assets constitute over 85% of total corporate enterprise value for Fortune 500 corporations.',
          'Corporate counsel must navigate four distinct legal pillars of Intellectual Property: Patents, Trademarks, Copyrights, and Trade Secrets.',
          'Pillar 1: Patents grant a 20-year statutory monopoly to practice novel, useful, and non-obvious inventions in exchange for public disclosure of the patent specification.',
          'Pillar 2: Trademarks protect brand identifiers, logos, and slogans under the Lanham Act, preventing consumer confusion in the marketplace as long as the mark remains in commercial use.',
          'Pillar 3: Copyrights protect original works of authorship fixed in a tangible medium of expression (software code, artistic works, manuals), shielding expression but never abstract ideas.',
          'Pillar 4: Trade Secrets protect proprietary formulas, algorithms, customer lists, and pricing matrices under the Defend Trade Secrets Act (DTSA) and state Uniform Trade Secrets Acts (UTSA).',
          'Unlike patents, trade secrets never expire, but they carry zero protection against independent discovery or reverse engineering. Most importantly, a trade secret exists legally ONLY if the owner exerts "reasonable measures" to keep the information secret (strict NDAs, role-based access, and encrypted credentials).'
        ],
        example: 'Think of Coca-Cola versus Pfizer. Pfizer patents a new pharmaceutical molecule, disclosing its chemical structure to the world in exchange for a 20-year government monopoly. After 20 years, generic competitors can manufacture it freely. Coca-Cola, on the other hand, never patented its secret syrup formula; it guards the formula as a perpetual trade secret inside a physical security vault under biometric encryption. After 130 years, it remains protected.',
        code: `# Simulation: IP Portfolio Audit & Trade Secret Secrecy Hygiene Classifier
from dataclasses import dataclass

@dataclass
class IntellectualPropertyAsset:
    asset_id: str
    asset_type: str # 'Patent', 'Trademark', 'Copyright', 'Trade_Secret'
    economic_value_score: float # 1-10
    nda_executed: bool
    role_based_access_locked: bool
    public_disclosure_made: bool

def audit_ip_protection_hygiene(asset: IntellectualPropertyAsset) -> dict:
    if asset.asset_type == "Trade_Secret":
        if asset.public_disclosure_made:
            status = "TRADE_SECRET_DESTROYED"
            rationale = "Public disclosure permanently eviscerates trade secret status under DTSA/UTSA."
        elif asset.nda_executed and asset.role_based_access_locked:
            status = "ENFORCEABLE_DTSA_TRADE_SECRET"
            rationale = "Satisfies statutory reasonable secrecy measures with active encryption/access controls."
        else:
            status = "VULNERABLE_INSUFFICIENT_SECURITY"
            rationale = "Lacks reasonable secrecy protocols; injunctions likely denied in misappropriation suit."
    elif asset.asset_type == "Patent":
        status = "PATENT_STATUTORY_MONOPOLY" if not asset.public_disclosure_made else "PRIOR_ART_RISK"
        rationale = "Subject to 20-year exclusive practice upon examination."
    else:
        status = "STANDARD_STATUTORY_REGISTRATION"
        rationale = "Protected under Lanham Act or Copyright statutory schemes."

    return {
        "AssetID": asset.asset_id,
        "Type": asset.asset_type,
        "Legal_Status": status,
        "Judicial_Assessment": rationale
    }

ts1 = IntellectualPropertyAsset("ALGO_984", "Trade_Secret", 9.5, True, True, False)
res1 = audit_ip_protection_hygiene(ts1)
print(f"Asset: {res1['AssetID']} | Type: {res1['Type']} -> Status: {res1['Legal_Status']}")
print(f"Assessment: {res1['Judicial_Assessment']}")`,
        output: `Asset: ALGO_984 | Type: Trade_Secret -> Status: ENFORCEABLE_DTSA_TRADE_SECRET\nAssessment: Satisfies statutory reasonable secrecy measures with active encryption/access controls.`,
        codeNotes: [
          { line: 4, note: 'IntellectualPropertyAsset models statutory IP classes, economic value, and secrecy hygiene controls' },
          { line: 15, note: 'Detects fatal destruction of trade secret protection if public disclosure occurred' },
          { line: 18, note: 'Validates strict statutory compliance with Defend Trade Secrets Act reasonable security protocols' },
          { line: 36, note: 'Confirms proprietary algorithmic engine ALGO_984 qualifies for federal injunctive protection under DTSA' }
        ],
        tryIt: 'Flip role_based_access_locked to False on asset ts1 to observe status downgrade to VULNERABLE_INSUFFICIENT_SECURITY.',
        check: {
          question: 'What is the fundamental statutory requirement for a proprietary corporate algorithm to qualify for trade secret protection under the Defend Trade Secrets Act (DTSA)?',
          options: [
            'The owner must take affirmative, reasonable measures under the circumstances to maintain its secrecy, and the information must derive independent economic value from not being generally known.',
            'The company must register the full algorithm source code with the Library of Congress.',
            'The algorithm must be published on a public GitHub repository with an MIT license.',
            'The algorithm must have been invented more than 100 years ago.'
          ],
          answer: 0,
          why: 'Under the DTSA and UTSA, trade secret protection vanishes if the owner fails to maintain reasonable security measures such as confidentiality agreements, role-based encryption, and access controls.',
          answerIndex: 0,
          explanation: 'Under the DTSA and UTSA, trade secret protection vanishes if the owner fails to maintain reasonable security measures such as confidentiality agreements, role-based encryption, and access controls.'
        }
      },
      {
        title: 'Sarbanes-Oxley (SOX) Internal Controls & Whistleblower Protections',
        say: [
          'Enacted following the catastrophic accounting frauds at Enron and WorldCom, the Sarbanes-Oxley Act of 2002 (SOX) transformed corporate compliance into a matter of direct criminal liability.',
          'SOX Section 302 mandates that corporate CEOs and CFOs personally certify the accuracy and integrity of all periodic financial reports, with willful false certifications punishable by up to 20 years in federal prison.',
          'SOX Section 404 requires management and external auditors to establish, document, test, and assess the effectiveness of Internal Controls over Financial Reporting (ICFR).',
          'Deficiencies in internal controls are classified into three strict legal categories: Control Deficiency (minor operational gap), Significant Deficiency (merits attention by board audit committee), and Material Weakness (reasonable possibility that a material misstatement will not be prevented or detected).',
          'A single unremediated Material Weakness forces the external auditor to issue an adverse public audit opinion, frequently triggering steep equity market selloffs.',
          'Crucially, SOX and Dodd-Frank enforce robust Whistleblower protections: companies are strictly prohibited from discharging, demoting, suspending, harassing, or retaliating against employees who report suspected financial malfeasance.'
        ],
        example: 'Think of dual-signature authorization at a bank. If a company allows a single mid-level accountant to wire $10M offshore with zero secondary approval or ledger reconciliation, that is a glaring Material Weakness in internal controls. Even if no fraud has occurred yet, the lack of preventative controls creates an unacceptable risk of material financial distortion.',
        code: `# Simulation: SOX 404 Internal Control Defect Escalation & Whistleblower Filter
def evaluate_sox_internal_control_deficiency(
    control_name: str,
    annual_transaction_volume: float,
    unreconciled_variance: float,
    preventive_control_active: bool,
    materiality_threshold: float = 250000.0
) -> dict:
    variance_pct = (unreconciled_variance / annual_transaction_volume) * 100.0 if annual_transaction_volume > 0 else 0.0
    
    if unreconciled_variance >= materiality_threshold and not preventive_control_active:
        severity = "MATERIAL_WEAKNESS"
        action = "Mandatory Adverse SOX 404 Audit Opinion; Immediate Board Audit Committee Reporting."
    elif unreconciled_variance >= (materiality_threshold * 0.25):
        severity = "SIGNIFICANT_DEFICIENCY"
        action = "Escalate to Senior Management and External Auditors; 30-Day Remediation Plan."
    else:
        severity = "CONTROL_DEFICIENCY"
        action = "Operational Log Entry; Remediate During Routine Internal Controls Cycle."

    return {
        "Control": control_name,
        "Variance_Amount": f"\${round(unreconciled_variance / 1e3, 1)}k",
        "Materiality_Hurdle": f"\${round(materiality_threshold / 1e3, 1)}k",
        "SOX_404_Classification": severity,
        "Mandatory_Remediation": action
    }

sox_res = evaluate_sox_internal_control_deficiency(
    control_name="Revenue Recognition Deferred ARR Reconciliation",
    annual_transaction_volume=50000000.0,
    unreconciled_variance=420000.0,
    preventive_control_active=False,
    materiality_threshold=250000.0
)
print(f"Control: {sox_res['Control']} | Severity: {sox_res['SOX_404_Classification']}")
print(f"Action: {sox_res['Mandatory_Remediation']}")`,
        output: `Control: Revenue Recognition Deferred ARR Reconciliation | Severity: MATERIAL_WEAKNESS\nAction: Mandatory Adverse SOX 404 Audit Opinion; Immediate Board Audit Committee Reporting.`,
        codeNotes: [
          { line: 9, note: 'Evaluates unreconciled internal accounting variances against quantified materiality thresholds' },
          { line: 11, note: 'Elevates unmitigated variances exceeding materiality hurdle to the highest severity level: Material Weakness' },
          { line: 14, note: 'Routes intermediate variances to Significant Deficiency with mandatory external auditor escalation' },
          { line: 31, note: 'Identifies $420k deferred revenue reconciliation gap as a Material Weakness requiring adverse SOX 404 filing' }
        ],
        tryIt: 'Enable preventive_control_active=True on sox_res to see the severity downgrade to SIGNIFICANT_DEFICIENCY.',
        check: {
          question: 'What is the critical legal difference between a "Significant Deficiency" and a "Material Weakness" under SOX Section 404 internal audit rules?',
          options: [
            'A Material Weakness represents a severe deficiency where there is a reasonable possibility that a material misstatement will not be prevented or detected, requiring an adverse public audit opinion.',
            'A Significant Deficiency leads directly to criminal incarceration of all shareholders.',
            'A Material Weakness applies only to small family-owned grocery stores.',
            'There is no legal difference; both terms are interchangeable informal accounting slang.'
          ],
          answer: 0,
          why: 'Under PCAOB auditing standards, a Material Weakness is the most severe internal control defect, indicating an unaddressed gap that could materially corrupt reported financial statements.',
          answerIndex: 0,
          explanation: 'Under PCAOB auditing standards, a Material Weakness is the most severe internal control defect, indicating an unaddressed gap that could materially corrupt reported financial statements.'
        }
      },
      {
        title: 'ESG Governance Disclosure & Regulatory Greenwashing Liability',
        say: [
          'Environmental, Social, and Governance (ESG) compliance has evolved from voluntary public relations brochures into legally binding securities disclosure obligations.',
          'The "G" (Corporate Governance) represents the structural cornerstone of ESG: board independence (requiring a majority of independent directors), the presence of a certified financial expert on the Audit Committee, and executive compensation clawback policies under Dodd-Frank.',
          'Clawback policies legally mandate that public companies recover incentive-based executive compensation if financial results are subsequently restated due to accounting errors or misconduct, regardless of whether the executive was personally at fault.',
          'Concurrently, securities regulators worldwide (including the SEC and the European Union under CSRD) are aggressively prosecuting "Greenwashing" — the practice of making false, misleading, or unsubstantiated claims regarding sustainability or carbon neutrality.',
          'Under SEC Rule 10b-5, false ESG statements in sustainability reports or investor presentations create direct securities fraud liability if those statements mislead reasonable investors regarding corporate risk or financial exposure.'
        ],
        example: 'Imagine an airline marketing its flights as "100% Carbon Neutral" based on cheap, unverified carbon offset credits that never actually retired carbon. If consumer protection agencies or the SEC investigate and prove the offsets were fictitious, the airline faces massive regulatory fines, mandatory advertising retractions, and securities class-action lawsuits for misleading ESG disclosure.',
        code: `# Simulation: ESG Governance Rating & Greenwashing Misstatement Risk Scorer
def evaluate_esg_governance_and_greenwashing_risk(
    independent_board_pct: float,
    audit_financial_expert_present: bool,
    executive_clawback_policy_active: bool,
    unsubstantiated_carbon_neutral_claims: bool
) -> dict:
    # Governance score components
    gov_score = 0
    if independent_board_pct >= 66.0:
        gov_score += 40
    elif independent_board_pct >= 50.0:
        gov_score += 25
    if audit_financial_expert_present:
        gov_score += 30
    if executive_clawback_policy_active:
        gov_score += 30

    if unsubstantiated_carbon_neutral_claims:
        litigation_risk = "HIGH_RULE_10B5_GREENWASHING_EXPOSURE"
        recommendation = "Immediate retraction of promotional marketing claims; audit carbon offsets with third-party verifier."
    else:
        litigation_risk = "LOW_COMPLIANT_DISCLOSURE"
        recommendation = "Maintain regular audited sustainability reporting alignment."

    return {
        "Governance_Index": f"{gov_score}/100",
        "Board_Independence": f"{independent_board_pct}%",
        "Governance_Grade": "TIER_1_ROBUST" if gov_score >= 80 else "TIER_2_ADEQUATE" if gov_score >= 60 else "DEFICIENT",
        "Greenwashing_Litigation_Risk": litigation_risk,
        "Counsel_Recommendation": recommendation
    }

esg_res = evaluate_esg_governance_and_greenwashing_risk(75.0, True, True, True)
print(f"Governance Index: {esg_res['Governance_Index']} ({esg_res['Governance_Grade']})")
print(f"Litigation Risk: {esg_res['Greenwashing_Litigation_Risk']}")`,
        output: `Governance Index: 100/100 (TIER_1_ROBUST)\nLitigation Risk: HIGH_RULE_10B5_GREENWASHING_EXPOSURE`,
        codeNotes: [
          { line: 8, note: 'Calculates corporate governance strength based on board independence and clawback policies' },
          { line: 17, note: 'Flags unsubstantiated sustainability assertions as high-risk securities fraud exposure under Rule 10b-5' },
          { line: 27, note: 'Assigns top Tier-1 governance rating while identifying urgent greenwashing regulatory liability' },
          { line: 36, note: 'Recommends immediate public retraction of unverified promotional carbon offset claims' }
        ],
        tryIt: 'Toggle unsubstantiated_carbon_neutral_claims to False to see litigation risk drop to LOW_COMPLIANT_DISCLOSURE.',
        check: {
          question: 'How can voluntary corporate sustainability reports or environmental disclosures create legal liability under US Federal Securities Law (SEC Rule 10b-5)?',
          options: [
            'If ESG disclosures contain materially false or misleading claims (such as fabricated carbon offsets) that mislead reasonable investors regarding corporate environmental risks or financial exposure.',
            'Because companies are legally prohibited from discussing environmental topics in public.',
            'Because sustainability reports must always be written entirely in Latin.',
            'Only if the CEO personally signs every single page of the report in duplicate.'
          ],
          answer: 0,
          why: 'Rule 10b-5 applies to all public statements by an issuer; materially misleading claims regarding green credentials or emissions that influence investor perceptions constitute actionable securities fraud.',
          answerIndex: 0,
          explanation: 'Rule 10b-5 applies to all public statements by an issuer; materially misleading claims regarding green credentials or emissions that influence investor perceptions constitute actionable securities fraud.'
        }
      },
      {
        title: 'Shareholder Lawsuits: Direct Actions vs Derivative Claims & SLCs',
        say: [
          'When corporate managers or directors breach their legal obligations, shareholders can seek judicial redress through two distinct procedural conduits: Direct Actions and Derivative Lawsuits.',
          'A Direct Action arises when the injury is suffered directly by the shareholder in their individual capacity — such as denial of voting rights, withholding of declared dividends, or selective share dilution.',
          'In contrast, a Derivative Lawsuit arises when the primary injury is suffered by the corporate entity itself — such as corporate waste, embezzlement, or director self-dealing.',
          'Because the corporation is the true victim in a derivative claim, any financial recovery won in court flows directly into the corporate bank account, not to the individual shareholder plaintiff!',
          'To prevent frivolous nuisance suits, corporate law imposes the "Demand on the Board" prerequisite: shareholders must formally petition the board of directors to initiate the lawsuit.',
          'However, under the Aronson v. Lewis Demand Futility Doctrine, demand is legally excused if the plaintiff proves that a majority of the board of directors is financially interested or conflicted in the challenged transaction.',
          'To regain control of derivative litigation, independent boards frequently appoint a Special Litigation Committee (SLC) of independent directors, which investigates the claims under the Zapata Corp v. Maldonado framework to determine whether continuing the lawsuit serves the corporation\'s best interests.'
        ],
        example: 'Think of a residential condominium building. If the building manager breaks your private apartment window, that is a Direct injury — you sue directly to replace your window. But if the building manager steals $50,000 from the condominium roof repair fund, that is a Derivative injury — the entire building was harmed. You must demand the HOA board sue the manager, and any recovered money goes back into the roof repair fund.',
        code: `# Simulation: Shareholder Lawsuit Direct/Derivative Router & Demand Futility Evaluator
def route_shareholder_litigation(
    plaintiff_name: str,
    injury_nature: str, # 'Dilution_Of_Voting_Power', 'Corporate_Asset_Misappropriation'
    board_majority_conflicted: bool,
    independent_slc_formed: bool
) -> dict:
    if injury_nature == "Dilution_Of_Voting_Power":
        suit_type = "DIRECT_SHAREHOLDER_ACTION"
        demand_status = "NO_DEMAND_REQUIRED"
        standing = "Direct individual standing; shareholder recovers individual damages."
    else:
        suit_type = "DERIVATIVE_ACTION_ON_BEHALF_OF_CORP"
        if board_majority_conflicted:
            demand_status = "DEMAND_EXCUSED_FUTILITY_DOCTRINE"
            standing = "Aronson test satisfied: majority board interested; court permits derivative litigation."
        else:
            demand_status = "DEMAND_REQUIRED"
            standing = "Plaintiff must serve formal demand on board; board retains Business Judgment Rule deference."

    return {
        "Plaintiff": plaintiff_name,
        "Lawsuit_Type": suit_type,
        "Demand_Doctrine": demand_status,
        "Standing_Ruling": standing
    }

lit_res = route_shareholder_litigation("Vanguard Institutional", "Corporate_Asset_Misappropriation", True, False)
print(f"Plaintiff: {lit_res['Plaintiff']} -> Suit: {lit_res['Lawsuit_Type']}")
print(f"Demand: {lit_res['Demand_Doctrine']} | Ruling: {lit_res['Standing_Ruling']}")`,
        output: `Plaintiff: Vanguard Institutional -> Suit: DERIVATIVE_ACTION_ON_BEHALF_OF_CORP\nDemand: DEMAND_EXCUSED_FUTILITY_DOCTRINE | Ruling: Aronson test satisfied: majority board interested; court permits derivative litigation.`,
        codeNotes: [
          { line: 8, note: 'Classifies litigation based on whether harm impacts individual shareholder rights or corporate treasury' },
          { line: 13, note: 'Applies Aronson Demand Futility rule: excused if board majority is compromised by personal conflicts' },
          { line: 17, note: 'Enforces prerequisite demand requirement if board retains independence and objective judgment' },
          { line: 29, note: 'Routes asset misappropriation claim to derivative standing with demand excused due to conflicted board' }
        ],
        tryIt: 'Change board_majority_conflicted to False to see the demand doctrine shift to DEMAND_REQUIRED under the Business Judgment Rule.',
        check: {
          question: 'In a successful Shareholder Derivative Lawsuit where corporate officers are found liable for embezzling company assets, who receives the monetary damages awarded by the court?',
          options: [
            'The corporation itself, because the primary injury was inflicted upon the corporate entity and its balance sheet.',
            'The individual shareholder who filed the lawsuit receives 100% of the funds in their personal checking account.',
            'The federal treasury confiscates the damages as a criminal tariff.',
            'The company\'s suppliers divide the money equally.'
          ],
          answer: 0,
          why: 'In a derivative lawsuit, the shareholder merely acts as a representative champion for the corporation; all damages recovered flow back into the company treasury to restore corporate value.',
          answerIndex: 0,
          explanation: 'In a derivative lawsuit, the shareholder merely acts as a representative champion for the corporation; all damages recovered flow back into the company treasury to restore corporate value.'
        }
      },
      {
        title: 'Hostile Takeovers: Poison Pills & The Unocal / Revlon Standards',
        say: [
          'In corporate mergers and acquisitions, when a target company\'s board of directors rejects an acquisition proposal, the prospective buyer may launch a Hostile Takeover — bypassing management by making an unsolicited Tender Offer directly to public shareholders.',
          'To defend against predatory corporate raiders and coercive two-tiered tender offers, corporate boards deploy powerful defensive mechanisms, spearheaded by the Shareholder Rights Plan ("Poison Pill").',
          'Invented by legendary corporate lawyer Martin Lipton, a Poison Pill grants existing shareholders (excluding the hostile raider) the legal right to purchase newly issued common shares at a massive 50% discount once a raider crosses a specific ownership threshold (typically 15%).',
          'When triggered, the poison pill detonates: millions of new discount shares flood the market, radically diluting the raider\'s ownership percentage and making the acquisition financially ruinous.',
          'Because poison pills grant incumbent boards immense power to entrench themselves, Delaware courts review defensive actions under two landmark heightened judicial scrutiny standards:',
          'The Unocal Standard (Unocal Corp v. Mesa Petroleum): Directors must prove that (1) they had reasonable grounds to believe a danger to corporate policy and effectiveness existed, and (2) the defensive measure was reasonable and proportionate in relation to the threat posed.',
          'The Revlon Duty (Revlon v. MacAndrews & Forbes): Once the sale or breakup of the company becomes inevitable, the board\'s role fundamentally transforms from corporate defenders into "auctioneers" — their sole fiduciary duty is to maximize the immediate cash price per share for shareholders.'
        ],
        example: 'Think of a hostile castle siege. The castle defenders (the board) pull up the drawbridge and pour boiling water (the poison pill) to fend off the invader. Under the Unocal standard, the court asks: "Was the boiling water a proportionate response to save the castle?" But once the castle walls crumble and surrender is inevitable, the Revlon duty kicks in: the king must stop fighting and negotiate the highest possible surrender ransom for the townspeople.',
        code: `# Simulation: Poison Pill Dilution Physics & Unocal Proportionality Evaluator
def simulate_shareholder_rights_plan_poison_pill(
    hostile_bidder_holding_pct: float,
    pill_trigger_threshold_pct: float, # typically 15%
    shares_outstanding: int,
    market_price_per_share: float,
    discount_rights_pct: float = 50.0
) -> dict:
    pill_triggered = hostile_bidder_holding_pct >= pill_trigger_threshold_pct

    if pill_triggered:
        # Non-hostile shareholders can buy shares at 50% discount, radically diluting the raider
        friendly_shareholders_shares = int(shares_outstanding * (1.0 - (hostile_bidder_holding_pct / 100.0)))
        new_discount_shares_issued = friendly_shareholders_shares * 1 # 1 right per share
        post_pill_total_shares = shares_outstanding + new_discount_shares_issued
        
        hostile_shares = int(shares_outstanding * (hostile_bidder_holding_pct / 100.0))
        post_pill_raider_pct = round((hostile_shares / post_pill_total_shares) * 100.0, 2)
        dilution_drop_pct = round(hostile_bidder_holding_pct - post_pill_raider_pct, 2)
        defense_status = "POISON_PILL_DETONATED_RAIDER_MASSIVELY_DILUTED"
    else:
        post_pill_raider_pct = hostile_bidder_holding_pct
        dilution_drop_pct = 0.0
        defense_status = "PILL_DORMANT_BELOW_TRIGGER_THRESHOLD"

    return {
        "Trigger_Threshold": f"{pill_trigger_threshold_pct}%",
        "Raider_Accumulation": f"{hostile_bidder_holding_pct}%",
        "Defense_Status": defense_status,
        "Post_Detonation_Raider_Holding": f"{post_pill_raider_pct}%",
        "Ownership_Dilution_Drop": f"-{dilution_drop_pct}%",
        "Unocal_Standard": "PROPORTIONATE_DEFENSE_UPHELD" if pill_triggered else "STANDBY"
    }

pill_res = simulate_shareholder_rights_plan_poison_pill(
    hostile_bidder_holding_pct=16.5,
    pill_trigger_threshold_pct=15.0,
    shares_outstanding=10000000,
    market_price_per_share=50.0,
    discount_rights_pct=50.0
)
print(f"Status: {pill_res['Defense_Status']}")
print(f"Raider Holding: {pill_res['Raider_Accumulation']} -> Diluted To: {pill_res['Post_Detonation_Raider_Holding']} ({pill_res['Ownership_Dilution_Drop']})")
print(f"Judicial Scrutiny: {pill_res['Unocal_Standard']}")`,
        output: `Status: POISON_PILL_DETONATED_RAIDER_MASSIVELY_DILUTED\nRaider Holding: 16.5% -> Diluted To: 8.99% (-7.51%)\nJudicial Scrutiny: PROPORTIONATE_DEFENSE_UPHELD`,
        codeNotes: [
          { line: 9, note: 'Triggers rights plan when hostile bidder crosses ownership threshold (16.5% vs 15.0% threshold)' },
          { line: 13, note: 'Issues deeply discounted shares exclusively to non-hostile shareholders, multiplying share count' },
          { line: 17, note: 'Drastically dilutes raider ownership stake from 16.5% down to 8.99%, destroying takeover economics' },
          { line: 36, note: 'Confirms defense satisfies Unocal proportionality test against coercive takeover threat' }
        ],
        tryIt: 'Lower hostile_bidder_holding_pct to 12.0% to observe the poison pill remain dormant below the trigger line.',
        check: {
          question: 'Under the Delaware Supreme Court\'s landmark Revlon doctrine, how does the fiduciary duty of a target company\'s board of directors fundamentally change once the sale or breakup of the corporation becomes inevitable?',
          options: [
            'The board\'s role transforms from defending the corporate entity into acting as neutral auctioneers charged with maximizing the immediate cash value per share for shareholders.',
            'The board is legally required to burn all corporate records.',
            'The board must immediately file for Chapter 7 liquidation bankruptcy.',
            'The directors are forbidden from communicating with shareholders or investment bankers.'
          ],
          answer: 0,
          why: 'Under Revlon, defensive barriers like poison pills must be redeemed once a sale is inevitable; the board must secure the highest transaction price available in the open market.',
          answerIndex: 0,
          explanation: 'Under Revlon, defensive barriers like poison pills must be redeemed once a sale is inevitable; the board must secure the highest transaction price available in the open market.'
        }
      }
    ],
    summary: [
      'Intellectual Property & DTSA: Intangible assets dominate modern balance sheets; trade secrets require reasonable secrecy protocols (NDAs, encrypted access) to sustain federal DTSA protection.',
      'SOX 404 Internal Controls: Classifies accounting gaps into Control Deficiency, Significant Deficiency, and Material Weakness; protects whistleblowers from retaliation under Dodd-Frank.',
      'ESG & Greenwashing: The G pillar enforces board independence and executive clawback rules; unsubstantiated environmental claims trigger direct securities fraud liability under Rule 10b-5.',
      'Shareholder Litigation: Direct actions protect individual shareholder rights; derivative lawsuits recover damages for the corporate treasury, subject to demand futility under Aronson.',
      'Hostile Takeover Defense: Poison pills dilute hostile raiders; boards must satisfy the Unocal proportionality standard, pivoting to Revlon auctioneer duties once a corporate sale is inevitable.'
    ],
    projectStep: {
      title: 'Corporate Legal Governance & Shareholder Defense Architecture',
      steps: [
        'Audit corporate intangible assets under Defend Trade Secrets Act (DTSA) reasonable secrecy protocols.',
        'Construct a SOX 404 internal control deficiency classification matrix with whistleblower escalation trees.',
        'Model shareholder rights plan (Poison Pill) dilution physics and evaluate board defense proportionality under the Unocal / Revlon standards.'
      ]
    }
  },
  {
    coursePrefix: 'bcom_law',
    day: 3,
    title: 'M&A Legal Due Diligence, Reps & Warranties, MAE Clauses & Antitrust HHI',
    goal: 'Master mergers and acquisitions (M&A) legal practice: comprehensive legal due diligence risk scoring, definitive purchase agreement Representations & Warranties and Rep & Warranty Insurance (RWI) recovery, Delaware Material Adverse Effect (MAE / MAC) litigation standards, 2023 FTC/DOJ Horizontal Merger Guidelines and HHI concentration analysis, and deal protection breakup fees under Revlon and Omnicare.',
    minutes: 45,
    recap: 'In high-stakes corporate mergers and acquisitions, the definitive transaction agreement is not merely a financial deal sheet—it is an intricate legal mechanism for allocating catastrophic business risks, regulatory hurdles, and post-closing liabilities between buyer and seller.',
    parts: [
      {
        title: 'M&A Legal Due Diligence Architecture & Red-Flag Risk Scoring',
        say: [
          'Prior to executing a definitive Stock Purchase Agreement (SPA) or Asset Purchase Agreement (APA), the buyer\'s legal counsel conducts comprehensive Legal Due Diligence across the target company\'s virtual data room (VDR). The objective is not merely descriptive; it is defensive risk discovery to uncover undisclosed liabilities, defective title, broken chain of title in intellectual property, regulatory violations, and commercial contract impediments that could destroy transaction value.',
          'A critical focus of commercial contract due diligence is identifying Change of Control (CoC) and Anti-Assignment clauses. Many enterprise customer or supplier agreements specify that a change in ownership exceeding 50% constitutes an automatic event of default or grants the counterparty an immediate unilateral right to terminate. If a target company\'s top revenue customer refuses to grant written CoC consent prior to closing, the entire commercial premise of the acquisition evaporates.',
          'Simultaneously, counsel quantifies contingent litigation exposure and environmental liabilities under the Comprehensive Environmental Response, Compensation, and Liability Act (CERCLA). Because CERCLA imposes strict, joint, and several liability on current facility owners regardless of who originally contaminated the soil, an undetected chemical spill can bankrupt the acquirer. Due diligence findings directly dictate whether the buyer proceeds, demands special indemnity escrows, or walks away entirely.'
        ],
        example: 'During due diligence of a $100M target, counsel discovers an unconsented Change of Control clause on a customer generating 25% of sales, $6.5M in pending patent litigation damages, and an unassigned software copyright defect. The risk score reaches 90, triggering an urgent recommendation to TERMINATE_OR_REPRICE_TRANSACTION.',
        code: `# M&A Legal Due Diligence Risk Scoring & Deal Breaker Detector
def evaluate_ma_due_diligence_risks(contracts: list, litigation_claims: list, ip_defects: int, environmental_remediation_usd: float) -> dict:
    risk_score = 0
    deal_breakers = []
    
    # 1. Review Change of Control (CoC) clauses
    coc_breaches = [c for c in contracts if c.get("has_change_of_control") and not c.get("consented")]
    if coc_breaches:
        risk_score += len(coc_breaches) * 15
        if any(c.get("revenue_pct", 0) > 20.0 for c in coc_breaches):
            deal_breakers.append("KEY_CUSTOMER_COC_CONSENT_UNOBTAINED")
            
    # 2. Review Litigation exposure
    total_litigation_exposure = sum(l["potential_damages"] for l in litigation_claims if l["likelihood"] in ["probable", "reasonably_possible"])
    if total_litigation_exposure > 5000000.0:
        risk_score += 30
        deal_breakers.append("HIGH_LITIGATION_EXPOSURE")
        
    # 3. IP Ownership chain
    if ip_defects > 0:
        risk_score += ip_defects * 20
        deal_breakers.append("BROKEN_IP_ASSIGNMENT_CHAIN")
        
    # 4. Environmental liabilities
    if environmental_remediation_usd > 2000000.0:
        risk_score += 25
        
    recommendation = "PROCEED_TO_DEFINITIVE_AGREEMENT" if risk_score < 30 else ("SPECIAL_INDEMNITY_ESCROW_REQUIRED" if risk_score < 60 else "TERMINATE_OR_REPRICE_TRANSACTION")
    
    return {
        "due_diligence_risk_score": risk_score,
        "deal_breakers_identified": deal_breakers,
        "total_litigation_exposure_usd": round(total_litigation_exposure, 2),
        "environmental_clean_up_usd": round(environmental_remediation_usd, 2),
        "recommendation": recommendation
    }

p1 = evaluate_ma_due_diligence_risks(
    contracts=[
        {"id": "CTR_1", "has_change_of_control": True, "consented": False, "revenue_pct": 25.0},
        {"id": "CTR_2", "has_change_of_control": False, "consented": True, "revenue_pct": 10.0}
    ],
    litigation_claims=[
        {"id": "LIT_1", "potential_damages": 6500000.0, "likelihood": "probable"}
    ],
    ip_defects=1, environmental_remediation_usd=2500000.0
)
lit_exp_str = "$" + f"{p1['total_litigation_exposure_usd']:,.2f}"
print(f"Due Diligence Risk Score: {p1['due_diligence_risk_score']} | Rec: {p1['recommendation']}")
print(f"Deal Breakers: {p1['deal_breakers_identified']} | Lit Exposure: {lit_exp_str}")`,
        output: `Due Diligence Risk Score: 90 | Rec: TERMINATE_OR_REPRICE_TRANSACTION
Deal Breakers: ['KEY_CUSTOMER_COC_CONSENT_UNOBTAINED', 'HIGH_LITIGATION_EXPOSURE', 'BROKEN_IP_ASSIGNMENT_CHAIN'] | Lit Exposure: $6,500,000.00`,
        codeNotes: [
          { line: 6, note: 'Screens customer contracts for unconsented Change of Control clauses affecting >20% revenue' },
          { line: 13, note: 'Aggregates probable and reasonably possible litigation exposure exceeding $5.0M threshold' },
          { line: 20, note: 'Penalizes broken intellectual property assignment chains that jeopardize software ownership' },
          { line: 38, note: 'Identifies 3 critical deal breakers, generating recommendation to terminate or reprice transaction' }
        ],
        tryIt: 'Mark CTR_1 as consented=True to remove the CoC deal breaker and observe risk score drop to 75.',
        check: {
          question: 'Why are Change of Control (CoC) clauses in key supplier and customer agreements considered top-tier deal risks in M&A due diligence?',
          options: [
            'If a key counterparty refuses to consent to the ownership transfer, they can terminate the contract immediately upon closing, destroying the revenue foundation of the deal.',
            'CoC clauses force the buyer to rehire all previous executives at double salary.',
            'CoC clauses automatically convert common equity into municipal bonds.',
            'CoC clauses require the target company to physically relocate its headquarters to another state.'
          ],
          answer: 0,
          why: 'Counterparties can weaponize CoC provisions to exit unfavorable pricing or demand massive renegotiation fees, posing severe revenue attrition risks to the acquirer.',
          answerIndex: 0,
          explanation: 'Counterparties can weaponize CoC provisions to exit unfavorable pricing or demand massive renegotiation fees, posing severe revenue attrition risks to the acquirer.'
        }
      },
      {
        title: 'Representations & Warranties, Indemnification Baskets, Caps & RWI Insurance',
        say: [
          'In the definitive acquisition agreement, Representations & Warranties (Reps & Warranties) serve as the seller\'s formal statements of fact regarding the target company\'s financial condition, tax compliance, legal standing, capitalization, and asset title. If an undisclosed tax lien or customer fraud emerges post-closing, the buyer brings a contractual claim for breach of representation under the agreement\'s Indemnification article.',
          'To prevent frivolous nuisance litigation while capping the seller\'s total downside exposure, M&A agreements negotiate strict indemnification parameters: Baskets and Caps. An Indemnity Basket sets a financial threshold before the seller pays anything: a Deductible basket pays only the excess above the threshold (e.g. claim of $1.5M on a $1.0M deductible pays $500k), whereas a Tipping (First-Dollar) basket pays 100% of the claim from dollar one once the threshold is crossed ($1.5M payout). Meanwhile, the Indemnity Cap establishes the absolute ceiling of seller liability, typically negotiated at 5% to 15% of the transaction purchase price.',
          'In modern private equity and strategic M&A, the market has widely adopted Representation & Warranty Insurance (RWI). Under an RWI policy, an independent commercial insurer underwrites the target\'s reps: the seller\'s indemnity cap is reduced to a nominal amount (or even a "public style" zero-escrow structure), and the insurer covers losses exceeding the retention deductible up to policy limits (typically 10% of enterprise value), facilitating clean exits for selling shareholders.'
        ],
        example: 'On a $100M transaction with a $1.0M tipping basket and 5% ($5.0M) seller indemnity cap, the buyer discovers an $8.0M undisclosed environmental tax breach. The tipping basket is crossed, the seller pays its maximum $5.0M cap, and the buyer\'s RWI policy pays the remaining $3.0M excess, achieving 100% recovery ($8.0M total).',
        code: `# M&A Indemnification Waterfall, Basket Mechanics & RWI Recovery Engine
def calculate_indemnification_and_rwi_payout(claim_amount: float, purchase_price: float,
                                             basket_type: str, basket_amount: float,
                                             seller_cap_pct: float, rwi_policy: dict) -> dict:
    # Check basket (Tipping vs Deductible)
    if claim_amount < basket_amount:
        seller_liability = 0.0
        covered_loss = 0.0
    else:
        if basket_type == "tipping":
            covered_loss = claim_amount # Recovers from dollar one once exceeded
        else: # deductible
            covered_loss = claim_amount - basket_amount
            
    seller_cap_usd = purchase_price * (seller_cap_pct / 100.0)
    seller_payout = min(covered_loss, seller_cap_usd)
    
    # RWI Policy coverage (excess over seller indemnity or retention)
    rwi_payout = 0.0
    if rwi_policy.get("active") and covered_loss > seller_cap_usd:
        excess_loss = covered_loss - seller_cap_usd
        rwi_payout = min(excess_loss, rwi_policy.get("policy_limit", 0.0))
        
    total_buyer_recovery = seller_payout + rwi_payout
    unrecovered_loss = claim_amount - total_buyer_recovery
    
    return {
        "claim_amount": claim_amount,
        "basket_exceeded": claim_amount >= basket_amount,
        "seller_cap_usd": round(seller_cap_usd, 2),
        "seller_indemnity_payout": round(seller_payout, 2),
        "rwi_insurance_payout": round(rwi_payout, 2),
        "total_recovery_usd": round(total_buyer_recovery, 2),
        "unrecovered_buyer_loss": round(unrecovered_loss, 2)
    }

p2 = calculate_indemnification_and_rwi_payout(
    claim_amount=8000000.0, purchase_price=100000000.0,
    basket_type="tipping", basket_amount=1000000.0,
    seller_cap_pct=5.0,
    rwi_policy={"active": True, "policy_limit": 10000000.0}
)
claim_str = "$" + f"{p2['claim_amount']:,.2f}"
seller_cap_str = "$" + f"{p2['seller_cap_usd']:,.2f}"
seller_str = "$" + f"{p2['seller_indemnity_payout']:,.2f}"
rwi_str = "$" + f"{p2['rwi_insurance_payout']:,.2f}"
rec_str = "$" + f"{p2['total_recovery_usd']:,.2f}"
unrec_str = "$" + f"{p2['unrecovered_buyer_loss']:,.2f}"
print(f"Claim: {claim_str} | Seller Cap: {seller_cap_str} -> Seller Paid: {seller_str}")
print(f"RWI Paid: {rwi_str} | Total Recovery: {rec_str} | Unrecovered: {unrec_str}")`,
        output: `Claim: $8,000,000.00 | Seller Cap: $5,000,000.00 -> Seller Paid: $5,000,000.00
RWI Paid: $3,000,000.00 | Total Recovery: $8,000,000.00 | Unrecovered: $0.00`,
        codeNotes: [
          { line: 6, note: 'Evaluates tipping basket mechanics where exceeding threshold unlocks 100% first-dollar recovery' },
          { line: 15, note: 'Caps seller cash indemnity exposure at 5% of purchase price ($5.0M)' },
          { line: 19, note: 'Routes remaining $3.0M excess loss to Rep & Warranty Insurance policy under policy limits' },
          { line: 39, note: 'Achieves 100% buyer loss recovery ($8.0M) across combined seller indemnity and RWI coverage' }
        ],
        tryIt: 'Switch basket_type to "deductible" and observe covered loss drop by $1.0M, resulting in $7.0M total recovery.',
        check: {
          question: 'What is the critical legal difference between a "Deductible" indemnity basket and a "Tipping" (or first-dollar) indemnity basket in an acquisition agreement?',
          options: [
            'Under a deductible basket, the buyer recovers only the amount that exceeds the threshold; under a tipping basket, once the threshold is crossed, the buyer recovers all losses from dollar one.',
            'A tipping basket requires the buyer to tip the seller\'s attorneys an additional 15% gratuity.',
            'A deductible basket only applies to intellectual property claims.',
            'A tipping basket cannot be enforced under Delaware or New York law.'
          ],
          answer: 0,
          why: 'A deductible basket permanently absorbs the first dollar losses up to the threshold, whereas a tipping basket triggers full retroactive recovery of all losses once breached.',
          answerIndex: 0,
          explanation: 'A deductible basket permanently absorbs the first dollar losses up to the threshold, whereas a tipping basket triggers full retroactive recovery of all losses once breached.'
        }
      },
      {
        title: 'Material Adverse Effect (MAE / MAC) Clauses & Deal Walkaway Litigation',
        say: [
          'Between the signing of a definitive merger agreement and the final closing date (which can span 6 to 18 months for regulatory clearances), market conditions or company operations may suffer catastrophic degradation. Acquirers frequently attempt to terminate the transaction and walk away without penalty by asserting that a Material Adverse Effect (MAE) or Material Adverse Change (MAC) has occurred, excusing their obligation to close.',
          'Under established Delaware Court of Chancery jurisprudence (landmark rulings including IBP v. Tyson Foods, Hexion v. Huntsman, and Akorn v. Fresenius), proving an MAE faces an exceptionally high judicial hurdle. The court requires that the adverse event must substantially threaten the overall earnings potential of the target in a durationally significant manner—measured in years, not months (the "duration test", typically requiring >= 24 months of severe impairment).',
          'Furthermore, M&A agreements negotiate extensive "carve-outs" in the definition of an MAE: general economic recessions, stock market drops, changes in law/GAAP, and industry-wide declines are explicitly excluded from qualifying as an MAE unless the target is "disproportionately affected" compared to industry peers. If the buyer improperly terminates without establishing a bona fide MAE, the Delaware Chancery Court will reject the claim and order Specific Performance, legally compelling the buyer to close the multi-billion-dollar deal.',
          'In Akorn v. Fresenius, the Delaware Supreme Court upheld an MAE termination for the first time in history because the target suffered a persistent 50%+ collapse in operating EBITDA spanning multiple years coupled with pervasive regulatory data fraud, satisfying both the durational significance and company-specific disproportionate impact standards.'
        ],
        example: 'A target company suffers a 48% EBITDA collapse persisting over 30 months while industry peers drop only 10% (38% disproportionate gap). The court finds durational significance and disproportionate harm, ruling VALID_MAE_ACQUIRER_MAY_WALK_AWAY and relieving the buyer from closing.',
        code: `# Material Adverse Effect (MAE) Delaware Jurisprudential Evaluator
def evaluate_material_adverse_effect_mae(ebitda_drop_pct: float, duration_months: int,
                                         industry_wide_drop_pct: float, has_disproportionate_impact: bool,
                                         systemic_force_majeure: bool) -> dict:
    # Delaware Court of Chancery standard:
    # 1. Impairment must be consequential to earning power over a commercially reasonable period (measured in years, e.g. >= 24 months)
    # 2. General market/industry downturns are carved out UNLESS disproportionate impact
    duration_test_passed = duration_months >= 24
    severe_earning_drop = ebitda_drop_pct >= 40.0
    
    is_carve_out = systemic_force_majeure and (not has_disproportionate_impact)
    
    relative_industry_gap = ebitda_drop_pct - industry_wide_drop_pct
    
    is_mae_proven = duration_test_passed and severe_earning_drop and not is_carve_out and (has_disproportionate_impact or industry_wide_drop_pct < 15.0)
    
    verdict = "VALID_MAE_ACQUIRER_MAY_WALK_AWAY" if is_mae_proven else "NO_MAE_SPECIFIC_PERFORMANCE_ORDERED"
    
    return {
        "ebitda_drop_pct": ebitda_drop_pct,
        "duration_months": duration_months,
        "relative_industry_gap": round(relative_industry_gap, 2),
        "carve_out_exception_triggered": is_carve_out,
        "mae_judicially_proven": is_mae_proven,
        "legal_verdict": verdict
    }

p3 = evaluate_material_adverse_effect_mae(
    ebitda_drop_pct=48.0, duration_months=30,
    industry_wide_drop_pct=10.0, has_disproportionate_impact=True,
    systemic_force_majeure=False
)
print(f"EBITDA Drop: {p3['ebitda_drop_pct']}% over {p3['duration_months']}m | Relative Gap: {p3['relative_industry_gap']}%")
print(f"MAE Proven: {p3['mae_judicially_proven']} -> Verdict: {p3['legal_verdict']}")`,
        output: `EBITDA Drop: 48.0% over 30m | Relative Gap: 38.0%
MAE Proven: True -> Verdict: VALID_MAE_ACQUIRER_MAY_WALK_AWAY`,
        codeNotes: [
          { line: 6, note: 'Applies Delaware Chancery durational significance test requiring impairment to span >= 24 months' },
          { line: 9, note: 'Evaluates standard industry-wide carve-outs and tests for disproportionate adverse impact' },
          { line: 13, note: 'Synthesizes severe earnings collapse (48%), durational persistence, and peer divergence' },
          { line: 29, note: 'Confirms valid MAE under Akorn v. Fresenius standard, entitling acquirer to walk away' }
        ],
        tryIt: 'Reduce duration_months to 6 months to observe the short-term blip fail the durational significance test.',
        check: {
          question: 'Under Delaware Court of Chancery jurisprudence (e.g. IBP v. Tyson Foods), what durational timeframe is required for an economic downturn to qualify as a Material Adverse Effect?',
          options: [
            'The downturn must be consequential to the company\'s overall earning potential over a commercially reasonable period measured in years, rather than a short-term blip measured in months or quarters.',
            'A single poor quarterly earnings report of any magnitude is sufficient.',
            'The downturn must last for at least 50 continuous years.',
            'Delaware courts do not enforce MAE clauses under any circumstances.'
          ],
          answer: 0,
          why: 'Vice Chancellor Strine established in IBP that an MAE requires durational significance—an adverse event that alters the long-term foundational earnings power of the enterprise over several years.',
          answerIndex: 0,
          explanation: 'Vice Chancellor Strine established in IBP that an MAE requires durational significance—an adverse event that alters the long-term foundational earnings power of the enterprise over several years.'
        }
      },
      {
        title: 'FTC / DOJ Antitrust Merger Guidelines, Market Concentration & HHI Delta',
        say: [
          'Under Section 7 of the Clayton Act, the Federal Trade Commission (FTC) and the Department of Justice (DOJ) Antitrust Division have statutory authority to challenge mergers and acquisitions where the effect "may be substantially to lessen competition, or to tend to create a monopoly." To enforce this standard objectively, antitrust regulators define the relevant product and geographic market and evaluate market concentration using the Herfindahl-Hirschman Index (HHI).',
          'The HHI is calculated by summing the squares of individual market shares of all firms in the market: HHI = sum of (s_i^2). In an M&A transaction between Firm A and Firm B, the post-merger increase in concentration (the HHI Delta) equals twice the product of their individual market shares: Delta HHI = 2 * s_A * s_B. Under the modernized 2023 FTC/DOJ Merger Guidelines, any market with a post-merger HHI exceeding 1,800 is classified as Highly Concentrated, and an acquisition that increases HHI by more than 100 points triggers a structural legal presumption that the merger is unlawful.',
          'When regulators issue a "Second Request" comprehensive civil investigative demand, merging parties face multi-year antitrust review. To resolve antitrust objections without litigation, merging parties frequently negotiate Structural Remedies: committing to divest overlapping operating business units or production facilities to an independent third party, effectively shrinking the combined post-merger market share and reducing the HHI Delta below contentious thresholds.'
        ],
        example: 'In a market with shares [30%, 25%, 20%, 15%, 10%] (Pre-HHI 2,250), the top two firms merge. Without remedies, Delta HHI would be +1,500. Proposing a 5% divestiture reduces post-merger share to 50% and Delta HHI to +1,000, but Post-HHI remains 3,250, prompting the FTC to issue a SECOND_REQUEST_CHALLENGE_INJUNCTION.',
        code: `# FTC/DOJ Horizontal Merger Antitrust HHI Concentration & Remedy Engine
def analyze_antitrust_merger_hhi(market_shares: list, firm_a_idx: int, firm_b_idx: int,
                                 divestiture_market_share: float = 0.0) -> dict:
    pre_hhi = sum(s ** 2 for s in market_shares)
    
    s_a = market_shares[firm_a_idx]
    s_b = market_shares[firm_b_idx]
    
    combined_share = (s_a + s_b) - divestiture_market_share
    delta_hhi = 2 * s_a * s_b - (2 * divestiture_market_share * (s_a + s_b - divestiture_market_share))
    post_hhi = pre_hhi + delta_hhi
    
    # 2023 FTC/DOJ Merger Guidelines:
    # Highly Concentrated if Post-HHI > 1,800, Delta > 100 triggers structural presumption of illegality
    is_highly_concentrated = post_hhi > 1800.0
    presumption_of_unlawfulness = is_highly_concentrated and delta_hhi >= 100.0
    
    regulatory_remedy = "SECOND_REQUEST_CHALLENGE_INJUNCTION" if presumption_of_unlawfulness else ("MODERATE_SCRUTINY_SETTLEMENT" if delta_hhi >= 50.0 else "CLEARANCE_GRANTED_NO_OBJECTION")
    
    return {
        "pre_merger_hhi": round(pre_hhi, 1),
        "post_merger_hhi": round(post_hhi, 1),
        "delta_hhi": round(delta_hhi, 1),
        "combined_market_share_pct": round(combined_share, 1),
        "presumption_of_unlawfulness": presumption_of_unlawfulness,
        "regulatory_remedy": regulatory_remedy
    }

p4 = analyze_antitrust_merger_hhi(
    market_shares=[30.0, 25.0, 20.0, 15.0, 10.0],
    firm_a_idx=0, firm_b_idx=1, divestiture_market_share=5.0
)
print(f"Pre-Merger HHI: {p4['pre_merger_hhi']} -> Post-Merger HHI: {p4['post_merger_hhi']} (Delta: +{p4['delta_hhi']})")
print(f"Combined Share: {p4['combined_market_share_pct']}% | Presumption: {p4['presumption_of_unlawfulness']} -> {p4['regulatory_remedy']}")`,
        output: `Pre-Merger HHI: 2250.0 -> Post-Merger HHI: 3250.0 (Delta: +1000.0)
Combined Share: 50.0% | Presumption: True -> SECOND_REQUEST_CHALLENGE_INJUNCTION`,
        codeNotes: [
          { line: 3, note: 'Computes baseline industry concentration by summing squared market shares (Pre-HHI 2,250)' },
          { line: 9, note: 'Calculates concentration delta (2 * s1 * s2) factoring in proposed divestiture market relief' },
          { line: 15, note: 'Applies 2023 FTC/DOJ thresholds: Post-HHI > 1,800 and Delta >= 100 trigger illegality presumption' },
          { line: 31, note: 'Flags mega-merger creating 50% dominant firm with +1,000 Delta HHI for antitrust challenge' }
        ],
        tryIt: 'Increase divestiture_market_share to 20% to observe concentration drop and evaluate antitrust settlement viability.',
        check: {
          question: 'Under the FTC/DOJ Horizontal Merger Guidelines, what mathematical threshold triggers a structural legal presumption that a horizontal merger is anti-competitive?',
          options: [
            'In a highly concentrated market (post-merger HHI > 1,800), an increase in HHI (Delta HHI) of more than 100 points.',
            'The merging companies have fewer than 10 employees.',
            'The merger increases total national GDP by more than 5%.',
            'The combined company issues more than 1,000 credit cards.'
          ],
          answer: 0,
          why: 'The 2023 Merger Guidelines establish a formal legal presumption of anti-competitive harm when a merger in a highly concentrated market increases HHI by >= 100 points.',
          answerIndex: 0,
          explanation: 'The 2023 Merger Guidelines establish a formal legal presumption of anti-competitive harm when a merger in a highly concentrated market increases HHI by >= 100 points.'
        }
      },
      {
        title: 'Breakup Fees, Reverse Breakup Fees & Deal Protection Covenants',
        say: [
          'To incentivize an acquirer to invest millions of dollars in transaction due diligence and financing commitments, merger agreements contain Deal Protection Covenants: "No-Shop" provisions (restricting the target from actively soliciting competing bids), "Window-Shop" exceptions (allowing the target board to review unsolicited superior offers under their fiduciary duties), and "Match Rights" (giving the original buyer the right to match any higher proposal).',
          'If the target company\'s board exercises its "fiduciary out" to terminate the merger agreement and accept a superior topping bid from a rival bidder, the target must pay the original acquirer a Target Breakup Fee (Termination Fee). Under Delaware corporate jurisprudence (e.g. Omnicare v. NCS Healthcare and Brazen v. Bell Atlantic), breakup fees are subject to enhanced judicial scrutiny: courts uphold termination fees as reasonable liquidated damages if they fall within the established market range of 2.0% to 4.0% of transaction equity value. If a fee exceeds 4.5% to 5.0%, courts strike it down as coercive and preclusive of competing bids.',
          'Conversely, modern acquisition agreements routinely negotiate a Buyer Reverse Breakup Fee (typically 5.0% to 8.0% of transaction value). A reverse breakup fee is payable by the buyer to the target if the deal collapses due to factors within the buyer\'s responsibility—specifically failure to secure regulatory antitrust clearance or failure to close debt financing syndication. This reverse fee provides the target with monetary compensation for the reputational damage and employee attrition suffered during prolonged regulatory review.'
        ],
        example: 'On a $500M transaction, the agreement stipulates a 3.2% ($16.0M) target breakup fee and a 6.0% ($30.0M) buyer reverse breakup fee. The target accepts an unsolicited superior proposal; the 3.2% fee is confirmed legally enforceable under Delaware standards, and the target pays $16.0M to the disappointed buyer.',
        code: `# M&A Deal Protection Covenants & Breakup Fee Enforceability Engine
def evaluate_deal_protection_and_breakup_fees(equity_value_usd: float, target_breakup_fee_pct: float,
                                              reverse_breakup_fee_pct: float, breaching_party: str,
                                              breach_reason: str) -> dict:
    target_fee_usd = equity_value_usd * (target_breakup_fee_pct / 100.0)
    reverse_fee_usd = equity_value_usd * (reverse_breakup_fee_pct / 100.0)
    
    # Delaware corporate law scrutiny:
    # Target breakup fee > 4.0% is preclusive/coercive under Omnicare
    is_target_fee_reasonable = target_breakup_fee_pct <= 4.0
    
    payable_fee_usd = 0.0
    fee_type = "NONE"
    
    if breaching_party == "target":
        if breach_reason in ["superior_proposal_accepted", "fiduciary_out_exercised"]:
            payable_fee_usd = target_fee_usd
            fee_type = "TARGET_BREAKUP_FEE"
    elif breaching_party == "buyer":
        if breach_reason in ["antitrust_clearance_failed", "financing_failure"]:
            payable_fee_usd = reverse_fee_usd
            fee_type = "BUYER_REVERSE_BREAKUP_FEE"
            
    return {
        "equity_value_usd": equity_value_usd,
        "target_breakup_fee_pct": target_breakup_fee_pct,
        "target_fee_usd": round(target_fee_usd, 2),
        "is_target_fee_enforceable": is_target_fee_reasonable,
        "reverse_breakup_fee_pct": reverse_breakup_fee_pct,
        "reverse_fee_usd": round(reverse_fee_usd, 2),
        "breaching_party": breaching_party,
        "breach_reason": breach_reason,
        "payable_fee_usd": round(payable_fee_usd, 2),
        "fee_type": fee_type
    }

p5 = evaluate_deal_protection_and_breakup_fees(
    equity_value_usd=500000000.0, target_breakup_fee_pct=3.2,
    reverse_breakup_fee_pct=6.0, breaching_party="target",
    breach_reason="superior_proposal_accepted"
)
target_str = "$" + f"{p5['target_fee_usd']:,.2f}"
payable_str = "$" + f"{p5['payable_fee_usd']:,.2f}"
print(f"Target Breakup Fee: {p5['target_breakup_fee_pct']}% ({target_str}) | Enforceable: {p5['is_target_fee_enforceable']}")
print(f"Breach Event: {p5['breaching_party']} ({p5['breach_reason']}) -> Fee Paid: {payable_str} ({p5['fee_type']})")`,
        output: `Target Breakup Fee: 3.2% ($16,000,000.00) | Enforceable: True
Breach Event: target (superior_proposal_accepted) -> Fee Paid: $16,000,000.00 (TARGET_BREAKUP_FEE)`,
        codeNotes: [
          { line: 6, note: 'Applies Delaware Omnicare preclusion standard capping reasonable target breakup fees at 4.0%' },
          { line: 12, note: 'Triggers target termination fee upon board exercise of fiduciary out to accept superior bid' },
          { line: 16, note: 'Models buyer reverse breakup fee (6.0%) payable if transaction fails antitrust or financing condition' },
          { line: 36, note: 'Validates $16.0M breakup fee payout following acceptance of rival acquisition proposal' }
        ],
        tryIt: 'Increase target_breakup_fee_pct to 6.5% and observe the engine flag the fee as unenforceable and preclusive.',
        check: {
          question: 'Under Delaware corporate law (e.g. Omnicare v. NCS Healthcare), why will courts invalidate a target company breakup fee that exceeds 4.5% to 5.0% of deal value?',
          options: [
            'An excessively high breakup fee is legally coercive and preclusive, improperly deterring rival bidders from submitting superior offers to maximize shareholder value.',
            'Breakup fees exceeding $10M are prohibited by the United States Constitution.',
            'Target boards are never allowed to agree to any financial penalties.',
            'Breakup fees must be paid in gold coins rather than wire transfers.'
          ],
          answer: 0,
          why: 'A breakup fee that is too large creates a punitive economic barrier that prevents rival bidders from topping the bid, violating the board\'s duty to maintain a fair playing field.',
          answerIndex: 0,
          explanation: 'A breakup fee that is too large creates a punitive economic barrier that prevents rival bidders from topping the bid, violating the board\'s duty to maintain a fair playing field.'
        }
      }
    ],
    summary: [
      'M&A Legal Due Diligence: Uncovers Change of Control contract triggers, litigation contingencies, broken IP assignment chains, and CERCLA environmental remediation liabilities.',
      'Reps, Warranties & RWI: Allocates post-closing risk via tipping vs deductible indemnity baskets, seller liability caps (5-15%), and Representation & Warranty Insurance policies.',
      'Material Adverse Effect (MAE): Enforces Delaware Chancery durational significance (>= 24 months) and industry carve-out exceptions under Akorn v. Fresenius precedent.',
      'Antitrust Merger Guidelines: Applies 2023 FTC/DOJ standards, evaluating HHI concentration (> 1,800) and delta (+100) to identify mergers subject to structural injunctions.',
      'Deal Protection & Breakup Fees: Balances No-Shop covenants and fiduciary outs; caps enforceable target fees at 2-4% under Omnicare and structures 5-8% buyer reverse breakup fees.'
    ],
    projectStep: {
      title: 'M&A Transaction Legal Architecture & Antitrust Control Suite',
      steps: [
        'Audit virtual data room documentation and score M&A due diligence risks across Change of Control and IP ownership.',
        'Model definitive agreement indemnification waterfalls with tipping baskets, caps, and RWI insurance policies.',
        'Evaluate transaction closing conditions against Delaware Court of Chancery Material Adverse Effect (MAE) standards.',
        'Compute antitrust HHI concentration deltas and assess deal protection breakup fee enforceability under Omnicare.'
      ]
    }
  },
  {
    coursePrefix: 'bcom_law',
    day: 4,
    title: 'Corporate Governance, Fiduciary Oversight, Shareholder Activism & SEC Compliance',
    goal: 'Master advanced corporate governance and securities regulatory frameworks: Delaware Caremark and Marchand board oversight and mission-critical risk monitoring, shareholder activism under Section 13(d) Schedule 13D and SEC universal proxy rules, SEC Rule 10b5-1 pre-planned trading plan safe harbors and cooling-off periods, SEC Regulation Fair Disclosure (Reg FD) selective disclosure compliance, and corporate internal investigations under Upjohn attorney-client privilege.',
    minutes: 45,
    recap: 'Corporate law governs the internal architecture of the firm and the allocation of decision-making authority among directors, executives, and shareholders. Modern directors must navigate proactive oversight obligations over mission-critical enterprise risks, defend against aggressive hedge fund activist proxy fights, and maintain rigorous securities disclosure compliance.',
    parts: [
      {
        title: 'Board Oversight Fiduciary Duties & The Caremark / Marchand Standard',
        say: [
          'Under Delaware General Corporation Law (DGCL) Section 141(a), the business and affairs of a corporation are managed under the direction of its Board of Directors. While the Business Judgment Rule shields informed operational decisions made in good faith, directors face existential personal liability under the Duty of Loyalty for failure of oversight, governed by the landmark In re Caremark International Inc. Derivative Litigation framework.',
          'To establish liability under Caremark, plaintiffs must prove that the directors acted in bad faith through either of two prongs: (1) The directors utterly failed to implement any reporting or information system or controls, or (2) Having implemented such a system, the directors consciously failed to monitor or oversee its operations, disabling themselves from being informed of risks or consciously disregarding red flags.',
          'In Marchand v. Barnhill (the Blue Bell Creameries ice cream listeria outbreak case), the Delaware Supreme Court dramatically revitalized Caremark scrutiny for "mission-critical" regulatory risks (e.g. food safety, airplane manufacturing, pharmaceutical trials). Even where a company maintains general compliance programs, if the board agenda contains zero regular committee reports or board discussions specifically monitoring the firm\'s central operational safety risk, the directors are deemed to have acted in bad faith and lose the protection of exculpatory charter provisions.'
        ],
        example: 'At an industrial food processor where contamination is a mission-critical risk, board meeting minutes reveal 0 agenda discussions on sanitation, and management ignored 3 out of 4 escalated contamination red flags. The court finds bad faith oversight breach under Marchand, ruling DIRECTOR_OVERSIGHT_BREACH_BAD_FAITH.',
        code: `# Board Fiduciary Oversight & Caremark / Marchand Bad Faith Evaluator
def evaluate_caremark_oversight_liability(has_monitoring_system: bool, mission_critical_risk: bool,
                                          board_agenda_mentions: int, red_flags_escalated: int,
                                          red_flags_investigated: int) -> dict:
    # Caremark prong 1: failure to implement reporting system
    # Caremark prong 2: failure to monitor / conscious disregard of red flags
    prong1_breach = not has_monitoring_system
    
    # Under Marchand v. Barnhill, boards must exercise active oversight over "mission-critical" risks
    mission_critical_failure = mission_critical_risk and (board_agenda_mentions == 0)
    
    unaddressed_red_flags = max(0, red_flags_escalated - red_flags_investigated)
    prong2_breach = red_flags_escalated > 0 and (unaddressed_red_flags / red_flags_escalated) >= 0.5
    
    director_bad_faith = prong1_breach or mission_critical_failure or prong2_breach
    liability_verdict = "DIRECTOR_OVERSIGHT_BREACH_BAD_FAITH" if director_bad_faith else "BUSINESS_JUDGMENT_RULE_PROTECTED"
    
    return {
        "has_compliance_system": has_monitoring_system,
        "mission_critical_risk": mission_critical_risk,
        "board_agenda_mentions": board_agenda_mentions,
        "unaddressed_red_flags": unaddressed_red_flags,
        "prong1_system_failure": prong1_breach,
        "prong2_red_flag_disregard": prong2_breach,
        "mission_critical_oversight_breach": mission_critical_failure,
        "legal_verdict": liability_verdict
    }

p1 = evaluate_caremark_oversight_liability(
    has_monitoring_system=True, mission_critical_risk=True,
    board_agenda_mentions=0, red_flags_escalated=4, red_flags_investigated=1
)
print(f"Compliance System: {p1['has_compliance_system']} | Mission Critical Risk: {p1['mission_critical_risk']}")
print(f"Board Mentions: {p1['board_agenda_mentions']} | Unaddressed Red Flags: {p1['unaddressed_red_flags']}")
print(f"Verdict: {p1['legal_verdict']}")`,
        output: `Compliance System: True | Mission Critical Risk: True
Board Mentions: 0 | Unaddressed Red Flags: 3
Verdict: DIRECTOR_OVERSIGHT_BREACH_BAD_FAITH`,
        codeNotes: [
          { line: 6, note: 'Evaluates Caremark Prong 1 testing whether board implemented an enterprise reporting system' },
          { line: 9, note: 'Applies Marchand v. Barnhill rule requiring proactive board-level monitoring of mission-critical hazards' },
          { line: 12, note: 'Tests Caremark Prong 2: conscious bad-faith disregard of escalated operational red flags' },
          { line: 32, note: 'Concludes directors breached oversight duties by failing to discuss safety on board agenda' }
        ],
        tryIt: 'Increase board_agenda_mentions to 4 and red_flags_investigated to 4 to see directors regain Business Judgment Rule protection.',
        check: {
          question: 'Under the Delaware Supreme Court\'s ruling in Marchand v. Barnhill, what specific standard must a corporate board satisfy regarding "mission-critical" regulatory risks?',
          options: [
            'The board must make a good faith effort to implement and actively oversee an explicit, board-level monitoring and reporting system tailored to that specific central operational risk.',
            'The board must delegate all operating responsibility to junior interns without supervision.',
            'The board is automatically immune from oversight liability if the company has a generic employee handbook.',
            'Directors must personally inspect manufacturing factories every single morning.'
          ],
          answer: 0,
          why: 'Chief Justice Strine held that boards cannot satisfy their oversight obligations by relying on general corporate compliance when a mission-critical operational risk is ignored at the board table.',
          answerIndex: 0,
          explanation: 'Chief Justice Strine held that boards cannot satisfy their oversight obligations by relying on general corporate compliance when a mission-critical operational risk is ignored at the board table.'
        }
      },
      {
        title: 'Shareholder Activism, Schedule 13D Filings & Universal Proxy Contests',
        say: [
          'Under Section 13(d) of the Securities Exchange Act of 1934, any hedge fund, institutional investor, or group that acquires beneficial ownership of more than 5.0% of a registered public class of voting equity must file a Schedule 13D disclosure with the SEC. Under modernized SEC rules, the filing deadline has been accelerated to 5 business days from crossing the 5% threshold, forcing activist funds to disclose their strategic thesis, share accumulation, and control intentions before building massive stealth stakes.',
          'Upon filing Schedule 13D, activist shareholders frequently launch public campaigns demanding operational changes: spinning off unprofitable business divisions, increasing share buybacks, trimming executive compensation, or replacing incumbent directors through a contested Proxy Fight. Activists wage proxy solicitations seeking shareholder votes to elect dissident slates at the upcoming annual meeting of shareholders.',
          'In 2022, the SEC revolutionized proxy contests by mandating Universal Proxy Cards under Rule 14a-19. Previously, shareholders voting by proxy were forced to choose entirely between management\'s ballot or the activist\'s separate ballot. Under universal proxy rules, both management and dissident nominees are listed together on a single universal proxy card, empowering institutional asset managers (e.g. BlackRock, Vanguard) to "split the ticket"—electing 1 or 2 high-caliber activist nominees without handing total board control to the dissident slate.'
        ],
        example: 'An activist hedge fund crosses 7.8% beneficial ownership and files Schedule 13D within 4 business days. In a contested universal proxy contest, the dissident slate receives 54.0% shareholder voting support, winning board representation and prompting the outcome ACTIVIST_SLATE_ELECTED_BOARD_CONTROL.',
        code: `# Shareholder Activism: Schedule 13D Compliance & Universal Proxy Ballot Simulator
def simulate_activist_schedule13d_and_proxy_vote(beneficial_ownership_pct: float, days_since_crossing: int,
                                                 total_shares_voting: int, activist_nominee_votes: int,
                                                 management_nominee_votes: int) -> dict:
    # SEC Section 13(d) requires filing within 5 business days of crossing 5.0%
    is_13d_required = beneficial_ownership_pct >= 5.0
    is_13d_timely = days_since_crossing <= 5
    
    # Universal Proxy (Rule 14a-19) enables split-ticket voting
    total_ballots_cast = activist_nominee_votes + management_nominee_votes
    activist_support_pct = (activist_nominee_votes / total_shares_voting) * 100.0 if total_shares_voting > 0 else 0.0
    
    dissident_won_seats = activist_nominee_votes > management_nominee_votes
    contest_outcome = "ACTIVIST_SLATE_ELECTED_BOARD_CONTROL" if dissident_won_seats else "MANAGEMENT_SLATE_PRESERVED"
    
    return {
        "beneficial_ownership_pct": beneficial_ownership_pct,
        "schedule_13d_filing_required": is_13d_required,
        "schedule_13d_timely": is_13d_timely if is_13d_required else True,
        "activist_support_pct": round(activist_support_pct, 2),
        "dissident_slate_victory": dissident_won_seats,
        "contest_outcome": contest_outcome
    }

p2 = simulate_activist_schedule13d_and_proxy_vote(
    beneficial_ownership_pct=7.8, days_since_crossing=4,
    total_shares_voting=100000000, activist_nominee_votes=54000000,
    management_nominee_votes=46000000
)
print(f"Ownership: {p2['beneficial_ownership_pct']}% | 13D Required: {p2['schedule_13d_filing_required']} (Timely: {p2['schedule_13d_timely']})")
print(f"Activist Vote: {p2['activist_support_pct']}% -> Winner: {p2['contest_outcome']}")`,
        output: `Ownership: 7.8% | 13D Required: True (Timely: True)
Activist Vote: 54.0% -> Winner: ACTIVIST_SLATE_ELECTED_BOARD_CONTROL`,
        codeNotes: [
          { line: 6, note: 'Enforces accelerated SEC 5 business day filing window for Schedule 13D upon crossing 5% ownership' },
          { line: 11, note: 'Calculates shareholder vote tally under SEC Rule 14a-19 Universal Proxy unified ballot rules' },
          { line: 14, note: 'Determines whether dissident nominees capture pluralistic voting majority to unseat incumbent directors' },
          { line: 26, note: 'Simulates 54.0% activist proxy triumph resulting in dissident slate victory' }
        ],
        tryIt: 'Reduce activist_nominee_votes to 42,000,000 to observe management slate retain board control.',
        check: {
          question: 'What revolutionary change did SEC Rule 14a-19 (the Universal Proxy Rule) introduce for contested corporate proxy elections?',
          options: [
            'It mandates that both management and dissident director nominees be listed together on a single universal proxy card, allowing shareholders voting by proxy to pick and choose individual candidates from either slate.',
            'It prohibits institutional investors from voting in board elections.',
            'It requires all corporate proxy fights to be settled by coin toss.',
            'It completely eliminates shareholder voting in Delaware corporations.'
          ],
          answer: 0,
          why: 'Universal proxy cards democratize proxy voting by eliminating the constraint where proxy voters had to choose all-or-nothing between competing ballots.',
          answerIndex: 0,
          explanation: 'Universal proxy cards democratize proxy voting by eliminating the constraint where proxy voters had to choose all-or-nothing between competing ballots.'
        }
      },
      {
        title: 'SEC Rule 10b5-1 Executive Trading Plans & Mandatory Cooling-Off Periods',
        say: [
          'Under Section 10(b) of the Securities Exchange Act and Rule 10b-5, corporate insiders (directors, executive officers) are strictly prohibited from trading securities while in possession of Material Non-Public Information (MNPI). To enable executives to liquidate equity compensation legally without facing insider trading allegations, the SEC established Rule 10b5-1: creating an affirmative defense if trades are executed pursuant to a binding written contract or pre-planned formula established when the insider had no MNPI.',
          'Following systemic abuses where executives adopted plans and dumped stock days before catastrophic earnings warnings, the SEC adopted sweeping reforms. Modern Rule 10b5-1 plans enforce strict Mandatory Cooling-Off Periods: for directors and officers, trades cannot execute until the later of (1) 90 days following plan adoption/modification, or (2) 2 business days following the filing of Form 10-Q or Form 10-K covering the fiscal quarter in which the plan was adopted (subject to a maximum 120 days). For non-officer employees, a 30-day cooling-off period applies.',
          'Additionally, amended Rule 10b5-1 prohibits multiple overlapping plans for the same asset class and restricts single-trade plans to only one plan within any 12-month rolling period. Executive officers and directors must also include representations in the plan certifying that they possess no MNPI and are adopting the plan in good faith. Any deviation or premature execution immediately strips the affirmative defense, exposing the executive to criminal DOJ and civil SEC insider trading prosecution.'
        ],
        example: 'An officer adopts a Rule 10b5-1 stock plan on January 15, 2026. The company files Form 10-Q on April 20, 2026. The officer executes a scheduled sale on May 1, 2026 (106 days elapsed, >2 business days post-10-Q) with no overlapping plans. The engine confirms the affirmative defense is valid under amended SEC rules.',
        code: `# SEC Rule 10b5-1 Affirmative Defense & Cooling-Off Period Compliance Engine
from datetime import datetime, timedelta

def validate_sec_rule_10b5_1_trading_plan(plan_adoption_str: str, trade_execution_str: str,
                                          is_officer_or_director: bool, form_10q_filing_str: str,
                                          has_overlapping_plan: bool, single_trade_in_prior_12m: bool) -> dict:
    adoption_date = datetime.strptime(plan_adoption_str, "%Y-%m-%d")
    trade_date = datetime.strptime(trade_execution_str, "%Y-%m-%d")
    filing_date = datetime.strptime(form_10q_filing_str, "%Y-%m-%d")
    
    cooling_off_days = (trade_date - adoption_date).days
    
    # SEC rule for officers/directors: cooling-off must be the LATER of:
    # 1. 90 days after adoption
    # 2. 2 business days after Form 10-Q/10-K filing (approx +2 days)
    req_cooling_off = 90 if is_officer_or_director else 30
    sec_10q_limit = filing_date + timedelta(days=2)
    
    satisfied_statutory_days = cooling_off_days >= req_cooling_off
    satisfied_10q_cooling = trade_date >= sec_10q_limit if is_officer_or_director else True
    
    cooling_off_satisfied = satisfied_statutory_days and satisfied_10q_cooling
    no_overlapping = not has_overlapping_plan
    no_excess_single_trades = not single_trade_in_prior_12m
    
    is_valid_safe_harbor = cooling_off_satisfied and no_overlapping and no_excess_single_trades
    verdict = "AFFIRMATIVE_DEFENSE_RULE_10B5_1_VALID" if is_valid_safe_harbor else "INVALID_INSIDER_TRADING_EXPOSURE"
    
    return {
        "cooling_off_elapsed_days": cooling_off_days,
        "cooling_off_statutory_min_days": req_cooling_off,
        "cooling_off_satisfied": cooling_off_satisfied,
        "no_overlapping_plans": no_overlapping,
        "single_trade_restriction_compliant": no_excess_single_trades,
        "safe_harbor_valid": is_valid_safe_harbor,
        "legal_verdict": verdict
    }

p3 = validate_sec_rule_10b5_1_trading_plan(
    plan_adoption_str="2026-01-15", trade_execution_str="2026-05-01",
    is_officer_or_director=True, form_10q_filing_str="2026-04-20",
    has_overlapping_plan=False, single_trade_in_prior_12m=False
)
print(f"Cooling Off Elapsed: {p3['cooling_off_elapsed_days']}d (Min: {p3['cooling_off_statutory_min_days']}d) | Satisfied: {p3['cooling_off_satisfied']}")
print(f"No Overlapping: {p3['no_overlapping_plans']} -> Verdict: {p3['legal_verdict']}")`,
        output: `Cooling Off Elapsed: 106d (Min: 90d) | Satisfied: True
No Overlapping: True -> Verdict: AFFIRMATIVE_DEFENSE_RULE_10B5_1_VALID`,
        codeNotes: [
          { line: 15, note: 'Calculates statutory 90-day cooling-off duration for Section 16 corporate officers and directors' },
          { line: 16, note: 'Enforces dual condition requiring 2 business days after Form 10-Q/10-K earnings disclosure' },
          { line: 22, note: 'Verifies strict prohibition against concurrent overlapping trading plans on same class of stock' },
          { line: 36, note: 'Confirms valid 10b5-1 affirmative defense insulating trade executed 106 days after adoption' }
        ],
        tryIt: 'Change trade_execution_str to "2026-02-15" (31 days) to observe plan invalidation due to cooling-off violation.',
        check: {
          question: 'Under amended SEC Rule 10b5-1, what is the mandatory cooling-off period before a corporate officer or director may execute their first trade under a new trading plan?',
          options: [
            'The later of 90 days after plan adoption or 2 business days following the filing of the Form 10-Q or Form 10-K for the quarter of adoption.',
            'Exactly 24 hours after sending an email to the corporate secretary.',
            'Zero days, provided the executive signs an affidavit of good character.',
            'Ten continuous business years.'
          ],
          answer: 0,
          why: 'The SEC amended Rule 10b5-1 to enforce a robust cooling-off window ensuring that market earnings are disclosed before any planned insider trades execute.',
          answerIndex: 0,
          explanation: 'The SEC amended Rule 10b5-1 to enforce a robust cooling-off window ensuring that market earnings are disclosed before any planned insider trades execute.'
        }
      },
      {
        title: 'Regulation Fair Disclosure (Reg FD) & Selective Disclosure Compliance',
        say: [
          'Prior to the adoption of Regulation Fair Disclosure (Reg FD) by the SEC, corporate management routinely leaked Material Non-Public Information (such as earnings beats, clinical trial results, or merger discussions) to favored Wall Street securities analysts and select institutional hedge funds during closed-door conference calls or private dinners before informing the retail public. This created an unfair information asymmetry that rigged capital markets.',
          'Reg FD establishes a strict bright-line prohibition: whenever an issuer (or executive speaking on its behalf) intentionally discloses Material Non-Public Information to covered persons (securities analysts, broker-dealers, investment advisers, or institutional shareholders), the company must simultaneously disclose that information to the general public via a broadly disseminated press release, public webcast, or Form 8-K SEC filing.',
          'In the event of an unintentional or accidental selective disclosure (e.g. an executive inadvertently letting slip confidential quarterly guidance during a breakout chat), Reg FD provides a strict cure safe harbor: the issuer must publicly disclose the information "promptly"—defined as within 24 hours of discovering the disclosure or prior to the commencement of the next trading day on the relevant stock exchange (e.g. 9:30 AM EST on NYSE/Nasdaq). Failing to cure within 24 hours triggers immediate SEC enforcement actions, civil injunctions, and substantial corporate fines.'
        ],
        example: 'During a private investor dinner, an executive discloses unannounced quarterly earnings guidance to institutional investors. The corporate communications team files a Form 8-K with the SEC 18 hours later. The audit engine marks the disclosure TIMELY_REMEDIATED_VIA_FORM_8K and issues a clean verdict PROMPTLY_CURED_NO_PENALTY.',
        code: `# SEC Regulation Fair Disclosure (Reg FD) Selective Disclosure Audit Engine
def audit_regulation_fd_compliance(audience_category: str, discloses_mnpi: bool,
                                   is_public_channel: bool, hours_since_disclosure: float,
                                   form_8k_or_pr_filed: bool) -> dict:
    # Reg FD targets selective disclosures to analysts, hedge funds, or institutional investors
    is_covered_recipient = audience_category in ["securities_analysts", "institutional_investors", "hedge_funds"]
    
    violation = False
    remediation_status = "N/A"
    
    if discloses_mnpi and is_covered_recipient and not is_public_channel:
        # Selective disclosure occurred! Must remediate within 24 hours via Form 8-K
        if form_8k_or_pr_filed and hours_since_disclosure <= 24.0:
            remediation_status = "TIMELY_REMEDIATED_VIA_FORM_8K"
        else:
            violation = True
            remediation_status = "UNREMEDIATED_REG_FD_ENFORCEMENT_ACTION"
    else:
        remediation_status = "NO_SELECTIVE_DISCLOSURE"
        
    verdict = "REG_FD_CIVIL_VIOLATION" if violation else ("COMPLIANT_WITH_REG_FD" if not discloses_mnpi or is_public_channel else "PROMPTLY_CURED_NO_PENALTY")
    
    return {
        "audience": audience_category,
        "disclosed_mnpi": discloses_mnpi,
        "hours_since_disclosure": hours_since_disclosure,
        "remediation_status": remediation_status,
        "sec_enforcement_risk": violation,
        "verdict": verdict
    }

p4 = audit_regulation_fd_compliance(
    audience_category="institutional_investors", discloses_mnpi=True,
    is_public_channel=False, hours_since_disclosure=18.0, form_8k_or_pr_filed=True
)
print(f"Audience: {p4['audience']} | Disclosed MNPI: {p4['disclosed_mnpi']} | Elapsed: {p4['hours_since_disclosure']}h")
print(f"Remediation: {p4['remediation_status']} -> Verdict: {p4['verdict']}")`,
        output: `Audience: institutional_investors | Disclosed MNPI: True | Elapsed: 18.0h
Remediation: TIMELY_REMEDIATED_VIA_FORM_8K -> Verdict: PROMPTLY_CURED_NO_PENALTY`,
        codeNotes: [
          { line: 5, note: 'Identifies covered market recipients under Reg FD (analysts, institutional investors, hedge funds)' },
          { line: 12, note: 'Applies statutory 24-hour cure window for unintentional selective disclosures of non-public info' },
          { line: 18, note: 'Determines SEC civil enforcement risk when public filing is delayed beyond next trading day' },
          { line: 32, note: 'Validates timely Form 8-K cure within 18 hours, successfully averting civil penalties' }
        ],
        tryIt: 'Set form_8k_or_pr_filed=False to observe failure to cure result in REG_FD_CIVIL_VIOLATION.',
        check: {
          question: 'If a corporate executive accidentally discloses material non-public financial guidance during an off-the-record chat with a securities analyst, what is the company\'s legal obligation under SEC Regulation FD?',
          options: [
            'The company must promptly disclose that information to the general public (via Form 8-K or press release) within 24 hours or before the start of the next trading day.',
            'The executive must ask the analyst to delete their handwritten notes.',
            'The company must immediately buy back all outstanding stock.',
            'The company has no legal obligation if the conversation took place over dinner.'
          ],
          answer: 0,
          why: 'Under Reg FD Rule 101, inadvertent selective disclosures of MNPI must be publicly disseminated within 24 hours to level the playing field for retail investors.',
          answerIndex: 0,
          explanation: 'Under Reg FD Rule 101, inadvertent selective disclosures of MNPI must be publicly disseminated within 24 hours to level the playing field for retail investors.'
        }
      },
      {
        title: 'Corporate Internal Investigations, Upjohn Warnings & Attorney-Client Privilege',
        say: [
          'When allegations of accounting fraud, bribery under the Foreign Corrupt Practices Act (FCPA), or antitrust price-fixing surface inside an enterprise, the Audit Committee of the Board retains independent external white-collar counsel to conduct a Corporate Internal Investigation. Counsel interviews employees, reviews encrypted communications, and authors an investigative memorandum.',
          'Under the United States Supreme Court\'s landmark Upjohn Co. v. United States decision, attorney-client privilege in the corporate context is not limited to senior executives ("control group"); it extends to communications between company counsel and rank-and-file corporate employees at all levels, provided the communication is made at the direction of corporate superiors for the purpose of securing legal advice for the enterprise.',
          'However, counsel conducting employee interviews must strictly administer the "Upjohn Warning" (the Corporate Miranda warning). Counsel must clearly inform the employee: (1) Counsel represents the corporation, not the individual employee personally, (2) The interview is protected by attorney-client privilege, but that privilege belongs exclusively to the corporation, not the employee, and (3) The corporation alone possesses the legal power to waive the privilege and disclose all interview notes to the Department of Justice (DOJ) or SEC without the employee\'s consent.',
          'If an employee mistakenly believes that the investigating attorney represents them personally and the attorney fails to administer a clear Upjohn warning, the employee can move to suppress interview transcripts or assert conflict of interest against counsel. Conversely, when the company cooperates with federal prosecutors under the DOJ Corporate Enforcement Policy, the Board frequently elects to waive privilege, turning over interview memos to earn extraordinary leniency credit while exposing culpable executives to personal indictment.'
        ],
        example: 'During an FCPA investigation, external counsel administers an Upjohn warning to a regional sales director who acknowledges that privilege belongs solely to the company. When the Board votes to cooperate with the DOJ, the privilege is waived, changing the status to PRIVILEGE_WAIVED_PRODUCIBLE_TO_DOJ.',
        code: `# Corporate Internal Investigations: Upjohn Privilege & Board Waiver Engine
def evaluate_internal_investigation_upjohn_privilege(upjohn_warning_given: bool, employee_acknowledged: bool,
                                                     legal_advice_purpose: bool, disclosed_to_external_auditor: bool,
                                                     board_waives_privilege: bool) -> dict:
    # Upjohn privilege prongs:
    # 1. Communication made by employee to legal counsel acting as legal counsel (legal advice purpose)
    # 2. Upjohn corporate Miranda warning administered
    # 3. No inadvertent third-party waiver
    has_initial_privilege = upjohn_warning_given and employee_acknowledged and legal_advice_purpose and (not disclosed_to_external_auditor)
    
    # Privilege belongs exclusively to the corporation (the Board)
    employee_can_assert = False # Employee NEVER owns corporate privilege
    
    if board_waives_privilege and has_initial_privilege:
        corporation_waived = True
        status = "PRIVILEGE_WAIVED_PRODUCIBLE_TO_DOJ"
    elif has_initial_privilege:
        corporation_waived = False
        status = "CONFIDENTIAL_PROTECTED_WORK_PRODUCT"
    else:
        corporation_waived = False
        status = "UNPROTECTED_NO_ATTORNEY_CLIENT_PRIVILEGE"
        
    return {
        "upjohn_warning_given": upjohn_warning_given,
        "employee_owns_privilege": employee_can_assert,
        "initial_privilege_established": has_initial_privilege,
        "board_waived_to_regulators": corporation_waived,
        "investigation_document_status": status
    }

p5 = evaluate_internal_investigation_upjohn_privilege(
    upjohn_warning_given=True, employee_acknowledged=True,
    legal_advice_purpose=True, disclosed_to_external_auditor=False,
    board_waives_privilege=True
)
print(f"Upjohn Warning: {p5['upjohn_warning_given']} | Employee Owns Privilege: {p5['employee_owns_privilege']}")
print(f"Initial Privilege: {p5['initial_privilege_established']} | Board Waived: {p5['board_waived_to_regulators']}")
print(f"Status: {p5['investigation_document_status']}")`,
        output: `Upjohn Warning: True | Employee Owns Privilege: False
Initial Privilege: True | Board Waived: True
Status: PRIVILEGE_WAIVED_PRODUCIBLE_TO_DOJ`,
        codeNotes: [
          { line: 8, note: 'Applies Supreme Court Upjohn doctrine establishing corporate privilege across all employee tiers' },
          { line: 11, note: 'Enforces fundamental rule: attorney-client privilege belongs solely to the entity, never the employee' },
          { line: 13, note: 'Models Board of Directors unilateral waiver to disclose interview admissions to DOJ/SEC' },
          { line: 28, note: 'Confirms valid corporate waiver enabling cooperation credit under federal enforcement guidelines' }
        ],
        tryIt: 'Set board_waives_privilege=False to observe the investigative memo remain CONFIDENTIAL_PROTECTED_WORK_PRODUCT.',
        check: {
          question: 'What is the critical legal significance of an "Upjohn Warning" administered by corporate counsel during an employee internal investigation interview?',
          options: [
            'It informs the employee that counsel represents the corporation, not the individual, and that the attorney-client privilege belongs solely to the company, which may unilaterally waive it and disclose the statements to the government.',
            'It reads the employee their constitutional Fifth Amendment Miranda rights before criminal arrest.',
            'It guarantees that the employee cannot be fired from their job.',
            'It transfers ownership of corporate stock options to the employee\'s spouse.'
          ],
          answer: 0,
          why: 'Under Upjohn, the company owns the privilege; the warning prevents the employee from claiming a personal attorney-client relationship that would block the company from cooperating with regulators.',
          answerIndex: 0,
          explanation: 'Under Upjohn, the company owns the privilege; the warning prevents the employee from claiming a personal attorney-client relationship that would block the company from cooperating with regulators.'
        }
      }
    ],
    summary: [
      'Board Oversight Fiduciary Duties: The Caremark and Marchand doctrine imposes liability for bad faith oversight failure when boards utterly ignore mission-critical enterprise hazards.',
      'Shareholder Activism & Universal Proxy: Section 13(d) accelerates Schedule 13D filings to 5 business days; Rule 14a-19 universal proxies enable split-ticket voting in contested elections.',
      'SEC Rule 10b5-1 Insider Trading: Enforces mandatory cooling-off periods (90 days / 2 days post-10-Q), prohibits overlapping plans, and restricts single-trade plans.',
      'Regulation Fair Disclosure (Reg FD): Outlaws selective disclosure of MNPI to analysts; provides a strict 24-hour cure window via public Form 8-K dissemination.',
      'Internal Investigations & Upjohn Warning: Protects corporate attorney-client privilege across employee tiers while vesting exclusive waiver authority in the Board of Directors.'
    ],
    projectStep: {
      title: 'Corporate Governance, Securities Compliance & Internal Investigation Control Suite',
      steps: [
        'Evaluate board fiduciary compliance under Delaware Caremark and Marchand mission-critical oversight standards.',
        'Simulate activist shareholder Schedule 13D filings and model contested universal proxy ballot election tallies.',
        'Audit executive pre-planned trading arrangements under amended SEC Rule 10b5-1 cooling-off requirements.',
        'Implement Regulation FD selective disclosure cure protocols and model Upjohn internal investigation privilege defenses.'
      ]
    }
  },
  {
    coursePrefix: 'bcom_law',
    day: 5,
    title: 'Milestone 1 Capstone: Enterprise Corporate Restructuring & Chapter 11 Reorganization',
    goal: 'Master enterprise corporate restructuring and insolvency jurisprudence: Chapter 11 petition automatic stays and Debtor-in-Possession (DIP) priming superpriority financing, Section 363 asset sales free and clear of liens with stalking horse protections, Plan of Reorganization cramdown mechanics under the Absolute Priority Rule, Delaware fiduciary duties in the zone of insolvency under Gheewalla, and Boardroom General Counsel crisis defense certification.',
    minutes: 50,
    recap: 'Welcome to the Milestone 1 Capstone for Corporate & Commercial Law. As Corporate General Counsel and Chief Restructuring Advisor, you are tasked with steering a distressed enterprise through federal bankruptcy reorganization, neutralizing creditor lawsuits, executing an expedited Section 363 asset sale, and confirming a Chapter 11 cramdown plan over dissenting equity holders.',
    parts: [
      {
        title: 'Chapter 11 Petition, Automatic Stay & Debtor-in-Possession (DIP) Superpriority Financing',
        say: [
          'When a distressed corporation files a voluntary petition under Chapter 11 of the United States Bankruptcy Code, Section 362 instantly triggers the Automatic Stay. The automatic stay operates as an immediate nationwide statutory injunction that halts all pending creditor collection actions, foreclosures, contract terminations, and commercial lawsuits, providing the corporate debtor with breathing room to stabilize operations and negotiate a restructuring plan.',
          'Under Chapter 11, incumbent management generally remains in place as a Debtor-in-Possession (DIP) under Sections 1107 and 1108, continuing day-to-day operations without requiring a bankruptcy trustee. However, to fund payroll, vendor purchases, and working capital during bankruptcy, the debtor requires specialized Debtor-in-Possession (DIP) Financing.',
          'To induce lenders to inject new capital into an insolvent enterprise, Bankruptcy Code Section 364 authorizes extraordinary credit enhancements. Under Section 364(c) and (d), the court can grant DIP lenders "superpriority administrative expense" status and even "priming liens"—liens senior to existing pre-petition secured debt—provided existing secured lenders receive "adequate protection" (such as replacement liens on unencumbered assets or cash interest payments). DIP lenders often demand a "roll-up" converting portions of pre-petition debt into post-petition superpriority obligations.'
        ],
        example: 'A distressed aerospace supplier files Chapter 11 with $150M in secured debt. The court approves a $50M new-money DIP facility with a 20% ($10M) roll-up on $60M unencumbered collateral. The DIP lender secures Section 364(d) priming superpriority status on a $60M total claim, keeping factory operations active.',
        code: `# Chapter 11 Automatic Stay & Section 364 DIP Superpriority Financing Engine
def structure_dip_financing_and_automatic_stay(existing_secured_debt: float, dip_facility_amount: float,
                                               unencumbered_collateral: float, roll_up_pct: float) -> dict:
    # Automatic stay takes immediate statutory effect under Section 362
    automatic_stay_active = True
    
    # Section 364(c)/(d) superpriority and priming lien evaluation
    roll_up_amount = min(existing_secured_debt, dip_facility_amount * (roll_up_pct / 100.0))
    total_dip_obligation = dip_facility_amount + roll_up_amount
    
    is_adequate_protection = unencumbered_collateral >= total_dip_obligation * 0.8
    dip_priority_tier = "SECTION_364_D_PRIMING_SUPERPRIORITY" if is_adequate_protection else "SECTION_364_C_JUNIOR_SUPERPRIORITY"
    
    return {
        "automatic_stay_active": automatic_stay_active,
        "new_money_dip_usd": dip_facility_amount,
        "roll_up_secured_usd": round(roll_up_amount, 2),
        "total_dip_claim_usd": round(total_dip_obligation, 2),
        "unencumbered_collateral_usd": unencumbered_collateral,
        "adequate_protection_satisfied": is_adequate_protection,
        "priority_status": dip_priority_tier
    }

p1 = structure_dip_financing_and_automatic_stay(
    existing_secured_debt=150000000.0, dip_facility_amount=50000000.0,
    unencumbered_collateral=60000000.0, roll_up_pct=20.0
)
dip_money = "$" + f"{p1['new_money_dip_usd']:,.2f}"
total_dip = "$" + f"{p1['total_dip_claim_usd']:,.2f}"
print(f"Automatic Stay: {p1['automatic_stay_active']} | New Money DIP: {dip_money}")
print(f"Total DIP Claim: {total_dip} | Priority Tier: {p1['priority_status']}")`,
        output: `Automatic Stay: True | New Money DIP: $50,000,000.00
Total DIP Claim: $60,000,000.00 | Priority Tier: SECTION_364_D_PRIMING_SUPERPRIORITY`,
        codeNotes: [
          { line: 5, note: 'Confirms Section 362 statutory injunction halting all creditor litigation against debtor' },
          { line: 8, note: 'Calculates DIP lender roll-up converting $10M pre-petition debt into superpriority status' },
          { line: 11, note: 'Evaluates adequate protection standard granting Section 364(d) priming liens over secured debt' },
          { line: 31, note: 'Unlocks $50M immediate liquidity facility to sustain continuous aerospace manufacturing' }
        ],
        tryIt: 'Lower unencumbered_collateral to $30M to observe adequate protection fail, dropping priority to Section 364(c).',
        check: {
          question: 'What is the primary legal and operational effect of the Section 362 "Automatic Stay" upon filing a Chapter 11 bankruptcy petition?',
          options: [
            'It immediately halts all creditor collection efforts, lawsuits, foreclosures, and asset seizures against the debtor, giving the business breathing room to reorganize.',
            'It forces the debtor to fire all current employees immediately.',
            'It automatically cancels all debt without requiring court approval.',
            'It converts the corporation into a non-profit municipal charity.'
          ],
          answer: 0,
          why: 'Section 362 imposes a broad statutory injunction that freezes all collection and litigation, preventing a chaotic run on corporate assets.',
          answerIndex: 0,
          explanation: 'Section 362 imposes a broad statutory injunction that freezes all collection and litigation, preventing a chaotic run on corporate assets.'
        }
      },
      {
        title: 'Section 363 Asset Sales ("Free and Clear") vs Reorganization Plans',
        say: [
          'Rather than enduring a protracted multi-year confirmation process, distressed debtors frequently utilize Section 363 of the Bankruptcy Code to execute an expedited sale of profitable operating divisions or substantially all corporate assets. A Section 363 sale offers buyers the ultimate legal shield: under Section 363(f), assets are transferred "free and clear of any interest," stripping away all successor liabilities, pre-petition unsecured claims, and contract liens.',
          'To establish a competitive market valuation, the debtor selects a "Stalking Horse Bidder" to set the floor price by executing an initial asset purchase agreement. In exchange for spending capital on due diligence and serving as the baseline target, the stalking horse is granted court-approved Bid Protections: typically a 2% to 3% breakup fee and capped out-of-pocket expense reimbursement.',
          'The bankruptcy court then approves auction bidding procedures requiring competitive third-party bidders to submit overbids exceeding the baseline bid plus bid protections plus a minimum bidding increment: Minimum Overbid = Stalking Horse Bid + Breakup Fee + Expenses + Minimum Increment. If a rival bidder wins the court auction, the stalking horse receives its fee and expenses from the proceeds, and the bankruptcy estate captures the higher net value for distribution to creditors.'
        ],
        example: 'A debtor selects a stalking horse bid of $80M with 3% breakup fee ($2.4M) and $1.0M expenses (minimum overbid $85.4M with $2.0M increment). A rival bidder wins the court auction at $92M. The estate pays $3.4M in protections to the stalking horse and nets $88.6M free and clear of all liens.',
        code: `# Bankruptcy Section 363 Stalking Horse Auction & Bid Protection Engine
def evaluate_section363_stalking_horse_auction(stalking_horse_bid: float, breakup_fee_pct: float,
                                               expense_reimbursement: float, competing_bids: list,
                                               minimum_overbid_increment: float) -> dict:
    breakup_fee_usd = stalking_horse_bid * (breakup_fee_pct / 100.0)
    bid_protections = breakup_fee_usd + expense_reimbursement
    
    # Minimum first overbid = Stalking Horse + Protections + Minimum Increment
    minimum_first_overbid = stalking_horse_bid + bid_protections + minimum_overbid_increment
    
    valid_bids = [b for b in competing_bids if b["amount"] >= minimum_first_overbid]
    valid_bids.sort(key=lambda x: x["amount"], reverse=True)
    
    winning_bid = valid_bids[0] if valid_bids else {"bidder": "Stalking Horse Bidder", "amount": stalking_horse_bid}
    stalking_horse_prevailed = winning_bid["bidder"] == "Stalking Horse Bidder"
    
    # If stalking horse loses, they receive breakup fee + expense reimbursement
    protections_paid_to_stalking_horse = 0.0 if stalking_horse_prevailed else bid_protections
    net_estate_proceeds = winning_bid["amount"] - protections_paid_to_stalking_horse
    
    return {
        "stalking_horse_initial_bid": stalking_horse_bid,
        "breakup_fee_usd": round(breakup_fee_usd, 2),
        "minimum_first_overbid": round(minimum_first_overbid, 2),
        "winning_bidder": winning_bid["bidder"],
        "gross_sale_price": round(winning_bid["amount"], 2),
        "protections_paid_usd": round(protections_paid_to_stalking_horse, 2),
        "net_estate_proceeds": round(net_estate_proceeds, 2),
        "section_363_order": "FREE_AND_CLEAR_OF_LIENS_AND_CLAIMS"
    }

p2 = evaluate_section363_stalking_horse_auction(
    stalking_horse_bid=80000000.0, breakup_fee_pct=3.0,
    expense_reimbursement=1000000.0,
    competing_bids=[{"bidder": "Rival Acquirer Corp", "amount": 92000000.0}],
    minimum_overbid_increment=2000000.0
)
gross_p = "$" + f"{p2['gross_sale_price']:,.2f}"
net_p = "$" + f"{p2['net_estate_proceeds']:,.2f}"
sh_bid = "$" + f"{p2['stalking_horse_initial_bid']:,.2f}"
print(f"Stalking Horse: {sh_bid} -> Winner: {p2['winning_bidder']} ({gross_p})")
print(f"Net Estate Proceeds: {net_p} | Order: {p2['section_363_order']}")`,
        output: `Stalking Horse: $80,000,000.00 -> Winner: Rival Acquirer Corp ($92,000,000.00)
Net Estate Proceeds: $88,600,000.00 | Order: FREE_AND_CLEAR_OF_LIENS_AND_CLAIMS`,
        codeNotes: [
          { line: 6, note: 'Calculates court-approved stalking horse breakup fee (3%) and expense reimbursement' },
          { line: 10, note: 'Establishes minimum qualifying overbid hurdle ($85.4M) incorporating protections and increment' },
          { line: 20, note: 'Deducts $3.4M in stalking horse protections from winning $92M auction bid to calculate net proceeds' },
          { line: 40, note: 'Confirms Section 363(f) judicial order transferring assets free and clear of successor claims' }
        ],
        tryIt: 'Remove competing bids to observe stalking horse prevail at baseline $80.0M with zero protections paid out.',
        check: {
          question: 'Under Bankruptcy Code Section 363(f), what is the primary legal advantage for a buyer purchasing assets through a Section 363 bankruptcy sale?',
          options: [
            'The buyer acquires the target assets "free and clear" of pre-petition liens, encumbrances, and successor liability claims.',
            'The buyer does not have to pay any cash for the acquisition.',
            'The buyer is exempt from paying corporate taxes for the next twenty years.',
            'The buyer receives a sovereign government guarantee against business losses.'
          ],
          answer: 0,
          why: 'Section 363(f) strips away historical liabilities and creditor claims, transferring clean title to the buyer and maximizing sale proceeds for the bankruptcy estate.',
          answerIndex: 0,
          explanation: 'Section 363(f) strips away historical liabilities and creditor claims, transferring clean title to the buyer and maximizing sale proceeds for the bankruptcy estate.'
        }
      },
      {
        title: 'Confirmation Plan, Class Voting & The Absolute Priority Rule Cramdown',
        say: [
          'The culmination of a Chapter 11 reorganization is the confirmation of a Plan of Reorganization under Section 1129. Creditors and interest holders are organized into distinct classes based on substantial similarity of legal rights (e.g. Class 1 Secured, Class 2 Unsecured, Class 3 Old Equity). Under Section 1126(c), an impaired class accepts the plan if approved by at least two-thirds in dollar amount and more than one-half in number of allowed claims voting.',
          'If every impaired class votes to accept the plan, the confirmation is consensual. However, if a dissenting junior class (such as common shareholders or mezzanine lenders) votes to reject the plan, the debtor must seek a "Cramdown" confirmation under Section 1129(b). To cram down a plan over dissenting classes, two conditions must be satisfied: (1) At least one impaired class of claims must accept the plan without counting votes of corporate insiders (Section 1129(a)(10)), and (2) The plan must be "fair and equitable" and not unfairly discriminate.',
          'In reorganization law, "fair and equitable" is defined by the Absolute Priority Rule: a dissenting impaired class must be paid in full before any junior class receives or retains any property under the plan. If unsecured bondholders are impaired and receive only 58.33% recovery on their claims, the Absolute Priority Rule strictly dictates that Old Equity must receive exactly $0.00 and be completely extinguished. Old equity cannot retain shares unless senior classes consent or inject fresh capital under the narrow "new value" exception.'
        ],
        example: 'An aerospace debtor has $250M in distributable value against $180M secured debt, $120M unsecured bonds, and $50M old equity. Secured lenders are unimpaired (100% recovery); unsecured bondholders accept at 58.33% ($70M payout). Old equity votes no, but the court confirms the plan via cramdown, wiping out old equity under the Absolute Priority Rule.',
        code: `# Chapter 11 Plan Confirmation, Absolute Priority Rule & Cramdown Simulator
def simulate_chapter11_plan_cramdown_and_absolute_priority(distributable_value: float,
                                                           claims_hierarchy: list,
                                                           class_voting: list) -> dict:
    remaining_value = distributable_value
    payout_summary = []
    
    # Water-fall distribution adhering to Absolute Priority Rule
    for claim in claims_hierarchy:
        claim_name = claim["class_name"]
        total_owed = claim["total_claim_usd"]
        
        payout = min(remaining_value, total_owed)
        recovery_pct = (payout / total_owed) * 100.0 if total_owed > 0 else 100.0
        remaining_value -= payout
        
        # Check voting approval: 2/3 in amount and 1/2 in headcount
        vote_data = next((v for v in class_voting if v["class_name"] == claim_name), None)
        accepted = (vote_data["dollar_approval_pct"] >= 66.67 and vote_data["headcount_approval_pct"] >= 50.0) if vote_data else True
        is_impaired = recovery_pct < 100.0
        
        payout_summary.append({
            "class": claim_name,
            "claim_usd": total_owed,
            "payout_usd": round(payout, 2),
            "recovery_pct": round(recovery_pct, 2),
            "is_impaired": is_impaired,
            "class_accepted": accepted
        })
        
    # Cramdown check under Section 1129(b):
    # At least one impaired class must accept, and Absolute Priority Rule satisfied
    at_least_one_impaired_accepted = any(c["is_impaired"] and c["class_accepted"] for c in payout_summary)
    
    saw_underpaid = False
    absolute_priority_violated = False
    for c in payout_summary:
        if saw_underpaid and c["payout_usd"] > 0:
            absolute_priority_violated = True
        if c["recovery_pct"] < 100.0:
            saw_underpaid = True
            
    can_cramdown = at_least_one_impaired_accepted and not absolute_priority_violated
    confirmation_verdict = "PLAN_CONFIRMED_VIA_CRAMDOWN" if can_cramdown else ("PLAN_CONFIRMED_CONSENSUAL" if all(c["class_accepted"] for c in payout_summary) else "CONFIRMATION_DENIED_VIOLATES_ABSOLUTE_PRIORITY")
    
    return {
        "distributable_enterprise_value": distributable_value,
        "residual_equity_recovery_usd": round(remaining_value, 2),
        "at_least_one_impaired_accepting_class": at_least_one_impaired_accepted,
        "absolute_priority_respected": not absolute_priority_violated,
        "confirmation_verdict": confirmation_verdict,
        "waterfall": payout_summary
    }

p3 = simulate_chapter11_plan_cramdown_and_absolute_priority(
    distributable_value=250000000.0,
    claims_hierarchy=[
        {"class_name": "Class 1: Secured Lenders", "total_claim_usd": 180000000.0},
        {"class_name": "Class 2: Unsecured Bondholders", "total_claim_usd": 120000000.0},
        {"class_name": "Class 3: Old Equity", "total_claim_usd": 50000000.0}
    ],
    class_voting=[
        {"class_name": "Class 1: Secured Lenders", "dollar_approval_pct": 100.0, "headcount_approval_pct": 100.0},
        {"class_name": "Class 2: Unsecured Bondholders", "dollar_approval_pct": 72.0, "headcount_approval_pct": 65.0},
        {"class_name": "Class 3: Old Equity", "dollar_approval_pct": 10.0, "headcount_approval_pct": 15.0}
    ]
)
dist_val_s = "$" + f"{p3['distributable_enterprise_value']:,.2f}"
print(f"Distributable Value: {dist_val_s} | Verdict: {p3['confirmation_verdict']}")
for c in p3["waterfall"]:
    payout_s = "$" + f"{c['payout_usd']:,.2f}"
    print(f"  {c['class']}: {payout_s} ({c['recovery_pct']}%) | Impaired: {c['is_impaired']} | Approved: {c['class_accepted']}")`,
        output: `Distributable Value: $250,000,000.00 | Verdict: PLAN_CONFIRMED_VIA_CRAMDOWN
  Class 1: Secured Lenders: $180,000,000.00 (100.0%) | Impaired: False | Approved: True
  Class 2: Unsecured Bondholders: $70,000,000.00 (58.33%) | Impaired: True | Approved: True
  Class 3: Old Equity: $0.00 (0.0%) | Impaired: True | Approved: False`,
        codeNotes: [
          { line: 9, note: 'Executes strict waterfall recovery prioritizing secured lenders then unsecured bondholders' },
          { line: 17, note: 'Validates Section 1126(c) statutory voting thresholds (66.7% dollar amount and 50% headcount)' },
          { line: 31, note: 'Applies Absolute Priority Rule wiping out Old Equity ($0.00) while senior creditors are impaired' },
          { line: 55, note: 'Confirms Chapter 11 plan via Section 1129(b) cramdown over rejecting equity class' }
        ],
        tryIt: 'Give Old Equity $10M while unsecured bondholders receive $60M to observe confirmation denied for violating absolute priority.',
        check: {
          question: 'What is the Absolute Priority Rule under Bankruptcy Code Section 1129(b)(2)(B)?',
          options: [
            'In a non-consensual cramdown plan, senior dissenting creditor classes must be paid in full before any junior class (such as common equity) receives or retains any property under the plan.',
            'The first creditor to file a lawsuit receives all assets of the company.',
            'Government tax debts are automatically wiped out before bondholders are paid.',
            'Corporate directors must personally pay all debts of the company.'
          ],
          answer: 0,
          why: 'The Absolute Priority Rule prevents equity holders from retaining ownership value while intermediate unsecured creditors suffer haircut losses without consenting.',
          answerIndex: 0,
          explanation: 'The Absolute Priority Rule prevents equity holders from retaining ownership value while intermediate unsecured creditors suffer haircut losses without consenting.'
        }
      },
      {
        title: 'Fiduciary Duties in the "Zone of Insolvency" & Fraudulent Conveyances',
        say: [
          'When a corporation enters financial distress, executives and directors face intense legal pressure regarding their fiduciary duties. In the landmark decision North American Catholic Educational Programming Foundation, Inc. v. Gheewalla, the Delaware Supreme Court decisively resolved a long-standing corporate law debate: directors of an insolvent Delaware corporation do NOT owe direct fiduciary duties to creditors, nor do direct duties shift to creditors in the so-called "zone of insolvency."',
          'Instead, Gheewalla confirmed that directors owe fiduciary duties solely to the corporate enterprise as a whole. While creditors gain derivative standing to sue on behalf of the insolvent company for breaches of fiduciary duty, directors retain the protection of the Business Judgment Rule when making good-faith operational decisions aimed at maximizing the overall residual value of the firm for all stakeholders.',
          'However, directors face severe statutory liability under the law of Fraudulent Conveyance (Bankruptcy Code Section 548 and the Uniform Voidable Transactions Act). A transfer is constructively fraudulent if: (1) The company was balance-sheet insolvent or rendered insolvent by the transaction, (2) The company received less than "reasonably equivalent value" in exchange, and (3) The transfer occurred within the 2-year federal lookback window (or up to 4-6 years under state law). Bankruptcy trustees aggressively claw back pre-petition shareholder dividends or leveraged buyout distributions, returning millions in cash to the estate.'
        ],
        example: 'Fourteen months prior to bankruptcy while balance-sheet insolvent ($180M debt vs $120M assets), the company paid a $15M dividend to equity holders receiving $0 consideration. The court rules constructive fraud, ordering AVOIDABLE_FRAUDULENT_CONVEYANCE_CLAWBACK_ORDERED and recovering $15.0M for creditors.',
        code: `# Zone of Insolvency Fiduciary Scope & Fraudulent Conveyance Clawback Engine
def audit_zone_of_insolvency_and_fraudulent_conveyance(fair_value_assets: float, total_liabilities: float,
                                                       suspect_transfer_value: float, consideration_received: float,
                                                       transfer_months_ago: int) -> dict:
    balance_sheet_insolvent = total_liabilities > fair_value_assets
    
    # Gheewalla standard: directors do not owe direct duties to creditors, only to corporate entity
    director_fiduciary_beneficiary = "CORPORATE_ENTERPRISE_AS_WHOLE" if balance_sheet_insolvent else "SHAREHOLDERS"
    
    # Fraudulent conveyance under Bankruptcy Code Section 548:
    # Constructive fraud: transferred while insolvent for less than reasonably equivalent value, within 2-year lookback
    within_lookback = transfer_months_ago <= 24
    inadequate_consideration = consideration_received < (suspect_transfer_value * 0.70)
    is_constructive_fraud = balance_sheet_insolvent and inadequate_consideration and within_lookback
    
    clawback_amount = (suspect_transfer_value - consideration_received) if is_constructive_fraud else 0.0
    
    return {
        "balance_sheet_insolvent": balance_sheet_insolvent,
        "fiduciary_duty_standard": director_fiduciary_beneficiary,
        "transfer_value_usd": suspect_transfer_value,
        "consideration_received_usd": consideration_received,
        "transfer_months_ago": transfer_months_ago,
        "is_fraudulent_transfer": is_constructive_fraud,
        "clawback_remedy_usd": round(clawback_amount, 2),
        "legal_verdict": "AVOIDABLE_FRAUDULENT_CONVEYANCE_CLAWBACK_ORDERED" if is_constructive_fraud else "LEGITIMATE_BUSINESS_TRANSFER"
    }

p4 = audit_zone_of_insolvency_and_fraudulent_conveyance(
    fair_value_assets=120000000.0, total_liabilities=180000000.0,
    suspect_transfer_value=15000000.0, consideration_received=0.0,
    transfer_months_ago=14
)
claw_s = "$" + f"{p4['clawback_remedy_usd']:,.2f}"
print(f"Insolvent: {p4['balance_sheet_insolvent']} | Duty Owed To: {p4['fiduciary_duty_standard']}")
print(f"Fraudulent Conveyance: {p4['is_fraudulent_transfer']} | Clawback: {claw_s} -> {p4['legal_verdict']}")`,
        output: `Insolvent: True | Duty Owed To: CORPORATE_ENTERPRISE_AS_WHOLE
Fraudulent Conveyance: True | Clawback: $15,000,000.00 -> AVOIDABLE_FRAUDULENT_CONVEYANCE_CLAWBACK_ORDERED`,
        codeNotes: [
          { line: 5, note: 'Applies Delaware Gheewalla precedent confirming fiduciary duties remain owed to the enterprise as a whole' },
          { line: 11, note: 'Tests Section 548 constructive fraud prongs: insolvency, inadequate consideration, and 2-year lookback' },
          { line: 15, note: 'Calculates $15.0M clawback remedy recovering unearned shareholder dividends back into estate' },
          { line: 30, note: 'Orders fraudulent conveyance avoidance restoring funds to pari passu unsecured creditors' }
        ],
        tryIt: 'Increase consideration_received to $15.0M to verify reasonably equivalent exchange defeats fraudulent conveyance claims.',
        check: {
          question: 'Under the Delaware Supreme Court\'s landmark Gheewalla ruling, what fiduciary duties do corporate directors owe directly to individual creditors when a company enters the "zone of insolvency"?',
          options: [
            'None; directors do not owe direct fiduciary duties to creditors, but continue to owe their fiduciary duties to the corporate enterprise as a whole for the benefit of all residual claimants.',
            'Directors must immediately surrender their personal homes to the bank.',
            'Directors must prioritize paying unsecured bondholders before employees or vendors.',
            'Creditors automatically gain the legal right to vote on corporate board resolutions.'
          ],
          answer: 0,
          why: 'Gheewalla firmly rejected creditor direct fiduciary claims, preserving the Business Judgment Rule for directors managing an enterprise through insolvency.',
          answerIndex: 0,
          explanation: 'Gheewalla firmly rejected creditor direct fiduciary claims, preserving the Business Judgment Rule for directors managing an enterprise through insolvency.'
        }
      },
      {
        title: 'Capstone Boardroom Defense & General Counsel Restructuring Certification',
        say: [
          'In this milestone capstone, you assume the role of Corporate General Counsel and Chief Restructuring Advisor to orchestrate the emergency defense and successful Chapter 11 emergence of Apex Aerospace Dynamics Corp before the United States Bankruptcy Court and the Board of Directors. The restructuring control tower integrates all legal disciplines mastered across corporate jurisprudence: contract protection, fiduciary defense, asset disposition, and statutory plan confirmation.',
          'Your restructuring plan deploys Section 362 automatic stay protections and secures a $50M Section 364(d) priming DIP financing facility to keep production lines humming. You conduct an expedited Section 363 stalking horse auction of non-core satellite operations, netting $88.6M in estate liquidity free and clear of successor liabilities. Simultaneously, your forensic litigation team successfully claws back $15.0M in pre-petition constructive fraudulent conveyances.',
          'Finally, you defend the Plan of Reorganization in court against a dissenting old equity committee, successfully achieving confirmation under Section 1129(b) cramdown while strictly honoring the Absolute Priority Rule. Having successfully restructured $300M in liabilities and preserved enterprise going-concern value, you secure judicial confirmation and earn the accredited credential: Certified Corporate General Counsel & Restructuring Advisor. Course bcom_law is now 100% complete.'
        ],
        example: 'Under Chapter 11 reorganization, Apex Aerospace secures $50M DIP funding, captures $88.6M in Section 363 sales, claws back $15M in fraudulent transfers, and confirms a cramdown plan over old equity, securing full judicial confirmation and General Counsel Restructuring accreditation.',
        code: `# Milestone 1 Capstone: End-to-End Chapter 11 Corporate Restructuring Control Tower
def run_comprehensive_corporate_restructuring_capstone(company_name: str, distress_profile: dict,
                                                       restructuring_deal: dict) -> dict:
    # 1. DIP Financing
    dip_res = structure_dip_financing_and_automatic_stay(
        distress_profile["secured_debt"], restructuring_deal["dip_loan"],
        distress_profile["unencumbered_assets"], restructuring_deal["roll_up_pct"]
    )
    
    # 2. Section 363 Non-Core Asset Sale
    sale_res = evaluate_section363_stalking_horse_auction(
        restructuring_deal["stalking_horse_bid"], restructuring_deal["breakup_fee_pct"],
        restructuring_deal["expense_reimbursement"], restructuring_deal["competing_bids"],
        restructuring_deal["min_overbid"]
    )
    
    # Total enterprise value available for plan distribution
    total_distributable = restructuring_deal["plan_reorg_enterprise_value"] + sale_res["net_estate_proceeds"]
    
    # 3. Plan Reorganization & Cramdown
    plan_res = simulate_chapter11_plan_cramdown_and_absolute_priority(
        total_distributable, restructuring_deal["debt_classes"], restructuring_deal["voting_results"]
    )
    
    # 4. Clawback audit
    claw_res = audit_zone_of_insolvency_and_fraudulent_conveyance(
        distress_profile["assets_value"], distress_profile["total_debt"],
        distress_profile["suspect_dividend"], 0.0, distress_profile["suspect_months_ago"]
    )
    
    restructuring_success = dip_res["automatic_stay_active"] and plan_res["confirmation_verdict"] == "PLAN_CONFIRMED_VIA_CRAMDOWN"
    
    return {
        "company_name": company_name,
        "dip_funding_unlocked_usd": dip_res["new_money_dip_usd"],
        "section_363_net_proceeds_usd": sale_res["net_estate_proceeds"],
        "total_distributable_value_usd": round(total_distributable, 2),
        "fraudulent_transfer_recovered_usd": claw_res["clawback_remedy_usd"],
        "plan_confirmation": plan_res["confirmation_verdict"],
        "absolute_priority_satisfied": plan_res["absolute_priority_respected"],
        "restructuring_success": restructuring_success,
        "accreditation": "Certified Corporate General Counsel & Restructuring Advisor" if restructuring_success else "CHAPTER_7_LIQUIDATION_CONVERSION"
    }

p5 = run_comprehensive_corporate_restructuring_capstone(
    "Apex Aerospace Dynamics Corp",
    {
        "secured_debt": 150000000.0, "unencumbered_assets": 60000000.0,
        "assets_value": 120000000.0, "total_debt": 180000000.0,
        "suspect_dividend": 15000000.0, "suspect_months_ago": 14
    },
    {
        "dip_loan": 50000000.0, "roll_up_pct": 20.0,
        "stalking_horse_bid": 80000000.0, "breakup_fee_pct": 3.0,
        "expense_reimbursement": 1000000.0, "min_overbid": 2000000.0,
        "competing_bids": [{"bidder": "Rival Acquirer Corp", "amount": 92000000.0}],
        "plan_reorg_enterprise_value": 161400000.0,
        "debt_classes": [
            {"class_name": "Class 1: Secured Lenders", "total_claim_usd": 180000000.0},
            {"class_name": "Class 2: Unsecured Bondholders", "total_claim_usd": 120000000.0},
            {"class_name": "Class 3: Old Equity", "total_claim_usd": 50000000.0}
        ],
        "voting_results": [
            {"class_name": "Class 1: Secured Lenders", "dollar_approval_pct": 100.0, "headcount_approval_pct": 100.0},
            {"class_name": "Class 2: Unsecured Bondholders", "dollar_approval_pct": 72.0, "headcount_approval_pct": 65.0},
            {"class_name": "Class 3: Old Equity", "dollar_approval_pct": 10.0, "headcount_approval_pct": 15.0}
        ]
    }
)
total_val = "$" + f"{p5['total_distributable_value_usd']:,.2f}"
claw_val = "$" + f"{p5['fraudulent_transfer_recovered_usd']:,.2f}"
print(f"Company: {p5['company_name']}")
print(f"Distributable Value: {total_val} | Clawback Recovered: {claw_val}")
print(f"Plan Confirmation: {p5['plan_confirmation']} | Success: {p5['restructuring_success']}")
print(f"Accreditation: {p5['accreditation']}")`,
        output: `Company: Apex Aerospace Dynamics Corp
Distributable Value: $250,000,000.00 | Clawback Recovered: $15,000,000.00
Plan Confirmation: PLAN_CONFIRMED_VIA_CRAMDOWN | Success: True
Accreditation: Certified Corporate General Counsel & Restructuring Advisor`,
        codeNotes: [
          { line: 5, note: 'Orchestrates $50M Section 364(d) superpriority DIP loan injection to sustain operations' },
          { line: 11, note: 'Executes Section 363 stalking horse auction netting $88.6M estate liquidity free and clear' },
          { line: 17, note: 'Distributes $250M enterprise value across classes and confirms plan via cramdown' },
          { line: 23, note: 'Recovers $15.0M fraudulent transfer and earns Corporate General Counsel certification' }
        ],
        tryIt: 'Zero out DIP financing to observe liquidity collapse and conversion to Chapter 7 liquidation.',
        check: {
          question: 'In a corporate Chapter 11 reorganization, what legal finding allows the bankruptcy court to confirm a Plan of Reorganization via "cramdown" over the unanimous rejection of common equity holders?',
          options: [
            'At least one impaired creditor class accepts the plan without insider votes, and the plan complies with the Absolute Priority Rule by providing zero recovery to junior equity while senior creditors are impaired.',
            'The judge personally owns shares in the corporate debtor.',
            'The company changes its incorporation from Delaware to Nevada.',
            'The common shareholders fail to attend the court hearing in business suits.'
          ],
          answer: 0,
          why: 'Section 1129(b) empowers the court to cram down a plan over dissenting junior classes provided that the absolute priority rule is strictly honored and an impaired creditor class votes in favor.',
          answerIndex: 0,
          explanation: 'Section 1129(b) empowers the court to cram down a plan over dissenting junior classes provided that the absolute priority rule is strictly honored and an impaired creditor class votes in favor.'
        }
      }
    ],
    summary: [
      'Chapter 11 DIP Financing: Section 362 automatic stay halts creditor lawsuits; Section 364(d) authorizes priming superpriority liens to inject essential operational liquidity.',
      'Section 363 Asset Sales: Expedites asset monetization "free and clear" of successor liabilities, utilizing stalking horse bid protections and court-supervised auctions.',
      'Absolute Priority Rule Cramdown: Mandates senior impaired creditor satisfaction before junior equity receives any recovery, enabling Section 1129(b) non-consensual plan confirmation.',
      'Zone of Insolvency Fiduciary Duties: Under Delaware Gheewalla jurisprudence, directors owe duties to the enterprise as a whole, defending against direct creditor claims.',
      'Corporate General Counsel Defense: Orchestrates end-to-end restructuring, claws back Section 548 fraudulent conveyances, and earns General Counsel & Restructuring Advisor accreditation, finalizing Course bcom_law (5/5 Days).'
    ],
    projectStep: {
      title: 'Milestone 1 Capstone: Enterprise Corporate Restructuring & Chapter 11 Control Tower',
      steps: [
        'Structure a Chapter 11 petition with automatic stay protections and Section 364(d) superpriority DIP financing.',
        'Conduct a Section 363 stalking horse auction and model asset transfer free and clear of successor claims.',
        'Simulate a Plan of Reorganization waterfall and execute a Section 1129(b) cramdown adhering to the Absolute Priority Rule.',
        'Audit pre-petition transactions for fraudulent conveyance clawbacks and present the Boardroom General Counsel defense.'
      ]
    }
  }
];

