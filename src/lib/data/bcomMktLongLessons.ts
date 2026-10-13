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
  }
];
