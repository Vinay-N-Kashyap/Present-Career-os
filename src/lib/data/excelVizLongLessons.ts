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
  }
];
