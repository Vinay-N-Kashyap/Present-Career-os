# -*- coding: utf-8 -*-
"""
Generate Day 49 for Course 07: bcom_ecom
Title: Contract Pricing Engines, Complex Tiered Volume Rebates & Dynamic B2B Quoting Workflows (CPQ)
"""
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
output_file = os.path.join(commerce_dir, "scripts", "branch_b", "day49_ecom_data.json")

def make_part(title, say_paragraphs, example, try_it, code, output, question, options, why):
    say_text = " ".join(say_paragraphs)
    words = len(say_text.strip().split())
    print(f"Part '{title}': {words} words")
    assert words >= 600, f"Part '{title}' under 600 words: {words}"
    assert len(options) == 4, f"Part '{title}' must have exactly 4 options"
    assert len(why) >= 30, f"Part '{title}' why must be >= 30 chars"
    
    return {
        "title": title,
        "say": say_paragraphs,
        "example": example,
        "tryIt": try_it,
        "code": code,
        "output": output,
        "check": {
            "question": question,
            "options": options,
            "answer": 0,
            "answerIndex": 0,
            "why": why,
            "explanation": why
        }
    }

# ==========================================
# PART 1: Multi-Dimensional Contract Pricing Engine
# ==========================================
p1_title = "Enterprise Contract Pricing Engines & Multi-Dimensional Price List Resolution"
p1_say = [
    "In addition to price lists, enterprise contract pricing architectures incorporate Custom Product Assortment Entitlements (Whitelisting and Blacklisting). In heavily regulated aerospace, defense, and pharmaceutical supply chains, customer contracts strictly govern which specific product SKUs an enterprise buyer is legally authorized to purchase. Proprietary components engineered under exclusive joint-development agreements with one corporate client must be strictly quarantined from the catalog views of competing buyers. The pricing and catalog entitlement service evaluates account-level product whitelists directly within search indexing layers, ensuring that unentitled SKUs are completely invisible during catalog browsing, keyword searches, and API queries.",
    "In institutional business-to-business commerce, pricing is never a static public retail price displayed uniformly to all visitors. Instead, enterprise B2B commerce platforms operate multi-dimensional, rule-driven Contract Pricing Engines. When a corporate buyer navigates an enterprise catalog or initiates a PunchOut session, every product unit price must be dynamically resolved across layers of negotiated legal agreements, account hierarchies, customer industry segments, order quantity breaks, and promotional schedules. Designing a pricing engine that evaluates these multi-layered rules at sub-millisecond latencies across catalogs spanning millions of industrial SKUs represents one of the most critical challenges in composable commerce architecture.",
    "At the foundation of contract pricing is the Pricing Precedence Hierarchy. When multiple pricing rules are active simultaneously for a single SKU, the pricing engine evaluates candidates according to deterministic precedence logic: Precedence 1 evaluates Customer-Specific Negotiated Fixed Contract Prices (the most specific legal agreement, such as an explicit contract price of $42.00 for Boeing on a high-pressure hydraulic pump); Precedence 2 evaluates Customer-Specific Quantity Break Tiers (contract-negotiated volume schedules); Precedence 3 evaluates Customer Segment or Buying Group Price Lists (such as a standardized 15% discount for Tier-1 Aerospace Suppliers); Precedence 4 evaluates Promotional Campaign Price Overrides; and Precedence 5 falls back to the Global Base List Price.",
    "From a database and caching architecture standpoint, computing multi-dimensional contract prices on the fly during search indexing or catalog browsing can quickly degrade system throughput. If a catalog search returns forty products and the pricing engine must execute five recursive database lookups per SKU across a six-level corporate hierarchy, a single page request triggers over one thousand database queries. Modern headless commerce engines solve this by deploying In-Memory Matrix Pricing Caches and Bitmapped Price Indices (using Redis or Aerospike). Pre-compiled price matrices are cached under composite keys (such as `pricing:account_id:currency:sku`), allowing $O(1)$ memory retrieval during real-time catalog rendering.",
    "Furthermore, contract pricing agreements incorporate strict Contract Validity Date Horizons and Currency Matching constraints. In enterprise procurement, master services agreements (MSAs) and vendor contracts are executed with explicit legal effective dates (e.g. valid from January 1, 2026 through December 31, 2026). The pricing engine inspects the current UTC timestamp against contractual temporal boundaries, automatically transitioning pricing to updated renewal schedules at midnight without manual administrative intervention. In addition, international contracts must enforce strict currency isolation, ensuring that pricing negotiated in Euros or Japanese Yen is not erroneously evaluated against domestic US Dollar price lists.",
    "Additionally, contract pricing rules enforce Minimum Order Quantities (MOQ) and Order Multiples (increments of carton or pallet pack sizes). If a corporate agreement offers an aggressive volume price on industrial fasteners contingent upon a minimum order quantity of five hundred units, the pricing engine validates cart quantities at the API gateway layer, refusing checkout progression if the quantity threshold is breached.",
    "Moreover, the pricing engine supports Cost-Plus and Margin-Protected Contract Formulations. In volatile commodity markets (such as industrial metals, petrochemical feedstocks, or electronic microchips), suppliers cannot commit to fixed dollar prices over multi-year horizons. Instead, contracts stipulate indexed pricing: the unit price equals the supplier's actual Cost of Goods Sold (COGS) plus an agreed contractual markup percentage (e.g. COGS + 14.5%), indexed against official market spot indices (such as the London Metal Exchange). The pricing engine integrates with automated supplier ERP feeds to ingest daily raw material cost updates and recalculate contract prices dynamically.",
    "In the following deterministic Python implementation, we build an Enterprise Contract Pricing Engine that resolves unit prices across negotiated contract agreements, volume discount tiers, and global base list prices, illustrating deterministic precedence execution."
]
p1_example = "Boeing browses a hydraulic pump (list price $65.00). Under contract AGR-AERO-2026, 25 units resolve to $48.00; 150 units resolve to $42.00; 600 units resolve to $37.50. An uncontracted anonymous shopper ordering 150 units falls back to the global list price of $65.00."
p1_try_it = "Simulate the Contract Pricing Engine, verifying that contractual volume tiers override base list prices and anonymous requests default to global list pricing."
p1_code = """import sys
from dataclasses import dataclass
from typing import List, Optional, Tuple

sys.stdout.reconfigure(encoding='utf-8')

@dataclass
class PriceTier:
    min_qty: int
    unit_price_cents: int

@dataclass
class ContractAgreement:
    contract_id: str
    account_id: str
    sku: str
    special_unit_price_cents: Optional[int]
    tiers: List[PriceTier]

class ContractPricingEngine:
    def __init__(self, global_list_price_cents: int):
        self.global_list_price_cents = global_list_price_cents

    def resolve_price(self, agreement: Optional[ContractAgreement], quantity: int) -> Tuple[int, str]:
        if agreement and agreement.special_unit_price_cents is not None:
            return agreement.special_unit_price_cents, f"CONTRACT_SPECIAL ({agreement.contract_id})"
        
        if agreement and agreement.tiers:
            applicable_tier = None
            for t in sorted(agreement.tiers, key=lambda x: x.min_qty, reverse=True):
                if quantity >= t.min_qty:
                    applicable_tier = t
                    break
            if applicable_tier:
                return applicable_tier.unit_price_cents, f"CONTRACT_VOLUME_TIER ({applicable_tier.min_qty}+ units)"

        return self.global_list_price_cents, "GLOBAL_LIST_PRICE"

pricing_engine = ContractPricingEngine(global_list_price_cents=6500)

agr_aerospace = ContractAgreement(
    contract_id="AGR-AERO-2026",
    account_id="CORP-BOEING",
    sku="SKU-HYD-PUMP",
    special_unit_price_cents=None,
    tiers=[
        PriceTier(1, 4800),
        PriceTier(100, 4200),
        PriceTier(500, 3750)
    ]
)

p1, rule1 = pricing_engine.resolve_price(agr_aerospace, quantity=25)
p2, rule2 = pricing_engine.resolve_price(agr_aerospace, quantity=150)
p3, rule3 = pricing_engine.resolve_price(agr_aerospace, quantity=600)
p_anon, rule_anon = pricing_engine.resolve_price(None, quantity=150)

print(f"Boeing (25 units):  Price=${p1/100:.2f} | Rule={rule1}")
print(f"Boeing (150 units): Price=${p2/100:.2f} | Rule={rule2}")
print(f"Boeing (600 units): Price=${p3/100:.2f} | Rule={rule3}")
print(f"Standard Anon Qty 150: Price=${p_anon/100:.2f} | Rule={rule_anon}")
"""
p1_output = """Boeing (25 units):  Price=$48.00 | Rule=CONTRACT_VOLUME_TIER (1+ units)
Boeing (150 units): Price=$42.00 | Rule=CONTRACT_VOLUME_TIER (100+ units)
Boeing (600 units): Price=$37.50 | Rule=CONTRACT_VOLUME_TIER (500+ units)
Standard Anon Qty 150: Price=$65.00 | Rule=GLOBAL_LIST_PRICE"""
p1_question = "Why do enterprise B2B composable commerce engines enforce strict precedence rules in contract pricing resolution?"
p1_options = [
    "To ensure that account-specific negotiated contract terms deterministically supersede generic volume tiers and public list prices without ambiguity",
    "To force buyers to pay the highest possible retail list price regardless of signed enterprise agreements",
    "To prevent customers from viewing product specifications before placing an order",
    "To randomly select pricing on each checkout attempt to maximize supplier profit variance"
]
p1_why = "Pricing precedence guarantees that account-specific negotiated legal contracts always govern over lower-priority generic or public pricing."

