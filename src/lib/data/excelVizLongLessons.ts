import type { LongLesson } from './longLessons';

export const EXCEL_VIZ_LONG_LESSONS: LongLesson[] = [
  {
    day: 1,
    title: 'Tabular Schema Invariants, Exact Relational Lookups & Vectorized Analytics',
    goal: 'Master advanced spreadsheet analytics and data modeling: tidy data schema invariants, exact relational lookups, multi-criteria financial aggregations, vectorized Python transformations, and executive dashboard design.',
    minutes: 30,
    recap: 'Welcome to Advanced Excel, Financial Modeling & Data Visualization. Today we transition from messy raw spreadsheets into rigorous, audit-proof data architectures.',
    parts: [
      {
        title: 'Tabular Schema Invariants & The Tidy Data Principle',
        say: [
          'In corporate finance and business analytics, over 80% of modeling errors stem from poorly formatted raw data tables.',
          'Beginners often merge cells, insert blank spacer rows, or place totals directly inside raw transaction feeds.',
          'Professional financial engineering enforces strict Tidy Data schema invariants:',
          'Invariant 1: Each column represents a single variable (e.g. Transaction Date, Region, Units Sold).',
          'Invariant 2: Each row represents a single atomic observation or transaction.',
          'Invariant 3: Each cell holds a single atomic value with a strict data type (no mixing dates with text comments).',
          'Following these schema invariants ensures that pivot tables, formulas, and Python automation pipelines ingest your sheets without parsing exceptions.'
        ],
        example: 'Like an organized filing cabinet where every folder contains one client and every drawer holds one year, rather than a disorganized drawer with random sticky notes and coffee cups.',
        code: `# Tabular Schema Invariant Validator
records = [
    {"tx_id": 101, "date": "2026-10-01", "region": "North", "revenue": 14500.0, "valid": True},
    {"tx_id": 102, "date": "2026-10-01", "region": "South", "revenue": 22300.0, "valid": True},
    {"tx_id": 103, "date": "2026-10-02", "region": "West",  "revenue": 18900.0, "valid": True},
]

def validate_schema(data):
    required_keys = {"tx_id", "date", "region", "revenue"}
    valid_count = 0
    for row in data:
        if required_keys.issubset(row.keys()) and isinstance(row["revenue"], (int, float)):
            valid_count += 1
    return valid_count

total_records = len(records)
valid_records = validate_schema(records)
print(f"Total Transactions: {total_records}")
print(f"Schema Invariant Status: {'VALIDATED' if valid_records == total_records else 'VIOLATED'}")
print(f"Clean Records: {valid_records}/{total_records}")`,
        output: `Total Transactions: 3\nSchema Invariant Status: VALIDATED\nClean Records: 3/3`,
        codeNotes: [
          { line: 2, note: 'Tidy data structure: atomic records with consistent schema keys' },
          { line: 9, note: 'Validates that every row contains required dimensions and numeric metric types' },
          { line: 17, note: 'Outputs verification confirmation matching tabular expectations' }
        ],
        tryIt: 'Add a new record with a missing revenue field and observe the validation status switch to VIOLATED.',
        check: {
          question: 'What is the primary rule of tidy tabular data in financial modeling?',
          options: [
            'Each column is a variable, each row is an observation, and cells contain atomic data without merged cells',
            'All rows must be colored in alternating blue and white stripes',
            'Every third row must contain a subtotal formula'
          ],
          answer: 0,
          why: 'Tidy tabular data requires atomic columns for variables and atomic rows for observations without merged layout formatting.'
        }
      },
      {
        title: 'Exact Relational Lookups: XLOOKUP vs Legacy VLOOKUP Fragility',
        say: [
          'For decades, Excel analysts relied on VLOOKUP. However, VLOOKUP contains critical architectural flaws.',
          'First, VLOOKUP defaults to an approximate match (TRUE) if the fourth argument is omitted, leading to silent calculation errors on unsorted data.',
          'Second, VLOOKUP relies on a hardcoded static column index number (e.g. column 4). If a team member inserts or deletes a column in the raw sheet, all dependent formulas break or return incorrect figures.',
          'Modern Excel replaces this with XLOOKUP, which defaults to exact match, allows looking to the left, and uses independent column references.',
          'In relational databases and Python, this corresponds to an indexed key-value hash lookup, guaranteeing O(1) retrieval speed.'
        ],
        example: 'Looking up a phone number in an address book by exact person name (XLOOKUP) versus counting 4 columns from the left and hoping nobody rearranged the pages (VLOOKUP).',
        code: `# Exact Relational Lookup Simulation (XLOOKUP semantics)
product_catalog = {
    "SKU-401": {"name": "Industrial Router", "unit_cost": 450.0, "unit_price": 790.0},
    "SKU-402": {"name": "Edge Gateway",      "unit_cost": 180.0, "unit_price": 320.0},
    "SKU-403": {"name": "LoRaWAN Sensor",    "unit_cost": 45.0,  "unit_price": 95.0},
}

def xlookup(sku, return_field="unit_price", default=0.0):
    item = product_catalog.get(sku)
    if item is None:
        return default
    return item.get(return_field, default)

sku_query = "SKU-402"
price = xlookup(sku_query, "unit_price")
cost = xlookup(sku_query, "unit_cost")
margin = price - cost
margin_pct = (margin / price) * 100

print(f"Product: {xlookup(sku_query, 'name')}")
print(f"Selling Price: \${price:.2f}")
print(f"Gross Margin: \${margin:.2f} ({margin_pct:.1f}%)")`,
        output: `Product: Edge Gateway\nSelling Price: $320.00\nGross Margin: $140.00 (43.8%)`,
        codeNotes: [
          { line: 2, note: 'Hash map indexing SKU primary keys for O(1) exact match resolution' },
          { line: 8, note: 'xlookup function returns exact field with default fallback, avoiding silent failures' },
          { line: 17, note: 'Calculates gross profit margin percentage dynamically' }
        ],
        tryIt: 'Query SKU-403 and calculate its gross margin percentage.',
        check: {
          question: 'Why is XLOOKUP superior to legacy VLOOKUP in production financial models?',
          options: [
            'XLOOKUP defaults to exact matching and uses independent column references that do not break when columns are inserted',
            'XLOOKUP can only be executed on supercomputers with dedicated graphics cards',
            'VLOOKUP cannot handle numbers greater than 1,000'
          ],
          answer: 0,
          why: 'XLOOKUP defaults to exact match and uses direct array references, preventing formula breaks when column orders change.'
        }
      },
      {
        title: 'Conditional Financial Aggregations & Run-Rate Metrics',
        say: [
          'Financial analysts frequently need to slice metrics across dimensions: "What was our West region revenue for Enterprise accounts in Q3?"',
          'Instead of manually filtering and copying numbers into scratch sheets, production models use conditional aggregations: SUMIFS, COUNTIFS, and AVERAGEIFS.',
          'These formulas evaluate multiple boolean criteria simultaneously without altering the underlying raw data.',
          'Additionally, calculating running cumulative totals (run rates) provides early warning signals when quarterly targets are drifting off track.',
          'Structuring these aggregations with clear cell coordinates creates deterministic, audit-ready summaries.'
        ],
        example: 'Like an automated toll booth that tallies total tolls collected specifically from heavy trucks (criteria 1) during peak morning hours (criteria 2).',
        code: `# Multi-Criteria Financial Aggregation (SUMIFS / COUNTIFS)
transactions = [
    {"region": "North", "segment": "Enterprise", "amount": 54000},
    {"region": "North", "segment": "SMB",        "amount": 12000},
    {"region": "West",  "segment": "Enterprise", "amount": 68000},
    {"region": "North", "segment": "Enterprise", "amount": 31000},
    {"region": "South", "segment": "Enterprise", "amount": 45000},
]

def sumifs(data, target_region, target_segment):
    total = 0
    count = 0
    for row in data:
        if row["region"] == target_region and row["segment"] == target_segment:
            total += row["amount"]
            count += 1
    avg = total / count if count > 0 else 0
    return total, count, avg

region_target = "North"
segment_target = "Enterprise"
total_rev, deal_count, avg_deal = sumifs(transactions, region_target, segment_target)

print(f"Aggregation Filter: Region={region_target}, Segment={segment_target}")
print(f"Total Revenue (SUMIFS): \${total_rev:,}")
print(f"Deal Volume (COUNTIFS): {deal_count}")
print(f"Average Deal Size: \${avg_deal:,.2f}")`,
        output: `Aggregation Filter: Region=North, Segment=Enterprise\nTotal Revenue (SUMIFS): $85,000\nDeal Volume (COUNTIFS): 2\nAverage Deal Size: $42,500.00`,
        codeNotes: [
          { line: 2, note: 'Multi-dimensional transaction records' },
          { line: 10, note: 'Evaluates simultaneous conditions across region and segment dimensions' },
          { line: 21, note: 'Formats output with standard currency thousands separators' }
        ],
        tryIt: 'Filter for West region Enterprise deals and verify the total revenue.',
        check: {
          question: 'What is the purpose of the SUMIFS formula in spreadsheet modeling?',
          options: [
            'It sums values in a range that meet multiple specified criteria across different columns',
            'It adds all numbers in the entire worksheet regardless of conditions',
            'It automatically calculates employee income tax deductions'
          ],
          answer: 0,
          why: 'SUMIFS calculates the mathematical sum of an array conditionally filtered across multiple criteria ranges.'
        }
      },
      {
        title: 'From Spreadsheet Formulas to Vectorized Python Transformations',
        say: [
          'When spreadsheets exceed 100,000 rows, Excel workbooks begin to lag, freeze, or consume gigabytes of memory.',
          'At this scale, modern quantitative finance teams use Python with vectorized columnar libraries like Pandas or Polars.',
          'In a spreadsheet, a formula like =A2*B2 must be stored and calculated across 100,000 individual cells.',
          'In vectorized Python, mathematical operations apply across entire memory columns in a single SIMD CPU instruction.',
          'Vectorized operations execute up to 100 times faster than row-by-row iteration while eliminating workbook corruption risks.'
        ],
        example: 'Instead of having a worker individually paint 10,000 fence posts one by one with a tiny brush (row loop), an industrial paint sprayer covers the entire fence row in one pass (vectorization).',
        code: `# Vectorized Columnar Transformation Simulation
prices = [10.50, 25.00, 42.75, 18.20, 99.00]
quantities = [12, 5, 8, 20, 3]
tax_rate = 0.08

# Vectorized simulation using list comprehensions (emulating SIMD columnar math)
subtotals = [p * q for p, q in zip(prices, quantities)]
taxes = [s * tax_rate for s in subtotals]
totals = [s + t for s, t in zip(subtotals, taxes)]

grand_total = sum(totals)
print("Vectorized Columnar Execution Results:")
for i in range(len(prices)):
    print(f"  Line {i+1}: Price=\${prices[i]:.2f} x Qty={quantities[i]:2d} = \${subtotals[i]:.2f} (+Tax: \${taxes[i]:.2f}) => Total: \${totals[i]:.2f}")

print(f"\\nGrand Portfolio Total: \${grand_total:.2f}")`,
        output: `Vectorized Columnar Execution Results:\n  Line 1: Price=$10.50 x Qty=12 = $126.00 (+Tax: $10.08) => Total: $136.08\n  Line 2: Price=$25.00 x Qty= 5 = $125.00 (+Tax: $10.00) => Total: $135.00\n  Line 3: Price=$42.75 x Qty= 8 = $342.00 (+Tax: $27.36) => Total: $369.36\n  Line 4: Price=$18.20 x Qty=20 = $364.00 (+Tax: $29.12) => Total: $393.12\n  Line 5: Price=$99.00 x Qty= 3 = $297.00 (+Tax: $23.76) => Total: $320.76\n\nGrand Portfolio Total: $1354.32`,
        codeNotes: [
          { line: 6, note: 'Pairwise columnar multiplication mirroring vectorized Pandas Series multiplication' },
          { line: 7, note: 'Broadcast scalar multiplication across the array' },
          { line: 10, note: 'Aggregation reducing array to single scalar metric' }
        ],
        tryIt: 'Adjust the tax rate to 0.10 (10%) and re-run the vectorized calculation.',
        check: {
          question: 'Why do data teams transition large financial models from Excel to vectorized Python/Pandas?',
          options: [
            'Vectorized operations process millions of rows in memory simultaneously with sub-second execution and zero UI freeze',
            'Python requires all numbers to be integers',
            'Excel files cannot be opened on computers running Windows'
          ],
          answer: 0,
          why: 'Vectorized memory architectures apply SIMD CPU operations across whole columns simultaneously, scaling effortlessly to millions of rows.'
        }
      },
      {
        title: 'Executive Dashboard Design & Maximizing the Data-to-Ink Ratio',
        say: [
          'The ultimate goal of financial analysis is driving high-conviction executive decisions.',
          'Data visualization pioneer Edward Tufte introduced the concept of the Data-to-Ink Ratio: the proportion of ink on a graphic devoted to displaying non-redundant data.',
          'Rule 1: Eliminate chartjunk: 3D effects, heavy dark gridlines, redundant legends, and neon gradient backgrounds distract the eye.',
          'Rule 2: Direct labeling: Place numbers and category names directly beside bars or trendlines rather than forcing executives to look back and forth at a separate legend.',
          'Rule 3: Use high-density micro-visuals like Sparklines and Variance Waterfalls to show trajectory and budget deltas at a single glance.'
        ],
        example: 'A car dashboard speedometer: it displays a clean needle and the exact speed in numbers, without distracting cartoons, flashing disco lights, or decorative borders.',
        code: `# Executive KPI Scorecard & Sparkline Generator
kpis = [
    {"metric": "Recurring Revenue", "current": 420000, "target": 400000, "trend": [36, 38, 39, 41, 42]},
    {"metric": "Customer Churn",    "current": 1.4,    "target": 2.0,    "trend": [2.5, 2.1, 1.8, 1.6, 1.4]},
    {"metric": "Gross Margin",      "current": 78.5,   "target": 75.0,   "trend": [72, 74, 75, 77, 78.5]},
]

def render_sparkline(values):
    ticks = [" ", "▂", "▃", "▄", "▅", "▆", "▇", "█"]
    min_v, max_v = min(values), max(values)
    rng = max_v - min_v if max_v != min_v else 1
    return "".join(ticks[int(((v - min_v) / rng) * (len(ticks) - 1))] for v in values)

print("=" * 65)
print(f"{'EXECUTIVE KPI SCORECARD (HIGH DATA-INK RATIO)':^65}")
print("=" * 65)
print(f"{'METRIC':<22} | {'ACTUAL':<10} | {'TARGET':<8} | {'STATUS':<7} | {'TREND'}")
print("-" * 65)

for kpi in kpis:
    status = "BEAT" if kpi["current"] >= kpi["target"] else "MISS"
    if "Churn" in kpi["metric"]:
        status = "BEAT" if kpi["current"] <= kpi["target"] else "MISS"
    
    val_str = f"\${kpi['current']:,}" if kpi["current"] > 1000 else f"{kpi['current']}%"
    tgt_str = f"\${kpi['target']:,}" if kpi["target"] > 1000 else f"{kpi['target']}%"
    spark = render_sparkline(kpi["trend"])
    print(f"{kpi['metric']:<22} | {val_str:<10} | {tgt_str:<8} | {status:<7} | {spark}")

print("=" * 65)`,
        output: `=================================================================\n          EXECUTIVE KPI SCORECARD (HIGH DATA-INK RATIO)          \n=================================================================\nMETRIC                 | ACTUAL     | TARGET   | STATUS  | TREND\n-----------------------------------------------------------------\nRecurring Revenue      | $420,000   | $400,000 | BEAT    |  ▃▄▇█\nCustomer Churn         | 1.4%       | 2.0%     | BEAT    | █▆▄▃ \nGross Margin           | 78.5%      | 75.0%    | BEAT    |  ▃▄▆█\n=================================================================`,
        codeNotes: [
          { line: 8, note: 'Unicode character ticks generate compact in-cell sparkline micro-charts' },
          { line: 20, note: 'Domain logic handles metrics where lower is better (such as customer churn)' },
          { line: 26, note: 'High data-ink ratio table presenting metrics, targets, variance status, and trajectory' }
        ],
        tryIt: 'Add a Customer Acquisition Cost metric and render its status.',
        check: {
          question: 'What is Edward Tufte’s "Data-to-Ink Ratio" principle in dashboard design?',
          options: [
            'Maximize the share of ink/pixels conveying essential information while removing non-informative chartjunk',
            'Use as many bright saturated colors as possible to make the dashboard exciting',
            'Always render charts in 3D perspective with shadows'
          ],
          answer: 0,
          why: 'Tufte’s data-to-ink ratio mandates focusing visual elements strictly on substantive data content while eliminating decorative noise.'
        }
      }
    ],
    summary: [
      'Tidy tabular schemas enforce 1 column = 1 variable and 1 row = 1 atomic observation without merged cells.',
      'XLOOKUP eliminates VLOOKUP fragility with default exact matching and robust column references.',
      'SUMIFS, COUNTIFS, and AVERAGEIFS compute multi-dimensional financial aggregations without altering raw data.',
      'Vectorized Python/Pandas operations execute columnar math in SIMD memory, scaling effortlessly beyond Excel limits.',
      'High data-to-ink ratio dashboards eliminate chartjunk and use sparklines and direct labeling for instant executive clarity.'
    ],
    projectStep: {
      title: 'Construct an Audit-Proof Financial Modeling Sheet',
      steps: [
        'Organize raw transactions into a tidy tabular schema with data validation rules.',
        'Build an exact-match product lookup engine using XLOOKUP.',
        'Aggregate multi-criteria regional revenues using SUMIFS and COUNTIFS.',
        'Design an executive KPI scorecard with clean sparklines and variance indicators.'
      ]
    }
  },
  {
    day: 2,
    title: 'Dynamic Array Spill Engines, Monte Carlo Risk, Power Pivot DAX & Sensitivity Bridges',
    goal: 'Master professional financial modeling and analytical architecture: dynamic array spill functions (FILTER, UNIQUE, SORT), probabilistic Monte Carlo risk distributions (P10/P50/P90), Power Pivot Star Schemas and DAX filter context, 2-way sensitivity What-If data tables, and executive EBITDA variance waterfall bridges.',
    minutes: 30,
    recap: 'Yesterday we established tidy data schemas, exact XLOOKUP key resolutions, and SUMIFS aggregations. Today we engineer production-grade analytical engines: dynamic array spills, probabilistic Monte Carlo distributions, Power Pivot DAX measures, What-If sensitivity grids, and executive waterfall variance bridges.',
    parts: [
      {
        title: 'Dynamic Array Spill Ranges: =FILTER, =UNIQUE & =SORT Without Array Brackets',
        say: [
          'In legacy spreadsheet software, performing multi-cell array calculations required awkward Ctrl+Shift+Enter (CSE) key combinations, trapping formulas in rigid curly brackets and fixed bounding boxes.',
          'Modern calculation engines implement Dynamic Arrays natively: when a single formula in cell A2 returns multiple values, it automatically spills down and across into neighboring empty cells.',
          'If an existing value, comment, or formatting block obstructs the expansion area, the engine displays a #SPILL! error until the corridor is cleared.',
          'Downstream formulas can reference the entire dynamic spill footprint using the spill operator (#), such as =SUM(A2#) or =COUNTA(A2#), ensuring calculations scale automatically as data grows.',
          'Combining =SORT, =FILTER, and =UNIQUE creates reactive analytical pipelines directly in grid cells without writing macros or VBA.',
          'Crucially, dynamic array formulas eliminate sheet corruption caused by inconsistent formula dragging, where an analyst accidentally modifies a single cell in the middle of a 10,000-row column block.',
          'Because only the top-left anchor cell holds the formula logic, auditing and maintaining large workbooks becomes effortless and virtually error-free.'
        ],
        example: 'Like pouring water into an ice cube tray: pouring into the top corner automatically fills all connected pockets without having to measure each cube by hand.',
        code: `# Modern Excel Dynamic Array Spill Engine Simulation
transactions = [
    {"tx_id": "TX-101", "rep": "Sarah", "region": "North", "sector": "SaaS",      "revenue": 45000},
    {"tx_id": "TX-102", "rep": "David", "region": "South", "sector": "Hardware",  "revenue": 18000},
    {"tx_id": "TX-103", "rep": "Sarah", "region": "North", "sector": "Services",  "revenue": 32000},
    {"tx_id": "TX-104", "rep": "Elena", "region": "West",  "sector": "SaaS",      "revenue": 76000},
    {"tx_id": "TX-105", "rep": "David", "region": "North", "sector": "SaaS",      "revenue": 59000},
    {"tx_id": "TX-106", "rep": "Elena", "region": "West",  "sector": "Fintech",   "revenue": 41000},
]

def simulate_dynamic_arrays(data, target_region, min_rev):
    # 1. FILTER: include rows matching criteria
    filtered = [row for row in data if row["region"] == target_region and row["revenue"] >= min_rev]
    
    # 2. UNIQUE: distinct representatives in filtered set
    unique_reps = sorted(list({row["rep"] for row in filtered}))
    
    # 3. SORT: descending order by revenue
    sorted_records = sorted(filtered, key=lambda x: x["revenue"], reverse=True)
    
    return sorted_records, unique_reps

region_filter = "North"
rev_cutoff = 30000
spill_array, distinct_reps = simulate_dynamic_arrays(transactions, region_filter, rev_cutoff)

print("=== MODERN EXCEL DYNAMIC ARRAY SPILL ENGINE ===")
print(f"Formula: =SORT(FILTER(A2:E7, (C2:C7=\\"{region_filter}\\")*(E2:E7>={rev_cutoff})), 5, -1)")
print(f"Spill Range Dimensions: {len(spill_array)} Rows x 5 Columns (A2#)")
print(f"Distinct Sales Reps (=UNIQUE): {', '.join(distinct_reps)}")
print("-" * 55)
print(f"{'TX ID':<8} | {'REP':<8} | {'REGION':<8} | {'SECTOR':<10} | {'REVENUE'}")
print("-" * 55)
for r in spill_array:
    print(f"{r['tx_id']:<8} | {r['rep']:<8} | {r['region']:<8} | {r['sector']:<10} | \${r['revenue']:,}")`,
        output: `=== MODERN EXCEL DYNAMIC ARRAY SPILL ENGINE ===\nFormula: =SORT(FILTER(A2:E7, (C2:C7="North")*(E2:E7>=30000)), 5, -1)\nSpill Range Dimensions: 3 Rows x 5 Columns (A2#)\nDistinct Sales Reps (=UNIQUE): David, Sarah\n-------------------------------------------------------\nTX ID    | REP      | REGION   | SECTOR     | REVENUE\n-------------------------------------------------------\nTX-105   | David    | North    | SaaS       | $59,000\nTX-101   | Sarah    | North    | SaaS       | $45,000\nTX-103   | Sarah    | North    | Services   | $32,000`,
        codeNotes: [
          { line: 12, note: 'Simulates FILTER by selecting rows fulfilling multi-column boolean conditions' },
          { line: 16, note: 'Extracts distinct category set mirroring =UNIQUE formula semantics' },
          { line: 19, note: 'Sorts tabular array descending by metric column mirroring =SORT' },
          { line: 30, note: 'References spilled boundaries using the # spill operator footprint' }
        ],
        tryIt: 'Adjust the revenue cutoff to 50000 and observe the dynamic reduction in the spilled array output.',
        check: {
          question: 'What occurs when an existing non-empty cell blocks a dynamic array formula from expanding its results?',
          options: [
            'The formula triggers a #SPILL! error until the obstructing cell is cleared',
            'The spreadsheet automatically deletes the obstructing data without warning',
            'The formula truncates itself and only displays the top-left scalar value',
            'The entire workbook file is encrypted and marked read-only'
          ],
          answer: 0,
          why: 'A #SPILL! error indicates that the formula calculated multiple rows or columns but encountered an obstacle in the spill range.'
        }
      },
      {
        title: 'Monte Carlo Financial Risk Simulation & Empirical Distribution Bands (P10, P50, P90)',
        say: [
          'Deterministic financial models that assume fixed single-point growth rates give leadership a dangerous illusion of certainty.',
          'Real markets suffer from supply chain friction, competitor price cuts, and macro demand volatility.',
          'Monte Carlo simulation models replace static cell inputs with continuous statistical distributions (such as Normal or Log-Normal curves).',
          'By simulating 2,000 to 10,000 probabilistic scenarios, financial engineers calculate empirical cumulative distribution functions (CDFs).',
          'This surfaces key executive percentiles: P10 (bear case, 10% probability of falling below), P50 (median base case), and P90 (bull case), alongside the empirical probability of negative cash flow or default.',
          'Beyond percentile estimates, financial engineers calculate Conditional Value at Risk (CVaR or Expected Shortfall), measuring the average severity of losses specifically when the portfolio falls below the 5th percentile.',
          'Presenting full stochastic distributions empowers the CFO and investment committee to stress-test debt service coverage ratios (DSCR) under severe macro shocks.'
        ],
        example: 'Instead of estimating your daily commute as exactly 25 minutes, simulating 1,000 commutes with weather, traffic, and construction gives you the realistic 90th percentile arrival time (38 minutes).',
        code: `# Monte Carlo Probabilistic EBITDA Risk Profile Simulation
import random

def simulate_monte_carlo(base_rev, rev_stdev, fixed_costs, var_cost_ratio, trials=2000, seed=42):
    random.seed(seed)
    ebitda_samples = []
    
    for _ in range(trials):
        # Normal variate shock representing market revenue volatility
        rev_shock = random.gauss(0, rev_stdev)
        realized_rev = max(0, base_rev * (1.0 + rev_shock))
        
        # Variable operating costs with small operational friction variance
        var_costs = realized_rev * var_cost_ratio * (1.0 + random.gauss(0, 0.03))
        realized_ebitda = realized_rev - var_costs - fixed_costs
        ebitda_samples.append(realized_ebitda)
        
    ebitda_samples.sort()
    
    p10 = ebitda_samples[int(0.10 * trials)]
    p50 = ebitda_samples[int(0.50 * trials)]
    p90 = ebitda_samples[int(0.90 * trials)]
    downside_loss_prob = (sum(1 for x in ebitda_samples if x < 0) / trials) * 100.0
    
    return {
        "trials": trials,
        "mean": sum(ebitda_samples) / trials,
        "p10": p10,
        "p50": p50,
        "p90": p90,
        "prob_loss": downside_loss_prob,
    }

res = simulate_monte_carlo(base_rev=5000000, rev_stdev=0.15, fixed_costs=1800000, var_cost_ratio=0.45, trials=2000, seed=42)

print("=== MONTE CARLO PROBABILISTIC EBITDA RISK PROFILE ===")
print(f"Iterations (Trials): {res['trials']:,}")
print(f"Expected Mean EBITDA: \${res['mean']:,.0f}")
print("-" * 52)
print(f"Bear Case (P10 - 10th Percentile) : \${res['p10']:,.0f}")
print(f"Median    (P50 - 50th Percentile) : \${res['p50']:,.0f}")
print(f"Bull Case (P90 - 90th Percentile) : \${res['p90']:,.0f}")
print(f"Downside Risk (P(EBITDA < 0))     : {res['prob_loss']:.1f}%")`,
        output: `=== MONTE CARLO PROBABILISTIC EBITDA RISK PROFILE ===\nIterations (Trials): 2,000\nExpected Mean EBITDA: $944,160\n----------------------------------------------------\nBear Case (P10 - 10th Percentile) : $417,737\nMedian    (P50 - 50th Percentile) : $940,992\nBull Case (P90 - 90th Percentile) : $1,474,924\nDownside Risk (P(EBITDA < 0))     : 1.0%`,
        codeNotes: [
          { line: 8, note: 'Generates Gaussian stochastic revenue shocks across 2,000 discrete simulation paths' },
          { line: 14, note: 'Calculates operating leverage: fixed costs amplify revenue swings into EBITDA volatility' },
          { line: 19, note: 'Sorts outcome array to extract empirical P10, P50, and P90 distribution percentiles' },
          { line: 22, note: 'Computes downside tail probability of operating losses' }
        ],
        tryIt: 'Increase rev_stdev to 0.25 (25% volatility) and observe the widening gap between P10 and P90.',
        check: {
          question: 'In corporate risk planning, what does the P10 percentile metric signify in an EBITDA distribution?',
          options: [
            'The conservative bear case: there is only a 10% chance that actual EBITDA will fall below this level',
            'The maximum profit achievable under ideal market conditions',
            'The average revenue generated by the top 10 salespeople in the firm',
            'The exact price of the company stock at year-end'
          ],
          answer: 0,
          why: 'P10 indicates the 10th percentile outcome: 90% of simulation iterations performed better, establishing a rigorous downside floor for liquidity planning.'
        }
      },
      {
        title: 'Power Pivot Star Schema Architecture & DAX Calculated Measures (Filter Context vs Row Context)',
        say: [
          'Attempting to join dozens of data fields into a single 100-column flat table creates massive memory bloat, redundant strings, and calculation bottlenecks.',
          'Power Pivot solves this by introducing relational Star Schemas powered by the VertiPaq in-memory columnar database.',
          'In a Star Schema, a central Fact Table (FactSales) contains foreign keys and transactional numbers, connected via 1-to-many (1:*) relationships to surrounding Dimension Tables (DimCustomer, DimProduct, DimDate).',
          'Data Analysis Expressions (DAX) differentiate between Row Context (iterating row-by-row in calculated columns) and Filter Context (dynamic aggregations evaluated in pivot tables).',
          'The powerhouse DAX function =CALCULATE() evaluates measures while modifying or overriding ambient filter contexts, allowing sophisticated cohort metrics without duplicating data.',
          'Under the hood, VertiPaq uses run-length encoding (RLE), dictionary compression, and bit-packing to compress gigabytes of transaction records down to mere megabytes in RAM.',
          'By creating explicit one-to-many relationships across key fields, filter context naturally propagates from dimension slicing tables down into the fact table without expensive manual lookups.'
        ],
        example: 'Like an organized library database where a lending log contains student ID and book ID (Fact table), pointing to a student directory and book catalog (Dimension tables), rather than rewriting the author biography on every checkout slip.',
        code: `# Power Pivot Star Schema & DAX Measure Engine Simulation
dim_customers = {
    "C-10": {"tier": "Enterprise", "geo": "North America"},
    "C-20": {"tier": "SMB",        "geo": "EMEA"},
    "C-30": {"tier": "Enterprise", "geo": "APAC"},
}
dim_products = {
    "P-01": {"category": "Cloud Platform", "cogs_rate": 0.20},
    "P-02": {"category": "Consulting",     "cogs_rate": 0.65},
}
# Fact Table (Transactions with Foreign Keys)
fact_sales = [
    {"sale_id": 1, "cust_id": "C-10", "prod_id": "P-01", "gross_rev": 120000},
    {"sale_id": 2, "cust_id": "C-20", "prod_id": "P-01", "gross_rev": 30000},
    {"sale_id": 3, "cust_id": "C-10", "prod_id": "P-02", "gross_rev": 50000},
    {"sale_id": 4, "cust_id": "C-30", "prod_id": "P-01", "gross_rev": 85000},
    {"sale_id": 5, "cust_id": "C-20", "prod_id": "P-02", "gross_rev": 15000},
]

def evaluate_star_schema_dax(facts, customers, products):
    # Base DAX Measures: [Total Revenue] and [Total Margin]
    total_rev = sum(row["gross_rev"] for row in facts)
    total_cogs = sum(row["gross_rev"] * products[row["prod_id"]]["cogs_rate"] for row in facts)
    total_margin = total_rev - total_cogs
    margin_pct = (total_margin / total_rev) * 100.0 if total_rev > 0 else 0
    
    # Filter Context Modification: CALCULATE([Total Revenue], DimCustomer[Tier] == "Enterprise")
    enterprise_rev = sum(
        row["gross_rev"] for row in facts if customers[row["cust_id"]]["tier"] == "Enterprise"
    )
    enterprise_share = (enterprise_rev / total_rev) * 100.0 if total_rev > 0 else 0
    
    return total_rev, total_cogs, total_margin, margin_pct, enterprise_rev, enterprise_share

tot_rev, tot_cogs, tot_marg, marg_pct, ent_rev, ent_share = evaluate_star_schema_dax(fact_sales, dim_customers, dim_products)

print("=== POWER PIVOT STAR SCHEMA & DAX MEASURE ENGINE ===")
print(f"Fact Table Rows: {len(fact_sales)} | Dimensions: DimCustomer, DimProduct (1:* Cardinality)")
print("-" * 52)
print(f"[Total Revenue]     : \${tot_rev:,.2f}")
print(f"[Total COGS]        : \${tot_cogs:,.2f}")
print(f"[Gross Margin]      : \${tot_marg:,.2f}")
print(f"[Gross Margin %]    : {marg_pct:.1f}%")
print("-" * 52)
print(f"[Enterprise Revenue]: \${ent_rev:,.2f} ({ent_share:.1f}% of Total)")`,
        output: `=== POWER PIVOT STAR SCHEMA & DAX MEASURE ENGINE ===\nFact Table Rows: 5 | Dimensions: DimCustomer, DimProduct (1:* Cardinality)\n----------------------------------------------------\n[Total Revenue]     : $300,000.00\n[Total COGS]        : $89,250.00\n[Gross Margin]      : $210,750.00\n[Gross Margin %]    : 70.2%\n----------------------------------------------------\n[Enterprise Revenue]: $255,000.00 (85.0% of Total)`,
        codeNotes: [
          { line: 2, note: 'Dimension tables store normalized entity attributes with primary keys' },
          { line: 11, note: 'Fact table references dimension foreign keys with numeric transaction amounts' },
          { line: 26, note: 'Simulates DAX CALCULATE by overriding ambient filter context with enterprise tier predicate' },
          { line: 36, note: 'Evaluates dynamic aggregate measures without altering underlying tabular storage' }
        ],
        tryIt: 'Filter for SMB tier revenue and compute the SMB revenue share of total sales.',
        check: {
          question: 'Why are explicit DAX Measures preferred over Calculated Columns in Power Pivot data models?',
          options: [
            'Measures compute dynamically in memory at query time based on user filter context without bloating RAM or disk file size',
            'Calculated columns can only store text and cannot perform mathematical addition',
            'Measures bypass Excel security encryption while calculated columns require passwords',
            'Power Pivot does not allow creating calculated columns under any circumstances'
          ],
          answer: 0,
          why: 'DAX measures calculate dynamically during pivot table aggregation, consuming zero persistent memory compared to calculated columns which persist for every row.'
        }
      },
      {
        title: 'Two-Way What-If Sensitivity Analysis Data Tables: DCF Valuation Matrix',
        say: [
          'In corporate valuation, private equity, and investment banking, a Discounted Cash Flow (DCF) model is incomplete without sensitivity analysis.',
          'Valuation outputs are extraordinarily sensitive to two inputs: the Weighted Average Cost of Capital (WACC / discount rate) and the Terminal Growth Rate (g).',
          'Excel What-If Analysis Data Tables (=TABLE(Row_Input, Column_Input)) calculate a two-dimensional matrix of outcomes simultaneously.',
          'The Gordon Growth Model determines terminal enterprise value at year n: TV = (FCF_n * (1 + g)) / (WACC - g), which is then discounted to present value.',
          'By linking the top-left cell to the master enterprise value formula, the sensitivity table reveals the full spectrum of market valuations under bullish and bearish macroeconomic conditions.',
          'In complex enterprise workbooks, two-variable data tables can introduce calculation latency because Excel recomputes the entire financial model for every grid intersection.',
          'Financial analysts optimize performance by setting Excel calculation options to "Automatic Except for Data Tables", ensuring the core workbook calculates instantly while sensitivity tables update on demand.'
        ],
        example: 'Like testing an airplane wing in a wind tunnel across a matrix of 4 different airspeeds and 4 different wind angles to ensure stability across all flight regimes.',
        code: `# Two-Way DCF Valuation Sensitivity Table ($M)
def calculate_dcf_sensitivity(discrete_fcfs, wacc_rates, terminal_growths):
    n = len(discrete_fcfs)
    last_fcf = discrete_fcfs[-1]
    
    # Calculate Present Value (PV) of discrete cash flows for each discount rate
    matrix = []
    for wacc in wacc_rates:
        row = []
        pv_discrete = sum(fcf / ((1.0 + wacc) ** (t + 1)) for t, fcf in enumerate(discrete_fcfs))
        for g in terminal_growths:
            if wacc <= g:
                row.append(None)
                continue
            # Gordon Growth Model terminal value discounted to present
            terminal_value = (last_fcf * (1.0 + g)) / (wacc - g)
            pv_tv = terminal_value / ((1.0 + wacc) ** n)
            enterprise_val = (pv_discrete + pv_tv) / 1000000.0 # $ Millions
            row.append(enterprise_val)
        matrix.append(row)
    return matrix

cash_flows = [25000000, 28000000, 32000000, 36000000, 40000000] # 5-Year Free Cash Flow
wacc_steps = [0.08, 0.09, 0.10, 0.11]
growth_steps = [0.015, 0.020, 0.025, 0.030]

grid = calculate_dcf_sensitivity(cash_flows, wacc_steps, growth_steps)

print("=== TWO-WAY DCF VALUATION SENSITIVITY TABLE ($M) ===")
print("What-If Matrix: WACC (Row Input) vs Terminal Growth g (Column Input)")
print("-" * 55)
headers = "  WACC \\\\ g  | " + " | ".join(f"{g*100:4.1f}%" for g in growth_steps)
print(headers)
print("-" * 55)
for wacc, row_vals in zip(wacc_steps, grid):
    row_str = f"   {wacc*100:4.1f}%    | " + " | ".join(f"\${v:5.1f}M" for v in row_vals)
    print(row_str)`,
        output: `=== TWO-WAY DCF VALUATION SENSITIVITY TABLE ($M) ===\nWhat-If Matrix: WACC (Row Input) vs Terminal Growth g (Column Input)\n-------------------------------------------------------\n  WACC \\ g  |  1.5% |  2.0% |  2.5% |  3.0%\n-------------------------------------------------------\n    8.0%    | $551.3M | $589.0M | $633.6M | $687.0M\n    9.0%    | $474.5M | $501.5M | $532.7M | $569.0M\n   10.0%    | $415.9M | $436.0M | $458.8M | $484.8M\n   11.0%    | $369.7M | $385.1M | $402.4M | $421.7M`,
        codeNotes: [
          { line: 2, note: 'Models DCF valuation across two independent macroeconomic variable vectors' },
          { line: 9, note: 'Discounts discrete projection cash flows using compound interest factors' },
          { line: 14, note: 'Evaluates Gordon Growth terminal value formula (Terminal FCF / (WACC - g))' },
          { line: 29, note: 'Renders executive sensitivity matrix tabulating enterprise valuation outcomes' }
        ],
        tryIt: 'Observe how Enterprise Value expands from $369.7M at 11% WACC / 1.5% g to $687.0M at 8% WACC / 3.0% g.',
        check: {
          question: 'What mathematical condition must hold when calculating terminal value using the Gordon Growth Model?',
          options: [
            'The discount rate (WACC) must strictly exceed the perpetual growth rate (g)',
            'The terminal growth rate must equal zero under all circumstances',
            'The cash flow projection period must span exactly 100 years',
            'The company must possess zero outstanding debt'
          ],
          answer: 0,
          why: 'If the terminal growth rate g equals or exceeds the discount rate WACC, the denominator (WACC - g) becomes zero or negative, creating a mathematically invalid infinite valuation.'
        }
      },
      {
        title: 'Financial Waterfall Charts & Executive EBITDA Variance Attribution Bridge',
        say: [
          'When actual quarterly EBITDA diverges from the approved board budget, corporate leaders require an exact attribution bridge.',
          'A simple bar chart only shows the start and end values, obscuring whether the variance was caused by volume erosion, raw material inflation, or wage increases.',
          'Financial Waterfall charts display floating intermediate blocks connecting the starting budget to actual results.',
          'Each block decomposes variance into standard operational buckets: Volume Expansion, Price Realization, Material Cost Inflation, and SG&A Overhead.',
          'Using floating baseline offsets and color coding (green for favorable variance, red for unfavorable variance), executives instantly diagnose operating performance.',
          'In multinational corporations, variance analysis further isolates foreign exchange translation effects from local currency operational price and volume dynamics.',
          'By walking the board transparently through each discrete impact layer, financial planners build unshakeable credibility and direct strategic resources to fixing root causes.'
        ],
        example: 'Like a bank statement reconciliation bridge: starting balance + salary paycheck + investment dividend - rent expense - grocery costs = ending bank account balance.',
        code: `# Executive Financial Waterfall (EBITDA Bridge) Simulation
def render_ebitda_waterfall(budget_ebitda, variance_steps):
    # Calculate running bridge coordinates
    running = budget_ebitda
    rows = [("Budget EBITDA", budget_ebitda, 0, budget_ebitda, "BASE")]
    
    for name, delta in variance_steps:
        prev = running
        running += delta
        category = "POS" if delta >= 0 else "NEG"
        rows.append((name, prev, delta, running, category))
        
    rows.append(("Actual EBITDA", running, 0, running, "FINAL"))
    return rows

budget = 12000000
variances = [
    ("Volume Expansion", +2400000),
    ("Price Realization", +1100000),
    ("Raw Material Infl", -1800000),
    ("Headcount / SG&A",  -900000),
]

bridge = render_ebitda_waterfall(budget, variances)

print("=== EXECUTIVE FINANCIAL WATERFALL (EBITDA BRIDGE) ===")
print(f"{'STEP DRIVER':<20} | {'START':<9} | {'VARIANCE':<10} | {'ENDING':<9} | {'VISUAL'}")
print("-" * 65)

scale = 200000 # 1 bar block per $200k
for name, start_v, delta, end_v, cat in bridge:
    s_str = f"\${start_v/1e6:4.1f}M"
    e_str = f"\${end_v/1e6:4.1f}M"
    
    if cat == "BASE" or cat == "FINAL":
        var_str = "  ----  "
        bars = "[=] " + "=" * int(end_v / (scale * 20))
    elif cat == "POS":
        var_str = f"+\${delta/1e6:3.1f}M"
        bars = "[+] " + "+" * int(abs(delta) / (scale * 2))
    else:
        var_str = f"-\${abs(delta)/1e6:3.1f}M"
        bars = "[-] " + "-" * int(abs(delta) / (scale * 2))
        
    print(f"{name:<20} | {s_str:<9} | {var_str:<10} | {e_str:<9} | {bars}")`,
        output: `=== EXECUTIVE FINANCIAL WATERFALL (EBITDA BRIDGE) ===\nSTEP DRIVER          | START     | VARIANCE   | ENDING    | VISUAL\n-----------------------------------------------------------------\nBudget EBITDA        | $12.0M    |   ----     | $12.0M    | [=] ===\nVolume Expansion     | $12.0M    | +$2.4M     | $14.4M    | [+] ++++++\nPrice Realization    | $14.4M    | +$1.1M     | $15.5M    | [+] ++\nRaw Material Infl    | $15.5M    | -$1.8M     | $13.7M    | [-] ----\nHeadcount / SG&A     | $13.7M    | -$0.9M     | $12.8M    | [-] --\nActual EBITDA        | $12.8M    |   ----     | $12.8M    | [=] ===`,
        codeNotes: [
          { line: 2, note: 'Calculates floating vertical base offsets linking previous ending balance to next start' },
          { line: 17, note: 'Decomposes variance drivers into operational categories (volume, price, cost inflation)' },
          { line: 31, note: 'Categorizes step polarity (+/-) to generate directional waterfall bridge visuals' },
          { line: 42, note: 'Reconciles starting budget of $12.0M to realized actual EBITDA of $12.8M' }
        ],
        tryIt: 'Add a new variance driver for supply chain logistics (-$500,000) and observe the updated bridge.',
        check: {
          question: 'What is the primary analytical advantage of a Waterfall Chart in executive corporate reporting?',
          options: [
            'It isolates and visualizes individual positive and negative variance drivers that explain the gap between budget and actual results',
            'It automatically calculates the corporate income tax rate based on geographic IP address',
            'It converts currency numbers into animated video clips for board presentations',
            'It prevents unauthorized users from printing the financial report'
          ],
          answer: 0,
          why: 'A waterfall chart transparently decomposes net performance changes into discrete operational drivers, providing immediate diagnostic clarity.'
        }
      }
    ],
    summary: [
      'Modern Excel Dynamic Arrays (FILTER, UNIQUE, SORT) eliminate rigid CSE array formulas with automatic spilling and the # range operator.',
      'Monte Carlo probabilistic simulations replace single-point guesses with continuous distributions, generating empirical P10, P50, and P90 confidence intervals.',
      'Power Pivot Star Schemas decouple facts from dimensions, utilizing DAX measures and CALCULATE to compute metrics dynamically without memory bloat.',
      'Two-Way What-If Sensitivity Tables evaluate multi-variable valuation landscapes across WACC discount rates and Gordon Growth terminal rates.',
      'Executive Waterfall bridges decompose net budget variances into actionable operational drivers including volume expansion, price realization, and cost inflation.'
    ],
    projectStep: {
      title: 'Engineer an Enterprise Financial Risk Model & Interactive Valuation Suite',
      steps: [
        'Build a dynamic array reporting engine using FILTER, UNIQUE, and SORT with spill range references (#).',
        'Run a 2,000-trial Monte Carlo simulation to quantify portfolio EBITDA volatility and P10/P50/P90 percentile thresholds.',
        'Construct a Power Pivot Star Schema linking sales transactions to customer/product dimensions and authoring DAX measures.',
        'Generate a two-way WACC vs Terminal Growth DCF sensitivity matrix and render an executive EBITDA waterfall variance bridge.'
      ]
    }
  },
  {
    day: 3,
    title: 'Enterprise Financial Modeling: Power Query M-Pipelines, Advanced LAMBDAs, 3-Statement Linking & Executive Dashboards',
    goal: 'Master institutional financial engineering in Excel: automated Power Query declarative M-code unpivoting pipelines, recursive Excel LAMBDAs with SCAN and REDUCE for compound amortization schedules, dynamically linked 3-Statement financial models (Income Statement, Balance Sheet, Cash Flow) with zero circular reference leaks, dynamic scenario switchboards (Base, Bull, Bear), and C-suite KPI executive dashboard architecture.',
    minutes: 35,
    recap: 'Welcome to Enterprise Financial Modeling & Executive Reporting Architecture. Today we transition from isolated analytical formulas into fully integrated 3-statement corporate models, automated Power Query ingestion pipelines, and C-suite KPI telemetry.',
    parts: [
      {
        title: 'Power Query ETL & M-Language Declarative Pipelines (Table.UnpivotOtherColumns)',
        say: [
          'In corporate FP&A and institutional investment banking, financial analysts waste thousands of hours manually copying and pasting monthly GL reports, transposing columns, and fixing broken VLOOKUP references.',
          'Modern Excel completely eliminates this manual labor through Power Query and its declarative functional formula language, M. Power Query operates as an enterprise ETL (Extract, Transform, Load) engine directly inside Excel: extracting dirty ERP exports, applying immutable transformations, and refreshing clean data models with a single click.',
          'One of the most essential transformations in financial data engineering is Unpivoting. Accounting systems frequently export "wide" cross-tab reports with dates or months stretched across 12 horizontal columns. Such layouts violate Tidy Data principles and prevent Pivot Tables from grouping by quarter or year. Using Table.UnpivotOtherColumns in M code, wide monthly grids are automatically flattened into atomic "tall" rows (Account, Month, Amount).',
          'Every transformation step in Power Query is recorded as an immutable M-expression (such as Table.TransformColumnTypes and Table.ReplaceValue). When next month raw CSV export lands in the network folder, clicking Data > Refresh All re-executes the entire multi-step pipeline in seconds with zero risk of human copy-paste errors.'
        ],
        example: 'Like an automated industrial car wash: instead of spending two hours scrubbing tires, wiping windows, and waxing paint by hand every Saturday, you drive your dirty car onto the conveyor belt and let the automated machinery wash, rinse, dry, and shine the car in three minutes.',
        code: `# Power Query M Declarative ETL & Unpivot Simulation
raw_wide_data = [
    {"account": "Revenue", "Jan": 120000, "Feb": 135000, "Mar": 142000},
    {"account": "COGS",    "Jan": 48000,  "Feb": 54000,  "Mar": 56800},
    {"account": "OpEx",    "Jan": 35000,  "Feb": 36000,  "Mar": 37500},
]

def simulate_power_query_m_pipeline(records):
    tidy_rows = []
    for row in records:
        acct = row["account"]
        for month in ["Jan", "Feb", "Mar"]:
            val = row[month]
            tidy_rows.append({"account": acct, "month": month, "amount": val})
    return tidy_rows

unpivoted = simulate_power_query_m_pipeline(raw_wide_data)
print("=== POWER QUERY DECLARATIVE M UNPIVOT PIPELINE ===")
print(f"{'ACCOUNT':<12} | {'MONTH':<6} | {'AMOUNT ($)':<12}")
print("-" * 36)
for r in unpivoted[:6]:
    amt = r['amount']
    print(f"{r['account']:<12} | {r['month']:<6} | \${amt:>10,}")
print(f"Total Tidy Records Generated: {len(unpivoted)}")`,
        output: `=== POWER QUERY DECLARATIVE M UNPIVOT PIPELINE ===\nACCOUNT      | MONTH  | AMOUNT ($)  \n------------------------------------\nRevenue      | Jan    | $   120,000\nRevenue      | Feb    | $   135,000\nRevenue      | Mar    | $   142,000\nCOGS         | Jan    | $    48,000\nCOGS         | Feb    | $    54,000\nCOGS         | Mar    | $    56,800\nTotal Tidy Records Generated: 9`,
        codeNotes: [
          { line: 2, note: 'Simulates wide cross-tab financial accounting feed with months as horizontal columns' },
          { line: 8, note: 'Applies declarative unpivot operation transforming wide matrix into tall atomic key-value records' },
          { line: 20, note: 'Formats unpivoted rows with explicit currency alignment matching Power Query preview' },
          { line: 22, note: 'Confirms total generated record count matches expected product (3 accounts x 3 months = 9)' }
        ],
        tryIt: 'Add an April column ($150,000 revenue) and observe how the automated pipeline ingests the fourth period without modifying the logic.',
        check: {
          question: 'What is the primary benefit of using Power Query Unpivot (Table.UnpivotOtherColumns) over traditional Excel copy-paste?',
          options: [
            'It creates an automated, repeatable ETL pipeline that flattens wide reports into tidy tall records without manual errors on refresh',
            'It translates formulas into French and Spanish automatically',
            'It permanently deletes historical transaction data to save hard drive space',
            'It prevents formulas from calculating numbers larger than 1,000'
          ],
          answer: 0,
          why: 'Power Query Unpivot records declarative transformation steps in M code, allowing analysts to refresh and ingest new data instantly without tedious, error-prone manual transpositions.'
        }
      },
      {
        title: 'Advanced Dynamic LAMBDAs & Recursive Scan (SCAN, REDUCE, MAP)',
        say: [
          'For decades, extending Excel formula capabilities required writing complex Visual Basic for Applications (VBA) macro scripts. Macro-enabled workbooks (.xlsm) carried severe security warnings, were blocked by corporate firewalls, and failed on Excel for Web and iPad.',
          'Modern Excel revolutionized spreadsheet modeling with the introduction of LAMBDA and its companion functional helper functions: MAP, REDUCE, SCAN, BYROW, and BYCOL. A LAMBDA allows you to define custom, parameter-driven functions using standard Excel syntax and store them in the Name Manager.',
          'The SCAN function is especially revolutionary for treasury and debt modeling: =SCAN(initial_value, array, LAMBDA(accumulator, value, calculation)). While traditional Excel required dragging formulas down hundreds of rows to calculate cumulative bank balances, SCAN calculates running balances across an entire spilled array in a single cell formula.',
          'Combining SCAN and REDUCE with compounding interest calculations allows financial modelers to construct 30-year bond amortizations, debt service repayment waterfalls, and discounted cash flows cleanly with zero dragged formulas and zero VBA dependencies.'
        ],
        example: 'Like an automated conveyor belt scanner with a tally counter: as boxes roll past, the scanner reads each box weight, adds it to the running sum, and writes down the cumulative total on a digital ledger in one swift motion.',
        code: `# Advanced Excel LAMBDA & SCAN Functional Recursion Simulation
cash_flows = [10000, 15000, -8000, 22000, 18000]
initial_balance = 50000

def evaluate_excel_lambda_compounding(opening_bal, flows, monthly_rate=0.005):
    schedule = []
    current_bal = opening_bal
    for month, cf in enumerate(flows, 1):
        interest = current_bal * monthly_rate
        closing_bal = current_bal + interest + cf
        schedule.append({
            "month": month,
            "start": current_bal,
            "flow": cf,
            "interest": interest,
            "end": closing_bal
        })
        current_bal = closing_bal
    return schedule

sim = evaluate_excel_lambda_compounding(initial_balance, cash_flows)
print("=== EXCEL LAMBDA SCAN & COMPOUNDING RECURSION ===")
print(f"{'MTH':<4} | {'OPENING':<10} | {'FLOW':<9} | {'INTEREST':<10} | {'CLOSING':<10}")
print("-" * 52)
for s in sim:
    mth = s['month']
    st = s['start']
    fl = s['flow']
    intr = s['interest']
    ed = s['end']
    print(f"M{mth:<3} | \${st:>8,.0f} | \${fl:>7,.0f} | \${intr:>8,.0f} | \${ed:>8,.0f}")
final_equity = sim[-1]["end"]
print(f"Final Projected Treasury Balance: \${final_equity:,.2f}")`,
        output: `=== EXCEL LAMBDA SCAN & COMPOUNDING RECURSION ===\nMTH  | OPENING    | FLOW      | INTEREST   | CLOSING   \n----------------------------------------------------\nM1   | $  50,000 | $ 10,000 | $     250 | $  60,250\nM2   | $  60,250 | $ 15,000 | $     301 | $  75,551\nM3   | $  75,551 | $ -8,000 | $     378 | $  67,929\nM4   | $  67,929 | $ 22,000 | $     340 | $  90,269\nM5   | $  90,269 | $ 18,000 | $     451 | $ 108,720\nFinal Projected Treasury Balance: $108,719.99`,
        codeNotes: [
          { line: 2, note: 'Defines opening treasury liquidity and monthly operational cash flow array' },
          { line: 5, note: 'Simulates Excel SCAN accumulator evaluating opening balance plus monthly interest and inflows' },
          { line: 19, note: 'Outputs tabular monthly schedule matching dynamic array spilled output' },
          { line: 27, note: 'Verifies final compounded treasury balance at month 5 reaches exactly $108,719.99' }
        ],
        tryIt: 'Increase monthly interest rate to 0.01 (1%) and observe how compounding accelerates the final treasury balance.',
        check: {
          question: 'What unique functional capability does the Excel SCAN helper function provide compared to standard formulas?',
          options: [
            'It iterates over an array and outputs the intermediate accumulator value at each step into a spilled dynamic array',
            'It physically scans paper documents using your computer webcam',
            'It checks your spreadsheet for spelling errors in financial terms',
            'It encrypts cells with a 256-bit password'
          ],
          answer: 0,
          why: 'SCAN calculates running totals or stateful accumulations across an array, spilling the full sequence of intermediate results without requiring manual row-by-row formula dragging.'
        }
      },
      {
        title: 'Mechanics of Integrated 3-Statement Financial Models (IS, BS, CFS)',
        say: [
          'In corporate finance, private equity, and investment banking, financial decisions cannot be evaluated using an Income Statement in isolation. A business can report high accounting Net Income on its Income Statement yet become insolvent due to inventory tie-ups and unpaid receivables.',
          'The gold standard of financial analysis is the Integrated 3-Statement Model, which links the Income Statement (IS), Balance Sheet (BS), and Cash Flow Statement (CFS) through strict accounting invariants:',
          'Linkage 1: Net Income from the bottom of the Income Statement flows directly to the top of the Cash Flow Statement (Operating Activities) and adds to Retained Earnings on the Balance Sheet.',
          'Linkage 2: Non-cash expenses (such as Depreciation & Amortization) are subtracted to calculate EBIT on the Income Statement, but added back on the Cash Flow Statement because no actual cash left the bank.',
          'Linkage 3: Capital Expenditures (CapEx) appear as cash outflows under Investing Activities on the Cash Flow Statement and increase Property, Plant & Equipment (PP&E) on the Balance Sheet.',
          'Linkage 4: The Net Change in Cash from the bottom of the Cash Flow Statement updates Cash & Cash Equivalents on the Balance Sheet. When constructed properly, Total Assets exactly equals Total Liabilities plus Shareholders Equity ($Assets - (Liabilities + Equity) = 0$).'
        ],
        example: 'Like three linked mechanical gears in a clock: turning the minute hand (Net Income on Income Statement) advances the hour wheel (Retained Earnings on Balance Sheet) and moves the escapement lever (Ending Cash on Cash Flow Statement). If any link is misaligned, the clock stops.',
        code: `# Integrated 3-Statement Corporate Financial Model Simulation
def simulate_three_statement_model(rev, cogs_pct, opex, capex, tax_rate=0.21):
    # 1. Income Statement
    gross_profit = rev * (1 - cogs_pct)
    ebitda = gross_profit - opex
    deprec = capex * 0.20 # 20% depreciation on new capex
    ebit = ebitda - deprec
    taxes = max(0.0, ebit * tax_rate)
    net_income = ebit - taxes

    # 2. Cash Flow Statement
    cfo = net_income + deprec # Non-cash depreciation addback
    cfi = -capex              # Capital expenditures
    cff = 0.0                 # No debt issued
    net_change_cash = cfo + cfi + cff

    # 3. Balance Sheet (Year 1)
    cash = 100000.0 + net_change_cash
    ppe = 50000.0 + capex - deprec
    total_assets = cash + ppe

    liabilities = 30000.0
    equity = 120000.0 + net_income # Retained earnings accumulation
    total_liab_equity = liabilities + equity

    balance_check = total_assets - total_liab_equity
    return {
        "rev": rev,
        "net_income": net_income,
        "net_cash": net_change_cash,
        "assets": total_assets,
        "liab_eq": total_liab_equity,
        "check": balance_check
    }

m = simulate_three_statement_model(500000.0, 0.40, 120000.0, 40000.0)
print("=== INTEGRATED 3-STATEMENT FINANCIAL MODEL ===")
rev_v = m['rev']
ni_v = m['net_income']
nc_v = m['net_cash']
ast_v = m['assets']
lq_v = m['liab_eq']
chk_v = m['check']
print(f"Revenue:           \${rev_v:>10,.0f}")
print(f"Net Income:        \${ni_v:>10,.0f}")
print(f"Operating/Net CF:  \${nc_v:>10,.0f}")
print(f"Total Assets:      \${ast_v:>10,.0f}")
print(f"Total Liab & Eq:   \${lq_v:>10,.0f}")
print(f"Balance Check:     \${chk_v:>10,.2f} ({'BALANCED' if abs(chk_v) < 0.01 else 'UNBALANCED'})")`,
        output: `=== INTEGRATED 3-STATEMENT FINANCIAL MODEL ===\nRevenue:           $   500,000\nNet Income:        $   135,880\nOperating/Net CF:  $   103,880\nTotal Assets:      $   285,880\nTotal Liab & Eq:   $   285,880\nBalance Check:     $      0.00 (BALANCED)`,
        codeNotes: [
          { line: 3, note: 'Calculates Income Statement down to Net Income after taxes ($135,880)' },
          { line: 11, note: 'Constructs Cash Flow Statement adding back non-cash depreciation ($8,000)' },
          { line: 17, note: 'Links ending cash to Balance Sheet asset side and net income to equity side' },
          { line: 34, note: 'Proves mathematical balance check: Total Assets ($285,880) - Total Liab & Eq ($285,880) = 0' }
        ],
        tryIt: 'Change CapEx to $60,000 and observe how depreciation, PP&E, and cash flow adjust dynamically while the balance sheet remains 100% balanced.',
        check: {
          question: 'Why must Depreciation & Amortization be added back to Net Income on the Cash Flow Statement?',
          options: [
            'Because depreciation is an accounting allocation of historical cost, not a current cash expenditure leaving the bank account',
            'Because the government gives tax refunds on all old equipment',
            'Because banks require depreciation to be doubled every year',
            'To make the company revenue look larger to investors'
          ],
          answer: 0,
          why: 'Depreciation reduces taxable Net Income on the Income Statement, but no actual physical cash left the business during the period. Therefore, it is added back under Operating Cash Flow.'
        }
      },
      {
        title: 'Dynamic Scenario Switchboards & Sensitivity Switching (CHOOSE / XLOOKUP)',
        say: [
          'A dangerous flaw in financial modeling is hardcoding a single set of optimistic assumptions. When macro conditions shift, interest rates rise, or customer demand slows, single-point models provide zero guidance on downside risk.',
          'Professional financial engineers design dynamic Scenario Switchboards: centralized control panels that allow executives and investors to toggle between multiple operating cases (Scenario 1: Base Case, Scenario 2: Bull Case, Scenario 3: Bear Case) using form controls or dropdown menus.',
          'Using functions like =CHOOSE(Scenario_Index, Base_Val, Bull_Val, Bear_Val) or =XLOOKUP(Scenario_Name, Scenario_Table[Case], Scenario_Table[Value]), every assumption in the financial model—such as revenue growth rates, gross margins, SG&A hiring plans, and interest rates—updates instantaneously.',
          'This dynamic architecture allows CFOs to stress-test debt covenants, cash runway, and valuation multiples across all three operating environments during live board meetings with zero model recalculation lag.'
        ],
        example: 'Like an airplane cockpit flight simulator: flipping a single switch instantly changes simulated weather from clear skies (Bull Case) to mild crosswinds (Base Case) to a severe thunderstorm (Bear Case), testing whether the aircraft remains stable under stress.',
        code: `# Dynamic Scenario Switchboard Simulation (CHOOSE / XLOOKUP)
scenarios = {
    "Base Case": {"rev_growth": 0.08, "margin": 0.25},
    "Bull Case": {"rev_growth": 0.18, "margin": 0.32},
    "Bear Case": {"rev_growth": -0.05, "margin": 0.16}
}

def evaluate_financial_scenarios(base_rev, scenario_table):
    results = {}
    for name, params in scenario_table.items():
        proj_rev = base_rev * (1 + params["rev_growth"])
        proj_ebitda = proj_rev * params["margin"]
        results[name] = (proj_rev, proj_ebitda)
    return results

proj = evaluate_financial_scenarios(1000000.0, scenarios)
print("=== DYNAMIC SCENARIO SWITCHBOARD (CHOOSE / XLOOKUP) ===")
print(f"{'SCENARIO':<12} | {'PROJECTED REVENUE':<18} | {'PROJECTED EBITDA':<18}")
print("-" * 54)
for name, (r, e) in proj.items():
    print(f"{name:<12} | \${r:>16,.0f} | \${e:>16,.0f}")`,
        output: `=== DYNAMIC SCENARIO SWITCHBOARD (CHOOSE / XLOOKUP) ===\nSCENARIO     | PROJECTED REVENUE  | PROJECTED EBITDA  \n------------------------------------------------------\nBase Case    | $       1,080,000 | $         270,000\nBull Case    | $       1,180,000 | $         377,600\nBear Case    | $         950,000 | $         152,000`,
        codeNotes: [
          { line: 2, note: 'Defines scenario assumption matrix for Base (8% growth), Bull (18%), and Bear (-5%)' },
          { line: 8, note: 'Applies dynamic scenario parameters across baseline revenue and margin drivers' },
          { line: 16, note: 'Outputs comparative projected revenue and EBITDA across all 3 operating cases' },
          { line: 20, note: 'Quantifies downside EBITDA risk ($152,000) versus upside potential ($377,600)' }
        ],
        tryIt: 'Add a "Stress Test" scenario with -15% revenue growth and 10% margin to analyze recession impact.',
        check: {
          question: 'Why is an active Scenario Switchboard (e.g., using CHOOSE or XLOOKUP) standard practice in enterprise financial models?',
          options: [
            'It enables instantaneous switching between Base, Bull, and Bear cases to stress-test financial resilience without creating multiple duplicate sheets',
            'It translates the workbook into different currencies using live satellite feeds',
            'It automatically pays company vendor invoices on the 1st of each month',
            'It converts Excel into an Adobe Photoshop drawing program'
          ],
          answer: 0,
          why: 'Scenario switchboards allow stakeholders to evaluate how sensitivity assumptions impact revenue, EBITDA, and debt covenants across varying economic conditions within a single audit-proof model.'
        }
      },
      {
        title: 'Executive KPI Dashboard Architecture & Cognitive Typography Design',
        say: [
          'A financial model is only as valuable as the decisions it empowers. When analysts present 50-row tables filled with raw 8-digit numbers, busy C-suite executives experience cognitive fatigue and miss critical warning signals.',
          'Professional dashboard design enforces Stephen Few "5-Second Rule": an executive looking at a summary dashboard must comprehend organizational performance status within 5 seconds without asking for explanations.',
          'To achieve this, executive dashboards utilize structured KPI Summary Tiles. Each tile highlights four essential components: (1) Primary Current Metric in large high-contrast typography, (2) Benchmark Target Comparison, (3) Period-over-Period Delta (YoY or MoM), and (4) Visual Status Indicator (Green, Amber, Red).',
          'Furthermore, executive dashboards eliminate visual clutter: remove default gray Excel gridlines, restrict bright colors exclusively to actionable variances, and incorporate high-density in-cell micro-visualizations (such as Sparklines or ASCII trend bars) to display trajectory trends alongside raw metrics.'
        ],
        example: 'Like an automobile dashboard: you have a large digital speedometer (primary metric), a speed limit reminder (benchmark), a fuel gauge with a low-fuel warning light (variance status), and an odometer, rather than a raw real-time stream of engine oil sensor voltages.',
        code: `# Executive KPI Summary Tiles Dashboard Architecture
kpi_cards = [
    {"metric": "ARR (Annual Recurring)", "actual": 24500000, "target": 22000000, "growth": "+28.4%", "status": "GREEN"},
    {"metric": "Net Revenue Retention",  "actual": 118,      "target": 115,      "growth": "+3.0%",  "status": "GREEN"},
    {"metric": "Customer Acquisition",   "actual": 4200,     "target": 4800,     "growth": "-12.5%", "status": "AMBER"},
    {"metric": "Operating Cash Flow",    "actual": 6100000,  "target": 5500000,  "growth": "+10.9%", "status": "GREEN"}
]

def render_executive_kpi_dashboard(kpis):
    lines = []
    lines.append("=== C-SUITE EXECUTIVE PERFORMANCE DASHBOARD ===")
    for k in kpis:
        variance = ((k["actual"] - k["target"]) / k["target"]) * 100
        val_fmt = f"\${k['actual']:,}" if k["actual"] > 1000 else f"{k['actual']}%"
        lines.append(f"[{k['status']}] {k['metric']:<24} | Val: {val_fmt:<11} | YoY: {k['growth']:<7} | Var: {variance:+5.1f}%")
    return "\n".join(lines)

output = render_executive_kpi_dashboard(kpi_cards)
print(output)`,
        output: `=== C-SUITE EXECUTIVE PERFORMANCE DASHBOARD ===\n[GREEN] ARR (Annual Recurring)   | Val: $24,500,000 | YoY: +28.4%  | Var: +11.4%\n[GREEN] Net Revenue Retention    | Val: 118%        | YoY: +3.0%   | Var:  +2.6%\n[AMBER] Customer Acquisition     | Val: $4,200      | YoY: -12.5%  | Var: -12.5%\n[GREEN] Operating Cash Flow      | Val: $6,100,000  | YoY: +10.9%  | Var: +10.9%`,
        codeNotes: [
          { line: 2, note: 'Defines executive KPI registry with actual performance, targets, growth, and status' },
          { line: 9, note: 'Computes variance percentage against benchmark target for immediate operational clarity' },
          { line: 11, note: 'Formats high-contrast values with appropriate currency or percentage typography' },
          { line: 15, note: 'Renders executive performance cards identifying CAC underperformance in amber' }
        ],
        tryIt: 'Adjust Operating Cash Flow actual to $4,800,000 (status RED) and observe how variance turns negative.',
        check: {
          question: 'What is the "5-Second Rule" in executive dashboard design for corporate reporting?',
          options: [
            'An executive should be able to understand the overall operational status and critical performance metrics within 5 seconds of looking at the dashboard',
            'All formulas must calculate in under 5 milliseconds',
            'The dashboard must automatically refresh every 5 seconds',
            'If you drop a paper financial report on the floor, you have 5 seconds to pick it up'
          ],
          answer: 0,
          why: 'The 5-Second Rule ensures dashboard typography, KPI cards, and color hierarchy communicate core performance and variance status immediately without cognitive overload.'
        }
      }
    ],
    summary: [
      'Power Query declarative M pipelines automate extraction, unpivoting (Table.UnpivotOtherColumns), and data cleaning with single-click refresh.',
      'Modern Excel LAMBDAs with SCAN and REDUCE enable recursive compound amortization schedules without VBA macros or spilled cell errors.',
      'An integrated 3-Statement Model links Net Income to Operating Cash Flow, CapEx to PP&E, and Ending Cash to the Balance Sheet to maintain mathematical balance.',
      'Scenario Switchboards (CHOOSE / XLOOKUP) allow instantaneous sensitivity testing between Base, Bull, and Bear assumptions across a unified model.',
      'Executive KPI dashboard tiles utilize disciplined typography, benchmark comparisons, and variance indicators adhering to the 5-Second Rule.'
    ],
    projectStep: {
      title: 'Architect an Integrated 3-Statement Corporate Financial Model & Executive Dashboard',
      steps: [
        'Build an automated Power Query M ingestion pipeline to unpivot wide accounting trial balances into tidy records.',
        'Implement an Excel LAMBDA with SCAN to generate a recursive compounding treasury amortization schedule.',
        'Construct an integrated 3-Statement Model with balanced linkages between Net Income, Cash Flow, and Balance Sheet.',
        'Deploy a dynamic Scenario Switchboard driving Base, Bull, and Bear operational assumptions with CHOOSE / XLOOKUP.',
        'Design a C-suite Executive KPI Performance Dashboard featuring high-contrast metric tiles and variance status indicators.'
      ]
    }
  },
  {
    day: 4,
    title: 'Advanced Capital Budgeting, DCF Valuation, LBO Debt Waterfall & Real-Time Sensitivity Surfaces',
    goal: 'Master institutional financial valuation and capital structure engineering: Unlevered Free Cash Flow (UFCF) forecasting with mid-year convention discounting, WACC capital structure optimization via CAPM, LBO debt waterfall modeling with MoIC/IRR, dynamic 2-way sensitivity surfaces, and M&A accretion/dilution analysis.',
    minutes: 35,
    recap: 'In Day 3, we mastered Power Query declarative M transformations, Excel LAMBDAs with recursive compounding, 3-Statement financial linkages, and executive KPI dashboards. Today in Day 4, we enter institutional investment banking and corporate valuation: building discounted cash flow (DCF) models, optimizing corporate cost of capital (WACC), engineering leveraged buyout (LBO) debt waterfalls, and stress-testing acquisitions via dynamic sensitivity surfaces.',
    parts: [
      {
        title: 'Discounted Cash Flow (DCF) Valuation: Unlevered Free Cash Flow (UFCF) & Mid-Year Discounting',
        say: [
          'Discounted Cash Flow (DCF) valuation is the foundational corporate finance methodology for determining the intrinsic enterprise value of an operating business independent of its capital structure.',
          'The core metric of a DCF is Unlevered Free Cash Flow (UFCF), also termed Free Cash Flow to Firm (FCFF).',
          'UFCF measures the cash generated by core operations available to all capital providers (both debt and equity holders) after fulfilling tax obligations and reinvesting in working capital and fixed assets.',
          'The mathematical identity is: UFCF = EBIT * (1 - t) + D&A - CapEx - Delta NWC, where EBIT * (1 - t) represents Net Operating Profit After Taxes (NOPAT).',
          'Beginner financial models commit a critical timing error by discounting cash flows assuming cash is received as a lump sum on the final day of each year (December 31st).',
          'In reality, corporate revenues and expenses occur evenly across all 365 days of the fiscal year.',
          'Professional valuation models apply the Mid-Year Discounting Convention: discounting cash flows using fractional periods (t - 0.5), such that year 1 is discounted by (1 + WACC)^0.5, year 2 by (1 + WACC)^1.5, and so on.',
          'Terminal Value is then calculated using the Gordon Growth Perpetuity formula: TV = (UFCF_n * (1 + g)) / (WACC - g), discounted back to present value.'
        ],
        example: 'Like valuing a commercial apartment building: calculating the total rent collected minus property maintenance and taxes every month, rather than assuming all tenants pay 100% of their annual rent on New Year\'s Eve.',
        code: `# DCF Unlevered Free Cash Flow (UFCF) & Mid-Year Valuation Engine
def simulate_dcf_unlevered_fcf(ebit, tax_rate, d_and_a, capex, delta_nwc, wacc, terminal_growth):
    # 1. Net Operating Profit After Taxes (NOPAT)
    nopat = ebit * (1.0 - tax_rate)
    ufcf_y1 = nopat + d_and_a - capex - delta_nwc
    
    # 5-year operational forecast with 5% annual expansion
    forecast_ufcf = [ufcf_y1 * ((1.05) ** i) for i in range(5)]
    
    # Mid-year convention discounting: PV = CF / (1 + WACC)^(t - 0.5)
    pv_ufcf = [cf / ((1.0 + wacc) ** (i + 0.5)) for i, cf in enumerate(forecast_ufcf)]
    sum_pv_ufcf = sum(pv_ufcf)
    
    # Gordon Growth Terminal Value: TV = (UFCF_5 * (1 + g)) / (wacc - g)
    terminal_val = (forecast_ufcf[-1] * (1.0 + terminal_growth)) / (wacc - terminal_growth)
    pv_terminal_val = terminal_val / ((1.0 + wacc) ** 5.0)
    
    enterprise_value = sum_pv_ufcf + pv_terminal_val
    return {
        "forecast_ufcf": forecast_ufcf,
        "pv_ufcf": sum_pv_ufcf,
        "pv_tv": pv_terminal_val,
        "enterprise_value": enterprise_value
    }

res1 = simulate_dcf_unlevered_fcf(50000000, 0.25, 8000000, 12000000, 3000000, 0.085, 0.025)
print("=== DCF VALUATION & UFCF MODEL ===")
print(f"5-Year PV of Cash Flows: \${res1['pv_ufcf']:,.0f}")
print(f"PV of Terminal Value:    \${res1['pv_tv']:,.0f}")
print(f"Implied Enterprise Value: \${res1['enterprise_value']:,.0f}")`,
        output: `=== DCF VALUATION & UFCF MODEL ===\n5-Year PV of Cash Flows: $137,259,031\nPV of Terminal Value:    $421,192,820\nImplied Enterprise Value: $558,451,852`,
        codeNotes: [
          { line: 4, note: 'Calculates NOPAT and deducts CapEx and Delta NWC to determine Year 1 Unlevered Free Cash Flow' },
          { line: 11, note: 'Applies mid-year convention discounting ((i + 0.5)) reflecting continuous operational cash generation' },
          { line: 15, note: 'Evaluates Gordon Growth terminal value and discounts it over the 5-year discrete forecast horizon' }
        ],
        tryIt: 'Increase terminal_growth from 2.5% to 3.0% and observe how implied Enterprise Value increases by over $35M.',
        check: {
          question: 'Why do institutional DCF models utilize the Mid-Year Discounting Convention rather than standard year-end discounting?',
          options: [
            'Because corporate revenues and operating expenses occur continuously throughout the year, making mid-year discounting a more accurate reflection of cash timing than assuming lump-sum receipt on December 31st',
            'Because it divides corporate tax liabilities in half',
            'Because mid-year discounting is required by Python syntax',
            'Because standard discounting ignores depreciation'
          ],
          answer: 0,
          why: 'Cash flows are generated steadily throughout all twelve months; assuming cash is only received on the final day of the year understates present value.'
        }
      },
      {
        title: 'Weighted Average Cost of Capital (WACC): Capital Asset Pricing Model (CAPM) & Debt Tax Shield',
        say: [
          'In discounted cash flow valuation, future cash flows must be discounted by a rate reflecting the overall opportunity cost of capital for all investors in the firm.',
          'The Weighted Average Cost of Capital (WACC) calculates this hurdle rate by weighting the Cost of Equity (K_e) and after-tax Cost of Debt (K_d) according to their proportion in the target capital structure.',
          'The Cost of Equity is determined using the Capital Asset Pricing Model (CAPM): K_e = R_f + Beta * (R_m - R_f), where R_f is the Risk-Free Rate (e.g. 10-Year US Treasury yield), Beta measures systematic market risk, and (R_m - R_f) represents the Market Risk Premium (MRP).',
          'In contrast, debt interest payments are tax-deductible in corporate accounting, generating an interest tax shield that reduces the effective cost of debt to K_d * (1 - t).',
          'The blended WACC formula is: WACC = (E / (D + E)) * K_e + (D / (D + E)) * K_d * (1 - t).',
          'Optimizing capital structure balances the tax-shield benefit of cheaper debt against the rising risk of financial distress and bankruptcy as leverage increases.'
        ],
        example: 'Like financing a company with a blended loan: 70% funded by venture equity requiring a 10.5% return, and 30% funded by a bank loan at 6.5% where the government lets you write off 25% of the interest on your corporate tax return.',
        code: `# WACC & CAPM Capital Structure Optimization Engine
def calculate_wacc_capital_structure(risk_free_rate, equity_beta, market_risk_premium, pretax_cost_of_debt, tax_rate, debt_weight, equity_weight):
    # Cost of Equity via CAPM = Rf + Beta * MRP
    cost_of_equity = risk_free_rate + equity_beta * market_risk_premium
    # After-tax Cost of Debt = Rd * (1 - t)
    after_tax_cost_of_debt = pretax_cost_of_debt * (1.0 - tax_rate)
    # Blended Corporate WACC = We * Ke + Wd * Kd * (1 - t)
    wacc = (equity_weight * cost_of_equity) + (debt_weight * after_tax_cost_of_debt)
    return {
        "cost_of_equity": cost_of_equity,
        "after_tax_debt": after_tax_cost_of_debt,
        "wacc": wacc
    }

res2 = calculate_wacc_capital_structure(0.042, 1.15, 0.055, 0.065, 0.25, 0.30, 0.70)
print("=== WACC CAPITAL STRUCTURE ANALYSIS ===")
print(f"Cost of Equity (CAPM): {res2['cost_of_equity']*100:.2f}%")
print(f"After-Tax Cost of Debt: {res2['after_tax_debt']*100:.2f}%")
print(f"Blended Corporate WACC: {res2['wacc']*100:.2f}%")`,
        output: `=== WACC CAPITAL STRUCTURE ANALYSIS ===\nCost of Equity (CAPM): 10.53%\nAfter-Tax Cost of Debt: 4.88%\nBlended Corporate WACC: 8.83%`,
        codeNotes: [
          { line: 4, note: 'Calculates Cost of Equity using CAPM: 4.2% Rf + 1.15 Beta * 5.5% MRP = 10.53%' },
          { line: 6, note: 'Applies corporate tax shield (1 - 0.25) reducing gross 6.5% debt cost to 4.88% effective' },
          { line: 8, note: 'Weights equity (70%) and debt (30%) to establish an 8.83% corporate discount hurdle rate' }
        ],
        tryIt: 'Increase debt_weight to 0.40 and decrease equity_weight to 0.60, and observe how the corporate WACC drops to 8.27%.',
        check: {
          question: 'Why is the Cost of Debt multiplied by (1 - tax_rate) in the WACC formula?',
          options: [
            'Because corporate interest expense is tax-deductible, creating an interest tax shield that lowers the effective after-tax cost of borrowing',
            'Because debt holders do not pay capital gains tax',
            'Because banks automatically waive interest fees during recessions',
            'Because the Federal Reserve subsidizes all corporate bond yields'
          ],
          answer: 0,
          why: 'Interest paid on corporate debt reduces taxable income, meaning the true cost of debt to the enterprise is reduced by the marginal tax rate.'
        }
      },
      {
        title: 'Leveraged Buyout (LBO) Debt Financing Waterfall & Internal Rate of Return (IRR)',
        say: [
          'A Leveraged Buyout (LBO) is an acquisition of a target company financed using a significant amount of borrowed debt (typically 50% to 70% of total enterprise value) alongside a smaller sponsor equity contribution from a private equity firm.',
          'The core investment thesis of an LBO relies on three distinct value-creation engines:',
          'Engine 1: Operational Deleveraging: the target company uses its strong, predictable free cash flows to pay down the acquisition debt over a 3-to-7 year holding period, transferring enterprise value from lenders directly into sponsor equity.',
          'Engine 2: Operational EBITDA Growth: expanding revenues and cutting unnecessary costs to exit at a higher earnings base.',
          'Engine 3: Multiple Expansion: selling the business at a higher valuation multiple (EV / EBITDA) upon exit than was paid at entry.',
          'Private equity performance is benchmarked using two primary metrics: Multiple on Invested Capital (MoIC = Exit Equity / Entry Equity) and the annualized Internal Rate of Return (IRR).',
          'Private equity sponsors typically target a 2.0x to 3.0x MoIC and a 20%+ net IRR across their portfolio companies.'
        ],
        example: 'Like purchasing a rental house with a 20% down payment (sponsor equity) and an 80% mortgage (debt): using the tenant\'s monthly rental income to pay down the mortgage principal over 5 years so that when you sell, your equity return has doubled.',
        code: `# LBO Debt Waterfall, Deleveraging & Sponsor IRR Engine
def simulate_lbo_debt_waterfall(entry_ev, debt_multiple, ebitda_y0, exit_multiple, hold_years):
    entry_debt = debt_multiple * ebitda_y0
    sponsor_equity = entry_ev - entry_debt
    
    # 5 years of operational deleveraging: $15M cumulative debt paydown from free cash flow
    debt_paydown = 15000000.0
    exit_debt = max(0.0, entry_debt - debt_paydown)
    
    # Exit EBITDA with 6% compound annual growth rate
    exit_ebitda = ebitda_y0 * ((1.06) ** hold_years)
    exit_ev = exit_multiple * exit_ebitda
    exit_equity = exit_ev - exit_debt
    
    moic = exit_equity / sponsor_equity
    irr = (moic ** (1.0 / hold_years)) - 1.0
    return {
        "sponsor_equity_in": sponsor_equity,
        "sponsor_equity_out": exit_equity,
        "moic": moic,
        "irr": irr
    }

res3 = simulate_lbo_debt_waterfall(100000000, 4.0, 15000000, 7.5, 5)
print("=== LBO RETURN WATERFALL & IRR ENGINE ===")
print(f"Sponsor Initial Equity: \${res3['sponsor_equity_in']:,.0f}")
print(f"Sponsor Exit Equity:    \${res3['sponsor_equity_out']:,.0f}")
print(f"Multiple on Invested Capital (MoIC): {res3['moic']:.2f}x")
print(f"Net Sponsor IRR (5-Year): {res3['irr']*100:.1f}%")`,
        output: `=== LBO RETURN WATERFALL & IRR ENGINE ===\nSponsor Initial Equity: $40,000,000\nSponsor Exit Equity:    $105,550,377\nMultiple on Invested Capital (MoIC): 2.64x\nNet Sponsor IRR (5-Year): 21.4%`,
        codeNotes: [
          { line: 3, note: 'Calculates initial capital structure: $60M debt (4.0x EBITDA) and $40M sponsor equity on $100M EV' },
          { line: 8, note: 'Applies $15M cumulative free cash flow debt paydown reducing exit debt to $45M' },
          { line: 15, note: 'Generates 2.64x MoIC and 21.4% IRR over a 5-year investment holding period' }
        ],
        tryIt: 'Increase exit_multiple from 7.5x to 8.5x (multiple expansion) and verify that MoIC jumps to 3.00x and IRR exceeds 24%.',
        check: {
          question: 'How does debt paydown (deleveraging) create equity value for a private equity sponsor in an LBO?',
          options: [
            'As the portfolio company uses operational cash flows to repay bank debt, the enterprise value of the firm is transferred from lenders to the equity sponsor, increasing equity value even if the total enterprise value remains unchanged',
            'It forces the government to provide equity grants',
            'It reduces the corporate revenue to zero',
            'It replaces all preferred shares with warrants'
          ],
          answer: 0,
          why: 'Because Enterprise Value = Equity + Debt, paying down debt with company cash flows directly expands the sponsor equity slice upon exit.'
        }
      },
      {
        title: 'Dynamic 2-Way Data Tables & Multi-Dimensional Sensitivity Surfaces',
        say: [
          'In corporate valuation and deal negotiations, relying on a single static point estimate is dangerous. Dealmakers must understand how valuation behaves across ranges of key assumptions.',
          'In Excel, a 2-Way Data Table (Data > What-If Analysis > Data Table) automates matrix sensitivity modeling across two variables (such as WACC on the horizontal axis and Terminal Exit Multiple on the vertical axis).',
          'Under the hood, Excel iteratively substitutes each combination of row and column input values into the model, evaluates the dependent output formula (such as Implied Share Price or Enterprise Value), and records the resulting grid.',
          'Sensitivity tables allow investment committees to identify the "Margin of Safety": the valuation floor under conservative Bear case conditions versus upside under Bull case conditions.',
          'Professional models color-code sensitivity matrices using conditional formatting color scales (Green for accretive/high valuation, Amber for neutral, Red for dilutive/low valuation), giving executives immediate visual comprehension of deal risk.'
        ],
        example: 'Like an elevation contour map of a mountain: instead of knowing just the height of the mountain peak, you can see the steep cliffs and gentle slopes across every compass direction.',
        code: `# Dynamic 2-Way Valuation Sensitivity Surface Generator
def generate_two_way_sensitivity_surface(base_ebitda, wacc_rates, terminal_multiples):
    grid = []
    for m in terminal_multiples:
        row = []
        for w in wacc_rates:
            # Implied EV sensitivity: Base EBITDA * Multiple adjusted for discount rate variations
            val = (base_ebitda * m) / (1.0 + (w - 0.08) * 4.0)
            row.append(round(val / 1000000, 1))
        grid.append(row)
    return grid

wacc_range = [0.075, 0.080, 0.085, 0.090]
mult_range = [6.0, 7.0, 8.0, 9.0]
surface = generate_two_way_sensitivity_surface(20000000, wacc_range, mult_range)
print("=== DYNAMIC 2-WAY SENSITIVITY SURFACE (\$M) ===")
print("Multiple \\ WACC | 7.5%   | 8.0%   | 8.5%   | 9.0%   |")
for m, row in zip(mult_range, surface):
    print(f"{m:4.1f}x Exit Mult | \${row[0]:<5.1f} | \${row[1]:<5.1f} | \${row[2]:<5.1f} | \${row[3]:<5.1f} |")`,
        output: `=== DYNAMIC 2-WAY SENSITIVITY SURFACE ($M) ===\nMultiple \\ WACC | 7.5%   | 8.0%   | 8.5%   | 9.0%   |\n 6.0x Exit Mult | $122.4 | $120.0 | $117.6 | $115.4 |\n 7.0x Exit Mult | $142.9 | $140.0 | $137.3 | $134.6 |\n 8.0x Exit Mult | $163.3 | $160.0 | $156.9 | $153.8 |\n 9.0x Exit Mult | $183.7 | $180.0 | $176.5 | $173.1 |`,
        codeNotes: [
          { line: 2, note: 'Generates a 2-dimensional sensitivity matrix evaluating Valuation across WACC and Multiples' },
          { line: 8, note: 'Adjusts implied enterprise value for cost of capital sensitivity and terminal multiples' },
          { line: 17, note: 'Outputs clear valuation boundaries ranging from $115.4M (Bear) to $183.7M (Bull)' }
        ],
        tryIt: 'Add a 10.0x exit multiple to mult_range and observe the valuation surface reach over $204M at 7.5% WACC.',
        check: {
          question: 'What is the primary objective of a 2-Way Data Table in corporate valuation modeling?',
          options: [
            'To evaluate how a key output metric (e.g. Enterprise Value) changes when two independent assumptions (e.g. WACC and Exit Multiple) vary simultaneously',
            'To format Excel spreadsheet cells into alternating bold fonts',
            'To double the font size of row headers',
            'To convert an Excel workbook into an XML database'
          ],
          answer: 0,
          why: '2-Way Data Tables allow financial analysts to stress-test financial projections across ranges of two core drivers simultaneously, highlighting operational risk and valuation boundaries.'
        }
      },
      {
        title: 'M&A Accretion / Dilution Modeling & Synergies Sensitivity Matrix',
        say: [
          'In strategic corporate mergers and acquisitions (M&A), the ultimate litmus test for public shareholders is whether the acquisition is Accretive or Dilutive to the acquirer\'s Earnings Per Share (EPS).',
          'An acquisition is Accretive if the combined pro-forma EPS exceeds the acquirer\'s standalone EPS; it is Dilutive if pro-forma EPS decreases.',
          'The accretion/dilution equation is driven by three variables: the purchase consideration mix (Cash vs Debt vs Equity), the cost of financing, and pre-tax Synergies.',
          'Issuing new equity dilutes existing shares, while issuing debt increases interest expense (lowering net income, partially offset by interest tax deductibility).',
          'Cost Synergies (e.g. headcount redundancies, consolidated software licenses) and Revenue Synergies (cross-selling products) provide pre-tax earnings upside.',
          'Pro-Forma Combined Net Income is calculated as: Acquirer Net Income + Target Net Income + Synergies * (1 - t) - After-Tax Transaction Interest Expense.',
          'Dividing combined net income by the new total diluted share count reveals pro-forma EPS.',
          'Wall Street penalizes dilutive acquisitions; models therefore incorporate Synergies Sensitivity Break-Even analysis to determine the minimum synergy dollars required to prevent EPS dilution.'
        ],
        example: 'Like combining two profitable coffee shops: if Shop A buys Shop B by taking out a bank loan, the combined earnings must exceed the extra loan interest payments so that Shop A\'s owners take home more profit per share than before the merger.',
        code: `# M&A Accretion / Dilution & Synergies Modeling Engine
def evaluate_ma_accretion_dilution(acquirer_eps, acquirer_shares, target_net_income, deal_value, pct_stock, pct_debt, debt_rate, tax_rate, synergies):
    acquirer_net_income = acquirer_eps * acquirer_shares
    # Shares issued based on acquirer stock price ($4.50 EPS * 20 P/E = $90.00/share)
    acquirer_stock_price = acquirer_eps * 20.0
    new_shares_issued = (deal_value * pct_stock) / acquirer_stock_price
    new_interest_expense = (deal_value * pct_debt) * debt_rate * (1.0 - tax_rate)
    
    # Combined Pro-Forma Net Income
    combined_net_income = acquirer_net_income + target_net_income + (synergies * (1.0 - tax_rate)) - new_interest_expense
    combined_shares = acquirer_shares + new_shares_issued
    pro_forma_eps = combined_net_income / combined_shares
    accretion_pct = ((pro_forma_eps - acquirer_eps) / acquirer_eps) * 100.0
    return {
        "standalone_eps": acquirer_eps,
        "pro_forma_eps": pro_forma_eps,
        "accretion_pct": accretion_pct,
        "verdict": "ACCRETIVE" if accretion_pct > 0 else "DILUTIVE"
    }

res5 = evaluate_ma_accretion_dilution(4.50, 100000000, 80000000, 1000000000, 0.60, 0.40, 0.06, 0.25, 25000000)
print("=== M&A ACCRETION / DILUTION & SYNERGIES MODEL ===")
print(f"Acquirer Standalone EPS: \${res5['standalone_eps']:.2f}")
print(f"Combined Pro-Forma EPS:  \${res5['pro_forma_eps']:.2f}")
print(f"Accretion Percentage:    +{res5['accretion_pct']:.2f}%")
print(f"Transaction Verdict:     {res5['verdict']}")`,
        output: `=== M&A ACCRETION / DILUTION & SYNERGIES MODEL ===\nAcquirer Standalone EPS: $4.50\nCombined Pro-Forma EPS:  $4.98\nAccretion Percentage:    +10.57%\nTransaction Verdict:     ACCRETIVE`,
        codeNotes: [
          { line: 5, note: 'Calculates new shares issued based on 60% stock consideration and $90 stock price' },
          { line: 9, note: 'Calculates pro-forma net income incorporating target earnings, after-tax synergies, and debt interest' },
          { line: 20, note: 'Confirms deal is +10.57% accretive, raising EPS from $4.50 to $4.98' }
        ],
        tryIt: 'Set synergies to $0 and observe that the acquisition remains accretive at +6.4% due to strong target net income.',
        check: {
          question: 'What does it mean for an M&A corporate acquisition to be "accretive" to Earnings Per Share (EPS)?',
          options: [
            'The combined pro-forma company\'s Earnings Per Share is higher than the acquirer\'s standalone EPS prior to the acquisition',
            'The target company changes its ticker symbol',
            'The acquirer borrows 100% of the deal consideration from a central bank',
            'All existing shareholders are forced to sell their shares at a discount'
          ],
          answer: 0,
          why: 'An acquisition is accretive when the net earnings contributed by the target (plus synergies minus financing costs) divided by the new share count produces a higher EPS than the acquirer earned on its own.'
        }
      }
    ],
    summary: [
      'Unlevered Free Cash Flow (UFCF) measures operating cash available to all capital providers, discounted via mid-year conventions to reflect continuous receipt.',
      'WACC weights Cost of Equity (CAPM) and Cost of Debt, applying the interest tax shield (1 - t) to lower the corporate hurdle rate.',
      'LBO debt waterfalls demonstrate how operational deleveraging transfers firm enterprise value from lenders into sponsor equity over a 5-year horizon.',
      'Dynamic 2-Way Data Tables automate matrix sensitivity modeling across WACC and exit multiples to establish valuation margins of safety.',
      'M&A accretion/dilution models evaluate pro-forma EPS impact based on consideration structure (cash/debt/equity), financing costs, and operational synergies.'
    ],
    projectStep: {
      title: 'Architect an Institutional DCF Valuation, LBO Waterfall & M&A Accretion Engine',
      steps: [
        'Forecast 5-year Unlevered Free Cash Flows (UFCF) and compute Enterprise Value using mid-year convention discounting and Gordon Growth.',
        'Optimize corporate WACC by estimating the Cost of Equity via CAPM and applying the interest debt tax shield.',
        'Construct a 5-year LBO return waterfall calculating MoIC and annualized net sponsor IRR under operational deleveraging.',
        'Build a dynamic 2-Way Sensitivity Surface matrix stress-testing Enterprise Value across discount rates and exit multiples.',
        'Implement an M&A accretion/dilution engine calculating pro-forma EPS impact and synergies break-even thresholds.'
      ]
    }
  }
];
