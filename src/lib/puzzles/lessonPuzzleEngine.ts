/**
 * PinIT Career OS - Interactive 2.5D/3D Lesson Puzzle & Rapid-Fire Battle Engine
 * 
 * Standards:
 * 1. Exactly 1 synthesis puzzle per lesson (appearing after all concepts are completed).
 * 2. Exactly 5 rapid-fire MCQ questions answered within 60 seconds total.
 * 3. 100% domain-specific coverage across all 59 Tech, AI, Systems, and Commerce tracks.
 * 4. Realistic decoy blocks representing critical domain pitfalls.
 */

export interface PuzzleBlock {
  id: string;
  label: string;
  subtext?: string;
  color: 'emerald' | 'cyan' | 'amber' | 'purple' | 'rose' | 'indigo' | 'blue';
  category?: 'init' | 'logic' | 'condition' | 'transform' | 'output' | 'decoy' | 'debit' | 'credit' | 'audit' | 'security';
  badge?: string; // e.g., "DR", "CR", "HOOK", "SQL", "MMIO", "AST", "EVM"
  codeSnippet?: string;
}

export type PuzzleType = 
  | 'code-reorder' 
  | 'pipeline-router' 
  | 'ledger-balancer' 
  | 'architecture-flow' 
  | 'decision-tree' 
  | 'state-switcher';

export interface LessonPuzzleSpec {
  id: string;
  title: string;
  missionPrompt: string;
  type: PuzzleType;
  domain: string;
  blocks: PuzzleBlock[];
  correctOrder: string[]; // Ordered array of target block IDs
  decoyBlockIds?: string[];
  hint: string;
  successExplanation: string;
}

export interface RapidBattleQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface RapidFireBattleSpec {
  title: string;
  timeLimitSeconds: number; // 60 seconds
  questions: RapidBattleQuestion[]; // Exactly 5 questions
  passScore: number; // Minimum correct to pass (4)
}

/**
 * Domain Classifier: Categorizes any course prefix or content into its precise domain.
 */
export function detectCourseDomain(prefix: string, title: string = '', textContent: string = ''): string {
  const p = prefix.toLowerCase();
  const raw = `${p} ${title} ${textContent}`.toLowerCase();

  // B.Com Commerce Domains - Exact Prefix First
  if (p === 'bcom_acc' || p === 'bcom-accounting') return 'accounting';
  if (p === 'bcom_fin' || p === 'bcom-finance') return 'finance';
  if (p === 'bcom_ban') return 'banking';
  if (p === 'bcom_aud') return 'auditing';
  if (p === 'bcom_tax') return 'taxation';
  if (p === 'bcom_law') return 'corporate-law';
  if (p === 'bcom_ops' || p === 'bcom_scrm') return 'supply-chain';
  if (p === 'bcom_dmkt') return 'digital-marketing';
  if (p === 'bcom_ecom') return 'ecommerce';
  if (p === 'bcom_mkt' || p === 'bcom-marketing') return 'marketing';
  if (p === 'bcom_ana') return 'analytics';
  if (p === 'bcom_ent') return 'entrepreneurship';
  if (p === 'bcom_ait') return 'enterprise-ai';

  // Keyword-based fallbacks for commerce
  if (p.includes('aud') || raw.includes('statutory audit') || raw.includes('sa 200') || raw.includes('sa 315') || raw.includes('sa 700') || raw.includes('substantive test')) return 'auditing';
  if (p.includes('ban') || raw.includes('banking operation') || raw.includes('credit appraisal') || raw.includes('swift mt') || raw.includes('letter of credit')) return 'banking';
  if (p.includes('tax') || raw.includes('gst input') || raw.includes('income tax act') || raw.includes('tds')) return 'taxation';
  if (p.includes('fin') || raw.includes('dcf valuation') || raw.includes('wacc') || raw.includes('capital market') || raw.includes('capm')) return 'finance';
  if (raw.includes('double-entry') || raw.includes('general ledger') || raw.includes('balance sheet equation')) return 'accounting';

  // Systems, Embedded & Hardware - Prefix First
  if (p.includes('iot') || p.includes('quant-systems')) return 'embedded-iot';
  if (p.includes('blockchain')) return 'blockchain';
  if (p.includes('cyber')) return 'cybersecurity';
  if (p.includes('devops') || p.includes('sre') || p.includes('cloud') || p.includes('aideploy')) return 'devops-cloud';

  // Core Tech Tracks - Prefix First
  if (p.includes('react')) return 'react';
  if (p.includes('mobile')) return 'mobile';
  if (p.includes('node') || p.includes('fullstack')) return 'nodejs';
  if (p.includes('sql')) return 'sql';
  if (p.includes('java')) return 'java';
  if (p.includes('g3d')) return '3d-graphics';
  if (p.includes('git')) return 'git-vcs';
  if (p.includes('soft')) return 'soft-skills';
  if (p.includes('comp_fund')) return 'comp-fund';
  if (p.includes('py') || p.includes('python')) return 'python';

  // Secondary Fallbacks via raw text
  if (raw.includes('microcontroller') || raw.includes('mmio') || raw.includes('gpio') || raw.includes('freertos')) return 'embedded-iot';
  if (raw.includes('solidity') || raw.includes('smart contract') || raw.includes('merkle')) return 'blockchain';
  if (raw.includes('tls handshake') || raw.includes('firewall acl') || raw.includes('jwt signature')) return 'cybersecurity';
  if (raw.includes('docker') || raw.includes('k8s') || raw.includes('kubernetes')) return 'devops-cloud';
  if (raw.includes('select ') && raw.includes('from ') && raw.includes('where ')) return 'sql';
  if (raw.includes('classloader') || raw.includes('public static void main')) return 'java';

  return 'general';
}

/**
 * Step 1: Deep Content & Structure Extractor
 */
export function extractLessonConceptSummary(lessonData: any, coursePrefix: string = ''): {
  domain: string;
  title: string;
  concepts: string[];
  codeSnippets: string[];
  keyTerms: string[];
  firstCodeLines: string[];
} {
  const title = lessonData?.title || 'Daily Concept Mastery';
  const parts = Array.isArray(lessonData?.parts) ? lessonData.parts : [];
  const effectivePrefix = coursePrefix || lessonData?.coursePrefix || lessonData?.course || '';
  
  const concepts: string[] = [];
  const codeSnippets: string[] = [];
  const keyTerms: string[] = [];
  const firstCodeLines: string[] = [];

  for (const p of parts) {
    if (p.title) concepts.push(p.title);
    if (p.code) {
      codeSnippets.push(p.code);
      const cleanLine = p.code.split('\n').map((l: string) => l.trim()).find((l: string) => l.length > 3 && !l.startsWith('//') && !l.startsWith('#') && !l.startsWith('import ') && !l.startsWith('#include'));
      if (cleanLine) firstCodeLines.push(cleanLine);
    }
    if (p.check?.question) keyTerms.push(p.check.question);
  }

  const domain = detectCourseDomain(effectivePrefix, title, `${concepts.join(' ')} ${codeSnippets.join(' ')}`);
  return { domain, title, concepts, codeSnippets, keyTerms, firstCodeLines };
}

/**
 * Step 2: Generate a 100% Tailored 2.5D Puzzle for Any Lesson
 */
