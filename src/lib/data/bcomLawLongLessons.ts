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
  }
];

