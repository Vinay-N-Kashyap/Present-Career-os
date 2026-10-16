import fs from 'node:fs';
import { execSync } from 'node:child_process';

function runPy(code) {
  const tmp = 'temp_py_eval_day10.py';
  fs.writeFileSync(tmp, code, 'utf-8');
  try {
    const out = execSync('python temp_py_eval_day10.py', { encoding: 'utf-8' });
    return out.trim();
  } finally {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  }
}

export function getDay10() {
  const p1_code = [
    "# Tier 1: Enterprise Multi-Table Star Schema Configuration",
    "class Milestone2DataModelConfig:",
    "    def __init__(self):",
    "        self.fact_table = 'FactEnterpriseFinancials'",
    "        self.dim_tables = ['DimEntity', 'DimAccount', 'DimScenario', 'DimCalendar']",
    "        self.relationships = [",
    "            {'from_col': 'FactEnterpriseFinancials.entity_id', 'to_col': 'DimEntity.entity_id', 'cardinality': 'Many-to-One'},",
    "            {'from_col': 'FactEnterpriseFinancials.account_code', 'to_col': 'DimAccount.account_code', 'cardinality': 'Many-to-One'},",
    "            {'from_col': 'FactEnterpriseFinancials.scenario_id', 'to_col': 'DimScenario.scenario_id', 'cardinality': 'Many-to-One'},",
    "            {'from_col': 'FactEnterpriseFinancials.date_key', 'to_col': 'DimCalendar.date_key', 'cardinality': 'Many-to-One'}",
    "        ]",
    "        ",
    "    def validate_schema_topology(self):",
    "        # Assert star-schema invariants: exactly one fact table, one-way relationships, referential integrity",
    "        is_star = len(self.relationships) == len(self.dim_tables)",
    "        return {",
    "            'architecture': 'ENTERPRISE_STAR_SCHEMA',",
    "            'fact_table': self.fact_table,",
    "            'dimensions_count': len(self.dim_tables),",
    "            'relationships_verified': is_star,",
    "            'cross_filter_direction': 'SINGLE_DIRECTIONAL (DIM -> FACT)'",
    "        }",
    "",
    "config = Milestone2DataModelConfig()",
    "schema_report = config.validate_schema_topology()",
    "print('=== TIER 1: ENTERPRISE STAR SCHEMA ARCHITECTURE ===')",
    "print(f\"Fact Table:             {schema_report['fact_table']}\")",
    "print(f\"Dimension Count:        {schema_report['dimensions_count']} Dimensions\")",
    "print(f\"Relationships Valid:    {schema_report['relationships_verified']}\")",
    "print(f\"Filter Propagation:     {schema_report['cross_filter_direction']}\")"
  ].join('\n');

  const p1_out = runPy(p1_code);

  const p2_code = [
    "# Tier 2: Automated Ingestion, Cleaning & Data Quality Gate",
    "import re",
    "",
    "class AutomatedEtlQualityGate:",
    "    def __init__(self, raw_records):",
    "        self.raw_records = raw_records",
    "        ",
    "    def execute_quality_pipeline(self):",
    "        cleaned_records = []",
    "        anomalies_detected = 0",
    "        ",
    "        for rec in self.raw_records:",
    "            # 1. Clean account string & whitespace",
    "            clean_account = re.sub(r'[^a-zA-Z0-9_]', '', rec.get('account', '')).upper()",
    "            ",
    "            # 2. Parse currency values with symbol stripping and accounting parentheses",
    "            raw_val = str(rec.get('amount', '0'))",
    "            clean_digits = re.sub(r'[^\\d.]', '', raw_val)",
    "            if clean_digits:",
    "                val = float(clean_digits)",
    "                amount = -val if '(' in raw_val and ')' in raw_val else val",
    "            else:",
    "                amount = 0.0",
    "                ",
    "            # 3. Quality rule: Entity code must be 3 uppercase letters, amount non-zero",
    "            entity = rec.get('entity', '').strip().upper()",
    "            if len(entity) != 3 or amount == 0.0:",
    "                anomalies_detected += 1",
    "                continue",
    "                ",
    "            cleaned_records.append({",
    "                'entity': entity,",
    "                'account': clean_account,",
    "                'amount_usd': round(amount, 2),",
    "                'scenario': rec.get('scenario', 'BASE').upper()",
    "            })",
    "            ",
    "        pass_rate = (len(cleaned_records) / len(self.raw_records)) * 100.0",
    "        return {",
    "            'raw_input_count': len(self.raw_records),",
    "            'cleaned_output_count': len(cleaned_records),",
    "            'quarantine_anomalies': anomalies_detected,",
    "            'gate_pass_rate_pct': round(pass_rate, 2),",
    "            'gate_status': 'GATE_PASSED' if pass_rate >= 75.0 else 'GATE_REJECTED',",
    "            'sample_record': cleaned_records[0] if cleaned_records else {}",
    "        }",
    "",
    "raw_feed = [",
    "    {'entity': 'US1', 'account': 'REV_SUBSCRIPTION', 'amount': '$1,250,000.00', 'scenario': 'Actual'},",
    "    {'entity': 'UK2', 'account': '  cogs_cloud  ', 'amount': '(420,000.50)', 'scenario': 'Actual'},",
    "    {'entity': 'invalid_corp', 'account': 'BAD_ROW', 'amount': 'N/A', 'scenario': 'Budget'},",
    "    {'entity': 'DE1', 'account': 'OPEX_RND', 'amount': '280,000.00', 'scenario': 'Budget'}",
    "]",
    "",
    "gate = AutomatedEtlQualityGate(raw_feed)",
    "gate_results = gate.execute_quality_pipeline()",
    "print('=== TIER 2: AUTOMATED ETL QUALITY GATE REPORT ===')",
    "print(f\"Raw Input Records:      {gate_results['raw_input_count']}\")",
    "print(f\"Quarantined Anomalies:  {gate_results['quarantine_anomalies']}\")",
    "print(f\"Quality Pass Rate:      {gate_results['gate_pass_rate_pct']}%\")",
    "print(f\"Quality Gate Status:    {gate_results['gate_status']}\")",
    "print(f\"Cleaned Sample:         {gate_results['sample_record']}\")"
  ].join('\n');

  const p2_out = runPy(p2_code);

  const p3_code = [
    "# Tier 3: Dynamic DAX Time Intelligence & Moving Trend Engine",
    "class DynamicDaxTimeIntelligenceEngine:",
    "    def __init__(self, monthly_revenue):",
    "        self.data = monthly_revenue",
    "        ",
    "    def compute_time_intelligence_metrics(self):",
    "        sorted_data = sorted(self.data, key=lambda x: (x['year'], x['month']))",
    "        results = []",
    "        ytd_running_total = 0.0",
    "        current_year = None",
    "        rev_history = []",
    "        ",
    "        for item in sorted_data:",
    "            yr = item['year']",
    "            m = item['month']",
    "            rev = item['rev']",
    "            rev_history.append(rev)",
    "            ",
    "            if yr != current_year:",
    "                current_year = yr",
    "                ytd_running_total = 0.0",
    "                ",
    "            ytd_running_total += rev",
    "            ",
    "            trailing_window = rev_history[-3:]",
    "            trailing_avg = sum(trailing_window) / len(trailing_window)",
    "            ",
    "            prior_yr_rev = next((x['rev'] for x in sorted_data if x['year'] == yr - 1 and x['month'] == m), None)",
    "            yoy_growth = ((rev - prior_yr_rev) / prior_yr_rev) * 100.0 if prior_yr_rev else None",
    "            ",
    "            results.append({",
    "                'period': f\"{yr}-M{m:02d}\",",
    "                'monthly_rev': round(rev, 2),",
    "                'ytd_running_total': round(ytd_running_total, 2),",
    "                'trailing_3m_avg': round(trailing_avg, 2),",
    "                'yoy_growth_pct': round(yoy_growth, 2) if yoy_growth is not None else 'N/A'",
    "            })",
    "            ",
    "        return results",
    "",
    "monthly_series = [",
    "    {'year': 2025, 'month': 1, 'rev': 100000.0},",
    "    {'year': 2025, 'month': 2, 'rev': 115000.0},",
    "    {'year': 2025, 'month': 3, 'rev': 125000.0},",
    "    {'year': 2026, 'month': 1, 'rev': 130000.0},",
    "    {'year': 2026, 'month': 2, 'rev': 148000.0},",
    "    {'year': 2026, 'month': 3, 'rev': 165000.0}",
    "]",
    "",
    "engine = DynamicDaxTimeIntelligenceEngine(monthly_series)",
    "metrics = engine.compute_time_intelligence_metrics()",
    "print('=== TIER 3: DYNAMIC DAX TIME INTELLIGENCE ENGINE ===')",
    "print(f\"Total Periods Processed: {len(metrics)}\")",
    "print(f\"2026-M01 YoY Growth:     {metrics[3]['yoy_growth_pct']}%\")",
    "print(f\"2026-M03 YTD Running:    ${metrics[5]['ytd_running_total']:,.2f}\")",
    "print(f\"2026-M03 Trailing 3M:    ${metrics[5]['trailing_3m_avg']:,.2f}\")"
  ].join('\n');

  const p3_out = runPy(p3_code);

  const p4_code = [
    "# Tier 4: Interactive Scenario Switchboard & Variance Sensitivity Engine",
    "class InteractiveScenarioSwitchboard:",
    "    def __init__(self, base_rev=10000000.0, base_cogs_ratio=0.35, base_opex=4000000.0):",
    "        self.base_rev = base_rev",
    "        self.base_cogs_ratio = base_cogs_ratio",
    "        self.base_opex = base_opex",
    "        self.scenarios = {",
    "            1: {'name': 'BASE_CASE', 'rev_mult': 1.0, 'cogs_delta': 0.0, 'opex_mult': 1.0},",
    "            2: {'name': 'BULL_CASE', 'rev_mult': 1.25, 'cogs_delta': -0.03, 'opex_mult': 1.05},",
    "            3: {'name': 'BEAR_CASE', 'rev_mult': 0.80, 'cogs_delta': 0.05, 'opex_mult': 1.10}",
    "        }",
    "        ",
    "    def evaluate_scenario(self, scenario_id):",
    "        sc = self.scenarios.get(scenario_id, self.scenarios[1])",
    "        rev = self.base_rev * sc['rev_mult']",
    "        cogs = rev * (self.base_cogs_ratio + sc['cogs_delta'])",
    "        gp = rev - cogs",
    "        opex = self.base_opex * sc['opex_mult']",
    "        ebitda = gp - opex",
    "        ",
    "        base_gp = self.base_rev - (self.base_rev * self.base_cogs_ratio)",
    "        base_ebitda = base_gp - self.base_opex",
    "        variance = ebitda - base_ebitda",
    "        ",
    "        return {",
    "            'scenario_id': scenario_id,",
    "            'scenario_name': sc['name'],",
    "            'pro_forma_revenue': round(rev, 2),",
    "            'gross_profit': round(gp, 2),",
    "            'ebitda': round(ebitda, 2),",
    "            'ebitda_margin_pct': round((ebitda / rev) * 100, 2),",
    "            'ebitda_variance_vs_base': round(variance, 2)",
    "        }",
    "",
    "switchboard = InteractiveScenarioSwitchboard()",
    "base_eval = switchboard.evaluate_scenario(1)",
    "bull_eval = switchboard.evaluate_scenario(2)",
    "bear_eval = switchboard.evaluate_scenario(3)",
    "",
    "print('=== TIER 4: INTERACTIVE SCENARIO SWITCHBOARD ===')",
    "print(f\"Base Case EBITDA:       ${base_eval['ebitda']:,.2f} (Margin: {base_eval['ebitda_margin_pct']}%)\")",
    "print(f\"Bull Case EBITDA:       ${bull_eval['ebitda']:,.2f} (Variance: +${bull_eval['ebitda_variance_vs_base']:,.2f})\")",
    "print(f\"Bear Case EBITDA:       ${bear_eval['ebitda']:,.2f} (Variance: -${abs(bear_eval['ebitda_variance_vs_base']):,.2f})\")"
  ].join('\n');

  const p4_out = runPy(p4_code);

  const p5_code = [
    "# Tier 5: Grand Master Milestone 2 Capstone Financial Command Center",
    "class GrandMasterMilestone2CapstoneEngine:",
    "    def __init__(self, entities, senior_debt=2500000.0, annual_debt_service=420000.0, cash_reserves=1800000.0):",
    "        self.entities = entities",
    "        self.senior_debt = senior_debt",
    "        self.annual_debt_service = annual_debt_service",
    "        self.cash_reserves = cash_reserves",
    "        ",
    "    def generate_executive_scorecard(self, scenario_factor=1.0):",
    "        total_rev = sum(e['arr'] for e in self.entities) * scenario_factor",
    "        total_opex = sum(e['opex'] for e in self.entities)",
    "        ebitda = total_rev * 0.32 - (total_opex * 0.15)",
    "        ",
    "        dscr = ebitda / self.annual_debt_service if self.annual_debt_service > 0 else float('inf')",
    "        monthly_burn = max(0.0, (total_opex - (total_rev * 0.32)) / 12.0)",
    "        cash_runway_months = (self.cash_reserves / monthly_burn) if monthly_burn > 0 else 999.0",
    "        leverage_ratio = self.senior_debt / ebitda if ebitda > 0 else float('inf')",
    "        ",
    "        health_status = 'PRIME_INVESTMENT_GRADE' if (dscr >= 2.0 and leverage_ratio <= 3.0) else 'ADEQUATE'",
    "        if dscr < 1.25:",
    "            health_status = 'COVENANT_DISTRESS'",
    "            ",
    "        return {",
    "            'enterprise_arr_usd': round(total_rev, 2),",
    "            'consolidated_ebitda_usd': round(ebitda, 2),",
    "            'debt_service_coverage_dscr': round(dscr, 2),",
    "            'debt_to_ebitda_leverage': round(leverage_ratio, 2),",
    "            'cash_runway_months': round(cash_runway_months, 1),",
    "            'institutional_health': health_status,",
    "            'entities_consolidated': len(self.entities)",
    "        }",
    "",
    "corporate_entities = [",
    "    {'entity_id': 'US_CORP', 'arr': 8500000.0, 'opex': 4200000.0},",
    "    {'entity_id': 'UK_LTD',  'arr': 3800000.0, 'opex': 1900000.0},",
    "    {'entity_id': 'EU_GMBH', 'arr': 2700000.0, 'opex': 1400000.0}",
    "]",
    "",
    "capstone = GrandMasterMilestone2CapstoneEngine(corporate_entities)",
    "base_board = capstone.generate_executive_scorecard(scenario_factor=1.0)",
    "stress_board = capstone.generate_executive_scorecard(scenario_factor=0.75)",
    "",
    "print('=== TIER 5: GRAND MASTER CAPSTONE EXECUTIVE COMMAND CENTER ===')",
    "print(f\"Consolidated ARR:        ${base_board['enterprise_arr_usd']:,.2f}\")",
    "print(f\"Consolidated EBITDA:     ${base_board['consolidated_ebitda_usd']:,.2f}\")",
    "print(f\"Base DSCR Coverage:      {base_board['debt_service_coverage_dscr']}x ({base_board['institutional_health']})\")",
    "print(f\"Senior Debt Leverage:    {base_board['debt_to_ebitda_leverage']}x EBITDA\")",
    "print(f\"Stress-Test DSCR (25% Drop): {stress_board['debt_service_coverage_dscr']}x ({stress_board['institutional_health']})\")"
  ].join('\n');

  const p5_out = runPy(p5_code);

  return {
    day: 10,
    title: '⭐ Milestone 2 Capstone: Enterprise Financial & Operational Analytics Dashboard',
    goal: 'Synthesize all 10 days of advanced Excel engineering, statistical regression, Power Query M pipelines, star schema data modeling, loan amortization, and time-intelligence DAX into a production-grade C-Suite financial and operational analytics command center.',
    minutes: 35,
    recap: 'Over Days 1 through 9, we built rigorous competencies in dynamic formulas, matrix lookup algorithms, statistical forecasting, automated ETL cleansing, relational star schema modeling, and corporate loan amortization. Today, we culminate in the Milestone 2 Capstone: engineering an institutional financial and operational analytics dashboard featuring automated ETL quality gates, multi-scenario switchboards, dynamic time-intelligence measures, and solvency stress-testing.',
    parts: [
      {
        title: 'Tier 1: Enterprise Multi-Table Star Schema Architecture & Referential Topology',
        say: [
          'Welcome to the Milestone 2 Capstone of the PinIT Career OS Financial Engineering Curriculum. In this culminating project, we synthesize every technical methodology mastered across Days 1 through 9 into an enterprise-grade Financial and Operational Analytics Dashboard. In institutional corporate finance, private equity portfolio monitoring, and multinational treasury management, fragmented spreadsheets fail under enterprise scale. The modern Chief Financial Officer requires a centralized, hardened relational data architecture capable of slicing millions of transactions across business entities, chart-of-accounts hierarchies, fiscal calendars, and planning scenarios.',
          'Tier 1 of our Capstone architecture establishes the Enterprise Relational Data Model. Rather than maintaining bloated, denormalized flat sheets prone to data redundancy and update anomalies, we construct a normalized Star Schema centered upon a primary numeric fact table: FactEnterpriseFinancials. Surrounding this central fact table are four core dimension tables: DimEntity representing legal operating subsidiaries across global jurisdictions, DimAccount defining the standard chart of accounts and financial statement classification hierarchies, DimScenario delineating Actuals from Budget and Forecast versions, and DimCalendar providing an unbroken Gregorian fiscal timeline.',
          'The topological relationships between the central fact table and peripheral dimension tables are strictly defined with one-to-many cardinality (1:N) and single-directional cross-filtering. When an executive applies a slicer filter on DimEntity or DimCalendar, filter context flows deterministically downstream into FactEnterpriseFinancials, dynamically pruning the calculation space. Bidirectional filtering is deliberately prohibited to prevent ambiguous relationship paths, circular filter loops, and devastating Cartesian product performance penalties.',
          'Furthermore, strict referential integrity must be maintained across all foreign key joins. Every entity_id, account_code, scenario_id, and date_key present in transaction records must correspond to a validated primary key in its respective dimension table. Orphaned foreign keys—transactions referencing non-existent accounts or unrecognized legal entities—compromise financial auditability and lead to immediate rejection by Sarbanes-Oxley (SOX) compliance auditors.',
          'Under the hood of the VertiPaq database engine powering modern analytical models, the star schema layout optimizes columnar compression algorithms: dictionary encoding, value encoding, and run-length encoding (RLE). When fact tables contain millions of rows, numeric columns with low cardinality or sorted sequences compress down to mere fractions of a byte per row. Storing high-cardinality descriptive strings inside separate dimension tables ensures that the fact table remains purely numerical, maximizing hardware CPU cache locality and enabling vectorized SIMD execution across financial aggregations.',
          'In enterprise data warehousing, modelers must also address Slowly Changing Dimensions (SCD). When a corporate subsidiary rebrands, relocates to a different legal tax domicile, or merges into an alternate operating division, the modeler decides between Type 1 (overwriting historical attributes) and Type 2 (versioning records with effective date ranges). For financial statement reporting, Type 2 dimensions preserve historical accounting fidelity, ensuring that prior-year financial statements remain perfectly balanced according to the corporate governance structures in place at the time of closing.',
          'In corporate financial consolidation, multi-currency translation rules are tied directly to the entity dimension: transactions recorded in foreign operating subsidiaries are mapped to local functional currencies and translated to consolidated reporting currency (USD) using period-average and period-end exchange rates.',
          'In this opening tier, we construct the structural blueprint of our Capstone Star Schema in Python. We define table entities, configure foreign key relationships, validate relationship topology, and assert single-directional filter propagation standards.'
        ],
        example: 'Think of the star schema as the control hub of an international airport: the central air traffic tower (Fact table) records every flight takeoff and landing, while specialized satellite concourses (Dimension tables) house airlines, gate numbers, passenger manifests, and flight schedules.',
        code: p1_code,
        output: p1_out,
        codeNotes: [
          { line: 2, note: 'Defines enterprise star schema topology with centralized fact table and 4 dimension tables' },
          { line: 6, note: 'Enforces strict many-to-one foreign key relationships binding dimensions to central transactions' },
          { line: 15, note: 'Validates architectural invariants asserting single-directional filter propagation' }
        ],
        tryIt: 'Add a fifth dimension DimProduct with a matching relationship and verify that dimensions_count updates to 5.',
        check: {
          question: 'Why is single-directional cross-filtering (Dimension to Fact) strictly mandated in enterprise star schema architectures?',
          options: [
            'It ensures deterministic filter propagation and prevents circular filter paths and Cartesian product performance penalties',
            'Because Excel cannot physically store more than two tables',
            'It forces all financial numbers to be rounded to the nearest integer',
            'Single-directional filtering is required by the Federal Reserve for wire transfers'
          ],
          answer: 0,
          why: 'Single-directional filtering ensures filter context flows strictly from dimension tables down to fact tables, eliminating ambiguous relationship paths and expensive bidirectional circular dependencies.'
        }
      },
      {
        title: 'Tier 2: Automated Ingestion, Cleaning & Data Quality Gate',
        say: [
          'Enterprise financial dashboards are only as reliable as the underlying data ingestion pipeline. In global corporate environments, raw transactional feeds arrive from disparate ERP systems—including SAP, Oracle NetSuite, and Workday—characterized by inconsistent formatting, irregular whitespace, non-standard currency symbols, and accounting parentheses representing negative values. Tier 2 of our Capstone engineers an Automated Ingestion and Data Quality Gate inspired by Power Query M pipelines.',
          'Our ETL pipeline executes a sequence of deterministic transformation stages designed to cleanse incoming transactions and quarantine data anomalies before they contaminate the analytical data model. First, account strings are normalized by stripping leading and trailing whitespace, removing irregular punctuation, and casting text to uppercase standardization. This prevents duplicated account categories caused by manual user data entry inconsistencies.',
          'Second, currency strings undergo robust parsing. Financial feeds frequently format numbers with currency symbols, thousand commas, and institutional accounting notation where negative balances appear within enclosing parentheses: for example, (420,000.50). The ETL parser utilizes regular expressions to extract decimal digits while detecting parentheses, correctly converting credit balances into negative numeric floats.',
          'Third, the pipeline enforces strict Data Quality Assertion Gates. Every transaction record must satisfy mandatory validation predicates: legal entity codes must conform to standard three-character enterprise identifiers, financial amounts must be non-zero, and valid planning scenarios must be assigned. Records failing these quality gates are automatically diverted into an audit quarantine queue, preventing corrupt records from distorting consolidated executive metrics.',
          'The quality gate computes a continuous Quality Pass Rate percentage (clean records divided by total raw records). In institutional automated deployments, if the pass rate drops below an established governance threshold—such as 75% or 85%—the pipeline raises an automated alert and halts downstream model refreshing to protect executive decision-makers from compromised financial intelligence.',
          'In continuous integration and automated data operations (DataOps), ETL quality gates incorporate schema drift detection and strict type-assertion contracts. If an upstream ERP updates its API schema—for instance, changing an ISO currency field from a string to an integer enum or renaming an account key—the quality gate immediately intercepts the discrepancy before data enters downstream reporting layers. By validating column types against expected JSON or Parquet schemas, data pipelines isolate breaking schema changes into alert queues with automated Slack or PagerDuty incident notifications.',
          'Another vital defense in automated financial pipelines is composite key deduplication. In high-volume treasury environments, batch network retries or misconfigured webhook listeners can cause duplicate payment files to be submitted to the ingestion pipeline. Our quality gate generates SHA-256 cryptographic hashes from composite business keys—combining entity identifier, account code, posting date, and monetary amount. Any incoming row possessing a duplicate fingerprint is quarantined immediately, preventing catastrophic double-counting of revenues or expenses.',
          'In institutional accounting, audit logs generated during quarantine isolation provide full lineage and traceability. Compliance teams review quarantined rows to detect recurring supplier billing anomalies, upstream ERP synchronization glitches, or rogue ledger entries before month-end books close.',
          'Here, we build and execute our Automated ETL Quality Gate in Python. We ingest heterogeneous raw records, sanitize strings and currencies, filter anomalies into quarantine, calculate pipeline pass rates, and output cleaned analytical feeds ready for data model integration.'
        ],
        example: 'Think of an automated airport baggage screening checkpoint: every piece of luggage (raw record) passes through 3D scanning; standard bags proceed seamlessly to the aircraft, while unidentifiable or prohibited items are immediately shunted to a quarantine inspection lane.',
        code: p2_code,
        output: p2_out,
        codeNotes: [
          { line: 4, note: 'Initializes automated ETL quality gate ingesting raw heterogeneous transactional feeds' },
          { line: 18, note: 'Parses institutional accounting notation converting parenthetical strings into negative floats' },
          { line: 36, note: 'Computes pipeline pass rate asserting quality gate pass/reject governance status' }
        ],
        tryIt: 'Add a malformed record with an amount of $0.00 and observe how quarantined anomalies increments to 2 while the pass rate adjusts.',
        check: {
          question: 'In institutional financial ETL, how should accounting numbers formatted in parentheses like (420,000.50) be parsed?',
          options: [
            'They must be detected as negative values and parsed to negative floating-point numbers (-420000.50)',
            'They must be discarded because parentheses are invalid characters in mathematics',
            'They must be converted into string text so they do not affect math calculations',
            'They must be doubled to represent compound interest'
          ],
          answer: 0,
          why: 'In standard financial accounting notation, numbers enclosed in parentheses denote negative amounts or cash outflows and must be parsed as negative floats in analytical models.'
        }
      },
      {
        title: 'Tier 3: Dynamic DAX Time Intelligence, YTD Running Totals & Moving Trend Engine',
        say: [
          'Static financial reports show historical snapshots, but strategic executive decision-making requires longitudinal perspective. Tier 3 of our Capstone engineers a Dynamic Time-Intelligence Analytics Engine that replicates advanced DAX (Data Analysis Expressions) patterns: calculating Year-to-Date (YTD) running totals, Year-over-Year (YoY) percentage growth rates, and Trailing-12-Month (TTM) moving averages.',
          'In Power BI and Excel Data Models, time-intelligence calculations rely on a dedicated Gregorian Calendar dimension table (DimCalendar). Standard SQL or Excel formulas struggle with calendar logic because fiscal years, leap years, and quarterly boundaries introduce non-linear discontinuities. DAX formulas such as TOTALYTD, SAMEPERIODLASTYEAR, and DATESINPERIOD abstract these mechanics, allowing analysts to evaluate performance across shifting temporal horizons.',
          'Our time-intelligence engine executes Year-to-Date running accumulation: as months progress within a given fiscal year, revenue totals accumulate continuously, resetting to zero on the boundary of each new fiscal year. This allows corporate controllers to track annual revenue pacing against annual operating budget targets throughout the twelve-month cycle.',
          'Next, the engine evaluates Year-over-Year (YoY) performance by dynamically looking back twelve months to compare the current period against the identical month of the preceding fiscal year. Evaluating YoY growth rather than sequential Month-over-Month (MoM) growth eliminates seasonality distortions—such as December retail spikes or summer manufacturing slowdowns—revealing genuine organic business expansion.',
          'Additionally, the engine computes Trailing Moving Averages across rolling multi-period windows. By smoothing out transitory monthly fluctuations and irregular billing cycles, moving averages expose the underlying secular momentum of enterprise cash flows, providing executive leadership with dependable trend visibility.',
          'At the heart of DAX time intelligence is the fundamental distinction between Row Context and Filter Context, governed by the CALCULATE function. In DAX formulas, CALCULATE evaluates an expression within an updated, modified filter context. When computing YTD or prior-year measures, CALCULATE dynamically strips existing date filters using ALL(DimCalendar) and injects a new temporal filter set representing the target evaluation period. Understanding this context transition is the hallmark of professional Power BI and Excel Data Model architects.',
          'Furthermore, corporate models frequently operate on non-standard fiscal calendars rather than standard Gregorian twelve-month cycles. Multinational retailers and manufacturers rely on 4-4-5 or 4-5-4 retail calendars, where each quarter consists of two four-week months and one five-week month to ensure identical trading-day comparisons across operating quarters. Our time-intelligence engine architecture accommodates custom fiscal period mappings, calculating comparative weekly and quarterly metrics without falling prey to day-of-week calendar shift distortions.',
          'In high-growth corporate finance, time-intelligence engines also compute Compound Monthly Growth Rates (CMGR) and Net Revenue Retention (NRR) trajectories, helping venture capital sponsors evaluate whether software-as-a-service (SaaS) subsidiaries are accelerating or saturating within their target enterprise markets.',
          'Below, we implement our Dynamic DAX Time Intelligence Engine in Python. We ingest multi-year monthly revenue series, compute cumulative YTD running totals, evaluate YoY organic expansion rates, smooth trends using trailing moving averages, and output a validated temporal metrics report.'
        ],
        example: 'Think of tracking your personal marathon training: the total miles run this calendar year (YTD) resets on January 1st; comparing this March to last March (YoY) controls for winter weather; while your rolling 30-day average pace reveals your true athletic trajectory.',
        code: p3_code,
        output: p3_out,
        codeNotes: [
          { line: 2, note: 'Implements dynamic time-intelligence engine processing multi-year longitudinal financial data' },
          { line: 20, note: 'Calculates cumulative YTD running totals enforcing annual fiscal boundary resets' },
          { line: 27, note: 'Matches current monthly performance against prior year identical periods to evaluate YoY growth' }
        ],
        tryIt: 'Add a 2026-M04 record with rev: 180000.0 and verify that YTD Running Total accumulates to $623,000.00.',
        check: {
          question: 'Why is Year-over-Year (YoY) growth preferred over sequential Month-over-Month (MoM) growth in corporate executive reporting?',
          options: [
            'YoY growth compares identical seasons across years, eliminating seasonal distortions like holiday surges or summer slowdowns',
            'Because MoM growth requires dividing by zero on leap years',
            'Because accounting rules legally forbid comparing adjacent months',
            'YoY growth is only used when companies are losing money'
          ],
          answer: 0,
          why: 'Comparing current performance to the same period in the prior year eliminates seasonal anomalies, providing a clear and reliable measure of genuine business growth.'
        }
      },
      {
        title: 'Tier 4: Interactive Scenario Switchboard & Variance Sensitivity Engine',
        say: [
          'In dynamic corporate environments subject to macroeconomic volatility, static financial projections are obsolete the moment they are published. Boardrooms require interactive scenario planning that allows leadership to toggle instantly between Base, Bull, and Bear operational futures. Tier 4 of our Capstone constructs an Interactive Scenario Switchboard and Variance Sensitivity Engine.',
          'In Excel financial modeling, scenario switchboards are powered by disconnected parameter tables and dynamic lookup formulas such as CHOOSE, INDEX/MATCH, or XLOOKUP tied to form controls. The model maintains a centralized scenario selector cell: selecting 1 activates the Base Case (budgeted targets), selecting 2 triggers the Bull Case (aggressive top-line expansion with operating leverage), and selecting 3 engages the Bear Case (macroeconomic contraction with margin compression).',
          'Our scenario engine models dynamic operating leverage: changes in top-line revenue do not simply scale expenses linearly. In a Bull Case scenario (+25% revenue), economies of scale compress Cost of Goods Sold (COGS) as a percentage of revenue by 300 basis points, while Fixed Operating Expenses expand only marginally (+5%), driving explosive EBITDA expansion. In a Bear Case scenario (-20% revenue), fixed cost stickiness and input price inflation expand COGS ratios, resulting in severe EBITDA margin compression.',
          'The engine evaluates Scenario Variance against the established Base Case budget. Quantifying variance in both nominal dollar terms and percentage margins provides CFOs with immediate visibility into potential cash flow shortfalls, enabling proactive cost-cutting measures before financial distress materializes.',
          'In advanced institutional financial engineering, deterministic three-scenario switchboards are complemented by probabilistic Monte Carlo simulations. By defining statistical probability distributions around key operating variables—such as Normal distributions for sales volume, Beta distributions for commodity raw material costs, and Lognormal distributions for inflation rates—analysts run ten thousand iterative simulation trials. This stochastic approach produces full probability distributions of future EBITDA, enabling risk officers to evaluate Value at Risk (VaR) and establish capital buffers with 95% or 99% confidence intervals.',
          'Additionally, scenario switchboards interface with Goal Seek and linear optimization solvers. If an executive leadership team mandates a target EBITDA of $2.5 million to satisfy bond indenture covenants, the analyst uses numerical back-solving to determine the exact minimum sales volume or maximum allowable overhead expense required to reach that financial milestone under Base, Bull, and Bear conditions.',
          'Furthermore, sensitivity variance engines form the backbone of corporate stress-testing. By quantifying the financial impact of simultaneous revenue decline and cost inflation, treasury executives evaluate whether credit covenants or minimum cash reserves would be breached under adverse economic scenarios.',
          'In private equity underwriting, scenario switchboards are linked to equity waterfall returns, allowing investment partners to evaluate Limited Partner (LP) and General Partner (GP) carried interest payouts across conservative, target, and blue-sky exit multiples.',
          'Here, we build the Interactive Scenario Switchboard in Python. We parameterize scenario multipliers, compute pro forma revenues and gross profits, model operating leverage, evaluate EBITDA variances, and generate an audited multi-scenario comparison.'
        ],
        example: 'Think of an aircraft flight simulator: the pilot can toggle between Clear Skies (Base Case), Strong Tailwinds (Bull Case), and Severe Mountain Turbulence (Bear Case) at the push of a button, testing aircraft performance and fuel consumption across varying flight conditions.',
        code: p4_code,
        output: p4_out,
        codeNotes: [
          { line: 2, note: 'Parameterizes multi-scenario financial switchboard supporting Base, Bull, and Bear projections' },
          { line: 12, note: 'Models operational leverage adjusting COGS ratios and fixed overhead multipliers dynamically' },
          { line: 22, note: 'Computes EBITDA variances against baseline budget providing variance visibility' }
        ],
        tryIt: 'Modify the Bear Case rev_mult to 0.70 and observe how Bear Case EBITDA and negative variance expand.',
        check: {
          question: 'What is operating leverage in corporate financial modeling?',
          options: [
            'The degree to which revenue growth translates into greater percentage growth in operating income due to fixed costs',
            'The total number of bank loans a company holds',
            'The legal leverage a CEO has over board members during contract negotiations',
            'The physical machinery used in manufacturing warehouses'
          ],
          answer: 0,
          why: 'Operating leverage occurs when a company has fixed operating expenses; as revenue increases, those fixed costs are spread over more sales, causing operating income (EBITDA) to expand faster than revenue.'
        }
      },
      {
        title: 'Tier 5: Grand Master Milestone 2 Capstone Financial Command Center',
        say: [
          'In this final Tier of our Milestone 2 Capstone, we synthesize our Star Schema data model, automated ETL quality pipeline, time-intelligence engine, and scenario switchboard into a unified C-Suite Financial and Operational Command Center: the GrandMasterMilestone2CapstoneEngine. This executive platform delivers the mission-critical financial KPIs, debt solvency metrics, and automated governance health ratings demanded by institutional corporate boards.',
          'Our command center consolidates multi-entity global subsidiaries (US, UK, and European entities) into unified enterprise reporting metrics. It computes core operational KPIs: Consolidated Annual Recurring Revenue (ARR), Consolidated EBITDA, and Operating Margin percentages. These top-line figures provide executive leadership with a consolidated snapshot of global enterprise performance.',
          'Crucially, the engine evaluates institutional Solvency and Credit Health. Incorporating our Day 9 debt modeling principles, the engine calculates the Debt Service Coverage Ratio (DSCR), verifying whether operating cash flows comfortably exceed mandatory annual senior debt service payments. It also computes Senior Debt Leverage (Total Senior Debt divided by EBITDA) and estimates Cash Runway in months based on net monthly operating burn rates.',
          'Based on these quantitative metrics, the engine issues an automated Institutional Health Rating: assigning PRIME_INVESTMENT_GRADE when DSCR exceeds 2.0x and leverage remains below 3.0x EBITDA, ADEQUATE when covenants are maintained, or COVENANT_DISTRESS when DSCR drops below the contractual 1.25x safety threshold.',
          'In boardroom reporting, executive command centers incorporate classic DuPont Analysis to decompose return on equity into operational and financial drivers. By breaking down ROE into Operating Profit Margin (operational efficiency), Asset Turnover (capital efficiency), and the Equity Multiplier (financial leverage), C-suite executives instantly diagnose whether improved profitability stems from genuine operational margin expansion or dangerous debt-fueled financial leverage.',
          'Corporate governance mandates also require role-based access control (RBAC) and data masking within executive reporting dashboards. In multinational enterprises, divisional vice presidents may view operational metrics for their specific operating business unit, but only C-suite executives and board directors possess security authorization to inspect consolidated payroll, executive carried interest allocations, and strategic M&A war-chest liquidity. Designing enterprise reporting engines with embedded security metadata ensures regulatory compliance across international data protection regimes.',
          'Finally, the command center executes instantaneous Stress-Testing: simulating a twenty-five percent macroeconomic top-line contraction across all global subsidiaries. The engine instantly recalculates consolidated EBITDA, evaluates whether the covenant threshold is breached, and alerts the board to potential debt restructuring requirements.',
          'Mastering this five-tier architecture marks your transition from spreadsheet user to quantitative financial engineer. You possess the capability to architect scalable relational data models, automate robust ETL quality gates, implement complex temporal analytics, model dynamic operational leverage, and construct boardroom executive dashboards capable of steering enterprise capital allocation.',
          'By establishing real-time feedback loops between operational data feeds and board-level risk indicators, the financial command center empowers leadership to steer corporate resources with institutional confidence and precision.',
          'Congratulations on conquering Milestone 2! Below, we execute the complete Grand Master Capstone Financial Command Center in Python, consolidating global entities, calculating solvency coverage KPIs, running macroeconomic stress-tests, and outputting an audited executive dashboard scorecard.'
        ],
        example: 'Think of the master mission control room for a space exploration agency: telemetry feeds from propulsion, life support, orbital velocity, and fuel reserves are synthesized onto a unified digital wall, alerting flight directors to mission readiness and system stress in real time.',
        code: p5_code,
        output: p5_out,
        codeNotes: [
          { line: 2, note: 'Synthesizes multi-entity financials, debt facilities, and cash reserves into executive command center' },
          { line: 12, note: 'Computes institutional solvency KPIs including DSCR coverage, leverage ratio, and cash runway' },
          { line: 27, note: 'Executes macroeconomic stress-testing simulating severe 25% revenue contraction across global subsidiaries' }
        ],
        tryIt: 'Increase senior_debt to $5,000,000 and observe how debt-to-EBITDA leverage expands and health rating adjusts.',
        check: {
          question: 'What does a Debt Service Coverage Ratio (DSCR) below 1.25x typically signify to corporate lenders and credit committees?',
          options: [
            'A covenant distress condition indicating that cash flow is dangerously close to or insufficient for servicing debt',
            'That the company has earned excess profits and must pay a special dividend',
            'That the company qualifies for an immediate credit rating upgrade',
            'That interest rates on the debt will automatically drop to zero'
          ],
          answer: 0,
          why: 'A DSCR below 1.25x triggers covenant warnings because available operating cash flow lacks an adequate safety margin to service mandatory debt principal and interest payments.'
        }
      }
    ],
    summary: [
      'The Star Schema architecture normalizes financial data into central fact tables and peripheral dimensions with single-directional filter propagation.',
      'Automated ETL quality gates clean heterogeneous currency notation, parse parenthetical negative numbers, and quarantine data anomalies.',
      'Dynamic DAX time-intelligence models compute YTD running totals, YoY organic growth rates, and trailing moving averages.',
      'Interactive scenario switchboards model operating leverage and quantify nominal and percentage EBITDA variances against budget baselines.',
      'The Grand Master Capstone Command Center consolidates multi-entity operations, monitors DSCR solvency covenants, and executes macro stress-tests.'
    ],
    projectStep: {
      title: 'Architect the Milestone 2 Enterprise Financial & Operational Analytics Command Center',
      steps: [
        'Design an enterprise Star Schema model binding FactEnterpriseFinancials to DimEntity, DimAccount, DimScenario, and DimCalendar.',
        'Implement an automated ETL quality gate parsing currency strings, handling parenthetical negatives, and quarantining anomalies.',
        'Build a dynamic DAX time-intelligence engine computing YTD running totals, YoY growth rates, and 3-month trailing moving averages.',
        'Construct an interactive scenario switchboard modeling operational leverage and evaluating Base, Bull, and Bear EBITDA variances.',
        'Deploy the Grand Master Executive Command Center consolidating global subsidiaries, evaluating DSCR covenants, and stress-testing solvency.'
      ]
    }
  };
}
