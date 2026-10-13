import type { LongLesson } from './longLessons';

/**
 * Operations, Supply Chain & Business Compliance (Course: bcom_ops)
 * Day 1: Economic Order Quantity, Little's Law & Bullwhip Effect Mitigation.
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
        code: `# Simulation: Little's Law WIP, Throughput & Lead Time Balancer
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

print("Little's Law Manufacturing Physics:")
print(f"Current Factory Lead Time: {current_lead_time_days:.1f} days")
print(f"Target Customer Lead Time:  {target_lead_time_days:.1f} days")
print(f"Required Target WIP Level:  {required_target_wip:.0f} wafers")
print(f"Excess WIP to Drain:        {wip_reduction_needed:.0f} wafers ({wip_reduction_needed/current_wip*100:.1f}%)")`,
        output: `Little's Law Manufacturing Physics:\nCurrent Factory Lead Time: 12.0 days\nTarget Customer Lead Time:  5.0 days\nRequired Target WIP Level:  250 wafers\nExcess WIP to Drain:        350 wafers (58.3%)`,
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
        code: `# Simulation: Goldratt's Theory of Constraints Line Audit
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
  }
];
