# scripts/visuals/digital_accounting_spec_m1_rest.py
# Days 16 to 30 Specification for Digital Accounting & Taxation (course-digital-accounting)
# Conforming strictly to Gate v2 semantic standard:
# 3-Tier Socratic Hint Ladders, MCA Audit Trail Mandate (Sec 143(3)(j) Companies Act 2013 & CARO 2020),
# Forensic Accounting & Benford's Law Transaction Auditing, Segregation of Duties (SoD) & 3-Way Matching,
# Year-End Ledger Close & Reversing Entry Automations, GST Framework & Place of Supply Rules (CGST/SGST/IGST),
# GST Tax Invoice Rules, HSN/SAC & Reverse Charge Mechanism (RCM), E-Invoicing JSON Schema & IRN/QR Code,
# E-Way Bill Logistics Compliance & Transit Thresholds, Input Tax Credit (ITC) & Section 17(5) Blocked Credits,
# GSTR-2B vs Purchase Register Automated Reconciliation, GSTR-1 / GSTR-3B Tax Offsets & Credit Utilization,
# GST Annual Return GSTR-9/9C Reconciliation, and Month 1 Capstone: ApexLedger Enterprise Digital Accounting & GST Compliance Engine.

DAYS_16_TO_30 = [
  {
    "day": 16,
    "month": 1,
    "blockNum": 4,
    "title": "MCA Audit Trail Mandate & Tamper-Evident Accounting Logs",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Statutory Compliance (Audit Trail Mandate & Edit Logs)",
    "spokenGoal": "Effective April 1, 2023, the Ministry of Corporate Affairs (MCA) in India enacted one of the most stringent corporate accounting laws in the world: the Audit Trail Mandate under the Companies (Accounts) Rules, 2014 and Section 143(3)(j) of the Companies Act 2013. Every company that uses accounting software to maintain books of accounts MUST use software that has an audit trail feature recording every single change made in books of accounts along with the date, timestamp, and user ID! Furthermore, the software must ensure that the audit trail CANNOT be disabled or tampered with! Statutory auditors are legally required under CARO 2020 to test this feature and report non-compliance in their independent audit reports. Today, you will architect a Tamper-Evident Audit Trail Engine. You will capture row-level before-and-after change diffs, record immutable cryptographic hash chains, and enforce zero-tampering guarantees!",
    "conceptInvariant": "Audit Trail Invariant: Every financial record creation, modification, or voiding must generate an immutable, non-disableable audit log capturing who, what, and when; any gap or manual database edit outside the audit engine constitutes a statutory violation.",
    "failureMode": "A software team builds an ERP feature allowing administrators to toggle 'Disable Audit Trail' to speed up bulk month-end migration; the statutory auditor detects the disabled flag during year-end audit testing, issuing an adverse qualification report that triggers MCA regulatory scrutiny.",
    "tryItFriction": "Construct a Tamper-Evident Audit Trail Logger in TypeScript: wrap ledger record mutations with an immutable change capture hook; record timestamp, userId, action (CREATE, MODIFY, VOID), field-level old/new values, and SHA-256 hash chaining of audit records; and verify that any retroactive modification of an audit record breaks cryptographic chain verification.",
    "socraticHints": [
      "What are the two mandatory technical requirements of the MCA Audit Trail rule for accounting software?",
      "1. The audit trail feature must be active continuously throughout the entire financial year without ever being disabled.",
      "2. The audit log must record every change made to transactions (before and after values), user ID, and timestamp, and must be tamper-proof."
    ],
    "situationalPuzzle": {
      "scenario": "During an annual statutory audit, the auditor requests the software audit trail logs for the revenue ledger. The IT team exports a clean table showing all invoice updates. However, the auditor discovers that an IT administrator ran a direct SQL script `UPDATE invoices SET amount = 45000 WHERE id = 104` directly in the PostgreSQL database console to fix a typo, bypassing the ERP application layer. How does the auditor report this under the Companies Act 2013?",
      "options": [
        "No issue: The SQL command achieved the correct business outcome.",
        "Statutory Audit Non-Compliance & Audit Trail Failure: Direct database manipulation bypassed the application's audit logging mechanism, leaving no audit trail record for the change. The auditor must formally report that the company operated accounting software without an unbroken, tamper-proof audit trail.",
        "The auditor should ask the developer to insert a fake audit log row.",
        "The database administrator should be promoted."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under the MCA Audit Trail rule, if accounting data can be modified directly at the database layer without an automated audit trail capture, the internal controls are deemed defective. Companies must enforce database-level trigger logging or remove direct write access to comply with statutory audit standards."
    },
    "quests": [
      {
        "num": 1,
        "title": "MCA Audit Trail Rule, Section 143(3)(j) & CARO 2020 Reporting",
        "type": "Concept Quest",
        "description": "Analyze the statutory mandates of the MCA Audit Trail rule, auditor reporting responsibilities, and immutable logging standards."
      },
      {
        "num": 2,
        "title": "Direct Database Modification & Audit Chain Tampering Forensics",
        "type": "Detective Challenge",
        "description": "Audit database changelogs to detect unauthorized direct SQL updates that bypassed application-layer audit trail generation."
      },
      {
        "num": 3,
        "title": "Cryptographic Hash-Chained Audit Trail Logger Implementation",
        "type": "Mastery Assignment",
        "description": "Implement an immutable, non-disableable audit trail engine in TypeScript with field-level diffing and SHA-256 block chaining."
      },
      {
        "num": 4,
        "title": "Audit Chain Verification & Tamper Detection Lab",
        "type": "Production Incident Lab",
        "description": "Inject an unauthorized retroactive data modification into the audit log, verifying that the integrity verifier flags the broken chain instantly."
      }
    ]
  },
  {
    "day": 17,
    "month": 1,
    "blockNum": 4,
    "title": "Forensic Accounting & Benford's Law in Transaction Auditing",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Forensic Accounting (Fraud Detection & Benford's Distribution)",
    "spokenGoal": "When corporate fraud occurs—such as rogue employees creating fake vendor invoices, embezzling petty cash, or inflating expense reports—the perpetrators think they are clever at inventing numbers. But human beings are terrible random number generators! When humans fabricate financial numbers, they unwittingly violate natural mathematical distributions. One of the most powerful forensic accounting tools in the world is Benford's Law (The Law of First Digits). In naturally occurring financial transaction data, the number 1 appears as the first leading digit approximately 30.1% of the time, the number 2 appears 17.6% of the time, while the number 9 appears only 4.6% of the time! Today, you will build a Forensic Accounting Anomaly Detector. You will analyze transaction ledgers using Benford's Law, screen for abnormal round-dollar payment clusters, and identify ghost vendors who systematically submit invoices just below approval thresholds!",
    "conceptInvariant": "Forensic Statistical Invariant: Naturally occurring financial transactional datasets conform to Benford's logarithmic first-digit distribution; statistically significant deviations (Z-scores > 3.0) indicate human fabrication or fraudulent intervention.",
    "failureMode": "Failing to apply forensic data analytics to accounts payable; an internal purchasing manager creates 45 fake invoices for $4,950 each (just below the $5,000 dual-signature threshold), stealing $222,750 over 9 months without triggering standard approval checks.",
    "tryItFriction": "Construct a Forensic Benford and Fraud Screening Engine in TypeScript: ingest 10,000 transaction amounts; extract leading digits and compute empirical frequencies; calculate Chi-Square goodness-of-fit and Z-scores against Benford's distribution; and flag anomalous clusters of transactions resting immediately below internal authorization thresholds.",
    "socraticHints": [
      "What is the mathematical equation for Benford's Law for first digit d?",
      "P(d) = log10(1 + 1/d) for d in {1, 2, ..., 9}.",
      "For d = 1: P(1) = log10(2) = 0.3010 (30.1%). For d = 9: P(9) = log10(10/9) = 0.0458 (4.6%)."
    ],
    "situationalPuzzle": {
      "scenario": "A forensic auditor reviews 5,000 corporate credit card expense entries submitted by an enterprise sales division. The Benford's Law analysis reveals that the digit '4' appears as the leading digit in 38% of all transactions (compared to Benford's expected 9.7%). Closer inspection shows a massive spike of expense receipts between $450 and $499. Corporate policy requires VP approval for any expense of $500 or higher. What fraud pattern has the auditor uncovered?",
      "options": [
        "The sales team only eats at restaurants that charge $400.",
        "Approval Threshold Structuring & Expense Splitting: Employees are deliberately structuring fraudulent or unapproved expenses to stay just below the $500 VP approval threshold, creating an artificial cluster of transactions starting with the digit 4.",
        "Benford's Law does not apply to restaurant expenses.",
        "The currency exchange rate forced the amounts to start with 4."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. When transactions cluster unnaturally just below internal control thresholds (e.g., $450-$499 to evade a $500 approval limit), the leading digit distribution exhibits extreme statistical distortion. Benford's Law analysis isolates this behavior immediately for targeted forensic review."
    },
    "quests": [
      {
        "num": 1,
        "title": "Benford's Law Mathematical Foundations & Forensic Heuristics",
        "type": "Concept Quest",
        "description": "Analyze the logarithmic derivation of Benford's Law, Chi-Square goodness-of-fit testing, and threshold structuring heuristics."
      },
      {
        "num": 2,
        "title": "Ghost Vendor & Approval Threshold Structuring Forensics",
        "type": "Detective Challenge",
        "description": "Analyze accounts payable transaction datasets to detect fake vendor shell companies and systematic approval evasion patterns."
      },
      {
        "num": 3,
        "title": "Forensic Benford & Fraud Screening Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build an automated forensic audit scanner in TypeScript calculating first-digit distributions, Z-scores, and threshold anomaly alerts."
      },
      {
        "num": 4,
        "title": "Adversarial Fabricated Invoice Injection & Detection Lab",
        "type": "Production Incident Lab",
        "description": "Inject 500 fabricated invoices into a 10,000-transaction real dataset, verifying that the forensic engine isolates the fraudulent cluster with 100% precision."
      }
    ]
  },
  {
    "day": 18,
    "month": 1,
    "blockNum": 4,
    "title": "Segregation of Duties (SoD) & Maker-Checker Internal Controls",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Internal Controls (SoD, 3-Way Match & Approval Workflows)",
    "spokenGoal": "If the same employee who creates a vendor purchase order is also authorized to approve the invoice, release the bank wire transfer, and reconcile the cash ledger, your company will eventually be robbed! The cornerstone of financial internal control is Segregation of Duties (SoD) and the Maker-Checker Principle (Dual Authorization). No single individual should have end-to-end control over any financial lifecycle. Today, you will architect enterprise internal controls. You will design Role-Based Access Control (RBAC) matrices that prevent toxic role combinations, implement the classic 3-Way Match (Purchase Order, Goods Received Note, Vendor Invoice) that prevents paying for undelivered goods, and enforce multi-tier approval hierarchies with delegation rules!",
    "conceptInvariant": "Segregation of Duties Invariant: No user may approve or execute a transaction that they created; automated 3-way matching must verify item, quantity, and price alignment between PO, GRN, and vendor invoice prior to disbursement.",
    "failureMode": "Granting both 'Create Vendor' and 'Approve Payment' permissions to an AP clerk; the clerk registers a personal shell bank account as a vendor and approves a $75,000 fraudulent wire payment before resigning.",
    "tryItFriction": "Construct a 3-Way Match and Maker-Checker Engine in TypeScript: ingest Purchase Orders (PO), Goods Received Notes (GRN), and Vendor Invoices; verify quantity match (Invoice Qty <= GRN Qty) and price match (Invoice Price <= PO Price within 1% tolerance); enforce Maker-Checker authorization (approverId !== creatorId); and block non-compliant disbursements.",
    "socraticHints": [
      "What are the three documents compared in an automated 3-Way Match?",
      "1. Purchase Order (PO): What was authorized to be bought and at what agreed price.",
      "2. Goods Received Note (GRN): What was physically received at the warehouse.",
      "3. Vendor Invoice: What the supplier is billing for."
    ],
    "situationalPuzzle": {
      "scenario": "A manufacturing firm's accounts payable department receives a vendor invoice billing $120,000 for 1,000 industrial ball bearings at $120 each. The original approved Purchase Order was for 1,000 bearings at $100 each ($100,000 total). The warehouse GRN confirms 1,000 bearings were received in good condition. The purchasing manager approves the invoice via email. The automated ERP 3-way match engine blocks payment. What price variance violation occurred?",
      "options": [
        "The warehouse should have rejected the bearings.",
        "Price Variance Breach: The invoice price ($120) exceeds the authorized PO price ($100) by 20%, exceeding standard price variance tolerances. Email approval is invalid; payment must be held until an authorized amendment to the Purchase Order or a formal price variance voucher is processed.",
        "The bearings should be returned to the vendor.",
        "The invoice was missing a tax exemption certificate."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In a 3-way match, quantity is validated against the GRN and price is validated against the PO. A 20% price hike violates purchase contract terms. The ERP must automatically place the invoice on payment hold until a formal PO revision is approved by an authorized executive."
    },
    "quests": [
      {
        "num": 1,
        "title": "Segregation of Duties Governance & 3-Way Match Architecture",
        "type": "Concept Quest",
        "description": "Analyze toxic role combinations under COSO/SOX frameworks, Maker-Checker rules, and 3-way matching tolerance algorithms."
      },
      {
        "num": 2,
        "title": "Toxic Role Assignment & Unauthorized Disbursement Forensics",
        "type": "Detective Challenge",
        "description": "Audit user permission matrices in an ERP database to identify users holding conflicting create and approve permissions."
      },
      {
        "num": 3,
        "title": "3-Way Match & Dual-Authorization Workflow Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build an enterprise procurement matching engine in TypeScript enforcing quantity/price tolerance checks and Maker-Checker approval gates."
      },
      {
        "num": 4,
        "title": "Simulated Price Spike & Unauthorized Approval Interception Lab",
        "type": "Production Incident Lab",
        "description": "Submit 500 invoices with injected price/quantity variances and self-approval attempts, asserting 100% interception before payment release."
      }
    ]
  },
  {
    "day": 19,
    "month": 1,
    "blockNum": 4,
    "title": "Year-End Ledger Close & Reversing Entry Automations",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Financial Close (Period Locking & Year-End Closing Entries)",
    "spokenGoal": "At the stroke of midnight on the last day of the fiscal year, a company does not simply continue posting transactions into the same running balances. Financial statements must be closed, audited, and published! The Year-End Ledger Close is a complex, multi-step accounting ritual. Nominal accounts (Revenue and Expense accounts) must be zeroed out and their net balance transferred to Retained Earnings (Equity) on the Balance Sheet. Balance Sheet accounts (Real and Personal) carry their closing balances forward into the new year as Opening Balances. Furthermore, provisional accrual entries made at year-end must be automatically reversed on Day 1 of the new year (Reversing Entries) to prevent double-counting expenses when actual vendor bills arrive! Today, you will build a Year-End Financial Close and Period-Locking Engine.",
    "conceptInvariant": "Period Close Invariant: Closing the fiscal year zeroes out all P&L nominal accounts into Retained Earnings; closed periods must be locked against retroactive journal postings, and provisional accruals must generate automated reversing entries.",
    "failureMode": "Failing to reverse a provisional $50,000 year-end audit expense accrual on Day 1 of the new fiscal year; when the auditor's actual bill arrives in February, it is expensed again, double-counting $50,000 of expenses in the new year.",
    "tryItFriction": "Construct a Year-End Closing and Reversing Entry Engine in TypeScript: calculate net income by closing all Revenue (4000-4999) and Expense (5000-6999) accounts to Retained Earnings (3100); generate Day 1 opening balance vouchers; implement automated reversing entries for marked provisional accruals; and lock the closed fiscal year against subsequent modifications.",
    "socraticHints": [
      "Why do we close Revenue and Expense accounts to Retained Earnings at year-end, but NEVER close Asset or Liability accounts?",
      "Revenue and Expenses measure performance over a specific time window (P&L); their score resets to zero each year.",
      "Assets, Liabilities, and Equity represent cumulative financial condition (Balance Sheet); their balances carry forward permanently."
    ],
    "situationalPuzzle": {
      "scenario": "On December 31st, a company accrues $25,000 for estimated electricity expenses incurred in December for which no bill has arrived (Debit Electricity Expense $25,000, Credit Accrued Liabilities $25,000). On January 15th, the actual electricity bill arrives for $26,000 and is recorded normally by accounts payable (Debit Electricity Expense $26,000, Credit Bank $26,000). The accountant forgot to post a reversing entry on January 1st. What is the impact on January's financial statements?",
      "options": [
        "The books are correct.",
        "Expense Double-Counting / Profit Distortion: Because the December provisional accrual was not reversed on Jan 1st (Debit Accrued Liabilities $25,000, Credit Electricity Expense $25,000), January records a full $26,000 expense instead of the $1,000 true true difference, artificially depressing January profits by $25,000.",
        "The electric company will disconnect power.",
        "The tax authority will issue a refund."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Without an automated reversing entry on Jan 1st (crediting expense $25,000), posting the actual invoice in January causes the same economic expense to be recorded twice ($25,000 accrued in Dec, and $26,000 expensed again in Jan). Automated reversing entries eliminate this error."
    },
    "quests": [
      {
        "num": 1,
        "title": "Fiscal Period Close Lifecycle & Reversing Entry Mechanics",
        "type": "Concept Quest",
        "description": "Analyze nominal account closing into Retained Earnings, balance sheet carryforwards, and the mechanics of automated reversing entries."
      },
      {
        "num": 2,
        "title": "Unreversed Accrual Double-Counting & Period Lock Breach Forensics",
        "type": "Detective Challenge",
        "description": "Inspect multi-year financial statements to trace how missing reversing entries and unlocked prior periods distorted reported earnings."
      },
      {
        "num": 3,
        "title": "Year-End Close & Automated Reversing Entry Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build an enterprise fiscal year close engine in TypeScript closing nominal accounts to equity, carrying balances forward, and locking periods."
      },
      {
        "num": 4,
        "title": "Multi-Period Fiscal Close & Retroactive Mutation Lockout Lab",
        "type": "Production Incident Lab",
        "description": "Execute a full fiscal year close and attempt 100 retroactive postings to closed periods, verifying 100% rejection and opening balance parity."
      }
    ]
  },
  {
    "day": 20,
    "month": 1,
    "blockNum": 4,
    "title": "Milestone Project 4: Immutable Audit Trail Verifier & Forensic Benford Anomaly Detector",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Milestone Project (Statutory Compliance & Forensic Audit Platform)",
    "spokenGoal": "Congratulations! You have reached Milestone Project 4: the synthesis of statutory governance and forensic accounting analytics. Today, you will architect, implement, and benchmark an integrated Statutory Compliance & Forensic Audit Platform. Your system will enforce the MCA Audit Trail Mandate with non-disableable cryptographic hash chains recording every transaction edit, evaluate thousands of historical payments against Benford's Law distribution to detect fabricated invoice clusters, enforce 3-Way Matching with Maker-Checker dual authorization on procurement flows, and execute clean Year-End Fiscal Closes with automated reversing entries. You will prove that your governance core detects 100% of injected fraud attempts and tamper modifications!",
    "conceptInvariant": "Governance Core Invariant: A statutory compliance platform must enforce cryptographic audit immutability, statistical fraud detection, dual-authorization segregation of duties, and period-locked closing integrity across enterprise financial workflows.",
    "failureMode": "Deploying a governance platform that performs Benford analysis but lacks database-level hash chaining; an attacker with database credentials alters historical vendor invoice records without triggering the application audit log.",
    "tryItFriction": "Construct the Milestone 4 Governance Platform in TypeScript: combine SHA-256 hash-chained audit logging, Benford's Law distribution analysis, 3-way match validation with Maker-Checker controls, and fiscal year closing with reversing entries; demonstrate 100% detection of injected data tampering and approval violations across 2,000 test events.",
    "socraticHints": [
      "What are the four core pillars of the Milestone 4 Governance Platform?",
      "1. Tamper-Evident Audit Trail (MCA Sec 143(3)(j) compliance, SHA-256 hash chaining).",
      "2. Forensic Analytics (Benford's Law first-digit distribution, threshold evasion detection).",
      "3. Internal Controls (3-way match, Maker-Checker dual authorization).",
      "4. Period Governance (year-end nominal close, automated reversing entries, period locking)."
    ],
    "situationalPuzzle": {
      "scenario": "During your Milestone 4 defense examination, the statutory audit partner injects three hostile actions: 1) attempts to edit an invoice in a closed fiscal period; 2) approves a payment where creatorId === approverId; and 3) modifies a row directly in the database without updating the hash chain. Your platform rejects the closed-period edit, blocks the self-approval, and alerts on the broken cryptographic audit chain in 12 milliseconds. What is the partner's formal assessment?",
      "options": [
        "Unsatisfactory: The platform should have allowed the admin to bypass controls.",
        "Exemplary Statutory & Forensic Mastery: The platform demonstrated ironclad defense-in-depth across statutory compliance, internal control segregation, and cryptographic data integrity, meeting top-tier audit standards.",
        "Inconclusive: Needs manual review of the audit log.",
        "Rejected: Cryptographic hashing is unnecessary in accounting."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Institutional financial software must withstand malicious or negligent bypass attempts. Successfully intercepting period violations, enforcing segregation of duties, and verifying cryptographic chain integrity validates full compliance with modern statutory mandates."
    },
    "quests": [
      {
        "num": 1,
        "title": "Statutory Governance & Forensic Audit Architecture Blueprint",
        "type": "Concept Quest",
        "description": "Architect the holistic dataflow connecting hash-chained audit loggers, forensic Benford scanners, 3-way match engines, and period lockers."
      },
      {
        "num": 2,
        "title": "Internal Control Evasion & Cryptographic Break Forensics",
        "type": "Detective Challenge",
        "description": "Analyze forensic audit logs during an attempted corporate fraud incident to trace how control violations were detected and isolated."
      },
      {
        "num": 3,
        "title": "Milestone 4 Platform Implementation: Forensic Governance Platform",
        "type": "Mastery Assignment",
        "description": "Build the complete Milestone 4 platform in TypeScript integrating SHA-256 audit chaining, Benford analysis, 3-way matching, and fiscal close."
      },
      {
        "num": 4,
        "title": "Milestone 4 Adversarial Fraud Injection & Integrity Verification Lab",
        "type": "Production Incident Lab",
        "description": "Subject the platform to 2,000 mixed transactions with injected fraud patterns and direct tampering, verifying 100% detection and zero false negatives."
      }
    ]
  },
  {
    "day": 21,
    "month": 1,
    "blockNum": 5,
    "title": "Goods and Services Tax (GST) Framework & Constitutional Architecture",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Taxation Foundations (GST Constitutional Architecture & Supply Rules)",
    "spokenGoal": "Welcome to Block 5: The Digital Taxation Engine. In July 2017, India executed the biggest indirect tax reform in its history: Goods and Services Tax (GST), unifying dozens of cascading state and central taxes into 'One Nation, One Tax'. GST is a destination-based consumption tax governed by the 101st Constitutional Amendment. Today, you will master the constitutional and statutory architecture of GST. You will dissect the three components: Central GST (CGST) and State GST (SGST) for Intra-State supplies, and Integrated GST (IGST) for Inter-State supplies and imports. You will master the critical Place of Supply rules under the IGST Act, analyze taxable events (Supply of Goods vs Supply of Services under Section 7 of the CGST Act), and configure automated tax rate engines (0%, 5%, 12%, 18%, 28% plus Compensation Cess)!",
    "conceptInvariant": "GST Place of Supply Invariant: When Supplier Location and Place of Supply are in the same State, the supply is Intra-State (CGST + SGST); when in different States, the supply is Inter-State (IGST); misclassifying supply type results in tax mismatch penalties.",
    "failureMode": "Charging CGST + SGST on an inter-state software export to a client in another state; the tax authority disallows the input tax credit, demands payment of IGST plus 18% mandatory interest, and blocks tax portal filing.",
    "tryItFriction": "Construct a GST Tax Determination Engine in TypeScript: ingest supplier GSTIN and buyer GSTIN; extract 2-digit state codes; determine whether the supply is Intra-State or Inter-State; apply HSN/SAC-specific tax schedules; and split tax liability into exact CGST, SGST, or IGST line items.",
    "socraticHints": [
      "How do the first two digits of a 15-character GSTIN identify the supplier or buyer's state?",
      "The first 2 digits represent the state code as per the Indian Census (e.g. 27 for Maharashtra, 29 for Karnataka, 07 for Delhi).",
      "Comparing the supplier state code to the Place of Supply state code instantly determines whether the transaction is Intra-State (CGST+SGST) or Inter-State (IGST)."
    ],
    "situationalPuzzle": {
      "scenario": "A software company located in Bengaluru, Karnataka (GSTIN: 29AAAAA0000A1Z5) delivers cloud consulting services to a client headquartered in Mumbai, Maharashtra (GSTIN: 27BBBBB1111B1Z2). The junior billing clerk issues an invoice charging 9% CGST and 9% SGST. The client's tax department rejects the invoice and refuses payment. Why is the invoice legally defective?",
      "options": [
        "Software consulting is tax-exempt.",
        "Incorrect Supply Classification & Tax Head: The supplier location (Karnataka - 29) and Place of Supply (Maharashtra - 27) are in different states, making it an Inter-State supply. The invoice must charge 18% IGST. Charging CGST/SGST prevents the client from taking Input Tax Credit in Maharashtra.",
        "The GSTIN format was invalid.",
        "Services cannot cross state borders."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under the IGST Act, supplies between different states are Inter-State supplies subject to Integrated GST (IGST). Charging CGST and Karnataka SGST to a Maharashtra recipient is illegal and makes the tax unclaimable for the buyer, who cannot offset Karnataka state tax against Maharashtra liabilities."
    },
    "quests": [
      {
        "num": 1,
        "title": "GST Constitutional Architecture, Place of Supply & Tax Components",
        "type": "Concept Quest",
        "description": "Analyze the 101st Constitutional Amendment, CGST/SGST/IGST mechanics, Section 7/8/9 supply rules, and GSTIN state code mappings."
      },
      {
        "num": 2,
        "title": "Misclassified Place of Supply & Inadmissible ITC Forensics",
        "type": "Detective Challenge",
        "description": "Audit an accounts receivable sales register to identify inter-state transactions incorrectly billed with intra-state CGST/SGST."
      },
      {
        "num": 3,
        "title": "Automated GST Determination Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build a tax engine in TypeScript resolving supplier/recipient state codes, determining supply nature, and computing CGST/SGST/IGST breakdowns."
      },
      {
        "num": 4,
        "title": "Multi-State Pan-India Tax Determination Simulation Lab",
        "type": "Production Incident Lab",
        "description": "Process 1,000 multi-state goods and services transactions across all 36 Indian states and union territories, asserting 100% accurate tax classification."
      }
    ]
  },
  {
    "day": 22,
    "month": 1,
    "blockNum": 5,
    "title": "GST Tax Invoice Rules, HSN/SAC Codes & Reverse Charge Mechanism (RCM)",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Taxation Compliance (Invoice Rules, HSN Codes & RCM)",
    "spokenGoal": "Under GST law, an invoice is not just a commercial bill; it is a legal statutory document that determines whether your customer can claim Input Tax Credit. Under Rule 46 of the CGST Rules, 2017, a valid GST Tax Invoice must contain exactly 16 mandatory fields—including consecutive serial numbering, customer GSTIN, HSN (Harmonized System of Nomenclature) code for goods or SAC (Services Accounting Code) for services, taxable value, and tax rates. Furthermore, under the Reverse Charge Mechanism (RCM) (Section 9(3) and 9(4) of the CGST Act), the liability to pay tax to the government is shifted from the supplier to the recipient for notified categories (such as Goods Transport Agency, legal services, or purchases from unregistered vendors)! Today, you will build a compliant GST Invoicing and RCM Processing Engine.",
    "conceptInvariant": "GST Invoicing & RCM Invariant: A GST tax invoice missing mandatory Rule 46 fields invalidates the buyer's ITC; under RCM, the recipient must self-invoice and deposit tax directly with the government prior to claiming input credit.",
    "failureMode": "Purchasing freight services from an unregistered Goods Transport Agency (GTA) under RCM without self-invoicing or depositing RCM tax; tax audit uncovers 2 years of unremitted RCM liabilities, imposing mandatory 18% interest and 100% tax penalties.",
    "tryItFriction": "Construct a GST Tax Invoice and RCM Engine in TypeScript: validate Rule 46 mandatory fields (16 fields); enforce 4-digit or 6-digit HSN code requirements based on company turnover; detect RCM-notified categories; generate Self-Invoices for RCM purchases; and create corresponding tax liability and ITC journal vouchers.",
    "socraticHints": [
      "What is the Reverse Charge Mechanism (RCM) in GST?",
      "Normally, the supplier charges tax, collects it from the buyer, and pays it to the government.",
      "Under RCM, the recipient pays the GST directly to the government on behalf of the supplier, and then claims it as Input Tax Credit if eligible."
    ],
    "situationalPuzzle": {
      "scenario": "A corporate enterprise hires an independent advocate for legal representation in high court and pays a legal fee of $50,000. The advocate issues a simple fee receipt without charging GST. The enterprise accounts team books the expense and files GST returns without action. During an audit, the GST inspector demands $9,000 tax plus penalties. Why is the enterprise liable to pay GST on the advocate's fees?",
      "options": [
        "Lawyers are not allowed to practice law without paying GST.",
        "Mandatory Reverse Charge Mechanism (RCM) Notification: Legal services provided by an advocate to a business entity are explicitly notified under Section 9(3) of the CGST Act under RCM. The recipient business is legally required to self-invoice, pay 18% GST directly to the government, and take credit.",
        "The enterprise should have deducted income tax instead of GST.",
        "The inspector made an error; legal services are tax-exempt."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Legal services provided by individual advocates or law firms to business entities are subject to mandatory Reverse Charge (RCM). The advocate does not charge GST on the bill; the recipient business must pay the tax under RCM directly to the government via Electronic Cash Ledger."
    },
    "quests": [
      {
        "num": 1,
        "title": "Rule 46 Tax Invoice Mandates, HSN/SAC Classification & RCM Rules",
        "type": "Concept Quest",
        "description": "Analyze Rule 46 mandatory invoice fields, HSN 4/6/8-digit turnover thresholds, and Section 9(3)/9(4) Reverse Charge provisions."
      },
      {
        "num": 2,
        "title": "Unremitted RCM Liability & Defective Invoice Audit Forensics",
        "type": "Detective Challenge",
        "description": "Audit an accounts payable purchase ledger to identify unregistered vendor and transport payments that triggered unremitted RCM tax penalties."
      },
      {
        "num": 3,
        "title": "GST Tax Invoice Validator & Self-Invoicing RCM Engine",
        "type": "Mastery Assignment",
        "description": "Build an invoice validation and RCM self-invoicing engine in TypeScript validating Rule 46 compliance and generating RCM liability entries."
      },
      {
        "num": 4,
        "title": "Automated RCM Self-Invoice & Accounting Offset Lab",
        "type": "Production Incident Lab",
        "description": "Process 500 vendor invoices including GTA and legal services, verifying automated Rule 46 field checks and 100% RCM liability accrual."
      }
    ]
  },
  {
    "day": 23,
    "month": 1,
    "blockNum": 5,
    "title": "E-Invoicing System & JSON Schema Specification (IRN & Signed QR Code)",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Taxation Technology (E-Invoicing JSON Schema & IRP Integration)",
    "spokenGoal": "In India, businesses above turnover thresholds cannot simply print a PDF invoice and mail it to a client. B2B invoices are legally VOID unless they are pre-registered with the government's Invoice Registration Portal (IRP)! Under the E-Invoicing mandate, your accounting software must generate a standardized JSON payload conforming strictly to Schema Version 1.1, submit it via API to the IRP, and receive back a unique 64-character Invoice Reference Number (IRN) generated using SHA-256 and a digitally signed QR Code! The signed QR code must be printed on the invoice for it to be legally recognized. Today, you will build an automated E-Invoicing JSON Generator and IRP Validation Pipeline, mastering schema validation, IRN hash generation, and digital signature verification!",
    "conceptInvariant": "E-Invoicing Invariant: A B2B tax invoice issued by a mandated entity without a valid IRN and digitally signed QR code is legally non-existent in the eyes of tax law; the buyer cannot claim ITC and goods in transit can be confiscated.",
    "failureMode": "Dispatching goods with a standard ERP invoice printout without obtaining an IRN from the IRP portal; state tax flying squads intercept the delivery truck at a highway checkpoint, seizing $350,000 of cargo and issuing a 100% penalty for tax evasion.",
    "tryItFriction": "Construct an E-Invoice JSON Schema Validator and IRN Generator in TypeScript: validate invoice payloads against government Schema v1.1 rules; compute theoretical 64-character IRN hashes (SHA-256 of SupplierGSTIN + FinYear + DocType + DocNo); format mock IRP API requests; and verify mock JWT digitally signed QR code responses.",
    "socraticHints": [
      "What four parameters are concatenated to compute the 64-character hexadecimal Invoice Reference Number (IRN)?",
      "Supplier GSTIN + Financial Year (e.g. 2026-27) + Document Type (INV/CRN/DBN) + Document Number.",
      "The concatenated string is hashed using SHA-256 to produce the unique 64-character IRN."
    ],
    "situationalPuzzle": {
      "scenario": "A manufacturing company with $8M annual turnover issues an invoice to an enterprise buyer. The accounts team prints the invoice directly from their legacy ERP without routing it through the E-Invoicing IRP portal. The buyer's accounts payable department receives the bill and immediately rejects it, stating: 'This document is legally invalid.' The manufacturer argues that the tax amounts and GSTINs are 100% accurate. Why is the document invalid?",
      "options": [
        "The invoice was printed on standard A4 paper.",
        "Absence of IRN & Legal Invalidity: Under Rule 48(4) of the CGST Rules, any invoice required to be issued under the E-Invoicing mandate that is issued without an IRN and signed QR code is deemed NOT to be an invoice. The buyer is legally prohibited from claiming Input Tax Credit on an un-invoiced document.",
        "The manufacturer did not send an email confirmation.",
        "E-Invoicing only applies to retail consumer sales."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under Rule 48(5), an invoice issued without an IRN by a mandated taxpayer is legally treated as if no invoice was ever issued. The buyer cannot claim ITC, and transporting goods on such an invoice exposes the consignment to statutory seizure under Section 129."
    },
    "quests": [
      {
        "num": 1,
        "title": "E-Invoicing System Architecture, Schema v1.1 & IRP API Specifications",
        "type": "Concept Quest",
        "description": "Analyze the technical specifications of government E-Invoicing portals, JSON Schema v1.1 validation rules, and IRN hash generation."
      },
      {
        "num": 2,
        "title": "Schema Validation Failure & Missing IRN Seizure Forensics",
        "type": "Detective Challenge",
        "description": "Investigate logistics incident logs where schema formatting errors prevented IRN generation, resulting in roadside consignment impoundment."
      },
      {
        "num": 3,
        "title": "E-Invoice JSON Generator & IRP Integration Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build an E-Invoicing pipeline in TypeScript generating compliant Schema v1.1 payloads, computing IRN hashes, and validating signed QR codes."
      },
      {
        "num": 4,
        "title": "Batch E-Invoice Generation & Schema Verification Lab",
        "type": "Production Incident Lab",
        "description": "Generate and validate 1,000 B2B invoices through the E-Invoice pipeline, verifying 100% schema compliance and valid IRN formatting."
      }
    ]
  },
  {
    "day": 24,
    "month": 1,
    "blockNum": 5,
    "title": "E-Way Bill Generation & Consignment Logistics Tracking",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Taxation Logistics (E-Way Bill System & Transit Compliance)",
    "spokenGoal": "Moving goods across state borders in India requires an Electronic Way Bill: the E-Way Bill (EWB). Under Rule 138 of the CGST Rules, every registered person who causes movement of goods of consignment value exceeding 50,000 INR must generate an E-Way Bill before dispatch! An E-Way Bill consists of two parts: Part A (Consignor, Consignee, HSN code, Invoice value, and GSTIN details) and Part B (Vehicle number, Transporter ID, and transport document number like LR/RR). Today, you will build an automated E-Way Bill Compliance Pipeline. You will calculate validity periods based on transit distance (1 day for every 200 km for regular cargo; 1 day for every 20 km for Over Dimensional Cargo), handle vehicle breakdown transshipment updates in Part B, and ensure consignments never travel on expired E-Way Bills!",
    "conceptInvariant": "E-Way Bill Logistics Invariant: Goods exceeding 50,000 INR in transit must be accompanied by an active, unexpired E-Way Bill with Part B matching the physical transport vehicle number; moving goods without an active E-Way Bill triggers 100% tax penalty and vehicle seizure.",
    "failureMode": "A transport truck suffers an engine breakdown during inter-state transit; the logistics team fails to update Part B with the replacement vehicle number; a highway tax checkpoint inspects the truck, finds a mismatched vehicle registration, and levies a $45,000 detention penalty.",
    "tryItFriction": "Construct an E-Way Bill Generator and Validity Calculator in TypeScript: evaluate consignment value thresholds (50,000 INR); compute legal validity duration based on distance (200 km per day); generate Part A and Part B payloads; support vehicle number updates during transit; and flag expiring EWBs 4 hours prior to expiration.",
    "socraticHints": [
      "What is the standard validity period formula for an E-Way Bill for regular cargo?",
      "1 day for distance up to 200 km, and 1 additional day for every 200 km (or part thereof) thereafter.",
      "The validity period begins from the time Part B (vehicle details) is updated."
    ],
    "situationalPuzzle": {
      "scenario": "A distributor dispatches a shipment of electronics worth 2,500,000 INR from Delhi to Mumbai (distance: 1,420 km). Part B of the E-Way Bill is generated on Monday at 10:00 AM. Regular cargo rules apply (200 km per day). What is the exact legal validity expiration day and time for this E-Way Bill?",
      "options": [
        "Wednesday at midnight.",
        "Next Monday at midnight: Total distance 1,420 km / 200 km = 7.1 days, which rounds up to 8 days of validity. The E-Way Bill will expire at midnight on the 8th day following the date of generation.",
        "24 hours from generation.",
        "E-Way Bills never expire once generated."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under Rule 138(10), validity is 1 day for every 200 km or part thereof. 1,420 km / 200 km = 7.1, which rounds up to 8 days. Validity expires at midnight on the 8th day from generation. Transporters must deliver before this deadline or extend the E-Way Bill within 8 hours of expiry."
    },
    "quests": [
      {
        "num": 1,
        "title": "E-Way Bill Statutory Framework, Distance Rules & Part A/B Mechanics",
        "type": "Concept Quest",
        "description": "Analyze Rule 138 provisions, 50k consignment thresholds, 200km/day distance formulas, and Part B transporter responsibilities."
      },
      {
        "num": 2,
        "title": "Expired E-Way Bill & Vehicle Mismatch Detention Forensics",
        "type": "Detective Challenge",
        "description": "Inspect logistics transit logs where unhandled vehicle breakdowns and expired EWBs led to statutory vehicle impoundment."
      },
      {
        "num": 3,
        "title": "Automated E-Way Bill Generation & Transporter Update Engine",
        "type": "Mastery Assignment",
        "description": "Build an E-Way Bill management engine in TypeScript calculating distance-based validity, generating Part A/B slips, and updating vehicle details."
      },
      {
        "num": 4,
        "title": "Simulated Vehicle Breakdown & Validity Extension Lab",
        "type": "Production Incident Lab",
        "description": "Simulate 500 active transit consignments with injected mechanical breakdowns, verifying automated Part B vehicle updates and validity extensions."
      }
    ]
  },
  {
    "day": 25,
    "month": 1,
    "blockNum": 5,
    "title": "Milestone Project 5: Automated E-Invoice JSON Generator & E-Way Bill Compliance Pipeline",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Milestone Project (Statutory Invoicing & Logistics Compliance)",
    "spokenGoal": "Congratulations! You have completed Block 5. Today is Milestone Project 5: you will architect, implement, and benchmark an integrated, enterprise-grade Automated E-Invoice JSON Generator and E-Way Bill Compliance Pipeline. Your platform will connect to enterprise sales billing modules, determine intra-state vs inter-state tax liability (CGST/SGST vs IGST), validate Rule 46 mandatory invoice fields, enforce HSN turnover standards and RCM self-invoicing, format compliant Schema v1.1 E-Invoice payloads to generate 64-character IRN hashes and signed QR codes, and generate corresponding Part A and Part B E-Way Bills with distance-based validity tracking. You will prove that your compliance engine operates with zero schema rejections and zero roadside transit violations across 2,500 enterprise consignments!",
    "conceptInvariant": "Taxation Compliance Pipeline Invariant: An institutional billing and logistics platform must atomically couple tax determination, E-Invoice IRN registration, and E-Way Bill generation, ensuring no shipment leaves the warehouse without verified statutory digital credentials.",
    "failureMode": "Deploying a billing pipeline that generates an E-Invoice IRN but fails to synchronize the corresponding E-Way Bill Part A; the warehouse dispatches the pallet, which is immediately detained at the state border for missing EWB credentials.",
    "tryItFriction": "Construct the Milestone 5 Compliance Engine in TypeScript: unite GST tax determination, Rule 46 validation, Schema v1.1 E-Invoice generation, SHA-256 IRN hashing, and E-Way Bill distance validity tracking; run a 2,500-consignment stress run asserting 100% schema pass rate and zero expired credentials.",
    "socraticHints": [
      "What are the four core systems united in Milestone Project 5?",
      "1. Tax Determination Core (Place of Supply, CGST/SGST/IGST, RCM checks).",
      "2. Rule 46 Validator (16 mandatory statutory invoice attributes).",
      "3. E-Invoicing Engine (Schema v1.1 JSON serialization, IRN hashing, signed QR payload).",
      "4. E-Way Bill Logistics Engine (Part A/B generation, distance matrix, validity scheduling)."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 5 platform is processing 500 dispatches per hour from a central fulfillment hub. A shipment of consumer appliances worth 450,000 INR is destined for Hyderabad (850 km away). The engine calculates 18% IGST, formats the Schema v1.1 E-Invoice, acquires an IRN, and generates an E-Way Bill with 5 days validity and vehicle details in Part B. As the truck departs, the warehouse manager checks the paperwork and smiles: 'Flawless compliance.' What architectural feature ensured this outcome?",
      "options": [
        "The manager called the tax office for verbal approval.",
        "Integrated Atomic Invoicing & Logistics Orchestration: By coupling E-Invoicing and E-Way Bill generation into a unified atomic pipeline, the system guaranteed that the invoice could not be finalized without simultaneous IRN registration and valid EWB generation, eliminating dispatch oversights.",
        "The driver was given cash to pay potential fines.",
        "The appliances were exempt from GST."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In enterprise supply chain software, decoupling invoicing from E-Way Bill generation leads to human error where invoices are printed but EWBs are forgotten. An integrated atomic pipeline guarantees that every outbound dispatch carries complete, verified statutory credentials."
    },
    "quests": [
      {
        "num": 1,
        "title": "E-Invoicing & E-Way Bill Unified Architecture Blueprint",
        "type": "Concept Quest",
        "description": "Architect the holistic dataflow connecting ERP sales orders, tax determination engines, IRP JSON schemas, and E-Way Bill portals."
      },
      {
        "num": 2,
        "title": "Decoupled EWB Dispatch & Highway Cargo Seizure Forensics",
        "type": "Detective Challenge",
        "description": "Analyze transportation seizure records where desynchronized invoicing and logistics credentials resulted in massive financial penalties."
      },
      {
        "num": 3,
        "title": "Milestone 5 Engine Implementation: Invoicing & Logistics Platform",
        "type": "Mastery Assignment",
        "description": "Build the complete Milestone 5 platform in TypeScript integrating GST determination, Schema v1.1 E-Invoicing, and automated E-Way Bill scheduling."
      },
      {
        "num": 4,
        "title": "Milestone 5 High-Volume Dispatch & Verification Lab",
        "type": "Production Incident Lab",
        "description": "Process 2,500 concurrent dispatch orders across all Indian states, verifying 100% compliant IRN generation and valid E-Way Bill scheduling."
      }
    ]
  },
  {
    "day": 26,
    "month": 1,
    "blockNum": 6,
    "title": "GST Input Tax Credit (ITC) Mechanics & Section 17(5) Blocked Credits",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Taxation Optimization (ITC Eligibility & Blocked Credits)",
    "spokenGoal": "The revolutionary benefit of GST is that you do not pay tax on tax: when you sell goods, you only pay tax on your added value because you deduct the tax you already paid on your purchases. This is called Input Tax Credit (ITC). Under Section 16 of the CGST Act, you can claim ITC if you possess a valid tax invoice, have received the goods, your supplier has actually paid the tax to the government, and you file your GST return. But there is a dangerous trap: Section 17(5) of the CGST Act explicitly lists 'Blocked Credits'—expenses where you can NEVER claim ITC, even if you paid GST! This includes motor vehicles for employees, food and beverages, outdoor catering, employee health club memberships, and goods lost, stolen, or given away as free gifts! Today, you will build an automated ITC Eligibility and Blocked Credit Filtering Engine.",
    "conceptInvariant": "ITC Invariant: Input Tax Credit can only be claimed if Section 16 eligibility criteria are met; any ITC claimed on Section 17(5) blocked credits is illegal, subject to mandatory reversal, 18% interest, and statutory penalty.",
    "failureMode": "Claiming $85,000 in Input Tax Credit on employee corporate catering and corporate gift hampers; the GST audit flags the claim under Section 17(5), demanding an immediate $85,000 cash tax reversal plus $23,000 in interest penalties.",
    "tryItFriction": "Construct an ITC Classification and Blocked Credit Engine in TypeScript: ingest a corporate purchase ledger with HSN/SAC codes and expense descriptions; evaluate Section 16 criteria and Section 17(5) blocked categories; segregate eligible ITC from ineligible/blocked ITC; and post separate GL accounts for Eligible ITC vs Expensed Blocked Tax.",
    "socraticHints": [
      "What are the three most common categories of blocked Input Tax Credit under Section 17(5)?",
      "1. Motor vehicles for transportation of persons (seating capacity <= 13) unless used for business of supply or driving training.",
      "2. Food and beverages, outdoor catering, beauty treatment, health services, and club memberships.",
      "3. Goods lost, stolen, destroyed, written off, or disposed of as free gifts or samples."
    ],
    "situationalPuzzle": {
      "scenario": "A software company spends $40,000 on outdoor catering for its annual employee anniversary party, paying $7,200 in 18% GST. The accountant credits Bank $47,200, debits Office Party Expense $40,000, and debits Electronic Credit Ledger $7,200 as Input Tax Credit. How should the transaction be corrected under Section 17(5)?",
      "options": [
        "The entry is correct; all employee events are tax-deductible.",
        "Section 17(5)(b)(i) Blocked Credit: Food, beverages, and outdoor catering are strictly blocked from Input Tax Credit unless used in the same line of business. The $7,200 GST cannot be credited; the entire $47,200 must be expensed directly to P&L (Office Party Expense: $47,200).",
        "The company should ask the caterer for a cash refund.",
        "The GST should be booked as a deferred asset."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under Section 17(5)(b)(i), GST paid on food, beverages, and outdoor catering cannot be claimed as Input Tax Credit. Claiming this credit in the monthly return triggers automatic tax demand notices. The GST amount must be absorbed as an expense."
    },
    "quests": [
      {
        "num": 1,
        "title": "Section 16 ITC Eligibility & Section 17(5) Blocked Credit Taxonomy",
        "type": "Concept Quest",
        "description": "Analyze Section 16 four-condition eligibility rules, 180-day vendor payment reversals, and Section 17(5) blocked categories."
      },
      {
        "num": 2,
        "title": "Ineligible ITC Audit Notice & Interest Penalty Forensics",
        "type": "Detective Challenge",
        "description": "Investigate tax demand notices to identify historical blocked credit claims on corporate vehicles and employee catering."
      },
      {
        "num": 3,
        "title": "Automated ITC Eligibility & Blocked Credit Filtering Engine",
        "type": "Mastery Assignment",
        "description": "Implement an ITC segregation engine in TypeScript classifying purchase vouchers into Eligible ITC and Expensed Ineligible Tax."
      },
      {
        "num": 4,
        "title": "Multi-Category Purchase Ledger ITC Reconciliation Lab",
        "type": "Production Incident Lab",
        "description": "Process 1,000 diverse corporate expenses, verifying 100% accurate segregation of Section 17(5) blocked credits and correct ledger routing."
      }
    ]
  },
  {
    "day": 27,
    "month": 1,
    "blockNum": 6,
    "title": "GSTR-2B vs Purchase Register Automated Reconciliation",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Taxation Reconciliation (2B vs Books & Vendor Compliance)",
    "spokenGoal": "Under modern GST rules (Rule 36(4)), you cannot claim Input Tax Credit simply because you have a paper invoice in your hand! You can ONLY claim ITC if your vendor has actually uploaded that invoice into their GSTR-1, which then populates your official government GSTR-2B statement on the 14th of every month. If your vendor forgets to upload their invoice, your company CANNOT claim the credit! For a corporation with thousands of vendors, reconciling the government GSTR-2B download against internal ERP Purchase Registers is a massive data matching problem. Today, you will build an Automated GSTR-2B Reconciliation Engine. You will implement multi-tiered fuzzy matching algorithms (matching Supplier GSTIN, Invoice Number with punctuation stripping, Invoice Date tolerance, and Invoice Value within +/- 1 INR), classify invoices into Matched, Missing in 2B, Missing in Books, and Mismatched Tax, and generate automated vendor nudge emails!",
    "conceptInvariant": "GSTR-2B Reconciliation Invariant: Input Tax Credit claimed in GSTR-3B must not exceed the eligible ITC reflected in auto-drafted GSTR-2B; unmatched invoices must be parked in a temporary reconciliation bucket until vendor compliance is confirmed.",
    "failureMode": "Failing to reconcile purchase books with GSTR-2B; a major supplier fails to file their quarterly returns, leaving $420,000 of ITC missing from GSTR-2B; the company claims the credit anyway, triggering an automated Section 73 tax demand notice with bank account freezing orders.",
    "tryItFriction": "Construct an Automated GSTR-2B Matching Engine in TypeScript: ingest an ERP Purchase Register and a government GSTR-2B JSON file; implement exact matching on GSTIN + clean Invoice No + Amount; implement fuzzy matching with 1-rupee rounding tolerance; classify discrepancies into 4 categories; and generate vendor compliance scorecards.",
    "socraticHints": [
      "Why does a difference in invoice numbering like 'INV/042' in books vs 'INV-042' in GSTR-2B cause standard database joins to fail?",
      "ERP users and vendors frequently enter punctuation, spaces, or leading zeros differently (e.g. '042' vs '42' or '/' vs '-').",
      "Reconciliation engines must normalize invoice numbers by stripping non-alphanumeric characters and leading zeros before matching."
    ],
    "situationalPuzzle": {
      "scenario": "At month-end GST filing, an enterprise purchase register shows $500,000 in eligible Input Tax Credit across 150 vendor invoices. When GSTR-2B is downloaded from the GST portal, it reports only $410,000 in available ITC. The matching engine identifies that Vendor ABC (responsible for $90,000 of ITC) filed their GSTR-1 on the 16th of the month instead of the statutory deadline of the 11th. Can the enterprise claim the $90,000 credit in this month's GSTR-3B return?",
      "options": [
        "Yes, because the vendor eventually filed.",
        "No: GSTR-2B is static and auto-drafts based on returns filed up to the 11th of the month. Returns filed after the 11th will not reflect in this month's GSTR-2B; they roll over into the NEXT month's GSTR-2B. Claiming the $90,000 this month will cause an automated portal mismatch notice.",
        "Yes, if the CFO signs an affidavit.",
        "GST portal rules allow a 20% estimated buffer without invoices."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. GSTR-2B is a static statement generated on the 14th of each month reflecting vendor filings submitted on or before the 11th (or 13th for quarterly filers). Filings submitted after the deadline do not appear in the current 2B; the credit is deferred until the subsequent month's GSTR-2B."
    },
    "quests": [
      {
        "num": 1,
        "title": "Rule 36(4) ITC Restrictions, GSTR-2B Architecture & Matching Rules",
        "type": "Concept Quest",
        "description": "Analyze statutory ITC matching restrictions under Rule 36(4), static GSTR-2B mechanics, and invoice normalization algorithms."
      },
      {
        "num": 2,
        "title": "Vendor Non-Filing & Disallowed ITC Tax Demand Forensics",
        "type": "Detective Challenge",
        "description": "Investigate corporate tax reconciliation records where non-compliant vendors triggered massive ITC disallowances and interest penalties."
      },
      {
        "num": 3,
        "title": "Automated GSTR-2B vs Books Reconciliation Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build a fuzzy matching reconciliation engine in TypeScript matching ERP purchase registers against government GSTR-2B JSON feeds."
      },
      {
        "num": 4,
        "title": "High-Volume Multi-Vendor 2B Discrepancy Matching Lab",
        "type": "Production Incident Lab",
        "description": "Reconcile 5,000 purchase invoices against simulated GSTR-2B data with 20% timing and formatting mismatches, asserting 100% classification accuracy."
      }
    ]
  },
  {
    "day": 28,
    "month": 1,
    "blockNum": 6,
    "title": "GSTR-1 & GSTR-3B Return Filing Workflow & Tax Payment Offsets",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Tax Operations (Return Filing & Electronic Ledger Offsets)",
    "spokenGoal": "Every month, Indian businesses execute a mandatory two-step tax filing workflow: filing GSTR-1 (the outward sales return) by the 11th, and filing GSTR-3B (the summary tax return and payment) by the 20th. When paying your tax in GSTR-3B, you don't just write a cheque; you utilize Electronic Ledgers: the Electronic Credit Ledger (Input Tax Credit) and the Electronic Cash Ledger (bank deposits). But you must obey strict statutory Tax Payment Offset Rules under Section 49 and 49A/49B of the CGST Act! Integrated GST (IGST) credit MUST be completely exhausted first to pay IGST, CGST, and SGST liabilities before ANY Central GST or State GST credit can be utilized! Furthermore, CGST credit can NEVER be used to pay SGST liability, and SGST credit can NEVER pay CGST liability! Today, you will build an automated Tax Offset and Electronic Ledger Engine.",
    "conceptInvariant": "Tax Offset Invariant: Under Section 49A/49B, IGST credit must be 100% exhausted before using CGST or SGST credit; cross-utilization between CGST credit and SGST liability is strictly prohibited by law.",
    "failureMode": "Attempting to offset State GST (SGST) tax liability using Central GST (CGST) credit; the tax portal rejects the return submission on the filing deadline, triggering late fees, interest, and e-way bill generation blocking.",
    "tryItFriction": "Construct a GSTR-3B Tax Offset and Electronic Ledger Engine in TypeScript: ingest output tax liabilities (IGST, CGST, SGST) and available Input Tax Credit (IGST, CGST, SGST); implement the legal priority offset algorithm (exhaust IGST credit first, then CGST/SGST with cross-utilization blocks); compute required cash ledger top-ups; and post balancing accounting entries.",
    "socraticHints": [
      "Can Central GST (CGST) credit ever be used to pay State GST (SGST) liability?",
      "Never! Under no circumstances can CGST credit offset SGST liability, nor can SGST credit offset CGST liability.",
      "They represent different governmental taxing authorities (Federal Union vs State Government)."
    ],
    "situationalPuzzle": {
      "scenario": "A business has the following month-end GST position in GSTR-3B: Output Liabilities: IGST = $0, CGST = $50,000, SGST = $50,000. Available Input Tax Credit: IGST Credit = $60,000, CGST Credit = $30,000, SGST Credit = $10,000. Following Section 49A/49B rules, how should the $60,000 IGST credit be legally utilized?",
      "options": [
        "IGST credit cannot be used because IGST liability is zero.",
        "IGST credit can be utilized against CGST and SGST in any proportion chosen by the taxpayer (e.g., $30,000 to CGST and $30,000 to SGST). CGST then uses $20,000 CGST credit (leaving $10k credit), and SGST uses $10,000 SGST credit plus $10,000 cash deposit. Total cash payment is minimized to $10,000.",
        "CGST and SGST credit must be used first before touching IGST.",
        "The $60,000 IGST credit must be forfeited."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under Rule 88A and Section 49A, IGST credit must be exhausted first, but the taxpayer can allocate it between CGST and SGST in any order or proportion. Strategically allocating $30,000 to CGST and $30,000 to SGST optimizes credit utilization and minimizes total net cash outflow."
    },
    "quests": [
      {
        "num": 1,
        "title": "GSTR-1/3B Compliance Cycles & Section 49A/49B Tax Offset Rules",
        "type": "Concept Quest",
        "description": "Analyze the statutory filing calendar, Electronic Cash/Credit ledgers, and the mathematical optimization of Rule 88A tax offsets."
      },
      {
        "num": 2,
        "title": "Illegal Cross-Utilization & Delayed Return Penalty Forensics",
        "type": "Detective Challenge",
        "description": "Inspect portal rejection logs where attempted CGST/SGST cross-utilization led to return filing deadlocks and late filing fees."
      },
      {
        "num": 3,
        "title": "GSTR-3B Tax Offset & Electronic Ledger Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build an automated tax offset optimizer in TypeScript calculating legal credit exhaustion order and required cash top-ups."
      },
      {
        "num": 4,
        "title": "Optimal Multi-Head Tax Payment Simulation Lab",
        "type": "Production Incident Lab",
        "description": "Simulate 500 diverse monthly tax liability profiles, verifying 100% legal compliance and mathematical minimization of cash payments."
      }
    ]
  },
  {
    "day": 29,
    "month": 1,
    "blockNum": 6,
    "title": "GST Annual Return GSTR-9/9C & Audit Reconciliation",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Taxation Audit (Annual Returns & GSTR-9/9C Reconciliation)",
    "spokenGoal": "At the close of the financial year, filing 12 monthly returns is not the end of the story. You must reconcile the entire year in the comprehensive GST Annual Return: GSTR-9, accompanied by GSTR-9C (Reconciliation Statement). GSTR-9 is the annual consolidation of all supplies declared, taxes paid, and Input Tax Credit claimed. GSTR-9C compares your audited statutory financial statements (Profit & Loss and Balance Sheet) against your GST returns, identifying discrepancies in turnover, tax rates, and Table 8A ITC matching (comparing GSTR-2A with books)! Any unexplained shortfall must be paid voluntarily using Form DRC-03 along with applicable interest! Today, you will build an automated GSTR-9/9C Annual Reconciliation Engine.",
    "conceptInvariant": "Annual Reconciliation Invariant: Audited financial statement turnover must reconcile with GST turnover declared in GSTR-9; discrepancies between Table 8A cumulative ITC and books must be reconciled or discharged via Form DRC-03.",
    "failureMode": "Submitting GSTR-9 with a $1.2M turnover mismatch between audited financial accounts and GSTR-3B; the tax department's automated risk engine flags the disparity, issuing an automated show-cause notice demanding tax on the variance.",
    "tryItFriction": "Construct an Annual GSTR-9 and GSTR-9C Reconciliation Engine in TypeScript: ingest 12 monthly GSTR-1 and GSTR-3B returns alongside the audited Annual P&L; reconcile Annual Gross Turnover (Books vs GST); reconcile Cumulative Input Tax Credit (Books vs GSTR-2A/Table 8A); calculate tax variances; and generate Form DRC-03 voluntary payment schedules.",
    "socraticHints": [
      "What is the core function of Form GSTR-9C?",
      "It is a formal reconciliation statement reconciling the turnover, taxes, and ITC in the audited Annual Financial Statements with the figures declared in Annual Return GSTR-9.",
      "It isolates timing differences, exempt turnover, and un-reconciled tax variances."
    ],
    "situationalPuzzle": {
      "scenario": "A company prepares its GSTR-9C reconciliation. The audited P&L shows total revenue of $10,000,000. The sum of 12 monthly GSTR-1 filings shows total turnover of $9,400,000. An audit reveals that $600,000 of the P&L revenue was unbilled revenue accrued under Ind AS 115 for work completed in March for which invoices were issued in April (new fiscal year). How should this be handled in GSTR-9C?",
      "options": [
        "Change the audited P&L to match GSTR-1.",
        "Reconcile as Unbilled Revenue Timing Difference: In Table 5B of GSTR-9C ('Unbilled revenue at the end of Financial Year'), record $600,000 as an addition to GST turnover. This reconciles the difference perfectly, proving that no GST was evaded and matching financial accounts with tax filings.",
        "Pay GST on the $600,000 twice.",
        "Ignore GSTR-9C because it is optional."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Accounting revenue recognized under accrual standards (Ind AS 115) does not always match GST taxable turnover (which requires a tax invoice or milestone). GSTR-9C explicitly provides Table 5B to adjust unbilled revenue timing differences, proving to tax authorities that the variance is valid and non-fraudulent."
    },
    "quests": [
      {
        "num": 1,
        "title": "GSTR-9 Annual Return Architecture, GSTR-9C Reconciliation & DRC-03 Rules",
        "type": "Concept Quest",
        "description": "Analyze GSTR-9 table structures, Table 8A cumulative ITC reconciliation, GSTR-9C audit adjustments, and voluntary tax payment via DRC-03."
      },
      {
        "num": 2,
        "title": "Turnover Disparity & Unbilled Revenue Audit Notice Forensics",
        "type": "Detective Challenge",
        "description": "Audit corporate annual reconciliation files to trace un-reconciled differences between audited P&L turnover and GST portal filings."
      },
      {
        "num": 3,
        "title": "GSTR-9/9C Annual Reconciliation Engine Implementation",
        "type": "Mastery Assignment",
        "description": "Build an annual GST reconciliation platform in TypeScript matching 12-month returns against audited books and generating DRC-03 schedules."
      },
      {
        "num": 4,
        "title": "Comprehensive Fiscal Year Audit & Reconciliation Lab",
        "type": "Production Incident Lab",
        "description": "Reconcile a full year of 12,000 transactions across 12 monthly filings and audited financials, verifying zero un-reconciled turnover variance."
      }
    ]
  },
  {
    "day": 30,
    "month": 1,
    "blockNum": 6,
    "title": "Month 1 Capstone Project 1: ApexLedger Enterprise Digital Accounting & GST Compliance Engine Capstone Viva Gate",
    "stageName": "Stage 1: Digital Accounting Foundations & ERP Systems",
    "stageNum": 1,
    "pedagogicalRole": "Month 1 Capstone & Viva Defense Gate (Full Accounting & GST Platform)",
    "spokenGoal": "Welcome to Day 30: The Month 1 Capstone Project and Mid-Program Viva Defense Gate of Course 22. Over the past 30 days, you have mastered the foundational mechanics of enterprise digital accounting and indirect taxation: double-entry ledger physics, hierarchical COAs, gapless voucher sequencing, automated BRS matching, fixed asset depreciation, multi-currency Ind AS 21 revaluations, FIFO inventory COGS, MCA immutable audit trails, forensic Benford anomaly detection, 3-way matching, E-Invoicing Schema v1.1, E-Way Bill logistics, Section 17(5) blocked ITC filtering, GSTR-2B fuzzy reconciliation, and GSTR-3B tax payment offsets. Today, you will synthesize every single subsystem into one sovereign platform: the ApexLedger Enterprise Digital Accounting & GST Compliance Platform. During your live Capstone Viva, the senior financial and audit evaluation board will inject out-of-balance entries, rogue direct database edits, non-compliant vendor filings, and blocked credits. You will prove that your platform guarantees zero unbalanced vouchers, zero audit trail breaks, and 100% tax compliance under live adversarial conditions!",
    "conceptInvariant": "ApexLedger Sovereign Platform Invariant: The ApexLedger platform represents the total synthesis of enterprise accounting and statutory indirect taxation: enforcing double-entry mathematical duality while maintaining immutable audit trails and 100% compliant GST workflows.",
    "failureMode": "Presenting a capstone platform that balances calm transactional test data but allows an un-reconciled GSTR-2B credit to claim input tax or permits an unbalanced journal voucher to commit when subjected to adversarial stress testing during the Viva examination.",
    "tryItFriction": "Execute the ApexLedger Sovereign Platform in TypeScript: ingest multi-currency vouchers, maintain gapless sequencing and sub-ledger sync, enforce MCA hash-chained audit logging, generate Schema v1.1 E-Invoices with IRN, reconcile GSTR-2B vs purchase books, and optimize GSTR-3B tax offsets; survive 5,000 simulated stress transactions with 100% compliance pass rate.",
    "socraticHints": [
      "What are the core integrated subsystems required in the ApexLedger Master Platform?",
      "1. Core Accounting & Ledger Engine (double-entry, COA hierarchy, gapless vouchers, trial balance).",
      "2. Treasury & Asset Management (BRS 2-way matching, imprest cash, accruals, FAR depreciation).",
      "3. Global ERP & Inventory Bridge (idempotent webhooks, Ind AS 21 forex, cost allocation, FIFO COGS).",
      "4. Statutory Governance & Forensics (MCA SHA-256 audit chaining, Benford detection, 3-way match, period close).",
      "5. GST & Invoicing Engine (Rule 46 checks, Schema v1.1 E-Invoice IRN, E-Way Bill logistics, blocked ITC, 2B matching, 3B offset)."
    ],
    "situationalPuzzle": {
      "scenario": "During your Month 1 Capstone Viva Gate examination, the senior audit partner injects a multi-vector financial crisis: 1) a supplier invoice claiming blocked catering credit under Section 17(5); 2) a vendor invoice missing from GSTR-2B; 3) an attempt to post a voucher directly to a closed fiscal year; and 4) an attempted direct SQL modification of an invoice amount. Your ApexLedger platform segregates the blocked credit into P&L expenses, defers the missing 2B credit, rejects the closed-period voucher, and detects the broken SHA-256 audit chain in 14 milliseconds. The partner smiles: 'Outstanding work, Controller.' What core discipline made this possible?",
      "options": [
        "The computer had a fast processor.",
        "Integrated Financial Engineering & Statutory Defense-in-Depth: Fusing mathematical double-entry accounting mechanics with rigorous statutory tax governance and cryptographic audit immutability, proving that digital financial systems can be engineered with zero tolerance for error or fraud.",
        "The simulation was run in test mode.",
        "The partner made an error in the evaluation."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. True enterprise financial systems engineering is the convergence of accounting principles, statutory tax regulations, and robust software architecture. By uniting mathematical ledger balance with immutable audit logging and proactive tax compliance, the engineer builds systems that can withstand the most rigorous corporate audits."
    },
    "quests": [
      {
        "num": 1,
        "title": "ApexLedger Platform Architectural Blueprint & Formal Charter",
        "type": "Concept Quest",
        "description": "Formulate the comprehensive architectural charter for the ApexLedger platform detailing all accounting, audit, and tax subsystems."
      },
      {
        "num": 2,
        "title": "Adversarial Multi-Vector Audit Stress Testing & Vulnerability Harness",
        "type": "Detective Challenge",
        "description": "Construct an automated test harness injecting blocked credits, missing 2B entries, period-lock breaches, and database tampering."
      },
      {
        "num": 3,
        "title": "ApexLedger Sovereign Accounting & GST Platform Master Implementation",
        "type": "Mastery Assignment",
        "description": "Implement the complete Month 1 Capstone platform in TypeScript uniting double-entry ledgers, MCA audit trails, E-Invoicing, and 2B reconciler."
      },
      {
        "num": 4,
        "title": "Senior Statutory Audit Partner Capstone 1 Viva Defense Gate",
        "type": "Production Incident Lab",
        "description": "Defend the ApexLedger platform under live multi-vector simulated financial stress before the Senior Review Board, earning Month 1 certification."
      }
    ]
  }
]