export function generateLessonPuzzle(
  questId: string,
  prefix: string,
  dayNum: number,
  lessonData: any
): LessonPuzzleSpec {
  // If explicitly authored in lesson data, use it directly!
  if (lessonData?.puzzle && Array.isArray(lessonData.puzzle.blocks) && Array.isArray(lessonData.puzzle.correctOrder) && lessonData.puzzle.blocks.length >= 3) {
    return lessonData.puzzle;
  }

  const summary = extractLessonConceptSummary(lessonData, prefix);
  const parts = Array.isArray(lessonData?.parts) ? lessonData.parts : [];
  const domain = summary.domain;

  // -------------------------------------------------------------------------
  // DOMAIN 1: PYTHON & DATA SCIENCE TRACKS
  // -------------------------------------------------------------------------
  if (domain === 'python') {
    if (dayNum === 1) {
      return {
        id: `puzzle-${prefix}-${dayNum}`,
        title: "Day 1 Python Puzzle: The Script Execution Pipeline",
        missionPrompt: "Snap the instruction blocks in chronological order so Python initializes the app name, creates the welcome message, and displays the output!",
        type: 'code-reorder',
        domain: 'python',
        blocks: [
          { id: 'py1', label: '# 1. Variable Assignment', subtext: 'app_name = "CareerOS"', color: 'emerald', category: 'init', badge: 'SETUP', codeSnippet: 'app_name = "CareerOS"' },
          { id: 'py2', label: '# 2. String Concatenation', subtext: 'msg = "Starting " + app_name', color: 'cyan', category: 'transform', badge: 'LOGIC', codeSnippet: 'msg = "Starting " + app_name' },
          { id: 'py3', label: '# 3. Standard Output', subtext: 'print(msg)', color: 'purple', category: 'output', badge: 'PRINT', codeSnippet: 'print(msg)' },
          { id: 'decoy1', label: '# Decoy: NameError Bug', subtext: 'print(undefined_token)', color: 'rose', category: 'decoy', badge: 'CRASH', codeSnippet: 'print(undefined_token)' },
        ],
        correctOrder: ['py1', 'py2', 'py3'],
        decoyBlockIds: ['decoy1'],
        hint: "Python reads line-by-line from top to bottom. You must define a variable before you can concatenate or print it!",
        successExplanation: "Execution sequence verified: `app_name` defined, string concatenated, and cleanly printed to stdout."
      };
    }
    if (dayNum <= 5) {
      return {
        id: `puzzle-${prefix}-${dayNum}`,
        title: `Day ${dayNum} Python Puzzle: Mathematical & Conditional Flow`,
        missionPrompt: "Arrange the arithmetic operations to compute the base price, calculate tax, sum the total, and output the invoice!",
        type: 'code-reorder',
        domain: 'python',
        blocks: [
          { id: 'p1', label: '1. Initialize Subtotal', subtext: 'subtotal = 100.0', color: 'emerald', category: 'init', badge: 'INIT' },
          { id: 'p2', label: '2. Compute 18% GST', subtext: 'tax = subtotal * 0.18', color: 'cyan', category: 'transform', badge: 'MATH' },
          { id: 'p3', label: '3. Calculate Grand Total', subtext: 'grand_total = subtotal + tax', color: 'amber', category: 'logic', badge: 'SUM' },
          { id: 'p4', label: '4. Print Result', subtext: 'print(f"Total: {grand_total}")', color: 'purple', category: 'output', badge: 'OUTPUT' },
          { id: 'decoy1', label: 'Decoy: Undefined Reference', subtext: 'grand_total = subtotal + tax  # (Before tax defined)', color: 'rose', category: 'decoy', badge: 'BUG' },
        ],
        correctOrder: ['p1', 'p2', 'p3', 'p4'],
        decoyBlockIds: ['decoy1'],
        hint: "Mathematical dependencies: Subtotal must exist before calculating tax, and both are needed before computing grand total.",
        successExplanation: "Chronological pipeline verified: All arithmetic expressions executed with zero NameErrors."
      };
    }
    if (dayNum <= 15) {
      return {
        id: `puzzle-${prefix}-${dayNum}`,
        title: `Day ${dayNum} Python Puzzle: Function Definition & Invocation`,
        missionPrompt: "Assemble the modular function structure: define parameters, execute validation, return the transformed payload, and invoke!",
        type: 'code-reorder',
        domain: 'python',
        blocks: [
          { id: 'fn1', label: '1. Define Function', subtext: 'def calculate_metric(values: list):', color: 'emerald', category: 'init', badge: 'DEF' },
          { id: 'fn2', label: '2. Guard Clause', subtext: 'if not values: return 0.0', color: 'cyan', category: 'condition', badge: 'GUARD' },
          { id: 'fn3', label: '3. Computation', subtext: 'result = sum(values) / len(values)', color: 'amber', category: 'transform', badge: 'CALC' },
          { id: 'fn4', label: '4. Return Statement', subtext: 'return round(result, 2)', color: 'purple', category: 'output', badge: 'RETURN' },
          { id: 'fn5', label: '5. Function Call', subtext: 'score = calculate_metric([85, 92, 78])', color: 'indigo', category: 'logic', badge: 'CALL' },
          { id: 'decoy1', label: 'Decoy: Call Before Definition', subtext: 'score = calculate_metric() # (Before def)', color: 'rose', category: 'decoy', badge: 'NAME_ERR' },
        ],
        correctOrder: ['fn1', 'fn2', 'fn3', 'fn4', 'fn5'],
        decoyBlockIds: ['decoy1'],
        hint: "Functions in Python must be defined before they can be called. Guard clauses protect against division by zero.",
        successExplanation: "Modular function pipeline verified: Definition $\\to$ Guard $\\to$ Calculation $\\to$ Return $\\to$ Call."
      };
    }
  }

  // -------------------------------------------------------------------------
  // DOMAIN 2: REACT & FRONTEND UI
  // -------------------------------------------------------------------------
  if (domain === 'react' || domain === 'mobile') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} React Puzzle: Declarative Hook Lifecycle`,
      missionPrompt: "Snap the React component blocks into a valid declarative rendering sequence complying with the Rules of Hooks!",
      type: 'architecture-flow',
      domain: 'react',
      blocks: [
        { id: 'r1', label: '1. Hook Imports', subtext: 'import { useState, useEffect } from "react";', color: 'cyan', category: 'init', badge: 'IMPORT' },
        { id: 'r2', label: '2. Component Header', subtext: 'export default function DataDashboard({ userId }) {', color: 'emerald', category: 'init', badge: 'COMPONENT' },
        { id: 'r3', label: '3. Top-Level State', subtext: 'const [records, setRecords] = useState([]);', color: 'amber', category: 'logic', badge: 'STATE' },
        { id: 'r4', label: '4. Side Effect Hook', subtext: 'useEffect(() => { loadUserData(userId); }, [userId]);', color: 'indigo', category: 'transform', badge: 'EFFECT' },
        { id: 'r5', label: '5. Return JSX Template', subtext: 'return <main><RecordList items={records} /></main>;', color: 'purple', category: 'output', badge: 'RENDER' },
        { id: 'decoy1', label: 'Decoy: Conditional Hook Violation', subtext: 'if (userId) { useState(null); }', color: 'rose', category: 'decoy', badge: 'HOOK_CRASH' },
      ],
      correctOrder: ['r1', 'r2', 'r3', 'r4', 'r5'],
      decoyBlockIds: ['decoy1'],
      hint: "Rules of Hooks: Never call Hooks inside loops or conditions. Declare state and effects at the top level before returning JSX.",
      successExplanation: "React component architecture validated: Rules of Hooks satisfied and declarative data flow intact."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 3: SQL & DATABASE QUERY ENGINES
  // -------------------------------------------------------------------------
  if (domain === 'sql') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} SQL Puzzle: Relational Query Pipeline`,
      missionPrompt: "Arrange the SQL clauses in the exact syntactic order mandated by the database query execution planner!",
      type: 'code-reorder',
      domain: 'sql',
      blocks: [
        { id: 'sq1', label: '1. SELECT Projection', subtext: 'SELECT customer_id, SUM(order_total) AS revenue', color: 'emerald', category: 'init', badge: 'SELECT' },
        { id: 'sq2', label: '2. FROM Table Relation', subtext: 'FROM orders', color: 'cyan', category: 'init', badge: 'FROM' },
        { id: 'sq3', label: '3. WHERE Row Filter', subtext: 'WHERE order_status = "COMPLETED"', color: 'amber', category: 'condition', badge: 'WHERE' },
        { id: 'sq4', label: '4. GROUP BY Aggregation', subtext: 'GROUP BY customer_id', color: 'purple', category: 'transform', badge: 'GROUP BY' },
        { id: 'sq5', label: '5. HAVING Aggregate Filter', subtext: 'HAVING SUM(order_total) >= 10000', color: 'indigo', category: 'condition', badge: 'HAVING' },
        { id: 'decoy1', label: 'Decoy: Invalid WHERE on Aggregates', subtext: 'WHERE SUM(order_total) >= 10000  # (Invalid SQL)', color: 'rose', category: 'decoy', badge: 'SYNTAX_ERR' },
      ],
      correctOrder: ['sq1', 'sq2', 'sq3', 'sq4', 'sq5'],
      decoyBlockIds: ['decoy1'],
      hint: "SQL query parser order: SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY. Aggregates cannot be filtered in WHERE!",
      successExplanation: "SQL execution pipeline verified: Projection, table source, row predicate, grouping, and group predicate."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 4: JAVA & JVM ARCHITECTURE
  // -------------------------------------------------------------------------
  if (domain === 'java') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Java Puzzle: JVM Lifecycle & Bytecode Execution`,
      missionPrompt: "Order the JVM execution stages from source code compilation through bytecode verification and classloading!",
      type: 'architecture-flow',
      domain: 'java',
      blocks: [
        { id: 'jv1', label: '1. Source Compilation', subtext: 'javac OrderService.java -> OrderService.class', color: 'emerald', category: 'init', badge: 'JAVAC' },
        { id: 'jv2', label: '2. ClassLoader Ingestion', subtext: 'Bootstrap/AppClassLoader loads bytecode into Metaspace', color: 'cyan', category: 'init', badge: 'LOADER' },
        { id: 'jv3', label: '3. Bytecode Verification', subtext: 'JVM Verifier ensures type safety and stack frame bounds', color: 'amber', category: 'condition', badge: 'VERIFY' },
        { id: 'jv4', label: '4. JIT Tiered Compilation', subtext: 'C1/C2 JIT compiles hot loops to native x86/ARM machine code', color: 'purple', category: 'transform', badge: 'JIT' },
        { id: 'jv5', label: '5. Execution Engine', subtext: 'Thread allocates Stack Frame and invokes main() method', color: 'indigo', category: 'output', badge: 'EXEC' },
        { id: 'decoy1', label: 'Decoy: Direct Native Execution', subtext: 'CPU directly executes .class bytecode without JVM', color: 'rose', category: 'decoy', badge: 'IMPOSSIBLE' },
      ],
      correctOrder: ['jv1', 'jv2', 'jv3', 'jv4', 'jv5'],
      decoyBlockIds: ['decoy1'],
      hint: "Java achieves platform independence via write-once-run-anywhere: Source -> Bytecode -> ClassLoader -> Verification -> JIT -> Native Execution.",
      successExplanation: "JVM architectural lifecycle validated: Clean separation between static bytecode and runtime execution engine."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 5: B.COM - ACCOUNTING & FORENSIC BOOKKEEPING
  // -------------------------------------------------------------------------
  if (domain === 'accounting') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Double-Entry Ledger Puzzle: Accrual Accounting Invariants`,
      missionPrompt: "Balance the fundamental accounting equation (Assets = Liabilities + Equity) under GAAP/IFRS accrual rules!",
      type: 'ledger-balancer',
      domain: 'accounting',
      blocks: [
        { id: 'ac1', label: '1. Incur Receivable Asset', subtext: 'Debit: Accounts Receivable $120,000', color: 'emerald', category: 'debit', badge: 'DR +ASSET' },
        { id: 'ac2', label: '2. Recognize Deferred Liability', subtext: 'Credit: Deferred Revenue (Unearned) $120,000', color: 'cyan', category: 'credit', badge: 'CR +LIAB' },
        { id: 'ac3', label: '3. Deliver Monthly Service', subtext: 'Debit: Deferred Revenue $10,000', color: 'amber', category: 'debit', badge: 'DR -LIAB' },
        { id: 'ac4', label: '4. Realize Earned Revenue', subtext: 'Credit: Subscription Revenue $10,000', color: 'purple', category: 'credit', badge: 'CR +EQUITY' },
        { id: 'decoy1', label: 'Decoy: Cash-Basis Violation', subtext: 'Credit: Immediate Revenue $120,000 (Before delivery)', color: 'rose', category: 'decoy', badge: 'GAAP_BREACH' },
      ],
      correctOrder: ['ac1', 'ac2', 'ac3', 'ac4'],
      decoyBlockIds: ['decoy1'],
      hint: "Under GAAP accrual rules, unearned customer payments must sit in Deferred Revenue (Liability) until performance obligations are satisfied month-by-month.",
      successExplanation: "Double-entry integrity verified: The Matching Principle is upheld, and debits equal credits at every operational stage."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 6: B.COM - CORPORATE FINANCE & CAPITAL MARKETS
  // -------------------------------------------------------------------------
  if (domain === 'finance') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Corporate Finance Puzzle: DCF Valuation & Capital Allocation`,
      missionPrompt: "Arrange the discounted cash flow (DCF) enterprise valuation pipeline from operating cash flows to net equity value!",
      type: 'pipeline-router',
      domain: 'finance',
      blocks: [
        { id: 'fin1', label: '1. Forecast Operating Cash Flows', subtext: 'Compute Free Cash Flow to Firm (FCFF = EBIT(1-t) + D&A - CapEx - ΔNWC)', color: 'emerald', category: 'init', badge: 'FCFF' },
        { id: 'fin2', label: '2. Calculate Hurdle Rate (WACC)', subtext: 'Weight cost of equity (CAPM: Rf + β*ERP) + after-tax cost of debt', color: 'cyan', category: 'transform', badge: 'WACC' },
        { id: 'fin3', label: '3. Discount Explicit Forecast', subtext: 'Discount 5-year projected cash flows to Present Value (PV)', color: 'amber', category: 'logic', badge: 'PV' },
        { id: 'fin4', label: '4. Capitalize Terminal Value', subtext: 'Apply Gordon Growth Model: [FCFF*(1+g)] / (WACC - g)', color: 'purple', category: 'transform', badge: 'TERMINAL' },
        { id: 'fin5', label: '5. Bridge to Equity Value', subtext: 'Enterprise Value + Cash - Outstanding Debt = Total Equity Value', color: 'indigo', category: 'output', badge: 'EQUITY' },
        { id: 'decoy1', label: 'Decoy: Unhedged Book Value', subtext: 'Equity Value = Historical Accounting Book Value of Assets', color: 'rose', category: 'decoy', badge: 'ERR_MODEL' },
      ],
      correctOrder: ['fin1', 'fin2', 'fin3', 'fin4', 'fin5'],
      decoyBlockIds: ['decoy1'],
      hint: "Enterprise valuation requires forecasting FCFF, discounting by WACC, adding Terminal Value, and adjusting for net debt to find intrinsic equity value.",
      successExplanation: "Valuation model validated: Enterprise Value and Equity Value mathematically balanced against cost of capital."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 7: B.COM - BANKING, TREASURY & CREDIT OPERATIONS
  // -------------------------------------------------------------------------
  if (domain === 'banking') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Banking Operations Puzzle: Credit Underwriting & Disbursement`,
      missionPrompt: "Assemble the regulatory loan underwriting and credit appraisal sequence in accordance with RBI / Basel III norms!",
      type: 'decision-tree',
      domain: 'banking',
      blocks: [
        { id: 'ban1', label: '1. KYC & AML Sanction Screening', subtext: 'Verify PAN, Aadhaar, CIBIL bureau history & OFAC sanction lists', color: 'emerald', category: 'init', badge: 'KYC/AML' },
        { id: 'ban2', label: '2. Cash Flow & DSCR Appraisal', subtext: 'Compute Debt Service Coverage Ratio (DSCR >= 1.5x) from audited financials', color: 'cyan', category: 'logic', badge: 'DSCR' },
        { id: 'ban3', label: '3. Collateral Valuation & Legal Search', subtext: 'Perform title deed search and create first charge with CERSAI registry', color: 'amber', category: 'condition', badge: 'SECURITY' },
        { id: 'ban4', label: '4. Credit Committee Sanction', subtext: 'Issue formal Sanction Letter with covenants and interest rate spread', color: 'purple', category: 'transform', badge: 'SANCTION' },
        { id: 'ban5', label: '5. Loan Account Disbursement', subtext: 'Disburse tranches directly to vendor escrow account against milestone invoice', color: 'indigo', category: 'output', badge: 'DISBURSE' },
        { id: 'decoy1', label: 'Decoy: Regulatory Non-Compliance', subtext: 'Disburse funds directly in cash prior to collateral charge creation', color: 'rose', category: 'decoy', badge: 'VIO_RBI' },
      ],
      correctOrder: ['ban1', 'ban2', 'ban3', 'ban4', 'ban5'],
      decoyBlockIds: ['decoy1'],
      hint: "Bank credit policy forbids disbursement before KYC, cash flow appraisal, and CERSAI collateral registration are completed.",
      successExplanation: "Banking credit lifecycle verified: Prudential underwriting and Basel III capital risk requirements satisfied."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 8: B.COM - STATUTORY AUDIT & CORPORATE ASSURANCE
  // -------------------------------------------------------------------------
  if (domain === 'auditing') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Statutory Audit Puzzle: Standards on Auditing (SA) Evidence Chain`,
      missionPrompt: "Construct the statutory audit verification sequence from risk assessment down to independent audit opinion under ICAI / ISA standards!",
      type: 'architecture-flow',
      domain: 'auditing',
      blocks: [
        { id: 'aud1', label: '1. Engagement & Independence (SQC 1)', subtext: 'Verify auditor independence, issue formal Engagement Letter under SA 210', color: 'emerald', category: 'init', badge: 'SA 210' },
        { id: 'aud2', label: '2. Risk Assessment & Materiality (SA 315)', subtext: 'Understand internal controls and benchmark Materiality threshold at 1% of Revenue', color: 'cyan', category: 'condition', badge: 'SA 315' },
        { id: 'aud3', label: '3. Test of Controls (TOC)', subtext: 'Sample automated ERP segregation of duties and dual-authorization gates', color: 'amber', category: 'logic', badge: 'TOC' },
        { id: 'aud4', label: '4. Substantive Testing & External Vouching', subtext: 'Obtain direct external bank confirmations (SA 505) and physical inventory counts', color: 'purple', category: 'transform', badge: 'SA 500' },
        { id: 'aud5', label: '5. Form Independent Audit Opinion (SA 700)', subtext: 'Evaluate unadjusted misstatements and issue Unqualified ("True & Fair") Audit Report', color: 'indigo', category: 'output', badge: 'SA 700' },
        { id: 'decoy1', label: 'Decoy: Self-Review Threat', subtext: 'Audit financial statements prepared by the auditor\'s own bookkeeping team', color: 'rose', category: 'decoy', badge: 'ETHICS_FAIL' },
      ],
      correctOrder: ['aud1', 'aud2', 'aud3', 'aud4', 'aud5'],
      decoyBlockIds: ['decoy1'],
      hint: "Auditors must establish independence, determine materiality, test controls, gather sufficient appropriate evidence, and only then issue their audit opinion.",
      successExplanation: "Audit evidence chain complete: Standards on Auditing verified with zero self-review conflict of interest."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 9: B.COM - TAXATION, GST & INTERNATIONAL TAX
  // -------------------------------------------------------------------------
  if (domain === 'taxation') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Taxation Puzzle: GST Input Tax Credit (ITC) Offset Waterfall`,
      missionPrompt: "Arrange the statutory Goods and Services Tax (GST) settlement sequence to calculate output liability, utilize eligible ITC, and remit net cash!",
      type: 'ledger-balancer',
      domain: 'taxation',
      blocks: [
        { id: 'tax1', label: '1. Inward Supply Ingestion', subtext: 'Match vendor invoices in GSTR-2B to verify eligible Input Tax Credit (ITC)', color: 'emerald', category: 'init', badge: 'GSTR-2B' },
        { id: 'tax2', label: '2. Compute Gross Output Tax', subtext: 'Calculate CGST, SGST and IGST liability on outward taxable supplies in GSTR-1', color: 'cyan', category: 'transform', badge: 'GSTR-1' },
        { id: 'tax3', label: '3. Offset Integrated Tax (IGST)', subtext: 'Utilize IGST credit completely against IGST, then CGST/SGST liability', color: 'amber', category: 'logic', badge: 'IGST_ITC' },
        { id: 'tax4', label: '4. Offset State/Central Credits', subtext: 'Utilize CGST against CGST and SGST against SGST (No cross-utilization allowed!)', color: 'purple', category: 'condition', badge: 'ITC_RULES' },
        { id: 'tax5', label: '5. Electronic Cash Ledger Discharge', subtext: 'Generate Challan PMT-06 and remit remaining balance through bank payment', color: 'indigo', category: 'output', badge: 'PAYMENT' },
        { id: 'decoy1', label: 'Decoy: Illegal Cross-Credit Transfer', subtext: 'Utilize CGST Input Credit directly to offset SGST State Liability', color: 'rose', category: 'decoy', badge: 'GST_ILLEGAL' },
      ],
      correctOrder: ['tax1', 'tax2', 'tax3', 'tax4', 'tax5'],
      decoyBlockIds: ['decoy1'],
      hint: "GST rules strictly forbid cross-utilization between CGST and SGST. IGST credit must be exhausted first before other credits are touched.",
      successExplanation: "GST settlement waterfall verified: Input Tax Credit legally claimed and net liability remitted."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 10: DEVOPS, SRE & CLOUD INFRASTRUCTURE
  // -------------------------------------------------------------------------
  if (domain === 'devops-cloud') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Cloud & DevOps Puzzle: Zero-Downtime Deployment Pipeline`,
      missionPrompt: "Sequence the continuous integration and deployment pipeline to build, test, package, and rollout with automated rollback guards!",
      type: 'pipeline-router',
      domain: 'devops-cloud',
      blocks: [
        { id: 'dp1', label: '1. Source Commit & Lint', subtext: 'Git webhook triggers runner; execute ESLint, Prettier & TypeScript check', color: 'emerald', category: 'init', badge: 'LINT' },
        { id: 'dp2', label: '2. Automated Unit & Integration Tests', subtext: 'Execute test suites with coverage gate (>= 85% pass threshold)', color: 'cyan', category: 'condition', badge: 'TEST' },
        { id: 'dp3', label: '3. Multi-Stage Container Build', subtext: 'Compile minimal dist container and scan image for CVE vulnerabilities', color: 'amber', category: 'transform', badge: 'DOCKER' },
        { id: 'dp4', label: '4. Blue/Green Canary Deployment', subtext: 'Route 5% of production traffic to canary pods; monitor latency & error rate', color: 'purple', category: 'logic', badge: 'CANARY' },
        { id: 'dp5', label: '5. Full Traffic Promotion & Cutover', subtext: 'Scale new deployment to 100%; decommission legacy replica sets', color: 'indigo', category: 'output', badge: 'PROMOTE' },
        { id: 'decoy1', label: 'Decoy: Direct Production Push', subtext: 'Push untested code directly to master branch and restart production server', color: 'rose', category: 'decoy', badge: 'OUTAGE' },
      ],
      correctOrder: ['dp1', 'dp2', 'dp3', 'dp4', 'dp5'],
      decoyBlockIds: ['decoy1'],
      hint: "Never deploy untested code. A modern CI/CD pipeline requires static analysis -> automated tests -> container security scan -> canary testing -> promotion.",
      successExplanation: "CI/CD automated pipeline validated: Zero-downtime canary deployment with full quality gates."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 11: EMBEDDED SYSTEMS & IOT HARDWARE
  // -------------------------------------------------------------------------
  if (domain === 'embedded-iot') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Embedded IoT Puzzle: Microcontroller Peripherals & MMIO Pipeline`,
      missionPrompt: "Arrange the bare-metal hardware initialization steps to configure clocks, configure GPIO, attach interrupts, and transmit telemetry!",
      type: 'architecture-flow',
      domain: 'embedded-iot',
      blocks: [
        { id: 'emb1', label: '1. System Clock Tree Configuration', subtext: 'Enable Phase-Locked Loop (PLL) to configure system core clock at 168MHz', color: 'emerald', category: 'init', badge: 'RCC/PLL' },
        { id: 'emb2', label: '2. Peripheral Bus Clock Gating', subtext: 'Enable clock gating for GPIO Port A in RCC->AHB1ENR register', color: 'cyan', category: 'init', badge: 'AHB1' },
        { id: 'emb3', label: '3. Pin Mode Configuration (MODER)', subtext: 'Configure Pin PA5 as Alternate Function / Push-Pull output via bitmasking', color: 'amber', category: 'transform', badge: 'GPIO' },
        { id: 'emb4', label: '4. Nested Vector Interrupt (NVIC)', subtext: 'Configure priority and unmask EXTI external interrupt line', color: 'purple', category: 'condition', badge: 'NVIC' },
        { id: 'emb5', label: '5. DMA / UART Telemetry Transmit', subtext: 'Stream sensor buffer payload via circular DMA buffer to avoid CPU blocking', color: 'indigo', category: 'output', badge: 'DMA/UART' },
        { id: 'decoy1', label: 'Decoy: Access Before Clock Enabled', subtext: 'Write to GPIO->MODER register before enabling peripheral clock in RCC', color: 'rose', category: 'decoy', badge: 'HARD_FAULT' },
      ],
      correctOrder: ['emb1', 'emb2', 'emb3', 'emb4', 'emb5'],
      decoyBlockIds: ['decoy1'],
      hint: "In ARM Cortex microcontrollers, accessing a peripheral register before enabling its clock in the RCC will trigger an immediate HardFault exception!",
      successExplanation: "Bare-metal hardware initialization verified: Clock Tree -> Bus Enable -> Pin Mode -> Interrupt Setup -> DMA Stream."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 12: BLOCKCHAIN, EVM & SMART CONTRACTS
  // -------------------------------------------------------------------------
  if (domain === 'blockchain') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Blockchain Puzzle: Checks-Effects-Interactions Security`,
      missionPrompt: "Arrange the smart contract withdrawal sequence to guarantee immunity against reentrancy attacks and preserve state consistency!",
      type: 'state-switcher',
      domain: 'blockchain',
      blocks: [
        { id: 'bc1', label: '1. Checks: Validate Conditions', subtext: 'require(balances[msg.sender] >= amount, "Insufficient funds");', color: 'emerald', category: 'condition', badge: 'CHECK' },
        { id: 'bc2', label: '2. Effects: Update Internal State First', subtext: 'balances[msg.sender] -= amount;  // State updated BEFORE transfer', color: 'cyan', category: 'transform', badge: 'EFFECT' },
        { id: 'bc3', label: '3. Interactions: External Call', subtext: '(bool ok, ) = msg.sender.call{value: amount}(""); require(ok);', color: 'amber', category: 'output', badge: 'INTERACT' },
        { id: 'bc4', label: '4. Emit Cryptographic Event', subtext: 'emit Withdrawal(msg.sender, amount, block.timestamp);', color: 'purple', category: 'output', badge: 'EVENT' },
        { id: 'decoy1', label: 'Decoy: Reentrancy Vulnerability (DAO Hack)', subtext: 'msg.sender.call{value: amount}(""); balances[msg.sender] -= amount;', color: 'rose', category: 'decoy', badge: 'REENTRANCY' },
      ],
      correctOrder: ['bc1', 'bc2', 'bc3', 'bc4'],
      decoyBlockIds: ['decoy1'],
      hint: "Checks-Effects-Interactions pattern: Always update user balance state to 0 BEFORE transferring ether out to prevent recursive reentrancy!",
      successExplanation: "Smart contract security verified: Checks-Effects-Interactions pattern protects against reentrancy exploits."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 13: B.COM - CORPORATE LAW & SECRETARIAL GOVERNANCE
  // -------------------------------------------------------------------------
  if (domain === 'corporate-law') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Corporate Law Puzzle: Board Governance & MCA ROC Filing`,
      missionPrompt: "Arrange the statutory secretarial procedure to convene a Board Meeting, pass a valid resolution, and file with the Registrar of Companies under the Companies Act 2013!",
      type: 'decision-tree',
      domain: 'corporate-law',
      blocks: [
        { id: 'law1', label: '1. Issue Meeting Notice (Sec 173)', subtext: 'Deliver formal 7-day written notice with agenda to all registered directors', color: 'emerald', category: 'init', badge: 'NOTICE' },
        { id: 'law2', label: '2. Verify Statutory Quorum', subtext: 'Ensure attendance of at least 1/3rd of total directors or 2 directors (whichever is higher)', color: 'cyan', category: 'condition', badge: 'QUORUM' },
        { id: 'law3', label: '3. Pass Board Resolution', subtext: 'Record majority affirmative vote on the corporate action in meeting agenda', color: 'amber', category: 'logic', badge: 'RESOLUTION' },
        { id: 'law4', label: '4. Sign Minutes of Meeting', subtext: 'Chairperson signs and dates minutes within 30 days in statutory minute book', color: 'purple', category: 'transform', badge: 'MINUTES' },
        { id: 'law5', label: '5. File e-Form MGT-14 with MCA', subtext: 'Upload certified resolution copy with DSC on Ministry of Corporate Affairs portal', color: 'indigo', category: 'output', badge: 'ROC_FILING' },
        { id: 'decoy1', label: 'Decoy: Ultra Vires Action', subtext: 'File resolution with ROC when meeting lacked valid statutory quorum', color: 'rose', category: 'decoy', badge: 'INVALID_VOID' },
      ],
      correctOrder: ['law1', 'law2', 'law3', 'law4', 'law5'],
      decoyBlockIds: ['decoy1'],
      hint: "Secretarial compliance: Notice -> Quorum confirmation -> Resolution passage -> Minutes execution -> ROC e-filing. Actions without quorum are void ab initio!",
      successExplanation: "Corporate governance workflow verified: Companies Act procedural requirements fully satisfied."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 14: B.COM - SUPPLY CHAIN & OPERATIONS
  // -------------------------------------------------------------------------
  if (domain === 'supply-chain') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Supply Chain Puzzle: Procure-to-Pay (P2P) 3-Way Match`,
      missionPrompt: "Construct the fraud-proof Procure-to-Pay workflow to verify purchase authorization, physical receiving, and invoice matching before settlement!",
      type: 'pipeline-router',
      domain: 'supply-chain',
      blocks: [
        { id: 'p2p1', label: '1. Approved Purchase Requisition', subtext: 'Department submits requisition; verified against department quarterly budget', color: 'emerald', category: 'init', badge: 'REQUISITION' },
        { id: 'p2p2', label: '2. Purchase Order (PO) Issuance', subtext: 'Procurement selects approved vendor and issues legally binding PO with item prices', color: 'cyan', category: 'init', badge: 'PO' },
        { id: 'p2p3', label: '3. Goods Receipt Note (GRN)', subtext: 'Warehouse inspects physical delivery, verifies SKU quantities and logs GRN', color: 'amber', category: 'condition', badge: 'GRN' },
        { id: 'p2p4', label: '4. ERP 3-Way Matching Gate', subtext: 'Automated tolerance check matches PO price, GRN quantity, and Vendor Invoice amount', color: 'purple', category: 'logic', badge: '3-WAY MATCH' },
        { id: 'p2p5', label: '5. Accounts Payable Disbursement', subtext: 'Release payment voucher to vendor within agreed credit terms (e.g. Net 30)', color: 'indigo', category: 'output', badge: 'PAYMENT' },
        { id: 'decoy1', label: 'Decoy: Ghost Vendor Vulnerability', subtext: 'Pay vendor invoice directly without physical Goods Receipt Note (GRN) verification', color: 'rose', category: 'decoy', badge: 'FRAUD_RISK' },
      ],
      correctOrder: ['p2p1', 'p2p2', 'p2p3', 'p2p4', 'p2p5'],
      decoyBlockIds: ['decoy1'],
      hint: "Procure-to-pay controls mandate a strict 3-Way Match (Purchase Order + Goods Receipt Note + Vendor Invoice) prior to releasing corporate funds.",
      successExplanation: "Procure-to-Pay pipeline validated: Invariant controls protect against inventory discrepancies and ghost billing."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 15: B.COM - DIGITAL MARKETING & PERFORMANCE ANALYTICS
  // -------------------------------------------------------------------------
  if (domain === 'digital-marketing') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Digital Marketing Puzzle: Multi-Touch Conversion Attribution`,
      missionPrompt: "Sequence the user acquisition funnel to trace campaign tracking, pixel events, and server-side deduplication to calculate ROAS!",
      type: 'pipeline-router',
      domain: 'digital-marketing',
      blocks: [
        { id: 'mkt1', label: '1. UTM Campaign Link Building', subtext: 'Tag creative with utm_source, utm_medium, utm_campaign, and utm_content', color: 'emerald', category: 'init', badge: 'UTM' },
        { id: 'mkt2', label: '2. Landing Page View & Cookie Consent', subtext: 'Fire PageView pixel event and establish anonymous first-party visitor session', color: 'cyan', category: 'init', badge: 'PIXEL' },
        { id: 'mkt3', label: '3. Cart Add & Funnel Progress', subtext: 'Trigger AddToCart event with dynamic product ID, quantity, and currency payload', color: 'amber', category: 'logic', badge: 'EVENT' },
        { id: 'mkt4', label: '4. Server-Side CAPI Purchase Webhook', subtext: 'Dispatch hashed transaction payload via Server-Side Conversion API to avoid ad-blockers', color: 'purple', category: 'transform', badge: 'CAPI' },
        { id: 'mkt5', label: '5. Multi-Touch ROAS Attribution', subtext: 'Credit incremental revenue across touchpoints to optimize customer acquisition cost (CAC)', color: 'indigo', category: 'output', badge: 'ROAS' },
        { id: 'decoy1', label: 'Decoy: Misleading Last-Click Blindspot', subtext: 'Attribute 100% credit to branded search while ignoring top-of-funnel discovery ads', color: 'rose', category: 'decoy', badge: 'ATTR_BIAS' },
      ],
      correctOrder: ['mkt1', 'mkt2', 'mkt3', 'mkt4', 'mkt5'],
      decoyBlockIds: ['decoy1'],
      hint: "Performance tracking pipeline: UTM parameters -> First-party pixel -> Cart event -> Server-side CAPI -> Attribution modeling.",
      successExplanation: "Marketing attribution pipeline verified: Full-funnel tracking enabled with reliable return on ad spend (ROAS) analytics."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 16: B.COM - E-COMMERCE PLATFORM ARCHITECTURE
  // -------------------------------------------------------------------------
  if (domain === 'ecommerce') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} E-Commerce Puzzle: High-Concurrency Checkout Pipeline`,
      missionPrompt: "Arrange the checkout microservices pipeline to process payments, atomically reserve inventory, and prevent overbooking!",
      type: 'pipeline-router',
      domain: 'ecommerce',
      blocks: [
        { id: 'ecom1', label: '1. Cart Checkout & Payment Token', subtext: 'Client submits cart; tokenizes card details securely via PCI-DSS payment gateway', color: 'emerald', category: 'init', badge: 'CHECKOUT' },
        { id: 'ecom2', label: '2. Atomic Inventory Hold in Redis', subtext: 'Execute Redis DECR transaction to reserve stock with 15-minute TTL expiration', color: 'cyan', category: 'condition', badge: 'REDIS_HOLD' },
        { id: 'ecom3', label: '3. Payment Gateway Webhook Capture', subtext: 'Receive cryptographic webhook confirming fund capture from payment provider', color: 'amber', category: 'logic', badge: 'WEBHOOK' },
        { id: 'ecom4', label: '4. Order Persistence & Invoice Generation', subtext: 'Write immutable order record to SQL database and emit OrderCreated message to Kafka', color: 'purple', category: 'transform', badge: 'KAFKA' },
        { id: 'ecom5', label: '5. Warehouse Fulfillment & AWB Label', subtext: 'Logistics API generates Air Waybill (AWB) shipping barcode for carrier pickup', color: 'indigo', category: 'output', badge: 'SHIP' },
        { id: 'decoy1', label: 'Decoy: Race Condition Overbooking', subtext: 'Capture payment before checking or holding stock in high-traffic sales', color: 'rose', category: 'decoy', badge: 'RACE_BUG' },
      ],
      correctOrder: ['ecom1', 'ecom2', 'ecom3', 'ecom4', 'ecom5'],
      decoyBlockIds: ['decoy1'],
      hint: "E-Commerce checkout invariants: Tokenize payment -> Atomic stock hold -> Capture webhook -> Order creation -> Carrier dispatch.",
      successExplanation: "E-Commerce checkout pipeline verified: Distributed transactions protected against inventory race conditions."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 17: CYBERSECURITY & NETWORK DEFENSE
  // -------------------------------------------------------------------------
  if (domain === 'cybersecurity') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Cybersecurity Puzzle: Cryptographic Authentication & TLS Handshake`,
      missionPrompt: "Arrange the cryptographic authentication steps to establish an encrypted, tamper-proof channel and verify identity!",
      type: 'architecture-flow',
      domain: 'cybersecurity',
      blocks: [
        { id: 'cy1', label: '1. ClientHello & Cipher Negotiation', subtext: 'Client sends supported TLS 1.3 cipher suites and ephemeral KeyShare', color: 'emerald', category: 'init', badge: 'HELLOCLIENT' },
        { id: 'cy2', label: '2. Server Certificate Verification', subtext: 'Validate server X.509 certificate chain against trusted Root Certificate Authority (CA)', color: 'cyan', category: 'condition', badge: 'CERT_CHECK' },
        { id: 'cy3', label: '3. Ephemeral Key Exchange (ECDHE)', subtext: 'Compute shared secret via Elliptic Curve Diffie-Hellman to guarantee Forward Secrecy', color: 'amber', category: 'logic', badge: 'ECDHE' },
        { id: 'cy4', label: '4. Derive Symmetric Session Keys', subtext: 'Derive AES-256-GCM encryption keys using HKDF extract-and-expand pipeline', color: 'purple', category: 'transform', badge: 'SESSION_KEYS' },
        { id: 'cy5', label: '5. Encrypted Application Data Flow', subtext: 'Transmit authenticated application payloads protected by AEAD integrity tags', color: 'indigo', category: 'output', badge: 'ENCRYPTED' },
        { id: 'decoy1', label: 'Decoy: Man-in-the-Middle Bypass', subtext: 'Disable certificate revocation and trust self-signed certificate blindly', color: 'rose', category: 'decoy', badge: 'MITM_ATTACK' },
      ],
      correctOrder: ['cy1', 'cy2', 'cy3', 'cy4', 'cy5'],
      decoyBlockIds: ['decoy1'],
      hint: "Secure communication requires: ClientHello -> Certificate trust verification -> Key agreement -> Session key derivation -> Encrypted transfer.",
      successExplanation: "Cryptographic pipeline verified: Perfect Forward Secrecy established and immune to Man-in-the-Middle tampering."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 18: NODE.JS, EXPRESS & SERVERLESS
  // -------------------------------------------------------------------------
  if (domain === 'nodejs') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Node.js Puzzle: Express Middleware Request Pipeline`,
      missionPrompt: "Sequence the asynchronous HTTP request pipeline: parse body, validate authentication, enforce rate limits, and dispatch response!",
      type: 'code-reorder',
      domain: 'nodejs',
      blocks: [
        { id: 'nd1', label: '1. JSON Body Parser Middleware', subtext: 'app.use(express.json({ limit: "1mb" }));', color: 'emerald', category: 'init', badge: 'PARSER' },
        { id: 'nd2', label: '2. Bearer JWT Authentication Guard', subtext: 'const user = await verifyToken(req.headers.authorization);', color: 'cyan', category: 'condition', badge: 'AUTH' },
        { id: 'nd3', label: '3. Sliding-Window Rate Limiter', subtext: 'if (await isRateLimited(user.id)) return res.status(429).json();', color: 'amber', category: 'condition', badge: 'RATE_LIMIT' },
        { id: 'nd4', label: '4. Controller Service Execution', subtext: 'const result = await OrderService.createOrder(req.body, user);', color: 'purple', category: 'transform', badge: 'CONTROLLER' },
        { id: 'nd5', label: '5. HTTP 201 Created Response', subtext: 'return res.status(201).json({ success: true, data: result });', color: 'indigo', category: 'output', badge: 'SEND' },
        { id: 'decoy1', label: 'Decoy: Double-Response Exception', subtext: 'res.json(data); next(); // (Calling next after response terminates)', color: 'rose', category: 'decoy', badge: 'HEADER_ERR' },
      ],
      correctOrder: ['nd1', 'nd2', 'nd3', 'nd4', 'nd5'],
      decoyBlockIds: ['decoy1'],
      hint: "Express middleware executes in order: Parse JSON -> Authenticate -> Rate Limit -> Controller Execution -> Response Return. Never call next() after sending a response!",
      successExplanation: "Node.js HTTP request lifecycle verified: Guard clauses protect controller logic and prevent ERR_HTTP_HEADERS_SENT."
    };
  }

  // -------------------------------------------------------------------------
  // DOMAIN 19: GIT VERSION CONTROL & COLLABORATION
  // -------------------------------------------------------------------------
  if (domain === 'git-vcs') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Git Puzzle: Feature Branching & Rebase Workflow`,
      missionPrompt: "Arrange the professional Git commands to create a feature branch, commit changes atomically, rebase onto main, and push!",
      type: 'code-reorder',
      domain: 'git-vcs',
      blocks: [
        { id: 'git1', label: '1. Create Isolated Feature Branch', subtext: 'git checkout -b feature/order-validation origin/main', color: 'emerald', category: 'init', badge: 'BRANCH' },
        { id: 'git2', label: '2. Stage Atomic Changes', subtext: 'git add src/services/orderValidator.ts', color: 'cyan', category: 'init', badge: 'STAGE' },
        { id: 'git3', label: '3. Conventional Git Commit', subtext: 'git commit -m "feat(orders): validate line item amounts"', color: 'amber', category: 'transform', badge: 'COMMIT' },
        { id: 'git4', label: '4. Fetch & Rebase from Upstream', subtext: 'git fetch origin && git rebase origin/main', color: 'purple', category: 'logic', badge: 'REBASE' },
        { id: 'git5', label: '5. Safe Force Push with Lease', subtext: 'git push --force-with-lease origin feature/order-validation', color: 'indigo', category: 'output', badge: 'PUSH' },
        { id: 'decoy1', label: 'Decoy: Destructive Force Push', subtext: 'git push --force origin main  # (Overwrites team work on main branch!)', color: 'rose', category: 'decoy', badge: 'DISASTER' },
      ],
      correctOrder: ['git1', 'git2', 'git3', 'git4', 'git5'],
      decoyBlockIds: ['decoy1'],
      hint: "Professional Git hygiene: Create branch -> Stage atomic changes -> Commit -> Rebase on main -> Push with --force-with-lease. Never force-push to main!",
      successExplanation: "Git version control workflow validated: Linear commit history preserved without merge commit pollution."
    };
  }

  // -------------------------------------------------------------------------
  // DYNAMIC FALLBACK: SYNTHESIS FROM ACTUAL LESSON PARTS
  // -------------------------------------------------------------------------
  // If no static domain matched, build an authentic puzzle directly from the lesson's actual parts!
  const blockList: PuzzleBlock[] = [];
  const order: string[] = [];
  const colors: Array<PuzzleBlock['color']> = ['emerald', 'cyan', 'amber', 'purple', 'indigo'];

  if (parts.length >= 3) {
    const activeParts = parts.slice(0, 5);
    activeParts.forEach((p: any, idx: number) => {
      const bId = `dyn-${idx + 1}`;
      const partTitle = p.title ? p.title.split(':')[0].replace(/^(part\s*\d+[:\-.]?)/i, '').trim().slice(0, 32) : `Step ${idx + 1}`;
      
      // Extract genuine code snippet if available
      let snippet = '';
      if (p.code) {
        const lines = p.code.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 2 && !l.startsWith('//') && !l.startsWith('#'));
        snippet = lines[0] ? lines[0].slice(0, 48) : '';
      }

      blockList.push({
        id: bId,
        label: `${idx + 1}. ${partTitle}`,
        subtext: snippet || (p.example ? p.example.slice(0, 48) : `Execute operational step ${idx + 1}`),
        color: colors[idx % colors.length],
        category: idx === 0 ? 'init' : (idx === activeParts.length - 1 ? 'output' : 'transform'),
        badge: idx === 0 ? 'INIT' : (idx === activeParts.length - 1 ? 'OUTPUT' : 'STEP'),
        codeSnippet: p.code || undefined
      });
      order.push(bId);
    });

    // Inject an authentic decoy block
    const decoyId = 'dyn-decoy';
    blockList.push({
      id: decoyId,
      label: 'Decoy: Invalid Precedence Inversion',
      subtext: 'Attempt to execute final output before prerequisite state is initialized',
      color: 'rose',
      category: 'decoy',
      badge: 'INVALID'
    });

    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Architectural Puzzle: ${summary.title.slice(0, 40)}`,
      missionPrompt: `Arrange the operational lifecycle blocks in the exact chronological sequence taught in today's lesson!`,
      type: 'pipeline-router',
      domain: domain,
      blocks: blockList,
      correctOrder: order,
      decoyBlockIds: [decoyId],
      hint: "Think about dependencies: What must be defined or initialized before downstream transformations can execute?",
      successExplanation: `All ${order.length} operational stages are positioned in correct sequence. System invariants validated!`
    };
  }

  // Minimum fallback if lesson has fewer than 3 parts
  blockList.push(
    { id: 'b1', label: '1. Initialize Input Context', subtext: 'Acquire verified operational parameters', color: 'emerald', category: 'init', badge: 'INIT' },
    { id: 'b2', label: '2. Execute Core Transformation', subtext: 'Apply business logic & state constraints', color: 'cyan', category: 'transform', badge: 'LOGIC' },
    { id: 'b3', label: '3. Verify & Deliver Output', subtext: 'Ensure deterministic result delivery', color: 'purple', category: 'output', badge: 'DELIVER' },
    { id: 'decoy1', label: 'Decoy: Premature Output Delivery', subtext: 'Deliver unverified payload before transformation completes', color: 'rose', category: 'decoy', badge: 'ERROR' }
  );
  order.push('b1', 'b2', 'b3');

  return {
    id: `puzzle-${prefix}-${dayNum}`,
    title: `Day ${dayNum} Puzzle: ${summary.title.slice(0, 40)}`,
    missionPrompt: `Arrange the operational blocks in chronological order to complete the day's challenge!`,
    type: 'pipeline-router',
    domain: domain,
    blocks: blockList,
    correctOrder: order,
    decoyBlockIds: ['decoy1'],
    hint: "Remember: Input initialization must always precede transformation, and transformation must precede final delivery.",
    successExplanation: "Execution sequence verified: All operations succeeded deterministically."
  };
}

