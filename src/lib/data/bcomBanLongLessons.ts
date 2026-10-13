import type { LongLesson } from './longLessons';

/**
 * Commercial Banking, Treasury Operations & Risk Management (Course: bcom_ban)
 * Day 1: Fractional Reserves, ALM Duration Gap, Basel III & Expected Credit Loss.
 */
export const BCOM_BAN_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'bcom_ban',
    day: 1,
    title: 'Fractional Reserve Banking, ALM Duration Gaps & Basel III Capital Ratios',
    goal: 'Master commercial banking operations and balance sheet management: reserve multiplier physics, asset-liability management (ALM) duration gaps, Basel III capital adequacy ratios, liquidity coverage ratios (LCR), and expected credit loss (ECL) modeling.',
    minutes: 40,
    recap: 'Welcome to Commercial Banking & Treasury Operations. A commercial bank is not a vault that stores money; it is a highly leveraged balance sheet enterprise that transforms short-term liquid deposits into long-term illiquid productive loans.',
    parts: [
      {
        title: 'Fractional Reserve Banking & The Money Multiplier',
        say: [
          'Under Fractional Reserve Banking, commercial banks do not keep 100% of customer deposits sitting in cash vaults. Instead, they hold a required fraction (the Reserve Requirement Ratio, RRR) and lend out the remainder to businesses and homebuyers.',
          'When a bank lends out the excess reserves, those loan proceeds are deposited into another bank, which in turn holds its required reserve fraction and lends out the rest. This creates a geometric series known as the Money Multiplier: Money Multiplier m = 1 / RRR.',
          'High-Powered Base Money (M0) consists of physical currency and commercial bank reserves held at the Central Bank. The broad commercial money supply (M1 and M2) expands to M = M0 * (1 / RRR).',
          'While this expansion funds economic productivity, it creates structural maturity mismatch: depositors can withdraw their demand deposits on instantaneous notice, while the bank\'s assets (mortgages, business term loans) take years to mature.'
        ],
        example: 'If the central bank sets a 10% reserve requirement, an initial $100,000 cash deposit allows Bank A to lend $90,000. That $90,000 is deposited at Bank B, which lends $81,000. Across the banking system, that initial $100,000 expands into $1,000,000 of total bank credit (a 10x multiplier).',
        code: `# Simulation: Fractional Reserve Money Creation & Credit Expansion Engine
class FractionalReserveSystem:
    def __init__(self, reserve_requirement_ratio: float):
        if not (0.01 <= reserve_requirement_ratio <= 1.0):
            raise ValueError("Reserve ratio must be between 1% and 100%")
        self.rrr = reserve_requirement_ratio
        self.money_multiplier = 1.0 / reserve_requirement_ratio

    def simulate_credit_rounds(self, initial_deposit: float, max_rounds: int = 5) -> dict:
        total_deposits = 0.0
        total_loans_created = 0.0
        total_reserves_held = 0.0
        current_injection = initial_deposit
        round_history = []

        for r in range(1, max_rounds + 1):
            required_reserve = current_injection * self.rrr
            loanable_excess = current_injection - required_reserve
            
            total_deposits += current_injection
            total_reserves_held += required_reserve
            total_loans_created += loanable_excess

            round_history.append({
                "Round": r,
                "Deposit_Injected": round(current_injection, 2),
                "Reserve_Held": round(required_reserve, 2),
                "Loan_Disbursed": round(loanable_excess, 2)
            })

            current_injection = loanable_excess # Injected into next bank

        theoretical_max_money = initial_deposit * self.money_multiplier

        return {
            "Reserve_Ratio_Pct": self.rrr * 100.0,
            "Theoretical_Multiplier": round(self.money_multiplier, 1),
            "Initial_Base_Injection": round(initial_deposit, 2),
            "Simulated_Deposits_Rounds": round(total_deposits, 2),
            "Simulated_Loans_Created": round(total_loans_created, 2),
            "Theoretical_Limit_Money_Supply": round(theoretical_max_money, 2)
        }

banking_system = FractionalReserveSystem(reserve_requirement_ratio=0.10) # 10% Reserve Requirement
result = banking_system.simulate_credit_rounds(initial_deposit=100000.0, max_rounds=5)

print(f"Reserve Requirement:        {result['Reserve_Ratio_Pct']}%")
print(f"Money Multiplier:           {result['Theoretical_Multiplier']}x")
print(f"Initial Central Injection:  \${result['Initial_Base_Injection']:,}")
print(f"Deposits Created (5 Rds):   \${result['Simulated_Deposits_Rounds']:,}")
print(f"Loans Disbursed (5 Rds):    \${result['Simulated_Loans_Created']:,}")
print(f"Theoretical Max M1 Supply:  \${result['Theoretical_Limit_Money_Supply']:,}")`,
        output: `Reserve Requirement:        10.0%\nMoney Multiplier:           10.0x\nInitial Central Injection:  $100,000.0\nDeposits Created (5 Rds):   $409,510.0\nLoans Disbursed (5 Rds):    $368,559.0\nTheoretical Max M1 Supply:  $1,000,000.0`,
        tryIt: 'Increase the reserve requirement to 20% and verify that the theoretical money multiplier falls from 10.0x to 5.0x.',
        check: {
          question: 'What is the primary structural vulnerability created by fractional reserve banking?',
          options: [
            'Maturity mismatch between instantaneous demand deposits (liquid liabilities) and multi-year loans (illiquid assets), exposing the bank to bank runs if all depositors withdraw simultaneously.',
            'Central banks refuse to clear electronic check transactions for fractional reserve banks.',
            'Commercial banks cannot charge interest on loans disbursed from fractional reserves.',
            'Fractional reserve banks are legally barred from issuing credit cards to consumers.'
          ],
          answerIndex: 0,
          explanation: 'Because banks hold only a small fraction of customer deposits in cash reserves, if a sudden surge of depositors demand their cash simultaneously, the bank cannot immediately liquidate its 30-year mortgages and commercial term loans, causing an acute liquidity crisis and insolvency.'
        }
      },
      {
        title: 'Asset-Liability Management (ALM) & The Duration Gap',
        say: [
          'Commercial bank Treasury teams must continuously manage interest rate risk across their balance sheets. When interest rates rise or fall, the market values of assets (fixed-rate loans, Treasury bonds) and liabilities (customer deposits, term borrowings) change at different speeds.',
          'Macaulay Duration measures the weighted average time until all cash flows from an asset or liability are received. Modified Duration measures the sensitivity of that value to changes in interest rates: % Delta Value = -Modified Duration * Delta Yield.',
          'The Duration Gap (DG) measures the net interest rate risk of the entire bank: DG = Duration_Assets - (Total_Liabilities / Total_Assets) * Duration_Liabilities.',
          'If a bank has a positive Duration Gap (typical in commercial banks where loans have long 7-year durations and deposits reprice in 1 year), an increase in benchmark interest rates DESTROYS bank equity: Delta Equity = -Duration_Gap * Total_Assets * Delta Interest_Rate.',
          'This exact duration mismatch caused the historic failure of Silicon Valley Bank in 2023 when rising interest rates wiped out bank capital on unhedged long-duration Treasury portfolios.'
        ],
        example: 'A bank with $100B in assets (duration 5.0 years) and $90B in deposits (duration 1.0 year) has a Duration Gap of 5.0 - (0.9 * 1.0) = 4.1 years. If interest rates rise by 2.0% (0.02), bank equity drops by: -4.1 * $100B * 0.02 = -$8.2 Billion! That can wipe out the bank\'s entire capital buffer.',
        code: `# Simulation: ALM Duration Gap & Net Bank Equity Sensitivity Simulator
class AssetLiabilityManager:
    def __init__(self, total_assets: float, duration_assets: float, 
                 total_liabilities: float, duration_liabilities: float):
        self.assets = total_assets
        self.d_a = duration_assets
        self.liabilities = total_liabilities
        self.d_l = duration_liabilities
        self.equity = total_assets - total_liabilities
        
        # Duration Gap Formula: D_A - (L / A) * D_L
        self.duration_gap = self.d_a - (self.liabilities / self.assets) * self.d_l

    def stress_test_interest_rate_shock(self, rate_shock_bps: int) -> dict:
        delta_rate = rate_shock_bps / 10000.0 # e.g. +200 bps = +0.02
        
        # Delta Equity = - Duration_Gap * Total_Assets * Delta_Rate
        delta_equity = -self.duration_gap * self.assets * delta_rate
        new_equity = self.equity + delta_equity
        equity_change_pct = (delta_equity / self.equity) * 100.0 if self.equity > 0 else 0.0

        is_insolvent = new_equity <= 0.0

        return {
            "Total_Assets": self.assets,
            "Initial_Equity": self.equity,
            "Duration_Gap_Years": round(self.duration_gap, 2),
            "Rate_Shock_Bps": f"+{rate_shock_bps} bps",
            "Equity_Destruction_Dollars": round(delta_equity, 2),
            "New_Bank_Equity": round(new_equity, 2),
            "Equity_Change_Pct": round(equity_change_pct, 1),
            "Bank_Insolvency_Risk": is_insolvent
        }

alm = AssetLiabilityManager(
    total_assets=100000000.0,    # $100M in assets
    duration_assets=4.5,         # 4.5 years duration (long loans)
    total_liabilities=90000000.0,# $90M in liabilities
    duration_liabilities=1.0     # 1.0 year duration (short deposits)
)

stress_200bps = alm.stress_test_interest_rate_shock(rate_shock_bps=200) # +2.0% rate hike

print(f"Initial Bank Capital (Equity): \${stress_200bps['Initial_Equity']:,}")
print(f"ALM Duration Gap:              {stress_200bps['Duration_Gap_Years']} Years")
print(f"Rate Shock Tested:             {stress_200bps['Rate_Shock_Bps']}")
print(f"Equity Impact:                 \${stress_200bps['Equity_Destruction_Dollars']:,} ({stress_200bps['Equity_Change_Pct']}%)")
print(f"New Equity Remaining:          \${stress_200bps['New_Bank_Equity']:,}")
print(f"Insolvent State:               {stress_200bps['Bank_Insolvency_Risk']}")`,
        output: `Initial Bank Capital (Equity): $10,000,000.0\nALM Duration Gap:              3.6 Years\nRate Shock Tested:             +200 bps\nEquity Impact:                 -$7,200,000.0 (-72.0%)\nNew Equity Remaining:          $2,800,000.0\nInsolvent State:               False`,
        tryIt: 'Increase the rate shock from 200 bps to 300 bps (+3.0%) and observe the bank become insolvent with negative equity (-$800k).',
        check: {
          question: 'How can a bank Treasury team eliminate interest rate risk when they have a positive Duration Gap?',
          options: [
            'By executing interest rate swaps (paying fixed, receiving floating) or shortening asset durations to bring the Duration Gap to approximately zero.',
            'By refusing to pay interest on customer checking accounts.',
            'By hiding fixed-rate bonds in an offshore subsidiary that ignores market valuations.',
            'By borrowing exclusively from international credit card issuers.'
          ],
          answerIndex: 0,
          explanation: 'To immunize bank equity against rate fluctuations, the Treasury desk enters interest rate swaps to pay fixed and receive floating, or holds more floating-rate loans, neutralizing the Duration Gap (DG ≈ 0).'
        }
      },
      {
        title: 'Basel III Capital Adequacy & Risk-Weighted Assets (RWA)',
        say: [
          'Following the 2008 Global Financial Crisis, the Basel Committee on Banking Supervision instituted the Basel III framework to ensure banks hold enough equity capital to absorb severe loan defaults without needing taxpayer bailouts.',
          'Not all assets carry equal risk: a $100M loan to the U.S. Federal Government has near-zero credit default risk, whereas a $100M unsecured loan to a speculative startup has high risk. Basel III assigns Risk Weights to each asset class to calculate Risk-Weighted Assets (RWA): RWA = sum(Asset_Value * Risk_Weight %).',
          'Common risk weights: Cash (0%), Sovereign AAA Debt (0%), Prime Residential Mortgages (35%), Commercial Corporate Loans (100%), High-Yield Speculative Loans (150%).',
          'The core regulatory requirement is the Common Equity Tier 1 (CET1) Capital Ratio: CET1 Ratio = CET1 Capital / Total RWA >= 4.5% (with an additional 2.5% Capital Conservation Buffer, bringing the effective minimum to 7.0%).',
          'If a bank\'s CET1 ratio drops below regulatory thresholds, banking authorities restrict executive bonuses, suspend dividend payments, or seize the institution.'
        ],
        example: 'A bank holds $200M in cash (0% weight = $0 RWA) and $300M in corporate loans (100% weight = $300M RWA). Its Total RWA is $300M. If it has $30M in Common Equity Tier 1, its CET1 ratio is $30M / $300M = 10.0%, comfortably above the 7.0% minimum.',
        code: `# Simulation: Basel III Risk-Weighted Assets (RWA) & Capital Adequacy Ratios
from dataclasses import dataclass
from typing import List

@dataclass
class BankAssetHolding:
    name: str
    amount: float
    risk_weight: float # e.g. 0.0 for cash, 0.35 for mortgages, 1.0 for commercial loans

class BaselThreeCapitalEngine:
    REGULATORY_MIN_CET1 = 0.070 # 7.0% (4.5% base + 2.5% conservation buffer)
    REGULATORY_MIN_TIER1 = 0.085 # 8.5%
    REGULATORY_MIN_TOTAL = 0.105 # 10.5% Total capital

    def __init__(self, assets: List[BankAssetHolding], cet1_capital: float, tier2_capital: float):
        self.assets = assets
        self.cet1 = cet1_capital
        self.tier2 = tier2_capital

    def evaluate_compliance(self) -> dict:
        total_balance_sheet_assets = sum(a.amount for a in self.assets)
        total_rwa = sum(a.amount * a.risk_weight for a in self.assets)
        total_capital = self.cet1 + self.tier2

        cet1_ratio = self.cet1 / total_rwa if total_rwa > 0 else 0.0
        total_capital_ratio = total_capital / total_rwa if total_rwa > 0 else 0.0
        leverage_ratio = self.cet1 / total_balance_sheet_assets if total_balance_sheet_assets > 0 else 0.0

        is_compliant = cet1_ratio >= self.REGULATORY_MIN_CET1 and total_capital_ratio >= self.REGULATORY_MIN_TOTAL

        return {
            "Total_Book_Assets": round(total_balance_sheet_assets, 2),
            "Total_RWA": round(total_rwa, 2),
            "CET1_Capital": round(self.cet1, 2),
            "CET1_Capital_Ratio_Pct": round(cet1_ratio * 100.0, 2),
            "Total_Capital_Ratio_Pct": round(total_capital_ratio * 100.0, 2),
            "Unweighted_Leverage_Ratio_Pct": round(leverage_ratio * 100.0, 2),
            "Basel_III_Compliant": is_compliant
        }

portfolio = [
    BankAssetHolding("Central Bank Cash", 50000000.0, 0.00),         # $50M cash (0% weight)
    BankAssetHolding("Treasury Securities", 100000000.0, 0.00),       # $100M sovereign (0% weight)
    BankAssetHolding("Prime Residential Mortgages", 150000000.0, 0.35),# $150M mortgages (35% weight)
    BankAssetHolding("Commercial Corporate Loans", 200000000.0, 1.00) # $200M commercial loans (100% weight)
]

engine = BaselThreeCapitalEngine(
    assets=portfolio,
    cet1_capital=28000000.0, # $28M Tier 1 Equity
    tier2_capital=6000000.0   # $6M Subordinated Debt
)

report = engine.evaluate_compliance()
print("Basel III Capital Adequacy Evaluation:")
print(f"Total Balance Sheet:    \${report['Total_Book_Assets']:,}")
print(f"Risk-Weighted Assets:   \${report['Total_RWA']:,}")
print(f"CET1 Capital Ratio:     {report['CET1_Capital_Ratio_Pct']}% (Min 7.0%)")
print(f"Total Capital Ratio:    {report['Total_Capital_Ratio_Pct']}% (Min 10.5%)")
print(f"Unweighted Leverage:    {report['Unweighted_Leverage_Ratio_Pct']}%")
print(f"Regulatory Compliance:  {report['Basel_III_Compliant']}")`,
        output: `Basel III Capital Adequacy Evaluation:\nTotal Balance Sheet:    $500,000,000.0\nRisk-Weighted Assets:   $252,500,000.0\nCET1 Capital Ratio:     11.09% (Min 7.0%)\nTotal Capital Ratio:    13.47% (Min 10.5%)\nUnweighted Leverage:    5.6%\nRegulatory Compliance:  True`,
        tryIt: 'Drop CET1 capital to $15,000,000 and verify that CET1 Ratio falls to 5.94%, failing regulatory compliance.',
        check: {
          question: 'Why does Basel III evaluate bank capital against Risk-Weighted Assets (RWA) rather than total unweighted assets?',
          options: [
            'Because safe assets (like central bank reserves and government debt) carry negligible default risk, requiring banks to allocate equity proportional to their actual credit and market risk exposure.',
            'Because accounting software cannot calculate ratios without multiplying assets by a variable percentage.',
            'Because corporate loans are exempt from risk analysis under international treaties.',
            'Because unweighted ratios encourage banks to hold only high-risk subprime debt.'
          ],
          answerIndex: 0,
          explanation: 'If all assets required equal capital, banks would have no incentive to hold safe, liquid assets like Treasuries and cash. RWA ensures that banks holding risky commercial loans or derivatives must hold proportionally larger equity capital cushions.'
        }
      },
      {
        title: 'Liquidity Coverage Ratio (LCR) & 30-Day Stressed Cash Outflows',
        say: [
          'Capital solvency (having positive net assets) is useless if a bank cannot meet immediate cash obligations tomorrow morning. A bank can be fully solvent on paper and still fail in 48 hours due to a liquidity squeeze.',
          'Basel III introduced the Liquidity Coverage Ratio (LCR) to guarantee that commercial banks maintain an unencumbered buffer of High-Quality Liquid Assets (HQLA) that can be converted to cash instantly in private markets.',
          'The LCR mandates that a bank must survive a severe 30-day liquidity stress scenario: LCR = Total Stock of HQLA / Total Net Cash Outflows over 30 Days >= 100%.',
          'HQLA includes Level 1 assets (cash, central bank reserves, zero-haircut sovereign bonds) and Level 2 assets (qualifying corporate bonds subject to 15% to 50% valuation haircuts).',
          '30-day stressed outflows model aggressive runoff rates: retail deposits run off at 5-10%, but unsecured wholesale corporate deposits run off at 40-100% as corporate CFOs rapidly pull uncollateralized treasury funds.'
        ],
        example: 'If a bank has $20B in HQLA and projects $15B in net stressed cash outflows over a 30-day bank run simulation, its LCR is $20B / $15B = 133.3%, which exceeds the 100% legal minimum.',
        code: `# Simulation: Basel III Liquidity Coverage Ratio (LCR) Stressed Runoff Calculator
class LiquidityCoverageModel:
    def __init__(self, hqla_cash: float, hqla_treasuries: float, hqla_corp_bonds: float):
        # Level 1: 100% weight (0% haircut)
        # Level 2A: 85% weight (15% haircut)
        self.hqla = hqla_cash + hqla_treasuries + (hqla_corp_bonds * 0.85)

    def calculate_lcr(self, retail_deposits: float, wholesale_corporate_deposits: float,
                      contractual_inflows: float) -> dict:
        # 30-Day severe stress runoff assumptions:
        # Retail stable runoff: 8%
        # Wholesale corporate operational runoff: 40%
        # Inflows capped at 75% of total outflows (regulatory floor)
        gross_outflows = (retail_deposits * 0.08) + (wholesale_corporate_deposits * 0.40)
        max_allowable_inflows = gross_outflows * 0.75
        effective_inflows = min(contractual_inflows, max_allowable_inflows)
        
        net_stressed_outflows = gross_outflows - effective_inflows
        lcr_ratio = (self.hqla / net_stressed_outflows) * 100.0 if net_stressed_outflows > 0 else 0.0
        
        is_lcr_compliant = lcr_ratio >= 100.0

        return {
            "Total_HQLA_Buffer": round(self.hqla, 2),
            "Stressed_Outflows_30D": round(gross_outflows, 2),
            "Stressed_Inflows_30D": round(effective_inflows, 2),
            "Net_Stressed_Cash_Outflow": round(net_stressed_outflows, 2),
            "LCR_Ratio_Pct": round(lcr_ratio, 2),
            "LCR_Compliant": is_lcr_compliant
        }

lcr_model = LiquidityCoverageModel(
    hqla_cash=12000000.0,       # $12M cash
    hqla_treasuries=25000000.0, # $25M sovereign treasuries
    hqla_corp_bonds=10000000.0  # $10M corporate bonds ($8.5M after 15% haircut)
)

results = lcr_model.calculate_lcr(
    retail_deposits=150000000.0,             # $150M retail (8% runoff = $12M)
    wholesale_corporate_deposits=60000000.0, # $60M wholesale (40% runoff = $24M)
    contractual_inflows=5000000.0            # $5M contractual incoming loan repayments
)

print("Bank Liquidity Coverage Ratio (LCR) Report:")
print(f"High-Quality Liquid Assets (HQLA): \${results['Total_HQLA_Buffer']:,}")
print(f"Gross 30-Day Stressed Outflows:    \${results['Stressed_Outflows_30D']:,}")
print(f"Net 30-Day Stressed Outflows:      \${results['Net_Stressed_Cash_Outflow']:,}")
print(f"LCR Ratio:                         {results['LCR_Ratio_Pct']}% (Min 100.0%)")
print(f"Liquidity Buffer Compliant:        {results['LCR_Compliant']}")`,
        output: `Bank Liquidity Coverage Ratio (LCR) Report:\nHigh-Quality Liquid Assets (HQLA): $45,500,000.0\nGross 30-Day Stressed Outflows:    $36,000,000.0\nNet 30-Day Stressed Outflows:      $31,000,000.0\nLCR Ratio:                         146.77% (Min 100.0%)\nLiquidity Buffer Compliant:        True`,
        tryIt: 'Increase wholesale corporate deposits to $120,000,000 (raising outflows to $60M) and see LCR drop below 100% to 82.7%.',
        check: {
          question: 'Why do bank regulators assign much higher 30-day runoff rates (40-100%) to wholesale corporate deposits than retail consumer deposits (5-10%)?',
          options: [
            'Corporate treasurers actively monitor bank balance sheets and will pull multi-million-dollar uninsured balances at the first sign of trouble, whereas retail deposits are insured and "sticky".',
            'Because corporate deposits are legally exempt from bankruptcy court protections.',
            'Because retail consumers are prohibited by law from withdrawing money during economic recessions.',
            'Because corporate deposits cannot be transferred via electronic wire transfer systems.'
          ],
          answerIndex: 0,
          explanation: 'Corporate treasury deposits are typically uninsured (exceeding deposit insurance caps like the $250,000 FDIC limit). Corporate treasurers have a fiduciary duty to preserve principal, meaning they rapidly withdraw funds at the first whisper of distress.'
        }
      },
      {
        title: 'Credit Risk Scoring & Expected Credit Loss (ECL / CECL)',
        say: [
          'Commercial banks make money by taking calculated credit risk. In modern banking under IFRS 9 and US GAAP CECL (Current Expected Credit Losses), banks do not wait for a loan to default before recognizing a loss.',
          'Expected Credit Loss (ECL) is computed forward-looking across the life of the loan using the foundational banking credit equation: Expected Credit Loss (ECL) = Probability of Default (PD) * Loss Given Default (LGD) * Exposure at Default (EAD).',
          'Probability of Default (PD) is the statistical likelihood that the borrower fails to make contractual payments within a given timeframe, calibrated using financial ratios (Interest Coverage, Debt/EBITDA, Liquidity).',
          'Loss Given Default (LGD) is the percentage of exposure the bank loses after seizing and liquidating underlying loan collateral: LGD = 1.0 - Recovery Rate %.',
          'Exposure at Default (EAD) is the total dollar obligation outstanding when default occurs, including disbursed principal and committed unutilized credit lines.'
        ],
        example: 'A bank issues a $10,000,000 construction loan (EAD = $10M). The developer has a 3.0% Probability of Default (PD = 0.03). The loan is secured by physical land worth 60% of the loan value (Recovery Rate = 60%, so LGD = 40% = 0.40). The bank\'s Expected Credit Loss is: 0.03 * 0.40 * $10,000,000 = $120,000, which must be set aside as a loan loss provision.',
        code: `# Simulation: Credit Risk Modeling & Forward-Looking ECL Loan Loss Reserves
from dataclasses import dataclass
from typing import List

@dataclass
class LoanExposure:
    borrower_name: str
    facility_type: str
    ead: float          # Exposure at Default
    pd: float           # Probability of Default (0.0 to 1.0)
    recovery_rate: float # Collateral recovery rate (0.0 to 1.0)

class CreditPortfolioRiskEngine:
    def __init__(self, loans: List[LoanExposure]):
        self.loans = loans

    def evaluate_portfolio_ecl(self) -> dict:
        total_ead = sum(l.ead for l in self.loans)
        total_ecl = 0.0
        loan_breakdown = []

        for l in self.loans:
            lgd = 1.0 - l.recovery_rate
            # ECL = PD * LGD * EAD
            loan_ecl = l.pd * lgd * l.ead
            total_ecl += loan_ecl

            loan_breakdown.append({
                "Borrower": l.borrower_name,
                "EAD": round(l.ead, 2),
                "PD_Pct": round(l.pd * 100.0, 2),
                "LGD_Pct": round(lgd * 100.0, 1),
                "Expected_Loss": round(loan_ecl, 2)
            })

        blended_loss_provision_pct = (total_ecl / total_ead) * 100.0 if total_ead > 0 else 0.0

        return {
            "Total_Committed_EAD": round(total_ead, 2),
            "Total_Required_ECL_Reserve": round(total_ecl, 2),
            "Blended_Provision_Rate_Pct": round(blended_loss_provision_pct, 3),
            "Loan_Details": loan_breakdown
        }

portfolio = [
    LoanExposure("Prime Logistics Center", "Secured Commercial Mortgage", 20000000.0, 0.015, 0.70), # 1.5% PD, 70% Recovery
    LoanExposure("Mid-Market Industrial Corp", "Senior Revolving Credit", 10000000.0, 0.040, 0.50), # 4.0% PD, 50% Recovery
    LoanExposure("Tech SaaS Growth Line", "Unsecured Working Capital", 5000000.0, 0.080, 0.15)      # 8.0% PD, 15% Recovery
]

engine = CreditPortfolioRiskEngine(portfolio)
report = engine.evaluate_portfolio_ecl()

print("Commercial Bank Credit Risk & ECL Provision Report:")
print(f"Total Portfolio EAD:          \${report['Total_Committed_EAD']:,}")
print(f"Total Required ECL Reserves:  \${report['Total_Required_ECL_Reserve']:,}")
print(f"Blended Loan Loss Provision:  {report['Blended_Provision_Rate_Pct']}%")
for item in report['Loan_Details']:
    print(f" - {item['Borrower']:<26}: EAD \${item['EAD']:>10,} | PD {item['PD_Pct']:>4}% | ECL \${item['Expected_Loss']:,}")`,
        output: `Commercial Bank Credit Risk & ECL Provision Report:\nTotal Portfolio EAD:          $35,000,000.0\nTotal Required ECL Reserves:  $630,000.0\nBlended Loan Loss Provision:  1.8%\n - Prime Logistics Center    : EAD $20,000,000.0 | PD 1.5% | ECL $90,000.0\n - Mid-Market Industrial Corp: EAD $10,000,000.0 | PD  4.0% | ECL $200,000.0\n - Tech SaaS Growth Line     : EAD  $5,000,000.0 | PD  8.0% | ECL $340,000.0`,
        tryIt: 'Improve the collateral backing on Tech SaaS Growth Line from 15% recovery to 60% recovery and watch its ECL provision fall from $340k to $160k.',
        check: {
          question: 'Under the Expected Credit Loss formula ECL = PD * LGD * EAD, why does securing a loan with prime real estate collateral reduce the bank\'s required loan loss provision?',
          options: [
            'Because high-value collateral raises the expected recovery rate upon default, directly reducing Loss Given Default (LGD = 1 - Recovery Rate).',
            'Because real estate collateral legally exempts the borrower from having to make monthly interest payments.',
            'Because collateralized loans are hidden from banking regulatory audits.',
            'Because physical collateral automatically eliminates the borrower\'s Probability of Default (PD = 0).'
          ],
          answerIndex: 0,
          explanation: 'Collateral does not prevent a business from having cash flow troubles (PD can remain unchanged), but it guarantees that if default occurs, the bank can seize and auction the physical asset to recover principal, driving LGD down and minimizing net credit loss.'
        }
      }
    ],
    summary: [
      'Fractional reserve banking expands central bank base money (M0) through the money multiplier (m = 1 / RRR) while creating balance sheet maturity mismatches.',
      'Asset-Liability Management (ALM) calculates the Duration Gap (DG = D_A - (L/A)*D_L); a positive gap destroys bank capital during interest rate hiking cycles.',
      'Basel III enforces capital adequacy via Common Equity Tier 1 (CET1 >= 7.0% of Risk-Weighted Assets RWA) to ensure equity absorbs loan write-downs.',
      'The Liquidity Coverage Ratio (LCR >= 100%) mandates holding enough High-Quality Liquid Assets (HQLA) to withstand 30 days of stressed deposit runoffs.',
      'Expected Credit Loss (ECL = PD * LGD * EAD) requires banks to provision forward-looking reserves against loan portfolios based on default likelihood and collateral coverage.'
    ],
    projectStep: {
      title: 'Commercial Bank Treasury & Capital Adequacy Simulator',
      steps: [
        'Simulate multi-round credit expansion under central bank reserve requirement ratios.',
        'Stress-test bank balance sheet equity against interest rate yield curve shocks using the Duration Gap.',
        'Calculate Basel III Risk-Weighted Assets (RWA) and evaluate CET1 and Total Capital ratios.',
        'Model 30-day stressed deposit runoffs to evaluate Liquidity Coverage Ratio (LCR) compliance.'
      ]
    }
  },
  {
    coursePrefix: 'bcom_ban',
    day: 2,
    title: 'Credit Underwriting, DSCR Covenants & Non-Performing Loan Workouts',
    goal: 'Master corporate and commercial credit risk underwriting: evaluating borrower debt capacity via Cash Flow Available for Debt Service (CFADS), stress-testing Debt Service Coverage (DSCR) and Fixed Charge Coverage (FCCR) against rate hikes, calculating asset-based Borrowing Base Certificates with collateral haircuts, modeling Risk-Adjusted Return on Capital (RAROC) credit pricing, and implementing IFRS 9 3-stage ECL provisioning and NPL troubled debt restructuring workouts.',
    minutes: 42,
    recap: 'On Day 1 we analyzed balance sheet ALM duration mismatches and regulatory Basel III capital buffers. Today we dive into the core profit engine of commercial banking: credit underwriting, calculating borrower debt coverage ratios, and resolving delinquent loan workouts.',
    parts: [
      {
        title: 'The 5 Cs of Credit & CFADS Debt Capacity Underwriting',
        say: [
          'Commercial lending is not about gambling on equity upside; it is about asymmetric downside risk management. A lender receives a capped fixed interest rate in success, but risks losing 100% of principal in default.',
          'Prudent credit underwriting is anchored in the classical 5 Cs of Credit: Character (integrity and payment history), Capacity (cash flow generation), Capital (borrower equity invested), Collateral (secondary asset pledge), and Conditions (macroeconomic environment).',
          'Crucially, bankers never rely on accounting net income to service debt! Net income is distorted by non-cash depreciation accruals and working capital movements.',
          'Instead, credit analysts calculate Cash Flow Available for Debt Service (CFADS): CFADS = EBITDA - Maintenance Capex - Cash Taxes.',
          'In corporate underwriting, prudent leverage boundaries dictate that total debt should not exceed 3.0x to 4.0x CFADS. Any proposed loan that breaches this debt capacity ceiling poses unacceptable insolvency risk.',
          'Collateral is strictly a secondary source of repayment; a bank that relies on seizing collateral to get repaid made a bad loan on day one.'
        ],
        example: 'Imagine a logistics fleet operator generating $12.5M in EBITDA. After paying $2.5M to replace worn-out trucks (maintenance capex) and $1.8M in corporate taxes, the company has $8.2M in genuine CFADS. At a conservative 3.5x leverage ceiling, the firm can support $28.7M in total debt. Since it currently owes $15.0M, the bank can safely approve an incremental $13.7M credit facility.',
        code: `# Simulation: 5 Cs of Credit & CFADS Debt Capacity Engine
from dataclasses import dataclass

@dataclass
class CorporateBorrower:
    name: str
    ebitda: float
    maintenance_capex: float
    cash_taxes: float
    existing_unhedged_debt: float
    character_score: float # 1-10
    collateral_appraised_value: float

def evaluate_debt_capacity(borrower: CorporateBorrower) -> dict:
    # Cash Flow Available for Debt Service (CFADS)
    cfads = borrower.ebitda - borrower.maintenance_capex - borrower.cash_taxes
    # Standard conservative leverage ceiling (3.5x CFADS)
    max_prudent_debt = cfads * 3.5
    incremental_borrowing_capacity = max(0.0, max_prudent_debt - borrower.existing_unhedged_debt)
    
    underwrite_verdict = (
        "APPROVED_FOR_UNDERWRITING" if borrower.character_score >= 7.0 and incremental_borrowing_capacity > 0
        else "REJECTED_GOVERNANCE_OR_CAPACITY_LIMIT"
    )

    return {
        "Borrower": borrower.name,
        "CFADS_Annual": f"\${round(cfads / 1e6, 2)}M",
        "Max_Prudent_Debt_Limit": f"\${round(max_prudent_debt / 1e6, 2)}M",
        "Existing_Debt": f"\${round(borrower.existing_unhedged_debt / 1e6, 2)}M",
        "Incremental_Capacity": f"\${round(incremental_borrowing_capacity / 1e6, 2)}M",
        "Underwriting_Status": underwrite_verdict
    }

b1 = CorporateBorrower("Apex Logistics Ltd", 12500000.0, 2500000.0, 1800000.0, 15000000.0, 8.5, 22000000.0)
res1 = evaluate_debt_capacity(b1)
print(f"Borrower: {res1['Borrower']} | CFADS: {res1['CFADS_Annual']}")
print(f"Incremental Capacity: {res1['Incremental_Capacity']} | Status: {res1['Underwriting_Status']}")`,
        output: `Borrower: Apex Logistics Ltd | CFADS: $8.2M\nIncremental Capacity: $13.7M | Status: APPROVED_FOR_UNDERWRITING`,
        codeNotes: [
          { line: 4, note: 'CorporateBorrower encapsulates financial cash flow drivers, leverage, and qualitative character metrics' },
          { line: 15, note: 'Calculates CFADS by deducting maintenance capital expenditures and mandatory cash taxes from EBITDA' },
          { line: 17, note: 'Enforces conservative 3.5x leverage ceiling to establish maximum sustainable debt load' },
          { line: 36, note: 'Confirms Apex Logistics Ltd qualifies for $13.7M in incremental debt capacity with strong character' }
        ],
        tryIt: 'Increase existing_unhedged_debt to $30.0M on borrower b1 to observe the engine reject the application due to exhausted debt capacity.',
        check: {
          question: 'Why do commercial bank credit underwriters treat collateral strictly as a secondary source of repayment rather than the primary basis for loan approval?',
          options: [
            'Because liquidating collateral through foreclosure is expensive, lengthy, and yields uncertain recoveries; primary loan repayment must always come from ongoing operating cash flow.',
            'Because commercial banks are forbidden by federal law from holding physical collateral.',
            'Because collateral always depreciates to zero value within forty-eight hours.',
            'Because banks prefer taking operational equity stakes in defaulting companies.'
          ],
          answer: 0,
          why: 'A bank is an ongoing financial intermediary, not a liquidation auctioneer. Collateral acts solely as a structural defense mechanism if operating cash flow unexpectedly fails.',
          answerIndex: 0,
          explanation: 'A bank is an ongoing financial intermediary, not a liquidation auctioneer. Collateral acts solely as a structural defense mechanism if operating cash flow unexpectedly fails.'
        }
      },
      {
        title: 'Debt Service Coverage Ratio (DSCR) & Sensitivity Stress Testing',
        say: [
          'Once a borrower\'s debt capacity is calculated, credit underwriters evaluate the ongoing solvency cushion using the Debt Service Coverage Ratio (DSCR).',
          'DSCR measures the borrower\'s ability to pay current annual debt obligations out of operating earnings: DSCR = Net Operating Income (NOI) / Annual Debt Service (Principal + Interest).',
          'In commercial loan documentation, lenders enforce strict financial covenants requiring the borrower to maintain a minimum DSCR — typically 1.25x for established cash-flow businesses and 1.35x for construction or specialized real estate.',
          'A DSCR of exactly 1.0x means every dollar of operating profit goes toward debt service with zero margin for error; any slight revenue dip or supply cost increase precipitates immediate default.',
          'Therefore, underwriters subject the borrower to dual sensitivity stress tests: modeling an operational NOI shock (e.g. 15% revenue drop) combined with an interest rate shock (e.g. +200 basis point hike).',
          'Borrowers whose stressed DSCR holds above the covenant threshold are granted competitive interest rate margins, while vulnerable borrowers require credit enhancements such as debt service reserve accounts (DSRA).'
        ],
        example: 'Think of taking out a personal mortgage. If your monthly take-home pay is $6,000 and your mortgage payment is $4,000, your DSCR is 1.50x ($6,000 / $4,000). You have a $2,000 buffer. But if you take a pay cut down to $4,500 and your adjustable-rate mortgage jumps to $4,800, your DSCR plunges to 0.94x — you cannot cover your payment without drawing down savings or defaulting.',
        code: `# Simulation: DSCR Sensitivity & Covenant Breach Scanner
def stress_test_dscr(
    base_noi: float,
    annual_principal: float,
    annual_interest: float,
    minimum_covenant_dscr: float = 1.25,
    noi_shock_pct: float = 15.0,
    rate_hike_bps: int = 200 # 2.0%
) -> dict:
    base_debt_service = annual_principal + annual_interest
    base_dscr = round(base_noi / base_debt_service, 2)

    # Apply operational shock and interest rate shock
    stressed_noi = base_noi * (1.0 - (noi_shock_pct / 100.0))
    stressed_interest = annual_interest * (1.0 + (rate_hike_bps / 10000.0))
    stressed_debt_service = annual_principal + stressed_interest
    stressed_dscr = round(stressed_noi / stressed_debt_service, 2)

    covenant_pass_base = base_dscr >= minimum_covenant_dscr
    covenant_pass_stressed = stressed_dscr >= minimum_covenant_dscr

    return {
        "Base_NOI": f"\${round(base_noi / 1e6, 2)}M",
        "Base_Debt_Service": f"\${round(base_debt_service / 1e6, 2)}M",
        "Base_DSCR": f"{base_dscr}x",
        "Base_Covenant_Status": "COMPLIANT" if covenant_pass_base else "DEFAULT_BREACH",
        "Stressed_DSCR": f"{stressed_dscr}x",
        "Stressed_Covenant_Status": "RESILIENT" if covenant_pass_stressed else "COVENANT_BREACH_WARNING"
    }

dscr_res = stress_test_dscr(4500000.0, 1800000.0, 1200000.0, 1.25, 15.0, 200)
print(f"Base DSCR: {dscr_res['Base_DSCR']} ({dscr_res['Base_Covenant_Status']})")
print(f"Stressed DSCR: {dscr_res['Stressed_DSCR']} ({dscr_res['Stressed_Covenant_Status']})")`,
        output: `Base DSCR: 1.5x (COMPLIANT)\nStressed DSCR: 1.26x (RESILIENT)`,
        codeNotes: [
          { line: 9, note: 'Calculates base debt service as the sum of mandatory principal amortization and contractual interest' },
          { line: 14, note: 'Applies simultaneous 15% revenue shock and 200 bps interest rate hike to model stressed cash flows' },
          { line: 20, note: 'Compares stressed ratio against the 1.25x covenant hurdle to detect structural breach vulnerability' },
          { line: 28, note: 'Confirms borrower sustains 1.26x under stress, remaining covenant-compliant with a resilient cushion' }
        ],
        tryIt: 'Increase noi_shock_pct from 15.0% to 25.0% to observe the stressed DSCR slip below 1.25x and trigger a COVENANT_BREACH_WARNING.',
        check: {
          question: 'What is the commercial significance of a loan covenant specifying a minimum DSCR of 1.25x rather than 1.00x?',
          options: [
            'A 1.25x covenant ensures the borrower produces a 25% cash buffer above debt service obligations to withstand operational shocks without defaulting.',
            'A 1.25x covenant allows the bank to charge 25% additional hidden fees.',
            'It forces the borrower to liquidate 25% of their workforce annually.',
            'It indicates the loan interest rate will compound 25 times per year.'
          ],
          answer: 0,
          why: 'The 25% excess cash flow margin provides vital headroom so that unforeseen operational setbacks (such as client loss or raw material inflation) do not trigger immediate insolvency.',
          answerIndex: 0,
          explanation: 'The 25% excess cash flow margin provides vital headroom so that unforeseen operational setbacks (such as client loss or raw material inflation) do not trigger immediate insolvency.'
        }
      },
      {
        title: 'Borrowing Base Certificates & Asset-Based Lending Haircuts',
        say: [
          'In Asset-Based Lending (ABL) and working capital revolving credit facilities, banks do not write blank checks against enterprise value.',
          'Instead, the amount a corporate borrower can draw on any given day is strictly capped by a legal instrument known as the Borrowing Base Certificate (BBC).',
          'The borrowing base formula aggregates eligible collateral after applying conservative liquidation "haircuts" (advance rates).',
          'Accounts Receivable (A/R) typically receive an advance rate of 80% to 85%. However, the bank explicitly excludes ineligible receivables: invoices overdue by more than 90 days, government receivables subject to offset, concentrated customer accounts exceeding 20% of total receivables, and foreign unhedged debtors.',
          'Inventory receives a much more punitive advance rate — typically 50% of the lower of cost or market (LOCOM) or Orderly Liquidation Value (OLV) — because seizing, transporting, and auctioning raw materials or finished goods entails substantial degradation and liquidation expense.',
          'Borrowers must submit monthly certified BBC reports. If declining receivables cause the borrowing base to fall below the drawn revolver balance, an immediate "borrowing base deficiency" occurs, legally obligating the borrower to pay down the excess balance within 48 to 72 hours.'
        ],
        example: 'Think of pawning jewelry. If you bring a ring with a $1,000 retail appraisal to a pawn shop, the pawnbroker will not lend you $1,000. They might lend you $500 (a 50% advance rate) because if you fail to repay, they must auction the ring quickly at wholesale prices. That is identical to an asset-based lending collateral haircut.',
        code: `# Simulation: Borrowing Base Certificate & Stressed Collateral Recovery Engine
def calculate_borrowing_base(
    gross_ar: float,
    ineligible_ar: float, # >90 days overdue or cross-aged
    ar_advance_rate: float, # e.g. 85%
    gross_inventory: float,
    slow_moving_inventory: float,
    inventory_advance_rate: float, # e.g. 50%
    outstanding_revolver_draw: float
) -> dict:
    eligible_ar = gross_ar - ineligible_ar
    ar_availability = eligible_ar * (ar_advance_rate / 100.0)

    eligible_inventory = gross_inventory - slow_moving_inventory
    inv_availability = eligible_inventory * (inventory_advance_rate / 100.0)

    total_borrowing_base = ar_availability + inv_availability
    excess_availability = total_borrowing_base - outstanding_revolver_draw
    borrowing_base_cushion_pct = round((excess_availability / total_borrowing_base) * 100.0, 1)

    return {
        "Eligible_AR": f"\${round(eligible_ar / 1e6, 2)}M",
        "AR_Availability": f"\${round(ar_availability / 1e6, 2)}M",
        "Eligible_Inventory": f"\${round(eligible_inventory / 1e6, 2)}M",
        "Inventory_Availability": f"\${round(inv_availability / 1e6, 2)}M",
        "Total_Borrowing_Base": f"\${round(total_borrowing_base / 1e6, 2)}M",
        "Revolver_Drawn": f"\${round(outstanding_revolver_draw / 1e6, 2)}M",
        "Net_Availability": f"\${round(excess_availability / 1e6, 2)}M",
        "Cushion": f"{borrowing_base_cushion_pct}%"
    }

bbc_res = calculate_borrowing_base(8000000.0, 1200000.0, 85.0, 6000000.0, 1000000.0, 50.0, 6500000.0)
print(f"Total Base: {bbc_res['Total_Borrowing_Base']} | Drawn: {bbc_res['Revolver_Drawn']}")
print(f"Net Availability: {bbc_res['Net_Availability']} | Cushion: {bbc_res['Cushion']}")`,
        output: `Total Base: $8.28M | Drawn: $6.5M\nNet Availability: $1.78M | Cushion: 21.5%`,
        codeNotes: [
          { line: 10, note: 'Filters out aged and ineligible receivables prior to applying contractual advance rate' },
          { line: 13, note: 'Applies conservative 50% advance rate against eligible inventory after stripping slow-moving stock' },
          { line: 16, note: 'Sums asset categories to calculate legal maximum credit draw ceiling (Total Borrowing Base)' },
          { line: 31, note: 'Confirms borrower holds $1.78M in net borrowing availability with a 21.5% liquidity cushion' }
        ],
        tryIt: 'Increase outstanding_revolver_draw from $6.5M to $8.5M to observe a negative Net_Availability, indicating an immediate borrowing base deficiency.',
        check: {
          question: 'Why do commercial lenders apply a significantly lower advance rate to inventory (typically 50%) than to accounts receivable (typically 80-85%)?',
          options: [
            'Because liquidating physical inventory involves spoilage, obsolescence, warehousing costs, and steep wholesale liquidation discounts, whereas eligible receivables represent near-cash contractual obligations.',
            'Because accounts receivable are backed by gold bars held in central bank vaults.',
            'Because commercial inventory cannot be insured under standard commercial property policies.',
            'Because accountants are legally prohibited from auditing inventory warehouses.'
          ],
          answer: 0,
          why: 'Accounts receivable represent confirmed obligations from creditworthy commercial buyers, whereas unsold inventory faces severe valuation discounts and auction costs if seized during liquidation.',
          answerIndex: 0,
          explanation: 'Accounts receivable represent confirmed obligations from creditworthy commercial buyers, whereas unsold inventory faces severe valuation discounts and auction costs if seized during liquidation.'
        }
      },
      {
        title: 'Risk-Adjusted Return on Capital (RAROC) & Loan Pricing',
        say: [
          'How does a commercial bank decide what interest rate spread to charge on a multi-million-dollar corporate credit facility?',
          'Naively undercutting competitors to win deal volume inevitably leads to catastrophic loan losses during credit downturns. Conversely, overpricing drives creditworthy borrowers to rival institutions.',
          'To price corporate risk rationally, financial institutions deploy Risk-Adjusted Return on Capital (RAROC) models.',
          'RAROC balances profitability against economic capital: RAROC = (Revenues - Cost of Funds - Operating Costs - Expected Loss) / Economic Capital.',
          'Revenues comprise interest income and upfront arrangement fees. Cost of Funds reflects the bank\'s wholesale funding rate. Operating costs cover origination and servicing overhead.',
          'Expected Loss (EL) is deducted directly from operating revenue: EL = Exposure at Default (EAD) * Probability of Default (PD) * Loss Given Default (LGD).',
          'Crucially, the denominator is not the loan principal! It is Economic Capital — the equity buffer the bank must allocate to absorb unexpected losses at a 99.9% statistical confidence interval under Basel III.',
          'A corporate loan is approved only if its projected RAROC clears the bank\'s internal hurdle rate (typically 12% to 15% post-tax return on equity).'
        ],
        example: 'Imagine lending $10M at 7.5%. The bank earns $750k in interest, pays $400k for funding (cost of funds), and spends $50k on loan servicing. It expects a baseline loss of $54k (1.2% PD * 45% LGD). That leaves $246k in net risk-adjusted return. If the bank must allocate $800k in equity capital (8% economic capital), its RAROC is $246k / $800k = 30.75% — easily clearing the 15% corporate hurdle.',
        code: `# Simulation: Moody's-Style 10-Tier Obligor Risk Rating & RAROC Pricing Model
def compute_raroc_and_credit_spread(
    loan_principal: float,
    contract_interest_rate_pct: float,
    cost_of_funds_pct: float,
    servicing_fee_pct: float,
    pd_1yr_pct: float,
    lgd_pct: float, # Loss Given Default
    economic_capital_pct: float = 8.0 # Basel capital allocation
) -> dict:
    interest_income = loan_principal * (contract_interest_rate_pct / 100.0)
    interest_expense = loan_principal * (cost_of_funds_pct / 100.0)
    servicing_expense = loan_principal * (servicing_fee_pct / 100.0)
    
    # Expected Loss (EL) = EAD * PD * LGD
    expected_loss = loan_principal * (pd_1yr_pct / 100.0) * (lgd_pct / 100.0)
    
    net_risk_adjusted_income = interest_income - interest_expense - servicing_expense - expected_loss
    allocated_economic_capital = loan_principal * (economic_capital_pct / 100.0)
    
    raroc_pct = round((net_risk_adjusted_income / allocated_economic_capital) * 100.0, 2)
    hurdle_rate_pct = 15.0

    return {
        "Loan_Principal": f"\${round(loan_principal / 1e6, 2)}M",
        "Expected_Loss": f"\${round(expected_loss / 1e3, 1)}k",
        "Net_Adjusted_Return": f"\${round(net_risk_adjusted_income / 1e3, 1)}k",
        "Economic_Capital": f"\${round(allocated_economic_capital / 1e6, 2)}M",
        "RAROC": f"{raroc_pct}%",
        "Hurdle_Evaluation": "VALUE_ACCRETIVE" if raroc_pct >= hurdle_rate_pct else "BELOW_HURDLE_REPRICE"
    }

raroc_res = compute_raroc_and_credit_spread(10000000.0, 7.5, 4.0, 0.5, 1.2, 45.0, 8.0)
print(f"Principal: {raroc_res['Loan_Principal']} | Expected Loss: {raroc_res['Expected_Loss']}")
print(f"RAROC: {raroc_res['RAROC']} | Verdict: {raroc_res['Hurdle_Evaluation']}")`,
        output: `Principal: $10.0M | Expected Loss: $54.0k\nRAROC: 30.75% | Verdict: VALUE_ACCRETIVE`,
        codeNotes: [
          { line: 15, note: 'Calculates Expected Loss (EL) as Principal * PD * LGD deducted directly from gross interest income' },
          { line: 18, note: 'Allocates regulatory Economic Capital as equity denominator based on risk weight profile' },
          { line: 20, note: 'Computes RAROC percentage and validates against corporate 15% hurdle rate' },
          { line: 31, note: 'Yields 30.75% RAROC, confirming credit facility creates substantial shareholder value' }
        ],
        tryIt: 'Raise pd_1yr_pct from 1.2% to 6.5% to observe Expected Loss surge to $292.5k, collapsing RAROC to 1.0% (BELOW_HURDLE_REPRICE).',
        check: {
          question: 'In modern commercial loan portfolio management, what is the fundamental function of RAROC (Risk-Adjusted Return on Capital)?',
          options: [
            'To ensure that credit pricing and interest margins generate an adequate post-tax return on the bank\'s equity capital after factoring in funding costs, operating overhead, and expected credit default losses.',
            'To eliminate all legal documentation requirements for commercial borrowers.',
            'To allow commercial banks to print their own fiat currency without central bank approval.',
            'To calculate the executive bonus pool regardless of whether loans are repaid.'
          ],
          answer: 0,
          why: 'RAROC ensures that higher-risk loans carry compensatory credit spreads that sufficiently reward shareholders for the equity capital committed to absorb unexpected losses.',
          answerIndex: 0,
          explanation: 'RAROC ensures that higher-risk loans carry compensatory credit spreads that sufficiently reward shareholders for the equity capital committed to absorb unexpected losses.'
        }
      },
      {
        title: 'IFRS 9 / CECL Staging & Non-Performing Loan Workouts',
        say: [
          'Under previous accounting standards (IAS 39), banks recognized loan losses only after an objective default event occurred — a fatally flawed "incurred loss" model that delayed loss provisions during the 2008 financial crisis.',
          'In response, international regulators introduced IFRS 9 and US GAAP CECL (Current Expected Credit Losses), mandating a forward-looking 3-stage impairment model.',
          'Stage 1 (Performing): At origination, if credit risk is low, the bank provisions 12-Month Expected Credit Losses (PD_12m * LGD * EAD).',
          'Stage 2 (Underperforming): If a Significant Increase in Credit Risk (SICR) occurs — such as payments 30+ days past due, covenant breaches, or rating downgrades — the bank must immediately recognize Lifetime Expected Credit Losses (PD_lifetime * LGD * EAD). This creates a massive, sudden provision charge on the income statement.',
          'Stage 3 (Credit-Impaired / Non-Performing Loan NPL): When a loan is 90+ days past due or bankruptcy is probable, it enters NPL status. Interest accrual is suspended, and specific impairment provisions are written down against collateral liquidation values.',
          'When loans reach Stage 3, the bank transfers the account to the Special Assets Workout Group. Workouts follow structured decision trees: forbearance agreements, troubled debt restructuring (TDR) with debt-to-equity conversions, refinancing, or hostile collateral liquidation.'
        ],
        example: 'Think of a patient visiting a doctor. Stage 1 is an annual wellness checkup: healthy, routine monitoring. Stage 2 is discovering elevated blood pressure and pre-diabetes: urgent lifestyle intervention and preventative medication before organ damage occurs. Stage 3 is a heart attack: immediate emergency room surgery and intensive care. That is the exact philosophy of IFRS 9 staging.',
        code: `# Simulation: 3-Stage IFRS 9 ECL Provisioning & Restructuring Decision Tree
def classify_ifrs9_staging_and_provision(
    exposure_at_default: float,
    days_past_due: int,
    sicr_flag: bool,
    annual_pd_pct: float,
    lifetime_pd_pct: float,
    lgd_pct: float
) -> dict:
    if days_past_due >= 90:
        stage = "Stage_3_Credit_Impaired_NPL"
        ecl_provision = exposure_at_default * 1.0 * (lgd_pct / 100.0) # Full specific impairment
        workout_action = "Transfer to Special Assets Workout Group; Initiate Collateral Liquidation or TDR Restructuring."
    elif days_past_due >= 30 or sicr_flag:
        stage = "Stage_2_Underperforming_SICR"
        ecl_provision = exposure_at_default * (lifetime_pd_pct / 100.0) * (lgd_pct / 100.0)
        workout_action = "Watchlist Enrollment; Request Fresh Financial Disclosures & Margin Enhancement."
    else:
        stage = "Stage_1_Performing"
        ecl_provision = exposure_at_default * (annual_pd_pct / 100.0) * (lgd_pct / 100.0)
        workout_action = "Standard Routine Annual Review; Maintain Active Relationship."

    provision_coverage_pct = round((ecl_provision / exposure_at_default) * 100.0, 2)

    return {
        "EAD": f"\${round(exposure_at_default / 1e6, 2)}M",
        "Days_Past_Due": days_past_due,
        "IFRS9_Stage": stage,
        "ECL_Required_Provision": f"\${round(ecl_provision / 1e3, 1)}k",
        "Coverage_Pct": f"{provision_coverage_pct}%",
        "Workout_Action": workout_action
    }

loan_p = classify_ifrs9_staging_and_provision(5000000.0, 42, True, 1.5, 7.5, 40.0)
print(f"Loan EAD: {loan_p['EAD']} | DPD: {loan_p['Days_Past_Due']} -> Stage: {loan_p['IFRS9_Stage']}")
print(f"Provision: {loan_p['ECL_Required_Provision']} ({loan_p['Coverage_Pct']}) | Action: {loan_p['Workout_Action']}")`,
        output: `Loan EAD: $5.0M | DPD: 42 -> Stage: Stage_2_Underperforming_SICR\nProvision: $150.0k (3.0%) | Action: Watchlist Enrollment; Request Fresh Financial Disclosures & Margin Enhancement.`,
        codeNotes: [
          { line: 9, note: 'Routes loans >= 90 days past due directly to Stage 3 with full specific impairment provisioning' },
          { line: 13, note: 'Detects Significant Increase in Credit Risk (SICR) to escalate provision from 12-month to lifetime ECL' },
          { line: 17, note: 'Calculates standard 12-month Expected Credit Loss for performing Stage 1 facilities' },
          { line: 32, note: 'Classifies 42 DPD delinquent loan into Stage 2 with $150k lifetime provision and watchlist enrollment' }
        ],
        tryIt: 'Increase days_past_due from 42 to 95 to trigger Stage 3 Credit-Impaired NPL status and observe required provision surge to $2.0M.',
        check: {
          question: 'What is the critical regulatory consequence when a commercial loan transitions from Stage 1 to Stage 2 under the IFRS 9 impairment framework?',
          options: [
            'The required loan loss provision jumps from 12-Month Expected Credit Losses to Lifetime Expected Credit Losses, triggering an immediate and substantial provisioning expense charge against bank earnings.',
            'The borrower is legally required to surrender their passport to the bank.',
            'The loan interest rate automatically falls to zero percent.',
            'The central bank immediately revokes the commercial bank\'s charter.'
          ],
          answer: 0,
          why: 'The transition to Stage 2 requires provisioning for potential defaults across the entire remaining multi-year life of the loan rather than just the next 12 months, creating a steep increase in reserve requirements.',
          answerIndex: 0,
          explanation: 'The transition to Stage 2 requires provisioning for potential defaults across the entire remaining multi-year life of the loan rather than just the next 12 months, creating a steep increase in reserve requirements.'
        }
      }
    ],
    summary: [
      '5 Cs of Credit: Underwrites corporate facilities via Cash Flow Available for Debt Service (CFADS = EBITDA - Capex - Taxes); leverage capped at 3.0x to 4.0x CFADS.',
      'DSCR Covenants: Enforces minimum 1.25x DSCR; dual sensitivity stress testing evaluates simultaneous revenue dips and interest rate hikes.',
      'Borrowing Base Certificates: Caps revolving debt availability against eligible accounts receivable (85% advance) and inventory (50% advance) with strict collateral haircuts.',
      'RAROC Pricing: Evaluates loan profitability against allocated economic capital (RAROC = Net Income / Economic Capital); pricing must clear corporate hurdle rates.',
      'IFRS 9 Staged Impairment: Enforces forward-looking 3-stage ECL provisioning (Stage 1: 12-month, Stage 2: Lifetime, Stage 3: Specific NPL impairment) with structured workout protocols.'
    ],
    projectStep: {
      title: 'Commercial Bank Credit Underwriting Memo & Workout Model',
      steps: [
        'Analyze corporate financial statements to calculate CFADS and determine maximum borrowing capacity under conservative leverage ceilings.',
        'Construct a dynamic DSCR covenant stress-test model and generate a Borrowing Base Certificate for a working capital revolver.',
        'Model loan pricing using RAROC and execute an IFRS 9 3-stage provisioning audit with Special Assets workout action plans.'
      ]
    }
  },
  {
    coursePrefix: 'bcom_ban',
    day: 3,
    title: 'Syndicated Lending, Structured Trade Finance & Treasury ALM Hedging',
    goal: 'Master institutional commercial banking: syndicated loan facility structuring and bookrunner allocations, international documentary letters of credit (UCP 600), treasury ALM interest rate swap (IRS) duration hedging, Basel III liquidity stress testing (LCR & NSFR), and bilateral counterparty credit risk (CVA & ISDA netting).',
    minutes: 45,
    recap: 'Commercial banks operate at the nexus of institutional capital markets and real-economy trade. Moving beyond single-obligor balance sheet loans, treasury and corporate banking divisions syndicate multi-hundred-million-dollar credit facilities, finance cross-border trade via Letters of Credit, and insulate bank margins from macroeconomic interest rate shocks through derivatives and liquidity stress testing.',
    parts: [
      {
        title: 'Syndicated Loan Facility Structuring & Lead Arranger Bookrunner Allocation',
        say: [
          'When corporate borrowers require debt financing that exceeds the single-obligor lending limits or balance sheet risk tolerance of an individual commercial bank, they turn to the syndicated loan market. A Lead Arranger (or Mandated Lead Arranger, MLA) wins the mandate to underwrite or arrange the overall facility, such as a $500 million acquisition loan. The lead bank acts as bookrunner, structuring tranches, drafting the credit agreement, and distributing pieces of the debt to a syndicate of participant banks and institutional investors.',
          'Syndication takes two primary forms: fully underwritten deals and best-efforts syndications. In a fully underwritten facility, the lead arranger guarantees the entire loan commitment upfront and assumes the underwriting risk that participant banks might not buy into the facility. If the market is lukewarm, the lead arranger gets stuck holding a disproportionately large piece on its balance sheet (an involuntary "hung loan"). Conversely, in an oversubscribed facility, the bookrunner must scale back commitments proportionally across tiers, balancing relationship politics while pocketing lucrative upfront arrangement fees of 50 to 150 basis points.',
          'The syndicate agreement defines strict legal roles, voting thresholds, and cash-waterfall distributions managed by the Administrative Agent. Routine covenant waivers typically require a simple majority (51% or 66.7% of committed capital), whereas critical amendments such as interest rate reductions, maturity extensions, or release of primary collateral demand 100% unanimous consent. As commercial bankers, understanding how allocations scale and how arranger underwriting economics operate is fundamental to structuring high-yield corporate financings.'
        ],
        example: 'A global industrial conglomerate seeks a $500M multi-currency term facility. The Lead Arranger underwrites $100M with a 75 bps arrangement fee ($3.75M) and markets the remaining $400M to institutional co-arrangers and participants, receiving $600M in total commitments (1.2x oversubscribed) and scaling back allocations pro-rata.',
        code: `# Syndicated Loan Facility Structuring & Bookrunner Allocation Engine
def structure_syndicated_facility(facility_amount: float, lead_arranger_hold: float, lead_fee_bps: float, participants: list) -> dict:
    total_committed = lead_arranger_hold + sum(p["commitment"] for p in participants)
    oversubscription_ratio = total_committed / facility_amount
    lead_fee_usd = facility_amount * (lead_fee_bps / 10000.0)
    
    # Scale allocations if oversubscribed
    allocations = []
    scale = min(1.0, facility_amount / total_committed) if total_committed > facility_amount else 1.0
    actual_lead_hold = lead_arranger_hold * scale
    
    allocations.append({
        "bank": "Lead Arranger (Global Agent)",
        "role": "Bookrunner",
        "allocated": actual_lead_hold,
        "share_pct": (actual_lead_hold / facility_amount) * 100.0
    })
    
    for p in participants:
        alloc = p["commitment"] * scale
        allocations.append({
            "bank": p["name"],
            "role": p["tier"],
            "allocated": alloc,
            "share_pct": (alloc / facility_amount) * 100.0
        })
        
    return {
        "facility_amount": facility_amount,
        "total_committed": total_committed,
        "oversubscription_ratio": round(oversubscription_ratio, 2),
        "lead_fee_usd": round(lead_fee_usd, 2),
        "syndicate_members": len(allocations),
        "allocations": allocations
    }

p1 = structure_syndicated_facility(
    500000000.0, 100000000.0, 75.0,
    [
        {"name": "Co-Arranger A", "tier": "Lead Manager", "commitment": 150000000.0},
        {"name": "Participant B", "tier": "Participant", "commitment": 150000000.0},
        {"name": "Participant C", "tier": "Participant", "commitment": 200000000.0}
    ]
)
lead_fee_str = "$" + f"{p1['lead_fee_usd']:,.2f}"
print(f"Syndication Oversubscribed: {p1['oversubscription_ratio']}x | Lead Fee: {lead_fee_str}")
for a in p1["allocations"]:
    alloc_str = "$" + f"{a['allocated']:,.2f}"
    print(f"  {a['bank']} ({a['role']}): {alloc_str} ({a['share_pct']:.1f}%)")`,
        output: `Syndication Oversubscribed: 1.2x | Lead Fee: $3,750,000.00
  Lead Arranger (Global Agent) (Bookrunner): $83,333,333.33 (16.7%)
  Co-Arranger A (Lead Manager): $125,000,000.00 (25.0%)
  Participant B (Participant): $125,000,000.00 (25.0%)
  Participant C (Participant): $166,666,666.67 (33.3%)`,
        codeNotes: [
          { line: 3, note: 'Calculates total commitments and determines oversubscription scaling factor min(1.0, facility / committed)' },
          { line: 5, note: 'Computes bookrunner upfront fee across entire facility amount based on underwriting basis points' },
          { line: 11, note: 'Applies pro-rata allocation haircut to ensure total disbursed loans precisely equal facility size' },
          { line: 35, note: 'Simulates $500M facility oversubscribed to $600M, scaling lead hold to $83.33M and generating $3.75M lead fee' }
        ],
        tryIt: 'Increase participant commitments to total $750M and observe the oversubscription ratio rise to 1.5x with steeper pro-rata cuts.',
        check: {
          question: 'What is the primary risk facing a lead arranger in a "fully underwritten" syndicated loan transaction when credit markets abruptly deteriorate?',
          options: [
            'Hung loan risk, where participant banks decline to purchase allocations, forcing the arranger to absorb the unsold debt onto its own balance sheet.',
            'The central bank confiscates the arranger\'s trading license automatically.',
            'The borrower is entitled to convert the entire debt into non-voting common stock.',
            'The loan maturity automatically shortens to an overnight call facility.'
          ],
          answer: 0,
          why: 'In a fully underwritten facility, the lead bank guarantees 100% of the funds to the borrower. If syndication fails, the bank is stuck with excessive balance sheet concentration known as a hung loan.',
          answerIndex: 0,
          explanation: 'In a fully underwritten facility, the lead bank guarantees 100% of the funds to the borrower. If syndication fails, the bank is stuck with excessive balance sheet concentration known as a hung loan.'
        }
      },
      {
        title: 'Structured Trade Finance, Documentary Letters of Credit (UCP 600) & Bill Discounting',
        say: [
          'Cross-border international trade introduces profound geographic, legal, and currency counterpart risks. An exporter in Munich does not want to ship multi-million-dollar precision machinery across oceans without guaranteed payment, while an importer in Singapore cannot safely wire funds before verifying physical delivery of goods. Structured trade finance bridges this trust deficit through documentary instruments governed by the International Chamber of Commerce (ICC) Uniform Customs and Practice for Documentary Credits (UCP 600).',
          'The foundational instrument is the Documentary Letter of Credit (LC). The importer\'s bank (the Issuing Bank) substitutes its own creditworthiness for that of the importer, providing an irrevocable financial undertaking to pay the exporter upon presentation of complying shipping documents (Commercial Invoice, Clean On-Board Bill of Lading, Certificate of Origin, Inspection Certificate). To eliminate cross-border sovereign and foreign bank transfer risk, the exporter often insists on an added confirmation from a prime domestic bank (the Confirming Bank), which adds its independent irrevocable payment guarantee.',
          'Once complying shipping documents are presented and accepted under a usance (time) LC, the obligation transforms into a trade acceptance or Banker\'s Acceptance (BA). Because a prime financial institution has guaranteed payment upon maturity (e.g. 90 or 180 days), the exporter does not have to wait for cash. The commercial bank discounts the bill on a money-market 360-day basis, providing immediate liquidity to the supplier while collecting attractive trade discount and acceptance fee spreads.'
        ],
        example: 'A machinery manufacturer exports $10M of equipment on 90-day credit. The importer opens an LC with a 25 bps issuing fee. The supplier discounts the accepted 90-day bill with a confirming bank at a 5.5% annual discount rate plus 15 bps confirmation fee, receiving $9,847,500.00 in immediate net proceeds.',
        code: `# Structured Trade Finance: LC Issuance & Banker's Acceptance Discounting Engine
def issue_and_discount_trade_lc(invoice_value: float, tenor_days: int, discount_rate_pct: float, issuing_fee_bps: float, confirming_fee_bps: float) -> dict:
    issuing_fee = invoice_value * (issuing_fee_bps / 10000.0)
    confirming_fee = invoice_value * (confirming_fee_bps / 10000.0)
    
    # Money market 360-day basis discount
    discount_charge = invoice_value * (discount_rate_pct / 100.0) * (tenor_days / 360.0)
    net_proceeds = invoice_value - discount_charge - confirming_fee
    
    return {
        "invoice_value": invoice_value,
        "tenor_days": tenor_days,
        "issuing_fee": round(issuing_fee, 2),
        "confirming_fee": round(confirming_fee, 2),
        "discount_charge": round(discount_charge, 2),
        "net_supplier_proceeds": round(net_proceeds, 2),
        "effective_financing_cost_pct": round(((discount_charge + confirming_fee) / invoice_value) * (360.0 / tenor_days) * 100.0, 2)
    }

p2 = issue_and_discount_trade_lc(10000000.0, 90, 5.5, 25.0, 15.0)
inv_str = "$" + f"{p2['invoice_value']:,.2f}"
disc_str = "$" + f"{p2['discount_charge']:,.2f}"
proc_str = "$" + f"{p2['net_supplier_proceeds']:,.2f}"
print(f"Invoice: {inv_str} | Tenor: {p2['tenor_days']}d")
print(f"Discount: {disc_str} | Net Proceeds: {proc_str} | Cost: {p2['effective_financing_cost_pct']}%")`,
        output: `Invoice: $10,000,000.00 | Tenor: 90d
Discount: $137,500.00 | Net Proceeds: $9,847,500.00 | Cost: 6.1%`,
        codeNotes: [
          { line: 6, note: 'Calculates standard international money market discount charge using 360-day annual day count convention' },
          { line: 7, note: 'Deducts discount charge and confirming bank acceptance fee to determine net cash disbursed to exporter' },
          { line: 15, note: 'Annualizes all fees and discount charges into an effective APR financing cost percentage' },
          { line: 20, note: 'Models $10M 90-day LC generating $137,500 discount fee and yielding $9,847,500 immediate supplier cash' }
        ],
        tryIt: 'Extend tenor_days to 180 days to observe discount charges double to $275,000 while maintaining a constant annualized financing cost.',
        check: {
          question: 'Under ICC UCP 600 rules, what is the legal significance of a "confirmed" Letter of Credit compared to an unconfirmed Letter of Credit?',
          options: [
            'The Confirming Bank provides an independent, irrevocable undertaking to pay the beneficiary, protecting the exporter even if the Issuing Bank or its home nation defaults.',
            'The Confirming Bank physically inspects the factory and certifies product quality.',
            'The Confirming Bank guarantees that the importer will make a 50% profit upon resale.',
            'The Confirming Bank converts the payment currency into gold bullion.'
          ],
          answer: 0,
          why: 'A confirmation adds the direct, independent legal obligation of a second bank (typically in the exporter\'s jurisdiction), insulating the exporter from issuing bank insolvency or country transfer risk.',
          answerIndex: 0,
          explanation: 'A confirmation adds the direct, independent legal obligation of a second bank (typically in the exporter\'s jurisdiction), insulating the exporter from issuing bank insolvency or country transfer risk.'
        }
      },
      {
        title: 'Treasury Asset-Liability Management (ALM) & Interest Rate Swap (IRS) NIM Hedging',
        say: [
          'Commercial bank balance sheets possess an inherent structural maturity mismatch: banks fund long-term fixed-rate loans (e.g. 5-year commercial mortgages at 4.5%) using short-term floating-rate liabilities (such as commercial checking deposits and wholesale repos repricing every 30 to 90 days). When benchmark interest rates rise, deposit rates must increase to prevent disintermediation, while income on fixed-rate loans remains locked. This dynamic rapidly crushes the bank\'s Net Interest Margin (NIM = Net Interest Income / Total Earning Assets).',
          'To protect Net Interest Margin from severe macroeconomic rate shifts, Bank Treasury ALM teams execute Interest Rate Swaps (IRS). In a vanilla fixed-for-floating interest rate swap, the bank agrees with an external swap counterparty to exchange fixed interest cash flows for floating interest cash flows based on a benchmark index (such as SOFR or EURIBOR) on a specified notional principal without exchanging any underlying principal.',
          'To hedge against rising interest rates, a bank with fixed-rate assets enters a Pay-Fixed, Receive-Floating swap. If rates surge by 200 basis points (+2.00%), the bank\'s deposit interest costs jump by millions of dollars, but the swap position pays out an offsetting stream of floating cash flows. This synthetic hedge transforms the bank\'s fixed-rate asset yield into a floating-rate income stream, locking in a predictable spread, stabilizing Net Interest Income, and insulating regulatory capital from economic value of equity (EVE) degradation.'
        ],
        example: 'A treasury desk holds $250M of 5-year fixed loans earning 4.5% funded by floating deposits paying 2.5%. A +200 bps rate shock would increase funding expense by $5.0M annually, wiping out profits. Executing a $250M Pay-Fixed (4.5%) Receive-Floating swap generates an offsetting $5.0M inflow, restoring hedge effectiveness to 100.0%.',
        code: `# Treasury ALM: Interest Rate Swap (IRS) NIM Duration Hedging Engine
def hedge_alm_interest_rate_swap(notional_principal: float, fixed_rate_pct: float, floating_base_pct: float, rate_shock_bps: float) -> dict:
    # 1 bps = 0.01%, so 200 bps = 2.0 percentage points
    shock_pct = rate_shock_bps / 100.0
    shocked_floating = floating_base_pct + shock_pct
    
    # Pre-hedge: Bank has fixed-rate assets funded by floating deposits
    # When rates rise, deposit interest cost rises, squeezing NIM
    unhedged_asset_income = notional_principal * (fixed_rate_pct / 100.0)
    unhedged_funding_cost_baseline = notional_principal * (floating_base_pct / 100.0)
    unhedged_funding_cost_shocked = notional_principal * (shocked_floating / 100.0)
    
    unhedged_nim_baseline = unhedged_asset_income - unhedged_funding_cost_baseline
    unhedged_nim_shocked = unhedged_asset_income - unhedged_funding_cost_shocked
    unhedged_nim_delta = unhedged_nim_shocked - unhedged_nim_baseline
    
    # Post-hedge: Bank enters Pay-Fixed, Receive-Floating Swap on 100% notional
    # Swap net cash flow: Receive floating - Pay fixed
    swap_net_baseline = notional_principal * ((floating_base_pct - fixed_rate_pct) / 100.0)
    swap_net_shocked = notional_principal * ((shocked_floating - fixed_rate_pct) / 100.0)
    
    hedged_nim_baseline = unhedged_nim_baseline + swap_net_baseline
    hedged_nim_shocked = unhedged_nim_shocked + swap_net_shocked
    hedged_nim_delta = hedged_nim_shocked - hedged_nim_baseline
    
    return {
        "notional": notional_principal,
        "rate_shock_bps": rate_shock_bps,
        "unhedged_nim_delta": round(unhedged_nim_delta, 2),
        "hedged_nim_delta": round(hedged_nim_delta, 2),
        "hedge_effectiveness_pct": round((1.0 - abs(hedged_nim_delta) / abs(unhedged_nim_delta)) * 100.0, 1) if unhedged_nim_delta != 0 else 100.0
    }

p3 = hedge_alm_interest_rate_swap(250000000.0, 4.5, 2.5, 200.0)
unhedged_str = "$" + f"{p3['unhedged_nim_delta']:,.2f}"
hedged_str = "$" + f"{p3['hedged_nim_delta']:,.2f}"
print(f"Rate Shock +200bps | Unhedged NIM Delta: {unhedged_str}")
print(f"Hedged NIM Delta: {hedged_str} | Effectiveness: {p3['hedge_effectiveness_pct']}%")`,
        output: `Rate Shock +200bps | Unhedged NIM Delta: $-5,000,000.00
Hedged NIM Delta: $0.00 | Effectiveness: 100.0%`,
        codeNotes: [
          { line: 3, note: 'Converts rate shock in basis points (200 bps) to percentage points (+2.0%)' },
          { line: 12, note: 'Evaluates baseline vs shocked net interest margin showing unhedged $5.0M margin destruction' },
          { line: 19, note: 'Superimposes Pay-Fixed Receive-Floating swap leg to synthetically neutralize variable funding costs' },
          { line: 31, note: 'Demonstrates 100% hedge effectiveness with hedged NIM delta stabilized at exactly $0.00' }
        ],
        tryIt: 'Simulate a partial 50% notional hedge ($125M) and verify that hedged NIM delta is halved to -$2,500,000.',
        check: {
          question: 'If a commercial bank holds fixed-rate commercial loans funded by short-term floating-rate wholesale deposits, which derivative position should treasury ALM execute to hedge against rising interest rates?',
          options: [
            'Pay-Fixed, Receive-Floating Interest Rate Swap.',
            'Pay-Floating, Receive-Fixed Interest Rate Swap.',
            'Sell out-of-the-money equity put options on bank stock.',
            'Buy physical gold futures contracts on COMEX.'
          ],
          answer: 0,
          why: 'By paying fixed and receiving floating, the bank collects higher floating cash flows as interest rates rise, directly offsetting its increasing deposit funding expenses.',
          answerIndex: 0,
          explanation: 'By paying fixed and receiving floating, the bank collects higher floating cash flows as interest rates rise, directly offsetting its increasing deposit funding expenses.'
        }
      },
      {
        title: 'Basel III Liquidity Risk Stress Testing: LCR, NSFR & 30-Day Runoff Modeling',
        say: [
          'Following the global financial crises and high-profile regional bank runs, international regulators recognized that capital adequacy alone cannot prevent bank failure if an institution runs out of liquid cash to meet immediate depositor withdrawals. Under Basel III, the Basel Committee on Banking Supervision (BCBS) enacted two binding liquidity requirements: the short-term Liquidity Coverage Ratio (LCR) and the structural long-term Net Stable Funding Ratio (NSFR).',
          'The Liquidity Coverage Ratio requires banks to maintain an unencumbered pool of High-Quality Liquid Assets (HQLA) sufficient to survive a severe 30-calendar-day combined retail and wholesale liquidity stress event: LCR = Total Stock of HQLA / Total Net Cash Outflows over 30 Days >= 100%. Assets are tiered: Level 1 assets (central bank reserves, sovereign debt) count at 100% value with 0% haircut, whereas Level 2A assets (senior non-financial corporate bonds) face a mandatory 15% regulatory haircut.',
          'On the liability side, cash outflows are calculated by applying prescribed run-off assumptions: stable retail deposits incur only a 3% to 5% runoff, but unsecured wholesale corporate deposits face catastrophic 40% to 100% runoffs, and undrawn committed credit lines face immediate drawdown rates. Simultaneously, the Net Stable Funding Ratio requires Available Stable Funding (ASF) to exceed Required Stable Funding (RSF) over a 1-year horizon: NSFR = ASF / RSF >= 100%, discouraging overreliance on short-term wholesale funding to finance illiquid long-term loans.'
        ],
        example: 'A $1B bank holds $50M cash, $150M government bonds, and $40M corporate bonds ($234M HQLA after 15% Level 2 haircut). In a 30-day run scenario (5% retail deposit runoff, 40% wholesale runoff, 20% credit line drawdowns), total net outflows reach $180M. The bank achieves an LCR of 130.0% and NSFR of 115.9%, safely clearing the 100% regulatory threshold.',
        code: `# Basel III Liquidity Risk: LCR & NSFR 30-Day Stress Testing Engine
def stress_test_lcr_and_nsfr(cash: float, level1_gov_bonds: float, level2_corp_bonds: float,
                             retail_run_rate_pct: float, retail_deposits: float,
                             wholesale_run_rate_pct: float, wholesale_deposits: float,
                             credit_facilities_draw_pct: float, off_balance_sheet_lines: float,
                             available_stable_funding: float, required_stable_funding: float) -> dict:
    # Level 1 assets have 0% haircut, Level 2A have 15% haircut
    hqla = cash + level1_gov_bonds + (level2_corp_bonds * 0.85)
    
    outflow_retail = retail_deposits * (retail_run_rate_pct / 100.0)
    outflow_wholesale = wholesale_deposits * (wholesale_run_rate_pct / 100.0)
    outflow_facilities = off_balance_sheet_lines * (credit_facilities_draw_pct / 100.0)
    total_net_outflows = outflow_retail + outflow_wholesale + outflow_facilities
    
    lcr_ratio_pct = (hqla / total_net_outflows) * 100.0
    nsfr_ratio_pct = (available_stable_funding / required_stable_funding) * 100.0
    
    return {
        "total_hqla": round(hqla, 2),
        "total_net_outflows_30d": round(total_net_outflows, 2),
        "lcr_ratio_pct": round(lcr_ratio_pct, 1),
        "lcr_compliant": lcr_ratio_pct >= 100.0,
        "nsfr_ratio_pct": round(nsfr_ratio_pct, 1),
        "nsfr_compliant": nsfr_ratio_pct >= 100.0
    }

p4 = stress_test_lcr_and_nsfr(
    cash=50000000.0, level1_gov_bonds=150000000.0, level2_corp_bonds=40000000.0,
    retail_run_rate_pct=5.0, retail_deposits=800000000.0,
    wholesale_run_rate_pct=40.0, wholesale_deposits=300000000.0,
    credit_facilities_draw_pct=20.0, off_balance_sheet_lines=100000000.0,
    available_stable_funding=950000000.0, required_stable_funding=820000000.0
)
hqla_str = "$" + f"{p4['total_hqla']:,.2f}"
outflows_str = "$" + f"{p4['total_net_outflows_30d']:,.2f}"
print(f"HQLA: {hqla_str} | 30d Outflows: {outflows_str}")
print(f"LCR: {p4['lcr_ratio_pct']}% (Compliant: {p4['lcr_compliant']}) | NSFR: {p4['nsfr_ratio_pct']}% (Compliant: {p4['nsfr_compliant']})")`,
        output: `HQLA: $234,000,000.00 | 30d Outflows: $180,000,000.00
LCR: 130.0% (Compliant: True) | NSFR: 115.9% (Compliant: True)`,
        codeNotes: [
          { line: 8, note: 'Applies Basel III 15% regulatory haircut on Level 2A corporate debt to determine total eligible HQLA' },
          { line: 10, note: 'Models granular 30-day stress runoffs across retail (5%), wholesale (40%), and credit lines (20%)' },
          { line: 16, note: 'Calculates LCR and NSFR ratios, verifying minimum 100% regulatory compliance' },
          { line: 31, note: 'Simulates $234M HQLA covering $180M net outflows, generating 130.0% LCR buffer' }
        ],
        tryIt: 'Increase wholesale deposit run rate to 75% to observe total outflows reach $285M, dropping LCR to 82.1% non-compliance.',
        check: {
          question: 'Why do Basel III LCR regulations mandate a significantly higher runoff rate (e.g. 40% to 100%) for wholesale corporate deposits compared to retail deposits (e.g. 3% to 5%)?',
          options: [
            'Wholesale corporate treasurers are financially sophisticated, uninsured above guarantee caps, and will rapidly wire funds out at the first whisper of distress.',
            'Corporate deposits are held in illiquid physical promissory notes.',
            'Retail depositors are legally prohibited from accessing internet banking during banking panics.',
            'The central bank directly pays the salaries of corporate finance officers.'
          ],
          answer: 0,
          why: 'Large institutional and corporate deposits exceed deposit insurance limits and are actively managed; treasurers will instantly pull funds to preserve capital, whereas retail deposits are stickier and government-insured.',
          answerIndex: 0,
          explanation: 'Large institutional and corporate deposits exceed deposit insurance limits and are actively managed; treasurers will instantly pull funds to preserve capital, whereas retail deposits are stickier and government-insured.'
        }
      },
      {
        title: 'Counterparty Credit Risk, Credit Valuation Adjustment (CVA) & ISDA Master Agreement Netting',
        say: [
          'In over-the-counter (OTC) financial derivatives such as interest rate swaps and foreign exchange forwards, credit risk is bilateral and dynamic. Unlike a standard loan where the bank is solely the creditor, in an OTC derivative contract the mark-to-market (MTM) value fluctuates with market prices: if the contract is in the money (positive MTM), the bank is exposed to counterparty default; if it is out of the money (negative MTM), the counterparty is exposed to the bank.',
          'To account for the economic cost of potential counterparty default on uncollateralized OTC derivative books, banks calculate Credit Valuation Adjustment (CVA). CVA represents the difference between the risk-free portfolio value and the true market value accounting for the probability of counterparty insolvency: CVA = (1 - Recovery Rate) * sum of Discounted Expected Exposure * Default Probability. Under Basel III, banks must also maintain substantial regulatory capital reserves against CVA volatility (CVA VaR).',
          'The premier defense against counterparty credit risk and runaway CVA charges is the International Swaps and Derivatives Association (ISDA) Master Agreement with close-out netting provisions. Under close-out netting, upon a counterparty default event, all outstanding derivative trades across all asset classes are immediately terminated and collapsed into a single net payable or receivable. Instead of having to pay $11M on losing contracts while losing 100% of $17M on winning contracts, netting reduces gross exposure to a mere $6M net claim, freeing hundreds of thousands of dollars in capital reserves.'
        ],
        example: 'A trading desk holds 4 OTC derivative contracts with a corporate counterparty: +$12M, -$8M, +$5M, and -$3M. Without netting, gross credit exposure is $17M. Under an ISDA Master Agreement, close-out netting collapses exposure to $6M ($11M exposure reduction), slashing bilateral CVA from $306,000 to $108,000 and freeing $198,000 in regulatory economic capital.',
        code: `# Bilateral Counterparty Credit Risk: CVA & ISDA Close-Out Netting Engine
def calculate_cva_and_netting(trades: list, recovery_rate_pct: float, counterparty_cds_spread_bps: float) -> dict:
    # Gross vs Net under ISDA Master Agreement
    gross_exposure = sum(max(0.0, t["mtm"]) for t in trades)
    net_exposure = max(0.0, sum(t["mtm"] for t in trades))
    netting_benefit = gross_exposure - net_exposure
    netting_factor = net_exposure / gross_exposure if gross_exposure > 0 else 0.0
    
    # 1-year default probability from CDS spread: PD approx Spread / (1 - R)
    lgd = 1.0 - (recovery_rate_pct / 100.0)
    cds_spread = counterparty_cds_spread_bps / 10000.0
    implied_pd = min(1.0, cds_spread / lgd) if lgd > 0 else 0.0
    
    # Bilateral CVA approx LGD * Discounted Expected Exposure * PD
    gross_cva = gross_exposure * lgd * implied_pd
    net_cva = net_exposure * lgd * implied_pd
    cva_savings = gross_cva - net_cva
    
    return {
        "gross_exposure": round(gross_exposure, 2),
        "net_exposure": round(net_exposure, 2),
        "netting_benefit": round(netting_benefit, 2),
        "netting_factor": round(netting_factor, 3),
        "gross_cva": round(gross_cva, 2),
        "net_cva": round(net_cva, 2),
        "cva_capital_savings": round(cva_savings, 2)
    }

p5 = calculate_cva_and_netting(
    [
        {"trade_id": "IRS_1", "mtm": 12000000.0},
        {"trade_id": "IRS_2", "mtm": -8000000.0},
        {"trade_id": "FX_FWD_1", "mtm": 5000000.0},
        {"trade_id": "FX_FWD_2", "mtm": -3000000.0}
    ],
    recovery_rate_pct=40.0, counterparty_cds_spread_bps=180.0
)
gross_mtm = "$" + f"{p5['gross_exposure']:,.2f}"
net_mtm = "$" + f"{p5['net_exposure']:,.2f}"
net_sav = "$" + f"{p5['netting_benefit']:,.2f}"
gross_cva = "$" + f"{p5['gross_cva']:,.2f}"
net_cva = "$" + f"{p5['net_cva']:,.2f}"
cap_freed = "$" + f"{p5['cva_capital_savings']:,.2f}"
print(f"Gross MTM: {gross_mtm} -> Net MTM: {net_mtm} (Savings: {net_sav})")
print(f"Gross CVA: {gross_cva} -> Net CVA: {net_cva} (Capital Freed: {cap_freed})")`,
        output: `Gross MTM: $17,000,000.00 -> Net MTM: $6,000,000.00 (Savings: $11,000,000.00)
Gross CVA: $306,000.00 -> Net CVA: $108,000.00 (Capital Freed: $198,000.00)`,
        codeNotes: [
          { line: 3, note: 'Evaluates bilateral positive mark-to-market positions to calculate gross replacement exposure' },
          { line: 5, note: 'Applies ISDA close-out netting rules to collapse positive and negative MTMs into a single net claim' },
          { line: 12, note: 'Extracts risk-neutral probability of default (PD) from market-observed CDS credit spreads' },
          { line: 32, note: 'Reduces derivative default exposure by $11.0M and slashes bilateral CVA expense by $198,000' }
        ],
        tryIt: 'Add a new losing trade with -$6M MTM and observe net exposure fall to $0.0M with zero CVA risk.',
        check: {
          question: 'What is the crucial legal and economic benefit of an ISDA Master Agreement close-out netting provision during counterparty bankruptcy?',
          options: [
            'It terminates all outstanding derivative contracts and calculates a single net aggregate payment, eliminating cherry-picking by the bankruptcy trustee.',
            'It automatically forces the government to bail out both trading institutions.',
            'It guarantees that derivative cash flows are completely exempt from taxation.',
            'It converts all unsecured derivatives into AAA-rated sovereign bonds.'
          ],
          answer: 0,
          why: 'Close-out netting prevents the "cherry-picking" problem where a bankruptcy trustee demands full payment on contracts where the bank owes money while defaulting on contracts where the bankrupt counterparty owes the bank.',
          answerIndex: 0,
          explanation: 'Close-out netting prevents the "cherry-picking" problem where a bankruptcy trustee demands full payment on contracts where the bank owes money while defaulting on contracts where the bankrupt counterparty owes the bank.'
        }
      }
    ],
    summary: [
      'Syndicated Loan Facilities: Mandated Lead Arrangers manage bookrunner allocations, oversubscription scaling haircuts, and earn 50-150 bps arrangement fees while mitigating hung loan balance sheet risks.',
      'Structured Trade Finance: Documentary Letters of Credit (UCP 600) and Banker\'s Acceptances eliminate cross-border counterparty risk and provide discount liquidity on 360-day money-market conventions.',
      'Treasury ALM Swaps: Pay-Fixed Receive-Floating interest rate swaps insulate Net Interest Margins (NIM) and Economic Value of Equity from central bank interest rate shocks.',
      'Basel III Liquidity Ratios: Mandates 30-day Liquidity Coverage Ratio (LCR >= 100%) with HQLA haircuts and 1-year Net Stable Funding Ratio (NSFR >= 100%) against wholesale deposit runs.',
      'Counterparty Risk & CVA: Bilateral Credit Valuation Adjustments quantify OTC derivative default costs; ISDA Master Agreement close-out netting collapses gross exposure to free regulatory capital.'
    ],
    projectStep: {
      title: 'Institutional Commercial Banking Syndicate, Trade & ALM Engine',
      steps: [
        'Structure a $500M syndicated credit facility with bookrunner tier allocations and oversubscription scaling.',
        'Model international documentary letter of credit issuance, confirmation, and 90-day banker\'s acceptance discounting.',
        'Engineer an ALM interest rate swap model to immunize net interest income against +200 bps macroeconomic rate shocks.',
        'Execute a comprehensive Basel III LCR and NSFR liquidity stress test alongside an ISDA derivative close-out netting audit.'
      ]
    }
  }
];

