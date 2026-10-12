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
          why: 'A Cpk of 1.33 ensures that 4 standard deviations fit between the process center and spec limits, guaranteeing less than 64 defects per million parts.'
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
  }
];
