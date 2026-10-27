/**
 * PinIT Career OS - Interactive 2.5D/3D Lesson Puzzle & Rapid-Fire Battle Engine
 * 
 * Standard:
 * 1. Exactly 1 synthesis puzzle per lesson (appearing after all concepts are completed).
 * 2. Exactly 5 rapid-fire MCQ questions to be answered within 60 seconds total.
 */

export interface PuzzleBlock {
  id: string;
  label: string;
  subtext?: string;
  color: 'emerald' | 'cyan' | 'amber' | 'purple' | 'rose' | 'indigo' | 'blue';
  category?: 'init' | 'logic' | 'condition' | 'transform' | 'output' | 'decoy';
  codeSnippet?: string;
}

export interface LessonPuzzleSpec {
  id: string;
  title: string;
  missionPrompt: string;
  type: 'code-reorder' | 'pipeline-router' | 'state-switcher' | 'memory-box';
  blocks: PuzzleBlock[];
  correctOrder: string[]; // Ordered array of block IDs
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
  passScore: number; // Minimum correct to pass (e.g. 4)
}

/**
 * Step 1: Understand what the lesson is.
 * Analyzes the lesson data, title, parts, code snippets, and check questions.
 */
export function extractLessonConceptSummary(lessonData: any): {
  domain: string;
  title: string;
  concepts: string[];
  codeSnippets: string[];
  keyTerms: string[];
} {
  const title = lessonData?.title || 'Daily Concept Mastery';
  const parts = Array.isArray(lessonData?.parts) ? lessonData.parts : [];
  
  const concepts: string[] = [];
  const codeSnippets: string[] = [];
  const keyTerms: string[] = [];

  for (const p of parts) {
    if (p.title) concepts.push(p.title);
    if (p.code) codeSnippets.push(p.code);
    if (p.check?.question) keyTerms.push(p.check.question);
  }

  // Detect domain (Domain specifics checked prior to general code tokens)
  const rawText = `${title} ${concepts.join(' ')} ${codeSnippets.join(' ')}`.toLowerCase();
  let domain = 'general';
  if (rawText.includes('accounting') || rawText.includes('debit') || rawText.includes('credit') || rawText.includes('ledger') || rawText.includes('tally')) domain = 'accounting';
  else if (rawText.includes('finance') || rawText.includes('dcf') || rawText.includes('npv') || rawText.includes('capital market') || rawText.includes('portfolio')) domain = 'finance';
  else if (rawText.includes('react') || rawText.includes('jsx') || rawText.includes('usestate') || rawText.includes('useeffect')) domain = 'react';
  else if (rawText.includes('java') || rawText.includes('public class') || rawText.includes('system.out')) domain = 'java';
  else if (rawText.includes('sql') || rawText.includes('select ') || rawText.includes('where ') || rawText.includes('table')) domain = 'sql';
  else if (rawText.includes('python') || rawText.includes('def ') || rawText.includes('print(')) domain = 'python';
  else if (rawText.includes('docker') || rawText.includes('k8s') || rawText.includes('ci/cd') || rawText.includes('pipeline')) domain = 'devops';

  return { domain, title, concepts, codeSnippets, keyTerms };
}

/**
 * Step 2: Generate a 2.5D Puzzle perfect as per all concepts of the lesson.
 */
