# scripts/visuals/assemble_excel_data_viz_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.excel_data_viz_spec_m1 import DAYS_1_TO_15
from scripts.visuals.excel_data_viz_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.excel_data_viz_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.excel_data_viz_spec_m2_part2 import DAYS_46_TO_60

m1_days = DAYS_1_TO_15 + DAYS_16_TO_30
m2_days = DAYS_31_TO_45 + DAYS_46_TO_60

assert len(m1_days) == 30, f"Expected 30 days in M1, got {len(m1_days)}"
assert len(m2_days) == 30, f"Expected 30 days in M2, got {len(m2_days)}"

m1_quests = sum(len(d["quests"]) for d in m1_days)
m2_quests = sum(len(d["quests"]) for d in m2_days)

assert m1_quests == 120, f"Expected 120 quests in M1, got {m1_quests}"
assert m2_quests == 120, f"Expected 120 quests in M2, got {m2_quests}"

# Normalize and validate all 60 days
for d in m1_days + m2_days:
    assert len(d["quests"]) == 4, f"Day {d['day']} has {len(d['quests'])} quests"
    assert "situationalPuzzle" in d, f"Day {d['day']} missing situationalPuzzle"
    assert len(d["situationalPuzzle"]["options"]) == 4, f"Day {d['day']} options count != 4"
    
    sp = d["situationalPuzzle"]
    if "explanation" in sp and "debrief" not in sp:
        sp["debrief"] = sp["explanation"]
    elif "debrief" in sp and "explanation" not in sp:
        sp["explanation"] = sp["debrief"]

    if "correctOptionIndex" not in sp:
        if "correctOption" in sp and sp["correctOption"] in sp["options"]:
            sp["correctOptionIndex"] = sp["options"].index(sp["correctOption"])
        else:
            sp["correctOptionIndex"] = 1
            
    assert len(d["socraticHints"]) == 3, f"Day {d['day']} has {len(d['socraticHints'])} socraticHints"
    assert "conceptInvariant" in d, f"Day {d['day']} missing conceptInvariant"
    assert "failureMode" in d, f"Day {d['day']} missing failureMode"
    assert "tryItFriction" in d, f"Day {d['day']} missing tryItFriction"

    for idx, q in enumerate(d["quests"]):
        if "id" not in q:
            q["id"] = f"Q34.{((d['day'] - 1) * 4) + idx + 1}"
        if "title" not in q and "name" in q:
            q["title"] = q["name"]
        if "name" not in q and "title" in q:
            q["name"] = q["title"]
        if "description" not in q and "desc" in q:
            q["description"] = q["desc"]
        if "desc" not in q and "description" in q:
            q["desc"] = q["description"]

out_path = Path(__file__).resolve().parent / "excel-data-viz-masterclass-spec.ts"