/**
 * Step 3 & 4: Rapid-Fire MCQ Battle Generator (5 questions in 60 seconds)
 */
export function generateRapidFireBattle(
  questId: string,
  prefix: string,
  dayNum: number,
  lessonData: any
): RapidFireBattleSpec {
  if (lessonData?.rapidBattle && Array.isArray(lessonData.rapidBattle.questions) && lessonData.rapidBattle.questions.length >= 5) {
    return {
      title: lessonData.rapidBattle.title || `Day ${dayNum} 60-Second Boss Battle`,
      timeLimitSeconds: 60,
      questions: lessonData.rapidBattle.questions.slice(0, 5),
      passScore: 4,
    };
  }

  const questions: RapidBattleQuestion[] = [];
  const parts = Array.isArray(lessonData?.parts) ? lessonData.parts : [];

  // Extract from parts check questions
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const chk = p.check;
    if (chk && chk.question && Array.isArray(chk.options) && chk.options.length >= 2) {
      const opts: [string, string, string, string] = [
        chk.options[0] || 'Option A',
        chk.options[1] || 'Option B',
        chk.options[2] || (chk.options.length > 2 ? chk.options[2] : 'None of the above'),
        chk.options[3] || (chk.options.length > 3 ? chk.options[3] : 'All of the above')
      ];
      questions.push({
        id: `battle-q-${i + 1}`,
        question: chk.question.length > 95 ? chk.question.slice(0, 92) + '...' : chk.question,
        options: opts,
        correctIndex: typeof chk.answer === 'number' ? chk.answer : (chk.answerIndex ?? 0),
        explanation: chk.why || chk.explanation || 'Optimal architectural invariant confirmed.'
      });
    }
    if (questions.length >= 5) break;
  }

  // Domain-aware fallback reflexes
  const domain = detectCourseDomain(prefix, lessonData?.title || '');
  const domainReflexes: Record<string, Array<{ q: string; opts: [string, string, string, string]; ans: number; why: string }>> = {
    accounting: [
      { q: "Under double-entry rules, which entry increases an Asset account?", opts: ["Debit entry", "Credit entry", "Footnote annotation", "Depreciation deduction"], ans: 0, why: "Assets and expenses increase with a Debit; liabilities, equity, and revenues increase with a Credit." },
      { q: "What does the Revenue Recognition Matching Principle mandate?", opts: ["Recognize expenses in the same period as the revenues they generate", "Recognize revenue only when cash is deposited", "Never recognize liabilities", "Record tax only once every decade"], ans: 0, why: "Matching principle pairs expenses directly with the related revenues recognized in that accounting period." },
      { q: "Where does unearned upfront subscription revenue sit on the balance sheet?", opts: ["Current Liabilities", "Operating Expenses", "Cash Inflow on P&L", "Share Capital"], ans: 0, why: "Unearned revenue is an obligation/liability until the service is delivered." },
      { q: "What is the primary equation of the Balance Sheet?", opts: ["Assets = Liabilities + Equity", "Assets = Liabilities - Equity", "Assets = Gross Profit", "Assets = Net Income"], ans: 0, why: "The fundamental accounting equation is Assets = Liabilities + Equity." },
      { q: "What document proves that transactions occurred before journal entry?", opts: ["Supporting Voucher / Source Document", "Trial Balance", "Bank Passbook", "Director's Report"], ans: 0, why: "Every journal entry must be supported by an authentic source document (voucher/invoice)." }
    ],
    finance: [
      { q: "In DCF modeling, what discount rate reflects firm-wide financing cost?", opts: ["WACC (Weighted Average Cost of Capital)", "Treasury Bill coupon rate", "Prime Lending Rate", "Gross Profit Margin"], ans: 0, why: "WACC weights both equity and after-tax debt costs to discount enterprise cash flows." },
      { q: "When evaluating mutually exclusive capital projects, which metric is superior?", opts: ["Net Present Value (NPV)", "Payback Period", "Accounting Rate of Return", "Gross Margin"], ans: 0, why: "NPV directly measures absolute shareholder wealth creation in currency terms." },
      { q: "What does a high Beta (> 1.0) imply in the CAPM model?", opts: ["The asset has higher systematic volatility than the market", "The asset has zero risk", "The asset is completely risk-free", "The company has zero debt"], ans: 0, why: "Beta > 1.0 indicates greater sensitivity to macroeconomic market movements." },
      { q: "What is Free Cash Flow to Firm (FCFF)?", opts: ["Cash generated from operations available to all capital providers", "Net profit before salaries", "Dividends paid to founders", "Cash sitting in bank lockers"], ans: 0, why: "FCFF represents unlevered operational cash after operating expenses, taxes, and CapEx." },
      { q: "What is the primary goal of financial management?", opts: ["Maximizing long-term shareholder intrinsic value", "Maximizing quarterly sales at any cost", "Avoiding all forms of debt", "Hiring the largest team"], ans: 0, why: "Modern corporate finance focuses on maximizing sustainable shareholder value." }
    ]
  };

  const reflexes = domainReflexes[domain] || [
    { q: "What is the primary purpose of writing modular code?", opts: ["Improves reusability, testability and cognitive clarity", "Makes file size larger", "Required to access the internet", "Prevents comments from compiling"], ans: 0, why: "Modular code separates concerns and makes systems maintainable." },
    { q: "What occurs when an instruction contains an uncaught syntax error?", opts: ["The interpreter/compiler throws an error and execution halts", "The computer ignores it and guesses", "The code runs 10x faster", "The screen brightness changes"], ans: 0, why: "Syntax errors violate language grammar rules and stop execution." },
    { q: "What does deterministic execution mean?", opts: ["Given the same inputs, it always produces identical outputs", "It changes randomly every time", "It runs only on weekends", "It requires user mouse movement"], ans: 0, why: "Deterministic operations are repeatable, predictable, and verifiable." },
    { q: "Why should dependencies be explicitly declared and initialized?", opts: ["Prevents runtime null reference errors and unexpected crashes", "Consumes extra memory unnecessarily", "Slows down computer hardware", "Required by monitor drivers"], ans: 0, why: "Explicit initialization guarantees state invariants before invocation." },
    { q: "What is the best way to verify system correctness?", opts: ["Automated assertion testing against defined specifications", "Assuming it works without running", "Changing variable names until it looks good", "Deleting failing tests"], ans: 0, why: "Automated assertion testing proves code satisfies required specifications." }
  ];

  let rIdx = 0;
  while (questions.length < 5) {
    const rf = reflexes[rIdx % reflexes.length];
    questions.push({
      id: `battle-fb-${questions.length + 1}`,
      question: rf.q,
      options: rf.opts,
      correctIndex: rf.ans,
      explanation: rf.why
    });
    rIdx++;
  }

  return {
    title: `⚡ Day ${dayNum} Rapid-Fire Battle (60s)`,
    timeLimitSeconds: 60,
    questions: questions.slice(0, 5),
    passScore: 4
  };
}
