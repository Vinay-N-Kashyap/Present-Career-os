# scripts/visuals/digital_accounting_spec_m1.py
# Days 1 to 15 Specification for Digital Accounting & Taxation (course-digital-accounting)
# Conforming strictly to Gate v2 semantic standard:
# 3-Tier Socratic Hint Ladders, Double-Entry Bookkeeping Principles & Accounting Equation Physics,
# Chart of Accounts (COA) Engineering & Multi-Tier Numbering, Digital Journal Voucher Processing,
# Sub-Ledger & General Ledger Control Reconciliation, Automated Bank Reconciliation (BRS),
# Accrual Accounting & Prepaid Amortization Schedules, Depreciation & Fixed Asset Registers (Schedule II),
# Enterprise ERP Topologies (Tally Prime, SAP FICO, Zoho Books API), Multi-Currency Accounting (Ind AS 21),
# Cost Center & Dimensional Profitability Allocation, and Inventory Valuation & COGS (Ind AS 2).

DAYS_1_TO_15 = [
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "Double-Entry Bookkeeping Principles & Accounting Equation Physics",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Accounting Core (Fundamental Mechanics & Ledger Physics)",
    "spokenGoal": "Welcome to Course 22: Digital Accounting & Taxation! Whether you are building financial enterprise software, managing statutory audits, or leading a corporate finance desk, all accounting is governed by an unshakeable mathematical identity: Assets = Liabilities + Equity. Every business transaction is a dual-aspect event. If money enters your bank account (Debit Asset), it must either be owed to a creditor (Credit Liability), contributed by owners (Credit Equity), or earned through revenue (Credit Income). In this session, you will dissect the Golden Rules of Accounting across Real, Personal, and Nominal accounts, map them to modern algebraic Debit/Credit signed conventions, and understand why a single out-of-balance journal voucher can corrupt financial statements, fail external audits, and trigger regulatory penalties!",
    "conceptInvariant": "Accounting Equation Invariant: In double-entry bookkeeping, the fundamental equation Assets = Liabilities + Equity must balance across every atomic transaction; the sum of all debits must strictly equal the sum of all credits.",
    "failureMode": "A junior accounting software developer permits one-sided journal vouchers during data migration; $4.5M in cash receipts are credited to the bank without a balancing debit, breaking the trial balance and halting the company's statutory financial audit for 3 weeks.",
    "tryItFriction": "Construct a Double-Entry Ledger Validator in TypeScript: ingest a stream of multi-line journal vouchers containing account IDs, debit amounts, and credit amounts; verify that sum(Debits) equals sum(Credits) for each atomic voucher; reject unbalanced vouchers with precise delta errors; and update account balance states.",
    "socraticHints": [
      "Why must total debits always equal total credits in every single journal voucher?",
      "Because every business transaction represents a transfer of value from a source (Credit) to a destination or application (Debit).",
      "If debits and credits do not balance, the accounting equation (Assets = Liabilities + Equity) is violated, creating phantom wealth or unrecorded obligations."
    ],
    "situationalPuzzle": {
      "scenario": "A corporate accountant records the purchase of $50,000 in office IT equipment on 30-day credit from a vendor. The accountant posts a Debit of $50,000 to 'IT Equipment' (Asset) and a Debit of $50,000 to 'Trade Payables' (Liability). At month-end, the trial balance shows total debits exceed total credits by $100,000. What fundamental rule was broken?",
      "options": [
        "IT equipment should be treated as an expense, not an asset.",
        "Incorrect Signage & Failure of Duality: Trade Payables is a Personal/Liability account. An increase in liabilities must be CREDITED, not debited. Debiting both sides doubled the debit skew, creating a $100,000 trial balance distortion.",
        "The vendor invoice was missing a purchase order number.",
        "Depreciation was not calculated immediately upon purchase."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Liabilities increase via Credit entries. When purchasing assets on credit, the asset increases (Debit Asset) and the liability increases (Credit Liability). Debiting both the asset and the liability doubles the debit column in the trial balance, producing an out-of-balance condition of exactly 2x the transaction value."
    },
    "quests": [
      {
        "num": 1,
        "title": "Double-Entry Bookkeeping Principles & Algebraic Sign Conventions",
        "type": "Concept Quest",
        "description": "Analyze the Golden Rules of Accounting, algebraic debit/credit duality, and the mathematical proof of the fundamental accounting equation."
      },
      {
        "num": 2,
        "title": "Trial Balance Discrepancy & Unbalanced Voucher Forensics",
        "type": "Detective Challenge",
        "description": "Examine a corrupted legacy transaction journal to isolate asymmetric debit/credit vouchers and compute the exact reconciliation variance."
      },
      {
        "num": 3,
        "title": "Atomic Journal Voucher Validation Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build an atomic journal validation engine in TypeScript enforcing debit/credit balance equality and updating running ledger balances."
      },
      {
        "num": 4,
        "title": "High-Volume Unbalanced Voucher Interception Lab",
        "type": "Production Incident Lab",
        "description": "Process 10,000 synthetic vouchers with injected 1-cent rounding and asymmetric postings, asserting 100% interception before ledger commitment."
      }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "Chart of Accounts (COA) Engineering & Multi-Tier Classification",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Accounting Architecture (COA Hierarchies & GL Numbering)",
    "spokenGoal": "In enterprise accounting, chaos ensues if every branch office invents its own account names. An enterprise Chart of Accounts (COA) is the architectural blueprint of an organization's financial data model. Today, you will engineer a standardized, scalable Multi-Tier Chart of Accounts. You will master standard 4-digit and 6-digit General Ledger (GL) numbering systems (e.g., 1000s for Assets, 2000s for Liabilities, 3000s for Equity, 4000s for Revenues, 5000s for Cost of Goods Sold, and 6000s for Operating Expenses). You will design parent-child account hierarchies that roll up smoothly into Balance Sheets and Profit & Loss statements, and decouple statutory statutory accounts from operational management cost centers!",
    "conceptInvariant": "COA Hierarchy Invariant: Every General Ledger account must map uniquely into one of the five primary accounting classes; leaf accounts record transactional activity while parent accounts aggregate balances without direct journal postings.",
    "failureMode": "Allowing direct journal postings to top-level parent summary accounts in an ERP; parent totals decouple from sub-account rollups, producing contradictory balance sheets where departmental sums do not equal company totals.",
    "tryItFriction": "Build a Hierarchical Chart of Accounts Engine in TypeScript: model a tree of GL accounts with code ranges (1000-5999); enforce that transactions post only to leaf nodes; implement recursive balance rollup from child accounts to parent categories; and assert that total assets equal total liabilities plus equity across the tree.",
    "socraticHints": [
      "Why should transactional vouchers never be posted directly to parent category accounts (e.g. Account 1000: 'Current Assets')?",
      "Parent accounts exist purely to summarize and report the aggregated balances of their underlying leaf sub-accounts.",
      "Posting directly to a parent corrupts child rollup integrity and prevents detailed departmental auditing."
    ],
    "situationalPuzzle": {
      "scenario": "A fast-growing retail chain has 85 stores. Each store manager creates new GL accounts in the ERP whenever they buy supplies. By year-end, the company has 4,200 active GL accounts, including 'Coffee Cups', 'Paper Towels', and 'Kitchen Supplies' under both Asset, Expense, and Liability headers! The statutory auditor refuses to sign off on the financial statements. What architectural governance was missing?",
      "options": [
        "The ERP had insufficient server memory.",
        "Centralized COA Governance & Account Coding Structure: The firm lacked a standardized Chart of Accounts with strict code masks and account creation permissions. Leaf accounts should have been standardized under a controlled operating expense category (e.g. 6120: Office Supplies) with store-level cost center tagging.",
        "The store managers should have used cash instead of the ERP.",
        "The auditor was unfamiliar with retail business."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Without centralized COA governance, unconstrained account creation fragments financial reporting. Best practice enforces a locked master COA where accounts represent financial categories and operational dimensions (such as store location or department) are handled via cost center tags."
    },
    "quests": [
      {
        "num": 1,
        "title": "Enterprise Chart of Accounts Structuring & Numbering Schemes",
        "type": "Concept Quest",
        "description": "Analyze standard 4-digit and 6-digit GL numbering architectures, parent-child aggregation, and dimensional reporting models."
      },
      {
        "num": 2,
        "title": "Fragmented COA Sprawl & Disaggregated Rollup Forensics",
        "type": "Detective Challenge",
        "description": "Audit an unstructured enterprise account catalog to identify redundant accounts, misclassified categories, and broken parent-child links."
      },
      {
        "num": 3,
        "title": "Recursive COA Tree Aggregator Implementation",
        "type": "Mastery Assignment",
        "description": "Implement a hierarchical Chart of Accounts tree engine in TypeScript featuring strict leaf-only posting and automated recursive balance rollups."
      },
      {
        "num": 4,
        "title": "Multi-Entity Consolidated Rollup Stress Lab",
        "type": "Production Incident Lab",
        "description": "Ingest 500 leaf account balances across 3 subsidiary entities and verify that the consolidated trial balance preserves perfect mathematical parity."
      }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "Digital Journal Voucher Processing & Document Numbering Sequences",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Accounting Operations (Voucher Types & Document Numbering)",
    "spokenGoal": "Every transaction entering an accounting database must be documented by an immutable Digital Journal Voucher. In modern ERP systems, vouchers are classified by economic intent: Contra Vouchers (cash-to-bank or bank-to-bank transfers), Payment Vouchers (disbursing funds to vendors), Receipt Vouchers (collecting funds from customers), Sales Vouchers (invoicing revenue), Purchase Vouchers (recording vendor bills), and General Journal Vouchers (non-cash adjustments and depreciation). Today, you will build an enterprise Voucher Processing Engine. You will enforce strictly sequential, gapless document numbering sequences (e.g., PV-2026-0001, PV-2026-0002) mandated by tax authorities and statutory auditors to prevent backdating, hidden deletions, and fraudulent double-invoicing!",
    "conceptInvariant": "Document Numbering Invariant: Accounting vouchers within a series must maintain continuous, chronological, gapless sequential numbering; missing numbers or out-of-order timestamps violate statutory compliance and indicate transaction tampering.",
    "failureMode": "An ERP database uses auto-increment primary keys that skip numbers when failed transactions rollback; the tax authority audits the sales register, discovers 45 missing invoice numbers, assumes undeclared revenue, and issues a 200% tax penalty.",
    "tryItFriction": "Construct a Gapless Document Numbering and Voucher Processor in TypeScript: define voucher types (Payment, Receipt, Journal, Contra); implement transactional document number reservation with atomic concurrency locks; detect and flag any sequence gaps; and prevent retrospective backdating beyond closed fiscal periods.",
    "socraticHints": [
      "Why do tax authorities and auditors view missing document sequence numbers as evidence of fraud?",
      "A missing number (e.g. Invoice #104 followed by #106) implies an invoice was issued, paid in cash, and deleted from the books to evade income tax and GST.",
      "Therefore, vouchers must be gapless; cancelled vouchers must be retained in the database with a 'VOID' status rather than deleted."
    ],
    "situationalPuzzle": {
      "scenario": "During a financial year audit, the statutory auditor flags that Payment Voucher PV-0422 is dated March 28th, but PV-0421 is dated April 2nd. Furthermore, PV-0399 is completely missing from the ledger. The finance manager claims the database sequence simply skipped during a server restart. How does the auditor classify this finding under CARO / ISA audit guidelines?",
      "options": [
        "Normal IT operational glitch; no action required.",
        "Critical Internal Control Deficiency & Potential Backdating: Missing sequence numbers and non-chronological dates suggest unauthorized backdating of transactions after period-close or deletion of records, representing a major audit qualification and control failure.",
        "The calendar software had a leap year bug.",
        "The ERP vendor should issue a software refund."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under statutory auditing standards (such as CARO in India or SOX in the US), voucher sequences must be chronological and gapless. Non-chronological numbers indicate backdated entries (often used to artificially shift profits across tax years), and missing numbers suggest deleted records."
    },
    "quests": [
      {
        "num": 1,
        "title": "Voucher Classification Taxonomy & Sequential Numbering Standards",
        "type": "Concept Quest",
        "description": "Analyze voucher types (Contra, Payment, Receipt, Sales, Purchase, Journal) and statutory rules for gapless chronological numbering."
      },
      {
        "num": 2,
        "title": "Sequence Gap & Backdated Voucher Forensics",
        "type": "Detective Challenge",
        "description": "Inspect transactional audit logs to identify sequence gaps, out-of-order voucher timestamps, and retrospective ledger modifications."
      },
      {
        "num": 3,
        "title": "Gapless Voucher Numbering & Validation Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build an enterprise voucher posting engine in TypeScript with atomic sequence generation, void handling, and period-lock enforcement."
      },
      {
        "num": 4,
        "title": "Concurrent Voucher Posting & Sequence Parity Lab",
        "type": "Production Incident Lab",
        "description": "Submit 5,000 concurrent vouchers across 10 threads, verifying that all document numbers are strictly consecutive with zero duplicates or gaps."
      }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "Sub-Ledgers & General Ledger Control Reconciliation",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Accounting Systems (Accounts Receivable & Accounts Payable Control)",
    "spokenGoal": "If a corporation has 10,000 corporate customers and 5,000 suppliers, recording every individual transaction directly in the General Ledger would create an unreadable monstrosity. Enterprise accounting decouples detailed customer and supplier transactions into Subsidiary Ledgers (Sub-Ledgers): Accounts Receivable (AR) Sub-Ledger and Accounts Payable (AP) Sub-Ledger. In the General Ledger, a single summary account called the 'Control Account' mirrors the total balance. Today, you will master Sub-Ledger to General Ledger Control Reconciliation. You will understand how individual vendor invoices and customer receipts update party balances, how contra settlements work when a party is both a customer and a vendor, and how to detect and resolve Control Account variances caused by manual direct journal entries!",
    "conceptInvariant": "Control Account Invariant: The balance of the General Ledger Control Account must exactly equal the algebraic sum of all individual open party balances in the corresponding Subsidiary Ledger at all times.",
    "failureMode": "A finance executive posts a manual journal entry directly to the GL Trade Debtors Control Account to correct an audit adjustment without updating individual customer sub-ledger balances; the AR sub-ledger drifts from the GL by $320,000, paralyzing customer credit management.",
    "tryItFriction": "Construct an AR/AP Sub-Ledger and Control Account Reconciler in TypeScript: maintain individual party balances; process sales invoices, payments, and contra settlements; compute the aggregate sub-ledger balance; compare against the GL Control Account; and flag any unlinked direct postings.",
    "socraticHints": [
      "What is the single most common cause of a variance between an AR Sub-Ledger and the GL Trade Debtors Control Account?",
      "Direct manual journal entries posted to the GL Control Account that bypass the sales invoicing or customer payment modules.",
      "In modern ERPs, GL Control Accounts must be locked against direct manual journal postings to preserve sub-ledger synchronization."
    ],
    "situationalPuzzle": {
      "scenario": "At month-end close, the GL Trade Payables Control Account shows a balance of $1,450,000. However, when the accounts team runs the detailed Vendor Aging Report (sum of all open vendor sub-ledgers), the total is $1,410,000. The CFO cannot close the books due to the $40,000 variance. An audit search reveals a manual journal voucher debiting 'Legal Expense' and crediting 'Trade Payables' directly. What was the architectural mistake?",
      "options": [
        "The legal expense was non-tax-deductible.",
        "Bypassing the AP Sub-Ledger via Direct Control Posting: The entry was posted directly to the GL Trade Payables account without associating a specific Vendor Sub-Ledger ID. The GL balance increased by $40,000 while the vendor sub-ledger remained unchanged, breaking reconciliation parity.",
        "The legal firm was not registered in the ERP.",
        "Trade payables should always be debited."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. When an entry is posted directly to a GL Control Account without a sub-ledger party reference, the GL moves but the individual party balances do not. Best practice in enterprise ERPs is to configure Control Accounts as 'system-only', prohibiting manual journal entries."
    },
    "quests": [
      {
        "num": 1,
        "title": "Sub-Ledger Architecture & Control Account Mechanics",
        "type": "Concept Quest",
        "description": "Analyze the relationship between Accounts Receivable/Payable sub-ledgers, GL control accounts, and contra settlement mechanics."
      },
      {
        "num": 2,
        "title": "Control Account Disconnect & Unlinked Journal Forensics",
        "type": "Detective Challenge",
        "description": "Investigate reconciliation variances between the GL Control Account and party aging schedules to identify rogue manual journals."
      },
      {
        "num": 3,
        "title": "Sub-Ledger to GL Reconciler & Party Ledger Implementation",
        "type": "Mastery Assignment",
        "description": "Implement a dual-layer sub-ledger and GL control reconciliation engine in TypeScript preventing unlinked manual journal entries."
      },
      {
        "num": 4,
        "title": "Contra Settlement & Multi-Party Reconciliation Lab",
        "type": "Production Incident Lab",
        "description": "Execute 1,000 party transactions including cross-entity contra settlements, verifying zero discrepancy between sub-ledgers and GL controls."
      }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "Milestone Project 1: Enterprise Double-Entry Ledger Engine & Real-Time Trial Balance Generator",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Milestone Project (Core Accounting Engine & Trial Balance)",
    "spokenGoal": "Congratulations on completing Block 1! Today is Milestone Project 1: you will architect, implement, and benchmark an integrated, enterprise-grade Double-Entry Ledger Engine & Real-Time Trial Balance Generator. Your engine will ingest multi-currency, multi-party digital journal vouchers across all 6 voucher types, enforce gapless sequential numbering, maintain a standardized multi-tier Chart of Accounts, synchronize Accounts Receivable and Accounts Payable sub-ledgers with locked GL Control Accounts, and generate an instantaneous, mathematically balanced Trial Balance on demand. You will prove that your accounting core enforces zero unbalanced entries, zero sequence skips, and absolute mathematical parity under high transaction volume!",
    "conceptInvariant": "Ledger Core Invariant: An institutional ledger engine must guarantee transactional atomicity, gapless document sequencing, control account synchronization, and real-time trial balance equality under concurrent multi-user load.",
    "failureMode": "Deploying a ledger engine where a concurrent thread crash leaves half of a multi-line voucher committed to the database; the database becomes permanently out-of-balance, corrupting financial reporting for all future accounting periods.",
    "tryItFriction": "Construct the Milestone 1 Double-Entry Engine in TypeScript: unite voucher validation, gapless numbering, hierarchical COA aggregation, sub-ledger control sync, and trial balance generation; run a 2,500-voucher end-to-end stress run asserting total debits equal total credits to 4 decimal places with zero unhandled exceptions.",
    "socraticHints": [
      "What are the four non-negotiable validations required before committing any voucher to the general ledger?",
      "1. Mathematical equality: sum(Debits) === sum(Credits).",
      "2. Account validity: all accounts must exist and be leaf nodes in the active COA.",
      "3. Gapless sequence: document number must be strictly next in the series.",
      "4. Period lock: transaction date must belong to an open accounting period."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 1 engine is processing 1,000 transactions during month-end close. A network glitch interrupts a 4-line payroll voucher after inserting 2 debit lines but before inserting the corresponding tax withholding and net salary credit lines. Your engine's database transaction rolls back, but an in-memory account balance cache was already updated, causing the trial balance to report a $85,000 imbalance! How must the architecture be corrected?",
      "options": [
        "Delete the payroll voucher manually.",
        "Transactional State Isolation & Two-Phase Commit: In-memory cache updates must never occur prior to database transaction commitment. State modifications must be staged in a temporary transaction context and applied to cache only upon verified ACID commit confirmation.",
        "Change the trial balance calculation to ignore payroll.",
        "Restart the server every 10 minutes."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In financial ledger engines, memory state must never precede durable storage. If a database transaction aborts or rolls back, in-memory caches must not retain dirty uncommitted balances. Strict transactional boundaries prevent ledger desynchronization."
    },
    "quests": [
      {
        "num": 1,
        "title": "Double-Entry Enterprise Core Architecture Blueprint",
        "type": "Concept Quest",
        "description": "Design the end-to-end architecture connecting voucher ingestion, COA tree aggregation, sub-ledger synchronization, and trial balance generation."
      },
      {
        "num": 2,
        "title": "Partial Transaction Commit & Ledger Corruption Forensics",
        "type": "Detective Challenge",
        "description": "Analyze database logs following a mid-transaction crash to trace how uncommitted memory updates corrupted real-time trial balances."
      },
      {
        "num": 3,
        "title": "Milestone 1 Engine Implementation: Core Accounting Platform",
        "type": "Mastery Assignment",
        "description": "Build the complete Milestone 1 engine in TypeScript with atomic multi-line voucher posting, locked control accounts, and live trial balance reporting."
      },
      {
        "num": 4,
        "title": "Milestone 1 High-Volume Concurrency & Balance Verification Lab",
        "type": "Production Incident Lab",
        "description": "Execute 2,500 multi-voucher transactions under concurrent load, verifying zero balance errors and 100% trial balance parity."
      }
    ]
  },
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "Bank Reconciliation Statement (BRS) Automation & 2-Way Matching",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Treasury Operations (Bank Reconciliation & Automated Matching)",
    "spokenGoal": "In the real world, the cash balance recorded in your company's accounting books NEVER matches the balance displayed on your bank statement at month-end! Why? Because of timing differences: cheques issued to vendors that have not yet been presented at the bank, cheques deposited that are still clearing, direct debits for bank charges deducted without prior notice, and customer direct bank transfers unrecorded in the books. Today, you will build an Automated Bank Reconciliation Statement (BRS) Engine. You will ingest electronic bank statement feeds (MT940, CAMT.053, and CSV formats), implement 2-Way Fuzzy Matching algorithms pairing bank lines with ledger cash entries using transaction amounts, dates, and reference numbers, and generate automated adjusting journal entries for bank charges and interest!",
    "conceptInvariant": "Bank Reconciliation Invariant: The adjusted book balance (Book Balance + Unrecorded Credits - Unrecorded Debits) must strictly equal the adjusted bank balance (Bank Statement Balance + Deposits in Transit - Outstanding Cheques).",
    "failureMode": "A company performs manual bank reconciliations once a quarter; an undetected employee payroll diversion skimming $15,000 monthly goes unnoticed for 6 months because unpresented cheques were never matched against bank clearance timestamps.",
    "tryItFriction": "Construct an Automated BRS Matching Engine in TypeScript: ingest a company cash ledger and a mock MT940 bank statement; implement exact amount matching with configurable date tolerance windows (+/- 3 days); identify unpresented cheques and deposits in transit; and generate a balanced BRS report with automated adjusting journals.",
    "socraticHints": [
      "What is the mathematical relationship between the balance as per bank statement and balance as per cash book?",
      "Balance as per Cash Book + Cheques issued but not presented - Cheques deposited but not cleared + Direct credits - Direct debits = Balance as per Bank Statement.",
      "Any residual unexplained difference indicates an unrecorded transaction, bank error, or fraudulent entry."
    ],
    "situationalPuzzle": {
      "scenario": "A company's cash book shows a bank balance of $250,000 on June 30th. The bank statement reports a balance of $310,000. The accountant notes: Cheques issued to suppliers totaling $80,000 have not been presented; cheques deposited totaling $30,000 have not yet cleared; bank service charges of $2,000 were deducted by the bank; and a customer made a direct wire transfer of $12,000 unrecorded in the books. What is the true adjusted cash balance?",
      "options": [
        "$250,000",
        "$260,000: Starting with Cash Book ($250,000) + Direct Customer Credit ($12,000) - Bank Charges ($2,000) = $260,000. Starting with Bank Statement ($310,000) + Cheques in transit ($30,000) - Unpresented cheques ($80,000) = $260,000. Both adjusted balances match perfectly!",
        "$310,000",
        "$280,000"
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. The true economic cash balance is $260,000. The cash book must be adjusted for unrecorded transactions (+$12,000 customer deposit, -$2,000 bank charge), bringing it to $260,000. Meanwhile, the bank statement timing differences ($310,000 + $30,000 transit - $80,000 unpresented) also reconcile to exactly $260,000."
    },
    "quests": [
      {
        "num": 1,
        "title": "Bank Reconciliation Physics & Electronic Statement Formats",
        "type": "Concept Quest",
        "description": "Analyze timing differences, bank statement standards (MT940, CAMT.053), and mathematical BRS proof formulas."
      },
      {
        "num": 2,
        "title": "Unmatched Cheque Aging & Fraudulent Diversion Forensics",
        "type": "Detective Challenge",
        "description": "Audit historical bank reconciliation files to detect stale unpresented cheques masking unauthorized cash withdrawals."
      },
      {
        "num": 3,
        "title": "Automated 2-Way BRS Matching Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build an automated bank reconciliation engine in TypeScript matching ledger and statement lines with configurable fuzzy heuristics."
      },
      {
        "num": 4,
        "title": "Complex Multi-Account Statement Reconciliation Lab",
        "type": "Production Incident Lab",
        "description": "Reconcile 1,000 bank transactions with 15% timing discrepancy rates, verifying automated adjusting entries and zero unexplained variance."
      }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "Petty Cash Float, Imprest Systems & Corporate Card Expense Digital Ingestion",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Treasury Operations (Petty Cash & Expense Management)",
    "spokenGoal": "Not every business expenditure goes through a formal $50,000 procurement purchase order. Daily office operations require small cash outlays: tea, courier fees, taxi fares, and emergency supplies. However, petty cash is the single easiest vector for internal employee theft and leakage. Today, you will master the Imprest System of Petty Cash. In an imprest system, the custodian is given a fixed cash float (e.g. $1,000). As expenses occur, cash is disbursed ONLY in exchange for signed petty cash vouchers and receipts. At replenishment time, the custodian receives an exact reimbursement equal to the vouchers submitted, returning the physical cash plus vouchers back to the initial float. You will also architect modern digital expense management systems ingesting corporate credit card feeds, performing OCR receipt scanning, and enforcing spend limits!",
    "conceptInvariant": "Imprest System Invariant: At any point in time, the sum of physical cash remaining in the petty cash box plus total un-replenished expense vouchers must strictly equal the authorized imprest float amount.",
    "failureMode": "Operating an open petty cash drawer without imprest limits; the custodian mingles personal cash with company cash, and an unannounced cash audit discovers a $4,200 shortage that has accumulated over 18 months without receipts.",
    "tryItFriction": "Construct an Imprest Petty Cash Management and Reimbursement Engine in TypeScript: initialize a float of $1,000; record daily petty disbursements with category codes; compute physical cash balance vs voucher totals; generate replenishment reimbursement vouchers; and flag any unvouched cash deficits.",
    "socraticHints": [
      "Why is the Imprest System far superior to simply giving a branch manager a lump-sum cash advance and topping it up randomly?",
      "In an imprest system, the float is fixed and reimbursement requires presenting verified expense vouchers matching the exact disbursement amount.",
      "This prevents cash hoarding and forces immediate accounting for every dollar spent."
    ],
    "situationalPuzzle": {
      "scenario": "A company maintains an authorized petty cash float of $2,000 under the imprest system. An unannounced audit by internal compliance opens the petty cash tin and counts $650 in physical currency. The custodian presents approved expense vouchers totaling $1,150. The custodian claims everything is in order. What should the auditor report?",
      "options": [
        "The account is balanced because $650 is greater than zero.",
        "Cash Shortage / Unaccounted Deficit of $200: Under the imprest rule, Physical Cash ($650) + Approved Vouchers ($1,150) equals $1,800. The authorized float is $2,000. There is an unexplained $200 cash shortage that must be investigated as potential misappropriation or unrecorded expense.",
        "The authorized float should be increased to $2,500.",
        "The vouchers should be destroyed to balance the cash."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In an imprest system, Cash on Hand + Vouchers must ALWAYS equal the authorized float. Here, $650 + $1,150 = $1,800, revealing a $200 shortfall. The custodian is personally liable for explaining or reimbursing the deficit."
    },
    "quests": [
      {
        "num": 1,
        "title": "Imprest Petty Cash Architecture & Digital Expense Workflow",
        "type": "Concept Quest",
        "description": "Analyze the mathematical foundation of the imprest system, corporate card API ingestion, and spend categorization governance."
      },
      {
        "num": 2,
        "title": "Petty Cash Deficit & Fraudulent Voucher Splitting Forensics",
        "type": "Detective Challenge",
        "description": "Audit petty cash ledgers to detect invoice splitting designed to evade single-transaction authorization limits."
      },
      {
        "num": 3,
        "title": "Imprest Management & Reimbursement Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Implement a digital petty cash and corporate card tracking engine in TypeScript with automated replenishment voucher generation."
      },
      {
        "num": 4,
        "title": "Simulated Unannounced Audit & Cash Deficit Interception Lab",
        "type": "Production Incident Lab",
        "description": "Process 500 expense disbursements with injected cash-drop discrepancies, verifying that the audit engine flags all float variances instantly."
      }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "Accrual Accounting, Deferred Revenue & Prepaid Expense Amortization Schedules",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Accounting Principles (Accruals, Prepayments & Deferrals)",
    "spokenGoal": "Under cash-basis accounting, you record revenue when money hits the bank and expenses when cash leaves. Cash accounting is simple, but it is illegal for corporations and distorts financial reality! If an enterprise signs a 12-month SaaS customer contract for $120,000 paid upfront on January 1st, recognizing all $120,000 as January revenue would show massive fake profitability in January followed by 11 months of losses! Today, you will master Accrual Accounting and the Revenue Matching Principle. You will model Deferred Revenue (Contract Liabilities under IFRS 15 / Ind AS 115) and Prepaid Expenses (Assets), building automated monthly amortization schedules that recognize revenue and expenses strictly as services are delivered over time!",
    "conceptInvariant": "Accrual Matching Invariant: Revenue must be recognized when performance obligations are satisfied regardless of cash receipt; expenses must be recognized in the accounting period in which the corresponding benefit is consumed.",
    "failureMode": "Recognizing 100% of upfront annual cloud contract payments as immediate revenue; the company shows $12M revenue in Q1, but runs out of operational cash in Q3 and faces an SEC / MCA financial restatement for revenue inflation.",
    "tryItFriction": "Construct an Accrual and Amortization Engine in TypeScript: ingest multi-year upfront payments (e.g. annual insurance $24,000, 3-year SaaS contract $36,000); generate monthly straight-line amortization schedules; post monthly adjusting journal entries from Prepaid Expense / Deferred Revenue to Expense / Revenue accounts; and verify zero revenue acceleration.",
    "socraticHints": [
      "Why is unearned upfront customer cash considered a Liability (Deferred Revenue) rather than an Asset on the balance sheet?",
      "Cash received increases Bank (Asset), but the company has an unfulfilled obligation to deliver services over the coming months.",
      "Until the service is delivered, the customer has a legal claim to a refund if performance fails, making it a liability."
    ],
    "situationalPuzzle": {
      "scenario": "On July 1st, a technology company pays $60,000 upfront for an annual enterprise cybersecurity insurance policy covering July 1, 2026 through June 30, 2027. The company's fiscal year ends December 31, 2026. What entries must appear on the December 31st financial statements?",
      "options": [
        "Insurance Expense: $60,000 on P&L; Prepaid Insurance: $0 on Balance Sheet.",
        "Insurance Expense: $30,000 on P&L (6 months consumed); Prepaid Insurance Asset: $30,000 on Balance Sheet (6 months remaining).",
        "Insurance Expense: $0 on P&L; Prepaid Insurance Asset: $60,000 on Balance Sheet.",
        "Insurance Expense: $5,000 on P&L; Cash: $55,000 on Balance Sheet."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under accrual accounting, the $60,000 annual cost is amortized at $5,000 per month. By December 31st, 6 months of insurance coverage have elapsed ($30,000 recognized as P&L expense), while 6 months remain unexpired ($30,000 carried on the balance sheet as a Prepaid Expense Current Asset)."
    },
    "quests": [
      {
        "num": 1,
        "title": "Accrual Accounting, IFRS 15 Revenue Matching & Contract Liabilities",
        "type": "Concept Quest",
        "description": "Analyze accrual accounting principles, performance obligation milestones under IFRS 15, and prepaid amortization mechanics."
      },
      {
        "num": 2,
        "title": "Revenue Acceleration & Unearned Deferred Income Forensics",
        "type": "Detective Challenge",
        "description": "Investigate financial restatement cases where upfront contract payments were improperly recognized as immediate revenue."
      },
      {
        "num": 3,
        "title": "Automated Amortization Schedule & Adjusting Journal Engine",
        "type": "Mastery Assignment",
        "description": "Build an amortization schedule engine in TypeScript calculating daily and monthly recognition schedules with automated adjusting journals."
      },
      {
        "num": 4,
        "title": "Multi-Tenor Subscription Deferred Revenue Simulation Lab",
        "type": "Production Incident Lab",
        "description": "Simulate 1,000 multi-period SaaS customer subscriptions, verifying that cumulative recognized revenue exactly matches elapsed time."
      }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "Depreciation & Fixed Asset Register (FAR) Accounting",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Asset Accounting (Depreciation Methods & Schedule II Standards)",
    "spokenGoal": "When a manufacturing plant buys a $1,000,000 industrial stamping press, expensing the full million dollars on day one would devastate that month's earnings. Because the machine will generate economic value for 10 years, capital expenditures must be capitalized on the Balance Sheet as Fixed Assets and amortized gradually over their useful life: Depreciation. Today, you will build an automated Fixed Asset Register (FAR) and Depreciation Engine. You will implement Straight-Line Method (SLM) and Written-Down Value (WDV / Diminishing Balance Method), apply statutory asset life guidelines under Companies Act 2013 Schedule II, calculate residual scrap values, and account for asset disposals, impairments, and revaluation reserves!",
    "conceptInvariant": "Depreciation Invariant: Fixed assets must be depreciated systematically over their estimated useful economic life; accumulated depreciation cannot exceed asset historical cost minus estimated residual scrap value.",
    "failureMode": "Continuing to calculate straight-line depreciation on fully depreciated computer equipment; the book value drops below zero into negative territory, corrupting the fixed asset schedule and failing statutory audit checks.",
    "tryItFriction": "Construct a Fixed Asset Register (FAR) and Depreciation Engine in TypeScript: track asset tags, acquisition dates, historical cost, and salvage value; implement both SLM and WDV calculation algorithms; generate monthly depreciation vouchers; and enforce hard book-value floors at salvage value.",
    "socraticHints": [
      "What is the key mathematical difference between Straight-Line Method (SLM) and Written-Down Value (WDV) depreciation?",
      "SLM charges a constant dollar amount every year: (Cost - Salvage Value) / Useful Life.",
      "WDV applies a constant percentage rate against the declining Net Book Value each year, resulting in higher depreciation in early years and smaller charges in later years."
    ],
    "situationalPuzzle": {
      "scenario": "A corporation purchases servers for $100,000 with an estimated useful life of 3 years and a residual salvage value of $10,000 under Straight-Line Method. In Year 4, the junior accountant runs the monthly depreciation batch job. The engine records another $30,000 depreciation expense, reducing Net Book Value to -$20,000! What architectural guardrail was missing?",
      "options": [
        "Servers do not depreciate.",
        "Depreciation Floor Guardrail Failure: Depreciation must cease the moment Net Book Value reaches the asset's residual salvage value ($10,000). The engine must enforce `Depreciation = min(CalculatedDepreciation, NetBookValue - SalvageValue)` to prevent negative asset balances.",
        "The servers should have been sold in Year 2.",
        "WDV should have been used instead of SLM."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. An asset can never be depreciated below its estimated residual scrap value. Fixed asset engines must evaluate remaining depreciable balance prior to posting, clamping periodic depreciation to ensure Net Book Value never breaches the salvage threshold."
    },
    "quests": [
      {
        "num": 1,
        "title": "Fixed Asset Accounting, SLM/WDV Formulas & Schedule II Standards",
        "type": "Concept Quest",
        "description": "Analyze statutory fixed asset rules, component accounting under Ind AS 16, and mathematical derivations of SLM and WDV."
      },
      {
        "num": 2,
        "title": "Over-Depreciation & Negative Book Value Audit Forensics",
        "type": "Detective Challenge",
        "description": "Inspect a fixed asset register to identify orphan assets that continued depreciating past their useful economic life."
      },
      {
        "num": 3,
        "title": "Fixed Asset Register & Automated Depreciation Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build an enterprise Fixed Asset Register in TypeScript with automated monthly depreciation scheduling and salvage floor enforcement."
      },
      {
        "num": 4,
        "title": "Asset Disposal & Capital Gain/Loss Settlement Lab",
        "type": "Production Incident Lab",
        "description": "Simulate the mid-year disposal of 100 fixed assets, verifying accurate reversal of accumulated depreciation and realized gain/loss posting."
      }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "Milestone Project 2: Automated Bank Reconciliation & Fixed Asset Amortization Platform",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Milestone Project (Treasury Matching & Asset Lifecycle Platform)",
    "spokenGoal": "Outstanding progress! You have completed Block 2. Today is Milestone Project 2: you will engineer an integrated Treasury & Asset Lifecycle Platform combining automated Bank Reconciliation (BRS), Imprest Petty Cash management, Accrual Amortization schedules, and a Fixed Asset Register (FAR). Your platform will ingest electronic bank statement feeds and match them against internal ledger lines with 2-way fuzzy tolerance, manage an imprest petty cash float with deficit anomaly alerts, amortize multi-period prepaid expenses and deferred revenues, and run monthly depreciation batches adhering strictly to statutory salvage value floors. You will verify full operational integrity across 1,000 mixed treasury and asset events with zero balance drift!",
    "conceptInvariant": "Treasury & Asset Platform Invariant: A financial operations platform must atomically synchronize cash reconciliation, accrual amortization, and asset depreciation with the core general ledger, preserving mathematical parity across balance sheet accounts.",
    "failureMode": "Running an automated asset depreciation batch that posts $450,000 in depreciation vouchers while the bank reconciliation module is processing unpresented cheques; a database deadlock rolls back the cash ledger while leaving depreciation committed, creating an irreconcilable financial variance.",
    "tryItFriction": "Construct the Milestone 2 Platform in TypeScript: combine BRS 2-way fuzzy matching, imprest float tracking, prepaid/deferred amortization schedules, and FAR depreciation scheduling; run a 1,000-event stress scenario asserting 100% matched transactions and zero negative asset values.",
    "socraticHints": [
      "What are the four core subsystems united in Milestone Project 2?",
      "1. Automated Bank Reconciliation (BRS 2-way matching, timing difference classification).",
      "2. Imprest Petty Cash Management (float verification, voucher replenishment).",
      "3. Accruals & Deferrals (straight-line recognition, monthly adjusting entries).",
      "4. Fixed Asset Register (FAR tracking, SLM/WDV depreciation with salvage floors)."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 2 platform runs its monthly close routine. It matches $2M in bank transactions, recognizes $150,000 in deferred revenue, and calculates $45,000 in fixed asset depreciation. The auditor performs a spot-check on Asset #FAR-109 (Laptop fleet) and discovers its Net Book Value is $0.00, but its salvage value was specified as $5,000. How does the evaluator score this?",
      "options": [
        "Acceptable: $0 is cleaner than $5,000.",
        "Defective Asset Floor Logic: Breaching salvage value violates statutory accounting standards (Ind AS 16 / Schedule II). The FAR engine must halt depreciation when Net Book Value hits the defined salvage value ($5,000).",
        "Acceptable if the laptops were recycled.",
        "The auditor should ignore small amounts."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In statutory accounting, an asset must not be depreciated below its defined salvage value. An automated depreciation engine that over-depreciates assets to zero despite an explicit salvage value indicates flawed boundary checking that will trigger audit qualifications."
    },
    "quests": [
      {
        "num": 1,
        "title": "Treasury & Asset Lifecycle Platform Architecture Blueprint",
        "type": "Concept Quest",
        "description": "Architect the holistic dataflow uniting bank statement ingestion, BRS matching, accrual amortization, and fixed asset schedules."
      },
      {
        "num": 2,
        "title": "Unmatched Cash Drift & Over-Amortized Contract Forensics",
        "type": "Detective Challenge",
        "description": "Investigate month-end accounting logs to trace discrepancies caused by unposted bank adjustments and over-amortized prepayments."
      },
      {
        "num": 3,
        "title": "Milestone 2 Platform Implementation: Treasury & Asset Engine",
        "type": "Mastery Assignment",
        "description": "Build the complete Milestone 2 platform in TypeScript integrating BRS fuzzy matching, imprest management, and FAR depreciation."
      },
      {
        "num": 4,
        "title": "Milestone 2 Month-End Close Simulation & Audit Verification Lab",
        "type": "Production Incident Lab",
        "description": "Execute a full month-end close across 1,000 mixed treasury and asset events, verifying zero balance errors and 100% audit compliance."
      }
    ]
  },
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Enterprise ERP Accounting Topologies (Tally Prime, SAP FICO & Cloud Systems)",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "ERP Architecture (Tally Prime, SAP FICO & Zoho Books API)",
    "spokenGoal": "In the modern corporate world, accounting does not happen on desktop paper ledgers; it executes inside massive Enterprise Resource Planning (ERP) systems. Small-to-medium businesses across India and Asia run on Tally Prime; global Fortune 500 multinationals run on SAP S/4HANA (FICO: Financial Accounting & Controlling) or Oracle NetSuite; and high-growth digital startups run on cloud systems like Zoho Books. Today, you will analyze enterprise ERP accounting topologies. You will explore Tally Prime's XML and ODBC data interchange protocols, understand SAP FICO's document posting architecture (Company Codes, Fiscal Year Variants, Document Types like SA, KR, KZ), and design RESTful webhook integrations with cloud accounting APIs to automate end-to-end transaction synchronization!",
    "conceptInvariant": "ERP Integration Invariant: Enterprise accounting integrations must maintain transactional idempotency; duplicate external API payloads must not generate duplicate financial journal vouchers in the target ERP.",
    "failureMode": "Integrating an e-commerce platform with an ERP via webhooks without idempotency keys; a network retry causes 1,200 orders to post twice, inflating company revenue by $2.4M and corrupting inventory balances.",
    "tryItFriction": "Construct an Idempotent ERP Integration Gateway in TypeScript: ingest payment webhook events from an external billing platform; extract unique idempotency keys; format XML payloads compatible with Tally Prime and JSON payloads compatible with SAP FICO / Zoho Books; and ensure duplicate webhook deliveries return the original voucher ID without re-posting.",
    "socraticHints": [
      "Why is idempotency critical when pushing financial transactions into an ERP via REST or webhooks?",
      "Network timeouts are common. If the sender does not receive an HTTP 200, it will retry the request.",
      "Without an idempotency key check in the ERP gateway, the retry will insert a duplicate journal voucher, corrupting financial statements."
    ],
    "situationalPuzzle": {
      "scenario": "A payment gateway sends a webhook notification to an ERP integration service: 'Invoice INV-9801 Paid $5,000'. The integration service posts the receipt voucher, but the network drops before returning the HTTP 200 OK. The gateway retries the request 3 times over 15 minutes. The ERP customer ledger now shows a credit balance of $15,000 and reports that the customer overpaid by $10,000! What architectural control was omitted?",
      "options": [
        "The ERP database had an index deadlock.",
        "Idempotency Key & Deduplication Filter Omission: The integration gateway failed to verify whether Invoice INV-9801 already had an existing receipt posted. It should have cached the transaction idempotency key and rejected duplicate webhook payloads.",
        "The customer paid three times.",
        "Webhooks should never be used in accounting."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In financial integrations, network retries are standard. The receiver must maintain an idempotency table recording transaction IDs. When a duplicate payload arrives, the gateway recognizes the existing key, suppresses duplicate ledger insertion, and returns the original confirmation."
    },
    "quests": [
      {
        "num": 1,
        "title": "ERP System Topologies & Data Exchange Protocols",
        "type": "Concept Quest",
        "description": "Analyze architectural differences between Tally Prime XML/ODBC, SAP S/4HANA FICO, and modern cloud accounting APIs."
      },
      {
        "num": 2,
        "title": "Webhook Retry Storm & Duplicate Ledger Posting Forensics",
        "type": "Detective Challenge",
        "description": "Dissect ERP transaction logs during a network outage to trace how missing idempotency keys caused catastrophic duplicate invoice postings."
      },
      {
        "num": 3,
        "title": "Idempotent ERP Ingestion Gateway Implementation",
        "type": "Mastery Assignment",
        "description": "Build an idempotent financial integration gateway in TypeScript transforming external billing events into Tally XML and SAP JSON payloads."
      },
      {
        "num": 4,
        "title": "Network Retry Flood & Deduplication Stress Lab",
        "type": "Production Incident Lab",
        "description": "Subject the gateway to 1,000 duplicate webhook payloads under network chaos, verifying 100% deduplication and zero duplicate voucher generation."
      }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "Multi-Currency Accounting & Foreign Exchange Gain/Loss (Ind AS 21 / IAS 21)",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "International Accounting (Forex Translation & Ind AS 21)",
    "spokenGoal": "In a global economy, an Indian or US business buys materials from Germany in Euros, invoices clients in Singapore in SGD, and holds cash in US Dollars. Under Ind AS 21 / IAS 21 ('The Effects of Changes in Foreign Exchange Rates'), you cannot simply add Euros, Dollars, and Rupees together on a balance sheet! Transactions must be recorded in the company's Functional Currency at the spot rate on the transaction date. When the invoice is subsequently settled, any change in exchange rate generates a Realized Forex Gain or Loss. Furthermore, at every month-end balance sheet date, all monetary assets and liabilities held in foreign currency must be revalued at the closing spot rate, generating an Unrealized Forex Gain or Loss! Today, you will build a compliant Multi-Currency Accounting Engine.",
    "conceptInvariant": "Forex Translation Invariant: Foreign currency monetary items must be revalued at each reporting date using closing spot rates; the resulting exchange differences must be recognized in Profit & Loss (Ind AS 21).",
    "failureMode": "Failing to revalue a $10,000,000 USD foreign currency loan at fiscal year-end while the local currency depreciated by 12%; unrecorded unrealized forex losses of $1.2M blindside the board during statutory audit, requiring an emergency earnings restatement.",
    "tryItFriction": "Construct a Multi-Currency Ledger Engine in TypeScript: record transactions in foreign currencies (USD, EUR, GBP) alongside functional currency (INR); track settlement exchange differences (Realized Gain/Loss); execute period-end closing revaluations on open monetary balances (Unrealized Gain/Loss); and generate compliant P&L adjustment entries.",
    "socraticHints": [
      "What is the difference between a Realized Forex Gain/Loss and an Unrealized Forex Gain/Loss?",
      "Realized Forex Gain/Loss occurs when cash is physically converted or an invoice is settled at an exchange rate different from the booking rate.",
      "Unrealized Forex Gain/Loss occurs at period-end when open outstanding foreign currency receivables or payables are marked to market at the closing spot rate."
    ],
    "situationalPuzzle": {
      "scenario": "On November 1st, an Indian IT exporter bills a US client $100,000 when the exchange rate is 1 USD = 82 INR (booking value: 8,200,000 INR). On December 31st (fiscal quarter-end), the invoice is still unpaid, and the closing rate is 1 USD = 84 INR. On January 20th, the client pays in full when the rate is 1 USD = 83 INR. How should the transactions be accounted under Ind AS 21?",
      "options": [
        "Do nothing until January 20th, then record 100,000 INR gain.",
        "Q3 Close (Dec 31): Revalue AR to 8,400,000 INR and record 200,000 INR Unrealized Forex Gain. Settlement (Jan 20): Cash received is 8,300,000 INR; record 100,000 INR Realized Forex Loss against the revalued carrying balance.",
        "Record 8,200,000 INR cash and ignore exchange rate fluctuations.",
        "Exchange rate gains are tax-exempt and should be omitted."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under Ind AS 21, monetary items (like trade receivables) must be revalued at the closing rate at each balance sheet date (Dec 31: 82 to 84 = +200,000 INR unrealized gain). When settled on Jan 20 at 83, the carrying value drops from 8,400,000 to 8,300,000, creating a 100,000 INR realized loss for the new period."
    },
    "quests": [
      {
        "num": 1,
        "title": "Ind AS 21 / IAS 21 Foreign Exchange Standards & Translation Mechanics",
        "type": "Concept Quest",
        "description": "Analyze functional currency determination, monetary vs non-monetary items, and realized vs unrealized forex translation rules."
      },
      {
        "num": 2,
        "title": "Unrecorded Forex Liability & Currency Devaluation Forensics",
        "type": "Detective Challenge",
        "description": "Investigate financial restatements where failure to perform period-end forex revaluation concealed massive foreign currency debt expansion."
      },
      {
        "num": 3,
        "title": "Multi-Currency Ledger & Automated Forex Revaluation Engine",
        "type": "Mastery Assignment",
        "description": "Build a multi-currency accounting engine in TypeScript supporting real-time spot rates, settlement variance tracking, and period-end revaluation."
      },
      {
        "num": 4,
        "title": "Volatile Currency Shock & Period-End Revaluation Lab",
        "type": "Production Incident Lab",
        "description": "Revalue 500 open foreign currency positions across a 15% currency devaluation, verifying 100% balance sheet alignment and P&L gain/loss posting."
      }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "Cost Center Accounting & Multi-Dimensional Profitability Allocation",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Management Accounting (Cost Centers, Profit Centers & Allocation)",
    "spokenGoal": "Statutory accounting answers: 'Did the whole company make a profit?' Management accounting answers: 'Which specific product line, factory department, or retail branch made money, and which one is burning cash?' To answer this, organizations implement Cost Center and Profit Center Accounting. A Cost Center accumulates operational expenses (e.g., Marketing, IT, Human Resources), while a Profit Center generates revenue and incurs costs (e.g., Enterprise Sales, Cloud Services). Today, you will build a Multi-Dimensional Cost Allocation Engine. You will implement direct allocation, step-down allocation, and Activity-Based Costing (ABC) algorithms that apportion shared corporate overhead (rent, cloud infrastructure, executive salaries) across operating business units based on quantitative cost drivers!",
    "conceptInvariant": "Cost Allocation Invariant: Total overhead costs allocated across operating business units must strictly equal total shared overhead incurred; allocation algorithms must neither create nor destroy costs.",
    "failureMode": "Allocating corporate IT infrastructure costs using head-count instead of server compute utilization; an engineering division running high-scale AI clusters appears wildly profitable while a non-technical sales team is penalized with unfair overhead allocations.",
    "tryItFriction": "Construct a Multi-Dimensional Cost Allocation Engine in TypeScript: define shared cost pools (Corporate IT, Office Rent, HR); specify allocation bases (square footage, compute hours, headcount); execute step-down overhead apportionment across 5 profit centers; and verify that total allocated cost exactly equals total pool cost to the penny.",
    "socraticHints": [
      "What is the mathematical conservation law in cost allocation?",
      "Sum of all allocated departmental costs must strictly equal the total balance of the primary cost pool.",
      "If the allocation leaves unabsorbed overhead or allocates more than 100%, management profitability reports are mathematically distorted."
    ],
    "situationalPuzzle": {
      "scenario": "A corporate headquarters incurs $600,000 in monthly shared cloud infrastructure costs. The CFO directs the finance team to allocate this cost across three operating divisions: Division A (uses 50% of compute), Division B (uses 30%), and Division C (uses 20%). The allocation script runs, and the resulting divisional P&L statements show: Division A charged $300,000, Division B charged $200,000, and Division C charged $150,000. What defect is present in the allocation logic?",
      "options": [
        "Cloud costs should not be allocated.",
        "Over-Absorption of Overhead / Arithmetic Allocation Error: The allocated charges total $650,000 ($300k + $200k + $150k), but total actual cost was only $600,000. The allocation percentages in the script were configured as 50%, 33.3%, and 25%, artificially inflating divisional expenses by $50,000.",
        "Division C was over-charged because it is smaller.",
        "The server invoice was paid in Euros."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Cost allocation must conserve total cost. Here, $650,000 was allocated from a $600,000 pool, resulting in $50,000 of phantom expenses (over-absorption). Flawed allocation percentages distort divisional performance metrics and executive compensation."
    },
    "quests": [
      {
        "num": 1,
        "title": "Cost Center Taxonomy, Overhead Apportionment & ABC Mechanics",
        "type": "Concept Quest",
        "description": "Analyze direct vs indirect costs, step-down apportionment methods, and Activity-Based Costing driver selection."
      },
      {
        "num": 2,
        "title": "Overhead Over-Absorption & Flawed Cost Allocation Forensics",
        "type": "Detective Challenge",
        "description": "Audit corporate management accounts to identify flawed allocation bases that distorted divisional profitability metrics."
      },
      {
        "num": 3,
        "title": "Multi-Dimensional Cost Allocation Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build an overhead allocation engine in TypeScript supporting multi-tier step-down allocation and dynamic cost driver weighting."
      },
      {
        "num": 4,
        "title": "High-Volume Multi-Department Allocation Parity Lab",
        "type": "Production Incident Lab",
        "description": "Apportion $5,000,000 in shared corporate overhead across 25 profit centers, verifying zero unabsorbed variance and exact pool exhaustion."
      }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "Inventory Valuation & Cost of Goods Sold (COGS) (Ind AS 2 / IAS 2)",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Cost Accounting (Inventory Valuation & Lower of Cost or NRV)",
    "spokenGoal": "In businesses that manufacture or sell physical goods, inventory is one of the largest assets on the balance sheet. But how do you determine what that inventory is worth when purchasing prices change every week? Under Ind AS 2 / IAS 2, inventory must be valued at the 'Lower of Cost and Net Realizable Value (NRV)'. Furthermore, LIFO (Last-In, First-Out) is strictly prohibited under international standards! Today, you will build an automated Inventory Valuation and COGS Engine. You will compare First-In, First-Out (FIFO) and Weighted Average Cost (WAC) valuation models, implement perpetual inventory tracking with automated Cost of Goods Sold (COGS) recognition on every sales delivery, and enforce write-downs when market selling prices drop below historical purchase cost!",
    "conceptInvariant": "Inventory Valuation Invariant: Inventory must be valued at the lower of historical cost and net realizable value (Ind AS 2); LIFO is prohibited, and perpetual COGS must equal the exact cost of inventory batches relieved upon shipment.",
    "failureMode": "Using LIFO to calculate inventory valuation during a period of high inflation; the company's financial statements are submitted under IFRS / Ind AS, triggering immediate audit rejection and regulatory fines because LIFO is explicitly disallowed.",
    "tryItFriction": "Construct an Inventory Valuation and COGS Engine in TypeScript: maintain inventory lots with purchase dates, unit costs, and quantities; implement both FIFO and Weighted Average cost relief on sales shipments; evaluate periodic Net Realizable Value (NRV); and post automated inventory write-down vouchers when NRV falls below cost.",
    "socraticHints": [
      "Why is LIFO (Last-In, First-Out) explicitly prohibited under IFRS and Ind AS 2?",
      "LIFO leaves older, artificially low costs on the balance sheet for years during inflation, severely understating inventory asset value and distorting working capital ratios.",
      "IFRS only permits FIFO (First-In, First-Out) or Weighted Average Cost (WAC)."
    ],
    "situationalPuzzle": {
      "scenario": "A retailer has 1,000 smartphones in stock purchased at $500 each ($500,000 total cost). A new phone model is released, and the retail market price collapses. The company estimates it can now sell the remaining phones for $420 each, incurring $20 per unit in shipping and sales commissions. At year-end close, the accountant leaves inventory on the balance sheet at $500,000. How does the statutory auditor evaluate this under Ind AS 2?",
      "options": [
        "Correct: Inventory should always remain at historical cost until sold.",
        "Ind AS 2 Lower of Cost or NRV Violation: Net Realizable Value (NRV) is estimated selling price minus costs to sell ($420 - $20 = $400). Because NRV ($400) is lower than Cost ($500), inventory must be written down by $100 per unit ($100,000 total write-down), reducing inventory on the balance sheet to $400,000 and charging $100,000 to P&L.",
        "The phones should be returned to the manufacturer.",
        "NRV only applies to perishable agricultural goods."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under Ind AS 2 / IAS 2, inventory cannot be carried at an amount exceeding what can be recovered from sale. NRV = $420 - $20 = $400. Carrying the phones at $500 overstates assets by $100,000. A $100,000 inventory impairment write-down must be recognized immediately."
    },
    "quests": [
      {
        "num": 1,
        "title": "Ind AS 2 / IAS 2 Inventory Standards, FIFO vs WAC & NRV Mechanics",
        "type": "Concept Quest",
        "description": "Analyze international inventory valuation rules, LIFO prohibition rationale, and Lower of Cost or NRV impairment accounting."
      },
      {
        "num": 2,
        "title": "Unrecorded Inventory Impairment & Obsolete Stock Forensics",
        "type": "Detective Challenge",
        "description": "Audit warehouse inventory records to detect obsolete, slow-moving stock carried above net realizable value without required write-downs."
      },
      {
        "num": 3,
        "title": "Perpetual Inventory Tracking & FIFO/WAC Valuation Engine",
        "type": "Mastery Assignment",
        "description": "Build an inventory accounting engine in TypeScript supporting lot tracking, FIFO cost relief, and automated NRV impairment calculations."
      },
      {
        "num": 4,
        "title": "Volatile Commodity Price Shock & Inventory Write-Down Lab",
        "type": "Production Incident Lab",
        "description": "Process 1,000 purchase and sales batches under a 40% market price crash, verifying 100% compliant NRV write-down and COGS recognition."
      }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "Milestone Project 3: Cloud ERP Accounting Data Integration & Multi-Currency Ledger Platform",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Milestone Project (Enterprise ERP Integration & Global Ledger)",
    "spokenGoal": "Congratulations on completing Block 3! Today is Milestone Project 3: you will architect, implement, and benchmark an integrated Enterprise ERP Integration & Multi-Currency Ledger Platform. Your platform will act as the central financial synchronization bridge between external billing portals, warehouse inventory management systems, and target ERPs (Tally Prime, SAP FICO, Zoho Books). It will enforce strict webhook idempotency, manage multi-currency transactions with automated Ind AS 21 realized and unrealized forex translation, allocate shared overhead costs across multi-tier profit centers using Activity-Based Costing, and relieve inventory using compliant FIFO / Weighted Average COGS models with automated NRV write-downs. You will prove that your enterprise core maintains absolute data consistency across 2,000 global transactions with zero duplicate postings and zero foreign exchange reconciliation errors!",
    "conceptInvariant": "Enterprise ERP Platform Invariant: A global accounting bridge must guarantee idempotent transactional ingestion, compliant multi-currency forex revaluation, conservation of allocated overhead, and perpetual inventory cost fidelity across distributed ERP nodes.",
    "failureMode": "Deploying an ERP bridge where a concurrent currency rate update collides with a multi-lot inventory sale; the system records the transaction at a corrupted zero exchange rate, causing a $1.8M ledger distortion that halts international customs clearance.",
    "tryItFriction": "Construct the Milestone 3 Platform in TypeScript: combine idempotent webhook ingestion, multi-currency ledger tracking, Ind AS 21 period-end revaluation, step-down cost center allocation, and FIFO inventory COGS relief; run a 2,000-event stress scenario asserting zero duplicate vouchers, zero negative inventory, and exact functional currency balance parity.",
    "socraticHints": [
      "What are the four pillars of the Milestone 3 Enterprise Platform?",
      "1. Idempotent ERP Ingestion (payload deduplication, multi-format transformation).",
      "2. Multi-Currency Operations (Ind AS 21 spot translation, realized/unrealized forex revaluation).",
      "3. Cost Allocation (activity-based step-down apportionment across profit centers).",
      "4. Inventory & COGS Valuation (FIFO/WAC tracking, Ind AS 2 lower of cost or NRV enforcement)."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 3 enterprise platform is deployed across a global e-commerce enterprise. During the Black Friday rush, 1,000 orders per minute arrive from US, EU, and Japanese customers. An external network hiccup causes 300 orders to be retried by the payment gateway, while currency rates fluctuate by 2%. Your platform detects the retries, returns existing voucher IDs without duplicate postings, converts currencies at the exact booking spot rate, relieves inventory using FIFO, and maintains a balanced global trial balance. How does the Chief Technology Officer evaluate this?",
      "options": [
        "Unacceptable: The system should not have accepted foreign currency.",
        "Tier-1 Enterprise Financial Engineering: The platform demonstrated robust idempotency, multi-currency compliance under Ind AS 21, and flawless transactional integrity under extreme load, qualifying as an institutional-grade accounting backbone.",
        "Inconclusive: Needs manual review of all 300 retries.",
        "The system should have paused until the sales event concluded."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Successfully handling concurrent multi-currency transactions, idempotent retry deduplication, and FIFO inventory relief under high-volume stress without financial discrepancies represents the benchmark standard of enterprise software engineering."
    },
    "quests": [
      {
        "num": 1,
        "title": "Enterprise ERP & Global Ledger Integration Architecture Blueprint",
        "type": "Concept Quest",
        "description": "Architect the holistic dataflow connecting payment webhooks, multi-currency ledgers, cost allocations, and inventory subsystems to target ERPs."
      },
      {
        "num": 2,
        "title": "Forex Desynchronization & Duplicate Webhook Posting Forensics",
        "type": "Detective Challenge",
        "description": "Analyze disaster logs where unhandled webhook retries and missing closing forex revaluations corrupted multi-currency balance sheets."
      },
      {
        "num": 3,
        "title": "Milestone 3 Platform Implementation: Global ERP Accounting Bridge",
        "type": "Mastery Assignment",
        "description": "Build the complete Milestone 3 platform in TypeScript integrating idempotent ingestion, Ind AS 21 forex engines, cost allocation, and FIFO COGS."
      },
      {
        "num": 4,
        "title": "Milestone 3 Live Multi-Currency & High-Concurrency Verification Lab",
        "type": "Production Incident Lab",
        "description": "Subject the platform to 2,000 concurrent global transactions with injected retries and currency shifts, proving 100% balance sheet parity."
      }
    ]
  }
]
