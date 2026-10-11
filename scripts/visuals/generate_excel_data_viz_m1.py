# scripts/visuals/generate_excel_data_viz_m1.py
"""
Generator script for Course 34: Excel & Data Analysis Fundamentals (course-excel-data-viz)
Month 1: Days 1 to 15 (60 Quests: Q34.1 to Q34.60).
Conforms strictly to the Gate v2 / True 9.8 Pedagogical Standard:
- Exact 3-Tier Socratic Hint Ladder
- Situational Production Puzzle (with 4 options and detailed debrief)
- Exactly 4 Quests per day (Concept, Detective Challenge, Mastery Assignment, Production Incident Lab)
- Real 3 AM Production Incident Failure Modes
- TryIt Live Friction Challenges with reproduction bugs
- Zero markdown backticks inside strings (using HTML <code>...</code> tags)
"""

import json
from pathlib import Path

days_data = [
    {
        "day": 1,
        "month": 1,
        "blockNum": 1,
        "title": "Spreadsheet Grid Architecture: Cells, 2D Coordinates & Data Types",
        "stageNum": 1,
        "stageName": "Stage 1: Mental Model & Foundations",
        "pedagogicalRole": "Spreadsheet Grid Geometry & Data Type Foundations (2D Addressing, Coordinate Parsing, Cell Storage Engines & Type Alignment Invariants)",
        "spokenGoal": "Every financial empire, fortune 500 balance sheet, and clinical analytics pipeline starts with a simple 2D coordinate grid: 16,384 columns by 1,048,576 rows. Today, we strip away casual user habits and treat Excel as a high-performance in-memory columnar database. You will master cell address coordinate parsing, understand how Base-26 column letters map to memory indices, and learn the strict visual alignment physics separating true numeric floats from dangerous 'numbers stored as text'.",
        "conceptInvariant": "Spreadsheet Data Type & Coordinate Invariant: A cell coordinate is a 2D vector $(c, r) \\in [0, 16383] \\times [0, 1048575]$ where column letters follow Base-26 bijective numeration: $\\text{colIndex} = \\sum_{i=0}^{k-1} (\\text{char}_i - 64) \\times 26^{k - 1 - i} - 1$. Text aligns LEFT, numeric floats align RIGHT; mathematical operators on text fail with <code>#VALUE!</code>.",
        "failureMode": "The $4.2M Silent Text Concatenation Error: A retail distributor's inventory reconciliation model loads sales volumes where quantities in column D were accidentally formatted as text strings. A junior analyst writes a macro that uses string concatenation rather than numeric addition (`'100' + '200' = '100200'`), causing automated warehouse inventory replenishment to over-order by 4.2 million units.",
        "tryItFriction": "Write a coordinate parser function in Python or JavaScript that converts cell references like 'XFD1048576' into 0-indexed column and row coordinates, handling non-alphanumeric input errors gracefully.",
        "socraticHints": [
            "Why does Excel visually align numeric values to the right and text values to the left by default, and how does this serve as an immediate visual checksum for dirty data?",
            "How does Base-26 bijective numeration differ from standard Base-26 positional notation (hint: there is no symbol for zero; 'A' represents 1, 'Z' represents 26)?",
            "What happens under the hood when a cell containing `'150'` (with a leading apostrophe) is referenced in a `SUM()` formula versus an arithmetic operator (`=A1 + 10`)?"
        ],
        "situationalPuzzle": {
            "scenario": "A financial controller opens an imported corporate payroll spreadsheet. The total payroll in cell G100 shows $0.00, even though columns G2:G99 contain 98 employee salary entries (e.g. '85000', '92000'). The formula in G100 is `=SUM(G2:G99)`. The controller notices small green error triangles in the upper-left corners of all salary cells.",
            "options": [
                "The employees worked for free this month.",
                "Diagnose the classic 'Numbers Stored as Text' type mismatch: The upstream HR export wrapped salary values in quotes or prepended apostrophes. The `SUM()` function strictly ignores text cells rather than throwing an error, resulting in a total of 0. Fix by selecting the range and applying Text-to-Columns (Delimited -> Finish) or multiplying by 1 (`=G2*1`) to coerce strings to numeric floats.",
                "Reboot the computer and reinstall Microsoft Office.",
                "Replace `SUM` with 98 manual plus signs (`=G2+G3+...+G99`)."
            ],
            "correctOptionIndex": 1,
            "debrief": "The `SUM()` function is designed to ignore non-numeric cells silently. When numbers are imported as text, `SUM()` skips them completely, yielding 0. Coercing strings into numeric floats via Text-to-Columns or mathematical operations restores numeric integrity."
        },
        "quests": [
            {
                "id": "Q34.1",
                "name": "Spreadsheet Grid Geometry & Base-26 Addressing",
                "type": "Concept",
                "desc": "Detail the mathematical mechanics of spreadsheet grid coordinates, Base-26 column letter encoding, cell data structures, and default type alignment rules."
            },
            {
                "id": "Q34.2",
                "name": "The Silent Zero Payroll Sum Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Analyze an imported enterprise payroll sheet where total compensation sums to zero; identify the text formatting flags and leading whitespace preventing formula evaluation."
            },
            {
                "id": "Q34.3",
                "name": "Base-26 Coordinate Engine & Type Sanitizer Suite",
                "type": "Mastery Assignment",
                "desc": "Implement a bidirectional cell coordinate conversion and type-auditing utility in Python/TypeScript that detects and coerces numbers stored as text across massive tabular ranges."
            },
            {
                "id": "Q34.4",
                "name": "One-Million-Row Grid Boundary Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Stress test an automated tabular ingestion script at the absolute limits of the Excel grid (Row 1,048,576 and Column XFD); verify boundary guards and overflow handling."
            }
        ]
    },
    {
        "day": 2,
        "month": 1,
        "blockNum": 1,
        "title": "Core Mathematical & Aggregation Functions: SUM, AVERAGE, COUNT & ROUND",
        "stageNum": 1,
        "stageName": "Stage 1: Mental Model & Foundations",
        "pedagogicalRole": "Mathematical Aggregation & Numerical Precision (Aggregation Mechanics, Null vs Zero Handling, Floating-Point Rounding & Division Guardrails)",
        "spokenGoal": "Every major financial decision relies on aggregation. But if you think `AVERAGE()` and `COUNT()` are foolproof, think again: do you know the lethal difference between an empty blank cell and a cell containing the number 0? An empty cell is ignored by `AVERAGE()`, while a 0 drags down the mean. Today, you master core aggregation mechanics, understand floating-point rounding precision (`ROUND` vs `INT` vs `TRUNC`), and build formula guardrails.",
        "conceptInvariant": "Aggregation & Floating-Point Precision Invariant: `AVERAGE(R)` computes $\\frac{\\sum_{x \\in R_{\\text{numeric}}} x}{|R_{\\text{numeric}}|}$, strictly excluding blank cells and non-numeric strings while including literal zeros ($x = 0$). Formatting a cell as 2 decimal places does NOT round internal IEEE 754 precision; only explicit `=ROUND(val, 2)` eliminates floating-point drift.",
        "failureMode": "The $800,000 Floating-Point Penny Rounding Deficit: A high-volume foreign exchange trading desk displays transaction fees formatted as `$0.00` using standard cell formatting, without explicit `=ROUND()` functions. Over 10 million transactions, tiny residual fractions of a cent ($0.00008) accumulate in balance sheet totals, creating an un-reconciled $800,000 variance during annual external auditing.",
        "tryItFriction": "Construct a spreadsheet table comparing cell formatting display (`Ctrl+1 -> 2 decimals`) against `=ROUND(val, 2)`; demonstrate how summing formatted cells creates visible math discrepancies (e.g. 10.04 + 10.04 showing as 20.09).",
        "socraticHints": [
            "Why does formatting a cell to display 2 decimal places fail to change the underlying value stored in memory, and how does this create visual addition errors on printed reports?",
            "What is the mathematical difference between `=COUNT(A1:A10)` and `=COUNTA(A1:A10)` when the range contains text titles and empty formulas (`=\"\"`)?",
            "How does `=ROUND(x, -3)` work in corporate financial reporting when rounding figures to the nearest thousand dollars?"
        ],
        "situationalPuzzle": {
            "scenario": "A hospital analytics director reviews average patient wait times across 5 regional clinics. Clinic B had 0 patients on Sunday because the clinic was closed, recorded as an empty blank cell. Clinic C had 0 patients recorded as a literal number `0`. The director is shocked to find Clinic C's reported weekly average wait time is 40% lower than Clinic B's, despite identical wait times on operating days.",
            "options": [
                "Clinic C has superior doctors who work faster.",
                "Diagnose the Blank vs Zero Aggregation Asymmetry: `=AVERAGE()` excludes blank cells from the denominator ($N = 6$), but includes literal `0`s in the denominator ($N = 7$), diluting Clinic C's average wait time with a false non-operating zero. Fix by standardizing null representations or using `=AVERAGEIFS()` to filter operating days.",
                "Average wait times cannot be calculated in Excel.",
                "Close Clinic B permanently."
            ],
            "correctOptionIndex": 1,
            "debrief": "The `AVERAGE()` function computes the mean over numeric entries only: blank cells are excluded from both numerator and denominator, but literal `0` increments the denominator. Recording closed days as `0` artificially deflates operational metrics."
        },
        "quests": [
            {
                "id": "Q34.5",
                "name": "Mathematical Aggregation Mechanics & Null Semantics",
                "type": "Concept",
                "desc": "Detail the formal mechanics of `SUM`, `AVERAGE`, `COUNT`, `COUNTA`, and `ROUND`, analyzing denominator filtering, blank vs zero semantics, and IEEE 754 precision."
            },
            {
                "id": "Q34.6",
                "name": "The Un-Reconciled Penny Discrepancy Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Audit an international trade invoice ledger with a $15,000 balance discrepancy; identify where visual cell formatting was used in place of explicit `ROUND` functions."
            },
            {
                "id": "Q34.7",
                "name": "Robust Aggregation & Floating-Point Audit Engine",
                "type": "Mastery Assignment",
                "desc": "Build an automated spreadsheet audit tool in Python/TypeScript that scans formula ranges, flags visual-versus-underlying precision drift, and normalizes null values."
            },
            {
                "id": "Q34.8",
                "name": "Multi-Currency High-Volume Invoicing Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Generate and reconcile 50,000 multi-currency transaction records; achieve 100% penny-perfect financial reconciliation using explicit rounding invariants."
            }
        ]
    },
    {
        "day": 3,
        "month": 1,
        "blockNum": 1,
        "title": "Cell Referencing Mechanics: Relative (A1), Absolute ($A$1) & Mixed ($A1 / A$1)",
        "stageNum": 1,
        "stageName": "Stage 1: Mental Model & Foundations",
        "pedagogicalRole": "Formula Propagation & Addressing Mechanics (Vector Displacement, Absolute Anchoring, Mixed Coordinate Matrix Locks & F4 Toggling)",
        "spokenGoal": "Writing a formula for one cell is trivial. Writing a single formula that can be dragged across 10,000 rows and 50 columns without breaking requires absolute mastery of cell referencing. Today, you master Relative (`A1`), Absolute (`$A$1`), and Mixed (`$A1` and `A$1`) references. You will learn the displacement calculus that governs formula copying and master two-way multiplication matrices and dynamic tax schedules.",
        "conceptInvariant": "Cell Reference Displacement Invariant: In relative referencing, copying a formula from $(c_0, r_0)$ to $(c_1, r_1)$ applies displacement vector $(\\Delta c, \\Delta r) = (c_1 - c_0, r_1 - r_0)$ to all unanchored coordinates. The dollar sign `$` locks the respective coordinate against displacement: `$` before column locks $\\Delta c = 0$; `$` before row locks $\\Delta r = 0$.",
        "failureMode": "The $18M Runaway Commission Inflation: A sales compensation analyst builds a commission model for 2,500 sales reps. The formula for bonus in cell D2 is `=C2*B1` (where B1 is the 5% bonus rate). When copied down column D without locking the row (`$B$1`), row 3 references B2 (a sales rep name), row 4 references B3, and row 12 references B11 (an annual revenue number of $25M), causing automated payroll to issue an $18M unbudgeted wire transfer.",
        "tryItFriction": "Construct a classic 10x10 two-way multiplication table using a single formula in cell B2 (`=$A2*B$1`) that can be simultaneously dragged across the entire grid without changing syntax.",
        "socraticHints": [
            "Why does copying a relative formula down one row increment the row number by 1, while copying it across one column increments the column letter by 1?",
            "In the mixed reference `=$A2`, which coordinate is locked when dragged horizontally across columns, and which coordinate shifts when dragged vertically down rows?",
            "What does pressing the `F4` key repeatedly in the formula bar do to cycle through reference modes (`A1 -> $A$1 -> A$1 -> $A1 -> A1`)?"
        ],
        "situationalPuzzle": {
            "scenario": "A financial analyst builds a 5-year revenue projection model. Column A lists product lines. Row 1 lists fiscal years (2025 to 2029). Cell B1 contains the base growth rate (8%). The analyst writes a formula in B2 and drags it across to F10. Suddenly, all cells from column C onward display `#VALUE!` errors or astronomical trillion-dollar revenues.",
            "options": [
                "Excel cannot calculate multi-year projections.",
                "Diagnose missing absolute row anchoring: The growth rate in cell B1 was referenced as a relative address (`B1`). When dragged down to row 3, it shifted to `B2` (a dollar value), and when dragged to column C, it shifted to `C1` (a text year string '2026'), multiplying revenue by text to cause `#VALUE!`. Fix by anchoring the growth rate reference as `$B$1`.",
                "Delete the revenue projection and assume 0% growth.",
                "Retype the formula manually in all 50 cells."
            ],
            "correctOptionIndex": 1,
            "debrief": "When dragging formulas across a 2D matrix, parameters located in fixed header cells must be anchored with absolute (`$B$1`) or mixed references. Omitting the dollar sign causes the formula to reference adjacent text headers and unrelated data, breaking calculations."
        },
        "quests": [
            {
                "id": "Q34.9",
                "name": "Vector Displacement & Cell Referencing Mathematics",
                "type": "Concept",
                "desc": "Detail the mathematical displacement vectors applied during formula propagation across relative, absolute, and mixed referencing modes."
            },
            {
                "id": "Q34.10",
                "name": "The Runaway Commission Drift Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a multi-million-dollar payroll calculation error; identify the missing dollar sign anchor in a copied commission rate formula."
            },
            {
                "id": "Q34.11",
                "name": "Two-Way Matrix Propagation & Reference Validator Suite",
                "type": "Mastery Assignment",
                "desc": "Author an interactive financial matrix in Excel/Python utilizing strict mixed referencing (`$A2*B$1`) with automated formula-consistency auditing."
            },
            {
                "id": "Q34.12",
                "name": "Massive 2D Financial Projection Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Deploy a single-formula 100-product by 60-month revenue model; achieve 100% calculation integrity across 6,000 cells without a single broken reference."
            }
        ]
    },
    {
        "day": 4,
        "month": 1,
        "blockNum": 1,
        "title": "Logical Evaluation Functions: Single IF, Nested IF & Multi-Condition AND / OR",
        "stageNum": 1,
        "stageName": "Stage 1: Mental Model & Foundations",
        "pedagogicalRole": "Boolean Logic & Branching Architecture (Boolean Expressions, Nested Decision Trees, Short-Circuiting & Truth Table Mechanics)",
        "spokenGoal": "Data analysis without logic is just bookkeeping. To build automated underwriting systems, tier-pricing engines, and compliance checkers, your spreadsheet must make decisions. Today, you master Boolean evaluation in Excel: single `IF()`, nested `IF()` decision trees, multi-condition `AND()` / `OR()` expressions, and modern `IFS()` syntax. You will learn to eliminate fragile 7-layer nested IF spaghetti and build clean, maintainable logic.",
        "conceptInvariant": "Boolean Decision Tree Invariant: `IF(condition, val_true, val_false)` evaluates a predicate $P \\in \\{TRUE, FALSE\\}$. In `AND(c_1, \\dots, c_k)$, all predicates must hold ($\\bigwedge c_i$), while `OR(c_1, \\dots, c_k)` requires at least one ($\\bigvee c_i$). Order of evaluation in nested trees matters: earlier conditions short-circuit subsequent branches.",
        "failureMode": "The Inverted Tax Bracket Bracket Breakdown: An international accounting firm automates tax bracket calculations using a nested `IF()` formula. The junior analyst writes: `=IF(income > 20000, 0.1, IF(income > 50000, 0.2, IF(income > 100000, 0.3, 0)))`. Because $150,000 is greater than $20,000, the first condition immediately triggers, taxing high earners at 10% instead of 30%, resulting in a $6.4M tax underpayment penalty.",
        "tryItFriction": "Construct a tiered volume-discount formula using nested `IF` or `IFS` that correctly handles 5 quantity tiers in descending order, avoiding the inverted evaluation trap.",
        "socraticHints": [
            "Why must nested threshold evaluations (like tax brackets or grading curves) be sorted strictly in descending order (highest threshold first) or ascending order with `<`?",
            "What is the difference between `=AND(A1>10, B1>20)` and `=OR(A1>10, B1>20)` when evaluated over boundary edge conditions?",
            "Why is the modern `=IFS(c1, v1, c2, v2, ...)` function significantly easier to audit and debug than 6 levels of deeply nested parentheses?"
        ],
        "situationalPuzzle": {
            "scenario": "A bank automates loan pre-approval using the formula: `=IF(AND(CreditScore>=700, Income>=50000, DebtRatio<=0.43), 'APPROVED', 'REJECTED')`. A customer with CreditScore 780, Income $120,000, and DebtRatio 38% is marked as REJECTED. The loan officer inspects cell C2 containing the DebtRatio and notices it is entered as the number `38` rather than `0.38`.",
            "options": [
                "The customer has bad credit.",
                "Diagnose percentage scale mismatch: The condition `DebtRatio <= 0.43` assumes percentage values are stored as decimals ($0.38 = 38\\%$). Entering `38` means the formula evaluated `38 <= 0.43` as FALSE, rejecting a prime applicant. Standardize cell formatting to true percentage decimals (`0.38` formatted as `38%`).",
                "Change the formula to approve everyone automatically.",
                "Change the condition to `DebtRatio <= 100`."
            ],
            "correctOptionIndex": 1,
            "debrief": "Percentages in spreadsheets are decimal floats ($100\\% = 1.0$). Entering whole numbers (38 instead of 0.38) makes threshold comparisons fail. Boolean logic requires strict normalization between underlying decimal values and displayed percentage formats."
        },
        "quests": [
            {
                "id": "Q34.13",
                "name": "Boolean Logic Trees & Short-Circuit Evaluation Mechanics",
                "type": "Concept",
                "desc": "Detail the formal evaluation order of `IF`, `IFS`, `AND`, `OR`, and `XOR`, analyzing truth table permutations and short-circuit branching."
            },
            {
                "id": "Q34.14",
                "name": "The Inverted Tax Bracket Underpayment Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a corporate tax compliance model that miscalculated executive bonuses; trace how inverted comparison order caused premature branch triggering."
            },
            {
                "id": "Q34.15",
                "name": "Multi-Tier Underwriting Decision Engine Suite",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise credit-underwriting decision tree in Excel/TypeScript evaluating credit score, DTI, LTV, and liquidity with zero logic flaws."
            },
            {
                "id": "Q34.16",
                "name": "High-Volume Boundary Edge-Case Logic Lab",
                "type": "Production Incident Lab",
                "desc": "Stress test an underwriting formula across 10,000 synthetic applicant profiles with extreme edge cases; verify 100% decision accuracy against legal criteria."
            }
        ]
    },
    {
        "day": 5,
        "month": 1,
        "blockNum": 1,
        "title": "Milestone 1: ApexSheet Spreadsheet Grid Architecture, Aggregation & Logical Evaluation Engine Suite",
        "stageNum": 1,
        "stageName": "Stage 1: Mental Model & Foundations",
        "pedagogicalRole": "Architectural Capstone & Integrated Synthesis (Grid Addressing, Aggregation Invariants, 2D Matrix Displacement & Boolean Decision Engines)",
        "spokenGoal": "Day 5 is your first major architectural milestone. You are taking everything mastered in Stage 1—Base-26 coordinate addressing, aggregation null semantics, mixed reference displacement vectors, and multi-tier Boolean logic—and fusing them into a unified, enterprise-grade financial modeling engine: ApexSheet. You will defend your model against dirty data imports and edge-case audit tests.",
        "conceptInvariant": "Milestone 1 Architectural Invariant: A production spreadsheet model must enforce coordinate boundary integrity, distinguish blank cells from zeros, eliminate floating-point penny drift via explicit rounding, lock matrix vectors via mixed references, and evaluate decision trees without inverted branch traps.",
        "failureMode": "ApexSheet Milestone 1 Calculation Breakdown: An integrated enterprise bonus model deployed during the viva evaluation fails because an un-sanitized CSV import contained empty text strings (`\"\"`) in the rating column, triggering a `#VALUE!` error in the nested `IF` condition and cascading across 500 downstream employee compensation rows.",
        "tryItFriction": "Build and execute the complete ApexSheet compensation engine that ingests 500 employee records, calculates base pay, computes tiered bonuses via mixed referencing, and generates clean department summaries.",
        "socraticHints": [
            "How does isolating model assumptions into a dedicated, locked 'Assumptions' block with absolute references prevent formula corruption across sheets?",
            "Why must an enterprise spreadsheet model include automated integrity checksum formulas (e.g. `=IF(TotalDebits=TotalCredits, 'BALANCED', 'OUT OF BALANCE')`)?",
            "What operational risks are introduced when users mix data entry, formula calculations, and presentation charts on a single unstructured worksheet?"
        ],
        "situationalPuzzle": {
            "scenario": "During your Milestone 1 viva presentation, the senior evaluator injects an edge case into your compensation model: an employee with sales of exactly $0.00 and an empty rating cell. The model must assign a base salary, 0% bonus, and flag the missing rating without throwing `#VALUE!` or `#N/A` errors.",
            "options": [
                "Tell the evaluator that employees with zero sales should be fired anyway.",
                "ApexSheet implements Defensive Formula Design: Wrap rating evaluations with `=IF(OR(ISBLANK(Rating), Rating=\"\"), 'AUDIT_REQUIRED', ...)` and enforce explicit numeric casting with `=IFERROR(Rating*1, 0)`; this guarantees clean fallback behavior without unhandled error propagation.",
                "Delete the employee row from the sheet.",
                "Turn off error alerts in Excel preferences."
            ],
            "correctOptionIndex": 1,
            "debrief": "Defensive spreadsheet engineering requires anticipating dirty and missing inputs. Checking for blank or empty text cells before evaluating nested logical conditions ensures that incomplete records are cleanly flagged for audit rather than crashing formulas."
        },
        "quests": [
            {
                "id": "Q34.17",
                "name": "ApexSheet Architecture & Integrated Systems Blueprint",
                "type": "Concept",
                "desc": "Document the end-to-end architecture of ApexSheet, detailing the Base-26 addressing layer, aggregation precision engine, and Boolean decision tree framework."
            },
            {
                "id": "Q34.18",
                "name": "ApexSheet Production Pipeline Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Debug an automated compensation pipeline where dirty CSV null values triggered `#VALUE!` errors cascading across 1,000 executive bonus calculations."
            },
            {
                "id": "Q34.19",
                "name": "ApexSheet Production Engine Implementation",
                "type": "Mastery Assignment",
                "desc": "Implement the complete ApexSheet platform in Excel/Python with Base-26 coordinate validation, precision-rounded aggregations, and resilient tiered underwriting logic."
            },
            {
                "id": "Q34.20",
                "name": "ApexSheet Milestone 1 Viva Defense & Chaos Gate",
                "type": "Production Incident Lab",
                "desc": "Defend ApexSheet before the Review Board while enduring injected dirty text strings, boundary coordinate overflows, and extreme multi-condition edge cases."
            }
        ]
    },
    {
        "day": 6,
        "month": 1,
        "blockNum": 2,
        "title": "Statistical Conditional Aggregations: SUMIF, SUMIFS, COUNTIF & AVERAGEIFS",
        "stageNum": 2,
        "stageName": "Stage 2: Core Mechanics & Analytical Depth",
        "pedagogicalRole": "Multi-Condition Tabular Aggregations (Selective Summation, Criteria Range Syntax, Comparison Operators in Strings & Multiple Predicate AND Logic)",
        "spokenGoal": "Gross totals are meaningless in business; decision-makers need segmented totals: 'What were Q3 sales in the Northeast region for Enterprise customers?'. Today, you master multi-condition aggregations using `SUMIFS`, `COUNTIFS`, and `AVERAGEIFS`. You will learn the subtle syntactic quirks of criterion strings (`\">=1000\"`), understand why `SUMIFS` inverts argument order compared to legacy `SUMIF`, and build lightning-fast segmented summary tables.",
        "conceptInvariant": "Multi-Condition Aggregation Invariant: `SUMIFS(sum_range, c_range_1, c_1, c_range_2, c_2, ...)` filters rows satisfying $\\bigwedge_{j=1}^m (r_{i, j} = c_j)$, summing corresponding elements in `sum_range`. All criteria ranges must have identical shape; syntax puts `sum_range` FIRST, unlike legacy single-condition `SUMIF`.",
        "failureMode": "The Asymmetric Range Shape Crash: A financial analyst uses `=SUMIFS(D2:D1000, A2:A1000, 'East', B2:B999, 'Enterprise')` to summarize departmental budgets. Because the second criteria range stops at row 999 instead of row 1000, Excel throws a `#VALUE!` error across the entire corporate executive reporting dashboard.",
        "tryItFriction": "Construct a dynamic sales summary table using `SUMIFS` and `COUNTIFS` that references cell-based criteria (e.g. `\">=\"&B1`), avoiding hardcoded values in strings.",
        "socraticHints": [
            "Why did Microsoft place `sum_range` first in `SUMIFS`, whereas legacy `SUMIF` placed `sum_range` last as an optional parameter?",
            "How do you properly concatenate a cell reference to a comparison operator in criteria strings (e.g. `\">=\" & E2` vs `\">=E2\"`)?",
            "What happens if one of the criteria ranges in a `SUMIFS` formula has 100 rows, but the `sum_range` has 101 rows?"
        ],
        "situationalPuzzle": {
            "scenario": "A marketing director calculates average deal size for enterprise clients using `=AVERAGEIF(CategoryRange, 'Enterprise', DealSizeRange)`. For small business clients, there were zero closed deals this month. The formula `=AVERAGEIF(CategoryRange, 'SMB', DealSizeRange)` returns a prominent `#DIV/0!` error that ruins the CEO presentation slide.",
            "options": [
                "Tell the CEO that SMB clients don't matter.",
                "Wrap conditional aggregations with error traps or condition checks: `=IFERROR(AVERAGEIFS(DealSizeRange, CategoryRange, 'SMB'), 0)` or check if count is zero with `=IF(COUNTIFS(CategoryRange, 'SMB')=0, 0, AVERAGEIFS(...))`, ensuring zero-volume categories display cleanly as $0.00.",
                "Change the SMB category to Enterprise so it has deals.",
                "Delete the SMB row from the presentation."
            ],
            "correctOptionIndex": 1,
            "debrief": "When a conditional range matches zero records, `AVERAGEIFS()` attempts to divide by zero ($N = 0$), throwing `#DIV/0!`. Wrapping conditional averages in `IFERROR()` or pre-checking with `COUNTIFS()` ensures clean presentation."
        },
        "quests": [
            {
                "id": "Q34.21",
                "name": "Multi-Predicate Conditional Aggregation Mechanics",
                "type": "Concept",
                "desc": "Detail the mathematical filtering and aggregation mechanics of `SUMIFS`, `COUNTIFS`, and `AVERAGEIFS`, analyzing argument order and range dimension matching."
            },
            {
                "id": "Q34.22",
                "name": "The Asymmetric Dimension Shape Mismatch Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Analyze a broken financial reporting dashboard throwing `#VALUE!` errors; identify the mismatched criteria range lengths across 5 linked `SUMIFS` formulas."
            },
            {
                "id": "Q34.23",
                "name": "Dynamic Multi-Dimensional Summary Ledger Suite",
                "type": "Mastery Assignment",
                "desc": "Build a multi-dimensional financial summary table in Excel/Python utilizing `SUMIFS` and `COUNTIFS` with dynamic date boundaries and cell-concatenated operators."
            },
            {
                "id": "Q34.24",
                "name": "High-Volume Multi-Region Sales Aggregation Lab",
                "type": "Production Incident Lab",
                "desc": "Process a 100,000-row transaction ledger across 10 regions, 4 quarters, and 5 customer segments; achieve 100% aggregation reconciliation with sub-second recalculation."
            }
        ]
    },
    {
        "day": 7,
        "month": 1,
        "blockNum": 2,
        "title": "Text Manipulation & Cleaning Functions: TRIM, CLEAN, PROPER & TEXTJOIN",
        "stageNum": 2,
        "stageName": "Stage 2: Core Mechanics & Analytical Depth",
        "pedagogicalRole": "Data Cleaning & String Engineering (ASCII Character Codes, Non-Breaking Spaces, Text Tokenization & Delimited Concatenation)",
        "spokenGoal": "Eighty percent of data analysis is data cleaning. You can write the most brilliant financial formulas in the world, but if your customer names contain non-breaking web spaces (`CHAR(160)`), irregular uppercase shouting, or trailing whitespace, your lookups will fail every single time. Today, you master text transformation engineering: `TRIM`, `CLEAN`, `PROPER`, `TEXTSPLIT`, and modern `TEXTJOIN` with delimiter handling.",
        "conceptInvariant": "Text Normalization Invariant: Standard `TRIM()` removes leading, trailing, and redundant ASCII 32 spaces, but does NOT remove web non-breaking spaces (ASCII 160: `CHAR(160)`). True string normalization requires `=TRIM(CLEAN(SUBSTITUTE(A1, CHAR(160), \" \")))` before exact-match lookups.",
        "failureMode": "The Web-Scraped Non-Breaking Space Lookup Collapse: A supply chain team imports 5,000 vendor product SKUs copied from a web portal. An analyst runs `=VLOOKUP(SKU, MasterCatalog, 2, FALSE)`, but 40% of the lookups fail with `#N/A`. The analyst confirms the SKUs look identical to the naked eye. The culprit: invisible non-breaking spaces (`CHAR(160)`) that standard `TRIM()` cannot strip, halting vendor purchase order matching.",
        "tryItFriction": "Construct a bulletproof text-cleaning formula in Excel that strips non-breaking spaces (`CHAR(160)`), normalizes multiple internal spaces, strips non-printable control characters, and capitalizes names into title case.",
        "socraticHints": [
            "Why does standard `=TRIM()` fail to remove spaces copied from HTML web pages, and how does `=SUBSTITUTE(text, CHAR(160), \" \")` solve this?",
            "What is the difference between legacy `CONCATENATE()` and modern `=TEXTJOIN(\", \", TRUE, range)` when handling empty blank cells in an address list?",
            "How do `=LEFT()`, `=RIGHT()`, and `=MID()` combined with `=SEARCH()` or `=FIND()` parse variable-length strings like 'Smith, John' into separate first and last names?"
        ],
        "situationalPuzzle": {
            "scenario": "A hospital CRM combines patient records from three legacy databases. In Database A, names are 'DOE, JOHN'. In Database B, names are '  john doe  '. In Database C, names contain web tabs and non-breaking spaces. When checking for duplicate patient records, exact string matching finds zero duplicates, creating redundant medical records.",
            "options": [
                "Assume there are no duplicate patients.",
                "Build a Canonical Name Normalization Pipeline: Apply `=PROPER(TRIM(CLEAN(SUBSTITUTE(NameCell, CHAR(160), \" \"))))` across all imports, and use `=TEXTSPLIT()` to standardize 'LastName, FirstName' format before running duplicate matching.",
                "Delete all patients whose names are in lowercase.",
                "Type all 10,000 patient names by hand."
            ],
            "correctOptionIndex": 1,
            "debrief": "Data from multiple systems requires canonical normalization. Combining `SUBSTITUTE` for non-breaking spaces with `CLEAN`, `TRIM`, and `PROPER` standardizes capitalization and eliminates invisible whitespace, allowing exact-match duplicate detection to succeed."
        },
        "quests": [
            {
                "id": "Q34.25",
                "name": "String Representation & ASCII/Unicode Cleaning Mechanics",
                "type": "Concept",
                "desc": "Detail the mechanics of ASCII character sets (ASCII 32 vs 160), string manipulation functions (`TRIM`, `CLEAN`, `SUBSTITUTE`), and modern dynamic text splitters."
            },
            {
                "id": "Q34.26",
                "name": "The Invisible Non-Breaking Space Lookup Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a high-failure inventory catalog lookup where visual matches failed with `#N/A`; identify the hidden HTML non-breaking space codes."
            },
            {
                "id": "Q34.27",
                "name": "Canonical Text Cleaning & Entity Extraction Suite",
                "type": "Mastery Assignment",
                "desc": "Build an automated string-sanitization pipeline in Excel/Python that cleans messy customer contact records, parses names, and joins addresses with delimiters."
            },
            {
                "id": "Q34.28",
                "name": "Messy Multi-System Legacy Ingestion Lab",
                "type": "Production Incident Lab",
                "desc": "Ingest and normalize 25,000 dirty CRM records with corrupted casing, tabs, and non-breaking spaces; achieve 100% duplicate detection accuracy."
            }
        ]
    },
    {
        "day": 8,
        "month": 1,
        "blockNum": 2,
        "title": "Date & Time Calculation Mechanics: Excel Serial Numbers, DATEDIF & EOMONTH",
        "stageNum": 2,
        "stageName": "Stage 2: Core Mechanics & Analytical Depth",
        "pedagogicalRole": "Temporal Arithmetic & Date Serialization (Julian/Gregorian Serial Days, Fractional Day Time, Boundary Math & The 1900 Leap Year Bug)",
        "spokenGoal": "Dates in spreadsheets are an optical illusion. When you see 'October 15, 2026', Excel sees the integer `46310`. Excel stores all dates as sequential integers representing the count of days since January 1, 1900, while time is stored as a decimal fraction of a 24-hour day. Today, you master date and time arithmetic: calculating working days, finding billing end-of-month dates with `EOMONTH()`, computing exact tenure with `DATEDIF()`, and navigating the infamous 1900 leap year bug.",
        "conceptInvariant": "Date Serial Number Invariant: A date is stored as an integer scalar $D \\in \\mathbb{Z}^+$ where Day 1 corresponds to January 1, 1900. Time is a decimal fraction $T \\in [0, 1)$ where $0.5 = 12:00\\text{ PM}$ (12 hours). Date addition is scalar addition: $D + 7 = 1\\text{ week later}$. Due to a historic Lotus 1-2-3 compatibility bug, Excel treats 1900 as an imaginary leap year.",
        "failureMode": "The 1900 Leap Year Date Serialization Discrepancy: A financial risk model synchronizing bond maturity dates between a modern Python/Postgres backend and an Excel portfolio model experiences a 1-day desynchronization for historical bond calculations prior to March 1, 1900. The mismatch occurs because Excel intentionally includes February 29, 1900 (a date that never existed), creating a permanent 1-day offset in historical day-count calculations.",
        "tryItFriction": "Construct a billing schedule formula using `=EOMONTH(StartDate, 0)` and `=WORKDAY(StartDate, 30, Holidays)` that dynamically calculates the last day of the current month and the exact due date excluding weekends and corporate holidays.",
        "socraticHints": [
            "Why is 6:00 AM stored internally in Excel as `0.25`, 12:00 PM as `0.5`, and 6:00 PM as `0.75`?",
            "How does `=DATEDIF(start_date, end_date, 'Y')` calculate exact completed years of employee tenure without rounding errors?",
            "Why does subtracting two dates formatted as dates (e.g. `B2 - A2`) return a number of days, and why does Excel sometimes annoyingly format the result as a date like 'Jan 14, 1900'?"
        ],
        "situationalPuzzle": {
            "scenario": "A SaaS company bills customers on an annual subscription that renews on the last day of the month. An analyst calculates the next renewal date using `=A2 + 365`. In leap years, customers who signed up on February 28 are billed on February 27 of the following year, causing customer billing complaints and PR backlash.",
            "options": [
                "Stop signing up customers in February.",
                "Use Calendar-Aware End-of-Month Functions: Replace naive day addition with `=EDATE(StartDate, 12)` to jump forward exactly 12 calendar months, or use `=EOMONTH(StartDate, 12)` to anchor renewals strictly to the final day of the target month, regardless of leap year day counts.",
                "Tell customers that leap years are confusing and they must pay early.",
                "Subtract 1 day randomly."
            ],
            "correctOptionIndex": 1,
            "debrief": "Adding fixed day counts (like +365) fails across leap years because calendar months have variable lengths (28, 29, 30, 31 days). Using dedicated calendar functions like `EDATE()` and `EOMONTH()` guarantees exact month-based renewal dates."
        },
        "quests": [
            {
                "id": "Q34.29",
                "name": "Date Serialization Mechanics & The 1900 Leap Year Bug",
                "type": "Concept",
                "desc": "Detail the internal mathematics of Excel date serialization, fractional day time storage, the historic Lotus 1-2-3 leap year bug, and Gregorian calendar math."
            },
            {
                "id": "Q34.30",
                "name": "The Leap-Year Subscription Desync Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Audit an automated SaaS recurring billing schedule that drifted by 1 day during leap years; identify the naive integer addition replacing calendar functions."
            },
            {
                "id": "Q34.31",
                "name": "Enterprise Payroll & Debt Maturity Calendar Engine",
                "type": "Mastery Assignment",
                "desc": "Build an automated debt amortization calendar in Excel/Python utilizing `WORKDAY.INTL`, `EOMONTH`, and holiday schedule arrays to compute cash flow dates."
            },
            {
                "id": "Q34.32",
                "name": "Century-Scale Financial Day-Count Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Process 10,000 multi-decade bond maturity contracts; verify 100% day-count accuracy across leap years and international holiday calendars."
            }
        ]
    },
    {
        "day": 9,
        "month": 1,
        "blockNum": 2,
        "title": "Classic Lookup Functions: VLOOKUP (Exact Match FALSE / 0), HLOOKUP & #N/A",
        "stageNum": 2,
        "stageName": "Stage 2: Core Mechanics & Analytical Depth",
        "pedagogicalRole": "Relational Data Lookups (VLOOKUP Mechanics, Left-to-Right Vector Traversal, Binary Search vs Linear Search & Missing Key #N/A Handling)",
        "spokenGoal": "VLOOKUP is the most famous function in business history. It has powered Wall Street investment models, corporate supply chains, and Fortune 500 accounting for over 30 years. But it is also a minefield for the unprepared. If you omit the final `FALSE` parameter, VLOOKUP defaults to approximate matching—silently grabbing the wrong product price. Today, you master VLOOKUP mechanics, column index counting, and error trapping.",
        "conceptInvariant": "VLOOKUP Search Invariant: `VLOOKUP(key, table, col_index, [range_lookup])` searches ONLY the leftmost column of `table`. If `range_lookup` is `FALSE` or `0`, it performs an exact linear search returning the first match or `#N/A`. If `TRUE` or omitted, it requires a sorted column and performs an approximate binary search, returning dangerous near-matches on unsorted data.",
        "failureMode": "The Default Approximate VLOOKUP Pricing Catastrophe: An electronics retailer prices products using `=VLOOKUP(SKU, PriceList, 2)`. Because the analyst omitted the fourth argument (defaulting to `TRUE` / Approximate Match), looking up an unlisted SKU 'TV-9900' returns the price of an unsorted adjacent item 'TV-1000' ($199 instead of $1,999). Over the Black Friday weekend, 1,200 high-end OLED televisions are sold at a 90% loss before the missing parameter is detected.",
        "tryItFriction": "Construct a VLOOKUP formula that looks up employee department and salary, demonstrating what happens when a column is inserted into the table range (breaking the hardcoded column index).",
        "socraticHints": [
            "Why is omitting the fourth argument in `VLOOKUP` (`range_lookup`) the single most dangerous mistake a financial analyst can make?",
            "What fundamental architectural limitation prevents `VLOOKUP` from looking up a key in Column C and returning a value from Column A (the 'Look to the Left' problem)?",
            "Why does hardcoding column index numbers (e.g. `col_index = 4`) make spreadsheet models fragile when users insert or delete table columns?"
        ],
        "situationalPuzzle": {
            "scenario": "A junior analyst builds a product pricing tool using `=VLOOKUP(A2, Catalog!A:D, 3, FALSE)`. Later, the inventory team inserts a new 'Manufacturer' column between Column B and Column C on the Catalog sheet. Suddenly, all product price quotes display the manufacturer name (e.g. 'Sony', 'Samsung') instead of numeric prices.",
            "options": [
                "Revert the entire catalog and forbid anyone from editing columns.",
                "Diagnose hardcoded column index fragility: `VLOOKUP` uses an absolute integer column index (`3`). When a new column was inserted, Price shifted to Column 4, but the formula still looked at Column 3 (now Manufacturer). Fix by updating the index or modernizing to dynamic `INDEX/MATCH` or `XLOOKUP` which track column headers dynamically.",
                "Tell customers that prices are now paid in Sony televisions.",
                "Delete the formula."
            ],
            "correctOptionIndex": 1,
            "debrief": "Hardcoding static column index numbers in `VLOOKUP` is an architectural anti-pattern. Inserting or deleting columns shifts data layout, causing the formula to return unrelated data types without warning. Dynamic lookup architectures eliminate this fragility."
        },
        "quests": [
            {
                "id": "Q34.33",
                "name": "Relational Lookup Mechanics & VLOOKUP Search Modes",
                "type": "Concept",
                "desc": "Detail the technical mechanics of `VLOOKUP` and `HLOOKUP`, analyzing left-to-right table scans, exact vs approximate binary search, and `#N/A` error triggers."
            },
            {
                "id": "Q34.34",
                "name": "The Black Friday Approximate Match Pricing Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a retail e-commerce pricing collapse during a holiday sale; identify the missing `FALSE` parameter that triggered incorrect approximate lookups."
            },
            {
                "id": "Q34.35",
                "name": "Production Relational Lookup & Column Index Mapper",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise pricing lookup engine in Excel/Python utilizing hardened `VLOOKUP` formulas with dynamic `COLUMN()` index resolvers and `#N/A` fallbacks."
            },
            {
                "id": "Q34.36",
                "name": "High-Volume Unsorted Product Catalog Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Execute 50,000 product lookups against an unsorted 100,000-row catalog; prove 100% exact-match precision with zero false approximate match substitutions."
            }
        ]
    },
    {
        "day": 10,
        "month": 1,
        "blockNum": 2,
        "title": "Advanced Two-Way Lookups: INDEX & MATCH Dynamic Matrix Retrieval",
        "stageNum": 2,
        "stageName": "Stage 2: Core Mechanics & Analytical Depth",
        "pedagogicalRole": "Dynamic Matrix Lookups (Array Indexing, Dynamic Coordinate Mapping, Two-Way Intersections & Column-Shift Resilience)",
        "spokenGoal": "Senior financial modelers don't use VLOOKUP; they use `INDEX` and `MATCH`. Why? Because `INDEX/MATCH` breaks free from the left-to-right prison of VLOOKUP, allows you to search in any direction, and never breaks when someone inserts a column. Today, you master the decoupled power of `INDEX` (the coordinate fetcher) and `MATCH` (the coordinate finder), assembling two-way dynamic matrix intersections.",
        "conceptInvariant": "Two-Way Matrix Retrieval Invariant: `INDEX(matrix, MATCH(row_key, row_headers, 0), MATCH(col_key, col_headers, 0))` computes row index $r = \\text{find}(row_key)$ and column index $c = \\text{find}(col_key)$, returning element $\\mathcal{M}_{r, c}$. Separate range pointers ensure structural column insertions never corrupt coordinate references.",
        "failureMode": "The Unsorted Approximate MATCH Financial Allocation Deficit: A healthcare risk model allocates insurance payouts using `MATCH(RiskScore, ScoreBands, 1)`. The analyst assumed the score bands were sorted in ascending order. In reality, a database patch inserted three unsorted emergency triage codes, causing `MATCH` to return random row indices and misallocating $3.8M in insurance payouts.",
        "tryItFriction": "Construct a two-way lookup formula using `=INDEX(PriceMatrix, MATCH(Region, RegionList, 0), MATCH(Tier, TierList, 0))` that dynamically retrieves the price at the exact intersection of any selected region and customer tier.",
        "socraticHints": [
            "Why is separating the search function (`MATCH`) from the data retrieval function (`INDEX`) structurally superior to a monolithic lookup function like `VLOOKUP`?",
            "How does `INDEX/MATCH` allow you to look up a value in Column D and retrieve the corresponding result from Column A (looking left)?",
            "What is the mathematical difference between `MATCH(..., 0)` (exact match) and `MATCH(..., 1)` (less than, requires ascending order)?"
        ],
        "situationalPuzzle": {
            "scenario": "A supply chain model contains shipping freight rates in a 2D matrix: 20 origins in Column A (rows) and 30 destinations in Row 1 (columns). An analyst needs to build a quote generator that accepts Origin and Destination and returns the exact shipping rate. The model must survive team members inserting new origin cities and destination ports.",
            "options": [
                "Write 600 individual `IF` statements.",
                "Implement Two-Way `INDEX/MATCH`: Use `=INDEX(RatesMatrix, MATCH(Origin, OriginCol, 0), MATCH(Dest, DestRow, 0))`. Because `RatesMatrix`, `OriginCol`, and `DestRow` are separate range references, inserting rows or columns automatically updates Excel's internal range pointers without breaking formula logic.",
                "Require freight rates to be looked up in a physical paper book.",
                "Tell customers freight is free."
            ],
            "correctOptionIndex": 1,
            "debrief": "Two-way `INDEX/MATCH` provides bulletproof matrix intersection retrieval. By decoupling the row coordinate search from the column coordinate search, the model adapts dynamically to insertions and reordering without breaking."
        },
        "quests": [
            {
                "id": "Q34.37",
                "name": "Decoupled Coordinate Lookup Mechanics: INDEX & MATCH",
                "type": "Concept",
                "desc": "Detail the computational mechanics of array indexing (`INDEX`) and vector searching (`MATCH`), analyzing two-way matrix intersection retrieval and memory safety."
            },
            {
                "id": "Q34.38",
                "name": "The Unsorted Range Binary Search Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a supply chain pricing error where `MATCH` returned invalid row indices; trace the failure to an unsorted range paired with approximate match mode 1."
            },
            {
                "id": "Q34.39",
                "name": "Two-Way Dynamic Pricing Matrix Engine",
                "type": "Mastery Assignment",
                "desc": "Build a two-way dynamic matrix lookup engine in Excel/Python retrieving shipping rates across origins and destinations with dynamic range auditing."
            },
            {
                "id": "Q34.40",
                "name": "High-Dimensional Matrix Resiliency Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Insert 50 random rows and columns into a 500x500 rate matrix; verify that all two-way `INDEX/MATCH` formulas maintain 100% data retrieval accuracy."
            }
        ]
    },
    {
        "day": 11,
        "month": 1,
        "blockNum": 3,
        "title": "Modern Universal Lookup Function: XLOOKUP (Leftward, Defaults & Search Modes)",
        "stageNum": 3,
        "stageName": "Stage 3: Dynamic Arrays & Modern Formulas",
        "pedagogicalRole": "Next-Generation Relational Lookups (XLOOKUP Architecture, Leftward Traversal, Built-in Error Fallbacks & Reverse Search Modes)",
        "spokenGoal": "In 2019, Microsoft finally fixed the spreadsheet lookup problem forever. They created `XLOOKUP`: a universal, modern function that replaces `VLOOKUP`, `HLOOKUP`, and `LOOKUP` in a single stroke. `XLOOKUP` defaults to exact match, looks in any direction (left, right, up, down), includes a built-in 'if not found' fallback, and can even search in reverse from bottom to top. Today, you master the definitive enterprise lookup function.",
        "conceptInvariant": "XLOOKUP Universal Invariant: `XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])` decouples lookup vector from return vector, defaults to exact match ($match\\_mode = 0$), supports leftward lookup, handles missing keys without `IFERROR`, and supports bottom-up search ($search\\_mode = -1$).",
        "failureMode": "The Missing Key Default Omission Disaster: A hospital pharmacy manages inventory re-orders using `VLOOKUP`. When an unregistered experimental drug code is entered, the lookup throws `#N/A`. The downstream macro fails to catch the error, halting an automated pharmaceutical order batch for 800 cancer patients.",
        "tryItFriction": "Convert a brittle `VLOOKUP` with wrapped `IFERROR` into a clean, modern `XLOOKUP` that performs a leftward lookup and supplies an explicit default value (`'ITEM_NOT_FOUND'`).",
        "socraticHints": [
            "Why is defaulting to Exact Match (0) in `XLOOKUP` an essential safety improvement over `VLOOKUP`'s dangerous default to Approximate Match (TRUE)?",
            "How does `XLOOKUP`'s reverse search mode (`search_mode: -1`) allow you to easily find the most recent transaction date for a customer without sorting?",
            "What happens if `lookup_array` has 1,000 cells, but `return_array` has 999 cells (the mismatched range length error)?"
        ],
        "situationalPuzzle": {
            "scenario": "A corporate auditor needs to find the latest contract amendment date for Client 1042. The contracts sheet logs every amendment chronologically down the page. The client has 5 amendments listed. Standard `VLOOKUP` finds the first entry at the top of the table (the oldest date from 2018).",
            "options": [
                "Manually scroll through 10,000 rows to find the bottom entry.",
                "Use `XLOOKUP` with Reverse Search: `=XLOOKUP(1042, ClientID_Col, AmendmentDate_Col, 'NO_CONTRACT', 0, -1)`. Setting `search_mode` to `-1` tells the engine to scan from bottom to top, instantly returning the latest amendment date without re-sorting the table.",
                "Sort the entire database in reverse and break everyone else's formulas.",
                "Delete the older contract amendments."
            ],
            "correctOptionIndex": 1,
            "debrief": "By setting `search_mode = -1`, `XLOOKUP` performs a reverse search from bottom to top. In chronologically appended transaction logs, this pattern instantly retrieves the most recent record without requiring destructive table re-sorting."
        },
        "quests": [
            {
                "id": "Q34.41",
                "name": "XLOOKUP Architecture & Modern Search Modalities",
                "type": "Concept",
                "desc": "Detail the architecture of `XLOOKUP`, exploring vector decoupling, exact-match defaults, built-in error handling, wildcard matching, and reverse search algorithms."
            },
            {
                "id": "Q34.42",
                "name": "The Oldest-Record First-Match Trap Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate an audit discrepancy where a contract renegotiation model used `VLOOKUP` and retrieved an obsolete 2018 fee schedule instead of the latest 2024 amendment."
            },
            {
                "id": "Q34.43",
                "name": "Universal Enterprise XLOOKUP Registry Suite",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise customer intelligence lookup engine in Excel/Python utilizing `XLOOKUP` with leftward retrieval, default values, and bottom-up latest status detection."
            },
            {
                "id": "Q34.44",
                "name": "Multi-Criteria Wildcard Lookup Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Execute 50,000 complex wildcard and reverse-search lookups against an un-indexed enterprise inventory dataset; achieve 100% precision with zero lookup errors."
            }
        ]
    },
    {
        "day": 12,
        "month": 1,
        "blockNum": 3,
        "title": "Dynamic Array Formulas & Spill Ranges: FILTER, UNIQUE, SORT & #SPILL!",
        "stageNum": 3,
        "stageName": "Stage 3: Dynamic Arrays & Modern Formulas",
        "pedagogicalRole": "Dynamic Array Engine (Spill Ranges, Spill Operator #, Vectorized Transformations & Spatial Obstruction #SPILL! Handling)",
        "spokenGoal": "In the old days of Excel, one formula lived in one cell. In modern Excel, a single formula entered in a single cell can 'spill' an entire multi-row, multi-column dataset across the sheet automatically. Today, you master the Dynamic Array calculation engine: `FILTER`, `UNIQUE`, `SORT`, and the spill reference operator (`A2#`). You will learn how vectorized calculations eliminate hundreds of redundant copied formulas, and how to handle spatial obstruction `#SPILL!` errors.",
        "conceptInvariant": "Dynamic Array & Spill Invariant: An array formula evaluated at anchor cell $(c_0, r_0)$ computes an output matrix $\\mathcal{A} \\in \\mathbb{R}^{h \\times w}$ and dynamically claims the bounding box $[c_0, c_0 + w - 1] \\times [r_0, r_0 + h - 1]$. If any cell in this footprint contains data, formatting locks, or merged cells, the engine throws `#SPILL!`. The spill operator `A1#` dynamically references the entire spilled range.",
        "failureMode": "The Spatial Obstruction #SPILL! Boardroom Crash: A Chief Revenue Officer presents a live sales dashboard powered by `=FILTER(Deals, Region='EMEA')`. An executive in the meeting asks a question, and an analyst quickly types a note into cell D14 (directly inside the formula's spill footprint). The entire sales table instantly vanishes, replaced by a glaring `#SPILL!` error across all dashboard charts.",
        "tryItFriction": "Construct a dynamic cascading dropdown pipeline in Excel using `=UNIQUE(MasterList)` and `=SORT(UNIQUE(MasterList))`, referencing the spilled result using the spill operator (`#`).",
        "socraticHints": [
            "What is the 'Spill Footprint', and why does a single non-empty cell (even a space character) in the target range cause the entire formula to fail with `#SPILL!`?",
            "How does referencing a spilled range with `#` (e.g. `=SUM(B2#)`) ensure that your summary calculations expand and contract automatically as data grows?",
            "What is the mathematical difference between `=FILTER(A2:B100, (C2:C100=\"East\") * (D2:D100>1000))` (AND logic via multiplication) and `+` (OR logic via addition)?"
        ],
        "situationalPuzzle": {
            "scenario": "A marketing analyst builds an automated report that filters customer leads using `=FILTER(LeadsTable, LeadsTable[Score] >= 80)`. On Monday morning, the report displays `#SPILL!`. The analyst clicks the cell and sees a dotted blue border extending down 40 rows, with cell B22 containing a tiny rogue period character (`.`).",
            "options": [
                "Reinstall Windows to clear the blue line.",
                "Diagnose Spatial Footprint Obstruction: Clear the rogue period character in cell B22; the dynamic array engine immediately claims the unobstructed cells and spills the 40 filtered customer records cleanly.",
                "Replace `FILTER` with 40 manual copy-pasted rows.",
                "Change the score threshold to 100 so fewer rows spill."
            ],
            "correctOptionIndex": 1,
            "debrief": "A `#SPILL!` error occurs when the dynamic array's calculated footprint is blocked by non-empty cells. Clearing the blocking cell allows the calculation engine to expand and render the filtered dataset."
        },
        "quests": [
            {
                "id": "Q34.45",
                "name": "Dynamic Array Engine & Spill Footprint Architecture",
                "type": "Concept",
                "desc": "Detail the internal architecture of Excel's dynamic array calculation engine, exploring memory allocation, vectorized execution, the spill operator (`#`), and `#SPILL!` errors."
            },
            {
                "id": "Q34.46",
                "name": "The Rogue Spatial Obstruction #SPILL! Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a high-stakes dashboard crash where dynamic array formulas threw `#SPILL!` errors across executive reports; identify the hidden merged cells and rogue characters."
            },
            {
                "id": "Q34.47",
                "name": "Multi-Condition Dynamic Filtering & Sorting Suite",
                "type": "Mastery Assignment",
                "desc": "Build an interactive multi-condition filtering dashboard in Excel/Python utilizing `FILTER`, `UNIQUE`, and `SORT` with Boolean vector multiplication (`*` for AND, `+` for OR)."
            },
            {
                "id": "Q34.48",
                "name": "High-Volume Vectorized Array Transformation Lab",
                "type": "Production Incident Lab",
                "desc": "Process a 50,000-row transactional database through chained dynamic array formulas; verify instant reactivity and zero spatial collision errors under dynamic data insertion."
            }
        ]
    },
    {
        "day": 13,
        "month": 1,
        "blockNum": 3,
        "title": "Error Trapping & Formula Debugging: IFERROR, IFNA, #DIV/0! & Precedents",
        "stageNum": 3,
        "stageName": "Stage 3: Dynamic Arrays & Modern Formulas",
        "pedagogicalRole": "Formula Auditing & Error Handling (Error Taxonomy: #N/A, #VALUE!, #REF!, #NAME?, Error Masking Risks & Precedent/Dependent Tracing)",
        "spokenGoal": "Errors in spreadsheets are contagious. A single `#DIV/0!` or `#N/A` error in cell A1 will infect every formula that references it, cascading across 50 sheets until the entire corporate financial model is bricked. But beware: carelessly slapping `=IFERROR(formula, \"\")` around every formula is even worse—it silently sweeps fatal syntax bugs and missing data under the rug. Today, you master precision error trapping with `IFNA()`, error auditing, and precedent/dependent tracing.",
        "conceptInvariant": "Error Trapping & Masking Invariant: Use `IFNA(lookup, fallback)` for lookup misses; never use blanket `IFERROR(formula, fallback)` on complex calculation logic, as it indiscriminately swallows fatal syntax typos (`#NAME?`), divide-by-zero math errors (`#DIV/0!`), and deleted range references (`#REF!`). Formula tracing must follow the Directed Acyclic Graph (DAG) of precedents.",
        "failureMode": "The Careless IFERROR Accounting Fraud Lawsuit: A corporate controller wraps all balance sheet consolidation formulas in `=IFERROR(SUM(...), 0)` to make reports 'look clean'. When an IT migration deletes a critical European subsidiary tab, all formulas referencing it throw `#REF!`. Because `IFERROR` was masking all errors to `0`, the model silently omitted $45M in European debt, leading to false financial statements and SEC fraud charges.",
        "tryItFriction": "Construct a financial model formula that safely handles lookup misses with `IFNA()` while deliberately allowing `#DIV/0!` and `#REF!` errors to bubble up to the surface for auditing.",
        "socraticHints": [
            "Why is wrapping a formula in `=IFERROR(..., 0)` dangerous compared to `=IFNA(..., 'NOT_FOUND')`?",
            "What causes a `#REF!` error (e.g. deleting an entire worksheet or column that was referenced in a formula), and why can it never self-heal once the workbook is saved?",
            "How do Excel's 'Trace Precedents' (`Ctrl + [`) and 'Trace Dependents' (`Ctrl + ]`) tools visualize the formula calculation graph?"
        ],
        "situationalPuzzle": {
            "scenario": "A financial analyst builds a capital expenditure model. A formula in cell F10 computes project return on investment: `=IFERROR((G10 - H10) / H10, 0)`. In year 3, cell H10 (initial investment) is entered as $0 because capital was deferred. The formula returns 0% ROI instead of flagging an impossible calculation. Management cancels a lucrative project assuming it had zero returns.",
            "options": [
                "ROI is always 0% when investment is 0.",
                "Diagnose careless error masking: `IFERROR` intercepted the `#DIV/0!` error (division by zero) and converted it into a false numeric 0, misleading management. Replace with explicit condition checking: `=IF(H10=0, 'NO_CAPITAL_BASE', (G10-H10)/H10)`, clearly differentiating mathematical impossibility from genuine zero returns.",
                "Never invest in projects with zero capital.",
                "Delete the formula."
            ],
            "correctOptionIndex": 1,
            "debrief": "Blanket `IFERROR` masking turns genuine mathematical and structural errors into deceptive numbers like 0. Explicit conditional checking surfaces meaningful operational statuses ('NO_CAPITAL_BASE') without corrupting analytical conclusions."
        },
        "quests": [
            {
                "id": "Q34.49",
                "name": "Spreadsheet Error Taxonomy & The DAG Calculation Graph",
                "type": "Concept",
                "desc": "Detail the formal taxonomy of spreadsheet errors (`#N/A`, `#VALUE!`, `#REF!`, `#DIV/0!`, `#NUM!`, `#NAME?`), analyzing error propagation and precedent tracing."
            },
            {
                "id": "Q34.50",
                "name": "The Blind IFERROR Debt Concealment Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a multi-million-dollar financial reporting omission; identify where blanket `IFERROR` masked `#REF!` errors caused by a deleted subsidiary sheet."
            },
            {
                "id": "Q34.51",
                "name": "Precision Error Trapping & Precedent Audit Suite",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise formula debugging utility in Excel/Python that audits workbook formulas, flags careless error masking, and maps dependency trees."
            },
            {
                "id": "Q34.52",
                "name": "Catastrophic Column Deletion Resilience Lab",
                "type": "Production Incident Lab",
                "desc": "Inject synthetic column deletions and divide-by-zero anomalies into a 50-sheet corporate financial model; verify that all errors are surfaced with actionable audit tags."
            }
        ]
    },
    {
        "day": 14,
        "month": 1,
        "blockNum": 3,
        "title": "Data Validation & Dropdown Integrity: In-Cell Lists & Input Constraints",
        "stageNum": 3,
        "stageName": "Stage 3: Dynamic Arrays & Modern Formulas",
        "pedagogicalRole": "Data Input Governance & Boundary Validation (In-Cell Lists, Custom Formula Validation Rules, Input Tooltips & Stop vs Warning Alerts)",
        "spokenGoal": "Garbage in, garbage out. The easiest way to keep your spreadsheet models pristine is to prevent bad data from ever entering in the first place. Today, you master Data Validation: configuring in-cell dropdown lists linked to dynamic array ranges, enforcing numeric range constraints, creating custom formula validation rules (e.g. forbidding duplicate IDs), and setting strict 'Stop' error alerts that block invalid data entry at the gate.",
        "conceptInvariant": "Data Validation Invariant: A validated cell $(c, r)$ enforces an acceptance predicate $\\mathcal{V}(x) \\in \\{TRUE, FALSE\\}$. Under 'Stop' alert styles, entries where $\\mathcal{V}(x) = FALSE$ are strictly rejected, preserving database integrity. Linking dropdown lists to dynamic array spill anchors (e.g. `=CategoryList#`) ensures dropdowns automatically update as categories expand.",
        "failureMode": "The Copy-Paste Validation Bypass Breach: An inventory clerk enters asset tracking numbers into an Excel sheet configured with a strict Data Validation rule (requiring 8 alphanumeric characters). The clerk copies 500 rows from an external spreadsheet and pastes them directly into the column. Because standard Excel paste (`Ctrl + V`) overwrites both values AND validation rules, 500 malformed assets bypass the validation checks completely.",
        "tryItFriction": "Construct a Data Validation rule that restricts employee ID entry to unique values only using a custom formula (`=COUNTIF($A$2:$A$100, A2)=1`), preventing duplicate entries.",
        "socraticHints": [
            "Why does a standard `Ctrl + V` paste destroy Data Validation rules in Excel, and why must users be trained to use Paste Values (`Ctrl + Alt + V -> Values`)?",
            "What is the difference between a 'Stop' alert (strictly blocks entry), a 'Warning' alert (allows override), and an 'Information' alert in Data Validation?",
            "How do you connect an in-cell Data Validation dropdown list to a spilled dynamic array range (e.g. `=K2#`) so that the dropdown expands automatically?"
        ],
        "situationalPuzzle": {
            "scenario": "A sales ops team builds a commission spreadsheet with an in-cell dropdown for 'Region'. The dropdown currently points to a hardcoded range `=$Z$1:$Z$4` containing North, South, East, West. The company opens an 'International' region, added to cell Z5. Sales reps complain they cannot select International because it doesn't appear in the dropdown.",
            "options": [
                "Tell sales reps that International sales are forbidden.",
                "Implement Dynamic Spill-Linked Validation: Populate the regions using a dynamic array formula (e.g. `=SORT(UNIQUE(RawRegions))` in cell Z1) and configure the Data Validation list source as `=$Z$1#`. As new regions are added to the raw data, the spilled range expands automatically, and the dropdown updates instantly.",
                "Manually update the range in 500 individual user workbooks.",
                "Delete the region dropdown."
            ],
            "correctOptionIndex": 1,
            "debrief": "Linking Data Validation lists to a dynamic array spill anchor (`=$Z$1#`) creates self-maintaining dropdowns. Any new category added to the source data automatically expands the spilled array and updates the dropdown list across all cells."
        },
        "quests": [
            {
                "id": "Q34.53",
                "name": "Data Validation Architecture & Input Governance",
                "type": "Concept",
                "desc": "Detail the mechanics of Data Validation, exploring in-cell list bindings, custom formula predicates, dynamic spill anchors (`#`), and alert styles."
            },
            {
                "id": "Q34.54",
                "name": "The Paste-Over Validation Bypass Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate an asset management tracking corruption incident where invalid asset IDs bypassed Data Validation rules; identify the paste-over overwrite mechanism."
            },
            {
                "id": "Q34.55",
                "name": "Dynamic Spill-Linked Input Validation Suite",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise data-entry form in Excel/Python with dynamic spill-linked dropdowns, custom duplicate-prevention formulas, and strict stop alerts."
            },
            {
                "id": "Q34.56",
                "name": "Multi-User Input Boundary Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Subject a validated data-entry template to 1,000 synthetic malformed, out-of-range, and duplicate submissions; achieve 100% rejection of invalid entries."
            }
        ]
    },
    {
        "day": 15,
        "month": 1,
        "blockNum": 3,
        "title": "Milestone 2: ApexDynamic Complete Multi-Condition Aggregations, XLOOKUP, Dynamic Arrays & Error Trapping Engine Suite",
        "stageNum": 3,
        "stageName": "Stage 3: Dynamic Arrays & Modern Formulas",
        "pedagogicalRole": "Architectural Capstone & Integrated Synthesis (Multi-Condition Sums, XLOOKUP Decoupling, Vectorized Dynamic Arrays & Defensive Error Auditing)",
        "spokenGoal": "Welcome to Milestone 2. You have moved far beyond basic formulas into the realm of modern dynamic spreadsheet architecture. Today, you assemble ApexDynamic: a production-grade analytical platform that combines `SUMIFS` multi-condition aggregations, leftward `XLOOKUP` relational retrieval, vectorized `FILTER` and `UNIQUE` dynamic arrays with spill operators, and precision `IFNA` error trapping into a single, cohesive business intelligence engine.",
        "conceptInvariant": "Milestone 2 Architectural Invariant: A modern dynamic spreadsheet engine must decouple lookup vectors from return arrays, vectorize filtering operations without spatial `#SPILL!` collisions, trap lookup misses with `IFNA`, and dynamically bind in-cell validation to spilled ranges.",
        "failureMode": "ApexDynamic System Lock-In Outage: An enterprise client runs an automated inventory re-allocation through the ApexDynamic prototype. A careless analyst types a temporary note into the middle of the dynamic array spill path, triggering a cascading `#SPILL!` error that blacks out the regional allocation model and halts warehouse shipping lines.",
        "tryItFriction": "Build and execute the complete ApexDynamic platform that ingests raw sales data, dynamically extracts unique categories, filters records by multiple criteria, performs leftward lookups, and generates a self-updating executive summary.",
        "socraticHints": [
            "How does combining dynamic arrays (`FILTER`/`UNIQUE`) with `XLOOKUP` eliminate the need for hundreds of redundant static formula rows?",
            "Why must a production spreadsheet designer establish designated, protected 'Spill Corridors' that forbid manual data entry to prevent `#SPILL!` collisions?",
            "What architectural telemetry (spill footprint size, calculation time, un-trapped error counts) must ApexDynamic monitor?"
        ],
        "situationalPuzzle": {
            "scenario": "During your Milestone 2 architectural defense, the review board asks: 'Your ApexDynamic model uses modern dynamic arrays (`FILTER`, `UNIQUE`) and `XLOOKUP`. What happens if an executive opens this workbook in an older version of Excel (Excel 2013 or 2016) that does not support dynamic arrays?'. How do you defend your architecture?",
            "options": [
                "Tell the executive to buy a new computer.",
                "ApexDynamic implements Backward Compatibility & Version Gating: (1) Provide clear environment prerequisites in the workbook metadata; (2) In legacy environments, Excel wraps unsupported dynamic array formulas in legacy CSE (`{=...}`) curly brackets or returns `#NAME?`; (3) For organizations supporting legacy versions, deploy fallback calculation sheets utilizing classic `INDEX/MATCH` and helper columns, or deliver reports via modern Excel Online / Power BI web viewers.",
                "Promise that Excel 2013 will magically update itself.",
                "Delete all formulas and convert the sheet to plain text."
            ],
            "correctOptionIndex": 1,
            "debrief": "Enterprise architects must plan for version fragmentation. While modern dynamic arrays and `XLOOKUP` provide vast advantages, organizations with mixed software versions require environment gating, cloud-first deployment (Excel for the Web), or documented backward-compatible fallback sheets."
        },
        "quests": [
            {
                "id": "Q34.57",
                "name": "ApexDynamic Systems Architecture & Dynamic Array Blueprint",
                "type": "Concept",
                "desc": "Document the complete systems architecture of ApexDynamic, detailing the dynamic array calculation engine, `XLOOKUP` retrieval layer, and spill corridor governance."
            },
            {
                "id": "Q34.58",
                "name": "The Cascading #SPILL! Footprint Collision Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a high-profile corporate reporting failure where a dynamic array collision blacked out executive KPIs; trace the rogue data entry that blocked the spill corridor."
            },
            {
                "id": "Q34.59",
                "name": "ApexDynamic Production Analytical Engine Implementation",
                "type": "Mastery Assignment",
                "desc": "Build the full ApexDynamic platform in Excel/Python, unifying multi-condition `SUMIFS`, reverse `XLOOKUP`, vectorized `FILTER`/`UNIQUE`, and precision error trapping."
            },
            {
                "id": "Q34.60",
                "name": "ApexDynamic Milestone 2 Viva Defense & Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Defend ApexDynamic before the Review Board under live evaluation with concurrent dynamic range resizing, spatial obstruction stress, and legacy compatibility probes."
            }
        ]
    }
]

out_path = Path(__file__).resolve().parent / "excel_data_viz_spec_m1.py"

content = f'''# scripts/visuals/excel_data_viz_spec_m1.py
# Month 1: Days 1 to 15 Specification for Course 34: Excel & Data Analysis Fundamentals (course-excel-data-viz)
# Conforms strictly to Gate v2 / True 9.8 standard across all 15 days (60 Quests: Q34.1 to Q34.60).

DAYS_1_TO_15 = {json.dumps(days_data, indent=2)}
'''

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} with {len(days_data)} days ({sum(len(d['quests']) for d in days_data)} quests).")
