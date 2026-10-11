# scripts/visuals/generate_excel_data_viz_m1_rest.py
"""
Generator script for Course 34: Excel & Data Analysis Fundamentals (course-excel-data-viz)
Month 1: Days 16 to 30 (60 Quests: Q34.61 to Q34.120).
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
        "day": 16,
        "month": 1,
        "blockNum": 4,
        "title": "Conditional Formatting & Visual Highlighting: Data Bars, Color Scales & Custom Formula Rules",
        "stageNum": 4,
        "stageName": "Stage 4: Data Modeling, Pivot Tables & Visuals",
        "pedagogicalRole": "Visual Analytics & Preattentive Perception (Data Bars, Color Gradients, Rule Hierarchy & Custom Formula Predicates)",
        "spokenGoal": "Raw numbers on a screen are invisible until your eyes can spot patterns. Conditional formatting harnesses human preattentive visual processing—allowing executives to spot budget overruns, inventory stockouts, and top performers in milliseconds. Today, you master Conditional Formatting: implementing gradient data bars, 3-color scales, icon sets, and formula-driven custom formatting rules that highlight entire rows dynamically.",
        "conceptInvariant": "Conditional Formatting Predicate Invariant: A formatting rule evaluates a Boolean formula predicate $P(c, r) \\in \\{TRUE, FALSE\\}$ across applied range $\\mathcal{R}$. For full-row highlighting, the column coordinate must be anchored with a mixed reference (e.g. `=$D2 > 1000`), allowing the row index to float while evaluating column D across all columns in row $r$.",
        "failureMode": "The Unanchored Column Rainbow Formatting Glitch: An operations analyst attempts to highlight rows where status is 'LATE' using `=D2=\"LATE\"` applied to `$A$2:$G$500`. Because column D was not locked with a dollar sign (`=$D2`), the formula shifted relatively: column A checked column D, column B checked column E, column C checked column F. The sheet erupted into a meaningless checkerboard of random colors during a live board presentation.",
        "tryItFriction": "Construct a full-row conditional formatting rule using `=$C2<AVERAGE($C$2:$C$100)` that dynamically highlights entire customer rows where spending is below the portfolio average.",
        "socraticHints": [
            "Why must custom formula conditional formatting rules use a mixed reference like `=$D2` (locking column D) to highlight an entire multi-column row?",
            "What causes Excel workbooks with thousands of conditional formatting rules to experience severe scrolling lag, and how does consolidating fragmented rules fix it?",
            "How does 'Stop If True' rule ordering prevent conflicting formatting rules from overriding critical danger highlights?"
        ],
        "situationalPuzzle": {
            "scenario": "A financial reporting model has been edited by 10 different analysts over 3 years. The workbook is painfully sluggish, taking 8 seconds to scroll down 20 rows. Opening the Conditional Formatting Rules Manager reveals over 450 duplicate fragmented rules applied to bizarre overlapping ranges like `=$B$4:$B$12, =$B$14:$B$22, =$B$24:$B$30`.",
            "options": [
                "Blame Microsoft and buy a faster gaming computer.",
                "Diagnose Rule Fragmentation: Copy-pasting cells repeatedly fragments conditional formatting rules across disconnected ranges, bloating the workbook XML. Fix by deleting all legacy fragmented rules and re-applying a single, clean consolidated rule across the entire table column (e.g. `=$B$2:$B$1000`).",
                "Delete all numbers from the sheet.",
                "Hide the columns that are slow."
            ],
            "correctOptionIndex": 1,
            "debrief": "Copying and pasting formatted cells creates duplicate, fragmented conditional formatting rules in the workbook XML, degrading rendering performance. Consolidating fragmented rules into clean, unified range declarations restores instant scrolling speeds."
        },
        "quests": [
            {
                "id": "Q34.61",
                "name": "Preattentive Visual Perception & Conditional Formatting Mechanics",
                "type": "Concept",
                "desc": "Detail the mechanics of conditional formatting, exploring preattentive visual attributes, rule precedence hierarchies, 'Stop If True' flags, and XML rule fragmentation."
            },
            {
                "id": "Q34.62",
                "name": "The Checkerboard Formatting Drift Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a broken board report where rows displayed random highlight patterns; trace the missing column anchor in the custom formatting formula."
            },
            {
                "id": "Q34.63",
                "name": "Executive KPI Exception Highlighting Engine",
                "type": "Mastery Assignment",
                "desc": "Build an automated KPI reporting sheet in Excel/Python utilizing consolidated custom formula rules for full-row exception alerts and gradient data bars."
            },
            {
                "id": "Q34.64",
                "name": "High-Volume Multi-Rule Rendering Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Audit and clean an enterprise workbook with 500 fragmented legacy formatting rules; consolidate to 5 master rules, reducing file size by 60% and scrolling latency to 0ms."
            }
        ]
    },
    {
        "day": 17,
        "month": 1,
        "blockNum": 4,
        "title": "Excel Tables (Ctrl + T) & Structured Referencing: Table1[@Sales] Syntax & Auto-Expansion",
        "stageNum": 4,
        "stageName": "Stage 4: Data Modeling, Pivot Tables & Visuals",
        "pedagogicalRole": "Relational Table Abstraction (Excel Tables, Structured Referencing Syntax @, Dynamic Auto-Expansion & Calculated Columns)",
        "spokenGoal": "Stop using plain, unstructured cell grids. If you are referencing `A2:G500`, you are doing it the hard way. Press `Ctrl + T` and transform your data into an official Excel Table. Today, you master Structured Referencing: writing self-documenting formulas like `=[@Quantity] * [@UnitPrice]`, understanding automatic table expansion, and creating self-healing datasets that automatically pull new rows into charts and Pivot Tables without updating ranges.",
        "conceptInvariant": "Structured Table & Auto-Expansion Invariant: An Excel Table `Table1` encapsulates a structured relational entity with named columns. Formulas use structured references: `[@Col]` refers to the intersecting row value, while `Table1[Col]` refers to the entire column vector. Entering data in the adjacent row/column triggers dynamic auto-expansion, propagating formulas and updating dependent models automatically.",
        "failureMode": "The Truncated Static Range Audit Blunder: An insurance actuarial model references claims data using plain range `A2:G500`. Over the quarter, claims adjusters add 150 new claims in rows 501 to 650. Because formulas referenced fixed row 500 rather than an auto-expanding Table, the $12M in new claims was completely excluded from reserve calculations, leaving the insurer under-capitalized.",
        "tryItFriction": "Convert an unstructured range into an official Excel Table (`Ctrl + T`); author a calculated column using structured references (`=[@Revenue] - [@Cost]`), observing how the formula auto-populates the entire column instantly.",
        "socraticHints": [
            "Why is `=[@Sales] * [@CommissionRate]` vastly superior for enterprise model auditing compared to `=C2 * D2`?",
            "What happens to downstream formulas, charts, and Pivot Tables when new rows are pasted at the bottom of an official Excel Table?",
            "How do you reference a table column from a formula located OUTSIDE the table (e.g. `=SUM(OrdersTable[TotalAmount])`)?"
        ],
        "situationalPuzzle": {
            "scenario": "A financial modeler writes an audit formula in a cell outside a table: `=SUM(SalesTable[@Sales])`. Excel returns a `#VALUE!` error. The modeler is confused because the same formula worked inside the table.",
            "options": [
                "Tables do not support the SUM function.",
                "Diagnose Structured Reference Context Error: The `@` operator denotes the 'current row' intersection. Outside the table, there is no corresponding row context, so `[@Sales]` fails. Outside formulas must reference the entire column vector: `=SUM(SalesTable[Sales])`.",
                "Rename the table to Sheet1.",
                "Delete the table and return to plain cells."
            ],
            "correctOptionIndex": 1,
            "debrief": "The `@` symbol is the 'this row' operator. It works inside the table where row context exists. Outside the table, referencing a single column requires omitting the `@` (`Table[Column]`) to reference the entire column vector."
        },
        "quests": [
            {
                "id": "Q34.65",
                "name": "Relational Table Abstractions & Structured Reference Syntax",
                "type": "Concept",
                "desc": "Detail the architecture of Excel Tables (`ListObject`), exploring structured reference grammar (`@`, `[#All]`, `[#Headers]`, `[#Data]`), and dynamic auto-expansion."
            },
            {
                "id": "Q34.66",
                "name": "The Un-Tracked Appended Claims Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate an insurance reserve under-funding incident where 150 newly appended claims rows were silently excluded from static range formulas; convert to structured tables."
            },
            {
                "id": "Q34.67",
                "name": "Self-Healing Structured Relational Ledger Suite",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise transaction database in Excel/Python utilizing official Tables, structured references, automated calculated columns, and total row aggregations."
            },
            {
                "id": "Q34.68",
                "name": "High-Volume Table Auto-Expansion Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate appending 10,000 transaction batches to an active Excel Table; verify instant formula propagation and automated chart range resizing with zero latency."
            }
        ]
    },
    {
        "day": 18,
        "month": 1,
        "blockNum": 4,
        "title": "Pivot Tables I: Field List Architecture (Rows, Columns, Values & Filters)",
        "stageNum": 4,
        "stageName": "Stage 4: Data Modeling, Pivot Tables & Visuals",
        "pedagogicalRole": "Multidimensional Aggregation & OLAP Cubes (Pivot Table Architecture, Pivot Cache, 4-Quadrant Field Lists & Cross-Tabulation)",
        "spokenGoal": "If you are writing 50 separate SUMIFS formulas to summarize sales by region, product, and month, you are wasting your life. A Pivot Table does in three clicks what takes hours with formulas. Today, you master the internal architecture of Pivot Tables: understanding the Pivot Cache in-memory database, mastering the four quadrants (Rows, Columns, Values, Filters), and slicing multi-thousand-row databases into executive cross-tabulations.",
        "conceptInvariant": "Pivot Table & Pivot Cache Invariant: A Pivot Table does not operate directly on worksheet cells; it creates an optimized, in-memory OLAP data structure called the Pivot Cache. Multiple Pivot Tables built from the same source share a single Pivot Cache, conserving memory. Changes to raw data do NOT appear in Pivot Tables until an explicit Refresh (`Alt + F5`) is executed.",
        "failureMode": "The Stale Pivot Cache Executive Misinformation Scandal: A retail CFO presents quarterly regional earnings to Wall Street analysts using an interactive Pivot Table report. That morning, accounting booked a critical $25M inventory write-down in the raw transactions tab. The analyst forgot to click 'Refresh', presenting outdated profitable earnings. The company had to issue an embarrassing public earnings restatement.",
        "tryItFriction": "Build a Pivot Table from a 1,000-row transaction dataset, drag Region to Rows, Quarter to Columns, and Sales to Values; modify a raw data cell and observe that the Pivot Table remains stale until `Alt + F5` is pressed.",
        "socraticHints": [
            "What is the 'Pivot Cache', and why does Excel use an in-memory snapshot rather than querying the worksheet grid on every click?",
            "Why do multiple Pivot Tables connected to the same dataset share a single Pivot Cache, and what happens to memory usage when you inadvertently create separate caches?",
            "What is the difference between placing a field in the 'Rows' area versus the 'Columns' area in terms of visual cross-tabulation?"
        ],
        "situationalPuzzle": {
            "scenario": "A marketing team builds a campaign ROI report with a Pivot Table. An analyst adds 500 new campaign rows to the bottom of the raw data sheet, clicks 'Refresh All', but the new campaigns do NOT appear in the Pivot Table report.",
            "options": [
                "The new campaigns were unsuccessful and Excel decided to hide them.",
                "Diagnose Static Range Source Binding: The Pivot Table's data source was set to a fixed range `Sheet1!$A$1:$F$500`. Appending rows below row 500 placed them outside the source boundaries. Fix by converting the raw data into an official Excel Table (`Ctrl + T`) and rebinding the Pivot Table source to `Table1`, ensuring future rows are automatically captured on refresh.",
                "Delete the Pivot Table and rebuild it from scratch every day.",
                "Restart the computer."
            ],
            "correctOptionIndex": 1,
            "debrief": "Pivot Tables built from static cell ranges (`$A$1:$F$500`) do not expand when new rows are added. Converting raw data into an official Excel Table (`Ctrl + T`) ensures the Pivot Cache source dynamically expands to encompass all newly appended records."
        },
        "quests": [
            {
                "id": "Q34.69",
                "name": "Pivot Table Architecture & The In-Memory Pivot Cache",
                "type": "Concept",
                "desc": "Detail the computational architecture of Pivot Tables, exploring the in-memory Pivot Cache, OLAP cube structures, 4-quadrant field mapping, and refresh lifecycles."
            },
            {
                "id": "Q34.70",
                "name": "The Stale Pivot Cache Earnings Misstatement Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a corporate earnings presentation discrepancy; trace how an un-refreshed Pivot Cache omitted a major balance sheet write-down."
            },
            {
                "id": "Q34.71",
                "name": "Multi-Dimensional Relational Pivot Table Engine",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise sales analytics cross-tabulation in Excel/Python utilizing shared Pivot Caches, hierarchical row groupings, and dynamic Table bindings."
            },
            {
                "id": "Q34.72",
                "name": "High-Volume Pivot Cache Scalability Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Instantiate 10 synchronized Pivot Tables over a 100,000-row transaction dataset; achieve sub-second refresh times and verify shared Pivot Cache memory efficiency."
            }
        ]
    },
    {
        "day": 19,
        "month": 1,
        "blockNum": 4,
        "title": "Pivot Tables II: Grouping Dates, Value Field Settings & Calculated Fields",
        "stageNum": 4,
        "stageName": "Stage 4: Data Modeling, Pivot Tables & Visuals",
        "pedagogicalRole": "Advanced Pivot Analytics (Temporal Hierarchies, Value Field Formulations: % of Column/Parent Total, Running Totals & Calculated Fields)",
        "spokenGoal": "Raw sums are just the beginning of Pivot Table power. Real business insights come from relative metrics: 'What percentage of total revenue does Product X generate? What is our month-over-month running total?'. Today, you master advanced Pivot Table analytics: automatic date grouping (Years, Quarters, Months), Value Field Settings (Show Values As: `% of Grand Total`, `Running Total In`), and authoring custom Calculated Fields.",
        "conceptInvariant": "Pivot Calculation & Grouping Invariant: 'Show Values As' computes relative metrics dynamically over the display matrix: $\\text{PctGrandTotal}(x) = \\frac{x}{\\sum X}$. Calculated Fields evaluate formulas on aggregated sums ($\\,\\sum A / \\sum B\\,$), NOT on row-level items, preserving mathematical precision in margin calculations.",
        "failureMode": "The Calculated Field Weighted Average Margin Distortion: A financial analyst adds a Calculated Field to a Pivot Table named 'Average Price' using the formula `=Sales / Quantity`. In row totals, the Pivot Table correctly calculates Total Sales divided by Total Quantity. But when the analyst attempts to calculate profit margin by averaging individual margin percentages (`=AVERAGE(Margin)`), the Pivot Table computes an unweighted average of averages, distorting corporate margins by 600 basis points.",
        "tryItFriction": "Construct a Pivot Table that displays sales by month, adds a second instance of the Sales field set to 'Show Values As -> Running Total In -> Month', and formats both as currency.",
        "socraticHints": [
            "Why must Profit Margin always be calculated as `SUM(Profit) / SUM(Revenue)` rather than an average of individual row-level margin percentages?",
            "How does grouping a Date field by 'Years' and 'Months' automatically create synthetic hierarchical fields in the Pivot Table Field List?",
            "What is the difference between `% of Column Total` and `% of Parent Row Total` when analyzing hierarchical product categories?"
        ],
        "situationalPuzzle": {
            "scenario": "A retail merchandise planner builds a store performance Pivot Table. The planner groups transaction dates by Month. Suddenly, all historical dates across 2022, 2023, and 2024 are lumped together into a single 'January' row (combining January 2022, 2023, and 2024 into one giant number).",
            "options": [
                "January is the only month that matters in retail.",
                "Diagnose Date Grouping Level Selection: The planner selected 'Months' but omitted 'Years' in the Grouping dialog (`Right-click -> Group -> Select BOTH Years and Months`). Selecting only Months aggregates all Januaries together across all calendar years. Adding Years creates a clean multi-year chronological hierarchy.",
                "Delete all transactions from 2022 and 2023.",
                "Manually type the dates in Word."
            ],
            "correctOptionIndex": 1,
            "debrief": "Excel's Date Grouping dialog allows multi-level selections. Grouping exclusively by 'Months' collapses all historical years into 12 generic calendar months. Selecting both 'Years' and 'Months' preserves the temporal sequence across multi-year datasets."
        },
        "quests": [
            {
                "id": "Q34.73",
                "name": "Advanced Pivot Mathematics & Value Field Transformations",
                "type": "Concept",
                "desc": "Detail the mathematical formulation of Pivot Table 'Show Values As' transformations (% of total, difference from, running totals), date hierarchies, and Calculated Fields."
            },
            {
                "id": "Q34.74",
                "name": "The Unweighted Average Margin Distortion Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a distorted corporate margin report; trace how an unweighted average of averages in a Pivot Table created a 6% margin discrepancy."
            },
            {
                "id": "Q34.75",
                "name": "Executive Relative Variance & Running Total Pivot Suite",
                "type": "Mastery Assignment",
                "desc": "Build an executive sales performance Pivot Table in Excel/Python featuring year-over-year percentage variances, running totals, and weighted margin Calculated Fields."
            },
            {
                "id": "Q34.76",
                "name": "Multi-Year Chronological Hierarchy Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Process a 5-year, 200,000-record retail transaction dataset; generate hierarchical Year-Quarter-Month comparative summaries with zero date collision errors."
            }
        ]
    },
    {
        "day": 20,
        "month": 1,
        "blockNum": 4,
        "title": "Pivot Charts & Interactive Slicers: Multi-Pivot Dashboard Connections",
        "stageNum": 4,
        "stageName": "Stage 4: Data Modeling, Pivot Tables & Visuals",
        "pedagogicalRole": "Interactive Dashboard Architecture (Pivot Charts, Visual Slicers, Report Connections & Shared Pivot Cache Filtering)",
        "spokenGoal": "Executives don't want static tables; they want interactive dashboards where clicking a single button instantly filters charts, tables, and KPIs across the entire screen. Today, you master Interactive Dashboard Architecture: connecting Pivot Charts to Pivot Tables, configuring visual Slicers and Timelines, and using 'Report Connections' to link a single set of slicers across multiple independent Pivot Tables sharing a Pivot Cache.",
        "conceptInvariant": "Shared Pivot Cache Slicer Invariant: A visual Slicer connected to multiple Pivot Tables via Report Connections broadcasts filter predicates across the shared Pivot Cache: $\\mathcal{S}(filter) \\to \\bigcap_{k=1}^m \\text{PivotTable}_k$. All connected Pivot Tables must share an identical Pivot Cache source for coordinated multi-table filtering.",
        "failureMode": "The Disconnected Slicer Executive Meeting Glitch: An analyst builds a board dashboard with three Pivot Tables (Revenue, Margin, Customer Count) and adds a 'Region' slicer. The analyst forgets to configure 'Report Connections' on the slicer (which defaults to connecting only to Table 1). In the board meeting, the CEO clicks 'North America': the Revenue table filters, but Margin and Customers remain globally unfiltered, presenting contradictory data on the same screen.",
        "tryItFriction": "Build two separate Pivot Tables from the same table (one for Regional Sales, one for Product Sales); add a single 'Year' slicer, configure 'Report Connections' to check both tables, and verify coordinated filtering.",
        "socraticHints": [
            "Why must multiple Pivot Tables share the exact same underlying Pivot Cache in order for a Slicer to filter all of them simultaneously?",
            "What is the difference between a standard categorical Slicer and a dynamic Date Timeline in Excel dashboard design?",
            "How do you format a Slicer into multiple columns (e.g. a 4-column horizontal button bar) to save vertical space on an executive dashboard?"
        ],
        "situationalPuzzle": {
            "scenario": "A BI developer creates an executive dashboard with 4 Pivot Tables. The developer builds a 'Department' Slicer. When opening 'Report Connections', only Table 1 and Table 2 appear in the list; Table 3 and Table 4 are missing from the dialog, making it impossible to connect them to the same slicer.",
            "options": [
                "Excel limits dashboards to 2 tables.",
                "Diagnose Disconnected Pivot Cache Origin: Table 3 and Table 4 were created from a slightly different range or recreated from scratch, creating a separate, distinct Pivot Cache in memory. Slicers can only connect to Pivot Tables that share the exact same Pivot Cache. Fix by recreating Tables 3 and 4 as copies of Table 1 or rebinding them to the same source Table.",
                "Delete Tables 3 and 4.",
                "Click the slicer twice."
            ],
            "correctOptionIndex": 1,
            "debrief": "Report Connections requires a shared Pivot Cache. If Pivot Tables are built from different data selections or recreated independently, Excel allocates separate caches, preventing cross-table slicer connections. Copying an existing Pivot Table ensures shared cache inheritance."
        },
        "quests": [
            {
                "id": "Q34.77",
                "name": "Interactive Dashboard Architecture & Slicer Mechanics",
                "type": "Concept",
                "desc": "Detail the systems architecture of interactive Pivot Dashboards, exploring Slicer filtering mechanics, Report Connections, shared Pivot Caches, and visual layout."
            },
            {
                "id": "Q34.78",
                "name": "The Unconnected Multi-Table Metric Discrepancy Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a high-profile executive dashboard failure where slicer filtering created contradictory metrics across tables; identify the missing Report Connections."
            },
            {
                "id": "Q34.79",
                "name": "Coordinated Multi-Pivot Interactive Dashboard Suite",
                "type": "Mastery Assignment",
                "desc": "Build an executive KPI dashboard in Excel/Python featuring 4 synchronized Pivot Tables, interactive multi-column Slicers, date Timelines, and dynamic Pivot Charts."
            },
            {
                "id": "Q34.80",
                "name": "High-Density Executive Slicer Interaction Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Stress test an interactive dashboard with 8 synchronized visual components across a 50,000-row dataset; verify instant (<100ms) cross-filtering with zero cache desynchronization."
            }
        ]
    },
    {
        "day": 21,
        "month": 1,
        "blockNum": 5,
        "title": "Milestone 3: ApexVisual Conditional Formatting, Structured Tables, Pivot Tables & Slicers Engine Suite",
        "stageNum": 5,
        "stageName": "Stage 5: Business Analytics, Financial Modeling & Power Query",
        "pedagogicalRole": "Architectural Capstone & Integrated Synthesis (Preattentive Formatting, Structured Table Entities, Shared Pivot Caches & Coordinated Slicers)",
        "spokenGoal": "Day 21 brings you to Milestone 3. You have mastered data transformation, relational table abstraction, and multidimensional OLAP aggregation. Today, you assemble ApexVisual: an integrated, interactive business intelligence dashboard platform that combines structured tables, consolidated conditional formatting, synchronized multi-table Pivot Caches, interactive slicers, and dynamic Pivot Charts into a unified executive cockpit.",
        "conceptInvariant": "Milestone 3 Architectural Invariant: An executive visual reporting system must encapsulate source records in structured tables (`Ctrl + T`), consolidate conditional formatting to prevent rule fragmentation, share a unified in-memory Pivot Cache across all visual components, and link interactive slicers via universal Report Connections.",
        "failureMode": "ApexVisual Dashboard Desync Outage: During the live milestone defense, the evaluator selects 'Q4' on the date slicer and updates an underlying sales record. Because the presenter forgot to configure auto-refresh event hooks and one chart was bound to an unlinked cache, the revenue chart updates while the profitability gauge remains frozen in Q3.",
        "tryItFriction": "Deploy the complete ApexVisual executive dashboard that ingests 5,000 sales transactions, displays 4 coordinated Pivot Tables and Charts, applies full-row conditional anomaly highlights, and filters seamlessly via 3 synchronized slicers.",
        "socraticHints": [
            "Why is sharing a single Pivot Cache across all dashboard components essential for memory efficiency and instant filter responsiveness?",
            "How does structured table auto-expansion ensure that newly imported monthly data flows into Pivot Tables upon refresh without manual re-selection?",
            "What visual layout principles (KPI cards at top, high-level summary in center, granular details at bottom) optimize executive decision-making?"
        ],
        "situationalPuzzle": {
            "scenario": "During your Milestone 3 defense, the evaluator challenges your dashboard: 'Your ApexVisual dashboard looks impressive, but when I paste 2,000 new transactions at the bottom of the raw data sheet and click Refresh All, the charts update, but my conditional formatting highlights on the raw sheet stop at row 5,000.'. How do you resolve this?",
            "options": [
                "Tell the evaluator they are not allowed to paste new data.",
                "ApexVisual enforces Table-Bound Formatting: In an official Excel Table (`ListObject`), conditional formatting rules should be applied directly to the Table Column entity (`Table1[Sales]`), NOT to static cell ranges (`$E$2:$E$5000`); applying rules to the table column ensures formatting automatically expands down to row 7,000 as new records are added.",
                "Delete the conditional formatting rules entirely.",
                "Manually drag the formatting down."
            ],
            "correctOptionIndex": 1,
            "debrief": "When raw data is structured as an official Excel Table, applying conditional formatting to the named Table Column binds the rule to the object entity rather than static coordinates, guaranteeing that formatting automatically expands over newly appended rows."
        },
        "quests": [
            {
                "id": "Q34.81",
                "name": "ApexVisual Systems Architecture & Dashboard Blueprint",
                "type": "Concept",
                "desc": "Document the complete systems architecture of ApexVisual, detailing structured table entities, in-memory Pivot Cache optimization, Slicer routing, and preattentive visual rules."
            },
            {
                "id": "Q34.82",
                "name": "The Unsynchronized Multi-Cache Desync Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a production dashboard failure where slicer filters updated revenue charts but left profitability frozen; identify the duplicate unlinked Pivot Cache."
            },
            {
                "id": "Q34.83",
                "name": "ApexVisual Production Executive Cockpit Implementation",
                "type": "Mastery Assignment",
                "desc": "Build the full ApexVisual platform in Excel/Python, unifying structured tables, shared Pivot Caches, coordinated visual Slicers, and consolidated conditional formatting."
            },
            {
                "id": "Q34.84",
                "name": "ApexVisual Milestone 3 Viva Defense & Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Defend ApexVisual before the Review Board under live evaluation with concurrent data appending, high-frequency slicer manipulation, and adversarial cache desync tests."
            }
        ]
    },
    {
        "day": 22,
        "month": 1,
        "blockNum": 5,
        "title": "Business Charting & Data Visualization: Chart Type Selection & Secondary Axes",
        "stageNum": 5,
        "stageName": "Stage 5: Business Analytics, Financial Modeling & Power Query",
        "pedagogicalRole": "Visual Communication & Quantitative Display (Chart Selection Taxonomy, Secondary Axes Scaling Traps, Waterfall Charts & Dual-Axis Best Practices)",
        "spokenGoal": "A terrible chart is worse than no chart at all. Throwing a 3D pie chart with 20 slices into an executive slide deck is professional suicide. Today, you master Business Data Visualization: selecting the right chart for the data story (Waterfall for financial bridges, Bullet charts for targets, Scatter plots for correlation, Clustered Bars for comparison), and mastering Secondary Axes without creating misleading visual distortions.",
        "conceptInvariant": "Visual Truth & Scale Invariant: A quantitative chart encodes numeric values as geometric lengths or positions: $v \\mapsto f(v)$. When using Secondary Axes for disparate scales (e.g. Revenue in Millions vs Margin in Percent), axis baselines must never be artificially clipped to exaggerate trends: $\\min(\\text{Axis}) = 0$ for bar charts to preserve visual proportionality.",
        "failureMode": "The Deceptive Dual-Axis Revenue Collapse Illusion: A telecom company plots Revenue ($500M) as blue bars and Churn Rate (2.1%) as an orange line on a dual-axis chart. The analyst scales the secondary axis from 2.0% to 2.2% (clipping the baseline). A tiny 0.05% fluctuation in churn looks like a terrifying 500% spike on the chart, causing the board of directors to panic and freeze all capital investments.",
        "tryItFriction": "Build an authentic corporate Waterfall chart showing the bridge from Gross Revenue to Net Income, properly classifying Start, Increase, Decrease, and Total bars.",
        "socraticHints": [
            "Why do pie charts fail miserably when comparing more than 3 or 4 categories (hint: human visual perception struggles to judge 2D angles compared to 1D lengths)?",
            "What makes a Waterfall chart the gold standard for executive financial briefings (P&L walk, EBITDA reconciliation)?",
            "Why does truncating the Y-axis baseline on bar charts violate visual ethics and mislead non-technical stakeholders?"
        ],
        "situationalPuzzle": {
            "scenario": "A financial analyst builds an EBITDA Bridge chart showing how revenue gains, COGS inflation, and SG&A cuts led from 2023 EBITDA ($100M) to 2024 EBITDA ($120M). The analyst uses a standard clustered column chart. The board complains that it's impossible to see which factors contributed positively versus negatively to the change.",
            "options": [
                "Tell the board to squint harder.",
                "Build a Native Waterfall Chart: Convert the data into an official Waterfall chart; set the starting 2023 EBITDA and ending 2024 EBITDA as 'Set as Total' anchor columns; format positive revenue drivers in green, cost increases in red, and ending totals in blue, clearly visualizing the step-by-step financial reconciliation bridge.",
                "Change the chart to a 3D exploding doughnut chart.",
                "Delete the chart and hand out paper calculators."
            ],
            "correctOptionIndex": 1,
            "debrief": "Waterfall charts are specifically engineered for bridge reconciliations. By establishing starting and ending anchor totals and color-coding positive increments and negative deductions, decision-makers can instantly trace how a financial metric evolved over time."
        },
        "quests": [
            {
                "id": "Q34.85",
                "name": "Quantitative Display Mechanics & Chart Selection Taxonomy",
                "type": "Concept",
                "desc": "Detail the cognitive psychology of data visualization (Cleveland-McGill perception hierarchy), chart selection taxonomy, Waterfall mechanics, and dual-axis scaling ethics."
            },
            {
                "id": "Q34.86",
                "name": "The Truncated Secondary Axis Distortion Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate an executive slide deck that triggered false board panic; identify how a truncated secondary percentage axis exaggerated a minor operational fluctuation."
            },
            {
                "id": "Q34.87",
                "name": "Corporate Financial Waterfall & Bridge Visualization Suite",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise EBITDA-to-Net-Income bridge chart and dual-axis performance dashboard in Excel/Python with ethical axis scaling and dynamic variance labels."
            },
            {
                "id": "Q34.88",
                "name": "High-Density Executive Boardroom Presentation Lab",
                "type": "Production Incident Lab",
                "desc": "Design a clean, 1-page executive financial slide visualization summarizing 5 years of complex P&L and balance sheet performance; achieve 100% visual clarity and zero misleading scales."
            }
        ]
    },
    {
        "day": 23,
        "month": 1,
        "blockNum": 5,
        "title": "Financial Modeling Functions: PMT Loan Repayments, NPV, PV, FV & IRR",
        "stageNum": 5,
        "stageName": "Stage 5: Business Analytics, Financial Modeling & Power Query",
        "pedagogicalRole": "Time Value of Money & Financial Mathematics (Discounted Cash Flows, PMT Amortization, NPV Timing Invariants & Internal Rate of Return)",
        "spokenGoal": "A dollar today is worth more than a dollar tomorrow. That single insight powers all of global finance, corporate valuation, and capital allocation. Today, you master the Time Value of Money (TVM) functions in Excel: `PMT` for loan repayments, `PV` and `FV` for capital growth, `NPV` for capital budgeting, and `IRR` for investment returns. You will learn the subtle cash flow sign convention and avoid the critical Day 0 timing flaw in Excel's native `NPV` function.",
        "conceptInvariant": "Time Value of Money & NPV Timing Invariant: Cash outflows must be signed NEGATIVE ($-$) and inflows POSITIVE ($+$). Crucially, Excel's native `=NPV(rate, CF_1, ...)` assumes the first input cash flow occurs at the END of Period 1 ($t = 1$). To evaluate a project with initial investment at $t = 0$, the formula must be: `=InitialInvestment + NPV(rate, FutureCashFlows)`.",
        "failureMode": "The $14M Miscalculated Project NPV Capital Misallocation: A corporate capital expenditure committee evaluates a $50M factory expansion. An analyst calculates project viability using `=NPV(0.10, CF_0:CF_5)` where cell CF_0 was the initial -$50M investment. Because Excel discounted the initial investment by one full year, the calculated NPV was falsely inflated by $4.5M, causing the company to greenlight a loss-making project that destroyed $14M in shareholder value.",
        "tryItFriction": "Construct a full loan amortization schedule in Excel using `=PMT(rate/12, nper*12, -loan_amount)` and `=PPMT()` / `=IPMT()` that dynamically separates principal and interest payments for any loan.",
        "socraticHints": [
            "Why must cash outflows (like loans or initial investments) be entered as negative numbers in Excel financial functions?",
            "Why does Excel's `=NPV()` function incorrectly discount Year 0 cash flows if included inside the function arguments, and how do you write the correct formula?",
            "What is the Internal Rate of Return (`IRR`), and what happens when non-conventional cash flows (multiple sign changes) create multiple internal rates of return?"
        ],
        "situationalPuzzle": {
            "scenario": "A venture capital analyst evaluates an investment: Initial Outflow of -$1,000,000 at $t = 0$, followed by inflows of $300k, $400k, $500k, and $600k over years 1 to 4 at a 12% discount rate. Analyst A writes `=NPV(0.12, A1:A5)`. Analyst B writes `=A1 + NPV(0.12, A2:A5)`. Analyst A calculates NPV as $242,500, while Analyst B calculates NPV as $271,600.",
            "options": [
                "Both analysts are correct because financial valuation is an art.",
                "Analyst B is mathematically correct: Excel's `NPV()` function discounts the first argument by $(1 + r)^1$. Analyst A accidentally discounted the initial $1,000,000 investment by 1 year, artificially shrinking the required capital base. The initial investment at $t=0$ must remain undiscounted outside the function: `=A1 + NPV(rate, A2:A5)`.",
                "Analyst A is correct because Excel is never wrong.",
                "NPV cannot be calculated in Excel."
            ],
            "correctOptionIndex": 1,
            "debrief": "Excel's `NPV()` function does not compute true Net Present Value; it computes Present Value of future cash flows starting at $t=1$. Initial investments at $t=0$ must be added outside the formula (`=CF_0 + NPV(rate, CF_1:CF_n)`)."
        },
        "quests": [
            {
                "id": "Q34.89",
                "name": "Time Value of Money Mathematics & NPV Timing Mechanics",
                "type": "Concept",
                "desc": "Detail the mathematical formulas for Time Value of Money (`PV`, `FV`, `PMT`, `NPV`, `IRR`), analyzing cash flow sign conventions and the Day 0 discounting trap."
            },
            {
                "id": "Q34.90",
                "name": "The Discounted Day Zero Capital Misallocation Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a multi-million-dollar infrastructure investment error; identify how an improper range selection in `=NPV()` inflated project returns by discounting initial capital."
            },
            {
                "id": "Q34.91",
                "name": "Comprehensive Debt Amortization & Capital Budgeting Suite",
                "type": "Mastery Assignment",
                "desc": "Build an integrated financial modeling engine in Excel/Python featuring loan amortization tables (`PPMT`/`IPMT`), dynamic NPV calculations, and IRR sensitivity models."
            },
            {
                "id": "Q34.92",
                "name": "Multi-Scenario Capital Allocation Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Evaluate 20 competing enterprise capital investment proposals across varying discount rates and hurdle thresholds; achieve 100% valuation accuracy and rank ordering."
            }
        ]
    },
    {
        "day": 24,
        "month": 1,
        "blockNum": 5,
        "title": "What-If Analysis & Scenario Planning: Goal Seek & Sensitivity Data Tables",
        "stageNum": 5,
        "stageName": "Stage 5: Business Analytics, Financial Modeling & Power Query",
        "pedagogicalRole": "Sensitivity Modeling & Parameter Exploration (Iterative Goal Seek Solvers, 1-Way and 2-Way Data Tables & Multi-Variable Sensitivity Matrices)",
        "spokenGoal": "Every financial forecast is wrong; the question is: how wrong can it be before the business goes bankrupt? That is the domain of What-If Analysis and Sensitivity Modeling. Today, you master Goal Seek (iterative reverse-engineering of inputs) and Sensitivity Data Tables (1-way and 2-way matrix evaluations using the `{=TABLE()}` array formula). You will build sensitivity grids that evaluate how changes in sales volume and unit price impact operating income simultaneously.",
        "conceptInvariant": "Sensitivity Matrix & Data Table Invariant: A 2-Way Data Table evaluates model output $f(x, y)$ across row vector $\\mathbf{x}$ and column vector $\\mathbf{y}$, populating the intersection matrix via the internal `{=TABLE(row_input, col_input)}` calculation engine. Top-left corner cell must reference the master formula: $M_{0, 0} = f(x_0, y_0)$.",
        "failureMode": "The Uncalculated Automatic Data Table Memory Freeze: A financial modeler builds four 2-Way Data Tables (each 50x50 = 2,500 iterations) in a complex, multi-tab corporate LBO model. Because Excel was set to 'Automatic Calculation', every single keypress in any cell recalculates all 10,000 data table permutations, freezing Excel for 45 seconds on every edit. The team is paralyzed until calculation options are adjusted.",
        "tryItFriction": "Construct a 2-Way Sensitivity Table in Excel evaluating Loan Monthly Payment across 5 Interest Rates (rows) and 5 Loan Terms (columns), linking the top-left cell to the master `=PMT()` formula.",
        "socraticHints": [
            "Why must the top-left cell of a 2-Way Data Table link directly to the output formula cell being evaluated?",
            "How does changing Excel calculation settings to 'Automatic except for data tables' (`Alt + M + X + E`) eliminate model lag while editing complex financial spreadsheets?",
            "What is the mathematical difference between Goal Seek (single-variable iterative Newton-Raphson solver) and Excel Solver (multi-variable constrained optimization)?"
        ],
        "situationalPuzzle": {
            "scenario": "A real estate developer builds a 2-Way Sensitivity Table to evaluate property IRR across varying purchase prices (Column A) and occupancy rates (Row 1). The developer highlights the range, opens Data -> What-If -> Data Table, and accidentally swaps the inputs (entering the purchase price cell as the Row Input and occupancy cell as the Column Input).",
            "options": [
                "Excel automatically detects the error and fixes it.",
                "Diagnose Swapped Data Table Input Orientation: In a 2-Way Data Table, Row Input Cell corresponds to the values laid out horizontally across the top row (occupancy), while Column Input Cell corresponds to the values laid out vertically down the leftmost column (price). Swapping them populates the table with nonsense or `#VALUE!` errors. Fix by re-entering the correct orientation.",
                "Delete the real estate project.",
                "Change calculation to manual."
            ],
            "correctOptionIndex": 1,
            "debrief": "The orientation in Data Tables is strict: 'Row input cell' refers to the variable whose test values are arranged horizontally across the top row; 'Column input cell' refers to the variable whose test values run vertically down the left column. Swapping them corrupts the sensitivity matrix."
        },
        "quests": [
            {
                "id": "Q34.93",
                "name": "Sensitivity Modeling & The What-If Calculation Engine",
                "type": "Concept",
                "desc": "Detail the computational mechanics of Goal Seek (iterative root finding) and 1-Way/2-Way Data Tables (`{=TABLE()}` array engine), analyzing memory allocation and calculation modes."
            },
            {
                "id": "Q34.94",
                "name": "The Swapped Input Sensitivity Matrix Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a commercial real estate valuation failure where a sensitivity matrix returned negative IRRs; identify the swapped row/column input cell references."
            },
            {
                "id": "Q34.95",
                "name": "Two-Way Parameter Sensitivity & Goal Seek Suite",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise corporate profitability sensitivity model in Excel/Python featuring 2-Way Data Tables across price and volume, paired with automated break-even Goal Seek solvers."
            },
            {
                "id": "Q34.96",
                "name": "Multi-Variable LBO Valuation Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Deploy 5 interactive sensitivity matrices across a 10-variable leveraged buyout model; optimize calculation settings to achieve instant recalculation under 5,000 scenario runs."
            }
        ]
    },
    {
        "day": 25,
        "month": 1,
        "blockNum": 5,
        "title": "Power Query (Get & Transform) I: Data Cleaning, Column Splitting & Unpivoting",
        "stageNum": 5,
        "stageName": "Stage 5: Business Analytics, Financial Modeling & Power Query",
        "pedagogicalRole": "Modern ETL & Data Ingestion (Power Query Engine, M Language Foundations, Applied Steps Pipeline & The Critical Unpivot Transformation)",
        "spokenGoal": "Writing complex nested formulas to clean dirty data is obsolete. Power Query (Get & Transform) is the built-in ETL (Extract, Transform, Load) engine inside Excel that transforms messy, real-world data into clean relational tables with zero coding. Today, you master Power Query fundamentals: applied steps pipelines, data type enforcement, splitting delimited text, and the most critical transformation in data analysis: Unpivoting wide summary tables into tall, normalized datasets.",
        "conceptInvariant": "Relational Normalization & Unpivot Invariant: Analysis and Pivot Tables require normalized tall datasets (First Normal Form: each row represents a single atomic observation). Transforming wide 'crosstab' data (months spread across columns) into tall normalized records requires the Unpivot transformation: $\\text{Unpivot}(\\mathcal{M}_{m \\times n}) \\to \\mathcal{T}_{(m \\times n) \\times 3}$ with columns `[Entity, Attribute, Value]`.",
        "failureMode": "The Crosstab Pivot Table Analysis Paralysis: A marketing analyst receives an annual budget formatted as a wide crosstab: columns D through O represent January through December. The analyst tries to build a Pivot Table to compare quarters. Because months are spread across 12 separate columns, Pivot Tables cannot group or filter by date, leaving the team unable to produce quarterly summaries for board reporting.",
        "tryItFriction": "Import a wide 12-month budget spreadsheet into Power Query; select the non-month identifier columns, right-click and select 'Unpivot Other Columns', transforming wide crosstabs into clean [Month, Amount] rows in seconds.",
        "socraticHints": [
            "Why is 'wide data' (months spread across 12 columns) terrible for database analysis and Pivot Tables, and why is 'tall data' (normalized rows) essential?",
            "What is the 'Applied Steps' list in Power Query, and how does it act as an automated, repeatable data cleaning recipe that executes on every refresh?",
            "How does Power Query enforce strict data typing (Text, Whole Number, Currency, Date) during ingestion to prevent dirty data from reaching worksheet cells?"
        ],
        "situationalPuzzle": {
            "scenario": "A supply chain manager imports weekly warehouse shipments into Power Query. Every week, a new column is added to the source CSV (e.g. 'Week 41', 'Week 42'). The manager unpivots the data by selecting 'Week 1' through 'Week 40' and clicking 'Unpivot Columns'. The following week, 'Week 41' is imported, but it fails to unpivot, remaining as a rogue column.",
            "options": [
                "Unpivoting only works on 40 weeks.",
                "Diagnose Unpivot Strategy Mistake: The manager used 'Unpivot Columns' on specific week headers. When Week 41 was added, it was not in the hardcoded list. Fix by selecting the STATIC metadata columns (e.g. WarehouseID, SKU) and clicking 'Unpivot OTHER Columns'. Any newly added weekly columns in the future will be unpivoted automatically on refresh.",
                "Manually edit the Power Query recipe every Monday morning.",
                "Stop tracking shipments after Week 40."
            ],
            "correctOptionIndex": 1,
            "debrief": "In dynamic datasets where new time-series columns are appended over time, never select the variable columns to unpivot. Select the stable identifier columns (Product, Region) and choose 'Unpivot Other Columns'. Power Query will automatically capture and unpivot any newly added columns."
        },
        "quests": [
            {
                "id": "Q34.97",
                "name": "Power Query ETL Architecture & Relational Normalization",
                "type": "Concept",
                "desc": "Detail the architecture of Power Query, exploring the M formula engine, Applied Steps execution DAGs, data typing enforcement, and First Normal Form unpivoting."
            },
            {
                "id": "Q34.98",
                "name": "The Static Column Unpivot Breakage Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate an automated weekly ETL pipeline that failed to ingest new weekly columns; trace the failure to hardcoded column selection instead of 'Unpivot Other Columns'."
            },
            {
                "id": "Q34.99",
                "name": "Automated Multi-Source Power Query Ingestion Suite",
                "type": "Mastery Assignment",
                "desc": "Build an automated Power Query pipeline in Excel/Python that ingests dirty CSV files, cleans delimiters, enforces strict data types, and normalizes wide crosstabs."
            },
            {
                "id": "Q34.100",
                "name": "High-Volume Unpivoting & Transformation Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Transform an enterprise 50-column wide historical budget across 10,000 products into a 500,000-row normalized dataset; verify instant automated refresh upon raw file updates."
            }
        ]
    },
    {
        "day": 26,
        "month": 1,
        "blockNum": 6,
        "title": "Power Query (Get & Transform) II: Merging Queries (Joins), Appending & Refresh",
        "stageNum": 6,
        "stageName": "Stage 6: Strategic Dashboards, Auditing & Master Capstone",
        "pedagogicalRole": "Advanced Data Integration & Relational Joins (Power Query Merging, Join Kinds: Left/Inner/Anti, Query Appending & Automated Folder Ingestion)",
        "spokenGoal": "Why write 20 fragile VLOOKUP formulas to merge data from three different files when Power Query can do a database join in seconds? Today, you master relational query merging and appending: Left Outer Joins, Inner Joins, Anti-Joins to find missing records, appending multiple monthly files from a folder automatically, and establishing automated background refresh pipelines.",
        "conceptInvariant": "Relational Join & Merge Invariant: Power Query merging implements standard relational algebra: $\\mathcal{T}_A \\bowtie \\mathcal{T}_B$. A Left Outer Join preserves all records from Table A, matching Table B keys. An Anti-Join ($A \\setminus B$) isolates non-matching orphan records. Appending ($\\,\\mathcal{T}_A \\cup \\mathcal{T}_B\\,$) stacks tables with schema alignment.",
        "failureMode": "The Cartesian Product Memory Exhaustion Crash: An analyst merges a 50,000-row sales table with a customer table in Power Query. Because the customer table contained duplicate customer IDs (non-unique primary key), the merge creates an unexpected many-to-many Cartesian product, inflating the dataset from 50,000 rows to 18 million rows and crashing Excel with an out-of-memory error.",
        "tryItFriction": "Build a Power Query folder ingestion query that points to a local directory; drop 3 monthly sales CSV files into the folder and verify that clicking 'Refresh All' automatically ingests and stacks all files into a single master table.",
        "socraticHints": [
            "What is the difference between 'Merging' queries (horizontal relational join like VLOOKUP) and 'Appending' queries (vertical stacking like UNION ALL)?",
            "Why does a Left Anti-Join provide the fastest, most reliable way to find 'orphan' records (e.g. sales transactions with invalid customer IDs)?",
            "What happens when you merge two tables where the lookup key in Table B contains duplicate values (Cartesian product multiplication)?"
        ],
        "situationalPuzzle": {
            "scenario": "A corporate auditor needs to find all invoices issued to vendor accounts that are NOT registered in the company's approved vendor database (potential vendor fraud). The raw invoice table has 20,000 rows; the approved vendor table has 800 rows.",
            "options": [
                "Manually check all 20,000 invoices one by one.",
                "Use Power Query with a Left Anti-Join: Merge the Invoices query with the Approved Vendors query matching on VendorID, selecting Join Kind: 'Left Anti (rows only in first)'. Power Query instantly filters the invoice table to show exclusively unapproved, fraudulent vendor invoices.",
                "Assume all invoices are valid.",
                "Delete the unapproved invoices."
            ],
            "correctOptionIndex": 1,
            "debrief": "The Left Anti-Join is the ultimate auditing tool in Power Query. It isolates rows in the primary table that have no matching key in the secondary table, instantly surfacing unregistered vendors, orphan records, and reconciliation exceptions."
        },
        "quests": [
            {
                "id": "Q34.101",
                "name": "Relational Algebra in Power Query & Join Mechanics",
                "type": "Concept",
                "desc": "Detail the relational algebra of Power Query merging (Left Outer, Right Outer, Full Outer, Inner, Left Anti, Right Anti) and vertical query appending."
            },
            {
                "id": "Q34.102",
                "name": "The Duplicate Key Cartesian Explosion Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate an Excel out-of-memory crash during an automated ETL refresh; trace how duplicate primary keys in a lookup table caused an 18-million row Cartesian explosion."
            },
            {
                "id": "Q34.103",
                "name": "Automated Multi-File Folder Ingestion & Reconciliation Suite",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise ETL pipeline in Power Query/Python that ingests monthly CSV files from a directory, executes relational joins, and isolates orphan exceptions via Anti-Joins."
            },
            {
                "id": "Q34.104",
                "name": "High-Volume Multi-Table Relational Join Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Execute complex multi-table relational merges across 100,000 transactions and 10,000 customer records; verify 100% join fidelity and zero duplicate key inflation."
            }
        ]
    },
    {
        "day": 27,
        "month": 1,
        "blockNum": 6,
        "title": "Executive Dashboard Design & Layout Principles: KPI Metric Cards & Visual Flow",
        "stageNum": 6,
        "stageName": "Stage 6: Strategic Dashboards, Auditing & Master Capstone",
        "pedagogicalRole": "Information Architecture & Dashboard Design (Visual Hierarchy, Z-Pattern Reading Flow, Card Layouts, Typography & Cognitive Load Reduction)",
        "spokenGoal": "Great data analysis poorly presented is ignored. Today, you move from analyst to information architect: designing executive dashboards that look like world-class modern software applications. You will master visual hierarchy, the executive Z-pattern reading flow, card layouts with clean sparklines, cohesive corporate color palettes (60-30-10 rule), and strict grid alignment that turns messy spreadsheets into C-suite command centers.",
        "conceptInvariant": "Dashboard Cognitive Load Invariant: An executive dashboard must minimize cognitive load: visual scanning follows the Z-pattern (Top-Left: Primary KPIs $\\to$ Center: Core Trends $\\to$ Bottom: Granular Distributions). High-level metrics must be digestible in $<5\\text{ seconds}$; grid layout must adhere to strict modular card structures.",
        "failureMode": "The 50-Metric Visual Clutter Dashboard Rejection: An analyst designs a 1-page executive dashboard containing 45 tiny charts, 8 conflicting neon colors, and 12 unorganized tables. When presented to the CEO, she cannot locate the primary revenue number, becomes visually exhausted within 10 seconds, and cancels the analytics initiative, calling it 'unreadable spreadsheet noise'.",
        "tryItFriction": "Redesign a cluttered, raw spreadsheet report into a clean, 3-tier executive dashboard with 4 top-level KPI summary cards, a central trend chart, and a clean slicer control panel.",
        "socraticHints": [
            "What is the 'Z-Pattern' of visual scanning, and why should the most critical corporate metric (e.g. Total Revenue or Net Margin) always occupy the upper-left quadrant?",
            "How does the '60-30-10 Color Rule' (60% neutral background, 30% structural gray/navy, 10% accent color for alerts) prevent visual fatigue?",
            "Why should gridlines, unnecessary decimal places, and redundant axis labels be removed from executive presentation dashboards?"
        ],
        "situationalPuzzle": {
            "scenario": "A dashboard designer presents an executive dashboard. The CEO complains: 'Every time I look at this sheet, it looks messy and disorganized, but I can't explain why.'. Looking closely, you notice the KPI cards are 127 pixels wide, the charts are 342 pixels wide, margins vary between 8 and 23 pixels, and 4 different font families are used.",
            "options": [
                "Tell the CEO to focus on the numbers instead of the fonts.",
                "Apply Modular Grid Alignment & Typography Standards: (1) Standardize all cards and charts to a strict underlying column grid (e.g. 12-column grid); (2) Lock uniform margins and padding (e.g. exactly 15px); (3) Enforce a single corporate typography hierarchy (e.g. Aptos / Segoe UI with 3 strict font sizes: Title 16pt, Metric 24pt, Label 9pt); (4) Align all borders precisely.",
                "Add more bright neon colors to distract the CEO.",
                "Print the sheet on glossy paper."
            ],
            "correctOptionIndex": 1,
            "debrief": "Visual polish in executive dashboards is mathematical. Aligning visual cards to a strict modular grid, enforcing uniform spacing margins, and restricting typography to a single font family with a strict hierarchy creates an instant impression of software-grade quality."
        },
        "quests": [
            {
                "id": "Q34.105",
                "name": "Cognitive Ergonomics & Dashboard Information Architecture",
                "type": "Concept",
                "desc": "Detail the principles of visual ergonomics, Z-pattern reading flows, 60-30-10 color theory, typography hierarchies, and cognitive load minimization in dashboard design."
            },
            {
                "id": "Q34.106",
                "name": "The Visual Clutter Cognitive Overload Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Audit a rejected executive dashboard with 40 competing visual elements; identify alignment defects, conflicting color palettes, and lack of visual hierarchy."
            },
            {
                "id": "Q34.107",
                "name": "Executive C-Suite Command Center Dashboard Suite",
                "type": "Mastery Assignment",
                "desc": "Build a presentation-ready executive dashboard in Excel/Python featuring modular KPI cards with sparklines, unified corporate styling, and seamless interactive slicers."
            },
            {
                "id": "Q34.108",
                "name": "High-Impact Boardroom Presentation Simulation Lab",
                "type": "Production Incident Lab",
                "desc": "Present your completed executive dashboard to a simulated panel of C-suite executives; achieve 100% metric clarity and instantaneous comprehension under rapid questioning."
            }
        ]
    },
    {
        "day": 28,
        "month": 1,
        "blockNum": 6,
        "title": "Spreadsheet Security, Protection & Auditing: Sheet Protection & Formula Locks",
        "stageNum": 6,
        "stageName": "Stage 6: Strategic Dashboards, Auditing & Master Capstone",
        "pedagogicalRole": "Spreadsheet Security & Governance (Cell Locking, Worksheet Protection, Formula Hiding, Password Encryption & Audit Trail Verification)",
        "spokenGoal": "You have spent three weeks building a magnificent financial model. You send it to a client or sales manager, and within 10 minutes they accidentally overwrite a master formula with a hardcoded number, breaking the entire model. Today, you master Spreadsheet Security and Protection: understanding the two-step locking process (unlock input cells -> protect sheet), hiding proprietary formulas, configuring permissions, and auditing workbooks against accidental tampering.",
        "conceptInvariant": "Spreadsheet Security & Locking Invariant: By default, every cell in Excel has `Locked = True`, but locking has ZERO effect until Worksheet Protection is enabled (`Review -> Protect Sheet`). Proper model governance requires explicitly UNLOCKING user input cells (`Locked = False`) before enabling sheet protection with a password, protecting all formula cells against modification.",
        "failureMode": "The Overwritten Master Discount Formula Disaster: A sales team uses an enterprise pricing model. A sales rep types a hardcoded custom discount `$50,000` directly over the master formula cell in D12 (`=B12*C12*DiscountTier`). The rep saves the file to the shared corporate OneDrive. Over the next month, 40 other reps use the corrupted sheet, giving away an unauthorized $50,000 discount on every single customer quote, costing the company $2.1M.",
        "tryItFriction": "Construct a protected client invoice template where customer address and quantity cells are unlocked for data entry, but all unit price lookups, tax calculations, and total formulas are locked and hidden from view.",
        "socraticHints": [
            "Why must you explicitly UNLOCK input cells (`Format Cells -> Protection -> uncheck Locked`) BEFORE turning on Sheet Protection?",
            "What is the difference between 'Protect Sheet' (locks cells from editing) and 'Protect Workbook Structure' (prevents adding, deleting, or renaming tabs)?",
            "Why is Excel password protection considered a defense against accidental user error rather than military-grade cryptographic security (Excel passwords can be bypassed in seconds with basic scripts)?"
        ],
        "situationalPuzzle": {
            "scenario": "A financial modeler builds a client-facing valuation tool. The modeler wants clients to enter their revenue assumptions in cells B4:B8, but wants to lock all valuation formulas in C4:G50. The modeler clicks 'Protect Sheet' and enters a password. The client calls: 'I can't type anything into your spreadsheet! Every cell gives an error!'.",
            "options": [
                "Tell the client they are not allowed to enter assumptions.",
                "Diagnose Default Locked State Error: Every cell in Excel is locked by default. The modeler turned on Protect Sheet without first unlocking the input cells. Fix by unprotecting the sheet, selecting assumption cells B4:B8, unchecking 'Locked' in Format Cells -> Protection, and re-enabling Protect Sheet. Clients can now edit assumptions while formulas remain locked.",
                "Give the client the master password so they can unprotect the sheet.",
                "Delete the valuation formulas."
            ],
            "correctOptionIndex": 1,
            "debrief": "Excel protection is a two-step process. Because all cells are locked by default, enabling Sheet Protection locks the entire sheet. Input cells must be explicitly unlocked before protection is turned on, allowing data entry while safeguarding formulas."
        },
        "quests": [
            {
                "id": "Q34.109",
                "name": "Spreadsheet Security Architecture & Protection Mechanics",
                "type": "Concept",
                "desc": "Detail the security architecture of Excel: cell locking flags, sheet protection ACLs, workbook structure locks, formula hiding, and cryptographic limitations."
            },
            {
                "id": "Q34.110",
                "name": "The Overwritten Master Pricing Formula Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a multi-million-dollar sales discount leakage incident; trace how an unprotected master formula was overwritten with a hardcoded number on a shared network drive."
            },
            {
                "id": "Q34.111",
                "name": "Enterprise Model Governance & Security Hardening Suite",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise financial model in Excel/Python with multi-tier cell locking, hidden proprietary formulas, workbook structure protection, and audit check cells."
            },
            {
                "id": "Q34.112",
                "name": "Adversarial Model Tampering & Integrity Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Subject a protected financial model to 50 simulated accidental user edits, column deletions, and sheet renames; verify that all core calculation formulas remain 100% immutable."
            }
        ]
    },
    {
        "day": 29,
        "month": 1,
        "blockNum": 6,
        "title": "AI in Spreadsheets & Future Trends: Excel Copilot & Python in Excel (=PY())",
        "stageNum": 6,
        "stageName": "Stage 6: Strategic Dashboards, Auditing & Master Capstone",
        "pedagogicalRole": "Next-Generation Spreadsheet Engineering (Python in Excel `=PY()`, Pandas DataFrames, Anaconda Cloud Sandbox & Copilot LLM Integration)",
        "spokenGoal": "Spreadsheets are undergoing the greatest revolution in their 45-year history. With Microsoft 365 Copilot and Python in Excel (`=PY()`), the grid is no longer limited to spreadsheet formulas—it runs full Python code in a secure cloud sandbox. Today, you master the cutting edge: writing `=PY()` formulas that ingest Excel ranges into Pandas DataFrames, executing machine learning models directly in cells, and orchestrating Copilot prompts to automate complex analytical workflows.",
        "conceptInvariant": "Python in Excel Invariant: Entering `=PY()` transforms the formula bar into a Python REPL executing in a sandboxed Anaconda container. Range references `xl(\"Table1[#All]\", headers=True)` convert Excel tables directly into Pandas DataFrames. Outputs can be returned as Excel values (scalars/tables) or Python objects.",
        "failureMode": "The Unpinned Cloud Python Sandbox Recalculation Spike: A financial data science team builds an automated customer churn prediction model inside an Excel sheet using `=PY()` and scikit-learn. Because the model was written to retrain on every sheet edit without caching or output pinning, simple data entries trigger a 30-second cloud Python execution delay, stalling executive workflow.",
        "tryItFriction": "Construct a Python in Excel formula (`=PY()`) that reads an Excel sales table via `xl()`, computes interquartile range (IQR) outlier bounds using Pandas, and returns a clean outlier flag column to the grid.",
        "socraticHints": [
            "How does `xl(\"A1:B10\", headers=True)` bridge the gap between traditional 2D Excel ranges and native Python Pandas DataFrames?",
            "What security constraints govern Python in Excel (e.g. running in an isolated hypervisor container with zero internet access, preventing web scraping or socket connections)?",
            "Why is combining native Excel Pivot Tables with Python statistical libraries (scipy, statsmodels) the optimal modern analytics workflow?"
        ],
        "situationalPuzzle": {
            "scenario": "A data scientist writes a Python in Excel formula in cell D2 to fetch live foreign exchange rates: `=PY() import requests; r = requests.get('https://api.fx.com'); ...`. Excel immediately throws a `#PYTHON!` error. The scientist confirms the code works in local Jupyter notebooks.",
            "options": [
                "The FX API is offline.",
                "Diagnose Cloud Sandbox Network Isolation: Python in Excel runs in a secure, isolated Microsoft Cloud container with strict network isolation (zero outbound internet access) to prevent corporate data exfiltration. External API calls via `requests` or `urllib` are blocked by design. Fix by importing external data via Power Query first, then passing the Excel table to Python.",
                "Reinstall Python on your local laptop.",
                "Switch to a different operating system."
            ],
            "correctOptionIndex": 1,
            "debrief": "Python in Excel executes inside an air-gapped cloud sandbox with no outbound network connectivity to ensure enterprise data security. External data must be fetched using Power Query and landed in an Excel Table before being passed to Python via `xl()`."
        },
        "quests": [
            {
                "id": "Q34.113",
                "name": "Python in Excel Architecture & Cloud Container Mechanics",
                "type": "Concept",
                "desc": "Detail the technical architecture of Python in Excel (`=PY()`), exploring Anaconda cloud containers, `xl()` DataFrame bridges, object vs value outputs, and security sandboxes."
            },
            {
                "id": "Q34.114",
                "name": "The Blocked Outbound Socket Python Error Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a broken Python spreadsheet script throwing `#PYTHON!` errors; identify the attempted external network request blocked by container security policies."
            },
            {
                "id": "Q34.115",
                "name": "Hybrid Excel-Python Machine Learning Pipeline Suite",
                "type": "Mastery Assignment",
                "desc": "Build an integrated analytical model in Excel utilizing Python (`=PY()`) with Pandas and Seaborn to compute statistical correlations and regression models directly in the grid."
            },
            {
                "id": "Q34.116",
                "name": "High-Throughput Python Cloud Execution Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Process a 50,000-row transaction dataset through Python in Excel; optimize DataFrame operations and memory footprints to achieve sub-2-second cloud execution times."
            }
        ]
    },
    {
        "day": 30,
        "month": 1,
        "blockNum": 6,
        "title": "Capstone 1: ApexSpreadsheet Sovereign Excel & Master Data Analysis Capstone Viva Gate",
        "stageNum": 6,
        "stageName": "Stage 6: Strategic Dashboards, Auditing & Master Capstone",
        "pedagogicalRole": "Month 1 Master Capstone & Senior Viva Gate (End-to-End Enterprise Systems Defense, Multi-Tier Financial Modeling & Sovereign Data Architecture)",
        "spokenGoal": "This is Day 30: the culmination of Month 1. You stand before the Senior Review Board to defend your Month 1 Capstone: ApexSpreadsheet. This is not a simple homework workbook. You will demonstrate an industrial-grade enterprise financial and operational intelligence engine that unifies Base-26 grid architecture, XLOOKUP relational lookups, dynamic array transformations, multi-condition aggregations, financial TVM schedules, Power Query ETL pipelines, interactive Pivot Dashboards, sheet protection, and Python integration.",
        "conceptInvariant": "Month 1 Capstone Invariant: The ApexSpreadsheet sovereign platform must provide end-to-end analytical integrity: verified Base-26 addressing, zero unmasked formula errors, auto-expanding table ingestion, shared Pivot Cache performance, and tamper-proof model protection.",
        "failureMode": "ApexSpreadsheet Grand System Crash: During the live capstone defense, the review board injects simultaneous chaos: pasting un-sanitized CSV records with non-breaking spaces, appending 5,000 new transactions, and modifying date slicers. A failure in the Power Query merge step creates a Cartesian product, freezing the presentation machine.",
        "tryItFriction": "Execute the full ApexSpreadsheet master test suite across 30 enterprise financial and data analysis scenarios; achieve 100% test pass rates across calculation accuracy, refresh speed, and model security.",
        "socraticHints": [
            "How does your ApexSpreadsheet model balance complex analytical power with intuitive usability for non-technical executive stakeholders?",
            "Why is end-to-end separation of concerns (Raw Data $\\to$ Power Query ETL $\\to$ Data Model $\\to$ Calculation Sheets $\\to$ Executive Dashboard) the gold standard of spreadsheet engineering?",
            "How do you prove to an executive audit committee that your financial formulas contain zero circular references, zero unmasked errors, and zero hardcoded assumptions?"
        ],
        "situationalPuzzle": {
            "scenario": "During your Capstone 1 Viva Gate, the Chief Financial Officer challenges your model: 'Your ApexSpreadsheet system powers our company's multi-million-dollar forecasts. What is your architectural protocol to guarantee that an accidental user edit cannot corrupt the financial projections?'. How does your architecture defend itself?",
            "options": [
                "Ask everyone politely not to edit the file.",
                "ApexSpreadsheet enforces Multi-Layered Governance & Defense-in-Depth: (1) Strict separation of tiers: raw data is ingested via automated Power Query with schema validation; (2) Master calculation sheets are locked and password-protected with proprietary formulas hidden; (3) Only validated input cells are unlocked for assumption entry; (4) Automated checksum formula cells (`#AUDIT_FLAG`) continuously verify balance sheet debits equals credits and alert on discrepancies.",
                "Tell the CFO that all spreadsheets break eventually.",
                "Store the numbers as images so nobody can edit them."
            ],
            "correctOptionIndex": 1,
            "debrief": "Enterprise spreadsheet reliability requires multi-layered architectural defense: automated ETL ingestion, strict cell locking, formula hiding, input validation boundaries, and continuous automated checksum validation flags."
        },
        "quests": [
            {
                "id": "Q34.117",
                "name": "ApexSpreadsheet Master Systems Architecture Blueprint",
                "type": "Concept",
                "desc": "Document the complete Month 1 Capstone architecture of ApexSpreadsheet, detailing the multi-tier data pipeline, relational lookup engine, Power Query ETL, and executive visual cockpit."
            },
            {
                "id": "Q34.118",
                "name": "ApexSpreadsheet Multi-Vector Model Failure Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Conduct a post-mortem on an enterprise spreadsheet failure where dirty data, un-refreshed caches, and un-anchored references combined to corrupt a board forecast."
            },
            {
                "id": "Q34.119",
                "name": "ApexSpreadsheet Production Platform Implementation",
                "type": "Mastery Assignment",
                "desc": "Implement the complete ApexSpreadsheet platform in Excel/Python, unifying all 30 days of foundational, dynamic, visual, financial, and ETL spreadsheet capabilities."
            },
            {
                "id": "Q34.120",
                "name": "ApexSpreadsheet Month 1 Grand Viva Defense & Chaos Gate",
                "type": "Production Incident Lab",
                "desc": "Defend ApexSpreadsheet before the Senior Technical Review Board under extreme data chaos, concurrent multi-file ETL refreshes, and adversarial model tampering probes."
            }
        ]
    }
]

out_path = Path(__file__).resolve().parent / "excel_data_viz_spec_m1_rest.py"

content = f'''# scripts/visuals/excel_data_viz_spec_m1_rest.py
# Month 1: Days 16 to 30 Specification for Course 34: Excel & Data Analysis Fundamentals (course-excel-data-viz)
# Conforms strictly to Gate v2 / True 9.8 standard across all 15 days (60 Quests: Q34.61 to Q34.120).

DAYS_16_TO_30 = {json.dumps(days_data, indent=2)}
'''

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} with {len(days_data)} days ({sum(len(d['quests']) for d in days_data)} quests).")
