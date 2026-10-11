# scripts/visuals/generate_supply_chain_m1_rest.py
# Generates scripts/visuals/supply_chain_ops_spec_m1_rest.py for Days 16 to 30 (Course 28: Supply Chain & Operations Management)

import json

DAYS_16_TO_30 = [
  {
    "day": 16,
    "month": 1,
    "blockNum": 4,
    "title": "Transportation Management Systems (TMS) & Mode Economics: TL vs LTL Freight, Density Breaks & Fuel Surcharges",
    "stageName": "Stage 2: Operational Execution, Production Scheduling & Warehouse Physics",
    "stageNum": 2,
    "pedagogicalRole": "Transportation Economics, TMS Architecture & Freight Rate Engineering",
    "spokenGoal": "Freight transportation represents the single largest operational expenditure in logistics, consuming over 50% of total supply chain costs. If you move goods via Less-Than-Truckload (LTL) without understanding freight class density breaks or minimum charges, you pay for empty air. Today we engineer Transportation Management Systems (TMS) & Freight Mode Economics. We dissect the economic physics of freight modes: Dedicated Truckload (TL, point-to-point, full trailer capacity) versus Less-Than-Truckload (LTL, hub-and-spoke consolidation networks). We master the National Motor Freight Classification (NMFC) system based on stowability, handling, liability, and density (PCF, pounds per cubic foot). We model weight-break discount calculus and dynamic DOE weekly diesel fuel surcharges (FSC).",
    "conceptInvariant": "Freight Mode & Weight-Break Economic Invariant: For a shipment of weight W and volume V, LTL freight charges follow step-down rate tables with minimum charge (AMC): Charge_LTL = max(AMC, W * Rate(Class, Weight_Bracket) * (1 + FSC_pct)); the Cost-Indifference Weight-Break point between weight bracket k and k+1 satisfies: W_break = (Rate_{k+1} * Weight_min_{k+1}) / Rate_k; whenever W > W_break, the shipment must be 'bumped' to the higher weight bracket at lower rate; the mode shift boundary from LTL to dedicated TL occurs when Charge_LTL >= Base_TL_rate.",
    "failureMode": "A furniture manufacturer ships 8,500 lbs of assembled wooden dining chairs via an LTL carrier under generic Class 70 freight terms. The LTL carrier's automated dimensioner scans the trailer at the break-bulk terminal, calculating a density of only 3.8 lbs/cu ft (Class 250). The carrier retroactively reclassifies the shipment, inflating the freight charge from $950 to $3,800 plus a $150 reweigh penalty. Across 400 monthly shipments, the lack of automated TMS density pre-calculation and weight-break bumping costs the company $1,140,000 in unbudgeted freight audit chargebacks.",
    "tryItFriction": "Build an Enterprise Freight Rate Calculator & Mode Selector in Python: 1) Model NMFC freight classification curves mapping freight density (PCF) to Class 50 through 500; 2) Implement an LTL rate-table engine with tiered weight brackets (L5C, M5C, M1M, M2M, M5M); 3) Implement the automated Weight-Break Bumping algorithm checking if declaring a phantom higher weight yields a lower total price; 4) Model DOE weekly national diesel fuel surcharge (FSC) tables; 5) Compare LTL vs dedicated Full Truckload (TL) costs and identify the mode-switch threshold.",
    "socraticHints": [
      "What is 'Weight-Break Bumping' (or bumping weight) in LTL freight procurement?",
      "It is an operational trick where if a shipment weighs just below a discounted weight tier (e.g., 4,800 lbs in the 2,000-4,999 lb tier at $15/cwt = $720), declaring the shipment at the 5,000 lb tier at $12/cwt costs only $600!",
      "An automated TMS automatically bumps the billed weight to 5,000 lbs to secure the lower rate, instantly saving money on the exact same physical freight."
    ],
    "situationalPuzzle": {
      "scenario": "A distributor ships an industrial pump weighing 4,200 lbs from Chicago to Dallas. The LTL carrier rate table is: 1) Tier M2M (2,000 to 4,999 lbs): Rate = $18.50 per hundredweight (cwt); 2) Tier M5M (5,000 lbs and over): Rate = $13.20 per cwt. Diesel fuel surcharge is 20%. Dedicated Full Truckload (TL) rate is $1,100 flat. Should the distributor ship as normal LTL, bump the weight, or book a dedicated TL?",
      "options": [
        "Ship as normal LTL at 4,200 lbs.",
        "Calculate step by step: 1) Normal LTL (4,200 lbs = 42 cwt): Base Charge = 42 * $18.50 = $777.00. With 20% FSC = $777 * 1.20 = $932.40. 2) Bumping to Tier M5M (Declare 5,000 lbs = 50 cwt): Base Charge = 50 * $13.20 = $660.00. With 20% FSC = $660 * 1.20 = $792.00! 3) Dedicated TL: $1,100 flat. 4) Decision: Bumping the weight saves $140.40 over normal LTL ($792 vs $932.40) and is $308 cheaper than TL! The TMS must declare the shipment as 5,000 lbs to capture the M5M volume discount!",
        "Book dedicated TL because full truckloads are always safer.",
        "Split the shipment into 10 parcel boxes."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In LTL freight, the weight-break point is: (50 cwt * $13.20) / $18.50 = 35.67 cwt (3,567 lbs). Since 4,200 lbs exceeds 3,567 lbs, shipping as phantom 5,000 lbs ($792 with fuel) is significantly cheaper than rating at actual 4,200 lbs ($932.40). Automated TMS systems execute weight-bumping on every transaction."
    },
    "quests": [
      {
        "title": "Transportation Economics, NMFC Density Classification & Freight Formulations",
        "type": "concept",
        "description": "Formulate transportation economics and TMS architecture: analyze the operational cost structures of transport modes (TL vs LTL vs Intermodal Rail vs Ocean vs Air); formulate NMFC freight classification mathematical step-functions based on density (pounds per cubic foot PCF); derive the weight-break bumping formulas across discrete rate brackets; formulate dynamic fuel surcharge (FSC) step-tables tied to the Department of Energy weekly diesel index.",
        "rubric": "Step-by-step mathematical derivation of weight-break bumping formulas; complete formulation of freight density classification models; formal analysis of LTL hub-and-spoke operating network costs."
      },
      {
        "title": "The Phantom Weight Penalty & $1.14M Freight Audit Shock Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a furniture manufacturer's $1.14M loss resulting from carrier freight reclassifications and failure to utilize automated weight-break bumping: analyze EDI 210 freight invoices, bill of lading documentation, carrier dimensioner audit logs, and freight payment reconciliation statements; prove how manual freight rating caused budget bleeding; author an institutional TMS freight audit charter.",
        "rubric": "Audit historical freight invoices against bill of lading specifications; expose carrier reclassification and dimensional weight inflation; deliver an enterprise TMS rating standard."
      },
      {
        "title": "Building an Enterprise TMS Freight Rating & Mode Selector Suite in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Transportation Management System (TMS) Rating Engine in Python: 1) Ingest shipment origin, destination, weight, and dimensional cubic volume; 2) Compute exact freight density PCF and determine correct NMFC class; 3) Implement multi-tier LTL rate lookup with automated weight-break bumping; 4) Apply dynamic DOE diesel fuel surcharges and accessorial fees (liftgate, residential); 5) Compare LTL vs TL vs Intermodal and output optimal carrier dispatch recommendations.",
        "rubric": "Working Python TMS engine; verified NMFC density classification; accurate weight-break bumping logic; robust multimodal rate comparison and executive reporting."
      },
      {
        "title": "Diesel Fuel Price Spike & Freight Budget Exhaustion 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when an international oil supply shock spikes nationwide diesel prices by 45% in 48 hours, causing carrier fuel surcharges to surge from 18% to 42% and threatening a $2,500,000 freight budget overrun across 10,000 pending monthly shipments: detect the FSC inflation; dynamically adjust mode selection rules shifting qualifying regional freight from highway truckload to intermodal rail; preserve operating margins.",
        "rubric": "Rapid detection of fuel surcharge cost inflation; execute automated multi-modal shift from highway to intermodal rail; mitigate $1.5M in excess freight spend within 20 minutes."
      }
    ]
  },
  {
    "day": 17,
    "month": 1,
    "blockNum": 4,
    "title": "Vehicle Routing Problem (VRP) & Dijkstra/A* Network Optimization: Clarke-Wright Savings & Time Windows (VRPTW)",
    "stageName": "Stage 2: Operational Execution, Production Scheduling & Warehouse Physics",
    "stageNum": 2,
    "pedagogicalRole": "Combinatorial Fleet Optimization, Network Graph Algorithms & Dynamic Dispatch",
    "spokenGoal": "Having mastered how freight is priced, we now master how fleet vehicles physically navigate road networks. If you operate a fleet of 50 delivery trucks serving 1,000 customer stops, dispatching drivers on ad-hoc routes burns diesel, misses customer delivery appointment windows, and incurs overtime fines. Today we engineer the Capacitated Vehicle Routing Problem (CVRP) and Vehicle Routing Problem with Time Windows (VRPTW). We master road network pathfinding using Dijkstra and A* search algorithms with contraction hierarchies. We formulate the Clarke-Wright Savings heuristic: calculating the travel distance saved by merging two separate single-stop routes into one consolidated multi-stop loop. We solve the combined vehicle capacity and delivery time-window constraints.",
    "conceptInvariant": "Vehicle Routing Optimality & Time Window Invariant: For a fleet of K vehicles of capacity C serving N customers from a central depot, the routing objective minimizes total fleet transit cost: Min sum_{k=1}^K sum_{i} sum_{j} Distance_{i, j} * x_{i, j, k}; subject to: Vehicle capacity constraint sum_{i in Route_k} Demand_i <= C; Customer time-window constraint Arrival_time_{i, k} <= Window_end_i; Driver waiting time wait_i = max(0, Window_start_i - Arrival_time_{i, k}); Clarke-Wright Savings for merging customers i and j equals: Savings_{i, j} = Distance(Depot, i) + Distance(Depot, j) - Distance(i, j) >= 0.",
    "failureMode": "A regional commercial food distributor dispatches 40 delivery trucks to 800 restaurants daily using manual driver territory zones. Routes cross paths constantly (route overlap waste). Furthermore, deliveries are scheduled without modeling 30-minute restaurant delivery appointment windows. 65 restaurants reject late deliveries because chefs have begun lunch prep. Drivers sit in idling trucks waiting for receiving doors, burning $320,000 in excess diesel, while rejected perishable food creates $480,000 in credit memo losses. The company loses $800,000 in a single quarter.",
    "tryItFriction": "Build an Enterprise Vehicle Routing Problem (VRPTW) Solver in Python: 1) Model a road network graph with depot and customer coordinate nodes with stochastic transit times; 2) Ingest customer delivery demands and strict time-window intervals [Earliest_Time, Latest_Time]; 3) Implement the Clarke-Wright Savings algorithm generating initial feasible multi-stop vehicle tours; 4) Implement 2-Opt local search improvement heuristics resolving route crossovers; 5) Validate vehicle capacity constraints and time-window feasibility; 6) Benchmark optimized fleet mileage vs naive single-stop routing.",
    "socraticHints": [
      "What is the physical intuition behind the Clarke-Wright Savings formula: S_{i, j} = d_{0, i} + d_{0, j} - d_{i, j}?",
      "Imagine serving Customer i and Customer j with two separate trucks: Truck 1 drives Depot -> i -> Depot (distance 2*d_{0, i}), and Truck 2 drives Depot -> j -> Depot (distance 2*d_{0, j}).",
      "Merging them into one truck driving Depot -> i -> j -> Depot saves returning to the depot between stops; the distance saved is exactly the round trip to the depot minus the direct connection between i and j."
    ],
    "situationalPuzzle": {
      "scenario": "A delivery depot is located at (0, 0). Customer 1 is at (0, 30), Customer 2 is at (40, 0). Distance from Depot to Customer 1 is 30 miles. Distance from Depot to Customer 2 is 40 miles. The direct road distance between Customer 1 and Customer 2 is 50 miles. What is the Clarke-Wright Savings generated by consolidating both customers onto a single truck route rather than running two separate out-and-back trips?",
      "options": [
        "Savings is 0 miles because you still visit both customers.",
        "Calculate step by step: 1) Separate Trips (2 trucks): Trip 1 (Depot -> C1 -> Depot) = 30 + 30 = 60 miles. Trip 2 (Depot -> C2 -> Depot) = 40 + 40 = 80 miles. Total distance for separate trips = 60 + 80 = 140 miles! 2) Consolidated Trip (1 truck): Depot -> C1 -> C2 -> Depot = 30 + 50 + 40 = 120 miles! 3) Clarke-Wright Savings = d(0, 1) + d(0, 2) - d(1, 2) = 30 + 40 - 50 = 20 miles! Consolidating both customers onto a single vehicle route saves exactly 20 miles (140 - 120 = 20 miles) of fleet driving, reducing fuel and driver labor!",
        "Savings is 50 miles.",
        "Consolidation increases travel distance to 180 miles."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Serving customers separately requires 140 total miles. Linking them into a continuous loop (Depot -> C1 -> C2 -> Depot) consumes only 120 miles. The Clarke-Wright savings formula directly calculates this delta: 30 + 40 - 50 = 20 miles of saved driving."
    },
    "quests": [
      {
        "title": "VRP Graph Theory, Clarke-Wright Formulations & Time-Window Mechanics",
        "type": "concept",
        "description": "Formulate vehicle routing optimization: analyze the mathematical structure of the Capacitated Vehicle Routing Problem (CVRP) as an extension of the Traveling Salesperson Problem (TSP); mathematically derive the Clarke-Wright Savings heuristic; formulate Vehicle Routing with Time Windows (VRPTW) adding arrival time constraints and driver idle-waiting state variables; evaluate Dijkstra and A* search pathfinding on road network contraction hierarchies.",
        "rubric": "Step-by-step mathematical formulation of the VRPTW mixed-integer linear programming model; complete derivation of the Clarke-Wright savings theorem; formal analysis of 2-Opt local search heuristics."
      },
      {
        "title": "The Overlapping Fleet Sprawl & $800,000 Restaurant Rejection Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a food service distributor's $800,000 quarterly loss resulting from manual vehicle dispatching that caused crossed routes and missed delivery appointment windows: analyze GPS telematics traces, customer receiving door timestamps, delivery credit memo ledgers, and driver overtime payroll records; prove how unoptimized routing destroyed delivery reliability; author an institutional dynamic routing standard.",
        "rubric": "Audit historical fleet GPS breadcrumbs and customer delivery rejection records; expose the lack of time-window constrained routing; deliver an enterprise VRPTW dispatch governance policy."
      },
      {
        "title": "Building an Enterprise VRPTW Fleet Routing & Dispatch Engine in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Vehicle Routing Suite in Python using NetworkX or OR-Tools: 1) Model road networks with depot and customer coordinates, delivery demands, and time windows; 2) Implement Clarke-Wright Savings algorithm to cluster and build initial vehicle tours; 3) Implement 2-Opt and Or-Opt local search heuristics to eliminate route crossings; 4) Enforce vehicle weight/cube limits and driver maximum shift hour constraints; 5) Output an interactive Folium / Leaflet map showing optimized multi-vehicle delivery routes.",
        "rubric": "Working Python VRPTW routing engine; verified constraint satisfaction across capacity and time windows; functional 2-Opt route smoothing; clear visual mapping of multi-stop fleet routes."
      },
      {
        "title": "Major Highway Bridge Collapse & Fleet En-Route Re-Optimization 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when a structural bridge collapse closes a critical interstate corridor connecting your primary distribution depot to 200 delivery destinations, stranding 30 en-route fleet vehicles: detect the network link closure; instantly update road network edge weights in the routing engine; execute live dynamic en-route re-optimization recalculating detour routes; preserve scheduled morning delivery windows.",
        "rubric": "Rapid detection of road network link failure; execute live dynamic A* detour re-routing across 30 active fleet vehicles; minimize customer delivery delays within 20 minutes."
      }
    ]
  },
  {
    "day": 18,
    "month": 1,
    "blockNum": 4,
    "title": "Freight Forwarding, 3PL/4PL Logistics Partnerships & Master Services Agreements: NVOCC & SLA Governance",
    "stageName": "Stage 2: Operational Execution, Production Scheduling & Warehouse Physics",
    "stageNum": 2,
    "pedagogicalRole": "Contract Logistics, 3PL/4PL Strategic Governance & Freight Contracting",
    "spokenGoal": "Very few global companies own their own container ships, airplanes, or nationwide truck fleets. Instead, they partner with Third-Party Logistics (3PL) providers for warehousing and transportation, and Fourth-Party Logistics (4PL) lead logistics integrators to orchestrate entire supply chains. But contracting logistics is a legal and operational minefield. Today we engineer Freight Forwarding, 3PL/4PL Logistics Partnerships & Master Services Agreements (MSA). We deconstruct Non-Vessel-Operating Common Carriers (NVOCC) and ocean House Bills of Lading (HBL). We master contractual Service Level Agreements (SLAs): On-Time In-Full (OTIF) delivery metrics, order accuracy thresholds, inventory shrinkage allowances, and liquidated damage penalty matrices.",
    "conceptInvariant": "3PL/4PL SLA Governance & OTIF Invariant: Third-party logistics contract performance must satisfy the On-Time In-Full (OTIF) metric: OTIF = (On_Time_Orders * In_Full_Orders) / Total_Orders_Dispatched >= SLA_Threshold (typically 98.0%); inventory shrinkage must not exceed contractual allowance: Shrinkage_pct <= Allowance_contract (typically 0.25-0.50% of annual throughput); failure to meet monthly OTIF thresholds triggers automatic contractual liquidated damages: Damages = max(0, Target_OTIF - Actual_OTIF) * Invoice_Value * Penalty_Multiplier.",
    "failureMode": "A fast-growing fashion retailer outsources all e-commerce fulfillment to a budget 3PL under a vague, loosely drafted Master Services Agreement with no contractual OTIF definitions or inventory shrinkage caps. During peak holiday season, the 3PL's pick accuracy drops to 88%, 18,000 orders ship late, and $450,000 in designer clothing vanishes from the warehouse (3.2% shrinkage). When the retailer demands compensation, the 3PL points to an unread liability limitation clause capping damages at '$50 per occurrence'. The retailer loses $1,650,000 with zero legal recourse.",
    "tryItFriction": "Build an Enterprise 3PL SLA Monitoring & Contract Governance Engine in Python: 1) Ingest 3PL warehouse transaction feeds (inbound receiving timestamps, pick-pack confirmations, outbound carrier scan events); 2) Compute weekly and monthly OTIF (On-Time In-Full) performance metrics; 3) Compute physical inventory shrinkage rates against contractual baseline allowances; 4) Implement an automated Contract Penalty Engine that calculates liquidated damages and generates monthly invoice credit deductions; 5) Generate executive 3PL partner scorecard reports.",
    "socraticHints": [
      "What is the critical operational difference between a 3PL and a 4PL provider?",
      "A 3PL (Third-Party Logistics) provides physical asset-based execution services (warehousing, trucks, packing); a 4PL (Fourth-Party Logistics) is a non-asset-based lead logistics integrator that manages technology, data, and orchestrates multiple competing 3PLs on behalf of the client.",
      "A 4PL acts as the outsourced supply chain management department of the enterprise."
    ],
    "situationalPuzzle": {
      "scenario": "Your enterprise company contracts a 3PL to fulfill 100,000 monthly orders. The Master Services Agreement specifies: 1) Minimum OTIF SLA = 98.0%; 2) If actual OTIF falls below 98.0%, the 3PL must credit 5% of their total monthly handling fee ($200,000 fee base) for every 1.0% drop below SLA; 3) Inventory shrinkage allowance = 0.3% of throughput inventory value ($10,000,000 throughput). Any shrinkage exceeding 0.3% must be reimbursed at full replacement cost. In November: Actual OTIF was 95.0%, and physical cycle counts reveal $55,000 in missing inventory. What is the total penalty credit the 3PL owes your company?",
      "options": [
        "The 3PL owes $0 because 95% is passing in school.",
        "Calculate step by step: 1) OTIF Penalty: SLA target = 98.0%, Actual = 95.0%. Deficit = 3.0%. Penalty rate = 3.0 * 5% = 15% fee credit! Monthly fee = $200,000. OTIF Penalty Credit = 15% of $200,000 = $30,000. 2) Shrinkage Reimbursement: Contractual allowance = 0.3% of $10,000,000 = $30,000. Actual shrinkage = $55,000. Excess shrinkage = $55,000 - $30,000 = $25,000. The 3PL must reimburse 100% of excess shrinkage = $25,000. 3) Total Penalty Credit Owed = $30,000 (OTIF) + $25,000 (Shrinkage) = $55,000! The 3PL must credit $55,000 against their November invoice!",
        "The 3PL pays $500 flat fee.",
        "Cancel the contract immediately without calculating penalties."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Rigorous SLA enforcement holds 3PLs accountable. A 3% drop below the 98% OTIF target triggers a 15% fee rebate ($30,000), while the $25,000 in excess shrinkage beyond the 0.3% contractual allowance must be fully reimbursed, yielding a total credit of $55,000."
    },
    "quests": [
      {
        "title": "Contract Logistics Economics, 3PL/4PL Architecture & SLA Formulations",
        "type": "concept",
        "description": "Formulate contract logistics governance: analyze the operational spectrum from 1PL to 5PL providers; formulate the role of Non-Vessel-Operating Common Carriers (NVOCC) and Federal Maritime Commission (FMC) regulations; mathematically formulate the multi-dimensional On-Time In-Full (OTIF = %On-Time * %In-Full * %Damage-Free) composite metric; formulate contractual liquidated damage step-functions and inventory shrinkage liability thresholds.",
        "rubric": "Step-by-step mathematical formulation of composite OTIF metrics; complete architectural comparison of 3PL execution vs 4PL orchestration; formal legal-technical specification of Master Services Agreement SLA clauses."
      },
      {
        "title": "The Vague MSA Trap & $1.65M Holiday Fulfillment Bleed Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a fashion retailer's $1.65M loss resulting from poorly drafted 3PL contract SLAs and unmonitored inventory shrinkage: analyze 3PL Master Services Agreements, warehouse EDI dispatch feeds, physical cycle count variance ledgers, and customer late-delivery chargebacks; prove how lack of contractual enforcement permitted operational bleeding; author an institutional 3PL procurement governance charter.",
        "rubric": "Audit historical 3PL performance telemetry against contract MSA language; expose the liability loophole; deliver an enterprise 3PL contracting and SLA enforcement standard."
      },
      {
        "title": "Building an Enterprise 3PL Performance & SLA Penalty Engine in Python",
        "type": "mastery",
        "description": "Engineer a production-ready 3PL Partner Governance Suite in Python: 1) Ingest multi-facility 3PL operational event logs (inbound receiving, order picking, outbound carrier scans); 2) Compute weekly and monthly OTIF, dock-to-stock cycle times, and order accuracy rates; 3) Compute physical inventory shrinkage vs contractual baseline allowances; 4) Automatically calculate contractual liquidated damages and generate invoice adjustment credits; 5) Render an executive 3PL scorecard dashboard.",
        "rubric": "Working Python 3PL scorecard suite; verified OTIF and shrinkage calculations; automated contractual penalty generation; clear partner comparative visualization."
      },
      {
        "title": "3PL Ransomware Attack & Multi-Node Emergency Cutover 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when a major national 3PL partner suffering a LockBit ransomware attack shuts down all 5 distribution facilities nationwide, halting 100% of your customer fulfillment: detect the partner outage; invoke emergency disaster recovery cutover clauses; re-route orders to secondary regional backup 3PL warehouses and company-operated facilities; maintain customer shipping commitments.",
        "rubric": "Rapid detection of third-party logistics network failure; execute automated order re-routing across backup fulfillment nodes; restore customer shipping flow within 20 minutes."
      }
    ]
  },
  {
    "day": 19,
    "month": 1,
    "blockNum": 4,
    "title": "Cold Chain Integrity, IoT Telemetry & Perishable Supply Chains: Thermal Thermodynamics & Title 21 CFR Part 11",
    "stageName": "Stage 2: Operational Execution, Production Scheduling & Warehouse Physics",
    "stageNum": 2,
    "pedagogicalRole": "Cold Chain Engineering, IoT Sensor Telemetry & Regulatory Pharmaceutical Compliance",
    "spokenGoal": "In pharmaceuticals, biologics, and fresh food, supply chain management is literally a matter of life and death. If a shipment of mRNA vaccines or insulin experiences a 3-degree temperature excursion for 2 hours, the proteins denature, rendering the medicine useless or toxic. Today we engineer Cold Chain Integrity, IoT Telemetry & Perishable Supply Chains. We model thermal thermodynamics: passive thermal packaging (expanded polystyrene EPS, vacuum insulated panels VIP), phase change materials (PCM like dry ice and gel packs), and active refrigerated reefer units. We deploy real-time IoT cellular/BLE sensors streaming temperature, humidity, shock, and tilt data to the cloud. We enforce regulatory compliance: FDA Title 21 CFR Part 11 electronic records, Good Distribution Practices (GDP), and automated Mean Kinetic Temperature (MKT) excursion calculations.",
    "conceptInvariant": "Thermal Thermodynamic Balance & MKT Stability Invariant: Temperature of an insulated payload must remain within target range [T_min, T_max] across transit duration: Heat_flux Q = (k * Area / Thickness) * (T_ambient - T_payload); phase change material latent heat must absorb total thermal ingress: Mass_PCM * Latent_Heat >= Q * Transit_hours; Mean Kinetic Temperature (MKT) over time series T_i satisfies the Arrhenius equation: MKT = (Delta_H / R) / (-ln( (1/n) * sum_{i=1}^n exp(-Delta_H / (R * T_i)) )); exceeding MKT threshold mandates product quarantine and regulatory excursion reporting.",
    "failureMode": "A biotechnology company ships $8,500,000 of monoclonal antibody oncology drugs across the Atlantic in standard passive thermal shippers using generic gel packs instead of vacuum-insulated panels (VIP) with -20°C Phase Change Materials. A customs paperwork hold delays the pallet on the tarmac at Frankfurt Airport in 32°C summer heat for 18 hours. Thermal sensors record an excursion to +14°C. Because the company cannot prove Mean Kinetic Temperature stability under FDA 21 CFR Part 11 audit trails, health authorities mandate the immediate destruction of the entire $8.5M drug lot.",
    "tryItFriction": "Build an Enterprise Cold Chain IoT Telemetry & MKT Excursion Engine in Python: 1) Ingest high-frequency temperature time series data from IoT sensor loggers (sampling every 5 minutes); 2) Compute Mean Kinetic Temperature (MKT) using the Arrhenius activation energy equation (Delta H = 83.144 kJ/mol); 3) Implement automated temperature excursion tripwires (e.g. 2°C to 8°C cold-chain standard); 4) Model passive packaging thermal degradation under extreme ambient summer/winter profiles; 5) Generate audit-ready Title 21 CFR Part 11 compliance certificates.",
    "socraticHints": [
      "Why is Mean Kinetic Temperature (MKT) vastly superior to a simple arithmetic average temperature for assessing drug degradation?",
      "Because chemical degradation reactions follow the non-linear Arrhenius equation: degradation rates increase exponentially, not linearly, with rising temperature; an arithmetic average hides brief, catastrophic high-temperature spikes that destroyed product stability.",
      "MKT gives higher mathematical weight to temperature spikes, accurately reflecting the real biological degradation suffered by the drug."
    ],
    "situationalPuzzle": {
      "scenario": "A shipment of vaccines with a strict 2°C to 8°C storage requirement is in transit for 10 hours. Due to a refrigeration failure, temperatures fluctuate: Hours 1-8: 4°C (277.15 K). Hours 9-10: 25°C (298.15 K) in direct sunlight. Arithmetic average temperature = (8 * 4 + 2 * 25) / 10 = (32 + 50) / 10 = 8.2°C (barely above the 8°C limit). A junior quality tech argues: 'It only averaged 8.2°C, so the vaccine is fine.' Why is this tech dangerously wrong, and what does the Arrhenius Mean Kinetic Temperature (MKT) reveal?",
      "options": [
        "The tech is right; 8.2°C is within acceptable rounding tolerance.",
        "The tech is fatally mistaken! Chemical degradation accelerates exponentially at 25°C! Calculating Mean Kinetic Temperature using Arrhenius kinetics: MKT = (Delta H / R) / (-ln( (1/10) * [8 * exp(-Delta H / (R * 277.15)) + 2 * exp(-Delta H / (R * 298.15))] )) = 18.7°C! The TRUE biological thermal impact is equivalent to storing the drug at nearly 19°C for the entire 10 hours! The vaccines have denatured and must be quarantined immediately to prevent patient harm!",
        "MKT is only used for frozen meat, not vaccines.",
        "Add ice to the box upon arrival to cancel out the heat."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Arrhenius kinetics proves that 2 hours at 25°C does more biological damage than days at 4°C. While arithmetic average was 8.2°C, the Mean Kinetic Temperature was 18.7°C, proving the vaccine lot suffered massive thermal degradation. Using arithmetic averages for cold-chain pharmaceuticals is a fatal regulatory violation."
    },
    "quests": [
      {
        "title": "Cold Chain Thermodynamics, Arrhenius Kinetics & 21 CFR Part 11 Formulations",
        "type": "concept",
        "description": "Formulate cold chain systems engineering: analyze Fourier heat conduction and latent heat thermodynamics across passive phase change materials (PCM) and vacuum insulated panels (VIP); mathematically derive the Arrhenius Mean Kinetic Temperature (MKT) formula; evaluate Good Distribution Practices (GDP) and FDA Title 21 CFR Part 11 cryptographic audit trails; formulate IoT wireless telemetry architectures (BLE mesh, cellular NB-IoT, real-time geofencing).",
        "rubric": "Step-by-step mathematical derivation of the Arrhenius MKT equation; complete thermal conduction balance equations for passive shippers; formal regulatory compliance analysis for FDA electronic batch records."
      },
      {
        "title": "The Frankfurt Tarmac Excursion & $8.5M Oncology Drug Lot Destruction Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a biotechnology company's $8.5M oncology lot destruction resulting from inadequate passive insulation packaging and unmonitored airport tarmac delays: analyze IoT thermal sensor logs, airline cargo transfer records, airport weather telemetry, and regulatory health authority inspection rulings; prove how thermal modeling failure caused lot destruction; author an institutional cold chain validation standard.",
        "rubric": "Audit IoT temperature data logger traces against environmental ambient conditions; expose the thermal insulation packaging deficit; deliver an enterprise GDP cold-chain qualification protocol."
      },
      {
        "title": "Building an Enterprise Cold Chain IoT Telemetry & MKT Suite in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Cold Chain Telemetry Engine in Python: 1) Ingest multi-sensor IoT telemetry streams (temperature, humidity, tilt, light); 2) Compute exact Mean Kinetic Temperature (MKT) across transit windows; 3) Implement automated excursion classification detecting severity, duration, and cumulative degree-hours; 4) Model simulated thermal package insulation profiles under ambient temperature extremes; 5) Generate audit-ready Title 21 CFR Part 11 compliance certificates.",
        "rubric": "Working Python cold chain telemetry suite; verified Arrhenius MKT calculations; automated excursion alerting; compliant regulatory certificate generation."
      },
      {
        "title": "Refrigerated Container Reefer Compressor Failure at Sea 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when an IoT satellite telemetry ping reports that the primary compressor on a 40-foot ocean reefer container holding $4,000,000 in perishable biologics has failed at sea, causing interior temperature to climb at 1.8°C per hour: detect the compressor failure; calculate time-to-excursion threshold; signal vessel crew to activate emergency backup generator power; verify temperature recovery.",
        "rubric": "Rapid detection of thermal compressor failure at sea; compute thermal runaway timeline; initiate emergency maritime engineering protocol restoring refrigeration within 20 minutes."
      }
    ]
  },
  {
    "day": 20,
    "month": 1,
    "blockNum": 4,
    "title": "Milestone 4: ApexTMS Enterprise Transportation Management & Fleet Routing Engine",
    "stageName": "Stage 2: Operational Execution, Production Scheduling & Warehouse Physics",
    "stageNum": 2,
    "pedagogicalRole": "Transportation Logistics Synthesis, Fleet Routing & IoT Telemetry Architecture",
    "spokenGoal": "Milestone 4 is the grand logistics and transportation synthesis of Stage 2 Block 4! Today, you synthesize Freight Mode Economics & Weight-Break Bumping (Day 16), Vehicle Routing Problem with Time Windows & Clarke-Wright Savings (Day 17), 3PL/4PL Logistics Governance & OTIF SLAs (Day 18), and Cold Chain IoT Telemetry & MKT Excursion Analytics (Day 19) into a production-grade transportation management masterpiece: ApexTMS. You will architect an end-to-end transportation platform that rates freight, optimizes multi-stop fleet routes under strict customer appointment windows, monitors real-time IoT cold-chain sensor streams, and audits carrier 3PL invoice contracts with automated penalty deduction. Zero missed delivery windows, minimum fuel burn, 100% cold chain integrity.",
    "conceptInvariant": "ApexTMS Integrated Transportation Invariant: The transportation execution pipeline must enforce multi-objective operational optimality: Mode_Select(Min_Cost, Bumped_LTL vs TL) -> Routing(Min_Miles, VRPTW_feasible, Capacity_satisfied) -> Partner_Audit(OTIF >= 98.0%, Shrinkage <= 0.3%) -> Cold_Chain(MKT <= T_threshold, Excursions == 0); zero late deliveries on contracted customer appointment windows; 100% automated freight audit reconciliation.",
    "failureMode": "An enterprise food and beverage distributor manages national distribution using disconnected spreadsheet freight rating and manual carrier dispatching. Deliveries miss store appointment windows, un-bumped LTL freight costs $2,200,000 in excess charges, 3PL partners overbill $800,000 without penalty deductions, and an unmonitored cold-chain refrigeration failure ruins $1,500,000 of dairy products. The company bleeds $4,500,000 in avoidable logistics losses.",
    "tryItFriction": "Build and Validate the Complete ApexTMS Production Suite in Python: 1) Implement automated freight rating with NMFC density classification and weight-break bumping; 2) Build a Clarke-Wright VRPTW fleet routing engine for 100 customer stops; 3) Implement 3PL contract SLA auditing computing OTIF and liquidated damage credits; 4) Ingest IoT cold-chain telemetry streams computing MKT and flagging excursions; 5) Generate executive transportation cost, route efficiency, and SLA performance reports.",
    "socraticHints": [
      "Why must transportation management, routing optimization, and cold-chain monitoring be unified in a single architecture?",
      "Because dispatching an optimal route is useless if the vehicle arrives with spoiled goods, and booking cheap freight is counterproductive if late deliveries incur contractual customer fines.",
      "ApexTMS unifies cost rating, spatial routing, partner SLAs, and physical temperature telemetry into an integrated logistics engine."
    ],
    "situationalPuzzle": {
      "scenario": "During Milestone 4 integration testing of ApexTMS across 200 delivery routes, diagnostics reveal: 1) Weight-break bumping saved $180,000 on LTL freight; 2) VRPTW routing cut fleet mileage by 28%; but 3) A high-priority hospital pharmaceutical delivery route missed its 8:00 AM delivery window by 45 minutes because the Clarke-Wright routing heuristic prioritized distance minimization over time-window urgency! How must ApexTMS be patched?",
      "options": [
        "Ignore the hospital's appointment window.",
        "Implement Time-Window Penalty Weighting in the Clarke-Wright objective function: The routing engine must compute a composite savings metric: Savings_composite = alpha * Distance_Savings - beta * Time_Window_Slack! When a stop has a tight, early time window (small slack), the algorithm prioritizes time-window feasibility over raw mileage minimization! Patching this ensures critical medical and enterprise appointment windows are 100% protected while still minimizing total fleet transit cost!",
        "Hire a dedicated private jet for every hospital delivery.",
        "Remove all time windows from the system."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Distance minimization alone will gladly delay a tight delivery if it saves a few miles of driving. In professional logistics, time-window violations carry severe contractual penalties. Augmenting the routing objective with time-slack weighting guarantees that tight appointment windows are prioritized before distance savings."
    },
    "quests": [
      {
        "title": "ApexTMS Architectural Specification & Multi-Objective Routing Formulations",
        "type": "concept",
        "description": "Formulate the comprehensive architectural specification of ApexTMS: synthesize multimodal freight rating, Clarke-Wright VRPTW routing, 3PL SLA auditing, and IoT cold-chain MKT telemetry into an integrated system architecture; derive the multi-objective mathematical optimization equations balancing fuel cost, time-window penalties, and cold-chain thermal risk.",
        "rubric": "Master-level architectural blueprint of the enterprise TMS platform; complete mathematical formulations of multi-objective VRPTW routing and MKT thermal tracking; formal system state diagrams."
      },
      {
        "title": "The Disconnected Logistics Stack & $4.5M Transportation Bleed Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a food distributor's $4.5M loss resulting from disconnected transportation systems, unmonitored carrier overbilling, and unhedged cold-chain failures: analyze freight invoices, route telematics logs, 3PL partner contracts, and perishable damage claims; prove how lack of integrated TMS optimization caused financial bleeding; author an institutional TMS modernization charter.",
        "rubric": "Audit historical freight billing records against routing telematics and thermal logs; expose the systemic vulnerabilities of fragmented logistics tools; deliver an enterprise TMS operating standard."
      },
      {
        "title": "Building the Complete ApexTMS Production Suite in Python",
        "type": "mastery",
        "description": "Engineer the complete ApexTMS Production Suite in Python: 1) Build an LTL freight rater with automated weight-break bumping; 2) Implement a VRPTW multi-stop vehicle router with time-window slack weighting; 3) Build a 3PL contract auditor calculating OTIF and liquidated damage credits; 4) Implement an IoT telemetry processor computing Arrhenius MKT and flagging excursions; 5) Demonstrate 25%+ fleet mileage reduction, 99.5% on-time delivery, and 100% cold-chain compliance.",
        "rubric": "Complete working Python TMS suite; verified integration across all four core modules; mathematically proven routing and thermal compliance; audit-ready executive telemetry reports."
      },
      {
        "title": "Fleet Cyberattack & Telematics GPS Spoofing 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when a sophisticated cyberattack injects GPS spoofing telemetry into your TMS dispatch network, causing 50 en-route delivery trucks to report erroneous locations and misrouting drivers toward dead ends: detect the anomalous telematics telemetry; trigger an immediate failover to dead-reckoning cellular tower triangulation and OBD-II odometer tracking; re-establish true fleet visibility.",
        "rubric": "Rapid detection of GPS spoofing anomalies; execute automated failover to cellular tower and OBD-II telemetry; re-establish verified vehicle positions and route guidance within 15 minutes."
      }
    ]
  },
  {
    "day": 21,
    "month": 1,
    "blockNum": 5,
    "title": "Strategic Sourcing & The Kraljic Portfolio Matrix: Bottleneck, Critical, Leverage & Routine Spend Engineering",
    "stageName": "Stage 3: Strategic Sourcing, Lean Six Sigma, Working Capital & Capstone 1",
    "stageNum": 3,
    "pedagogicalRole": "Strategic Procurement, Spend Analysis & Kraljic Supply Risk Classification",
    "spokenGoal": "Welcome to Stage 3! In Stage 1 and 2, we mastered the internal mechanics of inventory, production, and warehousing. In Stage 3, we master the external ecosystem: suppliers, strategic sourcing, lean manufacturing, and working capital. Sourcing is not haggling with vendors over price; it is the strategic management of external risk and profit impact. In 1983, Peter Kraljic published the definitive framework that revolutionized enterprise purchasing. Today we engineer Strategic Sourcing & The Kraljic Portfolio Matrix. We segment multi-million-dollar corporate spend across dual dimensions: Profit Impact vs Supply Risk. We engineer strategies for all four quadrants: Routine items (process automation), Leverage items (aggressive competitive auctions), Bottleneck items (volume insurance and substitution), and Strategic items (deep collaborative partnerships).",
    "conceptInvariant": "Kraljic Spend Segmentation & Sourcing Strategy Invariant: Every corporate spend item must be classified into the Kraljic coordinate plane: Position = (Profit_Impact, Supply_Risk); Routine (Low Impact, Low Risk): Strategy = Automated Catalog Procurement (e-procurement, P-cards); Leverage (High Impact, Low Risk): Strategy = Aggressive Tendering & Reverse Auctions; Bottleneck (Low Impact, High Risk): Strategy = Guaranteed Volume Contracts, High Safety Stock, Dual-Sourcing; Strategic (High Impact, High Risk): Strategy = Long-Term Strategic Alliances, Risk-Reward Sharing, Co-Innovation; zero single-sourced Bottleneck or Strategic dependencies without executive risk approval.",
    "failureMode": "An electric vehicle startup treats a custom micro-controller ASIC chip as a standard 'Routine' commodity item, assigning a junior buyer to negotiate the lowest spot-market price from a single overseas foundry. When automotive silicon fabrication capacity tightens, the foundry drops the low-margin order to serve Apple. Because the custom ASIC cannot be replaced without redesigning the vehicle motherboard (a 9-month regulatory recertification), the assembly line halts for 7 months. The company burns $45,000,000 in investor capital and misses its production launch target.",
    "tryItFriction": "Build an Enterprise Kraljic Spend Analysis & Sourcing Engine in Python: 1) Ingest 50,000 historical enterprise procurement purchase orders across 2,000 suppliers; 2) Compute annual spend volume and EBITDA profit impact per category; 3) Compute Supply Risk scores based on supplier count, market concentration (Herfindahl-Hirschman Index HHI), and lead-time volatility; 4) Segment spend into the 4 Kraljic quadrants; 5) Assign automated procurement playbooks (Reverse Auction vs Partnership vs Dual-Sourcing) and generate executive sourcing roadmaps.",
    "socraticHints": [
      "Why is applying aggressive cost-cutting negotiations to 'Bottleneck' items an operational death sentence?",
      "Because Bottleneck items represent low spend volume but catastrophic supply risk (e.g. a specialized $2 chemical sensor); aggressive cost-cutting alienates the sole supplier, who can walk away and shut down your entire $50M factory over a trivial dollar amount.",
      "On Bottleneck items, the goal is not saving 5 cents; it is securing guaranteed supply availability at all costs through long-term volume commitments and buffer inventory."
    ],
    "situationalPuzzle": {
      "scenario": "A medical ventilator manufacturer procures two components: 1) Custom microprocessor running proprietary firmware (Annual spend = $12M, 1 qualified supplier, switching time = 18 months); 2) Medical-grade hospital power cords (Annual spend = $800k, 15 qualified suppliers, switching time = 1 week). Procurement Manager A wants to run a fierce reverse auction on the microprocessor to force a 10% price cut. Procurement Manager B objects. In which Kraljic quadrant does each item belong, and what is the correct strategy?",
      "options": [
        "Both items are Leverage items; run reverse auctions on both.",
        "Categorize correctly: 1) Microprocessor has High Profit Impact ($12M) and High Supply Risk (1 supplier, 18-mo switch) => STRATEGIC Quadrant! Aggressive reverse auctions are suicidal; the correct strategy is Long-Term Strategic Partnership with joint engineering roadmaps, dual-sourcing development, and index-linked pricing! 2) Power Cords have Low/Moderate Profit Impact ($800k) and Low Supply Risk (15 suppliers, 1-wk switch) => LEVERAGE Quadrant! Power cords are the ideal candidate for competitive e-auctions to drive down costs! Manager A's proposal would alienate the vital microprocessor partner and risk shutting down production!",
        "Microprocessor is Routine; Power Cords are Strategic.",
        "Cancel both components and build ventilators without power cords."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Misclassifying Kraljic quadrants is fatal. The custom microprocessor is a core Strategic item; threatening the sole supplier with price cuts risks supply termination. Conversely, standardized power cords with 15 interchangeable suppliers belong in the Leverage quadrant, where aggressive competitive bidding captures maximum margin."
    },
    "quests": [
      {
        "title": "Kraljic Portfolio Matrix Theory, Spend Taxonomy & Sourcing Formulations",
        "type": "concept",
        "description": "Formulate strategic sourcing theory: analyze Peter Kraljic's 1983 portfolio purchasing framework; derive mathematical formulations for Profit Impact (EBITDA contribution percentage) and Supply Risk (Herfindahl-Hirschman Index HHI, supplier switching costs, lead-time variance); formulate the differentiated procurement strategies for Routine, Leverage, Bottleneck, and Strategic spend categories; evaluate supplier power versus buyer power dynamics.",
        "rubric": "Step-by-step mathematical formulation of Kraljic quadrant scoring equations; complete strategic taxonomy breakdown across all four quadrants; formal comparative matrix of procurement playbooks."
      },
      {
        "title": "The Single-Sourced ASIC Trap & $45M Assembly Shutdown Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of an EV manufacturer's $45M loss resulting from misclassifying a custom micro-controller as a routine commodity: analyze procurement purchase orders, supplier contract terms, foundry allocation notices, and plant downtime financial ledgers; prove how flawed spend classification caused catastrophic line stoppage; author an institutional strategic sourcing governance charter.",
        "rubric": "Audit historical component procurement records against supplier market concentration data; expose the category classification error; deliver an enterprise strategic sourcing standard."
      },
      {
        "title": "Building an Enterprise Kraljic Spend Analysis & Sourcing Engine in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Strategic Sourcing Engine in Python: 1) Ingest multi-tier enterprise spend ledgers across categories and vendors; 2) Compute category Profit Impact scores and multidimensional Supply Risk metrics; 3) Automatically classify thousands of SKUs into the 4 Kraljic quadrants; 4) Generate tailored sourcing action plans (e-auctions, long-term partnerships, buffer stocking); 5) Render interactive 2D Kraljic scatter plots and executive procurement portfolios.",
        "rubric": "Working Python spend analysis suite; verified mathematical classification into all 4 Kraljic quadrants; automated procurement playbook assignment; clear visual portfolio generation."
      },
      {
        "title": "Sole-Source Chemical Monopoly Price Extortion 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when the sole-source global supplier of a patented catalyst chemical (a critical Bottleneck item required for your entire chemical product line) demands an immediate 150% price increase and threatens to cut off shipments within 48 hours: detect the supply threat; evaluate contractual force majeure terms; activate emergency secondary synthesis qualification; negotiate volume stabilization agreements.",
        "rubric": "Rapid assessment of sole-source monopoly extortion impact; deploy emergency chemical substitution and commercial negotiation countermeasures within 20 minutes."
      }
    ]
  },
  {
    "day": 22,
    "month": 1,
    "blockNum": 5,
    "title": "Supplier Evaluation, Auditing & Weighted Point Rating Systems: PPM Defect Rates & Altman Z-Score Risk",
    "stageName": "Stage 3: Strategic Sourcing, Lean Six Sigma, Working Capital & Capstone 1",
    "stageNum": 3,
    "pedagogicalRole": "Supplier Quality Management, Vendor Risk Auditing & Financial Health Scoring",
    "spokenGoal": "You cannot inspect quality into a product at the end of the assembly line; quality must be engineered into your suppliers. When an overseas supplier ships 10,000 sub-assemblies with a 2% defect rate, your factory grinds to a halt sorting bad parts. Worse, if a sole-source supplier quietly goes bankrupt midway through a production cycle, your entire supply chain collapses. Today we engineer Supplier Evaluation, Auditing & Weighted Point Rating Systems. We design multidimensional supplier scorecards evaluating Quality (Parts Per Million PPM defect rates), On-Time Delivery (OTD), Total Cost, and Commercial Flexibility. Crucially, we audit supplier financial health using Edward Altman's Z-Score, predicting supplier bankruptcy up to two years in advance from public/private balance sheet ratios.",
    "conceptInvariant": "Supplier Quality & Financial Solvency Invariant: Overall Supplier Composite Score satisfies: Score_vendor = sum_i (w_i * S_i), where sum w_i = 1.0; Quality rating is governed by Parts Per Million defect rate: PPM = (Defective_parts / Total_parts_delivered) * 10^6 <= PPM_threshold (typically < 50 PPM for automotive); Supplier financial solvency is governed by Altman Z-Score: Z = 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 0.999*X5; vendors with Z < 1.81 reside in the 'Distress Zone' and are disqualified from sole-source or mission-critical contract awards.",
    "failureMode": "An aerospace tier-1 supplier awards a $20,000,000 machined titanium landing gear contract to a low-bid machine shop without auditing its financial balance sheet or quality PPM history. 6 months into the contract, the machine shop's quality PPM soars to 4,200 PPM (42 times the aerospace limit of 100 PPM), forcing $1,200,000 in manual inspection and scrapping. 2 months later, the machine shop abruptly files for Chapter 7 bankruptcy due to crushing debt, leaving production tooling locked in bankruptcy court for 8 months. The tier-1 supplier loses $8,000,000 in program delay penalties.",
    "tryItFriction": "Build an Enterprise Supplier Evaluation & Altman Z-Score Risk Engine in Python: 1) Ingest supplier delivery performance feeds and quality inspection logs; 2) Compute quality PPM, On-Time In-Full (OTIF), and cost variance scores; 3) Compute Edward Altman's Z-Score from supplier financial statements (working capital, retained earnings, EBIT, equity, liabilities, sales); 4) Classify suppliers into Safe (Z > 2.99), Grey (1.81 <= Z <= 2.99), and Distress (Z < 1.81) zones; 5) Generate executive supplier performance scorecards.",
    "socraticHints": [
      "Why must supplier evaluation always evaluate financial health (Altman Z-Score) in addition to delivery and quality metrics?",
      "Because a supplier can deliver perfect quality on-time today while bleeding cash to death behind the scenes; when they run out of payroll cash and padlock their gates tomorrow, your supply chain suffers an unrecoverable sudden-death shock.",
      "Altman's Z-Score provides predictive forward-looking financial warning, alerting procurement to diversify or assist a critical vendor before bankruptcy occurs."
    ],
    "situationalPuzzle": {
      "scenario": "You are evaluating Supplier Alpha for a critical automotive sub-assembly contract. Performance metrics: Delivery OTIF = 99.2% (Excellent), Quality PPM = 15 PPM (World-Class). Financial metrics: Working Capital / Assets = 0.05, Retained Earnings / Assets = 0.02, EBIT / Assets = 0.03, Market Equity / Total Liabilities = 0.20, Sales / Total Assets = 0.80. Altman Z-Score formula: Z = 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 0.999*X5. Should you award Supplier Alpha the sole-source contract?",
      "options": [
        "Award the contract immediately because their quality PPM is world-class.",
        "Calculate Altman Z-Score step by step: 1) 1.2 * 0.05 = 0.060. 2) 1.4 * 0.02 = 0.028. 3) 3.3 * 0.03 = 0.099. 4) 0.6 * 0.20 = 0.120. 5) 0.999 * 0.80 = 0.799. 6) Total Z-Score = 0.060 + 0.028 + 0.099 + 0.120 + 0.799 = 1.106! 7) Evaluation: Altman Z < 1.81 indicates severe financial distress and a 95% probability of bankruptcy within 24 months! Despite excellent technical quality, Supplier Alpha is drowning in debt and insolvent! Awarding a sole-source contract would be corporate negligence; procurement must require a dual-sourcing strategy or mandate financial restructuring before contract award!",
        "Ignore the financial metrics; only quality matters in engineering.",
        "Z-Scores only apply to commercial retail banks."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. A Z-Score of 1.106 places Supplier Alpha squarely in the 'Distress Zone' (Z < 1.81). World-class manufacturing quality cannot save a business from balance-sheet insolvency. Awarding a mission-critical contract to an insolvent vendor guarantees catastrophic supply disruption when the vendor inevitably enters bankruptcy."
    },
    "quests": [
      {
        "title": "Supplier Quality Theory, PPM Metrics & Altman Z-Score Formulations",
        "type": "concept",
        "description": "Formulate supplier evaluation systems: analyze Weighted Point Rating Systems across multi-attribute criteria; mathematically formulate Parts Per Million (PPM) defect rates and capability metrics; formulate Edward Altman's 1968 and 1983 Multiple Discriminant Analysis (MDA) Z-Score models for public and private manufacturing firms; evaluate the financial accounting ratios (Working Capital, Retained Earnings, EBIT, Market Leverage, Asset Turnover) and their distress thresholds.",
        "rubric": "Step-by-step mathematical formulation of the Altman Z-score MDA equations; complete derivation of PPM quality metric calculus; formal specification of weighted point vendor evaluation matrices."
      },
      {
        "title": "The Low-Bid Bankrupt Machine Shop & $8M Program Delay Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of an aerospace contractor's $8M loss resulting from awarding a sole-source contract to a low-bid supplier that went bankrupt: analyze procurement evaluation matrices, supplier audited balance sheets, bankruptcy court filings, and production delay penalty invoices; prove how omitting financial health auditing caused the disaster; author an institutional supplier pre-qualification standard.",
        "rubric": "Audit historical vendor bidding evaluation files against financial statement records; expose the omission of solvency scoring; deliver an enterprise supplier qualification standard."
      },
      {
        "title": "Building an Enterprise Supplier Scorecard & Financial Risk Suite in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Supplier Evaluation Suite in Python: 1) Ingest multi-vendor delivery and quality inspection datasets; 2) Compute PPM defect rates and delivery OTIF metrics; 3) Compute Altman Z-Scores and Ohlson O-Scores from balance sheet inputs; 4) Automatically classify suppliers into Safe, Grey, and Distress risk tiers; 5) Generate executive supplier performance scorecards and automated risk mitigation recommendations.",
        "rubric": "Working Python supplier evaluation engine; verified PPM and Altman Z-score calculations; accurate financial risk zone classification; clear executive scorecard generation."
      },
      {
        "title": "Tier-1 Sole Supplier Insolvency & Tooling Evacuation 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when an alert indicates your primary wiring harness supplier has abruptly padlocked its gates due to a bank seizure of its assets, threatening an immediate automotive assembly shutdown within 48 hours: detect the facility seizure; invoke contractual bailment ownership clauses for company-owned production tooling; coordinate legal and logistics teams to safely evacuate tooling; transfer production to backup suppliers.",
        "rubric": "Rapid legal and logistics execution of tooling bailment recovery; coordinate emergency asset transport to pre-qualified backup suppliers; restore production continuity within 24 hours."
      }
    ]
  },
  {
    "day": 23,
    "month": 1,
    "blockNum": 5,
    "title": "Procurement Negotiations, Reverse Auctions & Smart Contracts: Game-Theoretic Bidding & Penalty Escrows",
    "stageName": "Stage 3: Strategic Sourcing, Lean Six Sigma, Working Capital & Capstone 1",
    "stageNum": 3,
    "pedagogicalRole": "Procurement Game Theory, Auction Mechanics & Programmatic Contract Escrow",
    "spokenGoal": "Procurement negotiations are not emotional battles of charisma; they are structured games of information economics and mechanism design. When buying billions of dollars in freight, raw materials, or IT services, the mechanism you use to elicit prices determines whether you capture massive savings or fall victim to supplier collusion. Today we engineer Procurement Negotiations, Reverse Auctions & Smart Contract Escrows. We analyze auction mechanics from game theory: English Reverse Auctions (dynamic descending bids), Dutch Reverse Auctions, and Vickrey Second-Price Sealed-Bid Auctions. We formulate multi-attribute reverse auctions evaluating both price and quality PPM. Crucially, we master Programmatic Contract Escrows: binding delivery milestones and quality inspection gates directly to automated bank release ledgers.",
    "conceptInvariant": "Mechanism Design & Multi-Attribute Reverse Auction Invariant: In an n-supplier reverse auction, bidding mechanism design must satisfy dominant-strategy incentive compatibility: Bid_i* = Cost_i; in Multi-Attribute Reverse Auctions, supplier bids are scored via a composite utility function: Score_i = w_p * (1 - Price_i / P_max) + w_q * Quality_score_i + w_d * Delivery_score_i; winning supplier satisfies Max Score_i; contract funds are locked in programmatic escrow: Escrow_release = f(WMS_Receipt, Quality_Inspection_Pass, Delivery_on_time); contractual penalty clauses deduct liquidated damages autonomously.",
    "failureMode": "A municipality procures $30,000,000 of highway asphalt using an unvetted open English reverse auction. Three regional asphalt suppliers secretly collude via signaling, intentionally maintaining bids at inflated price ceilings. Furthermore, the contract lacks performance escrow mechanisms. When the winning contractor delivers subpar crumbly asphalt that fails winter freeze-thaw cycles, the contractor has already collected 100% of payment. The city is forced to spend $12,000,000 re-paving roads out of taxpayer funds while embroiled in years of litigation.",
    "tryItFriction": "Build an Enterprise Multi-Attribute Reverse Auction & Contract Escrow Engine in Python: 1) Model supplier bidding behaviors with private cost structures and quality capabilities; 2) Implement an English Descending Clock Reverse Auction with bid increment rules; 3) Implement a Multi-Attribute Scoring Auction balancing price, delivery lead time, and historical quality PPM; 4) Implement an automated Contract Escrow State Machine that locks contract funds and releases milestone payments only upon verified WMS receipt and quality inspection sign-off; 5) Detect bid-rigging and collusive signaling patterns.",
    "socraticHints": [
      "Why is a pure price-only reverse auction dangerous for procuring complex industrial goods or services?",
      "Because suppliers desperate to win will bid below their true cost (the Winner's Curse), and then aggressively cut corners on materials, delivery reliability, and post-sale support to survive.",
      "A Multi-Attribute Reverse Auction scores suppliers on total utility (price, quality PPM, delivery lead time, warranty), ensuring the lowest total cost of ownership wins rather than the cheapest defective corner-cutter."
    ],
    "situationalPuzzle": {
      "scenario": "You are running a Multi-Attribute Reverse Auction for 50,000 machined valves. Scoring weights: Price = 60%, Quality PPM = 30%, Delivery Lead Time = 10%. Supplier A bids $40/valve, historical defect rate = 500 PPM, Lead time = 6 weeks. Supplier B bids $48/valve, historical defect rate = 20 PPM, Lead time = 2 weeks. The scoring formula normalizes price against a $60 baseline: Score_price = 60 * (1 - Price / 60). Score_quality = 30 * (1 - PPM / 1000). Score_delivery = 10 * (1 - LeadTime / 10). Which supplier wins the contract, and why?",
      "options": [
        "Supplier A wins because their price is $8 cheaper per valve.",
        "Calculate multi-attribute scores step by step: 1) Supplier A: Score_price = 60 * (1 - 40/60) = 60 * (1/3) = 20.0 pts. Score_quality = 30 * (1 - 500/1000) = 30 * 0.5 = 15.0 pts. Score_delivery = 10 * (1 - 6/10) = 10 * 0.4 = 4.0 pts. Total Score A = 20.0 + 15.0 + 4.0 = 39.0 points! 2) Supplier B: Score_price = 60 * (1 - 48/60) = 60 * 0.2 = 12.0 pts. Score_quality = 30 * (1 - 20/1000) = 30 * 0.98 = 29.4 pts. Score_delivery = 10 * (1 - 2/10) = 10 * 0.8 = 8.0 pts. Total Score B = 12.0 + 29.4 + 8.0 = 49.4 points! Supplier B wins by more than 10 points! Supplier B's near-zero defect rate and 2-week lead time far outweigh Supplier A's superficial price discount, protecting total cost of ownership!",
        "Both suppliers tie.",
        "Cancel the auction and negotiate over dinner."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In a multi-attribute auction, superior quality and rapid delivery easily overcome minor unit price premiums. Supplier B scored 49.4 points vs 39.0 points for Supplier A. Awarding to Supplier B eliminates scrap, prevents line stoppages, and delivers massive operational savings."
    },
    "quests": [
      {
        "title": "Mechanism Design, Game-Theoretic Reverse Auctions & Multi-Attribute Formulations",
        "type": "concept",
        "description": "Formulate procurement mechanism design: analyze game-theoretic auction types (First-Price Sealed-Bid, Vickrey Second-Price, English Descending Clock, Dutch Ascending Clock); formulate the Winner's Curse and risk mitigation strategies; mathematically formulate Multi-Attribute Reverse Auctions (MARA) with quasi-linear scoring utility functions; derive statistical algorithms for detecting supplier collusive bid-rigging (bidding rings, cover bidding, and rotation schemes).",
        "rubric": "Step-by-step mathematical formulation of multi-attribute scoring functions; formal game-theoretic proof of dominant strategy incentive compatibility; complete statistical tests for bid collusion detection."
      },
      {
        "title": "The Collusive Asphalt Ring & $12M Repaving Catastrophe Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a municipal infrastructure authority's $12M loss resulting from an unmonitored reverse auction and lack of performance escrow: analyze historical procurement bidding logs, contractor bidding timestamps, asphalt core quality failure lab reports, and contractor bank payment releases; prove how collusive bidding and un-gated payments caused the failure; author an institutional procurement auction governance standard.",
        "rubric": "Audit historical bidding log time series to uncover collusive price-fixing patterns; expose the lack of milestone-gated payment escrows; deliver an enterprise procurement mechanism design standard."
      },
      {
        "title": "Building an Enterprise Multi-Attribute Reverse Auction & Escrow Suite in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Multi-Attribute Reverse Auction & Escrow Engine in Python: 1) Model multi-supplier bidding agents with private cost and quality attributes; 2) Build an interactive Multi-Attribute Reverse Auction platform scoring price, PPM, and lead times in real-time; 3) Implement statistical collusion detection algorithms analyzing bid variance; 4) Build a programmatic Contract Milestone Escrow engine releasing funds only upon verified quality and delivery receipts; 5) Output an executive procurement audit trail.",
        "rubric": "Working Python auction and escrow suite; verified multi-attribute utility scoring; functional collusion detection; automated milestone-gated payment release logic."
      },
      {
        "title": "Supplier Extortion & Source Code / Cad Drawing Escrow Release 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when a strategic manufacturing contractor withholds proprietary tooling CAD files and firmware source code during a contract renegotiation dispute, threatening to halt your global product launch: detect the contract breach; invoke contractual Legal Software & CAD Escrow release protocols; authenticate technical assets from the independent escrow vault; transfer manufacturing to alternative fabricators.",
        "rubric": "Rapid legal and technical verification of escrow breach conditions; trigger automated technical asset extraction from third-party escrow vaults; restore manufacturing within 24 hours."
      }
    ]
  },
  {
    "day": 24,
    "month": 1,
    "blockNum": 5,
    "title": "Reverse Logistics, Circular Economy & Closed-Loop Supply Chains: RMA Workflows, Remanufacturing & WEEE Compliance",
    "stageName": "Stage 3: Strategic Sourcing, Lean Six Sigma, Working Capital & Capstone 1",
    "stageNum": 3,
    "pedagogicalRole": "Reverse Logistics Architecture, Circular Supply Chains & Asset Remanufacturing Economics",
    "spokenGoal": "Supply chains do not end when a customer opens a package; in e-commerce, consumer electronics, and automotive, between 15% and 35% of all products flow in reverse. If your reverse logistics pipeline treats returns as unwanted trash, you destroy gross margin and bleed millions into landfills. Today we engineer Reverse Logistics, Circular Economy & Closed-Loop Supply Chains. We master the Return Merchandise Authorization (RMA) lifecycle. We engineer the 5R Triage Economics: Resell as New, Refurbish/Remanufacture, Cannibalize for Spare Parts, Recycle for Raw Materials, or Scrap. We formulate the mathematical economics of closed-loop product returns, core deposits, and European WEEE (Waste from Electrical and Electronic Equipment) environmental compliance.",
    "conceptInvariant": "Reverse Logistics Triage & Residual Value Recovery Invariant: Returned asset value recovery must follow the optimal disposition decision rule: Disposition = ArgMax_d { Net_Recovery_Value_d }; where Net_Recovery_Value(Resell) = Price_open_box - Cost_inspect; Net_Recovery_Value(Remanufacture) = Price_reman - Cost_repair - Cost_parts; Net_Recovery_Value(Harvest) = sum(Part_value) - Cost_disassembly; Net_Recovery_Value(Scrap) = Material_recycle_value - Cost_shred; total reverse processing cycle time must satisfy: Cycle_time_RMA <= 5_days to prevent rapid consumer electronics depreciation (typically 1-2% value decay per week).",
    "failureMode": "A consumer electronics retailer receives $40,000,000 in customer returns of laptops, televisions, and tablets annually. Returns are dumped into un-sorted gaylord boxes in a warehouse corner without automated RMA triage. Boxes sit unprocessed for an average of 14 weeks. Due to rapid consumer electronics depreciation (1.5%/week), the products lose 21% of their residual resale value ($8,400,000 loss). Furthermore, 12,000 items with minor packaging scuffs are blindly liquidated for pennies on the dollar to jobbers, destroying $5,200,000 in potential refurbished margin. Total reverse logistics bleed: $13,600,000.",
    "tryItFriction": "Build an Enterprise Reverse Logistics & Circular Economy Triage Engine in Python: 1) Model incoming return merchandise with defect codes, cosmetic conditions, and age; 2) Implement an algorithmic 5R Disposition Decision Engine maximizing net residual value recovery; 3) Model weekly electronic product depreciation curves; 4) Implement core deposit tracking for remanufactured automotive/industrial components; 5) Compute circular economy sustainability metrics (landfill diversion percentage, carbon offset tons).",
    "socraticHints": [
      "Why is processing speed (cycle time) the single most critical variable in consumer electronics reverse logistics?",
      "Because consumer electronics depreciate rapidly—losing between 1% and 2% of their retail market value every single week as newer models arrive.",
      "A laptop processed and relisted as certified refurbished in 4 days captures 80% of original retail value; that same laptop sitting in an un-sorted returns corner for 4 months captures less than 35%."
    ],
    "situationalPuzzle": {
      "scenario": "A returned gaming laptop originally sold for $2,000. Customer returned it with a cracked screen; the motherboard and GPU are in perfect working order. The returns manager has 3 options: 1) Liquidate as-is to a wholesale salvage liquidator for 15% of retail ($300); 2) Remanufacture: replace screen (part cost = $150, technician labor = $100) and sell as Certified Refurbished for $1,400; 3) Harvest parts: extract GPU and motherboard to sell as spare parts for $850 (disassembly labor = $50). Which disposition decision maximizes net recovery value, and by how much over wholesale liquidation?",
      "options": [
        "Option 1 (Liquidate) because it requires zero labor.",
        "Calculate net value recovery for each disposition: 1) Option 1 (Liquidation): Net Recovery = $300 flat. 2) Option 2 (Remanufacture): Resale = $1,400. Total Cost = Part ($150) + Labor ($100) = $250. Net Recovery = $1,400 - $250 = $1,150! 3) Option 3 (Harvest Parts): Resale = $850. Cost = $50. Net Recovery = $850 - $50 = $800. 4) Comparison: Option 2 (Remanufacture) delivers $1,150 in net cash recovery, beating salvage liquidation by $850 per laptop (a 283% increase in value recovery)! Across 10,000 returned laptops, that decision captures $8,500,000 in incremental gross profit!",
        "Option 3 is best because selling spare parts is always cheaper.",
        "Throw the laptop in the landfill to save labor."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Automated reverse logistics triage inspects returned items to identify the profit-maximizing disposition path. Spending $250 to replace a screen yields a $1,400 Certified Refurbished sale, generating $1,150 in net recovered value—nearly four times the $300 salvage liquidation payout."
    },
    "quests": [
      {
        "title": "Reverse Logistics Architecture, Circular Economics & 5R Triage Formulations",
        "type": "concept",
        "description": "Formulate reverse logistics and circular supply chain engineering: analyze the complete Return Merchandise Authorization (RMA) lifecycle; formulate the 5R disposition optimization algorithm (Resell, Refurbish, Remanufacture, Harvest, Recycle); mathematically formulate continuous product depreciation step-curves; analyze closed-loop supply chains with core return deposits; evaluate environmental compliance mandates (EU WEEE directive, RoHS, Extended Producer Responsibility EPR).",
        "rubric": "Step-by-step mathematical formulation of the 5R disposition decision objective; complete architectural state machine for closed-loop reverse logistics; formal regulatory analysis of WEEE and EPR compliance."
      },
      {
        "title": "The Forgotten Gaylord Corner & $13.6M Depreciation Bleed Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a consumer electronics retailer's $13.6M loss resulting from unmanaged returns sitting in warehouse corners for 14 weeks: analyze RMA transaction logs, secondary market resale pricing curves, liquidation jobber settlement receipts, and landfill e-waste disposal records; prove how lack of rapid reverse triage destroyed recovered value; author an institutional circular logistics standard.",
        "rubric": "Audit return intake timestamps against resale recovery proceeds; expose the depreciation and blind liquidation losses; deliver an enterprise reverse logistics and RMA triage standard."
      },
      {
        "title": "Building an Enterprise Reverse Logistics & Circular Triage Suite in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Reverse Logistics & Circular Economy Platform in Python: 1) Ingest customer return RMA feeds with inspection grade codes and age telemetry; 2) Implement an algorithmic 5R disposition engine dynamically routing returns to Resell, Refurbish, Harvest, or Recycle; 3) Compute real-time product depreciation and residual market value; 4) Model remanufacturing bill of materials and core deposit accounting; 5) Output circular economy sustainability ledgers (landfill diversion, recovered revenue).",
        "rubric": "Working Python reverse logistics engine; verified 5R disposition optimization logic; accurate electronic depreciation modeling; clear circular economy reporting."
      },
      {
        "title": "Lithium-Ion Battery Thermal Runaway in Returns Hub 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when a damaged lithium-ion battery in an un-inspected customer return package suffers thermal runaway in your primary reverse logistics staging center, triggering fire alarms and sprinkler discharges that threaten $5,000,000 of returned inventory: detect the hazard; trigger automated hazardous material isolation and fire suppression protocols; re-route inbound customer returns to secondary facilities; update hazardous returns intake procedures.",
        "rubric": "Rapid execution of hazardous material safety protocol; isolate fire-damaged returns and re-route reverse intake to secondary certified hazmat facilities within 20 minutes."
      }
    ]
  },
  {
    "day": 25,
    "month": 1,
    "blockNum": 5,
    "title": "Milestone 5: ApexSourcing Enterprise Supplier Intelligence & Procurement Suite",
    "stageName": "Stage 3: Strategic Sourcing, Lean Six Sigma, Working Capital & Capstone 1",
    "stageNum": 3,
    "pedagogicalRole": "Strategic Procurement Synthesis, Multi-Attribute Auctions & Circular Sourcing Architecture",
    "spokenGoal": "Milestone 5 is the strategic procurement and circular supply chain synthesis of Stage 3 Block 5! Today, you synthesize Kraljic Portfolio Spend Analysis (Day 21), Supplier Auditing & Altman Z-Score Insolvency Prediction (Day 22), Multi-Attribute Reverse Auctions & Escrow Contracts (Day 23), and Reverse Logistics 5R Circular Triage (Day 24) into an enterprise procurement platform: ApexSourcing. You will engineer an end-to-end supplier intelligence suite that segments billions in enterprise spend, audits vendor quality and financial distress risks, executes multi-attribute reverse auctions that balance price against quality, and manages circular return recovery. Zero single-sourced catastrophic failures, zero insolvent suppliers, maximum total value recovery.",
    "conceptInvariant": "ApexSourcing Integrated Procurement Invariant: Enterprise sourcing decisions must satisfy multi-tier governance: Spend_Classify(Kraljic_Quadrant) -> Supplier_Audit(PPM <= Threshold, Z_Score >= 1.81) -> Contract_Award(Multi_Attribute_Utility_Max) -> Escrow_Gating(Quality_Inspected == True) -> Reverse_Triage(5R_Value_Max); zero unhedged sole-source awards to Distress-zone suppliers; 100% automated contract milestone payment gating.",
    "failureMode": "An industrial manufacturing conglomerate manages $400,000,000 in procurement spend through decentralized buyer emails, un-audited vendor files, and zero reverse logistics tracking. A sole-source vendor with an undisclosed Z-Score of 1.2 enters bankruptcy, shutting down 3 assembly plants, while returns are liquidated for pennies on the dollar and competitive auctions are ignored. The company bleeds $28,000,000 in unhedged supply chain disruptions and procurement waste.",
    "tryItFriction": "Build and Validate the Complete ApexSourcing Production Suite in Python: 1) Classify multi-tier enterprise spend into the 4 Kraljic quadrants; 2) Compute supplier performance scorecards with quality PPM and Altman Z-Scores; 3) Conduct a live Multi-Attribute Reverse Auction selecting winning suppliers based on total utility; 4) Implement an automated milestone-gated payment escrow system; 5) Process a batch of returned assets through the 5R circular disposition engine; 6) Generate executive procurement savings and supplier risk reports.",
    "socraticHints": [
      "Why must strategic procurement encompass both the forward sourcing of components AND the reverse recovery of returned assets?",
      "Because returned goods, warranty cores, and refurbished components represent the cheapest, highest-margin source of manufacturing materials; in a circular economy, today's return is tomorrow's raw material.",
      "ApexSourcing closes the loop between external supplier purchasing and internal circular asset recovery."
    ],
    "situationalPuzzle": {
      "scenario": "During Milestone 5 integration testing of ApexSourcing, the procurement engine processes a $15,000,000 tender for custom transmission assemblies. The lowest bidder is Vendor Omega ($11.5M, a $3.5M savings). However, ApexSourcing's automated audit module flags: 1) Vendor Omega Altman Z-Score = 1.45 (Severe Distress); 2) Vendor Omega PPM = 850 PPM (Unacceptable). The procurement VP asks: 'Can we override the system to capture the $3.5M budget savings?' How must ApexSourcing respond?",
      "options": [
        "Approve the override immediately to hit quarterly budget targets.",
        "ApexSourcing Hard Governance Invariant Triggered: HARD REJECTION! The system must block the contract award! A Z-Score of 1.45 indicates imminent bankruptcy, and 850 PPM will inflict millions in factory floor scrap! Overriding the system to chase a paper $3.5M discount will inevitably cause a catastrophic multi-million dollar plant shutdown when Vendor Omega collapses! The contract must be awarded to the highest-scoring qualified vendor in the Safe Zone (Z > 2.99, PPM < 50), or Vendor Omega must secure a bank performance bond and pass mandatory quality remediation before consideration!",
        "Award 50% of the contract to Vendor Omega as an experiment.",
        "Change the Z-score threshold to 1.0 to make Vendor Omega look healthy."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Enterprise procurement software exists specifically to prevent executives from taking catastrophic short-term risks to hit quarterly budgets. Awarding a $15M contract to an insolvent vendor with terrible quality PPM is financial suicide. ApexSourcing enforces deterministic guardrails that protect the enterprise from bankrupt suppliers."
    },
    "quests": [
      {
        "title": "ApexSourcing Architectural Specification & Closed-Loop Procurement Formulations",
        "type": "concept",
        "description": "Formulate the comprehensive architectural specification of ApexSourcing: synthesize Kraljic portfolio segmentation, Altman Z-Score bankruptcy prediction, multi-attribute mechanism design, programmatic milestone escrow, and 5R reverse logistics triage into a unified system architecture; derive mathematical proofs of total cost of ownership minimization.",
        "rubric": "Master-level architectural blueprint of the enterprise procurement suite; formal mathematical formulations uniting forward sourcing and reverse circular recovery; complete system state flow diagrams."
      },
      {
        "title": "The Decentralized Buyer Chaos & $28M Supply Disruption Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a manufacturing conglomerate's $28M loss resulting from un-audited sole-source vendor bankruptcies, lack of reverse auctions, and discarded returns: analyze enterprise ERP purchasing records, vendor financial distress filings, assembly plant shutdown ledgers, and salvage liquidation contracts; prove how lack of integrated sourcing governance caused the collapse; author an institutional procurement charter.",
        "rubric": "Audit historical purchasing contracts against vendor solvency and quality records; expose systemic sourcing governance vulnerabilities; deliver an enterprise procurement and risk standard."
      },
      {
        "title": "Building the Complete ApexSourcing Production Suite in Python",
        "type": "mastery",
        "description": "Engineer the complete ApexSourcing Production Suite in Python: 1) Ingest enterprise spend files and segment into Kraljic quadrants; 2) Compute PPM defect rates and Altman Z-Scores; 3) Execute a Multi-Attribute Reverse Auction selecting winning vendors by total utility; 4) Implement an automated milestone-gated payment escrow engine; 5) Process returned assets through the 5R circular disposition engine; 6) Demonstrate 15%+ procurement savings, zero insolvent vendor awards, and 60%+ circular value recovery.",
        "rubric": "Complete working Python sourcing platform; verified integration across all four core modules; mathematically proven risk mitigation; audit-ready executive telemetry reports."
      },
      {
        "title": "Hostile Supplier Takeover & Commercial Blackmail 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when a competitor secretly acquires your sole-source strategic component supplier in a hostile corporate takeover and announces the immediate cancellation of your supply contract within 30 days: detect the ownership change; trigger contractual Change-of-Control clauses; activate secondary qualified manufacturing partners; execute emergency safety stock purchases to bridge the transition.",
        "rubric": "Rapid legal and supply chain response to supplier ownership change; execute emergency inventory bridging and secondary supplier onboarding within 24 hours."
      }
    ]
  },
  {
    "day": 26,
    "month": 1,
    "blockNum": 6,
    "title": "Lean Operations, Waste Elimination & Value Stream Mapping (VSM): Ohno's 7 Wastes, Takt Time & SMED",
    "stageName": "Stage 3: Strategic Sourcing, Lean Six Sigma, Working Capital & Capstone 1",
    "stageNum": 3,
    "pedagogicalRole": "Lean Operations Engineering, Value Stream Mapping & Setup Reduction Physics",
    "spokenGoal": "In operations, value is only what the customer is willing to pay for; everything else is waste (Muda). Taiichi Ohno, the genius architect of the Toyota Production System, identified the 7 deadly wastes of manufacturing: Overproduction, Waiting, Transportation, Inappropriate Processing, Excess Inventory, Unnecessary Motion, and Defects. Today we engineer Lean Operations, Waste Elimination & Value Stream Mapping (VSM). We construct current-state and future-state Value Stream Maps, calculating Process Cycle Efficiency (PCE). We calibrate Takt Time: the heartbeat of the factory synchronizing production pace to customer demand. Crucially, we engineer Shigeo Shingo's Single-Minute Exchange of Die (SMED): converting internal machine setup steps into external steps to collapse changeover times from 4 hours to under 10 minutes, unlocking economical small-batch production.",
    "conceptInvariant": "Takt Time Synchronization & Lean Efficiency Invariant: Factory production rhythm must match Takt Time: Takt_Time = Available_Work_Time_per_Shift / Customer_Demand_per_Shift; Cycle time at every manufacturing work station must be leveled to satisfy: Cycle_time_i <= Takt_Time; Process Cycle Efficiency (PCE) equals Value-Add Time divided by Total Lead Time: PCE = Total_VA_Time / Total_Lead_Time (typically < 5% in un-leaned plants, > 25% in world-class Lean plants); SMED methodology converts internal setup to external setup: Setup_Time_SMED < 10_minutes.",
    "failureMode": "A medical diagnostics device manufacturer produces testing cartridges in massive monthly batches of 50,000 units to amortize a brutal 6-hour machine changeover setup time. The plant's Process Cycle Efficiency is a dismal 1.8% (testing cartridges sit in queue bins for 26 days to receive 8 minutes of actual assembly). When a reagent formula change is approved, the factory holds 45,000 obsolete cartridges in queue, forcing a $1,800,000 scrap write-off. Furthermore, customer lead times stretch to 6 weeks, causing hospital clients to defect to competitors.",
    "tryItFriction": "Build an Enterprise Value Stream Mapping (VSM) & SMED Optimization Simulator in Python: 1) Model a multi-stage manufacturing line with workstation cycle times, changeover times, and queue buffer sizes; 2) Compute Takt Time based on customer demand and shift schedules; 3) Compute Process Cycle Efficiency (PCE) and Little's Law lead times; 4) Simulate SMED changeover reduction: separate internal vs external setup tasks, converting setup from 240 mins to 9 mins; 5) Demonstrate the collapse of batch sizes, shop-floor WIP, and lead times from 26 days to 3 days.",
    "socraticHints": [
      "Why is Overproduction universally classified by Taiichi Ohno as the worst of the 7 deadly wastes?",
      "Because overproduction creates and conceals all the other wastes: it creates excess inventory, consumes floor space, requires extra transport, causes defects to multiply silently, and ties up working capital.",
      "Eliminating overproduction forces operational problems to the surface so they can be solved immediately."
    ],
    "situationalPuzzle": {
      "scenario": "A medical instrument factory operates an 8-hour shift (480 minutes) with two 15-minute breaks and a 30-minute lunch (Total available work time = 480 - 15 - 15 - 30 = 420 minutes = 25,200 seconds). Daily customer demand is 350 instruments. The assembly line has 4 workstations with cycle times: Station 1 = 65 sec, Station 2 = 78 sec, Station 3 = 85 sec, Station 4 = 55 sec. What is the Takt Time, which station is the bottleneck violating Takt Time, and what happens to customer orders?",
      "options": [
        "Takt time is 100 seconds; all stations are fine.",
        "Calculate step by step: 1) Takt Time = Available Operating Seconds / Daily Demand = 25,200 seconds / 350 units = 72.0 seconds per unit! The factory must produce 1 instrument every 72 seconds to meet customer demand! 2) Station 1 (65s) < 72s (OK). Station 2 (78s) > 72s (VIOLATION)! Station 3 (85s) > 72s (SEVERE BOTTLENECK VIOLATION)! Station 4 (55s) < 72s (OK). 3) Impact: Because Station 3 takes 85 seconds, the line can only produce 25,200 / 85 = 296 units per shift (54 units short of demand every single day)! The factory will miss customer orders or be forced into 1.5 hours of daily emergency overtime unless Station 2 and 3 are re-balanced!",
        "Takt time is 50 seconds.",
        "Takt time does not apply to assembly lines."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Takt time (72 seconds) sets the required drumbeat of the factory. Workstations taking longer than 72 seconds (Station 2 at 78s and Station 3 at 85s) cannot keep up with customer demand, creating WIP bottlenecks and producing a 54-unit daily shortage. Lean line balancing must reallocate tasks from Stations 2 and 3 to Stations 1 and 4."
    },
    "quests": [
      {
        "title": "Lean Manufacturing Theory, Value Stream Mapping & SMED Formulations",
        "type": "concept",
        "description": "Formulate Lean manufacturing systems engineering: analyze Taiichi Ohno's 7 Wastes (Muda) and Muri/Mura operational variability; formulate Value Stream Mapping (VSM) mathematical metrics (Process Cycle Efficiency PCE = VA / LeadTime, Rolled First-Pass Yield RTY); derive Takt Time and line-balancing pitch equations; formulate Shigeo Shingo's Single-Minute Exchange of Die (SMED) 4-stage setup reduction methodology (separating internal from external setup, standardizing function, converting internal to external).",
        "rubric": "Step-by-step mathematical formulation of Takt Time, line-balancing efficiency, and PCE; complete architectural breakdown of current-state to future-state VSM transformations; formal SMED setup reduction methodology."
      },
      {
        "title": "The 6-Hour Setup Trap & $1.8M Cartridge Scrap Catastrophe Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a medical device manufacturer's $1.8M scrap write-off resulting from massive batch production driven by un-leaned 6-hour machine changeover times: analyze machine maintenance setup logs, shop-floor WIP inventory tags, Engineering Change Orders, and scrap disposal records; prove how large-batch overproduction caused obsolescence; author an institutional Lean SMED modernization standard.",
        "rubric": "Audit machine changeover downtime logs against scrap write-off histories; expose the large-batch overproduction flaw; deliver an enterprise Lean manufacturing and setup reduction standard."
      },
      {
        "title": "Building an Enterprise Value Stream Mapping & SMED Simulator in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Lean Operations Simulation Suite in Python: 1) Model a multi-stage manufacturing production line with process times, changeover times, and queue buffers; 2) Compute Takt Time, line-balancing balance delays, and Process Cycle Efficiency; 3) Implement automated SMED setup reduction simulation decomposing setup tasks; 4) Model the transition from massive batch production to small-lot continuous flow; 5) Demonstrate 80%+ reduction in manufacturing lead times and WIP inventory.",
        "rubric": "Working Python Lean simulation engine; verified Takt Time and PCE calculations; accurate SMED setup reduction modeling; clear comparative lead-time visualization."
      },
      {
        "title": "Assembly Line Bottleneck Starvation & Line Halt 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when an un-leaned material transfer delay starves the primary final assembly line for 45 minutes, halting production of high-margin surgical systems during peak customer order backlog: detect the line starvation; implement emergency andon cord line-balancing protocols; re-allocate upstream feeder sub-assemblies; restore continuous flow within 15 minutes.",
        "rubric": "Rapid detection of assembly line starvation; execute andon cord escalation and dynamic workstation task re-balancing; restore continuous production flow within 15 minutes."
      }
    ]
  },
  {
    "day": 27,
    "month": 1,
    "blockNum": 6,
    "title": "Kanban Systems & Pull Production Physics: Toyota Production System (TPS), Card Calculus & Heijunka Leveling",
    "stageName": "Stage 3: Strategic Sourcing, Lean Six Sigma, Working Capital & Capstone 1",
    "stageNum": 3,
    "pedagogicalRole": "Pull Production Systems, Kanban Calculus & Production Leveling Architecture",
    "spokenGoal": "Traditional push production is a disaster: ERP schedules orders based on theoretical forecasts, pushing pallets onto the factory floor regardless of whether the downstream station is ready. Toyota revolutionized the world by inventing Pull Production and Kanban. In a pull system, no part is ever produced until the downstream customer consumes one and sends an empty container with a Kanban card back upstream. Today we engineer Kanban Systems & Pull Production Physics. We formulate the mathematical Kanban Card Calculus: sizing the exact number of Kanban cards required to maintain flow without excess inventory. We engineer Production Leveling (Heijunka): smoothing product mix and volume using Heijunka boxes to eliminate the violent whiplash of batch spikes.",
    "conceptInvariant": "Kanban Circulation & Pull Conservation Invariant: Total inventory in a Kanban-controlled loop is strictly bounded by the total number of circulating cards K: Total_Inventory <= K * Container_Capacity (C); required number of Kanban cards satisfies the Toyota formula: K = ceil( (Demand_rate * Lead_Time * (1 + Safety_Factor_alpha)) / Container_Capacity ); material movement is prohibited without an attached authorized Kanban card: Production_authorized == Card_present; Heijunka leveling enforces mixed-model sequencing (e.g. A-B-A-B rather than A-A-A-A-B-B-B-B) to minimize downstream demand amplification.",
    "failureMode": "A commercial heating equipment manufacturer attempts implementing Kanban on the shop floor without calculating card sizes or enforcing card discipline. Workers treat Kanban cards as casual suggestions, continuing to produce parts without cards to 'keep busy'. Card counts balloon from 12 to 85 unauthorized cards per station. The shop floor floods with $3,400,000 of unneeded heat exchanger coils that block forklifts. When a design modification occurs, 600 un-tracked coils must be reworked by hand ($420,000 cost), and the plant manager abandons Kanban, falsely claiming 'Lean doesn't work in our industry.'",
    "tryItFriction": "Build an Enterprise Kanban Pull Production & Heijunka Leveling Simulator in Python: 1) Model a multi-stage pull production line with customer consumption events; 2) Implement the Toyota Kanban Card sizing algorithm computing optimal card counts K based on demand, lead time, and safety factors; 3) Enforce strict card circulation rules: empty container sends card upstream, trigger production, attach card to full container, return downstream; 4) Implement Heijunka mixed-model production leveling; 5) Compare shop-floor WIP and stockout resilience under Push vs Pull production.",
    "socraticHints": [
      "What is the mathematical purpose of the Safety Factor alpha in the Kanban card formula K = [D * L * (1 + alpha)] / C?",
      "It represents a contingency buffer for operational friction—such as machine micro-stoppages, tool change delays, or slight demand surges; typically set between 0.10 and 0.30.",
      "As the factory eliminates waste and stabilizes machine reliability (TPM), management deliberately removes Kanban cards (reducing alpha), lowering the water level to expose remaining rocks (hidden inefficiencies)."
    ],
    "situationalPuzzle": {
      "scenario": "A precision sensor workstation consumes 80 sensors per hour. Production lead time to replenish a container of sensors (including fabrication, transit, and card handling) is 2.5 hours. Container capacity C = 25 sensors. Management establishes a safety factor alpha = 15% (0.15) to cover minor setup variations. How many Kanban cards K should be authorized in this production loop?",
      "options": [
        "2 cards are plenty.",
        "Calculate using the Toyota Kanban formula: 1) Total Demand during Lead Time = Demand_rate * Lead_Time = 80 sensors/hr * 2.5 hrs = 200 sensors. 2) Factoring in Safety: Demand * (1 + alpha) = 200 * (1 + 0.15) = 200 * 1.15 = 230 sensors. 3) Divide by Container Capacity: 230 / 25 = 9.2 containers. 4) Take the ceiling: ceil(9.2) = 10 Kanban cards! Exactly 10 cards must circulate in this loop! 10 cards * 25 sensors = 250 sensors maximum inventory, guaranteeing 100% material availability while capping WIP at exactly 250 units!",
        "100 cards to ensure zero stockouts.",
        "Kanban cards cannot be calculated with math."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In Kanban sizing, fractional containers must be rounded UP to the nearest integer to ensure the safety buffer is preserved: ceil(9.2) = 10 cards. With 10 cards of 25 units each, total inventory in the loop is strictly bounded at 250 units (just over 3 hours of supply), guaranteeing continuous production without inventory bloat."
    },
    "quests": [
      {
        "title": "Toyota Production System (TPS), Kanban Card Calculus & Heijunka Formulations",
        "type": "concept",
        "description": "Formulate pull production systems engineering: analyze the philosophical foundation of the Toyota Production System (TPS - Jidoka and Just-in-Time); mathematically derive the Toyota Kanban card sizing formula K = ceil(D*L*(1+alpha)/C); formulate CONWIP (Constant Work in Process) and POLCA (Paired-Cell Overlapping Loops of Cards with Authorization) control architectures; formulate Heijunka production leveling algorithms (EPEI - Every Part Every Interval calculus).",
        "rubric": "Step-by-step mathematical derivation of Kanban card sizing equations; complete state machine diagram for dual-card (Production and Withdrawal) Kanban loops; formal formulation of Heijunka leveling schedules."
      },
      {
        "title": "The Rogue Card Explosion & $3.8M Unauthorized WIP Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of an HVAC manufacturer's $3.8M loss resulting from undisciplined Kanban execution where workers produced parts without cards: analyze shop-floor WIP inventory tags, station cycle time telematics, physical container counts, and obsolete rework ledgers; prove how lack of card discipline destroyed pull control; author an institutional Lean pull production standard.",
        "rubric": "Audit physical container counts against authorized Kanban card registries; expose the unauthorized production breakdown; deliver an enterprise Kanban governance standard."
      },
      {
        "title": "Building an Enterprise Electronic Kanban (e-Kanban) & Heijunka Suite in Python",
        "type": "mastery",
        "description": "Engineer a production-ready e-Kanban & Pull Production Engine in Python: 1) Model multi-stage production work centers with consumption and replenishment queues; 2) Implement automated Toyota Kanban card sizing across variable demand and lead-time profiles; 3) Build an event-driven e-Kanban card tracking state machine (card dispatch, in-process, replenishment); 4) Implement Heijunka mixed-model scheduling smoothing daily production batches; 5) Demonstrate 60%+ reduction in shop-floor WIP compared to MRP push.",
        "rubric": "Working Python e-Kanban simulation suite; verified card calculation and circulation state machine; functional Heijunka leveling algorithm; demonstrated WIP reduction."
      },
      {
        "title": "Supplier RFID e-Kanban Signal Packet Drop & Line Starvation 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when an RFID antenna failure drops electronic Kanban signals for 40 consecutive bins of critical engine fasteners, causing upstream automated replenishment to stall and threatening an automotive engine assembly line stoppage within 30 minutes: detect the silent signal drop; execute an automated e-Kanban reconciliation sweep; dispatch emergency physical replenishment tuggers; restore pull circulation.",
        "rubric": "Rapid detection of missing e-Kanban heartbeats; execute automated signal reconciliation and emergency material delivery; prevent assembly stoppage within 15 minutes."
      }
    ]
  },
  {
    "day": 28,
    "month": 1,
    "blockNum": 6,
    "title": "Statistical Process Control (SPC) & Six Sigma DMAIC: Shewhart Charts, Cp/Cpk Capability & Gauge R&R",
    "stageName": "Stage 3: Strategic Sourcing, Lean Six Sigma, Working Capital & Capstone 1",
    "stageNum": 3,
    "pedagogicalRole": "Quality Engineering, Statistical Process Control & Six Sigma Capability Architecture",
    "spokenGoal": "In manufacturing and operations, variation is the enemy. A process can be 'within tolerance' today, but if its distribution drifts, defective parts will inevitably escape to customers. Six Sigma is the disciplined, data-driven methodology that drives defect rates down to 3.4 defects per million opportunities (DPMO). Today we engineer Statistical Process Control (SPC) & Six Sigma DMAIC (Define, Measure, Analyze, Improve, Control). We master Walter Shewhart's control charts: X-bar and R charts for continuous data, and p-charts for attribute defect rates. We calculate Process Capability indices: Cp (potential capability) and Cpk (actual capability accounting for process centering). Crucially, we audit measurement system error using Gauge Repeatability & Reproducibility (Gauge R&R) to ensure that the gauge itself isn't lying to us.",
    "conceptInvariant": "Process Capability & Statistical Control Invariant: Process is in statistical control if all subgroup means and ranges fall within Shewhart 3-sigma control limits: UCL/LCL = X_bar_bar +/- A2 * R_bar; Process Capability Cp measures spread: Cp = (USL - LSL) / (6 * sigma); Process Capability Cpk measures centering: Cpk = min( (USL - mu) / (3 * sigma), (mu - LSL) / (3 * sigma) ); Six Sigma quality mandates: Cpk >= 1.50 (long-term) or Cpk >= 2.00 (short-term); Measurement System Error (Gauge R&R %GRR) must satisfy: %GRR = (sigma_measurement / sigma_total) * 100 <= 10.0%.",
    "failureMode": "A medical syringe manufacturer machines plunger pins with an Upper Specification Limit of 10.05 mm and Lower Specification Limit of 9.95 mm (Tolerance = 0.10 mm). The process standard deviation is sigma = 0.012 mm, but the process mean drifts off-center to mu = 10.03 mm. The quality manager only checks Cp (which is 1.39) and assumes the process is capable. However, the true Cpk is only 0.56! Over 3 months, 24,000 oversized plungers jam inside syringe barrels, causing a nationwide FDA Class I medical device recall costing $6,200,000 in product destruction, regulatory penalties, and legal settlements.",
    "tryItFriction": "Build an Enterprise Statistical Process Control (SPC) & Six Sigma Engine in Python: 1) Ingest 1,000 manufacturing subgroup dimension measurements; 2) Compute Shewhart X-bar and R control charts with automated Western Electric / Nelson run rules; 3) Compute Process Capability indices (Cp, Cpk, Pp, Ppk); 4) Implement Gauge Repeatability & Reproducibility (Gauge R&R) ANOVA decomposition isolating equipment variance vs appraiser variance; 5) Generate executive Six Sigma quality capability dashboards.",
    "socraticHints": [
      "What is the critical difference between Cp and Cpk, and why is relying solely on Cp dangerous?",
      "Cp measures only the spread of the process relative to the specification width (can the process fit?), completely ignoring where the process is centered; Cpk accounts for process centering relative to the nearest specification limit.",
      "A process can have a brilliant Cp of 2.0 (very narrow distribution), but if its mean drifts outside the tolerance window, it will produce 100% defective scrap while reporting a high Cp."
    ],
    "situationalPuzzle": {
      "scenario": "A precision CNC shaft machining process has specifications: Upper Spec Limit (USL) = 50.10 mm, Lower Spec Limit (LSL) = 49.90 mm. Subgroup sampling reveals: Process Mean mu = 50.06 mm, Standard Deviation sigma = 0.02 mm. The plant manager calculates Cp = (50.10 - 49.90) / (6 * 0.02) = 0.20 / 0.12 = 1.67 and claims: 'Our process is running at Six Sigma quality!' What is the true Cpk, and is the plant manager's claim valid?",
      "options": [
        "The plant manager is correct; Cp = 1.67 is Six Sigma.",
        "Calculate true Cpk step by step: 1) Upper Capability: Cpu = (USL - mu) / (3 * sigma) = (50.10 - 50.06) / (3 * 0.02) = 0.04 / 0.06 = 0.67! 2) Lower Capability: Cpl = (mu - LSL) / (3 * sigma) = (50.06 - 49.90) / (3 * 0.02) = 0.16 / 0.06 = 2.67! 3) True Cpk = min(Cpu, Cpl) = min(0.67, 2.67) = 0.67! 4) Evaluation: The plant manager's claim is fatally flawed! While Cp is 1.67, the process has drifted dangerously close to the Upper Spec Limit (mu = 50.06 mm). A Cpk of 0.67 represents a terrible 2-Sigma process producing approximately 22,750 defects per million parts (2.3% scrap rate)! The process must be immediately re-centered to 50.00 mm!",
        "Cpk is 1.67 because mean drift is ignored.",
        "Specification limits do not apply to CNC machining."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Relying on Cp while ignoring off-center drift is an amateur mistake. Because the process mean (50.06) shifted toward the upper limit (50.10), the true Cpk is only 0.67. A Cpk < 1.0 indicates an incapable process actively spitting out thousands of defective parts."
    },
    "quests": [
      {
        "title": "Six Sigma DMAIC Architecture, Shewhart Statistical Control & Cpk Formulations",
        "type": "concept",
        "description": "Formulate statistical quality engineering: analyze the Six Sigma DMAIC (Define, Measure, Analyze, Improve, Control) framework; mathematically derive Shewhart X-bar and R control limits from subgroup sampling theory; derive Nelson run rules for detecting non-random process drift; mathematically formulate Cp, Cpk, Pp, and Ppk capability metrics; derive Gauge R&R ANOVA decomposition equations separating equipment repeatability from appraiser reproducibility.",
        "rubric": "Step-by-step mathematical derivation of Shewhart 3-sigma control limits; complete formulation of Cp vs Cpk capability equations; formal ANOVA derivation of Gauge R&R measurement system variance."
      },
      {
        "title": "The Drifted Syringe Plunger & $6.2M FDA Class I Recall Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a medical device company's $6.2M FDA Class I recall resulting from an off-center manufacturing process with a false Cp = 1.39 and true Cpk = 0.56: analyze factory quality inspection logs, micrometric measurement records, hospital adverse event reports, and FDA warning letters; prove how relying on Cp over Cpk allowed 24,000 jammed syringes into hospitals; author an institutional Six Sigma SPC standard.",
        "rubric": "Audit historical subgroup measurement logs against specification limits; expose the flawed capability analysis; deliver an enterprise Six Sigma statistical process control standard."
      },
      {
        "title": "Building an Enterprise SPC & Six Sigma Capability Suite in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Statistical Process Control Suite in Python: 1) Ingest continuous manufacturing inspection time series; 2) Generate Shewhart X-bar and R control charts with automated Nelson run rule violation tripwires; 3) Compute Cp, Cpk, Pp, and Ppk process capability indices with confidence intervals; 4) Implement an automated Gauge R&R ANOVA analyzer evaluating measurement system error; 5) Output an interactive Six Sigma quality dashboard.",
        "rubric": "Working Python SPC quality suite; verified X-bar and R chart calculations; automated Nelson rule violation alerting; accurate Cp/Cpk and Gauge R&R computations."
      },
      {
        "title": "Tool Wear Dimension Drift & Subgroup Out-of-Control 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when real-time SPC telemetry on a high-speed automotive shaft grinding line detects Nelson Rule 2 (9 consecutive points on one side of the center line) and Rule 1 (point outside UCL), indicating severe cutting tool wear that threatens 500 parts per hour with dimensional scrap: detect the out-of-control signal; trigger automated CNC feed-rate pausing; alert maintenance for automated tool offset compensation; verify Cpk recovery.",
        "rubric": "Rapid detection of SPC Nelson rule out-of-control conditions; execute automated machine feed hold and tool offset recalibration; verify Cpk > 1.50 within 15 minutes."
      }
    ]
  },
  {
    "day": 29,
    "month": 1,
    "blockNum": 6,
    "title": "Supply Chain Finance, Working Capital & Cash Conversion Cycle (CCC): DIO, DSO, DPO & Reverse Factoring",
    "stageName": "Stage 3: Strategic Sourcing, Lean Six Sigma, Working Capital & Capstone 1",
    "stageNum": 3,
    "pedagogicalRole": "Supply Chain Corporate Finance, Working Capital Engineering & Liquidity Architecture",
    "spokenGoal": "Operations and Corporate Finance are two sides of the same coin. A factory can produce award-winning products, but if its Cash Conversion Cycle (CCC) is 120 days, the company will suffocate from a liquidity crisis before collecting a dime from customers. Today we engineer Supply Chain Finance, Working Capital & Cash Conversion Cycle Optimization. We formulate the holy trinity of operational liquidity: Days Sales Outstanding (DSO), Days Inventory Outstanding (DIO), and Days Payables Outstanding (DPO). Formula: CCC = DIO + DSO - DPO. We evaluate the legendary negative working capital models of Apple and Dell (where suppliers fund the company's growth). Crucially, we engineer Supply Chain Financing (SCF) and Reverse Factoring, allowing suppliers to be paid on Day 5 via bank factoring while preserving 90-day DPO terms for the enterprise.",
    "conceptInvariant": "Cash Conversion Cycle & Working Capital Velocity Invariant: The Cash Conversion Cycle measures the net operational days required to convert inventory investments back into cash: CCC = DIO + DSO - DPO; Days Inventory Outstanding DIO = (Average_Inventory / Annual_COGS) * 365; Days Sales Outstanding DSO = (Accounts_Receivable / Annual_Revenue) * 365; Days Payables Outstanding DPO = (Accounts_Payable / Annual_COGS) * 365; Working Capital required to fund operations equals: NWC = (CCC / 365) * Annual_COGS; under Reverse Factoring, enterprise extends DPO to 90 days while supplier receives early payment on Day 5 at enterprise credit rating discount rates.",
    "failureMode": "A fast-growing consumer electronics brand expands sales from $20M to $60M in 18 months, celebrating record revenue. However, the executive team ignores operational working capital: DIO balloons to 95 days, DSO stretches to 60 days, and suppliers mandate 30-day DPO. The Cash Conversion Cycle is 125 days (CCC = 95 + 60 - 30). Funding this 125-day cash gap requires $17,000,000 in working capital. The company exhausts its bank credit lines, cannot pay component suppliers, suffers an immediate production freeze, and is forced into emergency dilutive distressed equity financing at a 70% valuation haircut.",
    "tryItFriction": "Build an Enterprise Supply Chain Finance & Cash Conversion Cycle Simulator in Python: 1) Ingest corporate balance sheet and income statement operational records (Revenue, COGS, Inventory, AR, AP); 2) Compute exact DIO, DSO, DPO, and Cash Conversion Cycle (CCC); 3) Compute Net Working Capital (NWC) financing requirements and annual capital financing costs; 4) Model the financial impact of Lean inventory reduction (reducing DIO by 30 days) and Reverse Factoring (extending DPO by 45 days); 5) Simulate the path to negative working capital.",
    "socraticHints": [
      "What does a NEGATIVE Cash Conversion Cycle (CCC < 0) mean, and why is it the ultimate financial superpower of companies like Apple and Amazon?",
      "A negative CCC means the company collects cash from customers WEEKS before it has to pay its suppliers for the inventory; the business generates free cash flow simply by growing.",
      "Customer cash effectively finances the company's expansion, eliminating the need for bank debt or dilutive equity funding."
    ],
    "situationalPuzzle": {
      "scenario": "A retailer has Annual Revenue = $100,000,000, Annual COGS = $60,000,000. Balance sheet: Average Inventory = $15,000,000; Accounts Receivable = $10,000,000; Accounts Payable = $5,000,000. Corporate Cost of Capital = 10%. The newly appointed Chief Supply Chain Officer (CSCO) implements Lean inventory optimization (reducing inventory to $10,000,000) and launches a Reverse Factoring program (extending AP to $12,000,000). What was the baseline CCC, what is the new CCC, and how much cash was unlocked from working capital?",
      "options": [
        "CCC remained the same because revenue didn't change.",
        "Calculate step by step: 1) Baseline: DIO = ($15M / $60M) * 365 = 91.25 days. DSO = ($10M / $100M) * 365 = 36.50 days. DPO = ($5M / $60M) * 365 = 30.42 days. Baseline CCC = 91.25 + 36.50 - 30.42 = 97.33 days! Net Working Capital tied up = ($15M + $10M - $5M) = $20,000,000! 2) New Policy: New Inventory = $10M => New DIO = ($10M / $60M) * 365 = 60.83 days. DSO remains 36.50 days. New AP = $12M => New DPO = ($12M / $60M) * 365 = 73.00 days! New CCC = 60.83 + 36.50 - 73.00 = 24.33 days! New Working Capital = $10M + $10M - $12M = $8,000,000! 3) Cash Unlocked: $20,000,000 - $8,000,000 = $12,000,000 in pure liquidity unlocked! Annual capital financing savings = 10% * $12M = $1,200,000 in pure bottom-line profit every year!",
        "Cash unlocked is $1,000,000.",
        "Extending AP always causes supplier lawsuits."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Slashing DIO by 30 days and extending DPO via reverse factoring collapsed the Cash Conversion Cycle from 97.33 days down to 24.33 days. This operational transformation extracted $12,000,000 in trapped working capital, permanently saving the company $1,200,000 in annual debt interest."
    },
    "quests": [
      {
        "title": "Supply Chain Corporate Finance, Working Capital Velocity & Reverse Factoring Formulations",
        "type": "concept",
        "description": "Formulate supply chain financial engineering: analyze the mechanics of the Cash Conversion Cycle (CCC = DIO + DSO - DPO); formulate the mathematical relationship between inventory turns, working capital velocity, and Return on Invested Capital (ROIC); evaluate Reverse Factoring (Supply Chain Financing SCF) multi-party banking structures; analyze Dynamic Discounting sliding-scale APR models (e.g. 2/10 net 30 annualized return = 36.7%).",
        "rubric": "Step-by-step mathematical formulation of the Cash Conversion Cycle and Net Working Capital equations; complete banking transaction flow diagram of reverse factoring structures; formal derivation of dynamic discounting APR calculus."
      },
      {
        "title": "The Growth Trap Liquidity Crisis & $17M Working Capital Deficit Forensic Audit",
        "type": "detective",
        "description": "Conduct a comprehensive forensic audit of a consumer electronics brand's near-bankruptcy resulting from rapid revenue expansion paired with an unmonitored 125-day Cash Conversion Cycle: analyze quarterly balance sheets, bank credit line covenants, supplier stop-shipment notices, and distressed equity term sheets; prove how operational working capital depletion caused the liquidity crisis; author an institutional supply chain finance policy.",
        "rubric": "Audit historical cash flow statements against inventory aging and AR/AP ledgers; expose the working capital depletion mechanism; deliver an enterprise working capital governance standard."
      },
      {
        "title": "Building an Enterprise Supply Chain Finance & CCC Optimization Suite in Python",
        "type": "mastery",
        "description": "Engineer a production-ready Supply Chain Finance Engine in Python: 1) Ingest multi-period financial statements (Balance Sheet, P&L); 2) Compute dynamic DIO, DSO, DPO, and Cash Conversion Cycle metrics; 3) Compute Net Working Capital financing requirements and interest carrying costs; 4) Model sensitivity analysis: simulate the liquidity unlocked by Lean inventory reductions and reverse factoring; 5) Output an executive CFO/CSCO working capital dashboard.",
        "rubric": "Working Python supply chain finance suite; verified DIO/DSO/DPO calculations; accurate Net Working Capital modeling; clear financial scenario simulation."
      },
      {
        "title": "Commercial Bank Credit Line Covenant Breach 3 AM Emergency Lab",
        "type": "incident",
        "description": "Handle an emergency 3 AM crisis when an unexpected inventory buildup breaches your company's commercial bank debt covenant (mandating Net Working Capital <= $25,000,000), triggering a technical default notice that threatens the immediate freeze of all operational corporate accounts: detect the covenant breach; dynamically accelerate accounts receivable collections via dynamic discounting incentives; execute emergency supplier consignment adjustments; restore covenant compliance within 24 hours.",
        "rubric": "Rapid financial modeling of working capital reduction options; deploy emergency AR discount incentives and inventory adjustments restoring covenant compliance within 24 hours."
      }
    ]
  },
  {
    "day": 30,
    "month": 1,
    "blockNum": 6,
    "title": "Capstone 1: ApexChain Core SCM Operations & Warehouse Sourcing Engine Master Capstone Viva Gate",
    "stageName": "Stage 3: Strategic Sourcing, Lean Six Sigma, Working Capital & Capstone 1",
    "stageNum": 3,
    "pedagogicalRole": "Month 1 Master Capstone Synthesis, Integrated Supply Chain Defense & Viva Voce Examination",
    "spokenGoal": "Welcome to Day 30, the summit of Month 1 of the Supply Chain & Operations Management Masterclass! Over the past 30 days, you have mastered the complete foundational physics of physical enterprise: inventory optimization, demand forecasting, closed-loop MRP/CRP planning, 3D WMS slotting and TSP routing, multimodal TMS transportation, strategic Kraljic sourcing, Lean Six Sigma quality, and working capital finance. Today, you present and defend your magnum opus: ApexChain. This is a unified, sovereign end-to-end supply chain operating engine. You will stand before a Senior Operations Review Board, demonstrating that your platform can autonomously balance stochastic customer demand, plan factory production, optimize warehouse fulfillment, route vehicle fleets, audit supplier quality, and collapse working capital. Welcome to the elite ranks of Supply Chain Systems Architects!",
    "conceptInvariant": "ApexChain Core Unified Operational Invariant: The complete Month 1 supply chain architecture must satisfy end-to-end physical and financial feasibility: Stochastic_Inventory(Service_Level >= 98.0%, Zero_Avoidable_Stockouts) -> Planning_Closed_Loop(MRP_feasible, CRP_unconstrained) -> WMS_Fulfillment(COI_slotted, TSP_optimal_tour) -> Fleet_Routing(VRPTW_feasible, OTIF >= 98.0%) -> Sourcing_Quality(Z_Score >= 1.81, Cpk >= 1.50) -> Finance(CCC_min, Positive_Cash_Flow); zero single points of operational failure across the entire enterprise supply network.",
    "failureMode": "An industrial enterprise corporation operates with disconnected legacy point solutions: spreadsheets for inventory, unconstrained MRP for factory scheduling, paper pick tickets in warehouses, manual carrier dispatching, and unvetted suppliers. When subjected to a 35% seasonal demand surge, the company suffers rolling factory line stoppages, warehouse gridlock, carrier detention fines, and severe supplier quality failures, incurring $22,000,000 in collective damages and corporate restructuring.",
    "tryItFriction": "Build and Defend the Complete ApexChain Sovereign Platform Suite in Python: 1) Synthesize all 5 milestone engines (ApexInventory, ApexPlanning, ApexWMS, ApexTMS, ApexSourcing) into a unified multi-facility platform; 2) Execute a 365-day end-to-end enterprise simulation: forecast demand, plan production, slot inventory, route fleet vehicles, score suppliers, and optimize cash flow; 3) Defend the platform against simulated compound 3 AM supply chain disasters; 4) Generate the executive Month 1 Master Capstone Defense Portfolio.",
    "socraticHints": [
      "What distinguishes a junior supply chain coordinator from an Enterprise Chief Supply Chain Officer (CSCO)?",
      "A junior coordinator sees supply chain as tracking boxes and expediting late shipments; an Enterprise CSCO sees a complex, interconnected thermodynamic system balancing working capital velocity, supplier risk, machine physics, and customer service reliability.",
      "ApexChain synthesizes all of these disciplines into a singular, indestructible enterprise standard."
    ],
    "situationalPuzzle": {
      "scenario": "During your final Capstone 1 Viva Defense, the Board poses the ultimate compound crisis: 'It is October 15th. Holiday demand spikes 40%. A major ocean carrier delays raw material delivery by 3 weeks. The bottleneck CNC machine suffers a spindle failure. Concurrently, a sole-source electronic component supplier reports an Altman Z-score dropping to 1.35. How does ApexChain survive and maintain 100% operational integrity?'",
      "options": [
        "Shut down the plant and wait until January.",
        "Demonstrate Multi-Tiered Supply Chain Resilience: 1) Lead-Time Shock: ApexInventory automatically draws on variance-propagated safety stock buffers while triggering emergency domestic nearshore supplier purchase orders; 2) Bottleneck Breakdown: ApexPlanning instantly re-runs CRP finite capacity leveling, re-routing machining operations across secondary 3-axis centers and authorizing controlled overtime; 3) Supplier Insolvency: ApexSourcing flags the Z-score drop, freezes unsecured prepayments, activates dual-sourcing tooling escrows, and transitions volume to pre-qualified backup suppliers; 4) Financial Flow: Supply Chain Finance accelerates AR collections to fund emergency logistics without breaching debt covenants! ApexChain maintains continuous production with zero customer stockouts!",
        "Blame overseas suppliers and issue press releases.",
        "Fire the plant manager and hire 200 temp workers."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. True enterprise supply chain architecture is defined by systemic resilience. ApexChain survives catastrophic compound disruptions because every critical subsystem operates with automated stochastic buffers, closed-loop capacity leveling, proactive supplier health monitoring, and dynamic financial liquidity."
    },
    "quests": [
      {
        "title": "ApexChain Core Architectural Invariants & Sovereign System Specifications",
        "type": "concept",
        "description": "Formulate the comprehensive architectural specification of ApexChain: synthesize all 30 days of core supply chain and operations engineering into a unified, formal system specification; derive mathematical proofs of inventory balance, finite capacity feasibility, warehouse spatial travel bounds, fleet routing optimality, and cash conversion cycle velocity across multi-node enterprise operations.",
        "rubric": "Master-level architectural specification covering all 6 blocks of the core supply chain stack; formal mathematical proofs of operational feasibility, service level guarantees, and financial solvency."
      },
      {
        "title": "The $22M Disconnected Enterprise Collapse Comprehensive Forensic Audit",
        "type": "detective",
        "description": "Conduct a master forensic audit of an enterprise corporation's $22M disaster resulting from compounding failures across disconnected inventory, unconstrained MRP, chaotic warehouse travel, missed freight windows, and insolvent suppliers: analyze multi-system transaction logs, audit rulings, and executive communications; author the definitive Corporate Postmortem and Supply Chain Turnaround Blueprint.",
        "rubric": "Exhaustive forensic analysis of cross-functional supply chain failures; detailed financial damage reconciliation; executive-grade institutional turnaround blueprint."
      },
      {
        "title": "Building the Complete ApexChain Production Platform Suite in Python",
        "type": "mastery",
        "description": "Engineer the complete ApexChain Master Platform in Python: 1) Integrate stochastic inventory replenishment (ApexInventory), closed-loop MRP/CRP planning (ApexPlanning), 3D warehouse slotting and routing (ApexWMS), VRPTW transportation fleet dispatch (ApexTMS), and strategic supplier auditing (ApexSourcing); 2) Execute a 365-day end-to-end enterprise simulation; 3) Demonstrate 98%+ service levels, 30%+ travel reduction, zero stockouts, and positive cash flow; 4) Generate audit-ready executive telemetry ledgers.",
        "rubric": "Complete working Python master suite integrating all five milestone modules; verified execution across 365 simulation days; flawless mathematical feasibility and cash flow optimization."
      },
      {
        "title": "Month 1 Master Capstone Boardroom Defense Viva",
        "type": "incident",
        "description": "Defend ApexChain before an executive evaluation board comprising a Chief Supply Chain Officer (CSCO), VP of Manufacturing, and Director of Global Logistics: answer rigorous, unscripted technical, mathematical, and financial defense questions; demonstrate live crisis remediation of compound production and logistics failures; deliver the final Capstone Defense address proving master-level readiness for supply chain operational leadership.",
        "rubric": "Exemplary oral and technical defense of the complete supply chain architecture; successful real-time remediation of compound production crises; unanimous board certification."
      }
    ]
  }
]

# Write out supply_chain_ops_spec_m1_rest.py
output_path = "scripts/visuals/supply_chain_ops_spec_m1_rest.py"
with open(output_path, "w", encoding="utf-8") as f:
    f.write("# scripts/visuals/supply_chain_ops_spec_m1_rest.py\n")
    f.write("# Days 16 to 30 Specification for Supply Chain & Operations Management (course-supply-chain-ops)\n")
    f.write("# Conforming strictly to Gate v2 semantic standard:\n")
    f.write("# Transportation Management (TMS) & Mode Economics, Vehicle Routing (VRPTW) & Clarke-Wright,\n")
    f.write("# Freight Forwarding & 3PL/4PL SLAs, Cold Chain Telemetry & MKT Kinetics,\n")
    f.write("# Milestone 4: ApexTMS Enterprise Transportation Management & Fleet Routing Engine,\n")
    f.write("# Strategic Sourcing & The Kraljic Matrix, Supplier Auditing & Altman Z-Score Risk,\n")
    f.write("# Procurement Negotiations & Reverse Auctions, Reverse Logistics & Circular Economy 5R Triage,\n")
    f.write("# Milestone 5: ApexSourcing Enterprise Supplier Intelligence & Procurement Suite,\n")
    f.write("# Lean Operations, Waste Elimination & VSM, Kanban Systems & Pull Production (TPS),\n")
    f.write("# Statistical Process Control (SPC) & Six Sigma DMAIC, Supply Chain Finance & Cash Conversion Cycle (CCC),\n")
    f.write("# and Capstone 1: ApexChain Core SCM Operations & Warehouse Sourcing Engine Master Capstone.\n\n")
    f.write("DAYS_16_TO_30 = ")
    json_str = json.dumps(DAYS_16_TO_30, indent=2, ensure_ascii=False)
    f.write(json_str)
    f.write("\n")

print(f"Successfully generated {output_path} with {len(DAYS_16_TO_30)} days.")