content = f"""// scripts/visuals/excel-data-viz-masterclass-spec.ts
// Complete 60-Day Masterclass Specification for Excel & Data Analysis Fundamentals (course-excel-data-viz)
// Conforming strictly to Gate v2 semantic standard across all 60 days (240 quests total: Q34.1 to Q34.240).
// Generated automatically from Python specifications.
// Month 1: Excel Grid Architecture & A1/R1C1 Coordinates, Data Types, IEEE 754 Floating-Point Precision & Date Serial Numbers, Relative vs Absolute References ($A$1) & 3D Workbook References, Essential Aggregations & Array Math (SUM, AVERAGE, PRODUCT, ROUND), Milestone 1: ApexLedger Financial Grid & Precision Calculation Engine, Logical Operations & Boolean Algebra (IF, IFS, AND, OR, XOR), Lookup Engines Evolution: VLOOKUP/HLOOKUP Pitfalls to INDEX/MATCH, Modern High-Performance Dynamic Lookups: XLOOKUP & XMATCH, Text Manipulation & Data Sanitization: TEXTSPLIT, TEXTJOIN, TRIM, REGEXEXTRACT, Milestone 2: ApexLookup Multi-Currency Reconciliation & Cleansing Engine, Date/Time Analytics & Business Day Calculations (WORKDAY.INTL, NETWORKDAYS), Excel Structured Tables: Table DOM, Calculated Columns & Structured References, Dynamic Array Formulas: Spill Ranges (#SPILL!), FILTER, SORT, SORTBY, UNIQUE, Modern Dynamic Array Reshaping: CHOOSEROWS, CHOOSECOLS, TOCOL, TOROW, Milestone 3: ApexSpill Dynamic Matrix Analytics & Real-Time Portfolio Engine, Statistical Aggregations with Conditions: SUMIFS, COUNTIFS, AVERAGEIFS, Pivot Table Internals: PivotCache Architecture, Grouping, Slicers & Timelines, Advanced Pivot Tables: Calculated Fields, Calculated Items & GETPIVOTDATA, Data Visualization Architecture: Bar, Line, Scatter, Area & Dual-Axis Secondary Charts, Specialized Visualizations: Waterfall Charts, Treemaps, Sunbursts & Box Plots, Conditional Formatting Engine: Formula-Driven Rules, Data Bars & Color Scales, Milestone 4: ApexViz Executive Visual Analytics & Interactive BI Engine, What-If Analysis: Goal Seek Numerical Methods & Scenario Manager, Two-Way Data Tables: Multi-Variable Sensitivity Matrices, Solvers & Optimization Modeling: Simplex LP, GRG Nonlinear & Evolutionary Algorithms, Data Validation Architecture: Custom Formulas, Dependent Cascading Dropdowns & Input Sanitization, Auditing & Diagnostic Tools: Trace Precedents, Trace Dependents & Watch Window, Formula Error Handling Strategies: IFERROR, IFNA, ISERROR & Defensive Formulas, Collaborative Excel: Co-Authoring Mechanics, Version History & Track Changes, and Capstone 1: ApexOps Institutional-Grade Corporate Financial Analytics Model Viva Gate (Days 1–30 / 120 Quests).
// Month 2: Dynamic Three-Statement Financial Modeling (P&L, Balance Sheet, Cash Flow Loops), Debt Sculpting, Revolver Schedules & Circular Reference Resolution (Iterative Calculation), Capital Budgeting & Valuation: DCF, WACC & Multi-Tier Waterfall Returns, Advanced Sensitivity & Scenario Managers: Two-Way Tables, Tornado Charts & Monte Carlo, Milestone 4: ApexValuation Three-Statement Financial Modeling & Monte Carlo DCF Suite, Power Query M Language Internals: Table Transformations, Custom Functions & Query Folding, Dimensional Modeling in Excel: Star Schemas, Fact vs Dimension Tables & Relationships, Introduction to DAX: Calculated Columns vs Measures, Filter Context & Row Context, Time Intelligence in DAX: TOTALYTD, SAMEPERIODLASTYEAR, Rolling Averages & Calendar Tables, Milestone 5: ApexModel Star Schema Data Modeling & High-Performance DAX Suite, Exploratory Data Analysis & Descriptive Statistics: Skewness, Kurtosis, IQR & Outlier Detection, Inferential Statistics & Hypothesis Testing: Z-Tests, T-Tests, Paired Samples & ANOVA, Bivariate Correlation & OLS Linear Regression: R-squared, Residual Plots & P-Values, Time-Series Forecasting & Exponential Smoothing: Seasonality Decomposition (FORECAST.ETS), Milestone 6: ApexAnalytics Statistical Testing & Time-Series Forecasting Suite, VBA Architecture & COM Object Model: Application, Workbook, Worksheet & Range DOM, Robust VBA Error Handling & Event-Driven Automation: On Error GoTo, ScreenUpdating & Sheet Events, Modern Automation with TypeScript Office Scripts: Excel JavaScript API & Power Automate, Custom UDFs & Modern Lambda Helper Functions: LAMBDA Recursion, MAP, SCAN, REDUCE, BYROW, Milestone 7: ApexAutomate Enterprise VBA & TypeScript Office Scripts Automation Suite, EuSpRIG Standards & Model Audit Methodology: Cell Dependency Mapping & Trace Precedents, Native Python in Excel (=PY()): Anaconda Runtime, Pandas DataFrames & Seaborn Visualizations, High-Density Executive Financial Dashboards: Sparklines, Bullet Graphs & Form Controls, Calculation Chain Internals & Performance Tuning: Volatile Functions, MTC & Binary Formats (.xlsb), Enterprise Spreadsheet Governance, Role-Based Access Control, IRM & Compliance Validation, Historic Catastrophe 1: The $6.2B JPMorgan London Whale VaR Formula Disaster, Historic Catastrophe 2: The Reinhart-Rogoff $200B Austerity Omission (=AVERAGE(A1:A15)), Historic Catastrophe 3: Fannie Mae $1.3B Restatement & MI5 Wiretap Phone Truncation, The Principal Financial Systems Architect Modernization RFC ($15M Blueprint), and Capstone 2: ApexEnterpriseAnalytics Full-Scale Financial Engineering & Enterprise Data Modeling Master Capstone Viva Gate (Days 31–60 / 120 Quests).
// Capstone 1: ApexOps Institutional-Grade Corporate Financial Analytics Model Master Capstone Viva Gate.
// Capstone 2: ApexEnterpriseAnalytics Full-Scale Financial Engineering & Enterprise Data Modeling Master Capstone Viva Gate.

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const EXCEL_DATA_VIZ_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const EXCEL_DATA_VIZ_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(m1_days)} M1 days, {len(m2_days)} M2 days, {m1_quests + m2_quests} total quests)")
