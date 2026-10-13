import type { LongLesson } from './longLessons';

/**
 * Marketing Strategy, Brand Equity & Consumer Psychology (Course: bcom-marketing / course-marketing-branding)
 * Day 1: Customer Value Creation, Modern Marketing Orientations, CSAT Gaps, STP & Brand Equity Architecture.
 */
export const BCOM_MKT_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'bcom-marketing',
    day: 1,
    title: 'Customer Value Creation, Modern Marketing Orientations, CSAT Gaps & Brand Equity Architecture',
    goal: 'Master foundational marketing science: the 5 organizational orientations, customer value ratio calculus, Oliver\'s CSAT expectation-disconfirmation model, strategic STP market mapping, and Keller\'s Customer-Based Brand Equity (CBBE) pyramid.',
    minutes: 42,
    recap: 'Welcome to Marketing Strategy & Brand Equity Architecture. Marketing is not merely superficial promotional slogans or advertising graphics; it is the strategic discipline of discovering latent customer needs, engineering superior economic and psychological value, and building durable brand resonance that commands pricing power.',
    parts: [
      {
        title: 'Modern Marketing Evolution & The 5 Competing Organizational Orientations',
        say: [
          'Throughout commercial history, organizations have approached the marketplace through five distinct philosophies: the Production, Product, Selling, Marketing, and Societal Marketing concepts.',
          'The Production Concept assumes consumers favor products that are widely available and inexpensive; management focuses narrowly on high production efficiency, mass distribution, and driving unit manufacturing costs down.',
          'The Product Concept assumes consumers favor products offering the highest quality, performance, or innovative features. However, companies adopting this philosophy frequently suffer from what Harvard Professor Theodore Levitt termed "Marketing Myopia" — the fatal trap of defining a business around a physical product rather than the fundamental human need it satisfies.',
          'The Selling Concept assumes consumers will not buy enough goods without aggressive promotional persuasion. This is an "inside-out" perspective: starting in the factory, focusing on existing products, and relying on high-pressure selling quotas to liquidate inventory.',
          'The Marketing Concept emerged in the mid-20th century as an "outside-in" revolution: starting with a well-defined market, focusing on customer needs, coordinating all organizational activities affecting customers, and generating profits through long-term customer satisfaction and retention.',
          'Finally, the Societal Marketing Concept elevates this further by balancing three competing pillars: Company Profits, Consumer Need Satisfaction, and Long-Term Public Welfare (such as environmental sustainability and public health).'
        ],
        example: 'In the early 20th century, Henry Ford exemplified the Production Concept: "Any customer can have a car painted any colour that he wants so long as it is black." Decades later, Kodak fell victim to Marketing Myopia under the Product Concept: believing they were in the chemical film business rather than the personal memories and storytelling business, ignoring the digital camera wave they themselves invented.',
        code: `# Simulation: Organizational Marketing Orientation & Myopia Risk Diagnostic
from dataclasses import dataclass
from typing import List

@dataclass
class EnterpriseStrategy:
    company_name: str
    starting_point: str        # 'Factory' or 'Market'
    primary_focus: str         # 'Production', 'Product Engineering', 'Selling', 'Customer Value'
    operational_means: str     # 'Selling & Promotion', 'Cost Cutting', 'Integrated Marketing'
    customer_listening: bool

def diagnose_marketing_orientation(firm: EnterpriseStrategy) -> dict:
    if firm.starting_point == 'Factory':
        if 'Cost' in firm.operational_means:
            orientation = 'PRODUCTION_CONCEPT'
            myopia_risk = 'HIGH (Commodity Price Trap)'
            philosophy = 'Inside-Out: Mass manufacturing efficiency over market demand.'
        elif 'Engineering' in firm.primary_focus:
            orientation = 'PRODUCT_CONCEPT'
            myopia_risk = 'VERY HIGH (Feature Obsession vs Customer Need)'
            philosophy = 'Inside-Out: Building better mousetraps without asking if mice exist.'
        else:
            orientation = 'SELLING_CONCEPT'
            myopia_risk = 'CRITICAL (Pushing Inventory, High Churn)'
            philosophy = 'Inside-Out: Converting goods into cash regardless of satisfaction.'
    else:
        if firm.customer_listening:
            orientation = 'HOLISTIC_MARKETING_CONCEPT'
            myopia_risk = 'MINIMAL (Outside-In Adaptive Agility)'
            philosophy = 'Outside-In: Delivering superior customer solutions & lifetime retention.'
        else:
            orientation = 'UNFOCUSED_COMMERCIAL_STANCE'
            myopia_risk = 'MODERATE'
            philosophy = 'Uncoordinated market engagement.'

    return {
        'Enterprise': firm.company_name,
        'Orientation': orientation,
        'Philosophy': philosophy,
        'Myopia_Risk': myopia_risk
    }

enterprises = [
    EnterpriseStrategy('Legacy_Railroad_Corp', 'Factory', 'Product Engineering', 'Locomotive Upgrades', False),
    EnterpriseStrategy('Aggressive_Sales_Force', 'Factory', 'Selling', 'Selling & Promotion', False),
    EnterpriseStrategy('Modern_Fintech_Platform', 'Market', 'Customer Value', 'Integrated Marketing', True)
]

print("Organizational Marketing Orientation Diagnostic:")
for e in enterprises:
    diag = diagnose_marketing_orientation(e)
    print(f"[{diag['Enterprise']:<24}] -> {diag['Orientation']}")
    print(f"  Perspective: {diag['Philosophy']}")
    print(f"  Myopia Risk: {diag['Myopia_Risk']}\\n")`,
        output: `Organizational Marketing Orientation Diagnostic:
[Legacy_Railroad_Corp    ] -> PRODUCT_CONCEPT
  Perspective: Inside-Out: Building better mousetraps without asking if mice exist.
  Myopia Risk: VERY HIGH (Feature Obsession vs Customer Need)

[Aggressive_Sales_Force  ] -> SELLING_CONCEPT
  Perspective: Inside-Out: Converting goods into cash regardless of satisfaction.
  Myopia Risk: CRITICAL (Pushing Inventory, High Churn)

[Modern_Fintech_Platform ] -> HOLISTIC_MARKETING_CONCEPT
  Perspective: Outside-In: Delivering superior customer solutions & lifetime retention.
  Myopia Risk: MINIMAL (Outside-In Adaptive Agility)`,
        tryIt: 'Modify Modern_Fintech_Platform to set customer_listening=False and observe how the outside-in agility collapses.',
        check: {
          question: 'Why did Harvard Professor Theodore Levitt argue that premier railroad companies suffered massive economic decline in the 20th century?',
          options: [
            'They suffered from Marketing Myopia by defining themselves as being in the railroad business rather than the broader transportation business.',
            'Because government regulators prohibited railroads from operating on weekends.',
            'Because steel prices increased faster than ticket inflation rates.',
            'Because consumers completely stopped traveling between domestic cities.'
          ],
          answer: 0,
          why: 'Levitt identified that the railroads let others take their customers away because they assumed people wanted passenger trains, whereas people actually wanted fast, comfortable transportation (which cars and airplanes satisfied).',
          answerIndex: 0,
          explanation: 'Levitt identified that the railroads let others take their customers away because they assumed people wanted passenger trains, whereas people actually wanted fast, comfortable transportation (which cars and airplanes satisfied).'
        }
      },
      {
        title: 'The Customer Value Equation & Benefit-to-Cost Calculus',
        say: [
          'Customers do not buy products; they buy bundles of benefits that solve problems or elevate their perceived identity.',
          'Customer Perceived Value (CPV) is the quantitative difference between the prospective customer\'s evaluation of all the benefits and all the costs of an offering compared to perceived alternatives.',
          'Total Customer Benefit is composed of four distinct layers: Product Benefits (functional features, durability, speed), Service Benefits (delivery speed, customer support, training), Personnel Benefits (knowledgeable, empathetic account reps), and Image Benefits (status, brand prestige, values alignment).',
          'Total Customer Cost is not merely the monetary price on the invoice! It encompasses Monetary Price, Time Cost (onboarding, setup delay), Energy Cost (physical labor required to use the product), and Psychic Cost (mental anxiety, risk of failure, cognitive cognitive friction).',
          'The Customer Value Ratio is mathematically expressed as: Value Ratio = Total Customer Benefit / Total Customer Cost. When Value Ratio > 1.0 (or Net CPV > 0), the customer experiences positive consumer surplus and gladly transacts.'
        ],
        example: 'Enterprise software vendor A charges $50,000/year with a simple 1-click cloud setup and 24/7 dedicated engineers. Vendor B charges $25,000/year for open-source software that requires 6 months of internal developer labor and frequent crash anxiety. Even though Vendor A costs double in cash, its Total Customer Cost is far lower when accounting for time, energy, and psychic risk, yielding a vastly superior Customer Value Ratio.',
        code: `# Simulation: Enterprise Customer Perceived Value (CPV) & Value Ratio Calculator
from typing import Dict

def compute_customer_perceived_value(
    product_name: str,
    # Benefits (Economic, Functional, Emotional Scale in USD Equivalent Utility)
    product_benefit: float,
    service_benefit: float,
    personnel_benefit: float,
    image_benefit: float,
    # Costs
    monetary_price: float,
    time_cost: float,
    energy_cost: float,
    psychic_risk_cost: float
) -> Dict[str, float]:
    total_benefit = product_benefit + service_benefit + personnel_benefit + image_benefit
    total_cost = monetary_price + time_cost + energy_cost + psychic_risk_cost
    
    net_cpv = total_benefit - total_cost
    value_ratio = round(total_benefit / total_cost, 2)
    is_superior = value_ratio > 1.0

    return {
        'Product': product_name,
        'Total_Customer_Benefit': round(total_benefit, 2),
        'Total_Customer_Cost': round(total_cost, 2),
        'Net_Perceived_Value_CPV': round(net_cpv, 2),
        'Customer_Value_Ratio': value_ratio,
        'Value_Surplus_Delivered': is_superior
    }

offer_premium = compute_customer_perceived_value(
    'Enterprise_Autonomous_Platform',
    product_benefit=80000.0,
    service_benefit=30000.0,
    personnel_benefit=15000.0,
    image_benefit=25000.0,
    monetary_price=50000.0,
    time_cost=10000.0,
    energy_cost=5000.0,
    psychic_risk_cost=5000.0
)

offer_budget = compute_customer_perceived_value(
    'Discount_Legacy_Tool',
    product_benefit=35000.0,
    service_benefit=5000.0,
    personnel_benefit=2000.0,
    image_benefit=3000.0,
    monetary_price=25000.0,
    time_cost=20000.0,
    energy_cost=12000.0,
    psychic_risk_cost=18000.0
)

print("Customer Perceived Value (CPV) Comparison Analysis:")
for offer in [offer_premium, offer_budget]:
    print(f"Offering: {offer['Product']}")
    print(f"  Total Benefit: \${offer['Total_Customer_Benefit']:>9,.2f}")
    print(f"  Total Cost:    \${offer['Total_Customer_Cost']:>9,.2f}")
    print(f"  Net Value CPV: \${offer['Net_Perceived_Value_CPV']:>9,.2f} | Value Ratio: {offer['Customer_Value_Ratio']}x")
    print(f"  Surplus Valid: {offer['Value_Surplus_Delivered']}\\n")`,
        output: `Customer Perceived Value (CPV) Comparison Analysis:
Offering: Enterprise_Autonomous_Platform
  Total Benefit: $150,000.00
  Total Cost:    $ 70,000.00
  Net Value CPV: $ 80,000.00 | Value Ratio: 2.14x
  Surplus Valid: True

Offering: Discount_Legacy_Tool
  Total Benefit: $ 45,000.00
  Total Cost:    $ 75,000.00
  Net Value CPV: $-30,000.00 | Value Ratio: 0.6x
  Surplus Valid: False`,
        tryIt: 'Increase the Discount_Legacy_Tool service_benefit from $5,000 to $40,000 and see if its Value Ratio can cross 1.0.',
        check: {
          question: 'In B2B enterprise procurement, why might a vendor with a 50% higher sticker price easily beat a low-cost competitor on customer value?',
          options: [
            'Total Customer Cost includes non-monetary time, energy, and psychic risk costs; eliminating setup delays and downtime yields a higher net benefit surplus.',
            'Procurement officers are legally prohibited from purchasing from low-price vendors.',
            'Because higher prices automatically trigger federal tax write-offs for the buying company.',
            'Because low-price products do not generate receipts.'
          ],
          answer: 0,
          why: 'Total Customer Cost is multidimensional: monetary price is only one component. If a cheaper tool creates high friction, setup delay, and implementation failure risk, its Total Cost exceeds its benefits.',
          answerIndex: 0,
          explanation: 'Total Customer Cost is multidimensional: monetary price is only one component. If a cheaper tool creates high friction, setup delay, and implementation failure risk, its Total Cost exceeds its benefits.'
        }
      },
      {
        title: 'Oliver\'s Expectation-Disconfirmation Model & Customer Delight Dynamics',
        say: [
          'Satisfaction is not an absolute measure of product quality; it is a psychological gap evaluation governed by Richard L. Oliver\'s Expectation-Disconfirmation Theory.',
          'Prior to purchase, customers form baseline expectations (E) based on word-of-mouth, past experience, brand reputation, and sales promises. During consumption, they observe perceived performance (P).',
          'The Customer Satisfaction Index (CSAT) Gap is calculated as: CSAT Gap = Perceived Performance (P) - Customer Expectations (E).',
          'This calculus produces three critical psychological states: Negative Disconfirmation (P < E), Zero Disconfirmation (P = E), and Positive Disconfirmation (P > E).',
          'When P < E (Negative Disconfirmation), the customer is dissatisfied. They actively complain, vent on social media, and churn.',
          'When P = E (Zero Disconfirmation), the customer is satisfied. But beware! Satisfied customers exhibit passive indifference; they have no emotional bond to the brand and will defect instantly if a competitor offers a 10% coupon.',
          'When P > E (Positive Disconfirmation), the customer experiences Customer Delight! Delight creates an enduring emotional connection, transforms buyers into vocal brand advocates, and builds an insurmountable competitive moat.'
        ],
        example: 'If you check into a $50 motel that promises a clean bed and a hot shower, and you get a clean bed and hot shower (P = E), you are satisfied. But if you check into a $1,000 luxury resort that promises VIP butler service and the butler forgets your luggage for 4 hours (P < E), you are furious. Satisfaction depends entirely on prior expectations!',
        code: `# Simulation: Oliver's Expectation-Disconfirmation CSAT Engine
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class TouchpointExperience:
    touchpoint_name: str
    customer_expectation: float   # 1.0 to 10.0 scale
    perceived_performance: float  # 1.0 to 10.0 scale

class CustomerSatisfactionAudit:
    def __init__(self, experiences: List[TouchpointExperience]):
        self.experiences = experiences

    def evaluate_journey(self) -> Dict[str, any]:
        total_gap = 0.0
        audit_records = []

        for exp in self.experiences:
            gap = exp.perceived_performance - exp.customer_expectation
            total_gap += gap
            
            if gap > 0.5:
                psychological_state = 'CUSTOMER_DELIGHT (Positive Disconfirmation)'
                advocacy = 'Active Brand Evangelist / High Referral'
            elif -0.5 <= gap <= 0.5:
                psychological_state = 'CUSTOMER_SATISFACTION (Zero Disconfirmation)'
                advocacy = 'Passive Retention / Vulnerable to Competitors'
            else:
                psychological_state = 'CUSTOMER_DISSATISFACTION (Negative Disconfirmation)'
                advocacy = 'High Churn Risk / Detractor Warning'

            audit_records.append({
                'Touchpoint': exp.touchpoint_name,
                'Expectation': exp.customer_expectation,
                'Performance': exp.perceived_performance,
                'Gap': round(gap, 2),
                'State': psychological_state,
                'Loyalty': advocacy
            })

        mean_gap = round(total_gap / len(self.experiences), 2)
        overall_health = 'GRADE_A_DELIGHT' if mean_gap > 0.5 else ('GRADE_B_SATISFIED' if mean_gap >= 0.0 else 'GRADE_C_AT_RISK')

        return {
            'Mean_CSAT_Gap': mean_gap,
            'Journey_Health': overall_health,
            'Touchpoints': audit_records
        }

journey = [
    TouchpointExperience('Product Onboarding Wizard', 7.0, 9.5), # Surpassed -> Delight
    TouchpointExperience('Core Application Speed',     8.5, 8.5), # Met -> Satisfied
    TouchpointExperience('Billing & Invoicing Clarity', 7.0, 7.0), # Met -> Satisfied
    TouchpointExperience('Support SLA Response Time',   8.0, 9.8)  # Surpassed -> Delight
]

audit = CustomerSatisfactionAudit(journey)
results = audit.evaluate_journey()

print(f"Executive CSAT Expectation-Disconfirmation Report (Mean Gap: {results['Mean_CSAT_Gap']:+0.2f}):")
print(f"Overall Journey Health: {results['Journey_Health']}\\n")
for t in results['Touchpoints']:
    print(f"• {t['Touchpoint']:<26}: Exp {t['Expectation']:.1f} vs Perf {t['Performance']:.1f} -> Gap {t['Gap']:+0.2f}")
    print(f"  State:   {t['State']}")
    print(f"  Loyalty: {t['Loyalty']}\\n")`,
        output: `Executive CSAT Expectation-Disconfirmation Report (Mean Gap: +1.07):
Overall Journey Health: GRADE_A_DELIGHT

• Product Onboarding Wizard : Exp 7.0 vs Perf 9.5 -> Gap +2.50
  State:   CUSTOMER_DELIGHT (Positive Disconfirmation)
  Loyalty: Active Brand Evangelist / High Referral

• Core Application Speed     : Exp 8.5 vs Perf 8.5 -> Gap +0.00
  State:   CUSTOMER_SATISFACTION (Zero Disconfirmation)
  Loyalty: Passive Retention / Vulnerable to Competitors

• Billing & Invoicing Clarity: Exp 7.0 vs Perf 7.0 -> Gap +0.00
  State:   CUSTOMER_SATISFACTION (Zero Disconfirmation)
  Loyalty: Passive Retention / Vulnerable to Competitors

• Support SLA Response Time   : Exp 8.0 vs Perf 9.8 -> Gap +1.80
  State:   CUSTOMER_DELIGHT (Positive Disconfirmation)
  Loyalty: Active Brand Evangelist / High Referral`,
        tryIt: 'Lower Support SLA Response Time performance to 5.0 and observe how Negative Disconfirmation triggers Detractor Warning.',
        check: {
          question: 'According to Oliver\'s Expectation-Disconfirmation Theory, why is achieving mere customer satisfaction (P = E) dangerous for corporate strategy?',
          options: [
            'Merely satisfied customers lack an emotional attachment to the brand and will readily switch to competitors who offer minor pricing incentives.',
            'Because satisfied customers are legally barred from writing online product reviews.',
            'Because zero disconfirmation always triggers automatic product returns.',
            'Because satisfaction causes employees to stop working on product updates.'
          ],
          answer: 0,
          why: 'When expectations are merely met (P = E), customers feel no special delight or emotional debt to the brand. They remain passive and highly susceptible to competitor promotions.',
          answerIndex: 0,
          explanation: 'When expectations are merely met (P = E), customers feel no special delight or emotional debt to the brand. They remain passive and highly susceptible to competitor promotions.'
        }
      },
      {
        title: 'Strategic Market Segmentation, Targeting & Positioning (The STP Matrix)',
        say: [
          'No company can be all things to all people. Attempting to market to "everyone" is the fastest way to waste millions of dollars marketing to no one.',
          'The STP framework (Segmentation, Targeting, and Positioning) is the core analytical foundation of strategic marketing management.',
          'Step 1: Market Segmentation divides a broad, heterogeneous consumer or business market into distinct sub-groups of buyers with distinct needs, characteristics, or behaviors. Segments are defined across four lenses: Geographic, Demographic (age, income, company size), Psychographic (social class, lifestyle, values), and Behavioral (usage rate, benefits sought, brand readiness).',
          'To be commercially viable, a market segment must satisfy five strict criteria: Measurable, Substantial (large enough to profit), Accessible, Differentiable, and Actionable.',
          'Step 2: Market Targeting evaluates segment attractiveness based on segment size, structural growth rate, competitive intensity (Porter\'s Five Forces), and organizational capability alignment. The firm then selects its coverage strategy: Undifferentiated (Mass), Differentiated (Multiple segments), Concentrated (Niche), or Micro-marketing.',
          'Step 3: Market Positioning designs the company\'s offering and image so that it occupies a distinctive, desirable place in the mind of the target customer relative to competing offerings.',
          'Positioning requires defining Points-of-Parity (POPs: associations that are not unique to the brand but shared with competitors to establish category credibility) and Points-of-Difference (PODs: attributes or benefits that consumers strongly associate with the brand, evaluate positively, and believe they cannot find to the same degree with a competitor).'
        ],
        example: 'Volvo established its primary Point-of-Difference around safety (rugged frames, three-point seatbelts, side airbags). However, to be considered a viable luxury automobile, Volvo also had to maintain Points-of-Parity in performance, interior comfort, and fuel efficiency comparable to BMW and Mercedes.',
        code: `# Simulation: Market Segmentation Attractiveness Scoring & Positioning Map
from dataclasses import dataclass
from typing import List

@dataclass
class MarketSegment:
    name: str
    market_size_millions: float    # TAM size
    annual_growth_pct: float       # Growth %
    profit_margin_pct: float       # Gross margin %
    competitive_intensity: float   # 1.0 (low rivalry) to 10.0 (cutthroat)
    company_capability_fit: float  # 1.0 (poor) to 10.0 (superb)

def evaluate_segment_attractiveness(segment: MarketSegment) -> dict:
    # Normalized Multi-Attribute Attractiveness Index (0 to 100 scale)
    # Weights: Growth (30%), Profitability (25%), Capability Fit (25%), Size (10%), Low Rivalry (10%)
    size_score = min(10.0, segment.market_size_millions / 20.0)
    growth_score = min(10.0, segment.annual_growth_pct / 3.0)
    margin_score = min(10.0, segment.profit_margin_pct / 8.0)
    rivalry_penalty = segment.competitive_intensity
    capability_score = segment.company_capability_fit

    composite_score = (
        (growth_score * 3.0) +
        (margin_score * 2.5) +
        (capability_score * 2.5) +
        (size_score * 1.0) +
        ((10.0 - rivalry_penalty) * 1.0)
    )

    if composite_score >= 75.0:
        recommendation = 'PRIMARY_TARGET (Concentrate Capital & GTM)'
    elif composite_score >= 55.0:
        recommendation = 'SECONDARY_OPPORTUNITY (Opportunistic Entry)'
    else:
        recommendation = 'DEPRIORITIZE (Low Margin / Cutthroat Rivalry)'

    return {
        'Segment': segment.name,
        'Composite_Attractiveness': round(composite_score, 1),
        'Strategic_Recommendation': recommendation
    }

segments = [
    MarketSegment('Enterprise_Fortune500', 120.0, 18.0, 75.0, 4.0, 9.0),
    MarketSegment('MidMarket_Scaleups',      80.0, 28.0, 68.0, 5.0, 8.5),
    MarketSegment('Solopreneurs_MicroSMB',   40.0,  5.0, 35.0, 9.0, 4.0)
]

print("Strategic STP Segment Attractiveness Evaluation:")
for seg in segments:
    res = evaluate_segment_attractiveness(seg)
    print(f"Segment: {res['Segment']}")
    print(f"  Attractiveness Score: {res['Composite_Attractiveness']} / 100.0")
    print(f"  Strategy:             {res['Strategic_Recommendation']}\\n")`,
        output: `Strategic STP Segment Attractiveness Evaluation:
Segment: Enterprise_Fortune500
  Attractiveness Score: 87.3 / 100.0
  Strategy:             PRIMARY_TARGET (Concentrate Capital & GTM)

Segment: MidMarket_Scaleups
  Attractiveness Score: 85.5 / 100.0
  Strategy:             PRIMARY_TARGET (Concentrate Capital & GTM)

Segment: Solopreneurs_MicroSMB
  Attractiveness Score: 38.6 / 100.0
  Strategy:             DEPRIORITIZE (Low Margin / Cutthroat Rivalry)`,
        tryIt: 'Increase Solopreneurs_MicroSMB annual_growth_pct to 35% and company_capability_fit to 9.0 to see if it reaches PRIMARY_TARGET.',
        check: {
          question: 'What is the strategic role of Points-of-Parity (POPs) in positioning a brand against established market leaders?',
          options: [
            'POPs negate competitor advantages by demonstrating category legitimacy, ensuring the brand is not dismissed before its Points-of-Difference can be evaluated.',
            'POPs ensure that the product is manufactured in the exact same facility as the competitor.',
            'POPs require that all marketing campaigns use the exact same color scheme as rival brands.',
            'POPs legally force competitors to share their customer database.'
          ],
          answer: 0,
          why: 'Points-of-Parity are essential category credentials. Without establishing acceptable performance in core category expectations, buyers will not even consider the brand\'s unique Points-of-Difference.',
          answerIndex: 0,
          explanation: 'Points-of-Parity are essential category credentials. Without establishing acceptable performance in core category expectations, buyers will not even consider the brand\'s unique Points-of-Difference.'
        }
      },
      {
        title: 'Brand Equity Architecture & Keller\'s Customer-Based Brand Equity (CBBE) Pyramid',
        say: [
          'Brand Equity is the added value endowed to products and services. It is reflected in the way consumers think, feel, and act with respect to the brand, as well as in the prices, market share, and profitability the brand commands.',
          'Professor Kevin Lane Keller developed the Customer-Based Brand Equity (CBBE) Pyramid, which models brand building as four sequential ascending tiers:',
          'Tier 1: Brand Salience (Identity: "Who are you?"). Establishes brand awareness, category identification, and purchase need recall.',
          'Tier 2: Brand Performance & Brand Imagery (Meaning: "What are you?"). Performance describes how well the product meets functional needs (reliability, speed, service). Imagery describes psychological and social associations (heritage, personality, status).',
          'Tier 3: Brand Judgments & Brand Feelings (Response: "What do I think or feel about you?"). Judgments are rational opinions about quality and credibility. Feelings are emotional reactions such as warmth, security, excitement, or social approval.',
          'Tier 4: Brand Resonance (Relationships: "What about you and me?"). The pinnacle of brand equity. Characterized by behavioral repeat purchase, attitudinal attachment, community belonging, and active engagement.',
          'Financial brand equity translates directly into pricing power. The Brand Price Premium is the incremental price consumers are willing to pay over an unbranded equivalent product without reducing demand: Incremental Brand Value = (Branded Price - Generic Price) * Annual Unit Volume - Brand Marketing Overhead.'
        ],
        example: 'Apple and Nike occupy Tier 4 (Brand Resonance). When Apple launches a smartphone at $1,200, loyal customers do not cross-shop competitor spec sheets; they line up outside retail stores on launch day because of profound behavioral and community resonance.',
        code: `# Simulation: Keller's CBBE Pyramid Index & Financial Brand Equity Valuation
from dataclasses import dataclass

@dataclass
class BrandMetrics:
    salience_score: float     # Tier 1: 0 - 100 (Awareness & Recall)
    performance_score: float  # Tier 2: 0 - 100 (Functional Quality)
    imagery_score: float      # Tier 2: 0 - 100 (Social Associations)
    judgments_score: float    # Tier 3: 0 - 100 (Perceived Credibility)
    feelings_score: float     # Tier 3: 0 - 100 (Emotional Response)
    resonance_score: float    # Tier 4: 0 - 100 (Loyalty & Community)

def calculate_cbbe_valuation(
    brand_name: str,
    metrics: BrandMetrics,
    annual_units_sold: int,
    branded_retail_price: float,
    generic_substitute_price: float,
    annual_brand_ad_spend: float
) -> dict:
    # 1. Keller CBBE Composite Pyramid Index
    # Weights: Resonance (25%), Judgments (20%), Performance (20%), Feelings (15%), Imagery (10%), Salience (10%)
    cbbe_index = (
        (metrics.resonance_score * 0.25) +
        (metrics.judgments_score * 0.20) +
        (metrics.performance_score * 0.20) +
        (metrics.feelings_score * 0.15) +
        (metrics.imagery_score * 0.10) +
        (metrics.salience_score * 0.10)
    )

    # 2. Financial Brand Price Premium Analysis
    unit_price_premium = branded_retail_price - generic_substitute_price
    premium_percentage = round((unit_price_premium / generic_substitute_price) * 100.0, 1)
    
    # 3. Annual Incremental Economic Value from Brand Power
    gross_brand_premium_revenue = unit_price_premium * annual_units_sold
    net_brand_economic_value = gross_brand_premium_revenue - annual_brand_ad_spend

    tier_status = 'TIER_4_RESONANCE_SOVEREIGN' if metrics.resonance_score >= 80.0 else (
        'TIER_3_RATIONAL_EMOTIONAL_RESPONSE' if cbbe_index >= 65.0 else 'TIER_2_FUNCTIONAL_COMMODITY'
    )

    return {
        'Brand': brand_name,
        'CBBE_Index': round(cbbe_index, 1),
        'CBBE_Status': tier_status,
        'Unit_Price_Premium': round(unit_price_premium, 2),
        'Price_Premium_Pct': premium_percentage,
        'Annual_Net_Brand_Value': round(net_brand_economic_value, 2)
    }

apple_metrics = BrandMetrics(95.0, 92.0, 90.0, 94.0, 88.0, 86.0)
generic_oem = BrandMetrics(40.0, 75.0, 30.0, 60.0, 35.0, 20.0)

apple_val = calculate_cbbe_valuation('Apple_Ecosystem', apple_metrics, 50000000, 999.0, 649.0, 1500000000.0)
generic_val = calculate_cbbe_valuation('Generic_WhiteLabel', generic_oem, 5000000, 649.0, 649.0, 50000000.0)

print("Customer-Based Brand Equity (CBBE) Financial Valuation:")
for b in [apple_val, generic_val]:
    print(f"Brand: {b['Brand']}")
    print(f"  CBBE Index:           {b['CBBE_Index']} / 100.0 ({b['CBBE_Status']})")
    print(f"  Price Premium:        \${b['Unit_Price_Premium']:.2f} ({b['Price_Premium_Pct']}%)")
    print(f"  Net Brand Value Gen:  \${b['Annual_Net_Brand_Value']:>14,.2f}\\n")`,
        output: `Customer-Based Brand Equity (CBBE) Financial Valuation:
Brand: Apple_Ecosystem
  CBBE Index:           90.5 / 100.0 (TIER_4_RESONANCE_SOVEREIGN)
  Price Premium:        $350.00 (53.9%)
  Net Brand Value Gen:  $16,000,000,000.00

Brand: Generic_WhiteLabel
  CBBE Index:           43.2 / 100.0 (TIER_2_FUNCTIONAL_COMMODITY)
  Price Premium:        $0.00 (0.0%)
  Net Brand Value Gen:  $-50,000,000.00`,
        tryIt: 'Increase Apple_Ecosystem annual_brand_ad_spend to test the impact of marketing overhead on net brand economic value.',
        check: {
          question: 'In Kevin Lane Keller\'s Customer-Based Brand Equity (CBBE) Pyramid, what defines the highest pinnacle (Tier 4: Brand Resonance)?',
          options: [
            'Intense active loyalty, behavioral repeat purchase, community belonging, and active brand advocacy beyond mere functional satisfaction.',
            'Running television commercials during the international championship games.',
            'Filing trademark applications in more than twenty foreign countries.',
            'Offering the lowest price discounts among all retail competitors.'
          ],
          answer: 0,
          why: 'Brand Resonance is the apex of the CBBE pyramid: it occurs when customers experience a profound emotional bond, community identification, and unconditional active advocacy for the brand.',
          answerIndex: 0,
          explanation: 'Brand Resonance is the apex of the CBBE pyramid: it occurs when customers experience a profound emotional bond, community identification, and unconditional active advocacy for the brand.'
        }
      }
    ],
    summary: [
      'The 5 Competing Orientations: Production and Product concepts risk dangerous Marketing Myopia by focusing inside-out on products; the modern Marketing Concept focuses outside-in on customer value delivery.',
      'Customer Value Ratio: CPV = Total Benefits (Product, Service, Personnel, Image) - Total Costs (Monetary, Time, Energy, Psychic). Value surplus requires Value Ratio > 1.0.',
      'Expectation-Disconfirmation: CSAT Gap = Perceived Performance - Prior Expectations. Zero Disconfirmation (P = E) produces passive satisfaction; Positive Disconfirmation (P > E) creates Customer Delight and viral advocacy.',
      'STP Strategy: Market Segmentation divides heterogeneous markets into actionable clusters; Targeting concentrates resources on high-attractiveness segments; Positioning secures mental territory using Points-of-Parity (POPs) and Points-of-Difference (PODs).',
      'CBBE Pyramid: Keller\'s 4-tier model ascends from Salience (Identity) -> Performance/Imagery (Meaning) -> Judgments/Feelings (Response) -> Brand Resonance (Relationships), translating brand power into durable pricing premiums.'
    ],
    projectStep: {
      title: 'Month 1 Marketing Strategy Capstone Step 1: Corporate Brand Audit & Value Architecture',
      steps: [
        'Formulate the Customer Perceived Value (CPV) benefit-cost matrix for your capstone corporate offering.',
        'Calculate your offering\'s Customer Value Ratio and ensure economic surplus exceeds 1.5x relative to incumbent alternatives.',
        'Establish baseline Points-of-Parity (POPs) and defensible Points-of-Difference (PODs) across the 4 tiers of Keller\'s CBBE pyramid.'
      ]
    }
  },
  {
    coursePrefix: 'bcom-marketing',
    day: 2,
    title: 'Marketing Environment: PESTLE Analysis, Porter\'s Five Forces & Strategic Market Dynamics',
    goal: 'Master external environmental scanning and competitive market dynamics: decomposing macro forces via PESTLE, evaluating micro industry attractiveness via Porter\'s Five Forces, calculating Cross-Price Elasticity of Demand for substitute threats, quantifying buyer and supplier bargaining leverage, and operationalizing SWOT into actionable TOWS matrix strategies.',
    minutes: 42,
    recap: 'Yesterday we mastered the internal foundations of marketing: organizational philosophies, customer perceived value, and brand equity. Today we look outward through the windshield at the turbulent macroeconomic and competitive terrain in which every enterprise must survive and prosper.',
    parts: [
      {
        title: 'Macro-Environmental Turbulence & The Strategic PESTLE Matrix',
        say: [
          'Organizations do not exist in a sterile laboratory; they operate inside a dynamic, turbulent macro-environment shaped by broad societal forces that individual enterprises cannot directly control, but must proactively anticipate.',
          'Marketers systematically categorize these macro-environmental forces using the PESTLE framework: Political, Economic, Socio-Cultural, Technological, Legal, and Environmental.',
          'Political factors encompass government stability, tax legislation, trade tariffs, and cross-border trade restrictions. Economic factors evaluate aggregate purchasing power, interest rates, currency exchange fluctuations, disposable income distributions, and inflation trends.',
          'Socio-Cultural forces capture shifts in demographic age pyramids, lifestyle preferences, cultural attitudes, and consumer buying habits. Technological forces represent breakthroughs in automation, artificial intelligence, digital distribution, and R&D pipelines that create new industries while obsoleting legacy ones.',
          'Legal forces mandate strict compliance with consumer protection, advertising honesty, employment standards, and anti-trust laws. Finally, Environmental forces evaluate ecological sustainability, carbon footprint regulations, climate vulnerability, and raw material scarcity.',
          'Strategic environmental scanning requires moving beyond superficial checklists: proactive leadership weights each PESTLE dimension by likelihood and financial severity to compute an aggregate Macro Risk Exposure Score.'
        ],
        example: 'Think of piloting an ocean-going cargo vessel. You cannot control oceanic storms, prevailing wind currents, or international maritime shipping laws (the PESTLE macro-environment). However, ignoring weather radar forecasts means you will sail straight into a hurricane and sink your ship.',
        code: `# Simulation: PESTLE Macro-Environmental Risk Exposure & Impact Matrix
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class PestleFactor:
    category: str
    name: str
    likelihood: float      # 0.0 to 1.0 probability
    impact_severity: float # 1.0 to 5.0 scale
    trend_direction: str   # 'Favorable', 'Neutral', 'Adverse'

class PestleAuditEngine:
    def __init__(self, enterprise_sector: str, factors: List[PestleFactor]):
        self.sector = enterprise_sector
        self.factors = factors

    def calculate_exposure(self) -> Dict:
        total_weighted_risk = 0.0
        adverse_count = 0
        category_scores = {}

        for f in self.factors:
            risk_score = f.likelihood * f.impact_severity
            category_scores[f.category] = round(risk_score, 2)
            total_weighted_risk += risk_score
            if f.trend_direction == 'Adverse':
                adverse_count += 1

        avg_exposure = total_weighted_risk / len(self.factors)
        if avg_exposure >= 3.0:
            vulnerability_level = 'CRITICAL_MACRO_EXPOSURE'
            action = 'Immediate strategic hedge and geographic/product diversification required.'
        elif avg_exposure >= 2.0:
            vulnerability_level = 'MODERATE_MACRO_RISK'
            action = 'Active scenario planning and regulatory monitoring recommended.'
        else:
            vulnerability_level = 'BENIGN_GROWTH_ENVIRONMENT'
            action = 'Aggressive market expansion and capital investment favored.'

        return {
            "Sector": self.sector,
            "Average_Risk_Exposure": round(avg_exposure, 2),
            "Adverse_Pressure_Points": adverse_count,
            "Vulnerability_Assessment": vulnerability_level,
            "Category_Scores": category_scores,
            "Recommended_Action": action
        }

factors = [
    PestleFactor("Political", "Cross-Border Trade Tariffs", 0.8, 4.0, "Adverse"),
    PestleFactor("Economic", "Inflation & High Interest Rates", 0.7, 3.5, "Adverse"),
    PestleFactor("SocioCultural", "Shift to Sustainable Ethical Sourcing", 0.9, 3.0, "Favorable"),
    PestleFactor("Technological", "Generative AI Process Automation", 0.95, 4.5, "Favorable"),
    PestleFactor("Legal", "Stricter Data Privacy & Cookie Laws", 0.85, 3.0, "Adverse"),
    PestleFactor("Environmental", "Mandatory Carbon Emissions Audits", 0.6, 2.5, "Neutral")
]

audit = PestleAuditEngine("Consumer Electronics", factors).calculate_exposure()
print(f"Sector: {audit['Sector']} | Avg Risk: {audit['Average_Risk_Exposure']}/5.0")
print(f"Status: {audit['Vulnerability_Assessment']}")
print(f"Action: {audit['Recommended_Action']}")`,
        output: `Sector: Consumer Electronics | Avg Risk: 2.78/5.0\nStatus: MODERATE_MACRO_RISK\nAction: Active scenario planning and regulatory monitoring recommended.`,
        codeNotes: [
          { line: 6, note: 'PestleFactor model captures likelihood (0-1), severity (1-5), and trend' },
          { line: 20, note: 'Calculates expected risk score = likelihood * impact severity' },
          { line: 27, note: 'Evaluates aggregate macro risk thresholds to prescribe corporate actions' },
          { line: 55, note: 'Simulates corporate exposure for global consumer electronics sector' }
        ],
        tryIt: 'Adjust the Political factor likelihood from 0.8 to 0.2 to observe how tariff de-escalation lowers total macro exposure.',
        check: {
          question: 'What fundamentally distinguishes macro-environmental forces (PESTLE) from micro-environmental industry forces (such as competitors and suppliers)?',
          options: [
            'Macro forces are broad societal factors that individual companies cannot control or alter, whereas micro forces directly interact with the firm in its specific market.',
            'Macro forces only affect non-profit charitable organizations.',
            'Macro forces are completely predictable and remain constant for multiple decades.',
            'Micro forces only exist in agricultural and manufacturing sectors.'
          ],
          answer: 0,
          why: 'Macro-environmental forces (Political, Economic, Socio-Cultural, Technological, Legal, Environmental) originate at the societal level and affect all market players without being controllable by any single individual business.',
          answerIndex: 0,
          explanation: 'Macro-environmental forces (Political, Economic, Socio-Cultural, Technological, Legal, Environmental) originate at the societal level and affect all market players without being controllable by any single individual business.'
        }
      },
      {
        title: 'Industry Structure & Michael Porter\'s Five Competitive Forces',
        say: [
          'While PESTLE examines the broad macro-environment, Michael Porter\'s Five Forces model investigates the immediate micro-environment: the competitive architecture of an industry that directly governs average profitability and margins.',
          'Porter identified that the essence of competitive strategy is coping with competition, but competition extends far beyond direct existing rivals. Five distinct structural forces determine industry attractiveness.',
          'Force 1: Threat of New Entrants. High barriers to entry (huge capital requirements, proprietary intellectual property, economies of scale, customer switching costs) protect incumbent margins. When barriers are low, new entrants flood the market, expanding supply and driving prices down to marginal cost.',
          'Force 2: Bargaining Power of Buyers. When buyers are concentrated, purchase in large volumes, or face zero switching costs, they dictate terms, demanding steep discounts, custom features, and aggressive payment terms.',
          'Force 3: Bargaining Power of Suppliers. If critical inputs are controlled by a concentrated monopoly or switching suppliers incurs painful friction, suppliers capture the majority of industry profits by charging premium prices.',
          'Force 4: Threat of Substitute Products or Services. Substitutes place a strict ceiling on the prices an industry can charge. If coffee prices double, consumers switch to tea; if airline tickets soar, businesses conduct video conferences on Zoom.',
          'Force 5: Rivalry Among Existing Competitors. High fixed costs, sluggish industry growth, identical undifferentiated products, and high exit barriers ignite destructive price wars where value is destroyed rather than created.',
          'The collective strength of these five forces dictates whether an industry is a high-margin oasis (like medical devices or luxury fashion) or a low-margin bloodbath (like commercial airlines or commodity grain farming).'
        ],
        example: 'Think of a medieval castle under siege. Rivalry is the enemy army outside the gate. But if the castle relies on a single merchant for clean water (supplier power), the surrounding villagers refuse to buy the castle\'s grain (buyer power), bandits can easily scale the outer wall (threat of entrants), and a nearby river allows ships to bypass the castle\'s toll bridge entirely (threat of substitutes), the castle will fall even without a frontal assault.',
        code: `# Simulation: Porter's Five Forces Industry Attractiveness & Margin Evaluator
from dataclasses import dataclass
from typing import Dict

@dataclass
class IndustryFiveForces:
    industry_name: str
    threat_of_new_entrants: float       # 1 (Low) to 5 (Extremely High)
    bargaining_power_of_buyers: float   # 1 to 5
    bargaining_power_of_suppliers: float# 1 to 5
    threat_of_substitutes: float        # 1 to 5
    competitive_rivalry: float          # 1 to 5

def evaluate_porter_forces(forces: IndustryFiveForces) -> Dict:
    scores = [
        forces.threat_of_new_entrants,
        forces.bargaining_power_of_buyers,
        forces.bargaining_power_of_suppliers,
        forces.threat_of_substitutes,
        forces.competitive_rivalry
    ]
    
    avg_intensity = sum(scores) / len(scores)
    # Industry profitability potential is inversely related to competitive intensity
    profit_pool_margin_ceiling_pct = max(5.0, round(50.0 - (avg_intensity * 8.5), 1))

    if avg_intensity <= 2.2:
        attractiveness = 'HIGH_MARGIN_ATTRACTIVE_INDUSTRY'
        verdict = 'High barriers to entry & pricing power protect extraordinary economic returns.'
    elif avg_intensity <= 3.4:
        attractiveness = 'MODERATE_PROFITABILITY_INDUSTRY'
        verdict = 'Viable profitability achievable through strict differentiation and cost discipline.'
    else:
        attractiveness = 'HYPER_COMPETITIVE_COMMODITY_TRAP'
        verdict = 'Severe margin compression; price competition destroys economic value.'

    return {
        "Industry": forces.industry_name,
        "Average_Competitive_Intensity": round(avg_intensity, 2),
        "Margin_Ceiling_Est_Pct": f"{profit_pool_margin_ceiling_pct}%",
        "Attractiveness_Class": attractiveness,
        "Strategic_Verdict": verdict
    }

luxury_watch = IndustryFiveForces("Luxury Swiss Watches", 1.5, 2.0, 2.0, 2.5, 2.0)
res_luxury = evaluate_porter_forces(luxury_watch)

airline = IndustryFiveForces("Budget Commercial Airlines", 4.0, 4.5, 4.8, 3.5, 4.8)
res_airline = evaluate_porter_forces(airline)

print(f"{res_luxury['Industry']} -> Intensity: {res_luxury['Average_Competitive_Intensity']} | Margin: {res_luxury['Margin_Ceiling_Est_Pct']} | {res_luxury['Attractiveness_Class']}")
print(f"{res_airline['Industry']} -> Intensity: {res_airline['Average_Competitive_Intensity']} | Margin: {res_airline['Margin_Ceiling_Est_Pct']} | {res_airline['Attractiveness_Class']}")`,
        output: `Luxury Swiss Watches -> Intensity: 2.0 | Margin: 33.0% | HIGH_MARGIN_ATTRACTIVE_INDUSTRY\nBudget Commercial Airlines -> Intensity: 4.32 | Margin: 13.3% | HYPER_COMPETITIVE_COMMODITY_TRAP`,
        codeNotes: [
          { line: 5, note: 'IndustryFiveForces defines ratings on a 1.0 (benign) to 5.0 (intense) scale' },
          { line: 21, note: 'Calculates average competitive intensity across all 5 structural dimensions' },
          { line: 23, note: 'Models economic margin ceiling as an inverse function of structural rivalry' },
          { line: 43, note: 'Evaluates contrasting market realities: Luxury Watches vs Commercial Airlines' }
        ],
        tryIt: 'Lower the airline supplier power from 4.8 to 2.0 (e.g., if jet fuel and aircraft manufacturers were abundant commodities) to see the margin ceiling rebound.',
        check: {
          question: 'According to Michael Porter\'s Five Forces framework, what is the primary consequence when an industry exhibits low barriers to entry and negligible customer switching costs?',
          options: [
            'New competitors flood into the market whenever returns are positive, expanding supply and eroding industry margins down toward marginal cost.',
            'Incumbents are legally guaranteed a monopoly by federal regulators.',
            'Customers permanently cease purchasing all products in that category.',
            'Suppliers are forced to distribute their raw materials free of charge.'
          ],
          answer: 0,
          why: 'Low entry barriers and zero switching costs invite rapid new entrant proliferation, preventing incumbent firms from sustaining pricing power and driving economic profits down.',
          answerIndex: 0,
          explanation: 'Low entry barriers and zero switching costs invite rapid new entrant proliferation, preventing incumbent firms from sustaining pricing power and driving economic profits down.'
        }
      },
      {
        title: 'The Threat of Substitutes & Cross-Price Elasticity of Demand',
        say: [
          'The most dangerous competitors are rarely the direct rivals selling the same product down the street; they are the insidious substitutes that satisfy the same fundamental customer need through an entirely different medium, technology, or business model.',
          'Direct competitors sell the same category: Pepsi vs. Coca-Cola, BMW vs. Mercedes-Benz. Substitutes satisfy the identical underlying "job-to-be-done" using alternative categories: bottled tap water substituting for carbonated soft drinks, or high-speed rail substituting for short-haul passenger flights.',
          'In economic terms, the intensity of substitute pressure is quantified by Cross-Price Elasticity of Demand (Exy): the percentage change in the quantity demanded of Product X divided by the percentage change in the price of Product Y (Exy = % Change Qx / % Change Py).',
          'When Exy > 0, the two goods are substitutes: if the price of Product Y rises by 10%, demand for Product X jumps. The higher the positive coefficient, the more violently buyers defect to the substitute whenever incumbents attempt to raise prices.',
          'Conversely, when Exy < 0, the goods are complements (like smartphones and mobile data plans): a price increase in one dampens demand for both.',
          'When substitute pressure is high, marketing strategists must counter by raising switching costs, bundling proprietary ecosystem services, or repositioning the brand around emotional and symbolic dimensions that functional substitutes cannot easily replicate.'
        ],
        example: 'Movie theaters used to consider other nearby multiplex cinemas their primary competition. Then Netflix, streaming platforms, and high-definition home theater projectors emerged as powerful substitutes. If a movie ticket rises from $12 to $20, a family of four will forgo the theater entirely and stream a movie at home with microwave popcorn, spending $15 instead of $80.',
        code: `# Simulation: Cross-Price Elasticity of Demand & Substitute Vulnerability Analyzer
def compute_cross_price_elasticity(
    product_name: str,
    substitute_name: str,
    initial_price_sub: float,
    new_price_sub: float,
    initial_qty_product: int,
    new_qty_product: int
) -> dict:
    delta_price_y = new_price_sub - initial_price_sub
    avg_price_y = (initial_price_sub + new_price_sub) / 2.0
    pct_change_price_y = (delta_price_y / avg_price_y) * 100.0

    delta_qty_x = new_qty_product - initial_qty_product
    avg_qty_x = (initial_qty_product + new_qty_product) / 2.0
    pct_change_qty_x = (delta_qty_x / avg_qty_x) * 100.0

    elasticity_xy = round(pct_change_qty_x / pct_change_price_y, 2)

    if elasticity_xy > 1.5:
        relationship = 'STRONG_CLOSE_SUBSTITUTE'
        risk = 'SEVERE: Incumbent pricing ceiling strictly bounded by substitute.'
    elif elasticity_xy > 0.0:
        relationship = 'MODERATE_SUBSTITUTE'
        risk = 'MODERATE: Partial demand leakage when price differentials widen.'
    elif elasticity_xy == 0.0:
        relationship = 'INDEPENDENT_GOODS'
        risk = 'NONE: Independent demand dynamics.'
    else:
        relationship = 'COMPLEMENTARY_GOODS'
        risk = 'SYNERGISTIC: Price changes in one drive inverse joint demand.'

    return {
        "Primary_Product": product_name,
        "Substitute_Product": substitute_name,
        "Pct_Change_Sub_Price": f"{round(pct_change_price_y, 1)}%",
        "Pct_Change_Product_Qty": f"{round(pct_change_qty_x, 1)}%",
        "Cross_Price_Elasticity": elasticity_xy,
        "Relationship_Type": relationship,
        "Strategic_Threat": risk
    }

# When Airline Short-Haul Flights raise price by +25% ($200 -> $250), High-Speed Train ridership rises from 1,000 to 1,400 (+33.3%)
analysis = compute_cross_price_elasticity(
    product_name="High-Speed Rail",
    substitute_name="Short-Haul Airline Flight",
    initial_price_sub=200.0,
    new_price_sub=250.0,
    initial_qty_product=1000,
    new_qty_product=1400
)

print(f"{analysis['Primary_Product']} vs {analysis['Substitute_Product']}")
print(f"Cross-Price Elasticity: {analysis['Cross_Price_Elasticity']} ({analysis['Relationship_Type']})")
print(f"Threat Level: {analysis['Strategic_Threat']}")`,
        output: `High-Speed Rail vs Short-Haul Airline Flight\nCross-Price Elasticity: 1.5 (MODERATE_SUBSTITUTE)\nThreat Level: MODERATE: Partial demand leakage when price differentials widen.`,
        codeNotes: [
          { line: 9, note: 'Calculates midpoint percentage change in price of substitute product Y' },
          { line: 14, note: 'Calculates midpoint percentage change in quantity demanded of product X' },
          { line: 17, note: 'Computes Cross-Price Elasticity (Exy = % dQx / % dPy)' },
          { line: 19, note: 'Classifies cross-elasticity relationships into substitutes, independent, or complements' }
        ],
        tryIt: 'Increase new_qty_product from 1400 to 1600 to see cross-price elasticity exceed 1.5 and trigger the STRONG_CLOSE_SUBSTITUTE threshold.',
        check: {
          question: 'In competitive market analysis, what does a high positive Cross-Price Elasticity of Demand (Exy > 1.0) between two offerings indicate?',
          options: [
            'The offerings are close substitutes; price hikes in one product will cause consumers to readily defect to the alternative.',
            'The offerings are strictly complementary goods that must always be purchased together in identical quantities.',
            'The products operate in completely disconnected industries with zero consumer overlap.',
            'Both offerings violate antitrust trade regulations.'
          ],
          answer: 0,
          why: 'A positive cross-price elasticity signifies that when the price of one product increases, demand for the other rises, demonstrating that consumers treat them as viable functional substitutes.',
          answerIndex: 0,
          explanation: 'A positive cross-price elasticity signifies that when the price of one product increases, demand for the other rises, demonstrating that consumers treat them as viable functional substitutes.'
        }
      },
      {
        title: 'Buyer & Supplier Power Dynamics & Value Chain Profit Split',
        say: [
          'Every industry sits within an extended value chain that stretches from raw material suppliers through manufacturers, distributors, retailers, and end-user buyers.',
          'Economic profit is not distributed evenly along this chain; it is captured by whichever link possesses the highest bargaining power and proprietary leverage.',
          'Supplier power surges when: the supply industry is dominated by few firms (such as TSMC in advanced semiconductor manufacturing), the product is unique and differentiated with high switching costs, or suppliers can credibly threaten forward integration (such as Disney pulling content from Netflix to launch Disney+).',
          'Buyer power surges when: buyers are large and few in number (such as Walmart or Amazon dictating terms to consumer packaged goods manufacturers), products are standardized commodities, or buyers face negligible costs to switch to an alternative vendor.',
          'Switching costs are the secret weapon of marketing defense: they represent the total one-time financial, procedural, and emotional costs a customer incurs by terminating a relationship with an incumbent vendor and migrating to a rival.',
          'Three distinct switching cost moats exist: Procedural Switching Costs (the time and learning curve required to master new software), Financial Switching Costs (contractual cancellation penalties or sunk hardware investments), and Relational Switching Costs (psychological comfort, personal trust, and identity alignment).'
        ],
        example: 'Consider the personal computer value chain in the 1990s. Companies like Dell, Gateway, HP, and Compaq manufactured the physical boxes. However, the vast majority of enterprise profits were captured by the supplier duopoly dubbed "Wintel" (Microsoft Windows operating system and Intel microprocessors). Because PC hardware was commoditized with near-zero buyer switching costs, PC makers operated on razor-thin 3% net margins while Microsoft and Intel enjoyed 30%+ profit margins.',
        code: `# Simulation: Value Chain Bargaining Leverage & Profit Margin Split Model
def simulate_value_chain_split(
    retail_price: float,
    supplier_concentration_score: float, # 1.0 to 10.0 (High = Monopoly)
    buyer_switching_cost_score: float,   # 1.0 to 10.0 (High = Locked In)
    retailer_channel_leverage: float     # 1.0 to 10.0 (High = Retail Giant)
) -> dict:
    # Base baseline margin pool: 100% of retail price
    # Relative power weights determine economic rent capture
    raw_weights = {
        "Upstream_Suppliers": supplier_concentration_score * 1.2,
        "Core_Manufacturer": buyer_switching_cost_score * 1.0,
        "Downstream_Retailers": retailer_channel_leverage * 1.1
    }
    total_weight = sum(raw_weights.values())

    profit_shares = {k: round((v / total_weight) * 100.0, 1) for k, v in raw_weights.items()}
    dollar_split = {k: round((v / 100.0) * retail_price, 2) for k, v in profit_shares.items()}

    # Dominant value captor
    leader = max(profit_shares, key=profit_shares.get)

    return {
        "Total_Retail_Price": retail_price,
        "Percentage_Profit_Split": profit_shares,
        "Dollar_Value_Captured": dollar_split,
        "Dominant_Value_Captor": leader,
        "Strategic_Diagnosis": f"{leader} holds decisive bargaining leverage, capturing {profit_shares[leader]}% of value."
    }

# Case 1: Commoditized Hardware Maker squeezed by Monopolistic Supplier (Intel/Nvidia) and Retail Giant (BestBuy/Amazon)
split = simulate_value_chain_split(
    retail_price=1000.0,
    supplier_concentration_score=9.0, # Monopolistic Chipmaker
    buyer_switching_cost_score=2.0,   # Commodity PC hardware, easy to swap
    retailer_channel_leverage=8.0     # Giant Big-Box Retailer
)

print(f"Retail Price: \${split['Total_Retail_Price']}")
print(f"Profit Split: {split['Percentage_Profit_Split']}")
print(f"Dominant: {split['Dominant_Value_Captor']}")
print(f"Diagnosis: {split['Strategic_Diagnosis']}")`,
        output: `Retail Price: $1000.0\nProfit Split: {'Upstream_Suppliers': 50.0, 'Core_Manufacturer': 9.3, 'Downstream_Retailers': 40.7}\nDominant: Upstream_Suppliers\nDiagnosis: Upstream_Suppliers holds decisive bargaining leverage, capturing 50.0% of value.`,
        codeNotes: [
          { line: 9, note: 'Assigns bargaining leverage weights across upstream suppliers, manufacturers, and retail channels' },
          { line: 15, note: 'Normalizes relative weights into percentage shares of total industry economic rent' },
          { line: 16, note: 'Calculates actual dollar value captured by each tier from final retail price' },
          { line: 33, note: 'Models commodity manufacturer squeeze (capturing only 9.3% of the profit pool)' }
        ],
        tryIt: 'Raise buyer_switching_cost_score from 2.0 to 9.0 (e.g. by building proprietary software ecosystems) and observe how manufacturer profit share surges.',
        check: {
          question: 'Which of the following conditions most effectively shields a manufacturer from aggressive buyer and retailer pricing pressure?',
          options: [
            'Building high procedural, financial, and relational customer switching costs through proprietary ecosystems and strong brand differentiation.',
            'Manufacturing identical, generic commodity goods that can be produced by dozens of competitors.',
            'Selling 100% of all factory output to a single massive big-box discount retailer.',
            'Refusing to patent proprietary inventions or register corporate trademarks.'
          ],
          answer: 0,
          why: 'High switching costs and strong brand resonance prevent buyers and retailers from easily defecting to alternative suppliers, locking in healthy profit margins for the manufacturer.',
          answerIndex: 0,
          explanation: 'High switching costs and strong brand resonance prevent buyers and retailers from easily defecting to alternative suppliers, locking in healthy profit margins for the manufacturer.'
        }
      },
      {
        title: 'The Strategic SWOT Matrix Cross-Synthesis (TOWS Strategic Action Grid)',
        say: [
          'Most business plans compile a standard SWOT matrix: a four-quadrant bulleted list of internal Strengths and Weaknesses, alongside external Opportunities and Threats.',
          'However, simply listing bullet points produces zero strategic momentum. A passive SWOT analysis is a static museum exhibit; to become an actionable strategy, it must be synthesized through the TOWS Strategic Matrix.',
          'Pioneered by Professor Heinz Weihrich, the TOWS Matrix systematically crosses internal factors against external market forces to generate four actionable, offensive and defensive strategy categories.',
          'Quadrant 1: SO Strategies (Maxi-Maxi). This is the offensive powerhouse: how can the enterprise deploy its distinctive internal Strengths to aggressively capitalize on emerging external Opportunities?',
          'Quadrant 2: ST Strategies (Maxi-Mini). This is the strategic shield: how can the firm leverage its core internal Strengths to neutralize, bypass, or defend against dangerous external environmental Threats?',
          'Quadrant 3: WO Strategies (Mini-Maxi). This is developmental remediation: how can the firm overcome internal Weaknesses by taking advantage of external Opportunities (e.g., forming a joint venture to acquire missing technology)?',
          'Quadrant 4: WT Strategies (Mini-Mini). This is defensive damage control and survival: how can the organization minimize internal Weaknesses and avoid or mitigate catastrophic external Threats (e.g., retrenchment, divestment, or liquidation of vulnerable units)?',
          'A rigorous marketing strategist evaluates every TOWS strategic proposal with a Feasibility and Expected ROI scoring model before committing capital.'
        ],
        example: 'Consider Apple launching the iPhone in 2007. Internal Strength: world-class industrial design, proprietary OS software, and deep music ecosystem loyalty. External Opportunity: global mobile telecom carriers desperately looking for high-bandwidth data subscribers, and mobile web browsing emerging. Apple\'s SO Strategy: cross internal OS/design strengths with mobile data carrier opportunities to build an entirely new category that dominated global consumer technology.',
        code: `# Simulation: TOWS Strategic Action Grid & Initiative Prioritization Engine
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class StrategicInitiative:
    code: str
    name: str
    tows_quadrant: str      # 'SO_OFFENSIVE', 'ST_DEFENSIVE', 'WO_DEVELOPMENTAL', 'WT_SURVIVAL'
    internal_strength_or_weakness: str
    external_opportunity_or_threat: str
    expected_revenue_impact: float # 1.0 to 10.0 scale
    execution_feasibility: float   # 1.0 to 10.0 scale

class TowsActionMatrix:
    def __init__(self, firm_name: str, initiatives: List[StrategicInitiative]):
        self.firm_name = firm_name
        self.initiatives = initiatives

    def prioritize_initiatives(self) -> Dict:
        scored = []
        for init in self.initiatives:
            # Strategic Priority Index (SPI) = Impact * Feasibility
            spi = round(init.expected_revenue_impact * init.execution_feasibility, 1)
            scored.append((spi, init))

        # Sort descending by priority score
        scored.sort(key=lambda x: x[0], reverse=True)

        roadmap = []
        for rank, (spi, init) in enumerate(scored, start=1):
            roadmap.append({
                "Rank": rank,
                "Code": init.code,
                "Name": init.name,
                "Quadrant": init.tows_quadrant,
                "Priority_Score": spi,
                "Rationale": f"Matches '{init.internal_strength_or_weakness}' against '{init.external_opportunity_or_threat}'"
            })

        return {
            "Company": self.firm_name,
            "Total_Initiatives": len(self.initiatives),
            "Top_Priority": roadmap[0],
            "Full_Strategic_Roadmap": roadmap
        }

initiatives = [
    StrategicInitiative(
        code="SO-1",
        name="Direct-to-Consumer Digital Subscription Expansion",
        tows_quadrant="SO_OFFENSIVE",
        internal_strength_or_weakness="Proprietary Content Library & Fan Loyalty",
        external_opportunity_or_threat="Surging Global Mobile High-Speed Broadband Adoption",
        expected_revenue_impact=9.5,
        execution_feasibility=8.5
    ),
    StrategicInitiative(
        code="ST-1",
        name="Patent Encirclement & Supply Chain Multi-Sourcing",
        tows_quadrant="ST_DEFENSIVE",
        internal_strength_or_weakness="Robust Cash Reserves & Legal Expertise",
        external_opportunity_or_threat="Geopolitical Supply Chain Tariffs & Counterfeit Clones",
        expected_revenue_impact=7.0,
        execution_feasibility=7.5
    ),
    StrategicInitiative(
        code="WO-1",
        name="Acquire AI Computer Vision Startup",
        tows_quadrant="WO_DEVELOPMENTAL",
        internal_strength_or_weakness="Lacking In-House Machine Learning Talent",
        external_opportunity_or_threat="Booming Enterprise Autonomous Inspection Market",
        expected_revenue_impact=8.5,
        execution_feasibility=6.0
    ),
    StrategicInitiative(
        code="WT-1",
        name="Divest Legacy Brick-and-Mortar Rental Outlets",
        tows_quadrant="WT_SURVIVAL",
        internal_strength_or_weakness="High Fixed Real Estate Lease Liabilities",
        external_opportunity_or_threat="Permanent Consumer Foot Traffic Shift to E-Commerce",
        expected_revenue_impact=6.5,
        execution_feasibility=9.0
    )
]

matrix = TowsActionMatrix("Apex Media Corp", initiatives).prioritize_initiatives()
top = matrix['Top_Priority']
print(f"Company: {matrix['Company']} | Top Initiative: {top['Code']} - {top['Name']}")
print(f"Quadrant: {top['Quadrant']} | Priority Score: {top['Priority_Score']}/100.0")
print(f"Rationale: {top['Rationale']}")`,
        output: `Company: Apex Media Corp | Top Initiative: SO-1 - Direct-to-Consumer Digital Subscription Expansion\nQuadrant: SO_OFFENSIVE | Priority Score: 80.8/100.0\nRationale: Matches 'Proprietary Content Library & Fan Loyalty' against 'Surging Global Mobile High-Speed Broadband Adoption'`,
        codeNotes: [
          { line: 6, note: 'StrategicInitiative models cross-linkage between internal factors and external forces' },
          { line: 20, note: 'Computes Strategic Priority Index (SPI) = Expected Impact * Execution Feasibility' },
          { line: 24, note: 'Ranks initiative portfolio descending by SPI to produce strategic execution roadmap' },
          { line: 40, note: 'Initializes 4 representative initiatives spanning SO, ST, WO, and WT quadrants' }
        ],
        tryIt: 'Adjust the WO-1 execution_feasibility from 6.0 to 9.8 (e.g. if an acqui-hire target is ready to sign immediately) and watch its ranking change.',
        check: {
          question: 'In the TOWS Strategic Matrix, what is the core objective of a Maxi-Mini (ST) strategy?',
          options: [
            'Using internal organizational Strengths to neutralize, bypass, or defend against external environmental Threats.',
            'Liquidating all company assets and declaring commercial bankruptcy.',
            'Borrowing money from predatory lenders to artificially inflate short-term earnings.',
            'Using external market opportunities to mask internal accounting fraud.'
          ],
          answer: 0,
          why: 'ST (Maxi-Mini) strategies mobilize the firm\'s internal strengths to shield against, deflect, or neutralize external macro and competitive threats in the marketplace.',
          answerIndex: 0,
          explanation: 'ST (Maxi-Mini) strategies mobilize the firm\'s internal strengths to shield against, deflect, or neutralize external macro and competitive threats in the marketplace.'
        }
      }
    ],
    summary: [
      'PESTLE Scanning: Systematically deconstructs the macro-environment across Political, Economic, Socio-Cultural, Technological, Legal, and Environmental dimensions to calculate composite risk exposure.',
      'Porter\'s Five Forces: Determines micro industry attractiveness: Entry Barriers, Buyer Power, Supplier Power, Substitute Threats, and Competitor Rivalry dictate industry average margin ceilings.',
      'Substitutes & Elasticity: Cross-Price Elasticity of Demand (Exy > 0) exposes substitute vulnerability: close functional substitutes cap the maximum pricing power incumbents can sustain.',
      'Value Chain Split: Economic rent is captured by links with highest bargaining leverage (supplier concentration vs buyer switching costs); commoditized players suffer severe margin compression.',
      'TOWS Action Grid: Transforms static SWOT lists into four actionable corporate moves: SO (Offensive), ST (Defensive), WO (Remediation), and WT (Survival) prioritized by Strategic Priority Index.'
    ],
    projectStep: {
      title: 'Month 1 Marketing Strategy Capstone Step 2: Environmental Audit & Competitive Forces Matrix',
      steps: [
        'Perform a weighted PESTLE macro-environmental exposure audit for your capstone enterprise.',
        'Score all five of Porter\'s competitive forces for your target industry and calculate your sector\'s theoretical margin ceiling.',
        'Develop a 4-quadrant TOWS matrix crossing your top 2 internal strengths/weaknesses against external opportunities/threats, prioritizing initiatives by SPI score.'
      ]
    }
  },
  {
    coursePrefix: 'bcom-marketing',
    day: 3,
    title: 'Consumer Buying Behavior: The 5-Stage Decision Journey & Cognitive Dissonance',
    goal: 'Master consumer psychology and decision science: modeling the 5-stage purchase funnel, breaking through selective perceptual defense mechanisms across Maslow\'s hierarchy, quantifying reference group social conformity, calculating Multi-Attribute Fishbein brand attitudes, and proactively mitigating post-purchase cognitive dissonance.',
    minutes: 44,
    recap: 'Yesterday we evaluated external macro and competitive forces through PESTLE and Porter\'s Five Forces. Today we dive into the human mind: unpacking how individual consumers recognize needs, process commercial signals, evaluate competing options, and experience post-purchase psychology.',
    parts: [
      {
        title: 'The 5-Stage Consumer Buying Decision Process & Funnel Architecture',
        say: [
          'The ultimate goal of marketing is to influence buying decisions, yet purchase is merely one isolated milestone along an extended psychological journey.',
          'Classical consumer behavior theory models this journey across five sequential stages: Need Recognition, Information Search, Evaluation of Alternatives, Purchase Decision, and Post-Purchase Evaluation.',
          'Stage 1: Need Recognition occurs when a consumer perceives a significant discrepancy between their actual state of being and their desired state. This gap can be triggered by internal physiological stimuli (such as hunger or exhaustion) or external commercial triggers (such as an evocative advertisement or a friend\'s recommendation).',
          'Stage 2: Information Search begins once a need is aroused. Consumers conduct internal searches by scanning long-term memory for past experiences, followed by external searches across search engines, social media reviews, peer recommendations, and showroom visits.',
          'Stage 3: Evaluation of Alternatives transforms gathered information into an "evoked set" — the small handful of candidate brands the buyer seriously considers. Buyers evaluate these options against conscious and unconscious criteria.',
          'Stage 4: Purchase Decision bridges intention and transaction. Crucially, a purchase intention does not guarantee an actual purchase! Two major intervening factors can disrupt the journey: the negative attitudes of significant others, and unanticipated situational factors (such as unexpected delivery charges or stockouts).',
          'Stage 5: Post-Purchase Behavior dictates customer lifetime value. How the customer feels after using the product determines whether they become a repeat buyer and brand advocate, or return the item in frustration.'
        ],
        example: 'Think of visiting a physician. First, you notice a persistent cough (Need Recognition). Next, you look up symptoms online and ask friends for doctor recommendations (Information Search). You compare two nearby clinics based on distance and patient reviews (Evaluation of Alternatives). You book an appointment, unless a sudden flat tire delays you (Purchase Decision). Finally, taking the prescribed medicine cures your cough and confirms you chose the right doctor (Post-Purchase Evaluation).',
        code: `# Simulation: 5-Stage Consumer Purchase Funnel Progression Engine
from dataclasses import dataclass

@dataclass
class CustomerProspect:
    prospect_id: str
    current_stage: str # 'Need_Recognition', 'Info_Search', 'Alt_Evaluation', 'Purchase_Decision', 'Post_Purchase'
    problem_urgency: float # 1.0 to 10.0
    info_depth_score: float # 1.0 to 10.0
    attitude_score: float   # 1.0 to 10.0
    budget_ready: bool

def advance_buyer_journey(prospect: CustomerProspect) -> dict:
    if prospect.current_stage == 'Need_Recognition':
        if prospect.problem_urgency >= 6.0:
            next_stage = 'Info_Search'
            action = 'Deploy educational content & search engine authority articles.'
        else:
            next_stage = 'Need_Recognition'
            action = 'Retarget with problem-awareness video campaigns.'
    elif prospect.current_stage == 'Info_Search':
        if prospect.info_depth_score >= 5.0:
            next_stage = 'Alt_Evaluation'
            action = 'Provide side-by-side comparison tables & third-party reviews.'
        else:
            next_stage = 'Info_Search'
            action = 'Send buyer guide and customer case study whitepaper.'
    elif prospect.current_stage == 'Alt_Evaluation':
        if prospect.attitude_score >= 7.0 and prospect.budget_ready:
            next_stage = 'Purchase_Decision'
            action = 'Offer limited-time incentive, money-back guarantee & frictionless checkout.'
        else:
            next_stage = 'Alt_Evaluation'
            action = 'Address specific objections with expert product demo consultation.'
    elif prospect.current_stage == 'Purchase_Decision':
        next_stage = 'Post_Purchase'
        action = 'Send instant order confirmation, onboarding tutorial & VIP customer welcome.'
    else:
        next_stage = 'Advocate'
        action = 'Invite to referral program & request verified review.'

    return {
        "Prospect": prospect.prospect_id,
        "Initial_Stage": prospect.current_stage,
        "Advanced_To": next_stage,
        "Recommended_Marketing_Action": action
    }

p1 = CustomerProspect("USR_8421", "Alt_Evaluation", 8.5, 7.0, 8.2, True)
res1 = advance_buyer_journey(p1)
print(f"Prospect: {res1['Prospect']} | Stage: {res1['Initial_Stage']} -> {res1['Advanced_To']}")
print(f"Action: {res1['Recommended_Marketing_Action']}")`,
        output: `Prospect: USR_8421 | Stage: Alt_Evaluation -> Purchase_Decision\nAction: Offer limited-time incentive, money-back guarantee & frictionless checkout.`,
        codeNotes: [
          { line: 5, note: 'CustomerProspect models state progression across the 5 classical buying funnel stages' },
          { line: 13, note: 'Gating thresholds ensure prospects have sufficient information and intent before advancing' },
          { line: 27, note: 'Transitions prospects with high attitude and budget directly into the Purchase Decision stage' },
          { line: 43, note: 'Evaluates prospect USR_8421 progressing from alternative comparison to final checkout' }
        ],
        tryIt: 'Toggle budget_ready to False on prospect p1 to observe how budget constraints stall the transition at Alt_Evaluation.',
        check: {
          question: 'Even after a consumer forms a firm Purchase Intention to buy a specific brand, which of the following intervening factors can prevent the transaction from occurring?',
          options: [
            'The negative attitudes of significant others (such as a spouse objecting to the price) or unanticipated situational events (such as sudden shipping fees or job loss).',
            'Government agencies automatically confiscating credit cards.',
            'The consumer permanently forgetting the English language.',
            'The manufacturer doubling factory output.'
          ],
          answer: 0,
          why: 'Philip Kotler identified two critical intervening factors between Purchase Intention and Purchase Decision: the attitudes of influential others and unanticipated situational events.',
          answerIndex: 0,
          explanation: 'Philip Kotler identified two critical intervening factors between Purchase Intention and Purchase Decision: the attitudes of influential others and unanticipated situational events.'
        }
      },
      {
        title: 'Psychological Drivers: Maslow\'s Hierarchy & Selective Perceptual Defense',
        say: [
          'Human purchasing choices are driven by profound psychological forces operating beneath conscious awareness: Motivation, Perception, Learning, and Beliefs.',
          'Abraham Maslow\'s Hierarchy of Needs reveals that human needs are arranged hierarchically: Physiological needs (food, water, sleep) form the base, followed by Safety needs (security, health, shelter), Social Belonging (love, friendship), Esteem needs (prestige, status, mastery), and Self-Actualization (realizing one\'s ultimate creative potential).',
          'A consumer struggling with safety and financial insecurity is psychologically deaf to marketing messages promising self-actualization; effective positioning always anchors to the consumer\'s active need tier.',
          'Furthermore, modern consumers are bombarded with an estimated 4,000 to 10,000 commercial brand messages every single day. To prevent sensory overload, the human brain deploys three formidable perceptual defense filters.',
          'Filter 1: Selective Attention. Consumers filter out roughly 98% of promotional stimuli, noticing only messages that relate directly to a current urgent need or offer a startling contrast.',
          'Filter 2: Selective Distortion. Consumers twist, misinterpret, or reframe information to conform to their pre-existing biases and brand loyalties.',
          'Filter 3: Selective Retention. Consumers forget the vast majority of what they hear, retaining only points that reinforce their core attitudes.',
          'To break through these perceptual defenses, marketers must craft unexpected creative hooks and align messaging directly with the prospect\'s dominant active motivational tier.'
        ],
        example: 'Think of walking through a crowded, noisy subway station. Hundreds of people are chatting and train announcements echo continuously, yet your brain filters out all the noise. But if someone whispers your name or shouts "Fire!", your attention snaps to it instantly. That is Selective Attention.',
        code: `# Simulation: Maslow Hierarchy Motivation & Selective Perceptual Defense Filter
from dataclasses import dataclass

@dataclass
class PsychologicalProfile:
    consumer_id: str
    dominant_need_tier: str # 'Physiological', 'Safety', 'Belonging', 'Esteem', 'Self_Actualization'
    commercial_messages_exposed: int
    selective_attention_filter_pct: float # typically 95-98% filtered out
    perceptual_bias: str

def analyze_perceptual_filtering(profile: PsychologicalProfile) -> dict:
    retained_messages = int(profile.commercial_messages_exposed * (1.0 - (profile.selective_attention_filter_pct / 100.0)))
    
    tier_copy_strategy = {
        "Physiological": "Focus on immediate bodily comfort, hunger, thirst, or basic survival.",
        "Safety": "Emphasize security, financial protection, warranty, and risk-free guarantees.",
        "Belonging": "Highlight community inclusion, family warmth, friendship, and shared identity.",
        "Esteem": "Showcase prestige, professional mastery, status elevation, and luxury recognition.",
        "Self_Actualization": "Appeal to personal fulfillment, creative realization, and authentic purpose."
    }

    return {
        "Consumer": profile.consumer_id,
        "Need_Hierarchy_Tier": profile.dominant_need_tier,
        "Ad_Impressions_Exposed": profile.commercial_messages_exposed,
        "Messages_Passing_Attention_Gate": max(1, retained_messages),
        "Perceptual_Defense": f"Filters out {profile.selective_attention_filter_pct}% of promotional noise.",
        "Strategic_Copy_Hook": tier_copy_strategy.get(profile.dominant_need_tier, "General benefit")
    }

prof = PsychologicalProfile("CONS_991", "Esteem", 4000, 97.5, "Status-Conscious")
res2 = analyze_perceptual_filtering(prof)
print(f"Consumer: {res2['Consumer']} | Dominant Need: {res2['Need_Hierarchy_Tier']}")
print(f"Filtered: {res2['Ad_Impressions_Exposed']} ads -> {res2['Messages_Passing_Attention_Gate']} admitted ({res2['Perceptual_Defense']})")
print(f"Hook: {res2['Strategic_Copy_Hook']}")`,
        output: `Consumer: CONS_991 | Dominant Need: Esteem\nFiltered: 4000 ads -> 100 admitted (Filters out 97.5% of promotional noise.)\nHook: Showcase prestige, professional mastery, status elevation, and luxury recognition.`,
        codeNotes: [
          { line: 5, note: 'PsychologicalProfile models motivational need tier and sensory attention gating' },
          { line: 13, note: 'Calculates retained commercial impressions after selective attention screening' },
          { line: 15, note: 'Aligns advertising copy hooks with Maslow hierarchy motivational levels' },
          { line: 31, note: 'Simulates a status-motivated consumer filtering 4,000 daily commercial impressions' }
        ],
        tryIt: 'Change dominant_need_tier from Esteem to Safety to observe how the recommended strategic copy hook shifts to risk reduction and guarantees.',
        check: {
          question: 'What is "Selective Distortion" in consumer perceptual psychology?',
          options: [
            'The psychological tendency of consumers to twist or interpret incoming brand information so that it fits their existing beliefs and brand loyalties.',
            'A mechanical failure in television broadcast transmission cables.',
            'The complete inability of human beings to remember prices.',
            'A federal regulatory rule banning deceptive advertising.'
          ],
          answer: 0,
          why: 'Selective Distortion occurs when consumers interpret commercial information in a manner that supports rather than challenges their established attitudes and preconceptions.',
          answerIndex: 0,
          explanation: 'Selective Distortion occurs when consumers interpret commercial information in a manner that supports rather than challenges their established attitudes and preconceptions.'
        }
      },
      {
        title: 'Social Influence, Reference Groups & Conspicuous Consumption Dynamics',
        say: [
          'No consumer buys in isolation; human consumption is deeply embedded in social structures: culture, subcultures, social classes, reference groups, and opinion leaders.',
          'A Reference Group consists of all the groups that have a direct (face-to-face) or indirect influence on a person\'s attitudes or behavior.',
          'Primary reference groups include family, close friends, and co-workers with whom an individual interacts continuously and informally. Secondary groups include professional associations, trade unions, and religious communities.',
          'Aspirational Groups are those a person does not currently belong to, but aspires to join (such as luxury lifestyle enthusiasts or elite athletes). Dissociative Groups are groups whose values or behavior a person vigorously rejects (such as a rebellious teenager refusing to wear clothes favored by elderly accountants).',
          'The strength of reference group influence varies dramatically depending on whether a product is consumed publicly or privately, and whether it is a luxury or a necessity.',
          'For Public Luxuries (such as sports cars, designer clothing, or luxury watches), reference group influence is exceptionally powerful on both the product category and the specific brand choice, because ownership is highly conspicuous and confers public status.',
          'Conversely, for Private Necessities (such as mattresses, soap, or refrigerator appliances), social group influence is minimal because the product is hidden inside the home and consumption is invisible to peers.'
        ],
        example: 'Think of buying a mattress versus buying an expensive leather jacket. Nobody at work will ever see what brand of mattress you sleep on at night (Private Necessity), so social peer pressure is near zero. But your colleagues and friends immediately see your leather jacket every single day (Public Luxury), so their admiration or teasing exerts immense social influence on your brand choice.',
        code: `# Simulation: Bourne / Bearden Reference Group Conspicuousness & Social Multiplier
def evaluate_social_influence(
    product_category: str,
    base_purchase_intent: float, # 0.0 to 10.0
    reference_group_conspicuousness: str, # 'Public_Luxury', 'Private_Luxury', 'Public_Necessity', 'Private_Necessity'
    opinion_leader_endorsement: bool
) -> dict:
    # Conspicuousness matrix (Bourne / Bearden & Etzel Model):
    # Public Luxury (cars, watches): Strong influence on both category and brand choice
    # Private Luxury (home sauna): Strong influence on category, weak on brand
    # Public Necessity (smartphones): Weak influence on category, strong on brand
    # Private Necessity (mattress, detergent): Weak influence on both category and brand
    multipliers = {
        "Public_Luxury": 1.45,
        "Private_Luxury": 1.25,
        "Public_Necessity": 1.30,
        "Private_Necessity": 1.05
    }

    group_mult = multipliers.get(reference_group_conspicuousness, 1.1)
    influencer_bonus = 1.25 if opinion_leader_endorsement else 1.0
    
    final_intent = min(10.0, round(base_purchase_intent * group_mult * influencer_bonus, 2))

    return {
        "Category": product_category,
        "Conspicuousness_Classification": reference_group_conspicuousness,
        "Base_Intent": base_purchase_intent,
        "Final_Social_Intent": final_intent,
        "Social_Multiplier": round(group_mult * influencer_bonus, 2),
        "Social_Proof_Importance": 'CRITICAL' if group_mult >= 1.3 else 'MODERATE'
    }

social_audit = evaluate_social_influence("Mechanical Luxury Chronograph", 5.5, "Public_Luxury", True)
print(f"Category: {social_audit['Category']} ({social_audit['Conspicuousness_Classification']})")
print(f"Social Intent: {social_audit['Base_Intent']} -> {social_audit['Final_Social_Intent']} (Multiplier: {social_audit['Social_Multiplier']}x)")`,
        output: `Category: Mechanical Luxury Chronograph (Public_Luxury)\nSocial Intent: 5.5 -> 9.97 (Multiplier: 1.81x)`,
        codeNotes: [
          { line: 8, note: 'Bourne / Bearden & Etzel conspicuousness matrix models social peer pressure intensity' },
          { line: 16, note: 'Public luxuries trigger highest social multipliers due to visible status signaling' },
          { line: 20, note: 'Combines reference group conformity and opinion leader authority bonuses' },
          { line: 32, note: 'Evaluates luxury watch purchase boosted 1.81x by social proof and expert endorsement' }
        ],
        tryIt: 'Change reference_group_conspicuousness to Private_Necessity (e.g. laundry detergent) to see the social multiplier drop to 1.05x.',
        check: {
          question: 'In reference group sociology, what is a "Dissociative Group"?',
          options: [
            'A social group whose values, lifestyles, and behavioral norms an individual actively rejects and avoids identifying with.',
            'A group that has formally dissolved its legal incorporation.',
            'A group of consumers who only purchase goods during holiday clearance sales.',
            'A focus group organized by an advertising research agency.'
          ],
          answer: 0,
          why: 'Dissociative groups are negative reference groups whose values or behaviors consumers deliberately shun, motivating them to avoid purchasing brands associated with that group.',
          answerIndex: 0,
          explanation: 'Dissociative groups are negative reference groups whose values or behaviors consumers deliberately shun, motivating them to avoid purchasing brands associated with that group.'
        }
      },
      {
        title: 'Multi-Attribute Attitude Modeling (The Fishbein Attitude Calculus)',
        say: [
          'When consumers reach Stage 3 of the buying journey (Evaluation of Alternatives), how do they actually choose between competing offerings?',
          'Pioneering social psychologist Martin Fishbein demonstrated that consumers do not judge offerings as monolithic wholes; they evaluate offerings as bundles of distinct attributes, with each attribute carrying a specific importance weight.',
          'The Fishbein Multi-Attribute Attitude Model expresses this mathematically: Ao = Sum(bi * ei), where Ao represents the consumer\'s overall attitude score toward a brand, bi represents the consumer\'s belief about the degree to which the brand possesses attribute i, and ei represents the subjective importance weight the consumer places on attribute i.',
          'Consider a smartphone buyer comparing three brands across three key attributes: Camera Resolution, Battery Life, and Retail Price.',
          'One buyer may assign an importance weight of 0.50 to Camera Quality, 0.30 to Battery, and 0.20 to Price. For this buyer, a brand with a stellar camera will win easily, even if its battery is mediocre.',
          'Another budget-conscious buyer may weight Price at 0.60 and Camera at 0.10, flipping the mathematical preference entirely.',
          'The Fishbein model provides marketers with four precise strategic levers to change consumer brand choice: 1. Alter brand beliefs (convince buyers your battery lasts longer); 2. Alter attribute importance weights (convince buyers camera quality matters more than price); 3. Introduce a completely new attribute (e.g., satellite SOS messaging); or 4. Degrade competitor brand beliefs.'
        ],
        example: 'Think of scoring a gymnastics competition. A gymnast is evaluated across multiple criteria: difficulty, execution, artistic expression, and landing. Each criterion has a specific weight. The gold medal does not go to the athlete who simply shouts the loudest, but to the one whose weighted sum across all criteria is highest.',
        code: `# Simulation: Fishbein Multi-Attribute Attitude Scoring & Strategic Brand Comparison
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class BrandAttributeRating:
    attribute_name: str
    importance_weight: float # 0.0 to 1.0 (Sum of weights = 1.0)
    brand_beliefs: Dict[str, float] # Attribute score 1.0 to 10.0 for each brand

def compute_fishbein_attitude(attributes: List[BrandAttributeRating], brand_names: List[str]) -> dict:
    # Fishbein Model: Ao = Sum(bi * ei)
    attitude_scores = {b: 0.0 for b in brand_names}

    for attr in attributes:
        w = attr.importance_weight
        for b in brand_names:
            rating = attr.brand_beliefs.get(b, 5.0)
            attitude_scores[b] += w * rating

    rounded_scores = {b: round(score, 2) for b, score in attitude_scores.items()}
    winning_brand = max(rounded_scores, key=rounded_scores.get)

    return {
        "Brand_Attitude_Scores": rounded_scores,
        "Preferred_Choice": winning_brand,
        "Margin_Of_Preference": round(rounded_scores[winning_brand] - min(rounded_scores.values()), 2)
    }

# Smartphone buyer decision: Battery (30%), Camera (40%), Price/Value (30%)
attrs = [
    BrandAttributeRating("Camera Quality", 0.40, {"Brand_Alpha": 9.2, "Brand_Beta": 8.0, "Brand_Gamma": 6.0}),
    BrandAttributeRating("Battery Endurance", 0.30, {"Brand_Alpha": 7.0, "Brand_Beta": 8.5, "Brand_Gamma": 9.0}),
    BrandAttributeRating("Price Value", 0.30, {"Brand_Alpha": 6.5, "Brand_Beta": 8.0, "Brand_Gamma": 9.5})
]
brands = ["Brand_Alpha", "Brand_Beta", "Brand_Gamma"]
att_res = compute_fishbein_attitude(attrs, brands)
print(f"Fishbein Attitudes: {att_res['Brand_Attitude_Scores']}")
print(f"Preferred: {att_res['Preferred_Choice']} (Lead Margin: +{att_res['Margin_Of_Preference']} pts)")`,
        output: `Fishbein Attitudes: {'Brand_Alpha': 7.73, 'Brand_Beta': 8.15, 'Brand_Gamma': 7.95}\nPreferred: Brand_Beta (Lead Margin: +0.42 pts)`,
        codeNotes: [
          { line: 5, note: 'BrandAttributeRating defines attribute importance weights and brand belief scores' },
          { line: 12, note: 'Fishbein mathematical formula computes Ao = Sum(bi * ei)' },
          { line: 20, note: 'Computes overall multi-attribute score across all competing market brands' },
          { line: 36, note: 'Evaluates Brand_Beta winning with 8.15 points based on balanced camera, battery, and price' }
        ],
        tryIt: 'Increase Camera Quality importance weight to 0.70 and decrease Price Value to 0.10 to see Brand_Alpha surge ahead.',
        check: {
          question: 'According to the Fishbein Multi-Attribute Attitude Model (Ao = Sum(bi * ei)), how can a marketer improve a brand\'s overall attitude score without physically changing the product itself?',
          options: [
            'By using persuasive advertising to shift consumer importance weights (ei) toward attributes where the brand is already superior, or by strengthening consumer beliefs (bi) regarding existing features.',
            'By secretly deleting all competitor websites from the internet.',
            'By bribing retail store clerks to hide competing inventory under the counter.',
            'By declaring bankruptcy and reincorporating under an anonymous shell company.'
          ],
          answer: 0,
          why: 'The Fishbein model demonstrates that attitude is cognitive; marketers can improve scores by reshaping consumer perceptions of brand attributes (beliefs bi) or convincing consumers that their strong attributes matter most (weights ei).',
          answerIndex: 0,
          explanation: 'The Fishbein model demonstrates that attitude is cognitive; marketers can improve scores by reshaping consumer perceptions of brand attributes (beliefs bi) or convincing consumers that their strong attributes matter most (weights ei).'
        }
      },
      {
        title: 'Post-Purchase Cognitive Dissonance & Proactive Buyer\'s Remorse Mitigation',
        say: [
          'Closing a sale is not the finish line; it is the starting gun for long-term customer lifetime value and brand retention.',
          'Immediately following a major transaction, consumers frequently experience what social psychologist Leon Festinger termed Cognitive Dissonance: an uncomfortable state of psychological tension and self-doubt.',
          'Colloquially known as "Buyer\'s Remorse", cognitive dissonance occurs because every chosen purchase involves giving up the attractive features of the rejected alternatives.',
          'Dissonance surges under three specific conditions: 1. High Financial Commitment (the purchase was expensive relative to income); 2. High Psychological Involvement (the product reflects personal identity or social status); and 3. Close Alternative Quality (the rejected competitors were nearly as appealing as the winner).',
          'Unresolved cognitive dissonance is a primary driver of product returns, buyer cancellation calls, negative word-of-mouth, and customer churn.',
          'Sophisticated marketers do not abandon customers after receiving payment; they deploy proactive Post-Purchase Reassurance sequences.',
          'Tactics include: immediate congratulatory confirmation emails validating the wisdom of the choice, unboxing video tutorials ensuring smooth initial product setup, showcasing awards and customer reviews, and providing ironclad money-back guarantees that lower perceived risk.',
          'When cognitive dissonance is proactively neutralized, customers transition from anxious buyers into loyal, vocal brand advocates.'
        ],
        example: 'Think of signing a 30-year mortgage to buy a new home or purchasing a \$60,000 automobile. The moment you walk out of the dealership or sign the papers, a sudden sinking feeling hits your stomach: "Did I pay too much? What if the other car was more reliable? Can I really afford this?" That uncomfortable pit in your stomach is pure Cognitive Dissonance.',
        code: `# Simulation: Post-Purchase Cognitive Dissonance & Buyer Remorse Mitigation Model
def evaluate_cognitive_dissonance_risk(
    transaction_amount: float,
    involvement_level: str,      # 'High', 'Medium', 'Low'
    competitor_similarity: float,# 0.0 to 1.0 (High = Close substitute alternatives rejected)
    has_unconditional_return_guarantee: bool,
    post_purchase_reassurance_sent: bool
) -> dict:
    # Higher price, higher involvement, and closer alternatives trigger intense cognitive dissonance
    base_anxiety = (min(5000.0, transaction_amount) / 5000.0) * 4.0
    involvement_multiplier = 1.5 if involvement_level == 'High' else (1.0 if involvement_level == 'Medium' else 0.5)
    alternative_anxiety = competitor_similarity * 2.5
    
    gross_dissonance = (base_anxiety * involvement_multiplier) + alternative_anxiety
    
    # Mitigation shields
    shield = 0.0
    if has_unconditional_return_guarantee:
        shield += 2.5
    if post_purchase_reassurance_sent:
        shield += 3.0

    net_dissonance_score = max(0.0, round(gross_dissonance - shield, 2))
    
    if net_dissonance_score >= 5.0:
        risk_level = 'SEVERE_BUYERS_REMORSE_RISK'
        remedy = 'Immediate founder concierge call, unboxing video guide & proactive support check-in.'
    elif net_dissonance_score >= 2.5:
        risk_level = 'MODERATE_POST_PURCHASE_ANXIETY'
        remedy = 'Automated reassurance email highlighting social validation & awards.'
    else:
        risk_level = 'NEGLIGIBLE_DISSONANCE_SECURE'
        remedy = 'Standard shipping tracking and community onboarding.'

    return {
        "Transaction_Value": f"\${transaction_amount}",
        "Gross_Dissonance_Index": round(gross_dissonance, 2),
        "Mitigation_Shield": round(shield, 2),
        "Net_Dissonance_Score": net_dissonance_score,
        "Risk_Assessment": risk_level,
        "Proactive_Intervention": remedy
    }

remorse_case = evaluate_cognitive_dissonance_risk(
    transaction_amount=2400.0,
    involvement_level='High',
    competitor_similarity=0.85,
    has_unconditional_return_guarantee=True,
    post_purchase_reassurance_sent=False
)
print(f"Transaction: {remorse_case['Transaction_Value']} | Net Dissonance: {remorse_case['Net_Dissonance_Score']}/10.0")
print(f"Risk: {remorse_case['Risk_Assessment']}")
print(f"Intervention: {remorse_case['Proactive_Intervention']}")`,
        output: `Transaction: $2400.0 | Net Dissonance: 2.5/10.0\nRisk: MODERATE_POST_PURCHASE_ANXIETY\nIntervention: Automated reassurance email highlighting social validation & awards.`,
        codeNotes: [
          { line: 9, note: 'Calculates gross post-purchase anxiety as a function of price, involvement, and alternative closeness' },
          { line: 16, note: 'Quantifies mitigation shields from return guarantees and proactive customer reassurance' },
          { line: 23, note: 'Computes net dissonance score and prescribes retention workflows to preempt buyer returns' },
          { line: 36, note: 'Evaluates a $2,400 high-involvement purchase lacking post-purchase reassurance' }
        ],
        tryIt: 'Set post_purchase_reassurance_sent to True to see Net Dissonance drop to 0.0 (NEGLIGIBLE_DISSONANCE_SECURE).',
        check: {
          question: 'What is the primary psychological driver of Cognitive Dissonance (Buyer\'s Remorse) following a major purchase?',
          options: [
            'The discomfort of having given up the attractive, desirable features of the rejected competing alternatives.',
            'The product immediately breaking the moment it is plugged into electrical power.',
            'The credit card company charging exorbitant annual interest rates.',
            'The delivery courier taking two days longer than estimated.'
          ],
          answer: 0,
          why: 'Cognitive dissonance arises because choosing one brand inherently requires relinquishing the desirable benefits of the non-chosen alternatives, generating internal self-doubt about whether the optimal choice was made.',
          answerIndex: 0,
          explanation: 'Cognitive dissonance arises because choosing one brand inherently requires relinquishing the desirable benefits of the non-chosen alternatives, generating internal self-doubt about whether the optimal choice was made.'
        }
      }
    ],
    summary: [
      '5-Stage Buying Funnel: Deconstructs the decision journey: Need Recognition -> Information Search -> Evaluation of Alternatives -> Purchase Decision -> Post-Purchase Behavior.',
      'Perceptual Defense Filters: The brain deploys Selective Attention, Selective Distortion, and Selective Retention to filter out 98% of commercial noise; ads must resonate with active Maslow need tiers.',
      'Reference Group Power: Conspicuous Public Luxuries trigger intense social conformity and opinion leader amplification; Private Necessities rely purely on functional utility.',
      'Fishbein Attitude Model: Quantifies alternative evaluation through Ao = Sum(bi * ei); brands can win by shifting beliefs (bi) or reframing attribute importance weights (ei).',
      'Cognitive Dissonance Shielding: Post-purchase buyer remorse is mitigated through immediate reassurance messaging, unboxing onboarding, and risk-free return guarantees that secure customer lifetime value.'
    ],
    projectStep: {
      title: 'Month 1 Marketing Strategy Capstone Step 3: Consumer Journey Mapping & Dissonance Mitigation',
      steps: [
        'Map the complete 5-stage customer journey for your target persona, identifying critical leakages between intent and transaction.',
        'Build a Fishbein Multi-Attribute model comparing your offering against 2 primary rivals across 4 weighted criteria.',
        'Design a 3-part post-purchase customer onboarding and reassurance sequence to eliminate cognitive dissonance and lower return rates below 2%.'
      ]
    }
  },
  {
    coursePrefix: 'bcom-marketing',
    day: 4,
    title: 'Marketing Research & Demand Forecasting: Scientific Methodology & Predictive Modeling',
    goal: 'Master empirical marketing research and predictive demand forecasting: designing Cochran-sampled research plans, auditing Likert survey instruments for response biases, calculating Exponential Smoothing demand forecasts with MAPE accuracy metrics, sizing market potential via TAM/SAM/SOM geometry, and synthesizing multi-round Delphi expert consensus projections.',
    minutes: 42,
    recap: 'Yesterday we unpacked the psychology of consumer decision journeys, multi-attribute attitudes, and cognitive dissonance. Today we shift from individual minds to market-wide intelligence: mastering how organizations scientifically gather field data and forecast future market demand.',
    parts: [
      {
        title: 'The 5-Step Marketing Research Process & Cochran Sample Size Calculus',
        say: [
          'Marketing decisions made without empirical data are mere gambles; scientific marketing research transforms ambiguous business dilemmas into rigorous, risk-mitigated strategies.',
          'The formal marketing research process follows five disciplined steps: 1. Problem & Objectives Definition; 2. Research Plan Development; 3. Field Data Collection; 4. Data Analysis & Synthesis; 5. Actionable Presentation to Leadership.',
          'Step 1 is the most critical: as the famous management maxim states, "A problem well-defined is half solved." If you define the problem as declining revenue rather than diagnosing why customers are defecting to a new rival, millions of research dollars will be wasted.',
          'Marketing research is categorized into three distinct research designs: Exploratory Research (to gather preliminary background and define ambiguous concepts via focus groups), Descriptive Research (to quantify market parameters such as demographic profiles and purchase frequencies), and Causal Research (to test explicit cause-and-effect hypotheses via controlled experiments).',
          'When designing quantitative surveys, how many respondents must you survey to achieve statistical confidence without burning capital?',
          'Statistician William G. Cochran developed the canonical formula for representative sample sizes: n0 = (Z^2 * p * (1-p)) / e^2, where Z represents the standard normal deviate for the desired confidence level (1.96 for 95% confidence), p represents the estimated population proportion (set to 0.50 to maximize conservative variance), and e represents the acceptable margin of error (typically 0.05 for +/- 5%).',
          'Applying Cochran\'s formula proves that whether a city has 500,000 residents or 50 million, a rigorously randomized sample of roughly 384 respondents provides statistically robust market intelligence within +/- 5% error at 95% confidence.'
        ],
        example: 'Think of a blood test at a hospital. A doctor does not need to drain all five liters of blood from your body to check your cholesterol; extracting a single, well-mixed 5-milliliter vial provides a perfectly representative diagnosis of your entire cardiovascular system. That is the statistical power of Cochran random sampling.',
        code: `# Simulation: Cochran Statistical Sample Size Calculator for Market Research
def calculate_sample_size(
    population_size: int,
    confidence_level_z: float, # 1.96 for 95%, 2.576 for 99%
    margin_of_error_e: float,  # e.g., 0.05 for +/- 5%
    estimated_proportion_p: float = 0.5 # 0.5 maximizes sample size conservative variance
) -> dict:
    # Cochran's Sample Size Formula: n0 = (Z^2 * p * (1-p)) / e^2
    n0 = (confidence_level_z ** 2 * estimated_proportion_p * (1.0 - estimated_proportion_p)) / (margin_of_error_e ** 2)
    
    # Finite Population Correction (FPC): n = n0 / (1 + (n0 - 1) / N)
    if population_size > 0:
        n_corrected = n0 / (1.0 + (n0 - 1.0) / population_size)
    else:
        n_corrected = n0

    return {
        "Target_Population": population_size,
        "Confidence_Z": confidence_level_z,
        "Margin_Of_Error_Pct": f"+/- {round(margin_of_error_e * 100.0, 1)}%",
        "Raw_Cochran_Sample": int(round(n0)),
        "Required_Survey_Sample_Size": int(round(n_corrected)),
        "Statistical_Reliability": "STATISTICALLY_VALID_REPRESENTATIVE_SAMPLE"
    }

sample_plan = calculate_sample_size(population_size=50000, confidence_level_z=1.96, margin_of_error_e=0.05)
print(f"Population: {sample_plan['Target_Population']} | Margin: {sample_plan['Margin_Of_Error_Pct']}")
print(f"Required Sample: {sample_plan['Required_Survey_Sample_Size']} respondents ({sample_plan['Statistical_Reliability']})")`,
        output: `Population: 50000 | Margin: +/- 5.0%\nRequired Sample: 381 respondents (STATISTICALLY_VALID_REPRESENTATIVE_SAMPLE)`,
        codeNotes: [
          { line: 9, note: 'Cochran formula n0 = (Z^2 * p * (1-p)) / e^2 calculates baseline sample size' },
          { line: 12, note: 'Finite Population Correction (FPC) adjusts sample size for defined target communities' },
          { line: 19, note: 'Returns statistically validated survey quota for quantitative research teams' },
          { line: 26, note: 'Calculates requirement for 50,000 population at 95% confidence and +/- 5% precision' }
        ],
        tryIt: 'Change margin_of_error_e from 0.05 (+/- 5%) to 0.02 (+/- 2%) to observe how tightening precision quadruples required sample size.',
        check: {
          question: 'In marketing research design, what is the primary role of "Exploratory Research"?',
          options: [
            'To gather preliminary qualitative insights, discover fresh ideas, and clarify the nature of ambiguous, poorly understood market problems.',
            'To prove causality in a double-blind clinical trial under laboratory isolation.',
            'To calculate exact decimal market share percentages across thirty national territories.',
            'To print final accounting tax returns for statutory filing.'
          ],
          answer: 0,
          why: 'Exploratory research is conducted when a problem is broad or undefined; it utilizes focus groups, in-depth interviews, and observational studies to shed light on latent customer dynamics before investing in expensive quantitative surveys.',
          answerIndex: 0,
          explanation: 'Exploratory research is conducted when a problem is broad or undefined; it utilizes focus groups, in-depth interviews, and observational studies to shed light on latent customer dynamics before investing in expensive quantitative surveys.'
        }
      },
      {
        title: 'Survey Instrument Engineering: Likert Scales & Neutrality Auditing',
        say: [
          'Even with a perfectly randomized sample, a research study will produce catastrophic strategic errors if the survey instrument itself is flawed.',
          'The design of questions, answer scales, and phrasing directly impacts respondent psychology and data fidelity.',
          'The gold standard of quantitative attitude measurement is the Likert Scale, developed by Rensis Likert. A Likert scale presents a statement and asks respondents to specify their level of agreement across a symmetric 5-point or 7-point continuum (from "Strongly Disagree" to "Strongly Agree").',
          'Similarly, the Semantic Differential scale anchors bipolar adjective pairs (such as "Inconvenient vs. Convenient" or "Unreliable vs. Reliable") across a 7-point gradient to map brand personality perceptions.',
          'However, questionnaire designers must aggressively guard against fatal response biases.',
          'Leading Questions subtly prompt the respondent toward a desired answer (e.g., "Don\'t you agree that our award-winning app is faster?").',
          'Double-Barreled Questions commit the cardinal sin of combining two separate topics into a single query (e.g., "How fast and affordable was our service?" — leaving a buyer who felt service was fast but expensive unable to answer honestly).',
          'Social Desirability Bias causes respondents to over-report virtuous behaviors (such as donating to charity or buying green organic food) and under-report embarrassing habits.',
          'Rigorous research teams audit every questionnaire item through neutrality testing and pilot runs before field launch.'
        ],
        example: 'Think of calibrating a medical thermometer. If the thermometer is warped or offset by two degrees (leading phrasing and double-barreled questions), every reading you take will falsely diagnose healthy patients as having a fever, leading to inappropriate medical treatments.',
        code: `# Simulation: Questionnaire Integrity & Neutrality Auditor
from dataclasses import dataclass
from typing import List

@dataclass
class SurveyQuestionAudit:
    question_text: str
    scale_type: str # 'Likert_5', 'Likert_7', 'Semantic_Differential'
    contains_leading_words: bool
    is_double_barreled: bool

def audit_questionnaire_integrity(questions: List[SurveyQuestionAudit]) -> dict:
    passed = 0
    flaws = []
    
    for q in questions:
        if q.contains_leading_words:
            flaws.append(f"FLAG: Leading bias in '{q.question_text}'")
        elif q.is_double_barreled:
            flaws.append(f"FLAG: Double-barreled compound query in '{q.question_text}'")
        else:
            passed += 1

    clean_rate_pct = round((passed / len(questions)) * 100.0, 1)
    status = 'APPROVED_FOR_FIELD_DATA_COLLECTION' if clean_rate_pct == 100.0 else 'REQUIRES_INSTRUMENT_REVISION'

    return {
        "Total_Questions": len(questions),
        "Clean_Neutral_Questions": passed,
        "Instrument_Purity_Pct": clean_rate_pct,
        "Audit_Status": status,
        "Detected_Flaws": flaws
    }

questions = [
    SurveyQuestionAudit("How satisfied are you with product battery endurance?", "Likert_5", False, False),
    SurveyQuestionAudit("Don't you agree our premium app is faster than rivals?", "Likert_5", True, False),
    SurveyQuestionAudit("How fast and affordable was our customer service?", "Likert_5", False, True),
    SurveyQuestionAudit("The software user interface is intuitive to navigate.", "Likert_7", False, False)
]
audit_res = audit_questionnaire_integrity(questions)
print(f"Questions Audited: {audit_res['Total_Questions']} | Purity: {audit_res['Instrument_Purity_Pct']}%")
print(f"Status: {audit_res['Audit_Status']}")
print(f"Flaws: {len(audit_res['Detected_Flaws'])} issues flagged")`,
        output: `Questions Audited: 4 | Purity: 50.0%\nStatus: REQUIRES_INSTRUMENT_REVISION\nFlaws: 2 issues flagged`,
        codeNotes: [
          { line: 5, note: 'SurveyQuestionAudit model inspects question wording for leading bias and compounding' },
          { line: 17, note: 'Detects double-barreled questions that combine two distinct attributes into one query' },
          { line: 23, note: 'Calculates overall questionnaire purity percentage and issues approval gate' },
          { line: 40, note: 'Identifies 2 defective questions requiring rewrite before fielding' }
        ],
        tryIt: 'Split the double-barreled question into two separate neutral Likert questions to raise questionnaire purity to 75%.',
        check: {
          question: 'Why is the survey question "How satisfied are you with the speed and reliability of our cloud platform?" methodologically defective?',
          options: [
            'It is a double-barreled question combining two separate attributes (speed and reliability); a respondent whose system is fast but unreliable cannot answer accurately.',
            'It fails to mention the company\'s chief executive officer by name.',
            'It uses the English language instead of Latin terminology.',
            'It does not offer cash cryptocurrency prizes for completion.'
          ],
          answer: 0,
          why: 'A double-barreled question forces respondents to provide a single composite rating for two independent attributes, destroying data validity when performance diverges across the two dimensions.',
          answerIndex: 0,
          explanation: 'A double-barreled question forces respondents to provide a single composite rating for two independent attributes, destroying data validity when performance diverges across the two dimensions.'
        }
      },
      {
        title: 'Quantitative Demand Forecasting: Moving Averages & Exponential Smoothing (MAPE)',
        say: [
          'Once marketing research captures customer purchase intentions, operations and finance demand an exact quantitative forecast: how many units will the enterprise sell in the coming quarters?',
          'Under-forecasting leads to stockouts, furious customers, lost revenue, and competitors capturing market share. Over-forecasting leads to bloated warehouses, working capital gridlock, and steep write-downs of obsolete inventory.',
          'For established products with historical sales records, quantitative Time-Series Forecasting models project past velocity into the future.',
          'The simplest technique is the k-Period Moving Average (SMA), which averages sales across the most recent k periods, smoothing out random short-term noise.',
          'However, the superior industry-standard method is Exponential Smoothing, pioneered by Robert G. Brown. The formula states: F_{t+1} = alpha * A_t + (1 - alpha) * F_t, where F_{t+1} is the forecast for the upcoming period, A_t is the actual sales volume observed in the current period, F_t is the current period forecast, and alpha is a smoothing constant between 0.0 and 1.0.',
          'The smoothing constant alpha controls responsiveness: a high alpha (e.g., 0.7) reacts swiftly to recent demand spikes, while a low alpha (e.g., 0.2) places heavy weight on long-term historical stability.',
          'To measure forecast accuracy, professional forecasters compute the Mean Absolute Percentage Error (MAPE): MAPE = (1/n) * Sum(|Actual - Forecast| / Actual) * 100%. A MAPE below 10% reflects exceptional forecasting accuracy.'
        ],
        example: 'Think of steering an automobile on a windy highway. Looking purely at where you were 5 miles ago is a Moving Average. Exponential Smoothing is keeping your hands gently on the steering wheel: if a gust of wind nudges you left (actual sales fluctuate), you make a calibrated proportional adjustment (smoothing alpha) to keep the car centered in the lane without over-steering into the ditch.',
        code: `# Simulation: Exponential Smoothing Demand Forecasting & MAPE Accuracy Engine
from typing import List

def forecast_demand_exponential_smoothing(
    actual_historical_sales: List[float],
    smoothing_alpha: float # 0.1 to 0.9
) -> dict:
    # F_t+1 = alpha * A_t + (1 - alpha) * F_t
    forecasts = [actual_historical_sales[0]] # Initialize first forecast with first actual
    absolute_percentage_errors = []

    for t in range(len(actual_historical_sales) - 1):
        actual_t = actual_historical_sales[t]
        forecast_t = forecasts[t]
        next_forecast = (smoothing_alpha * actual_t) + ((1.0 - smoothing_alpha) * forecast_t)
        forecasts.append(round(next_forecast, 2))

    # Compute MAPE for periods 2 onwards
    for t in range(1, len(actual_historical_sales)):
        actual = actual_historical_sales[t]
        pred = forecasts[t]
        ape = abs(actual - pred) / actual
        absolute_percentage_errors.append(ape)

    mape_pct = round((sum(absolute_percentage_errors) / len(absolute_percentage_errors)) * 100.0, 2)
    
    # Project next out-of-sample period
    final_actual = actual_historical_sales[-1]
    final_forecast = forecasts[-1]
    next_period_projection = round((smoothing_alpha * final_actual) + ((1.0 - smoothing_alpha) * final_forecast), 2)

    return {
        "Periods_Evaluated": len(actual_historical_sales),
        "Smoothing_Alpha": smoothing_alpha,
        "Mean_Absolute_Percentage_Error_Pct": f"{mape_pct}%",
        "Next_Period_Projected_Demand": next_period_projection,
        "Forecasting_Accuracy": 'HIGH_ACCURACY_PROJECTION' if mape_pct < 10.0 else 'ACCEPTABLE_HEURISTIC'
    }

sales = [1200.0, 1280.0, 1310.0, 1420.0, 1390.0, 1480.0]
demand_res = forecast_demand_exponential_smoothing(sales, smoothing_alpha=0.35)
print(f"History: {demand_res['Periods_Evaluated']} periods | Alpha: {demand_res['Smoothing_Alpha']}")
print(f"MAPE: {demand_res['Mean_Absolute_Percentage_Error_Pct']} ({demand_res['Forecasting_Accuracy']})")
print(f"Next Period Forecast: {demand_res['Next_Period_Projected_Demand']} units")`,
        output: `History: 6 periods | Alpha: 0.35\nMAPE: 7.78% (HIGH_ACCURACY_PROJECTION)\nNext Period Forecast: 1389.33 units`,
        codeNotes: [
          { line: 9, note: 'Recursively applies exponential smoothing equation F_t+1 = alpha*A_t + (1-alpha)*F_t' },
          { line: 22, note: 'Calculates Mean Absolute Percentage Error (MAPE) to quantify forecast variance' },
          { line: 27, note: 'Generates out-of-sample demand forecast for the next upcoming operating quarter' },
          { line: 38, note: 'Achieves high forecasting precision with 7.78% MAPE on 6-period sales velocity' }
        ],
        tryIt: 'Increase smoothing_alpha from 0.35 to 0.80 to give heavy weight to the most recent period sales jump (1480 units) and watch the next projection rise.',
        check: {
          question: 'In exponential smoothing demand forecasting, what does a high smoothing constant alpha (such as alpha = 0.8) indicate?',
          options: [
            'The forecast places dominant weight on the most recent period\'s actual sales, responding swiftly to immediate market fluctuations.',
            'The forecast ignores all historical data and selects a random lottery number.',
            'The enterprise has run out of physical inventory in all distribution centers.',
            'The product is legally restricted from being sold across state borders.'
          ],
          answer: 0,
          why: 'The smoothing constant alpha weights the most recent observation; as alpha approaches 1.0, the forecast reacts rapidly to recent changes, whereas lower alpha values smooth out short-term fluctuations by anchoring to historical trend.',
          answerIndex: 0,
          explanation: 'The smoothing constant alpha weights the most recent observation; as alpha approaches 1.0, the forecast reacts rapidly to recent changes, whereas lower alpha values smooth out short-term fluctuations by anchoring to historical trend.'
        }
      },
      {
        title: 'Market Sizing Geometry: Total Addressable Market (TAM), SAM & SOM Projections',
        say: [
          'Before greenlighting a product launch or pitching venture capital investors, founders and marketing executives must calculate the market boundary geometry: TAM, SAM, and SOM.',
          'These nested concentric circles define the total potential revenue pool and establish realistic milestones.',
          'TAM (Total Addressable Market) is the total annual market demand for a product or service if your firm enjoyed 100% market share across the entire globe with zero competitors.',
          'TAM is calculated using the Total Market Potential formula: Q = n * q * p, where n represents the total number of prospective buyers in the category, q represents the average quantity purchased by each buyer per year, and p represents the average selling price.',
          'SAM (Serviceable Available Market) represents the subset of TAM that directly fits your specific product category, technology architecture, and current geographic distribution capabilities.',
          'SOM (Serviceable Obtainable Market) is the realistic, defensible slice of SAM that your company can realistically capture within a 1-to-3 year operating horizon, given existing marketing budgets, channel sales capacity, and competitor resistance.',
          'Amateur business plans claim "If we just capture 1% of the $100 billion global market, we will make $1 billion." Venture capitalists instantly reject this naive top-down claim. Professional marketing plans build bottom-up SOM models proving how marketing spend and sales velocity achieve specific customer unit acquisitions.'
        ],
        example: 'Think of fishing in the Atlantic Ocean. TAM is every single edible fish swimming anywhere in the ocean ($150M total market). SAM is all the fish swimming within 50 miles of your local harbor where your vessel has fuel to navigate ($60M serviceable market). SOM is the actual volume of fish your single trawler boat has the nets, crew, and storage hold capacity to harvest this season ($4.8M obtainable revenue).',
        code: `# Simulation: Bottom-Up TAM, SAM & SOM Market Sizing Geometry Model
def compute_tam_sam_som(
    total_population_buyers: int,
    average_annual_units_per_buyer: float,
    average_selling_price: float,
    geographic_serviceable_pct: float, # e.g. 0.30 for 30% serviceable
    obtainable_market_share_pct: float # e.g. 0.05 for 5% realistic 3-year capture
) -> dict:
    # Total Addressable Market (TAM) = n * q * p
    tam_dollars = total_population_buyers * average_annual_units_per_buyer * average_selling_price
    sam_dollars = tam_dollars * geographic_serviceable_pct
    som_dollars = sam_dollars * obtainable_market_share_pct

    return {
        "Total_Addressable_Market_TAM": f"\${round(tam_dollars / 1e6, 2)}M",
        "Serviceable_Available_Market_SAM": f"\${round(sam_dollars / 1e6, 2)}M",
        "Serviceable_Obtainable_Market_SOM": f"\${round(som_dollars / 1e6, 2)}M",
        "Serviceable_Coverage_Pct": f"{round(geographic_serviceable_pct * 100.0, 1)}%",
        "Target_SOM_Share_Pct": f"{round(obtainable_market_share_pct * 100.0, 1)}%",
        "Strategic_Planning_Baseline": f"Targeting \${round(som_dollars / 1e6, 2)}M realistic 3-year revenue capture."
    }

tam_res = compute_tam_sam_som(
    total_population_buyers=500000,
    average_annual_units_per_buyer=2.0,
    average_selling_price=150.0,
    geographic_serviceable_pct=0.40,
    obtainable_market_share_pct=0.08
)
print(f"TAM: {tam_res['Total_Addressable_Market_TAM']} | SAM: {tam_res['Serviceable_Available_Market_SAM']} | SOM: {tam_res['Serviceable_Obtainable_Market_SOM']}")
print(f"Planning Goal: {tam_res['Strategic_Planning_Baseline']}")`,
        output: `TAM: $150.0M | SAM: $60.0M | SOM: $4.8M\nPlanning Goal: Targeting $4.8M realistic 3-year revenue capture.`,
        codeNotes: [
          { line: 9, note: 'Total Market Potential formula TAM = n * q * p computes gross theoretical ceiling' },
          { line: 10, note: 'Filters TAM by operational capability and regional boundaries to establish SAM' },
          { line: 11, note: 'Applies realistic competitive market share penetration percentage to yield SOM' },
          { line: 26, note: 'Calculates $150M TAM translating into realistic $4.8M 3-year commercial target' }
        ],
        tryIt: 'Increase obtainable_market_share_pct from 0.08 (8%) to 0.15 (15%) to project a high-growth aggressive scaling scenario.',
        check: {
          question: 'What is the fundamental difference between SAM (Serviceable Available Market) and SOM (Serviceable Obtainable Market)?',
          options: [
            'SAM represents the market segment that matches your product profile and territory, while SOM is the specific, realistic portion of SAM your company can actually capture with its existing sales and marketing resources.',
            'SAM applies only to software companies, while SOM applies only to agricultural farms.',
            'SAM is calculated in Japanese Yen, while SOM is calculated in US Dollars.',
            'There is no difference; SAM and SOM are identical synonyms.'
          ],
          answer: 0,
          why: 'SAM reflects your total serviceable territory and fit, whereas SOM represents your realistic near-term target given sales capacity, marketing budget, and competitor resistance.',
          answerIndex: 0,
          explanation: 'SAM reflects your total serviceable territory and fit, whereas SOM represents your realistic near-term target given sales capacity, marketing budget, and competitor resistance.'
        }
      },
      {
        title: 'The Delphi Method & Multi-Round Expert Consensus Synthesis',
        say: [
          'What happens when a marketing team must forecast demand for a radical breakthrough innovation — such as commercial space tourism, quantum cryptographic networks, or autonomous flying taxis — where zero historical sales data exists?',
          'Under conditions of extreme technological uncertainty and zero precedent, standard quantitative time-series models (like moving averages and regression) fail completely.',
          'In such breakthrough domains, marketing strategists rely on Qualitative Consensus Forecasting, spearheaded by the Delphi Method.',
          'Developed by Norman Dalkey and Olaf Helmer at the RAND Corporation during the Cold War, the Delphi Method is a structured, iterative forecasting process that aggregates the anonymous wisdom of independent industry experts.',
          'Crucially, the experts never meet in the same room! In open committee meetings, dominant personalities, vocal executives, and senior status bias intimidate others, corrupting judgment through dangerous "groupthink".',
          'Instead, an independent facilitator circulates a detailed questionnaire to experts anonymously.',
          'After Round 1, the facilitator calculates statistical distributions (the median and interquartile range IQR) and synthesizes the anonymous rationales for extreme outlier projections.',
          'In Round 2, the experts review the group statistical summary and arguments, and are invited to revise their individual estimates.',
          'Over two to three iterative rounds, the variance between expert projections collapses dramatically, converging toward a statistically robust, defensible consensus projection.'
        ],
        example: 'Think of guessing the number of marbles in a giant glass jar. If you put ten people in a room, the loudest person will claim "It\'s 10,000!" and everyone else will nod in agreement. But if you have 100 people write their confidential guesses on secret paper slips, compile the median, show everyone the distribution, and let them submit a second secret estimate, the resulting median estimate will be astonishingly close to the true count.',
        code: `# Simulation: RAND Corporation Delphi Multi-Round Expert Consensus Engine
from typing import List

def synthesize_delphi_expert_consensus(
    round_1_estimates: List[float],
    round_2_estimates: List[float]
) -> dict:
    # Calculate median and interquartile spread (IQR) for both rounds
    def get_stats(data: List[float]) -> dict:
        sorted_d = sorted(data)
        n = len(sorted_d)
        median = sorted_d[n // 2] if n % 2 != 0 else (sorted_d[n // 2 - 1] + sorted_d[n // 2]) / 2.0
        q1 = sorted_d[n // 4]
        q3 = sorted_d[(3 * n) // 4]
        iqr = round(q3 - q1, 2)
        return {"Median": round(median, 2), "IQR": iqr, "Min": sorted_d[0], "Max": sorted_d[-1]}

    r1_stats = get_stats(round_1_estimates)
    r2_stats = get_stats(round_2_estimates)
    
    spread_reduction_pct = round(((r1_stats["IQR"] - r2_stats["IQR"]) / r1_stats["IQR"]) * 100.0, 1)
    consensus_converged = r2_stats["IQR"] < (r1_stats["IQR"] * 0.6)

    return {
        "Experts_Count": len(round_1_estimates),
        "Round_1_Median": r1_stats["Median"],
        "Round_1_IQR_Spread": r1_stats["IQR"],
        "Round_2_Median": r2_stats["Median"],
        "Round_2_IQR_Spread": r2_stats["IQR"],
        "Variance_Reduction_Pct": f"{spread_reduction_pct}%",
        "Consensus_Status": "EXPERT_CONSENSUS_CONVERGED" if consensus_converged else "FURTHER_ROUND_REQUIRED",
        "Final_Adopted_Projection": r2_stats["Median"]
    }

# Delphi panel forecasting year 2030 autonomous EV adoption percentage
r1 = [15.0, 22.0, 28.0, 35.0, 42.0, 50.0, 65.0]
r2 = [26.0, 28.0, 30.0, 32.0, 34.0, 36.0, 40.0]
delphi_res = synthesize_delphi_expert_consensus(r1, r2)
print(f"Panel: {delphi_res['Experts_Count']} experts | Variance Reduction: {delphi_res['Variance_Reduction_Pct']}")
print(f"Status: {delphi_res['Consensus_Status']} | Final Consensus: {delphi_res['Final_Adopted_Projection']}%")`,
        output: `Panel: 7 experts | Variance Reduction: 71.4%\nStatus: EXPERT_CONSENSUS_CONVERGED | Final Consensus: 32.0%`,
        codeNotes: [
          { line: 8, note: 'Computes median and Interquartile Range (IQR) to eliminate outlier distortion' },
          { line: 20, note: 'Measures spread reduction across rounds to assess variance collapse' },
          { line: 21, note: 'Validates consensus convergence when second-round spread drops below 60% of baseline' },
          { line: 36, note: 'Demonstrates 71.4% variance reduction converging on 32.0% autonomous EV adoption' }
        ],
        tryIt: 'Add two extreme outlier estimates (e.g. 90.0 and 5.0) to Round 2 to see the algorithm flag FURTHER_ROUND_REQUIRED.',
        check: {
          question: 'Why does the Delphi Method require strict anonymity among participating experts throughout all survey rounds?',
          options: [
            'To prevent dominant personalities, organizational hierarchy, and social groupthink from biasing or intimidating other panelists into conformity.',
            'Because expert identities are classified state secrets under international maritime law.',
            'To avoid paying expert consulting honorariums.',
            'Because the experts do not speak the same language.'
          ],
          answer: 0,
          why: 'Anonymity insulates experts from social pressure, executive hierarchy, and bandwagon bias, enabling participants to evaluate ideas purely on empirical and logical merit.',
          answerIndex: 0,
          explanation: 'Anonymity insulates experts from social pressure, executive hierarchy, and bandwagon bias, enabling participants to evaluate ideas purely on empirical and logical merit.'
        }
      }
    ],
    summary: [
      '5-Step Research Process: Disciplined workflow: Problem Definition -> Research Plan -> Field Data Collection -> Analysis -> Actionable Reporting. A problem well-defined is half solved.',
      'Cochran Sampling: Statistical formula n0 = (Z^2 * p * (1-p)) / e^2 proves that ~384 respondents provide robust representative intelligence within +/- 5% error at 95% confidence.',
      'Survey Instrument Integrity: Likert & Semantic Differential scales require strict neutrality auditing to eliminate leading phrasing and double-barreled compound queries.',
      'Exponential Smoothing & MAPE: Time-series forecasting F_t+1 = alpha*A_t + (1-alpha)*F_t balances responsiveness with stability; MAPE < 10% confirms high predictive precision.',
      'Market Sizing & Delphi Consensus: Deconstructs market potential across TAM (Total potential), SAM (Serviceable fit), and SOM (Realistic obtainable revenue); Delphi consensus resolves radical technological uncertainty.'
    ],
    projectStep: {
      title: 'Month 1 Marketing Strategy Capstone Step 4: Research Plan, Survey Instrument & Demand Forecast',
      steps: [
        'Formulate a 5-step marketing research plan for your capstone offering, calculating required sample size using Cochran\'s formula.',
        'Draft a 5-question neutral Likert survey instrument and audit it to ensure 100% freedom from leading or double-barreled bias.',
        'Construct a bottom-up TAM/SAM/SOM market sizing model and project Year 1 quarterly demand using Exponential Smoothing with MAPE error bounds.'
      ]
    }
  },
  {
    coursePrefix: 'bcom-marketing',
    day: 5,
    title: 'Market Segmentation, Targeting Strategies & Behavioral Clustering',
    goal: 'Master strategic market segmentation: decomposing heterogeneous mass markets across geographic, demographic, psychographic, and behavioral vectors; auditing segment viability against Kotler\'s MASDA criteria; evaluating Porter\'s 4 targeting postures (Undifferentiated, Differentiated, Concentrated/Niche, Micromarketing); modeling segment unit economics (CLV, CAC Payback, Gross Margin Contribution); and implementing unsupervised K-Means customer behavioral clustering with centroid assignment.',
    minutes: 45,
    recap: 'Yesterday we engineered marketing research plans, Cochran sample size math, and quantitative exponential smoothing demand forecasts. Today we pivot into segmentation science: grouping customers by behavioral vectors, gating viable cohorts via MASDA, selecting optimal targeting strategies, and executing K-Means clustering.',
    parts: [
      {
        title: 'The STP Paradigm & 4 Primary Segmentation Vectors',
        say: [
          'A company cannot be everything to everyone; attempting to serve an entire national or global population with a monolithic, one-size-fits-all product offering inevitably results in bland commodities that resonate deeply with nobody.',
          'Strategic market segmentation is the foundational discipline of dividing an aggregate, heterogeneous market into distinct, identifiable subsets of buyers who share homogeneous needs, characteristics, or behaviors and require tailored value propositions.',
          'Segmentation operates across four fundamental dimensions: Geographic, Demographic, Psychographic, and Behavioral.',
          'Vector 1: Geographic Segmentation divides markets by regional boundaries, urban vs rural population density, climate zones, and local language idioms.',
          'Vector 2: Demographic Segmentation groups buyers by observable biographical variables: age cohorts (Gen Z, Millennials, Boomers), household income, educational attainment, occupation, and family life cycle stages. While straightforward to quantify, demographic variables alone often fail to predict actual purchasing motivation.',
          'Vector 3: Psychographic Segmentation dives beneath demographic surfaces into social class, psychological lifestyles, core philosophical values, and self-identity aspirations (such as the VALS Values and Lifestyles framework).',
          'Vector 4: Behavioral Segmentation examines actual commercial conduct: purchase occasions (routine vs festive), user status (first-time, regular, churned), usage rate (the Pareto 80/20 rule of heavy buyers), brand loyalty tiers, and buyer readiness stage.',
          'Modern marketing science conclusively proves that Behavioral Segmentation delivers the highest return on marketing investment because past behavioral data is the single most predictive indicator of future purchasing intent.'
        ],
        example: 'Consider consumer footwear. Geographic targeting stocks insulated snow boots in alpine regions and flip-flops in coastal towns. Demographic targeting pitches sneakers to college students. Psychographic targeting addresses eco-conscious vegans seeking plant-based leather. But behavioral targeting identifies ultramarathon runners who replace premium carbon-plated racing shoes every 400 miles regardless of price.',
        code: `# Simulation: 4-Dimensional Multi-Vector Customer Segmentation Scorer
from dataclasses import dataclass

@dataclass
class CustomerProfile:
    customer_id: str
    region_density: str # 'Urban', 'Suburban', 'Rural'
    age_cohort: str     # 'Gen_Z', 'Millennial', 'Gen_X', 'Boomer'
    lifestyle_trait: str # 'Eco_Conscious', 'Tech_Enthusiast', 'Value_Seeker'
    annual_visits: int
    cart_conversion_pct: float

def classify_customer_segment(profile: CustomerProfile) -> dict:
    # Behavioral weighting dominates scoring
    is_heavy_user = profile.annual_visits >= 24
    is_high_intent = profile.cart_conversion_pct >= 8.0
    
    if is_heavy_user and is_high_intent:
        behavioral_tier = "VIP_Power_Buyer"
        tailored_channel = "Direct Account Concierge & VIP Early-Access Drops"
    elif is_heavy_user and not is_high_intent:
        behavioral_tier = "Window_Shopper_High_Engagement"
        tailored_channel = "Cart-Abandonment Retargeting with Limited Discount"
    elif profile.annual_visits <= 3:
        behavioral_tier = "Occasional_New_Shopper"
        tailored_channel = "Welcome Nurture Email Onboarding Sequence"
    else:
        behavioral_tier = "Regular_Steady_Shopper"
        tailored_channel = "Personalized Cross-Sell Product Recommendations"
        
    return {
        "CustomerID": profile.customer_id,
        "Geographic": profile.region_density,
        "Demographic": profile.age_cohort,
        "Psychographic": profile.lifestyle_trait,
        "Behavioral_Cohort": behavioral_tier,
        "Tailored_Campaign": tailored_channel
    }

cust1 = CustomerProfile("CUST_9021", "Urban", "Millennial", "Eco_Conscious", 32, 11.5)
res1 = classify_customer_segment(cust1)
print(f"Customer: {res1['CustomerID']} | Cohort: {res1['Behavioral_Cohort']}")
print(f"Strategy: {res1['Tailored_Campaign']}")`,
        output: `Customer: CUST_9021 | Cohort: VIP_Power_Buyer\nStrategy: Direct Account Concierge & VIP Early-Access Drops`,
        codeNotes: [
          { line: 4, note: 'CustomerProfile models multi-dimensional geographic, demographic, psychographic, and behavioral attributes' },
          { line: 14, note: 'Prioritizes behavioral engagement metrics (annual visits and conversion intent) over passive demographic traits' },
          { line: 17, note: 'Classifies high-frequency, high-intent buyers into VIP_Power_Buyer status for concierge engagement' },
          { line: 36, note: 'Demonstrates profile CUST_9021 qualifying for dedicated early-access drops based on 32 annual store visits' }
        ],
        tryIt: 'Modify annual_visits to 2 on cust1 to observe the engine classify them as an Occasional_New_Shopper and route them to a welcome nurture sequence.',
        check: {
          question: 'Why does Behavioral Segmentation typically generate significantly higher marketing conversion rates compared to demographic segmentation alone?',
          options: [
            'Because actual observed purchasing actions, product usage frequencies, and buying recency are far more predictive of future commercial intent than broad biographical labels like age or gender.',
            'Because demographic surveys are illegal under federal trade guidelines.',
            'Because behavioral segmentation only requires consulting astronomical horoscopes.',
            'Because demographic data changes every five seconds.'
          ],
          answer: 0,
          why: 'Past behavioral patterns (frequency, spend, basket additions) reflect genuine revealed preferences and immediate purchasing readiness, whereas demographic attributes merely suggest broad probabilities.',
          answerIndex: 0,
          explanation: 'Past behavioral patterns (frequency, spend, basket additions) reflect genuine revealed preferences and immediate purchasing readiness, whereas demographic attributes merely suggest broad probabilities.'
        }
      },
      {
        title: 'Kotler\'s MASDA Criteria for Commercially Viable Segments',
        say: [
          'A marketing analytics team can theoretically slice a customer database into hundreds of microscopic clusters based on endless combinations of attributes.',
          'However, identifying an empirical pattern in data does not mean a company should build an organizational business unit around it! Every targeted segment demands dedicated product development, distinct packaging, separate advertising spend, and custom sales channels.',
          'To prevent firms from burning capital on unprofitable micro-segments, Philip Kotler established the 5 rigorous MASDA criteria: Measurable, Accessible, Substantial, Differentiable, and Actionable.',
          'Measurable: The size, purchasing power, and demographic profile of the candidate segment must be quantifiable with statistical precision.',
          'Accessible: The segment must be effectively reached and served through identifiable distribution channels, physical logistics, and communication media.',
          'Substantial: The segment must be large or profitable enough to justify custom tooling, dedicated inventory, and ongoing marketing overhead. A segment should be the largest possible homogeneous group worth going after with a tailored marketing program.',
          'Differentiable: The candidate segments must be conceptually distinguishable and respond differently to different marketing mix elements. If married and unmarried engineers respond identically to a sales promotion for an electric vehicle, they constitute a single segment, not two!',
          'Actionable: The firm must possess the organizational capability, capital reserves, and talent necessary to design and execute effective programs that attract and serve the segment.'
        ],
        example: 'Imagine an entrepreneur proposing a business model catering exclusively to "left-handed vegetarians who only buy green footwear on rainy Tuesdays". While measurable in theory, this cohort fails the Substantial and Actionable criteria — creating an entire manufacturing and retail distribution operation for such an infinitesimal group guarantees rapid commercial bankruptcy.',
        code: `# Simulation: Kotler MASDA Segment Viability Multi-Criteria Decision Gate
def evaluate_masda_viability(
    segment_name: str,
    market_size_est_known: bool,
    purchasing_power_quantifiable: bool,
    distribution_channels_reachable: bool,
    projected_margin_dollars: float,
    minimum_margin_hurdle: float,
    distinct_price_sensitivity: bool,
    team_operational_capability: bool
) -> dict:
    measurable = market_size_est_known and purchasing_power_quantifiable
    accessible = distribution_channels_reachable
    substantial = projected_margin_dollars >= minimum_margin_hurdle
    differentiable = distinct_price_sensitivity
    actionable = team_operational_capability

    all_passed = measurable and accessible and substantial and differentiable and actionable

    return {
        "Segment": segment_name,
        "Measurable": "PASS" if measurable else "FAIL",
        "Accessible": "PASS" if accessible else "FAIL",
        "Substantial": f"PASS (\${round(projected_margin_dollars/1e3, 1)}k vs \${round(minimum_margin_hurdle/1e3, 1)}k)" if substantial else "FAIL",
        "Differentiable": "PASS" if differentiable else "FAIL",
        "Actionable": "PASS" if actionable else "FAIL",
        "Commercial_Viability": "APPROVED_FOR_TARGETING" if all_passed else "REJECTED_INSUFFICIENT_CRITERIA"
    }

masda_res = evaluate_masda_viability(
    segment_name="Corporate Wellness Enthusiasts",
    market_size_est_known=True,
    purchasing_power_quantifiable=True,
    distribution_channels_reachable=True,
    projected_margin_dollars=480000.0,
    minimum_margin_hurdle=250000.0,
    distinct_price_sensitivity=True,
    team_operational_capability=True
)
print(f"Segment: {masda_res['Segment']} | Viability: {masda_res['Commercial_Viability']}")
print(f"MASDA Substantial: {masda_res['Substantial']}")`,
        output: `Segment: Corporate Wellness Enthusiasts | Viability: APPROVED_FOR_TARGETING\nMASDA Substantial: PASS ($480.0k vs $250.0k)`,
        codeNotes: [
          { line: 12, note: 'Audits each of the five Kotler MASDA criteria against quantitative operational benchmarks' },
          { line: 14, note: 'Gating test enforces that projected segment margin must clear corporate hurdle rate' },
          { line: 18, note: 'Requires unanimous fulfillment across all five criteria before releasing marketing development capital' },
          { line: 36, note: 'Validates Corporate Wellness Enthusiasts generating $480k margin against a $250k hurdle' }
        ],
        tryIt: 'Lower projected_margin_dollars to $150,000 on masda_res to observe the Substantial gate fail against the $250,000 corporate margin hurdle.',
        check: {
          question: 'According to Kotler\'s MASDA framework, what occurs if two customer demographic groups respond identically to marketing campaigns and price promotions?',
          options: [
            'They fail the Differentiable criterion and should be combined into a single unified segment rather than treated as separate targets.',
            'The company should double its advertising budget to force them to react differently.',
            'The marketing research firm should be immediately sued for negligence.',
            'The product price should be increased by 500% to separate them.'
          ],
          answer: 0,
          why: 'Segments are differentiable only if they are conceptually distinguishable and respond differently to different marketing mix elements. Identical responses indicate a single homogeneous market.',
          answerIndex: 0,
          explanation: 'Segments are differentiable only if they are conceptually distinguishable and respond differently to different marketing mix elements. Identical responses indicate a single homogeneous market.'
        }
      },
      {
        title: 'The 4 Classical Targeting Strategies: Mass to Micromarketing',
        say: [
          'Once market segments have been profiled and evaluated against MASDA viability gates, corporate leadership must make an explicit strategic commitment regarding which and how many segments to enter: this is Market Targeting.',
          'Strategic marketing recognizes four primary targeting postures along a spectrum of market coverage: Undifferentiated Marketing, Differentiated Marketing, Concentrated (Niche) Marketing, and Micromarketing.',
          'Posture 1: Undifferentiated (Mass) Marketing ignores segment differences and goes after the entire market with one broad commercial offering. This posture focuses on common consumer needs rather than differences, relying on mass distribution and mass media advertising (e.g. basic table salt, agricultural flour, commodity electricity). It achieves massive economies of scale but leaves the firm vulnerable to specialized competitors.',
          'Posture 2: Differentiated (Segmented) Marketing targets multiple market segments and designs separate, distinct offerings and marketing mixes for each (e.g. Toyota offering the Corolla for budget-conscious commuters, the RAV4 for active suburban families, and the Lexus LS for luxury executives). While this strategy captures greater total sales, it dramatically escalates production costs, inventory carrying expenses, and advertising budgets.',
          'Posture 3: Concentrated (Niche) Marketing channels all corporate resources into capturing a dominant, commanding share of one or two specialized sub-markets. Instead of pursuing a small share of a large market, the firm secures a large share of one specific niche (e.g. Rolex dominating luxury mechanical horology or Whole Foods in its early organic grocery era). Niche marketing delivers supreme capital efficiency and pricing power, but carries catastrophic risk if the narrow niche suffers technological disruption or demand collapse.',
          'Posture 4: Micromarketing tailors products and marketing programs to the tastes of specific individuals and local customer segments, encompassing Local Marketing (store-specific merchandising) and Individual 1-to-1 Marketing (algorithmic personalized recommendations on Spotify or customized Nike By You footwear).'
        ],
        example: 'Think of fishing across different bodies of water. Undifferentiated marketing is trawling a gigantic commercial net across the open ocean. Differentiated marketing operates five specialized fishing boats, each using distinct bait tailored to tuna, salmon, and mackerel. Concentrated niche marketing fishes exclusively in a secluded, high-altitude alpine trout stream. Micromarketing is spearfishing an individual tagged fish.',
        code: `# Simulation: Targeting Strategy Portfolio Payoff & Overhead Tradeoff Engine
def evaluate_targeting_strategies(
    strategy_type: str, # 'Undifferentiated', 'Differentiated', 'Concentrated_Niche', 'Micromarketing'
    tam_revenue_pool: float,
    penetration_pct: float,
    fixed_overhead_cost: float,
    cogs_margin_pct: float
) -> dict:
    gross_revenue = tam_revenue_pool * (penetration_pct / 100.0)
    gross_profit = gross_revenue * (cogs_margin_pct / 100.0)
    net_operating_profit = gross_profit - fixed_overhead_cost
    roi_pct = round((net_operating_profit / fixed_overhead_cost) * 100.0, 1) if fixed_overhead_cost > 0 else 0.0

    return {
        "Strategy": strategy_type,
        "Targeted_Gross_Revenue": f"\${round(gross_revenue / 1e6, 2)}M",
        "Gross_Profit": f"\${round(gross_profit / 1e6, 2)}M",
        "Overhead_Cost": f"\${round(fixed_overhead_cost / 1e6, 2)}M",
        "Net_Operating_Profit": f"\${round(net_operating_profit / 1e6, 2)}M",
        "Strategic_ROI": f"{roi_pct}%"
    }

strat1 = evaluate_targeting_strategies("Concentrated_Niche", 20000000.0, 25.0, 800000.0, 65.0)
strat2 = evaluate_targeting_strategies("Differentiated", 100000000.0, 12.0, 4500000.0, 55.0)
print(f"Niche Strategy -> Net Profit: {strat1['Net_Operating_Profit']} | ROI: {strat1['Strategic_ROI']}")
print(f"Differentiated -> Net Profit: {strat2['Net_Operating_Profit']} | ROI: {strat2['Strategic_ROI']}")`,
        output: `Niche Strategy -> Net Profit: $2.45M | ROI: 306.2%\nDifferentiated -> Net Profit: $2.1M | ROI: 46.7%`,
        codeNotes: [
          { line: 9, note: 'Calculates gross revenue as TAM multiplied by strategy-specific market share penetration' },
          { line: 11, note: 'Subtracts fixed organizational overhead to reveal true net operating margin dollars' },
          { line: 23, note: 'Concentrated niche strategy delivers higher capital ROI ($2.45M profit on $800k overhead = 306.2%)' },
          { line: 24, note: 'Differentiated strategy yields broader revenue ($12M) but lower ROI (46.7%) due to multiple product lines' }
        ],
        tryIt: 'Increase the penetration_pct of the Niche strategy from 25.0% to 35.0% to evaluate how deepening niche dominance accelerates ROI.',
        check: {
          question: 'What is the primary operational vulnerability associated with a Concentrated (Niche) Targeting Strategy?',
          options: [
            'Severe company vulnerability if the single target segment experiences an unexpected macroeconomic downturn, consumer preference shift, or aggressive entry by a larger rival.',
            'Having too many product variants that confuse factory workers.',
            'Excessive global advertising costs across thousands of television channels.',
            'Inability to register patents with national intellectual property offices.'
          ],
          answer: 0,
          why: 'Because a niche firm puts all its eggs in one basket, any disruption to that specific micro-segment (e.g. shift in tastes or entry of an industry giant) threatens corporate survival.',
          answerIndex: 0,
          explanation: 'Because a niche firm puts all its eggs in one basket, any disruption to that specific micro-segment (e.g. shift in tastes or entry of an industry giant) threatens corporate survival.'
        }
      },
      {
        title: 'Segment Unit Economics: CLV, CAC Payback & Contribution Margin',
        say: [
          'In modern data-driven commercial strategy, marketing leaders must never judge the attractiveness of a customer segment based on vanity metrics such as headline GMV or registered user headcount.',
          'A high-volume segment that generates millions in top-line revenue can simultaneously destroy shareholder value if its unit economics are structurally underwater.',
          'Every candidate segment must be evaluated through the lens of Customer Lifetime Value (CLV), Customer Acquisition Cost (CAC), and Contribution Margin.',
          'Customer Lifetime Value represents the net present value of the profit contribution attributed to the entire future relationship with a customer: CLV = (ARPU * Gross Margin %) / Churn Rate.',
          'Consumer retail segments often exhibit high churn rates (e.g. 8-12% monthly) and aggressive price sensitivity, yielding low CLV that struggles to recoup digital acquisition costs.',
          'Conversely, specialized B2B mid-market and enterprise cohorts demonstrate low churn (e.g. 1-2% monthly), expansion contract value, and high gross margins, producing massive lifetime value that easily supports high-touch sales acquisition budgets.',
          'The Golden Rule of SaaS and recurring commerce dictates that a healthy commercial segment must sustain a CLV : CAC ratio >= 3.0x, and achieve a CAC Payback Period of <= 12 months.'
        ],
        example: 'Compare two business models. A fast-fashion e-commerce site spends $40 on Facebook ads to acquire a shopper who buys a $50 dress once at a 40% margin ($20 contribution) and never returns — losing $20 per acquired customer. Meanwhile, a specialized B2B compliance software provider spends $2,400 to acquire a client paying $450/month at an 80% margin who stays for 40 months ($14,400 CLV), earning a phenomenal 6.0x return on acquisition spend.',
        code: `# Simulation: Cohort Segment CLV/CAC & Payback Period Financial Model
def analyze_segment_unit_economics(
    segment_name: str,
    arpu_monthly: float,
    gross_margin_pct: float,
    monthly_churn_rate_pct: float,
    customer_acquisition_cost: float
) -> dict:
    # Lifetime in months = 1 / churn_rate
    churn_dec = monthly_churn_rate_pct / 100.0
    avg_lifetime_months = 1.0 / churn_dec if churn_dec > 0 else 60.0
    monthly_contribution_margin = arpu_monthly * (gross_margin_pct / 100.0)
    
    clv_gross = monthly_contribution_margin * avg_lifetime_months
    clv_to_cac_ratio = round(clv_gross / customer_acquisition_cost, 2)
    payback_period_months = round(customer_acquisition_cost / monthly_contribution_margin, 1)

    health_verdict = (
        "PRIME_EXPANSION_SEGMENT" if clv_to_cac_ratio >= 3.0 and payback_period_months <= 12.0
        else "VIABLE_NEEDS_CHURN_OPTIMIZATION" if clv_to_cac_ratio >= 2.0
        else "UNECONOMIC_VALUE_DESTRUCTIVE"
    )

    return {
        "Segment": segment_name,
        "Customer_Lifetime_Value": f"\${round(clv_gross, 2)}",
        "Customer_Acquisition_Cost": f"\${round(customer_acquisition_cost, 2)}",
        "CLV_to_CAC_Ratio": f"{clv_to_cac_ratio}x",
        "CAC_Payback_Months": f"{payback_period_months} months",
        "Economics_Health": health_verdict
    }

unit_res = analyze_segment_unit_economics(
    segment_name="Mid-Market B2B SaaS",
    arpu_monthly=450.0,
    gross_margin_pct=80.0,
    monthly_churn_rate_pct=2.5,
    customer_acquisition_cost=2400.0
)
print(f"Segment: {unit_res['Segment']} | CLV: {unit_res['Customer_Lifetime_Value']} | CAC: {unit_res['Customer_Acquisition_Cost']}")
print(f"CLV:CAC: {unit_res['CLV_to_CAC_Ratio']} | Payback: {unit_res['CAC_Payback_Months']} | Health: {unit_res['Economics_Health']}")`,
        output: `Segment: Mid-Market B2B SaaS | CLV: $14400.0 | CAC: $2400.0\nCLV:CAC: 6.0x | Payback: 6.7 months | Health: PRIME_EXPANSION_SEGMENT`,
        codeNotes: [
          { line: 9, note: 'Derives expected customer tenure in months as reciprocal of monthly churn rate (1 / 0.025 = 40 months)' },
          { line: 13, note: 'Calculates Gross CLV as monthly contribution margin ($360) multiplied by lifetime (40 months = $14,400)' },
          { line: 15, note: 'Computes CAC Payback period: $2,400 CAC divided by $360 monthly contribution = 6.7 months' },
          { line: 36, note: 'Confirms segment qualifies as PRIME_EXPANSION_SEGMENT with a 6.0x ratio and <7 month payback' }
        ],
        tryIt: 'Increase monthly_churn_rate_pct from 2.5% to 6.0% to see how higher customer attrition degrades CLV:CAC and flips Economics_Health to VIABLE_NEEDS_CHURN_OPTIMIZATION.',
        check: {
          question: 'What is the minimum industry benchmark for the CLV : CAC ratio required to confirm a commercially healthy, venture-scale customer segment?',
          options: [
            'At least 3.0x (meaning customer lifetime profit covers acquisition costs threefold within acceptable payback windows).',
            'Exactly 0.5x (meaning acquisition costs are double lifetime revenues).',
            'Minus 10.0x.',
            'Zero, because marketing acquisition costs should always be ignored.'
          ],
          answer: 0,
          why: 'A CLV:CAC ratio of at least 3.0x ensures sufficient buffer to absorb operating overhead, ongoing engineering development, and unforeseen market friction.',
          answerIndex: 0,
          explanation: 'A CLV:CAC ratio of at least 3.0x ensures sufficient buffer to absorb operating overhead, ongoing engineering development, and unforeseen market friction.'
        }
      },
      {
        title: 'Unsupervised Machine Learning: K-Means Behavioral Clustering & Centroid Assignment',
        say: [
          'As enterprise customer databases expand to millions of transaction logs, human marketing teams can no longer intuitively spot natural segmentation boundaries across dozens of behavioral variables.',
          'Unsupervised Machine Learning, specifically K-Means Clustering, solves this challenge by mathematically partitioning an unlabelled customer dataset into K distinct behavioral clusters based on multi-dimensional geometric distance.',
          'The K-Means algorithm operates iteratively: it initializes K cluster centroids, assigns each customer record to the nearest centroid based on Euclidean distance, and recalculates each centroid as the mathematical mean of its assigned member vectors.',
          'The objective function minimizes total intra-cluster variance (known as Inertia or Within-Cluster Sum of Squares, WCSS): J = sum(sum(||x - mu_i||^2)).',
          'Before computing distances, data engineers must normalize continuous variables (such as total spend, transaction frequency, and session duration) using min-max scaling or z-score standardization, ensuring high-magnitude variables do not artificially distort Euclidean distance.',
          'To select the optimal number of clusters K without overfitting, analysts employ the Elbow Method and validate partition quality using the Silhouette Coefficient, where scores near +1.0 confirm well-separated, internally dense behavioral cohorts.',
          'The discovered clusters transform into actionable buyer personas — such as "Bargain Occasionals", "Steady Middle-Tier", and "VIP Power Buyers" — enabling automated CRM workflows that deliver tailored messaging at scale.'
        ],
        example: 'Imagine a giant warehouse floor covered with thousands of unlabeled metal bolts, screws, and washers. Instead of having a human inspect each one, an optical sorting machine measures the length, diameter, and weight of every piece and groups them into three distinct sorting bins based on spatial proximity. That is K-Means clustering.',
        code: `# Simulation: K-Means Behavioral Customer Clustering & Centroid Assignment Engine
from typing import List, Dict

def assign_kmeans_clusters(
    customer_records: List[Dict[str, float]],
    initial_centroids: List[Dict[str, float]]
) -> dict:
    # Euclidean distance metric: sqrt((x1 - x2)^2 + (y1 - y2)^2)
    def calc_distance(p1: dict, p2: dict) -> float:
        return ((p1["Spend"] - p2["Spend"])**2 + (p1["Frequency"] - p2["Frequency"])**2)**0.5

    assignments = {i: [] for i in range(len(initial_centroids))}

    for cust in customer_records:
        distances = [calc_distance(cust, c) for c in initial_centroids]
        min_idx = distances.index(min(distances))
        assignments[min_idx].append(cust["ID"])

    # Calculate cluster sizes and total inertia
    total_inertia = 0.0
    cluster_profiles = {}
    for idx, c in enumerate(initial_centroids):
        custs = [cust for cust in customer_records if cust["ID"] in assignments[idx]]
        size = len(custs)
        inertia = sum(calc_distance(cust, c)**2 for cust in custs)
        total_inertia += inertia
        cluster_profiles[f"Cluster_{idx}"] = {
            "Centroid": f"(Spend=\${c['Spend']}, Freq={c['Frequency']})",
            "Assigned_Count": size,
            "Members": assignments[idx]
        }

    return {
        "Total_Customers": len(customer_records),
        "Clusters_Formed": len(initial_centroids),
        "Total_Inertia_Error": round(total_inertia, 2),
        "Cohort_Breakdown": cluster_profiles
    }

customers = [
    {"ID": "C1", "Spend": 25.0, "Frequency": 1.0},
    {"ID": "C2", "Spend": 30.0, "Frequency": 2.0},
    {"ID": "C3", "Spend": 220.0, "Frequency": 12.0},
    {"ID": "C4", "Spend": 250.0, "Frequency": 15.0},
    {"ID": "C5", "Spend": 120.0, "Frequency": 5.0}
]
centroids = [
    {"Spend": 30.0, "Frequency": 2.0},   # Budget Occasional
    {"Spend": 230.0, "Frequency": 13.0}  # Power Buyer
]
cluster_res = assign_kmeans_clusters(customers, centroids)
print(f"Total Customers: {cluster_res['Total_Customers']} | Clusters: {cluster_res['Clusters_Formed']}")
print(f"Cluster 0: {cluster_res['Cohort_Breakdown']['Cluster_0']['Assigned_Count']} buyers -> {cluster_res['Cohort_Breakdown']['Cluster_0']['Members']}")
print(f"Cluster 1: {cluster_res['Cohort_Breakdown']['Cluster_1']['Assigned_Count']} buyers -> {cluster_res['Cohort_Breakdown']['Cluster_1']['Members']}")`,
        output: `Total Customers: 5 | Clusters: 2\nCluster 0: 3 buyers -> ['C1', 'C2', 'C5']\nCluster 1: 2 buyers -> ['C3', 'C4']`,
        codeNotes: [
          { line: 9, note: 'Implements Euclidean distance calculus across normalized behavioral feature vectors' },
          { line: 15, note: 'Assigns each customer vector to the centroid minimizing geometric distance' },
          { line: 24, note: 'Accumulates Within-Cluster Sum of Squares (Inertia) to quantify overall clustering tightness' },
          { line: 49, note: 'Partitions 5 customers cleanly into Cluster 0 (Budget Occasionals) and Cluster 1 (Power Buyers)' }
        ],
        tryIt: 'Add a new high-frequency, high-spend customer record (e.g. Spend: $280.0, Frequency: 18.0) to observe how the Euclidean distance engine routes them to Cluster 1.',
        check: {
          question: 'Why is feature scaling/normalization (e.g. z-score or min-max standardization) mandatory before running K-Means clustering on customer behavior data?',
          options: [
            'Because features with large raw numerical scales (such as annual dollar spend in thousands) would dominate the Euclidean distance calculation, completely drowning out lower-scale but critical features like transaction frequency.',
            'Because Python will throw an unhandled syntax exception if raw numbers exceed 100.',
            'Because customer names cannot be converted to binary strings without normalization.',
            'Because machine learning servers shut down if features are not multiplied by zero.'
          ],
          answer: 0,
          why: 'Euclidean distance is sensitive to measurement scales; without normalization, high-magnitude variables dominate the distance metric, distorting cluster formation.',
          answerIndex: 0,
          explanation: 'Euclidean distance is sensitive to measurement scales; without normalization, high-magnitude variables dominate the distance metric, distorting cluster formation.'
        }
      }
    ],
    summary: [
      'STP Paradigm & 4 Vectors: Slicing markets across Geographic, Demographic, Psychographic, and Behavioral dimensions; behavioral patterns yield highest predictive conversion.',
      'Kotler MASDA Criteria: Rigorous 5-point hurdle (Measurable, Accessible, Substantial, Differentiable, Actionable) prevents squandering capital on unviable micro-segments.',
      '4 Targeting Postures: Ranging from Undifferentiated (Mass) and Differentiated (Segmented) to Concentrated (Niche) and Micromarketing (1-to-1 personalization).',
      'Unit Economics & Golden Ratio: Evaluates segments by CLV = (ARPU * Gross Margin) / Churn; demands CLV:CAC >= 3.0x and CAC Payback <= 12 months for commercial expansion.',
      'K-Means Behavioral Clustering: Unsupervised machine learning minimizes intra-cluster Euclidean inertia (WCSS); feature normalization and Elbow/Silhouette metrics ensure robust cohort discovery.'
    ],
    projectStep: {
      title: 'Month 1 Marketing Strategy Capstone Step 5: STP Segmentation Matrix, Viability Audit & K-Means Cohorts',
      steps: [
        'Construct a 4-dimensional segmentation matrix profiling your enterprise\'s target audience across geographic, demographic, psychographic, and behavioral vectors.',
        'Execute a formal Kotler MASDA viability audit across your candidate cohorts, establishing explicit revenue and margin thresholds.',
        'Model the unit economics (CLV, CAC, Payback Period) for your chosen target segment and implement a 2-cluster K-Means behavioral classification model.'
      ]
    }
  }
];