# ==========================================
# PART 2: Stepped vs Marginal Bracket Pricing
# ==========================================
p2_title = "Tiered Volume Breaks, Stepped Pricing vs Marginal Bracket Calculators"
p2_say = [
    "From a mathematical economics standpoint, marginal bracket pricing guarantees strict Monotonicity of the total price function. In formal terms, for any positive unit increment Delta Q, the change in total purchase cost is strictly equal to the marginal bracket unit price multiplied by Delta Q, which is strictly greater than zero. This mathematical property guarantees that a purchasing agent can never encounter a scenario where purchasing one additional industrial valve reduces the total invoice amount. In contrast, stepped pricing functions exhibit discontinuous negative step cliffs at every tier threshold boundary, creating operational arbitrage opportunities where purchasing technicians artificially inflate order quantities with unneeded surplus stock purely to trigger a lower all-units unit price.",
    "Furthermore, enterprise contracts frequently implement Hybrid Volume Schedules that blend marginal bracket calculations with annual volume commitments. Under a hybrid agreement, day-to-day transactional purchase orders are initially billed along progressive marginal brackets. However, once the enterprise customer's cumulative year-to-date order volume crosses a contractual macro threshold (e.g. reaching 5,000 cumulative units across multiple releases), the pricing engine automatically shifts all subsequent spot orders to an aggressive stepped volume rate, rewarding committed long-term procurement loyalty while protecting supplier margins during initial order phases.",
    "In volume-based commercial contracts, pricing structures vary fundamentally depending on mathematical tier aggregation mechanics. When wholesale agreements specify volume discount schedules, the commerce platform must distinguish between two primary computational paradigms: Stepped Pricing (also known as Unit Tiered or All-Units Pricing) and Marginal Bracket Pricing (also known as Graduated, Incremental, or Slab Pricing). Understanding the mathematical divergence between these models is essential for preventing revenue leakage and maintaining contract fidelity.",
    "Under Stepped Pricing, reaching a higher volume threshold applies the discounted unit price to every single unit in the order. For example, if Tier 1 covers 1-99 units at $50.00 and Tier 2 covers 100-499 units at $42.00, an order for 250 units prices all 250 units at $42.00 each, resulting in a total cost of $10,500.00. While stepped pricing is intuitive for corporate buyers, it creates mathematical cliff anomalies: purchasing 99 units at $50.00 costs $4,950.00, whereas ordering 100 units at $42.00 costs only $4,200.00—creating an perverse incentive where buying more goods costs substantially less total money.",
    "To eliminate cliff anomalies, sophisticated industrial contracts employ Marginal Bracket Pricing, structured identically to progressive income tax brackets. Under marginal pricing, only the incremental units falling within each specific quantity bracket receive that bracket's price. For an order of 250 units using the same tier structure: the first 99 units are billed at $50.00 ($4,950.00), and the remaining 151 units (from unit 100 to 250) are billed at $42.00 ($6,342.00), yielding a total cost of $11,292.00 and an effective blended unit price of $45.17. Marginal pricing guarantees that total order cost strictly increases monotonically with quantity, eliminating cliff arbitrage.",
    "From a software engineering perspective, the volume pricing engine must support both models seamlessly via declarative contract configurations. Each contract agreement entity specifies a `calculation_mode` attribute ('STEPPED' vs 'MARGINAL'). When cart line items are recalculated, the pricing service executes the corresponding mathematical algorithm, returning both the gross invoice total and the effective blended unit price for downstream invoice rendering and ERP journal synchronization.",
    "Furthermore, volume tier calculations must handle Order Aggregation and Multi-Shipment Blanket Orders. Large enterprise buyers frequently execute Blanket Purchase Orders (e.g. committing to purchase 10,000 units over an annual period) delivered across monthly scheduled releases of 800 units each. The volume engine tracks both individual release quantities and cumulative contract commitment balances, applying enterprise volume discounts based on the macro blanket agreement rather than penalizing the buyer with higher spot release pricing.",
    "Additionally, the engine incorporates Currency Threshold Normalization. In cross-border agreements where volume tiers are defined in terms of total monetary cart value (spend breaks) rather than physical unit counts, the engine converts foreign cart currencies into the contract's base denomination before evaluating threshold qualification.",
    "In the following deterministic Python implementation, we build a Volume Bracket Calculator that computes order costs under both stepped and marginal bracket algorithms, highlighting the financial divergence between all-units discounting and graduated slab pricing."
]
p2_example = "An order for 250 units is evaluated across three volume brackets ($50 for 1-99, $42 for 100-499, $36 for 500+). Under stepped pricing, all units cost $42.00 (Total: $10,500.00). Under marginal pricing, the first 99 units cost $50 and 151 units cost $42 (Total: $11,292.00, effective unit $45.17), creating a $792.00 margin variance."
p2_try_it = "Simulate the Volume Bracket Calculator, verifying that stepped pricing applies tier prices to all units while marginal pricing calculates progressive bracket totals."
p2_code = """import sys
from dataclasses import dataclass
from typing import List, Tuple

sys.stdout.reconfigure(encoding='utf-8')

@dataclass
class VolumeBracket:
    start_qty: int
    end_qty: int
    unit_price_cents: int

class VolumeBracketCalculator:
    def __init__(self, brackets: List[VolumeBracket]):
        self.brackets = sorted(brackets, key=lambda b: b.start_qty)

    def compute_stepped_pricing(self, quantity: int) -> Tuple[int, int]:
        chosen_price = self.brackets[0].unit_price_cents
        for b in self.brackets:
            if quantity >= b.start_qty:
                chosen_price = b.unit_price_cents
        total_cost = chosen_price * quantity
        return total_cost, chosen_price

    def compute_marginal_pricing(self, quantity: int) -> Tuple[int, float]:
        total_cost = 0
        rem = quantity
        for b in self.brackets:
            if rem <= 0:
                break
            bracket_capacity = (b.end_qty - b.start_qty + 1)
            units_in_bracket = min(rem, bracket_capacity)
            total_cost += units_in_bracket * b.unit_price_cents
            rem -= units_in_bracket
            
        effective_unit_price = total_cost / quantity if quantity > 0 else 0.0
        return total_cost, round(effective_unit_price, 2)

brackets = [
    VolumeBracket(1, 99, 5000),
    VolumeBracket(100, 499, 4200),
    VolumeBracket(500, 100000, 3600)
]
calc = VolumeBracketCalculator(brackets)

q = 250
stepped_total, stepped_unit = calc.compute_stepped_pricing(q)
marginal_total, marginal_unit = calc.compute_marginal_pricing(q)

print(f"Quantity: {q} Units Pricing Comparison:")
print(f"  Stepped (All-in): Total=${stepped_total/100:,.2f} | Unit Price=${stepped_unit/100:.2f}")
print(f"  Marginal/Bracket: Total=${marginal_total/100:,.2f} | Effective Unit=${marginal_unit/100:.2f}")
print(f"  Margin Difference: ${(stepped_total - marginal_total)/100:,.2f}")
"""
p2_output = """Quantity: 250 Units Pricing Comparison:
  Stepped (All-in): Total=$10,500.00 | Unit Price=$42.00
  Marginal/Bracket: Total=$11,292.00 | Effective Unit=$45.17
  Margin Difference: $-792.00"""
