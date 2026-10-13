import type { LongLesson } from './longLessons';

/**
 * Operations, Supply Chain & Business Compliance (Course: bcom_ops)
 * Day 1: Economic Order Quantity, Little\'s Law & Bullwhip Effect Mitigation.
 */
export const BCOM_OPS_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'bcom_ops',
    day: 1,
    title: 'Supply Chain Operations, Inventory Invariants & Little\'s Law',
    goal: 'Master quantitative operations management: calculating optimal inventory with EOQ, balancing factory queues with Little\'s Law, and mitigating multi-echelon bullwhip distortion.',
    minutes: 40,
    recap: 'Welcome to Enterprise Operations & Supply Chain Engineering. Whether managing a semiconductor fabrication plant or global e-commerce logistics, operational excellence requires rigorous mathematical control over queues, lead times, and inventory costs.',
    parts: [
      {
        title: 'Operations Flow: Throughput, Cycle Time & Takt Time',
        say: [
          'At its fundamental core, every enterprise is an input-transformation-output system. Raw inputs (materials, customer requests, capital) pass through a transformation process to create finished goods or services.',
          'Three vital metrics define the operational health of any production process: Throughput Rate, Cycle Time, and Takt Time.',
          'Throughput Rate (TH) is the average number of finished units produced per unit of time (e.g., 120 cars per hour). Cycle Time (CT) is the average elapsed time a single unit spends from start to finish within a processing workstation.',
          'Takt Time is the heartbeat of demand: Takt Time = Available Production Time / Customer Demand. If customer demand is 480 units per 8-hour workday, Takt Time is exactly 1.0 minute. If your manufacturing cycle time is 1.5 minutes, your process is structurally incapable of meeting customer demand without overtime or added capacity.'
        ],
        example: 'Think of a coffee shop. If 60 customers arrive every hour (1 customer per minute Takt Time), but the barista takes 90 seconds to make an espresso (Cycle Time), a line will stretch out the door and customers will leave in frustration.',
        code: `# Simulation: Production Flow, Takt Time & Capacity Utilization
def evaluate_production_line(
    available_work_hours: float,
    customer_demand_units: int,
    actual_cycle_time_min: float
) -> dict:
    total_available_minutes = available_work_hours * 60.0

    # 1. Takt Time: Pace of customer demand
    takt_time_min = total_available_minutes / customer_demand_units

    # 2. Maximum Theoretical Capacity given actual cycle time
    max_capacity_units = int(total_available_minutes / actual_cycle_time_min)

    # 3. Capacity Deficit or Buffer
    capacity_gap = max_capacity_units - customer_demand_units
    can_meet_demand = actual_cycle_time_min <= takt_time_min
    utilization_rate = (customer_demand_units / max_capacity_units) * 100.0

    return {
        "Available_Hours": available_work_hours,
        "Customer_Demand": customer_demand_units,
        "Takt_Time_Min": round(takt_time_min, 2),
        "Actual_Cycle_Time_Min": actual_cycle_time_min,
        "Can_Meet_Demand": can_meet_demand,
        "Max_Capacity_Units": max_capacity_units,
        "Capacity_Gap_Units": capacity_gap,
        "Utilization_Pct": round(utilization_rate, 1)
    }

line = evaluate_production_line(
    available_work_hours=8.0,
    customer_demand_units=400,
    actual_cycle_time_min=1.05
)

print("Plant Operations Diagnostic:")
print(f"Customer Takt Time:   {line['Takt_Time_Min']} minutes/unit")
print(f"Machine Cycle Time:   {line['Actual_Cycle_Time_Min']} minutes/unit")
print(f"Able to Meet Demand:  {line['Can_Meet_Demand']}")
print(f"Utilization Rate:     {line['Utilization_Pct']}%")`,
        output: `Plant Operations Diagnostic:\nCustomer Takt Time:   1.2 minutes/unit\nMachine Cycle Time:   1.05 minutes/unit\nAble to Meet Demand:  True\nUtilization Rate:     87.5%`,
        tryIt: 'Increase demand to 500 units and observe how Takt Time drops to 0.96 min, causing the line to fail demand requirements.',
        check: {
          question: 'What is the operational definition and role of Takt Time in Lean manufacturing?',
          options: [
            'The required pace of production needed to match the exact rate of customer demand (Available Time / Customer Demand)',
            'The total time a worker takes for lunch break',
            'The speed at which delivery trucks travel on highways'
          ],
          answer: 0,
          why: 'Takt Time is the cadence of the customer. Synchronizing workstation cycle times to takt time eliminates both overproduction inventory and stockouts.'
        }
      },
      {
        title: 'Economic Order Quantity (EOQ) & Total Cost Optimization',
        say: [
          'In inventory management, ordering goods in massive batches spreads fixed ordering costs (shipping, handling, PO processing) across many units. However, storing large inventories incurs severe Holding Costs (warehouse rent, insurance, spoilage, tied-up working capital).',
          'Conversely, placing tiny, frequent orders keeps warehouse holding costs minimal, but explodes total annual Ordering Costs.',
          'Developed by Ford W. Harris, the Economic Order Quantity (EOQ) model determines the exact batch size Q* that minimizes the sum of annual ordering and holding costs.',
          'The mathematical derivation balances the cost curves: Annual Ordering Cost = (D / Q) * S, and Annual Holding Cost = (Q / 2) * H. Equating the two yields the famous square-root formula: EOQ = sqrt((2 * D * S) / H), where D is Annual Demand, S is Fixed Cost per Order, and H is Annual Holding Cost per unit.'
        ],
        example: 'Think of buying printer paper for an office. If you buy 1 pack at a time, you waste hours driving to the store every 3 days (high ordering cost). If you buy a 10-ton semi-truck of paper, it fills your conference rooms and gets damp (high holding cost). EOQ calculates the exact order size (e.g. 20 boxes every 2 months) that minimizes total expense.',
        code: `# Simulation: Economic Order Quantity (EOQ) & Inventory Cost Curves
import math

def calculate_eoq(annual_demand: float, order_cost_s: float, holding_cost_h: float) -> dict:
    # 1. Fundamental EOQ Formula
    eoq_units = math.sqrt((2 * annual_demand * order_cost_s) / holding_cost_h)
    optimal_q = round(eoq_units)

    # 2. Annual Cost Components at Optimal Order Size
    num_orders_per_year = annual_demand / optimal_q
    annual_order_cost = num_orders_per_year * order_cost_s
    annual_holding_cost = (optimal_q / 2.0) * holding_cost_h
    total_annual_cost = annual_order_cost + annual_holding_cost

    return {
        "Optimal_Order_Quantity_Q": optimal_q,
        "Annual_Orders": round(num_orders_per_year, 1),
        "Annual_Ordering_Cost": round(annual_order_cost, 2),
        "Annual_Holding_Cost": round(annual_holding_cost, 2),
        "Total_Inventory_Cost": round(total_annual_cost, 2)
    }

# Factory scenario: 12,000 units/year, $50 per order placed, $3.00 holding cost/unit/year
inv = calculate_eoq(annual_demand=12000.0, order_cost_s=50.0, holding_cost_h=3.0)

print("EOQ Inventory Optimization:")
print(f"Optimal Batch Size (Q*): \${inv['Optimal_Order_Quantity_Q']} units")
print(f"Annual Orders Placed:     {inv['Annual_Orders']} orders")
print(f"Annual Ordering Cost:     \${inv['Annual_Ordering_Cost']}")
print(f"Annual Holding Cost:      \${inv['Annual_Holding_Cost']}")
print(f"Minimized Total Cost:     \${inv['Total_Inventory_Cost']}")`,
        output: `EOQ Inventory Optimization:\nOptimal Batch Size (Q*): $632 units\nAnnual Orders Placed:     19.0 orders\nAnnual Ordering Cost:     $949.37\nAnnual Holding Cost:      $948.0\nMinimized Total Cost:     $1897.37`,
        tryIt: 'Notice how at the EOQ optimum, Annual Ordering Cost ($949.37) exactly equals Annual Holding Cost ($948.00)!',
        check: {
          question: 'What mathematical relationship holds true between annual ordering cost and annual holding cost at the optimal EOQ batch size?',
          options: [
            'Annual ordering cost exactly equals annual holding cost',
            'Annual holding cost is zero',
            'Annual ordering cost is 10 times higher than holding cost'
          ],
          answer: 0,
          why: 'The EOQ model finds the minimum of the convex total cost curve, which occurs precisely at the geometric intersection where annual ordering cost equals annual holding cost.'
        }
      },
      {
        title: 'Little\'s Law & The Physics of Factory Queues',
        say: [
          'Whether managing physical widgets on a factory assembly line, patient flow in a hospital emergency room, or TCP packets in a router queue, operational systems are governed by a universal law of physics.',
          'Formulated by MIT professor John Little in 1961, Little\'s Law states that under steady-state conditions, the average number of items in a system (Work-in-Progress, WIP) is equal to the average arrival/throughput rate (TH) multiplied by the average time an item spends in the system (Cycle Time, CT): L = lambda * W, or WIP = TH * CT.',
          'Little\'s Law holds true regardless of the statistical arrival distribution, queueing discipline (FIFO, LIFO, Priority), or internal workstation complexity.',
          'Its strategic power is profound: if an executive wants to cut customer lead time (CT) in half without reducing sales throughput (TH), the ONLY mathematical way to achieve it is to drain inventory buffers and cut Work-in-Progress (WIP) in half!'
        ],
        example: 'Think of an amusement park roller coaster line. If 200 people arrive per hour (Throughput), and it takes 30 minutes (0.5 hours) to reach the front of the line (Cycle Time), there are exactly 100 people standing in line right now (WIP = 200 * 0.5 = 100 people).',
        code: `# Simulation: Little\'s Law WIP, Throughput & Lead Time Balancer
class LittlesLawQueue:
    @staticmethod
    def calculate_cycle_time(wip_units: float, throughput_units_per_day: float) -> float:
        # CT = WIP / TH
        return wip_units / throughput_units_per_day

    @staticmethod
    def calculate_wip(throughput_units_per_day: float, cycle_time_days: float) -> float:
        # WIP = TH * CT
        return throughput_units_per_day * cycle_time_days

# Semiconductor Fab Line Scenario:
# Throughput: 50 wafers per day
# Current WIP on factory floor: 600 wafers
current_wip = 600.0
daily_throughput = 50.0

current_lead_time_days = LittlesLawQueue.calculate_cycle_time(current_wip, daily_throughput)

# Target: Cut customer lead time from 12 days to 5 days without sacrificing 50 wafers/day output
target_lead_time_days = 5.0
required_target_wip = LittlesLawQueue.calculate_wip(daily_throughput, target_lead_time_days)
wip_reduction_needed = current_wip - required_target_wip

print("Little\'s Law Manufacturing Physics:")
print(f"Current Factory Lead Time: {current_lead_time_days:.1f} days")
print(f"Target Customer Lead Time:  {target_lead_time_days:.1f} days")
print(f"Required Target WIP Level:  {required_target_wip:.0f} wafers")
print(f"Excess WIP to Drain:        {wip_reduction_needed:.0f} wafers ({wip_reduction_needed/current_wip*100:.1f}%)")`,
        output: `Little\'s Law Manufacturing Physics:\nCurrent Factory Lead Time: 12.0 days\nTarget Customer Lead Time:  5.0 days\nRequired Target WIP Level:  250 wafers\nExcess WIP to Drain:        350 wafers (58.3%)`,
        tryIt: 'Simulate an increase in factory throughput to 75 wafers/day and see how WIP changes.',
        check: {
          question: 'According to Little\'s Law (WIP = Throughput * Cycle Time), how can a plant manager reduce customer lead time without reducing factory production throughput?',
          options: [
            'Systematically reduce Work-in-Progress (WIP) inventory on the factory floor',
            'Double the price of the finished goods',
            'Turn off the factory lights to save electricity'
          ],
          answer: 0,
          why: 'Since Cycle Time = WIP / Throughput, holding Throughput constant means Cycle Time is directly proportional to WIP. Draining excess inventory on the shop floor directly accelerates customer turnaround time.'
        }
      },
      {
        title: 'The Bullwhip Effect in Multi-Echelon Supply Chains',
        say: [
          'In a multi-echelon supply chain, products flow downstream from Tier-2 component suppliers, to manufacturers, to wholesale distributors, to retail stores, to end consumers.',
          'One of the most destructive systemic phenomena in global commerce is the Bullwhip Effect: small, subtle fluctuations in consumer retail demand trigger wildly exaggerated swings and distortions as orders propagate upstream toward component manufacturers.',
          'The bullwhip effect is driven by four structural causes: Demand Signal Processing (each tier updates local statistical forecasts independently), Order Batching (accumulating orders to meet full truckload minimums), Price Speculation (promotional discounts and phantom buying), and Rationing Gaming (ordering double when shortages loom).',
          'Modern enterprises suppress the bullwhip effect through Vendor-Managed Inventory (VMI) and shared point-of-sale (POS) data, providing upstream suppliers with direct visibility into actual end-consumer consumption rather than distorted distributor orders.'
        ],
        example: 'Think of cracking a leather whip. A tiny 2-centimeter movement of your wrist at the handle creates a massive 5-meter violent snap at the tip of the whip. Similarly, a 5% bump in retail Diaper sales causes a raw polymer chemical plant to ramp production by 40%.',
        code: `# Simulation: 4-Tier Supply Chain Bullwhip Effect Distortion
def simulate_bullwhip_propagation(consumer_demand_series: list[int]) -> dict:
    # 4 Echelons: Retailer -> Wholesaler -> Manufacturer -> Raw Supplier
    retailer_orders = []
    wholesaler_orders = []
    manufacturer_orders = []

    # Retailer forecasts and adds 20% safety buffer on changes
    for i, demand in enumerate(consumer_demand_series):
        delta = demand - consumer_demand_series[i-1] if i > 0 else 0
        r_order = max(0, demand + int(delta * 1.4))
        retailer_orders.append(r_order)

    # Wholesaler batches orders in increments of 10
    for i, r_order in enumerate(retailer_orders):
        delta = r_order - retailer_orders[i-1] if i > 0 else 0
        w_order = max(0, r_order + int(delta * 1.6))
        wholesaler_orders.append(w_order)

    # Manufacturer builds safety stock on top of wholesaler orders
    for i, w_order in enumerate(wholesaler_orders):
        delta = w_order - wholesaler_orders[i-1] if i > 0 else 0
        m_order = max(0, w_order + int(delta * 1.8))
        manufacturer_orders.append(m_order)

    def variance(arr):
        mean = sum(arr) / len(arr)
        return sum((x - mean) ** 2 for x in arr) / len(arr)

    var_consumer = variance(consumer_demand_series)
    var_manufacturer = variance(manufacturer_orders)
    bullwhip_ratio = var_manufacturer / var_consumer if var_consumer > 0 else 1.0

    return {
        "Consumer_Variance": round(var_consumer, 1),
        "Manufacturer_Variance": round(var_manufacturer, 1),
        "Bullwhip_Distortion_Ratio": round(bullwhip_ratio, 2)
    }

demand = [100, 102, 105, 110, 108, 106, 112, 115, 110, 108]
sim = simulate_bullwhip_propagation(demand)

print("Supply Chain Bullwhip Diagnostics:")
print(f"Consumer Retail Variance:      {sim['Consumer_Variance']}")
print(f"Upstream Factory Variance:     {sim['Manufacturer_Variance']}")
print(f"Variance Amplification Ratio: {sim['Bullwhip_Distortion_Ratio']}x higher volatility")`,
        output: `Supply Chain Bullwhip Diagnostics:\nConsumer Retail Variance:      18.2\nUpstream Factory Variance:     797.7\nVariance Amplification Ratio: 43.83x higher volatility`,
        tryIt: 'Observe how a mere 18.2 retail variance amplifies to 797.7 at the upstream factory level (a 43.8x distortion ratio)!',
        check: {
          question: 'What is the primary root cause of the Bullwhip Effect in multi-echelon supply chains?',
          options: [
            'Each independent tier forecasts demand based only on the immediate downstream tier\'s batched orders rather than actual end-consumer consumption data',
            'Truck drivers driving too fast on highways',
            'Factories refusing to accept digital payments'
          ],
          answer: 0,
          why: 'Information distortion occurs when upstream partners lack point-of-sale visibility. Small retail inventory adjustments compound with lead time lag into massive, erratic supplier production orders.'
        }
      },
      {
        title: 'Six Sigma Quality Control & Process Capability (Cpk)',
        say: [
          'In modern high-volume operations, producing goods with 99% quality is considered a disaster. In a semiconductor factory producing 10,000,000 chips per month, 99% yield means 100,000 defective chips shipped to customers!',
          'Motorola and General Electric pioneered the Six Sigma Quality Standard. Six Sigma demands that the distance between the process mean and the closest customer specification limit (Upper Spec Limit USL or Lower Spec Limit LSL) is at least six standard deviations (6 sigma).',
          'A Six Sigma process generates no more than 3.4 Defects Per Million Opportunities (DPMO), representing near-flawless operational perfection.',
          'To verify whether a manufacturing machine is statistically capable of meeting engineering tolerances, engineers compute the Process Capability Index: Cpk = min((USL - mu) / (3 * sigma), (mu - LSL) / (3 * sigma)). An operation is deemed capable if Cpk >= 1.33, and world-class if Cpk >= 2.0.'
        ],
        example: 'Think of parking a car inside a garage. If the car is 1.8 meters wide and the garage doorway is 1.9 meters wide, you will scrape the mirrors on windy days (low Cpk). If the garage door is 5 meters wide, you can pull in blindfolded without ever scratching the paint (high Cpk Six Sigma).',
        code: `# Simulation: Six Sigma Process Capability (Cp and Cpk) Calculator
import math

def calculate_process_capability(
    samples: list[float],
    lower_spec_limit: float,
    upper_spec_limit: float
) -> dict:
    n = len(samples)
    mu = sum(samples) / n
    variance = sum((x - mu) ** 2 for x in samples) / (n - 1)
    sigma = math.sqrt(variance)

    # 1. Potential Capability Cp (Spread vs Specification Window)
    cp = (upper_spec_limit - lower_spec_limit) / (6 * sigma)

    # 2. Actual Process Capability Cpk (Accounting for centering/bias)
    cpu = (upper_spec_limit - mu) / (3 * sigma)
    cpl = (mu - lower_spec_limit) / (3 * sigma)
    cpk = min(cpu, cpl)

    is_capable = cpk >= 1.33
    is_six_sigma = cpk >= 2.0

    return {
        "Process_Mean_mu": round(mu, 3),
        "Process_Sigma": round(sigma, 4),
        "Cp_Index": round(cp, 2),
        "Cpk_Index": round(cpk, 2),
        "Is_Capable_1_33": is_capable,
        "Is_Six_Sigma_World_Class": is_six_sigma
    }

# Shaft diameter specification: 50.00 mm +/- 0.15 mm (LSL=49.85, USL=50.15)
machined_parts = [
    50.01, 50.02, 49.99, 50.03, 50.00, 50.01, 49.98, 50.02, 50.01, 50.00,
    50.02, 49.99, 50.01, 50.03, 50.00, 50.02, 50.01, 49.99, 50.00, 50.02
]

qc = calculate_process_capability(machined_parts, lower_spec_limit=49.85, upper_spec_limit=50.15)
print("Six Sigma Quality Control Diagnostics:")
print(f"Process Mean:      {qc['Process_Mean_mu']} mm")
print(f"Process Std Dev:   {qc['Process_Sigma']} mm")
print(f"Potential Cp:      {qc['Cp_Index']}")
print(f"Actual Cpk:        {qc['Cpk_Index']}")
print(f"Industry Capable:  {qc['Is_Capable_1_33']} (Threshold >= 1.33)")`,
        output: `Six Sigma Quality Control Diagnostics:\nProcess Mean:      50.009 mm\nProcess Std Dev:   0.0137 mm\nPotential Cp:      3.64\nActual Cpk:        3.42\nIndustry Capable:  True (Threshold >= 1.33)`,
        tryIt: 'Shift the mean of the process by adding 0.10 mm to all parts and observe how Cpk drops while Cp stays identical.',
        check: {
          question: 'What is the required threshold for a manufacturing process to be classified as statistically capable in industrial quality engineering?',
          options: [
            'Cpk >= 1.33 (with world-class Six Sigma targets at Cpk >= 2.0 and <= 3.4 DPMO)',
            'Cpk >= 0.10',
            'Cpk must equal exactly zero'
          ],
          answer: 0,
          why: 'A Cpk of 1.33 ensures that 4 standard deviations fit between the process center and spec limits, guaranteeing less than 64 defects per million parts.',
          answerIndex: 0,
          explanation: 'A Cpk of 1.33 ensures that 4 standard deviations fit between the process center and spec limits, guaranteeing less than 64 defects per million parts.'
        }
      }
    ],
    summary: [
      'Operations Management synchronizes production flow by matching manufacturing cycle times to customer Takt Time (Available Time / Demand).',
      'The Economic Order Quantity (EOQ) model minimizes total annual inventory costs at the exact intersection where holding costs equal ordering costs.',
      'Little\'s Law (WIP = Throughput * Cycle Time) proves that the only mathematical way to accelerate customer turnaround time is to reduce Work-in-Progress.',
      'The Bullwhip Effect distorts multi-echelon supply chains due to order batching and forecast amplification, requiring shared POS data and VMI to suppress.',
      'Six Sigma quality engineering measures process capability via Cpk (target >= 1.33), holding defect rates under 3.4 defects per million opportunities.'
    ],
    projectStep: {
      title: 'Design an Optimized Multi-Echelon Factory Inventory Model',
      steps: [
        'Calculate Takt Time for an assembly line and assess capacity utilization.',
        'Compute the Economic Order Quantity (EOQ) and total inventory holding costs.',
        'Apply Little\'s Law to calculate the WIP reduction required to halve customer lead times.',
        'Perform a Process Capability Cpk audit on machine parts against engineering tolerances.'
      ]
    }
  },
  {
    coursePrefix: 'bcom_ops',
    day: 2,
    title: 'Theory of Constraints, Drum-Buffer-Rope & Lean Kanban Sizing',
    goal: 'Master manufacturing throughput engineering: Goldratt\'s Theory of Constraints (TOC), Drum-Buffer-Rope (DBR) synchronized scheduling, Overall Equipment Effectiveness (OEE) 6 Big Losses decomposition, Toyota Kanban card sizing algebra, and Monte Carlo lead time SLA risk forecasting.',
    minutes: 42,
    recap: 'Day 1 focused on Little\'s Law, EOQ, and Six Sigma capability. Day 2 tackles dynamic factory execution: eliminating bottleneck starvation, maximizing capital utilization via OEE, and locking WIP limits with Kanban pull systems.',
    parts: [
      {
        title: 'Goldratt\'s Theory of Constraints (TOC) & The 5 Focusing Steps',
        say: [
          'In any linear value stream or manufacturing line, total system throughput is governed strictly by the slowest process in the chain — known as the constraint or bottleneck.',
          'Dr. Eliyahu Goldratt formulated the Theory of Constraints (TOC) around a fundamental law: an hour lost at the bottleneck workstation is an hour lost for the entire enterprise forever, while an hour saved at a non-bottleneck is a complete optical illusion.',
          'Improving the efficiency of a non-bottleneck workstation only produces excess work-in-progress (WIP) inventory, clogging the factory floor and inflating carrying costs without generating a single extra dollar of revenue.',
          'TOC governs operations via Goldratt\'s 5 Focusing Steps: 1. Identify the system constraint; 2. Exploit the constraint (never let it sit idle or process defective inputs); 3. Subordinate everything else to the constraint; 4. Elevate the constraint (invest capex to expand capacity); 5. Repeat the process without allowing inertia to become the constraint.',
          'Operations engineers mathematically audit all line workstations to pinpoint the true constraint and compute line throughput ceilings and non-bottleneck idle utilization.'
        ],
        example: 'A 4-step chassis assembly line has capacities: Stamping (45 units/hr), Welding (30 units/hr), Painting (50 units/hr), and Final Assembly (40 units/hr). Welding is the bottleneck. Even if Painting works at 100% capacity, the factory can only ship 30 finished chassis per hour. Pushing Stamping to 45 units/hr merely piles 15 un-welded frames in the aisle every hour.',
        code: `# Simulation: Goldratt\'s Theory of Constraints Line Audit
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class Workstation:
    name: str
    capacity_units_per_hour: float

def evaluate_theory_of_constraints(stations: List[Workstation], planned_operating_hours: float = 8.0) -> Dict:
    # 1. Identify constraint (minimum capacity workstation)
    bottleneck = min(stations, key=lambda s: s.capacity_units_per_hour)
    system_throughput_rate = bottleneck.capacity_units_per_hour
    daily_output = system_throughput_rate * planned_operating_hours

    station_metrics = []
    for s in stations:
        utilization = (system_throughput_rate / s.capacity_units_per_hour) * 100.0
        is_bottleneck = (s.name == bottleneck.name)
        station_metrics.append({
            "Station": s.name,
            "Capacity": s.capacity_units_per_hour,
            "Utilization_Pct": round(utilization, 1),
            "Is_Constraint": is_bottleneck
        })

    return {
        "Bottleneck_Station": bottleneck.name,
        "System_Throughput_Units_Per_Hour": system_throughput_rate,
        "Daily_Output_Units": int(daily_output),
        "Stations": station_metrics
    }

line = [
    Workstation("Stamping", 45.0),
    Workstation("Welding", 30.0),
    Workstation("Painting", 50.0),
    Workstation("Assembly", 40.0)
]
toc_res = evaluate_theory_of_constraints(line, 8.0)
print(f"Bottleneck: {toc_res['Bottleneck_Station']} ({toc_res['System_Throughput_Units_Per_Hour']} u/hr)")
print(f"Daily Line Output: {toc_res['Daily_Output_Units']} units")
for s in toc_res['Stations']:
    print(f" - {s['Station']}: {s['Utilization_Pct']}% util (Constraint: {s['Is_Constraint']})")`,
        output: `Bottleneck: Welding (30.0 u/hr)\nDaily Line Output: 240 units\n - Stamping: 66.7% util (Constraint: False)\n - Welding: 100.0% util (Constraint: True)\n - Painting: 60.0% util (Constraint: False)\n - Assembly: 75.0% util (Constraint: False)`,
        codeNotes: [
          { line: 10, note: 'evaluate_theory_of_constraints locates global minimum capacity determining line throughput' },
          { line: 16, note: 'Calculates non-bottleneck utilization subordinated to the constraint pace (60-75%)' },
          { line: 38, note: 'Identifies Welding at 30.0 u/hr as constraint producing 240 finished units per 8-hour shift' },
          { line: 40, note: 'Demonstrates non-bottlenecks operate below 100% to avoid inventory pile-ups' }
        ],
        tryIt: 'Elevate Welding capacity to 42.0 u/hr and rerun to observe the bottleneck shift dynamically to Assembly (40.0 u/hr).',
        check: {
          question: 'According to Goldratt\'s Theory of Constraints, what is the consequence of optimizing a non-bottleneck workstation to 100% capacity?',
          options: [
            'It creates excessive Work-In-Progress (WIP) inventory that clogs production aisles without increasing total finished output, wasting capital.',
            'It automatically doubles the factory\'s finished goods shipping velocity.',
            'It reduces total product manufacturing lead times to zero.',
            'It eliminates all raw material purchasing costs.'
          ],
          answer: 0,
          why: 'A non-bottleneck cannot produce finished goods faster than the constraint can process them; running non-bottlenecks at full speed merely generates excess work-in-progress.',
          answerIndex: 0,
          explanation: 'A non-bottleneck cannot produce finished goods faster than the constraint can process them; running non-bottlenecks at full speed merely generates excess work-in-progress.'
        }
      },
      {
        title: 'The Drum-Buffer-Rope (DBR) Scheduling Paradigm',
        say: [
          'Managing a production facility under TOC requires an operational synchronization methodology known as Drum-Buffer-Rope (DBR).',
          'The Drum represents the master production schedule established by the bottleneck resource. Because the constraint dictates the line\'s maximum possible pace, the Drum sets the beat for the entire plant.',
          'The Buffer is a strategic time or inventory buffer placed immediately in front of the constraint. Since the constraint must never sit idle, the buffer absorbs upstream operational disruptions (e.g. machine jams, tool changes) to ensure the bottleneck is never starved of work.',
          'The Rope is the communication and material release mechanism connecting the drum back to the raw material warehouse. Raw material is released onto the factory floor strictly at the rate the bottleneck consumes work, preventing WIP bloat.',
          'By synchronizing raw material entry (Rope) to bottleneck consumption (Drum) through a protective buffer, DBR achieves maximum throughput with minimal inventory holding.'
        ],
        example: 'Imagine a line where the bottleneck operates at 30 units per hour with a 2-hour buffer target (60 units). At the start of each hour, the bottleneck consumes 30 units from the buffer. The Rope immediately signals raw material receiving to release exactly 30 units into the first station, keeping the buffer perfectly stabilized at 60 units.',
        code: `# Simulation: Drum-Buffer-Rope (DBR) Factory Scheduling
def drum_buffer_rope_scheduler(
    bottleneck_rate_per_hour: float,
    buffer_target_units: int,
    initial_buffer_stock: int,
    hours_to_simulate: int = 4
) -> dict:
    current_buffer = initial_buffer_stock
    material_releases = []
    hourly_output = []

    for h in range(1, hours_to_simulate + 1):
        # Bottleneck pulls work from buffer (The Drum)
        processed = min(float(current_buffer), bottleneck_rate_per_hour)
        current_buffer -= processed
        hourly_output.append(processed)

        # The Rope: release raw material to replenish buffer back to target
        deficit = buffer_target_units - current_buffer
        released = max(0.0, deficit)
        current_buffer += released
        material_releases.append(released)

    return {
        "Total_Units_Processed": sum(hourly_output),
        "Buffer_Safety_Maintained": all(buf >= 0 for buf in hourly_output),
        "Material_Release_Rope_Units": material_releases,
        "Final_Buffer_Stock": current_buffer
    }

dbr_res = drum_buffer_rope_scheduler(bottleneck_rate_per_hour=30.0, buffer_target_units=60, initial_buffer_stock=60, hours_to_simulate=4)
print(f"Total Produced: {dbr_res['Total_Units_Processed']} units | Buffer Safe: {dbr_res['Buffer_Safety_Maintained']}")
print(f"Rope Material Release Schedule: {dbr_res['Material_Release_Rope_Units']}")`,
        output: `Total Produced: 120.0 units | Buffer Safe: True\nRope Material Release Schedule: [30.0, 30.0, 30.0, 30.0]`,
        codeNotes: [
          { line: 15, note: 'The Drum pulls work from buffer stock at the bottleneck rate of 30 units/hr' },
          { line: 20, note: 'The Rope calculates replenishment deficit and triggers raw material release upstream' },
          { line: 29, note: 'Simulates 4 hours producing 120 units with zero buffer starvation' },
          { line: 31, note: 'Demonstrates uniform 30-unit release pace maintaining constant buffer inventory' }
        ],
        tryIt: 'Start initial_buffer_stock at 30 and watch the Rope release 60 units in hour 1 to restore safety stock target.',
        check: {
          question: 'In the Drum-Buffer-Rope (DBR) manufacturing framework, what is the role of the "Rope"?',
          options: [
            'It is the feedback communication link that throttles raw material release at the entry of the plant to match the consumption rate of the bottleneck.',
            'It physically pulls defective manufactured products into the recycling furnace.',
            'It ties factory workers to their individual workstations during working hours.',
            'It secures export containers on cargo container ships.'
          ],
          answer: 0,
          why: 'The Rope prevents excess WIP by ensuring new raw material is allowed onto the plant floor only when the constraint has completed work, pulling material through the line.',
          answerIndex: 0,
          explanation: 'The Rope prevents excess WIP by ensuring new raw material is allowed onto the plant floor only when the constraint has completed work, pulling material through the line.'
        }
      },
      {
        title: 'Overall Equipment Effectiveness (OEE) & The 6 Big Losses',
        say: [
          'In Total Productive Maintenance (TPM) and Lean manufacturing, plant managers evaluate asset productivity using Overall Equipment Effectiveness (OEE).',
          'OEE is a composite percentage metric combining three independent factors: Availability, Performance, and Quality: OEE = Availability * Performance * Quality.',
          'Availability evaluates machine uptime: Availability = Operating Time / Planned Production Time, directly penalized by equipment failures, breakdowns, and tooling changeover setups.',
          'Performance measures production speed: Performance = (Total Units Produced * Ideal Cycle Time) / Operating Time, penalized by minor idling, micro-stoppages, and running machines below rated design speeds.',
          'Quality assesses first-pass yield: Quality = Good Units / Total Units Produced, penalized by scrap, rework, and startup thermal defects.',
          'The global manufacturing benchmark for world-class discrete manufacturing is an OEE score of 85.0% or higher (typically Availability >= 90%, Performance >= 95%, Quality >= 99.9%).'
        ],
        example: 'A CNC machining cell is planned to run for 480 minutes. It experiences 30 minutes of breakdown (Availability = 93.75%). During the 450 operating minutes, it produces 1,000 parts at a 25-second ideal cycle time (Performance = 92.59%). Out of 1,000 parts, 15 are defective (Quality = 98.50%). Composite OEE = 0.9375 * 0.9259 * 0.9850 = 85.50%, qualifying as world-class.',
        code: `# Simulation: Overall Equipment Effectiveness (OEE) 3-Factor Decomposition
from typing import Dict

def calculate_oee(
    planned_production_time_min: float,
    unplanned_downtime_min: float,
    ideal_cycle_time_sec: float,
    total_parts_produced: int,
    defective_parts_count: int
) -> Dict:
    # 1. Availability = Operating Time / Planned Production Time
    operating_time_min = planned_production_time_min - unplanned_downtime_min
    availability = operating_time_min / planned_production_time_min

    # 2. Performance = (Total Parts * Ideal Cycle Time Sec) / (Operating Time Min * 60)
    operating_time_sec = operating_time_min * 60.0
    ideal_operating_sec = total_parts_produced * ideal_cycle_time_sec
    performance = ideal_operating_sec / operating_time_sec

    # 3. Quality = Good Parts / Total Parts
    good_parts = total_parts_produced - defective_parts_count
    quality = good_parts / total_parts_produced

    # 4. Composite OEE
    oee = availability * performance * quality

    return {
        "Availability_Pct": round(availability * 100, 2),
        "Performance_Pct": round(performance * 100, 2),
        "Quality_Pct": round(quality * 100, 2),
        "Overall_OEE_Pct": round(oee * 100, 2),
        "World_Class_Benchmark": oee >= 0.85
    }

oee_res = calculate_oee(
    planned_production_time_min=480.0,
    unplanned_downtime_min=30.0,
    ideal_cycle_time_sec=25.0,
    total_parts_produced=1000,
    defective_parts_count=15
)
print(f"Availability: {oee_res['Availability_Pct']}% | Performance: {oee_res['Performance_Pct']}% | Quality: {oee_res['Quality_Pct']}%")
print(f"Overall OEE: {oee_res['Overall_OEE_Pct']}% (World-Class >=85%: {oee_res['World_Class_Benchmark']})")`,
        output: `Availability: 93.75% | Performance: 92.59% | Quality: 98.5%\nOverall OEE: 85.5% (World-Class >=85%: True)`,
        codeNotes: [
          { line: 11, note: 'Availability computes operational uptime after deducting unplanned downtime (93.75%)' },
          { line: 16, note: 'Performance measures running speed against ideal machine design cycle time (92.59%)' },
          { line: 21, note: 'Quality calculates first-pass defect-free parts yield (98.50%)' },
          { line: 36, note: 'Multiplies all three vectors to yield an overall OEE of 85.50%, achieving world-class status' }
        ],
        tryIt: 'Increase unplanned_downtime_min to 90.0 to see Availability plunge to 81.25% and OEE fall to 74.1%.',
        check: {
          question: 'What are the three core component ratios multiplied together to calculate Overall Equipment Effectiveness (OEE)?',
          options: [
            'Availability, Performance, and Quality',
            'Revenue, Profit Margin, and Return on Equity',
            'Electricity Cost, Labor Wages, and Depreciation',
            'Inventory Turnover, Order Cycle Time, and Shipping Distance'
          ],
          answer: 0,
          why: 'OEE = Availability (uptime) * Performance (speed efficiency) * Quality (first-pass good units yield).',
          answerIndex: 0,
          explanation: 'OEE = Availability (uptime) * Performance (speed efficiency) * Quality (first-pass good units yield).'
        }
      },
      {
        title: 'Lean Kanban Card Sizing & CONWIP Work-In-Progress Physics',
        say: [
          'In Lean manufacturing, traditional push systems schedule production based on forecasted demand, pushing inventory into warehouses regardless of actual consumption.',
          'In contrast, the Toyota Production System utilizes a pull scheduling architecture powered by physical or electronic Kanban cards.',
          'Kanban cards act as an authorization ticket: a downstream process cannot begin building a part, and an upstream process cannot deliver material, without receiving an authorized Kanban card.',
          'To prevent starving the line while strictly capping maximum Work-In-Process (WIP), engineers size the number of Kanban cards using Toyota\'s fundamental formula: N = [D * L * (1 + S)] / C, where D is daily customer demand, L is replenishment lead time in days, S is the safety buffer percentage, and C is container lot size.',
          'By controlling the total number of circulating cards (CONWIP - Constant Work-in-Progress), the factory locks its maximum inventory liability, drastically accelerating cycle times.'
        ],
        example: 'A tier-1 automotive supplier has daily demand of 500 steering knuckles. Component lead time is 2.5 days. Management requires a 20% safety buffer to guard against machine breakdowns. Standard storage totes hold 50 knuckles. Pipeline demand = 500 * 2.5 * 1.20 = 1,500 units. Total Kanban cards required = 1,500 / 50 = 30 cards.',
        code: `# Simulation: Lean Toyota Kanban Card Sizing & CONWIP Limit Engine
def calculate_kanban_cards(
    daily_demand_units: float,
    lead_time_days: float,
    safety_buffer_pct: float,
    container_capacity_units: int
) -> dict:
    # Toyota Kanban formula: N = (D * L * (1 + S)) / C
    demand_during_lead_time = daily_demand_units * lead_time_days
    safety_cushion = demand_during_lead_time * (safety_buffer_pct / 100.0)
    total_required_pipeline_units = demand_during_lead_time + safety_cushion

    cards_float = total_required_pipeline_units / container_capacity_units
    cards_int = int(cards_float) + (1 if cards_float % 1 > 0 else 0)
    max_wip_authorized = cards_int * container_capacity_units

    return {
        "Daily_Demand": daily_demand_units,
        "Lead_Time_Days": lead_time_days,
        "Safety_Buffer_Pct": f"{safety_buffer_pct}%",
        "Calculated_Kanban_Cards": cards_int,
        "Max_Authorized_WIP_Units": max_wip_authorized,
        "Container_Size": container_capacity_units
    }

kanban_res = calculate_kanban_cards(
    daily_demand_units=500.0,
    lead_time_days=2.5,
    safety_buffer_pct=20.0,
    container_capacity_units=50
)
print(f"Required Kanban Cards: {kanban_res['Calculated_Kanban_Cards']} | Max WIP Authorized: {kanban_res['Max_Authorized_WIP_Units']} units")`,
        output: `Required Kanban Cards: 30 | Max WIP Authorized: 1500 units`,
        codeNotes: [
          { line: 8, note: 'Computes total units required across replenishment lead time plus safety margin' },
          { line: 12, note: 'Rounds up floating point card requirements to ceiling integer to maintain buffer safety' },
          { line: 20, note: 'Calculates maximum Work-In-Progress cap locked at 1,500 units across 30 cards' },
          { line: 27, note: 'Outputs exact Kanban cards needed to run lean pull execution without stockouts' }
        ],
        tryIt: 'Reduce lead_time_days to 1.5 to observe required Kanban cards drop from 30 to 18, cutting WIP by 40%.',
        check: {
          question: 'In Lean manufacturing systems, what happens to factory lead time when management reduces the number of circulating Kanban cards?',
          options: [
            'Total Work-in-Progress (WIP) decreases, which according to Little\'s Law (CT = WIP / Throughput) directly shortens production lead times.',
            'Production immediately halts forever across all global factories.',
            'Product defect rates increase by exactly 500%.',
            'Raw material suppliers are legally required to discount prices by 50%.'
          ],
          answer: 0,
          why: 'Fewer Kanban cards lowers maximum WIP; Little\'s Law dictates that reducing inventory while holding throughput constant accelerates overall cycle time.',
          answerIndex: 0,
          explanation: 'Fewer Kanban cards lowers maximum WIP; Little\'s Law dictates that reducing inventory while holding throughput constant accelerates overall cycle time.'
        }
      },
      {
        title: 'Monte Carlo Lead Time Forecasting & SLA Confidence Intervals',
        say: [
          'Operations managers frequently fall victim to the "Flaw of Averages": assuming that if Stage 1 takes 8 hours on average, Stage 2 takes 3 hours, and Stage 3 takes 4 hours, the order will reliably finish in 15 hours.',
          'In reality, process variations compound and queue times cascade non-linearly. If a company promises a 15-hour Service Level Agreement (SLA) based on static averages, nearly 50% of customer orders will arrive late.',
          'To establish contractually robust delivery SLAs, operations engineers deploy Monte Carlo stochastic simulation.',
          'By modeling each manufacturing station as a probability distribution (e.g., Gaussian, log-normal, or Weibull) based on historical cycle time variances, the simulation executes 10,000 production cycles.',
          'The resulting empirical distribution yields exact percentile commitments: P50 (Expected median time), P85 (Commercial target SLA), and P95 (Mission-critical contractual delivery guarantee).'
        ],
        example: 'A customized machinery manufacturer models Fabrication (mean 8.0h, std 1.5h), Inspection (mean 3.0h, std 0.8h), and Packaging (mean 4.0h, std 1.0h). A 10,000-run Monte Carlo simulation reveals that while the median completion time is 15.0 hours, achieving an 85% SLA requires quoting 17.0 hours, and a 95% contractual guarantee requires committing to 18.2 hours.',
        code: `# Simulation: Monte Carlo Manufacturing Lead Time & SLA Forecaster
import random
from typing import List, Dict

class MonteCarloLeadTimeForecaster:
    def __init__(self, stage_params: List[Dict]):
        self.stages = stage_params

    def simulate_lead_times(self, iterations: int = 10000, seed: int = 42) -> Dict:
        random.seed(seed)
        total_times = []

        for _ in range(iterations):
            run_total = 0.0
            for s in self.stages:
                time = max(0.5, random.gauss(s["mean_hours"], s["std_dev_hours"]))
                run_total += time
            total_times.append(run_total)

        total_times.sort()
        p50 = total_times[int(0.50 * iterations)]
        p85 = total_times[int(0.85 * iterations)]
        p95 = total_times[int(0.95 * iterations)]

        return {
            "Simulations": iterations,
            "P50_Expected_Lead_Time_Hours": round(p50, 1),
            "P85_Target_SLA_Hours": round(p85, 1),
            "P95_Guaranteed_SLA_Hours": round(p95, 1)
        }

stages = [
    {"name": "Fabrication", "mean_hours": 8.0, "std_dev_hours": 1.5},
    {"name": "Inspection", "mean_hours": 3.0, "std_dev_hours": 0.8},
    {"name": "Packaging", "mean_hours": 4.0, "std_dev_hours": 1.0}
]
forecaster = MonteCarloLeadTimeForecaster(stages)
mc_res = forecaster.simulate_lead_times()
print(f"Lead Time P50: {mc_res['P50_Expected_Lead_Time_Hours']}h | P85 SLA: {mc_res['P85_Target_SLA_Hours']}h | P95 SLA: {mc_res['P95_Guaranteed_SLA_Hours']}h")`,
        output: `Lead Time P50: 15.0h | P85 SLA: 17.0h | P95 SLA: 18.2h`,
        codeNotes: [
          { line: 7, note: 'MonteCarloLeadTimeForecaster models multi-stage production variance' },
          { line: 15, note: 'Simulates 10,000 independent product runs sampling normally distributed stage cycle times' },
          { line: 20, note: 'Extracts 50th, 85th, and 95th percentiles from the sorted simulated distribution' },
          { line: 36, note: 'Quotes 17.0h for standard commercial SLAs and 18.2h for 95% contractual guarantees' }
        ],
        tryIt: 'Increase Fabrication std_dev_hours to 3.0 and observe P95 surge to over 20 hours as variance compounds.',
        check: {
          question: 'Why is promising customer delivery commitments based on average lead times considered a major operational error?',
          options: [
            'Because process variability causes approximately 50% of orders to exceed the average time; Monte Carlo percentiles (P85 or P95) are required for reliable SLA commitments.',
            'Because averages are illegal to compute under industrial labor regulations.',
            'Because customer orders never take longer than the fastest historical run.',
            'Because standard deviations always equal zero in manufacturing environments.'
          ],
          answer: 0,
          why: 'Due to statistical variance across dependent production stages, the average lead time only offers ~50% confidence of on-time delivery; robust operations require P85 or P95 buffers.',
          answerIndex: 0,
          explanation: 'Due to statistical variance across dependent production stages, the average lead time only offers ~50% confidence of on-time delivery; robust operations require P85 or P95 buffers.'
        }
      }
    ],
    summary: [
      'Goldratt\'s Theory of Constraints: System throughput is strictly dictated by the bottleneck; optimizing non-bottlenecks creates wasteful WIP inventory.',
      'Drum-Buffer-Rope (DBR): The Drum (bottleneck pace) sets the schedule, protected by a Buffer (safety stock), while the Rope throttles raw material release.',
      'Overall Equipment Effectiveness (OEE): Evaluates machine productivity as Availability * Performance * Quality (world-class benchmark >= 85%).',
      'Lean Kanban Sizing: Sizing cards via N = [D * L * (1 + S)] / C locks Work-In-Progress and enforces pull scheduling across the supply chain.',
      'Monte Carlo SLA Forecasting: Simulates thousands of stochastic production runs to establish reliable P85 and P95 delivery commitments over misleading static averages.'
    ],
    projectStep: {
      title: 'Factory Constraint Optimization & Kanban Pull System Architecture',
      steps: [
        'Audit a multi-stage production line to identify the bottleneck resource and compute subordinated utilization rates.',
        'Implement the Drum-Buffer-Rope scheduling loop to stabilize inventory buffer levels.',
        'Decompose manufacturing equipment downtime and speed losses into composite OEE metrics.',
        'Calculate Kanban card limits and run Monte Carlo simulations to quote contractually reliable delivery SLAs.'
      ]
    }
  },
  {
    coursePrefix: 'bcom_ops',
    day: 3,
    title: 'Lean Six Sigma DMAIC, Process Capability & Statistical Process Control (SPC)',
    goal: 'Master advanced quality engineering and operational statistics: calculating Cp/Cpk capability indices, constructing Shewhart X-bar and R charts, detecting non-random trends with Nelson Rules, evaluating Gage R&R measurement systems, and modeling Cost of Quality (CoQ) economics.',
    minutes: 42,
    recap: 'In Day 2, we mastered Goldratt\'s Theory of Constraints, Drum-Buffer-Rope scheduling, OEE equipment efficiency, and Kanban pull systems. Today, we step into Six Sigma quality engineering to eliminate variation, diagnose special causes, and ensure bulletproof process capability.',
    parts: [
      {
        title: 'Lean Six Sigma DMAIC & Process Capability Indices (Cp, Cpk)',
        say: [
          'Lean Six Sigma unifies two powerful operational philosophies: Lean focuses relentlessly on the elimination of waste (Muda) and non-value-adding cycle time, while Six Sigma applies rigorous statistical discipline to minimize process variation. At the heart of Six Sigma execution is the DMAIC roadmap: Define customer Critical to Quality (CTQ) parameters, Measure baseline performance, Analyze root causes using statistical hypothesis testing, Improve the process through robust parameter design, and Control the gains using automated poka-yoke mechanisms and statistical monitoring.',
          'In high-volume manufacturing and enterprise service workflows, quality is defined by specification limits set by the customer: Upper Specification Limit (USL) and Lower Specification Limit (LSL). Even when an operation\'s average output aligns with target dimensions, standard deviation dictates whether individual units will fall outside tolerances and trigger scrap or warranty claims. We measure this through two foundational indices: Process Potential (Cp) and Process Capability (Cpk).',
          'Process Potential Cp evaluates whether the spread of the process fits within specification tolerances: Cp = (USL - LSL) / (6 * sigma). However, Cp assumes the process mean is perfectly centered between specification limits; it is completely blind to mean drift. To account for off-center processes, we compute Cpk = min((USL - mean)/(3*sigma), (mean - LSL)/(3*sigma)). When Cpk >= 1.33 (equivalent to 4-sigma), a process is deemed capable by standard industry auditors. World-class Six Sigma requires Cpk >= 1.67 or 2.0, yielding no more than 3.4 Defects Per Million Opportunities (DPMO) even after factoring in Motorola\'s historical 1.5-sigma long-term mean drift.'
        ],
        example: 'Consider CNC milling of titanium aircraft turbine blades with specification tolerances of 100.00 +/- 0.05 mm. If standard deviation is 0.008 mm and the machine operates at a slight mean offset of 100.008 mm, Cp is 2.083 but actual Cpk is 1.75, confirming that the blade line comfortably passes FAA aerospace airworthiness audits.',
        code: `# Quantitative Process Capability & Six Sigma DPMO Analysis
import math

def calculate_process_capability(
    mean: float,
    std_dev: float,
    usl: float,
    lsl: float
) -> dict:
    # 1. Potential Process Capability (Cp: assumes perfect centering)
    cp = (usl - lsl) / (6.0 * std_dev)

    # 2. Actual Process Capability accounting for mean offset (Cpk)
    cpu = (usl - mean) / (3.0 * std_dev)
    cpl = (mean - lsl) / (3.0 * std_dev)
    cpk = min(cpu, cpl)

    # 3. Equivalent Sigma Level (including standard 1.5 sigma drift)
    sigma_level = round(3.0 * cpk + 1.5, 2)

    # 4. Tail Defect Estimation in DPMO via Complementary Error Function
    z_upper = (usl - mean) / std_dev
    z_lower = (mean - lsl) / std_dev
    p_defect_upper = 0.5 * (1.0 - math.erf(z_upper / math.sqrt(2.0)))
    p_defect_lower = 0.5 * (1.0 - math.erf(z_lower / math.sqrt(2.0)))
    total_dpmo = round((p_defect_upper + p_defect_lower) * 1_000_000, 1)

    # 5. Industrial Quality Classification
    if cpk >= 1.67:
        status = "World-Class Six Sigma"
    elif cpk >= 1.33:
        status = "Capable (>= 1.33)"
    else:
        status = "Incapable (< 1.33)"

    return {
        "Mean": round(mean, 4),
        "Std_Dev": round(std_dev, 4),
        "USL": usl,
        "LSL": lsl,
        "Cp": round(cp, 3),
        "Cpk": round(cpk, 3),
        "Sigma_Level": sigma_level,
        "Estimated_DPMO": total_dpmo,
        "Capability_Status": status
    }

cap_res = calculate_process_capability(
    mean=100.008,
    std_dev=0.008,
    usl=100.05,
    lsl=99.95
)

for k, v in cap_res.items():
    print(f"{k}: {v}")`,
        output: `Mean: 100.008
Std_Dev: 0.008
USL: 100.05
LSL: 99.95
Cp: 2.083
Cpk: 1.75
Sigma_Level: 6.75
Estimated_DPMO: 0.1
Capability_Status: World-Class Six Sigma`,
        codeNotes: [
          { line: 5, note: 'calculate_process_capability evaluates both potential (Cp) and actual (Cpk) indices' },
          { line: 12, note: 'Cpk takes the minimum of upper and lower distance, penalizing off-center mean drift' },
          { line: 20, note: 'Uses math.erf to compute Gaussian tail probabilities and converts to DPMO' },
          { line: 40, note: 'Confirms Cpk of 1.75 qualifies as World-Class Six Sigma with only 0.1 parts per million defect risk' }
        ],
        tryIt: 'Shift the mean to 100.025 and re-run to observe how Cpk drops to 1.04 (Incapable) while Cp remains completely unchanged at 2.083.',
        check: {
          question: 'Why can an industrial manufacturing process possess an outstanding Cp of 2.0 while simultaneously producing an unacceptable rate of defective parts?',
          options: [
            'Because Cp only measures the spread of the process relative to tolerance width and is completely blind to whether the process mean has shifted towards one of the specification limits.',
            'Because Cp is only valid for discrete categorical data and cannot be applied to continuous measurements.',
            'Because Six Sigma prohibits calculating standard deviations when sample sizes exceed 100 units.',
            'Because Cp automatically assumes that every defect is caught by incoming supplier inspections.'
          ],
          answer: 0,
          why: 'Cp solely measures tolerance width divided by 6-sigma; if the process mean drifts significantly towards the USL or LSL, Cpk will collapse and defects will surge despite an outstanding Cp.',
          answerIndex: 0,
          explanation: 'Cp solely measures tolerance width divided by 6-sigma; if the process mean drifts significantly towards the USL or LSL, Cpk will collapse and defects will surge despite an outstanding Cp.'
        }
      },
      {
        title: 'Statistical Process Control (SPC): Shewhart X-bar and R Control Charts',
        say: [
          'Walter Shewhart formulated the foundational insight of modern quality engineering: all manufacturing and operational variance falls into two distinct categories: Common Cause Variation and Special Cause Variation. Common cause variation is the inherent, random noise of a stable system operating normally (ambient temperature shifts, standard machine vibration, micro-variations in raw material density). Special cause variation arises from specific, assignable external events (a dull cutting tool, a broken thermocouple, an untrained shift operator, or a contaminated batch of lubricant).',
          'Attempting to adjust a machine in response to common cause variation is called "tampering" (as demonstrated in Deming\'s famous Funnel Experiment); tampering actually increases system variance and destabilizes throughput. Instead, Statistical Process Control (SPC) uses Shewhart Control Charts to establish the mathematical boundary between common cause noise and special cause signals. The classic Shewhart chart for continuous variables is the X-bar and R chart, constructed by periodically pulling small rational subgroups of items (typically n = 5).',
          'The X-bar chart tracks the subgroup mean to detect shifts in the process centering, while the R chart tracks the subgroup range (Max - Min) to monitor changes in process variability. Control limits are derived directly from the voice of the process: X-bar UCL = X_double_bar + A2 * R_bar, and LCL = X_double_bar - A2 * R_bar, where A2 is an empirical constant (0.577 for n=5). Crucially, control limits are never customer specification limits; control limits represent the 3-sigma natural behavior of the machine. Any point breaching control limits proves the presence of a special cause requiring immediate root-cause investigation.'
        ],
        example: 'In a pharmaceutical bottling line filling 500 mL sterile saline vials, operators sample 5 vials every 30 minutes. If subgroup 4 registers an average fill of 500.5 mL against an Upper Control Limit of 500.394 mL, the operator halts the filler to inspect valve actuator wear before thousands of out-of-spec vials enter packaging.',
        code: `# Shewhart X-bar and R Control Chart Engine
def shewhart_xbar_r_chart(
    subgroups: list[list[float]],
    a2: float = 0.577,
    d3: float = 0.0,
    d4: float = 2.114
) -> dict:
    subgroup_means = [sum(sg) / len(sg) for sg in subgroups]
    subgroup_ranges = [max(sg) - min(sg) for sg in subgroups]

    # 1. Grand Mean and Mean Range
    x_double_bar = sum(subgroup_means) / len(subgroup_means)
    r_bar = sum(subgroup_ranges) / len(subgroup_ranges)

    # 2. Control Limits for X-bar Chart
    x_ucl = x_double_bar + (a2 * r_bar)
    x_lcl = x_double_bar - (a2 * r_bar)

    # 3. Control Limits for R Chart
    r_ucl = d4 * r_bar
    r_lcl = d3 * r_bar

    # 4. Out-of-Control Detection
    x_violations = [
        {"Subgroup": idx + 1, "Mean": round(m, 3)}
        for idx, m in enumerate(subgroup_means) if m > x_ucl or m < x_lcl
    ]
    r_violations = [
        {"Subgroup": idx + 1, "Range": round(r, 3)}
        for idx, r in enumerate(subgroup_ranges) if r > r_ucl or r < r_lcl
    ]

    is_in_control = len(x_violations) == 0 and len(r_violations) == 0

    return {
        "Total_Subgroups": len(subgroups),
        "Grand_Mean_Xbar": round(x_double_bar, 3),
        "Mean_Range_Rbar": round(r_bar, 3),
        "Xbar_UCL": round(x_ucl, 3),
        "Xbar_LCL": round(x_lcl, 3),
        "R_UCL": round(r_ucl, 3),
        "R_LCL": round(r_lcl, 3),
        "In_Control": is_in_control,
        "Xbar_Violations": len(x_violations),
        "R_Violations": len(r_violations)
    }

samples = [
    [500.1, 500.3, 499.8, 500.2, 500.0],
    [500.2, 500.4, 500.1, 499.9, 500.3],
    [499.9, 500.0, 500.2, 500.1, 499.8],
    [500.5, 500.6, 500.4, 500.3, 500.7],
    [500.0, 499.8, 500.1, 500.2, 499.9],
    [500.2, 500.1, 500.3, 500.0, 500.2]
]

spc_res = shewhart_xbar_r_chart(samples)
for k, v in spc_res.items():
    print(f"{k}: {v}")`,
        output: `Total_Subgroups: 6
Grand_Mean_Xbar: 500.153
Mean_Range_Rbar: 0.417
Xbar_UCL: 500.394
Xbar_LCL: 499.913
R_UCL: 0.881
R_LCL: 0.0
In_Control: False
Xbar_Violations: 1
R_Violations: 0`,
        codeNotes: [
          { line: 8, note: 'Calculates sample means and ranges across each rational subgroup of 5 measurements' },
          { line: 15, note: 'Applies Shewhart empirical constant A2 (0.577) to determine 3-sigma X-bar limits' },
          { line: 26, note: 'Flags subgroup 4 (mean 500.5) as an assignable cause breach exceeding UCL 500.394' },
          { line: 40, note: 'Declares In_Control as False, triggering immediate root-cause maintenance protocols' }
        ],
        tryIt: 'Adjust subgroup 4 values down by 0.25 mL each to bring its mean back within UCL and confirm In_Control becomes True.',
        check: {
          question: 'What is the critical operational distinction between Specification Limits and Control Limits?',
          options: [
            'Specification limits represent customer or regulatory tolerance expectations, whereas control limits represent the 3-sigma natural statistical capability of the actual process.',
            'Specification limits are calculated with Shewhart constants, while control limits are defined by marketing managers.',
            'Specification limits must always be narrower than control limits under ISO 9001 regulations.',
            'There is no distinction; both terms describe the upper and lower thresholds of customer warranty claims.'
          ],
          answer: 0,
          why: 'Specification limits define what the customer requires, whereas control limits define what the process is currently delivering in statistical equilibrium.',
          answerIndex: 0,
          explanation: 'Specification limits define what the customer requires, whereas control limits define what the process is currently delivering in statistical equilibrium.'
        }
      },
      {
        title: 'Attribute Quality Control: p-Chart & Western Electric / Nelson Rules',
        say: [
          'While variables control charts (like X-bar and R) track continuous dimensions like diameter, weight, or voltage, many enterprise operations evaluate quality as binary attributes: a circuit board passes or fails functional testing, an invoice is approved or rejected, or a surgical delivery kit is sterile or contaminated. In attribute quality control, the workhorse tool is the p-Chart, which models the proportion of non-conforming items per inspection lot based on the binomial distribution.',
          'The center line of the p-chart is the historical average defect proportion p_bar = Total Defectives / Total Inspected. Control limits reflect the binomial standard error: UCL = p_bar + 3 * sqrt(p_bar * (1 - p_bar) / n), and LCL = max(0, p_bar - 3 * sqrt(p_bar * (1 - p_bar) / n)). When sample sizes vary between lots, the control limits adjust dynamically for each lot size. A single point exceeding the UCL indicates an immediate spike in defect rates.',
          'However, waiting for a single data point to cross the 3-sigma control limit often allows defective inventory to accumulate unnoticed. Modern quality systems apply Western Electric and Nelson Rules to detect subtle non-random patterns: Rule 1 flags any point beyond 3-sigma; Rule 2 flags 9 consecutive points on one side of the center line (a persistent mean shift); and Rule 3 flags 6 consecutive points steadily increasing or decreasing (a systematic drift, such as progressive machine tool wear). Detecting these early indicators enables proactive intervention before catastrophic process breakdown.'
        ],
        example: 'On an automated surface-mount PCB assembly line inspecting 1,000 solder joints per batch, an average defect rate of 1.34% gives a UCL of 2.43%. If defect rates rise over 6 consecutive batches (1.1%, 1.3%, 1.5%, 1.7%, 1.9%, 2.2%), Nelson Rule 3 detects stencil clogging hours before defects exceed the 3-sigma threshold.',
        code: `# Attribute p-Chart & Nelson Rules Detection Engine
import math

def evaluate_p_chart_and_nelson_rules(
    lot_sizes: list[int],
    defectives: list[int]
) -> dict:
    total_inspected = sum(lot_sizes)
    total_defectives = sum(defectives)
    p_bar = total_defectives / total_inspected

    proportions = [d / n for d, n in zip(defectives, lot_sizes)]
    n_avg = total_inspected / len(lot_sizes)
    sigma_p = math.sqrt((p_bar * (1.0 - p_bar)) / n_avg)

    # 1. 3-Sigma Control Limits
    ucl = min(1.0, p_bar + (3.0 * sigma_p))
    lcl = max(0.0, p_bar - (3.0 * sigma_p))

    # 2. Nelson Rule 1: Single point beyond 3-sigma
    rule1_alerts = [i + 1 for i, p in enumerate(proportions) if p > ucl or p < lcl]

    # 3. Nelson Rule 2: 9 consecutive points on one side of center line
    rule2_alerts = []
    consecutive_side = 0
    last_side = None
    for i, p in enumerate(proportions):
        side = "above" if p > p_bar else ("below" if p < p_bar else "on")
        if side == last_side and side != "on":
            consecutive_side += 1
        else:
            consecutive_side = 1
            last_side = side
        if consecutive_side >= 9:
            rule2_alerts.append(i + 1)

    # 4. Nelson Rule 3: 6 consecutive points steadily trending
    rule3_alerts = []
    trend_count = 1
    trend_dir = None
    for i in range(1, len(proportions)):
        diff = proportions[i] - proportions[i - 1]
        cur_dir = "up" if diff > 0 else ("down" if diff < 0 else "flat")
        if cur_dir == trend_dir and cur_dir != "flat":
            trend_count += 1
        else:
            trend_count = 2 if cur_dir != "flat" else 1
            trend_dir = cur_dir
        if trend_count >= 6:
            rule3_alerts.append(i + 1)

    stable = not (rule1_alerts or rule2_alerts or rule3_alerts)

    return {
        "Total_Lots": len(lot_sizes),
        "Avg_Lot_Size": int(n_avg),
        "P_Bar": round(p_bar, 4),
        "Sigma_P": round(sigma_p, 4),
        "UCL": round(ucl, 4),
        "LCL": round(lcl, 4),
        "Rule1_Outliers": rule1_alerts,
        "Rule2_Run_Alerts": rule2_alerts,
        "Rule3_Trend_Alerts": rule3_alerts,
        "System_State": "Statistically Stable" if stable else "Special Cause Detected"
    }

lots = [1000] * 8
defects = [12, 14, 11, 15, 13, 16, 12, 14]

p_res = evaluate_p_chart_and_nelson_rules(lots, defects)
for k, v in p_res.items():
    print(f"{k}: {v}")`,
        output: `Total_Lots: 8
Avg_Lot_Size: 1000
P_Bar: 0.0134
Sigma_P: 0.0036
UCL: 0.0243
LCL: 0.0025
Rule1_Outliers: []
Rule2_Run_Alerts: []
Rule3_Trend_Alerts: []
System_State: Statistically Stable`,
        codeNotes: [
          { line: 12, note: 'Computes binomial standard error sigma_p from aggregate defectives and sample size' },
          { line: 16, note: 'Applies 3-sigma bounds ensuring LCL is clamped to zero to prevent impossible negative limits' },
          { line: 23, note: 'Implements Nelson Rule 2 run tracking across consecutive points relative to p_bar' },
          { line: 38, note: 'Detects Nelson Rule 3 monotonicity trends (6 consecutive points increasing or decreasing)' }
        ],
        tryIt: 'Change defects to [10, 12, 14, 16, 18, 20, 22, 23] and verify that Rule3_Trend_Alerts flags a continuous degradation trend.',
        check: {
          question: 'What operational advantage does implementing Nelson Rules provide over relying exclusively on 3-sigma control limit breaches?',
          options: [
            'Nelson Rules identify non-random systematic patterns (such as 6 points trending or 9 points on one side) long before a data point crosses the 3-sigma boundary, enabling early corrective action.',
            'Nelson Rules allow factories to eliminate inspection labor entirely.',
            'Nelson Rules convert attribute defect counts into continuous millivolt signals.',
            'Nelson Rules guarantee that standard deviation drops to zero.'
          ],
          answer: 0,
          why: 'Nelson Rules detect non-random runs and trends while the process is still technically within 3-sigma bounds, preventing severe out-of-control failures.',
          answerIndex: 0,
          explanation: 'Nelson Rules detect non-random runs and trends while the process is still technically within 3-sigma bounds, preventing severe out-of-control failures.'
        }
      },
      {
        title: 'Measurement System Analysis (MSA) & Gage Repeatability and Reproducibility (Gage R&R)',
        say: [
          'Before an operations team can draw valid conclusions from process capability indices or control charts, they must answer a critical question: is our measurement system capable of detecting true part variation, or are our readings dominated by measurement noise? If your measurement system is noisy, you will scrap perfectly good parts (Producer\'s Risk) and ship defective parts to customers (Consumer\'s Risk). Measurement System Analysis (MSA) evaluates the precision and accuracy of gages, sensors, and human inspectors.',
          'Under classical MSA variance decomposition, total observed variance sigma_total^2 equals the sum of true part-to-part variance sigma_part^2 and measurement system error sigma_measurement^2. Measurement error further breaks down into two core components: Repeatability and Reproducibility. Repeatability (Equipment Variation, EV) represents the variation observed when the same appraiser measures the same part multiple times using the same gage. Reproducibility (Appraiser Variation, AV) represents the variation observed when different appraisers measure the identical part using the same gage.',
          'The Automotive Industry Action Group (AIAG) standardizes Gage R&R evaluation via Percentage Gage R&R: %GRR = (sigma_gage_rr / sigma_total) * 100. AIAG defines three strict operational tiers: %GRR < 10% is fully acceptable for production; 10% to 30% is marginally acceptable depending on part criticality and cost of failure; and %GRR > 30% is completely unacceptable, requiring gage recalibration, fixturing redesign, or operator retraining. Additionally, the Number of Distinct Categories (ndc = 1.41 * sigma_part / sigma_gage_rr) must equal at least 5 to ensure the gage can reliably discriminate between subtle part differences.'
        ],
        example: 'In an electric vehicle battery pack manufacturing plant, three quality technicians measure laser weld depth on 10 sample terminals. With a total process standard deviation of 0.2179 mm and a combined Gage R&R standard deviation of 0.05 mm, %GRR is 22.94% and ndc is 5, classifying the measurement rig as marginally acceptable for production monitoring.',
        code: `# Measurement System Analysis & Gage R&R Decomposition
import math

def calculate_gage_rr(
    part_variance: float,
    repeatability_var: float,
    reproducibility_var: float
) -> dict:
    # 1. Total Measurement System Variance (Gage R&R)
    gage_rr_var = repeatability_var + reproducibility_var
    gage_rr_sd = math.sqrt(gage_rr_var)

    # 2. Total Combined Process Variance
    total_variance = part_variance + gage_rr_var
    total_sd = math.sqrt(total_variance)

    # 3. % Gage R&R based on Standard Deviation ratio
    pct_grr = (gage_rr_sd / total_sd) * 100.0

    # 4. Number of Distinct Categories: ndc = 1.41 * (part_sd / gage_rr_sd)
    part_sd = math.sqrt(part_variance)
    ndc = int(1.41 * (part_sd / gage_rr_sd))

    # 5. AIAG Industrial Classification Thresholds
    if pct_grr < 10.0:
        verdict = "Acceptable (< 10%)"
    elif pct_grr <= 30.0:
        verdict = "Marginal (10% - 30%)"
    else:
        verdict = "Unacceptable (> 30%)"

    return {
        "Repeatability_EV_SD": round(math.sqrt(repeatability_var), 4),
        "Reproducibility_AV_SD": round(math.sqrt(reproducibility_var), 4),
        "Total_Gage_RR_SD": round(gage_rr_sd, 4),
        "Part_to_Part_SD": round(part_sd, 4),
        "Total_Process_SD": round(total_sd, 4),
        "Pct_Gage_RR": round(pct_grr, 2),
        "Distinct_Categories_ndc": ndc,
        "AIAG_Verdict": verdict
    }

grr_res = calculate_gage_rr(
    part_variance=0.0450,
    repeatability_var=0.0016,
    reproducibility_var=0.0009
)

for k, v in grr_res.items():
    print(f"{k}: {v}")`,
        output: `Repeatability_EV_SD: 0.04
Reproducibility_AV_SD: 0.03
Total_Gage_RR_SD: 0.05
Part_to_Part_SD: 0.2121
Total_Process_SD: 0.2179
Pct_Gage_RR: 22.94
Distinct_Categories_ndc: 5
AIAG_Verdict: Marginal (10% - 30%)`,
        codeNotes: [
          { line: 5, note: 'Decomposes total measurement variance into Equipment Variation (EV) and Appraiser Variation (AV)' },
          { line: 16, note: 'Calculates %GRR as the ratio of measurement standard deviation to total observed standard deviation' },
          { line: 19, note: 'Computes ndc (number of distinct categories), verifying the gage can distinguish at least 5 part groups' },
          { line: 24, note: 'Classifies the gage as Marginal under AIAG standards, warranting operator fixture improvements' }
        ],
        tryIt: 'Reduce repeatability variance to 0.0002 to model a precision automated optical comparator and observe %GRR drop below 10%.',
        check: {
          question: 'If a plant\'s Gage R&R analysis reveals a %GRR of 38%, what operational action must leadership take?',
          options: [
            'Accept the process because 38% falls well within statistical 3-sigma tolerance bands.',
            'Halve the customer specification limits to compensate for gage error.',
            'Halt formal capability studies and upgrade or recalibrate the measurement equipment, because over 30% measurement error masks true part quality.',
            'Increase production speed by 38% to minimize the time parts spend inside the measuring fixture.'
          ],
          answer: 2,
          why: 'Under AIAG standards, a %GRR exceeding 30% is unacceptable because measurement error consumes too much tolerance, rendering capability metrics and quality decisions invalid.',
          answerIndex: 2,
          explanation: 'Under AIAG standards, a %GRR exceeding 30% is unacceptable because measurement error consumes too much tolerance, rendering capability metrics and quality decisions invalid.'
        }
      },
      {
        title: 'Cost of Quality (CoQ) Analytics & PAF Economic Optimization Engine',
        say: [
          'Quality is often mistakenly treated as an overhead cost that reduces company profits. In truth, poor quality is the single largest hidden destroyer of operational margin. Armand Feigenbaum and Joseph Juran developed the Prevention-Appraisal-Failure (PAF) model to quantify the economics of quality. Under the PAF model, the Cost of Quality (CoQ) separates into two broad categories: the Cost of Conformance (good money invested to do things right) and the Cost of Non-Conformance (bad money wasted because things were done wrong).',
          'The Cost of Conformance consists of Prevention Costs (investments in robust product design, supplier audits, employee training, and automated poka-yoke error-proofing) and Appraisal Costs (testing, inspection, gage calibration, and quality audits). The Cost of Non-Conformance divides into Internal Failure Costs (scrap, rework, machine downtime, and reinspection occurring before shipment) and External Failure Costs (customer returns, warranty claims, field recalls, legal liability, and brand reputation loss).',
          'The fundamental economic law of operations is the 1-10-100 Rule: spending $1 on upstream Prevention eliminates $10 in Appraisal testing and prevents $100 in catastrophic External Failure costs. High-performing manufacturing companies keep total Cost of Quality below 3% to 5% of revenue, with over 70% of that budget concentrated in Prevention and Appraisal. In contrast, low-maturity operations routinely bleed 15% to 25% of revenue in internal scrap and external customer warranties. Modeling CoQ empowers operations managers to justify preventive capital investments with indisputable economic ROI.'
        ],
        example: 'A medical device company generating $15M in revenue discovers that internal scrap ($380K) and customer warranty replacements ($540K) total $920K annually (83.6% of all quality costs). Shifting $60K into automated poka-yoke inspection eliminates the bulk of warranty failures, generating an immediate 15x return on quality investment.',
        code: `# Cost of Quality (CoQ) & PAF Economic Optimization Engine
def analyze_cost_of_quality(
    prevention: float,
    appraisal: float,
    internal_failure: float,
    external_failure: float,
    annual_revenue: float
) -> dict:
    # 1. Conformance vs Non-Conformance Breakdown
    total_conformance = prevention + appraisal
    total_non_conformance = internal_failure + external_failure
    total_coq = total_conformance + total_non_conformance

    # 2. Key Financial Ratios
    coq_revenue_pct = (total_coq / annual_revenue) * 100.0
    failure_share_pct = (total_non_conformance / total_coq) * 100.0

    # 3. 1-10-100 Rule Leverage Ratio: Failure costs avoided per dollar of prevention
    prevention_leverage_ratio = round(total_non_conformance / max(1.0, prevention), 1)

    # 4. Strategic Governance Recommendation
    if failure_share_pct > 60.0:
        recommendation = "Shift budget upstream to Prevention to eliminate high Failure costs"
    else:
        recommendation = "Balanced Quality Portfolio"

    return {
        "Annual_Revenue": "$" + f"{annual_revenue:,.2f}",
        "Prevention_Cost": "$" + f"{prevention:,.2f}",
        "Appraisal_Cost": "$" + f"{appraisal:,.2f}",
        "Internal_Failure_Cost": "$" + f"{internal_failure:,.2f}",
        "External_Failure_Cost": "$" + f"{external_failure:,.2f}",
        "Total_Cost_of_Quality": "$" + f"{total_coq:,.2f}",
        "CoQ_Pct_of_Revenue": round(coq_revenue_pct, 2),
        "NonConformance_Share_Pct": round(failure_share_pct, 1),
        "Prevention_Leverage_Ratio": prevention_leverage_ratio,
        "Strategic_Recommendation": recommendation
    }

coq_res = analyze_cost_of_quality(
    prevention=60_000.0,
    appraisal=120_000.0,
    internal_failure=380_000.0,
    external_failure=540_000.0,
    annual_revenue=15_000_000.0
)

for k, v in coq_res.items():
    print(f"{k}: {v}")`,
        output: `Annual_Revenue: $15,000,000.00
Prevention_Cost: $60,000.00
Appraisal_Cost: $120,000.00
Internal_Failure_Cost: $380,000.00
External_Failure_Cost: $540,000.00
Total_Cost_of_Quality: $1,100,000.00
CoQ_Pct_of_Revenue: 7.33
NonConformance_Share_Pct: 83.6
Prevention_Leverage_Ratio: 15.3
Strategic_Recommendation: Shift budget upstream to Prevention to eliminate high Failure costs`,
        codeNotes: [
          { line: 9, note: 'Groups quality expenses into Conformance (Prevention + Appraisal) and Non-Conformance (Failures)' },
          { line: 15, note: 'Measures total CoQ as a percentage of revenue and highlights the non-conformance proportion' },
          { line: 18, note: 'Computes the Prevention Leverage Ratio illustrating the 1-10-100 economic multiplier' },
          { line: 40, note: 'Identifies an 83.6% failure burden, justifying upstream capital investment in automated poka-yoke controls' }
        ],
        tryIt: 'Double prevention to $120,000 and reduce external failure to $50,000 to see non-conformance share collapse below 50%.',
        check: {
          question: 'Under the 1-10-100 Rule of quality management, which category of quality expenditure delivers the highest financial return on investment?',
          options: [
            'Prevention Costs, because every dollar spent designing defects out of the process avoids an order-of-magnitude increase in downstream inspection and catastrophic failure costs.',
            'External Failure Costs, because customer warranty claims generate tax write-offs for the accounting department.',
            'Appraisal Costs, because hiring more inspectors is the most efficient way to achieve Six Sigma.',
            'Scrap disposal costs, because selling scrapped metal increases secondary revenue.'
          ],
          answer: 0,
          why: 'The 1-10-100 rule demonstrates that spending $1 on Prevention eliminates $10 in Appraisal testing and $100 in catastrophic customer Failure costs.',
          answerIndex: 0,
          explanation: 'The 1-10-100 rule demonstrates that spending $1 on Prevention eliminates $10 in Appraisal testing and $100 in catastrophic customer Failure costs.'
        }
      }
    ],
    summary: [
      'Process Capability (Cp vs Cpk): Cp measures potential spread relative to tolerance, while Cpk penalizes mean offset; Cpk >= 1.33 is capable and >= 1.67 is world-class.',
      'Statistical Process Control: Shewhart X-bar and R charts separate random common cause variation from assignable special cause signals using empirical constants.',
      'Attribute Control & Nelson Rules: Binomial p-charts track defective proportions, while Nelson Rules detect non-random runs and monotonic trends prior to 3-sigma breaches.',
      'Measurement System Analysis (MSA): Gage R&R decomposes variance into Repeatability (EV) and Reproducibility (AV); %GRR < 10% is acceptable, while > 30% renders measurement invalid.',
      'Cost of Quality (CoQ): The PAF model and 1-10-100 Rule demonstrate that investing in upstream Prevention yields exponential savings over downstream internal and external failure costs.'
    ],
    projectStep: {
      title: 'Statistical Process Control & Gage R&R Quality Architecture',
      steps: [
        'Calculate continuous process capability indices (Cp and Cpk) to benchmark manufacturing tolerances against Six Sigma DPMO targets.',
        'Construct Shewhart X-bar and R control charts to distinguish common cause background noise from assignable special causes.',
        'Implement an attribute p-chart equipped with Western Electric and Nelson Rules to detect insidious process drift.',
        'Perform a Gage R&R variance decomposition study to validate measurement tool precision, and optimize quality spend via the PAF Cost of Quality framework.'
      ]
    }
  }
