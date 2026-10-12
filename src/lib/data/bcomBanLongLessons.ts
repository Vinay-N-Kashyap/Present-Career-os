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
  }
];