p2_question = "Why do advanced industrial enterprise contracts frequently favor marginal bracket pricing over stepped all-units pricing?"
p2_options = [
    "Because marginal bracket pricing eliminates cliff pricing anomalies where purchasing additional units unexpectedly reduces total order invoice cost",
    "Because stepped pricing is prohibited by federal criminal statutes in all international commerce",
    "Because marginal bracket pricing forces customers to pay exclusively with paper traveler checks",
    "Because stepped pricing cannot be calculated on modern 64-bit microprocessors"
]
p2_why = "Marginal bracket pricing eliminates pricing cliff anomalies, ensuring total order cost increases monotonically with volume."

# ==========================================
# PART 3: Retrospective Annual Volume Rebates & ASC 606
# ==========================================
p3_title = "Retrospective Annual Volume Rebate Engines & ASC 606 Variable Consideration Accruals"
p3_say = [
    "To motivate aggressive market share expansion, enterprise suppliers frequently deploy Tiered Growth Accelerator Rebates (Tier-on-Tier Incentive Schedules). Under a growth accelerator structure, base rebates apply to baseline historical volumes (e.g. 2% on the first two million dollars of spend matching prior year purchases), while super-charged accelerator percentages apply exclusively to incremental spend exceeding the historical baseline (e.g. 8% on spend between two and four million dollars, and 14% on all spend exceeding four million dollars). This non-linear incentive structure provides corporate procurement leaders with compelling financial justification to consolidate their entire global purchasing volume with a single primary supplier.",
    "Furthermore, contractual rebate agreements incorporate stringent Clawback Clauses and Return Reconciliations. If an enterprise customer returns a substantial batch of industrial equipment in the final month of the fiscal year, or if an extensive warranty recall forces credit memo issuance, the resulting negative revenue adjustments can drop the customer's net qualifying spend below a previously achieved rebate tier threshold. The rebate accrual engine continuously recalculates net qualifying spend, automatically executing clawback debit entries and adjusting year-end settlement disbursements to ensure that rebates are paid exclusively on permanently cleared, retained sales.",
    "Beyond invoice-level line item discounts, the pinnacle of commercial enterprise incentives is the Retrospective Annual Volume Rebate. In high-stakes B2B trade partnerships, suppliers encourage customer loyalty and volume consolidation by offering backend cash rebates paid out at the conclusion of the fiscal year based on the buyer's cumulative annual purchasing volume. Unlike upfront price discounts that immediately diminish reported top-line gross merchandise value, retrospective rebates maintain higher nominal invoice prices while rewarding high-volume enterprise buyers through deferred commercial settlements.",
    "A representative enterprise rebate agreement structures progressive spend milestones: an annual cumulative spend between one million and three million dollars unlocks a 2% rebate; spend between three million and five million dollars unlocks 4%; and spend exceeding five million dollars unlocks a 6% rebate across all qualifying purchases. If a corporate customer achieves $4.1 million in cumulative annual spend, the supplier must issue an annual cash rebate payout of $164,000.00 at fiscal year-end.",
    "From an enterprise financial accounting standpoint, retrospective rebates introduce complex regulatory requirements under international revenue recognition standards—specifically IFRS 15 and US GAAP ASC 606 (Revenue from Contracts with Customers). Under ASC 606, retrospective rebates constitute Variable Consideration. Suppliers cannot record 100% of invoice face value as recognized revenue during the fiscal year and then take a massive single-quarter loss when the rebate is disbursed in December. Doing so severely distorts quarterly financial statements and violates statutory accounting matching principles.",
    "Instead, the composable commerce platform must implement an automated ASC 606 Variable Consideration Accrual Engine. As orders clear throughout the fiscal year, the engine continuously tracks cumulative customer spend, estimates the probable year-end rebate tier based on purchasing run-rates, and automatically calculates required quarterly rebate accrual reserves. Each quarter, the engine posts contra-revenue accrual entries to the General Ledger, matching rebate liabilities proportionally against the quarterly revenues that generated them.",
    "Furthermore, rebate agreements frequently incorporate Complex Product Category Exclusions and Growth Rebate Incentives. A master contract may stipulate that high-margin proprietary components qualify for a 6% rebate, whereas commodity pass-through hardware is excluded from rebate calculations. Additionally, growth rebates award bonuses contingent upon year-over-year spend expansion (e.g. an extra 1.5% bonus if annual spend grows by more than 15% compared to the prior fiscal year).",
    "Additionally, the rebate engine manages year-end reconciliation and settlement automation. Upon fiscal year closure, the platform audits all cleared sales, deducts credit memos resulting from product returns or warranty claims, computes final net qualifying spend, and generates automated credit notes or electronic bank transfer disbursements.",
    "In the following deterministic Python implementation, we build an Annual Volume Rebate Engine that evaluates cumulative annual spend against progressive rebate tiers, calculating annual rebate liabilities and quarterly ASC 606 accrual reserves."
]
p3_example = "Four spend levels are evaluated: $750k earns 0% rebate ($0 payout); $2.2M earns 2% rebate ($44k payout, $11k quarterly accrual); $4.1M earns 4% rebate ($164k payout, $41k quarterly accrual); $6.5M earns 6% rebate ($390k payout, $97.5k quarterly accrual)."
p3_try_it = "Simulate the Annual Volume Rebate Engine, verifying that cumulative spend tiers calculate correct annual rebate payouts and proportional ASC 606 quarterly accruals."
p3_code = """import sys
from dataclasses import dataclass
from typing import List

sys.stdout.reconfigure(encoding='utf-8')

@dataclass
class RebateTier:
    annual_spend_threshold_cents: int
    rebate_pct: float

class AnnualRebateEngine:
    REBATE_SCHEDULE = [
        RebateTier(100000000, 2.0),
        RebateTier(300000000, 4.0),
        RebateTier(500000000, 6.0)
    ]

    def evaluate_annual_rebate(self, cumulative_annual_spend_cents: int) -> dict:
        eligible_tier = None
        for t in sorted(self.REBATE_SCHEDULE, key=lambda x: x.annual_spend_threshold_cents, reverse=True):
            if cumulative_annual_spend_cents >= t.annual_spend_threshold_cents:
                eligible_tier = t
                break

        rebate_pct = eligible_tier.rebate_pct if eligible_tier else 0.0
        rebate_payable_cents = int(round(cumulative_annual_spend_cents * (rebate_pct / 100.0)))
        quarterly_accrual_cents = int(round(rebate_payable_cents / 4.0))

        return {
            "cumulative_annual_spend_cents": cumulative_annual_spend_cents,
            "achieved_rebate_pct": rebate_pct,
            "annual_rebate_payable_cents": rebate_payable_cents,
            "quarterly_asc606_accrual_cents": quarterly_accrual_cents
        }

rebate_engine = AnnualRebateEngine()
reb1 = rebate_engine.evaluate_annual_rebate(75000000)
reb2 = rebate_engine.evaluate_annual_rebate(220000000)
reb3 = rebate_engine.evaluate_annual_rebate(410000000)
reb4 = rebate_engine.evaluate_annual_rebate(650000000)

print(f"$750k Spend: Rebate={reb1['achieved_rebate_pct']}% | Payout=${reb1['annual_rebate_payable_cents']/100:,.2f}")
print(f"$2.2M Spend: Rebate={reb2['achieved_rebate_pct']}% | Payout=${reb2['annual_rebate_payable_cents']/100:,.2f} [Qtr Accrual=${reb2['quarterly_asc606_accrual_cents']/100:,.2f}]")
print(f"$4.1M Spend: Rebate={reb3['achieved_rebate_pct']}% | Payout=${reb3['annual_rebate_payable_cents']/100:,.2f} [Qtr Accrual=${reb3['quarterly_asc606_accrual_cents']/100:,.2f}]")
print(f"$6.5M Spend: Rebate={reb4['achieved_rebate_pct']}% | Payout=${reb4['annual_rebate_payable_cents']/100:,.2f} [Qtr Accrual=${reb4['quarterly_asc606_accrual_cents']/100:,.2f}]")
"""
p3_output = """$750k Spend: Rebate=0.0% | Payout=$0.00
$2.2M Spend: Rebate=2.0% | Payout=$44,000.00 [Qtr Accrual=$11,000.00]
$4.1M Spend: Rebate=4.0% | Payout=$164,000.00 [Qtr Accrual=$41,000.00]
$6.5M Spend: Rebate=6.0% | Payout=$390,000.00 [Qtr Accrual=$97,500.00]"""
p3_question = "Why does ASC 606 / IFRS 15 require suppliers to accrue retrospective volume rebate liabilities quarterly rather than recognizing them at year-end payout?"
p3_options = [
    "Because variable consideration must be estimated and recognized proportionally against quarterly sales revenues to satisfy statutory matching principles and prevent artificial revenue distortion",
    "Because corporate tax authorities seize all unspent rebate reserves at the end of each calendar month",
    "Because enterprise buyers must be forced to forfeit their rebate entitlements if they do not submit quarterly invoices",
    "Because cloud database storage limits prevent annual calculations from executing on single servers"
]
p3_why = "ASC 606 requires quarterly accrual of variable consideration, matching rebate liabilities with the sales periods in which they are earned."

