# scripts/visuals/generate_supply_chain_m1.py
# Generates scripts/visuals/supply_chain_ops_spec_m1.py for Days 1 to 15 (Course 28: Supply Chain & Operations Management)

import json

DAYS_1_TO_15 = [
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "Supply Chain Systems Taxonomy & Total Cost of Ownership: Holding, Ordering & Stockout Cost Physics",
    "stageName": "Stage 1: Supply Chain Fundamentals, Mathematical Inventory Optimization & Operational Flow",
    "stageNum": 1,
    "pedagogicalRole": "Quantitative Supply Chain Foundations, Total Cost Modeling & Financial Invariants",
    "spokenGoal": "Welcome to Supply Chain & Operations Management! In this masterclass, we engineer the physical and mathematical nervous system of global enterprise. A software application crashes in memory; a broken supply chain shuts down automotive factories, grounds air fleets, and empties supermarket shelves. Today we lay the mathematical bedrock: Supply Chain Systems Taxonomy & Total Cost of Ownership (TCO). In operations, inventory is not an asset—it is working capital trapped in physical form, bleeding money through holding costs (capital cost, warehousing, obsolescence, damage, and insurance). But reducing inventory blindly triggers catastrophic stockouts and emergency air-freight penalties. We formulate the Total Annual Inventory Cost equation, quantifying the violent trade-off between holding costs, procurement ordering costs, and stockout penalty costs.",
    "conceptInvariant": "Total Inventory Cost Invariant: Total Annual Inventory Cost (TIC) is convex and defined by the sum of holding, ordering, and penalty costs: TIC(Q) = (Q / 2) * H + (D / Q) * S + E[Stockouts] * C_stockout; where D is annual demand, Q is order quantity, H is unit annual holding cost (typically 20-30% of unit cost C), S is fixed order placement cost, and C_stockout is per-unit stockout penalty; the system achieves minimum operational cost at the exact inflection point where annual holding costs equal annual ordering costs: (Q* / 2) * H == (D / Q*) * S.",
    "failureMode": "A medical device manufacturer slashes its raw material inventory by 60% to show a one-time working capital boost on its quarterly balance sheet. Unit holding costs drop by $45,000. However, when an overseas resin supplier experiences a 4-day port delay, the assembly plant runs out of sterile surgical catheter tubes. Production halts for 6 days. The company incurs $620,000 in idle worker wages, pays $180,000 in expedited air-freight premiums, and is penalized $350,000 in contractual hospital delivery fines. An ill-conceived $45,000 inventory cut inflicts a $1,150,000 operational catastrophe.",
    "tryItFriction": "Build an Enterprise Supply Chain Total Cost of Ownership (TCO) Simulator in Python: 1) Model multi-SKU product inventories with annual demand (D), purchase cost (C), holding cost rate (h_pct), and fixed ordering cost (S); 2) Compute the complete holding cost breakdown (cost of capital, storage space, insurance, shrinkage/obsolescence); 3) Implement stockout penalty modeling with lost sales vs backorder costs; 4) Simulate total cost curves across varying order quantities Q and identify the global minimum TIC; 5) Generate executive working capital vs service level trade-off ledgers.",
    "socraticHints": [
      "Why is inventory considered both an operational buffer and a financial liability on the balance sheet?",
      "Because while inventory decouples demand spikes from supplier lead times, holding physical goods ties up cash and incurs capital financing, warehousing, insurance, and obsolescence costs (20-30% of item value annually).",
      "Total Cost of Ownership balances the declining curve of ordering costs against the rising curve of holding costs to identify the profit-optimal order quantity."
    ],
    "situationalPuzzle": {
      "scenario": "An aerospace distributor stocks titanium fasteners. Annual demand D = 20,000 units. Unit purchase cost C = $50. The CFO calculates the annual holding cost rate h = 25% ($12.50/unit/year). Fixed procurement ordering cost S = $200 per purchase order. Operations Manager A orders 500 units every week (40 orders/year). Operations Manager B orders 5,000 units every quarter (4 orders/year). What is the total annual cost difference between these two policies, and what is the optimal order policy?",
      "options": [
        "Both policies cost the exact same because annual demand is identical.",
        "Calculate step by step: 1) Policy A (Q=500): Annual Ordering Cost = (20,000 / 500) * $200 = $8,000. Annual Holding Cost = (500 / 2) * $12.50 = $3,125. Total Cost = $8,000 + $3,125 = $11,125. 2) Policy B (Q=5,000): Annual Ordering Cost = (20,000 / 5,000) * $200 = $800. Annual Holding Cost = (5,000 / 2) * $12.50 = $31,250. Total Cost = $800 + $31,250 = $32,050. Policy B wastes $20,925/year in excessive holding costs! 3) Optimal Policy: EOQ = sqrt((2 * 20,000 * 200) / 12.50) = 800 units! At Q* = 800, Total Cost = $5,000 + $5,000 = $10,000/year, saving $22,050 over Policy B!",
        "Order 20,000 units on January 1st to minimize ordering cost to $200.",
        "Order 1 unit every hour to eliminate all holding costs."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Operations Manager B incurred massive holding costs ($31,250) by keeping an average of 2,500 units in inventory. Operations Manager A ordered too frequently, driving up ordering costs. The optimal Wilson EOQ quantity of 800 units balances holding cost ($5,000) exactly with ordering cost ($5,000), achieving the mathematical minimum cost of $10,000."
    },
    "quests": [
      {
        "title": "Supply Chain Taxonomy, Inventory Cost Components & TCO Formulations",
        "type": "concept",
        "description": "Formulate quantitative supply chain foundations: analyze the structural taxonomy of supply chain tiers (Tier 3 raw materials to Tier 1 direct suppliers to OEM to 3PL to end consumer); formulate the mathematical components of Total Inventory Cost TIC(Q); derive holding cost capital allocation models (WACC, storage square-footage, shrinkage, and shelf-life decay); evaluate stockout cost structures (lost sales margin vs backorder goodwill decay).",
        "rubric": "Step-by-step mathematical formulation of TIC convex cost curves; complete taxonomy breakdown of multi-tier supply chain networks; formal derivation of holding cost component rates."
      },
      {
        "title": "The Working Capital Trap & $1.15M Medical Plant Stoppage Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a medical device manufacturer's $1.15M loss resulting from an aggressive 60% inventory reduction policy that triggered a 6-day factory shutdown: analyze procurement purchase orders, supplier shipping manifests, plant downtime logs, and customer contract penalty claims; prove how uncalculated stockout risks negated working capital gains; author an institutional inventory safety governance standard.",
        "rubric": "Audit historical inventory levels and factory downtime ledgers; expose the flawed holding vs stockout trade-off analysis; deliver an enterprise working capital inventory governance standard."
      },
      {
        "title": "Building an Enterprise Supply Chain TCO & Inventory Optimization Engine in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Supply Chain TCO Optimization Suite in Python: 1) Model multi-SKU product inventories with demand distributions, unit costs, and holding cost rates; 2) Compute comprehensive holding, ordering, and stockout penalty cost curves; 3) Identify the global minimum cost order quantity Q* across discrete order multiples; 4) Simulate the impact of supplier price discounts vs inventory holding penalties; 5) Output an executive working capital and total operational cost dashboard.",
        "rubric": "Working Python TCO optimization engine; verified convex cost curve calculations; accurate identification of minimum cost points; robust handling of supplier volume tier breaks."
      },
      {
        "title": "Sudden Interest Rate Spike & Holding Cost Explosion 3 AM Crisis Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when a central bank raises benchmark interest rates by 250 basis points overnight, spiking your corporate Cost of Capital from 8% to 14% and inflating total holding costs across $50,000,000 of warehouse inventory by $3,000,000 annually: detect the holding cost inflation; recalculate optimal reorder quantities across 15,000 active SKUs; execute supplier contract renegotiations and inventory rationalization.",
        "rubric": "Rapid detection of interest rate capital cost impact; automated re-calculation of SKU order quantities; deploy inventory reduction schedule mitigating $2M in excess holding costs within 20 minutes."
      }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "Economic Order Quantity (EOQ) Physics & Sensitivity Analysis: Wilson Lot Sizing, Robustness & Quantity Discounts",
    "stageName": "Stage 1: Supply Chain Fundamentals, Mathematical Inventory Optimization & Operational Flow",
    "stageNum": 1,
    "pedagogicalRole": "Mathematical Lot Sizing, EOQ Calculus & Supplier Volume Discount Modeling",
    "spokenGoal": "The Economic Order Quantity (EOQ) formula, first derived by Ford Whitman Harris and popularized by R.H. Wilson, is the most celebrated formula in operations research. Yet in practice, junior supply chain analysts misuse it as a black box. Today we master the deep physics of EOQ: deriving it from first principles via differential calculus, analyzing the remarkable 'flat bottom' property of the EOQ curve (why operating at +/- 20% of EOQ only increases total cost by less than 2%), and evaluating Supplier All-Units vs Incremental Quantity Discounts. When a supplier offers a 5% discount if you order 10,000 units instead of 2,000, does the purchase price savings outweigh the surging holding costs? We build the exact mathematical decision engine.",
    "conceptInvariant": "Wilson EOQ & Price Discount Invariant: The optimal economic lot size satisfies the first-order optimality condition: dTIC/dQ = H/2 - (D*S)/Q^2 = 0 => Q* = sqrt((2 * D * S) / H); the relative cost sensitivity satisfies: TIC(Q) / TIC(Q*) = 0.5 * (Q / Q* + Q* / Q); under All-Units Quantity Discounts with price breaks P_i at thresholds Q_i, the global optimal quantity Q** is either the unconstrained EOQ for the lowest qualifying price bracket or one of the price break boundary thresholds Q_i.",
    "failureMode": "A chemical plant procurement buyer accepts a 7% bulk discount from a solvent supplier by purchasing 50,000 gallons (a 2-year supply) instead of the calculated EOQ of 8,000 gallons, saving $28,000 on the purchase price. However, storing the volatile solvent requires specialized temperature-controlled tank leasing costing $4,500/month ($54,000/year). Furthermore, after 9 months, 12,000 gallons degrade past their chemical shelf life and must be disposed of as hazardous waste ($36,000 penalty). The 'bargain' bulk discount produces a net loss of $62,000.",
    "tryItFriction": "Build an Enterprise EOQ & Quantity Discount Evaluation Engine in Python: 1) Derive the Wilson EOQ analytically and verify with numerical gradient descent; 2) Implement the EOQ Robustness Sensitivity function computing cost degradation across suboptimal order sizes (+/- 10% to +/- 50%); 3) Build an All-Units Quantity Discount algorithm testing feasible EOQ points and price-break boundaries; 4) Model product shelf-life constraints and storage capacity ceilings; 5) Generate executive procurement recommendation reports.",
    "socraticHints": [
      "Why is the EOQ total cost curve described as having a 'flat bottom'?",
      "Because the derivative of the cost function is near zero around the minimum; ordering 20% more or less than the theoretical EOQ only increases total holding and ordering costs by approximately 1.6%.",
      "This flat-bottom robustness gives supply chain managers immense operational flexibility to round order sizes to full pallet loads, truckloads, or container multiples without suffering major cost penalties."
    ],
    "situationalPuzzle": {
      "scenario": "A manufacturing plant consumes 12,000 electronic microcontrollers annually. Fixed order cost S = $150. Unit holding cost rate h = 20%. The supplier offers the following All-Units Quantity Discount schedule: 1) Tier 1 (1 to 999 units): Unit Price = $20.00; 2) Tier 2 (1,000 to 2,999 units): Unit Price = $19.00 (5% discount); 3) Tier 3 (3,000+ units): Unit Price = $18.00 (10% discount). What is the total cost-minimizing order quantity Q**?",
      "options": [
        "Order 12,000 units at once to get the maximum discount.",
        "Evaluate each price tier systematically: 1) Tier 3 ($18.00): H = 0.20 * $18 = $3.60. EOQ_3 = sqrt((2 * 12,000 * 150) / 3.60) = 1,000 units. But 1,000 is below the Tier 3 minimum threshold of 3,000! Therefore, test the threshold Q = 3,000: Annual Purchase Cost = 12,000 * $18 = $216,000. Annual Ordering Cost = (12,000 / 3,000) * $150 = $600. Annual Holding Cost = (3,000 / 2) * $3.60 = $5,400. Total Cost = $222,000. 2) Tier 2 ($19.00): H = $3.80. EOQ_2 = sqrt((2 * 12,000 * 150) / 3.80) = 973 units. 973 is below Tier 2 threshold, so test Q = 1,000: Purchase = $228,000, Order = $1,800, Holding = $1,900. Total Cost = $231,700. 3) Comparison: Total Cost at Tier 3 (Q=3,000) is $222,000 vs $231,700 at Tier 2. The optimal policy is to order exactly 3,000 units, saving $9,700/year!",
        "Order 973 units because that is the unconstrained EOQ formula result.",
        "Discounts never make sense due to holding costs."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In all-units quantity discount analysis, when the unconstrained EOQ falls below the qualifying discount threshold, the lowest feasible point to evaluate is the exact boundary threshold (Q = 3,000). The $24,000 annual savings in raw purchase price easily outweighs the $3,500 increase in holding cost, making Q = 3,000 the global cost-minimizing decision."
    },
    "quests": [
      {
        "title": "Wilson EOQ Calculus, Sensitivity Profiles & Discount Surface Formulations",
        "type": "concept",
        "description": "Formulate mathematical lot-sizing theory: derive the classical Wilson EOQ formula via differential calculus; prove the second-order sufficiency condition for strict convexity; derive the dimensionless sensitivity equation TIC(Q)/TIC(Q*) = 0.5*(Q/Q* + Q*/Q); formulate the multi-tiered All-Units and Incremental Quantity Discount optimization algorithms; evaluate finite production rate economic lot sizing (EPQ / EBQ models).",
        "rubric": "Step-by-step mathematical proof of EOQ optimality and convexity; complete derivation of the dimensionless sensitivity formula; formal algorithm specification for all-units discount boundary evaluation."
      },
      {
        "title": "The Toxic Bulk Discount & $62,000 Chemical Disposal Disaster Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a chemical plant's $62,000 net loss resulting from a rogue bulk procurement discount that ignored tank storage leasing and product shelf-life degradation: analyze chemical procurement purchase orders, tank farm lease invoices, environmental hazardous waste manifests, and material testing logs; prove how flawed lot-sizing caused the loss; author an institutional procurement approval policy.",
        "rubric": "Audit bulk purchase records against chemical degradation timelines and storage invoices; expose the uncalculated carrying costs; deliver an enterprise quantity discount procurement standard."
      },
      {
        "title": "Building an Enterprise EOQ & Quantity Discount Optimization Suite in Python",
        "type": "mastery",
        "description": "Engineer a production-ready EOQ & Lot Sizing Optimization Suite in Python: 1) Implement analytical Wilson EOQ and finite-production EPQ calculation engines; 2) Build an interactive sensitivity analyzer plotting total cost curves across suboptimal order ranges; 3) Implement a multi-bracket All-Units Quantity Discount optimizer with storage capacity and shelf-life constraints; 4) Model full-truckload (FTL) and pallet-rounding constraints; 5) Generate executive procurement lot-sizing recommendations.",
        "rubric": "Working Python lot-sizing suite; verified EOQ and EPQ calculations; accurate quantity discount evaluation; robust enforcement of physical storage and shelf-life boundaries."
      },
      {
        "title": "Supplier Lead Time Doubling & Supply Chain Bullwhip 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when a primary component supplier announces that manufacturing lead times have doubled from 4 weeks to 8 weeks due to overseas factory rationing, threatening an immediate factory line stoppage within 10 days: detect the lead-time extension; recalculate economic order quantities and safety stock allocations; activate secondary qualified domestic suppliers; prevent factory stoppage.",
        "rubric": "Rapid identification of supplier lead-time inflation; execute automated lot-size and reorder-point recalibration; allocate production orders across secondary suppliers within 15 minutes."
      }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "Stochastic Demand & Safety Stock Optimization: Demand/Lead-Time Variance & Cycle Service Levels (CSL)",
    "stageName": "Stage 1: Supply Chain Fundamentals, Mathematical Inventory Optimization & Operational Flow",
    "stageNum": 1,
    "pedagogicalRole": "Stochastic Operations Research, Variance Propagation & Safety Buffer Engineering",
    "spokenGoal": "In the real world, deterministic assumptions die. Demand is never constant, and supplier lead times fluctuate wildly based on weather, customs, and port congestion. When both demand and lead time are stochastic random variables, how much buffer inventory must a company hold to prevent stockouts? Today we master Stochastic Demand & Safety Stock Optimization. We dissect variance propagation: combining daily demand variance (sigma_D) and lead time variance (sigma_L) into total lead-time demand variance (sigma_DL). We calibrate Cycle Service Levels (CSL: 90%, 95%, 99%) using inverse normal cumulative distribution functions (Z-scores). We reveal the brutal exponential cost curve of customer service: lifting service levels from 95% to 99% requires a disproportionate surge in working capital.",
    "conceptInvariant": "Stochastic Safety Stock & Variance Propagation Invariant: Total lead-time demand variance combines demand volatility and lead-time volatility according to the Law of Total Variance: sigma_DL = sqrt(L * sigma_D^2 + D^2 * sigma_L^2); required Safety Stock to achieve Cycle Service Level CSL satisfies: SS = Z_alpha * sigma_DL, where Z_alpha = NormInv(CSL); Reorder Point ROP = (D_avg * L_avg) + SS; inventory holding cost increases asymptotically as CSL approaches 100%: lim_{CSL -> 1} SS = infinity.",
    "failureMode": "An automotive spare parts distributor sets a uniform 99.5% service level across all 40,000 catalog SKUs without modeling lead time variance. For brake pads sourced from Europe with volatile 6-week lead times (sigma_L = 2 weeks), the company fails to account for the lead-time variance term (D^2 * sigma_L^2). During a shipping container crisis, lead times stretch to 9 weeks, causing 2,800 stockouts on critical repair parts. Simultaneously, for slow-moving vintage parts, the 99.5% service level ties up $8,400,000 in dead stock. The company suffers $3,200,000 in lost sales and an emergency $1,500,000 credit line draw to fund excess inventory.",
    "tryItFriction": "Build an Enterprise Stochastic Safety Stock & Service Level Engine in Python: 1) Ingest historical daily demand time series and supplier lead-time delivery records; 2) Compute sample mean and standard deviation for demand (D_avg, sigma_D) and lead time (L_avg, sigma_L); 3) Implement the complete variance propagation formula computing sigma_DL; 4) Compute safety stock (SS) and Reorder Point (ROP) across target Cycle Service Levels (90% to 99.9%); 5) Model the exponential holding cost curve of diminishing service level returns.",
    "socraticHints": [
      "Why does lead-time variance (sigma_L) typically contribute far more volatility to total lead-time demand than daily demand variance (sigma_D)?",
      "Because in the variance propagation formula, lead-time variance is multiplied by squared average demand: D^2 * sigma_L^2, magnifying even small fluctuations in delivery times into massive swings in unit demand.",
      "A 3-day supplier delivery delay on a product selling 500 units/day creates a 1,500-unit variance shock, dwarfing normal day-to-day customer sales variations."
    ],
    "situationalPuzzle": {
      "scenario": "A consumer electronics company sells 100 laptops/day (sigma_D = 20 laptops/day). Average supplier lead time is 16 days (sigma_L = 3 days). Target Cycle Service Level CSL = 95% (Z = 1.645). A junior analyst computes safety stock ignoring lead time variance: SS_naive = Z * sqrt(L * sigma_D^2) = 1.645 * sqrt(16 * 400) = 1.645 * 80 = 132 laptops. What is the TRUE required safety stock when factoring in lead time variance, and what was the stockout risk of the junior analyst's calculation?",
      "options": [
        "132 laptops is correct because lead times are stable enough.",
        "Calculate true variance propagation: 1) Term 1 (Demand Variance): L * sigma_D^2 = 16 * (20^2) = 16 * 400 = 6,400. 2) Term 2 (Lead Time Variance): D^2 * sigma_L^2 = (100^2) * (3^2) = 10,000 * 9 = 90,000! 3) Combined Variance: sigma_DL^2 = 6,400 + 90,000 = 96,400. 4) True sigma_DL = sqrt(96,400) = 310.48 laptops! 5) True Safety Stock: SS = 1.645 * 310.48 = 511 laptops! The junior analyst's buffer of 132 laptops covers only 0.42 standard deviations, plunging the actual service level from 95% down to 66%! One out of every three orders would suffer a stockout!",
        "Double the naive safety stock to 264 laptops.",
        "Lead time variance cancels out demand variance."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Ignoring lead-time variance is an catastrophic error. Notice that Term 2 (90,000) was fourteen times larger than Term 1 (6,400)! Because the analyst omitted D^2 * sigma_L^2, their safety stock covered only 132 laptops instead of the required 511 laptops, exposing the business to a devastating 34% stockout rate."
    },
    "quests": [
      {
        "title": "Stochastic Inventory Theory, Variance Propagation & Service Level Formulations",
        "type": "concept",
        "description": "Formulate stochastic inventory management: analyze the Law of Total Variance in supply chain systems; mathematically derive the complete lead-time demand variance equation sigma_DL = sqrt(L*sigma_D^2 + D^2*sigma_L^2); formulate the distinction between Cycle Service Level (CSL - Type 1 service) and Unit Fill Rate (beta - Type 2 service); derive the Normal Loss Function G(z) for fill-rate optimization; analyze working capital elasticity with respect to service level targets.",
        "rubric": "Step-by-step mathematical proof of variance propagation; complete derivation of CSL vs Fill Rate relationships; formal analysis of the normal loss function and safety stock elasticity."
      },
      {
        "title": "The Omitted Variance Disaster & $3.2M Automotive Stockout Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of an automotive distributor's $3.2M loss resulting from omittance of supplier lead-time variance in safety stock formulas: analyze ERP reorder parameter logs, supplier shipment tracking feeds, customer backorder ledgers, and dead-stock inventory aging reports; prove how variance truncation triggered rolling stockouts; author an institutional safety stock calibration policy.",
        "rubric": "Audit historical lead-time volatility and SKU stockout histories; expose the mathematical omission in the ERP safety stock calculation; deliver an enterprise stochastic buffer calibration standard."
      },
      {
        "title": "Building an Enterprise Stochastic Safety Stock & Service Level Suite in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Stochastic Inventory Optimization Suite in Python: 1) Ingest empirical demand and delivery lead-time distributions; 2) Test for normality and implement bootstrap resampling for non-normal empirical distributions; 3) Compute exact variance propagation and required safety stocks across CSL (90%-99.9%) and Fill Rate targets; 4) Model SKU-level safety stock differentiation based on gross margin and stockout penalties; 5) Output an executive working capital risk dashboard.",
        "rubric": "Working Python stochastic inventory engine; verified variance propagation calculus; non-normal distribution handling; accurate safety stock and fill rate calibration."
      },
      {
        "title": "Red Sea Shipping Disruption & 30-Day Lead Time Shock 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when a geopolitical conflict forces global container shipping to divert around the Cape of Good Hope, adding 18 to 25 days to overseas maritime lead times and doubling lead-time standard deviation overnight: detect the transit time surge; dynamically recalculate safety stock buffers across 8,000 import SKUs; trigger emergency air-freight bridging for critical component shortages.",
        "rubric": "Rapid detection of maritime transit time inflation; automated recalibration of lead-time variance and ROP parameters; identify critical shortage SKUs and dispatch air-bridge orders within 20 minutes."
      }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "Continuous Review (s, Q) vs Periodic Review (R, S) Inventory Policies: Reorder Points & Base Stock Levels",
    "stageName": "Stage 1: Supply Chain Fundamentals, Mathematical Inventory Optimization & Operational Flow",
    "stageNum": 1,
    "pedagogicalRole": "Inventory Policy Design, Stochastic Control Theory & Replenishment Architecture",
    "spokenGoal": "Every inventory management system in the world operates under one of two core control paradigms: Continuous Review or Periodic Review. In a Continuous Review (s, Q) system, inventory is tracked in real-time, and the instant inventory position drops below the reorder point 's', a fixed batch 'Q' is ordered. In a Periodic Review (R, S) system, inventory is checked only at fixed calendar intervals 'R' (e.g. every Monday), and an order is placed to bring the inventory position up to an order-up-to level 'S'. Today we engineer both control architectures. We analyze their mathematical trade-offs: Continuous Review requires real-time IoT/WMS telemetry but holds less safety stock because the risk period is only lead time L; Periodic Review consolidates supplier shipments but requires holding safety stock over the extended protection interval (R + L).",
    "conceptInvariant": "Inventory Control Policy & Protection Interval Invariant: Under Continuous Review (s, Q), the exposure risk interval equals supplier lead time L: Risk_interval = L, and Reorder Point s = D * L + Z * sigma_D * sqrt(L); under Periodic Review (R, S), the exposure risk interval equals the review period plus lead time: Risk_interval = R + L, and Order-Up-To Level S = D * (R + L) + Z * sigma_D * sqrt(R + L); safety stock under Periodic Review is strictly greater than Continuous Review by the factor sqrt((R + L) / L).",
    "failureMode": "A supermarket retail chain switches its fresh dairy replenishment from a Continuous Review WMS to a weekly Periodic Review policy (R = 7 days, L = 2 days) to consolidate truck deliveries, but fails to adjust its order-up-to target S to reflect the combined protection period (R + L = 9 days). Over the weekend, 45 stores run completely out of milk, eggs, and yogurt before Monday morning review cycles occur. The chain loses $420,000 in perishable sales, discards spoiled inventory from panic over-ordering on Monday, and suffers an 18% customer churn rate to competitor grocery chains.",
    "tryItFriction": "Build an Enterprise Inventory Policy Simulator in Python comparing (s, Q), (s, S), and (R, S) systems: 1) Model daily stochastic customer demand and supplier delivery lead times; 2) Implement a Continuous Review (s, Q) engine tracking live inventory position and triggering replenishment orders; 3) Implement a Periodic Review (R, S) engine reviewing stock every R days and ordering up to target S; 4) Simulate a 365-day operational run comparing average inventory levels, stockout rates, and total operating costs; 5) Determine the optimal policy choice based on ordering transaction costs vs holding capital.",
    "socraticHints": [
      "Why does a Periodic Review (R, S) policy always require more safety stock than a Continuous Review (s, Q) policy?",
      "Because under Continuous Review, an order is placed the instant stock drops, so the business is only exposed to stockout risk during the lead time L; under Periodic Review, an unexpected surge right after a review must survive both the remaining review period R AND the lead time L before new stock arrives.",
      "The protection interval is (R + L), increasing safety stock requirements by the square root of (R + L) / L."
    ],
    "situationalPuzzle": {
      "scenario": "A hardware distributor evaluates inventory policies for power drills. Average demand D = 50 drills/day (sigma_D = 10 drills/day). Supplier lead time L = 4 days. Target service level CSL = 95% (Z = 1.645). System A: Continuous Review (s, Q). System B: Periodic Review (R, S) with review period R = 5 days. What is the safety stock required under System A versus System B, and why does System B require significantly more working capital?",
      "options": [
        "Both systems require the exact same safety stock because demand is 50/day.",
        "Calculate step by step: 1) System A (Continuous Review, Protection Period = L = 4 days): SS_A = Z * sigma_D * sqrt(L) = 1.645 * 10 * sqrt(4) = 1.645 * 10 * 2 = 32.9 drills (Reorder point s = 50 * 4 + 33 = 233 drills). 2) System B (Periodic Review, Protection Period = R + L = 5 + 4 = 9 days): SS_B = Z * sigma_D * sqrt(R + L) = 1.645 * 10 * sqrt(9) = 1.645 * 10 * 3 = 49.35 drills (Order-Up-To S = 50 * 9 + 50 = 500 drills). 3) Difference: System B requires 50% more safety stock (49 vs 33 drills) because it must protect against demand spikes across 9 full days instead of 4 days! System B trades higher working capital for consolidated supplier order batches!",
        "System B requires less safety stock because periodic reviews are more disciplined.",
        "System A cannot be automated in modern ERP systems."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In a periodic review system, the business is vulnerable across the combined review period and lead time (R + L = 9 days). Safety stock scales with the square root of the protection interval: sqrt(9) / sqrt(4) = 3 / 2 = 1.5 (a 50% increase). System B requires 49 units of safety stock vs 33 units for System A."
    },
    "quests": [
      {
        "title": "Inventory Control Theory, Continuous vs Periodic State Formulations",
        "type": "concept",
        "description": "Formulate stochastic inventory control policies: analyze the state equations of Inventory Position (On-Hand + On-Order - Backorders); formulate Continuous Review policies (s, Q) and (s, S) (min-max systems); formulate Periodic Review policies (R, S) and (R, s, S); derive the protection interval equations proving safety stock scaling sqrt((R+L)/L); evaluate computational trade-offs in modern Cloud ERP WMS architectures.",
        "rubric": "Step-by-step mathematical derivation of protection interval equations; formal state machine transition models for (s, Q) and (R, S) policies; comprehensive comparative evaluation matrix."
      },
      {
        "title": "The Periodic Review Weekend Blackout & $420,000 Perishable Waste Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a grocery chain's $420,000 loss resulting from an uncalibrated switch from continuous to periodic inventory review: analyze POS transaction timestamps, store stockout incident logs, supplier delivery manifests, and perishable spoilage disposal records; prove how failure to expand the protection period caused store stockouts; author an institutional replenishment policy standard.",
        "rubric": "Audit store inventory position traces and weekend sales data; expose the mathematical flaw in order-up-to target setting; deliver an enterprise inventory policy selection standard."
      },
      {
        "title": "Building an Enterprise Inventory Control Policy Simulator in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Inventory Policy Simulation Engine in Python: 1) Model daily customer arrivals and stochastic demand distributions; 2) Build a Continuous Review (s, Q) simulator with real-time stock monitoring; 3) Build a Periodic Review (R, S) simulator with calendar-based batch ordering; 4) Implement an adaptive (s, S) min-max policy adjusting thresholds dynamically to demand trends; 5) Output comparative performance metrics (service level, inventory turns, total annual cost).",
        "rubric": "Working Python simulation suite; verified implementation of (s, Q), (s, S), and (R, S) policies; accurate tracking of on-hand vs pipeline inventory; robust performance analytics."
      },
      {
        "title": "ERP Inventory Position Synchronization Freeze 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when a distributed message queue failure disconnects your warehouse WMS from your central ERP, freezing inventory position updates and causing automated (s, Q) replenishment triggers to stop firing for 1,200 fast-moving retail SKUs: detect the telemetry desynchronization; deploy an emergency state reconciliation script; reconstruct true inventory positions; trigger queued replenishment purchase orders.",
        "rubric": "Rapid detection of inventory position freeze; execute state reconciliation script between WMS physical counts and ERP ledgers; restore automated purchase order generation within 15 minutes."
      }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "Milestone 1: ApexInventory Sovereign Deterministic & Stochastic Replenishment Engine",
    "stageName": "Stage 1: Supply Chain Fundamentals, Mathematical Inventory Optimization & Operational Flow",
    "stageNum": 1,
    "pedagogicalRole": "Production Inventory System Synthesis, Stochastic Optimization & Autonomous Replenishment",
    "spokenGoal": "Milestone 1 is the capstone synthesis of Stage 1 Block 1! Today, you synthesize Total Inventory Cost Physics (Day 1), Economic Order Quantity & Quantity Discount Calculus (Day 2), Stochastic Safety Stock & Lead-Time Variance Propagation (Day 3), and Continuous vs Periodic Control Policies (Day 4) into a production-grade enterprise inventory optimization platform: ApexInventory. You will engineer an end-to-end replenishment engine that manages thousands of SKUs simultaneously: calculating optimal order quantities, dynamically adjusting safety stocks based on empirical lead-time volatility, evaluating supplier bulk discount breaks, and autonomously generating purchase orders under non-stationary demand. Zero avoidable stockouts, minimum working capital, mathematically proven cost optimality.",
    "conceptInvariant": "ApexInventory Unified Replenishment Invariant: Every SKU managed by the engine must satisfy global cost and service level optimality: Q_optimal = ArgMin_Q { TIC(Q, Discounts) }; Safety_Stock = Z(CSL_target) * sqrt(L_avg * sigma_D^2 + D_avg^2 * sigma_L^2); Inventory_Position = Stock_on_hand + Stock_on_order - Backorders; Purchase Order is emitted if and only if Inventory_Position <= Reorder_Point(s); annual stockout probability must strictly equal (1 - CSL_target) within 95% statistical confidence.",
    "failureMode": "An enterprise industrial distributor manages $80,000,000 of inventory using fragmented legacy Excel spreadsheets and manual buyer rules of thumb. Over 12 months, holding costs balloon to $22,000,000, critical machinery parts suffer a 14% stockout rate causing client contract cancellations, and bulk discounts are accepted on slow-moving items that expire in storage. The lack of an integrated quantitative inventory engine drains $6,500,000 in unnecessary working capital and operational losses.",
    "tryItFriction": "Build and Validate the Complete ApexInventory Production Suite in Python: 1) Model a catalog of 1,000 diverse SKUs with empirical demand and lead-time distributions; 2) Compute optimal lot sizes integrating supplier price discounts; 3) Compute variance-propagated safety stocks and reorder points for target service levels; 4) Implement an autonomous Continuous Review (s, Q) execution loop processing 365 days of synthetic transactions; 5) Generate executive working capital, inventory turn, and stockout performance ledgers.",
    "socraticHints": [
      "Why must an enterprise inventory engine evaluate lot sizing and safety stock simultaneously rather than in isolation?",
      "Because lot size Q determines average cycle inventory (Q/2) and ordering frequency, while safety stock determines buffer inventory; both compete for the same corporate working capital and warehouse cubic storage space.",
      "ApexInventory unifies cycle stock and safety stock optimization into a single holistic mathematical decision pipeline."
    ],
    "situationalPuzzle": {
      "scenario": "During Milestone 1 simulation testing of ApexInventory across 500 SKUs, diagnostics report: 1) Fast-moving SKUs achieved 98.2% service level with zero stockouts; 2) Supplier discount optimization saved $340,000 in purchase costs; but 3) Warehouse storage capacity exceeded its physical ceiling by 35% in month 4, triggering expensive third-party overflow storage fees of $120,000! What mathematical constraint was missing from the unconstrained SKU optimization model?",
      "options": [
        "Ban all supplier quantity discounts permanently.",
        "The engine lacked a Shared Multi-Item Storage Capacity Constraint! Unconstrained multi-SKU EOQ optimizes each product independently, but in physical operations, all items share a finite warehouse volume: sum(Q_i * Volume_i) <= Total_Warehouse_CBM! When multiple bulk discount orders arrived simultaneously, aggregate inventory breached warehouse capacity! The engine must be upgraded with Lagrangian Multiplier relaxation to solve the Constrained Multi-Item EOQ problem, throttling order sizes when aggregate volume approaches capacity!",
        "Double the physical warehouse size immediately.",
        "Increase customer prices to suppress demand."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Individual SKU optimization ignores shared physical and financial constraints. When 500 SKUs independently order bulk quantities, aggregate inventory breaches physical warehouse storage limits. Upgrading the engine to Constrained Multi-Item EOQ using Lagrangian multipliers guarantees that total inventory volume never exceeds physical warehouse capacity."
    },
    "quests": [
      {
        "title": "ApexInventory Architectural Specification & Multi-Item Lagrangian Formulations",
        "type": "concept",
        "description": "Formulate the comprehensive mathematical architecture of ApexInventory: synthesize deterministic lot sizing, quantity discount matrices, stochastic variance propagation, and continuous review control into a formal system specification; formulate the Constrained Multi-Item EOQ problem with shared warehouse volume and capital budget constraints using Lagrangian multipliers (KKT optimality conditions).",
        "rubric": "Master-level mathematical formulation of multi-item constrained inventory optimization; formal derivation of Lagrangian shadow prices for warehouse capacity and working capital limits."
      },
      {
        "title": "The Spreadsheet Legacy & $6.5M Working Capital Drain Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of an industrial distributor's $6.5M loss resulting from unintegrated spreadsheet inventory management: analyze buyer purchasing logs, supplier volume discount contracts, warehouse space utilization records, and stockout penalty ledgers; prove how lack of automated stochastic optimization caused capital drain; author an institutional inventory automation standard.",
        "rubric": "Audit historical buyer purchasing spreadsheets against empirical stockout data; expose the systemic errors in manual lot sizing and safety buffer calculations; deliver an enterprise inventory automation charter."
      },
      {
        "title": "Building the Complete ApexInventory Production Suite in Python",
        "type": "mastery",
        "description": "Engineer the complete ApexInventory Production Suite in Python: 1) Ingest multi-SKU catalogs with stochastic demand, lead times, and supplier price brackets; 2) Implement constrained multi-item EOQ optimization with warehouse volume limits; 3) Compute variance-propagated safety stocks and dynamic reorder points; 4) Simulate a 365-day automated replenishment pipeline; 5) Demonstrate 98%+ service levels, zero capacity overflows, and optimal working capital efficiency.",
        "rubric": "Complete working Python inventory optimization suite; verified constrained multi-item optimization; flawless 365-day replenishment execution; audit-ready executive telemetry reports."
      },
      {
        "title": "Global Ocean Carrier Collapse & 500-SKU Pipeline Blackout 3 AM Crisis Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when a major global ocean shipping line files for bankruptcy, stranding 45 containers holding inventory for 500 critical SKUs at sea indefinitely: detect the pipeline failure; instantly adjust active pipeline inventory in ApexInventory; recalculate expedited replenishment schedules via air freight and nearshore suppliers; prevent nationwide stockout collapse.",
        "rubric": "Rapid zeroing of stranded pipeline inventory; execute automated multi-SKU emergency air-freight allocation; re-establish minimum safety buffers within 20 minutes."
      }
    ]
  },
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "Quantitative Demand Forecasting & Time Series Decomposition: Holt-Winters, Tracking Signals & Bias Control",
    "stageName": "Stage 2: Operational Execution, Production Scheduling & Warehouse Physics",
    "stageNum": 2,
    "pedagogicalRole": "Quantitative Forecasting, Time Series Econometrics & Error Telemetry",
    "spokenGoal": "Every operational decision—from factory shifts to shipping container charters—begins with a demand forecast. If your forecast is biased, your supply chain will oscillate between violent stockouts and suffocating warehouse gluts. Today we engineer Quantitative Demand Forecasting & Time Series Decomposition. We move beyond simplistic moving averages to Double Exponential Smoothing (Holt's Linear Trend) and Triple Exponential Smoothing (Holt-Winters Multiplicative Seasonality). We deconstruct historical sales into Level, Trend, and Seasonal indices. Crucially, we implement statistical tripwires: Tracking Signals (TS) and Mean Absolute Scaled Error (MASE) to detect forecast drift and structural demand breaks before they poison upstream manufacturing schedules.",
    "conceptInvariant": "Demand Decomposition & Tracking Signal Invariant: Additive demand time series satisfies: Y_t = Level_t + Trend_t + Seasonality_t + epsilon_t; Holt-Winters update equations recursively update Level (alpha), Trend (beta), and Seasonal factors (gamma); Cumulative Forecast Error (Running Sum of Forecast Errors RSFE) must remain centered around zero: RSFE = sum_{t=1}^n (A_t - F_t); Tracking Signal TS = RSFE_t / MAD_t must satisfy control limits: abs(TS_t) <= 4.0; exceeding control limits triggers automated model recalibration.",
    "failureMode": "A beverage manufacturer uses an un-damped linear trend model during summer peak sales. When autumn arrives and demand naturally cools, the model continues forecasting an upward trend. The production plant bottles 1,200,000 cases of seasonal iced tea that go unsold. The company runs out of warehouse space, leases emergency tent storage where 300,000 cases freeze and rupture during the first frost ($900,000 loss), and writes down $2,100,000 in expired product. Total unhedged forecasting disaster: $3,000,000.",
    "tryItFriction": "Build an Enterprise Demand Forecasting & Tracking Signal Suite in Python: 1) Ingest 36 months of historical SKU demand data exhibiting trend and seasonality; 2) Implement Triple Exponential Smoothing (Holt-Winters) optimizing alpha, beta, and gamma via Nelder-Mead minimization of RMSE; 3) Compute forecast error metrics (MAD, MSE, MAPE, and Hyndman's MASE); 4) Implement an automated Tracking Signal (TS) tripwire alerting when cumulative bias breaches +/- 4.0; 5) Generate a rolling 12-month production forecast.",
    "socraticHints": [
      "Why is Mean Absolute Percentage Error (MAPE) dangerously misleading when evaluating low-volume or intermittent demand SKUs?",
      "Because when actual demand is near zero, dividing by actual demand creates astronomical percentage errors, and when actual demand is zero, MAPE divides by zero and becomes mathematically undefined.",
      "Hyndman's Mean Absolute Scaled Error (MASE) solves this by scaling errors relative to the in-sample naive persistence forecast, providing a robust, scale-independent metric across all demand profiles."
    ],
    "situationalPuzzle": {
      "scenario": "You are auditing a home appliance manufacturer's quarterly demand forecasting performance across 100 SKUs. Over the past 6 months: Total Actual Demand = 450,000 units. Total Forecast = 390,000 units. Running Sum of Forecast Errors RSFE = +60,000 units. Mean Absolute Deviation MAD = 12,000 units. What is the current Tracking Signal, what does its sign indicate, and what action must operations take?",
      "options": [
        "Tracking signal is 0.2; system is operating normally.",
        "Calculate step by step: 1) Tracking Signal TS = RSFE / MAD = +60,000 / 12,000 = +5.0! 2) Standard statistical control limits are [-4.0, +4.0]. A Tracking Signal of +5.0 breaches the upper control limit! 3) A positive RSFE (+60,000) indicates consistent UNDER-FORECASTING (actual demand consistently exceeds forecast)! 4) Action: The forecasting model has persistent negative bias, causing stockouts and supplier expediting. Operations must immediately halt the current model, adjust the base level upward, and recalibrate trend smoothing parameters!",
        "Tracking signal is negative, indicating excess inventory.",
        "Tracking signals only apply to financial stock portfolios."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Tracking Signal measures forecast bias relative to dispersion: TS = RSFE / MAD. A value of +5.0 exceeds the universal industrial tripwire threshold of +4.0. The positive sign proves the model is consistently under-forecasting reality, starving manufacturing of raw materials and causing rolling stockouts."
    },
    "quests": [
      {
        "title": "Time Series Decomposition, Holt-Winters Smoothing & Error Metric Formulations",
        "type": "concept",
        "description": "Formulate quantitative forecasting theory: analyze classical time series decomposition (additive vs multiplicative models); derive the recursive update equations for Simple Exponential Smoothing, Holt's Linear Trend, and Holt-Winters Seasonal models; formulate the statistical properties of forecast errors (unbiasedness, homoscedasticity, and white-noise residuals); evaluate Hyndman's Mean Absolute Scaled Error (MASE) versus MAPE; derive Tracking Signal statistical control charts.",
        "rubric": "Step-by-step mathematical derivation of Holt-Winters smoothing equations; formal definition and statistical proofs for MASE and Tracking Signal control bounds; comprehensive comparative evaluation matrix."
      },
      {
        "title": "The Runaway Linear Trend & $3M Frozen Beverage Write-Down Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a beverage company's $3M inventory write-down resulting from unmonitored forecasting bias and lack of tracking signal tripwires: analyze historical monthly forecast versus actual sales ledgers, production bottling schedules, warehouse overflow lease agreements, and damaged inventory write-off logs; prove how forecasting bias triggered the catastrophe; author an institutional forecasting governance standard.",
        "rubric": "Audit historical time series data and forecast bias metrics; expose the unmonitored trend extrapolation flaw; deliver an enterprise demand planning and tracking signal governance charter."
      },
      {
        "title": "Building an Enterprise Holt-Winters Forecasting & Bias Detection Suite in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Demand Forecasting Suite in Python: 1) Implement Holt-Winters additive and multiplicative smoothing algorithms; 2) Build an automated hyperparameter optimizer fitting alpha, beta, and gamma to historical data via SciPy minimize; 3) Compute comprehensive error metrics: MAD, RMSE, MAPE, and MASE; 4) Implement an automated Tracking Signal monitor that detects bias breaches (|TS| > 4.0) and triggers auto-recalibration; 5) Output a visual forecast cone with 95% prediction intervals.",
        "rubric": "Working Python forecasting suite; verified Holt-Winters implementation; automated parameter tuning; robust error calculation and tracking signal tripwire alerting."
      },
      {
        "title": "Viral Social Media Demand Spike & Model Saturation 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when an unexpected viral video causes orders for a niche cookware SKU to spike from 50 units/day to 4,000 units/day, breaking automated forecasting assumptions and causing standard exponential smoothing to forecast 50,000 units/day for the next 6 months: detect the outlier event; isolate the viral spike from baseline smoothing; apply Bass Diffusion / Gompertz curve saturation modeling; adjust factory production commitments to realistic peak capacity.",
        "rubric": "Rapid detection of viral demand shock; isolate transient impulse from persistent trend; deploy diffusion curve ceiling to prevent massive factory over-production within 15 minutes."
      }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "Sales & Operations Planning (S&OP) & Aggregate Production Planning: Chase vs Level Strategies & LP Optimization",
    "stageName": "Stage 2: Operational Execution, Production Scheduling & Warehouse Physics",
    "stageNum": 2,
    "pedagogicalRole": "Aggregate Planning, S&OP Governance & Linear Programming Production Optimization",
    "spokenGoal": "Sales & Operations Planning (S&OP) is the executive bridge between the commercial promises of the sales team and the physical constraints of manufacturing and supply chain. When sales promises a 40% surge in volume without consulting operations, factories face overtime exhaustion, machine breakdowns, and missed delivery dates. Today we engineer S&OP & Aggregate Production Planning over a 12-to-18 month rolling horizon. We formulate the classic production strategies: Chase Strategy (matching production directly to demand by hiring/firing workers), Level Strategy (maintaining constant production and absorbing demand swings through inventory and backorders), and Hybrid Strategies. We formulate the Aggregate Production Plan as a Linear Program (LP), mathematically minimizing labor, hiring, layoff, overtime, subcontracting, and inventory carrying costs.",
    "conceptInvariant": "Aggregate Production Planning & Inventory Balance Invariant: For every planning period t in horizon T, inventory and workforce conservation must hold strictly: Inventory_t = Inventory_{t-1} + Production_t - Demand_t; Workforce_t = Workforce_{t-1} + Hired_t - LaidOff_t; Production_t <= Workforce_t * Labor_hours_per_worker / Labor_hours_per_unit + Overtime_production_t; Linear Programming objective minimizes total cost: Min sum_t { C_labor * W_t + C_hire * H_t + C_lay * L_t + C_hold * I_t + C_back * B_t + C_sub * S_t } subject to non-negativity and capacity constraints.",
    "failureMode": "A consumer goods appliance manufacturer adopts a pure Chase production strategy without modeling severance, recruiting, and learning-curve costs. Over a volatile 12-month cycle, the plant hires 350 assembly workers in spring, lays off 280 in autumn, and re-hires 300 in winter. Severance payouts total $1,400,000, recruiting and training costs reach $950,000, and factory scrap rates soar from 1.5% to 8.2% ($1,800,000 in defective units) due to green, inexperienced workers. The 'flexible' chase strategy burns $4,150,000 in avoidable operational chaos.",
    "tryItFriction": "Build an Enterprise Aggregate Production Planning Linear Optimizer in Python using SciPy/PuLP: 1) Model an 18-month rolling demand forecast with seasonal peaks; 2) Define cost parameters: regular labor rate, overtime premium, hiring cost, layoff severance, holding cost, and backorder penalty; 3) Formulate the Linear Programming model with inventory balance and workforce transition constraints; 4) Solve for the cost-optimal production schedule across Chase, Level, and Hybrid policies; 5) Generate executive workforce and inventory allocation schedules.",
    "socraticHints": [
      "What is the core economic trade-off between a pure Chase strategy and a pure Level production strategy?",
      "A Chase strategy minimizes inventory holding costs by matching demand, but incurs heavy labor hiring, firing, training, and scrap costs; a Level strategy stabilizes the workforce and maximizes production efficiency, but builds massive seasonal inventory that ties up working capital.",
      "A mathematically optimized Hybrid strategy uses linear programming to find the exact blend of modest seasonal inventory pre-building, controlled overtime, and minimal workforce fluctuations."
    ],
    "situationalPuzzle": {
      "scenario": "A farm equipment manufacturer plans production for 4 quarters. Demand: Q1 = 1,000, Q2 = 3,000, Q3 = 4,000, Q4 = 2,000 (Total = 10,000 units). Regular workforce can produce 2,500 units/quarter. Regular production cost = $2,000/unit. Overtime production cost = $2,500/unit (Max OT = 500 units/Q). Inventory holding cost = $100/unit/quarter. Beginning inventory = 0. Option A: Pure Level production (produce 2,500 units each quarter, hold inventory). Option B: Pure Chase using overtime and subcontractors ($2,800/unit). Which strategy is cheaper, and by how much?",
      "options": [
        "Both strategies cost the exact same.",
        "Calculate Option A (Level Strategy): 1) Q1: Produce 2,500, Demand 1,000 => End Inv = 1,500. Holding cost = 1,500 * $100 = $150,000. 2) Q2: Produce 2,500, Demand 3,000 => End Inv = 1,000. Holding cost = 1,000 * $100 = $100,000. 3) Q3: Produce 2,500, Demand 4,000 => End Inv = -500 (Backorder of 500 units)! But backorders are prohibited! Therefore, Q3 requires producing 500 units of Overtime ($2,500/unit = +$250,000 premium over regular)! With 500 OT, End Inv = 0. 4) Q4: Produce 2,500, Demand 2,000 => End Inv = 500. Holding cost = 500 * $100 = $50,000. Total Cost for Option A = Regular Production (10,000 * $2,000 = $20,000,000) + OT Premium (500 * $500 = $250,000) + Holding ($300,000) = $20,550,000! Option B (Chase via subcontracting 1,000 units @ $2,800) costs $20,800,000! Option A saves $250,000 while maintaining a stable, trained workforce!",
        "Option B is cheaper because holding inventory is always bad.",
        "Shut down the plant during Q1 to save money."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In capital-intensive manufacturing, producing at a steady level (with strategic pre-building in Q1/Q2 and a modest 500 units of overtime in Q3) easily beats expensive third-party subcontracting. Option A costs $20,550,000 vs $20,800,000 for Option B, saving $250,000 while stabilizing plant operations."
    },
    "quests": [
      {
        "title": "S&OP Governance Architecture, Aggregate Production Models & LP Formulations",
        "type": "concept",
        "description": "Formulate aggregate production planning: analyze the 5-step monthly executive S&OP governance cadence (Data Gathering, Demand Planning, Supply Planning, Pre-S&OP, Executive S&OP); formulate the state balance equations for multi-period workforce and inventory conservation; formulate the complete Linear Programming optimization problem in canonical matrix form (c^T x subject to Ax <= b, A_eq x = b_eq, x >= 0); evaluate workforce smoothing and overtime constraints.",
        "rubric": "Step-by-step mathematical formulation of the Aggregate Planning LP model; complete architectural diagram of the monthly S&OP executive decision loop; formal proof of inventory-workforce balance constraints."
      },
      {
        "title": "The Whiplash Workforce & $4.15M Chase Strategy Catastrophe Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of an appliance manufacturer's $4.15M loss resulting from unconstrained hiring and firing under a naive Chase production strategy: analyze HR payroll records, severance settlement ledgers, factory quality scrap logs, and overtime authorization slips; prove how workforce turnover destroyed manufacturing yields; author an institutional aggregate planning policy.",
        "rubric": "Audit historical labor turnover records against factory defect rates and severance costs; expose the systemic failure in aggregate planning; deliver an enterprise S&OP workforce stability mandate."
      },
      {
        "title": "Building an Enterprise Aggregate Planning & LP Optimization Suite in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Aggregate Production Planning Optimizer in Python using PuLP or SciPy: 1) Model an 18-month rolling demand horizon with workforce, production, and storage parameters; 2) Build an LP solver minimizing total operational cost under regular time, overtime, subcontracting, inventory, and backorder variables; 3) Implement sensitivity analysis on labor cost variations and overtime limits; 4) Compare Chase, Level, and LP-Optimal Hybrid schedules; 5) Output executive S&OP dashboard visuals.",
        "rubric": "Working Python LP optimization suite; verified constraint satisfaction across all 18 periods; accurate comparison of Chase, Level, and Hybrid policies; clear executive dashboard visualization."
      },
      {
        "title": "Critical Plant Boiler Explosion & Emergency Production Re-Allocation 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when a catastrophic boiler failure takes your primary assembly plant (representing 55% of global production capacity) offline for an estimated 6 weeks: detect the capacity loss; re-run the aggregate production LP solver across secondary regional sister facilities, subcontracting partners, and overtime allowances; re-allocate production schedules; preserve high-margin customer delivery commitments.",
        "rubric": "Rapid recalibration of global manufacturing capacity parameters; execute multi-facility LP re-optimization; allocate emergency production quotas across alternative nodes within 20 minutes."
      }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "Material Requirements Planning (MRP I) & Bill of Materials (BOM) Explosion: Lead-Time Offsetting & Scrap Factors",
    "stageName": "Stage 2: Operational Execution, Production Scheduling & Warehouse Physics",
    "stageNum": 2,
    "pedagogicalRole": "Production Engineering, Bill of Materials Graph Algorithms & MRP Execution",
    "spokenGoal": "Aggregate planning tells us we need 10,000 bicycles next quarter; Material Requirements Planning (MRP I) tells us exactly how many spokes, bearings, gears, chains, and bolts we need to order on Tuesday at 9:00 AM to make that happen. Today we engineer Material Requirements Planning & Bill of Materials (BOM) Explosion. We model the product structure as a Directed Acyclic Graph (DAG) with hierarchical levels. We implement the core invariant of MRP: Low-Level Coding, ensuring every component is processed only at its deepest tree depth. We execute the Gross-to-Net calculation loop: subtracting on-hand stock and scheduled receipts from gross requirements, applying scrap/yield loss factors, lot-sizing the net requirements, and time-phasing orders backward by supplier lead time.",
    "conceptInvariant": "MRP Gross-to-Net & Low-Level Coding Invariant: The product structure must be a Directed Acyclic Graph (DAG) partitioned into topological Low-Level Codes (LLC): Level 0 = End Product; Level k = max(parent_level) + 1; for each item at level k: Net_Requirements_t = max(0, Gross_Requirements_t / (1 - Scrap_Rate) - On_Hand_{t-1} - Scheduled_Receipts_t); Planned Order Receipt POR_t = LotSize(Net_Requirements_t); Planned Order Release equals time-offset receipt: PORel_{t - LeadTime} = POR_t; zero circular references in BOM graphs.",
    "failureMode": "A commercial drone manufacturer maintains its multi-level BOM in disconnected spreadsheets. An engineering change notice (ECN) updates a carbon-fiber rotor arm specification, adding a 4% manufacturing scrap factor and changing lead time from 2 weeks to 6 weeks. The procurement team's MRP script does not enforce low-level coding, calculating component requirements on the old 2-week lead time and ignoring the scrap factor. When assembly begins, 150 drone bodies sit incomplete on the factory floor missing 600 rotor arms. Assembly halts for a month, delaying the holiday launch and losing $2,400,000 in pre-orders.",
    "tryItFriction": "Build an Enterprise Material Requirements Planning (MRP I) Engine in Python: 1) Model multi-level Bill of Materials (BOM) as a Directed Acyclic Graph with quantity-per-assembly multipliers and component scrap rates; 2) Implement topological Low-Level Coding (LLC) algorithm assigning valid processing tiers; 3) Ingest a Master Production Schedule (MPS) for Level 0 finished goods; 4) Execute recursive Gross-to-Net requirements calculation and lead-time backward offsetting; 5) Generate actionable Planned Order Releases and Purchase Requisitions.",
    "socraticHints": [
      "Why is Low-Level Coding (LLC) an absolute prerequisite before executing the MRP Gross-to-Net calculation loop?",
      "Because a common component (like a standard M4 bolt) might appear at Level 1 in the chassis and at Level 4 inside the motor sub-assembly; if you process it at Level 1, you will only see part of the demand and place multiple premature, incorrect orders.",
      "Assigning the item its lowest level code (Level 4) guarantees that all gross requirements from all parent assemblies have accumulated completely before net requirements and purchase orders are calculated."
    ],
    "situationalPuzzle": {
      "scenario": "You are running MRP for an industrial electric pump (Level 0). Master Production Schedule calls for 100 pumps in Week 8. BOM structure: 1 Pump requires 2 Motors (Level 1) and 4 Valves (Level 1). Each Motor requires 1 Rotor and 3 Bearings (Level 2). Each Valve requires 2 Bearings (Level 2). Notice that Bearings are used in BOTH Motors and Valves! Lead times: Pump = 1 week, Motor = 2 weeks, Valve = 1 week, Bearing = 2 weeks. On-hand stock for Bearings = 200 units. Bearing scrap rate = 0%. In what week, and for what quantity, must the Planned Order Release for Bearings be issued?",
      "options": [
        "Order 200 bearings in Week 8.",
        "Calculate step by step: 1) Pump MPS = 100 in W8. Lead time = 1 wk => Pump assembly must start in Week 7 (W7). 2) Level 1 Gross Requirements in W7: Motors = 100 * 2 = 200 units. Valves = 100 * 4 = 400 units. 3) Time-offset Level 1: Motor lead time = 2 wks => Motor release in W5 (200 motors). Valve lead time = 1 wk => Valve release in W6 (400 valves). 4) Level 2 Gross Requirements for Bearings: In W5 (for Motors): 200 motors * 3 bearings = 600 bearings! In W6 (for Valves): 400 valves * 2 bearings = 800 bearings! Total gross demand = 1,400 bearings across two separate weeks! 5) Net Requirements for Bearings in W5: Gross = 600 - On-hand (200) = 400 net bearings in W5! With 2-week lead time, Planned Order Release for first batch = 400 bearings in Week 3! In W6: Gross = 800 (no on-hand left) = 800 net bearings in W6, released in Week 4! Total = 400 in W3 and 800 in W4!",
        "Order 1,400 bearings in Week 1.",
        "Bearings do not require time offsetting because they are small parts."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. A single component used in multiple parents experiences multi-period demand based on the independent parent lead times. Motors start in Week 5 (requiring 600 bearings), consuming the 200 on-hand stock and requiring a net order of 400 released in Week 3. Valves start in Week 6 (requiring 800 bearings), triggering an 800-unit release in Week 4."
    },
    "quests": [
      {
        "title": "MRP I Mathematical Mechanics, DAG Graph Traversal & Low-Level Coding Formulations",
        "type": "concept",
        "description": "Formulate Material Requirements Planning theory: model multi-level Bill of Materials as directed acyclic graphs; mathematically prove the Low-Level Coding (LLC) invariant using topological graph sorting; derive the Gross-to-Net recursive state equations: Net(t) = max(0, Gross(t)/(1-scrap) - OnHand(t-1) - Receipts(t)); derive lead-time time-phasing backward translation; analyze lot-sizing algorithms in MRP (Lot-for-Lot, Period Order Quantity POQ, Part-Period Balancing, and Wagner-Whitin dynamic programming).",
        "rubric": "Step-by-step mathematical proof of Low-Level Coding topological sort; complete formulation of the Gross-to-Net recursive state machine; formal algorithmic analysis of Wagner-Whitin dynamic programming lot-sizing."
      },
      {
        "title": "The Spreadsheet ECN Desynchronization & $2.4M Drone Grounding Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a commercial drone manufacturer's $2.4M product delay resulting from an unintegrated spreadsheet BOM that omitted scrap rates and lead-time extensions: analyze Engineering Change Orders (ECO/ECN), ERP production orders, supplier lead-time notices, and factory floor WIP inventory tracking; prove how disconnected BOM spreadsheets caused missing components; author an institutional PLM-to-ERP integration standard.",
        "rubric": "Audit historical BOM version control histories against factory shortage reports; expose the spreadsheet synchronization vulnerability; deliver an enterprise PLM-ERP configuration management standard."
      },
      {
        "title": "Building an Enterprise Multi-Level MRP I Engine in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Material Requirements Planning (MRP I) Platform in Python: 1) Model complex multi-tier BOM trees using NetworkX directed acyclic graphs; 2) Implement topological Low-Level Coding; 3) Ingest Master Production Schedules (MPS), current inventory ledgers, and scheduled receipts; 4) Execute recursive Gross-to-Net explosions applying scrap/yield factors; 5) Implement Lot-for-Lot and POQ lot-sizing with lead-time time-phasing; 6) Output verified purchase requisitions and factory work orders.",
        "rubric": "Working Python MRP engine; verified DAG traversal and Low-Level Coding; accurate Gross-to-Net logic; robust handling of multi-parent shared components and scrap rates."
      },
      {
        "title": "BOM Circular Dependency Injection & MRP Explosion Infinite Loop 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when an erroneous CAD-to-ERP sync script introduces a circular dependency into a high-volume product BOM (Sub-assembly A references Part B which references Sub-assembly A), causing the nightly MRP explosion batch job to enter an infinite loop, freezing production scheduling nationwide: detect the graph cycle; deploy a Cycle-Detection circuit breaker (Tarjan's strongly connected components); isolate the invalid BOM; re-run MRP successfully.",
        "rubric": "Rapid detection of circular BOM dependency; execute graph cycle detection and auto-quarantine corrupted BOM nodes; complete clean MRP explosion within 15 minutes."
      }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "Manufacturing Resource Planning (MRP II) & Rough-Cut Capacity Planning (RCCP): Bottlenecks & Drum-Buffer-Rope",
    "stageName": "Stage 2: Operational Execution, Production Scheduling & Warehouse Physics",
    "stageNum": 2,
    "pedagogicalRole": "Production Capacity Engineering, Theory of Constraints & Finite Scheduling Architecture",
    "spokenGoal": "MRP I calculates what materials we need assuming infinite factory capacity. In the real world, machines have finite throughput, tooling wears down, and skilled CNC operators are scarce. An unconstrained MRP plan that schedules 180 hours of work on a 40-hour work center is an illusion. Today we advance to Manufacturing Resource Planning (MRP II) and Capacity Requirements Planning (CRP). We master Rough-Cut Capacity Planning (RCCP) at the master schedule level, detailed Capacity Requirements Planning at the routing level, and Goldratt's Theory of Constraints (TOC). We identify the plant's constraint (the bottleneck work center) and engineer the Drum-Buffer-Rope (DBR) scheduling methodology: setting the beat of the factory to the drum of the bottleneck, protecting it with an upstream time buffer, and tying a rope to material release to prevent factory floor congestion.",
    "conceptInvariant": "Finite Capacity & Theory of Constraints Invariant: For every work center j and time bucket t, total scheduled load must not exceed rated available capacity: Load_{j, t} = sum_{orders} (Setup_time_{i, j} + Run_time_{i, j} * Q_i) <= Capacity_{j, t} = Hours * Machines * Workers * Efficiency * Utilization; under Drum-Buffer-Rope (DBR) physics, the throughput of the entire production system is strictly governed by the bottleneck: Throughput_system = min_j { Capacity_j }; raw material release must be choked to match bottleneck consumption: Rate(Release) == Rate(Bottleneck).",
    "failureMode": "A precision machining manufacturer runs infinite-capacity MRP scheduling. Orders flood the shop floor, creating mountains of Work-in-Process (WIP) inventory in front of a 5-axis CNC milling machine (the plant bottleneck). Machine operators waste 30% of their shift searching through crowded pallets for rush orders. Total manufacturing lead time explodes from 2 weeks to 9 weeks, WIP inventory value climbs to $6,500,000, and cash flow freezes. The company defaults on delivery covenants for 12 defense aerospace contracts, incurring $1,800,000 in late delivery liquidated damages.",
    "tryItFriction": "Build an Enterprise Finite Capacity Planning & Drum-Buffer-Rope (DBR) Simulator in Python: 1) Model manufacturing work centers with rated machine hours, labor staffing, efficiency, and utilization factors; 2) Ingest work order routings with operation run times and setup times; 3) Compute work center loading profiles and identify bottleneck constraints; 4) Implement DBR finite scheduling: schedule the bottleneck first, place a 24-hour time buffer upstream, and pull material release via rope signals; 5) Compare shop-floor WIP levels and total throughput under infinite vs finite DBR scheduling.",
    "socraticHints": [
      "Why does releasing more raw materials onto the shop floor to 'keep workers busy' actually reduce total factory throughput?",
      "Because when material is released faster than the bottleneck machine can process it, it accumulates as Work-in-Process (WIP) inventory, clogging aisles, increasing queue times (Little's Law: W = L / lambda), and creating chaos that distracts bottleneck operators.",
      "In the Theory of Constraints, an hour lost at the bottleneck is an hour lost for the entire system; keeping non-bottlenecks busy with unneeded work produces zero additional sellable output."
    ],
    "situationalPuzzle": {
      "scenario": "A custom bicycle factory has 3 sequential work centers: 1) Tube Cutting & Miter (Capacity = 100 frames/day); 2) Frame Welding & Brazing (Capacity = 40 frames/day); 3) Powder Coat Painting (Capacity = 80 frames/day). The plant manager notices Tube Cutting workers are idle 60% of the day, so he orders them to cut 100 frames every day to maximize machine utilization. Over 30 days, what is the impact on total factory shipments and shop-floor WIP inventory?",
      "options": [
        "Factory shipments surge to 100 frames/day because Tube Cutting worked at 100% capacity.",
        "Total factory shipments remain strictly capped at 40 frames/day (the capacity of the Welding bottleneck)! Cutting 100 frames/day while Welding can only process 40 frames/day produces a surplus of 60 un-welded tube kits every single day! Over 30 days, 1,800 un-welded frame kits (60 * 30) accumulate in front of Welding, locking up $360,000 in raw material cash, consuming physical floor space, and increasing lead time by 45 days, while generating exactly ZERO additional shipped bicycles! The plant manager destroyed cash flow to make an efficiency metric look good!",
        "Factory shipments increase to 80 frames/day because painting is fast.",
        "WIP inventory decreases because cutting was efficient."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under the Theory of Constraints, the capacity of the bottleneck (Welding = 40/day) defines the absolute ceiling of the entire factory. Running non-bottlenecks faster than the bottleneck does not increase revenue; it only generates suffocating Work-in-Process (WIP) inventory that drains cash and congests the shop floor."
    },
    "quests": [
      {
        "title": "MRP II Capacity Theory, CRP Work Center Loading & Drum-Buffer-Rope Formulations",
        "type": "concept",
        "description": "Formulate manufacturing capacity engineering: analyze the hierarchy of capacity planning (Resource Requirements Planning RRP, Rough-Cut Capacity Planning RCCP, and Capacity Requirements Planning CRP); formulate work center rated capacity equations factoring historical efficiency and utilization; derive Goldratt's Theory of Constraints (TOC) 5 Focusing Steps; formulate the Drum-Buffer-Rope (DBR) finite scheduling mathematical model; prove Little's Law WIP-lead time dynamics (W = L / lambda).",
        "rubric": "Step-by-step mathematical formulation of work center load profiles and rated capacity; formal state equations of the DBR scheduling mechanism; complete proof of Little's Law applied to manufacturing floor WIP queues."
      },
      {
        "title": "The Infinite Capacity Delusion & $1.8M Liquidated Damages Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a precision machining company's $1.8M liquidated damages disaster resulting from infinite-capacity MRP scheduling that caused shop-floor gridlock and ballooning WIP: analyze machine utilization logs, dispatch list priority overrides, work-in-process inventory holding ledgers, and customer late-delivery claims; prove how non-bottleneck overproduction choked the plant; author an institutional finite scheduling policy.",
        "rubric": "Audit work center loading profiles and shop-floor WIP queue lengths; expose the infinite capacity scheduling flaw; deliver an enterprise finite capacity scheduling and DBR standard."
      },
      {
        "title": "Building an Enterprise CRP & Drum-Buffer-Rope Scheduling Suite in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Capacity Planning & Finite Scheduling Engine in Python: 1) Model work centers with available machine/labor hours, shifts, and efficiency factors; 2) Ingest work order routings and calculate time-phased load profiles; 3) Identify bottleneck operations and compute overload percentages; 4) Implement Drum-Buffer-Rope finite forward scheduling with dynamic time buffers; 5) Demonstrate 40%+ reduction in shop-floor WIP and zero late customer deliveries.",
        "rubric": "Working Python finite scheduling engine; verified work center load vs capacity calculations; functional DBR bottleneck scheduling implementation; demonstrable WIP reduction."
      },
      {
        "title": "Critical Bottleneck CNC Spindle Bearing Seizure 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when the main bearing on your plant's sole 5-axis CNC machining center (the plant bottleneck) seizes, halting the machine for an estimated 72 hours while 25 customer work orders face contract delivery cancellations: detect the constraint outage; re-route compatible jobs to secondary 3-axis machines requiring auxiliary setups; dispatch emergency off-site subcontract machining; adjust downstream assembly schedules.",
        "rubric": "Rapid identification of bottleneck machine downtime; dynamically re-route operation routings across alternative work centers; deploy subcontract capacity preserving delivery dates within 20 minutes."
      }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "Milestone 2: ApexPlanning Enterprise S&OP & Multi-Level MRP Explosion Suite",
    "stageName": "Stage 2: Operational Execution, Production Scheduling & Warehouse Physics",
    "stageNum": 2,
    "pedagogicalRole": "Production Planning Synthesis, Multi-Level MRP Architecture & Finite Capacity Leveling",
    "spokenGoal": "Milestone 2 is the industrial manufacturing synthesis of Stage 2 Block 2! Today, you synthesize Quantitative Demand Forecasting & Tracking Signals (Day 6), Aggregate Production Planning & Linear Programming (Day 7), Material Requirements Planning (MRP I) & BOM Explosions (Day 8), and Finite Capacity Requirements Planning & Drum-Buffer-Rope (Day 9) into a production-grade master enterprise planning suite: ApexPlanning. You will engineer a closed-loop planning engine that ingests rolling multi-year customer demand forecasts, solves an Aggregate Production Plan via linear programming, explodes recursive multi-level BOMs across complex product trees, validates finite work center capacities, and generates feasible shop-floor work orders and supplier purchase orders. Zero phantom component shortages, zero work center overloads, 100% feasible manufacturing execution.",
    "conceptInvariant": "Closed-Loop Manufacturing Planning Invariant: The complete planning pipeline must satisfy sequential feasibility: Forecast(MAE_min, abs(TS) <= 4.0) -> Aggregate_LP(Min_Cost, Workforce_feasible) -> MPS(Level_0) -> MRP_Explosion(Topological_LLC, Scrap_factored) -> CRP(Load_{j, t} <= Capacity_{j, t}); every generated work order must be mathematically feasible in both raw material availability and machine work center capacity; zero infinite-capacity hallucinations.",
    "failureMode": "An enterprise industrial machinery corporation operates with disconnected forecasting, spreadsheets, and shop-floor dispatch tools. Marketing forecasts 25% growth, the factory purchases $18,000,000 of raw steel, but assembly work centers lack welding capacity. $12,000,000 of half-built machines sit outside in parking lots exposed to weather, 400 customer orders miss delivery dates, and the company incurs $4,500,000 in liquidated damages, rework costs, and emergency subcontracting fees.",
    "tryItFriction": "Build and Validate the Complete ApexPlanning Production Suite in Python: 1) Generate a 12-month seasonal forecast with automated tracking signal tripwires; 2) Solve an Aggregate Production Plan using Linear Programming; 3) Explode a 4-tier Bill of Materials DAG enforcing Low-Level Coding; 4) Execute Capacity Requirements Planning (CRP) detecting and leveling work center overloads via finite DBR scheduling; 5) Generate executive Master Production Schedules and component purchase orders.",
    "socraticHints": [
      "Why is a closed-loop MRP II planning feedback loop fundamentally different from classic open-loop MRP I?",
      "Classic MRP I is open-loop: it assumes infinite capacity and blindly generates orders regardless of whether the factory can build them; closed-loop MRP II feeds capacity feedback from CRP back into the Master Production Schedule, iteratively adjusting production dates until the plan is 100% physically buildable.",
      "ApexPlanning closes the loop between material requirements and physical factory constraints."
    ],
    "situationalPuzzle": {
      "scenario": "During Milestone 2 simulation testing of ApexPlanning, the MRP explosion generates planned orders for 5,000 industrial pumps in Month 6. However, CRP analysis reveals that Work Center 4 (Final Assembly) has 800 hours of available capacity, but the planned orders require 1,200 hours (a 150% overload)! The junior planner suggests: 'Just approve the MRP plan and tell assembly to work faster.' How must ApexPlanning resolve this capacity infeasibility?",
      "options": [
        "Ignore the overload and let orders fall behind schedule.",
        "The Closed-Loop Feedback Engine must trigger Master Schedule Leveling: 1) Reject the unconstrained MRP output as physically unfeasible; 2) Evaluate finite capacity remediation options: authorize 150 hours of planned overtime, pre-build 250 pumps in Month 5 (where assembly capacity has a 300-hour surplus), and reschedule the remaining 100 non-critical units to Month 7; 3) Re-explode the leveled MPS through MRP! This guarantees that every released work order is 100% executable within actual factory machine hours!",
        "Double the reported machine hours in the software database to clear the warning.",
        "Cancel all customer orders for Month 6."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In closed-loop MRP II, an infeasible plan must never be released to the factory floor. The planning engine resolves capacity bottlenecks by pre-building during surplus periods, scheduling controlled overtime, or leveling the Master Production Schedule before releasing executable orders."
    },
    "quests": [
      {
        "title": "ApexPlanning Architecture, Closed-Loop Feedback & Finite Scheduling Specifications",
        "type": "concept",
        "description": "Formulate the comprehensive architectural specification of ApexPlanning: synthesize quantitative forecasting, aggregate linear programming, recursive DAG BOM explosions, and finite capacity requirements planning into a closed-loop system specification; derive the mathematical feedback loop equations reconciling CRP capacity deficits with Master Production Schedule revisions.",
        "rubric": "Master-level architectural blueprint of the closed-loop MRP II engine; formal mathematical equations for capacity leveling and multi-level BOM explosion; complete system state flow diagram."
      },
      {
        "title": "The Infinite Capacity Parking Lot & $4.5M Machinery Rework Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of an industrial machinery corporation's $4.5M loss resulting from unconstrained MRP scheduling that forced $12M of half-built machinery into outdoor parking lots: analyze master schedules, work center capacity utilization reports, weather damage inspection logs, and customer contract penalty claims; prove how lack of CRP feedback caused plant collapse; author an institutional closed-loop planning charter.",
        "rubric": "Audit master production schedules against actual work center capacity logs; expose the disconnect between material planning and shop-floor capacity; deliver an enterprise closed-loop planning standard."
      },
      {
        "title": "Building the Complete ApexPlanning Production Suite in Python",
        "type": "mastery",
        "description": "Engineer the complete ApexPlanning Production Suite in Python: 1) Ingest customer demand histories and generate Holt-Winters seasonal forecasts; 2) Optimize an 18-month Aggregate Plan using Linear Programming; 3) Explode a multi-tier product BOM enforcing Low-Level Coding and component scrap factors; 4) Execute Capacity Requirements Planning (CRP) with automated bottleneck leveling; 5) Output synchronized Master Production Schedules, shop-floor work orders, and supplier purchase requisitions.",
        "rubric": "Complete working Python planning suite; verified integration across all four core modules; mathematically proven plan feasibility; automated generation of production and procurement orders."
      },
      {
        "title": "Subcontractor Sudden Bankruptcy & 40% Capacity Evaporation 3 AM Crisis Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when an external heat-treatment subcontractor (processing 40% of your factory's critical transmission gears) abruptly shuts down operations due to insolvency, stranding 3,000 WIP gears: detect the capacity evaporation; trigger emergency internal routing re-assignment in ApexPlanning; adjust machine maintenance schedules to free up internal furnace capacity; preserve assembly line continuity.",
        "rubric": "Rapid detection of external subcontractor capacity loss; execute automated internal capacity re-allocation and schedule leveling; restore gear processing within 20 minutes."
      }
    ]
  },
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Warehouse Topology, Material Handling Systems & Storage Thermodynamics: Pallet Racking & Travel Distance Physics",
    "stageName": "Stage 2: Operational Execution, Production Scheduling & Warehouse Physics",
    "stageNum": 2,
    "pedagogicalRole": "Warehouse Architecture, Spatial Topology Optimization & Travel Physics",
    "spokenGoal": "In logistics, movement is waste. Over 60% of total warehouse labor operating cost is consumed by human pickers and forklift drivers physically traveling down aisles. If your warehouse spatial topology is poorly engineered, your workforce spends their days walking miles through empty space while high-velocity items sit buried in the back corners. Today we engineer Warehouse Topology, Material Handling Systems & Storage Thermodynamics. We evaluate pallet racking configurations: Selective Pallet Racking (100% accessibility, lower density) versus Drive-In, Push-Back, and Pallet Flow Racking (high density, LIFO/FIFO depth). We model warehouse spatial geometry as a 2D/3D coordinate graph, deriving Euclidean versus Rectilinear (Manhattan) travel distance physics, aisle width trade-offs (Standard 12ft vs Narrow Aisle 8ft vs Very Narrow Aisle 5ft), and volumetric cubic utilization.",
    "conceptInvariant": "Warehouse Spatial Geometry & Travel Distance Invariant: Travel distance between two warehouse coordinate locations (x1, y1) and (x2, y2) in a single-cross-aisle warehouse follows Rectilinear Manhattan grid routing with aisle constraints: Distance_travel = abs(y1 - y2) + f(x1, x2, Cross_Aisles); cubic space utilization efficiency equals stored pallet volume divided by total building volume: Space_eff = sum(Pallet_volume) / (Length * Width * Height_clear); selective racking achieves 100% pallet accessibility at 40% cube utilization; automated high-density systems achieve 85% cube utilization at constrained FIFO accessibility.",
    "failureMode": "A 500,000 sq ft distribution center expands its catalog from 5,000 to 35,000 SKUs without redesigning its aisle layout or material handling equipment. Standard 12-foot forklift aisles consume 55% of floor space as dead transit volume. Fast-moving holiday items are randomly placed in deep 4-deep push-back racks at the far end of the warehouse (900 feet from the shipping dock). Average picker travel distance doubles from 6 miles/day to 13 miles/day. Pick rates plunge by 45%, order fulfillment lead times stretch from 24 hours to 5 days during Black Friday, and the company incurs $1,200,000 in emergency overtime and temporary agency labor.",
    "tryItFriction": "Build an Enterprise Warehouse Spatial Layout & Travel Distance Simulator in Python: 1) Model a warehouse floor grid with coordinate locations for Receiving Docks, Shipping Docks, Cross-Aisles, and Storage Bays; 2) Compute Rectilinear travel distance matrices between any two warehouse pick locations accounting for one-way aisle rules; 3) Compare cubic space utilization across Selective, Push-Back, and Very Narrow Aisle (VNA) racking designs; 4) Simulate 10,000 daily order pick travels, quantifying the total labor hours spent solely on walking/driving; 5) Render a 2D heatmap of warehouse travel congestion.",
    "socraticHints": [
      "Why is Euclidean (straight-line) distance completely invalid for modeling warehouse picker travel?",
      "Because warehouse pickers cannot walk through solid steel pallet racks; they must travel along rectangular aisles and turn at designated cross-aisles, making Rectilinear (Manhattan) distance with aisle boundary constraints the only mathematically valid metric.",
      "Calculating travel distance correctly is the foundation for picker route optimization and slotting design."
    ],
    "situationalPuzzle": {
      "scenario": "A retail warehouse measures 400 ft wide by 300 ft deep with clear ceiling height of 32 ft. Current Selective Racking uses standard 12-ft aisles, storing 6,000 pallets (Cube utilization = 32%). Total warehouse operating cost is $4,000,000/year, of which $2,400,000 is labor (traveling and picking). The VP of Supply Chain proposes converting to Very Narrow Aisle (VNA) racking with wire-guided turret trucks: Aisle width reduces from 12 ft to 5.5 ft, expanding storage capacity to 10,500 pallets (+75% storage density) and reducing average travel distance by 35%. Conversion capital cost is $1,500,000. Is this investment financially justified?",
      "options": [
        "No, because turret trucks are expensive to maintain.",
        "Calculate financial payback step by step: 1) Storage Expansion: Expanding capacity from 6,000 to 10,500 pallets eliminates the need to lease a secondary overflow warehouse ($650,000/year savings)! 2) Labor Productivity: Reducing travel distance by 35% on a $2,400,000 labor base (where travel is 60% of cost = $1,440,000) saves 35% * $1,440,000 = $504,000/year in direct travel labor! 3) Total Annual Savings = $650,000 (Storage) + $504,000 (Labor) = $1,154,000/year! 4) Payback Period: $1,500,000 capital cost / $1,154,000 annual savings = 1.30 years! The project pays for itself in less than 16 months and delivers $5,770,000 in net savings over 5 years!",
        "Double the number of workers instead of changing racks.",
        "VNA racking is illegal under OSHA guidelines."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Compacting warehouse aisles from 12 ft to 5.5 ft captures massive dual benefits: it eliminates expensive external warehouse leases by unlocking 75% more pallet density, and it shortens travel distances, saving over $500k in annual travel labor. A 1.3-year payback makes VNA racking an extraordinary capital investment."
    },
    "quests": [
      {
        "title": "Warehouse Spatial Geometry, Material Handling Mechanics & Cube Formulations",
        "type": "concept",
        "description": "Formulate warehouse architectural engineering: analyze pallet racking physics (Selective vs Double-Deep vs Drive-In vs Push-Back vs Pallet Flow vs AS/RS crane systems); derive mathematical equations for volumetric cubic space utilization efficiency (Space_eff = V_pallet / V_building); formulate aisle width mechanics (Standard Aisle vs Reach Truck vs VNA turret trucks); derive Rectilinear Manhattan travel distance algorithms with multiple cross-aisles.",
        "rubric": "Step-by-step mathematical formulation of warehouse spatial metrics; complete comparative engineering matrix of racking types and accessibility trade-offs; formal derivation of constrained Rectilinear distance equations."
      },
      {
        "title": "The Dead Transit Sprawl & $1.2M Emergency Overtime Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a retail distribution center's $1.2M emergency overtime loss during Black Friday resulting from poor racking layout and excessive travel distance: analyze warehouse WMS travel telemetry, forklift telematics, picker labor productivity logs, and customer order delay claims; prove how spatial sprawl destroyed picking throughput; author an institutional warehouse layout redesign RFC.",
        "rubric": "Audit forklift travel telematics and picker foot-travel logs; expose the spatial layout inefficiencies; deliver an enterprise warehouse topology and racking standard."
      },
      {
        "title": "Building an Enterprise Warehouse Spatial Topology & Travel Suite in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Warehouse Layout & Travel Simulator in Python: 1) Model a parameterized 2D/3D warehouse coordinate grid with racks, cross-aisles, and dock doors; 2) Compute exact Rectilinear travel distance matrices between all storage locations; 3) Model equipment speed profiles (acceleration, top speed, fork lift/lower times); 4) Simulate 10,000 order pick journeys comparing Selective vs VNA layout configurations; 5) Generate interactive 2D heatmaps of warehouse traffic density and travel time.",
        "rubric": "Working Python spatial simulation suite; verified Rectilinear distance calculation with aisle constraints; realistic equipment kinematic modeling; clear visual heatmap generation."
      },
      {
        "title": "Main Cross-Aisle Rack Collapse & Structural Quarantine 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when an errant forklift impact damages an upright column on a 30-foot selective rack in the warehouse's primary central cross-aisle, threatening structural collapse and forcing the immediate safety quarantine of 4 main aisles (cutting off access to 40% of peak holiday SKUs): detect the zone isolation; re-route picker traffic around the quarantine zone; dynamically re-allocate outbound picking to secondary reserve stock locations; maintain fulfillment velocity.",
        "rubric": "Rapid dynamic exclusion of quarantined aisle coordinates in the WMS router; execute automated re-allocation of pending pick orders to reserve locations; restore picking within 15 minutes."
      }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "Algorithmic Slotting Optimization & Product Affinity Clustering: ABC-XYZ Velocity, Golden Zones & COI Indexing",
    "stageName": "Stage 2: Operational Execution, Production Scheduling & Warehouse Physics",
    "stageNum": 2,
    "pedagogicalRole": "Warehouse Data Science, Slotting Optimization & Product Affinity Algorithms",
    "spokenGoal": "Putting the right product in the right warehouse slot is the highest-ROI optimization in physical operations. If your fastest-moving item is stored on the top shelf 30 feet in the air at the back of aisle 45, every single pick requires driving a reach truck 10 minutes and lifting a mast. Today we engineer Algorithmic Slotting Optimization & Product Affinity Clustering. We classify products across dual dimensions: ABC Velocity (Pareto 80/20 pick frequency) and XYZ Predictability (demand volatility coefficient of variation CV). We map high-velocity 'A' items to the Golden Zone: the ergonomic sweet spot between waist and shoulder height closest to the shipping dock. Crucially, we implement Market Basket Affinity Clustering, co-locating items frequently purchased together to collapse multi-item picker travel to zero.",
    "conceptInvariant": "Cube-per-Order Index (COI) & Ergonomic Golden Zone Invariant: Optimal storage assignment is governed by the Cube-per-Order Index: COI_i = Storage_Space_Required_i / Pick_Frequency_i; items must be sorted in ascending order of COI and assigned to locations in ascending order of distance from the dock: COI_1 <= COI_2 <= ... <= COI_n => Distance_1 <= Distance_2 <= ... <= Distance_n; items with pick frequency > 80th percentile must reside in the Golden Zone (height h between 0.8m and 1.4m); affinity pairs with Jaccard coefficient J(A, B) > 0.4 must be slotted in adjacent storage bays.",
    "failureMode": "A sports nutrition brand with 12,000 SKUs lets warehouse workers put away incoming inventory wherever open space exists. A viral protein powder (representing 28% of all daily order lines) is slotted on the top tier of the furthest aisle from the packing tables. Pickers climb ladders or wait for reach trucks 400 times a day. Average pick time per order jumps from 45 seconds to 3.8 minutes. Over 6 months, the company burns $480,000 in excess warehouse labor, and 3 warehouse associates suffer lumbar spine strain injuries from repetitive high-reach lifting of 30-pound protein tubs.",
    "tryItFriction": "Build an Enterprise Algorithmic Warehouse Slotting Engine in Python: 1) Ingest 100,000 historical order line transactions across 5,000 SKUs; 2) Compute ABC-XYZ classification matrices (pick frequency vs demand variance CV); 3) Compute Cube-per-Order Index (COI) for every SKU; 4) Implement Market Basket Affinity Analysis computing Jaccard similarity coefficients between frequently co-ordered items; 5) Assign SKUs to 3D warehouse slots optimizing COI and placing high-affinity clusters in adjacent bays; 6) Quantify total travel distance reduction vs random slotting.",
    "socraticHints": [
      "What is the Cube-per-Order Index (COI) and why is it superior to sorting items simply by sales volume?",
      "Because sales volume ignores physical size; a tiny, high-frequency item (like a smartphone chip) should be closest to the dock, but a massive, low-frequency sofa takes up huge space; COI divides space required by pick frequency, giving priority to items that provide the highest pick density per square foot.",
      "Sorting items by ascending COI mathematically minimizes the total travel distance per unit picked."
    ],
    "situationalPuzzle": {
      "scenario": "A health & wellness warehouse slots 3 products: 1) SKU A (Multivitamins): Pick frequency = 1,000 picks/day, Box volume = 0.05 cu ft; 2) SKU B (Foam Rollers): Pick frequency = 800 picks/day, Box volume = 2.00 cu ft; 3) SKU C (Protein Bars): Pick frequency = 500 picks/day, Box volume = 0.10 cu ft. There are two storage bays available: Bay 1 (10 feet from packing station) and Bay 2 (100 feet from packing station). According to the Cube-per-Order Index (COI), which product should be assigned to Bay 1 closest to packing?",
      "options": [
        "SKU B because it has 800 picks and takes up the most space.",
        "Calculate Cube-per-Order Index (COI = Volume / Frequency) for each item: 1) SKU A: COI = 0.05 / 1,000 = 0.00005. 2) SKU B: COI = 2.00 / 800 = 0.00250. 3) SKU C: COI = 0.10 / 500 = 0.00020. 4) The item with the LOWEST COI must be placed closest to the dock: COI_A (0.00005) < COI_C (0.00020) < COI_B (0.00250)! SKU A provides 20,000 picks per cubic foot of space, making it 50 times more efficient to place near the dock than bulky Foam Rollers! SKU A belongs in Bay 1!",
        "SKU C because it is in the middle.",
        "All products should be placed in random slots to rotate wear on the floor."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. The Cube-per-Order Index (COI) measures space consumed per pick. SKU A has an infinitesimal COI (0.00005) because it delivers 1,000 picks while consuming almost no space. Placing bulky Foam Rollers (COI = 0.0025) near the dock would crowd out dozens of small, high-frequency items, forcing pickers to travel deep into the warehouse for tiny products."
    },
    "quests": [
      {
        "title": "Algorithmic Slotting Theory, COI Mathematical Optimality & Affinity Formulations",
        "type": "concept",
        "description": "Formulate warehouse slotting optimization theory: derive the mathematical proof of the Cube-per-Order Index (COI) rule for single-command travel distance minimization; formulate the dual ABC-XYZ demand classification matrix (Pareto cumulative pick curves vs coefficient of variation CV = sigma / mu); formulate Market Basket Affinity clustering using Jaccard and Cosine similarity metrics on transactional order matrices; derive ergonomic Golden Zone vertical height constraints (0.8m to 1.4m lifting mechanics).",
        "rubric": "Step-by-step mathematical proof of COI travel distance minimization optimality; formal algorithm specification for multi-item affinity clustering; complete ergonomic lifting standards integration."
      },
      {
        "title": "The Random Slotting Nightmare & $480,000 Labor Drain Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a sports nutrition brand's $480,000 warehouse labor loss and associated ergonomic injuries resulting from unmanaged random inventory slotting: analyze WMS putaway location logs, picker travel time per order line, order transaction histories, and OSHA ergonomic injury reports; prove how mislocated high-velocity SKUs caused labor inflation; author an institutional slotting governance policy.",
        "rubric": "Audit historical slotting location data against order pick frequencies and travel times; expose the lack of COI and Golden Zone assignment; deliver an enterprise slotting optimization standard."
      },
      {
        "title": "Building an Enterprise Algorithmic Slotting & Affinity Engine in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Warehouse Slotting Optimization Suite in Python: 1) Ingest order history logs and SKU volumetric dimension tables; 2) Compute ABC-XYZ velocity-volatility matrices; 3) Compute Cube-per-Order Index (COI) rankings; 4) Implement Apriori / Jaccard affinity clustering to group co-ordered product pairs; 5) Assign SKUs to 3D warehouse rack coordinates optimizing COI, Golden Zone height, and affinity adjacency; 6) Benchmark picker travel savings vs legacy slotting.",
        "rubric": "Working Python slotting engine; verified ABC-XYZ and COI calculations; functional market basket affinity clustering; demonstrated 30%+ travel distance reduction."
      },
      {
        "title": "Black Friday Fast-Mover Slotting Gridlock & Aisle Jam 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when Black Friday order waves cause 200 pickers to converge simultaneously on Aisle 3 because the top 10 promotional holiday SKUs were mistakenly slotted in adjacent bays in the same narrow aisle, creating a human and cart gridlock that halts warehouse picking: detect the aisle congestion hotspot; trigger an immediate dynamic slotting re-assignment script; disperse top SKUs across alternating aisles; restore pick flow.",
        "rubric": "Rapid detection of warehouse picker aisle congestion; execute emergency dynamic re-slotting of bottleneck SKUs across distributed cross-aisles; restore picking velocity within 15 minutes."
      }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "Order Picking Strategies & Traveling Salesperson Routing (TSP): S-Shape, Return & Dynamic Programming Heuristics",
    "stageName": "Stage 2: Operational Execution, Production Scheduling & Warehouse Physics",
    "stageNum": 2,
    "pedagogicalRole": "Combinatorial Optimization, Warehouse Routing Algorithms & Wave Picking Design",
    "spokenGoal": "Order picking is the operational heart of the warehouse. A picker receives a pick list of 25 items scattered across 12 different aisles. If the picker wanders randomly, they traverse miles of wasted concrete. Finding the absolute shortest path to visit all pick locations and return to the depot is a classic NP-hard Traveling Salesperson Problem (TSP). Today we engineer Order Picking Strategies & TSP Routing Algorithms. We analyze classic picking strategies: Discrete Picking, Batch Picking, Zone Picking, and Wave Picking. We master warehouse routing heuristics: S-Shape (traversing entire aisles containing picks), Return (entering and exiting aisles from the same cross-aisle), Mid-Point, and the exact Ratliff-Rosenthal Dynamic Programming algorithm that solves warehouse routing to mathematical optimality in linear time O(N).",
    "conceptInvariant": "Picker Routing Heuristics & TSP Optimality Invariant: For a pick list of N locations across M parallel aisles, the optimal picker tour length satisfies: Length_tour = Min_Tour { Dep_start -> Loc_1 -> ... -> Loc_N -> Dep_end }; S-Shape heuristic guarantees: Tour_S <= 2 * M * Aisle_Length + Cross_Aisle_Traversals; the Ratliff-Rosenthal Dynamic Programming algorithm constructs the globally optimal tour in O(M * 2^k) polynomial time by exploiting the parallel-aisle lattice graph topology; optimal routing reduces total picker travel distance by 25-40% compared to naive sorting.",
    "failureMode": "An e-commerce fulfillment center sorts pick lists purely by SKU alphanumeric ID rather than spatial warehouse location. A picker assigned an order with 20 items walks from Aisle 1 to Aisle 45, then back to Aisle 3, then forward to Aisle 40, walking 2.4 miles to pick a single multi-item order. Across 5,000 daily orders, pickers walk 12,000 miles per day. During the holiday peak, order cycle time blows out from 2 hours to 36 hours, 8,000 express delivery guarantees fail, and the company is hit with $650,000 in customer refund claims.",
    "tryItFriction": "Build an Enterprise Warehouse Picker Routing & TSP Optimization Engine in Python: 1) Model a warehouse lattice graph with parallel aisles and front/back cross-aisles; 2) Generate random order pick lists with 10 to 30 item locations; 3) Implement the S-Shape routing heuristic; 4) Implement the Return routing heuristic; 5) Implement the optimal Dynamic Programming / 2-Opt TSP algorithm; 6) Benchmark total travel distance across naive alphanumeric, S-Shape, Return, and optimal TSP routes.",
    "socraticHints": [
      "Why is the warehouse routing problem solvable to mathematical optimality in linear time O(N), even though the general Traveling Salesperson Problem is NP-hard?",
      "Because general TSP operates on arbitrary graphs, whereas warehouses possess a highly structured parallel-aisle lattice graph with fixed cross-aisle boundaries; Ratliff and Rosenthal proved this special graph structure allows dynamic programming to evaluate all feasible tour sub-paths in linear time.",
      "Warehouse pickers can only enter and exit aisles at cross-aisles, severely constraining the state space."
    ],
    "situationalPuzzle": {
      "scenario": "A warehouse picker has a batch pick list with 12 items located across 4 adjacent aisles (Aisles 1, 2, 3, 4). Aisle length = 100 feet. Cross-aisle distance between adjacent aisles = 20 feet. In Aisle 1, there is 1 item located 10 feet from the front. In Aisle 2, there are 4 items spread throughout the aisle. In Aisle 3, there is 1 item located 15 feet from the front. In Aisle 4, there are 6 items spread throughout the aisle. Should the picker use an S-Shape or Return strategy for Aisle 1 and Aisle 3?",
      "options": [
        "Always use S-Shape for every aisle regardless of item count.",
        "Use the Combined Return/S-Shape Strategy: 1) For Aisle 1: The item is only 10 ft from the front. S-Shape would force the picker to walk the full 100 ft through the aisle! Return strategy enters, picks at 10 ft, and returns to the front cross-aisle, walking only 20 ft (saving 80 ft)! 2) For Aisle 2: Items are spread throughout; use S-Shape to traverse to the back cross-aisle (100 ft). 3) For Aisle 3: The item is 15 ft from the back cross-aisle; enter from the back, pick, and return to the back cross-aisle (30 ft total vs 100 ft S-Shape, saving 70 ft)! 4) For Aisle 4: Traverse S-Shape back to the front depot (100 ft). Combining Return for sparse aisles and S-Shape for dense aisles saves 150 feet of travel on a single pick list!",
        "Always use Return for every aisle.",
        "Pick items in alphabetical order."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. S-Shape is optimal for dense aisles with many picks because traversing the aisle collects items efficiently. But for sparse aisles with an item near the cross-aisle entrance, S-Shape wastes energy traversing 100 feet of empty aisle. Using Return for Aisles 1 and 3 saves 150 feet of wasted walking."
    },
    "quests": [
      {
        "title": "Picker Routing Combinatorial Optimization, Lattice Graphs & Ratliff-Rosenthal Formulations",
        "type": "concept",
        "description": "Formulate warehouse routing theory: analyze warehouse picker travel on parallel-aisle lattice graphs; derive the mathematical formulation of the S-Shape, Return, Mid-Point, and Largest-Gap routing heuristics; formulate the Ratliff-Rosenthal dynamic programming state machine for optimal tour construction in O(M) time; evaluate picking strategies: Discrete, Batch (Order Streaming), Zone (Pick-and-Pass), and Wave Picking.",
        "rubric": "Step-by-step mathematical formulation of warehouse routing heuristics; formal state transition definitions for Ratliff-Rosenthal dynamic programming; complete comparative evaluation of picking strategies."
      },
      {
        "title": "The Alphanumeric Pick List Chaos & $650,000 Refund Crisis Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of an e-commerce fulfillment center's $650,000 refund crisis resulting from naive alphanumeric pick list sorting that caused pickers to walk 2.4 miles per order: analyze WMS pick path logs, order cycle time distributions, picker pedometer telemetry, and customer late-delivery refund claims; prove how lack of spatial routing optimization caused the collapse; author an institutional pick path optimization standard.",
        "rubric": "Audit historical pick tour paths and order cycle times; expose the alphanumeric sorting flaw; deliver an enterprise TSP picker routing and wave planning standard."
      },
      {
        "title": "Building an Enterprise Warehouse TSP Routing & Wave Engine in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Warehouse Picker Routing Suite in Python: 1) Model parallel-aisle warehouse graph topologies with cross-aisles; 2) Ingest multi-item order pick batches; 3) Implement S-Shape, Return, and Combined heuristics; 4) Implement an exact Dynamic Programming / 2-Opt local search TSP router; 5) Simulate 1,000 order picking waves; 6) Demonstrate 35%+ reduction in total travel distance compared to naive routing.",
        "rubric": "Working Python routing suite; verified implementation of S-Shape, Return, and TSP algorithms; accurate distance calculation on warehouse lattice graphs; demonstrable travel reduction."
      },
      {
        "title": "Pick-to-Light Server Outage & Warehouse Routing Freeze 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when a network switch failure disables the warehouse's automated Pick-to-Light hardware across 50 pick zones during peak order fulfillment, halting all high-velocity picking: detect the hardware blackout; dynamically re-generate optimized S-Shape paper pick sheets and RF scanner manifests; re-route pickers to voice-guided and mobile handheld workflows; preserve outbound shipment deadlines.",
        "rubric": "Rapid detection of pick-to-light hardware communication failure; execute emergency fallback routing to mobile RF scanner manifests; restore picking operations within 15 minutes."
      }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "Cross-Docking Architecture, Yard Management & Dynamic Dock Allocation: Zero-Inventory Staging & Demurrage Minimization",
    "stageName": "Stage 2: Operational Execution, Production Scheduling & Warehouse Physics",
    "stageNum": 2,
    "pedagogicalRole": "Cross-Dock Operations, Yard Management Systems (YMS) & Inbound-Outbound Synchronization",
    "spokenGoal": "The fastest, cheapest warehouse is the one that holds zero inventory. In pure Cross-Docking (pioneered at massive scale by Walmart), incoming freight from supplier tractor-trailers is unloaded at inbound dock doors, sorted and consolidated across a central transfer staging floor, and loaded directly onto outbound store delivery trailers in under 24 hours without ever being put away into warehouse storage racks. Today we engineer Cross-Docking Architecture, Yard Management Systems (YMS) & Dynamic Dock Allocation. We master the mathematical synchronization of inbound and outbound freight: minimizing forklift travel distance across the dock floor, scheduling trailer yard shunts, and eliminating carrier demurrage and detention fines.",
    "conceptInvariant": "Cross-Dock Synchronization & Dwell Time Invariant: Dwell time of freight on the cross-dock staging floor must satisfy: Dwell_time <= 24_hours; dock door assignment must minimize total material handling transfer cost: Min sum_{i in Inbound} sum_{j in Outbound} Flow_{i, j} * Distance(Dock_i, Dock_j); trailer dwell in the facility yard must not exceed carrier free time: Trailer_yard_dwell <= Carrier_free_time (typically 2 to 4 hours) to ensure Carrier_demurrage == 0; zero long-term rack storage.",
    "failureMode": "A regional grocery distributor attempts cross-docking 80 inbound refrigerated trailers of fresh produce daily without a Yard Management System (YMS) or dynamic dock scheduling. Inbound trucks arrive randomly, blocking dock aprons. Inbound doors are assigned arbitrarily, forcing forklift drivers to transport pallet loads 600 feet across congested staging floors to opposite outbound doors. Pallets of strawberries sit in unrefrigerated staging cross-traffic for 14 hours, spoiling $280,000 of fresh fruit. Furthermore, 25 carriers bill the company $175,000 in trailer detention penalties.",
    "tryItFriction": "Build an Enterprise Cross-Docking & Dynamic Dock Door Optimizer in Python: 1) Model a cross-dock facility with N inbound doors and M outbound doors with rectilinear cross-floor distances; 2) Ingest an inbound-to-outbound freight flow matrix (pallets transferred from inbound truck i to outbound destination j); 3) Formulate the Quadratic Assignment Problem (QAP) / Mixed-Integer Linear Program minimizing total cross-dock travel distance; 4) Implement Yard Management trailer dwell time tracking alerting when detention thresholds approach; 5) Output optimal dock door assignments and staging flow schedules.",
    "socraticHints": [
      "Why is dynamic dock door assignment mathematically formulated as a Quadratic Assignment Problem (QAP)?",
      "Because the cost depends on two simultaneous decisions: assigning inbound truck i to door p AND assigning outbound truck j to door q, multiplying the freight flow volume between i and j by the physical distance between door p and door q: Flow_{i, j} * Distance_{p, q}.",
      "Solving this optimization assigns high-volume transfer pairs to directly opposite doors, collapsing cross-dock transfer travel to a straight 50-foot roll across the aisle."
    ],
    "situationalPuzzle": {
      "scenario": "A cross-dock facility has 2 Inbound Doors (I1, I2) and 2 Outbound Doors (O1, O2). Distance from I1 to O1 is 50 ft; I1 to O2 is 250 ft; I2 to O1 is 250 ft; I2 to O2 is 50 ft. Inbound Truck A carries 80 pallets for Outbound Route X and 20 pallets for Outbound Route Y. Inbound Truck B carries 10 pallets for Route X and 90 pallets for Route Y. Assignment 1: Assign Truck A to I1 (Route X at O1) and Truck B to I2 (Route Y at O2). Assignment 2: Inverted assignment. What is the total travel distance of Assignment 1 vs Assignment 2?",
      "options": [
        "Both assignments have identical travel distance.",
        "Calculate total pallet travel distance for Assignment 1: 1) Truck A at I1: 80 pallets go to O1 (50 ft) = 80 * 50 = 4,000 pallet-ft. 20 pallets go to O2 (250 ft) = 20 * 250 = 5,000 pallet-ft. Subtotal A = 9,000 pallet-ft. 2) Truck B at I2: 10 pallets go to O1 (250 ft) = 10 * 250 = 2,500 pallet-ft. 90 pallets go to O2 (50 ft) = 90 * 50 = 4,500 pallet-ft. Subtotal B = 7,000 pallet-ft. 3) Total Travel for Assignment 1 = 9,000 + 7,000 = 16,000 pallet-feet! Now calculate Assignment 2 (Truck A at I2, Truck B at I1): Truck A: (80 * 250) + (20 * 50) = 20,000 + 1,000 = 21,000. Truck B: (10 * 50) + (90 * 250) = 500 + 22,500 = 23,000. Total Travel for Assignment 2 = 44,000 pallet-feet! Assignment 1 eliminates 28,000 pallet-feet of forklift driving (a 64% reduction) on just two trucks!",
        "Assignment 2 is better because it distributes wear evenly.",
        "Dock door assignment has negligible impact on operations."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. By aligning high-flow transfer pairs directly across from each other (Truck A to I1 facing Route X at O1, and Truck B to I2 facing Route Y at O2), Assignment 1 achieves 16,000 pallet-feet vs 44,000 for the inverted assignment. This 64% reduction in travel distance illustrates the transformative power of cross-dock optimization."
    },
    "quests": [
      {
        "title": "Cross-Docking Architecture, QAP Door Assignment & Yard Management Formulations",
        "type": "concept",
        "description": "Formulate cross-docking operations: analyze cross-dock facility layouts (I-shape vs T-shape vs X-shape cross-dock terminals); mathematically formulate the Dock Door Assignment Problem as a Quadratic Assignment Problem (QAP); formulate trailer yard queuing dynamics using M/M/c queuing models; derive trailer detention and demurrage step-function cost equations; evaluate pre-distribution versus post-distribution cross-docking strategies.",
        "rubric": "Step-by-step mathematical formulation of the QAP dock door assignment objective; formal queuing models for trailer yard dwell times; comparative architectural analysis of cross-dock facility footprints."
      },
      {
        "title": "The Staging Floor Gridlock & $455,000 Spoilage and Detention Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a grocery distributor's $455,000 loss resulting from unmanaged cross-dock trailer arrival surges and arbitrary dock door assignments: analyze yard gate arrival timestamps, cross-dock staging temperature logs, carrier detention invoices, and spoiled produce disposal records; prove how lack of dynamic dock scheduling caused the catastrophe; author an institutional cross-dock operating standard.",
        "rubric": "Audit trailer yard arrival logs against carrier detention penalty claims; expose the door assignment and dwell time vulnerabilities; deliver an enterprise cross-dock and YMS governance charter."
      },
      {
        "title": "Building an Enterprise Cross-Dock Optimization & YMS Suite in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Cross-Dock & Yard Management Suite in Python: 1) Ingest inbound trailer manifests and outbound store delivery orders; 2) Build an inbound-to-outbound freight flow matrix; 3) Solve the optimal dock door assignment using PuLP integer programming / simulated annealing; 4) Implement an automated Yard Management trailer dwell tracker alerting when detention limits approach; 5) Output visual dock door assignments and cross-dock floor flow maps.",
        "rubric": "Working Python cross-dock optimization suite; verified mathematical minimization of cross-dock transfer travel; functional trailer detention alerting; clear operational visualization."
      },
      {
        "title": "Outbound Trailer Fleet Shortage & Dock Floor Saturation 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when an outbound logistics carrier fails to spot 15 scheduled empty trailers at your cross-dock outbound doors, causing inbound freight to accumulate on the staging floor, threatening complete physical floor saturation and facility shutdown within 45 minutes: detect the staging gridlock; dynamically throttle inbound truck check-ins; re-assign outbound freight to secondary regional 3PL carriers; clear staging lanes.",
        "rubric": "Rapid detection of staging floor capacity saturation; execute automated inbound gate metering and dispatch secondary carrier equipment; restore cross-dock flow within 20 minutes."
      }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "Milestone 3: ApexWMS Enterprise Warehouse Management & Slotting Engine",
    "stageName": "Stage 2: Operational Execution, Production Scheduling & Warehouse Physics",
    "stageNum": 2,
    "pedagogicalRole": "Warehouse Systems Synthesis, 3D Spatial Slotting & Algorithmic Routing Architecture",
    "spokenGoal": "Milestone 3 is the physical operations synthesis of Stage 2 Block 3! Today, you synthesize Warehouse Spatial Topology & Racking Thermodynamics (Day 11), Algorithmic Slotting Optimization & Product Affinity Clustering (Day 12), Order Picking Strategies & TSP Routing (Day 13), and Cross-Docking Architecture & Yard Management (Day 14) into an enterprise-grade warehouse management platform: ApexWMS. You will architect and simulate a 500,000 sq ft distribution center in Python: slotting 10,000 SKUs based on ABC-XYZ and COI metrics, grouping co-ordered items into adjacent bays, generating optimized order picking waves with S-Shape and TSP heuristics, and dynamically assigning cross-dock trailers to minimize material handling. Zero wasted walking, zero staging congestion, maximum operational throughput.",
    "conceptInvariant": "ApexWMS Integrated Spatial & Routing Invariant: The complete warehouse operations pipeline enforces end-to-end physical optimization: Slotting(COI_min, Golden_Zone_A, Affinity_clustered) -> Wave_Generation(Batch_optimal) -> Pick_Routing(TSP_optimal_path) -> Cross_Dock(QAP_min_flow_distance); average picker travel distance per order line must decrease by >= 35% compared to baseline; cross-dock staging dwell must remain <= 24 hours; zero dock door gridlock.",
    "failureMode": "An omnichannel retail corporation operates a central distribution center using legacy siloed paper picking tickets and unoptimized inventory slotting. Fast-moving holiday goods are buried in top racks, pickers walk crisscross routes across 60 aisles, and cross-dock freight sits on congested staging docks for 36 hours. Over peak season, fulfillment costs exceed budget by $3,800,000, 15% of holiday orders ship late, and worker turnover reaches 65% due to excessive physical exhaustion.",
    "tryItFriction": "Build and Validate the Complete ApexWMS Production Suite in Python: 1) Model a 3D coordinate warehouse grid with 50 aisles, cross-aisles, and receiving/shipping docks; 2) Execute algorithmic slotting placing 5,000 SKUs by COI and affinity clustering into Golden Zones; 3) Ingest 500 multi-item customer orders and generate batch pick waves; 4) Route pickers through the warehouse using exact TSP dynamic programming; 5) Optimize cross-dock dock door allocations; 6) Output an executive warehouse throughput and labor efficiency dashboard.",
    "socraticHints": [
      "Why must slotting optimization and pick path routing be designed together as an integrated system?",
      "Because slotting determines where items live in physical space, while routing determines the sequence in which those locations are visited; optimizing routing on a terrible slotting layout still results in huge travel distances, and a great slotting layout is wasted if pickers walk erratic, unoptimized paths.",
      "ApexWMS unifies slotting and routing to achieve the global minimum labor cost per order."
    ],
    "situationalPuzzle": {
      "scenario": "During Milestone 3 end-to-end integration testing of ApexWMS, the simulation processes 1,000 orders. Diagnostics show: 1) COI slotting reduced average picker travel by 32%; 2) TSP routing cut tour lengths by an additional 18%; but 3) Cross-dock operations suffered a massive bottleneck where 40 pallets waited 6 hours for staging because inbound pallets were delivered faster than outbound trailers could be loaded! How must ApexWMS be patched to balance cross-dock throughput?",
      "options": [
        "Shut down cross-docking and store all pallets in high-bay racks.",
        "Implement Dynamic Inbound-Outbound Flow Synchronization in ApexWMS: 1) The engine must throttle inbound trailer unloading velocity to match verified outbound trailer availability; 2) Assign cross-dock staging lanes dynamically as pull-buffers rather than random dumps; 3) When an outbound destination trailer is delayed, hold the inbound pallet in the yard rather than discharging it onto the active cross-dock floor! Patching this prevents staging floor gridlock and guarantees continuous cross-dock flow!",
        "Hire 50 temporary workers to move pallets back and forth.",
        "Tell customers their orders will be delayed."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In physical cross-docking, pushing freight onto the staging floor faster than outbound trailers can absorb it creates staging floor gridlock that paralyzes the entire facility. ApexWMS must implement flow synchronization: metering inbound unloading to match verified outbound loading capacity, treating the trailer yard as the buffer."
    },
    "quests": [
      {
        "title": "ApexWMS Architectural Specification & Unified Spatial Optimization Formulations",
        "type": "concept",
        "description": "Formulate the comprehensive architectural specification of ApexWMS: synthesize 3D warehouse coordinate graphs, ABC-XYZ COI slotting optimization, market basket affinity clustering, TSP lattice graph routing, and QAP cross-dock door assignment into an integrated WMS architecture; derive the mathematical proofs of combined labor minimization.",
        "rubric": "Master-level architectural blueprint of the enterprise WMS engine; complete mathematical formulation uniting slotting, routing, and cross-docking; formal proof of travel distance bounds."
      },
      {
        "title": "The Holiday Fulfillment Collapse & $3.8M Overrun Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of an omnichannel retailer's $3.8M fulfillment budget overrun resulting from unoptimized slotting and chaotic pick paths: analyze WMS transaction logs, picker travel distance telemetry, cross-dock staging dwell times, and temporary staffing invoices; prove how lack of integrated WMS optimization caused the financial collapse; author an institutional WMS modernization standard.",
        "rubric": "Audit historical WMS order execution logs and picker labor records; expose the compounded inefficiencies of poor slotting and naive routing; deliver an enterprise WMS operational standard."
      },
      {
        "title": "Building the Complete ApexWMS Production Suite in Python",
        "type": "mastery",
        "description": "Engineer the complete ApexWMS Production Suite in Python: 1) Model a parameterized 3D warehouse layout with aisles, bays, and dock doors; 2) Implement COI and affinity slotting assigning SKUs to ergonomic Golden Zones; 3) Build a wave generation engine grouping orders into optimal batches; 4) Implement TSP picker tour routing using dynamic programming; 5) Implement dynamic cross-dock door allocation; 6) Demonstrate 40%+ reduction in travel labor and 99.5% on-time wave completion.",
        "rubric": "Complete working Python WMS suite; verified integration of slotting, wave planning, routing, and cross-dock modules; demonstrated 40%+ travel savings; executive dashboard generation."
      },
      {
        "title": "WMS Database Lock Contention & RF Scanner Freeze 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when 150 warehouse pickers confirming picks simultaneously on RF handheld scanners trigger row-level lock contention on the central WMS inventory allocation table, causing database latency to surge from 10ms to 45 seconds and freezing all scanner screens during peak midnight picking: detect the database locking bottleneck; deploy an asynchronous Redis pick confirmation buffer; decouple read/write transactions; restore scanner responsiveness.",
        "rubric": "Rapid detection of database lock contention on inventory tables; deploy in-memory Redis buffering for pick confirmations; restore sub-second RF scanner response times within 15 minutes."
      }
    ]
  }
]

# Write out supply_chain_ops_spec_m1.py
output_path = "scripts/visuals/supply_chain_ops_spec_m1.py"
with open(output_path, "w", encoding="utf-8") as f:
    f.write("# scripts/visuals/supply_chain_ops_spec_m1.py\n")
    f.write("# Days 1 to 15 Specification for Supply Chain & Operations Management (course-supply-chain-ops)\n")
    f.write("# Conforming strictly to Gate v2 semantic standard:\n")
    f.write("# Supply Chain Taxonomy & TCO Physics, Economic Order Quantity (EOQ) & Discounts,\n")
    f.write("# Stochastic Demand & Safety Stock Optimization, Continuous vs Periodic Review Policies,\n")
    f.write("# Milestone 1: ApexInventory Sovereign Deterministic & Stochastic Replenishment Engine,\n")
    f.write("# Quantitative Demand Forecasting & Holt-Winters, Aggregate Planning (S&OP) & LP Optimization,\n")
    f.write("# Material Requirements Planning (MRP I) & BOM Explosion, Finite Capacity Planning (MRP II) & DBR,\n")
    f.write("# Milestone 2: ApexPlanning Enterprise S&OP & Multi-Level MRP Explosion Suite,\n")
    f.write("# Warehouse Spatial Topology & Racking, Algorithmic Slotting Optimization & COI Indexing,\n")
    f.write("# Order Picking Strategies & TSP Routing, Cross-Docking Architecture & Dynamic Dock Doors,\n")
    f.write("# and Milestone 3: ApexWMS Enterprise Warehouse Management & Slotting Engine.\n\n")
    f.write("DAYS_1_TO_15 = ")
    json_str = json.dumps(DAYS_1_TO_15, indent=2, ensure_ascii=False)
    f.write(json_str)
    f.write("\n")

print(f"Successfully generated {output_path} with {len(DAYS_1_TO_15)} days.")
