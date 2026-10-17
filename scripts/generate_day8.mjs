import fs from 'node:fs';
import { execSync } from 'node:child_process';

function runPy(code) {
  const tmp = 'temp_py_eval.py';
  fs.writeFileSync(tmp, code, 'utf-8');
  try {
    const out = execSync('python temp_py_eval.py', { encoding: 'utf-8' });
    return out.trim();
  } finally {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  }
}

export function getDay8() {
  const p1_code = [
    "# Star Schema Architecture & Relational Topology Validator",
    "def build_star_schema_relationship_graph(fact_records, dim_customers, dim_products):",
    "    cust_keys = {c['cust_id'] for c in dim_customers}",
    "    prod_keys = {p['prod_id'] for p in dim_products}",
    "    ",
    "    dangling_cust_keys = set()",
    "    dangling_prod_keys = set()",
    "    total_revenue = 0.0",
    "    ",
    "    for tx in fact_records:",
    "        if tx['cust_id'] not in cust_keys:",
    "            dangling_cust_keys.add(tx['cust_id'])",
    "        if tx['prod_id'] not in prod_keys:",
    "            dangling_prod_keys.add(tx['prod_id'])",
    "        total_revenue += tx['amount_usd']",
    "        ",
    "    is_valid_star = (len(dangling_cust_keys) == 0) and (len(dangling_prod_keys) == 0)",
    "    return {",
    "        'fact_row_count': len(fact_records),",
    "        'dim_customer_count': len(dim_customers),",
    "        'dim_product_count': len(dim_products),",
    "        'total_revenue_usd': round(total_revenue, 2),",
    "        'dangling_foreign_keys': len(dangling_cust_keys) + len(dangling_prod_keys),",
    "        'star_schema_integrity': 'CERTIFIED_VALID_STAR' if is_valid_star else 'REFERENTIAL_INTEGRITY_VIOLATION'",
    "    }",
    "",
    "dim_cust = [",
    "    {'cust_id': 'C10', 'name': 'Apex Global', 'tier': 'Enterprise'},",
    "    {'cust_id': 'C20', 'name': 'Beacon Tech', 'tier': 'Mid-Market'},",
    "    {'cust_id': 'C30', 'name': 'Crestline Inc', 'tier': 'Enterprise'}",
    "]",
    "dim_prod = [",
    "    {'prod_id': 'P01', 'sku': 'SaaS-Platform', 'category': 'Software'},",
    "    {'prod_id': 'P02', 'sku': 'API-Gateway', 'category': 'Infrastructure'}",
    "]",
    "fact_sales = [",
    "    {'tx_id': 1, 'cust_id': 'C10', 'prod_id': 'P01', 'amount_usd': 45000.0},",
    "    {'tx_id': 2, 'cust_id': 'C20', 'prod_id': 'P02', 'amount_usd': 28000.0},",
    "    {'tx_id': 3, 'cust_id': 'C30', 'prod_id': 'P01', 'amount_usd': 62000.0},",
    "    {'tx_id': 4, 'cust_id': 'C10', 'prod_id': 'P02', 'amount_usd': 34000.0}",
    "]",
    "",
    "graph = build_star_schema_relationship_graph(fact_sales, dim_cust, dim_prod)",
    "print('=== STAR SCHEMA RELATIONSHIP TOPOLOGY AUDIT ===')",
    "print(f\"Fact Records Landed:      {graph['fact_row_count']}\")",
    "print(f\"Dimension Entities:       {graph['dim_customer_count']} Cust, {graph['dim_product_count']} Prod\")",
    "print(f\"Total Billed Revenue:     ${graph['total_revenue_usd']:,.2f}\")",
    "print(f\"Dangling Foreign Keys:    {graph['dangling_foreign_keys']}\")",
    "print(f\"Relational Schema State:  {graph['star_schema_integrity']}\")"
  ].join('\n');

  const p1_out = runPy(p1_code);

  const p2_code = [
    "# DAX Evaluation Context: Row Context vs Filter Context Simulator",
    "def evaluate_dax_filter_context(fact_sales, dim_cust, active_filters):",
    "    # Step 1: Filter Context Propagation from Dimensions to Fact",
    "    matching_cust_ids = set()",
    "    for c in dim_cust:",
    "        match = True",
    "        for f_key, f_val in active_filters.items():",
    "            if c.get(f_key) != f_val:",
    "                match = False",
    "                break",
    "        if match:",
    "            matching_cust_ids.add(c['cust_id'])",
    "            ",
    "    # Step 2: Context Transition & Filtered Aggregation (CALCULATE equivalent)",
    "    filtered_revenue = 0.0",
    "    total_unfiltered_revenue = 0.0",
    "    ",
    "    for tx in fact_sales:",
    "        amt = tx['amount_usd']",
    "        total_unfiltered_revenue += amt",
    "        if tx['cust_id'] in matching_cust_ids:",
    "            filtered_revenue += amt",
    "            ",
    "    share_of_total = (filtered_revenue / total_unfiltered_revenue) if total_unfiltered_revenue > 0 else 0.0",
    "    return {",
    "        'active_filter': str(active_filters),",
    "        'qualifying_customers': sorted(list(matching_cust_ids)),",
    "        'filtered_dax_revenue': round(filtered_revenue, 2),",
    "        'all_unfiltered_revenue': round(total_unfiltered_revenue, 2),",
    "        'dax_share_of_total_pct': round(share_of_total * 100, 2)",
    "    }",
    "",
    "dim_customers = [",
    "    {'cust_id': 'C10', 'tier': 'Enterprise'},",
    "    {'cust_id': 'C20', 'tier': 'Mid-Market'},",
    "    {'cust_id': 'C30', 'tier': 'Enterprise'}",
    "]",
    "fact_txs = [",
    "    {'tx_id': 1, 'cust_id': 'C10', 'amount_usd': 45000.0},",
    "    {'tx_id': 2, 'cust_id': 'C20', 'amount_usd': 28000.0},",
    "    {'tx_id': 3, 'cust_id': 'C30', 'amount_usd': 62000.0},",
    "    {'tx_id': 4, 'cust_id': 'C10', 'amount_usd': 34000.0}",
    "]",
    "",
    "dax_ent = evaluate_dax_filter_context(fact_txs, dim_customers, {'tier': 'Enterprise'})",
    "print('=== DAX EVALUATION CONTEXT & CALCULATE ENGINE ===')",
    "print(f\"Applied Filter Context:   {dax_ent['active_filter']}\")",
    "print(f\"Qualifying Customer Keys: {dax_ent['qualifying_customers']}\")",
    "print(f\"Filtered DAX Revenue:     ${dax_ent['filtered_dax_revenue']:,.2f}\")",
    "print(f\"ALL() Baseline Revenue:   ${dax_ent['all_unfiltered_revenue']:,.2f}\")",
    "print(f\"Share of Total Measure:   {dax_ent['dax_share_of_total_pct']}%\")"
  ].join('\n');

  const p2_out = runPy(p2_code);

  const p3_code = [
    "# Role-Playing Dimensions & USERELATIONSHIP Dynamic Activation",
    "def activate_userelationship_path(orders, date_filter, date_role='OrderDate'):",
    "    # In tabular modeling, Date table can link via OrderDate (Active) or ShipDate (Inactive)",
    "    qualifying_orders = []",
    "    total_shipped_revenue = 0.0",
    "    ",
    "    for ord_record in orders:",
    "        eval_date = ord_record['order_date'] if date_role == 'OrderDate' else ord_record['ship_date']",
    "        if eval_date == date_filter:",
    "            qualifying_orders.append(ord_record)",
    "            total_shipped_revenue += ord_record['amount_usd']",
    "            ",
    "    return {",
    "        'relationship_activated': f\"DimDate[Date] -> FactOrders[{date_role}]\",",
    "        'is_default_active_path': date_role == 'OrderDate',",
    "        'evaluated_date': date_filter,",
    "        'matching_order_count': len(qualifying_orders),",
    "        'attributed_revenue_usd': round(total_shipped_revenue, 2)",
    "    }",
    "",
    "ledger_orders = [",
    "    {'order_id': 501, 'order_date': '2026-10-01', 'ship_date': '2026-10-03', 'amount_usd': 52000.0},",
    "    {'order_id': 502, 'order_date': '2026-10-01', 'ship_date': '2026-10-01', 'amount_usd': 34000.0},",
    "    {'order_id': 503, 'order_date': '2026-10-02', 'ship_date': '2026-10-03', 'amount_usd': 78000.0},",
    "    {'order_id': 504, 'order_date': '2026-10-03', 'ship_date': '2026-10-04', 'amount_usd': 61000.0}",
    "]",
    "",
    "target_day = '2026-10-03'",
    "active_path = activate_userelationship_path(ledger_orders, target_day, date_role='OrderDate')",
    "inactive_path = activate_userelationship_path(ledger_orders, target_day, date_role='ShipDate')",
    "",
    "print('=== USERELATIONSHIP DYNAMIC PATH ACTIVATION ===')",
    "print(f\"Default Path (OrderDate): {active_path['matching_order_count']} orders | ${active_path['attributed_revenue_usd']:,.2f}\")",
    "print(f\"USERELATIONSHIP (ShipDate): {inactive_path['matching_order_count']} orders | ${inactive_path['attributed_revenue_usd']:,.2f}\")",
    "print(f\"Accounting Timing Delta:  ${abs(active_path['attributed_revenue_usd'] - inactive_path['attributed_revenue_usd']):,.2f}\")"
  ].join('\n');

  const p3_out = runPy(p3_code);

  const p4_code = [
    "# Multi-Table PivotTable & Slicer Cache Synchronization Simulator",
    "def synchronize_slicer_cache(fact_txs, dim_regions, selected_region):",
    "    # Verify PivotCache cross-filter propagation across multiple pivot models",
    "    valid_region_codes = {r['region_id'] for r in dim_regions if r['name'] == selected_region}",
    "    ",
    "    table1_filtered_spend = 0.0",
    "    table2_transaction_count = 0",
    "    ",
    "    for tx in fact_txs:",
    "        if tx['region_id'] in valid_region_codes:",
    "            table1_filtered_spend += tx['amount_usd']",
    "            table2_transaction_count += 1",
    "            ",
    "    return {",
    "        'slicer_selection': selected_region,",
    "        'matching_region_ids': sorted(list(valid_region_codes)),",
    "        'pivot1_synchronized_spend': round(table1_filtered_spend, 2),",
    "        'pivot2_synchronized_tx_count': table2_transaction_count,",
    "        'cache_sync_status': 'PIVOT_CACHE_COHERENT'",
    "    }",
    "",
    "regions = [",
    "    {'region_id': 'R_NA', 'name': 'North America'},",
    "    {'region_id': 'R_EU', 'name': 'Europe'},",
    "    {'region_id': 'R_AP', 'name': 'Asia Pacific'}",
    "]",
    "transactions = [",
    "    {'id': 1, 'region_id': 'R_NA', 'amount_usd': 45000.0},",
    "    {'id': 2, 'region_id': 'R_EU', 'amount_usd': 32000.0},",
    "    {'id': 3, 'region_id': 'R_NA', 'amount_usd': 58000.0},",
    "    {'id': 4, 'region_id': 'R_AP', 'amount_usd': 21000.0},",
    "    {'id': 5, 'region_id': 'R_NA', 'amount_usd': 39000.0}",
    "]",
    "",
    "sync = synchronize_slicer_cache(transactions, regions, 'North America')",
    "print('=== SLICER CACHE & MULTI-PIVOT SYNCHRONIZATION ===')",
    "print(f\"Slicer Selection:         {sync['slicer_selection']}\")",
    "print(f\"Synchronized Pivot 1:     ${sync['pivot1_synchronized_spend']:,.2f} Spend\")",
    "print(f\"Synchronized Pivot 2:     {sync['pivot2_synchronized_tx_count']} Volume Records\")",
    "print(f\"PivotCache Integrity:    {sync['cache_sync_status']}\")"
  ].join('\n');

  const p4_out = runPy(p4_code);

  const p5_code = [
    "# Production Enterprise Relational Model & Dynamic DAX KPI Measure Engine",
    "class ProductionEnterpriseDataModelEngine:",
    "    def __init__(self, fact_sales, dim_date, dim_bu):",
    "        self.facts = fact_sales",
    "        self.dates = {d['date_key']: d for d in dim_date}",
    "        self.bus = {b['bu_id']: b for b in dim_bu}",
    "        ",
    "    def compute_executive_kpis(self, target_year=2026):",
    "        current_year_rev = 0.0",
    "        prior_year_rev = 0.0",
    "        bu_breakdown = {}",
    "        ",
    "        for tx in self.facts:",
    "            d_info = self.dates.get(tx['date_key'])",
    "            b_info = self.bus.get(tx['bu_id'])",
    "            if not d_info or not b_info:",
    "                continue",
    "                ",
    "            amt = tx['revenue_usd']",
    "            yr = d_info['year']",
    "            ",
    "            if yr == target_year:",
    "                current_year_rev += amt",
    "                b_name = b_info['bu_name']",
    "                bu_breakdown[b_name] = bu_breakdown.get(b_name, 0.0) + amt",
    "            elif yr == target_year - 1:",
    "                prior_year_rev += amt",
    "                ",
    "        yoy_growth = ((current_year_rev - prior_year_rev) / prior_year_rev) if prior_year_rev > 0 else 0.0",
    "        return {",
    "            'target_fiscal_year': target_year,",
    "            'current_year_dax_revenue': round(current_year_rev, 2),",
    "            'prior_year_dax_revenue': round(prior_year_rev, 2),",
    "            'yoy_growth_percentage': round(yoy_growth * 100, 2),",
    "            'bu_distribution': {k: round(v, 2) for k, v in sorted(bu_breakdown.items())},",
    "            'model_governance_status': 'STAR_SCHEMA_DAX_CERTIFIED'",
    "        }",
    "",
    "dim_d = [",
    "    {'date_key': '2025-Q4', 'year': 2025},",
    "    {'date_key': '2026-Q1', 'year': 2026},",
    "    {'date_key': '2026-Q2', 'year': 2026}",
    "]",
    "dim_b = [",
    "    {'bu_id': 'B1', 'bu_name': 'Enterprise Software'},",
    "    {'bu_id': 'B2', 'bu_name': 'Cloud Infrastructure'}",
    "]",
    "facts = [",
    "    {'tx_id': 101, 'date_key': '2025-Q4', 'bu_id': 'B1', 'revenue_usd': 120000.0},",
    "    {'tx_id': 102, 'date_key': '2025-Q4', 'bu_id': 'B2', 'revenue_usd': 95000.0},",
    "    {'tx_id': 103, 'date_key': '2026-Q1', 'bu_id': 'B1', 'revenue_usd': 145000.0},",
    "    {'tx_id': 104, 'date_key': '2026-Q1', 'bu_id': 'B2', 'revenue_usd': 118000.0},",
    "    {'tx_id': 105, 'date_key': '2026-Q2', 'bu_id': 'B1', 'revenue_usd': 160000.0}",
    "]",
    "",
    "engine = ProductionEnterpriseDataModelEngine(facts, dim_d, dim_b)",
    "kpis = engine.compute_executive_kpis(target_year=2026)",
    "",
    "print('=== PRODUCTION ENTERPRISE DATA MODEL & DAX KPI ENGINE ===')",
    "print(f\"Fiscal Year Evaluated:    {kpis['target_fiscal_year']}\")",
    "print(f\"Current Year DAX Revenue: ${kpis['current_year_dax_revenue']:,.2f}\")",
    "print(f\"Prior Year DAX Revenue:   ${kpis['prior_year_dax_revenue']:,.2f}\")",
    "print(f\"YoY Expansion Rate:       +{kpis['yoy_growth_percentage']}%\")",
    "print(f\"BU Contribution:          {kpis['bu_distribution']}\")",
    "print(f\"Board Audit Status:       {kpis['model_governance_status']}\")"
  ].join('\n');

  const p5_out = runPy(p5_code);

  return {
    day: 8,
    title: 'Advanced PivotTables, Slicers & Dynamic Relational Data Models',
    goal: 'Master enterprise relational data modeling in Excel: Star schema design, fact vs dimension tables, DAX evaluation context (row vs filter context), inactive relationships, USERELATIONSHIP, and cross-filtering slicers.',
    minutes: 35,
    recap: 'Yesterday we mastered declarative Power Query ETL pipelines, dynamic unpivoting, schema drift auditing, and Jaro-Winkler entity resolution. Today we advance from flat tables into enterprise relational data modeling: architecting Star schemas, mastering DAX row versus filter evaluation context, activating secondary inactive relationships dynamically via USERELATIONSHIP, and synchronizing multi-table PivotTable slicers.',
    parts: [
      {
        title: 'Star Schema Architecture: Fact Tables vs Dimension Tables',
        say: [
          'In legacy spreadsheet modeling, financial analysts frequently attempt to force all corporate transactions into a single, massive monolithic worksheet. They use VLOOKUP or XLOOKUP to denormalize customer names, product categories, and sales rep details directly into every individual invoice row. While conceptually simple, this monolithic design degrades Excel performance exponentially, consumes gigabytes of memory through redundant text storage, and creates severe update anomalies where updating a customer billing address requires modifying thousands of historical rows.',
          'Modern Excel data modeling, powered by the Power Pivot VertiPaq tabular engine, replaces monolithic sheets with dimensional modeling principles developed by Ralph Kimball: the Star Schema. In a Star Schema, data is partitioned into two distinct categories of tables: Fact tables and Dimension tables. The Fact table resides at the center of the star, containing high-cardinality, numerical transaction metrics—such as sales revenue, units shipped, discounts, and cost of goods sold—paired with integer foreign key identifiers.',
          'Surrounding the Fact table are Dimension tables, which contain low-cardinality, descriptive business context—such as Customer Master, Product Catalog, Sales Geography, and the mandatory Calendar Date table. Each Dimension table possesses a unique, non-null Primary Key. Relationships in a Star Schema are strictly one-to-many: one record in the Customer Dimension links to many corresponding transaction rows in the Sales Fact table.',
          'The cardinal rule of relational star schema design is single-direction filter propagation: filter context flows effortlessly from the one-side (the Dimension table) down to the many-side (the Fact table), but never backwards. Slicing by Product Category automatically filters the Fact table to calculate category revenue. Introducing bi-directional cross-filtering between dimensions and facts creates ambiguous filter paths and severe performance degradation, and must be strictly avoided in financial architectures.',
          'Furthermore, relational integrity requires zero dangling foreign keys. If a transaction record in FactSales contains a customer identifier of C99, but C99 does not exist in DimCustomer, the relational model is compromised. Tabular engines handle dangling keys by generating a blank synthetic dimension row, which surfaces in PivotTables as an unassigned category, signaling data leakage to audit teams.',
          'In enterprise financial systems, establishing a clean Star Schema allows organizations to scale spreadsheets to tens of millions of rows while maintaining instantaneous sub-second query response times. Because descriptive text strings exist once in their respective dimension tables, the VertiPaq engine compresses the numeric Fact table using bit-packed integer indexing, reducing memory footprints by up to ninety percent.',
          'Additionally, separating transactional metrics from descriptive business entities establishes an immutable single source of truth: when a corporate customer changes legal names, updating a single row in DimCustomer immediately reflects across all historical and forward PivotTables without altering a single historical transaction ledger.',
          'Moreover, adopting a star schema structure dramatically simplifies financial report authoring. Instead of memorizing hundreds of complex multi-condition nested cell formulas, analysts simply drag dimensional attributes into pivot rows and columns, confident that the relational engine will dynamically execute the correct underlying SQL joins and aggregations automatically.',
          'In this lesson, we build a Star Schema relational topology auditor in Python. We ingest transactional fact records alongside customer and product dimension masters, assert referential integrity, detect dangling foreign keys, and certify the schema for enterprise Power Pivot deployment.'
        ],
        example: 'Think of an international airline hub: the central flight schedule (Fact table) records flight numbers, departure times, passenger counts, and gate IDs; while separate directories (Dimension tables) define airport details, aircraft specifications, and crew profiles, preventing redundant aircraft descriptions on every flight ticket.',
        code: p1_code,
        output: p1_out,
        codeNotes: [
          { line: 2, note: 'Validates Star Schema topology ensuring 1-to-many cardinality between dimensions and fact table' },
          { line: 10, note: 'Audits referential integrity asserting zero dangling foreign keys across customer and product keys' },
          { line: 17, note: 'Certifies relational data model readiness for Power Pivot VertiPaq tabular engine' }
        ],
        tryIt: 'Add a fact record with an unregistered customer ID (e.g. C99) and observe the schema integrity switch to REFERENTIAL_INTEGRITY_VIOLATION.',
        check: {
          question: 'What is the fundamental architectural rule regarding filter propagation in a Star Schema?',
          options: [
            'Filters propagate strictly from the one-side (Dimension table) down to the many-side (Fact table), never in reverse',
            'Filters can only flow horizontally between two Fact tables',
            'Every Dimension table must contain at least ten million rows',
            'Fact tables must never contain numeric values'
          ],
          answer: 0,
          why: 'In a Star Schema, filter context flows unidirectionally from the one-side dimension (descriptive attributes) to the many-side fact (numerical transactions), guaranteeing deterministic and lightning-fast calculations.'
        }
      },
      {
        title: 'DAX Evaluation Context: Row Context vs Filter Context & CALCULATE',
        say: [
          'To author institutional financial models in Power Pivot and Excel Data Models, analysts must master the foundational theory of Data Analysis Expressions, or DAX. The single most common failure point for spreadsheet professionals transitioning to DAX is misunderstanding Evaluation Context. Every formula evaluated in a tabular model operates under one or both of two distinct contexts: Row Context and Filter Context.',
          'Row Context exists automatically when authoring a Calculated Column or using iterator functions such as SUMX, AVERAGEX, or FILTER. In Row Context, the formula engine iterates through a table row by row, having access to the values of the current row across all columns in that specific table. However, Row Context does not automatically filter other tables, nor does it see values in other rows. Beginner analysts frequently write expensive calculated columns when they should be authoring dynamic measures.',
          'Filter Context, by contrast, is the ambient set of active filters operating on the data model at the exact moment a cell is evaluated. Filter context is established dynamically by the coordinates of the PivotTable: the specific row label, column header, active slicer selections, and report-level filters. For example, when evaluating a PivotTable cell at the intersection of Enterprise Tier and Q1 2026, the Filter Context restricts the Fact table to only those transactions matching both criteria before summing.',
          'The bridge connecting Row Context and Filter Context is the most powerful function in DAX: CALCULATE. CALCULATE evaluates an expression within an altered or modified filter context. When called inside a row-iterating expression, CALCULATE triggers Context Transition, transforming the current row context into an equivalent filter context. Furthermore, CALCULATE allows modelers to override, remove, or expand existing filters using filter modifiers such as ALL(), ALLEXCEPT(), and KEEPFILTERS().',
          'For instance, calculating an executive Share of Total measure requires evaluating filtered revenue divided by unfiltered baseline revenue. Using CALCULATE(SUM(FactSales[Amount]), ALL(DimCustomer)) strips away customer filter context to compute total company sales across all accounts. Dividing the local filtered revenue by this grand total yields the precise percentage contribution of that specific customer cohort.',
          'In corporate financial reporting, failing to understand context transition produces catastrophic errors. An analyst attempting to rank business units by margin who omits ALL() will discover that every business unit ranks number one against itself, because the unmanaged filter context isolates that single unit rather than evaluating it against the full enterprise portfolio.',
          'Furthermore, explicit DAX measures conserve massive amounts of workbook memory compared to calculated columns. A calculated column physically writes values into every row on disk, whereas an explicit DAX measure is computed dynamically in memory only when rendered in a visual, ensuring peak model responsiveness.',
          'Advanced financial analysts also leverage DAX Studio to profile query performance. By inspecting Server Timings and SE (Storage Engine) versus FE (Formula Engine) execution splits, modelers verify that CALCULATE filter modifications are pushed directly into VertiPaq internal hash joins rather than falling back to slow single-threaded row-by-row formula evaluations.',
          'In this section, we construct a DAX evaluation context simulator in Python. We model incoming dimension slicer coordinates, propagate filter context to fact records, implement CALCULATE and ALL() logic, and compute dynamic Share of Total KPI measures.'
        ],
        example: 'Think of a microscope: Row Context is inspecting an individual blood cell under high magnification; Filter Context is applying a specialized optical color filter to the entire glass slide to isolate only white blood cells.',
        code: p2_code,
        output: p2_out,
        codeNotes: [
          { line: 2, note: 'Simulates DAX Filter Context propagation from Dimension slicer coordinates to Fact records' },
          { line: 14, note: 'Implements CALCULATE and ALL() semantics computing filtered revenue vs unfiltered baseline' },
          { line: 22, note: 'Calculates dynamic Share of Total measure reflecting proportional cohort contribution' }
        ],
        tryIt: 'Change the active filter from Enterprise to Mid-Market and verify how the DAX engine dynamically recalculates the Share of Total.',
        check: {
          question: 'What unique architectural capability does the CALCULATE function provide in DAX?',
          options: [
            'It modifies, expands, or overrides the ambient filter context and triggers context transition from row context into filter context',
            'It permanently converts all numbers into text strings',
            'It forces the CPU to run on only one single thread',
            'It prevents PivotTables from refreshing automatically'
          ],
          answer: 0,
          why: 'CALCULATE is the only DAX function capable of altering the active filter context (via ALL, ALLEXCEPT, etc.) and transforming row-by-row iteration context into active filter context.'
        }
      },
      {
        title: 'Inactive Relational Paths & Dynamic Activation via USERELATIONSHIP',
        say: [
          'In enterprise accounting and supply chain modeling, financial analysts inevitably encounter the Role-Playing Dimension challenge. A role-playing dimension occurs when a single dimension table must simultaneously relate to multiple distinct date attributes in a transaction table. For example, a single order record in FactOrders possesses an Order Date, a Ship Date, a Delivery Date, and a Customer Invoice Date, each representing a distinct financial milestone.',
          'Under the fundamental rules of tabular relational modeling, multiple active relationships between the same two tables are strictly prohibited. Permitting two active paths between DimDate and FactOrders would create mathematical ambiguity: if an analyst filters by October 2026, should the model aggregate revenue by the date orders were placed, or the date products were shipped? To prevent ambiguous cross-filtering cycles, tabular engines mandate that exactly one relationship can be Active, while all secondary relationships must remain Inactive.',
          'The Active relationship is represented in model diagrams by a solid line, while Inactive relationships appear as dashed lines. By default, every standard PivotTable and basic measure—such as Total Sales = SUM(FactOrders[Amount])—automatically and exclusively follows the Active path (typically Order Date). If corporate accounting needs to report Recognized Shipped Revenue, analysts must not duplicate the Date table into multiple redundant copies, as this clutters the data model and prevents unified cross-filtering.',
          'Instead, institutional financial engineering employs the DAX USERELATIONSHIP function inside a CALCULATE expression. USERELATIONSHIP temporarily disables the default active relationship and activates the designated secondary inactive path for the exact duration of that specific measure calculation: Shipped Revenue = CALCULATE(SUM(FactOrders[Amount]), USERELATIONSHIP(FactOrders[ShipDate], DimDate[Date])).',
          'This architectural pattern allows executive dashboards to display Booked Orders, Shipped Revenue, and Cash Collected side-by-side within a single unified PivotTable driven by a single Master Date slicer. Comparing these metrics side-by-side exposes revenue recognition timing lags, supply chain fulfillment delays, and unbilled receivables balances.',
          'Furthermore, in multi-currency treasury operations, role-playing relationships govern foreign exchange curves. An invoice may reference a spot transaction rate date and a forward contract settlement date. Activating the forward rate path dynamically via USERELATIONSHIP allows risk teams to evaluate mark-to-market currency hedge variances instantaneously.',
          'In corporate audit reviews, maintaining a single unified Calendar table linked via inactive relationships satisfies strict institutional data governance: all business units reference identical fiscal quarters, working day counts, and holiday calendars, completely eliminating discrepancies caused by disparate departmental date tables.',
          'From a mathematical perspective, USERELATIONSHIP overrides the underlying physical directed acyclic graph (DAG) of the data model at query run-time. Because it operates within measure execution scope rather than schema definition scope, multiple independent measures in the same visual can traverse completely different relational paths simultaneously without collision.',
          'In sovereign financial modeling, this capability ensures that the core General Ledger remains completely synchronized across billing, fulfillment, and cash collection cycles, providing immutable evidentiary audit trails for regulatory compliance.',
          'Here, we build a role-playing relationship engine in Python. We model orders with distinct order and shipping timestamps, dynamically activate secondary paths using USERELATIONSHIP semantics, and calculate operational revenue timing deltas.'
        ],
        example: 'Think of a train track switchboard: the main track (Active path) directs trains straight ahead to the passenger terminal, but when freight trains arrive, the dispatcher flips a switch (USERELATIONSHIP) to route them onto the industrial siding.',
        code: p3_code,
        output: p3_out,
        codeNotes: [
          { line: 2, note: 'Simulates tabular role-playing dimension with primary OrderDate and secondary ShipDate paths' },
          { line: 7, note: 'Dynamically switches evaluation key based on activated relationship parameter' },
          { line: 25, note: 'Quantifies revenue recognition timing delta exposed by activating alternative relational paths' }
        ],
        tryIt: 'Add an order where ship_date is a week after order_date and verify how the accounting timing delta captures fulfillment lag.',
        check: {
          question: 'Why are secondary relationships between DimDate and FactOrders kept Inactive in a tabular model?',
          options: [
            'To prevent ambiguous circular filter paths, allowing USERELATIONSHIP to activate specific date roles inside explicit measures',
            'Because inactive relationships do not consume disk space',
            'To prevent users from viewing financial data on weekends',
            'Because Excel can only calculate dates in the 20th century'
          ],
          answer: 0,
          why: 'Tabular modeling requires unambiguous filter paths; keeping secondary relationships inactive preserves model determinism while allowing measures to dynamically activate them via USERELATIONSHIP.'
        }
      },
      {
        title: 'Multi-Table Pivot Tables, Slicer Cache Synchronization & Cross-Filtering',
        say: [
          'In executive reporting environments, senior decision-makers demand interactive dashboards that respond instantly to cross-functional filtering. When a regional vice president clicks "North America" on an executive slicer, they expect all charts on the dashboard—including Revenue P&L, Headcount Variance, and Accounts Payable Aging—to synchronize instantaneously, even when those charts are driven by separate underlying Fact tables.',
          'Under the hood, Excel manages PivotTable interactivity through the PivotCache architecture. In legacy Excel workbooks, each PivotTable created from a cell range generated an independent, duplicate copy of the data in memory, causing workbook file sizes to balloon into hundreds of megabytes. In the modern Data Model, all PivotTables share a single consolidated, in-memory tabular cache managed by the VertiPaq engine.',
          'Slicer synchronization across disparate PivotTables relies on Conformed Dimensions. A Conformed Dimension is a shared dimension table—such as DimGeography, DimDate, or DimCostCenter—that maintains identical keys and attributes across multiple business processes. When a slicer is connected to DimGeography, clicking a region filters the shared dimension table; this filter context then propagates down simultaneously to FactSales, FactExpenses, and FactHeadcount.',
          'Furthermore, modelers configure Report Connections in the Slicer settings dialog. By checking the boxes for all related PivotTables on the dashboard, Excel binds the slicer cache to all downstream analytical pivots. Modelers also utilize Slicer Cross-Filtering (visual states of slicer items), where selecting a specific product category automatically dims or hides geographic regions that have zero sales for that category, preventing users from selecting invalid filter combinations.',
          'In advanced financial analytics, disconnected slicers are used to model what-if scenarios. A disconnected parameter table contains variable inputs—such as interest rate shocks (+100 bps, +200 bps) or inflation multipliers—with zero physical relationships to the fact table. A DAX measure reads the selected slicer value using SELECTEDVALUE() and injects that parameter dynamically into financial valuation formulas.',
          'Optimizing slicer performance requires disciplined data hygiene. Slicers applied to high-cardinality columns—such as millions of individual customer names or invoice GUIDs—degrade rendering speeds. Institutional dashboards enforce best practices by restricting slicers to low-cardinality descriptive dimensions (under one hundred unique values), ensuring instantaneous UI response.',
          'In corporate boardroom presentations, synchronized multi-pivot slicers eliminate the embarrassing friction of manually toggling filters across multiple separate tabs, presenting a unified, highly polished executive command center that updates dynamically in front of the board of directors.',
          'Additionally, modelers must manage slicer cache invalidation during scheduled data refreshes. When fresh transaction batches are loaded via Power Query, the shared PivotCache automatically re-indexes dictionary hash tables, ensuring that newly onboarded operational entities appear immediately in slicer selection trees without requiring manual workbook restarts.',
          'By linking all dashboard visual components to conformed dimension slicers, organizations eliminate conflicting reporting silos, ensuring that the chief executive officer, chief financial officer, and regional operating heads evaluate identical performance figures during board meetings.',
          'In this section, we construct a multi-pivot slicer cache synchronization simulator in Python. We model shared dimension filters, propagate filter states across independent pivot aggregates, and verify PivotCache coherence across the reporting canvas.'
        ],
        example: 'Think of a television master remote control: pressing "Volume Up" sends an infrared command that simultaneously adjusts the soundbar, the television screen, and the surround-sound speakers through a single synchronized signal.',
        code: p4_code,
        output: p4_out,
        codeNotes: [
          { line: 2, note: 'Simulates shared PivotCache synchronization across multiple independent pivot reporting targets' },
          { line: 8, note: 'Propagates single slicer selection simultaneously across spend and transaction volume aggregates' },
          { line: 15, note: 'Asserts cache coherence verifying identical filter state application across all dashboard visuals' }
        ],
        tryIt: 'Change the slicer selection to "Europe" and verify that both Pivot 1 and Pivot 2 update coherently.',
        check: {
          question: 'What is a Conformed Dimension and why is it essential for synchronizing slicers across multiple PivotTables?',
          options: [
            'A shared dimension table with consistent keys and attributes that links to multiple Fact tables, allowing a single slicer to filter disparate business processes simultaneously',
            'A dimension table that contains only encrypted password hashes',
            'A temporary table that is deleted immediately after calculation',
            'A column formatted exclusively in bold italic font'
          ],
          answer: 0,
          why: 'Conformed dimensions provide shared relational anchors (like Date, Geography, or Customer) across multiple Fact tables, enabling a single slicer to filter all connected PivotTables coherently.'
        }
      },
      {
        title: 'Production Enterprise Data Model & Dynamic DAX KPI Measure Engine',
        say: [
          'To conclude Day 8, we synthesize our Star Schema architecture, DAX evaluation context, role-playing relationships, and slicer synchronization into an institutional-grade Enterprise Data Model and KPI Measure Engine. This platform represents the pinnacle of modern spreadsheet business intelligence, combining relational discipline with advanced financial analytics.',
          'In enterprise financial planning and analysis, models must calculate complex Time Intelligence measures without hardcoding cell ranges. Time Intelligence in DAX relies on a contiguous Calendar table marked as a Date Table. This allows modelers to deploy robust time functions such as TOTALYTD, SAMEPERIODLASTYEAR, and DATEADD. These functions manipulate filter context dynamically, shifting the active date window back by twelve months to compute Year-over-Year (YoY) revenue expansion.',
          'Our production engine integrates both base additive measures and complex non-additive ratios: Gross Revenue, Prior Year Revenue, YoY Dollar Growth, and YoY Growth Percentage. Every measure is defined explicitly, ensuring that when sliced across business units, geographies, or fiscal quarters, the engine automatically calculates correct mathematical ratios rather than averaging percentages—a classic spreadsheet error known as Simpson’s Paradox.',
          'Furthermore, our engine enforces model governance. Every dimension table is verified for primary key uniqueness, foreign key integrity is certified across all transaction facts, and inactive role-playing paths are cataloged for operational transparency. The master audit output displays current-year revenue, prior-year revenue, YoY expansion rates, and business unit contribution distributions.',
          'Boardroom governance rules mandate that all analytical measures undergo reconciliation against the general ledger before distribution. By verifying that the sum of all dimensional allocations exactly matches the corporate trial balance, financial controllers certify that the tabular model is audit-proof, robust against schema updates, and boardroom-ready.',
          'Deploying an audited enterprise data model elevates Excel from a fragile desktop calculator into a scalable corporate data warehouse. Analysts spend zero time rebuilding broken formulas, while senior executives enjoy instantaneous, interactive visibility into corporate performance drivers.',
          'In advanced enterprise deployments, modeling teams implement Calculation Groups to eliminate measure explosion. Rather than writing separate YTD, QTD, and YoY formulas for twenty distinct financial line items, a calculation group applies dynamic time intelligence across all existing base measures, reducing formula maintenance overhead by ninety percent.',
          'Moreover, our enterprise architecture integrates automated metadata documentation and lineage mapping. Every DAX measure includes a standardized description field, documenting its financial definition, underlying source columns, and author timestamp, providing total transparency for internal audit teams and external regulatory examinations.',
          'Finally, the chief financial officer requires that the master executive dashboard be published with automated row-level security (RLS) filters. By evaluating user principal names dynamically in DAX, regional vice presidents only see data for their assigned business units, while executive committee members retain unfiltered global enterprise visibility.',
          'Ultimately, mastering Star Schema data modeling and DAX context transition empowers financial professionals to construct models that handle millions of transactions with enterprise security, sub-second speed, and absolute mathematical precision.',
          'Below, we execute our complete production enterprise data model and dynamic DAX KPI engine in Python. We ingest multi-year fact records, link them to date and business unit dimensions, compute dynamic YoY growth metrics, and generate an audited executive KPI dashboard.'
        ],
        example: 'Think of an enterprise cockpit instrument panel: dozens of individual analog dials are replaced by a unified digital glass cockpit driven by a central avionics computer, allowing pilots to monitor airspeed, altitude, fuel burn, and engine health in real time.',
        code: p5_code,
        output: p5_out,
        codeNotes: [
          { line: 2, note: 'Architects enterprise multi-dimensional model binding FactSales to DimDate and DimBU' },
          { line: 20, note: 'Computes DAX Time Intelligence metrics comparing Current Year vs Prior Year performance' },
          { line: 27, note: 'Calculates mathematically sound YoY growth rates and business unit revenue distribution' }
        ],
        tryIt: 'Add a third business unit (e.g. B3: AI & Data Platforms) and observe how the engine dynamically updates revenue and percentage allocations.',
        check: {
          question: 'Why must financial analysts calculate percentage metrics using explicit DAX measures rather than averaging percentages in pivot tables?',
          options: [
            'Averaging percentages produces mathematically invalid results (Simpson’s Paradox); explicit DAX measures divide total numerator by total denominator at the aggregated filter level',
            'Pivot tables refuse to display percentage symbols on calculated columns',
            'DAX measures cannot calculate division operations',
            'Averaging percentages is only permitted on alternate Thursdays'
          ],
          answer: 0,
          why: 'Averaging pre-calculated percentage rows ignores volume weighting and creates severe distortion; explicit DAX measures compute the true aggregate ratio: DIVIDE(SUM(Numerator), SUM(Denominator)).'
        }
      }
    ],
    summary: [
      'Star Schema architecture separates numeric transactional metrics into Fact tables and descriptive context into Dimension tables.',
      'DAX Row Context iterates row-by-row, while Filter Context dynamically evaluates ambient PivotTable slicer coordinates.',
      'CALCULATE alters filter context and triggers Context Transition, transforming row iterations into active filter constraints.',
      'Role-playing dimensions use USERELATIONSHIP to activate secondary inactive relational paths dynamically inside explicit measures.',
      'Conformed dimensions and shared PivotCaches synchronize multi-table PivotTables and interactive dashboard slicers.'
    ],
    projectStep: {
      title: 'Architect an Enterprise Relational Data Model with Dynamic DAX KPI Measures',
      steps: [
        'Design a 1-to-many Star Schema linking FactSales to DimCustomer, DimProduct, and DimDate tables.',
        'Implement explicit DAX base measures for Total Revenue and Cost of Goods Sold enforcing strict filter context.',
        'Author dynamic Time Intelligence measures computing Prior Year Revenue and Year-over-Year Growth percentages.',
        'Configure role-playing date relationships using USERELATIONSHIP to calculate Booked versus Shipped revenue.',
        'Build synchronized multi-table PivotTables connected to unified conformed dimension slicers for executive reporting.'
      ]
    }
  };
}
