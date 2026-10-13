import type { LongLesson } from './longLessons';

/**
 * E-Commerce Strategy & Marketplace Economics (Course: bcom_ecom)
 * Day 1: Two-Sided Marketplaces, Dynamic Pricing, Cart Funnels & Fulfillment SLAs.
 */
export const BCOM_ECOM_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'bcom_ecom',
    day: 1,
    title: 'Marketplace Platform Economics, Dynamic Pricing & Order Fulfillment SLAs',
    goal: 'Master digital commerce economics: two-sided network liquidity equations, take-rate revenue modeling, price elasticity algorithms, checkout funnel conversion optimization, and distributed order fulfillment logistics.',
    minutes: 40,
    recap: 'Welcome to E-Commerce & Marketplace Economics. In digital retail, profitability is governed by unit economics, conversion funnels, algorithmic pricing, and fulfillment logistics rather than simple storefront design.',
    parts: [
      {
        title: 'Two-Sided Marketplace Platform Economics & Take Rates',
        say: [
          'In traditional e-commerce (first-party retail, like classic Amazon retail or Wayfair), the merchant buys wholesale inventory, holds it on their balance sheet, and sells it at a retail markup.',
          'In a Two-Sided Platform Marketplace (like eBay, Airbnb, Uber, or Amazon 3P Marketplace), the platform facilitates transactions between independent third-party Sellers and Buyers without taking title to the inventory.',
          'The core metric of marketplace volume is Gross Merchandise Value (GMV): the total dollar value of all goods sold through the platform. The platform\'s actual earned revenue is determined by the Take Rate (Rake %): Net Revenue = GMV * Take Rate %.',
          'Take rates vary dramatically based on value added: commodity classifieds take 2-5%, ride-hailing takes 20-25%, and app stores take 15-30%. If a marketplace sets its take rate too high, sellers disintermediate and transact off-platform; if too low, the platform cannot fund buyer acquisition.'
        ],
        example: 'If Etsy merchants sell $10,000,000 worth of handmade crafts in a month, Etsy does NOT report $10M in revenue! With a 10% blended take rate (transaction fees + payment processing + listing fees), Etsy records $1,000,000 in net revenue.',
        code: `# Simulation: Marketplace GMV, Take Rate & Network Liquidity Modeling
from dataclasses import dataclass

@dataclass
class MarketplaceFinancials:
    gmv: float                  # Gross Merchandise Value
    base_commission_pct: float  # Base transaction take rate
    payment_fee_pct: float      # Payment processing pass-through
    listing_fees: float         # Fixed seller listing fee pool
    seller_payout_reserve: float # Escrow held for returns/disputes

class MarketplaceEconomicsEngine:
    @staticmethod
    def compute_statement(metrics: MarketplaceFinancials) -> dict:
        transaction_commission = metrics.gmv * metrics.base_commission_pct
        payment_processing_rev = metrics.gmv * metrics.payment_fee_pct
        net_platform_revenue = transaction_commission + payment_processing_rev + metrics.listing_fees
        
        blended_take_rate = (net_platform_revenue / metrics.gmv) * 100.0
        seller_disbursement = metrics.gmv - net_platform_revenue - metrics.seller_payout_reserve

        return {
            "Total_GMV": round(metrics.gmv, 2),
            "Commission_Revenue": round(transaction_commission, 2),
            "Payment_Revenue": round(payment_processing_rev, 2),
            "Listing_Fee_Revenue": round(metrics.listing_fees, 2),
            "Net_Platform_Revenue": round(net_platform_revenue, 2),
            "Blended_Take_Rate_Pct": round(blended_take_rate, 2),
            "Net_Seller_Disbursement": round(seller_disbursement, 2)
        }

quarterly_data = MarketplaceFinancials(
    gmv=25000000.0,            # $25M GMV processed
    base_commission_pct=0.08,   # 8% Platform fee
    payment_fee_pct=0.029,      # 2.9% Payment gateway
    listing_fees=150000.0,      # $150k in seller promotions & listing fees
    seller_payout_reserve=500000.0 # $500k held in 30-day dispute reserve
)

results = MarketplaceEconomicsEngine.compute_statement(quarterly_data)
print("Two-Sided Marketplace Quarterly Statement:")
print(f"Gross Merchandise Value (GMV): \${results['Total_GMV']:,}")
print(f"Net Platform Revenue:          \${results['Net_Platform_Revenue']:,}")
print(f"Blended Take Rate:             {results['Blended_Take_Rate_Pct']}%")
print(f"Disbursed to 3P Sellers:       \${results['Net_Seller_Disbursement']:,}")`,
        output: `Two-Sided Marketplace Quarterly Statement:\nGross Merchandise Value (GMV): $25,000,000.0\nNet Platform Revenue:          $2,875,000.0\nBlended Take Rate:             11.5%\nDisbursed to 3P Sellers:       $21,625,000.0`,
        tryIt: 'Increase the platform commission from 8% to 12% and verify that Net Platform Revenue expands from $2.875M to $3.875M.',
        check: {
          question: 'Why must e-commerce platforms distinguish between Gross Merchandise Value (GMV) and GAAP Net Revenue in financial disclosures?',
          options: [
            'Because the platform acts as an agent rather than a principal, only the take-rate commission belongs to the platform under ASC 606 revenue recognition.',
            'Because GMV includes government sales tax that the platform is legally forbidden from calculating.',
            'Because 3P marketplace transactions are exempt from all federal banking regulations.',
            'Because GMV only counts items that are returned by customers within 30 days.'
          ],
          answerIndex: 0,
          explanation: 'Under ASC 606 (Principal vs Agent guidance), if a platform does not hold inventory risk or control the goods before transfer, it cannot report the full transaction value as revenue. Only its net take rate commission qualifies as platform revenue.'
        }
      },
      {
        title: 'Dynamic Pricing Algorithms & Price Elasticity of Demand',
        say: [
          'In high-volume digital commerce, static pricing is dead. Algorithmic dynamic pricing constantly adjusts prices based on inventory velocity, competitor scrapers, and demand signals.',
          'Price Elasticity of Demand (PED) measures how sensitive buyer demand is to price fluctuations: PED = (% Change in Quantity Demanded) / (% Change in Price).',
          'When |PED| > 1.0 (Elastic Demand), lowering the price by 10% increases sales volume by more than 10%, expanding total revenue. When |PED| < 1.0 (Inelastic Demand), increasing price raises total revenue because volume barely declines.',
          'The microeconomic optimal pricing formula links marginal cost (MC) and elasticity: Optimal Price P* = MC * (PED / (PED + 1)).',
          'Automated repricers enforce hard guardrails: floor price protections guarantee that algorithmic price wars never erode the gross margin below the required threshold.'
        ],
        example: 'Airline tickets and ride-sharing surges are classic dynamic pricing: when supply is constrained and demand is inelastic, prices surge to maximize revenue. In consumer electronics, algorithmic repricers match competitor promotions within seconds while defending minimum margins.',
        code: `# Simulation: Algorithmic Dynamic Pricing & Elasticity Revenue Optimizer
class DynamicPricingEngine:
    def __init__(self, unit_marginal_cost: float, floor_margin_pct: float = 0.20):
        self.mc = unit_marginal_cost
        self.min_floor_price = unit_marginal_cost * (1.0 + floor_margin_pct)

    def calculate_elasticity(self, p1: float, q1: int, p2: float, q2: int) -> float:
        pct_delta_q = (q2 - q1) / q1
        pct_delta_p = (p2 - p1) / p1
        if pct_delta_p == 0:
            return 0.0
        return pct_delta_q / pct_delta_p

    def optimize_price(self, elasticity: float, competitor_price: float) -> dict:
        # Microeconomic optimal price formula: P* = MC * (e / (e + 1))
        # Note: elasticity is negative for standard downward-sloping demand
        e = elasticity if elasticity < 0 else -elasticity
        
        if e <= -1.05:
            theoretical_opt_price = self.mc * (e / (e + 1.0))
        else:
            theoretical_opt_price = self.min_floor_price * 1.5 # Inelastic monopoly limit

        # Guardrail: never undercut competitor below floor margin
        recommended_price = max(self.min_floor_price, min(theoretical_opt_price, competitor_price - 0.05))

        return {
            "Marginal_Cost": self.mc,
            "Floor_Price_Limit": round(self.min_floor_price, 2),
            "Estimated_Elasticity": round(e, 2),
            "Competitor_Benchmark": round(competitor_price, 2),
            "Recommended_Dynamic_Price": round(recommended_price, 2),
            "Gross_Margin_Pct": round(((recommended_price - self.mc) / recommended_price) * 100.0, 1)
        }

engine = DynamicPricingEngine(unit_marginal_cost=40.0, floor_margin_pct=0.25) # $40 cost, 25% min margin ($50 floor)
# Experiment: Price raised from $60 to $66 (+10%), Sales dropped from 1000 to 800 units (-20%)
ped = engine.calculate_elasticity(p1=60.0, q1=1000, p2=66.0, q2=800)
opt = engine.optimize_price(elasticity=ped, competitor_price=64.99)

print(f"Calculated Elasticity:  {ped:.2f} (Elastic)")
print(f"Floor Price Boundary:  \${opt['Floor_Price_Limit']}")
print(f"Recommended Price:     \${opt['Recommended_Dynamic_Price']}")
print(f"Resulting Margin:      {opt['Gross_Margin_Pct']}%")`,
        output: `Calculated Elasticity:  -2.00 (Elastic)\nFloor Price Boundary:  $50.0\nRecommended Price:     $64.94\nResulting Margin:      38.4%`,
        tryIt: 'Drop competitor price to $45.00 and verify that the algorithm respects the $50.00 Floor Price Limit rather than selling at a loss.',
        check: {
          question: 'What is the primary danger of deploying an unconstrained competitive repricer bot in an e-commerce catalog?',
          options: [
            'A "race to the bottom" price war where two competing bots undercut each other down to $0.01 unless hard margin floor guardrails are enforced.',
            'The repricer bot will automatically convert customer shopping carts into common stock.',
            'Dynamic repricing violates international treaties on ocean shipping tariffs.',
            'Competitor prices are mathematically impossible to detect using web APIs.'
          ],
          answerIndex: 0,
          explanation: 'Without strict floor prices (e.g., Cost + 20% margin), opposing algorithmic repricers will continuously undercut each other in an infinite decrement loop, destroying operating margins and causing catastrophic financial loss.'
        }
      },
      {
        title: 'Cart Abandonment Funnels & Conversion Rate Optimization',
        say: [
          'The E-Commerce conversion funnel is the critical pipeline through which prospective visitors become paying buyers: Storefront Impressions -> Product Page (PDP) -> Add-to-Cart (ATC) -> Initiate Checkout (IC) -> Payment Completed.',
          'Average e-commerce cart abandonment is approximately 70%. That means 7 out of 10 shoppers who deliberately place an item in their cart leave without buying.',
          'The top causes of cart abandonment are unexpected shipping costs, forced account creation, lack of local payment methods (Apple Pay, UPI, Klarna), and friction-heavy multi-page checkout flows.',
          'Conversion Rate Optimization (CRO) uses step-by-step drop-off analysis: Conversion Rate (CVR) = Total Orders / Unique Storefront Visitors. Even a 0.5% increase in CVR can double the net operating income of an online retailer.',
          'Automated abandoned-cart recovery sequences (triggered via SMS/email at 1 hour, 24 hours, and 72 hours) recapture between 8% and 15% of abandoned checkout volume.'
        ],
        example: 'A store with 1,000,000 monthly visitors, a $100 Average Order Value, and a 2.0% conversion rate generates $2,000,000 in revenue. If checkout optimization improves CVR to 2.5%, revenue jumps to $2,500,000—generating $500,000 in pure incremental top-line revenue with ZERO extra ad spend!',
        code: `# Simulation: E-Commerce Funnel Drop-off & Cart Abandonment Recovery
class EcomFunnelAnalyzer:
    def __init__(self, visitors: int, pdp_views: int, carts: int, checkouts: int, orders: int):
        self.visitors = visitors
        self.pdp_views = pdp_views
        self.carts = carts
        self.checkouts = checkouts
        self.orders = orders

    def compute_funnel_metrics(self, abandoned_recovery_rate: float = 0.10) -> dict:
        overall_cvr = (self.orders / self.visitors) * 100.0
        pdp_to_cart_rate = (self.carts / self.pdp_views) * 100.0
        cart_abandonment_rate = ((self.carts - self.orders) / self.carts) * 100.0
        
        # Recovery calculation
        abandoned_carts = self.carts - self.orders
        recovered_orders = int(abandoned_carts * abandoned_recovery_rate)
        new_total_orders = self.orders + recovered_orders
        optimized_cvr = (new_total_orders / self.visitors) * 100.0

        return {
            "Total_Visitors": self.visitors,
            "Add_To_Cart_Rate": round(pdp_to_cart_rate, 1),
            "Baseline_Orders": self.orders,
            "Cart_Abandonment_Pct": round(cart_abandonment_rate, 1),
            "Baseline_CVR_Pct": round(overall_cvr, 2),
            "Recovered_Orders": recovered_orders,
            "Optimized_CVR_Pct": round(optimized_cvr, 2)
        }

funnel = EcomFunnelAnalyzer(
    visitors=100000,
    pdp_views=45000,
    carts=12000,
    checkouts=6000,
    orders=2400
)

report = funnel.compute_funnel_metrics(abandoned_recovery_rate=0.12)
print("E-Commerce Conversion Funnel Diagnostics:")
print(f"Total Visitors:         {report['Total_Visitors']:,}")
print(f"Cart Abandonment Rate:  {report['Cart_Abandonment_Pct']}%")
print(f"Baseline Conversion:    {report['Baseline_CVR_Pct']}%")
print(f"Recovered Cart Orders:  +{report['Recovered_Orders']:,} Orders")
print(f"Optimized Storefront:   {report['Optimized_CVR_Pct']}%")`,
        output: `E-Commerce Conversion Funnel Diagnostics:\nTotal Visitors:         100,000\nCart Abandonment Rate:  80.0%\nBaseline Conversion:    2.4%\nRecovered Cart Orders:  +1,152 Orders\nOptimized Storefront:   3.55%`,
        tryIt: 'Double the initial orders to 4,800 and verify that baseline conversion rate jumps from 2.4% to 4.8%.',
        check: {
          question: 'Why does implementing 1-Click Express Checkout (e.g., Apple Pay, Shop Pay, Google Pay) dramatically reduce cart abandonment?',
          options: [
            'It eliminates manual form entry of 16-digit credit card numbers, billing addresses, and shipping details, removing friction at the highest-drop-off step.',
            'It guarantees that shipping carriers deliver the packages for free.',
            'It automatically refunds 50% of the product cost to the consumer.',
            'It prevents the consumer from comparing prices on other search engines.'
          ],
          answerIndex: 0,
          explanation: 'Typing addresses and card details on a mobile screen is the single largest friction point in digital commerce. 1-Click wallets pull pre-saved credentials in one biometric tap, slashing drop-off rates at the final checkout step.'
        }
      },
      {
        title: 'Distributed Inventory Order Fulfillment & Warehouse SLAs',
        say: [
          'In modern e-commerce, the customer expects same-day or 2-day delivery. Fulfilling customer orders requires a Distributed Fulfillment Network: positioning inventory across regional warehouses (Fulfillment Centers FCs) close to high-density consumer populations.',
          'When an order arrives, the Order Management System (OMS) solves a routing problem: select the warehouse that minimizes shipping zone costs and delivery transit days while avoiding Out-Of-Stock (OOS) conditions.',
          'Split Shipments are the mortal enemy of fulfillment margin: if a customer orders 2 items and they are shipped from two different warehouses in separate boxes, shipping and packaging costs almost double, wiping out the entire operating profit of the order.',
          'Warehouse fulfillment velocity is governed by strict Service Level Agreements (SLAs): Same-Day Cutoff times (e.g., orders placed before 2:00 PM must be Picked, Packed, and Handed to Carrier by 6:00 PM) with OTIF (On-Time In-Full) delivery targets above 98.5%.'
        ],
        example: 'If an order has $15 in gross profit, and a single-box shipment costs $7, you make $8 net profit. But if the items are split between Dallas and Atlanta, you pay two separate carrier fees of $7 each ($14 total). Your net profit collapses from $8 to $1!',
        code: `# Simulation: Distributed Fulfillment Routing & Split Shipment Penalty
from typing import List, Dict

class FulfillmentRouter:
    def __init__(self, warehouse_inventory: Dict[str, Dict[str, int]]):
        # warehouse -> sku -> available stock
        self.inventory = warehouse_inventory
        self.shipping_cost_single = 7.50
        self.shipping_cost_split_penalty = 13.00 # Two shipments in separate boxes

    def route_order(self, order_skus: List[str]) -> dict:
        # Check if single warehouse can fulfill all items (No split)
        candidate_warehouses = []
        for wh, stock in self.inventory.items():
            if all(stock.get(sku, 0) >= 1 for sku in order_skus):
                candidate_warehouses.append(wh)

        if candidate_warehouses:
            chosen_wh = candidate_warehouses[0]
            # Deduct stock
            for sku in order_skus:
                self.inventory[chosen_wh][sku] -= 1
            return {
                "Routing": "SINGLE_NODE_FULFILLMENT",
                "Warehouses_Dispatched": [chosen_wh],
                "Fulfillment_Cost": self.shipping_cost_single,
                "Split_Shipment": False
            }
        else:
            # Must split shipment across multiple warehouses
            return {
                "Routing": "MULTI_NODE_SPLIT_SHIPMENT",
                "Warehouses_Dispatched": ["FC_East", "FC_West"],
                "Fulfillment_Cost": self.shipping_cost_split_penalty,
                "Split_Shipment": True
            }

stock_map = {
    "FC_East": {"SKU_SHIRT": 10, "SKU_SHOES": 0},
    "FC_West": {"SKU_SHIRT": 5, "SKU_SHOES": 8}
}

router = FulfillmentRouter(stock_map)
# Order 1: Shirt + Shoes (West has both!)
o1 = router.route_order(["SKU_SHIRT", "SKU_SHOES"])
print(f"Order 1 Routing: {o1['Routing']} -> Cost \${o1['Fulfillment_Cost']} (Split: {o1['Split_Shipment']})")

# Order 2: Shirt + Shoes (West now only has Shoes, East has Shirts -> Split!)
stock_map["FC_West"]["SKU_SHIRT"] = 0
o2 = router.route_order(["SKU_SHIRT", "SKU_SHOES"])
print(f"Order 2 Routing: {o2['Routing']} -> Cost \${o2['Fulfillment_Cost']} (Split: {o2['Split_Shipment']})")`,
        output: `Order 1 Routing: SINGLE_NODE_FULFILLMENT -> Cost $7.5 (Split: False)\nOrder 2 Routing: MULTI_NODE_SPLIT_SHIPMENT -> Cost $13.0 (Split: True)`,
        tryIt: 'Replenish FC_East with 5 SKU_SHOES and verify that Order 2 routes as SINGLE_NODE_FULFILLMENT at $7.50.',
        check: {
          question: 'Why do sophisticated e-commerce fulfillment engines aggressively avoid split shipments whenever possible?',
          options: [
            'Because splitting an order across multiple warehouses incurs duplicate carrier base fees, box costs, and packaging labor that severely degrade transaction margins.',
            'Because federal postal regulations prohibit shipping two boxes to the same physical address on the same calendar day.',
            'Because split shipments automatically void customer payment transactions at checkout.',
            'Because split shipments require separate merchant banking accounts for each package.'
          ],
          answerIndex: 0,
          explanation: 'Each separate box shipped requires its own shipping label, carton, packing material, and carrier base rate. A split shipment often doubles fulfillment costs, frequently wiping out the entire operating margin on that customer order.'
        }
      },
      {
        title: 'Reverse Logistics & Net Delivered Margin Economics',
        say: [
          'In e-commerce, the transaction is not complete when the box arrives at the customer\'s doorstep. In categories like apparel and footwear, return rates routinely reach 25% to 35% as customers "bracket" purchases (buying multiple sizes with the intention of returning all but one).',
          'Reverse Logistics is the operational pipeline of moving returned goods from customer back to the warehouse: Return Merchandise Authorization (RMA) -> Return Transit Freight -> Inspection/Grading -> Restocking, Refurbishing, or Salvage Liquidation.',
          'Returned goods do not return to inventory at 100% value: packaging is damaged, seasons change, and open-box items must be discounted by 30% to 50% or liquidated.',
          'Net Delivered Margin is the true economic yardstick of e-commerce profitability: Net Delivered Margin = Gross Merchandise Revenue - Cost of Goods Sold (COGS) - Outbound Shipping - Payment Fees - Expected Category Return Loss.',
          'High top-line sales growth with uncontrolled return logistics is a primary cause of venture-backed e-commerce bankruptcy.'
        ],
        example: 'A dress sells for $100 with a $40 COGS. It looks like a healthy 60% gross margin. But with a 30% return rate, $15 return shipping and inspection cost, and a $20 open-box depreciation loss, the real net profit per dress sold is severely compressed.',
        code: `# Simulation: Reverse Logistics & Net Delivered Margin Calculator
class ReverseLogisticsModel:
    def __init__(self, retail_price: float, cogs: float, outbound_shipping: float, 
                 payment_fee_pct: float = 0.03):
        self.price = retail_price
        self.cogs = cogs
        self.outbound_ship = outbound_shipping
        self.payment_fee = retail_price * payment_fee_pct

    def evaluate_net_margin(self, return_rate: float, return_freight: float, 
                           inspection_labor: float, resale_discount_pct: float) -> dict:
        # Standard delivered gross profit (if 100% kept)
        standard_margin = self.price - self.cogs - self.outbound_ship - self.payment_fee
        
        # Expected return cost per unit sold:
        # Cost of return shipment + inspection labor + loss of resale value
        depreciation_loss = self.price * resale_discount_pct
        cost_per_return_event = return_freight + inspection_labor + depreciation_loss
        expected_return_penalty = return_rate * cost_per_return_event

        net_delivered_profit = standard_margin - expected_return_penalty
        net_delivered_margin_pct = (net_delivered_profit / self.price) * 100.0

        return {
            "Retail_Price": self.price,
            "Standard_Margin_No_Returns": round(standard_margin, 2),
            "Expected_Return_Cost_Per_Unit": round(expected_return_penalty, 2),
            "True_Net_Delivered_Profit": round(net_delivered_profit, 2),
            "Net_Delivered_Margin_Pct": round(net_delivered_margin_pct, 1)
        }

model = ReverseLogisticsModel(
    retail_price=100.0,
    cogs=40.0,
    outbound_shipping=8.0,
    payment_fee_pct=0.03 # $3.00 payment processing
)

# High return apparel scenario: 30% return rate, $7 return label, $3 inspection, 25% resale discount
res = model.evaluate_net_margin(
    return_rate=0.30,
    return_freight=7.0,
    inspection_labor=3.0,
    resale_discount_pct=0.25 # Open box sold at $75 ($25 loss)
)

print(f"Retail Price:                \${res['Retail_Price']:.2f}")
print(f"Gross Margin (Zero Returns): \${res['Standard_Margin_No_Returns']:.2f}")
print(f"Expected Return Penalty:     -\${res['Expected_Return_Cost_Per_Unit']:.2f}")
print(f"True Net Delivered Profit:   \${res['True_Net_Delivered_Profit']:.2f}")
print(f"True Net Delivered Margin:   {res['Net_Delivered_Margin_Pct']}%")`,
        output: `Retail Price:                $100.00\nGross Margin (Zero Returns): $49.00\nExpected Return Penalty:     -$10.50\nTrue Net Delivered Profit:   $38.50\nTrue Net Delivered Margin:   38.5%`,
        tryIt: 'Increase return rate to 50% and observe the true net profit drop down to $31.50 per unit.',
        check: {
          question: 'What is "bracketing" in consumer e-commerce behavior and why is it dangerous for retail unit economics?',
          options: [
            'When customers purchase multiple sizes or colors of the same item with the premeditated plan to keep only one and return the rest, drastically inflating reverse logistics costs.',
            'When customers split an order across two different credit cards to circumvent fraud detection.',
            'When automated bots buy out limited sneaker inventory in bulk.',
            'When shipping carriers bundle multiple parcels into a single container for customs clearance.'
          ],
          answerIndex: 0,
          explanation: 'Bracketing turns every intended purchase into 2 to 3 shipments and returns, incurring return shipping labels, inspection labor, and markdown losses that destroy the retailer\'s net delivered margin.'
        }
      }
    ],
    summary: [
      'Two-sided marketplaces record Net Revenue as GMV multiplied by the Take Rate (Rake %), distinguishing platform commissions from third-party transaction volumes.',
      'Algorithmic dynamic pricing calculates Price Elasticity of Demand (PED) to optimize prices while enforcing margin floor guardrails against destructive price wars.',
      'Conversion funnels suffer a ~70% baseline cart abandonment rate; 1-click express checkout and automated recovery flows recapture high-margin lost sales.',
      'Distributed inventory fulfillment minimizes transit zones and mitigates costly split shipments that duplicate carrier fees.',
      'Reverse logistics costs (freight, inspection, and resale depreciation) must be incorporated into Net Delivered Margin calculations to assess true product line profitability.'
    ],
    projectStep: {
      title: 'E-Commerce Marketplace Economics & Fulfillment Simulator',
      steps: [
        'Model the marketplace financial statement with 3P GMV, commission take rates, and seller escrow payouts.',
        'Implement the dynamic pricing engine with price elasticity calculation and margin floor constraints.',
        'Analyze multi-step checkout drop-off funnels and project abandoned cart email recovery lift.',
        'Simulate multi-warehouse inventory order routing to eliminate split shipment delivery cost penalties.'
      ]
    }
  },
  {
    coursePrefix: 'bcom_ecom',
    day: 2,
    title: 'Omnichannel Retail Supply Chains, Inventory Turns & DTC Unit Economics',
    goal: 'Master modern omnichannel commerce engineering: calculating Inventory Turnover Ratios and Days Sales of Inventory (DSI), architecting Bullwhip Effect dampening via vendor-managed inventory (VMI), modeling Direct-to-Consumer (DTC) unit economics across blended CAC and contribution margin tiers, engineering real-time Distributed Order Management (DOM) routing algorithms, and implementing fraud velocity screening rules.',
    minutes: 44,
    recap: 'On Day 1 we analyzed marketplace platform take-rates, algorithmic dynamic pricing, and reverse logistics return rates. Today we transition into physical omnichannel execution: optimizing inventory turnover velocity, eliminating supply chain bullwhip oscillations, calculating DTC contribution margins, and engineering fraud prevention gates.',
    parts: [
      {
        title: 'Inventory Turnover Velocity, DSI & Working Capital Traps',
        say: [
          'In physical and digital commerce, cash is king, but inventory is where cash goes to die.',
          'Every pallet of unsold stock sitting inside an e-commerce fulfillment warehouse consumes working capital and bleeds cash through annual holding costs (warehousing rent, climate control, insurance, shrinkage, and obsolescence) typically running 20% to 30% of inventory value.',
          'Retail efficiency is measured by the Inventory Turnover Ratio: Inventory Turnover = Cost of Goods Sold (COGS) / Average Inventory.',
          'The reciprocal metric is Days Sales of Inventory (DSI): DSI = (365 / Inventory Turnover), representing the average number of days required to turn inventory into cash.',
          'Agile fast-fashion leaders like Zara turn inventory 10 to 12 times per year (DSI of ~30-35 days), freeing up operating liquidity to design fresh collections. In contrast, slow-moving traditional retailers turning inventory 2 to 3 times per year face heavy seasonal markdowns and cash crunches.'
        ],
        example: 'Think of owning a fruit stand versus a canned goods store. If you buy $1,000 of fresh strawberries and sell them out every 3 days, you turn your inventory 120 times a year and generate massive compounding cash flow on minimal working capital. But if you buy $50,000 of specialty canned truffles that sit on the shelf for two years, your capital is locked up and gathering dust.',
        code: `# Simulation: Inventory Turnover Velocity & Holding Cost Burden Analyzer
def analyze_inventory_velocity(
    annual_cogs: float,
    beginning_inventory: float,
    ending_inventory: float,
    annual_holding_cost_rate_pct: float = 25.0
) -> dict:
    average_inventory = (beginning_inventory + ending_inventory) / 2.0
    turnover_ratio = round(annual_cogs / average_inventory, 2) if average_inventory > 0 else 0.0
    days_sales_of_inventory = round(365.0 / turnover_ratio, 1) if turnover_ratio > 0 else 999.0
    annual_holding_cost = average_inventory * (annual_holding_cost_rate_pct / 100.0)

    velocity_grade = (
        "WORLD_CLASS_AGILE" if turnover_ratio >= 8.0
        else "HEALTHY_RETAIL_AVERAGE" if turnover_ratio >= 4.0
        else "SLOW_MOVING_CAPITAL_TRAP"
    )

    return {
        "Annual_COGS": f"\${round(annual_cogs / 1e6, 2)}M",
        "Average_Inventory": f"\${round(average_inventory / 1e6, 2)}M",
        "Turnover_Ratio": f"{turnover_ratio}x",
        "Days_Sales_Inventory": f"{days_sales_of_inventory} days",
        "Annual_Holding_Cost": f"\${round(annual_holding_cost / 1e3, 1)}k",
        "Velocity_Rating": velocity_grade
    }

inv_res = analyze_inventory_velocity(18000000.0, 2800000.0, 3200000.0, 25.0)
print(f"Turnover: {inv_res['Turnover_Ratio']} | DSI: {inv_res['Days_Sales_Inventory']}")
print(f"Holding Cost: {inv_res['Annual_Holding_Cost']} | Rating: {inv_res['Velocity_Rating']}")`,
        output: `Turnover: 6.0x | DSI: 60.8 days\nHolding Cost: $750.0k | Rating: HEALTHY_RETAIL_AVERAGE`,
        codeNotes: [
          { line: 7, note: 'Calculates average inventory balance as midpoint of beginning and ending inventory' },
          { line: 8, note: 'Computes annual turnover velocity: $18M COGS divided by $3.0M average inventory = 6.0x' },
          { line: 9, note: 'Translates turnover into Days Sales of Inventory: 365 / 6.0 = 60.8 days inventory conversion cycle' },
          { line: 25, note: 'Evaluates inventory carrying costs ($750k annual holding burden) and rates performance' }
        ],
        tryIt: 'Increase ending_inventory from $3.2M to $9.0M to see turnover plunge to 3.05x and rating flip to SLOW_MOVING_CAPITAL_TRAP.',
        check: {
          question: 'Why does an increase in an e-commerce retailer\'s Inventory Turnover Ratio directly enhance corporate return on equity (ROE)?',
          options: [
            'Because generating equivalent sales volume with less average inventory frees up cash flow, reduces inventory holding/warehousing costs, and lowers markdown obsolescence write-downs.',
            'Because higher inventory turnover allows the company to eliminate corporate income taxes.',
            'Because shipping carriers legally discount parcel shipping rates by 90% for high-turnover retailers.',
            'Because the company no longer needs to maintain financial accounting records.'
          ],
          answer: 0,
          why: 'Faster inventory turnover reduces tied-up working capital and minimizes annual holding and obsolescence costs, directly accelerating capital velocity and return on invested capital.',
          answerIndex: 0,
          explanation: 'Faster inventory turnover reduces tied-up working capital and minimizes annual holding and obsolescence costs, directly accelerating capital velocity and return on invested capital.'
        }
      },
      {
        title: 'The Bullwhip Effect & Supply Chain Variance Amplification',
        say: [
          'In consumer goods supply chains, minor fluctuations in end-consumer purchasing patterns trigger massive, chaotic swings upstream through the manufacturing tiers: this phenomenon is the Bullwhip Effect.',
          'First documented by Jay Forrester at MIT, the Bullwhip Effect reveals that demand variability increases at each progressive echelon: Consumer -> Retailer -> Wholesaler -> Manufacturer -> Raw Materials Supplier.',
          'A modest 5% uptick in retail demand causes a retailer to order 10% more from the wholesaler to build a safety stock cushion. The wholesaler, observing the 10% surge, orders 20% more from the manufacturer. The manufacturer, anticipating exponential growth, doubles factory production orders.',
          'When retail demand stabilizes, upstream tiers find themselves drowning in colossal excess inventory, triggering sudden order cancellations, factory layoffs, and severe write-downs.',
          'The primary root causes include: Demand Signal Distortion, Order Batching (waiting to order full truckloads), Price Speculation (promotional discounts and phantom orders), and Shortage Gaming.',
          'Modern e-commerce enterprises mitigate the bullwhip effect by sharing real-time Point-of-Sale (POS) scanner data with upstream suppliers and transitioning to Vendor-Managed Inventory (VMI).'
        ],
        example: 'Think of cracking a whip. When you move your wrist just two inches, the wave travels down the leather cord and amplifies exponentially until the tip cracks at the speed of sound. In supply chains, your wrist is the retail shopper buying one extra pack of diapers, and the cracking whip tip is the paper pulp mill doubling timber clearcutting.',
        code: `# Simulation: 4-Tier Supply Chain Bullwhip Variance Amplifier Engine
from typing import List

def simulate_bullwhip_effect(
    consumer_demand_orders: List[float],
    safety_stock_buffer_multiplier: float = 1.25
) -> dict:
    # 4 Tiers: Consumer -> Retailer -> Distributor -> Manufacturer
    # Each tier adds safety buffer and order batching distortion
    retailer_orders = [round(x * safety_stock_buffer_multiplier, 1) for x in consumer_demand_orders]
    distributor_orders = [round(x * safety_stock_buffer_multiplier, 1) for x in retailer_orders]
    manufacturer_orders = [round(x * safety_stock_buffer_multiplier, 1) for x in distributor_orders]

    def variance(data: List[float]) -> float:
        mean = sum(data) / len(data)
        return sum((x - mean)**2 for x in data) / len(data)

    var_consumer = round(variance(consumer_demand_orders), 2)
    var_manufacturer = round(variance(manufacturer_orders), 2)
    bullwhip_ratio = round(var_manufacturer / var_consumer, 2) if var_consumer > 0 else 1.0

    return {
        "Consumer_Variance": var_consumer,
        "Retailer_Orders": retailer_orders,
        "Distributor_Orders": distributor_orders,
        "Manufacturer_Orders": manufacturer_orders,
        "Manufacturer_Variance": var_manufacturer,
        "Bullwhip_Amplification_Ratio": f"{bullwhip_ratio}x",
        "Distortion_Verdict": "SEVERE_BULLWHIP_AMPLIFICATION" if bullwhip_ratio >= 2.0 else "MILD_DISTORTION"
    }

demand = [100.0, 105.0, 110.0, 102.0, 108.0]
bullwhip_res = simulate_bullwhip_effect(demand, 1.25)
print(f"Consumer Variance: {bullwhip_res['Consumer_Variance']} -> Manufacturer: {bullwhip_res['Manufacturer_Variance']}")
print(f"Bullwhip Ratio: {bullwhip_res['Bullwhip_Amplification_Ratio']} | Status: {bullwhip_res['Distortion_Verdict']}")`,
        output: `Consumer Variance: 13.6 -> Manufacturer: 52.73\nBullwhip Ratio: 3.88x | Status: SEVERE_BULLWHIP_AMPLIFICATION`,
        codeNotes: [
          { line: 9, note: 'Simulates progressive order buffer compounding across the 4 supply chain echelons' },
          { line: 15, note: 'Calculates statistical variance at consumer point of sale versus manufacturer production floor' },
          { line: 19, note: 'Quantifies bullwhip amplification ratio: manufacturer variance divided by consumer variance' },
          { line: 31, note: 'Reveals 3.88x variance explosion as retail orders compound into severe factory overproduction' }
        ],
        tryIt: 'Lower safety_stock_buffer_multiplier to 1.05 (representing tight real-time POS data sharing) to observe Bullwhip Ratio drop to 1.34x.',
        check: {
          question: 'Which of the following operational practices is most effective at dampening the Bullwhip Effect in multi-echelon retail supply chains?',
          options: [
            'Sharing real-time retail Point-of-Sale (POS) demand data transparently with upstream suppliers and implementing Vendor-Managed Inventory (VMI).',
            'Ordering inventory exclusively once every two years in gigantic ocean containers.',
            'Refusing to share sales figures with manufacturers to protect trade secrets.',
            'Offering frequent, unannounced 50% discount flash sales that artificially create demand spikes.'
          ],
          answer: 0,
          why: 'When all supply chain tiers base replenishment decisions on genuine end-consumer checkout data rather than distorted intermediate orders, artificial variance amplification is eliminated.',
          answerIndex: 0,
          explanation: 'When all supply chain tiers base replenishment decisions on genuine end-consumer checkout data rather than distorted intermediate orders, artificial variance amplification is eliminated.'
        }
      },
      {
        title: 'Direct-to-Consumer (DTC) 3-Tier Contribution Margin Waterfall',
        say: [
          'Over the past decade, dozens of high-profile Direct-to-Consumer (DTC) brands raised hundreds of millions in venture capital, scaled to $100M+ in top-line revenue, and promptly imploded into bankruptcy.',
          'Why? Because their executives celebrated top-line Gross Merchandise Value while ignoring the brutal realities of the DTC Contribution Margin Waterfall.',
          'In DTC e-commerce, profitability must be evaluated across three strict contribution margin tiers:',
          'Contribution Margin 1 (CM1): Net Revenue minus Cost of Goods Sold (COGS). Net Revenue explicitly deducts promotional discounts and customer returns/refunds (often 15-25% in apparel). CM1 represents gross product manufacturing profit.',
          'Contribution Margin 2 (CM2): CM1 minus Variable Order Fulfillment costs (warehouse pick/pack labor, packaging boxes, carrier shipping labels) and Payment Gateway processing fees (typically 2.9% + $0.30). CM2 represents post-fulfillment operational profit.',
          'Contribution Margin 3 (CM3): CM2 minus Customer Acquisition Cost (Paid Performance Ad Spend on Meta, Google, and TikTok). CM3 represents true first-order marketing profitability.',
          'If CM3 is negative, the retailer loses money on every first-time customer delivered, relying entirely on repeat repurchase rates that frequently fail to materialize.'
        ],
        example: 'Imagine selling a $100 watch online. After a 10% discount and 12% returns, Net Revenue is $78. COGS is $23.40, leaving CM1 at $54.60. Pick, pack, shipping, and credit card fees cost $10.76, leaving CM2 at $43.84. But if Facebook ads cost $50 per acquired customer, your CM3 is -$6.16! You lose $6.16 on every watch you ship, burning cash with every sale.',
        code: `# Simulation: Direct-to-Consumer (DTC) 3-Tier Contribution Margin Waterfall
def compute_dtc_contribution_waterfall(
    gross_revenue: float,
    discount_pct: float,
    return_refund_pct: float,
    cogs_pct: float,
    pick_pack_ship_per_order: float,
    payment_gateway_fee_pct: float,
    total_orders_shipped: int,
    total_paid_ad_spend: float
) -> dict:
    gross_discounts = gross_revenue * (discount_pct / 100.0)
    gross_returns = gross_revenue * (return_refund_pct / 100.0)
    net_revenue = gross_revenue - gross_discounts - gross_returns

    # CM1: Net Revenue - COGS
    cogs_dollars = net_revenue * (cogs_pct / 100.0)
    cm1_dollars = net_revenue - cogs_dollars
    cm1_margin_pct = round((cm1_dollars / net_revenue) * 100.0, 1)

    # CM2: CM1 - Variable Fulfillment & Merchant Processing
    fulfillment_costs = total_orders_shipped * pick_pack_ship_per_order
    payment_fees = net_revenue * (payment_gateway_fee_pct / 100.0)
    cm2_dollars = cm1_dollars - fulfillment_costs - payment_fees
    cm2_margin_pct = round((cm2_dollars / net_revenue) * 100.0, 1)

    # CM3: CM2 - Paid Ad Spend (True Contribution Margin after Ad Acquisition)
    cm3_dollars = cm2_dollars - total_paid_ad_spend
    cm3_margin_pct = round((cm3_dollars / net_revenue) * 100.0, 1)
    blended_cac = round(total_paid_ad_spend / total_orders_shipped, 2) if total_orders_shipped > 0 else 0.0

    return {
        "Net_Revenue": f"\${round(net_revenue / 1e6, 2)}M",
        "CM1_Gross_Profit": f"\${round(cm1_dollars / 1e6, 2)}M ({cm1_margin_pct}%)",
        "CM2_Post_Fulfillment": f"\${round(cm2_dollars / 1e6, 2)}M ({cm2_margin_pct}%)",
        "CM3_Post_Ad_Spend": f"\${round(cm3_dollars / 1e6, 2)}M ({cm3_margin_pct}%)",
        "Blended_CAC": f"\${blended_cac}",
        "Unit_Economics_Health": "SUSTAINABLE_PROFITABLE_DTC" if cm3_dollars > 0 else "UNDERWATER_BURNING_CASH"
    }

dtc_res = compute_dtc_contribution_waterfall(
    gross_revenue=5000000.0,
    discount_pct=10.0,
    return_refund_pct=12.0,
    cogs_pct=30.0,
    pick_pack_ship_per_order=8.50,
    payment_gateway_fee_pct=2.9,
    total_orders_shipped=50000,
    total_paid_ad_spend=1200000.0
)
print(f"Net Revenue: {dtc_res['Net_Revenue']} | CM1: {dtc_res['CM1_Gross_Profit']}")
print(f"CM2: {dtc_res['CM2_Post_Fulfillment']} | CM3: {dtc_res['CM3_Post_Ad_Spend']}")
print(f"Blended CAC: {dtc_res['Blended_CAC']} | Status: {dtc_res['Unit_Economics_Health']}")`,
        output: `Net Revenue: $3.9M | CM1: $2.73M (70.0%)\nCM2: $2.19M (56.2%) | CM3: $0.99M (25.4%)\nBlended CAC: $24.0 | Status: SUSTAINABLE_PROFITABLE_DTC`,
        codeNotes: [
          { line: 15, note: 'Calculates CM1 after stripping gross discounts and estimated customer return allowances' },
          { line: 19, note: 'Calculates CM2 by deducting pick, pack, outbound shipping, and payment gateway fees' },
          { line: 24, note: 'Calculates CM3 by subtracting digital advertising spend to reveal true first-order profitability' },
          { line: 36, note: 'Confirms healthy operation with $990k in CM3 profit (25.4% margin) and a $24.00 blended CAC' }
        ],
        tryIt: 'Increase total_paid_ad_spend from $1.2M to $2.5M to observe CM3 turn negative (-$310k) and flip status to UNDERWATER_BURNING_CASH.',
        check: {
          question: 'What does a negative Contribution Margin 3 (CM3) indicate about a Direct-to-Consumer (DTC) e-commerce business model?',
          options: [
            'The company is losing money on every initial customer order after factoring in product costs, warehouse fulfillment, shipping, and digital ad acquisition spend.',
            'The company is generating infinite shareholder returns through tax shelters.',
            'The website domain has expired and requires renewal.',
            'The delivery carrier has lost all parcels in transit.'
          ],
          answer: 0,
          why: 'Negative CM3 proves that customer acquisition costs exceed first-order contribution margin; the company destroys capital unless repeat repurchase rates are exceptionally high.',
          answerIndex: 0,
          explanation: 'Negative CM3 proves that customer acquisition costs exceed first-order contribution margin; the company destroys capital unless repeat repurchase rates are exceptionally high.'
        }
      },
      {
        title: 'Distributed Order Management (DOM) & Omnichannel Routing Algorithms',
        say: [
          'In modern omnichannel retail, orders do not simply flow to the nearest warehouse.',
          'Large retailers operate a hybrid fulfillment network consisting of Central Distribution Centers (DCs), Regional Sortation Hubs, and hundreds of physical Retail Stores capable of Ship-from-Store (SFS) and Buy Online Pick Up in Store (BOPIS).',
          'Distributed Order Management (DOM) engines evaluate incoming orders in real time using multi-variable cost optimization algorithms.',
          'Key decision inputs include: inventory availability, delivery transit zone distance, shipping carrier rate tables, store fulfillment labor capacity, and "Markdown Avoidance".',
          'Markdown Avoidance is a game-changing DOM tactic: if a retail store in Dallas has 10 units of a winter coat that is about to go on a 50% clearance discount, the DOM engine intentionally routes a full-price online order to that Dallas store instead of a central warehouse.',
          'This fulfills the customer order while simultaneously clearing aging inventory at full retail price, preventing massive margin liquidation write-downs.'
        ],
        example: 'Imagine a customer in Fort Worth orders a pair of jeans. The central warehouse is 650 miles away with an $11.50 shipping fee. A local Dallas retail store is 45 miles away with a $7.20 shipping fee and holds aging inventory flagged for clearance. The DOM engine routes the order to the Dallas store, saving $4.30 in parcel freight and saving the retailer from taking a $25 clearance markdown.',
        code: `# Simulation: Distributed Order Management (DOM) Multi-Node Fulfillment Router
from dataclasses import dataclass
from typing import List

@dataclass
class FulfillmentNode:
    node_id: str
    node_type: str # 'Central_DC', 'Regional_Hub', 'Retail_Store'
    inventory_units: int
    distance_miles: float
    shipping_cost_base: float
    aging_markdown_flag: bool

def route_distributed_order(
    item_id: str,
    units_requested: int,
    candidate_nodes: List[FulfillmentNode]
) -> dict:
    eligible_nodes = [n for n in candidate_nodes if n.inventory_units >= units_requested]
    if not eligible_nodes:
        return {"Status": "BACKORDER_NO_STOCK", "Assigned_Node": None}

    # Optimization score: prioritize markdown stores to avoid write-offs, then lowest shipping cost
    def node_priority_key(n: FulfillmentNode):
        markdown_discount = -15.0 if n.aging_markdown_flag else 0.0
        return n.shipping_cost_base + (n.distance_miles * 0.05) + markdown_discount

    best_node = min(eligible_nodes, key=node_priority_key)

    return {
        "Item": item_id,
        "Assigned_Node": best_node.node_id,
        "Node_Type": best_node.node_type,
        "Distance": f"{best_node.distance_miles} miles",
        "Base_Shipping": f"\${best_node.shipping_cost_base}",
        "Markdown_Mitigation": "YES (CLEARING AGING STOCK)" if best_node.aging_markdown_flag else "NO",
        "Routing_Strategy": "OPTIMAL_OMNICHANNEL_ALLOCATION"
    }

nodes = [
    FulfillmentNode("DC_Central_01", "Central_DC", 500, 650.0, 11.50, False),
    FulfillmentNode("Store_Dallas_04", "Retail_Store", 12, 45.0, 7.20, True),
    FulfillmentNode("Hub_Regional_02", "Regional_Hub", 150, 180.0, 8.90, False)
]
dom_res = route_distributed_order("SKU_4910", 2, nodes)
print(f"Item: {dom_res['Item']} -> Node: {dom_res['Assigned_Node']} ({dom_res['Node_Type']})")
print(f"Markdown Clear: {dom_res['Markdown_Mitigation']} | Distance: {dom_res['Distance']}")`,
        output: `Item: SKU_4910 -> Node: Store_Dallas_04 (Retail_Store)\nMarkdown Clear: YES (CLEARING AGING STOCK) | Distance: 45.0 miles`,
        codeNotes: [
          { line: 5, note: 'FulfillmentNode captures node classification, stock depth, transit distance, and markdown flags' },
          { line: 20, note: 'Optimization objective balances transit distance, base carrier fees, and clearance avoidance credits' },
          { line: 24, note: 'Selects optimal fulfillment node minimizing total landing cost and inventory write-down exposure' },
          { line: 36, note: 'Demonstrates order routed to Store_Dallas_04 to clear aging stock while cutting transit miles' }
        ],
        tryIt: 'Set aging_markdown_flag=False on Store_Dallas_04 and observe the routing engine re-evaluate priority against Regional_Hub_02.',
        check: {
          question: 'What is the primary financial benefit of implementing "Markdown Avoidance" logic in an omnichannel Distributed Order Management (DOM) routing engine?',
          options: [
            'Fulfilling full-price online customer orders directly from retail store locations that hold excess aging inventory, thereby preventing costly clearance markdowns and preserving merchandise margin.',
            'Eliminating all local and state sales tax obligations on online purchases.',
            'Forcing customers to pick up orders in person regardless of their selected delivery preference.',
            'Replacing third-party parcel carriers with in-store employees on bicycles.'
          ],
          answer: 0,
          why: 'Shipping from stores with slow-moving inventory monetizes aging units at full retail prices before end-of-season clearance markdowns destroy product margins.',
          answerIndex: 0,
          explanation: 'Shipping from stores with slow-moving inventory monetizes aging units at full retail prices before end-of-season clearance markdowns destroy product margins.'
        }
      },
      {
        title: 'E-Commerce Fraud Velocity Rules & Chargeback Prevention',
        say: [
          'In physical retail, Chip-and-PIN and contactless payments have largely eliminated counterfeit card fraud.',
          'Consequently, criminal syndicates shifted online into Card-Not-Present (CNP) transactions, targeting e-commerce checkout engines with stolen credential dumps, automated card-testing bots, and account takeovers (ATO).',
          'Beyond direct merchandise loss, retailers face punitive payment network penalties: Visa and Mastercard place merchants into Excessive Chargeback Monitoring Programs if the chargeback-to-transaction ratio crosses 0.9% to 1.0%.',
          'Breaching this threshold results in $50-$100 penalty fees per chargeback, mandatory forensic audits, and potential termination of credit card processing merchant accounts.',
          'To combat CNP fraud in real time without causing checkout friction for honest buyers, merchants deploy rule-based and machine-learning fraud engines.',
          'Key fraud signals include: IP-to-billing country geographic discrepancies, Address Verification Service (AVS) postal code mismatches, CVV security failures, transaction velocity surges (e.g. 5 orders in 10 minutes from the same device fingerprint), and anonymous VPN/proxy detection.',
          'Orders scoring high fraud probability are automatically blocked, while intermediate risks are routed to manual risk review queues.'
        ],
        example: 'Imagine a transaction originating from an anonymous VPN IP address in Lagos, Nigeria, using a credit card registered to an address in New York with a failed postal code match, and attempting four consecutive transactions in 20 minutes. The fraud engine scores this order at 95/100 and immediately rejects it, preventing a $480 product loss and an inevitable $50 chargeback fee.',
        code: `# Simulation: Real-Time E-Commerce Fraud Velocity & Risk Scoring Filter
from dataclasses import dataclass
from typing import List

@dataclass
class OrderRiskSignals:
    order_id: str
    ip_country: str
    billing_country: str
    avs_postal_match: bool
    cvv_match: bool
    attempts_last_hour_same_ip: int
    is_vpn_proxy: bool
    order_total_dollars: float

def score_ecommerce_fraud_risk(order: OrderRiskSignals) -> dict:
    risk_score = 0
    flags = []

    if order.ip_country != order.billing_country:
        risk_score += 25
        flags.append("GEO_MISMATCH_IP_VS_BILLING")
    if not order.avs_postal_match:
        risk_score += 20
        flags.append("AVS_POSTAL_CODE_FAILED")
    if not order.cvv_match:
        risk_score += 30
        flags.append("CVV_SECURITY_CODE_FAILED")
    if order.attempts_last_hour_same_ip >= 4:
        risk_score += 35
        flags.append("EXCESSIVE_VELOCITY_ATTEMPTS")
    if order.is_vpn_proxy:
        risk_score += 15
        flags.append("ANONYMOUS_PROXY_VPN_DETECTED")

    if risk_score >= 60:
        decision = "AUTO_REJECT_FRAUD_PREVENTED"
    elif risk_score >= 30:
        decision = "HOLD_MANUAL_FRAUD_REVIEW"
    else:
        decision = "AUTO_APPROVED_LOW_RISK"

    return {
        "OrderID": order.order_id,
        "Risk_Score": f"{risk_score}/100",
        "Decision": decision,
        "Triggered_Flags": flags
    }

order1 = OrderRiskSignals("ORD_99421", "Nigeria", "United States", False, True, 6, True, 480.0)
fraud_res = score_ecommerce_fraud_risk(order1)
print(f"Order: {fraud_res['OrderID']} | Score: {fraud_res['Risk_Score']} -> Decision: {fraud_res['Decision']}")
print(f"Flags: {fraud_res['Triggered_Flags']}")`,
        output: `Order: ORD_99421 | Score: 95/100 -> Decision: AUTO_REJECT_FRAUD_PREVENTED\nFlags: ['GEO_MISMATCH_IP_VS_BILLING', 'AVS_POSTAL_CODE_FAILED', 'EXCESSIVE_VELOCITY_ATTEMPTS', 'ANONYMOUS_PROXY_VPN_DETECTED']`,
        codeNotes: [
          { line: 5, note: 'OrderRiskSignals captures multi-layered geo, identity, velocity, and proxy telemetry' },
          { line: 18, note: 'Assigns weighted risk penalty points for AVS failures, CVV mismatches, and geo discrepancies' },
          { line: 26, note: 'Heavily penalizes velocity surges (>=4 attempts in 1 hour) indicating automated bot fraud testing' },
          { line: 40, note: 'Scores high-risk transaction at 95/100, automatically blocking transaction to avoid chargeback' }
        ],
        tryIt: 'Set attempts_last_hour_same_ip=1, avs_postal_match=True, and is_vpn_proxy=False on order1 to observe score drop to 25 and auto-approve.',
        check: {
          question: 'What is the critical commercial danger for an online merchant if their credit card chargeback-to-transaction ratio exceeds 1.0%?',
          options: [
            'Payment networks (Visa/Mastercard) place the merchant in Excessive Chargeback Monitoring Programs, imposing heavy monthly fines, increased processing fees, and potential termination of credit card processing abilities.',
            'The merchant is legally required to provide free merchandise to all customers for thirty days.',
            'The merchant\'s physical retail stores are immediately seized by local municipal councils.',
            'All existing customer accounts are automatically converted to cash-on-delivery.'
          ],
          answer: 0,
          why: 'Crossing the 1% chargeback threshold threatens payment gateway connectivity; card networks penalize excessive chargebacks with steep fines and eventual merchant account revocation.',
          answerIndex: 0,
          explanation: 'Crossing the 1% chargeback threshold threatens payment gateway connectivity; card networks penalize excessive chargebacks with steep fines and eventual merchant account revocation.'
        }
      }
    ],
    summary: [
      'Inventory Turnover Velocity: Ratio = COGS / Average Inventory; faster turns reduce Days Sales of Inventory (DSI) and eliminate 20-30% annual holding cost capital traps.',
      'Bullwhip Effect Dampening: Small retail demand fluctuations amplify into chaotic factory oscillations upstream; POS data transparency and VMI eliminate order batching distortion.',
      'DTC Contribution Waterfall: Distinguishes CM1 (Gross Profit), CM2 (Post-Fulfillment), and CM3 (Post-Ad Spend); negative CM3 proves unsustainable customer acquisition.',
      'Distributed Order Management: Algorithmic routing balances shipping transit zones, store fulfillment capacity, and clearance markdown avoidance.',
      'Fraud Velocity Screening: Evaluates AVS, CVV, geo-IP mismatch, and attempt velocity to block Card-Not-Present fraud before breaching 1% chargeback monitoring thresholds.'
    ],
    projectStep: {
      title: 'Omnichannel E-Commerce Supply Chain & Fraud Gate Architecture',
      steps: [
        'Calculate inventory turnover ratios and Days Sales of Inventory (DSI) to identify working capital drag across product categories.',
        'Simulate a 4-tier supply chain to evaluate bullwhip variance amplification and quantify POS data smoothing benefits.',
        'Model the 3-tier DTC contribution margin waterfall and configure a real-time fraud velocity screening engine with automated threshold rules.'
      ]
    }
  },
  {
    coursePrefix: 'bcom_ecom',
    day: 3,
    title: 'E-Commerce Unit Economics, Multi-Channel CAC/LTV & Cart Abandonment Recovery',
    overview: 'Master digital commerce financial mechanics, customer acquisition economics, and conversion funnel recovery. You will deconstruct multi-tiered order contribution margins (CM1, CM2, CM3), model multi-period cohort customer lifetime value (LTV) and repurchase curves, architect automated multi-stage checkout abandonment recovery sequences, audit multi-channel media mix efficiency (ROAS vs. Blended MER), and deploy an integrated e-commerce growth control tower.',
    parts: [
      {
        title: 'D2C Order Unit Economics: CM1, CM2, and Contribution Margin 3 (CM3)',
        say: [
          'In direct-to-consumer (D2C) e-commerce, the most dangerous illusion is top-line gross margin. A brand founder might celebrate an eighty-percent gross margin on a hundred-dollar pair of sunglasses, assuming that sixty or seventy dollars of profit flow directly into the corporate bank account. However, between the moment a customer clicks Buy Now and the moment cash settles in the merchant bank account, an unforgiving waterfall of operational and media costs consumes the proceeds. To evaluate whether digital retail operations are truly compounding wealth, e-commerce financial operators decompose unit economics into three distinct contribution margin tiers: CM1, CM2, and CM3.',
          'Contribution Margin 1 (CM1) represents classic gross product profit: Net Revenue (Gross AOV minus promotional discounts and return allowances) minus Cost of Goods Sold (including inbound freight and landed manufacturing costs). CM2 captures post-fulfillment profit by deducting all variable order fulfillment expenses: warehouse pick-and-pack labor, outbound parcel shipping, custom packaging materials, and merchant gateway payment processing fees (typically 2.9% plus 30 cents per transaction). A healthy D2C brand must maintain a CM2 margin between 35% and 50% of net revenue; if fulfillment eats more than half of gross margin, the brand lacks the economic buffer to acquire customers at scale.',
          'Contribution Margin 3 (CM3) is the ultimate metric of customer acquisition viability. CM3 is calculated by subtracting First-Order Customer Acquisition Cost (Paid Media CAC) from CM2. If CM3 is positive, every customer acquired on paid channels is immediately profitable on their initial transaction, creating an infinite cash flywheel for aggressive growth. Conversely, if CM3 is negative, the merchant loses money on every first order and must rely on subsequent repurchase cohorts to achieve breakeven. In this section, we model an automated D2C order waterfall engine that calculates CM1, CM2, and CM3, pinpointing whether customer acquisition is profitable on day one.'
        ],
        example: 'Consider an apparel brand selling a $120.00 jacket with a $12.00 promo discount and a $6.00 return reserve, netting $102.00 in revenue. If product manufacturing and landed freight cost $40.00, CM1 is $62.00 (60.8%). After deducting $4.50 warehouse pick/pack, $10.50 FedEx shipping, $2.00 branded box, and $3.26 Stripe processing, CM2 drops to $41.74 (40.9%). If Meta ad acquisition CAC is $38.00, the brand nets a positive CM3 of $3.74 (3.7%), validating first-order profitability.',
        code: `def calculate_dtc_unit_economics_waterfall():
    print("=== D2C Unit Economics Waterfall (CM1, CM2, CM3) ===")
    gross_aov = 120.00
    discounts = 12.00
    returns_allowance = 6.00
    net_revenue = gross_aov - discounts - returns_allowance
    
    cogs_product = 36.00
    cogs_inbound_freight = 4.00
    total_cogs = cogs_product + cogs_inbound_freight
    cm1_gross_profit = net_revenue - total_cogs
    cm1_margin_pct = (cm1_gross_profit / net_revenue) * 100.0
    
    pick_pack_labor = 4.50
    outbound_shipping = 10.50
    packaging_supplies = 2.00
    payment_processing_fee = (net_revenue * 0.029) + 0.30
    total_variable_fulfillment = pick_pack_labor + outbound_shipping + packaging_supplies + payment_processing_fee
    cm2_fulfillment_profit = cm1_gross_profit - total_variable_fulfillment
    cm2_margin_pct = (cm2_fulfillment_profit / net_revenue) * 100.0
    
    paid_media_cac = 38.00
    cm3_net_contribution = cm2_fulfillment_profit - paid_media_cac
    cm3_margin_pct = (cm3_net_contribution / net_revenue) * 100.0
    
    status = "HEALTHY_PROFITABLE_ACQUISITION" if cm3_net_contribution > 0 else "CASH_BURNING_ACQUISITION"
    
    print(f"Gross AOV: " + "$" + f"{gross_aov:.2f} | Discounts: -" + "$" + f"{discounts:.2f} | Returns: -" + "$" + f"{returns_allowance:.2f}")
    print(f"Net Revenue: " + "$" + f"{net_revenue:.2f}")
    print(f"CM1 (Gross Profit): " + "$" + f"{cm1_gross_profit:.2f} ({cm1_margin_pct:.1f}% margin)")
    print(f"Fulfillment & Payment: -" + "$" + f"{total_variable_fulfillment:.2f} (Pick/Pack=" + "$" + f"{pick_pack_labor:.2f}, Ship=" + "$" + f"{outbound_shipping:.2f}, Gateway=" + "$" + f"{payment_processing_fee:.2f})")
    print(f"CM2 (Post-Fulfillment Profit): " + "$" + f"{cm2_fulfillment_profit:.2f} ({cm2_margin_pct:.1f}% margin)")
    print(f"Paid Media CAC: -" + "$" + f"{paid_media_cac:.2f}")
    print(f"CM3 (Net Contribution Margin): " + "$" + f"{cm3_net_contribution:.2f} ({cm3_margin_pct:.1f}% margin) -> [{status}]")
    return {
        "net_revenue": net_revenue,
        "cm1": cm1_gross_profit,
        "cm2": cm2_fulfillment_profit,
        "cm3": cm3_net_contribution,
        "cm3_margin_pct": cm3_margin_pct
    }

calculate_dtc_unit_economics_waterfall()`,
        output: `=== D2C Unit Economics Waterfall (CM1, CM2, CM3) ===
Gross AOV: $120.00 | Discounts: -$12.00 | Returns: -$6.00
Net Revenue: $102.00
CM1 (Gross Profit): $62.00 (60.8% margin)
Fulfillment & Payment: -$20.26 (Pick/Pack=$4.50, Ship=$10.50, Gateway=$3.26)
CM2 (Post-Fulfillment Profit): $41.74 (40.9% margin)
Paid Media CAC: -$38.00
CM3 (Net Contribution Margin): $3.74 (3.7% margin) -> [HEALTHY_PROFITABLE_ACQUISITION]`,
        codeNotes: [
          'Deconstructs order economics across Net Revenue ($102.00), CM1 ($62.00 / 60.8%), and CM2 ($41.74 / 40.9%).',
          'Incorporates variable order fulfillment costs ($20.26) including pick/pack, parcel shipping, and gateway fees.',
          'Evaluates first-order paid media CAC ($38.00), yielding a profitable CM3 of $3.74 (3.7% margin).'
        ],
        tryIt: 'Increase paid media CAC to $45.00 to observe how customer acquisition flips from profitable into negative cash burn.',
        check: {
          question: 'What is the critical distinction between Contribution Margin 2 (CM2) and Contribution Margin 3 (CM3) in D2C e-commerce?',
          options: [
            'CM2 reflects profit after deducting variable fulfillment and merchant fees, while CM3 subtracts paid media customer acquisition cost (CAC).',
            'CM2 includes executive salaries, while CM3 reflects only physical warehouse rent.',
            'CM2 is an accounting metric required exclusively for physical department stores.',
            'CM3 excludes all product manufacturing costs and inbound freight.'
          ],
          answer: 0,
          why: 'CM2 evaluates order economics after physical fulfillment and payment processing; CM3 further deducts paid advertising spend to evaluate true net marketing profitability.',
          answerIndex: 0,
          explanation: 'CM2 evaluates order economics after physical fulfillment and payment processing; CM3 further deducts paid advertising spend to evaluate true net marketing profitability.'
        }
      },
      {
        title: 'Customer Lifetime Value (LTV) Cohorts, Repurchase Curves & LTV:CAC Ratios',
        say: [
          'While achieving positive CM3 on initial customer orders is the ideal scenario for working capital management, many high-growth consumer categories—such as specialty consumables, skincare, apparel subscriptions, and pet supplies—operate at breakeven or slight losses on day zero. In these business models, the entire enterprise enterprise value is generated through multi-period customer repeat purchase behavior. Evaluating long-term economic health requires replacing single-transaction snapshots with rigorous cohort lifetime value (LTV) modeling, tracking how repeat purchase frequencies compound cumulative gross margin contribution over time.',
          'Cohort LTV modeling groups customers acquired during a common time window (such as a calendar month) and tracks their cumulative spend and order counts over 60, 180, 360, and 720 days. Crucially, true e-commerce LTV is not measured in top-line Gross Merchandise Value, but in cumulative Contribution Margin 2 (CM2) generated per customer. If an acquired customer spends $110 on Day 0 and another $105 on Day 60, only the post-fulfillment CM2 profit (at 50% margin) contributes to amortizing the initial CAC. By tracking cohort retention curves, growth operators determine the exact payback horizon where cumulative CM2 surpasses upfront CAC.',
          'The gold standard of venture-backed consumer brand economics is an LTV:CAC ratio exceeding 3.0x over a 360-day to 720-day horizon, accompanied by a CAC payback period under six months. If LTV:CAC is below 1.5x, the business is trapped in an advertising treadmill where customer churn erodes all operating margin. In this section, we examine an automated cohort waterfall that simulates 1,000 acquired customers across four repurchase cycles, calculating cumulative CM2 per customer, dynamic LTV:CAC ratios, and net cohort return on investment. Mastering these cohort economics allows e-commerce leadership to allocate growth capital with mathematical confidence.'
        ],
        example: 'A luxury direct-to-consumer coffee roaster spends $32.00 to acquire a new subscriber on Meta. On Day 0, the customer generates $55.00 in CM2 profit (1.72x CAC), achieving immediate payback. Over 720 days, through seasonal blends and subscription replenishments across 35% repeat buyers, cumulative CM2 per customer expands to $104.67, delivering a stellar 3.27x LTV:CAC ratio and 227.1% net cohort ROI.',
        code: `def model_ecommerce_ltv_cohort_waterfall():
    print("=== Multi-Period Cohort LTV & Repurchase Economics ===")
    initial_cohort_customers = 1000
    first_order_aov = 110.00
    cm2_margin_ratio = 0.50  # 50% CM2 margin
    blended_cac = 32.00
    
    cohort_schedule = [
        {"period": "Day 0 (Acquisition)", "active_ratio": 1.00, "orders_per_active": 1.0, "aov": 110.00},
        {"period": "Day 60 (Repurchase 1)", "active_ratio": 0.35, "orders_per_active": 1.0, "aov": 105.00},
        {"period": "Day 180 (Repurchase 2)", "active_ratio": 0.25, "orders_per_active": 1.0, "aov": 110.00},
        {"period": "Day 360 (Repurchase 3)", "active_ratio": 0.18, "orders_per_active": 1.0, "aov": 115.00},
        {"period": "Day 720 (Repurchase 4)", "active_ratio": 0.12, "orders_per_active": 1.0, "aov": 120.00}
    ]
    
    cumulative_gross_revenue = 0.0
    cumulative_cm2_profit = 0.0
    print("Cohort Trajectory (1,000 Customers Acquired):")
    for row in cohort_schedule:
        period_orders = initial_cohort_customers * row["active_ratio"] * row["orders_per_active"]
        period_rev = period_orders * row["aov"]
        period_cm2 = period_rev * cm2_margin_ratio
        cumulative_gross_revenue += period_rev
        cumulative_cm2_profit += period_cm2
        ltv_per_cust = cumulative_cm2_profit / initial_cohort_customers
        ltv_to_cac = ltv_per_cust / blended_cac
        print(f"  {row['period']}: Orders={period_orders:.0f} | Period Rev=" + "$" + f"{period_rev:,.2f} | Cumul LTV(CM2)=" + "$" + f"{ltv_per_cust:.2f} | LTV:CAC={ltv_to_cac:.2f}x")
        
    total_cac_invested = initial_cohort_customers * blended_cac
    net_cohort_roi_pct = ((cumulative_cm2_profit - total_cac_invested) / total_cac_invested) * 100.0
    print(f"Cohort Summary: Total CAC=" + "$" + f"{total_cac_invested:,.2f} | 360-Day CM2 Profit=" + "$" + f"{cumulative_cm2_profit:,.2f} | Net ROI={net_cohort_roi_pct:.1f}%")
    return {
        "cumulative_cm2_profit": cumulative_cm2_profit,
        "ltv_to_cac": ltv_to_cac,
        "net_cohort_roi_pct": net_cohort_roi_pct
    }

model_ecommerce_ltv_cohort_waterfall()`,
        output: `=== Multi-Period Cohort LTV & Repurchase Economics ===
Cohort Trajectory (1,000 Customers Acquired):
  Day 0 (Acquisition): Orders=1000 | Period Rev=$110,000.00 | Cumul LTV(CM2)=$55.00 | LTV:CAC=1.72x
  Day 60 (Repurchase 1): Orders=350 | Period Rev=$36,750.00 | Cumul LTV(CM2)=$73.38 | LTV:CAC=2.29x
  Day 180 (Repurchase 2): Orders=250 | Period Rev=$27,500.00 | Cumul LTV(CM2)=$87.12 | LTV:CAC=2.72x
  Day 360 (Repurchase 3): Orders=180 | Period Rev=$20,700.00 | Cumul LTV(CM2)=$97.47 | LTV:CAC=3.05x
  Day 720 (Repurchase 4): Orders=120 | Period Rev=$14,400.00 | Cumul LTV(CM2)=$104.67 | LTV:CAC=3.27x
Cohort Summary: Total CAC=$32,000.00 | 360-Day CM2 Profit=$104,675.00 | Net ROI=227.1%`,
        codeNotes: [
          'Tracks a 1,000-customer cohort across 5 multi-period intervals from Day 0 through Day 720.',
          'Measures cumulative LTV in Contribution Margin 2 ($104.67 per customer), not gross top-line revenue.',
          'Demonstrates an expanding LTV:CAC ratio from 1.72x at Day 0 to 3.27x at Day 720, generating a 227.1% net cohort ROI.'
        ],
        tryIt: 'Reduce the 60-day repurchase active ratio from 0.35 to 0.15 to see how lower customer retention degrades overall cohort ROI.',
        check: {
          question: 'Why must customer lifetime value (LTV) in D2C e-commerce be calculated using Contribution Margin 2 (CM2) rather than Gross Revenue?',
          options: [
            'Because Gross Revenue ignores COGS, shipping, and payment gateway costs, creating a false impression of marketing profitability when repeat orders consume significant fulfillment cash.',
            'Because federal trade regulations mandate that all revenue figures be discounted by statutory corporate income tax.',
            'Because Shopify stores do not record gross transaction values in order databases.',
            'Because customers always demand full refunds on all repeat purchases.'
          ],
          answer: 0,
          why: 'Measuring LTV in Gross Revenue overstates profitability; true LTV must reflect net contribution profit after subtracting product manufacturing, shipping, and payment processing costs.',
          answerIndex: 0,
          explanation: 'Measuring LTV in Gross Revenue overstates profitability; true LTV must reflect net contribution profit after subtracting product manufacturing, shipping, and payment processing costs.'
        }
      },
      {
        title: 'Checkout Funnel Drop-off Telemetry & Cart Abandonment Recovery Architecture',
        say: [
          'Across global e-commerce platforms, approximately seventy percent of shopping carts loaded with merchandise are abandoned prior to final order completion. When a consumer browses product pages, selects items, adds them to their digital cart, and initiates checkout, the brand has already expended marketing capital to drive the visit. Any subsequent drop-off represents direct revenue leakage and wasted customer acquisition spend. Understanding the telemetry of the checkout funnel and deploying an automated, multi-tiered abandonment recovery engine is one of the highest-ROI operational interventions in digital retail.',
          'A standard checkout funnel exhibits predictable attrition across each sequential step: from Store Sessions to Add to Cart (ATC, typically 8-12%), to Initiate Checkout (IC, ~50-60% of ATC), to Shipping Information (~70-80% of IC), and finally to Completed Payment (~55-65% of Shipping). The primary drivers of checkout abandonment include unexpected shipping fees and taxes revealed late in the flow, mandatory account creation requirements, complex form inputs, and payment trust concerns. By instrumenting real-time event telemetry via webhooks and client-side pixels, merchants can instantly flag abandoned sessions the moment a customer exits without completing payment.',
          'An enterprise abandonment recovery architecture deploys an orchestrated, time-decayed communication sequence across multiple channels. Stage 1 triggers a high-urgency SMS or push notification within sixty minutes, capitalizing on fresh buyer intent with personalized cart permalinks. Stage 2 dispatches an automated email within four hours featuring social proof and customer reviews to overcome product hesitation. Stage 3, deployed at twenty-four hours, introduces a modest ten-percent incentive or free shipping perk to price-sensitive shoppers. Finally, Stage 4 executes dynamic product retargeting ads (DPA) on paid social over forty-eight hours. In this section, we simulate a complete recovery sequence over 50,000 store sessions, demonstrating how recovering just 212 abandoned orders generates $21,658.84 in incremental GMV at an astonishing 39.8x recovery ROAS.'
        ],
        example: 'An online cosmetics retailer logs 50,000 monthly sessions, leading to 6,000 add-to-carts and 3,300 initiated checkouts. However, 1,815 buyers abandon at the payment screen, leaving $185,130.00 in GMV stranded. By activating an automated 4-stage recovery sequence (SMS, reviews email, 10% discount email, and dynamic social ads) costing just $543.86 in total delivery, the brand recovers 212 orders ($21,658.84 in GMV), lifting the store conversion rate from 2.97% to 3.39%.',
        code: `def simulate_cart_abandonment_recovery_engine():
    print("=== Checkout Funnel Telemetry & Abandonment Recovery Sequence ===")
    sessions = 50_000
    atc_sessions = sessions * 0.12       # 12% Add to Cart
    ic_sessions = atc_sessions * 0.55    # 55% Initiate Checkout
    shipping_sessions = ic_sessions * 0.75 # 75% Enter Shipping
    completed_orders = shipping_sessions * 0.60 # 60% Complete Payment
    
    unrecovered_checkout_dropouts = ic_sessions - completed_orders
    baseline_conversion_rate = (completed_orders / sessions) * 100.0
    aov = 102.00
    
    recovery_stages = [
        {"channel": "SMS Cart Ping (1h, urgent reminder)", "reach_rate": 0.40, "conversion_rate": 0.08, "cost_per_send": 0.02},
        {"channel": "Email Sequence 1 (4h, social proof)", "reach_rate": 0.65, "conversion_rate": 0.05, "cost_per_send": 0.005},
        {"channel": "Email Sequence 2 (24h, 10% incentive)", "reach_rate": 0.50, "conversion_rate": 0.06, "cost_per_send": 0.005},
        {"channel": "Dynamic Retargeting DPA (48h)", "reach_rate": 0.70, "conversion_rate": 0.04, "cost_per_send": 0.45}
    ]
    
    print(f"Funnel Telemetry: Sessions={sessions:,} -> ATC={atc_sessions:,.0f} -> IC={ic_sessions:,.0f} -> Completed={completed_orders:,.0f} ({baseline_conversion_rate:.2f}% Baseline CVR)")
    print(f"Abandoned Checkouts: {unrecovered_checkout_dropouts:,.0f} Orders (" + "$" + f"{unrecovered_checkout_dropouts * aov:,.2f} GMV at risk)")
    
    total_recovered_orders = 0
    total_recovery_cost = 0.0
    pool = unrecovered_checkout_dropouts
    
    print("Recovery Sequence Execution:")
    for stg in recovery_stages:
        targeted = pool * stg["reach_rate"]
        recovered = targeted * stg["conversion_rate"]
        stage_cost = targeted * stg["cost_per_send"]
        recovered_gmv = recovered * aov
        total_recovered_orders += recovered
        total_recovery_cost += stage_cost
        pool -= recovered
        print(f"  {stg['channel']}: Recovered={recovered:.0f} orders (" + "$" + f"{recovered_gmv:,.2f} GMV) | Cost=" + "$" + f"{stage_cost:,.2f}")
        
    recovered_revenue = total_recovered_orders * aov
    recovery_roas = recovered_revenue / total_recovery_cost
    lifted_orders = completed_orders + total_recovered_orders
    lifted_conversion_rate = (lifted_orders / sessions) * 100.0
    
    print(f"Recovery Synthesis: Total Recovered={total_recovered_orders:.0f} Orders (" + "$" + f"{recovered_revenue:,.2f} GMV) | Spend=" + "$" + f"{total_recovery_cost:,.2f} | Recovery ROAS={recovery_roas:.1f}x")
    print(f"Lifted Conversion Rate: {baseline_conversion_rate:.2f}% -> {lifted_conversion_rate:.2f}% (+{((lifted_conversion_rate - baseline_conversion_rate)/baseline_conversion_rate)*100.0:.1f}% relative lift)")
    return {
        "recovered_orders": total_recovered_orders,
        "recovered_revenue": recovered_revenue,
        "recovery_roas": recovery_roas,
        "lifted_cvr": lifted_conversion_rate
    }

simulate_cart_abandonment_recovery_engine()`,
        output: `=== Checkout Funnel Telemetry & Abandonment Recovery Sequence ===
Funnel Telemetry: Sessions=50,000 -> ATC=6,000 -> IC=3,300 -> Completed=1,485 (2.97% Baseline CVR)
Abandoned Checkouts: 1,815 Orders ($185,130.00 GMV at risk)
Recovery Sequence Execution:
  SMS Cart Ping (1h, urgent reminder): Recovered=58 orders ($5,924.16 GMV) | Cost=$14.52
  Email Sequence 1 (4h, social proof): Recovered=57 orders ($5,824.19 GMV) | Cost=$5.71
  Email Sequence 2 (24h, 10% incentive): Recovered=51 orders ($5,201.45 GMV) | Cost=$4.25
  Dynamic Retargeting DPA (48h): Recovered=46 orders ($4,709.05 GMV) | Cost=$519.38
Recovery Synthesis: Total Recovered=212 Orders ($21,658.84 GMV) | Spend=$543.86 | Recovery ROAS=39.8x
Lifted Conversion Rate: 2.97% -> 3.39% (+14.3% relative lift)`,
        codeNotes: [
          'Models a 50,000-session checkout funnel with 1,815 abandoned orders representing $185,130.00 in stranded GMV.',
          'Executes a 4-tier recovery sequence across SMS, automated email sequences, and dynamic product retargeting.',
          'Recovers 212 orders ($21,658.84 GMV) on $543.86 total spend, delivering a 39.8x recovery ROAS and a 14.3% relative lift in store conversion.'
        ],
        tryIt: 'Adjust the SMS reach rate from 0.40 to 0.70 to observe how higher immediate mobile contact rates expand total recovered GMV.',
        check: {
          question: 'Why do automated cart recovery sequences achieve exceptional Return on Ad Spend (ROAS) exceeding 30x compared to prospecting ad campaigns?',
          options: [
            'Because the audience has already demonstrated high purchase intent by entering the checkout funnel, requiring minimal incremental messaging cost to convert.',
            'Because SMS carriers provide free cellular bandwidth for commercial retail promotions.',
            'Because shopping cart abandonment is completely illegal under consumer protection statutes.',
            'Because web browsers automatically deduct the purchase amount from user credit cards upon cart abandonment.'
          ],
          answer: 0,
          why: 'Cart abandoners are at the very bottom of the funnel; because intent is already validated, low-cost reminder messaging converts at high rates with immense marginal ROI.',
          answerIndex: 0,
          explanation: 'Cart abandoners are at the very bottom of the funnel; because intent is already validated, low-cost reminder messaging converts at high rates with immense marginal ROI.'
        }
      },
      {
        title: 'Multi-Channel Media Mix: Platform ROAS vs Blended MER & Attribution Realities',
        say: [
          'In the wake of major privacy shifts—most notably Apple App Tracking Transparency (ATT) framework and progressive third-party cookie deprecation—digital marketing measurement has undergone a seismic paradigm shift. In prior years, e-commerce marketers relied heavily on in-platform Return on Ad Spend (ROAS) reported inside Meta Ads Manager and Google Ads dashboards. Today, reliance on platform-reported ROAS is one of the most common causes of venture-backed e-commerce insolvency, as algorithmic advertising platforms systematically double-count conversions and claim credit for organic customer purchases.',
          'The phenomenon of phantom ROAS arises because advertising platforms use overlapping, self-serving attribution windows (such as 7-day click and 1-day view-through). If a loyal customer sees a Meta ad on Instagram, clicks a Google Shopping link later that afternoon, and applies a discount code from an affiliate website, all three channels claim credit for one hundred percent of the resulting transaction. When a merchant sums up platform-reported revenue across channels, the claimed total frequently exceeds the actual dollars deposited into Shopify by thirty to fifty percent. Marketers who scale ad spend based on inflated platform metrics quickly experience cash-flow collapse.',
          'To navigate this attribution fog, modern e-commerce executives rely on the Marketing Efficiency Ratio (MER), also known as Blended ROAS: Total Store Net Revenue divided by Total Marketing Ad Spend. MER provides an ungameable, balance-sheet-level view of overall customer acquisition efficiency. While channel-specific metrics and first-click attribution models help guide tactical creative bidding, MER serves as the strategic steering wheel for capital allocation. In this section, we analyze a $100,000 monthly media budget across Meta, Google Shopping, TikTok, and Affiliates, demonstrating how a phantom 3.20x platform ROAS resolves to a true 2.50x blended MER. Understanding this gap is essential for maintaining advertising capital discipline.'
        ],
        example: 'An online furniture merchant spends $100,000 on ads across Meta ($45k), Google ($30k), TikTok ($15k), and Affiliates ($10k). Meta claims $135k in sales (3.0x), Google claims $120k (4.0x), TikTok claims $30k (2.0x), and Affiliates claim $35k (3.5x), totaling $320,000 in claimed sales (3.20x phantom ROAS). However, Shopify shows actual net store revenue was only $250,000. The true Blended MER is 2.50x, exposing a $70,000 overattribution gap.',
        code: `def audit_roas_vs_mer_channel_efficiency():
    print("=== Multi-Channel Media Mix: Platform ROAS vs Blended MER ===")
    channels = [
        {"name": "Meta Ads (Paid Social)", "spend": 45_000.0, "platform_reported_rev": 135_000.0, "first_click_rev": 72_000.0},
        {"name": "Google Shopping (Search)", "spend": 30_000.0, "platform_reported_rev": 120_000.0, "first_click_rev": 90_000.0},
        {"name": "TikTok Ads (Top Funnel)", "spend": 15_000.0, "platform_reported_rev": 30_000.0, "first_click_rev": 12_000.0},
        {"name": "Affiliate & Influencer", "spend": 10_000.0, "platform_reported_rev": 35_000.0, "first_click_rev": 22_000.0}
    ]
    
    actual_store_net_revenue = 250_000.0
    total_marketing_spend = sum(c["spend"] for c in channels)
    total_platform_reported_rev = sum(c["platform_reported_rev"] for c in channels)
    
    blended_mer = actual_store_net_revenue / total_marketing_spend
    phantom_reported_roas = total_platform_reported_rev / total_marketing_spend
    overattribution_gap = total_platform_reported_rev - actual_store_net_revenue
    
    print(f"Total Marketing Spend: " + "$" + f"{total_marketing_spend:,.2f}")
    print(f"Actual Shopify/Store Net Revenue: " + "$" + f"{actual_store_net_revenue:,.2f} -> True Blended MER: {blended_mer:.2f}x")
    print(f"Sum of Platform-Claimed Revenue: " + "$" + f"{total_platform_reported_rev:,.2f} -> Phantom Reported ROAS: {phantom_reported_roas:.2f}x")
    print(f"Overattribution Inflation Gap: " + "$" + f"{overattribution_gap:,.2f} (Platforms overclaimed actual sales by {((overattribution_gap)/actual_store_net_revenue)*100:.1f}%)")
    print("Channel Efficiency Breakdown:")
    for c in channels:
        p_roas = c["platform_reported_rev"] / c["spend"]
        fc_roas = c["first_click_rev"] / c["spend"]
        print(f"  {c['name']}: Spend=" + "$" + f"{c['spend']:,.2f} | Platform ROAS={p_roas:.2f}x | First-Click ROAS={fc_roas:.2f}x")
    return {
        "blended_mer": blended_mer,
        "total_spend": total_marketing_spend,
        "overattribution_gap": overattribution_gap
    }

audit_roas_vs_mer_channel_efficiency()`,
        output: `=== Multi-Channel Media Mix: Platform ROAS vs Blended MER ===
Total Marketing Spend: $100,000.00
Actual Shopify/Store Net Revenue: $250,000.00 -> True Blended MER: 2.50x
Sum of Platform-Claimed Revenue: $320,000.00 -> Phantom Reported ROAS: 3.20x
Overattribution Inflation Gap: $70,000.00 (Platforms overclaimed actual sales by 28.0%)
Channel Efficiency Breakdown:
  Meta Ads (Paid Social): Spend=$45,000.00 | Platform ROAS=3.00x | First-Click ROAS=1.60x
  Google Shopping (Search): Spend=$30,000.00 | Platform ROAS=4.00x | First-Click ROAS=3.00x
  TikTok Ads (Top Funnel): Spend=$15,000.00 | Platform ROAS=2.00x | First-Click ROAS=0.80x
  Affiliate & Influencer: Spend=$10,000.00 | Platform ROAS=3.50x | First-Click ROAS=2.20x`,
        codeNotes: [
          'Audits a $100,000 media budget across Meta, Google Shopping, TikTok, and Affiliate marketing channels.',
          'Exposes a $70,000 overattribution gap between platform claims ($320,000 / 3.20x ROAS) and store revenue ($250,000).',
          'Calculates the true Marketing Efficiency Ratio (MER = 2.50x) and evaluates first-click incrementality across channels.'
        ],
        tryIt: 'Adjust Google Shopping spend to $40,000.00 and evaluate how it impacts overall store MER and channel contribution.',
        check: {
          question: 'What is Marketing Efficiency Ratio (MER) and why is it preferred over platform-reported ROAS for executive financial planning?',
          options: [
            'MER is Total Store Net Revenue divided by Total Marketing Ad Spend; it cannot be inflated by overlapping platform attribution windows and reflects true bank account revenue.',
            'MER measures only offline billboard advertising and television campaigns.',
            'MER is an inventory accounting formula used exclusively by customs import brokers.',
            'MER reflects the percentage of website visitors who leave a 5-star customer review.'
          ],
          answer: 0,
          why: 'MER measures macro marketing efficiency by dividing total store revenue by total ad spend, eliminating duplicate attribution claims across advertising networks.',
          answerIndex: 0,
          explanation: 'MER measures macro marketing efficiency by dividing total store revenue by total ad spend, eliminating duplicate attribution claims across advertising networks.'
        }
      },
      {
        title: 'Integrated E-Commerce Growth Control Tower & Capital Optimization',
        say: [
          'Scaling a digital retail enterprise requires synchronizing order unit economics, cohort retention dynamics, checkout funnel recovery, and multi-channel media allocation into a single executive command center. When business operators manage each department in a silo—marketing chasing ROAS, fulfillment managing shipping costs, and customer support handling refunds—the overall enterprise frequently experiences cash flow crises despite growing top-line sales. The E-Commerce Growth Control Tower establishes a unified, real-time operating dashboard that aligns marketing velocity with working capital solvency.',
          'The control tower synthesizes the four fundamental levers of digital retail profitability. Lever 1 confirms first-order economics: verifying that Contribution Margin 2 covers upfront paid media CAC to maintain a positive CM3. Lever 2 tracks multi-period cohort health: certifying that repeat purchase frequencies compound LTV:CAC above the 3.0x venture threshold over 360 days. Lever 3 monitors funnel leakages: deploying automated SMS, email, and dynamic retargeting sequences that recover high-margin abandoned checkout GMV. Lever 4 enforces media discipline: managing paid media spend according to true blended MER rather than deceptive in-platform vanity metrics.',
          'By unifying these four operational pillars into an automated Python executive control suite, management can immediately simulate the macro financial impact of operational changes. Whether evaluating a supplier price hike, a spike in parcel shipping surcharges, an increase in Meta ad auction CPMs, or a shift in repurchase cohort retention, the control tower provides instant clarity on cash contribution and runway. In this capstone synthesis for Day 3, you will execute the integrated growth control tower, validating that digital commerce operations meet institutional capital efficiency standards.'
        ],
        example: 'A direct-to-consumer health and wellness brand deploys the Integrated E-Commerce Growth Control Tower. The executive dashboard displays a positive CM3 of $3.74 (3.7% net margin), a 360-day cohort LTV:CAC of 3.27x (227.1% net ROI), $21,658.84 in recovered abandoned cart GMV lifting overall conversion to 3.39%, and a disciplined 2.50x Blended MER on $100,000 media spend. The dashboard confirms that the brand is fully primed for sustainable, capital-efficient growth.',
        code: `def run_ecommerce_growth_control_tower():
    print("=== PinIT Career OS E-Commerce Unit Economics & Growth Control Tower ===")
    print("--- 1. Order Waterfall Economics ---")
    unit = calculate_dtc_unit_economics_waterfall()
    
    print("\n--- 2. Cohort LTV & Repurchase Trajectory ---")
    cohort = model_ecommerce_ltv_cohort_waterfall()
    
    print("\n--- 3. Cart Abandonment Sequence ---")
    cart = simulate_cart_abandonment_recovery_engine()
    
    print("\n--- 4. Media Mix & MER Audit ---")
    media = audit_roas_vs_mer_channel_efficiency()
    
    print("\n--- 5. Executive E-Commerce Control Tower Synthesis ---")
    print(f"  Order CM3 Contribution Margin: " + "$" + f"{unit['cm3']:.2f} ({unit['cm3_margin_pct']:.1f}% net margin)")
    print(f"  360-Day Cohort LTV:CAC Ratio: {cohort['ltv_to_cac']:.2f}x (Net Cohort ROI: {cohort['net_cohort_roi_pct']:.1f}%)")
    print(f"  Cart Abandonment Lift: +{cart['recovered_orders']:.0f} orders (" + "$" + f"{cart['recovered_revenue']:,.2f} GMV, CVR lifted to {cart['lifted_cvr']:.2f}%)")
    print(f"  True Blended MER: {media['blended_mer']:.2f}x (Spend: " + "$" + f"{media['total_spend']:,.2f})")
    print("Status: E-COMMERCE UNIT ECONOMICS & MEDIA MIX CERTIFIED FOR CAPITAL EFFICIENCY.")

run_ecommerce_growth_control_tower()`,
        output: `=== PinIT Career OS E-Commerce Unit Economics & Growth Control Tower ===
--- 1. Order Waterfall Economics ---
=== D2C Unit Economics Waterfall (CM1, CM2, CM3) ===
Gross AOV: $120.00 | Discounts: -$12.00 | Returns: -$6.00
Net Revenue: $102.00
CM1 (Gross Profit): $62.00 (60.8% margin)
Fulfillment & Payment: -$20.26 (Pick/Pack=$4.50, Ship=$10.50, Gateway=$3.26)
CM2 (Post-Fulfillment Profit): $41.74 (40.9% margin)
Paid Media CAC: -$38.00
CM3 (Net Contribution Margin): $3.74 (3.7% margin) -> [HEALTHY_PROFITABLE_ACQUISITION]

--- 2. Cohort LTV & Repurchase Trajectory ---
=== Multi-Period Cohort LTV & Repurchase Economics ===
Cohort Trajectory (1,000 Customers Acquired):
  Day 0 (Acquisition): Orders=1000 | Period Rev=$110,000.00 | Cumul LTV(CM2)=$55.00 | LTV:CAC=1.72x
  Day 60 (Repurchase 1): Orders=350 | Period Rev=$36,750.00 | Cumul LTV(CM2)=$73.38 | LTV:CAC=2.29x
  Day 180 (Repurchase 2): Orders=250 | Period Rev=$27,500.00 | Cumul LTV(CM2)=$87.12 | LTV:CAC=2.72x
  Day 360 (Repurchase 3): Orders=180 | Period Rev=$20,700.00 | Cumul LTV(CM2)=$97.47 | LTV:CAC=3.05x
  Day 720 (Repurchase 4): Orders=120 | Period Rev=$14,400.00 | Cumul LTV(CM2)=$104.67 | LTV:CAC=3.27x
Cohort Summary: Total CAC=$32,000.00 | 360-Day CM2 Profit=$104,675.00 | Net ROI=227.1%

--- 3. Cart Abandonment Sequence ---
=== Checkout Funnel Telemetry & Abandonment Recovery Sequence ===
Funnel Telemetry: Sessions=50,000 -> ATC=6,000 -> IC=3,300 -> Completed=1,485 (2.97% Baseline CVR)
Abandoned Checkouts: 1,815 Orders ($185,130.00 GMV at risk)
Recovery Sequence Execution:
  SMS Cart Ping (1h, urgent reminder): Recovered=58 orders ($5,924.16 GMV) | Cost=$14.52
  Email Sequence 1 (4h, social proof): Recovered=57 orders ($5,824.19 GMV) | Cost=$5.71
  Email Sequence 2 (24h, 10% incentive): Recovered=51 orders ($5,201.45 GMV) | Cost=$4.25
  Dynamic Retargeting DPA (48h): Recovered=46 orders ($4,709.05 GMV) | Cost=$519.38
Recovery Synthesis: Total Recovered=212 Orders ($21,658.84 GMV) | Spend=$543.86 | Recovery ROAS=39.8x
Lifted Conversion Rate: 2.97% -> 3.39% (+14.3% relative lift)

--- 4. Media Mix & MER Audit ---
=== Multi-Channel Media Mix: Platform ROAS vs Blended MER ===
Total Marketing Spend: $100,000.00
Actual Shopify/Store Net Revenue: $250,000.00 -> True Blended MER: 2.50x
Sum of Platform-Claimed Revenue: $320,000.00 -> Phantom Reported ROAS: 3.20x
Overattribution Inflation Gap: $70,000.00 (Platforms overclaimed actual sales by 28.0%)
Channel Efficiency Breakdown:
  Meta Ads (Paid Social): Spend=$45,000.00 | Platform ROAS=3.00x | First-Click ROAS=1.60x
  Google Shopping (Search): Spend=$30,000.00 | Platform ROAS=4.00x | First-Click ROAS=3.00x
  TikTok Ads (Top Funnel): Spend=$15,000.00 | Platform ROAS=2.00x | First-Click ROAS=0.80x
  Affiliate & Influencer: Spend=$10,000.00 | Platform ROAS=3.50x | First-Click ROAS=2.20x

--- 5. Executive E-Commerce Control Tower Synthesis ---
  Order CM3 Contribution Margin: $3.74 (3.7% net margin)
  360-Day Cohort LTV:CAC Ratio: 3.27x (Net Cohort ROI: 227.1%)
  Cart Abandonment Lift: +212 orders ($21,658.84 GMV, CVR lifted to 3.39%)
  True Blended MER: 2.50x (Spend: $100,000.00)
Status: E-COMMERCE UNIT ECONOMICS & MEDIA MIX CERTIFIED FOR CAPITAL EFFICIENCY.`,
        codeNotes: [
          'Integrates all 4 core growth pillars: order contribution waterfall, cohort LTV, cart recovery, and MER audit.',
          'Validates day-one order profitability (CM3 = $3.74) alongside 3.27x multi-year cohort LTV:CAC expansion.',
          'Synthesizes a 2.50x blended MER and +14.3% checkout conversion lift into an executive growth dashboard.'
        ],
        tryIt: 'Run the complete growth control tower suite to confirm all four e-commerce financial pillars are operating in harmony.',
        check: {
          question: 'What is the ultimate strategic advantage of synchronizing order unit economics, cohort LTV, and blended MER inside an integrated control tower?',
          options: [
            'It prevents capital exhaustion by aligning paid advertising spend with true contribution margin profitability and customer cash payback dynamics.',
            'It automatically waives all credit card processing fees charged by merchant banking networks.',
            'It allows the enterprise to cease paying manufacturing costs to physical suppliers.',
            'It guarantees that postal carrier delays will never impact customer delivery satisfaction.'
          ],
          answer: 0,
          why: 'An integrated control tower provides complete visibility across customer acquisition, fulfillment costs, and repeat cohort cash generation, preventing premature scaling and cash burn.',
          answerIndex: 0,
          explanation: 'An integrated control tower provides complete visibility across customer acquisition, fulfillment costs, and repeat cohort cash generation, preventing premature scaling and cash burn.'
        }
      }
    ],
    summary: [
      'Deconstructed D2C order unit economics into CM1 (Gross Profit $62.00 / 60.8%), CM2 (Post-Fulfillment $41.74 / 40.9%), and CM3 (Net Contribution $3.74 / 3.7%), proving first-order profitability.',
      'Constructed a 5-interval cohort retention waterfall for 1,000 customers, demonstrating cumulative CM2 expansion to $104.67 per customer and a 3.27x LTV:CAC ratio (227.1% net ROI).',
      'Simulated a 4-tier checkout abandonment recovery sequence across SMS, automated email, and dynamic social ads, recovering 212 orders ($21,658.84 GMV) at a 39.8x recovery ROAS and lifting store CVR by 14.3%.',
      'Audited a $100,000 multi-channel media mix across Meta, Google, TikTok, and Affiliates, unmasking a $70,000 overattribution gap between phantom platform ROAS (3.20x) and true blended MER (2.50x).',
      'Deployed the E-Commerce Growth Control Tower, providing real-time executive visibility across unit profitability, cohort retention, and capital efficiency.'
    ],
    projectStep: {
      title: 'Deploy the D2C E-Commerce Unit Economics & Media Mix Control Tower',
      steps: [
        'Calculate CM1, CM2, and CM3 contribution margins across all product categories to verify first-order customer profitability.',
        'Model multi-period cohort LTV curves using Contribution Margin 2 to establish true CAC payback horizons.',
        'Configure automated multi-channel checkout abandonment sequences to recover lost shopping carts at high marginal ROAS.',
        'Audit multi-channel advertising performance using Marketing Efficiency Ratio (MER) to eliminate duplicate platform attribution.'
      ]
    }
  }
];
