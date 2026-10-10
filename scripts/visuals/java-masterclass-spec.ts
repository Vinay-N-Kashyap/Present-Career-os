// scripts/visuals/java-masterclass-spec.ts
// Exhaustive 60-Day (Month 1 + Month 2) Masterclass Specification for Java Core & Enterprise Systems
// Total Quests: 222 Quests (111 in Month 1 + 111 in Month 2)

export interface MasterclassQuest {
  id: string;
  name: string;
  type: 'concept' | 'detective' | 'assignment' | 'milestone' | 'viva';
  desc: string;
}

export interface MasterclassDaySpec {
  day: number;
  month: 1 | 2;
  blockNum: number;
  title: string;
  stageName: string;
  stageNum: 1 | 2 | 3 | 4;
  pedagogicalRole: string;
  spokenGoal: string;
  conceptInvariant: string;
  failureMode: string;
  tryItFriction: string;
  socraticHints: [string, string, string]; // [Tier 1 Nudge, Tier 2 Memory Highlight, Tier 3 Surgical Fix]
  situationalPuzzle: {
    scenario: string;
    options: string[];
    answerIdx: number;
    debrief: string;
  };
  quests: MasterclassQuest[];
}

export const JAVA_MONTH_1_SPECS: MasterclassDaySpec[] = [
  // ── BLOCK 1: PROGRAM EXECUTION, MEMORY & VARIABLES (Days 1–5) ──
  {
    day: 1,
    month: 1,
    blockNum: 1,
    title: 'What is a Program? — The JVM, Bytecode & The Main Thread Call Stack',
    stageName: 'Stage 1: Mental Model Grounding',
    stageNum: 1,
    pedagogicalRole: 'High Guidance (JVM Architecture & OS Process Boundaries)',
    spokenGoal: 'Explain how .java source compiles to .class bytecode and executes inside the JVM main stack frame.',
    conceptInvariant: 'Java executes strictly line-by-line within the main() thread stack frame. No code runs without an active stack frame.',
    failureMode: 'Missing main method signature (e.g. non-static or missing String[] args) causes JVM to exit immediately with NoSuchMethodError.',
    tryItFriction: 'Fix the main method signature in Recipe.java so the JVM can locate the execution entrypoint.',
    socraticHints: [
      'Look at the keywords before main(): does the JVM have an object instance created yet to call an instance method?',
      'The JVM entrypoint must be callable without creating an object first: it needs static.',
      'Change "public void main(String args)" to "public static void main(String[] args)".'
    ],
    situationalPuzzle: {
      scenario: 'A microservice fails to launch inside a Docker container with "Error: Main method not found in class Application". The code compiles cleanly with javac. What is the root cause?',
      options: [
        'The class was not marked public.',
        'The main method signature omitted "static" or declared String[] incorrectly.',
        'The Java runtime version is 64-bit instead of 32-bit.',
        'The container ran out of heap memory during class loading.'
      ],
      answerIdx: 1,
      debrief: 'The JVM specification strictly requires "public static void main(String[] args)". Without "static", the runtime cannot invoke the entrypoint without instantiating the class.'
    },
    quests: [
      { id: 'java-m1-d01-q1', name: 'JVM Architecture Walkthrough', type: 'concept', desc: 'Trace source code -> javac -> bytecode -> JVM execution pipeline.' },
      { id: 'java-m1-d01-q2', name: 'Detective Lab: Entrypoint Signature Repair', type: 'detective', desc: 'Identify why the JVM refuses to execute a program with invalid main modifiers.' },
      { id: 'java-m1-d01-q3', name: 'Mastery Assignment: First Multi-Step Recipe', type: 'assignment', desc: 'Author and run a 3-instruction console sequence with verified standard output.' }
    ]
  },
  {
    day: 2,
    month: 1,
    blockNum: 1,
    title: 'Interactive Console I/O — Scanner Buffers, Newline Pitfalls & Standard In',
    stageName: 'Stage 1: Mental Model Grounding',
    stageNum: 1,
    pedagogicalRole: 'High Guidance (OS Stream Buffering & Token Parsing)',
    spokenGoal: 'Master java.util.Scanner stream reading, buffer flushing, and the famous nextInt() -> nextLine() newline skip bug.',
    conceptInvariant: 'System.in is a raw byte stream. Scanner buffers input and leaves trailing newline characters (\n) unless explicitly consumed.',
    failureMode: 'Calling nextLine() immediately after nextInt() reads an empty string because the Enter key (\n) remains in the input buffer.',
    tryItFriction: 'Insert a buffer-clearing scanner.nextLine() call between reading user age and reading their full legal name.',
    socraticHints: [
      'Why did the program skip asking for your name after you typed your age?',
      'When you press Enter after typing "21", nextInt() only consumes the digits "21", leaving "\n" in the buffer.',
      'Add a blank scanner.nextLine(); immediately after reading the integer to consume the leftover newline.'
    ],
    situationalPuzzle: {
      scenario: 'An interactive CLI user registration tool skips the "Enter Address" prompt and submits a blank string. Telemetry shows users typed their postal code as an int right before. Why did this happen?',
      options: [
        'The OS terminal crashed.',
        'nextInt() left the newline byte in System.in, which the subsequent nextLine() immediately read as an empty input.',
        'The string variable had a null pointer exception.',
        'Scanner cannot read addresses with spaces.'
      ],
      answerIdx: 1,
      debrief: 'nextInt() consumes only the numeric tokens and stops at the delimiter (\n). The next nextLine() immediately sees that newline and returns an empty string.'
    },
    quests: [
      { id: 'java-m1-d02-q1', name: 'Scanner Stream Mechanics', type: 'concept', desc: 'Inspect how Scanner reads byte streams from OS file descriptor 0 (stdin).' },
      { id: 'java-m1-d02-q2', name: 'Detective Lab: The Ghost Newline Hunt', type: 'detective', desc: 'Debug and repair a broken user intake form that skips fields due to unconsumed newlines.' },
      { id: 'java-m1-d02-q3', name: 'Mastery Assignment: Interactive User Profile Console', type: 'assignment', desc: 'Build an interactive console prompt that safely reads name, age, GPA, and city.' },
      { id: 'java-m1-d02-q4', name: 'Socratic Debugging Lab: The Silent Buffer Drop', type: 'detective', desc: "Step through Scanner tokenization with debugger inspecting byte pointers." }
    ]
  },
  {
    day: 3,
    month: 1,
    blockNum: 1,
    title: 'Primitive Types & Memory Footprint — Bytes, Shorts, Ints, Longs, Floats & Doubles',
    stageName: 'Stage 1: Mental Model Grounding',
    stageNum: 1,
    pedagogicalRole: 'High Guidance (Stack Bit Allocation & Two\'s Complement)',
    spokenGoal: 'Understand the exact bit-width and stack memory allocation of Java\'s 8 primitive types.',
    conceptInvariant: 'Primitives store raw bits directly inside the CPU stack frame. An int always occupies 32 bits (-2^31 to 2^31 - 1).',
    failureMode: 'Storing financial monetary cents in a 32-bit int causes overflow beyond $21,474,836.47, turning balances into negative numbers.',
    tryItFriction: 'Upgrade an account ledger balance from int to long and append the L suffix to literal constants.',
    socraticHints: [
      'What happens when an int exceeds 2,147,483,647?',
      'In two\'s complement binary, adding 1 to the maximum positive integer flips the sign bit to negative.',
      'Change the variable type to long balance = 3_000_000_000L;.'
    ],
    situationalPuzzle: {
      scenario: 'A fintech ledger displays a user balance of -$2,147,483,648 after a successful $10 deposit into an account holding $2,147,483,640. What occurred in the JVM?',
      options: [
        'A database SQL injection attack.',
        '32-bit signed integer overflow in the stack frame flipped the sign bit.',
        'Floating-point rounding error in double precision.',
        'A null pointer dereference.'
      ],
      answerIdx: 1,
      debrief: 'Integer.MAX_VALUE is 2,147,483,647. Adding past this limit without overflow checks causes silent wrap-around to Integer.MIN_VALUE.'
    },
    quests: [
      { id: 'java-m1-d03-q1', name: 'Stack Allocation & Bit-Widths', type: 'concept', desc: 'Trace byte (8-bit), short (16-bit), int (32-bit), and long (64-bit) stack frame layouts.' },
      { id: 'java-m1-d03-q2', name: 'Detective Lab: The Million-Dollar Overflow', type: 'detective', desc: 'Diagnose a high-value balance calculation that silently wrapped into negative debt.' },
      { id: 'java-m1-d03-q3', name: 'Mastery Assignment: Memory-Optimized Telemetry Struct', type: 'assignment', desc: 'Choose the exact primitive types for satellite sensor data (temperature, packet ID, timestamp).' },
      { id: 'java-m1-d03-q4', name: 'Socratic Debugging Lab: Twos Complement Sign Bit Inversion', type: 'detective', desc: "Isolate binary bitmask transitions on integer boundaries." }
    ]
  },
  {
    day: 4,
    month: 1,
    blockNum: 1,
    title: 'Arithmetic Operations & Numeric Casting — Truncation, Promotion & Integer Overflow',
    stageName: 'Stage 1: Mental Model Grounding',
    stageNum: 1,
    pedagogicalRole: 'High Guidance (Integer Division & Implicit Type Promotion)',
    spokenGoal: 'Master Java arithmetic rules, integer division truncation (5 / 2 = 2), and explicit vs implicit type casting.',
    conceptInvariant: 'Dividing two integers always performs truncated integer division, discarding the remainder before assignment.',
    failureMode: 'Computing double average = (a + b) / 2 where a and b are ints computes integer division first, discarding fractional cents.',
    tryItFriction: 'Cast the divisor or dividend to double (e.g. / 2.0) to enforce floating-point arithmetic.',
    socraticHints: [
      'Why does 5 / 2 evaluate to 2.0 instead of 2.5 when assigned to a double?',
      'The expression (a + b) / 2 evaluates entirely as integer arithmetic before the result is assigned to the double variable.',
      'Change " / 2" to " / 2.0" or cast "(double)(a + b) / 2".'
    ],
    situationalPuzzle: {
      scenario: 'An e-commerce discount engine calculates "double discount = price * (percentage / 100);" with percentage = 15. The discount always evaluates to $0.00. Why?',
      options: [
        'The variable price is null.',
        '15 / 100 is integer division which truncates to 0, making the entire product zero.',
        'The discount variable cannot hold double values.',
        'Java requires the Math.discount() library.'
      ],
      answerIdx: 1,
      debrief: 'Because 15 and 100 are both integers, 15 / 100 yields 0. Multiplying price by 0 produces 0.00.'
    },
    quests: [
      { id: 'java-m1-d04-q1', name: 'Arithmetic Promotion Invariants', type: 'concept', desc: 'Understand how Java promotes byte and short to int during expressions.' },
      { id: 'java-m1-d04-q2', name: 'Detective Lab: The Vanishing Discount Bug', type: 'detective', desc: 'Fix an integer division truncation bug in a retail invoicing engine.' },
      { id: 'java-m1-d04-q3', name: 'Mastery Assignment: High-Precision Tax & Currency Calculator', type: 'assignment', desc: 'Implement precise tax calculation with explicit casting and rounding.' },
      { id: 'java-m1-d04-q4', name: 'Socratic Debugging Lab: Integer Truncation Dissection', type: 'detective', desc: "Expose lost pennies in financial pricing models caused by implicit truncation." }
    ]
  },
  {
    day: 5,
    month: 1,
    blockNum: 1,
    title: 'Boolean Logic & Relational Expressions — Truth Tables, Bitwise vs Short-Circuit AND/OR',
    stageName: 'Stage 1: Mental Model Grounding',
    stageNum: 1,
    pedagogicalRole: 'High Guidance (Short-Circuit Evaluation & Null Guarding)',
    spokenGoal: 'Master comparison operators, boolean algebra, and the difference between short-circuit (&&, ||) and non-short-circuit (&, |).',
    conceptInvariant: 'Short-circuit operator && halts evaluation immediately if the left operand is false, preventing downstream exceptions.',
    failureMode: 'Using single & instead of && in "obj != null & obj.isValid()" evaluates the right side even when obj is null, throwing NullPointerException.',
    tryItFriction: 'Replace a risky & operator with && to guard a member access check from throwing a runtime exception.',
    socraticHints: [
      'What is the danger of evaluating the right side of a condition if the left side checks for null?',
      'The single & operator evaluates BOTH sides unconditionally.',
      'Use && so that if obj == null is true, the JVM skips evaluating obj.isValid().'
    ],
    situationalPuzzle: {
      scenario: 'A server monitoring tool crashes with NullPointerException on: "if (user != null & user.isVerified())". The developer assumed the null check protected the call. Why did it crash?',
      options: [
        'user was verified.',
        'Single & is a bitwise/eager logical operator that evaluates user.isVerified() even when user is null.',
        'Java does not support boolean checks in if statements.',
        'user was allocated on the stack instead of heap.'
      ],
      answerIdx: 1,
      debrief: 'Single & does NOT short-circuit. The JVM evaluates both operands, causing user.isVerified() to throw NullPointerException when user is null.'
    },
    quests: [
      { id: 'java-m1-d05-q1', name: 'Short-Circuit Evaluation Mechanics', type: 'concept', desc: 'Trace CPU branch execution for && and || evaluation.' },
      { id: 'java-m1-d05-q2', name: 'Detective Lab: The Null Dereference Guard', type: 'detective', desc: 'Convert an eager logical condition into a safe short-circuit guard.' },
      { id: 'java-m1-d05-q3', name: 'Mastery Assignment: Loan Eligibility Decision Matrix', type: 'assignment', desc: 'Build a multi-variable eligibility checker (credit score, income, debt ratio).' },
      { id: 'java-m1-d05-q4', name: 'Socratic Debugging Lab: Eager Operator Trap Hunt', type: 'detective', desc: "Trace CPU branch evaluation of non-short-circuit & vs &&." }
    ]
  },

  // ── BLOCK 2: BRANCHING, CONTROL FLOW & STATE MACHINES (Days 6–10) ──
  {
    day: 6,
    month: 1,
    blockNum: 2,
    title: 'Conditional Branching (if, else if, else) & Branch Prediction',
    stageName: 'Stage 2: Defensive Fluency',
    stageNum: 2,
    pedagogicalRole: 'Balanced Friction (Mutual Exclusion & Guard Clauses)',
    spokenGoal: 'Write clean, mutually exclusive conditional branches and understand early returns / guard clauses.',
    conceptInvariant: 'In an if-else if-else chain, at most ONE block executes. Conditions are checked top-to-bottom.',
    failureMode: 'Using multiple independent if statements instead of else if causes mutually exclusive actions to execute consecutively.',
    tryItFriction: 'Refactor separate if statements into an else if ladder so a grade cannot be simultaneously marked A and B.',
    socraticHints: [
      'If score >= 90 is true, why did the program ALSO print "Grade B"?',
      'Because the next line was a separate "if (score >= 80)" rather than "else if (score >= 80)".',
      'Chain the conditions using "else if" so only the first matching branch executes.'
    ],
    situationalPuzzle: {
      scenario: 'A banking alert system sends both an "Overdrawn Alert" and an "Account in Good Standing" notification to the same customer on the same balance check. What bug exists in the code?',
      options: [
        'The database sent duplicate balance records.',
        'The balance checks were written as two independent if statements rather than an if-else ladder.',
        'Integer overflow occurred in the account balance.',
        'The customer clicked the refresh button.'
      ],
      answerIdx: 1,
      debrief: 'Independent if statements do not guarantee mutual exclusion. If conditions overlap or state changes, both blocks execute.'
    },
    quests: [
      { id: 'java-m1-d06-q1', name: 'Mutual Exclusion Invariants', type: 'concept', desc: 'Analyze bytecode jump tables for if-else ladders.' },
      { id: 'java-m1-d06-q2', name: 'Detective Lab: The Overlapping Bracket Trap', type: 'detective', desc: 'Fix an overlapping tax tier algorithm where higher brackets fire lower tier penalties.' },
      { id: 'java-m1-d06-q3', name: 'Mastery Assignment: ATM Cash Withdrawal Authorization Engine', type: 'assignment', desc: 'Validate PIN, check daily limit, verify account balance, and emit structured status codes.' },
      { id: 'java-m1-d06-q4', name: 'Socratic Debugging Lab: Cascading Else-If Refactoring', type: 'detective', desc: "Audit non-mutually exclusive conditional branches." }
    ]
  },
  {
    day: 7,
    month: 1,
    blockNum: 2,
    title: 'Switch Statements & Exhaustive Matching & ⭐ Milestone 1: Interactive CLI State Machine',
    stageName: 'Stage 2: Defensive Fluency',
    stageNum: 2,
    pedagogicalRole: 'Balanced Friction (Jump Table O(1) Branching & Milestone 1)',
    spokenGoal: 'Master switch statements, the break keyword to avoid fall-through, modern switch expressions, and complete Milestone 1.',
    conceptInvariant: 'Traditional switch statements fall through to the next case unless terminated by break or return.',
    failureMode: 'Omitting break in case 1 causes case 2 and default to execute sequentially, corrupting state machine transitions.',
    tryItFriction: 'Add missing break statements to a CLI order menu state machine to prevent unwanted option execution.',
    socraticHints: [
      'When user selects option 1 (Deposit), why does option 2 (Withdraw) also run?',
      'In Java switch statements, execution falls through to adjacent cases without a break.',
      'Add "break;" at the end of each case block.'
    ],
    situationalPuzzle: {
      scenario: 'A traffic light controller transitions immediately from RED to GREEN, skipping the YELLOW phase during an automated test. The code uses a switch(lightState). What bug is present?',
      options: [
        'lightState is null.',
        'The case RED block lacks a break statement, falling through directly into case GREEN.',
        'The JVM optimized away the YELLOW case.',
        'System clock drifted.'
      ],
      answerIdx: 1,
      debrief: 'Without break, Java executes all subsequent statements across cases regardless of matching labels (fall-through anomaly).'
    },
    quests: [
      { id: 'java-m1-d07-q1', name: 'Switch Jump Tables & Bytecode Lookups', type: 'concept', desc: 'Contrast tableswitch vs lookupswitch in compiled bytecode.' },
      { id: 'java-m1-d07-q2', name: 'Detective Lab: The Fatal Fall-Through', type: 'detective', desc: 'Repair a stock trade execution dispatcher that accidentally executed both BUY and SELL.' },
      { id: 'java-m1-d07-q3', name: 'Mastery Assignment: CLI Vending Machine Controller', type: 'assignment', desc: 'Implement product selection, price lookup, and change calculation using switch.' },
      { id: 'java-m1-d07-m1', name: '⭐ Milestone 1: Interactive CLI Banking Decision Console', type: 'milestone', desc: 'Integrate Days 1–7 into an interactive menu: account creation, deposit, balance check, exit.' }
    ]
  },
  {
    day: 8,
    month: 1,
    blockNum: 2,
    title: 'While Loops & Loop Invariants — Pre-Condition Guarding & Off-by-One Traps',
    stageName: 'Stage 2: Defensive Fluency',
    stageNum: 2,
    pedagogicalRole: 'Balanced Friction (Termination Proofs & Counter Progress)',
    spokenGoal: 'Formulate loop invariants, guarantee loop progress toward termination, and prevent infinite loops.',
    conceptInvariant: 'Every while loop must have a variable mutation inside the body that drives the condition toward false.',
    failureMode: 'Failing to increment the counter inside a while loop creates an infinite loop that pins the CPU core at 100%.',
    tryItFriction: 'Add counter++ inside the loop body to ensure the loop terminates when target reaches 10.',
    socraticHints: [
      'Why is the program hanging and never reaching the final print statement?',
      'Inspect the loop condition while (count < 10): does count ever change value inside the loop?',
      'Add "count++;" inside the curly braces of the while loop.'
    ],
    situationalPuzzle: {
      scenario: 'A batch processor server CPU utilization spikes to 100% and stops responding to health checks. Thread dumps show the main thread stuck on line 42: "while (record != null)". What happened?',
      options: [
        'Garbage collection stopped the world.',
        'The loop failed to reassign record = reader.readNext(), keeping record non-null forever (infinite loop).',
        'A deadlock between two synchronized blocks.',
        'Operating system kill signal.'
      ],
      answerIdx: 1,
      debrief: 'An invariant of loops consuming streams is that each iteration must advance the pointer. Omitting advancement locks the thread in an infinite loop.'
    },
    quests: [
      { id: 'java-m1-d08-q1', name: 'Loop Invariants & Termination Proofs', type: 'concept', desc: 'Formulate the mathematical termination condition for iterative algorithms.' },
      { id: 'java-m1-d08-q2', name: 'Detective Lab: The CPU-Pinning Infinite Loop', type: 'detective', desc: 'Identify why a loan repayment simulation never finishes executing.' },
      { id: 'java-m1-d08-q3', name: 'Mastery Assignment: Compound Interest Growth Simulator', type: 'assignment', desc: 'Calculate how many years a principal balance takes to double at a given interest rate.' },
      { id: 'java-m1-d08-q4', name: 'Socratic Debugging Lab: The Deadlock-Simulating Infinite Loop', type: 'detective', desc: "Inject assertion guards preventing while loops from exceeding iteration budgets." }
    ]
  },
  {
    day: 9,
    month: 1,
    blockNum: 2,
    title: 'Do-While Loops & Input Validation Retry Gates',
    stageName: 'Stage 2: Defensive Fluency',
    stageNum: 2,
    pedagogicalRole: 'Balanced Friction (Guaranteed First Execution & Semicolon Syntax)',
    spokenGoal: 'Master do-while loops for prompts that must run at least once before checking the exit condition.',
    conceptInvariant: 'do-while executes the loop body once before evaluating the condition. The while() line requires a terminating semicolon (;).',
    failureMode: "Missing semicolon after while(condition); in a do-while loop causes compile error '; expected'.",
    tryItFriction: 'Add the required semicolon after the closing parenthesis of do-while loop condition.',
    socraticHints: [
      'Look at the very last line of the do-while block: what punctuation mark is missing after while(...) ?',
      'Unlike a standard while loop, do-while ends with a statement that requires a semicolon.',
      'Add a semicolon: "} while (input < 0);"'
    ],
    situationalPuzzle: {
      scenario: 'A developer needs a password prompt that asks the user for a PIN at least once, repeating if the PIN is incorrect. Which loop construct is mathematically and syntactically optimal?',
      options: [
        'A for loop with i = 0 to 100.',
        'A do-while loop, because the prompt must execute at least once before evaluating correctness.',
        'A recursive function without base case.',
        'A switch statement with fall-through.'
      ],
      answerIdx: 1,
      debrief: 'do-while guarantees that the body executes at least once before checking condition, making it the canonical pattern for input retry loops.'
    },
    quests: [
      { id: 'java-m1-d09-q1', name: 'do-while Execution Mechanics', type: 'concept', desc: 'Contrast pre-test (while) vs post-test (do-while) control flow.' },
      { id: 'java-m1-d09-q2', name: 'Detective Lab: The Syntax Semicolon Puzzle', type: 'detective', desc: 'Fix compile errors in an authentication retry loop.' },
      { id: 'java-m1-d09-q3', name: 'Mastery Assignment: Robust PIN Validation Gate', type: 'assignment', desc: 'Enforce a 3-attempt PIN retry loop with lockout upon consecutive failures.' },
      { id: 'java-m1-d09-q4', name: 'Socratic Debugging Lab: Input Retry Edge Cases', type: 'detective', desc: "Defend against negative numbers and non-numeric Scanner tokens." }
    ]
  },
  {
    day: 10,
    month: 1,
    blockNum: 2,
    title: 'For Loops & Deterministic Counter Iteration',
    stageName: 'Stage 2: Defensive Fluency',
    stageNum: 2,
    pedagogicalRole: 'Balanced Friction (3-Part Header & Variable Scope)',
    spokenGoal: 'Master the 3-part header: initialization, condition, and update. Scope loop variables strictly to the loop.',
    conceptInvariant: 'Variables declared in the for loop header (int i = 0) exist only within the loop scope and are popped on termination.',
    failureMode: 'Accessing loop counter variable i outside the loop body triggers compile error "cannot find symbol: variable i".',
    tryItFriction: 'Move the declaration of variable i outside the loop if its final value is required after the loop terminates.',
    socraticHints: [
      'Why is the compiler complaining about "cannot find symbol: variable i" on line 15?',
      'Where was int i declared? Inside the for loop header "for (int i = 0; ...)".',
      'Declare int i; before the for loop if you need to inspect how many iterations ran.'
    ],
    situationalPuzzle: {
      scenario: 'A telemetry packet sender uses "for (int i = 0; i <= count; i++)" to send count packets. The receiver alerts that 101 packets were sent when count = 100. Why?',
      options: [
        'Hardware packet duplication.',
        'Off-by-one boundary error: "<=" instead of "<" ran the loop count + 1 times (0 through 100).',
        'Integer promotion during packet transmission.',
        'Network latency delay.'
      ],
      answerIdx: 1,
      debrief: 'Iterating from 0 with "<= count" executes count + 1 times. For 0-indexed sequences of length N, the correct boundary condition is "< N".'
    },
    quests: [
      { id: 'java-m1-d10-q1', name: 'For Loop Header Lifecycle', type: 'concept', desc: 'Trace initialization, check, body, update sequence in machine instructions.' },
      { id: 'java-m1-d10-q2', name: 'Detective Lab: The Off-By-One Packet Leaker', type: 'detective', desc: 'Fix a boundary inequality that caused an extra duplicate transmission.' },
      { id: 'java-m1-d10-q3', name: 'Mastery Assignment: Prime Number Factorization Engine', type: 'assignment', desc: 'Implement efficient trial division loop to factor integers into primes.' },
      { id: 'java-m1-d10-q4', name: 'Socratic Debugging Lab: Loop Counter Boundary Verification', type: 'detective', desc: "Verify exact iteration counts using automated assert counters." }
    ]
  },

  // ── BLOCK 3: NESTED ITERATION, BREAK/CONTINUE & SCOPES (Days 11–15) ──
  {
    day: 11,
    month: 1,
    blockNum: 3,
    title: 'Nested Loops & 2D Matrix Traversal Complexity (O(N^2))',
    stageName: 'Stage 2: Defensive Fluency',
    stageNum: 2,
    pedagogicalRole: 'Balanced Friction (Quadratic Complexity & Row-Column Order)',
    spokenGoal: 'Understand nested loops, coordinate indexing (row i, col j), and calculate Big-O time complexity ($N \times M$).',
    conceptInvariant: 'An inner loop executes completely from start to finish for EVERY SINGLE iteration of the outer loop.',
    failureMode: 'Accidentally using the outer loop counter i inside the inner loop update (i++ instead of j++) causes infinite inner loop.',
    tryItFriction: 'Fix variable naming in inner loop so j++ increments column pointer instead of corrupting row counter i.',
    socraticHints: [
      'Look closely at the third clause of the inner for loop: for (int j = 0; j < cols; i++) ... notice anything wrong?',
      'The inner loop is incrementing i instead of j, so j never reaches cols!',
      'Change "i++" to "j++" in the inner loop header.'
    ],
    situationalPuzzle: {
      scenario: 'A developer writes a pixel color filter with nested loops over width (1,920) and height (1,080). The program freezes on the first frame. Profiling shows outer loop stuck at row 0. Why?',
      options: [
        'GPU shader driver crashed.',
        'The inner loop incremented row i instead of col j, creating an infinite inner loop.',
        '1080p images require 64-bit JVM.',
        'Garbage collection pause.'
      ],
      answerIdx: 1,
      debrief: 'Incrementing the wrong variable in nested loop headers is a classic bug that prevents the inner loop from terminating while corrupting outer state.'
    },
    quests: [
      { id: 'java-m1-d11-q1', name: 'Nested Loop Execution Geometry', type: 'concept', desc: 'Visualize the 2D Cartesian grid traversal step-by-step.' },
      { id: 'java-m1-d11-q2', name: 'Detective Lab: The Swapped Variable Freeze', type: 'detective', desc: 'Find and fix an inner loop incrementing the outer loop variable.' },
      { id: 'java-m1-d11-q3', name: 'Mastery Assignment: Multiplication Table & ASCII Grid Renderer', type: 'assignment', desc: 'Print formatted N x N mathematical grid with dynamic column alignment.' },
      { id: 'java-m1-d11-q4', name: 'Socratic Debugging Lab: Matrix Index Variable Disambiguation', type: 'detective', desc: "Resolve row/col index naming collisions in nested loops." }
    ]
  },
  {
    day: 12,
    month: 1,
    blockNum: 3,
    title: 'Loop Control Primitives (break, continue, Labeled Loops)',
    stageName: 'Stage 2: Defensive Fluency',
    stageNum: 2,
    pedagogicalRole: 'Balanced Friction (Early Termination vs Skipping Iterations)',
    spokenGoal: 'Master break (terminate loop), continue (skip to next iteration), and labeled loops for multi-level breaks.',
    conceptInvariant: 'break exits the innermost enclosing loop immediately. continue skips the remainder of the current iteration body.',
    failureMode: 'Using break when continue was intended terminates the entire processing loop prematurely, leaving remaining records unparsed.',
    tryItFriction: 'Replace break with continue so invalid corrupted records are skipped without aborting valid remaining data.',
    socraticHints: [
      'Why did the batch parser stop after processing only 3 out of 100 records?',
      'When it encountered record #4 with an error, it called break; which exited the entire loop.',
      'Change "break;" to "continue;" so it skips record #4 and moves on to record #5.'
    ],
    situationalPuzzle: {
      scenario: 'A data pipeline reading 10,000 telemetry packets drops 9,950 packets because packet #50 had a checksum error. Code shows: "if (!valid) break;". What should the developer have used?',
      options: [
        'System.exit(0)',
        'continue, to skip only the corrupted packet and proceed with subsequent packets.',
        'A nested while loop.',
        'An empty catch block.'
      ],
      answerIdx: 1,
      debrief: 'break terminates the loop permanently. continue skips only the current iteration, allowing the remaining items to be processed.'
    },
    quests: [
      { id: 'java-m1-d12-q1', name: 'Control Flow Transfer Mechanics', type: 'concept', desc: 'Inspect how break and continue translate to unconditional jumps in bytecode.' },
      { id: 'java-m1-d12-q2', name: 'Detective Lab: The Aborted Batch Processor', type: 'detective', desc: 'Diagnose why a batch file import aborted early upon encountering a single warning.' },
      { id: 'java-m1-d12-q3', name: 'Mastery Assignment: Matrix Target Search with Labeled Break', type: 'assignment', desc: 'Search 2D grid for a target value and break out of BOTH loops simultaneously upon discovery.' },
      { id: 'java-m1-d12-q4', name: 'Socratic Debugging Lab: Multi-Level Labeled Break Verification', type: 'detective', desc: "Trace control transfer across 3 levels of nested search loops." }
    ]
  },
  {
    day: 13,
    month: 1,
    blockNum: 3,
    title: 'Variable Scoping & Lexical Blocks — Shadowing, Lifetime & Stack Frame Deallocation',
    stageName: 'Stage 2: Defensive Fluency',
    stageNum: 2,
    pedagogicalRole: 'Balanced Friction (Lexical Scope & Stack Frame Cleanup)',
    spokenGoal: 'Understand block scopes {}, variable shadowing, and how local variables are automatically popped from the stack frame.',
    conceptInvariant: 'Variables declared inside a block {} cannot be accessed outside that block. Stack memory is reclaimed when the block closes.',
    failureMode: 'Declaring a variable inside an if block and attempting to use it after the if block causes compile error "cannot find symbol".',
    tryItFriction: 'Declare totalAmount outside the conditional block so both branches can write to it and outer code can return it.',
    socraticHints: [
      'Why cannot the return statement see "discountedPrice" on line 18?',
      'discountedPrice was declared inside the curly braces of "if (isMember) { ... }".',
      'Declare "double discountedPrice = originalPrice;" before the if statement.'
    ],
    situationalPuzzle: {
      scenario: 'A developer writes: "if (coupon) { double finalPrice = price * 0.9; } return finalPrice;". javac throws "cannot find symbol: variable finalPrice". Why?',
      options: [
        'finalPrice is a reserved keyword in Java.',
        'finalPrice is lexically scoped to the if block and ceases to exist after the closing brace }.',
        'price was not initialized.',
        'Java requires static returns.'
      ],
      answerIdx: 1,
      debrief: 'Java enforces block scoping. Variables declared within {} are local to that block and out-of-scope once the block terminates.'
    },
    quests: [
      { id: 'java-m1-d13-q1', name: 'Lexical Scopes & Stack Pointer Movement', type: 'concept', desc: 'Visualize how local variables are allocated and deallocated as blocks open and close.' },
      { id: 'java-m1-d13-q2', name: 'Detective Lab: The Trapped Local Variable', type: 'detective', desc: 'Refactor code where a computed result is trapped inside an inner loop scope.' },
      { id: 'java-m1-d13-q3', name: 'Mastery Assignment: Tiered Commission Engine', type: 'assignment', desc: 'Implement multi-stage commission rates ensuring scope safety across all calculation blocks.' },
      { id: 'java-m1-d13-q4', name: 'Socratic Debugging Lab: Lexical Scope Leakage Audit', type: 'detective', desc: "Isolate variables unintentionally declared in outer scopes." }
    ]
  },
  {
    day: 14,
    month: 1,
    blockNum: 3,
    title: '⭐ Milestone 2: Financial Ledger Tax Calculator & Call-Stack Engine',
    stageName: 'Stage 2: Defensive Fluency',
    stageNum: 2,
    pedagogicalRole: 'Balanced Friction (Milestone 2 Integration)',
    spokenGoal: 'Synthesize conditionals, loops, scopes, and numeric types into a robust corporate taxation ledger engine.',
    conceptInvariant: 'Financial calculations must use explicit casting, exact bracket boundaries, and maintain audit trail counters.',
    failureMode: 'Failing to deduct the lower bracket threshold before taxing the marginal excess results in severe over-taxation.',
    tryItFriction: 'Fix progressive tax bracket logic to apply rates strictly to marginal income amounts above each threshold.',
    socraticHints: [
      'In a progressive tax system, does a person earning $100,001 pay 30% on the entire $100,001?',
      'No! They pay 10% on the first bracket, 20% on the second, and 30% ONLY on the marginal $1 above $100,000.',
      'Calculate tax on (income - bracketThreshold) for the marginal amount.'
    ],
    situationalPuzzle: {
      scenario: 'A payroll system calculates tax for an employee earning $50,001 and leaves them with less net pay than someone earning $49,999. What tax calculation flaw exists?',
      options: [
        'Tax bracket was calculated on gross income rather than marginal bracket bands.',
        'Rounding error in integer arithmetic.',
        'Currency symbol formatting error.',
        'Operating system timezone change.'
      ],
      answerIdx: 0,
      debrief: 'Progressive taxation taxes only the income within each specific band. Applying a higher rate to the total income creates an unjust cliff.'
    },
    quests: [
      { id: 'java-m1-d14-q1', name: 'Marginal Tax Algorithm Architecture', type: 'concept', desc: 'Formulate the mathematical model for multi-tier progressive tax brackets.' },
      { id: 'java-m1-d14-q2', name: 'Detective Lab: The Cliff-Edge Taxation Bug', type: 'detective', desc: 'Correct an algorithm that accidentally applied top-tier tax rates to total income.' },
      { id: 'java-m1-d14-q3', name: 'Mastery Assignment: Annual Tax Deduction & Rebate Calculator', type: 'assignment', desc: 'Calculate deductions (80C, health insurance) and output itemized tax liability.' },
      { id: 'java-m1-d14-m2', name: '⭐ Milestone 2: Comprehensive Corporate Tax Ledger Engine', type: 'milestone', desc: 'End-to-end multi-employee payroll tax processing with audit logging.' }
    ]
  },
  {
    day: 15,
    month: 1,
    blockNum: 3,
    title: 'Introduction to Methods — Signatures, Modifiers, Return Values & Pure Functions',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Stack Frame Pushing & Modular Decomposition)',
    spokenGoal: 'Master method syntax: access modifier, return type, name, parameter list, and understand pure functions.',
    conceptInvariant: 'Invoking a method allocates a brand new stack frame on top of the call stack. Returning pops that frame and passes the result.',
    failureMode: 'A non-void method with branching where one branch lacks a return statement triggers "missing return statement".',
    tryItFriction: 'Add an explicit return statement in the else branch of a method returning a boolean.',
    socraticHints: [
      'Why is javac failing on line 12 with "missing return statement"?',
      'What happens if the if condition is false? What does the method return?',
      'Add "return false;" at the end of the method so all execution paths return a value.'
    ],
    situationalPuzzle: {
      scenario: 'A code review bot flags a method: "public int calculate(int x) { if (x > 0) return x * 2; }". The developer says "x is always positive in my app". Why does javac reject this code?',
      options: [
        'int cannot be multiplied by 2.',
        'The Java compiler requires definite assignment and guarantees every execution path returns a value, regardless of runtime assumptions.',
        'calculate must be marked static.',
        'Methods cannot accept parameters named x.'
      ],
      answerIdx: 1,
      debrief: 'Java performs static path analysis. If ANY execution path can reach the end of a non-void method without returning, compilation fails.'
    },
    quests: [
      { id: 'java-m1-d15-q1', name: 'Method Signatures & Return Contracts', type: 'concept', desc: 'Trace how methods define strict input/output contracts.' },
      { id: 'java-m1-d15-q2', name: 'Detective Lab: The Orphaned Execution Branch', type: 'detective', desc: 'Fix a method where an edge case condition exits without returning a value.' },
      { id: 'java-m1-d15-q3', name: 'Mastery Assignment: Reusable Mathematical Geometry Library', type: 'assignment', desc: 'Author pure methods: circleArea(), hypotenuse(), isEven(), clamp().' }
    ]
  },

  // ── BLOCK 4: PROCEDURAL DECOMPOSITION & THE CALL STACK (Days 16–20) ──
  {
    day: 16,
    month: 1,
    blockNum: 4,
    title: 'Parameter Passing Semantics in Java — Strict Pass-by-Value Mechanics',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Pass-by-Value Primitives vs Reference Copies)',
    spokenGoal: 'Prove that Java is strictly pass-by-value. Mutating a primitive parameter inside a method NEVER affects the caller\'s variable.',
    conceptInvariant: 'When passing a primitive to a method, a bit-for-bit copy is placed into the new stack frame. The caller\'s variable is untouched.',
    failureMode: 'Attempting to swap two integers via swap(int a, int b) fails because it swaps only local copies inside the swap stack frame.',
    tryItFriction: 'Observe that swapping primitive parameters has zero effect in the calling method, and return an array or container instead.',
    socraticHints: [
      'Why are x and y unchanged in main() after calling swap(x, y)?',
      'Because swap received COPIES of x and y in its own stack frame.',
      'Java cannot pass primitive variables by reference. To return two values, return an int[] array or helper object.'
    ],
    situationalPuzzle: {
      scenario: 'A junior engineer writes a method "void increment(int count) { count++; }" and wonders why count remains 0 in main() after calling increment(count). What is the explanation?',
      options: [
        'count was not volatile.',
        'Java is strictly pass-by-value. increment() mutated its local parameter copy on its stack frame, leaving main\'s variable untouched.',
        'The method was not public.',
        'Integer variables cannot be incremented inside methods.'
      ],
      answerIdx: 1,
      debrief: 'Java never passes primitives by reference. The parameter count in increment() is a separate stack variable holding a copy of the value.'
    },
    quests: [
      { id: 'java-m1-d16-q1', name: 'Pass-by-Value Stack Verification', type: 'concept', desc: 'Trace two distinct stack frames verifying independent memory addresses for parameters.' },
      { id: 'java-m1-d16-q2', name: 'Detective Lab: The Ineffective Swap Function', type: 'detective', desc: 'Demonstrate why primitive swap() fails and refactor to use an array return.' },
      { id: 'java-m1-d16-q3', name: 'Mastery Assignment: Safe Balance Mutator Function', type: 'assignment', desc: 'Implement pure functions that return updated balances rather than attempting in-place mutation.' },
      { id: 'java-m1-d16-q4', name: 'Socratic Debugging Lab: Pass-by-Value Memory Address Proof', type: 'detective', desc: "Verify distinct stack memory addresses of parameters using bytecode inspection." }
    ]
  },
  {
    day: 17,
    month: 1,
    blockNum: 4,
    title: 'Call Stack Execution Traces — Stack Frames, Local Variable Arrays & Return Addresses',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Call Stack Anatomy & Frame Pushing)',
    spokenGoal: 'Trace deep call chains: methodA() calls methodB() calls methodC(). Understand stack depth and return addresses.',
    conceptInvariant: 'Stack frames operate in strict Last-In, First-Out (LIFO) order. A caller method frame is paused until the callee frame returns.',
    failureMode: 'A deep call chain where an unhandled exception occurs terminates all intermediate frames, printing a stack trace.',
    tryItFriction: 'Read a multi-line Java stack trace from console and identify the exact line number where the original bug occurred.',
    socraticHints: [
      'In a stack trace with 8 lines, which line represents where the error originally happened?',
      'The top of the stack trace (or the first line in your package) is where the exception was thrown.',
      'Look at the top line: "at OrderService.calculateTax(OrderService.java:42)". Line 42 is the fault location.'
    ],
    situationalPuzzle: {
      scenario: 'When analyzing a production error log: "Exception in thread main at C.run(C.java:10) at B.process(B.java:25) at A.main(A.java:5)". What was the execution sequence before the crash?',
      options: [
        'C called B called A.',
        'A.main called B.process, which called C.run, which crashed at line 10.',
        'Three threads were running concurrently.',
        'A and B succeeded, and C was called by the garbage collector.'
      ],
      answerIdx: 1,
      debrief: 'Stack traces print in LIFO order (most recent frame on top). The entrypoint A.main invoked B.process, which invoked C.run.'
    },
    quests: [
      { id: 'java-m1-d17-q1', name: 'Call Stack LIFO Architecture', type: 'concept', desc: 'Diagram how CPU pushes and pops stack frames during nested method calls.' },
      { id: 'java-m1-d17-q2', name: 'Detective Lab: The Stack Trace Forensics Hunt', type: 'detective', desc: 'Read a 15-frame crash report and isolate the line of code responsible.' },
      { id: 'java-m1-d17-q3', name: 'Mastery Assignment: Multi-Tier Pricing Calculation Pipeline', type: 'assignment', desc: 'Chain 4 modular methods: applyCoupon -> applyTax -> applyShipping -> formatReceipt.' },
      { id: 'java-m1-d17-q4', name: 'Socratic Debugging Lab: Deep Stack Trace Triangulation', type: 'detective', desc: "Parse complex multi-threaded exception traces to isolate root-cause frame." }
    ]
  },
  {
    day: 18,
    month: 1,
    blockNum: 4,
    title: 'Stack Overflow Mechanics — Deep Recursion vs Iterative Refactoring',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (JVM Stack Sizing -Xss & Infinite Recursion)',
    spokenGoal: 'Understand why recursion without a base case causes java.lang.StackOverflowError and how to refactor to iterative while loops.',
    conceptInvariant: 'The JVM allocates a fixed stack size per thread (typically 1MB). Exceeding this limit throws StackOverflowError.',
    failureMode: 'A recursive function missing its base case (e.g. n == 0) calls itself infinitely until thread stack memory is exhausted.',
    tryItFriction: 'Add the missing base case "if (n <= 1) return 1;" to a recursive factorial function.',
    socraticHints: [
      'Why does factorial(5) crash with StackOverflowError?',
      'Does the function ever stop calling itself? What happens when n becomes 0, -1, -2, -3...?',
      'Add a base case: "if (n <= 1) return 1;" at the very top of the method.'
    ],
    situationalPuzzle: {
      scenario: 'A recursive category tree traversal works fine in testing with 50 subcategories, but crashes with StackOverflowError in production on a deeply nested enterprise taxonomy of 25,000 levels. Why?',
      options: [
        'The JVM heap ran out of memory (-Xmx).',
        'Each recursive call pushes a new frame onto the call stack; 25,000 frames exceed the thread stack limit (-Xss).',
        'Recursion is illegal in enterprise Java.',
        'The database connection timed out.'
      ],
      answerIdx: 1,
      debrief: 'Every recursive call consumes stack frame memory. Deep hierarchies must be refactored to an iterative loop with an explicit heap-allocated stack to prevent StackOverflowError.'
    },
    quests: [
      { id: 'java-m1-d18-q1', name: 'Stack Memory Limits (-Xss)', type: 'concept', desc: 'Measure how many stack frames fit into standard 1MB JVM thread stack.' },
      { id: 'java-m1-d18-q2', name: 'Detective Lab: The Vanishing Base Case', type: 'detective', desc: 'Fix a recursive directory scanner that blew the stack on circular symlinks.' },
      { id: 'java-m1-d18-q3', name: 'Mastery Assignment: Recursive to Iterative Refactoring', type: 'assignment', desc: 'Convert recursive Fibonacci and Factorial into high-performance iterative loops.' },
      { id: 'java-m1-d18-q4', name: 'Socratic Debugging Lab: Stack Frame Depth Meter', type: 'detective', desc: "Measure thread stack consumption per recursive frame before -Xss exhaustion." }
    ]
  },
  {
    day: 19,
    month: 1,
    blockNum: 4,
    title: 'Method Overloading & Compile-Time Signature Resolution',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Compile-Time Polymorphism & Type Ambiguity)',
    spokenGoal: 'Master method overloading: same method name, different parameter lists (type, count, order).',
    conceptInvariant: 'Overloaded methods are resolved at COMPILE TIME based strictly on the static types of arguments.',
    failureMode: 'Overloading methods with ambiguous primitive promotions (e.g. print(int, long) vs print(long, int)) causes "ambiguous method call".',
    tryItFriction: 'Disambiguate an overloaded call by explicitly casting an int argument to long (e.g. 10L).',
    socraticHints: [
      'Why does javac report "reference to log is ambiguous" when calling log(10, 20)?',
      'The compiler sees log(int, long) and log(long, int). Both are equally valid promotions for two ints!',
      'Cast one argument explicitly: log(10, (long)20) to resolve ambiguity.'
    ],
    situationalPuzzle: {
      scenario: 'A class defines: "void print(double d)" and "void print(int i)". If the code calls "print(5)", which method is invoked?',
      options: [
        'print(double d) because double is larger.',
        'print(int i) because the compiler selects the most specific match without promotion.',
        'Both methods run.',
        'Compilation error due to duplicate names.'
      ],
      answerIdx: 1,
      debrief: 'The Java compiler resolves overloads to the most specific signature that matches the argument types without requiring type widening.'
    },
    quests: [
      { id: 'java-m1-d19-q1', name: 'Overloading Resolution Rules', type: 'concept', desc: 'Understand exact match vs widening vs boxing in overload selection.' },
      { id: 'java-m1-d19-q2', name: 'Detective Lab: The Ambiguous Invocation Duel', type: 'detective', desc: 'Disambiguate conflicting overloaded logging methods.' },
      { id: 'java-m1-d19-q3', name: 'Mastery Assignment: Flexible Formatting Engine', type: 'assignment', desc: 'Author formatCurrency(double), formatCurrency(double, String), formatCurrency(long, boolean).' }
    ]
  },
  {
    day: 20,
    month: 1,
    blockNum: 4,
    title: 'Defensive Input Sanitization & Precondition Assertions in Methods',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Guard Clauses & IllegalArgumentException)',
    spokenGoal: 'Write defensive methods that validate input boundaries immediately, failing fast before executing business logic.',
    conceptInvariant: 'Fail fast. Validate preconditions at the top of the method and throw IllegalArgumentException on invalid arguments.',
    failureMode: 'Allowing negative prices or null customer IDs into processing methods corrupts downstream database ledgers.',
    tryItFriction: 'Add an input guard clause: if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");.',
    socraticHints: [
      'What should a transfer(amount) method do if someone passes -500?',
      'It must refuse to execute and reject the invalid argument immediately.',
      'Add: "if (amount <= 0) throw new IllegalArgumentException(\"Invalid amount: \" + amount);"'
    ],
    situationalPuzzle: {
      scenario: 'A payment gateway accepts a transfer request for -$50,000. It deducts -$50,000 from the sender (crediting them $50,000!) and debits the recipient. What architectural rule was violated?',
      options: [
        'Double-entry accounting failure.',
        'Failure to validate method preconditions (amount > 0) with a fail-fast guard clause.',
        'Database connection dropped.',
        'Network packet corruption.'
      ],
      answerIdx: 1,
      debrief: 'Public API methods must defend their invariants. Without fail-fast precondition validation, invalid negative inputs cause catastrophic logical inversions.'
    },
    quests: [
      { id: 'java-m1-d20-q1', name: 'Fail-Fast Principle & Precondition Guards', type: 'concept', desc: 'Study why early exception throwing is superior to silent error codes.' },
      { id: 'java-m1-d20-q2', name: 'Detective Lab: The Negative Balance Infiltration', type: 'detective', desc: 'Harden an unvalidated order submission method against zero and negative quantities.' },
      { id: 'java-m1-d20-q3', name: 'Mastery Assignment: Production Registration Input Validator', type: 'assignment', desc: 'Validate email format, password complexity, and age boundaries with descriptive exceptions.' }
    ]
  },

  // ── BLOCK 5: 1D ARRAYS & CONTIGUOUS MEMORY ALLOCATION (Days 21–25) ──
  {
    day: 21,
    month: 1,
    blockNum: 5,
    title: '1D Arrays — Contiguous Heap Allocation, Index Boundaries & ⭐ Milestone 3: Fast Contiguous Data Buffer',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Heap Layout, Fixed Sizing & Milestone 3)',
    spokenGoal: 'Understand array memory allocation: a contiguous block of heap memory with fixed length, indexed 0 to length - 1.',
    conceptInvariant: 'Arrays in Java are objects on the heap with a fixed length property. Indexing is 0-based. Access outside [0, length-1] throws ArrayIndexOutOfBoundsException.',
    failureMode: 'Iterating up to array.length with "<=" causes ArrayIndexOutOfBoundsException on the final element.',
    tryItFriction: 'Change the loop condition from "i <= scores.length" to "i < scores.length".',
    socraticHints: [
      'An array of size 5 has indices 0, 1, 2, 3, and 4. What index does the loop try to access if it runs while i <= 5?',
      'It tries to access index 5, which does not exist!',
      'Change the condition to "i < scores.length".'
    ],
    situationalPuzzle: {
      scenario: 'A server crashes with ArrayIndexOutOfBoundsException: Index 10 out of bounds for length 10. The developer checked "for (int i = 0; i <= arr.length; i++)". Why did it crash?',
      options: [
        'The array was empty.',
        'The length is 10, meaning valid indices are 0 to 9. The "<=" operator caused index 10 to be accessed.',
        'The JVM ran out of heap space.',
        'Integer index overflow.'
      ],
      answerIdx: 1,
      debrief: 'Because array indices are 0-based, the maximum index is always array.length - 1. Iterating with "<=" accesses an illegal boundary.'
    },
    quests: [
      { id: 'java-m1-d21-q1', name: 'Contiguous Heap Memory Geometry', type: 'concept', desc: 'Calculate exact byte offset for array[i] = baseAddress + (i * elementSize).' },
      { id: 'java-m1-d21-q2', name: 'Detective Lab: The Off-By-One Buffer Crash', type: 'detective', desc: 'Fix an array population loop crashing on the last index.' },
      { id: 'java-m1-d21-q3', name: 'Mastery Assignment: Sensor Reading Statistics Engine', type: 'assignment', desc: 'Compute min, max, average, and standard deviation over an array of doubles.' },
      { id: 'java-m1-d21-m3', name: '⭐ Milestone 3: Fast Contiguous Memory Data Buffer', type: 'milestone', desc: 'Build fixed-capacity ring buffer for streaming sensor data.' }
    ]
  },
  {
    day: 22,
    month: 1,
    blockNum: 5,
    title: 'Array Traversal, In-Place Reversal & Cache Line Locality',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Two-Pointer In-Place Swapping & Spatial Locality)',
    spokenGoal: 'Reverse an array in-place using two pointers (left, right) with O(1) auxiliary space, and understand CPU cache lines.',
    conceptInvariant: 'In-place array reversal requires only array.length / 2 swaps using a temporary variable without allocating a second array.',
    failureMode: 'Swapping elements in a loop that runs up to array.length reverses the array and then un-reverses it back to original!',
    tryItFriction: 'Terminate the two-pointer loop when left >= right to avoid double-reversing the elements.',
    socraticHints: [
      'Why is the array unchanged after running a swap loop that goes all the way from i = 0 to array.length?',
      'Because after reversing elements in the first half, the second half swapped them right back to where they started!',
      'Stop the loop when left reaches right (left < right).'
    ],
    situationalPuzzle: {
      scenario: 'An algorithm reverses an array by swapping element i with element (length - 1 - i). The loop condition is "for (int i = 0; i < arr.length; i++)". The resulting array is identical to the input. Why?',
      options: [
        'The array was immutable.',
        'The loop swapped every pair twice, restoring the original order.',
        'Temporary variable memory leaked.',
        'Two\'s complement parity inversion.'
      ],
      answerIdx: 1,
      debrief: 'To reverse in place, you must stop at the midpoint (arr.length / 2). Going past the midpoint reverses the elements a second time.'
    },
    quests: [
      { id: 'java-m1-d22-q1', name: 'Two-Pointer Technique Mechanics', type: 'concept', desc: 'Trace left and right pointer convergence toward the array center.' },
      { id: 'java-m1-d22-q2', name: 'Detective Lab: The Double-Reversal Paradox', type: 'detective', desc: 'Fix an in-place array inverter that left elements in their original positions.' },
      { id: 'java-m1-d22-q3', name: 'Mastery Assignment: In-Place Array Shuffler & Rotator', type: 'assignment', desc: 'Rotate an array by K positions in-place using the 3-step reversal algorithm.' },
      { id: 'java-m1-d22-q4', name: 'Socratic Debugging Lab: Two-Pointer Boundary Collision', type: 'detective', desc: "Defend against odd vs even array length off-by-one errors in reversal." }
    ]
  },
  {
    day: 23,
    month: 1,
    blockNum: 5,
    title: 'Linear Search vs Binary Search on Sorted Arrays (O(N) vs O(log N))',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Logarithmic Time & Midpoint Overflow)',
    spokenGoal: 'Implement Linear Search ($O(N)$) and Binary Search ($O(\log N)$). Understand the famous (low + high) / 2 integer overflow bug.',
    conceptInvariant: 'Binary search requires a sorted array. At each step, it halves the search space ($O(\log N)$).',
    failureMode: 'Calculating mid as "(low + high) / 2" overflows to a negative integer when low + high exceeds 2^31 - 1 in large arrays.',
    tryItFriction: 'Calculate mid safely using "low + (high - low) / 2" to prevent integer overflow.',
    socraticHints: [
      'What happens if low is 1,500,000,000 and high is 1,500,000,000? What does low + high equal in a 32-bit int?',
      'It equals 3,000,000,000, which overflows Integer.MAX_VALUE and becomes negative!',
      'Use the overflow-safe formula: int mid = low + (high - low) / 2;'
    ],
    situationalPuzzle: {
      scenario: 'In 2006, Google research revealed that java.util.Arrays.binarySearch contained a bug that lay undetected for 9 years. What was the bug?',
      options: [
        'It failed on arrays of odd length.',
        'Computing (low + high) / 2 overflowed for arrays with more than 1 billion elements, resulting in a negative index.',
        'It used linear search under the hood.',
        'It crashed on null values.'
      ],
      answerIdx: 1,
      debrief: 'Famous Joshua Bloch bug: (low + high) overflows when the sum exceeds 2^31 - 1, producing a negative index that crashes with ArrayIndexOutOfBoundsException.'
    },
    quests: [
      { id: 'java-m1-d23-q1', name: 'Divide-and-Conquer Logarithmic Search', type: 'concept', desc: 'Derive why binary search requires at most 30 comparisons for 1,000,000,000 items.' },
      { id: 'java-m1-d23-q2', name: 'Detective Lab: The Midpoint Overflow Trap', type: 'detective', desc: 'Fix integer overflow in a high-capacity binary search implementation.' },
      { id: 'java-m1-d23-q3', name: 'Mastery Assignment: Fast Order Book Price Lookup', type: 'assignment', desc: 'Search sorted price book for exact price or closest lower bid.' },
      { id: 'java-m1-d23-q4', name: 'Socratic Debugging Lab: Midpoint Integer Overflow Reproduction', type: 'detective', desc: "Reproduce the Joshua Bloch binary search bug with large array bounds." }
    ]
  },
  {
    day: 24,
    month: 1,
    blockNum: 5,
    title: 'Array Cloning, System.arraycopy & Shallow Copy Traps',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Reference Aliasing vs Deep Memory Duplication)',
    spokenGoal: 'Understand reference aliasing: assigning arr2 = arr1 does NOT copy the array! Master System.arraycopy().',
    conceptInvariant: 'arr2 = arr1 creates a second reference pointing to the SAME heap array object. Mutating arr2 mutates arr1.',
    failureMode: 'Assigning backup = current and mutating current corrupts the backup because both variables point to the identical array.',
    tryItFriction: 'Use System.arraycopy or arr.clone() to allocate a genuine independent copy of the array.',
    socraticHints: [
      'Why did modifying originalScores also change backupScores?',
      'Because "int[] backup = original;" only copied the reference address, not the array elements!',
      'Use "int[] backup = original.clone();" or System.arraycopy().'
    ],
    situationalPuzzle: {
      scenario: 'A transaction rollback mechanism restores state using: "int[] rollback = activeLedger;". When activeLedger is corrupted, rollback is also found to be corrupted. Why?',
      options: [
        'Disk failure.',
        'Reference aliasing: rollback was merely a pointer copy to the exact same array in heap memory.',
        'The JVM garbage collected the rollback array.',
        'Stack frame overflow.'
      ],
      answerIdx: 1,
      debrief: 'In Java, object variables store references. The assignment operator (=) copies the reference pointer, not the underlying heap memory.'
    },
    quests: [
      { id: 'java-m1-d24-q1', name: 'Reference Aliasing vs Heap Cloning', type: 'concept', desc: 'Diagram pointer references vs distinct allocated memory blocks.' },
      { id: 'java-m1-d24-q2', name: 'Detective Lab: The Corrupted Rollback Snapshot', type: 'detective', desc: 'Repair a snapshot mechanism that failed due to shallow reference sharing.' },
      { id: 'java-m1-d24-q3', name: 'Mastery Assignment: High-Speed Buffer Expander', type: 'assignment', desc: 'Implement dynamic buffer growth using System.arraycopy to double capacity.' },
      { id: 'java-m1-d24-q4', name: 'Socratic Debugging Lab: Shallow Copy Mutation Detection', type: 'detective', desc: "Write assertions detecting accidental shared array reference mutations." }
    ]
  },
  {
    day: 25,
    month: 1,
    blockNum: 5,
    title: '2D Arrays — Arrays of Arrays, Jagged Arrays & Matrix Multiplication',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Pointer-to-Pointer Heap Layout & Row-Major Access)',
    spokenGoal: 'Master 2D arrays in Java: they are arrays of references pointing to separate 1D array objects (allowing jagged rows).',
    conceptInvariant: 'In Java, a 2D array int[R][C] is an array of R pointers on the heap, each pointing to an independent C-length array.',
    failureMode: 'Assuming all rows have equal length in a jagged array causes ArrayIndexOutOfBoundsException on short rows.',
    tryItFriction: 'Use matrix[row].length dynamically in column loops instead of hardcoding a fixed column constant.',
    socraticHints: [
      'Why did the loop crash on row 2 of a jagged triangle array?',
      'Row 0 has 1 element, row 1 has 2 elements, row 2 has 3 elements. Did your inner loop check matrix[row].length?',
      'Replace hardcoded column limits with "col < matrix[row].length".'
    ],
    situationalPuzzle: {
      scenario: 'A 3D graphics rendering routine accesses pixel buffers using matrix[col][row] instead of matrix[row][col]. Frame rate drops by 80%. Why did performance collapse?',
      options: [
        'The GPU driver disconnected.',
        'Column-major access breaks CPU spatial cache locality because Java 2D arrays are stored in row-major order, causing severe L1 cache misses.',
        'Garbage collection paused the rendering thread.',
        '2D arrays are deprecated in Java.'
      ],
      answerIdx: 1,
      debrief: 'Cache lines load contiguous row data. Accessing elements by column jumps between disjoint array memory blocks, invalidating CPU caches.'
    },
    quests: [
      { id: 'java-m1-d25-q1', name: 'Jagged Arrays & Pointer Topologies', type: 'concept', desc: 'Visualize the pointer array pointing to independent heap row buffers.' },
      { id: 'java-m1-d25-q2', name: 'Detective Lab: The Jagged Triangle Boundary Crash', type: 'detective', desc: 'Fix a matrix traversal crashing on non-rectangular arrays.' },
      { id: 'java-m1-d25-q3', name: 'Mastery Assignment: Matrix Transposition & Multiplication Engine', type: 'assignment', desc: 'Multiply two dimensional matrices verifying valid inner dimension constraints.' }
    ]
  },

  // ── BLOCK 6: ALGORITHMIC FOUNDATIONS & MONTH 1 CAPSTONE (Days 26–30) ──
  {
    day: 26,
    month: 1,
    blockNum: 6,
    title: 'Sorting Fundamentals: Bubble Sort, Selection Sort & In-Place Swapping',
    stageName: 'Stage 4: Architectural Autonomy',
    stageNum: 4,
    pedagogicalRole: 'Zero Support (Quadratic Sorting Invariants & Swapping Mechanics)',
    spokenGoal: 'Implement Bubble Sort and Selection Sort from scratch. Trace comparisons, swaps, and best/worst case complexity.',
    conceptInvariant: 'Selection sort finds the minimum element in the unsorted sub-array and performs exactly ONE swap per outer pass.',
    failureMode: 'Swapping elements inside Selection Sort without recording the minimum index performs N swaps per pass, degrading to naive bubble sort.',
    tryItFriction: 'Record minIndex during the inner pass and execute the swap only once after the inner loop completes.',
    socraticHints: [
      'In Selection Sort, should you swap every time you find a smaller number, or only after checking all remaining numbers?',
      'Only once per pass! You store the INDEX of the smallest number and swap at the end.',
      'Move the swap logic outside the inner loop: swap(arr, i, minIndex).'
    ],
    situationalPuzzle: {
      scenario: 'An embedded controller with limited flash write cycles sorts 10,000 sensor values. The engineer chooses Bubble Sort over Selection Sort. Why was this a critical architectural error?',
      options: [
        'Bubble sort cannot sort integers.',
        'Bubble sort performs up to O(N^2) memory write operations (swaps), degrading flash memory, whereas Selection Sort performs at most N writes.',
        'Selection sort requires 64-bit hardware.',
        'Bubble sort causes stack overflow.'
      ],
      answerIdx: 1,
      debrief: 'Selection sort minimizes writes: at most O(N) swaps. Bubble sort can execute O(N^2) swaps, causing excessive flash memory wear.'
    },
    quests: [
      { id: 'java-m1-d26-q1', name: 'Sorting Invariant Verification', type: 'concept', desc: 'Prove that after pass K of Selection Sort, the first K elements are in final sorted order.' },
      { id: 'java-m1-d26-q2', name: 'Detective Lab: The Excessive Swap Leaker', type: 'detective', desc: 'Optimize an un-optimized Bubble Sort with early termination if no swaps occurred.' },
      { id: 'java-m1-d26-q3', name: 'Mastery Assignment: Dual Sorting Benchmark Suite', type: 'assignment', desc: 'Benchmark comparison and swap counts between Bubble Sort and Selection Sort.' }
    ]
  },
  {
    day: 27,
    month: 1,
    blockNum: 6,
    title: 'Insertion Sort & Adaptive Sorting Complexity on Semi-Sorted Data',
    stageName: 'Stage 4: Architectural Autonomy',
    stageNum: 4,
    pedagogicalRole: 'Zero Support (Adaptive O(N) Best-Case & Shifting vs Swapping)',
    spokenGoal: 'Master Insertion Sort. Understand why it runs in O(N) linear time on almost-sorted data and how it shifts elements instead of swapping.',
    conceptInvariant: 'Insertion sort maintains a sorted prefix. Each new item shifts larger preceding items rightward before dropping into place.',
    failureMode: 'Using swaps instead of shifts in insertion sort does 3x more variable assignments per pass.',
    tryItFriction: 'Refactor element movement from multiple swaps to single rightward shifts, inserting the key at the final hole.',
    socraticHints: [
      'Why is shifting faster than swapping?',
      'A swap takes 3 assignments (temp = a, a = b, b = temp). A shift takes only 1 assignment (arr[j+1] = arr[j]).',
      'Shift elements right until you find the insertion point, then assign arr[j+1] = key.'
    ],
    situationalPuzzle: {
      scenario: 'A high-frequency trading feed receives a real-time list of 100,000 prices that is already 99% sorted, with only 5 newly arrived prices out of order. Which algorithm sorts it fastest?',
      options: [
        'QuickSort ($O(N \log N)$ average, but slow overhead for small shifts).',
        'Insertion Sort ($O(N)$ adaptive time on nearly-sorted data with almost zero overhead).',
        'Selection Sort ($O(N^2)$ regardless of initial order).',
        'Merge Sort.'
      ],
      answerIdx: 1,
      debrief: 'Insertion Sort is adaptive. When data is already nearly sorted, the inner loop terminates immediately in O(1), yielding O(N) total runtime.'
    },
    quests: [
      { id: 'java-m1-d27-q1', name: 'Adaptive Shifting Invariants', type: 'concept', desc: 'Derive the O(N + D) complexity bound where D is the number of inversions.' },
      { id: 'java-m1-d27-q2', name: 'Detective Lab: The Shift vs Swap Bottleneck', type: 'detective', desc: 'Convert an inefficient swapping insertion sort into an optimized shifting algorithm.' },
      { id: 'java-m1-d27-q3', name: 'Mastery Assignment: Real-Time Stream Inserter', type: 'assignment', desc: 'Maintain a sorted list of scores as new items arrive in real time.' }
    ]
  },
  {
    day: 28,
    month: 1,
    blockNum: 6,
    title: '⭐ Milestone 4: Algorithmic Multi-Pass Transaction Validation Engine',
    stageName: 'Stage 4: Architectural Autonomy',
    stageNum: 4,
    pedagogicalRole: 'Zero Support (Milestone 4 Integration)',
    spokenGoal: 'Synthesize arrays, sorting, binary search, and methods into a high-performance transaction batch deduplication engine.',
    conceptInvariant: 'Deduplicating sorted arrays takes O(N) time with a single linear pass vs O(N^2) for unsorted nested loops.',
    failureMode: 'Running nested linear scans over 100,000 transactions to find duplicates times out ($O(N^2)$ = 10 billion comparisons).',
    tryItFriction: 'Sort transactions by ID first, then eliminate duplicates in a single O(N) linear sweep.',
    socraticHints: [
      'How can you find duplicates without comparing every element to every other element?',
      'If you sort the array first, where will duplicate elements end up?',
      'Adjacent to each other! Just check if arr[i] == arr[i-1].'
    ],
    situationalPuzzle: {
      scenario: 'A batch payment deduplicator processing 500,000 transactions times out after 45 minutes. Code inspection reveals a nested loop: "for i ... for j ... if arr[i] == arr[j]". How do you reduce runtime to 2 seconds?',
      options: [
        'Run on a 128-core cloud instance.',
        'Sort the array in $O(N \log N)$, then find duplicates in a single $O(N)$ adjacent pass.',
        'Disable deduplication.',
        'Increase JVM heap size.'
      ],
      answerIdx: 1,
      debrief: 'Sorting brings duplicates adjacent. Checking arr[i] == arr[i-1] collapses an $O(N^2)$ algorithm (250 billion steps) to $O(N \log N)$ (9 million steps).'
    },
    quests: [
      { id: 'java-m1-d28-q1', name: 'Batch Deduplication Complexity', type: 'concept', desc: 'Compare $O(N^2)$ nested search vs $O(N \log N)$ sort-and-scan.' },
      { id: 'java-m1-d28-q2', name: 'Detective Lab: The 45-Minute Batch Timeout', type: 'detective', desc: 'Refactor a quadratic duplicate scanner into an optimal sort-and-sweep.' },
      { id: 'java-m1-d28-q3', name: 'Mastery Assignment: High-Capacity Transaction Reconciliation', type: 'assignment', desc: 'Reconcile credits vs debits and flag unmatched transaction IDs.' },
      { id: 'java-m1-d28-m4', name: '⭐ Milestone 4: Multi-Pass Algorithmic Transaction Engine', type: 'milestone', desc: 'Sort, validate, deduplicate, and aggregate 10,000 transaction records.' }
    ]
  },
  {
    day: 29,
    month: 1,
    blockNum: 6,
    title: 'String Fundamentals — java.lang.String Immutability & String Constant Pool',
    stageName: 'Stage 4: Architectural Autonomy',
    stageNum: 4,
    pedagogicalRole: 'Zero Support (String Pool, == vs .equals(), & StringBuilder)',
    spokenGoal: 'Understand String immutability, the String Pool, why == checks reference identity, and why StringBuilder is mandatory for loops.',
    conceptInvariant: 'Strings are immutable. String concatenation (+) inside loops creates O(N^2) garbage objects on the heap. Use StringBuilder.',
    failureMode: 'Comparing Strings with "s1 == s2" checks if they share the same heap memory address, failing on new String() instances.',
    tryItFriction: 'Replace "s1 == s2" with "s1.equals(s2)" to compare character content instead of reference pointers.',
    socraticHints: [
      'Why does input == "YES" evaluate to false even when the user typed "YES"?',
      'Because "==" compares object memory addresses! The String typed by user is a new object in memory.',
      'Always use .equals() to compare String text content: input.equals("YES").'
    ],
    situationalPuzzle: {
      scenario: 'A loop builds a 50,000-line CSV report using: "String report = \"\"; for(...) report += line;". The JVM freezes and crashes with OutOfMemoryError. Why?',
      options: [
        'The hard drive ran out of space.',
        'Strings are immutable; += creates 50,000 intermediate String objects copying all previous characters, generating 1.25 GB of garbage.',
        'CSV format requires commas.',
        'Integer overflow in line counter.'
      ],
      answerIdx: 1,
      debrief: 'Because String is immutable, each += allocates a new String and copies all characters. For N iterations, this copies $O(N^2)$ characters. StringBuilder modifies an in-place buffer in $O(N)$ time.'
    },
    quests: [
      { id: 'java-m1-d29-q1', name: 'String Pool & Immutability Architecture', type: 'concept', desc: 'Trace interned string literals in PermGen/Metaspace vs heap objects.' },
      { id: 'java-m1-d29-q2', name: 'Detective Lab: The Reference Equality Bug', type: 'detective', desc: 'Fix an authentication password verification check using == instead of .equals().' },
      { id: 'java-m1-d29-q3', name: 'Mastery Assignment: High-Speed Log File Builder with StringBuilder', type: 'assignment', desc: 'Assemble 10,000 formatted log entries measuring runtime vs naive string concatenation.' }
    ]
  },
  {
    day: 30,
    month: 1,
    blockNum: 6,
    title: '🏆 Month 1 Capstone Viva Gate: Audited Banking Transaction Validator & Architectural Defense',
    stageName: 'Stage 4: Architectural Autonomy',
    stageNum: 4,
    pedagogicalRole: 'Zero Support (Capstone Gate, Oral Defense & Production Audit)',
    spokenGoal: 'Defend your Month 1 codebase before the examination panel. Synthesize all 30 days into an audited transaction ledger validator.',
    conceptInvariant: 'A production software system is defensible: every variable has an intentional type, every boundary is guarded, and every memory cost is justified.',
    failureMode: 'Relying on magic numbers, unguarded array indices, or failing to defend stack vs heap memory decisions during oral viva.',
    tryItFriction: 'Audit the complete Capstone Validator, passing all 25 unit tests and defending memory allocation decisions.',
    socraticHints: [
      'How does your validator prevent integer overflow on large financial balances?',
      'Did you use long for balance variables and validate amount > 0 at every entrypoint?',
      'Defend why your deduplication algorithm sorts first in O(N log N) rather than using nested loops.'
    ],
    situationalPuzzle: {
      scenario: 'The Capstone Architecture Defense asks: "Why did you store transaction IDs in a contiguous primitive array instead of creating separate objects in Month 1?" What is the correct senior defense?',
      options: [
        'Because Java does not support objects.',
        'To maximize L1/L2 CPU cache line pre-fetching, eliminate 16-byte object header overhead, and guarantee zero garbage collection pressure during batch scanning.',
        'Arrays are easier to write than classes.',
        'Stack frames cannot store references.'
      ],
      answerIdx: 1,
      debrief: 'A senior engineer understands the hardware cost: contiguous primitive arrays avoid object header bloat (16 bytes per object) and pointer indirection, allowing the CPU to pre-fetch cache lines at peak hardware velocity.'
    },
    quests: [
      { id: 'java-m1-d30-q1', name: 'The Capstone Architecture Defense Viva', type: 'viva', desc: 'Defend 5 architectural trade-offs before the AI Senior Architect panel.' },
      { id: 'java-m1-d30-q2', name: 'Detective Lab: The Final Edge-Case Audit', type: 'detective', desc: 'Pass the 5 adversarial fuzz tests (empty arrays, Integer.MAX_VALUE, duplicate IDs).' },
      { id: 'java-m1-d30-q3', name: 'Mastery Assignment: Complete Capstone Ledger Validator', type: 'assignment', desc: 'Deliver production-grade, audited, zero-defect transaction validator on GitHub.' }
    ]
  }
];

