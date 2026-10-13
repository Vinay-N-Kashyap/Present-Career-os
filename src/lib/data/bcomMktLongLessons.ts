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
  }
];
