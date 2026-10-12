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
  }
];