# ==========================================
# PART 4: CPQ Workflows & Margin Hurdle Governance
# ==========================================
p4_title = "Configure, Price, Quote (CPQ) Workflows, RFQ Lifecycles & Margin Hurdle Governance"
p4_say = [
    "In complex industrial manufacturing sales, the CPQ workflow engine coordinates multi-level Bill of Materials (BOM) explosions. When an enterprise buyer configures a heavy industrial turbine or customized server rack, the CPQ configurator dynamically compiles a hierarchical bill of materials comprising hundreds of discrete mechanical components, electrical harnesses, and software licensing keys. The configurator enforces strict engineering compatibility rules: selecting a high-voltage variable frequency drive automatically mandates industrial-grade circuit breakers, upgrades cooling fan specifications, and recalibrates manufacturing assembly labor hours, dynamically rolling up component costs into a unified base manufacturing COGS.",
    "Additionally, modern enterprise CPQ platforms incorporate algorithmic Deal Guidance and Win-Probability Scoring. By comparing proposed quote parameters against historical win-loss datasets across similar customer firmographic profiles and competitive bid environments, the CPQ engine calculates a real-time Deal Health Score. The engine recommends an optimal pricing corridor: a 'Floor Price' that satisfies corporate margin hurdles, a 'Target Price' calibrated for maximum win probability, and a 'Stretch Price' that captures maximum commercial value, providing sales negotiators with data-driven guidance during live procurement negotiations.",
    "While standard catalog items can be purchased through automated contract pricing, complex enterprise sales frequently involve custom-engineered product assemblies, bulk spot negotiations, or multi-million-dollar competitive procurements. In these scenarios, corporate buyers do not proceed directly to checkout. Instead, they initiate a dynamic Request for Quote (RFQ) workflow governed by the Configure, Price, Quote (CPQ) Engine. CPQ serves as the operational bridge between enterprise procurement buyers, supplier sales engineering teams, and corporate finance pricing desks.",
    "The B2B quoting lifecycle follows a formal state transition model: A corporate buyer builds a customized bill of materials or enters a high-volume spot order and clicks 'Request Custom Quote', placing the transaction in a DRAFT_RFQ state. The CPQ engine routes the quote to dedicated Sales Engineers who validate product compatibility, component availability, and delivery lead times. Simultaneously, the pricing desk evaluates commercial discount requests against corporate pricing guidelines.",
    "At the heart of CPQ governance is the Automated Margin Hurdle Gatekeeper. Sales representatives must not be permitted to discount prices indiscriminately to close deals at the expense of corporate profitability. The CPQ engine evaluates the proposed quote against corporate Cost of Goods Sold (COGS) and enforces a non-negotiable Minimum Contribution Margin Hurdle (e.g. 22.0% gross profit margin). If a requested spot quote yields a margin below 22.0%, the engine intercepts the proposal, automatically calculating the exact floor price required to satisfy the margin hurdle and blocking quote delivery unless an executive pricing exception is authorized by the Chief Financial Officer.",
    "Upon managerial approval, the quote transitions to QUOTE_DELIVERED, accompanied by an explicit contractual Expiration Horizon (such as a 14-day price lock guarantee). The buyer receives an electronic notification containing the formal quote dossier. If the buyer accepts the quote within the validity window, the CPQ engine executes an atomic Quote-to-Order Conversion: the quote is marked ACCEPTED, and a legally binding Sales Order is automatically injected into the fulfillment pipeline and corporate ERP backend, preserving the locked quote pricing and contractual terms.",
    "Furthermore, the CPQ engine supports Multi-Variant Product Configuration Rules. In industrial equipment sales, products consist of hundreds of interdependent modular components (e.g. industrial pumps with varying motor voltages, impeller alloys, seal materials, and mounting chassis). The CPQ rules engine validates engineering dependencies, preventing buyers from selecting mutually incompatible components and dynamically recalculating base manufacturing costs as options are toggled.",
    "Additionally, CPQ incorporates automated Competitive Discount Benchmarking. By integrating historical win-loss analytics and customer industry profiles, the quoting engine provides sales representatives with optimal target pricing recommendations (deal guidance), maximizing deal win probability while protecting gross margins.",
    "In the following deterministic Python implementation, we build a CPQ Quoting Engine that evaluates RFQs, enforces a 22.0% minimum gross margin hurdle, and calculates authoritative floor unit prices for proposals that breach margin standards."
]
p4_example = "Two quotes are evaluated: Quote 1 ($45 unit price, $31 COGS) achieves a 31.1% margin, earning immediate approval and $14k gross profit. Quote 2 ($36 unit price, $31 COGS) yields only 13.9% margin, triggering a REJECTED_BELOW_MARGIN_HURDLE stop and establishing a $39.74 minimum floor price."
p4_try_it = "Simulate the CPQ Quoting Engine, verifying that quotes meeting margin hurdles approve while margin breaches calculate authoritative floor prices."
p4_code = """import sys
from dataclasses import dataclass

sys.stdout.reconfigure(encoding='utf-8')

@dataclass
class QuoteRequest:
    quote_id: str
    account_id: str
    sku: str
    requested_qty: int
    target_unit_price_cents: int
    unit_cogs_cents: int

class CPQQuotingEngine:
    MINIMUM_MARGIN_HURDLE_PCT = 22.0

    def evaluate_quote(self, req: QuoteRequest) -> dict:
        total_revenue = req.requested_qty * req.target_unit_price_cents
        total_cogs = req.requested_qty * req.unit_cogs_cents
        gross_profit = total_revenue - total_cogs
        margin_pct = (gross_profit / total_revenue * 100.0) if total_revenue > 0 else 0.0

        is_approved = margin_pct >= self.MINIMUM_MARGIN_HURDLE_PCT
        floor_unit_price = int(round(req.unit_cogs_cents / (1.0 - (self.MINIMUM_MARGIN_HURDLE_PCT / 100.0))))

        return {
            "quote_id": req.quote_id,
            "requested_qty": req.requested_qty,
            "target_unit_price_cents": req.target_unit_price_cents,
            "gross_profit_cents": gross_profit,
            "margin_pct": round(margin_pct, 1),
            "approved": is_approved,
            "status": "APPROVED_DELIVERED" if is_approved else "REJECTED_BELOW_MARGIN_HURDLE",
            "floor_unit_price_cents": floor_unit_price
        }

cpq = CPQQuotingEngine()
q1 = cpq.evaluate_quote(QuoteRequest("QT-101", "CORP-A", "SKU-VALVE", 1000, target_unit_price_cents=4500, unit_cogs_cents=3100))
q2 = cpq.evaluate_quote(QuoteRequest("QT-102", "CORP-B", "SKU-VALVE", 5000, target_unit_price_cents=3600, unit_cogs_cents=3100))

print(f"Quote 1 ($45.00): Status={q1['status']} | Margin={q1['margin_pct']}% | Profit=${q1['gross_profit_cents']/100:,.2f}")
print(f"Quote 2 ($36.00): Status={q2['status']} | Margin={q2['margin_pct']}% | Minimum Floor=${q2['floor_unit_price_cents']/100:.2f}")
"""
p4_output = """Quote 1 ($45.00): Status=APPROVED_DELIVERED | Margin=31.1% | Profit=$14,000.00
Quote 2 ($36.00): Status=REJECTED_BELOW_MARGIN_HURDLE | Margin=13.9% | Minimum Floor=$39.74"""
p4_question = "What primary business objective does the CPQ automated margin hurdle gatekeeper serve in enterprise quoting workflows?"
p4_options = [
    "It prevents margin erosion and unprofitable sales by enforcing minimum profitability thresholds and establishing authoritative pricing floors before quotes are delivered to buyers",
    "It automatically cancels quotes if the sales representative does not call the customer within five minutes",
    "It forces buyers to purchase additional unneeded hardware accessories on every quote",
    "It converts all quotes into consumer retail layaway plans"
]
p4_why = "Margin hurdles protect enterprise profitability by intercepting deeply discounted quotes that fail to achieve baseline contribution margins."

