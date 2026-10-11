# scripts/visuals/computer_fundamentals_spec_m1.py
# Month 1: Days 1 to 15 Specification for Course 32: Computer Literacy, Digital Productivity & OS Fundamentals (course-computer-fundamentals)
# Conforms strictly to Gate v2 / True 9.8 standard across all 15 days (60 Quests: Q32.1 to Q32.60).

DAYS_1_TO_15 = [
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "The Von Neumann Architecture, ALU, Program Counter & The Machine Instruction Cycle",
    "stageNum": 1,
    "stageName": "Stage 1: Mental Model & Foundations",
    "pedagogicalRole": "Computer Systems Architecture Foundations (Von Neumann Model, CPU Subsystems, Program Counter & Fetch-Decode-Execute Cycle)",
    "spokenGoal": "Every modern computer\u2014from smartwatches to supercomputing clusters\u2014is fundamentally an implementation of the Von Neumann machine. Today we strip away software abstractions and inspect the silicon core: understanding how the Arithmetic Logic Unit (ALU), Control Unit, Registers, and Memory Bus collaborate in a deterministic cycle of Fetch, Decode, Execute, and Writeback.",
    "conceptInvariant": "Von Neumann Instruction Invariant: The Central Processing Unit executes instructions sequentially via the Program Counter ($PC \\leftarrow PC + \\text{sizeof}(Instruction)$), and code and data share the same unified memory address space.",
    "failureMode": "The Von Neumann Bottleneck Crash: A legacy embedded banking terminal executes data processing on the same memory bus as instruction fetches. When a high-volume batch job saturates the memory bus bandwidth, CPU execution stalls by 94% waiting for instruction fetch cycles, causing automated teller timeouts across 400 branches.",
    "tryItFriction": "Build a minimal software CPU simulator in Python that fetches 8-bit opcodes from an array, decodes them via a jump table, updates registers, and increments a Program Counter.",
    "socraticHints": [
      "Why is the physical separation between CPU registers and system DRAM the primary limiting factor in modern computational throughput (the 'Memory Wall')?",
      "What occurs physically inside flip-flop registers when the Program Counter is incremented during a clock cycle?",
      "Contrast the Von Neumann architecture (unified code and data memory) with the Harvard architecture (physically separate instruction and data buses)."
    ],
    "situationalPuzzle": {
      "scenario": "A firmware engineer observes that a microcontroller executing a cryptographic loop suffers random crashes whenever a large buffer of incoming network data is copied into memory. The program counter jumps into random invalid addresses (0xDEADBEEF). Analysis reveals that incoming data overflowed its assigned array and overwrote adjacent memory addresses holding executable instructions.",
      "options": [
        "Blame the hardware vendor and replace the CPU.",
        "Diagnose the classic Von Neumann shared-memory vulnerability: Because code and data share the same physical RAM address space, buffer overflows can overwrite return addresses and instructions. Implement strict memory boundary checks, enable hardware Memory Protection Units (MPU), and enforce W^X (Write XOR Execute) memory page permissions.",
        "Increase the CPU clock frequency from 100MHz to 1GHz to run faster than the bug.",
        "Delete the network buffer and process packets one byte per minute."
      ],
      "correctOptionIndex": 1,
      "debrief": "The Von Neumann architecture stores data and executable machine instructions in the same physical memory space. Without modern OS memory protection (like MPU/MMU and W^X/DEP), an unchecked buffer write directly corrupts adjacent executable instructions, hijacking the Program Counter."
    },
    "quests": [
      {
        "id": "Q32.1",
        "name": "Von Neumann Architecture & CPU Instruction Pipeline",
        "type": "Concept",
        "desc": "Detail the architectural mechanics of the Von Neumann model, diagramming the Control Unit, ALU, Register file, Memory Bus, and the 4-phase Instruction Cycle."
      },
      {
        "id": "Q32.2",
        "name": "The Program Counter Desynchronization Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Analyze a low-level machine state trace where a microprocessor entered an infinite loop; identify the corrupted branch offset opcode that diverted the Program Counter."
      },
      {
        "id": "Q32.3",
        "name": "8-Bit Software CPU Emulator Implementation",
        "type": "Mastery Assignment",
        "desc": "Implement a functional 8-bit CPU simulator in Python/TypeScript with 4 general-purpose registers, flags register, 256 bytes of RAM, and an instruction decoder supporting ADD, SUB, JMP, and LOAD."
      },
      {
        "id": "Q32.4",
        "name": "Memory Bus Contention & Instruction Stall Stress Lab",
        "type": "Production Incident Lab",
        "desc": "Benchmark CPU execution throughput while injecting memory bus traffic storms; quantify the Von Neumann bottleneck and demonstrate instruction cache mitigation."
      }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "Binary Arithmetic, Two's Complement, Floating-Point IEEE 754 & Bitwise Manipulation",
    "stageNum": 1,
    "stageName": "Stage 1: Mental Model & Foundations",
    "pedagogicalRole": "Data Representation & Low-Level Math (Binary, Hexadecimal, Two's Complement Signed Representation, IEEE 754 Floating-Point & Bitmasks)",
    "spokenGoal": "Computers do not understand integers or decimal fractions; they manipulate voltage potentials represented as binary bits. Today we master the mathematical foundations of computer science\u2014deriving Two's Complement for negative numbers, unpacking the IEEE 754 standard for floating-point values, and utilizing bitwise manipulation (AND, OR, XOR, shifts) for ultra-fast systems programming.",
    "conceptInvariant": "Two's Complement Invariant: The negation of an $N$-bit integer $X$ is computed as the bitwise NOT plus one ($-X = \\sim X + 1$); overflow occurs when adding two positive numbers yields a negative sign bit ($Sign(A) = Sign(B) \\ne Sign(A+B)$).",
    "failureMode": "The Ariane 5 Flight 501 Disaster: A 64-bit floating-point horizontal velocity value ($V_h$) is converted into a 16-bit signed integer. The value exceeds $32,767$, causing an unhandled arithmetic overflow exception. The primary and backup inertial guidance computers shut down, the rocket veers off trajectory, and aerodynamic stress causes total vehicle self-destruction, destroying a $370M satellite.",
    "tryItFriction": "Demonstrate why <code>0.1 + 0.2 !== 0.3</code> in JavaScript/Python due to IEEE 754 binary floating-point representation, and implement arbitrary-precision integer arithmetic using big-number bit shifting.",
    "socraticHints": [
      "Why does Two's Complement allow the exact same digital adder circuitry to perform both addition and subtraction without dedicated subtraction hardware?",
      "How does the IEEE 754 floating-point standard represent a 32-bit float via 1 sign bit, 8 exponent bits (with bias 127), and 23 mantissa bits?",
      "What bitwise trick allows you to determine if an integer is an exact power of two in $O(1)$ time without loops ($X \\ \\&\\ (X - 1) == 0$)?"
    ],
    "situationalPuzzle": {
      "scenario": "A high-frequency trading server processes account balances stored as standard 32-bit floating-point numbers. After millions of micro-transactions crediting $0.01 fractions to accounts, accounting discovers that large accounts (over $16,777,216) stop accumulating deposits, losing thousands of dollars. The junior developer suggests upgrading the database to a faster SSD.",
      "options": [
        "Upgrade the SSD to speed up database queries.",
        "Diagnose IEEE 754 Floating-Point Precision Loss: A 32-bit single-precision float has only 24 bits of significand (mantissa), meaning numbers exceeding $2^{24}$ (16,777,216) cannot represent fractional increments of $0.01$ because the spacing between consecutive representable floats exceeds the added amount. Re-architect the ledger to use fixed-point 64-bit integers (storing values in integer cents or micro-cents) or IEEE 754-2008 decimal floating-point.",
        "Round all customer balances down to zero every midnight.",
        "Convert all account balances into strings."
      ],
      "correctOptionIndex": 1,
      "debrief": "Binary floating-point numbers cannot accurately represent base-10 fractions (like 0.01) and lose absolute precision as the magnitude grows. When a float reaches $2^{24}$, adding $0.01$ rounds back to the original number. Financial ledgers must always use integer fixed-point math (cents) or arbitrary-precision decimal types."
    },
    "quests": [
      {
        "id": "Q32.5",
        "name": "Binary Arithmetic & IEEE 754 Floating-Point Mechanics",
        "type": "Concept",
        "desc": "Deconstruct Two's Complement integer arithmetic, overflow conditions, and the bit-level structure of IEEE 754 single and double precision floating-point representations."
      },
      {
        "id": "Q32.6",
        "name": "The Integer Wrap-Around Financial Heist Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Investigate a smart contract financial hack where a withdrawal of $1$ from a $0$ balance wrapped around to $18,446,744,073,709,551,615$ via unsigned integer underflow."
      },
      {
        "id": "Q32.7",
        "name": "IEEE 754 Bit-Level Float Unpacker & Fixed-Point Math Engine",
        "type": "Mastery Assignment",
        "desc": "Build a Python/C utility that extracts Sign, Exponent, and Mantissa bits from raw 32-bit hex values, and implement a high-precision 64-bit fixed-point arithmetic class."
      },
      {
        "id": "Q32.8",
        "name": "Bitwise Manipulation & SIMD Mask Optimization Lab",
        "type": "Production Incident Lab",
        "desc": "Implement a high-performance bit-vector search in C/Python using bitwise masks (popcount, clz, XOR packing); benchmark execution speed against standard array searches."
      }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "CPU Caches (L1/L2/L3), Cache Lines, Cache Misses & The Memory Latency Hierarchy",
    "stageNum": 1,
    "stageName": "Stage 1: Mental Model & Foundations",
    "pedagogicalRole": "Memory Systems Architecture (Cache Hierarchies, Spatial/Temporal Locality, Cache Lines, False Sharing & Memory Latency Gap)",
    "spokenGoal": "CPUs can execute instructions in nanoseconds, but fetching data from main system memory (DRAM) takes hundreds of clock cycles. Today we explore the CPU Cache hierarchy\u2014L1, L2, and L3 caches, 64-byte cache lines, spatial and temporal locality, and the devastating performance penalties of cache misses and multi-core false sharing.",
    "conceptInvariant": "Locality of Reference Invariant: Algorithms that access memory with contiguous spatial locality utilize pre-fetched 64-byte cache lines ($L_{line}$), reducing memory stalls by up to $50\\times$ compared to random pointer chasing.",
    "failureMode": "The False Sharing Multi-Core Meltdown: A multi-threaded analytics engine processes telemetry across 32 CPU cores. Even though each thread operates on independent integer variables, the variables are allocated adjacent to each other in memory within the same 64-byte cache line. Cores constantly invalidate each other's L1 caches via the MESI cache coherence protocol, reducing 32-core throughput to less than a single core.",
    "tryItFriction": "Benchmark 2D array traversal in C or Python comparing row-major (contiguous, cache-friendly) vs column-major (strided, cache-unfriendly) iterations, demonstrating a 10x latency divergence.",
    "socraticHints": [
      "Why is the latency of an L1 cache hit (~1 nanosecond) nearly 100 times faster than a main memory DRAM access (~60-100 nanoseconds)?",
      "What is a cache line (typically 64 bytes), and why does loading a single 4-byte integer automatically fetch the surrounding 60 bytes into CPU cache?",
      "How does the MESI (Modified, Exclusive, Shared, Invalid) protocol maintain memory consistency across multiple CPU cores?"
    ],
    "situationalPuzzle": {
      "scenario": "A financial risk engine computes matrix operations on 10,000x10,000 grids of numbers. An engineer rewrites the algorithm from a linked-list graph structure to a flat 1D contiguous array. Despite executing the exact same mathematical operations, total execution time drops from 45 seconds to 1.2 seconds. The management team asks why this happened.",
      "options": [
        "The compiler magically deleted half the code.",
        "Explain the Hardware Cache Locality Principle: Linked lists allocate nodes unpredictably across the heap, resulting in a DRAM cache miss on almost every pointer dereference (~100ns per node). Contiguous flat arrays exploit spatial locality: loading the first element pre-fetches the entire 64-byte cache line into L1 cache, allowing subsequent elements to be retrieved in 1-2 clock cycles with zero memory bus stalls.",
        "The computer was plugged into a higher-voltage power outlet.",
        "Arrays use less RAM than numbers."
      ],
      "correctOptionIndex": 1,
      "debrief": "Modern hardware performance is dominated by memory access patterns, not raw instruction count. Pointer-chasing data structures (linked lists, trees) destroy CPU cache locality by triggering random DRAM accesses. Contiguous memory structures (arrays) maximize cache line utilization and hardware pre-fetching."
    },
    "quests": [
      {
        "id": "Q32.9",
        "name": "CPU Cache Hierarchy & MESI Coherence Protocol",
        "type": "Concept",
        "desc": "Detail the memory latency hierarchy (Registers -> L1 -> L2 -> L3 -> DRAM -> SSD), cache associativity, cache line sizing, and the MESI state transition model."
      },
      {
        "id": "Q32.10",
        "name": "The Multi-Threaded False Sharing Bottleneck Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Profile a high-performance multithreaded server using Linux <code>perf c2c</code>; pinpoint the shared 64-byte cache line that caused 98% of CPU cycles to burn on bus snooping."
      },
      {
        "id": "Q32.11",
        "name": "Hardware Cache Locality Benchmarking Suite Implementation",
        "type": "Mastery Assignment",
        "desc": "Build a benchmarking utility in C/Python that measures latency across varying stride sizes (1 to 1024 bytes) and memory buffer sizes, programmatically discovering the exact sizes of L1, L2, and L3 caches."
      },
      {
        "id": "Q32.12",
        "name": "Cache-Conscious Data Structure Optimization Lab",
        "type": "Production Incident Lab",
        "desc": "Refactor a bloated pointer-based tree structure into a cache-conscious flat array (Struct-of-Arrays); demonstrate a >10x throughput improvement under a million random lookups."
      }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "Assembly Language Basics: x86-64 vs ARM64 Registers, Stack Frames & Calling Conventions",
    "stageNum": 1,
    "stageName": "Stage 1: Mental Model & Foundations",
    "pedagogicalRole": "Low-Level Systems Programming (Assembly Language, x86-64 vs ARM64 ISAs, Stack Frames, Call Stacks & ABI Calling Conventions)",
    "spokenGoal": "Compilers translate human-readable source code into native machine assembly. Today we learn to read and analyze machine assembly\u2014contrasting x86-64 (CISC) and ARM64 (RISC) architectures, inspecting general-purpose registers (RAX, RSP, RBP vs X0, SP, LR), understanding the function call stack frame, and tracing System V AMD64 calling conventions.",
    "conceptInvariant": "Stack Frame Integrity Invariant: A function call must preserve the caller's stack frame; when a function returns via RET, the Stack Pointer ($RSP$) must point precisely to the caller's return address ($RSP_{return} == RSP_{entry} - \\text{sizeof}(RetAddr)$).",
    "failureMode": "The Stack Smash Privilege Escalation Exploit: A network daemon reads user input using an unsafe function without bounds checking. An attacker sends 128 bytes of data into a 64-byte stack buffer, overwriting the saved base pointer ($RBP$) and the return address ($RIP$) with the address of injected shellcode. When the function executes <code>RET</code>, control jumps directly to malicious payload code with root privileges.",
    "tryItFriction": "Disassemble a simple C function using <code>objdump -d</code> or Compiler Explorer (Godbolt), and trace how parameters are passed via registers ($RDI, RSI, RDX$) vs pushed onto the stack.",
    "socraticHints": [
      "What is the fundamental architectural difference between Complex Instruction Set Computing (CISC / x86-64) and Reduced Instruction Set Computing (RISC / ARM64)?",
      "How does the System V AMD64 ABI calling convention pass function arguments, and which registers are caller-saved vs callee-saved?",
      "What is the purpose of the Frame Pointer ($RBP$) versus the Stack Pointer ($RSP$), and why do modern compilers often omit the frame pointer (<code>-fomit-frame-pointer</code>)?"
    ],
    "situationalPuzzle": {
      "scenario": "A legacy C application crashes with a Segmentation Fault (SIGSEGV) whenever a specific recursive calculation runs with deep recursion (>5,000 iterations). Core dump inspection shows that the Stack Pointer ($RSP$) collided with the process's guard page. The developer argues that the server has 64GB of free RAM, so it cannot be an out-of-memory error.",
      "options": [
        "Install more RAM in the server.",
        "Diagnose a Stack Overflow Exception: Each thread in an operating system is allocated a fixed-size call stack (typically 8MB on Linux). Deep recursion allocates new stack frames (return address, local variables, saved registers) on every call until the stack pointer exceeds the allocated limit, hitting the protective guard page. Refactor the recursive logic into an iterative loop or tail-call optimization.",
        "Delete the function call stack.",
        "Run the program as root to remove stack limits."
      ],
      "correctOptionIndex": 1,
      "debrief": "The call stack is finite and separate from the heap. While a server may have 64GB of heap memory, individual thread stacks default to 8MB. Deep recursion without base-case guarantees exhausts stack space rapidly, causing a stack overflow crash when the stack pointer touches the unmapped guard page."
    },
    "quests": [
      {
        "id": "Q32.13",
        "name": "Assembly Language Fundamentals & Calling Conventions",
        "type": "Concept",
        "desc": "Document the architectural differences between x86-64 and ARM64 registers, stack frame mechanics, and the System V AMD64 ABI calling convention."
      },
      {
        "id": "Q32.14",
        "name": "The Stack Smashing Buffer Overflow Forensic Challenge",
        "type": "Detective Challenge",
        "desc": "Analyze a gdb disassembly of a crashed daemon; trace the exact byte offset where user input corrupted the saved return address ($RIP$) on the stack."
      },
      {
        "id": "Q32.15",
        "name": "x86-64 Assembly Disassembly & Stack Frame Tracer",
        "type": "Mastery Assignment",
        "desc": "Write a low-level tracer in Python/C that parses compiled ELF binaries, disassembles function prologues (<code>push rbp; mov rbp, rsp</code>) and epilogues, and reconstructs the call stack."
      },
      {
        "id": "Q32.16",
        "name": "Recursion Depth & Stack Guard Page Collision Lab",
        "type": "Production Incident Lab",
        "desc": "Write a test harness that progressively deepens function recursion; monitor stack pointer addresses in real-time and observe the exact OS page fault triggered by guard page collision."
      }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "Milestone 1: ApexHardware CPU Instruction Cycle & Cache Emulator Architecture Review",
    "stageNum": 1,
    "stageName": "Stage 1: Mental Model & Foundations",
    "pedagogicalRole": "Architectural Milestone Evaluation (Comprehensive Architecture Review & Systems Stress-Testing for Low-Level Hardware & Cache Emulator)",
    "spokenGoal": "Today you stand before the Senior Systems Review Board for Milestone 1. You will present and defend ApexHardware\u2014a software emulator demonstrating the Von Neumann architecture, 8-bit instruction cycle, Two's Complement arithmetic, IEEE 754 conversions, and a multi-tier CPU cache simulator with MESI coherence. Prepare for rigorous questioning on low-level binary physics, register desynchronization, and memory latency bottlenecks.",
    "conceptInvariant": "Hardware Emulation Fidelity Invariant: An emulated computing system is deterministic if and only if every clock tick executes a state transition function that strictly preserves register state, flag flags, and memory consistency ($S_{t+1} = \\text{Execute}(S_t, I_t)$).",
    "failureMode": "The Emulated Cache Coherence Desync: During multi-core emulation, a race condition in the simulated MESI bus snooping logic causes Core 1 to read a stale cached value from L1 while Core 0 holds the modified dirty line in its buffer. Emulated software produces non-deterministic math calculation errors during parallel processing.",
    "tryItFriction": "Construct an automated test suite verifying that ApexHardware executes 100,000 arithmetic instructions with 100% mathematical parity against native x86 hardware execution.",
    "socraticHints": [
      "How does ApexHardware model the cycle-accurate latency difference between an L1 cache hit (1 cycle) and a main memory DRAM access (100 cycles)?",
      "What automated boundary checks in ApexHardware prevent simulated buffer overflows from corrupting the host emulator's memory space?",
      "Defend your choice of memory representation for modeling virtual 64-bit address spaces without consuming 16 exabytes of host RAM."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 1 defense, a senior reviewer asks: 'If ApexHardware is simulating a multi-core processor, what happens if two emulated threads attempt to write to the same emulated memory address simultaneously? How does your emulator enforce atomic compare-and-swap operations without corrupting the host OS memory?'",
      "options": [
        "Allow both threads to write simultaneously and hope the host OS handles it.",
        "Present the ApexHardware Atomic Memory Subsystem: 1) Model hardware bus lock signals using host OS atomic primitives (e.g. <code>std::atomic</code> in C++ or synchronized mutexes); 2) Simulate the CPU cache line MESI coherence states (transitioning the target cache line to 'Modified' on Core 0 while invalidating Core 1's copy); 3) Guarantee that emulated atomic instructions (such as <code>LOCK CMPXCHG</code>) execute with single-instruction atomicity across the simulated memory bus.",
        "Disable multi-threading in the emulator permanently.",
        "Tell the reviewer that real CPUs do not support atomic operations."
      ],
      "correctOptionIndex": 1,
      "debrief": "Emulating hardware concurrency requires explicit modeling of bus locks and cache coherence protocols. Real CPUs use hardware cache line locks and protocols like MESI to guarantee that compare-and-swap operations execute atomically across cores. An emulator must replicate these semantics using host atomic primitives."
    },
    "quests": [
      {
        "id": "Q32.17",
        "name": "ApexHardware Systems Architecture Specification",
        "type": "Concept",
        "desc": "Author the complete systems specification for ApexHardware, documenting the instruction set architecture (ISA), register maps, memory bus timing, and the multi-tier cache simulator."
      },
      {
        "id": "Q32.18",
        "name": "The Uncaught Hardware Arithmetic Flag Bug Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Investigate a subtle bug in an emulated ALU where signed comparison branches (<code>jge / jl</code>) branched incorrectly due to a flawed Overflow Flag calculation during subtraction."
      },
      {
        "id": "Q32.19",
        "name": "ApexHardware Cycle-Accurate CPU & Cache Emulator Implementation",
        "type": "Mastery Assignment",
        "desc": "Implement the complete ApexHardware simulator in Python/TypeScript, featuring an instruction decoder, register file, L1/L2 cache simulation with LRU eviction, and an interactive memory inspector."
      },
      {
        "id": "Q32.20",
        "name": "ApexHardware Milestone 1 Viva Defense & Chaos Injection Lab",
        "type": "Production Incident Lab",
        "desc": "Defend ApexHardware before the simulated Review Board while enduring injected illegal opcodes, memory bus saturation attacks, and cache coherence edge-case tests."
      }
    ]
  },
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "Kernel Mode vs User Mode (Ring 0 vs Ring 3), System Calls & Context Switching Latency",
    "stageNum": 2,
    "stageName": "Stage 2: Applied Engineering Patterns",
    "pedagogicalRole": "Operating System Internals (Privilege Rings, Kernel vs User Space, System Call Mechanics [syscall/sysenter] & Context Switching Overhead)",
    "spokenGoal": "An operating system's primary duty is resource mediation and hardware isolation. Today we explore CPU protection rings\u2014understanding the boundary between User Space (Ring 3) and Kernel Space (Ring 0), tracing how a user program requests hardware services via System Calls (syscall), and measuring the latency overhead of hardware context switches.",
    "conceptInvariant": "Privilege Isolation Invariant: User-space applications (Ring 3) cannot directly execute privileged CPU instructions (such as disabling interrupts or modifying page tables); all hardware I/O must transition through a trap/syscall gate into Kernel Mode (Ring 0).",
    "failureMode": "The System Call Storm Meltdown: A high-throughput microservice logs incoming network packets by issuing an individual <code>write()</code> syscall for every 10-byte packet. The CPU spends 82% of its cycles performing user-to-kernel context switches, CPU register saves, and TLB flushes rather than processing business logic, dropping 40,000 requests per second.",
    "tryItFriction": "Use Linux <code>strace -c</code> on a simple command to profile the number and total execution time spent in kernel system calls vs user-space computation.",
    "socraticHints": [
      "What physical hardware mechanism forces the CPU to switch from Ring 3 to Ring 0 when a program executes the <code>syscall</code> assembly instruction?",
      "Why is a context switch between two processes significantly more expensive than a context switch between two threads in the same process?",
      "How does user-space I/O buffering (like standard C <code>printf</code> / <code>fwrite</code>) reduce the frequency of expensive kernel system calls?"
    ],
    "situationalPuzzle": {
      "scenario": "A financial database team notices that migrating from a single-threaded server to a 500-thread process causes overall transaction throughput to collapse by 60%, while CPU utilization spikes to 100%. Linux <code>top</code> reports that 75% of CPU time is spent in 'system' time (kernel), not 'user' time.",
      "options": [
        "Increase the thread count to 5,000 to process more transactions.",
        "Diagnose Context Switching Thrashing: When hundreds of threads compete for CPU cores, the OS kernel spends more time saving and restoring CPU registers, switching memory page tables, and invalidating CPU caches during context switches than actually running code. Re-architect the application to use an event-driven asynchronous I/O model (like <code>epoll</code>) or a worker thread pool sized to match the physical CPU core count.",
        "Disable the OS kernel and run the database directly on the BIOS.",
        "Reboot the server every 5 minutes."
      ],
      "correctOptionIndex": 1,
      "debrief": "Context switching is not free; saving and restoring register states, flushing pipeline stages, and invalidating cache lines costs thousands of CPU cycles. When hundreds of threads thrash, the CPU wastes all its compute time in kernel context switching. Sizing thread pools to physical core counts and using event-driven architectures solves this bottleneck."
    },
    "quests": [
      {
        "id": "Q32.21",
        "name": "CPU Protection Rings & System Call Architecture",
        "type": "Concept",
        "desc": "Detail the architectural mechanics of x86-64 privilege rings (Ring 0 vs Ring 3), system call entry/exit (<code>syscall/sysret</code>), interrupt vector tables, and kernel stack switching."
      },
      {
        "id": "Q32.22",
        "name": "The Unbuffered Syscall Performance Collapse Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Profile a sluggish data ingestion service; trace how unbuffered file writes triggered 500,000 <code>write()</code> syscalls per second, starving CPU cores of application compute."
      },
      {
        "id": "Q32.23",
        "name": "System Call Latency & Context Switch Micro-Benchmarking Suite",
        "type": "Mastery Assignment",
        "desc": "Build a benchmarking utility in C/Python that precisely measures the cycle latency of a null system call (e.g. <code>getpid()</code>) and the context switch latency between two competing processes."
      },
      {
        "id": "Q32.24",
        "name": "Process Thread Pool vs Epoll Event Loop Stress Lab",
        "type": "Production Incident Lab",
        "desc": "Benchmark a 10,000-connection web server comparing a 1-thread-per-client model against an event-driven <code>epoll</code> worker pool; measure CPU context switch metrics under load."
      }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "Process Address Space, Virtual Memory, Paging, Page Tables & The TLB",
    "stageNum": 2,
    "stageName": "Stage 2: Applied Engineering Patterns",
    "pedagogicalRole": "Operating System Memory Management (Virtual Memory, 4KB Paging, Multi-Level Page Tables, MMU & Translation Lookaside Buffer [TLB])",
    "spokenGoal": "Every user process runs under the illusion that it owns the entire 64-bit memory space. Today we demystify that illusion\u2014mastering Virtual Memory, 4KB memory paging, multi-level page table hierarchies (CR3 register), hardware Memory Management Units (MMU), and the Translation Lookaside Buffer (TLB) that caches address translations.",
    "conceptInvariant": "Memory Isolation Invariant: Two distinct processes running in user space have mutually isolated virtual address spaces; virtual address $0x00400000$ in Process A maps to a completely distinct physical DRAM page frame than $0x00400000$ in Process B.",
    "failureMode": "The Thrashing Swap Disk Disaster: A memory leak in an enterprise application causes its working set size to exceed available physical RAM. The OS kernel begins aggressively swapping 4KB pages between physical RAM and the swap disk. Disk I/O queues spike to 100%, page fault latency jumps from nanoseconds to milliseconds, and the entire OS freezes (memory thrashing).",
    "tryItFriction": "Inspect the virtual memory layout of a running Linux process by reading <code>/proc/[pid]/maps</code>, identifying the Text, Data, Heap, Stack, and memory-mapped library regions.",
    "socraticHints": [
      "Why is direct physical memory access prohibited in multi-tasking operating systems, and what security risks does virtual memory prevent?",
      "How does a 4-level page table in x86-64 allow 64-bit addressing without requiring a gigantic, continuous 512-terabyte page table in physical RAM?",
      "What is a Major Page Fault vs a Minor Page Fault, and why does a Major Page Fault incur a devastating performance penalty?"
    ],
    "situationalPuzzle": {
      "scenario": "A real-time robotics control loop requires deterministic sub-millisecond actuation. Occasionally, a routine memory access to a pre-allocated telemetry buffer stalls for 12 milliseconds, causing a robotic arm collision. Investigation reveals that the buffer had not been accessed for several minutes, causing the OS memory manager to page it out to swap.",
      "options": [
        "Blame the robot motor hardware.",
        "Diagnose Major Page Fault Latency & Lock Memory: The OS kernel aggressively pages inactive memory out to disk swap. When the robotics loop accesses the cold buffer, a Major Page Fault occurs, stalling the thread while the disk reads the page back into RAM. Use the Linux <code>mlockall(MCL_CURRENT | MCL_FUTURE)</code> system call to pin the entire process address space in physical DRAM and disable swap, preventing page faults.",
        "Delete the operating system and run on bare metal.",
        "Run a script that prints random numbers to keep the CPU warm."
      ],
      "correctOptionIndex": 1,
      "debrief": "Virtual memory paging allows operating systems to swap cold pages to disk. In real-time systems, a page fault to disk introduces catastrophic millisecond delays. Real-time engineering mandates locking memory pages in physical RAM using `mlock()`/`mlockall()`, guaranteeing zero disk page faults."
    },
    "quests": [
      {
        "id": "Q32.25",
        "name": "Virtual Memory & Multi-Level Paging Architecture",
        "type": "Concept",
        "desc": "Diagram the complete virtual-to-physical address translation pipeline: Virtual Address parsing (PGD, P4D, PUD, PMD, PTE), MMU hardware lookup, TLB hit/miss paths, and physical DRAM page frames."
      },
      {
        "id": "Q32.26",
        "name": "The Memory Thrashing Swap Death Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Analyze a Linux system monitoring snapshot (<code>vmstat</code>, <code>sar</code>); trace how a runaway process triggered millions of major page faults per minute, driving disk utilization to 100%."
      },
      {
        "id": "Q32.27",
        "name": "Virtual Memory Address Space Map Parser & TLB Profiler",
        "type": "Mastery Assignment",
        "desc": "Build an open-source tool in Python/C that parses <code>/proc/self/maps</code> and <code>/proc/self/pagemap</code>, extracting virtual-to-physical page mappings and measuring memory page allocation boundaries."
      },
      {
        "id": "Q32.28",
        "name": "Real-Time Memory Locking & Page Fault Elimination Lab",
        "type": "Production Incident Lab",
        "desc": "Demonstrate the latency difference between an unlocked memory buffer subject to OS paging and an <code>mlock()</code>-pinned buffer under memory pressure; prove 0 major page faults."
      }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "Process Scheduling Algorithms: CFS, Round-Robin, Priority Inversion & CPU Starvation",
    "stageNum": 2,
    "stageName": "Stage 2: Applied Engineering Patterns",
    "pedagogicalRole": "OS Kernel Scheduling (Process Schedulers, Completely Fair Scheduler [CFS], Round-Robin, Nice Values, Priority Inversion & Martian Pathfinder)",
    "spokenGoal": "When dozens of processes want to run on a limited number of CPU cores, the OS kernel scheduler acts as the supreme arbiter of time. Today we dissect process scheduling algorithms\u2014tracing the Linux Completely Fair Scheduler (CFS) and red-black tree virtual runtime ($vruntime$), exploring Round-Robin time slices, and understanding the classic systems concurrency hazard: Priority Inversion.",
    "conceptInvariant": "Fair Scheduling Invariant: In a fair-share scheduler (CFS), the process with the smallest virtual runtime ($vruntime$) is always scheduled next; higher-priority processes accumulate $vruntime$ at a slower rate ($vruntime \\mathrel{+}= \\Delta t \\cdot \\frac{W_0}{W_i}$).",
    "failureMode": "The Mars Pathfinder Priority Inversion Reset: In 1997, the Mars Pathfinder spacecraft experiences random system resets on Mars. A low-priority meteorological task acquires a shared mutex. A medium-priority communications task preempts the low-priority task. A high-priority attitude control task awakens, attempts to acquire the mutex, and blocks. Because the medium task keeps running, the low task cannot finish to release the mutex. The watchdog timer triggers, resetting the spacecraft.",
    "tryItFriction": "Simulate a 3-task priority inversion scenario in Python where a high-priority task is starved by a medium-priority task, and resolve it by implementing Priority Inheritance.",
    "socraticHints": [
      "How does the Linux Completely Fair Scheduler use a Red-Black Tree to find the next runnable process in $O(1)$ or $O(\\log N)$ time?",
      "What is 'virtual runtime' ($vruntime$), and how do Linux 'nice' values (-20 to +19) mathematically weight the accumulation of $vruntime$?",
      "What is Priority Inheritance, and how does temporarily elevating a mutex holder's priority prevent the Mars Pathfinder deadlock scenario?"
    ],
    "situationalPuzzle": {
      "scenario": "A telecommunications gateway handles two types of traffic: a real-time voice call stream and a background data backup sync. The developers set the voice stream to high priority (nice -10) and backup sync to normal (nice 0). During peak hours, voice calls experience terrible audio stutter and packet drops because backup sync threads consume all CPU cores.",
      "options": [
        "Set backup sync to nice -20 so it runs even faster.",
        "Diagnose CPU Scheduling Starvation & Inverted Resource Contention: 1) Verify that the voice processing threads are not blocking on a shared mutex held by backup sync threads (Priority Inversion); 2) If CPU-bound, configure real-time POSIX scheduling policies (<code>SCHED_FIFO</code> or <code>SCHED_RR</code>) for the voice worker threads, giving them strict preemption priority over all <code>SCHED_OTHER</code> CFS tasks; 3) Restrict backup sync using Linux cgroups CPU bandwidth limits (<code>cpu.max</code>).",
        "Buy a faster microphone for voice callers.",
        "Tell customers not to make phone calls during peak hours."
      ],
      "correctOptionIndex": 1,
      "debrief": "Standard CFS scheduling with nice values is designed for fair desktop throughput, not hard real-time latency. Under heavy load, CFS will still give CPU time to nice 0 tasks. Real-time tasks require real-time scheduling classes (SCHED_FIFO/SCHED_RR) or cgroup bandwidth caps on background tasks, coupled with Priority Inheritance mutexes to prevent priority inversion."
    },
    "quests": [
      {
        "id": "Q32.29",
        "name": "OS Process Scheduling & CFS Red-Black Tree Architecture",
        "type": "Concept",
        "desc": "Detail the mathematical architecture of the Linux Completely Fair Scheduler (CFS), virtual runtime calculus, latency targets, and red-black tree task organization."
      },
      {
        "id": "Q32.30",
        "name": "The Priority Inversion Watchdog Crash Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Analyze an embedded system core dump where a watchdog timer fired due to thread starvation; trace the lock dependency chain to prove Priority Inversion."
      },
      {
        "id": "Q32.31",
        "name": "CFS Simulator & Priority Inheritance Mutex Implementation",
        "type": "Mastery Assignment",
        "desc": "Implement a discrete-event OS process scheduler in Python with CFS virtual runtime mechanics, nice-weight scaling, and a Priority Inheritance mutex implementation."
      },
      {
        "id": "Q32.32",
        "name": "Linux Real-Time SCHED_FIFO vs CFS Preemption Lab",
        "type": "Production Incident Lab",
        "desc": "Benchmark task preemption latency under heavy background load comparing <code>SCHED_OTHER</code> with <code>SCHED_FIFO</code>; measure maximum scheduling jitter in microseconds."
      }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "Threads, Concurrency, Race Conditions, Mutexes, Semaphores & Deadlock Coffman Conditions",
    "stageNum": 2,
    "stageName": "Stage 2: Applied Engineering Patterns",
    "pedagogicalRole": "Concurrent Systems Engineering (Threads vs Processes, Race Conditions, Critical Sections, Mutexes, Semaphores & Coffman Deadlock Conditions)",
    "spokenGoal": "Writing single-threaded programs is simple; writing concurrent multithreaded systems that share memory without corrupting data or locking up in deadlocks is the true test of a systems engineer. Today we master concurrency primitives\u2014detecting race conditions, protecting critical sections with mutexes and counting semaphores, and systematically breaking the four Coffman conditions for deadlocks.",
    "conceptInvariant": "Deadlock Coffman Invariant: A deadlock can occur if and only if all four Coffman conditions hold simultaneously (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait); breaking any single condition mathematically eliminates deadlock risk.",
    "failureMode": "The $10M Double-Spend Race Condition: An online crypto exchange processes user withdrawals using concurrent threads. Thread A and Thread B simultaneously check the user's balance ($1,000). Both threads verify the balance is sufficient, both approve a $1,000 withdrawal, and both deduct the balance, allowing the user to withdraw $2,000 from a $1,000 account due to an unprotected Check-Then-Act race condition.",
    "tryItFriction": "Write a multithreaded bank account transfer script in Python with two accounts, and create a deterministic deadlock where Thread 1 transfers A->B while Thread 2 transfers B->A.",
    "socraticHints": [
      "Why does a multi-threaded process share the same heap and code segment while maintaining independent stack frames and registers for each thread?",
      "What is an atomic Check-Then-Act operation, and why do unprotected <code>if (balance >= amount) balance -= amount;</code> blocks fail under concurrent execution?",
      "How does global lock ordering (e.g. always acquiring mutexes in order of ascending account ID) mathematically eliminate the Circular Wait condition?"
    ],
    "situationalPuzzle": {
      "scenario": "A high-performance order routing engine locks up every few days during high market volatility. The thread stack traces show: Thread 1 holds Lock A and is blocked waiting for Lock B. Thread 2 holds Lock B and is blocked waiting for Lock A. The developers propose setting a timeout on lock acquisition to 'fix' the bug.",
      "options": [
        "Add a 5-second timeout on lock acquisitions and retry in an infinite loop.",
        "Enforce Global Strict Lock Ordering Architecture: Timeouts do not fix deadlocks; they merely convert deadlocks into livelocks (where threads repeatedly acquire and release locks without making progress). Break the Coffman Circular Wait condition: establish a strict global lock hierarchy (e.g., sort lock IDs lexicographically before acquisition, ensuring all threads acquire Lock A before Lock B). This guarantees that circular dependency cycles cannot form.",
        "Remove all locks and let threads write simultaneously.",
        "Reboot the server whenever it locks up."
      ],
      "correctOptionIndex": 1,
      "debrief": "Adding lock timeouts is a fragile anti-pattern that often leads to livelocks. The mathematically sound solution to deadlocks is breaking the Circular Wait Coffman condition. By establishing a strict, enforced global lock ordering (e.g., acquiring locks in ascending order of resource IDs), circular wait cycles become mathematically impossible."
    },
    "quests": [
      {
        "id": "Q32.33",
        "name": "Concurrency Primitives & Coffman Deadlock Theory",
        "type": "Concept",
        "desc": "Detail the memory models of threads vs processes, critical sections, mutexes vs semaphores vs condition variables, and the 4 Coffman conditions for deadlocks."
      },
      {
        "id": "Q32.34",
        "name": "The Check-Then-Act Financial Race Condition Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Analyze thread execution traces in a distributed ledger; identify the exact interleaved execution sequence that allowed an account balance to go negative."
      },
      {
        "id": "Q32.35",
        "name": "Deadlock-Free Resource Allocation Graph & Lock Ordering Engine",
        "type": "Mastery Assignment",
        "desc": "Implement a thread-safe resource manager in Python/C that detects cycles in a Resource Allocation Graph (RAG) and automatically enforces global ascending lock ordering."
      },
      {
        "id": "Q32.36",
        "name": "Concurrent Race Condition Stress Test & ThreadSanitizer Lab",
        "type": "Production Incident Lab",
        "desc": "Compile a multi-threaded C application with <code>-fsanitize=thread</code> (TSan); expose hidden data races under a million concurrent operations and resolve them with atomics."
      }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "Milestone 2: ApexOS Multi-Threaded Process Scheduler & Virtual Memory Simulator Review",
    "stageNum": 2,
    "stageName": "Stage 2: Applied Engineering Patterns",
    "pedagogicalRole": "Architectural Milestone Evaluation (Comprehensive Architecture Review & Systems Stress-Testing for OS Process & Memory Management Suite)",
    "spokenGoal": "Today you face the Senior Systems Review Board for Milestone 2. You will present and defend ApexOS\u2014our multi-threaded operating system simulator uniting user/kernel mode transitions, multi-level virtual memory paging, CFS process scheduling, and deadlock-free synchronization primitives. You must prove mathematical rigor, zero race condition hazards, and robust page fault handling under live adversarial scrutiny.",
    "conceptInvariant": "Operating System State Integrity Invariant: An operating system kernel remains sound if and only if user-space memory access faults trap safely without crashing the kernel, and scheduler state transitions preserve process accounting invariants ($Uptime_{kernel} = \\infty \\land Fault_{user} \\implies Kill(Process)$).",
    "failureMode": "The Kernel Panic Null Dereference: A bug in an emulated device driver in ApexOS attempts to read memory address 0x00000000 in Kernel Mode (Ring 0). Because the kernel lacks user-space memory isolation guards, the CPU triggers an unhandled kernel page fault, crashing the entire operating system into a kernel panic.",
    "tryItFriction": "Construct an automated test validating that when an emulated user process attempts to access an unmapped page or write to a read-only code page, ApexOS issues a simulated SIGSEGV and terminates the process while keeping the kernel running.",
    "socraticHints": [
      "How does ApexOS simulate the hardware MMU and translation lookaside buffer (TLB) without relying on host operating system page tables?",
      "What mechanisms prevent priority inversion when emulated threads with varying nice levels compete for simulated mutexes?",
      "Defend your choice of process PCB (Process Control Block) data structure to ensure $O(1)$ state lookups during high-frequency scheduling events."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 2 review, a reviewer injects a test program into ApexOS that creates 10,000 threads and causes them to rapidly allocate 1MB of memory each. The host machine begins slowing down. The reviewer asks: 'How does ApexOS manage memory overcommit and protect physical system RAM from being exhausted by malicious or runaway user processes?'",
      "options": [
        "Allocate all 10GB of RAM immediately and let the host OS crash.",
        "Present the ApexOS Virtual Memory Overcommit & OOM Killer Architecture: 1) Implement Lazy Allocation: Virtual memory pages are assigned addresses in the PCB but physical page frames are only allocated upon first access via demand paging; 2) Enforce strict per-process memory limits (RLIMIT_AS / cgroups memory limits); 3) When simulated physical RAM exhaustion is detected, activate the ApexOS Out-Of-Memory (OOM) Killer, which scores processes based on badness ($oom\\_score = \\text{RAMUsed} - \\text{nice}$) and terminates the largest offender with SIGKILL, preserving system stability.",
        "Delete all processes immediately.",
        "Tell the reviewer that memory overcommit is illegal."
      ],
      "correctOptionIndex": 1,
      "debrief": "Modern operating systems use optimistic memory allocation (overcommit) and demand paging: memory is not physically allocated until written to. To prevent system crashes when physical RAM is exhausted, operating systems implement an Out-Of-Memory (OOM) Killer that evaluates process memory footprints and terminates rogue processes to save the kernel."
    },
    "quests": [
      {
        "id": "Q32.37",
        "name": "ApexOS Systems Architecture Blueprint",
        "type": "Concept",
        "desc": "Author the complete architectural specification for ApexOS, detailing PCB structures, the 4-level page table simulator, CFS process scheduler, and thread synchronization primitives."
      },
      {
        "id": "Q32.38",
        "name": "The Unchecked Kernel Mode Pointer Dereference Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Analyze a kernel crash dump; trace how an unvalidated pointer passed from user space via a system call caused the kernel to read invalid memory and panic."
      },
      {
        "id": "Q32.39",
        "name": "ApexOS Multi-Threaded Process & Memory Simulator Implementation",
        "type": "Mastery Assignment",
        "desc": "Implement the complete ApexOS simulator in Python/TypeScript, featuring demand paging, TLB caching, CFS scheduling with red-black trees, and deadlock-free mutex locks."
      },
      {
        "id": "Q32.40",
        "name": "ApexOS Milestone 2 Viva Defense & Memory Overcommit Lab",
        "type": "Production Incident Lab",
        "desc": "Defend ApexOS before the simulated Review Board while enduring injected memory overcommit storms, circular wait deadlocks, and rogue thread privilege escalation attempts."
      }
    ]
  },
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Storage Architectures: HDDs vs SSDs, NAND Flash Physics, Wear Leveling, TRIM & NVMe Latency",
    "stageNum": 2,
    "stageName": "Stage 2: Applied Engineering Patterns",
    "pedagogicalRole": "Storage Physics & Hardware Architecture (Rotational Media vs Solid State, NAND Flash Cells [SLC/MLC/TLC/QLC], Flash Translation Layer [FTL], Wear Leveling & NVMe)",
    "spokenGoal": "Data persistence requires writing bits to physical storage media. Today we explore the physics of storage architectures\u2014contrasting mechanical hard disk drives (seek times, rotational latency) with solid-state drives (NAND flash cells, program-erase cycles), analyzing the Flash Translation Layer (FTL), understanding wear leveling and TRIM, and measuring the massive throughput leap of NVMe over legacy SATA.",
    "conceptInvariant": "Flash Erasure Invariant: NAND flash memory can read and write data in 4KB/16KB pages, but cannot overwrite in place; an entire 2MB-8MB block must be erased before pages can be rewritten ($Write(Page) \\implies Erase(Block)$).",
    "failureMode": "The Write Amplification SSD Burnout: A database writes millions of 64-byte log updates randomly across an enterprise SSD with TRIM disabled. Because the Flash Translation Layer must constantly read, erase, and rewrite 4MB physical blocks to update tiny 64-byte records, the Write Amplification Factor (WAF) reaches $85\\times$. The drive exhausts its maximum Program-Erase (P/E) cycles in 3 months instead of 5 years, suffering total flash failure.",
    "tryItFriction": "Calculate the Write Amplification Factor (WAF) of an SSD given host write bytes and flash NAND write bytes, and write an append-only sequential log that minimizes WAF to near $1.0$.",
    "socraticHints": [
      "Why do mechanical hard drives suffer a 10-millisecond latency penalty for random seeks, while SSDs access random memory pages in microseconds?",
      "What is the difference between SLC, MLC, TLC, and QLC NAND flash in terms of storage density, latency, and write endurance?",
      "How does the NVMe protocol utilize up to 64,000 parallel submission queues to bypass the single-queue bottleneck of legacy AHCI/SATA?"
    ],
    "situationalPuzzle": {
      "scenario": "A cloud database cluster experiences a steady 70% drop in write throughput over six months of operation. The sysadmin notices that drive write performance was 3,000 MB/s when new, but has degraded to 250 MB/s. Drive capacity is at 95% full. SMART health logs report that TRIM commands are not being sent by the hypervisor.",
      "options": [
        "Defragment the SSD using Windows Disk Defragmenter.",
        "Diagnose Write Amplification & Lack of TRIM Garbage Collection: Because the drive is 95% full and TRIM is disabled, the SSD's Flash Translation Layer (FTL) has no free pre-erased blocks. Every write requires synchronous Garbage Collection (reading valid pages from a dirty block, erasing the multi-megabyte block, and rewriting data), causing write amplification to explode. Enable TRIM at the OS/hypervisor level, allocate 20% over-provisioning space, and trigger manual fstrim.",
        "Pour cold water on the drive to cool down the flash chips.",
        "Replace the SSDs with 5400 RPM mechanical hard drives."
      ],
      "correctOptionIndex": 1,
      "debrief": "NAND flash cannot overwrite data without erasing entire multi-megabyte blocks first. When drives are nearly full and TRIM is disabled, the drive cannot garbage-collect deleted pages ahead of time, forcing every write to wait for slow read-erase-rewrite cycles. Enabling TRIM and maintaining over-provisioned spare capacity restores native NVMe speeds."
    },
    "quests": [
      {
        "id": "Q32.41",
        "name": "Storage Hardware Physics & NAND Flash Architecture",
        "type": "Concept",
        "desc": "Contrast HDD mechanical latency with NAND flash physics, detailing SLC/TLC cell voltage states, P/E cycles, Flash Translation Layer (FTL) wear leveling, and NVMe queueing."
      },
      {
        "id": "Q32.42",
        "name": "The High-WAF Premature SSD Failure Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Analyze SMART telemetry logs from a failed data center SSD array; trace how small random synchronous writes caused a catastrophic Write Amplification Factor of 65x."
      },
      {
        "id": "Q32.43",
        "name": "Flash Translation Layer & Wear-Leveling Simulator Implementation",
        "type": "Mastery Assignment",
        "desc": "Build an FTL simulator in Python that models NAND flash pages and blocks, executes out-of-place writes, calculates Write Amplification Factor, and implements dynamic wear leveling."
      },
      {
        "id": "Q32.44",
        "name": "Sequential vs Random Storage I/O Latency Stress Lab",
        "type": "Production Incident Lab",
        "desc": "Benchmark random 4KB writes vs sequential append writes on SSD storage using <code>fio</code>; measure latency distributions and observe the real-world impact of TRIM."
      }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "File System Internals: Inodes, Superblocks, Directories, Hard vs Soft Links & The VFS",
    "stageNum": 2,
    "stageName": "Stage 2: Applied Engineering Patterns",
    "pedagogicalRole": "Operating System File Systems (Unix Inode Architecture, Superblocks, Directory Trees, Hard vs Symbolic Links & Virtual File System [VFS])",
    "spokenGoal": "Files are an abstraction created by the operating system to organize bytes on raw disk sectors. Today we unpack Unix file system internals\u2014exploring Inodes (metadata, ownership, pointers to data blocks), Superblocks (filesystem metadata and free block maps), how directories are simply files that map names to inode numbers, the crucial difference between hard and soft links, and the Linux Virtual File System (VFS).",
    "conceptInvariant": "Inode Identity Invariant: A file's identity and disk block pointers reside in its Inode, not its directory name; deleting a file's name with <code>rm</code> merely decrements the Inode's link count ($links \\leftarrow links - 1$), and physical blocks are freed only when $links == 0$ and all open file descriptors are closed.",
    "failureMode": "The Hidden Ghost Disk Exhaustion Incident: A web server disk fills to 100% capacity ($0$ bytes free). A junior admin identifies a 100GB log file and runs <code>rm /var/log/nginx/access.log</code>. The <code>df -h</code> command still reports 100% disk usage because the Nginx master process still holds an open file descriptor to the deleted inode. The server crashes upon restart due to unresolved disk exhaustion.",
    "tryItFriction": "Reproduce the 'deleted file still holding disk space' bug using a background Python process holding an open file descriptor, and resolve it using <code>lsof | grep deleted</code>.",
    "socraticHints": [
      "Why does a Hard Link point directly to an Inode number, while a Symbolic Link points to a path string in the directory tree?",
      "What happens when a file system exhausts its Inode table (<code>df -i</code> reaches 100%) even though hundreds of gigabytes of disk space remain available?",
      "How does the Linux Virtual File System (VFS) provide a unified POSIX API (<code>open, read, write</code>) across completely different filesystems (ext4, XFS, NFS, procfs)?"
    ],
    "situationalPuzzle": {
      "scenario": "A mail server reports 'No space left on device' when receiving new emails. The administrator checks <code>df -h</code> and finds that only 15GB of 500GB storage is used (485GB free). The server refuses to create any new files, and automated backups are failing.",
      "options": [
        "Reformat the drive and delete all emails.",
        "Diagnose Inode Exhaustion (<code>df -i</code>): The mail server stores millions of tiny 1KB email text files. The file system ran out of allocated Inode structures ($100\\%$ inode capacity used) even though $97\\%$ of physical disk block storage remains free. Resolve by: 1) Purging directories with millions of orphaned temporary files using <code>find ... -delete</code>; 2) Consolidating micro-files into archive bundles or a database; 3) Re-formatting file systems with a higher inode-to-byte ratio (e.g. <code>mkfs.ext4 -i 4096</code>).",
        "Buy a larger hard drive.",
        "Restart the server and ignore the error."
      ],
      "correctOptionIndex": 1,
      "debrief": "File systems allocate a fixed number of Inodes at format time. Applications that store millions of micro-files (like mail servers or web caches) can exhaust available Inodes long before filling up disk storage blocks. Checking `df -i` reveals inode exhaustion, which requires pruning orphaned files or formatting with smaller inode ratios."
    },
    "quests": [
      {
        "id": "Q32.45",
        "name": "Unix Inode Architecture & VFS Abstraction",
        "type": "Concept",
        "desc": "Detail the Unix file system structure: Superblocks, Inode tables, direct/indirect block pointers, directory dentry caches, and the Virtual File System (VFS) abstraction."
      },
      {
        "id": "Q32.46",
        "name": "The Unreleased Open File Descriptor Ghost Disk Space Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Investigate a production server reporting 100% disk usage despite deleting large log files; use <code>lsof</code> and <code>/proc</code> to identify the unreleased inode and reclaim storage."
      },
      {
        "id": "Q32.47",
        "name": "Inode-Based File System Metadata Explorer & Link Tracker",
        "type": "Mastery Assignment",
        "desc": "Build a Python utility using the <code>os.stat</code> and <code>stat</code> modules that inspects file Inode numbers, device IDs, hard link counts, and traverses directory trees to locate hard link aliases."
      },
      {
        "id": "Q32.48",
        "name": "Inode Table Exhaustion Simulation & Remediation Lab",
        "type": "Production Incident Lab",
        "desc": "Create a virtual loopback filesystem with a small inode pool; write a script that exhausts inodes without consuming storage, observe OS error codes, and execute recovery."
      }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "File System Consistency: Journaling (ext4/NTFS), Copy-on-Write (Btrfs/ZFS) & Crash Recovery",
    "stageNum": 2,
    "stageName": "Stage 2: Applied Engineering Patterns",
    "pedagogicalRole": "Storage Reliability & Crash Consistency (File System Consistency, Journaling Modes [data=journal vs ordered], Copy-on-Write [CoW], Btrfs/ZFS & fsck)",
    "spokenGoal": "What happens to your data if power is cut in the exact microsecond between writing data to disk and updating the directory index? Today we conquer the Crash Consistency Problem\u2014understanding how modern journaling file systems (ext4, NTFS) prevent corruption using Write-Ahead Logging (WAL), contrasting journaling with modern Copy-on-Write (CoW) filesystems (Btrfs, ZFS), and analyzing the mechanics of crash recovery.",
    "conceptInvariant": "Crash Consistency Invariant: A file system update is atomic if and only if journal transaction commit records are flushed to non-volatile storage via hardware write barriers ($flush$) before in-place metadata pointers are updated on disk.",
    "failureMode": "The Power Loss Metadata Inconsistency Catastrophe: A server loses power during a file write. Because the disk controller lied about flushing write caches (caching writes in volatile RAM without a battery backup), the inode table was updated to point to new blocks, but the data blocks were never written. Upon reboot, the file contains uninitialized garbage data from a previously deleted confidential database.",
    "tryItFriction": "Configure an ext4 mount option test comparing <code>data=writeback</code>, <code>data=ordered</code>, and <code>data=journal</code>, and trace the performance versus crash-durability tradeoffs.",
    "socraticHints": [
      "What is the difference between metadata journaling (ordered mode) and full data journaling in ext4?",
      "How does Copy-on-Write (CoW) in ZFS/Btrfs make filesystem snapshots essentially instantaneous and cost-free?",
      "Why did legacy Unix systems require hours to run <code>fsck</code> after a crash, and how does modern journaling reduce reboot recovery time to milliseconds?"
    ],
    "situationalPuzzle": {
      "scenario": "A database administrator notices that an enterprise PostgreSQL database experiences random corruption after power outages, despite having ACID write-ahead logging enabled. Investigation reveals that the ext4 filesystem was mounted with the <code>barrier=0</code> flag to boost benchmark scores.",
      "options": [
        "Blame PostgreSQL and switch to SQLite.",
        "Diagnose Write Barrier Disablement & Cache Reordering: Modern disk controllers reorder writes for performance. The <code>barrier=0</code> mount option disables hardware write flush commands (FLUSH CACHE / FUA). As a result, the filesystem metadata commit was written to disk before the actual transaction data, destroying crash consistency during power loss. Remount the filesystem with write barriers enabled (<code>barrier=1</code>) and ensure enterprise SSDs have Power Loss Protection (PLP) capacitors.",
        "Disable ACID logging in the database to match the filesystem.",
        "Keep a backup generator running continuously."
      ],
      "correctOptionIndex": 1,
      "debrief": "Disabling filesystem write barriers (`barrier=0`) allows disk hardware to reorder writes in volatile drive cache. If power fails, metadata commits can be persisted while data blocks are lost, completely invalidating ACID guarantees. Production storage must always enforce write barriers and utilize drives with Power Loss Protection (PLP)."
    },
    "quests": [
      {
        "id": "Q32.49",
        "name": "Journaling & Copy-on-Write (CoW) Consistency Architecture",
        "type": "Concept",
        "desc": "Detail the mechanics of Write-Ahead Logging (WAL) journaling in ext4/NTFS, compare it with tree-based Copy-on-Write in ZFS/Btrfs, and diagram crash recovery states."
      },
      {
        "id": "Q32.50",
        "name": "The Reordered Write Barrier Corruption Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Investigate a disk image corrupted by an ungraceful shutdown; analyze the journal log to show how missing write barriers allowed committed metadata to point to zero-bytes."
      },
      {
        "id": "Q32.51",
        "name": "Software Write-Ahead Log (WAL) Journaling Engine Implementation",
        "type": "Mastery Assignment",
        "desc": "Build a crash-consistent key-value storage engine in Python that implements Write-Ahead Logging (WAL), atomic commit records, and an automated crash recovery replay procedure."
      },
      {
        "id": "Q32.52",
        "name": "Simulated Power Loss & Journal Replay Recovery Lab",
        "type": "Production Incident Lab",
        "desc": "Simulate abrupt process termination during active file updates; verify that the WAL engine successfully rolls back uncommitted transactions and restores 100% data integrity."
      }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "Input/Output Multiplexing: Polling, Interrupts, DMA & The epoll/kqueue Paradigm",
    "stageNum": 2,
    "stageName": "Stage 2: Applied Engineering Patterns",
    "pedagogicalRole": "Operating System I/O Architecture (I/O Models, Polling vs Hardware Interrupts, Direct Memory Access [DMA] & Scaled Event Multiplexing [select/poll/epoll])",
    "spokenGoal": "How does a modern server handle 1,000,000 concurrent network connections without burning all CPU cycles checking sockets? Today we master Input/Output Multiplexing\u2014tracing the evolution from CPU polling to hardware interrupts, Direct Memory Access (DMA), and the transition from $O(N)$ <code>select()</code> and <code>poll()</code> to $O(1)$ event-driven Linux <code>epoll</code> and BSD <code>kqueue</code>.",
    "conceptInvariant": "I/O Multiplexing Scaling Invariant: Scaled network servers must utilize event-driven I/O readiness notifications ($O(1)$ via <code>epoll_wait</code>); polling $N$ file descriptors sequentially scales as $O(N)$, causing CPU starvation as connection counts increase.",
    "failureMode": "The C10K Select() Performance Cliff: An online chat server uses the classic POSIX <code>select()</code> system call to monitor 10,000 active client connections. For every incoming message, the server must copy a 10,000-element file descriptor set into the kernel and scan all 10,000 sockets sequentially ($O(N)$). CPU usage reaches 100% while handling only 200 messages per second.",
    "tryItFriction": "Benchmark a Python server comparing <code>select.select()</code> vs <code>selectors.DefaultSelector</code> (which uses <code>epoll</code> or <code>kqueue</code>) under 2,000 idle socket connections.",
    "socraticHints": [
      "How does Direct Memory Access (DMA) allow network cards and storage drives to transfer data directly into system RAM without burdening the CPU?",
      "Why is POSIX <code>select()</code> limited to 1024 file descriptors by default, and why does scanning the bitmask scale poorly ($O(N)$)?",
      "How does Linux <code>epoll</code> use an in-kernel Red-Black Tree and a Ready List to deliver true $O(1)$ event notifications when sockets become readable?"
    ],
    "situationalPuzzle": {
      "scenario": "A legacy game server uses a thread-per-connection architecture. When active concurrent players reach 4,000, the server becomes unresponsive. A junior engineer suggests switching to POSIX <code>poll()</code>. The Lead Systems Architect rejects the proposal and mandates <code>epoll</code> with edge-triggered notifications.",
      "options": [
        "Implement <code>poll()</code> because it has a simpler API.",
        "Uphold the Architect's Mandate (The C10K Problem): Both thread-per-connection and <code>poll()</code> suffer severe scalability limits. <code>poll()</code> requires passing the entire array of 4,000 file descriptors into the kernel on every loop iteration ($O(N)$). Linux <code>epoll</code> registers file descriptors once in an in-kernel red-black tree (<code>epoll_ctl</code>); when network packets arrive via DMA, hardware interrupts place active sockets on an in-kernel ready list, allowing <code>epoll_wait</code> to return only the active sockets in $O(1)$ time.",
        "Force players to disconnect after 30 seconds of gameplay.",
        "Increase the server RAM to 1TB."
      ],
      "correctOptionIndex": 1,
      "debrief": "The historic C10K problem proved that thread-per-connection and $O(N)$ polling APIs (select, poll) cannot scale to high connection counts. Linux `epoll` and BSD `kqueue` solve this by maintaining state inside the kernel and notifying user space only of sockets that actually have data ready, achieving $O(1)$ event dispatching."
    },
    "quests": [
      {
        "id": "Q32.53",
        "name": "I/O Models & The Epoll/Kqueue Event-Driven Architecture",
        "type": "Concept",
        "desc": "Detail the architectural evolution of I/O: Hardware Interrupts, DMA controllers, POSIX select/poll bottlenecks, and the in-kernel data structures of Linux epoll (Red-Black tree + Ready List)."
      },
      {
        "id": "Q32.54",
        "name": "The C10K Select File Descriptor Limit Crash Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Investigate a production crash in a legacy C server; trace how exceeding the <code>FD_SETSIZE</code> limit (1024) corrupted the call stack and crashed the process."
      },
      {
        "id": "Q32.55",
        "name": "High-Performance Asynchronous Epoll Socket Server Implementation",
        "type": "Mastery Assignment",
        "desc": "Build an asynchronous TCP echo server in Python/C using low-level <code>epoll</code> with non-blocking sockets, handling connection registration, read readiness, and graceful disconnection."
      },
      {
        "id": "Q32.56",
        "name": "10,000 Concurrent Sockets Epoll vs Select Stress Lab",
        "type": "Production Incident Lab",
        "desc": "Benchmark a test server under 10,000 concurrent persistent connections; measure CPU utilization and latency differences between <code>select()</code> and <code>epoll()</code>."
      }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "Milestone 3: ApexStorage Inode-Based File System & Asynchronous I/O Engine Review",
    "stageNum": 2,
    "stageName": "Stage 2: Applied Engineering Patterns",
    "pedagogicalRole": "Architectural Milestone Evaluation (Comprehensive Architecture Review & Systems Stress-Testing for Storage & Asynchronous I/O Engine)",
    "spokenGoal": "Today you face the Senior Systems Review Board for Milestone 3. You will present and defend ApexStorage\u2014our complete simulated storage and file system platform. ApexStorage integrates NAND flash FTL simulation, an Inode-based file system with superblock allocation, crash-consistent Write-Ahead Logging (WAL) journaling, and an event-driven epoll-style asynchronous I/O multiplexer. Prepare to defend crash durability, lock-free I/O scaling, and flash endurance under adversarial stress testing.",
    "conceptInvariant": "Storage Subsystem Integrity Invariant: A storage engine guarantees persistence if and only if completed write transactions survive unannounced power cut simulations, and directory namespace mutations maintain referential inode integrity ($Corrupt(FS) == 0 \\land DataLoss(Committed) == 0$).",
    "failureMode": "The Corrupted Free Block Map on Crash: During a simulated power loss in ApexStorage, a crash occurs after data blocks are freed but before the superblock free-block bitmap is committed to disk. Upon restart, the file system allocates the same physical blocks to two different files, resulting in catastrophic cross-file data corruption.",
    "tryItFriction": "Construct an automated power-failure injection test that cuts execution at arbitrary instruction boundaries and runs an automated <code>fsck</code> validator on ApexStorage to verify consistency.",
    "socraticHints": [
      "How does ApexStorage resolve the tension between high-throughput in-memory caching and durable on-disk write barriers?",
      "What data structure in ApexStorage prevents directory traversal performance from degrading to $O(N)$ when a single folder contains 500,000 files?",
      "Defend your crash recovery replay ordering when parsing an incomplete WAL journal after an ungraceful shutdown."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 3 defense, a reviewer runs a high-concurrency write test against ApexStorage and cuts the power simulation. Upon reboot, the reviewer inspects the file system and points out: 'Your journal replayed successfully, but file foo.txt has a size of 10MB in the inode, while the actual data blocks contain all zeros. Why did this happen?'",
      "options": [
        "Explain that zero is a mathematically valid number.",
        "Diagnose Metadata-Only Journaling without Data Flushing: ApexStorage was operating in metadata-only journaling mode (similar to <code>data=writeback</code>). The inode metadata was committed to the journal, but the actual file data blocks were still in the volatile write buffer when power was cut. To prevent security leaks (reading uninitialized data) and guarantee integrity, update the write engine to enforce ordered mode (<code>data=ordered</code>) where data blocks are physically flushed via write barriers before metadata commits are written to the journal.",
        "Reformat the drive and pretend the test never happened.",
        "Blame the Python interpreter for generating zeros."
      ],
      "correctOptionIndex": 1,
      "debrief": "In metadata-only journaling, committing metadata before data blocks are flushed leads to files pointing to unwritten sectors containing zeros or stale data after a crash. Robust file systems enforce ordered journaling (`data=ordered`): dirty data blocks must be physically flushed to storage before the journal metadata transaction is finalized."
    },
    "quests": [
      {
        "id": "Q32.57",
        "name": "ApexStorage Complete Systems Architecture Blueprint",
        "type": "Concept",
        "desc": "Author the complete systems specification for ApexStorage, documenting the virtual disk block layer, inode tables, WAL journal format, and epoll-based asynchronous I/O interface."
      },
      {
        "id": "Q32.58",
        "name": "The Double-Allocated Block Inode Cross-Link Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Investigate a corrupted filesystem image; trace how a crash during an inode free operation caused two different files to claim ownership of physical block #4096."
      },
      {
        "id": "Q32.59",
        "name": "ApexStorage Inode File System & WAL Engine Implementation",
        "type": "Mastery Assignment",
        "desc": "Implement the complete ApexStorage platform in Python/TypeScript, featuring simulated block storage, inode allocation, directory dentry hashing, WAL crash recovery, and epoll I/O readiness."
      },
      {
        "id": "Q32.60",
        "name": "ApexStorage Milestone 3 Viva Defense & Power-Cut Chaos Lab",
        "type": "Production Incident Lab",
        "desc": "Defend ApexStorage before the simulated Review Board while enduring injected random power-cut halts, corrupted superblock free maps, and high-concurrency I/O storms."
      }
    ]
  }
]