export function generateLessonPuzzle(
  questId: string,
  prefix: string,
  dayNum: number,
  lessonData: any
): LessonPuzzleSpec {
  // If explicitly authored in lesson data, use it!
  if (lessonData?.puzzle && Array.isArray(lessonData.puzzle.blocks) && Array.isArray(lessonData.puzzle.correctOrder)) {
    return lessonData.puzzle;
  }

  const summary = extractLessonConceptSummary(lessonData);
  const parts = Array.isArray(lessonData?.parts) ? lessonData.parts : [];

  // Domain-specific tailored synthesis
  if (summary.domain === 'python' || prefix.includes('python')) {
    if (dayNum === 1) {
      return {
        id: `puzzle-${prefix}-${dayNum}`,
        title: "Day 1 Tactile Puzzle: The Execution Pipeline",
        missionPrompt: "Arrange the Python instruction blocks in the correct chronological execution order so the script creates the variable and outputs the greeting!",
        type: 'code-reorder',
        blocks: [
          { id: 'b1', label: '# 1. System Setup', subtext: 'app_name = "ExpenseTracker"', color: 'emerald', category: 'init', codeSnippet: 'app_name = "ExpenseTracker"' },
          { id: 'b2', label: '# 2. User Message', subtext: 'greeting = "Welcome to " + app_name', color: 'cyan', category: 'transform', codeSnippet: 'greeting = "Welcome to " + app_name' },
          { id: 'b3', label: '# 3. Screen Output', subtext: 'print(greeting)', color: 'purple', category: 'output', codeSnippet: 'print(greeting)' },
          { id: 'decoy1', label: '# Syntax Error Block', subtext: 'print(undefined_variable)', color: 'rose', category: 'decoy', codeSnippet: 'print(undefined_variable)' },
        ],
        correctOrder: ['b1', 'b2', 'b3'],
        decoyBlockIds: ['decoy1'],
        hint: "Python reads line-by-line from top to bottom. You must define a variable before you can print it!",
        successExplanation: "Chronological pipeline verified: `app_name` is initialized, transformed into `greeting`, and cleanly output via `print()`."
      };
    }
    if (dayNum <= 5) {
      return {
        id: `puzzle-${prefix}-${dayNum}`,
        title: `Day ${dayNum} Puzzle: Logic & Variable Flow`,
        missionPrompt: "Reorder the blocks so the calculation computes total price with tax and verifies the discount condition!",
        type: 'code-reorder',
        blocks: [
          { id: 'b1', label: '1. Base Price', subtext: 'base_price = 100.0', color: 'emerald', category: 'init' },
          { id: 'b2', label: '2. Tax Rate', subtext: 'tax = base_price * 0.18', color: 'cyan', category: 'transform' },
          { id: 'b3', label: '3. Final Total', subtext: 'total = base_price + tax', color: 'purple', category: 'output' },
          { id: 'b4', label: '4. Print Output', subtext: 'print(f"Total: {total}")', color: 'indigo', category: 'output' },
        ],
        correctOrder: ['b1', 'b2', 'b3', 'b4'],
        hint: "Compute base values first, then calculate dependent multipliers, and finally display.",
        successExplanation: "Mathematical precedence verified: tax depends on base price, total depends on tax, and print outputs the result."
      };
    }
  }

  if (summary.domain === 'react' || prefix.includes('react')) {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Puzzle: React Component Lifecycle & Data Flow`,
      missionPrompt: "Arrange the React component blocks into a valid declarative rendering sequence!",
      type: 'code-reorder',
      blocks: [
        { id: 'r1', label: '1. Import Hooks', subtext: 'import { useState, useEffect } from "react";', color: 'cyan', category: 'init' },
        { id: 'r2', label: '2. Declare Component', subtext: 'export default function UserCard({ name }) {', color: 'emerald', category: 'init' },
        { id: 'r3', label: '3. State Initialization', subtext: 'const [likes, setLikes] = useState(0);', color: 'amber', category: 'logic' },
        { id: 'r4', label: '4. JSX Output', subtext: 'return <button onClick={() => setLikes(l => l + 1)}>{name}: {likes}</button>;', color: 'purple', category: 'output' },
        { id: 'decoy1', label: 'Invalid Hook Placement', subtext: 'if (name) { useState(0); }', color: 'rose', category: 'decoy' }
      ],
      correctOrder: ['r1', 'r2', 'r3', 'r4'],
      decoyBlockIds: ['decoy1'],
      hint: "Remember the Rules of Hooks: Imports first, Component definition, State at the top level, then return JSX.",
      successExplanation: "Component architecture verified: clean top-level Hook declaration and declarative event binding."
    };
  }

  if (summary.domain === 'accounting' || prefix.includes('accounting') || prefix.includes('bcom')) {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Double-Entry Ledger Puzzle: Accrual Accounting Flow`,
      missionPrompt: "Arrange the double-entry accounting transactions in the exact order required by GAAP to balance the fundamental accounting equation!",
      type: 'code-reorder',
      blocks: [
        { id: 'acc1', label: '1. Invoice Generation', subtext: 'Debit: Accounts Receivable $120,000', color: 'emerald', category: 'init' },
        { id: 'acc2', label: '2. Liability Booking', subtext: 'Credit: Deferred Revenue $120,000', color: 'cyan', category: 'init' },
        { id: 'acc3', label: '3. Performance Delivery', subtext: 'Debit: Deferred Revenue $10,000', color: 'amber', category: 'transform' },
        { id: 'acc4', label: '4. Revenue Realization', subtext: 'Credit: Subscription Revenue $10,000', color: 'purple', category: 'output' },
        { id: 'decoy1', label: 'GAAP Violation (Cash Basis)', subtext: 'Credit: Immediate Revenue $120,000', color: 'rose', category: 'decoy' },
      ],
      correctOrder: ['acc1', 'acc2', 'acc3', 'acc4'],
      decoyBlockIds: ['decoy1'],
      hint: "Under GAAP accrual rules, unearned upfront payments must sit in Deferred Revenue as a liability until service is delivered month-by-month.",
      successExplanation: "Accrual accounting verified: Matching Principle satisfied and Assets equal Liabilities plus Equity."
    };
  }

  if (summary.domain === 'sql' || prefix.includes('sql')) {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Puzzle: SQL Query Execution Order`,
      missionPrompt: "Arrange the SQL clauses in the syntactic order required by the database query parser!",
      type: 'code-reorder',
      blocks: [
        { id: 's1', label: 'SELECT Clause', subtext: 'SELECT customer_id, SUM(order_amount)', color: 'emerald', category: 'init' },
        { id: 's2', label: 'FROM Clause', subtext: 'FROM orders', color: 'cyan', category: 'init' },
        { id: 's3', label: 'WHERE Clause', subtext: 'WHERE status = "COMPLETED"', color: 'amber', category: 'condition' },
        { id: 's4', label: 'GROUP BY Clause', subtext: 'GROUP BY customer_id', color: 'purple', category: 'transform' },
        { id: 's5', label: 'HAVING Clause', subtext: 'HAVING SUM(order_amount) > 1000', color: 'indigo', category: 'condition' },
      ],
      correctOrder: ['s1', 's2', 's3', 's4', 's5'],
      hint: "Remember: SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY.",
      successExplanation: "Relational query order verified: projection, source relation, row filter, aggregation grouping, and group filter."
    };
  }

  // Fallback synthesis based on parts
  const blockList: PuzzleBlock[] = [];
  const order: string[] = [];
  const colors: Array<PuzzleBlock['color']> = ['emerald', 'cyan', 'amber', 'purple', 'indigo', 'blue'];

  if (parts.length >= 3) {
    parts.slice(0, 5).forEach((p: any, idx: number) => {
      const bId = `blk-${idx + 1}`;
      blockList.push({
        id: bId,
        label: `Step ${idx + 1}: ${p.title.split(':')[0].slice(0, 28)}`,
        subtext: p.code ? p.code.split('\n')[0].slice(0, 40) : `Execute ${p.title.slice(0, 30)}`,
        color: colors[idx % colors.length],
        category: idx === 0 ? 'init' : (idx === parts.length - 1 ? 'output' : 'logic'),
        codeSnippet: p.code || undefined
      });
      order.push(bId);
    });
  } else {
    // 3 standard synthesis blocks
    blockList.push(
      { id: 'b1', label: '1. Ingest & Initialize Input', subtext: 'Acquire verified input context', color: 'emerald', category: 'init' },
      { id: 'b2', label: '2. Core Transformation Logic', subtext: 'Apply business & state rules', color: 'cyan', category: 'transform' },
      { id: 'b3', label: '3. Verify & Deliver Output', subtext: 'Ensure deterministic result', color: 'purple', category: 'output' }
    );
    order.push('b1', 'b2', 'b3');
  }

  return {
    id: `puzzle-${prefix}-${dayNum}`,
    title: `Day ${dayNum} Architectural Puzzle: ${summary.title.slice(0, 35)}`,
    missionPrompt: `Arrange the architectural lifecycle blocks in the exact sequence taught in today's lesson to complete the day's challenge!`,
    type: 'code-reorder',
    blocks: blockList,
    correctOrder: order,
    hint: "Think about dependencies: What must be defined or initialized before the next operation can run?",
    successExplanation: `All ${order.length} operational stages are positioned in correct sequence. System invariants validated!`
  };
}

/**
 * Step 3 & 4: Simple code, concept check & Rapid-Fire MCQ Battle Generator.
 * Exactly 5 questions to be answered within 60 seconds total.
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
        chk.options[0] || 'A',
        chk.options[1] || 'B',
        chk.options[2] || 'C',
        chk.options[3] || 'D'
      ];
      questions.push({
        id: `battle-q-${i + 1}`,
        question: chk.question.length > 90 ? chk.question.slice(0, 87) + '...' : chk.question,
        options: opts,
        correctIndex: typeof chk.answer === 'number' ? chk.answer : (chk.answerIndex ?? 0),
        explanation: chk.why || chk.explanation || 'Optimal architectural invariant confirmed.'
      });
    }
    if (questions.length >= 5) break;
  }

  // Backfill if fewer than 5
  const fallbackReflexes = [
    {
      q: "What is the primary role of a variable in code?",
      opts: ["Store a named value in memory", "Print text to physical paper", "Speed up internet connection", "Delete files automatically"] as [string, string, string, string],
      ans: 0,
      why: "A variable is a labeled memory slot that stores data for later reuse."
    },
    {
      q: "Which outcome occurs when an instruction has a syntax error?",
      opts: ["The interpreter/compiler throws an error and halts", "The computer ignores it and guesses", "The code runs 10x faster", "The monitor turns off"] as [string, string, string, string],
      ans: 0,
      why: "Syntax errors violate language grammar rules and stop execution."
    },
    {
      q: "Why should code be decomposed into modular functions or components?",
      opts: ["Improves reusability, testing and readability", "Makes file size larger", "Required to open a browser", "Prevents comments from compiling"] as [string, string, string, string],
      ans: 0,
      why: "Modular code separates concerns and makes systems maintainable."
    },
    {
      q: "What does deterministic execution mean?",
      opts: ["Given the same inputs, it always produces the same outputs", "It changes randomly every time", "It runs only on Sundays", "It requires user mouse movement"] as [string, string, string, string],
      ans: 0,
      why: "Deterministic operations are repeatable, predictable, and verifiable."
    },
    {
      q: "What is the best way to verify code correctness?",
      opts: ["Run deterministic test assertions against expected output", "Assume it works without running", "Change variable names until it looks good", "Delete failing checks"] as [string, string, string, string],
      ans: 0,
      why: "Automated assertion testing proves code satisfies required specifications."
    }
  ];

  let fbIdx = 0;
  while (questions.length < 5) {
    const fb = fallbackReflexes[fbIdx % fallbackReflexes.length];
    questions.push({
      id: `battle-fb-${questions.length + 1}`,
      question: fb.q,
      options: fb.opts,
      correctIndex: fb.ans,
      explanation: fb.why
    });
    fbIdx++;
  }

  return {
    title: `⚡ Day ${dayNum} Rapid-Fire Battle (60s)`,
    timeLimitSeconds: 60,
    questions: questions.slice(0, 5),
    passScore: 4
  };
}