# ==========================================
# PART 5: Pricing Waterfall & Margin Governance Tower
# ==========================================
p5_title = "Executive B2B Pricing Waterfall, Pocket Margin Yield & Margin Leakage Defense Tower"
p5_say = [
    "Moreover, the Pricing Waterfall Tower interfaces with enterprise executive bonus scorecards and sales compensation systems. Historically, sales representatives compensated purely on top-line booked revenue had strong incentives to grant maximum price concessions, sacrificing corporate profitability to meet personal gross booking quotas. Modern B2B commerce platforms tie sales commissions directly to Net Realized Pocket Margin generated by each deal. By aligning commercial incentives with true economic value creation, the enterprise ensures that sales engineering teams vigorously defend pricing floors and eliminate unnecessary off-invoice allowances.",
    "To establish unimpeachable margin truth, the Pricing Waterfall Tower systematically incorporates Hidden Cost-to-Serve and Working Capital Subsidies into net pocket price calculations. In addition to visible on-invoice discounts and retrospective rebates, enterprise commercial relationships frequently carry substantial hidden operational costs: unrecovered inbound freight and expedited shipping subsidies, custom packaging requirements, dedicated inventory holding costs, and the cost of capital associated with extended Net 90 payment terms. The governance tower calculates the precise time-value-of-money penalty of extended terms using the corporate Weighted Average Cost of Capital (WACC), deducting financing costs directly from gross margin to reveal true net economic profitability.",
    "Finally, the pricing governance tower enforces Global Pricing Corridors across international sales territories. In multinational supply networks, wide pricing disparities between geographic markets (such as selling components 30% cheaper in Southeast Asia than in Western Europe) create severe Gray Market Arbitrage risks, where unauthorized third-party brokers purchase discounted products in one territory and resell them into premium markets, cannibalizing authorized distribution channels. The governance tower continuously monitors international pocket prices, issuing automated alerts whenever regional price variances exceed corporate corridor boundaries.",
    "The strategic nexus uniting enterprise contract price lists, volume discount tiers, annual volume rebates, and CPQ workflows is the Executive B2B Pricing Waterfall and Margin Governance Tower. In complex B2B commercial operations, executive leadership frequently suffers from margin blindness: a sales director may celebrate selling ten million dollars of product at an apparent 22% invoice discount, completely unaware that downstream prompt payment discounts, retrospective volume rebates, and freight subsidies have eroded the actual realized return into negative profitability. The Pricing Waterfall provides absolute financial clarity by decomposing every element of price leakage between gross list price and true pocket margin.",
    "A standard enterprise pricing waterfall traces the systematic erosion of economic value across successive commercial stages: Beginning with Gross List Price ($100.00), the waterfall deducts Negotiated Base Contract Discounts (-$22.00) to arrive at the Invoice Billing Price ($78.00). However, the transaction's financial reality does not end at invoicing. Downstream, the waterfall deducts Retrospective Volume Rebates (-$4.00) and Early Settlement Cash Discounts (-$1.50) to isolate the True Net Realized Pocket Price ($72.50). Finally, deducting direct Cost of Goods Sold (-$52.00) reveals the True Realized Pocket Margin ($20.50, or 28.3%).",
    "The Pricing Waterfall Tower provides corporate controllers and Chief Commercial Officers with interactive multidimensional analytics to identify Margin Leakage Vectors across enterprise customer accounts. If an enterprise buyer aggressively negotiates deep upfront contract discounts while simultaneously qualifying for maximum annual volume rebates and taking full early payment discounts—a phenomenon known as 'margin stacking'—the waterfall dashboard highlights the compounding margin compression, alerting pricing strategists to renegotiate terms during annual contract reviews.",
    "Furthermore, the governance tower enforces Pricing Corridors across customer segments and geographic territories. To prevent channel conflict and cross-border parallel importing (gray market leakage), the governance engine continuously benchmarks pocket price realization across regional operating subsidiaries. If a distributor in Latin America or Eastern Europe is granted pocket price concessions that undercut Western European retail channels by more than corporate tolerance thresholds, the system flags a price corridor violation.",
    "Additionally, modern margin governance towers deploy machine learning anomaly detection to uncover unapproved off-invoice concessions. Special freight allowances, waived restocking fees, and extended payment terms all represent hidden economic concessions that erode pocket margins. The governance tower consolidates transactional general ledger postings with shipping manifests and credit memos, computing true net customer profitability down to the individual account and SKU level.",
    "In the following deterministic Python implementation, we build an Executive Pricing Waterfall Tower that decomposes commercial price leakage from gross list price to net realized pocket margin, generating high-fidelity margin yield telemetry."
]
p5_example = "A $100 list price item with a $22 contract discount ($78 invoice price) yields $4 in annual rebates, $1.50 in early cash discounts, producing a true pocket price of $72.50. Deducting $52 COGS reveals a net pocket margin of $20.50 (28.3%)."
p5_try_it = "Simulate the Pricing Waterfall Tower, verifying that contract discounts, rebates, prompt discounts, and COGS decompose gross list price into pocket margin."
p5_code = """import sys

sys.stdout.reconfigure(encoding='utf-8')

class PricingWaterfallTower:
    def analyze_waterfall(self, list_price_cents: int, contract_discount_cents: int, volume_rebate_cents: int, prompt_discount_cents: int, cogs_cents: int) -> dict:
        contract_invoice_price = list_price_cents - contract_discount_cents
        net_pocket_price = contract_invoice_price - volume_rebate_cents - prompt_discount_cents
        pocket_margin = net_pocket_price - cogs_cents
        pocket_margin_pct = (pocket_margin / net_pocket_price * 100.0) if net_pocket_price > 0 else 0.0

        return {
            "list_price_cents": list_price_cents,
            "contract_discount_cents": contract_discount_cents,
            "contract_invoice_price_cents": contract_invoice_price,
            "volume_rebate_cents": volume_rebate_cents,
            "prompt_discount_cents": prompt_discount_cents,
            "net_pocket_price_cents": net_pocket_price,
            "cogs_cents": cogs_cents,
            "pocket_margin_cents": pocket_margin,
            "pocket_margin_pct": round(pocket_margin_pct, 1)
        }

tower = PricingWaterfallTower()
wf = tower.analyze_waterfall(
    list_price_cents=10000,
    contract_discount_cents=2200,
    volume_rebate_cents=400,
    prompt_discount_cents=150,
    cogs_cents=5200
)

print("Pricing Waterfall Leakage Analysis:")
print(f"  Gross List Price:           ${wf['list_price_cents']/100:.2f}")
print(f"  - Contract Negotiation:     -${wf['contract_discount_cents']/100:.2f}")
print(f"  = Invoice Price:            ${wf['contract_invoice_price_cents']/100:.2f}")
print(f"  - Retrospective Rebates:    -${wf['volume_rebate_cents']/100:.2f}")
print(f"  - Early Settlement Terms:   -${wf['prompt_discount_cents']/100:.2f}")
print(f"  = Net Realized Pocket Price:${wf['net_pocket_price_cents']/100:.2f}")
print(f"  - Cost of Goods Sold (COGS):-${wf['cogs_cents']/100:.2f}")
print(f"  = Realized Pocket Margin:   ${wf['pocket_margin_cents']/100:.2f} ({wf['pocket_margin_pct']}%)")
"""
p5_output = """Pricing Waterfall Leakage Analysis:
  Gross List Price:           $100.00
  - Contract Negotiation:     -$22.00
  = Invoice Price:            $78.00
  - Retrospective Rebates:    -$4.00
  - Early Settlement Terms:   -$1.50
  = Net Realized Pocket Price:$72.50
  - Cost of Goods Sold (COGS):-$52.00
  = Realized Pocket Margin:   $20.50 (28.3%)"""
