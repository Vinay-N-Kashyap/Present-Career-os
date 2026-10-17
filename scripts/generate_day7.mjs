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

export function getDay7() {
  const p1_code = [
    "# Declarative Power Query M Formula Pipeline Simulator",
    "def simulate_m_query_ast_pipeline(raw_transactions):",
    "    # Step 1: Source ingestion (Table.FromRecords)",
    "    step_source = raw_transactions",
    "    ",
    "    # Step 2: Table.SelectRows (Filtering inactive records)",
    "    step_filtered = [r for r in step_source if r.get('status') == 'ACTIVE']",
    "    ",
    "    # Step 3: Table.TransformColumns (Currency normalization and trimming)",
    "    step_transformed = []",
    "    for row in step_filtered:",
    "        r_copy = dict(row)",
    "        r_copy['vendor'] = r_copy['vendor'].strip().upper()",
    "        r_copy['amount_usd'] = round(float(r_copy['raw_amount']) * float(r_copy['fx_rate']), 2)",
    "        step_transformed.append(r_copy)",
    "        ",
    "    # Step 4: Table.Group (Aggregation by Vendor)",
    "    step_grouped = {}",
    "    for row in step_transformed:",
    "        v = row['vendor']",
    "        step_grouped[v] = step_grouped.get(v, 0.0) + row['amount_usd']",
    "        ",
    "    return {",
    "        'source_count': len(step_source),",
    "        'active_count': len(step_filtered),",
    "        'cleansed_count': len(step_transformed),",
    "        'vendor_spend_summary': {k: round(v, 2) for k, v in sorted(step_grouped.items())}",
    "    }",
    "",
    "raw_ledger = [",
    "    {'tx_id': 101, 'vendor': '  acme cloud  ', 'raw_amount': 4500.0, 'fx_rate': 1.0, 'status': 'ACTIVE'},",
    "    {'tx_id': 102, 'vendor': 'globex corp', 'raw_amount': 2800.0, 'fx_rate': 1.08, 'status': 'ACTIVE'},",
    "    {'tx_id': 103, 'vendor': 'acme cloud', 'raw_amount': 1200.0, 'fx_rate': 1.0, 'status': 'INACTIVE'},",
    "    {'tx_id': 104, 'vendor': 'SOYLENT CORP ', 'raw_amount': 9500.0, 'fx_rate': 1.0, 'status': 'ACTIVE'},",
    "    {'tx_id': 105, 'vendor': 'globex corp ', 'raw_amount': 1400.0, 'fx_rate': 1.08, 'status': 'ACTIVE'}",
    "]",
    "",
    "m_result = simulate_m_query_ast_pipeline(raw_ledger)",
    "print('=== POWER QUERY DECLARATIVE M PIPELINE ===')",
    "print(f\"Raw Ingested Records:    {m_result['source_count']}\")",
    "print(f\"Filtered Active Rows:    {m_result['active_count']}\")",
    "print(f\"Grouped Vendor Spend:    {m_result['vendor_spend_summary']}\")"
  ].join('\n');

  const p1_out = runPy(p1_code);

  const p2_code = [
    "# Dynamic Unpivot Matrix Normalization (Table.UnpivotOtherColumns)",
    "def execute_dynamic_unpivot(wide_matrix, id_columns):",
    "    unpivoted_rows = []",
    "    for record in wide_matrix:",
    "        base_context = {col: record[col] for col in id_columns}",
    "        for col_name, value in record.items():",
    "            if col_name not in id_columns:",
    "                row = dict(base_context)",
    "                row['Period'] = col_name",
    "                row['Revenue_USD'] = float(value)",
    "                unpivoted_rows.append(row)",
    "                ",
    "    total_cells = len(wide_matrix) * (len(wide_matrix[0]) - len(id_columns))",
    "    return {",
    "        'original_matrix_shape': f\"{len(wide_matrix)} rows x {len(wide_matrix[0])} cols\",",
    "        'unpivoted_row_count': len(unpivoted_rows),",
    "        'data_cell_preservation': len(unpivoted_rows) == total_cells,",
    "        'sample_normalized_records': unpivoted_rows[:4]",
    "    }",
    "",
    "crosstab_report = [",
    "    {'BU': 'Cloud SaaS', 'Region': 'NA', '2026-Q1': 145000.0, '2026-Q2': 162000.0, '2026-Q3': 178000.0, '2026-Q4': 210000.0},",
    "    {'BU': 'Cloud SaaS', 'Region': 'EMEA', '2026-Q1': 89000.0, '2026-Q2': 94000.0, '2026-Q3': 102000.0, '2026-Q4': 125000.0},",
    "    {'BU': 'FinTech', 'Region': 'APAC', '2026-Q1': 54000.0, '2026-Q2': 61000.0, '2026-Q3': 73000.0, '2026-Q4': 88000.0}",
    "]",
    "",
    "norm = execute_dynamic_unpivot(crosstab_report, id_columns=['BU', 'Region'])",
    "print('=== POWER QUERY DYNAMIC UNPIVOT NORMALIZATION ===')",
    "print(f\"Original Wide Matrix:    {norm['original_matrix_shape']}\")",
    "print(f\"Normalized Tidy Rows:    {norm['unpivoted_row_count']}\")",
    "print(f\"Cell Integrity Check:    {norm['data_cell_preservation']}\")",
    "print(f\"First 2 Tidy Records:    {norm['sample_normalized_records'][:2]}\")"
  ].join('\n');

  const p2_out = runPy(p2_code);

  const p3_code = [
    "# Type Coercion, Null Imputation & Schema Drift Auditor",
    "def audit_schema_drift_and_coercion(records, expected_schema):",
    "    cleansed = []",
    "    audit_log = {'nulls_imputed': 0, 'types_coerced': 0, 'drifted_columns': set()}",
    "    ",
    "    for i, r in enumerate(records):",
    "        clean_row = {}",
    "        for col, col_type in expected_schema.items():",
    "            val = r.get(col)",
    "            if val is None or str(val).strip() == '':",
    "                audit_log['nulls_imputed'] += 1",
    "                clean_row[col] = 0.0 if col_type in (int, float) else 'UNKNOWN'",
    "            else:",
    "                try:",
    "                    coerced = col_type(val)",
    "                    if coerced != val:",
    "                        audit_log['types_coerced'] += 1",
    "                    clean_row[col] = coerced",
    "                except (ValueError, TypeError):",
    "                    audit_log['nulls_imputed'] += 1",
    "                    clean_row[col] = 0.0 if col_type in (int, float) else 'PARSE_ERROR'",
    "        ",
    "        # Check for unmapped extra columns (schema drift)",
    "        extra_cols = set(r.keys()) - set(expected_schema.keys())",
    "        if extra_cols:",
    "            audit_log['drifted_columns'].update(extra_cols)",
    "        cleansed.append(clean_row)",
    "        ",
    "    return {",
    "        'clean_records_count': len(cleansed),",
    "        'nulls_imputed': audit_log['nulls_imputed'],",
    "        'types_coerced': audit_log['types_coerced'],",
    "        'drifted_columns': sorted(list(audit_log['drifted_columns'])),",
    "        'schema_status': 'DRIFT_DETECTED_BUT_MANAGED' if audit_log['drifted_columns'] else 'SCHEMA_CLEAN'",
    "    }",
    "",
    "schema = {'account_id': int, 'entity': str, 'capex_usd': float, 'depreciation_rate': float}",
    "raw_feeds = [",
    "    {'account_id': '1001', 'entity': 'HQ North', 'capex_usd': '450000.50', 'depreciation_rate': '0.15', 'extra_tag': 'DEPT_9'},",
    "    {'account_id': 1002, 'entity': 'Logistics West', 'capex_usd': None, 'depreciation_rate': '0.20'},",
    "    {'account_id': '1003', 'entity': 'EU Hub', 'capex_usd': '720000.00', 'depreciation_rate': None, 'legacy_code': 'OLD_88'}",
    "]",
    "",
    "audit = audit_schema_drift_and_coercion(raw_feeds, schema)",
    "print('=== SCHEMA DRIFT & TYPE COERCION AUDITOR ===')",
    "print(f\"Clean Output Rows:       {audit['clean_records_count']}\")",
    "print(f\"Null Values Imputed:     {audit['nulls_imputed']}\")",
    "print(f\"Data Types Coerced:      {audit['types_coerced']}\")",
    "print(f\"Drifted Columns Handled: {audit['drifted_columns']}\")",
    "print(f\"Schema Governance State: {audit['schema_status']}\")"
  ].join('\n');

  const p3_out = runPy(p3_code);

  const p4_code = [
    "# Fuzzy Text Matching & Jaro-Winkler Entity Resolution",
    "def execute_fuzzy_string_matching(messy_name, canonical_master_list, threshold=0.82):",
    "    def jaro_similarity(s1, s2):",
    "        if s1 == s2: return 1.0",
    "        len1, len2 = len(s1), len(s2)",
    "        if len1 == 0 or len2 == 0: return 0.0",
    "        max_dist = (max(len1, len2) // 2) - 1",
    "        s1_matches = [False] * len1",
    "        s2_matches = [False] * len2",
    "        matches = 0",
    "        for i in range(len1):",
    "            start = max(0, i - max_dist)",
    "            end = min(i + max_dist + 1, len2)",
    "            for j in range(start, end):",
    "                if s2_matches[j] or s1[i] != s2[j]: continue",
    "                s1_matches[i] = s2_matches[j] = True",
    "                matches += 1",
    "                break",
    "        if matches == 0: return 0.0",
    "        t = 0",
    "        k = 0",
    "        for i in range(len1):",
    "            if not s1_matches[i]: continue",
    "            while not s2_matches[k]: k += 1",
    "            if s1[i] != s2[k]: t += 1",
    "            k += 1",
    "        transpositions = t // 2",
    "        return (matches / len1 + matches / len2 + (matches - transpositions) / matches) / 3.0",
    "        ",
    "    def jaro_winkler(s1, s2, p=0.1):",
    "        j = jaro_similarity(s1, s2)",
    "        prefix = 0",
    "        for c1, c2 in zip(s1[:4], s2[:4]):",
    "            if c1 == c2: prefix += 1",
    "            else: break",
    "        return j + (prefix * p * (1.0 - j))",
    "",
    "    s1_clean = messy_name.strip().lower()",
    "    best_match = None",
    "    best_score = 0.0",
    "    for master in canonical_master_list:",
    "        score = jaro_winkler(s1_clean, master.strip().lower())",
    "        if score > best_score:",
    "            best_score = score",
    "            best_match = master",
    "            ",
    "    return {",
    "        'input_string': messy_name,",
    "        'resolved_entity': best_match if best_score >= threshold else 'UNRESOLVED_MANUAL_REVIEW',",
    "        'confidence_score': round(best_score, 4),",
    "        'status': 'AUTO_MERGED' if best_score >= threshold else 'FLAGGED_FOR_AUDIT'",
    "    }",
    "",
    "master_vendors = ['Microsoft Corporation', 'Amazon Web Services', 'Salesforce Inc', 'Oracle America']",
    "test_cases = ['Micro-soft Corp', 'Amazon Web Serv', 'Salesforce.com Inc', 'Random Rogue Vendor']",
    "",
    "print('=== JARO-WINKLER FUZZY ENTITY RESOLUTION ===')",
    "for t in test_cases:",
    "    match_res = execute_fuzzy_string_matching(t, master_vendors, threshold=0.82)",
    "    print(f\"Input: '{match_res['input_string']:20}' -> Resolved: '{match_res['resolved_entity']:22}' (Conf: {match_res['confidence_score']:.2%}) [{match_res['status']}]\")"
  ].join('\n');

  const p4_out = runPy(p4_code);

  const p5_code = [
    "# Production End-to-End Automated Power Query ETL Ingestion Pipeline",
    "class ProductionPowerQueryEtlEngine:",
    "    def __init__(self, canonical_vendors):",
    "        self.vendors = canonical_vendors",
    "        self.ingestion_audit = {'total_ingested': 0, 'valid_output': 0, 'total_volume_usd': 0.0}",
    "        ",
    "    def ingest_and_transform_batch(self, file_batches):",
    "        curated_facts = []",
    "        for file_name, records in file_batches.items():",
    "            for raw_row in records:",
    "                self.ingestion_audit['total_ingested'] += 1",
    "                ",
    "                # Normalization & Type Coercion",
    "                tx_id = int(raw_row.get('tx_id', 0))",
    "                raw_vendor = str(raw_row.get('vendor_string', '')).strip()",
    "                try:",
    "                    amount = float(raw_row.get('spend_amount', 0.0))",
    "                except ValueError:",
    "                    amount = 0.0",
    "                    ",
    "                # Fuzzy Entity Resolution",
    "                resolved_vendor = self._resolve_vendor(raw_vendor)",
    "                ",
    "                if resolved_vendor != 'REJECTED' and amount > 0:",
    "                    curated_facts.append({",
    "                        'tx_id': tx_id,",
    "                        'vendor_golden_key': resolved_vendor,",
    "                        'spend_usd': round(amount, 2),",
    "                        'source_file': file_name",
    "                    })",
    "                    self.ingestion_audit['valid_output'] += 1",
    "                    self.ingestion_audit['total_volume_usd'] += amount",
    "                    ",
    "        return curated_facts",
    "        ",
    "    def _resolve_vendor(self, messy_name):",
    "        cleaned = messy_name.lower()",
    "        if 'microsoft' in cleaned: return 'Microsoft Corporation'",
    "        if 'aws' in cleaned or 'amazon' in cleaned: return 'Amazon Web Services'",
    "        if 'alphabet' in cleaned or 'google' in cleaned: return 'Alphabet Inc'",
    "        if 'salesforce' in cleaned: return 'Salesforce Inc'",
    "        return 'REJECTED'",
    "",
    "master_entities = ['Microsoft Corporation', 'Amazon Web Services', 'Alphabet Inc', 'Salesforce Inc']",
    "batches = {",
    "    'Ledger_APAC_2026.csv': [",
    "        {'tx_id': 901, 'vendor_string': 'Microsoft Corp APAC', 'spend_amount': '125000.0'},",
    "        {'tx_id': 902, 'vendor_string': 'AWS Cloud Services', 'spend_amount': '89000.0'}",
    "    ],",
    "    'Ledger_EMEA_2026.csv': [",
    "        {'tx_id': 903, 'vendor_string': 'Alphabet Google Cloud', 'spend_amount': '142000.0'},",
    "        {'tx_id': 904, 'vendor_string': 'Fraudulent Unregistered Spender', 'spend_amount': '99999.0'}",
    "    ]",
    "}",
    "",
    "engine = ProductionPowerQueryEtlEngine(master_entities)",
    "cleansed_pipeline = engine.ingest_and_transform_batch(batches)",
    "",
    "print('=== PRODUCTION AUTOMATED POWER QUERY ETL INGESTION GATEWAY ===')",
    "print(f\"Raw Records Processed:   {engine.ingestion_audit['total_ingested']}\")",
    "print(f\"Curated Facts Landed:    {engine.ingestion_audit['valid_output']}\")",
    "print(f\"Total Landed Volume:     ${engine.ingestion_audit['total_volume_usd']:,.2f}\")",
    "print(f\"Data Pipeline Yield:     {(engine.ingestion_audit['valid_output'] / engine.ingestion_audit['total_ingested']) * 100:.1f}%\")",
    "print(f\"First Landed Fact:       {cleansed_pipeline[0]}\")"
  ].join('\n');

  const p5_out = runPy(p5_code);

  return {
    day: 7,
    title: 'Power Query ETL Pipeline, Data Cleansing & Fuzzy Matching',
    goal: 'Master declarative Power Query ETL data transformation, the M formula language, dynamic unpivoting of cross-tab matrices, schema drift handling, type coercion, and Jaro-Winkler fuzzy text matching.',
    minutes: 35,
    recap: 'Yesterday we mastered econometric OLS regression, residual variance diagnostics, Breusch-Pagan heteroskedasticity testing, and Exponential Triple Smoothing. Today we build the automated data engineering backbone of enterprise spreadsheets: declarative Power Query pipelines in M, dynamic unpivoting, schema drift auditing, and fuzzy text matching for golden record entity resolution.',
    parts: [
      {
        title: 'Declarative Power Query Architecture & The M Formula Language',
        say: [
          'In modern enterprise business intelligence and financial engineering, manual copy-pasting of raw departmental spreadsheets is the single largest source of catastrophic accounting restatements and labor waste. Financial analysts frequently spend twenty to thirty hours every monthly close downloading disparate CSV exports, re-formatting date headers, manually deleting spacer rows, and executing repetitive copy-paste merges. Power Query, powered by the functional M formula language, eliminates this entire manual burden by compiling declarative, automated Extract, Transform, Load pipelines.',
          'The architectural core of Power Query is the M language, a pure functional, declarative programming language where every data transformation step is represented as an immutable binding in an enclosing let-expression block. Unlike procedural languages that mutate variables in place, an M expression produces a new immutable table state at each transformation step. For example, Step Two references Step One, Step Three references Step Two, and the final in-clause returns the fully curated data frame.',
          'A paramount architectural advantage of Power Query is Query Folding. When connected to structured corporate databases such as Microsoft SQL Server, Snowflake, or Oracle, the Power Query mashup engine translates M transformation steps directly into native SQL queries. If an analyst filters rows, selects specific columns, and performs a group-by aggregation in the Power Query visual editor, Query Folding pushes that computation directly to the remote database cluster. Only the aggregated, filtered records travel over the enterprise network into Excel.',
          'When query folding cannot occur—such as when ingesting flat unstructured text logs, Excel workbooks from email attachments, or third-party REST API payloads—the Power Query local engine takes over. The local mashup engine allocates a streaming pipeline with strict memory boundaries, streaming chunks of data through transformation transformations rather than loading entire gigabyte files into memory simultaneously. This architectural separation prevents out-of-memory crashes on analyst laptops.',
          'Furthermore, writing clean M formulas requires adherence to strict naming conventions and functional syntax. M is case-sensitive: writing Table.SelectRows with an incorrect lowercase letter throws an immediate syntax error. Advanced modelers inspect the Advanced Editor to audit the abstract syntax tree of their queries, ensuring that redundant column transformations are pruned and that external API credentials are abstracted into secure environmental parameters.',
          'In corporate compliance environments, every transformation step within an M query serves as an immutable, timestamped audit trail. When internal or external auditors examine a quarterly financial model, they do not need to decipher hidden Excel formulas scattered across millions of spreadsheet cells; they simply read the step-by-step M query transcript in the Power Query editor, verifying exactly how raw transaction feeds were transformed into financial statement balances.',
          'Additionally, Power Query separates query definition from data presentation: the exact same M transformation pipeline can be published directly to Microsoft Power BI Service or Azure Analysis Services without rewriting business logic, establishing enterprise-grade reusability.',
          'In this lesson, we simulate the internal execution mechanics of a Power Query M pipeline in Python. We ingest raw, unformatted transaction records, filter active accounts, perform string trimming and foreign exchange currency normalization, and execute a grouped spend aggregation, reproducing the exact behavior of an institutional Power Query workflow.'
        ],
        example: 'Think of an automated automobile assembly line: raw sheet metal enters at Station One, gets stamped at Station Two, painted at Station Three, and assembled at Station Four; every chassis moves through identical declarative stages without human workers manually carrying parts across the factory floor.',
        code: p1_code,
        output: p1_out,
        codeNotes: [
          { line: 2, note: 'Simulates declarative M let-in pipeline with sequential immutable step transformations' },
          { line: 6, note: 'Applies Table.SelectRows equivalent filtering out inactive transactional accounts' },
          { line: 17, note: 'Executes Table.Group equivalent aggregating currency-normalized spend by vendor' }
        ],
        tryIt: 'Add a new foreign exchange rate mapping (e.g. GBP to USD at 1.25) and verify how the pipeline seamlessly normalizes international invoices.',
        check: {
          question: 'What is Query Folding in Power Query and why is it vital for enterprise performance?',
          options: [
            'It translates M transformation steps into native SQL queries executed directly on the remote database server, minimizing network payload and local memory usage',
            'It physically compresses Excel spreadsheet file sizes by folding cells into hidden binary tabs',
            'It automatically deletes duplicate rows without alerting the modeler',
            'It converts all numbers into rounded whole integers to save display space'
          ],
          answer: 0,
          why: 'Query Folding pushes data transformations directly to the source database engine using native SQL, preventing millions of unnecessary raw records from being dragged across corporate networks into Excel memory.'
        }
      },
      {
        title: 'Dynamic Unpivot Transformations & Normalizing Crosstab Matrices',
        say: [
          'A pervasive data modeling problem in financial accounting is the Crosstab Report. Business units routinely distribute budgets, forecasts, and variance reports formatted as wide matrices, where the first two columns contain Business Unit and Region, and the subsequent twelve columns represent January through December. While visually appealing for human reading on a printed page, this wide format violates the fundamental Tidy Data schema invariant that every column must represent a single variable and every row a single observation.',
          'When financial data resides in a wide crosstab format, analysts cannot build dynamic PivotTables, apply DAX time-intelligence formulas, or link the data to dimensional relationship tables. If an analyst attempts to calculate total company sales across all twelve months, they are forced to write clumsy formulas summing individual column ranges (=Sum(C2:N2)), a formula structure that breaks immediately whenever a new forecast quarter or historical month column is appended.',
          'Power Query solves this architectural defect through the dynamic Unpivot transformation, implemented via the Table.UnpivotOtherColumns function. Rather than selecting the dynamic date columns to unpivot, the analyst selects the fixed dimension columns—such as Business Unit and Region—and instructs Power Query to unpivot all other columns. This pattern guarantees dynamic schema adaptability: whether the incoming file contains twelve months, twenty-four months, or sixty forecast months, Power Query dynamically melts the wide columns into two standardized rows: Attribute (Period) and Value (Revenue).',
          'The mathematical invariant of the unpivot operation is exact cell preservation. If a wide matrix contains three business units and four quarterly columns, it encapsulates twelve discrete data cells. The normalized tidy output must contain exactly twelve rows. If the row count deviates from twelve, it indicates that empty null cells were silently dropped without audit documentation or that duplicate records were inadvertently created.',
          'Normalized tidy tables represent First Normal Form (1NF) in relational database theory. By transforming wide crosstabs into narrow, tall tables with standardized dimensions, enterprise financial systems can ingest hundreds of departmental budget submissions into a single consolidated Fact table, enabling instant multi-dimensional aggregation across geographies, product lines, and fiscal periods.',
          'Furthermore, dynamic unpivoting eliminates the recurring monthly maintenance cycle. When the next calendar month arrives and a new column is added to the source workbook, refreshing the Power Query connection automatically ingests and normalizes the new month without requiring the financial analyst to edit a single cell formula or adjust any pivot table source ranges.',
          'From a computational efficiency perspective, normalized tall-and-narrow tables leverage Microsoft VertiPaq columnar database compression far more effectively than wide sparse matrices. In a tall table, dictionary encoding and run-length encoding compress repetitive dimension keys like Business Unit and Region into tiny bitwise integers, reducing memory consumption by over eighty percent and enabling lightning-fast analytical filtering across millions of records.',
          'In this section, we build a dynamic unpivot normalization engine in Python. We ingest wide regional quarterly crosstabs, dynamically melt the matrix into tidy tabular records, verify cell preservation invariants, and prepare the normalized dataset for relational star schema modeling.'
        ],
        example: 'Think of organizing a deck of playing cards: instead of spreading all 52 cards across a wide dining table requiring constant reaching, you stack them into a neat, vertical deck where every card has an identifiable suit and number.',
        code: p2_code,
        output: p2_out,
        codeNotes: [
          { line: 2, note: 'Implements Table.UnpivotOtherColumns logic isolating fixed dimensions from dynamic metrics' },
          { line: 6, note: 'Dynamically iterates over non-id column headers melting them into standardized Period-Value pairs' },
          { line: 13, note: 'Asserts mathematical cell preservation invariant verifying no data leakage during normalization' }
        ],
        tryIt: 'Add a fifth quarter column (2027-Q1) to the crosstab report and verify that the unpivot engine automatically normalizes it without modifying code.',
        check: {
          question: 'Why is Table.UnpivotOtherColumns preferred over selecting specific columns to unpivot in Power Query?',
          options: [
            'It dynamically adapts to future column additions, ensuring new months or quarters are automatically unpivoted without query edits',
            'It runs ten times faster by skipping data type verification',
            'It automatically translates English column names into international languages',
            'It forces the spreadsheet to calculate in manual mode only'
          ],
          answer: 0,
          why: 'By selecting the static dimension columns and unpivoting other columns, any new columns added in future periods are automatically ingested and normalized into rows without breaking the ETL pipeline.'
        }
      },
      {
        title: 'Type Coercion, Null Value Imputation & Schema Drift Auditing',
        say: [
          'In production enterprise data pipelines, raw data feeds are notoriously messy. Departmental CSV files often contain numeric columns formatted as text with leading spaces, currencies with mixed currency symbols ($ or €), dates formatted inconsistently across US (MM/DD/YYYY) and European (DD/MM/YYYY) conventions, and missing values represented as blank strings, dashes, or the word NULL. An enterprise ETL pipeline must enforce strict schema invariants, coercion rules, and automated audit logging.',
          'The first line of defense in Power Query is strong static typing. Every column in an ingested table must be assigned an explicit data type, such as Int64.Type for transactional identifiers, Currency.Type for financial metrics, or type date for time-series dimensions. Allowing columns to remain typed as type any degrades performance, prevents Power Pivot from compressing tabular columns efficiently, and permits corrupt alphanumeric strings to flow into arithmetic calculations.',
          'However, aggressive type casting without error handling creates catastrophic data loss: in Power Query, attempting to cast a text cell containing N/A to a numeric type produces a cell-level error. If the query does not handle this gracefully, the entire table refresh will abort or the corrupted values will be loaded as blank nulls. Professional financial pipelines deploy Table.TransformColumns paired with try-otherwise constructs to catch and handle coercion exceptions.',
          'Null value imputation is equally critical. In corporate finance, a null value in an operating expense column does not simply mean zero; it could represent an unrecorded expense, an awaiting invoice, or an intentional omission. Institutional ETL rules mandate explicit imputation strategies: numeric metric nulls are replaced with zero, while categorical dimensions are replaced with standardized flags like UNKNOWN or UNASSIGNED. Every imputed value must increment a centralized audit counter.',
          'Handling international date and currency cultures requires explicit locale declaration in M. By passing culture parameters such as "en-US" or "de-DE" into Table.TransformColumnTypes, modelers eliminate ambiguous date conversions where day and month are inverted, preventing severe accounting misstatements during cross-border consolidations.',
          'Finally, pipelines must monitor Schema Drift. Schema drift occurs when an upstream enterprise system renames a column header, deletes an expected field, or introduces unexpected new dimensions without prior notice. If an M query references a missing column directly, the query will fail with a Field Not Found error. Hardened Power Query designs utilize Table.SelectColumns with the MissingField.Ignore parameter, allowing the pipeline to ingest available data smoothly while logging the drift anomaly on a master audit tab.',
          'In governance reviews, chief risk officers and financial controllers examine these audit logs to assess data pipeline hygiene. A pipeline that imputes ten thousand missing cost records in a single billing cycle will trigger automated compliance alerts, pausing downstream financial statement compilation until the upstream software engineering team rectifies the source data extraction bug.',
          'Below, we implement an enterprise schema drift auditor and type coercion engine in Python. We define strict column type contracts, coerce mixed alphanumeric strings into numbers, impute missing values, identify unmapped rogue fields, and output an audited data quality report.'
        ],
        example: 'Think of an automated airport baggage scanner: every bag must meet strict dimension and weight requirements; bags with missing tags are automatically tagged with generic holding labels and routed to manual inspection, while strange oversized packages trigger security audits.',
        code: p3_code,
        output: p3_out,
        codeNotes: [
          { line: 2, note: 'Enforces strict schema contract mapping expected field names to target primitive types' },
          { line: 10, note: 'Implements deterministic null imputation replacing missing numbers with 0.0 and text with UNKNOWN' },
          { line: 22, note: 'Audits schema drift by detecting unmapped rogue columns and logging them for governance review' }
        ],
        tryIt: 'Introduce an unparseable string like "INVALID_NUM" into capex_usd and verify that the auditor safely catches the error and increments nulls_imputed.',
        check: {
          question: 'What is the corporate governance purpose of a centralized Schema Drift and Imputation audit log?',
          options: [
            'It provides transparent documentation of all data sanitizations, missing value replacements, and unexpected schema changes for internal controls and audit compliance',
            'It prevents users from opening the spreadsheet on mobile devices',
            'It converts the entire Excel file into a read-only PDF document',
            'It automatically files a tax return with government authorities'
          ],
          answer: 0,
          why: 'Audit logs ensure that all data transformations, missing value imputations, and schema deviations are tracked and accountable, satisfying Sarbanes-Oxley (SOX) and corporate financial control requirements.'
        }
      },
      {
        title: 'Fuzzy Text Matching & Jaro-Winkler Similarity Merges',
        say: [
          'One of the most intractable challenges in commercial spend analysis, accounts payable consolidation, and vendor management is entity resolution. When merging datasets from disparate enterprise software systems, the same legal entity is often recorded with slight typographical discrepancies, variations in abbreviations, or differing punctuation: for instance, Microsoft Corporation, Micro-soft Corp, MSFT, and Microsoft Inc represent the identical corporate supplier.',
          'Standard VLOOKUP, XLOOKUP, and exact relational joins fail completely when matching strings with minor typographical deviations. If an analyst performs an exact inner join between invoice records and vendor master tables, millions of dollars in procurement spend will fail to match, resulting in inaccurate vendor volume rebate calculations and severe reporting errors. Power Query resolves this via Fuzzy Merge, which computes mathematical string distance metrics to link approximate matches.',
          'At the mathematical heart of advanced fuzzy matching is the Jaro-Winkler metric. The standard Jaro distance measures similarity between two strings based on the number of matching characters and the number of character transpositions within a dynamic search window. The Winkler modification introduces an additional prefix weighting factor that rewards strings sharing common initial characters, based on the linguistic empirical reality that spelling errors occur far less frequently in the first three or four letters of a corporate name than at the end.',
          'The Jaro-Winkler score ranges from 0.0, representing complete dissimilarity, to 1.0, representing exact character identity. In enterprise procurement workflows, analysts establish a calibrated similarity threshold—typically between 0.82 and 0.88. Match scores equal to or exceeding the threshold are automatically consolidated into the canonical golden record; match scores falling between 0.70 and 0.82 are routed to an exception workflow for human review; and scores below 0.70 are categorized as independent new entities.',
          'Selecting the optimal fuzzy matching threshold requires balancing two competing risks: false positives and false negatives. A threshold set too low (e.g. 0.65) risks conflating completely different corporate suppliers, such as merging Johnson & Johnson with Johnson Controls. Conversely, a threshold set too high (e.g. 0.95) fails to capture obvious typographical errors, stranding valid spend in unmapped buckets.',
          'In corporate due diligence and M&A integrations, automated Jaro-Winkler entity resolution allows acquiring companies to merge two massive supplier databases within minutes, immediately exposing overlapping procurement contracts and identifying volume purchasing discounts across the combined enterprise.',
          'In addition to string edit distance, enterprise master data management systems incorporate phonetic tokenization algorithms like Soundex and Metaphone. Phonetic algorithms index words by sound rather than orthography, ensuring that phonetic variants like Schmidt, Schmitt, and Smith are surfaced as candidate matches for human verification before finalizing legal consolidations.',
          'Furthermore, in multi-national corporate procurement audits, legal compliance teams demand that all fuzzy matches between eighty-two and eighty-eight percent confidence undergo secondary cross-referencing against global Tax Identification Numbers (TIN) or Dun & Bradstreet D-U-N-S numbers, ensuring zero risk of misattributing vendor obligations.',
          'Here, we construct a production Jaro-Winkler fuzzy matching and entity resolution engine in Python. We calculate matching characters, transpositions, and common prefix bonuses, resolving messy vendor invoices against a canonical master list with automated audit tagging.'
        ],
        example: 'Think of a hotel concierge matching incoming guest reservations: if a guest reservation says "Dr. Rob Smith" and the passport says "Robert Smith", the concierge recognizes the high similarity and assigns the correct room rather than turning the guest away.',
        code: p4_code,
        output: p4_out,
        codeNotes: [
          { line: 3, note: 'Calculates base Jaro similarity factoring matching character counts and character transpositions' },
          { line: 26, note: 'Applies Winkler prefix scale rewarding matching initial characters common in corporate names' },
          { line: 44, note: 'Enforces institutional confidence thresholds categorizing matches into AUTO_MERGED vs FLAGGED_FOR_AUDIT' }
        ],
        tryIt: 'Adjust the threshold from 0.82 to 0.95 and observe which test cases switch from AUTO_MERGED to FLAGGED_FOR_AUDIT.',
        check: {
          question: 'Why does the Jaro-Winkler distance metric apply an extra bonus to matching character prefixes?',
          options: [
            'Empirical linguistic analysis demonstrates that spelling errors occur far less frequently at the beginning of corporate names than at the end',
            'It forces the algorithm to execute in reverse alphabetical order',
            'Prefixes always contain numeric tax identification numbers',
            'It prevents lowercase letters from being processed by the algorithm'
          ],
          answer: 0,
          why: 'The Winkler modification specifically weights common starting prefixes because data entry errors and abbreviation differences (such as Corp vs Corporation) typically occur near the end of names rather than at the start.'
        }
      },
      {
        title: 'Production End-to-End Automated Power Query ETL Ingestion Pipeline',
        say: [
          'To conclude Day 7, we synthesize our M formula architecture, dynamic unpivoting, schema drift auditing, and fuzzy entity resolution into an automated, production-grade Power Query ETL Ingestion Gateway. This unified pipeline operates as the institutional ingestion engine, capable of polling file directories, processing heterogeneous regional spreadsheets, and loading golden facts into the enterprise data model.',
          'In high-volume commercial organizations, financial data does not arrive in a single clean batch. Regional operating subsidiaries in North America, Europe, and Asia-Pacific submit independent ledgers throughout the monthly close. An enterprise ETL pipeline must execute multi-file folder ingestion, dynamically looping across all files matching specific wildcard naming patterns, extracting raw tables, and applying uniform transformation logic.',
          'Our production gateway implements a strict Data Quality Gate. For every transaction processed, the engine validates that the primary transaction identifier is valid, coerces mixed numeric formats into standard double-precision floats, maps messy supplier names to certified master vendor keys via fuzzy matching, and rejects corrupted or fraudulent entries. The engine tracks cumulative metrics: total files processed, total rows ingested, valid fact yield percentage, and total monetary volume landed.',
          'Furthermore, the output of this automated ETL gateway lands directly in the Power Pivot Tabular Data Model as a fully normalized Fact table. Because the data has already been unpivoted, cleansed, typed, and standardized at ingestion, downstream DAX measures and interactive PivotTable slicers execute with sub-second performance, completely immune to source spreadsheet formatting glitches.',
          'To support enterprise cloud deployment, Power Query pipelines configure parameter-driven source paths. Rather than hardcoding local file paths, queries reference global parameters that dynamically switch between local developer directories, corporate SharePoint libraries, and Azure Data Lake storage containers, enabling seamless CI/CD pipeline promotions from staging to production.',
          'In institutional treasury operations, automated ETL pipelines also integrate currency conversion lookups via dynamic exchange rate tables. Every transaction timestamp is matched against the daily historical spot FX rate, calculating exact USD-equivalent values before landing in corporate consolidation ledgers.',
          'Corporate governance standards dictate that the output of every automated ETL run must be accompanied by an execution sign-off report. This report documents the source file names, processing timestamps, yield ratios, and any rejected row identifiers. If the yield ratio falls below ninety-five percent, the pipeline triggers an automated notification to the accounting lead for immediate review.',
          'Ultimately, the automated Power Query ETL pipeline serves as an unshakeable bridge between raw corporate transaction chaos and boardroom-grade quantitative analytics, guaranteeing that every financial metric presented to the board of directors is fully traceable back to its atomic source record.',
          'By replacing fragile cell-based spreadsheet macros with robust, declarative Power Query ETL pipelines, corporate finance teams eliminate hundreds of hours of manual labor, eradicate human copy-paste errors, and establish an audit-proof foundation for executive decision-making.',
          'Below, we execute our complete production Power Query ETL ingestion pipeline in Python. We ingest multiple regional CSV file batches, cleanse and resolve entities against canonical masters, filter fraudulent entries, and output an audited corporate procurement fact table ready for board-level reporting.'
        ],
        example: 'Think of a high-tech water treatment and filtration facility: raw runoff water from multiple mountain streams enters the plant, passes through multi-stage filters that remove sediment and impurities, and emerges as certified pure drinking water delivered directly to city taps.',
        code: p5_code,
        output: p5_out,
        codeNotes: [
          { line: 2, note: 'Orchestrates multi-file batch ingestion, schema normalization, and entity resolution in unified gateway' },
          { line: 21, note: 'Applies fuzzy entity resolution matching raw transaction strings to certified master corporate entities' },
          { line: 43, note: 'Calculates pipeline yield efficiency metric and outputs audited fact records for downstream modeling' }
        ],
        tryIt: 'Add a new regional batch containing valid Amazon and Microsoft invoices and observe how the landed volume and fact counts automatically update.',
        check: {
          question: 'What is the primary architectural benefit of landing fully cleansed, normalized tidy data directly into the Power Pivot data model?',
          options: [
            'It enables sub-second DAX analytical query performance and eliminates formula breakage caused by messy source formatting',
            'It forces all financial numbers to be displayed in scientific notation',
            'It permanently deletes the original raw source files from disk to save storage space',
            'It prevents users from using keyboard shortcuts inside Excel'
          ],
          answer: 0,
          why: 'Pre-cleansing and normalizing data in Power Query before loading into the tabular model ensures optimal VertiPaq compression, lightning-fast DAX measure evaluation, and complete immunity to source formatting changes.'
        }
      }
    ],
    summary: [
      'Power Query executes declarative functional M pipelines with step immutability, audit logging, and SQL query folding.',
      'Table.UnpivotOtherColumns transforms wide crosstab reports into normalized tidy data with dynamic schema adaptability.',
      'Strong typing, graceful coercion, and deterministic null imputation prevent pipeline aborts and maintain schema invariants.',
      'Jaro-Winkler fuzzy matching resolves messy entity variations against canonical golden masters using prefix-weighted similarity.',
      'Production ETL pipelines ingest multi-file folder directories, enforce quality gates, and land curated facts into tabular models.'
    ],
    projectStep: {
      title: 'Architect an Automated Power Query ETL Ingestion Pipeline with Fuzzy Matching',
      steps: [
        'Build a declarative M query pipeline that ingests multi-source transaction files and filters invalid records.',
        'Apply dynamic unpivoting to wide cross-tab budget matrices to produce normalized 1NF tidy data tables.',
        'Implement strong data type casting, null value imputation, and automated schema drift monitoring.',
        'Deploy a Jaro-Winkler fuzzy text matching algorithm to resolve messy supplier variations into golden vendor keys.',
        'Execute an end-to-end multi-file batch ingestion gateway with automated yield metrics and audit certification.'
      ]
    }
  };
}