export const JAVA_MONTH_2_SPECS: MasterclassDaySpec[] = [
  // ── BLOCK 7: OBJECT ENCAPSULATION & MEMORY LIFECYCLES (Days 31–35) ──
  {
    day: 31,
    month: 2,
    blockNum: 7,
    title: 'Classes, Heap Instances & Reference Pointer Mechanics',
    stageName: 'Stage 1: Mental Model Grounding',
    stageNum: 1,
    pedagogicalRole: 'High Guidance (Stack Pointers to Heap Object Graph)',
    spokenGoal: 'Transition from procedural logic to object modeling. Understand how "new" allocates heap memory and returns a reference address.',
    conceptInvariant: 'A class is a blueprint. An object is a concrete instance allocated on the JVM heap. The variable on the stack holds only the memory pointer.',
    failureMode: 'Dereferencing a reference variable holding null triggers the infamous java.lang.NullPointerException (NPE).',
    tryItFriction: 'Instantiate an Account object with "new Account()" before calling account.deposit(100) to resolve an NPE.',
    socraticHints: [
      'Why does "Account acc; acc.deposit(50);" crash on the second line?',
      'acc is declared on the stack, but what does it point to? Nothing! It is null.',
      'Assign an instance: "Account acc = new Account();"'
    ],
    situationalPuzzle: {
      scenario: 'In production, a microservice throws NullPointerException at line 84: "customer.getAddress().getCity()". Customer is not null. What caused the crash?',
      options: [
        'The city string was empty.',
        'customer.getAddress() returned null; invoking .getCity() on null threw NullPointerException.',
        'The JVM ran out of Metaspace.',
        'The customer object was garbage collected.'
      ],
      answerIdx: 1,
      debrief: 'Chained method calls fail if any intermediate reference returns null. Defensive code checks getAddress() != null before invoking downstream getters.'
    },
    quests: [
      { id: 'java-m2-d31-q1', name: 'Heap Allocation & Object Headers', type: 'concept', desc: 'Diagram 16-byte object headers (mark word, klass word) and reference pointers.' },
      { id: 'java-m2-d31-q2', name: 'Detective Lab: The Uninstantiated Pointer Trap', type: 'detective', desc: 'Track down and eliminate a NullPointerException in a user profile builder.' },
      { id: 'java-m2-d31-q3', name: 'Mastery Assignment: Core BankAccount Class Implementation', type: 'assignment', desc: 'Create BankAccount with accountId, holderName, and balance fields.' },
      { id: 'java-m2-d31-q4', name: 'Production Incident Lab: Chained Null Dereference Post-Mortem', type: 'detective', desc: "Trace NPE cascade through customer.getAddress().getCity() in production logs." }
    ]
  },
  {
    day: 32,
    month: 2,
    blockNum: 7,
    title: 'Constructors, State Initialization & The this Keyword',
    stageName: 'Stage 1: Mental Model Grounding',
    stageNum: 1,
    pedagogicalRole: 'High Guidance (Object Construction & Constructor Chaining)',
    spokenGoal: 'Master constructor mechanics: initializing fields, constructor overloading, constructor chaining with this(), and field shadowing.',
    conceptInvariant: 'Constructors guarantee that an object enters memory in a valid state. "this" refers to the current instance being initialized.',
    failureMode: 'Omitting "this." when constructor parameter names shadow field names (e.g. balance = balance) assigns the parameter to itself, leaving the field 0!',
    tryItFriction: 'Add "this." to distinguish instance fields from shadowed constructor parameters: this.balance = balance;.',
    socraticHints: [
      'Why is account.balance still 0.0 after passing 500.0 into "public Account(double balance) { balance = balance; }"?',
      'The parameter "balance" shadows the field "balance". You assigned the parameter to itself!',
      'Use the this keyword: "this.balance = balance;".'
    ],
    situationalPuzzle: {
      scenario: 'A developer tests a newly constructed Order object created with: "new Order(\"ORD-123\", 99.99)". When they inspect the object, both fields are null and 0.0. Constructor code: "Order(String id, double total) { id = id; total = total; }". What happened?',
      options: [
        'Java constructors cannot accept parameters.',
        'Parameter shadowing without "this." caused the parameters to assign to themselves, leaving the instance fields with default values.',
        'The garbage collector wiped the state.',
        'The class was not marked serializable.'
      ],
      answerIdx: 1,
      debrief: 'When parameter names match field names, they shadow the fields. Without "this.", the statement assigns the parameter to itself, leaving fields at default zero/null.'
    },
    quests: [
      { id: 'java-m2-d32-q1', name: 'Constructor Invocation Order', type: 'concept', desc: 'Trace default field zeroing -> explicit field initialization -> constructor body execution.' },
      { id: 'java-m2-d32-q2', name: 'Detective Lab: The Self-Assigning Parameter Bug', type: 'detective', desc: 'Fix constructor shadowing where newly created objects retain empty default fields.' },
      { id: 'java-m2-d32-q3', name: 'Mastery Assignment: Multi-Constructor Transaction Record', type: 'assignment', desc: 'Implement chained constructors using this() to handle default currencies and timestamps.' },
      { id: 'java-m2-d32-q4', name: 'Production Incident Lab: Uninitialized Field Audit', type: 'detective', desc: "Detect shadowed constructor parameters with static analysis linter rules." }
    ]
  },
  {
    day: 33,
    month: 2,
    blockNum: 7,
    title: 'Data Hiding: Private Fields, Defensive Getters/Setters & Immutability',
    stageName: 'Stage 1: Mental Model Grounding',
    stageNum: 1,
    pedagogicalRole: 'High Guidance (Encapsulation Invariants & Mutability Leaks)',
    spokenGoal: 'Enforce encapsulation: private fields, public getters, validating setters, and preventing external direct state mutation.',
    conceptInvariant: 'Encapsulation ensures an object controls its own state. Fields must be private, preventing outside code from violating business rules.',
    failureMode: 'Public fields allow external code to write "account.balance = -99999", bypassing all validation rules and corrupting business state.',
    tryItFriction: 'Make balance private and provide a deposit(amount) method that validates amount > 0.',
    socraticHints: [
      'Why should you never make "public double balance;" in a banking class?',
      'Because any malicious or buggy external code can directly set balance = -1000000 without calling your validation logic!',
      'Make it "private double balance;" and control access through deposit() and withdraw() methods.'
    ],
    situationalPuzzle: {
      scenario: 'An audit reveals that a rogue internal microservice set customer account balance to negative without triggering overdraft fees. Code shows "public double balance;" in the Account class. How is this prevented?',
      options: [
        'Ask developers not to modify balance.',
        'Make balance private and expose only business methods (deposit, withdraw) that strictly enforce validation rules.',
        'Recompile the code with 64-bit javac.',
        'Make balance volatile.'
      ],
      answerIdx: 1,
      debrief: 'Direct field access violates encapsulation. Private fields with controlled mutators guarantee that business rules and validation invariants are impossible to bypass.'
    },
    quests: [
      { id: 'java-m2-d33-q1', name: 'Encapsulation & Access Modifiers', type: 'concept', desc: 'Contrast private, package-private, protected, and public visibility scopes.' },
      { id: 'java-m2-d33-q2', name: 'Detective Lab: The Bypassed Invariant Audit', type: 'detective', desc: 'Refactor a class with exposed public fields into a strictly encapsulated model.' },
      { id: 'java-m2-d33-q3', name: 'Mastery Assignment: Immutable Money Value Object', type: 'assignment', desc: 'Create an immutable Money class with final amount, final currency, and no setters.' },
      { id: 'java-m2-d33-q4', name: 'Production Incident Lab: Direct State Bypass Vulnerability', type: 'detective', desc: "Close encapsulation leaks where rogue code bypassed business balance checks." }
    ]
  },
  {
    day: 34,
    month: 2,
    blockNum: 7,
    title: 'Static State (Metaspace Class Variables) vs Heap Instance State',
    stageName: 'Stage 1: Mental Model Grounding',
    stageNum: 1,
    pedagogicalRole: 'High Guidance (Shared Metaspace Memory vs Independent Heap Copies)',
    spokenGoal: 'Understand static fields: they belong to the Class in Metaspace and are shared across ALL instances. Master static constants.',
    conceptInvariant: 'A static field exists once per class in Metaspace. Modifying a static field on one instance changes it for EVERY instance in the JVM.',
    failureMode: 'Making an instance field like balance "static" causes all customers in the banking app to share the exact same balance!',
    tryItFriction: 'Remove the static keyword from an instance property so each customer has their own independent balance.',
    socraticHints: [
      'Why does Alice depositing $500 cause Bob\'s account balance to also increase by $500?',
      'Inspect the declaration: "static double balance;". Static variables are shared across ALL instances!',
      'Remove static from balance. Keep static only for class-wide constants like "static final double INTEREST_RATE".'
    ],
    situationalPuzzle: {
      scenario: 'In a multi-tenant SaaS application, User A logs in and sees User B\'s personal details. Investigation reveals: "private static String currentUserEmail;". What was the fatal bug?',
      options: [
        'SQL injection in login.',
        'static fields are shared across all instances and threads in the JVM. User B overwrote the static variable for all active sessions.',
        'The session cookie expired.',
        'Garbage collection paused.'
      ],
      answerIdx: 1,
      debrief: 'static variables are global class state. Storing user-specific session data in static fields creates critical security leaks where all users share the same data.'
    },
    quests: [
      { id: 'java-m2-d34-q1', name: 'Metaspace Memory & Static Lifecycles', type: 'concept', desc: 'Trace how ClassLoader allocates static fields when a class is loaded into Metaspace.' },
      { id: 'java-m2-d34-q2', name: 'Detective Lab: The Global Data Leak Disaster', type: 'detective', desc: 'Identify and remove inappropriate static state causing cross-tenant data corruption.' },
      { id: 'java-m2-d34-q3', name: 'Mastery Assignment: Thread-Safe Global Sequence Generator', type: 'assignment', desc: 'Implement unique transaction ID generator using private static long counter.' },
      { id: 'java-m2-d34-q4', name: 'Production Incident Lab: Multi-Tenant Static State Leak', type: 'detective', desc: "Eliminate shared static session variables exposing cross-tenant user data." }
    ]
  },
  {
    day: 35,
    month: 2,
    blockNum: 7,
    title: '⭐ Milestone 6: Enterprise Bank Account Domain Model with Invariant Guards',
    stageName: 'Stage 2: Defensive Fluency',
    stageNum: 2,
    pedagogicalRole: 'Balanced Friction (Milestone 6 Integration)',
    spokenGoal: 'Synthesize encapsulation, constructors, static counters, and validation into a robust corporate banking domain model.',
    conceptInvariant: 'A domain model protects its integrity: balances never go below credit limits, IDs are immutable, and mutations emit transaction events.',
    failureMode: 'Allowing withdrawal to proceed when balance - amount < overdraftLimit creates unauthorized credit exposure.',
    tryItFriction: 'Enforce overdraft limits inside withdraw(amount) by rejecting transactions that exceed credit bounds.',
    socraticHints: [
      'What check must occur before subtracting amount from balance?',
      'Verify that (balance - amount) >= -overdraftLimit.',
      'If insufficient funds, throw an InsufficientFundsException with current balance details.'
    ],
    situationalPuzzle: {
      scenario: 'A banking domain model allows an account with a $500 overdraft limit to withdraw $600 from a $0 balance. What defensive guard was missing?',
      options: [
        'The withdrawal method lacked a boundary check: balance - amount >= -overdraftLimit.',
        'The customer lacked an account ID.',
        'The database connection dropped.',
        'The amount variable was a double instead of int.'
      ],
      answerIdx: 0,
      debrief: 'Domain models must defend operational invariants. If withdrawal logic omits boundary checks against overdraft limits, arbitrary unauthorized debt accumulates.'
    },
    quests: [
      { id: 'java-m2-d35-q1', name: 'Domain Model Invariant Architecture', type: 'concept', desc: 'Design domain models that guarantee 100% internal consistency at all times.' },
      { id: 'java-m2-d35-q2', name: 'Detective Lab: The Overdraft Breach Vulnerability', type: 'detective', desc: 'Add strict boundary checks preventing unauthorized overdraft extraction.' },
      { id: 'java-m2-d35-q3', name: 'Mastery Assignment: Multi-Account Transfer Coordinator', type: 'assignment', desc: 'Safely transfer funds between two BankAccount instances with atomicity.' },
      { id: 'java-m2-d35-m6', name: '⭐ Milestone 6: Enterprise Bank Account Domain Engine', type: 'milestone', desc: 'Complete enterprise model with audit trails, interest calculation, and tier guards.' }
    ]
  },

  // ── BLOCK 8: INHERITANCE, DYNAMIC DISPATCH & INTERFACE CONTRACTS (Days 36–40) ──
  {
    day: 36,
    month: 2,
    blockNum: 8,
    title: 'Inheritance Hierarchies — extends, super Constructor Chaining & Code Reuse',
    stageName: 'Stage 2: Defensive Fluency',
    stageNum: 2,
    pedagogicalRole: 'Balanced Friction (Subclassing & Superclass State Initialization)',
    spokenGoal: 'Master class inheritance using extends, constructor chaining with super(), and the "is-a" relationship.',
    conceptInvariant: 'A subclass constructor MUST invoke a superclass constructor on its very first line (either implicitly or via super()).',
    failureMode: 'Calling super() on line 2 after executing subclass statements triggers compile error "call to super must be first statement in constructor".',
    tryItFriction: 'Move super(accountId, initialBalance) to the very first line of the SavingsAccount constructor.',
    socraticHints: [
      'Why is the compiler rejecting super(...) on line 5?',
      'The JVM specification requires the parent class to initialize its memory before the child class initializes its own fields.',
      'Move "super(...);" to line 1 of the constructor body.'
    ],
    situationalPuzzle: {
      scenario: 'A subclass constructor performs: "this.interestRate = 0.05; super(name);". javac throws "call to super must be first statement in constructor". Why does Java enforce this strict rule?',
      options: [
        'It is an arbitrary stylistic choice.',
        'The parent class memory layout must be initialized before the child class can safely execute any code or reference parent fields.',
        'Constructors cannot be inherited.',
        'The subclass must be marked abstract.'
      ],
      answerIdx: 1,
      debrief: 'Parent class fields must be constructed before child code executes. Placing super() anywhere other than line 1 risks accessing uninitialized parent state.'
    },
    quests: [
      { id: 'java-m2-d36-q1', name: 'Superclass Constructor Chaining', type: 'concept', desc: 'Trace Object -> Parent -> Child constructor execution sequence in memory.' },
      { id: 'java-m2-d36-q2', name: 'Detective Lab: The Misplaced Super Constructor', type: 'detective', desc: 'Fix constructor ordering in a specialized corporate account hierarchy.' },
      { id: 'java-m2-d36-q3', name: 'Mastery Assignment: Specialized Account Hierarchy', type: 'assignment', desc: 'Create SavingsAccount (with interest) and CheckingAccount (with overdraft) extending BankAccount.' },
      { id: 'java-m2-d36-q4', name: 'Production Incident Lab: Partial Subclass Construction Crash', type: 'detective', desc: "Debug uninitialized parent state accessed by prematurely invoked virtual methods." }
    ]
  },
  {
    day: 37,
    month: 2,
    blockNum: 8,
    title: 'Method Overriding, @Override, Virtual Method Tables (vtable) & Dynamic Dispatch',
    stageName: 'Stage 2: Defensive Fluency',
    stageNum: 2,
    pedagogicalRole: 'Balanced Friction (Runtime Polymorphism & vtable Lookups)',
    spokenGoal: 'Master method overriding, the @Override annotation, and understand runtime dynamic method dispatch via vtables.',
    conceptInvariant: 'When invoking an overridden method on a parent reference (Account acc = new SavingsAccount()), the JVM invokes the RUNTIME subtype version.',
    failureMode: 'Misspelling an overridden method name without @Override accidentally creates a brand-new method, losing polymorphic behavior.',
    tryItFriction: 'Add the @Override annotation to catch a signature typo (withDraw vs withdraw) at compile time.',
    socraticHints: [
      'Why did SavingsAccount call the parent withdraw() instead of its specialized overdraft-checking logic?',
      'Check spelling: the child declared "withDraw" with a capital D. It overloaded instead of overriding!',
      'Add @Override above the method. The compiler will immediately flag if it does not match a parent method.'
    ],
    situationalPuzzle: {
      scenario: 'Given: "Account acc = new SavingsAccount(); acc.applyMonthlyFee();". SavingsAccount overrides applyMonthlyFee(). The compiler looks at Account, finds the method, and compiles. At runtime, which method runs?',
      options: [
        'Account.applyMonthlyFee() because the reference type is Account.',
        'SavingsAccount.applyMonthlyFee() because Java uses runtime dynamic method dispatch based on actual heap object type.',
        'Both methods run in parallel.',
        'Compilation fails.'
      ],
      answerIdx: 1,
      debrief: 'Java uses dynamic dispatch. The compiler verifies the method exists on the reference type (Account), but the runtime executes the method from the actual object in heap (SavingsAccount).'
    },
    quests: [
      { id: 'java-m2-d37-q1', name: 'Virtual Method Table (vtable) Mechanics', type: 'concept', desc: 'Inspect how the JVM uses vtable pointer offsets for O(1) dynamic dispatch.' },
      { id: 'java-m2-d37-q2', name: 'Detective Lab: The Silent Signature Typo', type: 'detective', desc: 'Use @Override to expose and fix a method signature that failed to override.' },
      { id: 'java-m2-d37-q3', name: 'Mastery Assignment: Polymorphic Statement Generator', type: 'assignment', desc: 'Iterate an array of Account references, calling polymorphic generateStatement() on each.' },
      { id: 'java-m2-d37-q4', name: 'Production Incident Lab: The Accidental Overload Outage', type: 'detective', desc: "Detect missing @Override annotations that broke payment fee calculation." }
    ]
  },
  {
    day: 38,
    month: 2,
    blockNum: 8,
    title: 'The Universal Object Contract: equals(), hashCode(), and Reference Identity (==)',
    stageName: 'Stage 2: Defensive Fluency',
    stageNum: 2,
    pedagogicalRole: 'Balanced Friction (Object Identity vs Logical Equivalence & Hash Invariants)',
    spokenGoal: 'Master java.lang.Object core methods. Understand why overriding equals() requires overriding hashCode(), and the catastrophic consequences of breaking this contract.',
    conceptInvariant: 'If two objects are equal according to equals(Object), calling hashCode() on each must produce the exact same integer value. == compares memory addresses; equals() compares field values.',
    failureMode: 'Failing to override hashCode() when overriding equals() causes HashSet and HashMap to duplicate keys or return null on lookups of mathematically identical objects.',
    tryItFriction: 'Override both equals() and hashCode() on an AccountKey class so that set.contains(new AccountKey("ACC-101")) correctly evaluates to true.',
    socraticHints: [
      'Why does set.contains(new AccountKey("ACC-101")) return false even though an AccountKey with "ACC-101" was already added?',
      'Because without overriding hashCode(), Java uses System.identityHashCode (memory address). The two instances land in completely different hash buckets!',
      'Implement consistent equals() and Objects.hash(id) to ensure identical keys map to the exact same bucket.'
    ],
    situationalPuzzle: {
      scenario: 'An engineer creates a class CurrencyPair { String base; String quote; } and overrides equals() but forgets hashCode(). They add 10,000 rates to a HashMap<CurrencyPair, Double>. What happens when they query map.get(new CurrencyPair("USD", "EUR"))?',
      options: [
        'It works with 100% reliability.',
        'It returns null almost every time because the lookup checks the wrong bucket based on memory address instead of fields.',
        'The JVM throws an IllegalStateException.',
        'HashMap automatically generates a hashCode.'
      ],
      answerIdx: 1,
      debrief: 'The HashMap uses hashCode() to locate the bucket array index. If hashCode() is not overridden, two logically identical objects produce different hash codes and land in different buckets, making retrieval impossible.'
    },
    quests: [
      { id: 'java-m2-d38-q1', name: 'The equals() and hashCode() Mathematical Contract', type: 'concept', desc: 'Trace hash bucket routing and proof of why equal objects must produce identical hash codes.' },
      { id: 'java-m2-d38-q2', name: 'Detective Lab: The Phantom Key in the HashMap', type: 'detective', desc: 'Diagnose and fix a broken equals/hashCode implementation causing lost lookups in a cache.' },
      { id: 'java-m2-d38-q3', name: 'Mastery Assignment: Bulletproof Domain Entity Identity', type: 'assignment', desc: 'Implement consistent equals(), hashCode(), and toString() with defensive null handling on AccountId.' },
      { id: 'java-m2-d38-q4', name: 'Production Incident Lab: Memory Address Hash Code Outage', type: 'detective', desc: "Resolve a critical billing duplicate-payment bug caused by default identityHashCode in hash sets." }
    ]
  },
  {
    day: 39,
    month: 2,
    blockNum: 8,
    title: 'Abstract Classes vs Interfaces & Default Method Contract Evolution',
    stageName: 'Stage 2: Defensive Fluency',
    stageNum: 2,
    pedagogicalRole: 'Balanced Friction (Decoupled Contracts & Abstract Template Methods)',
    spokenGoal: 'Master the architectural distinction between abstract classes (partial state & template workflows) and interfaces (pure behavioral contracts & default methods).',
    conceptInvariant: 'A class can extend only ONE abstract superclass (sharing state/vtable), but can implement MULTIPLE interfaces (multiple typing). Interfaces decouple what code does from how it is done.',
    failureMode: 'A class implementing an interface failing to declare implemented methods as "public" triggers "cannot reduce visibility".',
    tryItFriction: 'Add the public access modifier to methods implementing an interface contract and resolve diamond default method conflicts.',
    socraticHints: [
      'All methods in an interface are implicitly public. What happens if your class implements them as package-private (without public)?',
      'Java forbids reducing the visibility of an inherited method!',
      'Add "public" to the method declaration in your implementing class.'
    ],
    situationalPuzzle: {
      scenario: 'A microservice needs to audit, serialize, and process financial trades. In Java, can a Trade class extend three different classes (Auditable, Serializable, Processable)?',
      options: [
        'Yes, Java supports multiple class inheritance.',
        'No, Java permits single class inheritance, but Trade can implement all three interfaces (Auditable, Serializable, Processable).',
        'Trade must be an abstract class.',
        'Interfaces cannot be combined.'
      ],
      answerIdx: 1,
      debrief: 'Java prevents multiple inheritance of state (classes) to avoid the Diamond Problem, but permits multiple inheritance of type (interfaces).'
    },
    quests: [
      { id: 'java-m2-d39-q1', name: 'Interface Decoupling & Loose Coupling', type: 'concept', desc: 'Understand why programming to interfaces (List vs ArrayList) creates maintainable architectures.' },
      { id: 'java-m2-d39-q2', name: 'Detective Lab: The Reduced Visibility Violation', type: 'detective', desc: 'Fix access modifier compilation errors in an interface implementation.' },
      { id: 'java-m2-d39-q3', name: 'Mastery Assignment: Multi-Interface Auditable Entity', type: 'assignment', desc: 'Implement Auditable, Validatable, and Persistable across order domain objects.' },
      { id: 'java-m2-d39-q4', name: 'Production Incident Lab: Diamond Default Method Resolution', type: 'detective', desc: "Resolve conflicting default methods across dual interfaces using explicit super-syntax." }
    ]
  },
  {
    day: 40,
    month: 2,
    blockNum: 8,
    title: '⭐ Milestone 7: Pluggable Multi-Provider Payment Gateway Interface Engine',
    stageName: 'Stage 2: Defensive Fluency',
    stageNum: 2,
    pedagogicalRole: 'Balanced Friction (Milestone 7 Integration)',
    spokenGoal: 'Architect an enterprise pluggable payment engine supporting Stripe, PayPal, and WireTransfer via a unified PaymentProcessor interface.',
    conceptInvariant: 'The checkout system depends strictly on the PaymentProcessor interface, remaining 100% unaware of concrete vendor classes.',
    failureMode: 'Hardcoding "new StripeProcessor()" directly inside the checkout cart couples business logic to a single vendor.',
    tryItFriction: 'Inject PaymentProcessor interface into CheckoutService via constructor dependency injection.',
    socraticHints: [
      'If CheckoutService writes "new StripeProcessor()", what happens when the business wants to switch to PayPal?',
      'You have to modify and recompile CheckoutService! That violates the Open/Closed Principle.',
      'Pass PaymentProcessor into CheckoutService constructor: public CheckoutService(PaymentProcessor processor) { ... }.'
    ],
    situationalPuzzle: {
      scenario: 'An e-commerce checkout service needs to support adding new crypto payment providers without changing a single line of existing checkout logic. What architectural principle and tool achieves this?',
      options: [
        'Using a giant switch statement inside CheckoutService.',
        'The Dependency Inversion Principle using a PaymentProcessor interface and constructor injection.',
        'Making all classes static.',
        'Storing payments in a global text file.'
      ],
      answerIdx: 1,
      debrief: 'Dependency Inversion states high-level modules should not depend on low-level modules; both should depend on abstractions (interfaces). New providers plug in with zero changes to checkout logic.'
    },
    quests: [
      { id: 'java-m2-d40-q1', name: 'Dependency Inversion & Interface Contracts', type: 'concept', desc: 'Diagram loosely coupled service layers interacting across interface boundaries.' },
      { id: 'java-m2-d40-q2', name: 'Detective Lab: The Hardcoded Vendor Coupling', type: 'detective', desc: 'Decouple a hardcoded payment processor using interface abstraction.' },
      { id: 'java-m2-d40-q3', name: 'Mastery Assignment: Mock Payment Gateway Test Double', type: 'assignment', desc: 'Implement MockPaymentProcessor for zero-network automated unit testing.' },
      { id: 'java-m2-d40-m7', name: '⭐ Milestone 7: Pluggable Enterprise Payment Gateway Engine', type: 'milestone', desc: 'Deliver multi-provider routing (Stripe, PayPal, Mock) with retry policies.' }
    ]
  },

  // ── BLOCK 9: DEFENSIVE ARCHITECTURE, EXCEPTIONS & RESOURCE LIFECYCLES (Days 41–45) ──
  {
    day: 41,
    month: 2,
    blockNum: 9,
    title: 'JVM Throwable Hierarchy: Throwable, Error, Exception & RuntimeException',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Checked vs Unchecked Exception Architecture)',
    spokenGoal: 'Master the exception tree: Error (JVM fatal), Exception (Checked - must handle), RuntimeException (Unchecked - programming bugs).',
    conceptInvariant: 'Checked exceptions force compile-time handling (try-catch or throws). Unchecked exceptions represent recoverable runtime bugs.',
    failureMode: 'Catching java.lang.Error (like OutOfMemoryError) prevents the JVM from shutting down cleanly when resources are exhausted.',
    tryItFriction: 'Refactor "catch (Throwable t)" to "catch (Exception e)" so fatal JVM errors are not silently swallowed.',
    socraticHints: [
      'Why is catching Throwable or Error considered dangerous in production?',
      'If the JVM runs out of memory (OutOfMemoryError) or suffers StackOverflowError, catching it leaves the system in a corrupted zombie state.',
      'Catch specific business exceptions or at most Exception, never Throwable or Error.'
    ],
    situationalPuzzle: {
      scenario: 'A junior developer wraps an entire microservice main loop in: "try { ... } catch (Throwable t) { log.error(\"Error\"); }". During an OOM event, the service stays alive but drops all requests. Why?',
      options: [
        'Linux kernel bug.',
        'Catching Throwable caught OutOfMemoryError, preventing the JVM from crashing and restarting, leaving it in a degraded zombie state.',
        'Throwable is only for network errors.',
        'The garbage collector stopped running.'
      ],
      answerIdx: 1,
      debrief: 'Never catch Throwable or Error. Errors indicate unrecoverable JVM conditions. Swallowing them prevents orchestrators (Kubernetes/Docker) from detecting crashes and restarting the pod.'
    },
    quests: [
      { id: 'java-m2-d41-q1', name: 'Throwable Type Taxonomy', type: 'concept', desc: 'Map Checked Exceptions vs RuntimeException vs VirtualMachineError.' },
      { id: 'java-m2-d41-q2', name: 'Detective Lab: The Swallowed OOM Zombie Trap', type: 'detective', desc: 'Eliminate catch(Throwable) anti-patterns across a server worker loop.' },
      { id: 'java-m2-d41-q3', name: 'Mastery Assignment: Custom Banking Exception Hierarchy', type: 'assignment', desc: 'Build BankingException base with InsufficientFundsException and AccountFrozenException.' },
      { id: 'java-m2-d41-q4', name: 'Production Incident Lab: The Swallowed OOM Zombie Outage', type: 'detective', desc: "Remove catch(Throwable) blocks keeping crashed JVM pods alive in Kubernetes." }
    ]
  },
  {
    day: 42,
    month: 2,
    blockNum: 9,
    title: 'Defensive Error Recovery: try-catch-finally Blocks & Exception Propagation',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Stack Unwinding & Finally Execution Guarantees)',
    spokenGoal: 'Master try-catch-finally execution: stack unwinding, multi-catch blocks, and the guarantee that finally ALWAYS runs.',
    conceptInvariant: 'The finally block executes whether an exception was thrown, caught, or not thrown — even if a return statement was executed!',
    failureMode: 'Putting a return statement inside a finally block silently discards exceptions thrown in the try block, masking critical bugs.',
    tryItFriction: 'Remove return statements from inside finally blocks so active exceptions propagate properly.',
    socraticHints: [
      'What happens if the try block throws an exception, but the finally block executes "return 0;"?',
      'The return in finally completely swallows and discards the exception, pretending everything succeeded!',
      'Never put a return statement inside a finally block.'
    ],
    situationalPuzzle: {
      scenario: 'A transaction method throws InsufficientFundsException in the try block. The finally block contains "return true;". What does the caller receive?',
      options: [
        'The InsufficientFundsException.',
        'true! The return statement in finally suppresses the pending exception and returns true to the caller.',
        'Compile error.',
        'NullPointerException.'
      ],
      answerIdx: 1,
      debrief: 'A return in a finally block aborts any in-flight exception and forces an immediate normal return, creating a catastrophic silent failure.'
    },
    quests: [
      { id: 'java-m2-d42-q1', name: 'Stack Unwinding & Finally Guarantees', type: 'concept', desc: 'Trace JVM bytecode jsr / ret instructions executing finally blocks.' },
      { id: 'java-m2-d42-q2', name: 'Detective Lab: The Masked Exception Anomaly', type: 'detective', desc: 'Identify how a return in finally masked a database authentication failure.' },
      { id: 'java-m2-d42-q3', name: 'Mastery Assignment: Resilient Transaction Processor with Clean Rollback', type: 'assignment', desc: 'Implement try-catch-finally ensuring ledger locks release even on crash.' },
      { id: 'java-m2-d42-q4', name: 'Production Incident Lab: Masked Exception Discovery in Finally', type: 'detective', desc: "Audit and remove return statements inside finally blocks swallowing errors." }
    ]
  },
  {
    day: 43,
    month: 2,
    blockNum: 9,
    title: 'Resource Lifecycles: AutoCloseable, try-with-resources & Custom Fault Taxonomies',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Resource Leak Prevention & Domain Exceptions)',
    spokenGoal: 'Master deterministic resource teardown using AutoCloseable and try-with-resources, alongside strongly-typed custom business exception hierarchies.',
    conceptInvariant: 'Any resource opened in try(Resource r = ...) is guaranteed to close even if an exception is thrown. Domain exceptions must carry actionable context (errorCode, entityId).',
    failureMode: 'Swallowing exceptions or failing to close OS file descriptors and socket handles causes process resource exhaustion (Too many open files).',
    tryItFriction: 'Refactor a fragile manual stream close in finally into a try-with-resources block with custom InsufficientFundsException handling.',
    socraticHints: [
      'What happens if reader.close() in a finally block throws an IOException? Does writer.close() on the next line ever execute?',
      'No! The exception on line 1 aborts the finally block, leaking the writer file descriptor!',
      'Use try (Reader r = ...; Writer w = ...) { ... } so the JVM closes both safely and suppresses secondary errors.'
    ],
    situationalPuzzle: {
      scenario: 'A payment API returns HTTP 500 on invalid credit card numbers because the service throws raw RuntimeException("bad card"). How does a senior team refactor this?',
      options: [
        'Catch all RuntimeExceptions and return HTTP 200.',
        'Define a specific InvalidCardException with an error code enum, allowing the controller to return a clean HTTP 400 Bad Request.',
        'Disable credit card validation.',
        'Use System.exit(1).'
      ],
      answerIdx: 1,
      debrief: 'Strongly-typed custom exceptions allow higher layers (API controllers) to cleanly map domain failures to client status codes (HTTP 400 vs 500).'
    },
    quests: [
      { id: 'java-m2-d43-q1', name: 'Domain Exception Modeling & AutoCloseable', type: 'concept', desc: 'Design exception classes that preserve structural evidence and implement deterministic cleanup.' },
      { id: 'java-m2-d43-q2', name: 'Detective Lab: The Leaking OS File Descriptor Outage', type: 'detective', desc: 'Refactor a legacy manual finally close into a bulletproof try-with-resources statement.' },
      { id: 'java-m2-d43-q3', name: 'Mastery Assignment: Complete Financial Error Hierarchy', type: 'assignment', desc: 'Build InvalidCurrencyException, LimitExceededException, and AccountSuspendedException.' },
      { id: 'java-m2-d43-q4', name: 'Production Incident Lab: Suppressed Exception Telemetry', type: 'detective', desc: "Extract suppressed exceptions from try-with-resources to capture root-cause telemetry." }
    ]
  },
  {
    day: 44,
    month: 2,
    blockNum: 9,
    title: 'JVM Garbage Collection Anatomy & Diagnosing Real Memory Leaks',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Generational GC, GC Roots & Heap Dump Analysis)',
    spokenGoal: 'Master JVM Garbage Collection: the generational hypothesis (Eden, Survivor S0/S1, Old Gen), GC Roots, stop-the-world pauses, and how Java leaks memory via unclosed roots.',
    conceptInvariant: 'Objects are eligible for GC when they are unreachable from any GC Root (thread stack frames, static variables, active JNI handles). Static collections never die and cause real memory leaks.',
    failureMode: 'Appending objects into a static collection (e.g. static List<UserSession>) without removal prevents GC collection and triggers java.lang.OutOfMemoryError: Java heap space.',
    tryItFriction: 'Identify and fix a memory leak where an unclosed listener or static cache continually retains uncollectible heap objects.',
    socraticHints: [
      'If Java has automatic garbage collection, how did the application run out of memory (java.lang.OutOfMemoryError)?',
      'Because the GC only reclaims UNREACHABLE objects! If a static List holds a pointer to an object, that object is permanently reachable.',
      'Clear the static reference or use a bounded cache with eviction (e.g. WeakHashMap or LRU) to let the GC reclaim memory.'
    ],
    situationalPuzzle: {
      scenario: 'A production financial microservice experiences 4-second latency freezes every 10 minutes. A heap dump reveals 95% of the heap is full of old-generation session objects. What is occurring?',
      options: [
        'The CPU clock is drifting.',
        'A Full GC (Stop-The-World pause) is struggling to collect lingering reachable objects in the Tenured Old Gen, freezing all application worker threads.',
        'Java bytecodes are corrupt.',
        'Network cables are disconnected.'
      ],
      answerIdx: 1,
      debrief: 'Full GC pauses freeze all application threads while traversing the old-generation object graph. Memory leaks that promote dead objects to old generation cause catastrophic latency spikes.'
    },
    quests: [
      { id: 'java-m2-d44-q1', name: 'Generational GC Mechanics & GC Roots', type: 'concept', desc: 'Trace Eden space allocation, minor GC promotions, and mark-sweep-compact in the Tenured generation.' },
      { id: 'java-m2-d44-q2', name: 'Detective Lab: The Static Collection Leak Outage', type: 'detective', desc: 'Locate a static map holding disconnected socket sessions and apply eviction cleanup.' },
      { id: 'java-m2-d44-q3', name: 'Mastery Assignment: Heap Dump Inspection & Memory Profiling', type: 'assignment', desc: 'Simulate high memory churn and verify clean garbage collection using runtime memory telemetry.' },
      { id: 'java-m2-d44-q4', name: 'Production Incident Lab: The Stop-The-World Full GC Freeze', type: 'detective', desc: "Diagnose an enterprise JVM latency incident using GC log flags (-Xlog:gc) and fix root cause." }
    ]
  },
  {
    day: 45,
    month: 2,
    blockNum: 9,
    title: '⭐ Milestone 8: Resilient Order File Ingestion Engine with Auto-Rollback',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Milestone 8 Integration)',
    spokenGoal: 'Build an enterprise file ingestion engine: read CSV order batches, validate fields, handle line errors, and rollback on batch failure.',
    conceptInvariant: 'Batch file ingestion must be atomic: if record #500 fails critical validation, prior processed records must be rolled back.',
    failureMode: 'Partially writing records to the database and crashing halfway leaves the ledger in an un-auditable, torn state.',
    tryItFriction: 'Implement transactional rollback in the catch block to revert staged orders if file parsing fails.',
    socraticHints: [
      'What happens if an order batch of 10 items succeeds for items 1-4, but item 5 has an invalid currency?',
      'Items 1-4 cannot remain committed if the batch was supposed to be all-or-nothing!',
      'Call rollback() in your catch block to revert items 1-4.'
    ],
    situationalPuzzle: {
      scenario: 'During a payroll file upload of 500 salaries, the server loses network connection at record 250. Employees 1–250 received payments, but 251–500 did not. The system cannot re-run without paying the first 250 twice. What architectural failure occurred?',
      options: [
        'Network provider outage.',
        'Lack of transactional atomicity and rollback mechanics in the batch processing engine.',
        'CSV file format was too large.',
        'Garbage collection paused.'
      ],
      answerIdx: 1,
      debrief: 'All-or-nothing batch operations require ACID transaction boundaries. Either all 500 records commit, or the entire batch rolls back to the initial state.'
    },
    quests: [
      { id: 'java-m2-d45-q1', name: 'Atomic Batch Ingestion Architecture', type: 'concept', desc: 'Design two-phase staging and commit pipelines for file ingestion.' },
      { id: 'java-m2-d45-q2', name: 'Detective Lab: The Torn Batch Ingestion Crash', type: 'detective', desc: 'Implement rollback mechanisms when a corrupted line aborts batch processing.' },
      { id: 'java-m2-d45-q3', name: 'Mastery Assignment: Dead-Letter Queue Order Ingestor', type: 'assignment', desc: 'Route corrupted order lines to a dead-letter log while processing valid lines.' },
      { id: 'java-m2-d45-m8', name: '⭐ Milestone 8: Resilient Enterprise Batch Ingestion Engine', type: 'milestone', desc: 'Deliver production CSV order parser with AutoCloseable resources and auto-rollback.' }
    ]
  },

  // ── BLOCK 10: JAVA GENERICS, DYNAMIC COLLECTIONS & HASHING (Days 46–50) ──
  {
    day: 46,
    month: 2,
    blockNum: 10,
    title: 'Generics <T>, Compile-Time Type Safety & Type Erasure Mechanics',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Parametric Polymorphism & Type Erasure)',
    spokenGoal: 'Master Java Generics: writing reusable type-safe classes (Box<T>, Result<T, E>) and understanding Type Erasure.',
    conceptInvariant: 'Generics exist strictly at COMPILE TIME. The JVM erases type parameters (<T> becomes Object) for backwards compatibility.',
    failureMode: 'Using raw types (e.g. ArrayList instead of ArrayList<String>) permits accidental insertion of integers, throwing ClassCastException at runtime.',
    tryItFriction: 'Parameterize a raw collection with strong types (List<Order>) to eliminate runtime ClassCastExceptions.',
    socraticHints: [
      'Why is using raw "List list = new ArrayList();" dangerous in modern Java?',
      'Because you can put a String and an Integer in the same list! When you cast to String later, it crashes with ClassCastException.',
      'Always supply type arguments: List<String> list = new ArrayList<>();.'
    ],
    situationalPuzzle: {
      scenario: 'In Java, why can you NOT do "new T()" or "new T[10]" inside a generic class "class Repository<T>"?',
      options: [
        'T is a reserved keyword in Java.',
        'Because of Type Erasure: at runtime, the JVM has erased T to Object and does not know what concrete class T represents.',
        'Generics only support primitive types.',
        'Heap allocation requires interfaces.'
      ],
      answerIdx: 1,
      debrief: 'Type Erasure removes generic type metadata at runtime. The bytecode only knows about Object (or the upper bound), so the JVM cannot instantiate an unknown type T.'
    },
    quests: [
      { id: 'java-m2-d46-q1', name: 'Type Erasure & Bytecode Bridge Methods', type: 'concept', desc: 'Inspect how javac generates casts and synthetic bridge methods during compilation.' },
      { id: 'java-m2-d46-q2', name: 'Detective Lab: The Raw Type ClassCast Disaster', type: 'detective', desc: 'Eliminate raw type usage across an enterprise repository layer.' },
      { id: 'java-m2-d46-q3', name: 'Mastery Assignment: Generic Result<T, E> Monad Container', type: 'assignment', desc: 'Build functional Result<T, E> with Success and Failure states.' },
      { id: 'java-m2-d46-q4', name: 'Production Incident Lab: Raw Type Infiltration Audit', type: 'detective', desc: "Eliminate raw collection types throwing ClassCastException in production." }
    ]
  },
  {
    day: 47,
    month: 2,
    blockNum: 10,
    title: 'ArrayList<T> Internals: Dynamic Amortized Growth, Array Copy & Capacity Sizing',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Amortized O(1) & 1.5x Array Reallocation Cost)',
    spokenGoal: 'Master ArrayList internals: backing Object[] array, default capacity (10), growth factor (1.5x), and pre-sizing capacity.',
    conceptInvariant: 'ArrayList appends in amortized O(1) time. When full, it allocates a new array of size (oldCapacity + oldCapacity >> 1) and copies elements.',
    failureMode: 'Adding 1,000,000 items to an ArrayList initialized with default capacity (10) triggers ~35 array reallocations and copies 3M elements.',
    tryItFriction: 'Pre-size ArrayList with "new ArrayList<>(expectedSize)" to eliminate 30+ redundant array copy allocations.',
    socraticHints: [
      'If you know you are loading 100,000 records from a file, why is "new ArrayList<>()" slow?',
      'Because it starts at size 10, then grows to 15, 22, 33... allocating and copying memory over and over!',
      'Pre-allocate capacity: "new ArrayList<>(100_000);".'
    ],
    situationalPuzzle: {
      scenario: 'Profiling a high-throughput ingestion service shows 40% of CPU time spent in Arrays.copyOf() during ArrayList.add(). How does an engineer fix this with a single line change?',
      options: [
        'Switch to a linked list.',
        'Pre-size the ArrayList capacity in constructor: new ArrayList<>(expectedBatchSize).',
        'Call System.gc() before every add.',
        'Make the ArrayList static.'
      ],
      answerIdx: 1,
      debrief: 'Pre-sizing eliminates repeated array allocations and memory copying. Sizing capacity upfront guarantees that add() runs in pure O(1) time without copying.'
    },
    quests: [
      { id: 'java-m2-d47-q1', name: 'ArrayList Growth Calculus', type: 'concept', desc: 'Calculate exact growth sequence: 10 -> 15 -> 22 -> 33 -> 49 -> 73...' },
      { id: 'java-m2-d47-q2', name: 'Detective Lab: The Reallocation Storm Bottleneck', type: 'detective', desc: 'Profile and eliminate unnecessary memory copying during batch imports.' },
      { id: 'java-m2-d47-q3', name: 'Mastery Assignment: Custom Resizable Array List Implementation', type: 'assignment', desc: 'Build MyArrayList<T> with add(), get(), remove(), and 1.5x dynamic growth.' },
      { id: 'java-m2-d47-q4', name: 'Production Incident Lab: Reallocation Storm Memory Profile', type: 'detective', desc: "Pre-size ArrayList capacities to eliminate GC pauses during 1M batch imports." }
    ]
  },
  {
    day: 48,
    month: 2,
    blockNum: 10,
    title: 'HashMap<K, V> Deep Dive: Hash Codes, Buckets, Collision Chains & Red-Black Tree Binning',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Hash Distribution, hashCode() & equals() Contract)',
    spokenGoal: 'Master HashMap internals: hash calculation, bucket index masking ((n - 1) & hash), linked-list collision chains, and Java 8 treeification (TreeNode).',
    conceptInvariant: 'If two objects are equal according to equals(), they MUST return the exact same hashCode(). Violating this loses objects in HashMaps.',
    failureMode: 'Overriding equals() without overriding hashCode() causes map.get(key) to return null even when the key was previously put into the map!',
    tryItFriction: 'Implement both equals() and hashCode() consistently on a custom AccountId key class.',
    socraticHints: [
      'Why does map.get(new AccountId("ACC-1")) return null even though you called map.put(new AccountId("ACC-1"), 500)?',
      'The two AccountId objects have different hashCode() values because you didn\'t override hashCode()! The map looked in the wrong bucket.',
      'Override both equals() and hashCode() using Objects.hash(id).'
    ],
    situationalPuzzle: {
      scenario: 'A developer creates a HashMap with 100,000 entries. Every lookup takes 50 milliseconds ($O(N)$ linear time). Profiling shows all 100,000 keys return hashCode() = 1. What happened?',
      options: [
        'The JVM crashed.',
        'Catastrophic hash collision: all keys landed in bucket #1, collapsing the map into a single linked list / tree chain.',
        'HashMap is inherently $O(N)$ for large datasets.',
        'Garbage collection paused.'
      ],
      answerIdx: 1,
      debrief: 'A degenerate hashCode() implementation that returns a constant puts all entries into a single bucket. Lookup collapses from $O(1)$ to $O(N)$ (or $O(\log N)$ in Java 8 tree bins).'
    },
    quests: [
      { id: 'java-m2-d48-q1', name: 'HashMap Bucket Masking & Collision Resolution', type: 'concept', desc: 'Trace how (n - 1) & hash distributes entries across power-of-two table buckets.' },
      { id: 'java-m2-d48-q2', name: 'Detective Lab: The Broken HashCode Invariant', type: 'detective', desc: 'Fix a custom domain key where map lookups return null due to mismatched hash codes.' },
      { id: 'java-m2-d48-q3', name: 'Mastery Assignment: In-Memory Key-Value Store with TTL Eviction', type: 'assignment', desc: 'Build ExpiringHashMap<K, V> with timestamp-based automatic expiration.' },
      { id: 'java-m2-d48-q4', name: 'Production Incident Lab: HashCode Invariant Violation Post-Mortem', type: 'detective', desc: "Debug disappearing keys in HashMaps caused by inconsistent equals/hashCode." }
    ]
  },
  {
    day: 49,
    month: 2,
    blockNum: 10,
    title: 'HashSet<T>, Comparable<T> vs Comparator<T> Lambda Custom Sorting',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Natural Ordering vs External Custom Sorting)',
    spokenGoal: 'Master HashSet (backed by HashMap), TreeSet (balanced red-black tree), Comparable (compareTo natural order), and Comparator lambdas.',
    conceptInvariant: 'Comparable defines an object\'s intrinsic natural sort order. Comparator defines external, pluggable sorting strategies.',
    failureMode: 'A compareTo() implementation that violates the transitivity contract (A > B and B > C implies A > C) crashes Collections.sort with IllegalArgumentException.',
    tryItFriction: 'Author a clean Comparator lambda: (a, b) -> Double.compare(b.getBalance(), a.getBalance()) for descending balance sort.',
    socraticHints: [
      'How do you sort accounts by balance descending without modifying the BankAccount class?',
      'Pass a custom Comparator to Collections.sort(accounts, comparator)!',
      'Use Comparator.comparingDouble(BankAccount::getBalance).reversed().'
    ],
    situationalPuzzle: {
      scenario: 'In production, Collections.sort() suddenly throws "IllegalArgumentException: Comparison method violates its general contract!" on a customer list. What caused this rare exception?',
      options: [
        'The list was empty.',
        'The Comparator returned non-transitive or inconsistent results (e.g. returning 1 when comparing an object to itself or inconsistent with equals).',
        'The JVM ran out of memory.',
        'A null pointer was passed.'
      ],
      answerIdx: 1,
      debrief: 'TimSort in Java enforces mathematical strict weak ordering. If a comparator is inconsistent (e.g. compare(a,b) > 0 and compare(b,a) > 0), TimSort detects the invariant violation and throws an exception.'
    },
    quests: [
      { id: 'java-m2-d49-q1', name: 'Strict Weak Ordering Contract in TimSort', type: 'concept', desc: 'Formulate reflexive, anti-symmetric, and transitive comparison invariants.' },
      { id: 'java-m2-d49-q2', name: 'Detective Lab: The Contract-Violating Comparator', type: 'detective', desc: 'Fix an inconsistent comparator crashing TimSort on large production datasets.' },
      { id: 'java-m2-d49-q3', name: 'Mastery Assignment: Multi-Field Priority Sorter', type: 'assignment', desc: 'Sort transactions by status (enum), then timestamp (descending), then amount.' },
      { id: 'java-m2-d49-q4', name: 'Production Incident Lab: TimSort Contract Violation Incident', type: 'detective', desc: "Resolve IllegalArgumentException caused by non-transitive Comparator logic." }
    ]
  },
  {
    day: 50,
    month: 2,
    blockNum: 10,
    title: '⭐ Milestone 9: High-Throughput In-Memory Order Book & Inventory Cache',
    stageName: 'Stage 3: Systems Stress-Testing',
    stageNum: 3,
    pedagogicalRole: 'High Cognitive Friction (Milestone 9 Integration)',
    spokenGoal: 'Build an ultra-fast in-memory order book matching engine using HashMaps for O(1) lookups and TreeSets for sorted order prices.',
    conceptInvariant: 'Separation of concerns: fast key lookups require HashMaps ($O(1)$); priority queue order matching requires balanced binary trees ($O(\log N)$).',
    failureMode: 'Using a linear ArrayList to search and match orders degrades throughput from 100,000 orders/sec to 200 orders/sec.',
    tryItFriction: 'Combine HashMap<String, Order> for instant lookups with TreeMap<Double, List<Order>> for price-priority matching.',
    socraticHints: [
      'How do you cancel an order by ID in O(1) while keeping prices sorted in O(log N)?',
      'Maintain two data structures: a HashMap<OrderId, Order> and a TreeMap<Price, Queue<Order>>!',
      'When an order is cancelled, look up the order in the map and remove it from the corresponding price queue.'
    ],
    situationalPuzzle: {
      scenario: 'A trading platform needs to query orders by ID in $O(1)$ and fetch the top 10 best buy orders in $O(1)$. Which composite data structure design achieves this?',
      options: [
        'A single flat ArrayList.',
        'A composite engine: HashMap<OrderId, Order> for direct lookup + PriorityQueue / TreeMap for sorted depth.',
        'A SQLite database table without indexes.',
        'A recursive linked list.'
      ],
      answerIdx: 1,
      debrief: 'Production engines use composite indexing: a hash table for primary key access combined with an ordered tree or heap for sorted range queries.'
    },
    quests: [
      { id: 'java-m2-d50-q1', name: 'Order Book Architecture & Matching Mechanics', type: 'concept', desc: 'Diagram limit order book bid/ask queues and price-time priority.' },
      { id: 'java-m2-d50-q2', name: 'Detective Lab: The Degraded Order Search Bottleneck', type: 'detective', desc: 'Refactor an $O(N)$ linear search matcher into an optimal $O(\log N)$ tree structure.' },
      { id: 'java-m2-d50-q3', name: 'Mastery Assignment: Limit Order Book Matching Engine', type: 'assignment', desc: 'Implement matchLimitOrder() executing trades against opposite price queues.' },
      { id: 'java-m2-d50-m9', name: '⭐ Milestone 9: Enterprise In-Memory Order Book & Cache', type: 'milestone', desc: 'Deliver 50,000 order/sec in-memory matching engine with unit tests.' }
    ]
  },

  // ── BLOCK 11: MULTITHREADING, MEMORY BARRIERS & CONCURRENCY PRIMITIVES (Days 51–55) ──
  {
    day: 51,
    month: 2,
    blockNum: 11,
    title: 'Operating System Threads vs Java Thread & Runnable',
    stageName: 'Stage 4: Architectural Autonomy',
    stageNum: 4,
    pedagogicalRole: 'Zero Support (OS 1:1 Kernel Threads & Thread Lifecycle)',
    spokenGoal: 'Master Java concurrency: creating threads via Runnable, understanding OS 1:1 kernel threads, and thread states (NEW, RUNNABLE, BLOCKED, WAITING, TERMINATED).',
    conceptInvariant: 'Calling thread.start() spawns a new OS kernel thread. Calling thread.run() merely executes the method synchronously on the current thread!',
    failureMode: 'Accidentally calling t.run() instead of t.start() runs code on the main thread, blocking the UI and failing to achieve parallel execution.',
    tryItFriction: 'Replace t.run() with t.start() to launch execution on a separate concurrent thread.',
    socraticHints: [
      'Why is the application freezing on the main thread even though you created new Thread(runnable)?',
      'Look at how you invoked it: did you call .run() or .start()?',
      'Calling .run() is just a normal method call! You must call .start() to instruct the OS to spawn a thread.'
    ],
    situationalPuzzle: {
      scenario: 'A developer creates 4 background worker threads to download files concurrently: "for (Thread t : workers) t.run();". The files download strictly one after another sequentially. Why?',
      options: [
        'The network bandwidth was saturated.',
        'Calling .run() directly executes synchronously on the calling thread. They must call .start() to initiate concurrent execution.',
        'Java does not support multi-core CPUs.',
        'Operating system scheduler error.'
      ],
      answerIdx: 1,
      debrief: 't.start() allocates a new native thread and OS stack frame, then invokes run(). Calling t.run() directly bypasses thread creation entirely.'
    },
    quests: [
      { id: 'java-m2-d51-q1', name: 'OS Kernel Thread Model & Java Thread States', type: 'concept', desc: 'Trace transition from NEW -> RUNNABLE -> WAITING -> TERMINATED.' },
      { id: 'java-m2-d51-q2', name: 'Detective Lab: The Synchronous Run Illusion', type: 'detective', desc: 'Diagnose why an asynchronous worker pool ran synchronously and blocked main.' },
      { id: 'java-m2-d51-q3', name: 'Mastery Assignment: Parallel Batch File Downloader', type: 'assignment', desc: 'Spawn 5 concurrent worker threads and join() all threads before proceeding.' }
    ]
  },
  {
    day: 52,
    month: 2,
    blockNum: 11,
    title: 'Race Conditions, Critical Sections & The Lost Update Anomaly',
    stageName: 'Stage 4: Architectural Autonomy',
    stageNum: 4,
    pedagogicalRole: 'Zero Support (Non-Atomic Read-Modify-Write & Race Hazards)',
    spokenGoal: 'Demonstrate how concurrent shared memory mutation causes lost updates. count++ is THREE machine instructions: read, increment, write.',
    conceptInvariant: 'count++ is NOT atomic. If two threads read count=0 simultaneously, both write count=1, losing one increment.',
    failureMode: 'Two concurrent threads incrementing a counter 10,000 times each results in a final value like 14,231 instead of 20,000!',
    tryItFriction: 'Demonstrate lost updates by running two threads modifying an un-synchronized shared counter.',
    socraticHints: [
      'Why does running two threads that increment count 10,000 times produce 14,231 instead of 20,000?',
      'Because count++ consists of 3 steps: read count into CPU register, add 1, write back to RAM. Threads interleave and overwrite each other!',
      'This is a race condition. The critical section must be protected by mutual exclusion.'
    ],
    situationalPuzzle: {
      scenario: 'Two concurrent transactions withdraw $50 simultaneously from an account holding $60. Both read balance = $60, check balance >= $50, and withdraw $50. Final balance is $10, and $100 was dispensed! What happened?',
      options: [
        'Integer overflow.',
        'A Classic Race Condition: the Check-Then-Act sequence was not executed atomically inside a mutual exclusion lock.',
        'Hardware memory corruption.',
        'The ATM ran out of bills.'
      ],
      answerIdx: 1,
      debrief: 'Check-then-act operations on shared state are not atomic. Without locking the critical section, both threads pass the check before either decrements the balance.'
    },
    quests: [
      { id: 'java-m2-d52-q1', name: 'Bytecode Disassembly of count++', type: 'concept', desc: 'Inspect getfield, iconst_1, iadd, putfield showing non-atomic execution.' },
      { id: 'java-m2-d52-q2', name: 'Detective Lab: The Vanishing Balance Discrepancy', type: 'detective', desc: 'Reproduce and capture a lost update race condition under multi-threaded load.' },
      { id: 'java-m2-d52-q3', name: 'Mastery Assignment: Thread Interleaving Simulator', type: 'assignment', desc: 'Demonstrate how thread context switching causes inconsistent bank ledger balances.' }
    ]
  },
  {
    day: 53,
    month: 2,
    blockNum: 11,
    title: 'Intrinsic Locks: synchronized Blocks, Methods & Monitor Mechanics',
    stageName: 'Stage 4: Architectural Autonomy',
    stageNum: 4,
    pedagogicalRole: 'Zero Support (Object Monitors, Mutexes & Lock Reentrancy)',
    spokenGoal: 'Master synchronized: object monitors, reentrant locking, and locking fine-grained critical sections rather than whole methods.',
    conceptInvariant: 'Every object in Java has an intrinsic monitor lock. Only ONE thread can hold that monitor lock at any given time.',
    failureMode: 'Synchronizing on two different lock objects (e.g. synchronized(new Object())) creates separate locks that do not protect shared state!',
    tryItFriction: 'Synchronize on a stable private final Object lock = new Object(); to enforce mutual exclusion across all threads.',
    socraticHints: [
      'Why is "synchronized (new Object()) { count++; }" completely useless?',
      'Because every thread creates its OWN new Object and locks its own private monitor! They never wait for each other.',
      'Synchronize on a single shared lock instance: "private final Object lock = new Object();".'
    ],
    situationalPuzzle: {
      scenario: 'A high-scale payments API marks its entire processPayment() method as synchronized. Latency spikes from 5ms to 8,000ms under load, and throughput collapses to 1 transaction/second. Why?',
      options: [
        'The JVM crashed.',
        'Coarse-grained locking on the entire method serialized all independent users, forcing all transactions across the entire company into a single line.',
        'Deadlock in the database.',
        'The lock was corrupted.'
      ],
      answerIdx: 1,
      debrief: 'Coarse-grained locking destroys concurrency. Synchronization must be fine-grained: lock only the specific critical section (e.g. per-account lock), not the entire business service.'
    },
    quests: [
      { id: 'java-m2-d53-q1', name: 'Monitor Enter / Exit Bytecode Mechanics', type: 'concept', desc: 'Trace monitorenter and monitorexit bytecodes and lock reentrancy counters.' },
      { id: 'java-m2-d53-q2', name: 'Detective Lab: The New Object Lock Trap', type: 'detective', desc: 'Fix a multi-threaded counter where threads locked on transient local objects.' },
      { id: 'java-m2-d53-q3', name: 'Mastery Assignment: Thread-Safe Banking Ledger with Fine-Grained Locking', type: 'assignment', desc: 'Implement thread-safe transfer(from, to, amount) using ordered account locks to prevent deadlocks.' }
    ]
  },
  {
    day: 54,
    month: 2,
    blockNum: 11,
    title: 'The Java Memory Model (JMM): volatile Keyword, CPU Caches & Happens-Before Order',
    stageName: 'Stage 4: Architectural Autonomy',
    stageNum: 4,
    pedagogicalRole: 'Zero Support (CPU L1/L2 Caches, Store Buffers & Memory Barriers)',
    spokenGoal: 'Master volatile: visibility across threads, hardware CPU cache coherence, instruction reordering, and the Happens-Before relationship.',
    conceptInvariant: 'volatile guarantees VISIBILITY, not atomicity. Writes to volatile variables flush immediately to main memory and bypass CPU L1 caches.',
    failureMode: 'A worker thread checking "while (!stopRequested)" loops forever because the write on the main thread remains in a CPU write buffer!',
    tryItFriction: 'Mark the shutdown flag "private volatile boolean stopRequested = false;" to establish a Happens-Before visibility barrier.',
    socraticHints: [
      'Why does worker thread never see "stopRequested = true" set by main thread on a multi-core machine?',
      'Because the worker thread cached the value false in its L1 CPU cache and never re-read main RAM!',
      'Add "volatile" to the boolean flag: "private volatile boolean stopRequested = false;".'
    ],
    situationalPuzzle: {
      scenario: 'A developer writes a thread-safe counter using: "private volatile int count = 0; public void increment() { count++; }". Under 10 threads, count still produces lost updates. Why did volatile fail to make it thread-safe?',
      options: [
        'volatile is deprecated in modern Java.',
        'volatile guarantees visibility of reads and writes, but does NOT make compound operations (read-modify-write like count++) atomic.',
        'volatile only works on booleans.',
        'The JVM optimized the variable away.'
      ],
      answerIdx: 1,
      debrief: 'volatile ensures that every thread reads the latest value, but does not provide mutual exclusion. count++ is still three separate operations that can interleave across threads.'
    },
    quests: [
      { id: 'java-m2-d54-q1', name: 'Hardware Memory Architecture & Happens-Before', type: 'concept', desc: 'Diagram CPU L1/L2/L3 caches, store buffers, and memory barrier instructions (mfence).' },
      { id: 'java-m2-d54-q2', name: 'Detective Lab: The Invisible Flag Infinite Loop', type: 'detective', desc: 'Reproduce a worker thread failing to terminate due to missing volatile visibility.' },
      { id: 'java-m2-d54-q3', name: 'Mastery Assignment: Thread-Safe State Machine with Volatile State', type: 'assignment', desc: 'Implement graceful shutdown coordinator using volatile status flags.' }
    ]
  },
  {
    day: 55,
    month: 2,
    blockNum: 11,
    title: '⭐ Milestone 10: Thread-Safe Concurrent Producer-Consumer Work Queue with wait() / notifyAll()',
    stageName: 'Stage 4: Architectural Autonomy',
    stageNum: 4,
    pedagogicalRole: 'Zero Support (Milestone 10 Integration)',
    spokenGoal: 'Build a bounded thread-safe FIFO queue from scratch using synchronized, wait(), and notifyAll() to coordinate producers and consumers.',
    conceptInvariant: 'Always invoke wait() inside a while() loop, NEVER an if() statement, to defend against spurious wakeups.',
    failureMode: 'Calling wait() inside an if statement causes a thread to wake up after capacity changes and corrupt the buffer (Spurious Wakeup).',
    tryItFriction: 'Enclose wait() inside "while (queue.size() == capacity) { wait(); }" to guard against spurious wakeups.',
    socraticHints: [
      'Why must wait() always be inside a "while (isFull())" loop instead of "if (isFull())"?',
      'Because threads can wake up spuriously without being notified, or another thread might have consumed the slot first!',
      'When it wakes up, it MUST re-check the condition in the while loop before proceeding.'
    ],
    situationalPuzzle: {
      scenario: 'A producer-consumer queue uses notify() instead of notifyAll(). Under heavy load, the application deadlocks with all producer and consumer threads in WAITING state. What caused this thread starvation?',
      options: [
        'Out of memory.',
        'notify() wakes only ONE random thread. A producer woke another producer (which saw the queue full and went back to sleep), leaving all consumers asleep forever.',
        'notify() only works on static objects.',
        'CPU clock drift.'
      ],
      answerIdx: 1,
      debrief: 'notify() wakes a single arbitrary waiting thread. If a producer wakes another producer instead of a consumer, both wait, and the system permanently starves. Use notifyAll().'
    },
    quests: [
      { id: 'java-m2-d55-q1', name: 'Monitor Wait Set & Spurious Wakeups', type: 'concept', desc: 'Trace thread transition into the Monitor Wait Set and lock re-acquisition.' },
      { id: 'java-m2-d55-q2', name: 'Detective Lab: The Starved Producer Deadlock', type: 'detective', desc: 'Fix thread starvation by replacing notify() with notifyAll() and while guards.' },
      { id: 'java-m2-d55-q3', name: 'Mastery Assignment: Bounded Blocking Work Queue', type: 'assignment', desc: 'Implement BlockingQueue<T> with enqueue(), dequeue(), and capacity bounds.' },
      { id: 'java-m2-d55-m10', name: '⭐ Milestone 10: Enterprise Producer-Consumer Order Pipeline', type: 'milestone', desc: 'Coordinate 4 producer threads and 8 consumer threads processing 100,000 orders.' }
    ]
  },

  // ── BLOCK 12: PRODUCTION SYSTEMS, THREAD POOLS, I/O & CAPSTONE (Days 56–60) ──
  {
    day: 56,
    month: 2,
    blockNum: 12,
    title: 'Modern Concurrency: ExecutorService, ThreadPoolExecutor & Thread Pool Tuning',
    stageName: 'Stage 4: Architectural Autonomy',
    stageNum: 4,
    pedagogicalRole: 'Zero Support (Managed Thread Pools & Sizing Formulas)',
    spokenGoal: 'Master ExecutorService, ThreadPoolExecutor, and the mathematical formula for sizing CPU-bound vs I/O-bound thread pools.',
    conceptInvariant: 'Never create raw threads inside server request handlers. Sizing formula: CPU-bound = N_cores; I/O-bound = N_cores * (1 + Wait/Compute).',
    failureMode: 'Using Executors.newCachedThreadPool() under burst traffic spawns 10,000 threads, causing OOM: unable to create new native thread.',
    tryItFriction: 'Replace newCachedThreadPool() with an explicit ThreadPoolExecutor with bounded queue and CallerRunsPolicy.',
    socraticHints: [
      'Why did the server crash with "OutOfMemoryError: unable to create new native thread" when 5,000 requests arrived at once?',
      'Because newCachedThreadPool() spawns an unbounded number of threads! Each thread takes 1MB of stack memory.',
      'Use a bounded ThreadPoolExecutor with a fixed pool size and a bounded queue.'
    ],
    situationalPuzzle: {
      scenario: 'A server with 8 CPU cores handles tasks that spend 90% of their time waiting on database I/O and 10% computing. What is the optimal thread pool size?',
      options: [
        '8 threads.',
        'Approximately 8 * (1 + 90/10) = 80 threads, allowing cores to stay saturated while threads wait on I/O.',
        '1,000 threads.',
        '1 thread.'
      ],
      answerIdx: 1,
      debrief: 'Brian Goetz I/O-bound formula: Number of Threads = Number of Cores * (1 + Wait Time / Service Time). For 90% wait time, 8 * (1 + 9) = 80 threads maximizes throughput.'
    },
    quests: [
      { id: 'java-m2-d56-q1', name: 'ThreadPoolExecutor Queue Saturation & Rejection Policies', type: 'concept', desc: 'Trace AbortPolicy, CallerRunsPolicy, and DiscardOldestPolicy behaviors.' },
      { id: 'java-m2-d56-q2', name: 'Detective Lab: The Unbounded Thread Pool OOM', type: 'detective', desc: 'Refactor an explosive thread spawner into a hardened bounded ThreadPoolExecutor.' },
      { id: 'java-m2-d56-q3', name: 'Mastery Assignment: Async Financial Report Aggregator', type: 'assignment', desc: 'Execute parallel branch calculations using Callable<Report> and Future.get().' }
    ]
  },
  {
    day: 57,
    month: 2,
    blockNum: 12,
    title: 'Atomic Primitives: AtomicInteger, AtomicReference & Lock-Free CAS Loops',
    stageName: 'Stage 4: Architectural Autonomy',
    stageNum: 4,
    pedagogicalRole: 'Zero Support (Compare-And-Swap Hardware Instructions & Lock-Free Data Structures)',
    spokenGoal: 'Master lock-free programming using java.util.concurrent.atomic (AtomicInteger, AtomicReference) and hardware CMPXCHG instructions.',
    conceptInvariant: 'Compare-And-Swap (CAS) executes lock-free updates at hardware speed: "if memory == expected, write update, else retry".',
    failureMode: 'A naive spin-loop with CAS without backoff burns 100% CPU during high thread contention.',
    tryItFriction: 'Implement an atomic non-blocking balance deposit using AtomicReference and an update CAS loop.',
    socraticHints: [
      'How does AtomicInteger.incrementAndGet() increment without using the synchronized keyword?',
      'It uses the CPU\'s atomic CMPXCHG (Compare-And-Swap) hardware instruction in a loop until it succeeds!',
      'Use atomicRef.compareAndSet(current, updated) inside a do-while loop.'
    ],
    situationalPuzzle: {
      scenario: 'A high-frequency metrics counter receives 20,000,000 updates per second across 64 cores. Using synchronized causes severe thread blocking. How do you achieve lock-free thread safety?',
      options: [
        'Use volatile int.',
        'Use LongAdder / AtomicLong which use lock-free CPU CAS instructions (and cell striping under contention) to eliminate thread locks.',
        'Write to a flat file.',
        'Disable metrics.'
      ],
      answerIdx: 1,
      debrief: 'LongAdder and AtomicLong use hardware CAS primitives to update memory without acquiring OS mutex locks, providing 10x higher throughput under contention.'
    },
    quests: [
      { id: 'java-m2-d57-q1', name: 'Hardware CMPXCHG & The ABA Problem', type: 'concept', desc: 'Inspect how modern CPUs execute atomic compare-and-swap at the hardware bus level.' },
      { id: 'java-m2-d57-q2', name: 'Detective Lab: The Contended Synchronized Bottleneck', type: 'detective', desc: 'Replace synchronized methods with AtomicLong to achieve 15x throughput.' },
      { id: 'java-m2-d57-q3', name: 'Mastery Assignment: Lock-Free Stack (Treiber Stack)', type: 'assignment', desc: 'Implement a concurrent lock-free LIFO stack using AtomicReference<Node>.' }
    ]
  },
  {
    day: 58,
    month: 2,
    blockNum: 12,
    title: 'Enterprise Database Connectivity: JDBC, Connection Pooling (HikariCP) & Transactions',
    stageName: 'Stage 4: Architectural Autonomy',
    stageNum: 4,
    pedagogicalRole: 'Zero Support (Relational Persistence, Connection Pooling & ACID Boundaries)',
    spokenGoal: 'Connect Java to enterprise SQL databases. Master raw JDBC, PreparedStatement injection prevention, HikariCP connection pooling, and programmatic transaction management.',
    conceptInvariant: 'Opening a raw database TCP connection per request destroys latency. Connection pools maintain warm pre-authenticated sockets. Transactions require setAutoCommit(false) and explicit commit/rollback.',
    failureMode: 'Concatenating user input into raw SQL strings triggers SQL injection vulnerabilities; forgetting to close a connection leaks pool sockets, deadlocking all subsequent queries.',
    tryItFriction: 'Refactor a vulnerable raw Statement into a PreparedStatement with try-with-resources and programmatic transaction commit/rollback.',
    socraticHints: [
      'Why is "SELECT * FROM users WHERE id = " + userId an extreme security violation?',
      'An attacker can pass "1 OR 1=1" and dump the entire database! Always use PreparedStatement with "?" placeholders.',
      'Wrap Connection, PreparedStatement, and ResultSet in try-with-resources to ensure sockets return to the HikariCP pool.'
    ],
    situationalPuzzle: {
      scenario: 'A banking service transfers $500: it deducts from Account A, encounters an error writing the credit to Account B, and throws an exception. Account A is debited, but Account B never receives funds. Why?',
      options: [
        'The database was offline.',
        'AutoCommit was enabled (default true), so the debit committed immediately without an enclosing atomic transaction rollback.',
        'Java ints overflowed.',
        'HikariCP failed.'
      ],
      answerIdx: 1,
      debrief: 'By default, JDBC auto-commits every single statement immediately. Multi-statement financial transfers MUST call connection.setAutoCommit(false), execute both updates, and call connection.commit() (or rollback() in catch).'
    },
    quests: [
      { id: 'java-m2-d58-q1', name: 'JDBC Lifecycle & HikariCP Architecture', type: 'concept', desc: 'Trace how connection pools eliminate TCP handshake and authentication overhead.' },
      { id: 'java-m2-d58-q2', name: 'Detective Lab: The Connection Pool Starvation Leak', type: 'detective', desc: 'Find an unclosed database connection in an exception block that exhausted the pool.' },
      { id: 'java-m2-d58-q3', name: 'Mastery Assignment: Atomic Multi-Account Transfer Service', type: 'assignment', desc: 'Implement transferFunds() with explicit transaction isolation, commit, and rollback.' },
      { id: 'java-m2-d58-q4', name: 'Production Incident Lab: SQL Injection Remediation Gate', type: 'detective', desc: "Replace dynamic SQL concatenation with parameterized PreparedStatement contracts." }
    ]
  },
  {
    day: 59,
    month: 2,
    blockNum: 12,
    title: 'High-Throughput Streams, Lambdas & Modern Functional Processing Pipelines',
    stageName: 'Stage 4: Architectural Autonomy',
    stageNum: 4,
    pedagogicalRole: 'Zero Support (Declarative Stream Pipelines & ForkJoinPool Parallelism)',
    spokenGoal: 'Master Java 8+ Stream API: intermediate lazy operations (filter, map, flatMap), terminal operations (collect, reduce), and parallel streams.',
    conceptInvariant: 'Streams are lazy: intermediate operations do not execute until a terminal operation (like collect() or sum()) is invoked.',
    failureMode: 'Reusing a consumed Stream throws IllegalStateException: stream has already been operated upon or closed.',
    tryItFriction: 'Refactor an imperative nested loop into a declarative functional stream pipeline with filter and map.',
    socraticHints: [
      'Why does calling stream.collect() twice throw IllegalStateException?',
      'A Stream in Java can only be traversed ONCE! Once a terminal operation executes, the stream is closed.',
      'Obtain a fresh stream from the collection for each query: list.stream()...'
    ],
    situationalPuzzle: {
      scenario: 'A developer uses parallelStream() to calculate total sales across 10,000 orders. Inside the map(), they mutate an external total variable. Final total is inconsistent every run. Why?',
      options: [
        'parallelStream() is broken.',
        'Mutating shared external state inside a parallel stream causes race conditions. They must use the reduce() operation or collect to a thread-safe reducer.',
        'The stream had too many elements.',
        'Numbers were too large.'
      ],
      answerIdx: 1,
      debrief: 'Parallel streams split work across multiple threads via ForkJoinPool. Common state mutations inside stream lambdas violate functional purity and cause race conditions. Use reduce().'
    },
    quests: [
      { id: 'java-m2-d58-q1', name: 'Stream Pipeline Laziness & Fusion', type: 'concept', desc: 'Trace how the JVM fuses multiple filter and map operations into a single pass.' },
      { id: 'java-m2-d58-q2', name: 'Detective Lab: The Stateful Parallel Stream Corruption', type: 'detective', desc: 'Refactor a stateful parallel stream with race conditions into a pure reduce().' },
      { id: 'java-m2-d58-q3', name: 'Mastery Assignment: Financial Trade Aggregator Pipeline', type: 'assignment', desc: 'Group 100,000 trades by currency and calculate volume-weighted average price (VWAP) using Collectors.groupingBy.' },
      { id: 'java-m2-d58-q4', name: 'Production Incident Lab: ForkJoinPool CommonPool Starvation', type: 'detective', desc: "Isolate a blocking I/O call inside a parallel stream that froze the entire application thread pool." }
    ]
  },
  {
    day: 60,
    month: 2,
    blockNum: 12,
    title: '🏆 Month 2 Master Capstone Gate: LedgerCore Enterprise Settlement Engine & Live Architecture Viva',
    stageName: 'Stage 4: Architectural Autonomy',
    stageNum: 4,
    pedagogicalRole: 'Zero Support (Master Capstone Integration & Code Defense)',
    spokenGoal: 'Architect, benchmark, and defend LedgerCore: A production multi-threaded financial transaction settlement engine with thread-safe balances, HikariCP JDBC persistence, and live telemetry.',
    conceptInvariant: 'LedgerCore guarantees zero race conditions, zero balance discrepancies, and atomic persistence under 10,000 concurrent transfers per second.',
    failureMode: 'A single unhandled concurrency race or uncommitted transaction corrupts the ledger audit balance, resulting in immediate capstone failure.',
    tryItFriction: 'Execute an adversarial fuzz test with 50 concurrent threads executing 100,000 balance transfers; assert total system balance remains 100.000% invariant.',
    socraticHints: [
      'Why did the total balance across all accounts decrease by $250 after the stress test?',
      'A race condition occurred during simultaneous reciprocal transfers (A->B and B->A)!',
      'Enforce strict lock-ordering by accountId to eliminate deadlocks and use AtomicLong or synchronized critical sections.'
    ],
    situationalPuzzle: {
      scenario: 'You are presenting LedgerCore to a panel of Principal Architects. They ask: "How does your engine prevent deadlocks when Thread 1 transfers A -> B and Thread 2 transfers B -> A simultaneously?" How do you answer?',
      options: [
        'By catching DeadlockException.',
        'By enforcing global lock-ordering: always acquiring locks in ascending order of Account ID (min(A, B) first, then max(A, B)), mathematically eliminating circular wait conditions.',
        'By running on a single thread.',
        'By using sleep(10).'
      ],
      answerIdx: 1,
      debrief: 'Resource ordering (locking the lower account ID first) breaks Coffman condition #4 (Circular Wait), mathematically guaranteeing deadlocks are impossible regardless of concurrency volume.'
    },
    quests: [
      { id: 'java-m2-d60-q1', name: 'LedgerCore Architectural Blueprint & Threat Model', type: 'concept', desc: 'Design the thread-safety, persistence, and audit logging layers of an enterprise financial settlement engine.' },
      { id: 'java-m2-d60-q2', name: 'Adversarial Stress Test: The 100,000 Transaction Race Audit', type: 'detective', desc: 'Execute multi-threaded stress tests and eliminate race conditions using lock-ordering and CAS primitives.' },
      { id: 'java-m2-d60-q3', name: 'Mastery Capstone: Production LedgerCore Settlement Deployment', type: 'assignment', desc: 'Deploy LedgerCore with HikariCP connection pooling, PreparedStatement audit logging, and p99 latency telemetry.' },
      { id: 'java-m2-d60-cap', name: '🏆 Live Architecture Viva & Senior Code Defense', type: 'milestone', desc: 'Defend LedgerCore concurrency invariants, GC footprint, and failure modes against senior engineering review.' }
    ]
  }
];