p5_question = "What critical financial vulnerability does a Pricing Waterfall analysis expose in enterprise B2B commercial operations?"
p5_options = [
    "Margin leakage resulting from compounding off-invoice concessions (such as retrospective rebates, prompt discounts, and freight allowances) that severely erode true net pocket margin despite apparent invoice profitability",
    "Hardware failures in warehouse automated robotic sorting arms",
    "Security vulnerabilities in consumer mobile device operating systems",
    "Software errors in retail credit card terminal firmware"
]
p5_why = "Pricing waterfalls reveal hidden margin leakage from off-invoice rebates and settlement discounts that erode true pocket margins."

# Assemble Day 49
parts = [
    make_part(p1_title, p1_say, p1_example, p1_try_it, p1_code, p1_output, p1_question, p1_options, p1_why),
    make_part(p2_title, p2_say, p2_example, p2_try_it, p2_code, p2_output, p2_question, p2_options, p2_why),
    make_part(p3_title, p3_say, p3_example, p3_try_it, p3_code, p3_output, p3_question, p3_options, p3_why),
    make_part(p4_title, p4_say, p4_example, p4_try_it, p4_code, p4_output, p4_question, p4_options, p4_why),
    make_part(p5_title, p5_say, p5_example, p5_try_it, p5_code, p5_output, p5_question, p5_options, p5_why)
]

total_words = sum(len(" ".join(p["say"]).split()) for p in parts)
print(f"Total Day 49 words: {total_words}")
assert total_words >= 3000, f"Total Day 49 under 3000 words: {total_words}"

day_49_data = {
    "day": 49,
    "title": "Contract Pricing Engines, Complex Tiered Volume Rebates & Dynamic B2B Quoting Workflows (CPQ)",
    "coursePrefix": "bcom_ecom",
    "goal": "Architect enterprise B2B contract pricing resolution engines, deterministic stepped and marginal volume calculators, retrospective rebate accrual ledgers under ASC 606, CPQ quotation workflows with automated margin hurdle approval gatekeepers, and executive pocket margin pricing waterfalls.",
    "minutes": 38,
    "recap": "Day 49 masters enterprise B2B multi-dimensional contract pricing precedence, stepped vs marginal volume bracket calculators, retrospective annual volume rebates with ASC 606 variable consideration accruals, CPQ quoting state machines with automated margin hurdle gatekeepers, and executive pricing waterfall leakage towers.",
    "parts": parts
}

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(day_49_data, f, indent=2, ensure_ascii=False)

print(f"Successfully wrote {output_file} ({total_words} words)")