,
  {
    coursePrefix: 'bcom_ops',
    day: 4,
    title: 'Queuing Theory (M/M/1, M/M/c), Erlang C & Service Capacity Economics',
    goal: 'Master stochastic service operations and waiting line mathematics: computing M/M/1 queue dynamics, unlocking multi-server pooling efficiencies with M/M/c, sizing contact center staff using Erlang C, optimizing trade-offs between labor wages and customer delay costs, and scheduling dynamic non-stationary shifts.',
    minutes: 44,
    recap: 'In Day 3, we mastered Six Sigma DMAIC, process capability indices (Cp, Cpk), Shewhart control charts, Gage R&R, and Cost of Quality economics. Today, we confront the inevitable randomness of human and digital service systems through Queuing Theory and Erlang capacity engineering.',
    parts: [
      {
        title: 'Single-Server Queuing Dynamics (M/M/1) & Little\'s Law Under Congestion',
        say: [
          'In operational environments ranging from cloud API gateways and drive-thru windows to hospital triage desks, demand arrivals and service durations are fundamentally random. When demand is stochastic, having average service capacity greater than average arrival rate does not prevent queues from forming. Because arrivals arrive in random clumps and service times vary, buffers fill up during micro-bursts, creating waiting lines even when a facility is theoretically under-utilized.',
          'Under Kendall\'s notation, the classic single-server queue is designated M/M/1: Markovian (Poisson) arrivals with rate lambda, Markovian (exponential) service times with rate mu, and 1 server operating under First-Come-First-Served (FCFS) discipline. The system\'s traffic intensity or server utilization is rho = lambda / mu. A cardinal law of queuing theory is that rho must be strictly less than 1.0; if lambda >= mu, the queue becomes non-stationary and explodes towards infinity.',
          'Crucially, as traffic intensity rho approaches 1.0, queue length and customer wait times do not grow linearly—they surge hyperbolically. Kingman\'s heavy-traffic approximation reveals that average queue wait time Wq is proportional to rho / (1 - rho). When utilization climbs from 80% to 90%, queue length doubles; when it climbs from 90% to 95%, queue length doubles again. Little\'s Law (L = lambda * W and Lq = lambda * Wq) provides the invariant bridge linking the average number of customers in the system to their elapsed wait time.'
        ],
        example: 'At a bank drive-thru teller window where cars arrive at lambda = 45 per hour and the teller serves mu = 50 per hour, utilization is 90%. Even though the teller has 10% spare capacity on average, random arrival bursts cause an average queue of 8.1 vehicles and an average customer delay of 10.8 minutes.',
        code: `# Quantitative M/M/1 Queuing & Congestion Analysis
def evaluate_mm1_queue(
    arrival_rate_lambda: float,
    service_rate_mu: float
) -> dict:
    # 1. Server Traffic Intensity (Utilization)
    rho = arrival_rate_lambda / service_rate_mu
    if rho >= 1.0:
        raise ValueError("Queue is unstable: arrival rate exceeds service capacity")

    # 2. Average Entities in System (L) and Waiting in Queue (Lq)
    l_sys = rho / (1.0 - rho)
    l_queue = (rho ** 2) / (1.0 - rho)

    # 3. Elapsed Time in System (W) and Waiting in Queue (Wq) via Little\'s Law
    w_sys_hr = 1.0 / (service_rate_mu - arrival_rate_lambda)
    w_queue_hr = rho / (service_rate_mu - arrival_rate_lambda)

    # Convert to minutes for operational reporting
    w_sys_min = w_sys_hr * 60.0
    w_queue_min = w_queue_hr * 60.0

    # 4. Probability the System is Completely Idle (P0)
    p0 = 1.0 - rho

    return {
        "Arrival_Rate_Lambda": arrival_rate_lambda,
        "Service_Rate_Mu": service_rate_mu,
        "Traffic_Intensity_Rho": round(rho, 3),
        "Avg_In_System_L": round(l_sys, 2),
        "Avg_In_Queue_Lq": round(l_queue, 2),
        "Avg_Time_System_Min": round(w_sys_min, 2),
        "Avg_Wait_Queue_Min": round(w_queue_min, 2),
        "Idle_Probability_P0": round(p0, 3)
    }

mm1_res = evaluate_mm1_queue(
    arrival_rate_lambda=45.0,
    service_rate_mu=50.0
)

for k, v in mm1_res.items():
    print(f"{k}: {v}")`,
        output: `Arrival_Rate_Lambda: 45.0
Service_Rate_Mu: 50.0
Traffic_Intensity_Rho: 0.9
Avg_In_System_L: 9.0
Avg_In_Queue_Lq: 8.1
Avg_Time_System_Min: 12.0
Avg_Wait_Queue_Min: 10.8
Idle_Probability_P0: 0.1`,
        codeNotes: [
          { line: 6, note: 'Calculates traffic intensity rho, asserting stability constraint rho < 1.0' },
          { line: 12, note: 'Evaluates hyperbolic queue explosion as rho reaches 0.90 (8.1 customers waiting)' },
          { line: 15, note: 'Applies Little\'s Law to convert queue counts into customer wait minutes' },
          { line: 31, note: 'Confirms that even with 10% idle buffer, average customer wait is 10.8 minutes' }
        ],
        tryIt: 'Increase arrival rate to 48.0 cars/hr (96% utilization) and observe average wait time in queue surge to 36.0 minutes.',
        check: {
          question: 'Why does an M/M/1 queuing system operating at 95% utilization experience massive waiting delays even though average capacity exceeds average demand?',
          options: [
            'Because stochastic variability causes arrival clusters and service delays to compound non-linearly; queue wait time grows hyperbolically as 1 / (1 - rho).',
            'Because Little\'s Law is mathematically invalid when utilization exceeds 75%.',
            'Because Markovian queues automatically halt when servers reach 90% utilization.',
            'Because customer demand always drops to zero when utilization is high.'
          ],
          answer: 0,
          why: 'In stochastic systems, wait time is governed by 1 / (mu - lambda); as lambda approaches mu, variance causes queues to compound asymptotically towards infinity.',
          answerIndex: 0,
          explanation: 'In stochastic systems, wait time is governed by 1 / (mu - lambda); as lambda approaches mu, variance causes queues to compound asymptotically towards infinity.'
        }
      },
      {
        title: 'Multi-Server Queuing Architecture (M/M/c) & The Pooling Efficiency Dividend',
        say: [
          'When service volume outstrips the capacity of a single worker or server, operations scale by adding parallel servers (c servers). In an M/M/c queuing system, c identical servers operate in parallel. However, the architectural configuration of the queue makes an enormous operational difference: should each server maintain an independent line (like traditional supermarket checkout aisles), or should all c servers draw from a single shared serpentine queue (like an airport border control checkpoint or post office)?',
          'Mathematical queuing theory proves that pooling multiple independent queues into a single shared queue yields massive efficiency dividends. In an unpooled system with c separate lines, one server can sit idle because their line is empty while adjacent servers remain swamped with backlogged customers. In a pooled M/M/c system, no server is ever idle as long as a single customer is waiting in the shared queue. The combined system achieves higher effective utilization, completely eliminates the frustrating "wrong line" effect, and drastically reduces customer wait times.',
          'In an M/M/c queue, aggregate traffic intensity across all servers is rho = lambda / (c * mu). The mathematical formulation requires first determining P0 (the probability that all c servers are idle) using a combinatorial summation of offered load A = lambda / mu across states 0 through c-1 plus a geometric series for the congestion state. From P0, we compute average queue length Lq and queue wait Wq. Pooling identical queues typically slashes customer waiting time by 60% to 80% without spending a single additional dollar on labor.'
        ],
        example: 'An airport security screening hall processes lambda = 120 passengers/hour with 3 X-ray lanes (each lane mu = 45 passengers/hr). If passengers choose 3 independent lines, average wait in line is 10.67 minutes. Consolidating into 1 serpentine queue feeding all 3 lanes slashes average wait to 3.19 minutes—a 70.1% reduction in passenger delay with identical staffing.',
        code: `# M/M/c Multi-Server Queuing & Resource Pooling Engine
import math

def evaluate_mmc_queue(
    arrival_rate_lambda: float,
    service_rate_mu: float,
    num_servers_c: int
) -> dict:
    rho = arrival_rate_lambda / (num_servers_c * service_rate_mu)
    if rho >= 1.0:
        raise ValueError("Multi-server queue is unstable: rho >= 1.0")

    # 1. Offered Load in Erlangs
    erlangs_a = arrival_rate_lambda / service_rate_mu

    # 2. Probability of Zero Customers in System (P0)
    sum_terms = sum((erlangs_a ** n) / math.factorial(n) for n in range(num_servers_c))
    c_term = (erlangs_a ** num_servers_c) / (math.factorial(num_servers_c) * (1.0 - rho))
    p0 = 1.0 / (sum_terms + c_term)

    # 3. Average Customers Waiting in Queue (Lq)
    l_queue = (p0 * (erlangs_a ** num_servers_c) * rho) / (math.factorial(num_servers_c) * ((1.0 - rho) ** 2))

    # 4. Average Wait Time in Queue (Wq) via Little\'s Law
    w_queue_hr = l_queue / arrival_rate_lambda
    w_queue_min = w_queue_hr * 60.0

    # 5. Total Customers in System (L) and Time in System (W)
    l_sys = l_queue + erlangs_a
    w_sys_min = (l_sys / arrival_rate_lambda) * 60.0

    # 6. Unpooled Baseline: c independent M/M/1 queues with lambda/c each
    indep_lambda = arrival_rate_lambda / num_servers_c
    indep_rho = indep_lambda / service_rate_mu
    indep_wq_min = (indep_rho / (service_rate_mu - indep_lambda)) * 60.0
    pooling_savings_pct = round(((indep_wq_min - w_queue_min) / indep_wq_min) * 100.0, 1)

    return {
        "Servers_c": num_servers_c,
        "Total_Arrival_Lambda": arrival_rate_lambda,
        "Offered_Load_Erlangs": round(erlangs_a, 2),
        "Traffic_Intensity_Rho": round(rho, 3),
        "System_Idle_P0": round(p0, 4),
        "Avg_In_Queue_Lq": round(l_queue, 2),
        "Avg_Wait_Queue_Min": round(w_queue_min, 2),
        "Avg_Time_System_Min": round(w_sys_min, 2),
        "Unpooled_Wait_Min": round(indep_wq_min, 2),
        "Pooling_Wait_Savings_Pct": pooling_savings_pct
    }

mmc_res = evaluate_mmc_queue(
    arrival_rate_lambda=120.0,
    service_rate_mu=45.0,
    num_servers_c=3
)

for k, v in mmc_res.items():
    print(f"{k}: {v}")`,
        output: `Servers_c: 3
Total_Arrival_Lambda: 120.0
Offered_Load_Erlangs: 2.67
Traffic_Intensity_Rho: 0.889
System_Idle_P0: 0.028
Avg_In_Queue_Lq: 6.38
Avg_Wait_Queue_Min: 3.19
Avg_Time_System_Min: 4.52
Unpooled_Wait_Min: 10.67
Pooling_Wait_Savings_Pct: 70.1`,
        codeNotes: [
          { line: 16, note: 'Calculates state P0 accounting for both sub-saturation and saturated server regimes' },
          { line: 20, note: 'Computes M/M/c average queue length Lq under aggregate Poisson arrivals' },
          { line: 31, note: 'Compares pooled performance directly against c isolated independent M/M/1 lines' },
          { line: 40, note: 'Demonstrates a dramatic 70.1% reduction in queue wait time purely through queue pooling architecture' }
        ],
        tryIt: 'Add a 4th server (num_servers_c = 4) and observe average queue wait drop from 3.19 minutes down to just 0.44 minutes.',
        check: {
          question: 'What is the primary mathematical reason why a pooled M/M/c queue outperforms c independent M/M/1 queues with identical aggregate capacity?',
          options: [
            'Pooling eliminates server idle-time imbalance: in an unpooled system, one server can sit idle while others have long lines, whereas in a pooled system no server ever idles while customers wait.',
            'Pooled queues violate the laws of probability to speed up human service times.',
            'Unpooled queues require twice as many physical computers and chairs.',
            'Because Erlangs only exist in systems with a single consolidated line.'
          ],
          answer: 0,
          why: 'Resource pooling prevents server starvation; by allowing any free server to pull the next waiting customer from a single queue, idle capacity is never wasted while demand exists.',
          answerIndex: 0,
          explanation: 'Resource pooling prevents server starvation; by allowing any free server to pull the next waiting customer from a single queue, idle capacity is never wasted while demand exists.'
        }
      },
      {
        title: 'The Erlang C Formula & Contact Center Service Level (SLA) Optimization',
        say: [
          'In modern digital commerce, fintech, and telecommunications, customer support centers are massive operational cost centers governed by strict Service Level Agreements (SLAs). The universal telecommunications benchmark is the "80/20 Rule": 80% of incoming customer inquiries must be answered within 20 seconds. Sizing headcount to meet this SLA cannot be solved by simple division; if you hire just enough agents to cover the raw call minutes, half your customers will experience agonizing hold times.',
          'Danish mathematician A.K. Erlang developed the foundational mathematical model for call centers: the Erlang C formula. Erlang C computes the exact probability that an arriving inquiry will find all c agents busy and be forced to wait: P(W > 0) = C(c, A), where A = lambda / mu represents the offered traffic intensity in dimensionless Erlangs. One Erlang equals one full hour of continuous server workload.',
          'To determine whether a contact center satisfies its contractual SLA, we calculate the cumulative probability of answering within target seconds t: P(Wait <= t) = 1 - C(c, A) * exp(-(c * mu - lambda) * t). By iterating through server headcount c, operations managers find the precise minimal staffing level that meets or exceeds target SLA percentages while maximizing agent utilization and preventing burnout.'
        ],
        example: 'A fintech customer support desk receives 150 calls per hour with an average handle time of 3.0 minutes (mu = 20 calls/hr/agent). The offered workload is A = 7.5 Erlangs. Simple division suggests 8 agents could handle the load, but Erlang C proves 8 agents would result in a 78% call delay rate. Adding 3 more agents (c = 11) achieves an 88.1% SLA answered within 20 seconds, with an average wait of only 9.0 seconds.',
        code: `# Erlang C Contact Center Headcount & SLA Optimization Engine
import math

def erlang_c_staffing_optimizer(
    calls_per_hour: float,
    avg_handle_time_min: float,
    target_wait_sec: float,
    target_sla_pct: float
) -> dict:
    # 1. Service Rate per Agent per Hour & Offered Load in Erlangs
    service_rate_per_hour = 60.0 / avg_handle_time_min
    erlangs_a = calls_per_hour / service_rate_per_hour

    # Minimum theoretical servers required for stability (rho < 1.0)
    min_servers = math.ceil(erlangs_a + 0.001)

    results = []
    optimal_c = None

    for c in range(min_servers, min_servers + 8):
        rho = erlangs_a / c
        if rho >= 1.0:
            continue

        # 2. State P0 Calculation
        sum_terms = sum((erlangs_a ** n) / math.factorial(n) for n in range(c))
        c_term = (erlangs_a ** c) / (math.factorial(c) * (1.0 - rho))
        p0 = 1.0 / (sum_terms + c_term)

        # 3. Erlang C Probability of Delay P(W > 0)
        prob_delay = c_term * p0

        # 4. Service Level Probability: P(Wait <= target_wait_sec)
        target_wait_hr = target_wait_sec / 3600.0
        exp_decay = math.exp(-(c * service_rate_per_hour - calls_per_hour) * target_wait_hr)
        sla_achieved = (1.0 - (prob_delay * exp_decay)) * 100.0

        avg_wait_sec = (prob_delay / (c * service_rate_per_hour - calls_per_hour)) * 3600.0

        record = {
            "c": c,
            "rho": round(rho, 3),
            "prob_delay": round(prob_delay, 3),
            "sla_pct": round(sla_achieved, 1),
            "avg_wait_sec": round(avg_wait_sec, 1)
        }
        results.append(record)

        if sla_achieved >= target_sla_pct and optimal_c is None:
            optimal_c = record

    return {
        "Offered_Load_Erlangs": round(erlangs_a, 2),
        "Target_SLA_Threshold": f"{target_sla_pct}% in {target_wait_sec}s",
        "Optimal_Headcount_c": optimal_c["c"],
        "Achieved_SLA_Pct": optimal_c["sla_pct"],
        "Prob_Call_Delayed": optimal_c["prob_delay"],
        "Expected_Wait_Sec": optimal_c["avg_wait_sec"],
        "Server_Utilization_Pct": round(optimal_c["rho"] * 100.0, 1)
    }

erlang_res = erlang_c_staffing_optimizer(
    calls_per_hour=150.0,
    avg_handle_time_min=3.0,
    target_wait_sec=20.0,
    target_sla_pct=85.0
)

for k, v in erlang_res.items():
    print(f"{k}: {v}")`,
        output: `Offered_Load_Erlangs: 7.5
Target_SLA_Threshold: 85.0% in 20.0s
Optimal_Headcount_c: 11
Achieved_SLA_Pct: 88.1
Prob_Call_Delayed: 0.176
Expected_Wait_Sec: 9.0
Server_Utilization_Pct: 68.2`,
        codeNotes: [
          { line: 12, note: 'Computes offered load in Erlangs A = lambda / mu (7.5 Erlangs for 150 calls with 3 min handle time)' },
          { line: 28, note: 'Applies Erlang C formula to compute exact probability of customer delay P(W > 0)' },
          { line: 33, note: 'Evaluates the exponential CDF tail to determine the percentage of callers answered within 20 seconds' },
          { line: 49, note: 'Identifies 11 agents as the optimal staffing level achieving 88.1% SLA at 68.2% healthy utilization' }
        ],
        tryIt: 'Increase target_wait_sec from 20.0 to 45.0 seconds and verify whether optimal headcount can be reduced from 11 to 10 agents.',
        check: {
          question: 'What is an "Erlang" in contact center and telecommunications capacity planning?',
          options: [
            'A dimensionless unit of offered traffic intensity representing one full hour of continuous server or line workload.',
            'A unit measuring the decibel loudness of customer phone lines.',
            'A legal contract fine imposed whenever calls are dropped.',
            'The total number of computer terminals installed in an office.'
          ],
          answer: 0,
          why: 'One Erlang represents 3,600 call seconds (one hour of continuous agent workload); offered Erlangs A = lambda / mu dictates the required theoretical capacity.',
          answerIndex: 0,
          explanation: 'One Erlang represents 3,600 call seconds (one hour of continuous agent workload); offered Erlangs A = lambda / mu dictates the required theoretical capacity.'
        }
      },
      {
        title: 'Waiting Line Economics & Total Cost Optimization (Service vs Delay Trade-off)',
        say: [
          'Operations management is fundamentally an economic discipline. Designing a service system is not about minimizing waiting times to zero—achieving zero customer wait time would require hiring infinite servers, driving payroll costs through the roof and bankrupting the enterprise. Conversely, minimizing server costs by hiring the bare minimum staff creates catastrophic queues, resulting in lost customer goodwill, customer abandonment (balking and reneging), contractual SLA breach fines, and brand destruction.',
          'The economic solution lies in Total Cost Optimization. The Total Cost function TC(c) balances two opposing economic forces: Total Cost = Cost of Providing Service + Cost of Waiting. Service Cost equals c * Cs, where Cs is the hourly wage and overhead cost per server. Waiting Cost equals Lq * Cw, where Cw is the hourly financial penalty of customer waiting (estimated through customer lifetime value churn models or contractual demurrage rates).',
          'Because Service Cost increases linearly with c, while Waiting Cost decays exponentially as c increases, the Total Cost curve forms a classic convex U-shaped parabola. There exists a unique integer c* that achieves the global minimum total operational cost. Sizing capacity at c* guarantees maximum shareholder value by balancing payroll efficiency against customer retention.'
        ],
        example: 'At a container shipping port, each gantry crane costs $45/hour in energy and crew labor (Cs), while delayed container cargo ships incur demurrage penalty costs of $120/hour for every ship waiting in the harbor (Cw). Evaluating crane allocations reveals that 6 cranes achieves the global minimum total cost of $292.23/hour, down from over $550/hour if only 4 cranes were scheduled.',
        code: `# Queuing Economics & Convex Total Cost Optimization Engine
import math

def optimize_queuing_economics(
    arrival_rate: float,
    service_rate: float,
    server_cost_hourly: float,
    waiting_cost_hourly: float,
    max_servers: int = 8
) -> dict:
    erlangs_a = arrival_rate / service_rate
    min_c = math.ceil(erlangs_a + 0.001)

    evaluations = []
    best_option = None
    min_total_cost = float("inf")

    for c in range(min_c, max_servers + 1):
        rho = erlangs_a / c
        if rho >= 1.0:
            continue

        # 1. Compute P0 and Queue Length Lq
        sum_terms = sum((erlangs_a ** n) / math.factorial(n) for n in range(c))
        c_term = (erlangs_a ** c) / (math.factorial(c) * (1.0 - rho))
        p0 = 1.0 / (sum_terms + c_term)
        l_queue = (p0 * (erlangs_a ** c) * rho) / (math.factorial(c) * ((1.0 - rho) ** 2))

        # 2. Total Cost Formulation: Service Payroll + Customer Waiting Loss
        c_service = c * server_cost_hourly
        c_waiting = l_queue * waiting_cost_hourly
        c_total = c_service + c_waiting

        eval_entry = {
            "c": c,
            "Service_Cost": "$" + f"{c_service:,.2f}",
            "Waiting_Cost": "$" + f"{c_waiting:,.2f}",
            "Total_Cost": "$" + f"{c_total:,.2f}",
            "Total_Cost_Val": c_total,
            "Lq": round(l_queue, 2)
        }
        evaluations.append(eval_entry)

        # Track global cost minimum
        if c_total < min_total_cost:
            min_total_cost = c_total
            best_option = eval_entry

    return {
        "Arrival_Rate": arrival_rate,
        "Service_Rate": service_rate,
        "Server_Hourly_Wage": "$" + f"{server_cost_hourly:,.2f}",
        "Waiting_Cost_PerHour": "$" + f"{waiting_cost_hourly:,.2f}",
        "Optimal_Servers_c": best_option["c"],
        "Optimal_Queue_Length_Lq": best_option["Lq"],
        "Optimal_Service_Cost": best_option["Service_Cost"],
        "Optimal_Waiting_Cost": best_option["Waiting_Cost"],
        "Minimum_Total_Cost": best_option["Total_Cost"]
    }

cost_res = optimize_queuing_economics(
    arrival_rate=20.0,
    service_rate=6.0,
    server_cost_hourly=45.0,
    waiting_cost_hourly=120.0,
    max_servers=8
)

for k, v in cost_res.items():
    print(f"{k}: {v}")`,
        output: `Arrival_Rate: 20.0
Service_Rate: 6.0
Server_Hourly_Wage: $45.00
Waiting_Cost_PerHour: $120.00
Optimal_Servers_c: 6
Optimal_Queue_Length_Lq: 0.19
Optimal_Service_Cost: $270.00
Optimal_Waiting_Cost: $22.23
Minimum_Total_Cost: $292.23`,
        codeNotes: [
          { line: 15, note: 'Iterates through viable server counts above minimum theoretical capacity' },
          { line: 26, note: 'Evaluates composite Total Cost = (c * Cs) + (Lq * Cw) balancing payroll against customer delay' },
          { line: 36, note: 'Identifies the convex parabola minimum where marginal cost of an additional server equals marginal delay saved' },
          { line: 45, note: 'Confirms 6 servers yields optimal $292.23 total hourly operational cost' }
        ],
        tryIt: 'Increase waiting cost Cw to $300/hour and observe how the optimal capacity shifts to 7 servers to protect customers.',
        check: {
          question: 'Why does the Total Cost curve of a service queuing operation exhibit a convex U-shape with a unique global minimum?',
          options: [
            'Because server capacity costs increase linearly with headcount, while customer waiting costs decrease exponentially as servers are added; the sum of linear and convex decaying curves creates a unique minimum.',
            'Because government labor taxes automatically double every time an employee is hired.',
            'Because waiting costs always reach zero when at least 2 servers are present.',
            'Because queuing algorithms invert the cost matrix when utilization drops below 50%.'
          ],
          answer: 0,
          why: 'Linear server costs and convex decaying customer waiting costs intersect at a unique optimal tradeoff point that minimizes total economic loss.',
          answerIndex: 0,
          explanation: 'Linear server costs and convex decaying customer waiting costs intersect at a unique optimal tradeoff point that minimizes total economic loss.'
        }
      },
      {
        title: 'Non-Stationary Queues & Dynamic Hourly Shift Staffing Scheduling',
        say: [
          'Textbook queuing formulas assume stationarity: arrival rates and service rates remain constant over infinite time horizons. In reality, operational demand in the real world is intensely non-stationary. Hospital emergency rooms, airline check-in counters, restaurant kitchens, and cloud microservices experience dramatic intraday demand peaks and troughs. An e-commerce fulfillment warehouse might receive 15 orders/hour at 7 AM, surging to 58 orders/hour at 1 PM, before dropping back down in the evening.',
          'Managers who staff an operation based on 24-hour daily averages commit a disastrous operational mistake: during morning and afternoon surges, arrival rate exceeds server capacity (lambda > c * mu), causing queues to explode without bound and inducing multi-hour customer delays. Conversely, staffing all 24 hours to handle the peak surge results in massive labor waste and idle payroll during trough hours.',
          'The modern operational standard is Dynamic Shift Scheduling. By discretizing the operational day into discrete planning intervals (such as 1-hour or 30-minute time blocks), operations engines size staff dynamically to maintain a safe target utilization ceiling (e.g., rho <= 82%) during every interval. Dynamic shift scheduling guarantees resilient SLA performance during peak surges while saving 30% to 50% in payroll expenditure compared to static peak-capacity scheduling.'
        ],
        example: 'A hospital outpatient testing facility faces an 8-hour shift where patient arrivals swing from 15/hr to 58/hr. Sizing statically for the peak requires 6 nurses every hour (48 total nurse-hours). Sizing dynamically using hourly arrival profiles schedules between 2 and 6 nurses as demand ebbs and flows, delivering identical sub-20-minute patient wait times while using only 30 nurse-hours—saving 18 labor hours (37.5% payroll savings).',
        code: `# Dynamic Non-Stationary Shift Scheduling & Queue Capacity Simulator
import math

def simulate_dynamic_shift_queue(
    hourly_arrivals: list[float],
    service_rate_per_server: float,
    target_sla_pct: float = 85.0
) -> dict:
    hourly_schedule = []
    total_staff_hours = 0

    # 1. Dynamic Allocation per Time Interval
    for hour_idx, arrival in enumerate(hourly_arrivals):
        erlangs = arrival / service_rate_per_server
        min_servers = math.ceil(erlangs + 0.001)

        # Allocate minimum servers to keep utilization rho <= 82% to prevent surge queue explosions
        allocated_c = min_servers
        while (arrival / (allocated_c * service_rate_per_server)) > 0.82:
            allocated_c += 1

        rho = arrival / (allocated_c * service_rate_per_server)
        total_staff_hours += allocated_c

        hourly_schedule.append({
            "Hour": f"{hour_idx:02d}:00",
            "Arrivals": arrival,
            "Allocated_Staff": allocated_c,
            "Utilization_Pct": round(rho * 100.0, 1)
        })

    # 2. Comparison Against Static Peak Staffing Baseline
    peak_arrival = max(hourly_arrivals)
    static_peak_c = math.ceil(peak_arrival / (0.82 * service_rate_per_server))
    static_total_hours = static_peak_c * len(hourly_arrivals)

    hours_saved = static_total_hours - total_staff_hours
    efficiency_gain_pct = round((hours_saved / static_total_hours) * 100.0, 1)

    return {
        "Total_Operating_Hours": len(hourly_arrivals),
        "Dynamic_Staff_Hours": total_staff_hours,
        "Static_Peak_Staff_Hours": static_total_hours,
        "Labor_Hours_Saved": hours_saved,
        "Dynamic_Savings_Pct": efficiency_gain_pct,
        "Peak_Hour_Staffing": max(h["Allocated_Staff"] for h in hourly_schedule),
        "Trough_Hour_Staffing": min(h["Allocated_Staff"] for h in hourly_schedule)
    }

arrivals_profile = [15.0, 18.0, 42.0, 58.0, 50.0, 32.0, 20.0, 14.0]

dyn_res = simulate_dynamic_shift_queue(
    hourly_arrivals=arrivals_profile,
    service_rate_per_server=12.0
)

for k, v in dyn_res.items():
    print(f"{k}: {v}")`,
        output: `Total_Operating_Hours: 8
Dynamic_Staff_Hours: 30
Static_Peak_Staff_Hours: 48
Labor_Hours_Saved: 18
Dynamic_Savings_Pct: 37.5
Peak_Hour_Staffing: 6
Trough_Hour_Staffing: 2`,
        codeNotes: [
          { line: 12, note: 'Discretizes intraday demand into hourly intervals, computing Erlangs per period' },
          { line: 18, note: 'Dynamically scales staff to enforce safe 82% utilization ceiling during surges' },
          { line: 32, note: 'Benchmarks dynamic headcount against static peak sizing across the operational shift' },
          { line: 42, note: 'Proves 37.5% labor hour reduction (18 hours saved) while completely preventing peak queue backlogs' }
        ],
        tryIt: 'Double peak arrival to 116.0 arrivals/hr and verify how dynamic peak staffing automatically expands to 12 servers.',
        check: {
          question: 'What severe operational failure occurs if an enterprise sizes service staff using daily average arrival rates instead of dynamic interval scheduling?',
          options: [
            'During peak demand hours, arrival rates exceed capacity (lambda > c * mu), causing queues to compound without bound and resulting in severe service breakdowns and customer abandonment.',
            'Average-based staffing causes servers to work twice as fast.',
            'The company receives an automatic tax penalty from the government.',
            'Queues become deterministic and wait times drop to zero.'
          ],
          answer: 0,
          why: 'Static average staffing under-provisions peak hours where lambda > c*mu; queues compound rapidly, creating backlogs that take hours to clear.',
          answerIndex: 0,
          explanation: 'Static average staffing under-provisions peak hours where lambda > c*mu; queues compound rapidly, creating backlogs that take hours to clear.'
        }
      }
    ],
    summary: [
      'M/M/1 Queuing Dynamics: Random arrival bursts create queues even under spare capacity; wait times explode hyperbolically as utilization rho approaches 1.0.',
      'M/M/c Resource Pooling: Consolidating separate queues into a single serpentine shared queue eliminates idle starvation and slashes customer delay by 60% to 80%.',
      'The Erlang C Formula: Accurately sizes contact center headcount to achieve corporate SLA targets (e.g., 85% answered within 20s) based on offered Erlang load.',
      'Waiting Line Economics: Total operational cost balances linear server wages against convex customer waiting penalties to identify the optimal profit-maximizing capacity.',
      'Dynamic Shift Scheduling: Interval-based staffing accommodates non-stationary intraday demand surges, saving 30% to 50% in payroll compared to static peak staffing.'
    ],
    projectStep: {
      title: 'Stochastic Queuing & Service Workforce Optimization Architecture',
      steps: [
        'Model single-server M/M/1 congestion curves and evaluate Kingman\'s heavy-traffic delay explosion.',
        'Implement multi-server M/M/c queuing to demonstrate quantitative resource pooling efficiency dividends.',
        'Apply the Erlang C formula to size customer support headcount against contractual SLA speed-of-answer commitments.',
        'Construct a convex Total Cost optimization engine and schedule dynamic hourly shifts to conquer intraday demand spikes.'
      ]
    }
  }
];
